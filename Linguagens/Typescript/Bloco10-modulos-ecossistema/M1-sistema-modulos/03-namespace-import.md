# Namespace Import (import * as)

## 🎯 Introdução e Definição

### Definição Conceitual

**Namespace import** (`import * as name`) é syntax ES6 que **importa todos os exports de um módulo** em **objeto namespace único**. Diferentemente de named imports que importam elementos individuais, namespace import cria **container object** contendo todas as exportações do módulo como propriedades.

Conceitualmente, namespace import implementa **module namespace object** - objeto que encapsula todos os exports de módulo sob single identifier. Evita **namespace pollution** - ao invés de importar múltiplos nomes no escopo local, agrupa todos sob namespace. Facilita **discoverability** - IDE pode listar todos os exports via autocomplete no namespace object.

**Fundamento teórico:** Namespace import deriva de **namespace pattern** - padrão que cria container object para agrupar funcionalidades relacionadas. Implementa **single identifier binding** - todo módulo acessado via único nome ao invés de múltiplos imports. TypeScript converte namespace import em **module namespace exotic object** - objeto especial imutável com propriedades read-only correspondendo aos exports.

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

// app.ts - namespace import
import * as math from './math';

console.log(math.add(2, 3));     // 5
console.log(math.subtract(5, 3)); // 2
console.log(math.PI);             // 3.14159
```

**Diferença fundamental:**
- **Named import:** `import { add, subtract }` - múltiplos nomes no escopo
- **Namespace import:** `import * as math` - único namespace object

### Contexto Histórico e Evolução

**ECMAScript 2015 (ES6) (2015):** Introdução de namespace import.

```javascript
// ES6 (2015) - namespace import
// math.js
export function add(a, b) {
  return a + b;
}
export function subtract(a, b) {
  return a - b;
}

// app.js
import * as math from './math.js';
console.log(math.add(2, 3));
```

**Motivação inicial:** Evitar namespace pollution, agrupar exports relacionados.

**TypeScript 1.5 (2015):** Suporte a namespace import.

```typescript
// TypeScript 1.5 - namespace import
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import * as math from './math';
console.log(math.add(2, 3));  // TypeScript valida tipos
```

**TypeScript 2.0 (2016):** `esModuleInterop` para CommonJS.

```typescript
// TypeScript 2.0 - esModuleInterop
// Sem esModuleInterop
import * as lodash from 'lodash';  // Necessário para CommonJS

// Com esModuleInterop
import lodash from 'lodash';  // Permite import default
```

**TypeScript 2.7 (2018):** Type-only namespace imports.

```typescript
// TypeScript 2.7 - type-only imports
// types.ts
export interface User {
  name: string;
}
export type UserId = string;

// app.ts
import type * as Types from './types';
const user: Types.User = { name: "John" };
```

**TypeScript 3.8 (2020):** `import type` syntax.

```typescript
// TypeScript 3.8 - import type
import type * as Types from './types';
// Types só existe em compile-time
```

**TypeScript 4.5 (2021):** Melhor type inference com namespace imports.

```typescript
// TypeScript 4.5 - melhor inference
import * as utils from './utils';

// TypeScript infere tipos precisos de utils.*
```

**Antes vs Depois:**

**Pré-ES6 (sem namespace import):**
```javascript
// Múltiplos globals poluem namespace
var add = require('./math').add;
var subtract = require('./math').subtract;
var multiply = require('./math').multiply;
// 3 nomes no escopo local
```

**Pós-ES6 (com namespace import):**
```typescript
// Namespace import agrupa sob único nome
import * as math from './math';
// Apenas 'math' no escopo local
```

**Evolução TypeScript:**

**TypeScript inicial:**
```typescript
// Apenas runtime imports
import * as math from './math';
```

**TypeScript moderno:**
```typescript
// Type-only namespace imports
import type * as Types from './types';
```

### Problema Fundamental que Resolve

Namespace import resolve problemas de **namespace pollution**, **import organization**, e **discoverability**.

**Problema 1: Namespace pollution com muitos imports**
```typescript
// Sem namespace import - muitos nomes poluem escopo ❌
import { add, subtract, multiply, divide, power, sqrt, abs, round, floor, ceil } from './math';

