# include e exclude: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`include`** e **`exclude`** são **propriedades do tsconfig.json** que definem quais arquivos o compilador TypeScript deve processar (include) e quais deve ignorar (exclude) usando padrões glob. Conceitualmente, representam **file selection filter**, especificando precisamente o escopo de compilação através de patterns que casam com caminhos de arquivos.

Na essência, include/exclude materializam o princípio de **explicit compilation scope**, permitindo que você defina exatamente quais partes do projeto devem ser compiladas, excluindo testes, node_modules, arquivos de configuração e outros que não fazem parte do output final.

## 📋 Fundamentos

### Estrutura Básica

```json
{
  "include": [
    // Padrões de arquivos a INCLUIR
    "src/**/*"
  ],

  "exclude": [
    // Padrões de arquivos a EXCLUIR
    "node_modules",
    "dist",
    "**/*.spec.ts"
  ]
}
```

**Conceito-chave:** Include define **conjunto positivo** (o que compilar), exclude define **conjunto negativo** (o que NÃO compilar).

### Defaults (Valores Padrão)

```json
// Se omitir include:
{
  // Implicitamente: include: ["**/*"]
  // Compila TODOS os arquivos .ts, .tsx, .d.ts no projeto
}

// Se omitir exclude:
{
  // Implicitamente: exclude: ["node_modules", "bower_components", "jspm_packages"]
  // Mais outDir se especificado
}
```

**Comportamento padrão:**
- **Sem include:** Compila tudo (exceto defaults de exclude)
- **Sem exclude:** Exclui apenas node_modules e outDir
- **Com ambos:** Include tem prioridade, depois exclude filtra

## 🔍 Análise Conceitual

### 1. Padrões Glob

#### Wildcards Básicos

```json
{
  "include": [
    "src/*",         // Arquivos DIRETOS em src/ (não recursivo)
    "src/**/*",      // TODOS arquivos em src/ e subdiretórios (recursivo)
    "src/*.ts",      // Apenas .ts diretos em src/
    "src/**/*.ts",   // Todos .ts em src/ e subdiretórios
    "src/**/*.tsx"   // Todos .tsx em src/ e subdiretórios
  ]
}
```

**Símbolos:**
- `*` - Casa qualquer sequência de caracteres (exceto `/`)
- `**` - Casa qualquer sequência incluindo `/` (recursivo)
- `?` - Casa exatamente um caractere
- `[]` - Casa conjunto de caracteres

**Exemplos:**

```
src/*          casa:  src/index.ts, src/App.tsx
               NÃO:   src/utils/math.ts

src/**/*       casa:  src/index.ts, src/utils/math.ts, src/components/Button.tsx
               Tudo recursivamente

src/**/*.ts    casa:  src/index.ts, src/utils/math.ts
               NÃO:   src/App.tsx (não é .ts)

*.config.ts    casa:  jest.config.ts, vite.config.ts
               NÃO:   src/config.ts
```

#### Extensões Específicas

```json
{
  "include": [
    "src/**/*.ts",      // Apenas TypeScript
    "src/**/*.tsx",     // Apenas TSX (React)
    "src/**/*.d.ts"     // Apenas definições de tipos
  ]
}
```

**Conceito:** TypeScript automaticamente **inclui tipos** que correspondem a extensões permitidas.

**Extensões padrão processadas:**
- `.ts` - TypeScript
- `.tsx` - TypeScript + JSX
- `.d.ts` - Definições de tipos
- `.js` (se `allowJs: true`)
- `.jsx` (se `allowJs: true` e `jsx` configurado)

### 2. Ordem de Precedência

```
1. files (se especificado)
2. include
3. exclude filtra resultado de include
4. Referências de imports sempre incluídas
```

**Exemplo:**

