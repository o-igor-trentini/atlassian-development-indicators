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
	type bindQueryDTO struct {
		gojira.BuildJQLParams
		From  time.Time `form:"from" binding:"required"`
		Until time.Time `form:"until" binding:"required"`
	}

	var (
		dto    bindQueryDTO
		params gojira.BuildJQLParams
	)

	if err := c.ShouldBindQuery(&dto); err != nil {
		c.JSON(422, err)
		return
	}

	params = dto.BuildJQLParams
	params.Period.Range.From = dto.From
	params.Period.Range.Until = dto.Until

	response, err := co.demandsService.GetCreatedVersusResolved(params)
	if err != nil {
		c.JSON(400, err)
		return
	}

	c.JSON(200, response)
}
