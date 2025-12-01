# Request Interceptors (auth, logging, modification)

## 🎯 Introdução e Definição

### Definição Conceitual

**Request Interceptors** (interceptadores de requisição) são **funções executadas automaticamente ANTES** de cada requisição HTTP ser enviada ao servidor. Conceitualmente, são **middlewares de saída** - camadas de processamento que **interceptam, inspecionam e modificam** configurações de requisição antes que elas deixem a aplicação.

Pense em interceptors como **guardas de portão** - toda requisição passa por eles antes de sair, permitindo adicionar headers, validar dados, fazer logging, adicionar autenticação, ou até cancelar requisições.

**Estrutura fundamental:**
```javascript
axios.interceptors.request.use(
  config => {
    // ✅ Sucesso - modificar e retornar config
    console.log('Enviando requisição:', config.url);
    config.headers['Authorization'] = 'Bearer token';
    return config;
  },
  error => {
    // ❌ Erro - requisição falhou ANTES de enviar
    console.error('Erro antes de enviar:', error);
    return Promise.reject(error);
  }
);
```

**Fluxo de execução:**
```
1. axios.get('/api/dados') chamado
2. Request interceptor executado (adiciona headers, valida, etc.)
3. Requisição enviada ao servidor
4. Servidor responde
5. Response interceptor executado
6. Promise resolvida com response
```

**Três casos de uso principais:**

1. **Autenticação:** Adicionar tokens automaticamente em todas as requisições
2. **Logging:** Registrar todas as requisições para debugging/analytics
3. **Modificação:** Transformar URLs, headers, dados antes de enviar

**Exemplo prático - Autenticação:**
```javascript
// Interceptor adiciona token automaticamente
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Agora TODAS as requisições têm token automaticamente
await axios.get('/api/perfil'); // Authorization: Bearer xxx
await axios.post('/api/posts', data); // Authorization: Bearer xxx
// Sem precisar adicionar manualmente!
```

### Contexto Histórico e Motivação

Antes de interceptors, adicionar lógica comum a todas as requisições era repetitivo:

**Sem interceptors (código repetitivo):**

```javascript
// ❌ Adicionar token manualmente em CADA requisição
async function getUsuarios() {
  const token = localStorage.getItem('token');
  return axios.get('/api/usuarios', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

async function getPosts() {
  const token = localStorage.getItem('token');
  return axios.get('/api/posts', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

async function createPost(data) {
  const token = localStorage.getItem('token');
  return axios.post('/api/posts', data, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Repetição em CADA função!
```

**Problemas:**
1. **DRY violation:** Código duplicado em todas as funções
2. **Manutenção:** Mudar lógica de auth = editar todas as funções
3. **Esquecimento:** Fácil esquecer de adicionar token em nova requisição
4. **Logging:** Impossível centralizar logging de todas as requisições

**Com interceptors:**

```javascript
// ✅ Configurar UMA VEZ
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Agora todas as requisições são simples
async function getUsuarios() {
  return axios.get('/api/usuarios'); // Token automático!
}

async function getPosts() {
  return axios.get('/api/posts'); // Token automático!
}

async function createPost(data) {
  return axios.post('/api/posts', data); // Token automático!
}
```

**Vantagens:**
- **DRY:** Lógica definida uma vez
- **Centralização:** Todas as requisições passam pelo interceptor
- **Manutenibilidade:** Mudar auth = editar apenas o interceptor
- **Garantia:** Impossível esquecer de adicionar token

**Evolução histórica:**

- **XMLHttpRequest:** Sem conceito de interceptors, tudo manual
- **Fetch API:** Sem interceptors nativos (precisa wrapper manual)
- **Axios:** Interceptors como feature nativa e central
- **Modern:** Padrão adotado por outras libs (Angular HttpClient, etc.)

### Problema Fundamental que Resolve

**Request Interceptors resolvem crosscutting concerns - lógica que afeta TODAS as requisições:**

**1. Autenticação Automática:**

```javascript
// Setup interceptor
axios.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// TODAS as requisições agora têm auth automaticamente
await axios.get('/api/perfil');
await axios.post('/api/posts', data);
await axios.put('/api/users/1', userData);
// Sem adicionar headers manualmente!
```

**2. Logging Centralizado:**

