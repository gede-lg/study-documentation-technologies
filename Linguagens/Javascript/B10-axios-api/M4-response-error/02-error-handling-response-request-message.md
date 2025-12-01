# Error Handling (error.response, error.request, error.message)

## 🎯 Introdução e Definição

### Definição Conceitual

**Error Handling** (tratamento de erros) no Axios refere-se ao mecanismo de **captura e análise de falhas** em requisições HTTP. Conceitualmente, é o sistema que transforma **erros de rede e HTTP** em objetos estruturados contendo informações detalhadas sobre o que falhou e por quê.

Quando uma requisição falha, Axios **lança uma exceção** (Promise rejeitada) com um **objeto de erro rico** contendo três propriedades cruciais que categorizam o tipo de falha:

**Estrutura do erro:**
```javascript
{
  message: 'Request failed with status code 404',  // Descrição do erro
  response: { ... },  // Resposta HTTP (se servidor respondeu)
  request: { ... },   // Objeto de requisição (se requisição enviada)
  config: { ... },    // Config da requisição
  code: 'ERR_BAD_REQUEST' // Código do erro Axios
}
```

**Três categorias fundamentais:**

1. **error.response** (resposta HTTP recebida, mas status erro - 4xx, 5xx)
2. **error.request** (requisição enviada, mas sem resposta)
3. **error.message** (erro antes de enviar - config inválida, network down)

**Princípio de diagnóstico:**
```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  if (error.response) {
    // Servidor respondeu com erro (404, 500, etc.)
  } else if (error.request) {
    // Requisição enviada, mas sem resposta (timeout, rede)
  } else {
    // Erro ao configurar requisição
  }
}
```

**Por que três categorias?**
- **Diferentes falhas, diferentes soluções:** 404 vs timeout vs config inválida
- **Debugging:** Saber ONDE falhou (servidor, rede, código)
- **User feedback:** Mensagens específicas por tipo de erro
- **Retry logic:** Retornar apenas erros de rede, não erros 400

### Contexto Histórico e Motivação

Antes de bibliotecas como Axios, tratamento de erros HTTP era fragmentado:

**XMLHttpRequest:**

```javascript
// ❌ Erros misturados, sem estrutura
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/dados');
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    // Sucesso
    const data = JSON.parse(xhr.responseText);
  } else {
    // Erro HTTP (400, 500, etc.)
    console.log('Erro:', xhr.status, xhr.responseText);
    // Sem estrutura - precisa manualmente extrair info
  }
};
xhr.onerror = function() {
  // Erro de rede (timeout, DNS, etc.)
  console.log('Erro de rede');
  // Sem detalhes!
};
xhr.send();
```

**Fetch API:**

```javascript
// ❌ Fetch NÃO lança erro para status 4xx, 5xx!
try {
  const response = await fetch('/api/dados');
  
  if (!response.ok) { // ← Precisa checar manualmente!
    // Erro HTTP - mas NÃO foi para catch!
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
} catch (error) {
  // Apenas erros de rede chegam aqui (fetch behavior)
  console.log('Erro:', error.message);
  // Sem estrutura - erro customizado ou de rede?
}
```

**Problemas:**
1. **Sem categorização:** Impossível distinguir erro HTTP vs erro de rede
2. **Manual checking:** Fetch precisa `if (!response.ok)` para cada request
3. **Sem estrutura:** Erro é genérico, precisa extrair info manualmente
4. **Inconsistente:** xhr.onerror vs xhr.onload + status check

**Axios resolveu com error structure:**

```javascript
// ✅ Estrutura consistente, categorização automática
try {
  await axios.get('/api/dados');
} catch (error) {
  // error.response - Servidor respondeu com erro
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
    console.log('Headers:', error.response.headers);
  }
  
  // error.request - Requisição enviada, sem resposta
  else if (error.request) {
    console.log('Sem resposta do servidor');
    console.log('Request:', error.request);
  }
  
  // Erro ao configurar requisição
  else {
    console.log('Erro config:', error.message);
  }
}
```

**Vantagens:**
- **Categorização automática:** Três casos claros (response, request, message)
- **Estrutura consistente:** Sempre mesmo objeto de erro
- **Auto-throw:** Status 4xx, 5xx lançam erro automaticamente
- **Rich metadata:** response.status, response.data, config, etc.

### Problema Fundamental que Resolve

