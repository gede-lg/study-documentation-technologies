# Token Storage e Refresh: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Token storage** é o processo de **armazenar credentials** (access tokens, refresh tokens) no **client-side** de forma **segura** e **acessível**, balanceando **security** (proteção contra XSS/CSRF) e **usability** (persistência entre sessões). **Token refresh** é o mecanismo de **renovar access tokens expirados** usando **refresh token** de longa duração, permitindo **continuous authentication** sem re-login, enquanto mantém **access tokens de curta duração** para minimizar janela de risco em caso de token theft.

Conceitualmente, storage resolve problema de **onde persistir tokens** (memory, localStorage, sessionStorage, cookies), cada opção com **tradeoffs** entre **security** e **UX**. Refresh resolve problema de **token expiration**: access tokens expiram rápido (15min-1h) para limitar damage se roubados, mas **refresh tokens** (dias/semanas) permitem obter novos access tokens **sem interromper usuário** com login.

```javascript
// Access Token: curta duração (15min-1h)
const accessToken = 'eyJhbGci...'; // Expira em 30 min
localStorage.setItem('accessToken', accessToken);

// Refresh Token: longa duração (7-30 dias)
const refreshToken = 'refresh_xyz123'; // Expira em 7 dias
localStorage.setItem('refreshToken', refreshToken);

// Quando access token expira:
// 1. Detectar 401 ou exp claim
// 2. Usar refresh token para obter novo access token
// 3. Armazenar novo access token
// 4. Retry request original
```

### Contexto Histórico e Motivação

**Evolução de Token Storage:**

1. **Early Web (1995-2005)**: Cookies server-side sessions (stateful)
2. **AJAX Era (2005-2010)**: localStorage para client state
3. **SPA Era (2010-2015)**: localStorage para tokens (XSS risk)
4. **Modern (2015+)**: httpOnly cookies ou memory storage (security)

**Evolução de Token Refresh:**

1. **OAuth 2.0 (2012)**: Introduz refresh tokens (RFC 6749)
2. **JWT (2015)**: Access tokens stateless, refresh tokens para renovação
3. **Modern (2020+)**: Refresh tokens em httpOnly cookies (secure)

**Motivação para Storage Patterns:**

localStorage é **conveniente** (persistência, fácil acesso), mas **vulnerável a XSS** (scripts maliciosos roubam tokens). httpOnly cookies são **seguros contra XSS** (JS não acessa), mas **vulneráveis a CSRF** (requests forçados). Memory storage é **mais seguro** (não persiste), mas **UX ruim** (logout ao fechar tab).

**Motivação para Refresh:**

Access tokens **não devem ser de longa duração** (maior janela de risco se roubados). Mas re-login frequente é **UX ruim**. Refresh tokens resolvem: **access token curto** (risco limitado) + **refresh token longo** (UX contínuo). Se refresh token roubado, servidor pode **revogar** (blacklist).

### Problema Fundamental que Resolve

Token storage e refresh resolvem problemas específicos:

**Storage:**
**1. XSS Protection**: Prevenir script malicioso roubar tokens
**2. CSRF Protection**: Prevenir requests forçados
**3. Persistence**: Manter login entre sessões
**4. Accessibility**: Código client precisa acessar token

**Refresh:**
**1. Security**: Access tokens curtos (janela de risco pequena)
**2. UX**: Usuário não re-login a cada 15min
**3. Revocation**: Servidor pode invalidar refresh tokens
**4. Continuous Auth**: Sessão contínua sem interrupções

### Importância no Ecossistema

Storage e refresh são **críticos para security e UX**:

- **Security**: Armazenamento incorreto = tokens roubados
- **UX**: Refresh correto = sessão contínua sem re-login
- **Compliance**: Regulamentações (GDPR, PCI-DSS) exigem security
- **Production**: Todas SPAs/mobile apps precisam storage/refresh
- **OAuth 2.0**: Refresh tokens são parte integral do protocolo

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Storage Options**: localStorage, sessionStorage, memory, httpOnly cookies
2. **XSS Risk**: localStorage/sessionStorage acessíveis por JS malicioso
3. **CSRF Risk**: Cookies enviados automaticamente (forçar requests)
4. **Refresh Flow**: Access token expira → Refresh → Novo access token
5. **Rotation**: Refresh token trocado a cada uso (security)

