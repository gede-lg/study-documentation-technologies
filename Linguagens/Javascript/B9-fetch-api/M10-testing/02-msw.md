# MSW (Mock Service Worker): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**MSW** (Mock Service Worker) é **biblioteca de mocking** que **intercepta network requests** no **browser level** (Service Worker API) ou **Node.js** (http/https modules), fornecendo **responses mockadas** sem modificar **application code**, permitindo **tests realistas** (request passa por fetch() real → interceptado por Service Worker → retorna mock), **browser DevTools visíveis**, **shared mocks** entre tests/development/Storybook, eliminando **test doubles** no código e garantindo **behavior idêntico** entre environments.

Conceitualmente, **MSW** difere de **jest.fn()** fundamentalmente: **jest.fn()** **substitui fetch()** diretamente (test double no código) → fetch() nunca executa → não testa request construction, headers, body serialization. **MSW** permite **fetch() executar normalmente** → request chega ao **Service Worker layer** (browser) → **intercepta e retorna mock** → simula **real server** sem servidor real. **Network tab** no DevTools mostra requests (MSW marca como "from ServiceWorker"), comportamento **idêntico** a production, suporta **REST** e **GraphQL**, handlers **declarativos** (similar Express.js routes).

```javascript
// SEM MSW (jest.fn - substitui fetch):
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve([{ id: 1 }])
});

const response = await fetch('https://api.example.com/users');
// fetch() NUNCA executa (substituído)
// Não testa: request construction, headers, body, URL parsing

// COM MSW (intercept real request):
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    // Request real chegou aqui (interceptado)
    // Acesso a req.url, req.headers, req.body
    
    return res(
      ctx.status(200),
      ctx.json([{ id: 1, name: 'Alice' }])
    );
  })
);

const response = await fetch('https://api.example.com/users');
// fetch() EXECUTA normalmente
// Request passa por Service Worker → interceptado → retorna mock
// Testa: request construction completa, headers, body, URL
```

### Contexto Histórico e Motivação

**Evolução de Mocking Approaches:**

1. **Sinon.js (2010+)**: Fake XHR (XMLHttpRequest stubbing)
2. **jest.fn() (2016+)**: Mock functions (substitui fetch diretamente)
3. **fetch-mock (2017+)**: Biblioteca dedicada (ainda substitui fetch)
4. **MSW (2019+)**: Service Worker-based (intercept real requests)
5. **Modern (2020+)**: MSW adoption crescente (Jest, Vitest, Storybook)

**Motivação para MSW:**

**Traditional mocks** (jest.fn(), fetch-mock) têm **fundamental flaw**: **substituem fetch()** → código de teste difere de production → **not testing real request flow** (headers, body serialization, URL construction). **MSW** resolve via **Service Worker** (browser API) que **intercepta requests** no network layer → request passa por **entire fetch() pipeline** → interceptado **before hitting network** → retorna mock. **Same code path** em test e production (até Service Worker layer).

**Problemas com jest.fn():**

**1. Code Modification**: Precisa inject mock (global.fetch = jest.fn())
**2. Limited Realism**: Não testa request construction
**3. No DevTools**: Network tab vazio (fetch não executa)
**4. Environment Differences**: Test code ≠ production code

**Benefícios MSW:**

**1. Zero Code Changes**: Application code unchanged (mock é external)
**2. Full Realism**: Testa entire request pipeline
**3. DevTools Visible**: Network tab mostra requests (from ServiceWorker)
**4. Shared Mocks**: Same handlers em tests/Storybook/development

### Problema Fundamental que Resolve

MSW resolve:

**1. Realism Gap**: Traditional mocks não testam request construction real
**2. Code Pollution**: Não precisa modificar application code (no global.fetch)
**3. Environment Parity**: Same mocking em tests, Storybook, browser development
**4. REST + GraphQL**: Handlers para ambos (unified approach)
**5. Request Inspection**: Acesso completo a req (headers, body, params)
**6. Dynamic Responses**: Handlers podem retornar different responses baseado em req

### Importância no Ecossistema

MSW é **critical** para:

- **Component Testing**: React Testing Library, Vitest
- **Storybook**: Mock API em stories (shared handlers)
- **Browser Development**: Local development sem backend
- **E2E Tests**: Cypress/Playwright com MSW (consistent mocks)
- **REST/GraphQL**: Unified mocking approach

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Service Worker**: Browser API que intercept network requests
2. **Request Handlers**: Declarativo (rest.get, rest.post, graphql.query)
3. **Request Resolver**: Função (req, res, ctx) → retorna response
4. **Context Utilities**: ctx.status(), ctx.json(), ctx.delay()
5. **setupServer**: Node.js version (tests)
6. **setupWorker**: Browser version (development, Storybook)

### Pilares Fundamentais

- **rest.get()**: Handler para GET requests
- **rest.post()**: Handler para POST requests
- **req.url**: Request URL (searchParams)
- **req.headers**: Request headers (Authorization, etc)
- **res()**: Response builder
- **ctx.json()**: JSON response body
- **ctx.status()**: HTTP status code

### Visão Geral das Nuances

- **Handler Order**: Primeiro match wins (específico antes de genérico)
- **Wildcard Paths**: '/users/:id' (dynamic params)
- **GraphQL**: graphql.query(), graphql.mutation()
- **Response Delay**: ctx.delay() para simular latency
- **One-Time Handlers**: server.use() para override temporário
- **Request Body**: await req.json() para parse body

---

## 🧠 Fundamentos Teóricos

### Setup Básico (Node.js Tests)

```javascript
// msw/node para tests (Node.js environment)

import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Define handlers
const handlers = [
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    );
  })
];

// Setup server
const server = setupServer(...handlers);

// Enable API mocking
beforeAll(() => server.listen());

// Reset handlers após cada test
afterEach(() => server.resetHandlers());

// Cleanup
afterAll(() => server.close());

// Test:
test('fetchUsers retorna users', async () => {
  const response = await fetch('https://api.example.com/users');
  const users = await response.json();
  
  expect(users).toHaveLength(2);
  expect(users[0].name).toBe('Alice');
});

// Request passa por fetch() → Service Worker intercepts → retorna mock
```

### Request Handler Anatomy

```javascript
// Anatomia de request handler

rest.get('https://api.example.com/users', (req, res, ctx) => {
  // req: Request object (URL, headers, body, params)
  // res: Response builder
  // ctx: Context utilities (status, json, delay, etc)
  
  // Acessar query params
  const page = req.url.searchParams.get('page');
  
  // Acessar headers
  const auth = req.headers.get('Authorization');
  
  // Retornar response
  return res(
    ctx.status(200),
    ctx.json([{ id: 1 }])
  );
});

// Exemplo com query params:
rest.get('https://api.example.com/users', (req, res, ctx) => {
  const page = parseInt(req.url.searchParams.get('page') || '1');
  const limit = parseInt(req.url.searchParams.get('limit') || '10');
  
  // Simula pagination
  const users = Array.from({ length: limit }, (_, i) => ({
    id: (page - 1) * limit + i + 1,
    name: `User ${(page - 1) * limit + i + 1}`
  }));
  
  return res(ctx.json(users));
});

// Test:
const response = await fetch('https://api.example.com/users?page=2&limit=5');
const users = await response.json();

expect(users).toHaveLength(5);
expect(users[0].id).toBe(6); // Page 2 starts at ID 6
```

### POST Request Handler

```javascript
// Handler para POST com request body

rest.post('https://api.example.com/users', async (req, res, ctx) => {
  // Parse request body
  const newUser = await req.json();
  
  // Validação
  if (!newUser.name) {
    return res(
      ctx.status(400),
      ctx.json({ error: 'Name is required' })
    );
  }
  
  // Success response
  return res(
    ctx.status(201),
    ctx.json({
      id: 3,
      name: newUser.name,
      email: newUser.email
    })
  );
});

// Test:
test('createUser com body válido', async () => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Charlie',
      email: 'charlie@example.com'
    })
  });
  
  expect(response.status).toBe(201);
  
  const user = await response.json();
  
  expect(user.id).toBe(3);
  expect(user.name).toBe('Charlie');
});

test('createUser sem name retorna 400', async () => {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  
  expect(response.status).toBe(400);
  
  const error = await response.json();
  
  expect(error.error).toBe('Name is required');
});
```

### Dynamic Path Parameters

