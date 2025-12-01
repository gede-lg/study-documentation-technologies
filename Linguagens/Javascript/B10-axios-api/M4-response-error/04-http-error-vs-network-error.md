# HTTP Error vs Network Error

## 🎯 Introdução e Definição

### Definição Conceitual

**HTTP Error vs Network Error** representa a **distinção fundamental** entre dois tipos de falha em comunicação HTTP: erros que ocorrem **depois que o servidor responde** (HTTP errors) versus erros que impedem a **comunicação com o servidor** (network errors).

Conceitualmente, é a diferença entre:

- **HTTP Error:** "O servidor recebeu minha requisição e **respondeu com erro**" (status 4xx, 5xx)
- **Network Error:** "A requisição **nunca chegou** ao servidor ou a resposta **nunca voltou**" (timeout, DNS, conexão)

**Manifestação no Axios:**

```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  // HTTP Error - servidor respondeu
  if (error.response) {
    console.log('HTTP Error:', error.response.status);
    // 400, 404, 500, etc.
  }
  
  // Network Error - sem resposta
  else if (error.request) {
    console.log('Network Error:', error.message);
    // "Network Error", "timeout of 5000ms exceeded", etc.
  }
}
```

**Diferença crucial:**

| Aspecto | HTTP Error | Network Error |
|---------|------------|---------------|
| **Servidor** | Respondeu | Não respondeu |
| **error.response** | Existe | undefined |
| **error.request** | Existe | Existe |
| **Status code** | 4xx, 5xx | 0 ou inexistente |
| **Causa** | Servidor retornou erro | Timeout, DNS, conexão |
| **Retry?** | Depende (404 não, 500 talvez) | Geralmente sim |

**Por que distinguir?**

1. **Tratamento diferente:** HTTP 404 → "não encontrado" vs Timeout → "tente novamente"
2. **Retry logic:** Network errors podem ser retornados, HTTP 404 não
3. **User feedback:** Mensagens específicas ("servidor offline" vs "recurso não existe")
4. **Monitoring:** Rastrear problemas de rede vs erros de aplicação
5. **Debugging:** Identificar se problema está no cliente, rede ou servidor

### Contexto Histórico e Evolução

**XMLHttpRequest (ambiguidade):**

```javascript
// ❌ Difícil distinguir HTTP vs network error
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/dados');

xhr.onload = function() {
  // Servidor respondeu (pode ser 200, 404, 500, etc.)
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log('Sucesso');
  } else {
    console.log('Erro HTTP:', xhr.status); // 404, 500, etc.
  }
};

xhr.onerror = function() {
  // Network error - mas QUAL?
  console.log('Erro de rede');
  // Sem detalhes! Timeout? DNS? Conexão recusada?
};

xhr.ontimeout = function() {
  // Timeout - evento separado
  console.log('Timeout');
};

xhr.send();
```

**Fetch API (melhor, mas incompleto):**

```javascript
try {
  const response = await fetch('/api/dados');
  
  // Fetch NÃO lança erro para 4xx, 5xx!
  if (!response.ok) {
    console.log('HTTP Error:', response.status);
  }
} catch (error) {
  // Apenas network errors caem aqui
  console.log('Network Error:', error.message);
  // Mas ainda sem distinção clara (timeout vs DNS vs conexão)
}
```

**Axios (distinção clara):**

```javascript
// ✅ Categorização automática e estruturada
try {
  await axios.get('/api/dados');
} catch (error) {
  // HTTP Error - error.response existe
  if (error.response) {
    console.log('HTTP Error:', error.response.status);
    console.log('Data:', error.response.data);
  }
  
  // Network Error - error.request existe, response não
  else if (error.request) {
    console.log('Network Error');
    console.log('Code:', error.code); // ECONNABORTED, ERR_NETWORK, etc.
    console.log('Message:', error.message);
  }
  
  // Config Error - erro antes de enviar
  else {
    console.log('Setup Error:', error.message);
  }
}
```

