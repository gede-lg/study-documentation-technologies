# Propriedades

## 1. Introdução Breve

O **Document Object Model (DOM)** é uma representação estruturada de documentos HTML e XML, permitindo que linguagens de programação, como JavaScript, interajam com a estrutura, conteúdo e estilo de uma página web de forma dinâmica. As **propriedades do DOM** são atributos que fornecem acesso a elementos específicos, suas características e estados, permitindo que desenvolvedores leiam e modifiquem esses atributos conforme necessário. Compreender as diversas propriedades do DOM e suas categorias é essencial para criar interfaces web interativas, eficientes e responsivas.

## 2. Sumário

1. [Introdução Breve](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#1-introdu%C3%A7%C3%A3o-breve)
2. [Sumário](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#2-sum%C3%A1rio)
3. [Conteúdo Detalhado](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#3-conte%C3%BAdo-detalhado)
    - [1. Propriedades de Seleção e Navegação](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#1-propriedades-de-sele%C3%A7%C3%A3o-e-navega%C3%A7%C3%A3o)
        - [`document` e `window`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#document-e-window)
        - [`parentNode`, `childNodes`, `children`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#parentnode-childnodes-children)
        - [`firstChild`, `lastChild`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#firstchild-lastchild)
        - [`nextSibling`, `previousSibling`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#nextsibling-previoussibling)
        - [`firstElementChild`, `lastElementChild`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#firstelementchild-lastelementchild)
        - [`nextElementSibling`, `previousElementSibling`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#nextelementsibling-previouselementsibling)
    - [2. Propriedades de Conteúdo](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#2-propriedades-de-conte%C3%BAdo)
        - [`innerHTML`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#innerhtml)
        - [`outerHTML`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#outerhtml)
        - [`textContent`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#textcontent)
        - [`innerText`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#innertext)
        - [`nodeValue`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#nodevalue)
    - [3. Propriedades de Atributos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#3-propriedades-de-atributos)
        - [`id`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#id)
        - [`className` e `classList`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#classname-e-classlist)
        - [`attributes`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#attributes)
        - [`getAttributeNode`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#getattributenode)
        - [`dataset`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#dataset)
    - [4. Propriedades de Estilo e Classes](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#4-propriedades-de-estilo-e-classes)
        - [`style`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#style)
        - [`className` e `classList`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#classname-e-classlist-1)
        - [`hidden`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#hidden)
    - [5. Propriedades de Formulários](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#5-propriedades-de-formul%C3%A1rios)
        - [`value`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#value)
        - [`checked`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#checked)
        - [`selected`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#selected)
        - [`disabled`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#disabled)
        - [`readOnly`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#readonly)
    - [6. Propriedades de Eventos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#6-propriedades-de-eventos)
        - [`onclick`, `onchange`, `onmouseover`, etc.`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#onclick-onchange-onmouseover-etc)
    - [7. Propriedades de Dados e Metadados](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#7-propriedades-de-dados-e-metadados)
        - [`data-*`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#data)
        - [`title`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#title)
        - [`lang`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#lang)
        - [`dir`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#dir)
    - [8. Propriedades de Posição e Dimensões](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#8-propriedades-de-posi%C3%A7%C3%A3o-e-dimens%C3%B5es)
        - [`offsetParent`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#offsetparent)
        - [`offsetTop`, `offsetLeft`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#offsettop-offsetleft)
        - [`clientWidth`, `clientHeight`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#clientwidth-clientheight)
        - [`scrollWidth`, `scrollHeight`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#scrollwidth-scrollheight)
    - [9. Propriedades de Formatação e Semântica](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#9-propriedades-de-formata%C3%A7%C3%A3o-e-sem%C3%A2ntica)
        - [`role`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#role)
        - [`aria-*`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#aria)
    - [10. Propriedades de Acessibilidade](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#10-propriedades-de-acessibilidade)
        - [`tabIndex`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#tabindex)
        - [`aria-label`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#aria-label)
    - [11. Propriedades de Navegação e Histórico](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#11-propriedades-de-navega%C3%A7%C3%A3o-e-hist%C3%B3rico)
        - [`window.location`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#windowlocation)
        - [`window.history`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#windowhistory)
    - [12. Propriedades de Manipulação de Documentos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#12-propriedades-de-manipula%C3%A7%C3%A3o-de-documentos)
        - [`document.title`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#documenttitle)
        - [`document.URL`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#documenturl)
        - [`document.cookie`](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#documentcookie)
4. [Exemplos de Código Otimizados](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#4-exemplos-de-c%C3%B3digo-otimizados)
    - [1. Propriedades de Seleção e Navegação: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#1-propriedades-de-sele%C3%A7%C3%A3o-e-navega%C3%A7%C3%A3o-exemplos)
    - [2. Propriedades de Conteúdo: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#2-propriedades-de-conte%C3%BAdo-exemplos)
    - [3. Propriedades de Atributos: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#3-propriedades-de-atributos-exemplos)
    - [4. Propriedades de Estilo e Classes: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#4-propriedades-de-estilo-e-classes-exemplos)
    - [5. Propriedades de Formulários: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#5-propriedades-de-formul%C3%A1rios-exemplos)
    - [6. Propriedades de Eventos: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#6-propriedades-de-eventos-exemplos)
    - [7. Propriedades de Dados e Metadados: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#7-propriedades-de-dados-e-metadados-exemplos)
    - [8. Propriedades de Posição e Dimensões: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#8-propriedades-de-posi%C3%A7%C3%A3oe-dimens%C3%B5es-exemplos)
    - [9. Propriedades de Formatação e Semântica: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#9-propriedades-de-formata%C3%A7%C3%A3o-e-sem%C3%A2ntica-exemplos)
    - [10. Propriedades de Acessibilidade: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#10-propriedades-de-acessibilidade-exemplos)
    - [11. Propriedades de Navegação e Histórico: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#11-propriedades-de-navega%C3%A7%C3%A3o-e-hist%C3%B3rico-exemplos)
    - [12. Propriedades de Manipulação de Documentos: Exemplos](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#12-propriedades-de-manipula%C3%A7%C3%A3o-de-documentos-exemplos)
5. [Informações Adicionais](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#5-informa%C3%A7%C3%B5es-adicionais)
    - [Performance e Otimização](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#performance-e-otimiza%C3%A7%C3%A3o)
    - [Compatibilidade entre Navegadores](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#compatibilidade-entre-navegadores)
    - [Boas Práticas](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#boas-pr%C3%A1ticas)
6. [Referências para Estudo Independente](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#6-refer%C3%AAncias-para-estudo-independente)
7. [Conclusão](https://chatgpt.com/c/6786701a-21a8-8003-913b-5213392ca8d9#7-conclus%C3%A3o)

## 3. Conteúdo Detalhado

### 1. Propriedades de Seleção e Navegação

As propriedades de seleção e navegação permitem acessar e navegar pela estrutura da árvore DOM, facilitando a localização e a manipulação de elementos específicos.

### `document` e `window`

- **`document`**
    
    Representa o documento carregado na janela do navegador. Fornece acesso a todos os elementos e estruturas do documento.
    
    **Exemplo:**
    
    ```jsx
    console.log(document.title); // Imprime o título da página
    
    ```
    
- **`window`**
    
    Representa a janela do navegador que contém o documento. Inclui propriedades e métodos relacionados à visualização, tamanho e histórico da janela.
    
    **Exemplo:**
    
    ```jsx
    console.log(window.innerWidth); // Imprime a largura interna da janela
    
    ```
    

### `parentNode`, `childNodes`, `children`

- **`parentNode`**
    
    Retorna o nó pai de um elemento.
    
    **Exemplo:**
    
    ```jsx
    const item = document.querySelector('.item');
    const pai = item.parentNode;
    console.log(pai);
    
    ```
    
- **`childNodes`**
    
    Retorna uma NodeList de todos os nós filhos, incluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const lista = document.getElementById('lista');
    const filhos = lista.childNodes;
    filhos.forEach(nodo => console.log(nodo));
    
    ```
    
- **`children`**
    
    Retorna uma HTMLCollection de elementos filhos, excluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const lista = document.getElementById('lista');
    const elementosFilhos = lista.children;
    Array.from(elementosFilhos).forEach(el => console.log(el));
    
    ```
    

### `firstChild`, `lastChild`

- **`firstChild`**
    
    Retorna o primeiro nó filho de um elemento, incluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const lista = document.getElementById('lista');
    const primeiro = lista.firstChild;
    console.log(primeiro);
    
    ```
    
- **`lastChild`**
    
    Retorna o último nó filho de um elemento, incluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const lista = document.getElementById('lista');
    const ultimo = lista.lastChild;
    console.log(ultimo);
    
    ```
    

### `nextSibling`, `previousSibling`

- **`nextSibling`**
    
    Retorna o próximo nó irmão no DOM, incluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const item = document.querySelector('.item');
    const próximo = item.nextSibling;
    console.log(próximo);
    
    ```
    
- **`previousSibling`**
    
    Retorna o nó irmão anterior no DOM, incluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const item = document.querySelector('.item');
    const anterior = item.previousSibling;
    console.log(anterior);
    
    ```
    

### `firstElementChild`, `lastElementChild`

- **`firstElementChild`**
    
    Retorna o primeiro elemento filho de um elemento, excluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const lista = document.getElementById('lista');
    const primeiroElemento = lista.firstElementChild;
    console.log(primeiroElemento);
    
    ```
    
- **`lastElementChild`**
    
    Retorna o último elemento filho de um elemento, excluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const lista = document.getElementById('lista');
    const ultimoElemento = lista.lastElementChild;
    console.log(ultimoElemento);
    
    ```
    

### `nextElementSibling`, `previousElementSibling`

- **`nextElementSibling`**
    
    Retorna o próximo elemento irmão, excluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const item = document.querySelector('.item');
    const próximoElemento = item.nextElementSibling;
    console.log(próximoElemento);
    
    ```
    
- **`previousElementSibling`**
    
    Retorna o elemento irmão anterior, excluindo nós de texto e comentários.
    
    **Exemplo:**
    
    ```jsx
    const item = document.querySelector('.item');
    const anteriorElemento = item.previousElementSibling;
    console.log(anteriorElemento);
    
    ```
    

### 2. Propriedades de Conteúdo

Essas propriedades permitem acessar e modificar o conteúdo interno ou externo de elementos no DOM.

### `innerHTML`

- **Descrição:**
    
    Obtém ou define o conteúdo HTML interno de um elemento.
    
- **Sintaxe:**
    
    ```jsx
    const html = elemento.innerHTML;
    elemento.innerHTML = '<p>Novo conteúdo</p>';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const conteudo = document.getElementById('conteudo');
    console.log(conteudo.innerHTML); // Exibe o HTML interno
    conteudo.innerHTML = '<p>Conteúdo Atualizado</p>'; // Atualiza o HTML interno
    
    ```
    

### `outerHTML`

- **Descrição:**
    
    Obtém ou define o conteúdo HTML externo de um elemento, incluindo o próprio elemento.
    
- **Sintaxe:**
    
    ```jsx
    const htmlExterno = elemento.outerHTML;
    elemento.outerHTML = '<div>Novo Elemento</div>';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const paragrafo = document.getElementById('parag');
    console.log(paragrafo.outerHTML); // Exibe o HTML externo
    paragrafo.outerHTML = '<div id="parag">Novo Div</div>'; // Substitui o parágrafo por uma div
    
    ```
    

### `textContent`

- **Descrição:**
    
    Obtém ou define o conteúdo de texto de um elemento, ignorando qualquer HTML.
    
- **Sintaxe:**
    
    ```jsx
    const texto = elemento.textContent;
    elemento.textContent = 'Novo Texto';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const titulo = document.getElementById('titulo');
    console.log(titulo.textContent); // Exibe o texto do título
    titulo.textContent = 'Título Atualizado'; // Atualiza o texto do título
    
    ```
    

### `innerText`

- **Descrição:**
    
    Similar a `textContent`, mas leva em consideração estilos CSS e não inclui texto oculto.
    
- **Sintaxe:**
    
    ```jsx
    const textoVisível = elemento.innerText;
    elemento.innerText = 'Texto Visível Atualizado';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const paragrafo = document.getElementById('parag');
    console.log(paragrafo.innerText); // Exibe o texto visível
    paragrafo.innerText = 'Parágrafo Atualizado'; // Atualiza o texto visível
    
    ```
    

### `nodeValue`

- **Descrição:**
    
    Obtém ou define o valor de um nó de texto ou atributo. Para elementos, geralmente retorna `null`.
    
- **Sintaxe:**
    
    ```jsx
    const valor = nodo.nodeValue;
    nodo.nodeValue = 'Novo Valor';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const texto = document.createTextNode('Texto Original');
    console.log(texto.nodeValue); // Exibe 'Texto Original'
    texto.nodeValue = 'Texto Atualizado'; // Atualiza o valor do nó de texto
    
    ```
    

### 3. Propriedades de Atributos

Essas propriedades permitem acessar e modificar os atributos de elementos no DOM, como IDs, classes, fontes e outros atributos personalizados.

### `id`

- **Descrição:**
    
    Obtém ou define o atributo `id` de um elemento. O `id` deve ser único dentro do documento.
    
- **Sintaxe:**
    
    ```jsx
    const idAtual = elemento.id;
    elemento.id = 'novo-id';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const botão = document.getElementById('botao');
    console.log(botão.id); // Exibe 'botao'
    botão.id = 'novo-botao'; // Atualiza o ID do botão
    
    ```
    

### `className` e `classList`

- **`className`**
    
    Obtém ou define a lista completa de classes de um elemento como uma string.
    
    **Sintaxe:**
    
    ```jsx
    const classes = elemento.className;
    elemento.className = 'nova-classe';
    
    ```
    
    **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    console.log(caixa.className); // Exibe 'classe1 classe2'
    caixa.className = 'classe3'; // Define uma nova classe
    
    ```
    
- **`classList`**
    
    Retorna um objeto DOMTokenList que representa a lista de classes de um elemento, permitindo manipulação mais granular.
    
    **Sintaxe:**
    
    ```jsx
    elemento.classList.add('nova-classe');
    elemento.classList.remove('classe-existente');
    const possui = elemento.classList.contains('classe');
    
    ```
    
    **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    caixa.classList.add('ativo'); // Adiciona a classe 'ativo'
    caixa.classList.remove('inativo'); // Remove a classe 'inativo'
    console.log(caixa.classList.contains('ativo')); // Verifica se possui 'ativo'
    
    ```
    

### `attributes`

- **Descrição:**
    
    Retorna uma NamedNodeMap contendo todos os atributos de um elemento.
    
- **Sintaxe:**
    
    ```jsx
    const attrs = elemento.attributes;
    Array.from(attrs).forEach(attr => console.log(attr.name, attr.value));
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const link = document.querySelector('a');
    const atributos = link.attributes;
    Array.from(atributos).forEach(attr => {
        console.log(`${attr.name} = ${attr.value}`);
    });
    
    ```
    

### `getAttributeNode`

- **Descrição:**
    
    Retorna um objeto Attr representando um atributo específico de um elemento.
    
- **Sintaxe:**
    
    ```jsx
    const atributo = elemento.getAttributeNode('nome');
    console.log(atributo.value);
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const imagem = document.querySelector('img');
    const srcAttr = imagem.getAttributeNode('src');
    console.log(srcAttr.value); // Exibe o valor do atributo 'src'
    
    ```
    

### `dataset`

- **Descrição:**
    
    Fornece acesso a todos os atributos `data-*` de um elemento como um objeto.
    
- **Sintaxe:**
    
    ```jsx
    const dados = elemento.dataset;
    console.log(dados.nome); // Acessa 'data-nome'
    elemento.dataset.idade = '30'; // Define 'data-idade'
    
    ```
    
- **Exemplo:**
    
    ```html
    <div id="info" data-usuario="joao" data-idade="25"></div>
    
    ```
    
    ```jsx
    const info = document.getElementById('info');
    console.log(info.dataset.usuario); // Exibe 'joao'
    console.log(info.dataset.idade); // Exibe '25'
    info.dataset.idade = '26'; // Atualiza 'data-idade' para '26'
    
    ```
    

### 4. Propriedades de Estilo e Classes

Essas propriedades permitem acessar e modificar os estilos CSS e as classes atribuídas aos elementos, facilitando a manipulação visual dos componentes da página.

### `style`

- **Descrição:**
    
    Permite acesso direto aos estilos CSS inline de um elemento. Pode ser usado para ler ou definir propriedades de estilo específicas.
    
- **Sintaxe:**
    
    ```jsx
    const cor = elemento.style.color;
    elemento.style.backgroundColor = 'blue';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const botão = document.getElementById('botao');
    botão.style.backgroundColor = 'green'; // Define a cor de fundo
    botão.style.padding = '10px'; // Define o padding
    
    ```
    

### `className` e `classList`

- **`className`**
    
    (Já abordado na seção anterior)
    
- **`classList`**
    
    (Já abordado na seção anterior)
    

### `hidden`

- **Descrição:**
    
    Booleano que indica se o elemento está oculto. Define o atributo `hidden` do elemento.
    
- **Sintaxe:**
    
    ```jsx
    elemento.hidden = true; // Oculta o elemento
    elemento.hidden = false; // Exibe o elemento
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const mensagem = document.getElementById('mensagem');
    mensagem.hidden = true; // Oculta a mensagem
    setTimeout(() => {
        mensagem.hidden = false; // Exibe a mensagem após 3 segundos
    }, 3000);
    
    ```
    

### 5. Propriedades de Formulários

Essas propriedades são específicas para elementos de formulário, permitindo acessar e modificar os valores, estados e comportamentos dos campos de entrada.

### `value`

- **Descrição:**
    
    Obtém ou define o valor de um campo de formulário, como `<input>`, `<textarea>` ou `<select>`.
    
- **Sintaxe:**
    
    ```jsx
    const valor = elemento.value;
    elemento.value = 'Novo Valor';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const inputEmail = document.getElementById('email');
    console.log(inputEmail.value); // Exibe o valor atual
    inputEmail.value = 'usuario@exemplo.com'; // Define um novo valor
    
    ```
    

### `checked`

- **Descrição:**
    
    Booleano que indica se um checkbox ou radio button está marcado.
    
- **Sintaxe:**
    
    ```jsx
    const estáMarcado = elemento.checked;
    elemento.checked = true; // Marca o checkbox
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const checkbox = document.getElementById('aceitar');
    console.log(checkbox.checked); // Exibe se está marcado
    checkbox.checked = true; // Marca o checkbox
    
    ```
    

### `selected`

- **Descrição:**
    
    Booleano que indica se uma opção de `<select>` está selecionada.
    
- **Sintaxe:**
    
    ```jsx
    const estáSelecionado = elemento.selected;
    elemento.selected = true; // Seleciona a opção
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const opcao = document.querySelector('option[value="opcao2"]');
    console.log(opcao.selected); // Exibe se está selecionada
    opcao.selected = true; // Seleciona a opção
    
    ```
    

### `disabled`

- **Descrição:**
    
    Booleano que indica se um elemento de formulário está desabilitado.
    
- **Sintaxe:**
    
    ```jsx
    elemento.disabled = true; // Desabilita o elemento
    elemento.disabled = false; // Habilita o elemento
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const botãoEnviar = document.getElementById('enviar');
    botãoEnviar.disabled = true; // Desabilita o botão
    
    ```
    

### `readOnly`

- **Descrição:**
    
    Booleano que indica se um campo de entrada é somente leitura.
    
- **Sintaxe:**
    
    ```jsx
    elemento.readOnly = true; // Torna o campo somente leitura
    elemento.readOnly = false; // Permite edição
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const inputNome = document.getElementById('nome');
    inputNome.readOnly = true; // Torna o campo somente leitura
    
    ```
    

### 6. Propriedades de Eventos

Essas propriedades são usadas para associar manipuladores de eventos diretamente a elementos, facilitando a resposta a interações do usuário.

### `onclick`, `onchange`, `onmouseover`, etc.

- **Descrição:**
    
    Propriedades que permitem atribuir funções manipuladoras para eventos específicos, como cliques, mudanças, mouseover, entre outros.
    
- **Sintaxe:**
    
    ```jsx
    elemento.onclick = function() {
        // Ação a ser executada quando o elemento é clicado
    };
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const botão = document.getElementById('botao');
    botão.onclick = function() {
        alert('Botão clicado!');
    };
    
    const input = document.getElementById('input');
    input.onchange = function() {
        console.log('Valor alterado para:', input.value);
    };
    
    ```
    

### 7. Propriedades de Dados e Metadados

Essas propriedades permitem acessar e modificar dados e metadados associados a elementos, como atributos personalizados e informações de idioma.

### `data-*`

- **Descrição:**
    
    Permite armazenar dados personalizados em elementos através de atributos `data-*`. Acessível via a propriedade `dataset`.
    
- **Sintaxe:**
    
    ```jsx
    const valor = elemento.dataset.nome; // Acessa 'data-nome'
    elemento.dataset.idade = '30'; // Define 'data-idade'
    
    ```
    
- **Exemplo:**
    
    ```html
    <div id="produto" data-id="123" data-preco="49.99"></div>
    
    ```
    
    ```jsx
    const produto = document.getElementById('produto');
    console.log(produto.dataset.id); // Exibe '123'
    console.log(produto.dataset.preco); // Exibe '49.99'
    produto.dataset.estoque = 'Disponível'; // Define 'data-estoque'
    
    ```
    

### `title`

- **Descrição:**
    
    Obtém ou define o texto exibido como dica (tooltip) quando o mouse passa sobre o elemento.
    
- **Sintaxe:**
    
    ```jsx
    const dica = elemento.title;
    elemento.title = 'Nova dica';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const ícone = document.getElementById('icone-info');
    console.log(ícone.title); // Exibe a dica atual
    ícone.title = 'Mais informações disponíveis'; // Atualiza a dica
    
    ```
    

### `lang`

- **Descrição:**
    
    Especifica o idioma do conteúdo de um elemento.
    
- **Sintaxe:**
    
    ```jsx
    const idioma = elemento.lang;
    elemento.lang = 'en'; // Define o idioma para inglês
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const paragrafo = document.getElementById('parag');
    console.log(paragrafo.lang); // Exibe o idioma atual
    paragrafo.lang = 'fr'; // Define o idioma para francês
    
    ```
    

### `dir`

- **Descrição:**
    
    Define a direção do texto no elemento (`ltr` para da esquerda para a direita, `rtl` para da direita para a esquerda).
    
- **Sintaxe:**
    
    ```jsx
    const direcao = elemento.dir;
    elemento.dir = 'rtl'; // Define a direção para da direita para a esquerda
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const texto = document.getElementById('texto');
    texto.dir = 'rtl'; // Altera a direção do texto
    
    ```
    

### 8. Propriedades de Posição e Dimensões

Essas propriedades fornecem informações sobre a posição e as dimensões dos elementos na página, úteis para cálculos de layout e interações baseadas na posição.

### `offsetParent`

- **Descrição:**
    
    Retorna o elemento pai usado para calcular as posições relativas (`offsetTop`, `offsetLeft`).
    
- **Sintaxe:**
    
    ```jsx
    const paiOffset = elemento.offsetParent;
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    const pai = caixa.offsetParent;
    console.log(pai);
    
    ```
    

### `offsetTop`, `offsetLeft`

- **Descrição:**
    
    Retorna a posição superior ou esquerda do elemento em relação ao seu elemento pai offset.
    
- **Sintaxe:**
    
    ```jsx
    const topo = elemento.offsetTop;
    const esquerda = elemento.offsetLeft;
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    console.log(`Top: ${caixa.offsetTop}, Left: ${caixa.offsetLeft}`);
    
    ```
    

### `clientWidth`, `clientHeight`

- **Descrição:**
    
    Retorna a largura e altura visíveis de um elemento, incluindo padding, mas excluindo bordas, barras de rolagem e margens.
    
- **Sintaxe:**
    
    ```jsx
    const largura = elemento.clientWidth;
    const altura = elemento.clientHeight;
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    console.log(`Largura: ${caixa.clientWidth}, Altura: ${caixa.clientHeight}`);
    
    ```
    

### `scrollWidth`, `scrollHeight`

- **Descrição:**
    
    Retorna a largura e altura total de um elemento, incluindo conteúdo não visível devido à rolagem.
    
- **Sintaxe:**
    
    ```jsx
    const larguraScroll = elemento.scrollWidth;
    const alturaScroll = elemento.scrollHeight;
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    console.log(`Scroll Width: ${caixa.scrollWidth}, Scroll Height: ${caixa.scrollHeight}`);
    
    ```
    

### 9. Propriedades de Formatação e Semântica

Essas propriedades auxiliam na definição de papéis semânticos e formatação específica, melhorando a acessibilidade e a compreensão do conteúdo pelo navegador e leitores de tela.

### `role`

- **Descrição:**
    
    Define o papel semântico de um elemento, útil para tecnologias assistivas.
    
- **Sintaxe:**
    
    ```jsx
    elemento.role = 'button';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const divBotao = document.getElementById('divBotao');
    divBotao.role = 'button'; // Define o papel como botão
    
    ```
    

### `aria-*`

- **Descrição:**
    
    Atributos `aria-*` fornecem informações adicionais sobre elementos para tecnologias assistivas, melhorando a acessibilidade.
    
- **Sintaxe:**
    
    ```jsx
    elemento.setAttribute('aria-label', 'Fechar');
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const íconeFechar = document.getElementById('fechar');
    íconeFechar.setAttribute('aria-label', 'Fechar janela');
    
    ```
    

### 10. Propriedades de Acessibilidade

Essas propriedades garantem que o conteúdo da página seja acessível a todos os usuários, incluindo aqueles que utilizam tecnologias assistivas.

### `tabIndex`

- **Descrição:**
    
    Define a ordem de tabulação para elementos interativos, permitindo a navegação por teclado.
    
- **Sintaxe:**
    
    ```jsx
    elemento.tabIndex = 0; // Tornar focável
    elemento.tabIndex = -1; // Remover da ordem de tabulação
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const link = document.getElementById('link');
    link.tabIndex = 0; // Permite focar o link via teclado
    
    ```
    

### `aria-label`

- **Descrição:**
    
    Fornece um rótulo acessível para elementos que não possuem texto visível.
    
- **Sintaxe:**
    
    ```jsx
    elemento.setAttribute('aria-label', 'Descrição do Elemento');
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const íconePesquisar = document.getElementById('pesquisar');
    íconePesquisar.setAttribute('aria-label', 'Pesquisar');
    
    ```
    

### 11. Propriedades de Navegação e Histórico

Essas propriedades permitem interagir com a navegação do usuário e o histórico do navegador, facilitando a criação de experiências de navegação mais controladas e personalizadas.

### `window.location`

- **Descrição:**
    
    Representa a URL atual da janela e fornece métodos para redirecionamento e atualização da página.
    
- **Sintaxe:**
    
    ```jsx
    const urlAtual = window.location.href;
    window.location.href = 'https://novo-site.com'; // Redireciona para um novo site
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const botaoRedirecionar = document.getElementById('redirecionar');
    botaoRedirecionar.addEventListener('click', () => {
        window.location.href = 'https://novo-site.com';
    });
    
    ```
    

### `window.history`

- **Descrição:**
    
    Permite manipular o histórico de navegação do usuário, facilitando a implementação de navegação sem recarregar a página.
    
- **Sintaxe:**
    
    ```jsx
    window.history.back(); // Navega para a página anterior
    window.history.forward(); // Navega para a próxima página no histórico
    window.history.pushState({estado: 'novo'}, 'Título', '/nova-pagina');
    
    ```
    
- **Exemplo:**
    
    ```jsx
    const botaoVoltar = document.getElementById('voltar');
    botaoVoltar.addEventListener('click', () => {
        window.history.back();
    });
    
    const botaoAvancar = document.getElementById('avancar');
    botaoAvancar.addEventListener('click', () => {
        window.history.forward();
    });
    
    ```
    

### 12. Propriedades de Manipulação de Documentos

Essas propriedades fornecem acesso a informações gerais sobre o documento e permitem modificações em nível global.

### `document.title`

- **Descrição:**
    
    Obtém ou define o título do documento, exibido na aba do navegador.
    
- **Sintaxe:**
    
    ```jsx
    const titulo = document.title;
    document.title = 'Novo Título';
    
    ```
    
- **Exemplo:**
    
    ```jsx
    console.log(document.title); // Exibe o título atual
    document.title = 'Página Atualizada'; // Atualiza o título da página
    
    ```
    

### `document.URL`

- **Descrição:**
    
    Retorna a URL completa do documento atual.
    
- **Sintaxe:**
    
    ```jsx
    const url = document.URL;
    console.log(url);
    
    ```
    
- **Exemplo:**
    
    ```jsx
    console.log(document.URL); // Exibe a URL atual
    
    ```
    

### `document.cookie`

- **Descrição:**
    
    Permite acessar e modificar os cookies associados ao documento.
    
- **Sintaxe:**
    
    ```jsx
    document.cookie = "usuario=joao; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    const cookies = document.cookie;
    console.log(cookies);
    
    ```
    
- **Exemplo:**
    
    ```jsx
    // Definir um cookie
    document.cookie = "nome=Maria; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";
    
    // Ler os cookies
    console.log(document.cookie); // Exibe 'nome=Maria'
    
    ```
    

## 4. Exemplos de Código Otimizados

### 1. Propriedades de Seleção e Navegação: Exemplos

**Exemplo 1: Navegando pela Estrutura DOM**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Navegação DOM</title>
</head>
<body>
    <div id="container">
        <ul id="lista">
            <li class="item">Item 1</li>
            <li class="item">Item 2</li>
            <li class="item">Item 3</li>
        </ul>
    </div>
    <script>
        const lista = document.getElementById('lista');
        const primeiroItem = lista.firstElementChild;
        console.log('Primeiro Item:', primeiroItem.textContent);

        const ultimoItem = lista.lastElementChild;
        console.log('Último Item:', ultimoItem.textContent);

        const container = lista.parentNode;
        console.log('Container:', container.id);
    </script>
</body>
</html>

```

### 2. Propriedades de Conteúdo: Exemplos

**Exemplo 2: Manipulando Conteúdo HTML e Texto**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Conteúdo</title>
</head>
<body>
    <div id="conteudo">
        <p>Parágrafo Original</p>
    </div>
    <script>
        const conteudo = document.getElementById('conteudo');

        // Modificar innerHTML
        conteudo.innerHTML += '<p>Parágrafo Adicionado via innerHTML</p>';

        // Modificar textContent
        const novoParagrafo = document.createElement('p');
        novoParagrafo.textContent = 'Parágrafo Adicionado via textContent';
        conteudo.appendChild(novoParagrafo);

        // Modificar outerHTML
        const paragrafo = conteudo.querySelector('p');
        paragrafo.outerHTML = '<div>Div Substituindo Parágrafo</div>';
    </script>
</body>
</html>

```

### 3. Propriedades de Atributos: Exemplos

**Exemplo 3: Manipulando Atributos de Elementos**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Atributos</title>
</head>
<body>
    <img id="imagem" src="imagem1.png" alt="Imagem 1">
    <script>
        const imagem = document.getElementById('imagem');

        // Acessar atributos
        console.log(imagem.src); // URL completa da imagem
        console.log(imagem.alt); // 'Imagem 1'

        // Modificar atributos
        imagem.src = 'imagem2.png';
        imagem.alt = 'Imagem 2';

        // Usando dataset
        imagem.dataset.descricao = 'Esta é uma imagem atualizada';
        console.log(imagem.dataset.descricao);
    </script>
</body>
</html>

```

### 4. Propriedades de Estilo e Classes: Exemplos

**Exemplo 4: Manipulando Estilos e Classes**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Estilos e Classes</title>
    <style>
        .ativo { background-color: green; }
        .inativo { background-color: red; }
    </style>
</head>
<body>
    <div id="caixa" class="inativo">Caixa</div>
    <button id="toggle">Alternar Classe</button>
    <script>
        const caixa = document.getElementById('caixa');
        const botão = document.getElementById('toggle');

        botão.onclick = function() {
            caixa.classList.toggle('ativo');
            caixa.classList.toggle('inativo');
        };

        // Manipulando estilo diretamente
        caixa.style.border = '2px solid black';
    </script>
</body>
</html>

```

### 5. Propriedades de Formulários: Exemplos

**Exemplo 5: Gerenciando Campos de Formulário**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Formulário</title>
</head>
<body>
    <form id="formulario">
        <input type="text" id="nome" placeholder="Nome">
        <input type="checkbox" id="aceitar"> Aceitar termos
        <select id="opcao">
            <option value="1">Opção 1</option>
            <option value="2">Opção 2</option>
        </select>
        <button type="submit">Enviar</button>
    </form>
    <script>
        const formulario = document.getElementById('formulario');
        const nome = document.getElementById('nome');
        const aceitar = document.getElementById('aceitar');
        const opcao = document.getElementById('opcao');

        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Nome:', nome.value);
            console.log('Aceitou:', aceitar.checked);
            console.log('Opção selecionada:', opcao.value);
        });

        // Definindo valores programaticamente
        nome.value = 'João Silva';
        aceitar.checked = true;
        opcao.value = '2';
    </script>
</body>
</html>

```

### 6. Propriedades de Eventos: Exemplos

**Exemplo 6: Associando Eventos com Propriedades**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Eventos</title>
</head>
<body>
    <button id="botao">Clique-me</button>
    <script>
        const botão = document.getElementById('botao');

        // Associando evento via propriedade
        botão.onclick = function() {
            alert('Botão clicado!');
        };

        // Substituindo o manipulador de evento
        setTimeout(() => {
            botão.onclick = function() {
                alert('Novo manipulador de evento!');
            };
        }, 5000);
    </script>
</body>
</html>

```

### 7. Propriedades de Dados e Metadados: Exemplos

**Exemplo 7: Utilizando `data-*` e `dataset`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Data Attributes</title>
</head>
<body>
    <div id="produto" data-id="101" data-preco="29.99"></div>
    <script>
        const produto = document.getElementById('produto');

        // Acessando dados via dataset
        console.log(`ID: ${produto.dataset.id}`); // Exibe '101'
        console.log(`Preço: ${produto.dataset.preco}`); // Exibe '29.99'

        // Definindo novos dados
        produto.dataset.estoque = 'Em estoque';
        console.log(`Estoque: ${produto.dataset.estoque}`); // Exibe 'Em estoque'
    </script>
</body>
</html>

```

### 8. Propriedades de Posição e Dimensões: Exemplos

**Exemplo 8: Acessando Posição e Dimensões de Elementos**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Posição e Dimensões</title>
    <style>
        #caixa {
            width: 200px;
            height: 100px;
            background-color: lightblue;
            margin: 50px;
        }
    </style>
</head>
<body>
    <div id="caixa"></div>
    <script>
        const caixa = document.getElementById('caixa');

        console.log('Offset Parent:', caixa.offsetParent.id);
        console.log('Offset Top:', caixa.offsetTop);
        console.log('Offset Left:', caixa.offsetLeft);

        console.log('Client Width:', caixa.clientWidth);
        console.log('Client Height:', caixa.clientHeight);

        console.log('Scroll Width:', caixa.scrollWidth);
        console.log('Scroll Height:', caixa.scrollHeight);
    </script>
</body>
</html>

```

### 9. Propriedades de Formatação e Semântica: Exemplos

**Exemplo 9: Definindo Papéis Semânticos e ARIA Labels**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Semântica e Acessibilidade</title>
</head>
<body>
    <div id="botaoCustomizado" role="button" tabindex="0" aria-label="Fechar janela"></div>
    <script>
        const botao = document.getElementById('botaoCustomizado');

        botao.onclick = function() {
            alert('Botão Customizado Clicado!');
        };

        // Adicionando estilos via JavaScript para visualizar o botão
        botao.style.width = '100px';
        botao.style.height = '50px';
        botao.style.backgroundColor = 'red';
        botao.style.cursor = 'pointer';
    </script>
</body>
</html>

```

### 10. Propriedades de Acessibilidade: Exemplos

**Exemplo 10: Melhorando Acessibilidade com `tabIndex` e `aria-label`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Acessibilidade</title>
</head>
<body>
    <div id="caixa" tabindex="0" aria-label="Caixa Interativa"></div>
    <script>
        const caixa = document.getElementById('caixa');

        // Estilizando a caixa para visualização
        caixa.style.width = '150px';
        caixa.style.height = '150px';
        caixa.style.backgroundColor = 'lightgreen';
        caixa.style.border = '2px solid black';

        // Adicionando foco via teclado
        caixa.addEventListener('focus', () => {
            caixa.style.borderColor = 'blue';
        });

        caixa.addEventListener('blur', () => {
            caixa.style.borderColor = 'black';
        });
    </script>
</body>
</html>

```

### 11. Propriedades de Navegação e Histórico: Exemplos

**Exemplo 11: Manipulando Navegação e Histórico**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Navegação e Histórico</title>
</head>
<body>
    <button id="adicionarEstado">Adicionar Estado</button>
    <button id="voltar">Voltar</button>
    <button id="avancar">Avançar</button>
    <script>
        const adicionarEstado = document.getElementById('adicionarEstado');
        const voltar = document.getElementById('voltar');
        const avancar = document.getElementById('avancar');

        adicionarEstado.onclick = function() {
            const estado = { pagina: 'nova' };
            const titulo = 'Nova Página';
            const url = '/nova-pagina';
            window.history.pushState(estado, titulo, url);
            console.log('Estado adicionado:', estado);
        };

        voltar.onclick = function() {
            window.history.back();
        };

        avancar.onclick = function() {
            window.history.forward();
        };

        // Lidar com alterações no estado
        window.onpopstate = function(event) {
            console.log('Estado atual:', event.state);
        };
    </script>
</body>
</html>

```

### 12. Propriedades de Manipulação de Documentos: Exemplos

**Exemplo 12: Acessando e Modificando Propriedades do Documento**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Exemplo de Propriedades do Documento</title>
</head>
<body>
    <script>
        // Acessando título e URL
        console.log('Título:', document.title);
        console.log('URL:', document.URL);

        // Modificando título
        document.title = 'Título Atualizado do Documento';
        console.log('Novo Título:', document.title);

        // Trabalhando com cookies
        document.cookie = "usuario=joao; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";
        console.log('Cookies:', document.cookie);
    </script>
</body>
</html>

```

## 5. Informações Adicionais

### Performance e Otimização

- **Minimize Reflows e Repaints:**
    - Alterações frequentes nas propriedades que afetam o layout ou o estilo podem causar reflows e repaints, impactando a performance. Agrupe mudanças e aplique-as de uma vez sempre que possível.
    
    **Exemplo:**
    
    ```jsx
    const caixa = document.getElementById('caixa');
    
    // Ineficiente: múltiplas alterações que causam reflows
    caixa.style.width = '200px';
    caixa.style.height = '200px';
    caixa.style.backgroundColor = 'blue';
    
    // Otimizado: usa batch updates
    caixa.style.cssText += 'width: 200px; height: 200px; background-color: blue;';
    
    ```
    
- **Uso de `DocumentFragment`:**
    - Utilize `DocumentFragment` para construir partes do DOM fora da árvore principal, reduzindo operações de reflow.
    
    **Exemplo:**
    
    ```jsx
    const fragmento = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
        const li = document.createElement('li');
        li.textContent = `Item ${i}`;
        fragmento.appendChild(li);
    }
    document.getElementById('lista').appendChild(fragmento);
    
    ```
    
- **Evite Seleções Repetidas:**
    - Armazene referências a elementos que serão reutilizados para evitar chamadas repetidas ao DOM.
    
    **Exemplo:**
    
    ```jsx
    // Ineficiente
    document.getElementById('botao').addEventListener('click', () => {
        document.getElementById('caixa').classList.toggle('ativo');
    });
    
    // Otimizado
    const botão = document.getElementById('botao');
    const caixa = document.getElementById('caixa');
    botão.addEventListener('click', () => {
        caixa.classList.toggle('ativo');
    });
    
    ```
    

### Compatibilidade entre Navegadores

- **Verifique Suporte de Propriedades:**
    - Embora a maioria das propriedades do DOM seja amplamente suportada nos navegadores modernos, é importante verificar a compatibilidade com versões mais antigas, especialmente para propriedades mais recentes.
- **Use Polyfills Quando Necessário:**
    - Implemente polyfills para propriedades não suportadas em alguns navegadores.
    
    **Exemplo de Polyfill para `classList`:**
    
    ```jsx
    if (!('classList' in document.documentElement)) {
        Object.defineProperty(Element.prototype, 'classList', {
            get: function() {
                var self = this;
                function add(cls) {
                    if (!self.className.includes(cls)) {
                        self.className += ' ' + cls;
                    }
                }
                function remove(cls) {
                    self.className = self.className.replace(new RegExp('(?:^|\\s)' + cls + '(?!\\S)', 'g'), '');
                }
                function toggle(cls) {
                    if (self.className.includes(cls)) {
                        remove(cls);
                    } else {
                        add(cls);
                    }
                }
                return {
                    add,
                    remove,
                    toggle
                };
            }
        });
    }
    
    ```
    

### Boas Práticas

- **Evite Manipulações Excessivas do DOM:**
    - Manipulações frequentes podem impactar a performance. Utilize técnicas como `DocumentFragment` e batching de atualizações.
- **Use Classes para Estilos:**
    - Prefira adicionar ou remover classes em vez de modificar estilos inline diretamente, promovendo reutilização e manutenibilidade do código CSS.
    
    **Exemplo:**
    
    ```jsx
    // Preferível
    elemento.classList.add('ativo');
    
    // Evitar
    elemento.style.backgroundColor = 'green';
    
    ```
    
- **Mantenha o Código Limpo e Organizado:**
    - Separe funcionalidades em funções específicas e mantenha uma estrutura lógica para facilitar a leitura e manutenção do código.
- **Gerencie Memória e Recursos:**
    - Remova event listeners desnecessários e desconecte observadores quando não forem mais necessários para evitar vazamentos de memória.
    
    **Exemplo:**
    
    ```jsx
    const botão = document.getElementById('botao');
    
    function handler() {
        console.log('Botão clicado');
    }
    
    botão.addEventListener('click', handler);
    
    // Remover o listener quando não for mais necessário
    botão.removeEventListener('click', handler);
    
    ```
    

## 6. Referências para Estudo Independente

- [MDN Web Docs: Document Object Model (DOM)](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model)
- [MDN Web Docs: Seleção de Elementos no DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model/Locating_DOM_elements_using_selectors)
- [MDN Web Docs: Manipulação de Atributos](https://developer.mozilla.org/pt-BR/docs/Web/API/Element)
- [MDN Web Docs: Propriedades de Elementos](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement)
- [Livro: *JavaScript: The Definitive Guide* de David Flanagan](https://www.oreilly.com/library/view/javascript-the-definitive/9781491952023/)
- [Tutorial: *Manipulando o DOM com JavaScript* - W3Schools](https://www.w3schools.com/js/js_htmldom.asp)
- [Artigo: *Performance Optimization Techniques for DOM Manipulation* - web.dev](https://web.dev/dom-manipulation-performance/)
- [Curso Online: *JavaScript DOM Manipulation* na plataforma freeCodeCamp](https://www.freecodecamp.org/learn/front-end-libraries/front-end-libraries-projects/build-a-random-quote-machine)
- [MDN Web Docs: Propriedades de Elementos HTML](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement)
- [MDN Web Docs: Atributos ARIA](https://developer.mozilla.org/pt-BR/docs/Web/Accessibility/ARIA)
- [MDN Web Docs: window.location](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/location)
- [MDN Web Docs: window.history](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/history)

## 7. Conclusão

As **propriedades do Document Object Model (DOM)** são ferramentas essenciais que permitem aos desenvolvedores acessar, modificar e interagir com os elementos de uma página web de forma eficaz e dinâmica. Desde a seleção e navegação pela árvore DOM até a manipulação de atributos, estilos e propriedades específicas de formulários, o domínio dessas propriedades é fundamental para a criação de interfaces web ricas, responsivas e acessíveis. Além disso, a compreensão das boas práticas de performance e compatibilidade entre navegadores assegura que as aplicações desenvolvidas sejam eficientes e funcionem de maneira consistente em diferentes ambientes. Investir tempo no estudo e na aplicação dessas propriedades certamente aprimorará as habilidades em JavaScript e contribuirá para o desenvolvimento de soluções web avançadas e de alta qualidade.