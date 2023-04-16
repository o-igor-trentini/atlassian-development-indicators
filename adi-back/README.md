# BACKEND - Atlassian Development Indicators #

- Referência estruturação de pastas: https://github.com/golang-standards/project-layout/blob/master/README_ptBR.md
- Lib de validação: https://github.com/go-playground/validator

### Docker ###

[Clique aqui](https://hub.docker.com/r/igortrentini/it-adi-adi-back/tags) para abrir a imagem no DockerHub.

#### Buildar imagem ####

```bash
docker build -t igortrentini/it-adi-adi-back:latest .
```

#### Subir e rodar o container ####

```bash
docker run --rm -p 8080:8080 it-adi-adi-back:latest
```
