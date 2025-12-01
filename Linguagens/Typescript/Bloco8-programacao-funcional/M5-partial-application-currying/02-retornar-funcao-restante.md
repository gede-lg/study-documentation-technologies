# Retornar Função que Aceita Outros Parâmetros

## 🎯 Introdução e Definição

### Definição Conceitual

**Retornar função que aceita outros parâmetros** refere-se ao padrão de **função retornando função** onde a função retornada aceita **parâmetros restantes** não fornecidos originalmente. Diferentemente de retornar valor direto, função retorna **nova função** - closure captura contexto, função retornada completa operação com parâmetros adicionais.

Conceitualmente, este pattern implementa **staged computation** - computação em **múltiplas etapas**. Primeira etapa recebe alguns argumentos, retorna função. Segunda etapa (função retornada) recebe argumentos restantes, executa computação completa. TypeScript garante **type safety** - tipos de parâmetros e retorno são verificados em cada etapa.

**Fundamento teórico:** Retornar função restante é base de **currying** e **partial application**. Closure captura estado da primeira chamada, função retornada combina estado capturado + novos args para completar operação. Pattern promove **composability** - funções podem ser combinadas e reutilizadas de formas diferentes.

**Pattern básico:**
```
function outer(a: A): (b: B) => R {
  return (b: B) => {
    // Usa 'a' (capturado) e 'b' (novo)
    return resultado;
  };
}
```

### Contexto Histórico e Evolução

**Lambda Calculus (1930s - Alonzo Church):** Fundamento matemático de **funções retornando funções**.

```
λx.λy.x + y
```

Função que recebe `x`, retorna função que recebe `y`, retorna `x + y`.

**Scheme (1975):** Closures como **first-class citizens**.

```scheme
; Scheme - closure retornando closure
(define (make-adder n)
  (lambda (x) (+ n x)))

(define add5 (make-adder 5))
(add5 3)  ; => 8
```

**Haskell (1990):** Todas funções **automaticamente curried**.

```haskell
-- Haskell - funções curried por padrão
add :: Int -> Int -> Int
add x y = x + y

-- Equivalente a:
add :: Int -> (Int -> Int)
add x = \y -> x + y

-- Uso
add5 = add 5  -- Retorna função (Int -> Int)
add5 3  -- => 8
```

**JavaScript ES3 (1999):** Closures suportados - retornar função manualmente.

```javascript
// JavaScript - função retornando função
function makeAdder(n) {
  return function(x) {
    return n + x;
  };
}

var add5 = makeAdder(5);
console.log(add5(3));  // 8
```

**JavaScript ES6 (2015):** **Arrow functions** simplificam syntax.

```javascript
// ES6 - arrow function concisa
const makeAdder = n => x => n + x;

const add5 = makeAdder(5);
console.log(add5(3));  // 8
```

**TypeScript 1.0 (2012):** Type annotations para funções retornadas.

```typescript
// TypeScript - tipos para função retornada
function makeAdder(n: number): (x: number) => number {
  return (x: number) => n + x;
}

const add5 = makeAdder(5);  // Type: (x: number) => number
console.log(add5(3));  // 8
```

**TypeScript 2.0 (2016):** **Generic rest parameters** em funções retornadas.

```typescript
// Rest parameters em função retornada
function partial<T, U extends any[], R>(
  fn: (first: T, ...rest: U) => R,
  first: T
): (...rest: U) => R {
  return (...rest: U) => fn(first, ...rest);
}
```

**TypeScript 4.0 (2020):** **Variadic tuple types** - tipos mais precisos.

```typescript
// Variadic tuples para tipos precisos
type Curry<F> = F extends (a: infer A, ...rest: infer R) => infer Ret
  ? R extends []
    ? (a: A) => Ret
    : (a: A) => Curry<(...args: R) => Ret>
  : never;
```

**Evolução de práticas:**

**Era JavaScript (sem tipos):**
```javascript
// Sem type safety
const curry = fn => a => b => fn(a, b);
```

**Era TypeScript (tipado):**
```typescript
// Type safety completo
function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R {
  return (a: A) => (b: B) => fn(a, b);
}
```

