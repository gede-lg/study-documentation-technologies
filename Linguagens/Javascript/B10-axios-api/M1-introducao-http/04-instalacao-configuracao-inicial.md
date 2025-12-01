# Instalação e Configuração Inicial do Axios

## 🎯 Introdução e Definição

### Definição Conceitual

A **instalação** do Axios refere-se ao processo de adicionar a biblioteca como dependência ao projeto, tornando-a disponível para importação e uso no código. A **configuração inicial** envolve estabelecer valores padrão, criar instâncias customizadas e preparar o ambiente para comunicação HTTP eficiente e organizada.

Conceitualmente, instalar e configurar Axios é criar a **infraestrutura de comunicação HTTP** da aplicação - definir como, onde e com quais parâmetros padrão sua aplicação conversará com servidores externos. É análogo a configurar um "centro de comunicações" antes de começar a enviar mensagens.

### Contexto Histórico e Motivação

Historicamente, bibliotecas JavaScript eram incluídas via **tags `<script>` no HTML**, baixando arquivos de CDNs ou armazenando localmente. Isso funcionava, mas tinha limitações:
- Difícil gerenciar versões
- Ordem de carregamento importava (dependências)
- Poluição do escopo global
- Sem controle de dependências transitivas

Com a evolução do desenvolvimento JavaScript, surgiram **gerenciadores de pacotes**:

**npm (2010):** Node Package Manager tornou-se padrão para gerenciar dependências JavaScript. Permite declarar dependências em `package.json`, instalar com um comando (`npm install`), e importar módulos com `require()` (CommonJS) ou `import` (ES6).

**Yarn (2016):** Alternativa ao npm criada pelo Facebook, com foco em velocidade e determinismo (lock files).

**pnpm (2017):** Gerenciador focado em eficiência de disco (usa hard links).

Axios foi projetado para funcionar nativamente com esses gerenciadores, oferecendo instalação simples via npm/yarn/pnpm e suporte a múltiplos formatos de módulo (CommonJS, ES6 modules, UMD para browsers).

A **motivação** para ter processo de instalação/configuração bem definido:
1. **Consistência:** Mesma versão da biblioteca em todos os ambientes (dev, staging, prod)
2. **Reprodutibilidade:** Qualquer desenvolvedor pode clonar projeto e instalar dependências com um comando
3. **Configuração Centralizada:** Definir uma vez (base URL, headers, timeouts) e usar em toda aplicação
4. **Separação de Ambientes:** Configuração diferente para dev vs produção

### Problema Fundamental que Resolve

A instalação e configuração do Axios resolvem múltiplos problemas práticos:

**1. Disponibilidade da Biblioteca:** Sem instalação, você não tem acesso ao código do Axios. Processo de instalação traz biblioteca para seu projeto de forma gerenciada.

**2. Repetição de Código:** Sem configuração global, você repetiria mesmos parâmetros (base URL, headers, timeout) em cada requisição:

```javascript
// ❌ Sem configuração - repetição
axios.get('https://api.example.com/usuarios', {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

axios.post('https://api.example.com/produtos', data, {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
});

// ✅ Com configuração - DRY (Don't Repeat Yourself)
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = 'Bearer token';
axios.defaults.timeout = 5000;

axios.get('/usuarios');
axios.post('/produtos', data);
```

**3. Gerenciamento de Múltiplas APIs:** Sem instâncias configuradas, seria difícil comunicar com múltiplas APIs mantendo organização:

```javascript
// ❌ Confuso - URLs completas misturadas
axios.get('https://api1.com/dados');
axios.get('https://api2.com/info');

// ✅ Organizado - instâncias separadas
const api1 = axios.create({ baseURL: 'https://api1.com' });
const api2 = axios.create({ baseURL: 'https://api2.com' });

api1.get('/dados');
api2.get('/info');
```

**4. Diferenças entre Ambientes:** Sem configuração externa, seria necessário condicionais espalhados pelo código:

```javascript
// ❌ Lógica condicional no código
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://api.prod.com' 
  : 'http://localhost:3000';

axios.get(`${baseURL}/usuarios`);

// ✅ Configuração centralizada
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.get('/usuarios'); // Usa URL correta automaticamente
```

### Importância no Ecossistema

