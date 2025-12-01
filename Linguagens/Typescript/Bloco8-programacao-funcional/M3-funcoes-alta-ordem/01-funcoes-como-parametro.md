# Funções como Parâmetro

## 🎯 Introdução e Definição

### Definição Conceitual

**Funções como parâmetro** referem-se à capacidade de **passar funções como argumentos** para outras funções, tratando funções como **first-class citizens** (cidadãos de primeira classe). Em TypeScript, funções são valores - podem ser atribuídas a variáveis, passadas como argumentos, e retornadas de outras funções. Quando uma função **aceita outra função** como parâmetro, ela é chamada **higher-order function** (função de alta ordem).

Conceitualmente, tratar funções como parâmetros implementa **abstração comportamental** - ao invés de duplicar código com variações de comportamento, abstrai-se a **lógica variável** em função parâmetro enquanto mantém **lógica fixa** na função receptora. TypeScript adiciona **type safety** - funções parâmetro têm **assinaturas tipadas** que especificam tipos de parâmetros e retorno.

**Fundamento teórico:** Funções como parâmetros permitem **injeção de dependência comportamental** - função receptora **não sabe** detalhes de implementação da lógica, apenas sua **interface** (assinatura). Promove **separation of concerns** - cada função tem responsabilidade única, combinadas via composição.

**Function as Parameter Pattern**:
```
function receptor(callback: (param: Type) => ReturnType) {
  // Usa callback sem saber implementação
  const result = callback(value);
}
```

### Contexto Histórico e Evolução

**Lisp (1958):** Primeiro language com **first-class functions** - funções como valores.

**Scheme (1975):** Popularização de **higher-order functions** - map, filter, reduce.

**JavaScript ES3 (1999):** Funções como valores - callbacks amplamente usados.

```javascript
// JavaScript - função como parâmetro
function execute(callback) {
  callback();  // Sem type safety
}

execute(function() {
  console.log("Hello");
});
```

**JavaScript ES5 (2009):** Array methods aceitam callbacks - forEach, map, filter.

```javascript
// ES5 - callbacks em array methods
[1, 2, 3].forEach(function(item) {
  console.log(item);
});
```

**JavaScript ES6 (2015):** **Arrow functions** simplificam callbacks.

```javascript
// ES6 - arrow function como parâmetro
[1, 2, 3].forEach(item => console.log(item));
```

**TypeScript 1.0 (2012):** Type annotations para **function parameters**.

```typescript
// TypeScript - função parâmetro tipada
function execute(callback: () => void): void {
  callback();  // ✅ Type safe
}

execute(() => console.log("Hello"));  // ✅ OK
execute("not a function");  // ❌ Error - type mismatch
```

**TypeScript 2.0 (2016):** **Function types** melhorados - rest parameters, optional parameters.

```typescript
// Function type com parâmetros complexos
type Callback = (value: number, index?: number) => void;

function iterate(arr: number[], callback: Callback): void {
  arr.forEach((value, index) => callback(value, index));
}
```

**TypeScript 3.0 (2018):** **Generic constraints** em function parameters.

```typescript
// Generic function parameter
function process<T>(item: T, handler: (value: T) => void): void {
  handler(item);
}
```

**Evolução de práticas:**

**Era JavaScript (sem tipos):**
```javascript
// Sem type safety - qualquer coisa pode ser passada
function map(arr, fn) {
  return arr.map(fn);  // Espera-se que fn seja função
}
```

**Era TypeScript (tipado):**
```typescript
// Type safety - garante que fn é função correta
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);  // ✅ Tipo garantido
}
```

### Problema Fundamental que Resolve

Funções como parâmetro resolvem problemas de **código duplicado**, **falta de flexibilidade**, e **tight coupling**.

**Problema 1: Código duplicado com variação**
```typescript
// Código duplicado - apenas cálculo difere
function sumArray(arr: number[]): number {
  let result = 0;
  for (const item of arr) {
    result += item;  // Operação específica
  }
  return result;
}

function productArray(arr: number[]): number {
  let result = 1;
  for (const item of arr) {
    result *= item;  // Operação específica (diferente)
  }
  return result;
}

// Mais funções para outras operações... ❌ Duplicação
```

