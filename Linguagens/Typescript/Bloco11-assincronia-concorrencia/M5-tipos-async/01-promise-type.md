# Promise Type - Promise<T>

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise<T>** é **generic type** que representa **operação assíncrona** que eventualmente **produz valor** de tipo `T` ou **rejeita com erro**. O type parameter `T` especifica **tipo do valor resolvido** - `Promise<number>` resolve para `number`, `Promise<User>` resolve para `User`. Promise<T> implementa **type-safe async operations** - TypeScript garante type consistency através de async pipeline.

Conceitualmente, Promise<T> implementa **future value type** - tipo que representa valor que **ainda não existe** mas **existirá eventualmente**. Segue **generic type pattern** - `T` é **placeholder** para tipo real do valor. Implementa **type transformation** - `Promise<T>` com `await` vira `T`, `async function returning T` vira `Promise<T>`.

**Fundamento teórico:** Promise<T> deriva de **monad pattern** - container que encapsula async computation com type information. Implementa **type preservation** - tipo do valor mantido através de `.then()` chains e `await` expressions. Segue **contravariance em rejection** - Promise pode rejeitar com qualquer tipo (geralmente `Error`), mas resolve com tipo específico `T`.

**Pattern básico:**
```typescript
// Promise<T> - generic type para async values

// Promise que resolve para number
const numberPromise: Promise<number> = Promise.resolve(42);

// Promise que resolve para string
const stringPromise: Promise<string> = fetch('/api/data')
  .then(response => response.text());

// Promise que resolve para User object
const userPromise: Promise<User> = fetchUser(123);

// Type parameter T especifica tipo do resolved value
// TypeScript infere e valida tipos automaticamente
```

**Type inference automática:**
```typescript
// TypeScript infere Promise<T> automaticamente

async function fetchData(): Promise<Data> {
  return { id: 1, name: "Example" };
}

// Type inferido: Promise<Data>
const dataPromise = fetchData();

// await unwraps Promise<Data> → Data
const data = await fetchData();  // Type: Data

// TypeScript previne type errors
const wrong: string = await fetchData();  // Error: Data não é string
```

**Generic type parameter:**
```typescript
// T pode ser qualquer tipo

// Primitive types
const num: Promise<number> = Promise.resolve(42);
const str: Promise<string> = Promise.resolve("hello");
const bool: Promise<boolean> = Promise.resolve(true);

// Object types
interface User {
  id: number;
  name: string;
}

const user: Promise<User> = Promise.resolve({
  id: 1,
  name: "Alice"
});

// Array types
const numbers: Promise<number[]> = Promise.resolve([1, 2, 3]);

// Void (no value)
const voidPromise: Promise<void> = Promise.resolve();

// Union types
const mixed: Promise<string | number> = Promise.resolve(Math.random() > 0.5 ? "text" : 42);

// T é placeholder - substitui por tipo real
```

**Type safety através de pipeline:**
```typescript
// TypeScript valida tipos através de async pipeline

interface RawData {
  raw: string;
}

interface ParsedData {
  parsed: number;
}

interface ValidatedData {
  validated: boolean;
}

async function pipeline(): Promise<ValidatedData> {
  // Step 1: Promise<RawData>
  const raw: RawData = await fetchRawData();
  
  // Step 2: Promise<ParsedData>
  const parsed: ParsedData = await parseData(raw);
  
  // Step 3: Promise<ValidatedData>
  const validated: ValidatedData = await validateData(parsed);
  
  return validated;  // Return type: Promise<ValidatedData>
}

// TypeScript garante type consistency
// raw.parsed não existe → Error
// parsed.validated não existe → Error
```

### Contexto Histórico e Evolução

**Pre-ES2015:** Callbacks sem type information.

```typescript
// Callbacks - sem type safety
function fetchData(callback: (data: any) => void): void {
  // data é any - sem type checking
  setTimeout(() => callback({ value: 42 }), 1000);
}
```

**ES2015 (ES6):** Promise introduzida.

```javascript
// ES6 - Promise (JavaScript)
const promise = fetch('/api/data')
  .then(response => response.json());

// Sem tipos - runtime only
```

