# 🎯 Introdução

A autenticação HTTP Basic representa o mecanismo de autenticação mais simples e antigo definido pelo protocolo HTTP, datando da RFC 2617 (posteriormente atualizada pela RFC 7617). Apesar de sua aparente simplicidade, Basic Authentication continua amplamente utilizada em APIs internas, ferramentas de desenvolvimento, e cenários onde HTTPS garante segurança de transporte, tornando sua compreensão essencial para desenvolvedores que trabalham com comunicação HTTP.

O protocolo funciona através do envio de credenciais (username e password) codificadas em Base64 no header `Authorization` de cada requisição HTTP. Esta abordagem stateless elimina a necessidade de sessões server-side ou cookies, simplificando a arquitetura de autenticação. O servidor valida as credenciais em cada request, retornando `401 Unauthorized` se inválidas ou ausentes, com header `WWW-Authenticate: Basic realm="..."` instruindo o cliente a enviar credenciais.

A implementação de Basic Auth no Axios é particularmente elegante: a biblioteca fornece propriedade `auth` dedicada que abstrai completamente a codificação Base64 e formatação do header `Authorization`. Desenvolvedores simplesmente fornecem username e password como objeto JavaScript, e o Axios cuida de todo o processo de codificação e injeção do header apropriado. Esta abstração previne erros comuns de implementação manual, como esquecer o prefixo "Basic " ou codificar incorretamente os caracteres especiais.

No entanto, a simplicidade do Basic Auth vem com trade-offs de segurança críticos. Credenciais são apenas codificadas (não encriptadas), tornando-as trivialmente decodificáveis se interceptadas. Por isso, Basic Auth **deve** ser usado exclusivamente sobre HTTPS em produção. Além disso, como credenciais são enviadas em cada request, há risco aumentado de exposição comparado a esquemas baseados em tokens que permitem rotação e revogação.

Este módulo explora Basic Authentication em profundidade: desde os fundamentos do protocolo até implementações avançadas com Axios, incluindo estratégias de segurança, patterns de armazenamento de credenciais, e quando escolher Basic Auth versus alternativas modernas como Bearer Tokens ou OAuth 2.0.

---

# 📋 Sumário

### **Fundamentos de HTTP Basic Authentication**
- Origem e especificação do protocolo (RFC 7617)
- Fluxo de autenticação request/response
- Estrutura do header Authorization
- Codificação Base64 de credenciais

### **Implementação no Axios**
- Propriedade `auth` do Axios
- Estrutura do objeto auth (username, password)
- Configuração global vs per-request
- Geração automática do header Authorization

### **Base64 Encoding Details**
- Como Base64 encoding funciona
- Por que não é encryption
- Decodificação trivial de credenciais
- Caracteres especiais em username/password

### **Security Considerations**
- Necessidade absoluta de HTTPS
- Riscos de man-in-the-middle attacks
- Comparação com digest authentication
- Quando Basic Auth é apropriado

### **Credential Storage**
- Onde armazenar username/password no cliente
- Environment variables para credenciais
- Evitar hardcoding de credenciais
- Secure storage em aplicações web

### **Error Handling**
- Resposta 401 Unauthorized
- Header WWW-Authenticate
- Retry logic para credenciais inválidas
- User feedback para falhas de autenticação

### **Advanced Patterns**
- Pré-autenticação vs lazy authentication
- Credential refresh strategies
- Combinação com outras formas de autenticação
- Proxy authentication com Basic Auth

### **Alternatives e Comparações**
- Basic Auth vs Bearer Token
- Basic Auth vs OAuth 2.0
- Basic Auth vs API Keys
- Migration paths de Basic Auth

---

# 🧠 Fundamentos

## Origem e Especificação do Protocolo

HTTP Basic Authentication foi definido originalmente na RFC 2617 em 1999, como parte do framework de autenticação HTTP. A especificação foi atualizada em 2015 pela RFC 7617, que clarificou aspectos de encoding (especificando UTF-8 como charset preferido) e descontinuou alguns comportamentos ambiguos da versão anterior.

O protocolo foi projetado para simplicidade máxima: permitir que servidores HTTP restrinjam acesso a recursos exigindo credenciais sem necessidade de infraestrutura complexa de sessões ou cookies. Esta simplicidade tornou Basic Auth ubíquo em contextos onde conveniência supera requisitos de segurança avançada.

**Motivação Original**: Antes de Basic Auth, não havia mecanismo padronizado para autenticação HTTP. Cada aplicação implementava seu próprio sistema, geralmente baseado em formulários HTML e cookies. Basic Auth forneceu alternativa leve e interoperável.

