# Response Interceptors (data transformation, error handling)

## 🎯 Introdução e Definição

### Definição Conceitual

**Response Interceptors** (interceptadores de resposta) são **funções executadas automaticamente DEPOIS** que o servidor responde, mas **ANTES** que a Promise seja resolvida. Conceitualmente, são **middlewares de entrada** - camadas de processamento que **interceptam, transformam e tratam** respostas HTTP antes que elas cheguem ao código da aplicação.

Pense em response interceptors como **porteiros de entrada** - toda resposta passa por eles ao chegar, permitindo transformar dados, normalizar estruturas, tratar erros globalmente, fazer logging, ou até modificar o response object.

**Estrutura fundamental:**
```javascript
axios.interceptors.response.use(
  response => {
    // ✅ Sucesso (2xx) - transformar e retornar response
    console.log('Resposta recebida:', response.status);
    response.data = transformData(response.data);
    return response;
  },
  error => {
    // ❌ Erro (4xx, 5xx, network) - tratar e retornar reject/recovery
    console.error('Erro na resposta:', error.response?.status);
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

**Fluxo de execução:**
```
1. axios.get('/api/dados') chamado
2. Request interceptor executado (adiciona headers)
3. Requisição enviada ao servidor
4. Servidor responde (200, 400, 500, etc.)
5. Response interceptor executado (transforma dados, trata erros)
6. Promise resolvida (response) ou rejeitada (error)
7. Código da aplicação recebe resultado
```

**Dois casos de uso principais:**

1. **Data Transformation:** Normalizar, extrair, reformatar dados da API
2. **Error Handling:** Tratamento global de erros (401 → login, 500 → toast, retry)

**Exemplo prático - Data Transformation:**
```javascript
// API retorna: { success: true, payload: { usuarios: [...] }, metadata: {...} }
// Queremos apenas: { usuarios: [...] }

axios.interceptors.response.use(response => {
  // Extrair payload automaticamente
  if (response.data.success && response.data.payload) {
    response.data = response.data.payload;
  }
  return response;
});

// Agora código da aplicação recebe dados limpos
const response = await axios.get('/api/usuarios');
console.log(response.data); // { usuarios: [...] } (não mais { success, payload, metadata })
```

**Exemplo prático - Error Handling:**
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Tratamento global de erros
    if (error.response?.status === 401) {
      // Não autenticado - redirecionar para login
      localStorage.clear();
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      // Erro do servidor - mostrar notificação
      toast.error('Erro no servidor. Tente novamente.');
    }
    
    return Promise.reject(error);
  }
);

// Agora TODAS as requisições têm tratamento de erro automático
await axios.get('/api/perfil'); // Se 401 → redireciona automaticamente
await axios.post('/api/posts', data); // Se 500 → toast automático
```

### Contexto Histórico e Motivação

Antes de response interceptors, tratar respostas e erros era repetitivo:

**Sem interceptors (código repetitivo):**

```javascript
// ❌ Tratar erro 401 em CADA função
async function getUsuarios() {
  try {
    const response = await axios.get('/api/usuarios');
    return response.data.payload; // Extrair payload manualmente
  } catch (error) {
    if (error.response?.status === 401) {
      redirectToLogin(); // Repetido em CADA função!
    }
    throw error;
  }
}

async function getPosts() {
  try {
    const response = await axios.get('/api/posts');
    return response.data.payload; // Extrair payload manualmente
  } catch (error) {
    if (error.response?.status === 401) {
      redirectToLogin(); // Repetido novamente!
    }
    throw error;
  }
}

// Repetição em CADA função!
```

**Problemas:**
1. **DRY violation:** Lógica duplicada em todas as funções
2. **Manutenção:** Mudar tratamento de erro = editar todas as funções
3. **Inconsistência:** Fácil esquecer tratamento em alguma função
4. **Data extraction:** Repetir lógica de extração de dados

**Com response interceptors:**