**Error Handling resolve diagnóstico e tratamento diferenciado de falhas:**

**1. Distinguir Erro HTTP vs Rede:**

```javascript
try {
  await axios.get('/api/usuarios/999');
} catch (error) {
  if (error.response?.status === 404) {
    // Erro HTTP - usuário não existe
    console.log('Usuário não encontrado');
  } else if (error.request) {
    // Erro de rede - servidor offline, timeout
    console.log('Servidor inacessível, tente novamente');
  }
}
```

**2. Extrair Detalhes de Erro do Servidor:**

```javascript
try {
  await axios.post('/api/usuarios', { email: 'invalido' });
} catch (error) {
  if (error.response?.status === 400) {
    // Servidor retornou validação de erros
    const erros = error.response.data.errors;
    erros.forEach(e => console.log(`- ${e.field}: ${e.message}`));
    // - email: Email inválido
  }
}
```

**3. Retry Condicional:**

```javascript
async function fetchWithRetry(url, retries = 3) {
  try {
    return await axios.get(url);
  } catch (error) {
    // Retry apenas erros de rede (não 404, 400, etc.)
    if (error.request && retries > 0) {
      console.log(`Tentando novamente... (${retries} restantes)`);
      await sleep(1000);
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}
```

**4. Feedback ao Usuário:**

```javascript
try {
  await axios.post('/api/login', { email, senha });
} catch (error) {
  if (error.response?.status === 401) {
    alert('Email ou senha incorretos');
  } else if (error.response?.status === 429) {
    alert('Muitas tentativas, aguarde 5 minutos');
  } else if (error.request) {
    alert('Sem conexão com servidor, verifique sua internet');
  } else {
    alert('Erro inesperado, tente novamente');
  }
}
```

**5. Logging Diferenciado:**

```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  if (error.response) {
    // Erro HTTP - log detalhado
    logger.error('HTTP Error', {
      status: error.response.status,
      data: error.response.data,
      url: error.config.url
    });
  } else if (error.request) {
    // Erro de rede - log timeout/DNS
    logger.error('Network Error', {
      url: error.config.url,
      timeout: error.config.timeout
    });
  } else {
    // Erro de código - log stack trace
    logger.error('Config Error', {
      message: error.message,
      stack: error.stack
    });
  }
}
```

### Importância no Ecossistema

**Error Handling é fundamental para:**

- **User Experience:** Mensagens de erro claras e específicas
- **Debugging:** Identificar rapidamente onde/por que falhou
- **Retry Logic:** Decidir quando retornar requisição
- **Fallbacks:** Estratégias alternativas por tipo de erro
- **Monitoring:** Rastrear erros por categoria (HTTP, rede, código)
- **Testing:** Simular diferentes tipos de erro

**Padrão de produção - Error boundary:**

