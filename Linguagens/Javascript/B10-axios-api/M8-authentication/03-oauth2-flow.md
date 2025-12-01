# 🎯 Introdução

OAuth 2.0 representa paradigm shift na autenticação e autorização web, movendo-se de modelos tradicionais onde aplicações requerem credenciais diretas do usuário para framework de delegação de acesso onde usuários autorizam aplicações third-party sem compartilhar passwords. Especificado na RFC 6749, OAuth 2.0 tornou-se protocolo dominante para integrações API modernas, permitindo cenários como "Login com Google", "Conectar com Facebook", e acesso controlado de apps mobile a serviços cloud.

O problema fundamental que OAuth 2.0 resolve é o **password anti-pattern**: em modelos pré-OAuth, se você quisesse que um app third-party (ex: ferramenta de analytics) acessasse sua conta em um serviço (ex: Twitter), precisaria fornecer seu username e password do Twitter para o app. Isto cria riscos catastróficos: o app tem acesso ilimitado à sua conta, pode fazer qualquer operação, e você não tem como revogar acesso sem trocar password (afetando todos os outros apps). OAuth elimina este anti-pattern através de tokens de acesso com escopo limitado que usuários concedem e podem revogar individualmente.

O fluxo OAuth envolve múltiplos participantes: **Resource Owner** (usuário), **Client** (aplicação que quer acesso), **Authorization Server** (valida credenciais e emite tokens), e **Resource Server** (API com dados protegidos). O protocolo define flows (authorization code, implicit, client credentials, etc.) que orquestram interações entre estes participantes, resultando em token de acesso que o Client usa para acessar recursos em nome do usuário.

No contexto Axios, OAuth 2.0 apresenta desafios únicos: enquanto obtenção inicial de token frequentemente ocorre via redirects de browser (fora do escopo do Axios), o uso subsequente de tokens e refresh automático são perfeitos use cases para interceptors e error handling do Axios. Implementar OAuth client-side requer compreensão de PKCE (Proof Key for Code Exchange) para segurança em public clients, storage seguro de tokens, e patterns robustos de refresh.

Este módulo explora OAuth 2.0 em profundidade: desde conceitos fundamentais e flows até implementação prática com Axios, incluindo integration com providers populares (Google, GitHub), handling de tokens, e best practices de segurança para SPAs.

---

# 📋 Sumário

### **Fundamentos de OAuth 2.0**
- Problema resolvido pelo OAuth
- Roles: Resource Owner, Client, Authorization Server, Resource Server
- Diferença entre autenticação e autorização
- OAuth 2.0 vs OAuth 1.0

### **OAuth 2.0 Flows (Grant Types)**
- Authorization Code Flow (com PKCE)
- Implicit Flow (deprecated para SPAs)
- Client Credentials Flow
- Resource Owner Password Credentials (legacy)

### **Authorization Code Flow Detalhado**
- Step-by-step flow
- Authorization request (redirect para login)
- Authorization response (código)
- Token exchange (código por access token)
- Uso de access token

### **PKCE (Proof Key for Code Exchange)**
- Problema resolvido por PKCE
- Code verifier e code challenge
- PKCE para public clients (SPAs, mobile apps)
- Implementation details

### **Tokens em OAuth 2.0**
- Access tokens
- Refresh tokens
- ID tokens (OpenID Connect)
- Token introspection

### **Scopes e Permissions**
- Conceito de scopes
- Granular permissions
- Solicitação de scopes na authorization request
- Validação de scopes

### **Implementação no Axios**
- Obtenção de authorization code (browser redirect)
- Exchange de código por token (Axios POST)
- Uso de access token em requests
- Refresh automático via interceptors

### **OAuth Providers Integration**
- Google OAuth 2.0
- GitHub OAuth
- Facebook Login
- Generic OAuth provider

---

# 🧠 Fundamentos

## Problema Resolvido pelo OAuth

**Cenário Pré-OAuth**:
Você usa Twitter e quer integrar com ferramenta de analytics que mostra estatísticas dos seus tweets. Ferramenta precisa acessar Twitter API em seu nome.

