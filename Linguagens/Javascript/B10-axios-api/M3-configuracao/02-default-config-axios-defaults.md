# Default Config: axios.defaults

## 🎯 Introdução e Definição

### Definição Conceitual

**axios.defaults** é um **objeto de configuração global** que define valores padrão aplicados automaticamente a **todas as requisições** feitas através da instância global do Axios. Conceitualmente, é um **template de configuração** - propriedades definidas em `axios.defaults` são herdadas por cada requisição, a menos que explicitamente sobrescritas.

Pense em `axios.defaults` como **configurações de fábrica** de uma aplicação - uma vez definidas, eliminam necessidade de repetir configurações comuns (como `baseURL`, headers de autenticação, timeouts) em cada requisição individual, promovendo **DRY (Don't Repeat Yourself)** e **consistência**.

**Propriedades principais configuráveis:**
- `axios.defaults.baseURL` - URL base para todas as requisições
- `axios.defaults.headers` - Headers aplicados a todas ou grupos de requisições
- `axios.defaults.timeout` - Timeout padrão em milissegundos
- `axios.defaults.withCredentials` - Enviar cookies em requisições cross-origin
- E dezenas de outras propriedades de `config`

**Diferença crucial:** `axios.defaults` afeta **instância global**. Cada instância criada com `axios.create()` tem seus próprios defaults independentes.

### Contexto Histórico e Motivação

Antes de sistemas de defaults, desenvolvedores repetiam configurações em cada requisição:

```javascript
// ❌ Repetição excessiva - sem defaults
axios.get('https://api.example.com/usuarios', {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

axios.post('https://api.example.com/usuarios', userData, {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

axios.delete('https://api.example.com/usuarios/123', {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});
```

**Problemas:**
- **Código repetitivo:** Mesmas configurações em múltiplos lugares
- **Manutenção difícil:** Mudar token requer editar cada requisição
- **Inconsistências:** Fácil esquecer timeout em alguma requisição
- **Propenso a erros:** Copiar/colar gera bugs

**Axios introduziu `defaults` para centralizar configuração:**

```javascript
// ✅ Configurar uma vez
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = 'Bearer token';
axios.defaults.timeout = 5000;

// ✅ Requisições herdam defaults automaticamente
axios.get('/usuarios');
axios.post('/usuarios', userData);
axios.delete('/usuarios/123');
```

**Vantagens:**
- **DRY:** Configuração em um único lugar
- **Manutenibilidade:** Mudar token = mudar uma linha
- **Consistência:** Todos os requests têm mesma config base
- **Legibilidade:** Requisições focam em diferenças, não em repetição

### Problema Fundamental que Resolve

**axios.defaults resolve fragmentação e repetição de configuração:**

**1. Centralização de Configuração:**
- Define comportamento padrão em um único local
- Mudanças propagam automaticamente para todas as requisições

**2. Separação de Responsabilidades:**
- Setup inicial (defaults) separado de lógica de requisição
- Código de requisição foca no que é único, não no comum

**3. Configuração por Ambiente:**
```javascript
// Development
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:3000';
} else {
  // Production
  axios.defaults.baseURL = 'https://api.production.com';
}
```

**4. Headers Globais (Autenticação):**
```javascript
// Após login, configurar token globalmente
function onLoginSuccess(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // Todas as requisições subsequentes incluem token automaticamente
}

// Após logout, remover token
function onLogout() {
  delete axios.defaults.headers.common['Authorization'];
}
```

**5. Timeouts e Políticas Globais:**
```javascript
// Aplicação com conexões lentas
axios.defaults.timeout = 15000; // 15 segundos para todas as requisições
```

### Importância no Ecossistema

**axios.defaults é fundamental para:**

- **SPAs (Single Page Applications):** Configurar baseURL e autenticação uma vez
- **Aplicações Enterprise:** Políticas globais (timeouts, retry, logging)
- **Mobile Apps (React Native):** Ajustar timeouts para conexões móveis
- **Microservices (Node.js):** Configurar comunicação entre serviços
- **Testing:** Configurar mock baseURL para testes

**Uso em setup de aplicação:**
```javascript
// src/api/config.js
import axios from 'axios';

// Configuração inicial da aplicação
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Client-Version'] = '1.2.3';

// Headers de autenticação adicionados após login
export function setAuthToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
  delete axios.defaults.headers.common['Authorization'];
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Defaults como Template:** Valores padrão herdados por todas as requisições
2. **Hierarquia de Configuração:** Request config > defaults > built-in defaults
3. **Headers por Método:** `common`, `get`, `post`, `put`, `patch`, `delete`
4. **Mutabilidade:** defaults pode ser modificado em runtime
5. **Escopo Global:** axios.defaults afeta apenas instância global

### Pilares Fundamentais

- **baseURL:** URL base concatenada com `url` de cada requisição
- **headers:** Headers aplicados globalmente ou por método HTTP
- **timeout:** Tempo máximo de espera em milissegundos
- **withCredentials:** Política de cookies cross-origin
- **Outras configs:** Qualquer propriedade de request config pode ter default

### Visão Geral das Nuances

- **headers.common:** Aplicado a todos os métodos
- **headers.get/post/etc:** Específico para cada método
- **Defaults não são imutáveis:** Podem ser modificados após import
- **Instance defaults:** `axios.create()` cria defaults independentes
- **Merge behavior:** Defaults mergeados com request config

---

## 🧠 Fundamentos Teóricos

### Estrutura de axios.defaults

**axios.defaults é objeto JavaScript com propriedades:**

```javascript
axios.defaults = {
  baseURL: undefined,
  timeout: 0,
  headers: {
    common: {},
    delete: {},
    get: {},
    head: {},
    post: {},
    put: {},
    patch: {}
  },
  withCredentials: false,
  responseType: 'json',
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  // ... muitas outras propriedades
};
```

**Todas as propriedades de Request Config podem ter defaults.**

### baseURL

#### Definição

**baseURL** é URL base concatenada com `url` de cada requisição.

**Sintaxe:**
```javascript
axios.defaults.baseURL = 'https://api.example.com';
```

#### Uso

```javascript
// Configurar baseURL
axios.defaults.baseURL = 'https://api.example.com';

// Requisições usam baseURL automaticamente
axios.get('/usuarios');
// URL final: https://api.example.com/usuarios

axios.post('/posts', postData);
// URL final: https://api.example.com/posts

axios.delete('/comentarios/123');
// URL final: https://api.example.com/comentarios/123
```

#### Concatenação

**Regras:**
- URL relativa (`/usuarios`) → concatenada com baseURL
- URL absoluta (`https://outra.com/data`) → baseURL ignorada

```javascript
axios.defaults.baseURL = 'https://api.example.com';

// Relativa - usa baseURL
axios.get('/usuarios');
// Final: https://api.example.com/usuarios

// Absoluta - ignora baseURL
axios.get('https://outra-api.com/dados');
// Final: https://outra-api.com/dados
```

#### baseURL com Trailing Slash

**Axios lida com trailing slashes automaticamente:**

```javascript
// Com trailing slash
axios.defaults.baseURL = 'https://api.example.com/';
axios.get('/usuarios');
// Final: https://api.example.com/usuarios (slash duplicado removido)

// Sem trailing slash
axios.defaults.baseURL = 'https://api.example.com';
axios.get('/usuarios');
// Final: https://api.example.com/usuarios

// URL sem leading slash
axios.defaults.baseURL = 'https://api.example.com';
axios.get('usuarios');
// Final: https://api.example.com/usuarios
```

**Lição:** Axios normaliza slashes - não precisa se preocupar.

#### baseURL Dinâmica (Ambiente)

**Padrão comum - baseURL por ambiente:**

```javascript
// config/api.js
const API_URLS = {
  development: 'http://localhost:3000',
  staging: 'https://api-staging.example.com',
  production: 'https://api.example.com'
};

axios.defaults.baseURL = API_URLS[process.env.NODE_ENV];

// Ou com variáveis de ambiente
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
```

**Vantagens:**
- Código idêntico em todos os ambientes
- Mudar ambiente = mudar variável de ambiente
- Sem condicionais espalhadas pelo código

### headers

#### Estrutura

**headers em defaults tem estrutura hierárquica:**

```javascript
axios.defaults.headers = {
  common: {
    // Aplicado a TODOS os métodos
  },
  get: {
    // Aplicado apenas a GET
  },
  post: {
    // Aplicado apenas a POST
  },
  put: {
    // Aplicado apenas a PUT
  },
  patch: {
    // Aplicado apenas a PATCH
  },
  delete: {
    // Aplicado apenas a DELETE
  },
  head: {
    // Aplicado apenas a HEAD
  }
};
```

#### headers.common

**Headers aplicados a TODOS os métodos:**

```javascript
// Autenticação global
axios.defaults.headers.common['Authorization'] = 'Bearer token123';

// Accept JSON
axios.defaults.headers.common['Accept'] = 'application/json';

// Custom headers
axios.defaults.headers.common['X-Client-Version'] = '1.0.0';
axios.defaults.headers.common['X-App-Name'] = 'MeuApp';

// Todas as requisições (GET, POST, etc.) incluem esses headers
axios.get('/usuarios');
// Headers: Authorization, Accept, X-Client-Version, X-App-Name

axios.post('/usuarios', data);
// Headers: Authorization, Accept, X-Client-Version, X-App-Name
```

**Use para:** Headers necessários em TODAS as requisições (auth, accept, custom metadata).

#### headers.[method]

**Headers específicos por método HTTP:**

```javascript
// POST - Content-Type para JSON
axios.defaults.headers.post['Content-Type'] = 'application/json';

// PUT - Content-Type para JSON
axios.defaults.headers.put['Content-Type'] = 'application/json';

// PATCH - Content-Type para JSON
axios.defaults.headers.patch['Content-Type'] = 'application/json';

// GET - Cache-Control
axios.defaults.headers.get['Cache-Control'] = 'no-cache';

// DELETE - Custom header
axios.defaults.headers.delete['X-Confirm-Delete'] = 'true';
```

**Aplicação:**
```javascript
// POST usa Content-Type de headers.post
axios.post('/usuarios', { nome: 'João' });
// Headers: Content-Type: application/json (além de common)

// GET usa Cache-Control de headers.get
axios.get('/usuarios');
// Headers: Cache-Control: no-cache (além de common)
```

**Use para:** Headers necessários apenas para métodos específicos.

#### Adicionar Headers

**Sintaxe de atribuição:**

```javascript
// Adicionar header comum
axios.defaults.headers.common['Authorization'] = 'Bearer token';

// Adicionar header específico de POST
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

#### Remover Headers

**Delete com `delete`:**

```javascript
// Remover header comum
delete axios.defaults.headers.common['Authorization'];

// Remover header específico
delete axios.defaults.headers.post['Content-Type'];
```

**Definir como undefined:**
```javascript
// Também remove
axios.defaults.headers.common['Authorization'] = undefined;
```

#### Padrão: Autenticação Dinâmica

**Adicionar token após login:**

```javascript
// auth.js
export function login(email, senha) {
  return axios.post('/auth/login', { email, senha })
    .then(response => {
      const { token } = response.data;
      
      // Armazenar token
      localStorage.setItem('token', token);
      
      // Configurar header global
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return response.data.user;
    });
}

export function logout() {
  // Remover token
  localStorage.removeItem('token');
  
  // Remover header global
  delete axios.defaults.headers.common['Authorization'];
}

// Restaurar autenticação em reload
export function initAuth() {
  const token = localStorage.getItem('token');
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// App.js
initAuth(); // Chamar ao iniciar app
```

**Vantagens:**
- Token adicionado uma vez
- Todas as requisições subsequentes incluem token automaticamente
- Logout remove token globalmente

### timeout

#### Definição

**timeout** define tempo máximo de espera (em milissegundos) para requisições.

**Sintaxe:**
```javascript
axios.defaults.timeout = 5000; // 5 segundos
```

#### Uso

```javascript
// Configurar timeout global
axios.defaults.timeout = 10000; // 10 segundos

// Todas as requisições têm timeout de 10s
axios.get('/usuarios');
// Se não responder em 10s, rejeita com erro de timeout

axios.post('/usuarios', userData);
// Se não responder em 10s, rejeita
```

#### Valor Padrão

**Padrão Axios:** `0` (sem timeout - espera indefinidamente)

```javascript
// Sem configuração
console.log(axios.defaults.timeout); // 0
```

**Recomendação:** Sempre configure timeout para evitar requisições penduradas.

#### Timeout por Ambiente

```javascript
// Timeout maior em development (debugging)
if (process.env.NODE_ENV === 'development') {
  axios.defaults.timeout = 30000; // 30 segundos
} else {
  axios.defaults.timeout = 10000; // 10 segundos em produção
}
```

#### Timeout e Mobile

**Conexões móveis são mais lentas:**

```javascript
// React Native ou mobile app
axios.defaults.timeout = 20000; // 20 segundos para mobile
```

#### Override de Timeout

**Request específico pode sobrescrever:**

```javascript
axios.defaults.timeout = 5000; // Padrão: 5 segundos

// Este request usa timeout maior
axios.get('/relatorio-grande', {
  timeout: 30000 // 30 segundos para este request
});

// Este usa padrão (5 segundos)
axios.get('/usuarios');
```

### withCredentials

#### Definição

**withCredentials** controla se cookies são enviados em requisições cross-origin.

**Sintaxe:**
```javascript
axios.defaults.withCredentials = true;
```

#### Uso

```javascript
// Enviar cookies em requisições cross-origin
axios.defaults.withCredentials = true;

// Requisição para outro domínio inclui cookies
axios.get('https://api.outra-dominio.com/usuarios');
// Cookies do domínio atual são enviados
```

**Valor padrão:** `false` (cookies não enviados cross-origin)

#### CORS e withCredentials

**Servidor deve configurar CORS para aceitar credentials:**

```javascript
// Cliente
axios.defaults.withCredentials = true;

// Servidor deve responder com:
Access-Control-Allow-Origin: https://seu-dominio.com (NÃO pode ser *)
Access-Control-Allow-Credentials: true
```

**Se servidor não configura corretamente, requisição falha com erro CORS.**

#### Quando Usar

**Use withCredentials quando:**
- API usa autenticação baseada em cookies (session cookies)
- Requisições cross-origin precisam de cookies
- SSO (Single Sign-On) com cookies compartilhados

**Não use quando:**
- Autenticação via tokens (headers) - withCredentials desnecessário
- Same-origin requests - cookies enviados automaticamente

### Outras Propriedades Comuns

#### responseType

**Tipo de dados esperado na resposta:**

```javascript
axios.defaults.responseType = 'json'; // Padrão
// Opções: 'json', 'text', 'blob', 'arraybuffer', 'document', 'stream'

// Todas as requisições esperam JSON
axios.get('/usuarios');
// response.data é objeto parseado

// Override para blob (download)
axios.get('/imagem.jpg', { responseType: 'blob' });
```

#### xsrfCookieName e xsrfHeaderName

**Proteção XSRF/CSRF:**

```javascript
axios.defaults.xsrfCookieName = 'XSRF-TOKEN'; // Padrão
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN'; // Padrão

// Axios lê cookie com nome xsrfCookieName
// E envia valor em header xsrfHeaderName
```

**Customizar se servidor usa nomes diferentes:**
```javascript
axios.defaults.xsrfCookieName = 'csrf_token';
axios.defaults.xsrfHeaderName = 'X-CSRF-Token';
```

#### validateStatus

**Função que determina se status HTTP é sucesso ou erro:**

```javascript
// Padrão: status 2xx é sucesso
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status < 300;
};

// Customizar - considerar 404 como sucesso
axios.defaults.validateStatus = function(status) {
  return status >= 200 && status < 500;
};
```

---

## 🔍 Análise Conceitual Profunda

### Hierarquia de Merge

**Ordem de precedência (maior → menor):**

```
1. Request config (passado na chamada)
2. axios.defaults (ou instance.defaults)
3. Axios built-in defaults
```

**Exemplo:**

```javascript
// 1. Built-in defaults (Axios interno)
// timeout: 0, headers: { common: { Accept: '*/*' } }

// 2. Configurar axios.defaults
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Authorization'] = 'Bearer token1';

// 3. Request config (maior prioridade)
axios.get('/usuarios', {
  timeout: 10000, // Sobrescreve default (5000)
  headers: {
    'Authorization': 'Bearer token2' // Sobrescreve default (token1)
  }
});

// Config efetivo desta requisição:
// timeout: 10000
// headers: { Authorization: 'Bearer token2' }
```

### Merge de Headers

**Headers são mergeados profundamente:**

```javascript
// Defaults
axios.defaults.headers.common['Authorization'] = 'Bearer token';
axios.defaults.headers.common['Accept'] = 'application/json';

// Request
axios.get('/usuarios', {
  headers: {
    'X-Custom': 'valor'
  }
});

// Headers finais (merge):
// {
//   Authorization: 'Bearer token',  ← de defaults.common
//   Accept: 'application/json',     ← de defaults.common
//   'X-Custom': 'valor'             ← de request config
// }
```

**Override de header específico:**

```javascript
axios.defaults.headers.common['Accept'] = 'application/json';

// Override Accept para este request
axios.get('/arquivo.xml', {
  headers: {
    'Accept': 'application/xml' // Sobrescreve default
  }
});

// Headers finais:
// { Accept: 'application/xml' } ← Request override
```

### Mutabilidade e Side Effects

**axios.defaults é mutável - cuidado com side effects:**

```javascript
// módulo1.js
import axios from 'axios';
axios.defaults.timeout = 5000;

// módulo2.js
import axios from 'axios';
axios.defaults.timeout = 10000; // ← Sobrescreve módulo1!

// Todas as requisições agora têm timeout de 10000
```

**Problema:** Múltiplos módulos modificando defaults causam comportamento imprevisível.

**Solução:** Use instances (`axios.create()`) para isolamento:

```javascript
// módulo1.js
import axios from 'axios';
const api1 = axios.create({ timeout: 5000 });
export default api1;

// módulo2.js
import axios from 'axios';
const api2 = axios.create({ timeout: 10000 });
export default api2;

// Isolados - não interferem entre si
```

### Padrões de Uso

#### Pattern 1: Setup Centralizado

```javascript
// src/api/config.js
import axios from 'axios';

// Configuração inicial
function setupAxiosDefaults() {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
  axios.defaults.timeout = 10000;
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Client-Version'] = '1.0.0';
  
  // Restaurar auth se existir
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export default setupAxiosDefaults;

// src/index.js
import setupAxiosDefaults from './api/config';
setupAxiosDefaults();
```

#### Pattern 2: Auth Token Management

```javascript
// src/utils/auth.js
import axios from 'axios';

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const initAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
};

// Uso
import { setAuthToken, initAuth } from './utils/auth';

// App init
initAuth();

// Após login
login(email, senha).then(token => {
  setAuthToken(token);
});

// Logout
logout().then(() => {
  setAuthToken(null);
});
```

#### Pattern 3: Environment-Specific Config

```javascript
// src/config/axios.js
import axios from 'axios';

const ENV_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 30000 // Maior timeout em dev
  },
  staging: {
    baseURL: 'https://api-staging.example.com',
    timeout: 15000
  },
  production: {
    baseURL: 'https://api.example.com',
    timeout: 10000
  }
};

