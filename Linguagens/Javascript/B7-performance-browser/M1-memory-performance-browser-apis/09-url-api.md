# URL API: Manipulação de URLs

## 🎯 Definição

**URL API** fornece interfaces para análise (parsing), construção e manipulação de URLs de forma estruturada e segura. Composta principalmente pelas classes `URL` e `URLSearchParams`, permite trabalhar com componentes de URL (protocolo, host, path, query params) sem manipulação manual de strings, evitando erros comuns de encoding e parsing.

```javascript
// Criar e manipular URL
const url = new URL('https://exemplo.com/caminho?nome=João&idade=25#secao');

console.log(url.protocol);   // 'https:'
console.log(url.hostname);   // 'exemplo.com'
console.log(url.pathname);   // '/caminho'
console.log(url.search);     // '?nome=João&idade=25'
console.log(url.hash);       // '#secao'

// Manipular query params
url.searchParams.set('idade', 26);
console.log(url.href); // 'https://exemplo.com/caminho?nome=João&idade=26#secao'
```

**Conceito:** API estruturada para parsing e manipulação de URLs.

## 📋 Classe URL

### Construtor

```javascript
// Construtor: new URL(url, base?)
const url1 = new URL('https://exemplo.com/pagina');

// URL relativa com base
const url2 = new URL('/api/dados', 'https://exemplo.com');
console.log(url2.href); // 'https://exemplo.com/api/dados'

// Resolve relativas
const url3 = new URL('../anterior', 'https://exemplo.com/a/b/c');
console.log(url3.href); // 'https://exemplo.com/a/b/anterior'
```

### Propriedades

```javascript
const url = new URL('https://user:pass@exemplo.com:8080/caminho/arquivo.html?q=busca&page=2#topo');

// Componentes da URL
console.log(url.href);       // URL completa
console.log(url.protocol);   // 'https:'
console.log(url.username);   // 'user'
console.log(url.password);   // 'pass'
console.log(url.host);       // 'exemplo.com:8080' (hostname + port)
console.log(url.hostname);   // 'exemplo.com'
console.log(url.port);       // '8080'
console.log(url.pathname);   // '/caminho/arquivo.html'
console.log(url.search);     // '?q=busca&page=2'
console.log(url.hash);       // '#topo'
console.log(url.origin);     // 'https://exemplo.com:8080' (readonly)
```

### Modificação

```javascript
const url = new URL('https://exemplo.com/pagina');

// Modificar componentes
url.protocol = 'http:';
url.hostname = 'novo-dominio.com';
url.pathname = '/novo-caminho';
url.search = '?nova=query';
url.hash = '#nova-secao';

console.log(url.href);
// 'http://novo-dominio.com/novo-caminho?nova=query#nova-secao'
```

### toString() e href

```javascript
const url = new URL('https://exemplo.com/pagina');

// toString() e .href são equivalentes
console.log(url.toString()); // 'https://exemplo.com/pagina'
console.log(url.href);       // 'https://exemplo.com/pagina'

// Útil para passar para fetch()
fetch(url.toString());
```

## 🧠 URLSearchParams

### Construtor

```javascript
// 1. String query
const params1 = new URLSearchParams('nome=João&idade=25');

// 2. Objeto
const params2 = new URLSearchParams({
  nome: 'João',
  idade: 25
});

// 3. Array de pares
const params3 = new URLSearchParams([
  ['nome', 'João'],
  ['idade', 25]
]);

// 4. De URL.search
const url = new URL('https://exemplo.com?nome=João&idade=25');
const params4 = new URLSearchParams(url.search);
```

### Métodos

