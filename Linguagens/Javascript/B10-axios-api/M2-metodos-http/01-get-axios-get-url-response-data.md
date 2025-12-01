# GET: axios.get(url) e response.data

## 🎯 Introdução e Definição

### Definição Conceitual

O método **GET** no Axios é uma função que permite **recuperar dados** de um servidor através de requisições HTTP GET. Conceitualmente, `axios.get()` representa uma **operação de leitura** - solicitar ao servidor que envie uma representação de um recurso específico sem modificar o estado do servidor.

Na essência, `axios.get(url)` é uma **abstração elegante** sobre requisições HTTP GET, retornando uma Promise que resolve com um objeto `response` contendo os dados solicitados, metadados da requisição, e informações sobre a resposta do servidor. O acesso aos dados reais se dá através de `response.data`, que é o **corpo da resposta** já parseado e pronto para uso.

### Contexto Histórico e Motivação

Antes do Axios, fazer requisições GET em JavaScript envolvia verbosidade significativa. Com **XMLHttpRequest**, uma simples busca de dados requeria múltiplas linhas:

```javascript
// XMLHttpRequest - verboso e baseado em callbacks
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/usuarios', true);

xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    var dados = JSON.parse(xhr.responseText);
    console.log(dados);
  } else {
    console.error('Erro:', xhr.status);
  }
};

xhr.onerror = function() {
  console.error('Erro de rede');
};

xhr.send();
```

Com a **Fetch API** (2015), a situação melhorou, mas ainda requeria múltiplos passos:

```javascript
// Fetch - melhor, mas multi-step
fetch('/api/usuarios')
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP error ' + response.status);
    }
    return response.json(); // Parse manual de JSON
  })
  .then(dados => console.log(dados))
  .catch(erro => console.error(erro));
```

**Axios** simplificou drasticamente esse processo:

```javascript
// Axios - conciso e direto
axios.get('/api/usuarios')
  .then(response => console.log(response.data))
  .catch(erro => console.error(erro));
```

A **motivação** para `axios.get()` ser tão simples:
- **Parsing Automático:** JSON é parseado automaticamente - `response.data` já é objeto JavaScript
- **Tratamento de Erro Automático:** Erros HTTP (4xx, 5xx) automaticamente rejeitam Promise
- **Interface Uniforme:** Mesma estrutura de response independentemente do método HTTP
- **Menos Código:** Uma linha faz requisição completa

### Problema Fundamental que Resolve

`axios.get()` resolve problemas fundamentais de recuperação de dados via HTTP:

**1. Verbosidade de Requisições:** Reduz requisições GET de 10+ linhas (XHR) para 1-2 linhas, aumentando produtividade e legibilidade.

**2. Parsing Manual de JSON:** Elimina necessidade de `JSON.parse(responseText)` ou `response.json()`. Axios detecta `Content-Type: application/json` e parseia automaticamente.

**3. Tratamento de Erro Inconsistente:** Com Fetch, você precisa verificar `response.ok` manualmente. Axios rejeita automaticamente para erros HTTP, tornando `.catch()` suficiente.

**4. Acesso a Metadados:** Response object unificado fornece não só dados (`data`), mas também status HTTP (`status`), headers (`headers`), e configuração original (`config`).

**5. Integração com Promises e Async/Await:** Retornar Promise permite uso natural com `.then()/.catch()` ou `async/await`, integrando-se perfeitamente com JavaScript moderno.

### Importância no Ecossistema

`axios.get()` é provavelmente o **método mais usado** em aplicações web que consomem APIs:

- **SPAs (Single Page Applications):** React, Vue, Angular apps usam GET constantemente para carregar dados
- **Dashboards e Admin Panels:** Buscar listas de recursos (usuários, produtos, relatórios)
- **APIs RESTful:** GET mapeia diretamente para operação READ do CRUD
- **Server-Side Rendering:** Node.js apps usam GET para buscar dados durante renderização
- **Microservices:** Serviços comunicam-se via GET para buscar dados de outros serviços

