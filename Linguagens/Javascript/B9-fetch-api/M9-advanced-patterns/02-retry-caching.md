# Retry Logic e Caching: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Retry logic** é **padrão de resiliência** que **automaticamente retenta requests falhados** (network errors, 5xx server errors) após **delay configurável**, usando **exponential backoff** (aumentar delay progressivamente) e **jitter** (randomização para evitar thundering herd), melhorando **reliability** e **user experience** em ambientes instáveis. **Caching** armazena **responses** de requests **GET idempotentes** em **memória** (Map, WeakMap) ou **browser storage** (localStorage, sessionStorage, Cache API), com **TTL** (Time-To-Live) para invalidação automática e **cache invalidation** em **mutations** (POST/PUT/DELETE), reduzindo **latência**, **bandwidth**, **server load**.

Conceitualmente, **retry** aplica **backoff strategy**: tentativa falha → espera delay (ex: 1s) → retry → falha → espera delay*2 (2s) → retry → até **max retries** atingido. **Jitter** adiciona **random offset** ao delay (evitar que múltiplos clients retrying simultaneamente sobrecarreguem servidor). **Caching** segue **cache-first** (verificar cache antes de fetch) ou **network-first** (fetch, fallback cache), com **TTL** (expire após N segundos/minutos), **cache invalidation** (clear cache em updates), **cache keys** (URL + params).

```javascript
// Retry com Exponential Backoff:
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Caching Básico:
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

async function fetchWithCache(url) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  // Cache hit (não expirado)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit:', cacheKey);
    return cached.data;
  }
  
  // Cache miss ou expirado
  console.log('Cache miss:', cacheKey);
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Store em cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}
```

### Contexto Histórico e Motivação

**Evolução de Retry/Caching:**

1. **Manual Retries (2000s)**: Developers implementavam retry manualmente
2. **Library Support (2010s)**: Axios, fetch-retry (abstrações)
3. **Service Workers (2016)**: Cache API para offline-first
4. **React Query/SWR (2019+)**: Caching/retry declarativo
5. **Modern (2020+)**: Exponential backoff, jitter, cache invalidation

**Motivação para Retry:**

**Network** é **unreliable**: timeouts, DNS failures, connection drops, server overload. **Transient failures** (temporários) podem **succeed** em retry. **Retry logic** automatiza tentativas, melhorando **success rate** sem user intervention. **Exponential backoff** evita **overwhelm** servidor (progressive delays). **Jitter** evita **thundering herd** (múltiplos clients retrying simultaneamente).

**Motivação para Caching:**

**Same data** é **fetched repeatedly**: user lista (dashboard), config (cada request). **Caching** reduz **latency** (instant response), **bandwidth** (menos transfers), **server load** (menos requests). **TTL** garante **freshness** (expire após N tempo). **Invalidation** em mutations garante **consistency** (cache atualizado após POST/PUT/DELETE).

### Problema Fundamental que Resolve

Retry e caching resolvem:

**Retry:**
**1. Transient Failures**: Network timeouts, DNS issues, 503 server overload
**2. Reliability**: Aumentar success rate automaticamente
**3. User Experience**: Evitar errors em failures temporários
**4. Server Protection**: Exponential backoff + jitter evita overwhelm

**Caching:**
**1. Latency**: Response instantâneo (cached)
**2. Bandwidth**: Reduzir data transfers
**3. Server Load**: Menos requests ao servidor
**4. Offline Support**: Fallback cache quando network indisponível

### Importância no Ecossistema

Retry e caching são **critical** para:

- **Mobile Apps**: Network instável (retry), bandwidth limitado (cache)
- **High-Traffic Apps**: Reduzir server load (cache)
- **Real-time Apps**: Retry automático sem user intervention
- **Offline-First**: Cache API para offline support
- **Resilience**: Production apps resistentes a failures

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Retry Logic**: Automaticamente retentar requests falhados
2. **Exponential Backoff**: Delay aumenta exponencialmente (1s, 2s, 4s, 8s)
3. **Jitter**: Random offset no delay (evitar thundering herd)
4. **Caching**: Armazenar responses em memória/storage
5. **TTL**: Time-To-Live (expire cache)
6. **Cache Invalidation**: Clear cache em mutations