### Pilares Fundamentais

- **localStorage**: Persistência cross-sessions (XSS vulnerable)
- **sessionStorage**: Persistência single-session (XSS vulnerable)
- **Memory**: Mais seguro (logout ao fechar tab)
- **httpOnly Cookies**: Seguro XSS (CSRF vulnerable, mitigar com SameSite)
- **Refresh Endpoint**: `/auth/refresh` retorna novo access token

### Visão Geral das Nuances

- **Não há storage perfeito**: Todos têm tradeoffs
- **httpOnly + SameSite**: Melhor security (se backend suporta)
- **localStorage**: Mais usado em SPAs (apesar de XSS risk)
- **Refresh token rotation**: Trocar refresh token a cada uso (security)
- **Silent refresh**: Renovar antes de expirar (UX seamless)

---

## 🧠 Fundamentos Teóricos

### Storage Options Comparison

```javascript
// 1. localStorage - Persistência cross-sessions
localStorage.setItem('accessToken', token);
const token = localStorage.getItem('accessToken');

// Vantagens:
// ✅ Persiste entre sessões (fecha/abre browser)
// ✅ Fácil acesso pelo código

// Desvantagens:
// ❌ XSS pode roubar (script malicioso acessa localStorage)
// ❌ Compartilhado entre tabs (não isolado)

// 2. sessionStorage - Persistência single-session
sessionStorage.setItem('accessToken', token);
const token = sessionStorage.getItem('accessToken');

// Vantagens:
// ✅ Isolado por tab (não compartilha entre tabs)
// ✅ Limpa ao fechar tab

// Desvantagens:
// ❌ XSS pode roubar
// ❌ Logout ao fechar tab (UX ruim para alguns casos)

// 3. Memory (variable) - Mais seguro
let accessToken = null;

function setToken(token) {
  accessToken = token;
}

function getToken() {
  return accessToken;
}

// Vantagens:
// ✅ Mais seguro contra XSS (não persiste)
// ✅ Não aparece em DevTools Application tab

// Desvantagens:
// ❌ Logout ao refresh página
// ❌ UX ruim (re-login frequente)

// 4. httpOnly Cookie - Melhor security
// Servidor seta cookie:
// Set-Cookie: accessToken=xxx; HttpOnly; Secure; SameSite=Strict

// Vantagens:
// ✅ Proteção XSS (JS não acessa)
// ✅ Enviado automaticamente em requests

// Desvantagens:
// ❌ CSRF risk (mitigar com SameSite=Strict)
// ❌ Client não acessa (não pode decodificar JWT)
// ❌ Requer backend configuração
```

### Basic Refresh Flow

```javascript
class TokenManager {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }
  
  // Armazenar tokens após login
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken');
    }
    return this.accessToken;
  }
  
  getRefreshToken() {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem('refreshToken');
    }
    return this.refreshToken;
  }
  
  // Renovar access token usando refresh token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });
      
      if (!response.ok) {
        // Refresh token inválido/expirado
        throw new Error('Refresh failed');
      }
      
      const data = await response.json();
      
      // Armazenar novos tokens
      this.setTokens(data.accessToken, data.refreshToken);
      
      return data.accessToken;
      
    } catch (error) {
      // Limpar tokens e forçar re-login
      this.clearTokens();
      throw error;
    }
  }
  
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

// Uso
const tokenManager = new TokenManager();

// Login
const { accessToken, refreshToken } = await login();
tokenManager.setTokens(accessToken, refreshToken);

// Request com access token
let token = tokenManager.getAccessToken();

const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Se 401 (token expirado), refresh
if (response.status === 401) {
  token = await tokenManager.refreshAccessToken();
  
  // Retry request com novo token
  const retryResponse = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
```

### Automatic Refresh on 401

