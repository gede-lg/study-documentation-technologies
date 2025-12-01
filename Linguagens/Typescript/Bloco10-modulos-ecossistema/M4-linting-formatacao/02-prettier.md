# Prettier para Formatação

## 🎯 Introdução e Definição

### Definição Conceitual

**Prettier** é **opinionated code formatter** que **formata código automaticamente** seguindo **regras consistentes**, eliminando debates sobre estilo de código. Diferentemente de linters que detectam problemas, Prettier **reescreve código** - parse para AST, descarta formatação original, e re-imprime com estilo consistente. Implementa **zero-configuration** - funciona out-of-the-box com opções mínimas.

Conceitualmente, Prettier implementa **automated code formatting** - desenvolvedores escrevem código livremente, Prettier formata automaticamente. Segue **principle of least surprise** - formatação deve ser previsível e consistente. Elimina **bikeshedding** - discussões intermináveis sobre tabs vs spaces, aspas simples vs duplas, etc. Facilita **code reviews** - focar em lógica ao invés de estilo.

**Fundamento teórico:** Prettier deriva de **AST rewriting** - parse código para Abstract Syntax Tree, descarta toda formatação (whitespace, indentação, quebras de linha), e re-imprime seguindo regras fixas. Enquanto ESLint valida **code quality** (bugs, anti-patterns), Prettier valida **code style** (formatação visual). Prettier é **deterministic** - mesma entrada sempre produz mesma saída, garantindo formatação consistente em toda equipe.

**Pattern básico:**
```typescript
// Código antes do Prettier (formatação inconsistente)

function   add(  a:number,b:   number   )  {
return a+b
}

const user={name:"John",age:30,city:"Paris"}

if(value==null){console.log("null")}

// Código após Prettier (formatação consistente)

function add(a: number, b: number) {
  return a + b;
}

const user = { name: "John", age: 30, city: "Paris" };

if (value == null) {
  console.log("null");
}
```

**Diferença fundamental:**
- **ESLint:** Detecta problemas de qualidade (bugs, anti-patterns)
- **Prettier:** Formata código automaticamente (estilo visual)

### Contexto Histórico e Evolução

**Pre-Prettier (manual formatting):** Formatação manual inconsistente.

```javascript
// Cada desenvolvedor formata diferente
function add(a,b){return a+b;}  // Dev A
function subtract( a, b ) {     // Dev B
  return a - b
}
```

**Prettier 0.1 (2017):** Release inicial por James Long.

```javascript
// Prettier 0.1 - JavaScript only
prettier index.js --write
```

**Motivação:** Automatizar formatação, eliminar debates.

**Prettier 1.0 (2017):** Release estável.

```javascript
// Prettier 1.0 - stable
{
  "printWidth": 80,
  "tabWidth": 2,
  "semi": true
}
```

**Prettier 1.5 (2017):** Suporte a TypeScript.

```typescript
// Prettier 1.5 - TypeScript support
interface User {
  name: string;
  age: number;
}
```

**Prettier 1.10 (2018):** Suporte a JSX/TSX.

```tsx
// Prettier 1.10 - React support
const Button = ({ label }: { label: string }) => (
  <button>{label}</button>
);
```

**Prettier 1.19 (2019):** Melhor performance.

```javascript
// Prettier 1.19 - cache support
prettier --write "src/**/*.ts" --cache
```

**Prettier 2.0 (2020):** Melhorias TypeScript.

```typescript
// Prettier 2.0 - melhor TypeScript
type User = {
  name: string;
  age: number;
};
```

**Prettier 2.8 (2022):** Suporte a TypeScript 4.9+.

```typescript
// Prettier 2.8 - TypeScript 4.9
const value = expr satisfies Type;
```

**Prettier 3.0 (2023):** Migração para ESM, melhor performance.

```javascript
// Prettier 3.0 - ESM
import prettier from "prettier";

const formatted = await prettier.format(code, {
  parser: "typescript"
});
```

**Antes vs Depois:**

**Pré-Prettier (manual):**
```javascript
// Formatação manual - inconsistente
const x={a:1,b:2};
const y = { a: 1, b: 2 }
```

**Pós-Prettier (automated):**
```typescript
// Formatação automática - consistente
const x = { a: 1, b: 2 };
const y = { a: 1, b: 2 };
```

**Evolução TypeScript:**

