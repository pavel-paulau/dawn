package main

import (
	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode("release")
}

func getDescriptions(c *gin.Context) {}

func getResults(c *gin.Context) {}

func httpEngine() *gin.Engine {
	router := gin.Default()

	v1 := router.Group("/api/v1")
	v1.GET("descriptions", getDescriptions)
	v1.GET("results/:description", getResults)

	return router
}
