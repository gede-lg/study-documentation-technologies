# Captura e tratamento de exceções: try-catch-finally

**1. Introdução**

A captura e o tratamento de exceções em Java são mecanismos fundamentais para construir aplicações robustas e seguras. Em sistemas reais, erros de I/O, falhas de rede, problemas de conversão de dados ou condições inesperadas podem ocorrer a qualquer momento. Sem um tratamento adequado, tais erros podem levar à terminação abrupta do programa, perda de dados ou comportamento indefinido.

- **Relevância e importância:**
    - Garante que falhas sejam tratadas de forma controlada, mantendo a aplicação em um estado consistente.
    - Permite separar a lógica “feliz” (fluxo normal) da lógica de erro, tornando o código mais legível e manutenível.
    - Facilita a implementação de políticas de retry, logging e limpeza de recursos.
- **Definição e Conceitos Fundamentais:**
    - **Tema Principal:** captura e tratamento de exceções usando `try`, `catch` e `finally`.
    - **Subtemas:**
        - Bloco `try` (onde o erro pode ocorrer)
        - Blocos `catch` (como reagir a cada tipo de erro)
        - Bloco `finally` (código de limpeza que sempre será executado)
        - Exceções checked vs. unchecked
        - Encadeamento (`throw` e `throws`)

Cada subtema tem um papel distinto no fluxo de tratamento de erros e, juntos, compõem a base para construir código Java resiliente.

---

**2. Sumário**

1. Introdução
2. Sumário
3. Conteúdo Detalhado
    1. Sintaxe e Estrutura
    2. Componentes Principais
    3. Restrições de Uso
4. Exemplos de Código Otimizados
5. Informações Adicionais
6. Referências para Estudo Independente

---

### 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

```java
try {
    // código sujeito a falhas
} catch (TipoDaExcecao1 e1) {
    // tratativa específica para TipoDaExcecao1
} catch (TipoDaExcecao2 e2) {
    // tratativa para TipoDaExcecao2
} finally {
    // código de limpeza, sempre executado
}

```

- O bloco **`try`** envolve a região onde exceções podem ocorrer.
- Um ou mais blocos **`catch`** seguem o `try` e capturam tipos específicos de exceção.
- O bloco **`finally`** é opcional e sempre será executado, ocorrendo exceções ou não, ideal para liberar recursos (fechar streams, sockets, etc.).

### 3.2 Componentes Principais

- **`Exception` vs. `RuntimeException`**
    - *Checked exceptions* (subclasses de `Exception`, exceto `RuntimeException`) exigem tratamento ou declaração em `throws`.
    - *Unchecked exceptions* (`RuntimeException` e subclasses) indicam problemas de programação (e.g., `NullPointerException`) e não são obrigatoriamente capturadas.
- **`throw`**
    - Lança manualmente uma instância de `Throwable`.
    
    ```java
    if (valor < 0) {
        throw new IllegalArgumentException("Valor não pode ser negativo");
    }
    
    ```
    
- **`throws`**
    - Declara que um método pode propagar exceções checked, transferindo a responsabilidade ao chamador.
    
    ```java
    public void carregarArquivo(String caminho) throws IOException {
        // …
    }
    
    ```
    
- **Fluxo de Interação**
    1. Executa o `try`.
    2. Ao encontrar uma exceção, interrompe o `try` e busca o primeiro `catch` compatível.
    3. Executa o `catch` correspondente.
    4. Sempre executa `finally` (a menos que o JVM termine abruptamente).

### 3.3 Restrições de uso

- **Ordem dos `catch`**: blocos mais específicos (subclasses) devem vir antes de blocos mais gerais (superclasses). Caso contrário, o compilador acusará erro de *unreachable code*.
- **Recuperação vs. Propagação**: nem sempre é desejável capturar todas as exceções. Em bibliotecas, pode ser preferível propagar (`throws`) para que o usuário trate no nível apropriado.
- **Não usar `catch(Exception e)` indiscriminadamente**: captura ampla demais pode mascarar erros graves; prefira capturas pontuais e documentadas.

---

### 4. Exemplos de Código Otimizados

### 4.1 Leitura de arquivo com fechamento seguro

```java
public List<String> lerLinhas(String caminho) {
    List<String> linhas = new ArrayList<>();
    try (BufferedReader reader = new BufferedReader(new FileReader(caminho))) {
        String linha;
        while ((linha = reader.readLine()) != null) {
            linhas.add(linha);
        }
    } catch (FileNotFoundException fnf) {
        System.err.println("Arquivo não encontrado: " + fnf.getMessage());
    } catch (IOException io) {
        System.err.println("Erro ao ler o arquivo: " + io.getMessage());
    }
    return linhas;
}

```

- Uso de **`try-with-resources`** que elimina a necessidade de `finally` para fechar o `BufferedReader`.
- Tratamento granular de `FileNotFoundException` e `IOException`.

### 4.2 Retry simples em operação de rede

```java
public String chamarServicoRemoto() throws ServiceUnavailableException {
    int tentativas = 0;
    while (tentativas < 3) {
        try {
            return invocarHTTP();
        } catch (IOException e) {
            tentativas++;
            if (tentativas == 3) {
                throw new ServiceUnavailableException("Após 3 tentativas, o serviço não respondeu", e);
            }
            // pequeno delay antes da próxima tentativa
            Thread.sleep(500);
        }
    }
    throw new ServiceUnavailableException("Tentativas esgotadas");
}

```

- Demonstra captura e relançamento (`throw new ...`) com empacotamento da causa (`e`).
- Inclui lógica de retry e back-off simples.

---

### 5. Informações Adicionais

- **Aninhamento de Exceções (Chaining):**
Permite rastrear a causa raiz usando `new MyException("msg", causa)`.
- **Logging vs. `printStackTrace()`:**
Prefira frameworks de logging (SLF4J/Logback) para registrar exceções em produção.
- **Performance:**
Evite usar exceções como fluxo normal de controle; o lançamento e empilhamento de exceções é relativamente caro.

---

### 6. Referências para Estudo Independente

- **Documentação Oracle Java SE:**[https://docs.oracle.com/javase/tutorial/essential/exceptions/](https://docs.oracle.com/javase/tutorial/essential/exceptions/)
- **Livro “Effective Java” (Joshua Bloch), Capítulo sobre exceções.**
- **Baeldung – Exception Handling in Java:**[https://www.baeldung.com/java-exceptions](https://www.baeldung.com/java-exceptions)
- **StackOverflow – Coleção de boas práticas de exceções em Java:**[https://stackoverflow.com/questions/2259027/best-practices-for-exceptions-in-java](https://stackoverflow.com/questions/2259027/best-practices-for-exceptions-in-java)

---

> Dica: mantenha suas camadas de código limpas, lançando exceções significativas e capturando-as onde fizer sentido para manter a aplicação consistente e fácil de depurar.
>