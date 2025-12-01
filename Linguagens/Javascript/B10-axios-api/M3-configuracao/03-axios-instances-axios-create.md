# Axios Instances com axios.create()

## 🎯 Introdução e Definição

### Definição Conceitual

**axios.create()** é uma função factory que cria **novas instâncias isoladas do Axios**, cada uma com sua própria configuração independente. Conceitualmente, é como criar **clientes HTTP customizados** - cada instância é um "Axios separado" com defaults, interceptors e comportamentos próprios, sem afetar outras instâncias ou o Axios global.

Uma **instance** (instância) é um objeto que possui todos os métodos do Axios (`get`, `post`, `put`, etc.) mas opera de forma **isolada** e **configurável**. Pense em instances como **perfis de configuração** - você pode ter um perfil para API principal, outro para API de autenticação, outro para serviços externos, todos rodando simultaneamente sem interferência.

**Sintaxe básica:**
```javascript
const instance = axios.create(config);
```

**O que você ganha:**
- `instance.get()`, `instance.post()`, `instance()` - todos os métodos do Axios
- `instance.defaults` - defaults INDEPENDENTES (não afetam axios.defaults)
- `instance.interceptors` - interceptors ISOLADOS
- Configuração imutável para outras instâncias

**Diferença crucial:**
- `axios` (global) → Compartilhado, defaults globais, interceptors globais
- `axios.create()` → Isolada, defaults próprios, interceptors próprios

### Contexto Histórico e Motivação

Antes de `axios.create()`, aplicações complexas enfrentavam problemas:

**Problema 1: Múltiplas APIs com Configurações Diferentes**

```javascript
// ❌ Sem instances - configuração confusa
axios.defaults.baseURL = 'https://api1.com';

axios.get('/usuarios'); // API 1
axios.get('/posts'); // API 1

// Mudar para API 2?
axios.defaults.baseURL = 'https://api2.com'; // ← Quebra API 1!

axios.get('/dados'); // API 2
```

**Problema 2: Conflitos de Headers**

```javascript
// API 1 usa token JWT
axios.defaults.headers.common['Authorization'] = 'Bearer token1';

// API 2 usa API Key
axios.defaults.headers.common['X-API-Key'] = 'key2';
// ← Ambas configurações ficam em todos os requests!
```

**Problema 3: Timeouts Diferentes**

```javascript
// API interna - timeout curto
axios.defaults.timeout = 3000;

axios.get('/api-interna/rapida');

// API externa lenta - precisa timeout maior
axios.defaults.timeout = 30000; // ← Quebra API interna!

axios.get('/api-externa/lenta');
```

**axios.create() resolveu tudo:**

```javascript
// ✅ Instance para API 1
const api1 = axios.create({
  baseURL: 'https://api1.com',
  timeout: 5000,
  headers: { 'Authorization': 'Bearer token1' }
});

// ✅ Instance para API 2
const api2 = axios.create({
  baseURL: 'https://api2.com',
  timeout: 10000,
  headers: { 'X-API-Key': 'key2' }
});

// Usar simultaneamente sem interferência
api1.get('/usuarios'); // https://api1.com/usuarios (token1, timeout 5s)
api2.get('/dados'); // https://api2.com/dados (key2, timeout 10s)
```

**Vantagens:**
- **Isolamento:** Cada instance independente
- **Clareza:** Config explícita por API
- **Manutenibilidade:** Mudar config de uma API não afeta outras
- **Escalabilidade:** Adicionar novas APIs sem conflitos

### Problema Fundamental que Resolve

**axios.create() resolve isolamento e organização:**

**1. Isolamento de Configuração:**
- Múltiplas APIs com configs diferentes rodando simultaneamente
- Defaults de uma instance não afetam outras

**2. Modularização:**
```javascript
// services/userApi.js
const userApi = axios.create({
  baseURL: 'https://api.example.com/users'
});
export default userApi;

// services/paymentApi.js
const paymentApi = axios.create({
  baseURL: 'https://payments.example.com'
});
export default paymentApi;

// Uso em componentes
import userApi from './services/userApi';
import paymentApi from './services/paymentApi';

userApi.get('/'); // https://api.example.com/users
paymentApi.post('/charge', data); // https://payments.example.com/charge
```