**Vantagens do Axios:**
- **Categorização automática:** error.response vs error.request
- **Metadata rica:** Status, data, headers (HTTP) vs code, message (network)
- **Consistente:** Sempre mesma estrutura
- **Debugging-friendly:** Fácil identificar tipo de erro

### Problema Fundamental que Resolve

**Distinção HTTP vs Network resolve tratamento diferenciado:**

**1. User Feedback Específico:**

```javascript
try {
  await axios.get('/api/usuarios/999');
} catch (error) {
  if (error.response?.status === 404) {
    alert('Usuário não encontrado');
  } else if (error.request) {
    alert('Sem conexão com servidor, verifique sua internet');
  }
}
```

**2. Retry Logic Condicional:**

```javascript
async function fetchWithRetry(url, retries = 3) {
  try {
    return await axios.get(url);
  } catch (error) {
    // Retry apenas network errors
    if (error.request && retries > 0) {
      console.log('Network error, tentando novamente...');
      await sleep(1000);
      return fetchWithRetry(url, retries - 1);
    }
    
    // HTTP errors não são retornados
    throw error;
  }
}
```

**3. Offline Detection:**

```javascript
try {
  await axios.get('/api/health-check');
  setOnlineStatus(true);
} catch (error) {
  if (error.request) {
    // Network error = offline
    setOnlineStatus(false);
    showOfflineUI();
  }
}
```

**4. Monitoring Diferenciado:**

```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  if (error.response) {
    // HTTP error - problema de aplicação
    analytics.track('http_error', {
      status: error.response.status,
      endpoint: error.config.url
    });
  } else if (error.request) {
    // Network error - problema de infraestrutura/rede
    analytics.track('network_error', {
      code: error.code,
      endpoint: error.config.url
    });
  }
}
```

**5. Fallback Strategies:**

```javascript
async function fetchData() {
  try {
    const response = await axios.get('/api/dados');
    return response.data;
  } catch (error) {
    // HTTP 404 - retornar vazio
    if (error.response?.status === 404) {
      return [];
    }
    
    // Network error - usar cache
    if (error.request) {
      console.log('Usando dados cacheados (offline)');
      return getCachedData();
    }
    
    throw error;
  }
}
```

### Importância no Ecossistema

**Distinção HTTP vs Network é fundamental para:**

- **Resilience:** Aplicações robustas com fallbacks
- **Offline-first:** PWAs, apps que funcionam offline
- **User experience:** Mensagens claras e acionáveis
- **Debugging:** Identificar rapidamente onde está o problema
- **Monitoring:** Rastrear erros por categoria
- **Testing:** Simular diferentes tipos de falha

**Padrão de produção - Resilient fetch:**

