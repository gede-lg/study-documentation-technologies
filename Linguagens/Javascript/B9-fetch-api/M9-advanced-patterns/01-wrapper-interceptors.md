# Wrapper Functions e Interceptors: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Wrapper functions** são **funções que encapsulam fetch()** adicionando **comportamentos cross-cutting** (autenticação, logging, error handling, transformações) de forma **centralizada e reutilizável**, evitando **duplicação de lógica** em cada request. **Interceptors** (conceito de Axios) são **hooks** que executam **antes de requests** (request interceptors - adicionar headers, transformar body) ou **depois de responses** (response interceptors - transformar data, handle errors), permitindo **pipeline de processamento** modular. Fetch API **não tem interceptors nativos**, então **wrapper functions** implementam padrão similar via **função customizada** que chama `fetch()` internamente, aplicando **pre/post processing**.

Conceitualmente, wrappers criam **abstraction layer** sobre fetch: **client code** chama wrapper (`api.get()`), wrapper aplica **common logic** (auth headers, base URL, error handling), chama `fetch()`, processa response, retorna **transformed data**. **Benefícios**: **DRY** (Don't Repeat Yourself), **centralized configuration** (base URL, headers), **consistent error handling**, **automatic retries**, **logging/monitoring**. Wrapper pode ser **simple function** (`apiFetch()`) ou **class-based** (`ApiClient`) com métodos (`get()`, `post()`).

```javascript
// Wrapper Básico:
async function apiFetch(endpoint, options = {}) {
  const baseURL = 'https://api.example.com';
  const token = localStorage.getItem('authToken');
  
  // Request interceptor (pre-processing)
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  };
  
  // Fetch
  const response = await fetch(`${baseURL}${endpoint}`, config);
  
  // Response interceptor (post-processing)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  return data;
}

// Uso (sem duplicação de auth logic):
const users = await apiFetch('/users');
const posts = await apiFetch('/posts');

// Class-Based Wrapper:
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
  
  async request(endpoint, options) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
}

// Uso:
const api = new ApiClient('https://api.example.com');

const users = await api.get('/users');
const newPost = await api.post('/posts', { title: 'Post', content: '...' });
```

### Contexto Histórico e Motivação

**Evolução de HTTP Clients:**

1. **XMLHttpRequest (2006)**: Manual setup, repetitive code
2. **jQuery.ajax (2006)**: Wrapper simplificado, global config
3. **Axios (2014)**: Interceptors, automatic JSON, defaults
4. **Fetch API (2015)**: Native, Promise-based (sem wrappers built-in)
5. **Modern (2020+)**: Custom wrappers, Axios-like patterns

**Motivação para Wrappers:**

**Fetch API** é **low-level**: cada request requer **manual setup** (headers, error handling, base URL concatenation). Em aplicações reais, **common patterns** emergem: autenticação via tokens, JSON requests/responses, error handling consistente, base URL. **Wrappers** centralizam essa lógica: **write once, use everywhere**. **Axios** popularizou **interceptors** (pre/post processing hooks) - wrappers replicam padrão para Fetch.

### Problema Fundamental que Resolve

Wrappers e interceptors resolvem:

**1. Code Duplication**: Evitar repetir auth, headers, base URL em cada request
**2. Centralized Config**: Base URL, default headers, timeout em single place
**3. Consistent Error Handling**: Unified error handling/logging
**4. Cross-Cutting Concerns**: Auth, logging, monitoring sem poluir business logic
**5. Maintainability**: Mudanças em auth/headers em single function (não em 100 requests)

### Importância no Ecossistema

Wrappers são **padrão essencial** para:

- **SPAs**: Centenas de API calls (DRY critical)
- **Authentication**: Token management centralizado
- **Error Handling**: Unified 401 handling (refresh token), logging
- **Monitoring**: Centralized request/response logging
- **Testing**: Mocking single wrapper (vs 100 fetch calls)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Wrapper Function**: Encapsula fetch() com common logic
2. **Request Interceptor**: Pre-processing (headers, transformations)
3. **Response Interceptor**: Post-processing (data transform, error handling)
4. **Centralized Config**: Base URL, default headers
5. **DRY Principle**: Don't Repeat Yourself

### Pilares Fundamentais

- **apiFetch(endpoint, options)**: Wrapper function básico
- **Base URL**: Concatenar automaticamente
- **Default Headers**: Content-Type, Authorization
- **Error Handling**: response.ok check centralizado
- **JSON Parsing**: await response.json() centralizado
- **Class-Based**: ApiClient com métodos (get, post, put, delete)

### Visão Geral das Nuances

- **Request Interceptor**: Adicionar headers, transform body, logging
- **Response Interceptor**: Transform data, handle errors, refresh token
- **Inheritance**: Extend wrapper para casos específicos
- **Middleware Pattern**: Chain de interceptors
- **Type Safety**: TypeScript generics para typed responses

---

## �🧠 Fundamentos Teóricos

### Wrapper Function Básico

```javascript
// Wrapper simples com base URL e auth

async function apiFetch(endpoint, options = {}) {
  const baseURL = 'https://api.example.com';
  const token = localStorage.getItem('authToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers // Allow override
    }
  };
  
  const url = `${baseURL}${endpoint}`;
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
}

// Uso:
try {
  const users = await apiFetch('/users');
  console.log(users);
  
  const newUser = await apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'John', email: 'john@example.com' })
  });
  
} catch (error) {
  console.error('API Error:', error);
}
```

### Class-Based API Client

```javascript
// API Client com métodos para cada HTTP method

class ApiClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    };
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    });
  }
  
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
  
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }
  
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
  
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  }
}

// Uso:
const api = new ApiClient('https://api.example.com');

// GET
const users = await api.get('/users');

// POST
const newUser = await api.post('/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT
const updated = await api.put('/users/123', {
  name: 'John Doe'
});

// DELETE
await api.delete('/users/123');
```

### Request Interceptor (Pre-Processing)

```javascript
// Interceptor para adicionar custom headers, logging

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }
  
  // Adicionar request interceptor
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }
  
  // Adicionar response interceptor
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }
  
  async request(endpoint, options = {}) {
    let config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }
    
    const url = `${this.baseURL}${endpoint}`;
    
    let response = await fetch(url, config);
    
    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      response = await interceptor(response);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
}

// Uso: Adicionar interceptors
const api = new ApiClient('https://api.example.com');

// Request interceptor: Auth token
api.addRequestInterceptor(async (config) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

// Request interceptor: Logging
api.addRequestInterceptor(async (config) => {
  console.log('Request:', config.method, config.url);
  return config;
});

// Response interceptor: Transform data
api.addResponseInterceptor(async (response) => {
  console.log('Response:', response.status);
  return response;
});

// Response interceptor: Handle 401 (refresh token)
api.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    console.log('Unauthorized - refreshing token...');
    
    // Refresh token logic...
    // const newToken = await refreshToken();
    // localStorage.setItem('authToken', newToken);
    
    // Retry original request...
  }
  
  return response;
});

// Requests passam por interceptors automaticamente
const users = await api.get('/users');
```

### Response Interceptor (Post-Processing)

```javascript
// Response interceptor para transformar data, handle errors

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.responseInterceptors = [];
  }
  
  addResponseInterceptor(onFulfilled, onRejected) {
    this.responseInterceptors.push({ onFulfilled, onRejected });
  }
  
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      let response = await fetch(url, config);
      
      // Apply response interceptors (fulfilled)
      for (const { onFulfilled } of this.responseInterceptors) {
        if (onFulfilled) {
          response = await onFulfilled(response);
        }
      }
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.response = response;
        throw error;
      }
      
      return await response.json();
      
    } catch (error) {
      // Apply response interceptors (rejected)
      for (const { onRejected } of this.responseInterceptors) {
        if (onRejected) {
          error = await onRejected(error);
        }
      }
      
      throw error;
    }
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
}

// Uso: Response interceptors
const api = new ApiClient('https://api.example.com');

// Transform response data
api.addResponseInterceptor(
  async (response) => {
    // Add custom property
    response.customProp = 'value';
    return response;
  },
  null
);

// Handle errors globally
api.addResponseInterceptor(
  null,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error - redirecting to login');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 500) {
      console.error('Server error - please try again later');
    }
    
    return Promise.reject(error);
  }
);

// Requests usam interceptors
try {
  const users = await api.get('/users');
} catch (error) {
  // Error já processado por interceptor
}
```

### Logging Interceptor

```javascript
// Interceptor para logging detalhado (debugging, monitoring)

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const startTime = Date.now();
    
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    // Log request
    console.group(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`);
    console.log('URL:', url);
    console.log('Headers:', config.headers);
    if (config.body) {
      console.log('Body:', config.body);
    }
    console.groupEnd();
    
    try {
      const response = await fetch(url, config);
      
      const duration = Date.now() - startTime;
      
      // Log response
      console.group(`✅ API Response: ${response.status} ${endpoint} (${duration}ms)`);
      console.log('Status:', response.status, response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));
      console.groupEnd();
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log error
      console.group(`❌ API Error: ${endpoint} (${duration}ms)`);
      console.error('Error:', error);
      console.groupEnd();
      
      throw error;
    }
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
}

