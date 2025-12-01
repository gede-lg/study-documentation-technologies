# Interceptor Patterns (chaining, conditional, async)

## 🎯 Introdução e Definição

### Definição Conceitual

**Interceptor Patterns** são **estratégias de design e organização** para compor, condicionar e executar interceptors de forma eficiente e manutenível. Conceitualmente, são **padrões arquiteturais** que determinam COMO múltiplos interceptors interagem, QUANDO são executados, e COMO lidar com operações assíncronas complexas.

Três padrões fundamentais:

1. **Chaining (Encadeamento):** Múltiplos interceptors executados sequencialmente
2. **Conditional (Condicional):** Interceptors executados apenas sob certas condições
3. **Async (Assíncrono):** Interceptors que realizam operações assíncronas

**Analogia:** Pense em interceptors como **filtros de água** - você pode ter múltiplos filtros em série (chaining), filtros que ativam apenas em certas condições (conditional), ou filtros que demoram para processar (async).

**Chaining - Múltiplos Interceptors em Sequência:**
```javascript
// Interceptor 1 - Auth
axios.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer token';
  return config;
});

// Interceptor 2 - Logging
axios.interceptors.request.use(config => {
  console.log('Request:', config.url);
  return config;
});

// Interceptor 3 - Metadata
axios.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

// Execução: 3 → 2 → 1 (LIFO para request)
await axios.get('/api/dados');
```

**Conditional - Executar Apenas sob Condições:**
```javascript
axios.interceptors.request.use(config => {
  // Adicionar auth APENAS se endpoint não for público
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublic = publicEndpoints.some(endpoint => config.url.startsWith(endpoint));
  
  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return config;
});
```

**Async - Operações Assíncronas:**
```javascript
axios.interceptors.request.use(async config => {
  // Renovar token se expirado
  const tokenExpiry = localStorage.getItem('token_expiry');
  
  if (Date.now() > parseInt(tokenExpiry)) {
    console.log('Token expirado, renovando...');
    
    // Operação assíncrona
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await axios.post('/auth/refresh', { refreshToken });
    
    const newToken = response.data.access_token;
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('token_expiry', Date.now() + 3600000);
    
    config.headers['Authorization'] = `Bearer ${newToken}`;
  } else {
    const token = localStorage.getItem('access_token');
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});
```

### Contexto Histórico e Motivação

**Problema:** Aplicações reais precisam de **múltiplas camadas de processamento** - auth, logging, validation, transformation, retry, etc. Organizar isso de forma manutenível é desafiador.

**Antes de patterns:**
```javascript
// ❌ Interceptor monolítico - faz TUDO
axios.interceptors.request.use(async config => {
  // Auth
  const token = await getToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  
  // Logging
  console.log('Request:', config.url);
  
  // Validation
  if (!config.data && config.method === 'post') {
    throw new Error('POST requer dados');
  }
  
  // Metadata
  config.metadata = { startTime: Date.now() };
  
  // Feature flags
  config.headers['X-Features'] = JSON.stringify(getFeatureFlags());
  
  // Timeout customizado
  if (config.url.includes('/upload')) {
    config.timeout = 60000;
  }
  
  return config;
});

// Problemas:
// 1. Difícil manter
// 2. Impossível desabilitar partes
// 3. Difícil testar
// 4. Código acoplado
```

**Com patterns (chaining):**
```javascript
// ✅ Interceptors modulares
const authInterceptor = axios.interceptors.request.use(async config => {
  const token = await getToken();
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

const loggingInterceptor = axios.interceptors.request.use(config => {
  console.log('Request:', config.url);
  return config;
});

const validationInterceptor = axios.interceptors.request.use(config => {
  if (!config.data && config.method === 'post') {
    throw new Error('POST requer dados');
  }
  return config;
});

// Vantagens:
// 1. Cada interceptor tem responsabilidade única
// 2. Fácil habilitar/desabilitar (eject)
// 3. Fácil testar isoladamente
// 4. Código desacoplado
```

### Problema Fundamental que Resolvem

**Patterns resolvem:**