```javascript
async function handleRequest(requestFn, options = {}) {
  try {
    return await requestFn();
  } catch (error) {
    // HTTP errors
    if (error.response) {
      if (options.on4xx && error.response.status >= 400 && error.response.status < 500) {
        return options.on4xx(error.response);
      }
      if (options.on5xx && error.response.status >= 500) {
        return options.on5xx(error.response);
      }
    }
    
    // Network errors
    if (error.request && options.onNetwork) {
      return options.onNetwork(error);
    }
    
    // Config errors
    if (options.onConfig) {
      return options.onConfig(error);
    }
    
    throw error;
  }
}

// Uso
await handleRequest(
  () => axios.get('/api/usuarios'),
  {
    on4xx: (response) => {
      console.log('Erro cliente:', response.data);
      return [];
    },
    on5xx: (response) => {
      console.log('Erro servidor, usando cache');
      return getCachedUsers();
    },
    onNetwork: (error) => {
      console.log('Sem conexão, modo offline');
      return getOfflineUsers();
    }
  }
);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **error.response:** Servidor respondeu com status erro (4xx, 5xx)
2. **error.request:** Requisição enviada, mas sem resposta (timeout, DNS)
3. **error.message:** Descrição textual do erro
4. **error.config:** Config da requisição que falhou
5. **error.code:** Código do erro Axios (ERR_NETWORK, ERR_BAD_REQUEST, etc.)

### Pilares Fundamentais

- **Categorização:** response vs request vs message
- **Auto-throw:** Status 4xx, 5xx lançam erro automaticamente
- **Estrutura consistente:** Sempre mesmo objeto de erro
- **Rich metadata:** status, data, headers, config
- **Debugging-friendly:** Stack trace, código, mensagem

### Visão Geral das Nuances

- **error.response.data:** Pode conter detalhes de validação do servidor
- **error.request:** XMLHttpRequest (browser) ou ClientRequest (Node.js)
- **error.code:** Códigos Axios específicos (ERR_NETWORK, ECONNABORTED, etc.)
- **validateStatus:** Customizar o que é erro
- **Interceptors:** Tratar erros globalmente

---

## 🧠 Fundamentos Teóricos

### error.response

**Existe quando servidor RESPONDEU com status de erro (4xx, 5xx).**

#### Estrutura

```javascript
try {
  await axios.get('/api/usuarios/999');
} catch (error) {
  console.log(error.response);
  // {
  //   data: { message: 'Usuário não encontrado' },
  //   status: 404,
  //   statusText: 'Not Found',
  //   headers: { 'content-type': 'application/json' },
  //   config: { url: '/api/usuarios/999', method: 'get', ... },
  //   request: XMLHttpRequest { ... }
  // }
}
```

**error.response tem MESMO schema de response bem-sucedida!**

#### Propriedades

**error.response.status:**
```javascript
try {
  await axios.post('/api/usuarios', invalidData);
} catch (error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        console.log('Dados inválidos');
        break;
      case 401:
        console.log('Não autenticado');
        break;
      case 403:
        console.log('Sem permissão');
        break;
      case 404:
        console.log('Não encontrado');
        break;
      case 500:
        console.log('Erro interno do servidor');
        break;
    }
  }
}
```

**error.response.data:**
```javascript
// Servidor retorna detalhes de validação
try {
  await axios.post('/api/usuarios', {
    email: 'invalido',
    senha: '123'
  });
} catch (error) {
  if (error.response?.status === 400) {
    console.log(error.response.data);
    // {
    //   errors: [
    //     { field: 'email', message: 'Email inválido' },
    //     { field: 'senha', message: 'Senha muito curta' }
    //   ]
    // }
    
    error.response.data.errors.forEach(err => {
      console.log(`${err.field}: ${err.message}`);
    });
  }
}
```

**error.response.headers:**
```javascript
try {
  await axios.get('/api/rate-limited');
} catch (error) {
  if (error.response?.status === 429) {
    const retryAfter = error.response.headers['retry-after'];
    console.log(`Aguardar ${retryAfter} segundos`);
  }
}
```

#### Quando error.response Existe

**Status 4xx, 5xx (por padrão):**

```javascript
// 404 - error.response existe
try {
  await axios.get('/api/usuarios/999');
} catch (error) {
  console.log(error.response.status); // 404
}

// 500 - error.response existe
try {
  await axios.get('/api/erro-interno');
} catch (error) {
  console.log(error.response.status); // 500
}

// 200 - sucesso, sem erro
const response = await axios.get('/api/usuarios');
console.log(response.status); // 200 (não lança erro)
```

**Customizar com validateStatus:**

```javascript
// Aceitar 404 como sucesso
const response = await axios.get('/api/usuarios/999', {
  validateStatus: status => status < 500
});

