package handlers

import (
	"net/http"
	"strconv"

	"mcs-crawler/internal/models"
	"mcs-crawler/internal/repositories"

	"github.com/gin-gonic/gin"
)

type CrawlerHandler struct {
	crawler CrawlerService
	repo    *repositories.CrawlerRepository
}

type CrawlerService interface {
	Start() (*models.StartCrawlResponse, error)
	IsRunning() bool
	GetStatus() models.CrawlStatus
	GetStats() models.CrawlerStats
	GetConfig() models.CrawlConfig
}

func NewCrawlerHandler(crawler CrawlerService, repo *repositories.CrawlerRepository) *CrawlerHandler {
	return &CrawlerHandler{
		crawler: crawler,
		repo:    repo,
	}
}

func (h *CrawlerHandler) Start(c *gin.Context) {
	if h.crawler.IsRunning() {
		c.JSON(http.StatusConflict, gin.H{"error": "crawl already in progress"})
		return
	}

	resp, err := h.crawler.Start()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *CrawlerHandler) Status(c *gin.Context) {
	status := h.crawler.GetStatus()
	config := h.crawler.GetConfig()

	c.JSON(http.StatusOK, gin.H{
		"status": status,
		"config": config,
	})
}

func (h *CrawlerHandler) Logs(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "50")
	limit, _ := strconv.Atoi(limitStr)

	logs, err := h.repo.GetAllLogs(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"logs":  logs,
		"total": len(logs),
	})
}

func (h *CrawlerHandler) Pages(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "50")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, _ := strconv.Atoi(limitStr)
	offset, _ := strconv.Atoi(offsetStr)

	if limit <= 0 || limit > 200 {
		limit = 50
	}
	if offset < 0 {
		offset = 0
	}

	pages, total, err := h.repo.GetAllPages(limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"pages":  pages,
		"total":  total,
		"limit":  limit,
		"offset": offset,
	})
}

func (h *CrawlerHandler) Stats(c *gin.Context) {
	stats := h.crawler.GetStats()
	c.JSON(http.StatusOK, stats)
}
