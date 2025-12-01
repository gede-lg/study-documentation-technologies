# 🎯 Introdução

**Testing Error Scenarios** com Axios envolve verificar que application **handles HTTP errors, network failures, timeouts, e edge cases gracefully**, ensuring robust error handling, appropriate user feedback, e application stability quando requests fail. Error scenarios são ubiquitous em real-world applications - networks falham, servers crash, timeouts occur, APIs return errors - e untested error paths frequentemente contêm critical bugs que surface em production.

Fundamental challenge é **comprehensive coverage**: applications must handle diverse error types (network errors sem response, HTTP errors com response.status, timeout errors, cancellation errors, validation errors), cada requiring different handling logic. Testing exige simulating cada scenario reliably, verificando appropriate error handling (logging, user notifications, fallback strategies, retry attempts), e ensuring application doesn't crash ou enter invalid state.

Error types incluem: **Network errors** (ECONNABORTED, ETIMEDOUT, ENOTFOUND, ENETUNREACH - no response object), **HTTP errors** (4xx client errors like 400 Bad Request, 401 Unauthorized, 404 Not Found; 5xx server errors like 500 Internal Server Error, 503 Service Unavailable - response.status contains code), **Timeout errors** (request exceeds timeout configuration), **Cancellation errors** (request cancelled via AbortController/CancelToken), **Validation errors** (custom validateStatus rejecting responses), **Interceptor errors** (errors thrown em request/response interceptors).

Testing approaches variam: **axios-mock-adapter** provides `.networkError()`, `.timeout()`, `.reply(statusCode)` para simulate errors deterministically; **jest.mock()** allows `mockRejectedValue()` para simulate promise rejections; **MSW** supports error responses via `res.networkError()`, `ctx.status(500)`; **real requests** (integration tests) podem test actual server error responses mas são slower e less deterministic.

Critical testing aspects incluem: **error structure validation** (verify error.response, error.request, error.message, error.code properties), **error handling logic** (verify try/catch blocks, error transformations, logging calls), **user-facing behavior** (verify error messages displayed, fallback UI rendered, notifications shown), **recovery strategies** (verify retries attempted, fallback data used, circuit breakers triggered), **state management** (verify loading states cleared, error states set correctly).

Este módulo explora comprehensive error scenario testing: desde network errors e HTTP errors simulation, através de timeout e cancellation testing, até validation errors, interceptor errors, retry logic verification, fallback strategies, e error boundaries testing. Objetivo é fornecer complete understanding para building resilient, well-tested error handling em Axios applications.

---

# 📋 Sumário

### **Error Types Overview**
- Network errors
- HTTP errors (4xx, 5xx)
- Timeout errors
- Cancellation errors
- Validation errors
- Interceptor errors

### **Simulating Network Errors**
- axios-mock-adapter.networkError()
- jest.mock rejections
- MSW network errors
- Error structure validation

### **Testing HTTP Errors**
- 4xx client errors
- 5xx server errors
- Error response data
- Status code assertions

### **Testing Timeouts**
- Request timeout configuration
- Timeout error detection
- Timeout recovery
- Partial response handling

### **Testing Cancellation**
- AbortController cancellation
- CancelToken cancellation
- Cleanup verification
- Race condition handling

### **Testing Validation Errors**
- validateStatus configuration
- Custom validation logic
- Rejecting success responses
- Accepting error responses

### **Testing Interceptor Errors**
- Request interceptor errors
- Response interceptor errors
- Error propagation
- Interceptor recovery

### **Testing Retry Logic**
- Retry attempt verification
- Exponential backoff testing
- Max retry limits
- Conditional retries

### **Testing Fallback Strategies**
- Cache fallbacks
- Default values
- Alternative endpoints
- Stale data usage

### **Error Boundaries & React**
- Error boundary integration
- Component error handling
- Error state management
- User notifications

---

# 🧠 Fundamentos

## Error Types Overview

### **Network Errors**

