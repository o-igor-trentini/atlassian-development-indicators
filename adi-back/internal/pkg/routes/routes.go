package routes

import (
	"adi-back/internal/pkg/integration/gojira"
	"adi-back/internal/pkg/middlewares"
	"adi-back/internal/pkg/servicerepository/demands"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Init inicializar as rotas da aplicação.
func Init(r *gin.Engine, db *gorm.DB) {
	md := middlewares.New()

	r.NoRoute(md.Cors)

	gojiraService := gojira.NewService()
	demandsService := demands.NewService(gojiraService)

	newDemands(r, md, demandsService)
}
