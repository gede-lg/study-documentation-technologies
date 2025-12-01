# 🎯 Introdução

**Network detection** é capability fundamental para aplicações resilientes que permite **detectar e responder a mudanças na connectivity state** (online/offline transitions, connection quality degradation, network type changes), enabling adaptive behaviors como pausing requests quando offline, showing offline indicators, queuing mutations, e adjusting retry strategies baseado em network conditions. Esta awareness transforma aplicações de brittle (breaking silently quando network fails) para robust (handling connectivity issues gracefully).

O problema central que network detection resolve é **blind network assumptions**: aplicações tradicionais assumem network está sempre available e falham catastrophically quando não está, mostrando generic error messages que não explicam root cause. Users ficam confusos quando clicks não respondem, sem saber se problema é application bug, server issue, ou connectivity loss. Network detection permite **proactive communication**: "You're offline. Changes will sync when reconnected."

Modern browsers fornecem **Navigator Online API** (`navigator.onLine` property e `online`/`offline` events) que indicam basic connectivity state, mas esta API tem **limitations**: apenas detecta se device tem network interface ativa, não verifica se internet realmente está accessible (false positives quando connected a WiFi sem internet). Advanced detection strategies incluem **polling endpoints** (periodic health checks), **timeout-based detection** (inferring offline de request timeouts), e **Network Information API** (monitoring connection quality e type).

Entretanto, network detection introduz **complexity**: polling adiciona overhead, event listeners devem ser properly cleaned up, e offline handling requer thoughtful UX design (what operations permitir offline? how queue e sync data?). Effective implementations balanceiam entre detection accuracy, performance overhead, e user experience quality, escolhendo appropriate strategies baseado em application requirements.

Este módulo explora network detection em profundidade: desde Navigator Online API fundamentals e limitations, através de advanced detection techniques (polling, timeout inference, Network Information API), até practical integration patterns com Axios (automatic request pausing, queue management, retry strategy adaptation). Objetivo é fornecer knowledge completo para implementar robust network awareness que melhora application resilience e user experience.

---

# 📋 Sumário

### **Network Detection Fundamentals**
- Por que detectar network state
- Navigator Online API
- Limitations e false positives
- Browser support

### **Online/Offline Events**
- window online/offline events
- Event listeners
- Initial state detection
- Cleanup patterns

### **Advanced Detection**
- Polling health endpoints
- Timeout-based inference
- HTTP ping requests
- Heartbeat mechanisms

### **Network Information API**
- Connection type detection
- Effective bandwidth
- RTT (Round-Trip Time)
- Data saver mode

### **Axios Integration**
- Pause requests quando offline
- Request queueing
- Automatic retry quando reconnected
- Offline indicators

### **Adaptive Behaviors**
- Adjust retry strategies
- Reduce polling frequency
- Lower quality resources
- Defer non-critical requests

### **Offline-First Patterns**
- Service Workers
- IndexedDB queuing
- Sync API
- Background sync

### **Best Practices**
- Combine multiple detection methods
- Show clear offline indicators
- Queue mutations, reload queries
- Test offline scenarios

---

# 🧠 Fundamentos

## Network Detection Fundamentals

### **Por Que Detectar Network State**

**Problems sem Network Detection**:

```javascript
// ❌ Blind request - fails silently quando offline
try {
  const response = await axios.post('/api/save', data);
  showSuccess('Saved!');
} catch (error) {
  showError('Save failed'); // Generic - user doesn't know why
}
```

**Com Network Detection**:

```javascript
// ✅ Network-aware - provides context
if (!navigator.onLine) {
  showWarning('You are offline. Changes will sync when reconnected.');
  queueForSync(data);
  return;
}

try {
  const response = await axios.post('/api/save', data);
  showSuccess('Saved!');
} catch (error) {
  if (isNetworkError(error)) {
    showError('Network error - check your connection');
  } else {
    showError('Save failed - please try again');
  }
}
```

### **Navigator Online API**

**Basic Detection**:

```javascript
// Check current state
if (navigator.onLine) {
  console.log('Online');
} else {
  console.log('Offline');
}

// Listen para changes
window.addEventListener('online', () => {
  console.log('Connection restored');
  handleReconnect();
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  handleDisconnect();
});
```

### **Limitations e False Positives**

**Limitation 1**: Apenas detecta local interface status, não internet connectivity.

```javascript
// Scenario: Connected to WiFi sem internet
console.log(navigator.onLine); // true (FALSE POSITIVE)

// Axios request fails
await axios.get('/api/data'); // Error: Network Error
```