Instalação e configuração corretas do Axios são **críticas** para:

- **Manutenibilidade:** Mudança de API URL ou headers é feita em um lugar, não em centenas de requisições
- **Escalabilidade:** Adicionar nova API é criar nova instância configurada, não modificar código existente
- **Segurança:** Tokens e credenciais centralizados facilitam rotação e auditoria
- **Performance:** Configurações como timeout e cache são aplicadas consistentemente
- **Developer Experience:** Desenvolvedores novos no projeto sabem onde configurar comunicação HTTP

Em projetos reais, configuração Axios frequentemente está entre os **primeiros arquivos criados** (ex: `src/api/client.js`), servindo como fundação para toda comunicação da aplicação.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Instalação como Dependência Gerenciada:** Axios é adicionado via gerenciador de pacotes, não script tag ou download manual
2. **Configuração em Camadas:** Global (axios.defaults), por instância (instance.defaults), por requisição (config object)
3. **Instâncias como Isolamento:** `axios.create()` cria clientes HTTP independentes com configurações próprias
4. **Variáveis de Ambiente:** Separar configuração de código usando .env
5. **Axios Instance como Singleton:** Padrão comum é criar e exportar instância configurada uma vez

### Pilares Fundamentais

- **Gerenciamento de Dependências:** npm/yarn/pnpm controlam versão e atualização
- **Configuração Declarativa:** Configurações são objetos JavaScript descrevendo comportamento desejado
- **DRY (Don't Repeat Yourself):** Configuração global elimina repetição
- **Separação de Preocupações:** Configuração HTTP separada de lógica de negócio
- **Composição sobre Modificação:** Criar instâncias customizadas ao invés de modificar global

### Visão Geral das Nuances

- **Importação CommonJS vs ES6:** `require` vs `import` - ambos funcionam
- **Precedência de Configuração:** Config de requisição sobrescreve defaults de instância, que sobrescreve defaults globais
- **Mutabilidade de Defaults:** `axios.defaults` pode ser modificado em runtime (mas geralmente não é boa ideia)
- **Baseurl Trailing Slash:** `/api` vs `/api/` - comportamento de concatenação pode surpreender
- **Headers Merge:** Headers são mesclados (merged), outros configs são sobrescritos

---

## 🧠 Fundamentos Teóricos

### Instalação do Axios

#### Via npm (Node Package Manager)

**npm** é o gerenciador de pacotes padrão para Node.js e projetos JavaScript modernos.

**Sintaxe de instalação:**
```bash
# Instalar como dependência de produção
npm install axios

# Forma curta
npm i axios

# Instalar versão específica
npm install axios@1.6.2

# Instalar e salvar em package.json (padrão desde npm 5)
npm install --save axios

# Ver no package.json:
# "dependencies": {
#   "axios": "^1.6.2"
# }
```

**Conceito de versão semântica (SemVer):**
- `^1.6.2`: Aceita updates de minor e patch (1.6.x, 1.7.0, mas não 2.0.0)
- `~1.6.2`: Aceita apenas patch updates (1.6.x, mas não 1.7.0)
- `1.6.2`: Versão exata, sem updates automáticos

**Onde Axios é instalado:**
```
projeto/
├── node_modules/
│   └── axios/          ← Código da biblioteca aqui
├── package.json        ← Dependência listada aqui
└── package-lock.json   ← Versões exatas de todas as dependências
```

**Conceito de `node_modules`:** Pasta onde todas as dependências (e suas dependências transitivas) são armazenadas. Não deve ser commitada ao git (adicionada em `.gitignore`).

#### Via Yarn

**Yarn** é alternativa ao npm, com sintaxe similar:

```bash
# Instalar axios
yarn add axios

# Versão específica
yarn add axios@1.6.2

# Ver no package.json:
# "dependencies": {
#   "axios": "^1.6.2"
# }

# Cria yarn.lock (equivalente ao package-lock.json)
```

**Vantagens do Yarn:**
- Geralmente mais rápido (downloads paralelos)
- Lock file mais determinístico historicamente
- Sintaxe considerada mais intuitiva por alguns

#### Via pnpm

**pnpm** é gerenciador moderno focado em eficiência:

```bash
# Instalar axios
pnpm add axios

# Versão específica
pnpm add axios@1.6.2
```

**Diferença conceitual:** pnpm usa **hard links** e **symbolic links** para compartilhar pacotes entre projetos, economizando espaço em disco significativamente.

#### Via CDN (Content Delivery Network)

Para uso direto em HTML sem build step (não recomendado para produção moderna):

```html
<!-- Axios via CDN -->
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js"></script>

<script>
  // axios está disponível globalmente
  axios.get('/api/dados')
    .then(response => console.log(response.data));
</script>
```

**Quando usar CDN:**
- Protótipos rápidos
- Exemplos em CodePen, JSFiddle
- Sites estáticos simples sem build process

**Por que evitar em produção:**
- Dependência de serviço externo (CDN pode cair)
- Sem controle de versão (se CDN atualizar, seu código pode quebrar)
- Performance (um arquivo adicional a baixar)

### Importando Axios no Código

#### ES6 Modules (Moderno)

**Sintaxe:**
```javascript
// Import padrão
import axios from 'axios';

// Usar
axios.get('/api/usuarios');
```

**Conceito:** ES6 modules (`import`/`export`) são padrão moderno JavaScript. Requerem build step (Webpack, Vite, etc.) ou `type: "module"` em package.json para Node.js.

**Quando usar:** Projetos modernos (React, Vue, Angular, etc.) que já usam bundler.

#### CommonJS (Node.js tradicional)

**Sintaxe:**
```javascript
// Require tradicional
const axios = require('axios');

// Usar
axios.get('/api/usuarios');
```

**Conceito:** CommonJS é sistema de módulos original do Node.js. Ainda amplamente usado, especialmente em código Node.js que não usa ES6 modules.

**Quando usar:** Scripts Node.js, APIs backend, projetos legacy.

#### Importação Nomeada (Desestruturação)

**Axios exporta algumas utilidades nomeadas:**
```javascript
// Importar apenas o que precisa (tree-shaking)
import axios, { AxiosError, AxiosHeaders } from 'axios';

// Verificar se erro é do Axios
if (error instanceof AxiosError) {
  console.log('Erro Axios:', error.response);
}
```

### Configuração Global: axios.defaults

#### Conceito de Configuração Global

`axios.defaults` é objeto que contém configurações aplicadas a **todas** as requisições feitas com a instância global `axios`.

**Sintaxe básica:**
```javascript
import axios from 'axios';

// Configurar base URL
axios.defaults.baseURL = 'https://api.example.com';

// Configurar timeout (ms)
axios.defaults.timeout = 5000;

// Configurar headers comuns
axios.defaults.headers.common['Authorization'] = 'Bearer token123';

// Configurar header específico de método
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Agora todas as requisições usam essas configurações
axios.get('/usuarios'); // GET https://api.example.com/usuarios
```

#### Base URL: Concatenação Inteligente

**Base URL** é prefixo adicionado a todas as URLs de requisição.

**Conceito de concatenação:**
```javascript
axios.defaults.baseURL = 'https://api.example.com';

// Requisições relativas
axios.get('/usuarios');        // https://api.example.com/usuarios
axios.get('usuarios');          // https://api.example.com/usuarios
axios.get('/api/v1/usuarios');  // https://api.example.com/api/v1/usuarios

// URLs absolutas ignoram baseURL
axios.get('https://outra-api.com/dados'); // https://outra-api.com/dados
```

**Trailing slash:**
```javascript
// ⚠️ Comportamento pode surpreender
axios.defaults.baseURL = 'https://api.example.com/v1';
axios.get('/usuarios'); // https://api.example.com/usuarios (v1 é removido!)

// ✅ Correto - trailing slash
axios.defaults.baseURL = 'https://api.example.com/v1/';
axios.get('usuarios'); // https://api.example.com/v1/usuarios

// ✅ Ou sem trailing slash mas com prefixo em todas as requisições
axios.defaults.baseURL = 'https://api.example.com';
axios.get('/v1/usuarios'); // https://api.example.com/v1/usuarios
```

**Conceito:** URL concatenation segue padrão de URLs - `/` no início da URL relativa "reseta" o path da base URL. Use trailing slash na base URL e paths sem `/` inicial, ou vice-versa.

#### Timeout: Tempo Máximo de Espera

**Timeout** define quanto tempo (em milissegundos) aguardar resposta antes de abortar requisição.

```javascript
// Timeout global de 5 segundos
axios.defaults.timeout = 5000;

axios.get('/dados'); // Abortará após 5s se servidor não responder

// Se timeout ocorrer
axios.get('/dados-lentos')
  .catch(error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Requisição expirou');
    }
  });
```

**Conceito:** Timeout previne que requisições "travem" indefinidamente. Especialmente importante para:
- APIs lentas
- Redes instáveis
- UX (usuário não deve esperar eternamente)

**Valores comuns:**
- **5000ms (5s):** Padrão razoável para APIs normais
- **10000ms (10s):** APIs que podem demorar (relatórios, processamento)
- **30000ms (30s):** Uploads de arquivos grandes

#### Headers Globais

**Headers globais** são adicionados automaticamente a todas as requisições.

**Tipos de headers:**
```javascript
// Headers comuns a TODOS os métodos (GET, POST, etc.)
axios.defaults.headers.common['Authorization'] = 'Bearer token';
axios.defaults.headers.common['Accept-Language'] = 'pt-BR';

// Headers apenas para GET
axios.defaults.headers.get['Cache-Control'] = 'no-cache';

// Headers apenas para POST
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Headers apenas para PUT
axios.defaults.headers.put['Content-Type'] = 'application/json';
```

**Conceito de merge:** Headers são **mesclados** (merged). Header específico da requisição sobrescreve header de método, que sobrescreve header comum.

```javascript
axios.defaults.headers.common['X-App'] = 'MeuApp';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.post('/dados', payload, {
  headers: {
    'Content-Type': 'application/xml', // Sobrescreve default post
    'X-Custom': 'Valor' // Adiciona novo header
  }
});

// Headers enviados:
// X-App: MeuApp (de common)
// Content-Type: application/xml (sobrescrito)
// X-Custom: Valor (adicionado)
```

#### Outras Configurações Globais

**withCredentials:** Enviar cookies em requisições cross-origin
```javascript
axios.defaults.withCredentials = true;
// Agora cookies são enviados mesmo para domínios diferentes
```

**responseType:** Tipo de resposta esperado
```javascript
axios.defaults.responseType = 'json'; // Padrão
// Opções: 'json', 'text', 'blob', 'arraybuffer', 'document', 'stream'
```

**maxRedirects:** Máximo de redirecionamentos a seguir
```javascript
axios.defaults.maxRedirects = 5; // Padrão
```

### Criando Instâncias Customizadas: axios.create()

#### Conceito de Instância

`axios.create()` cria uma **nova instância do Axios** com configurações independentes da instância global. Cada instância é um "cliente HTTP isolado".

**Sintaxe:**
```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Usar instância
apiClient.get('/usuarios'); // GET https://api.example.com/usuarios
```

**Conceito:** Instâncias permitem **separação de configurações**. Você pode ter múltiplas instâncias para diferentes APIs, cada uma com sua base URL, headers, timeout, etc.

#### Por Que Usar Instâncias

**Cenário: Múltiplas APIs**

```javascript
// API principal do backend
const apiBackend = axios.create({
  baseURL: 'https://api.minhaapp.com',
  headers: { 'Authorization': `Bearer ${tokenBackend}` }
});

// API de terceiros (analytics)
const apiAnalytics = axios.create({
  baseURL: 'https://analytics.service.com',
  headers: { 'X-API-Key': analyticsKey }
});

// API de pagamento
const apiPagamento = axios.create({
  baseURL: 'https://payment.gateway.com',
  headers: { 'X-Payment-Token': paymentToken },
  timeout: 30000 // Pagamentos podem demorar mais
});

// Usar cada uma independentemente
apiBackend.get('/usuarios');
apiAnalytics.post('/events', eventData);
apiPagamento.post('/charge', chargeData);
```

**Vantagens:**
- **Isolamento:** Mudança em uma API não afeta outras
- **Clareza:** Código autodocumenta qual API está sendo usada
- **Manutenibilidade:** Cada API tem configuração centralizada

#### Configurações de Instância

Instâncias aceitam mesmo objeto de configuração que requisições:

```javascript
const api = axios.create({
  // URL
  baseURL: 'https://api.example.com',
  
  // Timeout
  timeout: 5000,
  
  // Headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Auth (Basic ou Bearer)
  auth: {
    username: 'user',
    password: 'pass'
  },
  
  // Params (query string padrão)
  params: {
    apiKey: 'abc123'
  },
  
  // Response type
  responseType: 'json',
  
  // Max redirects
  maxRedirects: 5,
  
  // Validate status
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Padrão
  }
});
```

#### Modificando Defaults de Instância

Assim como `axios.defaults`, instâncias têm `instance.defaults`:

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com'
});

