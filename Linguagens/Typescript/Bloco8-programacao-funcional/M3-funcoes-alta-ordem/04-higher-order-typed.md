# Higher-Order Functions Typed

## 🎯 Introdução e Definição

### Definição Conceitual

**Higher-order functions typed** (funções de alta ordem tipadas) referem-se a **funções que aceitam outras funções como argumentos e/ou retornam funções**, com **type annotations completas** em TypeScript. Higher-order function (HOF) é função que opera em **nível de abstração superior** - manipula comportamento (funções) ao invés de apenas dados. TypeScript adiciona **type safety** - todas as funções envolvidas (HOF, funções parâmetro, funções retornadas) têm tipos explícitos, garantindo composição segura.

Conceitualmente, HOFs tipadas implementam **behavioral abstraction** - separar "o quê fazer" (estrutura da HOF) de "como fazer" (função parâmetro). TypeScript garante **contract enforcement** - função parâmetro deve seguir assinatura esperada, função retornada tem tipo específico. Permite **generic polymorphism** - mesma HOF funciona com diferentes tipos via generics, mantendo type safety completo.

**Fundamento teórico:** HOFs tipadas são **type-safe function combinators** - compor funções pequenas em operações complexas sem sacrificar type safety. Type system verifica **composability** - output de uma função deve ser compatível com input da próxima. Promove **declarative programming** - descrever "o quê" ao invés de "como", com tipos garantindo correção.

**Higher-Order Function Pattern**:
```
function HOF<T, U>(
  fn: (item: T) => U
): (arr: T[]) => U[] {
  return (arr: T[]) => arr.map(fn);
}
```

### Contexto Histórico e Evolução

**Lambda Calculus (1930s):** Fundamento matemático de **higher-order functions**.

**Lisp (1958):** Primeiro language com HOFs - `map`, `filter`, `reduce`.

**Scheme (1975):** HOFs como paradigma central - functional programming.

**JavaScript ES5 (2009):** Array methods como HOFs - `forEach`, `map`, `filter`.

```javascript
// JavaScript - HOF sem tipos
[1, 2, 3].map(function(n) {
  return n * 2;  // Sem type safety
});
```

**JavaScript ES6 (2015):** Arrow functions simplificam HOFs.

```javascript
// ES6 - HOF conciso
[1, 2, 3].map(n => n * 2);
```

**TypeScript 1.0 (2012):** Type annotations para HOFs.

```typescript
// TypeScript - HOF tipada
function map<T, U>(
  arr: T[],
  fn: (item: T) => U
): U[] {
  return arr.map(fn);  // ✅ Type-safe
}

const doubled = map([1, 2, 3], n => n * 2);
// Type: number[]
```

**TypeScript 2.0 (2016):** **Generic constraints** em HOFs.

```typescript
// Constraint em HOF
function mapWithId<T extends { id: number }, U>(
  arr: T[],
  fn: (item: T) => U
): U[] {
  return arr.map(fn);
}
```

**TypeScript 3.0 (2018):** **Tuple types** e **rest parameters** em HOFs.

```typescript
// Rest parameters tipados
function compose<T extends any[], R>(
  ...fns: Array<(...args: any[]) => any>
): (...args: T) => R {
  return (...args: T) => fns.reduceRight((acc, fn) => fn(acc), args);
}
```

**TypeScript 4.0 (2020):** **Variadic tuple types** - HOFs mais flexíveis.

```typescript
// Variadic tuples
function pipe<T, U, V>(
  fn1: (arg: T) => U,
  fn2: (arg: U) => V
): (arg: T) => V {
  return (arg: T) => fn2(fn1(arg));
}
```

**Evolução de práticas:**

**Era JavaScript (sem tipos):**
```javascript
// Sem type safety
function map(arr, fn) {
  return arr.map(fn);  // Tipos desconhecidos
}
```

