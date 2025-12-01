# Named Imports (import { })

## 🎯 Introdução e Definição

### Definição Conceitual

**Named imports** (`import { name }`) é syntax ES6 que **importa exports específicos de módulo** usando **destructuring-like syntax**. Diferentemente de namespace import que importa tudo, named imports selecionam **apenas exports necessários**, permitindo **tree-shaking otimizado** e **bundle sizes menores**.

Conceitualmente, named imports implementam **selective importing** - escolher precisamente quais elementos importar ao invés de importar módulo inteiro. Segue **principle of least privilege** - importar apenas o necessário. Facilita **static analysis** - bundlers identificam exatamente quais exports são usados e eliminam código morto via tree-shaking.

**Fundamento teórico:** Named imports derivam de **destructuring pattern** - syntax similar a object destructuring mas com semântica diferente. Enquanto destructuring extrai propriedades de objeto runtime, named imports criam **static bindings** - referências diretas aos exports do módulo estabelecidas em compile-time. TypeScript valida que imports existem via **static type checking**.

**Pattern básico:**
```typescript
// math.ts - módulo com múltiplos exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// app.ts - named imports
import { add, subtract } from './math';

console.log(add(2, 3));      // 5
console.log(subtract(5, 3)); // 2
// PI não importado - tree-shaking remove
```

**Diferença fundamental:**
- **Namespace import:** `import * as math` - importa tudo
- **Named imports:** `import { add }` - importa apenas add

### Contexto Histórico e Evolução

**ECMAScript 2015 (ES6) (2015):** Introdução de named imports.

```javascript
// ES6 (2015) - named imports
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

**Motivação inicial:** Tree-shaking, bundle size optimization.

**TypeScript 1.5 (2015):** Suporte a named imports com type checking.

```typescript
// TypeScript 1.5 - named imports
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';
console.log(add(2, 3));  // TypeScript valida tipos
// import { nonexistent } from './math';  // ✗ Error - não existe
```

**TypeScript 2.0 (2016):** Import renaming com `as`.

```typescript
// TypeScript 2.0 - renaming
import { add as sum } from './math';
console.log(sum(2, 3));  // Usa como 'sum'
```

**TypeScript 2.7 (2018):** Type-only imports.

```typescript
// TypeScript 2.7 - type-only imports
// types.ts
export interface User {
  name: string;
}

// app.ts
import type { User } from './types';
const user: User = { name: "John" };
```

**TypeScript 3.8 (2020):** `import type` syntax.

```typescript
// TypeScript 3.8 - import type
import type { User } from './types';
// User só existe em compile-time
```

**TypeScript 4.5 (2021):** Type modifier em imports.

```typescript
// TypeScript 4.5 - type modifier
import { fetchUser, type User } from './api';

// fetchUser runtime value
// User compile-time type
```

**Webpack 2 (2017):** Tree-shaking nativo para ES6 modules.

```javascript
// Webpack 2 - tree-shaking
import { add } from './math';
// subtract e PI removidos do bundle ✅
```

**Antes vs Depois:**

**Pré-ES6 (CommonJS):**
```javascript
// CommonJS - importa módulo inteiro
const math = require('./math');
console.log(math.add(2, 3));

// Ou destructuring runtime
const { add, subtract } = require('./math');
// Tree-shaking impossível - módulo inteiro carregado
```

**Pós-ES6 (named imports):**
```typescript
// Named imports - tree-shaking enabled
import { add } from './math';
// Apenas 'add' no bundle ✅
```

**Evolução TypeScript:**

**TypeScript inicial:**
```typescript
// Apenas runtime imports
import { add } from './math';
```

**TypeScript moderno:**
```typescript
// Type-only imports
import type { User } from './types';
import { fetchUser } from './api';
```

### Problema Fundamental que Resolve

Named imports resolvem problemas de **bundle size**, **tree-shaking**, e **code clarity**.

**Problema 1: Bundle size desnecessariamente grande**
```typescript
// Sem named imports - módulo inteiro no bundle ❌
import * as _ from 'lodash';
console.log(_.map([1, 2, 3], x => x * 2));

// Bundle inclui TODO lodash (~70KB gzipped)
```

**Solução: Named imports com tree-shaking**
```typescript
// Com named imports - apenas map no bundle ✅
import { map } from 'lodash-es';
console.log(map([1, 2, 3], x => x * 2));

