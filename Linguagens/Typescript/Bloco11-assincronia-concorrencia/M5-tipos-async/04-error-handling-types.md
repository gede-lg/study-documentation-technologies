# Error Handling Types

## 🎯 Introdução e Definição

### Definição Conceitual

**Error handling types** são **type patterns para typed error handling** em async operations, implementando **type-safe error representation**, **discriminated unions para success/failure**, e **Result<T, E> pattern**. Ao invés de `try/catch` com `unknown` errors, error handling types usam **explicit error types**, **type guards**, e **discriminated unions** para **compile-time error safety**. Implementa **functional error handling** - errors como values, não exceptions.

Conceitualmente, error handling types implementam **railway-oriented programming** - operação pode **succeed (Right)** com valor tipo `T` ou **fail (Left)** com erro tipo `E`. Type `Result<T, E>` é **discriminated union** - `{ success: true, value: T } | { success: false, error: E }` - permitindo **exhaustive type checking** e **type narrowing**. Segue **type-driven error handling** - compiler garante todos os error paths tratados.

**Fundamento teórico:** Error handling types derivam de **algebraic data types** - `Result<T, E>` é **sum type** (união de success e failure). Implementa **monadic error handling** - `Result` é **monad** com `map`, `flatMap`, `recover`. Segue **typed exceptions pattern** - errors têm tipos explícitos, não `any` ou `unknown`. Pattern relacionado a **Option/Maybe types** (`Some<T> | None`) para valores opcionais.

**Pattern básico:**
```typescript
// Result<T, E> - typed success or failure

type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

// Success case
function success<T, E>(value: T): Result<T, E> {
  return { success: true, value };
}

// Failure case
function failure<T, E>(error: E): Result<T, E> {
  return { success: false, error };
}

// Usage - type-safe error handling
async function fetchUser(id: number): Promise<Result<User, string>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return failure(`HTTP ${response.status}`);
    }
    
    const user = await response.json();
    return success(user);
  } catch (error) {
    return failure("Network error");
  }
}

// Pattern matching - type narrowing
const result = await fetchUser(123);

if (result.success) {
  console.log(result.value.name);  // Type: User
} else {
  console.error(result.error);  // Type: string
}

// Compiler garante ambos os cases tratados!
```

**Custom Error Types:**
```typescript
// Typed custom errors - explicit error types

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
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(
    message: string,
    public resourceId: number
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Union type de errors possíveis
type FetchError = NetworkError | ValidationError | NotFoundError;

async function fetchUser(id: number): Promise<Result<User, FetchError>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (response.status === 404) {
      return failure(new NotFoundError("User not found", id));
    }
    
    if (!response.ok) {
      return failure(new NetworkError(
        "Network request failed",
        response.status
      ));
    }
    
    const user = await response.json();
    
    if (!isValidUser(user)) {
      return failure(new ValidationError(
        "Invalid user data",
        "user",
        user
      ));
    }
    
    return success(user);
  } catch (error) {
    return failure(new NetworkError("Network error", 0));
  }
}

// Type-safe error handling - exhaustive checking
const result = await fetchUser(123);

if (result.success) {
  console.log(result.value.name);
} else {
  const error = result.error;
  
  if (error instanceof NetworkError) {
    console.error(`Network error: ${error.statusCode}`);
  } else if (error instanceof ValidationError) {
    console.error(`Validation error in field: ${error.field}`);
  } else if (error instanceof NotFoundError) {
    console.error(`Resource ${error.resourceId} not found`);
  }
  
  // Compiler garante todos os error types tratados
}
```

**Either<L, R> Pattern:**
```typescript
// Either<L, R> - functional error handling

type Either<L, R> = 
  | { type: 'left'; value: L }
  | { type: 'right'; value: R };

function left<L, R>(value: L): Either<L, R> {
  return { type: 'left', value };
}

function right<L, R>(value: R): Either<L, R> {
  return { type: 'right', value };
}

// Utility functions
function map<L, R, U>(
  either: Either<L, R>,
  fn: (value: R) => U
): Either<L, U> {
  if (either.type === 'right') {
    return right(fn(either.value));
  }
  return either;
}

function flatMap<L, R, U>(
  either: Either<L, R>,
  fn: (value: R) => Either<L, U>
): Either<L, U> {
  if (either.type === 'right') {
    return fn(either.value);
  }
  return either;
}

// Usage - functional composition
async function fetchAndProcessUser(
  id: number
): Promise<Either<string, ProcessedUser>> {
  const userResult = await fetchUser(id);
  
  if (userResult.type === 'left') {
    return userResult;  // Propagate error
  }
  
  const user = userResult.value;
  const processed = processUser(user);
  
  return right(processed);
}
```

