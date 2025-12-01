# Integração com Editor

## 🎯 Introdução e Definição

### Definição Conceitual

**Integração com editor** é **configuração de IDE** para executar **ESLint e Prettier automaticamente** durante desenvolvimento. Diferentemente de CLI execution (manual via terminal), integração com editor fornece **feedback em tempo real** - erros exibidos inline conforme código é escrito. Permite **auto-fix on save** - correções automáticas ao salvar arquivo. Transforma IDE em **linting-aware environment**.

Conceitualmente, integração com editor implementa **real-time feedback loop** - desenvolvedor recebe feedback imediato sobre problemas. Segue **shift-left testing principle** - detectar problemas mais cedo no ciclo (durante codificação, não em CI/CD). Facilita **frictionless development** - correções aplicadas automaticamente sem interromper workflow. Permite **visual indicators** - squiggles (linhas onduladas) mostram erros diretamente no código.

**Fundamento teórico:** Integração com editor deriva de **IDE plugin architecture** - extensions que adicionam funcionalidade ao editor. Suporta **Language Server Protocol (LSP)** - protocolo standardizado para comunicação IDE-language tools. Permite **workspace settings** - configuração por projeto ao invés de global. VS Code, WebStorm, Vim, etc. suportam ESLint/Prettier via extensions.

**Pattern básico (VS Code):**
```json
// .vscode/settings.json - configuração VS Code

{
  // ESLint
  "eslint.enable": true,
  "eslint.validate": ["javascript", "typescript"],
  "eslint.run": "onType",
  
  // Prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  
  // Auto-fix ESLint on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**Diferença fundamental:**
- **CLI execution:** Manual, terminal, CI/CD
- **Editor integration:** Automático, real-time, IDE

### Contexto Histórico e Evolução

**IDEs iniciais (2000s):** Sem linting integrado.

```javascript
// Sem integração - erros descobertos em runtime ❌
const x = "hello"  // Sem semi - só descobre rodando
```

**JSLint (2002):** Primeiro linter.

```javascript
// JSLint - rodar manualmente via website
// Copiar código → colar no jslint.com → ver erros
```

**JSHint editor plugins (2011):** Primeiras integrações.

```javascript
// JSHint plugin para Sublime Text
// Erros aparecem no editor
```

**ESLint (2013):** Architecture plugável.

```javascript
// ESLint com plugin Sublime
{
  "linters": {
    "eslint": {
      "enable": true
    }
  }
}
```

**VS Code ESLint extension (2015):** Extension oficial.

```json
// settings.json - VS Code
{
  "eslint.enable": true
}
```

**Format on save (2016):** Auto-formatação.

```json
// Format on save
{
  "editor.formatOnSave": true
}
```

**Prettier extension (2017):** Prettier para VS Code.

```json
// Prettier extension
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**Code Actions on Save (2018):** Auto-fix ESLint.

```json
// Auto-fix on save
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**TypeScript integration (2019):** Type-aware linting.

```json
// Type-aware ESLint no editor
{
  "eslint.validate": ["typescript"]
}
```

**Language Server Protocol (2020):** LSP standardiza integração.

```javascript
// LSP - protocolo standard para IDE-tool communication
```

**Antes vs Depois:**

**Pré-integração (2010):**
```javascript
// Escrever código
const x = "hello"

// Rodar ESLint manualmente
npx eslint file.ts

// Ver erros no terminal
// Voltar ao editor, corrigir
// Rodar ESLint novamente
```

**Pós-integração (2023):**
```javascript
// Escrever código
const x = "hello"

