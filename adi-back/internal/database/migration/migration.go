package migration

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/log/adilog"
	"adi-back/internal/pkg/adiutils"
	"adi-gomodels/pkg/models"
	"gorm.io/gorm"
	"os"
	"reflect"
)

// CreateDatabaseStructure cria a estrutura do banco.
func CreateDatabaseStructure(db *gorm.DB) {
	handleStepError := func(tx *gorm.DB, message string, err error) {
		if err != nil {
			tx.Rollback()
			adilog.Logger.Fatal(message+" [erro: "+err.Error()+"]", adilog.MigrationTag())
		}
	}

	tx := db.Begin()

	handleStepError(tx, "Não foi possível criar o schema principal", createMainsSchema(tx))
	handleStepError(tx, "Não foi possível criar os enumerators", createEnums(tx))
	handleStepError(tx, "Não foi possível criar as tabelas", createTables(tx))

	tx.Commit()
}

// createMainsSchema cria o esquema do pec-emails caso não exista.
func createMainsSchema(db *gorm.DB) error {
	return db.Exec("CREATE SCHEMA IF NOT EXISTS " + os.Getenv(envconst.DatabaseSchema)).Error
}

// createEnums cria os enumerators caso não existam.
func createEnums(db *gorm.DB) error {
	return nil
}

// createTables cria as tabelas caso não existam.
// Sempre que um model (referente a uma tabela) for criado, ele deve ser referênciado aqui.
func createTables(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Migration{},
	)
}

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

		if err := db.Where("mi_name", current.Name).First(&current).Error; err != nil && !adiutils.IsGormNotFoundError(err) {
			tx.Rollback()
			adilog.Logger.DPanic("Erro ao executar migration ["+current.Name+"]", adilog.MigrationTag())
			return
		}

		if current.ID > 0 {
			adilog.Logger.Info("Migration ["+current.Name+"] já executada", adilog.MigrationTag())
			continue
		}

		if err := function.Run(db); err != nil {
			tx.Rollback()
			adilog.Logger.DPanic("Erro ao executar migration ["+current.Name+"]", adilog.MigrationTag())
			return
		}

		db.Create(&current)
	}

	tx.Commit()
}