```javascript
const params = new URLSearchParams();

// set(): definir valor (substitui existente)
params.set('nome', 'João');
params.set('idade', 25);

// append(): adicionar valor (permite duplicados)
params.append('hobby', 'leitura');
params.append('hobby', 'esportes');

// get(): obter primeiro valor
console.log(params.get('nome')); // 'João'
console.log(params.get('hobby')); // 'leitura'

// getAll(): obter todos valores
console.log(params.getAll('hobby')); // ['leitura', 'esportes']

// has(): verificar existência
console.log(params.has('nome')); // true

// delete(): remover parâmetro
params.delete('idade');

// toString(): serializar
console.log(params.toString()); // 'nome=João&hobby=leitura&hobby=esportes'
```

### Iteração

```javascript
const params = new URLSearchParams('nome=João&idade=25&cidade=SP');

// entries(): iterar pares [chave, valor]
for (const [chave, valor] of params.entries()) {
  console.log(`${chave}: ${valor}`);
}

// keys(): iterar chaves
for (const chave of params.keys()) {
  console.log(chave);
}

// values(): iterar valores
for (const valor of params.values()) {
  console.log(valor);
}

// forEach()
params.forEach((valor, chave) => {
  console.log(`${chave} = ${valor}`);
});
```

## 🔍 Casos Práticos

### Construir URL com Query Params

```javascript
// ✅ Usar URLSearchParams para encoding automático
const base = 'https://api.exemplo.com/buscar';
const params = new URLSearchParams({
  q: 'JavaScript & TypeScript', // Caracteres especiais encoded
  limite: 10,
  pagina: 2
});

const url = `${base}?${params}`;
console.log(url);
// 'https://api.exemplo.com/buscar?q=JavaScript+%26+TypeScript&limite=10&pagina=2'

// Ou com URL
const urlObj = new URL(base);
urlObj.search = params;
console.log(urlObj.href);
```

### Modificar Query Params Existente

```javascript
const url = new URL('https://exemplo.com/pagina?ordem=nome&dir=asc&limite=10');

// Modificar params
url.searchParams.set('limite', 20);
url.searchParams.delete('dir');
url.searchParams.append('filtro', 'ativo');

console.log(url.href);
// 'https://exemplo.com/pagina?ordem=nome&limite=20&filtro=ativo'
```

### Parse Query String da URL Atual (Browser)

```javascript
// window.location.href = 'https://site.com/pagina?id=123&nome=João'

const params = new URLSearchParams(window.location.search);

const id = params.get('id');       // '123'
const nome = params.get('nome');   // 'João'

// Ou usando URL
const url = new URL(window.location.href);
const id2 = url.searchParams.get('id');
```

### Validar URL

```javascript
function urlValida(string) {
  try {
    new URL(string);
    return true;
  } catch (erro) {
    return false;
  }
}

console.log(urlValida('https://exemplo.com')); // true
console.log(urlValida('não é url'));           // false
console.log(urlValida('/relativa'));           // false (sem base)
```

### Encoding Automático

```javascript
// URLSearchParams faz encoding automático
const params = new URLSearchParams({
  nome: 'João & Maria',
  email: 'usuario@exemplo.com',
  mensagem: 'Olá\nMundo!'
});

console.log(params.toString());
// 'nome=Jo%C3%A3o+%26+Maria&email=usuario%40exemplo.com&mensagem=Ol%C3%A1%0AMundo%21'

// ❌ Sem URLSearchParams: encoding manual (propenso a erros)
const manual = `nome=${encodeURIComponent('João & Maria')}`;
```

### Construir URL de API com Filtros

```javascript
function construirUrlAPI(base, filtros) {
  const url = new URL(base);

  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== null && valor !== undefined) {
      url.searchParams.set(chave, valor);
    }
  });

  return url.toString();
}

const url = construirUrlAPI('https://api.exemplo.com/produtos', {
  categoria: 'livros',
  precoMin: 10,
  precoMax: 50,
  ordenar: 'preco',
  limite: 20,
  pagina: undefined // Ignorado
});

console.log(url);
// 'https://api.exemplo.com/produtos?categoria=livros&precoMin=10&precoMax=50&ordenar=preco&limite=20'
```

### Múltiplos Valores (Arrays)

