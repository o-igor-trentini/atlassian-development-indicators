package migration

import (
	"fmt"
	"gorm.io/gorm"
	"jd-back/internal/database/migration/models"
	"jd-back/internal/log/jdlog"
	"jd-back/internal/pkg/jdutils"
	"os"
	"reflect"
	"time"
)

type migrationRun struct {
	Name string
	Run  func(*gorm.DB) error
}

// ExecMigrations busca os arquivos em "internal/database/migration/migrations/*" e os executa.
func ExecMigrations(db *gorm.DB) {
	var migrations []interface{}

	tx := db.Begin()

	for _, migration := range migrations {
		f := reflect.ValueOf(migration)
		result := f.Call(nil)
		function := result[0].Interface().(migrationRun)

		current := models.Migration{
			Name: function.Name,
		}

		if err := db.Where("mi_name", current.Name).First(&current).Error; err != nil && !jdutils.IsGormNotFoundError(err) {
			tx.Rollback()
			jdlog.Logger.DPanic("Erro ao executar migration ["+current.Name+"]", jdlog.MigrationTag())
			return
		}

		if current.ID > 0 {
			jdlog.Logger.Info("Migration ["+current.Name+"] já executada\n", jdlog.MigrationTag())
			continue
		}

		if err := function.Run(db); err != nil {
			tx.Rollback()
			jdlog.Logger.DPanic("Erro ao executar migration ["+current.Name+"]", jdlog.MigrationTag())
			return
		}

		db.Create(&current)
	}

	tx.Commit()
}

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
		jdlog.Logger.Fatal("Não foi possível criar o arquivo de migração", jdlog.MigrationTag())
	}
}
