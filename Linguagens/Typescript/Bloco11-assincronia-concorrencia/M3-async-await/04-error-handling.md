# Error Handling Patterns

## 🎯 Introdução e Definição

### Definição Conceitual

**Error handling patterns com async/await** são **estratégias estruturadas** para lidar com **falhas assíncronas** de forma **robusta, escalável e manutenível**. Implementam **error recovery**, **retry logic**, **fallback strategies**, **error transformation**, e **centralized error handling**. Patterns incluem **retry with exponential backoff**, **circuit breaker**, **error aggregation**, **graceful degradation**, e **error boundaries**.

Conceitualmente, error handling patterns transformam **error management** de **reativo** (apenas catch errors) para **proativo** (anticipate e handle errors strategicamente). Implementam **resilience patterns** - sistema continua funcionando mesmo com falhas parciais. Seguem **fail-fast** ou **fail-safe** dependendo do contexto - falhar rapidamente quando recovery impossível, ou continuar com funcionalidade degradada.

**Fundamento teórico:** Error handling patterns derivam de **fault tolerance** - sistemas distribuídos precisam lidar com falhas inevitáveis. Implementam **error recovery strategies** - retry transient failures, fallback em persistent failures, circuit break em cascading failures. Seguem **separation of concerns** - error handling separado de business logic.

**Pattern básico:**
```typescript
// Basic error handling - sem patterns ❌

async function fetchDataBasic(): Promise<Data> {
  try {
    return await fetch('/api/data').then(r => r.json());
  } catch (error) {
    console.error("Error:", error);
    throw error;  // Apenas re-throw, sem recovery
  }
}

// Com patterns - retry + fallback ✅

async function fetchDataWithPatterns(): Promise<Data> {
  try {
    // Retry pattern - tenta 3x com exponential backoff
    return await retryWithBackoff(
      () => fetch('/api/data').then(r => r.json()),
      { maxRetries: 3, baseDelay: 1000 }
    );
  } catch (primaryError) {
    console.warn("Primary source failed, trying fallback");
    
    try {
      // Fallback pattern - fonte alternativa
      return await fetch('/api/data-backup').then(r => r.json());
    } catch (fallbackError) {
      // Error aggregation - combinar erros
      throw new AggregateError(
        [primaryError, fallbackError],
        'All data sources failed'
      );
    }
  }
}

// Patterns aumentam resilience
```

**Retry with exponential backoff:**
```typescript
// Retry pattern - tentar novamente com delays crescentes

interface RetryOptions {
  maxRetries: number;
  baseDelay: number;  // ms
  maxDelay?: number;
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay = 30000 } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;  // Última tentativa falhou
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Should never reach here");
}

// Usage
const data = await retryWithBackoff(
  () => fetchData(),
  { maxRetries: 3, baseDelay: 1000 }
);

// Retry para transient failures (network glitches)
```

**Error transformation:**
```typescript
// Transform low-level errors em domain-specific errors

class UserNotFoundError extends Error {
  constructor(userId: number) {
    super(`User ${userId} not found`);
    this.name = 'UserNotFoundError';
  }
}

class DatabaseError extends Error {
  constructor(message: string, public cause: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

async function getUser(userId: number): Promise<User> {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (!result) {
      throw new UserNotFoundError(userId);  // Domain error
    }
    
    return result;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw error;  // Re-throw domain errors
    }
    
    // Transform database errors
    throw new DatabaseError('Failed to fetch user', error);
  }
}

// Domain-specific errors são mais úteis que generic errors
```

**Graceful degradation:**
```typescript
// Graceful degradation - funcionalidade reduzida em vez de falha total

interface DashboardData {
  user: User;
  posts: Post[];
  stats: Stats | null;  // Optional - pode falhar
  recommendations: Recommendation[] | null;  // Optional
}

async function loadDashboard(userId: number): Promise<DashboardData> {
  // Critical data - must succeed
  const user = await fetchUser(userId);
  const posts = await fetchPosts(userId);
  
  // Non-critical data - graceful degradation
  let stats: Stats | null = null;
  try {
    stats = await fetchStats(userId);
  } catch (error) {
    console.warn("Failed to load stats:", error);
    // Continue sem stats
  }
  
  let recommendations: Recommendation[] | null = null;
  try {
    recommendations = await fetchRecommendations(userId);
  } catch (error) {
    console.warn("Failed to load recommendations:", error);
    // Continue sem recommendations
  }
  
  return { user, posts, stats, recommendations };
}

// Dashboard funciona mesmo se stats/recommendations falharem
```