**TypeScript inicial (sem Prettier):**
```typescript
// Formatação manual
interface User{name:string;age:number}
```

**TypeScript moderno (com Prettier):**
```typescript
// Prettier formata automaticamente
interface User {
  name: string;
  age: number;
}
```

### Problema Fundamental que Resolve

Prettier resolve problemas de **formatting inconsistency**, **code review noise**, e **developer productivity**.

**Problema 1: Formatação inconsistente**
```typescript
// Sem Prettier - cada desenvolvedor formata diferente ❌

// Dev A - compact style
const user={name:"John",age:30};
function add(a:number,b:number){return a+b;}

// Dev B - spaced style
const user = { name: "John", age: 30 };
function add( a: number, b: number ) {
  return a + b;
}

// Dev C - mixed style
const user = {name:"John", age:30}
function add(a: number,b:number) {return a+b}

// Codebase inconsistente, difícil de ler
```

**Solução: Prettier garante consistência**
```typescript
// Com Prettier - formatação única ✅

// Todos desenvolvem
const user = { name: "John", age: 30 };
function add(a: number, b: number) {
  return a + b;
}

// Prettier formata automaticamente
// Codebase 100% consistente ✅
```

**Problema 2: Code review focado em estilo**
```typescript
// Sem Prettier - reviews discutem estilo ❌

// PR Review Comments:
// "Use double quotes"
// "Add space before parenthesis"
// "Inconsistent indentation"
// "Missing semicolon"

// Tempo desperdiçado discutindo formatação
// ao invés de lógica do código
```

**Solução: Prettier elimina discussões de estilo**
```typescript
// Com Prettier - reviews focam em lógica ✅

// PR Review Comments:
// "Consider edge case when value is null"
// "This function could be optimized"
// "Add tests for error handling"

// Zero discussões sobre formatação
// Foco em qualidade do código ✅
```

**Problema 3: Tempo perdido formatando**
```typescript
// Sem Prettier - formatar manualmente ❌

// Developer escrevendo código:
const user={name:"John",age:30,email:"john@example.com",address:{street:"Main St",city:"Paris",country:"France"}}

// Precisa formatar manualmente:
// 1. Adicionar espaços
// 2. Quebrar linhas longas
// 3. Alinhar propriedades
// 4. Adicionar vírgulas

// 5 minutos formatando...

const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    street: "Main St",
    city: "Paris",
    country: "France",
  },
};
```

**Solução: Prettier formata automaticamente**
```typescript
// Com Prettier - formata instantaneamente ✅

// Developer escreve:
const user={name:"John",age:30,email:"john@example.com",address:{street:"Main St",city:"Paris",country:"France"}}

// Save file (Ctrl+S)
// Prettier formata automaticamente ✅

const user = {
  name: "John",
  age: 30,
  email: "john@example.com",
  address: {
    street: "Main St",
    city: "Paris",
    country: "France",
  },
};

// Zero tempo formatando manualmente
```

**Problema 4: Merge conflicts por formatação**
```typescript
// Sem Prettier - conflicts desnecessários ❌

// Branch A
const user = { name: "John", age: 30 };

// Branch B
const user = {name:"John",age:30};

// Git merge conflict apenas por formatação diferente
// <<<<<<< HEAD
// const user = { name: "John", age: 30 };
// =======
// const user = {name:"John",age:30};
// >>>>>>> branch-b
```

**Solução: Prettier elimina formatting conflicts**
```typescript
// Com Prettier - formatação sempre igual ✅

// Branch A (após Prettier)
const user = { name: "John", age: 30 };

// Branch B (após Prettier)
const user = { name: "John", age: 30 };

// Git merge sem conflicts
// Formatação idêntica ✅
```

**Fundamento teórico:** Prettier implementa **automated normalization** - código normalizado automaticamente elimina variações de formatação.

### Importância no Ecossistema

Prettier é importante porque:

- **Consistency:** Código 100% consistente automaticamente
- **Productivity:** Elimina tempo formatando manualmente
- **Code Review:** Foco em lógica ao invés de estilo
- **Team Harmony:** Elimina debates sobre formatação
- **Git Diffs:** Diffs limpas sem noise de formatação
- **Onboarding:** Novos desenvolvedores não precisam aprender style guide
- **Editor Agnostic:** Funciona em qualquer editor
- **Integration:** Integra com ESLint, Git hooks, CI/CD

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Opinionated:** Opções mínimas, decisões fixas
2. **AST Rewriting:** Parse → AST → Re-print
3. **Deterministic:** Mesma entrada = mesma saída
4. **Zero Config:** Funciona out-of-the-box
5. **Fast:** Formatação instantânea

