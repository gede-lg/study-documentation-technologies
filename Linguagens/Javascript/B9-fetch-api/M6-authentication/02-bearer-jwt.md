# Bearer Tokens e JWT: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Bearer tokens** são **credenciais de acesso** no formato de **string opaca** enviadas via **Authorization header** como `Bearer <token>`, onde **posse do token** (bearer = portador) é suficiente para autenticação, sem necessidade de provar identidade adicional. **JWT (JSON Web Token)** é um **formato específico** de bearer token, definido em **RFC 7519**, contendo **claims** (declarações) sobre usuário em formato **JSON**, **assinado criptograficamente** para garantir integridade e autenticidade.

Conceitualmente, bearer token é **authorization credential** (não authentication credential como Basic Auth). Token é **emitido pelo servidor** após autenticação bem-sucedida (login), e **cliente armazena** e **reenvia** em requests subsequentes. Servidor **valida token** (assinatura, expiration, claims) e **autoriza acesso** sem consultar database a cada request (stateless).

```javascript
// Bearer Token (opaco - sem estrutura)
const bearerToken = 'a1b2c3d4e5f6g7h8i9j0';

fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${bearerToken}`
  }
});

// JWT (estruturado - 3 partes separadas por ".")
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${jwt}`
  }
});
```

### Contexto Histórico e Motivação

**Evolução de Authorization Tokens:**

1. **Basic Auth (1996)**: Username/password em cada request (overhead)
2. **Session Tokens (2000s)**: Server-side sessions com cookies (stateful)
3. **OAuth 1.0 (2007)**: Access tokens com assinatura HMAC (complexo)
4. **OAuth 2.0 (2012)**: Bearer tokens (RFC 6750) - simplificado
5. **JWT (2015)**: RFC 7519 - tokens auto-contidos (stateless)

**Motivação para Bearer Tokens:**

Basic Auth transmite credenciais em **cada request** (inseguro se interceptado). Bearer tokens são **time-limited** (expiram) e **revocable** (servidor pode invalidar), reduzindo risco. OAuth 1.0 exigia assinatura HMAC complexa; OAuth 2.0 simplificou para bearer tokens via HTTPS.

**Motivação para JWT:**

Tokens opacos requerem **server-side lookup** (database/cache) para validar, gerando overhead. JWT contém **claims** (user ID, roles, expiration) **no próprio token**, permitindo **stateless validation** (servidor verifica assinatura sem consultar database). Ideal para **microservices** e **distributed systems**.

### Problema Fundamental que Resolve

Bearer tokens e JWT resolvem problemas específicos:

**1. Stateless Authentication**: Sem server-side sessions (escalabilidade)
**2. Token Expiration**: Tokens expiram automaticamente (segurança)
**3. Revocation**: Servidor pode invalidar tokens
**4. Claims-based**: JWT contém informações sobre usuário (sem DB lookup)
**5. Cross-domain**: Tokens funcionam cross-domain (diferente de cookies)

### Importância no Ecossistema

Bearer tokens e JWT são **padrão moderno** para APIs:

- **REST APIs**: Autenticação/autorização padrão
- **SPAs**: React/Vue apps autenticam via JWT
- **Mobile Apps**: Tokens armazenados em secure storage
- **Microservices**: JWT compartilhado entre serviços
- **OAuth 2.0/OpenID Connect**: Bearer tokens são base

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Bearer**: Posse do token é suficiente para acesso
2. **Stateless**: Token contém informações (JWT) ou é opaco (lookup)
3. **Expiration**: Tokens têm tempo de vida limitado (exp claim)
4. **Signature**: JWT assinado para prevenir tampering
5. **Claims**: JWT contém dados sobre usuário (sub, name, roles)

### Pilares Fundamentais

- **Authorization header**: `Authorization: Bearer <token>`
- **JWT Structure**: Header.Payload.Signature (Base64URL encoded)
- **Claims**: sub, iat, exp, aud, iss (padrão)
- **Algorithms**: HS256 (HMAC), RS256 (RSA) para assinatura
- **Validation**: Verificar assinatura, expiration, issuer

### Visão Geral das Nuances

