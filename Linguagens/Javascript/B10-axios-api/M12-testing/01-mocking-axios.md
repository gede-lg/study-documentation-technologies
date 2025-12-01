# 🎯 Introdução

**Mocking Axios** é técnica fundamental de testing que permite **simular HTTP requests e responses sem fazer real network calls**, enabling fast, reliable, isolated unit tests para código que depende de external APIs. Em vez de actual requests para servers (slow, flaky, dependentes de network/server availability), mocks fornecem predetermined responses instantaneously, permitindo testar success paths, error handling, edge cases, e race conditions de forma determinística e reproducible.

O problema central que mocking resolve é **external dependencies em tests**: testar código que faz Axios requests normalmente requer running server, network connectivity, e specific server states (user exists, product in stock, etc.). Isso torna tests **slow** (network latency), **flaky** (network/server issues causam failures intermitentes), **non-deterministic** (server state pode mudar), e **complex** (setup/teardown de test databases). Mocking elimina estas dependencies, permitindo tests run em milliseconds sem network.

Múltiplas abordagens existem para mocking Axios: **jest.mock()** (Jest's built-in module mocking para replace entire Axios module), **axios-mock-adapter** (library que intercepts Axios requests e provides fluent API para define mock responses), **manual mocks** (creating custom Axios instance para tests), e **MSW (Mock Service Worker)** (intercepts requests no network level, será coberto em módulo separado). Cada approach tem trade-offs entre simplicity, power, e realism.

**jest.mock()** é simplest approach - globally replace Axios methods com Jest mock functions, permitindo control responses e assert calls. **axios-mock-adapter** oferece more sophisticated API com pattern matching, delays, network errors simulation, e request history tracking. Choice depende de testing needs: simple mocking para basic tests, axios-mock-adapter para complex scenarios requiring fine-grained control.

Este módulo explora mocking Axios em profundidade: desde Jest fundamentals (mock functions, module mocking), através de axios-mock-adapter configuration e patterns, até advanced techniques (partial mocking, spy patterns, testing retry logic, concurrent requests). Objetivo é fornecer knowledge completo para escrever robust, maintainable tests para Axios-based código.

---

# 📋 Sumário

### **Testing Fundamentals**
- Por que mock Axios
- Test isolation principles
- AAA pattern (Arrange-Act-Assert)
- Jest basics

### **Jest Mock Functions**
- jest.fn()
- mockResolvedValue
- mockRejectedValue
- Assertions (toHaveBeenCalled, etc.)

### **jest.mock() para Axios**
- Module mocking
- Mocking GET/POST/PUT/DELETE
- Default vs named exports
- Resetting mocks

### **axios-mock-adapter**
- Installation e setup
- onGet/onPost/onPut/onDelete
- Reply patterns
- Request matching

### **Response Mocking**
- Success responses
- Error responses
- Network errors
- Timeouts

### **Advanced Patterns**
- Multiple requests
- Sequential responses
- Conditional responses
- Request history

### **Testing Best Practices**
- One assertion per test
- Descriptive test names
- Setup/teardown
- Test coverage

---

# 🧠 Fundamentos

## Testing Fundamentals

### **Por Que Mock Axios**

**Problems com Real Requests**:

```javascript
// ❌ Real request - problematic
test('fetches user data', async () => {
  const response = await axios.get('https://api.example.com/user/123');
  expect(response.data.name).toBe('Alice');
});

// Issues:
// - Slow (network latency)
// - Flaky (network/server issues)
// - Requires running server
// - Requires specific server state
// - Not isolated (tests depend on external system)
```

**Com Mocking**:

```javascript
// ✅ Mocked - fast, reliable, isolated
test('fetches user data', async () => {
  axios.get.mockResolvedValue({
    data: { id: 123, name: 'Alice' }
  });
  
  const response = await axios.get('/user/123');
  expect(response.data.name).toBe('Alice');
});

// Benefits:
// - Fast (milliseconds)
// - Reliable (no network dependencies)
// - Isolated (doesn't require external system)
// - Deterministic (consistent results)
```

### **Test Isolation Principles**

**Each test should**:
- Run independently
- Not depend on other tests
- Not affect other tests
- Be repeatable

**Example**:

```javascript
// ✅ Isolated tests
describe('User API', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  
  test('fetches user', async () => {
    axios.get.mockResolvedValue({ data: { id: 1 } });
    // Test logic
  });
  
  test('creates user', async () => {
    axios.post.mockResolvedValue({ data: { id: 2 } });
    // Test logic - não affected by previous test
  });
});
```

### **AAA Pattern (Arrange-Act-Assert)**

**Structure**:

```javascript
test('description', async () => {
  // Arrange - setup
  const mockData = { id: 1, name: 'Alice' };
  axios.get.mockResolvedValue({ data: mockData });
  
  // Act - execute code under test
  const result = await fetchUser(1);
  
  // Assert - verify results
  expect(result.name).toBe('Alice');
  expect(axios.get).toHaveBeenCalledWith('/users/1');
});
```

### **Jest Basics**

**Test Structure**:

```javascript
describe('Test Suite Name', () => {
  beforeEach(() => {
    // Run before each test
  });
  
  afterEach(() => {
    // Run after each test
  });
  
  test('test description', () => {
    // Test logic
  });
  
  it('alternative syntax', () => {
    // Same as test()
  });
});
```

**Async Tests**:

```javascript
// Async/await (recommended)
test('async test', async () => {
  const result = await someAsyncFunction();
  expect(result).toBe('value');
});

// Promise return
test('async test', () => {
  return someAsyncFunction().then(result => {
    expect(result).toBe('value');
  });
});
```

## Jest Mock Functions

### **jest.fn()**

**Create mock function**:

```javascript
const mockFn = jest.fn();

// Call it
mockFn('arg1', 'arg2');

// Assert calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(1);
```

**Mock return value**:

```javascript
const mockFn = jest.fn(() => 'return value');

const result = mockFn();
expect(result).toBe('return value');
```

### **mockResolvedValue**

**Mock successful Promise**:

```javascript
axios.get.mockResolvedValue({
  data: { id: 1, name: 'Alice' },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

const response = await axios.get('/user/1');
expect(response.data.name).toBe('Alice');
```

**Multiple calls com different values**:

```javascript
axios.get
  .mockResolvedValueOnce({ data: { id: 1 } })
  .mockResolvedValueOnce({ data: { id: 2 } })
  .mockResolvedValueOnce({ data: { id: 3 } });

const res1 = await axios.get('/users/1'); // { id: 1 }
const res2 = await axios.get('/users/2'); // { id: 2 }
const res3 = await axios.get('/users/3'); // { id: 3 }
```

### **mockRejectedValue**

**Mock failed Promise**:

```javascript
axios.get.mockRejectedValue(new Error('Network error'));

await expect(axios.get('/user/1')).rejects.toThrow('Network error');
```

**Mock Axios error**:

```javascript
const error = {
  response: {
    status: 404,
    statusText: 'Not Found',
    data: { message: 'User not found' }
  },
  message: 'Request failed with status code 404'
};

axios.get.mockRejectedValue(error);

try {
  await axios.get('/user/999');
} catch (err) {
  expect(err.response.status).toBe(404);
  expect(err.response.data.message).toBe('User not found');
}
```

### **Assertions**

**Call assertions**:

```javascript
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('last', 'args');
expect(mockFn).toHaveBeenNthCalledWith(1, 'first', 'call');
```

**Call inspection**:

```javascript
const mockFn = jest.fn();

mockFn('arg1', 'arg2');
mockFn('arg3', 'arg4');

expect(mockFn.mock.calls).toEqual([
  ['arg1', 'arg2'],
  ['arg3', 'arg4']
]);

expect(mockFn.mock.calls.length).toBe(2);
expect(mockFn.mock.calls[0][0]).toBe('arg1');
```

## jest.mock() para Axios

### **Module Mocking**

**Mock entire module**:

```javascript
// __tests__/user.test.js
import axios from 'axios';
import { fetchUser } from '../user';

// Mock axios module
jest.mock('axios');

test('fetches user', async () => {
  const mockData = { id: 1, name: 'Alice' };
  
  axios.get.mockResolvedValue({ data: mockData });
  
  const user = await fetchUser(1);
  
  expect(user.name).toBe('Alice');
  expect(axios.get).toHaveBeenCalledWith('/users/1');
});
```

### **Mocking GET/POST/PUT/DELETE**

**GET**:

```javascript
test('fetches data', async () => {
  axios.get.mockResolvedValue({ data: { items: [] } });
  
  const response = await axios.get('/api/items');
  
  expect(response.data.items).toEqual([]);
});
```

**POST**:

```javascript
test('creates item', async () => {
  const newItem = { id: 1, name: 'New Item' };
  
  axios.post.mockResolvedValue({ data: newItem });
  
  const response = await axios.post('/api/items', { name: 'New Item' });
  
  expect(response.data).toEqual(newItem);
  expect(axios.post).toHaveBeenCalledWith('/api/items', { name: 'New Item' });
});
```

**PUT**:

```javascript
test('updates item', async () => {
  const updatedItem = { id: 1, name: 'Updated' };
  
  axios.put.mockResolvedValue({ data: updatedItem });
  
  const response = await axios.put('/api/items/1', { name: 'Updated' });
  
  expect(response.data.name).toBe('Updated');
});
```

**DELETE**:

```javascript
test('deletes item', async () => {
  axios.delete.mockResolvedValue({ data: { success: true } });
  
  const response = await axios.delete('/api/items/1');
  
  expect(response.data.success).toBe(true);
  expect(axios.delete).toHaveBeenCalledWith('/api/items/1');
});
```

### **Default vs Named Exports**

**Axios default export**:

```javascript
// Axios usa default export
import axios from 'axios';

jest.mock('axios');

axios.get.mockResolvedValue({ data: {} });
```

**Named exports** (custom):

```javascript
// api.js
export const api = axios.create({ baseURL: '/api' });

// test
import { api } from './api';

jest.mock('./api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

api.get.mockResolvedValue({ data: {} });
```

### **Resetting Mocks**

**Clear calls** (mantém implementation):

```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```

**Reset implementation**:

```javascript
beforeEach(() => {
  jest.resetAllMocks();
});
```

**Restore original**:

```javascript
afterEach(() => {
  jest.restoreAllMocks();
});
```

**Manual reset**:

```javascript
test('test 1', async () => {
  axios.get.mockResolvedValue({ data: { id: 1 } });
  // Test logic
});

test('test 2', async () => {
  axios.get.mockClear(); // Clear previous calls
  axios.get.mockResolvedValue({ data: { id: 2 } });
  // Test logic
});
```

## axios-mock-adapter

### **Installation**

```bash
npm install --save-dev axios-mock-adapter
```

### **Setup**

```javascript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create mock adapter
const mock = new MockAdapter(axios);

// Mock GET request
mock.onGet('/users/1').reply(200, {
  id: 1,
  name: 'Alice'
});

// Use axios normally - requests são intercepted
const response = await axios.get('/users/1');
console.log(response.data); // { id: 1, name: 'Alice' }
```

**Test example**:

```javascript
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('User API', () => {
  let mock;
  
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });
  
  afterEach(() => {
    mock.restore();
  });
  
  test('fetches user', async () => {
    mock.onGet('/users/1').reply(200, { id: 1, name: 'Alice' });
    
    const response = await axios.get('/users/1');
    
    expect(response.data.name).toBe('Alice');
  });
});
```

### **onGet/onPost/onPut/onDelete**

**onGet**:

```javascript
mock.onGet('/users').reply(200, [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

mock.onGet('/users/1').reply(200, { id: 1, name: 'Alice' });
```

**onPost**:

```javascript
mock.onPost('/users').reply(201, { id: 3, name: 'Charlie' });

// Com body matching
mock.onPost('/users', { name: 'Charlie' }).reply(201, { id: 3, name: 'Charlie' });
```

**onPut**:

```javascript
mock.onPut('/users/1').reply(200, { id: 1, name: 'Updated' });
```

**onDelete**:

```javascript
mock.onDelete('/users/1').reply(204);
```

**onAny** (wildcard):

```javascript
mock.onAny('/users').reply(200, { message: 'Any method' });
```

### **Reply Patterns**

**Simple reply**:

```javascript
mock.onGet('/users').reply(200, { users: [] });
```

**Reply com headers**:

```javascript
mock.onGet('/users').reply(200, { users: [] }, {
  'Content-Type': 'application/json',
  'X-Total-Count': '100'
});
```

**Function reply** (dynamic):

```javascript
mock.onGet('/users').reply(config => {
  // Access request config
  console.log(config.params);
  
  return [200, { id: 1, name: 'Alice' }];
});
```

**Delayed reply**:

```javascript
mock.onGet('/users').reply(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([200, { id: 1 }]);
    }, 1000);
  });
});
```

### **Request Matching**

**URL matching**:

```javascript
// Exact match
mock.onGet('/users/1').reply(200, { id: 1 });

// Regex
mock.onGet(/\/users\/\d+/).reply(200, { id: 1 });
```

**Query params**:

```javascript
mock.onGet('/users', { params: { page: 1 } }).reply(200, { users: [] });

// Any params
mock.onGet('/users').reply(200, { users: [] });
```

**Request body**:

```javascript
mock.onPost('/users', { name: 'Alice' }).reply(201, { id: 1, name: 'Alice' });

// Partial match
mock.onPost('/users', { name: 'Alice' }).reply(201, { id: 1 });
```

**Headers**:

```javascript
mock.onGet('/users', undefined, {
  'Authorization': 'Bearer token123'
}).reply(200, { users: [] });
```

## Response Mocking

### **Success Responses**

**200 OK**:

```javascript
mock.onGet('/users').reply(200, {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]
});

const response = await axios.get('/users');
expect(response.status).toBe(200);
expect(response.data.users).toHaveLength(2);
```

**201 Created**:

```javascript
mock.onPost('/users').reply(201, {
  id: 3,
  name: 'Charlie'
}, {
  'Location': '/users/3'
});

const response = await axios.post('/users', { name: 'Charlie' });
expect(response.status).toBe(201);
expect(response.headers.location).toBe('/users/3');
```

**204 No Content**:

```javascript
mock.onDelete('/users/1').reply(204);

const response = await axios.delete('/users/1');
expect(response.status).toBe(204);
expect(response.data).toBe('');
```

### **Error Responses**

**400 Bad Request**:

```javascript
mock.onPost('/users').reply(400, {
  error: 'Validation failed',
  details: {
    name: 'Name is required'
  }
});

try {
  await axios.post('/users', {});
} catch (error) {
  expect(error.response.status).toBe(400);
  expect(error.response.data.error).toBe('Validation failed');
}
```

**401 Unauthorized**:

```javascript
mock.onGet('/protected').reply(401, {
  error: 'Unauthorized'
});

await expect(axios.get('/protected')).rejects.toMatchObject({
  response: {
    status: 401,
    data: { error: 'Unauthorized' }
  }
});
```

**404 Not Found**:

```javascript
mock.onGet('/users/999').reply(404, {
  error: 'User not found'
});

try {
  await axios.get('/users/999');
} catch (error) {
  expect(error.response.status).toBe(404);
}
```

**500 Internal Server Error**:

```javascript
mock.onGet('/users').reply(500, {
  error: 'Internal server error'
});

await expect(axios.get('/users')).rejects.toMatchObject({
  response: { status: 500 }
});
```

### **Network Errors**

**Network error** (no response):

```javascript
mock.onGet('/users').networkError();

try {
  await axios.get('/users');
} catch (error) {
  expect(error.message).toBe('Network Error');
  expect(error.response).toBeUndefined();
}
```

**With jest.mock()**:

```javascript
jest.mock('axios');

axios.get.mockRejectedValue(new Error('Network Error'));

try {
  await axios.get('/users');
} catch (error) {
  expect(error.message).toBe('Network Error');
}
```

### **Timeouts**

**Timeout error**:

```javascript
mock.onGet('/users').timeout();

try {
  await axios.get('/users', { timeout: 1000 });
} catch (error) {
  expect(error.code).toBe('ECONNABORTED');
  expect(error.message).toContain('timeout');
}
```

**Simulated delay + timeout**:

```javascript
mock.onGet('/users').reply(() => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout of 1000ms exceeded'));
    }, 2000);
  });
});

await expect(
  axios.get('/users', { timeout: 1000 })
).rejects.toThrow('timeout');
```

## Advanced Patterns

### **Multiple Requests**

**Different endpoints**:

```javascript
test('fetches multiple resources', async () => {
  mock.onGet('/users').reply(200, [{ id: 1 }]);
  mock.onGet('/posts').reply(200, [{ id: 1 }]);
  mock.onGet('/comments').reply(200, [{ id: 1 }]);
  
  const [users, posts, comments] = await Promise.all([
    axios.get('/users'),
    axios.get('/posts'),
    axios.get('/comments')
  ]);
  
  expect(users.data).toHaveLength(1);
  expect(posts.data).toHaveLength(1);
  expect(comments.data).toHaveLength(1);
});
```

### **Sequential Responses**

**Different responses** para repeated calls:

```javascript
// jest.mock approach
axios.get
  .mockResolvedValueOnce({ data: { page: 1, items: [1, 2, 3] } })
  .mockResolvedValueOnce({ data: { page: 2, items: [4, 5, 6] } })
  .mockResolvedValueOnce({ data: { page: 3, items: [] } });

const page1 = await axios.get('/items?page=1');
const page2 = await axios.get('/items?page=2');
const page3 = await axios.get('/items?page=3');

expect(page1.data.items).toEqual([1, 2, 3]);
expect(page2.data.items).toEqual([4, 5, 6]);
expect(page3.data.items).toEqual([]);
```

**axios-mock-adapter approach**:

```javascript
let callCount = 0;

mock.onGet('/items').reply(() => {
  callCount++;
  
  if (callCount === 1) {
    return [200, { page: 1, items: [1, 2, 3] }];
  } else if (callCount === 2) {
    return [200, { page: 2, items: [4, 5, 6] }];
  } else {
    return [200, { page: 3, items: [] }];
  }
});
```

### **Conditional Responses**

**Baseado em params**:

```javascript
mock.onGet('/users').reply(config => {
  const page = config.params?.page || 1;
  
  const users = {
    1: [{ id: 1 }, { id: 2 }],
    2: [{ id: 3 }, { id: 4 }],
    3: []
  };
  
  return [200, users[page] || []];
});

const page1 = await axios.get('/users', { params: { page: 1 } });
const page2 = await axios.get('/users', { params: { page: 2 } });

expect(page1.data).toHaveLength(2);
expect(page2.data).toHaveLength(2);
```

**Baseado em headers**:

```javascript
mock.onGet('/protected').reply(config => {
  const auth = config.headers.Authorization;
  
  if (auth === 'Bearer valid-token') {
    return [200, { data: 'Secret' }];
  } else {
    return [401, { error: 'Unauthorized' }];
  }
});

// Success
const response = await axios.get('/protected', {
  headers: { Authorization: 'Bearer valid-token' }
});
expect(response.status).toBe(200);

// Failure
try {
  await axios.get('/protected', {
    headers: { Authorization: 'Bearer invalid-token' }
  });
} catch (error) {
  expect(error.response.status).toBe(401);
}
```

**Baseado em body**:

```javascript
mock.onPost('/users').reply(config => {
  const data = JSON.parse(config.data);
  
  if (!data.name) {
    return [400, { error: 'Name is required' }];
  }
  
  return [201, { id: 1, name: data.name }];
});

// Valid
const valid = await axios.post('/users', { name: 'Alice' });
expect(valid.status).toBe(201);

// Invalid
try {
  await axios.post('/users', {});
} catch (error) {
  expect(error.response.status).toBe(400);
}
```

### **Request History**

**Track calls** com jest.mock:

```javascript
jest.mock('axios');

test('tracks all requests', async () => {
  axios.get.mockResolvedValue({ data: {} });
  
  await axios.get('/users');
  await axios.get('/posts');
  await axios.get('/comments');
  
  expect(axios.get).toHaveBeenCalledTimes(3);
  expect(axios.get).toHaveBeenNthCalledWith(1, '/users');
  expect(axios.get).toHaveBeenNthCalledWith(2, '/posts');
  expect(axios.get).toHaveBeenNthCalledWith(3, '/comments');
});
```

**axios-mock-adapter history**:

```javascript
const mock = new MockAdapter(axios);

mock.onGet('/users').reply(200, []);

await axios.get('/users');
await axios.get('/users');

const history = mock.history.get;

expect(history).toHaveLength(2);
expect(history[0].url).toBe('/users');
expect(history[1].url).toBe('/users');
```

## Testing Best Practices

### **1. One Assertion per Test** (ou logical group)

```javascript
// ✅ Focused test
test('fetches user by id', async () => {
  mock.onGet('/users/1').reply(200, { id: 1, name: 'Alice' });
  
  const response = await axios.get('/users/1');
  
  expect(response.data.id).toBe(1);
});

test('calls correct endpoint', async () => {
  mock.onGet('/users/1').reply(200, { id: 1 });
  
  await axios.get('/users/1');
  
  expect(axios.get).toHaveBeenCalledWith('/users/1');
});

// ⚠️ Multiple concerns em one test
test('fetches user', async () => {
  mock.onGet('/users/1').reply(200, { id: 1, name: 'Alice' });
  
  const response = await axios.get('/users/1');
  
  expect(response.data.id).toBe(1);
  expect(response.status).toBe(200);
  expect(axios.get).toHaveBeenCalled();
  // Multiple unrelated assertions
});
```

### **2. Descriptive Test Names**

```javascript
// ✅ Clear, descriptive
test('returns 404 when user not found', async () => {
  // ...
});

test('retries request 3 times on network error', async () => {
  // ...
});

// ❌ Vague
test('test 1', async () => {
  // ...
});

test('works', async () => {
  // ...
});
```

### **3. Setup/Teardown**

```javascript
describe('User API', () => {
  let mock;
  
  beforeEach(() => {
    // Setup before each test
    mock = new MockAdapter(axios);
  });
  
  afterEach(() => {
    // Cleanup after each test
    mock.restore();
    jest.clearAllMocks();
  });
  
  test('test 1', async () => {
    // Clean slate
  });
  
  test('test 2', async () => {
    // Independent
  });
});
```

### **4. Test Coverage**

**Cover success e error paths**:

```javascript
describe('fetchUser', () => {
  test('returns user data on success', async () => {
    mock.onGet('/users/1').reply(200, { id: 1, name: 'Alice' });
    
    const user = await fetchUser(1);
    
    expect(user.name).toBe('Alice');
  });
  
  test('throws error on 404', async () => {
    mock.onGet('/users/999').reply(404);
    
    await expect(fetchUser(999)).rejects.toThrow();
  });
  
  test('throws error on network failure', async () => {
    mock.onGet('/users/1').networkError();
    
    await expect(fetchUser(1)).rejects.toThrow('Network Error');
  });
});
```

**Cover edge cases**:

```javascript
test('handles empty response', async () => {
  mock.onGet('/users').reply(200, []);
  
  const users = await fetchUsers();
  
  expect(users).toEqual([]);
});

test('handles null data', async () => {
  mock.onGet('/users/1').reply(200, null);
  
  const user = await fetchUser(1);
  
  expect(user).toBeNull();
});
```

---

# 🎯 Aplicabilidade

## Quando Usar Mocking

**Unit Tests**: Testing isolated functions/modules.

**Fast Test Suites**: Avoiding network latency.

**CI/CD Pipelines**: No external dependencies.

**Error Scenarios**: Testing rare edge cases.

## Quando Considerar Real Requests

**Integration Tests**: Testing real API integration.

**E2E Tests**: Full user journey testing.

**Contract Testing**: Verifying API contracts.

---

# ⚠️ Limitações

## Não Testa Real API Behavior

Mocks podem divergir de real API behavior.

**Solution**: Combine com integration tests.

## Mock Maintenance

Mocks devem ser updated quando API changes.

**Solution**: Use contract testing, API schemas.

---

# 🔗 Interconexões

## MSW (Mock Service Worker)

Alternative approach - intercepts no network level (próximo módulo).

## Testing Interceptors

Mocking permite testar interceptor logic (módulo separado).

## Error Scenarios

Mocking facilita testing error handling (módulo separado).

---

# 🚀 Evolução

## Contract Testing

Tools como Pact verify mocks match real API.

## GraphQL Mocking

Special considerations para GraphQL APIs.

## TypeScript

Type-safe mocks com TypeScript.

---

**Conclusão Integrada**: Mocking Axios é essential testing technique que permite fast, reliable, isolated unit tests através de simulating HTTP requests/responses sem real network calls. Two primary approaches: **jest.mock()** (simple - globally replace Axios methods com Jest mock functions usando mockResolvedValue/mockRejectedValue) e **axios-mock-adapter** (powerful - fluent API com onGet/onPost patterns, request matching via URL/params/body/headers, reply functions para dynamic responses). jest.mock() é sufficient para basic testing (success/error paths, assertion de calls), enquanto axios-mock-adapter oferece advanced features (network errors, timeouts, request history, sequential responses, conditional logic). Testing best practices incluem: isolation (beforeEach/afterEach cleanup), AAA pattern (Arrange-Act-Assert structure), descriptive test names, focused assertions, comprehensive coverage (success + error + edge cases). Critical considerations: mocks devem accurately reflect real API behavior (risk de divergence), require maintenance quando API changes (solution: contract testing), e não replace integration tests (combine unit tests com mocks + integration tests com real API). Mocking enables testing challenging scenarios (network failures, timeouts, rate limiting, concurrent requests) que são difficult/impossible to reproduce reliably com real requests, dramatically improving test speed (milliseconds vs seconds) e reliability (no flaky network issues).