# 🎯 Introdução

**Fallback strategies** são mecanismos de resilience que fornecem **alternative responses ou behaviors quando primary request falha**, garantindo que aplicação continua functioning mesmo durante partial system failures, network outages, ou service degradation. Em vez de simplesmente propagar error para user, fallback strategies permitem graceful degradation através de cached data, default values, alternative endpoints, ou reduced functionality.

O problema central que fallback strategies resolvem é **all-or-nothing failure**: sem fallbacks, qualquer falha em critical service paralisa aplicação completamente, forçando user a stare em error message. Entretanto, muitos failures são partial - se API de weather forecast está down, aplicação pode mostrar cached weather de 1 hora atrás em vez de error screen. Se payment gateway está indisponível, aplicação pode queue transaction para processar later. Fallback strategies transformam hard failures em degraded but functional experiences.

Fallback hierarchy tipicamente segue pattern **primary → cache → default → alternative service → error**, tentando múltiplas strategies antes de falhar completamente. Por exemplo: (1) Try fetch user profile de API, (2) Se falhar, try load de cache, (3) Se cache vazio, use default anonymous profile, (4) Se tudo falhar, show error mas allow continuar com limited functionality. Esta abordagem maximiza availability enquanto mantém best possible user experience.

Entretanto, fallback strategies introduzem trade-offs: **stale data risks** (cached data pode estar outdated), **complexity** (managing múltiplas data sources e fallback paths), e **performance overhead** (checking cache, trying alternatives). Design efectivo balanceia resilience contra consistency requirements e performance constraints, escolhendo appropriate fallback strategies para cada scenario baseado em criticality e freshness requirements.

Este módulo explora fallback strategies em profundidade: desde cache-based fallbacks e default values, através de alternative endpoints e service mesh patterns, até advanced strategies como stale-while-revalidate, circuit breaker integration, e graceful degradation patterns. Objetivo é fornecer knowledge completo para implementar robust fallback mechanisms que maximizam application availability sem sacrificar data integrity.

---

# 📋 Sumário

### **Fallback Fundamentals**
- Primary vs fallback responses
- Graceful degradation
- Fallback hierarchy
- Trade-offs

### **Cache-Based Fallbacks**
- Return cached data em errors
- Stale cache tolerance
- Cache freshness indicators
- Implementation patterns

### **Default Values**
- Static defaults
- Computed defaults
- User-specific defaults
- Configuration-driven defaults

### **Alternative Endpoints**
- Backup servers
- Mirror APIs
- Regional failover
- Load balancer integration

### **Partial Responses**
- Subset de features
- Reduced functionality
- Essential-only mode
- Progressive enhancement

### **Circuit Breaker Integration**
- Fast-fail com fallback
- Preventing cascading failures
- Health checks
- State transitions

### **Advanced Patterns**
- Stale-while-revalidate
- Request queuing (offline mode)
- Hybrid responses (partial success)
- Fallback chains

### **Best Practices**
- Document fallback behavior
- Monitor fallback usage
- Test fallback paths
- User transparency (show degraded state)

---

# 🧠 Fundamentos

## Fallback Fundamentals

### **Primary vs Fallback Responses**

**Primary Response**: Ideal data de authoritative source.

**Fallback Response**: Alternative quando primary fails.

**Example**:
```javascript
try {
  // Primary: Fresh data de API
  const response = await axios.get('/api/user/profile');
  return response.data;
} catch (error) {
  // Fallback: Cached data
  const cached = cache.get('/api/user/profile');
  if (cached) {
    return { ...cached, _fallback: true, _stale: true };
  }
  
  // Fallback 2: Default anonymous profile
  return {
    id: null,
    name: 'Guest',
    email: null,
    _fallback: true,
    _default: true
  };
}
```

### **Graceful Degradation**

**Concept**: Aplicação continua functioning com reduced capabilities em vez de complete failure.

**Examples**:

**E-commerce**:
- Primary: Product recommendations de ML service
- Fallback: Popular products (static list)

**Social Media**:
- Primary: Real-time notifications
- Fallback: Polling de 30s intervals

**Video Streaming**:
- Primary: HD video (1080p)
- Fallback: SD video (480p)
- Fallback 2: Audio only

