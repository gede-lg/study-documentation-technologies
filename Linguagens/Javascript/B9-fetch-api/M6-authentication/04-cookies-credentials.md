# Cookies com Credentials: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Cookies** são **pequenos arquivos de texto** armazenados no **browser** pelo servidor via **Set-Cookie header**, enviados **automaticamente** em requests subsequentes ao mesmo domínio via **Cookie header**. **Credentials** no contexto de Fetch API refere-se à **credentials option** (`'include'`, `'same-origin'`, `'omit'`) que controla se **cookies**, **authorization headers** e **TLS client certificates** são enviados/recebidos em **cross-origin requests**, sendo essencial para **autenticação baseada em cookies** em arquiteturas **SPA + API separadas**.

Conceitualmente, cookies resolvem problema de **stateful authentication**: servidor **seta cookie** após login, browser **reenvia automaticamente** em requests, servidor **identifica usuário** sem cliente precisar gerenciar tokens manualmente. **credentials: 'include'** é necessário quando **frontend e backend estão em domínios diferentes** (e.g., app.com chama api.com), pois **default behavior** é **não enviar cookies cross-origin** (security).

```javascript
// Backend seta cookie após login
app.post('/auth/login', (req, res) => {
  // Validar credenciais...
  
  // Setar cookie
  res.cookie('sessionId', 'abc123', {
    httpOnly: true,     // JS não acessa (proteção XSS)
    secure: true,       // Apenas HTTPS
    sameSite: 'strict', // Proteção CSRF
    maxAge: 24 * 60 * 60 * 1000 // 24h
  });
  
  res.json({ message: 'Logged in' });
});

// Frontend login
await fetch('https://api.example.com/auth/login', {
  method: 'POST',
  credentials: 'include', // Enviar/receber cookies cross-origin
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

// Request autenticado (cookie enviado automaticamente)
const response = await fetch('https://api.example.com/users', {
  credentials: 'include' // Cookie enviado no request
});

// Backend middleware lê cookie
app.get('/users', (req, res) => {
  const sessionId = req.cookies.sessionId; // Cookie recebido
  // Validar sessão...
});
```

### Contexto Histórico e Motivação

**Evolução de Cookies:**

1. **Netscape (1994)**: Cookies inventados para e-commerce (shopping cart)
2. **RFC 2109 (1997)**: Primeira especificação de cookies
3. **RFC 2965 (2000)**: Cookie2 (nunca adotado)
4. **RFC 6265 (2011)**: Especificação moderna (ainda vigente)
5. **SameSite (2016)**: Atributo para proteção CSRF
6. **Modern (2020+)**: Partitioned cookies, CHIPS (cookie isolation)

**Motivação para Cookies:**

HTTP é **stateless** (cada request independente), mas aplicações precisam **manter estado** (usuário logado, carrinho de compras). Cookies resolvem: servidor **envia estado** via Set-Cookie, browser **armazena**, e **reenvia automaticamente** em requests subsequentes. Alternativas (hidden fields, URL parameters) eram **inseguras** ou **inconvenientes**.

**Motivação para credentials option:**

SPAs modernas usam **domínios separados** (app.com para frontend, api.com para backend). CORS (Cross-Origin Resource Sharing) **não envia cookies por default** em cross-origin requests (security). `credentials: 'include'` permite **opt-in** para enviar cookies, com servidor **explicitamente permitindo** via `Access-Control-Allow-Credentials: true`.

### Problema Fundamental que Resolve

Cookies com credentials resolvem problemas específicos:

**1. Automatic Transmission**: Browser envia cookies automaticamente (sem código manual)
**2. Stateful Authentication**: Servidor mantém sessão (session ID em cookie)
**3. httpOnly Security**: Cookies não acessíveis por JS (proteção XSS)
**4. Cross-Origin Auth**: credentials: 'include' permite auth cross-domain
**5. SameSite CSRF Protection**: SameSite atributo previne CSRF attacks

### Importância no Ecossistema

Cookies com credentials são **fundamentais para arquiteturas modernas**:

- **SPA + API**: Frontend em domínio separado usa cookies para auth
- **SSR (Server-Side Rendering)**: Next.js, Nuxt usam cookies para auth
- **Session-based Auth**: Alternativa a JWT (stateful no servidor)
- **Third-party APIs**: Cookies para autenticação persistente
- **GDPR Compliance**: Cookies requerem consent (cookie banners)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Set-Cookie Header**: Servidor seta cookies (`Set-Cookie: name=value`)
2. **Cookie Header**: Browser envia cookies (`Cookie: name=value`)
3. **credentials option**: `'include'`, `'same-origin'`, `'omit'`
4. **CORS**: Servidor deve permitir credentials (`Access-Control-Allow-Credentials: true`)
5. **Security Attributes**: httpOnly, Secure, SameSite

