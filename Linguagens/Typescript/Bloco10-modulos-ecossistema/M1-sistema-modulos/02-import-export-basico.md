# Import e Export Básicos

## 🎯 Introdução e Definição

### Definição Conceitual

**Import e export** são **keywords ES6** que permitem **compartilhar código entre módulos** - `export` torna valores disponíveis para outros módulos, `import` consome valores exportados. Diferentemente de incluir todos os scripts globalmente, imports/exports criam **dependências explícitas** e **escopo modular isolado**.

Conceitualmente, `export` implementa **interface pública** - definir o que módulo expõe externamente. `Import` implementa **dependency declaration** - declarar quais recursos módulo consome. Juntos, criam **module graph** - grafo direcionado de dependências entre módulos.

**Fundamento teórico:** Import/export derivam de **module pattern** - padrão que encapsula código em escopo privado. `Export` implementa **controlled visibility** - apenas elementos explicitamente exportados são acessíveis externamente. `Import` implementa **explicit dependencies** - dependências declaradas estaticamente em compile-time, permitindo **static analysis** e **tree-shaking**.

**Pattern básico:**
```typescript
// math.ts - exportar
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts - importar
import { add } from './math';
console.log(add(2, 3));  // 5
```

**Diferença fundamental:**
- **Sem módulos:** Tudo global, nenhum encapsulation
- **Com import/export:** Escopo modular, dependências explícitas

### Contexto Histórico e Evolução

**ECMAScript 2015 (ES6) (2015):** Introdução de import/export.

```javascript
// ES6 (2015) - import/export
// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from './math.js';
console.log(add(2, 3));
```

**Motivação inicial:** Sistema de módulos padronizado para JavaScript (browsers e Node.js).

**TypeScript 1.5 (2015):** Suporte a ES6 import/export syntax.

```typescript
// TypeScript 1.5 - ES6 syntax
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';  // TypeScript infere tipos
```

**TypeScript 2.0 (2016):** Melhor type checking de imports/exports.

```typescript
// TypeScript 2.0 - type checking
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';
add(2, 3);      // ✓ OK
// add("2", "3");  // ✗ Error - tipo incorreto
```

**TypeScript 2.7 (2018):** Type-only imports/exports.

```typescript
// TypeScript 2.7 - type-only imports
// types.ts
export interface User {
  name: string;
  age: number;
}

// app.ts
import type { User } from './types';  // Import apenas tipo
const user: User = { name: "John", age: 30 };
```

**TypeScript 3.8 (2020):** `import type` e `export type` syntax.

```typescript
// TypeScript 3.8 - import/export type
// types.ts
export type UserId = string;
export interface User {
  id: UserId;
  name: string;
}

// app.ts
import type { User, UserId } from './types';
// import { User } from './types';  // ✗ Error - User é apenas tipo
```

**TypeScript 4.5 (2021):** Type modifiers em named imports.

```typescript
// TypeScript 4.5 - type modifiers
// app.ts
import { type User, fetchUser } from './api';
// User é tipo, fetchUser é valor
```

**Antes vs Depois:**

**Pré-ES6 (sem import/export):**
```html
<!-- Scripts globais -->
<script src="math.js"></script>
<script src="app.js"></script>

<script>
  // math.js define global 'add'
  function add(a, b) { return a + b; }
  
  // app.js usa global 'add'
  console.log(add(2, 3));
</script>
```

**Pós-ES6 (com import/export):**
```typescript
// math.ts - módulo isolado
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts - import explícito
import { add } from './math';
console.log(add(2, 3));
```

**Evolução TypeScript:**

**TypeScript inicial:**
```typescript
// Apenas runtime imports
import { add } from './math';
```

**TypeScript moderno:**
```typescript
// Runtime e type imports separados
import type { User } from './types';      // Apenas tipo
import { fetchUser } from './api';        // Runtime
import { type Config, loadConfig } from './config';  // Misto
```

### Problema Fundamental que Resolve

Import/export resolvem problemas de **namespace pollution**, **dependency management**, e **code organization**.

**Problema 1: Global namespace pollution**
```html
<!-- Sem módulos - globals poluem namespace ❌ -->
<script>
  // math.js
  function add(a, b) { return a + b; }
  var PI = 3.14159;
</script>

<script>
  // utils.js sobrescreve 'add' acidentalmente
  function add(arr) { return arr.reduce((a, b) => a + b); }
</script>

<script>
  // app.js - qual 'add'?
  console.log(add(2, 3));  // Função sobrescrita ❌
</script>
```

