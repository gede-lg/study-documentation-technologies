# Criação de Exceções

## 1. Introdução

O tratamento de exceções é um conceito essencial na programação, permitindo capturar e lidar com erros de maneira estruturada. Em TypeScript, podemos utilizar o mecanismo de exceções do JavaScript (`try-catch`) e aprimorá-lo criando classes de exceção personalizadas. Isso melhora a organização do código e facilita a depuração de erros específicos em aplicações complexas.

## 2. Sumário

1. **Definição e Conceitos Fundamentais**
1.1 O que são Exceções?
1.2 Por que usar Exceções Personalizadas?
2. **Sintaxe e Estrutura**
2.1 Criando uma Classe de Exceção
2.2 Capturando e Tratando Exceções Personalizadas
3. **Componentes Principais**
3.1 Métodos e Propriedades Importantes
3.2 Herança em Classes de Exceção
4. **Uso Avançado**
4.1 Criando Hierarquia de Exceções
4.2 Utilização com `Error` e `instanceof`
5. **Exemplos de Código Otimizados**
6. **Informações Adicionais**
7. **Referências para Estudo Independente**

## 3. Definição e Conceitos Fundamentais

### 3.1 O que são Exceções?

Exceções são mecanismos usados para lidar com erros inesperados durante a execução de um programa. Em TypeScript, as exceções podem ser geradas manualmente com `throw` e capturadas com `try-catch`.

### 3.2 Por que usar Exceções Personalizadas?

Exceções personalizadas são úteis para:

- Categorizar e diferenciar tipos de erros.
- Melhorar a legibilidade e manutenção do código.
- Fornecer informações adicionais sobre o erro.

## 4. Sintaxe e Estrutura

### 4.1 Criando uma Classe de Exceção

Em TypeScript, podemos criar uma classe personalizada que estende `Error`:

```tsx
class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CustomError";
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

```

### 4.2 Capturando e Tratando Exceções Personalizadas

```tsx
try {
    throw new CustomError("Ocorreu um erro específico!");
} catch (error) {
    if (error instanceof CustomError) {
        console.error("Erro capturado:", error.message);
    } else {
        console.error("Erro desconhecido:", error);
    }
}

```

## 5. Componentes Principais

### 5.1 Métodos e Propriedades Importantes

- `name`: Nome da exceção.
- `message`: Mensagem descritiva do erro.
- `stack`: Rastreamento da pilha de execução.

### 5.2 Herança em Classes de Exceção

Podemos criar uma hierarquia de exceções personalizadas:

```tsx
class NotFoundError extends CustomError {
    constructor(resource: string) {
        super(`${resource} não encontrado.`);
        this.name = "NotFoundError";
    }
}

```

## 6. Uso Avançado

### 6.1 Criando Hierarquia de Exceções

```tsx
class ValidationError extends CustomError {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

```

### 6.2 Utilização com `Error` e `instanceof`

```tsx
function validateInput(input: string) {
    if (!input) {
        throw new ValidationError("O input não pode ser vazio.");
    }
}

try {
    validateInput("");
} catch (error) {
    if (error instanceof ValidationError) {
        console.error("Erro de validação:", error.message);
    }
}

```

## 7. Exemplos de Código Otimizados

```tsx
class DatabaseError extends CustomError {
    constructor(query: string) {
        super(`Erro ao executar query: ${query}`);
        this.name = "DatabaseError";
    }
}

try {
    throw new DatabaseError("SELECT * FROM users");
} catch (error) {
    if (error instanceof DatabaseError) {
        console.error("Erro no banco de dados:", error.message);
    }
}

```

## 8. Informações Adicionais

- As exceções personalizadas devem sempre herdar de `Error`.
- Utilize `Object.setPrototypeOf(this, ClassName.prototype);` para corrigir a herança de `Error`.
- Exceções personalizadas são úteis para sistemas que requerem categorização detalhada de erros.

## 9. Referências para Estudo Independente

- [TypeScript Handbook - Error Handling](https://www.typescriptlang.org/docs/handbook/errors.html)
- [MDN Web Docs - Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Best Practices for Error Handling in TypeScript](https://www.digitalocean.com/community/tutorials/typescript-error-handling)

---

Este guia fornece uma explicação detalhada sobre como criar classes de exceção personalizadas em TypeScript, com exemplos claros e práticas recomendadas. 🚀