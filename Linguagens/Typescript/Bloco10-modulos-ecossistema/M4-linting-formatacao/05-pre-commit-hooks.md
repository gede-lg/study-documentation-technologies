# Pre-commit Hooks

## 🎯 Introdução e Definição

### Definição Conceitual

**Pre-commit hooks** são **scripts Git** executados **automaticamente antes de commit** para validar código. Diferentemente de validação manual (rodar ESLint/Prettier manualmente antes de commit), pre-commit hooks **garantem validação obrigatória** - commit bloqueado se validação falhar. Implementam **quality gate** - código só entra no repositório se passar validações. Trabalham com **Husky** (gerenciador Git hooks) e **lint-staged** (lint apenas arquivos modificados).

Conceitualmente, pre-commit hooks implementam **automated quality enforcement** - validação automática, não opcional. Seguem **shift-left principle** - detectar problemas antes de commit, não em code review ou CI/CD. Facilitam **fail-fast** - falhar rápido localmente ao invés de descobrir erro em pipeline. Permitem **staged-only linting** - validar apenas arquivos em staging area (performance).

**Fundamento teórico:** Pre-commit hooks derivam de **Git hooks mechanism** - scripts executados em eventos Git (pre-commit, pre-push, commit-msg, etc.). Suportam **conditional execution** - rodar apenas em arquivos relevantes via glob patterns. Permitem **pipeline composition** - encadear múltiplas validações (ESLint → Prettier → Tests). Husky simplifica criação de hooks (vs. escrever manualmente em `.git/hooks/`).

**Pattern básico:**
```json
// package.json - Husky + lint-staged

{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  },
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**Diferença fundamental:**
- **Manual validation:** Desenvolvedor esquece de rodar
- **Pre-commit hooks:** Validação automática obrigatória

### Contexto Histórico e Evolução

**Git inicial (2005):** Hooks manuais.

```bash
# .git/hooks/pre-commit - manual script
#!/bin/sh
npm run lint
```

**Problema:** `.git/` não versionado - cada dev cria manualmente.

**pre-commit framework (Python, 2014):** Framework multi-linguagem.

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    hooks:
      - id: trailing-whitespace
```

**Husky 0.x (2015):** Gerenciador hooks para Node.js.

```json
// package.json - Husky 0.x
{
  "scripts": {
    "precommit": "npm run lint"
  }
}
```

**lint-staged (2016):** Lint apenas arquivos staged.

```json
// package.json - lint-staged
{
  "lint-staged": {
    "*.js": ["eslint --fix", "git add"]
  }
}
```

**Husky 4.x (2019):** Configuração `.huskyrc`.

```json
// .huskyrc
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

**Husky 5+ (2021):** Hooks como shell scripts.

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**lint-staged 13+ (2022):** ESM support.

```javascript
// lint-staged.config.js
export default {
  "*.ts": ["eslint --fix", "prettier --write"]
};
```

**Husky 8+ (2023):** TypeScript support.

```typescript
// husky.config.ts
export default {
  hooks: {
    "pre-commit": "lint-staged"
  }
};
```

**Antes vs Depois:**

**Pré-hooks (commit sem validação):**
```bash
# Commit código com erros ❌
git add .
git commit -m "Add feature"

# Descobre erros em CI/CD (tarde demais)
```

**Pós-hooks (validação automática):**
```bash
# Commit bloqueado se falhar ✅
git add .
git commit -m "Add feature"

# Pre-commit hook executa
# ✗ ESLint failed - commit bloqueado
# Corrige localmente antes de commit
```

**Evolução Husky:**

**Husky 4 (.huskyrc):**
```json
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

**Husky 8 (shell scripts):**
```bash
# .husky/pre-commit
npx lint-staged
```

### Problema Fundamental que Resolve

Pre-commit hooks resolvem problemas de **forgotten validation**, **CI/CD waste**, e **inconsistent code quality**.

