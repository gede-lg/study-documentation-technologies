# Request Config: url, method, headers, data, params

## 🎯 Introdução e Definição

### Definição Conceitual

O **Request Config** no Axios é um **objeto de configuração** que define todos os aspectos de uma requisição HTTP - desde o básico (URL, método) até detalhes avançados (headers customizados, timeouts, transformações). Conceitualmente, é a **linguagem de configuração** através da qual você comunica ao Axios exatamente **como** e **para onde** fazer uma requisição.

As propriedades fundamentais do Request Config são:
- **url:** Define **onde** a requisição será enviada (endpoint)
- **method:** Define **como** a requisição será feita (GET, POST, PUT, etc.)
- **headers:** Define **metadados** da requisição (autenticação, content-type, etc.)
- **data:** Define **o que** enviar no corpo da requisição (POST/PUT/PATCH)
- **params:** Define **filtros/parâmetros** na query string da URL

Essas cinco propriedades formam a **base fundamental** de praticamente todas as requisições HTTP, permitindo expressar desde requisições simples até operações complexas com múltiplas camadas de configuração.

### Contexto Histórico e Motivação

Antes do Axios, configurar requisições HTTP em JavaScript era **fragmentado e verboso**:

**XMLHttpRequest (tradicional):**
```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/usuarios', true); // método + URL separados
xhr.setRequestHeader('Authorization', 'Bearer token'); // headers um por um
xhr.setRequestHeader('Accept', 'application/json');

xhr.onload = function() {
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    console.log(data);
  }
};

xhr.send();
```

**Problemas:**
- Configuração espalhada por múltiplas linhas
- Headers adicionados um por um
- URL e método em chamadas separadas
- Difícil visualizar requisição completa

**Fetch API (moderno mas limitado):**
```javascript
fetch('/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({
    nome: 'João',
    email: 'joao@example.com'
  })
});
```

**Melhor, mas ainda:**
- Precisa stringify manual de JSON
- Query params requerem construção manual de URL
- Sem suporte nativo a timeout, cancelamento
- Config menos estruturado

**Axios revolucionou com Request Config unificado:**

```javascript
axios({
  url: '/api/usuarios',
  method: 'post',
  headers: {
    'Authorization': 'Bearer token'
  },
  data: {
    nome: 'João',
    email: 'joao@example.com'
  },
  params: {
    notify: true
  },
  timeout: 5000
});
```

**Vantagens:**
- **Objeto único** contém toda configuração
- **JSON automático** - sem stringify manual
- **Query params** automaticamente codificados
- **Extensível** - adicione qualquer opção
- **Reutilizável** - config pode ser armazenado, mergeado, passado entre funções

### Problema Fundamental que Resolve

**Request Config resolve fragmentação e complexidade:**

**1. Centralização:** Toda configuração em um único objeto - fácil visualizar requisição completa de relance.

**2. Serialização Automática:**
- `data` (objeto) → JSON automaticamente
- `params` (objeto) → query string automaticamente
- `headers` (objeto) → headers HTTP automaticamente

**3. Composição e Reutilização:**
```javascript
const baseConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'Authorization': 'Bearer token' }
};

// Reutilizar e estender
const getUserConfig = {
  ...baseConfig,
  method: 'get',
  url: '/usuarios'
};

const createUserConfig = {
  ...baseConfig,
  method: 'post',
  url: '/usuarios',
  data: { nome: 'João' }
};
```

**4. Separação de Responsabilidades:**
- `url` + `method` → O QUE fazer
- `headers` → COMO autenticar/negociar
- `data` → O QUE enviar
- `params` → COMO filtrar/paginar

**5. Type Safety (TypeScript):** Config object tipável - autocomplete e validação em tempo de desenvolvimento.

### Importância no Ecossistema

Request Config é **coração do Axios** - toda requisição, seja via shorthand ou `axios(config)`, é internamente convertida para config object.

**Uso universal:**
- **Aplicações Web:** Configurar requisições para APIs RESTful
- **Node.js Services:** Comunicação entre microservices
- **Mobile Apps (React Native):** Requisições com configurações específicas
- **Bibliotecas:** Wrappers customizados sobre Axios
- **Ferramentas CLI:** Scripts que consomem APIs

