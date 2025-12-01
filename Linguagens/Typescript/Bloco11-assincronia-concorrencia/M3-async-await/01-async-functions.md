# Async Functions

## 🎯 Introdução e Definição

### Definição Conceitual

**Async function** é **função declarada com keyword `async`** que **sempre retorna Promise**. Quando async function **retorna valor**, esse valor é **automaticamente wrapped** em `Promise.resolve(value)`. Quando async function **lança erro**, erro é **wrapped** em `Promise.reject(error)`. Async functions permitem usar **`await` keyword** dentro do corpo, pausando execução até Promise resolver, criando **syntactic sugar** sobre Promises que torna código assíncrono parecer síncrono.

Conceitualmente, async functions implementam **Promise-based coroutines** - funções que podem **pausar e resumir** execução. Seguem **automatic Promise wrapping** - qualquer return value vira Promise. TypeScript infere **return type** como `Promise<T>` automaticamente. Async functions executam **synchronously até primeiro await** - código antes de await executa imediatamente, apenas após await que execução pausa.

**Fundamento teórico:** Async functions derivam de **generator-based coroutines** (ES6 generators) - implementação mais ergonômica de **asynchronous control flow**. Implementam **implicit Promise wrapping** - transformação automática de return/throw em Promise.resolve/reject. Suportam **await expressions** - pausa execução esperando Promise resolver. São **syntactic sugar** - traduzidos para Promise chains pelo compilador, sem nova semântica runtime.

**Pattern básico:**
```typescript
// Async function - syntactic sugar sobre Promises

// Traditional Promise chain ❌
function fetchUserOld(id: number): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log("User loaded");
      return data;
    })
    .catch(error => {
      console.error("Error loading user");
      throw error;
    });
}

// Async function - cleaner ✅
async function fetchUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    console.log("User loaded");
    return data;  // Automatically wrapped: Promise.resolve(data)
  } catch (error) {
    console.error("Error loading user");
    throw error;  // Automatically wrapped: Promise.reject(error)
  }
}

// Ambas retornam Promise<User>
// Async/await mais legível - parece código síncrono
```

**Automatic Promise wrapping:**
```typescript
// Async function SEMPRE retorna Promise

async function returnsNumber(): Promise<number> {
  return 42;  // Return value wrapped automaticamente
}

// Equivalente a:
function returnsNumberPromise(): Promise<number> {
  return Promise.resolve(42);
}

// Usar
returnsNumber().then(value => {
  console.log(value);  // 42
});

// Tipo inferido: Promise<number>
// Não pode retornar number diretamente - sempre Promise
```

**Async function declaration forms:**
```typescript
// Async function - diferentes formas de declaração

// Function declaration
async function asyncFunc1(): Promise<string> {
  return "Hello";
}

// Function expression
const asyncFunc2 = async function(): Promise<string> {
  return "Hello";
};

// Arrow function
const asyncFunc3 = async (): Promise<string> => {
  return "Hello";
};

// Method
class MyClass {
  async asyncMethod(): Promise<string> {
    return "Hello";
  }
}

// Object method
const obj = {
  async asyncMethod(): Promise<string> {
    return "Hello";
  }
};

// Todas retornam Promise<string>
// Todas podem usar await internamente
```

### Contexto Histórico e Evolução

**ES6 (2015):** Generators - foundation for async/await.

```javascript
// ES6 - generators (precursor)
function* generatorFunc() {
  const result = yield fetchData();
  return result;
}

// Generators permitiram pause/resume
// Base para async/await
```

**ES2017 (ES8, 2017):** Async/await introduzido.

```javascript
// ES2017 - async/await
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Syntactic sugar sobre Promises
// Muito mais legível que .then() chains
```

**TypeScript 1.7 (2015):** Async/await support (transpiled).

```typescript
// TypeScript 1.7 - async/await para ES5/ES6
async function getData(): Promise<Data> {
  const result = await fetchData();
  return result;
}

// Transpila para Promise chains
// Funciona em engines antigas
```

**TypeScript 2.1 (2016):** Async iteration.

```typescript
// TypeScript 2.1 - async iterators
async function* asyncGenerator() {
  yield await fetchData();
}

// Async generators
```

**TypeScript 3.6 (2019):** Better Promise typing.

