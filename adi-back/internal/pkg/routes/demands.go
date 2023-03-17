package routes

import (
	"adi-back/internal/pkg/controllers"
	"adi-back/internal/pkg/integration/gojira"
	"github.com/gin-gonic/gin"
)

func demands(r *gin.Engine, gojiraService gojira.Service) {
	co := controllers.NewDemands(gojiraService)

	base := r.Group("/demands")
	{
		base.GET("", co.Get)
	}
}
