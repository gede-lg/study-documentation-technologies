# Request Deduplication e Parallel Requests: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Request deduplication** é **padrão de otimização** que **previne múltiplos requests simultâneos** para **mesmo endpoint** (URL + params), **reutilizando promise pendente** entre chamadas concorrentes, evitando **duplicate network calls**, **bandwidth waste**, **server load desnecessário**. **Parallel requests** executam **múltiplas requests concorrentemente** usando **Promise.all** (all-or-nothing), **Promise.allSettled** (mixed success/failure), **Promise.race** (fastest wins), maximizando **throughput**, reduzindo **latency total** versus sequential execution.

Conceitualmente, **deduplication** mantém **Map** de **pending requests** (key = URL, value = Promise). Quando request iniciado, verifica se já existe promise pendente para mesmo key → **reusa promise** → múltiplos callers aguardam **mesma promise**. Quando promise resolve/reject → remove do Map. **Parallel requests** lançam requests **simultaneamente** (não sequential await) → aguardam **todas** com `Promise.all([...])` → receive **array de results** em **single await**.

```javascript
// Deduplication:
const pendingRequests = new Map();

async function fetchWithDeduplication(url) {
  // Request já em andamento?
  if (pendingRequests.has(url)) {
    console.log('Reusing pending request:', url);
    return pendingRequests.get(url); // Reusa promise
  }
  
  // Nova request - cria promise
  const promise = fetch(url)
    .then(r => r.json())
    .finally(() => {
      pendingRequests.delete(url); // Remove quando completa
    });
  
  pendingRequests.set(url, promise);
  
  return promise;
}

// Uso:
// Múltiplas chamadas simultâneas → apenas 1 request real
const [r1, r2, r3] = await Promise.all([
  fetchWithDeduplication('https://api.example.com/users'),
  fetchWithDeduplication('https://api.example.com/users'),
  fetchWithDeduplication('https://api.example.com/users')
]);
// r1 === r2 === r3 (mesma promise)

// Parallel Requests:
const [users, posts, comments] = await Promise.all([
  fetch('https://api.example.com/users').then(r => r.json()),
  fetch('https://api.example.com/posts').then(r => r.json()),
  fetch('https://api.example.com/comments').then(r => r.json())
]);
// 3 requests simultâneos (não 3 sequential awaits)
```

### Contexto Histórico e Motivação

**Evolução de Deduplication/Parallel:**

1. **Callbacks (2000s)**: Duplicate requests comuns (sem abstração)
2. **Promises (2015)**: Promise.all para parallel, manual dedup
3. **React Query/SWR (2019+)**: Automatic deduplication
4. **Modern (2020+)**: Promise.allSettled, Promise.race, AbortController

**Motivação para Deduplication:**

**SPAs** frequentemente triggam **duplicate requests**: component mounts simultâneos (React strict mode), user rapid clicks (button spam), polling (multiple tabs). **Sem deduplication**, cada trigger cria **separate request** → **bandwidth waste** (transfer mesma data N times), **server load** (process mesma query N times), **inconsistency** (responses podem divergir). **Deduplication** garante **single request** → shared result → consistência.

**Motivação para Parallel Requests:**

**Sequential requests** têm **latency acumulada**: Request1 (200ms) → await → Request2 (200ms) → await → Request3 (200ms) = **600ms total**. **Parallel** executa **simultaneamente**: Request1 + Request2 + Request3 → await all → **200ms total** (latency do slowest). **Throughput** aumenta drasticamente em dashboards (múltiplos widgets), initial page load (user, settings, notifications), batch operations.

### Problema Fundamental que Resolve

Deduplication e parallel requests resolvem:

**Deduplication:**
**1. Duplicate Requests**: Mesmo endpoint chamado N times simultaneamente
**2. Bandwidth Waste**: Transfer mesma data múltiplas vezes
**3. Server Load**: Process mesma query N times desnecessariamente
**4. Inconsistency**: Responses diferentes (race conditions)

