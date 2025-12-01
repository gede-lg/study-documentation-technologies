# Criando web componentes

Excelente, Gedê\! Dando continuidade ao nosso aprofundamento em Web Components, agora vamos focar no processo de criação de um "Custom Component", ou, mais formalmente, um **Custom Element**. Preparei outra explicação super detalhada, no mesmo formato da anterior, para que você domine completamente este tópico.

### **Título: O Guia Definitivo para a Criação de Custom Elements: Do Conceito à Prática**

---

### **Introdução**

No coração da revolução dos Web Components está a capacidade de fazer algo que os desenvolvedores HTML sempre sonharam: criar suas próprias tags HTML. Os **Custom Elements** (Elementos Customizados) nos dão exatamente esse poder. Eles nos permitem definir novos elementos, com seus próprios nomes, templates e comportamentos, encapsulados em uma classe JavaScript. Isso possibilita a construção de interfaces de usuário (UIs) verdadeiramente modulares, reutilizáveis e fáceis de manter, onde a complexidade é elegantemente escondida atrás de uma simples tag, como `<meu-botao>` ou `<cartao-de-visita>`.

---

### **Sumário**

- **Conceitos Fundamentais:** O que é um Custom Element e as tecnologias que o sustentam.
- **As 3 Tecnologias-Chave:** Uma análise detalhada do trio: Custom Elements, Shadow DOM e HTML Templates.
- **Guia Passo a Passo:** Um roteiro prático para criar seu primeiro componente, da classe JS ao uso no HTML.
- **O Ciclo de Vida do Componente:** Entendendo os "callbacks" que reagem a eventos como inserção e remoção do DOM.
- **Comunicação com o Componente:** Como passar dados e interagir com seu elemento usando atributos, propriedades e eventos.
- **Estendendo Elementos Nativos:** Uma técnica avançada para herdar funcionalidades de elementos HTML existentes.
- **Restrições e Considerações:** Regras e pontos de atenção essenciais no desenvolvimento.
- **Melhores Práticas:** Dicas para criar componentes robustos, flexíveis e de alta qualidade.
- **Exemplo Completo:** Construção de um componente de "contador" interativo.
- **Tópicos para Aprofundamento:** Próximos passos para se tornar um mestre em Web Components.

---

### **Conceitos Fundamentais**

Um **Custom Element** é, essencialmente, a junção de uma tag HTML que você inventa (ex: `<user-profile>`) com uma classe JavaScript que dita seu comportamento, estrutura (HTML) e aparência (CSS). O objetivo é criar blocos de construção de UI que sejam:

- **Reutilizáveis:** Use o mesmo componente em vários lugares da sua aplicação ou até mesmo em projetos diferentes.
- **Encapsulados:** O HTML interno (Shadow DOM) e o CSS do componente não afetam o resto da página, e vice-versa.
- **Interoperáveis:** Como são baseados em padrões da web, funcionam em qualquer framework (React, Angular, Vue, Svelte) ou mesmo com JavaScript puro.

Para que isso seja possível, a plataforma web nos fornece um conjunto de APIs e elementos que trabalham em conjunto.

---

### **As 3 Tecnologias-Chave**

A criação de um Custom Element robusto geralmente envolve a orquestração de três tecnologias principais:

1. **Custom Elements API:** É a API JavaScript que permite registrar um novo elemento no navegador. O método principal aqui é o `customElements.define()`, que associa o nome da sua tag a uma classe JavaScript.
2. **Shadow DOM:** É a API que permite anexar uma árvore DOM oculta e encapsulada a um elemento. É aqui que o HTML e o CSS internos do seu componente vão viver, protegidos do mundo exterior. Isso evita conflitos de estilo e IDs.
3. **HTML `<template>` e `<slot>`:**
    - **`<template>`:** É um contêiner para guardar um bloco de HTML que não é renderizado na página imediatamente. Ele serve como um "molde" eficiente para a estrutura do seu componente, que pode ser clonado e usado quantas vezes for necessário.
    - **`<slot>`:** É um placeholder dentro do seu Shadow DOM. Ele permite que o usuário do seu componente insira seu próprio conteúdo (texto, outros elementos) dentro da sua tag, e você pode controlar onde esse conteúdo será renderizado.