**Entender Request Config profundamente permite:**
- Controlar totalmente comportamento de requisições
- Criar abstrações poderosas (API clients, wrappers)
- Debugar problemas de comunicação
- Otimizar performance (timeouts, transforms)
- Implementar features avançadas (retry, cache, offline)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Config como Contrato:** Define exatamente o que Axios deve fazer
2. **Propriedades Fundamentais:** url, method, headers, data, params
3. **Serialização Automática:** Objetos JavaScript → formatos HTTP
4. **Merge Hierárquico:** Config local > defaults > global defaults
5. **Extensibilidade:** Config aceita dezenas de opções para casos avançados

### Pilares Fundamentais

- **url:** Endpoint destino (absoluto ou relativo)
- **method:** Verbo HTTP (get, post, put, patch, delete, etc.)
- **headers:** Metadados da requisição (objeto chave-valor)
- **data:** Corpo da requisição (objeto, string, FormData, etc.)
- **params:** Query string parameters (objeto chave-valor)

### Visão Geral das Nuances

- **url absoluta vs relativa:** Relativa usa `baseURL`, absoluta ignora
- **method case-insensitive:** 'GET', 'get', 'Get' são equivalentes
- **headers case-insensitive:** 'Content-Type' e 'content-type' são iguais
- **data vs params:** `data` no body, `params` na URL
- **Transformações automáticas:** JSON, URLSearchParams, FormData

---

## 🧠 Fundamentos Teóricos

### Propriedade: url

#### Definição

**url** especifica o **endpoint** para onde a requisição será enviada.

**Sintaxe:**
```javascript
{
  url: '/api/usuarios' // URL relativa
}

{
  url: 'https://api.example.com/usuarios' // URL absoluta
}
```

#### URL Relativa vs Absoluta

**URL Relativa:**
```javascript
axios({
  url: '/api/usuarios'
});
// Se baseURL configurada: https://api.example.com
// URL final: https://api.example.com/api/usuarios
```

**URL Absoluta:**
```javascript
axios({
  url: 'https://outra-api.com/dados'
});
// URL final: https://outra-api.com/dados
// baseURL é IGNORADA para URLs absolutas
```

**Como Axios determina se é absoluta:**
- Começa com `http://` ou `https://` → Absoluta
- Começa com `/` ou letra → Relativa (usa baseURL se configurada)

#### Concatenação com baseURL

**baseURL + url:**
```javascript
axios.defaults.baseURL = 'https://api.example.com';

axios({ url: '/usuarios' });
// Final: https://api.example.com/usuarios

axios({ url: '/posts' });
// Final: https://api.example.com/posts

axios({ url: 'https://outra.com/data' });
// Final: https://outra.com/data (baseURL ignorada)
```

**Regras de concatenação:**

| baseURL | url | Resultado |
|---------|-----|-----------|
| `https://api.com` | `/usuarios` | `https://api.com/usuarios` |
| `https://api.com/v1` | `/usuarios` | `https://api.com/v1/usuarios` |
| `https://api.com` | `usuarios` | `https://api.com/usuarios` |
| `https://api.com/` | `/usuarios` | `https://api.com/usuarios` |
| `https://api.com` | `https://outra.com/x` | `https://outra.com/x` |

**Lição:** baseURL + url são mergeados, mas URL absoluta tem precedência.

#### URL com Template Strings

**Padrão comum - IDs dinâmicos:**
```javascript
const userId = 123;

axios({
  url: `/api/usuarios/${userId}`
});
// Final: /api/usuarios/123

const postId = 456;
const commentId = 789;

axios({
  url: `/api/posts/${postId}/comments/${commentId}`
});
// Final: /api/posts/456/comments/789
```

#### URL Encoding

**Axios NÃO faz encoding da URL automaticamente** (apenas de params):

```javascript
// ❌ URL com caracteres especiais - pode causar problemas
axios({
  url: '/api/usuarios/João Silva'
});

// ✅ Faça encoding manual
axios({
  url: `/api/usuarios/${encodeURIComponent('João Silva')}`
});
// Final: /api/usuarios/Jo%C3%A3o%20Silva
```

