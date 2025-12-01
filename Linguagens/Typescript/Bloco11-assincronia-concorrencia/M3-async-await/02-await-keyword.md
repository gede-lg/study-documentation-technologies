# Await Keyword

## 🎯 Introdução e Definição

### Definição Conceitual

**Await keyword** é **operador unário** que **pausa execução** de async function até Promise **resolver ou rejeitar**. Await **unwraps Promise** - transforma `Promise<T>` em `T`, extraindo valor resolvido. Await **só funciona** dentro de **async functions** (ou top-level modules ES2022+). Quando await encontra Promise, **pausa execução** da função atual, **yielding control** ao event loop, permitindo outras operações executarem. Quando Promise resolve, execução **resume** da linha seguinte com valor resolvido.

Conceitualmente, await implementa **synchronous-looking asynchronous execution** - código assíncrono escrito como se fosse síncrono. Await é **non-blocking** - pausa apenas async function atual, não bloqueia thread principal. Implementa **automatic Promise unwrapping** - elimina necessidade de `.then()` chains. Await executa **type-safe Promise unwrapping** - TypeScript infere tipo unwrapped automaticamente.

**Fundamento teórico:** Await deriva de **coroutine suspension** - pausar execução preservando estado local. Implementa **promise unwrapping semantics** - `await promise` retorna valor resolvido ou lança erro rejeitado. Funciona com **microtask queue** - Promise resolution schedulada como microtask. Await é **syntactic sugar** - compilador transforma em `.then()` callback, sem nova semântica runtime.

**Pattern básico:**
```typescript
// Await unwraps Promise<T> → T

// Sem await - trabalhar com Promise ❌
async function withoutAwait(): Promise<void> {
  const userPromise: Promise<User> = fetchUser(123);
  
  // userPromise é Promise, não User
  // Precisa .then() para acessar valor
  userPromise.then(user => {
    console.log(user.name);
  });
}

// Com await - trabalhar com valor diretamente ✅
async function withAwait(): Promise<void> {
  const user: User = await fetchUser(123);
  
  // user é User, não Promise
  // Pode acessar propriedades diretamente
  console.log(user.name);
}

// Await transforma Promise<User> em User
// Código parece síncrono, execução assíncrona
```

**Await unwraps Promise:**
```typescript
// Await extrai valor de Promise

async function example(): Promise<void> {
  // fetchData retorna Promise<string>
  const dataPromise = fetchData();  // Type: Promise<string>
  
  // await unwraps Promise<string> → string
  const data = await fetchData();  // Type: string
  
  console.log(data.toUpperCase());  // Pode usar como string normal
}

// Type transformation:
// Promise<T> → (await) → T
```

**Await pauses execution:**
```typescript
// Await pausa execução até Promise resolver

async function demonstratePause(): Promise<void> {
  console.log("1. Before await");
  
  const result = await delay(1000);  // PAUSE por 1 segundo
  
  console.log("2. After await");  // Só executa após Promise resolver
}

/*
Output:
1. Before await
[1 segundo pause]
2. After await

Execução pausa em await, resume quando Promise resolve
*/
```

**Await with non-Promise values:**
```typescript
// Await funciona com não-Promises também

async function awaitNonPromise(): Promise<void> {
  // Valor não-Promise wrapped em Promise.resolve()
  const x = await 42;  // Promise.resolve(42) → 42
  const y = await "hello";  // Promise.resolve("hello") → "hello"
  
  console.log(x);  // 42
  console.log(y);  // "hello"
}

// Await wraps non-Promises automaticamente
// Útil para code consistency
```

### Contexto Histórico e Evolução

**ES2015 (ES6):** Generators permitiram pause/resume.

```javascript
// ES6 - generators (precursor de await)
function* generatorFunc() {
  const result = yield fetchData();
  console.log(result);
}

// yield pausa, await refina conceito
```

**ES2017 (ES8, 2017):** Await introduzido com async/await.