A simplicidade de `axios.get()` democratizou acesso a APIs, permitindo que desenvolvedores iniciantes façam requisições HTTP complexas com confiança e poucas linhas de código.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **GET como Operação Idempotente e Safe:** Múltiplas execuções não modificam servidor, apenas leem dados
2. **Response Object como Estrutura Unificada:** Axios sempre retorna mesmo formato de response
3. **response.data como Corpo Parseado:** Acesso direto aos dados sem parsing manual
4. **Query Parameters para Filtragem:** `params` option permite passar filtros, paginação, ordenação
5. **Caching de Requisições GET:** Navegadores e proxies podem cachear GETs automaticamente

### Pilares Fundamentais

- **Simplicidade Sintática:** `axios.get(url)` é tudo que você precisa para requisição básica
- **Promise-Based:** Retorna Promise, permitindo encadeamento e async/await
- **Parsing Automático:** JSON detectado e parseado sem intervenção
- **Estrutura Previsível:** `response.data` sempre contém corpo da resposta
- **Metadados Acessíveis:** Status, headers, config disponíveis em response object

### Visão Geral das Nuances

- **response.data vs response:** Dados estão em `response.data`, não diretamente em `response`
- **Query String Encoding:** Axios codifica `params` automaticamente (`espaço` → `%20`)
- **Array Parameters:** Arrays em params podem ser serializados de múltiplas formas
- **Cancelamento de GET:** GETs podem ser cancelados se demorarem demais ou se tornarem desnecessários
- **Headers Customizados:** Mesmo em GET, você pode enviar headers (Authorization, Accept, etc.)

---

## 🧠 Fundamentos Teóricos

### Anatomia de axios.get()

#### Sintaxe Básica

A forma mais simples de `axios.get()`:

```javascript
axios.get(url)
```

**Parâmetros:**
- `url` (string): URL completa ou relativa (se `baseURL` configurada) do recurso

**Retorno:** Promise que resolve com `response` object ou rejeita com `error` object.

**Exemplo mínimo:**
```javascript
axios.get('/api/usuarios')
  .then(response => {
    console.log(response.data); // Array de usuários
  })
  .catch(error => {
    console.error('Erro:', error.message);
  });
```

#### Sintaxe com Configuração

Forma completa com objeto de configuração:

```javascript
axios.get(url, config)
```

**Parâmetros:**
- `url` (string): URL do recurso
- `config` (objeto, opcional): Configurações adicionais

**Exemplo com config:**
```javascript
axios.get('/api/usuarios', {
  params: { role: 'admin', limit: 10 },
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

### Estrutura do Response Object

Quando Promise resolve, você recebe um **response object** com estrutura padronizada:

```javascript
{
  data: {},           // Corpo da resposta (parseado se JSON)
  status: 200,        // Código de status HTTP
  statusText: 'OK',   // Texto do status HTTP
  headers: {},        // Headers da resposta (normalizado para lowercase)
  config: {},         // Configuração que gerou essa requisição
  request: {}         // Objeto de requisição nativo (XMLHttpRequest ou http.request)
}
```

**Análise de cada campo:**

**1. data:** O mais importante - contém **corpo da resposta**.
```javascript
const response = await axios.get('/api/usuarios');
console.log(response.data);
// Se servidor retornou: [{ id: 1, nome: 'João' }, { id: 2, nome: 'Maria' }]
// response.data é esse array, já parseado
```

**2. status:** Código HTTP numérico (200, 404, 500, etc.).
```javascript
if (response.status === 200) {
  console.log('Sucesso!');
}
```

**3. statusText:** Descrição textual do status.
```javascript
console.log(response.statusText); // 'OK', 'Not Found', etc.
```

**4. headers:** Headers da resposta (case-insensitive, normalizado para lowercase).
```javascript
console.log(response.headers['content-type']); // 'application/json'
console.log(response.headers['cache-control']); // 'max-age=3600'
```

**5. config:** Configuração original que gerou requisição.
```javascript
console.log(response.config.url); // '/api/usuarios'
console.log(response.config.method); // 'get'
```

**6. request:** Objeto de requisição nativo (geralmente não usado diretamente).
```javascript
console.log(response.request); // XMLHttpRequest ou http.ClientRequest
```

### Acessando response.data

**Conceito crucial:** Dados reais estão em `response.data`, não em `response` diretamente.

**❌ Erro comum:**
```javascript
const response = await axios.get('/api/usuarios');
console.log(response); // { data: [...], status: 200, ... }
// response não é array de usuários!

