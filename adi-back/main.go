package main

import (
	"adi-back/internal/database/migration"
	"adi-back/setup"
	"os"
)

func main() {
	setup.Setup()

	run()
}

func run() {
	//db := database.OpenDatabase()

	if len(os.Args) <= 1 {
		setup.OpenServer(nil)
	}

	for _, arg := range os.Args {
		switch arg {
		case "-cds", "--create-database-structure":
			migration.CreateDatabaseStructure(nil)
			migration.ExecMigrations(nil)

		case "-cm", "--create-migration":
			migration.CreateMigrationFile()

		case "-m", "--migrate":
			migration.ExecMigrations(nil)

		case "-mr", "--migrate-and-run":
			migration.ExecMigrations(nil)
			setup.OpenServer(nil)
		}
	}
}