- Bearer token deve ser **protegido** (armazenamento seguro)
- JWT é **Base64URL encoded** (diferente de Base64)
- **Assinatura** previne alteração, não encryption (dados visíveis)
- **exp claim** define expiration (Unix timestamp)
- Token **stolen** permite acesso até expirar (usar HTTPS)

---

## 🧠 Fundamentos Teóricos

### Bearer Token Básico

```javascript
// Login: obter token
async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  const token = data.token;
  
  // Armazenar token (localStorage/sessionStorage)
  localStorage.setItem('authToken', token);
  
  return token;
}

// Request autenticado
async function fetchProtectedData(token) {
  const response = await fetch('/api/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token invalid or expired');
    }
    throw new Error(`HTTP ${response.status}`);
  }
  
  return await response.json();
}

// Uso
const token = await login('user', 'pass');
const users = await fetchProtectedData(token);
```

### JWT Structure

```javascript
// JWT = Header.Payload.Signature

// 1. Header (algoritmo de assinatura)
const header = {
  alg: 'HS256', // HMAC SHA-256
  typ: 'JWT'
};

// 2. Payload (claims sobre usuário)
const payload = {
  sub: '1234567890',      // Subject (user ID)
  name: 'John Doe',       // Nome do usuário
  email: 'john@example.com',
  roles: ['user', 'admin'],
  iat: 1516239022,        // Issued At (timestamp)
  exp: 1516242622         // Expiration (1 hour)
};

// 3. Signature (prevenir tampering)
// signature = HMAC-SHA256(
//   base64UrlEncode(header) + "." + base64UrlEncode(payload),
//   secret
// )

// JWT final:
const jwt = 
  base64UrlEncode(JSON.stringify(header)) + '.' +
  base64UrlEncode(JSON.stringify(payload)) + '.' +
  signature;

// Exemplo:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
// .eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
// .SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Decodificar JWT (Client-side)

```javascript
// Decodificar JWT (sem validar assinatura)
function decodeJWT(token) {
  // JWT = header.payload.signature
  const [headerB64, payloadB64, signature] = token.split('.');
  
  // Base64URL decode
  function base64UrlDecode(str) {
    // Substituir caracteres Base64URL por Base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Adicionar padding se necessário
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    
    // Decodificar Base64
    return JSON.parse(atob(base64));
  }
  
  const header = base64UrlDecode(headerB64);
  const payload = base64UrlDecode(payloadB64);
  
  return { header, payload, signature };
}

// Uso
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const decoded = decodeJWT(jwt);

console.log('Header:', decoded.header);
// { alg: 'HS256', typ: 'JWT' }

console.log('Payload:', decoded.payload);
// { sub: '1234567890', name: 'John Doe', iat: 1516239022 }

console.log('User:', decoded.payload.name);
// "John Doe"
```

**⚠️ Importante**: Client-side decoding **não valida assinatura**. Apenas server deve confiar em claims.

### Verificar Expiration

```javascript
function isTokenExpired(token) {
  try {
    const { payload } = decodeJWT(token);
    
    // exp = Unix timestamp (segundos)
    if (!payload.exp) {
      return false; // Sem expiration
    }
    
    const now = Math.floor(Date.now() / 1000); // Timestamp atual
    
    return payload.exp < now;
    
  } catch (error) {
    console.error('Invalid token:', error);
    return true; // Considerar expirado se inválido
  }
}

// Uso
const token = localStorage.getItem('authToken');

if (isTokenExpired(token)) {
  console.log('Token expired - redirect to login');
  // Redirecionar para login
} else {
  console.log('Token valid');
  // Fazer request
}
```

### API Client com JWT

```javascript
class JWTClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }
  
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }
  
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }
  
  isAuthenticated() {
    const token = this.getToken();
    return token && !isTokenExpired(token);
  }
  
  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('No token - please login');
    }
    
    if (isTokenExpired(token)) {
      this.clearToken();
      throw new Error('Token expired - please login');
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
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Unauthorized - token invalid');
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
  
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    this.setToken(data.token);
    
    return data;
  }
  
  logout() {
    this.clearToken();
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
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Uso
const api = new JWTClient('https://api.example.com');

// Login
await api.login('user', 'password');

// Requests autenticados
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'João' });