```typescript
// TypeScript 3.6 - stricter Promise types
async function getNumber(): Promise<number> {
  return "string";  // Error: Type 'string' not assignable
}

// Type checking melhorado
```

**TypeScript 4.5 (2021):** Awaited utility type.

```typescript
// TypeScript 4.5 - Awaited<T>
type Result = Awaited<Promise<number>>;  // number

async function getValue(): Promise<number> {
  return 42;
}

type ReturnValue = Awaited<ReturnType<typeof getValue>>;  // number
```

**Modern (2020+):** Top-level await (ES2022).

```typescript
// ES2022 - top-level await em modules
const data = await fetchData();  // Sem async function wrapper

// Apenas em ES modules
```

### Problema Fundamental que Resolve

Async functions resolvem problemas de **Promise chain verbosity**, **error handling complexity**, **callback pyramid**, e **code readability**.

**Problema 1: Promise Chain Verbosity**
```typescript
// Promise chains - verbose e difícil ler ❌

function getUserData(userId: number): Promise<UserData> {
  return fetch(`/api/users/${userId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    })
    .then(user => {
      return fetch(`/api/posts?userId=${user.id}`);
    })
    .then(response => {
      return response.json();
    })
    .then(posts => {
      return {
        user: user,  // ✗ 'user' não está em escopo!
        posts: posts
      };
    })
    .catch(error => {
      console.error("Error:", error);
      throw error;
    });
}

// ✗ Código aninhado, difícil rastrear variáveis
// ✗ 'user' perdido em escopo diferente
// ✗ Múltiplos .then() difíceis de ler
```

**Solução: Async/await - código linear**
```typescript
// Async/await - limpo e legível ✅