### Problema Fundamental que Resolve

Retornar função restante resolve problemas de **staged computation**, **configuration accumulation**, e **callback customization**.

**Problema 1: Computação em múltiplas etapas**
```typescript
// Sem retornar função - todos args de uma vez
function processData(config: Config, data: Data): Result {
  return transform(data, config);
}

// Precisa config e data juntos ❌
const result = processData(config, data);
```

**Solução: Retornar função com config capturado**
```typescript
// Retornar função - configuração primeiro, dados depois
function createProcessor(config: Config): (data: Data) => Result {
  return (data: Data) => transform(data, config);
}

// Criar processor com config
const myProcessor = createProcessor(config);

// Usar com diferentes dados
const result1 = myProcessor(data1);
const result2 = myProcessor(data2);
// ✅ Config reutilizado
```

**Problema 2: Callback com contexto**
```typescript
// Sem retornar função - contexto inline
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const tripled = numbers.map(n => n * 3);

// Repetir multiplicação inline ❌
```

**Solução: Retornar função multiplier**
```typescript
// Retornar função - multiplier reutilizável
function createMultiplier(factor: number): (value: number) => number {
  return (value: number) => value * factor;
}

// Criar multipliers
const double = createMultiplier(2);
const triple = createMultiplier(3);

// Usar em map
const doubled = numbers.map(double);
const tripled = numbers.map(triple);
// ✅ Multipliers reutilizáveis
```

**Problema 3: Acumular configuração progressivamente**
```typescript
// Sem retornar função - toda configuração de uma vez
function sendRequest(
  baseUrl: string,
  headers: Headers,
  method: string,
  body: any
): Promise<Response> {
  return fetch(`${baseUrl}`, { headers, method, body });
}

// Precisa todos args ❌
```

**Solução: Retornar funções progressivamente**
```typescript
// Retornar função - configuração progressiva
function createClient(baseUrl: string) {
  return (headers: Headers) => {
    return (method: string) => {
      return (body: any) => {
        return fetch(baseUrl, { headers, method, body });
      };
    };
  };
}

// Configurar progressivamente
const client = createClient("https://api.example.com");
const withAuth = client({ Authorization: "Bearer token" });
const postRequest = withAuth("POST");

// Usar
const response = await postRequest({ name: "John" });
// ✅ Configuração acumulada
```

**Fundamento teórico:** Retornar função permite **acumular contexto** - cada etapa adiciona informação, função final usa tudo.

### Importância no Ecossistema

Retornar função restante é crucial porque:

- **Staged Computation:** Computação em múltiplas etapas
- **Configuration Accumulation:** Acumular config progressivamente
- **Closure State:** Capturar estado em closure
- **Callback Generation:** Gerar callbacks customizados
- **Code Reuse:** Reutilizar função com diferentes contextos
- **Functional Composition:** Base de função composition
- **Type Safety:** TypeScript garante tipos em cada etapa
- **API Design:** Criar APIs fluentes e modulares

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Function Return:** Função retornando função
2. **Closure Capture:** Capturar parâmetros em closure
3. **Staged Computation:** Computação multi-etapa
4. **Type Safety:** Tipos verificados em cada etapa
5. **Progressive Configuration:** Configuração progressiva

### Pilares Fundamentais

- **Outer Function:** Recebe primeiros parâmetros
- **Inner Function:** Aceita parâmetros restantes
- **Closure:** Captura contexto outer
- **Combination:** Combina capturado + novos
- **Generic Types:** Tipos parametrizados

### Visão Geral das Nuances

- **Single Stage:** Um nível de retorno
- **Multi-Stage:** Múltiplos níveis (currying)
- **Type Inference:** TypeScript infere tipos
- **Arrow Functions:** Syntax concisa
- **Async Returns:** Retornar async functions

## 🧠 Fundamentos Teóricos

### Basic Function Return

