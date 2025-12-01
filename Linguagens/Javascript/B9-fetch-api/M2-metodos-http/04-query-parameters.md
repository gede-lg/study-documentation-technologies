# Query Parameters com URLSearchParams: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Query parameters** (parâmetros de consulta) são pares **chave-valor** anexados à URL após o símbolo `?`, usados para **filtrar, ordenar, paginar** ou configurar requisições HTTP. Conceitualmente, representam **inputs opcionais** que modificam comportamento de endpoints GET (e ocasionalmente POST) sem alterar a identidade do recurso base.

**URLSearchParams** é uma **API JavaScript nativa** (Web API) que fornece interface moderna e conveniente para **construir, manipular e serializar** query strings. Substitui manipulação manual de strings (`url + '?' + param1 + '&' + param2`) com métodos intuitivos (`.append()`, `.set()`, `.toString()`).

```javascript
// Manipulação manual (antiga, propensa a erros)
const url = 'https://api.exemplo.com/produtos?categoria=livros&preco_max=50&ordenar=preco_asc';

// URLSearchParams (moderna, segura)
const params = new URLSearchParams({
  categoria: 'livros',
  preco_max: 50,
  ordenar: 'preco_asc'
});

const url = `https://api.exemplo.com/produtos?${params.toString()}`;
// https://api.exemplo.com/produtos?categoria=livros&preco_max=50&ordenar=preco_asc
```

### Contexto Histórico e Motivação

**Evolução de Query Strings:**

1. **Web 1.0 (1990s)**: Query strings manuais em HTML forms
2. **AJAX Era (2005+)**: Construção manual de URLs com concatenação
3. **URLSearchParams (2016)**: API padronizada para manipulação

**Motivação para URLSearchParams:**

Antes de URLSearchParams, construir URLs com parâmetros era **error-prone**:

```javascript
// ❌ Problemas com concatenação manual
let url = 'https://api.exemplo.com/busca?q=' + query;
// Esqueceu encode: quebra com espaços, caracteres especiais

let url = 'https://api.exemplo.com/busca?q=' + encodeURIComponent(query);
// Verboso, repetitivo

// Se adicionar múltiplos params
let url = 'https://api.exemplo.com/busca?q=' + encodeURIComponent(query) + '&categoria=' + categoria + '&limite=' + limite;
// Difícil ler, manter

// ✅ URLSearchParams resolve
const params = new URLSearchParams({ q: query, categoria, limite });
const url = `https://api.exemplo.com/busca?${params}`;
// Automático encode, legível, manutenível
```

### Problema Fundamental que Resolve

URLSearchParams resolve problemas específicos de manipulação de query strings:

**1. URL Encoding Automático**: Escapa caracteres especiais (espaços, &, =, ?, #) automaticamente
**2. Type Coercion**: Converte números/booleans para strings corretamente
**3. Múltiplos Valores**: Suporta mesma chave com múltiplos valores (`tags=js&tags=react`)
**4. Parsing**: Extrai parâmetros de URL existente facilmente
**5. Iteração**: Permite iterar sobre parâmetros com `for...of`

### Importância no Ecossistema

Query parameters são **ubíquos em APIs REST**:

- **Filtros**: `GET /produtos?categoria=eletronicos&marca=Samsung`
- **Busca**: `GET /usuarios?q=João&cidade=São Paulo`
- **Paginação**: `GET /posts?pagina=2&limite=20`
- **Ordenação**: `GET /produtos?ordenar=preco_desc`
- **Seleção de Campos**: `GET /usuarios?campos=id,nome,email`

URLSearchParams é **standard moderno** suportado em todos browsers modernos e Node.js.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Query String Anatomy**: `?chave1=valor1&chave2=valor2&chave3=valor3`
2. **URL Encoding**: Espaços → `%20` ou `+`, caracteres especiais escapados
3. **Type Coercion**: Tudo é string na URL (`numero=42` → `"42"`)
4. **Múltiplos Valores**: Mesma chave repetida (`tags=a&tags=b&tags=c`)
5. **Immutability**: URL base + query params separados logicamente

### Pilares Fundamentais

- **new URLSearchParams()**: Construtor (aceita objeto, string, array de pares)
- **.append()**: Adiciona parâmetro (permite duplicatas)
- **.set()**: Define parâmetro (substitui se existir)
- **.get()**: Obtém valor de parâmetro
- **.toString()**: Serializa para query string

### Visão Geral das Nuances

- URLSearchParams não inclui `?` - você adiciona manualmente
- `.append()` permite múltiplos valores, `.set()` substitui
- Ordem de parâmetros é preservada
- `null` e `undefined` viram strings `"null"`, `"undefined"`
- Compatível com `new URL()` para manipulação completa de URLs

---

## 🧠 Fundamentos Teóricos

### Anatomia de Query String

```
https://api.exemplo.com/produtos?categoria=livros&preco_max=50&ordenar=preco_asc
│                              │└──────────────────────────────────────────────┘
│                              │                Query String
│                              └─ Separador ?
└─ URL Base
```

**Estrutura**:
- **?**: Separa URL base de query string
- **&**: Separa pares chave-valor
- **=**: Separa chave de valor
- **URL Encoding**: Espaços, caracteres especiais escapados

### Criando URLSearchParams

#### 1. Com Objeto

```javascript
const params = new URLSearchParams({
  categoria: 'livros',
  preco_max: 50,
  ordenar: 'preco_asc'
});

