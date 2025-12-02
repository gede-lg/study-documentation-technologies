# Métodos de Funções (call, apply, bind)

## Introdução

No JavaScript, as funções são objetos de primeira classe, o que significa que elas podem ser manipuladas como qualquer outro objeto. Os métodos `call`, `apply` e `bind` são ferramentas poderosas que permitem controlar o contexto (`this`) no qual uma função é executada. Compreender esses métodos é essencial para escrever código flexível e reutilizável, especialmente em programação orientada a objetos e em manipulação de eventos.

Este módulo abordará detalhadamente os métodos `call`, `apply` e `bind`, explorando suas sintaxes, diferenças, casos de uso e exemplos práticos para consolidar o entendimento.

## Sumário

1. [Entendendo o Contexto (`this`)](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#entendendo-o-contexto-this)
2. [`call`](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#call)
    - [Sintaxe](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#sintaxe)
    - [Exemplos Práticos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#exemplos-pr%C3%A1ticos-call)
    - [Casos de Uso](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#casos-de-uso-call)
3. [`apply`](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#apply)
    - [Sintaxe](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#sintaxe-1)
    - [Exemplos Práticos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#exemplos-pr%C3%A1ticos-apply)
    - [Casos de Uso](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#casos-de-uso-apply)
4. [`bind`](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#bind)
    - [Sintaxe](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#sintaxe-2)
    - [Exemplos Práticos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#exemplos-pr%C3%A1ticos-bind)
    - [Casos de Uso](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#casos-de-uso-bind)
5. [Diferenças Entre `call`, `apply` e `bind`](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#diferen%C3%A7as-entre-call-apply-e-bind)
6. [Tópicos Avançados](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#t%C3%B3picos-avan%C3%A7ados)
    - [Métodos de Funções em Herança](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#m%C3%A9todos-de-fun%C3%A7%C3%B5es-em-heran%C3%A7a)
    - [Combinando com Funções de Ordem Superior](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#combinando-com-fun%C3%A7%C3%B5es-de-ordem-superior)
7. [Boas Práticas](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#boas-pr%C3%A1ticas)
8. [Referências para Estudo Independente](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#refer%C3%AAncias-para-estudo-independente)

---

## Entendendo o Contexto (`this`)

Antes de mergulharmos nos métodos `call`, `apply` e `bind`, é fundamental compreender o que é o `this` no JavaScript. O `this` é uma palavra-chave que faz referência ao objeto que está executando o contexto atual de execução. O valor de `this` pode variar dependendo de como uma função é chamada.

### Regras Básicas do `this`

1. **Contexto Global**: No contexto global (fora de qualquer função), `this` refere-se ao objeto global (`window` no navegador ou `global` no Node.js).
2. **Métodos de Objeto**: Quando uma função é chamada como um método de um objeto, `this` refere-se ao objeto que contém o método.
3. **Funções Constructoras**: Em funções construtoras (invocadas com `new`), `this` refere-se ao novo objeto criado.
4. **Funções Arrow**: As funções arrow não têm seu próprio `this`; elas capturam o `this` do contexto léxico onde foram definidas.
5. **Chamada Explícita**: Com os métodos `call`, `apply` e `bind`, é possível definir explicitamente o valor de `this` para uma função.

Compreender essas regras é essencial para utilizar corretamente os métodos `call`, `apply` e `bind`.

---

## `call`

### Sintaxe

```jsx
func.call(thisArg, arg1, arg2, ...);

```

- **`func`**: A função que será chamada.
- **`thisArg`**: O valor a ser usado como `this` dentro de `func`.
- **`arg1, arg2, ...`**: Argumentos que serão passados para a função.

### Exemplos Práticos: `call`

### Exemplo 1: Alterando o Contexto com `call`

```jsx
const pessoa = {
  nome: "Ana",
  saudacao: function() {
    console.log(`Olá, meu nome é ${this.nome}`);
  }
};

const outraPessoa = {
  nome: "Bruno"
};

// Usando call para alterar o contexto de `this` para `outraPessoa`
pessoa.saudacao.call(outraPessoa); // Saída: Olá, meu nome é Bruno

```

### Exemplo 2: Passando Argumentos com `call`

```jsx
function saudacaoFormal(saudacao, pontuacao) {
  console.log(`${saudacao}, meu nome é ${this.nome}${pontuacao}`);
}

const pessoa = { nome: "Carlos" };

saudacaoFormal.call(pessoa, "Bom dia", "!"); // Saída: Bom dia, meu nome é Carlos!

```

### Casos de Uso: `call`

1. **Reutilização de Funções**: Permite reutilizar funções genéricas com diferentes contextos.
2. **Em Métodos de Objeto**: Pode ser usado para invocar métodos de um objeto com o contexto de outro objeto.
3. **Funções de Biblioteca**: Muitas bibliotecas JavaScript utilizam `call` para manipular o contexto interno de funções.

---

## `apply`

### Sintaxe

```jsx
func.apply(thisArg, [argsArray]);

```

- **`func`**: A função que será chamada.
- **`thisArg`**: O valor a ser usado como `this` dentro de `func`.
- **`argsArray`**: Um array ou objeto semelhante a um array que contém os argumentos para a função.

### Exemplos Práticos: `apply`

### Exemplo 1: Utilizando `apply` com Arrays

```jsx
function somar(a, b, c) {
  return a + b + c;
}

const numeros = [1, 2, 3];

const resultado = somar.apply(null, numeros);
console.log(resultado); // Saída: 6

```

### Exemplo 2: Usando `apply` para Encontrar o Máximo em um Array

```jsx
const numeros = [5, 6, 2, 3, 7];

const maximo = Math.max.apply(null, numeros);
console.log(maximo); // Saída: 7

```

### Exemplo 3: Alterando o Contexto com `apply`

```jsx
const pessoa = {
  nome: "Diana",
  saudacao: function(saudacao) {
    console.log(`${saudacao}, meu nome é ${this.nome}`);
  }
};

const outraPessoa = { nome: "Eduardo" };

pessoa.saudacao.apply(outraPessoa, ["Olá"]); // Saída: Olá, meu nome é Eduardo

```

### Casos de Uso: `apply`

1. **Invocando Funções com Argumentos Dinâmicos**: Útil quando os argumentos estão em forma de array.
2. **Manipulação de Arrays**: Facilita operações que requerem argumentos separados, como `Math.max` ou `Math.min`.
3. **Reutilização de Métodos de Array em Outros Objetos**: Por exemplo, usar métodos como `slice` ou `push` em objetos que não são arrays.

---

## `bind`

### Sintaxe

```jsx
const boundFunc = func.bind(thisArg, arg1, arg2, ...);

```

- **`func`**: A função que será vinculada.
- **`thisArg`**: O valor a ser usado como `this` dentro de `func`.
- **`arg1, arg2, ...`**: Argumentos predefinidos que serão passados para a função quando ela for invocada.

### Exemplos Práticos: `bind`

### Exemplo 1: Fixando o Contexto com `bind`

```jsx
const pessoa = {
  nome: "Fernanda",
  saudacao: function() {
    console.log(`Olá, meu nome é ${this.nome}`);
  }
};

const saudacaoFernanda = pessoa.saudacao.bind(pessoa);

saudacaoFernanda(); // Saída: Olá, meu nome é Fernanda

```

### Exemplo 2: Usando `bind` para Presetar Argumentos

```jsx
function multiplicar(a, b) {
  return a * b;
}

const dobrar = multiplicar.bind(null, 2);

console.log(dobrar(5)); // Saída: 10
console.log(dobrar(10)); // Saída: 20

```

### Exemplo 3: `bind` em Manipuladores de Eventos

```jsx
const botao = document.getElementById("meuBotao");

const obj = {
  mensagem: "Botão clicado!",
  handleClick: function() {
    console.log(this.mensagem);
  }
};

// Sem bind, `this` dentro de handleClick referirá ao elemento do DOM
botao.addEventListener("click", obj.handleClick.bind(obj)); // Saída ao clicar: "Botão clicado!"

```

### Casos de Uso: `bind`

1. **Preservar o Contexto em Callbacks**: Garante que o `this` dentro de callbacks se refira ao objeto desejado.
2. **Criar Funções Parcialmente Aplicadas**: Permite predefinir alguns argumentos de uma função.
3. **Programação Funcional**: Facilita a criação de funções mais flexíveis e reutilizáveis.

---

## Diferenças Entre `call`, `apply` e `bind`

| Método | Invoca a Função Imediatamente | Retorna uma Nova Função | Passagem de Argumentos |
| --- | --- | --- | --- |
| `call` | Sim | Não | Lista de argumentos |
| `apply` | Sim | Não | Array de argumentos |
| `bind` | Não | Sim | Lista de argumentos |
- **`call` vs `apply`**: Ambos invocam a função imediatamente, mas `call` aceita uma lista de argumentos, enquanto `apply` aceita um array de argumentos.
- **`bind`**: Não invoca a função imediatamente. Em vez disso, retorna uma nova função com o `this` e, opcionalmente, alguns argumentos predefinidos fixados.

---

## Tópicos Avançados

### Métodos de Funções em Herança

Em programação orientada a objetos, especialmente com herança, `call` e `apply` podem ser usados para chamar construtores de superclasse.

### Exemplo: Herança com `call`

```jsx
function Pessoa(nome, idade) {
  this.nome = nome;
  this.idade = idade;
}

function Estudante(nome, idade, curso) {
  // Chama o construtor Pessoa com o contexto de Estudante
  Pessoa.call(this, nome, idade);
  this.curso = curso;
}

const estudante = new Estudante("Guilherme", 22, "Engenharia");
console.log(estudante);
// Saída: Estudante { nome: 'Guilherme', idade: 22, curso: 'Engenharia' }

```

### Combinando com Funções de Ordem Superior

Os métodos `call`, `apply` e `bind` podem ser combinados com funções de ordem superior para criar soluções elegantes e poderosas.

### Exemplo: Usando `bind` com `setTimeout`

```jsx
const pessoa = {
  nome: "Helena",
  dizerNome: function() {
    console.log(`Meu nome é ${this.nome}`);
  }
};

// Sem bind, `this` dentro de dizerNome seria o contexto global
setTimeout(pessoa.dizerNome.bind(pessoa), 1000); // Após 1s: "Meu nome é Helena"

```

---

## Boas Práticas

1. **Entenda o Contexto**: Sempre tenha clareza sobre qual será o valor de `this` ao usar `call`, `apply` e `bind`.
2. **Use `bind` para Preservar `this` em Callbacks**: Especialmente em ambientes onde o contexto pode mudar, como em manipuladores de eventos ou funções assíncronas.
3. **Evite Abusos**: Embora poderosos, o uso excessivo de `call`, `apply` e `bind` pode tornar o código mais difícil de entender. Utilize-os quando realmente necessários.
4. **Prefira Métodos Modernos Quando Possível**: Com o advento das funções arrow, algumas necessidades de manipulação de `this` podem ser resolvidas de maneira mais simples.

---

## Referências para Estudo Independente

- **Documentação Oficial do MDN**:
    - [Função.prototype.call()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
    - [Função.prototype.apply()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
    - [Função.prototype.bind()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- **Livro**:
    - *You Don't Know JS: this & Object Prototypes* por Kyle Simpson
- **Artigos e Tutoriais**:
    - [Understanding JavaScript's `call`, `apply`, and `bind` Methods](https://www.freecodecamp.org/news/call-apply-bind-explained/)
    - [JavaScript `this` Keyword: Everything You Need to Know](https://www.digitalocean.com/community/tutorials/js-this-keyword)
- **Vídeos**:
    - [Funções Call, Apply e Bind no JavaScript](https://www.youtube.com/watch?v=9IzDKTWlEGQ) - Canal: Curso em Vídeo
    - [JavaScript Call, Apply e Bind](https://www.youtube.com/watch?v=R-FJbqkc7eI) - Canal: Rocketseat
- **Exercícios Práticos**:
    - [Exercícios sobre `call`, `apply` e `bind`](https://www.w3resource.com/javascript-exercises/function-methods/javascript-function-call-apply-bind-exercise-1.php)

---

Compreender e dominar os métodos `call`, `apply` e `bind` é crucial para escrever código JavaScript eficiente e flexível. Pratique os exemplos fornecidos, experimente em diferentes contextos e explore as referências para aprofundar ainda mais seu conhecimento.