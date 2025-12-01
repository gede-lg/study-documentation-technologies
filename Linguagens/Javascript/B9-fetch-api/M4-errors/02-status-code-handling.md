# Status Code Handling: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Status code handling** é o processo de **interpretar códigos de status HTTP** (200, 404, 500, etc.) retornados em responses e **implementar lógica específica** por categoria ou código individual. Conceitualmente, status codes são **metadata semântica** que indicam **resultado da operação** (sucesso, redirecionamento, erro de cliente, erro de servidor), permitindo que aplicações **reajam apropriadamente** a cada cenário.

Status codes seguem **convenção RFC 7231**, organizados em **5 categorias** (1xx informacional, 2xx sucesso, 3xx redirecionamento, 4xx erro cliente, 5xx erro servidor). Handling robusto significa **não apenas checar response.ok**, mas **diferenciar status específicos** (401 requer re-autenticação, 404 mostra "não encontrado", 503 sugere retry).

```javascript
// Básico - apenas response.ok (200-299)
const response = await fetch('/api/usuario/123');
if (!response.ok) {
  throw new Error('Erro'); // Genérico - perde contexto
}

// Robusto - handling específico por status
const response = await fetch('/api/usuario/123');

switch (response.status) {
  case 200:
    return await response.json();
  
  case 401:
    redirectToLogin();
    throw new Error('Não autenticado');
  
  case 403:
    throw new Error('Sem permissão');
  
  case 404:
    throw new Error('Usuário não encontrado');
  
  case 500:
    throw new Error('Erro no servidor - tente novamente');
  
  default:
    throw new Error(`Status inesperado: ${response.status}`);
}
```

### Contexto Histórico e Motivação

**Evolução de Status Codes:**

1. **HTTP/0.9 (1991)**: Sem status codes - apenas conteúdo ou conexão fechada
2. **HTTP/1.0 (1996)**: Status codes introduzidos (200, 404, 500, etc.)
3. **HTTP/1.1 (1999)**: Expandido (207 Multi-Status, 409 Conflict, etc.)
4. **RFC 7231 (2014)**: Padronização moderna, semântica clara

**Motivação para Status Codes:**

HTTP precisa **comunicar resultado** além de apenas dados:

```javascript
// Sem status codes (HTTP/0.9 hipotético)
const response = await fetch(url);
// Dados ou erro? Não há como saber sem ler conteúdo

// Com status codes (HTTP/1.1+)
const response = await fetch(url);
console.log(response.status); // 200 = sucesso, 404 = não existe
// Metadata clara antes de processar body
```

### Problema Fundamental que Resolve

Status codes resolvem problemas específicos de comunicação HTTP:

**1. Resultado da Operação**: Sucesso (2xx), falha (4xx/5xx), redirecionamento (3xx)
**2. Tipo de Erro**: Cliente (4xx - corrigível) vs servidor (5xx - infraestrutura)
**3. Ação Requerida**: 401 → autenticar, 429 → esperar, 503 → retry
**4. Caching**: 200/304 indicam se usar cache
**5. Semântica REST**: POST 201 (criado), DELETE 204 (sem conteúdo)

### Importância no Ecossistema

Status code handling é **essencial para aplicações robustas**:

- **UX**: Mensagens apropriadas por status (404 vs 500)
- **Authentication**: 401/403 triggering re-login
- **Retry Logic**: Retry em 503, não em 400
- **Rate Limiting**: 429 indica throttling
- **REST Semantics**: Códigos específicos por operação CRUD

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Five Categories**: 1xx (info), 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error)
2. **Semantic Meaning**: Cada código tem significado específico RFC-defined
3. **Category Handling**: Lógica por categoria (retry 5xx, não 4xx)
4. **Code-Specific Logic**: Ações específicas (401 → login, 429 → backoff)
5. **response.ok**: Apenas 200-299 (outros requerem handling manual)

### Pilares Fundamentais

- **2xx Success**: 200 OK, 201 Created, 204 No Content
- **4xx Client Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found
- **5xx Server Errors**: 500 Internal Server Error, 503 Service Unavailable
- **Status-Specific Actions**: Login (401), retry (503), show 404 page
- **Error Body Parsing**: Ler mensagem/detalhes do servidor

### Visão Geral das Nuances

- 201 Created tem response.ok === true (sucesso)
- 204 No Content não tem body (não chamar .json())
- 304 Not Modified tem response.ok === false
- 401 vs 403: sem autenticação vs sem permissão
- 429 Too Many Requests requer Retry-After header

---

## 🧠 Fundamentos Teóricos

