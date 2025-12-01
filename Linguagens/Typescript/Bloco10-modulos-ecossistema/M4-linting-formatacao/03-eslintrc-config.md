# Configuração de .eslintrc

## 🎯 Introdução e Definição

### Definição Conceitual

**.eslintrc** é **arquivo de configuração ESLint** que define **rules, parsers, plugins, e extends** para linting de projeto. Diferentemente de configuração inline (comentários no código), .eslintrc centraliza configuração em arquivo dedicado, permitindo **compartilhar padrões** entre equipe e **versionamento** via Git. Suporta **múltiplos formatos** (.json, .js, .yaml) e **herança** via `extends`.

Conceitualmente, .eslintrc implementa **centralized configuration** - single source of truth para regras de linting. Segue **principle of configuration as code** - configuração versionada como código-fonte. Facilita **team standardization** - toda equipe segue mesmas regras automaticamente. Permite **layered configuration** - configs base + overrides específicos.

**Fundamento teórico:** .eslintrc deriva de **configuration file pattern** - arquivo dedicado para settings ao invés de hard-coded. Suporta **extends mechanism** - herança de configurações base (DRY principle). Permite **overrides** - configurações diferentes por arquivo/diretório via glob patterns. TypeScript ESLint adiciona **parser e plugins** específicos para validar TypeScript além de JavaScript.

**Pattern básico:**
```json
// .eslintrc.json - configuração básica

{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "semi": ["error", "always"],
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

**Diferença fundamental:**
- **Inline config:** Comentários no código (temporário, específico)
- **.eslintrc:** Arquivo centralizado (permanente, projeto inteiro)

### Contexto Histórico e Evolução

**ESLint 0.1 (2013):** Configuração inicial.

```json
// ESLint 0.1 - config básica
{
  "rules": {
    "semi": 2
  }
}
```

**ESLint 1.0 (2015):** `extends` para herança.

```json
// ESLint 1.0 - extends
{
  "extends": "eslint:recommended",
  "rules": {
    "semi": "error"
  }
}
```

**ESLint 2.0 (2016):** Plugins e parsers.

```json
// ESLint 2.0 - plugins
{
  "parser": "babel-eslint",
  "plugins": ["react"],
  "extends": ["eslint:recommended", "plugin:react/recommended"]
}
```

**TypeScript ESLint (2017):** Parser TypeScript.

```json
// TypeScript ESLint
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["plugin:@typescript-eslint/recommended"]
}
```

**ESLint 4.0 (2017):** Shareable configs.

```json
// Shareable configs
{
  "extends": ["airbnb", "airbnb-typescript"]
}
```

**ESLint 6.0 (2019):** `overrides` para configurações específicas.

```json
// Overrides
{
  "rules": { "no-console": "error" },
  "overrides": [{
    "files": ["*.test.ts"],
    "rules": { "no-console": "off" }
  }]
}
```

**ESLint 8.0 (2021):** Flat config experimental.

```javascript
// eslint.config.js - flat config
export default [
  {
    files: ["**/*.ts"],
    rules: { "semi": "error" }
  }
];
```

**ESLint 9.0 (2024):** Flat config padrão.

```javascript
// Flat config default
import js from "@eslint/js";

export default [
  js.configs.recommended,
  { rules: { "semi": "error" } }
];
```

**Antes vs Depois:**

**Pré-.eslintrc (sem config):**
```javascript
// Sem configuração centralizada
// Cada desenvolvedor usa regras diferentes
```

**Pós-.eslintrc (config centralizada):**
```json
// .eslintrc.json - toda equipe usa
{
  "extends": "eslint:recommended"
}
```

**Evolução TypeScript:**

**TypeScript inicial (sem .eslintrc):**
```typescript
// Apenas TSC - sem linting
```

**TypeScript moderno (com .eslintrc):**
```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"]
}
```

### Problema Fundamental que Resolve

.eslintrc resolve problemas de **configuration management**, **team consistency**, e **rule organization**.

**Problema 1: Configuração espalhada**
```typescript
// Sem .eslintrc - config inline espalhada ❌

