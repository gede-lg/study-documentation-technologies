# 🎯 Introdução

**RESTful API Client** em Axios envolve designing comprehensive client architecture (**resource-based organization**, **CRUD operations**, **HTTP method mapping**, **URL construction**), implementing base client configuration (base URL, headers, authentication), creating resource-specific modules (users, posts, products), handling standard REST patterns (GET/POST/PUT/PATCH/DELETE), managing relationships between resources, implementing request/response interceptors, error handling, retry logic, caching, type safety via TypeScript.

O problema fundamental de API clients: consuming RESTful APIs requires **repetitive boilerplate code** para each resource (users, posts, products); without proper abstraction, cada resource implementation duplicates authentication logic, error handling, retry patterns, URL construction, leading to inconsistent behavior, difficult maintenance, testing challenges.

RESTful architecture principles: **Resources** (entities like users/posts/products identified by URIs `/api/users/123`), **HTTP methods** (GET retrieve, POST create, PUT/PATCH update, DELETE remove), **Stateless** (each request self-contained with authentication/context), **Uniform interface** (consistent URL patterns `/resources/:id`), **HATEOAS** (hypermedia links guiding navigation).

Standard REST patterns: **Collection endpoints** (`GET /users` list all users, `POST /users` create user), **Resource endpoints** (`GET /users/:id` retrieve specific, `PUT /users/:id` update, `DELETE /users/:id` remove), **Nested resources** (`GET /users/:id/posts` user's posts, `POST /users/:id/posts` create post for user), **Query parameters** (`GET /users?page=2&limit=10` filtering/pagination).

HTTP method semantics: **GET** (retrieve resources, safe/idempotent, no request body, cacheable), **POST** (create resources, not idempotent, request body contains data, returns 201 Created), **PUT** (full update replacing resource, idempotent, requires complete representation), **PATCH** (partial update modifying specific fields, idempotent, minimal data), **DELETE** (remove resource, idempotent, may return 204 No Content).

Client architecture patterns: **Base client** (shared Axios instance with base URL/headers/interceptors), **Resource modules** (users.js, posts.js encapsulating CRUD operations), **Factory pattern** (generating CRUD methods automatically), **Repository pattern** (abstracting data access with consistent interface), **Service layer** (business logic above API client).

Base client configuration: **Base URL** environment-specific (`process.env.API_BASE_URL`), **Default headers** (Content-Type, Accept, Authorization), **Timeout** preventing hanging requests, **Interceptors** (request authentication, response error handling), **Retry logic** (exponential backoff for transient failures).

Resource modules pattern:

```javascript
// Base client
const client = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Users resource
const users = {
  list: () => client.get('/users'),
  get: (id) => client.get(`/users/${id}`),
  create: (data) => client.post('/users', data),
  update: (id, data) => client.put(`/users/${id}`, data),
  delete: (id) => client.delete(`/users/${id}`)
};

// Posts resource
const posts = {
  list: () => client.get('/posts'),
  get: (id) => client.get(`/posts/${id}`),
  create: (data) => client.post('/posts', data),
  update: (id, data) => client.put(`/posts/${id}`, data),
  delete: (id) => client.delete(`/posts/${id}`)
};
```

Factory pattern eliminating duplication:

```javascript
function createResourceClient(resourceName) {
  return {
    list: (params) => client.get(`/${resourceName}`, { params }),
    get: (id) => client.get(`/${resourceName}/${id}`),
    create: (data) => client.post(`/${resourceName}`, data),
    update: (id, data) => client.put(`/${resourceName}/${id}`, data),
    delete: (id) => client.delete(`/${resourceName}/${id}`)
  };
}

const users = createResourceClient('users');
const posts = createResourceClient('posts');
```

TypeScript integration providing type safety:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiClient<T> {
  list(params?: Record<string, any>): Promise<AxiosResponse<T[]>>;
  get(id: number): Promise<AxiosResponse<T>>;
  create(data: Partial<T>): Promise<AxiosResponse<T>>;
  update(id: number, data: Partial<T>): Promise<AxiosResponse<T>>;
  delete(id: number): Promise<AxiosResponse<void>>;
}

const users: ApiClient<User> = createResourceClient<User>('users');
```

Advanced patterns incluem: **Nested resources** (`users.posts(userId).list()`), **Custom actions** (non-CRUD operations like `users.activate(id)`), **Bulk operations** (`users.bulkDelete([1, 2, 3])`), **Search/filter** (`users.search({ name: 'John', role: 'admin' })`), **Relationships** (including/excluding related data via `?include=posts,comments`).

Authentication integration: **Token injection** via request interceptor, **Refresh token** flow on 401 responses, **Token storage** (HttpOnly cookies, memory, sessionStorage), **CSRF protection** when using cookies.

Error handling strategies: **HTTP status codes** (400 client errors, 500 server errors), **Custom error classes** (extending Error with status/data), **Retry logic** (transient failures like 503, network errors), **Error normalization** (consistent error shape across resources), **User-friendly messages** (mapping technical errors to readable text).

Response transformation: **Data extraction** (returning `response.data` instead of full response), **Pagination metadata** (extracting total/page/limit from headers/body), **Normalization** (converting API format to application format), **Validation** (ensuring response matches expected schema).

Common challenges: **URL construction** (handling special characters, nested resources), **Query parameters** (arrays, objects, encoding), **Content negotiation** (Accept/Content-Type headers), **Versioning** (API v1/v2 routing), **CORS** (withCredentials, preflight requests), **Rate limiting** (respecting API quotas, implementing backoff).

Best practices incluem: **Centralize configuration** (single source of truth for base URL/headers), **Separate concerns** (API client vs business logic vs UI), **Test thoroughly** (mock Axios responses, test error scenarios), **Document API** (JSDoc comments, TypeScript interfaces), **Handle loading states** (pending, success, error), **Implement caching** (avoid redundant requests).

Este módulo explora comprehensive RESTful API client implementation: desde core concepts (REST principles, HTTP methods, resource patterns), através de implementation techniques (base client, resource modules, factory pattern, TypeScript integration), até advanced topics (nested resources, authentication, error handling, response transformation). Objetivo é fornecer complete understanding para building robust, maintainable API clients em production applications.

---

# 📋 Sumário

### **REST Fundamentals**
- Resources and URIs
- HTTP methods
- Stateless architecture
- Uniform interface

### **Client Architecture**
- Base client setup
- Resource modules
- Factory pattern
- Repository pattern

### **CRUD Operations**
- List resources
- Get single resource
- Create resource
- Update resource
- Delete resource

### **URL Construction**
- Base URL
- Path parameters
- Query parameters
- Nested resources

### **HTTP Methods**
- GET requests
- POST requests
- PUT vs PATCH
- DELETE requests

### **TypeScript Integration**
- Generic types
- Interface definitions
- Type-safe clients
- Response typing

### **Authentication**
- Token injection
- Refresh token flow
- Request interceptors
- CSRF protection

### **Error Handling**
- Status codes
- Custom errors
- Retry logic
- Error normalization

### **Response Transformation**
- Data extraction
- Pagination metadata
- Normalization
- Validation

### **Advanced Patterns**
- Nested resources
- Custom actions
- Bulk operations
- Search/filter

---

# 🧠 Fundamentos

## REST Fundamentals

### **Resources and URIs**

**Resource-centric design**:

REST (Representational State Transfer) organizes APIs em torno de **resources** (entities like users, posts, products), cada resource identificado por **URI** (Uniform Resource Identifier).

```
Resource: User
URI: /api/users/123

Resource: Post
URI: /api/posts/456

Resource: User's Posts
URI: /api/users/123/posts
```

**URI patterns**:

```javascript
// Collection (all users)
GET /api/users

// Resource (specific user)
GET /api/users/123

// Nested resource (user's posts)
GET /api/users/123/posts

// Nested resource item (specific post of user)
GET /api/users/123/posts/456
```

**Resource naming conventions**:
- Plural nouns (`/users`, not `/user`)
- Lowercase (`/users`, not `/Users`)
- Hyphens for multi-word (`/order-items`, not `/orderItems`)
- No verbs in URI (`/users/123`, not `/getUser/123`)

### **HTTP Methods**

**CRUD mapping**:

| HTTP Method | CRUD Operation | Example               | Idempotent? | Safe? |
|-------------|----------------|-----------------------|-------------|-------|
| GET         | Read           | `GET /users/123`      | ✅ Yes     | ✅ Yes|
| POST        | Create         | `POST /users`         | ❌ No      | ❌ No |
| PUT         | Update (full)  | `PUT /users/123`      | ✅ Yes     | ❌ No |
| PATCH       | Update (partial)| `PATCH /users/123`   | ✅ Yes     | ❌ No |
| DELETE      | Delete         | `DELETE /users/123`   | ✅ Yes     | ❌ No |

**Method semantics**:

```javascript
// GET - Retrieve resources (safe, idempotent, cacheable)
axios.get('/users/123');
// Multiple calls return same result
// No side effects on server

// POST - Create resources (not idempotent, not safe)
axios.post('/users', { name: 'John' });
// Multiple calls create multiple resources
// Side effect: new resource created

// PUT - Full update (idempotent, not safe)
axios.put('/users/123', { name: 'John', email: 'john@example.com' });
// Requires complete resource representation
// Multiple calls same result (idempotent)

// PATCH - Partial update (idempotent, not safe)
axios.patch('/users/123', { name: 'John' });
// Only modified fields sent
// Multiple calls same result

// DELETE - Remove resource (idempotent, not safe)
axios.delete('/users/123');
// Multiple calls same result (resource deleted or already gone)
```

**Idempotency importance**:

```javascript
// Idempotent operations safe to retry
async function safeRetry() {
  try {
    await axios.put('/users/123', userData);
  } catch (error) {
    // Safe to retry - same result
    await axios.put('/users/123', userData);
  }
}

// Non-idempotent operations require care
async function unsafeRetry() {
  try {
    await axios.post('/users', userData);
  } catch (error) {
    // ⚠️ Retry may create duplicate user!
    // await axios.post('/users', userData);
  }
}
```

### **Stateless Architecture**

**Each request self-contained**:

```javascript
// ❌ Stateful (bad) - relies on server session
axios.get('/users/current');
// Server must remember who "current" user is

// ✅ Stateless (good) - includes all context
axios.get('/users/123', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});
// Server determines user from token, no session needed
```

**Benefits of statelessness**:
- Scalability (requests can go to any server)
- Reliability (no session state to lose)
- Simplicity (no session management)

### **Uniform Interface**

**Consistent patterns across resources**:

```javascript
// Users
GET    /users          // List
GET    /users/123      // Get
POST   /users          // Create
PUT    /users/123      // Update
DELETE /users/123      // Delete