### Contexto Histórico e Evolução

**Pre-2015:** Callback error-first pattern.

```javascript
// Node.js callback pattern
fs.readFile('file.txt', (error, data) => {
  if (error) {
    console.error("Error:", error);
    return;
  }
  processData(data);
});

// Error-first callbacks
```

**ES2015 (ES6):** Promise .catch() chains.

```javascript
// ES6 - Promise error handling
fetchData()
  .then(data => processData(data))
  .catch(error => {
    console.error("Error:", error);
    return fallbackData();
  });

// Chainable error handling
```

**ES2017 (ES8):** Try/catch com async/await.

```javascript
// ES2017 - try/catch
async function fetchData() {
  try {
    const data = await fetch('/api/data');
    return data.json();
  } catch (error) {
    console.error("Error:", error);
    return fallbackData();
  }
}

// Synchronous-style error handling
```

**2018+:** Error handling patterns emerge.

```typescript
// Modern - structured patterns
async function fetchDataResilience(): Promise<Data> {
  return await retryWithBackoff(
    () => fetchPrimary(),
    { maxRetries: 3 }
  ).catch(() => fetchFallback());
}

// Patterns: retry, fallback, circuit breaker
```

**TypeScript 4.0 (2020):** Unknown error types.

```typescript
// TypeScript 4.0 - unknown errors
try {
  await operation();
} catch (error: unknown) {
  if (error instanceof CustomError) {
    handleCustomError(error);
  }
}

// Type-safe error handling
```

**Modern (2020+):** Centralized error handling.

```typescript
// Modern - centralized error handlers
class ErrorHandler {
  static async handle<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      logger.error(context, error);
      metrics.recordError(context);
      return null;
    }
  }
}

// Reusable error handling
```

### Problema Fundamental que Resolve

Error handling patterns resolvem problemas de **fragile systems**, **cascading failures**, **poor user experience**, e **difficult debugging**.

**Problema 1: No Error Recovery**
```typescript
// Sem recovery - single failure = total failure ❌

async function fetchUserData(userId: number): Promise<UserData> {
  const user = await fetchUser(userId);  // Falha aqui = tudo falha
  const posts = await fetchPosts(userId);
  const comments = await fetchComments(userId);
  
  return { user, posts, comments };
}

// ✗ Network glitch = complete failure
// ✗ No retry mechanism
// ✗ No fallback
```

**Solução: Retry + fallback patterns**
```typescript
// Com recovery - resilient to transient failures ✅

async function fetchUserData(userId: number): Promise<UserData> {
  // Retry pattern para user (critical)
  const user = await retryWithBackoff(
    () => fetchUser(userId),
    { maxRetries: 3, baseDelay: 1000 }
  );
  
  // Try primary, fallback to cache
  let posts: Post[];
  try {
    posts = await fetchPosts(userId);
  } catch (error) {
    console.warn("Using cached posts");
    posts = await getCachedPosts(userId);
  }
  
  // Graceful degradation para comments
  let comments: Comment[] = [];
  try {
    comments = await fetchComments(userId);
  } catch (error) {
    console.warn("Comments unavailable");
    // Continue sem comments
  }
  
  return { user, posts, comments };
}

// ✓ Retry transient failures
// ✓ Fallback to cache
// ✓ Graceful degradation
```

**Problema 2: Cascading Failures**
```typescript
// Sem circuit breaker - failures cascade ❌

async function callExternalAPI(): Promise<Data> {
  // Se API down, TODAS requests tentam e falham
  // Waste resources, timeout delays
  return await fetch('https://failing-api.com/data').then(r => r.json());
}

// Múltiplos callers tentando failing API
Promise.all([
  callExternalAPI(),  // Timeout
  callExternalAPI(),  // Timeout
  callExternalAPI(),  // Timeout
  callExternalAPI()   // Timeout
]);

// ✗ Resources wasted em failing requests
// ✗ Delays acumulam
```

**Solução: Circuit breaker pattern**
```typescript
// Circuit breaker - para requests se API down ✅

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Se circuit OPEN, fail fast
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';  // Tentar novamente
      } else {
        throw new Error('Circuit breaker OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';  // Stop trying
    }
  }
}

const breaker = new CircuitBreaker();

// Requests fail fast se circuit OPEN
await breaker.execute(() => callExternalAPI());

// ✓ Fail fast quando API down
// ✓ Avoid wasting resources
```