1. **Composição:** Como combinar múltiplos interceptors
2. **Condicionalidade:** Executar apenas quando necessário
3. **Assincronismo:** Lidar com operações assíncronas (token refresh, APIs externas)
4. **Manutenibilidade:** Código organizado e testável
5. **Performance:** Evitar processamento desnecessário

**Exemplo prático - Conditional Pattern:**

```javascript
// Adicionar auth APENAS em endpoints privados
axios.interceptors.request.use(config => {
  // Lista de endpoints públicos
  const publicEndpoints = [
    '/auth/login',
    '/auth/register',
    '/public',
    '/health'
  ];
  
  const isPublic = publicEndpoints.some(endpoint => config.url.startsWith(endpoint));
  
  // Adicionar auth apenas se privado
  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Endpoint privado sem token - redirecionar
      window.location.href = '/login';
      return Promise.reject(new Error('Token ausente'));
    }
  }
  
  return config;
});

// Agora:
await axios.post('/auth/login', credentials); // Sem auth (público)
await axios.get('/api/perfil'); // Com auth (privado)
```

**Exemplo prático - Async Pattern (Token Refresh):**

```javascript
let isRefreshing = false;
let refreshPromise = null;

axios.interceptors.request.use(async config => {
  let token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  
  // Token expirado?
  if (token && Date.now() > parseInt(expiry)) {
    // Se já está renovando, esperar
    if (isRefreshing) {
      await refreshPromise;
      token = localStorage.getItem('access_token');
    } else {
      // Iniciar renovação
      isRefreshing = true;
      
      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post('/auth/refresh', { refreshToken });
          
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken);
          localStorage.setItem('token_expiry', Date.now() + 3600000);
          
          return newToken;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
      
      token = await refreshPromise;
    }
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});
```

### Importância no Ecossistema

**Patterns são fundamentais para:**

- **Aplicações complexas:** Múltiplas camadas de processamento
- **Manutenibilidade:** Código organizado e modular
- **Testabilidade:** Testar interceptors isoladamente
- **Performance:** Evitar processamento desnecessário (conditional)
- **Async operations:** Token refresh, external APIs, validation

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Chaining:** Múltiplos interceptors em sequência (LIFO request, FIFO response)
2. **Conditional:** Executar apenas sob certas condições (endpoint, environment, feature flags)
3. **Async:** Operações assíncronas (token refresh, external APIs)
4. **Composition:** Combinar patterns (chaining + conditional + async)
5. **Eject:** Remover interceptors dinamicamente

### Pilares Fundamentais

- **Single Responsibility:** Cada interceptor faz UMA coisa
- **Ordem de execução:** Request (LIFO), Response (FIFO)
- **Conditional logic:** if statements para executar condicionalmente
- **Async/await:** Operações assíncronas em interceptors
- **Eject:** Habilitar/desabilitar dinamicamente

### Visão Geral das Nuances

- **Request vs Response order:** Request é LIFO, Response é FIFO
- **Async blocking:** Interceptor async bloqueia até completar
- **Error propagation:** Erro em interceptor para cadeia
- **Metadata sharing:** Compartilhar dados entre request/response interceptors
- **Testing:** Mockar interceptors em testes

---

## 🧠 Fundamentos Teóricos

### Chaining Pattern - Ordem de Execução

**Request Interceptors - LIFO (Last In, First Out):**

```javascript
// Ordem de adição
axios.interceptors.request.use(config => {
  console.log('Interceptor 1');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('Interceptor 2');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('Interceptor 3');
  return config;
});

// Ordem de execução: 3 → 2 → 1
await axios.get('/api/dados');
// Output: Interceptor 3, Interceptor 2, Interceptor 1
```

**Response Interceptors - FIFO (First In, First Out):**

```javascript
// Ordem de adição
axios.interceptors.response.use(response => {
  console.log('Interceptor 1');
  return response;
});

axios.interceptors.response.use(response => {
  console.log('Interceptor 2');
  return response;
});

axios.interceptors.response.use(response => {
  console.log('Interceptor 3');
  return response;
});

// Ordem de execução: 1 → 2 → 3
await axios.get('/api/dados');
// Output: Interceptor 1, Interceptor 2, Interceptor 3
```