// Posts (same pattern)
GET    /posts
GET    /posts/456
POST   /posts
PUT    /posts/456
DELETE /posts/456

// Products (same pattern)
GET    /products
GET    /products/789
POST   /products
PUT    /products/789
DELETE /products/789
```

**Predictability** enables generic client implementation:

```javascript
// Generic CRUD client works for ANY resource
function createClient(resourceName) {
  return {
    list: () => axios.get(`/${resourceName}`),
    get: (id) => axios.get(`/${resourceName}/${id}`),
    create: (data) => axios.post(`/${resourceName}`, data),
    update: (id, data) => axios.put(`/${resourceName}/${id}`, data),
    delete: (id) => axios.delete(`/${resourceName}/${id}`)
  };
}

const users = createClient('users');
const posts = createClient('posts');
const products = createClient('products');
```

## Client Architecture

### **Base Client Setup**

**Centralized Axios instance**:

```javascript
// api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor (authentication)
client.interceptors.request.use(
  config => {
    const token = getToken(); // From storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor (error handling)
client.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Refresh token or redirect to login
      await refreshToken();
      return client.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default client;
```

**Environment-specific configuration**:

```javascript
// .env.development
REACT_APP_API_BASE_URL=http://localhost:8000/api

// .env.production
REACT_APP_API_BASE_URL=https://api.production.com/api

// Usage
const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});
```

### **Resource Modules**

**Organizing by resource**:

```javascript
// api/users.js
import client from './client';

