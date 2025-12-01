# Response Schema (data, status, headers, config)

## 🎯 Introdução e Definição

### Definição Conceitual

O **Response Schema** (esquema de resposta) é a **estrutura padronizada** do objeto retornado por requisições Axios bem-sucedidas. Conceitualmente, é um **envelope de dados** - não apenas o payload JSON da API, mas um objeto rico contendo **metadados sobre a resposta HTTP**, configuração da requisição e, claro, os dados em si.

Quando você faz `const response = await axios.get('/usuarios')`, o `response` não é diretamente o array de usuários - é um **objeto complexo** com propriedades específicas que descrevem a resposta completa: status code, headers HTTP, dados parseados, configuração usada, etc.

**Estrutura fundamental:**
```javascript
{
  data: {},        // Dados da resposta (body parseado)
  status: 200,     // HTTP status code
  statusText: 'OK', // HTTP status text
  headers: {},     // Headers da resposta
  config: {},      // Config da requisição
  request: {}      // XMLHttpRequest/HTTP request object
}
```

**Princípio central:** O response schema **separa dados de metadados**, permitindo acesso tanto ao conteúdo da resposta quanto ao contexto HTTP em que ela foi recebida.

**Por que não retornar apenas os dados?**
- **Debugging:** Verificar status code, headers, config usada
- **Conditional logic:** Decisões baseadas em status, headers (cache, pagination)
- **Logging:** Rastrear requisições com config completa
- **Error context:** Comparar response bem-sucedida com error.response

**Padrão de uso:**
```javascript
const response = await axios.get('/api/usuarios');

// Acessar dados
const usuarios = response.data; // Array de usuários

// Verificar status
console.log(response.status); // 200

// Ler headers
const contentType = response.headers['content-type']; // application/json

// Inspecionar config
console.log(response.config.url); // '/api/usuarios'
```

### Contexto Histórico e Motivação

Antes de bibliotecas como Axios, trabalhar com `XMLHttpRequest` ou mesmo `fetch` exigia manipulação manual de diferentes aspectos da resposta:

**XMLHttpRequest (pré-Axios):**

```javascript
// ❌ Verbose e fragmentado
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/usuarios');
xhr.onload = function() {
  // Dados
  const data = JSON.parse(xhr.responseText);
  
  // Status
  const status = xhr.status;
  
  // Headers (API desajeitada)
  const contentType = xhr.getResponseHeader('Content-Type');
  
  // Config? Não existe - você precisa lembrar o que enviou!
  
  console.log(data, status, contentType);
};
xhr.send();
```

**Fetch API:**

```javascript
// ❌ Promessa aninhada, parsing manual
fetch('/api/usuarios')
  .then(response => {
    // Status
    const status = response.status;
    
    // Headers
    const contentType = response.headers.get('Content-Type');
    
    // Dados - precisa chamar .json() (retorna outra Promise)
    return response.json().then(data => {
      // Dados finalmente disponíveis
      // Mas perdemos contexto de response (status, headers) aqui!
      console.log(data);
    });
  });

// Ou com async/await
const response = await fetch('/api/usuarios');
const data = await response.json(); // ← Perde referência a response!

// Solução: guardar response
const response = await fetch('/api/usuarios');
const status = response.status;
const headers = response.headers;
const data = await response.json();

// Verbose!
```

**Problemas:**
1. **Fragmentação:** Dados, status, headers espalhados, sem estrutura unificada
2. **Parsing manual:** JSON.parse() ou response.json() necessário
3. **Sem config:** Impossível saber qual config foi usada após requisição
4. **Verbose:** Código repetitivo para acessar informações básicas

**Axios resolveu com Response Schema:**

```javascript
// ✅ Objeto unificado, dados parseados automaticamente
const response = await axios.get('/api/usuarios');

console.log(response.data);       // Dados (já parseados!)
console.log(response.status);     // 200
console.log(response.statusText); // 'OK'
console.log(response.headers);    // Objeto headers
console.log(response.config);     // Config da requisição
```

**Vantagens:**
- **Unificado:** Tudo em um objeto consistente
- **Auto-parsing:** JSON parseado automaticamente em `response.data`
- **Config tracking:** `response.config` preserva requisição enviada
- **TypeScript-friendly:** Estrutura previsível para tipos
- **Debugging:** Inspecionar objeto response completo em console

### Problema Fundamental que Resolve

