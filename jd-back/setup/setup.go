package setup

import (
	"github.com/joho/godotenv"
	"jd-back/internal/log/jdlog"
	"jd-back/internal/log/jdsentry"
	"log"
)

// Setup executa funções de configurações essenciais para a aplicação.
func Setup() {
	initEnv("./config/.env")

	if err := jdsentry.Init(); err != nil {
		log.Printf("erro ao inicializar o Sentry; erro: %s\n", err)
	}

	jdlog.Init()
}

// initEnv inicializa o arquivo de variáveis de ambiente.
func initEnv(path string) {

	// TODO: Teste de envs

	if err := godotenv.Load(path); err != nil {
		log.Fatalf("erro ao carregar o arquivo de variáveis de ambiente; erro: %s", err)
	}
}