### **Fallback Hierarchy**

**Typical Chain**:

```
1. Primary API request
   ↓ (on failure)
2. Recent cache (< 5min old)
   ↓ (on miss)
3. Stale cache (< 1 hour old)
   ↓ (on miss)
4. Default values
   ↓ (on unavailability)
5. Error state (com partial functionality)
```

**Implementation**:

```javascript
async function fetchWithFallbackChain(url) {
  // 1. Primary API
  try {
    const response = await axios.get(url, { timeout: 5000 });
    cache.set(url, response.data, { fresh: true });
    return response.data;
  } catch (error) {
    // 2. Recent cache
    const recentCache = cache.get(url, { maxAge: 300000 }); // 5min
    if (recentCache) {
      return { ...recentCache, _source: 'cache-recent' };
    }
    
    // 3. Stale cache
    const staleCache = cache.get(url, { maxAge: 3600000 }); // 1hour
    if (staleCache) {
      // Revalidate em background
      axios.get(url).then(res => cache.set(url, res.data));
      return { ...staleCache, _source: 'cache-stale' };
    }
    
    // 4. Default values
    const defaults = getDefaults(url);
    if (defaults) {
      return { ...defaults, _source: 'default' };
    }
    
    // 5. Error
    throw error;
  }
}
```

### **Trade-offs**

**Advantages**:
- ✅ Higher availability
- ✅ Better user experience durante outages
- ✅ Gradual degradation vs hard failure
- ✅ Time para recover sem user impact

**Disadvantages**:
- ❌ Stale data pode mislead users
- ❌ Increased complexity
- ❌ Difícil testar todos fallback paths
- ❌ Pode mascarar underlying issues

**Balance**: Transparência (indicar quando usando fallback) e monitoring (alert on excessive fallback usage).

## Cache-Based Fallbacks

### **Return Cached Data em Errors**

**Basic Pattern**:

```javascript
axios.interceptors.response.use(
  response => {
    // Cache successful responses
    if (response.config.method === 'get') {
      cache.set(response.config.url, response.data);
    }
    return response;
  },
  error => {
    // Fallback to cache em errors
    if (error.config.method === 'get') {
      const cached = cache.get(error.config.url);
      
      if (cached) {
        console.log('Returning cached data due to error');
        
        return {
          data: cached,
          status: 200,
          statusText: 'OK (from cache)',
          headers: {},
          config: error.config,
          fromCache: true
        };
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Usage** (transparente):
```javascript
const response = await axios.get('/api/user');
console.log(response.data); // Fresh ou cached

if (response.fromCache) {
  showWarning('Data may be outdated');
}
```

### **Stale Cache Tolerance**

**Accept stale data** durante network errors:

```javascript
class CacheWithStaleTolerance {
  constructor() {
    this.cache = new Map();
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key, options = {}) {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const age = Date.now() - entry.timestamp;
    const maxAge = options.maxAge || 300000; // 5min default
    const allowStale = options.allowStale || false;
    
    // Se fresh, return
    if (age < maxAge) {
      return { ...entry.value, _age: age, _fresh: true };
    }
    
    // Se stale mas tolerated, return com warning
    if (allowStale) {
      return { ...entry.value, _age: age, _fresh: false, _stale: true };
    }
    
    return null;
  }
}

const cache = new CacheWithStaleTolerance();

axios.interceptors.response.use(
  response => {
    cache.set(response.config.url, response.data);
    return response;
  },
  error => {
    // Em network errors, accept stale cache
    const cached = cache.get(error.config.url, { allowStale: true });
    
    if (cached) {
      return {
        data: cached,
        status: 200,
        config: error.config,
        fromCache: true,
        stale: cached._stale
      };
    }
    
    return Promise.reject(error);
  }
);
```

### **Cache Freshness Indicators**

**Informar user** sobre cache age:

```javascript
async function fetchWithCacheIndicator(url) {
  try {
    const response = await axios.get(url);
    return {
      data: response.data,
      fresh: true,
      age: 0
    };
  } catch (error) {
    const cached = cache.get(url, { includeMeta: true });
    
    if (cached) {
      const ageMinutes = Math.floor(cached._age / 60000);
      
      return {
        data: cached,
        fresh: false,
        age: cached._age,
        message: `Data from ${ageMinutes} minute(s) ago`
      };
    }
    
    throw error;
  }
}

