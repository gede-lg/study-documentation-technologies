# Docker Ignore

# Arquivo `.dockerignore`

## Introdução

O arquivo `.dockerignore` define quais arquivos e diretórios devem ser excluídos do contexto de build ao executar o comando `docker build`. Isso evita copiar arquivos desnecessários para a imagem, reduzindo o tamanho da build, acelerando o processo e melhorando a segurança ao não incluir arquivos sensíveis.

## Sumário

- [Conceitos Fundamentais](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#conceitos-fundamentais)
- [Sintaxe e Padrões de Ignoração](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sintaxe-e-padr%C3%B5es-de-ignora%C3%A7%C3%A3o)
- [Regras de Precedência e Negação](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#regras-de-preced%C3%AAncia-e-nega%C3%A7%C3%A3o)
- [Cenários de Restrição ou Não Aplicação](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#cen%C3%A1rios-de-restri%C3%A7%C3%A3o-ou-n%C3%A3o-aplica%C3%A7%C3%A3o)
- [Componentes Chave Associados](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#componentes-chave-associados)
- [Melhores Práticas e Padrões de Uso](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#melhores-pr%C3%A1ticas-e-padr%C3%B5es-de-uso)
- [Exemplo Prático Completo](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#exemplo-pr%C3%A1tico-completo)
- [Sugestões para Aprofundamento](https://chatgpt.com/g/g-p-68596a64c76c819185e08bdb9bacec85-infra/c/6859817f-01e8-8013-9e5a-cbb14e4c689f#sugest%C3%B5es-para-aprofundamento)

---

## Conceitos Fundamentais

- **Contexto de build:** Conjunto de arquivos e diretórios enviados para o daemon Docker ao iniciar o `docker build`.
- **Ignoração seletiva:** Excluir itens do contexto reduz overhead de I/O e tamanho de imagem.
- **Similaridade com `.gitignore`:** Sintaxe baseada em padrões glob (shell), porém aplicada no build do Docker.

---

## Sintaxe e Padrões de Ignoração

- Cada linha define um padrão de arquivo ou diretório a ser ignorado.
- Comentários iniciam com `#` e linhas em branco são ignoradas.
- **Glob patterns suportados:**
    - : corresponde a qualquer sequência de caracteres (exceto separador `/`).
    - `?`: corresponde a um único caractere.
    - `*`: corresponde a qualquer número de níveis de diretório.
    - `/`: define caminhos relativos ao diretório raiz do contexto.

### Exemplos de padrões

```
# Ignorar diretórios do Node.js
node_modules/

# Ignorar arquivos de build
dist/

# Ignorar arquivos temporários
*.log

# Ignorar todos no subdiretório secret, exceto public
secret/**
!secret/public

```

---

## Regras de Precedência e Negação

1. **Ordem de avaliação**: As regras são aplicadas em ordem de cima para baixo.
2. **Negação com `!`**: Permite re-incluir arquivos previamente ignorados.
3. **Diretórios vs arquivos**: Para negar diretórios, use `!dir/`.
4. **Escopo de caminho absoluto**: Padrões iniciando com `/` correspondem ao diretório raiz do contexto.

---

## Cenários de Restrição ou Não Aplicação

- **Contextos mínimos**: Em projetos simples sem arquivos extras, o `.dockerignore` pode não ser necessário.
- **Ignorar seletivamente**: Use somente para arquivos que realmente impactam o build ou representam riscos de exposição.
- **Envio via STDIN**: Se usar `docker build - < Dockerfile`, o contexto é enviado via stdin, ignorando `.dockerignore`.

---

## Componentes Chave Associados

- **Docker CLI**: Lê `.dockerignore` no diretório onde o `Dockerfile` está localizado.
- **Contexto de build**: Pasta padrão (.) ou `f /path -C /contexto` configurada no comando.
- **Cache de build**: Redução de contexto pode aumentar cache hit rate.

---

## Melhores Práticas e Padrões de Uso

1. **Incluir `.dockerignore` no repositório**: Mantenha-o versionado junto ao `Dockerfile`.
2. **Basear em `.gitignore`**: Inicie copiando padrões de `.gitignore` do projeto.
3. **Evitar expor segredos**: Garanta exclusão de arquivos de credenciais, chaves privadas e tokens.
4. **Testar o contexto**: Use `docker build --no-cache --progress=plain .` para verificar quais arquivos estão sendo enviados.
5. **Atualizar conforme o projeto cresce**: Revise periodicamente para incluir novos padrões.

---

## Exemplo Prático Completo

Conteúdo de `.dockerignore` para um projeto Node.js:

```
# Ignorar dependências locais
node_modules/

# Ignorar builds
build/

# Ignorar arquivos de log e temporários
*.log
npm-debug.log*

# Ignorar configuração local
.env

# Incluir pasta pública de uploads (re-incluir explicitamente)
uploads/**
!uploads/.gitkeep

```

1. Ao executar `docker build .`, o Docker coleta todo o diretório, aplica `.dockerignore` e envia apenas os arquivos restantes.
2. Garante que `node_modules` e `.env` não vazem para o contexto de build.

---

## Sugestões para Aprofundamento

- Documentação oficial Docker: [`.dockerignore`](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
- Artigos comparando `.gitignore` vs `.dockerignore`
- Ferramentas de visualização do contexto de build (ex.: dive)

---

*Documento gerado para explicar detalhadamente o arquivo `.dockerignore`.*