**Use params para valores dinâmicos com caracteres especiais:**
```javascript
// ✅ Melhor - params são codificados automaticamente
axios({
  url: '/api/usuarios',
  params: { nome: 'João Silva' }
});
// Final: /api/usuarios?nome=Jo%C3%A3o%20Silva
```

---

### Propriedade: method

#### Definição

**method** especifica o **verbo HTTP** da requisição.

**Sintaxe:**
```javascript
{
  method: 'get' // ou 'post', 'put', 'patch', 'delete', etc.
}
```

#### Valores Válidos

**Métodos HTTP suportados:**

| Método | Uso | Idempotente | Com Body |
|--------|-----|-------------|----------|
| **GET** | Buscar dados | ✅ | ❌ |
| **POST** | Criar recurso | ❌ | ✅ |
| **PUT** | Substituir recurso | ✅ | ✅ |
| **PATCH** | Modificar recurso | ⚠️ | ✅ |
| **DELETE** | Deletar recurso | ✅ | ❌ (geralmente) |
| **HEAD** | Headers apenas (sem body) | ✅ | ❌ |
| **OPTIONS** | Capacidades do servidor | ✅ | ❌ |

**Exemplos:**
```javascript
// GET - buscar
axios({ method: 'get', url: '/api/usuarios' });

// POST - criar
axios({ method: 'post', url: '/api/usuarios', data: { nome: 'João' } });

// PUT - atualizar completo
axios({ method: 'put', url: '/api/usuarios/123', data: userDataCompleto });

// PATCH - atualizar parcial
axios({ method: 'patch', url: '/api/usuarios/123', data: { email: 'novo@example.com' } });

// DELETE - deletar
axios({ method: 'delete', url: '/api/usuarios/123' });

// HEAD - verificar existência sem baixar body
axios({ method: 'head', url: '/api/usuarios/123' });

// OPTIONS - verificar métodos suportados
axios({ method: 'options', url: '/api/usuarios' });
```

#### Case Insensitivity

**method é case-insensitive:**
```javascript
axios({ method: 'GET' });
axios({ method: 'get' });
axios({ method: 'Get' });
// Todos equivalentes
```

**Convenção:** Lowercase é mais comum (`'get'`, `'post'`, etc.).

#### Valor Padrão

**Se method omitido, padrão é GET:**
```javascript
axios({ url: '/api/usuarios' });
// Equivalente a:
axios({ url: '/api/usuarios', method: 'get' });
```

#### Method Dinâmico

**method pode ser variável:**
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

---

### Propriedade: headers

#### Definição

**headers** especifica **metadados HTTP** enviados com a requisição.

**Sintaxe:**
```javascript
{
  headers: {
    'Header-Name': 'valor',
    'Another-Header': 'outro valor'
  }
}
```

#### Headers Comuns

**1. Authorization (Autenticação):**
```javascript
{
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
}

// Basic Auth
{
  headers: {
    'Authorization': 'Basic ' + btoa('usuario:senha')
  }
}
```

**2. Content-Type (Tipo de dados enviados):**
```javascript
// JSON (padrão automático do Axios para objetos)
{
  headers: {
    'Content-Type': 'application/json'
  }
}

// Form data
{
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

// Multipart (upload)
{
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

// XML
{
  headers: {
    'Content-Type': 'application/xml'
  }
}

// Texto plano
{
  headers: {
    'Content-Type': 'text/plain'
  }
}
```

**3. Accept (Tipo de resposta desejada):**
```javascript
{
  headers: {
    'Accept': 'application/json'
  }
}

// Aceitar múltiplos tipos (com preferência)
{
  headers: {
    'Accept': 'application/json, text/plain, */*'
  }
}
```

**4. Accept-Language (Idioma preferido):**
```javascript
{
  headers: {
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
  }
}
```

**5. User-Agent (Identificação do cliente):**
```javascript
{
  headers: {
    'User-Agent': 'MeuApp/1.0.0 (Windows NT 10.0)'
  }
}
```