**Problema 1: Validação esquecida**
```typescript
// Desenvolvedor esquece de rodar ESLint ❌

// Escrever código com erros
function calc(x: any) {
  console.log(x)
  return x + 1
}

// Commit sem validar
git add src/calc.ts
git commit -m "Add calc function"

// Push para repositório
git push

// CI/CD roda ESLint
// ✗ Error: @typescript-eslint/no-explicit-any
// ✗ Error: no-console
// ✗ Error: Missing semicolons

// Build falha
// Pull request bloqueado
// Code review perdido (tempo desperdiçado)
```

**Solução: Pre-commit hook valida automaticamente**
```bash
# Pre-commit hook configurado ✅

# Tentar commit
git add src/calc.ts
git commit -m "Add calc function"

# Pre-commit hook executa automaticamente
# Running lint-staged...
# ✗ ESLint: 3 errors
#   @typescript-eslint/no-explicit-any
#   no-console
#   semi

# Commit bloqueado ✅
# Corrige localmente

function calc(x: number): number {
  return x + 1;
}

# Commit novamente
git commit -m "Add calc function"

# ✓ Pre-commit passed
# [main abc1234] Add calc function
```

**Problema 2: CI/CD desperdiçado**
```bash
# Sem pre-commit hooks - descobrir erros em CI/CD ❌

# 1. Commit código com erros
git commit -m "Add feature"

# 2. Push para repositório
git push

# 3. CI/CD pipeline inicia (2-5 minutos)
# - Checkout
# - Install dependencies
# - Build
# - Lint

# 4. Lint falha (após 3 minutos)
# ✗ ESLint failed

# 5. Pull request bloqueado
# 6. Corrigir localmente
# 7. Push novamente
# 8. CI/CD roda novamente (mais 3 minutos)

# Total: 6+ minutos desperdiçados
# CI/CD resources desperdiçados
```

**Solução: Pre-commit valida antes de push**
```bash
# Com pre-commit hooks - validação local ✅

# 1. Commit código
git commit -m "Add feature"

# 2. Pre-commit hook executa (5 segundos)
# ✗ ESLint failed

# 3. Commit bloqueado
# 4. Corrige imediatamente
# 5. Commit novamente (5 segundos)
# ✓ Pre-commit passed

# 6. Push para repositório
git push

# 7. CI/CD roda (código já validado)
# ✓ Lint passed

# Total: 10 segundos localmente
# CI/CD roda apenas código válido
# Economia de tempo e recursos ✅
```

**Problema 3: Formatação inconsistente**
```typescript
// Sem pre-commit hooks - formatação manual ❌

// Dev A - usa Prettier
const name = "John";
const age = 30;

// Dev B - não usa Prettier
const city='NYC'
const country  =  "USA"

// Code review
// "Por favor, formatá código"
// Tempo desperdiçado com formatação
```

**Solução: Pre-commit formata automaticamente**
```bash
# Com pre-commit + Prettier ✅

# Dev B commit código não formatado
const city='NYC'

# Pre-commit hook executa
# Running lint-staged...
# ✓ Prettier --write

# Código formatado automaticamente
const city = "NYC";

# Commit inclui código formatado
# Zero discussão sobre formatação em code review
```

**Problema 4: Commits grandes quebram pipeline**
```bash
# Sem lint-staged - linting project inteiro ❌

# Modificar 2 arquivos
git add file1.ts file2.ts

# Pre-commit roda ESLint em projeto inteiro
npx eslint "src/**/*.ts"

# Analisa 500+ arquivos (lento - 30 segundos)
# Descobre erros em arquivos não modificados
# Commit bloqueado por erros em código antigo
```

**Solução: lint-staged valida apenas arquivos modificados**
```bash
# Com lint-staged - apenas arquivos staged ✅

# Modificar 2 arquivos
git add file1.ts file2.ts

# Pre-commit roda ESLint apenas em arquivos staged
# Running lint-staged...
# ✓ eslint --fix file1.ts file2.ts

# Analisa apenas 2 arquivos (rápido - 2 segundos)
# Valida apenas código modificado
# Commit passa se arquivos modificados estiverem corretos ✅
```