---

### **Guia Passo a Passo: Criando seu Primeiro Custom Element**

Vamos criar um componente simples, `<saudacao-personalizada>`, que exibe uma mensagem.

### **Passo 1: A Classe do Componente (JavaScript)**

Tudo começa com uma classe JavaScript que estende (herda de) `HTMLElement`. Esta classe será o cérebro do nosso componente.

```jsx
// Crie um arquivo chamado SaudacaoPersonalizada.js

class SaudacaoPersonalizada extends HTMLElement {
  constructor() {
    // 1. Sempre chame super() primeiro no construtor.
    // Ele executa o construtor da classe pai (HTMLElement) e estabelece a cadeia de protótipos correta.
    super();

    // Aqui definimos o comportamento inicial.
    // O ideal é não manipular o DOM aqui ainda, pois o elemento pode não estar na página.
    console.log('Componente <saudacao-personalizada> foi construído!');
  }

  // O ciclo de vida do componente será detalhado na próxima seção.
}

```

### **Passo 2: Definindo e Registrando o Elemento (JavaScript)**

Agora, usamos a API `customElements.define()` para dizer ao navegador que a tag `<saudacao-personalizada>` deve ser controlada pela nossa classe `SaudacaoPersonalizada`.

```jsx
// No mesmo arquivo SaudacaoPersonalizada.js, após a definição da classe.

// customElements.define('nome-da-tag', ClasseDoComponente);
// REGRAS PARA O NOME DA TAG:
// 1. O nome DEVE conter um hífen (-). Ex: 'meu-elemento', 'app-header'. Isso evita conflitos com futuras tags HTML oficiais.
// 2. Não pode começar com números ou símbolos.
// 3. Não pode usar nomes já registrados.
customElements.define('saudacao-personalizada', SaudacaoPersonalizada);

```

### **Passo 3: Criando a Estrutura Interna (HTML Template & Shadow DOM)**

Vamos dar uma estrutura e estilo ao nosso componente. Faremos isso dentro da classe, geralmente no construtor.

```jsx
// Dentro da classe SaudacaoPersonalizada

class SaudacaoPersonalizada extends HTMLElement {
  constructor() {
    super();

    // 2. Anexar um Shadow DOM ao elemento.
    // O modo 'open' permite que o JavaScript da página externa acesse o Shadow DOM (ex: elemento.shadowRoot).
    // O modo 'closed' impede isso, tornando o encapsulamento mais rígido. 'open' é o mais comum.
    this.attachShadow({ mode: 'open' });

    // 3. Preencher o Shadow DOM com HTML e CSS.
    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos encapsulados! Este H2 não afetará outros H2s na página. */
        h2 {
          color: #3498db; /* Azul */
          font-family: sans-serif;
        }
        p {
          color: #555;
        }
      </style>

      <h2>Olá, Mundo!</h2>
      <p>Este é o meu primeiro Custom Element!</p>
    `;
  }
}

customElements.define('saudacao-personalizada', SaudacaoPersonalizada);

```

### **Passo 4: Utilizando o Componente (HTML)**

Agora, a parte mais fácil. Em seu arquivo `index.html`, inclua o script e use a nova tag como qualquer outra.

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <title>Teste de Custom Element</title>
</head>
<body>
  <h1>Minha Página</h1>

  <saudacao-personalizada></saudacao-personalizada>

  <script src="SaudacaoPersonalizada.js"></script>
</body>
</html>

```

E pronto\! Você criou e usou seu primeiro Custom Element.

---

### **O Ciclo de Vida do Componente**

Custom Elements possuem métodos especiais, chamados "callbacks do ciclo de vida", que são executados automaticamente pelo navegador em momentos específicos.

- `constructor()`: Chamado quando uma instância do elemento é criada ou atualizada. É o primeiro a ser executado. Ideal para inicializar estado, criar Shadow DOM.
- `connectedCallback()`: **O mais importante.** Chamado toda vez que o elemento é inserido no DOM (na página). Ideal para buscar dados, configurar eventos (`addEventListener`) e manipular o DOM.
- `disconnectedCallback()`: Chamado toda vez que o elemento é removido do DOM. Ideal para limpar recursos, como remover `EventListeners` ou parar timers, evitando vazamentos de memória.
- `attributeChangedCallback(nomeAtributo, valorAntigo, novoValor)`: Chamado quando um atributo "observado" é adicionado, removido ou alterado. Veremos como usá-lo na próxima seção.
- `adoptedCallback()`: Chamado quando o elemento é movido para um novo documento (um caso de uso raro, como mover um elemento de um `<iframe>` principal para outro).

