# Const - Reatribuição Bloqueada

## 🎯 Introdução e Definição

### Definição Conceitual

**`const`** é uma keyword de declaração de variável em TypeScript/JavaScript que **bloqueia reatribuição** - uma vez que um valor é atribuído a uma variável `const`, a **binding** entre nome e valor não pode ser alterada. `const` cria uma **immutable binding** (ligação imutável), não um **immutable value** (valor imutável) - o valor em si (se for objeto/array) pode ser modificado, mas a variável não pode apontar para outro valor.

Conceitualmente, `const` estabelece **reference immutability** - a referência (binding) é constante, mas o conteúdo referenciado (se mutável) pode mudar. Para **primitivos** (number, string, boolean), `const` garante imutabilidade completa pois primitivos são immutable. Para **objetos/arrays**, `const` garante que a variável sempre aponta para o **mesmo objeto**, mas properties/elements do objeto podem ser modificados.

**Fundamento teórico:** `const` implementa **single assignment** - variável é atribuída exatamente uma vez, no momento da declaração. Diferentemente de `let` (permite reatribuição) e `var` (permite reatribuição e hoisting), `const` força **declaração com inicialização** - não pode declarar `const` sem valor inicial.

**Imutabilidade de binding** vs **imutabilidade de valor**:
- **Binding immutable:** Variável não pode ser reatribuída (const)
- **Value immutable:** Valor não pode ser modificado (readonly, Object.freeze)

### Contexto Histórico e Evolução

**JavaScript ES5 (2009):** Apenas `var` - sem const, sem imutabilidade de binding.

**JavaScript ES6/ES2015 (Junho 2015):** **Introdução de `const` e `let`**.

**Motivação para const:**
- Prevenir reatribuição acidental
- Documentar intenção (valor não deve mudar)
- Scope de bloco (block-scoped) vs function-scoped (var)
- Immutability patterns em functional programming

**ES6 const:**
```javascript
// ES6 - const introduzido
const PI = 3.14159;
PI = 3.14;  // ❌ TypeError: Assignment to constant variable

// ES5 - apenas var (mutável)
var PI = 3.14159;
PI = 3.14;  // ✅ Permitido - sem proteção
```

**TypeScript 1.0 (2012):** Suportava apenas `var` (antes do ES6).

**TypeScript 1.4 (Janeiro 2015):** **Suporte a `let` e `const`** - antes mesmo do ES6 ser finalizado.

**TypeScript 1.5 (Julho 2015):** Melhorias em const - inferência de tipo literal.

**TypeScript 2.0 (Setembro 2016):** **Readonly modifier** para properties - complementa const.

**TypeScript 3.4 (Março 2019):** **`const` assertions** (`as const`) - imutabilidade profunda.

**Evolução de práticas:**

**Era Var (antes ES6):**
```javascript
var value = 10;  // Pode ser reatribuído
value = 20;      // ✅ Permitido
```

**Era Let/Const (ES6+):**
```javascript
let mutable = 10;   // Pode ser reatribuído
mutable = 20;       // ✅ Permitido

const immutable = 10;  // NÃO pode ser reatribuído
immutable = 20;        // ❌ Error
```

**Era TypeScript Readonly (2.0+):**
```typescript
const obj = { x: 10 };  // Binding immutable
obj.x = 20;             // ✅ Property mutável

const obj2: { readonly x: number } = { x: 10 };
obj2.x = 20;  // ❌ Error - property readonly
```

**Era Const Assertions (3.4+):**
```typescript
const config = { port: 3000 } as const;
config.port = 8080;  // ❌ Error - readonly profundo
```

### Problema Fundamental que Resolve

`const` resolve o problema de **accidental reassignment** e **lack of intent documentation**.

**Problema: Reatribuição acidental com var/let**
```typescript
// Com let - reatribuição acidental
let API_URL = "https://api.example.com";

function setupClient() {
  API_URL = "https://dev.example.com";  // ⚠️ Acidental - modifica global
  // ... resto do código
}

setupClient();
console.log(API_URL);  // "https://dev.example.com" - modificado!
```

**Solução: const previne reatribuição**
```typescript
// Com const - proteção contra reatribuição
const API_URL = "https://api.example.com";

function setupClient() {
  API_URL = "https://dev.example.com";  // ❌ Error - const não pode ser reatribuído
}
```

**Problema: Intent não documentado**
```typescript
// Com let - não fica claro se deve mudar
let MAX_RETRIES = 3;

function retry() {
  MAX_RETRIES = 5;  // ✅ Permitido - mas era intenção?
}
```

