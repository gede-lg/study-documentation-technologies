# 🎯 Introdução

**Axios com TypeScript** fornece **type safety** para HTTP requests/responses, catching errors em compile-time ao invés de runtime, enabling autocompletion, preventing typos, e ensuring data structure consistency através de generic types (`axios.get<T>()`), interfaces, e type annotations. TypeScript transforms Axios de untyped JavaScript library para fully typed, self-documenting API client com compile-time guarantees.

O problema fundamental que TypeScript resolve em Axios é **runtime type uncertainty**: sem types, `response.data` é `any` - você não sabe structure até runtime, leading to errors como `response.data.userName` quando property é actually `response.data.user_name`, ou accessing nested properties que podem ser undefined (`response.data.user.address.city` crashes se `user` null). TypeScript makes these errors **impossible** através de compile-time type checking.

Axios fornece excellent TypeScript support out-of-the-box: **generic types** para requests (`axios.get<User>('/users/1')` types `response.data` como `User`), **AxiosRequestConfig** interface para type-safe configuration, **AxiosResponse<T>** interface para typed responses, **AxiosError** para typed error handling, e **full IDE autocomplete** para config options, headers, methods. Setup apenas requires installing `@types/axios` (deprecated - types agora bundled) ou using Axios ≥1.0 (types included).

TypeScript benefits incluem: **compile-time validation** (catch typos, wrong property access, missing required fields antes de runtime), **IDE autocomplete** (IntelliSense shows available properties/methods), **refactoring safety** (rename properties across codebase confidently), **self-documenting code** (types serve como inline documentation), **reduced bugs** (type mismatches caught early), **better developer experience** (less mental overhead remembering API structures).

Compared to JavaScript: **JavaScript Axios** é flexible mas error-prone (typos caught at runtime, no autocomplete, manual documentation), **TypeScript Axios** é stricter mas safer (errors caught at compile-time, full autocomplete, types são documentation). Trade-off: initial setup complexity e verbosity vs long-term safety e maintainability.

Este módulo explora Axios TypeScript setup comprehensively: desde installation e tsconfig configuration, através de basic type annotations (`AxiosResponse<T>`, `AxiosRequestConfig`), generic methods (`get<T>`, `post<T, D>`), até error typing (`AxiosError<T>`), instance typing, e type guards. Objetivo é fornecer complete foundation para type-safe Axios usage em TypeScript projects.

---

# 📋 Sumário

### **TypeScript Fundamentals**
- Why TypeScript com Axios
- Type safety benefits
- Compile-time vs runtime errors
- IDE autocomplete

### **Installation & Configuration**
- Installing Axios
- TypeScript configuration (tsconfig.json)
- Strict mode considerations
- Module resolution

### **Basic Type Annotations**
- AxiosResponse<T>
- AxiosRequestConfig
- AxiosError
- Method signatures

### **Generic Methods**
- axios.get<T>()
- axios.post<T, D>()
- axios.put<T, D>()
- axios.delete<T>()

### **Response Typing**
- Typing response.data
- Typing response.headers
- Typing response.status
- Optional properties

### **Request Config Typing**
- Typing params
- Typing headers
- Typing data
- Custom config properties

### **Error Typing**
- AxiosError<T>
- Error response typing
- Type guards (isAxiosError)
- Error handling patterns

### **Instance Typing**
- Creating typed instances
- Custom instance interfaces
- Default types
- Type inference

---

# 🧠 Fundamentos

## TypeScript Fundamentals

### **Why TypeScript com Axios**

**JavaScript problems**:

```javascript
// ❌ JavaScript - no type safety
const response = await axios.get('/users/1');

console.log(response.data.userName); // Typo - no error until runtime
console.log(response.data.age + 1); // Runtime error se age é string

// No autocomplete
response.data. // ??? - no IDE help
```

**TypeScript solution**:

```typescript
// ✅ TypeScript - compile-time safety
interface User {
  username: string;
  age: number;
}

const response = await axios.get<User>('/users/1');

console.log(response.data.userName); // ❌ Compile error: Property 'userName' does not exist
console.log(response.data.username); // ✅ Correct

response.data.age + 1; // ✅ TypeScript knows age is number

// Full autocomplete
response.data. // Shows: username, age
```

### **Type Safety Benefits**

**Prevent typos**:

```typescript
interface User {
  email: string;
}

const user = await axios.get<User>('/users/1').then(r => r.data);

user.emial; // ❌ Compile error: Property 'emial' does not exist
user.email; // ✅ Correct
```

**Prevent wrong types**:

```typescript
interface CreateUserRequest {
  name: string;
  age: number;
}

// ❌ Compile error: Type 'string' is not assignable to type 'number'
axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  age: '25' // Wrong type
});

// ✅ Correct
axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  age: 25
});
```

**Catch missing properties**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Compile error: Property 'email' is missing
axios.post<User>('/users', {
  name: 'Alice'
});
```

### **Compile-Time vs Runtime Errors**

**JavaScript - runtime error**:

```javascript
// No error at compile time
const response = await axios.get('/users/1');

// Runtime error - property doesn't exist
console.log(response.data.user.address.city);
// TypeError: Cannot read property 'address' of undefined
```

**TypeScript - compile-time error**:

```typescript
interface User {
  id: number;
  name: string;
}

const response = await axios.get<User>('/users/1');

// ❌ Compile error BEFORE running
console.log(response.data.user.address.city);
// Property 'user' does not exist on type 'User'
```

### **IDE Autocomplete**

**Without types**:

```javascript
const response = await axios.get('/users/1');
response.data. // No autocomplete - IDE doesn't know structure
```

**With types**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const response = await axios.get<User>('/users/1');
response.data. // Autocomplete shows: id, name, email, role
```

## Installation & Configuration

### **Installing Axios**

**Axios ≥1.0** (types included):

```bash
npm install axios
```

**Axios <1.0** (separate types):

```bash
npm install axios
npm install --save-dev @types/axios
```

**Verify installation**:

```typescript
import axios from 'axios';

// TypeScript recognizes Axios types
const response: AxiosResponse = await axios.get('/api');
```

### **TypeScript Configuration**

**tsconfig.json** - basic:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Key options**:

```json
{
  "compilerOptions": {
    // Enable strict type checking
    "strict": true,
    
    // Enable all strict mode flags
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    
    // Module system
    "moduleResolution": "node",
    "esModuleInterop": true,
    
    // Target modern JavaScript
    "target": "ES2020",
    "lib": ["ES2020", "DOM"]
  }
}
```

### **Strict Mode Considerations**

**strictNullChecks**:

```typescript
// With strictNullChecks: true
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}

const user = await axios.get<User>('/users/1').then(r => r.data);

// ❌ Compile error: Object is possibly 'undefined'
console.log(user.email.toLowerCase());

// ✅ Correct - handle undefined
console.log(user.email?.toLowerCase());
```

**noImplicitAny**:

```typescript
// With noImplicitAny: true

// ❌ Compile error: Parameter 'data' implicitly has an 'any' type
axios.interceptors.request.use(config => {
  console.log(config.data);
  return config;
});

// ✅ Correct - explicit type
axios.interceptors.request.use((config: AxiosRequestConfig) => {
  console.log(config.data);
  return config;
});
```

### **Module Resolution**

**ESModules** (recommended):

```typescript
import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
```

**CommonJS**:

```typescript
const axios = require('axios');

// Type imports
import type { AxiosResponse } from 'axios';
```

## Basic Type Annotations

### **AxiosResponse<T>**

**Full response typing**:

```typescript
import type { AxiosResponse } from 'axios';

interface User {
  id: number;
  name: string;
}

// Type entire response
const response: AxiosResponse<User> = await axios.get('/users/1');

// response.data is typed as User
console.log(response.data.name); // ✅ Autocomplete works

// Other properties also typed
response.status; // number
response.statusText; // string
response.headers; // RawAxiosResponseHeaders | AxiosResponseHeaders
response.config; // InternalAxiosRequestConfig<any>
```

**Inline typing**:

```typescript
const response: AxiosResponse<{ id: number; name: string }> = 
  await axios.get('/users/1');
```

### **AxiosRequestConfig**

**Typing request config**:

```typescript
import type { AxiosRequestConfig } from 'axios';

interface User {
  id: number;
  name: string;
}

const config: AxiosRequestConfig = {
  url: '/users/1',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer token'
  },
  timeout: 5000
};

const response = await axios.request<User>(config);
```

**Partial config**:

```typescript
const config: Partial<AxiosRequestConfig> = {
  timeout: 5000,
  headers: {
    'X-Custom': 'value'
  }
};

axios.get('/users', config);
```

### **AxiosError**

**Error typing**:

```typescript
import type { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  code: string;
}

try {
  await axios.get('/users/1');
} catch (error) {
  const axiosError = error as AxiosError<ErrorResponse>;
  
  if (axiosError.response) {
    console.log(axiosError.response.data.message);
    console.log(axiosError.response.status);
  }
}
```

