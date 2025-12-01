# 🎯 Introdução

**Caching strategies** são técnicas fundamentais de performance optimization que reduzem latência, diminuem bandwidth consumption, e melhoram user experience ao **evitar requests desnecessários para dados que já foram fetched**. Em vez de re-fetching mesmos dados repetidamente do servidor, aplicações podem armazenar responses localmente e reutilizá-las quando apropriado, eliminando round-trips de rede custosos.

O problema central que caching resolve é **network overhead**: cada HTTP request incorre TCP handshake, TLS negotiation, DNS lookup, latência de rede (50-500ms típico), e server processing time. Para dados que mudam infrequentemente (user profiles, configuration, reference data), re-fetching em cada page load ou component mount desperdiça recursos e degrada performance. Caching inteligente pode reduzir estes requests em 80-90%, transformando aplicação lenta em responsiva.

Axios não possui built-in caching (HTTP client é stateless por design), mas oferece **interceptors** que permitem implementar caching layers sofisticados. Strategies variam desde simple in-memory caches (Map/Object storage com TTL) até persistent caches (localStorage, IndexedDB) e HTTP-compliant caches (respeitando Cache-Control, ETag, Last-Modified headers). Libraries como `axios-cache-adapter` e `axios-cache-interceptor` fornecem implementations production-ready.

Entretanto, caching introduz complexidades: **cache invalidation** (quando remover/update cached data), **stale data** (servir dados outdated), **memory management** (evitar cache unbounded growth), e **concurrency** (multiple requests simultâneos para mesma resource). Effective caching strategies balanceiam performance gains contra freshness requirements e resource constraints.

Este módulo explora caching strategies para Axios em profundidade: desde HTTP caching fundamentals e browser cache behavior, através de in-memory e persistent cache implementations, até advanced patterns como stale-while-revalidate, conditional requests, e cache invalidation strategies. Objetivo é fornecer knowledge completo para implementar caching efetivo que melhora performance sem sacrificar data accuracy.

---

# 📋 Sumário

### **HTTP Caching Fundamentals**
- Cache-Control header
- ETag e Last-Modified
- Conditional requests
- Browser cache behavior

### **In-Memory Caching**
- Map-based cache
- TTL (Time-To-Live)
- LRU eviction
- Cache key generation

### **Persistent Caching**
- localStorage cache
- sessionStorage cache
- IndexedDB para large data
- Offline-first patterns

### **Axios Cache Libraries**
- axios-cache-adapter
- axios-cache-interceptor
- Configuration
- Features comparison

### **Cache Invalidation**
- Time-based expiration
- Manual invalidation
- Mutation-based invalidation
- Version/tag-based invalidation

### **Advanced Patterns**
- Stale-while-revalidate
- Conditional requests (If-None-Match)
- Cache warming
- Prefetching

### **Best Practices**
- Cache apenas GET requests
- Respeitar server cache headers
- Limitar cache size
- Clear cache em logout/errors

---

# 🧠 Fundamentos

## HTTP Caching Fundamentals

### **Cache-Control Header**

**Server** envia `Cache-Control` header indicando como response deve ser cached:

```http
HTTP/1.1 200 OK
Cache-Control: max-age=3600, public
Content-Type: application/json

{"user": "Alice"}
```

**Directives**:
- `max-age=<seconds>`: Cache válido por N segundos
- `no-cache`: Sempre revalidate com servidor antes de usar
- `no-store`: Nunca cache (sensitive data)
- `public`: Pode ser cached por proxies/CDN
- `private`: Apenas client-side cache (não CDN)
- `must-revalidate`: Se stale, DEVE revalidate

**Axios** não respeita Cache-Control automaticamente (HTTP client, não browser cache). Precisamos implementar.

### **ETag e Last-Modified**

**ETag** (Entity Tag): Hash/version identifier da response.

```http
HTTP/1.1 200 OK
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Content-Type: application/json

{"user": "Alice"}
```

**Last-Modified**: Timestamp de última modificação.

