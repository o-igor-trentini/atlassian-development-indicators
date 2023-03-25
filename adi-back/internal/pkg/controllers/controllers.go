package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// respond é um handler de requisições, determinando status code automáticamente.
func respond(c *gin.Context, response interface{}) {
	switch response.(type) {
	case error:
		c.AbortWithStatusJSON(http.StatusBadRequest, response)
		return
	}

	if response == nil {
		c.JSON(http.StatusNoContent, nil)
		return
	}

	c.JSON(200, response)
}
