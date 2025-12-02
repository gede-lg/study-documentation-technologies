# Introdução

## 1. Introdução

O tratamento de erros é uma parte fundamental do desenvolvimento de software, permitindo que os programas lidem de maneira elegante e previsível com situações inesperadas e falhas durante a execução. Em TypeScript, essa abordagem ganha nuances importantes devido à forte tipagem, que possibilita definir, de forma clara, os tipos de erros e as situações onde o fluxo de execução pode ser interrompido. Este documento aborda, de forma detalhada, conceitos como a tipagem de objetos de erro e o uso do tipo `never` em fluxos que sempre lançam exceções, explicando tanto os fundamentos quanto casos de uso avançados.

---

## 2. Sumário

- [Introdução](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#1-introdu%C3%A7%C3%A3o)
- [Definição e Conceitos Fundamentais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#3-defini%C3%A7%C3%A3o-e-conceitos-fundamentais)
    - [Tratamento de Erros](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#tratamento-de-erros)
    - [Tipagem de Objetos de Erro](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#tipagem-de-objetos-de-erro)
    - [Uso do `never`](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#uso-do-never)
- [Sintaxe e Estrutura](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#4-sintaxe-e-estrutura)
- [Componentes Principais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#5-componentes-principais)
- [Uso Avançado](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#6-uso-avan%C3%A7ado)
- [Exemplos de Código Otimizados](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#7-exemplos-de-c%C3%B3digo-otimizados)
- [Informações Adicionais](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#8-informa%C3%A7%C3%B5es-adicionais)
- [Referências para Estudo Independente](https://chatgpt.com/c/67a22ce2-8578-8003-a4b4-36cbf36efed4#9-refer%C3%AAncias-para-estudo-independente)

---

## 3. Definição e Conceitos Fundamentais

### Tratamento de Erros

O tratamento de erros envolve a detecção, a interceptação e a resolução de situações inesperadas que podem ocorrer durante a execução do código. Em TypeScript, a robustez do sistema de tipos permite que essas situações sejam tratadas de forma mais segura e previsível.

### Tipagem de Objetos de Erro

Em JavaScript, os erros geralmente são instâncias de `Error` ou de classes que estendem `Error`. TypeScript permite que você defina tipos personalizados para objetos de erro, garantindo que os atributos e métodos esperados estejam disponíveis e que o código que os manipula esteja ciente de sua estrutura.

- **Conceito Básico:**
    
    Usar a classe `Error` padrão ou uma subclasse dela para representar erros.
    
- **Conceito Avançado:**
    
    Definir interfaces ou classes customizadas que descrevam propriedades específicas dos erros. Isso é útil em grandes aplicações onde diferentes tipos de erros precisam ser tratados de forma diferenciada.
    

### Uso do `never`

O tipo `never` em TypeScript representa valores que nunca ocorrem. É particularmente útil para funções que **sempre** lançam uma exceção ou que entram em loops infinitos. Ao declarar o tipo de retorno de uma função como `never`, você informa ao compilador e aos outros desenvolvedores que o fluxo normal de execução não continuará após essa função.

- **Exemplo de Fluxo com `never`:**
Uma função que lança uma exceção e, portanto, nunca retorna um valor.

---

## 4. Sintaxe e Estrutura

### Tratamento Básico com `try-catch`

A estrutura básica para o tratamento de erros em TypeScript é similar à do JavaScript:

```tsx
try {
  // Bloco de código que pode lançar uma exceção
  throw new Error("Algo deu errado!");
} catch (error) {
  // Tratamento do erro
  console.error("Erro capturado:", error);
}

```

### Tipagem do Objeto de Erro

Para melhorar a segurança dos tipos, podemos definir uma interface para nossos erros customizados:

```tsx
interface CustomError extends Error {
  code?: number;
  details?: string;
}

function processAction(): void {
  try {
    // Código que pode lançar um erro
    throw { name: "ValidationError", message: "Dados inválidos", code: 400 } as CustomError;
  } catch (error) {
    const err = error as CustomError;
    console.error(`Erro (${err.code}): ${err.message}`);
  }
}

```

### Uso do `never` em Funções que Lançam Exceções

Ao definir funções que sempre lançam exceções, podemos utilizar o tipo `never`:

```tsx
function fail(message: string): never {
  throw new Error(message);
}

// Exemplo de uso:
function processInput(input: unknown): string {
  if (typeof input !== 'string') {
    return fail("Entrada inválida: espera-se uma string!");
  }
  return input;
}

```

---

## 5. Componentes Principais

### Funções de Tratamento de Erros

- **`try` / `catch`:**
    
    Estrutura básica para encapsular e capturar exceções.
    
- **`throw`:**
    
    Usado para lançar erros, que podem ser instâncias de `Error` ou objetos customizados.
    
- **Funções com Retorno `never`:**
    
    Indicam que a execução não continuará normalmente após sua chamada.
    

### Métodos e Propriedades dos Objetos de Erro

- **`name`:**
    
    Nome do erro (por exemplo, `"Error"`, `"TypeError"`).
    
- **`message`:**
    
    Mensagem descritiva do erro.
    
- **`stack`:**
    
    (Opcional) Rastro da pilha de chamadas que levou ao erro.
    

### Interação Entre Componentes

1. **Lançamento do Erro:**
    
    Um erro é lançado com `throw` dentro de um bloco `try` ou em uma função com retorno `never`.
    
2. **Captura e Tratamento:**
    
    O bloco `catch` intercepta o erro, que pode ser então analisado e tratado conforme o tipo (utilizando, por exemplo, *type guards* ou *type assertions*).
    
3. **Propagação:**
    
    Se o erro não for tratado de forma satisfatória, ele pode ser relançado para ser capturado em um nível superior.
    

---

## 6. Uso Avançado

### Tipagem Avançada de Erros

Utilizando *union types* e *type guards*, é possível tratar diferentes tipos de erros em um único bloco `catch`:

```tsx
interface NetworkError extends Error {
  statusCode: number;
}

interface ValidationError extends Error {
  field: string;
}

function handleError(error: NetworkError | ValidationError) {
  if ('statusCode' in error) {
    // Tratamento específico para erros de rede
    console.error(`Erro de rede (${error.statusCode}): ${error.message}`);
  } else if ('field' in error) {
    // Tratamento específico para erros de validação
    console.error(`Erro de validação no campo ${error.field}: ${error.message}`);
  } else {
    // Tratamento genérico
    console.error(`Erro: ${error.message}`);
  }
}

try {
  // Código que pode lançar diferentes tipos de erros
  throw { name: "NetworkError", message: "Falha na conexão", statusCode: 503 } as NetworkError;
} catch (error) {
  handleError(error as NetworkError | ValidationError);
}

```

### Uso de Funções com `never` para Fluxos Críticos

Em fluxos onde a continuidade do código não é desejada após um erro, o uso de `never` melhora a clareza:

```tsx
function assertString(input: any): asserts input is string {
  if (typeof input !== 'string') {
    fail("Input não é uma string!");
  }
}

// Função que utiliza a asserção
function processData(input: any): string {
  assertString(input);
  // A partir daqui, input é garantidamente uma string
  return input.toUpperCase();
}

```

Neste exemplo, a função `assertString` usa a função `fail` (com retorno `never`) para interromper a execução se a asserção falhar.

---

## 7. Exemplos de Código Otimizados

### Exemplo 1: Tratamento Básico de Erro com Tipagem Customizada

```tsx
interface CustomError extends Error {
  code?: number;
  details?: string;
}

function performOperation(data: any): void {
  try {
    if (!data.isValid) {
      throw { name: "ValidationError", message: "Dados inválidos fornecidos", code: 422 } as CustomError;
    }
    // Processamento normal...
    console.log("Operação realizada com sucesso!");
  } catch (error) {
    const err = error as CustomError;
    console.error(`Erro (${err.code}): ${err.message}`);
    if (err.details) {
      console.error("Detalhes:", err.details);
    }
  }
}

// Uso da função
performOperation({ isValid: false });

```

### Exemplo 2: Uso do `never` para Fluxos que Sempre Lançam Exceção

```tsx
function fail(message: string): never {
  throw new Error(message);
}

function processInput(input: unknown): string {
  if (typeof input !== 'string') {
    // Se a condição for verdadeira, a execução nunca chegará a este ponto
    return fail("Entrada inválida: espera-se uma string!");
  }
  return input.trim();
}

// Tentativa de processamento de um valor inválido
try {
  const result = processInput(123);
  console.log("Resultado:", result);
} catch (error) {
  console.error("Erro capturado:", (error as Error).message);
}

```

### Exemplo 3: Uso de Type Guards para Diferentes Tipos de Erros

```tsx
interface NetworkError extends Error {
  statusCode: number;
}

interface ValidationError extends Error {
  field: string;
}

function handleError(error: NetworkError | ValidationError) {
  if ('statusCode' in error) {
    console.error(`Erro de rede (${error.statusCode}): ${error.message}`);
  } else if ('field' in error) {
    console.error(`Erro de validação no campo ${error.field}: ${error.message}`);
  } else {
    console.error(`Erro desconhecido: ${error.message}`);
  }
}

try {
  // Simulação de erro de validação
  throw { name: "ValidationError", message: "Campo obrigatório faltando", field: "email" } as ValidationError;
} catch (error) {
  handleError(error as NetworkError | ValidationError);
}

```

---

## 8. Informações Adicionais

- **Boas Práticas:**
    - **Centralize o Tratamento de Erros:** Utilize middleware ou funções de tratamento centralizadas para evitar repetição de código.
    - **Forneça Mensagens Claras:** Ao lançar erros, forneça mensagens descritivas e, se possível, códigos que facilitem a identificação do problema.
    - **Utilize Interfaces e Type Guards:** Para aplicações maiores, definir interfaces para erros e utilizar type guards ajuda a manter a robustez e a clareza do código.
- **Nuances:**
    - **Erro vs Exceção:** Em algumas linguagens, existe uma distinção clara entre erros e exceções. Em JavaScript/TypeScript, a distinção não é tão formal, mas a tipagem pode ajudar a categorizar e tratar esses casos de forma mais eficaz.
    - **Depuração e Logs:** Aproveite as propriedades dos objetos de erro (como `stack`) para facilitar a depuração.

---

## 9. Referências para Estudo Independente

- [Documentação Oficial do TypeScript](https://www.typescriptlang.org/docs/)
- [Guia de Erros no MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Artigo: "Effective Error Handling in TypeScript"](https://blog.logrocket.com/effective-error-handling-typescript/)
- [Livro: "Programming TypeScript" por Boris Cherny](https://www.oreilly.com/library/view/programming-typescript/9781492037644/)

---

Este documento apresenta uma visão detalhada sobre o tratamento de erros em TypeScript, abordando desde os conceitos fundamentais até casos de uso avançados. Ao dominar esses conceitos, os desenvolvedores estarão mais bem equipados para construir aplicações robustas e resilientes.