### Categorias de Status Codes

#### 1xx - Informational (Raro em Fetch)

**Respostas informacionais - request em progresso**.

```javascript
100 Continue
101 Switching Protocols
102 Processing (WebDAV)
```

**Raramente vistos em Fetch** - browsers abstraem automaticamente.

#### 2xx - Success

**Request processado com sucesso**.

##### 200 OK

**Sucesso padrão - body contém dados solicitados**.

```javascript
const response = await fetch('/api/usuarios');
console.log(response.status); // 200
console.log(response.ok);     // true

const usuarios = await response.json();
```

**Uso**: GET, PUT, PATCH retornando dados.

##### 201 Created

**Recurso criado com sucesso - geralmente POST**.

```javascript
const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Ana', email: 'ana@example.com' })
});

console.log(response.status); // 201
console.log(response.ok);     // true

// Location header pode conter URL do recurso criado
const location = response.headers.get('Location');
console.log(location); // /api/usuarios/123

const novoUsuario = await response.json();
console.log(novoUsuario.id); // 123
```

**Semântica REST**: POST que cria recurso deve retornar 201.

##### 204 No Content

**Sucesso sem body - comum em DELETE**.

```javascript
const response = await fetch('/api/usuarios/123', {
  method: 'DELETE'
});

console.log(response.status); // 204
console.log(response.ok);     // true

// ⚠️ Não tem body - não chamar .json()
// await response.json(); // Erro: Unexpected end of input

// Apenas confirmar sucesso
if (response.ok) {
  console.log('Usuário deletado');
}
```

**Uso**: DELETE, PUT/PATCH sem retorno.

##### Outros 2xx

```javascript
202 Accepted      // Request aceito, processamento assíncrono
206 Partial Content // Range request (download parcial)
```

#### 3xx - Redirection

**Redirecionamentos - Fetch segue automaticamente (redirect: 'follow')**.

```javascript
const response = await fetch('/api/old-endpoint'); // 301 → /api/new-endpoint

// Fetch seguiu redirect automaticamente
console.log(response.url); // https://example.com/api/new-endpoint
console.log(response.redirected); // true
console.log(response.status); // 200 (status final após redirect)
```

**Status Codes Comuns:**
- **301 Moved Permanently**: URL mudou permanentemente
- **302 Found**: Redirect temporário
- **304 Not Modified**: Cache ainda válido (não é erro, mas response.ok === false)

**⚠️ 304 Not Modified:**

```javascript
// Request com If-None-Match
const response = await fetch('/api/dados', {
  headers: {
    'If-None-Match': '"etag-abc123"'
  }
});

console.log(response.status);     // 304
console.log(response.ok);         // false (não é 2xx)
console.log(response.statusText); // Not Modified

// Usar cache local - servidor indicou que não mudou
const cachedData = getCacheLocal();
```

#### 4xx - Client Errors

**Erro no request - problema com dados/autenticação/permissão**.

##### 400 Bad Request

**Request malformado ou dados inválidos**.

```javascript
const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'invalido' }) // Sem campo obrigatório
});

console.log(response.status); // 400
console.log(response.ok);     // false

const errorData = await response.json();
console.log(errorData);
// { message: "Campo 'nome' é obrigatório", errors: { nome: "required" } }
```

**Handling**: Validar input antes de enviar, mostrar mensagens de validação.

##### 401 Unauthorized

**Sem autenticação ou token inválido**.

```javascript
const response = await fetch('/api/perfil', {
  headers: {
    'Authorization': 'Bearer token-expirado'
  }
});

console.log(response.status); // 401

// Handling - redirecionar para login
if (response.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
  throw new Error('Sessão expirada - faça login novamente');
}
```

**Semântica**: Requer autenticação (não confundir com 403).

##### 403 Forbidden

**Autenticado mas sem permissão**.

```javascript
const response = await fetch('/api/admin/usuarios', {
  headers: {
    'Authorization': 'Bearer token-usuario-comum'
  }
});

console.log(response.status); // 403

// Handling - mostrar mensagem de permissão
if (response.status === 403) {
  throw new Error('Você não tem permissão para acessar este recurso');
}
```

**401 vs 403:**
- **401**: Não autenticado (sem token ou token inválido) → login
- **403**: Autenticado mas sem permissão (role insuficiente) → mostrar erro

##### 404 Not Found

**Recurso não existe**.

```javascript
const response = await fetch('/api/usuarios/999');

console.log(response.status); // 404

if (response.status === 404) {
  throw new Error('Usuário não encontrado');
}
```

