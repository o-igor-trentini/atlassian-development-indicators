package setup

import (
	"adi-back/internal/consts/envconst"
	"adi-back/internal/services/log/adilog"
	"adi-back/internal/services/log/adisentry"
	"github.com/joho/godotenv"
	"github.com/o-igor-trentini/adi-goutils/pkg/uenv"
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
			Name:     envconst.AppMode,
			Expected: []string{"development", "production"},
		},

		{
			Name:     envconst.GinMode,
			Expected: []string{"debug", "test", "release"},
		},
		{Name: envconst.GinHost, IgnoreEmpty: true},
		{Name: envconst.GinPort, IgnoreEmpty: true},

		{Name: envconst.DatabaseHost},
		{
			Name:     envconst.DatabasePort,
			Expected: []string{"5432"},
		},
		{Name: envconst.DatabaseUser},
		{Name: envconst.DatabasePassword},
		{Name: envconst.DatabaseName},
		{Name: envconst.DatabaseSchema},

		{
			Name:     envconst.LogLevel,
			Expected: []string{"debug", "info", "warn", "error", "panic", "dpanic", "fatal"},
		},

		{Name: envconst.SentryDSN},
		{
			Name:     envconst.SentryEnvironment,
			Expected: []string{"development", "staging", "production"},
		},

		{Name: envconst.JiraApiBaseUrl},
		{Name: envconst.JiraApiUsername},
		{Name: envconst.JiraApiToken},
	}

	if err := uenv.CheckEnvs(list); err != nil {
		log.Fatalf(err.Error())
	}
}