**Solução: Função parâmetro abstrai operação**
```typescript
// Abstração - operação como parâmetro
function reduceArray(
  arr: number[],
  operation: (accumulator: number, current: number) => number,
  initial: number
): number {
  let result = initial;
  for (const item of arr) {
    result = operation(result, item);  // ✅ Operação injetada
  }
  return result;
}

// Reutilização - diferentes operações, mesma estrutura
const sum = reduceArray([1, 2, 3], (acc, cur) => acc + cur, 0);  // 6
const product = reduceArray([1, 2, 3], (acc, cur) => acc * cur, 1);  // 6
const max = reduceArray([1, 5, 3], (acc, cur) => Math.max(acc, cur), -Infinity);  // 5
```

**Problema 2: Falta de type safety em callbacks**
```javascript
// JavaScript - sem type safety
function process(callback) {
  const result = callback(42);  // ⚠️ Não sabe tipo de retorno
  console.log(result.toUpperCase());  // Runtime error se não for string
}

process(() => 123);  // Boom! Runtime error
```

**Solução: Type safety com TypeScript**
```typescript
// TypeScript - callback tipado
function process(callback: (value: number) => string): void {
  const result = callback(42);  // ✅ Tipo garantido: string
  console.log(result.toUpperCase());  // ✅ Safe
}

process((value) => value.toString());  // ✅ OK
process((value) => value);  // ❌ Error - retorna number, esperado string
```

**Problema 3: Tight coupling - dependência de implementação**
```typescript
// Tight coupling - sortUsers depende de implementação específica
function sortUsers(users: User[]): User[] {
  return users.sort((a, b) => a.name.localeCompare(b.name));  // ⚠️ Hardcoded
  // Se quiser ordenar por age, precisa nova função
}
```

**Solução: Inversão de dependência com função parâmetro**
```typescript
// Loose coupling - comparador injetado
function sortUsers(
  users: User[],
  comparator: (a: User, b: User) => number
): User[] {
  return users.sort(comparator);  // ✅ Flexível
}

// Diferentes ordenações - mesma função
sortUsers(users, (a, b) => a.name.localeCompare(b.name));  // Por nome
sortUsers(users, (a, b) => a.age - b.age);  // Por idade
sortUsers(users, (a, b) => b.createdAt - a.createdAt);  // Por data (desc)
```

**Fundamento teórico:** Funções como parâmetro implementam **Strategy Pattern** - algoritmo é injetado, não hardcoded.

### Importância no Ecossistema

Funções como parâmetro são cruciais porque:

- **Reusabilidade:** Mesmo código, comportamentos diferentes
- **Abstração:** Separar "o quê" de "como"
- **Type Safety:** TypeScript garante assinatura correta
- **Composability:** Combinar funções pequenas em complexas
- **Testability:** Injetar mocks/stubs facilmente
- **Flexibility:** Mudar comportamento sem modificar receptor
- **Functional Programming:** Fundamento de paradigma funcional
- **Event Handling:** Callbacks em eventos DOM/Node.js

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **First-Class Functions:** Funções são valores
2. **Higher-Order Functions:** Funções que aceitam funções
3. **Callback Pattern:** Função parâmetro executada posteriormente
4. **Type Safety:** Assinatura tipada para função parâmetro
5. **Dependency Injection:** Comportamento injetado via parâmetro

### Pilares Fundamentais

- **Function Type:** `(param: Type) => ReturnType`
- **Type Inference:** TypeScript infere tipos de callback
- **Generic Functions:** Callbacks com tipos genéricos
- **Optional Callbacks:** Função parâmetro opcional
- **Callback Execution:** Quando e como executar

### Visão Geral das Nuances

- **Inline Callbacks:** Arrow functions inline
- **Named Callbacks:** Funções nomeadas como parâmetro
- **Type Aliases:** Definir tipos de callback
- **Void vs Return:** Callbacks com/sem retorno
- **Multiple Callbacks:** Múltiplas funções parâmetro

