# 🎯 Introdução

**Testing Axios Interceptors** envolve verificar que **request e response interceptor logic** executes correctly, transforms data appropriately, handles errors properly, e integrates seamlessly com Axios request/response lifecycle. Interceptors são critical application components que add cross-cutting concerns (authentication, logging, error handling, caching), e their reliability directly impacts application behavior - flawed interceptor pode break ALL HTTP requests.

Fundamental challenge em testing interceptors é **isolation vs integration**: testar interceptor logic em isolation (unit test) verifica internal logic mas não validates interaction com Axios; testar integration (com real Axios instance) verifies full behavior mas couples test to HTTP layer. Optimal approach combina both: **unit tests** para interceptor functions isoladas (pure logic verification), **integration tests** para interceptor registration e interaction com Axios (end-to-end verification).

Interceptor testing scenarios incluem: **request interceptors** (verify headers adicionados, tokens injected, URL transformations, request data modifications, conditional logic baseada em config), **response interceptors** (verify data transformations, error handling, retry logic, cache updates), **error interceptors** (verify error transformations, recovery strategies, fallback responses), **interceptor chains** (multiple interceptors executing em order), **async interceptors** (testing promises, async/await logic), e **interceptor removal** (verify unregistered interceptors não execute).

Testing strategies dependem de mocking approach: **jest.mock()** permite mock Axios instance e verify interceptor registration/calls, **axios-mock-adapter** enables mocking responses para test interceptor transformations, **real Axios instance** (sem mocking) tests actual integration mas requires network setup. Best practice: combine unit tests (isolated interceptor logic) com integration tests (interceptor + Axios interaction).

Critical considerations incluem: **execution order** (request interceptors execute reverse registration order, response interceptors execute registration order), **error handling** (rejected interceptors skip remaining interceptors, trigger error interceptors), **async behavior** (interceptors returning promises), **context preservation** (this binding, closures), e **side effects** (mutations, external state changes).

Este módulo explora comprehensive interceptor testing: desde unit testing isolated interceptor functions, através de integration testing com mocked Axios, testing interceptor chains e error scenarios, até advanced patterns (spy/stub usage, testing retry logic, verifying interceptor removal, testing async interceptors). Objetivo é fornecer complete toolkit para ensuring interceptor reliability.

---

# 📋 Sumário

### **Interceptor Testing Fundamentals**
- Why test interceptors
- Unit vs integration tests
- Isolation strategies
- Mocking approaches

### **Testing Request Interceptors**
- Adding headers
- Token injection
- URL modifications
- Request data transformations

### **Testing Response Interceptors**
- Data transformations
- Cache updates
- Metadata extraction
- Response normalization

### **Testing Error Interceptors**
- Error transformations
- Recovery strategies
- Fallback responses
- Retry logic

### **Testing Interceptor Chains**
- Multiple interceptors
- Execution order
- Data flow
- Chain interruption

### **Testing Async Interceptors**
- Promise-based interceptors
- Async/await patterns
- Error propagation
- Timeout handling

### **Spy & Stub Patterns**
- jest.spyOn
- Verifying calls
- Mocking dependencies
- Argument matchers

### **Advanced Testing**
- Interceptor removal
- Conditional interceptors
- Testing retry logic
- Testing cache interceptors

---

# 🧠 Fundamentos

## Interceptor Testing Fundamentals

### **Why Test Interceptors**

**Critical impact**:

```javascript
// ❌ Untested interceptor - bug affects ALL requests
axios.interceptors.request.use(config => {
  // Bug: typo em header name
  config.headers['Authorizaton'] = getToken(); // Should be "Authorization"
  return config;
});

// All requests fail authorization - affects entire app
```

**Reliability**:

```javascript
// ✅ Tested interceptor - bugs caught early
test('adds authorization header', () => {
  const config = requestInterceptor({ headers: {} });
  
  expect(config.headers.Authorization).toBeDefined();
  expect(config.headers.Authorization).toMatch(/^Bearer /);
});
```