**Solução: const documenta intent**
```typescript
// Com const - documenta que não deve mudar
const MAX_RETRIES = 3;

function retry() {
  MAX_RETRIES = 5;  // ❌ Error - intenção clara que é constante
}
```

**Problema: Loop counter reatribuição**
```typescript
// Com var - counter vaza do loop
for (var i = 0; i < 3; i++) {
  console.log(i);
}
console.log(i);  // 3 - vaza!

// Com let - counter é block-scoped
for (let j = 0; j < 3; j++) {
  console.log(j);
}
console.log(j);  // ❌ Error - não existe fora do loop

// Com const - para iteração sem modificação
const items = [1, 2, 3];
for (const item of items) {  // Nova binding a cada iteração
  console.log(item);
}
```

**Fundamento teórico:** `const` implementa **principle of least privilege** - variável só tem mutabilidade se necessário.

### Importância no Ecossistema

`const` é crucial porque:

- **Prevent Bugs:** Evita reatribuição acidental
- **Intent Documentation:** Documenta que valor não deve mudar
- **Refactoring Safety:** Renomear/mover const detecta usos
- **Block Scope:** Evita vazamento de escopo (var)
- **Temporal Dead Zone:** Previne uso antes de declaração
- **Functional Programming:** Base para imutabilidade
- **Code Review:** Sinaliza valores constantes
- **Compiler Optimizations:** Permite otimizações

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Immutable Binding:** Binding não pode ser alterado
2. **Single Assignment:** Atribuição única na declaração
3. **Block Scope:** Escopo de bloco (não function)
4. **Temporal Dead Zone:** Não acessível antes de declaração
5. **Reference Immutability:** Referência constante, não valor

### Pilares Fundamentais

- **No Reassignment:** Variável não pode ser reatribuída
- **Must Initialize:** Deve ser inicializada na declaração
- **Block-Scoped:** Escopo limitado ao bloco
- **TDZ Protection:** Temporal dead zone previne hoisting
- **Type Inference:** TypeScript infere tipo literal

### Visão Geral das Nuances

- **Const for Primitives:** Imutabilidade completa
- **Const for Objects:** Binding immutable, conteúdo mutável
- **Const for Arrays:** Referência constante, elements mutáveis
- **Const in Loops:** Nova binding a cada iteração
- **Const Assertions:** `as const` para readonly profundo

## 🧠 Fundamentos Teóricos

### Basic Const Declaration

```typescript
// Primitivos - imutabilidade completa
const name: string = "Alice";
name = "Bob";  // ❌ Error: Cannot assign to 'name' because it is a constant

const age: number = 30;
age = 31;  // ❌ Error: Cannot assign to 'age' because it is a constant

const active: boolean = true;
active = false;  // ❌ Error: Cannot assign to 'active' because it is a constant

// Deve ser inicializada
const value: number;  // ❌ Error: 'const' declarations must be initialized
```

**Análise profunda:**

**Const com primitivos:**
- **Binding** é imutável (não pode reatribuir)
- **Valor** é imutável (primitivos são immutable)
- Resultado: **imutabilidade total**

**Type inference:**
```typescript
const num = 42;  // Type: 42 (literal type)
const str = "hello";  // Type: "hello" (literal type)
const bool = true;  // Type: true (literal type)

let num2 = 42;  // Type: number (widened)
let str2 = "hello";  // Type: string (widened)
```

**Fundamento teórico:** TypeScript infere **literal types** para `const` - valor específico, não tipo amplo.

### Const with Objects - Mutable Content

```typescript
// Object - binding immutable, properties mutáveis
const user = {
  name: "Alice",
  age: 30
};

// ✅ Modificar properties - permitido
user.name = "Bob";
user.age = 31;
console.log(user);  // { name: "Bob", age: 31 }

// ❌ Reatribuir variável - não permitido
user = { name: "Charlie", age: 25 };  // ❌ Error: Cannot assign to 'user'

// ✅ Adicionar/deletar properties - permitido
user.email = "alice@example.com";
delete user.age;
```

**Conceito fundamental:** `const` protege **binding**, não **object content**.

**Análise profunda:**

**O que const protege:**
```typescript
const obj = { x: 10 };
obj = { x: 20 };  // ❌ Blocked - reatribuição
```

**O que const NÃO protege:**
```typescript
const obj = { x: 10 };
obj.x = 20;  // ✅ Permitido - modificação de property
```

### Princípios e Conceitos Subjacentes

#### Const with Arrays - Mutable Elements

