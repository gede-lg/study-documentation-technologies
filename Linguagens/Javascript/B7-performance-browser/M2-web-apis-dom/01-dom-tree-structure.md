# DOM Tree Structure: Estrutura de Árvore do DOM

## 🎯 Definição

**DOM (Document Object Model)** é uma representação em árvore hierárquica de um documento HTML/XML, onde cada elemento, atributo e texto é representado como um nó (node). O DOM permite que JavaScript interaja com a estrutura, estilo e conteúdo de páginas web de forma programática através de uma API padronizada.

```javascript
// HTML:
// <div id="container">
//   <p>Parágrafo</p>
//   <span>Texto</span>
// </div>

// Estrutura DOM:
//   document
//     └─ html (documentElement)
//         └─ body
//             └─ div#container
//                 ├─ p
//                 │   └─ "Parágrafo" (text node)
//                 └─ span
//                     └─ "Texto" (text node)
```

**Conceito:** Representação hierárquica de documentos como árvore de nós manipuláveis.

## 📋 Tipos de Nós

### Node Types

Cada nó tem uma propriedade `nodeType` indicando seu tipo:

```javascript
// Principais tipos
Node.ELEMENT_NODE                // 1  - <div>, <p>, etc.
Node.TEXT_NODE                   // 3  - Conteúdo de texto
Node.COMMENT_NODE                // 8  - <!-- comentário -->
Node.DOCUMENT_NODE               // 9  - document
Node.DOCUMENT_FRAGMENT_NODE      // 11 - DocumentFragment

// Exemplo
const elemento = document.querySelector('div');
console.log(elemento.nodeType);        // 1 (ELEMENT_NODE)
console.log(elemento.firstChild.nodeType); // 3 (TEXT_NODE)
```

### Element Nodes

Nós de elementos HTML:

```javascript
const div = document.createElement('div');

console.log(div.nodeType);      // 1
console.log(div.nodeName);      // 'DIV'
console.log(div.tagName);       // 'DIV'
console.log(div.nodeValue);     // null (elementos não têm valor)
```

### Text Nodes

Nós de texto (conteúdo entre tags):

```javascript
// <p>Olá Mundo</p>
const p = document.querySelector('p');
const textoNode = p.firstChild;

console.log(textoNode.nodeType);  // 3
console.log(textoNode.nodeName);  // '#text'
console.log(textoNode.nodeValue); // 'Olá Mundo'
console.log(textoNode.data);      // 'Olá Mundo' (alias)
```

### Comment Nodes

Nós de comentário:

```javascript
// <!-- Este é um comentário -->
const comentario = document.createComment('Comentário');

console.log(comentario.nodeType);  // 8
console.log(comentario.nodeName);  // '#comment'
console.log(comentario.nodeValue); // 'Comentário'
```

## 🧠 Hierarquia de Nós

### Raiz do Documento

```javascript
// document: raiz da árvore
console.log(document.nodeType); // 9 (DOCUMENT_NODE)

// documentElement: elemento <html>
const html = document.documentElement;
console.log(html.tagName); // 'HTML'

// head e body
console.log(document.head);  // <head>
console.log(document.body);  // <body>
```

### Navegação Parent/Child

```javascript
const div = document.querySelector('#container');

// Parent (pai)
console.log(div.parentNode);      // Nó pai (qualquer tipo)
console.log(div.parentElement);   // Elemento pai (ignora não-elementos)

// Children (filhos)
console.log(div.childNodes);      // NodeList (todos nós, incluindo texto)
console.log(div.children);        // HTMLCollection (apenas elementos)

console.log(div.firstChild);      // Primeiro nó (pode ser texto)
console.log(div.firstElementChild); // Primeiro elemento
console.log(div.lastChild);       // Último nó
console.log(div.lastElementChild); // Último elemento

// Contagem
console.log(div.childNodes.length); // Todos nós
console.log(div.childElementCount); // Apenas elementos
```