### **Unit vs Integration Tests**

**Unit test** (isolated function):

```javascript
// Interceptor como pure function
const addAuthHeader = (config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
};

// Unit test - testa logic em isolation
test('adds auth header', () => {
  const mockGetToken = jest.fn(() => 'token123');
  
  const config = addAuthHeader({ headers: {} });
  
  expect(config.headers.Authorization).toBe('Bearer token123');
});
```

**Integration test** (com Axios):

```javascript
// Integration test - testa com real Axios instance
test('interceptor adds auth header to requests', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  axios.interceptors.request.use(addAuthHeader);
  
  await axios.get('/api/users');
  
  const request = mock.history.get[0];
  expect(request.headers.Authorization).toBe('Bearer token123');
});
```

### **Isolation Strategies**

**Extract interceptor logic**:

```javascript
// ❌ Coupled - hard to test
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Decoupled - easy to test
const addAuthHeader = (getToken) => (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Test with mock getToken
test('adds auth header', () => {
  const mockGetToken = () => 'token123';
  const interceptor = addAuthHeader(mockGetToken);
  
  const config = interceptor({ headers: {} });
  
  expect(config.headers.Authorization).toBe('Bearer token123');
});

// Production usage
axios.interceptors.request.use(
  addAuthHeader(() => localStorage.getItem('token'))
);
```

### **Mocking Approaches**

**jest.mock()**:

```javascript
jest.mock('axios');

test('registers interceptor', () => {
  const mockUse = jest.fn();
  axios.interceptors.request.use = mockUse;
  
  setupInterceptors(axios);
  
  expect(mockUse).toHaveBeenCalledWith(expect.any(Function));
});
```

**axios-mock-adapter**:

```javascript
const mock = new MockAdapter(axios);

test('interceptor transforms request', async () => {
  mock.onGet('/api/users').reply(200, []);
  
  axios.interceptors.request.use(config => {
    config.headers['X-Custom'] = 'value';
    return config;
  });
  
  await axios.get('/api/users');
  
  expect(mock.history.get[0].headers['X-Custom']).toBe('value');
});
```

**Real Axios instance**:

```javascript
test('interceptor works with real axios', async () => {
  const instance = axios.create();
  
  instance.interceptors.request.use(config => {
    config.headers['X-Test'] = 'true';
    return config;
  });
  
  const mock = new MockAdapter(instance);
  mock.onGet('/api/users').reply(200, []);
  
  await instance.get('/api/users');
  
  expect(mock.history.get[0].headers['X-Test']).toBe('true');
});
```

## Testing Request Interceptors

### **Adding Headers**

**Test header addition**:

```javascript
// Interceptor
const addCustomHeaders = (config) => {
  config.headers['X-App-Version'] = '1.0.0';
  config.headers['X-Request-ID'] = generateRequestId();
  return config;
};

// Unit test
test('adds custom headers', () => {
  const config = { headers: {} };
  
  const result = addCustomHeaders(config);
  
  expect(result.headers['X-App-Version']).toBe('1.0.0');
  expect(result.headers['X-Request-ID']).toBeDefined();
});

// Integration test
test('headers present in request', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  axios.interceptors.request.use(addCustomHeaders);
  
  await axios.get('/api/users');
  
  const request = mock.history.get[0];
  expect(request.headers['X-App-Version']).toBe('1.0.0');
});
```

### **Token Injection**

**Test auth token**:

```javascript
// Interceptor
const addAuthToken = (getToken) => (config) => {
  const token = getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

// Test with token
test('adds auth token when available', () => {
  const mockGetToken = () => 'valid-token';
  const interceptor = addAuthToken(mockGetToken);
  
  const config = interceptor({ headers: {} });
  
  expect(config.headers.Authorization).toBe('Bearer valid-token');
});

// Test without token
test('skips auth header when no token', () => {
  const mockGetToken = () => null;
  const interceptor = addAuthToken(mockGetToken);
  
  const config = interceptor({ headers: {} });
  
  expect(config.headers.Authorization).toBeUndefined();
});
```