// file1.ts
/* eslint semi: error, quotes: ["error", "double"] */
const x = 42;

// file2.ts
/* eslint semi: error, quotes: ["error", "double"] */
const y = 42;

// file3.ts
/* eslint semi: error, quotes: ["error", "double"] */
const z = 42;

// Duplicação, difícil manter
```

**Solução: .eslintrc centraliza configuração**
```json
// .eslintrc.json - configuração única ✅

{
  "rules": {
    "semi": "error",
    "quotes": ["error", "double"]
  }
}

// Todos arquivos herdam automaticamente
// file1.ts, file2.ts, file3.ts - sem config inline
```

**Problema 2: Inconsistência entre desenvolvedores**
```typescript
// Sem .eslintrc versionado - cada dev usa regras diferentes ❌

// Dev A - local config
{
  "rules": { "semi": "error" }
}

// Dev B - local config
{
  "rules": { "semi": "off" }
}

// Dev C - sem config
// Usa defaults

// Código inconsistente entre devs
```

**Solução: .eslintrc versionado**
```json
// .eslintrc.json - versionado no Git ✅

{
  "rules": {
    "semi": "error"
  }
}

// Todos devs clonam repositório
// Todos usam mesma configuração
// Consistência garantida ✅
```

**Problema 3: Configurações complexas difíceis de gerenciar**
```javascript
// Sem .eslintrc - passar config via CLI ❌

npx eslint --parser @typescript-eslint/parser --plugin @typescript-eslint --rule 'semi: error' --rule 'quotes: ["error", "double"]' --rule '@typescript-eslint/no-explicit-any: error' src/**/*.ts

// Comando gigante, difícil manter
```

**Solução: .eslintrc organiza configuração**
```json
// .eslintrc.json - organizado ✅

{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "semi": "error",
    "quotes": ["error", "double"],
    "@typescript-eslint/no-explicit-any": "error"
  }
}

// CLI simples
npx eslint "src/**/*.ts"
```

**Problema 4: Configurações diferentes por contexto**
```typescript
// Sem overrides - mesmas regras para tudo ❌

// src/app.ts - produção
console.log(user);  // ✗ Error - no-console

// test/app.test.ts - testes
console.log(result);  // ✗ Error - no-console (mas deveria permitir)

// scripts/build.ts - scripts
console.log("Building...");  // ✗ Error - no-console (mas deveria permitir)

// Regras rígidas demais
```

**Solução: overrides para contextos diferentes**
```json
// .eslintrc.json - overrides ✅

{
  "rules": {
    "no-console": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "rules": {
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      "files": ["scripts/**/*.ts"],
      "rules": {
        "no-console": "warn"
      }
    }
  ]
}

// Regras adaptadas ao contexto ✅
```

**Fundamento teórico:** .eslintrc implementa **configuration layering** - base config + overrides específicos.

### Importância no Ecossistema

.eslintrc é importante porque:

- **Centralization:** Config centralizada em arquivo único
- **Versioning:** Versionada no Git, compartilhada por equipe
- **Extends:** Herdar configs populares (Airbnb, Standard, etc.)
- **Overrides:** Regras diferentes por contexto
- **Plugins:** Integrar plugins (TypeScript, React, etc.)
- **Type-aware:** Configurar type-aware rules
- **Team Standards:** Enforçar padrões automaticamente
- **Maintenance:** Fácil manter e atualizar

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Centralized:** Configuração única para projeto
2. **Extends:** Herança de configurações base
3. **Overrides:** Config específica por arquivo/diretório
4. **Plugins:** Extensões de funcionalidade
5. **Parser:** Customizar parser (TypeScript)

### Pilares Fundamentais

- **Format:** .json, .js, .yaml, .yml
- **Location:** Raiz do projeto ou subdiretórios
- **Extends:** Herdar shareable configs
- **Rules:** Definir rules e severities
- **Overrides:** Configurações por padrão

### Visão Geral das Nuances

- **Cascade:** Configs em subdiretórios sobrescrevem parent
- **root:** `"root": true` para parar cascade
- **env:** Definir environments (browser, node, etc.)
- **globals:** Declarar variáveis globais
- **parserOptions:** Configurar parser (ECMAScript version, etc.)

## 🧠 Fundamentos Teóricos

### File Formats

```javascript
// .eslintrc.json
{
  "rules": { "semi": "error" }
}