### Navegação Sibling (Irmãos)

```javascript
const elemento = document.querySelector('.item');

// Siblings (irmãos)
console.log(elemento.previousSibling);        // Nó anterior (pode ser texto)
console.log(elemento.previousElementSibling); // Elemento anterior
console.log(elemento.nextSibling);            // Nó seguinte
console.log(elemento.nextElementSibling);     // Elemento seguinte
```

### Diferença: Node vs Element

```javascript
// HTML:
// <div>
//   Texto
//   <span>Span</span>
// </div>

const div = document.querySelector('div');

// childNodes: TODOS nós (texto + elementos)
console.log(div.childNodes.length); // 3: text, span, text (whitespace)

// children: APENAS elementos
console.log(div.children.length); // 1: span

// firstChild vs firstElementChild
console.log(div.firstChild.nodeType);        // 3 (TEXT_NODE)
console.log(div.firstElementChild.tagName);  // 'SPAN'
```

## 🔍 Percorrendo a Árvore

### Recursão Profunda (Deep Traversal)

```javascript
function percorrerArvore(node, callback, nivel = 0) {
  callback(node, nivel);

  // Recursivamente percorrer filhos
  node.childNodes.forEach(filho => {
    percorrerArvore(filho, callback, nivel + 1);
  });
}

// Uso
percorrerArvore(document.body, (node, nivel) => {
  const indent = '  '.repeat(nivel);
  console.log(`${indent}${node.nodeName}`);
});

// Saída:
// BODY
//   DIV
//     P
//       #text
//     SPAN
//       #text
```

### TreeWalker

API nativa para percorrer árvore:

```javascript
// Criar TreeWalker
const walker = document.createTreeWalker(
  document.body,           // Raiz
  NodeFilter.SHOW_ELEMENT, // Filtro: apenas elementos
  null                     // Função de filtro adicional
);

// Percorrer
let node = walker.currentNode;
while (node) {
  console.log(node.tagName);
  node = walker.nextNode();
}
```

### NodeIterator

Iterador linear de nós:

```javascript
const iterator = document.createNodeIterator(
  document.body,
  NodeFilter.SHOW_TEXT // Apenas nós de texto
);

let node;
while (node = iterator.nextNode()) {
  console.log(`Texto: "${node.nodeValue.trim()}"`);
}
```

## 🎯 Propriedades Importantes

### textContent vs innerText vs innerHTML

```javascript
// HTML:
// <div>
//   Texto visível
//   <span style="display:none">Oculto</span>
//   <script>console.log('script')</script>
// </div>

const div = document.querySelector('div');

// textContent: todo texto, incluindo oculto e scripts
console.log(div.textContent);
// "Texto visível Oculto console.log('script')"

// innerText: apenas texto visível (respeita CSS)
console.log(div.innerText);
// "Texto visível"

// innerHTML: HTML completo (string)
console.log(div.innerHTML);
// "Texto visível <span style="display:none">Oculto</span>..."
```

### outerHTML

```javascript
// HTML:
// <div id="box">Conteúdo</div>

const div = document.querySelector('#box');

// innerHTML: conteúdo interno
console.log(div.innerHTML); // "Conteúdo"

// outerHTML: elemento completo (incluindo tag)
console.log(div.outerHTML); // '<div id="box">Conteúdo</div>'

// Substituir elemento completo
div.outerHTML = '<p>Novo elemento</p>';
// <div> é removido, <p> é inserido no lugar
```

### Metadados do Nó

```javascript
const elemento = document.querySelector('div');

// Informações
console.log(elemento.nodeName);     // 'DIV'
console.log(elemento.tagName);      // 'DIV' (apenas para elementos)
console.log(elemento.nodeType);     // 1
console.log(elemento.nodeValue);    // null (elementos)

// Documento proprietário
console.log(elemento.ownerDocument === document); // true

// Verificar presença na árvore
console.log(elemento.isConnected); // true se no documento
```