**3. Interceptors Isolados:**
```javascript
// Instance 1 - logging em requests
const api1 = axios.create();
api1.interceptors.request.use(config => {
  console.log('API1:', config.url);
  return config;
});

// Instance 2 - sem logging
const api2 = axios.create();

api1.get('/test'); // Log: "API1: /test"
api2.get('/test'); // Sem log
```

**4. Testing:**
```javascript
// Produção
const prodApi = axios.create({
  baseURL: 'https://api.production.com'
});

// Testes - mock API
const testApi = axios.create({
  baseURL: 'http://localhost:3000/mock-api'
});

// Código usa mesma interface
export default process.env.NODE_ENV === 'test' ? testApi : prodApi;
```

### Importância no Ecossistema

**axios.create() é fundamental para:**

- **Aplicações Enterprise:** Múltiplos backends, microservices
- **Multi-tenant Apps:** Config diferente por tenant/cliente
- **SDKs e Libraries:** Encapsular Axios com config específica
- **Micro-frontends:** Cada módulo com sua API instance
- **Testing:** Instances mockadas para testes

**Padrão de arquitetura comum:**

```
src/
  api/
    baseApi.js        ← Instance principal
    authApi.js        ← Instance para autenticação
    paymentsApi.js    ← Instance para pagamentos
    analyticsApi.js   ← Instance para analytics
  services/
    userService.js    ← Usa baseApi
    orderService.js   ← Usa baseApi
```

**Cada instance com:**
- baseURL específica
- Headers específicos
- Timeouts apropriados
- Interceptors customizados

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Instance como Axios Isolado:** Mesmos métodos, configuração independente
2. **Config Inicial:** Passada em `axios.create(config)`
3. **instance.defaults:** Defaults próprios, não afetam global
4. **instance.interceptors:** Interceptors isolados
5. **Composição:** Instances podem ser compostas, estendidas

### Pilares Fundamentais

- **Criação:** `const instance = axios.create(config)`
- **Métodos:** `instance.get/post/put/patch/delete/request()`
- **Defaults:** `instance.defaults.baseURL`, `instance.defaults.headers`, etc.
- **Interceptors:** `instance.interceptors.request/response`
- **Isolamento:** Mudanças em instance não afetam outras

### Visão Geral das Nuances

- **Instance ≠ axios global:** São objetos diferentes
- **Defaults iniciais:** Config em create() vai para instance.defaults
- **Modificação posterior:** instance.defaults pode ser alterado após criação
- **Herança:** Instances NÃO herdam interceptors de axios global
- **Export pattern:** Exportar instances para reutilização

---

## 🧠 Fundamentos Teóricos

### Criação de Instance

#### Sintaxe

```javascript
const instance = axios.create([config])
```

**Parâmetros:**
- `config` (objeto, opcional): Configuração inicial da instance

**Retorno:** Nova instance do Axios com configuração específica.

#### Exemplo Básico

```javascript
// Criar instance com config
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer token',
    'Accept': 'application/json'
  }
});

// Usar instance
api.get('/usuarios'); // https://api.example.com/usuarios
api.post('/posts', data); // https://api.example.com/posts
```

#### Instance Vazia

```javascript
// Instance sem config inicial
const instance = axios.create();

// Equivalente a axios global (mas isolado)
instance.get('https://api.example.com/usuarios');
```

**Útil quando:** Config será definida posteriormente via `instance.defaults`.

### Métodos de Instance

**Instance possui TODOS os métodos do Axios:**

```javascript
const api = axios.create({ baseURL: 'https://api.example.com' });

// Shorthand methods
api.get(url, config);
api.post(url, data, config);
api.put(url, data, config);
api.patch(url, data, config);
api.delete(url, config);
api.head(url, config);
api.options(url, config);

// Generic method
api.request(config);
api(config); // Alias

// Utility methods
api.getUri(config);
api.defaults; // Defaults object
api.interceptors; // Interceptors object
```

**Exemplo de uso:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com'
});