| Callback | Quando é chamado? | Uso Comum |
| --- | --- | --- |
| **`constructor()`** | Na criação da instância do objeto. | Inicialização de estado, criação do Shadow DOM. |
| **`connectedCallback()`** | Quando o elemento entra no DOM. | Manipulação do DOM, fetch de dados, adicionar listeners. |
| **`disconnectedCallback()`** | Quando o elemento sai do DOM. | Limpeza de recursos (remover listeners, cancelar timers). |
| **`attributeChangedCallback()`** | Quando um atributo observado muda. | Reagir a mudanças de dados e atualizar o DOM interno. |

---

### **Comunicação com o Componente**

Um componente estático não é muito útil. Precisamos de formas de nos comunicarmos com ele.

### **1. Atributos (e `attributeChangedCallback`)**

Atributos são a forma declarativa (via HTML) de passar dados.

```jsx
// Dentro da classe SaudacaoPersonalizada
class SaudacaoPersonalizada extends HTMLElement {
  // Primeiro, declare quais atributos você quer "observar".
  static get observedAttributes() {
    return ['nome']; // Retorna um array com os nomes dos atributos
  }

  constructor() { /* ... */ }

  connectedCallback() {
    this.render(); // Chama um método para renderizar na conexão
  }

  // Este método será chamado quando o atributo 'nome' mudar.
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Atributo '${name}' mudou de '${oldValue}' para '${newValue}'`);
    this.render(); // Re-renderiza o componente com o novo dado
  }

  render() {
    const nome = this.getAttribute('nome') || 'Desconhecido';
    this.shadowRoot.innerHTML = `
      <style> /* ... */ </style>
      <h2>Olá, ${nome}!</h2>
      <p>Seja bem-vindo(a)!</p>
    `;
  }
}
customElements.define('saudacao-personalizada', SaudacaoPersonalizada);

```

**Uso no HTML:** `<saudacao-personalizada nome="Gedê"></saudacao-personalizada>`

### **2. Propriedades e Métodos (JavaScript)**

Você também pode interagir com o componente via JavaScript, definindo propriedades e métodos na classe.

```jsx
// Dentro da classe
class MeuComponente extends HTMLElement {
  // ...

  // Exemplo de propriedade com getter/setter
  set dados(novoArray) {
    this._dados = novoArray;
    this.render();
  }

  get dados() {
    return this._dados;
  }

  // Exemplo de método público
  atualizar() {
    console.log('Componente atualizado via método!');
    this.render();
  }
}

```

**Uso no JavaScript:**

```jsx
const meuComp = document.querySelector('meu-componente');
meuComp.dados = [{ id: 1, nome: 'Item 1' }]; // Usando o setter
meuComp.atualizar(); // Chamando o método

```

---

### **Estendendo Elementos Nativos**

Você pode criar um componente que herda o comportamento e a API de um elemento HTML nativo, como `<button>` ou `<input>`. Isso é chamado de **Customized Built-in Element**.

1. A classe deve estender a interface do elemento nativo (ex: `HTMLButtonElement`).
2. No `customElements.define()`, você precisa passar um terceiro argumento: `{ extends: 'nome-da-tag-nativa' }`.

<!-- end list -->

```jsx
// BotaoEspecial.js
class BotaoEspecial extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener('click', () => alert('Botão especial clicado!'));
  }
}

customElements.define('botao-especial', BotaoEspecial, { extends: 'button' });

