# Type Safety em Composição

## 🎯 Introdução e Definição

### Definição Conceitual

**Type safety em composição** refere-se à capacidade do TypeScript de **validar compatibilidade de tipos** entre funções compostas, garantindo que **output de uma função** seja **compatível com input da próxima**. Diferentemente de JavaScript puro onde erros aparecem em runtime, TypeScript detecta **incompatibilidades de tipos em compile-time**, prevenindo bugs antes de código executar.

Conceitualmente, type safety em composição implementa **type flow validation** - tipos "fluem" através de pipeline de funções, TypeScript verifica cada etapa. Quando compondo `pipe(f, g, h)`, TypeScript garante que tipo de retorno de `f` é compatível com parâmetro de `g`, e tipo de retorno de `g` é compatível com parâmetro de `h`. Violações são **compile-time errors**.

**Fundamento teórico:** Type safety em composição deriva de **type theory** - funções têm **signatures** (`A → B`), composição requer que **output type** de uma função seja **subtype** (ou igual) ao **input type** da próxima. TypeScript usa **type inference** para deduzir tipos automaticamente, e **generic constraints** para garantir compatibilidade.

**Pattern fundamental:**
```
f: A → B
g: B → C
compose(g, f): A → C  // Type-safe se B compatível
```

### Contexto Histórico e Evolução

**ML (1973):** Primeira linguagem com type inference.

```ml
(* ML - type inference *)
fun compose f g x = f (g x)
(* Type: ('b -> 'c) -> ('a -> 'b) -> 'a -> 'c *)
```

**Haskell (1990):** Type classes e type inference avançado.

```haskell
-- Haskell - type-safe composition
(.) :: (b -> c) -> (a -> b) -> a -> c
(f . g) x = f (g x)

-- Type inference automático
addOne :: Int -> Int
addOne x = x + 1

double :: Int -> Int
double x = x * 2

composed :: Int -> Int
composed = double . addOne
-- Type inferido automaticamente
```

**TypeScript 0.8 (2012):** Type inference básico.

```typescript
// TypeScript 0.8 - type annotations manuais
function compose(f: Function, g: Function): Function {
  return function(x: any): any {
    return f(g(x));
  };
}
// Sem type safety real ❌
```

**TypeScript 1.0 (2014):** Generics introduzidos.

```typescript
// TypeScript 1.0 - generics
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}
// Type safety básico ✅
```

**TypeScript 2.0 (2016):** Type inference aprimorado.

```typescript
// TypeScript 2.0 - melhor inference
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;

const composed = compose(double, addOne);
// Type inferido: (n: number) => number ✅
```

**TypeScript 3.0 (2018):** Rest parameters com tuples.

```typescript
// TypeScript 3.0 - rest/spread com tuples
function pipe<A, B, C>(
  f: (a: A) => B,
  g: (b: B) => C
): (a: A) => C {
  return (a: A) => g(f(a));
}
```

**TypeScript 4.0 (2020):** **Variadic tuple types**.

```typescript
// TypeScript 4.0 - variadic tuples
type Pipe<Fns extends Array<(arg: any) => any>> = 
  Fns extends [infer F1, infer F2, ...infer Rest]
    ? F1 extends (a: infer A) => infer B
      ? F2 extends (b: B) => infer C
        ? Rest extends Array<(arg: any) => any>
          ? Pipe<[(a: A) => C, ...Rest]>
          : (a: A) => C
        : never
      : never
    : Fns extends [(a: infer A) => infer B]
      ? (a: A) => B
      : never;

// Type-safe pipe com N funções ✅
```

**TypeScript 4.1+ (2020+):** Template literal types, recursive types.

```typescript
// TypeScript 4.1+ - tipos recursivos avançados
type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;
type First<T extends any[]> = T extends [infer F, ...infer _] ? F : never;
```

**Evolução de práticas:**

**Era pré-generics:**
```typescript
// Sem type safety
function compose(f: Function, g: Function): Function { ... }
```

**Era generics:**
```typescript
// Type safety com generics
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C { ... }
```

**Era variadic tuples:**
```typescript
// Type safety com N funções
function pipe<T extends Array<(arg: any) => any>>(...fns: T): Pipe<T> { ... }
```

### Problema Fundamental que Resolve

Type safety em composição resolve problemas de **incompatibilidade de tipos**, **bugs em runtime**, e **falta de garantias**.