export const users = {
  list(params) {
    return client.get('/users', { params });
  },
  
  get(id) {
    return client.get(`/users/${id}`);
  },
  
  create(data) {
    return client.post('/users', data);
  },
  
  update(id, data) {
    return client.put(`/users/${id}`, data);
  },
  
  patch(id, data) {
    return client.patch(`/users/${id}`, data);
  },
  
  delete(id) {
    return client.delete(`/users/${id}`);
  },
  
  // Custom actions
  activate(id) {
    return client.post(`/users/${id}/activate`);
  },
  
  resetPassword(id, newPassword) {
    return client.post(`/users/${id}/reset-password`, { newPassword });
  }
};
```

```javascript
// api/posts.js
import client from './client';

export const posts = {
  list(params) {
    return client.get('/posts', { params });
  },
  
  get(id) {
    return client.get(`/posts/${id}`);
  },
  
  create(data) {
    return client.post('/posts', data);
  },
  
  update(id, data) {
    return client.put(`/posts/${id}`, data);
  },
  
  delete(id) {
    return client.delete(`/posts/${id}`);
  },
  
  // Custom actions
  publish(id) {
    return client.post(`/posts/${id}/publish`);
  },
  
  addComment(postId, comment) {
    return client.post(`/posts/${postId}/comments`, comment);
  }
};
```

**Usage in application**:

```javascript
// components/UserList.jsx
import { users } from '../api/users';