// GET
const usuarios = await api.get('/usuarios');

// POST
const novoUsuario = await api.post('/usuarios', {
  nome: 'João',
  email: 'joao@example.com'
});

// PUT
await api.put(`/usuarios/${novoUsuario.data.id}`, {
  nome: 'João Silva'
});

// DELETE
await api.delete(`/usuarios/${novoUsuario.data.id}`);
```

### instance.defaults

**Cada instance tem objeto `defaults` próprio:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// Acessar defaults
console.log(api.defaults.baseURL); // 'https://api.example.com'
console.log(api.defaults.timeout); // 5000

// Modificar defaults após criação
api.defaults.timeout = 10000;
api.defaults.headers.common['Authorization'] = 'Bearer new-token';

// Mudanças afetam apenas esta instance
console.log(axios.defaults.timeout); // undefined (axios global não afetado)
```

#### Estrutura de instance.defaults

```javascript
const api = axios.create();

console.log(api.defaults);
// {
//   baseURL: undefined,
//   timeout: 0,
//   headers: {
//     common: {},
//     delete: {},
//     get: {},
//     head: {},
//     post: {},
//     put: {},
//     patch: {}
//   },
//   withCredentials: false,
//   // ... todas as propriedades de config
// }
```

**Idêntica a `axios.defaults`, mas isolada.**

### instance.interceptors

**Cada instance tem interceptors próprios:**

```javascript
const api = axios.create();

// Request interceptor (apenas nesta instance)
api.interceptors.request.use(
  config => {
    console.log('Request:', config.url);
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor (apenas nesta instance)
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status);
    return response;
  },
  error => Promise.reject(error)
);

// Interceptors afetam apenas api
api.get('/test'); // Logs de request e response

// axios global não afetado
axios.get('/test'); // Sem logs
```

**Isolamento completo:** Interceptors de uma instance não afetam outras.

### Múltiplas Instances

**Criar múltiplas instances para diferentes APIs:**

```javascript
// API principal
const mainApi = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { 'Authorization': `Bearer ${mainToken}` }
});

// API de autenticação (sem auth header inicial)
const authApi = axios.create({
  baseURL: 'https://auth.example.com',
  timeout: 5000
});

// API externa (timeout maior, diferentes headers)
const externalApi = axios.create({
  baseURL: 'https://external-api.com',
  timeout: 30000,
  headers: { 'X-API-Key': 'external-key' }
});

// Usar simultaneamente
const users = await mainApi.get('/usuarios');
const authToken = await authApi.post('/login', credentials);
const externalData = await externalApi.get('/data');
```

**Cada instance completamente independente.**

### Config Inicial vs Defaults

**Config em `create()` vai para `instance.defaults`:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token'
  }
});

// Config inicial está em defaults
console.log(api.defaults.baseURL); // 'https://api.example.com'
console.log(api.defaults.timeout); // 5000
console.log(api.defaults.headers.common['Authorization']); // 'Bearer token'
```

**Modificar defaults após criação:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com'
});

// Adicionar config depois
api.defaults.timeout = 10000;
api.defaults.headers.common['Authorization'] = 'Bearer new-token';

// Agora todas as requisições usam novo config
api.get('/usuarios'); // timeout: 10000, Authorization: Bearer new-token
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Uso

#### Pattern 1: API Service Module

**Encapsular instance em módulo:**

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adicionar token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Uso em outros arquivos
import api from './services/api';

const usuarios = await api.get('/usuarios');
```

#### Pattern 2: Multiple API Instances

**Diferentes instances para diferentes backends:**

```javascript
// api/mainApi.js
import axios from 'axios';

const mainApi = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000
});

mainApi.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${getMainToken()}`;
  return config;
});

export default mainApi;

// api/authApi.js
import axios from 'axios';

const authApi = axios.create({
  baseURL: 'https://auth.example.com',
  timeout: 5000
});

export default authApi;

// api/paymentsApi.js
import axios from 'axios';

const paymentsApi = axios.create({
  baseURL: 'https://payments.example.com',
  timeout: 30000
});