```typescript
// Função básica retornando função
function createGreeter(greeting: string): (name: string) => string {
  return (name: string) => `${greeting}, ${name}!`;
}

// Criar greeters
const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");
const sayGoodbye = createGreeter("Goodbye");

// Usar
console.log(sayHello("Alice"));    // "Hello, Alice!"
console.log(sayHi("Bob"));         // "Hi, Bob!"
console.log(sayGoodbye("Charlie")); // "Goodbye, Charlie!"
```

**Análise:**

**Closure:** `greeting` capturado na closure de função retornada
**Type:** Função retornada tipada como `(name: string) => string`
**Reuse:** `sayHello` pode ser reutilizado múltiplas vezes

### Multiple Parameters Return

```typescript
// Função retornando função com múltiplos params restantes
function createCalculator(operation: string): (a: number, b: number) => number {
  return (a: number, b: number) => {
    switch (operation) {
      case "add": return a + b;
      case "subtract": return a - b;
      case "multiply": return a * b;
      case "divide": return a / b;
      default: throw new Error("Invalid operation");
    }
  };
}

// Criar calculators
const add = createCalculator("add");
const multiply = createCalculator("multiply");

// Usar
console.log(add(5, 3));        // 8
console.log(multiply(4, 7));   // 28
```

**Pattern:** Função retornada aceita **múltiplos parâmetros restantes**.

### Arrow Function Syntax

```typescript
// Arrow function para syntax concisa
const createMultiplier = (factor: number) => (value: number) => value * factor;

// Equivalente a:
function createMultiplier2(factor: number): (value: number) => number {
  return (value: number) => value * factor;
}

// Usar
const double = createMultiplier(2);
console.log(double(5));  // 10
```

**Concisão:** Arrow functions tornam pattern mais conciso.

### Princípios e Conceitos Subjacentes

#### Generic Function Return

```typescript
// Genérico - funciona com qualquer tipo
function createPair<T>(first: T): <U>(second: U) => [T, U] {
  return <U>(second: U): [T, U] => [first, second];
}

// Uso
const pairWithNumber = createPair(5);

const pair1 = pairWithNumber("hello");  // [5, "hello"]
const pair2 = pairWithNumber(true);     // [5, true]

console.log(pair1);  // [5, "hello"]
console.log(pair2);  // [5, true]
```

**Generic:** `<T, U>` permite trabalhar com quaisquer tipos.

#### Currying Pattern

```typescript
// Currying - múltiplos níveis de retorno
function curry3<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R
): (a: A) => (b: B) => (c: C) => R {
  return (a: A) => (b: B) => (c: C) => fn(a, b, c);
}

// Uso
function sum(a: number, b: number, c: number): number {
  return a + b + c;
}

const curriedSum = curry3(sum);

const step1 = curriedSum(1);      // (b: number) => (c: number) => number
const step2 = step1(2);           // (c: number) => number
const result = step2(3);          // 6

console.log(result);  // 6

// Ou direto
console.log(curriedSum(1)(2)(3));  // 6
```

**Currying:** Transformar função multi-param em **sequência de funções** single-param.

### Rest Parameters in Returned Function

```typescript
// Função retornada com rest parameters
function createLogger(prefix: string): (...messages: string[]) => void {
  return (...messages: string[]) => {
    console.log(`[${prefix}]`, ...messages);
  };
}

// Criar loggers
const infoLog = createLogger("INFO");
const errorLog = createLogger("ERROR");

// Usar
infoLog("Application started");                    // [INFO] Application started
infoLog("Processing", "data", "successfully");    // [INFO] Processing data successfully
errorLog("Connection failed");                     // [ERROR] Connection failed
```

**Rest parameters:** Função retornada aceita **arbitrary number** de args.

### Optional Parameters Return

```typescript
// Função retornada com parâmetros opcionais
function createFormatter(prefix: string): (value: string, suffix?: string) => string {
  return (value: string, suffix?: string) => {
    return suffix ? `${prefix}${value}${suffix}` : `${prefix}${value}`;
  };
}

// Criar formatters
const dollarFormat = createFormatter("$");
const percentFormat = createFormatter("");

// Usar
console.log(dollarFormat("100"));         // "$100"
console.log(percentFormat("50", "%"));    // "50%"
```