response.forEach(u => console.log(u.nome)); // ERRO!
```

**✅ Correto:**
```javascript
const response = await axios.get('/api/usuarios');
console.log(response.data); // [{ id: 1, nome: 'João' }, ...]
// response.data é array de usuários

response.data.forEach(u => console.log(u.nome)); // Funciona!
```

**Padrão comum - desestruturação:**
```javascript
// Extrair apenas data
const { data } = await axios.get('/api/usuarios');
console.log(data); // [{ id: 1, nome: 'João' }, ...]

// Ou extrair múltiplos campos
const { data, status, headers } = await axios.get('/api/usuarios');
console.log('Dados:', data);
console.log('Status:', status);
console.log('Content-Type:', headers['content-type']);
```

### Parsing Automático de JSON

**Conceito:** Axios detecta `Content-Type: application/json` e automaticamente parseia response body.

**Como funciona internamente:**
1. Servidor envia response com header `Content-Type: application/json`
2. Axios lê esse header
3. Axios executa `JSON.parse(responseText)` automaticamente
4. Resultado parseado é colocado em `response.data`

**Comparação Fetch vs Axios:**
```javascript
// Fetch - parsing manual
const response = await fetch('/api/usuarios');
const dados = await response.json(); // Parse manual necessário

// Axios - parsing automático
const response = await axios.get('/api/usuarios');
const dados = response.data; // Já parseado!
```

**Outros formatos:**
Se resposta não for JSON, `response.data` contém string ou outro formato conforme `responseType`:

```javascript
// Texto plano
const response = await axios.get('/arquivo.txt');
console.log(response.data); // String com conteúdo do arquivo

// HTML
const response = await axios.get('/pagina.html');
console.log(response.data); // String com HTML

// Blob (arquivo binário)
const response = await axios.get('/imagem.jpg', { responseType: 'blob' });
console.log(response.data); // Blob object
```

### Query Parameters (params)

**Conceito:** Query parameters são dados enviados na **query string** da URL (após `?`).

**Sintaxe manual:**
```javascript
axios.get('/api/usuarios?role=admin&limit=10');
```

**Sintaxe com params (preferida):**
```javascript
axios.get('/api/usuarios', {
  params: {
    role: 'admin',
    limit: 10
  }
});
```

**Vantagens de usar `params`:**
1. **Encoding automático:** Axios codifica valores especiais automaticamente
2. **Legibilidade:** Objeto JavaScript é mais claro que string manual
3. **Tipagem:** Em TypeScript, params podem ser tipados
4. **Manutenibilidade:** Fácil adicionar/remover parâmetros

**Encoding automático:**
```javascript
axios.get('/api/usuarios', {
  params: {
    nome: 'João Silva', // Espaço será codificado
    email: 'joao@example.com' // @ será codificado
  }
});
// URL gerada: /api/usuarios?nome=Jo%C3%A3o%20Silva&email=joao%40example.com
```

**Arrays em params:**
```javascript
axios.get('/api/produtos', {
  params: {
    categorias: ['eletrônicos', 'livros', 'roupas']
  }
});
// URL gerada (padrão): /api/produtos?categorias[]=eletrônicos&categorias[]=livros&categorias[]=roupas

// Customizar serialização
axios.get('/api/produtos', {
  params: {
    categorias: ['eletrônicos', 'livros']
  },
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  }
});
// URL: /api/produtos?categorias=eletrônicos&categorias=livros
```

**Null e Undefined:**
```javascript
axios.get('/api/usuarios', {
  params: {
    nome: 'João',
    idade: null,      // Omitido da query string
    cidade: undefined // Omitido da query string
  }
});
// URL: /api/usuarios?nome=João
```

### Uso com Async/Await

**Sintaxe moderna e preferida:**

```javascript
async function buscarUsuarios() {
  try {
    const response = await axios.get('/api/usuarios');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    throw error;
  }
}