**Problema 3: Poor Error Context**
```typescript
// Erros genéricos - difícil debug ❌

async function processOrder(orderId: number): Promise<void> {
  const order = await fetchOrder(orderId);
  await validateOrder(order);
  await chargePayment(order);
  await shipOrder(order);
}

// Qual step falhou? Hard to know
try {
  await processOrder(123);
} catch (error) {
  console.error("Processing failed:", error);  // Pouca informação
}
```

**Solução: Error context wrapping**
```typescript
// Error wrapping - adiciona context ✅

class OrderProcessingError extends Error {
  constructor(
    message: string,
    public orderId: number,
    public step: string,
    public cause: Error
  ) {
    super(message);
    this.name = 'OrderProcessingError';
  }
}

async function processOrder(orderId: number): Promise<void> {
  try {
    const order = await fetchOrder(orderId);
    
    try {
      await validateOrder(order);
    } catch (error) {
      throw new OrderProcessingError(
        'Validation failed',
        orderId,
        'validation',
        error
      );
    }
    
    try {
      await chargePayment(order);
    } catch (error) {
      throw new OrderProcessingError(
        'Payment failed',
        orderId,
        'payment',
        error
      );
    }
    
    try {
      await shipOrder(order);
    } catch (error) {
      throw new OrderProcessingError(
        'Shipping failed',
        orderId,
        'shipping',
        error
      );
    }
  } catch (error) {
    if (error instanceof OrderProcessingError) {
      throw error;
    }
    throw new OrderProcessingError(
      'Failed to fetch order',
      orderId,
      'fetch',
      error
    );
  }
}

// Usage
try {
  await processOrder(123);
} catch (error) {
  if (error instanceof OrderProcessingError) {
    console.error(`Order ${error.orderId} failed at ${error.step}:`, error.cause);
  }
}

// ✓ Context: order ID, step, original error
// ✓ Easy debug
```

**Problema 4: Inconsistent Error Handling**
```typescript
// Error handling duplicado em todo codebase ❌

async function fetchUser(id: number): Promise<User> {
  try {
    return await api.get(`/users/${id}`);
  } catch (error) {
    logger.error("User fetch failed:", error);
    metrics.recordError("fetchUser");
    throw error;
  }
}

async function fetchPost(id: number): Promise<Post> {
  try {
    return await api.get(`/posts/${id}`);
  } catch (error) {
    logger.error("Post fetch failed:", error);  // Duplicado
    metrics.recordError("fetchPost");           // Duplicado
    throw error;
  }
}

// ✗ Error handling duplicado
// ✗ Fácil esquecer logging/metrics
```

**Solução: Centralized error handler**
```typescript
// Centralized handler - DRY ✅

class ErrorHandler {
  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Centralized logging
      logger.error(`${context} failed:`, error);
      
      // Centralized metrics
      metrics.recordError(context);
      
      // Re-throw
      throw error;
    }
  }
}

// Usage - clean e consistent
async function fetchUser(id: number): Promise<User> {
  return ErrorHandler.withErrorHandling(
    () => api.get(`/users/${id}`),
    'fetchUser'
  );
}

async function fetchPost(id: number): Promise<Post> {
  return ErrorHandler.withErrorHandling(
    () => api.get(`/posts/${id}`),
    'fetchPost'
  );
}

// ✓ Error handling centralizado
// ✓ Logging/metrics consistentes
// ✓ Easy manter
```

**Fundamento teórico:** Error handling patterns implementam **fault tolerance** e **resilience**, transformando sistemas frágeis em **robust production systems**.

### Importância no Ecossistema

Error handling patterns são importantes porque:

- **Resilience:** Sistemas resistem a falhas
- **User experience:** Graceful degradation
- **Debugging:** Error context melhorado
- **Monitoring:** Centralized error tracking
- **Scalability:** Patterns escalam bem
- **Maintainability:** Código DRY
- **Production readiness:** Critical para prod
- **Distributed systems:** Essential em microservices

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Retry:** Tentar novamente transient failures
2. **Fallback:** Fonte alternativa quando primary falha
3. **Circuit breaker:** Stop trying quando consistently failing
4. **Error transformation:** Domain-specific errors
5. **Centralized handling:** DRY error management

### Pilares Fundamentais

- **Fault tolerance:** Sistema resiste falhas
- **Error recovery:** Recover de failures
- **Graceful degradation:** Funcionalidade reduzida vs total failure
- **Error context:** Rich error information
- **Separation of concerns:** Error handling separado de logic

### Visão Geral das Nuances