// Bundle inclui apenas map (~1KB) ✅
```

**Problema 2: Imports não específicos dificultam análise**
```typescript
// Namespace import - difícil saber o que é usado ❌
import * as utils from './utils';

function process() {
  utils.add();
  utils.subtract();
  // Bundler precisa incluir todo './utils'
}
```

**Solução: Named imports explícitos**
```typescript
// Named imports - bundler sabe exatamente o que é usado ✅
import { add, subtract } from './utils';

function process() {
  add();
  subtract();
  // Bundler inclui apenas add e subtract ✅
}
```

**Problema 3: Código verboso com namespace imports**
```typescript
// Namespace import - verboso ❌
import * as React from 'react';

function Component() {
  const [state, setState] = React.useState(0);
  React.useEffect(() => {}, []);
  return React.createElement('div', null, state);
}
```

**Solução: Named imports concisos**
```typescript
// Named imports - conciso ✅
import { useState, useEffect, createElement } from 'react';

function Component() {
  const [state, setState] = useState(0);
  useEffect(() => {}, []);
  return createElement('div', null, state);
}
```

**Problema 4: Tree-shaking impossível**
```typescript
// CommonJS - tree-shaking impossível ❌
const utils = require('./utils');
console.log(utils.add(2, 3));

// Bundler não pode remover exports não usados
// Module.exports é runtime object
```

**Solução: Named imports permitem tree-shaking**
```typescript
// Named imports - tree-shaking enabled ✅
import { add } from './utils';
console.log(add(2, 3));

// Bundler remove subtract, multiply, etc. ✅
```

**Fundamento teórico:** Named imports permitem **static analysis** - bundler analisa imports em compile-time e elimina código morto via tree-shaking.

### Importância no Ecossistema

Named imports são importantes porque:

- **Tree-shaking:** Bundlers eliminam exports não usados
- **Bundle Size:** Bundles menores com apenas código necessário
- **Clarity:** Código mais conciso sem namespace prefix
- **Autocomplete:** IDE sugere exports disponíveis
- **Type Safety:** TypeScript valida imports existem
- **Refactoring:** Renomear exports atualiza imports automaticamente
- **Performance:** Bundles menores carregam mais rápido
- **Static Analysis:** Ferramentas detectam imports não usados

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Selective Import:** Importar apenas exports necessários
2. **Static Bindings:** Referências diretas aos exports
3. **Tree-shaking:** Bundlers eliminam exports não usados
4. **Type Safety:** TypeScript valida imports existem
5. **Concise:** Código mais conciso sem namespace prefix

### Pilares Fundamentais

- **Syntax:** `import { name } from 'module'`
- **Multiple:** `import { name1, name2 } from 'module'`
- **Rename:** `import { name as alias } from 'module'`
- **Type-only:** `import type { Type } from 'module'`
- **Mixed:** `import { value, type Type } from 'module'`

### Visão Geral das Nuances

- **Destructuring-like:** Syntax similar a destructuring mas semântica diferente
- **Static:** Imports resolvidos em compile-time
- **Live Bindings:** Imports são live bindings aos exports
- **Immutable:** Imported values não podem ser reatribuídos
- **Autocomplete:** IDE sugere exports disponíveis

## 🧠 Fundamentos Teóricos

### Basic Named Import

```typescript
// math.ts - módulo com exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// app.ts - named import
import { add } from './math';

console.log(add(2, 3));  // 5

// Apenas 'add' importado
// subtract e PI não importados - tree-shaking pode remover ✅
```

**Named import:** Importar export específico.

### Multiple Named Imports

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// app.ts - múltiplos named imports
import { add, subtract, PI } from './math';

console.log(add(2, 3));      // 5
console.log(subtract(5, 3)); // 2
console.log(PI);             // 3.14159
```

**Multiple:** Importar múltiplos exports na mesma linha.

### Import Renaming

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts - renaming com 'as'
import { add as sum } from './math';

console.log(sum(2, 3));  // 5
// 'add' não existe - renomeado para 'sum'
```

**Renaming:** Renomear import com `as`.

### Princípios e Conceitos Subjacentes

#### Type Safety

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import { add } from './math';

add(2, 3);          // ✓ OK
// add("2", "3");   // ✗ Error - tipos incorretos
// add(2);          // ✗ Error - faltando argumento

// Import não existente
// import { subtract } from './math';  // ✗ Error - 'subtract' não existe
```

