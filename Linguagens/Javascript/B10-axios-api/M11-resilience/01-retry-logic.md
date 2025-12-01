# 🎯 Introdução

**Retry logic** é estratégia fundamental de resilience que permite aplicações **automaticamente tentar novamente requests que falharam devido a erros transientes** (falhas temporárias de rede, server timeouts, rate limiting, server overload), em vez de falhar imediatamente e forçar user a manual retry. Esta abordagem drasticamente melhora user experience e application reliability, especialmente em ambientes com network instability ou distributed systems sujeitos a occasional failures.

O problema central que retry logic resolve é **transient failures**: muitos erros HTTP são temporários e self-resolving - network blip de 500ms, server momentaneamente sobrecarregado retornando 503, rate limit temporário (429 Too Many Requests), DNS lookup timeout. Sem retry logic, estes failures resultam em error messages para user, mesmo que tentar novamente 1 segundo depois seria successful. Retry automático transforma failure transiente em success transparente.

Entretanto, retry logic deve ser **inteligente e seletivo**: nem todos errors devem ser retried (4xx client errors como 400 Bad Request ou 404 Not Found não serão resolvidos por retry), e retries ilimitados podem piorar situation (amplificar load em server sobrecarregado, esgotar client resources). Effective retry strategies implementam **conditional retries** (apenas para errors retriable), **limited attempts** (máximo 3-5 retries típico), e **delays entre retries** (evitar hammering server).

Axios não possui built-in retry functionality, mas bibliotecas como `axios-retry` fornecem production-ready implementations com features como configurable retry conditions, exponential backoff delays, e retry count limits. Alternativamente, implementar custom retry logic via interceptors oferece controle fine-grained sobre retry behavior, permitindo strategies específicas para diferentes endpoints ou error types.

Este módulo explora retry logic em profundidade: desde fundamentals de transient vs permanent errors e retry decision criteria, através de implementation patterns (interceptor-based, library-based), até advanced strategies como conditional retries, idempotency considerations, e integration com circuit breakers. Objetivo é fornecer knowledge completo para implementar robust retry mechanisms que melhoram application reliability sem introduzir side effects indesejados.

---

# 📋 Sumário

### **Retry Fundamentals**
- Transient vs permanent errors
- Retriable error codes
- Idempotency considerations
- Retry limits

### **Manual Retry Implementation**
- Try-catch retry loop
- Recursive retry
- Promise-based retry
- Limitations

### **Interceptor-Based Retry**
- Response interceptor pattern
- Tracking retry attempts
- Conditional retry logic
- Error propagation

### **axios-retry Library**
- Installation e setup
- Configuration options
- Retry conditions
- Per-request overrides

### **Retry Decision Logic**
- HTTP status codes (5xx, 429, 408)
- Network errors (ECONNABORTED, ETIMEDOUT)
- Custom conditions
- Blacklist vs whitelist

### **Idempotency & Safety**
- Safe methods (GET, HEAD, OPTIONS)
- Idempotent methods (PUT, DELETE)
- Non-idempotent POST risks
- Idempotency keys

### **Advanced Patterns**
- Retry com timeout
- Per-endpoint retry config
- Retry callbacks (onRetry)
- Metrics e logging

### **Best Practices**
- Limitar retry attempts (3-5 max)
- Apenas retry transient errors
- Implementar delays (exponential backoff)
- Respeitar Retry-After header

---

# 🧠 Fundamentos

## Retry Fundamentals

### **Transient vs Permanent Errors**

**Transient Errors** (temporários - retriable):
- Network timeouts (ETIMEDOUT, ECONNABORTED)
- Server overload (503 Service Unavailable)
- Rate limiting (429 Too Many Requests)
- Server restart (502 Bad Gateway, 504 Gateway Timeout)
- Database connection pool exhausted (temporary 500)

**Permanent Errors** (não retriable):
- Client errors (400 Bad Request, 404 Not Found, 401 Unauthorized)
- Business logic errors (422 Unprocessable Entity)
- Forbidden (403)
- Not Implemented (501)

**Rule**: Retry apenas transient errors que podem self-resolve.

### **Retriable Error Codes**

**HTTP Status Codes** apropriados para retry:

- **408** Request Timeout
- **429** Too Many Requests (com delay - respeitar Retry-After)
- **500** Internal Server Error (se transient)
- **502** Bad Gateway
- **503** Service Unavailable
- **504** Gateway Timeout

