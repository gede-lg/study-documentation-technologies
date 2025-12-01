# Métodos Shorthand vs axios(config)

## 🎯 Introdução e Definição

### Definição Conceitual

O Axios oferece **duas interfaces distintas** para fazer requisições HTTP: os **métodos shorthand** (atalhos) como `axios.get()`, `axios.post()`, etc., e a **sintaxe genérica** `axios(config)` que aceita um objeto de configuração completo. Conceitualmente, ambas as abordagens executam a mesma operação subjacente, mas diferem em **ergonomia**, **flexibilidade** e **casos de uso**.

**Métodos Shorthand** são funções dedicadas para cada método HTTP:
- `axios.get(url, config)`
- `axios.post(url, data, config)`
- `axios.put(url, data, config)`
- `axios.patch(url, data, config)`
- `axios.delete(url, config)`
- `axios.head(url, config)`
- `axios.options(url, config)`

Esses métodos são **atalhos convenientes** que encapsulam a configuração do método HTTP, tornando o código mais legível e conciso para casos comuns.

**Sintaxe axios(config)** é a forma **genérica e unificada** de fazer requisições, onde você passa um objeto de configuração completo:

```javascript
axios({
  method: 'get',
  url: '/api/usuarios',
  // ... outras configurações
})
```

Esta sintaxe oferece **máxima flexibilidade** e é a forma fundamental sobre a qual todos os shorthands são construídos.

### Contexto Histórico e Motivação

Quando Axios foi criado (2014), a API foi projetada para **equilibrar simplicidade e poder**:

**Problema a resolver:**
- Desenvolvedores precisavam de **simplicidade** para casos comuns (90% das requisições)
- Mas também precisavam de **flexibilidade** para casos complexos (10% das requisições)

**Solução Axios:**

```javascript
// Caso simples - Shorthand limpo e direto
axios.get('/api/usuarios');

// Caso complexo - Config completo com todas as opções
axios({
  method: 'get',
  url: '/api/usuarios',
  timeout: 5000,
  headers: { 'X-Custom': 'value' },
  transformResponse: [data => customTransform(data)],
  validateStatus: status => status < 500
});
```

**Inspirações históricas:**

**jQuery.ajax()** (pré-Axios) usava apenas config object:
```javascript
$.ajax({
  url: '/api/usuarios',
  method: 'GET',
  success: function(data) { ... }
});
```

**Fetch API** usa mix de sintaxes:
```javascript
// Simples
fetch('/api/usuarios');

// Com config
fetch('/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

**Axios melhorou sobre ambos**, oferecendo:
1. Shorthands para casos comuns (mais limpo que jQuery)
2. Config unificado para casos complexos (mais consistente que Fetch)

### Problema Fundamental que Resolve

**Métodos Shorthand resolvem:**
- **Verbosidade:** `axios.get(url)` vs `axios({ method: 'get', url })`
- **Legibilidade:** Intenção explícita no nome do método
- **Produtividade:** Menos digitação para 90% dos casos
- **Consistência:** API familiar (similar a outros clientes HTTP)

**axios(config) resolve:**
- **Configuração Dinâmica:** Método HTTP como variável
- **Flexibilidade Máxima:** Acesso a todas as opções de configuração
- **Uniformidade:** Mesma interface para qualquer método HTTP
- **Programação Genérica:** Funções que aceitam config completo

### Importância no Ecossistema

Entender **quando usar cada abordagem** é crucial para:

**Shorthands são usados em:**
- 90%+ das requisições em aplicações típicas
- Código simples e direto
- Protótipos e MVPs
- Documentação e exemplos

**axios(config) é usado em:**
- Bibliotecas e abstrações genéricas
- Configuração dinâmica de requisições
- Casos complexos com múltiplas opções
- Requisições customizadas avançadas

Ambas as formas são **igualmente válidas** e, na verdade, shorthands chamam `axios(config)` internamente. Escolher a forma certa torna código mais **legível**, **manutenível** e **idiomático**.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Shorthands como Açúcar Sintático:** Convenientes mas limitados a métodos HTTP específicos
2. **axios(config) como Forma Fundamental:** Todos os shorthands reduzem a esta forma
3. **Equivalência Funcional:** Mesma requisição pode ser expressa de ambas as formas
4. **Trade-off Legibilidade vs Flexibilidade:** Shorthands mais legíveis, config mais flexível
5. **Composição de Configuração:** Config object permite merge/override fácil

### Pilares Fundamentais

- **Legibilidade:** Shorthands tornam intenção explícita (`axios.post` claramente cria recurso)
- **Flexibilidade:** Config permite qualquer combinação de opções
- **Consistência:** Ambas formas retornam Promise com mesmo response structure
- **Interoperabilidade:** Config objects podem ser reutilizados, passados entre funções
- **Progressividade:** Começar com shorthands, migrar para config quando necessário

### Visão Geral das Nuances

- **Ordem de Parâmetros:** Shorthands têm ordem fixa (url, data, config) vs config livre
- **Data Parameter:** POST/PUT/PATCH têm parâmetro `data`, GET/DELETE não
- **Config Merge:** Config em shorthand é mergeado com defaults
- **Aliases:** `axios()` é alias para `axios.request()`
- **TypeScript:** Config object oferece melhor suporte a tipos

---

## 🧠 Fundamentos Teóricos

### Métodos Shorthand: Sintaxe e Assinaturas

#### GET, DELETE, HEAD, OPTIONS

**Assinatura:** `axios.method(url, config?)`

```javascript
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
```

**Parâmetros:**
- `url` (string, obrigatório): URL da requisição
- `config` (objeto, opcional): Configurações adicionais

**Exemplos:**
```javascript
// GET simples
axios.get('/api/usuarios');

