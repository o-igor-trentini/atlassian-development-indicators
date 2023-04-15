package routes

import (
	"adi-back/internal/pkg/middlewares"
	"adi-back/internal/pkg/servicerepository/demands"
	"adi-back/third_party/gojira"
	"adi-back/third_party/validators"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// Init inicializar as rotas da aplicação.
func Init(r *gin.Engine, db *gorm.DB) {
	validators.BindingWithJSONTag()

	md := middlewares.New()

	gojiraService := gojira.NewService()
	demandsService := demands.NewService(gojiraService)

	r.NoRoute(md.Cors)
	defaultRouteGroup := r.Group("/api")

	r.GET("/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{}) })

	newDemands(defaultRouteGroup, md, demandsService)
}