### Pilares Fundamentais

- **CLI:** Executar via linha de comando
- **Config:** .prettierrc para customização
- **Ignore:** .prettierignore para excluir arquivos
- **Editor Integration:** Formatar on save
- **Git Hooks:** Formatar pre-commit

### Visão Geral das Nuances

- **Opinionated:** Poucas opções configuráveis
- **Language Support:** JavaScript, TypeScript, JSX, JSON, CSS, etc.
- **Auto-fix:** Reescreve código automaticamente
- **Idempotent:** Formatar código já formatado não muda nada
- **Preserves Semantics:** Formatação não altera comportamento

## 🧠 Fundamentos Teóricos

### Installation

```bash
# Instalar Prettier
npm install --save-dev prettier

# Ou com yarn
yarn add -D prettier

# Ou global
npm install -g prettier
```

**Installation:** Instalar via npm.

### Basic Usage

```bash
# Formatar arquivo
npx prettier index.ts --write

# Formatar múltiplos arquivos
npx prettier "src/**/*.ts" --write

# Checar formatação sem modificar
npx prettier "src/**/*.ts" --check

# Formatar stdin
echo "const x={a:1}" | npx prettier --parser typescript
```

**Usage:** Comandos básicos.

### Configuration

```json
// .prettierrc - configuração

{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "quoteProps": "as-needed",
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Configuration:** Arquivo .prettierrc.

### Princípios e Conceitos Subjacentes

#### Common Options

```json
// Opções comuns

{
  // Largura máxima de linha (default: 80)
  "printWidth": 100,
  
  // Tamanho do tab (default: 2)
  "tabWidth": 2,
  
  // Usar tabs ao invés de espaços (default: false)
  "useTabs": false,
  
  // Semicolons (default: true)
  "semi": true,
  
  // Aspas simples (default: false)
  "singleQuote": true,
  
  // Trailing commas (default: "es5")
  // "none" | "es5" | "all"
  "trailingComma": "all",
  
  // Espaços em objetos (default: true)
  "bracketSpacing": true,
  
  // Parênteses em arrow functions (default: "always")
  // "always" | "avoid"
  "arrowParens": "avoid",
  
  // Line endings (default: "lf")
  // "lf" | "crlf" | "cr" | "auto"
  "endOfLine": "lf"
}
```

**Options:** Opções principais.

#### Ignore Files

```javascript
// .prettierignore

node_modules
dist
build
coverage
*.min.js
*.min.css
package-lock.json
yarn.lock
```

**Ignore:** Arquivos ignorados.

### Editor Integration

```json
// VS Code - settings.json

{
  // Prettier como formatador padrão
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // Formatar on save
  "editor.formatOnSave": true,
  
  // Formatar apenas arquivos com Prettier config
  "prettier.requireConfig": true,
  
  // Formatar on paste
  "editor.formatOnPaste": true
}
```

**Editor:** Integração com VS Code.

#### Package.json Scripts

```json
// package.json

{
  "scripts": {
    "format": "prettier --write 'src/**/*.ts'",
    "format:check": "prettier --check 'src/**/*.ts'"
  }
}
```

**Scripts:** Scripts npm.

### ESLint Integration

```bash
# Instalar plugins
npm install --save-dev eslint-config-prettier eslint-plugin-prettier

# eslint-config-prettier desabilita rules ESLint conflitantes
# eslint-plugin-prettier roda Prettier como ESLint rule
```

**.eslintrc.json:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"  // Deve ser último para desabilitar rules conflitantes
  ],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": "error"
  }
}
```

**ESLint:** Integração ESLint + Prettier.

#### Pre-commit Hooks