**Era TypeScript (tipado):**
```typescript
// Type safety completo
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);  // ✅ Tudo tipado
}
```

### Problema Fundamental que Resolve

HOFs tipadas resolvem problemas de **código duplicado**, **falta de type safety em composição**, e **abstrações inseguras**.

**Problema 1: Duplicação de lógica**
```typescript
// Sem HOF - código duplicado
function doubleNumbers(arr: number[]): number[] {
  const result: number[] = [];
  for (const item of arr) {
    result.push(item * 2);  // Lógica de transformação
  }
  return result;
}

function squareNumbers(arr: number[]): number[] {
  const result: number[] = [];
  for (const item of arr) {
    result.push(item ** 2);  // Mesma estrutura, transformação diferente
  }
  return result;
}

// Mais funções... ❌ Duplicação
```

**Solução: HOF abstrai estrutura**
```typescript
// HOF - reutiliza estrutura
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of arr) {
    result.push(fn(item));  // ✅ Transformação parametrizada
  }
  return result;
}

// Reutilização - mesma estrutura, diferentes transformações
const doubled = map([1, 2, 3], n => n * 2);     // [2, 4, 6]
const squared = map([1, 2, 3], n => n ** 2);    // [1, 4, 9]
const stringified = map([1, 2, 3], n => `${n}`); // ["1", "2", "3"]
```

**Problema 2: Composição sem type safety**
```javascript
// JavaScript - composição insegura
function compose(f, g) {
  return function(x) {
    return f(g(x));  // ⚠️ f e g compatíveis? Unknown
  };
}

const addOne = x => x + 1;
const toString = x => x.toString();

const composed = compose(toString, addOne);
console.log(composed(5));  // "6" ✅ OK por acaso

// Bug sutil - ordem inversa
const buggy = compose(addOne, toString);
console.log(buggy(5));  // "51" ⚠️ Concatenação ao invés de adição
```

**Solução: TypeScript garante compatibilidade**
```typescript
// TypeScript - composição type-safe
function compose<T, U, V>(
  f: (arg: U) => V,
  g: (arg: T) => U
): (arg: T) => V {
  return (arg: T) => f(g(arg));  // ✅ Type-safe
}

const addOne = (x: number): number => x + 1;
const toString = (x: number): string => x.toString();

const composed = compose(toString, addOne);
console.log(composed(5));  // "6" ✅ OK - types corretos

// ❌ Ordem inversa - TypeScript detecta
const buggy = compose(addOne, toString);
// ❌ Error: Type 'string' is not assignable to type 'number'
```

**Problema 3: Abstrações sem type safety**
```javascript
// JavaScript - abstração insegura
function reduce(arr, fn, initial) {
  let accumulator = initial;
  for (const item of arr) {
    accumulator = fn(accumulator, item);  // ⚠️ Tipos?
  }
  return accumulator;
}

// Bug - tipo incorreto
const sum = reduce([1, 2, 3], (acc, n) => acc + n, "0");
console.log(sum);  // "0123" ⚠️ Concatenação ao invés de soma
```

**Solução: HOF tipada garante tipos corretos**
```typescript
// TypeScript - reduce type-safe
function reduce<T, U>(
  arr: T[],
  fn: (accumulator: U, current: T) => U,
  initial: U
): U {
  let accumulator = initial;
  for (const item of arr) {
    accumulator = fn(accumulator, item);  // ✅ Type-safe
  }
  return accumulator;
}

// ✅ Tipo correto - inferido
const sum = reduce([1, 2, 3], (acc, n) => acc + n, 0);
// Type: number

// ❌ Tipo incorreto - detectado
const buggy = reduce([1, 2, 3], (acc, n) => acc + n, "0");
// ❌ Error: Types incompatíveis
```

**Fundamento teórico:** HOFs tipadas garantem **composability** e **type safety** em abstrações.

### Importância no Ecossistema

HOFs tipadas são cruciais porque:

- **Code Reuse:** Reutilizar estrutura com comportamentos diferentes
- **Type Safety:** Garantir composição correta via tipos
- **Abstraction:** Separar estrutura de comportamento
- **Declarative Code:** Descrever "o quê", não "como"
- **Functional Programming:** Fundamento de paradigma funcional
- **Composability:** Combinar funções pequenas em complexas
- **IntelliSense:** Autocomplete baseado em tipos
- **Refactoring:** Mudanças detectadas automaticamente

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Higher-Order Function:** Aceita/retorna funções
2. **Generic Types:** Tipos parametrizados para flexibilidade
3. **Type Safety:** Verificação em compile-time
4. **Composition:** Combinar funções mantendo tipos
5. **Abstraction:** Separar estrutura de comportamento

### Pilares Fundamentais

- **Function Parameters:** Funções como argumentos
- **Function Returns:** Funções como retorno
- **Generic Constraints:** Restrições em tipos genéricos
- **Type Inference:** Dedução automática de tipos
- **Composability:** Combinar HOFs

### Visão Geral das Nuances

- **Map/Filter/Reduce:** HOFs fundamentais
- **Compose/Pipe:** Composição de funções
- **Currying:** Transformar multi-param em single-param
- **Partial Application:** Fixar argumentos
- **Point-Free Style:** Funções sem menção explícita de args

## 🧠 Fundamentos Teóricos

### Map HOF

```typescript
// Map - transformar cada element
function map<T, U>(
  arr: T[],
  fn: (item: T, index: number) => U
): U[] {
  const result: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i));
  }
  return result;
}

// Uso - type inference
const numbers = [1, 2, 3, 4, 5];

const doubled = map(numbers, n => n * 2);
// Type: number[]

const strings = map(numbers, n => `Number ${n}`);
// Type: string[]

const pairs = map(numbers, (n, i) => [i, n] as const);
// Type: readonly [number, number][]
```

**Análise profunda:**

**Generic:** `<T, U>` - input type `T`, output type `U`
**Type inference:** TypeScript deduz `U` do retorno de `fn`

### Filter HOF

```typescript
// Filter - selecionar elements
function filter<T>(
  arr: T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  const result: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      result.push(arr[i]);
    }
  }
  return result;
}

// Uso
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = filter(numbers, n => n % 2 === 0);
// [2, 4, 6, 8, 10]

const greaterThan5 = filter(numbers, n => n > 5);
// [6, 7, 8, 9, 10]

const evenIndices = filter(numbers, (_, i) => i % 2 === 0);
// [1, 3, 5, 7, 9]
```

**Predicate:** Função que retorna `boolean` - decide inclusão.

### Reduce HOF

```typescript
// Reduce - acumular valor
function reduce<T, U>(
  arr: T[],
  reducer: (accumulator: U, current: T, index: number) => U,
  initial: U
): U {
  let accumulator = initial;
  for (let i = 0; i < arr.length; i++) {
    accumulator = reducer(accumulator, arr[i], i);
  }
  return accumulator;
}

// Uso - diferentes acumulações
const numbers = [1, 2, 3, 4, 5];

const sum = reduce(numbers, (acc, n) => acc + n, 0);
// 15

const product = reduce(numbers, (acc, n) => acc * n, 1);
// 120

const concatenated = reduce(numbers, (acc, n) => acc + n.toString(), "");
// "12345"

const max = reduce(numbers, (acc, n) => Math.max(acc, n), -Infinity);
// 5
```

**Análise profunda:**

**Generic:** `<T, U>` - array type `T`, accumulator type `U`
**Initial:** Tipo de `initial` determina tipo de `accumulator`

### Princípios e Conceitos Subjacentes

#### Compose HOF

