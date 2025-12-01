# Named Exports

## 🎯 Introdução e Definição

### Definição Conceitual

**Named exports** (`export { name }`) são syntax ES6 que **exportam elementos específicos de módulo** usando **nomes identificadores explícitos**. Diferentemente de default export que exporta elemento único sem nome fixo, named exports permitem **múltiplos exports** cada um com **nome específico** que deve ser usado exatamente no import (ou renomeado explicitamente).

Conceitualmente, named exports implementam **explicit export pattern** - cada elemento exportado tem identificador preciso. Seguem **principle of explicit contracts** - módulo declara explicitamente sua API pública através de named exports. Facilitam **static analysis** - bundlers e ferramentas identificam exatamente quais exports existem e quais são usados, permitindo **tree-shaking otimizado**.

**Fundamento teórico:** Named exports derivam de **module namespace** - cada export adiciona propriedade ao namespace do módulo. Enquanto default export cria binding especial `.default`, named exports criam **named bindings** - cada export tem nome específico no module namespace object. TypeScript valida que imports referenciam named exports existentes via **static type checking**.

**Pattern básico:**
```typescript
// math.ts - múltiplos named exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// app.ts - import com nomes exatos
import { add, subtract, PI } from './math';

console.log(add(2, 3));      // 5
console.log(subtract(5, 3)); // 2
console.log(PI);             // 3.14159
```

**Diferença fundamental:**
- **Default export:** `export default X` → `import Y from` (qualquer nome)
- **Named export:** `export const X` → `import { X } from` (nome exato)

### Contexto Histórico e Evolução

**ECMAScript 2015 (ES6) (2015):** Introdução de named exports.

```javascript
// ES6 (2015) - named exports
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// app.js
import { add, subtract } from './math.js';
console.log(add(2, 3));
```

**Motivação inicial:** Múltiplos exports com nomes específicos.

**CommonJS (pré-ES6):**
```javascript
// CommonJS - exports object
// math.js
exports.add = function(a, b) {
  return a + b;
};

exports.subtract = function(a, b) {
  return a - b;
};

// app.js
const { add, subtract } = require('./math');
```

**ES6 formalizou:** Named exports como syntax nativa.

**TypeScript 1.5 (2015):** Suporte a named exports com type checking.

```typescript
// TypeScript 1.5 - named exports
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';
console.log(add(2, 3));  // TypeScript valida tipos
```

**TypeScript 2.0 (2016):** Export type aliases e interfaces.

```typescript
// TypeScript 2.0 - export types
export interface User {
  name: string;
  age: number;
}

export type UserId = string;

// app.ts
import { User, UserId } from './types';
```

**TypeScript 2.7 (2018):** Type-only exports.

```typescript
// TypeScript 2.7 - export type
export type { User, Product } from './types';
```

**TypeScript 3.8 (2020):** `export type` syntax.

```typescript
// TypeScript 3.8 - export type
export type { User } from './types';
// User removido em runtime
```

**TypeScript 4.5 (2021):** Type modifier em exports.

```typescript
// TypeScript 4.5 - type modifier
export { fetchUser, type User } from './api';

// fetchUser runtime value
// User compile-time type
```

**Webpack 2 (2017):** Tree-shaking para named exports.

```javascript
// Webpack 2 - tree-shaking
export function add() { }
export function subtract() { }

// app.js
import { add } from './math';
// subtract removido do bundle ✅
```

**Antes vs Depois:**

**Pré-ES6 (CommonJS):**
```javascript
// CommonJS - exports object
exports.add = function() { };
exports.subtract = function() { };

// Runtime object - tree-shaking impossível
```

**Pós-ES6 (named exports):**
```typescript
// Named exports - static analysis
export function add() { }
export function subtract() { }

// Tree-shaking enabled ✅
```

**Evolução TypeScript:**

**TypeScript inicial:**
```typescript
// Apenas runtime exports
export function add() { }
```

**TypeScript moderno:**
```typescript
// Type-only exports
export type { User } from './types';
export { fetchUser } from './api';
```

### Problema Fundamental que Resolve

Named exports resolvem problemas de **multiple exports**, **explicit API**, e **tree-shaking optimization**.