// Logout
api.logout();
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Token com React Context

```javascript
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Carregar token ao montar
    const savedToken = localStorage.getItem('authToken');
    
    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      
      // Decodificar para obter user info
      const { payload } = decodeJWT(savedToken);
      setUser({
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        roles: payload.roles || []
      });
    }
    
    setLoading(false);
  }, []);
  
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
    const newToken = data.token;
    
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    
    const { payload } = decodeJWT(newToken);
    setUser({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      roles: payload.roles || []
    });
    
    return data;
  }
  
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  }
  
  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token && !isTokenExpired(token),
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Uso em componente
function UserProfile() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles.join(', ')}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Protected Route
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

### Pattern 2: Automatic Token Injection (Axios Interceptor Pattern)

```javascript
class TokenInterceptor {
  constructor() {
    this.token = null;
  }
  
  setToken(token) {
    this.token = token;
  }
  
  async fetch(url, options = {}) {
    // Injetar token automaticamente
    const config = {
      ...options,
      headers: {
        ...options.headers
      }
    };
    
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token inválido/expirado
        this.token = null;
        localStorage.removeItem('authToken');
        
        // Dispatch event para app redirecionar login
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        throw new Error('Unauthorized');
      }
      
      return response;
      
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance
const tokenFetch = new TokenInterceptor();

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const { token } = await loginResponse.json();
tokenFetch.setToken(token);

// Requests automáticos com token
const users = await tokenFetch.fetch('/api/users');
const data = await users.json();

// Event listener para logout
window.addEventListener('auth:logout', () => {
  window.location.href = '/login';
});
```

### Pattern 3: JWT Claims-based Authorization

```javascript
function hasRole(token, requiredRole) {
  try {
    const { payload } = decodeJWT(token);
    const roles = payload.roles || [];
    
    return roles.includes(requiredRole);
    
  } catch (error) {
    return false;
  }
}

function hasAnyRole(token, requiredRoles) {
  try {
    const { payload } = decodeJWT(token);
    const roles = payload.roles || [];
    
    return requiredRoles.some(role => roles.includes(role));
    
  } catch (error) {
    return false;
  }
}

function hasAllRoles(token, requiredRoles) {
  try {
    const { payload } = decodeJWT(token);
    const roles = payload.roles || [];
    
    return requiredRoles.every(role => roles.includes(role));
    
  } catch (error) {
    return false;
  }
}

// Uso
const token = localStorage.getItem('authToken');

if (hasRole(token, 'admin')) {
  console.log('User is admin');
}

if (hasAnyRole(token, ['admin', 'moderator'])) {
  console.log('User can moderate');
}

if (hasAllRoles(token, ['user', 'verified'])) {
  console.log('User is verified');
}

// React component com role check
function AdminPanel() {
  const { token } = useAuth();
  
  if (!hasRole(token, 'admin')) {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Panel</div>;
}
```

### Pattern 4: Custom Hooks para JWT

```javascript
import { useState, useEffect, useCallback } from 'react';

function useJWT(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setError(new Error('No token'));
      setLoading(false);
      return;
    }
    
    if (isTokenExpired(token)) {
      setError(new Error('Token expired'));
      setLoading(false);
      return;
    }
    
    const controller = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!controller.signal.aborted) {
        setData(result);
      }
      
    } catch (err) {
      if (err.name !== 'AbortError' && !controller.signal.aborted) {
        setError(err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
    
    return () => controller.abort();
    
  }, [url, JSON.stringify(options)]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
}

// Uso
function UserList() {
  const { data: users, loading, error, refetch } = useJWT('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Pattern 5: Token Preemptive Check

```javascript
async function fetchWithTokenCheck(url, options = {}) {
  const token = localStorage.getItem('authToken');
  
  // Check 1: Token existe?
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  // Check 2: Token expirado?
  if (isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    throw new Error('Token expired');
  }
  
  // Check 3: Token expira em breve? (< 5 minutos)
  const { payload } = decodeJWT(token);
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - now;
  
  if (timeUntilExpiry < 300) { // 5 minutos
    console.warn('Token expiring soon - consider refreshing');
    // Disparar refresh (veremos em próximo arquivo)
  }
  
  // Fazer request
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
}
```

### Pattern 6: Multiple Token Types

```javascript
// Access token (curta duração) + Refresh token (longa duração)
class TokenManager {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }
  
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
  
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  isAccessTokenValid() {
    const token = this.getAccessToken();
    return token && !isTokenExpired(token);
  }
}

// Uso (refresh veremos em próximo arquivo)
const tokenManager = new TokenManager();

// Login retorna ambos tokens
const { accessToken, refreshToken } = await login();
tokenManager.setTokens(accessToken, refreshToken);

// Request usa access token
const users = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${tokenManager.getAccessToken()}`
  }
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Bearer Tokens/JWT

**✅ REST APIs**: Padrão moderno para autenticação
**✅ SPAs**: React/Vue apps
**✅ Mobile Apps**: Native apps (iOS/Android)
**✅ Microservices**: Tokens compartilhados entre serviços
**✅ Stateless**: Sem server-side sessions

### JWT vs Opaque Tokens

**JWT Vantagens:**
- Stateless (sem DB lookup)
- Claims auto-contidos
- Validação via assinatura

**JWT Desvantagens:**
- Maior tamanho (overhead)
- Não revogável facilmente
- Claims visíveis (não encryption)

**Opaque Tokens Vantagens:**
- Menor tamanho
- Revogável imediatamente
- Dados não expostos

**Opaque Tokens Desvantagens:**
- Requer DB lookup (stateful)
- Sem claims (consultar DB para info)

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações de JWT

**1. Size**: JWT maior que opaque token (overhead em headers)
**2. Revocation**: Difícil revogar antes de expirar
**3. Not Encrypted**: Claims visíveis (Base64URL decode)
**4. Storage**: localStorage vulnerável a XSS
**5. No Refresh Built-in**: Precisa implementar refresh separado

### Armadilhas Comuns

#### Armadilha 1: Dados Sensíveis em JWT

```javascript
// ❌ ERRO - dados sensíveis em JWT
const payload = {
  sub: user.id,
  password: user.password, // NUNCA
  ssn: user.ssn            // NUNCA
};

// JWT não é encrypted - dados visíveis
// Qualquer um pode decodificar

// ✅ CORRETO - apenas dados não-sensíveis
const payload = {
  sub: user.id,
  name: user.name,
  email: user.email,
  roles: user.roles
};
```

#### Armadilha 2: Não Verificar Expiration

```javascript
// ❌ ERRO - usar token expirado
const token = localStorage.getItem('authToken');

fetch('/api/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// ✅ CORRETO - verificar expiration
const token = localStorage.getItem('authToken');

if (isTokenExpired(token)) {
  redirectToLogin();
} else {
  fetch('/api/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

#### Armadilha 3: localStorage com XSS

```javascript
// ❌ RISCO - XSS pode roubar token
localStorage.setItem('authToken', token);

// Script malicioso:
// const stolen = localStorage.getItem('authToken');
// sendToAttacker(stolen);

// ✅ MELHOR - httpOnly cookie (se possível)
// Servidor seta cookie:
// Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// Client não acessa via JS (proteção XSS)
```

---

## 🔗 Interconexões Conceituais

### Relação com Basic Auth

Basic Auth envia **credenciais**, Bearer envia **token** (mais seguro).

### Relação com HTTPS

Bearer tokens **requerem HTTPS** (token interceptado = acesso até expirar).

### Relação com Token Refresh

JWT access tokens expiram rápido, **refresh tokens** renovam sem re-login.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar Bearer/JWT:
1. **Token Storage**: Onde armazenar tokens (localStorage vs cookies)
2. **Token Refresh**: Renovar access tokens automaticamente
3. **OAuth 2.0**: Delegated authorization flows

---

## 📚 Conclusão

Bearer tokens e JWT são **padrão moderno** para autenticação.

Dominar Bearer/JWT significa:
- **Enviar** tokens via `Authorization: Bearer <token>`
- **Decodificar** JWT para obter claims (client-side)
- **Verificar** expiration antes de usar token
- **Entender** que JWT não é encrypted (dados visíveis)
- **Implementar** token storage seguro

É essencial para APIs modernas e SPAs.