**Limitation 2**: Não detecta poor connection quality.

```javascript
// Scenario: Very slow 2G connection
console.log(navigator.onLine); // true

// Request timeouts devido a slow connection
await axios.get('/api/data', { timeout: 5000 }); // Timeout
```

**Limitation 3**: Delayed updates em some browsers.

```javascript
// Disconnect WiFi
console.log(navigator.onLine); // Pode ainda mostrar true por alguns segundos
```

### **Browser Support**

**Navigator.onLine**: Suportado em todos browsers modernos (IE9+, Chrome, Firefox, Safari, Edge).

**Online/Offline Events**: Suportado universalmente.

**Network Information API**: Limited support (Chrome, Edge, Opera - não Safari, Firefox).

## Online/Offline Events

### **Event Listeners**

**Basic Setup**:

```javascript
function handleOnline() {
  console.log('Connection restored');
  showNotification('You are back online', 'success');
  
  // Resume paused operations
  processQueue();
}

function handleOffline() {
  console.log('Connection lost');
  showNotification('You are offline', 'warning');
  
  // Pause operations
  pauseRequests();
}

window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);
```

**React Hook**:

```javascript
import { useState, useEffect } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    
    function handleOffline() {
      setIsOnline(false);
    }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

// Usage
function App() {
  const isOnline = useOnlineStatus();
  
  return (
    <div>
      {!isOnline && <OfflineBanner />}
      {/* rest of app */}
    </div>
  );
}
```

### **Initial State Detection**

**Check state on load**:

```javascript
// On app initialization
function initializeApp() {
  const isOnline = navigator.onLine;
  
  if (isOnline) {
    loadFreshData();
  } else {
    loadCachedData();
    showOfflineIndicator();
  }
  
  // Setup listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}
```

### **Cleanup Patterns**

**Remove listeners** quando component unmounts:

```javascript
class NetworkMonitor {
  constructor() {
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
    
    this.start();
  }
  
  start() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }
  
  stop() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
  
  handleOnline() {
    console.log('Online');
  }
  
  handleOffline() {
    console.log('Offline');
  }
}

const monitor = new NetworkMonitor();

// Cleanup
window.addEventListener('beforeunload', () => {
  monitor.stop();
});
```

## Advanced Detection

### **Polling Health Endpoints**

**Periodic checks** para verify real connectivity:

```javascript
class NetworkDetector {
  constructor(interval = 30000) {
    this.interval = interval;
    this.isOnline = navigator.onLine;
    this.polling = null;
  }
  
  start() {
    // Immediate check
    this.checkConnection();
    
    // Periodic checks
    this.polling = setInterval(() => {
      this.checkConnection();
    }, this.interval);
  }
  
  async checkConnection() {
    try {
      const response = await axios.get('/api/health', {
        timeout: 5000,
        // Prevent caching
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.status === 200) {
        this.setOnline(true);
      }
    } catch (error) {
      this.setOnline(false);
    }
  }
  
  setOnline(status) {
    if (this.isOnline !== status) {
      this.isOnline = status;
      
      if (status) {
        this.onOnline();
      } else {
        this.onOffline();
      }
    }
  }
  
  onOnline() {
    console.log('Connection verified');
  }
  
  onOffline() {
    console.log('Connection lost');
  }
  
  stop() {
    if (this.polling) {
      clearInterval(this.polling);
    }
  }
}

const detector = new NetworkDetector(30000); // Check every 30s
detector.start();
```

### **Timeout-Based Inference**

**Infer offline** de request timeouts:

```javascript
axios.interceptors.response.use(
  response => {
    // Successful response - likely online
    window.lastSuccessfulRequest = Date.now();
    return response;
  },
  error => {
    // Check se é timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      const timeSinceSuccess = Date.now() - (window.lastSuccessfulRequest || 0);
      
      // Se multiple consecutive timeouts, likely offline
      if (timeSinceSuccess > 60000) { // 1 min sem success
        console.warn('Possible connectivity issue detected');
        triggerOfflineMode();
      }
    }
    
    return Promise.reject(error);
  }
);
```

### **HTTP Ping Requests**

**Lightweight ping** para check connectivity:

```javascript
async function pingServer() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/ping', {
      method: 'HEAD', // Lightweight - no body
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Usage
async function checkOnlineStatus() {
  const isOnline = await pingServer();
  
  if (isOnline) {
    showOnlineIndicator();
  } else {
    showOfflineIndicator();
  }
}
```

