package controllers

import (
	"adi-back/internal/lib/gojira"
	"github.com/gin-gonic/gin"
)

type DemandsController interface {
	Get(c *gin.Context)
}

type demandsImpl struct {
}

func NewDemands() DemandsController {
	return &demandsImpl{}
}

func (co demandsImpl) Get(c *gin.Context) {
	service := gojira.NewClient()

	jql := "jql=project = PEC AND created >= 2023-03-14 AND created <= 2023-03-16"
	fields := "&fields=created"

	data, err := service.SearchByJQL(jql + fields)
	if err != nil {
		c.JSON(400, gin.H{"erro": err})
		return
	}

	c.JSON(200, data)
}