async function getUserData(userId: number): Promise<UserData> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error("User not found");
    }
    
    const user = await response.json();
    const postsResponse = await fetch(`/api/posts?userId=${user.id}`);
    const posts = await postsResponse.json();
    
    return {
      user,   // ✓ 'user' em escopo
      posts
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// ✓ Código linear, parece síncrono
// ✓ Variáveis em escopo natural
// ✓ Muito mais legível
```

**Problema 2: Error Handling Scattered**
```typescript
// Promise chains - error handling complexo ❌

function processData(data: RawData): Promise<ProcessedData> {
  return validateData(data)
    .catch(error => {
      console.error("Validation error:", error);
      throw error;
    })
    .then(validated => transformData(validated))
    .catch(error => {
      console.error("Transform error:", error);
      throw error;
    })
    .then(transformed => saveData(transformed))
    .catch(error => {
      console.error("Save error:", error);
      throw error;
    });
}

// ✗ Múltiplos .catch() espalhados
// ✗ Repetição de error handling
// ✗ Difícil manter
```

**Solução: Async/await com try/catch unificado**
```typescript
// Async/await - error handling centralizado ✅

async function processData(data: RawData): Promise<ProcessedData> {
  try {
    const validated = await validateData(data);
    const transformed = await transformData(validated);
    const saved = await saveData(transformed);
    return saved;
  } catch (error) {
    // Single error handler para todos passos
    console.error("Processing error:", error);
    throw error;
  }
}

// ✓ Error handling centralizado (try/catch)
// ✓ Sem repetição
// ✓ Fácil adicionar steps
```

**Problema 3: Callback Pyramid Still Present**
```typescript
// Promises melhoram callback hell, mas ainda verboso ❌

function loadDashboard(userId: number): Promise<Dashboard> {
  return fetchUser(userId)
    .then(user => {
      return Promise.all([
        fetchPosts(user.id),
        fetchComments(user.id),
        fetchLikes(user.id)
      ]).then(([posts, comments, likes]) => {
        return {
          user,
          posts,
          comments,
          likes
        };
      });
    })
    .catch(error => {
      console.error("Dashboard error:", error);
      throw error;
    });
}

// ✗ Ainda aninhamento com Promise.all()
// ✗ Closure para acessar 'user'
```

**Solução: Async/await - flat structure**
```typescript
// Async/await - estrutura plana ✅

async function loadDashboard(userId: number): Promise<Dashboard> {
  try {
    const user = await fetchUser(userId);
    
    const [posts, comments, likes] = await Promise.all([
      fetchPosts(user.id),
      fetchComments(user.id),
      fetchLikes(user.id)
    ]);
    
    return {
      user,
      posts,
      comments,
      likes
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    throw error;
  }
}

// ✓ Código plano, sem aninhamento
// ✓ Variáveis naturalmente em escopo
// ✓ Destructuring direto
```

**Problema 4: Difficult to Debug**
```typescript
// Promise chains - stack traces ruins ❌

function complexOperation(): Promise<Result> {
  return step1()
    .then(result1 => step2(result1))
    .then(result2 => step3(result2))
    .then(result3 => step4(result3));
}

complexOperation().catch(error => {
  console.error(error.stack);
  // Stack trace não mostra linha original do erro
  // Difícil debugar qual step falhou
});
```

**Solução: Async/await - better stack traces**
```typescript
// Async/await - stack traces melhores ✅

async function complexOperation(): Promise<Result> {
  const result1 = await step1();
  const result2 = await step2(result1);
  const result3 = await step3(result2);
  const result4 = await step4(result3);
  return result4;
}

try {
  await complexOperation();
} catch (error) {
  console.error(error.stack);
  // Stack trace mostra linha exata do erro
  // Fácil identificar qual step falhou
}
```

**Fundamento teórico:** Async functions implementam **synchronous-style asynchronous code** - transformar async operations em código que parece síncrono, melhorando **readability e maintainability**.

### Importância no Ecossistema

Async functions são importantes porque:

- **Readability:** Código assíncrono legível como síncrono
- **Error handling:** try/catch natural
- **Maintainability:** Código mais fácil manter
- **Debugging:** Stack traces melhores
- **Type safety:** TypeScript infere Promise types
- **Standard practice:** Padrão moderno para async code
- **Framework support:** React, Vue, Node.js usam async/await
- **API consistency:** Uniform async API design

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Always Promise:** Async function sempre retorna Promise
2. **Automatic wrapping:** Return value wrapped em Promise.resolve
3. **Await support:** Pode usar await internamente
4. **Syntactic sugar:** Traduzido para Promise chains
5. **Type inference:** Promise<T> inferido automaticamente

### Pilares Fundamentais

- **`async` keyword:** Declara async function
- **Return type:** Sempre `Promise<T>`
- **Execution:** Síncrono até primeiro await
- **Error handling:** Try/catch funciona
- **Compatibility:** Funciona com Promises existentes

### Visão Geral das Nuances

- **Immediate execution:** Código antes de await executa sync
- **No await needed:** Async sem await ainda retorna Promise
- **Type annotation:** Pode explicitar Promise<T>
- **Void return:** `async () => void` vira `Promise<void>`
- **Top-level await:** Apenas em ES modules

## 🧠 Fundamentos Teóricos

### Basic Async Function

```typescript
// Basic async function

async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
  // Automatically: Promise.resolve(`Hello, ${name}!`)
}

// Usar
greet("Alice").then(message => {
  console.log(message);  // "Hello, Alice!"
});

// Ou com await
const message = await greet("Bob");
console.log(message);  // "Hello, Bob!"
```

**Basic:** Return value wrapped automaticamente.

### Princípios e Conceitos Subjacentes

#### Async Function Always Returns Promise

```typescript
// Async function SEMPRE retorna Promise

async function returnsNumber(): Promise<number> {
  return 42;
}

async function returnsString(): Promise<string> {
  return "Hello";
}

async function returnsVoid(): Promise<void> {
  console.log("Side effect");
  // No return - Promise<void>
}

// Type inference
const num = returnsNumber();  // Type: Promise<number>
const str = returnsString();  // Type: Promise<string>
const voidP = returnsVoid();  // Type: Promise<void>

// Unwrap com await
const actualNum = await returnsNumber();  // Type: number
const actualStr = await returnsString();  // Type: string
```

**Always Promise:** Mesmo sem await, retorna Promise.

#### Execution Before First Await

```typescript
// Execução síncrona até primeiro await

async function example(): Promise<void> {
  console.log("1. Sync - executes immediately");
  console.log("2. Sync - still immediate");
  
  await delay(100);  // PAUSE aqui
  
  console.log("3. Async - after await");
}

console.log("Before calling");
example();
console.log("After calling");

/*
Output:
Before calling
1. Sync - executes immediately
2. Sync - still immediate
After calling
[100ms later]
3. Async - after await

Async function executa SYNCHRONOUSLY até primeiro await!
*/
```

**Sync Start:** Código antes de await executa imediatamente.

### Error Becomes Rejected Promise

```typescript
// Throw error vira Promise.reject

async function mayFail(shouldFail: boolean): Promise<string> {
  if (shouldFail) {
    throw new Error("Failed!");  // Promise.reject(error)
  }
  return "Success";  // Promise.resolve("Success")
}

// Usar com try/catch
try {
  const result = await mayFail(true);
} catch (error) {
  console.error("Caught:", error.message);  // "Failed!"
}

// Ou com .catch()
mayFail(true).catch(error => {
  console.error("Caught:", error.message);
});
```

**Error Handling:** Throw vira rejected Promise.

#### Async Arrow Functions

```typescript
// Async arrow functions

// Short form
const fetchData = async (id: number): Promise<Data> => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
};

