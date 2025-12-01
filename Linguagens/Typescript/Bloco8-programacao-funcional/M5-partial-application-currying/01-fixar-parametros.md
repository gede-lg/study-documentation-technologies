# Fixar Parâmetros

## 🎯 Introdução e Definição

### Definição Conceitual

**Fixar parâmetros** (partial application) refere-se à técnica de **criar nova função** a partir de função existente, **pré-fornecendo alguns argumentos** enquanto deixa outros para serem fornecidos posteriormente. Diferentemente de chamar função imediatamente, partial application retorna **nova função** com menos parâmetros - os fixados estão "congelados" na closure, restantes são aceitos pela função retornada.

Conceitualmente, fixar parâmetros implementa **specialization** - transformar função genérica em função especializada. Função original com N parâmetros torna-se função com N-K parâmetros após fixar K argumentos. TypeScript garante **type safety** - função parcial tem tipo correto, refletindo parâmetros restantes e tipo de retorno original.

**Fundamento teórico:** Partial application é **função de alta ordem** que encapsula configuração. Closure captura argumentos fixados, função retornada combina fixados + fornecidos posteriormente para chamar função original. Promove **code reuse** - criar variações de função sem duplicação. Diferencia-se de **currying** - currying transforma multi-param em sequência de single-param, partial application pode fixar múltiplos args de uma vez.

**Partial Application Pattern**:
```
function original(a: A, b: B, c: C): R { ... }

function partial(a: A): (b: B, c: C) => R {
  return (b: B, c: C) => original(a, b, c);
}
```

### Contexto Histórico e Evolução

**Lambda Calculus (1930s):** Fundamento matemático de **partial application**.

**Haskell (1990):** Partial application **automática** - todas funções são curried.

```haskell
-- Haskell - partial application automático
add :: Int -> Int -> Int
add x y = x + y

add5 :: Int -> Int
add5 = add 5  -- Partial application automático
```

**JavaScript (1995):** Sem suporte nativo - implementado manualmente.

```javascript
// JavaScript - partial application manual
function multiply(a, b, c) {
  return a * b * c;
}

function partial(a) {
  return function(b, c) {
    return multiply(a, b, c);
  };
}

const multiplyBy2 = partial(2);
console.log(multiplyBy2(3, 4));  // 24
```

**JavaScript ES5 (2009):** `Function.prototype.bind()` para partial application.

```javascript
// ES5 - bind para partial application
function multiply(a, b, c) {
  return a * b * c;
}

const multiplyBy2 = multiply.bind(null, 2);
console.log(multiplyBy2(3, 4));  // 24
```

**JavaScript ES6 (2015):** **Arrow functions** simplificam partial application.

```javascript
// ES6 - arrow function para partial
const multiply = (a, b, c) => a * b * c;

const partial = (a) => (b, c) => multiply(a, b, c);

const multiplyBy2 = partial(2);
console.log(multiplyBy2(3, 4));  // 24
```

**TypeScript 1.0 (2012):** Type annotations para partial application.

```typescript
// TypeScript - partial application tipado
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

function partial(a: number): (b: number, c: number) => number {
  return (b: number, c: number) => multiply(a, b, c);
}

const multiplyBy2 = partial(2);  // Type: (b: number, c: number) => number
console.log(multiplyBy2(3, 4));  // 24
```

**TypeScript 2.0 (2016):** **Rest parameters** em partial application.

```typescript
// Rest parameters para partial flexível
function partial<T, U extends any[], R>(
  fn: (first: T, ...rest: U) => R,
  first: T
): (...rest: U) => R {
  return (...rest: U) => fn(first, ...rest);
}
```

**TypeScript 4.0 (2020):** **Variadic tuple types** - partial application mais flexível.

```typescript
// Variadic tuples para partial genérico
type PartialApply<F extends (...args: any[]) => any, A extends any[]> = 
  F extends (...args: [...A, ...infer R]) => infer Ret 
    ? (...rest: R) => Ret 
    : never;
```

**Evolução de práticas:**

**Era JavaScript (sem tipos):**
```javascript
// Sem type safety
function partial(fn, ...fixed) {
  return (...rest) => fn(...fixed, ...rest);
}
```

**Era TypeScript (tipado):**
```typescript
// Type safety completo
function partial<T, U, R>(fn: (a: T, b: U) => R, a: T): (b: U) => R {
  return (b: U) => fn(a, b);
}
```

