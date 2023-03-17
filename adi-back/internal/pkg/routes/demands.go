package routes

import (
	"adi-back/internal/pkg/controllers"
	"github.com/gin-gonic/gin"
)

func demands(r *gin.Engine) {
	co := controllers.NewDemands()

	base := r.Group("/demands")
	{
		base.GET("", co.Get)
	}
}