// Modificar defaults da instância depois de criada
api.defaults.timeout = 10000;
api.defaults.headers.common['Authorization'] = 'Bearer novo-token';

// Não afeta axios global, apenas esta instância
```

### Precedência de Configurações

**Ordem de precedência** (maior prioridade primeiro):
1. **Configuração da requisição individual**
2. **Defaults da instância** (`instance.defaults`)
3. **Defaults globais** (`axios.defaults`)
4. **Defaults da biblioteca** (valores hardcoded no Axios)

**Exemplo:**
```javascript
// 1. Defaults globais
axios.defaults.timeout = 5000;

// 2. Instância com defaults próprios
const api = axios.create({
  timeout: 10000 // Sobrescreve global
});

// 3. Requisição com config específica
api.get('/dados', {
  timeout: 15000 // Sobrescreve instância
});

// Timeout usado: 15000ms (mais específico vence)
```

**Conceito:** Configurações são **merged** (mescladas) de forma hierárquica. Mais específico sempre sobrescreve menos específico.

### Padrão de API Client

**Padrão comum:** Criar módulo dedicado que exporta instância Axios configurada.

**Estrutura de arquivos:**
```
src/
├── api/
│   ├── client.js        ← Instância Axios configurada
│   ├── users.js         ← Funções que usam client para user endpoints
│   └── products.js      ← Funções que usam client para product endpoints
├── App.jsx
└── index.js
```

**api/client.js:**
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor (adicionar token)
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor (tratamento de erro global)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logout user
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**api/users.js:**
```javascript
import apiClient from './client';

