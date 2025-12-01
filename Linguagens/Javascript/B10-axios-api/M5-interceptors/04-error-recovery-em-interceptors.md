# Error Recovery em Interceptors

## 🎯 Introdução e Definição

### Definição Conceitual

**Error Recovery** (recuperação de erros) em interceptors é o processo de **interceptar erros HTTP ou de rede e tentar recuperar-se automaticamente**, transformando falhas em sucessos quando possível. Conceitualmente, são **estratégias de resiliência** que permitem à aplicação continuar funcionando mesmo quando APIs falham, redes são instáveis, ou tokens expiram.

Pense em error recovery como **airbags de um carro** - quando há uma falha (colisão), eles **minimizam o dano** automaticamente, sem intervenção do motorista. Em aplicações web, error recovery **minimiza impacto de falhas** automaticamente, sem intervenção do usuário.

**Três estratégias principais:**

1. **Automatic Retry:** Retentar requisição automaticamente em caso de erro temporário
2. **Token Refresh:** Renovar token expirado e retentar requisição original
3. **Fallback Data:** Retornar dados em cache/mock em caso de erro

**Automatic Retry - Exemplo:**
```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Se erro de rede E não excedeu tentativas
    if (!error.response && (!config._retryCount || config._retryCount < 3)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      console.log(`Tentativa ${config._retryCount} de 3...`);
      
      // Esperar antes de retentar (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * config._retryCount));
      
      // Retentar requisição
      return axios(config);
    }
    
    // Excedeu tentativas ou erro não recuperável
    return Promise.reject(error);
  }
);

// Agora requisições retentam automaticamente em erro de rede
await axios.get('/api/dados'); // Se falhar, tenta 3x automaticamente
```

**Token Refresh - Exemplo:**
```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Se 401 (não autenticado) E não é retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Renovar token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        const newToken = response.data.access_token;
        localStorage.setItem('access_token', newToken);
        
        // Retentar requisição original com novo token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh falhou - redirecionar para login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Agora requisições renovam token automaticamente se expirado
await axios.get('/api/perfil'); // Se 401, renova token e retenta
```

**Fallback Data - Exemplo:**
```javascript
const cache = new Map();

axios.interceptors.response.use(
  response => {
    // Cachear respostas GET
    if (response.config.method === 'get') {
      const cacheKey = response.config.url;
      cache.set(cacheKey, response.data);
    }
    return response;
  },
  error => {
    // Se erro de rede, tentar cache
    if (!error.response && error.config.method === 'get') {
      const cacheKey = error.config.url;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log('Usando dados em cache devido a erro de rede');
        
        return {
          data: cached,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config: error.config,
          fromCache: true
        };
      }
    }
    
    return Promise.reject(error);
  }
);

// Agora requisições retornam cache se erro de rede
await axios.get('/api/dados'); // Se offline, retorna cache
```

### Contexto Histórico e Motivação

**Problema:** Aplicações web sofrem com **falhas temporárias** - redes instáveis, APIs sobrecarregadas, tokens expirados. Sem error recovery, essas falhas resultam em **experiência ruim** para o usuário.

**Antes de error recovery:**
```javascript
// ❌ Usuário vê erro a cada falha temporária
try {
  const response = await axios.get('/api/dados');
  console.log(response.data);
} catch (error) {
  // Erro! Usuário vê mensagem de erro
  toast.error('Erro ao carregar dados');
}

// Problemas:
// 1. Erro temporário de rede = erro para usuário
// 2. Token expira = usuário precisa fazer login novamente
// 3. API sobrecarregada (503) = erro para usuário
```

**Com error recovery:**
```javascript
// ✅ Interceptor tenta recuperar automaticamente
axios.interceptors.response.use(
  response => response,
  async error => {
    // Retry em erro de rede
    if (!error.response && !error.config._retry) {
      error.config._retry = true;
      return axios(error.config);
    }
    
    // Token refresh em 401
    if (error.response?.status === 401 && !error.config._tokenRefreshed) {
      error.config._tokenRefreshed = true;
      const newToken = await refreshToken();
      error.config.headers['Authorization'] = `Bearer ${newToken}`;
      return axios(error.config);
    }
    
    // Retry em 503 (servidor sobrecarregado)
    if (error.response?.status === 503 && !error.config._retried503) {
      error.config._retried503 = true;
      await sleep(2000);
      return axios(error.config);
    }
    
    return Promise.reject(error);
  }
);

// Agora falhas temporárias são recuperadas automaticamente
const response = await axios.get('/api/dados');
console.log(response.data); // Sucesso mesmo com falhas temporárias!
```

