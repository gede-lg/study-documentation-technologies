# additional_contexts

Com certeza, Gedê\! Vamos mergulhar fundo no `additional_contexts` da chave `build` do Docker Compose. Esse é um atributo bastante útil e, por vezes, subestimado, que pode simplificar muito o gerenciamento de dependências externas em seus builds de imagem.

---

## Entendendo `additional_contexts`: Contextos Extras no Build do Docker

### Introdução

Ao trabalhar com Docker, você, como desenvolvedor Backend Java e agora buscando Go, sabe que o processo de **build** de uma imagem é crucial. Geralmente, o Dockerfile reside em um **contexto de build** específico – um diretório cujos arquivos são enviados para o daemon Docker para serem usados durante o build. O que acontece, porém, quando seu build precisa de arquivos ou diretórios que estão **fora** desse contexto principal? É aí que entra o `additional_contexts`.

### Sumário

Nesta explicação detalhada, abordaremos:

- **O que são Contextos de Build no Docker:** Uma revisão rápida do conceito fundamental.
- **O Problema que `additional_contexts` Resolve:** Por que precisamos de contextos adicionais.
- **Propósito e Importância de `additional_contexts`:** Como ele simplifica o build de imagens complexas.
- **Sintaxe Detalhada e Uso Prático:** Exemplos de como definir e utilizar contextos adicionais.
- **Cenários de Restrição ou Não Aplicação:** Quando considerar alternativas.
- **Componentes Chave Associados:** A interação com instruções como `COPY --from`.
- **Melhores Práticas e Padrões de Uso:** Dicas para otimizar seus builds com `additional_contexts`.
- **Exemplo Prático Completo:** Um caso de uso real para ilustrar sua aplicação.

---

### Conceitos Fundamentais

### O Contexto de Build no Docker

Antes de falarmos de "adicionais", precisamos entender o que é um **contexto de build** padrão. Quando você executa um comando como `docker build .` (ou quando o Docker Compose faz isso para você), o `.` no final indica que o **diretório atual** é o contexto de build.

O Docker daemon precisa de todos os arquivos referenciados no Dockerfile (como aqueles usados nas instruções `COPY` ou `ADD`) para construí-lo. Em vez de pegar cada arquivo individualmente, o Docker empacota todo o conteúdo do diretório de contexto (ignorando o que estiver no `.dockerignore`) e o envia para o daemon. Isso garante que o Docker tenha acesso a tudo que precisa.

### O Problema: Recursos Fora do Contexto Principal

Imagine que você tem uma aplicação Go (que você está interessado\!) cujo Dockerfile está na pasta `backend/go-app`. Dentro do Dockerfile, você precisa copiar um arquivo de configuração global que está na raiz do seu projeto (`config/global.yaml`) ou talvez um pacote de utilitários que está em outro diretório (`shared/utils`).

Tradicionalmente, para incluir esses arquivos, você teria algumas opções não ideais:

1. **Mover o Dockerfile para a raiz do projeto:** Isso pode bagunçar a estrutura do seu projeto e complicar a organização.
2. **Copiar os arquivos manualmente:** Antes do build, você teria que copiar os arquivos para dentro do diretório do contexto, o que adiciona etapas manuais ou scripts ao seu processo.
3. **Usar `ADD` com URLs:** Para recursos externos, mas não para arquivos locais.

Nenhuma dessas opções é elegante ou eficiente para gerenciar dependências de build que residem fora do contexto direto do Dockerfile.

### O Propósito e a Importância de `additional_contexts`

O atributo `additional_contexts` foi introduzido no Docker Compose para resolver exatamente esse problema. Ele permite que você especifique **contextos de build adicionais** que o Docker daemon deve ter acesso durante a fase de build de uma imagem. Esses contextos são definidos como pares **nome: caminho**, onde `nome` é um alias que você usa dentro do seu Dockerfile para referenciar esse contexto, e `caminho` é o caminho para o diretório ou arquivo que serve como contexto adicional.

