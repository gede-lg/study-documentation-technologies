# CommonJS vs ES6 Modules

## 🎯 Introdução e Definição

### Definição Conceitual

**CommonJS** e **ES6 Modules (ESM)** são dois **sistemas de módulos** principais em JavaScript/TypeScript que permitem **organizar código em arquivos separados** e **compartilhar funcionalidades** entre módulos. CommonJS usa `require()` e `module.exports` (runtime loading), enquanto ES6 Modules usa `import` e `export` (static analysis).

Conceitualmente, sistemas de módulos implementam **encapsulation** - capacidade de ocultar detalhes de implementação e expor apenas API pública. Permitem **dependency management** - declarar dependências explícitas entre módulos. Facilitam **code organization** - dividir aplicação em unidades lógicas reutilizáveis.

**Fundamento teórico:** Sistemas de módulos derivam de **module pattern** - padrão que cria escopo privado e exporta interface pública. CommonJS implementa **synchronous loading** - módulos carregados de forma síncrona em runtime. ES6 Modules implementam **static module structure** - imports/exports analisados estaticamente em compile-time, permitindo tree-shaking e otimizações.

**Pattern básico:**

**CommonJS:**
```typescript
// math.js - CommonJS
function add(a, b) {
  return a + b;
}

module.exports = { add };

// app.js - CommonJS
const math = require('./math');
console.log(math.add(2, 3));  // 5
```

**ES6 Modules:**
```typescript
// math.ts - ES6 Modules
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts - ES6 Modules
import { add } from './math';
console.log(add(2, 3));  // 5
```

**Diferença fundamental:**
- **CommonJS:** Runtime loading, `require()`, `module.exports`
- **ES6 Modules:** Static analysis, `import`, `export`

### Contexto Histórico e Evolução

**Node.js 0.1.0 (2009):** Introdução do CommonJS como sistema de módulos padrão.

```javascript
// Node.js 0.1.0 - CommonJS
// math.js
exports.add = function(a, b) {
  return a + b;
};

// app.js
var math = require('./math');
console.log(math.add(2, 3));
```

**Motivação inicial:** Node.js precisava de sistema de módulos para organizar código server-side.

**ECMAScript 2015 (ES6) (2015):** Especificação de ES6 Modules.

```javascript
// ES6 (2015) - ES Modules
// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from './math.js';
console.log(add(2, 3));
```

**Motivação:** Sistema de módulos padronizado para JavaScript (browser e server).

**Node.js 12.0.0 (2019):** Suporte experimental a ES Modules.

```javascript
// Node.js 12 - ES Modules
// package.json
{
  "type": "module"
}

// math.mjs
export function add(a, b) {
  return a + b;
}

// app.mjs
import { add } from './math.mjs';
```

**Node.js 13.2.0 (2019):** ES Modules sem flag experimental.

```javascript
// Node.js 13.2+ - ES Modules stable
// Usa .mjs ou package.json com "type": "module"
```

**TypeScript 1.5 (2015):** Suporte a ES6 Modules syntax com compilação para CommonJS.

```typescript
// TypeScript 1.5 - ES6 syntax, CommonJS output
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// Compila para CommonJS:
// exports.add = function(a, b) { return a + b; };
```

**TypeScript 2.0 (2016):** Melhor interoperabilidade entre CommonJS e ES6 Modules.

```typescript
// TypeScript 2.0 - esModuleInterop
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}

// Permite import default de módulos CommonJS
import express from 'express';  // Antes: import * as express
```

**Node.js 14.0.0 (2020):** ES Modules estável sem flags.

**TypeScript 4.5 (2021):** `node12` e `nodenext` module resolution.

```typescript
// TypeScript 4.5 - module resolution moderna
// tsconfig.json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

**Node.js 16.0.0 (2021):** ES Modules como padrão com `"type": "module"`.

**Antes vs Depois:**

**Pré-ES6 (apenas CommonJS):**
```javascript
// Apenas CommonJS disponível
var fs = require('fs');
var myModule = require('./myModule');

exports.myFunction = function() { };
```

**Pós-ES6 (CommonJS e ES Modules):**
```javascript
// ES Modules disponível
import fs from 'fs';
import { myFunction } from './myModule.js';

export function myFunction() { }
```

**Evolução TypeScript:**

**TypeScript inicial (compilação para CommonJS):**
```typescript
// TypeScript sempre compilava para CommonJS
export class User { }