**Fundamento teórico:** Pre-commit hooks implementam **quality gate pattern** - validação obrigatória antes de integração.

### Importância no Ecossistema

Pre-commit hooks são importantes porque:

- **Automated enforcement:** Validação obrigatória
- **Fast feedback:** Erros detectados antes de push
- **CI/CD efficiency:** Pipeline roda código pré-validado
- **Consistency:** Todos commits seguem padrões
- **Team alignment:** Padrões enforçados automaticamente
- **Fail-fast:** Problemas detectados cedo
- **Staged-only:** Performance - lint apenas modificados
- **Blocked commits:** Código ruim não entra no repo

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Git hooks:** Scripts em eventos Git
2. **Husky:** Gerenciador hooks Node.js
3. **lint-staged:** Lint apenas arquivos staged
4. **Quality gate:** Validação obrigatória
5. **Fail-fast:** Detectar erros cedo

### Pilares Fundamentais

- **pre-commit:** Hook antes de commit
- **pre-push:** Hook antes de push
- **commit-msg:** Hook em mensagem commit
- **Husky install:** Configurar hooks
- **lint-staged config:** Validações por tipo arquivo

### Visão Geral das Nuances

- **Bypass hooks:** `--no-verify` (emergências)
- **Concurrent:** lint-staged roda tarefas em paralelo
- **Glob patterns:** Validações por extensão
- **Multiple commands:** Encadear validações
- **Windows compatibility:** CRLF vs LF

## 🧠 Fundamentos Teóricos

### Husky Installation

```bash
# Instalar Husky e lint-staged

npm install --save-dev husky lint-staged

# Inicializar Husky
npx husky install

# Adicionar prepare script (instala hooks após npm install)
npm pkg set scripts.prepare="husky install"

# Criar pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**Installation:** Setup inicial.

### Package.json Configuration

```json
// package.json - configuração completa

{
  "name": "my-project",
  "scripts": {
    // Instala hooks após npm install
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  },
  "lint-staged": {
    // TypeScript files
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ],
    
    // JavaScript files
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ],
    
    // JSON files
    "*.json": [
      "prettier --write"
    ],
    
    // Markdown files
    "*.md": [
      "prettier --write"
    ]
  }
}
```

**Package.json:** Configuração lint-staged.

### Pre-commit Hook

```bash
# .husky/pre-commit

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged
```

**Pre-commit:** Hook principal.

### Princípios e Conceitos Subjacentes

#### Lint-staged Configuration File

```javascript
// lint-staged.config.js - configuração avançada

export default {
  // TypeScript files
  "*.ts": [
    // ESLint com auto-fix
    "eslint --fix",
    
    // Prettier
    "prettier --write",
    
    // Type check (opcional - pode ser lento)
    // () => "tsc --noEmit"
  ],
  
  // Test files - rodar testes relacionados
  "*.test.ts": [
    "eslint --fix",
    "jest --bail --findRelatedTests"
  ],
  
  // JSON, YAML, Markdown
  "*.{json,yaml,yml,md}": [
    "prettier --write"
  ],
  
  // Package.json - ordenar keys
  "package.json": [
    "prettier --write",
    "sort-package-json"
  ]
};
```

**Config File:** lint-staged.config.js.

#### Pre-push Hook

```bash
# .husky/pre-push

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run tests before push
npm run test

# Type check
npm run type-check

# Build
npm run build
```

**Pre-push:** Validações antes de push.

### Commit-msg Hook

```bash
# .husky/commit-msg

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
npx --no -- commitlint --edit $1
```

**Commit-msg:** Validar mensagem commit.

#### Commitlint Configuration

```javascript
// commitlint.config.js - conventional commits

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type must be one of:
    "type-enum": [
      2,
      "always",
      [
        "feat",     // New feature
        "fix",      // Bug fix
        "docs",     // Documentation
        "style",    // Formatting
        "refactor", // Refactoring
        "test",     // Tests
        "chore"     // Maintenance
      ]
    ],
    // Subject must not be empty
    "subject-empty": [2, "never"],
    // Subject must be lowercase
    "subject-case": [2, "always", "lower-case"]
  }
};
```

**Commitlint:** Validar formato mensagem.

```bash
# Valid commits ✓
git commit -m "feat: add login feature"
git commit -m "fix: resolve memory leak"
git commit -m "docs: update README"

