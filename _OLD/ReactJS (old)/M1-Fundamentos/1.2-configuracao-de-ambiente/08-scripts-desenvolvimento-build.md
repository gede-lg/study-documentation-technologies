# Scripts de Desenvolvimento e Build: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Scripts de desenvolvimento e build** são comandos automatizados definidos no `package.json` que orquestram processos complexos de desenvolvimento, teste e compilação de aplicações. Conceitualmente, representam a **interface de comando** da aplicação - abstrações que encapsulam sequências de operações complexas em comandos simples e memorizáveis.

Na essência, scripts npm implementam o princípio de **automação declarativa**: ao invés de executar manualmente dezenas de comandos toda vez, você declara processos no `package.json` e executa com `npm run <script>`.

### Contexto Histórico e Motivação

Antes de npm scripts (pré-2010), automação era feita com:
- **Makefiles**: Complexos e específicos de Unix
- **Grunt/Gulp**: Task runners JavaScript verbosos

**npm scripts** (2010+) ofereceram alternativa simples:
- JSON ao invés de código complexo
- Integração nativa com npm
- PATH automático para binários de node_modules

**Motivação**: Simplificar automação, eliminar dependência de task runners externos.

### Problema Fundamental que Resolve

1. **Complexidade de Comandos**: Build moderno envolve múltiplas ferramentas (transpilador, bundler, linter)
2. **Reprodutibilidade**: Garantir que todos executam processos identicamente
3. **Documentação Executável**: Scripts são documentação do que projeto pode fazer
4. **Abstração de Ambiente**: Mesmos comandos funcionam em dev, CI, produção

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Scripts como Interface**: Comandos padronizados (start, build, test)
2. **Lifecycle Hooks**: Scripts automáticos (pre, post)
3. **Composição**: Encadeamento e paralelização de scripts
4. **Environment Variables**: Configuração via variáveis de ambiente
5. **Cross-Platform**: Compatibilidade Windows, Linux, macOS

### Pilares Fundamentais

**Scripts Padrão React**:
- **dev/start**: Inicia servidor de desenvolvimento
- **build**: Compila para produção
- **test**: Executa testes
- **lint**: Verifica qualidade de código
- **format**: Formata código

---

## 🧠 Fundamentos Teóricos

### Scripts Básicos em Projeto React

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src",
    "format": "prettier --write src"
  }
}
```

### Execução de Scripts

```bash
npm run dev       # Executa "vite"
npm run build     # Executa "vite build"
npm test          # Atalho para "npm run test"
npm start         # Atalho para "npm run start"
```

**Scripts especiais** (sem `run`):
- `npm start` = `npm run start`
- `npm test` = `npm run test`
- `npm stop` = `npm run stop`

### Lifecycle Scripts

**Automáticos** - executam em momentos específicos:

```json
{
  "scripts": {
    "preinstall": "echo Antes de install",
    "postinstall": "echo Depois de install",
    "prebuild": "npm run clean",
    "build": "vite build",
    "postbuild": "npm run analyze",
    "prepublishOnly": "npm run build"
  }
}
```

**Ordem de execução** em `npm run build`:
```
1. prebuild  → 2. build  → 3. postbuild
```

**Lifecycle hooks disponíveis**:
- **preinstall** / **postinstall**
- **prepack** / **postpack**
- **prepublish** / **postpublish**
- **preversion** / **postversion**
- **pretest** / **posttest**
- **prestop** / **poststop**
- **prestart** / **poststart**

### Scripts de Desenvolvimento Detalhados

#### npm run dev / npm start

**Propósito**: Iniciar servidor de desenvolvimento com hot reload.

**Vite**:
```json
{
  "scripts": {
    "dev": "vite",
    "start": "vite"  // Alternativa
  }
}
```

**O que faz**:
1. Inicia Vite dev server (porta 5173)
2. Compila código sob demanda (Just-In-Time)
3. Ativa HMR (Hot Module Replacement)
4. Observa mudanças nos arquivos
5. Abre navegador automaticamente (configurável)

**Customizações**:
```json
{
  "scripts": {
    "dev": "vite --port 3000 --open",
    "dev:host": "vite --host",  // Expor em rede local
    "dev:https": "vite --https"  // HTTPS local
  }
}
```

**CRA** (referência):
```json
{
  "scripts": {
    "start": "react-scripts start"
  }
}
```

#### npm run build

**Propósito**: Compilar aplicação para produção.

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

**O que faz**:
1. Define `NODE_ENV=production`
2. Bundlea código com Rollup
3. Minifica JavaScript (esbuild/Terser)
4. Minifica CSS
5. Otimiza imagens
6. Gera hashes de arquivos (cache busting)
7. Code splitting automático
8. Tree shaking (remove código não usado)
9. Gera source maps (opcional)
10. Output em `dist/` ou `build/`

**Build output típico**:
```
dist/
├── assets/
│   ├── index-a1b2c3.js        # Bundle principal (hashed)
│   ├── vendor-d4e5f6.js       # Dependências
│   ├── index-g7h8i9.css       # CSS extraído
│   └── logo-j0k1l2.png        # Assets otimizados
└── index.html                  # HTML com scripts injetados
```

**Customizações**:
```json
{
  "scripts": {
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:analyze": "vite build && vite-bundle-analyzer"
  }
}
```

#### npm run preview

**Propósito**: Testar build de produção localmente.

```json
{
  "scripts": {
    "preview": "vite preview"
  }
}
```

**O que faz**:
1. Serve arquivos de `dist/` estaticamente
2. Simula ambiente de produção
3. Útil para testar antes de deploy

**Fluxo típico**:
```bash
npm run build    # Compila
npm run preview  # Testa build localmente
# Deploy se OK
```

### Scripts de Qualidade de Código

#### npm run test

**Propósito**: Executar testes automatizados.

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

**Modos**:
- **Padrão**: Executa todos os testes uma vez
- **Watch**: Re-executa em mudanças de código
- **Coverage**: Gera relatório de cobertura

**Jest** (alternativa):
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### npm run lint

**Propósito**: Verificar qualidade e estilo de código.

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "lint:css": "stylelint \"src/**/*.css\""
  }
}
```