// 10 nomes no escopo local
console.log(add(2, 3));
console.log(sqrt(16));
```

**Solução: Namespace import agrupa sob único nome**
```typescript
// Com namespace import - apenas 1 nome no escopo ✅
import * as math from './math';

// Apenas 'math' no escopo local
console.log(math.add(2, 3));
console.log(math.sqrt(16));
```

**Problema 2: Name conflicts**
```typescript
// Sem namespace - conflicts possíveis ❌
import { format } from './date';
import { format } from './string';  // ✗ Error - 'format' já declarado

// Precisa rename
import { format as formatDate } from './date';
import { format as formatString } from './string';
```

**Solução: Namespace import evita conflicts**
```typescript
// Com namespace - sem conflicts ✅
import * as dateUtils from './date';
import * as stringUtils from './string';

console.log(dateUtils.format(new Date()));
console.log(stringUtils.format("hello"));
```

**Problema 3: Discoverability difícil**
```typescript
// Sem namespace - precisa conhecer exports ❌
import { add, subtract } from './math';

// Usuário precisa saber quais funções existem
// Sem autocomplete para descobrir outras funções
```

**Solução: Namespace import facilita discoverability**
```typescript
// Com namespace - autocomplete mostra todos exports ✅
import * as math from './math';

math.  // IDE mostra: add, subtract, multiply, divide, PI, etc.
```

**Problema 4: Organização de imports**
```typescript
// Sem namespace - imports desorganizados ❌
import { fetchUser, saveUser, deleteUser } from './userApi';
import { validateEmail, validatePassword } from './userValidation';
import { hashPassword, comparePassword } from './userAuth';

// 7 nomes importados
```

**Solução: Namespace import organiza logicamente**
```typescript
// Com namespace - organização clara ✅
import * as userApi from './userApi';
import * as userValidation from './userValidation';
import * as userAuth from './userAuth';

userApi.fetchUser();
userValidation.validateEmail();
userAuth.hashPassword();
```

**Fundamento teórico:** Namespace import implementa **single point of access** - todo módulo acessado via único namespace ao invés de múltiplos identifiers.

### Importância no Ecossistema

Namespace import é importante porque:

- **Namespace Pollution:** Evitar poluir escopo local com múltiplos nomes
- **Name Conflicts:** Prevenir conflitos de nomes
- **Discoverability:** IDE autocomplete mostra todos exports
- **Organization:** Agrupar imports relacionados logicamente
- **Clarity:** Código mais claro - origem de função óbvia (`math.add`)
- **Refactoring:** Renomear namespace é mais fácil que múltiplos imports
- **Type Safety:** TypeScript valida acesso a propriedades do namespace
- **Tree-shaking:** Bundlers podem tree-shake exports não usados

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Namespace Object:** Objeto contendo todos os exports do módulo
2. **Single Identifier:** Único nome no escopo local
3. **Read-only:** Namespace object é imutável
4. **Static Analysis:** TypeScript valida propriedades do namespace
5. **Tree-shaking:** Bundlers eliminam exports não usados

### Pilares Fundamentais

- **Syntax:** `import * as name from 'module'`
- **Access:** `name.export` para acessar exports
- **Type Safety:** TypeScript valida `name.export` existe
- **Autocomplete:** IDE sugere propriedades do namespace
- **Immutable:** Namespace object não pode ser modificado

### Visão Geral das Nuances

- **All Exports:** Importa **todos** os exports (named e default)
- **Type-only:** `import type * as` para tipos apenas
- **CommonJS:** `import * as` necessário sem `esModuleInterop`
- **Re-exports:** Namespace import pode importar re-exports
- **Dynamic Import:** `import()` retorna namespace object via Promise

## 🧠 Fundamentos Teóricos

### Basic Namespace Import

```typescript
// math.ts - módulo com múltiplos exports
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;

// app.ts - namespace import
import * as math from './math';

