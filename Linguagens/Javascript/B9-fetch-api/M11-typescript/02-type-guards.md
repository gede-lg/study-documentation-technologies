# Type Guards e Assertions: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Type guards** são **runtime checks** que **narrow types** (refinar unknown/any para type específico), permitindo **TypeScript compiler** deduzir **narrowed type** em **control flow** (if/switch), usando **typeof** (primitives), **instanceof** (classes), **in operator** (properties), **custom predicates** (`is` keyword), garantindo **type safety** entre **compile-time types** (TypeScript) e **runtime values** (JavaScript). **Type assertions** (`as Type`, `<Type>`) são **compile-time only overrides** que **force TypeScript** aceitar value como type específico, **sem runtime validation** (unsafe se incorrect), usado em edge cases onde **developer knows better** que compiler.

Conceitualmente, **TypeScript types** existem **apenas em compile-time** → **erased em JavaScript** → **runtime não sabe types**. **fetch().json()** retorna **any/unknown** → TypeScript **não pode garantir** que response é User → **type guard** faz **runtime check** (`'name' in data`, `typeof data.id === 'number'`) → **if check passa**, TypeScript **narrow type** de unknown para User dentro do if block → **IntelliSense** funciona, **property access** validado. **Type assertion** (`as User`) **bypassa checks** → diz "confie em mim, isso é User" → **compiler aceita** sem validação → **perigoso** se assertion wrong (runtime error).

```typescript
// Type Guard (runtime validation):
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as any).id === 'number' &&
    'name' in data &&
    typeof (data as any).name === 'string'
  );
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data: unknown = await response.json();
  
  // Runtime validation
  if (!isUser(data)) {
    throw new Error('Invalid user data from API');
  }
  
  // Type narrowed to User
  return data; // ✅ Type-safe (validated)
}

// Type Assertion (compile-time only, NO validation):
async function getUserUnsafe(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data = await response.json();
  
  return data as User; // ❌ Unsafe (no runtime check)
  // Se API retorna { id: 1, fullName: 'Alice' }
  // Type diz: { id: number, name: string }
  // user.name → undefined (runtime error!)
}

// Diferença:
// - Type Guard: Runtime check + type narrowing (SAFE)
// - Type Assertion: Compile-time override (UNSAFE, no validation)
```

### Contexto Histórico e Motivação

**Evolução de Type Guards:**

1. **TypeScript 1.0 (2014)**: typeof, instanceof básicos
2. **TypeScript 1.6 (2015)**: User-defined type guards (`is` keyword)
3. **TypeScript 2.0 (2016)**: Discriminated unions (tagged unions)
4. **TypeScript 3.7 (2019)**: Assertion functions (`asserts` keyword)
5. **Modern (2020+)**: Zod, io-ts (runtime validation libraries)

**Motivação para Type Guards:**

**Fetch responses** são **external data** (untrusted) → **server pode mudar** response structure → **API documentation** pode estar **outdated** → **types podem divergir** de reality. **Type assertion** assume response é correct → **no safety net** → runtime errors em production. **Type guards** fazem **defensive programming** → validate structure **before using** → throw error **early** (vs crash later) → **fail-fast** principle.

**Problemas sem Type Guards:**

**1. Runtime Errors**: Property access em undefined (user.name quando name não existe)
**2. Silent Failures**: Wrong data type (id é string quando esperado number)
**3. API Changes**: Server muda response → types outdated → crashes
**4. Type Assertions**: Developer assume incorrectly → unsafe

### Problema Fundamental que Resolve

Type guards resolvem:

**1. Runtime Validation**: Verify data structure matches type
**2. Type Narrowing**: unknown → specific type (compile-time)
**3. Early Errors**: Fail-fast (throw error on invalid data)
**4. API Contracts**: Validate server responses (defensive)
**5. Type Safety**: Bridge compile-time types ↔ runtime values
**6. Confidence**: Production apps (handle unexpected data)

### Importância no Ecossistema

Type guards são **critical** para:

- **API Responses**: Validate external data (untrusted)
- **User Input**: Form data, query params (validate structure)
- **Third-Party Libraries**: Data de libraries sem types
- **Migration**: Legacy code (gradual type adoption)
- **Production Safety**: Handle unexpected data gracefully

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Type Narrowing**: Refinar unknown/any para type específico
2. **typeof**: Primitive type checks (string, number, boolean)
3. **instanceof**: Class instance checks
4. **in operator**: Property existence checks
5. **Custom Predicates**: `is` keyword (user-defined guards)
6. **Assertion Functions**: `asserts` keyword (throw if invalid)

### Pilares Fundamentais

- **data is Type**: Return type de type guard
- **typeof x === 'string'**: Primitive check
- **x instanceof Class**: Instance check
- **'prop' in obj**: Property check
- **asserts condition**: Assertion function
- **as Type**: Type assertion (unsafe)

### Visão Geral das Nuances

- **Type Narrowing**: if (guard(x)) → x narrowed em if block
- **Control Flow**: TypeScript tracks narrowing em branches
- **Discriminated Unions**: Common property para differentiate
- **Unknown vs Any**: unknown requires narrowing, any bypasses
- **Type Assertions**: Compile-time only (no runtime effect)
- **Defensive Programming**: Validate ALL external data

---

## 🧠 Fundamentos Teóricos

### typeof (Primitive Types)

```typescript
// typeof para primitives (string, number, boolean, etc)

function processValue(value: unknown) {
  // Type: unknown (can be anything)
  
  if (typeof value === 'string') {
    // Type narrowed to: string
    console.log(value.toUpperCase()); // ✅ OK
    console.log(value.length); // ✅ OK
  }
  
  if (typeof value === 'number') {
    // Type narrowed to: number
    console.log(value.toFixed(2)); // ✅ OK
    console.log(value + 10); // ✅ OK
  }
  
  if (typeof value === 'boolean') {
    // Type narrowed to: boolean
    console.log(value ? 'yes' : 'no'); // ✅ OK
  }
  
  // Outside if: Type: unknown
  // console.log(value.toUpperCase()); // ❌ Error
}

// typeof values:
// - 'string', 'number', 'boolean', 'symbol'
// - 'undefined', 'object', 'function', 'bigint'

// Cuidado com typeof:
typeof null === 'object' // ⚠️ true (JavaScript quirk)
typeof [] === 'object' // true
typeof {} === 'object' // true

// Null check:
if (typeof value === 'object' && value !== null) {
  // Type: object (non-null)
}
```

### instanceof (Class Instances)

```typescript
// instanceof para classes

class User {
  constructor(
    public id: number,
    public name: string
  ) {}
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

class Post {
  constructor(
    public id: number,
    public title: string
  ) {}
}

function processEntity(entity: unknown) {
  if (entity instanceof User) {
    // Type narrowed to: User
    console.log(entity.name); // ✅ OK
    console.log(entity.greet()); // ✅ OK
  }
  
  if (entity instanceof Post) {
    // Type narrowed to: Post
    console.log(entity.title); // ✅ OK
  }
  
  // instanceof NÃO funciona com interfaces:
  interface IPerson {
    name: string;
  }
  
  // ❌ Error: 'IPerson' only refers to a type, but is being used as a value
  // if (entity instanceof IPerson) { }
  
  // Interfaces são compile-time only (erased em runtime)
}

// instanceof checks prototype chain:
const user = new User(1, 'Alice');

user instanceof User // true
user instanceof Object // true (User extends Object)
```

### in Operator (Property Checks)

```typescript
// 'in' operator para check property existence

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
}

function processData(data: User | Post) {
  // Type: User | Post (union)
  
  if ('name' in data) {
    // Type narrowed to: User
    console.log(data.name); // ✅ OK
    console.log(data.email); // ✅ OK
    // console.log(data.title); // ❌ Error
  }
  
  if ('title' in data) {
    // Type narrowed to: Post
    console.log(data.title); // ✅ OK
    console.log(data.body); // ✅ OK
    // console.log(data.name); // ❌ Error
  }
}

// 'in' com unknown:
function validateUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'email' in data
  );
}

// Uso:
const response = await fetch('/users/1').then(r => r.json());

if (validateUser(response)) {
  // Type: User
  console.log(response.name); // ✅ Type-safe
}
```

### Custom Type Guard (is keyword)