**TypeScript 1.4 (2015):** Promise<T> type adicionado.

```typescript
// TypeScript 1.4 - Promise<T>
const promise: Promise<Data> = fetch('/api/data')
  .then(response => response.json());

// Type-safe Promises
```

**TypeScript 2.1 (2016):** Better async/await support.

```typescript
// TypeScript 2.1 - async/await type inference
async function getData(): Promise<Data> {
  const response = await fetch('/api/data');
  return response.json();  // Type: Promise<Data>
}
```

**TypeScript 3.6 (2019):** Stricter Promise types.

```typescript
// TypeScript 3.6 - stricter checking
async function getNumber(): Promise<number> {
  return "string";  // Error: string não é number
}

// Type mismatch detectado
```

**TypeScript 4.5 (2021):** Awaited<T> utility type.

```typescript
// TypeScript 4.5 - Awaited<T>
type Result = Awaited<Promise<number>>;  // number
type Nested = Awaited<Promise<Promise<string>>>;  // string

// Unwrap Promise types recursively
```

**TypeScript 5.0 (2023):** Better Promise type inference.

```typescript
// TypeScript 5.0 - melhor inference
const promise = async () => {
  return Math.random() > 0.5 ? 42 : "string";
};

// Type inferido: Promise<number | string>
```

### Problema Fundamental que Resolve

Promise<T> resolve problemas de **async type safety**, **type inference em async code**, **callback type hell**, e **runtime type errors**.

**Problema 1: Callback Type Ambiguity**
```typescript
// Callbacks - type information perdida ❌

function fetchUser(
  id: number,
  callback: (user: any) => void  // any - sem type safety!
): void {
  setTimeout(() => {
    callback({ id, name: "Alice" });
  }, 1000);
}

fetchUser(123, (user) => {
  console.log(user.name);  // user é any
  console.log(user.email);  // No error! Mas propriedade não existe
});

// ✗ Type safety perdida
// ✗ Runtime errors possíveis
```

**Solução: Promise<T> - type-safe async**
```typescript
// Promise<T> - type information preservada ✅

interface User {
  id: number;
  name: string;
}

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Alice" });
    }, 1000);
  });
}

fetchUser(123).then((user) => {
  console.log(user.name);   // OK - name existe
  console.log(user.email);  // Error! email não existe em User
});

// ✓ Type safety mantida
// ✓ Compile-time errors
```

**Problema 2: Type Inference Impossível**
```typescript
// Promise chains - type inference quebrada ❌

fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    // data é any - TypeScript não sabe o tipo!
    console.log(data.value);  // No error checking
  });

// ✗ Type information perdida
// ✗ data.anything funciona sem error
```

**Solução: Explicit Promise<T>**
```typescript
// Promise<T> - type inference funciona ✅

interface ApiData {
  value: number;
}

fetch('/api/data')
  .then(response => response.json() as Promise<ApiData>)
  .then((data: ApiData) => {
    console.log(data.value);    // OK
    console.log(data.invalid);  // Error! invalid não existe
  });

// Ou com async/await (melhor)
async function fetchData(): Promise<ApiData> {
  const response = await fetch('/api/data');
  return response.json();  // Type: ApiData
}

const data = await fetchData();  // Type: ApiData
console.log(data.value);  // Type-safe!

// ✓ Type information preservada
// ✓ Autocomplete funciona
```

**Problema 3: Mixed Return Types**
```typescript
// Sem Promise<T> - função pode retornar Promise ou não ❌

function getData(cached: boolean): any {
  if (cached) {
    return { value: 42 };  // Synchronous
  } else {
    return fetch('/api/data')  // Asynchronous
      .then(r => r.json());
  }
}

// Como usar? É Promise ou não?
const result = getData(true);
console.log(result.value);  // Funciona se cached=true, quebra se false

// ✗ Type ambiguity
// ✗ Runtime errors
```

