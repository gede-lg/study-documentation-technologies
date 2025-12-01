# Selecting Elements: Seleção de Elementos DOM

## 🎯 Definição

**Seleção de elementos** é o processo de localizar e obter referências a nós específicos na árvore DOM usando métodos de busca. JavaScript oferece múltiplas APIs para selecionar elementos por ID, classe, tag, atributos ou seletores CSS complexos, cada uma com características de performance e casos de uso distintos.

```javascript
// Métodos principais de seleção
const porId = document.getElementById('meuId');
const porClasse = document.getElementsByClassName('minhaClasse');
const porTag = document.getElementsByTagName('div');
const porSeletor = document.querySelector('.minhaClasse');
const todosSeletores = document.querySelectorAll('div.item');
```

**Conceito:** APIs para localizar elementos específicos na árvore DOM.

## 📋 Métodos de Seleção

### getElementById()

Retorna elemento único por ID (ou null):

```javascript
// HTML: <div id="container">...</div>

const elemento = document.getElementById('container');

console.log(elemento); // <div id="container">
console.log(elemento.id); // 'container'

// ID não existe: retorna null
const inexistente = document.getElementById('naoExiste');
console.log(inexistente); // null

// ⚠️ IDs devem ser únicos no documento
// Se houver duplicatas, retorna o primeiro encontrado
```

**Características:**
- Mais rápido (otimizado internamente)
- Retorna elemento único (não coleção)
- Apenas disponível em `document` (não em elementos)
- Case-sensitive

### getElementsByClassName()

Retorna coleção live de elementos por classe:

```javascript
// HTML:
// <div class="item">A</div>
// <div class="item">B</div>
// <p class="item">C</p>

const items = document.getElementsByClassName('item');

console.log(items.length); // 3
console.log(items[0]); // <div class="item">A</div>

// Múltiplas classes (AND)
const especificos = document.getElementsByClassName('item destaque');
// Retorna elementos com AMBAS as classes

// Live collection
const div = document.createElement('div');
div.className = 'item';
document.body.appendChild(div);

console.log(items.length); // 4 (atualizado automaticamente!)
```

**Características:**
- Retorna HTMLCollection (live)
- Disponível em document e elementos
- Aceita múltiplas classes separadas por espaço
- Case-sensitive

### getElementsByTagName()

Retorna coleção live de elementos por tag:

```javascript
// Todos divs
const divs = document.getElementsByTagName('div');

// Todos elementos (*)
const todos = document.getElementsByTagName('*');

// Em contexto específico
const container = document.getElementById('container');
const spans = container.getElementsByTagName('span');
// Apenas spans dentro de container

// Case-insensitive (HTML)
const p1 = document.getElementsByTagName('p');
const p2 = document.getElementsByTagName('P');
console.log(p1 === p2); // false (objetos diferentes), mas mesmo conteúdo
```

**Características:**
- Retorna HTMLCollection (live)
- Case-insensitive em HTML, case-sensitive em XML
- `'*'` seleciona todos elementos
- Disponível em document e elementos

### querySelector()

Retorna primeiro elemento que corresponde ao seletor CSS:

```javascript
// Seletor simples
const div = document.querySelector('div');

// Seletor de classe
const item = document.querySelector('.item');

// Seletor de ID
const container = document.querySelector('#container');

// Seletores complexos
const primeiro = document.querySelector('div.item:first-child');
const especifico = document.querySelector('nav > ul > li.ativo');
const atributo = document.querySelector('[data-id="123"]');

// Retorna null se não encontrar
const inexistente = document.querySelector('.nao-existe');
console.log(inexistente); // null

// Contexto
const nav = document.querySelector('nav');
const link = nav.querySelector('a.ativo'); // Busca dentro de nav
```

**Características:**
- Retorna primeiro elemento ou null
- Aceita qualquer seletor CSS válido
- Estático (snapshot no momento da chamada)
- Disponível em document e elementos
- Mais lento que métodos específicos, mas mais flexível

### querySelectorAll()

Retorna NodeList estática de todos elementos correspondentes:

```javascript
// Todos elementos com classe 'item'
const items = document.querySelectorAll('.item');

console.log(items.length); // 3
console.log(items[0]); // Primeiro item

// Iterar
items.forEach(item => {
  console.log(item.textContent);
});

// Converter para array
const array = Array.from(items);
const array2 = [...items];

// Seletores complexos
const ativos = document.querySelectorAll('div.item.ativo');
const links = document.querySelectorAll('nav a[href^="https"]');
const pares = document.querySelectorAll('li:nth-child(even)');

// Lista vazia se não encontrar
const vazio = document.querySelectorAll('.nao-existe');
console.log(vazio.length); // 0 (não null)
```