**Option/Maybe Pattern:**
```typescript
// Option<T> - typed optional values (no error info)

type Option<T> = 
  | { type: 'some'; value: T }
  | { type: 'none' };

function some<T>(value: T): Option<T> {
  return { type: 'some', value };
}

function none<T>(): Option<T> {
  return { type: 'none' };
}

// Usage - null-safe operations
async function findUser(id: number): Promise<Option<User>> {
  const response = await fetch(`/api/users/${id}`);
  
  if (!response.ok) {
    return none();  // No user found
  }
  
  const user = await response.json();
  return some(user);
}

const userOption = await findUser(123);

if (userOption.type === 'some') {
  console.log(userOption.value.name);  // Type: User
} else {
  console.log("User not found");
}

// No error information - just presence/absence
```

**Type Guards para Errors:**
```typescript
// Type guards - narrow error types

function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// Usage - type-safe error handling
try {
  await fetchUser(123);
} catch (error) {
  // error é unknown (TS 4.0+)
  
  if (isNetworkError(error)) {
    console.error(`Network error: ${error.statusCode}`);
    // Type narrowed: NetworkError
  } else if (isValidationError(error)) {
    console.error(`Validation error: ${error.field}`);
    // Type narrowed: ValidationError
  } else if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    // Type narrowed: Error
  } else {
    console.error("Unknown error:", error);
  }
}
```

**Async Result Utilities:**
```typescript
// Utility functions para Result<T, E>

async function tryCatch<T, E>(
  operation: () => Promise<T>,
  onError: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    const value = await operation();
    return success(value);
  } catch (error) {
    return failure(onError(error));
  }
}

// Usage - wrap async operations
const result = await tryCatch(
  () => fetchUser(123),
  (error) => error instanceof Error ? error.message : "Unknown error"
);

// Combine multiple Results
async function all<T, E>(
  results: Promise<Result<T, E>>[]
): Promise<Result<T[], E>> {
  const resolvedResults = await Promise.all(results);
  
  const values: T[] = [];
  
  for (const result of resolvedResults) {
    if (!result.success) {
      return result;  // Return first error
    }
    values.push(result.value);
  }
  
  return success(values);
}

// Usage - all-or-nothing
const usersResult = await all([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);

if (usersResult.success) {
  console.log(usersResult.value);  // Type: User[]
} else {
  console.error(usersResult.error);  // Type: E
}
```

### Contexto Histórico e Evolução

**Pre-TypeScript:** Callback errors (error-first pattern).

```javascript
// Node.js callback pattern
fetchUser(123, (error, user) => {
  if (error) {
    console.error(error);  // error é any
  } else {
    console.log(user);  // user é any
  }
});
```

**TypeScript 1.0 (2014):** Basic error handling.

```typescript
// TypeScript 1.0 - basic try/catch
try {
  const user = await fetchUser(123);
} catch (error) {
  console.error(error);  // error é any
}
```

**TypeScript 2.0 (2016):** Tagged unions (discriminated unions).

```typescript
// TypeScript 2.0 - discriminated unions
type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

// Type-safe error handling possível
```

**TypeScript 3.0 (2018):** Unknown type adicionado.

```typescript
// TypeScript 3.0 - unknown type
try {
  await fetchUser(123);
} catch (error: unknown) {
  // error é unknown - type-safe checking
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

**TypeScript 4.0 (2020):** Catch clause unknown by default.

```typescript
// TypeScript 4.0 - useUnknownInCatchVariables
try {
  await fetchUser(123);
} catch (error) {
  // error é unknown automaticamente
  // Precisa type guard
}
```

**TypeScript 4.4 (2021):** Control flow analysis melhorado.

```typescript
// TypeScript 4.4 - melhor narrowing
if (result.success) {
  console.log(result.value);  // Type narrowed
} else {
  console.error(result.error);  // Type narrowed
}
```

**TypeScript 5.0 (2023):** Better discriminated union narrowing.

```typescript
// TypeScript 5.0 - exhaustive checking
type Result<T, E> = Success<T> | Failure<E>;