**Network Errors**:
- `ECONNABORTED` - Connection aborted
- `ETIMEDOUT` - Request timeout
- `ENOTFOUND` - DNS lookup failed
- `ECONNRESET` - Connection reset

**Never Retry**:
- **4xx Client Errors** (exceto 408, 429)
- **401/403** Authentication/authorization (retry não resolve)

### **Idempotency Considerations**

**Idempotent Operations**: Executar múltiplas vezes produz mesmo resultado.

**Safe para Retry**:
- **GET, HEAD, OPTIONS** (read-only, sem side effects)
- **PUT** (replace resource - idempotent por definição)
- **DELETE** (second delete de mesmo resource retorna 404, mas state é idêntico)

**Risky para Retry**:
- **POST** (pode criar duplicate resources)
  - Exemplo: Retry de POST `/api/orders` pode criar 2 orders

**Solution**: Idempotency keys (ver seção posterior).

### **Retry Limits**

**Max Attempts**: Limitar retries previne infinite loops.

**Typical Values**:
- **3 retries** (4 total attempts) - common default
- **5 retries** (6 total attempts) - para mission-critical requests
- **1 retry** (2 total attempts) - para requests não críticos

**Total Timeout**: Limitar tempo total incluindo retries.

```javascript
// Max 3 retries com 30s total timeout
const maxRetries = 3;
const timeoutPerRequest = 10000; // 10s
const totalTimeout = 30000; // 30s
```

## Manual Retry Implementation

### **Try-Catch Retry Loop**

**Simple retry** com for loop:

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      lastError = error;
      
      // Don't retry on last attempt
      if (attempt < maxRetries) {
        console.log(`Attempt ${attempt + 1} failed, retrying...`);
        await sleep(1000); // 1s delay
      }
    }
  }
  
  throw lastError;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

**Usage**:
```javascript
try {
  const data = await fetchWithRetry('/api/user', 3);
  console.log(data);
} catch (error) {
  console.error('All retries failed:', error.message);
}
```

### **Recursive Retry**

```javascript
async function fetchWithRetry(url, maxRetries = 3, attempt = 0) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (attempt >= maxRetries) {
      throw error;
    }
    
    console.log(`Attempt ${attempt + 1} failed, retrying...`);
    await sleep(1000);
    
    return fetchWithRetry(url, maxRetries, attempt + 1);
  }
}
```

### **Promise-Based Retry**

```javascript
function retry(promiseFn, maxRetries = 3, delay = 1000) {
  return promiseFn().catch(error => {
    if (maxRetries <= 0) {
      throw error;
    }
    
    return sleep(delay).then(() => 
      retry(promiseFn, maxRetries - 1, delay)
    );
  });
}

// Usage
const data = await retry(
  () => axios.get('/api/user'),
  3,
  1000
);
```

### **Limitations de Manual Retry**

**Problemas**:
- Repetitive boilerplate para cada request
- Difícil gerenciar retry config por endpoint
- Não integra com Axios interceptors
- Retry logic misturado com business logic

**Solution**: Interceptor-based retry ou library.

## Interceptor-Based Retry

### **Response Interceptor Pattern**

```javascript
const MAX_RETRIES = 3;

axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Initialize retry count
    if (!config.__retryCount) {
      config.__retryCount = 0;
    }
    
    // Check if should retry
    const shouldRetry = 
      config.__retryCount < MAX_RETRIES &&
      isRetriableError(error);
    
    if (!shouldRetry) {
      return Promise.reject(error);
    }
    
    // Increment retry count
    config.__retryCount++;
    
    console.log(`Retrying request (attempt ${config.__retryCount})...`);
    
    // Delay before retry
    await sleep(1000);
    
    // Retry request
    return axios(config);
  }
);

function isRetriableError(error) {
  if (!error.response) {
    // Network error - retriable
    return true;
  }
  
  const status = error.response.status;
  
  // Retry 5xx and 429
  return status >= 500 || status === 429 || status === 408;
}
```

**Usage** (transparente):
```javascript
// Retry happens automatically
const response = await axios.get('/api/user');
```

### **Tracking Retry Attempts**

**Store metadata** em config:

```javascript
axios.interceptors.response.use(
  response => {
    // Log successful attempts
    if (response.config.__retryCount > 0) {
      console.log(`Request succeeded after ${response.config.__retryCount} retries`);
    }
    return response;
  },
  async error => {
    const config = error.config;
    
    config.__retryCount = config.__retryCount || 0;
    config.__startTime = config.__startTime || Date.now();
    
    if (config.__retryCount < MAX_RETRIES && isRetriableError(error)) {
      config.__retryCount++;
      
      const elapsed = Date.now() - config.__startTime;
      console.log(`Retry ${config.__retryCount}/${MAX_RETRIES} (${elapsed}ms elapsed)`);
      
      await sleep(1000 * config.__retryCount); // Increasing delay
      
      return axios(config);
    }
    
    // Log failure
    console.error(`Request failed after ${config.__retryCount} retries`);
    
    return Promise.reject(error);
  }
);
```

### **Conditional Retry Logic**

**Different strategies** por endpoint:

```javascript
const retryConfig = {
  '/api/critical': { maxRetries: 5, delay: 2000 },
  '/api/normal': { maxRetries: 3, delay: 1000 },
  '/api/optional': { maxRetries: 1, delay: 500 }
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    const endpoint = config.url;
    
    // Get retry config for endpoint
    const retrySettings = Object.keys(retryConfig).find(pattern => 
      endpoint.includes(pattern)
    );
    
    const { maxRetries = 3, delay = 1000 } = retrySettings 
      ? retryConfig[retrySettings] 
      : {};
    
    config.__retryCount = config.__retryCount || 0;
    
    if (config.__retryCount < maxRetries && isRetriableError(error)) {
      config.__retryCount++;
      await sleep(delay);
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);
```

### **Error Propagation**

**Adicionar retry info** ao error:

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    config.__retryCount = config.__retryCount || 0;
    
    if (config.__retryCount < MAX_RETRIES && isRetriableError(error)) {
      config.__retryCount++;
      await sleep(1000);
      return axios(config);
    }
    
    // Augment error with retry info
    error.retriesExhausted = true;
    error.totalAttempts = config.__retryCount + 1;
    
    return Promise.reject(error);
  }
);

// Handle error
try {
  await axios.get('/api/data');
} catch (error) {
  if (error.retriesExhausted) {
    console.error(`Failed after ${error.totalAttempts} attempts`);
  }
}
```

## axios-retry Library

### **Installation**

```bash
npm install axios-retry
```

### **Basic Setup**

```javascript
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Configure retry
axiosRetry(axios, {
  retries: 3,               // Max retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
  retryCondition: (error) => {
    // Retry network errors e 5xx
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status === 503;
  }
});

