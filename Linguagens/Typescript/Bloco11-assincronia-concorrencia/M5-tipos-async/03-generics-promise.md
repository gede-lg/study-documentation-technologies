# Generics com Promise

## 🎯 Introdução e Definição

### Definição Conceitual

**Generics com Promise** são **type parameters aplicados a Promise types** para criar **reusable async utilities** que funcionam com **qualquer tipo**. Pattern `Promise<T>` com generic type parameter `T` permite funções async **type-safe** que operam sobre **arbitrary types** mantendo **type information** através de async operations. Implementa **parametric polymorphism** - mesma função funciona para múltiplos tipos com type safety completo.

Conceitualmente, generics com Promise implementam **type-level abstraction** - abstrair sobre tipo do valor async mantendo **type constraints** e **type transformations**. Função `fetchById<T>(id: number): Promise<T>` funciona para **qualquer T** - `User`, `Post`, `Comment` - preservando type information. Segue **generic programming principles** - código reusável sem sacrificar type safety.

**Fundamento teórico:** Generics com Promise derivam de **polymorphic type systems** - tipo `Promise<T>` é **type constructor** que constrói tipos concretos (`Promise<User>`, `Promise<number>`) a partir de type parameter `T`. Implementa **type preservation** - transformações async mantêm type relationships (`Promise<T> → Promise<U>` via `map`). Segue **functor laws** - `Promise.then()` é morphism que preserva composition.

**Pattern básico:**
```typescript
// Generic Promise patterns - type parameters para reusability

// Generic fetch function - funciona para qualquer tipo T
async function fetchById<T>(
  endpoint: string,
  id: number
): Promise<T> {
  const response = await fetch(`${endpoint}/${id}`);
  return response.json();
}

// Usage - type parameter especificado
interface User {
  id: number;
  name: string;
}

const user = await fetchById<User>('/api/users', 123);
// Type: User (Promise<User> unwrapped)

interface Post {
  id: number;
  title: string;
}

const post = await fetchById<Post>('/api/posts', 456);
// Type: Post

// Mesma função, tipos diferentes - type-safe!
```

**Generic Promise utilities:**
```typescript
// Reusable Promise utilities com generics

// Retry utility - retry async operation N times
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();  // Return type: T
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;
      await delay(1000 * attempt);  // Exponential backoff
    }
  }
  
  throw lastError!;
}

// Usage - type preserved
const user = await retry(() => fetchUser(123));
// Type: User

const data = await retry(() => fetchData());
// Type: Data

// Generic utility funciona para qualquer Promise<T>
```

**Type constraints em Promises:**
```typescript
// Generic constraints - restrict type parameter

// T must have id property
async function fetchById<T extends { id: number }>(
  items: T[],
  id: number
): Promise<T | undefined> {
  // T garantido ter id property
  return items.find(item => item.id === id);
}

interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
}

const user = await fetchById<User>(users, 123);
// OK - User has id

const invalid = await fetchById<string>(["a", "b"], 1);
// Error! string não tem id property

// Constraint garante type safety
```

**Multiple type parameters:**
```typescript
// Multiple generic type parameters

async function transform<TInput, TOutput>(
  value: TInput,
  transformer: (input: TInput) => Promise<TOutput>
): Promise<TOutput> {
  return transformer(value);
}

// Usage - dois type parameters
interface RawData {
  raw: string;
}

interface ParsedData {
  parsed: number;
}

const result = await transform<RawData, ParsedData>(
  { raw: "42" },
  async (data) => ({ parsed: parseInt(data.raw) })
);
// Type: ParsedData

// TInput e TOutput independentes
```

**Generic Promise combinators:**
```typescript
// Promise.all() com generics - preserve tuple types

async function fetchUserAndPosts<TUser, TPost>(
  userId: number
): Promise<[TUser, TPost[]]> {
  const [user, posts] = await Promise.all([
    fetchUser<TUser>(userId),
    fetchPosts<TPost>(userId)
  ]);
  
  return [user, posts];
}

// Usage - tuple types preserved
const [user, posts] = await fetchUserAndPosts<User, Post>(123);
// user: User
// posts: Post[]

// Generic combinator mantém type information
```

**Mapped types com Promises:**
```typescript
// Mapped types - transform object properties to Promises

type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
};

interface SyncApi {
  getUser: () => User;
  getPost: () => Post;
}

type AsyncApi = Promisify<SyncApi>;
// {
//   getUser: () => Promise<User>;
//   getPost: () => Promise<Post>;
// }

// Transform sync API to async API types
```