const config = ENV_CONFIG[process.env.NODE_ENV] || ENV_CONFIG.production;

// Aplicar config
Object.assign(axios.defaults, config);

// Headers comuns
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios;
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Configurar defaults

**Configure defaults para:**
- baseURL - URL base da API
- timeout - Política global de timeout
- headers.common['Authorization'] - Token de autenticação
- headers.common['Accept'] - Formato de resposta preferido
- withCredentials - Se API usa cookies

**Não configure defaults para:**
- Configs específicas de requests únicos
- Headers que mudam frequentemente
- Timeouts que variam muito entre endpoints

### baseURL: Sempre Configure

**Em qualquer app que consome API, configure baseURL:**

```javascript
// Evita repetir domínio
axios.defaults.baseURL = 'https://api.example.com';

// Simples e limpo
axios.get('/usuarios');
axios.post('/posts', data);

// vs sem baseURL (repetitivo)
axios.get('https://api.example.com/usuarios');
axios.post('https://api.example.com/posts', data);
```

### timeout: Recomendado

**Sempre configure timeout para evitar requisições penduradas:**

```javascript
// Timeout razoável para APIs REST
axios.defaults.timeout = 10000; // 10 segundos
```

### headers.common['Authorization']: Após Login

**Não configure no setup inicial (usuário não autenticado).** Configure após login:

```javascript
// ❌ Setup inicial - usuário não autenticado
axios.defaults.headers.common['Authorization'] = 'Bearer ???';

// ✅ Após login bem-sucedido
login(credentials).then(token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});
```

---

## ⚠️ Limitações e Considerações Teóricas

### Escopo Global

**axios.defaults afeta TODOS os imports de 'axios':**

```javascript
// moduleA.js
import axios from 'axios';
axios.defaults.timeout = 5000;

// moduleB.js
import axios from 'axios';
console.log(axios.defaults.timeout); // 5000 (afetado por moduleA)
```

**Solução para isolamento:** Use instances (`axios.create()`).

### Thread Safety (Node.js)

**Em Node.js, axios.defaults é compartilhado entre requests:**

```javascript
// ❌ PERIGOSO - defaults mutáveis em servidor
app.get('/api/data', (req, res) => {
  const token = req.headers.authorization;
  axios.defaults.headers.common['Authorization'] = token;
  // ← PROBLEMA: Afeta outras requisições simultâneas!
  
  axios.get('https://outra-api.com/data')
    .then(response => res.json(response.data));
});
```

**Solução:** Use config por request ou instances:

```javascript
// ✅ Seguro - config por request
app.get('/api/data', (req, res) => {
  const token = req.headers.authorization;
  
  axios.get('https://outra-api.com/data', {
    headers: { 'Authorization': token }
  })
    .then(response => res.json(response.data));
});
```

