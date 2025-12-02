# Tipos de Declaração de Funções

Bem-vindo(a) ao Módulo 2, onde exploraremos, de forma minuciosa, os **tipos de declaração de funções** em JavaScript. Esse tema é essencial para compreender a linguagem em sua totalidade, pois as funções são um dos pilares fundamentais do JavaScript, e a forma como as declaramos tem impacto direto no comportamento do código.

---

## Sumário

1. [Introdução ao Conceito de Funções](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#introdu%C3%A7%C3%A3o-ao-conceito-de-fun%C3%A7%C3%B5es)
2. [Function Declaration (Declaração de Função)](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#function-declaration-declara%C3%A7%C3%A3o-de-fun%C3%A7%C3%A3o)
    - [Hoisting de Funções](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#hoisting-de-fun%C3%A7%C3%B5es)
    - [Vantagens e Desvantagens](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#vantagens-e-desvantagens)
    - [Exemplos de Código](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#exemplos-de-c%C3%B3digo-function-declaration)
3. [Function Expression (Expressão de Função)](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#function-expression-express%C3%A3o-de-fun%C3%A7%C3%A3o)
    - [Armazenando Funções em Variáveis](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#armazenando-fun%C3%A7%C3%B5es-em-vari%C3%A1veis)
    - [Funções Anônimas vs. Funções Nomeadas](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#fun%C3%A7%C3%B5es-an%C3%B4nimas-vs-fun%C3%A7%C3%B5es-nomeadas)
    - [Exemplos de Código](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#exemplos-de-c%C3%B3digo-function-expression)
4. [Arrow Functions (Funções de Seta)](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#arrow-functions-fun%C3%A7%C3%B5es-de-seta)
    - [Sintaxe Concisa](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#sintaxe-concisa)
    - [Diferenças de Comportamento do `this`](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#diferen%C3%A7as-de-comportamento-do-this)
    - [Boas Práticas e Exemplos](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#boas-pr%C3%A1ticas-e-exemplos)
5. [Outros Tópicos Importantes](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#outros-t%C3%B3picos-importantes)
6. [Referências para Estudo Independente](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#refer%C3%AAncias-para-estudo-independente)

---

## Introdução ao Conceito de Funções

Uma **função** em JavaScript é um bloco de código que é definido uma vez e pode ser executado (ou “chamado”) diversas vezes. As funções permitem organizar o código em partes lógicas, facilitando a manutenção, a leitura e a reutilização.

Há diversas **formas de declarar funções** em JavaScript, e cada uma possui características específicas. Neste módulo, analisaremos as três mais comuns:

1. **Function Declaration (Declaração de Função)**
2. **Function Expression (Expressão de Função)**
3. **Arrow Function (Função de Seta)**

Entender as diferenças entre elas — principalmente em relação ao **escopo**, **hoisting** e **contexto** (`this`) — é fundamental para escrever códigos mais claros, eficientes e livres de bugs.

---

## Function Declaration (Declaração de Função)

A **Function Declaration** (ou Declaração de Função) é a forma clássica e mais antiga de se declarar uma função em JavaScript.

```
function nomeDaFuncao(parâmetro1, parâmetro2) {
  // bloco de código
  return // valor de retorno (opcional)
}

```

### Hoisting de Funções

Um conceito fundamental associado às **Function Declarations** é o **hoisting**. Em JavaScript, o interpretador “move” automaticamente as declarações de função para o topo do escopo antes de executar o restante do código. Isso significa que você pode chamar uma função declarada dessa forma antes mesmo de escrevê-la no arquivo.

**Exemplo de hoisting**:

```
saudacao(); // "Olá, Mundo!"

function saudacao() {
  console.log("Olá, Mundo!");
}

```

Mesmo que a função `saudacao()` seja definida abaixo da chamada, o JavaScript faz o hoisting e tudo funciona corretamente.

### Vantagens e Desvantagens

- **Vantagens**:
    - Permite chamar a função em qualquer lugar do escopo, inclusive antes da declaração.
    - Mais fácil de ler e compreender para quem está acostumado com a forma tradicional de declarar funções.
- **Desvantagens**:
    - Pode gerar confusão em códigos grandes, pois a ordem de declaração e de chamada não é tão explícita.
    - A “flexibilidade” do hoisting pode, em alguns casos, levar a comportamentos inesperados caso você não esteja ciente desse mecanismo.

### Exemplos de Código (Function Declaration)

1. **Função simples que soma dois números:**
    
    ```
    function soma(a, b) {
      return a + b;
    }
    
    console.log(soma(2, 3)); // 5
    
    ```
    
2. **Função que exibe uma mensagem (sem return explícito):**
    
    ```
    function exibirMensagem() {
      console.log("Esta é uma mensagem!");
    }
    
    exibirMensagem(); // "Esta é uma mensagem!"
    
    ```
    

---

## Function Expression (Expressão de Função)

A **Function Expression** (ou Expressão de Função) é quando atribuímos uma função a uma variável ou constante. É uma forma mais “moderna” em comparação à declaração clássica, embora já exista há muito tempo na linguagem.

```
const nomeDaFuncao = function(parâmetro1, parâmetro2) {
  // bloco de código
  return // valor de retorno (opcional)
};

```

### Armazenando Funções em Variáveis

A grande diferença da **Function Expression** em relação à **Function Declaration** é que a função passa a fazer parte de uma **expressão**. Isto é, podemos **armazená-la** em variáveis, passá-la como argumento para outras funções, entre outras possibilidades.

- Isso permite maior flexibilidade em design de código.
- É a base para **funções de ordem superior** (higher-order functions).

### Funções Anônimas vs. Funções Nomeadas

Ao utilizar Function Expressions, podemos tanto escrever funções **anônimas** quanto nomeá-las (o que é menos comum, mas pode ser útil para facilitar a depuração em logs de erro).

```
// Função anônima atribuída a uma variável
const somar = function(a, b) {
  return a + b;
};

// Função nomeada atribuída a uma variável
const subtrair = function subtracao(a, b) {
  return a - b;
};

```

**Observação Importante:** A **Function Expression** não sofre hoisting do mesmo jeito que a Function Declaration. Se você tentar chamar a função antes de sua declaração (expressão), receberá um erro de referência.

**Exemplo**:

```
multiplicar(2, 3); // Erro: ReferenceError: Cannot access 'multiplicar' before initialization

const multiplicar = function(a, b) {
  return a * b;
};

```

### Exemplos de Código (Function Expression)

1. **Exemplo de função anônima em uma variável:**
    
    ```
    const dividir = function(a, b) {
      return a / b;
    };
    
    console.log(dividir(10, 2)); // 5
    
    ```
    
2. **Exemplo de uso de Function Expression em callbacks:**
    
    ```
    const numeros = [1, 2, 3, 4];
    const numerosDobrados = numeros.map(function(num) {
      return num * 2;
    });
    
    console.log(numerosDobrados); // [2, 4, 6, 8]
    
    ```
    

---

## Arrow Functions (Funções de Seta)

As **Arrow Functions**, introduzidas no ECMAScript 2015 (ES6), são uma forma mais concisa de escrever funções. Sua principal característica é a sintaxe curta e algumas diferenças de comportamento em relação ao `this`.

```
const nomeDaFuncao = (parâmetro1, parâmetro2) => {
  // bloco de código
  return // valor de retorno
};

```

### Sintaxe Concisa

- Se você tiver **apenas um parâmetro**, pode omitir os parênteses:
    
    ```
    const dobro = x => x * 2;
    
    ```
    
- Se o **corpo** da função for apenas um **retorno**, não é necessário usar `{}` nem `return`:
    
    ```
    const soma = (a, b) => a + b;
    
    ```
    

### Diferenças de Comportamento do `this`

Diferentemente das funções normais (declaradas ou expressas), **arrow functions não criam seu próprio contexto `this`**. Em vez disso, o `this` de uma arrow function **é o mesmo do escopo léxico** em que ela foi definida.

- Isso pode ser uma vantagem ao criar callbacks, pois não é preciso usar `.bind(this)` para manter o contexto.
- Por outro lado, **arrow functions não podem ser usadas como construtoras**, pois não possuem o comportamento de criação de instâncias (`new`).

**Exemplo**:

```
const objeto = {
  nome: "Exemplo",
  metodoRegular: function() {
    console.log(this.nome); // "Exemplo"
  },
  metodoArrow: () => {
    console.log(this.nome); // undefined (se estiver em modo estrito)
  }
};

objeto.metodoRegular(); // Exibe "Exemplo"
objeto.metodoArrow();   // Exibe "undefined" ou algum valor não esperado

```

No exemplo acima, `metodoArrow` não tem seu próprio `this`, então não faz referência ao objeto `objeto` como o `metodoRegular` faz.

### Boas Práticas e Exemplos

- Use arrow functions para **funções de “utilidade”** e **callbacks** simples, especialmente quando precisar **manter o contexto léxico**.
- Evite usá-las como métodos de objetos, pois o `this` não se comportará como em funções “normais”.
- Quando a função precisa ser usada como **construtora** (para criar objetos via `new`), nunca use arrow function.

```
// Exemplo: Filtrar números pares usando arrow function
const numeros = [1, 2, 3, 4, 5, 6];
const pares = numeros.filter(num => num % 2 === 0);
console.log(pares); // [2, 4, 6]

```

---

## Outros Tópicos Importantes

Além dos três tipos de declaração descritos, vale mencionar:

- **Generator Functions**: São declaradas com `function*` e possuem um comportamento especial de “pausa” e “retomada” via `yield`. Não se enquadram exatamente nas declarações convencionais, mas também são relevantes no ecossistema de funções em JS.
- **Async/Await**: Normalmente associadas às arrow functions ou function declarations, mas específicas para lidar com assincronismo de forma mais simples e intuitiva.

Esses tópicos, porém, serão explorados em módulos futuros (ou já foram listados em outros módulos da grade).

---

## Referências para Estudo Independente

1. **MDN Web Docs (Mozilla Developer Network)**
    - [Declaração de Função](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/function)
    - [Expressões de Função](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/function)
    - [Arrow Functions](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
2. **ECMAScript Language Specification**
    - [tc39.es/ecma262/](https://tc39.es/ecma262/) - Documento oficial que descreve o comportamento da linguagem. (Leitura avançada)
3. **Cursos e Tutoriais**
    - FreeCodeCamp
    - Codecademy
    - Udemy
    - Alura
4. **Comunidades e Fóruns**
    - [Stack Overflow](https://stackoverflow.com/) - Para tirar dúvidas específicas.
    - [GitHub](https://github.com/) - Analisar projetos open-source e ver exemplos de uso de funções no mundo real.

---

## Conclusão

Neste módulo, aprendemos que o JavaScript oferece diversas **formas de se declarar funções**, cada qual com seus benefícios e particularidades:

- **Function Declaration**: Sofre hoisting e pode ser chamada em qualquer lugar do escopo.
- **Function Expression**: Não sofre hoisting do mesmo jeito; a função é tratada como parte de uma expressão, e pode ser atribuída a variáveis ou constantes.
- **Arrow Function**: Sintaxe curta, não cria seu próprio `this`, sendo ideal para callbacks e situações em que queremos manter o contexto léxico.

Ao dominar esses conceitos, você terá mais segurança ao decidir **quando** e **como** usar cada tipo de função em diferentes cenários, escrevendo códigos mais claros, organizados e eficientes.