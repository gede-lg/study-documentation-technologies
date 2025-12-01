# Promise Creation

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise** é **objeto que representa eventual conclusão (ou falha) de operação assíncrona**. Conceitualmente, Promise é **placeholder para valor futuro** - não sabemos valor agora, mas teremos depois. Criada com **`new Promise((resolve, reject) => {})`** - executor function que recebe dois callbacks. Promise pode ter três estados: **pending** (aguardando), **fulfilled** (sucesso), **rejected** (erro). Estados são **imutáveis** após transição.

Diferentemente de callbacks tradicionais (pyramid of doom), Promise permite **composição funcional** - encadear operações com `.then()`. Suporta **error propagation** - erros propagam até `.catch()`. Promise é **eager** - executor executa imediatamente na criação. TypeScript fornece type safety com **`Promise<T>`** - tipo genérico para valor resolvido.

**Fundamento teórico:** Promise deriva de **futures pattern** - representar computação que ainda não completou. Implementa **continuation-passing style** - passar função para executar após conclusão. Segue **single assignment principle** - valor definido uma vez. Promise é **monad** - functor com flatMap (`.then()`). Resolve **inversion of control** de callbacks - Promise retorna controle ao caller.

**Pattern básico:**
```typescript
// Promise creation - executor function

const promise = new Promise<string>((resolve, reject) => {
  // Executor executa imediatamente
  
  // Operação assíncrona (setTimeout simula)
  setTimeout(() => {
    const success = Math.random() > 0.5;
    
    if (success) {
      resolve("Operação bem-sucedida!");  // Fulfill promise
    } else {
      reject(new Error("Operação falhou"));  // Reject promise
    }
  }, 1000);
});

// Promise<string> - tipo do valor resolvido
```

**Estados Promise:**
- **Pending:** Estado inicial - aguardando conclusão
- **Fulfilled:** Operação completada com sucesso - `resolve(value)`
- **Rejected:** Operação falhou - `reject(error)`

**Transição de estados (imutável):**
```
Pending → Fulfilled (resolve)
Pending → Rejected (reject)

✗ Fulfilled → Rejected (impossível)
✗ Rejected → Fulfilled (impossível)
```

### Contexto Histórico e Evolução

**JavaScript ES5 (2009):** Callbacks apenas.

```javascript
// ES5 - callback hell
asyncOperation1(function(result1) {
  asyncOperation2(result1, function(result2) {
    asyncOperation3(result2, function(result3) {
      // Pyramid of doom
    });
  });
});
```

**Libraries (2010-2014):** Q, Bluebird, RSVP.

```javascript
// Bluebird library (2013)
const Promise = require('bluebird');

const promise = new Promise((resolve, reject) => {
  // ...
});
```

**ES6/ES2015:** Promise nativa.

```javascript
// ES6 - Promise nativa
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done"), 1000);
});

promise.then(value => console.log(value));
```

**TypeScript 1.0 (2014):** Promise types.

```typescript
// TypeScript 1.0 - type safety
const promise: Promise<string> = new Promise((resolve, reject) => {
  resolve("Hello");
});
```

**TypeScript 2.0 (2016):** Better generics.

```typescript
// TypeScript 2.0 - generic inference
const promise = new Promise<number>((resolve, reject) => {
  resolve(42);  // Type-safe
});
```

**ES2017:** async/await built on Promises.

```typescript
// ES2017 - async/await syntax sugar
async function getData(): Promise<string> {
  return "Data";  // Auto-wrapped em Promise
}
```

**TypeScript 4.5 (2021):** Awaited utility type.

```typescript
// TypeScript 4.5 - Awaited<T>
type Result = Awaited<Promise<string>>;  // string
```

**Antes vs Depois:**

**Pré-Promise (callbacks):**
```typescript
// Callbacks - error-first pattern ❌

function fetchUser(id: number, callback: (error: Error | null, user?: User) => void) {
  setTimeout(() => {
    if (id > 0) {
      callback(null, { id, name: "Alice" });
    } else {
      callback(new Error("Invalid ID"));
    }
  }, 1000);
}

// Usar - callback hell
fetchUser(1, (error, user) => {
  if (error) {
    console.error(error);
  } else {
    fetchUserPosts(user!.id, (error, posts) => {
      if (error) {
        console.error(error);
      } else {
        // Mais níveis...
      }
    });
  }
});
```