**O que faz**:
1. Analisa código contra regras ESLint
2. Reporta erros e warnings
3. `--fix`: Corrige problemas automaticamente

#### npm run format

**Propósito**: Formatar código automaticamente.

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css,json}\""
  }
}
```

**Fluxo recomendado**:
```bash
npm run format   # Formata código
npm run lint     # Verifica erros
npm test         # Executa testes
npm run build    # Build se tudo OK
```

### Scripts Utilitários

#### Limpeza

```json
{
  "scripts": {
    "clean": "rm -rf dist node_modules",
    "clean:dist": "rm -rf dist",
    "clean:modules": "rm -rf node_modules"
  }
}
```

**Cross-platform** (Windows compatível):
```bash
npm install --save-dev rimraf
```

```json
{
  "scripts": {
    "clean": "rimraf dist node_modules"
  }
}
```

#### Análise de Bundle

```json
{
  "scripts": {
    "analyze": "vite-bundle-visualizer",
    "build:analyze": "vite build && npm run analyze"
  }
}
```

**Propósito**: Visualizar tamanho de bundles, identificar dependências grandes.

### Composição de Scripts

#### Sequencial (&&)

```json
{
  "scripts": {
    "build": "npm run clean && npm run lint && vite build"
  }
}
```

**Conceito**: Executa comandos em **ordem**. Se um falhar, para.

#### Paralelo

```bash
npm install --save-dev npm-run-all
```

```json
{
  "scripts": {
    "lint:js": "eslint src",
    "lint:css": "stylelint src",
    "lint": "npm-run-all --parallel lint:*"
  }
}
```

**Conceito**: Executa múltiplos scripts **simultaneamente**.

#### Encadeamento Condicional

```json
{
  "scripts": {
    "deploy": "npm run test && npm run build && npm run upload"
  }
}
```

**Lógica**: `test` deve passar → `build` deve suceder → `upload`

### Environment Variables em Scripts

#### Definição

```json
{
  "scripts": {
    "dev": "NODE_ENV=development vite",
    "build": "NODE_ENV=production vite build"
  }
}
```

**Problema**: Não funciona em Windows.

**Solução cross-platform**:
```bash
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development vite",
    "build": "cross-env NODE_ENV=production vite build"
  }
}
```

#### Múltiplos Ambientes

```json
{
  "scripts": {
    "build:dev": "cross-env NODE_ENV=development vite build",
    "build:staging": "cross-env NODE_ENV=staging vite build",
    "build:prod": "cross-env NODE_ENV=production vite build"
  }
}
```

**Uso em código**:
```javascript
if (process.env.NODE_ENV === 'production') {
  // Lógica de produção
}
```

### Scripts Avançados

#### Pre-commit Hooks

```bash
npm install --save-dev husky lint-staged
```

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**`.husky/pre-commit`**:
```bash
#!/bin/sh
npx lint-staged
```

**Conceito**: Antes de cada commit, formata e linta arquivos staged.

#### CI/CD Scripts

```json
{
  "scripts": {
    "ci": "npm ci && npm run lint && npm test && npm run build",
    "ci:coverage": "npm ci && npm run test:coverage && npm run build",
    "deploy:staging": "npm run build:staging && firebase deploy --only hosting:staging",
    "deploy:prod": "npm run build:prod && firebase deploy --only hosting:prod"
  }
}
```

**`npm ci`**: Instalação limpa e determinística (usa package-lock.json exatamente).

---

## 🔍 Análise Conceitual Profunda

### Passagem de Argumentos

```bash
npm run dev -- --port 3001
#           ↑   ↑
#           └─── Separador
#                └─── Argumentos para o script
```

Executa: `vite --port 3001`

### Acesso a Variáveis de package.json

```json
{
  "name": "meu-app",
  "version": "1.0.0",
  "scripts": {
    "info": "echo $npm_package_name@$npm_package_version"
  }
}
```

```bash
npm run info
# Output: meu-app@1.0.0
```

**Variáveis disponíveis**:
- `$npm_package_name`
- `$npm_package_version`
- `$npm_package_description`
- Qualquer campo de package.json

### PATH em npm Scripts

**Automático**: Binários de `node_modules/.bin/` são adicionados ao PATH.

```json
{
  "scripts": {
    "lint": "eslint src"
    // Equivalente a: "./node_modules/.bin/eslint src"
  }
}
```

**Sem npm run**:
```bash
./node_modules/.bin/eslint src
# ou
npx eslint src
```

---

## 🎯 Aplicabilidade e Contextos

### Scripts Mínimos (Projeto Pequeno)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

### Scripts Completos (Projeto Profissional)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .js,.jsx",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css}\"",
    "type-check": "tsc --noEmit",
    "clean": "rimraf dist",
    "analyze": "vite-bundle-visualizer",
    "prepare": "husky install",
    "ci": "npm ci && npm run lint && npm run test:coverage && npm run build"
  }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Armadilha 1: Comandos Específicos de Plataforma

```json
// ❌ ERRADO (não funciona em Windows)
{
  "scripts": {
    "clean": "rm -rf dist"
  }
}
```

```json
// ✅ CORRETO (cross-platform)
{
  "scripts": {
    "clean": "rimraf dist"
  }
}
```

#### Armadilha 2: Esquecer `--` para Argumentos

```bash
# ❌ ERRADO
npm run dev --port 3001
# npm tenta interpretar --port

# ✅ CORRETO
npm run dev -- --port 3001
```

---

## 🔗 Interconexões Conceituais

### Relação com package.json

Scripts são **campo de package.json** - automação declarativa.

### Relação com Build Tools

Scripts **orquestram** ferramentas (Vite, Webpack, Babel, ESLint).

### Relação com CI/CD

Scripts `ci`, `deploy` são usados em pipelines automatizados.

---

## 🚀 Evolução e Próximos Conceitos

### Progressão Natural

**Início**: Scripts básicos (dev, build)
↓
**Crescimento**: Qualidade (lint, test, format)
↓
**Maturidade**: Automação (CI, deploy, pre-commit hooks)

---

## 📚 Conclusão

Scripts npm são **interface de comando** da aplicação - abstraem complexidade, documentam processos, garantem consistência. Dominar scripts é dominar automação e orquestração de ferramentas modernas de desenvolvimento.

**Conceitos duradouros**:
- **Automação declarativa**: Processos como código
- **Lifecycle hooks**: Automação em momentos chave
- **Composição**: Combinar scripts simples em workflows complexos
- **Cross-platform**: Funcionar em qualquer SO
