# Mocking Fetch: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Mocking fetch** é **técnica de testing** que **substitui fetch() real** por **implementação fake** (mock), permitindo **testar código** que depende de **API calls** sem **network requests reais**, controlando **responses** (success/error), **timing** (delay), **side effects**, garantindo **tests determinísticos**, **fast**, **isolated**, **repeatable**. **jest.mock()** intercepta módulos (global fetch), **fetch-mock** biblioteca específica para fetch com **matcher patterns**, **spy capabilities**, enquanto frameworks como **Vitest** oferecem **vi.mock()** similar.

Conceitualmente, **mock** é **test double** (substituto) que **simula behavior** de dependência externa. **fetch()** é **side effect** (I/O, network) → **non-deterministic** (depende de network, server state, API availability) → **difícil testar**. **Mock** torna test **deterministic**: define exact response → test sempre behaves identically → **no flakiness**. **Mocking** permite **test edge cases** (errors, timeouts, malformed responses) sem depender de server real em specific state.

```javascript
// SEM Mock (problematic):
test('fetches users', async () => {
  const users = await fetchUsers(); // Network request REAL
  
  expect(users).toHaveLength(10); // ❌ Pode falhar se API muda
});
// Problemas:
// - Depende de network (slow, flaky)
// - Depende de server state (não determinístico)
// - Não testa error cases (servidor sempre retorna success)

// COM Mock (ideal):
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])
  })
);

test('fetches users', async () => {
  const users = await fetchUsers(); // Usa mock (sem network)
  
  expect(users).toHaveLength(2); // ✅ Determinístico
  expect(users[0].name).toBe('Alice');
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users');
});
// Benefícios:
// - Fast (sem network delay)
// - Determinístico (response sempre igual)
// - Isolated (não depende de server)
// - Controllable (testa success/error à vontade)
```

### Contexto Histórico e Motivação

**Evolução de Fetch Mocking:**

1. **XMLHttpRequest Era (2000s)**: Sinon.js para mock XHR
2. **Fetch API (2015)**: Necessidade de mock fetch() nativo
3. **jest.mock (2016+)**: Jest suporte para module mocking
4. **fetch-mock (2017+)**: Biblioteca dedicada para fetch
5. **MSW (2019+)**: Service Worker-based mocking (mais realista)

**Motivação para Mocking:**

**Tests** devem ser **FIRST**: **Fast** (segundos, não minutos), **Isolated** (não depende de external systems), **Repeatable** (mesma result sempre), **Self-validating** (pass/fail automático), **Timely** (escrito junto com code). **Real network calls** violam **Fast** (network latency), **Isolated** (depende de API server), **Repeatable** (API state pode mudar). **Mocking** garante tests **FIRST-compliant** controlando exact response, timing, errors.

**Casos que Exigem Mocking:**

**Unit Tests**: Testar função isoladamente (não integration)
**Error Cases**: Simular 404, 500, network failures
**Edge Cases**: Malformed JSON, empty responses, timeout
**CI/CD**: Tests em pipelines sem internet
**Determinism**: Same result sempre (não flaky)

### Problema Fundamental que Resolve

Mocking fetch resolve:

**1. Non-Determinism**: API real muda state (users criados/deletados)
**2. Speed**: Network calls lentos (100ms-5s) vs mock (instant <1ms)
**3. Isolation**: Test não deve depender de external systems
**4. Error Simulation**: Como testar 500 error se server sempre retorna 200?
**5. CI/CD**: Tests em environments sem internet
**6. Flakiness**: Network intermittent failures causam flaky tests

### Importância no Ecossistema

Mocking fetch é **critical** para:

- **Unit Testing**: Isolar lógica de business de I/O
- **TDD**: Test-Driven Development (write tests first)
- **CI/CD Pipelines**: Tests rápidos sem network
- **Edge Case Coverage**: Testar errors, malformed responses
- **Confidence**: Tests determinísticos (não flaky)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Test Double**: Mock é substituto de dependência real
2. **jest.fn()**: Cria mock function (spy + stub)
3. **jest.mock()**: Intercepta módulos (global fetch)
4. **fetch-mock**: Biblioteca para matcher patterns
5. **Assertions**: Verificar calls (toHaveBeenCalledWith)
6. **Cleanup**: Restore mocks após cada test

### Pilares Fundamentais

- **global.fetch**: Objeto global mockável
- **jest.fn()**: Mock function (spy)
- **mockResolvedValue()**: Mock resolved promise
- **mockRejectedValue()**: Mock rejected promise
- **toHaveBeenCalled()**: Assert call count
- **mockClear()**: Reset call history

