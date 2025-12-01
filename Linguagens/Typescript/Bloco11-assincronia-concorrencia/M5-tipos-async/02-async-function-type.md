# Async Function Type

## 🎯 Introdução e Definição

### Definição Conceitual

**Async function type** é **type signature** para funções declaradas com `async` keyword que **sempre retornam Promise<T>**. Quando função é `async`, return type é **automaticamente wrapped em Promise** - `async function returning number` tem type `() => Promise<number>`. TypeScript **infere Promise wrapping** automaticamente, mas permite **explicit annotation** para clarity e type enforcement.

Conceitualmente, async functions implementam **automatic Promise transformation** - qualquer valor retornado é **automaticamente wrapped** em `Promise.resolve()`, qualquer erro thrown é **automatically wrapped** em `Promise.reject()`. Type system reflete esta transformation - return type `T` vira `Promise<T>`.

**Fundamento teórico:** Async function types derivam de **monadic type transformation** - transformação de `T → Promise<T>` é **automatic lift** para Promise monad. Implementa **type-level contract** - `async` keyword garante retorno é sempre Promise, mesmo se código retorna valor sync. Segue **function type composition** - `async (x: A) => B` tem type `(x: A) => Promise<B>`.

**Pattern básico:**
```typescript
// Async function type - retorno sempre Promise<T>

// Explicit type annotation
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();  // Return User (wrapped em Promise)
}

// Type signature: (id: number) => Promise<User>
// return response.json() retorna User, mas type é Promise<User>

// Type inference - TypeScript infere Promise<T>
async function getData() {
  return { value: 42 };  // Return object
}

// Type inferido: () => Promise<{ value: number }>
// Objeto wrapped automaticamente em Promise
```

**Automatic Promise wrapping:**
```typescript
// Async sempre retorna Promise - mesmo com return sync

async function getNumber(): Promise<number> {
  return 42;  // Synchronous value
}

// Equivalente a:
function getNumberPromise(): Promise<number> {
  return Promise.resolve(42);
}

// Ambos têm mesmo type: () => Promise<number>

// Async wraps automaticamente
const num = await getNumber();  // Type: number (unwrapped)

// async keyword força Promise wrapping
```

**Type annotation vs inference:**
```typescript
// Explicit annotation - recomendado para public APIs

async function fetchData(id: number): Promise<Data> {
  // Return type explícito - documenta contract
  const response = await fetch(`/api/data/${id}`);
  return response.json();
}

// Type inference - funciona mas menos claro

async function fetchDataInferred(id: number) {
  // Return type inferido: Promise<any>
  // JSON.parse retorna any por padrão
  const response = await fetch(`/api/data/${id}`);
  return response.json();
}

// Explicit annotation melhor:
// - Documenta contract
// - Catch type errors
// - Autocomplete funciona
```

**Generic async functions:**
```typescript
// Async function com type parameters

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
// Type: User (unwrapped from Promise<User>)

// Generic async function type: <T>(endpoint: string, id: number) => Promise<T>
```

**Arrow function async types:**
```typescript
// Arrow functions com async

// Explicit type
const fetchUser: (id: number) => Promise<User> = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// Type inference
const getNumber = async () => {
  return 42;
};
// Type: () => Promise<number>

// Arrow async com generic
const fetchById = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(endpoint);
  return response.json();
};
// Type: <T>(endpoint: string) => Promise<T>
```

**Async method types:**
```typescript
// Async methods em classes e interfaces

interface ApiClient {
  // Async method em interface
  getUser(id: number): Promise<User>;
  getPosts(userId: number): Promise<Post[]>;
}

class ApiClientImpl implements ApiClient {
  // Async method implementation
  async getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
  
  async getPosts(userId: number): Promise<Post[]> {
    const response = await fetch(`/api/posts?userId=${userId}`);
    return response.json();
  }
}

// Method types: (id: number) => Promise<User>
//              (userId: number) => Promise<Post[]>
```

### Contexto Histórico e Evolução

**Pre-ES2017:** Async functions não existiam.