// GET com config
axios.get('/api/usuarios', {
  params: { page: 2 },
  timeout: 5000
});

// DELETE simples
axios.delete('/api/usuarios/123');

// DELETE com headers
axios.delete('/api/usuarios/123', {
  headers: { 'Authorization': 'Bearer token' }
});
```

#### POST, PUT, PATCH

**Assinatura:** `axios.method(url, data?, config?)`

```javascript
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

**Parâmetros:**
- `url` (string, obrigatório): URL da requisição
- `data` (qualquer, opcional): Dados para enviar no body
- `config` (objeto, opcional): Configurações adicionais

**Exemplos:**
```javascript
// POST com data
axios.post('/api/usuarios', {
  nome: 'João',
  email: 'joao@example.com'
});

// POST com data e config
axios.post('/api/usuarios', 
  { nome: 'João' },
  { 
    headers: { 'X-Request-ID': '123' },
    timeout: 10000
  }
);

// PATCH apenas config (data vazio)
axios.patch('/api/usuarios/123', null, {
  headers: { 'X-Action': 'activate' }
});
```

### Sintaxe axios(config)

**Assinatura:** `axios(config)` ou `axios.request(config)`

```javascript
axios(config)
// Equivalente a:
axios.request(config)
```

**Config Object - Propriedades Principais:**

```javascript
{
  // URL da requisição
  url: '/api/usuarios',
  
  // Método HTTP (padrão: 'get')
  method: 'get', // 'get', 'post', 'put', 'patch', 'delete', etc.
  
  // Base URL (concatenada com url)
  baseURL: 'https://api.example.com',
  
  // Headers customizados
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  
  // Query parameters (para qualquer método)
  params: {
    page: 2,
    limit: 20
  },
  
  // Request body (para POST, PUT, PATCH)
  data: {
    nome: 'João',
    email: 'joao@example.com'
  },
  
  // Timeout em milissegundos
  timeout: 5000,
  
  // Tipo de resposta esperada
  responseType: 'json', // 'json', 'text', 'blob', 'arraybuffer', etc.
  
  // Validação customizada de status
  validateStatus: function(status) {
    return status >= 200 && status < 300;
  },
  
  // Transformações de request/response
  transformRequest: [function(data, headers) {
    // Transformar data antes de enviar
    return data;
  }],
  
  transformResponse: [function(data) {
    // Transformar data após receber
    return data;
  }],
  
  // Credenciais cross-site
  withCredentials: false,
  
  // Função de progresso
  onUploadProgress: function(progressEvent) {
    // Upload progress
  },
  
  onDownloadProgress: function(progressEvent) {
    // Download progress
  }
}
```