## 🧠 Fundamentos Teóricos

### Function Type Annotation

```typescript
// Função que aceita callback - type annotation completo
function execute(callback: () => void): void {
  console.log("Antes do callback");
  callback();  // Executa função parâmetro
  console.log("Depois do callback");
}

// Chamando com diferentes callbacks
execute(() => console.log("Callback 1"));
execute(() => console.log("Callback 2"));

// Output:
// Antes do callback
// Callback 1
// Depois do callback
// Antes do callback
// Callback 2
// Depois do callback
```

**Análise profunda:**

**Function type:** `() => void`
- `()`: Sem parâmetros
- `=>`: Separador
- `void`: Não retorna valor

**Callback execution:** `callback()` - invocar função parâmetro.

### Callback with Parameters

```typescript
// Callback com parâmetros - type annotation
function processNumber(
  value: number,
  callback: (n: number) => void
): void {
  callback(value);  // Passa value para callback
}

// Callbacks diferentes
processNumber(10, (n) => console.log(n * 2));  // 20
processNumber(5, (n) => console.log(n ** 2));  // 25
processNumber(3, (n) => console.log(n + 100)); // 103
```

**Type annotation:** `callback: (n: number) => void`
- **Parâmetro:** `n: number` - callback recebe number
- **Retorno:** `void` - callback não retorna

**Type inference:** TypeScript infere que `n` em `(n) => ...` é `number`.

### Callback with Return Value

```typescript
// Callback que retorna valor
function transform(
  value: number,
  transformer: (n: number) => number
): number {
  return transformer(value);  // Retorna resultado do callback
}

// Diferentes transformações
const doubled = transform(5, (n) => n * 2);    // 10
const squared = transform(5, (n) => n ** 2);   // 25
const negated = transform(5, (n) => -n);       // -5

console.log(doubled, squared, negated);
```

**Análise profunda:**

**Function type:** `(n: number) => number`
- Recebe `number`, retorna `number`

**Uso do retorno:** `return transformer(value)` - usa resultado do callback.

### Princípios e Conceitos Subjacentes

#### Array.forEach Pattern

```typescript
// forEach - callback para cada element
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((item, index, array) => {
  console.log(`Index ${index}: ${item}`);
});

// Type annotation de forEach (built-in)
interface Array<T> {
  forEach(callback: (value: T, index: number, array: T[]) => void): void;
}
```

**Fundamento teórico:** `forEach` é **higher-order function** - aceita callback com 3 parâmetros.

#### Array.map Pattern

```typescript
// map - callback transforma cada element
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((item) => item * 2);
// [2, 4, 6, 8, 10]

const strings = numbers.map((item) => `Number: ${item}`);
// ["Number: 1", "Number: 2", ...]

// Type annotation de map (built-in)
interface Array<T> {
  map<U>(callback: (value: T, index: number, array: T[]) => U): U[];
}
```

**Análise profunda:**

**Generic:** `<U>` - tipo de retorno do callback pode diferir de `T`
**Transformação:** `T[] -> U[]` via callback `(T) => U`

### Array.filter Pattern

```typescript
// filter - callback determina quais elements manter
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = numbers.filter((item) => item % 2 === 0);
// [2, 4, 6, 8, 10]

const greaterThan5 = numbers.filter((item) => item > 5);
// [6, 7, 8, 9, 10]

// Type annotation de filter (built-in)
interface Array<T> {
  filter(callback: (value: T, index: number, array: T[]) => boolean): T[];
}
```

**Conceito fundamental:** Callback **predicate** - retorna `boolean` para decidir inclusão.

### Custom Higher-Order Function

