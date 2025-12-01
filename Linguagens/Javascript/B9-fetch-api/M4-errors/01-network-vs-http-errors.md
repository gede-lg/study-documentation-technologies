# Network Errors vs HTTP Errors: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Network errors** e **HTTP errors** são **duas categorias distintas de falhas** em requisições Fetch, cada uma representando **camadas diferentes de problemas**. Conceitualmente, **network errors** ocorrem na **camada de transporte/rede** (conexão falhou, DNS não resolveu, timeout), causando **Promise rejection**. **HTTP errors** ocorrem na **camada de aplicação** (servidor respondeu com status 4xx/5xx), resultando em **Promise fulfilled** com `response.ok === false`.

Esta distinção é **fundamental**: Fetch **não rejeita Promises em HTTP errors** (200-599 são respostas válidas). Apenas **network-level failures** causam rejection. Desenvolvedores devem **explicitamente checar response.ok** para detectar HTTP errors.

```javascript
// NETWORK ERROR (Promise rejeita)
try {
  const response = await fetch('https://servidor-inexistente.com/api');
  // Nunca chega aqui - Promise rejeita
} catch (error) {
  console.error('Network error:', error); // TypeError: Failed to fetch
}

// HTTP ERROR (Promise resolve, mas response.ok === false)
try {
  const response = await fetch('/api/nao-existe'); // 404 Not Found
  
  // ⚠️ Promise RESOLVEU - response existe
  console.log(response.ok);     // false
  console.log(response.status); // 404
  
  // Deve checar manualmente
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
} catch (error) {
  console.error('Erro:', error);
}
```

### Contexto Histórico e Motivação

**Evolução de Error Handling em HTTP APIs:**

1. **XMLHttpRequest (1999)**: Status code via `xhr.status`, network errors via `onerror`
2. **Fetch API (2015)**: Promise rejection apenas para network errors, HTTP errors resolvem Promise
3. **Axios/Libraries (2016+)**: Automatizam reject em HTTP errors (convenção, não padrão)

**Motivação para Design do Fetch:**

Fetch considera **qualquer resposta HTTP válida** (incluindo 404, 500) como **sucesso de comunicação**:

```javascript
// XMLHttpRequest (antigo)
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    // Sucesso
  } else {
    // HTTP error
  }
};
xhr.onerror = () => {
  // Network error
};

// Fetch (moderno) - diferencia explicitamente
fetch(url)
  .then(response => {
    // HTTP response recebida (qualquer status)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    // Network error OU HTTP error lançado manualmente
  });
```

### Problema Fundamental que Resolve

A distinção resolve problemas específicos de error handling:

**1. Clareza de Camadas**: Separar falhas de rede (infraestrutura) de erros de aplicação (lógica)
**2. Error Recovery**: Network errors podem beneficiar de retry, HTTP errors raramente
**3. User Feedback**: Network errors mostram "Sem conexão", HTTP errors mostram mensagem específica
**4. Logging**: Network errors indicam problemas de infraestrutura, HTTP errors são bugs/validação

### Importância no Ecossistema

Compreender esta distinção é **essencial para aplicações robustas**:

- **Error Recovery**: Retry em network errors, não em HTTP 400 (bad request)
- **UX**: Mensagens apropriadas ("Sem internet" vs "Usuário não encontrado")
- **Monitoring**: Métricas separadas para network vs HTTP errors
- **Debugging**: Identificar rapidamente se problema é infraestrutura ou código

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Promise Behavior**: Network errors → reject, HTTP errors → resolve
2. **response.ok**: Verdadeiro apenas para status 200-299
3. **Explicit Checking**: Desenvolvedores devem checar response.ok manualmente
4. **Error Types**: TypeError (network), Error (HTTP - manual throw)
5. **Recovery Strategies**: Diferentes abordagens para cada tipo

### Pilares Fundamentais

- **Network Errors**: Falhas de TCP/IP, DNS, TLS, timeout → Promise reject
- **HTTP Errors**: Status 4xx (cliente), 5xx (servidor) → Promise resolve
- **response.ok**: Flag booleano (true para 200-299)
- **Error Detection**: try/catch + if (!response.ok)
- **Error Handling**: Diferentes mensagens/recovery por tipo

### Visão Geral das Nuances

- Fetch não tem timeout nativo (network error via AbortController)
- CORS errors são network errors (TypeError)
- Redirects (3xx) não são errors (seguidos automaticamente)
- response.ok cobre apenas 200-299 (201, 204 são ok)
- 304 Not Modified tem response.ok === false

---

## 🧠 Fundamentos Teóricos

### Network Errors - Promise Rejection

**Network errors causam Promise rejection com TypeError**.

#### Causas Comuns