### Problema Fundamental que Resolve

Fixar parâmetros resolve problemas de **configuração repetitiva**, **código duplicado**, e **falta de especialização**.

**Problema 1: Configuração repetitiva**
```typescript
// Sem partial - repetir configuração
function applyDiscount(price: number, percentage: number): number {
  return price * (1 - percentage / 100);
}

// Repetir porcentagem toda vez
const item1 = applyDiscount(100, 10);  // 90
const item2 = applyDiscount(200, 10);  // 180
const item3 = applyDiscount(150, 10);  // 135
// ... repetir 10 toda vez ❌
```

**Solução: Partial application fixa porcentagem**
```typescript
// Partial application - fixar porcentagem
function createDiscounter(percentage: number): (price: number) => number {
  return (price: number) => applyDiscount(price, percentage);
}

const discount10 = createDiscounter(10);

// Usar sem repetir porcentagem
const item1 = discount10(100);  // 90
const item2 = discount10(200);  // 180
const item3 = discount10(150);  // 135
// ✅ Porcentagem fixada
```

**Problema 2: Funções especializadas duplicadas**
```typescript
// Sem partial - duplicação de código
function addTax5(price: number): number {
  return price * 1.05;
}

function addTax10(price: number): number {
  return price * 1.10;
}

function addTax15(price: number): number {
  return price * 1.15;
}

// Mais funções... ❌ Duplicação
```

**Solução: Partial application gera funções**
```typescript
// Partial - gerar funções a partir de base
function addTax(price: number, rate: number): number {
  return price * (1 + rate / 100);
}

function createTaxAdder(rate: number): (price: number) => number {
  return (price: number) => addTax(price, rate);
}

// Gerar funções especializadas
const addTax5 = createTaxAdder(5);
const addTax10 = createTaxAdder(10);
const addTax15 = createTaxAdder(15);

// Usar
console.log(addTax10(100));  // 110
```

**Problema 3: Callback com configuração**
```typescript
// Sem partial - configuração inline repetida
const numbers = [1, 2, 3, 4, 5];

// Repetir multiplicador
const doubled = numbers.map(n => n * 2);
const tripled = numbers.map(n => n * 3);
const quadrupled = numbers.map(n => n * 4);

// Ou criar função para cada multiplicador ❌
```

**Solução: Partial application para callbacks**
```typescript
// Partial - gerar callbacks
function multiply(factor: number, value: number): number {
  return value * factor;
}

function createMultiplier(factor: number): (value: number) => number {
  return (value: number) => multiply(factor, value);
}

// Callbacks especializados
const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

// Usar em map
const doubled = numbers.map(double);
const tripled = numbers.map(triple);
const quadrupled = numbers.map(quadruple);
```

**Fundamento teórico:** Partial application **elimina repetição** - configuração fixada uma vez, reutilizada múltiplas vezes.

### Importância no Ecossistema

Fixar parâmetros é crucial porque:

- **Code Reuse:** Reutilizar função base com configurações diferentes
- **Specialization:** Criar funções especializadas a partir de genéricas
- **Configuration:** Encapsular configuração em closure
- **Callback Generation:** Gerar callbacks customizados
- **API Design:** Criar APIs fluentes e reutilizáveis
- **Functional Programming:** Fundamento de paradigma funcional
- **Type Safety:** TypeScript garante tipos corretos
- **Declarative Code:** Código mais expressivo e legível

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Partial Application:** Fixar argumentos, retornar função restante
2. **Closure Capture:** Argumentos fixados capturados em closure
3. **Type Safety:** Função parcial tem tipo correto
4. **Specialization:** Transformar genérico em específico
5. **Arity Reduction:** Reduzir número de parâmetros

### Pilares Fundamentais

- **Factory Function:** Função que retorna função parcial
- **Closure:** Captura argumentos fixados
- **Generic Partial:** Partial application genérico
- **Type Inference:** TypeScript infere tipos
- **Reusability:** Reutilizar função base

### Visão Geral das Nuances

- **Left Partial:** Fixar argumentos da esquerda
- **Right Partial:** Fixar argumentos da direita
- **Multiple Arguments:** Fixar múltiplos args de uma vez
- **Bind Method:** `Function.prototype.bind()`
- **Partial vs Currying:** Diferenças conceituais

## 🧠 Fundamentos Teóricos

### Basic Partial Application