```typescript
// Custom function que aceita callback
function repeat(
  times: number,
  action: (iteration: number) => void
): void {
  for (let i = 0; i < times; i++) {
    action(i);  // Executa callback para cada iteração
  }
}

// Uso
repeat(3, (i) => console.log(`Iteration ${i}`));
// Output:
// Iteration 0
// Iteration 1
// Iteration 2

repeat(5, (i) => console.log(`#${i + 1}`));
// Output:
// #1
// #2
// #3
// #4
// #5
```

**Pattern:** Encapsular lógica repetitiva, comportamento via callback.

### Type Alias for Callbacks

```typescript
// Type alias para callback - reutilizável
type Predicate<T> = (item: T) => boolean;
type Transformer<T, U> = (item: T) => U;
type Action<T> = (item: T) => void;

// Usar type aliases
function filterArray<T>(arr: T[], predicate: Predicate<T>): T[] {
  return arr.filter(predicate);
}

function mapArray<T, U>(arr: T[], transformer: Transformer<T, U>): U[] {
  return arr.map(transformer);
}

function forEachArray<T>(arr: T[], action: Action<T>): void {
  arr.forEach(action);
}

// Uso
const numbers = [1, 2, 3, 4, 5];

const evens = filterArray(numbers, (n) => n % 2 === 0);
const doubled = mapArray(numbers, (n) => n * 2);
forEachArray(numbers, (n) => console.log(n));
```

**Benefício:** Type aliases tornam assinaturas **mais legíveis** e **reutilizáveis**.

### Modelo Mental para Compreensão

Pense em funções como parâmetro como **contratar especialista**:

**Função receptora:** Gerente de projeto - sabe **quando** executar tarefa
**Função parâmetro:** Especialista - sabe **como** executar tarefa

**Analogia - Receita de Cozinha:**

**Função receptora:** "Misture ingredientes, depois [AÇÃO CUSTOMIZADA], depois asse"
**Função parâmetro:** [AÇÃO CUSTOMIZADA] = "adicione chocolate" ou "adicione nozes"

**Metáfora - Plugin System:**

**Função receptora:** Software base - estrutura fixa
**Função parâmetro:** Plugin - comportamento customizado injetado

**Fluxo de execução:**
```
1. Chamar função receptora com callback
2. Receptor executa lógica antes
3. Receptor INVOCA callback (passa controle)
4. Callback executa (lógica customizada)
5. Callback retorna (devolve controle)
6. Receptor continua lógica depois
```

**Exemplo concreto:**
```typescript
function processFile(
  filename: string,
  processor: (content: string) => void
) {
  // 1. Lógica antes (receptor)
  const content = readFile(filename);
  
  // 2. Invoca callback (transfere controle)
  processor(content);
  
  // 3. Lógica depois (receptor)
  console.log("Processing complete");
}

// Callback customizado
processFile("data.txt", (content) => {
  console.log(content.toUpperCase());  // Comportamento injetado
});
```

## 🔍 Análise Conceitual Profunda

### Optional Callbacks

```typescript
// Callback opcional - parâmetro pode ser undefined
function processData(
  data: string[],
  onProgress?: (progress: number) => void
): void {
  for (let i = 0; i < data.length; i++) {
    // Lógica de processamento
    
    // Invocar callback SE fornecido
    if (onProgress) {
      const progress = ((i + 1) / data.length) * 100;
      onProgress(progress);
    }
  }
}

// Com callback
processData(["a", "b", "c"], (progress) => {
  console.log(`${progress}% complete`);
});

// Sem callback
processData(["a", "b", "c"]);  // ✅ OK - callback opcional
```

**Pattern:** `onProgress?` - parâmetro opcional, type `((progress: number) => void) | undefined`.

**Guard:** `if (onProgress)` - verificar antes de invocar.

#### Multiple Callbacks

```typescript
// Múltiplas funções parâmetro
function fetchData(
  url: string,
  onSuccess: (data: any) => void,
  onError: (error: Error) => void
): void {
  fetch(url)
    .then(response => response.json())
    .then(data => onSuccess(data))  // Invocar onSuccess
    .catch(error => onError(error));  // Invocar onError
}