**Problema 1: Incompatibilidade de tipos em runtime**
```typescript
// JavaScript - erro apenas em runtime
const addOne = n => n + 1;
const toUpperCase = str => str.toUpperCase();

// Composição inválida - não detectada
const invalid = pipe(addOne, toUpperCase);

invalid(5);  // Runtime error: number.toUpperCase is not a function ❌
```

**Solução: TypeScript detecta em compile-time**
```typescript
// TypeScript - erro em compile-time
const addOne = (n: number) => n + 1;
const toUpperCase = (str: string) => str.toUpperCase();

const invalid = pipe(addOne, toUpperCase);
// Error: Type 'number' is not assignable to type 'string' ✅
// Não compila - erro detectado antes de executar
```

**Problema 2: Tipos perdidos em composição**
```typescript
// Sem generics - tipos perdidos
function composeAny(f: Function, g: Function): Function {
  return (x: any) => f(g(x));
}

const result = composeAny(someFunc, otherFunc);
// Type: Function - nenhuma informação de tipos ❌
```

**Solução: Generics preservam tipos**
```typescript
// Com generics - tipos preservados
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;

const result = compose(double, addOne);
// Type: (n: number) => number ✅
// Tipos completos preservados
```

**Problema 3: Composições complexas sem validação**
```typescript
// JavaScript - pipeline complexo sem garantias
const process = pipe(
  parseJSON,
  extractData,
  transformData,
  validateResult,
  saveToDatabase
);

// Nenhuma garantia de compatibilidade entre etapas ❌
```

**Solução: TypeScript valida cada etapa**
```typescript
// TypeScript - cada etapa validada
const parseJSON: (str: string) => Data;
const extractData: (data: Data) => RelevantData;
const transformData: (data: RelevantData) => TransformedData;
const validateResult: (data: TransformedData) => ValidData;
const saveToDatabase: (data: ValidData) => Promise<void>;

const process = pipe(
  parseJSON,
  extractData,
  transformData,
  validateResult,
  saveToDatabase
);
// Type: (str: string) => Promise<void>
// Todos tipos validados ✅
```

**Fundamento teórico:** Type safety **previne bugs** - erros detectados em compile-time ao invés de runtime.

### Importância no Ecossistema

Type safety em composição é crucial porque:

- **Bug Prevention:** Detectar erros antes de executar código
- **Refactoring Safety:** Mudanças de tipos detectadas automaticamente
- **Documentation:** Tipos servem como documentação viva
- **IDE Support:** Autocomplete, IntelliSense funcionam corretamente
- **Confidence:** Confiança de que composição é válida
- **Maintainability:** Mudanças seguras em funções componentes
- **Type Inference:** Dedução automática de tipos complexos
- **Compile-time Validation:** Validação sem overhead de runtime

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Type Compatibility:** Output de função compatível com input da próxima
2. **Type Inference:** TypeScript deduz tipos automaticamente
3. **Generic Constraints:** Garantir compatibilidade via generics
4. **Compile-time Validation:** Erros detectados em compile-time
5. **Type Flow:** Tipos fluem através de pipeline

### Pilares Fundamentais

- **Generics:** Parametrizar tipos em composição
- **Type Parameters:** `<A, B, C>` representam tipos
- **Constraints:** `extends` para restringir tipos
- **Inference:** Dedução automática de tipos
- **Signatures:** Tipos de função preservados

### Visão Geral das Nuances

- **Variadic Generics:** Composição com N funções
- **Conditional Types:** Tipos baseados em condições
- **Mapped Types:** Transformar tipos
- **Template Literals:** Tipos de strings literais
- **Recursive Types:** Tipos que referenciam si mesmos

## 🧠 Fundamentos Teóricos

### Basic Type-safe Compose

```typescript
// Compose type-safe básico
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Funções tipadas
const addOne = (n: number): number => n + 1;
const toString = (n: number): string => n.toString();

// Composição type-safe
const transform = compose(toString, addOne);
// Type: (n: number) => string

console.log(transform(5));  // "6"

// Tentativa inválida detectada
const invalid = compose(addOne, toString);
// Error: Type 'string' is not assignable to type 'number' ✅
```

**Type Flow:** `number → number → string` - validado em compile-time.

### Type Inference in Composition

```typescript
// Type inference automático

// Funções sem type annotations explícitas
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

// Composição - tipos inferidos
const transform = compose(square, double);
// Type inferido: (n: number) => number

// TypeScript deduz:
// double: number → number
// square: number → number
// compose(square, double): number → number
```

**Inference:** TypeScript **deduz tipos** automaticamente - menos annotations necessárias.

