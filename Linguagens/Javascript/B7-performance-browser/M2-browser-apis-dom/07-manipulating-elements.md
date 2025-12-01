# Manipulating Elements: Manipulação de Elementos DOM

## 🎯 Definição

**Manipulação de elementos** refere-se à modificação programática da estrutura, conteúdo, atributos e estilos do DOM. Através da API DOM, JavaScript pode criar, inserir, remover, clonar e modificar elementos, permitindo construção dinâmica de interfaces e interações ricas.

```javascript
// Criar elemento
const div = document.createElement('div');

// Modificar conteúdo
div.textContent = 'Olá Mundo';

// Definir atributos
div.id = 'container';
div.className = 'box ativo';

// Inserir no documento
document.body.appendChild(div);

// Resultado: <div id="container" class="box ativo">Olá Mundo</div>
```

**Conceito:** API para modificação dinâmica da estrutura e conteúdo do DOM.

## 📋 Criação de Elementos

### createElement()

```javascript
// Criar elemento por tag
const div = document.createElement('div');
const p = document.createElement('p');
const span = document.createElement('span');

// Elemento não está no DOM até ser inserido
console.log(div.isConnected); // false

document.body.appendChild(div);
console.log(div.isConnected); // true
```

### createTextNode()

```javascript
// Criar nó de texto
const texto = document.createTextNode('Conteúdo de texto');

const p = document.createElement('p');
p.appendChild(texto);

// Equivalente a:
p.textContent = 'Conteúdo de texto';
```

### createDocumentFragment()

```javascript
// Fragment: container temporário (não causa reflow)
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div); // Adicionar ao fragment
}

// Uma única inserção no DOM
document.body.appendChild(fragment); // Reflow único
```

## 🧠 Inserção de Elementos

### appendChild()

```javascript
const container = document.querySelector('#container');
const novoElemento = document.createElement('div');

// Adicionar como último filho
container.appendChild(novoElemento);

// Se elemento já está no DOM, ele é MOVIDO
const existente = document.querySelector('.item');
container.appendChild(existente); // Move para fim de container
```

### insertBefore()

```javascript
const container = document.querySelector('#container');
const novoElemento = document.createElement('div');
const referencia = container.firstChild;

// Inserir antes de referência
container.insertBefore(novoElemento, referencia);

// Inserir no início
container.insertBefore(novoElemento, container.firstChild);

// Se referência for null, comporta-se como appendChild
container.insertBefore(novoElemento, null); // Adiciona ao fim
```

### append() / prepend() (Moderno)

```javascript
const container = document.querySelector('#container');

// append(): adicionar ao fim (aceita múltiplos argumentos)
container.append(
  document.createElement('div'),
  'Texto direto',
  document.createElement('span')
);

// prepend(): adicionar ao início
container.prepend(document.createElement('header'));

// Diferenças vs appendChild:
// - append() aceita strings (cria text nodes automaticamente)
// - append() aceita múltiplos argumentos
// - append() não retorna valor (appendChild retorna elemento)
```

### before() / after()

```javascript
const elemento = document.querySelector('.item');

// Inserir antes do elemento (como irmão)
elemento.before(document.createElement('div'));

// Inserir depois do elemento (como irmão)
elemento.after(document.createElement('div'));

// Múltiplos argumentos
elemento.after(
  document.createElement('p'),
  'Texto',
  document.createElement('span')
);
```

### insertAdjacentElement() / insertAdjacentHTML()

```javascript
const elemento = document.querySelector('.item');

// insertAdjacentElement(posicao, elemento)
const novoDiv = document.createElement('div');

elemento.insertAdjacentElement('beforebegin', novoDiv); // Antes do elemento
elemento.insertAdjacentElement('afterbegin', novoDiv);  // Primeiro filho
elemento.insertAdjacentElement('beforeend', novoDiv);   // Último filho
elemento.insertAdjacentElement('afterend', novoDiv);    // Depois do elemento

// insertAdjacentHTML(posicao, html)
elemento.insertAdjacentHTML('beforeend', '<p>Novo parágrafo</p>');

// insertAdjacentText(posicao, texto)
elemento.insertAdjacentText('afterbegin', 'Texto no início');
```

