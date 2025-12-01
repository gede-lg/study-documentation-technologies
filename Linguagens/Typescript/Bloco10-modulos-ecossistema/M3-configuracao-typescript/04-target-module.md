# target e module: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`target`** define **versão ECMAScript** do JavaScript gerado (ES5, ES2015, ES2020, ESNext), determinando quais features modernas são transpiladas vs preservadas. **`module`** define **sistema de módulos** usado no output (CommonJS, ES Modules, AMD, UMD), controlando como imports/exports são transformados. Conceitualmente, representam **runtime compatibility configuration**, especificando para qual ambiente e formato seu código será compilado.

Na essência, target e module materializam o princípio de **progressive enhancement vs backward compatibility**, onde você escolhe entre usar features modernas (target alto) com menor compatibilidade ou transpilar para código mais antigo (target baixo) que funciona em ambientes legados.

## 📋 Fundamentos

### target - Versão ECMAScript

```json
{
  "compilerOptions": {
    "target": "ES5"      // IE11, navegadores antigos
    "target": "ES2015"   // ES6: classes, arrow functions
    "target": "ES2020"   // Optional chaining, nullish coalescing
    "target": "ESNext"   // Features mais recentes
  }
}
```

**Conceito-chave:** target define **até onde transpilar** - features mais novas que target são convertidas, features suportadas são preservadas.

### module - Sistema de Módulos

```json
{
  "compilerOptions": {
    "module": "commonjs"  // Node.js: require/module.exports
    "module": "esnext"    // ES Modules: import/export
    "module": "amd"       // RequireJS
    "module": "umd"       // Universal Module Definition
  }
}
```

**Conceito-chave:** module define **formato de import/export** no JavaScript gerado.

## 🔍 Análise Conceitual

### 1. target - Versões ECMAScript

#### ES5 (2009) - Compatibilidade Máxima

```typescript
// Input TypeScript
const greet = (name: string) => `Hello ${name}`;
class User {
  constructor(public name: string) {}
}
const value = obj?.prop ?? "default";
```

**Output com "target": "ES5":**
```javascript
var greet = function (name) { return "Hello " + name; };
var User = /** @class */ (function () {
    function User(name) {
        this.name = name;
    }
    return User;
}());
var value = (obj === null || obj === void 0 ? void 0 : obj.prop) !== null && (obj === null || obj === void 0 ? void 0 : obj.prop) !== void 0 ? obj.prop : "default";
```

**Conceito:** **Transpila tudo** - arrow functions → function, classes → constructor functions, optional chaining → verificações verbosas.

**Compatibilidade:** IE9+, todos navegadores modernos.

#### ES2015/ES6 (2015) - Primeira Grande Atualização

```typescript
// Input TypeScript
const greet = (name: string) => `Hello ${name}`;
class User {
  constructor(public name: string) {}
}
```

**Output com "target": "ES2015":**
```javascript
const greet = (name) => `Hello ${name}`;
class User {
    constructor(name) {
        this.name = name;
    }
}
```

**Features preservadas:**
- Arrow functions
- Classes nativas
- const/let
- Template literals
- Destructuring
- Promises

**Compatibilidade:** Edge 12+, Chrome 51+, Firefox 54+, Safari 10+.

#### ES2017 - Async/Await

```typescript
// Input
async function fetchData() {
  const response = await fetch("/api");
  return response.json();
}
```

**Output com "target": "ES2017":**
```javascript
async function fetchData() {
    const response = await fetch("/api");
    return response.json();
}
```

**Output com "target": "ES2015":**
```javascript
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/api");
        return response.json();
    });
}
```

**Features ES2017:**
- async/await (nativo)
- Object.entries/Object.values
- String padding

#### ES2020 - Features Modernas

```typescript
// Input
const name = user?.profile?.name ?? "Anonymous";
const big = 1_000_000n;
```

**Output com "target": "ES2020":**
```javascript
const name = user?.profile?.name ?? "Anonymous";
const big = 1000000n;
```

**Features ES2020:**
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- BigInt
- Dynamic import
- globalThis

**Compatibilidade:** Chrome 80+, Firefox 72+, Safari 13.1+.

#### ESNext - Bleeding Edge

```json
{
  "compilerOptions": {
    "target": "ESNext"  // Features mais recentes, pode mudar
  }
}
```

**Conceito:** ESNext inclui **proposals em estágio avançado**, pode incluir features que ainda não são padrão oficial.

**Uso:** Apenas quando bundler (Webpack/Vite) fará transpilação final.

### 2. module - Sistemas de Módulos