**Optional:** Função retornada pode ter **parâmetros opcionais**.

### Async Function Return

```typescript
// Retornar async function
function createFetcher(baseUrl: string): (endpoint: string) => Promise<any> {
  return async (endpoint: string) => {
    const response = await fetch(`${baseUrl}${endpoint}`);
    return response.json();
  };
}

// Criar fetcher
const apiFetcher = createFetcher("https://api.example.com");

// Usar
const users = await apiFetcher("/users");
const posts = await apiFetcher("/posts");
```

**Async:** Função retornada pode ser **async** - retorna `Promise`.

### State Encapsulation

```typescript
// Função retornada com estado privado
function createCounter(initialValue: number): () => number {
  let count = initialValue;  // Estado privado
  
  return () => {
    count++;
    return count;
  };
}

// Criar counters
const counter1 = createCounter(0);
const counter2 = createCounter(10);

// Usar
console.log(counter1());  // 1
console.log(counter1());  // 2
console.log(counter2());  // 11
console.log(counter1());  // 3
console.log(counter2());  // 12
```

**Encapsulation:** Closure encapsula **estado privado** - não acessível externamente.

### Modelo Mental para Compreensão

Pense em retornar função como **receita em duas partes**:

**Outer function:** Preparação - "Separe ingredientes A e B"
**Inner function:** Execução - "Adicione ingrediente C e cozinhe"
**Closure:** Ingredientes A e B ficam prontos, esperando C

**Analogia - Formulário Multi-etapa:**

**Etapa 1 (outer):** Preencher informações pessoais
**Etapa 2 (inner):** Preencher informações de pagamento
**Closure:** Informações pessoais salvas, esperando pagamento

**Metáfora - Configuração de Máquina:**

**Outer function:** Configurar temperatura e velocidade
**Inner function:** Inserir material a processar
**Closure:** Configurações salvas, máquina pronta para material

**Fluxo de execução:**
```
1. Chamar outer function: outer(arg1)
2. Outer captura arg1 em closure
3. Outer retorna inner function
4. Chamar inner function: inner(arg2)
5. Inner acessa arg1 (closure) + arg2 (novo)
6. Inner executa lógica combinada
7. Inner retorna resultado
```

**Exemplo concreto:**
```typescript
// 1. Definir outer
function createEmailer(from: string) {
  // 2. Retornar inner
  return (to: string, message: string) => {
    // 3. Inner usa 'from' (closure) + 'to', 'message' (novos)
    console.log(`From: ${from}`);
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
  };
}

// 4. Chamar outer - retorna inner
const myEmailer = createEmailer("me@example.com");

// 5. Chamar inner - usa closure + novos args
myEmailer("you@example.com", "Hello!");
// From: me@example.com (closure)
// To: you@example.com (novo)
// Message: Hello! (novo)
```

## 🔍 Análise Conceitual Profunda

### Builder Pattern with Function Return

```typescript
// Builder pattern usando função retornada
interface QueryBuilder {
  select: (fields: string[]) => {
    from: (table: string) => {
      where: (condition: string) => {
        build: () => string;
      };
    };
  };
}

function createQueryBuilder(): QueryBuilder["select"] {
  return (fields: string[]) => {
    const selectedFields = fields.join(", ");
    
    return {
      from: (table: string) => {
        return {
          where: (condition: string) => {
            return {
              build: () => {
                return `SELECT ${selectedFields} FROM ${table} WHERE ${condition}`;
              }
            };
          }
        };
      }
    };
  };
}

// Usar
const query = createQueryBuilder();
const sql = query
  .select(["id", "name", "email"])
  .from("users")
  .where("age > 18")
  .build();

console.log(sql);
// "SELECT id, name, email FROM users WHERE age > 18"
```

**Pattern:** Retornar objetos com métodos que retornam objetos - **fluent API**.

#### Memoization with Function Return

```typescript
// Memoization usando função retornada
function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log("Cache hit");
      return cache.get(key)!;
    }
    
    console.log("Computing...");
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Uso
function expensiveCalculation(n: number): number {
  return n * n * n;
}

const memoized = memoize(expensiveCalculation);

console.log(memoized(5));  // Computing... 125
console.log(memoized(5));  // Cache hit 125
console.log(memoized(3));  // Computing... 27
console.log(memoized(5));  // Cache hit 125
```