**Type Safety:** TypeScript valida imports e tipos.

#### Autocomplete

```typescript
// utils.ts
export function formatDate() { }
export function formatTime() { }
export function formatDateTime() { }

// app.ts - autocomplete
import { format } from './utils';
//       ^
//       IDE sugere: formatDate, formatTime, formatDateTime
```

**Autocomplete:** IDE sugere exports disponíveis.

### Live Bindings

```typescript
// counter.ts
export let count = 0;

export function increment() {
  count++;
}

// app.ts
import { count, increment } from './counter';

console.log(count);  // 0
increment();
console.log(count);  // 1 - live binding ✅

// count++;  // ✗ Error - cannot assign to imported binding
```

**Live Bindings:** Imports refletem mudanças no export original.

#### Immutability

```typescript
// config.ts
export const API_URL = "https://api.example.com";

export function getConfig() {
  return { url: API_URL };
}

// app.ts
import { API_URL, getConfig } from './config';

console.log(API_URL);  // "https://api.example.com"

// API_URL = "https://other.com";  // ✗ Error - cannot assign to import
// Imports são read-only
```

**Immutability:** Imported values não podem ser reatribuídos.

### Type-only Imports

```typescript
// types.ts
export interface User {
  name: string;
  age: number;
}

export function createUser(name: string): User {
  return { name, age: 0 };
}

// app.ts - type-only import
import type { User } from './types';
import { createUser } from './types';

const user: User = createUser("John");

// User só existe em compile-time
// const value = User;  // ✗ Error - User não existe em runtime
```

**Type-only:** `import type` para tipos apenas.

#### Mixed Imports (Type Modifier)

```typescript
// api.ts
export interface User {
  name: string;
}

export function fetchUser(): User {
  return { name: "John" };
}

// app.ts - mixed import com type modifier
import { fetchUser, type User } from './api';

const user: User = fetchUser();

// fetchUser é runtime value
// User é compile-time type
```

**Mixed:** Combinar runtime values e types no mesmo import.

### Combining Named and Default Imports

```typescript
// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

export function helper() {
  return "helper";
}

// app.ts - combinar default e named
import Calculator, { helper } from './calculator';

const calc = new Calculator();
console.log(calc.add(2, 3));  // 5
console.log(helper());        // "helper"
```

**Combined:** Combinar default e named imports.

#### Selective Importing

```typescript
// lodash-es - biblioteca com muitos exports
// Sem named imports - bundle grande ❌
import * as _ from 'lodash-es';
_.map(...);
_.filter(...);

// Com named imports - tree-shaking ✅
import { map, filter } from 'lodash-es';
map(...);
filter(...);

// Bundle inclui apenas map e filter ✅
```

**Selective:** Named imports permitem tree-shaking.

### Avoiding Name Conflicts

```typescript
// date.ts
export function format(date: Date): string {
  return date.toISOString();
}

// string.ts
export function format(str: string): string {
  return str.toUpperCase();
}

// app.ts - evitar conflicts com renaming
import { format as formatDate } from './date';
import { format as formatString } from './string';

console.log(formatDate(new Date()));
console.log(formatString("hello"));
```

**Conflicts:** Renaming evita name conflicts.

#### Re-exports

```typescript
// Named imports com re-exports

// math/add.ts
export function add(a: number, b: number) { return a + b; }

// math/subtract.ts
export function subtract(a: number, b: number) { return a - b; }

// math/index.ts - barrel file
export { add } from './add';
export { subtract } from './subtract';

// app.ts - import de barrel
import { add, subtract } from './math';

console.log(add(2, 3));
console.log(subtract(5, 3));
```

**Re-exports:** Named imports funcionam com barrel files.

### Import Paths

```typescript
// Relative paths
import { add } from './math';           // Mesmo diretório
import { helper } from '../utils';      // Diretório pai
import { config } from '../../config';  // Dois níveis acima

// Absolute paths (node_modules)
import { useState } from 'react';
import { map } from 'lodash-es';

// Path aliases (via tsconfig.json)
import { User } from '@/types';
import { api } from '@/services/api';

// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Paths:** Relative, absolute, e path aliases.

#### Circular Dependencies

```typescript
// a.ts
import { b } from './b';