```

**Uso no HTML (sintaxe especial `is`):** `<button is="botao-especial">Clique Aqui</button>`

Este método é poderoso, mas tem um suporte um pouco menor (notavelmente, o Safari demorou a implementá-lo completamente).

---

### **Melhores Práticas**

- **Use `<template>`:** Para componentes com HTML complexo, use o elemento `<template>` para declarar sua estrutura. É mais performático e organizado do que usar `innerHTML` com strings longas.
- **Pense em Atributos vs. Propriedades:** Use atributos para configuração inicial e declarativa (strings, números, booleanos). Use propriedades para dados complexos (objetos, arrays) que são passados via JavaScript.
- **Não Afete o Mundo Exterior:** O componente deve ser um "bom cidadão". Evite selecionar ou modificar elementos fora do seu Shadow DOM.
- **Seja Acessível:** Lembre-se de usar atributos ARIA apropriados e gerenciar o foco para que seu componente seja utilizável por todos.

---

### **Exemplo Completo: Componente `<contador-interativo>`**

Este componente terá um número e dois botões para incrementá-lo e decrementá-lo.

**1. `contador-interativo.js`**

```jsx
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      border: 1px solid grey;
      border-radius: 5px;
      padding: 5px;
      font-family: monospace;
    }
    button {
      width: 30px;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 50%;
      background-color: #f0f0f0;
      font-size: 20px;
      cursor: pointer;
    }
    span {
      min-width: 50px;
      text-align: center;
      font-size: 24px;
      padding: 0 10px;
    }
  </style>
  <button id="decrement">-</button>
  <span id="value"></span>
  <button id="increment">+</button>
`;

class ContadorInterativo extends HTMLElement {
  static get observedAttributes() {
    return ['valor-inicial'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Inicializa o estado interno
    this._value = 0;

    // Vincula os métodos ao 'this' da instância
    this._increment = this._increment.bind(this);
    this._decrement = this._decrement.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector('#increment').addEventListener('click', this._increment);
    this.shadowRoot.querySelector('#decrement').addEventListener('click', this._decrement);

    // Define o valor inicial se não foi passado pelo atributo
    if (!this.hasAttribute('valor-inicial')) {
        this._updateValue(0);
    }
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('#increment').removeEventListener('click', this._increment);
    this.shadowRoot.querySelector('#decrement').removeEventListener('click', this._decrement);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'valor-inicial' && oldValue !== newValue) {
        this._updateValue(parseInt(newValue, 10));
    }
  }

  _increment() {
    this._updateValue(this._value + 1);
  }

  _decrement() {
    this._updateValue(this._value - 1);
  }

  _updateValue(newValue) {
      this._value = newValue;
      this.shadowRoot.querySelector('#value').textContent = this._value;

      // Dispara um evento customizado para notificar o exterior sobre a mudança
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value } }));
  }
}

customElements.define('contador-interativo', ContadorInterativo);

```

**2. `index.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Contador Componente</title>
</head>
<body>
  <h3>Contador Padrão</h3>
  <contador-interativo id="contador1"></contador-interativo>

  <h3>Contador com Valor Inicial</h3>
  <contador-interativo valor-inicial="100"></contador-interativo>

  <p>Valor do primeiro contador: <b id="output">0</b></p>

  <script src="contador-interativo.js"></script>
  <script>
    // Ouvindo o evento customizado do componente
    const contador1 = document.getElementById('contador1');
    const output = document.getElementById('output');
    contador1.addEventListener('change', (event) => {
      output.textContent = event.detail.value;
    });
  </script>
</body>
</html>

```

---

### **Tópicos para Aprofundamento**

- **Gerenciamento de Estado:** Para componentes complexos, explore padrões de gerenciamento de estado para manter a lógica organizada.
- **Formulários:** Aprenda sobre a API `ElementInternals` para que seus Custom Elements possam participar de formulários HTML como se fossem inputs nativos.
- **Performance:** Investigue técnicas como carregamento preguiçoso (lazy loading) de definições de componentes para otimizar o tempo de carregamento da página.
- **Ferramentas e Bibliotecas:** Explore ferramentas como [Lit](https://lit.dev/), [Stencil](https://stenciljs.com/) e [FAST](https://www.fast.design/) que simplificam e potencializam a criação de Web Components.

Espero que este guia completo tenha te dado uma base sólida e a confiança necessária para começar a criar seus próprios Custom Elements, Gedê. É uma habilidade incrivelmente valiosa no desenvolvimento web atual. Qualquer dúvida, é só chamar\!