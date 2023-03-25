package migration

import (
	"adi-back/internal/services/log/adilog"
	"fmt"
	"os"
	"time"
)

// CreateMigrationFile gera um arquivo ".go" pronto para escrever uma migration.
func CreateMigrationFile() {
	now := time.Now().Format("2006121545")
	fileName := fmt.Sprintf("migration%s", now)
	fileContent := []byte(fmt.Sprintf(
		`package migration

import "gorm.io/gorm"

func %s() MigrationExecute {
	return MigrationExecute{
		Name: "%s",
		Run: func(db *gorm.DB) error {
			return nil
		},
	}
}
	`,
		fileName,
		fileName,
	))

	if err := os.WriteFile("./internal/database/migration/migrations/"+fileName+".go", fileContent, 0644); err != nil {
		adilog.Logger.Fatal("Não foi possível criar o arquivo de migração", adilog.MigrationTag())
	}
}