**6. Custom Headers (Headers customizados):**
```javascript
{
  headers: {
    'X-Request-ID': crypto.randomUUID(),
    'X-Client-Version': '1.2.3',
    'X-API-Key': 'chave-api-secreta',
    'X-Correlation-ID': 'trace-12345'
  }
}
```

#### Case Insensitivity

**Headers são case-insensitive** (HTTP spec):
```javascript
{
  headers: {
    'Content-Type': 'application/json',
    'content-type': 'application/json',
    'CONTENT-TYPE': 'application/json'
  }
}
// Todos equivalentes (último sobrescreve)
```

**Convenção:** Capitalize cada palavra (`Content-Type`, `Authorization`), mas lowercase também é comum.

#### Headers Automáticos do Axios

**Axios adiciona headers automaticamente em alguns casos:**

**1. Content-Type para objetos:**
```javascript
axios({
  method: 'post',
  url: '/api/usuarios',
  data: { nome: 'João' }
});
// Axios adiciona automaticamente: Content-Type: application/json
```

**2. Content-Type para FormData:**
```javascript
const formData = new FormData();
formData.append('nome', 'João');

axios({
  method: 'post',
  url: '/api/usuarios',
  data: formData
});
// Axios adiciona: Content-Type: multipart/form-data; boundary=...
```

**3. Accept:**
```javascript
// Se não especificado, Axios pode adicionar Accept padrão
```

#### Override de Headers

**Headers em config sobrescrevem defaults:**
```javascript
axios.defaults.headers.common['Authorization'] = 'Bearer token1';

// Este request usa token2 (override)
axios({
  url: '/api/usuarios',
  headers: {
    'Authorization': 'Bearer token2'
  }
});
```

#### Headers Condicionais

**Adicionar headers apenas se condição verdadeira:**
```javascript
const config = {
  url: '/api/usuarios',
  method: 'get'
};

const token = localStorage.getItem('token');
if (token) {
  config.headers = { 'Authorization': `Bearer ${token}` };
}

axios(config);
```

**Ou com spread:**
```javascript
axios({
  url: '/api/usuarios',
  headers: {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    'Accept': 'application/json'
  }
});
```

#### Headers por Método

**Headers específicos para cada tipo de método:**

```javascript
// GET - geralmente só auth e accept
axios({
  method: 'get',
  url: '/api/usuarios',
  headers: {
    'Authorization': 'Bearer token',
    'Accept': 'application/json'
  }
});

// POST - auth, content-type, accept
axios({
  method: 'post',
  url: '/api/usuarios',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  data: { nome: 'João' }
});

// DELETE - geralmente só auth
axios({
  method: 'delete',
  url: '/api/usuarios/123',
  headers: {
    'Authorization': 'Bearer token'
  }
});
```

---

### Propriedade: data

#### Definição

**data** especifica o **corpo (body)** da requisição - dados enviados ao servidor.

**Sintaxe:**
```javascript
{
  data: { /* dados */ }
}
```

**Aplicável a:** POST, PUT, PATCH (métodos que enviam body).

**Não aplicável a:** GET, DELETE, HEAD, OPTIONS (geralmente sem body).

#### Tipos de Data

**1. Objeto JavaScript (JSON):**
```javascript
axios({
  method: 'post',
  url: '/api/usuarios',
  data: {
    nome: 'João Silva',
    email: 'joao@example.com',
    idade: 30,
    ativo: true
  }
});
// Axios automaticamente:
// 1. JSON.stringify(data)
// 2. Adiciona Content-Type: application/json
```

**2. String:**
```javascript
axios({
  method: 'post',
  url: '/api/data',
  data: 'texto plano aqui',
  headers: {
    'Content-Type': 'text/plain'
  }
});
```

**3. FormData (upload de arquivos):**
```javascript
const formData = new FormData();
formData.append('nome', 'João');
formData.append('avatar', fileInput.files[0]);

axios({
  method: 'post',
  url: '/api/usuarios',
  data: formData
});
// Axios detecta FormData e configura Content-Type: multipart/form-data
```

