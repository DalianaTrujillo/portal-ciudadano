package repositories

import (
	"mcs-crawler/internal/models"
	"mcs-crawler/pkg/database"

	"gorm.io/gorm"
)

type CrawlerRepository struct {
	db *gorm.DB
}

func NewCrawlerRepository() *CrawlerRepository {
	return &CrawlerRepository{db: database.DB}
}

func (r *CrawlerRepository) GetPageByURL(url string) (*database.CrawlerPage, error) {
	var page database.CrawlerPage
	err := r.db.Where("url = ?", url).First(&page).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &page, nil
}

func (r *CrawlerRepository) CreatePage(page *database.CrawlerPage) error {
	return r.db.Create(page).Error
}

func (r *CrawlerRepository) UpdatePage(page *database.CrawlerPage) error {
	return r.db.Save(page).Error
}

func (r *CrawlerRepository) UpsertPage(page *database.CrawlerPage) (bool, error) {
	existing, err := r.GetPageByURL(page.URL)
	if err != nil {
		return false, err
	}

	if existing == nil {
		if err := r.CreatePage(page); err != nil {
			return false, err
		}
		return true, nil
	}

	if existing.Hash == page.Hash {
		return false, nil
	}

	page.ID = existing.ID
	if err := r.UpdatePage(page); err != nil {
		return false, err
	}
	return false, nil
}

func (r *CrawlerRepository) GetDocumentByPath(path string) (*database.CrawlerDocument, error) {
	var doc database.CrawlerDocument
	err := r.db.Where("path = ?", path).First(&doc).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &doc, nil
}

func (r *CrawlerRepository) CreateDocument(doc *database.CrawlerDocument) error {
	return r.db.Create(doc).Error
}

func (r *CrawlerRepository) CreateDocumentIfNotExists(doc *database.CrawlerDocument) (bool, error) {
	existing, err := r.GetDocumentByPath(doc.Path)
	if err != nil {
		return false, err
	}
	if existing != nil {
		return false, nil
	}
	if err := r.CreateDocument(doc); err != nil {
		return false, err
	}
	return true, nil
}

func (r *CrawlerRepository) CreateLog(logEntry *database.CrawlerLog) error {
	return r.db.Create(logEntry).Error
}

func (r *CrawlerRepository) UpdateLog(logEntry *database.CrawlerLog) error {
	return r.db.Save(logEntry).Error
}

func (r *CrawlerRepository) GetLastLog() (*database.CrawlerLog, error) {
	var logEntry database.CrawlerLog
	err := r.db.Order("id DESC").First(&logEntry).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &logEntry, nil
}

func (r *CrawlerRepository) GetAllLogs(limit int) ([]database.CrawlerLog, error) {
	if limit <= 0 {
		limit = 50
	}
	var logs []database.CrawlerLog
	err := r.db.Order("id DESC").Limit(limit).Find(&logs).Error
	return logs, err
}

func (r *CrawlerRepository) GetAllPages(limit, offset int) ([]models.Page, int64, error) {
	var total int64
	r.db.Model(&database.CrawlerPage{}).Count(&total)

	var pages []models.Page
	err := r.db.Model(&database.CrawlerPage{}).
		Order("id DESC").
		Limit(limit).
		Offset(offset).
		Find(&pages).Error
	return pages, total, err
}

func (r *CrawlerRepository) GetPageCount() (int64, error) {
	var count int64
	err := r.db.Model(&database.CrawlerPage{}).Count(&count).Error
	return count, err
}

func (r *CrawlerRepository) GetDocumentCount() (int64, error) {
	var count int64
	err := r.db.Model(&database.CrawlerDocument{}).Count(&count).Error
	return count, err
}

func (r *CrawlerRepository) GetLogCount() (int64, error) {
	var count int64
	err := r.db.Model(&database.CrawlerLog{}).Count(&count).Error
	return count, err
}

func (r *CrawlerRepository) GetPagesByCategory() (map[string]int64, error) {
	var results []struct {
		Category string
		Count    int64
	}
	err := r.db.Model(&database.CrawlerPage{}).
		Select("category, COUNT(*) as count").
		Group("category").
		Find(&results).Error
	if err != nil {
		return nil, err
	}

	byCategory := make(map[string]int64)
	for _, r := range results {
		if r.Category != "" {
			byCategory[r.Category] = r.Count
		}
	}
	return byCategory, nil
}

func (r *CrawlerRepository) GetPagesByEntity() (map[string]int64, error) {
	var results []struct {
		Entity string
		Count  int64
	}
	err := r.db.Model(&database.CrawlerPage{}).
		Select("entity, COUNT(*) as count").
		Group("entity").
		Find(&results).Error
	if err != nil {
		return nil, err
	}

	byEntity := make(map[string]int64)
	for _, r := range results {
		if r.Entity != "" {
			byEntity[r.Entity] = r.Count
		}
	}
	return byEntity, nil
}

func (r *CrawlerRepository) GetLastCrawlTime() (*database.CrawlerLog, error) {
	var logEntry database.CrawlerLog
	err := r.db.Where("status = ?", "completed").
		Order("crawled_at DESC").
		First(&logEntry).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &logEntry, nil
}

func (r *CrawlerRepository) GetTotalPagesCount() int64 {
	var count int64
	r.db.Model(&database.CrawlerPage{}).Count(&count)
	return count
}
