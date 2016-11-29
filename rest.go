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
	description := c.Param("description")

	results, err := data.getResults(description)
	if err != nil {
		c.AbortWithError(500, err)
		return
	}
	c.IndentedJSON(200, results)
}

func httpEngine() *gin.Engine {
	data = newDataSource()

	router := gin.Default()

	v1 := router.Group("/api/v1")
	v1.GET("descriptions", getDescriptions)
	v1.GET("results/:description", getResults)

	return router
}
