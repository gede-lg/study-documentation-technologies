# Combinar Múltiplas Funções

## 🎯 Introdução e Definição

### Definição Conceitual

**Combinar múltiplas funções** refere-se à técnica de **criar função composta** a partir de múltiplas funções menores, onde **saída de uma função** torna-se **entrada da próxima**. Diferentemente de chamar funções sequencialmente com variáveis intermediárias, composição cria **single function** que encapsula toda transformação. TypeScript garante **type safety** - tipos entre funções devem ser compatíveis.

Conceitualmente, composição de funções implementa **pipeline pattern** - dados fluem através de sequência de transformações. Cada função é **pura** e **focada** - faz uma coisa bem. Composição combina funções simples em **transformações complexas** de forma **declarativa** e **reutilizável**.

**Fundamento teórico:** Composição de funções deriva de **matemática** - `(f ∘ g)(x) = f(g(x))`. Função composta aplica `g` primeiro, depois `f` ao resultado. Em programação funcional, composição é **fundamental** - permite construir programas complexos a partir de **building blocks** simples e testáveis.

**Pattern básico:**
```
compose(f, g)(x) = f(g(x))
pipe(g, f)(x) = f(g(x))
```

### Contexto Histórico e Evolução

**Matemática (Séculos):** Composição de funções - notação `f ∘ g`.

```
(f ∘ g)(x) = f(g(x))

Exemplo:
f(x) = x²
g(x) = x + 1
(f ∘ g)(3) = f(g(3)) = f(4) = 16
```

**Lambda Calculus (1930s - Alonzo Church):** Fundamento teórico.

```
λx.f(g(x))
```

**Haskell (1990):** Operador de composição nativo `.`

```haskell
-- Haskell - operador (.)
(.) :: (b -> c) -> (a -> b) -> a -> c
(f . g) x = f (g x)

-- Uso
addOne x = x + 1
double x = x * 2
square x = x * x

-- Composição
composed = square . double . addOne
composed 3  -- ((3 + 1) * 2)^2 = 64
```

**F# (2005):** Operadores `>>` (pipe forward) e `<<` (compose).

```fsharp
// F# - pipe e compose
let addOne x = x + 1
let double x = x * 2
let square x = x * x

// Compose (<<) - direita para esquerda
let composed = square << double << addOne
composed 3  // 64

// Pipe (>>) - esquerda para direita  
let piped = addOne >> double >> square
piped 3  // 64
```

**Underscore.js (2009):** `_.compose()` em JavaScript.

```javascript
// Underscore - compose
var composed = _.compose(square, double, addOne);
composed(3);  // 64
```

**Ramda.js (2013):** Foco em composição funcional.

```javascript
// Ramda - compose e pipe
import { compose, pipe } from 'ramda';

const composed = compose(square, double, addOne);
const piped = pipe(addOne, double, square);

composed(3);  // 64
piped(3);     // 64
```

**Lodash/fp (2014):** Versão funcional com auto-currying.

```javascript
// Lodash/fp - composição
import { flow, flowRight } from 'lodash/fp';

const composed = flowRight(square, double, addOne);
const piped = flow(addOne, double, square);
```

**TypeScript 1.0 (2012):** Composição tipada manualmente.

```typescript
// TypeScript - compose tipado
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}
```

**TypeScript 4.0 (2020):** **Variadic tuple types** - composição genérica.

```typescript
// Variadic tuples para composição flexível
type Compose<Fns extends Array<(arg: any) => any>> = 
  Fns extends [infer F1, infer F2, ...infer Rest]
    ? F1 extends (a: infer A) => infer B
      ? F2 extends (b: B) => infer C
        ? Rest extends Array<(arg: any) => any>
          ? Compose<[(a: A) => C, ...Rest]>
          : (a: A) => C
        : never
      : never
    : Fns extends [(a: infer A) => infer B]
      ? (a: A) => B
      : never;
```

**Evolução de práticas:**

**Era Imperativa:**
```javascript
// Imperativo - variáveis intermediárias
const step1 = addOne(3);
const step2 = double(step1);
const result = square(step2);
```

**Era Funcional:**
```typescript
// Funcional - composição
const transform = pipe(addOne, double, square);
const result = transform(3);
```

### Problema Fundamental que Resolve

Combinar múltiplas funções resolve problemas de **código verboso**, **variáveis intermediárias desnecessárias**, e **falta de reutilização**.