**Conditional types com Promises:**
```typescript
// Conditional types - unwrap Promise types

type Awaited<T> = T extends Promise<infer U> ? U : T;

type A = Awaited<Promise<number>>;  // number
type B = Awaited<string>;  // string

// Nested Promises
type Nested = Awaited<Promise<Promise<User>>>;  // Promise<User>

// Utility type para extract Promise value type

// Recursive Awaited (built-in TS 4.5+)
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>
  : T;

type Deep = DeepAwaited<Promise<Promise<Promise<number>>>>;
// number (recursively unwrapped)
```

### Contexto Histórico e Evolução

**TypeScript 1.0 (2014):** Generics básicos.

```typescript
// TypeScript 1.0 - basic generics
function identity<T>(value: T): T {
  return value;
}

// Sem Promise types ainda
```

**TypeScript 1.4 (2015):** Promise<T> adicionado.

```typescript
// TypeScript 1.4 - Promise<T> generic
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(r => r.json());
}
```

**TypeScript 2.1 (2016):** Async/await com generics.

```typescript
// TypeScript 2.1 - async/await generics
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}
```

**TypeScript 2.8 (2018):** Conditional types.

```typescript
// TypeScript 2.8 - conditional Promise types
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<number>>;  // number
```

**TypeScript 3.0 (2018):** Better generic inference.

```typescript
// TypeScript 3.0 - melhor inference
async function fetchArray<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  return response.json();
}

const users = await fetchArray('/api/users');
// Type inferido: any[] (ainda precisa type parameter)
```

**TypeScript 4.5 (2021):** Awaited<T> built-in.

```typescript
// TypeScript 4.5 - Awaited utility type
type Result = Awaited<Promise<number>>;  // number
type Nested = Awaited<Promise<Promise<string>>>;  // string

// Built-in recursive unwrap
```

**TypeScript 5.0 (2023):** Better generic Promise inference.

```typescript
// TypeScript 5.0 - melhor inference
const promises = [
  Promise.resolve(1),
  Promise.resolve("text"),
  Promise.resolve(true)
];

const results = await Promise.all(promises);
// Type: [number, string, boolean] (tuple preservado)
```

### Problema Fundamental que Resolve

Generics com Promise resolvem problemas de **code duplication**, **type-unsafe async utilities**, **loss of type information**, e **boilerplate em async operations**.

**Problema 1: Duplicated Async Functions**
```typescript
// Sem generics - duplicação para cada tipo ❌

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`);
  return response.json();
}

async function fetchComment(id: number): Promise<Comment> {
  const response = await fetch(`/api/comments/${id}`);
  return response.json();
}

// Código quase idêntico repetido 3 vezes!

// ✗ Code duplication
// ✗ Hard to maintain
```

**Solução: Generic fetch function**
```typescript
// Generics - uma função para todos os tipos ✅

async function fetchById<T>(
  endpoint: string,
  id: number
): Promise<T> {
  const response = await fetch(`${endpoint}/${id}`);
  return response.json();
}

// Usage - type parameter especificado
const user = await fetchById<User>('/api/users', 123);
const post = await fetchById<Post>('/api/posts', 456);
const comment = await fetchById<Comment>('/api/comments', 789);

// ✓ Single function
// ✓ Type-safe
// ✓ Reusable
```

**Problema 2: Type Information Lost**
```typescript
// Utility sem generics - perde type information ❌

async function retry(
  operation: () => Promise<any>,
  maxAttempts: number
): Promise<any> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
    }
  }
}

// Usage - type perdido
const user = await retry(() => fetchUser(123), 3);
// Type: any (sem type safety!)

console.log(user.anything);  // No error - any!

// ✗ Type information lost
// ✗ No autocomplete
```

**Solução: Generic retry utility**
```typescript
// Generic retry - preserva type information ✅

async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
    }
  }
  throw new Error('Unreachable');
}

// Usage - type preserved
const user = await retry(() => fetchUser(123), 3);
// Type: User (type-safe!)

console.log(user.name);     // OK - name existe
console.log(user.invalid);  // Error! invalid não existe

// ✓ Type information preserved
// ✓ Autocomplete works
```

**Problema 3: No Type Constraints**
```typescript
// Sem constraints - qualquer tipo aceito ❌

async function findById<T>(
  items: T[],
  id: number
): Promise<T | undefined> {
  // Assume T tem id, mas não enforced!
  return items.find((item: any) => item.id === id);
}