**1. Servidor Inacessível**

```javascript
try {
  await fetch('https://servidor-offline.com/api');
} catch (error) {
  console.error(error.name);    // TypeError
  console.error(error.message); // Failed to fetch
}
```

**Motivos**: Servidor desligado, firewall bloqueando, IP inexistente.

**2. DNS Failure**

```javascript
try {
  await fetch('https://dominio-inexistente-abc123.com/dados');
} catch (error) {
  // TypeError: Failed to fetch
  // DNS não conseguiu resolver hostname
}
```

**3. CORS Violation**

```javascript
// Cross-origin request sem CORS headers
try {
  await fetch('https://api-sem-cors.com/dados', {
    mode: 'cors' // Default
  });
} catch (error) {
  // TypeError: Failed to fetch
  // Browser bloqueou por CORS
}
```

**CORS errors são network errors** porque browser aborta request antes de response ser acessível.

**4. Network Disconnected**

```javascript
// Usuário offline
try {
  await fetch('/api/dados');
} catch (error) {
  // TypeError: Failed to fetch
  // Sem conectividade de rede
}
```

**Detecção de Offline:**

```javascript
if (!navigator.onLine) {
  console.warn('Sem conexão - não tentar fetch');
} else {
  try {
    await fetch(url);
  } catch (error) {
    // Ainda pode ser network error (DNS, CORS, etc.)
  }
}
```

**5. Timeout (via AbortController)**

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, {
    signal: controller.signal
  });
  clearTimeout(timeoutId);
  
} catch (error) {
  clearTimeout(timeoutId);
  
  if (error.name === 'AbortError') {
    console.error('Request timeout');
    // Tecnicamente um abort, não network error "natural"
  }
}
```

**6. SSL/TLS Errors**

```javascript
// Certificado SSL inválido/expirado
try {
  await fetch('https://certificado-invalido.com/api');
} catch (error) {
  // TypeError: Failed to fetch
  // Browser rejeitou certificado
}
```

### HTTP Errors - Promise Fulfillment

**HTTP errors (4xx, 5xx) resolvem Promise - response existe mas response.ok === false**.

#### Status Codes e response.ok

```javascript
const response = await fetch('/api/usuario/999'); // 404 Not Found

console.log(response);        // Response object (existe!)
console.log(response.ok);     // false (status 404)
console.log(response.status); // 404
console.log(response.statusText); // "Not Found"

// Deve checar manualmente
if (!response.ok) {
  throw new Error(`HTTP Error: ${response.status}`);
}
```

**response.ok === true apenas para status 200-299:**

```javascript
200 OK               → response.ok === true
201 Created          → response.ok === true
204 No Content       → response.ok === true
301 Moved Permanently → response.ok === false (redirect seguido automaticamente, mas ok é false)
304 Not Modified     → response.ok === false
400 Bad Request      → response.ok === false
401 Unauthorized     → response.ok === false
404 Not Found        → response.ok === false
500 Server Error     → response.ok === false
```

#### Categorias de HTTP Errors

**1. Client Errors (4xx) - Problema no Request**

```javascript
// 400 Bad Request - Dados inválidos
const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'invalido' }) // Email malformado
});

console.log(response.status); // 400
console.log(response.ok);     // false

const error = await response.json();
console.log(error); // { message: "Email inválido" }
```

**Outros 4xx Comuns:**
- **401 Unauthorized**: Sem autenticação ou token inválido
- **403 Forbidden**: Autenticado mas sem permissão
- **404 Not Found**: Recurso não existe
- **409 Conflict**: Conflito de estado (ex: email duplicado)
- **422 Unprocessable Entity**: Validação de negócio falhou

**2. Server Errors (5xx) - Problema no Servidor**

```javascript
// 500 Internal Server Error - Bug no servidor
const response = await fetch('/api/dados');

console.log(response.status); // 500
console.log(response.ok);     // false

// Servidor pode retornar detalhes ou HTML de erro
const contentType = response.headers.get('Content-Type');
if (contentType?.includes('application/json')) {
  const error = await response.json();
  console.log(error); // { message: "Database connection failed" }
} else {
  const html = await response.text();
  console.log('HTML de erro:', html);
}
```

**Outros 5xx Comuns:**
- **502 Bad Gateway**: Proxy/gateway recebeu resposta inválida
- **503 Service Unavailable**: Servidor temporariamente indisponível
- **504 Gateway Timeout**: Proxy/gateway timeout

### Pattern: Unified Error Handling

```javascript
async function fetchComErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // HTTP errors (4xx, 5xx)
    if (!response.ok) {
      // Tentar ler body de erro
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const contentType = response.headers.get('Content-Type') || '';
        
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text.substring(0, 200);
        }
      } catch {
        // Ignorar erro ao ler body
      }
      
      throw new Error(errorMessage);
    }
    
    return response;
    
  } catch (error) {
    // Network errors OU HTTP errors (re-thrown)
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      // Network error
      console.error('Network error - servidor inacessível ou CORS');
      throw new Error('Erro de rede - verifique sua conexão');
    }
    
    if (error.name === 'AbortError') {
      // Timeout
      console.error('Request timeout');
      throw new Error('Requisição demorou demais');
    }
    
    // Re-throw HTTP errors ou outros
    throw error;
  }
}