**Vantagens:**
- ✅ Melhor experiência do usuário (menos erros visíveis)
- ✅ Resiliência a falhas temporárias
- ✅ Tokens renovados automaticamente
- ✅ Requisições retentadas automaticamente

### Problema Fundamental que Resolve

**Error Recovery resolve:**

1. **Falhas temporárias de rede:** WiFi instável, conexão móvel fraca
2. **Tokens expirados:** Renovar automaticamente sem logout
3. **APIs sobrecarregadas:** Retry com backoff exponencial
4. **Rate limiting:** Respeitar headers de retry-after
5. **Graceful degradation:** Retornar dados em cache quando offline

**Exemplo prático - Retry com Exponential Backoff:**

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Erros que podem ser retentados
    const retryableErrors = [
      !error.response, // Erro de rede
      error.response?.status === 408, // Request Timeout
      error.response?.status === 429, // Too Many Requests
      error.response?.status === 500, // Internal Server Error
      error.response?.status === 502, // Bad Gateway
      error.response?.status === 503, // Service Unavailable
      error.response?.status === 504  // Gateway Timeout
    ];
    
    const shouldRetry = retryableErrors.some(condition => condition);
    
    if (shouldRetry && (!config._retryCount || config._retryCount < 3)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      
      console.log(`Tentativa ${config._retryCount} de 3 em ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);
```

**Exemplo prático - Token Refresh com Fila:**

```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Já está renovando - adicionar à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      return new Promise((resolve, reject) => {
        axios.post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            const newToken = data.access_token;
            localStorage.setItem('access_token', newToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            resolve(axios(originalRequest));
          })
          .catch(err => {
            processQueue(err, null);
            localStorage.clear();
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    
    return Promise.reject(error);
  }
);
```

### Importância no Ecossistema

**Error Recovery é fundamental para:**

- **Aplicações mobile:** Conexões instáveis (WiFi ↔ 4G)
- **PWAs offline-first:** Continuar funcionando offline
- **APIs instáveis:** Lidar com timeouts, 503, 502
- **Autenticação:** Renovar tokens automaticamente
- **Rate limiting:** Respeitar limites de API
- **Experiência do usuário:** Menos erros visíveis

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Automatic Retry:** Retentar requisição em erro temporário
2. **Exponential Backoff:** Aumentar delay entre tentativas
3. **Token Refresh:** Renovar token expirado e retentar
4. **Fallback Data:** Retornar cache/mock em caso de erro
5. **Error Categorization:** Distinguir erros recuperáveis vs não recuperáveis

### Pilares Fundamentais

- **Response interceptor:** Error recovery em `onRejected`
- **Retry flag:** `config._retry` para evitar loops infinitos
- **Retry count:** `config._retryCount` para limitar tentativas
- **Promise:** Retornar `axios(config)` para retentar ou `Promise.reject(error)`
- **Async/await:** Operações assíncronas (token refresh, delay)

### Visão Geral das Nuances

- **Idempotência:** Apenas retentar requisições idempotentes (GET, HEAD, OPTIONS, PUT, DELETE)
- **Rate limiting:** Respeitar headers `Retry-After`
- **Loop prevention:** Marcar requisições retentadas
- **Queue management:** Fila de requisições durante token refresh
- **Graceful degradation:** Fallback para cache quando API falha

---

## 🧠 Fundamentos Teóricos

### Automatic Retry - Estrutura Básica

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Verificar se deve retentar
    const shouldRetry = !error.response; // Erro de rede
    
    // Verificar se não excedeu tentativas
    const maxRetries = 3;
    const retryCount = config._retryCount || 0;
    
    if (shouldRetry && retryCount < maxRetries) {
      // Incrementar contador
      config._retryCount = retryCount + 1;
      
      console.log(`Tentativa ${config._retryCount} de ${maxRetries}...`);
      
      // Retentar requisição
      return axios(config);
    }
    
    // Não retentar - rejeitar erro
    return Promise.reject(error);
  }
);
```

### Exponential Backoff

**Padrão: Aumentar delay entre tentativas exponencialmente**

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    const maxRetries = 3;
    const retryCount = config._retryCount || 0;
    
    if (!error.response && retryCount < maxRetries) {
      config._retryCount = retryCount + 1;
      
      // Exponential backoff: 1s, 2s, 4s, 8s, ...
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      
      console.log(`Tentativa ${config._retryCount} em ${delay}ms...`);
      
      // Esperar antes de retentar
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);
```