```typescript
// Compose - combinar funções (direita para esquerda)
function compose<T, U, V>(
  f: (arg: U) => V,
  g: (arg: T) => U
): (arg: T) => V {
  return (arg: T) => f(g(arg));
}

// Funções individuais
const addOne = (n: number): number => n + 1;
const double = (n: number): number => n * 2;
const square = (n: number): number => n ** 2;

// Compor - f(g(x))
const addThenDouble = compose(double, addOne);
console.log(addThenDouble(5));  // double(addOne(5)) = double(6) = 12

const doubleThenSquare = compose(square, double);
console.log(doubleThenSquare(3));  // square(double(3)) = square(6) = 36

// Compor múltiplas
const transform = compose(square, compose(double, addOne));
console.log(transform(2));  // square(double(addOne(2))) = square(double(3)) = square(6) = 36
```

**Fundamento teórico:** `compose(f, g)` = `f ∘ g` - composição matemática.

**Direção:** Direita para esquerda - `g` executado primeiro, depois `f`.

#### Pipe HOF

```typescript
// Pipe - combinar funções (esquerda para direita)
function pipe<T, U, V>(
  f: (arg: T) => U,
  g: (arg: U) => V
): (arg: T) => V {
  return (arg: T) => g(f(arg));
}

// Funções individuais
const addOne = (n: number): number => n + 1;
const double = (n: number): number => n * 2;
const square = (n: number): number => n ** 2;

// Pipe - left-to-right
const addThenDouble = pipe(addOne, double);
console.log(addThenDouble(5));  // double(addOne(5)) = double(6) = 12

const doubleThenSquare = pipe(double, square);
console.log(doubleThenSquare(3));  // square(double(3)) = square(6) = 36

// Pipe múltiplas
const transform = pipe(addOne, pipe(double, square));
console.log(transform(2));  // square(double(addOne(2))) = square(double(3)) = square(6) = 36
```

**Diferença de compose:** Pipe executa **esquerda para direita** - mais intuitivo.

### Generic Compose (N functions)

```typescript
// Compose genérico - arbitrary number de funções
function composeN<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Uso
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n ** 2;

const transform = composeN(square, double, addOne);
console.log(transform(2));  // square(double(addOne(2))) = 36
```

**Limitação:** Todos os tipos devem ser `T` - não permite mudança de tipo entre funções.

### Type-Changing Compose

```typescript
// Compose com mudança de tipo
function compose3<T, U, V, W>(
  f: (arg: V) => W,
  g: (arg: U) => V,
  h: (arg: T) => U
): (arg: T) => W {
  return (arg: T) => f(g(h(arg)));
}

// Uso - tipos diferentes em cada estágio
const toString = (n: number): string => n.toString();
const getLength = (s: string): number => s.length;
const isEven = (n: number): boolean => n % 2 === 0;

const transform = compose3(isEven, getLength, toString);
console.log(transform(123));  // isEven(getLength(toString(123))) = isEven(3) = false
```

**Type-changing:** Cada função pode transformar tipo - `T → U → V → W`.

### Curry HOF

```typescript
// Curry - transformar função multi-param em sequência
function curry2<T, U, R>(
  fn: (a: T, b: U) => R
): (a: T) => (b: U) => R {
  return (a: T) => (b: U) => fn(a, b);
}

function curry3<T, U, V, R>(
  fn: (a: T, b: U, c: V) => R
): (a: T) => (b: U) => (c: V) => R {
  return (a: T) => (b: U) => (c: V) => fn(a, b, c);
}

// Função original
function add(a: number, b: number): number {
  return a + b;
}

// Versão curried
const addCurried = curry2(add);

const add5 = addCurried(5);  // Partial application
console.log(add5(3));  // 8
console.log(add5(10)); // 15

// Direct usage
console.log(addCurried(2)(3));  // 5
```

**Currying:** Transformar `(a, b) => R` em `(a) => (b) => R`.

### Partial Application HOF