// .eslintrc.js
module.exports = {
  rules: { semi: "error" }
};

// .eslintrc.cjs (CommonJS)
module.exports = {
  rules: { semi: "error" }
};

// .eslintrc.yaml
rules:
  semi: error

// .eslintrc.yml
rules:
  semi: error

// package.json
{
  "eslintConfig": {
    "rules": { "semi": "error" }
  }
}
```

**Formats:** Diferentes formatos suportados.

### Complete Configuration

```json
// .eslintrc.json - configuração completa

{
  // Parar cascade em parent directories
  "root": true,
  
  // Parser para TypeScript
  "parser": "@typescript-eslint/parser",
  
  // Parser options
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  
  // Plugins
  "plugins": [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],
  
  // Extends (ordem importa)
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  
  // Environment
  "env": {
    "browser": true,
    "node": true,
    "es2022": true
  },
  
  // Globals
  "globals": {
    "myGlobal": "readonly"
  },
  
  // Rules
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "@typescript-eslint/no-explicit-any": "error"
  },
  
  // Overrides
  "overrides": [
    {
      "files": ["*.test.ts"],
      "rules": {
        "no-console": "off"
      }
    }
  ],
  
  // Ignore patterns
  "ignorePatterns": ["dist", "node_modules"]
}
```

**Complete:** Configuração completa.

### Extends

```json
// Herdar configurações base

{
  "extends": [
    // ESLint core
    "eslint:recommended",        // ESLint recommended rules
    "eslint:all",                // Todas ESLint rules (não recomendado)
    
    // TypeScript ESLint
    "plugin:@typescript-eslint/recommended",  // Recommended
    "plugin:@typescript-eslint/recommended-requiring-type-checking",  // Strict
    
    // Shareable configs populares
    "airbnb",                    // Airbnb style guide
    "airbnb-typescript",         // Airbnb para TypeScript
    "standard",                  // Standard style
    "google",                    // Google style
    
    // Framework-specific
    "plugin:react/recommended",
    "plugin:vue/recommended",
    
    // Prettier (sempre último)
    "prettier"                   // Desabilita rules conflitantes
  ]
}
```

**Extends:** Configs populares.

### Princípios e Conceitos Subjacentes

#### Rules Configuration

```json
// Configurar rules