```javascript
async function resilientFetch(url, options = {}) {
  try {
    const response = await axios.get(url, options);
    return { success: true, data: response.data };
  } catch (error) {
    // HTTP errors
    if (error.response) {
      const status = error.response.status;
      
      // 4xx - erro cliente (não retry)
      if (status >= 400 && status < 500) {
        return {
          success: false,
          errorType: 'client_error',
          status,
          message: error.response.data?.message || 'Erro na requisição'
        };
      }
      
      // 5xx - erro servidor (pode retry)
      if (status >= 500) {
        return {
          success: false,
          errorType: 'server_error',
          status,
          retryable: true,
          message: 'Erro no servidor'
        };
      }
    }
    
    // Network errors (retryable)
    if (error.request) {
      return {
        success: false,
        errorType: 'network_error',
        code: error.code,
        retryable: true,
        message: 'Sem conexão com servidor'
      };
    }
    
    // Config errors
    return {
      success: false,
      errorType: 'config_error',
      message: error.message
    };
  }
}

// Uso
const result = await resilientFetch('/api/usuarios');
if (result.success) {
  console.log(result.data);
} else if (result.retryable) {
  console.log('Tentando novamente...');
  // Retry logic
} else {
  console.log('Erro não recuperável:', result.message);
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **HTTP Error:** Servidor respondeu com status erro (4xx, 5xx)
2. **Network Error:** Requisição enviada mas sem resposta (timeout, DNS, conexão)
3. **error.response:** Existe apenas em HTTP errors
4. **error.request:** Existe em ambos (HTTP e network errors)
5. **Tratamento diferenciado:** Retry, fallback, user feedback

### Pilares Fundamentais

- **HTTP Error:** error.response existe, status 4xx/5xx
- **Network Error:** error.response undefined, error.request existe
- **Diagnóstico:** `if (error.response)` vs `else if (error.request)`
- **Retry:** Network errors retryable, HTTP errors geralmente não
- **User feedback:** Mensagens específicas por tipo

### Visão Geral das Nuances

- **Status 0:** Network error geralmente tem status 0
- **error.code:** Códigos específicos (ECONNABORTED, ERR_NETWORK, ENOTFOUND)
- **Timeout:** Network error com código ECONNABORTED
- **DNS failure:** Network error com código ENOTFOUND
- **Interceptors:** Podem transformar erros (HTTP → custom, network → retry)

---

## 🧠 Fundamentos Teóricos

### HTTP Error

**Definição:** Servidor **recebeu requisição** e **respondeu com erro** (status 4xx ou 5xx).

#### Características

```javascript
try {
  await axios.get('/api/usuarios/999');
} catch (error) {
  // HTTP Error - 404
  console.log(error.response.status); // 404
  console.log(error.response.statusText); // 'Not Found'
  console.log(error.response.data); // { message: 'Usuário não encontrado' }
  console.log(error.response.headers); // { 'content-type': '...' }
  
  console.log(error.request); // Também existe
  console.log(error.config); // Config da requisição
  
  console.log(error.message); // 'Request failed with status code 404'
  console.log(error.code); // 'ERR_BAD_REQUEST' (4xx) ou 'ERR_BAD_RESPONSE' (5xx)
}
```

#### Cenários Comuns

**400 Bad Request:**
```javascript
try {
  await axios.post('/api/usuarios', { email: 'invalido' });
} catch (error) {
  if (error.response?.status === 400) {
    console.log('Dados inválidos:', error.response.data.errors);
  }
}
```

**401 Unauthorized:**
```javascript
try {
  await axios.get('/api/perfil');
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Não autenticado, redirecionar para login');
    redirectToLogin();
  }
}
```

**404 Not Found:**
```javascript
try {
  await axios.get('/api/produtos/999');
} catch (error) {
  if (error.response?.status === 404) {
    console.log('Produto não encontrado');
  }
}
```

**500 Internal Server Error:**
```javascript
try {
  await axios.get('/api/relatorio');
} catch (error) {
  if (error.response?.status === 500) {
    console.log('Erro no servidor:', error.response.data);
  }
}
```

#### HTTP Error Codes

| Código | Categoria | Significado |
|--------|-----------|-------------|
| `ERR_BAD_REQUEST` | 4xx | Erro cliente |
| `ERR_BAD_RESPONSE` | 5xx | Erro servidor |

### Network Error

**Definição:** Requisição **não chegou ao servidor** ou **resposta não voltou**.

#### Características

```javascript
try {
  await axios.get('https://servidor-offline.com/api/dados');
} catch (error) {
  // Network Error
  console.log(error.response); // undefined ← Chave!
  console.log(error.request); // Existe (XMLHttpRequest ou ClientRequest)
  
  console.log(error.message); // 'Network Error' ou 'timeout of 5000ms exceeded'
  console.log(error.code); // 'ERR_NETWORK', 'ECONNABORTED', 'ENOTFOUND', etc.
  
  console.log(error.config); // Config da requisição
}
```

#### Cenários Comuns

**Timeout:**
```javascript
try {
  await axios.get('/api/lenta', {
    timeout: 1000 // 1 segundo
  });
} catch (error) {
  if (error.request && error.code === 'ECONNABORTED') {
    console.log('Timeout!');
    console.log('Message:', error.message); // 'timeout of 1000ms exceeded'
  }
}
```

**DNS Failure:**
```javascript
try {
  await axios.get('https://dominio-inexistente-xyz.com/api/dados');
} catch (error) {
  if (error.request && error.code === 'ENOTFOUND') {
    console.log('DNS falhou - domínio não existe');
  }
}
```

**Servidor Offline/Porta Fechada:**
```javascript
try {
  await axios.get('http://localhost:9999/api/dados');
} catch (error) {
  if (error.request && error.code === 'ECONNREFUSED') {
    console.log('Conexão recusada - servidor offline');
  }
}
```

**Network Error Genérico:**
```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  if (error.request && error.code === 'ERR_NETWORK') {
    console.log('Erro de rede genérico');
    // Sem internet, firewall, proxy, etc.
  }
}
```

#### Network Error Codes

| Código | Significado |
|--------|-------------|
| `ECONNABORTED` | Timeout |
| `ENOTFOUND` | DNS falhou |
| `ECONNREFUSED` | Servidor recusou conexão (offline/porta fechada) |
| `ETIMEDOUT` | Conexão timeout |
| `ERR_NETWORK` | Erro de rede genérico |
| `ERR_CANCELED` | Requisição cancelada (AbortController) |

### Diagnóstico - Decision Tree

```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  // 1. HTTP Error?
  if (error.response) {
    console.log('HTTP Error:', error.response.status);
    
    // 4xx - erro cliente
    if (error.response.status >= 400 && error.response.status < 500) {
      console.log('Erro cliente:', error.response.data);
    }
    
    // 5xx - erro servidor
    else if (error.response.status >= 500) {
      console.log('Erro servidor:', error.response.data);
    }
  }
  
  // 2. Network Error?
  else if (error.request) {
    console.log('Network Error:', error.code);
    
    // Timeout
    if (error.code === 'ECONNABORTED') {
      console.log('Requisição demorou muito');
    }
    
    // DNS
    else if (error.code === 'ENOTFOUND') {
      console.log('Servidor não encontrado');
    }
    
    // Conexão recusada
    else if (error.code === 'ECONNREFUSED') {
      console.log('Servidor offline');
    }
    
    // Genérico
    else {
      console.log('Problema de rede/conexão');
    }
  }
  
  // 3. Config Error
  else {
    console.log('Erro de configuração:', error.message);
  }
}
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Tratamento

