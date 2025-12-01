# 🎯 Introdução

**Mock Service Worker (MSW)** é API mocking library que **intercepts HTTP requests no network level** usando Service Worker API (browser) ou Node.js request interception (Node), permitindo realistic testing sem modificar application code ou depender de external servers. Diferentemente de libraries como axios-mock-adapter que intercept no library level (apenas Axios requests), MSW trabalha no network layer, capturing ANY HTTP request independentemente de client library (fetch, Axios, XMLHttpRequest, etc.).

O paradigma fundamental que MSW introduz é **network-level mocking**: em vez de mock individual HTTP client methods (axios.get, fetch, etc.), MSW intercepts requests ANTES deles reach network, providing unified mocking solution. Em browser, Service Worker acts como proxy entre application e network; em Node, MSW patches Node's HTTP modules. Resultado é identical API surface para browser e Node testing, simplifying test maintenance.

Problems que MSW resolve incluem **client library coupling** (axios-mock-adapter só funciona com Axios - se switch para fetch, mocks quebram), **implementation leaking** (mocks tied to specific library implementation details), e **integration testing gap** (library-level mocks não test full request/response cycle). MSW's network-level approach permite mocking ALL requests simultaneously, supporting multiple clients, e providing more realistic testing environment.

MSW architecture consiste de três layers: **Service Worker/Node interceptor** (captures network requests), **request handlers** (define mock responses usando rest.get/post/delete patterns), e **response resolvers** (generate responses usando ctx.status/json/delay utilities). Handlers são registered via setupServer (Node) ou setupWorker (browser), e requests são matched via URL patterns, methods, headers, e body.