paymentsApi.interceptors.request.use(config => {
  config.headers['X-Payment-API-Key'] = process.env.PAYMENT_API_KEY;
  return config;
});

export default paymentsApi;

// Uso
import mainApi from './api/mainApi';
import authApi from './api/authApi';
import paymentsApi from './api/paymentsApi';

// Cada API com config específica
const users = await mainApi.get('/usuarios');
const token = await authApi.post('/login', credentials);
const payment = await paymentsApi.post('/charge', paymentData);
```

#### Pattern 3: Factory Function

**Função que cria instances customizadas:**

```javascript
// utils/createApiClient.js
import axios from 'axios';

export function createApiClient(baseURL, options = {}) {
  const client = axios.create({
    baseURL,
    timeout: options.timeout || 10000,
    headers: {
      'Accept': 'application/json',
      ...(options.headers || {})
    }
  });
  
  // Interceptor de autenticação
  if (options.authToken) {
    client.interceptors.request.use(config => {
      config.headers['Authorization'] = `Bearer ${options.authToken}`;
      return config;
    });
  }
  
  // Interceptor de logging (apenas em dev)
  if (process.env.NODE_ENV === 'development') {
    client.interceptors.request.use(config => {
      console.log(`[${config.method.toUpperCase()}] ${config.url}`);
      return config;
    });
  }
  
  return client;
}

// Uso
const api1 = createApiClient('https://api1.com', {
  authToken: 'token1',
  timeout: 5000
});

const api2 = createApiClient('https://api2.com', {
  authToken: 'token2'
});
```

#### Pattern 4: Tenant-Specific Instances

**Multi-tenant application com instance por tenant:**

```javascript
// api/tenantApi.js
import axios from 'axios';

const tenantInstances = new Map();

export function getTenantApi(tenantId) {
  if (!tenantInstances.has(tenantId)) {
    const instance = axios.create({
      baseURL: `https://${tenantId}.api.example.com`,
      timeout: 10000
    });
    
    instance.interceptors.request.use(config => {
      config.headers['X-Tenant-ID'] = tenantId;
      return config;
    });
    
    tenantInstances.set(tenantId, instance);
  }
  
  return tenantInstances.get(tenantId);
}

// Uso
const tenant1Api = getTenantApi('tenant1');
const tenant2Api = getTenantApi('tenant2');

tenant1Api.get('/usuarios'); // https://tenant1.api.example.com/usuarios
tenant2Api.get('/usuarios'); // https://tenant2.api.example.com/usuarios
```

#### Pattern 5: Testing with Mock Instance

**Instance mockada para testes:**

```javascript
// api/apiClient.js
import axios from 'axios';

let apiClient;

if (process.env.NODE_ENV === 'test') {
  // Mock instance para testes
  apiClient = axios.create({
    baseURL: 'http://localhost:3000/mock',
    timeout: 1000
  });
} else {
  // Instance real para produção
  apiClient = axios.create({
    baseURL: process.env.API_URL,
    timeout: 10000
  });
  
  // Interceptors apenas em produção
  apiClient.interceptors.request.use(config => {
    config.headers['Authorization'] = `Bearer ${getToken()}`;
    return config;
  });
}

export default apiClient;

// Testes usam mock instance automaticamente
import apiClient from './api/apiClient';

test('buscar usuários', async () => {
  // apiClient aponta para mock em testes
  const response = await apiClient.get('/usuarios');
  expect(response.data).toHaveLength(3);
});
```

### Instance vs Axios Global

**Comparação:**

| Aspecto | axios (global) | instance (create) |
|---------|----------------|-------------------|
| **Defaults** | `axios.defaults` (global) | `instance.defaults` (isolado) |
| **Interceptors** | `axios.interceptors` (global) | `instance.interceptors` (isolado) |
| **Escopo** | Compartilhado entre imports | Isolado |
| **Uso** | Aplicações simples, uma API | Múltiplas APIs, modularização |
| **Mutabilidade** | Afeta todos os imports | Afeta apenas instance |

**Quando usar cada:**

**Use axios global quando:**
- Aplicação simples com uma API
- Protótipo rápido
- Config uniforme para tudo

**Use instances quando:**
- Múltiplas APIs com configs diferentes
- Aplicação modular (services, modules)
- Testing (mock vs real)
- Isolamento necessário

### Hierarquia de Config em Instances

**Ordem de precedência (maior → menor):**

```
1. Request config (passado na chamada)
2. instance.defaults
3. Axios built-in defaults
```

**Exemplo:**

```javascript
// 1. Built-in defaults (Axios interno)
// timeout: 0

