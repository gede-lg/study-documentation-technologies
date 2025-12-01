# 🎯 Introdução

**Advanced Typing Patterns** em TypeScript Axios aplicam sophisticated type-level programming techniques (**utility types**, **conditional types**, **mapped types**, **template literals**, **branded types**) para criar type-safe, self-documenting API clients com compile-time validation, type inference, exhaustive error checking, e runtime safety guarantees impossíveis de alcançar com JavaScript puro.

Advanced typing patterns resolvem critical problems que basic type annotations não conseguem: **preventing ID mixing** (evitando passar ProductId onde UserId esperado via branded types), **type-safe string manipulation** (construindo URL paths via template literal types), **exhaustive error handling** (ensuring all error cases handled via discriminated unions + never type), **deep type transformations** (converting entire object hierarchies via recursive mapped types), **conditional API behavior** (different return types baseado em request config via conditional types).

Utility types fundamentais incluem: **Partial<T>** (making all properties optional for PATCH requests), **Required<T>** (ensuring all fields present for validation), **Pick<T, K>** (selecting subset de properties para DTOs), **Omit<T, K>** (removing properties como password de responses), **Record<K, V>** (type-safe dictionaries para indexable data), **Readonly<T>** (immutable responses preventing accidental mutations).

Conditional types enable compile-time logic: **`T extends U ? X : Y`** (different types baseado em conditions), **`infer` keyword** (extracting types from generics), **distributive conditional types** (applying conditions over unions), **type-level recursion** (conditional types calling themselves para deep transformations). Exemplo: `type Unpacked<T> = T extends Array<infer U> ? U : T` extracts array element type.

Mapped types transform object structures: **`{ [K in keyof T]: TransformType }`** (iterating over properties), **key remapping via `as` clause** (`[K in keyof T as NewKey<K>]`), **adding/removing modifiers** (`readonly`, `?` optional), **filtering properties** (conditional types em mapped types removendo properties). Exemplo: `type Mutable<T> = { -readonly [K in keyof T]: T[K] }` removes readonly modifier.

Template literal types enable string manipulation at type level: **constructing string types** (`type Route = '/users/${number}'`), **parsing string patterns** (extracting params de URL paths), **branded primitives** (`type UserId = string & { __brand: 'UserId' }`), **type-safe event names** (`type UserEvent = 'user:${UserAction}'`).

Branded types prevent primitive type confusion: sem branding, `UserId` e `ProductId` são ambos `number`, permitindo mixing; com branding, `type UserId = number & { __brand: 'UserId' }` cria nominal types preventing accidental mixing at compile time. Branding pattern: declare brand symbol, intersection type com primitive, smart constructor validating at runtime.

Type guards enable runtime type narrowing: **predicate functions** (`function isUser(x: unknown): x is User`), **discriminated unions** (narrowing via literal type discrimination), **exhaustiveness checking** (never type ensuring all cases handled), **type assertions** (unsafe but necessary em certain scenarios).

Type inference patterns: **ReturnType<typeof fn>** (extracting function return types), **Parameters<typeof fn>** (extracting parameter types tuple), **Awaited<T>** (unwrapping Promise types), **ConstructorParameters<typeof Class>** (extracting constructor params), **InstanceType<typeof Class>** (extracting instance type).

Advanced patterns incluem: **deep partial** (recursive Partial para nested objects), **deep readonly** (recursive Readonly preventing mutations at any depth), **type-safe builder pattern** (fluent API com progressive type refinement), **discriminated error unions** (exhaustive error handling), **recursive type transformations** (CamelCase<T> converting entire object hierarchy).

Critical considerations: **recursive depth limits** (TypeScript limits recursion to prevent infinite loops), **type complexity** (overly complex types slow compilation), **type distribution** (understanding conditional type distribution over unions), **variance** (covariance/contravariance em generics), **type widening** (TypeScript widens literal types to primitives, use `as const` to prevent).