**Pós-Promise:**
```typescript
// Promises - chainable, compositional ✅

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Alice" });
      } else {
        reject(new Error("Invalid ID"));
      }
    }, 1000);
  });
}

// Usar - flat chain
fetchUser(1)
  .then(user => fetchUserPosts(user.id))
  .then(posts => console.log(posts))
  .catch(error => console.error(error));
```

### Problema Fundamental que Resolve

Promise resolve problemas de **callback hell**, **error handling**, **composability**, e **inversion of control**.

**Problema 1: Callback Hell (Pyramid of Doom)**
```typescript
// Callbacks aninhados - ilegível ❌

function getUserData(userId: number, callback: (error: Error | null, data?: any) => void) {
  getUser(userId, (error, user) => {
    if (error) return callback(error);
    
    getPosts(user.id, (error, posts) => {
      if (error) return callback(error);
      
      getComments(posts[0].id, (error, comments) => {
        if (error) return callback(error);
        
        getLikes(comments[0].id, (error, likes) => {
          if (error) return callback(error);
          
          // 5 níveis de indentação - pyramid of doom
          callback(null, { user, posts, comments, likes });
        });
      });
    });
  });
}

// Difícil ler, manter, debugar
```

**Solução: Promise flattens hierarchy**
```typescript
// Promises - flat chain ✅

function getUserData(userId: number): Promise<UserData> {
  return getUser(userId)
    .then(user => getPosts(user.id))
    .then(posts => getComments(posts[0].id))
    .then(comments => getLikes(comments[0].id))
    .then(likes => ({ user, posts, comments, likes }));
}

// Flat, legível, compositional
```

**Problema 2: Error Handling Repetitivo**
```typescript
// Callbacks - error handling em cada nível ❌

getUser(userId, (error, user) => {
  if (error) {
    handleError(error);  // Repetir em cada nível
    return;
  }
  
  getPosts(user.id, (error, posts) => {
    if (error) {
      handleError(error);  // Repetir novamente
      return;
    }
    
    getComments(posts[0].id, (error, comments) => {
      if (error) {
        handleError(error);  // E novamente...
        return;
      }
      
      // Código duplicado, verboso
    });
  });
});
```

**Solução: Promise error propagation**
```typescript
// Promises - single error handler ✅

getUser(userId)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => processComments(comments))
  .catch(error => handleError(error));  // Um único catch

// Erro propaga automaticamente até .catch()
```

**Problema 3: Inversion of Control**
```typescript
// Callbacks - perder controle ❌

function processData(callback: (result: string) => void) {
  // Callback pode ser chamado:
  // - Múltiplas vezes (bug)
  // - Nunca (bug)
  // - Síncrono ou assíncrono (inconsistência)
  
  callback("result");
  callback("result");  // Chamado duas vezes - bug
}

// Caller não controla quando/como callback executa
```

**Solução: Promise garante single resolution**
```typescript
// Promises - controle garantido ✅

function processData(): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve("result");
    resolve("result");  // Ignorado - Promise já resolvida
    reject(new Error("error"));  // Ignorado - imutável
  });
}

// Promise resolve UMA VEZ apenas
// Estado imutável após transição
```

**Problema 4: Composição Difícil**
```typescript
// Callbacks - difícil compor operações ❌

function operation1(callback: (result: number) => void) {
  setTimeout(() => callback(10), 1000);
}

function operation2(value: number, callback: (result: number) => void) {
  setTimeout(() => callback(value * 2), 1000);
}

// Compor - verboso
operation1(result1 => {
  operation2(result1, result2 => {
    console.log(result2);  // 20
  });
});
```

**Solução: Promise composition**
```typescript
// Promises - compositional ✅

function operation1(): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(10), 1000));
}

function operation2(value: number): Promise<number> {
  return new Promise(resolve => setTimeout(() => resolve(value * 2), 1000));
}

// Compor - elegante
operation1()
  .then(result1 => operation2(result1))
  .then(result2 => console.log(result2));  // 20

// Functional composition
```

