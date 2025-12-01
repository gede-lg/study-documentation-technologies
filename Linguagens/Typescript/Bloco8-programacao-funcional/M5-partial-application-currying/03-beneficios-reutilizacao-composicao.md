# Benefícios: Reutilização e Composição

## 🎯 Introdução e Definição

### Definição Conceitual

**Benefícios de reutilização e composição** referem-se às vantagens obtidas ao usar **partial application** e **currying** - transformar funções multi-parâmetro em funções especializadas reutilizáveis que podem ser **compostas** para criar comportamentos complexos. Reutilização significa criar **variações de função** a partir de base única, enquanto composição permite **combinar funções** para construir transformações complexas de forma declarativa.

Conceitualmente, reutilização implementa **DRY (Don't Repeat Yourself)** - evitar duplicação de código ao criar funções especializadas. Composição implementa **function composition** - combinar funções simples em **pipelines** complexos. TypeScript garante **type safety** - composições preservam tipos, detectando incompatibilidades em compile-time.

**Fundamento teórico:** Partial application e currying promovem **modularidade** - funções pequenas, focadas, componíveis. Reutilização reduz **cognitive load** - funções especializadas têm nomes descritivos. Composição promove **declarative code** - expressar "o que fazer" ao invés de "como fazer", tornando código mais legível e manutenível.

**Pattern fundamental:**
```
Função genérica → Partial application → Funções especializadas → Composição → Comportamento complexo
```

### Contexto Histórico e Evolução

**Unix Philosophy (1970s):** "Do one thing and do it well" - programas pequenos compostos via pipes.

```bash
# Unix - composição de comandos
cat file.txt | grep "error" | sort | uniq
```

Cada comando faz **uma coisa**, compostos para comportamento complexo.

**Haskell (1990):** Composição como **operador nativo**.

```haskell
-- Haskell - operador de composição (.)
(f . g) x = f (g x)

-- Uso
addOne x = x + 1
double x = x * 2
square x = x * x

composed = square . double . addOne
composed 3  -- ((3 + 1) * 2)^2 = 64
```

**Ramda.js (2013):** Biblioteca JavaScript focada em FP e composição.

```javascript
// Ramda - compose e pipe
import { compose, pipe, map, filter, reduce } from 'ramda';

const sumEvenDoubles = compose(
  reduce((acc, n) => acc + n, 0),
  map(n => n * 2),
  filter(n => n % 2 === 0)
);

sumEvenDoubles([1, 2, 3, 4, 5]);  // (2 + 4) * 2 = 12
```

**Lodash/fp (2014):** Versão funcional do Lodash com auto-currying.

```javascript
// Lodash/fp - auto-curried
import { compose, map, filter, reduce } from 'lodash/fp';

const pipeline = compose(
  reduce((acc, n) => acc + n, 0),
  map(n => n * 2),
  filter(n => n % 2 === 0)
);
```

**TypeScript 2.0 (2016):** Type inference aprimorado para composição.

```typescript
// TypeScript - composição tipada
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;

const composed = compose(double, addOne);  // Type: (n: number) => number
```

**TypeScript 4.0 (2020):** **Variadic tuple types** - composição genérica mais poderosa.

```typescript
// Variadic tuples para pipe genérico
type Pipe<F extends any[]> = F extends [
  (a: infer A) => infer B,
  ...infer Rest
] ? Rest extends [(b: B) => any, ...any[]]
    ? Pipe<Rest> extends (x: any) => infer C
      ? (a: A) => C
      : never
    : (a: A) => B
  : never;
```

**Evolução de práticas:**

**Era Imperativa:**
```javascript
// Imperativo - sem reutilização/composição
function processData(data) {
  let result = [];
  for (let item of data) {
    if (item.active) {
      result.push(item.value * 2);
    }
  }
  return result.reduce((acc, n) => acc + n, 0);
}
```

**Era Funcional:**
```typescript
// Funcional - reutilização + composição
const isActive = (item: Item) => item.active;
const getValue = (item: Item) => item.value;
const double = (n: number) => n * 2;
const sum = (acc: number, n: number) => acc + n;

const processData = pipe(
  filter(isActive),
  map(getValue),
  map(double),
  reduce(sum, 0)
);
```

### Problema Fundamental que Resolve

Benefícios de reutilização e composição resolvem problemas de **código duplicado**, **baixa manutenibilidade**, e **complexidade**.

**Problema 1: Código duplicado**
```typescript
// Sem reutilização - duplicação
function applyDiscount10(price: number): number {
  return price * 0.9;
}

function applyDiscount20(price: number): number {
  return price * 0.8;
}

function applyDiscount30(price: number): number {
  return price * 0.7;
}

// Duplicação de lógica ❌
```

**Solução: Reutilização via partial**
```typescript
// Reutilização - função base + partial
function applyDiscount(percentage: number, price: number): number {
  return price * (1 - percentage / 100);
}

const createDiscounter = (percentage: number) => (price: number) =>
  applyDiscount(percentage, price);

// Funções especializadas reutilizáveis
const discount10 = createDiscounter(10);
const discount20 = createDiscounter(20);
const discount30 = createDiscounter(30);

// Usar
console.log(discount10(100));  // 90
console.log(discount20(100));  // 80
console.log(discount30(100));  // 70
// ✅ Zero duplicação
```

**Problema 2: Transformações complexas imperativas**
```typescript
// Imperativo - difícil de entender
function processUsers(users: User[]): number {
  let sum = 0;
  for (let user of users) {
    if (user.active && user.age >= 18) {
      sum += user.score * 2;
    }
  }
  return sum / users.filter(u => u.active && u.age >= 18).length;
}

// Lógica misturada, difícil manutenção ❌
```

**Solução: Composição declarativa**
```typescript
// Composição - declarativo e legível
const isActive = (user: User) => user.active;
const isAdult = (user: User) => user.age >= 18;
const getScore = (user: User) => user.score;
const double = (n: number) => n * 2;
const average = (nums: number[]) => 
  nums.reduce((acc, n) => acc + n, 0) / nums.length;

const processUsers = pipe(
  filter(isActive),
  filter(isAdult),
  map(getScore),
  map(double),
  average
);

// ✅ Declarativo, cada etapa clara
```

**Problema 3: Callbacks inline repetitivos**
```typescript
// Sem reutilização - callbacks inline
const doubled = numbers.map(n => n * 2);
const tripled = numbers.map(n => n * 3);
const squared = numbers.map(n => n * n);

const adults = users.filter(u => u.age >= 18);
const seniors = users.filter(u => u.age >= 65);

// Repetir lógica similar ❌
```

**Solução: Reutilização de funções especializadas**
```typescript
// Reutilização - funções nomeadas
const multiply = (factor: number) => (n: number) => n * factor;
const power = (exponent: number) => (n: number) => Math.pow(n, exponent);
const olderThan = (age: number) => (user: User) => user.age >= age;

// Funções reutilizáveis
const double = multiply(2);
const triple = multiply(3);
const square = power(2);
const isAdult = olderThan(18);
const isSenior = olderThan(65);

// Usar
const doubled = numbers.map(double);
const tripled = numbers.map(triple);
const squared = numbers.map(square);

const adults = users.filter(isAdult);
const seniors = users.filter(isSenior);
// ✅ Funções nomeadas, reutilizáveis
```

**Fundamento teórico:** Reutilização elimina duplicação, composição elimina complexidade imperativa.

### Importância no Ecossistema

Benefícios de reutilização e composição são cruciais porque:

- **Code Reuse:** Reduzir duplicação drasticamente
- **Declarative Code:** Código expressivo e legível
- **Modularity:** Funções pequenas e focadas
- **Testability:** Funções pequenas fáceis de testar
- **Maintainability:** Mudanças localizadas em funções reutilizadas
- **Type Safety:** TypeScript valida composições
- **Readability:** Nomes descritivos documentam intenção
- **Flexibility:** Combinar funções de formas diferentes

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Reutilização:** Criar funções especializadas de base genérica
2. **Composição:** Combinar funções simples em complexas
3. **Declarative:** Expressar "o que" ao invés de "como"
4. **Modularity:** Funções pequenas, focadas, independentes
5. **Type Safety:** Composições type-checked

### Pilares Fundamentais

- **Partial Application:** Base de reutilização
- **Currying:** Facilita composição
- **Compose:** Combinar da direita para esquerda
- **Pipe:** Combinar da esquerda para direita
- **Point-free Style:** Omitir argumentos explícitos

### Visão Geral das Nuances

- **Function Pipelines:** Transformações sequenciais
- **Named Functions:** Funções descritivas
- **Small Functions:** Única responsabilidade
- **Generic Utilities:** Funções reutilizáveis genéricas
- **Type Inference:** TypeScript infere tipos

## 🧠 Fundamentos Teóricos

### Basic Reusability

```typescript
// Função base genérica
function multiply(a: number, b: number): number {
  return a * b;
}

// Reutilização via partial
const multiplyBy = (factor: number) => (n: number) => multiply(factor, n);

// Funções especializadas reutilizáveis
const double = multiplyBy(2);
const triple = multiplyBy(3);
const quadruple = multiplyBy(4);

// Reutilizar em diferentes contextos
const numbers = [1, 2, 3, 4, 5];

console.log(numbers.map(double));      // [2, 4, 6, 8, 10]
console.log(numbers.map(triple));      // [3, 6, 9, 12, 15]
console.log(numbers.map(quadruple));   // [4, 8, 12, 16, 20]

// Reutilizar individualmente
console.log(double(10));    // 20
console.log(triple(10));    // 30
console.log(quadruple(10)); // 40
```

**Benefício:** **Uma função base** gera **múltiplas especializações** reutilizáveis.

### Basic Composition

```typescript
// Funções simples
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

// Compose - direita para esquerda
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Compor funções
const addOneThenDouble = compose(double, addOne);
const doubleThenSquare = compose(square, double);

// Usar
console.log(addOneThenDouble(5));   // (5 + 1) * 2 = 12
console.log(doubleThenSquare(3));   // (3 * 2)^2 = 36
```

**Benefício:** **Combinar funções** simples em **transformações complexas**.

### Pipe for Readability

```typescript
// Pipe - esquerda para direita (mais legível)
function pipe<A, B, C>(
  g: (a: A) => B,
  f: (b: B) => C
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Compor com pipe
const addOneThenDouble = pipe(addOne, double);
const doubleThenSquare = pipe(double, square);

// Mais legível - fluxo natural esquerda → direita
console.log(addOneThenDouble(5));   // 5 + 1 → * 2 = 12
console.log(doubleThenSquare(3));   // 3 * 2 → ^2 = 36
```

**Benefício:** Pipe segue **fluxo de leitura natural** (esquerda → direita).

### Princípios e Conceitos Subjacentes

#### Declarative vs Imperative

```typescript
// Imperativo - "como fazer"
function processNumbers(numbers: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];
    if (n % 2 === 0) {
      result.push(n * 2);
    }
  }
  return result;
}

// Declarativo - "o que fazer"
const isEven = (n: number) => n % 2 === 0;
const double = (n: number) => n * 2;

const processNumbers2 = pipe(
  filter(isEven),
  map(double)
);

// Imperativo: loop, variável mutável, lógica misturada
// Declarativo: funções nomeadas, composição clara
```

**Benefício:** Código declarativo é **mais legível** e **expressivo**.

#### Reusable Predicates

```typescript
// Predicados reutilizáveis
const greaterThan = (min: number) => (n: number) => n > min;
const lessThan = (max: number) => (n: number) => n < max;
const between = (min: number, max: number) => (n: number) =>
  greaterThan(min)(n) && lessThan(max)(n);

// Reutilizar em diferentes contextos
const numbers = [1, 5, 10, 15, 20, 25, 30];

const greaterThan10 = numbers.filter(greaterThan(10));
const lessThan20 = numbers.filter(lessThan(20));
const between10and20 = numbers.filter(between(10, 20));

console.log(greaterThan10);     // [15, 20, 25, 30]
console.log(lessThan20);        // [1, 5, 10, 15]
console.log(between10and20);    // [15]
```

**Benefício:** **Predicados genéricos** reutilizáveis em múltiplos contextos.

### Variadic Compose and Pipe

```typescript
// Compose com número arbitrário de funções
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Pipe com número arbitrário de funções
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Usar
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;
const subtract10 = (n: number) => n - 10;

// Compor múltiplas funções
const pipeline = pipe(addOne, double, square, subtract10);

console.log(pipeline(3));  // (((3 + 1) * 2)^2 - 10 = 54
```

**Benefício:** Compor **arbitrary number** de funções.

### Point-free Style

```typescript
// Point-free - omitir argumentos explícitos
const numbers = [1, 2, 3, 4, 5];

// Não point-free - argumento explícito
const doubled1 = numbers.map(n => double(n));

// Point-free - omitir argumento
const doubled2 = numbers.map(double);

// Composição point-free
const addOneThenDouble = pipe(addOne, double);

// Não point-free
const result1 = numbers.map(n => addOneThenDouble(n));

// Point-free
const result2 = numbers.map(addOneThenDouble);
```

**Benefício:** Código mais **conciso** e **legível**.

### Reusable Transformations

```typescript
// Transformações reutilizáveis
const normalize = (str: string) => str.trim().toLowerCase();
const removeSpaces = (str: string) => str.replace(/\s+/g, "");
const capitalize = (str: string) => 
  str.charAt(0).toUpperCase() + str.slice(1);

// Compor transformações
const slugify = pipe(normalize, removeSpaces);
const titleCase = pipe(normalize, capitalize);

// Reutilizar
const strings = [" Hello World ", "  TypeScript  "];

console.log(strings.map(slugify));     // ["helloworld", "typescript"]
console.log(strings.map(titleCase));   // ["Hello world", "Typescript"]
```

**Benefício:** **Transformações componíveis** reutilizáveis.

### Modelo Mental para Compreensão

Pense em composição como **linha de montagem**:

**Funções simples:** Estações de trabalho - cada uma faz operação específica
**Composição:** Correia transportadora - conecta estações sequencialmente
**Input:** Matéria-prima entrando na linha
**Output:** Produto final saindo da linha

**Analogia - Receita Culinária:**

**Funções simples:** Etapas da receita - "Descascar", "Cortar", "Cozinhar"
**Composição:** Ordem das etapas - "Primeiro descascar, depois cortar, depois cozinhar"
**Input:** Ingredientes crus
**Output:** Prato pronto

**Metáfora - Pipeline de Processamento de Água:**

**Funções simples:** Filtros - "Filtro de sedimentos", "Filtro de carvão", "UV"
**Composição:** Sequência de filtros - água passa por todos
**Input:** Água suja
**Output:** Água limpa

**Fluxo de composição:**
```
Input → Função1 → Resultado1 → Função2 → Resultado2 → Função3 → Output final
```

**Exemplo concreto:**
```typescript
// Funções simples (estações de trabalho)
const removeSpaces = (str: string) => str.replace(/\s+/g, "");
const toLowerCase = (str: string) => str.toLowerCase();
const addPrefix = (str: string) => `prefix_${str}`;

// Composição (linha de montagem)
const process = pipe(removeSpaces, toLowerCase, addPrefix);

// Input (matéria-prima)
const input = " Hello World ";

// Output (produto final)
const output = process(input);
// " Hello World " → "HelloWorld" → "helloworld" → "prefix_helloworld"

console.log(output);  // "prefix_helloworld"
```

## 🔍 Análise Conceitual Profunda

### Data Transformation Pipelines

```typescript
// Pipeline de transformação de dados
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
  score: number;
}

// Funções reutilizáveis
const isActive = (user: User) => user.active;
const isAdult = (user: User) => user.age >= 18;
const getName = (user: User) => user.name;
const getScore = (user: User) => user.score;
const double = (n: number) => n * 2;
const sum = (nums: number[]) => nums.reduce((acc, n) => acc + n, 0);
const average = (nums: number[]) => sum(nums) / nums.length;

// Compor pipeline
const getAverageScoreOfActiveAdults = pipe(
  filter(isActive),
  filter(isAdult),
  map(getScore),
  map(double),
  average
);

// Usar
const users: User[] = [
  { id: 1, name: "Alice", age: 25, active: true, score: 80 },
  { id: 2, name: "Bob", age: 17, active: true, score: 90 },
  { id: 3, name: "Charlie", age: 30, active: false, score: 70 },
  { id: 4, name: "Diana", age: 22, active: true, score: 85 }
];

console.log(getAverageScoreOfActiveAdults(users));  // ((80 + 85) * 2) / 2 = 165
```

**Benefício:** Pipeline **declarativo**, cada etapa **nomeada** e **reutilizável**.

#### Validators Composition

```typescript
// Validators componíveis
type Validator<T> = (value: T) => boolean;

const compose2Validators = <T>(
  v1: Validator<T>,
  v2: Validator<T>
): Validator<T> => (value: T) => v1(value) && v2(value);

// Validators base
const isNonEmpty = (str: string) => str.length > 0;
const isEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
const minLength = (min: number) => (str: string) => str.length >= min;
const maxLength = (max: number) => (str: string) => str.length <= max;
const isNumeric = (str: string) => /^\d+$/.test(str);

// Compor validators
const isValidEmail = compose2Validators(isNonEmpty, isEmail);
const isValidPassword = compose2Validators(
  minLength(8),
  maxLength(20)
);
const isValidZipCode = compose2Validators(
  isNumeric,
  minLength(5)
);

// Usar
console.log(isValidEmail("test@example.com"));  // true
console.log(isValidEmail("invalid"));           // false
console.log(isValidPassword("secret123"));      // true
console.log(isValidPassword("short"));          // false
console.log(isValidZipCode("12345"));           // true
console.log(isValidZipCode("abc"));             // false
```

**Benefício:** **Validators base** componíveis em **validators complexos**.

### Middleware Composition

```typescript
// Middleware componível
type Middleware<T> = (value: T) => T;

function composeMiddleware<T>(...middlewares: Middleware<T>[]): Middleware<T> {
  return (value: T) => middlewares.reduce((acc, mw) => mw(acc), value);
}

// Middlewares base
const trim = (str: string) => str.trim();
const toLowerCase = (str: string) => str.toLowerCase();
const removeSpecialChars = (str: string) => str.replace(/[^a-z0-9]/gi, "");
const truncate = (max: number) => (str: string) => str.slice(0, max);

// Compor middlewares
const sanitizeInput = composeMiddleware(
  trim,
  toLowerCase,
  removeSpecialChars,
  truncate(50)
);

// Usar
const input = "  Hello @World! 123  ";
console.log(sanitizeInput(input));  // "helloworld123"
```

**Benefício:** **Middlewares independentes** componíveis em **pipeline**.

#### Async Composition

```typescript
// Composição de funções async
type AsyncFn<T, U> = (value: T) => Promise<U>;

function composeAsync<A, B, C>(
  f: AsyncFn<B, C>,
  g: AsyncFn<A, B>
): AsyncFn<A, C> {
  return async (value: A) => {
    const intermediate = await g(value);
    return f(intermediate);
  };
}

function pipeAsync<A, B, C>(
  g: AsyncFn<A, B>,
  f: AsyncFn<B, C>
): AsyncFn<A, C> {
  return async (value: A) => {
    const intermediate = await g(value);
    return f(intermediate);
  };
}

// Async functions
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
const processUser = pipeAsync(
  pipeAsync(fetchUser, enrichUser),
  saveUser
);

// Usar
await processUser(123);
```

**Benefício:** Composição funciona com **async functions** - pipelines assíncronos.

### Lens Composition

```typescript
// Lens - getter + setter componíveis
interface Lens<T, U> {
  get: (obj: T) => U;
  set: (value: U, obj: T) => T;
}

function composeLens<A, B, C>(
  outer: Lens<A, B>,
  inner: Lens<B, C>
): Lens<A, C> {
  return {
    get: (obj: A) => inner.get(outer.get(obj)),
    set: (value: C, obj: A) => outer.set(inner.set(value, outer.get(obj)), obj)
  };
}

// Uso
interface Address {
  street: string;
  city: string;
}

interface Person {
  name: string;
  address: Address;
}

const addressLens: Lens<Person, Address> = {
  get: (person) => person.address,
  set: (address, person) => ({ ...person, address })
};

const cityLens: Lens<Address, string> = {
  get: (address) => address.city,
  set: (city, address) => ({ ...address, city })
};

// Compor lenses
const personCityLens = composeLens(addressLens, cityLens);

const person: Person = {
  name: "Alice",
  address: { street: "Main St", city: "NYC" }
};

console.log(personCityLens.get(person));  // "NYC"

const updated = personCityLens.set("LA", person);
console.log(updated.address.city);  // "LA"
```

**Benefício:** Lenses componíveis para **acessar/modificar** estruturas aninhadas.

#### Transducers

```typescript
// Transducers - composição eficiente de transformações
type Reducer<T, U> = (acc: U, item: T) => U;
type Transducer<T, U> = <V>(reducer: Reducer<U, V>) => Reducer<T, V>;

const mapTransducer = <T, U>(fn: (item: T) => U): Transducer<T, U> =>
  (reducer) => (acc, item) => reducer(acc, fn(item));

const filterTransducer = <T>(predicate: (item: T) => boolean): Transducer<T, T> =>
  (reducer) => (acc, item) => predicate(item) ? reducer(acc, item) : acc;

function compose<T>(...transducers: Transducer<any, any>[]): Transducer<T, any> {
  return transducers.reduce((acc, t) => (reducer) => acc(t(reducer)));
}

const transduce = <T, U, V>(
  transducer: Transducer<T, U>,
  reducer: Reducer<U, V>,
  initial: V,
  collection: T[]
): V => {
  return collection.reduce(transducer(reducer), initial);
};

// Uso
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const isEven = (n: number) => n % 2 === 0;
const double = (n: number) => n * 2;
const sum = (acc: number, n: number) => acc + n;

const transducer = compose(
  filterTransducer(isEven),
  mapTransducer(double)
);

const result = transduce(transducer, sum, 0, numbers);
console.log(result);  // (2 + 4 + 6 + 8 + 10) * 2 = 60
```

**Benefício:** Transducers evitam **intermediate arrays** - mais eficiente.

### Memoization in Composition

```typescript
// Memoize funções em composição
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Funções caras
const expensiveDouble = memoize((n: number) => {
  console.log("Computing double...");
  return n * 2;
});

const expensiveSquare = memoize((n: number) => {
  console.log("Computing square...");
  return n * n;
});

// Compor funções memoized
const composed = pipe(expensiveDouble, expensiveSquare);

console.log(composed(5));  // Computing double... Computing square... 100
console.log(composed(5));  // 100 (cached)
console.log(composed(3));  // Computing double... Computing square... 36
```

**Benefício:** Memoization **otimiza** funções em composição.

#### Function Currying for Composition

```typescript
// Curry para facilitar composição
const curry2 = <A, B, R>(fn: (a: A, b: B) => R) =>
  (a: A) => (b: B) => fn(a, b);

const curry3 = <A, B, C, R>(fn: (a: A, b: B, c: C) => R) =>
  (a: A) => (b: B) => (c: C) => fn(a, b, c);

// Funções base
const add = (a: number, b: number) => a + b;
const multiply = (a: number, b: number) => a * b;
const clamp = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value));

// Curry
const curriedAdd = curry2(add);
const curriedMultiply = curry2(multiply);
const curriedClamp = curry3(clamp);

// Composição fácil
const add5 = curriedAdd(5);
const multiplyBy2 = curriedMultiply(2);
const clamp0to100 = curriedClamp(0)(100);

const pipeline = pipe(add5, multiplyBy2, clamp0to100);

console.log(pipeline(10));   // clamp(0, 100, (10 + 5) * 2) = 30
console.log(pipeline(50));   // clamp(0, 100, (50 + 5) * 2) = 100
console.log(pipeline(-10));  // clamp(0, 100, (-10 + 5) * 2) = 0
```

**Benefício:** Currying facilita **partial application** para composição.

### Generic Reusable Utilities

```typescript
// Utilities genéricos reutilizáveis
const identity = <T>(x: T): T => x;
const constant = <T>(x: T) => () => x;
const tap = <T>(fn: (x: T) => void) => (x: T): T => { fn(x); return x; };

// Array utilities
const head = <T>(arr: T[]): T | undefined => arr[0];
const tail = <T>(arr: T[]): T[] => arr.slice(1);
const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];
const init = <T>(arr: T[]): T[] => arr.slice(0, -1);
const take = (n: number) => <T>(arr: T[]): T[] => arr.slice(0, n);
const drop = (n: number) => <T>(arr: T[]): T[] => arr.slice(n);

// Usar em composição
const pipeline = pipe(
  tap(console.log),      // Log input
  take(3),               // Take first 3
  map((n: number) => n * 2),  // Double
  tap(console.log)       // Log result
);

const numbers = [1, 2, 3, 4, 5];
console.log(pipeline(numbers));  // [2, 4, 6]
```

**Benefício:** Utilities **genéricos** reutilizáveis em **qualquer contexto**.

## 🎯 Aplicabilidade e Contextos

### Data Processing

```typescript
const process = pipe(filter(predicate), map(transform), reduce(aggregate));
```

**Raciocínio:** Pipeline de transformação de dados.

### Form Validation

```typescript
const validate = compose(v1, v2, v3);
```

**Raciocínio:** Compor validators independentes.

### API Clients

```typescript
const fetcher = createFetcher(baseUrl);
```

**Raciocínio:** Reutilizar client com config.

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```typescript
// Composição cria intermediate arrays
const result = arr.filter(pred).map(fn1).map(fn2);
```

**Consideração:** Considerar transducers para eficiência.

### Debugging Complexity

```typescript
// Stack traces complexos em composição
const result = pipe(fn1, fn2, fn3, fn4)(input);
```

**Consideração:** Usar `tap` para debug intermediário.

### Type Inference Limits

```typescript
// Tipos muito aninhados - difícil inferência
const result = pipe(fn1, fn2, fn3, fn4, fn5, fn6);
```

**Limitação:** TypeScript pode perder tipos em pipes longos.

## 🔗 Interconexões Conceituais

**Relação com Partial Application:** Base de reutilização.

**Relação com Currying:** Facilita composição.

**Relação com Higher-Order Functions:** Compose/pipe são HOF.

**Relação com Functional Programming:** Fundamento de FP.

**Relação com Declarative Programming:** Código declarativo.

## 🚀 Evolução e Próximos Conceitos

Dominar reutilização e composição prepara para:
- **Transducers:** Composição eficiente
- **Monads:** Abstrações funcionais avançadas
- **Functors:** Patterns de transformação
- **Category Theory:** Fundamentos matemáticos de FP
