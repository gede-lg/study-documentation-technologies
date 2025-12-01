# TypeScript Fetch: Typing Responses com Generics - Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**TypeScript fetch typing** é **aplicação de type system** ao **Fetch API**, usando **generics** (`<T>`) para **parametrizar response types**, criando **type-safe wrappers** que garantem **compile-time type checking** (errors detectados antes de runtime), **IntelliSense completo** (autocomplete para response properties), **type inference** (TypeScript deduz types automaticamente), eliminando **type assertions** (`as User`), **runtime type errors** (`Cannot read property 'name' of undefined`), fornecendo **contracts explícitos** (API response structure documentada via types).

Conceitualmente, **fetch() nativo** retorna **Promise<Response>** → **response.json()** retorna **Promise<any>** → **any** significa **zero type safety** (TypeScript não sabe structure de response) → **type assertions** manuais (`const user = await response.json() as User`) → **unsafe** (assertion pode estar wrong, runtime error). **Generic wrapper** (`request<T>()`) parametriza return type → **Promise<T>** em vez de **Promise<any>** → **type flows through** toda promise chain → **compiler validates** property access → **IntelliSense** sugere properties → **refactoring safe** (rename property → compiler finds all usages).

```typescript
// SEM Generics (unsafe):
async function getUser(id: number) {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const user = await response.json(); // Type: any (zero type safety)
  
  console.log(user.name); // No error, mas user.name pode não existir
  console.log(user.age); // No error, mas age pode ser undefined
  
  return user; // Return type: any
}

// Problemas:
// - user é any (sem IntelliSense)
// - Compiler não valida property access
// - Runtime errors se response structure muda
// - Refactoring não detecta breaking changes

// COM Generics (type-safe):
interface User {
  id: number;
  name: string;
  email: string;
}

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json(); // Return type: Promise<T>
}

async function getUser(id: number): Promise<User> {
  const user = await request<User>(`https://api.example.com/users/${id}`);
  
  console.log(user.name); // ✅ Type-safe (name: string)
  console.log(user.age); // ❌ Compiler error: Property 'age' does not exist on type 'User'
  
  return user; // Return type: User
}