### Variadic Type-safe Pipe

```typescript
// Pipe type-safe com 3 funções
function pipe3<A, B, C, D>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D
): (a: A) => D {
  return (a: A) => f3(f2(f1(a)));
}

// Uso
const trim = (s: string) => s.trim();
const toUpper = (s: string) => s.toUpperCase();
const exclaim = (s: string) => `${s}!`;

const transform = pipe3(trim, toUpper, exclaim);
// Type: (s: string) => string

console.log(transform("  hello  "));  // "HELLO!"
```

**Type Safety:** Cada etapa validada - `string → string → string → string`.

### Princípios e Conceitos Subjacentes

#### Generic Constraints

```typescript
// Constraints para garantir propriedades

interface HasLength {
  length: number;
}

// Função que requer length
function getLength<T extends HasLength>(value: T): number {
  return value.length;
}

// Composição com constraint
function compose<A extends HasLength, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Uso
const lengthToString = (n: number) => n.toString();
const transform = compose(lengthToString, getLength);
// Type: (a: HasLength) => string

console.log(transform("hello"));  // "5"
console.log(transform([1, 2, 3]));  // "3"
```

**Constraints:** `extends` garante tipo tem propriedades necessárias.

#### Type Guards in Composition

```typescript
// Type guards preservam type narrowing

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

// Composição com type guards
function processIfString(value: unknown): string | null {
  if (isString(value)) {
    return value.toUpperCase();  // Type narrowed to string
  }
  return null;
}

function processIfNumber(value: unknown): number | null {
  if (isNumber(value)) {
    return value * 2;  // Type narrowed to number
  }
  return null;
}
```

**Type Guards:** Preservam **type narrowing** em composição.

### Discriminated Unions

```typescript
// Discriminated unions type-safe

type Result<T> = 
  | { type: "success"; value: T }
  | { type: "error"; error: string };

// Funções que retornam Result
function parseNumber(str: string): Result<number> {
  const parsed = parseInt(str, 10);
  return isNaN(parsed)
    ? { type: "error", error: "Invalid number" }
    : { type: "success", value: parsed };
}

function isPositive(n: number): Result<number> {
  return n > 0
    ? { type: "success", value: n }
    : { type: "error", error: "Not positive" };
}

function squareRoot(n: number): Result<number> {
  return { type: "success", value: Math.sqrt(n) };
}

// Composição com Result
function composeResult<A, B, C>(
  f: (b: B) => Result<C>,
  g: (a: A) => Result<B>
): (a: A) => Result<C> {
  return (a: A) => {
    const result = g(a);
    if (result.type === "error") return result;
    return f(result.value);
  };
}

// Pipeline
const process = composeResult(
  composeResult(squareRoot, isPositive),
  parseNumber
);

console.log(process("16"));   // { type: "success", value: 4 }
console.log(process("-4"));   // { type: "error", error: "Not positive" }
console.log(process("abc"));  // { type: "error", error: "Invalid number" }
```

**Discriminated Unions:** Type-safe error handling em composição.

#### Conditional Types

```typescript
// Conditional types em composição

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Compose que unwrap promises automaticamente
function composeAsync<A, B extends Promise<any> | any, C>(
  f: (b: UnwrapPromise<B>) => C,
  g: (a: A) => B
): (a: A) => B extends Promise<any> ? Promise<C> : C {
  return ((a: A) => {
    const result = g(a);
    if (result instanceof Promise) {
      return result.then(f) as any;
    }
    return f(result as UnwrapPromise<B>) as any;
  }) as any;
}

// Uso
const syncFn = (n: number) => n + 1;
const asyncFn = async (n: number) => n * 2;

const composed1 = composeAsync(syncFn, syncFn);
// Type: (n: number) => number

const composed2 = composeAsync(syncFn, asyncFn);
// Type: (n: number) => Promise<number>
```

**Conditional Types:** Tipos baseados em **condições** - sync vs async.

### Mapped Types

```typescript
// Mapped types em composição

type MapToPromise<T> = {
  [K in keyof T]: Promise<T[K]>
};

type UnwrapPromises<T> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K]
};

// Exemplo
interface User {
  id: number;
  name: string;
  email: string;
}

type AsyncUser = MapToPromise<User>;
// {
//   id: Promise<number>;
//   name: Promise<string>;
//   email: Promise<string>;
// }

type SyncUser = UnwrapPromises<AsyncUser>;
// {
//   id: number;
//   name: string;
//   email: string;
// }
```