# Invalid commits ✗
git commit -m "Add login"  # Missing type
git commit -m "FEAT: login"  # Uppercase
```

### Multiple Commands

```json
// lint-staged - múltiplos comandos encadeados

{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",           // 1. Fix ESLint
      "prettier --write",       // 2. Format
      "git add"                 // 3. Re-stage (Husky <5)
    ]
  }
}
```

**Multiple:** Encadear comandos.

**Nota:** `git add` não necessário em Husky 5+ (auto-staging).

#### Glob Patterns

```json
// lint-staged - glob patterns avançados

{
  "lint-staged": {
    // Todos TypeScript
    "*.ts": ["eslint --fix"],
    
    // TypeScript exceto .d.ts
    "*.ts": [
      (files) => files
        .filter(f => !f.endsWith(".d.ts"))
        .map(f => `eslint --fix ${f}`)
    ],
    
    // Apenas src/
    "src/**/*.ts": ["eslint --fix"],
    
    // Múltiplas extensões
    "*.{ts,tsx,js,jsx}": ["eslint --fix"],
    
    // Todos arquivos
    "*": ["prettier --write --ignore-unknown"]
  }
}
```

**Glob Patterns:** Padrões avançados.

### Function-based Configuration

```javascript
// lint-staged.config.js - configuração função

export default {
  "*.ts": (files) => {
    // Custom logic
    const commands = [];
    
    // ESLint
    commands.push(`eslint --fix ${files.join(" ")}`);
    
    // Prettier
    commands.push(`prettier --write ${files.join(" ")}`);
    
    // Type check apenas se muitos arquivos
    if (files.length > 10) {
      commands.push("tsc --noEmit");
    }
    
    return commands;
  }
};
```

**Function-based:** Lógica customizada.

#### Bypass Hooks

```bash
# Bypass pre-commit hook (emergências apenas)

# Commit sem rodar hooks
git commit --no-verify -m "Emergency fix"

# Ou
git commit -n -m "Emergency fix"

# Push sem rodar pre-push
git push --no-verify
```

**Bypass:** `--no-verify` (usar com cuidado).

### Concurrent Execution

```json
// lint-staged - execução concorrente