### **URL Modifications**

**Test URL transformation**:

```javascript
// Interceptor
const addApiPrefix = (config) => {
  if (!config.url.startsWith('http')) {
    config.url = `/api${config.url}`;
  }
  return config;
};

// Tests
test('adds /api prefix to relative URLs', () => {
  const config = { url: '/users' };
  
  const result = addApiPrefix(config);
  
  expect(result.url).toBe('/api/users');
});

test('preserves absolute URLs', () => {
  const config = { url: 'https://example.com/users' };
  
  const result = addApiPrefix(config);
  
  expect(result.url).toBe('https://example.com/users');
});
```

**Test query param addition**:

```javascript
// Interceptor
const addTimestamp = (config) => {
  const url = new URL(config.url, 'http://example.com');
  url.searchParams.set('_t', Date.now().toString());
  
  config.url = url.pathname + url.search;
  
  return config;
};

// Test
test('adds timestamp query param', () => {
  const config = { url: '/api/users' };
  
  const result = addTimestamp(config);
  
  expect(result.url).toMatch(/\/api\/users\?_t=\d+/);
});
```

### **Request Data Transformations**

**Test data normalization**:

```javascript
// Interceptor
const normalizeRequestData = (config) => {
  if (config.data && typeof config.data === 'object') {
    // Convert all keys to camelCase
    config.data = Object.fromEntries(
      Object.entries(config.data).map(([key, value]) => [
        camelCase(key),
        value
      ])
    );
  }
  
  return config;
};

// Test
test('converts keys to camelCase', () => {
  const config = {
    data: {
      first_name: 'Alice',
      last_name: 'Smith'
    }
  };
  
  const result = normalizeRequestData(config);
  
  expect(result.data).toEqual({
    firstName: 'Alice',
    lastName: 'Smith'
  });
});
```

## Testing Response Interceptors

### **Data Transformations**

**Test response data transformation**:

```javascript
// Interceptor
const transformResponseData = (response) => {
  if (response.data && response.data.data) {
    response.data = response.data.data;
  }
  
  return response;
};

// Test
test('unwraps nested data', () => {
  const response = {
    data: {
      data: { id: 1, name: 'Alice' },
      meta: { total: 1 }
    }
  };
  
  const result = transformResponseData(response);
  
  expect(result.data).toEqual({ id: 1, name: 'Alice' });
});
```

**Integration test**:

```javascript
test('transforms actual response', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, {
    data: { id: 1, name: 'Alice' },
    meta: { total: 1 }
  });
  
  axios.interceptors.response.use(transformResponseData);
  
  const response = await axios.get('/api/users');
  
  expect(response.data).toEqual({ id: 1, name: 'Alice' });
});
```

### **Cache Updates**

**Test cache interceptor**:

```javascript
// Interceptor
const cacheInterceptor = (cache) => (response) => {
  const key = response.config.url;
  cache.set(key, response.data);
  return response;
};

// Test
test('caches response data', async () => {
  const cache = new Map();
  const interceptor = cacheInterceptor(cache);
  
  const response = {
    config: { url: '/api/users' },
    data: [{ id: 1 }]
  };
  
  interceptor(response);
  
  expect(cache.get('/api/users')).toEqual([{ id: 1 }]);
});
```

### **Metadata Extraction**

**Test metadata extraction**:

```javascript
// Interceptor
const extractMetadata = (response) => {
  if (response.headers['x-total-count']) {
    response.data = {
      items: response.data,
      total: parseInt(response.headers['x-total-count'])
    };
  }
  
  return response;
};

// Test
test('extracts total count from header', () => {
  const response = {
    data: [{ id: 1 }, { id: 2 }],
    headers: { 'x-total-count': '100' }
  };
  
  const result = extractMetadata(response);
  
  expect(result.data).toEqual({
    items: [{ id: 1 }, { id: 2 }],
    total: 100
  });
});
```