export const userAPI = {
  getAll: () => apiClient.get('/users'),
  
  getById: (id) => apiClient.get(`/users/${id}`),
  
  create: (userData) => apiClient.post('/users', userData),
  
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  
  delete: (id) => apiClient.delete(`/users/${id}`)
};
```

**Uso em componente:**
```javascript
import { userAPI } from './api/users';

async function loadUsers() {
  try {
    const response = await userAPI.getAll();
    console.log(response.data);
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
  }
}
```

**Benefícios deste padrão:**
- **Single Source of Truth:** Configuração HTTP em um lugar
- **Abstração:** Componentes não sabem detalhes de HTTP
- **Testabilidade:** Fácil mockar `apiClient` em testes
- **Manutenibilidade:** Mudanças em API afetam apenas arquivos em `api/`

---

## 🔍 Análise Conceitual Profunda

### Variáveis de Ambiente

**Conceito:** Variáveis de ambiente permitem **separar configuração de código**. Valores diferentes em dev, staging, produção sem mudar código.

**Arquivo .env (React/Vite):**
```env
# .env.development
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_TIMEOUT=10000

# .env.production
REACT_APP_API_URL=https://api.prod.example.com
REACT_APP_TIMEOUT=5000
```

**Uso em código:**
```javascript
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: Number(process.env.REACT_APP_TIMEOUT)
});
```

**Conceito de build time vs runtime:**
- **React (Create React App):** Variáveis são **injetadas em build time** (substituídas no bundle)
- **Node.js:** Variáveis são **lidas em runtime** (process.env é dinâmico)

**Segurança:** Nunca commitar `.env` com secrets (tokens, senhas). Use `.env.example` como template:

```env
# .env.example (commitado)
REACT_APP_API_URL=
REACT_APP_ANALYTICS_KEY=