console.log(math.add(2, 3));      // 5
console.log(math.subtract(5, 3)); // 2
console.log(math.PI);             // 3.14159

// Namespace object é read-only
// math.PI = 3.14;  // ✗ Error - cannot assign to read-only property
// math.newFunc = () => {};  // ✗ Error - cannot add property
```

**Namespace Object:** Objeto imutável com todos os exports.

### Type Safety

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts
import * as math from './math';

math.add(2, 3);          // ✓ OK
// math.add("2", "3");   // ✗ Error - tipos incorretos
// math.subtract(5, 3);  // ✗ Error - 'subtract' não existe em math
// math.PI;              // ✗ Error - 'PI' não existe em math
```

**Type Safety:** TypeScript valida acesso a propriedades do namespace.

### Autocomplete

```typescript
// utils.ts
export function formatDate() { }
export function formatTime() { }
export function formatDateTime() { }
export const DEFAULT_FORMAT = "YYYY-MM-DD";

// app.ts
import * as utils from './utils';

utils.  // IDE autocomplete mostra:
        // - formatDate
        // - formatTime
        // - formatDateTime
        // - DEFAULT_FORMAT
```

**Autocomplete:** IDE lista todos os exports do namespace.

### Princípios e Conceitos Subjacentes

#### Namespace vs Named Imports

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}
export function subtract(a: number, b: number): number {
  return a - b;
}

// Named imports - múltiplos nomes no escopo
import { add, subtract } from './math';
console.log(add(2, 3));

// Namespace import - único nome no escopo
import * as math from './math';
console.log(math.add(2, 3));

// Vantagens namespace:
// - Menos namespace pollution
// - Origem clara (math.add vs add)
// - Sem name conflicts

// Vantagens named:
// - Mais conciso (add vs math.add)
// - Tree-shaking mais eficiente
```

**Comparison:** Namespace import vs named imports.

#### Combining with Named Imports

```typescript
// Combinar namespace import com named imports

// utils.ts
export function helper() { }
export function formatter() { }
export function validator() { }

// app.ts - namespace import
import * as utils from './utils';

// Também pode extrair alguns exports
import { helper } from './utils';

console.log(utils.formatter());  // Acessa via namespace
console.log(helper());            // Acessa diretamente

// Ou ambos na mesma linha
import * as utils2, { helper as help } from './utils';
```

**Combining:** Pode combinar namespace e named imports.

### Type-only Namespace Import

```typescript
// types.ts
export interface User {
  name: string;
  age: number;
}

export type UserId = string;

export interface Product {
  id: number;
  name: string;
}

// app.ts - type-only namespace import
import type * as Types from './types';

const user: Types.User = { name: "John", age: 30 };
const id: Types.UserId = "user_123";
const product: Types.Product = { id: 1, name: "Laptop" };

// Types só existe em compile-time
// const value = Types.User;  // ✗ Error - não existe em runtime
```

**Type-only:** `import type * as` importa apenas tipos.

#### CommonJS Interop

```typescript
// Importar módulos CommonJS com namespace import

// lodash é CommonJS
// node_modules/lodash/index.js
module.exports = { ... };

// Sem esModuleInterop - namespace import necessário
import * as _ from 'lodash';
console.log(_.map([1, 2, 3], x => x * 2));

// Com esModuleInterop - permite default import
import _ from 'lodash';
console.log(_.map([1, 2, 3], x => x * 2));

// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

**CommonJS:** Namespace import útil para módulos CommonJS.

### Default and Named Exports

```typescript
// Namespace import inclui default export

// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

export function helper() { }

// app.ts - namespace import
import * as calc from './calculator';

const calculator = new calc.default();  // Default export como 'default'
console.log(calculator.add(2, 3));      // 5
console.log(calc.helper());

// Ou combinar default e namespace
import Calculator, * as calcUtils from './calculator';
const calc2 = new Calculator();
console.log(calcUtils.helper());
```

**Default:** Default export acessado como `namespace.default`.

#### Re-exports