```typescript
// Função original - 3 parâmetros
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

// Partial application - fixar primeiro argumento
function partial(a: number): (b: number, c: number) => number {
  return (b: number, c: number) => multiply(a, b, c);
}

// Criar funções especializadas
const multiplyBy2 = partial(2);
const multiplyBy5 = partial(5);

// Usar
console.log(multiplyBy2(3, 4));  // 24 (2 * 3 * 4)
console.log(multiplyBy5(2, 3));  // 30 (5 * 2 * 3)
```

**Análise profunda:**

**Arity:** `multiply` tem arity 3, `multiplyBy2` tem arity 2
**Closure:** `a` capturado na closure da função retornada
**Type:** Função retornada tipada como `(b: number, c: number) => number`

### Generic Partial Application

```typescript
// Partial genérico - funciona com qualquer tipo
function partial1<T, U, R>(
  fn: (a: T, b: U) => R,
  a: T
): (b: U) => R {
  return (b: U) => fn(a, b);
}

// Uso com diferentes tipos
function add(a: number, b: number): number {
  return a + b;
}

function concat(a: string, b: string): string {
  return a + b;
}

// Partial com numbers
const add5 = partial1(add, 5);
console.log(add5(3));  // 8

// Partial com strings
const greet = partial1(concat, "Hello, ");
console.log(greet("World"));  // "Hello, World"
```

**Generic:** `<T, U, R>` - tipos de argumentos e retorno parametrizados.

### Multiple Arguments Partial

```typescript
// Partial com múltiplos argumentos fixados
function partial2<T, U, V, R>(
  fn: (a: T, b: U, c: V) => R,
  a: T,
  b: U
): (c: V) => R {
  return (c: V) => fn(a, b, c);
}

// Uso
function buildUrl(protocol: string, domain: string, path: string): string {
  return `${protocol}://${domain}${path}`;
}

// Fixar protocol e domain
const myWebsite = partial2(buildUrl, "https", "example.com");

// Apenas path necessário
console.log(myWebsite("/about"));     // "https://example.com/about"
console.log(myWebsite("/contact"));   // "https://example.com/contact"
```

**Benefício:** Fixar múltiplos args reduz arity mais drasticamente.

### Princípios e Conceitos Subjacentes

#### Partial with Rest Parameters

```typescript
// Partial genérico com rest parameters
function partial<T, U extends any[], R>(
  fn: (first: T, ...rest: U) => R,
  first: T
): (...rest: U) => R {
  return (...rest: U) => fn(first, ...rest);
}

// Uso
function sum(first: number, ...rest: number[]): number {
  return [first, ...rest].reduce((acc, n) => acc + n, 0);
}

const sumWith10 = partial(sum, 10);

console.log(sumWith10(1, 2, 3));     // 16 (10 + 1 + 2 + 3)
console.log(sumWith10(5, 5));        // 20 (10 + 5 + 5)
```

**Flexibility:** Rest parameters permitem partial com arbitrary number de args restantes.

#### Right Partial Application

```typescript
// Partial da direita - fixar últimos argumentos
function partialRight<T, U, R>(
  fn: (a: T, b: U) => R,
  b: U
): (a: T) => R {
  return (a: T) => fn(a, b);
}

// Uso
function divide(dividend: number, divisor: number): number {
  return dividend / divisor;
}

// Fixar divisor
const divideBy2 = partialRight(divide, 2);
const divideBy10 = partialRight(divide, 10);

console.log(divideBy2(20));   // 10 (20 / 2)
console.log(divideBy10(100)); // 10 (100 / 10)
```

**Right partial:** Fixar argumentos da **direita** ao invés de esquerda.

### Partial for Event Handlers

```typescript
// Partial para event handlers
function handleEvent(
  eventType: string,
  elementId: string,
  event: Event
): void {
  console.log(`${eventType} on ${elementId}:`, event.type);
}

// Criar handlers especializados
function createHandler(
  eventType: string,
  elementId: string
): (event: Event) => void {
  return (event: Event) => handleEvent(eventType, elementId, event);
}

// Uso
const clickHandler = createHandler("click", "button1");
const hoverHandler = createHandler("hover", "div2");

// Usar em addEventListener
button.addEventListener("click", clickHandler);
div.addEventListener("mouseover", hoverHandler);
```

**Pattern:** Partial application para **gerar event handlers** customizados.

### Partial with Configuration Object

```typescript
// Partial com objeto de configuração
interface FetchConfig {
  method: string;
  headers: Record<string, string>;
  timeout: number;
}