export function a() {
  console.log("a");
  b();
}

// b.ts
import { a } from './a';

export function b() {
  console.log("b");
  // a();  // Circular dependency
}

// Named imports funcionam com circular deps
// Live bindings permitem acesso
```

**Circular:** Named imports suportam circular dependencies.

### Modelo Mental para Compreensão

Pense em named imports como **picking specific tools from toolbox**:

**Namespace import:** Carregar toolbox inteira
**Named imports:** Pegar ferramentas específicas

**Analogia - Grocery Shopping:**

**Namespace import:** Comprar cesta pré-montada com tudo
**Named imports:** Escolher produtos específicos

**Metáfora - Library:**

**Namespace import:** Pegar estante inteira
**Named imports:** Pegar livros específicos

**Fluxo de named import:**
```
1. import { add } from './math'
2. TypeScript analisa exports de math.ts
3. Valida 'add' existe em exports
4. Cria static binding para 'add'
5. Bundler marca 'add' como usado
6. Tree-shaking remove exports não usados
```

**Exemplo visual:**
```
math.ts
┌─────────────────┐
│ export add      │ ← Importado
│ export subtract │ ← Não importado (tree-shaked)
│ export PI       │ ← Não importado (tree-shaked)
└─────────────────┘
        ↓
import { add }
        ↓
Bundle
┌─────────────────┐
│ function add    │
└─────────────────┘
```

## 🔍 Análise Conceitual Profunda

### Tree-shaking Optimization

```typescript
// Named imports permitem tree-shaking eficiente

// utils.ts
export function add(a: number, b: number) { return a + b; }
export function subtract(a: number, b: number) { return a - b; }
export function multiply(a: number, b: number) { return a * b; }
export function divide(a: number, b: number) { return a / b; }

// app.ts - named import
import { add } from './utils';
console.log(add(2, 3));

// Bundler tree-shaking:
// 1. Analisa import { add }
// 2. Marca 'add' como usado
// 3. Remove subtract, multiply, divide do bundle ✅
// 4. Bundle final contém apenas add

// Bundle size reduzido significativamente
```

**Tree-shaking:** Named imports maximizam tree-shaking.

#### Bundle Size Analysis

```typescript
// Comparação bundle size

// lodash-es completo: ~70KB gzipped
import * as _ from 'lodash-es';

// Apenas map: ~1KB gzipped
import { map } from 'lodash-es';

// Múltiplas funções: ~5KB gzipped
import { map, filter, reduce } from 'lodash-es';

// Tree-shaking reduz bundle em 65KB+ ✅
```

**Bundle Size:** Named imports reduzem bundle significativamente.

### Static Analysis

```typescript
// Named imports permitem static analysis

// TypeScript analisa em compile-time:
import { add } from './math';

// 1. Valida './math' existe
// 2. Valida 'add' é export de './math'
// 3. Infere tipo de 'add'
// 4. Valida uso de 'add' no código

// IDE features:
// - Autocomplete para exports
// - Go to definition
// - Find all references
// - Rename refactoring
```

**Static Analysis:** Named imports habilitam ferramentas poderosas.

#### Performance Benefits

```typescript
// Named imports melhoram performance

// 1. Bundle size menor → download mais rápido
// 2. Menos código → parsing mais rápido
// 3. Tree-shaking → menos código para executar
// 4. Code splitting facilitado

// Exemplo: React application
import { useState, useEffect } from 'react';  // ~5KB
// vs
import * as React from 'react';  // ~40KB

// 35KB economizados ✅
```

**Performance:** Named imports melhoram performance.

### Import Organization

```typescript
// Organizar imports por categoria

// External libraries
import { useState, useEffect } from 'react';
import { map, filter } from 'lodash-es';

// Internal modules
import { User } from '@/types';
import { api } from '@/services/api';
import { validateEmail } from '@/utils/validation';

// Relative imports
import { helper } from './helper';
import { config } from '../config';

// Convenção: external → internal → relative
```

**Organization:** Organizar imports por tipo.

#### Import Sorting

```typescript
// Ordenar imports alfabeticamente

import { filter, map, reduce } from 'lodash-es';
import { useEffect, useState } from 'react';