### Visão Geral das Nuances

- **beforeEach/afterEach**: Setup/teardown mocks
- **Response.ok**: Mock deve incluir status, ok
- **response.json()**: Mock deve retornar promise
- **Multiple Calls**: mockResolvedValueOnce para different responses
- **Matchers**: URL matching (exact, regex, partial)
- **Spy**: Verificar arguments passados

---

## 🧠 Fundamentos Teóricos

### jest.fn() Básico

```javascript
// jest.fn() cria mock function (spy + stub)

test('mock básico', async () => {
  // Mock fetch global
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ message: 'Success' })
    })
  );
  
  // Código testado
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  
  // Assertions
  expect(data.message).toBe('Success');
  
  // Spy - verificar se foi chamado
  expect(global.fetch).toHaveBeenCalled();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data');
});

// jest.fn() é BOTH:
// - Spy: Rastreia calls (quantas vezes, com quais args)
// - Stub: Retorna value fake (não executa real implementation)
```

### mockResolvedValue (Success)

```javascript
// mockResolvedValue para simular success response

// Função testada:
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users');
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// Test:
test('fetchUsers retorna lista de users', async () => {
  // Mock response
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ])
  });
  
  const users = await fetchUsers();
  
  expect(users).toHaveLength(2);
  expect(users[0].name).toBe('Alice');
  
  // Verificar URL correto
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users');
});

// mockResolvedValue = shorthand para:
// jest.fn(() => Promise.resolve(...))
```

### mockRejectedValue (Error)

```javascript
// mockRejectedValue para simular network error

test('fetchUsers lança error em network failure', async () => {
  // Mock network error
  global.fetch = jest.fn().mockRejectedValue(
    new Error('Network request failed')
  );
  
  // Expect error
  await expect(fetchUsers()).rejects.toThrow('Network request failed');
  
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

// Test HTTP error (response.ok = false):
test('fetchUsers lança error em HTTP 500', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: jest.fn().mockResolvedValue({ error: 'Internal Server Error' })
  });
  
  await expect(fetchUsers()).rejects.toThrow('HTTP 500');
});
```

### Setup/Teardown (beforeEach/afterEach)

```javascript
// beforeEach para setup mocks (evita repetição)

describe('fetchUsers', () => {
  beforeEach(() => {
    // Setup mock antes de CADA test
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    // Cleanup após CADA test
    jest.clearAllMocks(); // Clear call history
  });
  
  test('success case', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ id: 1, name: 'Alice' }])
    });
    
    const users = await fetchUsers();
    
    expect(users).toHaveLength(1);
  });
  
  test('error case', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    
    await expect(fetchUsers()).rejects.toThrow('Network error');
  });
  
  test('HTTP 404', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({ error: 'Not Found' })
    });
    
    await expect(fetchUsers()).rejects.toThrow('HTTP 404');
  });
});

// Cada test começa com mock limpo (no call history)
```

### mockResolvedValueOnce (Múltiplas Calls)

```javascript
// mockResolvedValueOnce para different responses em sequential calls

async function retryFetch(url, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.json();
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

test('retryFetch retenta após failure', async () => {
  global.fetch = jest.fn()
    .mockRejectedValueOnce(new Error('Network error')) // 1st call fails
    .mockRejectedValueOnce(new Error('Network error')) // 2nd call fails
    .mockResolvedValueOnce({ // 3rd call succeeds
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Success' })
    });
  
  const data = await retryFetch('https://api.example.com/data', 3);
  
  expect(data.message).toBe('Success');
  expect(global.fetch).toHaveBeenCalledTimes(3); // 3 attempts
});

// mockResolvedValueOnce permite simular retry logic
```

### fetch-mock Library

```javascript
// fetch-mock: biblioteca dedicada para fetch mocking

import fetchMock from 'fetch-mock';

describe('fetchUsers com fetch-mock', () => {
  afterEach(() => {
    fetchMock.restore(); // Restore original fetch
  });
  
  test('success case', async () => {
    // Mock com matcher URL
    fetchMock.get('https://api.example.com/users', {
      status: 200,
      body: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]
    });
    
    const users = await fetchUsers();
    
    expect(users).toHaveLength(2);
    expect(users[0].name).toBe('Alice');
    
    // Verificar call
    expect(fetchMock.calls('https://api.example.com/users')).toHaveLength(1);
  });
  
  test('error case', async () => {
    fetchMock.get('https://api.example.com/users', {
      status: 500,
      body: { error: 'Internal Server Error' }
    });
    
    await expect(fetchUsers()).rejects.toThrow('HTTP 500');
  });
});

// Vantagens fetch-mock:
// - Matcher patterns (exact, regex, wildcard)
// - Built-in response objects (não precisa mock response.json())
// - Call inspection (fetchMock.calls())
// - Headers, delay, repeat
```