// Benefícios:
// - user é User (IntelliSense completo)
// - Compiler valida ALL property access
// - Compile-time errors (não runtime)
// - Refactoring safe (rename User.name → compiler finds usages)
```

### Contexto Histórico e Motivação

**Evolução de TypeScript Fetch:**

1. **Fetch API (2015)**: JavaScript puro (sem types)
2. **TypeScript 2.0 (2016)**: Generic constraints, better inference
3. **axios (2016+)**: Generic request<T>() pattern popularizado
4. **TypeScript 3.0+ (2018+)**: Unknown type, stricter checks
5. **Modern (2020+)**: Type-safe API clients standard

**Motivação para Generics:**

**JavaScript** é **dynamically typed** → **any** aceita qualquer value → **runtime errors** comuns (`user.name` quando user é null, `user.age` quando age não existe). **TypeScript** adiciona **static typing** → **compile-time validation** → detecta errors **before running code**. **Generics** permitem **reusable type-safe functions**: `request<User>()` retorna **Promise<User>**, `request<Post>()` retorna **Promise<Post>** → **single implementation**, **multiple types**.

**Problemas sem Generics:**

**1. Type Assertions**: Manual `as User` (unsafe, pode estar wrong)
**2. Any Propagation**: `any` infecta codebase (lose type safety)
**3. Runtime Errors**: Property access errors (só descoberto em production)
**4. No IntelliSense**: Autocomplete não funciona (developer produtividade ↓)
**5. Refactoring Risk**: Rename/delete property → breaking changes não detectados

### Problema Fundamental que Resolve

TypeScript generics resolvem:

**1. Type Safety**: Compile-time validation (vs runtime errors)
**2. IntelliSense**: Autocomplete, go-to-definition, hover docs
**3. Refactoring**: Rename property → compiler finds ALL usages
**4. Documentation**: Types são self-documenting (API contracts)
**5. Confidence**: Compiler garante correctness (não manual testing)
**6. Maintainability**: Large codebases (types prevent regressions)

### Importância no Ecossistema

TypeScript generics são **critical** para:

- **Type Safety**: Production apps (zero tolerance para runtime errors)
- **Team Collaboration**: Types documentam API contracts
- **Refactoring**: Large codebases (safe refactors)
- **IDE Support**: IntelliSense, autocomplete (developer experience)
- **API Clients**: Reusable type-safe wrappers

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Generics**: Type parameters `<T>` (parameterize types)
2. **Type Inference**: TypeScript deduz types automaticamente
3. **Promise<T>**: Parametrized promise return type
4. **Interface/Type**: Define response structure
5. **Type Guards**: Runtime validation (is User?)
6. **Utility Types**: Partial<T>, Pick<T>, Omit<T>

### Pilares Fundamentais

- **request<T>()**: Generic wrapper para fetch
- **Promise<T>**: Parametrized promise type
- **interface**: Define object shape
- **T extends unknown**: Generic constraint
- **ReturnType<typeof fn>**: Extract return type
- **Awaited<T>**: Unwrap promise type

### Visão Geral das Nuances

- **Type Parameters**: `<T>` placeholder (filled on call)
- **Type Inference**: TypeScript deduz T automaticamente
- **Generic Constraints**: `T extends User` (limit T)
- **Multiple Generics**: `<T, U>` (multiple parameters)
- **Default Types**: `<T = unknown>` (fallback)
- **Utility Types**: Partial, Pick, Omit (transform types)

---

## �🧠 Fundamentos Teóricos

### Generic request() Básico

```typescript
// Generic wrapper para fetch

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// Interfaces (response types)
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Uso:
const user = await request<User>('https://api.example.com/users/1');
// Type: User (não any!)

console.log(user.name); // ✅ OK (name: string)
console.log(user.age); // ❌ Error: Property 'age' does not exist on type 'User'

const post = await request<Post>('https://api.example.com/posts/1');
// Type: Post

console.log(post.title); // ✅ OK (title: string)
console.log(post.name); // ❌ Error: Property 'name' does not exist on type 'Post'

// request<T> é REUSABLE:
// - Single implementation
// - Multiple types (User, Post, Comment, etc)
// - Type-safe (compiler validates ALL property access)
```

### Type Inference (Dedução Automática)

```typescript
// TypeScript deduz type parameter automaticamente em alguns casos

interface User {
  id: number;
  name: string;
}

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

// Explicit type parameter:
const user1 = await request<User>('/users/1');
// Type: User (explicit)

// Type inference via return type annotation:
async function getUser(id: number): Promise<User> {
  return request(`/users/${id}`); // TS infere T = User (via return type)
}

// Type inference NÃO funciona sem context:
const user2 = await request('/users/1');
// Type: unknown (sem <User>, TypeScript não sabe type)

// Best practice: SEMPRE especificar type parameter em request calls
const user3 = await request<User>('/users/1');
// Type: User (explicit, clear)
```

### Request Options com Generics

```typescript
// request() com options (method, headers, body)

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function request<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  // Append query params
  if (options?.params) {
    const searchParams = new URLSearchParams(options.params);
    url = `${url}?${searchParams}`;
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// Usage:

// GET com params
const users = await request<User[]>('/users', {
  params: { page: '1', limit: '10' }
});
// Type: User[]

// POST com body
interface CreateUserPayload {
  name: string;
  email: string;
}

const newUser = await request<User>('/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com'
  })
});
// Type: User

// DELETE (no response body)
await request<void>('/users/1', {
  method: 'DELETE'
});
// Type: void (no return value)
```

### Generic Constraints

```typescript
// Constraint: T deve ter 'id' property

interface HasId {
  id: number;
}

async function request<T extends HasId>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = await response.json();
  
  // T garante que data.id existe
  console.log(`Fetched resource with ID: ${data.id}`);
  
  return data;
}