**Características:**
- Retorna NodeList (estática)
- Aceita qualquer seletor CSS
- Array-like (tem forEach)
- Disponível em document e elementos

## 🧠 Seletores CSS Avançados

### Pseudo-classes

```javascript
// :first-child, :last-child, :nth-child()
const primeiro = document.querySelector('li:first-child');
const ultimo = document.querySelector('li:last-child');
const terceiro = document.querySelector('li:nth-child(3)');
const pares = document.querySelectorAll('li:nth-child(even)');
const impares = document.querySelectorAll('li:nth-child(odd)');
const multiplos3 = document.querySelectorAll('li:nth-child(3n)');

// :not()
const naoAtivos = document.querySelectorAll('li:not(.ativo)');

// :empty
const vazios = document.querySelectorAll('div:empty');

// :checked, :disabled
const selecionados = document.querySelectorAll('input:checked');
const desabilitados = document.querySelectorAll('button:disabled');
```

### Atributos

```javascript
// [atributo]
const comData = document.querySelectorAll('[data-id]');

// [atributo="valor"]
const exato = document.querySelectorAll('[type="text"]');

// [atributo^="inicio"]
const comecaCom = document.querySelectorAll('[href^="https"]');

// [atributo$="fim"]
const terminaCom = document.querySelectorAll('[src$=".png"]');

// [atributo*="contém"]
const contem = document.querySelectorAll('[class*="btn"]');

// [atributo~="palavra"]
const palavra = document.querySelectorAll('[class~="ativo"]');
```

### Combinadores

```javascript
// Descendente (espaço)
const descendentes = document.querySelectorAll('div p');
// Todos <p> dentro de <div> (qualquer nível)

// Filho direto (>)
const filhos = document.querySelectorAll('div > p');
// Apenas <p> filhos diretos de <div>

// Irmão adjacente (+)
const adjacente = document.querySelector('h2 + p');
// Primeiro <p> imediatamente após <h2>

// Irmãos seguintes (~)
const seguintes = document.querySelectorAll('h2 ~ p');
// Todos <p> após <h2> (mesmo nível)
```

### :scope (Seletor de Contexto)

```javascript
const container = document.querySelector('#container');

// Sem :scope: seleciona em todo o documento
const todos = container.querySelectorAll('div');

// Com :scope: seleciona relativos ao container
const filhosDirectos = container.querySelectorAll(':scope > div');
// Apenas filhos diretos de container

// Útil para seletores complexos com contexto
const nav = document.querySelector('nav');
const linkAtivo = nav.querySelector(':scope > ul > li.ativo > a');
```

## 🔍 Performance e Otimizações

### Hierarquia de Performance

```javascript
// ⚡ Mais rápido
document.getElementById('id');

// 🏃 Rápido
document.getElementsByClassName('classe');
document.getElementsByTagName('div');

// 🚶 Moderado
document.querySelector('#id');
document.querySelector('.classe');

// 🐌 Mais lento (mas mais flexível)
document.querySelectorAll('div.item[data-active="true"]:not(.hidden)');
```

### Cachear Seleções

```javascript
// ❌ Ruim: selecionar repetidamente
function atualizar() {
  document.querySelector('#status').textContent = 'Processando...';
  // ... código
  document.querySelector('#status').textContent = 'Completo';
  // ... código
  document.querySelector('#status').style.color = 'green';
}

// ✅ Bom: cachear seleção
function atualizar() {
  const status = document.querySelector('#status');
  status.textContent = 'Processando...';
  // ... código
  status.textContent = 'Completo';
  // ... código
  status.style.color = 'green';
}
```

### Reduzir Escopo

```javascript
// ❌ Buscar em todo documento
const links = document.querySelectorAll('a');

// ✅ Buscar em contexto específico
const nav = document.querySelector('nav');
const links = nav.querySelectorAll('a'); // Busca apenas em nav
```

### Especificidade de Seletores

```javascript
// ❌ Seletor genérico (lento em documentos grandes)
const items = document.querySelectorAll('.item');

// ✅ Seletor mais específico (mais rápido)
const items = document.querySelectorAll('#lista > .item');

// ✅ Se ID é único, usar getElementById
const lista = document.getElementById('lista');
const items = lista.getElementsByClassName('item');
```