// Tools: ESLint, Prettier podem ordenar automaticamente
```

**Sorting:** Ordenar imports para consistência.

### Type-only Import Optimization

```typescript
// Type-only imports removidos em runtime

// types.ts
export interface User {
  name: string;
}

export interface Product {
  id: number;
}

// app.ts
import type { User, Product } from './types';

// TypeScript compila para:
// (nada - types removidos em runtime)

// Bundle não inclui './types' ✅
```

**Type-only:** Otimização de bundle com type-only imports.

#### Mixed Import Pattern

```typescript
// Pattern: mixed imports

// api.ts
export interface User {
  name: string;
}

export interface Product {
  id: number;
}

export function fetchUser(): User { ... }
export function fetchProduct(): Product { ... }

// app.ts - antes (2 imports)
import type { User, Product } from './api';
import { fetchUser, fetchProduct } from './api';

// app.ts - depois (1 import) ✅
import { fetchUser, fetchProduct, type User, type Product } from './api';

// Mais conciso e organizado
```

**Mixed:** Combinar types e values em um import.

### Advanced Renaming Patterns

```typescript
// Renaming patterns avançados

// 1. Evitar conflicts
import { format as formatDate } from './date';
import { format as formatString } from './string';

// 2. Clareza
import { getData as getUserData } from './userApi';
import { getData as getProductData } from './productApi';

// 3. Nomenclatura consistente
import { User as UserType } from './types';
import { User as UserModel } from './models';

// 4. Shortening
import { VeryLongFunctionNameHere as shortName } from './utils';
```

**Renaming:** Padrões de renaming.

#### Barrel File Pattern

```typescript
// Barrel file com named imports

// components/Button.tsx
export function Button() { }

// components/Input.tsx
export function Input() { }

// components/index.ts - barrel
export { Button } from './Button';
export { Input } from './Input';

// app.ts - import de barrel
import { Button, Input } from './components';

// Simplifica imports
```

**Barrel:** Named imports com barrel files.

### Unused Import Detection

```typescript
// TypeScript detecta imports não usados

import { add, subtract, multiply } from './math';

console.log(add(2, 3));

// subtract e multiply não usados
// IDE mostra warning
// tsconfig.json
{
  "compilerOptions": {
    "noUnusedLocals": true
  }
}
```

**Unused:** TypeScript detecta imports não usados.

## 🎯 Aplicabilidade e Contextos

### Library Usage

```typescript
import { useState, useEffect } from 'react';
import { map, filter } from 'lodash-es';
```

**Raciocínio:** Tree-shaking reduz bundle size.

### Component Imports

```typescript
import { Button, Input, Card } from '@/components';
```

**Raciocínio:** Organização clara de componentes.

### Utility Functions

```typescript
import { formatDate, validateEmail } from '@/utils';
```

**Raciocínio:** Selective import de utilities.

### Type Definitions

```typescript
import type { User, Product } from '@/types';
import { type ApiResponse, fetchData } from '@/api';
```

**Raciocínio:** Type-only imports otimizam bundle.

## ⚠️ Limitações e Considerações Teóricas

### Verbosity with Many Imports

```typescript
// Muitos imports podem ser verbosos
import {
  add,
  subtract,
  multiply,
  divide,
  power,
  sqrt,
  abs,
  round
} from './math';

// Considere namespace import neste caso
import * as math from './math';
```

**Limitação:** Muitos named imports podem ser verbosos.

### Default Export Não Incluído

```typescript
// Named imports não incluem default export
import { helper } from './module';
// Default export precisa import separado
import Calculator from './module';
```

**Consideração:** Default e named imports separados.

## 🔗 Interconexões Conceituais

**Relação com Tree-shaking:** Named imports maximizam tree-shaking.

**Relação com Namespace Imports:** Alternativa mais seletiva.

**Relação com Default Imports:** Podem combinar ambos.

**Relação com Re-exports:** Funcionam com barrel files.

**Relação com Bundlers:** Bundlers otimizam named imports.

## 🚀 Evolução e Próximos Conceitos

Dominar named imports prepara para:
- **Default Imports:** `import default from`
- **Named Exports:** Variantes de export
- **Re-exports:** Barrel pattern
- **Dynamic Imports:** `import()` lazy loading
- **Module Resolution:** Como TypeScript resolve módulos