```typescript
// Array - binding immutable, elements mutáveis
const numbers = [1, 2, 3];

// ✅ Modificar elements - permitido
numbers[0] = 10;
numbers.push(4);
numbers.pop();
console.log(numbers);  // [10, 2, 3]

// ❌ Reatribuir array - não permitido
numbers = [5, 6, 7];  // ❌ Error: Cannot assign to 'numbers'

// ✅ Métodos que modificam - permitidos
numbers.sort();
numbers.reverse();
numbers.splice(1, 1);
```

**Fundamento teórico:** `const` garante que variável sempre aponta para **mesmo array**, mas array pode ser modificado.

#### Const vs Let vs Var

```typescript
// Var - function-scoped, pode reatribuir
var x = 10;
x = 20;  // ✅ Permitido
{
  var x = 30;  // ⚠️ Mesma variável - sobrescreve
}
console.log(x);  // 30

// Let - block-scoped, pode reatribuir
let y = 10;
y = 20;  // ✅ Permitido
{
  let y = 30;  // ✅ Nova variável - shadow
  console.log(y);  // 30
}
console.log(y);  // 20

// Const - block-scoped, NÃO pode reatribuir
const z = 10;
z = 20;  // ❌ Error
{
  const z = 30;  // ✅ Nova variável - shadow
  console.log(z);  // 30
}
console.log(z);  // 10
```

**Comparação:**

| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Reassignment | ✅ Yes | ✅ Yes | ❌ No |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Redeclaration | ✅ Yes | ❌ No | ❌ No |
| Must Initialize | ❌ No | ❌ No | ✅ Yes |

### Block Scope with Const

```typescript
// Const é block-scoped
if (true) {
  const blockValue = 100;
  console.log(blockValue);  // ✅ Acessível aqui
}
console.log(blockValue);  // ❌ Error: blockValue não existe

// Const em loops
for (let i = 0; i < 3; i++) {
  const loopValue = i * 2;  // Nova binding a cada iteração
  console.log(loopValue);
}
console.log(loopValue);  // ❌ Error: loopValue não existe

// Const em functions
function example() {
  const funcValue = 50;
  console.log(funcValue);  // ✅ Acessível aqui
}
console.log(funcValue);  // ❌ Error: funcValue não existe
```

**Análise profunda:** **Block scope** limita visibilidade de `const` ao bloco `{}` onde é declarada.

### Temporal Dead Zone (TDZ)

```typescript
// Temporal Dead Zone - não pode acessar antes de declaração
console.log(x);  // ❌ Error: Cannot access 'x' before initialization
const x = 10;

// TDZ em if
if (true) {
  console.log(y);  // ❌ Error: Cannot access 'y' before initialization
  const y = 20;
}

// Comparar com var (hoisting)
console.log(z);  // undefined - var tem hoisting
var z = 30;
```

**Fundamento teórico:** **TDZ** (Temporal Dead Zone) - período entre início de scope e declaração onde variável existe mas não pode ser acessada.

### Modelo Mental para Compreensão

Pense em `const` como **contrato permanente**:

**Let:** Relacionamento - pode trocar de parceiro
**Const:** Casamento - parceiro fixo (mas pessoa pode mudar)

**Analogia - Casa:**

**Var:** Endereço flutuante - pode mudar endereço a qualquer momento
**Let:** Endereço atual - pode mudar endereço (mudança)
**Const:** Endereço fixo - não pode mudar endereço (mas pode reformar casa)

**Metáfora - Apontador:**

**Const primitivo:** Apontar para número 42 - número não muda
**Const object:** Apontar para caixa - caixa sempre a mesma, mas conteúdo pode mudar

**Fluxo:**
```
const x = 10
  ↓
x → [10]  (binding fixo)
  ↓
x = 20    ❌ Não pode mudar binding

const obj = { a: 1 }
  ↓
obj → [{ a: 1 }]  (binding fixo)
  ↓
obj.a = 2  ✅ Pode mudar conteúdo
obj → [{ a: 2 }]  (mesmo objeto)
  ↓
obj = {}   ❌ Não pode mudar binding
```

## 🔍 Análise Conceitual Profunda

### Const in Function Parameters

```typescript
// Parameters são implicitamente 'let' - podem ser reatribuídos
function example1(x: number) {
  x = 10;  // ✅ Permitido - parameter é mutável
  console.log(x);
}

// Não pode declarar parameter como const
function example2(const x: number) {  // ❌ Syntax error
  console.log(x);
}

// Workaround - criar const local
function example3(x: number) {
  const value = x;  // Const local - binding immutable
  value = 10;  // ❌ Error: Cannot assign to 'value'
}
```

