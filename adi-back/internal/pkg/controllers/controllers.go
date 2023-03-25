package controllers

import (
	"adi-back/internal/pkg/adiutils"
	"adi-back/internal/services/statuscode"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
)

// respond é um handler de requisições, determinando status code automáticamente.
func respond(c *gin.Context, response interface{}) {
	switch response.(type) {
	case error:
		withError(c, response)
		return
	}

	statusCode := http.StatusNoContent
	if response != nil {
		statusCode = http.StatusOK
	}

	c.JSON(statusCode, response)
}

func withError(c *gin.Context, response interface{}) {
	var code statuscode.Code
	var message string
	var cause error
	var statusCode int
	res := make(map[string]interface{})

	switch response.(type) {
	default:
		code = statuscode.CodeUnknown
		message = "Erro desconhecido"
		statusCode = http.StatusBadRequest

	case validator.ValidationErrors:
		code = statuscode.CodeValidation
		message = "As informações enviadas não são válidas"
		statusCode = http.StatusUnprocessableEntity
		res["errors"] = makeValidationErrors(response.(validator.ValidationErrors), true)

	case *json.UnmarshalTypeError:
		marshal := func(jsErr json.UnmarshalTypeError) map[string]string {
			errs := make(map[string]string)
			errs[jsErr.Field] = jsErr.Type.String()

			return errs
		}

		code = statuscode.CodeValidation
		message = "As informações enviadas não são válidas"
		statusCode = http.StatusUnprocessableEntity
		res["errors"] = marshal(*response.(*json.UnmarshalTypeError))
	}

	res["code"] = code
	res["message"] = message

	if adiutils.IsDevMode() && cause != nil {
		res["cause"] = cause.Error()
	}

	c.AbortWithStatusJSON(statusCode, res)
}

type validationErrors struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// makeValidationErrors Monta os erros de validações da struct.
func makeValidationErrors(err validator.ValidationErrors, detailed bool) interface{} {
	// simple Retorna a estrutura de erro de forma simples
	simple := func(vErr validator.ValidationErrors) map[string]string {
		errs := make(map[string]string)

		for _, v := range vErr {
			e := v.ActualTag()

			if v.Param() != "" {
				e = fmt.Sprintf("%s=%s", e, v.Param())
			}

			errs[v.Field()] = e + "," + v.Kind().String()
		}

		return errs
	}

	// descriptive Retorna a estrutura de erro com mais detalhes
	descriptive := func(err validator.ValidationErrors) []validationErrors {
		var errs []validationErrors

		for _, v := range err {
			e := v.ActualTag()

			if v.Param() != "" {
				e = fmt.Sprintf("%s=%s", e, v.Param())
			}

			errs = append(errs, validationErrors{Field: v.Field(), Message: e})
		}

		return errs
	}

	if detailed {
		return descriptive(err)
	}

	return simple(err)
}