Compared to alternatives: **axios-mock-adapter** intercepts no Axios level (library-specific, doesn't test fetch/XHR), **fetch-mock** intercepts fetch only (não funciona com Axios), **nock** intercepts Node HTTP (Node-only, não browser), **json-server** requires running server (slow, complex setup). MSW offers **unified solution** funcionando em browser E Node com same API, intercepting ALL HTTP clients, e providing developer-friendly API.

Este módulo explora MSW comprehensively: desde fundamentals (Service Worker architecture, request interception), através de setup (Node vs browser configuration), request handlers (REST e GraphQL), response resolvers (status, JSON, delays, errors), até advanced patterns (dynamic responses, request matching, handler composition, debugging). Objetivo é fornecer complete understanding para implement robust API mocking com MSW.

---

# 📋 Sumário

### **MSW Fundamentals**
- Network-level mocking
- Service Worker architecture
- MSW vs library mocking
- Use cases

### **Installation & Setup**
- Installation
- Node setup (setupServer)
- Browser setup (setupWorker)
- TypeScript configuration

### **Request Handlers**
- rest.get/post/put/delete
- Handler syntax
- URL matching
- Method matching

### **Response Resolvers**
- ctx.status
- ctx.json
- ctx.text
- ctx.delay

### **Request Matching**
- Path parameters
- Query parameters
- Request body
- Headers

### **Advanced Patterns**
- Dynamic responses
- Conditional responses
- Sequential responses
- Error responses

### **Testing Integration**
- Jest integration
- Setup/teardown
- Test isolation
- Assertions

### **Debugging & Best Practices**
- Request logging
- Unhandled requests
- Handler composition
- Performance considerations

---

# 🧠 Fundamentos

## MSW Fundamentals

### **Network-Level Mocking**

**Traditional library mocking**:

```javascript
// axios-mock-adapter - intercepts NO AXIOS LEVEL
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
mock.onGet('/users').reply(200, []);

// ⚠️ Only Axios requests are mocked
await axios.get('/users'); // ✅ Mocked
await fetch('/users'); // ❌ NOT mocked - real request
```

**MSW network-level**:

```javascript
// MSW - intercepts NO NETWORK LEVEL
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/users', (req, res, ctx) => {
    return res(ctx.json([]));
  })
);

server.listen();

// ✅ ALL HTTP requests are mocked
await axios.get('/users'); // ✅ Mocked
await fetch('/users'); // ✅ Mocked
const xhr = new XMLHttpRequest(); // ✅ Mocked
```

### **Service Worker Architecture**

**Browser**:

```
Application Code
    ↓ (HTTP request)
Service Worker (MSW)
    ↓ (intercepts)
Request Handler
    ↓ (mock response)
Application Code
```

**Node**:

```
Application Code
    ↓ (HTTP request)
Node HTTP Module (patched by MSW)
    ↓ (intercepts)
Request Handler
    ↓ (mock response)
Application Code
```

### **MSW vs Library Mocking**

**MSW advantages**:

- **Client-agnostic**: Works com ANY HTTP client
- **Network realistic**: Tests full request/response cycle
- **Same API**: Identical API para browser e Node
- **No coupling**: No dependency on specific HTTP library

**Library mocking advantages**:

- **Simpler setup**: No Service Worker/patching needed
- **Type safety**: Direct access to library types
- **Familiarity**: Uses same test framework tools

**When to use each**:

```javascript
// Use library mocking (axios-mock-adapter) para:
// - Pure unit tests isolating single function
// - Testing Axios-specific features (interceptors, transforms)
// - Simple scenarios com only Axios usage

// Use MSW para:
// - Integration tests com multiple HTTP clients
// - Component/E2E tests requiring realistic requests
// - Testing code que might switch HTTP libraries
// - Browser + Node shared mocking logic
```

### **Use Cases**

**Component testing** (React, Vue, Angular):

```javascript
// Test component que fetches data
test('displays user list', async () => {
  server.use(
    rest.get('/api/users', (req, res, ctx) => {
      return res(ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]));
    })
  );
  
  render(<UserList />);
  
  await screen.findByText('Alice');
  expect(screen.getByText('Bob')).toBeInTheDocument();
});
```

**API integration testing**:

```javascript
// Test service layer que uses fetch + Axios
test('fetches user and posts', async () => {
  server.use(
    rest.get('/api/users/:id', (req, res, ctx) => {
      return res(ctx.json({ id: 1, name: 'Alice' }));
    }),
    rest.get('/api/posts', (req, res, ctx) => {
      return res(ctx.json([{ id: 1, title: 'Post 1' }]));
    })
  );
  
  const user = await fetchUser(1); // Uses Axios
  const posts = await fetchPosts(); // Uses fetch
  
  expect(user.name).toBe('Alice');
  expect(posts).toHaveLength(1);
});
```

**Development mocking**:

```javascript
// Mock API durante development
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}
```

## Installation & Setup

### **Installation**

```bash
npm install --save-dev msw
```

### **Node Setup (setupServer)**

**Basic setup**:

```javascript
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]));
  })
);
```

**Jest integration**:

```javascript
// src/setupTests.js
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

**jest.config.js**:

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
```

**Example test**:

```javascript
// users.test.js
import { fetchUsers } from './users';

test('fetches users', async () => {
  const users = await fetchUsers();
  
  expect(users).toHaveLength(2);
  expect(users[0].name).toBe('Alice');
});
```

### **Browser Setup (setupWorker)**

**Step 1: Generate Service Worker**:

```bash
npx msw init public/ --save
```

Generates `public/mockServiceWorker.js`.

**Step 2: Create handlers**:

```javascript
// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Alice' }
    ]));
  })
];
```

**Step 3: Setup worker**:

```javascript
// src/mocks/browser.js
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

**Step 4: Start worker** (development):

```javascript
// src/index.js
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

// Your app initialization
ReactDOM.render(<App />, document.getElementById('root'));
```

**Verify in browser console**:

```
[MSW] Mocking enabled.
```

### **TypeScript Configuration**

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "types": ["node", "jest"]
  }
}
```

**Type-safe handlers**:

```typescript
import { rest } from 'msw';

interface User {
  id: number;
  name: string;
}

export const handlers = [
  rest.get<never, never, User[]>('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Alice' }
    ]));
  })
];
```

## Request Handlers

### **rest.get/post/put/delete**

**GET**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(ctx.json([
    { id: 1, name: 'Alice' }
  ]));
})
```

**POST**:

```javascript
rest.post('/api/users', (req, res, ctx) => {
  return res(
    ctx.status(201),
    ctx.json({ id: 3, name: 'New User' })
  );
})
```

**PUT**:

```javascript
rest.put('/api/users/:id', (req, res, ctx) => {
  const { id } = req.params;
  
  return res(
    ctx.json({ id, name: 'Updated' })
  );
})
```

**DELETE**:

```javascript
rest.delete('/api/users/:id', (req, res, ctx) => {
  return res(ctx.status(204));
})
```

**PATCH**:

```javascript
rest.patch('/api/users/:id', (req, res, ctx) => {
  return res(ctx.json({ updated: true }));
})
```

### **Handler Syntax**

**Basic structure**:

```javascript
rest.method(path, resolver)
```

**Resolver signature**:

```javascript
(req, res, ctx) => {
  // req - request information
  // res - response composer
  // ctx - response context utilities
  
  return res(
    ctx.status(200),
    ctx.json({ data: 'value' })
  );
}
```

**Async resolver**:

```javascript
rest.get('/api/users', async (req, res, ctx) => {
  // Simulate async operations
  const users = await fetchUsersFromDatabase();
  
  return res(ctx.json(users));
})
```

### **URL Matching**

**Exact match**:

```javascript
rest.get('/api/users', handler);
```

**Path parameters**:

```javascript
rest.get('/api/users/:id', (req, res, ctx) => {
  const { id } = req.params;
  
  return res(ctx.json({ id, name: 'Alice' }));
});

