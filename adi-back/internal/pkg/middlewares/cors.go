package middlewares

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func (md middlewareImpl) Cors(c *gin.Context) {
	if c.Request.Header.Get("origin") != "" {
		c.Writer.Header().Set("Access-Control-Allow-Origin", c.Request.Header.Get("origin"))
	} else {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	}

	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set(
		"Access-Control-Allow-Headers",
		"Content-Type, Content-Length, Accept-Encoding, x-xsrf-token, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With",
	)
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

	if c.Request.Method == "OPTIONS" {
		c.AbortWithStatus(http.StatusNoContent)
		return
	}

	c.Next()
}