# .env (não commitado, em .gitignore)
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ANALYTICS_KEY=abc123secret
```

### Headers Customizados

**Quando usar headers customizados:**
- **Autenticação:** `Authorization: Bearer token`
- **API Keys:** `X-API-Key: abc123`
- **Rate Limiting:** `X-RateLimit-Limit: 1000`
- **Tracking:** `X-Request-ID: uuid`
- **Versioning:** `X-API-Version: 2.0`

**Convenção:** Headers customizados historicamente usavam prefixo `X-`, mas RFC 6648 deprecia isso. Hoje, use nomes descritivos sem `X-`:
- ~~`X-API-Key`~~ → `API-Key`
- ~~`X-Request-ID`~~ → `Request-ID`

Mas muitas APIs ainda usam `X-` por costume.

### Timeout e Retry

**Timeout** previne requisições "travadas", mas pode causar falhas em operações lentas porém legítimas.

**Padrão comum: Timeout + Retry**

```javascript
const api = axios.create({
  timeout: 5000 // 5s timeout
});

// Interceptor de retry
api.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Retry apenas para timeouts e erros de rede
    if (!config || !config.retry || config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }
    
    config.__retryCount = config.__retryCount || 0;
    config.__retryCount += 1;
    
    // Aguardar antes de retry (exponential backoff)
    const delay = Math.pow(2, config.__retryCount) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return api(config);
  }
);