```javascript
// Log TODAS as requisições
axios.interceptors.request.use(config => {
  console.log(`[${new Date().toISOString()}] ${config.method.toUpperCase()} ${config.url}`);
  
  // Analytics
  analytics.track('api_request', {
    method: config.method,
    url: config.url,
    timestamp: Date.now()
  });
  
  return config;
});

// Agora todas as requisições são logadas automaticamente
await axios.get('/api/usuarios'); // Log: [2025-11-17T...] GET /api/usuarios
```

**3. Base URL Dinâmica:**

```javascript
// Modificar baseURL baseado em ambiente
axios.interceptors.request.use(config => {
  const environment = getEnvironment(); // 'dev', 'staging', 'prod'
  
  const baseUrls = {
    dev: 'http://localhost:3000',
    staging: 'https://staging-api.example.com',
    prod: 'https://api.example.com'
  };
  
  config.baseURL = baseUrls[environment];
  return config;
});
```

**4. Request Validation:**

```javascript
// Validar dados antes de enviar
axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    if (!config.data) {
      return Promise.reject(new Error('Dados são obrigatórios para POST/PUT'));
    }
  }
  return config;
});
```

**5. Headers Customizados Globais:**

```javascript
// Adicionar headers em todas as requisições
axios.interceptors.request.use(config => {
  config.headers['X-Client-Version'] = '1.2.3';
  config.headers['X-Request-ID'] = generateUUID();
  config.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return config;
});
```

### Importância no Ecossistema

**Request Interceptors são fundamentais para:**

- **Autenticação:** JWT tokens, API keys, OAuth
- **Logging/Analytics:** Rastrear todas as requisições
- **Error prevention:** Validar dados antes de enviar
- **Development:** Debug logging, request mocking
- **Security:** CSRF tokens, request signing
- **Multi-tenancy:** Adicionar tenant ID automaticamente
- **A/B Testing:** Feature flags via headers

**Padrão de produção - Auth + Logging + Tracing:**

```javascript
// Request interceptor completo
axios.interceptors.request.use(
  config => {
    // 1. Autenticação
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 2. Request ID (tracing)
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Request-ID'] = requestId;
    config.metadata = { requestId, startTime: Date.now() };
    
    // 3. Logging
    console.log(`[REQUEST] ${config.method.toUpperCase()} ${config.url}`, {
      requestId,
      headers: config.headers,
      params: config.params
    });
    
    // 4. Analytics
    analytics.track('api_request_start', {
      method: config.method,
      url: config.url,
      requestId
    });
    
    return config;
  },
  error => {
    console.error('[REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Execução automática:** Rodado ANTES de cada requisição
2. **Modificação de config:** Interceptor recebe e retorna config object
3. **Cadeia de interceptors:** Múltiplos interceptors executados em ordem
4. **Success/Error handlers:** Dois callbacks (sucesso e erro)
5. **Promise-based:** Retorna config ou Promise.reject(error)

### Pilares Fundamentais

- **Assinatura:** `axios.interceptors.request.use(onFulfilled, onRejected)`
- **onFulfilled:** `config => { ... return config; }`
- **onRejected:** `error => { ... return Promise.reject(error); }`
- **Retorno obrigatório:** Sempre retornar config (modificado ou não)
- **Escopo:** Global (axios) ou instance (api instance)

### Visão Geral das Nuances

- **Ordem de execução:** Último adicionado = primeiro executado (LIFO)
- **Mutabilidade:** config é mutável (pode modificar diretamente)
- **Async support:** Interceptor pode ser async
- **Eject:** Interceptors podem ser removidos com eject()
- **Per-instance:** Cada axios instance tem interceptors próprios

---

## 🧠 Fundamentos Teóricos

### Assinatura

```javascript
const interceptorId = axios.interceptors.request.use(
  onFulfilled,  // Função de sucesso
  onRejected    // Função de erro (opcional)
);
```

**Parâmetros:**

- `onFulfilled(config)`: Executado antes da requisição
  - Recebe: config object (url, method, headers, data, etc.)
  - Retorna: config modificado ou Promise
  
- `onRejected(error)`: Executado se houver erro ao configurar requisição
  - Recebe: error object
  - Retorna: Promise.reject(error)

**Retorno:** ID do interceptor (para eject posterior)

### onFulfilled - Success Handler

```javascript
axios.interceptors.request.use(config => {
  // config object disponível
  console.log(config.url);
  console.log(config.method);
  console.log(config.headers);
  console.log(config.data);
  console.log(config.params);
  
  // Modificar config
  config.headers['X-Custom'] = 'value';
  
  // SEMPRE retornar config
  return config;
});
```

**REGRA CRÍTICA:** Sempre retornar `config` (modificado ou não).

```javascript
// ❌ ERRO - não retornar config
axios.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer token';
  // Esqueceu de retornar! Requisição falhará
});