// Output: exports.User = User;
```

**TypeScript moderno (escolha de output):**
```typescript
// tsconfig.json - escolha o target
{
  "compilerOptions": {
    "module": "esnext"  // ou "commonjs"
  }
}
```

### Problema Fundamental que Resolve

Sistemas de módulos resolvem problemas de **namespace pollution**, **dependency management**, e **code organization**.

**Problema 1: Global namespace pollution (pré-módulos)**
```html
<!-- Sem módulos - globals poluem namespace -->
<script src="math.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>

<script>
  // math.js define global 'add'
  function add(a, b) { return a + b; }
  
  // utils.js pode sobrescrever 'add' acidentalmente ❌
  function add(arr) { return arr.reduce((a, b) => a + b); }
  
  // app.js - qual 'add' é usado?
  console.log(add(2, 3));  // ???
</script>
```

**Solução: Módulos encapsulam scope**
```typescript
// math.ts - escopo isolado
export function add(a: number, b: number): number {
  return a + b;
}

// utils.ts - escopo isolado
export function add(arr: number[]): number {
  return arr.reduce((a, b) => a + b);
}

// app.ts - imports explícitos ✅
import { add as mathAdd } from './math';
import { add as utilsAdd } from './utils';

console.log(mathAdd(2, 3));      // 5
console.log(utilsAdd([1, 2, 3]));  // 6
```

**Problema 2: Dependency management implícito**
```html
<!-- Ordem de scripts importa - difícil de gerenciar ❌ -->
<script src="jquery.js"></script>
<script src="lodash.js"></script>
<script src="app.js"></script>  <!-- Depende de jQuery e Lodash -->
```

**Solução: Módulos declaram dependências explícitas**
```typescript
// app.ts - dependências explícitas ✅
import $ from 'jquery';
import _ from 'lodash';

// Ferramentas de build garantem ordem correta
```

**Problema 3: Code organization sem estrutura**
```javascript
// Sem módulos - código monolítico ❌
// app.js (1000+ linhas)
function fetchUser() { }
function saveUser() { }
function validateEmail() { }
function hashPassword() { }
// ... mais 50 funções
```

**Solução: Módulos organizam código logicamente**
```typescript
// users/api.ts
export function fetchUser() { }
export function saveUser() { }

// users/validation.ts
export function validateEmail() { }

// users/auth.ts
export function hashPassword() { }

// app.ts - imports organizados ✅
import { fetchUser, saveUser } from './users/api';
import { validateEmail } from './users/validation';
```

**Problema 4: Reutilização de código difícil**
```javascript
// Sem módulos - copiar/colar código ❌
// projeto1/utils.js
function formatDate() { }

// projeto2/utils.js
function formatDate() { }  // Código duplicado
```

**Solução: Módulos permitem reutilização**
```typescript
// shared-utils/date.ts
export function formatDate() { }

// projeto1/app.ts
import { formatDate } from 'shared-utils/date';

// projeto2/app.ts
import { formatDate } from 'shared-utils/date';  // Reutilizado ✅
```

**Fundamento teórico:** Sistemas de módulos implementam **information hiding** - ocultar detalhes de implementação e expor apenas interface necessária.

### Importância no Ecossistema

Sistemas de módulos são cruciais porque:

- **Encapsulation:** Isolar código em escopos privados
- **Dependency Management:** Declarar dependências explícitas
- **Code Organization:** Organizar código em arquivos lógicos
- **Reusability:** Reutilizar código entre projetos
- **Tree-shaking:** Eliminar código não usado (ES Modules)
- **Type Safety:** TypeScript valida imports/exports
- **Tooling:** Bundlers (Webpack, Rollup) otimizam módulos
- **Standards:** ES Modules é padrão ECMAScript

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **CommonJS:** Runtime loading, synchronous, `require()`/`module.exports`
2. **ES6 Modules:** Static analysis, asynchronous, `import`/`export`
3. **Static vs Dynamic:** ES Modules analisados estaticamente, CommonJS dinamicamente
4. **Interoperability:** TypeScript permite usar ambos
5. **Tree-shaking:** ES Modules permitem eliminação de código morto

### Pilares Fundamentais

- **CommonJS:** `require()`, `module.exports`, `exports`, synchronous
- **ES6 Modules:** `import`, `export`, `import()` (dynamic), static
- **TypeScript:** Compila ES6 syntax para CommonJS ou ES Modules
- **Node.js:** Suporta ambos (CommonJS padrão, ESM com `"type": "module"`)
- **Browsers:** Apenas ES Modules nativamente

### Visão Geral das Nuances

- **File Extensions:** CommonJS usa `.js`, ES Modules usa `.mjs` ou `.js` com `"type": "module"`
- **Top-level await:** Apenas ES Modules (ES2022+)
- **`__dirname`/`__filename`:** Apenas CommonJS
- **Circular Dependencies:** Tratadas diferentemente
- **Dynamic Imports:** `require()` dinâmico vs `import()` dinâmico

## 🧠 Fundamentos Teóricos

### CommonJS Basics

```typescript
// CommonJS - exports

// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Export individual
exports.add = add;

// Ou export object
module.exports = {
  add,
  subtract
};

// app.js - require
const math = require('./math');
console.log(math.add(2, 3));      // 5
console.log(math.subtract(5, 3)); // 2

// Destructuring
const { add, subtract } = require('./math');
console.log(add(2, 3));  // 5
```

**CommonJS:** `require()` retorna valor de `module.exports`.

### ES6 Modules Basics

```typescript
// ES6 Modules - export

// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

// app.ts - import
import { add, subtract } from './math';
console.log(add(2, 3));      // 5
console.log(subtract(5, 3)); // 2

// Namespace import
import * as math from './math';
console.log(math.add(2, 3));  // 5
```

**ES6 Modules:** `import` é estático, analisado em compile-time.

### Static vs Dynamic Loading

```typescript
// CommonJS - dynamic loading (runtime)
const moduleName = './math';
const math = require(moduleName);  // ✓ OK - runtime

const useAdvanced = true;
if (useAdvanced) {
  const advanced = require('./advanced');  // ✓ OK - conditional
}

// ES6 Modules - static loading (compile-time)
const moduleName = './math';
// import { add } from moduleName;  // ✗ Error - não pode usar variável

// import { add } from './math';  // ✗ Error - não pode estar em if
// if (useAdvanced) { }

// ES6 Modules - dynamic import (runtime)
const moduleName = './math';
const math = await import(moduleName);  // ✓ OK - dynamic import()

if (useAdvanced) {
  const advanced = await import('./advanced');  // ✓ OK - conditional
}
```

**Static:** ES6 imports são estáticos (compile-time).
**Dynamic:** `import()` permite dynamic loading (runtime).

### Princípios e Conceitos Subjacentes

#### Module.exports vs Exports

```typescript
// CommonJS - module.exports vs exports

// math.js - exports (shorthand)
exports.add = function(a, b) {
  return a + b;
};

// Equivalente a:
module.exports.add = function(a, b) {
  return a + b;
};

// CUIDADO: reassign exports quebra referência ❌
exports = {  // ✗ Não funciona
  add: function(a, b) { return a + b; }
};

// Correto: reassign module.exports ✓
module.exports = {
  add: function(a, b) { return a + b; }
};
```

**Exports:** `exports` é referência para `module.exports` - não reassign.

#### Tree-shaking

```typescript
// ES6 Modules permitem tree-shaking

// utils.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;  // Não usado
}

// app.ts
import { add, subtract } from './utils';
console.log(add(2, 3));

// Bundler (Webpack, Rollup) remove multiply (tree-shaking) ✅
```

**Tree-shaking:** Eliminação de código não usado - apenas ES Modules.

### Default Exports Comparison

```typescript
// CommonJS - default export
// math.js
module.exports = function add(a, b) {
  return a + b;
};

// app.js
const add = require('./math');
console.log(add(2, 3));  // 5

// ES6 Modules - default export
// math.ts
export default function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import add from './math';
console.log(add(2, 3));  // 5
```

**Default:** Ambos suportam default export, syntax diferente.

#### Named Exports Comparison

```typescript
// CommonJS - named exports
// math.js
exports.add = function(a, b) { return a + b; };
exports.subtract = function(a, b) { return a - b; };

// app.js
const { add, subtract } = require('./math');

// ES6 Modules - named exports
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}
export function subtract(a: number, b: number): number {
  return a - b;
}

// app.ts
import { add, subtract } from './math';
```

**Named:** Ambos suportam named exports, syntax diferente.

### Circular Dependencies

```typescript
// CommonJS - circular dependencies

// a.js
exports.valueA = 'A';
const b = require('./b');
console.log('In a.js, b.valueB:', b.valueB);  // undefined (partially loaded)

// b.js
exports.valueB = 'B';
const a = require('./a');
console.log('In b.js, a.valueA:', a.valueA);  // 'A'

// ES6 Modules - circular dependencies (handled better)

// a.ts
export const valueA = 'A';
import { valueB } from './b';
console.log('In a.ts, valueB:', valueB);  // 'B' (live binding)