```javascript
class APIClient {
  constructor(baseURL, tokenManager) {
    this.baseURL = baseURL;
    this.tokenManager = tokenManager;
    this.isRefreshing = false;
    this.refreshPromise = null;
  }
  
  async request(endpoint, options = {}) {
    let token = this.tokenManager.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    let response = await fetch(url, config);
    
    // Se 401, tentar refresh
    if (response.status === 401) {
      // Evitar múltiplos refreshes simultâneos
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        
        try {
          // Refresh token
          this.refreshPromise = this.tokenManager.refreshAccessToken();
          token = await this.refreshPromise;
          
        } catch (error) {
          // Refresh falhou - redirecionar para login
          this.isRefreshing = false;
          throw new Error('Session expired - please login');
          
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
        
      } else {
        // Aguardar refresh em andamento
        token = await this.refreshPromise;
      }
      
      // Retry request com novo token
      config.headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(url, config);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
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
}

// Uso
const tokenManager = new TokenManager();
const api = new APIClient('https://api.example.com', tokenManager);

// Login
const { accessToken, refreshToken } = await login();
tokenManager.setTokens(accessToken, refreshToken);

// Requests automáticos com refresh
const users = await api.get('/users'); // Auto-refresh se 401
const newUser = await api.post('/users', { name: 'João' });
```

### Silent Refresh (Proactive)

```javascript
// Renovar antes de expirar (UX seamless)
class SilentRefreshManager {
  constructor(tokenManager) {
    this.tokenManager = tokenManager;
    this.refreshTimer = null;
  }
  
  // Iniciar silent refresh
  start() {
    this.scheduleRefresh();
  }
  
  // Parar silent refresh
  stop() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  
  scheduleRefresh() {
    const token = this.tokenManager.getAccessToken();
    
    if (!token) {
      return;
    }
    
    // Decodificar para obter expiration
    const { payload } = decodeJWT(token);
    const exp = payload.exp * 1000; // Converter para ms
    const now = Date.now();
    
    // Refresh 5 minutos antes de expirar
    const refreshTime = exp - now - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          console.log('Silent refresh...');
          await this.tokenManager.refreshAccessToken();
          
          // Agendar próximo refresh
          this.scheduleRefresh();
          
        } catch (error) {
          console.error('Silent refresh failed:', error);
          // Forçar re-login
        }
      }, refreshTime);
      
      console.log(`Refresh agendado em ${Math.round(refreshTime / 1000)}s`);
    } else {
      // Token já expirou - refresh imediatamente
      this.tokenManager.refreshAccessToken()
        .then(() => this.scheduleRefresh())
        .catch(error => console.error('Refresh failed:', error));
    }
  }
}

// Uso
const tokenManager = new TokenManager();
const silentRefresh = new SilentRefreshManager(tokenManager);

// Login
const { accessToken, refreshToken } = await login();
tokenManager.setTokens(accessToken, refreshToken);

// Iniciar silent refresh
silentRefresh.start();

// Logout
function logout() {
  silentRefresh.stop();
  tokenManager.clearTokens();
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: httpOnly Cookie Strategy

```javascript
// Backend (Node.js/Express)
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Validar credenciais
  const user = await validateUser(username, password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Gerar tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Armazenar refresh token no DB (para revogação)
  await saveRefreshToken(user.id, refreshToken);
  
  // Setar tokens em httpOnly cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,     // JS não acessa (proteção XSS)
    secure: true,       // Apenas HTTPS
    sameSite: 'strict', // Proteção CSRF
    maxAge: 15 * 60 * 1000 // 15 minutos
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
  });
  
  res.json({ message: 'Logged in' });
});

// Frontend
async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include' // Enviar/receber cookies
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return await response.json();
}

// Request (cookies enviados automaticamente)
async function fetchUsers() {
  const response = await fetch('/api/users', {
    credentials: 'include' // Incluir cookies
  });
  
  return await response.json();
}

// Backend middleware verifica cookie
app.get('/api/users', authenticateToken, async (req, res) => {
  // Token extraído do cookie
  const users = await getUsers();
  res.json(users);
});

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

**Vantagens:**
- ✅ Proteção XSS (JS não acessa)
- ✅ CSRF mitigado com SameSite=Strict
- ✅ Tokens enviados automaticamente