**Problema 1: Módulo com múltiplas funcionalidades**
```typescript
// Sem named exports - apenas default ❌
// math.ts
export default {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  PI: 3.14159
};

// app.ts
import math from './math';
console.log(math.add(2, 3));

// Bundler pode incluir todo objeto mesmo se apenas add usado
```

**Solução: Named exports permitem tree-shaking**
```typescript
// Com named exports - tree-shaking ✅
// math.ts
export function add(a: number, b: number) { return a + b; }
export function subtract(a: number, b: number) { return a - b; }
export const PI = 3.14159;

// app.ts
import { add } from './math';
console.log(add(2, 3));

// Bundler remove subtract e PI ✅
```

**Problema 2: API não explícita**
```typescript
// Default export object - API implícita ❌
// api.ts
const fetchUser = async () => { };
const createUser = async () => { };
const internal = () => { };  // Interno mas exposto

export default {
  fetchUser,
  createUser,
  internal  // ❌ Vazou API interna
};
```

**Solução: Named exports definem API explícita**
```typescript
// Named exports - API explícita ✅
// api.ts
async function fetchUser() { }
async function createUser() { }
function internal() { }  // Não exportado

// Apenas API pública exportada
export { fetchUser, createUser };

// 'internal' permanece privado ✅
```

**Problema 3: Autocomplete impreciso**
```typescript
// Default export object - autocomplete limitado ❌
// utils.ts
export default {
  formatDate: () => { },
  formatTime: () => { },
  formatDateTime: () => { }
};

// app.ts
import utils from './utils';
utils.  // Autocomplete pode não funcionar bem
```

**Solução: Named exports com autocomplete preciso**
```typescript
// Named exports - autocomplete perfeito ✅
// utils.ts
export function formatDate() { }
export function formatTime() { }
export function formatDateTime() { }

// app.ts
import { format } from './utils';
//       ^
//       Autocomplete mostra: formatDate, formatTime, formatDateTime ✅
```

**Problema 4: Refactoring difícil**
```typescript
// Default export object - renomear difícil ❌
export default {
  oldName: () => { }
};

// Renomear 'oldName' precisa buscar todas referências
// import utils from './utils';
// utils.oldName();  // Precisa atualizar manualmente
```

**Solução: Named exports com refactoring automático**
```typescript
// Named exports - refactoring automático ✅
export function oldName() { }

// Renomear via IDE atualiza todos imports automaticamente
// import { newName } from './utils';  // Atualizado ✅
```

**Fundamento teórico:** Named exports criam **explicit module API** - cada export é declarado explicitamente, facilitando static analysis e tooling.

### Importância no Ecossistema

Named exports são importantes porque:

- **Multiple Exports:** Exportar múltiplos elementos do módulo
- **Tree-shaking:** Bundlers eliminam exports não usados
- **Explicit API:** API pública claramente definida
- **Autocomplete:** IDE sugere exports disponíveis
- **Type Safety:** TypeScript valida exports existem
- **Refactoring:** Renomear exports atualiza imports automaticamente
- **Consistency:** Nomes consistentes entre módulos
- **Static Analysis:** Ferramentas analisam dependências

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Named Bindings:** Cada export tem nome específico
2. **Multiple Exports:** Múltiplos elementos exportados
3. **Explicit API:** API pública claramente definida
4. **Static Analysis:** Análise estática possível
5. **Tree-shaking:** Exports não usados removidos

### Pilares Fundamentais

- **Inline:** `export function add() { }`
- **List:** `export { add, subtract }`
- **Rename:** `export { add as sum }`
- **Type:** `export type { User }`
- **Mixed:** `export { value, type Type }`

### Visão Geral das Nuances

- **Consistent Names:** Mesmo nome em export e import
- **Multiple:** Múltiplos named exports por módulo
- **Type-only:** `export type` para tipos apenas
- **Rename:** `export { x as y }` renomear no export
- **Re-export:** `export { x } from './module'`

## 🧠 Fundamentos Teóricos

### Inline Named Export

```typescript
// Inline export - declaração e export juntos

// functions
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

// constants
export const PI = 3.14159;
export const E = 2.71828;

// classes
export class Calculator {
  add(a: number, b: number) { return a + b; }
}

// interfaces
export interface User {
  name: string;
  age: number;
}

// type aliases
export type UserId = string;
```

**Inline:** Declaração e export na mesma linha.

### Export List