#### CommonJS - Node.js Padrão

```typescript
// Input TypeScript
export function sum(a: number, b: number): number {
  return a + b;
}

export default class Calculator {}
```

**Output com "module": "commonjs":**
```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = void 0;

function sum(a, b) {
    return a + b;
}
exports.sum = sum;

class Calculator {}
exports.default = Calculator;
```

**Características:**
- Síncrono
- `require()` e `module.exports`
- Usado no Node.js
- Runtime resolution

**Import em CommonJS:**
```javascript
const { sum } = require("./math");
const Calculator = require("./Calculator").default;
```

#### ES2015/ESNext - ES Modules

```typescript
// Input TypeScript
export function sum(a: number, b: number): number {
  return a + b;
}

export default class Calculator {}
```

**Output com "module": "esnext":**
```javascript
export function sum(a, b) {
    return a + b;
}

export default class Calculator {}
```

**Características:**
- Assíncrono (top-level await)
- `import` e `export`
- Static analysis (tree-shaking)
- Usado em navegadores modernos
- Node.js 14+ com `.mjs` ou `"type": "module"`

**Import em ES Modules:**
```javascript
import { sum } from "./math.js";
import Calculator from "./Calculator.js";
```

#### AMD - RequireJS

```typescript
// Input
export function sum(a: number, b: number): number {
  return a + b;
}
```

**Output com "module": "amd":**
```javascript
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sum = void 0;

    function sum(a, b) {
        return a + b;
    }
    exports.sum = sum;
});
```

**Uso:** RequireJS (browser), legado.

#### UMD - Universal Module Definition

```typescript
// Input
export function sum(a: number, b: number): number {
  return a + b;
}
```

**Output com "module": "umd":**
```javascript
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sum = void 0;

    function sum(a, b) {
        return a + b;
    }
    exports.sum = sum;
});
```

**Conceito:** UMD detecta **ambiente** (CommonJS, AMD, global) e usa formato apropriado.

**Uso:** Bibliotecas universais que funcionam em Node.js, RequireJS e `<script>` tags.

### 3. Combinações Comuns

#### Node.js Backend

```json
{
  "compilerOptions": {
    "target": "ES2020",    // Node 14+ suporta ES2020
    "module": "commonjs",  // Node.js padrão
    "lib": ["ES2020"]
  }
}
```

**Rationale:**
- Node.js usa CommonJS nativamente
- ES2020 suportado desde Node 14
- Sem transpilação desnecessária

#### React/Vite Frontend

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",    // ES Modules
    "lib": ["ES2020", "DOM"]
  }
}
```

**Rationale:**
- Bundler (Vite) processa ES Modules
- Tree-shaking funciona melhor com ES Modules
- Target alto porque bundler transpila depois

#### Biblioteca Universal

```json
{
  "compilerOptions": {
    "target": "ES2015",    // Compatibilidade ampla
    "module": "umd",       // Funciona em todos ambientes
    "lib": ["ES2015"]
  }
}
```

**Rationale:**
- UMD funciona em Node.js, browsers, RequireJS
- ES2015 suportado por ~95% dos browsers

#### Node.js com ES Modules

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",    // Gera ES Modules
    "lib": ["ES2020"]
  }
}
```

**package.json:**
```json
{
  "type": "module"  // Node.js trata .js como ES Modules
}
```

**Conceito:** Node.js 14+ suporta **ES Modules nativos** com `"type": "module"` ou extensão `.mjs`.

### 4. lib - Definições de Tipo

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"]      // Define APIs disponíveis
  }
}
```

**Conceito:** `lib` controla **quais APIs TypeScript conhece**, independente de target.

**Combinações comuns:**

```json
{
  "compilerOptions": {
    // Node.js
    "target": "ES2020",
    "lib": ["ES2020"]  // Sem DOM

    // Browser
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]

    // Web Workers
    "target": "ES2020",
    "lib": ["ES2020", "WebWorker"]
  }
}
```

**Exemplo:**
```typescript
// Com "lib": ["ES2020", "DOM"]
document.querySelector(".button");  // ✅ OK
fetch("/api");                      // ✅ OK

// Com "lib": ["ES2020"] (sem DOM)
document.querySelector(".button");  // ❌ Erro: Cannot find name 'document'
```

### 5. moduleResolution

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"  // Algoritmo de resolução
  }
}
```

**Opções:**
- `"node"` - Algoritmo Node.js (procura node_modules, package.json)
- `"bundler"` - Para bundlers modernos (Vite, esbuild)
- `"classic"` - Legado (não use)