**Response Schema resolve acesso estruturado a todas as facetas da resposta HTTP:**

**1. Dados vs Metadados:**
```javascript
const response = await axios.get('/api/produtos');

// DADOS - conteúdo da resposta
const produtos = response.data;

// METADADOS - contexto HTTP
const sucesso = response.status === 200;
const total = response.headers['x-total-count'];
const cacheControl = response.headers['cache-control'];
```

**2. Parsing Automático:**
```javascript
// ❌ Fetch - parsing manual
const res = await fetch('/api/usuarios');
const usuarios = await res.json(); // Passo extra

// ✅ Axios - parsing automático
const response = await axios.get('/api/usuarios');
const usuarios = response.data; // Já é objeto JS!
```

**3. Config Tracking (Debugging):**
```javascript
const response = await axios.get('/api/usuarios', {
  timeout: 5000,
  headers: { 'X-Custom': 'value' }
});

// Verificar qual config foi REALMENTE usada
console.log(response.config.timeout);           // 5000
console.log(response.config.headers['X-Custom']); // 'value'
console.log(response.config.url);               // '/api/usuarios'

// Útil para debugging de interceptors que modificam config
```

**4. Pagination/Metadata Headers:**
```javascript
const response = await axios.get('/api/produtos', {
  params: { page: 1, limit: 20 }
});

const produtos = response.data;

// Headers de paginação (padrão REST)
const total = parseInt(response.headers['x-total-count']);
const paginaAtual = parseInt(response.headers['x-page']);
const totalPaginas = Math.ceil(total / 20);

console.log(`Página ${paginaAtual} de ${totalPaginas}`);
```

**5. Conditional Logic:**
```javascript
const response = await axios.get('/api/cache-example');

// Decisão baseada em status
if (response.status === 200) {
  console.log('Sucesso:', response.data);
} else if (response.status === 304) {
  console.log('Não modificado, usar cache');
}

// Decisão baseada em headers
const cacheControl = response.headers['cache-control'];
if (cacheControl.includes('no-cache')) {
  // Não cachear
} else {
  // Cachear response.data
}
```

### Importância no Ecossistema

**Response Schema é fundamental para:**

- **Debugging:** Inspecionar resposta completa (status, headers, config)
- **Pagination:** Ler metadados de paginação em headers
- **Caching:** Verificar cache-control, etag headers
- **Logging:** Rastrear requisições com config + response
- **Testing:** Validar status codes, headers, data shape
- **Interceptors:** Transformar response.data, modificar headers
- **Error handling:** Comparar response bem-sucedida com error.response

**Padrão de uso comum - Pagination:**

```javascript
async function fetchPaginatedData(page = 1) {
  const response = await axios.get('/api/items', {
    params: { page, limit: 20 }
  });
  
  return {
    items: response.data,
    total: parseInt(response.headers['x-total-count']),
    page: parseInt(response.headers['x-page']),
    hasMore: response.headers['x-has-more'] === 'true'
  };
}

const { items, total, page, hasMore } = await fetchPaginatedData(1);
```

**Padrão - Logging de requisições:**

```javascript
async function loggedRequest(url, config) {
  const start = Date.now();
  const response = await axios.get(url, config);
  const duration = Date.now() - start;
  
  console.log({
    method: response.config.method,
    url: response.config.url,
    status: response.status,
    duration: `${duration}ms`,
    size: JSON.stringify(response.data).length
  });
  
  return response;
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **response.data:** Corpo da resposta (auto-parseado)
2. **response.status:** HTTP status code (200, 404, etc.)
3. **response.statusText:** Texto do status ('OK', 'Not Found')
4. **response.headers:** Headers HTTP da resposta
5. **response.config:** Configuração da requisição
6. **response.request:** Objeto de requisição nativo (XMLHttpRequest/http)

### Pilares Fundamentais

- **Estrutura consistente:** Todas as respostas seguem mesmo schema
- **Auto-parsing:** JSON parseado automaticamente para response.data
- **Imutabilidade:** Response object não deve ser mutado
- **Rich metadata:** Status, headers, config disponíveis
- **Debugging-friendly:** Inspecionável no console

### Visão Geral das Nuances

- **response.data:** Tipo depende de responseType (json, text, blob, arraybuffer)
- **response.headers:** Case-insensitive, normalizado em lowercase
- **response.config:** Config EFETIVA (após merges e interceptors)
- **response.request:** Browser (XMLHttpRequest) vs Node.js (http.ClientRequest)
- **status vs statusText:** Código numérico vs descrição textual

---

## 🧠 Fundamentos Teóricos

### response.data

**Propriedade mais usada** - contém o **corpo da resposta parseado**.

#### Tipo de response.data

**Depende de `responseType` config:**

| responseType | response.data | Uso |
|--------------|---------------|-----|
| `'json'` (default) | Objeto/Array JS | APIs REST |
| `'text'` | String | HTML, texto plano |
| `'blob'` | Blob | Download de arquivos |
| `'arraybuffer'` | ArrayBuffer | Dados binários |
| `'document'` | Document | XML parsing |
| `'stream'` | Stream (Node.js) | Streaming data |

**Exemplo - JSON (default):**

```javascript
const response = await axios.get('/api/usuarios');