**4. URLSearchParams (form-urlencoded):**
```javascript
const params = new URLSearchParams();
params.append('nome', 'João');
params.append('email', 'joao@example.com');

axios({
  method: 'post',
  url: '/api/usuarios',
  data: params
});
// Axios configura Content-Type: application/x-www-form-urlencoded
```

**5. ArrayBuffer, Blob, Stream (Node.js):**
```javascript
// Blob (navegador)
const blob = new Blob(['conteúdo'], { type: 'text/plain' });
axios({
  method: 'post',
  url: '/api/upload',
  data: blob
});

// Stream (Node.js)
const fs = require('fs');
axios({
  method: 'post',
  url: '/api/upload',
  data: fs.createReadStream('arquivo.txt')
});
```

#### Serialização Automática

**Axios serializa data baseado no tipo:**

```javascript
// Objeto → JSON (stringify automático)
data: { nome: 'João' }
// Enviado: {"nome":"João"}
// Header: Content-Type: application/json

// FormData → multipart
data: formDataObject
// Enviado: formato multipart com boundaries
// Header: Content-Type: multipart/form-data; boundary=...

// URLSearchParams → form-urlencoded
data: urlSearchParamsObject
// Enviado: nome=Jo%C3%A3o&email=joao%40example.com
// Header: Content-Type: application/x-www-form-urlencoded

// String → enviada como está
data: 'texto'
// Enviado: texto
// Header: Precisa definir manualmente
```

#### data vs params

**Diferença crucial:**

| Aspecto | data | params |
|---------|------|--------|
| **Localização** | Request body | Query string (URL) |
| **Métodos** | POST, PUT, PATCH | Qualquer (especialmente GET) |
| **Visibilidade** | Não aparece em logs | Aparece em URL/logs |
| **Tamanho** | Sem limite prático | Limitado (~2000 chars) |
| **Uso** | Criar/atualizar recursos | Filtrar/paginar/buscar |

**Exemplo comparativo:**
```javascript
// GET com params (filtros na URL)
axios({
  method: 'get',
  url: '/api/usuarios',
  params: { role: 'admin', page: 2 }
});
// URL: /api/usuarios?role=admin&page=2

// POST com data (dados no body)
axios({
  method: 'post',
  url: '/api/usuarios',
  data: { nome: 'João', email: 'joao@example.com' }
});
// URL: /api/usuarios
// Body: {"nome":"João","email":"joao@example.com"}

// POST com AMBOS (params E data)
axios({
  method: 'post',
  url: '/api/usuarios',
  params: { notify: true }, // Query string
  data: { nome: 'João' }     // Body
});
// URL: /api/usuarios?notify=true
// Body: {"nome":"João"}
```

#### data Vazio ou Null

**Omitir data:**
```javascript
// POST sem body (válido mas incomum)
axios({
  method: 'post',
  url: '/api/action'
});
// Body vazio
```

**data = null:**
```javascript
axios({
  method: 'post',
  url: '/api/action',
  data: null
});
// Body vazio
```

**Quando usar:** Ações que não requerem dados (triggers, webhooks).

---

### Propriedade: params

#### Definição

**params** especifica **query string parameters** - dados anexados à URL após `?`.

**Sintaxe:**
```javascript
{
  params: {
    chave1: 'valor1',
    chave2: 'valor2'
  }
}
```

**Resultado:** URL com query string automaticamente construída e codificada.

#### Uso Básico

```javascript
axios({
  url: '/api/usuarios',
  params: {
    page: 2,
    limit: 20,
    sort: 'nome'
  }
});
// URL final: /api/usuarios?page=2&limit=20&sort=nome
```

#### Encoding Automático

**Axios codifica params automaticamente:**

```javascript
axios({
  url: '/api/usuarios',
  params: {
    nome: 'João Silva',        // Espaço
    email: 'joao@example.com', // @
    cidade: 'São Paulo'        // Acentos
  }
});
// URL: /api/usuarios?nome=Jo%C3%A3o%20Silva&email=joao%40example.com&cidade=S%C3%A3o%20Paulo
```