if (response.status === 404) {
  console.log('Usuário não existe (mas não lançou erro)');
}
```

### error.request

**Existe quando requisição FOI ENVIADA, mas NÃO houve resposta.**

#### Cenários

1. **Timeout:**
```javascript
try {
  await axios.get('/api/lenta', {
    timeout: 1000 // 1 segundo
  });
} catch (error) {
  if (error.request && error.code === 'ECONNABORTED') {
    console.log('Timeout!');
    console.log('Timeout configurado:', error.config.timeout);
  }
}
```

2. **Servidor offline/DNS:**
```javascript
try {
  await axios.get('https://servidor-inexistente.com');
} catch (error) {
  if (error.request) {
    console.log('Servidor inacessível');
    console.log('Código:', error.code); // ERR_NETWORK, ENOTFOUND, etc.
  }
}
```

3. **Problemas de rede:**
```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  if (error.request) {
    console.log('Erro de rede:', error.message);
    // "Network Error" ou "timeout of 5000ms exceeded"
  }
}
```

#### Estrutura de error.request

**Browser (XMLHttpRequest):**
```javascript
console.log(error.request);
// XMLHttpRequest {
//   readyState: 4,
//   status: 0, // ← 0 quando sem resposta
//   responseText: '',
//   ...
// }
```

**Node.js (ClientRequest):**
```javascript
console.log(error.request);
// ClientRequest {
//   method: 'GET',
//   path: '/api/dados',
//   ...
// }
```

**Raramente usado diretamente** - use `error.code` e `error.message`.

### error.message

**Descrição textual do erro.**

#### Exemplos

**Status error:**
```javascript
try {
  await axios.get('/api/usuarios/999');
} catch (error) {
  console.log(error.message);
  // "Request failed with status code 404"
}
```

**Network error:**
```javascript
try {
  await axios.get('https://servidor-offline.com');
} catch (error) {
  console.log(error.message);
  // "Network Error"
}
```

**Timeout:**
```javascript
try {
  await axios.get('/api/lenta', { timeout: 1000 });
} catch (error) {
  console.log(error.message);
  // "timeout of 1000ms exceeded"
}
```

**Config error:**
```javascript
try {
  await axios.get(); // ← Sem URL!
} catch (error) {
  console.log(error.message);
  // "URL is required"
}
```

**Uso:** Display para usuário, logging.

### error.config

**Configuração da requisição que falhou.**

```javascript
try {
  await axios.get('/api/usuarios', {
    timeout: 5000,
    headers: { 'X-Custom': 'value' }
  });
} catch (error) {
  console.log(error.config);
  // {
  //   url: '/api/usuarios',
  //   method: 'get',
  //   timeout: 5000,
  //   headers: { 'X-Custom': 'value', ... },
  //   ...
  // }
  
  // Útil para retry
  return axios.request(error.config);
}
```

### error.code

**Código específico do Axios/sistema.**

#### Códigos Comuns

| Código | Significado |
|--------|-------------|
| `ERR_BAD_REQUEST` | Status 4xx |
| `ERR_BAD_RESPONSE` | Status 5xx |
| `ECONNABORTED` | Timeout |
| `ERR_NETWORK` | Erro de rede genérico |
| `ENOTFOUND` | DNS falhou |
| `ETIMEDOUT` | Conexão timeout |

**Uso:**

```javascript
try {
  await axios.get('/api/dados', { timeout: 5000 });
} catch (error) {
  switch (error.code) {
    case 'ECONNABORTED':
      console.log('Requisição cancelada (timeout)');
      break;
    case 'ERR_NETWORK':
      console.log('Erro de rede');
      break;
    case 'ERR_BAD_REQUEST':
      console.log('Erro 4xx');
      break;
    case 'ERR_BAD_RESPONSE':
      console.log('Erro 5xx');
      break;
  }
}
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Diagnóstico

#### Pattern 1: Three-Tier Error Check

```javascript
try {
  const response = await axios.get('/api/dados');
  return response.data;
} catch (error) {
  // Tier 1: HTTP error (servidor respondeu)
  if (error.response) {
    console.error('HTTP Error:', error.response.status);
    console.error('Data:', error.response.data);
    throw new Error(`Erro ${error.response.status}: ${error.response.data.message}`);
  }
  
  // Tier 2: Network error (sem resposta)
  else if (error.request) {
    console.error('Network Error:', error.message);
    throw new Error('Servidor inacessível, verifique sua conexão');
  }
  
  // Tier 3: Config error (erro no código)
  else {
    console.error('Config Error:', error.message);
    throw new Error('Erro na configuração da requisição');
  }
}
```

#### Pattern 2: Retry com Backoff

```javascript
async function fetchWithRetry(url, retries = 3, backoff = 1000) {
  try {
    return await axios.get(url);
  } catch (error) {
    // Retry apenas erros de rede
    if (error.request && retries > 0) {
      console.log(`Retry ${4 - retries}/3 após ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Exponential backoff
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    
    // Não retry para erros HTTP
    throw error;
  }
}

// Uso
try {
  const response = await fetchWithRetry('/api/dados', 3, 1000);
  // Tentativas: 0ms → 1000ms → 2000ms → 4000ms
} catch (error) {
  console.log('Falhou após 3 retries');
}
```

#### Pattern 3: Error Response Transformer

```javascript
function transformError(error) {
  // HTTP errors
  if (error.response) {
    return {
      type: 'HTTP_ERROR',
      status: error.response.status,
      message: error.response.data?.message || error.message,
      details: error.response.data,
      url: error.config.url
    };
  }
  
  // Network errors
  if (error.request) {
    return {
      type: 'NETWORK_ERROR',
      message: error.message,
      code: error.code,
      url: error.config.url
    };
  }
  
  // Config errors
  return {
    type: 'CONFIG_ERROR',
    message: error.message,
    stack: error.stack
  };
}