// Usar normalmente - retry automático
const response = await axios.get('/api/user');
```

### **Configuration Options**

```javascript
axiosRetry(axios, {
  // Number of retry attempts
  retries: 3,
  
  // Retry condition function
  retryCondition: (error) => {
    return error.response?.status >= 500;
  },
  
  // Retry delay (ms or function)
  retryDelay: (retryCount, error) => {
    return retryCount * 1000; // Linear: 1s, 2s, 3s
  },
  
  // Should reset timeout on retry
  shouldResetTimeout: true,
  
  // Callback on retry
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry attempt ${retryCount}`, error.message);
  }
});
```

### **Retry Conditions**

**Built-in Conditions**:

```javascript
// Network errors e idempotent requests (GET, HEAD, OPTIONS, PUT, DELETE)
axiosRetry.isNetworkOrIdempotentRequestError(error);

// Apenas network errors
axiosRetry.isNetworkError(error);

// Idempotent request errors
axiosRetry.isIdempotentRequestError(error);

// Retry after error (429 com Retry-After header)
axiosRetry.isRetryableError(error);
```

**Custom Condition**:

```javascript
axiosRetry(axios, {
  retries: 3,
  retryCondition: (error) => {
    // Retry apenas 503 e network errors
    return !error.response || error.response.status === 503;
  }
});
```

**Complex Logic**:

```javascript
axiosRetry(axios, {
  retries: 5,
  retryCondition: (error) => {
    // Network error - always retry
    if (!error.response) return true;
    
    const status = error.response.status;
    
    // Retry 5xx
    if (status >= 500) return true;
    
    // Retry 429 (rate limit)
    if (status === 429) return true;
    
    // Retry 408 (timeout)
    if (status === 408) return true;
    
    // Don't retry other errors
    return false;
  }
});
```

### **Per-Request Overrides**

**Override global config** para specific request:

```javascript
// Global config
axiosRetry(axios, { retries: 3 });

// Override para specific request
await axios.get('/api/critical', {
  'axios-retry': {
    retries: 10,
    retryDelay: (retryCount) => retryCount * 2000
  }
});

// Disable retry para specific request
await axios.post('/api/create', data, {
  'axios-retry': {
    retries: 0
  }
});
```

## Retry Decision Logic

### **HTTP Status Codes**

**Retriable**:

```javascript
function isRetriableStatus(status) {
  return [408, 429, 500, 502, 503, 504].includes(status);
}
```

**Detailed Logic**:

```javascript
function shouldRetryStatus(status, method) {
  // 408 Request Timeout - retry
  if (status === 408) return true;
  
  // 429 Too Many Requests - retry com delay
  if (status === 429) return true;
  
  // 5xx Server Errors
  if (status >= 500 && status < 600) {
    // 501 Not Implemented - permanent, don't retry
    if (status === 501) return false;
    
    // Other 5xx - retry
    return true;
  }
  
  // 4xx Client Errors - don't retry (exceto 408, 429)
  if (status >= 400 && status < 500) return false;
  
  return false;
}
```

### **Network Errors**

```javascript
function isNetworkError(error) {
  if (!error.code) return false;
  
  const networkErrorCodes = [
    'ECONNABORTED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ECONNRESET',
    'ECONNREFUSED',
    'ENETUNREACH'
  ];
  
  return networkErrorCodes.includes(error.code);
}
```

### **Custom Conditions**

**Business-Specific Logic**:

```javascript
function shouldRetry(error) {
  // Network error - retry
  if (isNetworkError(error)) return true;
  
  // No response - network issue - retry
  if (!error.response) return true;
  
  const { status, data } = error.response;
  
  // Server error - retry
  if (status >= 500) return true;
  
  // Rate limit - retry
  if (status === 429) return true;
  
  // Custom: Temporary database lock error
  if (status === 500 && data?.error?.includes('database lock')) {
    return true;
  }
  
  // Custom: Queue full error
  if (status === 503 && data?.error === 'QUEUE_FULL') {
    return true;
  }
  
  return false;
}
```

### **Blacklist vs Whitelist**

**Blacklist Approach** (retry tudo exceto...):

```javascript
function shouldRetry(error) {
  if (!error.response) return true; // Network - retry
  
  const status = error.response.status;
  
  // Blacklist: Don't retry these
  const blacklist = [400, 401, 403, 404, 422];
  
  return !blacklist.includes(status);
}
```

**Whitelist Approach** (retry apenas...):

```javascript
function shouldRetry(error) {
  if (!error.response) return true; // Network - retry
  
  const status = error.response.status;
  
  // Whitelist: Only retry these
  const whitelist = [408, 429, 500, 502, 503, 504];
  
  return whitelist.includes(status);
}
```

**Recommendation**: **Whitelist** é mais seguro (explicit sobre o que retry).

## Idempotency & Safety

### **Safe Methods**

**GET, HEAD, OPTIONS**: Read-only, sem side effects.

```javascript
function isSafeMethod(method) {
  return ['get', 'head', 'options'].includes(method.toLowerCase());
}

function shouldRetry(error) {
  const config = error.config;
  
  // Always retry safe methods
  if (isSafeMethod(config.method)) {
    return isRetriableError(error);
  }
  
  // More cautious com non-safe methods
  return false;
}
```

### **Idempotent Methods**

**PUT, DELETE**: Idempotent por HTTP spec.

```javascript
function isIdempotentMethod(method) {
  return ['get', 'head', 'options', 'put', 'delete'].includes(
    method.toLowerCase()
  );
}

axiosRetry(axios, {
  retries: 3,
  retryCondition: (error) => {
    return isIdempotentMethod(error.config.method) &&
           isRetriableError(error);
  }
});
```

### **Non-Idempotent POST Risks**

**Problem**: Retry de POST pode criar duplicates.

```javascript
// ❌ Risky: Retry pode criar 2 orders
await axios.post('/api/orders', { item: 'Book', qty: 1 });
```

**First request** times out → **Retry** → **Both succeed** → 2 orders criadas.

### **Idempotency Keys**

**Solution**: Include idempotency key no request.

```javascript
import { v4 as uuidv4 } from 'uuid';

const idempotencyKey = uuidv4();

await axios.post('/api/orders', 
  { item: 'Book', qty: 1 },
  {
    headers: {
      'Idempotency-Key': idempotencyKey
    },
    'axios-retry': { retries: 3 }
  }
);
```

**Server-Side**:
- Store idempotency key com request result
- Se receive request com mesmo key, return cached result em vez de re-execute
- Garante mesmo POST retried múltiplas vezes executa apenas uma vez

**Client Interceptor** (auto-add idempotency keys):

```javascript
axios.interceptors.request.use(config => {
  if (config.method === 'post' && !config.headers['Idempotency-Key']) {
    config.headers['Idempotency-Key'] = uuidv4();
  }
  return config;
});
```

## Advanced Patterns

### **Retry com Timeout**

**Total timeout** incluindo retries:

```javascript
async function fetchWithRetryAndTimeout(url, maxRetries = 3, totalTimeout = 30000) {
  const startTime = Date.now();
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const elapsed = Date.now() - startTime;
    const remainingTime = totalTimeout - elapsed;
    
    if (remainingTime <= 0) {
      throw new Error('Total timeout exceeded');
    }
    
    try {
      const response = await axios.get(url, {
        timeout: Math.min(10000, remainingTime) // Per-request timeout
      });
      
      return response.data;
    } catch (error) {
      if (attempt < maxRetries && isRetriableError(error)) {
        await sleep(1000);
      } else {
        throw error;
      }
    }
  }
}
```

### **Per-Endpoint Retry Config**

```javascript
const endpointRetryConfig = new Map([
  ['/api/critical', { retries: 10, delay: 2000 }],
  ['/api/user', { retries: 5, delay: 1000 }],
  ['/api/analytics', { retries: 1, delay: 500 }]
]);

axios.interceptors.request.use(config => {
  const url = config.url;
  
  // Find matching config
  for (const [pattern, retryConfig] of endpointRetryConfig) {
    if (url.includes(pattern)) {
      config['axios-retry'] = retryConfig;
      break;
    }
  }
  
  return config;
});
```

### **Retry Callbacks (onRetry)**

**Log, metrics, notifications**:

```javascript
axiosRetry(axios, {
  retries: 3,
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`[Retry ${retryCount}] ${requestConfig.method.toUpperCase()} ${requestConfig.url}`);
    console.log(`  Reason: ${error.message}`);
    console.log(`  Status: ${error.response?.status}`);
    
    // Send metrics
    analytics.track('axios_retry', {
      url: requestConfig.url,
      attempt: retryCount,
      error: error.message
    });
    
    // Alert on multiple retries
    if (retryCount >= 3) {
      alerting.warn(`Request failing repeatedly: ${requestConfig.url}`);
    }
  }
});
```

### **Metrics e Logging**

```javascript
class RetryMetrics {
  constructor() {
    this.stats = {
      totalRetries: 0,
      successAfterRetry: 0,
      failedAfterRetry: 0,
      byEndpoint: new Map()
    };
  }
  
  recordRetry(url, retryCount, success) {
    this.stats.totalRetries++;
    
    if (success) {
      this.stats.successAfterRetry++;
    } else {
      this.stats.failedAfterRetry++;
    }
    
    const endpointStats = this.stats.byEndpoint.get(url) || { retries: 0, success: 0, failed: 0 };
    endpointStats.retries++;
    if (success) endpointStats.success++;
    else endpointStats.failed++;
    
    this.stats.byEndpoint.set(url, endpointStats);
  }
  
  getReport() {
    return {
      ...this.stats,
      successRate: (this.stats.successAfterRetry / this.stats.totalRetries * 100).toFixed(2) + '%'
    };
  }
}

const metrics = new RetryMetrics();

axiosRetry(axios, {
  retries: 3,
  onRetry: (retryCount, error, config) => {
    metrics.recordRetry(config.url, retryCount, false);
  }
});

axios.interceptors.response.use(
  response => {
    if (response.config.__retryCount > 0) {
      metrics.recordRetry(response.config.url, response.config.__retryCount, true);
    }
    return response;
  }
);

// Log metrics periodically
setInterval(() => {
  console.log('Retry Metrics:', metrics.getReport());
}, 60000);
```

## Best Practices

### **1. Limitar Retry Attempts**

```javascript
// ✅ Reasonable limit
axiosRetry(axios, { retries: 3 });

// ❌ Too many retries
axiosRetry(axios, { retries: 100 }); // Excessive
```

### **2. Apenas Retry Transient Errors**

```javascript
// ✅ Selective retry
retryCondition: (error) => {
  if (!error.response) return true; // Network
  const status = error.response.status;
  return status >= 500 || status === 429;
}

// ❌ Retry everything (including 4xx)
retryCondition: () => true; // Bad
```

### **3. Implementar Delays**

```javascript
// ✅ Delay entre retries
retryDelay: (retryCount) => retryCount * 1000;

// ❌ Immediate retry (hammering server)
retryDelay: () => 0;
```

### **4. Respeitar Retry-After Header**

```javascript
axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount, error) => {
    // Check Retry-After header (429 responses)
    const retryAfter = error.response?.headers['retry-after'];
    
    if (retryAfter) {
      // Retry-After pode ser seconds ou HTTP date
      const delay = parseInt(retryAfter, 10);
      return delay ? delay * 1000 : 5000;
    }
    
    // Default exponential backoff
    return Math.pow(2, retryCount) * 1000;
  }
});
```

### **5. Cuidado com POST/PATCH**

```javascript
// ✅ Apenas retry idempotent methods
retryCondition: (error) => {
  const method = error.config.method;
  const idempotent = ['get', 'head', 'options', 'put', 'delete'];
  
  return idempotent.includes(method) && isRetriableError(error);
}

// ⚠️ Se retry POST, use idempotency keys
await axios.post('/api/orders', data, {
  headers: { 'Idempotency-Key': uuidv4() }
});
```

---

# 🎯 Aplicabilidade

## Quando Usar Retry Logic

**Network Instability**: Mobile apps, public WiFi, poor connectivity.

**Distributed Systems**: Microservices com occasional failures.

**Rate-Limited APIs**: 429 errors que resolvem após delay.

**Load Spikes**: Server temporarily overloaded (503).

## Quando NÃO Usar

**User Input Validation**: 400/422 errors não são transient.

**Authentication**: 401/403 não resolvem com retry.

**Not Found**: 404 não será resolvido retrying.

---

# ⚠️ Limitações

## Amplification de Load

Retries aumentam load no server - se server está sobrecarregado, retries podem piorar.

**Solution**: Exponential backoff, circuit breakers.

## Duplicate Requests

Retry de non-idempotent operations pode criar duplicates.

**Solution**: Idempotency keys.

## Delayed Failures

Múltiplos retries atrasam feedback para user.

**Solution**: Limitar retries e total timeout.

---

# 🔗 Interconexões

## Exponential Backoff

Retry logic deve usar delays crescentes entre attempts (próximo módulo).

## Circuit Breakers

Retry integra com circuit breakers para stop retrying quando sistema está degraded.

## Timeout

Retry deve respeitar timeouts totais.

---

# 🚀 Evolução

## Service Mesh

Service meshes (Istio, Linkerd) implementam retry logic no infrastructure level.

## Chaos Engineering

Testing retry logic com fault injection (Chaos Monkey).

## Observability

Distributed tracing (OpenTelemetry) para track retries através de microservices.

---

**Conclusão Integrada**: Retry logic é fundamental resilience strategy que transforma transient failures em transparent successes, drasticamente melhorando user experience e application reliability. Effective retry implementations são selective (apenas retriable errors como 5xx, 429, network timeouts), limited (3-5 max attempts), e delayed (exponential backoff para evitar hammering server). Axios não possui built-in retry, mas `axios-retry` library fornece production-ready implementation com configurable conditions, delays, e callbacks. Interceptor-based custom implementations oferecem fine-grained control para per-endpoint strategies. Critical considerations incluem idempotency (safe para GET/PUT/DELETE, risky para POST sem idempotency keys), respecting Retry-After headers, e limiting total timeout incluindo retries. Best practices: whitelist approach para retry conditions (explicit sobre o que retry), implementar metrics/logging para monitor retry patterns, integrar com circuit breakers para prevent retry storms, e sempre balance entre reliability improvements e não amplificar load em degraded systems.