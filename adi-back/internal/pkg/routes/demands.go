package routes

import (
	"adi-back/internal/pkg/controllers"
	"adi-back/internal/pkg/servicerepository/demands"
	"github.com/gin-gonic/gin"
)

// newDemands cria os endpoints das demandas.
func newDemands(r *gin.Engine, demandsService demands.Service) {
	co := controllers.NewDemands(demandsService)

	base := r.Group("/demands")
	{
		base.GET("", co.GetCreatedVersusResolved)
	}
}
