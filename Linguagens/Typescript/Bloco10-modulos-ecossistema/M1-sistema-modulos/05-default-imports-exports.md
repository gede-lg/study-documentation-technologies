# Default Imports e Exports

## 🎯 Introdução e Definição

### Definição Conceitual

**Default export** (`export default`) é syntax ES6 que **designa export principal de módulo**, enquanto **default import** (`import name from 'module'`) importa este export sem chaves. Diferentemente de named exports que exportam múltiplos elementos com nomes específicos, default export define **single primary export** - elemento considerado **principal ou mais importante** do módulo.

Conceitualmente, default export implementa **primary export pattern** - módulo tem um export principal e possivelmente múltiplos exports secundários (named exports). Default import utiliza **simplified syntax** - importar default sem chaves `import X` ao invés de `import { X }`. Importador pode **escolher qualquer nome** para default import, diferentemente de named imports que devem usar nome exato ou renomear explicitamente.

**Fundamento teórico:** Default export deriva de **main export convention** - convenção de que módulo deve ter export principal óbvio. CommonJS usa `module.exports` para export único, ES6 generaliza com `export default` permitindo também named exports. Default import cria **binding to default export** sob nome escolhido pelo importador. TypeScript valida que default export existe mas não valida nome usado no import.

**Pattern básico:**
```typescript
// calculator.ts - default export de classe
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// app.ts - default import
import Calculator from './calculator';
// Pode usar qualquer nome
import Calc from './calculator';
import MyCalculator from './calculator';

const calc = new Calculator();
console.log(calc.add(2, 3));  // 5
```

**Diferença fundamental:**
- **Named export:** `export function add()` → `import { add }`
- **Default export:** `export default class Calc` → `import Calc` (qualquer nome)

### Contexto Histórico e Evolução

**ECMAScript 2015 (ES6) (2015):** Introdução de default export/import.

```javascript
// ES6 (2015) - default export
// calculator.js
export default class Calculator {
  add(a, b) {
    return a + b;
  }
}

// app.js
import Calculator from './calculator.js';
const calc = new Calculator();
```

**Motivação inicial:** Simplificar imports de módulos com export único.

**CommonJS (pré-ES6):**
```javascript
// CommonJS - module.exports
// calculator.js
module.exports = class Calculator {
  add(a, b) {
    return a + b;
  }
};

// app.js
const Calculator = require('./calculator');
const calc = new Calculator();
```

**ES6 generalizou:** `export default` equivale a `module.exports`.

**TypeScript 1.5 (2015):** Suporte a default export/import.

```typescript
// TypeScript 1.5 - default export
// calculator.ts
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// app.ts
import Calculator from './calculator';
const calc = new Calculator();
console.log(calc.add(2, 3));
```

**TypeScript 2.0 (2016):** `esModuleInterop` para CommonJS.

```typescript
// TypeScript 2.0 - esModuleInterop
// Sem esModuleInterop
import * as express from 'express';  // CommonJS

// Com esModuleInterop
import express from 'express';  // Permite default import ✅

// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

**TypeScript 2.7 (2018):** Default export em declaration files.

```typescript
// TypeScript 2.7 - .d.ts
// calculator.d.ts
export default class Calculator {
  add(a: number, b: number): number;
}
```

**TypeScript 3.8 (2020):** Default com type-only exports.

```typescript
// TypeScript 3.8
export type { User as default } from './types';
```

**Babel (2015+):** Transpilação de default exports para CommonJS.

```javascript
// ES6 default export
export default class Calculator { }

// Babel transpila para CommonJS
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Calculator;
```

**Antes vs Depois:**

**Pré-ES6 (CommonJS):**
```javascript
// module.exports - export único
module.exports = class Calculator { };

// require - importar
const Calculator = require('./calculator');
```

**Pós-ES6 (default export):**
```typescript
// export default - export principal
export default class Calculator { }

// import - importar default
import Calculator from './calculator';
```

**Evolução TypeScript:**

**TypeScript inicial:**
```typescript
// Default export básico
export default class Calculator { }
```

**TypeScript moderno:**
```typescript
// Default com named exports
export default class Calculator { }
export function helper() { }