{
  "lint-staged": {
    // Rodar em paralelo (default)
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Concurrent:** Tarefas em paralelo (performance).

#### Debugging

```bash
# Debug lint-staged

# Verbose output
npx lint-staged --verbose

# Dry run (não executa comandos)
npx lint-staged --dry-run

# Debug Husky
# Adicionar logs no hook
echo "Running pre-commit..."
npx lint-staged
echo "Pre-commit done"
```

**Debugging:** Troubleshooting.

### Windows Compatibility

```bash
# .husky/pre-commit - Windows compatible

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# Ou usar cross-env para scripts
npm install --save-dev cross-env

# package.json
{
  "scripts": {
    "lint": "cross-env NODE_ENV=production eslint ."
  }
}
```

**Windows:** Compatibilidade Windows.

#### Complete Example

```json
// package.json - exemplo completo

{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "jest",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npm run test
```

```javascript
// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"]
};
```

**Complete:** Exemplo completo.

### Modelo Mental para Compreensão

Pense em pre-commit hooks como **airport security**:

**Security checkpoint:** Validação antes de embarque
**Pre-commit hook:** Validação antes de commit
**Boarding denied:** Commit bloqueado

**Analogia - Quality Gate:**

**Factory inspection:** Produto inspecionado antes de sair
**Pre-commit hook:** Código inspecionado antes de commit
**Failed inspection:** Commit bloqueado

**Metáfora - Spell Checker:**

**Word spell check:** Sublinha erros antes de enviar email
**Pre-commit hook:** Detecta erros antes de commit
**Block send:** Commit bloqueado

**Fluxo de pre-commit:**
```
1. Desenvolvedor faz git commit
2. Git executa .husky/pre-commit
3. Husky executa lint-staged
4. lint-staged identifica arquivos staged
5. Roda validações apenas em staged files
6. Se sucesso → commit completa
7. Se falha → commit bloqueado
```

**Exemplo visual:**
```
git commit
    ↓
.husky/pre-commit
    ↓
lint-staged
    ↓
Arquivos staged (file1.ts, file2.ts)
    ↓
ESLint --fix file1.ts file2.ts
    ↓
Prettier --write file1.ts file2.ts
    ↓
✓ Sucesso → Commit completa
✗ Falha → Commit bloqueado
```

## 🔍 Análise Conceitual Profunda

### Best Practices

```json
// Best practices lint-staged

{
  "lint-staged": {
    // 1. Ordem: Fix → Format
    "*.ts": [
      "eslint --fix",      // Primeiro - fix
      "prettier --write"   // Depois - format
    ],
    
    // 2. Type check apenas se necessário (lento)
    // Melhor em pre-push
    
    // 3. Tests relacionados
    "*.test.ts": [
      "eslint --fix",
      "jest --bail --findRelatedTests"
    ],
    
    // 4. Ignore arquivos gerados
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**Best Practices:** Recomendações.

#### Performance Optimization

```javascript
// lint-staged.config.js - otimizações

export default {
  "*.ts": [
    // ESLint cache (mais rápido)
    "eslint --cache --fix",
    
    // Prettier
    "prettier --write"
  ],
  
  // Type check apenas pre-push (não pre-commit - muito lento)
  // Remover de pre-commit
  
  // Tests apenas pre-push
  // Remover de pre-commit
};
```

**Performance:** Otimizações.

### Team Setup

```bash
# README.md - instruções para equipe

## Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Husky hooks installed automatically via `prepare` script

## Development

- Commits automatically validated via pre-commit hook
- Commit messages must follow conventional commits format
- Pre-push runs type check and tests

## Bypass hooks (emergencies only)

git commit --no-verify
```

**Team Setup:** Documentação.

## 🎯 Aplicabilidade e Contextos

### Enterprise

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-push
npm run type-check
npm run test
npm run build
```

**Raciocínio:** Validações rigorosas.

### Startups

```json
{
  "lint-staged": {
    "*.ts": ["eslint --fix"]
  }
}
```

**Raciocínio:** Balance velocidade e qualidade.

### Open Source

```json
{
  "lint-staged": {
    "*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**Raciocínio:** Padrões universais.

## ⚠️ Limitações e Considerações Teóricas

### Performance Impact

```bash
# Type check em pre-commit pode ser lento
# Mover para pre-push
```

**Limitação:** Hooks lentos frustram devs.

### Bypass Availability

```bash
# Devs podem bypass hooks
git commit --no-verify
```

**Consideração:** Educação necessária.

### Learning Curve

```bash
# Configuração inicial pode intimidar
# Fornecer setup automatizado
```

**Limitação:** Complexidade inicial.

## 🔗 Interconexões Conceituais

**Relação com Git:** Hooks em eventos Git.

**Relação com ESLint:** Validação automática.

**Relação com Prettier:** Formatação automática.

**Relação com CI/CD:** Complementar (local + remote).

**Relação com Editor:** Integração completa.

## 🚀 Evolução e Próximos Conceitos

Dominar pre-commit hooks prepara para:
- **CI/CD Integration:** Pipelines automatizados
- **Conventional Commits:** Padrões mensagem
- **Semantic Release:** Versionamento automático
- **Monorepo Tools:** Nx, Turborepo
- **Custom Git Hooks:** Automações customizadas