**Problema 1: Variáveis intermediárias**
```typescript
// Sem composição - variáveis intermediárias
function processData(input: string): string {
  const trimmed = input.trim();
  const lowercase = trimmed.toLowerCase();
  const noSpaces = lowercase.replace(/\s+/g, "");
  const prefixed = `processed_${noSpaces}`;
  return prefixed;
}

// Variáveis temporárias poluem escopo ❌
```

**Solução: Composição elimina intermediários**
```typescript
// Composição - sem variáveis intermediárias
const trim = (str: string) => str.trim();
const toLowerCase = (str: string) => str.toLowerCase();
const removeSpaces = (str: string) => str.replace(/\s+/g, "");
const addPrefix = (str: string) => `processed_${str}`;

const processData = pipe(trim, toLowerCase, removeSpaces, addPrefix);

// Sem variáveis temporárias ✅
const result = processData(" Hello World ");  // "processed_helloworld"
```

**Problema 2: Transformações não reutilizáveis**
```typescript
// Sem composição - lógica inline não reutilizável
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
];

// Transformação inline
const result = users
  .filter(u => u.age >= 18)
  .map(u => u.name)
  .map(n => n.toLowerCase())
  .join(", ");

// Não pode reutilizar ❌
```

**Solução: Composição reutilizável**
```typescript
// Composição - transformações reutilizáveis
const isAdult = (user: User) => user.age >= 18;
const getName = (user: User) => user.name;
const toLowerCase = (str: string) => str.toLowerCase();
const joinWithComma = (arr: string[]) => arr.join(", ");

// Compor transformação reutilizável
const processUsers = pipe(
  filter(isAdult),
  map(getName),
  map(toLowerCase),
  joinWithComma
);

// Reutilizar com diferentes inputs ✅
const result1 = processUsers(users);
const result2 = processUsers(otherUsers);
```

**Problema 3: Difícil expressar fluxo de dados**
```typescript
// Sem composição - fluxo de dados obscuro
function transform(input: number): number {
  return Math.sqrt(Math.abs(input * 2 - 10));
}

// Difícil entender ordem de operações ❌
```

**Solução: Composição expressa fluxo claramente**
```typescript
// Composição - fluxo de dados explícito
const double = (n: number) => n * 2;
const subtract10 = (n: number) => n - 10;
const absolute = (n: number) => Math.abs(n);
const squareRoot = (n: number) => Math.sqrt(n);

const transform = pipe(double, subtract10, absolute, squareRoot);

// Fluxo claro: double → subtract10 → absolute → sqrt ✅
const result = transform(5);  // sqrt(abs((5 * 2) - 10))
```

**Fundamento teórico:** Composição **expressa intenção** - cada função nomeada documenta etapa, ordem clara.

### Importância no Ecossistema

Combinar múltiplas funções é crucial porque:

- **Declarative Code:** Expressar "o que" ao invés de "como"
- **Reusability:** Funções componíveis reutilizáveis
- **Testability:** Funções pequenas fáceis de testar isoladamente
- **Readability:** Fluxo de dados explícito
- **Modularity:** Building blocks independentes
- **Type Safety:** TypeScript valida compatibilidade
- **Maintainability:** Mudanças localizadas
- **Composability:** Compor composições em níveis superiores

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Function Composition:** Combinar funções sequencialmente
2. **Data Flow:** Output de função → Input da próxima
3. **Type Compatibility:** Tipos devem ser compatíveis
4. **Declarative:** Expressar transformação declarativamente
5. **Purity:** Funções puras são componíveis

### Pilares Fundamentais

- **Compose:** Combinar direita → esquerda
- **Pipe:** Combinar esquerda → direita
- **Unary Functions:** Funções com single parameter
- **Type Safety:** TypeScript valida tipos
- **Immutability:** Funções não modificam input

### Visão Geral das Nuances

- **Binary Compose:** Compor duas funções
- **Variadic Compose:** Compor N funções
- **Generic Composition:** Composição com generics
- **Async Composition:** Compor async functions
- **Point-free Style:** Omitir argumentos

## 🧠 Fundamentos Teóricos

### Basic Binary Composition

```typescript
// Composição básica - duas funções
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Funções simples
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;

// Compor
const addOneThenDouble = compose(double, addOne);

console.log(addOneThenDouble(5));  // (5 + 1) * 2 = 12
```

**Análise:**

**Order:** `compose(f, g)` aplica `g` primeiro, depois `f`
**Type flow:** `A → B → C`
**Immutability:** Não modifica argumentos