```javascript
// ✅ Configurar UMA VEZ
axios.interceptors.response.use(
  response => {
    // Data transformation global
    if (response.data.payload) {
      response.data = response.data.payload;
    }
    return response;
  },
  error => {
    // Error handling global
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

// Agora todas as funções são simples
async function getUsuarios() {
  const response = await axios.get('/api/usuarios');
  return response.data; // Dados já transformados!
}

async function getPosts() {
  const response = await axios.get('/api/posts');
  return response.data; // Dados já transformados!
}

// Sem try/catch repetido, sem extração manual!
```

**Vantagens:**
- **DRY:** Lógica definida uma vez
- **Centralização:** Todas as respostas passam pelo interceptor
- **Consistência:** Impossível esquecer tratamento de erro
- **Transformação automática:** Dados sempre no formato esperado

### Problema Fundamental que Resolve

**Response Interceptors resolvem crosscutting concerns de respostas:**

**1. Data Transformation (Normalização):**

```javascript
// API inconsistente - às vezes retorna { data }, outras vezes { payload }
axios.interceptors.response.use(response => {
  // Normalizar estrutura
  if (response.data.data) {
    response.data = response.data.data;
  } else if (response.data.payload) {
    response.data = response.data.payload;
  }
  
  return response;
});

// Código da aplicação sempre recebe formato consistente
const response = await axios.get('/api/usuarios');
console.log(response.data); // Sempre { usuarios: [...] }, nunca { data: {...} }
```