### Pilares Fundamentais

- **fetchWithRetry()**: Retry com max attempts
- **Exponential Backoff**: delay = 2^attempt * base
- **Jitter**: delay += random(0, delay * 0.1)
- **Cache Keys**: URL + query params
- **Cache Storage**: Map, localStorage, Cache API
- **TTL**: timestamp + maxAge

### Visão Geral das Nuances

- **Retry Conditions**: Network errors, 5xx (não 4xx)
- **Max Retries**: Limit (evitar infinite loop)
- **Backoff Base**: 1000ms (configurável)
- **Cache-First**: Check cache → fetch se miss
- **Network-First**: Fetch → fallback cache se fail
- **Invalidation**: POST/PUT/DELETE clear cache

---

## 🧠 Fundamentos Teóricos

### Retry Básico (Fixed Delay)

```javascript
// Retry com fixed delay

async function fetchWithRetry(url, options = {}, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1}`);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retry after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('All retries failed');
  throw lastError;
}

// Uso:
try {
  const data = await fetchWithRetry('https://api.example.com/users', {}, 3, 1000);
  console.log('Success:', data);
} catch (error) {
  console.error('Failed after retries:', error);
}

// Flow (se todas falham):
// Attempt 1 → fail → wait 1s
// Attempt 2 → fail → wait 1s
// Attempt 3 → fail → wait 1s
// Attempt 4 → fail → throw error
```

### Exponential Backoff

```javascript
// Retry com exponential backoff (delay aumenta exponencialmente)

async function fetchWithExponentialBackoff(url, options = {}, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff: 2^attempt * baseDelay
        const delay = Math.pow(2, attempt) * baseDelay;
        
        console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Uso:
await fetchWithExponentialBackoff('https://api.example.com/users', {}, 3, 1000);

// Delays:
// Attempt 0 fails → wait 2^0 * 1000 = 1000ms (1s)
// Attempt 1 fails → wait 2^1 * 1000 = 2000ms (2s)
// Attempt 2 fails → wait 2^2 * 1000 = 4000ms (4s)
// Attempt 3 fails → throw error

// Total time (se todas falham): ~7 seconds
```

### Jitter (Randomização)

```javascript
// Exponential backoff com jitter (evita thundering herd)

function calculateDelay(attempt, baseDelay = 1000, maxDelay = 32000) {
  // Exponential backoff
  const exponentialDelay = Math.pow(2, attempt) * baseDelay;
  
  // Cap delay
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  
  // Jitter: random offset (±10% do delay)
  const jitter = cappedDelay * 0.1 * (Math.random() * 2 - 1);
  
  const finalDelay = cappedDelay + jitter;
  
  return Math.max(0, finalDelay); // Ensure positive
}

async function fetchWithJitter(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = calculateDelay(attempt);
        
        console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay.toFixed(0)}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Benefício:
// Múltiplos clients retrying simultaneamente terão delays ligeiramente diferentes
// (evita thundering herd - todos clients hitting server no mesmo instant)
```

### Retry Conditions (Selective Retry)

```javascript
// Retry apenas em specific errors (não retry 4xx client errors)

function shouldRetry(error) {
  // Network errors (fetch rejection)
  if (!error.response) {
    return true;
  }
  
  // Server errors (5xx) - retry
  if (error.response.status >= 500 && error.response.status < 600) {
    return true;
  }
  
  // Rate limiting (429) - retry
  if (error.response.status === 429) {
    return true;
  }
  
  // Client errors (4xx) - não retry
  if (error.response.status >= 400 && error.response.status < 500) {
    return false;
  }
  
  return false;
}

async function fetchWithSelectiveRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.response = response;
        throw error;
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      // Check se deve retry
      if (attempt < maxRetries && shouldRetry(error)) {
        const delay = Math.pow(2, attempt) * 1000;
        
        console.log(`Retryable error - retry after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Não retry (4xx ou max retries atingido)
        throw error;
      }
    }
  }
  
  throw lastError;
}

// Uso:
try {
  // 404 Not Found - não retry (throw imediato)
  await fetchWithSelectiveRetry('https://api.example.com/nonexistent');
} catch (error) {
  console.error('No retry for 404');
}

try {
  // 503 Service Unavailable - retry
  await fetchWithSelectiveRetry('https://api.example.com/overloaded');
} catch (error) {
  console.error('Failed after retries');
}
```

### Caching Básico (In-Memory)

```javascript
// Cache em memória (Map)

const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

function getCacheKey(url, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${url}?${queryString}` : url;
}

async function fetchWithCache(url, params = {}) {
  const cacheKey = getCacheKey(url, params);
  
  // Check cache
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('✅ Cache hit:', cacheKey);
    return cached.data;
  }
  
  console.log('❌ Cache miss:', cacheKey);
  
  // Fetch
  const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url;
  const response = await fetch(fullUrl);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  // Store em cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Uso:
// First call - cache miss
const users1 = await fetchWithCache('https://api.example.com/users');

// Second call (within 1 minute) - cache hit
const users2 = await fetchWithCache('https://api.example.com/users');

// Different params - cache miss
const admins = await fetchWithCache('https://api.example.com/users', { role: 'admin' });
```

### Cache Invalidation

```javascript
// Invalidar cache em mutations (POST/PUT/DELETE)

const cache = new Map();
const CACHE_TTL = 60000;

async function fetchWithCache(url, options = {}) {
  const method = options.method || 'GET';
  const cacheKey = url;
  
  // Mutations invalidam cache
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    console.log('Mutation - invalidating cache');
    
    // Invalidar cache entries relacionadas
    for (const key of cache.keys()) {
      if (key.includes(url.split('?')[0])) { // Base URL match
        cache.delete(key);
        console.log('Deleted cache:', key);
      }
    }
  }
  
  // GET - check cache
  if (method === 'GET') {
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Cache hit:', cacheKey);
      return cached.data;
    }
  }
  
  // Fetch
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache GET responses
  if (method === 'GET') {
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
  
  return data;
}

// Uso:
// GET - cached
const users1 = await fetchWithCache('https://api.example.com/users');

// POST - invalidates cache
await fetchWithCache('https://api.example.com/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'New User' })
});