// Matches: /api/users/1, /api/users/123, etc.
```

**Multiple parameters**:

```javascript
rest.get('/api/users/:userId/posts/:postId', (req, res, ctx) => {
  const { userId, postId } = req.params;
  
  return res(ctx.json({ userId, postId }));
});

// Matches: /api/users/1/posts/5
```

**Wildcard**:

```javascript
rest.get('/api/*', (req, res, ctx) => {
  return res(ctx.json({ wildcard: true }));
});

// Matches: /api/users, /api/posts, /api/anything
```

**Regex** (não suportado directly - use path-to-regexp):

```javascript
// Use wildcard + conditional logic
rest.get('/api/users/*', (req, res, ctx) => {
  const url = req.url.pathname;
  
  if (/\/api\/users\/\d+/.test(url)) {
    return res(ctx.json({ matched: true }));
  }
  
  return res(ctx.status(404));
});
```

### **Method Matching**

**Specific methods**:

```javascript
rest.get('/api/users', handler); // Only GET
rest.post('/api/users', handler); // Only POST
```

**Multiple methods** (separate handlers):

```javascript
const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([]));
  }),
  
  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ created: true }));
  })
];
```

**Shared logic**:

```javascript
const usersHandler = (req, res, ctx) => {
  if (req.method === 'GET') {
    return res(ctx.json([]));
  }
  
  if (req.method === 'POST') {
    return res(ctx.status(201), ctx.json({ created: true }));
  }
};

rest.all('/api/users', usersHandler);
```

## Response Resolvers

### **ctx.status**

**Set status code**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json([])
  );
});
```

**Different status codes**:

```javascript
// 201 Created
rest.post('/api/users', (req, res, ctx) => {
  return res(
    ctx.status(201),
    ctx.json({ id: 1 })
  );
});

// 204 No Content
rest.delete('/api/users/:id', (req, res, ctx) => {
  return res(ctx.status(204));
});

// 400 Bad Request
rest.post('/api/users', (req, res, ctx) => {
  return res(
    ctx.status(400),
    ctx.json({ error: 'Validation failed' })
  );
});

// 404 Not Found
rest.get('/api/users/:id', (req, res, ctx) => {
  return res(
    ctx.status(404),
    ctx.json({ error: 'User not found' })
  );
});

// 500 Internal Server Error
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.status(500),
    ctx.json({ error: 'Server error' })
  );
});
```

### **ctx.json**

**JSON response**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])
  );
});
```

**Automatically sets**:
- `Content-Type: application/json`
- Serializes data to JSON string

### **ctx.text**

**Plain text response**:

```javascript
rest.get('/api/health', (req, res, ctx) => {
  return res(
    ctx.text('OK')
  );
});
```

**HTML response**:

```javascript
rest.get('/page', (req, res, ctx) => {
  return res(
    ctx.text('<html><body>Hello</body></html>')
  );
});
```

### **ctx.delay**

**Simulate network latency**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.delay(2000), // 2 second delay
    ctx.json([])
  );
});
```

**Random delay**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  const delay = Math.random() * 1000; // 0-1 second
  
  return res(
    ctx.delay(delay),
    ctx.json([])
  );
});
```

**Realistic mode** (random 100-400ms):

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.delay('real'), // Realistic network delay
    ctx.json([])
  );
});
```

### **Other Context Utilities**

**ctx.set** (headers):

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.set('X-Total-Count', '100'),
    ctx.set('X-Page', '1'),
    ctx.json([])
  );
});
```

**ctx.cookie**:

```javascript
rest.post('/auth/login', (req, res, ctx) => {
  return res(
    ctx.cookie('token', 'abc123', {
      httpOnly: true,
      secure: true
    }),
    ctx.json({ success: true })
  );
});
```

**ctx.fetch** (pass-through):

```javascript
rest.get('/api/external', async (req, res, ctx) => {
  // Bypass mock - make real request
  const originalResponse = await ctx.fetch(req);
  const data = await originalResponse.json();
  
  return res(ctx.json(data));
});
```

## Request Matching

### **Path Parameters**

**Single parameter**:

```javascript
rest.get('/api/users/:id', (req, res, ctx) => {
  const { id } = req.params;
  
  return res(ctx.json({
    id: parseInt(id),
    name: 'Alice'
  }));
});