// Squiggle vermelho aparece instantaneamente ✅
// Hover mostra mensagem de erro
// Salvar arquivo → auto-fix aplica correção
```

**Evolução VS Code:**

**VS Code inicial (2015):**
```json
{
  "eslint.enable": true
}
```

**VS Code moderno (2024):**
```json
{
  "eslint.enable": true,
  "eslint.validate": ["javascript", "typescript"],
  "eslint.run": "onType",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Problema Fundamental que Resolve

Integração com editor resolve problemas de **delayed feedback**, **manual correction**, e **context switching**.

**Problema 1: Feedback atrasado**
```typescript
// Sem integração - descobrir erros tarde demais ❌

// Escrever código com erros
function calc(x: any) {
  console.log(x);
  return x + 1
}

// Commit código
git commit -m "Add calc"

// CI/CD roda ESLint
// ✗ Error: @typescript-eslint/no-explicit-any
// ✗ Error: no-console
// ✗ Error: semi

// Build falha
// Volta para corrigir (tarde demais)
```

**Solução: Feedback em tempo real**
```typescript
// Com integração - erros aparecem enquanto digita ✅

// Digitar "function calc(x: any)"
// Squiggle vermelho aparece em "any" imediatamente
// Hover mostra: "Unexpected any. Specify type instead."

// Corrige antes mesmo de terminar função
function calc(x: number) {  // ✅ Corrigido instantaneamente
  console.log(x);  // Squiggle em console.log
  return x + 1;  // Squiggle - falta semi
}

// Salvar arquivo → auto-fix adiciona semi
function calc(x: number) {
  console.log(x);
  return x + 1;  // ✅ Semi adicionado automaticamente
}
```

**Problema 2: Correção manual repetitiva**
```typescript
// Sem auto-fix - corrigir manualmente cada erro ❌

// Escrever código
const name = 'John'
const age = 30
const city = 'NYC'

// Rodar ESLint
npx eslint file.ts
// ✗ Error: Expected double quotes (name)
// ✗ Error: Expected double quotes (age)
// ✗ Error: Expected double quotes (city)

// Corrigir manualmente cada linha
const name = "John";  // Mudou manualmente
const age = 30;
const city = "NYC";   // Mudou manualmente

// Demorado e tedioso
```

**Solução: Auto-fix on save**
```typescript
// Com auto-fix - correções automáticas ✅

// Escrever código com erros
const name = 'John'
const age = 30
const city = 'NYC'

// Salvar arquivo (Ctrl+S)
// Auto-fix aplica correções automaticamente

// Código após salvar:
const name = "John";  // ✅ Aspas corrigidas automaticamente
const age = 30;
const city = "NYC";   // ✅ Aspas corrigidas automaticamente

// Zero esforço manual
```

**Problema 3: Context switching**
```typescript
// Sem integração - trocar entre editor e terminal ❌

// 1. Escrever código no editor
function hello() {
  console.log("Hello")
}

// 2. Salvar arquivo

// 3. Trocar para terminal
npx eslint src/hello.ts

// 4. Ler erros no terminal
// ✗ Error: Missing return type

// 5. Voltar para editor

// 6. Corrigir
function hello(): void {
  console.log("Hello");
}

// 7. Trocar para terminal novamente

// 8. Rodar ESLint novamente
npx eslint src/hello.ts

// 9. Verificar se passou

// Context switching constante - lento
```

**Solução: Feedback integrado**
```typescript
// Com integração - tudo no editor ✅

// Escrever código
function hello() {  // Squiggle aparece imediatamente
  console.log("Hello");
}

// Hover sobre função mostra erro inline
// "Missing return type annotation."

// Corrigir diretamente
function hello(): void {  // ✅ Squiggle desaparece
  console.log("Hello");
}

// Sem sair do editor - workflow fluido
```

**Problema 4: Configuração inconsistente entre devs**
```json
// Sem workspace settings - cada dev configura diferente ❌

// Dev A - local settings
{
  "editor.formatOnSave": true
}

// Dev B - local settings
{
  "editor.formatOnSave": false
}

// Dev C - sem settings

// Código formatado inconsistentemente
```

**Solução: Workspace settings**
```json
// .vscode/settings.json - versionado no Git ✅

{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}

// Todos devs clonam repositório
// Todos usam mesmas settings
// Consistência garantida ✅
```

**Fundamento teórico:** Integração com editor implementa **immediate feedback principle** - erro detectado e corrigido instantaneamente.

### Importância no Ecossistema

Integração com editor é importante porque:

- **Real-time feedback:** Erros aparecem enquanto digita
- **Auto-fix:** Correções automáticas on save
- **Productivity:** Menos context switching
- **Consistency:** Workspace settings versionadas
- **Early detection:** Shift-left - problemas detectados cedo
- **Visual indicators:** Squiggles mostram erros inline
- **Quick fixes:** Sugestões de correção (lightbulb)
- **Seamless workflow:** Integração transparente

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Real-time:** Feedback instantâneo
2. **Auto-fix:** Correções automáticas
3. **Workspace settings:** Config versionada
4. **Extensions:** Plugins para IDEs
5. **LSP:** Language Server Protocol

### Pilares Fundamentais

- **ESLint extension:** Plugin ESLint para IDE
- **Prettier extension:** Plugin Prettier para IDE
- **Settings.json:** Configuração workspace (VS Code)
- **Format on save:** Auto-formatação
- **Code actions:** Auto-fix ESLint

### Visão Geral das Nuances

- **onType vs onSave:** Quando executar linting
- **Explicit vs always:** Quando aplicar auto-fix
- **Per-language settings:** Config por linguagem
- **Multi-root workspaces:** Monorepos
- **Extension conflicts:** Múltiplos formatters

## 🧠 Fundamentos Teóricos

### VS Code - Basic Setup

```json
// .vscode/settings.json - configuração básica

{
  // ESLint extension
  "eslint.enable": true,
  
  // Linguagens suportadas
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  
  // Quando executar ESLint
  "eslint.run": "onType",  // ou "onSave"
  
  // Prettier extension
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // Format on save
  "editor.formatOnSave": true,
  
  // Auto-fix ESLint on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**Basic Setup:** Configuração essencial VS Code.

### VS Code - Complete Configuration

```json
// .vscode/settings.json - configuração completa

{
  // ESLint
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "eslint.run": "onType",
  "eslint.workingDirectories": [{ "mode": "auto" }],
  "eslint.codeActionsOnSave.mode": "all",
  
  // Prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "editor.formatOnType": false,
  
  // Per-language settings
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // Code actions on save
  "editor.codeActionsOnSave": {
    // ESLint auto-fix
    "source.fixAll.eslint": "explicit",
    
    // Organize imports
    "source.organizeImports": "explicit"
  },
  
  // Files
  "files.autoSave": "onFocusChange",
  "files.eol": "\n",
  
  // TypeScript
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**Complete:** Configuração completa VS Code.

### Princípios e Conceitos Subjacentes

#### ESLint Run Options

```json
// Quando executar ESLint

{
  // Executar enquanto digita (real-time)
  "eslint.run": "onType",
  
  // Executar apenas ao salvar (menos overhead)
  "eslint.run": "onSave"
}
```

**Run Options:** onType vs onSave.

#### Code Actions Mode

```json
// Modo de code actions

{
  "editor.codeActionsOnSave": {
    // "explicit" - apenas quando salvar via Ctrl+S
    "source.fixAll.eslint": "explicit",
    
    // "always" - sempre ao salvar (incluindo auto-save)
    "source.fixAll.eslint": "always",
    
    // "never" - desabilitar
    "source.fixAll.eslint": "never"
  }
}
```

**Mode:** explicit vs always.

### Per-Language Settings

```json
// Configurações diferentes por linguagem

{
  // Default formatter
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // TypeScript - usar Prettier
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  
  // JSON - usar Prettier
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  // Markdown - usar Prettier
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  
  // Python - usar outro formatter
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  }
}
```

**Per-Language:** Settings por linguagem.

#### Working Directories

```json
// ESLint working directories (para monorepos)

{
  "eslint.workingDirectories": [
    // Auto-detect (recomendado)
    { "mode": "auto" },
    
    // Ou especificar diretórios
    "./packages/api",
    "./packages/web"
  ]
}
```

**Working Dirs:** Configuração monorepo.

### Organize Imports

```json
// Organizar imports automaticamente

{
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  }
}
```

**Organize Imports:** Ordenar imports automaticamente.

#### Recommended Extensions

```json
// .vscode/extensions.json - extensões recomendadas

{
  "recommendations": [
    // ESLint
    "dbaeumer.vscode-eslint",
    
    // Prettier
    "esbenp.prettier-vscode",
    
    // EditorConfig
    "editorconfig.editorconfig"
  ]
}
```

**Extensions:** Recomendações para equipe.

### Keyboard Shortcuts

```json
// keybindings.json - atalhos customizados

[
  // Format document
  {
    "key": "ctrl+shift+f",
    "command": "editor.action.formatDocument"
  },
  
  // ESLint: Fix all auto-fixable problems
  {
    "key": "ctrl+shift+e",
    "command": "eslint.executeAutofix"
  },
  
  // Organize imports
  {
    "key": "ctrl+shift+o",
    "command": "editor.action.organizeImports"
  }
]
```

**Shortcuts:** Atalhos úteis.

#### WebStorm/IntelliJ Configuration

```javascript
// WebStorm - Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint

- Enable: true
- Automatic ESLint configuration
- Run eslint --fix on save: true

// Settings → Languages & Frameworks → JavaScript → Prettier
- Prettier package: node_modules/prettier
- Run on save: true
- Run on 'Reformat Code' action: true

// File → Settings → Editor → Code Style
- Enable EditorConfig support: true

// Settings → Tools → Actions on Save
- Run eslint --fix: true
- Run Prettier: true
```

**WebStorm:** Configuração IntelliJ.

### Vim/Neovim - ALE

```vim
" .vimrc - ALE (Asynchronous Lint Engine)

" Instalar ALE
Plug 'dense-analysis/ale'

" ESLint
let g:ale_linters = {
\   'javascript': ['eslint'],
\   'typescript': ['eslint'],
\}

" Prettier
let g:ale_fixers = {
\   'javascript': ['prettier'],
\   'typescript': ['prettier'],
\}

" Auto-fix on save
let g:ale_fix_on_save = 1

" Show errors inline
let g:ale_sign_error = '✗'
let g:ale_sign_warning = '⚠'
```

**Vim:** ALE configuration.

#### Vim/Neovim - Coc.nvim

```vim
" .vimrc - Coc.nvim

" Instalar Coc
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" Instalar extensions
:CocInstall coc-eslint coc-prettier

" coc-settings.json
{
  "eslint.autoFixOnSave": true,
  "prettier.onlyUseLocalVersion": true,
  "coc.preferences.formatOnSaveFiletypes": [
    "javascript",
    "typescript",
    "json"
  ]
}
```

**Neovim:** Coc.nvim configuration.

### Multi-root Workspaces

```json
// workspace.code-workspace - monorepo

{
  "folders": [
    { "path": "packages/api" },
    { "path": "packages/web" }
  ],
  "settings": {
    "eslint.enable": true,
    "eslint.workingDirectories": [
      { "mode": "auto" }
    ]
  }
}
```

**Multi-root:** Configuração monorepo.

#### Troubleshooting

```json
// ESLint não funcionando

// 1. Verificar se extension está instalada
// 2. Verificar output ESLint
// View → Output → ESLint

// 3. Restart ESLint Server
// Ctrl+Shift+P → ESLint: Restart ESLint Server

// 4. Verificar se .eslintrc existe
// 5. Verificar se node_modules/eslint existe

// 6. Verificar settings
{
  "eslint.enable": true,
  "eslint.validate": ["typescript"]
}
```

**Troubleshooting:** Problemas comuns.

### Disable Formatting for Specific Files

```json
// Desabilitar formatação para arquivos específicos

{
  "[markdown]": {
    "editor.formatOnSave": false
  },
  
  // Ou criar .prettierignore
  // dist/
  // build/
  // *.min.js
}
```

**Disable:** Desabilitar para arquivos específicos.

#### Modelo Mental para Compreensão

Pense em integração com editor como **spell checker**:

**Spell checker:** Sublinha palavras erradas
**ESLint integration:** Sublinha código errado
**Auto-correct:** Correção automática

**Analogia - GPS:**

**GPS:** Alerta rotas erradas em tempo real
**Editor integration:** Alerta erros em tempo real
**Recalculate route:** Auto-fix corrige caminho

**Metáfora - Grammarly:**

**Grammarly:** Corrige gramática enquanto digita
**ESLint+Prettier:** Corrige código enquanto digita
**Suggestions:** Quick fixes

**Fluxo de integração:**
```
1. Desenvolvedor digita código
2. Extension detecta mudanças
3. ESLint analisa código via Language Server
4. Problemas aparecem como squiggles
5. Desenvolvedor salva arquivo
6. Auto-fix aplica correções
7. Prettier formata código
8. Arquivo salvo com código correto
```

**Exemplo visual:**
```
Editor (VS Code)
├── ESLint Extension
│   ├── Language Server (ESLint)
│   ├── Squiggles (erros inline)
│   └── Quick Fixes (lightbulb)
├── Prettier Extension
│   └── Formatter
└── Settings.json
    ├── formatOnSave: true
    └── codeActionsOnSave: fixAll.eslint
```

## 🔍 Análise Conceitual Profunda

### Best Practices

```json
// .vscode/settings.json - best practices

{
  // ESLint
  "eslint.enable": true,
  "eslint.validate": ["javascript", "typescript"],
  "eslint.run": "onType",
  
  // Prettier
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  
  // Auto-fix on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  
  // Files
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  
  // Extension recommendations
  ".vscode/extensions.json": {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode"
    ]
  }
}
```

**Best Practices:** Configuração recomendada.

#### Conflict Resolution (ESLint + Prettier)

```json
// Evitar conflitos ESLint/Prettier

{
  // 1. Instalar eslint-config-prettier
  // npm install --save-dev eslint-config-prettier
  
  // 2. .eslintrc.json - adicionar prettier no extends
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"  // Sempre último - desabilita rules conflitantes
  ],
  
  // 3. settings.json - usar Prettier para formatação
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  
  // 4. settings.json - ESLint para linting (não formatação)
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**Conflict Resolution:** Evitar conflitos.

### Performance Optimization

```json
// Otimizar performance

{
  // ESLint - apenas on save (não onType)
  "eslint.run": "onSave",
  
  // Desabilitar format on type (overhead)
  "editor.formatOnType": false,
  
  // Cache ESLint
  // .eslintrc.json
  "cache": true,
  "cacheLocation": ".eslintcache"
}
```

**Performance:** Otimizações.

## 🎯 Aplicabilidade e Contextos

### Team Setup

```json
// .vscode/settings.json - versionado
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}

// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

**Raciocínio:** Consistência entre equipe.

### Solo Developer

```json
// Local settings - preferences pessoais
{
  "eslint.run": "onType",
  "editor.formatOnSave": true
}
```

**Raciocínio:** Feedback máximo.

### CI/CD Alignment

```json
// Mesmas regras em editor e CI/CD
// .eslintrc.json, .prettierrc - versionados
// Editor usa mesmas configs
```

**Raciocínio:** Evitar surpresas em CI.

## ⚠️ Limitações e Considerações Teóricas

### Performance Impact

```json
// onType pode causar lag em projetos grandes
"eslint.run": "onSave"  // Menos overhead
```

**Limitação:** Performance.

### Extension Conflicts

```json
// Múltiplos formatters conflitando
// Especificar default formatter
{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**Consideração:** Conflitos.

### Learning Curve

```json
// Configuração pode intimidar iniciantes
// Fornecer settings.json pré-configurado
```

**Limitação:** Complexidade inicial.

## 🔗 Interconexões Conceituais

**Relação com ESLint:** Executa ESLint automaticamente.

**Relação com Prettier:** Formata código on save.

**Relação com .eslintrc:** Carrega configuração ESLint.

**Relação com Git:** Workspace settings versionadas.

**Relação com CI/CD:** Mesmas regras em dev e CI.

## 🚀 Evolução e Próximos Conceitos

Dominar integração com editor prepara para:
- **Pre-commit Hooks:** Git hooks automatizados
- **CI/CD Integration:** Validação em pipeline
- **Custom Rules:** Criar rules customizadas
- **Team Workflows:** Padronizar desenvolvimento
- **LSP:** Language Server Protocol profundo