**Fundamento teórico:** Promise implementa **monadic error handling** - erros propagam através da chain sem quebrar fluxo.

### Importância no Ecossistema

Promise é importante porque:

- **Asynchronous foundation:** Base para async/await
- **Error propagation:** Erros propagam automaticamente
- **Composability:** Compor operações facilmente
- **Type safety:** TypeScript `Promise<T>`
- **Standard:** ES6 native, universal
- **Libraries:** Fetch API, Axios retornam Promises
- **Concurrency:** Promise.all(), Promise.race()
- **Readable:** Flat chains vs callback hell

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Promise creation:** `new Promise((resolve, reject) => {})`
2. **Executor function:** Executa imediatamente
3. **States:** Pending → Fulfilled/Rejected
4. **Immutability:** Estados imutáveis após transição
5. **Type safety:** `Promise<T>` genérico

### Pilares Fundamentais

- **resolve(value):** Fulfill promise com valor
- **reject(error):** Reject promise com erro
- **Executor:** Function `(resolve, reject) => {}`
- **Eager execution:** Executor roda imediatamente
- **Single resolution:** Resolve/reject uma vez apenas

### Visão Geral das Nuances

- **Type inference:** TypeScript infere tipo
- **Error handling:** Erros propagam até `.catch()`
- **Thenable:** Objeto com `.then()` method
- **Promise.resolve():** Create fulfilled promise
- **Promise.reject():** Create rejected promise

## 🧠 Fundamentos Teóricos

### Basic Promise Creation

```typescript
// Promise básica - criação e uso

const promise = new Promise<string>((resolve, reject) => {
  // Executor function executa imediatamente
  console.log("Executor running");
  
  // Simular operação assíncrona
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

console.log("Promise created");

// Output:
// "Executor running"
// "Promise created"
// (após 1s) "Success!"
```

**Basic:** Executor executa imediatamente.

### Princípios e Conceitos Subjacentes

#### Promise States

```typescript
// Estados Promise

const pending = new Promise<string>((resolve, reject) => {
  // State: Pending
  // Aguardando resolve ou reject
});

const fulfilled = new Promise<string>((resolve, reject) => {
  resolve("Done");  // State: Fulfilled
});

const rejected = new Promise<string>((resolve, reject) => {
  reject(new Error("Failed"));  // State: Rejected
});
```

**States:** Pending, Fulfilled, Rejected.

#### State Immutability

```typescript
// Estados imutáveis - resolve/reject uma vez

const promise = new Promise<string>((resolve, reject) => {
  resolve("First");   // ✅ Promise fulfilled
  resolve("Second");  // ✗ Ignorado - já resolvida
  reject(new Error("Error"));  // ✗ Ignorado - imutável
});

promise.then(value => {
  console.log(value);  // "First" - apenas primeira resolução
});
```

**Immutability:** Primeira resolução vence.

### Type Safety

```typescript
// TypeScript - type safety com Promise<T>

// Promise<number> - tipo do valor resolvido
const numberPromise = new Promise<number>((resolve, reject) => {
  resolve(42);
  // resolve("text");  // ✗ Error: Argument of type 'string' is not assignable to parameter of type 'number'
});

// Promise<User> - custom type
interface User {
  id: number;
  name: string;
}

const userPromise = new Promise<User>((resolve, reject) => {
  resolve({ id: 1, name: "Alice" });
  // resolve({ id: 1 });  // ✗ Error: Property 'name' is missing
});

// Type inference
const inferredPromise = new Promise((resolve, reject) => {
  resolve(42);  // Promise<number> inferido
});
```

**Type Safety:** `Promise<T>` garante type correctness.

#### Error Objects

```typescript
// Rejeitar com Error objects - best practice

// ✅ Bom - Error object
const goodPromise = new Promise<string>((resolve, reject) => {
  reject(new Error("Something went wrong"));
});

// ⚠️ Evitar - string
const stringPromise = new Promise<string>((resolve, reject) => {
  reject("Error message");  // Funciona mas não recomendado
});

// ✅ Custom Error
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const customPromise = new Promise<string>((resolve, reject) => {
  reject(new ValidationError("Invalid input"));
});
```