// Aceita tipos sem id property
const result = await findById([1, 2, 3], 1);
// Compila mas quebra em runtime!

// ✗ No type safety
// ✗ Runtime errors possíveis
```

**Solução: Generic constraints**
```typescript
// Generic constraint - enforce id property ✅

async function findById<T extends { id: number }>(
  items: T[],
  id: number
): Promise<T | undefined> {
  // T garantido ter id: number
  return items.find(item => item.id === id);
}

// Usage - type-safe
interface User {
  id: number;
  name: string;
}

const user = await findById(users, 123);  // OK

const invalid = await findById([1, 2, 3], 1);
// Error! number não tem id property

// ✓ Type constraint enforced
// ✓ Compile-time error
```

**Problema 4: Promise.all() Type Loss**
```typescript
// Promise.all() sem generics - perde tuple types ❌

const results = await Promise.all([
  fetchUser(123),
  fetchPost(456),
  fetchComment(789)
]);

// Type: any[] (type information lost!)

const user = results[0];     // Type: any
const post = results[1];     // Type: any
const comment = results[2];  // Type: any

// ✗ Tuple types lost
// ✗ No type safety
```

**Solução: Generic tuple preservation**
```typescript
// Promise.all() com generics - preserva tuple types ✅

async function fetchAll<T1, T2, T3>(
  p1: Promise<T1>,
  p2: Promise<T2>,
  p3: Promise<T3>
): Promise<[T1, T2, T3]> {
  return Promise.all([p1, p2, p3]);
}

const [user, post, comment] = await fetchAll(
  fetchUser(123),
  fetchPost(456),
  fetchComment(789)
);

// Types preserved:
// user: User
// post: Post
// comment: Comment

// ✓ Tuple types preserved
// ✓ Full type safety
```

**Fundamento teórico:** Generics com Promise implementam **parametric polymorphism** - permitindo código reusável que funciona para múltiplos tipos mantendo **complete type safety** e **type inference**.

### Importância no Ecossistema

Generics com Promise são importantes porque:

- **Code reusability:** Evita duplicação de async code
- **Type safety:** Preserva type information através de async operations
- **Utility functions:** Enable generic async utilities (retry, timeout, cache)
- **API abstraction:** Generic API clients
- **Framework integration:** React hooks, RxJS, async iterators
- **Type inference:** TypeScript infere types automaticamente
- **Constraints:** Type constraints garantem properties
- **Modern patterns:** Essential para TypeScript avançado

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Generic Promise:** `Promise<T>` com type parameter
2. **Type preservation:** Generics mantêm type information
3. **Constraints:** `T extends X` restrict type parameters
4. **Multiple parameters:** `<T, U, V>` independent types
5. **Utility types:** Awaited<T>, Promisify<T>

### Pilares Fundamentais

- **`Promise<T>`:** Generic Promise type
- **Type parameters:** `<T>` placeholder para tipos
- **Constraints:** `T extends X` restrict T
- **Inference:** TypeScript infere T automaticamente
- **Combinators:** Promise.all() com generics

### Visão Geral das Nuances

- **Mapped types:** Transform objects to Promise types
- **Conditional types:** Unwrap Promise<T>
- **Tuple preservation:** Promise.all() tuple types
- **Higher-order generics:** Generic function composition
- **Default type parameters:** `<T = DefaultType>`

## 🧠 Fundamentos Teóricos

### Basic Generic Promise

```typescript
// Basic generic Promise function

async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

// Usage
const user = await fetchData<User>('/api/users/123');
// Type: User
```

**Basic:** Generic async function.

### Princípios e Conceitos Subjacentes

#### Type Parameter Inference

```typescript
// TypeScript pode inferir type parameter

async function wrapPromise<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}

// Inference - tipo inferido do argumento
const num = await wrapPromise(42);  // Type: number
const str = await wrapPromise("hello");  // Type: string

// Explicit type parameter
const user = await wrapPromise<User>({ id: 1, name: "Alice" });
```

**Inference:** Automatic type parameter deduction.

#### Generic Constraints

```typescript
// Constraint type parameter

async function logId<T extends { id: number }>(
  entity: T
): Promise<void> {
  console.log(entity.id);  // T garantido ter id
}

// OK - User has id
interface User {
  id: number;
  name: string;
}

await logId({ id: 1, name: "Alice" });

// Error - string não tem id
await logId("invalid");  // Error!
```

**Constraints:** Type parameter restrictions.

### Multiple Type Parameters

```typescript
// Multiple independent type parameters