// Compiler garante exhaustive matching
```

### Problema Fundamental que Resolve

Error handling types resolvem problemas de **untyped errors**, **missing error cases**, **error type ambiguity**, e **runtime error surprises**.

**Problema 1: Untyped Errors**
```typescript
// try/catch com unknown errors ❌

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

try {
  const user = await fetchUser(123);
  console.log(user.name);
} catch (error) {
  // error é unknown - sem type information!
  console.error(error);  // O que fazer com error?
  
  // Precisa runtime checks
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error");
  }
}

// ✗ No type information sobre errors
// ✗ Runtime checking necessário
```

**Solução: Typed Result<T, E>**
```typescript
// Result<T, E> - typed errors ✅

type FetchError = 
  | { type: 'network'; statusCode: number }
  | { type: 'parse'; message: string };

async function fetchUser(
  id: number
): Promise<Result<User, FetchError>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      return failure({
        type: 'network',
        statusCode: response.status
      });
    }
    
    const user = await response.json();
    return success(user);
  } catch (error) {
    return failure({
      type: 'parse',
      message: error instanceof Error ? error.message : "Parse error"
    });
  }
}

const result = await fetchUser(123);

if (result.success) {
  console.log(result.value.name);  // Type: User
} else {
  const error = result.error;  // Type: FetchError
  
  if (error.type === 'network') {
    console.error(`HTTP ${error.statusCode}`);
  } else if (error.type === 'parse') {
    console.error(`Parse error: ${error.message}`);
  }
}

// ✓ Fully typed errors
// ✓ Exhaustive checking
```

**Problema 2: Missing Error Cases**
```typescript
// Sem type checking - esquece error cases ❌

async function processUser(id: number): Promise<void> {
  try {
    const user = await fetchUser(id);
    console.log(user.name);
  } catch (error) {
    // Só trata Error - esquece outros error types!
    if (error instanceof Error) {
      console.error(error.message);
    }
    // NetworkError, ValidationError não tratados!
  }
}

// ✗ Missing error cases
// ✗ No compiler warning
```

**Solução: Discriminated union forces exhaustiveness**
```typescript
// Discriminated union - compiler força exhaustiveness ✅

type FetchError = 
  | { type: 'network'; statusCode: number }
  | { type: 'validation'; field: string }
  | { type: 'notfound'; id: number };

async function processUser(id: number): Promise<void> {
  const result = await fetchUser(id);
  
  if (result.success) {
    console.log(result.value.name);
  } else {
    const error = result.error;
    
    if (error.type === 'network') {
      console.error(`HTTP ${error.statusCode}`);
    } else if (error.type === 'validation') {
      console.error(`Validation error: ${error.field}`);
    } else if (error.type === 'notfound') {
      console.error(`User ${error.id} not found`);
    } else {
      // Exhaustiveness check - compiler error se case faltando!
      const _exhaustive: never = error;
    }
  }
}

// ✓ Compiler forces all cases handled
// ✓ Refactoring-safe
```

**Problema 3: Error Aggregation**
```typescript
// Multiple async operations - qual error retornar? ❌

async function fetchUserAndPosts(userId: number): Promise<UserWithPosts> {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(userId);
    
    return { user, posts };
  } catch (error) {
    // Qual operation failed? Não sabemos!
    throw error;
  }
}

// ✗ No information sobre qual operation failed
// ✗ Error context lost
```

**Solução: Result aggregation**
```typescript
// Result aggregation - preserve error context ✅

async function fetchUserAndPosts(
  userId: number
): Promise<Result<UserWithPosts, string>> {
  const userResult = await fetchUser(userId);
  
  if (!userResult.success) {
    return failure(`Failed to fetch user: ${userResult.error}`);
  }
  
  const postsResult = await fetchPosts(userId);
  
  if (!postsResult.success) {
    return failure(`Failed to fetch posts: ${postsResult.error}`);
  }
  
  return success({
    user: userResult.value,
    posts: postsResult.value
  });
}

const result = await fetchUserAndPosts(123);

if (result.success) {
  console.log(result.value.user.name);
  console.log(result.value.posts.length);
} else {
  console.error(result.error);
  // Error message indica qual operation failed!
}

