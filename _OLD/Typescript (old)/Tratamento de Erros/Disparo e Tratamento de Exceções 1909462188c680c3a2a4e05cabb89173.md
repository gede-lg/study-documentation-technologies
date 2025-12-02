# Disparo e Tratamento de Exceções

## 1. Introdução

No desenvolvimento de software, erros e falhas podem ocorrer durante a execução do código. Para lidar com esses problemas de forma controlada, utilizamos exceções. Em TypeScript, a manipulação de exceções permite capturar erros de maneira eficiente, garantindo maior estabilidade e previsibilidade na execução dos programas.

O uso adequado de exceções melhora a qualidade do código, facilitando a depuração e evitando falhas inesperadas que poderiam comprometer a experiência do usuário ou a integridade dos dados.

## 2. Sumário

1. Introdução
2. Definição e Conceitos Fundamentais
    - O que são exceções?
    - Diferença entre erro e exceção
3. Sintaxe e Estrutura
    - Uso de `throw` para lançar exceções
    - Uso de `try`, `catch` e `finally` para tratamento de exceções
4. Componentes Principais
    - Bloco `try`
    - Bloco `catch`
    - Bloco `finally`
5. Uso Avançado
    - Exceções personalizadas
    - Tratamento de múltiplas exceções
    - Propagação de exceções
6. Exemplos de Código Otimizados
7. Informações Adicionais
8. Referências para Estudo Independente

---

## 3. Definição e Conceitos Fundamentais

### O que são exceções?

Uma **exceção** é um evento inesperado que ocorre durante a execução do programa, interrompendo o fluxo normal da aplicação. Em TypeScript (assim como em JavaScript), as exceções são utilizadas para capturar e tratar erros de forma controlada.

### Diferença entre erro e exceção

- **Erro:** Pode ser um problema inesperado no código, como variáveis indefinidas ou referências incorretas.
- **Exceção:** Um erro tratado e gerenciado explicitamente pelo desenvolvedor.

---

## 4. Sintaxe e Estrutura

### Uso de `throw` para lançar exceções

A palavra-chave `throw` permite lançar exceções manualmente. É útil para indicar erros específicos em determinado trecho do código.

```tsx
function dividir(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Não é possível dividir por zero");
    }
    return a / b;
}

```

### Uso de `try`, `catch` e `finally` para tratamento de exceções

O bloco `try` envolve o código que pode gerar uma exceção. Se ocorrer um erro, o `catch` captura a exceção, permitindo tratá-la. O bloco `finally`, opcional, é sempre executado, independentemente de ocorrer uma exceção ou não.

```tsx
try {
    let resultado = dividir(10, 0);
    console.log("Resultado:", resultado);
} catch (error) {
    console.error("Erro capturado:", error.message);
} finally {
    console.log("Execução finalizada");
}

```

---

## 5. Componentes Principais

### Bloco `try`

- Contém o código que pode lançar uma exceção.
- Se nenhuma exceção for lançada, o bloco `catch` é ignorado.

### Bloco `catch`

- Captura e trata a exceção lançada dentro do bloco `try`.
- O parâmetro de `catch` contém informações sobre o erro.

### Bloco `finally`

- Sempre executado, independentemente de ter ocorrido erro ou não.
- Utilizado para fechar conexões ou liberar recursos.

---

## 6. Uso Avançado

### Exceções personalizadas

Podemos definir classes de exceção personalizadas para melhorar a clareza dos erros gerados:

```tsx
class DivisaoPorZeroError extends Error {
    constructor() {
        super("Divisão por zero não é permitida");
        this.name = "DivisaoPorZeroError";
    }
}

function dividirSeguro(a: number, b: number): number {
    if (b === 0) {
        throw new DivisaoPorZeroError();
    }
    return a / b;
}

```

### Tratamento de múltiplas exceções

Podemos diferenciar exceções e tratá-las de forma específica:

```tsx
try {
    let resultado = dividirSeguro(10, 0);
    console.log("Resultado:", resultado);
} catch (error) {
    if (error instanceof DivisaoPorZeroError) {
        console.error("Erro específico capturado:", error.message);
    } else {
        console.error("Erro desconhecido:", error);
    }
}

```

### Propagação de exceções

Uma exceção pode ser propagada para os níveis superiores da pilha de chamadas se não for capturada imediatamente:

```tsx
function operacao(): void {
    try {
        dividirSeguro(10, 0);
    } catch (error) {
        console.error("Erro tratado na função operacao:", error.message);
        throw error; // Repassando o erro para o nível superior
    }
}

try {
    operacao();
} catch (error) {
    console.error("Erro final capturado:", error.message);
}

```

---

## 7. Exemplos de Código Otimizados

### Exemplo prático completo

```tsx
class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CustomError";
    }
}

function processarDados(valor: number): void {
    if (valor < 0) {
        throw new CustomError("O valor não pode ser negativo");
    }
    console.log("Processamento bem-sucedido");
}

try {
    processarDados(-5);
} catch (error) {
    if (error instanceof CustomError) {
        console.error("Erro personalizado capturado:", error.message);
    } else {
        console.error("Erro desconhecido:", error);
    }
} finally {
    console.log("Finalizando execução");
}

```

---

## 8. Informações Adicionais

- Evite capturar exceções genéricas sempre que possível. Prefira criar exceções específicas.
- Utilize `finally` para liberar recursos, como conexões de banco de dados ou arquivos.
- Exceções não devem ser usadas para controle de fluxo normal do programa.

---

## 9. Referências para Estudo Independente

- [Documentação Oficial do TypeScript sobre Erros](https://www.typescriptlang.org/docs/)
- [MDN Web Docs: Tratamento de Exceções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/try...catch)
- [Livro: Effective TypeScript – Dan Vanderkam](https://www.oreilly.com/library/view/effective-typescript/9781492053743/)

---

Com essa abordagem, garantimos um tratamento de exceções robusto, modular e alinhado às melhores práticas da linguagem TypeScript.