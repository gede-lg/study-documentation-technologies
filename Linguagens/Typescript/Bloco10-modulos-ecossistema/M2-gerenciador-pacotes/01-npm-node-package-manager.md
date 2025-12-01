# npm (Node Package Manager): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**npm** (Node Package Manager) é **gerenciador de pacotes oficial** do Node.js que permite descobrir, instalar, compartilhar e gerenciar bibliotecas JavaScript/TypeScript. Conceitualmente, representa **ecossistema centralizado de dependências**, conectando desenvolvedores através de registry público massivo onde código é empacotado, versionado e distribuído.

Na essência, npm materializa o princípio de **dependency management declarativo**, onde você especifica o que precisa (nome e versão) e npm resolve, baixa e instala automaticamente, incluindo dependências transitivas, criando grafo completo de dependências do projeto.

## 📋 Fundamentos

### O Que é npm?

```bash
# npm possui três componentes principais:

# 1. CLI (Command Line Interface) - ferramenta de linha de comando
npm --version  # Verificar versão instalada

# 2. Registry - repositório público (registry.npmjs.org)
# Maior ecossistema de pacotes do mundo (>2 milhões de pacotes)

# 3. Website - npmjs.com para buscar pacotes
```

**Conceito-chave:** npm é **CLI + Registry + Repositório**, permitindo gerenciar dependências de forma declarativa.

### Instalação e Setup

```bash
# npm vem instalado com Node.js
# Verificar instalação
node --version  # v18.x.x
npm --version   # 9.x.x

# Inicializar novo projeto
npm init

# Ou modo rápido (aceita defaults)
npm init -y

# Cria package.json:
# {
#   "name": "meu-projeto",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC"
# }
```

## 🔍 Análise Conceitual

### 1. Registry e Repositório

```bash
# Registry é banco de dados centralizado de pacotes
# Cada pacote tem:
# - Nome único
# - Versões múltiplas
# - Metadados (autor, licença, dependencies)
# - Tarball (.tgz) com código

# Buscar pacote
npm search lodash

# Ver informações de pacote
npm view lodash

# Ver versões disponíveis
npm view lodash versions

# Ver última versão
npm view lodash version
```

**Conceito:** Registry funciona como **"App Store" para código JavaScript**, centralizando distribuição.

### 2. Estrutura de Diretórios

```bash
meu-projeto/
├── node_modules/        # Dependências instaladas (NUNCA commitar)
│   ├── lodash/
│   ├── typescript/
│   └── ...
├── package.json         # Manifesto do projeto
├── package-lock.json    # Lockfile (versões exatas)
└── src/
    └── index.ts

# node_modules:
# - Criado automaticamente por npm install
# - Contém TODAS as dependências (diretas + transitivas)
# - Pode ter milhares de arquivos
# - SEMPRE adicionar ao .gitignore
```

### 3. package.json - Manifesto do Projeto

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "description": "Aplicação TypeScript exemplo",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",

  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest"
  },

  "keywords": ["typescript", "exemplo"],
  "author": "Seu Nome",
  "license": "MIT",

  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },

  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

**Campos importantes:**
- `name`: nome único do pacote
- `version`: versão atual (semver)
- `dependencies`: pacotes necessários em produção
- `devDependencies`: pacotes apenas para desenvolvimento
- `scripts`: comandos customizados
- `main`: ponto de entrada
- `types`: definições TypeScript

### 4. package-lock.json - Lockfile

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "meu-app",
      "version": "1.0.0",
      "dependencies": {
        "express": "^4.18.0"
      }
    },
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-...",
      "dependencies": {
        "accepts": "~1.3.8",
        "body-parser": "1.20.1"
      }
    }
  }
}
```

**Conceito:** Lockfile garante **instalações determinísticas** - mesmas versões exatas em qualquer máquina.

### 5. Comandos Principais

```bash
# Instalar todas as dependências do package.json
npm install
npm i  # Atalho

# Instalar pacote específico
npm install lodash
npm i lodash

# Instalar como devDependency
npm install --save-dev typescript
npm i -D typescript

# Instalar versão específica
npm install lodash@4.17.20

# Desinstalar pacote
npm uninstall lodash
npm un lodash

# Atualizar pacotes
npm update

# Atualizar pacote específico
npm update lodash

# Listar pacotes instalados
npm list
npm ls