// b.ts
export const valueB = 'B';
import { valueA } from './a';
console.log('In b.ts, valueA:', valueA);  // 'A'
```

**Circular:** ES Modules usa live bindings - lida melhor com circular dependencies.

#### Top-level Await

```typescript
// CommonJS - NO top-level await ❌
// app.js
const data = await fetch('/api/data');  // ✗ SyntaxError

// Precisa usar IIFE async
(async () => {
  const data = await fetch('/api/data');
})();

// ES6 Modules - top-level await ✓ (ES2022+)
// app.ts (com "type": "module")
const data = await fetch('/api/data');  // ✓ OK
console.log(data);
```

**Top-level await:** Apenas ES Modules (ES2022+).

### File Extensions

```typescript
// CommonJS - .js extension
// math.js
module.exports = { add };

// app.js
const math = require('./math');  // .js implícito

// ES6 Modules - explicit extensions

// Node.js com "type": "module"
// math.js
export function add() { }

// app.js
import { add } from './math.js';  // ✓ Extensão explícita
// import { add } from './math';  // ✗ Error (Node.js ESM)

// TypeScript - sem extensão
// math.ts
export function add() { }

// app.ts
import { add } from './math';  // ✓ OK (TypeScript infere .ts)
```

**Extensions:** Node.js ESM requer extensões explícitas, TypeScript não.

#### __dirname e __filename

```typescript
// CommonJS - __dirname e __filename disponíveis
// app.js
console.log(__dirname);   // /path/to/directory
console.log(__filename);  // /path/to/directory/app.js

const path = require('path');
const filePath = path.join(__dirname, 'data.json');

// ES6 Modules - NO __dirname/__filename ❌
// app.mjs
// console.log(__dirname);  // ✗ ReferenceError

// Workaround com import.meta.url
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);  // /path/to/directory
```

**Globals:** CommonJS tem `__dirname`/`__filename`, ES Modules usa `import.meta.url`.

### Modelo Mental para Compreensão

Pense em sistemas de módulos como **bibliotecas**:

**CommonJS:** Biblioteca onde você **pega livros em tempo de execução** (runtime)
**ES6 Modules:** Biblioteca onde você **reserva livros antecipadamente** (compile-time)

**Analogia - Restaurant:**

**CommonJS:** Cardápio onde você pede (require) durante a refeição
**ES6 Modules:** Menu degustação fixo onde pratos vêm em ordem predefinida

**Metáfora - Delivery:**

**CommonJS:** Pedir comida por telefone (dynamic, runtime)
**ES6 Modules:** Assinatura de refeições (static, compile-time)

**Fluxo de module loading:**

**CommonJS:**
```
1. Runtime: require() executado
2. Node.js carrega arquivo
3. Executa código do módulo
4. Retorna module.exports
5. Cache resultado
```

**ES6 Modules:**
```
1. Compile-time: imports analisados
2. Dependency graph construído
3. Runtime: módulos carregados
4. Executa em ordem (dependency-first)
5. Live bindings criados
```

## 🔍 Análise Conceitual Profunda

### TypeScript Compilation Targets

```typescript
// TypeScript pode compilar para CommonJS ou ES Modules

// tsconfig.json - CommonJS output
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015"
  }
}

// Source: math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// Output: math.js (CommonJS)
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
function add(a, b) {
    return a + b;
}
exports.add = add;

// tsconfig.json - ES Modules output
{
  "compilerOptions": {
    "module": "esnext",
    "target": "es2015"
  }
}

// Output: math.js (ES Modules)
export function add(a, b) {
    return a + b;
}
```

**TypeScript:** Compila ES6 syntax para CommonJS ou ES Modules.

#### Interoperability

```typescript
// TypeScript - importar módulos CommonJS com ES6 syntax

// lodash é CommonJS
// node_modules/lodash/index.js
module.exports = { ... };

// app.ts - import ES6 style
import _ from 'lodash';  // ✓ OK com esModuleInterop

// Sem esModuleInterop
import * as _ from 'lodash';  // Precisa namespace import

// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,  // Permite import default de CommonJS
    "allowSyntheticDefaultImports": true
  }
}
```

**Interop:** `esModuleInterop` permite importar CommonJS com ES6 syntax.

### Dynamic Imports

```typescript
// CommonJS - dynamic require
const moduleName = './math';
const math = require(moduleName);  // ✓ OK - runtime

if (condition) {
  const optional = require('./optional');  // ✓ OK - conditional
}