### **Method Signatures**

**GET**:

```typescript
axios.get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
```

**POST**:

```typescript
axios.post<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
```

**PUT**:

```typescript
axios.put<T, D>(url: string, data?: D, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
```

**DELETE**:

```typescript
axios.delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>
```

## Generic Methods

### **axios.get<T>()**

**Type response data**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// response.data typed as User
const response = await axios.get<User>('/users/1');

console.log(response.data.name); // ✅ Type-safe
console.log(response.data.age); // ❌ Compile error
```

**Array responses**:

```typescript
interface User {
  id: number;
  name: string;
}

// response.data typed as User[]
const response = await axios.get<User[]>('/users');

response.data.forEach(user => {
  console.log(user.name); // ✅ Type-safe
});
```

**Extract data directly**:

```typescript
const user = await axios.get<User>('/users/1').then(r => r.data);

// user is typed as User
console.log(user.name);
```

### **axios.post<T, D>()**

**Type response AND request**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

// T = response type, D = request data type
const response = await axios.post<User, CreateUserRequest>(
  '/users',
  {
    name: 'Alice',
    email: 'alice@example.com'
  }
);

// response.data typed as User
console.log(response.data.id);
```

**Request validation**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

// ❌ Compile error: Property 'age' is missing
axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  email: 'alice@example.com'
});

// ✅ Correct
axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
});
```

### **axios.put<T, D>()**

**Type update requests**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

const response = await axios.put<User, UpdateUserRequest>(
  '/users/1',
  {
    name: 'Alice Updated'
  }
);

console.log(response.data.name);
```

### **axios.delete<T>()**

**Type delete responses**:

```typescript
interface DeleteResponse {
  success: boolean;
  deletedId: number;
}

const response = await axios.delete<DeleteResponse>('/users/1');

console.log(response.data.success);
console.log(response.data.deletedId);
```

**No response body**:

```typescript
// 204 No Content
const response = await axios.delete<void>('/users/1');

// response.data is void
expect(response.status).toBe(204);
```

## Response Typing

### **Typing response.data**

**Simple types**:

```typescript
interface User {
  id: number;
  name: string;
}

const response = await axios.get<User>('/users/1');

// response.data: User
const user: User = response.data;
```

**Nested types**:

```typescript
interface Address {
  street: string;
  city: string;
  country: string;
}

interface User {
  id: number;
  name: string;
  address: Address;
}

const response = await axios.get<User>('/users/1');

// Nested access type-safe
console.log(response.data.address.city);
```

**Union types**:

```typescript
interface SuccessResponse {
  success: true;
  data: User;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const response = await axios.get<ApiResponse>('/users/1');

if (response.data.success) {
  console.log(response.data.data.name); // Type narrowed to SuccessResponse
} else {
  console.log(response.data.error); // Type narrowed to ErrorResponse
}
```

### **Typing response.headers**

**Built-in header types**:

```typescript
const response = await axios.get<User>('/users/1');

// response.headers typed
response.headers['content-type']; // string | undefined
response.headers['x-total-count']; // string | undefined
```

**Custom header types**:

```typescript
interface CustomHeaders {
  'x-total-count': string;
  'x-page': string;
}

const response = await axios.get<User[], any, CustomHeaders>('/users');

// Type-safe header access
const totalCount = parseInt(response.headers['x-total-count']);
```

### **Typing response.status**

**Status as literal type**:

```typescript
const response = await axios.get<User>('/users/1');

// response.status: number
if (response.status === 200) {
  console.log('Success');
}
```

**Discriminated unions**:

```typescript
type ApiResponse<T> =
  | { status: 200; data: T }
  | { status: 404; data: null }
  | { status: 500; data: { error: string } };
```

### **Optional Properties**

**Optional fields**:

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // Optional
  phone?: string; // Optional
}

const user = await axios.get<User>('/users/1').then(r => r.data);

// Must handle undefined
console.log(user.email?.toLowerCase());

// Or provide default
const email = user.email ?? 'no-email@example.com';
```

**Nullable fields**:

```typescript
interface User {
  id: number;
  name: string;
  deletedAt: Date | null;
}

const user = await axios.get<User>('/users/1').then(r => r.data);

if (user.deletedAt !== null) {
  console.log(user.deletedAt);
}
```

## Request Config Typing

### **Typing params**

**Query parameters**:

```typescript
interface SearchParams {
  page: number;
  limit: number;
  sort?: string;
}

const params: SearchParams = {
  page: 1,
  limit: 10,
  sort: 'name'
};

