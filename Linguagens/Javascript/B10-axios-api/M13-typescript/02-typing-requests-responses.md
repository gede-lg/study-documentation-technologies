# 🎯 Introdução

**Typing Requests and Responses** em Axios com TypeScript envolve definir **explicit type contracts** para request bodies, response data, query parameters, headers, e error responses, ensuring compile-time validation de data structures, preventing runtime errors caused por API contract mismatches, e enabling self-documenting code through type definitions que serve como inline API documentation.

O problema fundamental é **API contract enforcement**: APIs have implicit contracts (expected request structure, guaranteed response structure, possible error formats), mas JavaScript Axios não enforces them - you can send wrong data, access non-existent properties, mishandle errors. TypeScript makes contracts **explicit e enforced** através de interfaces e generic types, catching violations at compile-time.

Request typing patterns incluem: **request body interfaces** (`CreateUserRequest`, `UpdateUserRequest` defining required/optional fields), **query parameter types** (`SearchParams` interface para type-safe URL parameters), **request header types** (`CustomHeaders` interface para required authentication/metadata headers), **form data types** (typing multipart/form-data structures). Response typing patterns incluem: **response data interfaces** (`User`, `Product` defining shape de response.data), **paginated response types** (`PaginatedResponse<T>` wrapping arrays com metadata), **union response types** (different shapes baseado em success/error), **nested data structures** (typing complex nested objects).

Critical considerations: **API versioning** (different endpoints may return different structures - v1 vs v2), **optional vs required fields** (strict APIs vs flexible APIs), **null vs undefined** (backend pode return null, TypeScript prefers undefined), **date serialization** (APIs return strings, TypeScript expects Dates - requires transformation), **enum vs literal types** (status: 'active' | 'inactive' vs enum Status).

Error typing patterns: **discriminated error unions** (different error types baseado em status code or error.type), **error response interfaces** (ValidationError com fields, AuthError com message), **error code enums** (type-safe error code checking), **type guards** para error narrowing. Advanced patterns: **generics para reusable types** (`ApiResponse<T>`, `PaginatedList<T>`), **utility types** (Omit, Pick, Partial para derive types), **conditional types** (different response types baseado em request), **branded types** para ID validation.

Este módulo explora comprehensive request/response typing: desde basic interfaces para simple CRUD operations, através de complex patterns (pagination, discriminated unions, nested structures), até advanced techniques (runtime validation integration, type transformations, branded types, type-safe API clients). Objetivo é fornecer complete toolkit para building robust, type-safe Axios applications.

---

# 📋 Sumário

### **Request Body Typing**
- Interface definitions
- Required vs optional fields
- Nested request objects
- Type validation

### **Response Data Typing**
- Simple interfaces
- Array responses
- Nested objects
- Union types

### **Query Parameters Typing**
- SearchParams interfaces
- Optional parameters
- Type-safe filters
- Pagination types

### **Header Typing**
- Custom headers
- Authentication headers
- Content negotiation
- CORS headers

### **Paginated Responses**
- Generic pagination types
- Metadata typing
- Cursor-based pagination
- Offset-based pagination

### **Error Response Typing**
- Error interfaces
- Discriminated errors
- Validation errors
- Error code enums

### **Complex Structures**
- Deeply nested objects
- Recursive types
- Self-referential types
- Graph structures

### **Type Transformations**
- Date serialization
- Enum mapping
- Null handling
- Camel/snake case conversion

---

# 🧠 Fundamentos

## Request Body Typing

### **Interface Definitions**

**Simple request interface**:

```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

// Type-safe request
await axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  email: 'alice@example.com',
  age: 25
});

// ❌ Compile error: Property 'age' is missing
await axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  email: 'alice@example.com'
});
```

### **Required vs Optional Fields**

**Optional properties**:

```typescript
interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
}

// All valid
await axios.put<User, UpdateUserRequest>('/users/1', { name: 'Alice' });
await axios.put<User, UpdateUserRequest>('/users/1', { email: 'new@example.com' });
await axios.put<User, UpdateUserRequest>('/users/1', { name: 'Alice', age: 26 });
```

**Partial utility type**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<User> makes all fields optional
type UpdateUserRequest = Partial<Omit<User, 'id'>>;

const updateData: UpdateUserRequest = {
  name: 'Alice'
}; // Valid
```

### **Nested Request Objects**

**Complex request structures**:

```typescript
interface Address {
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
  address: Address;
  preferences?: {
    newsletter: boolean;
    theme: 'light' | 'dark';
  };
}