### **Response Normalization**

**Test camelCase conversion**:

```javascript
// Interceptor
const normalizeResponseData = (response) => {
  if (response.data && typeof response.data === 'object') {
    response.data = convertKeysToCamelCase(response.data);
  }
  
  return response;
};

// Test
test('converts response keys to camelCase', () => {
  const response = {
    data: {
      user_name: 'Alice',
      email_address: 'alice@example.com'
    }
  };
  
  const result = normalizeResponseData(response);
  
  expect(result.data).toEqual({
    userName: 'Alice',
    emailAddress: 'alice@example.com'
  });
});
```

## Testing Error Interceptors

### **Error Transformations**

**Test error normalization**:

```javascript
// Interceptor
const normalizeError = (error) => {
  const normalizedError = new Error(
    error.response?.data?.message || error.message
  );
  
  normalizedError.status = error.response?.status;
  normalizedError.originalError = error;
  
  return Promise.reject(normalizedError);
};

// Test
test('normalizes API error', async () => {
  const apiError = {
    response: {
      status: 400,
      data: { message: 'Validation failed' }
    },
    message: 'Request failed with status code 400'
  };
  
  try {
    await normalizeError(apiError);
  } catch (error) {
    expect(error.message).toBe('Validation failed');
    expect(error.status).toBe(400);
  }
});
```

### **Recovery Strategies**

**Test error recovery**:

```javascript
// Interceptor
const recoverFromError = (error) => {
  if (error.response?.status === 404) {
    return { data: null }; // Return null instead of throwing
  }
  
  return Promise.reject(error);
};

// Test
test('recovers from 404 errors', async () => {
  const error = {
    response: { status: 404 }
  };
  
  const result = await recoverFromError(error);
  
  expect(result.data).toBeNull();
});

test('rejects other errors', async () => {
  const error = {
    response: { status: 500 }
  };
  
  await expect(recoverFromError(error)).rejects.toEqual(error);
});
```

### **Fallback Responses**

**Test fallback data**:

```javascript
// Interceptor
const fallbackInterceptor = (cache) => (error) => {
  const cachedData = cache.get(error.config.url);
  
  if (cachedData) {
    console.warn('Using cached data due to error');
    return { data: cachedData, fromCache: true };
  }
  
  return Promise.reject(error);
};

// Test
test('returns cached data on error', async () => {
  const cache = new Map();
  cache.set('/api/users', [{ id: 1 }]);
  
  const interceptor = fallbackInterceptor(cache);
  
  const error = {
    config: { url: '/api/users' }
  };
  
  const result = await interceptor(error);
  
  expect(result.data).toEqual([{ id: 1 }]);
  expect(result.fromCache).toBe(true);
});
```

### **Retry Logic**

**Test retry interceptor**:

```javascript
// Interceptor
const retryInterceptor = (axios) => async (error) => {
  const config = error.config;
  
  if (!config.retryCount) {
    config.retryCount = 0;
  }
  
  if (config.retryCount < 3) {
    config.retryCount++;
    return axios.request(config);
  }
  
  return Promise.reject(error);
};

// Test
test('retries failed request', async () => {
  const mockAxios = {
    request: jest.fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce({ data: { success: true } })
  };
  
  const interceptor = retryInterceptor(mockAxios);
  
  const error = {
    config: { url: '/api/users' }
  };
  
  const result = await interceptor(error);
  
  expect(mockAxios.request).toHaveBeenCalledTimes(1);
  expect(result.data.success).toBe(true);
});
```

## Testing Interceptor Chains

### **Multiple Interceptors**

**Test execution order**:

```javascript
test('request interceptors execute in reverse order', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const order = [];
  
  axios.interceptors.request.use(config => {
    order.push('first');
    return config;
  });
  
  axios.interceptors.request.use(config => {
    order.push('second');
    return config;
  });
  
  await axios.get('/api/users');
  
  expect(order).toEqual(['second', 'first']);
});

test('response interceptors execute in registration order', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const order = [];
  
  axios.interceptors.response.use(response => {
    order.push('first');
    return response;
  });
  
  axios.interceptors.response.use(response => {
    order.push('second');
    return response;
  });
  
  await axios.get('/api/users');
  
  expect(order).toEqual(['first', 'second']);
});
```