async function loadUsers() {
  const response = await users.list({ page: 1, limit: 10 });
  console.log(response.data);
}

async function createUser(userData) {
  const response = await users.create(userData);
  console.log(response.data);
}

async function activateUser(userId) {
  await users.activate(userId);
}
```

### **Factory Pattern**

**Eliminating duplication**:

```javascript
// api/resourceFactory.js
import client from './client';

export function createResourceClient(resourceName) {
  return {
    list(params = {}) {
      return client.get(`/${resourceName}`, { params });
    },
    
    get(id) {
      return client.get(`/${resourceName}/${id}`);
    },
    
    create(data) {
      return client.post(`/${resourceName}`, data);
    },
    
    update(id, data) {
      return client.put(`/${resourceName}/${id}`, data);
    },
    
    patch(id, data) {
      return client.patch(`/${resourceName}/${id}`, data);
    },
    
    delete(id) {
      return client.delete(`/${resourceName}/${id}`);
    }
  };
}

// Usage
export const users = createResourceClient('users');
export const posts = createResourceClient('posts');
export const products = createResourceClient('products');
export const orders = createResourceClient('orders');
```

**Extending factory for custom actions**:

```javascript
// api/users.js
import { createResourceClient } from './resourceFactory';
import client from './client';

const users = createResourceClient('users');

// Add custom actions
users.activate = (id) => client.post(`/users/${id}/activate`);
users.deactivate = (id) => client.post(`/users/${id}/deactivate`);
users.resetPassword = (id, newPassword) => 
  client.post(`/users/${id}/reset-password`, { newPassword });

export { users };
```

### **Repository Pattern**

**Abstracting data access**:

```javascript
// repositories/UserRepository.js
import client from '../api/client';

class UserRepository {
  constructor() {
    this.basePath = '/users';
  }
  
  async findAll(params = {}) {
    const response = await client.get(this.basePath, { params });
    return response.data;
  }
  
  async findById(id) {
    const response = await client.get(`${this.basePath}/${id}`);
    return response.data;
  }
  
  async create(userData) {
    const response = await client.post(this.basePath, userData);
    return response.data;
  }
  
  async update(id, userData) {
    const response = await client.put(`${this.basePath}/${id}`, userData);
    return response.data;
  }
  
  async delete(id) {
    await client.delete(`${this.basePath}/${id}`);
  }
  
  // Custom query methods
  async findByEmail(email) {
    const response = await client.get(this.basePath, {
      params: { email }
    });
    return response.data[0];
  }
  
  async findActive() {
    const response = await client.get(this.basePath, {
      params: { status: 'active' }
    });
    return response.data;
  }
}

export default new UserRepository();
```

**Usage**:

```javascript
import UserRepository from '../repositories/UserRepository';

async function loadUsers() {
  const users = await UserRepository.findAll({ page: 1, limit: 10 });
  console.log(users); // Direct data, no response wrapper
}

async function loadActiveUsers() {
  const activeUsers = await UserRepository.findActive();
  console.log(activeUsers);
}
```

## CRUD Operations

### **List Resources**

**GET collection**:

```javascript
// Simple list
async function listUsers() {
  const response = await axios.get('/users');
  return response.data;
}