// esModuleInterop
import express from 'express';  // CommonJS
```

### Problema Fundamental que Resolve

Default export/import resolvem problemas de **import simplification**, **module primary export**, e **CommonJS compatibility**.

**Problema 1: Import syntax verboso para módulos com export único**
```typescript
// Sem default - named export necessário ❌
// calculator.ts
export class Calculator {
  add(a: number, b: number) { return a + b; }
}

// app.ts - precisa chaves
import { Calculator } from './calculator';
// Verboso para módulo com export único
```

**Solução: Default export simplifica syntax**
```typescript
// Com default - syntax simplificada ✅
// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

// app.ts - sem chaves
import Calculator from './calculator';
// Mais limpo e intuitivo ✅
```

**Problema 2: Nome fixo com named exports**
```typescript
// Named export - nome fixo ❌
// calculator.ts
export class Calculator { }

// app.ts - precisa usar 'Calculator' ou renomear explicitamente
import { Calculator } from './calculator';
import { Calculator as Calc } from './calculator';
```

**Solução: Default import permite qualquer nome**
```typescript
// Default export - nome livre ✅
// calculator.ts
export default class Calculator { }

// app.ts - qualquer nome
import Calculator from './calculator';
import Calc from './calculator';
import MyCalc from './calculator';
// Flexibilidade total ✅
```

**Problema 3: CommonJS interop complicado**
```typescript
// CommonJS sem esModuleInterop ❌
// express usa module.exports
const express = require('express');

// TypeScript sem esModuleInterop
import * as express from 'express';  // Verboso
```

**Solução: Default import com esModuleInterop**
```typescript
// Com esModuleInterop - default import ✅
import express from 'express';  // Limpo como CommonJS

// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

**Problema 4: Módulo sem export principal óbvio**
```typescript
// Múltiplos named exports - qual é principal? ❌
export function add() { }
export function subtract() { }
export function multiply() { }

// Importador não sabe qual é mais importante
import { add, subtract, multiply } from './math';
```

**Solução: Default export designa principal**
```typescript
// Default export indica principal ✅
export default function add() { }  // Principal
export function subtract() { }     // Secundário
export function multiply() { }     // Secundário

// Importador sabe qual é principal
import add from './math';  // Principal
import { subtract, multiply } from './math';  // Secundários
```

**Fundamento teórico:** Default export estabelece **primary export convention** - módulo comunica qual export é principal.

### Importância no Ecossistema

Default export/import são importantes porque:

- **Simplicity:** Import syntax mais simples sem chaves
- **Flexibility:** Importador escolhe nome livremente
- **Primary Export:** Designa export principal do módulo
- **CommonJS Interop:** Facilita integração com CommonJS
- **Convention:** Convenção estabelecida no ecossistema
- **Clarity:** Indica export mais importante do módulo
- **Component Pattern:** React components usam default export
- **Single Responsibility:** Módulo com responsabilidade única

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Primary Export:** Default export designa export principal
2. **Simplified Syntax:** Import sem chaves `import X from`
3. **Free Naming:** Importador escolhe nome livremente
4. **Single Default:** Apenas um default export por módulo
5. **Mixed Exports:** Pode combinar default e named exports

### Pilares Fundamentais

- **Export:** `export default value`
- **Import:** `import name from 'module'`
- **Inline:** `export default class X { }`
- **Separate:** `const X = ...; export default X;`
- **Mixed:** `export default X; export { Y, Z };`

### Visão Geral das Nuances

- **One Per Module:** Apenas um default export por módulo
- **Any Name:** Default import pode usar qualquer nome
- **Type Inference:** TypeScript infere tipo do default export
- **esModuleInterop:** Permite default import de CommonJS
- **Namespace Access:** Default export acessado como `.default`

## 🧠 Fundamentos Teóricos

### Basic Default Export

```typescript
// calculator.ts - default export de classe
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// app.ts - default import
import Calculator from './calculator';

const calc = new Calculator();
console.log(calc.add(2, 3));  // 5
```

