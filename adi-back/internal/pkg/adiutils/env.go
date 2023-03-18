package adiutils

import (
	"adi-back/internal/consts/envconst"
	"os"
)

// IsDevMode retorna se o modo é de desenvolvimento.
func IsDevMode() bool {
	return os.Getenv(envconst.AppMode) == envconst.AppModeTypeDevevelopment
}

// IsProductionMode retorna se o modo é de produção.
func IsProductionMode() bool {
	return os.Getenv(envconst.AppMode) == envconst.AppModeTypeProduction
}
