# First-Class Citizens (Funções de Primeira Classe)

## Introdução

Em JavaScript, as funções são tratadas como cidadãos de primeira classe (first-class citizens). Isso significa que as funções podem ser manipuladas como qualquer outro valor na linguagem. Elas podem ser atribuídas a variáveis, passadas como argumentos para outras funções, retornadas por funções e armazenadas em estruturas de dados como arrays e objetos. Compreender este conceito é fundamental para aproveitar ao máximo as capacidades da linguagem, especialmente ao trabalhar com programação funcional, eventos, callbacks, e padrões de design avançados.

## Sumário

1. [O que são Funções de Primeira Classe](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#o-que-s%C3%A3o-fun%C3%A7%C3%B5es-de-primeira-classe)
2. [Armazenando Funções em Variáveis, Arrays e Objetos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#armazenando-fun%C3%A7%C3%B5es-em-vari%C3%A1veis-arrays-e-objetos)
3. [Passando Funções como Argumentos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#passando-fun%C3%A7%C3%B5es-como-argumentos)
4. [Retornando Funções de Outras Funções](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#retornando-fun%C3%A7%C3%B5es-de-outras-fun%C3%A7%C3%B5es)
5. [Higher-Order Functions (Funções de Ordem Superior)](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#higher-order-functions-fun%C3%A7%C3%B5es-de-ordem-superior)
6. [Callbacks](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#callbacks)
7. [Exemplos Práticos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#exemplos-pr%C3%A1ticos)
8. [Boas Práticas](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#boas-pr%C3%A1ticas)
9. [Referências para Estudo Independente](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1?model=o1-mini#refer%C3%AAncias-para-estudo-independente)

---

## O que são Funções de Primeira Classe

**Funções de primeira classe** são aquelas que podem ser tratadas como qualquer outro valor na linguagem de programação. Em JavaScript, isso significa que as funções podem:

- Ser atribuídas a variáveis.
- Ser armazenadas em arrays, objetos, ou outras estruturas de dados.
- Ser passadas como argumentos para outras funções.
- Ser retornadas por outras funções.

Este conceito é uma pedra angular da programação funcional e permite uma maior flexibilidade e expressividade no código.

### Características das Funções de Primeira Classe

1. **Atribuição a Variáveis:**
    
    ```jsx
    const saudacao = function(nome) {
      return `Olá, ${nome}!`;
    };
    
    console.log(saudacao("Maria")); // Olá, Maria!
    
    ```
    
2. **Armazenamento em Estruturas de Dados:**
    
    ```jsx
    const funcoes = [
      function() { console.log("Função 1"); },
      function() { console.log("Função 2"); }
    ];
    
    funcoes[0](); // Função 1
    funcoes[1](); // Função 2
    
    ```
    
3. **Passagem como Argumentos:**
    
    ```jsx
    function executar(func) {
      func();
    }
    
    executar(function() { console.log("Executando função passada como argumento"); });
    // Executando função passada como argumento
    
    ```
    
4. **Retorno de Funções:**
    
    ```jsx
    function criarSaudacao(saudacao) {
      return function(nome) {
        return `${saudacao}, ${nome}!`;
      };
    }
    
    const ola = criarSaudacao("Olá");
    console.log(ola("Carlos")); // Olá, Carlos!
    
    ```
    

## Armazenando Funções em Variáveis, Arrays e Objetos

### Atribuição a Variáveis

Em JavaScript, funções podem ser atribuídas a variáveis, permitindo que sejam reutilizadas e passadas facilmente.

```jsx
const multiplicar = function(a, b) {
  return a * b;
};

console.log(multiplicar(2, 3)); // 6

```

Com **Arrow Functions**, a sintaxe pode ser mais concisa:

```jsx
const dividir = (a, b) => a / b;

console.log(dividir(10, 2)); // 5

```

### Armazenamento em Arrays

Funções podem ser armazenadas em arrays, permitindo a execução dinâmica.

```jsx
const operacoes = [
  function(a, b) { return a + b; },
  function(a, b) { return a - b; },
  function(a, b) { return a * b; },
  function(a, b) { return a / b; }
];

console.log(operacoes[0](5, 3)); // 8 (adição)
console.log(operacoes[2](5, 3)); // 15 (multiplicação)

```

### Armazenamento em Objetos

Armazenar funções em objetos permite criar métodos que operam sobre os dados do objeto.

```jsx
const calculadora = {
  somar: function(a, b) {
    return a + b;
  },
  subtrair: function(a, b) {
    return a - b;
  },
  multiplicar: function(a, b) {
    return a * b;
  },
  dividir: function(a, b) {
    return a / b;
  }
};

console.log(calculadora.somar(10, 5)); // 15
console.log(calculadora.dividir(10, 2)); // 5

```

Com **Method Shorthand**, a sintaxe pode ser simplificada:

```jsx
const calculadora = {
  somar(a, b) {
    return a + b;
  },
  // ... outros métodos
};

```

## Passando Funções como Argumentos

Passar funções como argumentos para outras funções é uma prática comum em JavaScript, especialmente ao trabalhar com **Higher-Order Functions** e **Callbacks**.

### Exemplo Simples

```jsx
function cumprimentar(nome, saudacaoFunc) {
  console.log(saudacaoFunc(nome));
}

function saudacaoEmPortugues(nome) {
  return `Olá, ${nome}!`;
}

function saudacaoEmIngles(nome) {
  return `Hello, ${nome}!`;
}

cumprimentar("Ana", saudacaoEmPortugues); // Olá, Ana!
cumprimentar("John", saudacaoEmIngles);   // Hello, John!

```

### Uso de Arrow Functions

```jsx
cumprimentar("Maria", nome => `Oi, ${nome}!`); // Oi, Maria!

```

## Retornando Funções de Outras Funções

Funções podem retornar outras funções, permitindo a criação de **Funções de Fábrica** ou **Closures**.

### Exemplo Básico

```jsx
function criarMultiplicador(fator) {
  return function(numero) {
    return numero * fator;
  };
}

const dobrar = criarMultiplicador(2);
const triplicar = criarMultiplicador(3);

console.log(dobrar(5));    // 10
console.log(triplicar(5)); // 15

```

### Com Arrow Functions

```jsx
const criarMultiplicador = fator => numero => numero * fator;

const quadruplicar = criarMultiplicador(4);

console.log(quadruplicar(5)); // 20

```

## Higher-Order Functions (Funções de Ordem Superior)

**Higher-Order Functions** são funções que recebem outras funções como argumentos ou retornam funções como resultado. Elas são uma extensão natural das funções de primeira classe e são essenciais para a programação funcional em JavaScript.

### Exemplos Comuns de Higher-Order Functions

1. **`Array.prototype.map`**
    - Aplica uma função a cada elemento de um array e retorna um novo array com os resultados.
    
    ```jsx
    const numeros = [1, 2, 3, 4, 5];
    const quadrados = numeros.map(num => num * num);
    
    console.log(quadrados); // [1, 4, 9, 16, 25]
    
    ```
    
2. **`Array.prototype.filter`**
    - Filtra os elementos de um array com base em uma condição e retorna um novo array com os elementos que atendem à condição.
    
    ```jsx
    const pessoas = [
      { nome: "João", idade: 25 },
      { nome: "Maria", idade: 17 },
      { nome: "Pedro", idade: 30 }
    ];
    
    const adultos = pessoas.filter(pessoa => pessoa.idade >= 18);
    
    console.log(adultos);
    // [{ nome: "João", idade: 25 }, { nome: "Pedro", idade: 30 }]
    
    ```
    
3. **`Array.prototype.reduce`**
    - Reduz um array a um único valor, aplicando uma função acumuladora a cada elemento.
    
    ```jsx
    const numeros = [1, 2, 3, 4, 5];
    const soma = numeros.reduce((acumulador, atual) => acumulador + atual, 0);
    
    console.log(soma); // 15
    
    ```
    

### Criação de Higher-Order Functions

Você pode criar suas próprias Higher-Order Functions para abstrair comportamentos comuns.

```jsx
function repetir(n, func) {
  for (let i = 0; i < n; i++) {
    func(i);
  }
}

repetir(3, indice => console.log(`Repetição ${indice + 1}`));
// Repetição 1
// Repetição 2
// Repetição 3

```

## Callbacks

**Callbacks** são funções passadas como argumentos para outras funções e são chamadas (invocadas) após a conclusão de alguma operação. São fundamentais para lidar com operações assíncronas, como requisições HTTP, leitura de arquivos, eventos, etc.

### Exemplo de Callback Síncrono

```jsx
function executarCallback(callback) {
  console.log("Início da função executadora");
  callback();
  console.log("Fim da função executadora");
}

executarCallback(function() {
  console.log("Callback sendo executado");
});
// Saída:
// Início da função executadora
// Callback sendo executado
// Fim da função executadora

```

### Exemplo de Callback Assíncrono

```jsx
function esperarEExecutar(tempo, callback) {
  setTimeout(callback, tempo);
}

console.log("Antes da espera");

esperarEExecutar(2000, function() {
  console.log("Callback após 2 segundos");
});

console.log("Depois da espera");
// Saída:
// Antes da espera
// Depois da espera
// (Após 2 segundos) Callback após 2 segundos

```

### Problema do Callback Hell

O uso excessivo de callbacks aninhados pode levar a um código difícil de ler e manter, conhecido como "Callback Hell".

```jsx
login(usuario, function(error, user) {
  if (error) {
    console.error(error);
  } else {
    carregarDados(user, function(error, dados) {
      if (error) {
        console.error(error);
      } else {
        processarDados(dados, function(error, resultado) {
          if (error) {
            console.error(error);
          } else {
            console.log(resultado);
          }
        });
      }
    });
  }
});

```

Para mitigar esse problema, **Promises** e **Async/Await** são utilizados, reduzindo a profundidade do aninhamento e melhorando a legibilidade.

## Exemplos Práticos

### Função como Argumento em Eventos do DOM

Em desenvolvimento front-end, funções são frequentemente passadas como callbacks para manipulação de eventos.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Exemplo de Evento</title>
</head>
<body>
  <button id="meuBotao">Clique em mim</button>

  <script>
    const botao = document.getElementById("meuBotao");

    botao.addEventListener("click", function() {
      alert("Botão clicado!");
    });

    // Com Arrow Function
    botao.addEventListener("click", () => {
      console.log("Outro manipulador de clique");
    });
  </script>
</body>
</html>

```

### Retornando Funções para Criar Currying

**Currying** é uma técnica onde uma função com múltiplos argumentos é transformada em uma sequência de funções que recebem um único argumento.

```jsx
function curry(fn) {
  return function(a) {
    return function(b) {
      return fn(a, b);
    };
  };
}

function adicionar(a, b) {
  return a + b;
}

const adicionarCurried = curry(adicionar);
console.log(adicionarCurried(2)(3)); // 5

```

### Higher-Order Function para Logging

Criar uma Higher-Order Function que adiciona funcionalidades de logging a outras funções.

```jsx
function comLogging(fn) {
  return function(...args) {
    console.log(`Chamando função ${fn.name} com argumentos: ${args}`);
    const resultado = fn(...args);
    console.log(`Função ${fn.name} retornou: ${resultado}`);
    return resultado;
  };
}

function multiplicar(a, b) {
  return a * b;
}

const multiplicarComLogging = comLogging(multiplicar);
multiplicarComLogging(4, 5);
// Saída:
// Chamando função multiplicar com argumentos: 4,5
// Função multiplicar retornou: 20

```

## Boas Práticas

1. **Nomeação Clara e Descritiva:**
    - Utilize nomes que descrevam claramente a finalidade da função.
    - Exemplo: `calcularDesconto` é mais informativo que `func1`.
2. **Funções Pequenas e Focadas:**
    - Cada função deve ter uma única responsabilidade.
    - Facilita a manutenção, teste e reutilização.
3. **Imutabilidade:**
    - Evite alterar o estado global ou mutar os parâmetros passados.
    - Facilita o entendimento e previne efeitos colaterais inesperados.
4. **Evitar Dependências Desnecessárias:**
    - Funções devem depender o mínimo possível do contexto externo.
    - Torna-as mais reutilizáveis e testáveis.
5. **Utilizar Arrow Functions Quando Apropriado:**
    - Sintaxe mais concisa e comportamento de `this` mais previsível.
    - Ideal para funções anônimas e callbacks.
6. **Documentação:**
    - Documente o propósito, parâmetros e retorno das funções.
    - Facilita o entendimento para outros desenvolvedores e para futuras manutenções.

## Referências para Estudo Independente

- **Documentação Oficial do MDN:**
    - [Funções de Primeira Classe](https://developer.mozilla.org/pt-BR/docs/Glossary/First-class_function)
    - [Higher-Order Functions](https://developer.mozilla.org/pt-BR/docs/Glossary/Higher-order_function)
    - [Array.prototype.map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    - [Array.prototype.filter](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
    - [Array.prototype.reduce](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
    - [Callbacks](https://developer.mozilla.org/pt-BR/docs/Glossary/Callback_function)
- **Livros:**
    - *Eloquent JavaScript* por Marijn Haverbeke — [Eloquent JavaScript, 3rd Edition](https://eloquentjavascript.net/)
    - *You Don't Know JS* (série) por Kyle Simpson — [You Don't Know JS Yet](https://github.com/getify/You-Dont-Know-JS)
- **Cursos e Tutoriais:**
    - [FreeCodeCamp - JavaScript Algorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)
    - [Codecademy - Introduction to JavaScript](https://www.codecademy.com/learn/introduction-to-javascript)
    - [Udemy - The Complete JavaScript Course 2023: From Zero to Expert!](https://www.udemy.com/course/the-complete-javascript-course/)
- **Artigos e Blogs:**
    - [Funções de Alta Ordem no JavaScript](https://www.devmedia.com.br/funcoes-de-alta-ordem-em-javascript/39150)
    - [Understanding First-Class Functions in JavaScript](https://www.sitepoint.com/understanding-first-class-functions-javascript/)
    - [JavaScript Closures and First-Class Functions](https://javascript.info/closure)
- **Comunidades e Fóruns:**
    - [Stack Overflow - JavaScript Tag](https://stackoverflow.com/questions/tagged/javascript)
    - [Reddit - r/javascript](https://www.reddit.com/r/javascript/)
    - [DEV Community - JavaScript](https://dev.to/t/javascript)

---

## Conclusão

Entender e dominar o conceito de funções de primeira classe em JavaScript é essencial para escrever código eficiente, modular e escalável. Esse módulo abordou desde os fundamentos até exemplos práticos e boas práticas, fornecendo uma base sólida para avançar em tópicos mais complexos, como programação funcional, padrões de design e manipulação assíncrona. A prática contínua e a exploração de recursos adicionais recomendados fortalecerão ainda mais seu conhecimento e habilidade no uso de funções em JavaScript.