# Funções Geradoras (Generators)

## Introdução

As **funções geradoras** (generators) são uma funcionalidade avançada de JavaScript que permite criar funções capazes de pausar sua execução e retomar posteriormente, fornecendo um meio poderoso para controlar o fluxo de execução de maneira eficiente e flexível. Introduzidas no ECMAScript 2015 (ES6), as generators são especialmente úteis para tarefas como iteração personalizada, gerenciamento de estado e implementação de fluxos de dados assíncronos.

Este módulo visa fornecer uma compreensão profunda sobre **Funções Geradoras** em JavaScript, abordando desde os conceitos básicos até aplicações avançadas, com exemplos práticos para ilustrar cada tópico.

---

## Sumário

1. [O que são Funções Geradoras?](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
2. [Sintaxe de Funções Geradoras](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
3. [O Objeto Generator](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
4. [Iteradores e Iteráveis](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
5. [Métodos `next()`, `throw()` e `return()`](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
6. [Uso de `yield`](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
7. [Iterando com Generators](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
8. [Generators e Fluxos Assíncronos](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
9. [Casos de Uso Comuns](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
10. [Boas Práticas](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)
11. [Referências para Estudo Independente](Fun%C3%A7%C3%B5es%20Geradoras%20(Generators)%2017a9462188c68079ba9bdfb9904df3e1.md)

---

## O que são Funções Geradoras?

**Funções Geradoras** são funções especiais que podem ser pausadas e retomadas em qualquer ponto de sua execução. Elas são definidas usando a sintaxe `function*` e utilizam a palavra-chave `yield` para produzir valores sequencialmente. Ao contrário das funções tradicionais que executam todo o seu código de uma vez, as generators permitem que o fluxo de execução seja controlado, retornando valores conforme solicitado.

**Características Principais:**

- **Pauses e Resumes:** Capacidade de pausar a execução e retomar posteriormente.
- **Iteração Personalizada:** Facilita a criação de iteradores personalizados.
- **Manutenção de Estado:** Mantém o estado interno entre as execuções.
- **Fluxos de Dados Complexos:** Ideal para manipular fluxos de dados assíncronos de forma mais legível.

---

## Sintaxe de Funções Geradoras

A sintaxe básica para definir uma função geradora envolve o uso do asterisco (`*`) após a palavra-chave `function`. Dentro da função, a palavra-chave `yield` é usada para produzir valores.

```jsx
function* minhaGenerator() {
  yield 'Primeiro valor';
  yield 'Segundo valor';
  return 'Valor final';
}

```

**Pontos a Notar:**

- **`function*`:** Indica que a função é uma generator.
- **`yield`:** Produz um valor e pausa a execução até a próxima chamada de `next()`.
- **`return`:** Finaliza a generator e opcionalmente retorna um valor final.

---

## O Objeto Generator

Ao chamar uma função geradora, ela não executa imediatamente. Em vez disso, retorna um **objeto Generator**, que é um tipo de iterador. Este objeto permite controlar a execução da generator através de seus métodos.

```jsx
const generator = minhaGenerator();

```

**Características do Objeto Generator:**

- **Iterador:** Implementa o protocolo de iterador, possuindo o método `next()`.
- **Estado Interno:** Mantém o estado da execução, permitindo continuar de onde parou.
- **Métodos Especiais:** Além de `next()`, possui métodos como `throw()` e `return()` para manipulação avançada.

---

## Iteradores e Iteráveis

Para compreender completamente as generators, é essencial entender os conceitos de **Iteradores** e **Iteráveis**.

- **Iterador:** Objeto que implementa o método `next()`, retornando objetos com `{ value, done }`.
- **Iterável:** Objeto que possui o método `[Symbol.iterator]()`, que retorna um iterador.

As generators produzem objetos iteradores que são também iteráveis, permitindo seu uso em estruturas como loops `for...of`.

```jsx
for (const valor of minhaGenerator()) {
  console.log(valor);
}
// Saída:
// "Primeiro valor"
// "Segundo valor"

```

---

## Métodos `next()`, `throw()` e `return()`

O objeto Generator possui três métodos principais para controlar sua execução:

### 1. `next([value])`

- **Descrição:** Avança a execução da generator até o próximo `yield` ou `return`.
- **Parâmetro Opcional:** Envia um valor para ser usado como resultado da última expressão `yield`.
- **Retorno:** Objeto `{ value, done }`.

**Exemplo:**

```jsx
function* contador() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const gen = contador();

console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next()); // { value: 1, done: false }

```

### 2. `throw(error)`

- **Descrição:** Lança um erro na generator, permitindo o tratamento de exceções dentro dela.
- **Parâmetro:** Objeto de erro a ser lançado.
- **Retorno:** Objeto `{ value, done }` ou lança o erro se não for capturado.

**Exemplo:**

```jsx
function* exemploThrow() {
  try {
    yield 'Antes do erro';
    yield 'Este não será executado';
  } catch (e) {
    console.log('Erro capturado dentro da generator:', e.message);
  }
}

const gen = exemploThrow();

console.log(gen.next()); // { value: 'Antes do erro', done: false }
gen.throw(new Error('Algo deu errado'));
// Console: "Erro capturado dentro da generator: Algo deu errado"

```

### 3. `return([value])`

- **Descrição:** Finaliza a execução da generator, opcionalmente retornando um valor final.
- **Parâmetro Opcional:** Valor a ser retornado.
- **Retorno:** Objeto `{ value, done: true }`.

**Exemplo:**

```jsx
function* exemploReturn() {
  yield 'Primeiro';
  yield 'Segundo';
  return 'Finalizando';
}

const gen = exemploReturn();

console.log(gen.next()); // { value: 'Primeiro', done: false }
console.log(gen.next()); // { value: 'Segundo', done: false }
console.log(gen.next()); // { value: 'Finalizando', done: true }
console.log(gen.next()); // { value: undefined, done: true }

```

---

## Uso de `yield`

A palavra-chave `yield` é fundamental para as generators, permitindo que a execução seja pausada e um valor seja produzido. Cada vez que `yield` é encontrado, a generator produz o valor e aguarda a próxima chamada de `next()` para continuar.

**Características do `yield`:**

- **Produção de Valores:** Envia um valor ao iterador externo.
- **Recepção de Valores:** Pode receber valores enviados através de `next(value)`.
- **Expressões `yield`:** Pode ser usado em expressões para controlar fluxo de dados.

**Exemplo Simples:**

```jsx
function* saudacoes() {
  const saudacao1 = yield 'Olá';
  console.log(saudacao1); // "Como vai?"
  const saudacao2 = yield 'Tudo bem?';
  console.log(saudacao2); // "Até logo!"
}

const gen = saudacoes();

console.log(gen.next()); // { value: 'Olá', done: false }
console.log(gen.next('Como vai?'));
// Console: "Como vai?"
// { value: 'Tudo bem?', done: false }
console.log(gen.next('Até logo!'));
// Console: "Até logo!"
// { value: undefined, done: true }

```

---

## Iterando com Generators

As generators são frequentemente usadas para criar iteradores personalizados. Utilizando loops `for...of`, é possível iterar sobre os valores produzidos por uma generator de forma elegante.

**Exemplo de Iteração com `for...of`:**

```jsx
function* letras() {
  yield 'A';
  yield 'B';
  yield 'C';
}

for (const letra of letras()) {
  console.log(letra);
}
// Saída:
// "A"
// "B"
// "C"

```

**Integração com Estruturas de Dados:**

Generators podem ser usados para iterar sobre qualquer estrutura de dados, permitindo personalizar a lógica de iteração.

```jsx
const numeros = [1, 2, 3, 4, 5];

function* filtroPar(arr) {
  for (const num of arr) {
    if (num % 2 === 0) {
      yield num;
    }
  }
}

for (const par of filtroPar(numeros)) {
  console.log(par);
}
// Saída:
// 2
// 4

```

---

## Generators e Fluxos Assíncronos

Antes do advento de `async/await`, generators eram uma das principais abordagens para lidar com código assíncrono de maneira mais síncrona e legível. Combinadas com bibliotecas como **Co** ou **Thunk**, as generators permitiam controlar fluxos assíncronos com mais clareza.

**Exemplo com Promises:**

```jsx
const fetch = require('node-fetch'); // Supondo uso em Node.js

function* fetchDados() {
  try {
    const resposta = yield fetch('<https://api.exemplo.com/dados>');
    const dados = yield resposta.json();
    console.log(dados);
  } catch (erro) {
    console.error('Erro:', erro);
  }
}

function executarGenerator(gen) {
  const iterator = gen();

  function processar(result) {
    if (result.done) return;
    result.value
      .then(res => processar(iterator.next(res)))
      .catch(err => iterator.throw(err));
  }

  try {
    processar(iterator.next());
  } catch (err) {
    console.error('Erro não capturado:', err);
  }
}

executarGenerator(fetchDados);

```

**Observações:**

- **Complexidade:** A abordagem com generators para assincronismo é menos intuitiva que `async/await` e requer mais código boilerplate.
- **Modernidade:** Atualmente, `async/await` é preferido pela sua simplicidade e integração nativa no JavaScript.

---

## Casos de Uso Comuns

### 1. **Iteração Personalizada**

Permite criar formas de iteração específicas que não são possíveis com iteradores padrão.

**Exemplo: Fibonacci:**

```jsx
function* fibonacci() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fib = fibonacci();

for (let i = 0; i < 10; i++) {
  console.log(fib.next().value);
}
// Saída: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34

```

### 2. **Gerenciamento de Estado**

Mantém o estado interno de maneira limpa e eficiente.

**Exemplo: Contador com Limite:**

```jsx
function* contadorLimite(max) {
  let count = 0;
  while (count < max) {
    yield count++;
  }
}

const contador = contadorLimite(3);

console.log(contador.next()); // { value: 0, done: false }
console.log(contador.next()); // { value: 1, done: false }
console.log(contador.next()); // { value: 2, done: false }
console.log(contador.next()); // { value: undefined, done: true }

```

### 3. **Fluxos de Dados Complexos**

Ideal para gerenciar pipelines de dados onde a produção e consumo de dados precisam ser controlados.

**Exemplo: Pipeline de Processamento:**

```jsx
function* processarDados() {
  const dados = yield 'Iniciando processamento';
  const dadosProcessados = dados.map(item => item * 2);
  yield dadosProcessados;
}

const pipeline = processarDados();

console.log(pipeline.next()); // { value: 'Iniciando processamento', done: false }
console.log(pipeline.next([1, 2, 3])); // { value: [2, 4, 6], done: false }
console.log(pipeline.next()); // { value: undefined, done: true }

```

---

## Boas Práticas

1. **Uso Adequado de `yield`:** Evite usar `yield` em funções que não se beneficiam da pausa e retomada, para manter a simplicidade.
2. **Encapsulamento de Estado:** Utilize generators para encapsular e gerenciar estados complexos sem expor variáveis globais.
3. **Manutenção de Código:** Com generators, mantenha a lógica de iteração clara e documentada para facilitar a manutenção.
4. **Evite Abusos:** Embora poderosas, generators podem introduzir complexidade desnecessária se usadas inadequadamente. Use-as quando realmente agregarem valor.
5. **Integração com Outras Funcionalidades:** Combine generators com outras funcionalidades modernas, como `async/await`, para soluções mais robustas.

---

## Referências para Estudo Independente

1. **Documentação Oficial:**
    - [MDN Web Docs - Generator Function](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Generator)
    - [MDN Web Docs - Iteration Protocols](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Iterators_and_Generators)
2. **Livros e Artigos:**
    - **"You Don't Know JS: ES6 & Beyond"** de Kyle Simpson - Aborda profundamente as features de ES6, incluindo generators.
    - **"Eloquent JavaScript"** de Marijn Haverbeke - Possui capítulos dedicados a generators e iteradores.
3. **Tutoriais Online:**
    - [Tutorial de Generators no JavaScript.info](https://javascript.info/generators)
    - [Curso de Generators na freeCodeCamp](https://www.freecodecamp.org/news/generators-in-javascript/)
4. **Vídeos e Cursos:**
    - **YouTube:** Vídeos explicativos sobre generators, como os do canal [Fun Fun Function](https://www.youtube.com/user/mpjme).
    - **Plataformas de Ensino:** Cursos específicos em plataformas como [Udemy](https://www.udemy.com/) e [Egghead.io](https://egghead.io/) sobre generators e iteradores.
5. **Bibliotecas e Ferramentas:**
    - **Co:** Biblioteca que facilita o uso de generators para assincronismo.
        - [Repositório no GitHub](https://github.com/tj/co)
    - **Redux-Saga:** Utiliza generators para gerenciar efeitos colaterais em aplicações React.
        - [Documentação Oficial](https://redux-saga.js.org/)
6. **Comunidades e Fóruns:**
    - **Stack Overflow:** Perguntas e respostas sobre usos específicos de generators.
    - **Reddit - r/javascript:** Discussões e exemplos práticos de generators.

---

## Conclusão

As **Funções Geradoras** são uma ferramenta poderosa no arsenal de um desenvolvedor JavaScript, proporcionando controle refinado sobre o fluxo de execução e facilitando a criação de iteradores personalizados e gerenciamento de estado. Embora sejam uma funcionalidade avançada, compreender e dominar generators pode levar a soluções mais elegantes e eficientes para problemas complexos em programação.

Recomenda-se praticar a criação de generators em diferentes contextos e explorar suas integrações com outras funcionalidades da linguagem para aproveitar ao máximo seu potencial.