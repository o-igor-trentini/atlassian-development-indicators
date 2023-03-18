package database

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/log/adilog"
	"adi-back/internal/pkg/adiutils"
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"time"
)

var DB *gorm.DB

// OpenDatabase conecta com o banco de dados.
func OpenDatabase() *gorm.DB {
	host := os.Getenv(envconst.DatabaseHost)
	port := os.Getenv(envconst.DatabasePort)
	user := os.Getenv(envconst.DatabaseUser)
	pass := os.Getenv(envconst.DatabasePassword)
	name := os.Getenv(envconst.DatabaseName)
	schema := os.Getenv(envconst.DatabaseSchema)

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s search_path=%s",
		host,
		user,
		pass,
		name,
		port,
		schema,
	)

	db, err := gorm.Open(
		postgres.Open(dsn),
		getDatabaseConfig(),
	)
	if err != nil {
		adilog.Logger.Fatal("Erro ao conectar no banco de dados principal [erro: " + err.Error() + "]")
	}

	DB = db

	return db
}

// getDatabaseConfig gera a configuração do banco de dados.
func getDatabaseConfig() *gorm.Config {
	var config gorm.Config

	if adiutils.IsProductionMode() {
		return &config
	}

	var levelsMapping = map[string]logger.LogLevel{
		"debug":  logger.Info,
		"info":   logger.Info,
		"warn":   logger.Warn,
		"error":  logger.Error,
		"panic":  logger.Silent,
		"dpanic": logger.Silent,
		"fatal":  logger.Silent,
	}

	config.Logger = logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second,                                 // Slow SQL threshold
			LogLevel:                  levelsMapping[os.Getenv(envconst.LogLevel)], // Log level
			IgnoreRecordNotFoundError: true,                                        // Ignore ErrRecordNotFound error for logger
			Colorful:                  true,                                        // Disable color
		},
	)

	return &config
}