// Uso
fetchData(
  "/api/users",
  (data) => console.log("Success:", data),
  (error) => console.error("Error:", error)
);
```

**Pattern:** Diferentes callbacks para diferentes cenários (success/error).

### Generic Callbacks

```typescript
// Callback genérico - tipo parametrizado
function findFirst<T>(
  arr: T[],
  predicate: (item: T) => boolean
): T | undefined {
  for (const item of arr) {
    if (predicate(item)) {
      return item;  // Primeiro que satisfaz predicate
    }
  }
  return undefined;
}

// Uso com diferentes tipos
const numbers = [1, 2, 3, 4, 5];
const firstEven = findFirst(numbers, (n) => n % 2 === 0);  // 2 (type: number | undefined)

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice", active: false },
  { id: 2, name: "Bob", active: true }
];

const firstActive = findFirst(users, (u) => u.active);  // Bob (type: User | undefined)
```

**Análise profunda:**

**Generic `<T>`:** Callback type `(item: T) => boolean` adapta ao tipo do array
**Type inference:** TypeScript infere `T = number` e `T = User` automaticamente

#### Callback with Constraints

```typescript
// Callback genérico com constraint
interface HasId {
  id: number;
}

function findById<T extends HasId>(
  arr: T[],
  id: number,
  mapper: (item: T) => string
): string | undefined {
  const item = arr.find(item => item.id === id);
  return item ? mapper(item) : undefined;
}

// Uso
interface Product extends HasId {
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Book", price: 20 },
  { id: 2, name: "Pen", price: 5 }
];

const result = findById(products, 1, (p) => `${p.name}: $${p.price}`);
console.log(result);  // "Book: $20"
```

**Constraint:** `T extends HasId` - garante que `T` tem propriedade `id`.

**Callback:** `mapper: (item: T) => string` - transforma `T` em `string`.

### Callback Return Type Inference

```typescript
// TypeScript infere tipo de retorno do callback
function map<T, U>(
  arr: T[],
  mapper: (item: T) => U  // U inferido do retorno de mapper
): U[] {
  return arr.map(mapper);
}

const numbers = [1, 2, 3];

// U inferido como number
const doubled = map(numbers, (n) => n * 2);
// Type: number[]

// U inferido como string
const strings = map(numbers, (n) => `Number ${n}`);
// Type: string[]

// U inferido como boolean
const evens = map(numbers, (n) => n % 2 === 0);
// Type: boolean[]
```

**Type inference:** TypeScript determina `U` baseado no **corpo do callback**.

#### Callback with Rest Parameters

```typescript
// Callback com rest parameters
function combine<T>(
  combiner: (...values: T[]) => T,
  ...values: T[]
): T {
  return combiner(...values);
}

// Soma de números
const sum = combine((a, b, c) => a + b + c, 1, 2, 3);  // 6

// Concatenação de strings
const joined = combine((a, b) => a + b, "Hello", " World");  // "Hello World"

// Max de números
const max = combine((...nums) => Math.max(...nums), 5, 10, 3, 8);  // 10
```

**Pattern:** Callback aceita **arbitrary number** de argumentos via rest parameters.

### Named vs Inline Callbacks

```typescript
// Named callback - função separada
function double(n: number): number {
  return n * 2;
}

const doubled1 = [1, 2, 3].map(double);  // Passa referência

// Inline callback - arrow function
const doubled2 = [1, 2, 3].map((n) => n * 2);  // Inline

// Ambos equivalentes, mas inline é mais conciso para lógica simples
```

**Guideline:**
- **Inline:** Lógica simples, uso único
- **Named:** Lógica complexa, reutilização

#### Callback Type Safety

```typescript
// Type safety garante assinatura correta
function processUsers(
  users: User[],
  processor: (user: User) => void
): void {
  users.forEach(processor);
}

const users: User[] = [
  { id: 1, name: "Alice", age: 30 }
];

// ✅ Assinatura correta
processUsers(users, (user) => {
  console.log(user.name);  // ✅ Type-safe access
});

// ❌ Assinatura incorreta
processUsers(users, (user: string) => {  // ❌ Error - tipo incompatível
  console.log(user);
});