**Mapped Types:** Transformar **estrutura de tipos** em composição.

### Variadic Tuple Types

```typescript
// Variadic tuples para pipe type-safe com N funções

type Pipe<Fns extends Array<(arg: any) => any>> = 
  Fns extends [infer F1, infer F2, ...infer Rest]
    ? F1 extends (a: infer A) => infer B
      ? F2 extends (b: B) => infer C
        ? Rest extends Array<(arg: any) => any>
          ? Pipe<[(a: A) => C, ...Rest]>
          : (a: A) => C
        : never
      : never
    : Fns extends [(a: infer A) => infer B]
      ? (a: A) => B
      : never;

function pipe<Fns extends Array<(arg: any) => any>>(
  ...fns: Fns
): Pipe<Fns> {
  return ((arg: any) => fns.reduce((acc, fn) => fn(acc), arg)) as Pipe<Fns>;
}

// Uso
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const toString = (n: number) => n.toString();
const exclaim = (s: string) => `${s}!`;

// Type-safe com N funções
const transform = pipe(addOne, double, toString, exclaim);
// Type: (n: number) => string

console.log(transform(5));  // "12!"
```

**Variadic Tuples:** Type safety com **arbitrary number** de funções.

### Modelo Mental para Compreensão

Pense em type safety como **inspeção em linha de montagem**:

**Funções:** Estações de trabalho com requisitos específicos
- "Estação 1 aceita metal, produz chassi"
- "Estação 2 aceita chassi, produz carroceria pintada"
- "Estação 3 aceita carroceria, produz carro completo"

**Type Safety:** Inspetor verificando compatibilidade
- "Output de Estação 1 (chassi) compatível com input de Estação 2? ✓"
- "Output de Estação 2 (carroceria) compatível com input de Estação 3? ✓"
- "Se incompatível, linha para antes de começar produção"

**Compile-time:** Inspeção antes de iniciar produção
- Runtime: Descobrir incompatibilidade durante produção (tarde demais)
- Compile-time: Descobrir incompatibilidade no planejamento (prevenir)

**Analogia - Pipeline de Água:**

**Funções:** Conexões com diâmetros específicos
- "Tubo 1: entrada 2cm, saída 1.5cm"
- "Tubo 2: entrada 1.5cm, saída 1cm"
- "Tubo 3: entrada 1cm, saída 0.5cm"

**Type Safety:** Verificar se conexões encaixam
- "Saída de Tubo 1 (1.5cm) encaixa em entrada de Tubo 2 (1.5cm)? ✓"
- "Se não encaixar, detectar antes de instalar sistema"

**Type Flow:**
```
Input: A
  ↓
Função 1: A → B
  ↓ B
Função 2: B → C
  ↓ C
Função 3: C → D
  ↓
Output: D

TypeScript verifica: B compatível? C compatível? D compatível?
```

## 🔍 Análise Conceitual Profunda

### Type Inference Deep Dive

```typescript
// Type inference sofisticado

// TypeScript infere tipos complexos
const addOne = (n: number) => n + 1;
const toString = (n: number) => String(n);
const length = (s: string) => s.length;
const isEven = (n: number) => n % 2 === 0;

const pipeline = pipe(addOne, toString, length, isEven);
// Type inferido: (n: number) => boolean

// Flow de tipos inferido:
// addOne: number → number
// toString: number → string
// length: string → number
// isEven: number → boolean
// Resultado: number → boolean
```

**Inference:** TypeScript **deduz type flow** completo automaticamente.

#### Generic Type Parameters

```typescript
// Generic type parameters avançados

function map<T, U>(fn: (item: T) => U): (arr: T[]) => U[] {
  return (arr: T[]) => arr.map(fn);
}

function filter<T>(predicate: (item: T) => boolean): (arr: T[]) => T[] {
  return (arr: T[]) => arr.filter(predicate);
}

function reduce<T, U>(
  reducer: (acc: U, item: T) => U,
  initial: U
): (arr: T[]) => U {
  return (arr: T[]) => arr.reduce(reducer, initial);
}

// Composição type-safe
const isEven = (n: number) => n % 2 === 0;
const double = (n: number) => n * 2;
const sum = (acc: number, n: number) => acc + n;

const process = pipe(
  filter(isEven),         // number[] → number[]
  map(double),            // number[] → number[]
  reduce(sum, 0)          // number[] → number
);
// Type: (arr: number[]) => number

const numbers = [1, 2, 3, 4, 5];
console.log(process(numbers));  // 12
```