// Uso
try {
  await axios.get('/api/dados');
} catch (error) {
  const transformed = transformError(error);
  logger.error(transformed);
  
  if (transformed.type === 'HTTP_ERROR' && transformed.status === 401) {
    redirectToLogin();
  }
}
```

#### Pattern 4: User-Friendly Messages

```javascript
function getUserMessage(error) {
  if (error.response) {
    const status = error.response.status;
    
    if (status === 400) return 'Dados inválidos, verifique o formulário';
    if (status === 401) return 'Você precisa fazer login';
    if (status === 403) return 'Você não tem permissão para isso';
    if (status === 404) return 'Conteúdo não encontrado';
    if (status === 429) return 'Muitas tentativas, aguarde um momento';
    if (status >= 500) return 'Erro no servidor, tente novamente mais tarde';
    
    return error.response.data?.message || 'Erro ao processar requisição';
  }
  
  if (error.request) {
    if (error.code === 'ECONNABORTED') {
      return 'Requisição demorou muito, tente novamente';
    }
    return 'Sem conexão com o servidor, verifique sua internet';
  }
  
  return 'Erro inesperado, tente novamente';
}

// Uso
try {
  await axios.post('/api/usuarios', formData);
  alert('Usuário criado com sucesso!');
} catch (error) {
  alert(getUserMessage(error));
}
```

#### Pattern 5: Global Error Handler (Interceptor)

```javascript
// Interceptor de erro global
axios.interceptors.response.use(
  response => response,
  error => {
    // HTTP errors
    if (error.response) {
      // 401 - redirecionar para login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // 429 - rate limit
      if (error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        alert(`Muitas requisições, aguarde ${retryAfter}s`);
      }
      
      // 500 - log para monitoramento
      if (error.response.status >= 500) {
        logToMonitoring({
          type: 'server_error',
          status: error.response.status,
          url: error.config.url,
          data: error.response.data
        });
      }
    }
    
    // Network errors
    if (error.request) {
      logToMonitoring({
        type: 'network_error',
        code: error.code,
        url: error.config.url
      });
    }
    
    return Promise.reject(error);
  }
);
```

#### Pattern 6: Conditional Fallback

```javascript
async function fetchUsuarios() {
  try {
    const response = await axios.get('/api/usuarios');
    return response.data;
  } catch (error) {
    // Servidor respondeu com erro
    if (error.response) {
      if (error.response.status === 404) {
        console.log('Nenhum usuário encontrado');
        return [];
      }
      
      if (error.response.status >= 500) {
        console.log('Servidor com problema, usando cache');
        return getCachedUsuarios();
      }
      
      throw error;
    }
    
    // Sem resposta (rede)
    if (error.request) {
      console.log('Sem conexão, modo offline');
      return getOfflineUsuarios();
    }
    
    throw error;
  }
}
```

### error.response.data Patterns

**Validação de formulário:**

```javascript
try {
  await axios.post('/api/usuarios', formData);
} catch (error) {
  if (error.response?.status === 400) {
    const errors = error.response.data.errors;
    
    // Formato: { errors: [{ field: 'email', message: '...' }] }
    errors.forEach(err => {
      setFieldError(err.field, err.message);
    });
  }
}
```

**Mensagem customizada do servidor:**

```javascript
try {
  await axios.delete('/api/usuarios/1');
} catch (error) {
  if (error.response?.status === 409) {
    // Servidor retorna mensagem específica
    alert(error.response.data.message);
    // "Não é possível excluir usuário com pedidos ativos"
  }
}
```

### Logging de Erros

**Produção - enviar para serviço de monitoramento:**

```javascript
function logError(error) {
  const errorData = {
    timestamp: new Date().toISOString(),
    url: error.config?.url,
    method: error.config?.method
  };
  
  if (error.response) {
    // HTTP error
    Object.assign(errorData, {
      type: 'http_error',
      status: error.response.status,
      responseData: error.response.data
    });
  } else if (error.request) {
    // Network error
    Object.assign(errorData, {
      type: 'network_error',
      code: error.code,
      message: error.message
    });
  } else {
    // Config error
    Object.assign(errorData, {
      type: 'config_error',
      message: error.message,
      stack: error.stack
    });
  }
  
  // Enviar para Sentry, Datadog, etc.
  monitoringService.captureError(errorData);
}