### Headers Case Normalization

**Axios normaliza headers para lowercase:**

```javascript
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['CONTENT-TYPE'] = 'text/plain'; // Sobrescreve

console.log(axios.defaults.headers.common);
// { 'content-type': 'text/plain' } ← normalizado para lowercase
```

### Merge Profundo Limitado

**Merge de headers é profundo, mas outras propriedades não:**

```javascript
axios.defaults.params = { page: 1, limit: 10 };

axios.get('/usuarios', {
  params: { page: 2 } // ← Sobrescreve completamente defaults.params
});

// params final: { page: 2 } ← limit perdido!
```

**Solução manual:**
```javascript
axios.get('/usuarios', {
  params: { ...axios.defaults.params, page: 2 }
});
// params final: { page: 2, limit: 10 }
```

---

## 🔗 Interconexões Conceituais

### defaults vs Instances

**axios.defaults é global. Instances têm defaults próprios:**

```javascript
// Global defaults
axios.defaults.timeout = 5000;

// Instance com defaults próprios
const api = axios.create({
  timeout: 10000 // Não afeta global
});

console.log(axios.defaults.timeout); // 5000
console.log(api.defaults.timeout); // 10000
```

### defaults e Interceptors

**Interceptors podem ler/modificar config (que inclui defaults):**