**Solução: Import/export isolam escopo**
```typescript
// math.ts - escopo isolado
export function add(a: number, b: number): number {
  return a + b;
}
export const PI = 3.14159;

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
<!-- Ordem importa - difícil gerenciar ❌ -->
<script src="jquery.js"></script>
<script src="lodash.js"></script>
<script src="app.js"></script>  <!-- Depende de jQuery e Lodash -->

<!-- Se ordem mudar, app.js quebra -->
<script src="app.js"></script>
<script src="jquery.js"></script>  <!-- ❌ jQuery não definido -->
```

**Solução: Import declara dependências explícitas**
```typescript
// app.ts - dependências explícitas ✅
import $ from 'jquery';
import _ from 'lodash';

// Bundler garante ordem correta automaticamente
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
// Difícil manutenção
```

**Solução: Import/export organizam código**
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
import { hashPassword } from './users/auth';
```

**Problema 4: Type safety impossível**
```javascript
// Sem módulos - sem type checking ❌
<script src="math.js"></script>
<script src="app.js"></script>

<script>
  // app.js
  add("2", "3");  // Runtime error - sem type checking
</script>
```

**Solução: Import/export permitem type checking**
```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';
add(2, 3);      // ✓ OK
// add("2", "3");  // ✗ Error - TypeScript detecta tipo incorreto
```

**Fundamento teórico:** Import/export implementam **module encapsulation** - cada módulo tem escopo privado, expondo apenas interface pública via `export`.

### Importância no Ecossistema

Import/export são cruciais porque:

- **Encapsulation:** Isolar código em módulos
- **Dependency Management:** Declarar dependências explícitas
- **Type Safety:** TypeScript valida imports/exports
- **Tree-shaking:** Bundlers eliminam código não usado
- **Code Splitting:** Dividir aplicação em chunks
- **Lazy Loading:** Carregar módulos sob demanda
- **Refactoring:** Rename/move com segurança
- **Standards:** ES6 import/export é padrão ECMAScript

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Export:** Tornar valores disponíveis para outros módulos
2. **Import:** Consumir valores exportados de outros módulos
3. **Static Analysis:** Imports/exports analisados em compile-time
4. **Module Scope:** Cada módulo tem escopo isolado
5. **Type Safety:** TypeScript valida imports/exports

### Pilares Fundamentais

- **Export Syntax:** `export function`, `export const`, `export class`
- **Import Syntax:** `import { name } from 'module'`
- **Module Path:** Relativo (`./math`) ou absoluto (`lodash`)
- **Type Imports:** `import type { }` para tipos apenas
- **Side Effects:** `import './module'` executa código sem importar

### Visão Geral das Nuances

- **Named Exports:** `export { name }`
- **Default Exports:** `export default value`
- **Re-exports:** `export { name } from './module'`
- **Type-only Imports:** `import type { }` (apenas compile-time)
- **Namespace Imports:** `import * as name from './module'`

## 🧠 Fundamentos Teóricos

### Basic Export

```typescript
// Exportar função
export function add(a: number, b: number): number {
  return a + b;
}

// Exportar constante
export const PI = 3.14159;

// Exportar classe
export class User {
  constructor(public name: string) {}
}

// Exportar interface
export interface Product {
  id: number;
  name: string;
}

// Exportar type alias
export type UserId = string;
```

**Export:** Tornar elementos disponíveis para outros módulos.

### Basic Import

```typescript
// Importar função
import { add } from './math';
console.log(add(2, 3));  // 5

// Importar múltiplos
import { add, PI } from './math';
console.log(PI);  // 3.14159

// Importar classe
import { User } from './user';
const user = new User("John");

// Importar tipo
import { Product } from './types';
const product: Product = { id: 1, name: "Laptop" };
```

**Import:** Consumir valores exportados.

### Export List

```typescript
// Exportar lista no final do arquivo

function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

const PI = 3.14159;

// Export lista
export { add, subtract, PI };
```

**Export List:** Exportar múltiplos elementos de uma vez.

### Princípios e Conceitos Subjacentes

#### Renaming Exports

```typescript
// Renomear ao exportar

function internalAdd(a: number, b: number): number {
  return a + b;
}

// Exportar com nome diferente
export { internalAdd as add };

// Importar usa nome exportado
// app.ts
import { add } from './math';  // Usa 'add', não 'internalAdd'
```

**Rename:** `as` renomeia ao exportar.

#### Renaming Imports

```typescript
// Renomear ao importar

// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add as mathAdd } from './math';
console.log(mathAdd(2, 3));  // Usa 'mathAdd' localmente
```

**Rename:** `as` renomeia ao importar.

### Type-only Imports

```typescript
// Import apenas tipos (removido em runtime)

// types.ts
export interface User {
  name: string;
  age: number;
}

export type UserId = string;

// app.ts - import type
import type { User, UserId } from './types';

