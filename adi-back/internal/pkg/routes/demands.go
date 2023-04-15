package routes

import (
	"adi-back/internal/pkg/controllers"
	"adi-back/internal/pkg/middlewares"
	"adi-back/internal/pkg/servicerepository/demands"
	"github.com/gin-gonic/gin"
)

// newDemands cria os endpoints das demandas.
func newDemands(r *gin.RouterGroup, middlewares middlewares.Middleware, demandsService demands.Service) {
	co := controllers.NewDemands(demandsService)

	base := r.Group("/demands", middlewares.Cors)
	{
		base.GET("", co.GetCreatedVersusResolved)
	}
}