```typescript
// Partial - fixar alguns argumentos
function partial<T, U, R>(
  fn: (a: T, b: U) => R,
  a: T
): (b: U) => R {
  return (b: U) => fn(a, b);
}

// Uso
function multiply(a: number, b: number): number {
  return a * b;
}

const double = partial(multiply, 2);
const triple = partial(multiply, 3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**Partial application:** Fixar argumentos iniciais, retornar função com menos parâmetros.

### Modelo Mental para Compreensão

Pense em HOFs tipadas como **fábrica de máquinas**:

**HOF:** Fábrica - define estrutura geral
**Função parâmetro:** Especificação - customiza comportamento
**Função retornada:** Máquina customizada - pronta para uso

**Analogia - Receita Modular:**

**HOF:** Template de receita - "Misture [INGREDIENTES], depois [MÉTODO], depois asse"
**Função parâmetro:** Customização - define ingredientes e método
**Resultado:** Receita completa e específica

**Metáfora - Assembly Line:**

**Map:** Assembly line que transforma cada item
**Filter:** Quality control que seleciona items
**Reduce:** Aggregator que combina items

**Fluxo de composição:**
```
input → fn1 → intermediate1 → fn2 → intermediate2 → fn3 → output

TypeScript garante:
- output de fn1 compatível com input de fn2
- output de fn2 compatível com input de fn3
- Toda cadeia type-safe
```

**Exemplo concreto:**
```typescript
const addOne = (n: number): number => n + 1;     // number → number
const toString = (n: number): string => `${n}`;  // number → string
const getLength = (s: string): number => s.length; // string → number

// Compose garante compatibilidade
const transform = pipe(addOne, toString, getLength);
//                     T → U    U → V     V → W
//                     number → string → number

console.log(transform(99));  // getLength(toString(addOne(99))) = getLength("100") = 3
```

## 🔍 Análise Conceitual Profunda

### Every/Some HOFs

```typescript
// Every - todos satisfazem predicate?
function every<T>(
  arr: T[],
  predicate: (item: T) => boolean
): boolean {
  for (const item of arr) {
    if (!predicate(item)) {
      return false;  // Short-circuit
    }
  }
  return true;
}

// Some - algum satisfaz predicate?
function some<T>(
  arr: T[],
  predicate: (item: T) => boolean
): boolean {
  for (const item of arr) {
    if (predicate(item)) {
      return true;  // Short-circuit
    }
  }
  return false;
}

// Uso
const numbers = [2, 4, 6, 8, 10];

console.log(every(numbers, n => n % 2 === 0));  // true - todos pares
console.log(some(numbers, n => n > 5));         // true - alguns > 5
console.log(every(numbers, n => n > 5));        // false - nem todos > 5
```

**Short-circuit:** Para na primeira falha (every) ou sucesso (some).

#### Find/FindIndex HOFs

```typescript
// Find - primeiro element que satisfaz predicate
function find<T>(
  arr: T[],
  predicate: (item: T, index: number) => boolean
): T | undefined {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      return arr[i];
    }
  }
  return undefined;
}

// FindIndex - index do primeiro element
function findIndex<T>(
  arr: T[],
  predicate: (item: T, index: number) => boolean
): number {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      return i;
    }
  }
  return -1;
}

// Uso
interface User {
  id: number;
  name: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice", active: false },
  { id: 2, name: "Bob", active: true },
  { id: 3, name: "Charlie", active: true }
];

const firstActive = find(users, u => u.active);
console.log(firstActive);  // { id: 2, name: "Bob", active: true }

const bobIndex = findIndex(users, u => u.name === "Bob");
console.log(bobIndex);  // 1
```

**Return type:** `find` retorna `T | undefined`, `findIndex` retorna `number`.

### FlatMap HOF

```typescript
// FlatMap - map + flatten
function flatMap<T, U>(
  arr: T[],
  fn: (item: T, index: number) => U[]
): U[] {
  const result: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    const mapped = fn(arr[i], i);
    result.push(...mapped);  // Flatten
  }
  return result;
}