## 🔍 Remoção de Elementos

### removeChild()

```javascript
const container = document.querySelector('#container');
const filho = container.querySelector('.item');

// Remover filho específico
container.removeChild(filho);

// ❌ Filho deve ser descendente direto
const neto = container.querySelector('.sub-item');
// container.removeChild(neto); // Erro se neto não é filho direto!

// ✅ Remover do pai correto
neto.parentNode.removeChild(neto);
```

### remove() (Moderno)

```javascript
const elemento = document.querySelector('.item');

// Remover elemento diretamente (sem referência ao pai)
elemento.remove();

// Mais simples que:
// elemento.parentNode.removeChild(elemento);
```

### replaceChild()

```javascript
const container = document.querySelector('#container');
const antigo = container.querySelector('.item');
const novo = document.createElement('div');
novo.textContent = 'Novo conteúdo';

// Substituir filho
container.replaceChild(novo, antigo);
// 'antigo' é removido do DOM
```

### replaceWith() (Moderno)

```javascript
const antigo = document.querySelector('.item');
const novo = document.createElement('div');

// Substituir elemento por outro(s)
antigo.replaceWith(novo);

// Múltiplos elementos
antigo.replaceWith(
  document.createElement('p'),
  document.createElement('span')
);

// Strings
antigo.replaceWith('Texto substituto');
```

### Limpar Conteúdo

```javascript
const container = document.querySelector('#container');

// Método 1: innerHTML (rápido, mas remove event listeners)
container.innerHTML = '';

// Método 2: textContent (também rápido)
container.textContent = '';

// Método 3: removeChild em loop (preserva referências)
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Método 4: replaceChildren (moderno)
container.replaceChildren(); // Remove todos filhos
```

## 🎯 Clonagem

### cloneNode()

```javascript
const original = document.querySelector('.template');

// Shallow clone (apenas elemento, sem filhos)
const cloneRaso = original.cloneNode(false);

// Deep clone (elemento + todos descendentes)
const cloneProfundo = original.cloneNode(true);

// ⚠️ Event listeners NÃO são clonados
original.addEventListener('click', () => console.log('Click'));
const clone = original.cloneNode(true);
// clone não tem event listener

// ⚠️ IDs são clonados (cuidado com duplicatas)
console.log(clone.id === original.id); // true
```

## 🚀 Modificação de Conteúdo

### textContent vs innerText vs innerHTML

```javascript
const div = document.createElement('div');

// textContent: texto puro (mais rápido)
div.textContent = 'Texto simples';
console.log(div.innerHTML); // 'Texto simples'

// innerHTML: HTML (pode executar scripts se inserido no DOM)
div.innerHTML = '<p>Parágrafo</p><span>Span</span>';
console.log(div.childNodes.length); // 2 (p e span)

// innerText: texto visível (respeita CSS display/visibility)
div.innerText = 'Texto\nCom quebra';
console.log(div.innerHTML); // 'Texto<br>Com quebra'

// ⚠️ innerText dispara reflow (lê estilos computados)
// Preferir textContent para performance
```

### outerHTML

```javascript
const div = document.querySelector('#box');

// Ler HTML completo (incluindo elemento)
console.log(div.outerHTML); // '<div id="box">...</div>'

// Substituir elemento completo
div.outerHTML = '<p>Novo elemento</p>';
// div é removido, p é inserido
// ⚠️ Variável 'div' ainda referencia elemento removido!
```

### Inserir HTML com Segurança

```javascript
// ❌ PERIGOSO: XSS vulnerability
const userInput = '<img src=x onerror="alert(1)">';
div.innerHTML = userInput; // Executa código malicioso!

// ✅ Escapar HTML
function escaparHTML(str) {
  const div = document.createElement('div');
  div.textContent = str; // textContent não interpreta HTML
  return div.innerHTML;
}

const seguro = escaparHTML(userInput);
div.innerHTML = seguro; // Exibe como texto, não executa

// ✅ Usar textContent para texto puro
div.textContent = userInput; // Sempre seguro

// ✅ DOMPurify (biblioteca)
// div.innerHTML = DOMPurify.sanitize(userInput);
```