// GET - cache miss (invalidated)
const users2 = await fetchWithCache('https://api.example.com/users');
```

### localStorage Caching

```javascript
// Cache em localStorage (persistent across sessions)

const CACHE_TTL = 3600000; // 1 hour

function getCacheKey(url) {
  return `cache:${url}`;
}

async function fetchWithLocalStorageCache(url) {
  const cacheKey = getCacheKey(url);
  
  // Check localStorage
  const cachedString = localStorage.getItem(cacheKey);
  
  if (cachedString) {
    const cached = JSON.parse(cachedString);
    
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Cache hit (localStorage):', url);
      return cached.data;
    }
    
    // Expired - remove
    localStorage.removeItem(cacheKey);
  }
  
  console.log('Cache miss (localStorage):', url);
  
  // Fetch
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  // Store em localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    // localStorage full (quota exceeded)
    console.warn('localStorage cache failed:', error);
  }
  
  return data;
}

// Uso:
const users = await fetchWithLocalStorageCache('https://api.example.com/users');

// Persists across browser sessions (até expirar ou clear cache)
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Retry + Cache Combined

```javascript
// Wrapper com retry E cache

const cache = new Map();
const CACHE_TTL = 60000;

async function fetchWithRetryAndCache(url, options = {}, maxRetries = 3) {
  const method = options.method || 'GET';
  const cacheKey = url;
  
  // Check cache (apenas GET)
  if (method === 'GET') {
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Cache hit:', cacheKey);
      return cached.data;
    }
  }
  
  // Retry logic
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache GET responses
      if (method === 'GET') {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }
      
      // Invalidate cache em mutations
      if (['POST', 'PUT', 'DELETE'].includes(method)) {
        for (const key of cache.keys()) {
          if (key.includes(url.split('?')[0])) {
            cache.delete(key);
          }
        }
      }
      
      return data;
      
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Uso:
// First call - cache miss + retry se fail
const users = await fetchWithRetryAndCache('https://api.example.com/users');

// Second call - cache hit (sem fetch)
const users2 = await fetchWithRetryAndCache('https://api.example.com/users');
```