**Sem Axios (manual - propenso a erros):**
```javascript
const url = '/api/usuarios?nome=' + encodeURIComponent('João Silva') + 
            '&email=' + encodeURIComponent('joao@example.com');
```

#### Arrays em params

**Axios serializa arrays:**

```javascript
axios({
  url: '/api/produtos',
  params: {
    categorias: ['eletrônicos', 'livros', 'roupas']
  }
});
// URL padrão: /api/produtos?categorias[]=eletr%C3%B4nicos&categorias[]=livros&categorias[]=roupas
```

**Customizar serialização de arrays:**
```javascript
import qs from 'qs';

axios({
  url: '/api/produtos',
  params: {
    categorias: ['eletrônicos', 'livros']
  },
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  }
});
// URL: /api/produtos?categorias=eletr%C3%B4nicos&categorias=livros

// Outras opções arrayFormat:
// 'indices': categorias[0]=x&categorias[1]=y
// 'brackets': categorias[]=x&categorias[]=y
// 'repeat': categorias=x&categorias=y
// 'comma': categorias=x,y
```

#### Objetos em params

**Objetos são serializados como nested params:**

```javascript
axios({
  url: '/api/usuarios',
  params: {
    filtro: {
      idade: { min: 18, max: 65 },
      cidade: 'São Paulo'
    }
  }
});
// URL: /api/usuarios?filtro[idade][min]=18&filtro[idade][max]=65&filtro[cidade]=S%C3%A3o%20Paulo
```

**Controle de serialização:**
```javascript
import qs from 'qs';

axios({
  url: '/api/usuarios',
  params: {
    filtro: { idade: { min: 18 } }
  },
  paramsSerializer: params => qs.stringify(params)
});
```

#### Null e Undefined

**Valores null/undefined são omitidos:**

```javascript
axios({
  url: '/api/usuarios',
  params: {
    nome: 'João',
    idade: null,      // Omitido
    cidade: undefined // Omitido
  }
});
// URL: /api/usuarios?nome=Jo%C3%A3o
```

#### params vs Query String Manual

**Evite construir query string manualmente:**

```javascript
// ❌ Manual - propenso a erros
axios({
  url: '/api/usuarios?page=2&limit=20'
});

// ✅ Com params - seguro e legível
axios({
  url: '/api/usuarios',
  params: { page: 2, limit: 20 }
});
```

**Exceção:** URLs completamente estáticas e simples.

#### Uso Comum: Filtros e Paginação

```javascript
// Busca com filtros
axios({
  method: 'get',
  url: '/api/usuarios',
  params: {
    role: 'admin',
    ativo: true,
    cadastradoDepois: '2024-01-01'
  }
});

// Paginação
axios({
  method: 'get',
  url: '/api/produtos',
  params: {
    page: 3,
    limit: 50,
    sort: 'preco',
    order: 'desc'
  }
});

// Busca textual
axios({
  method: 'get',
  url: '/api/search',
  params: {
    q: 'termo de busca',
    tipo: 'usuarios',
    maxResults: 10
  }
});
```

---

## 🔍 Análise Conceitual Profunda

### Hierarquia de Configuração

**Axios mergea configs de múltiplas fontes:**

```
Prioridade (maior → menor):
1. Request config (passado na chamada)
2. Instance defaults (axios.create())
3. Global defaults (axios.defaults)
```

**Exemplo:**
```javascript
// 1. Global defaults
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Authorization'] = 'Bearer token1';

// 2. Instance defaults
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000 // Sobrescreve global
});

// 3. Request config (maior prioridade)
api({
  url: '/usuarios',
  timeout: 15000, // Sobrescreve instance
  headers: {
    'Authorization': 'Bearer token2' // Sobrescreve global
  }
});

// Config final efetivo:
// {
//   url: '/usuarios',
//   baseURL: 'https://api.example.com',
//   timeout: 15000,
//   headers: { Authorization: 'Bearer token2' }
// }
```

### Config Object Completo

**Todas as propriedades disponíveis:**

