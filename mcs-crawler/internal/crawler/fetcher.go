package crawler

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"
)

type Fetcher struct {
	client      *http.Client
	userAgent   string
	downloadDir string
	rateLimitMs int
	lastRequest time.Time
}

func NewFetcher(userAgent, downloadDir string, rateLimitMs int) *Fetcher {
	os.MkdirAll(downloadDir, os.ModePerm)

	return &Fetcher{
		client: &http.Client{
			Timeout: 30 * time.Second,
			CheckRedirect: func(req *http.Request, via []*http.Request) error {
				if len(via) >= 5 {
					return fmt.Errorf("too many redirects")
				}
				return nil
			},
		},
		userAgent:   userAgent,
		downloadDir: downloadDir,
		rateLimitMs: rateLimitMs,
	}
}

type FetchResult struct {
	Body        []byte
	ContentType string
	StatusCode  int
	FinalURL    string
}

func (f *Fetcher) Fetch(rawURL string) (*FetchResult, error) {
	f.rateLimit()

	req, err := http.NewRequest(http.MethodGet, rawURL, nil)
	if err != nil {
		return nil, fmt.Errorf("request creation failed: %w", err)
	}

	req.Header.Set("User-Agent", f.userAgent)
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/pdf,application/xml;q=0.9,*/*;q=0.8")
	req.Header.Set("Accept-Language", "es-CO,es;q=0.9,en;q=0.8")

	resp, err := f.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetch failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("response read failed: %w", err)
	}

	contentType := resp.Header.Get("Content-Type")
	finalURL := rawURL
	if resp.Request.URL != nil {
		finalURL = resp.Request.URL.String()
	}

	return &FetchResult{
		Body:        body,
		ContentType: contentType,
		StatusCode:  resp.StatusCode,
		FinalURL:    finalURL,
	}, nil
}

func (f *Fetcher) Download(rawURL string) (string, error) {
	result, err := f.Fetch(rawURL)
	if err != nil {
		return "", err
	}

	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}

	fileName := path.Base(parsedURL.Path)
	if fileName == "" || fileName == "." || fileName == "/" {
		fileName = "index.html"
	}

	safeName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), sanitizeFileName(fileName))
	filePath := filepath.Join(f.downloadDir, safeName)

	if err := os.WriteFile(filePath, result.Body, 0644); err != nil {
		return "", fmt.Errorf("cannot save downloaded file: %w", err)
	}

	return filePath, nil
}

func (f *Fetcher) IsDocumentURL(rawURL string) bool {
	ext := strings.ToLower(getExt(rawURL))
	switch ext {
	case ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".json", ".xml", ".txt":
		return true
	}
	return false
}

func (f *Fetcher) GetDocumentType(rawURL string) string {
	ext := strings.ToLower(getExt(rawURL))
	switch ext {
	case ".pdf":
		return "PDF"
	case ".docx", ".doc":
		return "DOCX"
	case ".xlsx", ".xls":
		return "XLSX"
	case ".csv":
		return "CSV"
	case ".json":
		return "JSON"
	case ".xml":
		return "XML"
	case ".txt":
		return "TXT"
	default:
		return "OTHER"
	}
}

func (f *Fetcher) rateLimit() {
	if f.rateLimitMs <= 0 {
		return
	}
	elapsed := time.Since(f.lastRequest)
	wait := time.Duration(f.rateLimitMs)*time.Millisecond - elapsed
	if wait > 0 {
		time.Sleep(wait)
	}
	f.lastRequest = time.Now()
}

func getExt(rawURL string) string {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return ""
	}
	return filepath.Ext(parsed.Path)
}

func sanitizeFileName(name string) string {
	name = strings.ReplaceAll(name, "/", "_")
	name = strings.ReplaceAll(name, "\\", "_")
	name = strings.ReplaceAll(name, " ", "_")
	return name
}