// Uso:
const api = new ApiClient('https://api.example.com');

// Requests são logged automaticamente
const users = await api.get('/users');
// Console:
// 🌐 API Request: GET /users
//   URL: https://api.example.com/users
//   Headers: { Content-Type: ..., Authorization: ... }
// ✅ API Response: 200 /users (245ms)
//   Status: 200 OK
//   Headers: { content-type: ..., ... }
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Token Refresh Interceptor

```javascript
// Interceptor para refresh token automático em 401

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }
  
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Refresh failed');
    }
    
    const { accessToken, refreshToken: newRefreshToken } = await response.json();
    
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    return accessToken;
  }
  
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired - refresh
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          
          try {
            const newToken = await this.refreshToken();
            
            // Retry failed requests
            this.failedQueue.forEach(({ resolve, config }) => {
              config.headers['Authorization'] = `Bearer ${newToken}`;
              resolve(fetch(config.url, config));
            });
            
            this.failedQueue = [];
            
            // Retry original request
            config.headers['Authorization'] = `Bearer ${newToken}`;
            return this.request(endpoint, options);
            
          } catch (refreshError) {
            // Refresh failed - logout
            console.error('Refresh failed:', refreshError);
            localStorage.clear();
            window.location.href = '/login';
            throw refreshError;
            
          } finally {
            this.isRefreshing = false;
          }
          
        } else {
          // Already refreshing - queue request
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject, config: { url, ...config } });
          });
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      throw error;
    }
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
}

// Uso:
const api = new ApiClient('https://api.example.com');

// Request com token expirado:
// 1. GET /users → 401
// 2. Refresh token automaticamente
// 3. Retry GET /users com novo token
// 4. Success
const users = await api.get('/users');
```