**Exemplo (node):**
```typescript
import { Button } from "react";

// TypeScript procura:
// 1. node_modules/react/package.json → campo "types" ou "main"
// 2. node_modules/react/index.d.ts
// 3. node_modules/@types/react/index.d.ts
```

## 🎯 Aplicabilidade

### Migração ES5 → ES2020

```json
// Fase 1: Suporte IE11
{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs"
  }
}

// Fase 2: Dropar IE11
{
  "compilerOptions": {
    "target": "ES2015",  // +10% menor output
    "module": "commonjs"
  }
}

// Fase 3: Modernização
{
  "compilerOptions": {
    "target": "ES2020",  // Optional chaining nativo
    "module": "esnext"   // ES Modules
  }
}
```

### Node.js LTS Versions

```json
// Node.js 12 (EOL 2022)
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs"
  }
}

// Node.js 14 LTS
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs"
  }
}

// Node.js 18+ LTS
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",  // ES Modules nativos
    "lib": ["ES2022"]
  }
}
```

### Biblioteca Multi-formato

```json
// tsconfig.json (desenvolvimento)
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "esnext"
  }
}

// tsconfig.cjs.json (CommonJS build)
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./dist/cjs"
  }
}

// tsconfig.esm.json (ES Modules build)
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "esnext",
    "outDir": "./dist/esm"
  }
}
```

**package.json:**
```json
{
  "main": "./dist/cjs/index.js",      // CommonJS
  "module": "./dist/esm/index.js",    // ES Modules
  "types": "./dist/esm/index.d.ts",
  "scripts": {
    "build": "npm run build:cjs && npm run build:esm",
    "build:cjs": "tsc -p tsconfig.cjs.json",
    "build:esm": "tsc -p tsconfig.esm.json"
  }
}
```

**Conceito:** Dual package - **exports CommonJS e ESM**, permitindo que consumidores escolham.

### Browserslist Integration

```json
// package.json
{
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions"
  ]
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",   // Navegadores modernos suportam
    "module": "esnext",
    "lib": ["ES2020", "DOM"]
  }
}
```

**Ferramentas como Babel/SWC podem usar browserslist para transpilação final.**

## ⚠️ Considerações

### 1. target vs lib

```json
{
  "compilerOptions": {
    // ❌ Inconsistente
    "target": "ES5",
    "lib": ["ES2020"]  // Promete APIs ES2020 mas gera ES5

    // Problema: código compila mas quebra em runtime
    // Array.prototype.flat() não existe em ES5
  }
}
```

**Regra:** `lib` deve ser **compatível** com `target` e ambiente runtime.

### 2. module vs target

```json
{
  "compilerOptions": {
    // ✅ Válido mas incomum
    "target": "ES5",
    "module": "esnext"  // ES Modules em ES5

    // Gera:
    // - Sintaxe ES5 (var, function)
    // - Mas usa import/export
  }
}
```

**Uso:** Quando bundler processa modules mas target precisa ser baixo.

### 3. Performance de Transpilação

```json
{
  // ❌ Lento: transpila tudo
  "target": "ES5"

  // ✅ Rápido: transpila menos
  "target": "ES2020"

  // Trade-off: compatibilidade vs performance de build
}
```

### 4. Tree Shaking

```json
{
  "compilerOptions": {
    // ❌ Ruim para tree-shaking
    "module": "commonjs"  // Dynamic require()

    // ✅ Ótimo para tree-shaking
    "module": "esnext"    // Static imports
  }
}
```

**Conceito:** ES Modules permitem **análise estática**, bundlers removem código não usado (tree-shaking).

### 5. Node.js Package Exports

```json
// package.json (Node.js 12+)
{
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",   // ES Modules
      "require": "./dist/cjs/index.js"   // CommonJS
    }
  }
}
```

**Permite consumidor escolher formato baseado em seu ambiente.**

## 📚 Conclusão

target define **versão ECMAScript** do output: ES5 (máxima compatibilidade, transpila tudo), ES2015 (classes, arrow functions), ES2020 (optional chaining, nullish coalescing), ESNext (bleeding edge). module define **sistema de módulos**: commonjs (Node.js, require/exports), esnext (ES Modules, import/export), umd (universal). Combinações comuns: Node.js (ES2020 + commonjs), React (ES2020 + esnext), bibliotecas (ES2015 + umd). lib define APIs disponíveis independente de target. moduleResolution controla resolução de imports (node, bundler). Target alto = menos transpilação = build mais rápido. ES Modules permitem tree-shaking. Dual packages exportam CommonJS e ESM.