```typescript
// Export list - exportar após declarar

function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

const PI = 3.14159;

// Export list no final do arquivo
export { add, subtract, PI };

// Vantagem: API pública visível em um lugar
```

**Export List:** Exportar múltiplos elementos em lista.

### Export with Rename

```typescript
// Renomear no export

function internalAdd(a: number, b: number): number {
  return a + b;
}

function internalSubtract(a: number, b: number): number {
  return a - b;
}

// Exportar com nomes públicos
export {
  internalAdd as add,
  internalSubtract as subtract
};

// app.ts
import { add, subtract } from './math';
// 'internalAdd' e 'internalSubtract' não visíveis
```

**Rename:** Renomear exports para API pública.

### Princípios e Conceitos Subjacentes

#### Type-only Exports

```typescript
// Export apenas tipos

// types.ts
interface User {
  name: string;
  age: number;
}

interface Product {
  id: number;
  name: string;
}

// Type-only export
export type { User, Product };

// Removido em runtime - não aparece no bundle ✅

// app.ts
import type { User, Product } from './types';
const user: User = { name: "John", age: 30 };
```

**Type-only:** `export type` para tipos apenas.

#### Mixed Exports

```typescript
// Combinar runtime values e types

// api.ts
export interface User {
  name: string;
}

export interface Product {
  id: number;
}

export async function fetchUser(): Promise<User> {
  return { name: "John" };
}

export async function fetchProduct(): Promise<Product> {
  return { id: 1 };
}

// app.ts - import mixed
import { fetchUser, fetchProduct, type User, type Product } from './api';

const user: User = await fetchUser();
const product: Product = await fetchProduct();
```

**Mixed:** Combinar values e types.

### Combining with Default Export

```typescript
// Combinar named e default exports

// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

export function helper() {
  return "helper";
}

export const PI = 3.14159;

// app.ts - importar ambos
import Calculator, { helper, PI } from './calculator';

const calc = new Calculator();
console.log(calc.add(2, 3));
console.log(helper());
console.log(PI);
```

**Combined:** Default e named exports juntos.

#### Private vs Public

```typescript
// Diferenciar privado e público

// utils.ts - privado (não exportado)
function internalHelper() {
  return "internal";
}

function privateValidator() {
  return true;
}

// Público (exportado)
export function formatDate() {
  return internalHelper();  // Usa função privada
}

export function validateEmail() {
  return privateValidator();  // Usa função privada
}

// app.ts
import { formatDate, validateEmail } from './utils';
// internalHelper e privateValidator não acessíveis ✅
```

**Private:** Apenas exports são públicos.

### Export Declaration Types

```typescript
// Exportar diferentes tipos de declarações

// Functions
export function add() { }
export const subtract = () => { };
export async function fetch() { }

// Classes
export class Calculator { }
export abstract class BaseClass { }

// Interfaces
export interface User { }

// Type aliases
export type UserId = string;

// Enums
export enum Color { Red, Green, Blue }

// Constants
export const API_URL = "https://api.com";

// Variables
export let count = 0;
```

**Types:** Exportar qualquer declaração.

#### Export Multiple from Same Module

```typescript
// Múltiplos exports do mesmo módulo

export function add() { }
export function subtract() { }
export function multiply() { }
export function divide() { }

export const PI = 3.14159;
export const E = 2.71828;

export class Calculator { }
export class AdvancedCalculator extends Calculator { }

export interface User { }
export type UserId = string;

// Não há limite de named exports por módulo
```

**Multiple:** Ilimitados named exports por módulo.

### Const Assertions

```typescript
// Named export com const assertions

export const CONFIG = {
  apiUrl: "https://api.com",
  timeout: 5000
} as const;

// CONFIG é readonly em nível profundo

export const COLORS = ["red", "green", "blue"] as const;
// COLORS: readonly ["red", "green", "blue"]

// app.ts
import { CONFIG, COLORS } from './config';
// CONFIG.apiUrl = "...";  // ✗ Error - readonly
```

**Const Assertions:** Named exports com `as const`.

#### Namespace Export Pattern

```typescript
// Pattern: agrupar exports relacionados

// userApi.ts
export function fetchUser() { }
export function createUser() { }
export function updateUser() { }
export function deleteUser() { }

// productApi.ts
export function fetchProduct() { }
export function createProduct() { }
export function updateProduct() { }
export function deleteProduct() { }

// app.ts - namespace import para organização
import * as userApi from './userApi';
import * as productApi from './productApi';

userApi.fetchUser();
productApi.fetchProduct();
```