**Generic Parameters:** `<T, U>` parametrizam tipos para **reusabilidade**.

### Overloaded Pipe Types

```typescript
// Pipe com overloads para diferentes arities

function pipe<A, B>(
  f1: (a: A) => B
): (a: A) => B;

function pipe<A, B, C>(
  f1: (a: A) => B,
  f2: (b: B) => C
): (a: A) => C;

function pipe<A, B, C, D>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D
): (a: A) => D;

function pipe<A, B, C, D, E>(
  f1: (a: A) => B,
  f2: (b: B) => C,
  f3: (c: C) => D,
  f4: (d: D) => E
): (a: A) => E;

function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Uso - types corretos para cada arity
const p1 = pipe((n: number) => n + 1);
// Type: (n: number) => number

const p2 = pipe((n: number) => n + 1, (n: number) => String(n));
// Type: (n: number) => string

const p3 = pipe(
  (n: number) => n + 1,
  (n: number) => String(n),
  (s: string) => s.length
);
// Type: (n: number) => number
```

**Overloads:** Diferentes **signatures** para diferentes números de funções.

#### Async Type Safety

```typescript
// Type safety com async functions

type AsyncFn<T, U> = (value: T) => Promise<U>;
type SyncOrAsync<T, U> = (value: T) => U | Promise<U>;

// Compose async type-safe
function composeAsync<A, B, C>(
  f: AsyncFn<B, C> | ((b: B) => C),
  g: AsyncFn<A, B> | ((a: A) => B)
): AsyncFn<A, C> {
  return async (a: A) => {
    const b = await g(a);
    return f(b);
  };
}

// Uso
const fetchUser = async (id: number): Promise<User> => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

const enrichUser = async (user: User): Promise<EnrichedUser> => {
  const posts = await fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
  return { ...user, posts };
};

const saveUser = async (user: EnrichedUser): Promise<void> => {
  await fetch("/api/enriched-users", {
    method: "POST",
    body: JSON.stringify(user)
  });
};

// Type-safe async composition
const process = composeAsync(
  composeAsync(saveUser, enrichUser),
  fetchUser
);
// Type: AsyncFn<number, void>

await process(123);
```

**Async Type Safety:** Tipos preservados através de **async boundaries**.

### Type Errors Examples

```typescript
// Exemplos de erros de tipo detectados

const addOne = (n: number) => n + 1;
const toUpper = (s: string) => s.toUpperCase();
const length = (s: string) => s.length;

// Erro: number não é string
const invalid1 = pipe(addOne, toUpper);
// Error: Argument of type '(n: number) => number' is not assignable to
// parameter of type '(a: string) => any'.

// Erro: string não é number
const invalid2 = pipe(toUpper, addOne);
// Error: Argument of type '(s: string) => string' is not assignable to
// parameter of type '(a: number) => any'.

// Válido - tipos compatíveis
const valid = pipe(
  addOne,    // number → number
  (n: number) => String(n),  // number → string
  length     // string → number
);
// Type: (n: number) => number ✅
```

**Error Detection:** TypeScript detecta **incompatibilidades** imediatamente.

#### Narrow Types Composition

```typescript
// Composição com narrow types

type Even = number & { readonly __brand: "Even" };
type Positive = number & { readonly __brand: "Positive" };

function isEven(n: number): n is Even {
  return n % 2 === 0;
}

function isPositive(n: number): n is Positive {
  return n > 0;
}

function assertEven(n: number): Even {
  if (!isEven(n)) throw new Error("Not even");
  return n as Even;
}

function assertPositive(n: number): Positive {
  if (!isPositive(n)) throw new Error("Not positive");
  return n as Positive;
}

// Composição type-safe com assertions
function processEvenPositive(n: number): number {
  const even = assertEven(n);          // number → Even
  const positive = assertPositive(even);  // Even → Positive (Even ⊆ number)
  return positive;
}
```

**Narrow Types:** Composição preserva **type narrowing**.

### Union Types in Composition

```typescript
// Union types em composição

type StringOrNumber = string | number;

function toString(value: StringOrNumber): string {
  return typeof value === "string" ? value : String(value);
}

function toUpperCase(str: string): string {
  return str.toUpperCase();
}

// Composição type-safe com unions
const transform = pipe(toString, toUpperCase);
// Type: (value: StringOrNumber) => string

console.log(transform(123));      // "123"
console.log(transform("hello"));  // "HELLO"
```

**Union Types:** TypeScript valida **union compatibility**.

#### Intersection Types