## ⚠️ Comparação: Live vs Static

### HTMLCollection vs NodeList

```javascript
// HTMLCollection (live)
const divs1 = document.getElementsByTagName('div');
console.log(divs1.length); // 5

document.body.appendChild(document.createElement('div'));
console.log(divs1.length); // 6 (atualizado!)

// NodeList (static - de querySelectorAll)
const divs2 = document.querySelectorAll('div');
console.log(divs2.length); // 6

document.body.appendChild(document.createElement('div'));
console.log(divs2.length); // 6 (não atualizado)
```

### Implicações

```javascript
// Live: cuidado com loops infinitos
const divs = document.getElementsByTagName('div');

// ❌ Loop infinito!
for (let i = 0; i < divs.length; i++) {
  const novaDiv = document.createElement('div');
  document.body.appendChild(novaDiv);
  // divs.length aumenta a cada iteração!
}

// ✅ Converter para array estático
const divsArray = Array.from(document.getElementsByTagName('div'));

divsArray.forEach(div => {
  const novaDiv = document.createElement('div');
  document.body.appendChild(novaDiv);
  // divsArray.length permanece constante
});
```

## 🚀 Padrões Práticos

### Helper de Seleção

```javascript
// Alias curtos
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

// Uso
const header = $('#header');
const items = $$('.item');

// Com contexto
const $ctx = (selector, context = document) => context.querySelector(selector);
const nav = $('#nav');
const link = $ctx('a.ativo', nav);
```

### Seleção Condicional

```javascript
function selecionarOuCriar(selector, tagName = 'div') {
  let elemento = document.querySelector(selector);

  if (!elemento) {
    elemento = document.createElement(tagName);
    elemento.className = selector.replace('.', '');
    document.body.appendChild(elemento);
  }

  return elemento;
}

// Uso
const container = selecionarOuCriar('#container');
// Seleciona se existe, cria se não
```

### Seleção com Fallback

```javascript
function selecionarComFallback(...seletores) {
  for (const seletor of seletores) {
    const elemento = document.querySelector(seletor);
    if (elemento) return elemento;
  }
  return null;
}

// Uso: tentar múltiplos seletores
const main = selecionarComFallback(
  '#main-content',
  '.main-content',
  'main',
  'body'
);
```

### Verificar Existência

```javascript
// ❌ Verboso
if (document.querySelector('.modal') !== null) {
  // ...
}

// ✅ Truthy check
if (document.querySelector('.modal')) {
  // ...
}

// ✅ Optional chaining (ES2020+)
document.querySelector('.modal')?.classList.add('show');
```

### Iterar Resultados

```javascript
const items = document.querySelectorAll('.item');

// forEach nativo (NodeList)
items.forEach(item => {
  console.log(item.textContent);
});

// Converter para array (métodos completos)
[...items].map(item => item.textContent);

// for...of
for (const item of items) {
  console.log(item.textContent);
}

// HTMLCollection: não tem forEach
const divs = document.getElementsByTagName('div');
// divs.forEach() // ❌ Erro!

// Converter para array
Array.from(divs).forEach(div => {
  console.log(div);
});
```

### Closest (Buscar Ancestral)

```javascript
// HTML:
// <div class="container">
//   <ul>
//     <li><button id="btn">Click</button></li>
//   </ul>
// </div>

const botao = document.querySelector('#btn');

// closest(): buscar ancestral que corresponde ao seletor
const li = botao.closest('li');
const ul = botao.closest('ul');
const container = botao.closest('.container');

// Retorna null se não encontrar
const nav = botao.closest('nav'); // null

// Útil para delegação de eventos
document.addEventListener('click', e => {
  const botao = e.target.closest('button');
  if (botao) {
    console.log('Botão clicado:', botao);
  }
});
```

### Matches (Verificar Seletor)

```javascript
const elemento = document.querySelector('.item');

// matches(): verificar se elemento corresponde ao seletor
console.log(elemento.matches('.item')); // true
console.log(elemento.matches('.ativo')); // false
console.log(elemento.matches('div.item')); // true se for <div>

// Útil para filtrar
const items = document.querySelectorAll('.item');
const ativos = [...items].filter(item => item.matches('.ativo'));
```

Dominar seleção de elementos é fundamental para manipulação eficiente do DOM, permitindo localizar rapidamente elementos específicos e aplicar transformações precisas na interface.