**Handling**: Mostrar página 404, sugerir alternativas.

##### 409 Conflict

**Conflito de estado - recurso já existe**.

```javascript
const response = await fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'joao@example.com' })
});

console.log(response.status); // 409

const errorData = await response.json();
console.log(errorData);
// { message: "Usuário com este email já existe" }
```

**Uso**: Unique constraint violations, concurrent updates.

##### 422 Unprocessable Entity

**Validação de negócio falhou** (formato OK, mas dados inválidos).

```javascript
const response = await fetch('/api/transferencia', {
  method: 'POST',
  body: JSON.stringify({ valor: 1000, contaOrigem: '123' })
});

console.log(response.status); // 422

const errorData = await response.json();
console.log(errorData);
// { message: "Saldo insuficiente", errors: { valor: "exceeds balance" } }
```

**400 vs 422:**
- **400**: Request malformado (JSON inválido, campo faltando)
- **422**: Request válido mas regra de negócio impede processamento

##### 429 Too Many Requests

**Rate limiting - muitos requests**.

```javascript
const response = await fetch('/api/dados');

console.log(response.status); // 429

// Retry-After header indica quando pode tentar novamente
const retryAfter = response.headers.get('Retry-After');
console.log(retryAfter); // "60" (segundos) ou data HTTP

const segundos = parseInt(retryAfter, 10);
console.log(`Aguardar ${segundos}s antes de retry`);

await new Promise(resolve => setTimeout(resolve, segundos * 1000));
// Tentar novamente
```

**Handling**: Respeitar Retry-After, implementar backoff.

#### 5xx - Server Errors

**Erro no servidor - problema de infraestrutura/bug**.

##### 500 Internal Server Error

**Erro genérico no servidor** (exception não tratada).

```javascript
const response = await fetch('/api/dados');

console.log(response.status); // 500

// Servidor pode retornar detalhes (dev) ou genérico (prod)
const errorData = await response.json().catch(() => ({}));
console.log(errorData);
// Dev: { message: "NullPointerException at...", stack: "..." }
// Prod: { message: "Internal server error" }
```

**Handling**: Retry 1-2 vezes (pode ser transient), logar erro, escalar para suporte.

##### 502 Bad Gateway

**Proxy/gateway recebeu resposta inválida de upstream**.

```javascript
// Load balancer recebeu resposta inválida de servidor backend
const response = await fetch('/api/dados');
console.log(response.status); // 502
```

**Handling**: Retry (problema de infraestrutura temporário).

##### 503 Service Unavailable

**Servidor temporariamente indisponível** (manutenção, sobrecarga).

```javascript
const response = await fetch('/api/dados');

console.log(response.status); // 503

// Retry-After pode indicar quando servidor estará disponível
const retryAfter = response.headers.get('Retry-After');
console.log(retryAfter); // "120"

// Retry após delay
await new Promise(resolve => setTimeout(resolve, 120 * 1000));
```

**Handling**: Retry com backoff, mostrar mensagem de manutenção.

##### 504 Gateway Timeout

**Proxy/gateway timeout aguardando upstream**.

```javascript
const response = await fetch('/api/dados-lentos');
console.log(response.status); // 504
```

**Handling**: Retry (operação pode ter completado), aumentar timeout.

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Status-Specific Handling

```javascript
async function fetchComStatusHandling(url, options = {}) {
  const response = await fetch(url, options);
  
  // Success (2xx)
  if (response.ok) {
    // 204 No Content - sem body
    if (response.status === 204) {
      return null;
    }
    
    // 201 Created - retornar com Location
    if (response.status === 201) {
      const location = response.headers.get('Location');
      const data = await response.json();
      return { data, location };
    }
    
    // 200 OK - padrão
    return await response.json();
  }
  
  // Client Errors (4xx)
  if (response.status >= 400 && response.status < 500) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 400:
        throw new ValidationError('Dados inválidos', errorData.errors);
      
      case 401:
        // Limpar auth e redirecionar
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new AuthError('Sessão expirada');
      
      case 403:
        throw new PermissionError('Sem permissão', errorData.message);
      
      case 404:
        throw new NotFoundError('Recurso não encontrado');
      
      case 409:
        throw new ConflictError('Recurso já existe', errorData.message);
      
      case 422:
        throw new ValidationError('Validação falhou', errorData.errors);
      
      case 429:
        const retryAfter = parseInt(response.headers.get('Retry-After'), 10) || 60;
        throw new RateLimitError(`Tente novamente em ${retryAfter}s`, retryAfter);
      
      default:
        throw new ClientError(`Erro ${response.status}`, errorData);
    }
  }
  
  // Server Errors (5xx)
  if (response.status >= 500) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 500:
        throw new ServerError('Erro interno do servidor', errorData);
      
      case 502:
        throw new ServerError('Gateway error', errorData);
      
      case 503:
        const retryAfter = parseInt(response.headers.get('Retry-After'), 10) || 120;
        throw new ServiceUnavailableError('Serviço indisponível', retryAfter);
      
      case 504:
        throw new ServerError('Gateway timeout', errorData);
      
      default:
        throw new ServerError(`Erro ${response.status}`, errorData);
    }
  }
  
  // Outros status (improvável)
  throw new Error(`Status inesperado: ${response.status}`);
}
```