```typescript
// Namespace import com re-exports

// math/add.ts
export function add(a: number, b: number) { return a + b; }

// math/subtract.ts
export function subtract(a: number, b: number) { return a - b; }

// math/index.ts - re-exports
export * from './add';
export * from './subtract';

// app.ts - namespace import de barrel
import * as math from './math';

console.log(math.add(2, 3));      // ✓ OK - re-export incluído
console.log(math.subtract(5, 3)); // ✓ OK - re-export incluído
```

**Re-exports:** Namespace import inclui re-exports.

### Dynamic Namespace Import

```typescript
// Dynamic import retorna namespace object via Promise

// math.ts
export function add(a: number, b: number) { return a + b; }
export function subtract(a: number, b: number) { return a - b; }

// app.ts - dynamic import
async function loadMath() {
  const math = await import('./math');
  console.log(math.add(2, 3));      // 5
  console.log(math.subtract(5, 3)); // 2
}

// Ou com .then()
import('./math').then(math => {
  console.log(math.add(2, 3));
});

// Conditional import
if (condition) {
  const advanced = await import('./advanced');
  console.log(advanced.complexFunction());
}
```

**Dynamic:** `import()` retorna namespace object via Promise.

#### Immutability

```typescript
// Namespace object é imutável

import * as math from './math';

// ✗ Todas essas operações falham
// math.add = () => {};         // Error - cannot assign
// math.newFunc = () => {};     // Error - cannot add property
// delete math.add;             // Error - cannot delete
// Object.assign(math, {...});  // Error - cannot modify

// Namespace object é sealed e frozen
console.log(Object.isSealed(math));  // true
console.log(Object.isFrozen(math));  // true
```

**Immutability:** Namespace object é read-only, sealed, frozen.

### Modelo Mental para Compreensão

Pense em namespace import como **caixa de ferramentas**:

**Named import:** Pegar ferramentas individuais da caixa
**Namespace import:** Carregar caixa inteira com todas as ferramentas

**Analogia - Restaurant:**

**Named import:** Pedir pratos específicos do menu
**Namespace import:** Pedir menu degustação completo

**Metáfora - Library:**

**Named import:** Pegar livros específicos da estante
**Namespace import:** Pegar estante inteira

**Fluxo de namespace import:**
```
1. import * as math from './math'
2. TypeScript analisa exports de math.ts
3. Cria namespace object com todos exports
4. Namespace object é imutável (sealed, frozen)
5. Acesso: math.export
6. TypeScript valida propriedade existe
```

**Exemplo visual:**
```
math.ts
┌─────────────────┐
│ export add      │
│ export subtract │
│ export PI       │
└─────────────────┘
        ↓
import * as math
        ↓
math object
┌─────────────────┐
│ add: function   │
│ subtract: fn    │
│ PI: 3.14159     │
└─────────────────┘
```

## 🔍 Análise Conceitual Profunda

### Tree-shaking with Namespace Imports

```typescript
// Namespace import pode limitar tree-shaking

// utils.ts
export function add(a: number, b: number) { return a + b; }
export function subtract(a: number, b: number) { return a - b; }
export function multiply(a: number, b: number) { return a * b; }

// app.ts - namespace import
import * as utils from './utils';
console.log(utils.add(2, 3));
// multiply não usado

// Bundler pode ou não tree-shake multiply
// Depende do bundler e configuração

// Named import permite tree-shaking melhor
import { add } from './utils';
console.log(add(2, 3));
// Bundler definitivamente remove subtract e multiply ✅
```

**Tree-shaking:** Named imports tree-shake melhor que namespace imports.

#### Namespace Object Structure

```typescript
// Estrutura do namespace object

import * as math from './math';

// Namespace object é exotic object com:
// - Todas as propriedades são read-only
// - Object é sealed (não pode adicionar/remover)
// - Object é frozen (imutável)
// - Propriedades são non-configurable

const descriptor = Object.getOwnPropertyDescriptor(math, 'add');
console.log(descriptor);
// {
//   value: [Function: add],
//   writable: false,
//   enumerable: true,
//   configurable: false
// }
```

**Structure:** Namespace object é exotic object especial.

### Performance Considerations

