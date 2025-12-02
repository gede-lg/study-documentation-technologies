# Gerenciamento automático de recursos: try-with-resources

1. **Introdução**

O **gerenciamento automático de recursos** em Java, também conhecido como ***try-with-resources***, é um mecanismo introduzido no Java 7 para facilitar a abertura e o fechamento de recursos que demandam liberação explícita, como fluxos de I/O, conexões a banco de dados e locks.

- **Relevância:** Evita vazamentos de recursos (memory leaks) e torna o código mais conciso e seguro, eliminando a necessidade de blocos `finally` extensos.
- **Contexto:** Em aplicações reais, esquecer de fechar um recurso pode causar esgotamento de conexões, arquivos corrompidos ou até falhas de sistema. O try-with-resources garante fechamento correto mesmo em caso de exceções.

**Definição e Conceitos Fundamentais**

- **Tema principal:** Gerenciamento automático de recursos (try-with-resources).
- **Subtemas:**
    - Interface `AutoCloseable` e `Closeable`
    - Sintaxe do bloco try-with-resources
    - Tratamento de exceções suprimidas
    - Multirecursos e ordem de fechamento
- **Para que servem:** Automatizar o método `close()` de objetos que implementam `AutoCloseable`, assegurando liberação de recursos.

---

1. **Sumário**
2. Introdução
3. Sumário
4. Conteúdo Detalhado
    - 3.1 Sintaxe e Estrutura
    - 3.2 Componentes Principais
    - 3.3 Tratamento de Exceções Suprimidas
    - 3.4 Multirecursos
    - 3.5 Restrições de Uso
5. Exemplos de Código Otimizados
    - 4.1 Uso Básico com `FileInputStream`
    - 4.2 Múltiplos Recursos (I/O + DB)
    - 4.3 Implementando `AutoCloseable` em Classe Customizada
6. Informações Adicionais
7. Referências para Estudo Independente

---

1. **Conteúdo Detalhado**

### 3.1 Sintaxe e Estrutura

```java
try (ResourceType nome = expressãoDeCriação()) {
    // uso do recurso
} catch (ExceptionType e) {
    // tratamento de exceção
}
// o recurso é fechado automaticamente aqui

```

- O parêntese após `try` declara um ou mais recursos.
- Cada recurso deve implementar `java.lang.AutoCloseable` (ou `java.io.Closeable`).
- Após o bloco, o método `close()` de cada recurso é invocado automaticamente, mesmo se ocorrer exceção.

### 3.2 Componentes Principais

- **AutoCloseable:**
    
    ```java
    public interface AutoCloseable {
        void close() throws Exception;
    }
    
    ```
    
- **Closeable:** herda `AutoCloseable` adicionando `throws IOException`, usado em I/O.
- **try-with-resources block:** engloba aquisição e liberação.
- **catch / finally (opcional):** Pode-se combinar `catch` e até um `finally`, mas quase sempre não é necessário fechar recursos manualmente.

### 3.3 Tratamento de Exceções Suprimidas

Quando tanto o corpo do `try` quanto o `close()` geram exceções, a exceção do `try` é a lançada, e as de `close()` são registradas como *suprimidas*:

```java
try (MyResource r = new MyResource()) {
    throw new RuntimeException("Erro no uso");
}
// MyResource.close() lança IOException("Falha no close")

```

- No `catch`, pode-se obter as suprimidas:
    
    ```java
    catch (Exception e) {
        for (Throwable sup : e.getSuppressed()) {
            System.err.println("Suprimida: " + sup);
        }
    }
    
    ```
    

### 3.4 Multirecursos

```java
try (
    FileInputStream fis = new FileInputStream("dados.txt");
    BufferedReader br   = new BufferedReader(new InputStreamReader(fis))
) {
    // usa fis e br
}

```

- Recursos são fechados na **ordem inversa** à de criação (primeiro `br.close()`, depois `fis.close()`).
- Permite combinar recursos heterogêneos (I/O, DB, locks).

### 3.5 Restrições de uso