// Long form
const processData = async (data: Data): Promise<ProcessedData> => {
  const validated = await validateData(data);
  const transformed = await transformData(validated);
  return transformed;
};

// Implicit return (Promise.resolve)
const getValue = async (): Promise<number> => 42;

// Array methods com async
const ids = [1, 2, 3];
const dataArray = await Promise.all(
  ids.map(async (id) => {
    const data = await fetchData(id);
    return processData(data);
  })
);
```

**Arrow:** Async arrow functions funcionam normalmente.

### Real-World Example - API Data Fetching

```typescript
// Real-world - fetch e process API data

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface UserProfile {
  user: User;
  posts: Post[];
  postCount: number;
}

async function getUserProfile(userId: number): Promise<UserProfile> {
  try {
    // Fetch user
    const userResponse = await fetch(`/api/users/${userId}`);
    
    if (!userResponse.ok) {
      throw new Error(`User ${userId} not found`);
    }
    
    const user: User = await userResponse.json();
    
    // Fetch user's posts
    const postsResponse = await fetch(`/api/posts?userId=${userId}`);
    
    if (!postsResponse.ok) {
      throw new Error("Failed to fetch posts");
    }
    
    const posts: Post[] = await postsResponse.json();
    
    // Return combined data
    return {
      user,
      posts,
      postCount: posts.length
    };
  } catch (error) {
    console.error("Error loading user profile:", error);
    throw error;  // Re-throw para caller handle
  }
}

// Usar
getUserProfile(123)
  .then(profile => {
    console.log(`User: ${profile.user.name}`);
    console.log(`Posts: ${profile.postCount}`);
  })
  .catch(error => {
    console.error("Failed to load profile:", error);
  });

// Ou com await
try {
  const profile = await getUserProfile(123);
  console.log(profile);
} catch (error) {
  console.error("Failed:", error);
}
```

**Real-World:** Typical API data fetching pattern.

#### Modelo Mental para Compreensão

Pense em async function como **pause button**:

**Regular function:** Runs to completion (no pause)
**Async function:** Can pause at await (resumable)
**Return value:** Always wrapped in box (Promise)
**Execution:** Normal until first pause
**Resume:** When awaited Promise resolves

**Analogia - Restaurant Order:**

**Customer (caller):** Calls async function
**Waiter (async function):** Takes order
**Kitchen (await):** Prepares food (async operation)
**Waiter pauses:** Waits for kitchen
**Food ready:** Promise resolves
**Waiter returns:** Delivers food (return value)
**Receipt (Promise):** Customer gets receipt immediately

**Metáfora - Letter Delivery:**

**Write letter (call async):** Start process
**Mail system (Promise):** Handles delivery
**Letter sent (return):** Promise returned immediately
**Delivery (await):** Wait for letter to arrive
**Content (value):** Actual data when delivered

**Fluxo visual:**
```
Async Function Execution:

async function example() {
  console.log("1");  ← Executes immediately (sync)
  
  await fetch();     ← PAUSE here, return Promise
                       Event loop continues
  
  console.log("2");  ← Resumes when Promise resolves
  
  return value;      ← Wrapped: Promise.resolve(value)
}
```

## 🔍 Análise Conceitual Profunda

### Async Without Await

```typescript
// Async function sem await ainda retorna Promise

async function noAwait(): Promise<number> {
  const x = 10;
  const y = 20;
  return x + y;  // Promise.resolve(30)
}

// Equivalente a:
function regularPromise(): Promise<number> {
  const x = 10;
  const y = 20;
  return Promise.resolve(x + y);
}