// UI
const result = await fetchWithCacheIndicator('/api/weather');

if (!result.fresh) {
  showBanner(`⚠️ ${result.message}. Refresh to update.`);
}

displayWeather(result.data);
```

### **Implementation Patterns**

**Pattern 1: Interceptor-Based**:

```javascript
axios.interceptors.response.use(
  response => {
    cache.set(response.config.url, response.data);
    return response;
  },
  error => {
    const cached = cache.get(error.config.url);
    if (cached) {
      return { data: cached, fromCache: true };
    }
    return Promise.reject(error);
  }
);
```

**Pattern 2: Wrapper Function**:

```javascript
async function fetchWithCacheFallback(url, options = {}) {
  try {
    const response = await axios.get(url, options);
    cache.set(url, response.data);
    return response.data;
  } catch (error) {
    const cached = cache.get(url);
    if (cached) {
      console.warn('Using cached fallback', url);
      return cached;
    }
    throw error;
  }
}
```

**Pattern 3: React Hook**:

```javascript
function useFetchWithFallback(url) {
  const [data, setData] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    axios.get(url)
      .then(response => {
        setData(response.data);
        setIsStale(false);
        cache.set(url, response.data);
      })
      .catch(error => {
        const cached = cache.get(url);
        if (cached) {
          setData(cached);
          setIsStale(true);
        } else {
          setError(error);
        }
      });
  }, [url]);
  
  return { data, isStale, error };
}
```

## Default Values

### **Static Defaults**

**Hardcoded fallback values**:

```javascript
const DEFAULT_CONFIG = {
  theme: 'light',
  language: 'en',
  notifications: true,
  autoSave: false
};

async function fetchUserConfig() {
  try {
    const response = await axios.get('/api/user/config');
    return response.data;
  } catch (error) {
    console.warn('Failed to load config, using defaults');
    return DEFAULT_CONFIG;
  }
}
```

### **Computed Defaults**

**Generate defaults** baseado em context:

```javascript
function getDefaultProfile() {
  return {
    id: null,
    name: 'Guest',
    email: null,
    avatar: '/assets/default-avatar.png',
    joinedDate: new Date().toISOString(),
    preferences: {
      theme: window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light',
      language: navigator.language.split('-')[0] || 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  };
}

async function fetchUserProfile() {
  try {
    const response = await axios.get('/api/user/profile');
    return response.data;
  } catch (error) {
    return getDefaultProfile();
  }
}
```

### **User-Specific Defaults**

**Personalized defaults** baseado em localStorage:

```javascript
function getUserDefaults() {
  const lastKnownTheme = localStorage.getItem('theme') || 'light';
  const lastKnownLang = localStorage.getItem('language') || 'en';
  
  return {
    theme: lastKnownTheme,
    language: lastKnownLang,
    notifications: true
  };
}

async function fetchConfig() {
  try {
    const response = await axios.get('/api/config');
    
    // Persist for future fallback
    localStorage.setItem('theme', response.data.theme);
    localStorage.setItem('language', response.data.language);
    
    return response.data;
  } catch (error) {
    return getUserDefaults();
  }
}
```

### **Configuration-Driven Defaults**

**Centralized default configuration**:

```javascript
const DEFAULTS = {
  '/api/user/profile': {
    id: null,
    name: 'Guest',
    email: null
  },
  '/api/products': [],
  '/api/config': {
    theme: 'light',
    language: 'en'
  }
};

axios.interceptors.response.use(
  response => response,
  error => {
    const url = error.config.url;
    const defaults = DEFAULTS[url];
    
    if (defaults) {
      console.warn(`Using default fallback for ${url}`);
      
      return {
        data: defaults,
        status: 200,
        config: error.config,
        fromDefault: true
      };
    }
    
    return Promise.reject(error);
  }
);
```

## Alternative Endpoints

### **Backup Servers**

**Failover para backup server**:

```javascript
const PRIMARY_SERVER = 'https://api.example.com';
const BACKUP_SERVER = 'https://backup-api.example.com';

async function fetchWithFailover(endpoint, data) {
  try {
    return await axios.post(`${PRIMARY_SERVER}${endpoint}`, data);
  } catch (error) {
    console.warn('Primary server failed, trying backup...');
    
    try {
      return await axios.post(`${BACKUP_SERVER}${endpoint}`, data);
    } catch (backupError) {
      throw new Error('All servers unavailable');
    }
  }
}
```

**Interceptor-Based**:

```javascript
const servers = [
  'https://api-1.example.com',
  'https://api-2.example.com',
  'https://api-3.example.com'
];

let currentServerIndex = 0;

axios.interceptors.request.use(config => {
  const server = servers[currentServerIndex];
  config.url = `${server}${config.url}`;
  return config;
});

axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Don't retry indefinitely
    if (config.__serverRetries >= servers.length - 1) {
      return Promise.reject(error);
    }
    
    config.__serverRetries = (config.__serverRetries || 0) + 1;
    
    // Try next server
    currentServerIndex = (currentServerIndex + 1) % servers.length;
    
    console.log(`Failing over to server ${currentServerIndex + 1}`);
    
    return axios(config);
  }
);
```

### **Mirror APIs**

**Use mirror/replica** de third-party API:

```javascript
const WEATHER_APIS = [
  { name: 'OpenWeather', url: 'https://api.openweathermap.org' },
  { name: 'WeatherAPI', url: 'https://api.weatherapi.com' },
  { name: 'Tomorrow.io', url: 'https://api.tomorrow.io' }
];