**No response object**:

```javascript
// Network error structure
{
  message: 'Network Error',
  code: 'ERR_NETWORK', // or ECONNABORTED, ETIMEDOUT
  request: XMLHttpRequest,
  response: undefined // ⚠️ No response
}
```

**Common network errors**:

- `ECONNABORTED`: Connection aborted
- `ETIMEDOUT`: Connection timed out
- `ENOTFOUND`: DNS lookup failed
- `ENETUNREACH`: Network unreachable

### **HTTP Errors**

**Response object present**:

```javascript
// HTTP error structure (4xx/5xx)
{
  message: 'Request failed with status code 404',
  code: 'ERR_BAD_REQUEST',
  request: XMLHttpRequest,
  response: {
    status: 404,
    statusText: 'Not Found',
    data: { error: 'User not found' },
    headers: {},
    config: {}
  }
}
```

**4xx client errors**:

- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource não exists

**5xx server errors**:

- `500 Internal Server Error`: Server error
- `502 Bad Gateway`: Upstream server error
- `503 Service Unavailable`: Server overloaded
- `504 Gateway Timeout`: Upstream timeout

### **Timeout Errors**

```javascript
{
  message: 'timeout of 5000ms exceeded',
  code: 'ECONNABORTED',
  request: XMLHttpRequest,
  response: undefined
}
```

### **Cancellation Errors**

```javascript
// AbortController
{
  message: 'canceled',
  code: 'ERR_CANCELED',
  request: XMLHttpRequest
}

// Axios.isCancel(error) === true
```

### **Validation Errors**

```javascript
// validateStatus rejected response
{
  message: 'Request failed with status code 200',
  response: {
    status: 200, // Rejected despite 200 status
    data: { invalid: 'data' }
  }
}
```

### **Interceptor Errors**

```javascript
// Error thrown em interceptor
{
  message: 'Custom error from interceptor',
  // May not have request/response depending on when thrown
}
```

## Simulating Network Errors

### **axios-mock-adapter.networkError()**

**Simulate network error**:

```javascript
import MockAdapter from 'axios-mock-adapter';

test('handles network error', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').networkError();
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.message).toBe('Network Error');
    expect(error.response).toBeUndefined();
  }
});
```

**Verify error structure**:

```javascript
test('network error has correct structure', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').networkError();
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.message).toBe('Network Error');
    expect(error.request).toBeDefined();
    expect(error.response).toBeUndefined();
    expect(error.config).toBeDefined();
  }
});
```

### **jest.mock() Rejections**

**Mock rejected promise**:

```javascript
jest.mock('axios');

test('handles network error', async () => {
  const networkError = new Error('Network Error');
  networkError.request = {};
  
  axios.get.mockRejectedValue(networkError);
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.message).toBe('Network Error');
  }
});
```

### **MSW Network Errors**

**MSW network error**:

```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res.networkError('Failed to connect');
  })
);

test('handles network error', async () => {
  try {
    await fetch('/api/users');
  } catch (error) {
    expect(error.message).toContain('Failed to connect');
  }
});
```

### **Error Structure Validation**

**Comprehensive validation**:

```javascript
test('validates complete error structure', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').networkError();
  
  try {
    await axios.get('/api/users');
    fail('Should have thrown error');
  } catch (error) {
    // Message
    expect(error.message).toBe('Network Error');
    
    // Code
    expect(error.code).toBe('ERR_NETWORK');
    
    // Request present
    expect(error.request).toBeDefined();
    
    // Response absent
    expect(error.response).toBeUndefined();
    
    // Config present
    expect(error.config).toBeDefined();
    expect(error.config.url).toBe('/api/users');
  }
});
```

## Testing HTTP Errors

### **4xx Client Errors**

**400 Bad Request**:

```javascript
test('handles 400 Bad Request', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onPost('/api/users').reply(400, {
    error: 'Validation failed',
    details: {
      email: 'Email is required',
      name: 'Name is required'
    }
  });
  
  try {
    await axios.post('/api/users', {});
  } catch (error) {
    expect(error.response.status).toBe(400);
    expect(error.response.data.error).toBe('Validation failed');
    expect(error.response.data.details.email).toBe('Email is required');
  }
});
```

**401 Unauthorized**:

```javascript
test('handles 401 Unauthorized', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/protected').reply(401, {
    error: 'Unauthorized'
  });
  
  try {
    await axios.get('/api/protected');
  } catch (error) {
    expect(error.response.status).toBe(401);
    expect(error.response.data.error).toBe('Unauthorized');
  }
});
```

**403 Forbidden**:

```javascript
test('handles 403 Forbidden', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onDelete('/api/admin/users/1').reply(403, {
    error: 'Forbidden',
    message: 'Insufficient permissions'
  });
  
  try {
    await axios.delete('/api/admin/users/1');
  } catch (error) {
    expect(error.response.status).toBe(403);
    expect(error.response.data.message).toBe('Insufficient permissions');
  }
});
```

**404 Not Found**:

```javascript
test('handles 404 Not Found', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users/999').reply(404, {
    error: 'User not found'
  });
  
  try {
    await axios.get('/api/users/999');
  } catch (error) {
    expect(error.response.status).toBe(404);
    expect(error.response.data.error).toBe('User not found');
  }
});
```

### **5xx Server Errors**

**500 Internal Server Error**:

```javascript
test('handles 500 Internal Server Error', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(500, {
    error: 'Internal server error',
    message: 'Database connection failed'
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.response.status).toBe(500);
    expect(error.response.data.error).toBe('Internal server error');
  }
});
```

**502 Bad Gateway**:

```javascript
test('handles 502 Bad Gateway', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(502, {
    error: 'Bad Gateway',
    message: 'Upstream server error'
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.response.status).toBe(502);
  }
});
```

**503 Service Unavailable**:

```javascript
test('handles 503 Service Unavailable', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(503, {
    error: 'Service Unavailable',
    retryAfter: 60
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.response.status).toBe(503);
    expect(error.response.data.retryAfter).toBe(60);
  }
});
```

**504 Gateway Timeout**:

```javascript
test('handles 504 Gateway Timeout', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(504, {
    error: 'Gateway Timeout'
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.response.status).toBe(504);
  }
});
```

### **Error Response Data**

**Access error data**:

```javascript
test('accesses error response data', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onPost('/api/users').reply(400, {
    error: 'Validation failed',
    fields: {
      email: ['Email is required', 'Email must be valid'],
      password: ['Password too short']
    }
  });
  
  try {
    await axios.post('/api/users', {});
  } catch (error) {
    const { data } = error.response;
    
    expect(data.error).toBe('Validation failed');
    expect(data.fields.email).toHaveLength(2);
    expect(data.fields.password[0]).toBe('Password too short');
  }
});
```

### **Status Code Assertions**

**Assert specific codes**:

```javascript
test('different errors have different status codes', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/unauthorized').reply(401);
  mock.onGet('/api/notfound').reply(404);
  mock.onGet('/api/error').reply(500);
  
  const errors = await Promise.allSettled([
    axios.get('/api/unauthorized'),
    axios.get('/api/notfound'),
    axios.get('/api/error')
  ]);
  
  expect(errors[0].reason.response.status).toBe(401);
  expect(errors[1].reason.response.status).toBe(404);
  expect(errors[2].reason.response.status).toBe(500);
});
```

## Testing Timeouts

### **Request Timeout Configuration**

**Test timeout error**:

```javascript
test('throws timeout error', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').timeout();
  
  try {
    await axios.get('/api/users', { timeout: 1000 });
  } catch (error) {
    expect(error.code).toBe('ECONNABORTED');
    expect(error.message).toContain('timeout');
  }
});
```

**Simulate slow response**:

```javascript
test('times out on slow response', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, { data: [] }]);
      }, 2000); // 2 second delay
    });
  });
  
  try {
    await axios.get('/api/users', { timeout: 1000 });
  } catch (error) {
    expect(error.code).toBe('ECONNABORTED');
  }
});
```

### **Timeout Error Detection**

**Detect timeout vs other errors**:

```javascript
const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' && 
         error.message.includes('timeout');
};

test('identifies timeout errors', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').timeout();
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(isTimeoutError(error)).toBe(true);
  }
});

test('distinguishes timeout from network error', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').networkError();
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(isTimeoutError(error)).toBe(false);
  }
});
```

### **Timeout Recovery**

**Test retry on timeout**:

```javascript
test('retries on timeout', async () => {
  const mock = new MockAdapter(axios);
  
  let attempts = 0;
  
  mock.onGet('/api/users').reply(() => {
    attempts++;
    
    if (attempts < 3) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, []]);
        }, 2000);
      });
    }
    
    return [200, [{ id: 1 }]];
  });
  
  const retryRequest = async (config, maxRetries = 3) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await axios.request(config);
      } catch (error) {
        lastError = error;
        
        if (error.code !== 'ECONNABORTED') {
          throw error;
        }
      }
    }
    
    throw lastError;
  };
  
  const response = await retryRequest({
    method: 'GET',
    url: '/api/users',
    timeout: 1000
  });
  
  expect(response.data).toEqual([{ id: 1 }]);
  expect(attempts).toBe(3);
});
```

### **Partial Response Handling**

**Test download timeout**:

```javascript
test('handles partial download timeout', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/large-file').reply(() => {
    // Simulate partial response then timeout
    return new Promise((_, reject) => {
      setTimeout(() => {
        const error = new Error('timeout');
        error.code = 'ECONNABORTED';
        reject(error);
      }, 1000);
    });
  });
  
  try {
    await axios.get('/api/large-file', { timeout: 1000 });
  } catch (error) {
    expect(error.code).toBe('ECONNABORTED');
    // Verify cleanup logic runs
  }
});
```

## Testing Cancellation

### **AbortController Cancellation**

**Test cancellation**:

```javascript
test('cancels request with AbortController', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, []]);
      }, 1000);
    });
  });
  
  const controller = new AbortController();
  
  const promise = axios.get('/api/users', {
    signal: controller.signal
  });
  
  controller.abort();
  
  try {
    await promise;
  } catch (error) {
    expect(axios.isCancel(error)).toBe(true);
    expect(error.message).toBe('canceled');
  }
});
```

**Test cleanup**:

```javascript
test('cleanup runs on cancellation', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const cleanup = jest.fn();
  
  const controller = new AbortController();
  
  const promise = axios.get('/api/users', {
    signal: controller.signal
  }).catch((error) => {
    if (axios.isCancel(error)) {
      cleanup();
    }
    throw error;
  });
  
  controller.abort();
  
  await expect(promise).rejects.toThrow('canceled');
  expect(cleanup).toHaveBeenCalled();
});
```

### **CancelToken Cancellation**

**Test CancelToken**:

```javascript
test('cancels request with CancelToken', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const source = axios.CancelToken.source();
  
  const promise = axios.get('/api/users', {
    cancelToken: source.token
  });
  
  source.cancel('Operation cancelled by user');
  
  try {
    await promise;
  } catch (error) {
    expect(axios.isCancel(error)).toBe(true);
    expect(error.message).toBe('Operation cancelled by user');
  }
});
```

### **Cleanup Verification**

**Verify cleanup logic**:

```javascript
test('cleanup runs on cancel', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const onCancel = jest.fn();
  
  const source = axios.CancelToken.source();
  
  const promise = axios.get('/api/users', {
    cancelToken: source.token
  }).catch((error) => {
    if (axios.isCancel(error)) {
      onCancel();
    }
    throw error;
  });
  
  source.cancel();
  
  await expect(promise).rejects.toThrow();
  expect(onCancel).toHaveBeenCalled();
});
```