```json
{
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

**Comportamento:**
```
1. Include pega: src/index.ts, src/math.ts, src/math.spec.ts
2. Exclude remove: src/math.spec.ts
3. Resultado final: src/index.ts, src/math.ts
```

**Importante:** Se arquivo é **importado** por arquivo incluído, ele será compilado mesmo se não estiver em include!

```typescript
// src/index.ts (em include)
import { helper } from "../utils/helper";  // utils/ não está em include

// utils/helper.ts será compilado mesmo assim (dependency)
```

### 3. Propriedade files (Alternativa)

```json
{
  "files": [
    // Lista EXPLÍCITA de arquivos (menos comum)
    "src/index.ts",
    "src/global.d.ts"
  ]
}
```

**Diferenças:**
- `files` - Lista explícita (sem globs)
- `include` - Padrões glob
- `files` tem **prioridade** sobre include/exclude

**Uso:** Raramente usado, apenas quando precisar listar poucos arquivos específicos.

### 4. Exclude - Padrões Comuns

```json
{
  "exclude": [
    // Node modules
    "node_modules",

    // Output
    "dist",
    "build",
    "out",

    // Testes
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/__tests__/**",
    "**/__mocks__/**",

    // Configurações
    "*.config.ts",
    "jest.config.ts",
    "vite.config.ts",

    // Temporários
    ".git",
    ".vscode",
    "coverage",
    "tmp",

    // Scripts
    "scripts/**/*"
  ]
}
```

**Conceito:** Exclude filtra **arquivos que não devem ser compilados**, como testes, configs, e dependências.

### 5. Interação com outDir

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
  // exclude automaticamente inclui "dist" (outDir)
}
```

**Comportamento automático:**
- **outDir é automaticamente excluído** para evitar loop infinito
- Compilador não processa arquivos em outDir mesmo que casem com include

### 6. Extensões de Arquivo

```json
{
  "compilerOptions": {
    "allowJs": true
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.js",   // Necessário se allowJs: true
    "src/**/*.jsx"
  ]
}
```

**Sem allowJs:**
```json
{
  // Apenas TS/TSX processados
  "include": ["src/**/*"]  // Pega apenas .ts, .tsx, .d.ts
}
```

**Com allowJs:**
```json
{
  "compilerOptions": {
    "allowJs": true
  },
  "include": ["src/**/*"]  // Pega .ts, .tsx, .d.ts, .js, .jsx
}
```

## 🎯 Aplicabilidade

### Setup Básico (Node.js)

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

**Estrutura:**
```
projeto/
├── src/
│   ├── index.ts      ✅ Compilado
│   ├── utils/
│   │   └── math.ts   ✅ Compilado
├── dist/             ❌ Excluído
└── node_modules/     ❌ Excluído
```

### Com Testes Separados

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "**/*.spec.ts",
    "**/*.test.ts",
    "src/**/__tests__/**"
  ]
}
```

**Estrutura:**
```
src/
├── index.ts          ✅ Compilado
├── index.spec.ts     ❌ Excluído (testes)
├── utils/
│   ├── math.ts       ✅ Compilado
│   └── math.test.ts  ❌ Excluído
└── __tests__/        ❌ Excluído (pasta de testes)
    └── integration.ts
```

### Múltiplas Pastas de Código

```json
{
  "include": [
    "src/**/*",
    "server/**/*",
    "shared/**/*"
  ],
  "exclude": [
    "**/*.spec.ts"
  ]
}
```

**Estrutura:**
```
projeto/
├── src/              ✅ Frontend
├── server/           ✅ Backend
├── shared/           ✅ Compartilhado
└── docs/             ❌ Não incluído
```

### Tipos Globais

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": [
    "src/**/*",
    "types/**/*.d.ts"  // Definições de tipos globais
  ]
}
```

**Estrutura:**
```
projeto/
├── src/
│   └── index.ts
├── types/
│   ├── global.d.ts   ✅ Incluído (definições)
│   └── express.d.ts
└── dist/
```