// Uso
try {
  const response = await fetchComErrorHandling('/api/dados');
  const data = await response.json();
  console.log('Sucesso:', data);
  
} catch (error) {
  console.error('Falha:', error.message);
  // Mostrar para usuário: error.message
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Network Error Detection

```javascript
function isNetworkError(error) {
  return (
    error instanceof TypeError &&
    error.message === 'Failed to fetch'
  );
}

async function fetchComRetryNetwork(url, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        // HTTP error - não retry
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
      
    } catch (error) {
      lastError = error;
      
      // Retry apenas em network errors
      if (isNetworkError(error)) {
        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 1000;
          console.log(`Network error - retry ${i + 1} em ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // HTTP error ou último retry - não continuar
      throw error;
    }
  }
  
  throw lastError;
}
```

### Pattern 2: Status-Specific Handling

```javascript
async function fetchComStatusHandling(url, options = {}) {
  const response = await fetch(url, options);
  
  // Sucesso (2xx)
  if (response.ok) {
    return await response.json();
  }
  
  // Client errors (4xx)
  if (response.status >= 400 && response.status < 500) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 400:
        throw new Error(`Dados inválidos: ${errorData.message}`);
      
      case 401:
        // Redirecionar para login
        window.location.href = '/login';
        throw new Error('Não autenticado');
      
      case 403:
        throw new Error('Sem permissão para este recurso');
      
      case 404:
        throw new Error('Recurso não encontrado');
      
      case 422:
        throw new Error(`Validação falhou: ${errorData.errors?.join(', ')}`);
      
      default:
        throw new Error(`Erro do cliente: ${response.status}`);
    }
  }
  
  // Server errors (5xx)
  if (response.status >= 500) {
    // Não tentar parsing - pode ser HTML
    throw new Error(`Erro no servidor (${response.status}) - tente novamente`);
  }
  
  // Outros status (improvável)
  throw new Error(`Status inesperado: ${response.status}`);
}

// Uso
try {
  const data = await fetchComStatusHandling('/api/usuario/123');
  console.log('Usuário:', data);
  
} catch (error) {
  console.error('Erro:', error.message);
  
  // Mostrar toast/alert para usuário
  mostrarErro(error.message);
}
```

### Pattern 3: Retry Strategy por Tipo

```javascript
async function fetchComRetryInteligente(url, options = {}) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // HTTP errors - retry apenas em 5xx
      if (!response.ok) {
        const isServerError = response.status >= 500;
        
        if (isServerError && attempt < maxRetries - 1) {
          attempt++;
          const delay = Math.pow(2, attempt) * 1000;
          console.log(`Server error ${response.status} - retry ${attempt} em ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Client error (4xx) ou último retry - não continuar
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      // Sucesso
      return response;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Network error ou timeout - retry
      const isRetriable = (
        error.name === 'TypeError' ||
        error.name === 'AbortError'
      );
      
      if (isRetriable && attempt < maxRetries - 1) {
        attempt++;
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`${error.name} - retry ${attempt} em ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Não retriable ou último retry
      throw error;
    }
  }
}
```

### Pattern 4: Error Logging Detalhado

```javascript
async function fetchComLogging(url, options = {}) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      // HTTP error - logar detalhes
      const logData = {
        type: 'HTTP_ERROR',
        url,
        method: options.method || 'GET',
        status: response.status,
        statusText: response.statusText,
        duration,
        timestamp: new Date().toISOString()
      };
      
      console.error('HTTP Error:', logData);
      
      // Enviar para serviço de logging (Sentry, etc.)
      // logToMonitoring(logData);
      
      throw new Error(`HTTP ${response.status}`);
    }
    
    // Sucesso - log info
    console.log(`Fetch success: ${url} (${duration}ms)`);
    return response;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      // Network error - logar detalhes
      const logData = {
        type: 'NETWORK_ERROR',
        url,
        method: options.method || 'GET',
        error: error.message,
        duration,
        timestamp: new Date().toISOString(),
        online: navigator.onLine
      };
      
      console.error('Network Error:', logData);
      // logToMonitoring(logData);
    }
    
    throw error;
  }
}
```

### Pattern 5: User-Friendly Error Messages

```javascript
function getUserFriendlyMessage(error, response) {
  // Network error
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    if (!navigator.onLine) {
      return 'Você está offline. Verifique sua conexão com a internet.';
    }
    return 'Não foi possível conectar ao servidor. Tente novamente.';
  }
  
  // Timeout
  if (error.name === 'AbortError') {
    return 'A requisição demorou demais. Tente novamente.';
  }
  
  // HTTP errors
  if (response && !response.ok) {
    const statusMessages = {
      400: 'Dados inválidos. Verifique as informações enviadas.',
      401: 'Você precisa fazer login novamente.',
      403: 'Você não tem permissão para acessar este recurso.',
      404: 'Informação não encontrada.',
      409: 'Este item já existe.',
      422: 'Alguns campos estão incorretos.',
      500: 'Erro no servidor. Tente novamente em instantes.',
      502: 'Servidor temporariamente indisponível.',
      503: 'Serviço em manutenção. Tente mais tarde.'
    };
    
    return statusMessages[response.status] || 'Ocorreu um erro. Tente novamente.';
  }
  
  // Erro genérico
  return 'Ocorreu um erro inesperado.';
}