async function getWeather(city) {
  for (const api of WEATHER_APIS) {
    try {
      const response = await fetchWeatherFrom(api, city);
      return response;
    } catch (error) {
      console.warn(`${api.name} failed, trying next...`);
    }
  }
  
  throw new Error('All weather APIs unavailable');
}
```

### **Regional Failover**

**Try regional endpoints**:

```javascript
const REGIONAL_ENDPOINTS = {
  'us-east': 'https://us-east-api.example.com',
  'us-west': 'https://us-west-api.example.com',
  'eu-west': 'https://eu-west-api.example.com',
  'ap-southeast': 'https://ap-southeast-api.example.com'
};

async function fetchFromNearestRegion(endpoint, preferredRegion = 'us-east') {
  const regions = Object.keys(REGIONAL_ENDPOINTS);
  
  // Try preferred region first
  try {
    const url = REGIONAL_ENDPOINTS[preferredRegion];
    return await axios.get(`${url}${endpoint}`);
  } catch (error) {
    console.warn(`${preferredRegion} failed, trying other regions...`);
  }
  
  // Try other regions
  for (const region of regions) {
    if (region === preferredRegion) continue;
    
    try {
      const url = REGIONAL_ENDPOINTS[region];
      return await axios.get(`${url}${endpoint}`);
    } catch (error) {
      console.warn(`${region} failed`);
    }
  }
  
  throw new Error('All regional endpoints unavailable');
}
```

### **Load Balancer Integration**

**Let load balancer** handle failover:

```javascript
// Single endpoint - load balancer routes to healthy instances
const API_URL = 'https://api.example.com'; // Points to load balancer

// Load balancer configuration (external):
// - Health checks on /health endpoint
// - Route to healthy instances only
// - Remove unhealthy instances from pool

axios.defaults.baseURL = API_URL;

// Application doesn't handle failover - load balancer does
const response = await axios.get('/api/user');
```

## Partial Responses

### **Subset de Features**

**Reduzir functionality** durante degradation:

```javascript
async function loadDashboard() {
  const data = {};
  
  // Essential data (required)
  try {
    data.user = await axios.get('/api/user');
  } catch (error) {
    throw error; // Cannot proceed sem user
  }
  
  // Non-essential data (optional)
  try {
    data.notifications = await axios.get('/api/notifications');
  } catch (error) {
    console.warn('Notifications unavailable');
    data.notifications = { items: [], degraded: true };
  }
  
  try {
    data.recommendations = await axios.get('/api/recommendations');
  } catch (error) {
    console.warn('Recommendations unavailable');
    data.recommendations = { items: [], degraded: true };
  }
  
  return data;
}
```

### **Reduced Functionality**

**Progressive degradation**:

```javascript
const features = {
  search: { critical: true, fallback: null },
  filters: { critical: false, fallback: 'basic-filters' },
  sorting: { critical: false, fallback: 'client-side-sort' },
  recommendations: { critical: false, fallback: 'popular-items' }
};