### Pilares Fundamentais

- **httpOnly**: Cookie inacessível por JavaScript (proteção XSS)
- **Secure**: Cookie apenas em HTTPS (proteção man-in-the-middle)
- **SameSite**: `Strict`, `Lax`, `None` (proteção CSRF)
- **credentials: 'include'**: Enviar cookies cross-origin
- **Access-Control-Allow-Credentials**: Servidor permite cookies CORS

### Visão Geral das Nuances

- **Default**: Fetch NÃO envia cookies cross-origin (deve usar credentials: 'include')
- **Same-origin**: Cookies enviados automaticamente (sem credentials)
- **SameSite=Strict**: Cookies não enviados em cross-site navigation
- **SameSite=Lax**: Cookies enviados em top-level navigation (GET)
- **SameSite=None**: Requer Secure (HTTPS obrigatório)

---

## 🧠 Fundamentos Teóricos

### credentials Options

```javascript
// 1. 'omit' - NUNCA enviar cookies
fetch('https://api.example.com/public', {
  credentials: 'omit'
});
// Nenhum cookie enviado, mesmo same-origin

// 2. 'same-origin' (DEFAULT) - Enviar apenas same-origin
fetch('https://api.example.com/data', {
  credentials: 'same-origin'
});
// Cookies enviados se frontend também em api.example.com
// Não enviados se frontend em app.example.com (cross-origin)

// 3. 'include' - SEMPRE enviar cookies
fetch('https://api.example.com/data', {
  credentials: 'include'
});
// Cookies enviados mesmo cross-origin
// Servidor DEVE responder: Access-Control-Allow-Credentials: true
```

### Backend: Setar Cookies

```javascript
// Node.js/Express
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// Login: setar cookie
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validar credenciais
  const user = await validateUser(username, password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Criar sessão
  const sessionId = generateSessionId();
  await saveSession(sessionId, user.id);
  
  // Setar cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,     // Proteção XSS
    secure: true,       // Apenas HTTPS
    sameSite: 'strict', // Proteção CSRF
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  });
  
  res.json({ message: 'Logged in successfully' });
});

// Middleware: validar sessão
async function authenticateSession(req, res, next) {
  const sessionId = req.cookies.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const session = await getSession(sessionId);
  
  if (!session || session.expired) {
    return res.status(401).json({ error: 'Session invalid' });
  }
  
  req.userId = session.userId;
  next();
}

// Protected route
app.get('/users', authenticateSession, async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// Logout: limpar cookie
app.post('/auth/logout', async (req, res) => {
  const sessionId = req.cookies.sessionId;
  
  if (sessionId) {
    await deleteSession(sessionId);
  }
  
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out' });
});
```

### Frontend: Login com Cookies

```javascript
async function login(username, password) {
  const response = await fetch('https://api.example.com/auth/login', {
    method: 'POST',
    credentials: 'include', // ⚠️ Essencial para receber cookie
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  // Cookie setado automaticamente pelo browser
  // Não precisa armazenar manualmente (diferente de tokens)
  
  return await response.json();
}

// Request autenticado
async function fetchUsers() {
  const response = await fetch('https://api.example.com/users', {
    credentials: 'include' // ⚠️ Essencial para enviar cookie
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return await response.json();
}

// Logout
async function logout() {
  await fetch('https://api.example.com/auth/logout', {
    method: 'POST',
    credentials: 'include' // Enviar cookie para invalidar sessão
  });
  
  // Cookie limpo automaticamente pelo servidor (clearCookie)
}
```

### CORS Configuration para Cookies

```javascript
// Backend CORS config (Node.js/Express)
const cors = require('cors');

app.use(cors({
  origin: 'https://app.example.com', // Frontend domain
  credentials: true // ⚠️ ESSENCIAL - permite cookies
}));

// Headers gerados automaticamente:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Credentials: true

// ⚠️ IMPORTANTE:
// - origin NÃO pode ser '*' quando credentials: true
// - Deve ser domínio específico ou função que valida origem

// Validação dinâmica de origem
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://app.example.com',
      'https://staging.example.com'
    ];
    
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

**⚠️ Regras CORS com credentials:**
- `Access-Control-Allow-Origin` **NÃO pode ser `*`** (wildcard)
- Deve ser **domínio específico**
- `Access-Control-Allow-Credentials: true` **obrigatório**

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: SameSite Attributes

```javascript
// Backend: diferentes SameSite configs

