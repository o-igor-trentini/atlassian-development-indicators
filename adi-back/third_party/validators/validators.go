package validators

import (
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"reflect"
	"strings"
)

// BindingWithJSONTag faz com que ao fazer o "binding" do JSON
// o campo de erro retornado seja a tag JSON ao invés do nome do campo da struct.
func BindingWithJSONTag() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	}
}

// register Adiciona uma validação de 'binding' customizada.
//func register(tag string, validation validator.Func) {
//	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
//		if err := v.RegisterValidation(tag, validation); err != nil {
//			lmlog.ErrorLogger.Printf("[VALIDATORS] Erro ao registrar validação customizada; erro:%s", err)
//		}
//	}
//}