console.log(response.data);
// [
//   { id: 1, nome: 'Ana' },
//   { id: 2, nome: 'Bruno' }
// ]

// response.data é Array JavaScript (já parseado!)
response.data.forEach(user => console.log(user.nome));
```

**Exemplo - Text:**

```javascript
const response = await axios.get('/api/texto', {
  responseType: 'text'
});

console.log(response.data);
// "Este é um texto plano"

// response.data é String
console.log(typeof response.data); // 'string'
```

**Exemplo - Blob (download):**

```javascript
const response = await axios.get('/api/arquivo.pdf', {
  responseType: 'blob'
});

console.log(response.data);
// Blob { size: 52341, type: 'application/pdf' }

// response.data é Blob
const url = URL.createObjectURL(response.data);
window.open(url);
```

#### Auto-parsing de JSON

**Axios parseia JSON automaticamente:**

```javascript
// Servidor retorna:
// { "usuarios": [{"id": 1, "nome": "Ana"}] }

const response = await axios.get('/api/data');

// ❌ Fetch - precisa chamar .json()
const fetchRes = await fetch('/api/data');
const data = await fetchRes.json();

// ✅ Axios - já parseado!
console.log(response.data); // Objeto JS
console.log(response.data.usuarios[0].nome); // 'Ana'
```

**Se parsing falhar:**
```javascript
// Servidor retorna JSON inválido
try {
  const response = await axios.get('/api/invalid-json');
} catch (error) {
  console.log(error.message); // "Unexpected token..."
}
```

#### response.data Vazio

**Status 204 (No Content):**
```javascript
const response = await axios.delete('/api/usuarios/1');

console.log(response.status); // 204
console.log(response.data); // '' (string vazia)
```

**Resposta vazia:**
```javascript
const response = await axios.get('/api/endpoint-vazio');

console.log(response.data); // '' ou null (depende do servidor)
```

### response.status

**HTTP status code** da resposta (número).

#### Status Codes Comuns

| Status | Significado | Uso Axios |
|--------|-------------|-----------|
| 200 | OK | Sucesso |
| 201 | Created | POST bem-sucedido |
| 204 | No Content | DELETE bem-sucedido |
| 304 | Not Modified | Cache válido |
| 400 | Bad Request | Erro cliente (validation) |
| 401 | Unauthorized | Sem autenticação |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 500 | Internal Server Error | Erro servidor |

**Exemplo:**

```javascript
const response = await axios.get('/api/usuarios/1');

console.log(response.status); // 200

if (response.status === 200) {
  console.log('Sucesso!');
}

// Status 2xx são considerados sucesso (não lançam erro)
// Status 4xx, 5xx lançam erro (vão para catch)
```

#### validateStatus

**Por padrão, status 2xx = sucesso, outros = erro.**

**Customizar com validateStatus:**

```javascript
const response = await axios.get('/api/usuarios', {
  validateStatus: status => status < 500 // 4xx também considerado sucesso
});

console.log(response.status); // 404 (não lançou erro!)
console.log(response.data); // { message: 'Not Found' }
```

### response.statusText

**Descrição textual do status code.**

```javascript
const response = await axios.get('/api/usuarios');

console.log(response.status);     // 200
console.log(response.statusText); // 'OK'

// Outros exemplos:
// 404 → 'Not Found'
// 500 → 'Internal Server Error'
// 201 → 'Created'
```

**Raramente usado** (status numérico é mais útil).

### response.headers

**Headers HTTP da resposta** (objeto chave-valor).

#### Estrutura

```javascript
const response = await axios.get('/api/usuarios');