**Evolução**: Apesar de ter sido parcialmente substituído por esquemas mais seguros (Digest Auth, OAuth, JWT), Basic Auth permanece relevante por sua simplicidade e porque, quando combinado com HTTPS, oferece segurança adequada para muitos casos de uso.

## Fluxo de Autenticação Request/Response

O ciclo de autenticação Basic segue pattern bem definido:

**1. Cliente faz requisição inicial sem credenciais**:
```http
GET /api/protected HTTP/1.1
Host: api.example.com
```

**2. Servidor responde com 401 e WWW-Authenticate**:
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="API Access"
Content-Type: application/json

{"error": "Authentication required"}
```

O header `WWW-Authenticate: Basic realm="..."` informa ao cliente:
- Esquema de autenticação esperado: `Basic`
- `realm`: String descritiva indicando área protegida (ex: "API Access", "Admin Panel")

**3. Cliente reenvia requisição com credenciais**:
```http
GET /api/protected HTTP/1.1
Host: api.example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

**4. Servidor valida e responde com sucesso**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{"data": "Protected resource"}
```

**Importante**: Este ciclo de challenge/response acontece apenas na primeira requisição em browsers (que cacheiam credenciais). Em Axios, geralmente enviamos credenciais proativamente em cada request, eliminando o round-trip inicial.

## Estrutura do Header Authorization

O header `Authorization` para Basic Auth tem formato específico:

```
Authorization: Basic <base64-encoded-credentials>
```

Onde `<base64-encoded-credentials>` é:
```
Base64(username + ":" + password)
```

**Exemplo**:
- Username: `admin`
- Password: `secret123`
- String concatenada: `admin:secret123`
- Base64 encoding: `YWRtaW46c2VjcmV0MTIz`
- Header final: `Authorization: Basic YWRtaW46c2VjcmV0MTIz`

**Componentes**:
1. **Scheme identifier**: `Basic` (case-insensitive, mas convenção é capitalizar)
2. **Espaço**: Separador obrigatório entre scheme e credentials
3. **Encoded credentials**: Base64 string contendo `username:password`

**Detalhes Críticos**:
- Colon `:` é delimiter entre username e password
- Se password contém `:`, apenas primeiro `:` é usado como delimiter (username não pode conter `:`)
- Encoding é **Base64**, não encryption - qualquer um pode decodificar

## Codificação Base64 de Credenciais

Base64 é encoding scheme que converte dados binários em representação ASCII usando 64 caracteres (A-Z, a-z, 0-9, +, /). É usado em Basic Auth para garantir que credenciais (que podem conter caracteres especiais) sejam transmitidas de forma segura em headers HTTP (que devem ser ASCII).

**Processo de Encoding**:
```javascript
const username = 'admin';
const password = 'secret123';

// 1. Concatenar com colon
const credentials = `${username}:${password}`; // "admin:secret123"

// 2. Encodar para Base64
const encoded = btoa(credentials); // "YWRtaW46c2VjcmV0MTIz"

// 3. Formatar header
const authHeader = `Basic ${encoded}`;
// "Basic YWRtaW46c2VjcmV0MTIz"
```

**Decodificação** (demonstrando que não é seguro):
```javascript
const authHeader = "Basic YWRtaW46c2VjcmV0MTIz";

// 1. Extrair encoded part
const encoded = authHeader.replace('Basic ', '');

// 2. Decodificar Base64
const decoded = atob(encoded); // "admin:secret123"

// 3. Separar username e password
const [username, password] = decoded.split(':');
console.log(username); // "admin"
console.log(password); // "secret123"
```

**Importante**: Esta decodificação trivial demonstra por que Basic Auth **não é seguro sem HTTPS**. Qualquer atacante interceptando tráfego HTTP pode extrair credenciais instantaneamente.

---

# 🔍 Análise

## Propriedade `auth` do Axios

Axios fornece propriedade `auth` dedicada que abstrai toda a complexidade de Basic Authentication:

```javascript
axios.get('/api/protected', {
  auth: {
    username: 'admin',
    password: 'secret123'
  }
});
```

**Axios automaticamente**:
1. Concatena `username:password`
2. Encodifica para Base64
3. Adiciona header `Authorization: Basic <encoded>`
4. Envia requisição

**Equivalente Manual** (sem `auth`):
```javascript
const credentials = btoa('admin:secret123');