function fetchData(
  config: FetchConfig,
  url: string
): Promise<any> {
  return fetch(url, {
    method: config.method,
    headers: config.headers,
    signal: AbortSignal.timeout(config.timeout)
  }).then(res => res.json());
}

// Partial - fixar configuração
function createFetcher(config: FetchConfig): (url: string) => Promise<any> {
  return (url: string) => fetchData(config, url);
}

// Fetchers especializados
const jsonFetcher = createFetcher({
  method: "GET",
  headers: { "Content-Type": "application/json" },
  timeout: 5000
});

const authFetcher = createFetcher({
  method: "GET",
  headers: { "Authorization": "Bearer token123" },
  timeout: 10000
});

// Usar
const users = await jsonFetcher("/api/users");
const profile = await authFetcher("/api/profile");
```

**Pattern:** Partial para encapsular **configuração complexa**.

### Bind Method for Partial

```typescript
// Function.prototype.bind() para partial application
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

// Bind com null this, fixar primeiro argumento
const multiplyBy2 = multiply.bind(null, 2);

console.log(multiplyBy2(3, 4));  // 24 (2 * 3 * 4)

// Bind fixando múltiplos
const multiplyBy2And3 = multiply.bind(null, 2, 3);

console.log(multiplyBy2And3(4));  // 24 (2 * 3 * 4)
```

**Bind:** Método nativo para partial application - menos type-safe que manual.

### Modelo Mental para Compreensão

Pense em partial application como **preencher formulário**:

**Função original:** Formulário completo - todos campos necessários
**Partial application:** Preencher alguns campos - formulário parcial
**Função retornada:** Formulário com campos pré-preenchidos - só preencher restantes

**Analogia - Receita com Ingredientes Pré-preparados:**

**Função original:** Receita completa - "Misture A, B, C"
**Partial application:** Pré-misturar A e B - "Mistura de A+B pronta"
**Uso:** Apenas adicionar C - "Adicione C à mistura pronta"

**Metáfora - Template Parcialmente Preenchido:**

**Função original:** Template vazio - `_____ + _____ + _____`
**Partial application:** Preencher primeiro campo - `10 + _____ + _____`
**Uso:** Preencher restantes - `10 + 5 + 3 = 18`

**Fluxo de execução:**
```
1. Definir função original: (a, b, c) => result
2. Criar partial fixando 'a': partial(valueA)
3. Partial retorna: (b, c) => original(valueA, b, c)
4. Chamar função parcial: partialFn(valueB, valueC)
5. Internamente chama: original(valueA, valueB, valueC)
6. Retorna resultado
```

**Exemplo concreto:**
```typescript
// Função original
function sendEmail(from: string, to: string, subject: string, body: string) {
  console.log(`From: ${from}, To: ${to}, Subject: ${subject}`);
  console.log(body);
}

// Partial - fixar 'from'
function createSender(from: string) {
  return (to: string, subject: string, body: string) => {
    sendEmail(from, to, subject, body);
  };
}

// Usar - 'from' fixado
const myEmailer = createSender("me@example.com");

myEmailer("you@example.com", "Hello", "Hi there!");
myEmailer("them@example.com", "Update", "New version released");
// 'from' sempre "me@example.com" - fixado
```

## 🔍 Análise Conceitual Profunda

### Partial for Validators

```typescript
// Partial para gerar validators
function validateRange(min: number, max: number, value: number): boolean {
  return value >= min && value <= max;
}

// Criar validators especializados
function createRangeValidator(
  min: number,
  max: number
): (value: number) => boolean {
  return (value: number) => validateRange(min, max, value);
}

// Validators
const isValidAge = createRangeValidator(0, 120);
const isValidPercentage = createRangeValidator(0, 100);
const isValidTemperature = createRangeValidator(-273, 1000);

// Usar
console.log(isValidAge(25));         // true
console.log(isValidAge(150));        // false
console.log(isValidPercentage(50));  // true
console.log(isValidPercentage(150)); // false
```

**Pattern:** Partial para **criar validators** com limites fixados.

#### Partial for Loggers

```typescript
// Partial para loggers customizados
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

function log(level: LogLevel, message: string, ...args: any[]): void {
  const levelName = LogLevel[level];
  console.log(`[${levelName}] ${message}`, ...args);
}