// Uso
const numbers = [1, 2, 3];

const expanded = flatMap(numbers, n => [n, n * 2]);
// [1, 2, 2, 4, 3, 6]

const words = ["hello world", "foo bar"];
const allWords = flatMap(words, s => s.split(" "));
// ["hello", "world", "foo", "bar"]
```

**FlatMap:** Combina `map` (transformar) + `flat` (achatar um nível).

#### Zip HOF

```typescript
// Zip - combinar dois arrays element-wise
function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const length = Math.min(arr1.length, arr2.length);
  const result: [T, U][] = [];
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  return result;
}

// ZipWith - combinar com função customizada
function zipWith<T, U, R>(
  arr1: T[],
  arr2: U[],
  fn: (a: T, b: U) => R
): R[] {
  const length = Math.min(arr1.length, arr2.length);
  const result: R[] = [];
  for (let i = 0; i < length; i++) {
    result.push(fn(arr1[i], arr2[i]));
  }
  return result;
}

// Uso
const names = ["Alice", "Bob", "Charlie"];
const ages = [30, 25, 35];

const pairs = zip(names, ages);
// [["Alice", 30], ["Bob", 25], ["Charlie", 35]]

const descriptions = zipWith(names, ages, (name, age) => `${name} is ${age}`);
// ["Alice is 30", "Bob is 25", "Charlie is 35"]
```

**Zip:** Combina arrays **element-wise** - para em menor length.

### Partition HOF

```typescript
// Partition - dividir array em dois baseado em predicate
function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  
  for (const item of arr) {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  
  return [truthy, falsy];
}

// Uso
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const [evens, odds] = partition(numbers, n => n % 2 === 0);
console.log(evens);  // [2, 4, 6, 8, 10]
console.log(odds);   // [1, 3, 5, 7, 9]
```

**Partition:** Retorna **tupla** - `[elementos que satisfazem, elementos que não satisfazem]`.

#### GroupBy HOF

```typescript
// GroupBy - agrupar por chave
function groupBy<T, K extends string | number>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  
  for (const item of arr) {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  
  return groups;
}

// Uso
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Book", category: "Education", price: 20 },
  { id: 2, name: "Pen", category: "Stationery", price: 5 },
  { id: 3, name: "Notebook", category: "Education", price: 15 },
  { id: 4, name: "Pencil", category: "Stationery", price: 2 }
];

const byCategory = groupBy(products, p => p.category);
console.log(byCategory);
// {
//   Education: [{ id: 1, ... }, { id: 3, ... }],
//   Stationery: [{ id: 2, ... }, { id: 4, ... }]
// }
```

**GroupBy:** Cria **objeto** com arrays agrupados por chave.

### Memoize HOF

```typescript
// Memoize - cache results
function memoize<T extends any[], R>(
  fn: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key)!;
    }
    
    console.log("Computing...");
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Uso
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log(memoizedFib(10));  // Computing... 55
console.log(memoizedFib(10));  // Cache hit! 55
```

**Memoize:** HOF que retorna **versão cached** da função - otimização.

#### Throttle/Debounce HOFs

```typescript
// Throttle - limitar frequência de execução
function throttle<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let lastCall = 0;
  
  return (...args: T) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

// Debounce - atrasar execução até silêncio
function debounce<T extends any[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Uso
const handleScroll = throttle(() => {
  console.log("Scrolling...");
}, 1000);  // Max 1x por segundo

const handleInput = debounce((value: string) => {
  console.log("Search:", value);
}, 500);  // Espera 500ms de silêncio
```

**Throttle:** Executa no **máximo** a cada X ms
**Debounce:** Executa após X ms de **silêncio**

### Retry HOF

```typescript
// Retry - tentar novamente em caso de erro
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delay: number
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();  // Sucesso - retorna
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;  // Última tentativa - propaga erro
      }
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Should not reach here");
}