async function loadProductPage() {
  const availableFeatures = {};
  
  for (const [feature, config] of Object.entries(features)) {
    try {
      availableFeatures[feature] = await loadFeature(feature);
    } catch (error) {
      if (config.critical) {
        throw error;
      }
      
      if (config.fallback) {
        availableFeatures[feature] = await loadFallback(config.fallback);
      } else {
        availableFeatures[feature] = null;
      }
    }
  }
  
  return availableFeatures;
}
```

### **Essential-Only Mode**

**Minimal viable functionality**:

```javascript
const ESSENTIAL_ENDPOINTS = [
  '/api/auth/validate',
  '/api/user/profile'
];

const OPTIONAL_ENDPOINTS = [
  '/api/notifications',
  '/api/analytics',
  '/api/recommendations'
];

async function loadApp() {
  const data = {};
  
  // Load essential data - fail if unavailable
  for (const endpoint of ESSENTIAL_ENDPOINTS) {
    data[endpoint] = await axios.get(endpoint);
  }
  
  // Try optional data - continue on failure
  for (const endpoint of OPTIONAL_ENDPOINTS) {
    try {
      data[endpoint] = await axios.get(endpoint);
    } catch (error) {
      console.warn(`Optional endpoint ${endpoint} failed`);
      data[endpoint] = null;
    }
  }
  
  return data;
}
```

### **Progressive Enhancement**

**Start com basic, enhance quando available**:

```javascript
// Basic version (sempre available)
function renderProductList(products) {
  return products.map(p => `<div>${p.name} - ${p.price}</div>`);
}

// Enhanced version (se recommendations available)
function renderProductListWithRecommendations(products, recommendations) {
  return products.map(p => {
    const rec = recommendations.find(r => r.id === p.id);
    const badge = rec ? `<span>⭐ Recommended</span>` : '';
    return `<div>${p.name} - ${p.price} ${badge}</div>`;
  });
}

// Usage
async function displayProducts() {
  const products = await axios.get('/api/products');
  
  let html = renderProductList(products.data);
  document.getElementById('products').innerHTML = html;
  
  // Try enhance com recommendations
  try {
    const recommendations = await axios.get('/api/recommendations');
    html = renderProductListWithRecommendations(products.data, recommendations.data);
    document.getElementById('products').innerHTML = html;
  } catch (error) {
    console.log('Recommendations unavailable, using basic view');
  }
}
```

## Circuit Breaker Integration

### **Fast-Fail com Fallback**

**Quando circuit is OPEN**, immediately return fallback sem tentar request:

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }
  
  async execute(fn, fallback) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        console.log('Circuit OPEN - using fallback');
        return fallback();
      }
      
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      
      return result;
    } catch (error) {
      this.failureCount++;
      
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.timeout;
        console.log('Circuit opened due to failures');
      }
      
      return fallback();
    }
  }
}

const breaker = new CircuitBreaker();

async function fetchUserProfile() {
  return breaker.execute(
    () => axios.get('/api/user/profile').then(r => r.data),
    () => {
      const cached = cache.get('/api/user/profile');
      return cached || getDefaultProfile();
    }
  );
}
```

### **Preventing Cascading Failures**

**Isolate failures** para prevent propagation:

```javascript
const breakers = {
  '/api/user': new CircuitBreaker(),
  '/api/products': new CircuitBreaker(),
  '/api/orders': new CircuitBreaker()
};

axios.interceptors.response.use(
  response => {
    const url = response.config.url;
    const breaker = breakers[url];
    
    if (breaker) {
      breaker.recordSuccess();
    }
    
    return response;
  },
  async error => {
    const url = error.config.url;
    const breaker = breakers[url];
    
    if (breaker) {
      breaker.recordFailure();
      
      if (breaker.isOpen()) {
        // Circuit open - use fallback
        const cached = cache.get(url);
        
        if (cached) {
          return {
            data: cached,
            status: 200,
            fromCache: true,
            circuitOpen: true
          };
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Advanced Patterns

### **Stale-While-Revalidate**

**Return stale cache immediately, revalidate em background**:

```javascript
async function fetchWithSWR(url) {
  const cached = cache.get(url);
  
  if (cached) {
    // Return cached immediately
    const result = { ...cached, fromCache: true };
    
    // Revalidate em background
    axios.get(url)
      .then(response => {
        cache.set(url, response.data);
        // Optionally notify UI to update
        eventBus.emit('data-refreshed', { url, data: response.data });
      })
      .catch(error => {
        console.warn('Background revalidation failed', error);
      });
    
    return result;
  }
  
  // No cache - fetch normally
  const response = await axios.get(url);
  cache.set(url, response.data);
  return response.data;
}
```

### **Request Queuing (Offline Mode)**

**Queue requests** quando offline, send quando online:

```javascript
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    
    window.addEventListener('online', () => this.processQueue());
  }
  
  add(config) {
    this.queue.push(config);
    console.log(`Queued request: ${config.method} ${config.url}`);
    
    if (navigator.onLine) {
      this.processQueue();
    }
  }
  
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const config = this.queue.shift();
      
      try {
        await axios(config);
        console.log(`Processed queued request: ${config.url}`);
      } catch (error) {
        console.error(`Failed to process queued request: ${config.url}`);
        // Re-queue?
      }
    }
    
    this.processing = false;
  }
}

const queue = new RequestQueue();

axios.interceptors.response.use(
  response => response,
  error => {
    if (!navigator.onLine) {
      // Offline - queue request
      queue.add(error.config);
      
      // Return cached data se disponível
      const cached = cache.get(error.config.url);
      if (cached) {
        return { data: cached, fromCache: true, offline: true };
      }
      
      return Promise.reject(new Error('Offline - request queued'));
    }
    
    return Promise.reject(error);
  }
);
```

### **Hybrid Responses (Partial Success)**

**Combine successful e fallback data**:

```javascript
async function loadDashboardHybrid() {
  const requests = {
    user: axios.get('/api/user'),
    posts: axios.get('/api/posts'),
    notifications: axios.get('/api/notifications'),
    recommendations: axios.get('/api/recommendations')
  };
  
  const results = await Promise.allSettled(Object.values(requests));
  
  const data = {};
  const keys = Object.keys(requests);
  
  results.forEach((result, index) => {
    const key = keys[index];
    
    if (result.status === 'fulfilled') {
      data[key] = { data: result.value.data, source: 'api' };
    } else {
      // Try cache fallback
      const cached = cache.get(requests[key].url);
      
      if (cached) {
        data[key] = { data: cached, source: 'cache' };
      } else {
        data[key] = { data: null, source: 'none', error: result.reason };
      }
    }
  });
  
  return data;
}
```

### **Fallback Chains**

**Try múltiplos fallbacks sequentially**:

```javascript
async function fetchWithChain(url, fallbacks = []) {
  // Try primary
  try {
    const response = await axios.get(url);
    return { data: response.data, source: 'primary' };
  } catch (error) {
    console.warn('Primary request failed');
  }
  
  // Try fallbacks
  for (let i = 0; i < fallbacks.length; i++) {
    try {
      const result = await fallbacks[i]();
      return { data: result, source: `fallback-${i + 1}` };
    } catch (error) {
      console.warn(`Fallback ${i + 1} failed`);
    }
  }
  
  throw new Error('All fallback strategies failed');
}

// Usage
const data = await fetchWithChain('/api/products', [
  () => cache.get('/api/products'),
  () => axios.get('/api/products/cached'),
  () => getDefaultProducts(),
  () => []
]);
```

## Best Practices

### **1. Document Fallback Behavior**

```javascript
/**
 * Fetch user profile com fallback chain:
 * 1. Primary API request
 * 2. Cache (se < 1 hour old)
 * 3. Default anonymous profile
 * 
 * @returns {Object} User profile com _source indicator
 */