### **Heartbeat Mechanisms**

**Regular heartbeat** para server:

```javascript
class Heartbeat {
  constructor(interval = 30000) {
    this.interval = interval;
    this.timer = null;
    this.isAlive = true;
  }
  
  start() {
    this.beat();
  }
  
  async beat() {
    try {
      await axios.post('/api/heartbeat', {
        timestamp: Date.now(),
        clientId: getClientId()
      }, {
        timeout: 5000
      });
      
      if (!this.isAlive) {
        console.log('Connection restored');
        this.onReconnect();
      }
      
      this.isAlive = true;
    } catch (error) {
      if (this.isAlive) {
        console.log('Connection lost');
        this.onDisconnect();
      }
      
      this.isAlive = false;
    }
    
    this.timer = setTimeout(() => this.beat(), this.interval);
  }
  
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  
  onReconnect() {
    // Handle reconnection
  }
  
  onDisconnect() {
    // Handle disconnection
  }
}

const heartbeat = new Heartbeat(30000);
heartbeat.start();
```

## Network Information API

### **Connection Type Detection**

**Experimental API** (limited browser support):

```javascript
// Check se supported
if ('connection' in navigator) {
  const connection = navigator.connection;
  
  console.log('Type:', connection.effectiveType); // 4g, 3g, 2g, slow-2g
  console.log('Downlink:', connection.downlink); // Mbps
  console.log('RTT:', connection.rtt); // Round-trip time (ms)
  console.log('SaveData:', connection.saveData); // Data saver mode
  
  // Listen para changes
  connection.addEventListener('change', () => {
    console.log('Connection changed:', connection.effectiveType);
    handleConnectionChange(connection);
  });
}
```

### **Effective Bandwidth**

**Adjust behavior** baseado em bandwidth:

```javascript
function getConnectionQuality() {
  if (!navigator.connection) {
    return 'unknown';
  }
  
  const connection = navigator.connection;
  const type = connection.effectiveType;
  
  switch (type) {
    case '4g':
      return 'excellent';
    case '3g':
      return 'good';
    case '2g':
      return 'poor';
    case 'slow-2g':
      return 'very-poor';
    default:
      return 'unknown';
  }
}

function loadContent() {
  const quality = getConnectionQuality();
  
  switch (quality) {
    case 'excellent':
    case 'good':
      loadHighQualityImages();
      enableAutoplay();
      break;
      
    case 'poor':
    case 'very-poor':
      loadLowQualityImages();
      disableAutoplay();
      showDataSaverWarning();
      break;
      
    default:
      loadMediumQualityImages();
  }
}
```

### **RTT (Round-Trip Time)**

**Measure latency**:

```javascript
function isHighLatency() {
  if (!navigator.connection) {
    return false;
  }
  
  const rtt = navigator.connection.rtt;
  
  return rtt > 1000; // > 1 second RTT
}

function adjustPollingFrequency() {
  if (isHighLatency()) {
    // Reduce polling frequency em high latency
    return 60000; // 1 minute
  } else {
    return 10000; // 10 seconds
  }
}
```

### **Data Saver Mode**

**Respect user's data saver preference**:

```javascript
function shouldReduceDataUsage() {
  if (!navigator.connection) {
    return false;
  }
  
  return navigator.connection.saveData === true;
}

function loadImages() {
  if (shouldReduceDataUsage()) {
    // Load compressed images
    return loadCompressedImages();
  } else {
    // Load full quality
    return loadFullQualityImages();
  }
}

function enableFeatures() {
  if (shouldReduceDataUsage()) {
    disableAutoplay();
    disableBackgroundSync();
    reducePrefetching();
  }
}
```

## Axios Integration

### **Pause Requests Quando Offline**

**Prevent requests** quando offline:

```javascript
let isOnline = navigator.onLine;

window.addEventListener('online', () => {
  isOnline = true;
});

window.addEventListener('offline', () => {
  isOnline = false;
});

axios.interceptors.request.use(config => {
  if (!isOnline) {
    // Cancel request
    const error = new Error('No internet connection');
    error.isOffline = true;
    return Promise.reject(error);
  }
  
  return config;
});

// Handle offline errors
try {
  await axios.get('/api/data');
} catch (error) {
  if (error.isOffline) {
    showOfflineMessage();
  } else {
    showGenericError();
  }
}
```

### **Request Queueing**

**Queue requests** quando offline, send quando reconnected:

```javascript
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  add(config) {
    if (!this.isOnline) {
      console.log('Offline - queueing request:', config.url);
      this.queue.push(config);
      return Promise.resolve({ queued: true });
    }
    
    return axios(config);
  }
  
  async processQueue() {
    console.log(`Processing ${this.queue.length} queued requests`);
    
    while (this.queue.length > 0) {
      const config = this.queue.shift();
      
      try {
        await axios(config);
        console.log('Processed:', config.url);
      } catch (error) {
        console.error('Failed to process:', config.url);
        
        // Re-queue se offline again
        if (!navigator.onLine) {
          this.queue.unshift(config);
          break;
        }
      }
    }
  }
}

const offlineQueue = new OfflineQueue();

// Usage
axios.interceptors.request.use(config => {
  if (!navigator.onLine && config.method !== 'get') {
    // Queue mutations
    return offlineQueue.add(config);
  }
  
  return config;
});
```

### **Automatic Retry Quando Reconnected**

**Retry failed requests** após reconnect:

```javascript
const failedRequests = [];

axios.interceptors.response.use(
  response => response,
  error => {
    // Se network error, save para retry
    if (!navigator.onLine || isNetworkError(error)) {
      failedRequests.push(error.config);
    }
    
    return Promise.reject(error);
  }
);

window.addEventListener('online', async () => {
  console.log(`Retrying ${failedRequests.length} failed requests`);
  
  while (failedRequests.length > 0) {
    const config = failedRequests.shift();
    
    try {
      await axios(config);
    } catch (error) {
      console.error('Retry failed:', config.url);
    }
  }
});
```

### **Offline Indicators**

**Show UI indicators**:

```javascript
class NetworkStatus {
  constructor() {
    this.banner = null;
    this.isOnline = navigator.onLine;
    
    this.init();
  }
  
  init() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Show initial state
    if (!this.isOnline) {
      this.showOfflineBanner();
    }
  }
  
  handleOnline() {
    this.isOnline = true;
    this.hideOfflineBanner();
    this.showToast('Connection restored', 'success');
  }
  
  handleOffline() {
    this.isOnline = false;
    this.showOfflineBanner();
  }
  
  showOfflineBanner() {
    this.banner = document.createElement('div');
    this.banner.className = 'offline-banner';
    this.banner.innerHTML = '⚠️ You are offline. Changes will sync when reconnected.';
    document.body.prepend(this.banner);
  }
  
  hideOfflineBanner() {
    if (this.banner) {
      this.banner.remove();
      this.banner = null;
    }
  }
  
  showToast(message, type) {
    // Toast notification implementation
  }
}

const networkStatus = new NetworkStatus();
```

## Adaptive Behaviors

### **Adjust Retry Strategies**

**Different retry configs** para online vs offline:

```javascript
function getRetryConfig() {
  if (!navigator.onLine) {
    // Offline - don't retry
    return { retries: 0 };
  }
  
  const connection = navigator.connection;
  
  if (connection) {
    const type = connection.effectiveType;
    
    switch (type) {
      case '4g':
        // Fast connection - aggressive retries
        return { retries: 5, retryDelay: 1000 };
        
      case '3g':
        // Medium - moderate retries
        return { retries: 3, retryDelay: 2000 };
        
      case '2g':
      case 'slow-2g':
        // Slow - fewer retries, longer delays
        return { retries: 2, retryDelay: 5000 };
        
      default:
        return { retries: 3, retryDelay: 2000 };
    }
  }
  
  return { retries: 3, retryDelay: 2000 };
}

axiosRetry(axios, getRetryConfig());
```

### **Reduce Polling Frequency**

**Adaptive polling** baseado em connection:

```javascript
function getPollingInterval() {
  if (!navigator.onLine) {
    // Offline - stop polling
    return null;
  }
  
  const connection = navigator.connection;
  
  if (connection) {
    const type = connection.effectiveType;
    
    switch (type) {
      case '4g':
        return 5000; // 5s
      case '3g':
        return 15000; // 15s
      case '2g':
      case 'slow-2g':
        return 60000; // 1min
      default:
        return 10000; // 10s
    }
  }
  
  return 10000;
}

let pollingTimer = null;

function startPolling() {
  const interval = getPollingInterval();
  
  if (interval === null) {
    stopPolling();
    return;
  }
  
  pollingTimer = setInterval(() => {
    fetchUpdates();
  }, interval);
}

function stopPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

// Adjust quando connection changes
if (navigator.connection) {
  navigator.connection.addEventListener('change', () => {
    stopPolling();
    startPolling();
  });
}
```