{
  "rules": {
    // Severities: "off" (0), "warn" (1), "error" (2)
    "no-console": "off",
    "no-debugger": "warn",
    "no-unused-vars": "error",
    
    // Com opções
    "semi": ["error", "always"],
    "quotes": ["error", "double", { "avoidEscape": true }],
    
    // TypeScript rules
    "@typescript-eslint/explicit-function-return-type": ["warn", {
      "allowExpressions": true
    }],
    
    // Desabilitar rule base, usar TypeScript version
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

**Rules:** Configuração de rules.

#### ParserOptions

```json
// Parser options

{
  "parserOptions": {
    // ECMAScript version (3, 5, 6-2022, "latest")
    "ecmaVersion": 2022,
    
    // Module type ("script" ou "module")
    "sourceType": "module",
    
    // TypeScript project (para type-aware rules)
    "project": "./tsconfig.json",
    
    // Ou múltiplos tsconfig
    "project": ["./tsconfig.json", "./tsconfig.test.json"],
    
    // ECMAScript features
    "ecmaFeatures": {
      "jsx": true,
      "impliedStrict": true
    }
  }
}
```

**ParserOptions:** Configurar parser.

### Environment

```json
// Definir environments

{
  "env": {
    // Browser globals (window, document, etc.)
    "browser": true,
    
    // Node.js globals (process, __dirname, etc.)
    "node": true,
    
    // ES2022 globals (Promise, Map, Set, etc.)
    "es2022": true,
    
    // Jest globals (describe, it, expect, etc.)
    "jest": true,
    
    // Mocha globals
    "mocha": true,
    
    // Web Workers
    "worker": true,
    
    // Service Worker
    "serviceworker": true
  }
}
```

**Environment:** Definir globals por environment.

#### Globals

```json
// Declarar variáveis globais customizadas

{
  "globals": {
    // Readonly global
    "myGlobal": "readonly",
    
    // Writable global
    "myWritableGlobal": "writable",
    
    // Off (não permitir)
    "forbiddenGlobal": "off",
    
    // jQuery
    "$": "readonly",
    "jQuery": "readonly"
  }
}
```

**Globals:** Variáveis globais customizadas.

### Overrides

```json
// Configurações específicas por arquivo

{
  "rules": {
    "no-console": "error",
    "@typescript-eslint/no-explicit-any": "error"
  },
  "overrides": [
    // Test files
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "env": {
        "jest": true
      },
      "rules": {
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    
    // Scripts
    {
      "files": ["scripts/**/*.ts"],
      "rules": {
        "no-console": "warn"
      }
    },
    
    // Config files
    {
      "files": ["*.config.js", ".eslintrc.js"],
      "env": {
        "node": true
      }
    },
    
    // Exclude pattern
    {
      "files": ["src/**/*.ts"],
      "excludedFiles": ["src/**/*.d.ts"],
      "rules": {
        "@typescript-eslint/explicit-module-boundary-types": "error"
      }
    }
  ]
}
```

**Overrides:** Configurações por contexto.

#### Cascading

```javascript
// Cascade de configs

// Projeto raiz
project/
├── .eslintrc.json          // Base config
├── src/
│   ├── .eslintrc.json      // Overrides para src/
│   └── components/
│       └── .eslintrc.json  // Overrides para src/components/

// ESLint combina configs (mais específico sobrescreve)
// components/ usa: root + src/ + components/

// Parar cascade com "root": true
{
  "root": true  // Não procurar configs em parent dirs
}
```

**Cascading:** Hierarquia de configs.

### Shareable Configs

```javascript
// Criar shareable config

// eslint-config-mycompany/index.js
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "semi": ["error", "always"]
  }
};

// Publicar npm
// package.json
{
  "name": "eslint-config-mycompany",
  "version": "1.0.0",
  "main": "index.js",
  "peerDependencies": {
    "eslint": ">=8.0.0",
    "@typescript-eslint/eslint-plugin": ">=5.0.0",
    "@typescript-eslint/parser": ">=5.0.0"
  }
}

// Usar em projetos
{
  "extends": ["mycompany"]
}
```

**Shareable:** Criar e compartilhar configs.

#### Type-aware Configuration

```json
// Type-aware rules (usam TypeScript type checker)

{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    // Necessário para type-aware rules
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    // Inclui type-aware rules
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    // Type-aware rules
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-unnecessary-condition": "error"
  }
}
```

**Type-aware:** Rules que usam types.

### Flat Config (ESLint 9+)

```javascript
// eslint.config.js - flat config

import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // ESLint recommended
  js.configs.recommended,
  
  // TypeScript recommended
  ...tseslint.configs.recommended,
  
  // Custom config
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      "semi": ["error", "always"],
      "@typescript-eslint/no-explicit-any": "error"
    }
  },
  
  // Test files override
  {
    files: ["**/*.test.ts"],
    rules: {
      "no-console": "off"
    }
  },
  
  // Ignore patterns
  {
    ignores: ["dist/**", "node_modules/**"]
  }
];
```

**Flat Config:** Nova configuração ESLint 9+.

#### Modelo Mental para Compreensão

Pense em .eslintrc como **building code**:

**Building code:** Regulamentações de construção
**.eslintrc:** Regras de código
**Inspectors:** ESLint valida conformidade

**Analogia - Constitution:**

**.eslintrc:** Constituição do projeto
**extends:** Herdar leis fundamentais
**rules:** Leis específicas
**overrides:** Emendas constitucionais

**Metáfora - Recipe Book:**

**.eslintrc:** Livro de receitas
**extends:** Receitas base (cookbook)
**rules:** Ingredientes e instruções
**overrides:** Variações da receita

**Fluxo de .eslintrc:**
```
1. ESLint carrega .eslintrc
2. Resolve extends (shareable configs)
3. Combina rules (mais específico sobrescreve)
4. Aplica overrides por arquivo
5. Parser processa código
6. Rules validam AST
7. Reporta problemas
```

**Exemplo visual:**
```
.eslintrc.json
├── extends
│   ├── eslint:recommended
│   └── plugin:@typescript-eslint/recommended
├── rules (custom)
│   └── semi: "error"
└── overrides
    └── *.test.ts
        └── no-console: "off"
```

## 🔍 Análise Conceitual Profunda

### Recommended TypeScript Config

```json
// .eslintrc.json - config recomendada para TypeScript

{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "env": {
    "es2022": true,
    "node": true
  },
  "rules": {
    // JavaScript rules
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-const": "error",
    "no-var": "error",
    
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-non-null-assertion": "warn",
    
    // Type-aware rules
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error"
  },
  "overrides": [
    {
      "files": ["**/*.test.ts", "**/*.spec.ts"],
      "env": { "jest": true },
      "rules": {
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
```

**Recommended:** Config TypeScript completa.

#### Monorepo Configuration

```json
// Monorepo com múltiplos projetos

// Root .eslintrc.json
{
  "root": true,
  "extends": ["eslint:recommended"],
  "rules": {
    "semi": ["error", "always"]
  }
}

// packages/api/.eslintrc.json
{
  "extends": ["../../.eslintrc.json"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "env": {
    "node": true
  },
  "rules": {
    "no-console": "warn"
  }
}

// packages/web/.eslintrc.json
{
  "extends": ["../../.eslintrc.json"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "env": {
    "browser": true
  },
  "rules": {
    "no-console": "error"
  }
}
```

**Monorepo:** Config para monorepos.

### Performance Optimization

```json
// Otimizar performance

{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    
    // Não criar program default (mais rápido)
    "createDefaultProgram": false,
    
    // Cache type information
    "EXPERIMENTAL_useProjectService": true
  },
  
  // Cache results
  "cache": true,
  "cacheLocation": ".eslintcache",
  
  // Ignore patterns (não processar)
  "ignorePatterns": [
    "dist",
    "build",
    "node_modules",
    "**/*.d.ts"
  ]
}
```

**Performance:** Otimizações.

## 🎯 Aplicabilidade e Contextos

### Enterprise Projects

```json
{
  "extends": ["airbnb-typescript", "prettier"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error"
  }
}
```

**Raciocínio:** Padrões estritos.

### Open Source

```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"]
}
```

**Raciocínio:** Padrões universais.

### Startups

```json
{
  "extends": ["plugin:@typescript-eslint/recommended"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

**Raciocínio:** Balance qualidade e velocidade.

## ⚠️ Limitações e Considerações Teóricas

### Complexity

```json
// Configuração pode ficar complexa
// Múltiplos extends, overrides, etc.
```

**Limitação:** Curva de aprendizado.

### Extends Order

```json
// Ordem de extends importa
// Último sobrescreve anteriores
{
  "extends": [
    "eslint:recommended",
    "prettier"  // Sempre último
  ]
}
```

**Consideração:** Ordem importa.

### Type-aware Performance

```json
// Type-aware rules lentas
// parserOptions.project causa overhead
```

**Limitação:** Impact performance.

## 🔗 Interconexões Conceituais

**Relação com ESLint:** Configura ESLint.

**Relação com TypeScript:** Parser TypeScript.

**Relação com Prettier:** eslint-config-prettier.

**Relação com Git:** Versionado no repositório.

**Relação com CI/CD:** Validação automatizada.

## 🚀 Evolução e Próximos Conceitos

Dominar .eslintrc prepara para:
- **Editor Integration:** Configurar IDEs
- **Pre-commit Hooks:** Git hooks
- **CI/CD:** Automação
- **Custom Rules:** Criar rules personalizadas
- **Flat Config:** ESLint 9+ flat config