**Best Practice:** Usar Error objects.

### Wrapping Async Operations

```typescript
// Wrap callback-based API em Promise

// API antiga - callback-based
function readFileCallback(
  path: string,
  callback: (error: Error | null, content?: string) => void
): void {
  setTimeout(() => {
    if (path.endsWith('.txt')) {
      callback(null, "File content");
    } else {
      callback(new Error("Invalid file"));
    }
  }, 1000);
}

// Wrapper - Promise-based
function readFilePromise(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    readFileCallback(path, (error, content) => {
      if (error) {
        reject(error);
      } else {
        resolve(content!);
      }
    });
  });
}

// Usar Promise-based API
readFilePromise("data.txt")
  .then(content => console.log(content))
  .catch(error => console.error(error));
```

**Wrapping:** Modernizar APIs callback-based.

#### Synchronous Executor

```typescript
// Executor pode ser síncrono

const syncPromise = new Promise<number>((resolve, reject) => {
  // Código síncrono - sem setTimeout
  const result = 10 + 20;
  resolve(result);  // Resolve imediatamente
});

// Mesmo sendo síncrono, .then() é assíncrono
console.log("Before");
syncPromise.then(value => {
  console.log("Promise:", value);
});
console.log("After");

// Output:
// "Before"
// "After"
// "Promise: 30"

// .then() sempre assíncrono (microtask)
```

**Executor:** Pode ser síncrono, mas `.then()` sempre assíncrono.

### Real-World Example - HTTP Request

```typescript
// HTTP request com Promise

interface ApiResponse {
  data: any;
  status: number;
}

function fetchData(url: string): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve, reject) => {
    // Simular HTTP request
    setTimeout(() => {
      const success = Math.random() > 0.2;
      
      if (success) {
        resolve({
          data: { message: "Success" },
          status: 200
        });
      } else {
        reject(new Error("Network error"));
      }
    }, 1000);
  });
}

// Usar
fetchData("https://api.example.com/data")
  .then(response => {
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  })
  .catch(error => {
    console.error("Request failed:", error.message);
  });
```

**Real-World:** HTTP request pattern.

#### Modelo Mental para Compreensão

Pense em Promise como **ticket de loteria**:

**Ticket:** Representa possível prêmio futuro
**Promise:** Representa valor futuro
**Draw:** Operação assíncrona
**Win/Lose:** Resolve/Reject
**Prize:** Valor resolvido

**Analogia - Restaurant Order:**

**Order ticket:** Você recebe ticket
**Promise:** Você recebe promise object
**Kitchen:** Operação assíncrona
**Food ready:** Promise fulfilled
**Order cancelled:** Promise rejected
**Receive food:** `.then()` handler

**Metáfora - Future Letter:**

**Send letter:** Criar promise
**Mail delivery:** Operação assíncrona
**Letter arrives:** Promise fulfilled
**Lost in mail:** Promise rejected
**Read letter:** `.then()` handler

**Fluxo Promise creation:**
```
new Promise(executor)
    ↓
Executor executa IMEDIATAMENTE
    ↓
Promise object criado (state: Pending)
    ↓
Operação assíncrona roda
    ↓
resolve() chamado → State: Fulfilled
ou
reject() chamado → State: Rejected
    ↓
.then() handlers executam
```

## 🔍 Análise Conceitual Profunda

### Promise Constructor Internals

```typescript
// Como Promise funciona internamente (conceitual)

class PromisePolyfill<T> {
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  private value?: T;
  private error?: Error;
  private handlers: Array<Function> = [];
  
  constructor(executor: (resolve: (value: T) => void, reject: (error: Error) => void) => void) {
    // Executor executa imediatamente
    try {
      executor(
        (value) => this.resolve(value),
        (error) => this.reject(error)
      );
    } catch (error) {
      this.reject(error as Error);
    }
  }
  
  private resolve(value: T): void {
    if (this.state !== 'pending') return;  // Imutabilidade
    
    this.state = 'fulfilled';
    this.value = value;
    this.handlers.forEach(handler => handler(value));
  }
  
  private reject(error: Error): void {
    if (this.state !== 'pending') return;  // Imutabilidade
    
    this.state = 'rejected';
    this.error = error;
  }
}
```

