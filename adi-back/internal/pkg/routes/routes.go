package routes

import (
	"adi-back/internal/pkg/integration/gojira"
	"adi-back/internal/pkg/middlewares"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Init inicializar as rotas da aplicação.
func Init(r *gin.Engine, db *gorm.DB) {
	md := middlewares.New()

	r.NoRoute(md.Cors)
	r.Group("", md.Cors)

	gojiraService := gojira.NewService()

	demands(r, gojiraService)
}