**Default export:** Export principal do módulo.

### Default Export Variants

```typescript
// 1. Classe
export default class Calculator { }

// 2. Função
export default function add(a: number, b: number) {
  return a + b;
}

// 3. Arrow function
const add = (a: number, b: number) => a + b;
export default add;

// 4. Objeto
export default {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b
};

// 5. Constante
const API_CONFIG = { url: "https://api.com" };
export default API_CONFIG;

// 6. Anonymous
export default function(a: number, b: number) {
  return a + b;
}
```

**Variants:** Diferentes tipos de default exports.

### Free Naming

```typescript
// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

// app.ts - qualquer nome
import Calculator from './calculator';
import Calc from './calculator';
import MyCalculator from './calculator';
import C from './calculator';

// Todos são válidos e referenciam mesma classe ✅
const calc1 = new Calculator();
const calc2 = new Calc();
const calc3 = new MyCalculator();
```

**Free Naming:** Importador escolhe nome livremente.

### Princípios e Conceitos Subjacentes

#### One Default Per Module

```typescript
// Apenas um default export por módulo

// ✓ Válido
export default class Calculator { }

// ✗ Inválido - múltiplos defaults
export default class Calculator { }
export default function helper() { }  // ✗ Error - já tem default

// Pode ter múltiplos named exports
export default class Calculator { }
export function helper() { }  // ✓ OK - named export
export const PI = 3.14;       // ✓ OK - named export
```

**One Default:** Apenas um default export por módulo.

#### Combining Default and Named

```typescript
// Combinar default e named exports

// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

export function helper() {
  return "helper";
}

export const PI = 3.14159;

// app.ts - importar ambos
import Calculator from './calculator';           // Default
import { helper, PI } from './calculator';       // Named

// Ou na mesma linha
import Calculator, { helper, PI } from './calculator';

const calc = new Calculator();
console.log(calc.add(2, 3));
console.log(helper());
console.log(PI);
```

**Mixed:** Combinar default e named exports.

### Type Safety

```typescript
// calculator.ts
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// app.ts
import Calculator from './calculator';

const calc = new Calculator();
calc.add(2, 3);          // ✓ OK
// calc.add("2", "3");   // ✗ Error - tipos incorretos
// calc.subtract(5, 3);  // ✗ Error - método não existe

// TypeScript infere tipo do default export ✅
```

**Type Safety:** TypeScript valida tipo do default export.

#### Inline vs Separate

```typescript
// Inline default export
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

// Separate default export
class Calculator {
  add(a: number, b: number) { return a + b; }
}
export default Calculator;

// Ambos equivalentes
// Inline mais conciso, separate permite usar classe localmente
```

**Inline vs Separate:** Duas formas de default export.

### Anonymous Default Export

```typescript
// Default export anônimo (sem nome)

// Função anônima
export default function(a: number, b: number) {
  return a + b;
}

// Classe anônima
export default class {
  add(a: number, b: number) { return a + b; }
}

// app.ts - importador fornece nome
import add from './math';
import Calculator from './calculator';

console.log(add(2, 3));
const calc = new Calculator();
```

**Anonymous:** Default export pode ser anônimo.

#### Default with Namespace Import

```typescript
// Default export com namespace import

// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

export function helper() {
  return "helper";
}

// app.ts - namespace import
import * as calc from './calculator';

const calculator = new calc.default();  // Default como '.default'
console.log(calculator.add(2, 3));
console.log(calc.helper());

// Default export acessado como 'default' property
```

**Namespace:** Default export como `.default` em namespace import.

### esModuleInterop

```typescript
// CommonJS interop com esModuleInterop

// express.js (CommonJS)
module.exports = function express() { ... };

// Sem esModuleInterop - namespace import necessário
import * as express from 'express';
const app = express();

// Com esModuleInterop - default import funciona ✅
import express from 'express';
const app = express();

// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**esModuleInterop:** Permite default import de CommonJS.

#### Type-only Default

```typescript
// Default export de tipos

// types.ts
interface User {
  name: string;
  age: number;
}

export default User;