// With pagination
async function listUsersPaginated(page = 1, limit = 10) {
  const response = await axios.get('/users', {
    params: { page, limit }
  });
  return response.data;
}

// With filters
async function listUsersFiltered(filters) {
  const response = await axios.get('/users', {
    params: {
      role: filters.role,
      status: filters.status,
      search: filters.search
    }
  });
  return response.data;
}

// With sorting
async function listUsersSorted(sortBy, order = 'asc') {
  const response = await axios.get('/users', {
    params: {
      sort: sortBy,
      order: order
    }
  });
  return response.data;
}

// Combined
async function listUsers({ page, limit, filters, sort }) {
  const response = await axios.get('/users', {
    params: {
      page,
      limit,
      ...filters,
      sort: sort?.by,
      order: sort?.order
    }
  });
  return response.data;
}
```

**Response structure**:

```javascript
// Typical paginated response
{
  "data": [
    { "id": 1, "name": "John" },
    { "id": 2, "name": "Jane" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "links": {
    "first": "/users?page=1",
    "prev": null,
    "next": "/users?page=2",
    "last": "/users?page=10"
  }
}
```

### **Get Single Resource**

**GET by ID**:

```javascript
// Simple get
async function getUser(id) {
  const response = await axios.get(`/users/${id}`);
  return response.data;
}

// With relationships included
async function getUserWithPosts(id) {
  const response = await axios.get(`/users/${id}`, {
    params: { include: 'posts,comments' }
  });
  return response.data;
}

// With field selection
async function getUserPartial(id, fields) {
  const response = await axios.get(`/users/${id}`, {
    params: { fields: fields.join(',') }
  });
  return response.data;
}

// Error handling
async function getUserSafe(id) {
  try {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('User not found');
      return null;
    }
    throw error;
  }
}
```

### **Create Resource**

**POST new resource**:

```javascript
// Simple create
async function createUser(userData) {
  const response = await axios.post('/users', userData);
  return response.data;
}

// With validation
async function createUserValidated(userData) {
  // Client-side validation
  if (!userData.email || !userData.name) {
    throw new Error('Email and name are required');
  }
  
  const response = await axios.post('/users', userData);
  return response.data;
}

// With file upload
async function createUserWithAvatar(userData, avatarFile) {
  const formData = new FormData();
  formData.append('name', userData.name);
  formData.append('email', userData.email);
  formData.append('avatar', avatarFile);
  
  const response = await axios.post('/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return response.data;
}

// Error handling (duplicate email)
async function createUserSafe(userData) {
  try {
    const response = await axios.post('/users', userData);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409) {
      return { success: false, error: 'Email already exists' };
    }
    throw error;
  }
}
```

**Response**: Typically `201 Created` with created resource:

```javascript
// Response
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-11-17T10:00:00Z"
}
```

### **Update Resource**

**PUT (full update)**:

```javascript
// Full replacement
async function updateUser(id, userData) {
  const response = await axios.put(`/users/${id}`, userData);
  return response.data;
}

// Requires ALL fields (full representation)
await updateUser(123, {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  status: 'active'
});

// ❌ Partial data with PUT may clear unspecified fields
await axios.put('/users/123', { name: 'John' });
// May clear email, role, status!
```

**PATCH (partial update)**:

```javascript
// Partial modification
async function patchUser(id, updates) {
  const response = await axios.patch(`/users/${id}`, updates);
  return response.data;
}

// Only modified fields
await patchUser(123, { name: 'John Doe' });
// Email, role, status unchanged

// Multiple fields
await patchUser(123, {
  name: 'John Doe',
  role: 'admin'
});
```

**Choosing PUT vs PATCH**:

```javascript
// Use PUT when you have full resource
const user = await getUser(123);
user.name = 'New Name';
await axios.put(`/users/${123}`, user); // Full resource

// Use PATCH when updating specific fields
await axios.patch(`/users/${123}`, { name: 'New Name' }); // Only name
```

### **Delete Resource**

**DELETE by ID**:

```javascript
// Simple delete
async function deleteUser(id) {
  await axios.delete(`/users/${id}`);
}

// With confirmation
async function deleteUserConfirmed(id) {
  const confirmed = window.confirm('Delete this user?');
  if (!confirmed) return;
  
  await axios.delete(`/users/${id}`);
}