// Uso
async function fetchComUX(url, options = {}) {
  let response;
  
  try {
    response = await fetch(url, options);
    
    if (!response.ok) {
      const message = getUserFriendlyMessage(null, response);
      throw new Error(message);
    }
    
    return await response.json();
    
  } catch (error) {
    const message = getUserFriendlyMessage(error, response);
    
    // Mostrar para usuário
    alert(message);
    
    throw error;
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Retry

**✅ Network Errors**: Retry com backoff (transient)
**✅ 5xx Errors**: Retry 1-2 vezes (servidor temporariamente indisponível)
**❌ 4xx Errors**: Não retry (problema no request, não vai resolver)

### Error Recovery Strategies

#### Network Errors

- Mostrar "Sem conexão"
- Retry automático
- Modo offline (usar cache)

#### HTTP 4xx

- Mostrar mensagem específica
- Validar input antes de enviar
- Redirecionar para login (401)

#### HTTP 5xx

- Retry limitado
- Mostrar "Tente novamente"
- Escalar para suporte se persistir

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. CORS Opacity**: CORS errors parecem network errors genéricos
**2. No Timeout**: Fetch não tem timeout nativo (usar AbortController)
**3. response.ok Simplicity**: Apenas 200-299 (304 é false)
**4. Error Body**: Ler error body consome stream (clonar se necessário)

### Armadilhas Comuns

#### Armadilha 1: Assumir Rejection em HTTP Errors

```javascript
// ❌ ERRO - 404 não causa catch
fetch('/usuario/999') // 404
  .then(response => response.json())
  .catch(error => {
    console.log('Nunca chega aqui'); // 404 não rejeita Promise
  });

// ✅ CORRETO - checar response.ok
fetch('/usuario/999')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.log('Agora captura HTTP errors');
  });
```

#### Armadilha 2: Retry em 4xx

```javascript
// ❌ ERRO - retry infinito em 400
async function fetchBad(url) {
  while (true) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      return response;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
      // Retry mesmo em 400 Bad Request (nunca vai resolver)
    }
  }
}

// ✅ CORRETO - não retry em 4xx
async function fetchGood(url) {
  const response = await fetch(url);
  
  if (response.status >= 400 && response.status < 500) {
    throw new Error('Client error - não retry');
  }
  
  // Retry apenas network ou 5xx
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Promises

Network errors → **Promise rejection**
HTTP errors → **Promise fulfillment** (deve checar response.ok)

### Relação com HTTP Protocol

Fetch respeita semântica HTTP: **qualquer resposta válida resolve Promise**.

### Relação com Error Handling

Dois níveis de checking:
1. **try/catch**: Captura network errors
2. **if (!response.ok)**: Detecta HTTP errors

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar network vs HTTP errors:
1. **Status Code Handling**: Tratamento específico por código
2. **Custom Error Classes**: HTTPError, NetworkError classes
3. **Error Monitoring**: Sentry, logging centralizado
4. **Resilience Patterns**: Circuit breaker, bulkhead

---

## 📚 Conclusão

Network errors e HTTP errors são **categorias fundamentalmente diferentes**.

Dominar a distinção significa:
- Entender que **Fetch não rejeita em HTTP errors**
- Sempre **checar response.ok** explicitamente
- Aplicar **retry strategies apropriadas** (network/5xx sim, 4xx não)
- Fornecer **mensagens user-friendly** específicas por tipo
- **Logar errors** com contexto suficiente para debugging

É a base para error handling robusto em aplicações Fetch.