// 2. Instance defaults
const api = axios.create({
  timeout: 5000,
  headers: { 'Authorization': 'Bearer token1' }
});

// 3. Request config (maior prioridade)
api.get('/usuarios', {
  timeout: 10000, // Override instance default
  headers: {
    'Authorization': 'Bearer token2' // Override instance default
  }
});

// Config efetivo:
// timeout: 10000
// headers: { Authorization: 'Bearer token2' }
```

**Nota:** `axios.defaults` (global) NÃO afeta instances.

```javascript
axios.defaults.timeout = 20000; // Global

const api = axios.create({
  timeout: 5000 // Instance default
});

api.get('/test');
// timeout: 5000 (instance default, NÃO 20000 de global)
```

### Modificando Instance Após Criação

**Defaults de instance podem ser modificados:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com'
});

// Adicionar timeout depois
api.defaults.timeout = 10000;

// Adicionar header depois
api.defaults.headers.common['Authorization'] = 'Bearer token';

// Mudanças afetam requisições subsequentes
api.get('/usuarios'); // timeout: 10000, Authorization: Bearer token
```

**Padrão: Configurar auth após login:**

```javascript
// api.js
const api = axios.create({
  baseURL: 'https://api.example.com'
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;

// auth.js
import api, { setAuthToken } from './api';

async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha });
  const { token } = response.data;
  
  setAuthToken(token);
  return response.data.user;
}

function logout() {
  setAuthToken(null);
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Criar Instances

**Crie instances quando:**
- Múltiplas APIs com baseURLs diferentes
- Configs significativamente diferentes (timeouts, headers)
- Isolamento necessário (interceptors específicos)
- Modularização (service layer, feature modules)
- Testing (mock vs real APIs)
- Multi-tenant applications

**Exemplo de cenário real:**

```javascript
// E-commerce app com múltiplas APIs

// API principal de produtos
const productsApi = axios.create({
  baseURL: 'https://api.store.com',
  timeout: 10000
});

// API de pagamentos (timeout maior, headers específicos)
const paymentsApi = axios.create({
  baseURL: 'https://payments.stripe.com',
  timeout: 30000,
  headers: {
    'X-Stripe-API-Key': process.env.STRIPE_KEY
  }
});

// API de reviews externa
const reviewsApi = axios.create({
  baseURL: 'https://reviews.trustpilot.com',
  timeout: 5000,
  headers: {
    'Authorization': `ApiKey ${process.env.TRUSTPILOT_KEY}`
  }
});

// Analytics interno
const analyticsApi = axios.create({
  baseURL: 'https://analytics.store.com',
  timeout: 3000
});

// Usar cada API para seu propósito
const products = await productsApi.get('/products');
const payment = await paymentsApi.post('/charges', chargeData);
const reviews = await reviewsApi.get(`/products/${productId}/reviews`);
await analyticsApi.post('/events', { event: 'page_view' });
```

### Não Crie Instances Quando

**Evite instances se:**
- Aplicação simples com uma API
- Config uniforme para todas as requisições
- Overhead desnecessário

**Exemplo - não precisa de instance:**

```javascript
// ❌ Desnecessário - tudo usa mesma config
const api = axios.create({
  baseURL: 'https://api.example.com'
});

// ✅ Melhor - usar axios global
axios.defaults.baseURL = 'https://api.example.com';
```

---

## ⚠️ Limitações e Considerações Teóricas

### Instances Não Herdam Interceptors Globais

**Interceptors de axios global NÃO afetam instances:**

```javascript
// Interceptor global
axios.interceptors.request.use(config => {
  console.log('Global interceptor');
  return config;
});

// Instance criada
const api = axios.create();