```bash
# Instalar lint-staged e husky
npm install --save-dev lint-staged husky

# Inicializar husky
npx husky install

# Criar pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**package.json:**
```json
{
  "lint-staged": {
    "*.ts": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```

**Pre-commit:** Formatar antes de commit.

### CI/CD Integration

```yaml
# GitHub Actions - format check

name: Format
on: [push, pull_request]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run format:check
```

**CI/CD:** Validar formatação no CI.

#### Configuration Files

```javascript
// Diferentes formatos de config

// .prettierrc (JSON)
{
  "semi": true
}

// .prettierrc.json
{
  "semi": true
}

// .prettierrc.js
module.exports = {
  semi: true
};

// .prettierrc.mjs (ES Module)
export default {
  semi: true
};

// prettier.config.js
export default {
  semi: true
};

// package.json
{
  "prettier": {
    "semi": true
  }
}
```

**Config Files:** Diferentes formatos.

### Overrides

```json
// Configurações diferentes por tipo de arquivo

{
  "semi": true,
  "overrides": [
    {
      "files": "*.json",
      "options": {
        "printWidth": 120
      }
    },
    {
      "files": "*.md",
      "options": {
        "proseWrap": "always"
      }
    }
  ]
}
```

**Overrides:** Config por tipo de arquivo.

#### Inline Ignore

```typescript
// Ignorar formatação inline

// prettier-ignore
const matrix = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

// Prettier não formata block acima

// prettier-ignore
function add(a:number,b:number){return a+b}

// Range ignore
// prettier-ignore-start
const x={a:1};
const y={b:2};
// prettier-ignore-end
```

**Ignore:** Ignorar formatação específica.

### Modelo Mental para Compreensão

Pense em Prettier como **automated stylist**:

**Manual styling:** Developer formata manualmente
**Prettier:** Stylist automático que aplica estilo consistente

**Analogia - Auto-correct:**

**Prettier:** Auto-correct para código
**Developer:** Escreve livremente
**Prettier:** Corrige automaticamente

**Metáfora - Washing Machine:**

**Dirty clothes:** Código mal formatado
**Washing machine (Prettier):** Limpa automaticamente
**Clean clothes:** Código bem formatado

**Fluxo de Prettier:**
```
1. Code escrito livremente (qualquer formatação)
2. Save file (Ctrl+S)
3. Prettier parse → AST
4. Prettier descarta formatação original
5. Prettier re-imprime com estilo consistente
6. File formatado automaticamente
```

**Exemplo visual:**
```
Input (qualquer formatação)
        ↓
Parser
        ↓
Abstract Syntax Tree
        ↓
Printer (regras Prettier)
        ↓
Output (formatação consistente)
```

## 🔍 Análise Conceitual Profunda

### Opinionated Philosophy

```typescript
// Prettier é opinionated - poucas opções

// ✅ Configurável
{
  "printWidth": 100,    // Largura máxima
  "semi": true,         // Semicolons
  "singleQuote": false  // Aspas
}

// ❌ NÃO configurável
// - Indentação (sempre 2 ou 4 spaces/tab)
// - Bracket position (sempre same line)
// - Operator spacing (sempre espaçado)

// Filosofia: "menos opções = menos debates"
```

**Philosophy:** Opinionated minimiza decisões.

#### Deterministic Output

```typescript
// Prettier é deterministic - mesma entrada = mesma saída

// Input (qualquer formatação)
const   user={name:"John",  age:30}

// Output (sempre igual)
const user = { name: "John", age: 30 };

// Executar Prettier 100x = mesmo resultado
// Garantia de consistência ✅
```

**Deterministic:** Output previsível.

### Performance

```bash
# Prettier é rápido

# Formatar projeto inteiro (~1000 arquivos)
time prettier "src/**/*.ts" --write

# ~2-5 segundos
# Performance adequada para CI/CD

# Cache para melhor performance
prettier "src/**/*.ts" --write --cache
```

**Performance:** Formatação rápida.

#### Language Support

```javascript
// Prettier suporta múltiplas linguagens

prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss,md,html,yaml}"

// JavaScript/TypeScript
// JSX/TSX (React)
// JSON
// CSS/SCSS/Less
// Markdown
// HTML
// YAML
// GraphQL
```

**Languages:** Suporte multi-linguagem.

### Prettier vs ESLint

```typescript
// Prettier e ESLint resolvem problemas diferentes

// ✅ Prettier - Formatação (style)
const user = { name: "John", age: 30 };
// - Espaços, quebras de linha, indentação
// - Aspas, semicolons, trailing commas

// ✅ ESLint - Qualidade (bugs, anti-patterns)
// - no-unused-vars
// - no-explicit-any
// - prefer-const
// - Lógica do código

// Usar ambos juntos:
// Prettier formata
// ESLint valida qualidade
```

**Prettier vs ESLint:** Complementares.

#### Recommended Config

```json
// Configuração recomendada

{
  // Largura razoável (80-100)
  "printWidth": 100,
  
  // Tab size padrão
  "tabWidth": 2,
  
  // Espaços (não tabs)
  "useTabs": false,
  
  // Semicolons para clareza
  "semi": true,
  
  // Double quotes (padrão TS)
  "singleQuote": false,
  
  // Trailing commas ES5 (objetos, arrays)
  "trailingComma": "es5",
  
  // Espaços em objetos
  "bracketSpacing": true,
  
  // Parênteses sempre em arrows
  "arrowParens": "always",
  
  // Line endings Unix
  "endOfLine": "lf"
}
```

**Recommended:** Config padrão recomendada.

### Migration Strategy

```typescript
// Migrar projeto para Prettier

// 1. Instalar Prettier
npm install --save-dev prettier

// 2. Criar .prettierrc
{
  "semi": true,
  "singleQuote": false
}

// 3. Criar .prettierignore
node_modules
dist
*.min.js

// 4. Formatar codebase inteira
npx prettier --write "src/**/*.ts"

// 5. Commit formatação
git add .
git commit -m "chore: format codebase with prettier"

// 6. Configurar pre-commit hook
npm install --save-dev husky lint-staged

// 7. Configurar editor (format on save)

// 8. Adicionar CI check
npm run format:check
```

**Migration:** Como migrar projeto existente.

#### Common Issues

```typescript
// Issues comuns

// 1. Conflitos ESLint + Prettier
// Solução: eslint-config-prettier

// 2. Formatação diferente em Windows/Mac
// Solução: "endOfLine": "lf"

// 3. Prettier modifica arquivos gerados
// Solução: .prettierignore

// 4. Performance lenta em projetos grandes
// Solução: --cache

// 5. Editor não formata on save
// Solução: configurar editor integration
```

**Issues:** Problemas comuns e soluções.

### Team Adoption

```typescript
// Adotar Prettier em equipe

// 1. Discutir com equipe
// Mostrar benefícios: consistência, produtividade

// 2. Definir config
// Votar em opções principais (semi, quotes, etc.)

// 3. Criar branch de formatação
// Formatar codebase inteira em branch separada

// 4. Review e merge
// Review formatação, merge quando aprovado

// 5. Configurar tooling
// Pre-commit hooks, CI checks

// 6. Documentar
// README com instruções de setup

// 7. Onboarding
// Novos devs configuram editor
```

**Team:** Adoção em equipe.

## 🎯 Aplicabilidade e Contextos

### Startups

```json
{
  "semi": true,
  "singleQuote": false
}
```

**Raciocínio:** Config simples, foco em produtividade.

### Enterprise

```json
{
  "printWidth": 100,
  "tabWidth": 4,
  "semi": true
}
```

**Raciocínio:** Config padronizada em toda organização.

### Open Source

```json
{
  "printWidth": 80,
  "semi": true
}
```

**Raciocínio:** Config universal, padrões amplamente aceitos.

## ⚠️ Limitações e Considerações Teóricas

### Limited Configurability

```typescript
// Prettier tem poucas opções
// Não pode customizar tudo
```

**Limitação:** Opinionated = menos flexibilidade.

### Opinionated Choices

```typescript
// Algumas decisões podem não agradar
// Ex: bracket position, operator spacing
```

**Consideração:** Aceitar opiniões do Prettier.

### Not a Linter

```typescript
// Prettier não detecta bugs
// Use ESLint para qualidade
```

**Limitação:** Apenas formatação, não qualidade.

## 🔗 Interconexões Conceituais

**Relação com ESLint:** Complementares (formatação + qualidade).

**Relação com EditorConfig:** Prettier sobrescreve EditorConfig.

**Relação com Git:** Diffs limpas, pre-commit hooks.

**Relação com CI/CD:** Format checks em pipelines.

**Relação com IDEs:** Format on save.

## 🚀 Evolução e Próximos Conceitos

Dominar Prettier prepara para:
- **.eslintrc Configuration:** Config avançada ESLint
- **Editor Integration:** Configurar IDEs
- **Pre-commit Hooks:** Git hooks com Husky
- **CI/CD Pipelines:** Automação completa
- **Team Workflows:** Processos de equipe