**Desvantagens:**
- ❌ Requer backend configuração
- ❌ CORS complexidade (credentials: 'include')

### Pattern 2: localStorage with XSS Mitigation

```javascript
// Content Security Policy (CSP) para mitigar XSS
// Backend seta header:
// Content-Security-Policy: default-src 'self'; script-src 'self'

// Proibir inline scripts (fonte comum de XSS)
// <script>alert('XSS')</script> → Bloqueado

// Frontend usa localStorage
class SecureStorage {
  constructor() {
    this.storageKey = '__auth_tokens__';
  }
  
  setTokens(accessToken, refreshToken) {
    const data = {
      accessToken,
      refreshToken,
      timestamp: Date.now()
    };
    
    // Opcional: Encrypt antes de armazenar
    const encrypted = this.encrypt(JSON.stringify(data));
    localStorage.setItem(this.storageKey, encrypted);
  }
  
  getTokens() {
    const encrypted = localStorage.getItem(this.storageKey);
    
    if (!encrypted) {
      return null;
    }
    
    try {
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to parse tokens:', error);
      this.clearTokens();
      return null;
    }
  }
  
  clearTokens() {
    localStorage.removeItem(this.storageKey);
  }
  
  // Encryption básico (não production-ready)
  // Use crypto libraries (Web Crypto API) em produção
  encrypt(data) {
    // Implementar encryption real
    return btoa(data); // Apenas demonstração
  }
  
  decrypt(data) {
    return atob(data);
  }
}

// Uso
const storage = new SecureStorage();

// Login
const { accessToken, refreshToken } = await login();
storage.setTokens(accessToken, refreshToken);

// Request
const tokens = storage.getTokens();
if (tokens) {
  fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`
    }
  });
}
```

**Mitigações XSS:**
- ✅ CSP (Content Security Policy)
- ✅ Input sanitization (nunca usar `innerHTML` com user input)
- ✅ Avoid `eval()`, `Function()` constructor
- ✅ Regular security audits

### Pattern 3: Refresh Token Rotation

```javascript
// Backend: Trocar refresh token a cada uso
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.body;
  
  // Validar refresh token
  const payload = verifyRefreshToken(oldRefreshToken);
  
  if (!payload) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  
  // Verificar se refresh token está na whitelist (DB)
  const isValid = await isRefreshTokenValid(payload.userId, oldRefreshToken);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Token revoked' });
  }
  
  // Gerar NOVOS tokens (rotation)
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);
  
  // Invalidar refresh token antigo
  await revokeRefreshToken(oldRefreshToken);
  
  // Armazenar novo refresh token
  await saveRefreshToken(payload.userId, newRefreshToken);
  
  res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
});

// Frontend
class TokenManager {
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Refresh failed');
    }
    
    const data = await response.json();
    
    // Armazenar AMBOS tokens novos (rotation)
    this.setTokens(data.accessToken, data.refreshToken);
    
    return data.accessToken;
  }
}
```

**Benefício**: Se refresh token roubado, janela de uso é uma única vez (próximo refresh legítimo o invalida).

### Pattern 4: React Context com Storage

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Carregar tokens ao montar
  useEffect(() => {
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    
    if (savedAccessToken && !isTokenExpired(savedAccessToken)) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      
      const { payload } = decodeJWT(savedAccessToken);
      setUser({
        id: payload.sub,
        name: payload.name,
        email: payload.email
      });
    }
    
    setLoading(false);
  }, []);
  
  // Silent refresh
  useEffect(() => {
    if (!accessToken) return;
    
    const { payload } = decodeJWT(accessToken);
    const exp = payload.exp * 1000;
    const now = Date.now();
    
    // Refresh 5 min antes de expirar
    const refreshTime = exp - now - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      const timer = setTimeout(async () => {
        try {
          await refresh();
        } catch (error) {
          console.error('Silent refresh failed:', error);
          logout();
        }
      }, refreshTime);
      
      return () => clearTimeout(timer);
    }
  }, [accessToken]);
  
  async function login(username, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    const { payload } = decodeJWT(data.accessToken);
    setUser({
      id: payload.sub,
      name: payload.name,
      email: payload.email
    });
  }
  
  async function refresh() {
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Refresh failed');
    }
    
    const data = await response.json();
    
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    return data.accessToken;
  }
  
  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  const value = {
    accessToken,
    user,
    loading,
    isAuthenticated: !!accessToken,
    login,
    refresh,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Uso
function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

function UserProfile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Pattern 5: Refresh Race Condition Prevention

```javascript
// Prevenir múltiplos refreshes simultâneos
class RefreshManager {
  constructor() {
    this.refreshPromise = null;
  }
  
