package cmd

import (
	"jd-back/setup"
	"os"
)

func main() {
	setup.Setup()

	run()
}

func run() {
	//db := database.OpenDatabase()

	if len(os.Args) <= 1 {
		//setup.OpenServer(db)
	}

	for _, arg := range os.Args {
		switch arg {
		//case "-cds", "--create-database-structure":
		//	migration.CreateDatabaseStructure(db)
		//	migration.ExecMigrations(db)

		//case "-cm", "--create-migration":
		//	migration.CreateMigrationFile()

		//case "-m", "--migrate":
		//	migration.ExecMigrations(db)

		//case "-mr", "--migrate-and-run":
		//	if pecutils.IsProductionEnvironment() {
		//		migration.ExecMigrations(db)
		//	}
		//
		//	setup.OpenServer(db)
		}
	}
}