// 1. SameSite=Strict (mais restritivo)
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Cookie enviado apenas em same-site requests
// Navegação cross-site (link externo) → cookie NÃO enviado
// ✅ Proteção CSRF máxima
// ❌ UX ruim (logout ao clicar link externo)

// 2. SameSite=Lax (padrão moderno)
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax'
});

// Cookie enviado em:
// ✅ Same-site requests (todas)
// ✅ Cross-site top-level navigation GET (links)
// ❌ Cross-site POST, iframe, AJAX

// Balance security/UX

// 3. SameSite=None (permite cross-site)
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,      // ⚠️ OBRIGATÓRIO com SameSite=None
  sameSite: 'none'
});

// Cookie enviado em TODOS contexts (same-site + cross-site)
// Necessário para:
// - Iframes cross-origin
// - Third-party APIs
// - Payment gateways
// ⚠️ Maior risco CSRF (implementar outras proteções)
```

### Pattern 2: React Hook para Cookie Auth

```javascript
import { useState, useEffect } from 'react';

function useCookieAuth(baseURL) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Verificar sessão ao montar
  useEffect(() => {
    checkSession();
  }, []);
  
  async function checkSession() {
    try {
      setLoading(true);
      
      const response = await fetch(`${baseURL}/auth/session`, {
        credentials: 'include' // Enviar cookie
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
      
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  
  async function login(username, password) {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const userData = await response.json();
    setUser(userData);
    
    return userData;
  }
  
  async function logout() {
    await fetch(`${baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    setUser(null);
  }
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    checkSession
  };
}

// Uso
function App() {
  const auth = useCookieAuth('https://api.example.com');
  
  if (auth.loading) {
    return <div>Loading...</div>;
  }
  
  if (!auth.isAuthenticated) {
    return <LoginForm onLogin={auth.login} />;
  }
  
  return (
    <div>
      <h1>Welcome, {auth.user.name}</h1>
      <button onClick={auth.logout}>Logout</button>
    </div>
  );
}
```

### Pattern 3: API Client com Automatic credentials

```javascript
class CookieAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Sempre incluir credentials
    const config = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Session expirou - dispatch event
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
          throw new Error('Session expired');
        }
        
        throw new Error(`HTTP ${response.status}`);
      }
      
      const contentType = response.headers.get('Content-Type');
      
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
      
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }
  
  async get(endpoint) {
    return this.request(endpoint);
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Uso
const api = new CookieAPIClient('https://api.example.com');

// Login (seta cookie)
await api.post('/auth/login', { username, password });

// Requests automáticos com cookie
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'João' });

// Logout (limpa cookie)
await api.post('/auth/logout');

// Event listener para session expired
window.addEventListener('auth:session-expired', () => {
  window.location.href = '/login';
});
```

### Pattern 4: CSRF Token Protection

```javascript
// Backend: Gerar CSRF token
app.get('/auth/csrf-token', (req, res) => {
  const csrfToken = generateCSRFToken();
  
  // Armazenar token na sessão
  req.session.csrfToken = csrfToken;
  
  res.json({ csrfToken });
});

// Middleware: validar CSRF token
function validateCSRF(req, res, next) {
  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session.csrfToken;
  
  if (!token || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  next();
}

// Aplicar em routes mutáveis
app.post('/users', validateCSRF, (req, res) => {
  // Criar usuário
});

// Frontend: obter e enviar CSRF token
class CSRFProtectedAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.csrfToken = null;
  }
  
  async fetchCSRFToken() {
    const response = await fetch(`${this.baseURL}/auth/csrf-token`, {
      credentials: 'include'
    });
    
    const data = await response.json();
    this.csrfToken = data.csrfToken;
  }
  
  async request(endpoint, options = {}) {
    // Obter CSRF token se não tiver
    if (!this.csrfToken) {
      await this.fetchCSRFToken();
    }
    
    const config = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken, // Adicionar CSRF token
        ...options.headers
      }
    };
    
    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    // Se 403 (CSRF inválido), refetch token e retry
    if (response.status === 403) {
      await this.fetchCSRFToken();
      
      config.headers['X-CSRF-Token'] = this.csrfToken;
      return fetch(`${this.baseURL}${endpoint}`, config);
    }
    
    return response;
  }
}

// Uso
const api = new CSRFProtectedAPI('https://api.example.com');

// POST automático com CSRF token
await api.request('/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'João' })
});
```

### Pattern 5: Cookie Expiration Handling

```javascript
// Backend: Session auto-renewal
app.use((req, res, next) => {
  const sessionId = req.cookies.sessionId;
  
  if (sessionId) {
    // Renovar session
    renewSession(sessionId)
      .then(() => {
        // Renovar cookie também (sliding expiration)
        res.cookie('sessionId', sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // Reset para 24h
        });
        
        next();
      })
      .catch(error => {
        // Session expirou
        res.clearCookie('sessionId');
        next();
      });
  } else {
    next();
  }
});

// Frontend: detectar session expiration
async function fetchWithSessionCheck(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include'
  });
  
  if (response.status === 401) {
    // Session expirou
    console.log('Session expired - redirecting to login');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  return response;
}
```

### Pattern 6: Multiple Subdomains

```javascript
// Backend: Cookie para múltiplos subdomains
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  domain: '.example.com', // ⚠️ Válido para todos subdomains
  maxAge: 24 * 60 * 60 * 1000
});

// Cookie válido para:
// ✅ app.example.com
// ✅ api.example.com
// ✅ admin.example.com

// Frontend (app.example.com)
await fetch('https://api.example.com/users', {
  credentials: 'include' // Cookie enviado (same-site)
});

// Frontend (admin.example.com)
await fetch('https://api.example.com/users', {
  credentials: 'include' // Cookie enviado (same-site)
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cookies

**✅ Session-based Auth**: Servidor mantém sessão
**✅ SSR Apps**: Next.js, Nuxt (cookies automáticos)
**✅ httpOnly Security**: Proteção XSS máxima
**✅ Same-domain**: Frontend/backend no mesmo domain
**✅ Traditional Apps**: Multi-page applications

### Quando Usar Tokens (JWT)

**✅ Stateless**: Sem server-side sessions
**✅ Microservices**: Tokens compartilhados entre serviços
**✅ Mobile Apps**: Cookies não nativos em mobile
**✅ Third-party APIs**: Tokens mais flexíveis
**✅ Cross-domain Complex**: Evitar CORS complexidades

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. CORS Complexity**: credentials requer configuração cuidadosa
**2. CSRF Risk**: SameSite=None vulnerável (implementar CSRF tokens)
**3. Size Limit**: Cookies limitados a ~4KB
**4. Mobile**: Cookies não nativos em apps mobile
**5. Third-party Blocking**: Browsers bloqueiam third-party cookies

### Armadilhas Comuns

#### Armadilha 1: Esquecer credentials: 'include'

```javascript
// ❌ ERRO - cookie não enviado cross-origin
fetch('https://api.example.com/users');

// Cookie não enviado (default: same-origin)

// ✅ CORRETO
fetch('https://api.example.com/users', {
  credentials: 'include'
});
```

#### Armadilha 2: CORS origin wildcard com credentials

```javascript
// ❌ ERRO - backend config inválido
app.use(cors({
  origin: '*', // Wildcard
  credentials: true
}));

// Browsers rejeitam: não pode usar '*' com credentials

// ✅ CORRETO
app.use(cors({
  origin: 'https://app.example.com', // Específico
  credentials: true
}));
```

#### Armadilha 3: SameSite=None sem Secure

```javascript
// ❌ ERRO - browsers rejeitam
res.cookie('sessionId', sessionId, {
  sameSite: 'none'
  // Falta: secure: true
});

// ✅ CORRETO
res.cookie('sessionId', sessionId, {
  sameSite: 'none',
  secure: true // Obrigatório com SameSite=None
});
```

---

## 🔗 Interconexões Conceituais

### Relação com CORS

Cookies cross-origin requerem `credentials: 'include'` e `Access-Control-Allow-Credentials: true`.

### Relação com CSRF

SameSite atributo previne CSRF; SameSite=None requer proteções adicionais (CSRF tokens).

### Relação com Sessions

Cookies armazenam session ID, servidor mantém estado (diferente de JWT stateless).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar cookies:
1. **CORS Profundo**: Preflight, headers, credentials
2. **CSRF Protection**: Tokens, SameSite, Double Submit
3. **OAuth 2.0**: Authorization Code Flow com cookies

---

## 📚 Conclusão

Cookies com credentials são **fundamentais para auth segura**.

Dominar cookies significa:
- **Usar** `credentials: 'include'` em cross-origin requests
- **Configurar** CORS corretamente (`origin` específico, `credentials: true`)
- **Aplicar** security attributes (httpOnly, Secure, SameSite)
- **Entender** tradeoffs (CSRF risk vs XSS protection)
- **Implementar** CSRF protection com SameSite=None

É essencial para SPAs com auth baseada em sessões.