```javascript
// Construir URL com array de valores
const params = new URLSearchParams();
const ids = [1, 2, 3, 4, 5];

ids.forEach(id => params.append('id', id));

console.log(params.toString());
// 'id=1&id=2&id=3&id=4&id=5'

const url = `https://api.exemplo.com/items?${params}`;

// Parse de múltiplos valores
const urlParse = new URL(url);
const idsRecebidos = urlParse.searchParams.getAll('id');
console.log(idsRecebidos); // ['1', '2', '3', '4', '5']
```

### Remover Query Params

```javascript
const url = new URL('https://exemplo.com/pagina?token=abc&sessao=xyz&debug=true');

// Remover params sensíveis antes de log
url.searchParams.delete('token');
url.searchParams.delete('sessao');

console.log(url.href);
// 'https://exemplo.com/pagina?debug=true'
```

## ⚠️ Considerações

### URL Relativas Precisam de Base

```javascript
// ❌ ERRO: URL relativa sem base
try {
  const url = new URL('/api/dados');
} catch (erro) {
  console.log('Erro: URL relativa precisa de base');
}

// ✅ Fornecer base
const url = new URL('/api/dados', 'https://exemplo.com');
console.log(url.href); // 'https://exemplo.com/api/dados'

// ✅ Ou usar window.location (browser)
const url2 = new URL('/api/dados', window.location.origin);
```

### toString() vs toJSON()

```javascript
const url = new URL('https://exemplo.com/pagina');

console.log(url.toString()); // 'https://exemplo.com/pagina'
console.log(url.toJSON());   // 'https://exemplo.com/pagina'

// JSON.stringify usa toJSON()
console.log(JSON.stringify({ url }));
// '{"url":"https://exemplo.com/pagina"}'
```

### Propriedades Read-only

```javascript
const url = new URL('https://exemplo.com:443/pagina');

// origin é read-only
console.log(url.origin); // 'https://exemplo.com:443'

// ❌ Não pode modificar origin diretamente
// url.origin = 'https://outro.com'; // Ignorado

// ✅ Modificar componentes individualmente
url.protocol = 'http:';
url.hostname = 'outro.com';
url.port = '8080';
console.log(url.origin); // 'http://outro.com:8080'
```

### Normalização de URL

```javascript
// URL normaliza certos aspectos automaticamente
const url1 = new URL('https://EXEMPLO.COM/Pagina');
console.log(url1.hostname); // 'exemplo.com' (lowercase)
console.log(url1.pathname); // '/Pagina' (case preservado)

// Portas padrão são omitidas
const url2 = new URL('https://exemplo.com:443/pagina');
console.log(url2.host); // 'exemplo.com' (porta 443 omitida)

const url3 = new URL('http://exemplo.com:80/pagina');
console.log(url3.host); // 'exemplo.com' (porta 80 omitida)
```

## 🚀 Integração com Fetch

```javascript
// Construir URL com params e usar em fetch
async function buscarUsuarios(filtros) {
  const url = new URL('https://api.exemplo.com/usuarios');

  Object.entries(filtros).forEach(([chave, valor]) => {
    url.searchParams.set(chave, valor);
  });

  const resposta = await fetch(url);
  return resposta.json();
}

// Uso
const usuarios = await buscarUsuarios({
  role: 'admin',
  ativo: true,
  limite: 50
});
// Requisição: GET https://api.exemplo.com/usuarios?role=admin&ativo=true&limite=50
```

### URL Completa em Node.js

```javascript
// Node.js: URL API disponível globalmente (desde v10)
const { URL, URLSearchParams } = require('url'); // Ou global

const url = new URL('https://exemplo.com/api');
url.searchParams.set('chave', 'valor');

// Usar com fetch (node-fetch ou native fetch em Node 18+)
fetch(url.toString()).then(r => r.json());
```

URL API elimina manipulação manual de strings de URL, fornecendo interface type-safe, auto-encoding e parsing robusto, essencial para construção confiável de URLs em aplicações modernas.
