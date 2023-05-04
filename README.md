# Atlassian Development Indicators #

### Executar pipelines localmente ###

Caso o repositório esteja no GitHub, é possível utilizar o [act](https://github.com/nektos/act).

#### Instalação ####

Para instalar no Linux, use o seguinte comando:

```bash
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

```

Será apresentado 3 opções de configuração, escolha a `medium`!

#### Execução ####

Todas as pipelines presentes dentro de `.github/workflows/` serão executadas com:

```bash
act
```

Também é possível executar de forma resumida, com o seguinte comando:
```bash
act -n
```