// Criar loggers especializados
function createLogger(level: LogLevel): (message: string, ...args: any[]) => void {
  return (message: string, ...args: any[]) => log(level, message, ...args);
}

// Loggers
const debug = createLogger(LogLevel.DEBUG);
const info = createLogger(LogLevel.INFO);
const warn = createLogger(LogLevel.WARN);
const error = createLogger(LogLevel.ERROR);

// Usar
debug("Debug info", { x: 1 });     // [DEBUG] Debug info { x: 1 }
info("Application started");       // [INFO] Application started
warn("Low memory");                // [WARN] Low memory
error("Connection failed");        // [ERROR] Connection failed
```

**Pattern:** Partial para **encapsular nível de log**.

### Partial with Async Functions

```typescript
// Partial com async functions
async function fetchWithRetry(
  maxRetries: number,
  delay: number,
  url: string
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Partial - fixar retry config
function createRetryFetcher(
  maxRetries: number,
  delay: number
): (url: string) => Promise<any> {
  return (url: string) => fetchWithRetry(maxRetries, delay, url);
}

// Fetchers com diferentes retry configs
const aggressiveRetry = createRetryFetcher(5, 1000);  // 5 retries, 1s delay
const conservativeRetry = createRetryFetcher(2, 5000); // 2 retries, 5s delay

// Usar
const data1 = await aggressiveRetry("/api/data");
const data2 = await conservativeRetry("/api/critical");
```

**Pattern:** Partial para **async functions** com configuração.

#### Partial for Middleware

```typescript
// Partial para middleware
type Middleware = (req: Request, res: Response, next: () => void) => void;

function createAuthMiddleware(
  requiredRole: string
): Middleware {
  return (req: Request, res: Response, next: () => void) => {
    const userRole = req.headers.get("user-role");
    if (userRole === requiredRole) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
}

// Middlewares especializados
const requireAdmin = createAuthMiddleware("admin");
const requireUser = createAuthMiddleware("user");
const requireGuest = createAuthMiddleware("guest");

// Usar em rotas
app.get("/admin", requireAdmin, adminHandler);
app.get("/profile", requireUser, profileHandler);
app.get("/public", requireGuest, publicHandler);
```

**Pattern:** Partial para **gerar middlewares** com configuração.

### Partial Composition

```typescript
// Compor partial applications
function add(a: number, b: number, c: number): number {
  return a + b + c;
}

function partial1(a: number): (b: number, c: number) => number {
  return (b: number, c: number) => add(a, b, c);
}

function partial2(
  fn: (b: number, c: number) => number,
  b: number
): (c: number) => number {
  return (c: number) => fn(b, c);
}

// Compor partials
const add5 = partial1(5);           // Fixar 'a'
const add5and3 = partial2(add5, 3); // Fixar 'b'

console.log(add5and3(2));  // 10 (5 + 3 + 2)
```

**Composition:** Aplicar partial **múltiplas vezes** - fixar argumentos progressivamente.

#### Partial vs Currying

```typescript
// Partial Application - múltiplos args de uma vez
function partialAdd(a: number): (b: number, c: number) => number {
  return (b: number, c: number) => a + b + c;
}

const add5 = partialAdd(5);
console.log(add5(3, 2));  // 10 - fornece 2 args de uma vez

// Currying - um arg por vez
function curriedAdd(a: number): (b: number) => (c: number) => number {
  return (b: number) => (c: number) => a + b + c;
}

const curriedAdd5 = curriedAdd(5);
const curriedAdd5and3 = curriedAdd5(3);
console.log(curriedAdd5and3(2));  // 10 - um arg por vez
```

**Diferença:**

**Partial:** Pode fixar **múltiplos args**, função retornada aceita **restantes juntos**
**Currying:** Fixa **um arg** por vez, retorna **sequência** de funções

### Partial with Type Guards

```typescript
// Partial com type guards
function filter<T, U extends T>(
  arr: T[],
  guard: (item: T) => item is U
): U[] {
  return arr.filter(guard);
}

// Partial - fixar array
function createFilter<T>(arr: T[]) {
  return <U extends T>(guard: (item: T) => item is U): U[] => {
    return filter(arr, guard);
  };
}

// Uso
const mixed: (string | number)[] = [1, "a", 2, "b", 3, "c"];

const filterMixed = createFilter(mixed);

const strings = filterMixed((item): item is string => typeof item === "string");
// Type: string[]

const numbers = filterMixed((item): item is number => typeof item === "number");
// Type: number[]

console.log(strings);  // ["a", "b", "c"]
console.log(numbers);  // [1, 2, 3]
```

**Pattern:** Partial com **type guards** preserva type narrowing.

#### Partial for Factory Functions

```typescript
// Partial para factory functions
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

function createProduct(
  category: string,
  id: number,
  name: string,
  price: number
): Product {
  return { id, name, category, price };
}

// Partial - fixar categoria
function createProductFactory(category: string) {
  return (id: number, name: string, price: number): Product => {
    return createProduct(category, id, name, price);
  };
}

// Factories especializados
const createBook = createProductFactory("Books");
const createElectronics = createProductFactory("Electronics");

// Usar
const book1 = createBook(1, "TypeScript Handbook", 30);
const laptop = createElectronics(2, "ThinkPad", 1200);

console.log(book1);     // { id: 1, name: "TypeScript Handbook", category: "Books", price: 30 }
console.log(laptop);    // { id: 2, name: "ThinkPad", category: "Electronics", price: 1200 }
```

**Pattern:** Partial para **factory functions** com tipo/categoria fixada.

### Generic Partial Library

```typescript
// Biblioteca genérica de partial
class Partial {
  // Partial fixando primeiro arg
  static first<T, U extends any[], R>(
    fn: (first: T, ...rest: U) => R,
    first: T
  ): (...rest: U) => R {
    return (...rest: U) => fn(first, ...rest);
  }
  
  // Partial fixando último arg
  static last<T extends any[], U, R>(
    fn: (...args: [...T, U]) => R,
    last: U
  ): (...args: T) => R {
    return (...args: T) => fn(...args, last);
  }
  
  // Partial fixando args por índice
  static at<T extends any[], R>(
    fn: (...args: T) => R,
    index: number,
    value: any
  ): (...args: any[]) => R {
    return (...args: any[]) => {
      const fullArgs = [...args];
      fullArgs.splice(index, 0, value);
      return fn(...fullArgs as T);
    };
  }
}

// Uso
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

const multiplyBy2 = Partial.first(multiply, 2);
console.log(multiplyBy2(3, 4));  // 24

const multiplyEndBy4 = Partial.last(multiply, 4);
console.log(multiplyEndBy4(2, 3));  // 24
```

**Library:** Coleção de **partial utilities** para diferentes cenários.

## 🎯 Aplicabilidade e Contextos

### Callback Generation

```typescript
const double = createMultiplier(2);
arr.map(double);
```

**Raciocínio:** Partial para gerar callbacks customizados.

### Configuration Encapsulation

```typescript
const myFetcher = createFetcher(config);
```

**Raciocínio:** Fixar configuração, reutilizar função.

### Event Handlers

```typescript
const clickHandler = createHandler("click", "btn1");
button.addEventListener("click", clickHandler);
```

**Raciocínio:** Partial para event handlers especializados.

## ⚠️ Limitações e Considerações Teóricas

### Memory Overhead

```typescript
// Cada partial cria closure - overhead
const partials = Array.from({ length: 1000 }, (_, i) =>
  createMultiplier(i)  // 1000 closures
);
```

**Limitação:** Closures consomem memória - avaliar em loops grandes.

### Type Complexity

```typescript
// Tipos complexos com muitos generics
type Partial<F, A> = F extends (a: A, ...rest: infer R) => infer Ret ? ...
```

**Consideração:** Types muito complexos dificultam manutenção.

### Debugging Difficulty

```typescript
// Stack traces com partial - menos claros
const result = partial(fn)(arg1, arg2);
```

**Consideração:** Debugging com closures aninhados é harder.

## 🔗 Interconexões Conceituais

**Relação com Closures:** Partial application usa closures.

**Relação com Currying:** Conceitos relacionados mas distintos.

**Relação com Higher-Order Functions:** Partial é HOF.

**Relação com Factory Pattern:** Partial implementa factories.

**Relação com Functional Programming:** Fundamento de FP.

## 🚀 Evolução e Próximos Conceitos

Dominar fixar parâmetros prepara para:
- **Retornar Função Restante:** Implementação de partial
- **Benefícios Reutilização:** Patterns avançados
- **Currying:** Técnica relacionada
- **Function Composition:** Combinar partials