### Pattern 2: React Context Integration

```javascript
// ApiClient como React Context (centralized)

import { createContext, useContext, useRef } from 'react';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  setToken(token) {
    this.token = token;
  }
  
  async request(endpoint, options = {}) {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        ...options.headers
      }
    };
    
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
}

// Context
const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const apiRef = useRef(new ApiClient('https://api.example.com'));
  
  return (
    <ApiContext.Provider value={apiRef.current}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const api = useContext(ApiContext);
  
  if (!api) {
    throw new Error('useApi must be used within ApiProvider');
  }
  
  return api;
}

// Uso em component:
function UserList() {
  const api = useApi();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    api.get('/users').then(setUsers);
  }, [api]);
  
  const createUser = async (userData) => {
    const newUser = await api.post('/users', userData);
    setUsers([...users, newUser]);
  };
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

// App:
function App() {
  return (
    <ApiProvider>
      <UserList />
    </ApiProvider>
  );
}
```

### Pattern 3: TypeScript Generics (Type-Safe)

```typescript
// ApiClient com TypeScript generics

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  constructor(private baseURL: string) {}
  
  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const { params, ...config } = options;
    
    const token = localStorage.getItem('authToken');
    
    const finalConfig: RequestInit = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...config.headers
      }
    };
    
    // Build URL with query params
    let url = `${this.baseURL}${endpoint}`;
    
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    
    const response = await fetch(url, finalConfig);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
  
  async get<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  async post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
  
  async put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }
  
  async delete<T>(endpoint: string, options?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Uso com types:
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

const api = new ApiClient('https://api.example.com');

// Type-safe responses
const users = await api.get<User[]>('/users');
// users é User[]

const user = await api.get<User>('/users/123');
// user é User

const newPost = await api.post<Post>('/posts', {
  title: 'New Post',
  content: 'Content...',
  userId: 123
});
// newPost é Post

// Query params
const filteredUsers = await api.get<User[]>('/users', {
  params: { role: 'admin', active: 'true' }
});
// GET /users?role=admin&active=true
```

### Pattern 4: Retry Wrapper

```javascript
// Wrapper com retry logic integrado

class ApiClient {
  constructor(baseURL, { maxRetries = 3, retryDelay = 1000 } = {}) {
    this.baseURL = baseURL;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }
  
  async requestWithRetry(endpoint, options = {}, retries = 0) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      if (retries < this.maxRetries) {
        console.log(`Retry ${retries + 1}/${this.maxRetries} after ${this.retryDelay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        
        return this.requestWithRetry(endpoint, options, retries + 1);
      }
      
      throw error;
    }
  }
  
  async get(endpoint, options = {}) {
    return this.requestWithRetry(endpoint, { ...options, method: 'GET' });
  }
}