**Internals:** Como Promise funciona.

### Executor Exceptions

```typescript
// Exceções no executor → reject automático

const promise = new Promise<string>((resolve, reject) => {
  // Exceção não tratada
  throw new Error("Executor error");
  
  // Nunca executa
  resolve("Success");
});

// Equivalente a:
const equivalentPromise = new Promise<string>((resolve, reject) => {
  try {
    throw new Error("Executor error");
  } catch (error) {
    reject(error);  // Auto-reject
  }
});

promise.catch(error => {
  console.error("Caught:", error.message);  // "Executor error"
});
```

**Exceptions:** Auto-reject quando exceção no executor.

#### Thenable Protocol

```typescript
// Thenable - objeto com .then() method

interface Thenable<T> {
  then(
    onFulfilled?: (value: T) => any,
    onRejected?: (error: any) => any
  ): any;
}

// Custom thenable (não é Promise)
const thenable: Thenable<string> = {
  then(onFulfilled) {
    setTimeout(() => {
      onFulfilled?.("Custom value");
    }, 1000);
  }
};

// Promise reconhece thenables
Promise.resolve(thenable).then(value => {
  console.log(value);  // "Custom value"
});
```

**Thenable:** Duck typing para Promise-like objects.

### Memory Considerations

```typescript
// Promises retêm references - memory leaks potenciais

const largeData = new Array(1000000).fill("data");

const promise = new Promise<string[]>((resolve, reject) => {
  // Promise retém referência a largeData
  setTimeout(() => {
    resolve(largeData);
  }, 10000);
});

// largeData não pode ser garbage collected
// Até promise resolver

// Solução - não capturar desnecessariamente
const betterPromise = new Promise<string[]>((resolve, reject) => {
  setTimeout(() => {
    const data = generateData();  // Gerar apenas quando necessário
    resolve(data);
  }, 10000);
});
```

**Memory:** Cuidado com closures.

## 🎯 Aplicabilidade e Contextos

### Async I/O Operations

```typescript
function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Filesystem read
    setTimeout(() => resolve("File content"), 100);
  });
}
```

**Raciocínio:** I/O é naturalmente assíncrono.

### HTTP Requests

```typescript
function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    // HTTP request
    setTimeout(() => resolve({ id, name: "Alice" }), 500);
  });
}
```

**Raciocínio:** Network calls são async.

### Timers and Delays

```typescript
function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Usar
delay(1000).then(() => console.log("1 second later"));
```

**Raciocínio:** Utilities assíncronos.

## ⚠️ Limitações e Considerações Teóricas

### Eager Execution

```typescript
// Promise executa IMEDIATAMENTE - não lazy

const promise = new Promise<string>((resolve, reject) => {
  console.log("Executor running");  // Executa JÁ
  setTimeout(() => resolve("Done"), 1000);
});

// Não há como cancelar executor
```

**Limitação:** Eager, não lazy.

### No Cancellation

```typescript
// Promises não podem ser canceladas

const promise = new Promise<string>((resolve, reject) => {
  setTimeout(() => resolve("Done"), 10000);
});

// Não há promise.cancel()
// Operação continua mesmo se não quiser resultado
```

**Limitação:** No built-in cancellation.

### Unhandled Rejections

```typescript
// Rejection não tratada - erro silencioso

const promise = new Promise<string>((resolve, reject) => {
  reject(new Error("Oops"));
});

// Sem .catch() - erro não tratado
// Node.js: UnhandledPromiseRejectionWarning
```

**Consideração:** Sempre adicionar `.catch()`.

## 🔗 Interconexões Conceituais

**Relação com .then():** Consumir promises.

**Relação com .catch():** Error handling.

**Relação com async/await:** Syntax sugar.

**Relação com Event Loop:** Microtasks.

**Relação com Callbacks:** Modernizar async code.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise creation prepara para:
- **.then()/.catch()/.finally():** Consumir promises
- **Promise chaining:** Compor operações
- **Promise.all():** Concorrência
- **Promise.race():** Competição
- **async/await:** Syntax sugar
- **Error handling:** Try/catch async