axios.get('/api/protected', {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});
```

A propriedade `auth` é preferível porque:
- Mais legível e declarativa
- Previne erros de formatting
- Consistente com outras features do Axios

## Configuração Global vs Per-Request

**Per-Request** (mais comum):
```javascript
axios.get('/api/users', {
  auth: {
    username: 'admin',
    password: 'secret123'
  }
});
```

**Global Defaults** (para todas as requisições):
```javascript
axios.defaults.auth = {
  username: 'admin',
  password: 'secret123'
};

// Agora toda requisição usa estas credenciais
axios.get('/api/users');
axios.post('/api/items', data);
```

**Instance Defaults** (para instance específico):
```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  auth: {
    username: 'admin',
    password: 'secret123'
  }
});

apiClient.get('/users'); // Usa credenciais automaticamente
```

**Override de Defaults**:
```javascript
axios.defaults.auth = {
  username: 'default-user',
  password: 'default-pass'
};

// Override para esta requisição específica
axios.get('/api/special', {
  auth: {
    username: 'special-user',
    password: 'special-pass'
  }
});
```

**Remover Auth de Requisição Específica**:
```javascript
axios.defaults.auth = { username: 'admin', password: 'secret' };

// Fazer request sem auth
axios.get('/api/public', {
  auth: undefined
});
```

## Caracteres Especiais em Credentials

Username e password podem conter caracteres especiais, mas com cuidados:

**Username com caracteres especiais**:
```javascript
// Username: "user@example.com"
// Password: "pass123"
axios.get('/api/data', {
  auth: {
    username: 'user@example.com',
    password: 'pass123'
  }
});
// Authorization: Basic dXNlckBleGFtcGxlLmNvbTpwYXNzMTIz
```

**Password com colon** (funciona, mas apenas primeiro `:` é delimiter):
```javascript
// Username: "admin"
// Password: "pass:word:123"
axios.get('/api/data', {
  auth: {
    username: 'admin',
    password: 'pass:word:123'
  }
});
// Codificado: "admin:pass:word:123"
// Servidor deve tratar "pass:word:123" como password completo
```

**UTF-8 Characters**:
RFC 7617 especifica UTF-8 para encoding de caracteres não-ASCII:

```javascript
axios.get('/api/data', {
  auth: {
    username: 'usuário',
    password: 'señα123'
  }
});
// Funciona, mas servidor deve suportar UTF-8
```

**Caracteres Problemáticos**:
- Username **não pode** conter `:` (ambiguidade com delimiter)
- Espaços funcionam mas são incomuns
- Newlines e control characters devem ser evitados

## Security Considerations: HTTPS Obrigatório

**Demonstração do Risco sem HTTPS**:

```javascript
// ❌ INSEGURO: HTTP sem encryption
axios.get('http://api.example.com/data', {
  auth: {
    username: 'admin',
    password: 'supersecret'
  }
});
```

**O que acontece**:
1. Request trafega em plain-text pela rede
2. Header: `Authorization: Basic YWRtaW46c3VwZXJzZWNyZXQ=`
3. Qualquer atacante interceptando (via WiFi público, ISP malicioso, etc.) pode:
   - Capturar header
   - Decodificar Base64: `atob('YWRtaW46c3VwZXJzZWNyZXQ=')` → `"admin:supersecret"`
   - Usar credenciais livremente

**Proteção com HTTPS**:
```javascript
// ✅ SEGURO: HTTPS encrypta todo o tráfego
axios.get('https://api.example.com/data', {
  auth: {
    username: 'admin',
    password: 'supersecret'
  }
});
```

Com HTTPS:
1. Entire request (incluindo headers) é encriptado via TLS
2. Atacante interceptando vê apenas dados encriptados
3. Credenciais Basic Auth estão protegidas durante transmissão

**Regra de Ouro**: **NUNCA use Basic Auth sobre HTTP em produção**. Desenvolvimento local em `localhost` é aceitável, mas qualquer tráfego pela internet deve ser HTTPS.

## Comparação com Digest Authentication

Digest Auth é alternativa a Basic Auth que hash-eia credenciais em vez de apenas encodar:

**Basic Auth**:
- Credentials: `username:password` → Base64
- Vulnerável a eavesdropping sem HTTPS
- Simples de implementar

**Digest Auth**:
- Credentials: hash MD5 de username, password, nonce, etc.
- Mais resistente a eavesdropping (mas não completamente seguro)
- Complexo de implementar

**Na Prática**: Digest Auth oferece segurança marginal melhor que Basic sobre HTTP, mas é obsoleto. Solução moderna é **Basic Auth sobre HTTPS**, que é mais simples e tão seguro quanto.

Axios **não suporta Digest Auth nativamente** - seria necessário implementação manual complexa. Para APIs modernas, preferir Bearer Tokens.

## Credential Storage no Cliente

**❌ Anti-Pattern: Hardcoded Credentials**:
```javascript
// NUNCA faça isto
axios.get('/api/data', {
  auth: {
    username: 'admin',
    password: 'hardcoded-password-123'
  }
});
```

Problemas:
- Credenciais expostas no source code
- Difícil rotacionar passwords
- Risco de commit acidental em Git

**✅ Environment Variables**:
```javascript
// .env file (não commitado no Git)
API_USERNAME=admin
API_PASSWORD=secret123