```javascript
// Wildcard paths para dynamic params

rest.get('https://api.example.com/users/:userId', (req, res, ctx) => {
  // Extrair param
  const { userId } = req.params;
  
  // Simula database lookup
  const users = {
    '1': { id: 1, name: 'Alice' },
    '2': { id: 2, name: 'Bob' },
    '3': { id: 3, name: 'Charlie' }
  };
  
  const user = users[userId];
  
  if (!user) {
    return res(
      ctx.status(404),
      ctx.json({ error: 'User not found' })
    );
  }
  
  return res(ctx.json(user));
});

// Test:
test('GET /users/1 retorna Alice', async () => {
  const response = await fetch('https://api.example.com/users/1');
  const user = await response.json();
  
  expect(user.name).toBe('Alice');
});

test('GET /users/999 retorna 404', async () => {
  const response = await fetch('https://api.example.com/users/999');
  
  expect(response.status).toBe(404);
  
  const error = await response.json();
  
  expect(error.error).toBe('User not found');
});
```

### Response Delay

```javascript
// Simular network latency com ctx.delay()

rest.get('https://api.example.com/slow-endpoint', (req, res, ctx) => {
  return res(
    ctx.delay(2000), // 2 seconds delay
    ctx.json({ message: 'Slow response' })
  );
});

test('loading state durante delay', async () => {
  jest.useFakeTimers();
  
  const promise = fetch('https://api.example.com/slow-endpoint');
  
  // Request está pending
  expect(promise).toBeInstanceOf(Promise);
  
  // Fast-forward 2s
  jest.advanceTimersByTime(2000);
  
  const response = await promise;
  const data = await response.json();
  
  expect(data.message).toBe('Slow response');
  
  jest.useRealTimers();
});

// Uso prático: Test loading states em components
// Component mostra spinner enquanto aguarda response
```

### One-Time Handler Override

```javascript
// server.use() para override temporário (specific test)

const server = setupServer(
  // Default handler
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // Reset to default
afterAll(() => server.close());

test('success case (usa default handler)', async () => {
  const response = await fetch('https://api.example.com/users');
  const users = await response.json();
  
  expect(users).toHaveLength(2);
});

test('error case (override para este test)', async () => {
  // Override APENAS para este test
  server.use(
    rest.get('https://api.example.com/users', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Internal Server Error' })
      );
    })
  );
  
  const response = await fetch('https://api.example.com/users');
  
  expect(response.status).toBe(500);
  
  const error = await response.json();
  
  expect(error.error).toBe('Internal Server Error');
});

test('success case novamente (resetHandlers restaurou default)', async () => {
  const response = await fetch('https://api.example.com/users');
  const users = await response.json();
  
  expect(users).toHaveLength(2); // Default handler
});
```

### GraphQL Handler

```javascript
// MSW suporta GraphQL (queries e mutations)

import { graphql } from 'msw';

const server = setupServer(
  graphql.query('GetUsers', (req, res, ctx) => {
    return res(
      ctx.data({
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ]
      })
    );
  }),
  
  graphql.mutation('CreateUser', async (req, res, ctx) => {
    const { name, email } = req.variables;
    
    return res(
      ctx.data({
        createUser: {
          id: 3,
          name,
          email
        }
      })
    );
  })
);

// Test GraphQL query:
test('GetUsers query', async () => {
  const response = await fetch('https://api.example.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query GetUsers {
          users {
            id
            name
          }
        }
      `
    })
  });
  
  const result = await response.json();
  
  expect(result.data.users).toHaveLength(2);
});