  async refresh(refreshToken) {
    // Se refresh já em andamento, aguardar
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // Iniciar refresh
    this.refreshPromise = this.doRefresh(refreshToken);
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }
  
  async doRefresh(refreshToken) {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Refresh failed');
    }
    
    return await response.json();
  }
}

// Uso
const refreshManager = new RefreshManager();

// Múltiplos requests simultâneos com token expirado
// Apenas 1 refresh é feito, demais aguardam
Promise.all([
  api.get('/users'),    // Trigger refresh
  api.get('/products'), // Aguarda refresh
  api.get('/orders')    // Aguarda refresh
]);
```

---

## 🎯 Aplicabilidade e Contextos

### Storage Recommendations

**localStorage:**
- ✅ SPAs com CSP strict
- ✅ Development/testing
- ❌ High-security apps

**httpOnly Cookies:**
- ✅ Production apps
- ✅ High-security requirements
- ❌ Cross-domain APIs (CORS complexo)

**Memory:**
- ✅ Maximum security
- ❌ Poor UX (logout on refresh)

### Refresh Recommendations

**Short Access Token:**
- ✅ 15min - 1h (balance security/UX)

**Long Refresh Token:**
- ✅ 7-30 days

**Silent Refresh:**
- ✅ Refresh 5min before expiry

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. No Perfect Storage**: Todos têm tradeoffs (security vs UX)
**2. XSS Risk**: localStorage/sessionStorage vulneráveis
**3. CSRF Risk**: Cookies vulneráveis (mitigar com SameSite)
**4. Refresh Complexity**: Implementar corretamente é difícil
**5. Token Revocation**: Refresh tokens requerem DB (não stateless)

### Armadilhas Comuns

#### Armadilha 1: Não Rotar Refresh Token

```javascript
// ❌ ERRO - reusar mesmo refresh token
const newAccessToken = await refresh(refreshToken);
// refreshToken permanece igual

// Se refresh token roubado, atacante tem acesso indefinido

// ✅ CORRETO - rotar refresh token
const { accessToken, refreshToken: newRefreshToken } = await refresh();
// Novo refresh token a cada uso
```

#### Armadilha 2: Refresh Loop Infinito

```javascript
// ❌ ERRO - refresh em loop se sempre 401
async function request(url) {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.status === 401) {
    await refresh();
    return request(url); // Recursão infinita se refresh falhar
  }
}

// ✅ CORRETO - retry apenas uma vez
async function request(url, retried = false) {
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.status === 401 && !retried) {
    await refresh();
    return request(url, true); // Retry apenas 1x
  }
  
  return response;
}
```

---

## 🔗 Interconexões Conceituais

### Relação com JWT

JWT access tokens expiram (exp claim), refresh tokens renovam.

### Relação com Security

Storage incorreto = tokens roubados, refresh sem rotation = risco.

### Relação com UX

Silent refresh = sessão contínua sem interrupções.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar storage/refresh:
1. **Cookies com credentials**: credentials: 'include', SameSite
2. **OAuth 2.0**: Authorization flows completos
3. **Security Best Practices**: CSP, HTTPS, input sanitization

---

## 📚 Conclusão

Token storage e refresh são **críticos para security e UX**.

Dominar storage/refresh significa:
- **Escolher** storage apropriado (httpOnly cookies > localStorage)
- **Implementar** refresh automático em 401
- **Usar** silent refresh para UX seamless
- **Rotar** refresh tokens para security
- **Prevenir** race conditions em refresh

É essencial para aplicações production-ready.