```typescript
// Pre-async - Promise chains
function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json());
}

// Type: (id: number) => Promise<User>
```

**ES2017 (ES8):** Async/await introduzido.

```javascript
// ES2017 - async/await (JavaScript)
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Sem types - runtime only
```

**TypeScript 2.1 (2016):** Async/await support.

```typescript
// TypeScript 2.1 - async function types
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Type-safe async functions
```

**TypeScript 2.3 (2017):** Better async inference.

```typescript
// TypeScript 2.3 - melhor type inference
async function getData() {
  return { value: 42 };
}

// Type inferido: () => Promise<{ value: number }>
```

**TypeScript 3.6 (2019):** Stricter async checking.

```typescript
// TypeScript 3.6 - stricter Promise return
async function getNumber(): Promise<number> {
  return "string";  // Error: string não é number
}

// Type mismatch detectado
```

**TypeScript 4.5 (2021):** Awaited<T> utility type.

```typescript
// TypeScript 4.5 - Awaited utility
async function getData(): Promise<Data> {
  return { value: 42 };
}

type DataType = Awaited<ReturnType<typeof getData>>;  // Data
```

**TypeScript 5.0 (2023):** Better async generics.

```typescript
// TypeScript 5.0 - melhor generic inference
async function fetchArray<T>(items: T[]): Promise<T[]> {
  return items;
}

const numbers = await fetchArray([1, 2, 3]);  // Type: number[]
```

### Problema Fundamental que Resolve

Async function types resolvem problemas de **type consistency em async code**, **automatic Promise wrapping**, **return type documentation**, e **generic async patterns**.

**Problema 1: Manual Promise Wrapping**
```typescript
// Sem async - manual Promise wrapping ❌

function fetchUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => {
      // Manual transformations
      return {
        id: data.id,
        name: data.name
      };
    })
    .catch(error => {
      // Manual error handling
      throw new Error(`Failed to fetch user: ${error.message}`);
    });
}

// ✗ Verbose Promise chains
// ✗ Manual error wrapping
```

**Solução: Async function - automatic wrapping**
```typescript
// Async function - automatic Promise wrapping ✅

async function fetchUser(id: number): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    
    // Return value automatically wrapped
    return {
      id: data.id,
      name: data.name
    };
  } catch (error) {
    // Error automatically wrapped em Promise.reject()
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// ✓ Concise syntax
// ✓ Automatic Promise wrapping
// ✓ Synchronous-style error handling
```

**Problema 2: Type Inconsistency**
```typescript
// Mixed sync/async return types ❌

function getData(cached: boolean): Promise<Data> | Data {
  if (cached) {
    return { value: 42 };  // Synchronous
  } else {
    return fetch('/api/data')  // Asynchronous
      .then(r => r.json());
  }
}

// Como usar? É Promise ou não?
const result = getData(true);

// Precisa runtime check
if (result instanceof Promise) {
  const data = await result;
} else {
  const data = result;
}

// ✗ Type inconsistency
// ✗ Runtime checking necessário
```

**Solução: Consistent async return type**
```typescript
// Async function - consistent Promise return ✅

async function getData(cached: boolean): Promise<Data> {
  if (cached) {
    return { value: 42 };  // Wrapped automaticamente
  } else {
    const response = await fetch('/api/data');
    return response.json();
  }
}

// Sempre Promise - uso consistente
const data = await getData(true);  // Type: Data
console.log(data.value);

// ✓ Consistent async interface
// ✓ No runtime checks
```

**Problema 3: Generic Function Typing**
```typescript
// Generic async sem type safety ❌

function fetchById(endpoint: string, id: number): Promise<any> {
  return fetch(`${endpoint}/${id}`)
    .then(response => response.json());
}

// Return type any - sem type safety
const user = await fetchById('/api/users', 123);
console.log(user.anything);  // No error!

// ✗ any loses type information
// ✗ No autocomplete
```