```javascript
// ES2017 - await keyword
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Await unwraps Promises
```

**TypeScript 1.7 (2015):** Async/await support (transpiled).

```typescript
// TypeScript 1.7 - await para ES5/ES6
async function getData(): Promise<Data> {
  const result = await fetchData();
  return result;
}

// Transpila para .then() chains
```

**TypeScript 2.1 (2016):** Downlevel async/await.

```typescript
// TypeScript 2.1 - await transpilation melhorada
async function example() {
  const x = await promise1();
  const y = await promise2(x);
  return y;
}

// Transpila eficientemente para ES3/ES5
```

**TypeScript 4.1 (2020):** Better Promise unwrapping.

```typescript
// TypeScript 4.1 - type unwrapping melhorado
async function getNumber(): Promise<number> {
  const result = await Promise.resolve(42);
  return result;  // Type: number (unwrapped corretamente)
}
```

**ES2022 (2022):** Top-level await em modules.

```typescript
// ES2022 - top-level await
const data = await fetchData();  // Sem async function wrapper

// Apenas em ES modules
export const config = await loadConfig();
```

**TypeScript 4.5 (2021):** Awaited<T> utility type.

```typescript
// TypeScript 4.5 - Awaited type helper
type UnwrappedType = Awaited<Promise<number>>;  // number

async function getValue(): Promise<number> {
  return 42;
}

type Result = Awaited<ReturnType<typeof getValue>>;  // number
```

### Problema Fundamental que Resolve

Await resolve problemas de **Promise chaining verbosity**, **callback nesting**, **error handling complexity**, e **code readability**.

**Problema 1: Promise Chaining Verbosity**
```typescript
// Promise chains - verbose e difícil seguir ❌

function fetchUserData(userId: number): Promise<UserData> {
  return fetchUser(userId)
    .then(user => {
      return fetchPosts(user.id)
        .then(posts => {
          return {
            user,
            posts
          };
        });
    });
}

// ✗ Nested .then() chains
// ✗ Variáveis em closures diferentes
// ✗ Difícil rastrear fluxo
```

**Solução: Await - flat linear code**
```typescript
// Await - código linear e limpo ✅

async function fetchUserData(userId: number): Promise<UserData> {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.id);
  
  return {
    user,
    posts
  };
}

// ✓ Código flat, sem nesting
// ✓ Variáveis em escopo natural
// ✓ Fluxo fácil de seguir
```

**Problema 2: Error Propagation Complex**
```typescript
// Promise chains - error handling espalhado ❌

function processData(data: RawData): Promise<Result> {
  return validateData(data)
    .then(validated => {
      return transformData(validated)
        .then(transformed => {
          return saveData(transformed);
        })
        .catch(transformError => {
          console.error("Transform failed:", transformError);
          throw transformError;
        });
    })
    .catch(validationError => {
      console.error("Validation failed:", validationError);
      throw validationError;
    });
}

// ✗ Múltiplos .catch() aninhados
// ✗ Error handling duplicado
```

**Solução: Await com try/catch**
```typescript
// Await - error handling simples ✅

async function processData(data: RawData): Promise<Result> {
  try {
    const validated = await validateData(data);
    const transformed = await transformData(validated);
    const saved = await saveData(transformed);
    return saved;
  } catch (error) {
    console.error("Processing failed:", error);
    throw error;
  }
}

// ✓ Single try/catch
// ✓ Error handling centralizado
// ✓ Código limpo
```

**Problema 3: Intermediate Values Lost**
```typescript
// Promise chains - perder valores intermediários ❌

function calculateTotal(userId: number): Promise<number> {
  return fetchUser(userId)
    .then(user => {
      return fetchOrders(user.id)
        .then(orders => {
          // Como acessar 'user' aqui?
          // Precisa passar em closure ou re-fetch
          return orders.reduce((sum, order) => sum + order.total, 0);
        });
    });
}

// ✗ Valores intermediários perdidos em escopo
```