// Código
axios.get('/api/data', {
  auth: {
    username: process.env.API_USERNAME,
    password: process.env.API_PASSWORD
  }
});
```

**✅ Secure Storage em Browsers**:
Para aplicações web onde usuário fornece credenciais:

```javascript
// Armazenar em memória (mais seguro)
let credentials = null;

function login(username, password) {
  credentials = { username, password };
  
  // Testar credenciais
  return axios.get('/api/validate', { auth: credentials });
}

function apiCall() {
  if (!credentials) {
    throw new Error('Not authenticated');
  }
  
  return axios.get('/api/data', { auth: credentials });
}

// Limpar ao sair
function logout() {
  credentials = null;
}
```

**Evitar localStorage/sessionStorage** para passwords:
```javascript
// ❌ Inseguro: XSS pode acessar
localStorage.setItem('password', 'secret123');

// ✅ Alternativa: armazenar token após autenticação inicial
// (Bearer Token pattern, abordado em módulo posterior)
```

## Error Handling de Autenticação

**Resposta 401 Unauthorized**:
```javascript
axios.get('/api/protected', {
  auth: {
    username: 'admin',
    password: 'wrongpassword'
  }
})
  .then(response => {
    console.log('Success:', response.data);
  })
  .catch(error => {
    if (error.response?.status === 401) {
      console.error('Invalid credentials');
      // Prompt user para re-entrar credenciais
    }
  });
```

**Detectando WWW-Authenticate Header**:
```javascript
axios.get('/api/protected')
  .catch(error => {
    if (error.response?.status === 401) {
      const wwwAuth = error.response.headers['www-authenticate'];
      
      if (wwwAuth?.startsWith('Basic')) {
        const realm = wwwAuth.match(/realm="([^"]+)"/)?.[1];
        console.log(`Authentication required for: ${realm}`);
        // Prompt user para credenciais
      }
    }
  });
```

**Retry Logic**:
```javascript
async function apiCallWithRetry(url, credentials, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url, { auth: credentials });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        if (attempt < maxRetries) {
          console.log(`Auth failed, retry ${attempt}/${maxRetries}`);
          // Possibly prompt for new credentials
          continue;
        }
        throw new Error('Authentication failed after retries');
      }
      throw error; // Other errors
    }
  }
}
```

## Advanced: Pré-Autenticação

Em vez de esperar `401` para enviar credenciais, enviar proativamente:

```javascript
// Cliente sempre envia credenciais (evita round-trip)
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  auth: {
    username: process.env.API_USER,
    password: process.env.API_PASS
  }
});