```http
HTTP/1.1 200 OK
Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
Content-Type: application/json

{"user": "Alice"}
```

**Uso**: Client envia estas em subsequent requests para conditional requests.

### **Conditional Requests**

**If-None-Match** (com ETag):
```http
GET /api/user HTTP/1.1
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Server response**:
- Se unchanged: `304 Not Modified` (sem body - usa cached version)
- Se changed: `200 OK` com new data e new ETag

**If-Modified-Since** (com Last-Modified):
```http
GET /api/user HTTP/1.1
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
```

**Benefit**: Save bandwidth - 304 response é ~100 bytes vs KB/MB de data.

### **Browser Cache Behavior**

Browsers automaticamente cache responses baseado em headers.

**Axios bypasses browser cache** (usa XHR/fetch que não usa HTTP cache por padrão).

Para habilitar browser cache, configurar `cache` option:

```javascript
// Fetch API (não Axios diretamente)
fetch('/api/data', { cache: 'force-cache' });
```

**Axios não expõe cache control** - implementamos própria layer.

## In-Memory Caching

### **Map-Based Cache**

**Simple cache** usando JavaScript `Map`:

```javascript
const cache = new Map();

axios.interceptors.request.use(async config => {
  if (config.method === 'get') {
    const cacheKey = config.url; // Simplified
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiry) {
      // Return cached response (simulate server response)
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK (from cache)',
        headers: cached.headers,
        config,
        request: {}
      });
    }
  }
  
  return config;
});

axios.interceptors.response.use(response => {
  if (response.config.method === 'get') {
    const cacheKey = response.config.url;
    cache.set(cacheKey, {
      data: response.data,
      headers: response.headers,
      expiry: Date.now() + 60000 // 60s TTL
    });
  }
  
  return response;
});
```

**Fetch com cache**:
```javascript
const response = await axios.get('/api/user');
console.log(response.data); // From cache se disponível
```

### **TTL (Time-To-Live)**

**TTL**: Tempo que cached entry permanece válida.

```javascript
class Cache {
  constructor(defaultTTL = 60000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }
  
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }
  
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key); // Cleanup expired
      return null;
    }
    
    return entry.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new Cache(300000); // 5min default TTL
```

**Different TTLs** por endpoint:
```javascript
// User profile: 5min
cache.set('/api/user', userData, 300000);

// Config: 1hour
cache.set('/api/config', configData, 3600000);