// ES6 Modules - static import (compile-time)
// import { add } from './math';  // Sempre executado, não pode ser conditional

// ES6 Modules - dynamic import() (runtime)
const moduleName = './math';
const math = await import(moduleName);  // ✓ OK - runtime
console.log(math.add(2, 3));

if (condition) {
  const optional = await import('./optional');  // ✓ OK - conditional
}

// Dynamic import() retorna Promise
import('./math').then(math => {
  console.log(math.add(2, 3));
});
```

**Dynamic:** `import()` permite dynamic loading em ES Modules.

#### Package.json Configuration

```json
// package.json - especificar tipo de módulo

// CommonJS (padrão)
{
  "type": "commonjs"
}

// ES Modules
{
  "type": "module"
}

// Dual package (suporta ambos)
{
  "type": "module",
  "exports": {
    "import": "./dist/esm/index.js",
    "require": "./dist/cjs/index.js"
  }
}
```

**Package.json:** `"type"` define sistema de módulo padrão.

### Browser Support

```html
<!-- CommonJS - não suportado nativamente em browsers ❌ -->
<!-- Precisa bundler (Webpack, Browserify) -->

<!-- ES6 Modules - suportado nativamente ✓ -->
<script type="module">
  import { add } from './math.js';
  console.log(add(2, 3));
</script>

<!-- ES6 Modules - external -->
<script type="module" src="app.js"></script>
```

**Browsers:** Apenas ES Modules suportado nativamente.

#### Performance Considerations

```typescript
// CommonJS - synchronous loading (bloqueante)
const fs = require('fs');
const lodash = require('lodash');  // Bloqueia até carregar

// ES6 Modules - asynchronous loading
import fs from 'fs';
import _ from 'lodash';

// Browsers - ES Modules paralleliza downloads
<script type="module">
  import { a } from './a.js';  // Download paralelo
  import { b } from './b.js';  // Download paralelo
  import { c } from './c.js';  // Download paralelo
</script>

// CommonJS - bundler necessário para performance
```

**Performance:** ES Modules permite parallel loading em browsers.

### Compatibility Matrix

```typescript
// Node.js - suporta ambos
// CommonJS (padrão)
const fs = require('fs');

// ES Modules (com "type": "module" ou .mjs)
import fs from 'fs';

// Browsers - apenas ES Modules
<script type="module">
  import { add } from './math.js';
</script>

// TypeScript - compila ambos
// Escreve: ES6 syntax
// Compila para: CommonJS ou ES Modules (configurable)

// Bundlers - processam ambos
// Webpack, Rollup, Vite suportam CommonJS e ES Modules
```

**Compatibility:** Node.js e bundlers suportam ambos, browsers apenas ESM.

## 🎯 Aplicabilidade e Contextos

### Node.js Applications

**CommonJS:** Padrão em Node.js, amplamente usado
**ES Modules:** Moderno, melhor para tree-shaking

### Browser Applications

**ES Modules:** Único suportado nativamente

### TypeScript Projects

**ES6 syntax:** Escrever código, compilar para target desejado

### Libraries

**Dual packages:** Fornecer ambos CommonJS e ES Modules

## ⚠️ Limitações e Considerações Teóricas

### CommonJS Limitations

```typescript
// Sem tree-shaking
// Sem top-level await
// Sem static analysis
```

**Limitação:** CommonJS não permite otimizações modernas.

### ES Modules Limitations

```typescript
// Requer extensões explícitas (Node.js)
// Sem __dirname/__filename
// Compatibilidade com código legado
```

**Consideração:** ES Modules requer adaptações em Node.js.

### Migration Challenges

```typescript
// Migrar CommonJS → ES Modules pode quebrar código
// Circular dependencies comportam-se diferente
// Dynamic requires precisam ser refatorados
```

**Desafio:** Migração requer cuidado.

## 🔗 Interconexões Conceituais

**Relação com Import/Export:** Syntax de módulos.

**Relação com Bundlers:** Webpack, Rollup processam módulos.

**Relação com TypeScript:** Compila ES6 para CommonJS/ESM.

**Relação com Tree-shaking:** ES Modules permitem.

**Relação com Node.js:** Suporta ambos sistemas.

## 🚀 Evolução e Próximos Conceitos

Dominar CommonJS vs ES6 Modules prepara para:
- **Import e Export:** Syntax detalhada de imports/exports
- **Namespace Imports:** `import * as`
- **Named Imports:** `import { }`
- **Default Imports:** `import default`
- **Re-exports:** Padrão barrel exports
