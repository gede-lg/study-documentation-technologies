# 🎯 Introdução

Bearer Token authentication representa a evolução moderna de autenticação HTTP, substituindo esquemas mais antigos como Basic Auth em APIs contemporâneas. Ao contrário de Basic Auth que transmite credenciais (username/password) em cada requisição, Bearer Token utiliza token opaco gerado após autenticação inicial bem-sucedida. Este token - tipicamente um JSON Web Token (JWT) ou string aleatória - é então incluído no header `Authorization` de requisições subsequentes, servindo como prova de identidade sem expor credenciais sensíveis repetidamente.

O termo "Bearer" deriva do conceito de que quem possui (bears) o token tem acesso autorizado, similar a como portador de um bilhete físico tem direito de entrada. Esta característica torna Bearer Tokens stateless: o servidor não precisa manter sessão para cada cliente, apenas validar o token apresentado. Para JWTs, validação é feita verificando assinatura criptográfica e claims contidos no token; para tokens opacos, consulta a database ou cache verifica validade.

A superioridade de Bearer Tokens sobre Basic Auth manifesta-se em múltiplas dimensões de segurança e funcionalidade. Tokens podem ter **expiration time**, limitando janela de exploração se comprometidos. Podem ser **revogados individualmente** sem afetar outras sessões do usuário. Podem conter **scopes e permissões** embutidos (no caso de JWTs), permitindo autorização granular. E crucialmente, separação entre processo de autenticação (obter token) e autorização (usar token) permite arquiteturas mais flexíveis, incluindo delegação de acesso via OAuth 2.0.

No ecossistema Axios, implementar Bearer Token authentication é direto: tokens são injetados no header `Authorization` com prefixo "Bearer ", manualmente ou via interceptors. A flexibilidade do Axios permite patterns sofisticados como refresh automático de tokens expirados, retry de requisições após renovação, e gerenciamento centralizado de tokens em aplicações complexas.

Este módulo explora Bearer Token authentication em profundidade, desde fundamentos do protocolo até implementações enterprise-grade com Axios, incluindo storage seguro de tokens, patterns de refresh, integração com JWT, e comparações com esquemas alternativos.

---

# 📋 Sumário

### **Fundamentos de Bearer Token**
- Conceito e origem (RFC 6750)
- Bearer vs Basic authentication
- Stateless authentication model
- Token como proof of authorization

### **Estrutura do Header Authorization**
- Formato: `Authorization: Bearer <token>`
- Diferenças do Basic scheme
- Case sensitivity e formatting
- Token encoding (geralmente não Base64)

### **JSON Web Tokens (JWT)**
- Estrutura JWT (header.payload.signature)
- Claims e metadata em tokens
- Verificação de assinatura
- JWT vs tokens opacos

### **Implementação no Axios**
- Manual: injeção via headers
- Interceptors para adicionar tokens automaticamente
- Configuração global vs per-request
- Remoção de tokens (logout)

### **Token Storage**
- localStorage vs sessionStorage vs memory
- Segurança de storage em browsers
- XSS risks e mitigations
- Secure storage em aplicações nativas

### **Token Lifecycle**
- Obtenção de token (login endpoint)
- Uso de token em requisições
- Refresh de tokens expirados
- Revogação e logout

### **Error Handling**
- 401 Unauthorized com Bearer
- Diferenciando token ausente vs inválido vs expirado
- Retry logic com token refresh
- Redirect para login

### **Security Best Practices**
- Token expiration e rotation
- HTTPS requirement
- Token scope e least privilege
- Refresh tokens vs access tokens

---

# 🧠 Fundamentos

## Conceito e Origem (RFC 6750)

Bearer Token authentication foi formalizado na RFC 6750 ("The OAuth 2.0 Authorization Framework: Bearer Token Usage") publicada em 2012. A especificação define como tokens de acesso são usados para acessar recursos protegidos em HTTP.

**Definição RFC**: "A security token with the property that any party in possession of the token (a 'bearer') can use the token in any way that any other party in possession of it can. Using a bearer token does not require a bearer to prove possession of cryptographic key material (proof-of-possession)."