**Solução Insegura** (password sharing):
1. Você fornece username e password do Twitter para a ferramenta
2. Ferramenta usa suas credenciais para acessar Twitter API
3. **Problemas**:
   - Ferramenta tem acesso completo (pode postar, deletar, trocar password)
   - Você não pode revogar acesso da ferramenta sem trocar password
   - Se ferramenta for comprometida, sua conta inteira está em risco
   - Você não sabe quais ações ferramenta está fazendo

**Solução OAuth 2.0**:
1. Você é redirecionado para Twitter, faz login lá
2. Twitter pergunta: "Ferramenta X quer acessar seus tweets. Permitir?"
3. Você autoriza com scopes específicos (ex: apenas leitura de tweets)
4. Twitter emite token de acesso para ferramenta com permissões limitadas
5. Ferramenta usa token para acessar apenas tweets (não pode postar, deletar)
6. Você pode revogar token a qualquer momento sem afetar outras aplicações

**Benefícios**:
- Usuário nunca compartilha credenciais
- Acesso granular via scopes
- Revogação individual de apps
- Audit trail de quais apps têm acesso

## Roles no OAuth 2.0

**1. Resource Owner (RO)**: 
- Tipicamente o **usuário** final
- Possui dados protegidos
- Autoriza acesso a estes dados

**2. Client**:
- **Aplicação** que quer acessar dados protegidos
- Pode ser webapp, SPA, mobile app, ou server-side application
- Tipos:
  - **Confidential**: Pode manter secrets seguros (server-side apps)
  - **Public**: Não pode manter secrets (SPAs, mobile apps)

**3. Authorization Server (AS)**:
- Valida identidade do Resource Owner
- Obtém consentimento para acesso
- **Emite tokens** de acesso

**4. Resource Server (RS)**:
- Hospeda recursos protegidos (API)
- Valida access tokens
- Serve dados se token for válido

**Exemplo Concreto**:
- **Resource Owner**: Você (usuário do Google)
- **Client**: App de calendário third-party
- **Authorization Server**: Google OAuth 2.0 endpoint
- **Resource Server**: Google Calendar API

## Autenticação vs Autorização

**Autenticação**: Provar identidade ("Quem é você?")
- OAuth 2.0 **não é** protocolo de autenticação
- OAuth foca em **autorização** (delegação de acesso)

**Autorização**: Conceder permissões ("O que você pode fazer?")
- OAuth 2.0 **é** protocolo de autorização
- Define como apps obtêm tokens para acessar recursos

**OpenID Connect (OIDC)**: Layer sobre OAuth 2.0 que **adiciona autenticação**
- Baseado em OAuth 2.0
- Adiciona ID Token (JWT com informações do usuário)
- Usado para "Login com Google", "Login com Facebook"

**Confusão Comum**: Muitos referem-se a "OAuth login", mas tecnicamente é **OpenID Connect** que fornece autenticação, usando OAuth 2.0 como base.

## OAuth 2.0 vs OAuth 1.0

**OAuth 1.0** (2007):
- Complexo: requer assinatura criptográfica de cada request
- Funciona sem HTTPS (assinatura fornece integridade)
- Difícil implementar corretamente

**OAuth 2.0** (2012):
- Simplificado: tokens Bearer sem assinatura de requests
- **Requer HTTPS** para segurança
- Múltiplos flows para diferentes tipos de clients
- Amplamente adotado, OAuth 1.0 é legacy

---

# 🔍 Análise

## OAuth 2.0 Flows (Grant Types)

OAuth 2.0 define múltiplos flows dependendo do tipo de client:

### **1. Authorization Code Flow (+ PKCE)**

**Uso**: Webapps, SPAs, mobile apps (com PKCE)

**Flow Resumido**:
1. Client redireciona usuário para Authorization Server
2. Usuário faz login e autoriza
3. Authorization Server redireciona de volta com **authorization code**
4. Client troca código por **access token** (backend request)
5. Client usa access token para acessar Resource Server

**Mais Seguro**: Access token nunca exposto ao browser (apenas código temporário).

### **2. Implicit Flow**

**Uso**: SPAs (DEPRECATED)

**Flow Resumido**:
1. Client redireciona usuário para Authorization Server
2. Usuário faz login e autoriza
3. Authorization Server redireciona de volta com **access token diretamente**