async function pair<T, U>(
  first: Promise<T>,
  second: Promise<U>
): Promise<[T, U]> {
  const [a, b] = await Promise.all([first, second]);
  return [a, b];
}

// Usage
const [user, post] = await pair(
  fetchUser(123),
  fetchPost(456)
);
// user: User, post: Post
```

**Multiple:** Multiple generic parameters.

#### Default Type Parameters

```typescript
// Default type parameter

async function fetchData<T = any>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

// Sem type parameter - usa default (any)
const data = await fetchData('/api/data');
// Type: any

// Com type parameter - override default
const user = await fetchData<User>('/api/users/123');
// Type: User
```

**Default:** Default generic type.

#### Generic Promise Array

```typescript
// Generic array operations

async function mapAsync<T, U>(
  items: T[],
  mapper: (item: T) => Promise<U>
): Promise<U[]> {
  return Promise.all(items.map(mapper));
}

// Usage
const ids = [1, 2, 3];
const users = await mapAsync(ids, (id) => fetchUser(id));
// Type: User[]

// Generic map preserva types
```

**Array:** Generic async array operations.

### Promisify Utility Type

```typescript
// Promisify - transform sync to async types

type Promisify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<R>
    : T[K];
};

interface SyncApi {
  getUser(id: number): User;
  getPost(id: number): Post;
}

type AsyncApi = Promisify<SyncApi>;
// {
//   getUser(id: number): Promise<User>;
//   getPost(id: number): Promise<Post>;
// }
```

**Promisify:** Transform sync types to async.

### Real-World Example - Generic Repository

```typescript
// Real-world - generic repository pattern

interface Entity {
  id: number;
}

interface Repository<T extends Entity> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

class ApiRepository<T extends Entity> implements Repository<T> {
  constructor(
    private endpoint: string
  ) {}
  
  async findById(id: number): Promise<T | null> {
    const response = await fetch(`${this.endpoint}/${id}`);
    if (!response.ok) return null;
    return response.json();
  }
  
  async findAll(): Promise<T[]> {
    const response = await fetch(this.endpoint);
    return response.json();
  }
  
