package crawler

import (
	"log"
	"os"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"mcs-crawler/internal/extractors"
	"mcs-crawler/internal/models"
	"mcs-crawler/internal/repositories"
	"mcs-crawler/pkg/database"
)

type Crawler struct {
	repo       *repositories.CrawlerRepository
	fetcher    *Fetcher
	discoverer *Discoverer
	extractor  *extractors.Extractor
	config     Config

	running      atomic.Bool
	currentLogID uint
	pagesThisRun int32
	errorsThisRun int32
	mu           sync.RWMutex
}

type Config struct {
	StartURL       string
	SameDomainOnly bool
	MaxPages       int
	IntervalHours  int
	RateLimitMs    int
	UserAgent      string
	DownloadDir    string
}

func DefaultConfig() Config {
	return Config{
		StartURL:       getEnv("CRAWLER_START_URL", "http://localhost:5173"),
		SameDomainOnly: getEnvBool("CRAWLER_SAME_DOMAIN_ONLY", true),
		MaxPages:       getEnvInt("CRAWLER_MAX_PAGES", 1000),
		IntervalHours:  getEnvInt("CRAWLER_INTERVAL_HOURS", 6),
		RateLimitMs:    getEnvInt("CRAWLER_RATE_LIMIT_MS", 500),
		UserAgent:      getEnv("CRAWLER_USER_AGENT", "MCS-Crawler/1.0"),
		DownloadDir:    getEnv("CRAWLER_DOWNLOAD_DIR", "./downloads"),
	}
}

func NewCrawler(repo *repositories.CrawlerRepository) *Crawler {
	config := DefaultConfig()

	return &Crawler{
		repo:       repo,
		fetcher:    NewFetcher(config.UserAgent, config.DownloadDir, config.RateLimitMs),
		discoverer: NewDiscoverer(config.StartURL, config.SameDomainOnly, config.MaxPages),
		extractor:  extractors.NewExtractor(),
		config:     config,
	}
}

func (c *Crawler) Start() (*models.StartCrawlResponse, error) {
	if c.running.Load() {
		return nil, nil
	}

	c.running.Store(true)
	c.pagesThisRun = 0
	c.errorsThisRun = 0

	logEntry := &database.CrawlerLog{
		URL:    c.config.StartURL,
		Status: "running",
	}
	if err := c.repo.CreateLog(logEntry); err != nil {
		c.running.Store(false)
		return nil, err
	}
	c.currentLogID = logEntry.ID

	go c.run()

	return &models.StartCrawlResponse{
		Message: "Crawl started",
		LogID:   logEntry.ID,
	}, nil
}

func (c *Crawler) run() {
	defer func() {
		c.running.Store(false)
		c.updateLog("completed")
		log.Printf("Crawl completed: %d pages processed, %d errors",
			atomic.LoadInt32(&c.pagesThisRun), atomic.LoadInt32(&c.errorsThisRun))
	}()

	queue := []string{c.config.StartURL}
	visited := make(map[string]bool)
	startTime := time.Now()

	log.Printf("Crawl started from %s (max %d pages, interval %d hours)",
		c.config.StartURL, c.config.MaxPages, c.config.IntervalHours)

	for len(queue) > 0 && len(visited) < c.config.MaxPages {
		currentURL := queue[0]
		queue = queue[1:]

		if visited[currentURL] {
			continue
		}
		visited[currentURL] = true

		if c.fetcher.IsDocumentURL(currentURL) {
			c.processDocument(currentURL)
			continue
		}

		c.processPage(currentURL, &queue)

		if time.Since(startTime) > 30*time.Minute {
			log.Printf("Crawl checkpoint: %d pages visited, %d in queue", len(visited), len(queue))
			startTime = time.Now()
		}
	}
}

func (c *Crawler) processPage(rawURL string, queue *[]string) {
	result, err := c.fetcher.Fetch(rawURL)
	if err != nil {
		log.Printf("Error fetching %s: %v", rawURL, err)
		atomic.AddInt32(&c.errorsThisRun, 1)
		return
	}

	ext, _ := detectContentType(result.ContentType, rawURL)
	if ext != ".html" && ext != ".htm" {
		return
	}

	extraction, err := c.extractor.ExtractFromBytes(result.Body, ext, rawURL)
	if err != nil {
		log.Printf("Error extracting %s: %v", rawURL, err)
		atomic.AddInt32(&c.errorsThisRun, 1)
		return
	}

	normalizedURL := c.discoverer.NormalizeURL(rawURL)
	contentHash := ComputeHash(extraction.Content)

	page := &database.CrawlerPage{
		Title:    extraction.Title,
		URL:      normalizedURL,
		Content:  extraction.Content,
		Hash:     contentHash,
		Category: extraction.Category,
		Entity:   extraction.Entity,
		Keywords: strings.Join(extraction.Keywords, ", "),
	}

	page.PublishedAt = extraction.PublishedAt

	isNew, err := c.repo.UpsertPage(page)
	if err != nil {
		log.Printf("Error saving page %s: %v", normalizedURL, err)
		atomic.AddInt32(&c.errorsThisRun, 1)
		return
	}

	if isNew {
		atomic.AddInt32(&c.pagesThisRun, 1)
	}

	newLinks := c.discoverer.FilterLinks(extraction.Links, normalizedURL)
	*queue = append(*queue, newLinks...)
}