**Pattern:** Função retornada mantém **cache** em closure.

### Throttle and Debounce

```typescript
// Throttle - limitar frequência de chamadas
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

// Debounce - esperar silêncio antes de executar
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Uso
const logThrottled = throttle(console.log, 1000);
const logDebounced = debounce(console.log, 1000);

// Throttle - máximo 1 chamada/segundo
logThrottled("1");  // Executa
logThrottled("2");  // Ignorado (< 1s)
setTimeout(() => logThrottled("3"), 1100);  // Executa (> 1s)

// Debounce - espera 1s de silêncio
logDebounced("1");  // Timer inicia
logDebounced("2");  // Timer reinicia
logDebounced("3");  // Timer reinicia
// Após 1s de silêncio: executa "3"
```

**Pattern:** Função retornada controla **timing** de execução.

#### Partial Application Generic

```typescript
// Partial application genérico
function partial<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R,
  a: A
): (b: B, c: C) => R {
  return (b: B, c: C) => fn(a, b, c);
}

// Uso
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

const multiplyBy2 = partial(multiply, 2);

console.log(multiplyBy2(3, 4));  // 24 (2 * 3 * 4)
console.log(multiplyBy2(5, 6));  // 60 (2 * 5 * 6)
```

**Pattern:** Partial application via função retornada.

### Event Emitter with Closures

```typescript
// Event emitter usando closures
function createEventEmitter<T extends Record<string, any[]>>() {
  const listeners: {
    [K in keyof T]?: Array<(...args: T[K]) => void>
  } = {};
  
  return {
    on<K extends keyof T>(event: K, callback: (...args: T[K]) => void) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event]!.push(callback);
    },
    
    emit<K extends keyof T>(event: K, ...args: T[K]) {
      if (listeners[event]) {
        listeners[event]!.forEach(callback => callback(...args));
      }
    }
  };
}

// Uso
type Events = {
  message: [string];
  error: [Error];
  data: [number, string];
};

const emitter = createEventEmitter<Events>();

emitter.on("message", (msg) => console.log("Message:", msg));
emitter.on("error", (err) => console.error("Error:", err.message));
emitter.on("data", (num, str) => console.log("Data:", num, str));

emitter.emit("message", "Hello");           // Message: Hello
emitter.emit("error", new Error("Oops"));   // Error: Oops
emitter.emit("data", 42, "answer");         // Data: 42 answer
```

**Pattern:** Métodos retornados compartilham estado via closure.

#### Lazy Evaluation

```typescript
// Lazy evaluation - computar apenas quando necessário
function lazy<T>(computation: () => T): () => T {
  let cached: T | undefined;
  let computed = false;
  
  return () => {
    if (!computed) {
      console.log("Computing...");
      cached = computation();
      computed = true;
    }
    return cached!;
  };
}

// Uso
const expensiveComputation = () => {
  // Simulação de computação cara
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
};

const lazyValue = lazy(expensiveComputation);

// Não computa ainda
console.log("Lazy value created");

// Primeira chamada - computa
const result1 = lazyValue();  // Computing...

// Segunda chamada - retorna cached
const result2 = lazyValue();  // Sem "Computing..."
```

**Pattern:** Função retornada **adia** computação até necessário.

### Compose with Function Return

```typescript
// Compose - combinar funções da direita para esquerda
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Uso
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

const composed = compose(
  square,
  compose(double, addOne)
);

console.log(composed(3));  // ((3 + 1) * 2)^2 = 64
```

**Pattern:** Retornar função que **compõe** outras funções.

#### Auto-currying