### Pattern 2: Stale-While-Revalidate

```javascript
// Retornar cached data imediatamente, revalidar em background

const cache = new Map();
const CACHE_TTL = 60000;

async function fetchStaleWhileRevalidate(url) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  // Tem cache (mesmo expirado) - retornar imediatamente
  if (cached) {
    console.log('Returning stale cache:', cacheKey);
    
    // Revalidar em background (não await)
    if (Date.now() - cached.timestamp >= CACHE_TTL) {
      console.log('Revalidating in background...');
      
      fetch(url)
        .then(r => r.json())
        .then(data => {
          cache.set(cacheKey, {
            data,
            timestamp: Date.now()
          });
          console.log('Cache updated');
        })
        .catch(error => {
          console.error('Revalidation failed:', error);
        });
    }
    
    return cached.data;
  }
  
  // Sem cache - fetch síncrono
  console.log('No cache - fetching...');
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Uso:
// First call - fetch
const users1 = await fetchStaleWhileRevalidate('https://api.example.com/users');

// Second call (imediato) - stale cache retornado, revalidação em background
const users2 = await fetchStaleWhileRevalidate('https://api.example.com/users');

// Third call (após revalidação) - fresh cache
const users3 = await fetchStaleWhileRevalidate('https://api.example.com/users');
```

### Pattern 3: React Hook com Retry + Cache

```javascript
// Custom hook para fetch com retry e cache (React)

import { useState, useEffect } from 'react';

const cache = new Map();
const CACHE_TTL = 60000;

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      const cacheKey = url;
      
      // Check cache
      const cached = cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('Cache hit:', cacheKey);
        
        if (isMounted) {
          setData(cached.data);
          setLoading(false);
        }
        
        return;
      }
      
      // Fetch com retry
      const maxRetries = 3;
      let lastError;
      
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(url, options);
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const result = await response.json();
          
          // Cache
          cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
          
          if (isMounted) {
            setData(result);
            setLoading(false);
            setError(null);
          }
          
          return;
          
        } catch (err) {
          lastError = err;
          
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      if (isMounted) {
        setError(lastError);
        setLoading(false);
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
function UserList() {
  const { data: users, loading, error } = useFetch('https://api.example.com/users');
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Pattern 4: Cache with Size Limit (LRU)

```javascript
// Cache com limite de size (Least Recently Used eviction)

