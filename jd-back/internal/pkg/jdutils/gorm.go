package jdutils

import (
	"errors"
	"gorm.io/gorm"
)

// IsGormNotFoundError retorna se o erro é o de "não encontrado"
func IsGormNotFoundError(err error) bool {
	return errors.Is(err, gorm.ErrRecordNotFound)
}