**Solução: Consistent Promise<T> return**
```typescript
// Promise<T> - consistent async interface ✅

interface Data {
  value: number;
}

function getData(cached: boolean): Promise<Data> {
  if (cached) {
    return Promise.resolve({ value: 42 });  // Wrap em Promise
  } else {
    return fetch('/api/data').then(r => r.json());
  }
}

// Sempre Promise - uso consistente
getData(true).then(data => {
  console.log(data.value);  // Type: number
});

// Ou com await
const data = await getData(false);  // Type: Data
console.log(data.value);

// ✓ Consistent async interface
// ✓ Type-safe
```

**Problema 4: Error Type Ambiguity**
```typescript
// Errors em callbacks - sem type information ❌

function fetchData(
  callback: (error: any, data: any) => void
): void {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      callback(new Error("Failed"), null);
    } else {
      callback(null, { value: 42 });
    }
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error(error.message);  // error é any
  } else {
    console.log(data.value);  // data é any
  }
});

// ✗ error e data são any
// ✗ No type checking
```

**Solução: Promise rejection types**
```typescript
// Promise<T> - error handling type-safe ✅

interface Data {
  value: number;
}

class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

function fetchData(): Promise<Data> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        reject(new FetchError("Failed"));
      } else {
        resolve({ value: 42 });
      }
    }, 1000);
  });
}

// Type-safe error handling
try {
  const data = await fetchData();  // Type: Data
  console.log(data.value);
} catch (error) {
  if (error instanceof FetchError) {
    console.error(error.message);  // Type-safe
  }
}

// ✓ data typed as Data
// ✓ error typed com instanceof check
```

**Fundamento teórico:** Promise<T> implementa **type-safe asynchronous programming** - preservando type information através de async operations, permitindo **compile-time type checking** e **IDE autocomplete**.

### Importância no Ecossistema

Promise<T> é importante porque:

- **Type safety:** Compile-time checking para async code
- **IDE support:** Autocomplete e refactoring
- **Error prevention:** Catch type errors antes de runtime
- **Documentation:** Type signatures documentam async APIs
- **Refactoring:** Safe refactoring de async code
- **Generic programming:** Reusable async utilities
- **Framework integration:** React, Angular, Node.js usam Promise<T>
- **Modern standard:** Essential para TypeScript moderno

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Generic type:** `Promise<T>` - T é tipo do valor resolvido
2. **Type preservation:** Tipo mantido através de async pipeline
3. **Type inference:** TypeScript infere Promise<T> automaticamente
4. **Awaited unwrapping:** `await Promise<T>` → `T`
5. **Type safety:** Compile-time checking de async operations

### Pilares Fundamentais

- **`Promise<T>`:** Generic type para async values
- **Type parameter T:** Tipo do resolved value
- **Type inference:** Automatic type deduction
- **await unwrapping:** Type transformation
- **Error types:** Rejection handling

### Visão Geral das Nuances

- **void Promise:** `Promise<void>` para side effects
- **never Promise:** `Promise<never>` nunca resolve
- **Union types:** `Promise<A | B>`
- **Nested Promises:** `Promise<Promise<T>>` flattened
- **Awaited type:** Utility para unwrap Promise types

## 🧠 Fundamentos Teóricos

### Basic Promise<T>

```typescript
// Basic Promise type annotation

const numberPromise: Promise<number> = Promise.resolve(42);

const stringPromise: Promise<string> = new Promise((resolve) => {
  resolve("hello");
});

const voidPromise: Promise<void> = Promise.resolve();
```

**Basic:** Promise with type parameter.

### Princípios e Conceitos Subjacentes

#### Type Inference

```typescript
// TypeScript infere Promise<T> automaticamente

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();  // Type: User
}

// Type inferido: Promise<User>
const userPromise = fetchUser(123);

// await unwraps: Promise<User> → User
const user = await fetchUser(123);  // Type: User
```

**Inference:** Automatic Promise<T> deduction.

#### Promise.resolve() Type

```typescript
// Promise.resolve() infere tipo do argumento

const num = Promise.resolve(42);  // Promise<number>
const str = Promise.resolve("hello");  // Promise<string>

interface User {
  id: number;
  name: string;
}

const user = Promise.resolve<User>({
  id: 1,
  name: "Alice"
});  // Promise<User>

// Explicit type parameter quando necessário
```

