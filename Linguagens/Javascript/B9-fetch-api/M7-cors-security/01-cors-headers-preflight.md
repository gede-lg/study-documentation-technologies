# CORS Headers e Preflight: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**CORS (Cross-Origin Resource Sharing)** é um **mecanismo de segurança HTTP** implementado por **browsers** para controlar **cross-origin requests**, permitindo que **servidores especifiquem quais origens** (domínios) podem acessar seus recursos via **HTTP headers específicos**. **Preflight request** é uma **OPTIONS request automática** enviada pelo browser **antes** de certos cross-origin requests (non-simple requests) para verificar se servidor **permite** a operação, usando headers `Access-Control-*` para **negociar permissões** antes de enviar request real.

Conceitualmente, CORS resolve problema de **Same-Origin Policy** (SOP): browsers **bloqueiam** por padrão scripts de `origin A` acessarem recursos de `origin B` (segurança). CORS é **opt-in mechanism**: servidor **explicitamente permite** cross-origin access via headers. **Preflight** é **safety check**: para requests complexos (POST JSON, custom headers), browser **pergunta primeiro** se servidor permite, evitando **side effects** em servidores que não esperam cross-origin.

```javascript
// Origin A: https://app.example.com
// Origin B: https://api.example.com (diferente origin)

// Request cross-origin
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'João' })
});

// Browser envia PREFLIGHT automático:
// OPTIONS /users HTTP/1.1
// Origin: https://app.example.com
// Access-Control-Request-Method: POST
// Access-Control-Request-Headers: content-type, authorization

// Servidor responde:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Methods: POST, GET, PUT, DELETE
// Access-Control-Allow-Headers: content-type, authorization
// Access-Control-Max-Age: 86400

// Se preflight OK, browser envia request REAL:
// POST /users HTTP/1.1
// Origin: https://app.example.com
// Content-Type: application/json
// Authorization: Bearer token123
```

### Contexto Histórico e Motivação

**Evolução de Cross-Origin Security:**

1. **Early Web (1995-2005)**: Same-Origin Policy (SOP) - bloqueio total
2. **JSONP (2005)**: Workaround inseguro (script tags, sem POST)
3. **W3C Spec (2009)**: CORS introduzido (XMLHttpRequest Level 2)
4. **Modern (2014+)**: CORS universal (Fetch API, todos browsers)
5. **Fetch Standard (2015+)**: CORS integrado nativamente

**Motivação para CORS:**

SPAs modernas usam **APIs separadas** (app.com → api.com), mas SOP **bloqueava**. JSONP era workaround (apenas GET, inseguro). CORS resolve: servidor **declara explicitamente** quais origins podem acessar, browser **enforces** (client não pode bypassar).

**Motivação para Preflight:**

POST/PUT/DELETE podem ter **side effects** (criar/modificar/deletar dados). Se servidor antigo não espera cross-origin, request poderia executar **ações não intencionadas**. Preflight é **safety check**: browser pergunta primeiro, servidor responde se permite, **só então** request real é enviado.

### Problema Fundamental que Resolve

CORS e preflight resolvem problemas específicos:

**1. Same-Origin Policy Limitation**: Permitir cross-origin controlado
**2. Security**: Servidor decide quais origins permitir (não client)
**3. Side Effects Prevention**: Preflight previne requests não autorizados
**4. Backward Compatibility**: Servidores antigos protegidos (preflight falha)
**5. Granular Control**: Servidor controla methods, headers, credentials

### Importância no Ecossistema

CORS é **fundamental para arquiteturas modernas**:

- **SPAs**: Frontend em domínio separado (app.com) consome API (api.com)
- **Microservices**: Serviços em domínios diferentes comunicam
- **CDNs**: Assets servidos de domínio diferente
- **Third-party APIs**: Integração com APIs externas
- **OAuth 2.0**: Authorization flows cross-origin

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Origin**: scheme + host + port (`https://example.com:443`)
2. **Same-Origin Policy**: Browsers bloqueiam cross-origin por padrão
3. **CORS Headers**: `Access-Control-*` headers permitem cross-origin
4. **Preflight**: OPTIONS request antes de non-simple requests
5. **Simple vs Non-Simple**: Simple requests não triggeram preflight

### Pilares Fundamentais