**Parallel Requests:**
**1. Sequential Latency**: Await acumulado (N * latency)
**2. Throughput**: Baixo throughput em multiple data sources
**3. Initial Load**: Page load lento (sequential fetches)
**4. User Experience**: Delays visíveis (spinners prolongados)

### Importância no Ecossistema

Deduplication e parallel são **critical** para:

- **SPAs**: React/Vue apps com concurrent component mounts
- **Dashboards**: Multiple widgets fetching simultaneamente
- **Infinite Scroll**: Duplicate requests durante scroll rápido
- **Tabs**: Multiple browser tabs polling same endpoint
- **Performance**: Reduzir latency total (parallel)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Request Deduplication**: Reusa promise pendente (evita duplicates)
2. **Pending Map**: Map<url, Promise> tracking requests em andamento
3. **Promise.all**: Executa N promises paralelamente (all-or-nothing)
4. **Promise.allSettled**: Executa paralelamente (mixed results)
5. **Promise.race**: Retorna fastest promise (timeout, fallback)
6. **Sequential vs Parallel**: Tradeoff latency vs complexity

### Pilares Fundamentais

- **pendingRequests Map**: Cache de promises pendentes
- **Promise Reuse**: Múltiplos callers aguardam mesma promise
- **Cleanup**: Remove promise do Map quando completa
- **Promise.all**: Parallel execution, single await
- **Error Handling**: 1 failure rejects all (Promise.all)
- **Promise.allSettled**: Never rejects (status/value per promise)

### Visão Geral das Nuances

- **Cache Key**: URL + query params + method
- **Race Conditions**: Dedup evita responses divergentes
- **Network Timing**: Parallel limited por browser (6-8 concurrent)
- **Error Propagation**: Promise.all rejects on first error
- **Mixed Results**: Promise.allSettled para partial success
- **Timeout**: Promise.race com timeout promise

---

## 🧠 Fundamentos Teóricos

### Deduplication Básica

```javascript
// Map para rastrear requests pendentes

const pendingRequests = new Map();

async function fetchWithDeduplication(url) {
  // Check se request já existe
  if (pendingRequests.has(url)) {
    console.log('⚡ Reusing pending request:', url);
    return pendingRequests.get(url);
  }
  
  console.log('🌐 New request:', url);
  
  // Cria nova promise
  const promise = fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .finally(() => {
      // Remove do Map quando completa
      pendingRequests.delete(url);
      console.log('✅ Request completed, removed from pending:', url);
    });
  
  // Store promise
  pendingRequests.set(url, promise);
  
  return promise;
}

// Uso:
// Cenário: 3 components montam simultaneamente (React)
const Component1 = () => {
  const [users, setUsers] = useState(null);
  
  useEffect(() => {
    fetchWithDeduplication('https://api.example.com/users')
      .then(setUsers);
  }, []);
  
  // ...
};

const Component2 = () => {
  const [users, setUsers] = useState(null);
  
  useEffect(() => {
    fetchWithDeduplication('https://api.example.com/users')
      .then(setUsers);
  }, []);
  
  // ...
};

// Component1 e Component2 montam simultaneamente
// → apenas 1 request real
// → ambos recebem mesma data
```

### Deduplication com Cache Key

```javascript
// Cache key considera URL + query params

function getCacheKey(url, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${url}?${queryString}` : url;
}

const pendingRequests = new Map();

async function fetchWithDeduplication(url, params = {}) {
  const cacheKey = getCacheKey(url, params);
  
  if (pendingRequests.has(cacheKey)) {
    console.log('Reusing:', cacheKey);
    return pendingRequests.get(cacheKey);
  }
  
  const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
  
  const promise = fetch(fullUrl)
    .then(r => r.json())
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });
  
  pendingRequests.set(cacheKey, promise);
  
  return promise;
}

// Uso:
// Diferentes params = diferentes cache keys (não dedup)
const allUsers = fetchWithDeduplication('https://api.example.com/users');
const adminUsers = fetchWithDeduplication('https://api.example.com/users', { role: 'admin' });
// 2 requests (cache keys diferentes)