console.log(params.toString());
// categoria=livros&preco_max=50&ordenar=preco_asc
```

**Conceito**: Mais comum e legível.

#### 2. Com String

```javascript
// Parse query string existente
const params = new URLSearchParams('categoria=livros&preco_max=50');

console.log(params.get('categoria')); // "livros"
console.log(params.get('preco_max')); // "50" (string!)
```

**Conceito**: Útil para extrair parâmetros de URLs existentes.

#### 3. Com Array de Pares

```javascript
const params = new URLSearchParams([
  ['categoria', 'livros'],
  ['preco_max', 50],
  ['tags', 'programacao'],
  ['tags', 'javascript'] // Múltiplos valores para mesma chave
]);

console.log(params.toString());
// categoria=livros&preco_max=50&tags=programacao&tags=javascript
```

**Conceito**: Útil quando mesma chave tem múltiplos valores.

#### 4. Vazio (Construir Incrementalmente)

```javascript
const params = new URLSearchParams();

params.append('categoria', 'livros');
params.append('preco_max', 50);

console.log(params.toString());
// categoria=livros&preco_max=50
```

### Métodos Principais

#### append() - Adicionar Parâmetro

```javascript
const params = new URLSearchParams();

params.append('tag', 'javascript');
params.append('tag', 'react'); // Permite duplicata
params.append('tag', 'nodejs');

console.log(params.toString());
// tag=javascript&tag=react&tag=nodejs

console.log(params.getAll('tag'));
// ["javascript", "react", "nodejs"]
```

**Conceito**: Adiciona sem remover valores existentes (útil para arrays).

#### set() - Definir/Substituir Parâmetro

```javascript
const params = new URLSearchParams();

params.set('categoria', 'livros');
params.set('categoria', 'eletronicos'); // Substitui anterior

console.log(params.toString());
// categoria=eletronicos (apenas último valor)
```

**Conceito**: Substitui valor se chave existe, adiciona se não.

#### get() - Obter Valor

```javascript
const params = new URLSearchParams('nome=João&idade=30');

console.log(params.get('nome'));   // "João"
console.log(params.get('idade'));  // "30" (string!)
console.log(params.get('email'));  // null (não existe)
```

**Conceito**: Retorna **primeiro valor** se chave tem múltiplos, `null` se não existe.

#### getAll() - Obter Todos os Valores

```javascript
const params = new URLSearchParams('tag=js&tag=react&tag=node');

console.log(params.get('tag'));    // "js" (apenas primeiro)
console.log(params.getAll('tag')); // ["js", "react", "node"] (todos)
```

**Conceito**: Retorna array com todos valores de chave.

#### has() - Verificar Existência

```javascript
const params = new URLSearchParams('categoria=livros&preco=50');

console.log(params.has('categoria')); // true
console.log(params.has('estoque'));   // false
```

#### delete() - Remover Parâmetro

```javascript
const params = new URLSearchParams('a=1&b=2&c=3');

params.delete('b');

console.log(params.toString());
// a=1&c=3
```

#### toString() - Serializar para String

```javascript
const params = new URLSearchParams({ nome: 'João Silva', cidade: 'São Paulo' });

console.log(params.toString());
// nome=Jo%C3%A3o+Silva&cidade=S%C3%A3o+Paulo
// Note encoding automático: ã → %C3%A3, espaço → +
```

**Conceito**: Converte para query string válida com encoding.

### URL Encoding Automático

URLSearchParams **escapa automaticamente** caracteres especiais:

```javascript
const params = new URLSearchParams({
  busca: 'café & chá',      // Espaços e &
  email: 'joao@exemplo.com', // @
  url: 'https://exemplo.com' // : e /
});