const response = await axios.get<User[]>('/users', { params });
```

**Type-safe params**:

```typescript
// ❌ Compile error: Type 'string' is not assignable to type 'number'
const params: SearchParams = {
  page: '1', // Wrong type
  limit: 10
};
```

### **Typing headers**

**Custom headers**:

```typescript
interface CustomHeaders {
  'Authorization': string;
  'X-Api-Key': string;
  'Content-Type': 'application/json';
}

const headers: CustomHeaders = {
  'Authorization': 'Bearer token',
  'X-Api-Key': 'key123',
  'Content-Type': 'application/json'
};

axios.get('/users', { headers });
```

**Partial headers**:

```typescript
const headers: Partial<CustomHeaders> = {
  'Authorization': 'Bearer token'
};

axios.get('/users', { headers });
```

### **Typing data**

**Request body typing**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

const data: CreateUserRequest = {
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
};

axios.post<User>('/users', data);
```

**Enforce required fields**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

// ❌ Compile error: Property 'age' is missing
const data: CreateUserRequest = {
  name: 'Alice',
  email: 'alice@example.com'
};
```

### **Custom Config Properties**

**Extend AxiosRequestConfig**:

```typescript
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retryCount?: number;
}

const config: CustomAxiosRequestConfig = {
  url: '/users',
  skipAuth: true,
  retryCount: 3
};

axios.request(config);
```

## Error Typing

### **AxiosError<T>**

**Type error response**:

```typescript
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

try {
  await axios.post('/users', { name: '' });
} catch (error) {
  const axiosError = error as AxiosError<ErrorResponse>;
  
  if (axiosError.response) {
    console.log(axiosError.response.data.message);
    console.log(axiosError.response.data.code);
    console.log(axiosError.response.data.details);
  }
}
```

### **Error Response Typing**

**Discriminated error types**:

```typescript
interface ValidationError {
  type: 'validation';
  fields: Record<string, string[]>;
}

interface AuthError {
  type: 'auth';
  message: string;
}

interface ServerError {
  type: 'server';
  message: string;
  stackTrace?: string;
}

type ApiError = ValidationError | AuthError | ServerError;

try {
  await axios.post('/users', {});
} catch (error) {
  const axiosError = error as AxiosError<ApiError>;
  
  if (axiosError.response) {
    const errorData = axiosError.response.data;
    
    if (errorData.type === 'validation') {
      console.log(errorData.fields); // Type narrowed
    } else if (errorData.type === 'auth') {
      console.log(errorData.message);
    }
  }
}
```

### **Type Guards (isAxiosError)**

**Check if error is AxiosError**:

```typescript
import axios, { AxiosError } from 'axios';

try {
  await axios.get('/users');
} catch (error) {
  if (axios.isAxiosError(error)) {
    // error narrowed to AxiosError
    console.log(error.response?.status);
    console.log(error.response?.data);
  } else {
    // Other error type
    console.log(error);
  }
}
```

**Type guard with generic**:

```typescript
interface ErrorResponse {
  message: string;
}

try {
  await axios.get('/users');
} catch (error) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    console.log(error.response?.data.message); // Type-safe
  }
}
```

### **Error Handling Patterns**

**Extract error data**:

```typescript
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Unknown error';
};

try {
  await axios.get('/users');
} catch (error) {
  console.error(getErrorMessage(error));
}
```

**Type-safe error handling**:

```typescript
interface ApiErrorResponse {
  message: string;
  code: string;
}

const handleApiError = (error: AxiosError<ApiErrorResponse>): void => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        console.error('Bad request:', data.message);
        break;
      case 401:
        console.error('Unauthorized');
        break;
      case 404:
        console.error('Not found');
        break;
      default:
        console.error('Error:', data.message);
    }
  } else if (error.request) {
    console.error('Network error');
  } else {
    console.error('Error:', error.message);
  }
};
```

## Instance Typing

### **Creating Typed Instances**

**Basic typed instance**:

```typescript
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Use like regular axios with types
const response = await api.get<User>('/users/1');
```

### **Custom Instance Interfaces**

**Extend AxiosInstance**:

```typescript
interface TypedApiClient extends AxiosInstance {
  getUser(id: number): Promise<User>;
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: number, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: number): Promise<void>;
}