await axios.post<User, CreateUserRequest>('/users', {
  name: 'Alice',
  email: 'alice@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA',
    zipCode: '10001'
  },
  preferences: {
    newsletter: true,
    theme: 'dark'
  }
});
```

### **Type Validation**

**Literal types** para constants:

```typescript
interface CreatePostRequest {
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
}

// ✅ Valid
await axios.post<Post, CreatePostRequest>('/posts', {
  title: 'My Post',
  content: 'Content...',
  status: 'draft',
  visibility: 'public'
});

// ❌ Compile error: Type '"pending"' is not assignable to type '"draft" | "published" | "archived"'
await axios.post<Post, CreatePostRequest>('/posts', {
  title: 'My Post',
  content: 'Content...',
  status: 'pending', // Invalid status
  visibility: 'public'
});
```

## Response Data Typing

### **Simple Interfaces**

**Basic response**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const response = await axios.get<User>('/users/1');

// response.data: User
console.log(response.data.id);
console.log(response.data.name);
console.log(response.data.email);
```

### **Array Responses**

**List responses**:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await axios.get<User[]>('/users');

// response.data: User[]
response.data.forEach(user => {
  console.log(user.name);
});

// Array methods type-safe
const userNames = response.data.map(u => u.name); // string[]
const adults = response.data.filter(u => u.age >= 18); // User[]
```

### **Nested Objects**

**Complex response structures**:

```typescript
interface Address {
  street: string;
  city: string;
  country: string;
}

interface Company {
  name: string;
  industry: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  address: Address;
  company: Company;
  tags: string[];
}

const response = await axios.get<User>('/users/1');

// Nested access type-safe
console.log(response.data.address.city);
console.log(response.data.company.name);
console.log(response.data.tags[0]);
```

### **Union Types**

**Different response shapes**:

```typescript
interface SuccessResponse {
  success: true;
  data: User;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const response = await axios.get<ApiResponse>('/users/1');

// Type narrowing
if (response.data.success) {
  console.log(response.data.data.name); // SuccessResponse
} else {
  console.log(response.data.error); // ErrorResponse
}
```

**Discriminated unions**:

```typescript
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

const response = await axios.get<ApiResponse<User>>('/users/1');

switch (response.data.status) {
  case 'success':
    console.log(response.data.data.name);
    break;
  case 'error':
    console.log(response.data.error);
    break;
  case 'loading':
    console.log('Loading...');
    break;
}
```

## Query Parameters Typing

### **SearchParams Interfaces**

**Type-safe query params**:

```typescript
interface UserSearchParams {
  page: number;
  limit: number;
  sort?: 'name' | 'email' | 'createdAt';
  order?: 'asc' | 'desc';
  role?: 'admin' | 'user' | 'moderator';
}

const params: UserSearchParams = {
  page: 1,
  limit: 10,
  sort: 'name',
  order: 'asc'
};

const response = await axios.get<User[]>('/users', { params });
```

### **Optional Parameters**

**Flexible search**:

```typescript
interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// All valid
await axios.get<Product[]>('/products', { params: { query: 'laptop' } });
await axios.get<Product[]>('/products', { params: { category: 'electronics', inStock: true } });
await axios.get<Product[]>('/products', { params: { minPrice: 100, maxPrice: 500 } });
```

### **Type-Safe Filters**

**Complex filtering**:

```typescript
interface DateRange {
  start: string; // ISO date
  end: string;
}

interface UserFilters {
  status?: 'active' | 'inactive' | 'banned';
  role?: 'admin' | 'user' | 'moderator';
  createdAt?: DateRange;
  tags?: string[];
}

const filters: UserFilters = {
  status: 'active',
  role: 'user',
  createdAt: {
    start: '2024-01-01',
    end: '2024-12-31'
  },
  tags: ['premium', 'verified']
};

await axios.get<User[]>('/users', { params: filters });
```

### **Pagination Types**

**Offset pagination**:

```typescript
interface OffsetPagination {
  offset: number;
  limit: number;
}

const params: OffsetPagination = {
  offset: 0,
  limit: 20
};

await axios.get<User[]>('/users', { params });
```

**Page-based pagination**:

```typescript
interface PagePagination {
  page: number;
  pageSize: number;
}

const params: PagePagination = {
  page: 1,
  pageSize: 20
};

await axios.get<User[]>('/users', { params });
```

## Header Typing

### **Custom Headers**

**Type-safe headers**:

```typescript
interface ApiHeaders {
  'Authorization': string;
  'X-Api-Key': string;
  'X-Request-ID': string;
}

const headers: ApiHeaders = {
  'Authorization': 'Bearer token123',
  'X-Api-Key': 'key456',
  'X-Request-ID': 'req-789'
};

await axios.get<User>('/users/1', { headers });
```

### **Authentication Headers**

**Auth header types**:

```typescript
interface BearerAuthHeaders {
  'Authorization': `Bearer ${string}`;
}

interface BasicAuthHeaders {
  'Authorization': `Basic ${string}`;
}

type AuthHeaders = BearerAuthHeaders | BasicAuthHeaders;

const bearerHeaders: BearerAuthHeaders = {
  'Authorization': 'Bearer token123'
};

const basicHeaders: BasicAuthHeaders = {
  'Authorization': 'Basic dXNlcjpwYXNz'
};
```

### **Content Negotiation**

**Content-Type headers**:

```typescript
interface ContentHeaders {
  'Content-Type': 
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'
    | 'text/plain';
  'Accept': 
    | 'application/json'
    | 'application/xml'
    | 'text/html';
}

const headers: ContentHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

await axios.post<User>('/users', data, { headers });
```

### **CORS Headers**

**CORS-related headers**:

```typescript
interface CorsHeaders {
  'Origin': string;
  'Access-Control-Request-Method'?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  'Access-Control-Request-Headers'?: string;
}

const headers: CorsHeaders = {
  'Origin': 'https://example.com',
  'Access-Control-Request-Method': 'POST'
};
```

## Paginated Responses

### **Generic Pagination Types**

**Reusable pagination wrapper**:

```typescript
interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Use with any type
const usersResponse = await axios.get<PaginatedResponse<User>>('/users');
const productsResponse = await axios.get<PaginatedResponse<Product>>('/products');

// Type-safe access
usersResponse.data.items.forEach(user => {
  console.log(user.name);
});

console.log(`Page ${usersResponse.data.page} of ${usersResponse.data.totalPages}`);
```

### **Metadata Typing**

**Pagination metadata**:

```typescript
interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

const response = await axios.get<PaginatedResponse<User>>('/users');

// Type-safe metadata access
if (response.data.meta.hasNextPage) {
  console.log('More pages available');
}
```

### **Cursor-Based Pagination**

**Cursor pagination**:

```typescript
interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasMore: boolean;
}