## ⚠️ Armadilhas Comuns

### Whitespace Text Nodes

```javascript
// HTML (com formatação):
// <div>
//   <span>A</span>
//   <span>B</span>
// </div>

const div = document.querySelector('div');

// Whitespace cria text nodes!
console.log(div.childNodes.length); // 5: text, span, text, span, text

// Solução: usar .children (apenas elementos)
console.log(div.children.length); // 2: span, span
```

### Live vs Static Collections

```javascript
// childNodes e children são LIVE
const div = document.querySelector('div');
const filhos = div.children; // HTMLCollection (live)

console.log(filhos.length); // 2

div.appendChild(document.createElement('p'));

console.log(filhos.length); // 3 (atualizado automaticamente!)

// Comparar com querySelectorAll (static)
const filhos2 = div.querySelectorAll(':scope > *');
console.log(filhos2.length); // 3

div.appendChild(document.createElement('span'));

console.log(filhos2.length); // 3 (não atualizado - snapshot)
```

### Modificar durante Iteração

```javascript
// ❌ Problema: modificar coleção live durante iteração
const div = document.querySelector('div');

for (let i = 0; i < div.children.length; i++) {
  div.removeChild(div.children[i]); // Pula elementos!
}

// ✅ Solução 1: iterar de trás para frente
for (let i = div.children.length - 1; i >= 0; i--) {
  div.removeChild(div.children[i]);
}

// ✅ Solução 2: converter para array
[...div.children].forEach(child => {
  div.removeChild(child);
});

// ✅ Solução 3: sempre remover primeiro
while (div.firstChild) {
  div.removeChild(div.firstChild);
}
```

### nodeValue vs textContent

```javascript
const div = document.createElement('div');
div.innerHTML = '<p>A</p><p>B</p>';

// nodeValue: apenas para text/comment nodes
console.log(div.nodeValue); // null (elemento não tem valor)

// textContent: concatenação de todos textos descendentes
console.log(div.textContent); // "AB"

// Para text node:
const textoNode = document.createTextNode('Texto');
console.log(textoNode.nodeValue);   // 'Texto'
console.log(textoNode.textContent); // 'Texto'
```

## 🚀 Padrões Avançados

### Clonar Subárvore

```javascript
const original = document.querySelector('#original');

// Shallow clone (sem descendentes)
const cloneRaso = original.cloneNode(false);

// Deep clone (com descendentes)
const cloneProfundo = original.cloneNode(true);

// Event listeners NÃO são clonados
```

### Verificar Ancestralidade

```javascript
function ehAncestral(ancestral, descendente) {
  return ancestral.contains(descendente);
}

const body = document.body;
const div = document.querySelector('div');

console.log(body.contains(div)); // true
console.log(div.contains(body)); // false

// Comparar posição relativa
const posicao = div.compareDocumentPosition(body);
console.log(posicao & Node.DOCUMENT_POSITION_CONTAINS); // true se body contém div
```

### Normalizar Text Nodes

```javascript
const div = document.createElement('div');

// Criar múltiplos text nodes adjacentes
div.appendChild(document.createTextNode('A'));
div.appendChild(document.createTextNode('B'));
div.appendChild(document.createTextNode('C'));

console.log(div.childNodes.length); // 3

// Normalizar: juntar text nodes adjacentes
div.normalize();

console.log(div.childNodes.length); // 1
console.log(div.textContent); // 'ABC'
```

### DocumentFragment

Construir subárvore fora do DOM:

```javascript
// ✅ Evitar múltiplos reflows
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div); // Adicionar ao fragment (não ao DOM)
}

// Uma única inserção no DOM
document.body.appendChild(fragment); // Reflow único
```

Compreender a estrutura de árvore do DOM é fundamental para manipulação eficiente de documentos, permitindo navegação precisa, modificações estruturadas e otimizações de performance.