// Posts: 1min
cache.set('/api/posts', postsData, 60000);
```

### **LRU Eviction**

**LRU (Least Recently Used)**: Remove oldest entries quando cache size limit atingido.

```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    
    const value = this.cache.get(key);
    
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  set(key, value) {
    // Remove if exists (to re-add at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}
```

**Library** (lru-cache):
```javascript
const LRU = require('lru-cache');

const cache = new LRU({
  max: 500,           // Max entries
  maxAge: 1000 * 60 * 5, // 5min TTL
  updateAgeOnGet: true   // Refresh TTL on access
});
```

### **Cache Key Generation**

**Cache key** deve uniquely identificar request.

**Apenas URL** (insufficient):
```javascript
const key = config.url; // ❌ Ignora query params
```

**URL + Query Params**:
```javascript
function getCacheKey(config) {
  const url = config.url;
  const params = new URLSearchParams(config.params).toString();
  return params ? `${url}?${params}` : url;
}

const key = getCacheKey(config);
// Example: "/api/users?page=1&limit=10"
```

**Normalized** (para garantir consistency):
```javascript
function getCacheKey(config) {
  const url = config.url;
  
  // Sort params para consistent key
  const params = Object.keys(config.params || {})
    .sort()
    .map(k => `${k}=${config.params[k]}`)
    .join('&');
  
  return params ? `${url}?${params}` : url;
}

// "/api/users?limit=10&page=1" === "/api/users?page=1&limit=10"
```

**Include Headers** (se afetam response):
```javascript
function getCacheKey(config) {
  const url = config.url;
  const params = new URLSearchParams(config.params).toString();
  const accept = config.headers['Accept'] || 'application/json';
  
  return `${url}?${params}|${accept}`;
}
```

## Persistent Caching

### **localStorage Cache**

**Benefit**: Persiste entre page reloads e browser sessions.

**Limitation**: ~5-10MB size limit, synchronous API.

```javascript
class LocalStorageCache {
  constructor(prefix = 'axios_cache_') {
    this.prefix = prefix;
  }
  
  set(key, value, ttl = 300000) {
    const entry = {
      value,
      expiry: Date.now() + ttl
    };
    
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(entry)
      );
    } catch (e) {
      // Quota exceeded - clear old entries
      this.evictOldest();
    }
  }
  
  get(key) {
    const item = localStorage.getItem(this.prefix + key);
    
    if (!item) return null;
    
    const entry = JSON.parse(item);
    
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(this.prefix + key);
      return null;
    }
    
    return entry.value;
  }
  
  clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
  }
  
  evictOldest() {
    const entries = Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .map(k => ({
        key: k,
        expiry: JSON.parse(localStorage.getItem(k)).expiry
      }))
      .sort((a, b) => a.expiry - b.expiry);
    
    // Remove oldest 25%
    const toRemove = Math.ceil(entries.length * 0.25);
    entries.slice(0, toRemove).forEach(e => {
      localStorage.removeItem(e.key);
    });
  }
}
```

### **sessionStorage Cache**

**Benefit**: Mesmo que localStorage, mas **cleared quando tab/window fecha**.

**Uso**: Dados temporários que não devem persistir entre sessions.

```javascript
class SessionStorageCache {
  // Identical implementation, mas usa sessionStorage
  set(key, value, ttl) {
    sessionStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ttl }));
  }
  
  get(key) {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    const { value, expiry } = JSON.parse(item);
    return Date.now() < expiry ? value : null;
  }
}
```

### **IndexedDB para Large Data**

**Benefit**: No size limit (gigabytes), async API, structured queries.

**Uso**: Large datasets, offline-first apps.

```javascript
class IndexedDBCache {
  constructor(dbName = 'AxiosCache', storeName = 'responses') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbPromise = this.initDB();
  }
  
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('expiry', 'expiry');
        }
      };
    });
  }
  
  async set(key, value, ttl = 300000) {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    
    store.put({
      key,
      value,
      expiry: Date.now() + ttl
    });
    
    return tx.complete;
  }
  
  async get(key) {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readonly');
    const store = tx.objectStore(this.storeName);
    
    const entry = await store.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      await this.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  async delete(key) {
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, 'readwrite');
    tx.objectStore(this.storeName).delete(key);
    return tx.complete;
  }
}
```

### **Offline-First Patterns**

**Strategy**: Servir cached data imediatamente, fetch em background, update quando network disponível.

```javascript
async function fetchWithCache(url) {
  const cached = await cache.get(url);
  
  // Return cached immediately
  if (cached) {
    return cached;
  }
  
  // Fetch from network
  try {
    const response = await axios.get(url);
    await cache.set(url, response.data);
    return response.data;
  } catch (error) {
    // Network failed - return stale cache if available
    const stale = await cache.get(url, { ignoreExpiry: true });
    if (stale) return stale;
    
    throw error;
  }
}
```

## Axios Cache Libraries

### **axios-cache-adapter**

**Installation**:
```bash
npm install axios-cache-adapter
```

**Setup**:
```javascript
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

// Create cache adapter
const cache = setupCache({
  maxAge: 15 * 60 * 1000,  // 15min
  store: window.localStorage, // ou sessionStorage, memoryStore
  exclude: {
    query: false,  // Include query params em cache key
    filter: (config) => config.method !== 'get' // Cache apenas GET
  }
});

// Create axios instance com cache
const api = axios.create({
  adapter: cache.adapter
});