# Listar apenas top-level (sem dependências transitivas)
npm ls --depth=0

# Verificar pacotes desatualizados
npm outdated

# Limpar cache
npm cache clean --force

# Executar script do package.json
npm run build
npm run test

# Scripts especiais (não precisam de 'run')
npm start  # executa "start" script
npm test   # executa "test" script
```

## 🎯 Aplicabilidade

### Projeto TypeScript Básico

```bash
# 1. Inicializar projeto
mkdir meu-projeto
cd meu-projeto
npm init -y

# 2. Instalar TypeScript
npm install --save-dev typescript @types/node

# 3. Criar tsconfig.json
npx tsc --init

# 4. Instalar dependências de produção
npm install express
npm install --save-dev @types/express

# 5. Estrutura final
# package.json tem:
# - devDependencies: typescript, @types/*
# - dependencies: express

# 6. Adicionar scripts
# No package.json:
# "scripts": {
#   "build": "tsc",
#   "start": "node dist/index.js",
#   "dev": "ts-node src/index.ts"
# }
```

### Publicar Pacote Próprio

```bash
# 1. Criar conta em npmjs.com

# 2. Login via CLI
npm login

# 3. Preparar package.json
# {
#   "name": "@seu-usuario/seu-pacote",
#   "version": "1.0.0",
#   "main": "dist/index.js",
#   "types": "dist/index.d.ts",
#   "files": ["dist"]
# }

# 4. Build do projeto
npm run build

# 5. Publicar
npm publish --access public

# 6. Atualizar versão
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0

# 7. Publicar nova versão
npm publish
```

### Monorepo com Workspaces

```json
// package.json raiz
{
  "name": "meu-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}

// packages/app/package.json
{
  "name": "@monorepo/app",
  "dependencies": {
    "@monorepo/shared": "*"
  }
}

// packages/shared/package.json
{
  "name": "@monorepo/shared"
}
```

```bash
# Instalar todas as dependências do monorepo
npm install

# Executar script em workspace específico
npm run build --workspace=packages/app

# Executar em todos os workspaces
npm run test --workspaces
```

### CI/CD Integration

```yaml
# .github/workflows/ci.yml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci  # usa package-lock.json (mais rápido e determinístico)

      - name: Build
        run: npm run build

      - name: Test
        run: npm test
```

## ⚠️ Considerações

### 1. npm ci vs npm install

```bash
# npm install
# - Usa package.json como fonte
# - Pode atualizar package-lock.json
# - Mais lento
# - Pode instalar versões diferentes em máquinas diferentes

# npm ci (Clean Install)
# - Usa package-lock.json como fonte
# - Remove node_modules antes de instalar
# - Mais rápido
# - Determinístico
# - Falha se package.json e lock estão out of sync

# ✅ Use em CI/CD
npm ci

# ✅ Use em desenvolvimento local
npm install
```

### 2. Security

```bash
# Verificar vulnerabilidades
npm audit

# Ver detalhes
npm audit --json

# Tentar corrigir automaticamente
npm audit fix

# Forçar correções (pode quebrar compatibilidade)
npm audit fix --force

# Ignorar avisos em produção
npm install --production
```

### 3. Performance

```bash
# Cache para acelerar instalações
~/.npm  # Diretório de cache (Linux/Mac)
%AppData%/npm-cache  # Windows

# Limpar cache
npm cache clean --force

# Usar cache offline (se disponível)
npm install --prefer-offline

# Não salvar em package.json
npm install lodash --no-save
```

### 4. Alternativas ao npm

```bash
# Yarn (Facebook)
yarn install
yarn add lodash

# pnpm (performance + economia de espaço)
pnpm install
pnpm add lodash

# Bun (super rápido, novo)
bun install
bun add lodash
```

## 📚 Conclusão

npm é gerenciador de pacotes oficial do Node.js, composto por CLI, registry público e website. Permite instalar, gerenciar e publicar pacotes JavaScript/TypeScript. package.json define dependências declarativamente, package-lock.json garante instalações determinísticas. Comandos principais: `npm install`, `npm uninstall`, `npm update`. Use `npm ci` em CI/CD, `npm install` em desenvolvimento. Registry npm.org é maior ecossistema de pacotes (>2M). node_modules nunca deve ser commitado. npm audit verifica vulnerabilidades. Alternativas: Yarn, pnpm, Bun.