```typescript
// Namespace import vs named imports - performance

// Namespace import carrega todo módulo
import * as utils from './utils';  // Carrega tudo

// Named import pode lazy-load (bundler-dependent)
import { add } from './utils';  // Pode carregar apenas add

// Em aplicações grandes, considere:
// - Named imports para tree-shaking
// - Namespace import para organização
// - Code splitting para lazy loading
```

**Performance:** Named imports podem ser mais eficientes.

#### Use Cases

```typescript
// Quando usar namespace import

// 1. Muitos exports do mesmo módulo
import * as lodash from 'lodash';
lodash.map(...);
lodash.filter(...);
lodash.reduce(...);

// 2. Evitar name conflicts
import * as dateUtils from './date';
import * as stringUtils from './string';
dateUtils.format();
stringUtils.format();

// 3. Clareza de origem
import * as api from './api';
api.fetchUser();  // Claro que vem de './api'

// 4. CommonJS modules sem esModuleInterop
import * as express from 'express';

// Quando usar named imports

// 1. Poucos exports
import { add } from './math';

// 2. Tree-shaking crítico
import { Component } from 'react';

// 3. Código mais conciso
import { useState } from 'react';  // vs React.useState
```

**Use Cases:** Namespace import vs named imports.

### Namespace Aliasing

```typescript
// Renomear namespace

import * as mathUtils from './math';
// Usa mathUtils.add()

// Ou alias mais curto
import * as m from './math';
// Usa m.add()

// Convenção: nomes descritivos para clareza
import * as userApi from './userApi';
import * as userValidation from './userValidation';
```

**Aliasing:** Escolher nomes descritivos para namespaces.

#### Combining Multiple Namespaces

```typescript
// Combinar múltiplos namespaces

import * as userApi from './user/api';
import * as userValidation from './user/validation';
import * as productApi from './product/api';

async function createUser(data: any) {
  if (!userValidation.validateEmail(data.email)) {
    throw new Error("Invalid email");
  }
  
  const user = await userApi.createUser(data);
  const products = await productApi.fetchProducts();
  
  return { user, products };
}

// Organização clara - origem de cada função óbvia
```

**Multiple:** Combinar múltiplos namespaces para organização.

## 🎯 Aplicabilidade e Contextos

### Library Usage

```typescript
import * as _ from 'lodash';
import * as React from 'react';
```

**Raciocínio:** Bibliotecas com muitos exports.

### API Modules

```typescript
import * as userApi from './api/user';
import * as productApi from './api/product';
```

**Raciocínio:** Organizar APIs por domínio.

### Utility Modules

```typescript
import * as dateUtils from './utils/date';
import * as stringUtils from './utils/string';
```

**Raciocínio:** Evitar conflicts entre utilities.

### Type Definitions

```typescript
import type * as Types from './types';
```

**Raciocínio:** Agrupar tipos relacionados.

## ⚠️ Limitações e Considerações Teóricas

### Tree-shaking

```typescript
// Namespace import pode limitar tree-shaking
// Bundler pode incluir todo módulo
```

**Limitação:** Menos eficiente para tree-shaking.

### Verbosity

```typescript
// Namespace import mais verboso
math.add(2, 3)  // vs add(2, 3)
```

**Consideração:** Código mais verboso.

### Default Export Access

```typescript
// Default export como 'default' property
import * as calc from './calculator';
new calc.default();  // Awkward
```

**Limitação:** Acesso a default export menos ergonômico.

## 🔗 Interconexões Conceituais

**Relação com Named Imports:** Alternativa a named imports.

**Relação com Default Imports:** Namespace inclui default como `.default`.

**Relação com Re-exports:** Namespace importa re-exports.

**Relação com Tree-shaking:** Named imports tree-shake melhor.

**Relação com CommonJS:** Útil para módulos CommonJS.

## 🚀 Evolução e Próximos Conceitos

Dominar namespace import prepara para:
- **Named Imports:** `import { }` detalhado
- **Default Imports:** `import default from`
- **Named Exports:** Variantes de export
- **Re-exports:** Barrel pattern
- **Dynamic Imports:** `import()` lazy loading