### Matchers Avançados (fetch-mock)

```javascript
// fetch-mock suporta matchers complexos

import fetchMock from 'fetch-mock';

test('matcher por regex', async () => {
  // Match qualquer URL com /users
  fetchMock.get(/\/users/, {
    body: [{ id: 1, name: 'Alice' }]
  });
  
  await fetch('https://api.example.com/users');
  await fetch('https://api.example.com/users?page=2');
  
  expect(fetchMock.calls(/\/users/)).toHaveLength(2);
});

test('matcher por method + URL', async () => {
  // POST para /users
  fetchMock.post('https://api.example.com/users', {
    status: 201,
    body: { id: 3, name: 'Charlie' }
  });
  
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    body: JSON.stringify({ name: 'Charlie' })
  });
  
  const data = await response.json();
  
  expect(data.id).toBe(3);
});

test('multiple matchers', async () => {
  fetchMock
    .get('https://api.example.com/users', [{ id: 1 }])
    .get('https://api.example.com/posts', [{ id: 1 }])
    .post('https://api.example.com/users', { status: 201 });
  
  await fetch('https://api.example.com/users');
  await fetch('https://api.example.com/posts');
  
  expect(fetchMock.calls()).toHaveLength(2);
});
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Testing React Component

```javascript
// Test React component que usa fetch

import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';