### Binary Pipe

```typescript
// Pipe - esquerda para direita
function pipe<A, B, C>(
  g: (a: A) => B,
  f: (b: B) => C
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Mesmo resultado, ordem diferente
const addOneThenDouble2 = pipe(addOne, double);

console.log(addOneThenDouble2(5));  // (5 + 1) * 2 = 12
```

**Diferença:** Pipe segue ordem de leitura natural (esquerda → direita).

### Variadic Compose

```typescript
// Compose com número arbitrário de funções
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Uso
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;
const subtract10 = (n: number) => n - 10;

// Compor múltiplas funções
const transform = compose(subtract10, square, double, addOne);

console.log(transform(3));  // (((3 + 1) * 2)^2 - 10) = 54
```

**Variadic:** Aceita **arbitrary number** de funções.

### Princípios e Conceitos Subjacentes

#### Variadic Pipe

```typescript
// Pipe com número arbitrário de funções
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Uso - mais legível
const transform2 = pipe(addOne, double, square, subtract10);

console.log(transform2(3));  // (((3 + 1) * 2)^2 - 10) = 54
```

**Legibilidade:** Pipe é mais legível - fluxo natural.

#### Generic Typed Composition

```typescript
// Composição genérica com tipos explícitos
function composeTyped<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Funções com tipos diferentes
const parseNumber = (str: string): number => parseInt(str, 10);
const isEven = (n: number): boolean => n % 2 === 0;

// Compor - string → number → boolean
const isStringEven = composeTyped(isEven, parseNumber);

console.log(isStringEven("42"));   // true
console.log(isStringEven("13"));   // false
```

**Generic:** Tipos fluem através de composição - `string → number → boolean`.

### String Transformation Pipeline

```typescript
// Pipeline de transformação de strings
const trim = (str: string) => str.trim();
const toLowerCase = (str: string) => str.toLowerCase();
const removeSpaces = (str: string) => str.replace(/\s+/g, "");
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const addPrefix = (prefix: string) => (str: string) => `${prefix}${str}`;

// Diferentes pipelines
const slugify = pipe(trim, toLowerCase, removeSpaces);
const titleize = pipe(trim, toLowerCase, capitalize);
const processWithPrefix = pipe(trim, toLowerCase, addPrefix("processed_"));

// Usar
console.log(slugify(" Hello World "));              // "helloworld"
console.log(titleize(" hello world "));             // "Hello world"
console.log(processWithPrefix(" TypeScript "));     // "processed_typescript"
```

**Pattern:** Pipelines **especializados** para diferentes transformações.

#### Array Transformation Pipeline

```typescript
// Pipeline de transformação de arrays
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const isEven = (n: number) => n % 2 === 0;
const double = (n: number) => n * 2;
const greaterThan5 = (n: number) => n > 5;
const sum = (arr: number[]) => arr.reduce((acc, n) => acc + n, 0);

// Compor transformações
const processNumbers = pipe(
  (arr: number[]) => arr.filter(isEven),
  (arr: number[]) => arr.map(double),
  (arr: number[]) => arr.filter(greaterThan5),
  sum
);

console.log(processNumbers(numbers));  // (2 + 4 + 6 + 8 + 10) * 2 filtrado > 5 = 4 + 8 + 12 + 16 + 20 = 60
```

**Pattern:** Compor **array methods** em pipeline.

### Object Transformation Pipeline

```typescript
// Pipeline de transformação de objetos
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

interface UserDTO {
  identifier: number;
  fullName: string;
  contact: string;
}

// Transformações
const extractRelevantData = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email
});

const renameFields = (data: { id: number; name: string; email: string }): UserDTO => ({
  identifier: data.id,
  fullName: data.name,
  contact: data.email
});

const addTimestamp = (dto: UserDTO) => ({
  ...dto,
  processedAt: new Date().toISOString()
});

// Compor pipeline
const transformUser = pipe(
  extractRelevantData,
  renameFields,
  addTimestamp
);

// Usar
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 25
};

console.log(transformUser(user));
// { identifier: 1, fullName: "Alice", contact: "alice@...", processedAt: "..." }
```

**Pattern:** Compor **object transformations** preservando type safety.

### Conditional Composition