```javascript
axios.interceptors.request.use(config => {
  console.log('Base URL:', config.baseURL); // De defaults
  console.log('Timeout:', config.timeout); // De defaults
  return config;
});
```

### defaults e Request Config

**Request config mergea com defaults:**

```javascript
axios.defaults.timeout = 5000;

// Request usa default
axios.get('/usuarios');
// timeout: 5000

// Request override
axios.get('/usuarios', { timeout: 10000 });
// timeout: 10000
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **axios.create():** Criar instances com defaults independentes
2. **Interceptors:** Modificar requests/responses automaticamente
3. **Per-request overrides:** Sobrescrever defaults quando necessário
4. **Custom instances:** Múltiplas APIs com configs diferentes

### Conceitos Avançados

- **Dynamic defaults:** Modificar defaults em runtime
- **Config composition:** Combinar múltiplas fontes de config
- **Environment-aware setup:** Config diferente por ambiente
- **Multi-tenant applications:** Defaults por tenant/cliente

---

## 📚 Conclusão

**axios.defaults** é **sistema de configuração global** que elimina repetição e centraliza comportamento padrão de requisições.

**Dominar axios.defaults significa:**
- Saber configurar baseURL, timeout, headers
- Entender hierarquia de merge (request > defaults > built-in)
- Gerenciar autenticação dinamicamente (adicionar/remover token)
- Evitar armadilhas (mutabilidade global, thread safety em Node.js)
- Saber quando usar defaults vs instances

**Use defaults para:**
- ✅ Configuração comum a TODAS as requisições
- ✅ Setup inicial de aplicação
- ✅ Políticas globais (timeout, headers)

**Não use defaults para:**
- ❌ Configs específicas de requests únicos
- ❌ Dados que variam por request
- ❌ Isolamento entre módulos (use instances)

Com axios.defaults configurado corretamente, seu código fica mais limpo, manutenível e consistente.