// Component:
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Tests:
describe('UserList', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('mostra loading state', () => {
    global.fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<UserList />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('mostra users após fetch', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    });
    
    render(<UserList />);
    
    // Wait for async update
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  test('mostra error em failure', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));
    
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

### Pattern 2: Testing POST Request

```javascript
// Test POST com body e headers

async function createUser(userData) {
  const response = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

test('createUser envia POST correto', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: jest.fn().mockResolvedValue({
      id: 3,
      name: 'Charlie',
      email: 'charlie@example.com'
    })
  });
  
  const newUser = await createUser({
    name: 'Charlie',
    email: 'charlie@example.com'
  });
  
  expect(newUser.id).toBe(3);
  
  // Verificar method, headers, body
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.example.com/users',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Charlie',
        email: 'charlie@example.com'
      })
    }
  );
});

test('createUser lança error em 400', async () => {
  global.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    json: jest.fn().mockResolvedValue({
      error: 'Validation failed'
    })
  });
  
  await expect(createUser({ name: '' })).rejects.toThrow('HTTP 400');
});
```

### Pattern 3: Testing com AbortController

```javascript
// Test request cancellation com AbortController

async function fetchWithAbort(url, signal) {
  const response = await fetch(url, { signal });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

test('cancela request com AbortController', async () => {
  global.fetch = jest.fn().mockImplementation((url, options) => {
    // Simula abort
    return new Promise((resolve, reject) => {
      options.signal?.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
      
      // Simula delay
      setTimeout(() => {
        resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Success' })
        });
      }, 1000);
    });
  });
  
  const controller = new AbortController();
  
  const promise = fetchWithAbort('https://api.example.com/data', controller.signal);
  
  // Abort após 100ms
  setTimeout(() => controller.abort(), 100);
  
  await expect(promise).rejects.toThrow('Aborted');
  
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.example.com/data',
    expect.objectContaining({
      signal: expect.any(AbortSignal)
    })
  );
});
```

### Pattern 4: Spy em Arguments

```javascript
// Verificar arguments passados para fetch

test('fetchUser envia correct headers', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ id: 1 })
  });
  
  const token = 'abc123';
  
  await fetch('https://api.example.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Spy - verificar exact arguments
  expect(global.fetch).toHaveBeenCalledWith(
    'https://api.example.com/user',
    expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer abc123',
        'Content-Type': 'application/json'
      })
    })
  );
  
  // Alternativa - destructure call args
  const [url, options] = global.fetch.mock.calls[0];
  
  expect(url).toBe('https://api.example.com/user');
  expect(options.headers['Authorization']).toBe('Bearer abc123');
});
```

### Pattern 5: Testing Retry Logic

```javascript
// Test retry com exponential backoff

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response.json();
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

test('retry funciona após failures', async () => {
  jest.useFakeTimers(); // Mock setTimeout
  
  global.fetch = jest.fn()
    .mockRejectedValueOnce(new Error('Network error'))
    .mockRejectedValueOnce(new Error('Network error'))
    .mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Success' })
    });
  
  const promise = fetchWithRetry('https://api.example.com/data', 3);
  
  // Fast-forward timers
  await jest.runAllTimersAsync();
  
  const data = await promise;
  
  expect(data.message).toBe('Success');
  expect(global.fetch).toHaveBeenCalledTimes(3);
  
  jest.useRealTimers();
});
```

### Pattern 6: Testing Parallel Requests

```javascript
// Test Promise.all com múltiplos fetches

async function fetchDashboard() {
  const [users, posts, comments] = await Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
  ]);
  
  return { users, posts, comments };
}

test('fetchDashboard faz 3 requests paralelos', async () => {
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url.includes('users')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1 }])
      });
    }
    
    if (url.includes('posts')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1 }])
      });
    }
    
    if (url.includes('comments')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: 1 }])
      });
    }
  });
  
  const data = await fetchDashboard();
  
  expect(data.users).toHaveLength(1);
  expect(data.posts).toHaveLength(1);
  expect(data.comments).toHaveLength(1);
  
  // 3 calls simultâneos
  expect(global.fetch).toHaveBeenCalledTimes(3);
  
  // Verificar URLs
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users');
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/posts');
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/comments');
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar jest.fn()

**✅ Simple Tests**: Mocking direto (quick setup)
**✅ Unit Tests**: Testar função isoladamente
**✅ Spy Behavior**: Verificar call count, arguments
**✅ Built-in**: Jest já instalado (no extra dependency)

### Quando Usar fetch-mock

**✅ Complex Matchers**: Regex, wildcard patterns
**✅ Multiple Endpoints**: Múltiplos mocks simultâneos
**✅ Headers/Delay**: Simular headers, response delay
**✅ Dedicated Library**: Feature-rich (advanced use cases)

### Quando NÃO Usar Mocking

**❌ Integration Tests**: Testar integration real com API
**❌ E2E Tests**: Browser automation (Playwright, Cypress)
**❌ Contract Testing**: Verificar API contract (Pact)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações Mocking

**1. Over-Mocking**: Mock tudo → test não testa nada real
**2. Mock Drift**: Mock diverge de API real (false positives)
**3. Setup Overhead**: Mocks complexos (difícil manter)
**4. False Confidence**: Tests passam mas integration falha

### Armadilhas Comuns

#### Armadilha 1: Mock Incomplete Response

```javascript
// ❌ ERRO - Mock sem response.ok (undefined)
global.fetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve([{ id: 1 }])
});

// Código verifica response.ok
if (!response.ok) { // undefined → falsy → throws error
  throw new Error('HTTP error');
}

// ✅ CORRETO - Mock completo
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  status: 200,
  json: () => Promise.resolve([{ id: 1 }])
});
```

#### Armadilha 2: Esquecer Cleanup

```javascript
// ❌ ERRO - Mock persiste entre tests (leak)
test('test 1', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });
  // ...
});

test('test 2', async () => {
  // fetch ainda mockado do test 1 (contamination)
});

// ✅ CORRETO - Cleanup em afterEach
afterEach(() => {
  jest.clearAllMocks();
  // Ou: global.fetch = originalFetch;
});
```

---

## 🔗 Interconexões Conceituais

### Relação com MSW

**MSW** (Mock Service Worker) intercept requests no **browser level** (mais realista).

### Relação com Integration Tests

**Mocking** para **unit tests**, **real API** para **integration tests**.

### Relação com Stubs/Spies

**Mock** = **Stub** (fake return) + **Spy** (track calls).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **MSW**: Service Worker-based mocking (browser-level)
2. **Testing Patterns**: Loading states, error boundaries
3. **Integration Tests**: Real API calls (test environments)

---

## 📚 Conclusão

Mocking fetch é **essencial** para unit tests determinísticos e rápidos.

Dominar mocking significa:
- **jest.fn()**: Mock function (spy + stub)
- **mockResolvedValue()**: Success responses
- **mockRejectedValue()**: Error responses
- **Setup/Teardown**: beforeEach/afterEach cleanup
- **Spy Assertions**: toHaveBeenCalledWith
- **fetch-mock**: Advanced matchers e features

É crítico para TDD, CI/CD, e test coverage completo (success + edge cases).