**Problema**: Access token exposto na URL (fragment), vulnerável a leaks. **Não use para novos projetos** - use Authorization Code + PKCE.

### **3. Client Credentials Flow**

**Uso**: Machine-to-machine, sem usuário envolvido

**Flow Resumido**:
1. Client envia client_id e client_secret para Authorization Server
2. Authorization Server retorna access token
3. Client usa token para acessar API

**Exemplo**: Backend service acessando outra API.

### **4. Resource Owner Password Credentials**

**Uso**: Legacy (não recomendado)

**Flow Resumido**:
1. Usuário fornece username/password diretamente ao Client
2. Client envia credenciais para Authorization Server
3. Authorization Server retorna access token

**Problema**: Derrota propósito de OAuth (não compartilhar passwords). Apenas para migração de sistemas legados.

## Authorization Code Flow Detalhado

Flow mais comum e seguro para aplicações web:

### **Step 1: Authorization Request**

Client redireciona usuário para Authorization Server:

```javascript
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', 'YOUR_CLIENT_ID');
authUrl.searchParams.set('redirect_uri', 'https://yourapp.com/callback');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'openid email profile');
authUrl.searchParams.set('state', 'random-state-string'); // CSRF protection

// Redirecionar usuário
window.location.href = authUrl.toString();
```

**Parâmetros**:
- `client_id`: ID da sua aplicação (público)
- `redirect_uri`: Onde Authorization Server redirecionará após login
- `response_type`: `code` (indica Authorization Code Flow)
- `scope`: Permissões solicitadas
- `state`: String aleatória para prevenir CSRF attacks

### **Step 2: User Authorization**

Usuário:
1. É redirecionado para Authorization Server (ex: Google login)
2. Faz login (se não autenticado)
3. Vê tela de consentimento: "App X quer acessar [scopes]. Permitir?"
4. Autoriza ou rejeita

### **Step 3: Authorization Response**

Se usuário autoriza, Authorization Server redireciona de volta:

```
https://yourapp.com/callback?code=AUTH_CODE_HERE&state=random-state-string
```

**Parâmetros**:
- `code`: Authorization code (short-lived, ~10 minutos)
- `state`: Mesmo valor enviado (verificar para CSRF protection)

Client deve:
1. Verificar que `state` corresponde ao enviado
2. Extrair `code`

```javascript
// Em /callback route
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

if (state !== expectedState) {
  throw new Error('CSRF attack detected');
}

// Prosseguir para trocar code por token
```

### **Step 4: Token Exchange**

Client troca authorization code por access token:

```javascript
const response = await axios.post('https://oauth2.googleapis.com/token', {
  code: code,
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET', // Apenas para confidential clients
  redirect_uri: 'https://yourapp.com/callback',
  grant_type: 'authorization_code'
});

const { access_token, refresh_token, expires_in } = response.data;

// Armazenar tokens
setAccessToken(access_token);
setRefreshToken(refresh_token);
```

**Importante**: Este request é **backend-to-backend** (não expõe client_secret ao browser). Para SPAs, usar PKCE (sem client_secret).

### **Step 5: Uso do Access Token**

```javascript
const userData = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});

console.log(userData.data);
// { id: '...', email: '...', name: '...', picture: '...' }
```

## PKCE (Proof Key for Code Exchange)

PKCE é extensão do Authorization Code Flow para **public clients** (SPAs, mobile apps) que não podem manter client_secret seguro.

### **Problema Resolvido**

Sem PKCE:
1. Malicious app pode interceptar authorization code (via custom URL scheme hijacking em mobile)
2. Malicious app troca código por token (sem precisar de client_secret se fluxo não exigir)
3. Atacante obtém access token

Com PKCE:
1. Código só pode ser trocado por quem iniciou o fluxo (prova via code_verifier)

### **PKCE Flow**

**Step 1: Client gera code verifier e challenge**

```javascript
// Gerar code verifier (random string)
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

// Gerar code challenge (SHA256 hash do verifier)
async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = await generateCodeChallenge(codeVerifier);

// Armazenar code_verifier (será usado depois)
sessionStorage.setItem('code_verifier', codeVerifier);
```