Este módulo explora cutting-edge TypeScript patterns aplicados a Axios: desde utility types simplificando common transformations, através de conditional/mapped types enabling type-level logic, template literals para string manipulation, branded types preventing primitive mixing, até advanced patterns (deep transformations, builder patterns, exhaustive checking). Objetivo é fornecer complete mastery de TypeScript's type system aplicado a real-world HTTP client scenarios.

---

# 📋 Sumário

### **Utility Types**
- Partial<T>
- Required<T>
- Pick<T, K>
- Omit<T, K>
- Record<K, V>
- Readonly<T>

### **Conditional Types**
- T extends U ? X : Y
- infer keyword
- Distributive types
- Type-level recursion

### **Mapped Types**
- Property iteration
- Key remapping
- Modifier manipulation
- Property filtering

### **Template Literal Types**
- String type construction
- Pattern parsing
- Branded primitives
- Event name typing

### **Branded Types**
- Nominal typing
- Smart constructors
- Preventing mixing
- Runtime validation

### **Type Guards**
- Predicate functions
- Discriminated unions
- Exhaustiveness checking
- Type assertions

### **Type Inference**
- ReturnType
- Parameters
- Awaited
- ConstructorParameters

### **Advanced Patterns**
- Deep transformations
- Builder pattern
- Recursive types
- Utility type composition

---

# 🧠 Fundamentos

## Utility Types

### **Partial<T>**

**Make properties optional**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// PATCH request - all fields optional
async function updateUser(id: number, updates: Partial<User>) {
  return axios.patch<User>(`/users/${id}`, updates);
}

// Usage
await updateUser(1, { name: 'John' }); // ✅ Only name
await updateUser(1, { email: 'john@example.com', avatar: '/avatar.jpg' }); // ✅ Multiple fields
```

**Custom partial**:

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Profile {
  user: {
    name: string;
    email: string;
  };
  settings: {
    theme: string;
    notifications: boolean;
  };
}

// All nested properties optional
const update: DeepPartial<Profile> = {
  user: { name: 'John' } // email optional
};
```

### **Required<T>**

**Make properties required**:

```typescript
interface UserDraft {
  id?: number;
  name?: string;
  email?: string;
}

// POST request - all fields required
async function createUser(user: Required<UserDraft>) {
  return axios.post<User>('/users', user);
}

// Usage
await createUser({
  id: 1,
  name: 'John',
  email: 'john@example.com'
}); // ✅ All fields present

// await createUser({ name: 'John' }); // ❌ Missing id, email
```

### **Pick<T, K>**

**Select properties**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: Date;
}

// Public profile - only safe fields
type PublicProfile = Pick<User, 'id' | 'name' | 'avatar'>;

async function getPublicProfile(id: number) {
  return axios.get<PublicProfile>(`/users/${id}/public`);
}

const profile = await getPublicProfile(1);
console.log(profile.data.name); // ✅
// console.log(profile.data.password); // ❌ Not in PublicProfile
```

### **Omit<T, K>**

**Remove properties**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// User without password
type SafeUser = Omit<User, 'password'>;

async function getUser(id: number) {
  return axios.get<SafeUser>(`/users/${id}`);
}

// Create user request - no id (auto-generated)
type CreateUserRequest = Omit<User, 'id'>;

async function createUser(data: CreateUserRequest) {
  return axios.post<User>('/users', data);
}
```

### **Record<K, V>**

**Type-safe dictionaries**:

```typescript
type UserId = number;

// User lookup by ID
async function getUsersById(ids: UserId[]) {
  const response = await axios.get<User[]>('/users', {
    params: { ids: ids.join(',') }
  });
  
  // Convert to dictionary
  const userMap: Record<UserId, User> = {};
  response.data.forEach(user => {
    userMap[user.id] = user;
  });
  
  return userMap;
}

// Usage
const users = await getUsersById([1, 2, 3]);
const user1 = users[1]; // User
const user2 = users[2]; // User
```

**String key record**:

```typescript
type ErrorCode = 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION_ERROR';

const errorMessages: Record<ErrorCode, string> = {
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Not authorized',
  VALIDATION_ERROR: 'Validation failed'
};

axios.interceptors.response.use(
  response => response,
  (error: AxiosError<{ code: ErrorCode }>) => {
    const code = error.response?.data.code;
    if (code) {
      console.error(errorMessages[code]);
    }
    return Promise.reject(error);
  }
);
```

### **Readonly<T>**

**Immutable responses**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number) {
  return axios.get<Readonly<User>>(`/users/${id}`);
}

const response = await getUser(1);
// response.data.name = 'Changed'; // ❌ Cannot assign to readonly property
```

**Deep readonly**:

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

interface Profile {
  user: {
    name: string;
    email: string;
  };
  settings: {
    theme: string;
  };
}

async function getProfile(id: number) {
  return axios.get<DeepReadonly<Profile>>(`/profiles/${id}`);
}

const profile = await getProfile(1);
// profile.data.user.name = 'Changed'; // ❌ Readonly at all depths
```

## Conditional Types

### **T extends U ? X : Y**

**Different response types**:

```typescript
type ApiResponse<T, IncludeMeta extends boolean> = IncludeMeta extends true
  ? { data: T; meta: { page: number; total: number } }
  : T;

async function getUsers<IncludeMeta extends boolean = false>(
  includeMeta?: IncludeMeta
): Promise<AxiosResponse<ApiResponse<User[], IncludeMeta>>> {
  return axios.get('/users', {
    params: { includeMeta }
  });
}

// Without meta
const response1 = await getUsers();
response1.data; // User[]

// With meta
const response2 = await getUsers(true);
response2.data.data; // User[]
response2.data.meta; // { page: number; total: number }
```

### **infer Keyword**

**Extract array element type**:

```typescript
type Unpacked<T> = T extends Array<infer U> ? U : T;

type UserArray = User[];
type UnpackedUser = Unpacked<UserArray>; // User

type StringType = string;
type UnpackedString = Unpacked<StringType>; // string (not array)
```

**Extract promise type**:

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

async function getUser() {
  return axios.get<User>('/users/1');
}

type UserResponse = UnwrapPromise<ReturnType<typeof getUser>>;
// AxiosResponse<User>
```

**Extract function return type**:

```typescript
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function fetchUser() {
  return axios.get<User>('/users/1');
}

type FetchUserReturn = GetReturnType<typeof fetchUser>;
// Promise<AxiosResponse<User>>
```

### **Distributive Types**

**Apply over unions**:

```typescript
type ToArray<T> = T extends any ? T[] : never;

type NumberOrString = number | string;
type ArrayType = ToArray<NumberOrString>;
// number[] | string[] (distributive)

// Non-distributive (wrap in tuple)
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never;
type ArrayType2 = ToArrayNonDist<NumberOrString>;
// (number | string)[] (non-distributive)
```

### **Type-level Recursion**

**Recursive unwrapping**:

```typescript
type DeepUnwrap<T> = T extends Array<infer U>
  ? DeepUnwrap<U>
  : T extends Promise<infer U>
  ? DeepUnwrap<U>
  : T;

type Nested = Promise<Array<Promise<User>>>;
type Unwrapped = DeepUnwrap<Nested>; // User
```

## Mapped Types

### **Property Iteration**

**Transform all properties**:

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  id: number;
  name: string;
}

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null }
```

### **Key Remapping**

**Rename properties**:

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
  name: string;
  email: string;
}

type UserGetters = Getters<User>;
// { getName: () => string; getEmail: () => string }
```

**Filter properties**:

```typescript
type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K];
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type StringProps = PickByType<User, string>;
// { name: string; email: string }

type NumberProps = PickByType<User, number>;
// { id: number; age: number }
```

### **Modifier Manipulation**

**Remove readonly**:

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
}

type MutableUser = Mutable<ReadonlyUser>;
// { id: number; name: string }
```

**Remove optional**:

```typescript
type Concrete<T> = {
  [K in keyof T]-?: T[K];
};

interface PartialUser {
  id?: number;
  name?: string;
}

type ConcreteUser = Concrete<PartialUser>;
// { id: number; name: string }
```

### **Property Filtering**

**Remove null/undefined**:

```typescript
type NonNullableProps<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

interface User {
  id: number;
  name: string | null;
  email: string | undefined;
}

type SafeUser = NonNullableProps<User>;
// { id: number; name: string; email: string }
```

## Template Literal Types

### **String Type Construction**

**Route typing**:

```typescript
type UserId = number;
type UserRoute = `/users/${UserId}`;

const route1: UserRoute = '/users/1'; // ✅
const route2: UserRoute = '/users/42'; // ✅
// const route3: UserRoute = '/users/abc'; // ❌
```

**HTTP method + path**:

```typescript
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Resource = 'users' | 'posts' | 'comments';

type Endpoint = `${Method} /${Resource}`;

const endpoint1: Endpoint = 'GET /users'; // ✅
const endpoint2: Endpoint = 'POST /comments'; // ✅
// const endpoint3: Endpoint = 'PATCH /users'; // ❌
```

### **Pattern Parsing**

**Extract path params**:

```typescript
type ExtractParams<Path extends string> = 
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : Path extends `${infer _Start}:${infer Param}`
    ? Param
    : never;

type Route = '/users/:userId/posts/:postId';
type Params = ExtractParams<Route>; // 'userId' | 'postId'
```

### **Branded Primitives**

**Type-safe IDs**:

```typescript
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<number, 'UserId'>;
type ProductId = Brand<number, 'ProductId'>;

// Smart constructors
const UserId = (id: number): UserId => id as UserId;
const ProductId = (id: number): ProductId => id as ProductId;

const userId = UserId(1);
const productId = ProductId(1);

function getUser(id: UserId) {
  return axios.get<User>(`/users/${id}`);
}

getUser(userId); // ✅
// getUser(productId); // ❌ Type error - can't mix IDs
```

### **Event Name Typing**

**Type-safe events**:

```typescript
type UserAction = 'created' | 'updated' | 'deleted';
type UserEvent = `user:${UserAction}`;

const events: Record<UserEvent, (data: User) => void> = {
  'user:created': (user) => console.log('Created:', user.name),
  'user:updated': (user) => console.log('Updated:', user.name),
  'user:deleted': (user) => console.log('Deleted:', user.name)
};

// Type-safe event emission
function emit(event: UserEvent, data: User) {
  events[event](data);
}

emit('user:created', user); // ✅
// emit('user:archived', user); // ❌ Not a valid event
```

## Branded Types

### **Nominal Typing**

**Prevent primitive mixing**:

```typescript
declare const UserIdBrand: unique symbol;
declare const ProductIdBrand: unique symbol;

type UserId = number & { [UserIdBrand]: true };
type ProductId = number & { [ProductIdBrand]: true };

function getUser(id: UserId): Promise<AxiosResponse<User>> {
  return axios.get(`/users/${id}`);
}

function getProduct(id: ProductId): Promise<AxiosResponse<Product>> {
  return axios.get(`/products/${id}`);
}

// Must use constructors
const userId = 1 as UserId;
const productId = 1 as ProductId;

getUser(userId); // ✅
// getUser(productId); // ❌ Type error
```

### **Smart Constructors**

**Runtime validation**:

```typescript
type Email = string & { __brand: 'Email' };

function Email(value: string): Email {
  if (!value.includes('@')) {
    throw new Error('Invalid email');
  }
  return value as Email;
}

interface CreateUserRequest {
  name: string;
  email: Email;
}

async function createUser(data: CreateUserRequest) {
  return axios.post<User>('/users', data);
}

// Usage
await createUser({
  name: 'John',
  email: Email('john@example.com') // ✅ Validated
});

// await createUser({
//   name: 'John',
//   email: 'invalid' // ❌ Runtime error
// });
```

### **Preventing Mixing**