const response = await axios.get<CursorPaginatedResponse<User>>('/users', {
  params: { cursor: 'abc123', limit: 20 }
});

// Fetch next page
if (response.data.nextCursor) {
  const nextPage = await axios.get<CursorPaginatedResponse<User>>('/users', {
    params: { cursor: response.data.nextCursor, limit: 20 }
  });
}
```

### **Offset-Based Pagination**

**Offset/limit pagination**:

```typescript
interface OffsetPaginatedResponse<T> {
  items: T[];
  offset: number;
  limit: number;
  total: number;
}

const response = await axios.get<OffsetPaginatedResponse<User>>('/users', {
  params: { offset: 0, limit: 20 }
});

// Calculate pages
const totalPages = Math.ceil(response.data.total / response.data.limit);
```

## Error Response Typing

### **Error Interfaces**

**Basic error response**:

```typescript
interface ErrorResponse {
  message: string;
  code: string;
  timestamp: string;
}

try {
  await axios.get<User>('/users/1');
} catch (error) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    console.log(error.response?.data.message);
    console.log(error.response?.data.code);
  }
}
```

### **Discriminated Errors**

**Different error types**:

```typescript
interface ValidationError {
  type: 'validation';
  message: string;
  fields: Record<string, string[]>;
}

interface AuthenticationError {
  type: 'authentication';
  message: string;
  requiredPermissions: string[];
}

interface NotFoundError {
  type: 'not_found';
  message: string;
  resource: string;
}

type ApiError = ValidationError | AuthenticationError | NotFoundError;

try {
  await axios.post<User>('/users', {});
} catch (error) {
  if (axios.isAxiosError<ApiError>(error)) {
    const errorData = error.response?.data;
    
    if (errorData?.type === 'validation') {
      console.log('Validation errors:', errorData.fields);
    } else if (errorData?.type === 'authentication') {
      console.log('Auth error:', errorData.requiredPermissions);
    } else if (errorData?.type === 'not_found') {
      console.log('Not found:', errorData.resource);
    }
  }
}
```

### **Validation Errors**

**Field validation errors**:

```typescript
interface FieldError {
  field: string;
  message: string;
  code: string;
}