console.log(response.headers);
// {
//   'content-type': 'application/json; charset=utf-8',
//   'content-length': '1234',
//   'cache-control': 'no-cache',
//   'x-custom-header': 'value'
// }
```

**Características:**
- **Case-insensitive:** Normalizado em lowercase
- **String values:** Todos os valores são strings
- **Parsed:** Cookies, Content-Type já processados

#### Acessar Headers

```javascript
const response = await axios.get('/api/data');

// Case-insensitive
console.log(response.headers['content-type']);
console.log(response.headers['Content-Type']); // Mesmo resultado (lowercase)

// Headers customizados
const requestId = response.headers['x-request-id'];
const rateLimit = response.headers['x-ratelimit-remaining'];
```

#### Headers Comuns

**Content-Type:**
```javascript
const contentType = response.headers['content-type'];

if (contentType.includes('application/json')) {
  console.log('Resposta JSON');
} else if (contentType.includes('text/html')) {
  console.log('Resposta HTML');
}
```

**Pagination Headers:**
```javascript
const response = await axios.get('/api/items');

const total = parseInt(response.headers['x-total-count']);
const page = parseInt(response.headers['x-page']);
const perPage = parseInt(response.headers['x-per-page']);
```

**Cache Headers:**
```javascript
const cacheControl = response.headers['cache-control'];
const etag = response.headers['etag'];
const lastModified = response.headers['last-modified'];

console.log({ cacheControl, etag, lastModified });
```

**Rate Limiting:**
```javascript
const limit = response.headers['x-ratelimit-limit'];
const remaining = response.headers['x-ratelimit-remaining'];
const reset = response.headers['x-ratelimit-reset'];

console.log(`Requisições restantes: ${remaining}/${limit}`);
console.log(`Reset em: ${new Date(parseInt(reset) * 1000)}`);
```

#### Headers vs response.data

**Headers ≠ Dados:**
```javascript
// ❌ ERRO - confundir headers com data
const usuarios = response.headers; // ← ERRADO!

// ✅ CORRETO
const usuarios = response.data;
const contentType = response.headers['content-type'];
```

### response.config

**Configuração EFETIVA da requisição** (após merges, interceptors).

#### Estrutura

```javascript
const response = await axios.get('/api/usuarios', {
  timeout: 5000,
  headers: { 'X-Custom': 'value' }
});

console.log(response.config);
// {
//   url: '/api/usuarios',
//   method: 'get',
//   baseURL: 'https://api.example.com',
//   timeout: 5000,
//   headers: {
//     'Accept': 'application/json',
//     'X-Custom': 'value',
//     'Authorization': 'Bearer token' // ← Adicionado por interceptor!
//   },
//   params: {},
//   data: undefined,
//   // ... todas as propriedades de config
// }
```

**response.config mostra config FINAL** (após defaults, interceptors).

#### Uso - Debugging

```javascript
// Verificar qual URL foi realmente usada
console.log(response.config.url);
console.log(response.config.baseURL);

// URL completa
const fullUrl = response.config.baseURL + response.config.url;
console.log(`Requisitado: ${fullUrl}`);
```

```javascript
// Verificar headers REALMENTE enviados
console.log('Headers enviados:', response.config.headers);

// Verificar timeout usado
console.log('Timeout:', response.config.timeout);
```

#### Uso - Retry

```javascript
async function retryRequest(error) {
  if (error.response && error.response.status === 500) {
    console.log('Erro 500, tentando novamente...');
    
    // Usar response.config para retry
    return axios.request(error.config); // ← Mesma config!
  }
  throw error;
}

try {
  const response = await axios.get('/api/dados');
} catch (error) {
  return retryRequest(error);
}
```

### response.request

**Objeto de requisição nativo** (XMLHttpRequest no browser, http.ClientRequest no Node.js).

**Raramente usado diretamente.**

```javascript
const response = await axios.get('/api/usuarios');

console.log(response.request);
// Browser: XMLHttpRequest { readyState: 4, status: 200, ... }
// Node.js: ClientRequest { ... }
```

**Útil para:**
- Debugging low-level
- Acessar propriedades específicas do XMLHttpRequest/ClientRequest

**Normalmente você NÃO precisa disso** - use response.status, response.headers, etc.

---

## 🔍 Análise Conceitual Profunda

### Padrões de Uso

#### Pattern 1: Destructuring de Response

```javascript
// ✅ Extrair apenas dados
const { data } = await axios.get('/api/usuarios');
console.log(data); // Array de usuários