// app.ts - import type
import type User from './types';

const user: User = { name: "John", age: 30 };

// User só existe em compile-time
```

**Type-only:** Default export de tipos.

### Re-exporting Default

```typescript
// Re-export de default export

// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

// index.ts - re-export default
export { default as Calculator } from './calculator';

// Ou re-export como default
export { default } from './calculator';

// app.ts
import { Calculator } from './index';  // Named
// ou
import Calculator from './index';       // Default
```

**Re-export:** Re-exportar default exports.

#### Dynamic Default Import

```typescript
// Dynamic import de default export

// calculator.ts
export default class Calculator {
  add(a: number, b: number) { return a + b; }
}

// app.ts - dynamic import
async function loadCalculator() {
  const { default: Calculator } = await import('./calculator');
  const calc = new Calculator();
  console.log(calc.add(2, 3));
}

// Ou mais simples
async function load() {
  const Calculator = (await import('./calculator')).default;
  const calc = new Calculator();
}
```

**Dynamic:** Dynamic import de default export.

### Modelo Mental para Compreensão

Pense em default export como **main entrance of building**:

**Default export:** Entrada principal óbvia
**Named exports:** Entradas secundárias específicas

**Analogia - Restaurant:**

**Default export:** Prato principal do menu
**Named exports:** Acompanhamentos e bebidas

**Metáfora - Book:**

**Default export:** História principal do livro
**Named exports:** Apêndices e notas

**Fluxo de default export:**
```
1. export default Calculator
2. TypeScript registra default export
3. Valida apenas um default por módulo
4. Import pode usar qualquer nome
5. TypeScript infere tipo do default
```

**Exemplo visual:**
```
calculator.ts
┌────────────────────┐
│ export default     │ ← Principal
│   class Calc       │
│                    │
│ export helper()    │ ← Secundário
│ export const PI    │ ← Secundário
└────────────────────┘
        ↓
import Calculator
        ↓
Calculator = Calc
(qualquer nome escolhido)
```

## 🔍 Análise Conceitual Profunda

### React Component Pattern

```typescript
// React components usam default export

// Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// Ou classe component
export default class Button extends React.Component<ButtonProps> {
  render() {
    return <button onClick={this.props.onClick}>{this.props.label}</button>;
  }
}

// App.tsx
import Button from './Button';

function App() {
  return <Button label="Click me" onClick={() => {}} />;
}
```

**React Pattern:** Default export convenção para components.

#### Library Entry Point

```typescript
// Default export como entry point de biblioteca

// mylib/index.ts
import Calculator from './calculator';
import * as utils from './utils';

// Default export como API principal
export default Calculator;

// Named exports como utilities
export { utils };

// app.ts
import Calculator from 'mylib';       // Principal
import { utils } from 'mylib';        // Utilities
```

**Entry Point:** Default export como API principal.

### Default vs Named Trade-offs

```typescript
// Default export
// ✅ Pros:
// - Syntax simples sem chaves
// - Importador escolhe nome
// - Indica export principal
// - CommonJS interop

// ❌ Cons:
// - Apenas um por módulo
// - Nome pode variar entre arquivos
// - Refactoring mais difícil
// - IDE autocomplete menos preciso

// Named export
// ✅ Pros:
// - Múltiplos exports
// - Nomes consistentes
// - Refactoring fácil (rename)
// - IDE autocomplete preciso
// - Tree-shaking melhor

// ❌ Cons:
// - Syntax mais verbosa
// - Precisa renomear explicitamente
```

**Trade-offs:** Default vs named exports.

#### ESLint Rules

```typescript
// ESLint rules para default exports

// .eslintrc
{
  "rules": {
    // Força named exports
    "import/no-default-export": "error",
    
    // Ou força default exports
    "import/prefer-default-export": "error",
    
    // Aviso sobre anonymous defaults
    "import/no-anonymous-default-export": "warn"
  }
}

// Projetos diferentes usam convenções diferentes
// React: default exports
// Angular: named exports
// Vue: ambos
```

**ESLint:** Regras para default exports.

### TypeScript Inference

```typescript
// TypeScript infere tipo do default export

