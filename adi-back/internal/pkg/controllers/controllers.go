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
		res["errors"] = makeValidationResponse(response.(validator.ValidationErrors), true)

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

	if adiutils.IsDevMode() && response != nil {
		res["cause"] = fmt.Sprintf("%v", response)
	}

	c.AbortWithStatusJSON(statusCode, res)
}

type validationResponseDetails struct {
	Tag      string  `json:"tag"`
	Expected *string `json:"expected,omitempty"`
}

type validationResponse struct {
	Field   string                    `json:"field"`
	Details validationResponseDetails `json:"details"`
}

// makeValidationResponse monta a estrutura dos erros de validações da struct.
func makeValidationResponse(err validator.ValidationErrors, detailed bool) interface{} {
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
	descriptive := func(errs validator.ValidationErrors) []validationResponse {
		var response []validationResponse

		for _, v := range errs {
			var expected *string
			field := v.Field()
			tag := v.ActualTag()

			if v.Param() != "" {
				param := v.Param()
				expected = &param
			}

			response = append(response, validationResponse{
				Field: field,
				Details: validationResponseDetails{
					Tag:      tag,
					Expected: expected,
				},
			})
		}

		return response
	}

	if detailed {
		return descriptive(err)
	}

	return simple(err)
}