```typescript
// Composição condicional
const conditionalPipe = <T>(
  condition: boolean,
  trueFn: (arg: T) => T,
  falseFn: (arg: T) => T
) => (arg: T) => condition ? trueFn(arg) : falseFn(arg);

// Uso
const isProduction = process.env.NODE_ENV === "production";

const processData = pipe(
  trim,
  toLowerCase,
  conditionalPipe(
    isProduction,
    (str) => str.replace(/debug/gi, ""),  // Production - remove "debug"
    (str) => `[DEBUG] ${str}`              // Development - add prefix
  )
);

console.log(processData(" Hello Debug World "));
// Development: "[DEBUG] hello debug world"
// Production: "hello  world"
```

**Pattern:** **Conditional logic** em composição.

### Modelo Mental para Compreensão

Pense em composição de funções como **fábrica com esteiras**:

**Funções individuais:** Estações de trabalho - cada uma faz operação específica
**Composição:** Esteira conectando estações - produto passa sequencialmente
**Input:** Matéria-prima entrando na primeira estação
**Output:** Produto final saindo da última estação

**Analogia - Linha de Montagem de Carros:**

**Função 1:** Soldar chassi
**Função 2:** Pintar carroceria
**Função 3:** Instalar motor
**Função 4:** Adicionar rodas
**Composição:** Carro passa por todas estações em ordem

**Metáfora - Receita de Bolo:**

**Função 1:** Misturar ingredientes secos
**Função 2:** Adicionar ingredientes líquidos
**Função 3:** Bater massa
**Função 4:** Assar
**Composição:** Receita completa - etapas em ordem

**Fluxo de dados:**
```
Input → Função1 → Intermediário1 → Função2 → Intermediário2 → Função3 → Output
```

**Exemplo concreto:**
```typescript
// Funções (estações)
const wash = (car: string) => `${car} (lavado)`;
const dry = (car: string) => `${car} (seco)`;
const polish = (car: string) => `${car} (polido)`;
const inspect = (car: string) => `${car} (inspecionado)`;

// Composição (esteira)
const carWashProcess = pipe(wash, dry, polish, inspect);

// Input (carro sujo)
const dirtyCar = "Carro sujo";

// Output (carro limpo e inspecionado)
const cleanCar = carWashProcess(dirtyCar);
console.log(cleanCar);
// "Carro sujo (lavado) (seco) (polido) (inspecionado)"
```

## 🔍 Análise Conceitual Profunda

### Compose vs Pipe Direction

```typescript
// Compose - direita para esquerda (matemática)
const composeFlow = compose(step3, step2, step1);
// Executado: step1 → step2 → step3
// Leitura: step3 ← step2 ← step1

// Pipe - esquerda para direita (natural)
const pipeFlow = pipe(step1, step2, step3);
// Executado: step1 → step2 → step3
// Leitura: step1 → step2 → step3
```

**Insight:** Pipe é mais **intuitivo** para programadores - ordem de leitura = ordem de execução.

#### Associativity

```typescript
// Composição é associativa
const f = (n: number) => n + 1;
const g = (n: number) => n * 2;
const h = (n: number) => n - 3;

// Diferentes agrupamentos - mesmo resultado
const composed1 = compose(compose(h, g), f);
const composed2 = compose(h, compose(g, f));

console.log(composed1(5));  // ((5 + 1) * 2) - 3 = 9
console.log(composed2(5));  // ((5 + 1) * 2) - 3 = 9

// Associatividade: (h ∘ g) ∘ f = h ∘ (g ∘ f)
```

**Property:** Composição é **associativa** - agrupamento não importa.

### Identity Function

```typescript
// Função identidade - não transforma input
const identity = <T>(x: T): T => x;

// Identidade é elemento neutro de composição
const f = (n: number) => n * 2;

const composed1 = compose(f, identity);  // f ∘ id = f
const composed2 = compose(identity, f);  // id ∘ f = f

console.log(composed1(5));  // 10
console.log(composed2(5));  // 10
console.log(f(5));          // 10

// Todos equivalentes
```

**Property:** `identity` é **elemento neutro** - compor com identity não muda função.

#### Composing Composed Functions

```typescript
// Compor funções compostas
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;
const subtract10 = (n: number) => n - 10;

// Composições intermediárias
const step1 = pipe(addOne, double);      // (n + 1) * 2
const step2 = pipe(square, subtract10);  // n^2 - 10

// Compor composições
const fullPipeline = pipe(step1, step2);

console.log(fullPipeline(3));  // step1(3) = 8, step2(8) = 64 - 10 = 54
```

**Pattern:** Compor **composições** em níveis superiores.