// OK:
interface User {
  id: number;
  name: string;
}

const user = await request<User>('/users/1');
// ✅ User extends HasId (tem id: number)

// Error:
interface Config {
  theme: string;
  language: string;
}

const config = await request<Config>('/config');
// ❌ Error: Type 'Config' does not satisfy the constraint 'HasId'
// Config não tem 'id' property

// Use case: Garantir que ALL API responses têm ID
// (pode ser requirement do sistema)
```

### Multiple Type Parameters

```typescript
// Multiple generics: request body + response

async function request<TResponse, TPayload = unknown>(
  url: string,
  options?: {
    method?: string;
    body?: TPayload;
  }
): Promise<TResponse> {
  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: options?.body ? JSON.stringify(options.body) : undefined
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// Usage:

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
}

// POST: especifica response E payload types
const user = await request<User, CreateUserPayload>('/users', {
  method: 'POST',
  body: {
    name: 'Alice',
    email: 'alice@example.com'
  }
});
// TResponse = User
// TPayload = CreateUserPayload

// GET: apenas response type (TPayload = unknown default)
const users = await request<User[]>('/users');
// TResponse = User[]
// TPayload = unknown (default)

// Type safety em body:
await request<User, CreateUserPayload>('/users', {
  method: 'POST',
  body: {
    name: 'Bob'
    // ❌ Error: Property 'email' is missing in type
  }
});
```

### Default Type Parameters

```typescript
// Default type: unknown (se não especificado)

async function request<T = unknown>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

// Sem type parameter:
const data1 = await request('/users/1');
// Type: unknown (default)

// Com type parameter:
const data2 = await request<User>('/users/1');
// Type: User

// unknown vs any:
// - unknown: DEVE fazer type check antes de usar (safe)
// - any: Sem type check (unsafe)

const data3 = await request('/users/1');
// Type: unknown

console.log(data3.name);
// ❌ Error: Object is of type 'unknown'

// Type guard necessário:
if (typeof data3 === 'object' && data3 !== null && 'name' in data3) {
  console.log(data3.name); // ✅ OK (após type check)
}

// Best practice: SEMPRE especificar type parameter
const data4 = await request<User>('/users/1');
console.log(data4.name); // ✅ OK (type-safe)
```

### Array Responses

```typescript
// Typing array responses

interface User {
  id: number;
  name: string;
  email: string;
}

// Array type:
const users = await request<User[]>('/users');
// Type: User[]

// Array methods type-safe:
const names = users.map(u => u.name);
// Type: string[]

const emails = users.map(u => u.email);
// Type: string[]

const ages = users.map(u => u.age);
// ❌ Error: Property 'age' does not exist on type 'User'

// Filter type-safe:
const activeUsers = users.filter(u => u.active);
// ❌ Error: Property 'active' does not exist on type 'User'

// Find:
const alice = users.find(u => u.name === 'Alice');
// Type: User | undefined