// Test GraphQL mutation:
test('CreateUser mutation', async () => {
  const response = await fetch('https://api.example.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        mutation CreateUser($name: String!, $email: String!) {
          createUser(name: $name, email: $email) {
            id
            name
            email
          }
        }
      `,
      variables: {
        name: 'Charlie',
        email: 'charlie@example.com'
      }
    })
  });
  
  const result = await response.json();
  
  expect(result.data.createUser.id).toBe(3);
});
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Testing React Component

```javascript
// MSW com React Testing Library

import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserList from './UserList';

// Component:
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Setup MSW:
const server = setupServer(
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Tests:
test('mostra users após fetch', async () => {
  render(<UserList />);
  
  // Initially loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for users
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
  
  expect(screen.getByText('Bob')).toBeInTheDocument();
});

test('mostra error em failure', async () => {
  // Override para error
  server.use(
    rest.get('https://api.example.com/users', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Server error' })
      );
    })
  );
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### Pattern 2: Authentication Testing

```javascript
// Test request headers (Authorization)

const server = setupServer(
  rest.get('https://api.example.com/protected', (req, res, ctx) => {
    // Verificar Authorization header
    const auth = req.headers.get('Authorization');
    
    if (!auth || !auth.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Unauthorized' })
      );
    }
    
    const token = auth.replace('Bearer ', '');
    
    if (token !== 'valid-token') {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Invalid token' })
      );
    }
    
    return res(
      ctx.json({ message: 'Protected data' })
    );
  })
);

test('protected endpoint com token válido', async () => {
  const response = await fetch('https://api.example.com/protected', {
    headers: {
      'Authorization': 'Bearer valid-token'
    }
  });
  
  expect(response.status).toBe(200);
  
  const data = await response.json();
  
  expect(data.message).toBe('Protected data');
});

test('protected endpoint sem token retorna 401', async () => {
  const response = await fetch('https://api.example.com/protected');
  
  expect(response.status).toBe(401);
});

test('protected endpoint com token inválido retorna 401', async () => {
  const response = await fetch('https://api.example.com/protected', {
    headers: {
      'Authorization': 'Bearer invalid-token'
    }
  });
  
  expect(response.status).toBe(401);
});
```

### Pattern 3: Stateful Handlers

```javascript
// Handler stateful (simula database mutations)

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

let nextId = 3;

const server = setupServer(
  // GET /users
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(ctx.json(users));
  }),
  
  // POST /users
  rest.post('https://api.example.com/users', async (req, res, ctx) => {
    const newUser = await req.json();
    
    const user = {
      id: nextId++,
      name: newUser.name
    };
    
    users.push(user); // Mutate state
    
    return res(
      ctx.status(201),
      ctx.json(user)
    );
  }),
  
  // DELETE /users/:id
  rest.delete('https://api.example.com/users/:userId', (req, res, ctx) => {
    const { userId } = req.params;
    
    users = users.filter(u => u.id !== parseInt(userId));
    
    return res(ctx.status(204));
  })
);

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  
  // Reset state
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
  nextId = 3;
});

afterAll(() => server.close());

test('CRUD flow', async () => {
  // GET - initial state
  let response = await fetch('https://api.example.com/users');
  let data = await response.json();
  
  expect(data).toHaveLength(2);
  
  // POST - create user
  response = await fetch('https://api.example.com/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'Charlie' })
  });
  
  expect(response.status).toBe(201);
  
  const newUser = await response.json();
  
  expect(newUser.id).toBe(3);
  
  // GET - verify created
  response = await fetch('https://api.example.com/users');
  data = await response.json();
  
  expect(data).toHaveLength(3);
  
  // DELETE - remove user
  response = await fetch('https://api.example.com/users/3', {
    method: 'DELETE'
  });
  
  expect(response.status).toBe(204);
  
  // GET - verify deleted
  response = await fetch('https://api.example.com/users');
  data = await response.json();
  
  expect(data).toHaveLength(2);
});
```

### Pattern 4: Browser Development (setupWorker)

```javascript
// MSW em browser (development, Storybook)

// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(
      ctx.delay(500),
      ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    );
  })
];

// src/mocks/browser.js
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// src/index.js (development only)
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  
  worker.start();
}

// Agora fetch() em browser é interceptado por Service Worker
// Network tab mostra requests (from ServiceWorker)
// Desenvolvimento sem backend real
```

### Pattern 5: Shared Handlers (Tests + Storybook)

```javascript
// Shared handlers entre tests e Storybook

// src/mocks/handlers.js (shared)
import { rest } from 'msw';

export const handlers = [
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    );
  })
];

// src/mocks/server.js (tests - Node.js)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/mocks/browser.js (browser - development/Storybook)
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// setupTests.js (tests)
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// .storybook/preview.js (Storybook)
import { worker } from '../src/mocks/browser';

worker.start();

// Handlers compartilhados (DRY)
// Comportamento consistente em tests e Storybook
```

### Pattern 6: Error Simulation

```javascript
// Simular different error scenarios

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('network error', async () => {
  server.use(
    rest.get('https://api.example.com/users', (req, res, ctx) => {
      return res.networkError('Failed to connect');
    })
  );
  
  await expect(
    fetch('https://api.example.com/users')
  ).rejects.toThrow('Failed to connect');
});

test('HTTP 500 error', async () => {
  server.use(
    rest.get('https://api.example.com/users', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({ error: 'Internal Server Error' })
      );
    })
  );
  
  const response = await fetch('https://api.example.com/users');
  
  expect(response.status).toBe(500);
});

test('malformed JSON', async () => {
  server.use(
    rest.get('https://api.example.com/users', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text('Not JSON') // Malformed response
      );
    })
  );
  
  const response = await fetch('https://api.example.com/users');
  
  await expect(response.json()).rejects.toThrow();
});

test('timeout', async () => {
  server.use(
    rest.get('https://api.example.com/users', (req, res, ctx) => {
      return res(
        ctx.delay('infinite') // Never resolves
      );
    })
  );
  
  // Test timeout handling (AbortController)
  const controller = new AbortController();
  
  setTimeout(() => controller.abort(), 1000);
  
  await expect(
    fetch('https://api.example.com/users', { signal: controller.signal })
  ).rejects.toThrow('Aborted');
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar MSW

**✅ Realistic Tests**: Testar entire request pipeline
**✅ REST + GraphQL**: Unified mocking approach
**✅ Shared Mocks**: Tests, Storybook, development
**✅ Browser DevTools**: Network tab visível (debugging)
**✅ Component Tests**: React Testing Library, Vitest

### Quando Usar jest.fn()

**✅ Simple Tests**: Quick mocks (no setup overhead)
**✅ Spy-Only**: Apenas verificar calls (não response)
**✅ Non-HTTP**: Mock outras functions (não fetch)

### Quando NÃO Usar

**❌ Integration Tests**: Testar real API (staging environment)
**❌ E2E Tests**: Cypress/Playwright com real backend

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações MSW

**1. Setup Overhead**: Mais complexo que jest.fn() (learning curve)
**2. Service Worker**: Browser API (pode ter quirks)
**3. Node.js Polyfill**: Precisa msw/node (não browser nativo)
**4. Handler Complexity**: Stateful handlers podem ficar complexos

### Armadilhas Comuns

#### Armadilha 1: Handler Order Matters

```javascript
// ❌ ERRO - Handler genérico antes de específico (shadow)
const server = setupServer(
  rest.get('https://api.example.com/*', (req, res, ctx) => {
    return res(ctx.json({ message: 'Generic' }));
  }),
  
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1 }]));
  })
);
// Wildcard /* captura ALL requests (users nunca executa)