// ✅ Extrair múltiplas propriedades
const { data, status, headers } = await axios.get('/api/produtos');
console.log(data);
console.log(`Status: ${status}`);
console.log(`Total: ${headers['x-total-count']}`);
```

#### Pattern 2: Pagination Helper

```javascript
async function fetchPaginated(url, page = 1, limit = 20) {
  const response = await axios.get(url, {
    params: { page, limit }
  });
  
  return {
    items: response.data,
    pagination: {
      total: parseInt(response.headers['x-total-count']),
      page: parseInt(response.headers['x-page']),
      limit: parseInt(response.headers['x-per-page']),
      totalPages: Math.ceil(
        parseInt(response.headers['x-total-count']) / limit
      )
    }
  };
}

// Uso
const { items, pagination } = await fetchPaginated('/api/produtos', 1, 20);
console.log(`Página ${pagination.page} de ${pagination.totalPages}`);
console.log(items);
```

#### Pattern 3: Response Logging

```javascript
function logResponse(response) {
  console.group(`${response.config.method.toUpperCase()} ${response.config.url}`);
  console.log('Status:', response.status, response.statusText);
  console.log('Headers:', response.headers);
  console.log('Data:', response.data);
  console.log('Duration:', response.headers['x-response-time']);
  console.groupEnd();
}

const response = await axios.get('/api/usuarios');
logResponse(response);
```

#### Pattern 4: Conditional Logic by Status

```javascript
const response = await axios.get('/api/cache-data', {
  validateStatus: status => status < 500 // Aceitar 304
});

if (response.status === 200) {
  console.log('Dados atualizados:', response.data);
  saveToCache(response.data);
} else if (response.status === 304) {
  console.log('Dados não modificados, usando cache');
  return getFromCache();
}
```

#### Pattern 5: Extract Metadata

```javascript
function extractMetadata(response) {
  return {
    data: response.data,
    meta: {
      status: response.status,
      contentType: response.headers['content-type'],
      requestId: response.headers['x-request-id'],
      timestamp: response.headers['date'],
      cacheControl: response.headers['cache-control']
    }
  };
}

const result = await axios.get('/api/data');
const { data, meta } = extractMetadata(result);

console.log('Data:', data);
console.log('Metadata:', meta);
```

#### Pattern 6: Response Transformation

```javascript
// Interceptor para padronizar response
axios.interceptors.response.use(response => {
  // Envelope padrão
  return {
    success: true,
    data: response.data,
    status: response.status,
    meta: {
      requestId: response.headers['x-request-id'],
      timestamp: new Date(response.headers['date'])
    }
  };
});

// Uso
const result = await axios.get('/api/usuarios');
console.log(result);
// {
//   success: true,
//   data: [...],
//   status: 200,
//   meta: { requestId: '...', timestamp: Date }
// }
```

### response.data vs response

**Diferença crucial:**

```javascript
const response = await axios.get('/api/usuarios');

// response - OBJETO COMPLETO
console.log(response);
// {
//   data: [...],
//   status: 200,
//   headers: {...},
//   config: {...},
//   request: {...}
// }

// response.data - APENAS DADOS
console.log(response.data);
// [{ id: 1, nome: 'Ana' }, ...]
```

**Quando usar cada:**

```javascript
// ✅ Apenas dados necessários
const { data } = await axios.get('/api/usuarios');
return data; // Retornar apenas array

// ✅ Precisa de metadados
const response = await axios.get('/api/produtos');
return {
  produtos: response.data,
  total: response.headers['x-total-count'],
  status: response.status
};
```

### TypeScript e Response Schema

**Tipagem de response.data:**

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Tipar response.data
const response = await axios.get<Usuario[]>('/api/usuarios');

// response.data tipado como Usuario[]
response.data.forEach(user => {
  console.log(user.nome); // ✅ TypeScript sabe que user tem 'nome'
});
```

**Tipar response completa:**

```typescript
import { AxiosResponse } from 'axios';

const response: AxiosResponse<Usuario[]> = await axios.get('/api/usuarios');

console.log(response.status); // number
console.log(response.data);   // Usuario[]
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Acessar response.data

**Maioria dos casos** - você só precisa dos dados:

```javascript
// ✅ Apenas dados
const { data: usuarios } = await axios.get('/api/usuarios');
return usuarios;

