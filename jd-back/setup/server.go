package setup

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"jd-back/internal/consts/envconst"
	"jd-back/internal/log/jdlog"
	"jd-back/internal/pkg/routes"
	"os"
)

// OpenServer inicializar o servidor.
func OpenServer(db *gorm.DB) {
	gin.SetMode(os.Getenv(envconst.GinMode))

	r := gin.New()
	r.Use(gin.Recovery())

	routes.Init(r, db)

	address := fmt.Sprintf("%s:%s", os.Getenv(envconst.GinHost), os.Getenv(envconst.GinPort))

	if err := r.Run(address); err != nil {
		jdlog.Logger.Fatal("erro ao inicializar o servidor; erro: " + err.Error())
	}
}
