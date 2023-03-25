package setup

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/pkg/adiutils/uenv"
	"adi-back/internal/services/log/adilog"
	"adi-back/internal/services/log/adisentry"
	"github.com/joho/godotenv"
	"log"
)

// Setup executa funções de configurações essenciais para a aplicação.
func Setup() {
	initEnv("./config/.env")

	if err := adisentry.Init(); err != nil {
		log.Printf("erro ao inicializar o Sentry [erro: %s]", err)
	}

	adilog.Init()
}

// initEnv inicializa o arquivo de variáveis de ambiente.
func initEnv(path string) {
	if err := godotenv.Load(path); err != nil {
		log.Fatalf("erro ao carregar o arquivo de variáveis de ambiente [erro: %s]", err)
	}

	list := []uenv.CheckEnvTable{
		{
			Name:          envconst.AppMode,
			ExpetedValues: []string{"development", "production"},
		},

		{
			Name:          envconst.GinMode,
			ExpetedValues: []string{"debug", "test", "release"},
		},
		{Name: envconst.GinHost},
		{Name: envconst.GinPort},

		{Name: envconst.DatabaseHost},
		{
			Name:          envconst.DatabasePort,
			ExpetedValues: []string{"5432"},
		},
		{Name: envconst.DatabaseUser},
		{Name: envconst.DatabasePassword},
		{Name: envconst.DatabaseName},
		{Name: envconst.DatabaseSchema},

		{
			Name:          envconst.LogLevel,
			ExpetedValues: []string{"debug", "info", "warn", "error", "panic", "dpanic", "fatal"},
		},

		{Name: envconst.SentryDSN},
		{
			Name:          envconst.SentryEnvironment,
			ExpetedValues: []string{"development", "staging", "production"},
		},

		{Name: envconst.JiraApiBaseUrl},
		{Name: envconst.JiraApiUsername},
		{Name: envconst.JiraApiToken},
	}

	if err := uenv.CheckEnvs(list); err != nil {
		log.Fatalf(err.Error())
	}
}