**Solução: Await mantém todas variáveis em escopo**
```typescript
// Await - variáveis naturalmente em escopo ✅

async function calculateTotal(userId: number): Promise<number> {
  const user = await fetchUser(userId);
  const orders = await fetchOrders(user.id);
  
  // 'user' e 'orders' ambos acessíveis
  console.log(`Total for ${user.name}:`);
  
  return orders.reduce((sum, order) => sum + order.total, 0);
}

// ✓ Todas variáveis em escopo
// ✓ Código natural
```

**Problema 4: Type Inference Difficulties**
```typescript
// Promise chains - tipos difíceis de inferir ❌

fetchUser(123)
  .then(user => {
    // Type: User
    return fetchPosts(user.id);
  })
  .then(posts => {
    // Type: Post[]
    // Como tipar 'user' aqui? Perdido!
    return posts.map(post => post.title);
  });

// ✗ Tipos perdidos entre .then() chains
```

**Solução: Await - type inference natural**
```typescript
// Await - TypeScript infere tipos automaticamente ✅

async function example(): Promise<string[]> {
  const user = await fetchUser(123);  // Type: User
  const posts = await fetchPosts(user.id);  // Type: Post[]
  
  // Ambos tipos disponíveis
  return posts.map(post => post.title);  // Type: string[]
}

// ✓ TypeScript infere todos tipos
// ✓ Autocomplete funciona
```

**Fundamento teórico:** Await implementa **synchronous-style async code** - escrever código assíncrono com sintaxe síncrona, melhorando **readability, maintainability, type safety**.

### Importância no Ecossistema

Await é importante porque:

- **Readability:** Código assíncrono legível como síncrono
- **Type safety:** TypeScript infere tipos unwrapped
- **Error handling:** try/catch natural funciona
- **Debugging:** Stack traces melhores
- **Variable scope:** Variáveis naturalmente em escopo
- **Standard practice:** Padrão moderno para async
- **Framework support:** React, Vue, Node.js usam await
- **Non-blocking:** Não bloqueia event loop

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Promise unwrapping:** `await Promise<T>` retorna `T`
2. **Execution pause:** Pausa async function até resolve
3. **Only in async:** Funciona apenas em async functions
4. **Non-blocking:** Não bloqueia thread principal
5. **Type safe:** TypeScript infere tipo unwrapped

### Pilares Fundamentais

- **Unary operator:** `await expression`
- **Type transformation:** `Promise<T>` → `T`
- **Execution control:** Pause/resume
- **Error propagation:** Rejection vira throw
- **Microtask scheduling:** Uses microtask queue

### Visão Geral das Nuances

- **Non-Promise values:** Wrapped em Promise.resolve
- **Multiple awaits:** Sequential execution
- **In expressions:** `const x = await promise + 10`
- **Top-level await:** Em ES modules only
- **Thenable support:** Funciona com thenable objects

## 🧠 Fundamentos Teóricos

### Basic Await Usage

```typescript
// Basic await - unwrap Promise

async function basicExample(): Promise<void> {
  // fetchData retorna Promise<string>
  const data: string = await fetchData();
  
  console.log(data.toUpperCase());  // data é string, não Promise
}

// Await transforma Promise<string> em string
```

**Basic:** Await unwraps Promise to value.

### Princípios e Conceitos Subjacentes

#### Await Pauses Execution

```typescript
// Await pausa execução até Promise resolver

async function demonstratePause(): Promise<void> {
  console.log("1. Start");
  
  const result = await delay(1000);  // Pausa 1 segundo
  
  console.log("2. After 1 second");
  console.log(result);
}

/*
Timeline:
0ms: "1. Start" logged
0ms: await delay(1000) - execution pauses
1000ms: Promise resolves, execution resumes
1000ms: "2. After 1 second" logged

Execução pausa em await, resume quando resolve
*/
```