interface ValidationErrorResponse {
  message: string;
  errors: FieldError[];
}

try {
  await axios.post<User>('/users', { name: '' });
} catch (error) {
  if (axios.isAxiosError<ValidationErrorResponse>(error)) {
    error.response?.data.errors.forEach(err => {
      console.log(`${err.field}: ${err.message}`);
    });
  }
}
```

### **Error Code Enums**

**Type-safe error codes**:

```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

interface ErrorResponse {
  message: string;
  code: ErrorCode;
}

try {
  await axios.get<User>('/users/1');
} catch (error) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    const code = error.response?.data.code;
    
    switch (code) {
      case ErrorCode.VALIDATION_ERROR:
        console.log('Validation error');
        break;
      case ErrorCode.UNAUTHORIZED:
        console.log('Unauthorized');
        break;
      case ErrorCode.NOT_FOUND:
        console.log('Not found');
        break;
    }
  }
}
```

## Complex Structures

### **Deeply Nested Objects**

**Multi-level nesting**:

```typescript
interface Country {
  code: string;
  name: string;
}

interface City {
  id: number;
  name: string;
  country: Country;
}

interface Address {
  street: string;
  city: City;
  zipCode: string;
}

interface Company {
  id: number;
  name: string;
  address: Address;
}

interface User {
  id: number;
  name: string;
  company: Company;
}

const response = await axios.get<User>('/users/1');

// Type-safe deeply nested access
console.log(response.data.company.address.city.country.name);
```

### **Recursive Types**

**Self-referential structures**:

```typescript
interface Comment {
  id: number;
  content: string;
  author: string;
  replies: Comment[]; // Recursive
}

const response = await axios.get<Comment[]>('/posts/1/comments');

// Recursive access
response.data.forEach(comment => {
  console.log(comment.content);
  
  comment.replies.forEach(reply => {
    console.log('  -', reply.content);
    
    reply.replies.forEach(nestedReply => {
      console.log('    -', nestedReply.content);
    });
  });
});
```

### **Self-Referential Types**

**Tree structures**:

```typescript
interface Category {
  id: number;
  name: string;
  parent?: Category;
  children: Category[];
}

const response = await axios.get<Category[]>('/categories');

// Navigate tree
const findCategoryById = (categories: Category[], id: number): Category | undefined => {
  for (const category of categories) {
    if (category.id === id) return category;
    
    const found = findCategoryById(category.children, id);
    if (found) return found;
  }
};
```

### **Graph Structures**

**Many-to-many relationships**:

```typescript
interface User {
  id: number;
  name: string;
  friends: User[];
  posts: Post[];
}

interface Post {
  id: number;
  content: string;
  author: User;
  likes: User[];
}

const response = await axios.get<User>('/users/1');

// Type-safe graph navigation
response.data.friends.forEach(friend => {
  friend.posts.forEach(post => {
    console.log(`${friend.name} posted: ${post.content}`);
  });
});
```

## Type Transformations

### **Date Serialization**

**String to Date transformation**:

```typescript
interface UserDto {
  id: number;
  name: string;
  createdAt: string; // API returns string
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  createdAt: Date; // Application uses Date
  updatedAt: Date;
}

const transformUser = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt)
});

const response = await axios.get<UserDto>('/users/1');
const user = transformUser(response.data);

console.log(user.createdAt.toISOString());
```

### **Enum Mapping**

**String to Enum**:

```typescript
enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Moderator = 'MODERATOR'
}

interface UserDto {
  id: number;
  name: string;
  role: string; // API returns string
}

interface User {
  id: number;
  name: string;
  role: UserRole; // Application uses enum
}

const transformUser = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  role: dto.role as UserRole
});
```

### **Null Handling**

**Null to undefined conversion**:

```typescript
interface UserDto {
  id: number;
  name: string;
  email: string | null; // API uses null
}

interface User {
  id: number;
  name: string;
  email?: string; // Application uses undefined
}

const transformUser = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  ...(dto.email !== null && { email: dto.email })
});
```

### **Camel/Snake Case Conversion**

**Case transformation**:

```typescript
interface UserDtoSnake {
  user_id: number;
  user_name: string;
  email_address: string;
  created_at: string;
}