**Different ID types**:

```typescript
type Brand<T, Brand> = T & { __brand: Brand };

type UserId = Brand<number, 'User'>;
type PostId = Brand<number, 'Post'>;
type CommentId = Brand<number, 'Comment'>;

const UserId = (n: number) => n as UserId;
const PostId = (n: number) => n as PostId;
const CommentId = (n: number) => n as CommentId;

function getUserPosts(userId: UserId) {
  return axios.get<Post[]>(`/users/${userId}/posts`);
}

function getPost(postId: PostId) {
  return axios.get<Post>(`/posts/${postId}`);
}

const userId = UserId(1);
const postId = PostId(1);

getUserPosts(userId); // ✅
// getUserPosts(postId); // ❌ Can't pass PostId as UserId
```

### **Runtime Validation**

**Validated types**:

```typescript
type PositiveNumber = number & { __brand: 'Positive' };

function PositiveNumber(n: number): PositiveNumber {
  if (n <= 0) {
    throw new Error('Must be positive');
  }
  return n as PositiveNumber;
}

interface PaginationParams {
  page: PositiveNumber;
  limit: PositiveNumber;
}

async function getUsers(params: PaginationParams) {
  return axios.get<User[]>('/users', { params });
}

// Usage
await getUsers({
  page: PositiveNumber(1),
  limit: PositiveNumber(10)
}); // ✅

// await getUsers({
//   page: PositiveNumber(0), // ❌ Runtime error
//   limit: PositiveNumber(10)
// });
```

## Type Guards

### **Predicate Functions**

**Custom type guard**:

```typescript
interface User {
  type: 'user';
  name: string;
  email: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

type Account = User | Admin;

function isAdmin(account: Account): account is Admin {
  return account.type === 'admin';
}

async function getAccount(id: number) {
  const response = await axios.get<Account>(`/accounts/${id}`);
  
  if (isAdmin(response.data)) {
    console.log(response.data.permissions); // ✅ Type narrowed to Admin
  } else {
    console.log(response.data.email); // ✅ Type narrowed to User
  }
}
```

### **Discriminated Unions**

**Literal type discrimination**:

```typescript
interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

interface ErrorResponse {
  status: 'error';
  error: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

async function fetchUser(id: number) {
  const response = await axios.get<ApiResponse<User>>(`/users/${id}`);
  
  if (response.data.status === 'success') {
    console.log(response.data.data.name); // ✅ Narrowed to SuccessResponse
  } else {
    console.error(response.data.error); // ✅ Narrowed to ErrorResponse
  }
}
```

### **Exhaustiveness Checking**

**Never type for exhaustive checking**:

```typescript
type Status = 'pending' | 'approved' | 'rejected';

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting for approval';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      const exhaustive: never = status; // ❌ Error if any case missing
      throw new Error(`Unhandled status: ${exhaustive}`);
  }
}
```

### **Type Assertions**

**Unsafe but necessary**:

```typescript
interface LegacyResponse {
  user_id: number;
  user_name: string;
}

interface ModernResponse {
  userId: number;
  userName: string;
}

async function getUser(id: number, useLegacy: boolean) {
  const response = await axios.get<LegacyResponse | ModernResponse>(
    `/users/${id}`,
    { params: { legacy: useLegacy } }
  );
  
  if (useLegacy) {
    const legacy = response.data as LegacyResponse;
    console.log(legacy.user_name);
  } else {
    const modern = response.data as ModernResponse;
    console.log(modern.userName);
  }
}
```

## Type Inference

### **ReturnType**

**Extract return type**:

```typescript
async function fetchUser(id: number) {
  return axios.get<User>(`/users/${id}`);
}

type FetchUserReturn = ReturnType<typeof fetchUser>;
// Promise<AxiosResponse<User>>

type UserResponse = Awaited<FetchUserReturn>;
// AxiosResponse<User>

type UserData = Awaited<FetchUserReturn>['data'];
// User
```

### **Parameters**

**Extract parameter types**:

```typescript
async function createUser(name: string, email: string) {
  return axios.post<User>('/users', { name, email });
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string]

type FirstParam = Parameters<typeof createUser>[0];
// string
```

### **Awaited**

**Unwrap promises**:

```typescript
type UserPromise = Promise<AxiosResponse<User>>;
type UnwrappedUser = Awaited<UserPromise>;
// AxiosResponse<User>

type NestedPromise = Promise<Promise<AxiosResponse<User>>>;
type UnwrappedNested = Awaited<NestedPromise>;
// AxiosResponse<User> (deeply unwrapped)
```

### **ConstructorParameters**

**Extract constructor params**:

```typescript
class ApiClient {
  constructor(
    private baseURL: string,
    private apiKey: string
  ) {}
}

type ApiClientParams = ConstructorParameters<typeof ApiClient>;
// [baseURL: string, apiKey: string]
```

## Advanced Patterns

### **Deep Transformations**

**Deep partial**:

```typescript
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

interface Config {
  api: {
    baseURL: string;
    timeout: number;
    retry: {
      attempts: number;
      delay: number;
    };
  };
}

const update: DeepPartial<Config> = {
  api: {
    retry: { attempts: 5 } // delay optional
  }
};
```

**Deep readonly**:

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

const config: DeepReadonly<Config> = {
  api: {
    baseURL: 'https://api.example.com',
    timeout: 5000,
    retry: { attempts: 3, delay: 1000 }
  }
};

// config.api.retry.attempts = 5; // ❌ Readonly at all depths
```

### **Builder Pattern**

**Type-safe builder**:

```typescript
class RequestBuilder<T = unknown> {
  private config: InternalAxiosRequestConfig = {};
  
  url<U = T>(url: string): RequestBuilder<U> {
    this.config.url = url;
    return this as any;
  }
  
  method(method: Method): this {
    this.config.method = method;
    return this;
  }
  
  data<D>(data: D): RequestBuilder<T> {
    this.config.data = data;
    return this;
  }
  
  async send(): Promise<AxiosResponse<T>> {
    return axios.request<T>(this.config);
  }
}

// Usage
const response = await new RequestBuilder()
  .url<User>('/users/1')
  .method('GET')
  .send();

response.data.name; // ✅ Type is User
```

### **Recursive Types**

**CamelCase conversion**:

```typescript
type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${Capitalize<CamelCase<Rest>>}`
  : S;

type Result1 = CamelCase<'user_name'>; // 'userName'
type Result2 = CamelCase<'created_at'>; // 'createdAt'

type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};

interface UserSnake {
  user_id: number;
  user_name: string;
  email_address: string;
}

type UserCamel = CamelCaseKeys<UserSnake>;
// { userId: number; userName: string; emailAddress: string }
```

### **Utility Type Composition**

**Combine utilities**:

```typescript
type OptionalExcept<T, K extends keyof T> = 
  Partial<T> & Pick<T, K>;

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

// All optional except id
type UserUpdate = OptionalExcept<User, 'id'>;
// { id: number; name?: string; email?: string; avatar?: string }

async function updateUser(data: UserUpdate) {
  return axios.patch<User>(`/users/${data.id}`, data);
}
```

---

# 🎯 Aplicabilidade

## Quando Usar Advanced Types

**Type Safety**: Preventing bugs via compile-time checking (branded IDs, exhaustive switching).

**Documentation**: Self-documenting code via expressive types (template literals para routes).

**Refactoring**: Safe refactoring via comprehensive type coverage.

## Trade-offs

**Complexity**: Advanced types require TypeScript expertise.

**Compilation**: Complex types slow compilation.

**Learning Curve**: Team members need training.

---

# ⚠️ Limitações

## Type System Limits

**Recursion Depth**: TypeScript limits recursive types to prevent infinite loops (~50 levels).

**Compilation Speed**: Overly complex types slow down IDE/compiler.

**Runtime**: Types erased at runtime - no runtime type checking without validation.

---