**Exemplo completo:**
```javascript
const response = await axios({
  method: 'post',
  url: '/api/usuarios',
  baseURL: 'https://api.example.com',
  data: {
    nome: 'João Silva',
    email: 'joao@example.com'
  },
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    'X-Request-ID': crypto.randomUUID()
  },
  timeout: 10000,
  validateStatus: status => status < 500
});
```

### Equivalência: Shorthand ↔ Config

**Toda chamada shorthand pode ser reescrita como config:**

```javascript
// Shorthand
axios.get('/api/usuarios');

// Equivalente config
axios({
  method: 'get',
  url: '/api/usuarios'
});
```

```javascript
// Shorthand
axios.post('/api/usuarios', {
  nome: 'João',
  email: 'joao@example.com'
});

// Equivalente config
axios({
  method: 'post',
  url: '/api/usuarios',
  data: {
    nome: 'João',
    email: 'joao@example.com'
  }
});
```

```javascript
// Shorthand com todas as opções
axios.get('/api/usuarios', {
  params: { page: 2 },
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

// Equivalente config
axios({
  method: 'get',
  url: '/api/usuarios',
  params: { page: 2 },
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});
```

**Internamente, shorthands chamam axios(config):**

```javascript
// Implementação simplificada de axios.get
axios.get = function(url, config) {
  return axios.request({
    ...config,
    method: 'get',
    url: url
  });
};

// Implementação simplificada de axios.post
axios.post = function(url, data, config) {
  return axios.request({
    ...config,
    method: 'post',
    url: url,
    data: data
  });
};
```

### Sintaxe Alternativa: axios(url, config)

**Axios também aceita URL como primeiro argumento:**

```javascript
axios(url, config)
```

Esta é forma intermediária entre shorthand e config completo:

```javascript
// Forma 1: Apenas URL (GET padrão)
axios('/api/usuarios');

// Forma 2: URL + config
axios('/api/usuarios', {
  method: 'post',
  data: { nome: 'João' }
});

// Equivalente a:
axios({
  method: 'post',
  url: '/api/usuarios',
  data: { nome: 'João' }
});
```

**Útil para config reutilizável:**

```javascript
const requestConfig = {
  method: 'post',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
};

// Aplicar config a diferentes URLs
axios('/api/usuarios', { ...requestConfig, data: userData });
axios('/api/posts', { ...requestConfig, data: postData });
```

---

## 🔍 Análise Conceitual Profunda

### Vantagens dos Métodos Shorthand

#### 1. Legibilidade

**Shorthands tornam intenção explícita:**

```javascript
// ✅ Claro - está buscando usuários
axios.get('/api/usuarios');

// ❓ Menos claro - precisa ler 'method'
axios({
  method: 'get',
  url: '/api/usuarios'
});
```

**Código auto-documentado:**
```javascript
// Legível em primeira leitura
async function carregarDados() {
  const usuarios = await axios.get('/api/usuarios');
  const posts = await axios.get('/api/posts');
  const comentarios = await axios.get('/api/comentarios');
  return { usuarios, posts, comentarios };
}
```

#### 2. Concisão

**Menos linhas de código:**

```javascript
// Shorthand - 1 linha
axios.post('/api/usuarios', { nome: 'João' });

// Config - 5 linhas
axios({
  method: 'post',
  url: '/api/usuarios',
  data: { nome: 'João' }
});
```

#### 3. Consistência com Outros Clientes HTTP

**Sintaxe familiar (similar a outras bibliotecas):**

```python
# Python requests
requests.get('https://api.example.com/usuarios')

# JavaScript Axios
axios.get('https://api.example.com/usuarios')
```

#### 4. Autocomplete Melhor

**IDEs sugerem métodos específicos:**
```javascript
axios.  // Autocomplete mostra: get, post, put, patch, delete, etc.
```

### Vantagens de axios(config)

#### 1. Configuração Dinâmica

**Método HTTP como variável:**

```javascript
function fazerRequisicao(metodo, url, dados = null) {
  return axios({
    method: metodo,
    url: url,
    data: dados
  });
}

// Uso dinâmico
fazerRequisicao('get', '/api/usuarios');
fazerRequisicao('post', '/api/usuarios', { nome: 'João' });
fazerRequisicao('delete', '/api/usuarios/123');
```