**Pause:** Execution pauses until Promise settles.

#### Await Type Unwrapping

```typescript
// Await unwraps nested Promise types

async function typeUnwrapping(): Promise<void> {
  // Promise<number>
  const promise1: Promise<number> = Promise.resolve(42);
  const value1: number = await promise1;  // unwrap → number
  
  // Promise<Promise<string>>
  const promise2: Promise<Promise<string>> = 
    Promise.resolve(Promise.resolve("hello"));
  const value2: string = await promise2;  // unwrap → string
  
  // Promise<User>
  const promise3: Promise<User> = fetchUser(123);
  const value3: User = await promise3;  // unwrap → User
  
  console.log(value1, value2, value3);
}

// Await recursively unwraps até non-Promise value
```

**Unwrapping:** Await unwraps Promise layers.

### Await with Error Handling

```typescript
// Rejected Promise lança erro quando awaited

async function errorHandling(): Promise<void> {
  try {
    const data = await Promise.reject(new Error("Failed!"));
    // Linha acima lança erro, código abaixo não executa
    console.log(data);  // Nunca executa
  } catch (error) {
    console.error("Caught:", error.message);  // "Failed!"
  }
}

// Await transforma rejection em throw
// Try/catch pega erro normalmente
```

**Error:** Rejection becomes thrown error.

#### Sequential Awaits

```typescript
// Múltiplas awaits executam sequencialmente

async function sequentialAwaits(): Promise<void> {
  console.log("Start");
  
  const result1 = await delay(1000);  // Pausa 1s
  console.log("After 1 second");
  
  const result2 = await delay(1000);  // Pausa mais 1s
  console.log("After 2 seconds");
  
  const result3 = await delay(1000);  // Pausa mais 1s
  console.log("After 3 seconds");
}

/*
Timeline:
0ms: "Start"
1000ms: "After 1 second"
2000ms: "After 2 seconds"
3000ms: "After 3 seconds"

Total: 3 segundos (sequential)
*/
```

**Sequential:** Awaits execute one after another.

### Await in Expressions

```typescript
// Await pode ser usado em expressões

async function awaitInExpressions(): Promise<void> {
  // Arithmetic
  const sum = await fetchNumber() + 10;
  
  // Logical
  const isValid = await checkValid() && await checkPermission();
  
  // Ternary
  const result = await shouldRetry() ? await retry() : null;
  
  // Function call
  const processed = processData(await fetchData());
  
  // Array/Object
  const arr = [await value1(), await value2()];
  const obj = { x: await getX(), y: await getY() };
}

// Await pode aparecer em qualquer expression position
```

**Expressions:** Await works in expressions.

#### Await Non-Promise Values

```typescript
// Await funciona com valores não-Promise

async function awaitNonPromises(): Promise<void> {
  // Primitives - wrapped em Promise.resolve
  const num = await 42;  // Promise.resolve(42) → 42
  const str = await "hello";  // Promise.resolve("hello") → "hello"
  const bool = await true;  // Promise.resolve(true) → true
  
  // Objects
  const obj = await { x: 10 };  // Promise.resolve({ x: 10 }) → { x: 10 }
  
  // Functions (not called)
  const fn = await (() => 42);  // Promise.resolve(fn) → fn
  
  console.log(num, str, bool, obj);
}

// Non-Promises automaticamente wrapped
// Útil para code consistency
```

**Non-Promise:** Auto-wrapped in Promise.resolve.

### Real-World Example - Data Pipeline