// Soft delete (via PATCH)
async function softDeleteUser(id) {
  await axios.patch(`/users/${id}`, { status: 'deleted' });
}

// Error handling
async function deleteUserSafe(id) {
  try {
    await axios.delete(`/users/${id}`);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, error: 'User not found' };
    }
    if (error.response?.status === 409) {
      return { success: false, error: 'Cannot delete user with active orders' };
    }
    throw error;
  }
}
```

**Response**: Typically `204 No Content` (no body) or `200 OK` with deleted resource.

## URL Construction

### **Base URL**

**Environment-based configuration**:

```javascript
// Development
const client = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// Production
const client = axios.create({
  baseURL: 'https://api.production.com/api'
});

// Environment variable
const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// All requests prefixed with base URL
client.get('/users'); // → http://localhost:8000/api/users
client.post('/posts'); // → http://localhost:8000/api/posts
```

### **Path Parameters**

**Dynamic segments**:

```javascript
// User by ID
const userId = 123;
axios.get(`/users/${userId}`); // → /users/123

// Nested resource
const userId = 123;
const postId = 456;
axios.get(`/users/${userId}/posts/${postId}`); // → /users/123/posts/456

// Template literals
function getUserPosts(userId, postId) {
  return axios.get(`/users/${userId}/posts/${postId}`);
}

// Encoding special characters
const username = 'john+doe@example.com';
axios.get(`/users/${encodeURIComponent(username)}`);
// → /users/john%2Bdoe%40example.com
```

### **Query Parameters**

**Using params option**:

```javascript
// Simple params
axios.get('/users', {
  params: { page: 1, limit: 10 }
});
// → /users?page=1&limit=10

// Multiple values
axios.get('/users', {
  params: { role: ['admin', 'editor'] }
});
// → /users?role=admin&role=editor

// Nested objects (requires configuration)
axios.get('/users', {
  params: { filter: { status: 'active', role: 'admin' } },
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' })
});
// → /users?filter[status]=active&filter[role]=admin

// Search params
axios.get('/users', {
  params: { search: 'john', fields: 'name,email' }
});
// → /users?search=john&fields=name%2Cemail
```

**Manual construction (not recommended)**:

```javascript
// ❌ Manual string concatenation
axios.get(`/users?page=1&limit=10`);

// ✅ Use params option (handles encoding)
axios.get('/users', { params: { page: 1, limit: 10 } });
```

### **Nested Resources**

**Parent-child relationships**:

```javascript
// User's posts
axios.get(`/users/${userId}/posts`);

// User's specific post
axios.get(`/users/${userId}/posts/${postId}`);

// Create post for user
axios.post(`/users/${userId}/posts`, postData);

// Post's comments
axios.get(`/posts/${postId}/comments`);

// Deep nesting (usually avoided)
axios.get(`/users/${userId}/posts/${postId}/comments/${commentId}`);
```

**Helper functions**:

```javascript
const users = {
  posts: (userId) => ({
    list: () => axios.get(`/users/${userId}/posts`),
    get: (postId) => axios.get(`/users/${userId}/posts/${postId}`),
    create: (data) => axios.post(`/users/${userId}/posts`, data)
  })
};

// Usage
users.posts(123).list();
users.posts(123).get(456);
users.posts(123).create({ title: 'New Post' });
```

## TypeScript Integration

### **Generic Types**

**Type-safe resource client**:

```typescript
import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface ResourceClient<T> {
  list(params?: Record<string, any>): Promise<AxiosResponse<T[]>>;
  get(id: number | string): Promise<AxiosResponse<T>>;
  create(data: Partial<T>): Promise<AxiosResponse<T>>;
  update(id: number | string, data: Partial<T>): Promise<AxiosResponse<T>>;
  delete(id: number | string): Promise<AxiosResponse<void>>;
}

function createResourceClient<T>(
  client: AxiosInstance,
  resourceName: string
): ResourceClient<T> {
  return {
    list(params = {}) {
      return client.get<T[]>(`/${resourceName}`, { params });
    },
    
    get(id) {
      return client.get<T>(`/${resourceName}/${id}`);
    },
    
    create(data) {
      return client.post<T>(`/${resourceName}`, data);
    },
    
    update(id, data) {
      return client.put<T>(`/${resourceName}/${id}`, data);
    },
    
    delete(id) {
      return client.delete<void>(`/${resourceName}/${id}`);
    }
  };
}
```

### **Interface Definitions**

**Defining resource types**:

```typescript
// User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Post interface
interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  images: string[];
}
```

### **Type-Safe Clients**

**Creating typed clients**:

```typescript
import { client } from './client';