**2. Error Handling Global:**

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Tratamento centralizado de erros
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        // Não autenticado
        toast.error('Sessão expirada');
        redirectToLogin();
        break;
      case 403:
        // Sem permissão
        toast.error('Você não tem permissão');
        break;
      case 500:
        // Erro do servidor
        toast.error('Erro no servidor');
        logErrorToService(error);
        break;
    }
    
    return Promise.reject(error);
  }
);
```

**3. Response Logging:**

```javascript
axios.interceptors.response.use(
  response => {
    // Log de sucesso
    const duration = Date.now() - response.config.metadata.startTime;
    console.log(`[RESPONSE] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      duration: `${duration}ms`
    });
    
    return response;
  },
  error => {
    // Log de erro
    console.error(`[ERROR] ${error.config?.method.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);
```

**4. Data Extraction (Unwrapping):**

```javascript
// API retorna: { success: true, data: { usuarios: [...] }, meta: {...} }
// Queremos apenas: { usuarios: [...] }

axios.interceptors.response.use(response => {
  if (response.data.success && response.data.data) {
    response.data = response.data.data;
  }
  return response;
});
```

**5. Error Normalization:**

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Normalizar erro para formato consistente
    const normalizedError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors || []
    };
    
    error.normalized = normalizedError;
    return Promise.reject(error);
  }
);

// Código da aplicação sempre acessa erro normalizado
try {
  await axios.get('/api/usuarios');
} catch (error) {
  console.log(error.normalized.message); // Sempre disponível
}
```

### Importância no Ecossistema

**Response Interceptors são fundamentais para:**

- **Data transformation:** Normalizar APIs inconsistentes
- **Error handling:** Tratar erros globalmente (401, 403, 500)
- **Logging:** Rastrear todas as respostas
- **Caching:** Implementar cache de respostas
- **Retry logic:** Tentar novamente em caso de erro
- **Token refresh:** Renovar token expirado automaticamente
- **Analytics:** Rastrear performance de APIs

**Padrão de produção - Transformation + Error Handling + Logging:**

```javascript
axios.interceptors.response.use(
  response => {
    // 1. Logging de sucesso
    const duration = Date.now() - response.config.metadata?.startTime;
    console.log(`[SUCCESS] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      duration: `${duration}ms`
    });
    
    // 2. Data transformation
    if (response.data.success && response.data.payload) {
      response.data = response.data.payload;
    }
    
    // 3. Analytics
    analytics.track('api_response', {
      method: response.config.method,
      url: response.config.url,
      status: response.status,
      duration
    });
    
    return response;
  },
  error => {
    // 1. Logging de erro
    console.error(`[ERROR] ${error.config?.method.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message
    });
    
    // 2. Error handling global
    const status = error.response?.status;
    
    if (status === 401) {
      toast.error('Sessão expirada');
      redirectToLogin();
    } else if (status === 500) {
      toast.error('Erro no servidor');
    }
    
    // 3. Error normalization
    error.normalized = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      code: error.response?.data?.code
    };
    
    // 4. Analytics
    analytics.track('api_error', {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status
    });
    
    return Promise.reject(error);
  }
);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Execução automática:** Rodado DEPOIS de cada resposta
2. **Dois callbacks:** Success (2xx) e error (4xx, 5xx, network)
3. **Transformação de dados:** Modificar response.data antes de chegar ao código
4. **Error handling global:** Tratar erros em um lugar centralizado
5. **Promise-based:** Retorna response ou Promise.reject(error)

### Pilares Fundamentais

- **Assinatura:** `axios.interceptors.response.use(onFulfilled, onRejected)`
- **onFulfilled:** `response => { ... return response; }` (status 2xx)
- **onRejected:** `error => { ... return Promise.reject(error); }` (status 4xx, 5xx, network)
- **Retorno obrigatório:** Sempre retornar response (success) ou Promise.reject (error)
- **Escopo:** Global (axios) ou instance (api instance)

### Visão Geral das Nuances

- **Ordem de execução:** Primeiro adicionado = primeiro executado (FIFO)
- **Mutabilidade:** response é mutável (pode modificar response.data)
- **Async support:** Interceptor pode ser async (token refresh)
- **Error recovery:** Pode converter erro em sucesso (fallback data)
- **Eject:** Interceptors podem ser removidos com eject()

---

## 🧠 Fundamentos Teóricos

### Assinatura

```javascript
const interceptorId = axios.interceptors.response.use(
  onFulfilled,  // Success handler (2xx)
  onRejected    // Error handler (4xx, 5xx, network)
);
```

**Parâmetros:**

- `onFulfilled(response)`: Executado quando status é 2xx
  - Recebe: response object (data, status, headers, config)
  - Retorna: response modificado ou Promise
  
- `onRejected(error)`: Executado quando status é 4xx, 5xx ou erro de rede
  - Recebe: error object (response, request, message)
  - Retorna: Promise.reject(error) ou response (recovery)

**Retorno:** ID do interceptor (para eject posterior)

### onFulfilled - Success Handler

```javascript
axios.interceptors.response.use(response => {
  // response object disponível
  console.log(response.data);      // Dados da resposta
  console.log(response.status);    // 200, 201, etc.
  console.log(response.headers);   // Headers da resposta
  console.log(response.config);    // Config da requisição
  
  // Transformar dados
  response.data = transformData(response.data);
  
  // SEMPRE retornar response
  return response;
});
```

**REGRA CRÍTICA:** Sempre retornar `response` (modificado ou não).

```javascript
// ❌ ERRO - não retornar response
axios.interceptors.response.use(response => {
  console.log(response.data);
  // Esqueceu de retornar! Promise ficará pendente
});

// ✅ CORRETO
axios.interceptors.response.use(response => {
  console.log(response.data);
  return response; // ← Essencial!
});
```

### onRejected - Error Handler

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // error object disponível
    console.log(error.response);  // Response do servidor (se houver)
    console.log(error.request);   // Request enviado (se houver)
    console.log(error.message);   // Mensagem de erro
    
    // Tratamento de erro
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    
    // SEMPRE retornar Promise.reject (ou response para recovery)
    return Promise.reject(error);
  }
);
```

**Quando onRejected é chamado:**
- Status 4xx (400, 401, 403, 404, etc.)
- Status 5xx (500, 502, 503, etc.)
- Erro de rede (timeout, DNS, sem internet)
- Interceptor anterior lançou erro

### Transformando response.data

```javascript
// API retorna: { success: true, data: { usuarios: [...] } }
// Queremos: { usuarios: [...] }

axios.interceptors.response.use(response => {
  if (response.data.success && response.data.data) {
    response.data = response.data.data; // Unwrap
  }
  return response;
});

// Uso
const response = await axios.get('/api/usuarios');
console.log(response.data); // { usuarios: [...] } (não { success, data })
```

**Exemplo - Normalizar arrays:**

```javascript
// API inconsistente - às vezes retorna array, outras vezes object com items
axios.interceptors.response.use(response => {
  const data = response.data;
  
  // Se tem items, extrair
  if (data.items && Array.isArray(data.items)) {
    response.data = data.items;
  }
  // Se já é array, manter
  else if (Array.isArray(data)) {
    response.data = data;
  }
  
  return response;
});
```

**Exemplo - Transformar datas:**

```javascript
axios.interceptors.response.use(response => {
  // Converter strings ISO para Date objects
  const convertDates = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (const key in obj) {
      const value = obj[key];
      
      // String ISO 8601 (ex: "2025-11-17T10:30:00Z")
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        obj[key] = new Date(value);
      }
      // Recursivo para objetos aninhados
      else if (typeof value === 'object') {
        obj[key] = convertDates(value);
      }
    }
    
    return obj;
  };
  
  response.data = convertDates(response.data);
  return response;
});
```

### Error Handling Global

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        // Não autenticado - redirecionar
        toast.error('Sessão expirada');
        localStorage.clear();
        window.location.href = '/login';
        break;
        
      case 403:
        // Sem permissão
        toast.error('Você não tem permissão para esta ação');
        break;
        
      case 404:
        // Não encontrado
        toast.warn('Recurso não encontrado');
        break;
        
      case 500:
      case 502:
      case 503:
        // Erro do servidor
        toast.error('Erro no servidor. Tente novamente mais tarde.');
        logErrorToService(error);
        break;
        
      default:
        // Erro de rede ou outro
        if (!error.response) {
          toast.error('Erro de conexão. Verifique sua internet.');
        }
    }
    
    return Promise.reject(error);
  }
);
```

### Error Normalization

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Criar estrutura de erro consistente
    const normalized = {
      message: 'Erro desconhecido',
      status: null,
      code: null,
      errors: []
    };
    
    if (error.response) {
      // Erro HTTP (4xx, 5xx)
      normalized.status = error.response.status;
      normalized.message = error.response.data?.message || error.message;
      normalized.code = error.response.data?.code;
      normalized.errors = error.response.data?.errors || [];
    } else if (error.request) {
      // Erro de rede
      normalized.message = 'Erro de conexão';
      normalized.code = 'NETWORK_ERROR';
    } else {
      // Erro ao configurar requisição
      normalized.message = error.message;
    }
    
    error.normalized = normalized;
    return Promise.reject(error);
  }
);

// Uso
try {
  await axios.get('/api/usuarios');
} catch (error) {
  console.log(error.normalized.message); // Sempre disponível
  console.log(error.normalized.status);   // Sempre disponível
}
```