// Uso:
const api = new ApiClient('https://api.example.com', {
  maxRetries: 3,
  retryDelay: 1000
});

// Request com retry automático em caso de falha
const users = await api.get('/users');
```

### Pattern 5: Caching Wrapper

```javascript
// Wrapper com cache integrado

class ApiClient {
  constructor(baseURL, { cacheTTL = 60000 } = {}) {
    this.baseURL = baseURL;
    this.cacheTTL = cacheTTL;
    this.cache = new Map();
  }
  
  getCacheKey(endpoint, options) {
    return `${options.method || 'GET'}:${endpoint}`;
  }
  
  async request(endpoint, options = {}) {
    const cacheKey = this.getCacheKey(endpoint, options);
    
    // Check cache (apenas GET)
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        console.log('Cache hit:', cacheKey);
        return cached.data;
      }
    }
    
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache GET responses
    if (options.method === 'GET' || !options.method) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }
    
    // Invalidate cache em mutations
    if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
      this.invalidateCache(endpoint);
    }
    
    return data;
  }
  
  invalidateCache(pattern) {
    // Invalidar cache entries que match pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
}

// Uso:
const api = new ApiClient('https://api.example.com', {
  cacheTTL: 60000 // 1 minute
});

// First call: fetches from server
const users1 = await api.get('/users');

// Second call (within 1 minute): returns from cache
const users2 = await api.get('/users'); // Cache hit

// POST invalidates cache
await api.post('/users', { name: 'New User' });

// Next GET: fetches from server (cache invalidated)
const users3 = await api.get('/users');
```

### Pattern 6: Error Response Wrapper

```javascript
// Wrapper com error responses detalhados

class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      }
    };
    
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Parse error response body
      let errorData;
      
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }
    
    return await response.json();
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }
}

// Uso:
const api = new ApiClient('https://api.example.com');

try {
  const user = await api.post('/users', { email: 'invalid' });
  
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', {
      message: error.message,
      status: error.status,
      details: error.response
    });
    
    // Handle specific errors
    if (error.status === 400) {
      console.error('Validation errors:', error.response.errors);
    }
    
    if (error.status === 401) {
      console.error('Unauthorized - redirect to login');
    }
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Wrappers

**✅ Multiple API Calls**: DRY (evitar duplicação)
**✅ Authentication**: Token management centralizado
**✅ Base URL**: Evitar concatenação manual
**✅ Error Handling**: Unified error handling/logging
**✅ Cross-Cutting Concerns**: Logging, monitoring, retry

### Quando NÃO Usar Wrappers

**❌ Single Request**: Overhead desnecessário
**❌ Different APIs**: Wrappers específicos por API (não generic)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Complexity**: Wrappers adicionam abstraction layer
**2. Learning Curve**: Team precisa entender wrapper API
**3. Over-Engineering**: Simple apps podem não precisar
**4. Debugging**: Stack traces passam por wrapper

### Armadilhas Comuns

#### Armadilha 1: Wrapper Muito Genérico

```javascript
// ❌ Wrapper muito genérico (perde type safety, clareza)
async function request(url, options) {
  return fetch(url, options).then(r => r.json());
}

// ✅ Wrapper específico com métodos claros
class ApiClient {
  async get(endpoint) { /* ... */ }
  async post(endpoint, body) { /* ... */ }
}
```

#### Armadilha 2: Não Permitir Override

```javascript
// ❌ Headers fixos (não override)
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// ✅ Permitir override
const config = {
  headers: {
    'Content-Type': 'application/json',
    ...options.headers // Override
  }
};
```

---

## 🔗 Interconexões Conceituais

### Relação com DRY Principle

**Wrappers** centralizam **common logic** (auth, base URL) - **DRY**.

### Relação com Axios

**Axios** tem **interceptors nativos**, **Fetch wrappers** replicam padrão.

### Relação com Middleware

**Interceptors** são **middleware pattern** aplicado a HTTP clients.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Retry Logic**: Exponential backoff, jitter
2. **Caching Strategies**: Cache invalidation, TTL
3. **Request Deduplication**: Evitar requests duplicados

---

## 📚 Conclusão

Wrappers e interceptors são **padrões essenciais** para aplicações com múltiplas API calls.

Dominar wrappers significa:
- **Centralizar logic**: Auth, base URL, error handling
- **DRY principle**: Write once, use everywhere
- **Interceptors**: Pre/post processing hooks
- **Type safety**: TypeScript generics
- **Error handling**: Custom error classes

É fundamental para maintainability e DRY em SPAs.