- Apenas objetos declarados na seção de recursos podem ser fechados automaticamente.
- Recursos devem ser variáveis **final** ou efetivamente final (não reatribuídas dentro do bloco).
- Não funciona com recursos criados fora do scope do `try` sem serem redeclarados.

---

1. **Exemplos de Código Otimizados**

### 4.1 Uso Básico com File I/O

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class LeitorArquivo {
    public void imprimeLinhas(String caminho) {
        // try-with-resources garante fechamento de FileReader e BufferedReader
        try (BufferedReader br = new BufferedReader(new FileReader(caminho))) {
            String linha;
            while ((linha = br.readLine()) != null) {
                System.out.println(linha);
            }
        } catch (IOException e) {
            // log e tratamento adequado
            e.printStackTrace();
        }
    }
}

```

- **Eficiência:** usa buffer para I/O eficiente.
- **Legibilidade:** bloco único substituindo try/finally aninhado.

### 4.2 Múltiplos Recursos (I/O + Banco de Dados)

```java
import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class Importador {
    public void importaDados(String arquivoCsv) {
        String sql = "INSERT INTO tabela(col1, col2) VALUES(?, ?)";
        try (
            FileInputStream fis = new FileInputStream(arquivoCsv);
            Scanner scanner      = new Scanner(fis);
            Connection conn      = DriverManager.getConnection(...);
            PreparedStatement ps = conn.prepareStatement(sql)
        ) {
            conn.setAutoCommit(false);
            while (scanner.hasNextLine()) {
                String[] cols = scanner.nextLine().split(",");
                ps.setString(1, cols[0]);
                ps.setString(2, cols[1]);
                ps.addBatch();
            }
            ps.executeBatch();
            conn.commit();
        } catch (Exception e) {
            // rollback se necessário
            e.printStackTrace();
        }
    }
}

```

- **Boa prática:** desabilita auto-commit e controla transação dentro do bloco.
- **Multirecursos:** Scanner, Connection e PreparedStatement são fechados automaticamente.

### 4.3 Implementando AutoCloseable em Classe Customizada

```java
public class TimerRecurso implements AutoCloseable {
    private final long inicio = System.currentTimeMillis();

    public void operar() {
        // lógica do recurso
        System.out.println("Operando recurso...");
    }

    @Override
    public void close() {
        long duracao = System.currentTimeMillis() - inicio;
        System.out.println("Recurso fechado. Duração: " + duracao + "ms");
    }
}

// Uso:
public class ExemploCustom {
    public static void main(String[] args) {
        try (TimerRecurso tr = new TimerRecurso()) {
            tr.operar();
            // mais lógica...
        }
    }
}

```

- **Flexibilidade:** qualquer classe pode participar do try-with-resources.
- **Transparência:** fechamento e lógica pós-uso centralizados.

---

1. **Informações Adicionais**
- **Declaração fora do parêntese:** Você pode usar recurso já existente (desde Java 9):
    
    ```java
    BufferedReader br = new BufferedReader(...);
    try (br) {
        // usa br
    }
    
    ```
    
- **Comparação com try/finally:**
    
    ```java
    FileInputStream fis = null;
    try {
        fis = new FileInputStream("a.txt");
        // uso
    } finally {
        if (fis != null) fis.close();
    }
    
    ```
    
    - > Muito mais verboso e sujeito a NPEs.
- **Boas práticas:**
    - Sempre declare apenas o necessário no bloco.
    - Evite blocos try-with-resources muito grandes; separe responsabilidades em métodos.

---

1. **Referências para Estudo Independente**
- *The Java™ Tutorials – Essential Classes – try-with-resources*:
[https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)
- *JEP 213: Milling Project Coin (try-with-resources improvements)*:
[https://openjdk.java.net/jeps/213](https://openjdk.java.net/jeps/213)
- *Baeldung – Guide to Try-With-Resources in Java*:
[https://www.baeldung.com/java-try-with-resources](https://www.baeldung.com/java-try-with-resources)
- *Effective Java* (Joshua Bloch), Capítulo sobre exceções e encerramento de recursos.