**Com shorthand, precisaria de switch:**
```javascript
// ❌ Verboso e repetitivo
function fazerRequisicaoShorthand(metodo, url, dados) {
  switch (metodo) {
    case 'get':
      return axios.get(url);
    case 'post':
      return axios.post(url, dados);
    case 'put':
      return axios.put(url, dados);
    case 'delete':
      return axios.delete(url);
    default:
      throw new Error('Método inválido');
  }
}
```

#### 2. Composição de Configuração

**Fácil merge de configs:**

```javascript
const baseConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token'
  }
};

const getUsuariosConfig = {
  ...baseConfig,
  method: 'get',
  url: '/usuarios',
  params: { page: 1 }
};

axios(getUsuariosConfig);

// Reutilizar e override
const getPostsConfig = {
  ...baseConfig,
  method: 'get',
  url: '/posts',
  timeout: 10000 // Override timeout
};

axios(getPostsConfig);
```

#### 3. Configuração Condicional

**Adicionar opções condicionalmente:**

```javascript
const config = {
  method: 'post',
  url: '/api/usuarios',
  data: userData
};

// Adicionar auth se disponível
if (token) {
  config.headers = { 'Authorization': `Bearer ${token}` };
}

// Adicionar timeout se conexão lenta
if (isSlowConnection) {
  config.timeout = 30000;
}

// Adicionar progress handler se uploading arquivo
if (isUpload) {
  config.onUploadProgress = progressEvent => {
    const percent = (progressEvent.loaded / progressEvent.total) * 100;
    updateProgressBar(percent);
  };
}

axios(config);
```

#### 4. Uniformidade em Funções Genéricas

**Aceitar config completo como parâmetro:**

```javascript
async function apiRequest(config) {
  try {
    const response = await axios({
      ...defaultConfig,
      ...config
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Uso com qualquer método
apiRequest({ method: 'get', url: '/usuarios' });
apiRequest({ method: 'post', url: '/usuarios', data: { nome: 'João' } });
apiRequest({ method: 'delete', url: '/usuarios/123' });
```

### Padrões de Uso

#### Padrão 1: Shorthand para Casos Simples

```javascript
// ✅ Use shorthand para requisições diretas
async function loadUserData() {
  const profile = await axios.get('/api/profile');
  const settings = await axios.get('/api/settings');
  return { profile: profile.data, settings: settings.data };
}

async function createUser(userData) {
  const response = await axios.post('/api/usuarios', userData);
  return response.data;
}

async function deleteUser(id) {
  await axios.delete(`/api/usuarios/${id}`);
}
```

#### Padrão 2: Config para Wrapper Functions

```javascript
// ✅ Use config para abstrações genéricas
class ApiClient {
  constructor(baseURL, token) {
    this.baseConfig = {
      baseURL,
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    };
  }
  
  async request(config) {
    return axios({
      ...this.baseConfig,
      ...config
    });
  }
  
  async get(url, params = {}) {
    return this.request({ method: 'get', url, params });
  }
  
  async post(url, data) {
    return this.request({ method: 'post', url, data });
  }
}

// Uso
const api = new ApiClient('https://api.example.com', 'token123');
await api.get('/usuarios', { page: 1 });
await api.post('/usuarios', { nome: 'João' });
```

#### Padrão 3: Config para Configuração Complexa

```javascript
// ✅ Use config quando muitas opções
axios({
  method: 'post',
  url: '/api/upload',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
    'X-Upload-ID': uploadId
  },
  timeout: 60000, // 1 minuto
  maxContentLength: 100 * 1024 * 1024, // 100MB
  maxBodyLength: 100 * 1024 * 1024,
  onUploadProgress: progressEvent => {
    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    updateProgressBar(percent);
  },
  validateStatus: status => status < 500
});
```

#### Padrão 4: Shorthand com Config Parcial

```javascript
// ✅ Melhor dos dois mundos
// Shorthand para legibilidade + config para opções extras

axios.get('/api/usuarios', {
  params: { page: 2, limit: 20 },
  timeout: 5000,
  headers: { 'X-Client-Version': '1.2.3' }
});

axios.post('/api/usuarios', 
  { nome: 'João', email: 'joao@example.com' },
  {
    timeout: 10000,
    headers: { 'X-Request-ID': crypto.randomUUID() }
  }
);
```

#### Padrão 5: Config Builder