```typescript
// Auto-currying - detectar se todos args fornecidos
function autoCurry<T extends any[], R>(
  fn: (...args: T) => R
): (...args: Partial<T>) => any {
  return (...args: any[]) => {
    if (args.length >= fn.length) {
      return fn(...args as T);
    }
    return autoCurry(fn.bind(null, ...args) as any);
  };
}

// Uso
function sum3(a: number, b: number, c: number): number {
  return a + b + c;
}

const curriedSum = autoCurry(sum3);

// Formas de chamar
console.log(curriedSum(1, 2, 3));     // 6 - todos args
console.log(curriedSum(1)(2, 3));     // 6 - partial
console.log(curriedSum(1, 2)(3));     // 6 - partial
console.log(curriedSum(1)(2)(3));     // 6 - curried completo
```

**Pattern:** Auto-detectar se deve executar ou retornar função.

### Middleware Chain

```typescript
// Middleware chain usando funções retornadas
type Middleware<T> = (value: T) => (next: (value: T) => T) => T;

function createMiddlewareChain<T>(...middlewares: Array<(value: T) => T>) {
  return (initialValue: T): T => {
    return middlewares.reduce(
      (value, middleware) => middleware(value),
      initialValue
    );
  };
}

// Middlewares
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

// Criar chain
const pipeline = createMiddlewareChain(addOne, double, square);

console.log(pipeline(3));  // ((3 + 1) * 2)^2 = 64
```

**Pattern:** Função retornada aplica **chain de transformações**.

### Factory with Validators

```typescript
// Factory com validators usando closures
function createValidator<T>(
  validators: Array<(value: T) => boolean>,
  errorMessages: string[]
): (value: T) => { valid: boolean; errors: string[] } {
  return (value: T) => {
    const errors: string[] = [];
    
    validators.forEach((validator, index) => {
      if (!validator(value)) {
        errors.push(errorMessages[index]);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  };
}

// Uso
const validateAge = createValidator<number>(
  [
    (age) => age >= 0,
    (age) => age <= 120,
    (age) => Number.isInteger(age)
  ],
  [
    "Age must be non-negative",
    "Age must be at most 120",
    "Age must be an integer"
  ]
);

console.log(validateAge(25));    // { valid: true, errors: [] }
console.log(validateAge(-5));    // { valid: false, errors: ["Age must be non-negative"] }
console.log(validateAge(150));   // { valid: false, errors: ["Age must be at most 120"] }
console.log(validateAge(25.5));  // { valid: false, errors: ["Age must be an integer"] }
```

**Pattern:** Closure captura validators, função valida valores.

## 🎯 Aplicabilidade e Contextos

### Configuration Builders

```typescript
const fetcher = createFetcher(baseUrl);
const data = await fetcher("/endpoint");
```

**Raciocínio:** Configuração fixada, endpoint variável.

### Callback Generation

```typescript
const double = createMultiplier(2);
arr.map(double);
```

**Raciocínio:** Gerar callbacks especializados.

### Fluent APIs

```typescript
query.select(fields).from(table).where(condition);
```

**Raciocínio:** Métodos retornando objetos com métodos.

## ⚠️ Limitações e Considerações Teóricas

### Memory Overhead

```typescript
// Cada closure captura contexto - overhead
const fns = Array.from({ length: 1000 }, (_, i) =>
  createAdder(i)  // 1000 closures
);
```

**Limitação:** Closures consomem memória.

### Debugging Complexity

```typescript
// Stack traces com closures aninhados - complexos
const result = outer(a)(b)(c);
```

**Consideração:** Debugging multi-level mais difícil.

### Type Inference Limits

```typescript
// Tipos muito aninhados - difícil inferência
const x = a(1)(2)(3)(4)(5);
```

**Limitação:** TypeScript pode perder tipos em níveis profundos.

## 🔗 Interconexões Conceituais

**Relação com Closures:** Fundamenta pattern.

**Relação com Partial Application:** Implementa partial.

**Relação com Currying:** Base de currying.

**Relação com Higher-Order Functions:** Funções retornando funções são HOF.

**Relação com Factory Pattern:** Factories retornam funções.

## 🚀 Evolução e Próximos Conceitos

Dominar retornar função prepara para:
- **Benefícios de Reutilização:** Patterns avançados
- **Currying Completo:** Auto-currying
- **Function Composition:** Combinar funções
- **Monads:** Patterns funcionais avançados