const users = createResourceClient<User>(client, 'users');
const posts = createResourceClient<Post>(client, 'posts');
const products = createResourceClient<Product>(client, 'products');

// Usage with type inference
async function loadUser(id: number) {
  const response = await users.get(id);
  const user: User = response.data; // Type-safe
  console.log(user.name); // ✅ Autocomplete
  // console.log(user.invalid); // ❌ TypeScript error
}

async function createUser(userData: Partial<User>) {
  const response = await users.create(userData);
  return response.data; // Type: User
}

async function listUsers() {
  const response = await users.list({ page: 1 });
  const userList: User[] = response.data; // Type-safe array
  return userList;
}
```

### **Response Typing**

**Paginated responses**:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  links: {
    first: string;
    prev: string | null;
    next: string | null;
    last: string;
  };
}

// Typed list method
function createResourceClient<T>(
  client: AxiosInstance,
  resourceName: string
) {
  return {
    list(params = {}) {
      return client.get<PaginatedResponse<T>>(`/${resourceName}`, { params });
    }
  };
}

// Usage
async function loadUsersPaginated(page: number) {
  const response = await users.list({ page });
  const paginatedData: PaginatedResponse<User> = response.data;
  
  console.log(paginatedData.data); // User[]
  console.log(paginatedData.meta.total); // number
  console.log(paginatedData.links.next); // string | null
}
```