// ✅ CORRETO - Específico antes de genérico
const server = setupServer(
  rest.get('https://api.example.com/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1 }]));
  }),
  
  rest.get('https://api.example.com/*', (req, res, ctx) => {
    return res(ctx.json({ message: 'Generic' }));
  })
);
```

#### Armadilha 2: Esquecer resetHandlers

```javascript
// ❌ ERRO - Override persiste entre tests
test('error case', async () => {
  server.use(
    rest.get('/users', (req, res, ctx) => res(ctx.status(500)))
  );
  
  // ...
});

test('success case', async () => {
  // 500 handler AINDA ativo (leak do test anterior)
});

// ✅ CORRETO - resetHandlers em afterEach
afterEach(() => server.resetHandlers());
```

---

## 🔗 Interconexões Conceituais

### Relação com Service Workers

**MSW** usa **Service Worker API** (intercept requests browser-level).

### Relação com Express.js

**Handler syntax** similar a Express.js routes (req, res, middleware-like).

### Relação com Storybook

**MSW** integra nativamente com Storybook (addon-msw).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Testing Patterns**: Loading states, error boundaries, retry
2. **Integration Tests**: Real API calls (staging)
3. **E2E Tests**: Cypress/Playwright

---

## 📚 Conclusão

MSW é **state-of-the-art** para mocking fetch em tests e development.

Dominar MSW significa:
- **Service Worker**: Intercept real requests (browser-level)
- **rest.get/post/etc**: Declarative handlers
- **req, res, ctx**: Request inspection, response building
- **setupServer**: Node.js (tests)
- **setupWorker**: Browser (development, Storybook)
- **Shared Handlers**: DRY (tests + Storybook)

É crítico para realistic tests, Storybook, e development sem backend.