**Importância:**

- **Organização do Código:** Mantém seu Dockerfile e o código da sua aplicação bem organizados, sem a necessidade de mover arquivos ou Dockerfiles para a raiz do projeto.
- **Reuso:** Permite que você defina um contexto com recursos compartilhados (como bibliotecas comuns, arquivos de configuração, scripts de build) e os referencie de múltiplos Dockerfiles em diferentes serviços.
- **Simplificação do Build:** Elimina a necessidade de scripts complexos para pré-processamento de arquivos antes do build.
- **Isolamento:** Cada contexto adicional é tratado como um contexto separado, melhorando a clareza e o isolamento dos recursos necessários para o build.

---

### Sintaxe Detalhada e Uso Prático

O `additional_contexts` é um atributo aninhado sob a chave `build` de um serviço no seu arquivo `docker-compose.yml`.

### Sintaxe Básica

```yaml
version: '3.8'

services:
  meu-servico:
    build:
      context: .  # O contexto principal do build, onde o Dockerfile reside
      dockerfile: Dockerfile
      # Aqui entra o additional_contexts
      additional_contexts:
        # nome_do_contexto: caminho_para_o_contexto
        config_global: ./config/global # Um diretório
        utils_compartilhadas: ../shared/utils # Outro diretório fora do contexto principal
        arquivo_especifico: ./docs/README.md # Um arquivo específico também pode ser um contexto

```

**Explicação dos Componentes:**

- **`additional_contexts`**: A chave principal que define os contextos extras.
- **`nome_do_contexto`**: Um **nome de sua escolha** que será usado para referenciar este contexto dentro do Dockerfile. Este nome se tornará um "stage" virtual no build multi-stage. É crucial que este nome seja único entre os `additional_contexts` e não conflite com nomes de stages reais no seu Dockerfile.
- **`caminho_para_o_contexto`**: O caminho relativo ou absoluto para o diretório ou arquivo que você deseja incluir como contexto adicional.
    - **Diretório:** Se for um diretório, todos os arquivos e subdiretórios dentro dele serão enviados.
    - **Arquivo:** Se for um arquivo, apenas esse arquivo será enviado.
    - **Caminho Relativo:** É sempre relativo ao diretório onde o `docker-compose.yml` está.

### Uso Dentro do Dockerfile

Dentro do seu Dockerfile, você acessa os arquivos desses contextos adicionais usando a sintaxe de `COPY --from=<nome_do_contexto>`.

```
# Dockerfile (localizado, por exemplo, em ./meu-servico/Dockerfile)

# Exemplo de build multi-stage, comum para aplicações Go
FROM golang:1.22 AS builder

WORKDIR /app

# Copiando o código da aplicação do contexto principal
COPY . .

# --- Usando additional_contexts ---

# Copiando um arquivo de configuração de um contexto adicional chamado 'config_global'
# Note que 'config_global' aqui é o nome que demos no docker-compose.yml
# E '/caminho/do/arquivo/no/contexto_adicional.yaml' é o caminho do arquivo
# dentro daquele contexto adicional. Se for um diretório, é o caminho relativo a ele.
COPY --from=config_global config.yaml /app/config/global.yaml

# Copiando um diretório inteiro de outro contexto adicional 'utils_compartilhadas'
COPY --from=utils_compartilhadas src/helpers /app/utils/helpers

# Construindo a aplicação Go
RUN go mod tidy
RUN go build -o main .

# Stage final
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/config/global.yaml ./config/global.yaml # Copiando para a imagem final
EXPOSE 8080
CMD ["./main"]

```

**Importante:** Quando você usa `COPY --from=<nome_do_contexto>`, o `nome_do_contexto` se comporta como um *stage* de build. Isso significa que você pode copiar arquivos de dentro desse contexto adicional para o seu estágio de build atual. A sintaxe de origem (`src`) da instrução `COPY` é então relativa à raiz do `caminho_para_o_contexto` que você definiu no `docker-compose.yml`.

