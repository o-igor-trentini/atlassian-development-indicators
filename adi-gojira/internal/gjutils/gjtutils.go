package gjutils

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// BasicAuth gera uma autenticação básica pelo usuário e senha.
func BasicAuth(username, password string) string {
	auth := username + ":" + password
	return base64.StdEncoding.EncodeToString([]byte(auth))
}

// ResBodyToStruct recebe a resposta de uma requisição e converte o body em struct.
func ResBodyToStruct[T any](res *http.Response, dst *T) error {
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return fmt.Errorf("não foi possível ler o corpo da resposta [erro: %w]", err)
	}
	defer res.Body.Close()

	if err := json.Unmarshal(body, &dst); err != nil {
		return fmt.Errorf("não foi possível converter os bytes para objeto [type: %T, erro: %w]", dst, err)
	}

	return nil
}