- **Exponential backoff:** Crescente delay entre retries
- **Circuit breaker states:** CLOSED, OPEN, HALF_OPEN
- **Error aggregation:** Combinar múltiplos erros
- **Timeout patterns:** Limit wait time
- **Logging integration:** Consistent error logging

## 🧠 Fundamentos Teóricos

### Retry Pattern

```typescript
async function retry<T>(
  operation: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries) throw error;
      console.log(`Retry ${i + 1}/${maxRetries}`);
    }
  }
  throw new Error("Unreachable");
}
```

**Retry:** Attempt operation multiple times.

### Princípios e Conceitos Subjacentes

#### Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: { maxRetries: number; baseDelay: number }
): Promise<T> {
  const { maxRetries, baseDelay } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Unreachable");
}

// Delays: 1s, 2s, 4s, 8s...
```

**Backoff:** Increasing delay between retries.

#### Fallback Pattern

```typescript
async function fetchWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await primary();
  } catch (primaryError) {
    console.warn("Primary failed, using fallback");
    return await fallback();
  }
}

// Usage
const data = await fetchWithFallback(
  () => fetchFromAPI(),
  () => fetchFromCache()
);
```

**Fallback:** Alternative source on failure.

### Timeout Pattern

```typescript
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
}

// Usage
const data = await withTimeout(fetchData(), 5000);
```

**Timeout:** Limit wait time.

#### Error Aggregation

```typescript
async function fetchAllWithErrors(
  ids: number[]
): Promise<{ data: Data[]; errors: Error[] }> {
  const results = await Promise.allSettled(
    ids.map(id => fetchData(id))
  );
  
  const data: Data[] = [];
  const errors: Error[] = [];
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      data.push(result.value);
    } else {
      errors.push(result.reason);
    }
  });
  
  return { data, errors };
}
```

**Aggregation:** Collect multiple errors.

#### Custom Error Classes

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Usage
if (response.status === 404) {
  throw new NetworkError('Not found', 404);
}

if (!email.includes('@')) {
  throw new ValidationError('Invalid email', 'email', email);
}
```

**Custom Errors:** Domain-specific error types.

### Real-World Example - Resilient API Client

```typescript
// Real-world - production-ready API client com error handling

class ResilientAPIClient {
  private breaker = new CircuitBreaker();
  
  async fetchUser(userId: number): Promise<User> {
    return await this.executeWithResilience(
      async () => {
        // Try primary API
        try {
          return await retryWithBackoff(
            () => this.callPrimaryAPI(`/users/${userId}`),
            { maxRetries: 3, baseDelay: 1000 }
          );
        } catch (primaryError) {
          // Fallback to backup API
          console.warn("Primary API failed, trying backup");
          return await this.callBackupAPI(`/users/${userId}`);
        }
      },
      'fetchUser'
    );
  }
  
  private async executeWithResilience<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      // Circuit breaker
      return await this.breaker.execute(operation);
    } catch (error) {
      // Logging
      logger.error(`${context} failed:`, error);
      
      // Metrics
      metrics.recordError(context);
      
      // Error transformation
      if (error instanceof NetworkError) {
        throw new APIError(
          `API request failed: ${error.message}`,
          context,
          error
        );
      }
      
      throw error;
    }
  }
  
  private async callPrimaryAPI<T>(path: string): Promise<T> {
    const response = await withTimeout(
      fetch(`https://api.primary.com${path}`),
      5000
    );
    
    if (!response.ok) {
      throw new NetworkError(
        `HTTP ${response.status}`,
        response.status
      );
    }
    
    return response.json();
  }
  
  private async callBackupAPI<T>(path: string): Promise<T> {
    const response = await fetch(`https://api.backup.com${path}`);
    return response.json();
  }
}

