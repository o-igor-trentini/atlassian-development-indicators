package controllers

import (
	"adi-back/internal/pkg/servicerepository/demands"
	"adi-back/third_party/gojira"
	"github.com/gin-gonic/gin"
	"time"
)

type DemandsController interface {
	// GetCreatedVersusResolved busca as issues criadas, resolvidas e pendentes.
	GetCreatedVersusResolved(c *gin.Context)
}

type demandsImpl struct {
	demandsService demands.Service
}

// NewDemands instância o controller das demandas.
func NewDemands(demandsService demands.Service) DemandsController {
	return &demandsImpl{demandsService}
}

func (co demandsImpl) GetCreatedVersusResolved(c *gin.Context) {
	// irá ser recebido por parâmetro
	params := gojira.BuildJQLParams{
		Projects: []string{"PEC"},
		Period: gojira.Period{
			Range: gojira.PeriodRange{
				From:  time.Now().AddDate(0, -2, 0),
				Until: time.Now(),
			},
		},
	}

	response, err := co.demandsService.GetCreatedVersusResolved(params)
	if err != nil {
		c.JSON(400, err)
		return
	}

	c.JSON(200, response)
}