```javascript
// ✅ Builder pattern para configs complexos
class RequestBuilder {
  constructor() {
    this.config = {};
  }
  
  method(m) {
    this.config.method = m;
    return this;
  }
  
  url(u) {
    this.config.url = u;
    return this;
  }
  
  data(d) {
    this.config.data = d;
    return this;
  }
  
  headers(h) {
    this.config.headers = { ...this.config.headers, ...h };
    return this;
  }
  
  timeout(t) {
    this.config.timeout = t;
    return this;
  }
  
  params(p) {
    this.config.params = p;
    return this;
  }
  
  build() {
    return this.config;
  }
  
  execute() {
    return axios(this.config);
  }
}

// Uso fluente
const response = await new RequestBuilder()
  .method('post')
  .url('/api/usuarios')
  .data({ nome: 'João' })
  .headers({ 'Authorization': 'Bearer token' })
  .timeout(5000)
  .execute();
```

### Casos Específicos

#### Requisição Condicional Complexa

```javascript
// Config permite construção incremental
async function buscarDados(filtros, opcoes) {
  const config = {
    method: 'get',
    url: '/api/dados'
  };
  
  // Adicionar params se filtros existem
  if (filtros && Object.keys(filtros).length > 0) {
    config.params = filtros;
  }
  
  // Adicionar timeout customizado
  if (opcoes.timeout) {
    config.timeout = opcoes.timeout;
  }
  
  // Adicionar headers específicos
  if (opcoes.headers) {
    config.headers = opcoes.headers;
  }
  
  // Adicionar transformação customizada
  if (opcoes.transform) {
    config.transformResponse = [data => opcoes.transform(data)];
  }
  
  return axios(config);
}
```

#### Retry com Config

```javascript
async function requestWithRetry(config, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await axios(config);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Uso
const response = await requestWithRetry({
  method: 'get',
  url: '/api/dados-importantes',
  timeout: 5000
}, 5);
```

#### Request Queue

```javascript
class RequestQueue {
  constructor() {
    this.queue = [];
  }
  
  add(config) {
    this.queue.push(config);
  }
  
  async executeAll() {
    const promises = this.queue.map(config => axios(config));
    return Promise.all(promises);
  }
}

// Uso
const queue = new RequestQueue();
queue.add({ method: 'get', url: '/api/usuarios' });
queue.add({ method: 'get', url: '/api/posts' });
queue.add({ method: 'get', url: '/api/comentarios' });

const results = await queue.executeAll();
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Shorthands

**Use shorthands quando:**
- Requisições simples e diretas
- Código precisa ser legível rapidamente
- Método HTTP é conhecido e fixo
- Poucas opções de configuração extras
- Protótipos e MVPs
- Documentação e exemplos
- Código de aplicação (não biblioteca)

**Exemplos:**
```javascript
// ✅ Casos perfeitos para shorthands
const usuarios = await axios.get('/api/usuarios');
await axios.post('/api/usuarios', userData);
await axios.delete(`/api/usuarios/${id}`);
await axios.patch('/api/usuarios/123', { ativo: false });
```

### Quando Usar axios(config)

**Use config quando:**
- Método HTTP é dinâmico (variável)
- Muitas opções de configuração
- Composição de configs (merge, override)
- Funções genéricas que aceitam config
- Construção condicional de requisição
- Bibliotecas e abstrações
- Configuração avançada (transforms, validators, etc.)

**Exemplos:**
```javascript
// ✅ Casos perfeitos para config
function apiRequest(metodo, url, dados) {
  return axios({ method: metodo, url, data: dados });
}

const config = buildComplexConfig(userOptions);
axios(config);

const configs = [
  { method: 'get', url: '/usuarios' },
  { method: 'get', url: '/posts' }
];
Promise.all(configs.map(c => axios(c)));
```

### Recomendações de Estilo

**Consistência no projeto:**
- Escolha estilo predominante para o projeto
- Use shorthands para 80-90% dos casos
- Reserve config para casos que realmente necessitam

**Legibilidade primeiro:**
- Se ambas formas são equivalentes, prefira shorthand
- Use config quando adiciona clareza (configuração complexa)

**Evite mix desnecessário:**
```javascript
// ❌ Inconsistente
axios.get('/api/usuarios');
axios({ method: 'get', url: '/api/posts' }); // Por que config aqui?
axios.delete('/api/comentarios/123');

