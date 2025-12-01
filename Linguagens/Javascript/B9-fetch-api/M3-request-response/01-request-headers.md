# Request Headers com Fetch API: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Request headers** são **metadados chave-valor** enviados junto com requisições HTTP, fornecendo **informações contextuais** sobre a requisição, cliente, conteúdo esperado e autenticação. Conceitualmente, headers funcionam como **envelope da carta** - enquanto body contém mensagem principal, headers contêm instruções sobre como processar, de onde vem, formato esperado na resposta.

Com Fetch API, headers são configurados através da propriedade `headers` no objeto options, podendo ser **objeto literal simples** ou **instância de Headers API**. A diferença fundamental é que objeto literal é mais conciso para casos simples, enquanto Headers API oferece métodos para manipulação dinâmica (`.append()`, `.set()`, `.get()`).

```javascript
// Objeto literal (simples)
fetch(url, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  }
});

// Headers API (avançado)
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', 'Bearer token123');

fetch(url, { headers });
```

### Contexto Histórico e Motivação

**Evolução de Headers HTTP:**

1. **HTTP/0.9 (1991)**: Sem headers, apenas GET com path
2. **HTTP/1.0 (1996)**: Introduziu headers (Content-Type, User-Agent, etc.)
3. **HTTP/1.1 (1997)**: Expandiu headers (Host obrigatório, Cache-Control, etc.)
4. **HTTP/2 (2015)**: Headers comprimidos (HPACK)
5. **HTTP/3 (2022)**: QPACK compression

**Motivação para Request Headers:**

Headers resolvem problema fundamental: **HTTP é stateless** (sem estado entre requisições). Headers permitem:

- **Autenticação**: Identificar usuário sem session server-side
- **Content Negotiation**: Cliente especifica formatos aceitos (JSON, XML, HTML)
- **Caching**: Controlar cache behavior
- **CORS**: Permitir cross-origin requests
- **Custom Metadata**: Tracking, versioning, feature flags

### Problema Fundamental que Resolve

Request headers resolvem problemas específicos de comunicação HTTP:

**1. Autenticação Stateless**: Bearer tokens, API keys permitem autenticação sem cookies/session
**2. Content Negotiation**: `Accept` header indica formatos preferidos pelo cliente
**3. Conditional Requests**: `If-None-Match`, `If-Modified-Since` evitam transferências desnecessárias
**4. CORS**: `Origin` header permite servers validarem cross-origin requests
**5. Custom Logic**: Headers customizados (`X-*`) permitem metadata específica de aplicação

### Importância no Ecossistema

Headers são **pilares de APIs modernas**:

- **Authentication**: JWT via `Authorization: Bearer <token>`
- **API Versioning**: `Accept: application/vnd.company.v2+json`
- **Rate Limiting**: `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Tracking**: `X-Request-ID` para correlação de logs
- **Feature Flags**: `X-Feature-Flag: new-checkout`

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Case-Insensitive**: Headers não são case-sensitive ('Content-Type' = 'content-type')
2. **Standard vs Custom**: Standard (RFC 7231) vs custom (convenção `X-*`, mas deprecated)
3. **Request vs Response**: Alguns headers são request-only, outros response-only
4. **Headers API**: Interface moderna para manipulação dinâmica
5. **Forbidden Headers**: Browser controla certos headers (Host, Origin, Referer)

### Pilares Fundamentais

- **Content-Type**: Formato do request body
- **Authorization**: Credenciais de autenticação
- **Accept**: Formatos aceitos na response
- **User-Agent**: Identificação do cliente
- **Custom Headers**: Metadata específica de aplicação

### Visão Geral das Nuances

- Browser adiciona headers automaticamente (User-Agent, Accept, etc.)
- Alguns headers não podem ser setados via JavaScript (security)
- Headers são case-insensitive mas convenção é Kebab-Case-Capitalizado
- Custom headers modernos não usam `X-` prefix (RFC 6648)
- Headers API é iterável (for...of, .forEach())

---

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

#### Com Objeto Literal

```javascript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5...',
    'Accept': 'application/json'
  },
  body: JSON.stringify(data)
});
```

**Conceito**: Forma mais comum e concisa.

#### Com Headers API

```javascript
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', `Bearer ${token}`);
headers.append('X-Custom-Header', 'valor');

