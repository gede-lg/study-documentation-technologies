# Disparando exceções: throws e throw

## 1. Introdução

O **disparo de exceções** em Java é o mecanismo pelo qual um programa sinaliza que ocorreu uma condição excepcional — geralmente um erro ou situação inesperada — durante a execução. Existem duas palavras-chave fundamentais:

- **`throw`**: utilizada dentro do corpo de um método para **lançar** explicitamente uma instância de `Throwable` (normalmente uma `Exception` ou `Error`).
- **`throws`**: usada na **assinatura** de um método para **declarar** que ele pode propagar certas exceções para seu chamador.

### Relevância e importância

- **Robustez**: permite tratar erros previsíveis (ex.: dados inválidos, falha de I/O) de forma controlada, evitando crashes inesperados.
- **Legibilidade**: separa o fluxo normal do fluxo de erro, tornando o código mais claro.
- **Contratos de API**: declarações `throws` definem explicitamente quais erros o chamador deve tratar ou propagar.

### Definição e Conceitos Fundamentais

- **Tema principal**: “Disparando exceções: `throws` e `throw`” — abrange como lançar e propagar exceções em Java.
- **Subtemas**:
    - `throw`: sintaxe, uso para lançar exceções em tempo de execução.
    - `throws`: sintaxe, declaração de propagação de exceções checked.
    - Checked vs. unchecked exceptions.
    - Boas práticas e padrões de projeto relacionados.

---

## 2. Sumário

1. [Sintaxe e Estrutura](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
2. [`throw`: Lançando Exceções](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
3. [`throws`: Declarando Propagação](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
4. [Componentes Principais](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
5. [Restrições de Uso](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
6. [Exemplos de Código Otimizados](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
7. [Informações Adicionais](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)
8. [Referências para Estudo Independente](Disparando%20exce%C3%A7%C3%B5es%20throws%20e%20throw%202029462188c68088a648f9ff11b7c0c8.md)

---

## 3. Conteúdo Detalhado

### Sintaxe e Estrutura

```java
// Exemplo básico de throw:
if (valor < 0) {
    throw new IllegalArgumentException("Valor não pode ser negativo");
}

// Uso de throws na assinatura:
public double dividir(int a, int b) throws ArithmeticException {
    return a / b;
}

```

- **`throw`**
    - Deve ser seguido por uma instância de `Throwable`.
    - Interrompe imediatamente o fluxo normal e inicia a busca por um bloco `catch` compatível.
- **`throws`**
    - Aparece após a lista de parâmetros do método.
    - Pode listar múltiplas exceções separadas por vírgula.
    - **Só** necessário para **checked exceptions** (subclasses de `Exception` que não herdam de `RuntimeException`).

### `throw`: Lançando Exceções

- **Função**: criar e lançar uma exceção em um ponto específico do código.
- **Exemplo de declaração**:
    
    ```java
    throw new FileNotFoundException("Arquivo não encontrado: " + nomeArquivo);
    
    ```
    
- **Fluxo**:
    1. Ocorre o `throw`.
    2. Cria‐se o objeto `Exception`.
    3. Desce a pilha de chamadas até encontrar um `catch` que corresponda.
    4. Se não houver, o programa encerra com stack trace.

### `throws`: Declarando Propagação

- **Função**: informar ao chamador que o método pode gerar determinadas exceções.
- **Sintaxe**:
    
    ```java
    public void lerArquivo(String caminho)
        throws IOException, ParseException {
        // implementação...
    }
    
    ```
    
- **Efeito**:
    - Quem invocar `lerArquivo` deve tratar (`try-catch`) ou também declarar `throws`.

### Componentes Principais

- **`Throwable`** – superclasse de todas as exceções e erros.
- **`Exception` vs. `Error`**
    - `Exception`: condições recuperáveis (I/O, parsing).
    - `Error`: condições de JVM, geralmente não tratáveis (OutOfMemoryError).
- **Checked vs. Unchecked**
    - **Checked**: forçam `try-catch` ou `throws` (ex.: `IOException`).
    - **Unchecked**: herdam de `RuntimeException` (ex.: `NullPointerException`); não precisam ser declaradas.
- **Relação `throw` ↔ `throws`**
    - `throw`: dispara instância.
    - `throws`: comunica possibilidade de disparo.

### Restrições de Uso

- **Não declare `throws` para unchecked exceptions** (evita poluição da API).
- **Evite usar `throw` com instâncias genéricas** (ex.: `new Exception()`); prefira tipos específicos.
- **Não use exceções para controle de fluxo normal** (prejudica performance e clareza).
- **Em APIs públicas**, documente sempre as exceptions mais relevantes.

---

## 4. Exemplos de Código Otimizados

### 4.1. Uso Básico: Validação de Parâmetros

```java
/**
 * Calcula a raiz quadrada de um número.
 * @param valor número para cálculo; deve ser ≥ 0.
 * @return raiz quadrada.
 * @throws IllegalArgumentException se valor for negativo.
 */
public double raizQuadrada(double valor) {
    if (valor < 0) {
        throw new IllegalArgumentException(
            "Parâmetro deve ser ≥ 0, mas foi " + valor
        );
    }
    return Math.sqrt(valor);
}

```

### 4.2. Propagando Checked Exception

```java
/**
 * Lê todas as linhas de um arquivo de texto.
 * @param path caminho para o arquivo.
 * @return lista de linhas.
 * @throws IOException em falha de I/O.
 */
public List<String> lerLinhas(String path) throws IOException {
    try (BufferedReader reader = Files.newBufferedReader(Paths.get(path))) {
        return reader.lines().collect(Collectors.toList());
    }
}

```

### 4.3. Encadeamento e Rethrow Avançado

```java
public void processarDados(String path)
        throws DataProcessingException {
    try {
        List<String> linhas = lerLinhas(path);
        // lógica de parsing...
    } catch (IOException e) {
        // encapsula a exception original mantendo a causa
        throw new DataProcessingException(
            "Erro ao processar dados de " + path, e
        );
    }
}

```

- **Boas práticas**:
    - Use `throw new MeuException("mensagem", causa)` para **exception chaining**.
    - Preserve a **causa** para facilitar diagnóstico.

---

## 5. Informações Adicionais

- **Suppressed Exceptions**: em `try-with-resources`, exceções de fechamento podem ser “suprimidas” e recuperadas via `Throwable.getSuppressed()`.
- **Performance**: lançar exceções é relativamente caro; use em situações excepcionais, não em loops.
- **Logging**: registre exceções críticas com stack trace para posterior análise, mas não exagere no log para não poluir.
- **Frameworks**: muitos (Spring, Hibernate) convertem exceptions em tipos próprios; entenda como eles propagam ou traduzem erros.

---

## 6. Referências para Estudo Independente

- [Java™ Tutorials – Exceptions](https://docs.oracle.com/javase/tutorial/essential/exceptions/)
- [Chapter “Exceptions” na Java Language Specification](https://docs.oracle.com/javase/specs/)
- **Livro**: *Effective Java* (3ª ed.), Item “Favor usar exceções em vez de códigos de erro” – Joshua Bloch
- **Artigo**: “Exception Handling Best Practices in Java” (Baeldung) – [https://www.baeldung.com/java-exceptions](https://www.baeldung.com/java-exceptions)
- **Guia**: *Java Puzzlers* (Bloch & Gafter), capítulos sobre exceções

---

> Conclusão: dominar throw e throws é essencial para escrever código Java seguro, legível e fácil de manter. A compreensão profunda desse mecanismo é a base para tratamentos de erro robustos e APIs bem definidas.
>