class APIError extends Error {
  constructor(
    message: string,
    public context: string,
    public cause: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Usage
const client = new ResilientAPIClient();
try {
  const user = await client.fetchUser(123);
  console.log(user);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API error in ${error.context}:`, error.cause);
  }
}
```

**Real-World:** Production-ready resilient client.

#### Modelo Mental para Compreensão

Pense em error handling patterns como **safety systems**:

**Retry (airbag):** Try again after bump
**Fallback (spare tire):** Use backup when main fails
**Circuit breaker (fuse):** Cut power when overload
**Timeout (timer):** Don't wait forever
**Error context (black box):** Record what happened

**Analogia - Delivery Service:**

**Retry:** Try delivery 3x
**Fallback:** Leave at neighbor if recipient not home
**Circuit breaker:** Stop delivering to consistently failing address
**Timeout:** Wait max 5 minutes
**Error log:** Record delivery failures

**Metáfora - Restaurant:**

**Retry:** Re-cook if first attempt burned
**Fallback:** Suggest alternative dish if ingredient missing
**Circuit breaker:** Stop offering dish if consistently failing
**Timeout:** Max 30min cooking time
**Error context:** Record what went wrong

## 🔍 Análise Conceitual Profunda

### Retry com Jitter

```typescript
// Jitter - randomize delay para evitar thundering herd

async function retryWithJitter<T>(
  operation: () => Promise<T>,
  options: { maxRetries: number; baseDelay: number }
): Promise<T> {
  const { maxRetries, baseDelay } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff com jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * exponentialDelay;
      const delay = exponentialDelay + jitter;
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("Unreachable");
}

// Jitter evita múltiplos clients retrying simultaneously
```

**Jitter:** Randomize retry timing.

#### Conditional Retry

```typescript
// Retry apenas para specific error types

function isRetryable(error: Error): boolean {
  if (error instanceof NetworkError) {
    return [408, 429, 500, 502, 503, 504].includes(error.statusCode);
  }
  return false;
}

async function retryIfRetryable<T>(
  operation: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryable(error) || i === maxRetries) {
        throw error;
      }
      console.log(`Retryable error, attempt ${i + 1}/${maxRetries}`);
    }
  }
  throw new Error("Unreachable");
}

// Não retry 404s, validation errors, etc
```

**Conditional:** Retry only retryable errors.

### Bulkhead Pattern

```typescript
// Bulkhead - limit concurrent operations

class Bulkhead {
  private running = 0;
  
  constructor(private maxConcurrent: number) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.running++;
    try {
      return await operation();
    } finally {
      this.running--;
    }
  }
}

const bulkhead = new Bulkhead(5);  // Max 5 concurrent

// Limit concurrent API calls
await bulkhead.execute(() => callAPI());
```

**Bulkhead:** Limit concurrent operations.

## 🎯 Aplicabilidade e Contextos

### API Calls

```typescript
const data = await retryWithBackoff(
  () => fetch('/api/data').then(r => r.json()),
  { maxRetries: 3, baseDelay: 1000 }
);
```

**Raciocínio:** Retry transient network failures.

### Database Operations

```typescript
async function transaction(): Promise<void> {
  try {
    await db.begin();
    await db.query1();
    await db.commit();
  } catch (error) {
    await db.rollback();
    throw error;
  }
}
```

**Raciocínio:** Rollback on error.

### File Operations

```typescript
async function readFile(path: string): Promise<string> {
  const handle = await fs.open(path);
  try {
    return await handle.readFile('utf-8');
  } finally {
    await handle.close();
  }
}
```

**Raciocínio:** Guarantee file close.

## ⚠️ Limitações e Considerações Teóricas

### Retry Can Amplify Load

```typescript
// Cuidado: retry pode sobrecarregar servidor já struggling

// ❌ Todos clients retrying = thundering herd
await retry(() => callAPI(), 10);

// ✅ Use jitter e circuit breaker
await retryWithJitter(() => 
  breaker.execute(() => callAPI()),
  { maxRetries: 3, baseDelay: 1000 }
);
```

**Consideração:** Retry can increase load.

### Fallback May Be Stale

```typescript
// Fallback data pode estar desatualizado

try {
  return await fetchLiveData();
} catch {
  return await fetchCachedData();  // Pode estar stale
}
```

**Limitação:** Fallback data may be stale.

### Circuit Breaker False Positives

```typescript
// Circuit breaker pode open por transient spike

// Se 5 falhas rápidas, circuit abre
// Mas pode ser spike temporário
```

**Consideração:** Tune thresholds carefully.

## 🔗 Interconexões Conceituais

**Relação com Try/Catch:** Foundation for patterns.

**Relação com Promises:** Promise.race for timeout.

**Relação com Async/Await:** Enables sequential retry logic.

**Relação com Error Types:** Custom errors for domain.

**Relação com Logging:** Centralized error logging.

## 🚀 Evolução e Próximos Conceitos

Dominar Error Handling Patterns prepara para:
- **Distributed systems:** Microservices resilience
- **Observability:** Error monitoring, alerting
- **Testing:** Error scenario testing
- **Circuit breakers:** Advanced implementations
- **Rate limiting:** Throttling patterns
- **Chaos engineering:** Fault injection testing