### Exemplo com Múltiplos Contextos

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend # Contexto principal do Dockerfile do backend
      dockerfile: Dockerfile
      additional_contexts:
        # Contexto para o diretório de configurações globais do projeto
        project_configs: ./configs/project
        # Contexto para um pacote compartilhado de utilitários
        shared_libs: ./libs/shared
        # Contexto para a documentação, talvez para um build de documentação
        docs_source: ./docs

  frontend:
    build:
      context: ./frontend # Contexto principal do Dockerfile do frontend
      dockerfile: Dockerfile
      additional_contexts:
        # O frontend também precisa das configurações de projeto, reusando o mesmo contexto
        project_configs: ./configs/project

```

```
# backend/Dockerfile

FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Copia o código do backend do contexto principal
COPY . .

# Copia um arquivo de configuração específico do contexto 'project_configs'
COPY --from=project_configs server.properties /app/config/server.properties

# Copia um pacote de utilitários do contexto 'shared_libs'
COPY --from=shared_libs common-utils.jar /app/libs/common-utils.jar

# ... restante do build do backend ...

FROM openjdk:17-jre-slim
COPY --from=builder /app /app
CMD ["java", "-jar", "/app/my-backend.jar"]

```

```
# frontend/Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

# Copia o código do frontend do contexto principal
COPY . .

# Copia um arquivo de configuração específico do contexto 'project_configs'
# O frontend também pode precisar de algo de 'project_configs'
COPY --from=project_configs client.json /app/config/client.json

# ... restante do build do frontend ...

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