### React/Vite Project

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "jsx": "react-jsx"
  },
  "include": [
    "src"  // Padrão para React
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.spec.ts",
    "**/*.spec.tsx"
  ]
}
```

### Monorepo

```json
// Root tsconfig.json
{
  "files": [],  // Não compila nada no root
  "references": [
    { "path": "./packages/app" },
    { "path": "./packages/lib" }
  ]
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}

// packages/lib/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*"],
  "compilerOptions": {
    "declaration": true
  }
}
```

### Configurações Separadas (Build vs Dev)

```json
// tsconfig.json (desenvolvimento)
{
  "include": [
    "src/**/*"
  ]
}

// tsconfig.build.json (produção)
{
  "extends": "./tsconfig.json",
  "exclude": [
    "**/*.spec.ts",
    "**/*.test.ts",
    "**/__tests__/**",
    "**/__mocks__/**",
    "src/**/*.stories.tsx"  // Storybook
  ]
}
```

```bash
# Desenvolvimento (inclui testes)
tsc

# Build produção (exclui testes)
tsc --project tsconfig.build.json
```

## ⚠️ Considerações

### 1. Performance - Evitar Escopo Amplo

```json
{
  // ❌ Lento: compila TODO o projeto
  "include": ["**/*"]

  // ✅ Rápido: apenas src/
  "include": ["src/**/*"]

  // ❌ Muito lento: processa node_modules
  "include": ["**/*"],
  "exclude": []  // Não exclui node_modules

  // ✅ Exclui node_modules explicitamente
  "exclude": ["node_modules"]
}
```

### 2. Imports Externos a Include

```json
{
  "include": ["src/**/*"]
}
```

```typescript
// src/index.ts
import { config } from "../config";  // config.ts está FORA de src/

// config.ts SERÁ compilado mesmo fora de include (dependency)
```

**Conceito:** Arquivos **importados** são sempre incluídos, mesmo fora de include.

### 3. Arquivos .d.ts

```json
{
  "include": ["src/**/*"]
}
```

**Comportamento:**
- `src/**/*.ts` → Compilado para .js
- `src/**/*.d.ts` → Incluído para tipos (não gera .js)

```typescript
// src/global.d.ts (apenas definições)
declare module "*.svg" {
  const content: string;
  export default content;
}

// Não gera output, apenas fornece tipos
```

### 4. Exclude Não Afeta Referências

```json
{
  "include": ["src/**/*"],
  "exclude": ["src/legacy/**/*"]
}
```

```typescript
// src/index.ts
import { old } from "./legacy/old";  // SERÁ compilado

// Mesmo em exclude, se importado, é processado
```

**Solução:** Remover imports ou mover para fora do projeto.

### 5. Case Sensitivity

```json
{
  // ⚠️ Case-sensitive em Linux/Mac
  "include": ["SRC/**/*"]  // NÃO casa com src/

  // ✅ Usar lowercase
  "include": ["src/**/*"]
}
```

**Dica:** Use `forceConsistentCasingInFileNames: true` em compilerOptions.

### 6. Debugging Include/Exclude

```bash
# Ver arquivos que serão compilados
npx tsc --listFiles

# Verificar se arquivo está incluído
npx tsc --listFiles | grep "src/index.ts"

# Ver resolução de módulos
npx tsc --traceResolution
```

## 📚 Conclusão

include e exclude definem escopo de compilação usando **padrões glob**. include especifica arquivos a processar (ex: `src/**/*`), exclude filtra o que ignorar (testes, node_modules, dist). Wildcards: `*` (qualquer caractere), `**` (recursivo). Ordem: files > include > exclude. Arquivos **importados** são sempre compilados mesmo fora de include. outDir automaticamente excluído. Padrões comuns: excluir `**/*.spec.ts`, `node_modules`, `dist`. Defaults: include all se omitido, exclude node_modules. Use include restritivo para performance. tsconfig.build.json pode ter exclude mais agressivo para produção.