// ✓ Error context preserved
// ✓ Clear error messages
```

**Problema 4: Partial Success Handling**
```typescript
// Partial success - alguns succeeded, alguns failed ❌

async function fetchMultipleUsers(
  ids: number[]
): Promise<User[]> {
  const users = await Promise.all(
    ids.map(id => fetchUser(id))
  );
  
  return users;
  // Se UMA fetch falha, tudo falha!
  // Perdemos users que succeeded
}

// ✗ All-or-nothing approach
// ✗ Partial success não capturado
```

**Solução: Result array for partial success**
```typescript
// Result array - capture partial success ✅

async function fetchMultipleUsers(
  ids: number[]
): Promise<Result<User, string>[]> {
  return Promise.all(
    ids.map(id => fetchUser(id))
  );
}

const results = await fetchMultipleUsers([1, 2, 3]);

const succeeded: User[] = [];
const failed: string[] = [];

for (const result of results) {
  if (result.success) {
    succeeded.push(result.value);
  } else {
    failed.push(result.error);
  }
}

console.log(`Succeeded: ${succeeded.length}`);
console.log(`Failed: ${failed.length}`);

// ✓ Partial success captured
// ✓ Can process succeeded users
```

**Fundamento teórico:** Error handling types implementam **type-safe error representation** - errors são first-class values com explicit types, permitindo **compile-time exhaustiveness checking** e **error context preservation**.

### Importância no Ecossistema

Error handling types são importantes porque:

- **Type safety:** Compile-time error checking
- **Exhaustiveness:** Compiler garante todos os error cases tratados
- **Documentation:** Error types documentam possible failures
- **Refactoring:** Safe error handling refactoring
- **Functional patterns:** Railway-oriented programming
- **Error context:** Preserve error information
- **Partial success:** Handle partial failures
- **Production reliability:** Prevent unhandled errors

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Result<T, E>:** Success or failure discriminated union
2. **Custom error types:** Typed Error classes
3. **Type guards:** Narrow error types
4. **Either<L, R>:** Functional error handling
5. **Option<T>:** Typed optional values

### Pilares Fundamentais

- **Discriminated unions:** Type-safe pattern matching
- **Type narrowing:** Control flow analysis
- **Exhaustiveness checking:** Compiler-enforced completeness
- **Error as values:** Functional error handling
- **Type guards:** Runtime type checking

### Visão Geral das Nuances

- **unknown vs any:** Type-safe error catching
- **never type:** Exhaustiveness checking
- **Generic Result:** `Result<T, E>` generic
- **Error aggregation:** Combine multiple Results
- **Partial success:** Handle some successes

## 🧠 Fundamentos Teóricos

### Basic Result Type

```typescript
// Basic Result<T, E> type

type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };

function success<T, E>(value: T): Result<T, E> {
  return { success: true, value };
}

function failure<T, E>(error: E): Result<T, E> {
  return { success: false, error };
}
```

**Basic:** Result discriminated union.

### Princípios e Conceitos Subjacentes

#### Type Narrowing

```typescript
// Type narrowing com discriminated union

const result = await fetchUser(123);

if (result.success) {
  // Type narrowed: { success: true; value: User }
  console.log(result.value.name);
} else {
  // Type narrowed: { success: false; error: E }
  console.error(result.error);
}
```

**Narrowing:** Discriminant property narrows type.

#### Custom Error Types

```typescript
// Custom typed errors