#### Pattern 1: Retry Only Network Errors

```javascript
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    return await axios.get(url);
  } catch (error) {
    // HTTP errors - não retry
    if (error.response) {
      console.log('HTTP Error (não retry):', error.response.status);
      throw error;
    }
    
    // Network errors - retry
    if (error.request && retries > 0) {
      console.log(`Network error, retry ${4 - retries}/3 em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retries - 1, delay * 2); // Exponential backoff
    }
    
    throw error;
  }
}

// Uso
try {
  const response = await fetchWithRetry('/api/dados', 3, 1000);
  console.log(response.data);
} catch (error) {
  console.log('Falhou após retries');
}
```

#### Pattern 2: Differentiated User Messages

```javascript
function getErrorMessage(error) {
  // HTTP Errors
  if (error.response) {
    const status = error.response.status;
    
    if (status === 400) return 'Dados inválidos, verifique o formulário';
    if (status === 401) return 'Você precisa fazer login novamente';
    if (status === 403) return 'Você não tem permissão para acessar isso';
    if (status === 404) return 'Conteúdo não encontrado';
    if (status === 429) return 'Muitas tentativas, aguarde alguns minutos';
    if (status >= 500) return 'Erro no servidor, tente novamente mais tarde';
    
    return error.response.data?.message || 'Erro ao processar requisição';
  }
  
  // Network Errors
  if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return 'Requisição demorou muito, verifique sua conexão';
    }
    if (error.code === 'ENOTFOUND') {
      return 'Servidor não encontrado, verifique a URL';
    }
    if (error.code === 'ECONNREFUSED') {
      return 'Servidor offline, tente novamente mais tarde';
    }
    
    return 'Sem conexão com servidor, verifique sua internet';
  }
  
  // Config Errors
  return 'Erro inesperado, contate o suporte';
}