```typescript
// User-defined type guard com 'is' keyword

interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(data: unknown): data is User {
  // Return type: 'data is User' (type predicate)
  
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as any).id === 'number' &&
    'name' in data &&
    typeof (data as any).name === 'string' &&
    'email' in data &&
    typeof (data as any).email === 'string'
  );
}

// Usage:
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data: unknown = await response.json();
  
  // Runtime validation
  if (!isUser(data)) {
    throw new Error('Invalid user data from API');
  }
  
  // Type narrowed to User
  return data; // ✅ Type-safe
}

// Type predicate permite narrowing:
const data: unknown = { id: 1, name: 'Alice', email: 'alice@example.com' };

// Before guard:
console.log(data.name); // ❌ Error: Object is of type 'unknown'

// After guard:
if (isUser(data)) {
  console.log(data.name); // ✅ OK (narrowed to User)
}
```

### Discriminated Unions

```typescript
// Type narrowing com discriminated unions (tagged unions)

interface SuccessResponse {
  status: 'success';
  data: {
    id: number;
    name: string;
  };
}

interface ErrorResponse {
  status: 'error';
  error: string;
  code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  // Discriminant property: 'status'
  
  if (response.status === 'success') {
    // Type narrowed to: SuccessResponse
    console.log(response.data.name); // ✅ OK
    // console.log(response.error); // ❌ Error
  }
  
  if (response.status === 'error') {
    // Type narrowed to: ErrorResponse
    console.log(response.error); // ✅ OK
    console.log(response.code); // ✅ OK
    // console.log(response.data); // ❌ Error
  }
}

// Switch statement:
function handleResponseSwitch(response: ApiResponse) {
  switch (response.status) {
    case 'success':
      // Type: SuccessResponse
      console.log(response.data);
      break;
    case 'error':
      // Type: ErrorResponse
      console.log(response.error);
      break;
    default:
      // Exhaustiveness check
      const _exhaustive: never = response;
      throw new Error(`Unhandled case: ${_exhaustive}`);
  }
}
```

### Assertion Functions (asserts keyword)

```typescript
// Assertion function com 'asserts' keyword

interface User {
  id: number;
  name: string;
  email: string;
}

function assertIsUser(data: unknown): asserts data is User {
  // Return type: 'asserts data is User'
  // Throws if data is NOT User
  
  if (
    typeof data !== 'object' ||
    data === null ||
    !('id' in data) ||
    typeof (data as any).id !== 'number' ||
    !('name' in data) ||
    typeof (data as any).name !== 'string' ||
    !('email' in data) ||
    typeof (data as any).email !== 'string'
  ) {
    throw new Error('Invalid user data');
  }
  
  // Se não throw, TypeScript assume data is User
}

// Usage:
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data: unknown = await response.json();
  
  // Assertion function
  assertIsUser(data); // Throws if invalid
  
  // APÓS assertIsUser, data is User (no if needed)
  return data; // ✅ Type-safe
}

// Diferença vs type guard:
// - Type guard: RETORNA boolean (requires if)
// - Assertion function: THROWS error (no if needed)

// Type guard:
if (!isUser(data)) {
  throw new Error('Invalid');
}
// data is User aqui

// Assertion function:
assertIsUser(data); // Throws if invalid
// data is User aqui (sem if)
```

### Type Assertions (as keyword)

```typescript
// Type assertion (compile-time override, NO validation)

interface User {
  id: number;
  name: string;
}

// ❌ UNSAFE - Type assertion sem validation
async function getUserUnsafe(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data = await response.json();
  
  return data as User; // Assume it's User (no check)
}

// Se API retorna: { id: 1, fullName: 'Alice' }
const user = await getUserUnsafe(1);
console.log(user.name); // undefined (runtime error!)

// ✅ SAFE - Type guard + validation
async function getUserSafe(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data: unknown = await response.json();
  
  if (!isUser(data)) {
    throw new Error('Invalid user data');
  }
  
  return data; // Validated
}

// Quando usar type assertion:
// 1. DOM APIs (você sabe element type):
const input = document.getElementById('email') as HTMLInputElement;

// 2. Third-party library (você sabe type melhor que compiler):
const config = JSON.parse(localStorage.getItem('config')!) as AppConfig;

// 3. Type narrowing manual (edge cases):
const value = getSomeValue();
if (typeof value === 'string') {
  processString(value as string); // Redundant mas às vezes necessário
}

// ⚠️ Evite type assertions em API responses (use type guards)
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Validação com Zod

```typescript
// Zod: Runtime validation + type inference