async function getUserProfile() {
  // ...
}
```

### **2. Monitor Fallback Usage**

```javascript
const fallbackMetrics = {
  cache: 0,
  default: 0,
  alternative: 0
};

function recordFallback(type) {
  fallbackMetrics[type]++;
  
  // Alert se fallback usage alto
  const total = Object.values(fallbackMetrics).reduce((a, b) => a + b, 0);
  const fallbackRate = total / (total + successCount);
  
  if (fallbackRate > 0.2) { // >20% fallback
    alerting.warn('High fallback usage - check primary service');
  }
}
```

### **3. Test Fallback Paths**

```javascript
// Test cache fallback
test('uses cache when API fails', async () => {
  cache.set('/api/user', { id: 1, name: 'Alice' });
  
  axios.get.mockRejectedValue(new Error('Network error'));
  
  const data = await fetchUser();
  
  expect(data).toEqual({ id: 1, name: 'Alice' });
  expect(data._source).toBe('cache');
});

// Test default fallback
test('uses defaults when cache empty', async () => {
  axios.get.mockRejectedValue(new Error('Network error'));
  
  const data = await fetchUser();
  
  expect(data.name).toBe('Guest');
  expect(data._source).toBe('default');
});
```

### **4. User Transparency**

```javascript
// Show indicator quando usando fallback
if (response.fromCache) {
  showBanner('⚠️ Data may be outdated. Refresh to update.');
}

if (response.fromDefault) {
  showBanner('⚠️ Using default settings. Some features unavailable.');
}

if (response.degraded) {
  showBanner('⚠️ Service degraded. Limited functionality available.');
}
```

---

# 🎯 Aplicabilidade

## Quando Usar Fallback Strategies

**Critical Applications**: Banking, healthcare, e-commerce onde downtime é inacceptable.

**Poor Network Conditions**: Mobile apps, offline-first PWAs.

**Third-Party Dependencies**: When relying on external APIs que podem fail.

**Graceful Degradation**: Features non-essential que podem ser disabled.

## Quando NÃO Usar

**Consistency Critical**: Financial transactions, inventory updates onde stale data é dangerous.

**Real-Time Requirements**: Live data onde cached/default values são misleading.

---

# ⚠️ Limitações

## Stale Data Risks

Cached/default data pode estar outdated ou incorrect.

**Solution**: Indicar freshness, revalidate em background.

## Complexity

Multiple fallback paths aumentam code complexity e testing burden.

**Solution**: Clear documentation, comprehensive tests.

---

# 🔗 Interconexões

## Caching

Fallback strategies frequentemente dependem de cached data.

## Circuit Breakers

Circuit breakers trigger fallbacks quando service está degraded.

## Retry Logic

Try retries antes de fallback para transient errors.

---

# 🚀 Evolução

## Service Mesh

Service meshes (Istio, Linkerd) implementam fallback patterns no infrastructure level.

## GraphQL

GraphQL partial responses permitem fallback granular por field.

## Edge Computing

CDN edge nodes servem cached fallbacks quando origin unreachable.

---

**Conclusão Integrada**: Fallback strategies são essential resilience mechanism que transforma hard failures em graceful degradation, permitindo aplicações continue functioning durante partial outages através de alternative responses (cached data, default values, backup endpoints, reduced functionality). Effective implementations seguem fallback hierarchy: primary API → recent cache → stale cache → defaults → error, com each level providing progressively degraded mas still useful data. Integration com circuit breakers permite fast-fail behavior que immediately serves fallbacks quando service is known degraded, preventing unnecessary latency. Advanced patterns incluem stale-while-revalidate (return cached immediately, revalidate background), request queuing para offline mode, e hybrid responses combining successful e fallback data. Critical considerations incluem user transparency (indicating quando using fallback data), monitoring fallback usage rates (high fallback usage indicates underlying issues), comprehensive testing de fallback paths, e balancing between availability gains vs stale data risks. Best practices: document fallback behavior clearly, monitor metrics, test all paths, show degraded state indicators to users, combine com retry logic (try retries first before falling back), e respect consistency requirements (don't use stale data para critical operations like payments).