```javascript
{
  // URL da requisição (obrigatória)
  url: '/api/usuarios',
  
  // Método HTTP (padrão: 'get')
  method: 'get',
  
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
  
  // Serializer customizado de params
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  },
  
  // Request body (POST, PUT, PATCH)
  data: {
    nome: 'João',
    email: 'joao@example.com'
  },
  
  // Timeout em milissegundos (padrão: sem timeout)
  timeout: 5000,
  
  // Credenciais cross-site (cookies)
  withCredentials: false,
  
  // Adapter customizado (raramente usado)
  adapter: customAdapter,
  
  // Auth básico
  auth: {
    username: 'usuario',
    password: 'senha'
  },
  
  // Tipo de resposta esperada
  responseType: 'json', // 'json', 'text', 'blob', 'arraybuffer', 'document', 'stream'
  
  // Encoding de resposta (Node.js)
  responseEncoding: 'utf8',
  
  // Nome do cookie XSRF
  xsrfCookieName: 'XSRF-TOKEN',
  
  // Nome do header XSRF
  xsrfHeaderName: 'X-XSRF-TOKEN',
  
  // Função de progresso de upload
  onUploadProgress: function(progressEvent) {
    console.log('Upload:', progressEvent.loaded, '/', progressEvent.total);
  },
  
  // Função de progresso de download
  onDownloadProgress: function(progressEvent) {
    console.log('Download:', progressEvent.loaded, '/', progressEvent.total);
  },
  
  // Tamanho máximo de conteúdo em bytes
  maxContentLength: 2000,
  
  // Tamanho máximo de body em bytes (Node.js)
  maxBodyLength: 2000,
  
  // Validação customizada de status
  validateStatus: function(status) {
    return status >= 200 && status < 300;
  },
  
  // Redirecionamentos máximos (Node.js)
  maxRedirects: 5,
  
  // Socket path (Node.js)
  socketPath: null,
  
  // Agente HTTP/HTTPS customizado (Node.js)
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  
  // Proxy (Node.js)
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'proxyuser',
      password: 'proxypass'
    }
  },
  
  // Token de cancelamento
  cancelToken: new axios.CancelToken(function(cancel) {
    // ...
  }),
  
  // AbortSignal (alternativa moderna)
  signal: new AbortController().signal,
  
  // Decomprimir response automaticamente
  decompress: true,
  
  // Transformação de request
  transformRequest: [function(data, headers) {
    return data;
  }],
  
  // Transformação de response
  transformResponse: [function(data) {
    return data;
  }]
}
```

### Padrões de Composição

#### Pattern 1: Base Config Reutilizável

```javascript
const baseConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  }
};

// Estender para diferentes requests
const getUsersConfig = {
  ...baseConfig,
  url: '/usuarios',
  params: { page: 1 }
};

const createUserConfig = {
  ...baseConfig,
  method: 'post',
  url: '/usuarios',
  data: { nome: 'João' }
};

axios(getUsersConfig);
axios(createUserConfig);
```

#### Pattern 2: Config Builder Function

```javascript
function buildApiConfig(endpoint, options = {}) {
  return {
    baseURL: 'https://api.example.com',
    url: endpoint,
    timeout: options.timeout || 5000,
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      ...(options.headers || {})
    },
    ...options
  };
}

// Uso
axios(buildApiConfig('/usuarios', { method: 'get', params: { page: 2 } }));
axios(buildApiConfig('/usuarios', { method: 'post', data: userData }));
```

#### Pattern 3: Conditional Config

```javascript
function getConfig(authenticated = false) {
  const config = {
    baseURL: 'https://api.example.com',
    timeout: 5000
  };
  
  if (authenticated) {
    config.headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
  }
  
  if (process.env.NODE_ENV === 'development') {
    config.timeout = 30000; // Maior timeout em dev
  }
  
  return config;
}

axios({ ...getConfig(true), url: '/profile' });
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Propriedade

**url:**
- Sempre obrigatória (direta ou via baseURL)
- Use relativa para APIs consistentes
- Use absoluta para múltiplas APIs

**method:**
- Sempre especifique (exceto GET, que é padrão)
- Use lowercase por convenção

**headers:**
- Autenticação (Authorization)
- Content negotiation (Accept, Content-Type)
- Custom metadata (X-Request-ID, etc.)

**data:**
- POST/PUT/PATCH - dados a enviar
- Objetos, FormData, strings, etc.

**params:**
- GET - filtros, paginação, busca
- Qualquer método - query parameters

### Cenários Comuns

**API REST completa:**
```javascript
const apiConfig = {
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
};