import { z } from 'zod';

// Schema (runtime + compile-time)
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional()
});

// Type inference de schema
type User = z.infer<typeof UserSchema>;
// Type: { id: number; name: string; email: string; age?: number }

// Validation:
async function getUser(id: number): Promise<User> {
  const response = await fetch(`/users/${id}`);
  const data: unknown = await response.json();
  
  // Parse + validate
  const user = UserSchema.parse(data); // Throws if invalid
  
  return user; // Type: User (validated)
}

// Safe parse (não throw):
async function getUserSafe(id: number): Promise<User | null> {
  const response = await fetch(`/users/${id}`);
  const data: unknown = await response.json();
  
  const result = UserSchema.safeParse(data);
  
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    return null;
  }
  
  return result.data; // Type: User
}

// Benefícios Zod:
// - Runtime validation (safe)
// - Type inference (DRY - no duplicate types)
// - Detailed error messages
// - Composable schemas (nested objects, arrays, unions)
```

### Pattern 2: Array Validation

```typescript
// Validar array responses

interface User {
  id: number;
  name: string;
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as any).id === 'number' &&
    'name' in data &&
    typeof (data as any).name === 'string'
  );
}

function isUserArray(data: unknown): data is User[] {
  return Array.isArray(data) && data.every(isUser);
}

// Usage:
async function getUsers(): Promise<User[]> {
  const response = await fetch('/users');
  const data: unknown = await response.json();
  
  if (!isUserArray(data)) {
    throw new Error('Invalid users array from API');
  }
  
  return data; // Type: User[]
}

// Zod version:
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string()
});

const UsersSchema = z.array(UserSchema);

async function getUsersZod(): Promise<User[]> {
  const response = await fetch('/users');
  const data = await response.json();
  
  return UsersSchema.parse(data); // Validates entire array
}
```

### Pattern 3: Nested Objects

```typescript
// Validar nested objects

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

interface User {
  id: number;
  name: string;
  address: Address;
}

function isAddress(data: unknown): data is Address {
  return (
    typeof data === 'object' &&
    data !== null &&
    'street' in data &&
    typeof (data as any).street === 'string' &&
    'city' in data &&
    typeof (data as any).city === 'string' &&
    'zipCode' in data &&
    typeof (data as any).zipCode === 'string'
  );
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as any).id === 'number' &&
    'name' in data &&
    typeof (data as any).name === 'string' &&
    'address' in data &&
    isAddress((data as any).address) // Nested validation
  );
}

// Zod version (cleaner):
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string()
});

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: AddressSchema // Nested schema
});

type User = z.infer<typeof UserSchema>;
```

### Pattern 4: Union Types

```typescript
// Validar union types

interface Dog {
  type: 'dog';
  breed: string;
}

interface Cat {
  type: 'cat';
  color: string;
}

type Pet = Dog | Cat;

function isDog(data: unknown): data is Dog {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as any).type === 'dog' &&
    'breed' in data &&
    typeof (data as any).breed === 'string'
  );
}

function isCat(data: unknown): data is Cat {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as any).type === 'cat' &&
    'color' in data &&
    typeof (data as any).color === 'string'
  );
}

function isPet(data: unknown): data is Pet {
  return isDog(data) || isCat(data);
}

// Usage:
async function getPet(id: number): Promise<Pet> {
  const response = await fetch(`/pets/${id}`);
  const data: unknown = await response.json();
  
  if (!isPet(data)) {
    throw new Error('Invalid pet data');
  }
  
  // Discriminated union narrowing:
  if (data.type === 'dog') {
    console.log(data.breed); // ✅ Type: Dog
  } else {
    console.log(data.color); // ✅ Type: Cat
  }
  
  return data;
}

// Zod version:
const DogSchema = z.object({
  type: z.literal('dog'),
  breed: z.string()
});

const CatSchema = z.object({
  type: z.literal('cat'),
  color: z.string()
});

const PetSchema = z.union([DogSchema, CatSchema]);