// Ambas retornam Promise<number>
// Async keyword força return type ser Promise
```

**No Await:** Async sem await ainda válido.

#### Type Inference

```typescript
// TypeScript infere Promise type automaticamente

async function inferNumber() {
  return 42;  // Type inferido: Promise<number>
}

async function inferString() {
  return "Hello";  // Type inferido: Promise<string>
}

async function inferObject() {
  return { x: 10, y: 20 };  // Promise<{ x: number; y: number }>
}

// Explicit type annotation
async function explicit(): Promise<number> {
  return 42;
}

// Type mismatch detectado
async function mismatch(): Promise<number> {
  return "string";  // Error: Type 'string' not assignable to 'number'
}
```

**Type Inference:** Automatic Promise<T> inference.

### Async Class Methods

```typescript
// Async methods em classes

class UserService {
  private apiUrl = "/api/users";
  
  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.apiUrl}/${id}`);
    return response.json();
  }
  
  async createUser(userData: CreateUserDto): Promise<User> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    
    return response.json();
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    
    return response.json();
  }
}

// Usar
const service = new UserService();
const user = await service.getUser(123);
const newUser = await service.createUser({ name: "Alice" });
```

**Class Methods:** Async methods em classes.

#### Async IIFE (Immediately Invoked)

```typescript
// Async IIFE - top-level await alternativa

// Sem top-level await (older code)
(async () => {
  const data = await fetchData();
  console.log(data);
})();

// Com top-level await (ES2022, modules)
const data = await fetchData();
console.log(data);

// Async IIFE com error handling
(async () => {
  try {
    const result = await processData();
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
})();
```

**IIFE:** Async immediately invoked function.

### Transpilation to Promises

```typescript
// Async/await transpila para Promise chains

// Source (async/await)
async function example(x: number): Promise<number> {
  const result = await fetch(`/api/${x}`);
  const data = await result.json();
  return data.value * 2;
}

// Transpiled (aproximadamente)
function example(x: number): Promise<number> {
  return fetch(`/api/${x}`)
    .then(result => result.json())
    .then(data => data.value * 2);
}

// Async/await é syntactic sugar!
// Compilador transforma em Promise chains
```

**Transpilation:** Async/await → Promise chains.

## 🎯 Aplicabilidade e Contextos

### API Calls

```typescript
async function fetchUserData(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

**Raciocínio:** Clean async API calls.

### Sequential Operations

```typescript
async function processSequentially(): Promise<void> {
  const step1 = await doStep1();
  const step2 = await doStep2(step1);
  const step3 = await doStep3(step2);
}
```

**Raciocínio:** Sequential dependencies.

### Error Handling

```typescript
async function safeOperation(): Promise<Result | null> {
  try {
    return await riskyOperation();
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

**Raciocínio:** Centralized error handling.

## ⚠️ Limitações e Considerações Teóricas

### Must Return Promise

```typescript
// Async function SEMPRE retorna Promise

async function getValue(): number {  // Error!
  return 42;
}

// Fix: Promise<number>
async function getValue(): Promise<number> {
  return 42;
}
```

**Limitação:** Return type sempre Promise.

### Cannot Await in Sync Function

```typescript
// Não pode await em função síncrona

function syncFunction() {
  const result = await fetchData();  // Error: await only in async
}

// Fix: Make function async
async function asyncFunction() {
  const result = await fetchData();  // OK
}
```

**Limitação:** Await apenas em async functions.

### Debugging Complexity

```typescript
// Debugger pode pular através de awaits

async function complex(): Promise<void> {
  debugger;
  const x = await step1();
  debugger;  // Pode não parar aqui se step1 rejeitou
  const y = await step2(x);
}
```

**Consideração:** Debugging async pode ser tricky.

## 🔗 Interconexões Conceituais

**Relação com Promises:** Built on top of Promises.

**Relação com Await:** Enables await keyword.

**Relação com Try/Catch:** Error handling works.

**Relação com Event Loop:** Uses microtask queue.

**Relação com Generators:** Based on generator pattern.

## 🚀 Evolução e Próximos Conceitos

Dominar Async Functions prepara para:
- **Await keyword:** Pausing execution
- **Error handling:** try/catch with async
- **Parallel execution:** Promise.all with await
- **Async iteration:** for await...of loops
- **Performance:** Sequential vs parallel
- **Testing:** Async test patterns