// List
axios({ ...apiConfig, url: '/usuarios', params: { page: 1 } });

// Get
axios({ ...apiConfig, url: '/usuarios/123' });

// Create
axios({ ...apiConfig, method: 'post', url: '/usuarios', data: newUser });

// Update
axios({ ...apiConfig, method: 'put', url: '/usuarios/123', data: updatedUser });

// Delete
axios({ ...apiConfig, method: 'delete', url: '/usuarios/123' });
```

---

## ⚠️ Limitações e Considerações Teóricas

### URL Encoding

**Axios NÃO codifica URL, apenas params:**
```javascript
// ❌ Caracteres especiais na URL não são codificados
axios({ url: '/api/usuarios/João Silva' }); // Pode falhar

// ✅ Use encodeURIComponent ou params
axios({ url: `/api/usuarios/${encodeURIComponent('João Silva')}` });
axios({ url: '/api/usuarios', params: { nome: 'João Silva' } });
```

### Tamanho de URL com params

**Query strings têm limite (~2000 chars):**
```javascript
// ❌ Muitos params podem exceder limite
axios({ url: '/api/data', params: { ids: arrayDe1000IDs } });

// ✅ Use POST com data
axios({ method: 'post', url: '/api/data/search', data: { ids: arrayDe1000IDs } });
```

### Headers Case Sensitivity

**HTTP headers são case-insensitive, mas:**
```javascript
// Ambos funcionam, mas podem sobrescrever
{
  headers: {
    'Content-Type': 'application/json',
    'content-type': 'text/plain' // ← Sobrescreve anterior
  }
}
```

**Solução:** Seja consistente com capitalização.

### data vs params Confusion

**Erro comum - usar params em POST para enviar dados:**
```javascript
// ❌ ERRADO - dados vão na URL, não no body
axios({
  method: 'post',
  url: '/api/usuarios',
  params: { nome: 'João', email: 'joao@example.com' }
});
// URL: /api/usuarios?nome=Jo%C3%A3o&email=joao%40example.com
// Body: vazio

// ✅ CORRETO - dados no body
axios({
  method: 'post',
  url: '/api/usuarios',
  data: { nome: 'João', email: 'joao@example.com' }
});
```

---

## 🔗 Interconexões Conceituais

### Config e Instances

**Instances herdam e estendem config:**
```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' }
});

// Usa baseURL e headers da instance
api({ url: '/usuarios' });
```

### Config e Interceptors

**Interceptors podem modificar config:**
```javascript
axios.interceptors.request.use(config => {
  config.headers['X-Request-Time'] = Date.now();
  return config;
});
```

### Config e Defaults

**Defaults provêm valores padrão:**
```javascript
axios.defaults.timeout = 5000;

// Usa timeout padrão
axios({ url: '/usuarios' });
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **axios.defaults:** Configurar comportamento global
2. **axios.create():** Criar instances com config específica
3. **Interceptors:** Modificar requests/responses automaticamente
4. **Transforms:** Customizar serialização/deserialização

### Conceitos Avançados

- **Config composition patterns**
- **Dynamic config generation**
- **Config validation**
- **TypeScript generics para config**

---

## 📚 Conclusão

**Request Config** é a **linguagem universal** do Axios - cinco propriedades fundamentais (`url`, `method`, `headers`, `data`, `params`) permitem expressar qualquer requisição HTTP.

**Dominar Request Config significa:**
- Saber quando usar `data` vs `params`
- Entender headers comuns e seu propósito
- Compor configs reutilizáveis
- Evitar armadilhas (URL encoding, case sensitivity)
- Criar abstrações poderosas

Com esse conhecimento, você pode configurar requisições desde as mais simples até as mais complexas, controlando totalmente como sua aplicação se comunica com APIs.