### Async Response Interceptors

**Interceptor pode ser async:**

```javascript
axios.interceptors.response.use(
  async response => {
    // Operação assíncrona
    await logResponseToAnalytics(response);
    return response;
  },
  async error => {
    // Operação assíncrona
    await logErrorToService(error);
    return Promise.reject(error);
  }
);
```

**Exemplo - Token refresh automático:**

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Se 401 e não é retry
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
```

### Error Recovery (Fallback Data)

**Converter erro em sucesso com dados fallback:**

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Se erro 404, retornar dados vazios em vez de rejeitar
    if (error.response?.status === 404) {
      return {
        data: [],
        status: 200,
        statusText: 'OK (fallback)',
        headers: {},
        config: error.config
      };
    }
    
    return Promise.reject(error);
  }
);

// Uso - nunca lança erro 404
const response = await axios.get('/api/usuarios');
console.log(response.data); // [] se 404, [...] se sucesso
```

### Múltiplos Interceptors

```javascript
// Interceptor 1 - Data transformation
axios.interceptors.response.use(response => {
  if (response.data.payload) {
    response.data = response.data.payload;
  }
  return response;
});

// Interceptor 2 - Logging
axios.interceptors.response.use(response => {
  console.log('Response:', response.status);
  return response;
});

// Interceptor 3 - Analytics
axios.interceptors.response.use(response => {
  analytics.track('api_response', { url: response.config.url });
  return response;
});
```