// calculator.ts
export default class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// app.ts
import Calculator from './calculator';

// TypeScript infere:
// Calculator: typeof Calculator (class constructor)

const calc: Calculator = new Calculator();
// calc: Calculator (instance type)

// Hover sobre 'Calculator' mostra tipo inferido
```

**Inference:** TypeScript infere tipos de default exports.

#### Barrel File Pattern

```typescript
// Barrel file com default exports

// components/Button.tsx
export default function Button() { }

// components/Input.tsx
export default function Input() { }

// components/index.ts - barrel
export { default as Button } from './Button';
export { default as Input } from './Input';

// app.ts - import de barrel
import { Button, Input } from './components';

// Converte default exports em named exports
```

**Barrel:** Re-export defaults como named.

### Naming Inconsistency

```typescript
// Default import permite nomes inconsistentes

// calculator.ts
export default class Calculator { }

// app1.ts
import Calculator from './calculator';

// app2.ts
import Calc from './calculator';

// app3.ts
import C from './calculator';

// ❌ Problema: 3 nomes diferentes para mesma classe
// Dificulta busca no código
// Named exports evitam isso
```

**Inconsistency:** Default imports podem ter nomes inconsistentes.

#### Default Export Object Pattern

```typescript
// Default export de objeto com métodos

// api.ts
export default {
  fetchUser: async (id: string) => { ... },
  createUser: async (data: any) => { ... },
  deleteUser: async (id: string) => { ... }
};

// app.ts
import api from './api';

api.fetchUser("123");
api.createUser({ name: "John" });

// Ou com destructuring
import api from './api';
const { fetchUser, createUser } = api;
```

**Object Pattern:** Default export de objeto.

### Transpilation

```typescript
// Default export transpilado para CommonJS

// ES6 - calculator.ts
export default class Calculator { }

// Transpiled to CommonJS
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Calculator { }
exports.default = Calculator;

// __esModule marca como ES module transpilado
```

**Transpilation:** Default export para CommonJS.

## 🎯 Aplicabilidade e Contextos

### React Components

```typescript
export default function Button() { }
```

**Raciocínio:** Convenção React para components.

### Library Entry Points

```typescript
export default class MainAPI { }
```

**Raciocínio:** API principal da biblioteca.

### Configuration Objects

```typescript
export default { apiUrl: "...", timeout: 5000 };
```

**Raciocínio:** Config como export único.

### Utility Functions

```typescript
export default function debounce() { }
```

**Raciocínio:** Função principal do módulo.

## ⚠️ Limitações e Considerações Teóricas

### One Per Module

```typescript
// Apenas um default export por módulo
export default class A { }
// export default class B { }  // ✗ Error
```

**Limitação:** Apenas um default por módulo.

### Naming Inconsistency

```typescript
// Default imports podem ter nomes diferentes
import Calc from './calculator';
import Calculator from './calculator';
// Dificulta busca e manutenção
```

**Consideração:** Nomes podem variar.

### Refactoring

```typescript
// Renomear default export não atualiza imports
// Precisa buscar e substituir manualmente
```

**Limitação:** Refactoring menos automático.

### Tree-shaking

```typescript
// Default exports podem limitar tree-shaking
export default { a, b, c };
// Bundler pode incluir tudo
```

**Consideração:** Named exports tree-shake melhor.

## 🔗 Interconexões Conceituais

**Relação com Named Exports:** Complementam-se, podem coexistir.

**Relação com CommonJS:** `export default` equivale a `module.exports`.

**Relação com esModuleInterop:** Permite default import de CommonJS.

**Relação com Re-exports:** Pode re-exportar defaults.

**Relação com Dynamic Imports:** `import().default` acessa default.

## 🚀 Evolução e Próximos Conceitos

Dominar default exports prepara para:
- **Named Exports:** Variantes de export
- **Re-exports:** Barrel pattern
- **Dynamic Imports:** `import()` lazy loading
- **Module Resolution:** Como TypeScript resolve módulos
- **Tree-shaking:** Otimização de bundle
