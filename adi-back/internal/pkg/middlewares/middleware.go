package middlewares

import "github.com/gin-gonic/gin"

type Middleware interface {
	Cors(c *gin.Context)
}

type middlewareImpl struct {
}

func New() Middleware {
	return &middlewareImpl{}
}