### Pattern 2: Retry Strategy por Status

```javascript
async function fetchComRetryInteligente(url, options = {}) {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, options);
      
      // Success
      if (response.ok) {
        return response;
      }
      
      // Client errors - não retry (exceto 429)
      if (response.status >= 400 && response.status < 500) {
        // 429 - retry após Retry-After
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfter = parseInt(response.headers.get('Retry-After'), 10) || 60;
          console.log(`Rate limited - retry em ${retryAfter}s`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          attempt++;
          continue;
        }
        
        // Outros 4xx - não retry
        throw new Error(`Client error: ${response.status}`);
      }
      
      // Server errors (5xx) - retry com backoff
      if (response.status >= 500 && attempt < maxRetries) {
        // 503 - respeitar Retry-After se presente
        if (response.status === 503) {
          const retryAfter = parseInt(response.headers.get('Retry-After'), 10);
          const delay = retryAfter ? retryAfter * 1000 : Math.pow(2, attempt) * 1000;
          
          console.log(`Service unavailable - retry ${attempt + 1} em ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          continue;
        }
        
        // Outros 5xx - exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Server error ${response.status} - retry ${attempt + 1} em ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }
      
      // Último retry falhou
      throw new Error(`HTTP ${response.status} após ${attempt} retries`);
      
    } catch (error) {
      // Network error - retry com backoff
      if (error.name === 'TypeError' && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Network error - retry ${attempt + 1} em ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }
      
      throw error;
    }
  }
}
```

### Pattern 3: Status-Based User Messages

```javascript
function getMessageByStatus(status, errorData = {}) {
  const messages = {
    // Success
    200: 'Operação realizada com sucesso',
    201: 'Criado com sucesso',
    204: 'Removido com sucesso',
    
    // Client Errors
    400: errorData.message || 'Dados inválidos. Verifique as informações.',
    401: 'Sua sessão expirou. Faça login novamente.',
    403: 'Você não tem permissão para realizar esta ação.',
    404: 'Informação não encontrada.',
    409: errorData.message || 'Este item já existe.',
    422: errorData.message || 'Alguns campos estão incorretos.',
    429: 'Muitas requisições. Aguarde um momento.',
    
    // Server Errors
    500: 'Erro no servidor. Tente novamente em instantes.',
    502: 'Serviço temporariamente indisponível.',
    503: 'Servidor em manutenção. Tente mais tarde.',
    504: 'Servidor demorou para responder. Tente novamente.'
  };
  
  return messages[status] || `Erro inesperado (${status})`;
}

// Uso
async function fetchComMensagens(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    const errorData = response.ok ? {} : await response.json().catch(() => ({}));
    const message = getMessageByStatus(response.status, errorData);
    
    if (!response.ok) {
      // Mostrar toast/alert
      showNotification(message, 'error');
      throw new Error(message);
    }
    
    // Sucesso - mostrar mensagem se não for GET
    if (options.method && options.method !== 'GET') {
      showNotification(message, 'success');
    }
    
    return await response.json().catch(() => null);
    
  } catch (error) {
    if (error.name === 'TypeError') {
      showNotification('Verifique sua conexão com a internet', 'error');
    }
    throw error;
  }
}
```

### Pattern 4: RESTful Status Usage

```javascript
class APIClient {
  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    
    if (response.status === 200) {
      return await response.json();
    }
    
    if (response.status === 404) {
      return null; // Recurso não existe
    }
    