**Limitação:** Parameters não podem ser `const` - sempre mutáveis (reatribuíveis).

#### Const with Destructuring

```typescript
// Destructuring com const
const user = { name: "Alice", age: 30, city: "NYC" };

const { name, age } = user;  // name e age são const
name = "Bob";  // ❌ Error: Cannot assign to 'name'

// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;

first = 10;  // ❌ Error: Cannot assign to 'first'
rest = [7, 8];  // ❌ Error: Cannot assign to 'rest'
```

**Conceito:** Destructuring com `const` cria **bindings imutáveis** para cada variável extraída.

### Const in Loops

```typescript
// For-of loop - nova binding a cada iteração
const items = ["a", "b", "c"];

for (const item of items) {  // Nova 'item' a cada iteração
  console.log(item);  // ✅ OK
  item = "x";  // ❌ Error: Cannot assign to 'item'
}

// For-in loop - nova binding a cada iteração
const obj = { x: 1, y: 2, z: 3 };

for (const key in obj) {  // Nova 'key' a cada iteração
  console.log(key);  // ✅ OK
  key = "other";  // ❌ Error: Cannot assign to 'key'
}

// Traditional for - NÃO pode usar const para counter
for (const i = 0; i < 3; i++) {  // ❌ Error: Cannot assign to 'i'
  console.log(i);
}
```

**Análise profunda:**

**For-of/for-in:** Nova **const binding** criada a cada iteração
**Traditional for:** Mesma variável reatribuída - precisa `let`

### Const with Type Annotations

```typescript
// Type annotation explícito
const name: string = "Alice";
const age: number = 30;

// Type inference (preferível)
const name2 = "Alice";  // Type: "Alice" (literal)
const age2 = 30;  // Type: 30 (literal)

// Widening - annotation amplia tipo
const value1 = 42;  // Type: 42 (literal)
const value2: number = 42;  // Type: number (widened)

// Const com union types
const status: "active" | "inactive" = "active";
status = "inactive";  // ❌ Error: Cannot assign to 'status'
```

**Fundamento teórico:** `const` sem annotation infere **literal type** - tipo mais específico possível.

#### Const with Objects - Readonly Properties

```typescript
// Const binding + readonly properties
const config: { readonly port: number; readonly host: string } = {
  port: 3000,
  host: "localhost"
};

config = { port: 8080, host: "0.0.0.0" };  // ❌ Error: Cannot reassign const
config.port = 8080;  // ❌ Error: Cannot assign to 'port' (readonly)

// Const com interface
interface Config {
  readonly port: number;
  readonly host: string;
}

const config2: Config = { port: 3000, host: "localhost" };
config2.port = 8080;  // ❌ Error: readonly property
```

**Conceito avançado:** Combinar `const` (binding immutable) + `readonly` (property immutable) = **deep immutability**.

### Const Assertions (as const)

```typescript
// Sem as const - types widened
const colors1 = ["red", "green", "blue"];
// Type: string[]

// Com as const - readonly + literal types
const colors2 = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]

colors2[0] = "yellow";  // ❌ Error: readonly
colors2.push("purple");  // ❌ Error: readonly array

// Object as const
const config1 = { port: 3000, debug: true };
// Type: { port: number; debug: boolean }

const config2 = { port: 3000, debug: true } as const;
// Type: { readonly port: 3000; readonly debug: true }

config2.port = 8080;  // ❌ Error: readonly property
```

**Conceito avançado:** `as const` aplica **readonly recursivamente** - imutabilidade profunda.

#### Const with Functions

```typescript
// Function expression com const
const greet = function(name: string) {
  return `Hello, ${name}`;
};

greet = function(name: string) { return name; };  // ❌ Error: Cannot reassign

// Arrow function com const
const add = (a: number, b: number) => a + b;
add = (a: number, b: number) => a * b;  // ❌ Error: Cannot reassign

// Method property em const object
const calculator = {
  add(a: number, b: number) { return a + b; }
};

calculator.add = (a, b) => a * b;  // ✅ Permitido - property mutável

// Const com readonly method
const calculator2: { readonly add: (a: number, b: number) => number } = {
  add: (a, b) => a + b
};

calculator2.add = (a, b) => a * b;  // ❌ Error: readonly method
```

**Análise profunda:** `const` para funções previne **reatribuição de função**, não modificação de properties.

### Const in Class Context