// ✅ Processar dados
const { data } = await axios.get('/api/produtos');
const produtosAtivos = data.filter(p => p.ativo);
```

### Quando Acessar response.status

**Conditional logic baseada em status:**

```javascript
const response = await axios.get('/api/usuario/perfil', {
  validateStatus: status => status < 500
});

if (response.status === 200) {
  console.log('Perfil completo:', response.data);
} else if (response.status === 204) {
  console.log('Perfil vazio');
} else if (response.status === 304) {
  console.log('Usar cache');
}
```

### Quando Acessar response.headers

**Pagination, rate limiting, caching:**

```javascript
// Pagination
const total = response.headers['x-total-count'];

// Rate limiting
const remaining = response.headers['x-ratelimit-remaining'];
if (remaining < 10) {
  console.warn('Poucas requisições restantes!');
}

// Caching
const etag = response.headers['etag'];
localStorage.setItem('etag', etag);
```

### Quando Acessar response.config

**Debugging, retry logic:**

```javascript
// Debugging
console.log('URL usada:', response.config.url);
console.log('Headers enviados:', response.config.headers);

// Retry
axios.interceptors.response.use(null, error => {
  return axios.request(error.config); // Retry com mesma config
});
```

---

## ⚠️ Limitações e Considerações Teóricas

### response.data Depende de responseType

```javascript
// Default (JSON)
const r1 = await axios.get('/api/data');
console.log(typeof r1.data); // 'object'

// Text
const r2 = await axios.get('/api/text', { responseType: 'text' });
console.log(typeof r2.data); // 'string'

// Blob
const r3 = await axios.get('/api/file', { responseType: 'blob' });
console.log(r3.data instanceof Blob); // true
```

**TypeScript:** Tipar response.data corretamente para responseType.

### response.headers São Strings

```javascript
const total = response.headers['x-total-count'];
console.log(typeof total); // 'string' (não number!)

// ✅ Converter
const totalNumber = parseInt(total);
```

### response.config É Read-Only (não mutar)

```javascript
// ❌ NÃO faça
response.config.timeout = 10000; // Mutação

// ✅ Se precisar modificar, criar novo config
const newConfig = { ...response.config, timeout: 10000 };
```

---

## 🔗 Interconexões Conceituais

### Response Schema e Interceptors

**Interceptors acessam response object:**

```javascript
axios.interceptors.response.use(response => {
  console.log('Status:', response.status);
  console.log('Data:', response.data);
  
  // Transformar response.data
  response.data = {
    ...response.data,
    timestamp: new Date()
  };
  
  return response;
});
```

### Response Schema e Error Handling

**error.response tem mesmo schema:**

```javascript
try {
  const response = await axios.get('/api/data');
} catch (error) {
  if (error.response) {
    // error.response TEM mesmo schema!
    console.log(error.response.status);
    console.log(error.response.data);
    console.log(error.response.headers);
  }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Error Handling:** error.response, error.request, error.message
2. **validateStatus:** Customizar o que é sucesso/erro
3. **Interceptors:** Transformar response globalmente
4. **TypeScript:** Tipar response.data

### Conceitos Avançados

- **Response caching:** Cachear por etag, cache-control
- **Response streaming:** Processar response.data em chunks (Node.js)
- **Response validation:** Validar schema de response.data
- **Custom response transformers:** transformResponse config

---

## 📚 Conclusão

**Response Schema** é a **estrutura fundamental** de respostas Axios.

**Dominar response schema significa:**
- Saber acessar **dados** (response.data)
- Verificar **status** (response.status)
- Ler **metadados** (response.headers)
- Debugar **config** (response.config)
- Aplicar **padrões** (pagination, logging, caching)

**Use cada propriedade conforme necessidade:**
- ✅ **response.data** - Maioria dos casos (apenas dados)
- ✅ **response.status** - Conditional logic por status
- ✅ **response.headers** - Pagination, rate limiting, caching
- ✅ **response.config** - Debugging, retry logic
- ⚠️ **response.request** - Raramente necessário

Com **Response Schema**, Axios transforma respostas HTTP brutas em **objetos estruturados e acessíveis**, simplificando manipulação de dados e metadados.