## ⚠️ Atributos e Propriedades

### Diferença: Atributos vs Propriedades

```javascript
// Atributo (HTML): valor inicial
// Propriedade (DOM): valor atual

const input = document.querySelector('input');

// HTML: <input type="text" value="inicial">

// Atributo (não muda com interação)
console.log(input.getAttribute('value')); // 'inicial'

// Propriedade (muda com interação)
console.log(input.value); // Valor atual (pode ser diferente)

// Usuário digita "novo"
// input.getAttribute('value') // 'inicial' (ainda)
// input.value // 'novo' (atualizado)
```

### setAttribute() / getAttribute()

```javascript
const div = document.createElement('div');

// Definir atributo
div.setAttribute('id', 'meuId');
div.setAttribute('data-index', '5');
div.setAttribute('class', 'box ativo');

// Ler atributo
console.log(div.getAttribute('id')); // 'meuId'
console.log(div.getAttribute('data-index')); // '5'

// Verificar existência
console.log(div.hasAttribute('id')); // true

// Remover atributo
div.removeAttribute('id');
console.log(div.hasAttribute('id')); // false
```

### Propriedades Diretas (Preferível)

```javascript
const div = document.createElement('div');

// ✅ Propriedades: mais rápidas e type-safe
div.id = 'meuId';
div.className = 'box ativo'; // 'class' é palavra reservada
div.title = 'Título';
div.hidden = true; // Boolean

// Ler propriedades
console.log(div.id); // 'meuId'
console.log(div.className); // 'box ativo'

// Data attributes: usar dataset
div.dataset.index = '5';
div.dataset.userId = '123';
console.log(div.dataset.index); // '5'
console.log(div.getAttribute('data-index')); // '5' (equivalente)
```

## 📊 Padrões Práticos

### Construir Elemento Complexo

```javascript
function criarCard(titulo, descricao, imagem) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = imagem;
  img.alt = titulo;

  const corpo = document.createElement('div');
  corpo.className = 'card-body';

  const h3 = document.createElement('h3');
  h3.textContent = titulo;

  const p = document.createElement('p');
  p.textContent = descricao;

  // Montar hierarquia
  corpo.append(h3, p);
  card.append(img, corpo);

  return card;
}

// Uso
const card = criarCard('Título', 'Descrição', 'imagem.jpg');
document.body.appendChild(card);
```

### Template Strings com createElement

```javascript
function criarElementoHTML(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

// Uso
const elemento = criarElementoHTML(`
  <div class="card">
    <h3>Título</h3>
    <p>Conteúdo</p>
  </div>
`);

document.body.appendChild(elemento);
```

### Batch Insertions (Performance)

```javascript
// ❌ Múltiplos reflows
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  document.body.appendChild(div); // Reflow a cada inserção!
}

// ✅ Fragment para batch
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i}`;
  fragment.appendChild(div);
}

document.body.appendChild(fragment); // Um único reflow
```

### Mover Elementos

```javascript
const container1 = document.querySelector('#container1');
const container2 = document.querySelector('#container2');
const elemento = document.querySelector('.item');

// Mover elemento (não clona)
container2.appendChild(elemento);
// elemento é REMOVIDO de container1 e ADICIONADO a container2
```

### Toggle de Elementos

```javascript
function toggleElemento(elemento, mostrar) {
  if (mostrar === undefined) {
    mostrar = elemento.hidden;
  }

  elemento.hidden = !mostrar;
  // Ou: elemento.style.display = mostrar ? 'block' : 'none';
}

const modal = document.querySelector('.modal');
toggleElemento(modal, true);  // Mostrar
toggleElemento(modal, false); // Esconder
toggleElemento(modal);        // Alternar
```

Manipulação eficiente do DOM é crucial para aplicações web dinâmicas, permitindo construção, modificação e remoção de elementos com performance otimizada e segurança contra XSS.
