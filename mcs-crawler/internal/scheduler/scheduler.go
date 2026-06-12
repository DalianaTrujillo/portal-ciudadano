package scheduler

import (
	"log"
	"time"

	"mcs-crawler/internal/models"
)

type Crawler interface {
	Start() (*models.StartCrawlResponse, error)
	IsRunning() bool
}

type Scheduler struct {
	crawler     Crawler
	interval    time.Duration
	ticker      *time.Ticker
	stopChan    chan struct{}
	running     bool
}

func NewScheduler(crawler Crawler, intervalHours int) *Scheduler {
	return &Scheduler{
		crawler:  crawler,
		interval: time.Duration(intervalHours) * time.Hour,
		stopChan: make(chan struct{}),
	}
}

func (s *Scheduler) Start() {
	if s.running {
		return
	}
	s.running = true

	log.Printf("Scheduler started: crawling every %v", s.interval)

	go s.run()
}

func (s *Scheduler) Stop() {
	if !s.running {
		return
	}
	s.running = false
	close(s.stopChan)
	log.Println("Scheduler stopped")
}

func (s *Scheduler) run() {
	s.executeCrawl()

	s.ticker = time.NewTicker(s.interval)
	defer s.ticker.Stop()

	for {
		select {
		case <-s.ticker.C:
			s.executeCrawl()
		case <-s.stopChan:
			return
		}
	}
}

func (s *Scheduler) executeCrawl() {
	if s.crawler.IsRunning() {
		log.Println("Scheduler: previous crawl still running, skipping")
		return
	}

	log.Println("Scheduler: starting scheduled crawl")
	if _, err := s.crawler.Start(); err != nil {
		log.Printf("Scheduler: crawl failed: %v", err)
	}
}

func (s *Scheduler) IsRunning() bool {
	return s.running
}
