package routes

import (
	"adi-back/internal/lib/gojira"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Init inicializar as rotas da aplicação.
func Init(r *gin.Engine, db *gorm.DB) {
	handle := func(c *gin.Context) {
		service := gojira.NewClient()

		query := "jql=project%20=%20PEC%20AND%20resolved%20%3E=%202023-03-07%20AND%20resolved%20%3C=%202023-03-31%20ORDER%20BY%20created%20DESC"
		data, err := service.SearchByJQL(query)
		if err != nil {
			c.JSON(400, gin.H{"erro": err})
			return
		}

		c.JSON(200, data)
	}

	r.GET("/test", handle)
}