### Partial Application in Composition

```typescript
// Partial application facilita composição
const multiply = (a: number) => (b: number) => a * b;
const divide = (a: number) => (b: number) => b / a;
const add = (a: number) => (b: number) => a + b;

// Criar funções especializadas via partial
const double = multiply(2);
const divideBy2 = divide(2);
const add10 = add(10);

// Compor funções parciais
const transform = pipe(add10, double, divideBy2);

console.log(transform(5));  // ((5 + 10) * 2) / 2 = 15
```

**Pattern:** Partial application cria funções **prontas para composição**.

#### Tap for Debugging

```typescript
// Tap - executar side effect sem modificar fluxo
const tap = <T>(fn: (value: T) => void) => (value: T): T => {
  fn(value);
  return value;
};

// Usar em composição para debug
const pipeline = pipe(
  addOne,
  tap((n) => console.log("Após addOne:", n)),
  double,
  tap((n) => console.log("Após double:", n)),
  square,
  tap((n) => console.log("Após square:", n))
);

console.log("Resultado final:", pipeline(3));
// Após addOne: 4
// Após double: 8
// Após square: 64
// Resultado final: 64
```

**Pattern:** `tap` permite **debugging** sem quebrar composição.

### Error Handling in Composition

```typescript
// Either monad para error handling
type Either<L, R> = { type: "left"; value: L } | { type: "right"; value: R };

const left = <L, R>(value: L): Either<L, R> => ({ type: "left", value });
const right = <L, R>(value: R): Either<L, R> => ({ type: "right", value });

// Funções que podem falhar
const parseNumber = (str: string): Either<string, number> => {
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? left("Invalid number") : right(parsed);
};

const isPositive = (n: number): Either<string, number> =>
  n > 0 ? right(n) : left("Number must be positive");

const squareRoot = (n: number): Either<string, number> =>
  right(Math.sqrt(n));

// Compor com Either
const composeEither = <A, B, C>(
  f: (b: B) => Either<string, C>,
  g: (a: A) => Either<string, B>
) => (a: A): Either<string, C> => {
  const result = g(a);
  if (result.type === "left") return result;
  return f(result.value);
};

// Pipeline
const processString = composeEither(
  composeEither(squareRoot, isPositive),
  parseNumber
);

console.log(processString("16"));   // { type: "right", value: 4 }
console.log(processString("-4"));   // { type: "left", value: "Number must be positive" }
console.log(processString("abc"));  // { type: "left", value: "Invalid number" }
```

**Pattern:** Either monad para **error handling** em composição.

#### Lens Composition

```typescript
// Lens - getter + setter componíveis
interface Lens<S, A> {
  get: (s: S) => A;
  set: (a: A) => (s: S) => S;
}

const composeLens = <S, A, B>(
  outer: Lens<S, A>,
  inner: Lens<A, B>
): Lens<S, B> => ({
  get: (s: S) => inner.get(outer.get(s)),
  set: (b: B) => (s: S) => outer.set(inner.set(b)(outer.get(s)))(s)
});

// Exemplo
interface Address { street: string; city: string; }
interface Person { name: string; address: Address; }
interface Company { ceo: Person; }

const ceoLens: Lens<Company, Person> = {
  get: (c) => c.ceo,
  set: (p) => (c) => ({ ...c, ceo: p })
};

const addressLens: Lens<Person, Address> = {
  get: (p) => p.address,
  set: (a) => (p) => ({ ...p, address: a })
};

const cityLens: Lens<Address, string> = {
  get: (a) => a.city,
  set: (c) => (a) => ({ ...a, city: c })
};

// Compor lenses
const ceoCityLens = composeLens(composeLens(ceoLens, addressLens), cityLens);

const company: Company = {
  ceo: {
    name: "Alice",
    address: { street: "Main St", city: "NYC" }
  }
};

console.log(ceoCityLens.get(company));  // "NYC"

const updated = ceoCityLens.set("LA")(company);
console.log(updated.ceo.address.city);  // "LA"
```

**Pattern:** Lenses componíveis para **acessar/modificar** estruturas aninhadas.

### Transducers Composition