```typescript
// Intersection types em composição

interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

type User = HasId & HasName;

function addTimestamp<T>(obj: T): T & { timestamp: number } {
  return { ...obj, timestamp: Date.now() };
}

function addMetadata<T>(obj: T): T & { metadata: { version: number } } {
  return { ...obj, metadata: { version: 1 } };
}

// Composição acumula intersection types
const transform = pipe(addTimestamp, addMetadata);
// Type: <T>(obj: T) => T & { timestamp: number } & { metadata: { version: number } }

const user: User = { id: 1, name: "Alice" };
const enriched = transform(user);
// Type: User & { timestamp: number } & { metadata: { version: number } }

console.log(enriched.id);               // 1
console.log(enriched.name);             // "Alice"
console.log(enriched.timestamp);        // 1234567890
console.log(enriched.metadata.version); // 1
```

**Intersection Types:** Composição **acumula** propriedades.

### Type Aliases vs Interfaces

```typescript
// Type aliases vs interfaces em composição

// Type alias
type TransformFn<T, U> = (value: T) => U;

// Interface
interface ITransformFn<T, U> {
  (value: T): U;
}

// Ambos funcionam em composição
function compose1<A, B, C>(
  f: TransformFn<B, C>,
  g: TransformFn<A, B>
): TransformFn<A, C> {
  return (a: A) => f(g(a));
}

function compose2<A, B, C>(
  f: ITransformFn<B, C>,
  g: ITransformFn<A, B>
): ITransformFn<A, C> {
  return (a: A) => f(g(a));
}

// Type aliases são mais comuns para function types
```

**Preference:** Type aliases mais comuns para **function types**.

### Branded Types

```typescript
// Branded types para type safety extra

type Brand<K, T> = K & { __brand: T };

type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

const toUserId = (n: number): UserId => n as UserId;
const toProductId = (n: number): ProductId => n as ProductId;

function fetchUser(id: UserId): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

function fetchProduct(id: ProductId): Promise<Product> {
  return fetch(`/api/products/${id}`).then(r => r.json());
}

// Type safety previne confusão
const userId = toUserId(123);
const productId = toProductId(456);

fetchUser(userId);      // ✓ Válido
fetchUser(productId);   // ✗ Error: ProductId não é UserId
```

**Branded Types:** Prevenir **confusion** entre tipos nominalmente diferentes.

## 🎯 Aplicabilidade e Contextos

### API Response Processing

```typescript
const process = pipe(parseJSON, validate, transform);
// Type: (str: string) => ProcessedData
```

**Raciocínio:** Type safety garante cada etapa compatível.

### Data Transformations

```typescript
const transform = pipe(filter(predicate), map(fn), reduce(reducer));
// Type: (arr: T[]) => U
```

**Raciocínio:** Generics preservam tipos através de pipeline.

### Form Validation

```typescript
const validate = pipe(trim, validateEmail, checkDomain);
// Type: (input: string) => ValidationResult
```

**Raciocínio:** Type safety garante retorno consistente.

## ⚠️ Limitações e Considerações Teóricas

### Type Inference Limits

```typescript
// Pipes muito longos - TypeScript pode perder tipos
const result = pipe(f1, f2, f3, f4, f5, f6, f7, f8, f9, f10);
```

**Limitação:** TypeScript tem **recursion limit** - pipes muito longos podem perder tipos.

### Any Type Escape Hatch

```typescript
// `any` quebra type safety
const unsafeCompose = (f: any, g: any) => (x: any) => f(g(x));
```

**Consideração:** Evitar `any` - quebra garantias de tipo.

### Runtime vs Compile-time

```typescript
// TypeScript não valida em runtime
const result = pipe(fn1, fn2)(input as any);
```

**Consideração:** Type safety é **compile-time only** - runtime precisa validação separada.

## 🔗 Interconexões Conceituais

**Relação com Generics:** Base de type safety em composição.

**Relação com Type Inference:** TypeScript deduz tipos automaticamente.

**Relação com Type Guards:** Preservar narrowing em composição.

**Relação com Conditional Types:** Tipos baseados em condições.

**Relação com Variadic Tuples:** Type safety com N funções.

## 🚀 Evolução e Próximos Conceitos

Dominar type safety em composição prepara para:
- **Advanced Types:** Mapped, conditional, template literal types
- **Type-level Programming:** Computações no sistema de tipos
- **Dependent Types:** Tipos que dependem de valores
- **Proof Systems:** Provar propriedades em compile-time