console.log(params.toString());
// busca=caf%C3%A9+%26+ch%C3%A1&email=joao%40exemplo.com&url=https%3A%2F%2Fexemplo.com

// Uso em fetch
const response = await fetch(`/api/busca?${params}`);
```

**Caracteres Escapados**:
- Espaço: `%20` ou `+`
- `&`: `%26`
- `=`: `%3D`
- `@`: `%40`
- `#`: `%23`
- `/`: `%2F`
- `:`: `%3A`

### Iteração

URLSearchParams é **iterável**:

```javascript
const params = new URLSearchParams('a=1&b=2&c=3');

// for...of (pares [chave, valor])
for (const [chave, valor] of params) {
  console.log(`${chave}: ${valor}`);
}
// a: 1
// b: 2
// c: 3

// .entries() (mesmo que for...of)
for (const [chave, valor] of params.entries()) {
  console.log(`${chave} = ${valor}`);
}

// .keys() (apenas chaves)
for (const chave of params.keys()) {
  console.log(chave);
}
// a, b, c

// .values() (apenas valores)
for (const valor of params.values()) {
  console.log(valor);
}
// 1, 2, 3

// .forEach()
params.forEach((valor, chave) => {
  console.log(`${chave}: ${valor}`);
});
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Filtros Básicos em API

```javascript
async function buscarProdutos(filtros) {
  const params = new URLSearchParams();
  
  // Adicionar apenas filtros presentes
  if (filtros.categoria) params.set('categoria', filtros.categoria);
  if (filtros.precoMin) params.set('preco_min', filtros.precoMin);
  if (filtros.precoMax) params.set('preco_max', filtros.precoMax);
  if (filtros.ordenar) params.set('ordenar', filtros.ordenar);
  
  const url = `https://api.exemplo.com/produtos?${params}`;
  const response = await fetch(url);
  
  return await response.json();
}

// Uso
const produtos = await buscarProdutos({
  categoria: 'eletronicos',
  precoMax: 1000,
  ordenar: 'preco_asc'
});
// GET /produtos?categoria=eletronicos&preco_max=1000&ordenar=preco_asc
```

### Pattern 2: Paginação

```javascript
async function buscarPaginado(pagina = 1, limite = 20) {
  const params = new URLSearchParams({
    pagina: pagina,
    limite: limite
  });
  
  const response = await fetch(`/api/posts?${params}`);
  const data = await response.json();
  
  return {
    posts: data.items,
    total: data.total,
    paginaAtual: pagina,
    totalPaginas: Math.ceil(data.total / limite)
  };
}

// Uso
const resultado = await buscarPaginado(2, 50);
// GET /api/posts?pagina=2&limite=50
```

### Pattern 3: Busca com Múltiplos Filtros

```javascript
async function buscarUsuarios(query, filtros = {}) {
  const params = new URLSearchParams();
  
  // Query de busca
  if (query) params.set('q', query);
  
  // Filtros opcionais
  if (filtros.cidade) params.set('cidade', filtros.cidade);
  if (filtros.idade_min) params.set('idade_min', filtros.idade_min);
  if (filtros.idade_max) params.set('idade_max', filtros.idade_max);
  if (filtros.ativo !== undefined) params.set('ativo', filtros.ativo);
  
  // Arrays (tags, skills, etc.)
  if (filtros.tags && filtros.tags.length > 0) {
    filtros.tags.forEach(tag => params.append('tag', tag));
  }
  
  const response = await fetch(`/api/usuarios?${params}`);
  return await response.json();
}

// Uso
const usuarios = await buscarUsuarios('João', {
  cidade: 'São Paulo',
  idade_min: 25,
  idade_max: 40,
  ativo: true,
  tags: ['javascript', 'react', 'nodejs']
});
// GET /api/usuarios?q=Jo%C3%A3o&cidade=S%C3%A3o+Paulo&idade_min=25&idade_max=40&ativo=true&tag=javascript&tag=react&tag=nodejs
```

### Pattern 4: Seleção de Campos (Sparse Fieldsets)

```javascript
async function buscarUsuario(id, campos = []) {
  const params = new URLSearchParams();
  
  // Campos específicos a retornar
  if (campos.length > 0) {
    params.set('campos', campos.join(','));
  }
  
  const response = await fetch(`/api/usuarios/${id}?${params}`);
  return await response.json();
}