  async create(data: Omit<T, 'id'>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async update(id: number, data: Partial<T>): Promise<T> {
    const response = await fetch(`${this.endpoint}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async delete(id: number): Promise<void> {
    await fetch(`${this.endpoint}/${id}`, {
      method: 'DELETE'
    });
  }
}

// Usage - type-safe repositories!

interface User extends Entity {
  name: string;
  email: string;
}

interface Post extends Entity {
  title: string;
  content: string;
}

const userRepo = new ApiRepository<User>('/api/users');
const postRepo = new ApiRepository<Post>('/api/posts');

const user = await userRepo.findById(123);
// Type: User | null

const users = await userRepo.findAll();
// Type: User[]

const newUser = await userRepo.create({
  name: "Alice",
  email: "alice@example.com"
});
// Type: User

const posts = await postRepo.findAll();
// Type: Post[]

// ✓ Single repository implementation
// ✓ Works for any Entity type
// ✓ Full type safety
```

**Real-World:** Generic repository with Promise types.

#### Modelo Mental para Compreensão

Pense em generics com Promise como **template mold**:

**Mold (Generic):** Shape adaptável
**Material (Type Parameter):** Tipo específico
**Result (Promise<T>):** Async value do tipo T
**Constraint:** Mold restrictions (T extends X)

**Analogia - Package Factory:**

**Factory (Generic Function):** Processa packages
**Package type (T):** Tipo do conteúdo
**Processing (async):** Future processing
**Output (Promise<T>):** Packaged result tipo T
**Constraints:** Package requirements (T extends X)

**Metáfora - Food Processor:**

**Processor (Generic):** Processa any food type
**Food type (T):** Type parameter
**Processing (async):** Takes time
**Result (Promise<T>):** Processed food tipo T
**Settings (Constraints):** Compatible food types only

**Fluxo visual:**
```
Generic Promise Flow:

async function fetch<T>(url: string): Promise<T> {
                   └┬┘                  └────┬────┘
                    │                        │
              Type parameter          Return Promise<T>
                    │                        │
                    └────────────────────────┘
                    
Usage:
const user = await fetch<User>('/api/users/123');
                        └─┬─┘
                          │
                    Specify type parameter
                          │
                          ▼
                  Promise<User> → User
                  
Generic = Placeholder for ANY type
T = Actual type substituted
Promise<T> = Async value of type T
```

## 🔍 Análise Conceitual Profunda

### Higher-Order Generic Functions

```typescript
// Higher-order functions com generics

type AsyncMapper<T, U> = (value: T) => Promise<U>;

async function compose<A, B, C>(
  f: AsyncMapper<A, B>,
  g: AsyncMapper<B, C>
): Promise<AsyncMapper<A, C>> {
  return async (value: A) => {
    const intermediate = await f(value);
    return g(intermediate);
  };
}

// Compose async transformations
const processUser = await compose(
  fetchUser,
  enrichUserData
);

const user = await processUser(123);
```

**Higher-Order:** Generic function composition.

#### Conditional Promise Types

```typescript
// Conditional types para unwrap Promises

type Awaited<T> = T extends Promise<infer U>
  ? Awaited<U>  // Recursive unwrap
  : T;

type A = Awaited<Promise<number>>;  // number
type B = Awaited<Promise<Promise<string>>>;  // string
type C = Awaited<number>;  // number (não é Promise)

// Utility type built-in TS 4.5+
```

**Conditional:** Advanced Promise unwrapping.

### Variadic Tuple Types

```typescript
// Variadic tuple types (TS 4.0+)

async function all<T extends readonly unknown[]>(
  ...promises: { [K in keyof T]: Promise<T[K]> }
): Promise<T> {
  return Promise.all(promises) as Promise<T>;
}

// Usage - preserva tuple types
const [user, post, comment] = await all(
  fetchUser(123),
  fetchPost(456),
  fetchComment(789)
);

// Types:
// user: User
// post: Post
// comment: Comment
```

**Variadic:** Variadic generic tuples.

#### Generic Cache Utility

```typescript
// Generic cache com Promise

class PromiseCache<T> {
  private cache = new Map<string, Promise<T>>();
  
  async getOrFetch(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    const promise = fetcher();
    this.cache.set(key, promise);
    
    try {
      return await promise;
    } catch (error) {
      this.cache.delete(key);  // Remove failed promise
      throw error;
    }
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Usage
const userCache = new PromiseCache<User>();

const user = await userCache.getOrFetch(
  'user-123',
  () => fetchUser(123)
);
// Type: User (cached ou fetched)
```

**Cache:** Generic Promise cache.

## 🎯 Aplicabilidade e Contextos

### Generic API Client

```typescript
class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint);
    return response.json();
  }
}
```

**Raciocínio:** Type-safe generic API methods.

### Async Utilities

```typescript
async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  // Generic retry utility
}
```

**Raciocínio:** Reusable generic async utilities.

### Repository Pattern

```typescript
interface Repository<T extends Entity> {
  findById(id: number): Promise<T | null>;
}
```

**Raciocínio:** Generic repository abstraction.

## ⚠️ Limitações e Considerações Teóricas

### Type Erasure

```typescript
// Generics erased em runtime

async function fetchData<T>(url: string): Promise<T> {
  // T não existe em runtime!
  // Cannot: if (value instanceof T)
  const response = await fetch(url);
  return response.json();
}

// Runtime validation necessário
```

**Limitação:** Type parameters erased at runtime.

### any Escape Hatch

```typescript
// any perde type safety

async function fetchData<T = any>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();  // any → T (unsafe!)
}

// Evite any, use explicit types
```

**Consideração:** Avoid any em generics.

### Constraint Complexity

```typescript
// Constraints muito complexos

type Fetchable<T> = T extends { id: number }
  ? T extends { createdAt: Date }
    ? T extends { updatedAt: Date }
      ? T
      : never
    : never
  : never;

// Hard to read - simplifique
```

**Limitação:** Complex constraints hard to maintain.

## 🔗 Interconexões Conceituais

**Relação com Promise<T>:** Generics aplicados a Promises.

**Relação com Type Inference:** TypeScript infere type parameters.

**Relação com Constraints:** `T extends X` restrict parameters.

**Relação com Utility Types:** Awaited<T>, Promisify<T>.

**Relação com Mapped Types:** Transform object properties.

## 🚀 Evolução e Próximos Conceitos

Dominar generics com Promise prepara para:
- **Advanced type inference:** Conditional types
- **Variadic tuples:** Rest parameter types
- **Template literal types:** Type-level string manipulation
- **Branded types:** Nominal typing patterns
- **Error handling types:** Typed Result<T, E>
- **Effect systems:** Type-level effect tracking