### **Lower Quality Resources**

**Load appropriate resources** baseado em connection:

```javascript
function getImageQuality() {
  if (!navigator.connection) {
    return 'medium';
  }
  
  const type = navigator.connection.effectiveType;
  
  switch (type) {
    case '4g':
      return 'high';
    case '3g':
      return 'medium';
    case '2g':
    case 'slow-2g':
      return 'low';
    default:
      return 'medium';
  }
}

function loadImage(baseUrl) {
  const quality = getImageQuality();
  
  const urls = {
    high: `${baseUrl}/full.jpg`,
    medium: `${baseUrl}/medium.jpg`,
    low: `${baseUrl}/thumbnail.jpg`
  };
  
  return urls[quality];
}

// Usage
const imageUrl = loadImage('/images/product-123');
// Returns: /images/product-123/thumbnail.jpg em 2G
```

### **Defer Non-Critical Requests**

**Prioritize critical requests**:

```javascript
const requestPriorities = {
  critical: [],
  normal: [],
  deferred: []
};

function queueRequest(config, priority = 'normal') {
  if (!navigator.onLine) {
    requestPriorities.deferred.push(config);
    return Promise.reject(new Error('Offline'));
  }
  
  const connection = navigator.connection;
  const isSlow = connection && ['2g', 'slow-2g'].includes(connection.effectiveType);
  
  if (isSlow && priority === 'deferred') {
    console.log('Deferring non-critical request:', config.url);
    requestPriorities.deferred.push(config);
    return Promise.resolve({ deferred: true });
  }
  
  return axios(config);
}

// Process deferred quando connection improves
if (navigator.connection) {
  navigator.connection.addEventListener('change', () => {
    const type = navigator.connection.effectiveType;
    
    if (type === '4g' || type === '3g') {
      processDeferredRequests();
    }
  });
}

async function processDeferredRequests() {
  while (requestPriorities.deferred.length > 0) {
    const config = requestPriorities.deferred.shift();
    
    try {
      await axios(config);
    } catch (error) {
      console.error('Deferred request failed:', config.url);
    }
  }
}
```

## Offline-First Patterns

### **Service Workers**

**Cache responses** para offline access:

```javascript
// service-worker.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached se available
        if (response) {
          return response;
        }
        
        // Fetch e cache
        return fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            
            caches.open('v1').then(cache => {
              cache.put(event.request, responseClone);
            });
            
            return response;
          });
      })
      .catch(() => {
        // Offline fallback
        return caches.match('/offline.html');
      })
  );
});
```

### **IndexedDB Queuing**

**Persist queued requests**:

```javascript
import { openDB } from 'idb';

class PersistentQueue {
  constructor() {
    this.dbPromise = openDB('offline-queue', 1, {
      upgrade(db) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
    });
  }
  
  async add(config) {
    const db = await this.dbPromise;
    await db.add('requests', {
      config,
      timestamp: Date.now()
    });
  }
  
  async getAll() {
    const db = await this.dbPromise;
    return db.getAll('requests');
  }
  
  async clear() {
    const db = await this.dbPromise;
    await db.clear('requests');
  }
}

const queue = new PersistentQueue();

// Queue quando offline
window.addEventListener('offline', async () => {
  // Save pending requests
});

// Process quando online
window.addEventListener('online', async () => {
  const requests = await queue.getAll();
  
  for (const req of requests) {
    await axios(req.config);
  }
  
  await queue.clear();
});
```

### **Background Sync API**

**Sync quando reconnected**:

```javascript
// Register sync
if ('serviceWorker' in navigator && 'sync' in self.registration) {
  navigator.serviceWorker.ready.then(registration => {
    registration.sync.register('sync-data');
  });
}

// service-worker.js
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Process queued requests
  const queue = await getQueuedRequests();
  
  for (const request of queue) {
    await fetch(request.url, request.options);
  }
}
```

## Best Practices

### **1. Combine Multiple Detection Methods**