```typescript
// Real-world - sequential data processing pipeline

interface RawData {
  id: number;
  content: string;
}

interface ValidatedData extends RawData {
  isValid: true;
}

interface TransformedData {
  id: number;
  processed: string;
  timestamp: number;
}

async function processDataPipeline(id: number): Promise<TransformedData> {
  try {
    // Step 1: Fetch raw data
    console.log(`Fetching data ${id}...`);
    const rawData: RawData = await fetchRawData(id);
    
    // Step 2: Validate
    console.log("Validating...");
    const validatedData: ValidatedData = await validateData(rawData);
    
    // Step 3: Transform
    console.log("Transforming...");
    const transformedData: TransformedData = await transformData(validatedData);
    
    // Step 4: Save
    console.log("Saving...");
    await saveData(transformedData);
    
    console.log("Pipeline complete");
    return transformedData;
  } catch (error) {
    console.error("Pipeline failed:", error);
    throw error;
  }
}

// Usage
const result = await processDataPipeline(123);
console.log(result);

// Cada await pausa até step completar
// Sequential processing, easy to follow
```

**Real-World:** Sequential async data pipeline.

#### Modelo Mental para Compreensão

Pense em await como **checkpoint**:

**Checkpoint (await):** Pause aqui
**Promise:** Ticket to resume
**Event loop:** Manages waiting
**Resolution:** Resume execution
**Value:** Unwrapped result

**Analogia - Airport Security:**

**Enter line (call async):** Start process
**Checkpoint (await):** Wait your turn
**Line (Promise):** Queue of people
**Pass through (resolve):** Get value, continue
**Delayed (pending):** Still waiting
**Rejected (security issue):** Error thrown

**Metáfora - Train Station:**

**Platform (async function):** Where you wait
**Train (Promise):** Arrives eventually
**Await (waiting):** Pause until train arrives
**Board train (resolve):** Get on with value
**Train departs (resume):** Continue journey

**Fluxo visual:**
```
Await Execution Flow:

async function example() {
  console.log("1");  ← Execute immediately
  
  const x = await promise;  ← PAUSE aqui
                              │
                              ├─ Promise pending
                              │  Event loop continues
                              │  Other code runs
                              │
                              └─ Promise resolves
                                 ↓
  console.log("2", x);  ← RESUME com value
  
  return x;
}
```

## 🔍 Análise Conceitual Profunda

### Await vs .then()

```typescript
// Await vs .then() - equivalentes

// Com .then() ❌
function withThen(): Promise<void> {
  return fetchData()
    .then(data => {
      console.log(data);
      return processData(data);
    })
    .then(processed => {
      console.log(processed);
    });
}

// Com await ✅
async function withAwait(): Promise<void> {
  const data = await fetchData();
  console.log(data);
  
  const processed = await processData(data);
  console.log(processed);
}

// Await = syntactic sugar sobre .then()
// Mais legível, mesmo comportamento
```

**Comparison:** Await cleaner than .then().

#### Await Doesn't Block

```typescript
// Await NÃO bloqueia event loop

async function nonBlocking(): Promise<void> {
  console.log("Start async function");
  
  const result = await delay(2000);  // Pausa função, NÃO bloqueia thread
  
  console.log("After await");
}

// Chamar função
nonBlocking();

// Continua executando
console.log("Main thread continues");
setInterval(() => console.log("Tick"), 500);

/*
Output:
Start async function
Main thread continues
Tick  (500ms)
Tick  (1000ms)
Tick  (1500ms)
After await  (2000ms)
Tick  (2000ms)

Event loop continua executando durante await!
*/
```

**Non-blocking:** Await pauses function, not thread.

### Thenable Objects

```typescript
// Await funciona com thenable objects (não só Promises)

interface Thenable<T> {
  then(
    onFulfilled: (value: T) => void,
    onRejected: (error: any) => void
  ): void;
}

const customThenable: Thenable<number> = {
  then(onFulfilled, onRejected) {
    setTimeout(() => onFulfilled(42), 1000);
  }
};

async function awaitThenable(): Promise<void> {
  const value = await customThenable;  // Funciona!
  console.log(value);  // 42
}

// Await funciona com qualquer objeto com .then()
```

**Thenable:** Await works with thenable objects.

#### Top-Level Await