// Usar normalmente
const response = await api.get('/api/user');
console.log(response.data); // Cached automaticamente
```

**Features**:
- Automatic caching de GET requests
- localStorage/sessionStorage support
- TTL per request ou global
- Exclude patterns
- Cache invalidation

**Per-Request TTL**:
```javascript
// Override TTL para specific request
await api.get('/api/config', {
  cache: {
    maxAge: 3600000  // 1 hour
  }
});

// Bypass cache
await api.get('/api/realtime', {
  cache: {
    ignoreCache: true
  }
});
```

### **axios-cache-interceptor**

**Installation**:
```bash
npm install axios-cache-interceptor
```

**Setup**:
```javascript
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const axios = Axios.create();

const cachedAxios = setupCache(axios, {
  ttl: 1000 * 60 * 15,  // 15min default
  interpretHeader: true, // Respeitar Cache-Control headers
  methods: ['get'],      // Cache apenas GET
  cachePredicate: {
    statusCheck: (status) => status >= 200 && status < 300
  }
});

// Usar
const response = await cachedAxios.get('/api/user');
console.log(response.cached); // true se from cache
```

**Advanced Configuration**:
```javascript
const cachedAxios = setupCache(axios, {
  // Respeitar server Cache-Control
  interpretHeader: true,
  
  // Header overrides
  headerInterpreter: (headers) => {
    const cacheControl = headers['cache-control'];
    
    if (cacheControl?.includes('no-cache')) {
      return 'dont cache';
    }
    
    const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
    return maxAge ? Number(maxAge) * 1000 : 300000;
  },
  
  // Invalidate on mutation
  update: {
    '/api/user': 'delete'  // DELETE cache on POST/PUT/DELETE to /api/user
  }
});
```

### **Features Comparison**

| Feature | axios-cache-adapter | axios-cache-interceptor |
|---------|---------------------|-------------------------|
| localStorage | ✅ | ✅ |
| Interpret Cache-Control | ❌ | ✅ |
| ETag support | ❌ | ✅ |
| Stale-while-revalidate | ❌ | ✅ |
| TypeScript | ⚠️ Partial | ✅ Full |
| Bundle size | ~15KB | ~8KB |
| Active maintenance | ⚠️ Low | ✅ High |

**Recommendation**: `axios-cache-interceptor` para novos projetos (mais features, melhor maintained).

## Cache Invalidation

### **Time-Based Expiration**

**Simple**: Cache expira após TTL.

```javascript
cache.set('/api/user', userData, 300000); // 5min

// Após 5min, cache.get() retorna null
```

**Sliding Expiration** (refresh TTL em cada access):
```javascript
class SlidingCache {
  get(key) {
    const entry = this.cache.get(key);
    
    if (entry && Date.now() < entry.expiry) {
      // Refresh expiry
      entry.expiry = Date.now() + this.defaultTTL;
      return entry.value;
    }
    
    return null;
  }
}
```

### **Manual Invalidation**

**Invalidar specific cache entry**:
```javascript
// Update user
await axios.put('/api/user', updatedData);

// Invalidate cached user
cache.delete('/api/user');
```

**Clear entire cache**:
```javascript
// Logout
function logout() {
  cache.clear();
  // Redirect, etc.
}
```

### **Mutation-Based Invalidation**

**Interceptor**: Invalidate cache quando mutation happens.

```javascript
axios.interceptors.response.use(response => {
  const { method, url } = response.config;
  
  // Se POST/PUT/DELETE, invalidate related GETs
  if (['post', 'put', 'delete'].includes(method)) {
    // Invalidate specific resource
    cache.delete(url);
    
    // Invalidate collection
    const collectionUrl = url.replace(/\/\d+$/, ''); // Remove ID
    cache.delete(collectionUrl);
  }
  
  return response;
});
```

**Example**:
```javascript
// GET /api/users - cached
await axios.get('/api/users');

// POST /api/users - invalidates /api/users cache
await axios.post('/api/users', newUser);

// GET /api/users - fresh data (cache invalidated)
await axios.get('/api/users');
```

### **Version/Tag-Based Invalidation**

**Cache tags**: Associar cache entries com tags, invalidar por tag.

```javascript
class TaggedCache {
  constructor() {
    this.cache = new Map();
    this.tags = new Map(); // tag -> Set of keys
  }
  
