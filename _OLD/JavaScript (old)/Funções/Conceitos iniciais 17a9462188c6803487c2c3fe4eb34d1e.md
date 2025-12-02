# Conceitos iniciais

Bem-vindo(a) ao primeiro módulo de estudo sobre **funções em JavaScript**! Aqui, abordaremos os conceitos básicos para você começar a entender o que são funções, por que elas são importantes e como utilizá-las de maneira correta e eficiente. Este conteúdo servirá de base para tudo o que veremos nos próximos módulos.

---

## **Sumário**

1. [O que é uma função?](Conceitos%20iniciais%2017a9462188c6803487c2c3fe4eb34d1e.md)
2. [Funções Puras vs. Impuras](Conceitos%20iniciais%2017a9462188c6803487c2c3fe4eb34d1e.md)
3. [Vantagens de Modularizar o Código](Conceitos%20iniciais%2017a9462188c6803487c2c3fe4eb34d1e.md)
4. [Primeiro Contato com Funções em JavaScript](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#primeiro-contato-com-fun%C3%A7%C3%B5es-em-javascript)
    - [Sintaxe Básica de Declaração de Função](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#sintaxe-b%C3%A1sica-de-declara%C3%A7%C3%A3o-de-fun%C3%A7%C3%A3o)
    - [Invocação (Chamada) de Função](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#invoca%C3%A7%C3%A3o-chamada-de-fun%C3%A7%C3%A3o)
    - [Retorno e Valor Retornado](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#retorno-e-valor-retornado)
5. [Referências para Estudo Independente](https://chatgpt.com/c/6782e6b2-a3b8-8003-9ce5-4e879f5da7e1#refer%C3%AAncias-para-estudo-independente)

---

## **1. O que é uma função?**

Uma **função** é um bloco de código projetado para executar uma tarefa ou calcular um valor específico. Em outras palavras, é um conjunto de instruções que podem ser “chamadas” (invocadas) em diferentes partes do seu programa. As funções permitem que você **reutilize** código e **organize** melhor suas instruções lógicas.

Podemos pensar em uma função como uma “fábrica”:

- Ela pode receber **matéria-prima** (parâmetros/argumentos).
- Ela **processa** essas informações.
- Ela pode (ou não) **retornar** algo como resultado final (`return`).

### **Por que usar funções?**

- **Reutilização**: em vez de escrever o mesmo código várias vezes, você pode centralizar essa lógica em uma função e simplesmente chamá-la.
- **Organização**: separar sua aplicação em partes lógicas menores (cada função com sua responsabilidade) ajuda na leitura e manutenção do código.
- **Modularidade**: facilita a colaboração em equipes, pois cada desenvolvedor pode se concentrar em uma parte específica do sistema.

---

## **2. Funções Puras vs. Impuras**

A distinção entre **funções puras** e **funções impuras** é muito comum em linguagens funcionais e tem relevância crescente também em JavaScript, especialmente em padrões de arquitetura como Redux (no front-end) e aplicações server-side modernas.

- **Funções Puras**:
    - Não dependem de estado externo para funcionar corretamente (ou seja, as variáveis usadas estão na própria função ou são passadas como argumentos).
    - Não modificam nada “fora” do seu escopo (não alteram variáveis globais, por exemplo).
    - Dado o mesmo conjunto de parâmetros, sempre retornam o mesmo resultado.
    
    Exemplo de função pura:
    
    ```
    // Recebe dois números e retorna a soma dos mesmos
    function somar(a, b) {
      return a + b;
    }
    
    ```
    
- **Funções Impuras**:
    - Dependem de algo externo que pode mudar ao longo do tempo (por exemplo, uma variável global que não é passada como parâmetro).
    - Podem causar efeitos colaterais (alterar valores globais, manipular o DOM, escrever em arquivos etc.).
    - Seu resultado pode variar, mesmo com os mesmos parâmetros de entrada, dependendo de fatores externos.
    
    Exemplo de função impura:
    
    ```
    let contadorGlobal = 0;
    
    function incrementarContador() {
      contadorGlobal++;
      return contadorGlobal;
    }
    
    ```
    

**Por que se preocupar com isso?**

- Em geral, **funções puras** são mais previsíveis e mais fáceis de testar, pois não dependem de variáveis externas.
- Funções impuras são inevitáveis em muitos casos (ex.: acessar banco de dados, fazer requisições HTTP), porém, convém isolá-las ao máximo para facilitar a manutenção do código.

---

## **3. Vantagens de Modularizar o Código**

A ideia de “modularizar” se refere a **quebrar** seu programa em blocos menores — nesse caso, **funções** — cada um responsável por uma tarefa específica. Entre as principais vantagens, destacamos:

1. **Legibilidade**: dividir o código em funções pequenas e claras torna mais fácil entender o que cada parte faz.
2. **Reutilização**: se uma parte do código for utilizada em vários lugares, basta chamar a mesma função.
3. **Manutenção**: se algo precisar mudar, você altera apenas o código dentro de uma função, sem afetar o restante do sistema.
4. **Teste**: testar funções isoladamente costuma ser mais simples, pois cada função tem um escopo de responsabilidade limitado.

Em projetos reais, essa organização por meio de funções (e mais tarde módulos, componentes etc.) faz toda a diferença na escalabilidade do software.

---

## **4. Primeiro Contato com Funções em JavaScript**

Vamos agora colocar a mão na massa. Nesta subseção, veremos como se declara uma função, como chamá-la e como lidar com valores de retorno.

### **4.1. Sintaxe Básica de Declaração de Função**

Em JavaScript, a forma mais tradicional de declarar uma função é:

```
function nomeDaFuncao(parâmetro1, parâmetro2) {
  // Bloco de código que será executado
  return algumValor; // (opcional)
}

```

- **function**: palavra-chave que indica que estamos declarando uma função.
- **nomeDaFuncao**: identificador (nome) que usaremos para chamar a função em outras partes do código.
- **parâmetros**: variáveis que a função espera receber quando for chamada (podem ser zero, um ou vários).
- **bloco de código**: entre `{ }`, colocamos as instruções que formam o corpo da função.
- **return**: a instrução que encerra a função e pode devolver algum valor para quem a chamou.

Exemplo simples:

```
function saudacao() {
  console.log("Olá, mundo!");
}

```

Essa função não recebe parâmetros e não retorna explicitamente nada (mas faz um **efeito colateral** de imprimir algo no console).

### **4.2. Invocação (Chamada) de Função**

Para **chamar** (invocar) a função, basta escrever seu nome seguido de parênteses:

```
saudacao(); // "Olá, mundo!"

```

Caso sua função receba parâmetros, você deve fornecê-los nessa chamada:

```
function exibirMensagem(mensagem) {
  console.log(mensagem);
}

exibirMensagem("Bem-vindo(a) aos estudos de JavaScript!");

```

### **4.3. Retorno e Valor Retornado**

Uma função em JavaScript pode (ou não) retornar um valor. Quando usamos a palavra-chave **`return`**, ela interrompe a execução da função e devolve o valor especificado.

```
function somar(a, b) {
  return a + b;
}

const resultado = somar(3, 4);
console.log(resultado); // 7

```

- Quando a função encontra a palavra `return`, **ela finaliza** e devolve o que estiver sendo retornado.
- Se não houver `return`, a função retorna implicitamente `undefined` em JavaScript.

**Por que `return` é importante?**

- Permite que a função seja usada como parte de expressões maiores:
    
    ```
    const dobro = somar(3, 4) * 2; // Aqui aproveitamos o retorno da função somar
    
    ```
    
- Facilita a criação de funções compostas, onde uma chama outra e aproveita seus resultados.

---

## **5. Referências para Estudo Independente**

Para aprofundar seus estudos, recomendo visitar:

1. [**MDN Web Docs (Mozilla Developer Network)**](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
    - Documentação oficial da Mozilla com exemplos ricos e explicações detalhadas sobre funções em JavaScript.
2. [**W3Schools - JavaScript Functions**](https://www.w3schools.com/js/js_functions.asp)
    - Abordagem simplificada e direta para quem está começando.
3. [**ECMAScript Language Specification**](https://tc39.es/ecma262/)
    - Para quem deseja ir a fundo no padrão ECMAScript. Pode ser um pouco mais avançado, mas vale a pena como referência técnica.
4. **Cursos Online**
    - Plataformas como **FreeCodeCamp**, **Alura**, **Udemy**, **Codecademy** têm cursos que abordam funções em JavaScript, indo do básico ao avançado.

---

## **Conclusão**

Neste primeiro módulo, você conheceu:

- A definição e a importância das funções.
- As diferenças fundamentais entre **funções puras** e **impuras**.
- As vantagens da **modularização** para a organização do código.
- A **sintaxe básica**, incluindo **declaração**, **chamada** e **retorno** de uma função.

Esses conceitos são a pedra fundamental para qualquer pessoa que queira escrever códigos mais limpos, manuteníveis e organizados em JavaScript. A partir daqui, você estará pronto para avançar para temas mais específicos, como **diferentes tipos de declaração de funções**, **escopos**, **contexto `this`**, **arrow functions**, e muito mais!

Boa jornada de estudos!