// ✅ Consistente
axios.get('/api/usuarios');
axios.get('/api/posts');
axios.delete('/api/comentarios/123');
```

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações de Shorthands

**1. Método HTTP fixo:**
Não pode variar método dinamicamente sem refatoração.

```javascript
// ❌ Não possível com shorthand
const metodo = userChoice; // 'get' ou 'post'
axios[metodo]('/api/usuarios'); // Não ideal

// ✅ Config resolve
axios({ method: metodo, url: '/api/usuarios' });
```

**2. Ordem de parâmetros fixa:**
POST/PUT/PATCH requerem data antes de config.

```javascript
// ❌ Não pode omitir data facilmente
axios.post('/api/usuarios', undefined, { headers: {...} });

// ✅ Config mais limpo
axios({ method: 'post', url: '/api/usuarios', headers: {...} });
```

### Complexidade de Config

**Config pode ficar verboso:**

```javascript
// Shorthand simples
axios.get('/api/usuarios');

// Config equivalente é mais longo
axios({
  method: 'get',
  url: '/api/usuarios'
});
```

**Solução:** Use shorthand para casos simples, reserve config para complexidade real.

### Performance

**Ambas formas têm performance idêntica** - shorthands chamam config internamente.

**Micro-otimização irrelevante:**
```javascript
// Diferença de performance: ~0% (idênticas)
axios.get('/api/usuarios');
axios({ method: 'get', url: '/api/usuarios' });
```

**Lição:** Escolha baseada em legibilidade e manutenibilidade, não performance.

---

## 🔗 Interconexões Conceituais

### Shorthands e Instâncias Axios

**Instâncias criadas com `axios.create()` também têm shorthands:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// Instância tem shorthands
api.get('/usuarios');
api.post('/usuarios', data);

// E aceita config
api({ method: 'get', url: '/usuarios' });
```

### Config e Interceptors

**Interceptors podem modificar config:**

```javascript
axios.interceptors.request.use(config => {
  // Config é mesmo objeto, independente de shorthand ou não
  console.log(`${config.method.toUpperCase()} ${config.url}`);
  return config;
});

// Ambos passam por interceptor
axios.get('/api/usuarios'); // Log: GET /api/usuarios
axios({ method: 'post', url: '/api/posts' }); // Log: POST /api/posts
```

### Config e Defaults

**Defaults são mergeados em ambos:**

```javascript
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Authorization'] = 'Bearer token';

// Shorthand usa defaults
axios.get('/api/usuarios');
// Timeout: 5000, Headers: { Authorization: 'Bearer token' }

// Config usa defaults
axios({ method: 'get', url: '/api/usuarios' });
// Timeout: 5000, Headers: { Authorization: 'Bearer token' }
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Instâncias Axios:** `axios.create()` para configs reutilizáveis
2. **Interceptors:** Modificar requests/responses globalmente
3. **Defaults:** Configurar comportamento padrão
4. **Transformações:** Customizar serialização/deserialização

### Conceitos Avançados

- **Request/Response Interceptors:** Adicionar lógica global
- **Custom Axios Instances:** Clientes API isolados
- **Config Composition Patterns:** Merge, override, extend
- **TypeScript Generics:** Tipar configs e responses

---

## 📚 Conclusão

**Métodos shorthand** e **axios(config)** são **duas faces da mesma moeda** - ambas executam requisições HTTP, mas com diferentes trade-offs:

**Shorthands (`axios.get`, `axios.post`, etc.):**
- ✅ Mais legíveis e concisos
- ✅ Ideais para 90% dos casos
- ✅ Intenção explícita
- ❌ Método fixo
- ❌ Menos flexíveis

**axios(config):**
- ✅ Máxima flexibilidade
- ✅ Configuração dinâmica
- ✅ Composição fácil
- ❌ Mais verboso para casos simples
- ❌ Intenção menos explícita

**Dominar ambas abordagens significa:**
- Saber quando cada uma é apropriada
- Usar shorthands para simplicidade
- Usar config para poder
- Manter consistência no código
- Criar abstrações quando necessário

**Recomendação:** Comece com shorthands. Migre para config quando necessário. Ambas são válidas e coexistem harmoniosamente no Axios.