axios.get('/test'); // Log: "Global interceptor"
api.get('/test'); // ← Sem log (interceptor global não aplicado)
```

**Solução:** Adicionar interceptors na instance:

```javascript
const api = axios.create();

api.interceptors.request.use(config => {
  console.log('Instance interceptor');
  return config;
});

api.get('/test'); // Log: "Instance interceptor"
```

### Instances Não Herdam axios.defaults

**axios.defaults NÃO afeta instances criadas:**

```javascript
axios.defaults.timeout = 5000; // Global

const api = axios.create(); // Instance

console.log(api.defaults.timeout); // 0 (built-in default, NÃO 5000)
```

**Se quiser herdar defaults:**

```javascript
const api = axios.create({
  timeout: axios.defaults.timeout, // Copiar explicitamente
  headers: { ...axios.defaults.headers.common } // Copiar headers
});
```

### Memory Leaks com Muitas Instances

**Criar instances dinamicamente pode causar memory leaks:**

```javascript
// ❌ PROBLEMA - cria nova instance a cada requisição
function fetchData(url) {
  const api = axios.create({ baseURL: url });
  return api.get('/data');
}

// Chamado 1000 vezes = 1000 instances criadas!
for (let i = 0; i < 1000; i++) {
  fetchData(`https://api${i}.com`);
}
```

**Solução - cachear instances:**

```javascript
// ✅ Cache de instances
const instanceCache = new Map();

function getOrCreateInstance(baseURL) {
  if (!instanceCache.has(baseURL)) {
    instanceCache.set(baseURL, axios.create({ baseURL }));
  }
  return instanceCache.get(baseURL);
}

function fetchData(url) {
  const api = getOrCreateInstance(url);
  return api.get('/data');
}
```

### Serialização e Clonagem

**Instances não podem ser serializadas (JSON.stringify):**

```javascript
const api = axios.create({ baseURL: 'https://api.example.com' });

JSON.stringify(api); // ❌ Erro ou comportamento indefinido
```

**Instâncias são objetos complexos com funções, não dados simples.**

---

## 🔗 Interconexões Conceituais

### Instances e Interceptors

**Cada instance pode ter interceptors próprios:**
```javascript
const api = axios.create();

api.interceptors.request.use(/* ... */);
api.interceptors.response.use(/* ... */);
```

### Instances e Cancelamento

**CancelToken funciona com instances:**
```javascript
const api = axios.create();
const source = axios.CancelToken.source();

api.get('/data', { cancelToken: source.token });
source.cancel('Operação cancelada');
```

### Instances e Testing

**Instances facilitam mocking:**
```javascript
// Mock instance em testes
jest.mock('./api', () => ({
  get: jest.fn(),
  post: jest.fn()
}));
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Interceptors:** Adicionar lógica global a instances
2. **Error Handling:** Tratar erros específicos por instance
3. **Retry Logic:** Implementar retry em instances
4. **Config Composition:** Combinar configs de múltiplas fontes

### Conceitos Avançados

- **Dynamic instance creation:** Criar instances baseado em runtime data
- **Instance pooling:** Gerenciar pool de instances
- **Config inheritance:** Estender instances existentes
- **Middleware pattern:** Compor funcionalidades em instances

---

## 📚 Conclusão

**axios.create()** é ferramenta **essencial para modularização e isolamento** em aplicações Axios.

**Dominar instances significa:**
- Saber quando criar instances (múltiplas APIs, isolamento)
- Configurar instances com defaults apropriados
- Usar instances para organizar código (service layer)
- Evitar armadilhas (memory leaks, falta de herança de interceptors)
- Aplicar padrões (factory, tenant-specific, testing)

**Use instances para:**
- ✅ Múltiplas APIs com configs diferentes
- ✅ Modularização e separação de responsabilidades
- ✅ Isolamento de interceptors
- ✅ Testing (mock vs real)

**Evite instances se:**
- ❌ Aplicação simples com uma API
- ❌ Config uniforme para tudo
- ❌ Overhead desnecessário

Com `axios.create()`, você transforma Axios de ferramenta simples em **arquitetura modular e escalável** para comunicação HTTP.