const user: User = { name: "John", age: 30 };  // ✓ OK - tipo usado
const id: UserId = "user_123";                 // ✓ OK - tipo usado

// const value = User;  // ✗ Error - User não existe em runtime
```

**Import Type:** `import type { }` importa apenas tipos (compile-time).

#### Mixed Imports

```typescript
// Importar valores e tipos juntos

// api.ts
export interface User {
  name: string;
}

export function fetchUser(): User {
  return { name: "John" };
}

// app.ts - mixed import
import { type User, fetchUser } from './api';

const user: User = fetchUser();  // ✓ OK - User é tipo, fetchUser é valor
```

**Mixed:** `type` modifier separa tipos de valores.

### Module Paths

```typescript
// Paths relativos e absolutos

// Relativo - mesmo diretório
import { add } from './math';

// Relativo - diretório pai
import { add } from '../utils/math';

// Relativo - subdiretório
import { add } from './utils/math';

// Absoluto - node_modules
import _ from 'lodash';
import React from 'react';

// Path alias (configurado em tsconfig.json)
import { add } from '@/utils/math';  // @ = src/
```

**Paths:** Relativos (`./ ../`) ou absolutos (node_modules).

#### Side Effect Imports

```typescript
// Importar para side effects (executar código)

// polyfill.ts
if (!Array.prototype.includes) {
  Array.prototype.includes = function(item) {
    return this.indexOf(item) !== -1;
  };
}

// app.ts - import side effect
import './polyfill';  // Executa código, não importa valores

console.log([1, 2, 3].includes(2));  // Usa polyfill
```

**Side Effects:** `import './module'` executa código sem importar.

### Export All

```typescript
// Exportar tudo de outro módulo

// math/index.ts
export * from './add';
export * from './subtract';
export * from './multiply';

// add.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add, subtract, multiply } from './math';
```

**Export All:** `export * from` re-exporta tudo.

#### Import Extensions

```typescript
// TypeScript - sem extensão
import { add } from './math';  // Infere .ts

// Node.js ES Modules - extensão obrigatória
import { add } from './math.js';  // Precisa .js

// tsconfig.json - moduleResolution
{
  "compilerOptions": {
    "moduleResolution": "node"  // ou "nodenext"
  }
}
```

**Extensions:** TypeScript infere `.ts`, Node.js ESM requer `.js`.

### Modelo Mental para Compreensão

Pense em import/export como **biblioteca**:

**Export:** Livros disponíveis na estante (interface pública)
**Import:** Pegar livros da estante (consumir interface)

**Analogia - Restaurant:**

**Export:** Itens no cardápio (disponíveis para clientes)
**Import:** Fazer pedido (consumir itens do cardápio)

**Metáfora - Store:**

**Export:** Produtos na prateleira (à venda)
**Import:** Comprar produtos (consumir)

**Fluxo de import/export:**
```
1. Module A: export { add }
2. TypeScript: analisa exports (compile-time)
3. Module B: import { add } from './A'
4. TypeScript: valida import existe em A
5. Bundler: resolve dependency graph
6. Runtime: módulos carregados em ordem
```

**Exemplo visual:**
```
math.ts
┌─────────────────┐
│ function add    │ ← Private
│ function helper │ ← Private
│                 │
│ export { add }  │ ← Public API
└─────────────────┘
        ↓
app.ts
┌─────────────────┐
│ import { add }  │ ← Consome API
│ add(2, 3)       │
└─────────────────┘
```

## 🔍 Análise Conceitual Profunda

### Export Variants

```typescript
// Variantes de export

// 1. Inline export
export function add(a: number, b: number): number {
  return a + b;
}

// 2. Export list
function subtract(a: number, b: number): number {
  return a - b;
}
export { subtract };

// 3. Export com rename
function internalMultiply(a: number, b: number): number {
  return a * b;
}
export { internalMultiply as multiply };

// 4. Re-export
export { divide } from './divide';

// 5. Export all
export * from './utils';
```

**Variants:** Múltiplas formas de exportar.

#### Import Variants

```typescript
// Variantes de import

// 1. Named import
import { add } from './math';

// 2. Named import com rename
import { add as mathAdd } from './math';

// 3. Múltiplos named imports
import { add, subtract, multiply } from './math';

// 4. Namespace import
import * as math from './math';

// 5. Default import
import Calculator from './calculator';

// 6. Mixed import
import Calculator, { add, subtract } from './calculator';

// 7. Side effect import
import './polyfill';

// 8. Type-only import
import type { User } from './types';

// 9. Dynamic import
const math = await import('./math');
```

**Variants:** Múltiplas formas de importar.

### Tree-shaking

```typescript
// Tree-shaking elimina código não usado

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
console.log(subtract(5, 3));