// Mesmos params = mesmo cache key (dedup)
const users1 = fetchWithDeduplication('https://api.example.com/users', { role: 'admin' });
const users2 = fetchWithDeduplication('https://api.example.com/users', { role: 'admin' });
// 1 request (mesmo cache key)
```

### Promise.all (Parallel - All-or-Nothing)

```javascript
// Promise.all executa promises paralelamente
// Rejects se QUALQUER promise rejeitar

async function fetchDashboardData() {
  console.time('Parallel');
  
  try {
    // Executa 3 requests simultaneamente
    const [users, posts, comments] = await Promise.all([
      fetch('https://api.example.com/users').then(r => r.json()),
      fetch('https://api.example.com/posts').then(r => r.json()),
      fetch('https://api.example.com/comments').then(r => r.json())
    ]);
    
    console.timeEnd('Parallel'); // ~200ms (latency do slowest)
    
    return { users, posts, comments };
    
  } catch (error) {
    // Se QUALQUER request falha, cai aqui
    console.error('At least one request failed:', error);
    throw error;
  }
}

// Comparação com Sequential:
async function fetchDashboardDataSequential() {
  console.time('Sequential');
  
  const users = await fetch('https://api.example.com/users').then(r => r.json());
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  const comments = await fetch('https://api.example.com/comments').then(r => r.json());
  
  console.timeEnd('Sequential'); // ~600ms (latency acumulada)
  
  return { users, posts, comments };
}

// Uso:
// Parallel é ~3x faster (200ms vs 600ms)
const data = await fetchDashboardData();
```

### Promise.allSettled (Parallel - Mixed Results)

```javascript
// Promise.allSettled NUNCA rejeita
// Retorna status/value para cada promise (fulfilled ou rejected)

async function fetchMultipleEndpoints(urls) {
  const promises = urls.map(url => 
    fetch(url).then(r => r.json())
  );
  
  const results = await Promise.allSettled(promises);
  
  // results = [
  //   { status: 'fulfilled', value: {...} },
  //   { status: 'rejected', reason: Error },
  //   { status: 'fulfilled', value: {...} }
  // ]
  
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  
  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
  
  console.log(`${successful.length} succeeded, ${failed.length} failed`);
  
  return { successful, failed };
}

// Uso:
const urls = [
  'https://api.example.com/users',
  'https://api.example.com/invalid', // Falha
  'https://api.example.com/posts'
];

const { successful, failed } = await fetchMultipleEndpoints(urls);

// successful = [users, posts]
// failed = [Error: HTTP 404]

// Use case: Dashboard onde alguns widgets podem falhar (mostrar partial data)
```

### Promise.race (Fastest Wins)

```javascript
// Promise.race retorna primeira promise que resolve/rejeita

