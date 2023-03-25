package setup

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/pkg/routes"
	"adi-back/internal/services/log/adilog"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
		adilog.Logger.Fatal("erro ao inicializar o servidor [erro: " + err.Error() + "]")
	}
}