const createApiClient = (): TypedApiClient => {
  const instance = axios.create({
    baseURL: 'https://api.example.com'
  }) as TypedApiClient;
  
  instance.getUser = (id) => 
    instance.get<User>(`/users/${id}`).then(r => r.data);
  
  instance.createUser = (data) =>
    instance.post<User>('/users', data).then(r => r.data);
  
  instance.updateUser = (id, data) =>
    instance.put<User>(`/users/${id}`, data).then(r => r.data);
  
  instance.deleteUser = (id) =>
    instance.delete(`/users/${id}`).then(() => undefined);
  
  return instance;
};

const api = createApiClient();

// Type-safe method calls
const user = await api.getUser(1);
console.log(user.name);
```

### **Default Types**

**Instance with default response type**:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    total: number;
  };
}

const api = axios.create({
  baseURL: 'https://api.example.com'
});

// Helper to unwrap API response
const get = <T>(url: string) =>
  api.get<ApiResponse<T>>(url).then(r => r.data.data);

const user = await get<User>('/users/1');
console.log(user.name); // user: User, not ApiResponse<User>
```

### **Type Inference**

**Let TypeScript infer types**:

```typescript
const api = axios.create({
  baseURL: 'https://api.example.com'
});

// TypeScript infers User type from response
const getUser = async (id: number) => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data; // Inferred as User
};

const user = await getUser(1); // user: User
```

---

# 🎯 Aplicabilidade

## Quando Usar TypeScript com Axios

**Large Codebases**: Type safety prevents bugs em complex applications.

**Team Projects**: Types serve as documentation, improving collaboration.

**API-Heavy Applications**: Many HTTP requests benefit from type safety.

**Long-Term Projects**: Refactoring safety reduces maintenance costs.

## Quando JavaScript Pode Ser Suficiente

**Prototypes/POCs**: Quick experiments sem need for type safety.

**Small Scripts**: Simple one-off scripts com few requests.

**Learning**: Beginners might find TypeScript overhead distracting.

---

# ⚠️ Limitações

## Runtime Type Checking

TypeScript types removed at runtime - não validate actual API responses.

**Solution**: Use validation libraries (Zod, Yup) para runtime validation.

## Type Maintenance

Types must be updated quando API changes.

**Solution**: Generate types from OpenAPI specs, use code generation tools.

## Learning Curve

TypeScript adds complexity for beginners.

**Solution**: Start com basic types, gradually add advanced features.

---

# 🔗 Interconexões

## Generic API Clients

Build reusable, type-safe API clients (próximo módulo).

## Runtime Validation

Combine TypeScript types com runtime validation (advanced pattern).

## Code Generation

Generate types from OpenAPI/Swagger specs (advanced tooling).

---

# 🚀 Evolução

## Advanced Typing Patterns

Conditional types, mapped types, template literal types.

## Type Guards & Narrowing

Custom type guards para response validation.

## Utility Types

Omit, Pick, Partial para derive types from existing interfaces.

---

**Conclusão Integrada**: Axios com TypeScript provides **compile-time type safety** através de generic methods (`axios.get<T>()` types `response.data` como `T`), interfaces (`AxiosResponse<T>`, `AxiosRequestConfig`, `AxiosError<T>`), e full IDE autocomplete, catching errors BEFORE runtime (typos, wrong property access, type mismatches). Setup requires: **installation** (Axios ≥1.0 includes types, earlier versions need `@types/axios`), **tsconfig.json** configuration (strict mode recommended - `noImplicitAny`, `strictNullChecks` catch more errors), **module resolution** (ESModules via `esModuleInterop`). Core typing patterns: **response typing** via `axios.get<User>()` types `response.data: User`, **request typing** via `axios.post<User, CreateUserRequest>()` validates request body structure, **error typing** via `AxiosError<ErrorResponse>` types error.response.data, **type guards** via `axios.isAxiosError()` narrow error types. Benefits incluem: **compile-time validation** (catch typos, missing properties, wrong types antes de runtime), **IDE autocomplete** (IntelliSense shows available properties/methods), **refactoring safety** (rename properties across codebase), **self-documenting code** (types serve as inline documentation), **reduced bugs** (type mismatches caught early). Advanced patterns: **typed instances** via `AxiosInstance` interface, **custom instance interfaces** extending AxiosInstance com domain-specific methods, **generic wrappers** unwrapping API response structures, **discriminated unions** para different response types baseado em success/error status. Critical considerations: TypeScript types **removed at runtime** (não validate actual API responses - use runtime validation libraries como Zod), types require **maintenance** quando API changes (solution: generate from OpenAPI specs), **learning curve** para beginners (start com basic types, gradually add complexity). Trade-offs: initial verbosity e setup complexity vs long-term safety, maintainability, e developer experience improvements.