interface User {
  userId: number;
  userName: string;
  emailAddress: string;
  createdAt: Date;
}

const transformUser = (dto: UserDtoSnake): User => ({
  userId: dto.user_id,
  userName: dto.user_name,
  emailAddress: dto.email_address,
  createdAt: new Date(dto.created_at)
});

const response = await axios.get<UserDtoSnake>('/users/1');
const user = transformUser(response.data);
```

**Generic camelCase converter**:

```typescript
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>;

type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};

// Usage
interface UserDtoSnake {
  user_id: number;
  user_name: string;
}

type User = CamelCaseKeys<UserDtoSnake>;
// { userId: number; userName: string; }
```

---

# 🎯 Aplicabilidade

## Quando Aplicar Comprehensive Typing

**Production Applications**: Type safety crucial para stability.

**Team Projects**: Types serve as contracts between developers.

**Complex APIs**: Many endpoints, complex structures benefit from types.

**Long-Term Maintenance**: Types reduce refactoring risks.

## Trade-offs

**Initial Overhead**: Defining types takes time.

**Maintenance**: Types require updates quando API changes.

**Learning Curve**: Complex typing patterns require TypeScript expertise.

---

# ⚠️ Limitações

## Runtime Validation

TypeScript types não validate actual API responses at runtime.

**Solution**: Use runtime validation libraries (Zod, io-ts, Yup).

## API Changes

Backend changes pode break frontend types silently.

**Solution**: Generate types from OpenAPI specs, integration tests.

## Type Complexity

Complex types pode become hard to read/maintain.

**Solution**: Break into smaller interfaces, use utility types.

---

# 🔗 Interconexões

## Generic API Clients

Reusable types across multiple API clients (próximo módulo).

## Runtime Validation

Combine TypeScript types com Zod/io-ts validation (advanced pattern).

## Code Generation

Generate types from OpenAPI/GraphQL schemas automatically.

---

# 🚀 Evolução

## Branded Types

Type-safe IDs preventing mixing different entity IDs.

## Template Literal Types

Dynamic types baseado em string patterns.

## Conditional Types

Different response types baseado em request parameters.

---

**Conclusão Integrada**: Typing requests and responses em Axios com TypeScript provides **explicit API contracts** através de interfaces defining request bodies (`CreateUserRequest`, `UpdateUserRequest` com required/optional fields), response data structures (`User`, `Product` com nested objects), query parameters (`SearchParams` com filters/pagination), headers (`AuthHeaders`, `ContentHeaders`), e error responses (`ErrorResponse`, `ValidationError`). Core patterns incluem: **request typing** via generic `axios.post<ResponseType, RequestType>()` validating request body structure at compile-time (catches missing fields, wrong types, invalid literals), **response typing** via `axios.get<ResponseType>()` typing response.data shape (enables autocomplete, prevents property access errors), **query parameter typing** via params interfaces ensuring type-safe URL parameters (page numbers, sort orders, filters), **header typing** via custom header interfaces enforcing required authentication/metadata headers. Advanced patterns: **paginated responses** via generic `PaginatedResponse<T>` wrapper typing items array + metadata (page, total, hasNextPage), **discriminated unions** para different response shapes baseado em success/error (type narrowing via if/switch), **error typing** via `AxiosError<ErrorResponse>` typing error.response.data structure (ValidationError com fields, AuthError com permissions), **complex structures** via deeply nested interfaces, recursive types para tree structures (Comment com replies: Comment[]), self-referential types para graphs. Type transformations handle API/application mismatches: **date serialization** (API returns strings, application uses Dates - transform via new Date()), **enum mapping** (string to enum conversion), **null handling** (API uses null, TypeScript prefers undefined), **case conversion** (snake_case to camelCase transformation). Critical considerations: TypeScript types **removed at runtime** (não validate actual responses - combine com Zod/io-ts validation), types require **maintenance** quando API changes (generate from OpenAPI specs), **optional vs required fields** (use ? para optional, handle undefined/null properly), **union types** para different response shapes (discriminated unions enable type narrowing). Best practices: define separate DTO interfaces para API responses (UserDto) vs domain models (User), use generic wrappers para reusable patterns (PaginatedResponse<T>, ApiResponse<T>), leverage utility types (Partial, Omit, Pick) para derive related types, type errors comprehensively (different interfaces para different error scenarios).