// Uso
const usuario = await buscarUsuario(123, ['id', 'nome', 'email']);
// GET /api/usuarios/123?campos=id,nome,email
// Retorna apenas campos solicitados (economia de banda)
```

### Pattern 5: Construir URL Dinamicamente

```javascript
function construirURL(base, params = {}, options = {}) {
  const searchParams = new URLSearchParams();
  
  // Adicionar parâmetros
  Object.entries(params).forEach(([chave, valor]) => {
    // Ignorar null/undefined
    if (valor != null) {
      // Arrays - múltiplos valores
      if (Array.isArray(valor)) {
        valor.forEach(v => searchParams.append(chave, v));
      } else {
        searchParams.set(chave, valor);
      }
    }
  });
  
  // Adicionar opções de query (sort, page, limit)
  if (options.ordenar) searchParams.set('ordenar', options.ordenar);
  if (options.pagina) searchParams.set('pagina', options.pagina);
  if (options.limite) searchParams.set('limite', options.limite);
  
  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

// Uso
const url = construirURL('/api/produtos', {
  categoria: 'livros',
  preco_max: 100,
  tags: ['programacao', 'javascript']
}, {
  ordenar: 'preco_desc',
  pagina: 2,
  limite: 20
});

console.log(url);
// /api/produtos?categoria=livros&preco_max=100&tags=programacao&tags=javascript&ordenar=preco_desc&pagina=2&limite=20
```

### Pattern 6: Parsing URL Existente

```javascript
// Extrair parâmetros de URL atual (browser)
const urlAtual = new URL(window.location.href);
const params = urlAtual.searchParams;

console.log(params.get('pagina'));
console.log(params.get('categoria'));

// Ou criar URL completa
const url = new URL('https://api.exemplo.com/produtos?categoria=livros&preco=50');
const params = url.searchParams;

console.log(params.get('categoria')); // "livros"
console.log(params.get('preco'));     // "50"

// Modificar e usar
params.set('ordenar', 'preco_asc');
params.delete('preco');

const novaURL = url.toString();
// https://api.exemplo.com/produtos?categoria=livros&ordenar=preco_asc
```

### Pattern 7: Wrapper Function Reutilizável

```javascript
// API Client com URLSearchParams
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.set(key, value);
        }
      }
    });
    
    const queryString = searchParams.toString();
    const url = queryString 
      ? `${this.baseURL}${endpoint}?${queryString}`
      : `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
}

// Uso
const api = new APIClient('https://api.exemplo.com');

const produtos = await api.get('/produtos', {
  categoria: 'eletronicos',
  preco_max: 1000,
  tags: ['laptop', 'gamer'],
  ordenar: 'preco_desc',
  pagina: 1,
  limite: 20
});
```

### Pattern 8: Query String com Valores Complexos

```javascript
// Filtros complexos (ranges, nested objects)
function construirFiltrosComplexos(filtros) {
  const params = new URLSearchParams();
  
  // Range de preço
  if (filtros.preco) {
    if (filtros.preco.min) params.set('preco[min]', filtros.preco.min);
    if (filtros.preco.max) params.set('preco[max]', filtros.preco.max);
  }
  
  // Range de data
  if (filtros.data) {
    if (filtros.data.inicio) params.set('data[inicio]', filtros.data.inicio);
    if (filtros.data.fim) params.set('data[fim]', filtros.data.fim);
  }
  
  // Arrays
  if (filtros.categorias) {
    filtros.categorias.forEach(cat => params.append('categoria[]', cat));
  }
  
  return params.toString();
}

// Uso
const queryString = construirFiltrosComplexos({
  preco: { min: 50, max: 500 },
  data: { inicio: '2024-01-01', fim: '2024-12-31' },
  categorias: ['livros', 'eletronicos']
});

console.log(queryString);
// preco[min]=50&preco[max]=500&data[inicio]=2024-01-01&data[fim]=2024-12-31&categoria[]=livros&categoria[]=eletronicos
```

### Pattern 9: Sincronizar UI com URL (React)

