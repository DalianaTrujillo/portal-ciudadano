package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=America/Bogota", host, user, password, dbname, port)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Crawler database connection established")
}

func AutoMigrate() {
	DB.Exec("CREATE EXTENSION IF NOT EXISTS pg_trgm")

	DB.AutoMigrate(
		&CrawlerPage{},
		&CrawlerDocument{},
		&CrawlerLog{},
	)

	DB.Exec(`
		CREATE INDEX IF NOT EXISTS idx_crawler_pages_url ON crawler_pages(url);
		CREATE INDEX IF NOT EXISTS idx_crawler_pages_category ON crawler_pages(category);
		CREATE INDEX IF NOT EXISTS idx_crawler_pages_entity ON crawler_pages(entity);
		CREATE INDEX IF NOT EXISTS idx_crawler_pages_hash ON crawler_pages(hash);
		CREATE INDEX IF NOT EXISTS idx_crawler_pages_content_fts ON crawler_pages USING GIN(to_tsvector('spanish', content));
		CREATE INDEX IF NOT EXISTS idx_crawler_documents_page ON crawler_documents(page_id);
		CREATE INDEX IF NOT EXISTS idx_crawler_logs_status ON crawler_logs(status);
		CREATE INDEX IF NOT EXISTS idx_crawler_logs_crawled ON crawler_logs(crawled_at DESC);
	`)
}

type CrawlerPage struct {
	ID          uint       `gorm:"primaryKey"`
	Title       string     `gorm:"type:varchar(500)"`
	URL         string     `gorm:"type:text;not null;uniqueIndex"`
	Category    string     `gorm:"type:varchar(255);default:''"`
	Content     string     `gorm:"type:text"`
	Hash        string     `gorm:"type:varchar(64);default:''"`
	Entity      string     `gorm:"type:varchar(255);default:''"`
	Keywords    string     `gorm:"type:text;default:''"`
	PublishedAt *time.Time `gorm:"default:null"`
	CreatedAt   time.Time  `gorm:"autoCreateTime"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime"`
}

func (CrawlerPage) TableName() string { return "crawler_pages" }

type CrawlerDocument struct {
	ID     uint   `gorm:"primaryKey"`
	PageID uint   `gorm:"index;not null"`
	Name   string `gorm:"type:varchar(500);not null"`
	Type   string `gorm:"type:varchar(50);not null"`
	Path   string `gorm:"type:text;not null"`
}

func (CrawlerDocument) TableName() string { return "crawler_documents" }

type CrawlerLog struct {
	ID             uint      `gorm:"primaryKey"`
	URL            string    `gorm:"type:text;not null"`
	Status         string    `gorm:"type:varchar(20);not null;default:'pending'"`
	Error          string    `gorm:"type:text;default:''"`
	PagesFound     int       `gorm:"default:0"`
	NewPages       int       `gorm:"default:0"`
	UpdatedPages   int       `gorm:"default:0"`
	DocumentsFound int       `gorm:"default:0"`
	CrawledAt      time.Time `gorm:"autoCreateTime"`
}

func (CrawlerLog) TableName() string { return "crawler_logs" }