```

Nesse exemplo, tanto o backend quanto o frontend podem acessar os arquivos do diretório `configs/project` sem que esse diretório precise estar dentro de cada contexto de build individual (`./backend` ou `./frontend`).

---

### Cenários de Restrição ou Não Aplicação

Embora `additional_contexts` seja poderoso, existem situações onde ele pode não ser a melhor escolha:

1. **Dependências de Build Simples e Únicas:** Se o seu Dockerfile só precisa de um ou dois arquivos que estão ligeiramente fora do contexto, mas ainda relativamente próximos, e mover o Dockerfile para um nível acima (onde ele cobriria esses arquivos) simplifica mais do que usar um contexto adicional, pode ser preferível.
2. **Dependências de Runtime (Não de Build):** `additional_contexts` é estritamente para o **tempo de build da imagem**. Se você precisa que um arquivo esteja disponível para sua aplicação no **tempo de execução** e esse arquivo não faz parte da imagem, você deve usar [volumes](https://docs.docker.com/storage/volumes/) no seu `docker-compose.yml` para montá-lo.
    - **Exemplo:** Um arquivo de log externo ou uma chave de API que você não quer "commitar" na imagem.
3. **Complexidade Excessiva:** Se você começar a ter uma dezena de `additional_contexts` apontando para lugares muito dispersos, isso pode indicar uma estrutura de projeto desorganizada ou que talvez o controle de versão das suas dependências de build precise de uma abordagem diferente (como um monorepo ou um gerenciador de pacotes).
4. **Imagens Pré-construídas:** Se a dependência que você precisa já está encapsulada em outra imagem Docker que você pode simplesmente usar como base (`FROM`) ou como um estágio de build (`FROM outra_imagem AS meu_stage`), isso geralmente é mais simples do que usar um `additional_contexts` para copiar arquivos dela.

---

### Componentes Chave Associados

O funcionamento de `additional_contexts` está intrinsecamente ligado à instrução `COPY --from`.

- **`COPY --from=<stage_name>`:** Esta instrução é a chave para utilizar os contextos adicionais. O Docker trata cada `nome_do_contexto` definido em `additional_contexts` como um *stage de build* temporário e implícito. Isso permite que você use a mesma sintaxe para copiar arquivos de um contexto adicional como faria para copiar arquivos de um estágio de build multi-stage.
    - **Exemplo:** `COPY --from=my_context src/file.txt /destination/`
        - `my_context`: É o nome que você deu ao contexto adicional no `docker-compose.yml`.
        - `src/file.txt`: É o caminho do arquivo **dentro do diretório** especificado para `my_context` no `docker-compose.yml`.
        - `/destination/`: É o destino dentro do estágio de build atual do seu Dockerfile.

É fundamental entender que o `additional_contexts` não expõe o sistema de arquivos completo do host para o Dockerfile. Ele apenas "empacota" os diretórios/arquivos especificados e os torna disponíveis como "stages" para a instrução `COPY --from`. Isso mantém a segurança e o isolamento dos builds.

---

### Melhores Práticas e Padrões de Uso

1. **Use Nomes Descritivos para Contextos:** Dê nomes claros e autoexplicativos aos seus `additional_contexts` (ex: `global_configs`, `shared_components`, `database_scripts`).
2. **Mantenha os Caminhos Claros:** Use caminhos relativos ao `docker-compose.yml` sempre que possível para facilitar a portabilidade do seu projeto.
3. **`.dockerignore` para Contextos Adicionais:** Assim como o contexto principal, o Docker também aplica regras de `.dockerignore` aos contextos adicionais, se um arquivo `.dockerignore` estiver presente dentro do diretório do contexto adicional. Isso é ótimo para excluir arquivos desnecessários (como `.git`, `node_modules` grandes, etc.) e acelerar o envio de contexto.
4. **Use com Build Multi-Stage:** `additional_contexts` brilha em conjunto com builds multi-stage. Você pode copiar dependências de build de contextos adicionais para um estágio `builder` e, em seguida, apenas os artefatos necessários para o estágio `final`, mantendo suas imagens enxutas.
5. **Evite Contextos Muito Grandes:** Tentar enviar um contexto adicional muito grande (como a raiz de um repositório enorme) pode ser ineficiente e lento. Concentre-se em enviar apenas o que é estritamente necessário para o build.
6. **Pense em Reusabilidade:** Se você tem componentes que são usados por vários serviços no seu Docker Compose (como uma biblioteca de validação, um conjunto de scripts de deploy), `additional_contexts` é uma ótima maneira de centralizá-los e reutilizá-los.

---

### Exemplo Prático Completo: Aplicação Go com Módulos Compartilhados

Vamos imaginar um cenário onde você tem uma aplicação Go (o `backend`), e essa aplicação utiliza um **módulo Go compartilhado** que está em um diretório fora da pasta do seu serviço. Além disso, existe um arquivo de configuração global para o ambiente (`env_config.json`) na raiz do projeto.

```
.
├── docker-compose.yml
├── configs
│   └── env_config.json
├── shared_modules
│   └── go_utils
│       ├── go.mod
│       └── utils.go
└── backend
    ├── Dockerfile
    ├── go.mod
    └── main.go

```

**`configs/env_config.json`:**

```json
{
  "api_url": "<http://api.prod.com>",
  "debug_mode": false
}

```

**`shared_modules/go_utils/go.mod`:**

```
module example.com/go_utils

go 1.22

```

**`shared_modules/go_utils/utils.go`:**

```go
package go_utils

import "fmt"

func Greet(name string) string {
	return fmt.Sprintf("Hello, %s from shared utils!", name)
}

```

**`backend/go.mod`:**

```
module example.com/backend

go 1.22

require example.com/go_utils v0.0.0

replace example.com/go_utils v0.0.0 => ../shared_modules/go_utils

```

**`backend/main.go`:**

```go
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"example.com/go_utils" // Importando o módulo compartilhado
)

func main() {
	// Lendo a configuração do arquivo copiado via additional_contexts
	configPath := "/app/configs/env_config.json"
	data, err := ioutil.ReadFile(configPath)
	if err != nil {
		log.Fatalf("Error reading config file %s: %v", configPath, err)
	}
	fmt.Printf("Config loaded: %s\\n", string(data))

	// Usando o módulo compartilhado
	message := go_utils.Greet("Gedê")
	fmt.Println(message)

	fmt.Println("Backend application running!")

	// Keep the program running to see logs in Docker
	select {}
}