**Solução: Generic async function**
```typescript
// Generic async function - type-safe ✅

async function fetchById<T>(
  endpoint: string,
  id: number
): Promise<T> {
  const response = await fetch(`${endpoint}/${id}`);
  return response.json();
}

// Type parameter especificado
interface User {
  id: number;
  name: string;
}

const user = await fetchById<User>('/api/users', 123);
console.log(user.name);    // OK - name existe
console.log(user.email);   // Error! email não existe

// ✓ Type-safe generic async
// ✓ Autocomplete works
```

**Problema 4: Method Type Documentation**
```typescript
// Async methods sem type annotations ❌

class ApiClient {
  async getUser(id) {  // Parâmetro any
    const response = await fetch(`/api/users/${id}`);
    return response.json();  // Return any
  }
}

// Sem type information
const client = new ApiClient();
const user = await client.getUser(123);  // user é any

// ✗ No type safety
// ✗ No autocomplete
```

**Solução: Typed async methods**
```typescript
// Typed async methods - documented contract ✅

interface User {
  id: number;
  name: string;
}

class ApiClient {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
}

// Type-safe usage
const client = new ApiClient();
const user = await client.getUser(123);  // Type: User
console.log(user.name);  // Autocomplete works!

// ✓ Full type safety
// ✓ Method signature documented
```

**Fundamento teórico:** Async function types implementam **type-level contract** - garantindo return type consistency, automatic Promise wrapping, e compile-time type checking para async operations.

### Importância no Ecossistema

Async function types são importantes porque:

- **Type consistency:** Garantem Promise return type
- **Automatic wrapping:** Simplify async code
- **API documentation:** Type signatures documentam async APIs
- **Generic patterns:** Enable reusable async utilities
- **Error safety:** Compile-time error checking
- **IDE support:** Autocomplete e type hints
- **Framework integration:** React hooks, Node.js APIs
- **Modern standard:** Essential para TypeScript async programming

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Async keyword:** Força return type Promise<T>
2. **Automatic wrapping:** Valores wrapped em Promise.resolve()
3. **Type annotation:** Explicit vs inferred return types
4. **Generic async:** Type parameters em async functions
5. **Method types:** Async methods em classes/interfaces

### Pilares Fundamentais

- **`async function`:** Retorna sempre Promise<T>
- **Type inference:** TypeScript infere Promise wrapping
- **Generic async:** `async <T>(...) => Promise<T>`
- **Arrow functions:** `async () => T` é `() => Promise<T>`
- **Method signatures:** Async methods em interfaces

### Visão Geral das Nuances

- **void return:** `async () => void` é `() => Promise<void>`
- **never return:** `async () => never` é `() => Promise<never>`
- **Union returns:** `async () => A | B` é `() => Promise<A | B>`
- **Error types:** Errors wrapped em Promise.reject()
- **Type guards:** Async functions com type predicates

## 🧠 Fundamentos Teóricos

### Basic Async Function Type

```typescript
// Basic async function type annotation

async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  return response.json();
}

// Type: () => Promise<Data>
```

**Basic:** Async function returning Promise<T>.

### Princípios e Conceitos Subjacentes

#### Type Inference

```typescript
// TypeScript infere Promise return type

async function getNumber() {
  return 42;
}

// Type inferido: () => Promise<number>

async function getObject() {
  return { value: 42, text: "hello" };
}

// Type inferido: () => Promise<{ value: number; text: string; }>
```

**Inference:** Automatic Promise<T> inference.

#### Explicit Type Annotation

```typescript
// Explicit type annotation - recomendado

interface User {
  id: number;
  name: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Type: (id: number) => Promise<User>

// Type annotation catch errors
async function getUser(): Promise<User> {
  return { id: 1 };  // Error! name faltando
}
```

**Annotation:** Explicit return type enforcement.

### Arrow Function Async Types

```typescript
// Arrow async functions

// Explicit type
const fetchData: (id: number) => Promise<Data> = async (id) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
};

// Type inference
const getData = async () => {
  return { value: 42 };
};
// Type: () => Promise<{ value: number }>

// Generic arrow async
const fetchById = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(endpoint);
  return response.json();
};
// Type: <T>(endpoint: string) => Promise<T>
```

