# 🎯 Introdução

Token refresh representa padrão fundamental em sistemas OAuth 2.0 e autenticação moderna: capacidade de renovar access tokens expirados sem requerer nova autenticação do usuário. Este mecanismo resolve tension crítica entre segurança e user experience: access tokens devem ser short-lived para minimizar janela de exploração se comprometidos, mas forçar usuários a fazer login repetidamente degrada usabilidade drasticamente.

O problema que token refresh resolve é ilustrado em cenário comum: access token JWT expira após 1 hora. Sem refresh mechanism, usuário trabalhando em SPA por 2 horas seria deslogado repetidamente, destruindo produtividade. Com refresh tokens, o client pode automaticamente obter novo access token usando refresh token long-lived, mantendo sessão ativa sem interrupções visíveis ao usuário.

Implementação de token refresh com Axios é exemplo perfeito de poder dos interceptors: lógica de refresh é cross-cutting concern que deve ser transparente para código de aplicação. Request interceptor pode verificar expiração antes de enviar request; response interceptor pode detectar 401, executar refresh, e retry request original automaticamente. Esta orquestração transforma potencial error disruptivo em operação seamless.

Entretanto, token refresh introduz complexidades: race conditions quando múltiplos requests simultâneos acionam refresh, refresh loops onde refresh falha mas request retenta infinitamente, storage seguro de refresh tokens (mais sensíveis que access tokens), e revogação/rotation de refresh tokens para mitigar theft. Implementações production-ready devem handle estes edge cases.

Este módulo explora token refresh em profundidade: desde conceitos fundamentais de access vs refresh tokens, através de implementações Axios usando interceptors, até patterns avançados para concurrent request handling, refresh token rotation, e storage seguro. Objetivo é equipar você com conhecimento para implementar refresh robusto que balanceia segurança e UX.

---

# 📋 Sumário

### **Fundamentos de Token Refresh**
- Problema resolvido por token refresh
- Access tokens vs refresh tokens
- Token lifetimes (short vs long-lived)
- Refresh token grant type

### **Implementação Básica com Axios**
- Detectando token expirado (401)
- Refresh request para Authorization Server
- Updating stored tokens
- Retrying failed request

### **Interceptor-Based Refresh**
- Request interceptor: verificação pró-ativa de expiração
- Response interceptor: handling de 401
- Retry logic com novo access token

### **Handling de Concurrent Requests**
- Problema de race condition
- Token refresh locking (prevent múltiplos refreshes)
- Queueing requests durante refresh
- Resolving queue após refresh success

### **Refresh Token Rotation**
- Conceito de rotation
- Uso único de refresh tokens
- Security benefits
- Implementation patterns

### **Storage Seguro de Refresh Tokens**
- In-memory storage
- httpOnly cookies (backend-managed)
- localStorage risks
- Comparing storage strategies

### **Error Handling e Fallbacks**
- Refresh token expirado
- Refresh token revogado
- Network errors durante refresh
- Redirect para login como fallback

### **Best Practices**
- Token expiration buffering
- Refresh antes de expiração
- Logging e monitoring
- Security considerations

---

# 🧠 Fundamentos

## Problema Resolvido por Token Refresh

**Dilema de Segurança vs UX**:

**Opção 1**: Access tokens long-lived (ex: 30 dias)
- **UX**: Ótimo - usuário permanece logado por semanas
- **Segurança**: Ruim - se token for roubado (XSS, leak), atacante tem acesso prolongado

**Opção 2**: Access tokens short-lived (ex: 5 minutos)
- **Segurança**: Melhor - janela de exploração reduzida
- **UX**: Péssimo - usuário é deslogado constantemente

**Solução**: Refresh Tokens
- Access token short-lived (15 min - 1 hora)
- Refresh token long-lived (7 dias - 6 meses)
- Client usa refresh token para obter novos access tokens automaticamente
- **Resultado**: Segurança de tokens short-lived + UX de sessões longas

## Access Tokens vs Refresh Tokens

| Aspecto | Access Token | Refresh Token |
|---------|-------------|---------------|
| **Propósito** | Acessar Resource Server (API) | Obter novos access tokens |
| **Lifetime** | Curto (15min - 1h) | Longo (7d - 6m) |
| **Enviado para** | Resource Server | Authorization Server apenas |
| **Frequência de uso** | Cada API request | Apenas quando access token expira |
| **Sensibilidade** | Alta | Muito alta |
| **Revogável** | Geralmente não (stateless JWT) | Sim (armazenado no servidor) |