```typescript
class Example {
  // ❌ Const não permitido como class property
  const value = 10;  // Syntax error
  
  // Alternativa: readonly
  readonly value2 = 10;
  
  // Const local em method
  method() {
    const local = 20;  // ✅ OK - const local
    local = 30;  // ❌ Error
  }
  
  // Static readonly simula const
  static readonly MAX_SIZE = 100;
}

Example.MAX_SIZE = 200;  // ❌ Error: readonly
```

**Limitação:** `const` **não existe** como class property - usar `readonly` instead.

### Const with Closures

```typescript
// Const em closure - capturada por referência
function createCounter() {
  const count = 0;  // Const local
  
  return {
    increment() {
      count++;  // ❌ Error: Cannot assign to 'count'
    },
    get() {
      return count;
    }
  };
}

// Solução - let para contador mutável
function createCounter2() {
  let count = 0;  // Let mutável
  
  return {
    increment() {
      count++;  // ✅ OK
    },
    get() {
      return count;
    }
  };
}

const counter = createCounter2();
counter.increment();
console.log(counter.get());  // 1
```

**Fundamento teórico:** `const` em closure **não pode ser reatribuída** - usar `let` para estado mutável.

#### Const with Module Exports

```typescript
// Const para exports
export const API_URL = "https://api.example.com";
export const MAX_RETRIES = 3;
export const TIMEOUT_MS = 5000;

// Importing module não pode reatribuir
import { API_URL } from "./config";
API_URL = "other";  // ❌ Error: Cannot assign to 'API_URL'

// Const com default export
const config = { port: 3000, host: "localhost" };
export default config;

// Const local em module
const privateValue = "secret";  // Não exportado - privado
```

**Conceito:** `const` para **module constants** - valores que não mudam entre imports.

### Const Performance Implications

```typescript
// Const permite optimizations
const CONSTANT = 100;

for (let i = 0; i < CONSTANT; i++) {
  // Compiler sabe que CONSTANT nunca muda
  // Pode otimizar - não precisa check a cada iteração
}

// Let - compiler precisa assumir que pode mudar
let variable = 100;

for (let i = 0; i < variable; i++) {
  // Compiler não pode assumir que variable é constante
  // Pode precisar re-check a cada iteração
}
```

**Análise profunda:** `const` permite **compiler optimizations** - valor sabidamente constante pode ser inlined.

## 🎯 Aplicabilidade e Contextos

### Configuration Constants

```typescript
const CONFIG = {
  API_URL: "https://api.example.com",
  TIMEOUT_MS: 5000,
  MAX_RETRIES: 3
} as const;

// Previne reatribuição acidental
CONFIG = {};  // ❌ Error
CONFIG.API_URL = "other";  // ❌ Error (com as const)
```

**Raciocínio:** Configurações não devem mudar durante execução.

### Function Expressions

```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Previne sobrescrever função
validateEmail = () => true;  // ❌ Error
```

**Raciocínio:** Funções utilitárias não devem ser reatribuídas.

### Loop Iteration

```typescript
const items = [1, 2, 3, 4, 5];

for (const item of items) {
  console.log(item * 2);  // Nova binding a cada iteração
}
```

**Raciocínio:** Item de iteração não precisa ser reatribuído.

## ⚠️ Limitações e Considerações Teóricas

### Const Does Not Make Values Immutable

```typescript
const obj = { x: 10 };
obj.x = 20;  // ✅ Permitido - conteúdo mutável
```

**Limitação:** `const` não protege conteúdo de objetos/arrays.

### Cannot Declare Without Initialization

```typescript
const value;  // ❌ Error: Must initialize
value = 10;
```

**Consideração:** `const` exige inicialização na declaração.

### Cannot Use in Class Properties

```typescript
class Example {
  const x = 10;  // ❌ Syntax error
  readonly x = 10;  // ✅ Use readonly
}
```

**Limitação:** Usar `readonly` para class properties.

## 🔗 Interconexões Conceituais

**Relação com Readonly:** Readonly protege properties, const protege binding.

**Relação com Imutabilidade:** Const é primeiro passo para imutabilidade.

**Relação com Let/Var:** Const é alternativa immutable a let/var.

**Relação com Block Scope:** Const é block-scoped como let.

**Relação com Type Inference:** Const infere literal types.

## 🚀 Evolução e Próximos Conceitos

Dominar const prepara para:
- **Readonly Properties:** Imutabilidade de object properties
- **Spread Operator:** Cópia immutable de objects/arrays
- **Imutabilidade Profunda:** Não modificar estruturas originais
- **Functional Programming:** Paradigma baseado em imutabilidade
