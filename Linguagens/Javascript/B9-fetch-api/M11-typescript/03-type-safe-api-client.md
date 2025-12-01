# Type-Safe API Client: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

Um **type-safe API client** é uma **abstraction layer** sobre **Fetch API** que combina **TypeScript generics** (`<T>`, `<TResponse, TPayload>`), **type guards** (`is` keyword, runtime validation), **interceptors** (request/response transformation), **error handling** (discriminated unions, custom errors), **retry logic** (exponential backoff, selective retry), **caching** (in-memory, TTL, invalidation), **request deduplication** (pending Map, promise reuse), **authentication** (token management, refresh flow), **timeout** (AbortController, race condition), garantindo **compile-time type safety** (IntelliSense, refactoring) + **runtime data validation** (Zod, type predicates) + **production-ready patterns** (fail-fast, defensive programming) em single reusable implementation.

Conceitualmente, vanilla **fetch()** é **low-level** → sem type safety (any), sem validation, sem error handling, sem retry, sem caching → **cada request** requer **boilerplate repetido** (timeout, error handling, JSON parsing, validation) → **DRY violation**. **Type-safe API client** encapsula **all cross-cutting concerns** em single class → **centralized configuration** (baseURL, headers, timeout) → **generic methods** (`get<T>`, `post<T, TPayload>`) → **automatic JSON parsing** → **type validation** (Zod schemas) → **interceptors** (add auth token, log requests) → **retry failed requests** → **cache responses** → **deduplicate concurrent requests** → **TypeScript compiler** valida **all property access** → **IntelliSense** autocomplete → **refactoring safety** → **production-grade** reliability.