**Ordem de execução:** FIFO (First In, First Out) - oposto de request interceptors!

```javascript
// Ordem de adição
axios.interceptors.response.use(response => {
  console.log('1');
  return response;
});

axios.interceptors.response.use(response => {
  console.log('2');
  return response;
});

axios.interceptors.response.use(response => {
  console.log('3');
  return response;
});

// Ordem de execução: 1 → 2 → 3 (mesma ordem de adição)
await axios.get('/api/dados');
// Output: 1, 2, 3
```

### Eject (Remover Interceptor)

```javascript
// Adicionar e guardar ID
const interceptorId = axios.interceptors.response.use(
  response => {
    console.log('Response:', response.status);
    return response;
  }
);

// Remover interceptor
axios.interceptors.response.eject(interceptorId);

// Agora respostas não passam mais pelo interceptor
```

---

## 🔍 Análise Conceitual Profunda

### Padrão 1: Data Unwrapping

```javascript
// API retorna: { success: true, data: {...}, meta: {...} }
// Queremos apenas: {...}

axios.interceptors.response.use(response => {
  if (response.data.success && response.data.data) {
    response.data = response.data.data;
  }
  return response;
});

// Uso
const response = await axios.get('/api/usuarios');
console.log(response.data); // { usuarios: [...] } (sem envelope)
```

### Padrão 2: Error Handling + Redirect

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    
    if (status === 401) {
      // Não autenticado
      toast.error('Sessão expirada. Faça login novamente.');
      localStorage.clear();
      window.location.href = '/login';
    } else if (status === 403) {
      // Sem permissão
      toast.error('Acesso negado');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);
```

### Padrão 3: Token Refresh Automático

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
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
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
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
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

### Padrão 4: Response Logging + Analytics

```javascript
axios.interceptors.response.use(
  response => {
    // Calcular duração
    const duration = Date.now() - response.config.metadata?.startTime;
    
    // Log
    console.log(`[RESPONSE] ${response.config.method.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      duration: `${duration}ms`
    });
    
    // Analytics
    analytics.track('api_response', {
      method: response.config.method,
      url: response.config.url,
      status: response.status,
      duration
    });
    
    return response;
  },
  error => {
    // Log de erro
    console.error(`[ERROR] ${error.config?.method.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.message
    });
    
    // Analytics
    analytics.track('api_error', {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status
    });
    
    return Promise.reject(error);
  }
);
```

### Padrão 5: Retry em Erro de Rede

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
      
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);
```

### Padrão 6: Error Normalization Complexa

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Estrutura normalizada
    const normalized = {
      type: 'unknown',
      message: 'Erro desconhecido',
      status: null,
      code: null,
      errors: {},
      canRetry: false
    };
    
    if (error.response) {
      // Erro HTTP
      normalized.type = 'http';
      normalized.status = error.response.status;
      normalized.message = error.response.data?.message || `Erro ${error.response.status}`;
      normalized.code = error.response.data?.code;
      
      // Validation errors (ex: Laravel)
      if (error.response.status === 422) {
        normalized.errors = error.response.data?.errors || {};
      }
      
      // Erros que podem ser retentados
      normalized.canRetry = [408, 429, 500, 502, 503, 504].includes(error.response.status);
    } else if (error.request) {
      // Erro de rede
      normalized.type = 'network';
      normalized.message = 'Erro de conexão. Verifique sua internet.';
      normalized.code = error.code; // ECONNABORTED, ETIMEDOUT, etc.
      normalized.canRetry = true;
    } else {
      // Erro ao configurar requisição
      normalized.type = 'setup';
      normalized.message = error.message;
    }
    
    error.normalized = normalized;
    return Promise.reject(error);
  }
);
```

### Padrão 7: Fallback Data (Graceful Degradation)

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    const url = error.config?.url;
    
    // Fallback data por endpoint
    const fallbacks = {
      '/api/config': { theme: 'light', language: 'pt-BR' },
      '/api/usuarios': [],
      '/api/perfil': { name: 'Usuário', email: 'user@example.com' }
    };
    
    // Se erro 500/503 E tem fallback, retornar dados mock
    if ([500, 503].includes(error.response?.status) && fallbacks[url]) {
      console.warn(`Usando fallback data para ${url}`);
      
      return {
        data: fallbacks[url],
        status: 200,
        statusText: 'OK (fallback)',
        headers: {},
        config: error.config,
        isFallback: true
      };
    }
    
    return Promise.reject(error);
  }
);
```