// Uso
try {
  await axios.post('/api/formulario', data);
  showSuccess('Formulário enviado!');
} catch (error) {
  showError(getErrorMessage(error));
}
```

#### Pattern 3: Offline Detection & Fallback

```javascript
class ApiClient {
  constructor() {
    this.isOnline = true;
    this.checkOnlineStatus();
  }
  
  async checkOnlineStatus() {
    try {
      await axios.get('/api/health', { timeout: 2000 });
      this.isOnline = true;
    } catch (error) {
      // Network error = offline
      if (error.request) {
        this.isOnline = false;
        console.log('Modo offline');
      }
    }
  }
  
  async fetch(url) {
    try {
      const response = await axios.get(url);
      this.isOnline = true;
      return response.data;
    } catch (error) {
      // HTTP error - servidor online, mas erro de aplicação
      if (error.response) {
        throw error;
      }
      
      // Network error - servidor offline
      if (error.request) {
        this.isOnline = false;
        console.log('Usando cache (offline)');
        return this.getCached(url);
      }
      
      throw error;
    }
  }
  
  getCached(url) {
    return JSON.parse(localStorage.getItem(url) || 'null');
  }
}

// Uso
const api = new ApiClient();
const usuarios = await api.fetch('/api/usuarios');
```

#### Pattern 4: Conditional Monitoring

```javascript
class ErrorMonitor {
  static track(error) {
    // HTTP Errors - erros de aplicação
    if (error.response) {
      const status = error.response.status;
      
      // 4xx - erros cliente (menos críticos)
      if (status >= 400 && status < 500) {
        analytics.track('client_error', {
          status,
          endpoint: error.config.url,
          method: error.config.method,
          data: error.response.data
        });
      }
      
      // 5xx - erros servidor (críticos)
      else if (status >= 500) {
        sentry.captureException(error, {
          level: 'error',
          tags: {
            type: 'server_error',
            status,
            endpoint: error.config.url
          }
        });
      }
    }
    
    // Network Errors - erros de infraestrutura
    else if (error.request) {
      datadog.increment('network_errors', {
        tags: [
          `code:${error.code}`,
          `endpoint:${error.config.url}`
        ]
      });
      
      // ECONNABORTED - muitos timeouts podem indicar problema de rede/servidor
      if (error.code === 'ECONNABORTED') {
        pagerduty.alert({
          message: 'Alto número de timeouts',
          severity: 'warning'
        });
      }
    }
  }
}

// Interceptor
axios.interceptors.response.use(null, error => {
  ErrorMonitor.track(error);
  return Promise.reject(error);
});
```

#### Pattern 5: Graceful Degradation

```javascript
async function fetchWithGracefulDegradation(url) {
  try {
    // Tentar requisição normal
    const response = await axios.get(url);
    return {
      data: response.data,
      source: 'live',
      fresh: true
    };
  } catch (error) {
    // HTTP 404 - recurso não existe
    if (error.response?.status === 404) {
      return {
        data: null,
        source: 'empty',
        fresh: true
      };
    }
    
    // HTTP 5xx - tentar cache
    if (error.response?.status >= 500) {
      console.log('Servidor com erro, usando cache');
      const cached = getCached(url);
      if (cached) {
        return {
          data: cached,
          source: 'cache',
          fresh: false,
          message: 'Dados podem estar desatualizados'
        };
      }
    }
    
    // Network error - usar cache ou fallback
    if (error.request) {
      console.log('Offline, usando cache');
      const cached = getCached(url);
      if (cached) {
        return {
          data: cached,
          source: 'cache',
          fresh: false,
          offline: true
        };
      }
      
      // Sem cache - fallback genérico
      return {
        data: getDefaultData(),
        source: 'fallback',
        fresh: false,
        offline: true
      };
    }
    
    throw error;
  }
}