- **Access-Control-Allow-Origin**: Quais origins podem acessar
- **Access-Control-Allow-Methods**: Quais HTTP methods permitidos
- **Access-Control-Allow-Headers**: Quais headers customizados permitidos
- **Access-Control-Allow-Credentials**: Se permite cookies/auth
- **Access-Control-Max-Age**: Cache de preflight (segundos)

### Visão Geral das Nuances

- **Origin** é scheme+host+port (https://example.com:443 ≠ http://example.com:80)
- **Simple requests** não preflight (GET, POST form-data, HEAD)
- **Non-simple requests** triggeram preflight (POST JSON, custom headers)
- **Wildcard `*`** não funciona com credentials
- **Preflight cacheable** via Access-Control-Max-Age

---

## 🧠 Fundamentos Teóricos

### Origin Definition

```javascript
// Origin = scheme + host + port

// 1. Same Origin
const origin1 = 'https://example.com:443';
const origin2 = 'https://example.com:443';
// ✅ Same Origin

// 2. Different Origins (Cross-Origin)
const origin3 = 'https://example.com:443';
const origin4 = 'http://example.com:443';
// ❌ Different scheme (https vs http)

const origin5 = 'https://example.com:443';
const origin6 = 'https://api.example.com:443';
// ❌ Different host (example.com vs api.example.com)

const origin7 = 'https://example.com:443';
const origin8 = 'https://example.com:8080';
// ❌ Different port (443 vs 8080)

// Subdomains são different origins:
// https://app.example.com ≠ https://api.example.com
```

### Simple Requests (No Preflight)

```javascript
// Simple Request: NÃO trigga preflight

// Condições:
// 1. Method: GET, HEAD, ou POST
// 2. Headers: apenas simple headers (Accept, Content-Type, etc)
// 3. Content-Type (se POST): application/x-www-form-urlencoded,
//    multipart/form-data, ou text/plain

// Exemplo 1: GET (simple)
fetch('https://api.example.com/users');
// ✅ No preflight (GET + sem custom headers)

// Exemplo 2: POST form-data (simple)
const formData = new FormData();
formData.append('name', 'João');

fetch('https://api.example.com/users', {
  method: 'POST',
  body: formData
});
// ✅ No preflight (POST + multipart/form-data)

// Exemplo 3: POST text/plain (simple)
fetch('https://api.example.com/log', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain'
  },
  body: 'Log message'
});
// ✅ No preflight (POST + text/plain)

// Browser envia request DIRETAMENTE
// Servidor responde com CORS headers:
// Access-Control-Allow-Origin: https://app.example.com
```

### Non-Simple Requests (Preflight Required)

```javascript
// Non-Simple Request: TRIGGA preflight

// Triggers:
// 1. Methods: PUT, DELETE, PATCH, etc (exceto GET/POST/HEAD)
// 2. Content-Type: application/json (não é simple)
// 3. Custom headers: Authorization, X-Custom-Header, etc

// Exemplo 1: POST JSON (non-simple)
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // ⚠️ Trigga preflight
  },
  body: JSON.stringify({ name: 'João' })
});

// Browser envia PREFLIGHT primeiro:
// OPTIONS /users HTTP/1.1
// Origin: https://app.example.com
// Access-Control-Request-Method: POST
// Access-Control-Request-Headers: content-type

// Servidor responde preflight:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Methods: POST, GET
// Access-Control-Allow-Headers: content-type

// Se preflight OK, browser envia request REAL:
// POST /users HTTP/1.1
// Origin: https://app.example.com
// Content-Type: application/json

// Exemplo 2: Custom header (non-simple)
fetch('https://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer token123' // ⚠️ Trigga preflight
  }
});

// Exemplo 3: PUT/DELETE (non-simple)
fetch('https://api.example.com/users/123', {
  method: 'DELETE' // ⚠️ Trigga preflight
});
```

### CORS Headers Básicos

```javascript
// Backend: Configurar CORS headers (Node.js/Express)

app.use((req, res, next) => {
  // 1. Access-Control-Allow-Origin
  // Quais origins podem acessar
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
  // Ou wildcard (sem credentials):
  // res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 2. Access-Control-Allow-Methods
  // Quais HTTP methods permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // 3. Access-Control-Allow-Headers
  // Quais headers customizados permitidos
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 4. Access-Control-Allow-Credentials
  // Permitir cookies/auth (opcional)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // 5. Access-Control-Max-Age
  // Cache de preflight (segundos)
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
  
  // 6. Access-Control-Expose-Headers
  // Headers expostos ao client
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
  
  // Responder preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No Content
  }
  
  next();
});

// Route normal
app.post('/users', (req, res) => {
  // CORS headers já setados pelo middleware
  res.json({ id: 1, name: 'João' });
});
```

### Preflight Flow Detalhado

```javascript
// Client: POST JSON com Authorization
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'João' })
});

// ========== STEP 1: PREFLIGHT ==========
// Browser envia OPTIONS automático:

// OPTIONS /users HTTP/1.1
// Host: api.example.com
// Origin: https://app.example.com
// Access-Control-Request-Method: POST
// Access-Control-Request-Headers: content-type, authorization

// Servidor responde:
// HTTP/1.1 204 No Content
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Methods: POST, GET, PUT, DELETE
// Access-Control-Allow-Headers: content-type, authorization
// Access-Control-Max-Age: 86400

// ========== STEP 2: ACTUAL REQUEST ==========
// Se preflight OK, browser envia request real:

// POST /users HTTP/1.1
// Host: api.example.com
// Origin: https://app.example.com
// Content-Type: application/json
// Authorization: Bearer token123
// Body: {"name":"João"}

// Servidor responde:
// HTTP/1.1 201 Created
// Access-Control-Allow-Origin: https://app.example.com
// Content-Type: application/json
// Body: {"id":1,"name":"João"}

// Client recebe response normalmente
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Dynamic Origin Validation

```javascript
// Backend: Validar origin dinamicamente

const ALLOWED_ORIGINS = [
  'https://app.example.com',
  'https://staging.example.com',
  'http://localhost:3000' // Dev
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Verificar se origin está na whitelist
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});
```

**Benefício**: Múltiplos origins permitidos (prod, staging, dev) sem wildcard.

### Pattern 2: CORS Middleware (Express)

```javascript
const cors = require('cors');