// Interceptor
axios.interceptors.response.use(null, error => {
  logError(error);
  return Promise.reject(error);
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Checar error.response

**Erros HTTP específicos:**
- Validação (400)
- Autenticação (401, 403)
- Not found (404)
- Rate limiting (429)
- Server errors (500+)

```javascript
if (error.response) {
  // Acessar status, data, headers
}
```

### Quando Checar error.request

**Erros de rede/conectividade:**
- Timeout
- DNS falhou
- Servidor offline
- Problemas de rede

```javascript
if (error.request) {
  // Retry, fallback para offline
}
```

### Quando Usar error.message

**Display/logging:**
- Mensagem para usuário
- Logging de erros
- Debugging

```javascript
console.log(error.message);
alert(getUserFriendlyMessage(error.message));
```

---

## ⚠️ Limitações e Considerações Teóricas

### error.response Pode Não Existir

```javascript
// ❌ ERRO - acessar sem checar
try {
  await axios.get('/api/dados');
} catch (error) {
  console.log(error.response.status); // ← Pode ser undefined!
}

// ✅ CORRETO - optional chaining
try {
  await axios.get('/api/dados');
} catch (error) {
  console.log(error.response?.status);
}
```

### error.code Nem Sempre Existe

```javascript
try {
  await axios.get('/api/dados');
} catch (error) {
  // error.code pode ser undefined em alguns casos
  if (error.code === 'ECONNABORTED') {
    // ...
  }
}
```

### error.response.data Formato Varia

```javascript
// Servidor pode retornar diferentes formatos
try {
  await axios.get('/api/dados');
} catch (error) {
  console.log(error.response.data);
  // Pode ser: string, objeto, array, etc.
  
  // ✅ Validar tipo
  if (typeof error.response.data === 'object' && error.response.data.errors) {
    // Processar errors
  }
}
```

---

## 🔗 Interconexões Conceituais

### Error Handling e Interceptors

**Interceptor de erro global:**

```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    // Tratar erros globalmente
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### Error Handling e validateStatus

**Customizar o que é erro:**

```javascript
const response = await axios.get('/api/data', {
  validateStatus: status => status < 500 // 4xx não lança erro
});

if (response.status === 404) {
  // Não entrou no catch!
}
```

### Error Handling e Cancelamento

**CancelToken cria erro específico:**

```javascript
const source = axios.CancelToken.source();

try {
  await axios.get('/api/dados', {
    cancelToken: source.token
  });
} catch (error) {
  if (axios.isCancel(error)) {
    console.log('Requisição cancelada:', error.message);
  }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **validateStatus:** Customizar erro vs sucesso
2. **Interceptors:** Tratamento global de erros
3. **Retry logic:** Implementar retries automáticos
4. **Error boundaries:** Componentes React para erros

### Conceitos Avançados

- **Error aggregation:** Coletar múltiplos erros
- **Error recovery:** Estratégias de recuperação
- **Circuit breaker:** Parar requisições após N erros
- **Graceful degradation:** Fallbacks por tipo de erro

---

## 📚 Conclusão

**Error Handling** é mecanismo **essencial para robustez** em aplicações Axios.

**Dominar error handling significa:**
- **Categorizar erros** (response vs request vs message)
- **Extrair informações** (status, data, code)
- **Tratar diferenciadamente** (retry, fallback, user message)
- **Logar adequadamente** (HTTP vs network vs config)
- **Aplicar padrões** (retry, global handler, transformation)

**Checklist de tratamento:**
- ✅ Checar `error.response` para erros HTTP
- ✅ Checar `error.request` para erros de rede
- ✅ Usar `error.message` para logging/display
- ✅ Validar existência com optional chaining (`error.response?.status`)
- ✅ Implementar retry para `error.request`
- ✅ Feedback específico ao usuário por tipo de erro

Com **Error Handling robusto**, você transforma falhas HTTP em **experiências controladas**, informando usuários adequadamente e recuperando de erros quando possível.