// Uso
const result = await fetchWithGracefulDegradation('/api/usuarios');
console.log(result.data);
if (!result.fresh) {
  showWarning(result.message || 'Usando dados offline');
}
```

#### Pattern 6: Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(requestFn) {
    // OPEN - muitas falhas, não tentar
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await requestFn();
      
      // Sucesso - resetar
      this.failures = 0;
      this.state = 'CLOSED';
      
      return result;
    } catch (error) {
      // Incrementar falhas apenas para network errors
      if (error.request) {
        this.failures++;
        
        if (this.failures >= this.threshold) {
          this.state = 'OPEN';
          this.nextAttempt = Date.now() + this.timeout;
          console.log(`Circuit breaker OPEN por ${this.timeout}ms`);
        }
      }
      
      throw error;
    }
  }
}

// Uso
const breaker = new CircuitBreaker(5, 60000);

async function fetchData() {
  try {
    return await breaker.execute(() => axios.get('/api/dados'));
  } catch (error) {
    if (error.message === 'Circuit breaker is OPEN') {
      console.log('Muitas falhas, aguarde antes de tentar novamente');
      return getCachedData();
    }
    throw error;
  }
}
```

### HTTP Error vs Network Error - Comparação Detalhada

| Aspecto | HTTP Error | Network Error |
|---------|------------|---------------|
| **Servidor** | Respondeu | Não respondeu ou não alcançável |
| **error.response** | Existe (status, data, headers) | undefined |
| **error.request** | Existe | Existe |
| **error.code** | ERR_BAD_REQUEST, ERR_BAD_RESPONSE | ECONNABORTED, ERR_NETWORK, ENOTFOUND |
| **error.message** | "Request failed with status code XXX" | "Network Error", "timeout of Xms exceeded" |
| **Status code** | 4xx, 5xx | 0 ou inexistente |
| **Retry?** | Depende (404 não, 500 talvez) | Geralmente sim |
| **Cache fallback?** | Talvez (5xx sim, 4xx não) | Sim |
| **User message** | Específico ("não encontrado", "sem permissão") | Genérico ("sem conexão", "timeout") |
| **Monitoring** | Erro de aplicação | Erro de infraestrutura/rede |
| **Responsável** | Backend (servidor) | Rede, DNS, firewall, cliente |

### Casos Especiais

#### Status 0

```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  // Network error geralmente tem status 0
  if (error.request && error.request.status === 0) {
    console.log('Status 0 - network error');
  }
}
```

#### CORS Error (parece network error)