```typescript
// Transducers - composição eficiente sem intermediate arrays
type Reducer<T, U> = (acc: U, item: T) => U;
type Transducer<T, U> = <V>(reducer: Reducer<U, V>) => Reducer<T, V>;

const mapT = <T, U>(fn: (item: T) => U): Transducer<T, U> =>
  (reducer) => (acc, item) => reducer(acc, fn(item));

const filterT = <T>(predicate: (item: T) => boolean): Transducer<T, T> =>
  (reducer) => (acc, item) => predicate(item) ? reducer(acc, item) : acc;

const composeT = <T>(...transducers: Transducer<any, any>[]): Transducer<T, any> =>
  transducers.reduce((acc, t) => (reducer) => acc(t(reducer)));

const transduce = <T, U, V>(
  transducer: Transducer<T, U>,
  reducer: Reducer<U, V>,
  initial: V,
  collection: T[]
): V => collection.reduce(transducer(reducer), initial);

// Uso
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const isEven = (n: number) => n % 2 === 0;
const double = (n: number) => n * 2;
const sum = (acc: number, n: number) => acc + n;

// Compor transducers
const transducer = composeT(
  filterT(isEven),
  mapT(double)
);

const result = transduce(transducer, sum, 0, numbers);
console.log(result);  // (2 + 4 + 6 + 8 + 10) * 2 = 60
```

**Pattern:** Transducers evitam **intermediate arrays** - mais eficiente.

### Async Function Composition

```typescript
// Composição de async functions
type AsyncFn<T, U> = (value: T) => Promise<U>;

const composeAsync = <A, B, C>(
  f: AsyncFn<B, C>,
  g: AsyncFn<A, B>
): AsyncFn<A, C> =>
  async (a: A) => {
    const b = await g(a);
    return f(b);
  };

const pipeAsync = <A, B, C>(
  g: AsyncFn<A, B>,
  f: AsyncFn<B, C>
): AsyncFn<A, C> =>
  async (a: A) => {
    const b = await g(a);
    return f(b);
  };

// Variadic async pipe
const pipeAsyncN = <T>(...fns: Array<AsyncFn<T, T>>): AsyncFn<T, T> =>
  async (value: T) => {
    let result = value;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  };

// Uso
const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
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

// Compor async pipeline
const processUser = pipeAsyncN(fetchUser, enrichUser, saveUser);

await processUser(123);
```

**Pattern:** Composição funciona com **async functions**.

### Point-free Composition

```typescript
// Point-free style - omitir argumentos explícitos
const numbers = [1, 2, 3, 4, 5];

// Não point-free
const doubled1 = numbers.map(n => double(n));

// Point-free
const doubled2 = numbers.map(double);

// Composição point-free
const transform = pipe(addOne, double, square);

// Não point-free
const result1 = numbers.map(n => transform(n));

// Point-free
const result2 = numbers.map(transform);
```

**Pattern:** Point-free é mais **conciso** - omitir argumentos quando possível.

## 🎯 Aplicabilidade e Contextos

### Data Transformation

```typescript
const processData = pipe(validate, transform, save);
```

**Raciocínio:** Pipeline de transformação de dados.

### String Processing

```typescript
const slugify = pipe(trim, toLowerCase, removeSpaces);
```

**Raciocínio:** Transformações sequenciais de strings.

### API Response Processing

```typescript
const process = pipe(fetchData, parseJSON, extractRelevant, format);
```

**Raciocínio:** Processar resposta de API sequencialmente.

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```typescript
// Cada composição cria closure
const pipeline = pipe(fn1, fn2, fn3, fn4, fn5);
```

**Consideração:** Composição tem overhead - avaliar em hot paths.

### Debugging Difficulty

```typescript
// Stack traces complexos
const result = pipe(fn1, fn2, fn3, fn4)(input);
```

**Solução:** Usar `tap` para debug intermediário.

### Type Inference Limits

```typescript
// Tipos muito aninhados - difícil inferência
const result = pipe(fn1, fn2, fn3, fn4, fn5, fn6, fn7);
```

**Limitação:** TypeScript pode perder tipos em pipes muito longos.

## 🔗 Interconexões Conceituais

**Relação com Higher-Order Functions:** Compose/pipe são HOF.

**Relação com Partial Application:** Facilita composição.

**Relação com Currying:** Funções curried são componíveis.

**Relação com Functional Programming:** Fundamento de FP.

**Relação com Declarative Programming:** Código declarativo.

## 🚀 Evolução e Próximos Conceitos

Dominar combinar funções prepara para:
- **Pipe vs Compose:** Diferenças e quando usar
- **Type Safety em Composição:** Garantir compatibilidade de tipos
- **Monads:** Abstrações funcionais avançadas
- **Category Theory:** Fundamentos matemáticos