```typescript
// Vanilla fetch (low-level, repetitive):
async function getUser(id: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch(`https://api.example.com/users/${id}`, {
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Manual validation (tedious)
    if (!isUser(data)) {
      throw new Error('Invalid user data');
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

// Type-Safe API Client (high-level, declarative):
const client = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (add auth)
client.addRequestInterceptor((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (log errors)
client.addResponseInterceptor((response) => {
  if (!response.ok) {
    console.error(`HTTP ${response.status}: ${response.url}`);
  }
  return response;
});

// Type-safe request (compile-time + runtime validation)
const user = await client.get<User>('/users/:id', { params: { id: 1 } });
// Type: User (validated)
// IntelliSense: user.id, user.name, user.email
// Automatic: timeout, auth, error handling, retry, validation

// Benefícios:
// - Type Safety: Compile-time validation (TypeScript)
// - Runtime Safety: Data validation (Zod/type guards)
// - DRY: Centralized config (no repetition)
// - Production-Ready: Retry, caching, deduplication
// - Developer Experience: IntelliSense, refactoring
```

### Contexto Histórico e Motivação

**Evolução de API Clients:**

1. **XMLHttpRequest (2006)**: Callback-based (callback hell)
2. **jQuery.ajax (2006)**: Promise-like (pre-Promise era)
3. **Fetch API (2015)**: Native browser API (Promise-based)
4. **Axios (2016)**: Popular library (interceptors, auto-JSON)
5. **TypeScript (2012+)**: Type safety (generics, type guards)
6. **Modern (2020+)**: Type-safe clients (Zod, tRPC, React Query)

**Motivação para Type-Safe Client:**

**Fetch** é **low-level** → sem **abstraction** → **cada team** implementa **own wrapper** → **inconsistent patterns** → **bugs duplicados** (timeout, retry, validation). **Type-safe client** estabelece **standard pattern** → **reusable** across projects → **tested once** → **production-proven** → **team alignment** (everyone uses same API).

**Problemas sem Type-Safe Client:**

1. **Type Safety**: Manual type assertions (unsafe)
2. **Runtime Validation**: No validation (crashes)
3. **Boilerplate**: Repetitive code (DRY violation)
4. **Error Handling**: Inconsistent patterns
5. **Production Features**: No retry, caching, deduplication
6. **Maintenance**: Scattered logic (hard to update)

### Problema Fundamental que Resolve

Type-safe client resolve:

**1. Type Safety**: Generic methods (`get<T>`) → compile-time validation
**2. Runtime Safety**: Zod schemas → runtime validation
**3. DRY**: Centralized config → no repetition
**4. Reliability**: Retry, timeout, error handling
**5. Performance**: Caching, request deduplication
**6. Scalability**: Single implementation → all requests
**7. Testability**: Mock client → unit tests
**8. Developer Experience**: IntelliSense, refactoring

### Importância no Ecossistema

Type-safe client é **critical** para:

- **Production Apps**: Reliable API communication
- **Team Projects**: Consistent patterns
- **Large Codebases**: Centralized logic
- **Type Safety**: Compile-time + runtime validation
- **Performance**: Caching, deduplication, retry
- **Maintainability**: Single source of truth

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Generic Methods**: `get<T>`, `post<T, TPayload>` (type parameters)
2. **Runtime Validation**: Zod schemas, type guards
3. **Interceptors**: Request/response transformation
4. **Error Handling**: Custom errors, discriminated unions
5. **Retry Logic**: Exponential backoff, selective retry
6. **Caching**: In-memory, TTL, invalidation
7. **Request Deduplication**: Pending Map, promise reuse
8. **Authentication**: Token management, refresh flow
9. **Timeout**: AbortController, automatic cancellation
10. **Configuration**: BaseURL, headers, defaults

### Pilares Fundamentais

- **class ApiClient**: Centralized client implementation
- **get<T>(url)**: Type-safe GET requests
- **post<T, TPayload>(url, data)**: Type-safe POST
- **Zod.parse(data)**: Runtime validation
- **Interceptors**: Transform requests/responses
- **Retry**: Exponential backoff pattern
- **Cache**: TTL-based in-memory caching
- **Deduplication**: Pending requests Map

### Visão Geral das Nuances

- **Type Parameters**: `<T>` para response, `<TPayload>` para request
- **Optional Validation**: Schema parameter (optional)
- **Discriminated Unions**: Success/error responses
- **AbortController**: Timeout implementation
- **Promise Reuse**: Deduplication pattern
- **Cache Invalidation**: On mutations (POST, PUT, DELETE)
- **Token Refresh**: Automatic retry com novo token
- **Error Hierarchy**: NetworkError, ValidationError, HttpError

---

## 🧠 Fundamentos Teóricos

### Core Implementation Structure

```typescript
// Type-Safe API Client - Complete Implementation

import { z } from 'zod';

// Configuration types
interface ApiClientConfig {
  baseURL: string;
  timeout?: number; // Default: 10000ms
  headers?: Record<string, string>;
  retry?: {
    maxAttempts?: number; // Default: 3
    delay?: number; // Default: 1000ms
    backoff?: number; // Exponential multiplier (default: 2)
  };
  cache?: {
    enabled?: boolean; // Default: true
    ttl?: number; // Default: 60000ms (1 min)
  };
}

// Request options
interface RequestOptions<TPayload = unknown> {
  params?: Record<string, string | number>; // URL params (:id)
  query?: Record<string, string | number>; // Query string (?page=1)
  headers?: Record<string, string>;
  body?: TPayload;
  signal?: AbortSignal; // External abort
  skipCache?: boolean; // Bypass cache
  skipRetry?: boolean; // Bypass retry
  schema?: z.ZodSchema; // Runtime validation
}

// Response types (discriminated union)
interface SuccessResponse<T> {
  success: true;
  data: T;
  status: number;
}

interface ErrorResponse {
  success: false;
  error: string;
  status: number;
  details?: unknown;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Custom errors
class NetworkError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(message: string, public readonly errors: z.ZodError) {
    super(message);
    this.name = 'ValidationError';
  }
}

class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// Interceptor types
type RequestInterceptor = (
  config: RequestInit & { url: string }
) => RequestInit & { url: string } | Promise<RequestInit & { url: string }>;

type ResponseInterceptor = (
  response: Response
) => Response | Promise<Response>;

// API Client Class
class ApiClient {
  private config: Required<ApiClientConfig>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  constructor(config: ApiClientConfig) {
    this.config = {
      baseURL: config.baseURL,
      timeout: config.timeout ?? 10000,
      headers: config.headers ?? {},
      retry: {
        maxAttempts: config.retry?.maxAttempts ?? 3,
        delay: config.retry?.delay ?? 1000,
        backoff: config.retry?.backoff ?? 2
      },
      cache: {
        enabled: config.cache?.enabled ?? true,
        ttl: config.cache?.ttl ?? 60000
      }
    };
  }

  // Interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Generic request method (internal)
  private async request<T>(
    method: string,
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    // Build URL
    const fullUrl = this.buildUrl(url, options.params, options.query);
    
    // Cache key
    const cacheKey = `${method}:${fullUrl}`;
    
    // Check cache (GET only)
    if (method === 'GET' && !options.skipCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }
    
    // Check pending requests (deduplication)
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }
    
    // Create promise
    const promise = this.executeRequest<T>(method, fullUrl, options);
    
    // Store pending
    this.pendingRequests.set(cacheKey, promise);
    
    try {
      const result = await promise;
      
      // Cache result (GET only)
      if (method === 'GET' && !options.skipCache) {
        this.saveToCache(cacheKey, result);
      }
      
      // Invalidate cache on mutations
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        this.invalidateCache();
      }
      
      return result;
    } finally {
      // Remove pending
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Execute request with retry
  private async executeRequest<T>(
    method: string,
    url: string,
    options: RequestOptions
  ): Promise<T> {
    const maxAttempts = options.skipRetry ? 1 : this.config.retry.maxAttempts;
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.executeSingleRequest<T>(method, url, options);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on validation errors or 4xx errors
        if (
          error instanceof ValidationError ||
          (error instanceof HttpError && error.status < 500)
        ) {
          throw error;
        }
        
        // Last attempt
        if (attempt === maxAttempts) {
          throw error;
        }
        
        // Exponential backoff
        const delay = this.config.retry.delay * Math.pow(this.config.retry.backoff, attempt - 1);
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  // Execute single request
  private async executeSingleRequest<T>(
    method: string,
    url: string,
    options: RequestOptions
  ): Promise<T> {
    // Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      // Build request config
      let requestConfig: RequestInit & { url: string } = {
        method,
        url,
        headers: {
          ...this.config.headers,
          ...options.headers
        },
        signal: options.signal ?? controller.signal
      };
      
      // Add body (POST, PUT, PATCH)
      if (options.body !== undefined) {
        requestConfig.body = JSON.stringify(options.body);
        requestConfig.headers['Content-Type'] = 'application/json';
      }
      
      // Apply request interceptors
      for (const interceptor of this.requestInterceptors) {
        requestConfig = await interceptor(requestConfig);
      }
      
      // Execute fetch
      let response = await fetch(requestConfig.url, requestConfig);
      
      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }
      
      // Parse JSON
      const data: unknown = await response.json();
      
      // Validate with schema (if provided)
      if (options.schema) {
        const result = options.schema.safeParse(data);
        if (!result.success) {
          throw new ValidationError('Response validation failed', result.error);
        }
        return result.data as T;
      }
      
      return data as T;
    } catch (error) {
      // Handle timeout
      if (error instanceof Error && error.name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }
      
      // Network errors
      if (error instanceof TypeError) {
        throw new NetworkError('Network error', error);
      }
      
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Public methods
  async get<T>(url: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('GET', url, options);
  }

  async post<T, TPayload = unknown>(
    url: string,
    data: TPayload,
    options?: Omit<RequestOptions<TPayload>, 'body'>
  ): Promise<T> {
    return this.request<T>('POST', url, { ...options, body: data });
  }

  async put<T, TPayload = unknown>(
    url: string,
    data: TPayload,
    options?: Omit<RequestOptions<TPayload>, 'body'>
  ): Promise<T> {
    return this.request<T>('PUT', url, { ...options, body: data });
  }

  async patch<T, TPayload = unknown>(
    url: string,
    data: TPayload,
    options?: Omit<RequestOptions<TPayload>, 'body'>
  ): Promise<T> {
    return this.request<T>('PATCH', url, { ...options, body: data });
  }

  async delete<T = void>(url: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('DELETE', url, options);
  }

  // Helper methods
  private buildUrl(
    url: string,
    params?: Record<string, string | number>,
    query?: Record<string, string | number>
  ): string {
    let fullUrl = this.config.baseURL + url;
    
    // Replace path params (:id)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        fullUrl = fullUrl.replace(`:${key}`, String(value));
      });
    }
    
    // Add query string
    if (query) {
      const queryString = new URLSearchParams(
        Object.entries(query).map(([k, v]) => [k, String(v)])
      ).toString();
      fullUrl += `?${queryString}`;
    }
    
    return fullUrl;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.config.cache.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  private saveToCache(key: string, data: unknown): void {
    if (!this.config.cache.enabled) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private invalidateCache(): void {
    this.cache.clear();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export
export { ApiClient, type ApiClientConfig, type RequestOptions };
```

### Usage Examples

```typescript
// 1. Basic Setup
const client = new ApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. GET Request (type-safe)
interface User {
  id: number;
  name: string;
  email: string;
}

const user = await client.get<User>('/users/:id', {
  params: { id: 1 }
});
// Type: User
// IntelliSense: user.id, user.name, user.email

// 3. POST Request (type-safe payload)
interface CreateUserPayload {
  name: string;
  email: string;
}

const newUser = await client.post<User, CreateUserPayload>(
  '/users',
  {
    name: 'Alice',
    email: 'alice@example.com'
  }
);
// Type: User

// 4. With Zod Validation
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email()
});

const validatedUser = await client.get<User>('/users/:id', {
  params: { id: 1 },
  schema: UserSchema // Runtime validation
});
// Type: User (compile-time + runtime validated)

// 5. Request Interceptor (auth)
client.addRequestInterceptor((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 6. Response Interceptor (logging)
client.addResponseInterceptor((response) => {
  console.log(`${response.status} ${response.url}`);
  return response;
});

// 7. Query Parameters
const users = await client.get<User[]>('/users', {
  query: { page: 1, limit: 10 }
});
// URL: /users?page=1&limit=10

// 8. Error Handling
try {
  const user = await client.get<User>('/users/:id', {
    params: { id: 999 }
  });
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`HTTP ${error.status}: ${error.message}`);
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.errors);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}

// 9. Caching (automatic)
const user1 = await client.get<User>('/users/:id', { params: { id: 1 } });
// Cache miss → fetch from API

const user2 = await client.get<User>('/users/:id', { params: { id: 1 } });
// Cache hit → return cached (no fetch)

// 10. Request Deduplication (automatic)
const [user1, user2, user3] = await Promise.all([
  client.get<User>('/users/:id', { params: { id: 1 } }),
  client.get<User>('/users/:id', { params: { id: 1 } }),
  client.get<User>('/users/:id', { params: { id: 1 } })
]);
// Only 1 fetch (promises reused)
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Authentication Flow

```typescript
// Token refresh interceptor

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

client.addRequestInterceptor(async (config) => {
  // Get token
  let token = localStorage.getItem('token');
  
  // Check expiration
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    // Token expired → refresh
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken();
    }
    
    token = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

async function refreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('https://api.example.com/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  const data = await response.json();
  
  localStorage.setItem('token', data.token);
  localStorage.setItem('tokenExpiry', String(Date.now() + data.expiresIn));
  
  return data.token;
}
```

### Pattern 2: Pagination

```typescript
// Paginated responses

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

async function getAllUsers(): Promise<User[]> {
  const allUsers: User[] = [];
  let page = 1;
  
  while (true) {
    const response = await client.get<PaginatedResponse<User>>('/users', {
      query: { page, limit: 100 }
    });
    
    allUsers.push(...response.data);
    
    if (page >= response.totalPages) {
      break;
    }
    
    page++;
  }
  
  return allUsers;
}
```

### Pattern 3: File Upload

```typescript
// Multipart form data

async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('https://api.example.com/upload', {
    method: 'POST',
    body: formData
    // NO Content-Type header (browser sets multipart/form-data)
  });
  
  return response.json();
}

// With progress
async function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Network error'));
    });
    
    const formData = new FormData();
    formData.append('file', file);
    
    xhr.open('POST', 'https://api.example.com/upload');
    xhr.send(formData);
  });
}
```

### Pattern 4: Batch Requests

```typescript
// Batch multiple requests

interface BatchRequest {
  method: string;
  url: string;
  body?: unknown;
}

interface BatchResponse<T> {
  id: string;
  status: number;
  data: T;
}

async function batchRequests<T>(
  requests: BatchRequest[]
): Promise<BatchResponse<T>[]> {
  const response = await client.post<BatchResponse<T>[]>(
    '/batch',
    { requests }
  );
  
  return response;
}

// Usage:
const results = await batchRequests([
  { method: 'GET', url: '/users/1' },
  { method: 'GET', url: '/users/2' },
  { method: 'POST', url: '/users', body: { name: 'Alice' } }
]);
```

### Pattern 5: WebSocket Integration

```typescript
// Real-time updates com WebSocket + REST fallback

class RealtimeClient {
  private ws: WebSocket | null = null;
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket('wss://api.example.com/ws');
      
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', reject);
    });
  }
  
  subscribe<T>(channel: string, callback: (data: T) => void): void {
    if (!this.ws) {
      throw new Error('WebSocket not connected');
    }
    
    this.ws.send(JSON.stringify({ type: 'subscribe', channel }));
    
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.channel === channel) {
        callback(message.data);
      }
    });
  }
  
  async send<T>(channel: string, data: unknown): Promise<T> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Send via WebSocket
      this.ws.send(JSON.stringify({ type: 'message', channel, data }));
      
      // Wait for response
      return new Promise((resolve, reject) => {
        const handler = (event: MessageEvent) => {
          const message = JSON.parse(event.data);
          if (message.channel === channel && message.type === 'response') {
            this.ws!.removeEventListener('message', handler);
            resolve(message.data);
          }
        };
        
        this.ws!.addEventListener('message', handler);
        
        setTimeout(() => {
          this.ws!.removeEventListener('message', handler);
          reject(new Error('WebSocket timeout'));
        }, 5000);
      });
    } else {
      // Fallback to REST
      return this.apiClient.post<T>(`/channels/${channel}`, data);
    }
  }
}
```

### Pattern 6: GraphQL Integration

```typescript
// GraphQL client wrapper

interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    path?: string[];
  }>;
}

class GraphQLClient {
  constructor(private apiClient: ApiClient) {}
  
  async query<T>(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<T> {
    const response = await this.apiClient.post<GraphQLResponse<T>>(
      '/graphql',
      { query, variables }
    );
    
    if (response.errors) {
      throw new Error(
        response.errors.map(e => e.message).join(', ')
      );
    }
    
    if (!response.data) {
      throw new Error('No data in GraphQL response');
    }
    
    return response.data;
  }
}

// Usage:
const gqlClient = new GraphQLClient(client);

interface User {
  id: string;
  name: string;
  email: string;
}

const user = await gqlClient.query<{ user: User }>(
  `
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
        email
      }
    }
  `,
  { id: '1' }
);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Type-Safe API Client

**✅ Production Apps**: Reliability, retry, caching
**✅ Team Projects**: Consistent patterns
**✅ Large Codebases**: Centralized logic
**✅ Type Safety**: Compile-time + runtime validation
**✅ Complex Features**: Auth, pagination, uploads

### Quando NÃO Usar

**❌ Simple Scripts**: Overkill para single request
**❌ Static Sites**: No dynamic API calls
**❌ Server-Side Only**: Use native fetch (Node.js)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitação 1: Bundle Size

Client aumenta bundle (~5-10 KB).

### Limitação 2: Learning Curve

Team precisa entender interceptors, generics.

### Limitação 3: Debugging

Abstraction pode dificultar debugging (use logs).

---

## 🔗 Interconexões Conceituais

### Relação com React Query

**React Query** adiciona **server state management** (stale-while-revalidate, optimistic updates).

### Relação com tRPC

**tRPC** fornece **end-to-end type safety** (backend types → frontend).

### Relação com Axios

**Axios** é similar (interceptors, auto-JSON), mas sem TypeScript generics built-in.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **React Integration**: Hooks (useQuery, useMutation)
2. **Vue Integration**: Composables (useApi)
3. **SSR**: Server-side rendering com fetch

---

## 📚 Conclusão

Type-safe API client combina **all patterns** em **production-ready implementation**.

Dominar significa:
- **Generics**: Type-safe methods
- **Validation**: Zod integration
- **Interceptors**: Request/response transformation
- **Retry**: Exponential backoff
- **Caching**: TTL-based storage
- **Deduplication**: Pending requests Map
- **Error Handling**: Custom error classes

É **essential** para **production apps**, **team consistency**, e **maintainable codebases**.