```typescript
// Top-level await em ES modules (ES2022)

// Old way - async IIFE ❌
(async () => {
  const config = await loadConfig();
  const data = await fetchData();
  console.log(config, data);
})();

// New way - top-level await ✅
const config = await loadConfig();
const data = await fetchData();
console.log(config, data);

export const appConfig = config;

// Top-level await apenas em ES modules
// Sem async function wrapper
```

**Top-Level:** Await at module scope (ES2022).

### Await Performance Implications

```typescript
// Awaits sequenciais podem ser lentos

// Slow - sequential ❌ (3 seconds total)
async function sequentialSlow(): Promise<void> {
  const user = await fetchUser(123);      // 1s
  const posts = await fetchPosts(456);    // 1s
  const comments = await fetchComments(); // 1s
  
  // Total: 3 segundos
}

// Fast - parallel ✅ (1 second total)
async function parallelFast(): Promise<void> {
  const [user, posts, comments] = await Promise.all([
    fetchUser(123),      // 1s
    fetchPosts(456),     // 1s
    fetchComments()      // 1s
  ]);
  
  // Total: 1 segundo (concurrent)
}

// Usar await sequencialmente quando operações dependentes
// Usar Promise.all() quando independentes
```

**Performance:** Sequential vs parallel awaits.

## 🎯 Aplicabilidade e Contextos

### API Data Fetching

```typescript
async function fetchUserProfile(id: number): Promise<UserProfile> {
  const user = await fetchUser(id);
  const posts = await fetchPosts(user.id);
  return { user, posts };
}
```

**Raciocínio:** Clean async API calls.

### Sequential Operations

```typescript
async function sequentialSteps(): Promise<Result> {
  const step1 = await doStep1();
  const step2 = await doStep2(step1);
  return step2;
}
```

**Raciocínio:** Dependent operations.

### Error Handling

```typescript
async function safeOperation(): Promise<Data | null> {
  try {
    return await riskyOperation();
  } catch {
    return null;
  }
}
```

**Raciocínio:** Centralized error handling.

## ⚠️ Limitações e Considerações Teóricas

### Only in Async Functions

```typescript
// Await só funciona em async functions

function syncFunction() {
  const data = await fetchData();  // Error: await only in async
}

// Fix: tornar função async
async function asyncFunction() {
  const data = await fetchData();  // OK
}
```

**Limitação:** Await requires async context.

### Cannot Return Awaited

```typescript
// Await desnecessário em return

// Desnecessário ❌
async function unnecessary(): Promise<number> {
  return await fetchNumber();
}

// Melhor ✅
async function better(): Promise<number> {
  return fetchNumber();  // Já retorna Promise
}

// Exceto para try/catch
async function withErrorHandling(): Promise<number> {
  try {
    return await fetchNumber();  // Necessário para catch
  } catch (error) {
    return 0;
  }
}
```

**Consideração:** Avoid unnecessary await.

### Sequential Performance

```typescript
// Cuidado com awaits sequenciais desnecessários

// Slow ❌
async function slow(): Promise<void> {
  const a = await fetch1();  // 1s
  const b = await fetch2();  // 1s (could be parallel!)
}

// Fast ✅
async function fast(): Promise<void> {
  const [a, b] = await Promise.all([fetch1(), fetch2()]);
}
```

**Consideração:** Parallelize independent operations.

## 🔗 Interconexões Conceituais

**Relação com Async Functions:** Requires async context.

**Relação com Promises:** Unwraps Promise values.

**Relação com Try/Catch:** Rejection becomes error.

**Relação com Event Loop:** Uses microtask queue.

**Relação com Type System:** TypeScript infers unwrapped types.

## 🚀 Evolução e Próximos Conceitos

Dominar Await prepara para:
- **Error handling:** try/catch patterns
- **Multiple awaits:** Sequential execution
- **Parallel execution:** Promise.all with await
- **Async loops:** for...of with await
- **Performance:** Optimization strategies
- **Testing:** Async test patterns