// ✅ CORRETO
axios.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer token';
  return config; // ← Essencial!
});
```

### onRejected - Error Handler

```javascript
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    // Erro ao configurar requisição (raro)
    console.error('Erro antes de enviar:', error);
    
    // SEMPRE retornar Promise.reject
    return Promise.reject(error);
  }
);
```

**Quando onRejected é chamado:**
- Interceptor anterior lançou erro
- Erro ao configurar requisição (muito raro)

### Modificando Config

**Headers:**
```javascript
axios.interceptors.request.use(config => {
  // Adicionar header
  config.headers['Authorization'] = 'Bearer token';
  
  // Modificar header existente
  config.headers['Content-Type'] = 'application/json';
  
  // Remover header
  delete config.headers['X-Unwanted'];
  
  return config;
});
```

**URL:**
```javascript
axios.interceptors.request.use(config => {
  // Modificar URL
  config.url = config.url.replace('/v1/', '/v2/');
  
  // Adicionar query string
  config.url += '?timestamp=' + Date.now();
  
  return config;
});
```

**Data:**
```javascript
axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    // Adicionar campos
    config.data = {
      ...config.data,
      timestamp: Date.now(),
      userId: getCurrentUserId()
    };
  }
  return config;
});
```

**Params:**
```javascript
axios.interceptors.request.use(config => {
  // Adicionar query params
  config.params = {
    ...config.params,
    api_key: 'YOUR_API_KEY'
  };
  return config;
});
```

### Async Interceptors

**Interceptor pode ser async:**

```javascript
axios.interceptors.request.use(async config => {
  // Operação assíncrona
  const token = await getTokenFromSecureStorage();
  config.headers['Authorization'] = `Bearer ${token}`;
  
  return config;
});
```

**Exemplo - Renovar token expirado:**

```javascript
axios.interceptors.request.use(async config => {
  let token = localStorage.getItem('access_token');
  const tokenExpiry = localStorage.getItem('token_expiry');
  
  // Se token expirou, renovar
  if (Date.now() > parseInt(tokenExpiry)) {
    console.log('Token expirado, renovando...');
    const refreshToken = localStorage.getItem('refresh_token');
    
    const response = await axios.post('/auth/refresh', { refreshToken });
    token = response.data.access_token;
    
    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiry', Date.now() + 3600000);
  }
  
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

### Múltiplos Interceptors

**Adicionar múltiplos interceptors:**

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

// Interceptor 3 - Request ID
axios.interceptors.request.use(config => {
  config.headers['X-Request-ID'] = generateUUID();
  return config;
});
```

**Ordem de execução:** LIFO (Last In, First Out)

```javascript
// Ordem de adição
axios.interceptors.request.use(config => {
  console.log('1');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('2');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('3');
  return config;
});

// Ordem de execução: 3 → 2 → 1
await axios.get('/api/dados');
// Output: 3, 2, 1
```

### Eject (Remover Interceptor)

```javascript
// Adicionar interceptor e guardar ID
const interceptorId = axios.interceptors.request.use(config => {
  config.headers['X-Custom'] = 'value';
  return config;
});

// Remover interceptor
axios.interceptors.request.eject(interceptorId);

// Agora requisições não passam mais pelo interceptor
```

**Uso - Habilitar/desabilitar dinamicamente:**

```javascript
let loggingInterceptorId = null;

function enableLogging() {
  loggingInterceptorId = axios.interceptors.request.use(config => {
    console.log('Request:', config.url);
    return config;
  });
}

function disableLogging() {
  if (loggingInterceptorId !== null) {
    axios.interceptors.request.eject(loggingInterceptorId);
    loggingInterceptorId = null;
  }
}

// Uso
enableLogging();
await axios.get('/api/dados'); // Log
disableLogging();
await axios.get('/api/posts'); // Sem log
```

### Instance Interceptors

**Cada instance tem interceptors próprios:**

```javascript
const api1 = axios.create({ baseURL: 'https://api1.com' });
const api2 = axios.create({ baseURL: 'https://api2.com' });

// Interceptor apenas em api1
api1.interceptors.request.use(config => {
  config.headers['X-API-1'] = 'true';
  return config;
});

// Interceptor apenas em api2
api2.interceptors.request.use(config => {
  config.headers['X-API-2'] = 'true';
  return config;
});

// api1 tem X-API-1, api2 tem X-API-2
await api1.get('/dados'); // X-API-1: true
await api2.get('/dados'); // X-API-2: true
```

---

## 🔍 Análise Conceitual Profunda

### Padrão 1: Autenticação JWT

```javascript
// Request interceptor para auth
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Agora todas as requisições têm token
await axios.get('/api/perfil'); // Authorization: Bearer xxx
await axios.get('/api/posts'); // Authorization: Bearer xxx
```

**Variação - Token expirado:**

```javascript
axios.interceptors.request.use(async config => {
  let token = localStorage.getItem('access_token');
  const expiry = localStorage.getItem('token_expiry');
  
  // Token expirou?
  if (token && Date.now() > parseInt(expiry)) {
    try {
      // Renovar token
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/auth/refresh', { refreshToken });
      
      token = response.data.access_token;
      localStorage.setItem('access_token', token);
      localStorage.setItem('token_expiry', Date.now() + response.data.expires_in * 1000);
    } catch (error) {
      // Refresh falhou - redirecionar para login
      localStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});
```

### Padrão 2: Logging e Analytics

```javascript
axios.interceptors.request.use(config => {
  const timestamp = new Date().toISOString();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Logging
  console.log(`[${timestamp}] ${config.method.toUpperCase()} ${config.url}`, {
    requestId,
    headers: config.headers,
    params: config.params,
    data: config.data
  });
  
  // Analytics
  analytics.track('api_request', {
    method: config.method,
    url: config.url,
    requestId,
    timestamp
  });
  
  // Adicionar request ID aos headers para tracing
  config.headers['X-Request-ID'] = requestId;
  
  // Metadata para response interceptor usar
  config.metadata = { requestId, startTime: Date.now() };
  
  return config;
});
```

### Padrão 3: Base URL Dinâmica

```javascript
axios.interceptors.request.use(config => {
  const environment = process.env.NODE_ENV;
  
  const baseUrls = {
    development: 'http://localhost:3000',
    test: 'http://localhost:4000',
    staging: 'https://staging-api.example.com',
    production: 'https://api.example.com'
  };
  
  config.baseURL = baseUrls[environment];
  
  return config;
});
```

### Padrão 4: CSRF Token

```javascript
axios.interceptors.request.use(config => {
  // Adicionar CSRF token em mutating requests
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  
  return config;
});
```

### Padrão 5: Multi-Tenancy

```javascript
axios.interceptors.request.use(config => {
  // Adicionar tenant ID automaticamente
  const tenantId = getCurrentTenantId();
  
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
    
    // Ou adicionar na URL
    config.url = `/tenants/${tenantId}${config.url}`;
  }
  
  return config;
});
```

### Padrão 6: Request Validation

```javascript
axios.interceptors.request.use(config => {
  // Validar POST/PUT têm dados
  if (['post', 'put', 'patch'].includes(config.method)) {
    if (!config.data || Object.keys(config.data).length === 0) {
      return Promise.reject(new Error(`${config.method.toUpperCase()} requer dados no body`));
    }
  }
  
  // Validar headers obrigatórios
  const requiredHeaders = ['Content-Type'];
  for (const header of requiredHeaders) {
    if (!config.headers[header]) {
      console.warn(`Header ${header} ausente, adicionando default`);
      config.headers[header] = 'application/json';
    }
  }
  
  return config;
});
```

### Padrão 7: Feature Flags via Headers

```javascript
axios.interceptors.request.use(config => {
  const featureFlags = {
    newUI: isFeatureEnabled('new-ui'),
    betaAPI: isFeatureEnabled('beta-api'),
    experimentalSearch: isFeatureEnabled('experimental-search')
  };
  
  config.headers['X-Feature-Flags'] = JSON.stringify(featureFlags);
  
  return config;
});
```

### Padrão 8: Development Mock Detection

```javascript
axios.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') {
    // Redirecionar para mock server
    if (config.url.startsWith('/api/')) {
      const useMock = localStorage.getItem('use_mock_api') === 'true';
      
      if (useMock) {
        config.baseURL = 'http://localhost:3001/mock';
        console.log('[MOCK]', config.method, config.url);
      }
    }
  }
  
  return config;
});
```

### Padrão 9: Request Timeout por Endpoint

```javascript
axios.interceptors.request.use(config => {
  // Timeouts específicos por tipo de endpoint
  const timeouts = {
    '/api/upload': 60000,    // 60s para uploads
    '/api/reports': 30000,   // 30s para relatórios
    '/api/search': 5000,     // 5s para buscas
    default: 10000           // 10s padrão
  };
  
  // Encontrar timeout apropriado
  const matchedEndpoint = Object.keys(timeouts).find(endpoint => 
    config.url.startsWith(endpoint)
  );
  
  config.timeout = timeouts[matchedEndpoint] || timeouts.default;
  
  return config;
});
```

### Padrão 10: Conditional Interceptor

```javascript
axios.interceptors.request.use(config => {
  // Adicionar auth apenas em endpoints privados
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

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Request Interceptors

**Use quando:**
- Autenticação em todas as requisições
- Logging/analytics de requisições
- Headers globais (API key, client version)
- Request validation
- Base URL dinâmica
- CSRF tokens
- Multi-tenancy (tenant ID)
- Development mocking

### Quando Não Usar

**Evite se:**
- Lógica específica de uma requisição (use config direto)
- Performance crítica (interceptors adicionam overhead mínimo)
- Lógica complexa demais (dificulta debugging)

---

## ⚠️ Limitações e Considerações Teóricas

### Sempre Retornar Config

```javascript
// ❌ ERRO - não retornar
axios.interceptors.request.use(config => {
  config.headers['X-Custom'] = 'value';
  // Esqueceu return! Requisição falhará
});

// ✅ CORRETO
axios.interceptors.request.use(config => {
  config.headers['X-Custom'] = 'value';
  return config;
});
```

### Evitar Loops Infinitos

```javascript
// ❌ RISCO - interceptor faz requisição
axios.interceptors.request.use(async config => {
  // Requisição dentro de interceptor pode causar loop!
  const settings = await axios.get('/api/settings');
  config.customSetting = settings.data;
  return config;
});

// ✅ MELHOR - cache ou requisição fora de interceptor
let cachedSettings = null;

axios.interceptors.request.use(async config => {
  if (!cachedSettings) {
    // Fazer requisição apenas uma vez
    const response = await axios.get('/api/settings');
    cachedSettings = response.data;
  }
  config.customSetting = cachedSettings;
  return config;
});
```

### Ordem de Execução (LIFO)

```javascript
// Último adicionado = primeiro executado
axios.interceptors.request.use(config => {
  console.log('A');
  return config;
});

axios.interceptors.request.use(config => {
  console.log('B');
  return config;
});

await axios.get('/test');
// Output: B, A (não A, B!)
```

---

## 🔗 Interconexões Conceituais

### Request Interceptors e Response Interceptors

**Metadata compartilhada:**

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

### Request Interceptors e Cancelamento

**Cancelar requisição no interceptor:**

```javascript
axios.interceptors.request.use(config => {
  if (!navigator.onLine) {
    // Offline - cancelar requisição
    return Promise.reject(new Error('Você está offline'));
  }
  return config;
});
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Response Interceptors:** Processar respostas globalmente
2. **Error Recovery:** Retry automático em interceptors
3. **Chaining:** Compor múltiplos interceptors
4. **Async interceptors:** Operações assíncronas complexas

### Conceitos Avançados

- **Conditional interceptors:** Habilitar/desabilitar dinamicamente
- **Interceptor composition:** Combinar interceptors
- **Testing interceptors:** Mockar e testar
- **Performance:** Otimizar interceptors pesados

---

## 📚 Conclusão

**Request Interceptors** são ferramenta **essencial para crosscutting concerns** em aplicações Axios.

**Dominar request interceptors significa:**
- **Adicionar lógica global** (auth, logging, headers)
- **Modificar config** antes de enviar
- **Validar requisições** antes de sair
- **Centralizar preocupações** (DRY, manutenibilidade)
- **Evitar armadilhas** (sempre retornar config, evitar loops)

**Use request interceptors para:**
- ✅ Autenticação (JWT tokens)
- ✅ Logging e analytics
- ✅ Headers globais (API key, request ID)
- ✅ CSRF tokens
- ✅ Multi-tenancy (tenant ID)
- ✅ Request validation

**Evite se:**
- ❌ Lógica específica de uma requisição
- ❌ Risco de loop infinito (requisição dentro de interceptor)
- ❌ Lógica muito complexa (dificulta debugging)

Com **Request Interceptors**, você transforma código repetitivo em lógica centralizada, garantindo que todas as requisições passem por processamento consistente antes de sair da aplicação.