func (c *Crawler) processDocument(rawURL string) {
	docPath, err := c.fetcher.Download(rawURL)
	if err != nil {
		log.Printf("Error downloading document %s: %v", rawURL, err)
		atomic.AddInt32(&c.errorsThisRun, 1)
		return
	}

	docType := c.fetcher.GetDocumentType(rawURL)
	docName := extractFileName(rawURL)

	doc := &database.CrawlerDocument{
		PageID: 0,
		Name:   docName,
		Type:   docType,
		Path:   docPath,
	}

	if _, err := c.repo.CreateDocumentIfNotExists(doc); err != nil {
		log.Printf("Error saving document %s: %v", rawURL, err)
	}
}

func (c *Crawler) updateLog(status string) {
	if c.currentLogID == 0 {
		return
	}

	entry := &database.CrawlerLog{
		Status:         status,
		PagesFound:     int(c.pagesThisRun),
		NewPages:       int(c.pagesThisRun),
		DocumentsFound: 0,
	}
	entry.ID = c.currentLogID
	c.repo.UpdateLog(entry)
}

func (c *Crawler) IsRunning() bool {
	return c.running.Load()
}

func (c *Crawler) GetStatus() models.CrawlStatus {
	lastLog, _ := c.repo.GetLastCrawlTime()
	totalPages := c.repo.GetTotalPagesCount()
	totalDocs, _ := c.repo.GetDocumentCount()
	totalCrawls, _ := c.repo.GetLogCount()

	status := models.CrawlStatus{
		Running:       c.running.Load(),
		StartURL:      c.config.StartURL,
		TotalPages:    totalPages,
		TotalDocs:     totalDocs,
		TotalCrawls:   totalCrawls,
		PagesThisRun:  int(atomic.LoadInt32(&c.pagesThisRun)),
		ErrorsThisRun: int(atomic.LoadInt32(&c.errorsThisRun)),
	}

	if lastLog != nil {
		t := lastLog.CrawledAt
		status.LastRun = &t
		nextRun := t.Add(time.Duration(c.config.IntervalHours) * time.Hour)
		status.NextRun = &nextRun
	}

	return status
}

func (c *Crawler) GetStats() models.CrawlerStats {
	totalPages, _ := c.repo.GetPageCount()
	totalDocs, _ := c.repo.GetDocumentCount()
	totalCrawls, _ := c.repo.GetLogCount()
	lastLog, _ := c.repo.GetLastCrawlTime()
	byCategory, _ := c.repo.GetPagesByCategory()
	byEntity, _ := c.repo.GetPagesByEntity()

	stats := models.CrawlerStats{
		Pages:           totalPages,
		Documents:       totalDocs,
		Logs:            totalCrawls,
		PagesByCategory: byCategory,
		PagesByEntity:   byEntity,
	}

	if lastLog != nil {
		t := lastLog.CrawledAt
		stats.LastCrawl = &t
	}

	return stats
}

func (c *Crawler) GetConfig() models.CrawlConfig {
	return models.CrawlConfig{
		StartURL:       c.config.StartURL,
		SameDomainOnly: c.config.SameDomainOnly,
		MaxPages:       c.config.MaxPages,
		IntervalHours:  c.config.IntervalHours,
		RateLimitMs:    c.config.RateLimitMs,
	}
}

func detectContentType(contentType, rawURL string) (string, bool) {
	ct := strings.ToLower(contentType)
	if strings.Contains(ct, "text/html") {
		return ".html", true
	}
	if strings.Contains(ct, "application/pdf") {
		return ".pdf", true
	}
	if strings.Contains(ct, "text/csv") {
		return ".csv", true
	}
	if strings.Contains(ct, "application/json") {
		return ".json", true
	}

	ext := strings.ToLower(getExt(rawURL))
	return ext, ext != ""
}

func extractFileName(rawURL string) string {
	parts := strings.Split(rawURL, "/")
	return parts[len(parts)-1]
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return defaultVal
}

func getEnvBool(key string, defaultVal bool) bool {
	if val := os.Getenv(key); val != "" {
		return val == "true" || val == "1"
	}
	return defaultVal
}