### **Race Condition Handling**

**Test cancel after completion**:

```javascript
test('handles cancel after request completes', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  const controller = new AbortController();
  
  const response = await axios.get('/api/users', {
    signal: controller.signal
  });
  
  // Cancel after completion
  controller.abort();
  
  expect(response.data).toEqual([]);
});
```

## Testing Validation Errors

### **validateStatus Configuration**

**Test custom validation**:

```javascript
test('rejects 200 response with invalid data', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(200, {
    invalid: 'data'
  });
  
  try {
    await axios.get('/api/users', {
      validateStatus: (status) => {
        return status === 200 && hasValidData(response.data);
      }
    });
  } catch (error) {
    expect(error.response.status).toBe(200);
  }
});
```

### **Custom Validation Logic**

**Test validation function**:

```javascript
const validateResponse = (status, data) => {
  if (status !== 200) return false;
  
  if (!data || !Array.isArray(data.items)) {
    return false;
  }
  
  return true;
};

test('validates response structure', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/valid').reply(200, {
    items: [{ id: 1 }]
  });
  
  mock.onGet('/api/invalid').reply(200, {
    invalid: 'structure'
  });
  
  // Valid
  const validResponse = await axios.get('/api/valid', {
    validateStatus: (status) => status === 200
  });
  expect(validateResponse(validResponse.status, validResponse.data)).toBe(true);
  
  // Invalid
  const invalidResponse = await axios.get('/api/invalid', {
    validateStatus: (status) => status === 200
  });
  expect(validateResponse(invalidResponse.status, invalidResponse.data)).toBe(false);
});
```

### **Rejecting Success Responses**

**Test reject on invalid success**:

```javascript
test('rejects 200 with invalid data', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users').reply(200, null);
  
  try {
    await axios.get('/api/users', {
      validateStatus: (status) => status === 200,
      transformResponse: [(data) => {
        if (data === null) {
          throw new Error('Invalid response data');
        }
        return data;
      }]
    });
  } catch (error) {
    expect(error.message).toBe('Invalid response data');
  }
});
```

### **Accepting Error Responses**

**Test accept 404 as valid**:

```javascript
test('accepts 404 as valid response', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/users/999').reply(404, {
    error: 'Not found'
  });
  
  const response = await axios.get('/api/users/999', {
    validateStatus: (status) => status === 404 || status === 200
  });
  
  expect(response.status).toBe(404);
  expect(response.data.error).toBe('Not found');
});
```

## Testing Interceptor Errors

### **Request Interceptor Errors**

**Test error thrown em request interceptor**:

```javascript
test('handles request interceptor error', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  axios.interceptors.request.use(() => {
    throw new Error('Request interceptor error');
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.message).toBe('Request interceptor error');
  }
});
```

### **Response Interceptor Errors**

**Test error thrown em response interceptor**:

```javascript
test('handles response interceptor error', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(200, []);
  
  axios.interceptors.response.use(() => {
    throw new Error('Response interceptor error');
  });
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(error.message).toBe('Response interceptor error');
  }
});
```

### **Error Propagation**

**Test error propagates through interceptors**:

```javascript
test('error propagates through interceptor chain', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(500);
  
  const errorHandler = jest.fn((error) => Promise.reject(error));
  
  axios.interceptors.response.use(
    (response) => response,
    errorHandler
  );
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(errorHandler).toHaveBeenCalled();
    expect(error.response.status).toBe(500);
  }
});
```

### **Interceptor Recovery**

**Test interceptor recovers from error**:

```javascript
test('interceptor recovers from error', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(404);
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 404) {
        return { data: [] }; // Return empty array instead of error
      }
      return Promise.reject(error);
    }
  );
  
  const response = await axios.get('/api/users');
  
  expect(response.data).toEqual([]);
});
```

## Testing Retry Logic

### **Retry Attempt Verification**

**Test retry count**:

```javascript
test('retries request 3 times', async () => {
  const mock = new MockAdapter(axios);
  
  let attempts = 0;
  
  mock.onGet('/api/users').reply(() => {
    attempts++;
    
    if (attempts < 3) {
      return [500, { error: 'Server error' }];
    }
    
    return [200, [{ id: 1 }]];
  });
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      
      if (!config.retryCount) {
        config.retryCount = 0;
      }
      
      if (config.retryCount < 3 && error.response?.status >= 500) {
        config.retryCount++;
        return axios.request(config);
      }
      
      return Promise.reject(error);
    }
  );
  
  const response = await axios.get('/api/users');
  
  expect(attempts).toBe(3);
  expect(response.data).toEqual([{ id: 1 }]);
});
```

### **Exponential Backoff Testing**

**Test backoff delays**:

```javascript
test('uses exponential backoff', async () => {
  const mock = new MockAdapter(axios);
  
  const delays = [];
  const startTimes = [];
  
  let attempts = 0;
  
  mock.onGet('/api/users').reply(() => {
    attempts++;
    
    if (attempts < 4) {
      return [500, { error: 'Server error' }];
    }
    
    return [200, [{ id: 1 }]];
  });
  
  const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      
      if (!config.retryCount) {
        config.retryCount = 0;
      }
      
      if (config.retryCount < 3 && error.response?.status >= 500) {
        config.retryCount++;
        
        const backoffDelay = Math.pow(2, config.retryCount) * 100;
        delays.push(backoffDelay);
        
        startTimes.push(Date.now());
        await delay(backoffDelay);
        
        return axios.request(config);
      }
      
      return Promise.reject(error);
    }
  );
  
  await axios.get('/api/users');
  
  expect(delays).toEqual([200, 400, 800]);
});
```

### **Max Retry Limits**

**Test max retries**:

```javascript
test('stops after max retries', async () => {
  const mock = new MockAdapter(axios);
  
  let attempts = 0;
  
  mock.onGet('/api/users').reply(() => {
    attempts++;
    return [500, { error: 'Server error' }];
  });
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      
      if (!config.retryCount) {
        config.retryCount = 0;
      }
      
      if (config.retryCount < 3) {
        config.retryCount++;
        return axios.request(config);
      }
      
      return Promise.reject(error);
    }
  );
  
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(attempts).toBe(4); // Initial + 3 retries
    expect(error.response.status).toBe(500);
  }
});
```

### **Conditional Retries**

**Test retry only specific errors**:

```javascript
test('retries only 5xx errors', async () => {
  const mock = new MockAdapter(axios);
  
  let attempts500 = 0;
  let attempts404 = 0;
  
  mock.onGet('/api/users').reply(() => {
    attempts500++;
    return [500, { error: 'Server error' }];
  });
  
  mock.onGet('/api/missing').reply(() => {
    attempts404++;
    return [404, { error: 'Not found' }];
  });
  
  const shouldRetry = (error) => {
    return error.response?.status >= 500;
  };
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      
      if (!config.retryCount) {
        config.retryCount = 0;
      }
      
      if (config.retryCount < 3 && shouldRetry(error)) {
        config.retryCount++;
        return axios.request(config);
      }
      
      return Promise.reject(error);
    }
  );
  
  // 500 - retried
  try {
    await axios.get('/api/users');
  } catch (error) {
    expect(attempts500).toBe(4); // Initial + 3 retries
  }
  
  // 404 - NOT retried
  try {
    await axios.get('/api/missing');
  } catch (error) {
    expect(attempts404).toBe(1); // Only initial request
  }
});
```

## Testing Fallback Strategies

### **Cache Fallbacks**

**Test cache fallback on error**:

```javascript
test('uses cached data on error', async () => {
  const cache = new Map();
  cache.set('/api/users', [{ id: 1, name: 'Cached User' }]);
  
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').networkError();
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const cachedData = cache.get(error.config.url);
      
      if (cachedData) {
        return { data: cachedData, fromCache: true };
      }
      
      return Promise.reject(error);
    }
  );
  
  const response = await axios.get('/api/users');
  
  expect(response.data).toEqual([{ id: 1, name: 'Cached User' }]);
  expect(response.fromCache).toBe(true);
});
```

### **Default Values**

**Test default value fallback**:

```javascript
test('returns default value on error', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(500);
  
  const fetchUsersWithFallback = async () => {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (error) {
      return []; // Default empty array
    }
  };
  
  const users = await fetchUsersWithFallback();
  
  expect(users).toEqual([]);
});
```

### **Alternative Endpoints**

**Test fallback endpoint**:

```javascript
test('tries alternative endpoint on error', async () => {
  const mock = new MockAdapter(axios);
  
  mock.onGet('/api/v2/users').networkError();
  mock.onGet('/api/v1/users').reply(200, [{ id: 1 }]);
  
  const fetchUsers = async () => {
    try {
      return await axios.get('/api/v2/users');
    } catch (error) {
      console.warn('Primary endpoint failed, trying fallback');
      return await axios.get('/api/v1/users');
    }
  };
  
  const response = await fetchUsers();
  
  expect(response.data).toEqual([{ id: 1 }]);
});
```

### **Stale Data Usage**

**Test stale-while-revalidate**:

```javascript
test('returns stale data while revalidating', async () => {
  const cache = new Map();
  cache.set('/api/users', {
    data: [{ id: 1, name: 'Stale User' }],
    timestamp: Date.now() - 10000 // 10 seconds old
  });
  
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([200, [{ id: 1, name: 'Fresh User' }]]);
      }, 1000);
    });
  });
  
  const fetchUsers = async () => {
    const cached = cache.get('/api/users');
    
    // Return stale data immediately
    const stalePromise = Promise.resolve(cached.data);
    
    // Fetch fresh data em background
    const freshPromise = axios.get('/api/users').then((response) => {
      cache.set('/api/users', {
        data: response.data,
        timestamp: Date.now()
      });
      return response.data;
    });
    
    return stalePromise;
  };
  
  const users = await fetchUsers();
  
  expect(users).toEqual([{ id: 1, name: 'Stale User' }]);
});
```

## Error Boundaries & React

### **Error Boundary Integration**

**Test error boundary catches errors**:

```javascript
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';

test('error boundary catches axios error', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(500);
  
  const ErrorFallback = ({ error }) => (
    <div>Error: {error.message}</div>
  );
  
  const Component = () => {
    const [users, setUsers] = React.useState([]);
    
    React.useEffect(() => {
      axios.get('/api/users').then((response) => {
        setUsers(response.data);
      }).catch((error) => {
        throw error; // Throw to error boundary
      });
    }, []);
    
    return <div>Users: {users.length}</div>;
  };
  
  render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component />
    </ErrorBoundary>
  );
  
  await screen.findByText(/Error:/);
});
```

### **Component Error Handling**

**Test component error state**:

```javascript
test('component displays error message', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(500, {
    error: 'Server error'
  });
  
  const Component = () => {
    const [error, setError] = React.useState(null);
    
    React.useEffect(() => {
      axios.get('/api/users').catch((err) => {
        setError(err.response?.data?.error || 'Unknown error');
      });
    }, []);
    
    if (error) {
      return <div>Error: {error}</div>;
    }
    
    return <div>Loading...</div>;
  };
  
  render(<Component />);
  
  await screen.findByText('Error: Server error');
});
```

### **Error State Management**

**Test error state updates**:

```javascript
test('error state updates correctly', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(500);
  
  const { result } = renderHook(() => {
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await axios.get('/api/users');
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    return { error, loading, fetchUsers };
  });
  
  await act(async () => {
    await result.current.fetchUsers();
  });
  
  expect(result.current.error).toBeDefined();
  expect(result.current.error.response.status).toBe(500);
  expect(result.current.loading).toBe(false);
});
```

