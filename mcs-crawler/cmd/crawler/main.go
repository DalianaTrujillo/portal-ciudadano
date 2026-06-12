package main

import (
	"log"
	"os"

	"mcs-crawler/internal/crawler"
	"mcs-crawler/internal/handlers"
	"mcs-crawler/internal/repositories"
	"mcs-crawler/internal/scheduler"
	"mcs-crawler/pkg/database"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	database.ConnectDB()
	database.AutoMigrate()

	repo := repositories.NewCrawlerRepository()
	crawlerSvc := crawler.NewCrawler(repo)
	crawlerHandler := handlers.NewCrawlerHandler(crawlerSvc, repo)

	sched := scheduler.NewScheduler(crawlerSvc, crawler.DefaultConfig().IntervalHours)
	sched.Start()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	api := r.Group("/api/v1")
	{
		crawlerGroup := api.Group("/crawler")
		{
			crawlerGroup.POST("/start", crawlerHandler.Start)
			crawlerGroup.POST("/reindex", crawlerHandler.Start)
			crawlerGroup.GET("/status", crawlerHandler.Status)
			crawlerGroup.GET("/logs", crawlerHandler.Logs)
			crawlerGroup.GET("/pages", crawlerHandler.Pages)
			crawlerGroup.GET("/stats", crawlerHandler.Stats)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	log.Printf("MCS-CRAWLER running on port %s...", port)
	log.Printf("Crawling from: %s", crawler.DefaultConfig().StartURL)
	log.Printf("Scheduler: every %d hours", crawler.DefaultConfig().IntervalHours)
	log.Printf("Max pages: %d", crawler.DefaultConfig().MaxPages)
	r.Run(":" + port)
}
