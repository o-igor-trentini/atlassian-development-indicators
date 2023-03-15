package adiutils

import (
	"adi-back/internal/consts/envconst"
	"os"
)

// IsDevMode retorna se o modo é de desenvolvimento.
func IsDevMode() bool {
	if os.Getenv(envconst.AppMode) == envconst.AppModeTypeDevevelopment {
		return true
	}

	return false
}

// IsProductionMode retorna se o modo é de produção.
func IsProductionMode() bool {
	if os.Getenv(envconst.AppMode) == envconst.AppModeTypeProduction {
		return true
	}

	return false
}