const response = await fetch(url, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(data)
});
```

**Conceito**: Útil para construção dinâmica ou quando precisa de métodos (.has(), .get()).

### Headers Standard Principais

#### 1. Content-Type

**Define formato do request body**.

```javascript
// JSON
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'João' })
});

// Form URL-encoded
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: 'nome=João&idade=30'
});

// Plain text
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: 'Conteúdo em texto puro'
});

// FormData - NÃO definir Content-Type (browser adiciona multipart/form-data)
const formData = new FormData();
formData.append('arquivo', file);

fetch(url, {
  method: 'POST',
  body: formData // Sem Content-Type!
});
```

**Valores Comuns**:
- `application/json`: JSON
- `application/x-www-form-urlencoded`: Form data
- `multipart/form-data`: File upload (com boundary)
- `text/plain`: Texto puro
- `text/html`: HTML
- `application/xml`: XML

#### 2. Authorization

**Credenciais de autenticação**.

```javascript
// Bearer Token (JWT, OAuth)
fetch(url, {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

// Basic Authentication (Base64)
const credentials = btoa('usuario:senha'); // Base64 encode
fetch(url, {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});

// API Key
fetch(url, {
  headers: {
    'Authorization': 'ApiKey sk_live_1234567890abcdef'
  }
});
```

**Padrões**:
- `Bearer <token>`: OAuth 2.0, JWT
- `Basic <credentials>`: HTTP Basic Auth (username:password em Base64)
- `ApiKey <key>`: API keys custom

#### 3. Accept

**Formatos aceitos na response**.

```javascript
// Aceitar apenas JSON
fetch(url, {
  headers: {
    'Accept': 'application/json'
  }
});

// Aceitar múltiplos formatos com preferência
fetch(url, {
  headers: {
    'Accept': 'application/json, text/html;q=0.9, */*;q=0.8'
  }
});
// q=quality factor (0-1): quanto maior, mais preferido
```

**Valores Comuns**:
- `application/json`: JSON
- `text/html`: HTML
- `application/xml`: XML
- `*/*`: Qualquer formato

#### 4. Accept-Language

**Idioma preferido**.

```javascript
fetch(url, {
  headers: {
    'Accept-Language': 'pt-BR, pt;q=0.9, en;q=0.8'
  }
});
// Prefere pt-BR, aceita pt e en com menor prioridade
```

#### 5. User-Agent

**Identificação do cliente** (browser adiciona automaticamente).

```javascript
// Browser adiciona automaticamente, mas pode ler:
console.log(navigator.userAgent);
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...

// ❌ Não pode ser setado via fetch (forbidden header)
fetch(url, {
  headers: { 'User-Agent': 'CustomAgent' } // Ignorado pelo browser
});
```

#### 6. Referer

**URL de origem** (browser adiciona automaticamente).

```javascript
// Browser adiciona automaticamente
// Indica de qual página a requisição foi feita

// Pode controlar com Referrer-Policy
fetch(url, {
  referrerPolicy: 'no-referrer' // Não enviar Referer
});
```

**Políticas**:
- `no-referrer`: Não enviar
- `origin`: Apenas origem (sem path)
- `strict-origin-when-cross-origin`: Full URL same-origin, só origin cross-origin

### Custom Headers

**Headers personalizados para metadata de aplicação**.

```javascript
// Convenção moderna: sem X- prefix
fetch(url, {
  headers: {
    'Request-ID': crypto.randomUUID(),
    'Client-Version': '1.2.3',
    'Feature-Flag': 'new-ui-enabled',
    'Tenant-ID': 'acme-corp'
  }
});

// Convenção antiga (deprecated): X- prefix
fetch(url, {
  headers: {
    'X-Request-ID': '12345',
    'X-Custom-Header': 'valor'
  }
});
```

**Casos de Uso**:
- **Tracking**: Request ID para correlação de logs
- **Versioning**: Client version para backward compatibility
- **Feature Flags**: A/B testing, gradual rollouts
- **Multi-Tenancy**: Tenant ID para SaaS applications

### Headers API

**Interface para manipulação dinâmica de headers**.

#### Criação

```javascript
// Vazio
const headers = new Headers();

// Com objeto
const headers = new Headers({
  'Content-Type': 'application/json'
});

// Com array de pares
const headers = new Headers([
  ['Content-Type', 'application/json'],
  ['Authorization', 'Bearer token']
]);

// De Headers existente (clone)
const headers2 = new Headers(headers);
```

#### Métodos

```javascript
const headers = new Headers();

// .append() - adicionar header (permite duplicatas)
headers.append('Accept', 'application/json');
headers.append('Accept', 'text/html'); // Múltiplos valores

// .set() - definir header (substitui se existir)
headers.set('Authorization', 'Bearer token123');
headers.set('Authorization', 'Bearer token456'); // Substitui

// .get() - obter valor
console.log(headers.get('Authorization')); // "Bearer token456"
console.log(headers.get('Content-Type')); // null (não existe)

// .has() - verificar existência
console.log(headers.has('Authorization')); // true
console.log(headers.has('Content-Type')); // false

// .delete() - remover header
headers.delete('Authorization');
console.log(headers.has('Authorization')); // false

// .forEach() - iterar
headers.forEach((valor, chave) => {
  console.log(`${chave}: ${valor}`);
});

// for...of - iterar (pares [chave, valor])
for (const [chave, valor] of headers) {
  console.log(`${chave}: ${valor}`);
}

// .entries(), .keys(), .values()
for (const [chave, valor] of headers.entries()) {
  console.log(`${chave}: ${valor}`);
}

for (const chave of headers.keys()) {
  console.log(chave);
}

for (const valor of headers.values()) {
  console.log(valor);
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Headers Dinâmicos Baseados em Estado

```javascript
async function fetchComHeadersDinamicos(url, options = {}) {
  const headers = new Headers();
  
  // Content-Type baseado em body
  if (options.body) {
    if (typeof options.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }
    // FormData define Content-Type automaticamente
  }
  
  // Authorization se token disponível
  const token = localStorage.getItem('authToken');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Accept baseado em preferência
  headers.set('Accept', 'application/json');
  
  // Request ID para tracking
  headers.set('Request-ID', crypto.randomUUID());
  
  // Client info
  headers.set('Client-Version', '1.0.0');
  
  // Merge com headers customizados
  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    for (const [key, value] of customHeaders) {
      headers.set(key, value);
    }
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  return response;
}

// Uso
const response = await fetchComHeadersDinamicos('/api/usuarios', {
  method: 'POST',
  body: JSON.stringify({ nome: 'João' }),
  headers: {
    'X-Custom': 'valor'
  }
});
```

### Pattern 2: API Client com Headers Padrão

```javascript
class APIClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = new Headers(defaultHeaders);
  }
  
  setAuthToken(token) {
    this.defaultHeaders.set('Authorization', `Bearer ${token}`);
  }
  
  removeAuthToken() {
    this.defaultHeaders.delete('Authorization');
  }
  
  async request(endpoint, options = {}) {
    // Merge default headers com request headers
    const headers = new Headers(this.defaultHeaders);
    
    if (options.headers) {
      const requestHeaders = new Headers(options.headers);
      for (const [key, value] of requestHeaders) {
        headers.set(key, value);
      }
    }
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
  
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }
}

// Uso
const api = new APIClient('https://api.exemplo.com', {
  'Accept': 'application/json',
  'Client-Version': '2.0.0'
});

// Login - obter token
const { token } = await api.post('/auth/login', {
  email: 'usuario@exemplo.com',
  senha: 'senha123'
});

// Setar token para próximas requisições
api.setAuthToken(token);

// Requisições autenticadas
const usuarios = await api.get('/usuarios');
const novoPost = await api.post('/posts', { titulo: 'Post', conteudo: '...' });
```

### Pattern 3: Headers para Content Negotiation

```javascript
async function buscarRecurso(url, formato = 'json') {
  const acceptHeaders = {
    json: 'application/json',
    xml: 'application/xml',
    html: 'text/html',
    csv: 'text/csv'
  };
  
  const response = await fetch(url, {
    headers: {
      'Accept': acceptHeaders[formato] || 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  // Parse baseado em formato
  switch (formato) {
    case 'json':
      return await response.json();
    case 'xml':
    case 'html':
    case 'csv':
      return await response.text();
    default:
      return await response.text();
  }
}

// Uso
const jsonData = await buscarRecurso('/api/dados', 'json');
const csvData = await buscarRecurso('/api/dados', 'csv');
```

### Pattern 4: Conditional Requests com ETags

```javascript
// Cache local com ETag
const cache = new Map();

async function fetchComCache(url) {
  const cacheEntry = cache.get(url);
  const headers = new Headers({
    'Accept': 'application/json'
  });
  
  // Se tem cache, adicionar If-None-Match
  if (cacheEntry) {
    headers.set('If-None-Match', cacheEntry.etag);
  }
  
  const response = await fetch(url, { headers });
  
  if (response.status === 304) {
    // Not Modified - usar cache
    console.log('Usando cache (304 Not Modified)');
    return cacheEntry.data;
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  const etag = response.headers.get('ETag');
  
  // Atualizar cache
  if (etag) {
    cache.set(url, { data, etag });
  }
  
  return data;
}

// Uso
const dados = await fetchComCache('/api/dados');
// Próxima chamada: se ETag não mudou, retorna 304 e usa cache
```

### Pattern 5: Multi-Tenant Headers

```javascript
// Aplicação multi-tenant
class TenantAPIClient {
  constructor(baseURL, tenantId) {
    this.baseURL = baseURL;
    this.tenantId = tenantId;
  }
  
  async request(endpoint, options = {}) {
    const headers = new Headers({
      'Tenant-ID': this.tenantId,
      'Accept': 'application/json',
      ...options.headers
    });
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
}

// Uso
const tenantAcme = new TenantAPIClient('https://api.saas.com', 'acme-corp');
const tenantXYZ = new TenantAPIClient('https://api.saas.com', 'xyz-inc');

const usuariosAcme = await tenantAcme.request('/usuarios');
const usuariosXYZ = await tenantXYZ.request('/usuarios');
// Cada request inclui Tenant-ID diferente
```

### Pattern 6: Request Correlation (Distributed Tracing)

```javascript
// Tracking de requisições distribuídas
async function fetchComTracking(url, options = {}) {
  const headers = new Headers(options.headers);
  
  // Request ID único
  const requestId = crypto.randomUUID();
  headers.set('X-Request-ID', requestId);
  
  // Trace ID (se parte de chain)
  const traceId = sessionStorage.getItem('traceId') || crypto.randomUUID();
  headers.set('X-Trace-ID', traceId);
  sessionStorage.setItem('traceId', traceId);
  
  // Timestamp
  headers.set('X-Request-Timestamp', new Date().toISOString());
  
  console.log(`[${requestId}] Request iniciado: ${url}`);
  
  const startTime = performance.now();
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  const duration = performance.now() - startTime;
  console.log(`[${requestId}] Request completado em ${duration.toFixed(2)}ms`);
  
  return response;
}
```

### Pattern 7: API Versioning

```javascript
async function fetchComVersao(url, version = 'v1') {
  const headers = new Headers();
  
  // Opção 1: Header customizado
  headers.set('API-Version', version);
  
  // Opção 2: Accept com vendor media type
  headers.set('Accept', `application/vnd.company.${version}+json`);
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return await response.json();
}

// Uso
const dadosV1 = await fetchComVersao('/api/usuarios', 'v1');
const dadosV2 = await fetchComVersao('/api/usuarios', 'v2');
```

### Pattern 8: Locale/Internationalization Headers

```javascript
async function fetchComLocale(url, locale = 'pt-BR') {
  const response = await fetch(url, {
    headers: {
      'Accept-Language': locale,
      'Content-Language': locale,
      'X-User-Locale': locale
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return await response.json();
}

// Uso - recebe resposta em idioma especificado
const mensagensPtBR = await fetchComLocale('/api/mensagens', 'pt-BR');
const mensagensEn = await fetchComLocale('/api/mensagens', 'en-US');
```

### Pattern 9: Rate Limit Info em Headers

```javascript
async function fetchComRateLimit(url) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Ler rate limit info dos response headers
  const rateLimit = {
    limit: response.headers.get('X-RateLimit-Limit'),
    remaining: response.headers.get('X-RateLimit-Remaining'),
    reset: response.headers.get('X-RateLimit-Reset')
  };
  
  console.log(`Rate Limit: ${rateLimit.remaining}/${rateLimit.limit}`);
  console.log(`Reset em: ${new Date(rateLimit.reset * 1000)}`);
  
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new Error(`Rate limit excedido. Retry após ${retryAfter}s`);
  }
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return await response.json();
}
```

---

## 🎯 Aplicabilidade e Contextos

### Headers Essenciais por Contexto

#### API REST (JSON)

```javascript
fetch('/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(usuario)
});
```

#### File Upload

```javascript
const formData = new FormData();
formData.append('arquivo', file);

fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
    // NÃO adicionar Content-Type!
  },
  body: formData
});
```

#### GraphQL

```javascript
fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: '{ users { id name } }'
  })
});
```

---

## ⚠️ Limitações e Considerações Teóricas

### Forbidden Headers

**Browser controla** (não podem ser setados via JavaScript):

- `Host`
- `Origin`
- `Referer`
- `Cookie`
- `Connection`
- `Content-Length`
- Headers começando com `Proxy-` ou `Sec-`

### CORS Restrictions

Headers customizados requerem **CORS preflight**:

```javascript
// Headers simples (sem preflight)
fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Headers customizados (requer preflight OPTIONS)
fetch(url, {
  headers: {
    'X-Custom-Header': 'valor',
    'Authorization': 'Bearer token'
  }
});
```

**Simple Headers** (sem preflight):
- `Accept`
- `Accept-Language`
- `Content-Language`
- `Content-Type` (apenas: `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`)

### Armadilhas Comuns

#### Armadilha 1: Content-Type com FormData

```javascript
// ❌ ERRO - definir Content-Type manualmente
const formData = new FormData();
formData.append('file', file);

fetch(url, {
  headers: { 'Content-Type': 'multipart/form-data' }, // ❌ Falta boundary
  body: formData
});

// ✅ CORRETO - browser adiciona automaticamente
fetch(url, {
  body: formData // Sem Content-Type header
});
```

#### Armadilha 2: Case Sensitivity

```javascript
// Headers são case-insensitive
const headers = new Headers({
  'content-type': 'application/json'
});

console.log(headers.get('Content-Type')); // "application/json" ✅
console.log(headers.get('CONTENT-TYPE')); // "application/json" ✅
```

#### Armadilha 3: Modificar Headers Forbidden

```javascript
// ❌ Tentativa ignorada silenciosamente
fetch(url, {
  headers: {
    'Host': 'custom.com', // Ignorado
    'Origin': 'https://fake.com' // Ignorado
  }
});
```

---

## 🔗 Interconexões Conceituais

### Relação com CORS

Headers customizados **acionam preflight**:
- Browser envia OPTIONS request primeiro
- Server responde com `Access-Control-Allow-Headers`
- Se aprovado, browser envia request real

### Relação com Authentication

Headers são **mecanismo primário** para autenticação stateless:
- JWT: `Authorization: Bearer <token>`
- API Keys: `Authorization: ApiKey <key>`
- Basic Auth: `Authorization: Basic <base64>`

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar request headers:
1. **Response Headers**: Análise de headers retornados
2. **CORS**: Compreender preflight e allowed headers
3. **Authentication Patterns**: JWT refresh, token rotation
4. **Interceptors**: Adicionar headers automaticamente
5. **HTTP/2 & HTTP/3**: Header compression (HPACK, QPACK)

---

## 📚 Conclusão

Request headers são **essenciais para comunicação HTTP moderna**, permitindo autenticação, content negotiation, tracking e metadata customizada.

Dominar request headers significa:
- Usar **Content-Type** correto para body
- Implementar **autenticação** via Authorization
- Configurar **content negotiation** com Accept
- Adicionar **custom headers** para tracking/versioning
- Usar **Headers API** para manipulação dinâmica

São fundamentais para aplicações que consomem APIs RESTful modernas.