// Configuração básica
app.use(cors({
  origin: 'https://app.example.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

// Configuração dinâmica
app.use(cors({
  origin: (origin, callback) => {
    const whitelist = [
      'https://app.example.com',
      'https://staging.example.com'
    ];
    
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Per-route CORS
app.get('/public', cors(), (req, res) => {
  // CORS habilitado apenas nesta route
  res.json({ message: 'Public data' });
});

app.post('/users', cors({
  origin: 'https://app.example.com'
}), (req, res) => {
  // CORS específico para esta route
  res.json({ id: 1 });
});
```

### Pattern 3: Preflight Caching

```javascript
// Backend: Cache de preflight (24h)
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
  res.sendStatus(204);
});

// Benefit: Browser cacheia preflight por 24h
// Requests subsequentes NÃO enviam preflight (até cache expirar)

// Client: Múltiplos requests
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'João' })
});
// ⚠️ Preflight enviado (primeira vez)

fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Maria' })
});
// ✅ Preflight CACHEADO (não envia OPTIONS novamente)
```

### Pattern 4: Expose Custom Headers

```javascript
// Backend: Expor headers customizados
app.get('/users', (req, res) => {
  const users = getUsersFromDB();
  
  // Header customizado (total de items)
  res.setHeader('X-Total-Count', users.length);
  
  // ⚠️ Expor header para client
  res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
  
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
  
  res.json(users);
});

// Client: Acessar header customizado
fetch('https://api.example.com/users')
  .then(response => {
    // ✅ Header acessível (foi exposto)
    const total = response.headers.get('X-Total-Count');
    console.log('Total users:', total);
    
    return response.json();
  });

// Sem Access-Control-Expose-Headers:
// ❌ response.headers.get('X-Total-Count') retorna null
```

**Headers expostos por padrão:**
- Cache-Control
- Content-Language
- Content-Type
- Expires
- Last-Modified
- Pragma

**Custom headers** requerem `Access-Control-Expose-Headers`.

### Pattern 5: CORS Error Handling

```javascript
// Client: Detectar CORS errors
async function fetchWithCORSCheck(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    // CORS errors aparecem como TypeError
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Possível erro CORS:', error);
      console.log('Verifique:');
      console.log('1. Servidor está enviando Access-Control-Allow-Origin?');
      console.log('2. Origin está na whitelist do servidor?');
      console.log('3. Preflight está configurado (OPTIONS)?');
      
      throw new Error('CORS error - verifique configuração do servidor');
    }
    
    throw error;
  }
}