**Namespace Pattern:** Agrupar named exports.

### Modelo Mental para Compreensão

Pense em named exports como **labeled boxes in warehouse**:

**Named exports:** Caixas com etiquetas específicas
**Imports:** Pegar caixas pelas etiquetas

**Analogia - Library:**

**Named exports:** Livros com títulos específicos na estante
**Imports:** Pegar livros pelos títulos exatos

**Metáfora - Menu:**

**Named exports:** Pratos com nomes específicos
**Imports:** Pedir pratos pelos nomes

**Fluxo de named export:**
```
1. export function add() { }
2. TypeScript registra 'add' no module namespace
3. Valida nome único no módulo
4. Import deve usar nome exato (ou renomear)
5. Bundler marca 'add' como usado
6. Tree-shaking remove exports não usados
```

**Exemplo visual:**
```
math.ts
┌─────────────────┐
│ export add      │ ← Named export
│ export subtract │ ← Named export
│ export PI       │ ← Named export
└─────────────────┘
        ↓
Module Namespace
┌─────────────────┐
│ add: function   │
│ subtract: fn    │
│ PI: 3.14159     │
└─────────────────┘
        ↓
import { add, PI }
        ↓
Bundle (tree-shaked)
┌─────────────────┐
│ function add    │
│ const PI        │
└─────────────────┘
```

## 🔍 Análise Conceitual Profunda

### Tree-shaking Optimization

```typescript
// Named exports maximizam tree-shaking

// lodash-es.ts - centenas de funções
export function map() { }
export function filter() { }
export function reduce() { }
export function forEach() { }
export function find() { }
// ... 200+ funções

// app.ts - importar apenas necessário
import { map, filter } from 'lodash-es';

console.log(map([1, 2, 3], x => x * 2));
console.log(filter([1, 2, 3], x => x > 1));

// Bundler tree-shaking:
// 1. Analisa import { map, filter }
// 2. Marca map e filter como usados
// 3. Remove reduce, forEach, find, etc. (200+ funções) ✅
// 4. Bundle final: ~2KB vs ~70KB completo

// Named exports economizam 68KB ✅
```

**Tree-shaking:** Named exports permitem remoção precisa.

#### Export Barrel Pattern

```typescript
// Barrel file organiza named exports

// components/Button.tsx
export function Button() { }

// components/Input.tsx
export function Input() { }

// components/Card.tsx
export function Card() { }

// components/index.ts - barrel
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';

// app.ts - import de barrel
import { Button, Input, Card } from './components';

// Simplifica imports mantendo tree-shaking ✅
```

**Barrel:** Agregador de named exports.

### API Design

```typescript
// Named exports definem API pública clara

// database.ts
class Connection {
  connect() { }
  disconnect() { }
}

function createConnection(): Connection {
  return new Connection();
}

function internalQuery() {
  // Função interna
}

// API pública via named exports
export { createConnection };
export type { Connection };  // Tipo público

// Connection class não exportada diretamente
// internalQuery permanece privado
// API controlada e explícita ✅

// app.ts
import { createConnection, type Connection } from './database';

const conn: Connection = createConnection();
// internalQuery não acessível ✅
```

**API Design:** Named exports controlam API pública.

#### Convention: Export List at End

```typescript
// Convenção: export list no final do arquivo

// math.ts
function add(a: number, b: number): number {
  return a + b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

const PI = 3.14159;

// Export list no final - API visível em um lugar
export {
  add,
  subtract,
  multiply,
  PI
};

// Vantagens:
// - API pública visível rapidamente
// - Fácil adicionar/remover exports
// - Separação clara: implementação vs API
```

**Convention:** Export list no final para clareza.

### Type-only Export Optimization

```typescript
// Type-only exports otimizam bundle

// types.ts
export interface User {
  name: string;
  age: number;
}

export interface Product {
  id: number;
  name: string;
}

export type UserId = string;
export type ProductId = number;

// api.ts
export type { User, Product, UserId, ProductId } from './types';

export async function fetchUser(): Promise<User> {
  return { name: "John", age: 30 };
}

// TypeScript compila types.ts para:
// (nada - types removidos em runtime)

// Bundle não inclui types.ts ✅
// Apenas fetchUser incluído
```