  set(key, value, ttl, tags = []) {
    this.cache.set(key, { value, expiry: Date.now() + ttl });
    
    tags.forEach(tag => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag).add(key);
    });
  }
  
  get(key) {
    const entry = this.cache.get(key);
    return entry && Date.now() < entry.expiry ? entry.value : null;
  }
  
  invalidateTag(tag) {
    const keys = this.tags.get(tag) || new Set();
    keys.forEach(key => this.cache.delete(key));
    this.tags.delete(tag);
  }
}

// Uso
const cache = new TaggedCache();

cache.set('/api/users', usersData, 300000, ['users', 'lists']);
cache.set('/api/users/123', userData, 300000, ['users', 'user:123']);

// Invalidate all user-related caches
cache.invalidateTag('users');
```

## Advanced Patterns

### **Stale-While-Revalidate**

**Concept**: Return stale cached data imediatamente, fetch fresh data em background, update cache.

```javascript
async function fetchWithSWR(url) {
  const cached = cache.get(url);
  
  // Return cached immediately (even if stale)
  if (cached) {
    // Revalidate in background
    axios.get(url).then(response => {
      cache.set(url, response.data);
    }).catch(() => {
      // Keep stale data on error
    });
    
    return cached;
  }
  
  // No cache - fetch normally
  const response = await axios.get(url);
  cache.set(url, response.data);
  return response.data;
}
```

**Axios Interceptor**:
```javascript
axios.interceptors.request.use(async config => {
  if (config.method === 'get') {
    const key = getCacheKey(config);
    const cached = cache.get(key, { includeStale: true });
    
    if (cached) {
      // Return cached immediately
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        config,
        fromCache: true
      });
      
      // Revalidate in background (não await)
      axios.get(config.url, { ...config, bypassCache: true })
        .then(response => cache.set(key, response.data));
    }
  }
  
  return config;
});
```

### **Conditional Requests (If-None-Match)**

**Pattern**: Usar ETag para verificar se cached data ainda é válida.

```javascript
axios.interceptors.request.use(config => {
  if (config.method === 'get') {
    const key = getCacheKey(config);
    const cached = cache.get(key, { includeMeta: true });
    
    if (cached && cached.etag) {
      // Add If-None-Match header
      config.headers['If-None-Match'] = cached.etag;
    }
  }
  
  return config;
});

axios.interceptors.response.use(
  response => {
    const key = getCacheKey(response.config);
    
    // Store with ETag
    if (response.headers.etag) {
      cache.set(key, {
        data: response.data,
        etag: response.headers.etag
      });
    }
    
    return response;
  },
  error => {
    // 304 Not Modified - use cached
    if (error.response?.status === 304) {
      const key = getCacheKey(error.config);
      const cached = cache.get(key);
      
      return {
        data: cached.data,
        status: 304,
        statusText: 'Not Modified',
        fromCache: true
      };
    }
    
    throw error;
  }
);
```

### **Cache Warming**

**Preload** critical data antes de user precisar.

```javascript
async function warmCache() {
  const criticalEndpoints = [
    '/api/config',
    '/api/user',
    '/api/navigation'
  ];
  
  await Promise.all(
    criticalEndpoints.map(url => axios.get(url))
  );
  
  console.log('Cache warmed');
}

// On app load
warmCache();
```

### **Prefetching**

**Fetch** dados que user provavelmente precisará next.

```javascript
// User viewing page 1 - prefetch page 2
axios.get('/api/posts?page=1');

// Prefetch next page
setTimeout(() => {
  axios.get('/api/posts?page=2'); // Cached quando user navega
}, 1000);
```

**On Hover**:
```javascript
// Prefetch user details on hover
<UserCard
  onMouseEnter={() => {
    axios.get(`/api/users/${userId}/details`);
  }}