if (alice) {
  console.log(alice.email); // ✅ OK (após null check)
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: API Client Class

```typescript
// Type-safe API client class

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  constructor(private baseURL: string) {}
  
  private async request<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<T> {
    let url = `${this.baseURL}${endpoint}`;
    
    // Query params
    if (config?.params) {
      const searchParams = new URLSearchParams(config.params);
      url = `${url}?${searchParams}`;
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response.json();
  }
  
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { params });
  }
  
  async post<T, TPayload = unknown>(
    endpoint: string,
    body: TPayload
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
  
  async put<T, TPayload = unknown>(
    endpoint: string,
    body: TPayload
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
  
  async delete<T = void>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }
}

// Usage:

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
}

const api = new ApiClient('https://api.example.com');

// GET
const user = await api.get<User>('/users/1');
// Type: User

const users = await api.get<User[]>('/users', { page: '1', limit: '10' });
// Type: User[]

// POST
const newUser = await api.post<User, CreateUserPayload>('/users', {
  name: 'Alice',
  email: 'alice@example.com'
});
// Type: User

// PUT
const updatedUser = await api.put<User, Partial<User>>('/users/1', {
  name: 'Alice Updated'
});
// Type: User

// DELETE
await api.delete('/users/1');
// Type: void
```

### Pattern 2: Utility Types (Partial, Pick, Omit)

```typescript
// Utility types para transform types

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: string;
}

// Partial<T>: ALL properties optional
type UpdateUserPayload = Partial<User>;

const update1: UpdateUserPayload = {
  name: 'Alice' // OK (outros properties opcionais)
};

const update2: UpdateUserPayload = {
  email: 'alice@example.com'
};

const update3: UpdateUserPayload = {}; // OK (all optional)

// Pick<T, Keys>: SELECT specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

const preview: UserPreview = {
  id: 1,
  name: 'Alice'
  // email, age, createdAt OMITTED
};

// Omit<T, Keys>: EXCLUDE specific properties
type CreateUserPayload = Omit<User, 'id' | 'createdAt'>;

const payload: CreateUserPayload = {
  name: 'Alice',
  email: 'alice@example.com',
  age: 30
  // id, createdAt OMITTED (server generates)
};

// Combining:
type UpdateUserPayload2 = Partial<Omit<User, 'id' | 'createdAt'>>;

const update4: UpdateUserPayload2 = {
  name: 'Bob' // OK (partial, sem id/createdAt)
};

// Usage em API client:
async function updateUser(
  id: number,
  payload: Partial<Omit<User, 'id' | 'createdAt'>>
): Promise<User> {
  return request<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

await updateUser(1, {
  name: 'Alice Updated',
  email: 'alice.new@example.com'
});
```

### Pattern 3: Discriminated Unions (Error Handling)

```typescript
// Type-safe error handling com discriminated unions

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  status: number;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

async function request<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0
    };
  }
}

// Usage:

interface User {
  id: number;
  name: string;
}

const result = await request<User>('/users/1');

// Type narrowing via discriminant property (success)
if (result.success) {
  // Type: SuccessResponse<User>
  console.log(result.data.name); // ✅ OK (data is User)
  // console.log(result.error); // ❌ Error: Property 'error' does not exist
} else {
  // Type: ErrorResponse
  console.log(result.error); // ✅ OK (error is string)
  console.log(result.status); // ✅ OK (status is number)
  // console.log(result.data); // ❌ Error: Property 'data' does not exist
}

// Exhaustive check:
switch (result.success) {
  case true:
    console.log(result.data);
    break;
  case false:
    console.log(result.error);
    break;
  // Compiler garante ALL cases covered
}
```

### Pattern 4: Pagination Types

```typescript
// Type-safe pagination

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

interface User {
  id: number;
  name: string;
  email: string;
}

// GET paginated users
const result = await request<PaginatedResponse<User>>('/users?page=1&limit=10');

// Type-safe access:
const users = result.data;
// Type: User[]

const page = result.page;
// Type: number

const totalPages = result.totalPages;
// Type: number

// Map over data:
const names = result.data.map(u => u.name);
// Type: string[]

// Generic helper:
async function getPaginated<T>(
  endpoint: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<T>> {
  return request<PaginatedResponse<T>>(
    `${endpoint}?page=${page}&limit=${limit}`
  );
}

const usersPage = await getPaginated<User>('/users', 1, 10);
// Type: PaginatedResponse<User>

const postsPage = await getPaginated<Post>('/posts', 2, 20);
// Type: PaginatedResponse<Post>
```

### Pattern 5: Nested Generics

```typescript
// Generics dentro de generics

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface PaginatedData<T> {
  items: T[];
  page: number;
  total: number;
}

// Nested: ApiResponse wraps PaginatedData wraps User[]
type PaginatedUsersResponse = ApiResponse<PaginatedData<User>>;

const result = await request<PaginatedUsersResponse>('/users');

// Type narrowing:
if (result.success) {
  const users = result.data.items;
  // Type: User[]
  
  const page = result.data.page;
  // Type: number
  
  const total = result.data.total;
  // Type: number
  
  users.forEach(user => {
    console.log(user.name); // ✅ Type-safe
  });
}

// Generic helper:
async function getPaginatedResponse<T>(
  endpoint: string
): Promise<ApiResponse<PaginatedData<T>>> {
  return request<ApiResponse<PaginatedData<T>>>(endpoint);
}

const response = await getPaginatedResponse<User>('/users');
// Type: ApiResponse<PaginatedData<User>>
```

### Pattern 6: ReturnType & Awaited

```typescript
// Extract return types

async function getUser(id: number): Promise<User> {
  return request<User>(`/users/${id}`);
}

// Extract return type (with Promise):
type GetUserReturnType = ReturnType<typeof getUser>;
// Type: Promise<User>

// Unwrap Promise:
type UserType = Awaited<ReturnType<typeof getUser>>;
// Type: User

// Use case: Type inference em complex scenarios
const users: Awaited<ReturnType<typeof getUsers>>[] = [];

async function getUsers(): Promise<User[]> {
  return request<User[]>('/users');
}

// users: User[][]

// Utility type:
type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<T>
>;

type UserFromGetUser = AsyncReturnType<typeof getUser>;
// Type: User

type UsersFromGetUsers = AsyncReturnType<typeof getUsers>;
// Type: User[]
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Generics

**✅ API Clients**: request<T>() wrappers
**✅ Reusable Functions**: Single implementation, multiple types
**✅ Type Safety**: Compile-time validation
**✅ Large Codebases**: Refactoring safety
**✅ Team Collaboration**: Types documentam API contracts

### Quando NÃO Usar

**❌ Prototypes**: Quick scripts (overhead desnecessário)
**❌ Over-Engineering**: Simple cases (direct fetch() OK)
**❌ Dynamic Responses**: Response structure unknown (use unknown)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Runtime Validation**: Types são compile-time only (não validam runtime)
**2. API Changes**: Server muda response → types outdated (manual sync)
**3. Complexity**: Generics podem ser confusing (learning curve)
**4. Build Time**: TypeScript compilation adiciona build step

### Armadilhas Comuns

#### Armadilha 1: Type Assertion Unsafe

```typescript
// ❌ ERRO - Type assertion pode estar wrong
const user = await fetch('/users/1').then(r => r.json()) as User;

// Server retorna: { id: 1, fullName: 'Alice' }
// Type diz: { id: number, name: string }
// user.name → undefined (runtime error!)

// ✅ CORRETO - Use type guards (runtime validation)
```

#### Armadilha 2: Any Propagation

```typescript
// ❌ ERRO - any infecta codebase
async function getUser(id: number) {
  const response = await fetch(`/users/${id}`);
  return response.json(); // Return: any
}

const user = await getUser(1);
// Type: any (perdeu type safety)

// ✅ CORRETO - Sempre type response
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  return response.json();
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Zod/Yup

**Zod/Yup** fazem **runtime validation** (complementam TypeScript).

### Relação com tRPC

**tRPC** infere types do backend (end-to-end type safety).

### Relação com GraphQL Codegen

**GraphQL Codegen** gera types de GraphQL schema.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Type Guards**: Runtime validation (is User?)
2. **Zod Integration**: Schema validation + type inference
3. **API Client**: Complete type-safe implementation

---

## 📚 Conclusão

TypeScript generics fornecem **type safety** para Fetch API.

Dominar generics significa:
- **request<T>()**: Generic wrapper (Promise<T>)
- **Type Parameters**: `<T>` (parametrize types)
- **Type Inference**: TypeScript deduz types
- **Utility Types**: Partial, Pick, Omit (transform types)
- **Discriminated Unions**: Type-safe error handling
- **Generic Constraints**: `T extends` (limit types)

É crítico para **production apps**, **team collaboration**, e **refactoring safety**.
