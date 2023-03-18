package setup

import (
	"adi-back/internal/log/adilog"
	"adi-back/internal/log/adisentry"
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

	// TODO: Teste de envs

	if err := godotenv.Load(path); err != nil {
		log.Fatalf("erro ao carregar o arquivo de variáveis de ambiente [erro: %s]", err)
	}
}