// Use case 1: Timeout
async function fetchWithTimeout(url, timeout = 5000) {
  const fetchPromise = fetch(url).then(r => r.json());
  
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${timeout}ms`));
    }, timeout);
  });
  
  // Retorna whichever completa primeiro
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Uso:
try {
  const data = await fetchWithTimeout('https://slow-api.example.com/data', 3000);
  console.log('Received data:', data);
} catch (error) {
  console.error('Timed out or failed:', error);
}

// Use case 2: Fallback (multiple sources)
async function fetchFromMultipleSources(primaryUrl, fallbackUrl) {
  return Promise.race([
    fetch(primaryUrl).then(r => r.json()),
    fetch(fallbackUrl).then(r => r.json())
  ]);
}

// Usa whichever endpoint responde primeiro (fast primary ou slow fallback)
const data = await fetchFromMultipleSources(
  'https://primary.example.com/data',
  'https://fallback.example.com/data'
);
```

### Parallel com Error Handling Individual

```javascript
// Parallel requests com error handling individual (não falha tudo)

async function fetchAllWithIndividualHandling(urls) {
  const promises = urls.map(url =>
    fetch(url)
      .then(r => r.json())
      .catch(error => {
        console.error(`Failed to fetch ${url}:`, error);
        return null; // Retorna null em vez de rejeitar
      })
  );
  
  const results = await Promise.all(promises);
  
  // results pode conter null para requests falhados
  const validResults = results.filter(r => r !== null);
  
  return validResults;
}

// Uso:
const urls = [
  'https://api.example.com/users',
  'https://api.example.com/invalid', // Falha
  'https://api.example.com/posts'
];

const data = await fetchAllWithIndividualHandling(urls);

// data = [users, posts] (invalid omitido)

// Promise.all não rejeita (todas promises resolvem, algumas com null)
```

### Deduplication + Parallel Combined

```javascript
// Combining deduplication com parallel execution

const pendingRequests = new Map();

async function fetchWithDeduplication(url) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }
  
  const promise = fetch(url)
    .then(r => r.json())
    .finally(() => {
      pendingRequests.delete(url);
    });
  
  pendingRequests.set(url, promise);
  
  return promise;
}

async function fetchDashboard() {
  // Parallel execution COM deduplication
  const [users, posts, settings] = await Promise.all([
    fetchWithDeduplication('https://api.example.com/users'),
    fetchWithDeduplication('https://api.example.com/posts'),
    fetchWithDeduplication('https://api.example.com/settings')
  ]);
  
  return { users, posts, settings };
}

// Cenário:
// - 2 components montam simultaneamente
// - Ambos chamam fetchDashboard()
// - Sem deduplication: 6 requests (3 por component)
// - Com deduplication: 3 requests (shared entre components)

const Component1 = () => {
  useEffect(() => {
    fetchDashboard(); // Triggers 3 requests
  }, []);
};

const Component2 = () => {
  useEffect(() => {
    fetchDashboard(); // Reusa mesmas 3 requests
  }, []);
};
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: React Hook com Deduplication

```javascript
// Custom hook com deduplication automática

const pendingRequests = new Map();

function useFetchWithDeduplication(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      // Check pending requests
      if (pendingRequests.has(url)) {
        console.log('Reusing pending request:', url);
        
        try {
          const result = await pendingRequests.get(url);
          
          if (isMounted) {
            setData(result);
            setLoading(false);
          }
        } catch (err) {
          if (isMounted) {
            setError(err);
            setLoading(false);
          }
        }
        
        return;
      }
      
      // New request
      const promise = fetch(url)
        .then(r => r.json())
        .finally(() => {
          pendingRequests.delete(url);
        });
      
      pendingRequests.set(url, promise);
      
      try {
        const result = await promise;
        
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [url]);
  
  return { data, loading, error };
}

// Uso:
// Múltiplos components usando mesmo hook → deduplication automática
function UserList() {
  const { data: users, loading } = useFetchWithDeduplication('https://api.example.com/users');
  
  if (loading) return <p>Loading...</p>;
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

function UserCount() {
  const { data: users, loading } = useFetchWithDeduplication('https://api.example.com/users');
  
  if (loading) return <p>...</p>;
  
  return <p>Total: {users.length}</p>;
}

// UserList + UserCount montam simultaneamente → 1 request (deduplication)
```

### Pattern 2: Parallel with Progress Tracking

```javascript
// Track progress de parallel requests

async function fetchMultipleWithProgress(urls, onProgress) {
  let completed = 0;
  const total = urls.length;
  
  const promises = urls.map(url =>
    fetch(url)
      .then(r => r.json())
      .then(data => {
        completed++;
        onProgress(completed, total);
        return data;
      })
  );
  
  return Promise.all(promises);
}

// Uso:
const urls = [
  'https://api.example.com/users',
  'https://api.example.com/posts',
  'https://api.example.com/comments'
];

const results = await fetchMultipleWithProgress(urls, (completed, total) => {
  console.log(`Progress: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
  // Update progress bar
});

// Output:
// Progress: 1/3 (33%)
// Progress: 2/3 (67%)
// Progress: 3/3 (100%)
```

### Pattern 3: Retry + Deduplication

```javascript
// Deduplication com retry logic

const pendingRequests = new Map();

async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

async function fetchWithDeduplicationAndRetry(url) {
  if (pendingRequests.has(url)) {
    console.log('Reusing pending request (with retry):', url);
    return pendingRequests.get(url);
  }
  
  const promise = fetchWithRetry(url, 3)
    .finally(() => {
      pendingRequests.delete(url);
    });
  
  pendingRequests.set(url, promise);
  
  return promise;
}

// Uso:
// Múltiplas chamadas simultâneas → 1 request com retry
const [r1, r2, r3] = await Promise.all([
  fetchWithDeduplicationAndRetry('https://api.example.com/users'),
  fetchWithDeduplicationAndRetry('https://api.example.com/users'),
  fetchWithDeduplicationAndRetry('https://api.example.com/users')
]);

// Apenas 1 request real (com retry se falhar)
```

### Pattern 4: Batching Requests

```javascript
// Batch múltiplos requests individuais em single request

class RequestBatcher {
  constructor(batchFn, delay = 10) {
    this.batchFn = batchFn;
    this.delay = delay;
    this.queue = [];
    this.timeoutId = null;
  }
  
  request(id) {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.queue.push({ id, resolve, reject });
      
      // Schedule batch processing
      if (!this.timeoutId) {
        this.timeoutId = setTimeout(() => {
          this.processBatch();
        }, this.delay);
      }
    });
  }
  
  async processBatch() {
    const batch = this.queue.splice(0);
    this.timeoutId = null;
    
    if (batch.length === 0) return;
    
    console.log(`Processing batch of ${batch.length} requests`);
    
    const ids = batch.map(item => item.id);
    
    try {
      // Single request para múltiplos IDs
      const results = await this.batchFn(ids);
      
      // Resolve individual promises
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
      
    } catch (error) {
      // Reject todas
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }
}

// Batch function
async function fetchUsersBatch(ids) {
  const url = `https://api.example.com/users?ids=${ids.join(',')}`;
  const response = await fetch(url);
  return response.json(); // [user1, user2, user3]
}

const batcher = new RequestBatcher(fetchUsersBatch, 10);

// Uso:
// Múltiplas chamadas individuais dentro de 10ms → batched em single request
const user1Promise = batcher.request(1);
const user2Promise = batcher.request(2);
const user3Promise = batcher.request(3);

const [user1, user2, user3] = await Promise.all([
  user1Promise,
  user2Promise,
  user3Promise
]);

// Apenas 1 request: GET /users?ids=1,2,3
```

### Pattern 5: Parallel with Concurrency Limit

```javascript
// Limitar número de requests simultâneos (evitar overwhelm)

async function fetchWithConcurrencyLimit(urls, limit = 3) {
  const results = [];
  const executing = [];
  
  for (const [index, url] of urls.entries()) {
    const promise = fetch(url)
      .then(r => r.json())
      .then(data => {
        results[index] = data;
      });
    
    results.push(promise);
    
    if (urls.length >= limit) {
      executing.push(promise);
      
      // Remove quando completa
      promise.then(() => {
        executing.splice(executing.indexOf(promise), 1);
      });
    }
    
    // Wait se atingiu limit
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(results);
  
  return results;
}

// Uso:
const urls = Array.from({ length: 20 }, (_, i) => 
  `https://api.example.com/users/${i + 1}`
);

// Max 3 requests simultâneos (não 20)
const users = await fetchWithConcurrencyLimit(urls, 3);
```

### Pattern 6: Promise.any (First Success)

```javascript
// Promise.any retorna primeira promise que RESOLVE (ignora rejects)

async function fetchFromMirrors(urls) {
  try {
    // Retorna primeira que succeed
    const data = await Promise.any(
      urls.map(url => fetch(url).then(r => r.json()))
    );
    
    console.log('Received from fastest mirror');
    return data;
    
  } catch (error) {
    // Todas falharam (AggregateError)
    console.error('All mirrors failed:', error.errors);
    throw error;
  }
}

// Uso:
const mirrors = [
  'https://cdn1.example.com/data.json',
  'https://cdn2.example.com/data.json',
  'https://cdn3.example.com/data.json'
];

// Usa whichever mirror responde primeiro (ignora failures)
const data = await fetchFromMirrors(mirrors);

// Comparação:
// - Promise.race: Retorna primeiro (success OU failure)
// - Promise.any: Retorna primeiro SUCCESS (ignora failures)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Deduplication

**✅ Concurrent Components**: React components montando simultaneamente
**✅ Rapid Triggers**: User rapid clicks, scroll events
**✅ Polling**: Múltiplas tabs polling same endpoint
**✅ Idempotent GETs**: Read-only requests (safe dedup)

### Quando Usar Parallel Requests

**✅ Dashboard**: Múltiplos widgets independentes
**✅ Initial Load**: User, settings, notifications (parallel)
**✅ Batch Operations**: Fetch múltiplos resources
**✅ Independent Data**: Requests sem dependencies

### Quando NÃO Usar

**❌ Dedup Mutations**: POST/PUT/DELETE não devem ser dedup (side effects)
**❌ Sequential Dependencies**: Request2 depende de Request1 data
**❌ Browser Limit**: >8 parallel pode queue (HTTP/1.1 limit)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações Deduplication

**1. Mutations**: Não dedup POST/PUT/DELETE (side effects)
**2. Race Conditions**: Promise resolve order não garantida
**3. Memory**: Map cresce se requests nunca completam (leak)
**4. Cache Key**: URL + params deve uniquely identify request

### Limitações Parallel

**1. Browser Limit**: HTTP/1.1 limit ~6-8 concurrent per domain
**2. Server Load**: Parallel pode overwhelm servidor (rate limiting)
**3. Error Handling**: Promise.all fails all se 1 falha
**4. Dependencies**: Não funciona se requests dependem entre si

### Armadilhas Comuns

#### Armadilha 1: Dedup sem Cleanup

```javascript
// ❌ ERRO - Promise nunca removida do Map (memory leak)
const pending = new Map();

async function fetch(url) {
  if (pending.has(url)) {
    return pending.get(url);
  }
  
  const promise = fetch(url).then(r => r.json());
  
  pending.set(url, promise);
  
  return promise; // NUNCA remove do Map
}

// ✅ CORRETO - Cleanup com finally
const promise = fetch(url)
  .then(r => r.json())
  .finally(() => {
    pending.delete(url); // Remove quando completa
  });
```

#### Armadilha 2: Promise.all sem Error Handling

```javascript
// ❌ ERRO - 1 failure rejeita todas
const [users, posts] = await Promise.all([
  fetch('/users').then(r => r.json()),
  fetch('/posts').then(r => r.json()) // Se falha, users também falha
]);

// ✅ CORRETO - Promise.allSettled para mixed results
const results = await Promise.allSettled([
  fetch('/users').then(r => r.json()),
  fetch('/posts').then(r => r.json())
]);

const users = results[0].status === 'fulfilled' ? results[0].value : [];
const posts = results[1].status === 'fulfilled' ? results[1].value : [];
```

---

## 🔗 Interconexões Conceituais

### Relação com React Query/SWR

**Libraries** implementam deduplication automaticamente (query keys).

### Relação com HTTP/2 Multiplexing

**HTTP/2** permite unlimited parallel (sem browser limit).

### Relação com GraphQL

**GraphQL** batching (DataLoader) agrupa múltiplas queries.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Streaming**: Fetch com ReadableStream para large data
2. **Offline**: Service Workers para offline-first
3. **WebSockets**: Real-time bidirectional communication

---

## 📚 Conclusão

Request deduplication e parallel requests são **padrões essenciais** para SPAs performáticas.

Dominar deduplication/parallel significa:
- **Pending Map**: Rastrear requests em andamento (reusa promises)
- **Cleanup**: Remove promises quando completam (evita leaks)
- **Promise.all**: Parallel execution (all-or-nothing)
- **Promise.allSettled**: Mixed results (partial success)
- **Promise.race**: Fastest wins (timeout, fallback)
- **Concurrency Limit**: Evitar overwhelm (max N simultâneos)

É crítico para dashboards, initial loads, e apps com múltiplos components concorrentes.