/>
```

## Best Practices

### **1. Cache Apenas GET Requests**

```javascript
// ✅ Cache GET
await axios.get('/api/user');

// ❌ Nunca cache POST/PUT/DELETE
await axios.post('/api/user', data); // Side effects
```

### **2. Respeitar Server Cache Headers**

```javascript
function getTTLFromHeaders(headers) {
  const cacheControl = headers['cache-control'];
  
  if (cacheControl?.includes('no-cache') || cacheControl?.includes('no-store')) {
    return 0; // Don't cache
  }
  
  const maxAge = cacheControl?.match(/max-age=(\d+)/)?.[1];
  return maxAge ? Number(maxAge) * 1000 : 300000; // Default 5min
}
```

### **3. Limitar Cache Size**

```javascript
const cache = new LRUCache({
  max: 500,           // Max 500 entries
  maxSize: 50 * 1024 * 1024, // Max 50MB
  sizeCalculation: (value) => {
    return JSON.stringify(value).length;
  }
});
```

### **4. Clear Cache em Logout/Errors**

```javascript
function logout() {
  cache.clear();
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Clear cache em 401 errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      cache.clear(); // Stale auth-dependent data
      redirectToLogin();
    }
    throw error;
  }
);
```

### **5. Monitor Cache Performance**

```javascript
class MonitoredCache {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }
  
  get(key) {
    const value = this.cache.get(key);
    
    if (value) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    
    return value;
  }
  
  set(key, value) {
    this.cache.set(key, value);
    this.stats.sets++;
  }
  
  getHitRate() {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%';
  }
}

// Log stats
setInterval(() => {
  console.log('Cache hit rate:', cache.getHitRate());
}, 60000);
```

---

# 🎯 Aplicabilidade

## Quando Usar Caching

**Reference Data**: Configuration, countries list, categories (muda raramente).

**User Data**: Profile, settings (invalidar em updates).

**Search Results**: Cache por query string.

**Paginated Lists**: Cache por page number.

## Quando NÃO Usar Caching

**Real-Time Data**: Stock prices, live scores, notifications.

**Sensitive Data**: Payment info, credentials.

**Mutation Endpoints**: POST/PUT/DELETE nunca devem ser cached.

---

# ⚠️ Limitações

## Stale Data Risk

Cache pode servir outdated data se invalidation não for properly handled.

## Memory Consumption

Unbounded caches consomem memória indefinidamente - sempre implementar size limits.

## Complexity

Caching adiciona complexity: invalidation logic, concurrency issues, debugging.

---

# 🔗 Interconexões

## Interceptors

Caching é implementado via request/response interceptors.

## Parallel Requests

Caching reduz benefício de parallel requests (mas ambos complementam).

## Authentication

Cache deve ser cleared em logout para evitar data leakage.

---

# 🚀 Evolução

## Service Workers

Future: Service Workers podem cache HTTP responses no browser level.

## HTTP/3

HTTP/3 com QUIC protocol melhora latency, reduzindo necessidade de aggressive caching.

## GraphQL

GraphQL clients (Apollo) têm normalized caching built-in.

---

**Conclusão Integrada**: Caching strategies são critical performance optimization que reduz latency e bandwidth ao evitar redundant network requests. Axios não possui built-in caching, mas interceptors permitem implementar sophisticated caching layers: in-memory caches com TTL e LRU eviction, persistent caches usando localStorage/IndexedDB para offline-first apps, e HTTP-compliant caches respeitando Cache-Control/ETag headers. Libraries como axios-cache-interceptor fornecem production-ready solutions com features como stale-while-revalidate, conditional requests, e automatic invalidation. Effective caching balanceia performance gains contra freshness requirements, implementando proper invalidation strategies (time-based, mutation-based, tag-based) e respeitando cache size limits para avoid memory issues. Best practices incluem cache apenas GET requests, respeitar server headers, limitar cache size, clear cache em logout/errors, e monitor cache hit rates. Well-designed caching pode reduzir requests em 80-90%, transformando aplicação lenta em highly responsive experience.