**Arrow:** Arrow function async types.

#### Generic Async Functions

```typescript
// Generic async function

async function fetchArray<T>(
  endpoint: string
): Promise<T[]> {
  const response = await fetch(endpoint);
  return response.json();
}

// Usage
interface User {
  id: number;
  name: string;
}

const users = await fetchArray<User>('/api/users');
// Type: User[]

// Generic constraints
async function fetchById<T extends { id: number }>(
  endpoint: string,
  id: number
): Promise<T> {
  const response = await fetch(`${endpoint}/${id}`);
  return response.json();
}

// T must have id property
```

**Generic:** Type parameters em async functions.

#### Async Method Types

```typescript
// Async methods em classes

class ApiClient {
  private baseUrl = 'https://api.example.com';
  
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// Usage
const client = new ApiClient();
const user = await client.get<User>('/users/123');
// Type: User
```

**Methods:** Async methods em classes.

### Interface Async Methods

```typescript
// Interface com async methods

interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

// Implementation
class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User | null> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) return null;
    return response.json();
  }
  
  async findAll(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }
  
  async create(data: Omit<User, 'id'>): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.json();
  }
  
  async delete(id: number): Promise<void> {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
  }
}
```

**Interface:** Async method signatures em interfaces.

### Real-World Example - Service Layer

```typescript
// Real-world - typed service layer

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

interface CreateUserDto {
  name: string;
  email: string;
}

class UserService {
  private baseUrl = 'https://api.example.com';
  
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getUser(id: number): Promise<User> {
    const response = await this.request<User>(`/users/${id}`);
    return response.data;
  }
  
  async getAllUsers(): Promise<User[]> {
    const response = await this.request<User[]>('/users');
    return response.data;
  }
  
  async createUser(dto: CreateUserDto): Promise<User> {
    const response = await this.request<User>('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    return response.data;
  }
  
  async updateUser(id: number, dto: Partial<CreateUserDto>): Promise<User> {
    const response = await this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    return response.data;
  }
  
  async deleteUser(id: number): Promise<void> {
    await this.request<void>(`/users/${id}`, {
      method: 'DELETE'
    });
  }
}

// Usage - all type-safe!
const service = new UserService();

const user = await service.getUser(123);
console.log(user.name);  // Type: string

const users = await service.getAllUsers();
console.log(users.length);  // Type: number

const newUser = await service.createUser({
  name: "Alice",
  email: "alice@example.com"
});
console.log(newUser.id);  // Type: number

await service.deleteUser(newUser.id);  // Type: void

// ✓ Full type safety
// ✓ Autocomplete works
// ✓ Compile-time error checking
```

**Real-World:** Type-safe service layer with async methods.

#### Modelo Mental para Compreensão

Pense em async function como **automatic gift wrapper**:

**Function body:** Gift contents
**async keyword:** Automatic wrapper
**return value:** Gift (wrapped automatically)
**Type annotation:** Label on wrapper (Promise<T>)

**Analogia - Coffee Machine:**

**Input (parameters):** Ingredients
**async function:** Machine processing
**Processing (await):** Brewing
**Output (return):** Coffee (always in cup = Promise)
**Type (Promise<Coffee>):** Cup type guaranteed

**Metáfora - Package Service:**

**Function:** Package service
**async keyword:** All packages wrapped automatically
**return value:** Item (wrapped em box = Promise)
**Type annotation:** Box label (Promise<T>)
**await:** Open box, get item

**Fluxo visual:**
```
Async Function Type Flow:

async function fetchUser(id: number): Promise<User> {
       └────────┬────────┘            └─────┬─────┘
                │                           │
         async keyword              Return type
                │                    (always Promise<T>)
                ▼
    return { id: 1, name: "Alice" };
           └──────────┬──────────┘
                      │
              Return User object
              (wrapped em Promise automaticamente)
              
Type: (id: number) => Promise<User>
      └────┬────┘    └──────┬──────┘
           │                │
      Parameters      Return type
                      
await fetchUser(123) → User (unwrapped)
```