**Por que exponential backoff?**
- Evita sobrecarregar servidor já instável
- Dá tempo para servidor recuperar
- Aumenta chance de sucesso em cada tentativa

**Exemplo - Delays:**
- Tentativa 1: 1s (2^0 * 1000ms)
- Tentativa 2: 2s (2^1 * 1000ms)
- Tentativa 3: 4s (2^2 * 1000ms)
- Tentativa 4: 8s (2^3 * 1000ms)

### Retry em Erros Específicos

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    const status = error.response?.status;
    
    // Erros que podem ser retentados
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const isNetworkError = !error.response;
    
    const shouldRetry = isNetworkError || retryableStatuses.includes(status);
    
    if (shouldRetry && (!config._retryCount || config._retryCount < 3)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      
      console.log(`[Retry] ${status || 'Network Error'} - Tentativa ${config._retryCount} em ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);
```

**Erros recuperáveis:**
- **408 Request Timeout:** Servidor demorou demais
- **429 Too Many Requests:** Rate limiting
- **500 Internal Server Error:** Erro temporário do servidor
- **502 Bad Gateway:** Gateway recebeu resposta inválida
- **503 Service Unavailable:** Servidor temporariamente indisponível
- **504 Gateway Timeout:** Gateway não recebeu resposta a tempo
- **Erro de rede:** Sem conexão, DNS, timeout

**Erros NÃO recuperáveis:**
- **400 Bad Request:** Requisição malformada
- **401 Unauthorized:** Não autenticado (precisa token refresh)
- **403 Forbidden:** Sem permissão
- **404 Not Found:** Recurso não existe
- **422 Unprocessable Entity:** Validation errors

### Token Refresh

**Padrão: Renovar token em 401 e retentar requisição original**

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Renovar token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        const newToken = response.data.access_token;
        localStorage.setItem('access_token', newToken);
        
        // Atualizar header da requisição original
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Retentar requisição original
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh falhou - redirecionar para login
        console.error('Falha ao renovar token:', refreshError);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Fluxo:**
1. Requisição retorna 401 (token expirado)
2. Interceptor detecta 401
3. Marca requisição como `_retry` (prevenir loop)
4. Chama `/auth/refresh` para renovar token
5. Atualiza `Authorization` header com novo token
6. Retenta requisição original com novo token
7. Se refresh falha, redireciona para login

### Token Refresh com Fila (Evitar múltiplas renovações)

**Problema:** Múltiplas requisições simultâneas com token expirado causam múltiplas chamadas a `/auth/refresh`.

**Solução:** Fila de requisições enquanto token está sendo renovado.

```javascript
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Já está renovando - adicionar à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      return new Promise((resolve, reject) => {
        axios.post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            const newToken = data.access_token;
            localStorage.setItem('access_token', newToken);
            
            // Atualizar default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
            // Atualizar header da requisição original
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            
            // Processar fila (resolver todas as requisições pendentes)
            processQueue(null, newToken);
            
            // Resolver requisição original
            resolve(axios(originalRequest));
          })
          .catch(err => {
            // Processar fila (rejeitar todas as requisições pendentes)
            processQueue(err, null);
            
            localStorage.clear();
            window.location.href = '/login';
            
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    
    return Promise.reject(error);
  }
);
```

**Fluxo:**
1. Primeira requisição com 401 inicia refresh (`isRefreshing = true`)
2. Requisições subsequentes com 401 são adicionadas à `failedQueue`
3. Quando refresh completa, `processQueue` resolve/rejeita todas as requisições na fila
4. Todas as requisições retentam com novo token

### Fallback Data (Graceful Degradation)

**Padrão: Retornar dados em cache quando API falha**

```javascript
const cache = new Map();

axios.interceptors.response.use(
  response => {
    // Cachear respostas GET
    if (response.config.method === 'get') {
      const cacheKey = response.config.url + JSON.stringify(response.config.params);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  },
  error => {
    // Se erro de rede, tentar cache
    if (!error.response && error.config.method === 'get') {
      const cacheKey = error.config.url + JSON.stringify(error.config.params);
      const cached = cache.get(cacheKey);
      
      if (cached) {
        const age = Date.now() - cached.timestamp;
        console.log(`[Fallback] Usando cache (${Math.round(age / 1000)}s atrás) devido a erro de rede`);
        
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config: error.config,
          fromCache: true,
          cacheAge: age
        };
      }
    }
    
    return Promise.reject(error);
  }
);

// Uso
try {
  const response = await axios.get('/api/dados');
  
  if (response.fromCache) {
    toast.info('Mostrando dados em cache (offline)');
  }
  
  console.log(response.data);
} catch (error) {
  toast.error('Erro ao carregar dados e sem cache disponível');
}
```

### Rate Limiting (Respeitar Retry-After)

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    if (error.response?.status === 429) {
      // Rate limited - respeitar Retry-After header
      const retryAfter = error.response.headers['retry-after'];
      
      if (retryAfter && !config._rateLimitRetry) {
        config._rateLimitRetry = true;
        
        // Retry-After pode ser em segundos ou data HTTP
        let delay;
        if (/^\d+$/.test(retryAfter)) {
          // Segundos
          delay = parseInt(retryAfter) * 1000;
        } else {
          // Data HTTP
          const retryDate = new Date(retryAfter);
          delay = retryDate.getTime() - Date.now();
        }
        
        console.log(`[Rate Limit] Aguardando ${delay}ms antes de retentar...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return axios(config);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### Idempotência - Retry Apenas em Métodos Seguros

**Problema:** Retentar POST pode duplicar dados.

**Solução:** Retentar apenas métodos idempotentes.

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Métodos idempotentes (seguros para retry)
    const idempotentMethods = ['get', 'head', 'options', 'put', 'delete'];
    const isIdempotent = idempotentMethods.includes(config.method?.toLowerCase());
    
    // Apenas retentar se idempotente
    if (isIdempotent && !error.response && (!config._retryCount || config._retryCount < 3)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      
      console.log(`[Retry] Tentativa ${config._retryCount} em ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);
```

**Métodos idempotentes:**
- **GET:** Leitura (não muda estado)
- **HEAD:** Leitura de headers (não muda estado)
- **OPTIONS:** Leitura de opções (não muda estado)
- **PUT:** Atualização completa (idempotente)
- **DELETE:** Deleção (idempotente)

**Métodos NÃO idempotentes:**
- **POST:** Criação (pode duplicar se retentar)
- **PATCH:** Atualização parcial (pode causar inconsistências se retentar)

---

## 🔍 Análise Conceitual Profunda

### Caso 1: Retry Completo com Exponential Backoff

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    const status = error.response?.status;
    
    // Configurações
    const maxRetries = 3;
    const retryCount = config._retryCount || 0;
    
    // Erros recuperáveis
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const isNetworkError = !error.response;
    const isRetryableStatus = retryableStatuses.includes(status);
    
    // Métodos idempotentes
    const idempotentMethods = ['get', 'head', 'options', 'put', 'delete'];
    const isIdempotent = idempotentMethods.includes(config.method?.toLowerCase());
    
    // Decisão de retry
    const shouldRetry = (isNetworkError || isRetryableStatus) && isIdempotent;
    
    if (shouldRetry && retryCount < maxRetries) {
      config._retryCount = retryCount + 1;
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      
      console.log(`[Retry] ${status || 'Network Error'} - Tentativa ${config._retryCount} de ${maxRetries} em ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(config);
    }
    
    // Não retentar
    if (retryCount >= maxRetries) {
      console.error(`[Retry] Excedeu ${maxRetries} tentativas`);
    }
    
    return Promise.reject(error);
  }
);
```

### Caso 2: Token Refresh + Retry + Fallback

```javascript
// Cache
const cache = new Map();

// Token refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
axios.interceptors.response.use(
  response => {
    // Cachear GET
    if (response.config.method === 'get') {
      const cacheKey = response.config.url;
      cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    }
    return response;
  },
  async error => {
    const config = error.config;
    const status = error.response?.status;
    
    // 1. TOKEN REFRESH (401)
    if (status === 401 && !config._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers['Authorization'] = `Bearer ${token}`;
          return axios(config);
        });
      }
      
      config._retry = true;
      isRefreshing = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/refresh', { refreshToken });
        
        const newToken = response.data.access_token;
        localStorage.setItem('access_token', newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        config.headers['Authorization'] = `Bearer ${newToken}`;
        
        processQueue(null, newToken);
        
        return axios(config);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // 2. RETRY (erros temporários)
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    const isNetworkError = !error.response;
    const isRetryable = isNetworkError || retryableStatuses.includes(status);
    const idempotentMethods = ['get', 'head', 'options', 'put', 'delete'];
    const isIdempotent = idempotentMethods.includes(config.method?.toLowerCase());
    
    if (isRetryable && isIdempotent && (!config._retryCount || config._retryCount < 3)) {
      config._retryCount = (config._retryCount || 0) + 1;
      
      const delay = Math.pow(2, config._retryCount - 1) * 1000;
      
      console.log(`[Retry] Tentativa ${config._retryCount} em ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return axios(config);
    }
    
    // 3. FALLBACK (cache)
    if (isNetworkError && config.method === 'get') {
      const cacheKey = config.url;
      const cached = cache.get(cacheKey);
      
      if (cached) {
        console.log('[Fallback] Usando cache devido a erro de rede');
        
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config,
          fromCache: true
        };
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Error Recovery

**Use quando:**
- Aplicações mobile (redes instáveis)
- PWAs offline-first
- APIs com rate limiting
- APIs instáveis (503, 502)
- Autenticação com tokens

### Quando Não Usar

**Evite se:**
- Requisições não idempotentes (POST, PATCH) sem cuidado
- APIs que não aceitam retry
- Performance crítica (retry adiciona latência)

---

## ⚠️ Limitações e Considerações Teóricas

### Evitar Retry em Métodos Não Idempotentes

```javascript
// ❌ RISCO - retry em POST pode duplicar dados
axios.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response && !error.config._retry) {
      error.config._retry = true;
      return axios(error.config); // ← POST pode duplicar!
    }
    return Promise.reject(error);
  }
);

// ✅ MELHOR - retry apenas idempotentes
axios.interceptors.response.use(
  response => response,
  async error => {
    const idempotentMethods = ['get', 'head', 'options', 'put', 'delete'];
    const isIdempotent = idempotentMethods.includes(error.config.method?.toLowerCase());
    
    if (isIdempotent && !error.response && !error.config._retry) {
      error.config._retry = true;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Prevenir Loops Infinitos

```javascript
// ❌ RISCO - loop infinito
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Se /auth/refresh também retorna 401, loop infinito!
      const response = await axios.post('/auth/refresh', {...});
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

// ✅ MELHOR - marcar retry
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // ← Previne loop
      const response = await axios.post('/auth/refresh', {...});
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## 🔗 Interconexões Conceituais

### Error Recovery e Interceptor Patterns

```javascript
// Combinar retry + token refresh + fallback
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Advanced Retry:** Circuit breaker, jitter
2. **Testing:** Mockar erros e testar recovery
3. **Monitoring:** Rastrear retry rates, success rates

---

## 📚 Conclusão

**Error Recovery** torna aplicações **resilientes a falhas temporárias**.

**Dominar error recovery significa:**
- **Automatic retry:** Retentar em erros temporários
- **Exponential backoff:** Aumentar delay entre tentativas
- **Token refresh:** Renovar tokens automaticamente
- **Fallback data:** Retornar cache quando offline
- **Idempotência:** Retentar apenas métodos seguros

**Use error recovery para:**
- ✅ Retry em erros de rede
- ✅ Token refresh automático
- ✅ Rate limiting (Retry-After)
- ✅ Fallback para cache
- ✅ Melhor experiência do usuário

**Evite se:**
- ❌ Métodos não idempotentes (POST, PATCH)
- ❌ Risco de loop infinito
- ❌ Performance crítica

Com **Error Recovery**, você constrói aplicações que **continuam funcionando mesmo quando APIs falham**.
