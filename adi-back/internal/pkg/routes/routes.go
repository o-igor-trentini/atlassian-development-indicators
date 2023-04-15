package routes

import (
	"adi-back/internal/pkg/middlewares"
	"adi-back/internal/pkg/servicerepository/demands"
	"adi-back/third_party/gojira"
	"adi-back/third_party/validators"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Init inicializar as rotas da aplicação.
func Init(r *gin.Engine, db *gorm.DB) {
	validators.BindingWithJSONTag()

	md := middlewares.New()

	gojiraService := gojira.NewService()
	demandsService := demands.NewService(gojiraService)

	r.NoRoute(md.Cors)
	defaultRouteGroup := r.Group("/api")

	newDemands(defaultRouteGroup, md, demandsService)
}