### Padrão 8: Caching de Respostas

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
        console.log('Usando dados em cache devido a erro de rede');
        
        return {
          data: cached.data,
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
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Response Interceptors

**Use quando:**
- Data transformation (unwrap, normalize)
- Error handling global (401 → login, 500 → toast)
- Token refresh automático
- Response logging/analytics
- Error normalization
- Retry logic
- Fallback data (graceful degradation)
- Response caching

### Quando Não Usar

**Evite se:**
- Transformação específica de uma resposta (use .then())
- Lógica complexa demais (dificulta debugging)
- Performance crítica (interceptors adicionam overhead)

---

## ⚠️ Limitações e Considerações Teóricas

### Sempre Retornar Response ou Reject

```javascript
// ❌ ERRO - não retornar
axios.interceptors.response.use(response => {
  console.log(response.data);
  // Esqueceu return! Promise ficará pendente
});

// ✅ CORRETO
axios.interceptors.response.use(response => {
  console.log(response.data);
  return response;
});
```

### Evitar Loops Infinitos no Token Refresh

```javascript
// ❌ RISCO - refresh pode causar loop
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Requisição de refresh também pode dar 401!
      const response = await axios.post('/auth/refresh', {...}); // ← Loop infinito!
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

### Ordem de Execução (FIFO)

```javascript
// Primeiro adicionado = primeiro executado
axios.interceptors.response.use(response => {
  console.log('A');
  return response;
});

axios.interceptors.response.use(response => {
  console.log('B');
  return response;
});

await axios.get('/test');
// Output: A, B (não B, A!)
```

---

## 🔗 Interconexões Conceituais

### Request e Response Interceptors Juntos

```javascript
// Request - adicionar metadata
axios.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

// Response - calcular duração
axios.interceptors.response.use(response => {
  const duration = Date.now() - response.config.metadata.startTime;
  console.log(`Duração: ${duration}ms`);
  return response;
});
```

### Response Interceptors e Retry Logic

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    if (!error.response && !error.config._retry) {
      error.config._retry = true;
      return axios(error.config); // Retry
    }
    return Promise.reject(error);
  }
);
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Interceptor Patterns:** Chaining, conditional, composition
2. **Error Recovery:** Retry avançado, fallback strategies
3. **Async Interceptors:** Token refresh complexo
4. **Testing:** Mockar interceptors em testes

---

## 📚 Conclusão

**Response Interceptors** são **ferramenta essencial para data transformation e error handling global**.

**Dominar response interceptors significa:**
- **Transformar dados** automaticamente (unwrap, normalize)
- **Tratar erros** globalmente (401 → login, 500 → toast)
- **Renovar tokens** automaticamente (refresh logic)
- **Implementar retry** em erros de rede
- **Logging centralizado** de respostas

**Use response interceptors para:**
- ✅ Data transformation (unwrap envelopes)
- ✅ Error handling (401, 403, 500)
- ✅ Token refresh automático
- ✅ Response logging/analytics
- ✅ Retry logic
- ✅ Fallback data (graceful degradation)

**Evite se:**
- ❌ Transformação específica (use .then())
- ❌ Risco de loop infinito (marque _retry)
- ❌ Lógica muito complexa

Com **Response Interceptors**, você centraliza tratamento de respostas e erros, garantindo consistência e manutenibilidade.