// Usar com retry
api.get('/dados', { retry: 3 }); // Tentará até 3 vezes
```

### Configuração Dinâmica

**Cenário:** Token de autenticação muda (usuário faz login).

**Opção 1: Modificar defaults**
```javascript
// Após login
const token = await login(email, password);
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Após logout
delete axios.defaults.headers.common['Authorization'];
```

**Opção 2: Interceptor dinâmico (melhor)**
```javascript
// Configurar uma vez
apiClient.interceptors.request.use(config => {
  // Ler token sempre que requisição é feita (sempre atualizado)
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Após login
localStorage.setItem('authToken', token);

// Após logout
localStorage.removeItem('authToken');
```

**Vantagem interceptor:** Token sempre atualizado, não precisa modificar defaults manualmente.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Configuração Global vs Instância

**Use configuração global (`axios.defaults`) quando:**
- Projeto pequeno com uma única API
- Todos os endpoints usam mesmas configurações
- Prototipagem rápida

**Use instâncias (`axios.create()`) quando:**
- Múltiplas APIs (backend, analytics, pagamento, etc.)
- Diferentes timeouts/headers para diferentes endpoints
- Projeto grande ou médio (melhor organização)
- **Recomendação:** Use instâncias em qualquer projeto profissional

### Quando Criar Múltiplas Instâncias

**Crie instâncias separadas para:**
- **APIs diferentes** (backend, terceiros)
- **Versões diferentes** de mesma API (v1, v2)
- **Ambientes diferentes** (mock para testes, real para produção)
- **Autenticações diferentes** (user endpoints vs admin endpoints)

```javascript
// Exemplo: API v1 e v2
const apiV1 = axios.create({ baseURL: '/api/v1' });
const apiV2 = axios.create({ baseURL: '/api/v2' });

// Migração gradual v1 → v2
const users = await apiV2.get('/users'); // Novo endpoint
const products = await apiV1.get('/products'); // Endpoint antigo ainda em v1
```

### Padrões de Organização

**Opção 1: Cliente único, funções separadas**
```javascript
// api/client.js
export const apiClient = axios.create({...});

// api/users.js
import { apiClient } from './client';
export const getUsers = () => apiClient.get('/users');

// api/products.js
import { apiClient } from './client';
export const getProducts = () => apiClient.get('/products');
```

**Opção 2: Service layer (OOP)**
```javascript
// api/UserService.js
class UserService {
  constructor(client) {
    this.client = client;
  }
  
  async getAll() {
    const response = await this.client.get('/users');
    return response.data;
  }
  
  async getById(id) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }
}

export default new UserService(apiClient);
```

**Opção 3: Repository pattern**
```javascript
// repositories/UserRepository.js
export class UserRepository {
  constructor(httpClient) {
    this.http = httpClient;
  }
  
  findAll() {
    return this.http.get('/users').then(r => r.data);
  }
  
  findById(id) {
    return this.http.get(`/users/${id}`).then(r => r.data);
  }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Mutabilidade de axios.defaults

**Problema:** `axios.defaults` é **mutável** - pode ser modificado a qualquer momento.

```javascript
axios.defaults.baseURL = 'https://api1.com';

// Em outro arquivo (ou biblioteca de terceiros)
axios.defaults.baseURL = 'https://api2.com'; // Sobrescreve!

// Requisições agora usam api2.com inesperadamente
```

**Solução:** Use **instâncias** ao invés de modificar global:

```javascript
const api1 = axios.create({ baseURL: 'https://api1.com' });
const api2 = axios.create({ baseURL: 'https://api2.com' });

// Isolado, sem side effects
```

### Variáveis de Ambiente em Frontend

**Segurança:** Em aplicações frontend (React, Vue), variáveis de ambiente são **injetadas no bundle** em build time. Isso significa que **qualquer um pode ver** abrindo DevTools.

**Implicação:** Nunca coloque secrets reais em variáveis de ambiente frontend:
```env
# ❌ ERRADO - API key secreta exposta no frontend
REACT_APP_SECRET_KEY=super-secret-123

# ✅ CORRETO - apenas valores públicos
REACT_APP_API_URL=https://api.example.com
```

**Secrets** devem estar apenas no backend, acessados via endpoints autenticados.

### Headers Case Sensitivity

**HTTP headers** são **case-insensitive** por especificação, mas alguns servidores/frameworks podem ser case-sensitive.

**Boa prática:** Use **Title-Case** (cada palavra capitalizada):
```javascript
// ✅ Padrão
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token'
}

// ⚠️ Funciona, mas não padrão
headers: {
  'content-type': 'application/json',
  'authorization': 'Bearer token'
}
```

Axios normaliza headers internamente, mas seguir convenção evita surpresas.

---

## 🔗 Interconexões Conceituais

### Instalação e Package.json

`package.json` é **manifesto** do projeto Node.js. Lista dependências, scripts, metadados.

**Dependências vs DevDependencies:**
```json
{
  "dependencies": {
    "axios": "^1.6.2"  // Necessário em produção
  },
  "devDependencies": {
    "jest": "^29.0.0"  // Apenas para desenvolvimento (testes)
  }
}
```

Axios é **dependency** (não devDependency) pois é usado em produção.

### Configuração e Interceptors

Configuração define **valores padrão**. Interceptors permitem **lógica dinâmica**.

**Complementares:**
```javascript
// Configuração: valores estáticos
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// Interceptor: lógica dinâmica
api.interceptors.request.use(config => {
  config.headers['X-Request-Time'] = Date.now();
  return config;
});
```

### Configuração e Ambiente

**Configuração** muda conforme **ambiente** (dev, staging, prod). Variáveis de ambiente são ponte entre código e ambiente.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após instalar e configurar Axios:

1. **Fazer Requisições Básicas:** GET, POST, PUT, DELETE
2. **Interceptors:** Adicionar lógica global (auth, logging, transformação)
3. **Tratamento de Erros:** Lidar com diferentes tipos de erro
4. **Testing:** Mockar Axios em testes
5. **Patterns Avançados:** Retry logic, caching, cancelamento

### Conceitos Avançados

- **Monorepo:** Compartilhar configuração Axios entre múltiplos pacotes
- **Servidor Proxy:** Usar proxy para contornar CORS em desenvolvimento
- **Service Worker:** Interceptar requisições Axios com SW
- **TypeScript:** Tipar configurações e respostas Axios

---

## 📚 Conclusão

Instalação e configuração do Axios são **fundação** para comunicação HTTP eficiente e organizada. Embora simples (`npm install axios`), a forma como você configura Axios impacta:

- **Manutenibilidade:** Configuração centralizada facilita mudanças
- **Escalabilidade:** Instâncias isoladas permitem crescimento sem confusão
- **Segurança:** Configuração correta de headers e timeouts protege aplicação
- **Developer Experience:** Boa estrutura acelera desenvolvimento

**Princípios-chave:**
- Instale via npm/yarn/pnpm (não CDN em produção)
- Use variáveis de ambiente para separar config de código
- Crie instâncias (`axios.create()`) para projetos profissionais
- Configure base URL, timeout, headers padrão
- Organize código em service layer ou repository pattern

Com Axios bem configurado, você estabelece infraestrutura sólida para toda comunicação HTTP da aplicação, permitindo foco em lógica de negócio ao invés de detalhes de requisições.