### **Data Flow**

**Test data transformation chain**:

```javascript
test('interceptors chain transforms data', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, {
    data: { user_name: 'alice_smith' }
  });
  
  // Interceptor 1: Unwrap data
  axios.interceptors.response.use(response => {
    response.data = response.data.data;
    return response;
  });
  
  // Interceptor 2: Convert to camelCase
  axios.interceptors.response.use(response => {
    response.data = {
      userName: response.data.user_name
    };
    return response;
  });
  
  // Interceptor 3: Uppercase
  axios.interceptors.response.use(response => {
    response.data.userName = response.data.userName.toUpperCase();
    return response;
  });
  
  const response = await axios.get('/api/users');
  
  expect(response.data).toEqual({ userName: 'ALICE_SMITH' });
});
```

### **Chain Interruption**

**Test interceptor rejection**:

```javascript
test('rejected interceptor stops chain', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const executed = [];
  
  axios.interceptors.request.use(config => {
    executed.push('first');
    return Promise.reject(new Error('Stopped'));
  });
  
  axios.interceptors.request.use(config => {
    executed.push('second');
    return config;
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.message).toBe('Stopped');
    expect(executed).toEqual(['second', 'first']);
    // Request never sent - first interceptor rejected
  }
});
```

## Testing Async Interceptors

### **Promise-Based Interceptors**

**Test async request interceptor**:

```javascript
// Interceptor
const asyncAuthInterceptor = async (config) => {
  const token = await fetchToken(); // Async operation
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

// Test
test('waits for async token fetch', async () => {
  const mockFetchToken = jest.fn(() => Promise.resolve('async-token'));
  
  const config = await asyncAuthInterceptor({ headers: {} });
  
  expect(config.headers.Authorization).toBe('Bearer async-token');
});
```

**Integration test**:

```javascript
test('async interceptor works with axios', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  axios.interceptors.request.use(async (config) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    config.headers['X-Async'] = 'true';
    return config;
  });
  
  await axios.get('/api/users');
  
  expect(mock.history.get[0].headers['X-Async']).toBe('true');
});
```

### **Async/Await Patterns**

**Test async response interceptor**:

```javascript
// Interceptor
const enrichResponseData = async (response) => {
  if (response.data.userId) {
    const user = await fetchUser(response.data.userId);
    response.data.user = user;
  }
  
  return response;
};

// Test
test('enriches response with user data', async () => {
  const mockFetchUser = jest.fn(() => Promise.resolve({
    id: 1,
    name: 'Alice'
  }));
  
  const response = {
    data: { userId: 1, content: 'Post content' }
  };
  
  const result = await enrichResponseData(response);
  
  expect(result.data.user).toEqual({ id: 1, name: 'Alice' });
});
```

### **Error Propagation**

**Test async error handling**:

```javascript
test('async errors propagate correctly', async () => {
  const interceptor = async (config) => {
    throw new Error('Async error');
  };
  
  await expect(interceptor({})).rejects.toThrow('Async error');
});
```

### **Timeout Handling**

**Test timeout em async interceptor**:

```javascript
// Interceptor with timeout
const timeoutInterceptor = async (config) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 1000);
  });
  
  const tokenPromise = fetchToken();
  
  const token = await Promise.race([tokenPromise, timeout]);
  
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

// Test
test('times out if token fetch takes too long', async () => {
  jest.useFakeTimers();
  
  const promise = timeoutInterceptor({ headers: {} });
  
  jest.advanceTimersByTime(1000);
  
  await expect(promise).rejects.toThrow('Timeout');
  
  jest.useRealTimers();
});
```

## Spy & Stub Patterns

### **jest.spyOn**

**Spy on interceptor**:

```javascript
test('interceptor called with config', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const interceptor = jest.fn(config => config);
  
  axios.interceptors.request.use(interceptor);
  
  await axios.get('/api/users');
  
  expect(interceptor).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/api/users',
      method: 'get'
    })
  );
});
```

### **Verifying Calls**

**Verify interceptor execution**:

```javascript
test('interceptor executes for each request', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  mock.onGet('/api/posts').reply(200, []);
  
  const interceptor = jest.fn(config => config);
  
  axios.interceptors.request.use(interceptor);
  
  await axios.get('/api/users');
  await axios.get('/api/posts');
  
  expect(interceptor).toHaveBeenCalledTimes(2);
});
```

### **Mocking Dependencies**

**Mock external dependencies**:

```javascript
// Interceptor with dependency
const createAuthInterceptor = (authService) => (config) => {
  const token = authService.getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

// Test with mock
test('uses auth service to get token', () => {
  const mockAuthService = {
    getToken: jest.fn(() => 'mock-token')
  };
  
  const interceptor = createAuthInterceptor(mockAuthService);
  
  const config = interceptor({ headers: {} });
  
  expect(mockAuthService.getToken).toHaveBeenCalled();
  expect(config.headers.Authorization).toBe('Bearer mock-token');
});
```

### **Argument Matchers**

**Match partial arguments**:

```javascript
test('interceptor called with correct URL', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const interceptor = jest.fn(config => config);
  
  axios.interceptors.request.use(interceptor);
  
  await axios.get('/api/users');
  
  expect(interceptor).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/api/users'
    })
  );
});
```

## Advanced Testing

### **Interceptor Removal**

**Test eject**:

```javascript
test('removed interceptor does not execute', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const interceptor = jest.fn(config => config);
  
  const id = axios.interceptors.request.use(interceptor);
  
  // First request - interceptor executes
  await axios.get('/api/users');
  expect(interceptor).toHaveBeenCalledTimes(1);
  
  // Remove interceptor
  axios.interceptors.request.eject(id);
  
  // Second request - interceptor NOT executed
  await axios.get('/api/users');
  expect(interceptor).toHaveBeenCalledTimes(1);
});
```

### **Conditional Interceptors**

**Test conditional execution**:

```javascript
// Interceptor
const conditionalInterceptor = (config) => {
  if (config.skipAuth) {
    return config;
  }
  
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
};

// Tests
test('adds auth when skipAuth is false', () => {
  const config = { headers: {} };
  
  const result = conditionalInterceptor(config);
  
  expect(result.headers.Authorization).toBeDefined();
});

test('skips auth when skipAuth is true', () => {
  const config = { headers: {}, skipAuth: true };
  
  const result = conditionalInterceptor(config);
  
  expect(result.headers.Authorization).toBeUndefined();
});
```

### **Testing Retry Logic**

**Test retry interceptor**:

```javascript
test('retries request up to 3 times', async () => {
  const mockAxios = {
    request: jest.fn()
      .mockRejectedValueOnce({ config: { url: '/api/users' } })
      .mockRejectedValueOnce({ config: { url: '/api/users' } })
      .mockResolvedValueOnce({ data: { success: true } })
  };
  
  const retryInterceptor = async (error) => {
    if (!error.config.retryCount) {
      error.config.retryCount = 0;
    }
    
    if (error.config.retryCount < 3) {
      error.config.retryCount++;
      return mockAxios.request(error.config);
    }
    
    return Promise.reject(error);
  };
  
  const error = { config: { url: '/api/users' } };
  
  const result = await retryInterceptor(error);
  
  expect(mockAxios.request).toHaveBeenCalledTimes(2);
  expect(result.data.success).toBe(true);
});
```

### **Testing Cache Interceptors**

**Test cache read/write**:

```javascript
// Interceptor
const cacheInterceptor = (cache) => ({
  request: (config) => {
    const cached = cache.get(config.url);
    
    if (cached) {
      config.adapter = () => Promise.resolve({
        data: cached,
        status: 200,
        statusText: 'OK (cached)',
        headers: {},
        config
      });
    }
    
    return config;
  },
  
  response: (response) => {
    cache.set(response.config.url, response.data);
    return response;
  }
});

// Tests
test('returns cached data on second request', async () => {
  const cache = new Map();
  const interceptors = cacheInterceptor(cache);
  
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, [{ id: 1 }]);
  
  axios.interceptors.request.use(interceptors.request);
  axios.interceptors.response.use(interceptors.response);
  
  // First request - cache miss
  const response1 = await axios.get('/api/users');
  expect(response1.data).toEqual([{ id: 1 }]);
  expect(mock.history.get).toHaveLength(1);
  
  // Second request - cache hit
  const response2 = await axios.get('/api/users');
  expect(response2.data).toEqual([{ id: 1 }]);
  expect(response2.statusText).toBe('OK (cached)');
  expect(mock.history.get).toHaveLength(1); // No new request
});
```

---

# 🎯 Aplicabilidade

## Quando Testar Interceptors

**Critical Logic**: Authentication, error handling, retry mechanisms.

**Cross-Cutting Concerns**: Logging, caching, transformations.

**Complex Chains**: Multiple interceptors interacting.

## Test Coverage

**Unit Tests**: Isolated interceptor functions - fast, focused.

**Integration Tests**: Interceptor + Axios - realistic behavior verification.

---

# ⚠️ Limitações

## Testing Complexity

Multiple interceptors, async behavior, side effects increase complexity.

**Solution**: Extract pure logic, use dependency injection.

## Execution Order

Request interceptors execute reverse registration order.

**Solution**: Document order dependencies, test execution sequence.

---

# 🔗 Interconexões

## Mocking Axios

Use axios-mock-adapter para verify interceptor effects (módulo anterior).

## Testing Error Scenarios

Interceptor error handling crucial (próximo módulo).

## Retry Logic

Testing retry interceptors requires special patterns (covered em resilience module).

---

# 🚀 Evolução

## Advanced Patterns

Conditional interceptors, dynamic registration, interceptor composition.

## Type Safety

TypeScript types para interceptor signatures, config modifications.

## Performance

Testing interceptor performance impact, optimization strategies.

---

**Conclusão Integrada**: Testing Axios interceptors ensures **request/response transformation logic** executes correctly através de combining **unit tests** (isolated interceptor functions testing pure logic - transformations, conditionals, data manipulation) e **integration tests** (interceptor + Axios interaction testing full request/response cycle). Testing approaches incluem: **request interceptors** (verify headers added via config.headers assertions, token injection via mock authentication service, URL modifications via config.url transformations, data normalization via camelCase conversion), **response interceptors** (verify data unwrapping, cache updates via Map/cache tracking, metadata extraction from headers, response normalization), **error interceptors** (verify error transformations, recovery strategies returning default values, fallback responses from cache, retry logic incrementing retryCount). Critical patterns: **interceptor chains** (test execution order - request interceptors reverse registration, response interceptors registration order, data flow through multiple transformations, chain interruption via Promise.reject), **async interceptors** (test promise-based logic, async/await patterns, error propagation, timeout handling), **spy/stub usage** (jest.fn para verify calls, jest.spyOn para track execution, mock dependencies via dependency injection, argument matchers para partial verification). Advanced scenarios: **interceptor removal** (test eject stops execution), **conditional interceptors** (test skipAuth flags, environment-based logic), **retry testing** (verify retry attempts, exponential backoff), **cache testing** (verify cache hits/misses, adapter override para cached responses). Testing strategy: extract interceptor logic para pure functions (easier unit testing), use axios-mock-adapter para integration tests (verify request headers, response transformations), mock external dependencies (localStorage, authentication services) via dependency injection, test error paths comprehensively (rejections, network errors, timeouts). Best practices: one assertion per test, descriptive test names, setup/teardown para interceptor cleanup, test isolation via resetHandlers/eject.