// Bundler (Webpack, Rollup) remove multiply (tree-shaking) ✅
```

**Tree-shaking:** Eliminar código não usado (apenas ES Modules).

#### Circular Dependencies

```typescript
// Circular dependencies - cuidado

// a.ts
import { valueB } from './b';

export const valueA = 'A';
console.log('In a.ts, valueB:', valueB);

// b.ts
import { valueA } from './a';

export const valueB = 'B';
console.log('In b.ts, valueA:', valueA);

// ES Modules usa live bindings - funciona melhor que CommonJS
// Mas evite circular dependencies quando possível
```

**Circular:** ES Modules usa live bindings - lida melhor que CommonJS.

### Barrel Pattern

```typescript
// Barrel pattern - index.ts re-exporta tudo

// users/api.ts
export function fetchUser() { }
export function saveUser() { }

// users/validation.ts
export function validateEmail() { }

// users/index.ts (barrel)
export * from './api';
export * from './validation';

// app.ts - import de barrel
import { fetchUser, saveUser, validateEmail } from './users';
```

**Barrel:** `index.ts` re-exporta módulos do diretório.

#### Namespace Pollution Avoidance

```typescript
// Evitar namespace pollution com módulos

// Sem módulos - poluição ❌
var add = function() { };
var subtract = function() { };
var multiply = function() { };
// Todas globais

// Com módulos - isolamento ✅
// math.ts
export function add() { }
export function subtract() { }
export function multiply() { }

// app.ts
import { add } from './math';
// Apenas 'add' no escopo local
```

**Isolation:** Módulos isolam escopo.

### Type Safety

```typescript
// Type safety com imports/exports

// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';

add(2, 3);          // ✓ OK - tipos corretos
// add("2", "3");   // ✗ Error - TypeScript valida tipos
// add(2);          // ✗ Error - falta argumento
// subtract(5, 3);  // ✗ Error - função não exportada

// TypeScript valida:
// 1. Função existe no módulo
// 2. Tipos dos argumentos
// 3. Número de argumentos
// 4. Tipo de retorno
```

**Type Safety:** TypeScript valida imports/exports.

#### Dynamic Imports

```typescript
// Dynamic imports (lazy loading)

// Static import (sempre carregado)
import { add } from './math';

// Dynamic import (lazy loading)
async function loadMath() {
  const math = await import('./math');
  console.log(math.add(2, 3));  // 5
}

// Conditional import
if (condition) {
  const advanced = await import('./advanced');
  advanced.complexCalculation();
}

// Dynamic import retorna Promise
import('./math').then(math => {
  console.log(math.add(2, 3));
});
```

**Dynamic:** `import()` permite lazy loading.

## 🎯 Aplicabilidade e Contextos

### Library Development

```typescript
// Exportar API pública
export { Calculator } from './calculator';
export type { CalculatorOptions } from './types';
```

**Raciocínio:** Expor apenas interface pública.

### Application Code

```typescript
// Importar dependências
import React from 'react';
import { fetchUsers } from './api';
```

**Raciocínio:** Consumir bibliotecas e módulos internos.

### Code Organization

```typescript
// Organizar código em módulos
import { UserService } from './services/user';
import { validate } from './utils/validation';
```

**Raciocínio:** Estruturar aplicação em módulos lógicos.

### Type Definitions

```typescript
// Importar tipos
import type { User, Product } from './types';
```

**Raciocínio:** Compartilhar tipos entre módulos.

## ⚠️ Limitações e Considerações Teóricas

### Circular Dependencies

```typescript
// Evite circular dependencies
// Pode causar valores undefined
```

**Limitação:** Circular dependencies podem causar problemas.

### Performance

```typescript
// Muitos imports pequenos podem degradar performance
// Prefira agrupar imports relacionados
```

**Consideração:** Balance granularidade vs performance.

### Browser Support

```typescript
// ES Modules requer browsers modernos
// Use bundler para compatibilidade
```

**Limitação:** Browsers antigos não suportam ES Modules.

## 🔗 Interconexões Conceituais

**Relação com CommonJS:** ES6 import/export vs `require`/`module.exports`.

**Relação com Bundlers:** Webpack, Rollup processam imports/exports.

**Relação com Tree-shaking:** ES Modules permitem eliminação de código.

**Relação com TypeScript:** Valida tipos de imports/exports.

**Relação com Module Resolution:** Como TypeScript/Node.js resolvem paths.

## 🚀 Evolução e Próximos Conceitos

Dominar import/export básicos prepara para:
- **Namespace Imports:** `import * as name`
- **Named Imports:** Detalhes de `import { }`
- **Default Imports:** `import default from`
- **Named Exports:** Variantes de `export`
- **Re-exports:** Barrel pattern e re-exportação