## 🔍 Análise Conceitual Profunda

### Multiple Type Parameters

```typescript
// Multiple generic type parameters

async function transform<TIn, TOut>(
  input: TIn,
  transformer: (value: TIn) => TOut
): Promise<TOut> {
  const result = transformer(input);
  return result;
}

// Usage
const doubled = await transform(42, (x) => x * 2);
// Type: number

const text = await transform(42, (x) => x.toString());
// Type: string
```

**Multiple:** Multiple type parameters.

#### Conditional Return Types

```typescript
// Conditional async return types

type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

async function getNumber(): Promise<number> {
  return 42;
}

type NumberType = AsyncReturnType<typeof getNumber>;  // number
```

**Conditional:** Extract async return type.

### Higher-Order Async Functions

```typescript
// Higher-order async functions

type AsyncFunction<T, R> = (value: T) => Promise<R>;

async function pipe<A, B, C>(
  f1: AsyncFunction<A, B>,
  f2: AsyncFunction<B, C>
): Promise<AsyncFunction<A, C>> {
  return async (value: A) => {
    const intermediate = await f1(value);
    return f2(intermediate);
  };
}

// Compose async functions
const processUser = await pipe(
  fetchUser,
  enrichUserData
);

const user = await processUser(123);
```

**Higher-Order:** Async function composition.

#### Async Generator Functions

```typescript
// Async generator function types

async function* fetchPages<T>(
  endpoint: string
): AsyncGenerator<T[], void, undefined> {
  let page = 1;
  
  while (true) {
    const response = await fetch(`${endpoint}?page=${page}`);
    const data: T[] = await response.json();
    
    if (data.length === 0) break;
    
    yield data;
    page++;
  }
}

// Usage
for await (const users of fetchPages<User>('/api/users')) {
  console.log(users);  // Type: User[]
}
```

**Generator:** Async generator types.

## 🎯 Aplicabilidade e Contextos

### API Clients

```typescript
class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint);
    return response.json();
  }
}
```

**Raciocínio:** Type-safe API methods.

### Repository Pattern

```typescript
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  create(data: T): Promise<T>;
}
```

**Raciocínio:** Async repository methods.

### Service Layer

```typescript
class UserService {
  async getUser(id: number): Promise<User> {
    return this.repository.findById(id);
  }
}
```

**Raciocínio:** Service layer async methods.

## ⚠️ Limitações e Considerações Teóricas

### Cannot Return Non-Promise

```typescript
// Async sempre retorna Promise

async function getValue(): string {  // Error!
  return "value";
}

// Deve ser: Promise<string>
async function getValue(): Promise<string> {
  return "value";
}
```

**Limitação:** Return type deve ser Promise<T>.

### Type Inference com any

```typescript
// JSON.parse retorna any

async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();  // Type: Promise<any>
}

// Precisa type annotation
async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  return response.json();
}
```

**Consideração:** Explicit types quando inference retorna any.

### Error Type Not Enforced

```typescript
// Rejection type não type-safe

async function fetchData(): Promise<Data> {
  throw "string error";  // Permitido mas não recomendado
}

// Sempre throw Error objects
async function fetchData(): Promise<Data> {
  throw new Error("Failed");
}
```

**Limitação:** Rejection type não enforced por type system.

## 🔗 Interconexões Conceituais

**Relação com Promise<T>:** Async functions retornam Promise<T>.

**Relação com Generics:** Generic async functions.

**Relação com Type Inference:** TypeScript infere Promise wrapping.

**Relação com Interfaces:** Async method signatures.

**Relação com Utility Types:** ReturnType<T>, Awaited<T>.

## 🚀 Evolução e Próximos Conceitos

Dominar async function types prepara para:
- **Generic async patterns:** Advanced generic usage
- **Promise utilities:** Type-safe Promise helpers
- **Error handling types:** Typed error handling
- **Async iterators:** AsyncGenerator types
- **Higher-order async:** Function composition
- **Testing async code:** Type-safe async tests