**resolve():** Type inferred from argument.

### Promise Chain Types

```typescript
// Tipos preservados através de .then() chains

interface Data {
  value: number;
}

const promise: Promise<Data> = fetch('/api/data')
  .then(response => response.json());  // Promise<Data>

promise.then((data: Data) => {
  return data.value * 2;  // Promise<number>
}).then((doubled: number) => {
  console.log(doubled);  // Type: number
});

// Cada .then() retorna novo Promise com tipo transformado
```

**Chains:** Type transformations through .then().

#### Union Types

```typescript
// Promise com union types

type Result = number | string;

async function getValue(): Promise<Result> {
  if (Math.random() > 0.5) {
    return 42;
  } else {
    return "text";
  }
}

const value = await getValue();  // Type: number | string

// Type narrowing
if (typeof value === 'number') {
  console.log(value.toFixed(2));  // Type: number
} else {
  console.log(value.toUpperCase());  // Type: string
}
```

**Union:** Promise<A | B> types.

#### Void Promise

```typescript
// Promise<void> - async operations sem return value

async function saveData(data: Data): Promise<void> {
  await fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  // No return value
}

const voidPromise: Promise<void> = saveData(data);

// await retorna void (undefined)
await saveData(data);  // Type: void
```

**Void:** Promise with no value.

### Awaited<T> Utility Type

```typescript
// Awaited<T> - extrair tipo unwrapped de Promise

type NumberPromise = Promise<number>;
type Number = Awaited<NumberPromise>;  // number

// Nested Promises
type Nested = Promise<Promise<string>>;
type String = Awaited<Nested>;  // string (recursively unwrapped)

// Function return type
async function getUser(): Promise<User> {
  return { id: 1, name: "Alice" };
}

type UserType = Awaited<ReturnType<typeof getUser>>;  // User
```

**Awaited:** Unwrap Promise types.

### Real-World Example - API Client

```typescript
// Real-world - typed API client

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

class ApiClient {
  private baseUrl = 'https://api.example.com';
  
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  async getUser(id: number): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data;
  }
  
  async getPosts(userId: number): Promise<Post[]> {
    const response = await this.request<Post[]>(`/posts?userId=${userId}`);
    return response.data;
  }
  
  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    const response = await this.request<Post>('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    return response.data;
  }
}

// Usage - all type-safe!
const client = new ApiClient();

const user: User = await client.getUser(123);
console.log(user.name);  // Type: string

const posts: Post[] = await client.getPosts(user.id);
console.log(posts.length);  // Type: number

const newPost: Post = await client.createPost({
  title: "My Post",
  content: "Content here",
  authorId: user.id
});
console.log(newPost.id);  // Type: number

// ✓ Full type safety
// ✓ Autocomplete works
// ✓ Type errors caught at compile-time
```

**Real-World:** Type-safe API client with Promise<T>.

#### Modelo Mental para Compreensão

Pense em Promise<T> como **gift box with label**:

**Box (Promise):** Container para future value
**Label (T):** Type do conteúdo
**Opening (await):** Extract value from box
**Type check:** Label garantee tipo correto

**Analogia - Package Delivery:**

**Package (Promise):** Sendo entregue
**Label (T):** Conteúdo declarado
**Delivery (resolve):** Package arrives
**Open (await):** Extract contents (type T)
**Wrong contents:** Type error (compile-time catch)

**Metáfora - Restaurant Order:**

**Order (Promise):** Future meal
**Menu description (T):** Type of meal
**Wait (pending):** Kitchen preparing
**Serve (resolve):** Meal arrives
**Eat (await):** Consume meal (type T)

**Fluxo visual:**
```
Promise<T> Type Flow:

async function(): Promise<User> {
                  └─────────┬─────────┘
                            │
                   Return type: Promise<User>
  
  const user = await fetchUser();
         └───┬───┘        └────┬────┘
             │                 │
        Type: User    Promise<User>
        
  await unwraps: Promise<User> → User
}

Promise<T> = Container[T]
await Promise<T> = T
```

## 🔍 Análise Conceitual Profunda

### Generic Type Parameter Constraints