type Pet = z.infer<typeof PetSchema>;
```

### Pattern 5: Optional Properties

```typescript
// Validar optional properties

interface User {
  id: number;
  name: string;
  email?: string; // Optional
  age?: number; // Optional
}

function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as any).id === 'number' &&
    'name' in data &&
    typeof (data as any).name === 'string' &&
    // Optional: Se existe, deve ser string
    (!('email' in data) || typeof (data as any).email === 'string') &&
    (!('age' in data) || typeof (data as any).age === 'number')
  );
}

// Zod version (cleaner):
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  age: z.number().optional()
});

// Ou:
const UserSchema2 = z.object({
  id: z.number(),
  name: z.string()
}).extend({
  email: z.string(),
  age: z.number()
}).partial({ email: true, age: true });
```

### Pattern 6: Error Response Validation

```typescript
// Validar error responses

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as any).error === 'string' &&
    'message' in data &&
    typeof (data as any).message === 'string' &&
    'statusCode' in data &&
    typeof (data as any).statusCode === 'number'
  );
}

async function request<T>(
  url: string,
  validator: (data: unknown) => data is T
): Promise<T> {
  const response = await fetch(url);
  const data: unknown = await response.json();
  
  // Check error response
  if (!response.ok) {
    if (isErrorResponse(data)) {
      throw new Error(`API Error: ${data.message} (${data.statusCode})`);
    }
    
    throw new Error(`HTTP ${response.status}`);
  }
  
  // Validate success response
  if (!validator(data)) {
    throw new Error('Invalid response data structure');
  }
  
  return data;
}

// Usage:
const user = await request('/users/1', isUser);
// Type: User (validated)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Type Guards

**✅ API Responses**: Validate ALL external data
**✅ User Input**: Forms, query params
**✅ Third-Party Data**: Libraries sem types
**✅ Unknown Sources**: localStorage, sessionStorage
**✅ Production Apps**: Defensive programming

### Quando Usar Type Assertions

**✅ DOM APIs**: `as HTMLInputElement` (você sabe type)
**✅ Type Narrowing**: Edge cases (compiler limitation)
**✅ Third-Party**: Quando type guard overkill

### Quando NÃO Usar Type Assertions

**❌ API Responses**: SEMPRE use type guards (validate)
**❌ Unknown Data**: Unsafe assumption
**❌ Production Code**: Evite assertions (prefer validation)

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Armadilha 1: Type Assertion sem Validation

```typescript
// ❌ ERRO - Assume sem validate
const user = await fetch('/users/1')
  .then(r => r.json()) as User;

// Se API retorna { id: 1, fullName: 'Alice' }
console.log(user.name); // undefined (crash)

// ✅ CORRETO - Validate primeiro
const data = await fetch('/users/1').then(r => r.json());

if (!isUser(data)) {
  throw new Error('Invalid user data');
}

const user = data; // Type-safe
```

#### Armadilha 2: Incomplete Type Guard

```typescript
// ❌ ERRO - Type guard incompleto
function isUser(data: unknown): data is User {
  return 'id' in data; // Apenas 1 property check
}

// Pode passar: { id: 1 } (sem name, email)
// Runtime error: user.name undefined

// ✅ CORRETO - Check ALL properties
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as any).id === 'number' &&
    'name' in data &&
    typeof (data as any).name === 'string' &&
    'email' in data &&
    typeof (data as any).email === 'string'
  );
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Zod

**Zod** é **runtime validation library** (DRY - schema + types).

### Relação com io-ts

**io-ts** similar a Zod (functional programming style).

### Relação com Yup

**Yup** para form validation (schema-based).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Type-Safe API Client**: Complete implementation
2. **Zod Integration**: Schema validation patterns
3. **Error Handling**: Type-safe error responses

---

## 📚 Conclusão

Type guards garantem **runtime validation** + **type safety**.

Dominar type guards significa:
- **is keyword**: Custom type predicates
- **typeof/instanceof/in**: Built-in narrowing
- **Discriminated Unions**: Tagged union patterns
- **Assertion Functions**: asserts keyword
- **Zod**: Runtime validation + type inference
- **Defensive Programming**: Validate ALL external data

É crítico para **production apps**, **API safety**, e **runtime correctness**.