// ❌ Retorno incorreto
processUsers(users, (user): number => {  // ❌ Error - retorna number, esperado void
  return user.id;
});
```

**Type safety:** Previne erros de assinatura em **compile-time**.

### Callback Execution Timing

```typescript
// Execução imediata vs posterior
function executeNow(callback: () => void): void {
  callback();  // Executa imediatamente
}

function executeLater(callback: () => void): void {
  setTimeout(callback, 1000);  // Executa depois de 1s
}

console.log("Start");

executeNow(() => console.log("Now"));  // Executa imediatamente

executeLater(() => console.log("Later"));  // Agenda para depois

console.log("End");

// Output:
// Start
// Now
// End
// (1 segundo depois)
// Later
```

**Conceito:** Função receptora controla **quando** executar callback.

#### Callback Composition

```typescript
// Compor callbacks - combinar múltiplas funções
function compose<T>(
  ...fns: Array<(value: T) => T>
): (value: T) => T {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}

// Funções individuais
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n ** 2;

// Compor
const transform = compose(addOne, double, square);

console.log(transform(2));  // ((2 + 1) * 2) ** 2 = 36
```

**Pattern:** Combinar callbacks simples em **pipeline complexo**.

### Error Handling in Callbacks

```typescript
// Callback pode lançar erro - receptor deve tratar
function safeForeach<T>(
  arr: T[],
  callback: (item: T) => void,
  onError: (error: Error, item: T) => void
): void {
  for (const item of arr) {
    try {
      callback(item);  // Pode lançar erro
    } catch (error) {
      onError(error as Error, item);  // Tratar erro
    }
  }
}

// Uso
safeForeach(
  [1, 2, 0, 4],
  (n) => {
    if (n === 0) throw new Error("Zero not allowed");
    console.log(10 / n);
  },
  (error, item) => {
    console.error(`Error processing ${item}: ${error.message}`);
  }
);
```

**Pattern:** Receptor trata erros do callback via **segundo callback** (onError).

## 🎯 Aplicabilidade e Contextos

### Event Handlers

```typescript
button.addEventListener("click", (event) => {
  console.log("Clicked!");
});
```

**Raciocínio:** Callbacks para reagir a eventos.

### Array Manipulation

```typescript
const filtered = arr.filter(item => item.active);
const mapped = arr.map(item => item.name);
```

**Raciocínio:** Transformar/filtrar dados declarativamente.

### Asynchronous Operations

```typescript
fetchData(url, (data) => processData(data));
```

**Raciocínio:** Callback executado quando operação assíncrona completa.

## ⚠️ Limitações e Considerações Teóricas

### Callback Hell

```typescript
// Callbacks aninhados - difícil ler
getData((data) => {
  processData(data, (result) => {
    saveResult(result, (saved) => {
      // Callback hell...
    });
  });
});
```

**Limitação:** Múltiplos níveis de aninhamento - usar Promises/async-await.

### Type Complexity

```typescript
// Tipo de callback complexo - verboso
type Callback = (a: number, b: string, c: boolean) => Promise<{ x: number; y: string }>;
```

**Consideração:** Type aliases ajudam, mas tipos muito complexos confundem.

### Performance Overhead

```typescript
// Criar função a cada iteração - overhead
arr.forEach(item => process(item));
```

**Consideração:** Minor overhead - normalmente negligível.

## 🔗 Interconexões Conceituais

**Relação com Higher-Order Functions:** Funções que aceitam funções.

**Relação com Closures:** Callbacks podem capturar escopo externo.

**Relação com Functional Programming:** Callbacks são fundamento de FP.

**Relação com Strategy Pattern:** Injetar comportamento via callback.

**Relação com Dependency Injection:** Comportamento como dependência.

## 🚀 Evolução e Próximos Conceitos

Dominar funções como parâmetro prepara para:
- **Funções como Retorno:** Retornar funções de funções
- **Callbacks Tipados:** Type safety avançado
- **Higher-Order Typed:** Genéricos complexos em HOF
- **Currying e Partial Application:** Técnicas avançadas