```

**`docker-compose.yml`:**

```yaml
version: '3.8'

services:
  go-backend:
    build:
      context: ./backend # Contexto principal: a pasta do seu serviço Go
      dockerfile: Dockerfile
      additional_contexts:
        # Nome do contexto: 'global_config', caminho: pasta 'configs' na raiz do projeto
        global_config: ./configs
        # Nome do contexto: 'shared_go_modules', caminho: pasta 'shared_modules' na raiz do projeto
        shared_go_modules: ./shared_modules
    ports:
      - "8080:8080" # Apenas para simular, o código acima não expõe porta

```

**`backend/Dockerfile`:**

```
# Estágio de build para compilar a aplicação Go
FROM golang:1.22 AS builder

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o go.mod e go.sum do contexto principal
COPY go.mod go.sum ./

# Copia o módulo Go compartilhado do contexto adicional 'shared_go_modules'
# Note: 'shared_go_modules' é o nome que demos no docker-compose.yml
# e './go_utils' é o caminho relativo dentro do diretório 'shared_modules'
COPY --from=shared_go_modules go_utils ./go_utils

# Copia o restante do código da aplicação Go (main.go, etc.) do contexto principal
COPY . .

# Garante que as dependências do Go (incluindo o módulo compartilhado) sejam resolvidas
# 'replace example.com/go_utils v0.0.0 => ./go_utils' no go.mod do backend
# faz com que o Go localize o módulo compartilhado copiado localmente
RUN go mod tidy

# Constrói o executável da aplicação
RUN go build -o main .

# --- Estágio final para a imagem de produção ---
FROM alpine:latest

# Define o diretório de trabalho
WORKDIR /app

# Copia o executável compilado do estágio 'builder'
COPY --from=builder /app/main .

# Copia o arquivo de configuração global do contexto adicional 'global_config'
# '/env_config.json' é o caminho relativo dentro do diretório './configs'
COPY --from=global_config /env_config.json ./configs/env_config.json

# Define o comando de execução da aplicação
CMD ["./main"]

```

### Como Funciona:

1. **`docker-compose.yml`**: Define dois contextos adicionais:
    - `global_config`: Aponta para a pasta `./configs` do projeto.
    - `shared_go_modules`: Aponta para a pasta `./shared_modules` do projeto.
2. **`backend/Dockerfile`**:
    - No estágio `builder`, a linha `COPY --from=shared_go_modules go_utils ./go_utils` copia o conteúdo da pasta `shared_modules/go_utils` (do contexto adicional `shared_go_modules`) para dentro da pasta `go_utils` no diretório de trabalho `/app` do contêiner. Isso permite que o `go mod tidy` e o `go build` encontrem o módulo compartilhado devido ao `replace` no `go.mod` do backend.
    - No estágio `final`, a linha `COPY --from=global_config /env_config.json ./configs/env_config.json` copia o arquivo `env_config.json` (do contexto adicional `global_config`) para dentro da imagem final.
3. **Execução**: Quando você roda `docker compose up --build`, o Docker Compose envia o contexto principal (`./backend`) e os contextos adicionais (`./configs`, `./shared_modules`) para o daemon Docker, permitindo que o Dockerfile acesse esses recursos durante o build da imagem.

Este exemplo demonstra perfeitamente como `additional_contexts` permite que você gerencie dependências de build que estão espalhadas pelo seu repositório de forma limpa e eficiente, sem a necessidade de reestruturar seu projeto para atender às exigências do Docker.

---

Espero que esta explicação detalhada, Gedê, tenha te dado uma compreensão completa do atributo `additional_contexts` e como ele pode ser uma ferramenta valiosa no seu dia a dia com Docker Compose, especialmente com a sua experiência em Java e interesse em Go\! Se tiver mais alguma pergunta ou quiser explorar outro aspecto, é só me dizer, A.R.I.A está aqui pra ajudar\!