# 🔗 Interconexões

## Zod/Yup Integration

Runtime validation libraries complement compile-time types.

## GraphQL

Code generation tools (graphql-codegen) leverage advanced types.

## Domain Modeling

Branded types enable domain-driven design patterns.

---

# 🚀 Evolução

## TypeScript 5.x Features

**const type parameters**: `<const T>` for literal type preservation.

**Decorators**: Stage 3 decorators com type checking.

## Effect Systems

Track effects (IO, errors) at type level.

## Dependent Types

More sophisticated type-level programming.

---

**Conclusão Integrada**: Advanced typing patterns em TypeScript Axios aplicam sophisticated type-level programming enabling compile-time safety, self-documentation, e prevention de entire categories de bugs. **Utility types** simplify common transformations: **Partial<User>** para PATCH requests making all properties optional, **Required<UserDraft>** para POST ensuring all fields present, **Pick<User, 'id' | 'name'>** selecting safe subset para public profiles, **Omit<User, 'password'>** removing sensitive fields de responses, **Record<UserId, User>** creating type-safe dictionaries, **Readonly<User>** preventing accidental mutations. **Conditional types** enable type-level logic: **`T extends U ? X : Y`** providing different return types baseado em conditions (ApiResponse com/sem metadata), **`infer`** keyword extracting types (Unpacked<T[]> extracting array element type, UnwrapPromise<Promise<T>> extracting promise type), **distributive types** applying conditions over unions (ToArray<number | string> producing number[] | string[]), **recursive conditional types** enabling deep unwrapping (DeepUnwrap recursively extracting T de Promise<Array<Promise<T>>>). **Mapped types** transform object structures: **property iteration** via `{ [K in keyof T]: TransformType }`, **key remapping** via `as` clause (`[K in keyof T as \`get${K}\`]` creating getters), **modifier manipulation** removing readonly/optional (`-readonly`, `-?`), **property filtering** via conditional types (PickByType<User, string> selecting only string properties). **Template literal types** enable string manipulation: **route typing** (`type Route = '/users/${UserId}'`), **pattern parsing** (ExtractParams<'/users/:userId/posts/:postId'> extracting 'userId' | 'postId'), **branded primitives** preventing primitive mixing. **Branded types** provide nominal typing: **`type UserId = number & { __brand: 'UserId' }`** prevents mixing UserId/ProductId despite both being number, **smart constructors** enabling runtime validation (`Email(value)` validating format), **compile-time safety** ensuring type correctness. **Type guards** enable runtime narrowing: **predicate functions** (`function isAdmin(x): x is Admin`) narrowing types, **discriminated unions** narrowing via literal types (status: 'success' | 'error'), **exhaustiveness checking** via never type ensuring all cases handled, **type assertions** (`as Type`) quando type guard insufficient. **Type inference** extracting types: **ReturnType<typeof fn>** extracting function returns, **Parameters<typeof fn>** extracting parameters tuple, **Awaited<Promise<T>>** unwrapping promises (including nested), **ConstructorParameters<typeof Class>** extracting constructor params. **Advanced patterns**: **deep transformations** via recursive mapped types (DeepPartial<T>, DeepReadonly<T> applying transformations at all depths), **builder pattern** com progressive type refinement (url<User>() typing response as User), **recursive type transformations** (CamelCase<S> converting snake_case strings, CamelCaseKeys<T> converting entire objects), **utility composition** (OptionalExcept<User, 'id'> combining Partial + Pick). Critical considerations: **recursion depth limits** (~50 levels preventing infinite loops), **type complexity** affecting compilation speed, **type erasure** (types removed at runtime, combine com runtime validation via Zod/Yup), **variance** understanding (covariance/contravariance em generic positions). Best practices: leverage utility types para common patterns, use conditional types para type-level logic, apply mapped types para transformations, use branded types preventing primitive mixing, implement type guards enabling safe narrowing, extract types via inference utilities, compose utilities para complex requirements, balance type safety com team expertise/compilation performance.