    throw new Error(`GET failed: ${response.status}`);
  }
  
  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.status === 201) {
      const location = response.headers.get('Location');
      const created = await response.json();
      return { ...created, location };
    }
    
    if (response.status === 409) {
      const error = await response.json();
      throw new Error(`Conflito: ${error.message}`);
    }
    
    throw new Error(`POST failed: ${response.status}`);
  }
  
  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.status === 200) {
      return await response.json();
    }
    
    if (response.status === 404) {
      throw new Error('Recurso não encontrado para atualizar');
    }
    
    throw new Error(`PUT failed: ${response.status}`);
  }
  
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE'
    });
    
    if (response.status === 204) {
      return true; // Deletado sem body
    }
    
    if (response.status === 404) {
      return false; // Já não existe
    }
    
    throw new Error(`DELETE failed: ${response.status}`);
  }
}
```

### Pattern 5: Logging por Status

```javascript
async function fetchComLog(url, options = {}) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    
    const logData = {
      url,
      method: options.method || 'GET',
      status: response.status,
      ok: response.ok,
      duration,
      timestamp: new Date().toISOString()
    };
    
    // Log por categoria
    if (response.ok) {
      console.log('✅ Success:', logData);
    } else if (response.status >= 400 && response.status < 500) {
      console.warn('⚠️  Client Error:', logData);
      
      // Log adicional para casos específicos
      if (response.status === 401) {
        console.error('🔐 Auth failure - token may be expired');
      }
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        console.warn(`⏱️  Rate limited - retry after ${retryAfter}s`);
      }
      
    } else if (response.status >= 500) {
      console.error('❌ Server Error:', logData);
      
      // Enviar para monitoring (Sentry, Datadog, etc.)
      // logToMonitoring({ ...logData, type: 'SERVER_ERROR' });
    }
    
    return response;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('💥 Network Error:', {
      url,
      method: options.method || 'GET',
      error: error.message,
      duration,
      timestamp: new Date().toISOString()
    });
    
    throw error;
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Status por Operação REST

#### GET
- **200**: Recurso encontrado
- **404**: Recurso não existe
- **304**: Cache válido (conditional request)

#### POST
- **201**: Recurso criado (retornar Location header)
- **400**: Dados inválidos
- **409**: Conflito (recurso já existe)

#### PUT/PATCH
- **200**: Atualizado com retorno
- **204**: Atualizado sem retorno
- **404**: Recurso não existe

#### DELETE
- **204**: Deletado
- **404**: Já não existe (idempotente - OK)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. No Standard Error Format**: HTTP não padroniza formato de error body (JSON, XML, plain text)
**2. Status Ambiguity**: 200 pode significar sucesso ou "operação falhou mas respondeu 200"
**3. Cached 304**: response.ok === false mas não é erro
**4. Missing Retry-After**: Nem todos servidores enviam Retry-After em 429/503

### Armadilhas Comuns

#### Armadilha 1: Assumir Error Body é JSON

```javascript
// ❌ ERRO - 500 pode retornar HTML
const response = await fetch(url);
if (!response.ok) {
  const error = await response.json(); // Pode falhar
}

// ✅ CORRETO - validar Content-Type
if (!response.ok) {
  const contentType = response.headers.get('Content-Type') || '';
  
  if (contentType.includes('application/json')) {
    const error = await response.json();
  } else {
    const text = await response.text();
    console.error('HTML error:', text.substring(0, 200));
  }
}
```

#### Armadilha 2: Não Distinguir 401 e 403

```javascript
// ❌ GENÉRICO - perde contexto
if (!response.ok) {
  throw new Error('Não autorizado');
}

// ✅ ESPECÍFICO
if (response.status === 401) {
  redirectToLogin(); // Sem autenticação
} else if (response.status === 403) {
  showPermissionError(); // Autenticado mas sem permissão
}
```

---

## 🔗 Interconexões Conceituais

### Relação com REST

Status codes são **fundamentais para semântica REST**:
- POST 201 indica criação
- DELETE 204 indica remoção sem retorno
- PUT 200 vs 204 indica se há body

### Relação com Caching

Status codes controlam cache:
- **200**: Cacheable (com headers apropriados)
- **304**: Usar cache
- **4xx/5xx**: Geralmente não cacheados

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar status codes:
1. **Custom Error Classes**: HTTPError hierarquia por status
2. **Interceptors**: Centralizar status handling
3. **Status Monitoring**: Métricas por código
4. **API Design**: Escolher status corretos ao criar APIs

---

## 📚 Conclusão

Status code handling é **essencial para aplicações robustas**.

Dominar status codes significa:
- **Interpretar semântica** de cada código (401 vs 403, 200 vs 201)
- Implementar **lógica específica** por status (retry 5xx, não 4xx)
- Fornecer **UX apropriada** (mensagens, redirects, retries)
- Respeitar **headers** (Retry-After, Location)
- Seguir **convenções REST** ao criar APIs

É a base para comunicação HTTP clara e error handling preciso.