**Step 2: Authorization Request com PKCE**

```javascript
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', 'YOUR_CLIENT_ID');
authUrl.searchParams.set('redirect_uri', 'https://yourapp.com/callback');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'openid email');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256'); // SHA256

window.location.href = authUrl.toString();
```

**Step 3: Token Exchange com code_verifier**

```javascript
const codeVerifier = sessionStorage.getItem('code_verifier');

const response = await axios.post('https://oauth2.googleapis.com/token', {
  code: authorizationCode,
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: 'https://yourapp.com/callback',
  grant_type: 'authorization_code',
  code_verifier: codeVerifier // Prova que é o mesmo client
});

const { access_token } = response.data;
```

**Validação pelo Authorization Server**:
1. Server recebe `code_verifier`
2. Calcula `SHA256(code_verifier)`
3. Compara com `code_challenge` armazenado
4. Se corresponder, emite token; caso contrário, rejeita

**Segurança**: Mesmo se código for interceptado, atacante não tem `code_verifier` original (armazenado em sessionStorage do client legítimo), então não pode trocar código por token.

## Tokens em OAuth 2.0

### **Access Token**

- Usado para acessar Resource Server
- Short-lived (ex: 1 hora)
- Formato: JWT ou opaque string
- Incluído em header `Authorization: Bearer <token>`

### **Refresh Token**

- Usado para obter novo access token quando expira
- Long-lived (ex: 30 dias, 6 meses)
- Mais sensível que access token (armazenar com cuidado)
- Enviado para Authorization Server, não Resource Server

### **ID Token** (OpenID Connect)

- JWT contendo informações do usuário
- Claims: `sub` (user ID), `name`, `email`, `picture`, etc.
- Usado para autenticação (não autorização)
- Não enviado para Resource Server

**Exemplo Response**:
```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "refresh_token": "1//0gZ9...",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

## Scopes e Permissions

Scopes definem granularidade de acesso:

**Google Scopes**:
- `openid`: Autenticação básica
- `email`: Acesso ao email do usuário
- `profile`: Acesso ao perfil (nome, foto)
- `https://www.googleapis.com/auth/calendar`: Acesso ao Google Calendar

**GitHub Scopes**:
- `repo`: Full access to repositories
- `read:user`: Read-only access to user profile
- `write:org`: Write access to organizations

**Solicitando Scopes**:
```javascript
authUrl.searchParams.set('scope', 'openid email profile repo');
```

**Verificando Scopes no Token**:
```javascript
import jwtDecode from 'jwt-decode';

const decoded = jwtDecode(accessToken);
console.log(decoded.scope); // "openid email profile"
```

**Least Privilege**: Solicitar apenas scopes necessários. Usuários são mais propensos a autorizar apps que pedem menos permissões.

## Implementação Completa no Axios

### **Etapa 1: Initiating OAuth Flow (Browser)**

```javascript
// oauth-client.js
export function initiateOAuthFlow() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateRandomString();
  
  // Armazenar para uso posterior
  sessionStorage.setItem('oauth_code_verifier', codeVerifier);
  sessionStorage.setItem('oauth_state', state);
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', window.location.origin + '/callback');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);
  
  window.location.href = authUrl.toString();
}
```

### **Etapa 2: Handling Callback (Axios)**

```javascript
// callback-handler.js
export async function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  
  // CSRF protection
  const expectedState = sessionStorage.getItem('oauth_state');
  if (state !== expectedState) {
    throw new Error('State mismatch - possible CSRF attack');
  }
  
  // Token exchange
  const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
  
  const response = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: window.location.origin + '/callback',
    grant_type: 'authorization_code',
    code_verifier: codeVerifier
  });
  
  const { access_token, refresh_token, id_token } = response.data;
  
  // Limpar storage
  sessionStorage.removeItem('oauth_code_verifier');
  sessionStorage.removeItem('oauth_state');
  
  // Armazenar tokens
  setTokens({ access_token, refresh_token, id_token });
  
  return { success: true };
}
```

### **Etapa 3: Using Access Token**

```javascript
// api-client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://www.googleapis.com/oauth2/v2'
});

// Interceptor adiciona access token
apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Uso
export async function getUserInfo() {
  const response = await apiClient.get('/userinfo');
  return response.data;
}
```