class NotFoundError extends Error {
  constructor(
    message: string,
    public resourceId: number
  ) {
    super(message);
    this.name = 'NotFoundError';
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

type FetchError = NotFoundError | ValidationError;
```

**Custom:** Typed Error classes.

### Type Guards

```typescript
// Type guards para narrow error types

function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

try {
  await fetchUser(123);
} catch (error) {
  if (isNotFoundError(error)) {
    console.error(`Resource ${error.resourceId} not found`);
  }
}
```

**Guards:** Runtime type checking.

#### Either Pattern

```typescript
// Either<L, R> - functional error handling

type Either<L, R> = 
  | { type: 'left'; value: L }
  | { type: 'right'; value: R };

function map<L, R, U>(
  either: Either<L, R>,
  fn: (value: R) => U
): Either<L, U> {
  if (either.type === 'right') {
    return { type: 'right', value: fn(either.value) };
  }
  return either;
}
```

**Either:** Functional error type.

#### Option Pattern

```typescript
// Option<T> - typed optional

type Option<T> = 
  | { type: 'some'; value: T }
  | { type: 'none' };

function getOrElse<T>(option: Option<T>, defaultValue: T): T {
  if (option.type === 'some') {
    return option.value;
  }
  return defaultValue;
}
```

**Option:** Typed optional values.

### Exhaustiveness Checking

```typescript
// Exhaustiveness checking com never

type ErrorType = 
  | { type: 'network' }
  | { type: 'validation' };

function handleError(error: ErrorType): void {
  if (error.type === 'network') {
    console.error("Network error");
  } else if (error.type === 'validation') {
    console.error("Validation error");
  } else {
    const _exhaustive: never = error;
    // Compiler error se case faltando!
  }
}
```

**Exhaustiveness:** Compiler-enforced completeness.

### Real-World Example - API Service

```typescript
// Real-world - typed error handling service

// Error types
type ApiError = 
  | { type: 'network'; statusCode: number; message: string }
  | { type: 'validation'; field: string; message: string }
  | { type: 'notfound'; resourceId: number }
  | { type: 'unauthorized'; message: string };

// Result type
type ApiResult<T> = Result<T, ApiError>;

// API Service
class ApiService {
  async get<T>(endpoint: string): Promise<ApiResult<T>> {
    try {
      const response = await fetch(endpoint);
      
      if (response.status === 401) {
        return failure({
          type: 'unauthorized',
          message: 'Authentication required'
        });
      }
      
      if (response.status === 404) {
        return failure({
          type: 'notfound',
          resourceId: parseInt(endpoint.split('/').pop() || '0')
        });
      }
      
      if (!response.ok) {
        return failure({
          type: 'network',
          statusCode: response.status,
          message: response.statusText
        });
      }
      
      const data: T = await response.json();
      return success(data);
    } catch (error) {
      return failure({
        type: 'network',
        statusCode: 0,
        message: error instanceof Error ? error.message : 'Network error'
      });
    }
  }
}

// Usage - type-safe error handling
const api = new ApiService();

const userResult = await api.get<User>('/api/users/123');

if (userResult.success) {
  console.log(userResult.value.name);  // Type: User
} else {
  const error = userResult.error;  // Type: ApiError
  
  if (error.type === 'network') {
    console.error(`HTTP ${error.statusCode}: ${error.message}`);
  } else if (error.type === 'validation') {
    console.error(`Validation error in ${error.field}: ${error.message}`);
  } else if (error.type === 'notfound') {
    console.error(`Resource ${error.resourceId} not found`);
  } else if (error.type === 'unauthorized') {
    console.error(`Unauthorized: ${error.message}`);
  } else {
    const _exhaustive: never = error;
  }
}

// ✓ All error types handled
// ✓ Compiler-enforced exhaustiveness
// ✓ Type-safe error information
```

**Real-World:** Complete typed error handling system.

#### Modelo Mental para Compreensão

Pense em error handling types como **railway tracks**:

**Success track (Right):** Happy path com valor
**Failure track (Left):** Error path com error
**Switch points:** Type narrowing
**Type gates:** Exhaustiveness checking

**Analogia - Package Delivery:**

**Success:** Package delivered (Result.success)
**Failure:** Delivery failed (Result.failure)
**Error type:** Reason for failure (typed error)
**Pattern matching:** Check delivery status
**Exhaustiveness:** Handle all failure types

**Metáfora - Medical Diagnosis:**

**Success:** Healthy (value present)
**Failure:** Diagnosis (error type)
**Error types:** Different conditions (discriminated union)
**Type guard:** Medical test (narrows type)
**Treatment:** Handle each error type

**Fluxo visual:**
```
Result<T, E> Flow:

Operation → Result<T, E>
            └───┬───┘
                │
        ┌───────┴───────┐
        │               │
   success: true   success: false
   value: T        error: E
        │               │
        ▼               ▼
   Happy path      Error handling
   
Type Narrowing:

if (result.success) {
    result.value  ← Type: T
} else {
    result.error  ← Type: E
}

Discriminated Union:
success property → discriminant
Compiler narrows type automatically
```

## 🔍 Análise Conceitual Profunda

### Result Monad Operations

```typescript
// Monadic operations on Result

function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.success) {
    return success(fn(result.value));
  }
  return result;
}

