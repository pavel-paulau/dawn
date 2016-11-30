package main

import (
	"github.com/gin-gonic/gin"
)

var data *dataSource

func getDescriptions(c *gin.Context) {
	descriptions, err := data.getDescriptions()
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	c.IndentedJSON(200, descriptions)
}

func getResults(c *gin.Context) {
	description := c.Query("description")
	title := c.Query("test_title")

	results, err := data.getResults(description, title)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	c.IndentedJSON(200, results)
}

func httpEngine() *gin.Engine {
	data = newDataSource()

	router := gin.Default()

	router.StaticFile("/", "./static/index.html")
	router.Static("/static", "./static")

	v1 := router.Group("/api/v1")
	v1.GET("descriptions", getDescriptions)
	v1.GET("results", getResults)

	return router
}