Em outras palavras: **possuir o token é suficiente para acesso**, sem necessidade de provas criptográficas adicionais. Isto simplifica implementação mas exige proteção rigorosa do token contra roubo.

**Contexto OAuth 2.0**: Bearer Tokens emergem primariamente do framework OAuth 2.0, onde são usados como access tokens. No entanto, o conceito é genérico e aplicável fora de OAuth - qualquer API pode emitir tokens e exigir autenticação Bearer.

## Bearer vs Basic Authentication

**Basic Authentication**:
```http
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```
- Transmite credenciais (`username:password` encoded em Base64)
- Credenciais enviadas em **cada requisição**
- Sem expiration (credenciais válidas indefinidamente)
- Revogar acesso requer trocar password

**Bearer Token**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Transmite **token** (não credenciais)
- Token obtido após autenticação inicial
- Pode ter **expiration** (ex: 1 hora)
- Revogável individualmente sem afetar outras sessões

**Vantagens de Bearer**:
1. **Separation of Concerns**: Autenticação (obter token) separada de autorização (usar token)
2. **Expiration**: Tokens expiram, limitando janela de risco
3. **Revogação Granular**: Revogar token específico sem invalidar outros
4. **Scopes**: Tokens podem conter permissões específicas
5. **Delegação**: Suporta cenários OAuth onde user delega acesso a third-party

## Stateless Authentication Model

Bearer Tokens habilitam autenticação stateless, especialmente quando usados como JWTs:

**Stateful (sessions tradicionais)**:
1. Servidor cria session após login, armazena em database/memory
2. Session ID enviado ao cliente (geralmente via cookie)
3. Cliente envia session ID em cada request
4. Servidor consulta database para validar session

**Stateless (Bearer Tokens)**:
1. Servidor cria token assinado após login
2. Token contém todas as informações necessárias (user ID, permissions)
3. Cliente envia token em cada request
4. Servidor **valida assinatura do token** sem consultar database

**Vantagens Stateless**:
- Escalabilidade: sem dependência de shared session store
- Performance: sem round-trip para database em cada request
- Simplicidade: servidor não mantém estado de sessões

**Desvantagens**:
- Revogação complexa: token válido até expirar (a menos que blacklist seja mantida)
- Token size: JWTs são maiores que session IDs simples

## Token Como Proof of Authorization

Bearer Token atua como prova digital de que portador tem direito de acessar recursos. Processo:

**1. Autenticação Inicial** (obter token):
```javascript
const response = await axios.post('/api/auth/login', {
  username: 'user',
  password: 'pass'
});

const token = response.data.token;
// Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**2. Uso do Token** (proof of authorization):
```javascript
const data = await axios.get('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

Servidor recebe token, valida (verifica assinatura, expiration, claims), e se válido, autoriza acesso.

---

# 🔍 Análise

## Estrutura do Header Authorization

Bearer Token usa mesmo header `Authorization` que Basic Auth, mas com scheme diferente:

```
Authorization: Bearer <token>
```

**Componentes**:
- **Scheme**: `Bearer` (case-insensitive, mas convenção é capitalizar)
- **Espaço**: Separador entre scheme e token
- **Token**: String do token (tipicamente JWT ou random string)

**Exemplo**:
```http
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Importante**: Token **não** é Base64 encoded antes de ser incluído no header (diferente de Basic Auth). JWT já está em formato Base64URL, e tokens opacos são usados como-is.

## JSON Web Tokens (JWT)

JWT é formato comum para Bearer Tokens. Estrutura:

```
header.payload.signature
```

**Exemplo JWT**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Decodificação** (qualquer um pode decodificar - não é encryption):

**Header** (decoded):
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload** (decoded):
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Signature**: Hash criptográfico do header + payload usando secret key. **Apenas** servidor com secret key pode gerar assinatura válida, prevenindo falsificação.

**Claims Comuns**:
- `sub` (subject): User ID
- `iat` (issued at): Timestamp de criação
- `exp` (expiration): Timestamp de expiração
- `iss` (issuer): Quem emitiu o token
- `aud` (audience): Para quem o token é destinado
- Custom claims: `roles`, `permissions`, `email`, etc.

**JWT vs Tokens Opacos**:

**JWT**:
- Self-contained: todas informações no token
- Decodificável (mas assinatura previne tampering)
- Não requer database lookup para validar

**Opaque Token**:
- Random string (ex: `7d3f9e2a-4b1c-4e8f-9a0b-1c2d3e4f5a6b`)
- Não contém informações
- Servidor deve consultar database/cache para validar

## Implementação Manual no Axios

**Básico**: Adicionar header manualmente em cada request:

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

axios.get('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

axios.post('/api/items', data, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Problema**: Repetitivo e propenso a erros (esquecer header, typos).

## Implementação com Interceptors (Recomendado)

**Request Interceptor**: Adiciona token automaticamente a todas as requisições:

```javascript
let token = null;

// Função para setar token após login
function setAuthToken(newToken) {
  token = newToken;
}

// Interceptor adiciona token a cada request
axios.interceptors.request.use(
  config => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Uso
async function login(username, password) {
  const response = await axios.post('/api/auth/login', {
    username,
    password
  });
  
  setAuthToken(response.data.token);
}

// Agora todas as requisições incluem token automaticamente
axios.get('/api/users'); // Authorization header adicionado automaticamente
axios.post('/api/items', data);
```

**Vantagem**: Centraliza lógica de autenticação, elimina repetição.

## Configuração Global (Alternativa)

```javascript
// Após login
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Todas as requisições agora incluem token
axios.get('/api/users');

// Remover token (logout)
delete axios.defaults.headers.common['Authorization'];
```

**Desvantagem**: Mais difícil gerenciar múltiplas instances do Axios com tokens diferentes.

## Instance-Based Token Management

Para apps complexas com múltiplos API clients:

```javascript
// Create authenticated client
function createAuthenticatedClient(token) {
  return axios.create({
    baseURL: 'https://api.example.com',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

// Uso
const authClient = createAuthenticatedClient(userToken);
authClient.get('/api/users');

// Cliente separado para API diferente
const adminClient = createAuthenticatedClient(adminToken);
adminClient.get('/api/admin/settings');
```

## Token Storage

**Option 1: In-Memory (Mais Seguro)**:
```javascript
// Token apenas em variável JavaScript
let authToken = null;

function setToken(token) {
  authToken = token;
}

function getToken() {
  return authToken;
}

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
```

**Vantagens**:
- Não vulnerável a XSS (token não acessível via `document.cookie` ou storage APIs)
- Limpa automaticamente ao fechar tab/browser

**Desvantagens**:
- Perdido ao reload da página
- Não persiste entre sessões

**Option 2: localStorage (Persistente mas Menos Seguro)**:
```javascript
function setToken(token) {
  localStorage.setItem('authToken', token);
}

function getToken() {
  return localStorage.getItem('authToken');
}

function removeToken() {
  localStorage.removeItem('authToken');
}

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
```

**Vantagens**:
- Persiste entre reloads e sessões
- Conveniente para UX

**Desvantagens**:
- Vulnerável a XSS: script malicioso pode `localStorage.getItem('authToken')`
- Não expira automaticamente

**Option 3: sessionStorage (Meio-Termo)**:
```javascript
function setToken(token) {
  sessionStorage.setItem('authToken', token);
}

function getToken() {
  return sessionStorage.getItem('authToken');
}
```

**Vantagens**:
- Persiste durante sessão (reloads)
- Limpa ao fechar tab

**Desvantagens**:
- Ainda vulnerável a XSS

**Best Practice**: In-memory para SPAs com short-lived access tokens + refresh token em httpOnly cookie (abordado em módulo de token refresh).

## Token Lifecycle

**1. Obtenção (Login)**:
```javascript
async function login(username, password) {
  try {
    const response = await axios.post('/api/auth/login', {
      username,
      password
    });
    
    const { token } = response.data;
    setToken(token);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data };
  }
}
```

**2. Uso em Requisições**:
```javascript
// Interceptor já adiciona token automaticamente
const users = await axios.get('/api/users');
```

**3. Expiração**:
JWT contém claim `exp`:
```json
{
  "exp": 1699999999
}
```

Servidor rejeita token expirado com 401. Cliente deve obter novo token (via refresh).

**4. Logout**:
```javascript
function logout() {
  removeToken();
  
  // Opcional: notificar servidor para blacklist token
  axios.post('/api/auth/logout').catch(() => {
    // Ignore errors - token já removido localmente
  });
}
```

## Error Handling com Bearer Tokens

**401 Unauthorized - Token Ausente**:
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authHeader = error.config.headers['Authorization'];
      
      if (!authHeader) {
        console.error('No token provided');
        redirectToLogin();
      }
    }
    
    return Promise.reject(error);
  }
);
```

**401 Unauthorized - Token Inválido ou Expirado**:
```javascript
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const authHeader = error.config.headers['Authorization'];
      
      if (authHeader) {
        // Token presente mas inválido/expirado
        console.error('Invalid or expired token');
        
        // Tentar refresh (abordado em módulo seguinte)
        const newToken = await refreshToken();
        
        if (newToken) {
          // Retry request original com novo token
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return axios.request(error.config);
        }
        
        // Refresh falhou, redirect para login
        redirectToLogin();
      }
    }
    
    return Promise.reject(error);
  }
);
```

**Diferenciando Tipos de Erro 401**:
Alguns servidores incluem details no response body:

```javascript
if (error.response?.status === 401) {
  const errorCode = error.response.data?.code;
  
  switch (errorCode) {
    case 'TOKEN_EXPIRED':
      // Tentar refresh
      break;
    case 'TOKEN_INVALID':
      // Token corrompido, redirect para login
      break;
    case 'TOKEN_REVOKED':
      // Token foi revogado, redirect para login
      break;
    default:
      // Token ausente
      break;
  }
}
```

## Security: HTTPS Requirement

Como Basic Auth, Bearer Tokens **devem** ser transmitidos sobre HTTPS:

```javascript
// ❌ INSEGURO
axios.get('http://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});
// Token pode ser interceptado em plain-text
```

```javascript
// ✅ SEGURO
axios.get('https://api.example.com/data', {
  headers: {
    'Authorization': 'Bearer token123'
  }
});
// Token encriptado via TLS
```

**Diferença de Basic**: Enquanto Basic Auth transmite credenciais permanentes, Bearer transmite token temporário. Mas token ainda dá acesso completo até expirar, então HTTPS é igualmente crítico.

## Token Scopes e Permissions

JWTs podem conter scopes/permissions:

```json
{
  "sub": "user123",
  "roles": ["user", "editor"],
  "permissions": ["read:posts", "write:posts"],
  "exp": 1699999999
}
```

**Validação Client-Side** (não substitui validação server-side):
```javascript
import jwtDecode from 'jwt-decode';

function hasPermission(token, permission) {
  try {
    const decoded = jwtDecode(token);
    return decoded.permissions?.includes(permission);
  } catch {
    return false;
  }
}

// Uso
const token = getToken();
if (hasPermission(token, 'write:posts')) {
  // Mostrar UI de criação de post
}
```

**Importante**: Validação client-side é apenas para UX. Servidor **deve** validar permissões em cada request.

## Refresh Tokens vs Access Tokens

Pattern comum: usar dois tipos de tokens:

**Access Token**:
- Short-lived (ex: 15 minutos)
- Usado em requisições API
- Armazenado em memória

**Refresh Token**:
- Long-lived (ex: 7 dias)
- Usado apenas para obter novo access token
- Armazenado em httpOnly cookie (mais seguro)

```javascript
// Login retorna ambos
const response = await axios.post('/api/auth/login', credentials);
const { accessToken, refreshToken } = response.data;

// Access token em memória
setAccessToken(accessToken);

// Refresh token em httpOnly cookie (servidor seta)
// Não acessível via JavaScript (proteção contra XSS)

// Quando access token expira, usar refresh para obter novo
async function refreshAccessToken() {
  const response = await axios.post('/api/auth/refresh', {}, {
    withCredentials: true // Envia httpOnly cookie
  });
  
  const { accessToken } = response.data;
  setAccessToken(accessToken);
  return accessToken;
}
```

Isto será explorado em profundidade no próximo módulo (Token Refresh).

---

# 🎯 Aplicabilidade

## Cenários Ideais

**APIs REST Modernas**: Bearer Token é padrão de facto para APIs RESTful.

**Single-Page Applications (SPAs)**: Ideal para SPAs que fazem múltiplas chamadas API.

**Mobile Apps**: Tokens podem ser armazenados em secure storage nativo.

**Microservices**: Tokens stateless permitem autenticação distribuída sem shared session store.

**OAuth 2.0 Integrations**: Bearer Tokens são formato padrão de access tokens OAuth.

## Quando Considerar Alternativas

**Public APIs**: API Keys podem ser mais simples para identificação de clients.

**Real-Time Applications**: WebSocket authentication pode usar tokens em handshake inicial.

**Extreme Security Requirements**: mTLS (mutual TLS) oferece segurança superior.

---

# ⚠️ Limitações

## Token Theft Vulnerability

Se token é roubado (via XSS, network sniffing sem HTTPS), atacante tem acesso completo até token expirar.

**Mitigação**:
- Short expiration times
- Secure storage
- HTTPS obrigatório
- Token rotation

## Revogação Complexa

Tokens stateless (JWTs) são válidos até expirar. Revogar token antes de expiration requer:
- Blacklist (negando stateless benefits)
- Short-lived tokens + refresh tokens

## Token Size

JWTs são significativamente maiores que session IDs ou tokens opacos:
- JWT: ~200-500 bytes
- Session ID: ~32 bytes

Em high-traffic scenarios, overhead de bandwidth pode ser considerável.

## XSS Risks com localStorage

Armazenar tokens em localStorage/sessionStorage expõe a XSS attacks.

**Mitigação**:
- In-memory storage para access tokens
- httpOnly cookies para refresh tokens
- Content Security Policy (CSP)

---

# 🔗 Interconexões

## Relação com Basic Auth

Ambos usam header `Authorization`, mas schemes diferentes (`Bearer` vs `Basic`).

## Integração com Interceptors

Interceptors são pattern recomendado para adicionar Bearer Tokens automaticamente.

## Preparação para OAuth 2.0

Bearer Tokens são formato de access tokens em OAuth 2.0 (próximo módulo).

## Relação com Token Refresh

Token refresh (módulo seguinte) estende Bearer pattern com refresh tokens para renovação automática.

---

# 🚀 Evolução

## De Sessions para Tokens

**Era Sessions** (2000s):
- Stateful
- Session ID em cookie
- Server mantém session store

**Era Tokens** (2010s+):
- Stateless
- JWT com claims
- Sem server-side session storage

## JWT Adoption

JWTs tornaram-se padrão de facto para Bearer Tokens por:
- Self-contained (sem database lookups)
- Interoperável (libraries em todas as languages)
- Standardized (RFC 7519)

## Trend: Short-Lived Tokens

Movimento de long-lived tokens (horas/dias) para short-lived (minutos) com refresh tokens para balance segurança/UX.

## Future: Token Binding

Proposta para vincular tokens a TLS connection, prevenindo token replay attacks.

## Passwordless Authentication

Tendência para passwordless (magic links, WebAuthn) mas ainda usa Bearer Tokens após autenticação inicial.

---

**Conclusão Integrada**: Bearer Token authentication é espinha dorsal de APIs modernas, oferecendo balance entre segurança, performance, e developer experience. No Axios, implementação via interceptors fornece abstração limpa que centraliza lógica de autenticação. Compreender lifecycle completo de tokens - obtenção, storage, uso, expiration, revogação - é fundamental para construir aplicações seguras e resilientes. Próximo módulo explorará OAuth 2.0, onde Bearer Tokens são componente central de delegação de acesso.