```javascript
class RobustNetworkDetector {
  constructor() {
    this.isOnline = navigator.onLine;
    
    // Method 1: Navigator API
    window.addEventListener('online', () => this.setOnline(true));
    window.addEventListener('offline', () => this.setOnline(false));
    
    // Method 2: Periodic ping
    setInterval(() => this.pingServer(), 30000);
    
    // Method 3: Monitor request failures
    this.monitorRequests();
  }
  
  async pingServer() {
    try {
      await axios.get('/api/health', { timeout: 5000 });
      this.setOnline(true);
    } catch (error) {
      this.setOnline(false);
    }
  }
  
  monitorRequests() {
    axios.interceptors.response.use(
      response => {
        this.setOnline(true);
        return response;
      },
      error => {
        if (isNetworkError(error)) {
          this.setOnline(false);
        }
        return Promise.reject(error);
      }
    );
  }
  
  setOnline(status) {
    if (this.isOnline !== status) {
      this.isOnline = status;
      this.notify(status);
    }
  }
  
  notify(status) {
    // Notify application
  }
}
```

### **2. Show Clear Offline Indicators**

```javascript
// ✅ Clear, actionable
function showOfflineBanner() {
  banner.innerHTML = `
    <div class="offline-banner">
      ⚠️ No internet connection.
      <button onclick="retry()">Retry</button>
    </div>
  `;
}

// ❌ Vague
function showError() {
  alert('Error'); // Unhelpful
}
```

### **3. Queue Mutations, Reload Queries**

```javascript
axios.interceptors.request.use(config => {
  if (!navigator.onLine) {
    if (config.method !== 'get') {
      // Queue mutations (POST, PUT, DELETE)
      queue.add(config);
      return Promise.reject(new Error('Queued for sync'));
    } else {
      // Return cached data para queries
      const cached = cache.get(config.url);
      if (cached) {
        return Promise.resolve({ data: cached, fromCache: true });
      }
    }
  }
  
  return config;
});
```

### **4. Test Offline Scenarios**

```javascript
// Simulate offline
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: false
});

window.dispatchEvent(new Event('offline'));

// Test
test('shows offline banner quando offline', () => {
  expect(document.querySelector('.offline-banner')).toBeTruthy();
});

test('queues mutations quando offline', async () => {
  await expect(axios.post('/api/save', data)).rejects.toThrow('Queued');
  expect(queue.length).toBe(1);
});
```

---

# 🎯 Aplicabilidade

## Quando Usar Network Detection

**Mobile Apps**: Frequent connectivity changes.

**Offline-First Apps**: PWAs, note-taking apps.

**Real-Time Apps**: Chat, collaborative editing.

**Data-Heavy Apps**: Video streaming, large file uploads.

## Quando Pode Ser Opcional

**Simple Websites**: Mostly static content.

**Internal Apps**: Stable network environments.

---

# ⚠️ Limitações

## Navigator.onLine False Positives

Pode reportar online quando connected a WiFi sem internet.

**Solution**: Combine com ping checks.

## Network Information API Support

Limited browser support (não Safari, Firefox).

**Solution**: Feature detection, fallbacks.

---

# 🔗 Interconexões

## Retry Logic

Network detection determina quando retry (skip retries quando offline).

## Fallback Strategies

Offline triggers fallback para cached data.

## Request Queueing

Offline state triggers request queueing mechanism.

---

# 🚀 Evolução

## 5G Networks

Faster, more reliable connections reduce need para aggressive offline handling.

## Service Workers

Standard para offline-first web applications.

## WebTransport

New protocol para better connection management.

---

**Conclusão Integrada**: Network detection é essential capability para resilient applications que permite detectar e responder a connectivity state changes através de Navigator Online API (`navigator.onLine`, `online`/`offline` events), advanced techniques (polling health endpoints, timeout-based inference, Network Information API para connection quality), e integration patterns com Axios (automatic request pausing, queuing, retry adaptation). Effective implementations combine múltiplos detection methods para overcome Navigator API limitations (false positives quando connected a WiFi sem internet, delayed updates), provide clear UI feedback (offline banners, toast notifications), e implement adaptive behaviors (adjust retry strategies, reduce polling frequency, lower resource quality, defer non-critical requests baseado em connection type). Offline-first patterns usando Service Workers, IndexedDB queuing, e Background Sync API enable applications function seamlessly durante connectivity loss. Critical considerations incluem distinguishing between mutations (queue para later sync) vs queries (serve cached data), testing offline scenarios comprehensively, e balancing between detection accuracy (polling overhead) vs responsiveness. Best practices: combine Navigator API com periodic pings, show actionable offline indicators, queue mutations mas reload queries quando reconnected, respect data saver mode, adapt behavior baseado em Network Information API (connection type, RTT, bandwidth), e implement graceful degradation que maintains core functionality mesmo durante poor connectivity.