// Uso
try {
  const data = await fetchWithCORSCheck('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'João' })
  });
} catch (error) {
  console.error('Fetch error:', error.message);
}
```

### Pattern 6: Preflight-Free Optimization

```javascript
// Evitar preflight quando possível (performance)

// ❌ Trigga preflight (application/json)
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ name: 'João' })
});

// ✅ SEM preflight (text/plain)
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain' // Simple request
  },
  body: JSON.stringify({ name: 'João' })
});

// Backend processa text/plain como JSON
app.post('/users', express.text({ type: 'text/plain' }), (req, res) => {
  const data = JSON.parse(req.body); // Parse manual
  // Criar usuário...
  res.json({ id: 1, name: data.name });
});

// Trade-off:
// ✅ Performance: sem preflight (1 request ao invés de 2)
// ❌ Não-idiomático: text/plain com JSON body
```

**Quando otimizar:**
- High-traffic APIs (muitos requests/segundo)
- Mobile apps (latência crítica)

**Quando NÃO otimizar:**
- Preflight cacheado (Max-Age 24h) - overhead mínimo
- Code clarity > performance

---

## 🎯 Aplicabilidade e Contextos

### Quando Configurar CORS

**✅ SPAs com API separada**: app.com → api.com
**✅ Microservices**: Serviços em domínios diferentes
**✅ CDN Assets**: Assets servidos de CDN domain
**✅ Third-party APIs**: Permitir outros apps acessarem
**✅ Mobile Apps**: Apps web consumindo APIs

### CORS Headers Essenciais

**Mínimo:**
- Access-Control-Allow-Origin

**Recomendado:**
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers
- Access-Control-Max-Age

**Com Credentials:**
- Access-Control-Allow-Credentials: true
- Origin específico (não wildcard)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Browser Enforcement**: CORS enforced pelo browser (não servidor)
**2. Not Server Protection**: CORS não protege servidor (apenas client)
**3. Preflight Overhead**: 2 requests ao invés de 1 (mitigar com cache)
**4. Wildcard Restrictions**: `*` não funciona com credentials
**5. Legacy Browsers**: IE11 suporte limitado

### Armadilhas Comuns

#### Armadilha 1: Wildcard com Credentials

```javascript
// ❌ ERRO - browsers rejeitam
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');

// Browsers bloqueiam: wildcard incompatível com credentials

// ✅ CORRETO
res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
res.setHeader('Access-Control-Allow-Credentials', 'true');
```

#### Armadilha 2: Esquecer OPTIONS Handler

```javascript
// ❌ ERRO - preflight falha (405 Method Not Allowed)
app.post('/users', (req, res) => {
  res.json({ id: 1 });
});

// Browser envia OPTIONS, servidor responde 405

// ✅ CORRETO
app.options('/users', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(204);
});

app.post('/users', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
  res.json({ id: 1 });
});
```

#### Armadilha 3: Não Expor Custom Headers

```javascript
// Backend
app.get('/users', (req, res) => {
  res.setHeader('X-Total-Count', '100');
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');
  // ❌ FALTA: Access-Control-Expose-Headers
  res.json(users);
});

// Client
const total = response.headers.get('X-Total-Count');
console.log(total); // ❌ null (header não exposto)

// ✅ CORRETO
res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
```

---

## 🔗 Interconexões Conceituais

### Relação com Same-Origin Policy

CORS é **opt-in mechanism** para relaxar SOP (Same-Origin Policy).

### Relação com Credentials

Credentials (cookies) requerem origin **específico** (não wildcard).

### Relação com Security

CORS **não protege servidor** - apenas controla client-side access.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar CORS:
1. **mode: 'cors' vs 'no-cors'**: Request modes em Fetch API
2. **CSRF Protection**: Prevenir forged requests
3. **Security Headers**: CSP, HSTS, X-Frame-Options

---

## 📚 Conclusão

CORS e preflight são **essenciais para cross-origin communication**.

Dominar CORS significa:
- **Entender** origin (scheme+host+port)
- **Configurar** Access-Control-* headers corretamente
- **Implementar** OPTIONS handler para preflight
- **Usar** Access-Control-Max-Age para cache
- **Expor** custom headers via Access-Control-Expose-Headers

É fundamental para SPAs modernas e microservices.