```javascript
// React - sincronizar filtros com URL
function ProdutosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Ler filtros da URL
  const filtros = {
    categoria: searchParams.get('categoria') || '',
    precoMin: searchParams.get('preco_min') || '',
    precoMax: searchParams.get('preco_max') || '',
    ordenar: searchParams.get('ordenar') || 'nome_asc'
  };
  
  // Atualizar filtros (atualiza URL)
  const atualizarFiltros = (novosFiltros) => {
    const params = new URLSearchParams();
    
    Object.entries(novosFiltros).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    setSearchParams(params);
  };
  
  // Buscar produtos quando URL mudar
  useEffect(() => {
    buscarProdutos(filtros);
  }, [searchParams]);
  
  return (
    <div>
      <Filtros filtros={filtros} onChange={atualizarFiltros} />
      <ListaProdutos />
    </div>
  );
}
```

---

## 🎯 Aplicabilidade e Contextos

### Casos de Uso Comuns

**1. Filtros**: `?categoria=livros&autor=Machado`
**2. Busca**: `?q=javascript&tipo=artigos`
**3. Paginação**: `?pagina=2&limite=20`
**4. Ordenação**: `?ordenar=data_desc`
**5. Seleção de Campos**: `?campos=id,titulo,autor`
**6. Tracking**: `?utm_source=google&utm_campaign=promo`

### REST API Patterns

```javascript
// Listar com filtros
GET /produtos?categoria=eletronicos&preco_max=1000

// Buscar
GET /usuarios?q=João&cidade=São+Paulo

// Paginar
GET /posts?pagina=3&limite=50

// Ordenar
GET /produtos?ordenar=preco_asc

// Combinar tudo
GET /produtos?categoria=livros&preco_min=20&preco_max=100&ordenar=titulo_asc&pagina=1&limite=20
```

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. URL Length Limit**: URLs têm limite (~2000 caracteres). Queries muito longas devem usar POST.

**2. Tudo é String**: Números, booleans viram strings (`42` → `"42"`). Parse necessário no server.

**3. Sem Estrutura Complexa**: Objetos nested requerem convenção (ex: `filtro[campo][operador]=valor`).

**4. Visível na URL**: Query params aparecem em logs, história - não use para dados sensíveis.

### Armadilhas Comuns

#### Armadilha 1: Esquecer toString()

```javascript
// ❌ ERRO - passar URLSearchParams diretamente
const params = new URLSearchParams({ q: 'teste' });
const url = `/api/busca?${params}`; // Funciona, mas implícito

// ✅ EXPLÍCITO - toString()
const url = `/api/busca?${params.toString()}`;
```

#### Armadilha 2: Duplicar `?`

```javascript
// ❌ ERRO - duplicar ?
const params = new URLSearchParams({ q: 'teste' });
const url = `/api/busca?${params}`;
// CORRETO: /api/busca?q=teste

const url = `/api/busca?${params.toString()}`;
// CORRETO: /api/busca?q=teste

// URLSearchParams NÃO inclui ? inicial
```

#### Armadilha 3: Type Coercion

```javascript
const params = new URLSearchParams({ ativo: true, idade: 30 });

console.log(params.get('ativo')); // "true" (string!)
console.log(params.get('idade'));  // "30" (string!)

// Conversão necessária
const ativo = params.get('ativo') === 'true';
const idade = parseInt(params.get('idade'), 10);
```

---

## 🔗 Interconexões Conceituais

### Relação com URL API

URLSearchParams trabalha com **URL API**:

```javascript
const url = new URL('https://api.exemplo.com/produtos');
url.searchParams.set('categoria', 'livros');
url.searchParams.set('preco_max', 100);

console.log(url.toString());
// https://api.exemplo.com/produtos?categoria=livros&preco_max=100
```

### Relação com Fetch API

URLSearchParams é **padrão para GET requests**:

```javascript
const params = new URLSearchParams({ categoria: 'livros' });
const response = await fetch(`/api/produtos?${params}`);
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar URLSearchParams:
1. **URL API**: Manipulação completa de URLs
2. **Request Options**: mode, credentials, cache com fetch
3. **Query Builders**: Libraries como qs, query-string
4. **GraphQL**: Alternative to complex query params
5. **Server-Side Filtering**: Implementar filtros em backend

---

## 📚 Conclusão

URLSearchParams é **ferramenta essencial** para trabalhar com query parameters em JavaScript moderno.

Dominar URLSearchParams significa:
- Construir URLs dinamicamente com **encoding automático**
- Manipular parâmetros com métodos **intuitivos** (.set, .append, .get)
- Implementar **filtros, busca, paginação** em APIs
- Evitar **concatenação manual** error-prone
- Integrar com **Fetch API** e **URL API**

É indispensável para aplicações que consomem APIs REST modernas.