**Exemplo de Token Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "def50200a1b2c3d4e5f6...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## Refresh Token Grant Type

OAuth 2.0 define `refresh_token` grant type:

**Request para Authorization Server**:
```http
POST /oauth/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=def50200a1b2c3d4e5f6...&
client_id=YOUR_CLIENT_ID
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.NEW_TOKEN...",
  "refresh_token": "ghi78900a1b2c3d4e5f6...", 
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

**Observações**:
- Novo access token retornado
- Pode incluir novo refresh token (rotation)
- `expires_in`: segundos até expiração do novo access token

---

# 🔍 Análise

## Implementação Básica com Axios

### **Detectando Token Expirado**

**Opção 1: Server retorna 401**

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com'
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Se 401 e não é retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Previne loop
      
      try {
        // Executar refresh
        const newAccessToken = await refreshAccessToken();
        
        // Atualizar header do request original
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Retry request original
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, redirecionar para login
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Opção 2: Verificar expiração antes de request**

```javascript
import jwtDecode from 'jwt-decode';

function isTokenExpired(token) {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000; // Segundos desde epoch
  return decoded.exp < now;
}

apiClient.interceptors.request.use(async config => {
  let token = getAccessToken();
  
  if (isTokenExpired(token)) {
    // Refresh ANTES de request
    token = await refreshAccessToken();
  }
  
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

### **Função de Refresh**

```javascript
let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await axios.post('https://auth.example.com/oauth/token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.CLIENT_ID
  });
  
  const { access_token, refresh_token: newRefreshToken } = response.data;
  
  // Atualizar tokens armazenados
  setAccessToken(access_token);
  if (newRefreshToken) {
    setRefreshToken(newRefreshToken); // Rotation
  }
  
  return access_token;
}
```

## Handling de Concurrent Requests

**Problema**: Múltiplos requests simultâneos detectam token expirado e todos tentam refresh:

```javascript
// Requisições simultâneas
Promise.all([
  apiClient.get('/user'),
  apiClient.get('/posts'),
  apiClient.get('/comments')
]);

// Todos detectam 401 → 3 refresh requests simultâneos!
```

**Consequências**:
- Múltiplos refresh requests desnecessários
- Possível race condition
- Alguns refreshes podem falhar se refresh token é uso único

**Solução**: Refresh locking com promise sharing

```javascript
let refreshPromise = null;

async function refreshAccessToken() {
  // Se refresh já em andamento, retornar promise existente
  if (refreshPromise) {
    return refreshPromise;
  }
  
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  // Criar nova promise e armazenar
  refreshPromise = axios.post('https://auth.example.com/oauth/token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.CLIENT_ID
  })
  .then(response => {
    const { access_token, refresh_token: newRefreshToken } = response.data;
    
    setAccessToken(access_token);
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
    }
    
    return access_token;
  })
  .finally(() => {
    // Limpar promise após conclusão
    refreshPromise = null;
  });
  
  return refreshPromise;
}
```

**Benefícios**:
- Primeiro request inicia refresh
- Requests subsequentes reutilizam mesma promise
- Apenas um refresh request ao servidor
- Todos recebem novo token quando promise resolve

### **Request Queueing**

Pattern avançado: enfileirar requests durante refresh

```javascript
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshComplete(token) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (!isRefreshing) {
        isRefreshing = true;
        
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshComplete(newToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          redirectToLogin();
          return Promise.reject(refreshError);
        }
      }
      
      // Se refresh já em andamento, enfileirar este request
      return new Promise(resolve => {
        subscribeTokenRefresh(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }
    
    return Promise.reject(error);
  }
);
```

**Flow**:
1. Request A detecta 401, inicia refresh (`isRefreshing = true`)
2. Requests B, C detectam 401, mas refresh já em andamento
3. B e C são enfileirados (subscribed)
4. Quando refresh completa, todos subscribers são notificados com novo token
5. Requests enfileirados são retriados com novo token

## Refresh Token Rotation

**Conceito**: Cada vez que refresh token é usado, novo refresh token é emitido e o antigo é invalidado.

**Security Benefit**: Se refresh token for roubado e usado por atacante, uso pelo legitimate client invalidará token do atacante (ou vice-versa), alertando sobre theft.

**Implementation**:

```javascript
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  const response = await axios.post('https://auth.example.com/oauth/token', {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.CLIENT_ID
  });
  
  const { access_token, refresh_token: newRefreshToken } = response.data;
  
  setAccessToken(access_token);
  
  // Rotation: substituir refresh token
  if (newRefreshToken) {
    setRefreshToken(newRefreshToken);
  } else {
    // Se servidor não retornou novo refresh token, continuar usando antigo
    // (Alguns providers não implementam rotation)
  }
  
  return access_token;
}
```

**Detection de Reutilização (Server-side)**:

Authorization Server deve:
1. Armazenar refresh tokens emitidos
2. Quando refresh token é usado, marcar como "used"
3. Se token já usado é apresentado novamente:
   - Revogar toda a família de tokens (access + refresh)
   - Forçar re-autenticação

**Client Detection**:
```javascript
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && error.response?.data?.error === 'invalid_grant') {
      // Refresh token inválido/revogado - possível theft detection
      console.error('Refresh token revoked - possible security issue');
      clearAllTokens();
      redirectToLogin();
    }
    
    return Promise.reject(error);
  }
);
```

## Storage Seguro de Refresh Tokens

Refresh tokens são mais sensíveis que access tokens (longa duração). Storage estrategy é crítica.

### **Opção 1: In-Memory**

```javascript
let accessToken = null;
let refreshToken = null;

function setTokens(tokens) {
  accessToken = tokens.access_token;
  refreshToken = tokens.refresh_token;
}

function getAccessToken() {
  return accessToken;
}

function getRefreshToken() {
  return refreshToken;
}
```

**Prós**:
- Mais seguro: tokens não persistem em disco
- Não vulnerável a XSS que lê localStorage

**Contras**:
- Tokens perdidos ao refresh de página
- Usuário deve fazer login novamente a cada refresh

**Mitigação**: Usar httpOnly cookies para refresh token (backend gerencia).

### **Opção 2: httpOnly Cookies**

```javascript
// Authorization Server define refresh token como httpOnly cookie
Set-Cookie: refreshToken=abc123; HttpOnly; Secure; SameSite=Strict; Path=/oauth/token
```

**Client**:
```javascript
async function refreshAccessToken() {
  // Cookie enviado automaticamente pelo browser
  const response = await axios.post('https://auth.example.com/oauth/token', {
    grant_type: 'refresh_token',
    client_id: process.env.CLIENT_ID
  }, {
    withCredentials: true // Inclui cookies
  });
  
  const { access_token } = response.data;
  setAccessToken(access_token); // Em memória ou localStorage
  
  return access_token;
}
```

**Prós**:
- HttpOnly: JavaScript não pode acessar (protege contra XSS)
- Secure: apenas HTTPS
- SameSite: protege contra CSRF

**Contras**:
- Requer backend configurar cookies
- CORS complicações (withCredentials)

### **Opção 3: localStorage**

```javascript
function setTokens(tokens) {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
}

function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}
```

**Prós**:
- Simples implementar
- Persiste entre refreshes de página

**Contras**:
- **Vulnerável a XSS**: Malicious script pode ler tokens
- Não recomendado para production com dados sensíveis

**Recomendação**:
- **SPAs**: httpOnly cookies (preferred) ou in-memory + re-auth
- **Mobile apps**: Secure storage (Keychain/Keystore)
- **Server-rendered apps**: Sessions server-side

## Error Handling e Fallbacks

### **Refresh Token Expirado**

```javascript
async function refreshAccessToken() {
  try {
    const response = await axios.post('https://auth.example.com/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: getRefreshToken(),
      client_id: process.env.CLIENT_ID
    });
    
    const { access_token, refresh_token: newRefreshToken } = response.data;
    setAccessToken(access_token);
    if (newRefreshToken) setRefreshToken(newRefreshToken);
    
    return access_token;
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error === 'invalid_grant') {
      // Refresh token expirado ou revogado
      console.warn('Refresh token expired, redirecting to login');
      clearAllTokens();
      redirectToLogin();
    } else {
      // Outro erro (network, server down)
      console.error('Token refresh failed:', error);
      throw error;
    }
  }
}
```

### **Network Errors**

```javascript
async function refreshAccessToken() {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await axios.post('https://auth.example.com/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: getRefreshToken(),
        client_id: process.env.CLIENT_ID
      });
      
      const { access_token } = response.data;
      setAccessToken(access_token);
      return access_token;
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        // Network error, retry
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Token refresh failed after retries');
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
      } else {
        // Outro erro (401, 400), não retry
        throw error;
      }
    }
  }
}
```

### **Preventing Refresh Loops**

```javascript
const MAX_REFRESH_ATTEMPTS = 1;
let refreshAttempts = 0;

apiClient.interceptors.response.use(
  response => {
    // Reset counter em success
    refreshAttempts = 0;
    return response;
  },
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.error('Max refresh attempts exceeded');
        clearAllTokens();
        redirectToLogin();
        return Promise.reject(error);
      }
      
      error.config._retry = true;
      refreshAttempts++;
      
      try {
        const newToken = await refreshAccessToken();
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(error.config);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Best Practices

### **1. Token Expiration Buffering**

Refresh token ANTES de expirar (buffer de 5 minutos):

```javascript
function isTokenExpiringSoon(token, bufferSeconds = 300) {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000;
  return decoded.exp - now < bufferSeconds;
}

apiClient.interceptors.request.use(async config => {
  let token = getAccessToken();
  
  if (isTokenExpiringSoon(token)) {
    token = await refreshAccessToken();
  }
  
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

**Benefício**: Previne 401 errors causados por timing (latência de request).

### **2. Background Refresh**

Refresh periodicamente em background:

```javascript
function startBackgroundRefresh() {
  setInterval(async () => {
    const token = getAccessToken();
    if (token && isTokenExpiringSoon(token, 600)) { // 10 min buffer
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error('Background refresh failed:', error);
      }
    }
  }, 60000); // Check a cada 1 minuto
}

// Iniciar após login
startBackgroundRefresh();
```

### **3. Logging e Monitoring**

```javascript
async function refreshAccessToken() {
  const startTime = Date.now();
  
  try {
    const response = await axios.post('https://auth.example.com/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: getRefreshToken(),
      client_id: process.env.CLIENT_ID
    });
    
    const duration = Date.now() - startTime;
    console.log(`Token refresh successful in ${duration}ms`);
    
    // Send metrics
    sendMetric('token_refresh_success', { duration });
    
    const { access_token } = response.data;
    setAccessToken(access_token);
    return access_token;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Token refresh failed after ${duration}ms:`, error);
    
    sendMetric('token_refresh_failure', { duration, error: error.message });
    throw error;
  }
}
```

### **4. Security Considerations**

- **HTTPS Only**: Nunca enviar tokens sobre HTTP
- **Short-Lived Access Tokens**: 15-60 minutos
- **Refresh Token Rotation**: Invalidar tokens antigos
- **Revocation Endpoint**: Permitir usuários revogar tokens
- **Secure Storage**: httpOnly cookies ou in-memory
- **CSRF Protection**: State parameter, SameSite cookies

---

# 🎯 Aplicabilidade

## Quando Usar Token Refresh

**SPAs e Mobile Apps**: Sessões longas sem forçar re-login.

**OAuth 2.0 Flows**: Authorization Code Flow sempre usa refresh tokens.

**APIs com High Security**: Short-lived access tokens + refresh.

## Quando Considerar Alternativas

**Extreme Simplicity**: Para prototypes, long-lived access tokens podem ser suficientes (menos seguro).

**Stateless APIs**: Se não pode manter refresh token state, access tokens long-lived com validação JWT.

---

# ⚠️ Limitações

## Complexidade de Implementação

Handling de race conditions, refresh loops, concurrent requests adiciona complexidade significativa.

## Storage Trade-offs

Todos métodos de storage têm trade-offs: in-memory (não persiste), localStorage (XSS), cookies (CORS).

## Refresh Token Theft

Se refresh token for roubado, atacante pode obter access tokens indefinidamente até expiração/revogação.

---

# 🔗 Interconexões

## Builds on Bearer Token

Refresh tokens são tipo de Bearer Token.

## Integrates with OAuth 2.0

OAuth 2.0 Authorization Code Flow sempre retorna refresh token.

## Uses Interceptors

Axios interceptors são ideal para implementar refresh logic transparentemente.

---

# 🚀 Evolução

## Refresh Token Rotation Mandatório

OAuth 2.1 draft requer rotation para mitigar theft.

## Sender-Constrained Tokens

DPoP (Demonstrating Proof-of-Possession) previne token theft vinculando tokens a client específico.

## Continuous Access Evaluation

Tokens podem ser revogados em tempo real baseado em eventos de segurança (detecção de anomalias).

---

**Conclusão Integrada**: Token refresh é componente essencial para balancear segurança e UX em aplicações modernas. Implementação com Axios interceptors permite refresh transparente e automático, mas requer handling cuidadoso de race conditions, storage seguro, e error scenarios. Best practices incluem expiration buffering, concurrent request locking, refresh token rotation, e logging robusto. Com estes patterns, você pode construir authentication systems que mantêm usuários logados de forma segura por períodos prolongados sem sacrificar security posture.