```javascript
// CORS error é tratado como network error (não HTTP error!)
try {
  await axios.get('https://api-sem-cors.com/dados');
} catch (error) {
  if (error.request && error.code === 'ERR_NETWORK') {
    // Pode ser CORS (browser bloqueia resposta)
    console.log('Possível erro CORS');
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando é HTTP Error

- Status 4xx, 5xx retornado pelo servidor
- Servidor processou requisição (mesmo que com erro)
- error.response existe
- Mensagem de erro específica do servidor (response.data)

### Quando é Network Error

- Timeout (ECONNABORTED)
- DNS falhou (ENOTFOUND)
- Servidor offline (ECONNREFUSED)
- Sem internet (ERR_NETWORK)
- CORS blocked (ERR_NETWORK)
- Requisição cancelada (ERR_CANCELED)

### Decisão de Retry

**Retry:**
- ✅ Network errors (timeout, DNS, conexão)
- ✅ HTTP 500+ (servidor temporariamente indisponível)
- ✅ HTTP 429 (rate limit - esperar retry-after)

**Não retry:**
- ❌ HTTP 400 (dados inválidos)
- ❌ HTTP 401 (não autenticado)
- ❌ HTTP 403 (sem permissão)
- ❌ HTTP 404 (não encontrado)

---

## ⚠️ Limitações e Considerações Teóricas

### CORS Parece Network Error

```javascript
// CORS error não tem response (browser bloqueia)
try {
  await axios.get('https://api-sem-cors.com/dados');
} catch (error) {
  // error.request existe, error.response não
  // Indistinguível de timeout/DNS/conexão!
  console.log(error.code); // ERR_NETWORK
}
```

**Solução:** Verificar CORS no backend.

### Status 0 Ambíguo

```javascript
// Status 0 pode significar várias coisas
if (error.request.status === 0) {
  // Network error, CORS, requisição cancelada, etc.
}
```

**Use error.code para distinção:**
```javascript
if (error.code === 'ERR_CANCELED') {
  console.log('Cancelada');
} else if (error.code === 'ECONNABORTED') {
  console.log('Timeout');
} else {
  console.log('Outro network error');
}
```

---

## 🔗 Interconexões Conceituais

### HTTP vs Network e Interceptors

**Interceptor pode transformar erros:**

```javascript
axios.interceptors.response.use(null, error => {
  // HTTP 401 - renovar token e retry
  if (error.response?.status === 401) {
    return refreshTokenAndRetry(error.config);
  }
  
  // Network error - retry automático
  if (error.request) {
    return retryRequest(error.config);
  }
  
  return Promise.reject(error);
});
```

### HTTP vs Network e validateStatus

**validateStatus afeta apenas HTTP errors:**

```javascript
try {
  await axios.get('/api/dados', {
    validateStatus: status => true // Aceitar todos status
  });
} catch (error) {
  // Network errors AINDA caem aqui
  // validateStatus NÃO afeta network errors
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Retry logic:** Implementar retries automáticos
2. **Circuit breaker:** Parar requisições após N falhas
3. **Offline detection:** Detectar quando app está offline
4. **Cache strategies:** Fallback para cache em erros

### Conceitos Avançados

- **Error classification:** Classificar erros em categorias
- **Error recovery:** Estratégias de recuperação por tipo
- **Monitoring & alerting:** Rastrear erros por tipo
- **Graceful degradation:** Degradar funcionalidade em erros

---

## 📚 Conclusão

**HTTP Error vs Network Error** é distinção **essencial para tratamento robusto** de falhas.

**Dominar a distinção significa:**
- **Identificar tipo** (error.response vs error.request)
- **Tratar diferenciadamente** (retry, fallback, user message)
- **Monitorar adequadamente** (aplicação vs infraestrutura)
- **Implementar resilience** (retry network, cache fallback)
- **Debugar eficientemente** (saber onde está o problema)

**Checklist de diagnóstico:**
- ✅ Checar `error.response` primeiro (HTTP error)
- ✅ Se undefined, checar `error.request` (network error)
- ✅ Usar `error.code` para detalhes (ECONNABORTED, ERR_NETWORK, etc.)
- ✅ Implementar retry para network errors
- ✅ User feedback específico por tipo
- ✅ Monitoring separado (HTTP vs network)

**Padrões de tratamento:**
- ✅ **HTTP 4xx:** Mensagem específica, não retry
- ✅ **HTTP 5xx:** Talvez retry, fallback para cache
- ✅ **Network error:** Retry com backoff, fallback para cache/offline
- ✅ **Timeout:** Aumentar timeout ou otimizar backend

Com **distinção clara entre HTTP e Network errors**, você cria aplicações **resilientes**, que respondem apropriadamente a diferentes tipos de falha e mantêm boa experiência de usuário mesmo em condições adversas.