**Fluxo completo (Request + Response):**

```javascript
// Request interceptors
axios.interceptors.request.use(config => {
  console.log('Request A');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('Request B');
  return config;
});

// Response interceptors
axios.interceptors.response.use(response => {
  console.log('Response 1');
  return response;
});

axios.interceptors.response.use(response => {
  console.log('Response 2');
  return response;
});

await axios.get('/api/dados');
// Output:
// Request B (último adicionado, primeiro executado)
// Request A
// [requisição enviada]
// [resposta recebida]
// Response 1 (primeiro adicionado, primeiro executado)
// Response 2
```

### Chaining Pattern - Múltiplas Responsabilidades

**Pattern: Um interceptor por responsabilidade**

```javascript
// Interceptor 1 - Autenticação
const authInterceptor = axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor 2 - Logging
const loggingInterceptor = axios.interceptors.request.use(config => {
  console.log(`[${new Date().toISOString()}] ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Interceptor 3 - Metadata
const metadataInterceptor = axios.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now(), requestId: generateUUID() };
  config.headers['X-Request-ID'] = config.metadata.requestId;
  return config;
});

// Interceptor 4 - Feature Flags
const featureFlagsInterceptor = axios.interceptors.request.use(config => {
  const flags = {
    newUI: isFeatureEnabled('new-ui'),
    betaAPI: isFeatureEnabled('beta-api')
  };
  config.headers['X-Feature-Flags'] = JSON.stringify(flags);
  return config;
});

// Interceptor 5 - CSRF Token
const csrfInterceptor = axios.interceptors.request.use(config => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
});
```

**Vantagens:**
- ✅ Responsabilidade única (SRP)
- ✅ Fácil manter
- ✅ Fácil testar
- ✅ Fácil habilitar/desabilitar (eject)

### Conditional Pattern - Execução Condicional

**Pattern: Executar apenas sob condições específicas**

**1. Por URL/Endpoint:**

```javascript
axios.interceptors.request.use(config => {
  // Adicionar auth APENAS em endpoints privados
  const publicEndpoints = ['/auth/login', '/auth/register', '/public'];
  const isPublic = publicEndpoints.some(endpoint => config.url.startsWith(endpoint));
  
  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return config;
});
```

**2. Por Método HTTP:**

```javascript
axios.interceptors.request.use(config => {
  // Adicionar CSRF token APENAS em mutating requests
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  
  return config;
});
```

**3. Por Environment:**

```javascript
axios.interceptors.request.use(config => {
  // Logging APENAS em development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] ${config.method.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      params: config.params,
      data: config.data
    });
  }
  
  return config;
});
```

**4. Por Feature Flag:**

```javascript
axios.interceptors.request.use(config => {
  // Usar beta API APENAS se feature habilitada
  if (isFeatureEnabled('beta-api')) {
    config.baseURL = 'https://beta-api.example.com';
  } else {
    config.baseURL = 'https://api.example.com';
  }
  
  return config;
});
```

**5. Por Header Customizado:**

```javascript
axios.interceptors.request.use(config => {
  // Adicionar logging APENAS se header X-Debug presente
  if (config.headers['X-Debug']) {
    console.log('[DEBUG REQUEST]', config);
  }
  
  return config;
});

// Uso
await axios.get('/api/dados', {
  headers: { 'X-Debug': 'true' } // Logging habilitado
});

await axios.get('/api/posts'); // Sem logging
```

**6. Por Custom Config:**

```javascript
axios.interceptors.request.use(config => {
  // Adicionar retry APENAS se config.enableRetry = true
  if (config.enableRetry) {
    config._retryCount = 0;
    config._maxRetries = config.maxRetries || 3;
  }
  
  return config;
});

