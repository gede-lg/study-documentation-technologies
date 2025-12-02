# Escopo e Contexto (this) em Funções

## Introdução

No desenvolvimento em JavaScript, compreender **escopo** e **contexto** é essencial para escrever código eficiente, legível e livre de erros. O **escopo** determina a acessibilidade das variáveis e funções em diferentes partes do código, enquanto o **contexto** refere-se ao valor de `this` dentro de uma função, que pode variar dependendo de como a função é chamada. Este módulo explora detalhadamente esses conceitos, fornecendo uma base sólida para manejar variáveis, funções e o `this` de maneira eficaz.

## Sumário

1. [Escopo de Função vs. Escopo de Bloco](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#escopo-de-fun%C3%A7%C3%A3o-vs-escopo-de-bloco)
    - Declarações `var`, `let`, `const`
    - Regras de hoisting no escopo de função
2. [Lexical Scope (Escopo Léxico)](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#lexical-scope-escopo-l%C3%A9xico)
    - Busca de variáveis no escopo
    - Exemplos práticos de escopo léxico
3. [Contexto (`this`) em Funções](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#contexto-this-em-fun%C3%A7%C3%B5es)
    - Determinação do `this` em funções tradicionais vs. arrow functions
    - Comportamento do `this` no modo estrito vs. não estrito
4. [Tópicos Adicionais](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#t%C3%B3picos-adicionais)
    - Escopo Global
    - Escopo de Módulo
5. [Referências para Estudo Independente](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#refer%C3%AAncias-para-estudo-independente)

---

## Escopo de Função vs. Escopo de Bloco

### Declarações `var`, `let`, `const`

Em JavaScript, a maneira como declaramos variáveis afeta seu escopo. As três palavras-chave principais para declaração de variáveis são `var`, `let` e `const`, cada uma com comportamentos distintos.

### `var`

- **Escopo de Função**: Variáveis declaradas com `var` têm escopo de função, ou seja, estão acessíveis em toda a função em que foram declaradas.
- **Hoisting**: Variáveis `var` são içadas (hoisted) para o topo do escopo de função, mas seu valor inicial é `undefined` até a linha de declaração.

**Exemplo:**

```jsx
function exemploVar() {
  console.log(a); // undefined (hoisted)
  var a = 10;
  console.log(a); // 10

  if (true) {
    var a = 20; // mesma variável 'a' do escopo da função
    console.log(a); // 20
  }

  console.log(a); // 20
}

exemploVar();

```

### `let` e `const`

- **Escopo de Bloco**: Variáveis declaradas com `let` e `const` têm escopo de bloco, ou seja, são acessíveis apenas dentro do bloco `{}` onde foram declaradas.
- **Hoisting**: Embora também sejam içadas, `let` e `const` não são inicializadas antes de sua declaração, resultando em um erro se acessadas antecipadamente (Temporal Dead Zone).

**Exemplo com `let`:**

```jsx
function exemploLet() {
  // console.log(b); // ReferenceError: Cannot access 'b' before initialization
  let b = 10;
  console.log(b); // 10

  if (true) {
    let b = 20; // nova variável 'b' no escopo do bloco
    console.log(b); // 20
  }

  console.log(b); // 10
}

exemploLet();

```

**Exemplo com `const`:**

```jsx
function exemploConst() {
  const c = 30;
  console.log(c); // 30

  // c = 40; // TypeError: Assignment to constant variable.

  if (true) {
    const c = 50; // nova constante 'c' no escopo do bloco
    console.log(c); // 50
  }

  console.log(c); // 30
}

exemploConst();

```

### Diferenças Entre `var`, `let` e `const`

| Característica | `var` | `let` | `const` |
| --- | --- | --- | --- |
| Escopo | Função | Bloco | Bloco |
| Hoisting | Sim (undefined) | Sim (Temporal Dead Zone) | Sim (Temporal Dead Zone) |
| Reatribuição | Sim | Sim | Não |
| Redefinição | Não | Não | Não |

### Regras de Hoisting no Escopo de Função

**Hoisting** é um comportamento do JavaScript onde declarações de variáveis e funções são movidas para o topo do seu contexto de execução antes da execução do código.

### Hoisting com `var`

Variáveis declaradas com `var` são içadas para o topo do escopo de função e inicializadas com `undefined`.

**Exemplo:**

```jsx
function hoistingVar() {
  console.log(x); // undefined
  var x = 5;
  console.log(x); // 5
}

hoistingVar();

```

### Hoisting com `let` e `const`

Variáveis declaradas com `let` e `const` também são içadas, mas não são inicializadas. Acessá-las antes da declaração resulta em um erro.

**Exemplo:**

```jsx
function hoistingLetConst() {
  // console.log(y); // ReferenceError: Cannot access 'y' before initialization
  let y = 10;
  console.log(y); // 10

  // console.log(z); // ReferenceError: Cannot access 'z' before initialization
  const z = 20;
  console.log(z); // 20
}

hoistingLetConst();

```

### Hoisting com Function Declarations

Funções declaradas com `function` são completamente içadas, ou seja, podem ser chamadas antes da sua definição no código.

**Exemplo:**

```jsx
hoistedFunction(); // "Função içada executada!"

function hoistedFunction() {
  console.log("Função içada executada!");
}

```

---

## Lexical Scope (Escopo Léxico)

**Escopo léxico** refere-se à visibilidade das variáveis com base na posição onde elas são declaradas no código-fonte. Em JavaScript, o escopo é determinado no momento em que a função é definida, não quando ela é executada.

### Como o JavaScript Busca Variáveis “de Dentro para Fora”

Quando uma variável é referenciada dentro de uma função, o JavaScript procura essa variável primeiramente no escopo interno (mais próximo). Se não for encontrada, a busca se estende para os escopos externos sucessivamente até o escopo global.

**Exemplo:**

```jsx
const globalVar = "Global";

function externa() {
  const externaVar = "Externa";

  function interna() {
    const internaVar = "Interna";
    console.log(globalVar);    // "Global"
    console.log(externaVar);   // "Externa"
    console.log(internaVar);   // "Interna"
  }

  interna();
}

externa();

```

**Explicação:**

1. `interna` tem acesso a `internaVar`, `externaVar` e `globalVar`.
2. `externa` tem acesso a `externaVar` e `globalVar`.
3. O escopo global tem acesso apenas a `globalVar`.

### Exemplos Práticos de Escopo Léxico

### Exemplo 1: Função Aninhada

```jsx
function saudacao(saudacaoInicial) {
  return function(nome) {
    console.log(`${saudacaoInicial}, ${nome}!`);
  };
}

const dizerOi = saudacao("Oi");
dizerOi("Alice"); // "Oi, Alice!"

const dizerHello = saudacao("Hello");
dizerHello("Bob"); // "Hello, Bob!"

```

**Explicação:**

- A função interna acessa `saudacaoInicial` da função externa devido ao escopo léxico.

### Exemplo 2: Variáveis com o Mesmo Nome em Escopos Diferentes

```jsx
const valor = "Global";

function mostrarValor() {
  const valor = "Local";

  function interna() {
    console.log(valor); // "Local"
  }

  interna();
}

mostrarValor();

```

**Explicação:**

- A função `interna` acessa a variável `valor` definida na função `mostrarValor`, não a variável global.

### Exemplo 3: Closures e Escopo Léxico

Closures são funções que lembram o escopo em que foram criadas, mesmo quando executadas fora desse escopo.

```jsx
function contador() {
  let total = 0;
  return function() {
    total += 1;
    return total;
  };
}

const contar = contador();
console.log(contar()); // 1
console.log(contar()); // 2
console.log(contar()); // 3

```

**Explicação:**

- A função retornada mantém acesso à variável `total` da função `contador` devido ao escopo léxico.

---

## Contexto (`this`) em Funções

O `this` é uma palavra-chave em JavaScript que refere-se ao objeto que está executando o contexto atual. O valor de `this` pode variar dependendo de como uma função é chamada.

### Como o Valor de `this` é Determinado em **Function** vs. **Arrow Function**

### Funções Tradicionais (`function`)

Em funções tradicionais, o valor de `this` é determinado pela forma como a função é chamada.

- **Chamada como método de objeto**: `this` refere-se ao objeto que invoca a função.
- **Chamada como função simples**: `this` refere-se ao objeto global (`window` no navegador ou `global` no Node.js) ou `undefined` em modo estrito.
- **Uso com `call`, `apply`, `bind`**: `this` pode ser explicitamente definido.

**Exemplo:**

```jsx
const pessoa = {
  nome: "Carlos",
  apresentar: function() {
    console.log(`Olá, meu nome é ${this.nome}`);
  }
};

pessoa.apresentar(); // "Olá, meu nome é Carlos"

const apresentar = pessoa.apresentar;
apresentar(); // "Olá, meu nome é undefined" (em modo estrito, causaria erro)

```

### Arrow Functions

Arrow functions não possuem seu próprio `this`. Em vez disso, elas capturam o `this` do contexto léxico em que foram definidas.

**Exemplo:**

```jsx
const pessoa = {
  nome: "Ana",
  apresentar: () => {
    console.log(`Olá, meu nome é ${this.nome}`);
  }
};

pessoa.apresentar(); // "Olá, meu nome é undefined"

function normal() {
  const obj = {
    nome: "Bruno",
    falar: () => {
      console.log(`Olá, meu nome é ${this.nome}`);
    }
  };
  obj.falar();
}

normal(); // "Olá, meu nome é undefined"

```

**Explicação:**

- Arrow functions dentro de objetos não têm seu próprio `this`; elas usam o `this` do escopo global ou do escopo de definição.

**Uso Adequado de Arrow Functions:**

Arrow functions são ideais para funções que não dependem de `this`, como callbacks e funções de alta ordem.

**Exemplo com Arrow Function:**

```jsx
const pessoa = {
  nome: "Diana",
  apresentar: function() {
    const saudacao = () => {
      console.log(`Olá, meu nome é ${this.nome}`);
    };
    saudacao();
  }
};

pessoa.apresentar(); // "Olá, meu nome é Diana"

```

**Explicação:**

- A arrow function `saudacao` captura o `this` da função `apresentar`, que é o objeto `pessoa`.

### Como Funciona o `this` no Modo Estrito vs. Não Estrito

### Modo Não Estrito

Em funções chamadas como funções simples (não métodos de objetos), `this` refere-se ao objeto global (`window` no navegador).

**Exemplo:**

```jsx
function foraDeObjeto() {
  console.log(this === window); // true (no navegador)
}

foraDeObjeto();

```

### Modo Estrito

No modo estrito (`'use strict'`), o `this` em funções chamadas como funções simples é `undefined`.

**Exemplo:**

```jsx
'use strict';

function foraDeObjeto() {
  console.log(this); // undefined
}

foraDeObjeto();

```

**Diferença Principal:**

- **Não Estrito**: `this` padrão para funções simples é o objeto global.
- **Estrito**: `this` padrão para funções simples é `undefined`.

### Exemplos Adicionais

### Uso de `call`, `apply` e `bind` para Definir `this`

- **`call`**: Invoca a função imediatamente com um `this` específico.
- **`apply`**: Similar ao `call`, mas aceita um array de argumentos.
- **`bind`**: Retorna uma nova função com `this` vinculado.

**Exemplo com `call`:**

```jsx
function apresentar() {
  console.log(`Olá, meu nome é ${this.nome}`);
}

const usuario = { nome: "Eduardo" };

apresentar.call(usuario); // "Olá, meu nome é Eduardo"

```

**Exemplo com `apply`:**

```jsx
function saudacao(saudacaoInicial) {
  console.log(`${saudacaoInicial}, meu nome é ${this.nome}`);
}

const usuario = { nome: "Fernanda" };

saudacao.apply(usuario, ["Oi"]); // "Oi, meu nome é Fernanda"

```

**Exemplo com `bind`:**

```jsx
function apresentar() {
  console.log(`Olá, meu nome é ${this.nome}`);
}

const usuario = { nome: "Gustavo" };

const apresentarUsuario = apresentar.bind(usuario);
apresentarUsuario(); // "Olá, meu nome é Gustavo"

```

---

## Tópicos Adicionais

### Escopo Global

Variáveis declaradas no escopo global são acessíveis em qualquer parte do código. No navegador, o escopo global é o objeto `window`.

**Exemplo:**

```jsx
var globalVar = "Variável Global";

function mostrarGlobal() {
  console.log(globalVar); // "Variável Global"
}

mostrarGlobal();
console.log(window.globalVar); // "Variável Global" (no navegador)

```

**Nota:**

- Evitar poluir o escopo global é uma boa prática para prevenir conflitos e facilitar a manutenção do código.

### Escopo de Módulo

Com a introdução dos módulos ES6, cada módulo possui seu próprio escopo, isolando suas declarações de variáveis e funções do escopo global.

**Exemplo:**

```jsx
// arquivo modulo.js
export const saudacao = "Olá do módulo";

// arquivo main.js
import { saudacao } from './modulo.js';
console.log(saudacao); // "Olá do módulo"
console.log(typeof saudacaoGlobal); // "undefined"

```

**Vantagens:**

- Evita conflitos de nomes.
- Facilita a reutilização e manutenção de código.

---

## Referências para Estudo Independente

Para aprofundar ainda mais seu conhecimento sobre escopo e contexto em JavaScript, consulte os seguintes recursos:

- **Documentação Oficial:**
    - [MDN Web Docs - Escopo de Variáveis](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Grammar_and_types#escopo_de_vari%C3%A1veis)
    - [MDN Web Docs - `this`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/this)
    - [MDN Web Docs - Declarações `var`, `let` e `const`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/var)
- **Artigos e Tutoriais:**
    - [JavaScript Scopes and Closures](https://www.freecodecamp.org/news/javascript-scopes-and-closures/)
    - [Understanding `this` in JavaScript](https://www.freecodecamp.org/news/understanding-this-keyword-in-javascript/)
- **Vídeos Educacionais:**
    - [You Don't Know JS: Scope & Closures](https://www.youtube.com/watch?v=1idOYkCI8x0) - Série de vídeos explicativos.
- **Livros:**
    - **"You Don't Know JS"** (Kyle Simpson) - Série de livros gratuitos e pagos que cobrem profundamente os mecanismos internos do JavaScript.
    - **"JavaScript: The Good Parts"** (Douglas Crockford) - Foco nas melhores práticas e nos recursos mais robustos da linguagem.
- **Comunidades e Fóruns:**
    - [Stack Overflow](https://stackoverflow.com/) - Para dúvidas específicas e soluções de problemas.
    - [Reddit - r/javascript](https://www.reddit.com/r/javascript/) - Discussões e novidades sobre JavaScript.
- **Cursos Online:**
    - [FreeCodeCamp](https://www.freecodecamp.org/) - Cursos gratuitos sobre JavaScript e desenvolvimento web.
    - [Codecademy](https://www.codecademy.com/learn/introduction-to-javascript) - Cursos interativos sobre JavaScript.
    - [Udemy](https://www.udemy.com/topic/javascript/) - Vários cursos pagos com foco em diferentes aspectos de JavaScript.

---

## Conclusão

Compreender **escopo** e **contexto** é fundamental para escrever código JavaScript eficaz e livre de erros. Este módulo abordou as diferenças entre `var`, `let` e `const`, o funcionamento do hoisting, o escopo léxico, e a complexidade do `this` em diferentes tipos de funções. Ao dominar esses conceitos, você estará melhor equipado para estruturar seu código de forma modular, evitar bugs relacionados a variáveis globais e manipular o `this` de maneira previsível e controlada.