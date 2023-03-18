package migration

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/log/adilog"
	"adi-gomodels/pkg/models"
	"gorm.io/gorm"
	"os"
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