**Type-only:** Types removidos do bundle.

#### Circular Dependency Support

```typescript
// Named exports suportam circular dependencies

// a.ts
import { b } from './b';

export function a() {
  console.log("a");
  b();  // Chama função de b.ts
}

// b.ts
import { a } from './a';

export function b() {
  console.log("b");
  // a();  // Pode chamar função de a.ts
}

// Named exports criam live bindings
// Permitem circular dependencies funcionarem ✅
```

**Circular:** Named exports suportam circular dependencies.

### ESLint Rules

```typescript
// ESLint rules para named exports

// .eslintrc
{
  "rules": {
    // Força named exports
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    
    // Ordena exports alfabeticamente
    "sort-exports/sort-exports": "error",
    
    // Força type-only imports quando possível
    "@typescript-eslint/consistent-type-imports": "error"
  }
}

// Muitos projetos preferem named exports exclusivamente
```

**ESLint:** Regras para named exports.

#### Performance Benefits

```typescript
// Named exports melhoram performance

// 1. Bundle size menor via tree-shaking
// lodash completo: 70KB
// lodash named imports: 2KB ✅

// 2. Code splitting facilitado
import { Button } from './components';  // Chunk específico
// vs
import components from './components';  // Chunk inteiro

// 3. Lazy loading granular
const { map } = await import('lodash-es');  // Apenas map
// vs
const lodash = await import('lodash');  // Tudo

// 4. Parsing mais rápido
// Menos código → parsing mais rápido
```

**Performance:** Named exports melhoram performance.

### TypeScript Inference

```typescript
// TypeScript infere tipos de named exports

// utils.ts
export function add(a: number, b: number) {
  return a + b;  // Infere: number
}

export const USER = {
  name: "John",
  age: 30
};  // Infere: { name: string; age: number; }

export class Calculator {
  result = 0;  // Infere: number
}

// app.ts
import { add, USER, Calculator } from './utils';

// Hover sobre exports mostra tipos inferidos
// add: (a: number, b: number) => number
// USER: { name: string; age: number; }
// Calculator: typeof Calculator
```

**Inference:** TypeScript infere tipos precisamente.

## 🎯 Aplicabilidade e Contextos

### Utility Modules

```typescript
export function formatDate() { }
export function validateEmail() { }
```

**Raciocínio:** Múltiplas utilities relacionadas.

### API Modules

```typescript
export function fetchUser() { }
export function createUser() { }
```

**Raciocínio:** Múltiplos endpoints da API.

### Type Definitions

```typescript
export interface User { }
export type UserId = string;
```

**Raciocínio:** Múltiplos tipos relacionados.

### Component Libraries

```typescript
export { Button } from './Button';
export { Input } from './Input';
```

**Raciocínio:** Re-exportar componentes.

## ⚠️ Limitações e Considerações Teóricas

### No Default Export

```typescript
// Named exports não incluem default
// Precisa export separado
export default Calculator;
export { helper, PI };
```

**Limitação:** Default export separado.

### Consistent Naming Required

```typescript
// Import deve usar mesmo nome (ou renomear)
export function add() { }
import { add } from './math';  // Mesmo nome
import { add as sum } from './math';  // Ou renomear
```

**Consideração:** Nomes devem ser consistentes.

### Verbose with Many Exports

```typescript
// Muitos exports podem ser verbosos
import {
  a, b, c, d, e, f, g, h, i, j
} from './module';
// Considere namespace import
```

**Limitação:** Verboso com muitos exports.

## 🔗 Interconexões Conceituais

**Relação com Tree-shaking:** Named exports maximizam tree-shaking.

**Relação com Default Exports:** Podem coexistir no mesmo módulo.

**Relação com Re-exports:** Barrel files agregam named exports.

**Relação com Type-only Imports:** `export type` otimiza bundle.

**Relação com Module Namespace:** Named exports adicionam propriedades ao namespace.

## 🚀 Evolução e Próximos Conceitos

Dominar named exports prepara para:
- **Re-exports:** Barrel pattern e re-exportação
- **Dynamic Imports:** `import()` lazy loading
- **Module Resolution:** Como TypeScript resolve módulos
- **Tree-shaking:** Otimização avançada de bundle
- **Module Bundling:** Webpack, Rollup, esbuild