// Uso
const unstableFetch = async () => {
  if (Math.random() < 0.7) {
    throw new Error("Network error");
  }
  return "Success!";
};

const result = await retry(unstableFetch, 5, 1000);
console.log(result);  // "Success!" após algumas tentativas
```

**Retry:** HOF para **async functions** - tenta novamente em caso de falha.

#### Tap/Pipe HOF

```typescript
// Tap - executar side effect sem modificar valor
function tap<T>(fn: (value: T) => void): (value: T) => T {
  return (value: T) => {
    fn(value);  // Side effect
    return value;  // Retorna valor inalterado
  };
}

// Uso com pipe
const transform = pipe(
  (n: number) => n + 1,
  tap((n) => console.log("After add:", n)),  // Log sem modificar
  (n: number) => n * 2,
  tap((n) => console.log("After multiply:", n)),
  (n: number) => n ** 2
);

console.log(transform(2));
// Output:
// After add: 3
// After multiply: 6
// 36
```

**Tap:** Permite **side effects** (log, debug) em pipeline sem modificar valor.

### Type-Safe Pipe (Variadic)

```typescript
// Pipe type-safe para arbitrary number de funções
type PipeFn<T, R> = (arg: T) => R;

function pipe<A, B>(fn1: PipeFn<A, B>): PipeFn<A, B>;
function pipe<A, B, C>(fn1: PipeFn<A, B>, fn2: PipeFn<B, C>): PipeFn<A, C>;
function pipe<A, B, C, D>(fn1: PipeFn<A, B>, fn2: PipeFn<B, C>, fn3: PipeFn<C, D>): PipeFn<A, D>;
// ... mais overloads

function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Uso - type-safe em cada estágio
const transform = pipe(
  (n: number) => n + 1,      // number → number
  (n: number) => `${n}`,     // number → string
  (s: string) => s.length    // string → number
);

const result = transform(99);
// Type: number (inferido corretamente)
```

**Overloads:** Múltiplas assinaturas garantem type safety em cada estágio.

## 🎯 Aplicabilidade e Contextos

### Data Transformation

```typescript
const users = getUsers()
  .filter(u => u.active)
  .map(u => ({ id: u.id, name: u.name }));
```

**Raciocínio:** HOFs para transformar dados declarativamente.

### Function Composition

```typescript
const process = pipe(validate, transform, save);
```

**Raciocínio:** Combinar funções pequenas em pipeline complexo.

### Performance Optimization

```typescript
const cached = memoize(expensiveFunction);
```

**Raciocínio:** Memoize para evitar recomputação.

## ⚠️ Limitações e Considerações Teóricas

### Type Complexity

```typescript
// Tipos complexos com muitos generics
type Pipe10<A, B, C, D, E, F, G, H, I, J, K> = ...
```

**Limitação:** Overloads têm limite - types verbosos.

### Performance Overhead

```typescript
// Criar closure a cada call - overhead
const cached = memoize(fn);
```

**Consideração:** HOFs têm overhead - avaliar performance-critical code.

### Debugging Difficulty

```typescript
// Stack traces com HOFs - menos claros
const result = pipe(fn1, fn2, fn3, fn4)(input);
```

**Consideração:** Debugging pipelines complexos é harder.

## 🔗 Interconexões Conceituais

**Relação com Functional Programming:** HOFs são fundamento de FP.

**Relação com Closures:** HOFs retornam closures.

**Relação com Generics:** HOFs usam generics para type safety.

**Relação com Composition:** HOFs permitem composição declarativa.

**Relação com Immutability:** HOFs promovem transformações imutáveis.

## 🚀 Evolução e Próximos Conceitos

Dominar HOFs tipadas prepara para:
- **Map/Filter/Reduce:** Métodos de array fundamentais
- **Functional Composition:** Técnicas avançadas
- **Monads e Functors:** Abstrações de FP
- **Reactive Programming:** RxJS e observables
