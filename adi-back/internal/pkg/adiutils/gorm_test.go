package adiutils_test

import (
	"adi-back/internal/pkg/adiutils"
	"errors"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"testing"
)

func TestIsGormNotFoundError(t *testing.T) {
	type testCase struct {
		name  string
		input error
		want  bool
	}

	testTable := []testCase{
		{
			name:  "Erro de não encontrado do gorm",
			input: gorm.ErrRecordNotFound,
			want:  true,
		},
		{
			name:  "Erro padrão",
			input: errors.New("default error"),
			want:  false,
		},
	}

	for _, test := range testTable {
		actual := adiutils.IsGormNotFoundError(test.input)

		if test.want != actual {
			assert.Equal(t, test.want, actual, test.name)
		}
	}
}