**Custom response types**:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Create method with custom response
async function createUser(userData: Partial<User>) {
  const response = await axios.post<ApiResponse<User>>('/users', userData);
  
  if (response.data.success) {
    return response.data.data; // User
  } else {
    throw new Error(response.data.message);
  }
}
```

---

# 🔍 Análise

## Base Client Benefits

Centralizing Axios instance provides **single configuration source** (base URL, headers, timeout), **consistent interceptors** (authentication, error handling aplicados a todas requests), **testability** (mock single instance instead de individual requests), **maintainability** (mudanças em um lugar propagam para toda aplicação).

## Factory Pattern Advantages

Factory eliminating duplication: **DRY principle** (Don't Repeat Yourself - CRUD methods defined once), **consistency** (all resources behave identically), **scalability** (adding new resource apenas requires `createResourceClient('resource-name')`), **extensibility** (custom actions added per resource).

## TypeScript Safety

Type safety preventing runtime errors: **compile-time validation** (TypeScript catches type mismatches before execution), **autocomplete** (IDE suggests available properties/methods), **refactoring confidence** (renaming properties updates all usages), **documentation** (interfaces serve as living documentation).

## REST Constraints Trade-offs

REST principles guiding design mas introducing trade-offs: **Statelessness** (simplifies servers mas requires sending authentication cada request - larger payloads), **Uniform interface** (predictability mas may not fit all use cases - sometimes custom endpoints more appropriate), **Resource-centric** (clear organization mas deep nesting can become unwieldy).

---

# 🎯 Aplicabilidade

## When to Use RESTful Client

**Ideal scenarios**: Consuming well-designed RESTful APIs, multiple resources with similar CRUD patterns, need for consistent client architecture, TypeScript projects requiring type safety.

**Pattern selection**: **Factory** para simple CRUD resources, **Repository** para complex business logic/queries, **Resource modules** para custom actions beyond CRUD.

## Scaling Considerations

**Small projects**: Simple resource modules sufficient, direct Axios calls acceptable.

**Medium projects**: Factory pattern reducing duplication, centralized client configuration, TypeScript interfaces.

**Large projects**: Repository pattern abstracting data access, service layer para business logic, comprehensive error handling, caching strategies, offline support.

---

# ⚠️ Limitações

## REST Limitations

**Over-fetching**: Requesting more data than needed (`GET /users` returns all fields when only name required).

**Under-fetching**: Multiple requests para related data (`GET /users/123` then `GET /users/123/posts`).

**Deep nesting**: URLs can become unwieldy (`/users/:userId/posts/:postId/comments/:commentId`).

**Solution**: GraphQL addresses over/under-fetching; keep nesting shallow (max 2-3 levels).

## Type Safety Limits

TypeScript types não enforce runtime validation: API pode return different shape than interface defines.

**Solution**: Runtime validation via libraries like `zod`, `yup`, `io-ts`.

---

# 🔗 Interconexões

## Authentication Integration

RESTful client requires authentication (token injection via interceptors - covered em M8-authentication).

## Error Handling

Comprehensive error handling essential (custom error classes, retry logic - M4-response-error).

## Performance Optimization

Caching reducing redundant requests (M10-performance), pagination minimizing data transfer (covered neste módulo M16).

## GraphQL Alternative

Next topic (M16-02) explores GraphQL addressing REST over/under-fetching limitations.

---

# 🚀 Evolução

## GraphQL Adoption

GraphQL gaining popularity addressing REST limitations (precise data fetching, single request para nested resources).

## tRPC

Type-safe RPC alternative to REST for TypeScript full-stack applications.

## API Standardization

JSON:API, HAL providing standardized REST formats (consistent pagination, filtering, error responses).

---

**Conclusão Integrada**: RESTful API client implementation em Axios requires understanding **REST fundamentals** (resources identified by URIs, HTTP methods mapping to CRUD operations GET retrieve POST create PUT full-update PATCH partial-update DELETE remove, stateless architecture cada request self-contained, uniform interface consistent patterns across resources), **client architecture** (base client centralizing configuration via `axios.create({ baseURL, timeout, headers })`, resource modules organizing by entity users/posts/products, factory pattern eliminating duplication via `createResourceClient(resourceName)` generating standard CRUD methods, repository pattern abstracting data access with business logic), **CRUD operations** (list via `GET /users` with pagination/filtering/sorting params, get single via `GET /users/:id` optionally including relationships, create via `POST /users` with validation returning 201 Created, update via `PUT /users/:id` full replacement or `PATCH /users/:id` partial modification choosing based on whether full resource available, delete via `DELETE /users/:id` returning 204 No Content handling 404/409 errors), **URL construction** (base URL environment-specific, path parameters via template literals `${userId}` encoding special characters, query parameters via params option auto-encoding avoiding manual concatenation, nested resources `/users/:userId/posts/:postId` with helper functions), **TypeScript integration** (generic ResourceClient interface `ResourceClient<T>` with typed methods list/get/create/update/delete, interface definitions `User`, `Post`, `Product` with strict types, type-safe clients via `createResourceClient<User>(client, 'users')` providing autocomplete/compile-time validation, response typing `PaginatedResponse<T>` or `ApiResponse<T>` ensuring data shape correctness), **authentication** (token injection via request interceptor `config.headers['Authorization'] = Bearer ${token}`, refresh token flow on 401 retrying original request, CSRF protection when using cookies), **error handling** (HTTP status codes 404 not-found 409 conflict 500 server-error, custom error classes extending Error with status/data, retry logic for transient failures 503/network-errors, error normalization consistent shape, user-friendly messages mapping technical to readable), **response transformation** (data extraction returning `response.data` instead full response, pagination metadata extracting total/page/limit from headers/body, normalization converting API format to application format, validation ensuring response matches schema). Factory pattern particularly powerful eliminating duplication: single `createResourceClient` function generates standard CRUD methods automatically applied to any resource (users, posts, products) with extensibility via custom actions added per resource (`users.activate(id)`, `posts.publish(id)`). TypeScript safety providing compile-time validation preventing runtime errors: interfaces defining resource shapes, generic types ensuring method signatures match, autocomplete improving developer experience. REST constraints introducing trade-offs: statelessness requiring authentication cada request (larger payloads mas server simplicity), uniform interface providing predictability (mas custom endpoints sometimes more appropriate), resource-centric organization clear (mas deep nesting unwieldy - keep 2-3 levels max). Base client centralizing configuration critical for maintainability: single source of truth for base URL/headers/timeout, interceptors applying authentication/error-handling globally, testability mocking single instance instead individual requests. Repository pattern abstracting data access when business logic complex: methods like `findByEmail`, `findActive` encapsulating queries, returning direct data instead response wrappers, separating concerns API client vs business logic vs UI.