### **User Notifications**

**Test error notification**:

```javascript
test('displays error notification', async () => {
  const mock = new MockAdapter(axios);
  mock.onGet('/api/users').reply(404);
  
  const notify = jest.fn();
  
  const fetchUsers = async () => {
    try {
      await axios.get('/api/users');
    } catch (error) {
      if (error.response?.status === 404) {
        notify('error', 'Users not found');
      }
    }
  };
  
  await fetchUsers();
  
  expect(notify).toHaveBeenCalledWith('error', 'Users not found');
});
```

---

# 🎯 Aplicabilidade

## Quando Testar Error Scenarios

**All HTTP Operations**: GET, POST, PUT, DELETE - every request can fail.

**Critical User Flows**: Authentication, payments, data submission.

**Error Handling Logic**: Retry mechanisms, fallbacks, recovery strategies.

## Coverage Strategy

**Network Errors**: Test offline scenarios, connection failures.

**HTTP Errors**: Test 4xx (client errors), 5xx (server errors).

**Timeouts**: Test slow responses, partial downloads.

**Edge Cases**: Cancellation, validation failures, interceptor errors.

---

# ⚠️ Limitações

## Mock Accuracy

Mocked errors may não perfectly match real errors.

**Solution**: Combine unit tests (mocked) com integration tests (real API).

## Error Diversity

Infinite error variations em real world.

**Solution**: Test common scenarios, critical paths, edge cases.

---

# 🔗 Interconexões

## Mocking Axios

Use axios-mock-adapter para simulate errors (módulo anterior).

## Testing Interceptors

Error interceptors critical para error handling (módulo anterior).

## Retry Logic

Testing retry strategies ensures resilience (covered em resilience module).

---

# 🚀 Evolução

## Advanced Error Handling

Circuit breakers, exponential backoff, fallback chains.

## Error Monitoring

Integration com error tracking services (Sentry, Rollbar).

## Type Safety

TypeScript types para error handling, error boundaries.

---

**Conclusão Integrada**: Testing error scenarios com Axios ensures **robust error handling** através de comprehensive coverage de diverse failure modes: **network errors** (no response - ECONNABORTED, ETIMEDOUT, ENOTFOUND - simulated via mock.networkError(), validated via error.response undefined), **HTTP errors** (response present - 4xx client errors like 400/401/403/404, 5xx server errors like 500/502/503/504 - simulated via mock.reply(statusCode), validated via error.response.status/data), **timeout errors** (ECONNABORTED com timeout message - simulated via mock.timeout() ou delayed reply, validated via error.code), **cancellation errors** (AbortController/CancelToken - simulated via controller.abort()/source.cancel(), validated via axios.isCancel()), **validation errors** (custom validateStatus rejecting responses - tested via validateStatus configuration), **interceptor errors** (thrown em request/response interceptors - tested via interceptor error throws). Testing patterns incluem: **error structure validation** (verify error.message, error.code, error.request, error.response, error.config properties), **retry logic verification** (test retry attempts count, exponential backoff delays, max retry limits, conditional retries baseados em error type), **fallback strategies** (test cache fallbacks returning cached data on error, default values, alternative endpoints, stale-while-revalidate patterns), **React integration** (test error boundaries catching errors, component error state management, user notifications). Critical testing aspects: **error detection** (distinguish timeout vs network vs HTTP errors via error.code/response.status), **error recovery** (verify interceptors recover from errors, return fallback data, trigger retries), **cleanup verification** (ensure cancellation cleanup runs, loading states cleared, resources released), **user-facing behavior** (verify error messages displayed, fallback UI rendered, notifications shown). Best practices: test ALL error types comprehensively (network + HTTP + timeout + cancellation), use axios-mock-adapter para deterministic error simulation, combine unit tests (isolated error handling logic) com integration tests (error handling em context), verify error propagation through interceptor chains, test edge cases (cancel after completion, timeout during retry, validation rejecting success responses).