class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    // Remove if exists (will re-add at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Add to end
    this.cache.set(key, value);
    
    // Evict oldest if exceeded maxSize
    if (this.cache.size > this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      console.log('Evicted (LRU):', oldestKey);
    }
  }
  
  has(key) {
    return this.cache.has(key);
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

// Uso:
const cache = new LRUCache(50); // Max 50 entries
const CACHE_TTL = 60000;

async function fetchWithLRUCache(url) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit:', cacheKey);
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Cache automaticamente evicts least recently used entries quando cheio
```

### Pattern 5: Request Deduplication

```javascript
// Evitar múltiplos requests simultâneos para mesmo endpoint

const pendingRequests = new Map();

async function fetchWithDeduplication(url, options = {}) {
  const cacheKey = url;
  
  // Check se request já em andamento
  if (pendingRequests.has(cacheKey)) {
    console.log('Request already pending - waiting for result:', cacheKey);
    return pendingRequests.get(cacheKey);
  }
  
  // Create promise
  const promise = fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .finally(() => {
      // Remove from pending
      pendingRequests.delete(cacheKey);
    });
  
  // Store pending promise
  pendingRequests.set(cacheKey, promise);
  
  return promise;
}

// Uso:
// Múltiplas chamadas simultâneas - apenas 1 request real
Promise.all([
  fetchWithDeduplication('https://api.example.com/users'),
  fetchWithDeduplication('https://api.example.com/users'),
  fetchWithDeduplication('https://api.example.com/users')
]).then(results => {
  console.log('All resolved with single request');
  // results[0] === results[1] === results[2]
});
```

### Pattern 6: Retry with AbortController (Timeout)

```javascript
// Retry com timeout por attempt (AbortController)

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function fetchWithRetryAndTimeout(url, options = {}, maxRetries = 3, timeout = 5000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error;
      
      if (error.name === 'AbortError') {
        console.log(`Attempt ${attempt + 1} timed out after ${timeout}ms`);
      }
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Uso:
// Cada attempt tem timeout de 5s
// Se timeout, retry com backoff
const data = await fetchWithRetryAndTimeout('https://slow-api.example.com/data', {}, 3, 5000);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Retry

**✅ Network Instável**: Mobile, flaky connections
**✅ Transient Errors**: 503, 429, network timeouts
**✅ Critical Requests**: User actions que não podem falhar
**✅ Background Sync**: Retry automático sem user intervention

### Quando Usar Caching

**✅ Read-Heavy**: Data raramente muda (config, reference data)
**✅ Performance**: Reduzir latency (instant response)
**✅ Offline Support**: Fallback quando network indisponível
**✅ Bandwidth**: Reduzir data transfers (mobile)

### Quando NÃO Usar

**❌ Retry em 4xx**: Client errors não são transient (não retry)
**❌ Cache Mutations**: POST/PUT/DELETE não devem ser cached
**❌ Cache Sensitive Data**: Dados sensíveis (pagamento, auth)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações Retry

**1. Max Retries**: Limit (evitar infinite loop)
**2. Total Time**: Retries aumentam latency total
**3. Idempotency**: Apenas retry idempotent operations (GET, PUT)
**4. Server Load**: Retries podem overwhelm servidor (usar backoff/jitter)

### Limitações Caching

**1. Stale Data**: Cache pode servir data desatualizado (TTL trade-off)
**2. Memory**: Cache consome memória (size limits, LRU)
**3. Invalidation**: Difícil garantir consistency (mutations)
**4. localStorage Quota**: 5-10MB limit (quota exceeded errors)

### Armadilhas Comuns

#### Armadilha 1: Retry sem Backoff

```javascript
// ❌ ERRO - Retry sem delay (overwhelm servidor)
for (let i = 0; i < 10; i++) {
  try {
    return await fetch(url);
  } catch {
    // Retry imediatamente (10 requests simultâneos)
  }
}

// ✅ CORRETO - Exponential backoff
for (let i = 0; i < 3; i++) {
  try {
    return await fetch(url);
  } catch {
    await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
  }
}
```

#### Armadilha 2: Cache sem TTL

```javascript
// ❌ ERRO - Cache sem expiration (stale forever)
const cache = new Map();

cache.set(url, data); // Nunca expira

// ✅ CORRETO - TTL
cache.set(url, {
  data,
  timestamp: Date.now()
});

// Verificar TTL
if (Date.now() - cached.timestamp < CACHE_TTL) {
  return cached.data;
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Resilience Patterns

**Retry** é **resilience pattern** (Circuit Breaker, Bulkhead).

### Relação com HTTP Caching

**Client caching** complementa **HTTP caching** (Cache-Control, ETag).

### Relação com React Query/SWR

**Libraries** (React Query, SWR) implementam retry/cache declarativamente.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Request Deduplication**: Evitar duplicate requests
2. **Parallel Requests**: Promise.all, Promise.race
3. **Circuit Breaker**: Skip requests se server down

---

## 📚 Conclusão

Retry logic e caching são **padrões essenciais** para aplicações resilientes e performáticas.

Dominar retry/caching significa:
- **Exponential backoff**: Delays progressivos (evitar overwhelm)
- **Jitter**: Randomização (evitar thundering herd)
- **Selective retry**: Apenas transient errors (5xx, network)
- **Cache TTL**: Expiration automática (freshness)
- **Cache invalidation**: Clear em mutations (consistency)
- **LRU**: Size limits (memory management)

É crítico para production apps com network instável e high traffic.