// GET /api/users/1
// req.params.id = "1"
```

**Multiple parameters**:

```javascript
rest.get('/api/users/:userId/posts/:postId', (req, res, ctx) => {
  const { userId, postId } = req.params;
  
  return res(ctx.json({
    userId: parseInt(userId),
    postId: parseInt(postId)
  }));
});

// GET /api/users/1/posts/5
// req.params = { userId: "1", postId: "5" }
```

### **Query Parameters**

**Access query params**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  const page = req.url.searchParams.get('page');
  const limit = req.url.searchParams.get('limit');
  
  return res(ctx.json({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    items: []
  }));
});

// GET /api/users?page=2&limit=20
// page = "2", limit = "20"
```

**All params**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  const params = Object.fromEntries(req.url.searchParams);
  
  console.log(params);
  // { page: "1", limit: "10", sort: "name" }
  
  return res(ctx.json([]));
});
```

**Conditional responses**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  const role = req.url.searchParams.get('role');
  
  if (role === 'admin') {
    return res(ctx.json([
      { id: 1, name: 'Admin User', role: 'admin' }
    ]));
  }
  
  return res(ctx.json([
    { id: 2, name: 'Regular User', role: 'user' }
  ]));
});
```

### **Request Body**

**Access JSON body**:

```javascript
rest.post('/api/users', async (req, res, ctx) => {
  const body = await req.json();
  
  console.log(body);
  // { name: "Alice", email: "alice@example.com" }
  
  return res(
    ctx.status(201),
    ctx.json({ id: 1, ...body })
  );
});
```

**Validate body**:

```javascript
rest.post('/api/users', async (req, res, ctx) => {
  const body = await req.json();
  
  if (!body.name) {
    return res(
      ctx.status(400),
      ctx.json({ error: 'Name is required' })
    );
  }
  
  return res(
    ctx.status(201),
    ctx.json({ id: 1, ...body })
  );
});
```

**Text body**:

```javascript
rest.post('/api/text', async (req, res, ctx) => {
  const text = await req.text();
  
  return res(ctx.text(`Received: ${text}`));
});
```

### **Headers**

**Access headers**:

```javascript
rest.get('/api/protected', (req, res, ctx) => {
  const auth = req.headers.get('Authorization');
  
  if (auth !== 'Bearer valid-token') {
    return res(
      ctx.status(401),
      ctx.json({ error: 'Unauthorized' })
    );
  }
  
  return res(ctx.json({ secret: 'data' }));
});
```

**Multiple headers**:

```javascript
rest.get('/api/data', (req, res, ctx) => {
  const contentType = req.headers.get('Content-Type');
  const accept = req.headers.get('Accept');
  const userAgent = req.headers.get('User-Agent');
  
  return res(ctx.json({
    contentType,
    accept,
    userAgent
  }));
});
```

## Advanced Patterns

### **Dynamic Responses**

**Baseado em database/state**:

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

rest.get('/api/users/:id', (req, res, ctx) => {
  const { id } = req.params;
  const user = users.find(u => u.id === parseInt(id));
  
  if (!user) {
    return res(
      ctx.status(404),
      ctx.json({ error: 'User not found' })
    );
  }
  
  return res(ctx.json(user));
});

rest.post('/api/users', async (req, res, ctx) => {
  const body = await req.json();
  const newUser = {
    id: users.length + 1,
    ...body
  };
  
  users.push(newUser);
  
  return res(
    ctx.status(201),
    ctx.json(newUser)
  );
});
```

### **Conditional Responses**

**Baseado em auth**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  const auth = req.headers.get('Authorization');
  
  if (!auth) {
    return res(
      ctx.status(401),
      ctx.json({ error: 'Unauthorized' })
    );
  }
  
  if (auth === 'Bearer admin-token') {
    return res(ctx.json([
      { id: 1, name: 'Alice', role: 'admin' }
    ]));
  }
  
  return res(ctx.json([
    { id: 2, name: 'Bob', role: 'user' }
  ]));
});
```

**Baseado em query params**:

```javascript
rest.get('/api/search', (req, res, ctx) => {
  const query = req.url.searchParams.get('q');
  
  if (!query) {
    return res(
      ctx.status(400),
      ctx.json({ error: 'Query parameter required' })
    );
  }
  
  const results = searchDatabase(query);
  
  return res(ctx.json({ results }));
});
```

### **Sequential Responses**

**Different responses** para repeated calls:

```javascript
let callCount = 0;

rest.get('/api/users', (req, res, ctx) => {
  callCount++;
  
  if (callCount === 1) {
    return res(ctx.json({ page: 1, items: [1, 2, 3] }));
  }
  
  if (callCount === 2) {
    return res(ctx.json({ page: 2, items: [4, 5, 6] }));
  }
  
  return res(ctx.json({ page: 3, items: [] }));
});
```

**Using server.use**:

```javascript
test('handles pagination', async () => {
  server.use(
    rest.get('/api/users', (req, res, ctx) => {
      return res.once(ctx.json({ page: 1, items: [1, 2, 3] }));
    }),
    rest.get('/api/users', (req, res, ctx) => {
      return res.once(ctx.json({ page: 2, items: [4, 5, 6] }));
    }),
    rest.get('/api/users', (req, res, ctx) => {
      return res(ctx.json({ page: 3, items: [] }));
    })
  );
  
  const page1 = await fetch('/api/users');
  const page2 = await fetch('/api/users');
  const page3 = await fetch('/api/users');
});
```

### **Error Responses**

**Network error**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res.networkError('Failed to connect');
});

// Throws network error - no response object
```

**Timeout**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.delay('infinite') // Never resolves
  );
});
```

**Server errors**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.status(500),
    ctx.json({
      error: 'Internal server error',
      message: 'Database connection failed'
    })
  );
});
```

**Client errors**:

```javascript
rest.post('/api/users', async (req, res, ctx) => {
  const body = await req.json();
  
  const errors = {};
  
  if (!body.name) errors.name = 'Name is required';
  if (!body.email) errors.email = 'Email is required';
  
  if (Object.keys(errors).length > 0) {
    return res(
      ctx.status(400),
      ctx.json({ errors })
    );
  }
  
  return res(ctx.status(201), ctx.json({ id: 1, ...body }));
});
```

## Testing Integration

### **Jest Integration**

**Setup file**:

```javascript
// setupTests.js
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Test file**:

```javascript
import { fetchUsers } from './api';

test('fetches users successfully', async () => {
  const users = await fetchUsers();
  
  expect(users).toHaveLength(2);
  expect(users[0].name).toBe('Alice');
});
```

### **Setup/Teardown**

**Per-test handlers**:

```javascript
test('handles 404', async () => {
  server.use(
    rest.get('/api/users/:id', (req, res, ctx) => {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Not found' })
      );
    })
  );
  
  await expect(fetchUser(999)).rejects.toThrow('Not found');
});

test('fetches user successfully', async () => {
  // Default handler restored após resetHandlers()
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});
```

### **Test Isolation**

**Ensure independence**:

```javascript
describe('User API', () => {
  afterEach(() => {
    server.resetHandlers();
  });
  
  test('test 1', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json([{ id: 1 }]));
      })
    );
    
    // Test logic
  });
  
  test('test 2', async () => {
    // Clean slate - test 1 handler removed
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json([{ id: 2 }]));
      })
    );
    
    // Test logic
  });
});
```

### **Assertions**

**Response assertions**:

```javascript
test('returns correct data', async () => {
  const response = await fetch('/api/users');
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(response.headers.get('Content-Type')).toBe('application/json');
  expect(data).toHaveLength(2);
});
```

**Error assertions**:

```javascript
test('handles errors', async () => {
  server.use(
    rest.get('/api/users', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Server error' })
      );
    })
  );
  
  await expect(fetchUsers()).rejects.toThrow('Server error');
});
```

## Debugging & Best Practices

### **Request Logging**

**Enable logging**:

```javascript
server.listen({
  onUnhandledRequest: 'warn'
});

// Logs warnings para unhandled requests
```

**Custom logging**:

```javascript
rest.get('/api/users', (req, res, ctx) => {
  console.log('Request URL:', req.url.href);
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  
  return res(ctx.json([]));
});
```

### **Unhandled Requests**

**Error on unhandled**:

```javascript
server.listen({
  onUnhandledRequest: 'error'
});

// Throws error se request não matched
```

**Bypass specific requests**:

```javascript
server.listen({
  onUnhandledRequest(req) {
    if (req.url.pathname.startsWith('/api/')) {
      console.error('Unhandled API request:', req.url.href);
    }
  }
});
```

### **Handler Composition**

**Shared handlers**:

```javascript
// mocks/handlers.js
export const handlers = [
  rest.get('/api/users', userListHandler),
  rest.get('/api/users/:id', userDetailHandler),
  rest.post('/api/users', createUserHandler)
];

// setupTests.js
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);
```

**Composing responses**:

```javascript
const withAuth = (handler) => {
  return (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    
    if (!auth) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Unauthorized' })
      );
    }
    
    return handler(req, res, ctx);
  };
};

rest.get('/api/protected', withAuth((req, res, ctx) => {
  return res(ctx.json({ secret: 'data' }));
}));
```

### **Performance Considerations**

**Minimize delays** em tests:

```javascript
// ❌ Slow tests
rest.get('/api/users', (req, res, ctx) => {
  return res(
    ctx.delay(2000),
    ctx.json([])
  );
});

// ✅ Fast tests
rest.get('/api/users', (req, res, ctx) => {
  return res(ctx.json([]));
});

// Only add delay quando testing specific scenarios
```

**Cleanup**:

```javascript
afterAll(() => {
  server.close(); // Stop intercepting requests
});
```

---

# 🎯 Aplicabilidade

## Quando Usar MSW

**Integration Tests**: Testing components/modules interacting via HTTP.

**Multiple HTTP Clients**: Code using fetch, Axios, XHR simultaneously.

**Browser + Node**: Shared mocking logic para browser e Node tests.

**Realistic Testing**: Network-level interception mais realistic que library mocking.

## Quando Considerar Alternatives

**Pure Unit Tests**: Library mocking (jest.mock) pode ser simpler.

**Axios-Specific Features**: axios-mock-adapter para interceptor testing.

---

# ⚠️ Limitações

## Service Worker Limitations

Browser Service Workers have restrictions (HTTPS only em production).

**Solution**: Development usa http://localhost.

## Setup Complexity

Requires generating Service Worker file, configuring Jest.

**Solution**: One-time setup, então seamless.

## Type Safety

TypeScript types para request/response podem ser verbose.

**Solution**: Create type helpers, shared interfaces.

---

# 🔗 Interconexões

## Mocking Axios

MSW vs axios-mock-adapter comparison (módulo anterior).

## Testing Interceptors

MSW intercepts BEFORE interceptors run.

## Error Scenarios

MSW simplifies testing network errors, timeouts (próximo módulo).

---

# 🚀 Evolução

## GraphQL Support

MSW supports GraphQL mocking via `graphql.query/mutation`.

## WebSocket Mocking

Future MSW versions may support WebSocket interception.

## Performance Monitoring

Integrate com performance monitoring tools.

---

**Conclusão Integrada**: Mock Service Worker (MSW) provides **network-level HTTP mocking** que intercepts requests via Service Worker (browser) ou Node HTTP patching (Node), offering unified, client-agnostic alternative to library-specific mocking (axios-mock-adapter). Core advantages: **client independence** (works com fetch, Axios, XHR simultaneously), **realistic testing** (full request/response cycle), **same API** (identical handlers para browser/Node), **no coupling** (não tied to specific HTTP library). Setup envolve: **Node** (setupServer + Jest integration via setupTests.js), **Browser** (setupWorker + generated mockServiceWorker.js). Request handlers use **rest.get/post/put/delete** patterns com resolver functions receiving (req, res, ctx), onde **req** provides params/headers/body access, **res** composes response, **ctx** offers utilities (ctx.status, ctx.json, ctx.text, ctx.delay, ctx.set). Advanced patterns incluem: **dynamic responses** (stateful mocking com in-memory database), **conditional logic** (baseado em auth/params/body), **sequential responses** (res.once para different responses per call), **error simulation** (res.networkError, ctx.status(500), ctx.delay('infinite')). Testing integration via **server.listen()** (beforeAll), **server.resetHandlers()** (afterEach para test isolation), **server.close()** (afterAll), com per-test overrides usando **server.use()**. Debugging via **onUnhandledRequest** configuration (warn/error/custom), request logging, handler composition. Compared to axios-mock-adapter: MSW intercepts ALL HTTP clients (não apenas Axios), provides network-realistic testing, mas requires more setup (Service Worker generation, Jest configuration). Use MSW para integration/component tests, multiple clients, browser+Node shared mocking; use library mocking para pure unit tests, library-specific features.