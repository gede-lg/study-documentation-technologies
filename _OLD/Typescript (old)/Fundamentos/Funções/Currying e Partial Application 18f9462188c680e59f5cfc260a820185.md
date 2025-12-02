# Currying e Partial Application

Este documento apresenta uma explicação detalhada sobre **Currying** e **Partial Application** no contexto de funções puras e composição funcional utilizando TypeScript. Através deste conteúdo, você entenderá os conceitos fundamentais, suas aplicações práticas e como esses padrões podem contribuir para um código mais modular, reutilizável e legível.

---

## Sumário

1. [Introdução](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#introdu%C3%A7%C3%A3o)
2. [Conteúdo Detalhado](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#conte%C3%BAdo-detalhado)
2.1. [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
2.2. [Sintaxe e Estrutura](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#sintaxe-e-estrutura)
2.3. [Componentes Principais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#componentes-principais)
2.4. [Uso Avançado](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#uso-avan%C3%A7ado)
3. [Exemplos de Código Otimizados](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#exemplos-de-c%C3%B3digo-otimizados)
4. [Informações Adicionais](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#informa%C3%A7%C3%B5es-adicionais)
5. [Referências para Estudo Independente](https://chatgpt.com/c/67a13af9-f1c4-8003-8148-7daff446d1b7#refer%C3%AAncias-para-estudo-independente)

---

## Introdução

Em programação funcional, **Currying** e **Partial Application** são técnicas que permitem transformar funções, possibilitando a criação de funções mais especializadas a partir de funções mais genéricas. Essas abordagens promovem a composição funcional, onde funções menores e puras são combinadas para construir lógicas mais complexas, contribuindo para um código mais modular e fácil de testar.

- **Currying**: Técnica de transformar uma função que aceita múltiplos argumentos em uma cadeia de funções que aceita um único argumento cada.
- **Partial Application (Aplicação Parcial)**: Processo de fixar alguns argumentos de uma função, produzindo uma nova função que espera os argumentos restantes.

Ambas as técnicas são especialmente úteis em linguagens com forte suporte à programação funcional, como TypeScript, permitindo a criação de funções reutilizáveis e componíveis.

---

## Conteúdo Detalhado

### Definição e Conceitos Fundamentais

- **Currying**:
    
    O **currying** é o processo de transformar uma função de múltiplos argumentos em uma sequência de funções, cada uma com um único argumento. Essa transformação permite que você chame a função de forma parcial, criando funções intermediárias que aguardam os argumentos restantes.
    
    **Exemplo Conceitual**:
    
    Uma função `f(a, b, c)` pode ser transformada em `f(a)(b)(c)`.
    
- **Partial Application**:
    
    A **aplicação parcial** consiste em fixar um ou mais argumentos de uma função, criando uma nova função que espera os argumentos não fixados. Ao contrário do currying, não há obrigatoriedade de que a função resultante aceite somente um argumento de cada vez.
    
    **Exemplo Conceitual**:
    
    Se temos `f(a, b, c)`, podemos fixar `a` e criar uma nova função `g(b, c)` onde `g(b, c) = f(a, b, c)`.
    
- **Diferenças e Relações**:
    - O **currying** transforma uma função multi-argumento em uma cadeia de funções unárias.
    - A **aplicação parcial** fixa alguns argumentos, mas a função resultante pode aceitar múltiplos argumentos simultaneamente.
    - Ambas as técnicas podem ser combinadas para criar funções mais flexíveis e reutilizáveis.

### Sintaxe e Estrutura

Em TypeScript, funções podem ser declaradas de diversas maneiras (funções anônimas, arrow functions, etc.), e ambas as técnicas podem ser implementadas de forma direta:

- **Currying**:
    
    Uma função curried pode ser escrita utilizando arrow functions para retornar funções aninhadas:
    
    ```tsx
    // Função curried para somar dois números
    const add = (a: number) => (b: number): number => a + b;
    
    // Uso:
    const addTwo = add(2);
    console.log(addTwo(3)); // Saída: 5
    // Ou diretamente:
    console.log(add(2)(3)); // Saída: 5
    
    ```
    
- **Partial Application**:
    
    Pode ser implementada fixando alguns dos argumentos de uma função:
    
    ```tsx
    // Função que multiplica três números
    const multiply = (a: number, b: number, c: number): number => a * b * c;
    
    // Função de aplicação parcial, fixando o primeiro argumento
    const partialMultiply = (a: number) => (b: number, c: number): number => multiply(a, b, c);
    
    // Uso:
    const multiplyByTwo = partialMultiply(2);
    console.log(multiplyByTwo(3, 4)); // Saída: 24 (2 * 3 * 4)
    
    ```
    

### Componentes Principais

1. **Funções**:
    
    As funções são os blocos de construção para ambas as técnicas. Elas podem ser tratadas como cidadãos de primeira classe, ou seja, podem ser passadas como argumentos, retornadas de outras funções, e atribuídas a variáveis.
    
2. **Métodos e Propriedades**:
    - **Retorno de Funções**:
    No currying, cada função retorna outra função que recebe o próximo argumento.
    - **Fixação de Argumentos**:
    Na aplicação parcial, uma função retorna uma nova função com alguns argumentos pré-definidos.
3. **Interação entre Currying e Partial Application**:
    - **Composição Funcional**:
    Ambas as técnicas facilitam a composição de funções, onde funções menores podem ser combinadas para formar funções mais complexas.
    - **Reutilização de Código**:
    Ao fixar argumentos comuns, é possível criar versões especializadas de funções que podem ser reutilizadas em diferentes partes do código.

### Uso Avançado

- **Composição de Funções**:
    
    Utilizando currying e partial application, é possível compor funções para criar pipelines de dados. Por exemplo, em um cenário onde você processa dados de entrada através de múltiplas transformações, pode criar funções especializadas para cada etapa do processo.
    
- **Interoperabilidade com Funções de Ordem Superior**:
    
    Muitas bibliotecas de programação funcional (como Ramda ou Lodash/fp) fazem uso intensivo dessas técnicas, permitindo a criação de funções compostas e altamente reutilizáveis.
    
- **Exemplo Real**:
    
    Imagine uma função que valida e processa um formulário. Você pode curryar a função de validação e aplicar parcialmente os parâmetros de configuração, criando funções especializadas para diferentes formulários da sua aplicação.
    
    ```tsx
    // Função para validar um campo
    const validateField = (rules: string[]) => (value: string): boolean => {
      // Exemplo simples de validação: verifica se o valor não é vazio e contém um determinado padrão
      if (rules.includes('required') && value.trim() === '') {
        return false;
      }
      // Adicione outras regras conforme necessário
      return true;
    };
    
    // Uso:
    const validateRequired = validateField(['required']);
    console.log(validateRequired(""));       // Saída: false
    console.log(validateRequired("valor"));  // Saída: true
    
    ```
    

---

## Exemplos de Código Otimizados

A seguir, alguns exemplos práticos que demonstram tanto o uso básico quanto o avançado de currying e partial application em TypeScript.

### Exemplo 1: Função Curried para Soma

```tsx
// Função curried que soma dois números
const add = (a: number) => (b: number): number => a + b;

// Uso básico
const addFive = add(5);
console.log(addFive(10)); // Saída: 15

// Uso direto
console.log(add(3)(7)); // Saída: 10

```

### Exemplo 2: Aplicação Parcial em Multiplicação

```tsx
// Função que multiplica três números
const multiply = (a: number, b: number, c: number): number => a * b * c;

// Aplicação parcial fixando o primeiro argumento
const multiplyByTwo = (b: number, c: number): number => multiply(2, b, c);

console.log(multiplyByTwo(3, 4)); // Saída: 24 (2 * 3 * 4)

```

### Exemplo 3: Composição Funcional com Currying

```tsx
// Função que converte uma string para maiúsculas
const toUpperCase = (str: string): string => str.toUpperCase();

// Função que adiciona um sufixo
const addSuffix = (suffix: string) => (str: string): string => `${str}${suffix}`;

// Função que compõe duas funções
const compose = <T, U, V>(f: (y: U) => V, g: (x: T) => U) => (x: T): V => f(g(x));

// Compondo funções: converte para maiúsculas e adiciona um sufixo
const shoutWithExclamation = compose(addSuffix('!'), toUpperCase);

console.log(shoutWithExclamation("hello")); // Saída: "HELLO!"

```

---

## Informações Adicionais

- **Funções Puras**:
    
    Tanto o currying quanto a aplicação parcial incentivam o uso de funções puras, que não possuem efeitos colaterais, facilitando testes unitários e raciocínio sobre o código.
    
- **Benefícios na Manutenção**:
    
    A modularidade e a composição promovidas por essas técnicas resultam em código mais legível e fácil de manter, já que cada função realiza uma única tarefa bem definida.
    
- **Interoperabilidade com Bibliotecas Funcionais**:
    
    Bibliotecas como [Ramda](https://ramdajs.com/) e [Lodash/fp](https://lodash.com/docs/4.17.15) fazem uso intensivo de currying e aplicação parcial, proporcionando ferramentas adicionais para a composição funcional.
    
- **Performance**:
    
    Embora o uso de funções aninhadas (currying) possa introduzir um pequeno overhead, os benefícios em termos de clareza e manutenção geralmente superam esse custo. Em aplicações de alta performance, é importante balancear legibilidade e otimização.
    

---

## Referências para Estudo Independente

Para aprofundar seus conhecimentos sobre currying, partial application e composição funcional em TypeScript, confira os seguintes recursos:

- **Documentação do TypeScript**:
    
    [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
    
- **Artigos e Tutoriais**:
    - [Currying and Partial Application in JavaScript](https://medium.com/@dan_abramov/why-does-react-fiber-use-recursion-3e0f49fc4c57) – Artigo explicativo (apesar de ser em JavaScript, os conceitos se aplicam a TypeScript).
    - [Understanding Currying in JavaScript](https://dev.to/lydiahallie/javascript-visualized-curry-1h2m) – Tutorial visual.
- **Livros**:
    - *"Functional Programming in JavaScript"* por Luis Atencio
    - *"Functional-Light JavaScript"* por Kyle Simpson
- **Bibliotecas Funcionais**:
    - [Ramda Documentation](https://ramdajs.com/docs/)
    - [Lodash/fp Documentation](https://lodash.com/docs/4.17.15)

---

Este guia detalhado fornece uma base sólida sobre currying e partial application em TypeScript, demonstrando como essas técnicas podem ser aplicadas para criar funções puras e composições funcionais que melhoram a modularidade e a reutilização do código. Aproveite os exemplos e referências para expandir seus conhecimentos e aprimorar suas práticas de desenvolvimento!