// Uso
await axios.get('/api/dados', { enableRetry: true, maxRetries: 5 });
```

### Async Pattern - Operações Assíncronas

**Pattern: Interceptor com async/await**

**1. Token Refresh:**

```javascript
axios.interceptors.request.use(async config => {
  let token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  
  // Token expirado?
  if (token && Date.now() > parseInt(expiry)) {
    console.log('Token expirado, renovando...');
    
    // Operação assíncrona
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await axios.post('/auth/refresh', { refreshToken });
    
    token = response.data.access_token;
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', Date.now() + 3600000);
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});
```

**2. External API Call:**

```javascript
axios.interceptors.request.use(async config => {
  // Buscar configuração de API externa
  const settings = await fetch('/api/settings').then(r => r.json());
  
  config.timeout = settings.timeout;
  config.headers['X-API-Version'] = settings.apiVersion;
  
  return config;
});
```

**3. Async Validation:**

```javascript
axios.interceptors.request.use(async config => {
  if (config.method === 'post' && config.url === '/api/posts') {
    // Validar dados com serviço externo
    const isValid = await validateData(config.data);
    
    if (!isValid) {
      return Promise.reject(new Error('Dados inválidos'));
    }
  }
  
  return config;
});
```

**4. Token Refresh com Fila (Evitar múltiplas renovações):**

```javascript
let isRefreshing = false;
let refreshPromise = null;

axios.interceptors.request.use(async config => {
  let token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  
  if (token && Date.now() > parseInt(expiry)) {
    // Se já está renovando, esperar
    if (isRefreshing) {
      console.log('Aguardando renovação em andamento...');
      await refreshPromise;
      token = localStorage.getItem('access_token');
    } else {
      // Iniciar renovação
      isRefreshing = true;
      console.log('Iniciando renovação de token...');
      
      refreshPromise = (async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post('/auth/refresh', { refreshToken });
          
          const newToken = response.data.access_token;
          localStorage.setItem('access_token', newToken);
          localStorage.setItem('token_expiry', Date.now() + 3600000);
          
          return newToken;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
      
      token = await refreshPromise;
    }
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});
```

### Eject Pattern - Habilitar/Desabilitar Dinamicamente

**Pattern: Guardar ID e remover quando necessário**

```javascript
// Guardar IDs dos interceptors
let authInterceptorId = null;
let loggingInterceptorId = null;

// Habilitar auth
function enableAuth() {
  if (authInterceptorId !== null) return; // Já habilitado
  
  authInterceptorId = axios.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
  console.log('Auth interceptor habilitado');
}

// Desabilitar auth
function disableAuth() {
  if (authInterceptorId !== null) {
    axios.interceptors.request.eject(authInterceptorId);
    authInterceptorId = null;
    console.log('Auth interceptor desabilitado');
  }
}

// Habilitar logging
function enableLogging() {
  if (loggingInterceptorId !== null) return;
  
  loggingInterceptorId = axios.interceptors.request.use(config => {
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  });
  
  console.log('Logging interceptor habilitado');
}

// Desabilitar logging
function disableLogging() {
  if (loggingInterceptorId !== null) {
    axios.interceptors.request.eject(loggingInterceptorId);
    loggingInterceptorId = null;
    console.log('Logging interceptor desabilitado');
  }
}

// Uso
enableAuth();
enableLogging();

await axios.get('/api/dados'); // Auth + Logging

disableLogging();

await axios.get('/api/posts'); // Apenas Auth
```

### Composition Pattern - Combinar Patterns

**Pattern: Chaining + Conditional + Async**

```javascript
// Request interceptor - Conditional + Async
axios.interceptors.request.use(async config => {
  // Conditional: Auth apenas em endpoints privados
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublic = publicEndpoints.some(endpoint => config.url.startsWith(endpoint));
  
  if (!isPublic) {
    // Async: Renovar token se expirado
    let token = localStorage.getItem('access_token');
    const expiry = localStorage.getItem('token_expiry');
    
    if (token && Date.now() > parseInt(expiry)) {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      token = response.data.access_token;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_expiry', Date.now() + 3600000);
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return config;
});

// Mais interceptors em chain
axios.interceptors.request.use(config => {
  // Logging (condicional por environment)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`);
  }
  return config;
});

axios.interceptors.request.use(config => {
  // Metadata
  config.metadata = { startTime: Date.now() };
  return config;
});
```

---

## 🔍 Análise Conceitual Profunda

### Caso 1: Pipeline Completo (Request + Response)

```javascript
// =============== REQUEST INTERCEPTORS ===============

// 1. Feature Flags
axios.interceptors.request.use(config => {
  const flags = {
    newUI: isFeatureEnabled('new-ui'),
    betaAPI: isFeatureEnabled('beta-api')
  };
  config.headers['X-Feature-Flags'] = JSON.stringify(flags);
  return config;
});

// 2. Auth (conditional + async)
axios.interceptors.request.use(async config => {
  const publicEndpoints = ['/auth/login', '/auth/register'];
  const isPublic = publicEndpoints.some(ep => config.url.startsWith(ep));
  
  if (!isPublic) {
    let token = localStorage.getItem('access_token');
    const expiry = localStorage.getItem('token_expiry');
    
    if (token && Date.now() > parseInt(expiry)) {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/auth/refresh', { refreshToken });
      token = response.data.access_token;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_expiry', Date.now() + 3600000);
    }
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return config;
});

// 3. Metadata
axios.interceptors.request.use(config => {
  config.metadata = { 
    startTime: Date.now(),
    requestId: generateUUID()
  };
  config.headers['X-Request-ID'] = config.metadata.requestId;
  return config;
});

// 4. Logging (conditional)
axios.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`, {
      requestId: config.metadata.requestId,
      headers: config.headers
    });
  }
  return config;
});

// =============== RESPONSE INTERCEPTORS ===============

// 1. Duration Logging
axios.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[RESPONSE] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      requestId: response.config.metadata.requestId,
      status: response.status,
      duration: `${duration}ms`
    });
  }
  
  return response;
});

// 2. Data Transformation
axios.interceptors.response.use(response => {
  if (response.data.success && response.data.payload) {
    response.data = response.data.payload;
  }
  return response;
});

// 3. Error Handling
axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    
    if (status === 401) {
      toast.error('Sessão expirada');
      redirectToLogin();
    } else if (status === 500) {
      toast.error('Erro no servidor');
    }
    
    return Promise.reject(error);
  }
);
```

### Caso 2: Interceptor Manager (Habilitar/Desabilitar)

```javascript
class InterceptorManager {
  constructor() {
    this.interceptors = {
      auth: null,
      logging: null,
      retry: null,
      caching: null
    };
  }
  
  enableAuth() {
    if (this.interceptors.auth !== null) return;
    
    this.interceptors.auth = axios.interceptors.request.use(async config => {
      const token = await getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
    
    console.log('[Interceptor Manager] Auth habilitado');
  }
  
  disableAuth() {
    if (this.interceptors.auth !== null) {
      axios.interceptors.request.eject(this.interceptors.auth);
      this.interceptors.auth = null;
      console.log('[Interceptor Manager] Auth desabilitado');
    }
  }
  
  enableLogging() {
    if (this.interceptors.logging !== null) return;
    
    this.interceptors.logging = axios.interceptors.request.use(config => {
      console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`);
      return config;
    });
    
    console.log('[Interceptor Manager] Logging habilitado');
  }
  
  disableLogging() {
    if (this.interceptors.logging !== null) {
      axios.interceptors.request.eject(this.interceptors.logging);
      this.interceptors.logging = null;
      console.log('[Interceptor Manager] Logging desabilitado');
    }
  }
  
  enableRetry(maxRetries = 3) {
    if (this.interceptors.retry !== null) return;
    
    this.interceptors.retry = axios.interceptors.response.use(
      response => response,
      async error => {
        const config = error.config;
        
        if (!error.response && (!config._retryCount || config._retryCount < maxRetries)) {
          config._retryCount = (config._retryCount || 0) + 1;
          
          console.log(`[Retry] Tentativa ${config._retryCount} de ${maxRetries}`);
          
          await new Promise(resolve => setTimeout(resolve, 1000 * config._retryCount));
          
          return axios(config);
        }
        
        return Promise.reject(error);
      }
    );
    
    console.log('[Interceptor Manager] Retry habilitado');
  }
  
  disableRetry() {
    if (this.interceptors.retry !== null) {
      axios.interceptors.response.eject(this.interceptors.retry);
      this.interceptors.retry = null;
      console.log('[Interceptor Manager] Retry desabilitado');
    }
  }
  
  disableAll() {
    this.disableAuth();
    this.disableLogging();
    this.disableRetry();
    console.log('[Interceptor Manager] Todos os interceptors desabilitados');
  }
}