function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (result.success) {
    return fn(result.value);
  }
  return result;
}

// Chain operations
const result = await fetchUser(123);
const processedResult = map(result, user => ({
  ...user,
  displayName: user.name.toUpperCase()
}));
```

**Monad:** Functional composition.

#### Error Recovery

```typescript
// Error recovery - fallback values

function recover<T, E>(
  result: Result<T, E>,
  recovery: (error: E) => T
): T {
  if (result.success) {
    return result.value;
  }
  return recovery(result.error);
}

// Usage
const user = recover(
  await fetchUser(123),
  (error) => ({ id: 0, name: "Guest" })
);
// Always returns User (never fails)
```

**Recovery:** Fallback from errors.

### Async Result Combinators

```typescript
// Combine multiple async Results

async function sequence<T, E>(
  results: Promise<Result<T, E>>[]
): Promise<Result<T[], E>> {
  const resolved = await Promise.all(results);
  const values: T[] = [];
  
  for (const result of resolved) {
    if (!result.success) {
      return result;  // First error
    }
    values.push(result.value);
  }
  
  return success(values);
}

// Usage - all must succeed
const usersResult = await sequence([
  fetchUser(1),
  fetchUser(2),
  fetchUser(3)
]);
```

**Combinators:** Combine Results.

#### Validation with Result

```typescript
// Validation accumulating errors

type ValidationError = string[];

function validate(user: unknown): Result<User, ValidationError> {
  const errors: string[] = [];
  
  if (typeof user !== 'object' || user === null) {
    return failure(['Invalid user object']);
  }
  
  const obj = user as any;
  
  if (typeof obj.id !== 'number') {
    errors.push('id must be number');
  }
  
  if (typeof obj.name !== 'string') {
    errors.push('name must be string');
  }
  
  if (errors.length > 0) {
    return failure(errors);
  }
  
  return success(obj as User);
}

// Accumulate all errors, not just first
```

**Validation:** Accumulating errors.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
type ApiResult<T> = Result<T, ApiError>;

async function fetchData<T>(url: string): Promise<ApiResult<T>> {
  // Type-safe API errors
}
```

**Raciocínio:** Typed API errors.

### Form Validation

```typescript
type ValidationResult<T> = Result<T, ValidationError[]>;

function validateForm(data: unknown): ValidationResult<FormData> {
  // Accumulate validation errors
}
```

**Raciocínio:** Validation error accumulation.

### Database Operations

```typescript
type DbResult<T> = Result<T, DbError>;

async function query<T>(sql: string): Promise<DbResult<T>> {
  // Type-safe database errors
}
```

**Raciocínio:** Database error types.

## ⚠️ Limitações e Considerações Teóricas

### Runtime Validation Still Needed

```typescript
// Types erased at runtime - validation still needed

async function fetchUser(id: number): Promise<Result<User, string>> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();  // any!
  
  // Need runtime validation
  if (!isValidUser(data)) {
    return failure("Invalid user data");
  }
  
  return success(data);
}
```

**Limitação:** Runtime validation required.

### Verbosity

```typescript
// Result pattern mais verbose que try/catch

const result = await fetchUser(123);
if (!result.success) {
  return result;
}
const user = result.value;

// vs

const user = await fetchUser(123);
// Exceptions propagate automatically
```

**Consideração:** More verbose than exceptions.

### Library Interop

```typescript
// Libraries usam exceptions - precisa wrapper

async function fetchUser(id: number): Promise<Result<User, string>> {
  try {
    const user = await externalLib.getUser(id);  // Throws
    return success(user);
  } catch (error) {
    return failure(error.message);
  }
}

// Wrap exception-based code
```

**Limitação:** Exception-based libraries need wrapping.

## 🔗 Interconexões Conceituais

**Relação com Discriminated Unions:** Result<T, E> é union.

**Relação com Type Guards:** Narrow error types.

**Relação com Generics:** Result<T, E> generic.

**Relação com never:** Exhaustiveness checking.

**Relação com unknown:** Type-safe error catching.

## 🚀 Evolução e Próximos Conceitos

Dominar error handling types prepara para:
- **Effect systems:** Track effects em types
- **Branded types:** Nominal typing
- **Parser combinators:** Type-safe parsing
- **Async validation:** Complex validation patterns
- **Railway-oriented programming:** Functional error handling
- **Dependent types:** Type-level validation