// Usar
const usuarios = await buscarUsuarios();
console.log(usuarios);
```

**Padrão com desestruturação:**
```javascript
async function buscarUsuario(id) {
  try {
    const { data } = await axios.get(`/api/usuarios/${id}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('Usuário não encontrado');
      return null;
    }
    throw error;
  }
}
```

**Múltiplas requisições GET sequenciais:**
```javascript
async function buscarDadosCompletos(userId) {
  // Buscar usuário
  const { data: usuario } = await axios.get(`/api/usuarios/${userId}`);
  
  // Buscar posts do usuário (depende de userId)
  const { data: posts } = await axios.get('/api/posts', {
    params: { userId: usuario.id }
  });
  
  // Buscar comentários do primeiro post
  const { data: comentarios } = await axios.get('/api/comentarios', {
    params: { postId: posts[0].id }
  });
  
  return { usuario, posts, comentarios };
}
```

**Múltiplas requisições GET paralelas:**
```javascript
async function buscarDashboard() {
  // Executar todas em paralelo (independentes)
  const [
    { data: usuarios },
    { data: produtos },
    { data: vendas }
  ] = await Promise.all([
    axios.get('/api/usuarios'),
    axios.get('/api/produtos'),
    axios.get('/api/vendas')
  ]);
  
  return { usuarios, produtos, vendas };
}
```

---

## 🔍 Análise Conceitual Profunda

### GET e REST: Operações de Leitura

**GET mapeia para READ no CRUD:**
- **C**reate → POST
- **R**ead → GET ✓
- **U**pdate → PUT/PATCH
- **D**elete → DELETE

**Padrões RESTful com GET:**

**1. Listar coleção:**
```javascript
// GET /api/usuarios - Lista todos os usuários
const { data } = await axios.get('/api/usuarios');
console.log(data); // [{ id: 1, ... }, { id: 2, ... }]
```

**2. Buscar recurso individual:**
```javascript
// GET /api/usuarios/123 - Busca usuário com ID 123
const { data } = await axios.get('/api/usuarios/123');
console.log(data); // { id: 123, nome: 'João', ... }
```

**3. Buscar sub-recursos:**
```javascript
// GET /api/usuarios/123/posts - Posts do usuário 123
const { data } = await axios.get('/api/usuarios/123/posts');
console.log(data); // [{ id: 1, titulo: '...' }, ...]
```

**4. Filtrar, paginar, ordenar:**
```javascript
// GET /api/produtos?categoria=eletrônicos&page=2&sort=preco
const { data } = await axios.get('/api/produtos', {
  params: {
    categoria: 'eletrônicos',
    page: 2,
    limit: 20,
    sort: 'preco',
    order: 'asc'
  }
});
```

### Headers em Requisições GET

Mesmo sendo operação de leitura, GET pode enviar headers para:

**1. Autenticação:**
```javascript
const { data } = await axios.get('/api/perfil', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});
```

**2. Negociação de conteúdo:**
```javascript
const { data } = await axios.get('/api/dados', {
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'pt-BR'
  }
});
```

**3. Caching condicional:**
```javascript
const { data } = await axios.get('/api/recursos', {
  headers: {
    'If-None-Match': '"33a64df551425fcc55e4d42a148795d9f25f89d4"',
    'If-Modified-Since': 'Wed, 21 Oct 2025 07:28:00 GMT'
  }
});
// Se não modificou: servidor retorna 304 Not Modified (sem body)
```

**4. Headers customizados:**
```javascript
const { data } = await axios.get('/api/dados', {
  headers: {
    'X-Request-ID': crypto.randomUUID(),
    'X-Client-Version': '1.2.3'
  }
});
```

### Tratamento de Erros em GET

**Estrutura de erro Axios:**
```javascript
try {
  const { data } = await axios.get('/api/usuarios/999');
} catch (error) {
  if (error.response) {
    // Servidor respondeu com status fora de 2xx
    console.log('Erro HTTP:', error.response.status);
    console.log('Dados do erro:', error.response.data);
    console.log('Headers:', error.response.headers);
    
    if (error.response.status === 404) {
      console.log('Usuário não encontrado');
    } else if (error.response.status === 401) {
      console.log('Não autenticado - redirecionar para login');
    }
  } else if (error.request) {
    // Requisição foi enviada mas sem resposta
    console.log('Sem resposta do servidor');
    console.log('Possível problema de rede');
  } else {
    // Erro ao configurar requisição
    console.log('Erro:', error.message);
  }
}
```

**Padrão: Tratamento específico por status:**
```javascript
async function buscarUsuario(id) {
  try {
    const { data } = await axios.get(`/api/usuarios/${id}`);
    return data;
  } catch (error) {
    const status = error.response?.status;
    
    switch (status) {
      case 404:
        console.warn('Usuário não existe');
        return null;
      case 401:
        console.error('Não autenticado');
        redirectToLogin();
        return null;
      case 403:
        console.error('Sem permissão para acessar este usuário');
        return null;
      case 500:
        console.error('Erro interno do servidor');
        showErrorNotification('Erro ao buscar usuário. Tente novamente.');
        return null;
      default:
        console.error('Erro desconhecido:', error.message);
        throw error;
    }
  }
}
```

### Padrões de Uso Comuns

#### Padrão 1: Service/Repository Layer

**Encapsular GETs em funções:**

```javascript
// services/userService.js
import apiClient from './apiClient';

export const userService = {
  async getAll(filters = {}) {
    const { data } = await apiClient.get('/usuarios', { params: filters });
    return data;
  },
  
  async getById(id) {
    const { data } = await apiClient.get(`/usuarios/${id}`);
    return data;
  },
  
  async search(query) {
    const { data } = await apiClient.get('/usuarios/search', {
      params: { q: query }
    });
    return data;
  }
};

// Uso em componente
import { userService } from './services/userService';

const usuarios = await userService.getAll({ role: 'admin' });
const usuario = await userService.getById(123);
```

#### Padrão 2: Loading States em UIs

```javascript
// React component
function UserList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/usuarios');
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <ul>
      {usuarios.map(u => <li key={u.id}>{u.nome}</li>)}
    </ul>
  );
}
```

#### Padrão 3: Busca com Debounce

```javascript
// Busca que não dispara requisição a cada tecla
function SearchBar() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  
  useEffect(() => {
    // Debounce - espera 300ms após última tecla
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        const { data } = await axios.get('/api/search', {
          params: { q: query }
        });
        setResultados(data);
      }
    }, 300);
    
    return () => clearTimeout(timer); // Limpar timer anterior
  }, [query]);
  
  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      <ul>
        {resultados.map(r => <li key={r.id}>{r.titulo}</li>)}
      </ul>
    </div>
  );
}
```

#### Padrão 4: Paginação

```javascript
async function listarProdutos(pagina = 1, limite = 20) {
  const { data, headers } = await axios.get('/api/produtos', {
    params: {
      page: pagina,
      limit: limite
    }
  });
  
  // Metadados de paginação frequentemente vêm em headers
  const totalItems = parseInt(headers['x-total-count']);
  const totalPages = Math.ceil(totalItems / limite);
  
  return {
    items: data,
    pagination: {
      currentPage: pagina,
      totalPages,
      totalItems,
      itemsPerPage: limite
    }
  };
}

// Uso
const resultado = await listarProdutos(2, 20);
console.log('Página 2:', resultado.items);
console.log('Total de páginas:', resultado.pagination.totalPages);
```

#### Padrão 5: Retry com Exponential Backoff

```javascript
async function getComRetry(url, maxTentativas = 3) {
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      // Retry apenas para erros de rede ou 5xx
      const shouldRetry = 
        !error.response || 
        (error.response.status >= 500 && error.response.status < 600);
      
      if (!shouldRetry || tentativa === maxTentativas) {
        throw error; // Última tentativa ou erro não-retry-able
      }
      
      // Exponential backoff: 1s, 2s, 4s...
      const delay = Math.pow(2, tentativa - 1) * 1000;
      console.log(`Tentativa ${tentativa} falhou. Aguardando ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Uso
const dados = await getComRetry('/api/dados-importantes', 5);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar GET

**Use GET quando:**
- Buscar lista de recursos (usuários, produtos, posts)
- Buscar recurso individual por ID
- Buscar dados computados (relatórios, estatísticas, dashboards)
- Operações de leitura que não modificam servidor
- Buscar sub-recursos (posts de um usuário, comentários de um post)

**Não use GET quando:**
- Criar novo recurso (use POST)
- Atualizar recurso (use PUT/PATCH)
- Deletar recurso (use DELETE)
- Operação modifica estado do servidor
- Dados sensíveis que não devem aparecer em URLs (use POST com body)

### Quando Usar params vs URL Manual

**Use `params` object quando:**
- Valores são dinâmicos (variáveis, user input)
- Valores contêm caracteres especiais (espaços, @, #, etc.)
- Múltiplos parâmetros opcionais
- Arrays ou objetos complexos
- Quer legibilidade e manutenibilidade

**URL manual pode ser aceitável quando:**
- Parâmetros são fixos e simples (`/api/usuarios?role=admin`)
- Prototipagem rápida
- Query string muito simples

### Quando Desestruturar response vs Usar Completo

**Desestruturar `{ data }` quando:**
- Só precisa dos dados
- Código mais limpo e conciso

```javascript
const { data } = await axios.get('/usuarios');
return data;
```

**Usar `response` completo quando:**
- Precisa de status, headers, ou outros metadados
- Debugging (ver config original)
- Verificar status code específico

```javascript
const response = await axios.get('/usuarios');
console.log('Status:', response.status);
console.log('Headers:', response.headers);
return response.data;
```

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações de Tamanho de URL

**URLs têm limite de comprimento** (geralmente ~2000 caracteres em navegadores, ~8000 no servidor).

**Problema:** Query strings muito longas podem exceder limite:
```javascript
// ❌ Pode falhar se IDs array é muito grande
const ids = [1, 2, 3, ..., 1000]; // 1000 IDs
axios.get('/api/usuarios', {
  params: { ids: ids.join(',') }
});
// URL pode ultrapassar limite
```

**Solução:** Use POST para "buscas" complexas:
```javascript
// ✅ POST com body suporta dados maiores
axios.post('/api/usuarios/search', {
  ids: [1, 2, 3, ..., 1000]
});
```

### GET e Cache

**GETs são cacheáveis** por padrão (navegadores, proxies, CDNs). Isso pode causar dados desatualizados.

**Problema:**
```javascript
// Primeira requisição
const { data: usuarios1 } = await axios.get('/api/usuarios');
console.log(usuarios1.length); // 10

// Novo usuário criado no servidor...

// Segunda requisição - pode retornar cache!
const { data: usuarios2 } = await axios.get('/api/usuarios');
console.log(usuarios2.length); // Ainda 10 (deveria ser 11)
```

**Soluções:**

**1. Cache-Control headers (servidor):**
```javascript
// Servidor configura headers
Cache-Control: no-cache, no-store, must-revalidate
```

**2. Query param único (cache busting):**
```javascript
axios.get('/api/usuarios', {
  params: { _t: Date.now() } // Força nova requisição
});
```

**3. Headers de cache no Axios:**
```javascript
axios.get('/api/usuarios', {
  headers: { 'Cache-Control': 'no-cache' }
});
```

### Sensibilidade de Dados em URLs

**URLs aparecem em:**
- Logs de servidor
- Histórico de navegador
- Favoritos
- Proxies intermediários

**Problema:** Dados sensíveis em query params são expostos:
```javascript
// ❌ NUNCA faça isso
axios.get('/api/login', {
  params: {
    username: 'joao',
    password: 'senha123' // EXPOSTO na URL!
  }
});
// URL: /api/login?username=joao&password=senha123
```

**Solução:** Use POST com body para dados sensíveis:
```javascript
// ✅ Correto - dados no body, não na URL
axios.post('/api/login', {
  username: 'joao',
  password: 'senha123'
});
```

### Race Conditions em Buscas

**Problema:** Requisições assíncronas podem completar fora de ordem.

**Cenário:** Usuário digita rapidamente "abc" em busca:
1. Requisição para "a" enviada
2. Requisição para "ab" enviada
3. Requisição para "abc" enviada
4. Resposta de "abc" chega (rápida)
5. Resposta de "ab" chega (lenta) ← Sobrescreve "abc"!

```javascript
// ❌ Race condition
function handleSearch(query) {
  axios.get('/api/search', { params: { q: query } })
    .then(response => {
      setResultados(response.data); // Pode ser resultado antigo!
    });
}
```

**Solução 1: Cancelar requisições anteriores:**
```javascript
let cancelToken;

function handleSearch(query) {
  // Cancelar requisição anterior
  if (cancelToken) {
    cancelToken.cancel('Nova busca iniciada');
  }
  
  cancelToken = axios.CancelToken.source();
  
  axios.get('/api/search', {
    params: { q: query },
    cancelToken: cancelToken.token
  })
    .then(response => setResultados(response.data))
    .catch(error => {
      if (!axios.isCancel(error)) {
        console.error(error);
      }
    });
}
```

**Solução 2: Ignorar respostas desatualizadas:**
```javascript
let lastQuery = '';

async function handleSearch(query) {
  lastQuery = query;
  
  const { data } = await axios.get('/api/search', {
    params: { q: query }
  });
  
  // Só atualiza se ainda é a última query
  if (query === lastQuery) {
    setResultados(data);
  }
}
```

---

## 🔗 Interconexões Conceituais

### GET e HTTP Protocol

GET é um dos **métodos fundamentais HTTP**. Entender HTTP profundamente (status codes, headers, caching) é essencial para usar GET efetivamente.

### GET e REST Architecture

REST usa GET para **operações de leitura**. URLs representam recursos, GET recupera representação desses recursos.

### GET e State Management

Em apps React/Vue, dados de GET frequentemente vão para **state management** (Redux, Vuex, React Query):

```javascript
// Redux action creator
export const fetchUsers = () => async dispatch => {
  dispatch({ type: 'FETCH_USERS_REQUEST' });
  
  try {
    const { data } = await axios.get('/api/usuarios');
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'FETCH_USERS_FAILURE', error: error.message });
  }
};
```

### GET e Promises/Async-Await

`axios.get()` retorna Promise. Dominar Promises e async/await é pré-requisito para usar GET efetivamente.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar `axios.get()`:

1. **POST:** Criar recursos, enviar dados no body
2. **PUT/PATCH:** Atualizar recursos
3. **DELETE:** Remover recursos
4. **Interceptors:** Adicionar lógica global (auth, logging)
5. **Error Handling Avançado:** Retry, fallbacks, error boundaries

### Conceitos Avançados

- **Caching Inteligente:** Implementar cache de respostas GET
- **Polling:** Requisições GET repetidas para simular real-time
- **Infinite Scroll:** Carregar mais dados conforme usuário scrolla
- **Optimistic UI:** Atualizar UI antes de GET completar

---

## 📚 Conclusão

`axios.get()` é a **porta de entrada** para comunicação HTTP no Axios e em aplicações web modernas. Sua simplicidade (`axios.get(url)`) esconde poder considerável: parsing automático de JSON, tratamento de erros inteligente, suporte a Promises, e estrutura de response unificada.

**Dominar `axios.get()` significa:**
- Saber acessar `response.data` corretamente
- Usar `params` para query strings
- Tratar erros apropriadamente
- Entender diferença entre erro de rede e HTTP
- Aplicar padrões (service layer, retry, cache busting)

Com `axios.get()`, você pode buscar qualquer dado de qualquer API, transformando aplicações estáticas em experiências dinâmicas e data-driven. É fundação sobre a qual todo o resto do Axios se constrói.