// Uso
const manager = new InterceptorManager();

manager.enableAuth();
manager.enableLogging();
manager.enableRetry(5);

await axios.get('/api/dados'); // Auth + Logging + Retry

manager.disableLogging();

await axios.get('/api/posts'); // Auth + Retry

manager.disableAll();

await axios.get('/api/usuarios'); // Sem interceptors
```

### Caso 3: Conditional por Config Customizado

```javascript
// Interceptor que respeita configs customizados
axios.interceptors.request.use(config => {
  // skipAuth: true - pular autenticação
  if (!config.skipAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  // skipLogging: true - pular logging
  if (!config.skipLogging) {
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`);
  }
  
  // customTimeout: number - timeout customizado
  if (config.customTimeout) {
    config.timeout = config.customTimeout;
  }
  
  return config;
});

// Uso
await axios.get('/api/dados'); // Auth + Logging + Timeout padrão

await axios.get('/api/public', { 
  skipAuth: true // Sem auth
});

await axios.get('/api/sensitive', { 
  skipLogging: true // Sem logging
});

await axios.post('/api/upload', formData, { 
  customTimeout: 60000 // 60s timeout
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Pattern

**Chaining:**
- Múltiplas responsabilidades (auth, logging, metadata)
- Organização modular (SRP)
- Fácil manutenção e teste

**Conditional:**
- Executar apenas em certos endpoints
- Executar apenas em certos environments
- Feature flags

**Async:**
- Token refresh
- External API calls
- Async validation

**Composition:**
- Aplicações complexas (combinar patterns)

---

## ⚠️ Limitações e Considerações Teóricas

### Ordem de Execução

```javascript
// Request: LIFO (último adicionado, primeiro executado)
// Response: FIFO (primeiro adicionado, primeiro executado)

// Cuidado com dependências entre interceptors!
```

### Async Blocking

```javascript
// Interceptor async BLOQUEIA até completar
axios.interceptors.request.use(async config => {
  await sleep(5000); // Todas as requisições esperarão 5s!
  return config;
});
```

### Evitar Loops Infinitos

```javascript
// ❌ RISCO - requisição dentro de interceptor
axios.interceptors.request.use(async config => {
  // Se /auth/refresh também passar pelo interceptor, loop infinito!
  const response = await axios.post('/auth/refresh', {...});
  return config;
});

// ✅ MELHOR - marcar para pular interceptor
axios.interceptors.request.use(async config => {
  if (!config._skipRefresh) {
    const response = await axios.post('/auth/refresh', {...}, { _skipRefresh: true });
  }
  return config;
});
```

---

## 🔗 Interconexões Conceituais

### Request e Response Interceptors

```javascript
// Request - adicionar metadata
axios.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

// Response - usar metadata
axios.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  console.log(`Duração: ${duration}ms`);
  return response;
});
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Error Recovery:** Retry avançado, fallback strategies
2. **Testing:** Mockar interceptors em testes
3. **Performance:** Otimizar interceptors pesados

---

## 📚 Conclusão

**Interceptor Patterns** organizam interceptors de forma **modular, manutenível e eficiente**.

**Dominar patterns significa:**
- **Chaining:** Combinar múltiplos interceptors
- **Conditional:** Executar apenas quando necessário
- **Async:** Operações assíncronas (token refresh)
- **Composition:** Combinar patterns

**Use patterns para:**
- ✅ Organizar código (SRP)
- ✅ Habilitar/desabilitar dinamicamente (eject)
- ✅ Executar condicionalmente (performance)
- ✅ Operações assíncronas (token refresh)

Com **Interceptor Patterns**, você constrói pipelines de processamento robustos e manuteníveis.
