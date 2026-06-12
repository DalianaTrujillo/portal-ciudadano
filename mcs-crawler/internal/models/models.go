package models

import "time"

type Page struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"type:varchar(500)" json:"title"`
	URL       string    `gorm:"type:text;not null;uniqueIndex" json:"url"`
	Category  string    `gorm:"type:varchar(255);default:''" json:"category"`
	Content   string    `gorm:"type:text" json:"content"`
	Hash      string    `gorm:"type:varchar(64);default:''" json:"hash"`
	Entity    string    `gorm:"type:varchar(255);default:''" json:"entity"`
	Keywords  string    `gorm:"type:text;default:''" json:"keywords"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (Page) TableName() string { return "crawler_pages" }

type CrawledDocument struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	PageID    uint      `gorm:"index;not null" json:"page_id"`
	Name      string    `gorm:"type:varchar(500);not null" json:"name"`
	Type      string    `gorm:"type:varchar(50);not null" json:"type"`
	Path      string    `gorm:"type:text;not null" json:"path"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (CrawledDocument) TableName() string { return "crawler_documents" }

type CrawlLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	URL       string    `gorm:"type:text;not null" json:"url"`
	Status    string    `gorm:"type:varchar(20);not null;default:'pending'" json:"status"`
	Error     string    `gorm:"type:text;default:''" json:"error,omitempty"`
	PagesFound int      `gorm:"default:0" json:"pages_found"`
	NewPages  int       `gorm:"default:0" json:"new_pages"`
	UpdatedPages int    `gorm:"default:0" json:"updated_pages"`
	DocumentsFound int  `gorm:"default:0" json:"documents_found"`
	CrawledAt time.Time `gorm:"autoCreateTime" json:"crawled_at"`
}

func (CrawlLog) TableName() string { return "crawler_logs" }

type CrawlStatus struct {
	Running       bool      `json:"running"`
	LastRun       *time.Time `json:"last_run"`
	NextRun       *time.Time `json:"next_run"`
	TotalPages    int64     `json:"total_pages"`
	TotalDocs     int64     `json:"total_documents"`
	TotalCrawls   int64     `json:"total_crawls"`
	PagesThisRun  int       `json:"pages_this_run"`
	ErrorsThisRun int       `json:"errors_this_run"`
	StartURL      string    `json:"start_url"`
}

type CrawlerStats struct {
	Pages           int64            `json:"pages"`
	Documents       int64            `json:"documents"`
	Logs            int64            `json:"logs"`
	LastCrawl       *time.Time       `json:"last_crawl"`
	PagesByCategory map[string]int64 `json:"pages_by_category"`
	PagesByEntity   map[string]int64 `json:"pages_by_entity"`
}

type StartCrawlResponse struct {
	Message string `json:"message"`
	LogID   uint   `json:"log_id"`
}

type CrawlConfig struct {
	StartURL         string `json:"start_url"`
	SameDomainOnly   bool   `json:"same_domain_only"`
	MaxPages         int    `json:"max_pages"`
	IntervalHours    int    `json:"interval_hours"`
	RateLimitMs      int    `json:"rate_limit_ms"`
}