```typescript
// Constraint em type parameter

async function fetchArray<T extends { id: number }>(
  ids: number[]
): Promise<T[]> {
  // T deve ter propriedade id: number
  return [] as T[];
}

interface User {
  id: number;
  name: string;
}

const users: User[] = await fetchArray<User>([1, 2, 3]);

// T constrained - garante id existe
```

**Constraints:** Type parameter restrictions.

#### Promise.all() Type

```typescript
// Promise.all() preserva tipos de array

const [user, posts, comments] = await Promise.all([
  fetchUser(123),      // Promise<User>
  fetchPosts(123),     // Promise<Post[]>
  fetchComments(123)   // Promise<Comment[]>
]);

// Types inferidos:
// user: User
// posts: Post[]
// comments: Comment[]

// Promise.all<[T1, T2, T3]>() → Promise<[T1, T2, T3]>
```

**all():** Tuple type preservation.

### Conditional Promise Types

```typescript
// Conditional types com Promise

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<number>>;  // number
type B = UnwrapPromise<string>;  // string

// Utility para unwrap Promise types
```

**Conditional:** Advanced Promise type manipulation.

#### Promise Error Types

```typescript
// Typed error handling

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  
  if (!response.ok) {
    throw new NetworkError(
      'Network request failed',
      response.status
    );
  }
  
  const data = await response.json();
  
  if (!isValid(data)) {
    throw new ValidationError(
      'Data validation failed',
      'data'
    );
  }
  
  return data;
}

// Usage - typed error handling
try {
  const data = await fetchData();
  console.log(data);
} catch (error) {
  if (error instanceof NetworkError) {
    console.error(`Network error ${error.statusCode}`);
  } else if (error instanceof ValidationError) {
    console.error(`Validation error in ${error.field}`);
  }
}
```

**Error Types:** Typed exception handling.

## 🎯 Aplicabilidade e Contextos

### API Responses

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
}

async function getUser(id: number): Promise<User> {
  const response: ApiResponse<User> = await fetch(`/api/users/${id}`)
    .then(r => r.json());
  return response.data;
}
```

**Raciocínio:** Type-safe API responses.

### Database Queries

```typescript
async function findUser(id: number): Promise<User | null> {
  const user = await db.query<User>('SELECT * FROM users WHERE id = ?', [id]);
  return user || null;
}
```

**Raciocínio:** Typed database results.

### File Operations

```typescript
async function readConfig(): Promise<Config> {
  const content = await fs.readFile('config.json', 'utf-8');
  return JSON.parse(content) as Config;
}
```

**Raciocínio:** Type-safe file I/O.

## ⚠️ Limitações e Considerações Teóricas

### Type Assertions Needed

```typescript
// JSON.parse retorna any - precisa type assertion

async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  const data = await response.json();  // Type: any
  return data as Data;  // Type assertion
}

// Runtime validation recomendado
```

**Limitação:** JSON.parse loses type information.

### Promise<any> Loses Safety

```typescript
// any perde type safety

const badPromise: Promise<any> = fetchData();

const data = await badPromise;
console.log(data.anything);  // No error - any!

// Evite any, use tipos específicos
```

**Consideração:** Avoid Promise<any>.

### Rejection Type Unknown

```typescript
// Rejection pode ser qualquer tipo (não type-safe)

try {
  await fetchData();
} catch (error) {
  // error é unknown (TS 4.0+)
  // Precisa type guard
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

**Limitação:** Rejection type not enforced.

## 🔗 Interconexões Conceituais

**Relação com Generics:** Promise<T> é generic type.

**Relação com Async/Await:** await unwraps Promise<T>.

**Relação com Type Inference:** TypeScript infere T.

**Relação com Error Handling:** try/catch com typed errors.

**Relação com Utility Types:** Awaited<T>, ReturnType<T>.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise<T> prepara para:
- **Async function types:** Typing async functions
- **Generic async utilities:** Reusable Promise utilities
- **Advanced type inference:** Conditional Promise types
- **Error type patterns:** Typed error handling
- **API design:** Type-safe async APIs
- **Testing:** Typing async tests