### **Etapa 4: Token Refresh**

```javascript
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expirado, tentar refresh
      const refreshToken = getRefreshToken();
      
      if (refreshToken) {
        try {
          const response = await axios.post('https://oauth2.googleapis.com/token', {
            refresh_token: refreshToken,
            client_id: process.env.GOOGLE_CLIENT_ID,
            grant_type: 'refresh_token'
          });
          
          const { access_token } = response.data;
          setAccessToken(access_token);
          
          // Retry original request
          error.config.headers['Authorization'] = `Bearer ${access_token}`;
          return axios.request(error.config);
        } catch (refreshError) {
          // Refresh falhou, redirect para login
          redirectToLogin();
        }
      } else {
        redirectToLogin();
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Integration com Providers Populares

### **Google OAuth 2.0**

```javascript
const GOOGLE_CONFIG = {
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  scopes: 'openid email profile'
};
```

### **GitHub OAuth**

```javascript
const GITHUB_CONFIG = {
  authUrl: 'https://github.com/login/oauth/authorize',
  tokenUrl: 'https://github.com/login/oauth/access_token',
  userInfoUrl: 'https://api.github.com/user',
  scopes: 'read:user user:email'
};

// GitHub não suporta PKCE, requer client_secret
// Trocar código por token DEVE ser feito em backend
```

### **Facebook Login**

```javascript
const FACEBOOK_CONFIG = {
  authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
  tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
  userInfoUrl: 'https://graph.facebook.com/me',
  scopes: 'email public_profile'
};
```

---

# 🎯 Aplicabilidade

## Quando Usar OAuth 2.0

**Third-Party Integrations**: App precisa acessar dados de outro serviço em nome do usuário.

**Social Login**: "Login com Google/Facebook/GitHub".

**API com Granular Permissions**: Diferentes clients precisam diferentes níveis de acesso.

**Multi-Tenant Applications**: Usuários de diferentes organizações com scopes diferentes.

## Quando Considerar Alternativas

**Simple APIs**: Se não precisa de delegação, Bearer Token simples pode ser suficiente.

**Internal Services**: Machine-to-machine sem usuário pode usar API Keys ou Client Credentials.

**Extreme Simplicity**: Basic Auth pode ser adequado para prototypes ou internal tools.

---

# ⚠️ Limitações

## Complexidade de Implementação

OAuth 2.0 é significativamente mais complexo que Basic Auth ou Bearer simples. Requer compreensão de redirects, PKCE, state management.

## Dependência de Third-Party

Se usando social login, dependência de provider (Google, Facebook) - se provider tem downtime, login falha.

## Token Theft Risks

Access tokens ainda podem ser roubados via XSS. PKCE mitiga alguns risks mas não todos.

## Revogação Delay

Revogar token pode ter delay (caches, distributed systems). Access token short-lived mitiga.

---

# 🔗 Interconexões

## Builds on Bearer Token

OAuth 2.0 usa Bearer Tokens como formato de access tokens.

## Enables Token Refresh

Refresh tokens (próximo módulo) são componente central de OAuth 2.0.

## OpenID Connect Layer

OIDC adiciona autenticação sobre OAuth 2.0 authorization.

---

# 🚀 Evolução

## OAuth 2.1 (Draft)

Consolidação de best practices:
- PKCE obrigatório para todos os public clients
- Deprecação oficial do Implicit Flow
- Refresh token rotation obrigatória

## GNAP (Grant Negotiation and Authorization Protocol)

Sucessor proposto de OAuth 2.0, mais flexível e moderno.

## Zero-Trust Architecture

OAuth integra-se bem com zero-trust models onde cada request é autorizado.

---

**Conclusão Integrada**: OAuth 2.0 é framework essencial para autenticação e autorização modernas, permitindo delegação segura de acesso. Implementação com Axios requer orquestração cuidadosa de browser redirects para obter authorization code e requests HTTP para trocar código por tokens. PKCE é crítico para segurança de SPAs. Próximo módulo explorará token refresh em profundidade, componente crucial para manter usuários autenticados sem re-login frequente.