apiClient.get('/protected');
// Request já inclui Authorization header
```

**Vantagem**: Elimina latência do challenge/response cycle.
**Desvantagem**: Envia credenciais mesmo para endpoints que não requerem auth.

## Proxy Authentication

Basic Auth também pode ser usado para autenticar com proxies HTTP:

```javascript
axios.get('https://api.example.com/data', {
  proxy: {
    host: 'proxy.company.com',
    port: 8080,
    auth: {
      username: 'proxy-user',
      password: 'proxy-pass'
    }
  }
});
```

Isto adiciona header `Proxy-Authorization: Basic ...` para autenticar com proxy, separado de `Authorization` para autenticar com servidor final.

## Combinação com Outras Autenticações

Possível usar Basic Auth **e** Bearer Token simultaneamente:

```javascript
axios.get('/api/data', {
  auth: {
    username: 'admin',
    password: 'secret'
  },
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

**Problema**: Header `Authorization` é sobrescrito. Axios `auth` gera header `Authorization`, então não pode coexistir com `Authorization` manual.

**Solução**: Escolher um esquema ou usar headers customizados:
```javascript
axios.get('/api/data', {
  headers: {
    'Authorization': 'Bearer token...',
    'X-Basic-Auth': 'Basic ' + btoa('user:pass')
  }
});
// Servidor deve suportar header customizado
```

---

# 🎯 Aplicabilidade

## Cenários Ideais para Basic Auth

**APIs Internas**: Em redes corporativas com HTTPS, Basic Auth é suficiente para serviços internos.

**Prototyping e Development**: Simplicidade de Basic Auth acelera desenvolvimento inicial.

**CI/CD Pipelines**: Ferramentas de automação frequentemente usam Basic Auth para simplicidade.

**IoT e Embedded Devices**: Dispositivos com recursos limitados preferem Basic Auth por overhead mínimo.

**Legacy Systems**: Muitos sistemas antigos só suportam Basic Auth.

## Quando Evitar Basic Auth

**APIs Públicas**: Prefira OAuth 2.0 ou API Keys para melhor segurança e granularidade.

**Aplicações Móveis**: Armazenar passwords em apps móveis é inseguro. Prefira tokens que podem ser revogados.

**Requisitos de Revogação**: Basic Auth requer trocar password para revogar acesso. Tokens são revogáveis individualmente.

**Auditoria Detalhada**: Basic Auth não fornece informações sobre quais credentials foram usadas em cada request (exceto username).

## Comparação com Alternativas

**Basic Auth vs Bearer Token**:
- Basic: Credenciais em cada request, sem expiration
- Bearer: Token temporário, pode ter expiration e scopes
- Bearer é preferível para APIs modernas

**Basic Auth vs OAuth 2.0**:
- Basic: Simples, credenciais diretas
- OAuth: Complexo, delegação de acesso, scopes granulares
- OAuth preferível para integrações third-party

**Basic Auth vs API Keys**:
- Basic: Username + password
- API Key: Single secret string
- API Keys são mais simples para machine-to-machine

---

# ⚠️ Limitações

## Segurança sem HTTPS

Basic Auth sobre HTTP é completamente inseguro. Credenciais são trivialmente extraíveis.

## Sem Mecanismo de Revogação

Para revogar acesso, é necessário trocar password, afetando todos os clientes usando essas credenciais.

## Sem Expiration

Credenciais Basic Auth não expiram. Se vazarem, são válidas indefinidamente até password ser trocado.

## Sem Granularidade de Permissões

Basic Auth é binário: autenticado ou não. Não há conceito de scopes ou permissões granulares.

## Problemas com Caracteres Especiais

Username com `:` não é suportado. Passwords com caracteres UTF-8 podem ter problemas de compatibilidade.

---

# 🔗 Interconexões

## Relação com Interceptors

Interceptors podem adicionar Basic Auth dinamicamente:

```javascript
axios.interceptors.request.use(config => {
  config.auth = {
    username: getUsername(),
    password: getPassword()
  };
  return config;
});
```

## Headers e Configuração

Basic Auth é implementado via header `Authorization`, podendo ser configurado manual ou via propriedade `auth`.

## Error Handling

Erros 401 de Basic Auth são tratados como qualquer erro HTTP em `.catch()` ou error interceptors.

## Relação com Bearer Token

Bearer Token (próximo módulo) também usa header `Authorization`, mas com scheme `Bearer` em vez de `Basic`.

---

# 🚀 Evolução

## De HTTP/1.0 para HTTP/2

Basic Auth funciona identicamente em HTTP/1.1 e HTTP/2. Header `Authorization` é transmitido da mesma forma.

## De Digest para Basic+HTTPS

Digest Auth foi criado para melhorar Basic, mas complexidade não justificou benefícios. Consenso atual: Basic+HTTPS é preferível.

## Trend: OAuth 2.0 Substituindo Basic

APIs modernas migram de Basic para OAuth 2.0 por:
- Token expiration
- Revogação granular
- Delegação de acesso
- Scopes e permissões

## Futuro: Deprecação Potencial

Algumas organizações depreciam Basic Auth em favor de API Keys ou mTLS (mutual TLS). No entanto, simplicidade garante que Basic Auth permanecerá em uso por muito tempo.

## WebAuthn e Passwordless

Futuro da autenticação move-se para passwordless (WebAuthn, biometrics), mas isto afeta autenticação de usuários, não machine-to-machine APIs onde Basic Auth ainda é relevante.

---

**Conclusão Integrada**: HTTP Basic Authentication, apesar de antigo, permanece ferramenta valiosa quando usada apropriadamente. No Axios, a propriedade `auth` fornece interface elegante que abstrai complexidades de encoding. O uso correto exige HTTPS obrigatório, secure storage de credenciais, e compreensão de suas limitações. Para APIs modernas, Basic Auth é ponto de partida ou solução para casos simples, com migração para Bearer Tokens ou OAuth 2.0 quando requisitos de segurança e funcionalidade crescem.