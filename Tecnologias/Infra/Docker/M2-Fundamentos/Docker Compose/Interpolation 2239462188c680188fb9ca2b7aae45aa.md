# Interpolation

**Interpolação em Docker Compose**

---

## Título da Explicação

**Interpolação em Arquivos Docker Compose: Sintaxe, Usos e Boas Práticas**

---

## 1. Introdução

A interpolação em Docker Compose é o processo de substituição de variáveis no momento da leitura do arquivo `docker-compose.yml`, permitindo parametrizar valores e tornar configurações mais flexíveis e reutilizáveis. Essa funcionalidade segue uma sintaxe semelhante à do shell Bash e é aplicada **apenas** aos valores de YAML, não aos nomes de chaves. ([docs.docker.com](https://docs.docker.com/reference/compose-file/interpolation/?utm_source=chatgpt.com))

---

## 2. Sumário

1. [Conceitos Fundamentais](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#conceitos-fundamentais)
2. [Sintaxe Detalhada e Uso Prático](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sintaxe-detalhada-e-uso-pr%C3%A1tico)
3. [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
4. [Componentes Chave Associados](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#componentes-chave-associados)
5. [Melhores Práticas e Padrões de Uso](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
6. [Exemplo Prático Completo](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#exemplo-pr%C3%A1tico-completo)
7. [Sugestões para Aprofundamento](https://chatgpt.com/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sugest%C3%B5es-para-aprofundamento)

---

## 3. Conceitos Fundamentais

- **Variáveis de Ambiente:** São lidas do ambiente do processo ou de arquivos `.env` (quando presentes no diretório do projeto).
- **Interpolação:** Substituição de expressões `${VAR}` ou `$VAR` pelo valor de `VAR`.
- **Pré-processamento:** Antes de mesclar múltiplos arquivos Compose, cada um tem suas variáveis interpoladas individualmente.
- **Escopo:** Aplica-se somente **aos valores** em YAML; para chaves, há sintaxes alternativas que veremos adiante. ([docs.docker.com](https://docs.docker.com/reference/compose-file/interpolation/?utm_source=chatgpt.com))

---

## 4. Sintaxe Detalhada e Uso Prático

### 4.1 Formas Básicas

- **Direta:**
    
    ```yaml
    image: "$IMAGE_NAME"
    
    ```
    
- **Entre chaves (mais recursos):**
    
    ```yaml
    image: "${IMAGE_NAME}"
    
    ```
    

### 4.2 Valores Padrão

- `${VAR:-default}` → se `VAR` estiver **definida** e **não vazia**, usa seu valor; senão, `default`.
- `${VAR-default}` → se `VAR` estiver **definida** (mesmo vazia), usa seu valor; senão, `default`.

```yaml
environment:
  - LOG_LEVEL=${LOG_LEVEL:-info}
``` :contentReference[oaicite:2]{index=2}

### 4.3 Variável Obrigatória
- `${VAR:?erro}` → erro e aborta se `VAR` não estiver **definida** ou estiver **vazia**.
- `${VAR?erro}` → erro se `VAR` não estiver **definida** (mesmo vazia).

```yaml
command: ["sh", "-c", "echo ${REQUIRED_VAR:?Necessário definir REQUIRED_VAR}"]
``` :contentReference[oaicite:3]{index=3}

### 4.4 Valor Alternativo
- `${VAR:+sub}` → `sub` se `VAR` estiver **definida** e **não vazia**; senão, string vazia.
- `${VAR+sub}` → `sub` se `VAR` estiver **definida** (mesmo vazia); senão, string vazia.

### 4.5 Escapando o Dólar
Use `$$` para gerar um `$` literal e evitar interpolação:
```yaml
command: "echo $$HOME"
``` :contentReference[oaicite:4]{index=4}

### 4.6 Interpolação Aninhada
```yaml
build:
  context: ${BUILD_DIR:-${DEFAULT_BUILD_DIR:-./app}}
``` :contentReference[oaicite:5]{index=5}

### 4.7 Limitações
- **Não suportado:** substituições estilo `${VAR/foo/bar}` (substituir texto dentro da variável). :contentReference[oaicite:6]{index=6}
- **Chaves YAML:** não são interpoladas. Para labels, por exemplo, use sintaxe de lista:
  ```yaml
  labels:
    - "${SERVICE_NAME}=web"
  ``` :contentReference[oaicite:7]{index=7}

---

## 5. Cenários de Restrição ou Não Aplicação
- **Chaves de mapa:** só valores são processados; nomes de campos não podem usar variáveis.
- **Interpolação excessiva:** configurações muito dinâmicas perdem clareza; prefira parametrizar apenas o necessário.
- **Variáveis sensíveis:** evite expor segredos sem gestão adequada (use `secrets:`).

---

## 6. Componentes Chave Associados
- **Arquivos `.env`:** carregados automaticamente pelo Compose; ideal para valores de ambiente padrão.
- **CLI Flags `--env-file`:** especifica outros arquivos de variáveis.
- **`environment:`** define variáveis passadas ao contêiner em runtime.
- **`env_file:`** referencia arquivos de pares `KEY=VALUE` a serem adicionados ao ambiente do contêiner.

---

## 7. Melhores Práticas e Padrões de Uso
- **Organização Mínima:** só utilize variáveis onde for realmente necessário.
- **Documentação:** mantenha um `.env.example` para orientar novos desenvolvedores.
- **Defaults Claros:** sempre defina valores padrão (`:-`) para evitar warnings de variáveis não definidas.
- **Validação:** use `${VAR:?mensagem}` para falhar cedo em caso de ausência de variáveis críticas.
- **Segurança:** nunca comite arquivos `.env` com segredos sensíveis no repositório.

---

## 8. Exemplo Prático Completo

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build:
      context: ${BUILD_CONTEXT:-./web}
    image: "${REGISTRY:-localhost:5000}/app:${TAG:-latest}"
    ports:
      - "${WEB_PORT:-8080}:80"
    environment:
      - DATABASE_URL=${DATABASE_URL:?Por favor defina DATABASE_URL}
      - LOG_LEVEL=${LOG_LEVEL:-info}
    command: "sh -c 'echo Starting on port $${WEB_PORT:-8080} && npm start'"

  db:
    image: postgres:${POSTGRES_VERSION:-13}
    env_file:
      - .env.db
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:

```

1. **Build Context:** variável com valor padrão `./web`.
2. **Registro de Imagens:** padrão `localhost:5000`.
3. **Tag da Imagem:** `latest` por default.
4. **Porta e Comando:** interpolação com `$${...}` para exibir `$` literal no `echo`.
5. **Variável Obrigatória:** `DATABASE_URL` – falha se não for definida.
6. **Env File no Serviço de Banco:** `.env.db` (fora do repositório, com credenciais).

---

## 9. Sugestões para Aprofundamento

- Explore [a seção de **Merge**](https://docs.docker.com/compose/compose-file/compose-file-v3/#merge) para entender como a interpolação interage com mesclagem de múltiplos arquivos.
- Consulte [**Profiles**](https://docs.docker.com/compose/profiles/) para condicionar serviços por variáveis de ambiente.
- Pesquise boas práticas de gestão de segredos com `docker secret` e evite expor dados sensíveis em variáveis de ambiente.

---

*Agora você tem um panorama completo da interpolação em Docker Compose: da sintaxe básica aos usos avançados, boas práticas e um exemplo real de uso.*