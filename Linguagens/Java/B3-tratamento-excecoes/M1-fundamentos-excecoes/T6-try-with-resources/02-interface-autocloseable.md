# T6.02 - Interface AutoCloseable

## Introdução

**AutoCloseable** é a interface que permite usar recursos com **try-with-resources**.

```java
/*
 * INTERFACE AUTOCLOSEABLE (Java 7+)
 * 
 * DEFINIÇÃO:
 * public interface AutoCloseable {
 *     void close() throws Exception;
 * }
 * 
 * PROPÓSITO:
 *   - Marcar recursos que podem ser fechados automaticamente
 *   - Permitir uso com try-with-resources
 *   - Garantir liberação de recursos
 * 
 * DIFERENÇA Closeable:
 *   - Closeable: throws IOException (mais específica)
 *   - AutoCloseable: throws Exception (mais genérica)
 *   - Closeable ESTENDE AutoCloseable
 */

// ✅ Implementar AutoCloseable
public class MeuRecurso implements AutoCloseable {
    
    public MeuRecurso() {
        System.out.println("Recurso aberto");
    }
    
    public void usar() {
        System.out.println("Usando recurso");
    }
    
    @Override
    public void close() {
        System.out.println("Recurso fechado");
    }
}

// ✅ Usar com try-with-resources
try (MeuRecurso recurso = new MeuRecurso()) {
    recurso.usar();
}  // close() chamado automaticamente
```

**AutoCloseable**: interface para recursos **autofecháveis**.

---

## Fundamentos

### 1. Definição da Interface

```java
// ✅ Definição AutoCloseable (JDK)
public class DefinicaoAutoCloseable {
    
    /*
     * INTERFACE AUTOCLOSEABLE:
     * 
     * package java.lang;
     * 
     * @FunctionalInterface
     * public interface AutoCloseable {
     *     void close() throws Exception;
     * }
     * 
     * CARACTERÍSTICAS:
     *   - Pacote: java.lang (não precisa import)
     *   - Método: close() throws Exception
     *   - Functional interface (um método abstrato)
     *   - Desde: Java 7
     */
    
    /*
     * CONTRATO:
     *   - close() deve ser IDEMPOTENTE (chamar múltiplas vezes OK)
     *   - close() deve LIBERAR recursos
     *   - close() pode lançar Exception
     *   - Após close(), recurso não deve ser usado
     */
}
```

**Definição**: `void close() throws Exception`.

### 2. Implementar AutoCloseable

```java
// ✅ Implementar AutoCloseable
public class ImplementarAutoCloseable {
    
    // ✅ Implementação básica
    public static class RecursoBasico implements AutoCloseable {
        
        private boolean fechado = false;
        
        public RecursoBasico() {
            System.out.println("Recurso criado");
        }
        
        public void operar() {
            if (fechado) {
                throw new IllegalStateException("Recurso já fechado");
            }
            System.out.println("Operação executada");
        }
        
        @Override
        public void close() {
            if (!fechado) {
                System.out.println("Fechando recurso");
                // Liberar recursos aqui
                fechado = true;
            }
        }
    }
    
    // ✅ Usar
    public static void usar() {
        try (RecursoBasico recurso = new RecursoBasico()) {
            recurso.operar();
        }  // close() automático
        
        /*
         * SAÍDA:
         * Recurso criado
         * Operação executada
         * Fechando recurso
         */
    }
}
```

**Implementar**: criar classe com `close()`.

### 3. AutoCloseable vs Closeable

```java
// ✅ Diferença AutoCloseable vs Closeable
public class AutoCloseableVsCloseable {
    
    /*
     * CLOSEABLE (java.io):
     * 
     * public interface Closeable extends AutoCloseable {
     *     void close() throws IOException;
     * }
     * 
     * DIFERENÇAS:
     * 
     * ┌─────────────────┬─────────────────┬──────────────────┐
     * │                 │ AutoCloseable   │ Closeable        │
     * ├─────────────────┼─────────────────┼──────────────────┤
     * │ Pacote          │ java.lang       │ java.io          │
     * │ Exceção         │ Exception       │ IOException      │
     * │ Desde           │ Java 7          │ Java 5           │
     * │ Uso             │ Genérico        │ I/O específico   │
     * │ Estende         │ Nada            │ AutoCloseable    │
     * └─────────────────┴─────────────────┴──────────────────┘
     */
    
    // ✅ AutoCloseable (genérico)
    public static class RecursoGenerico implements AutoCloseable {
        @Override
        public void close() throws Exception {  // ← throws Exception
            // Pode lançar qualquer exceção
        }
    }
    
    // ✅ Closeable (I/O)
    public static class RecursoIO implements Closeable {
        @Override
        public void close() throws IOException {  // ← throws IOException
            // Só lança IOException (ou subclasses)
        }
    }
    
    /*
     * QUANDO USAR CADA:
     * 
     * AutoCloseable:
     *   ✅ Recursos genéricos
     *   ✅ Pode lançar qualquer exceção
     *   ✅ Não é I/O
     * 
     * Closeable:
     *   ✅ Recursos de I/O
     *   ✅ Só lança IOException
     *   ✅ Mais específico
     */
}
```

**AutoCloseable**: genérico, `Exception`. **Closeable**: I/O, `IOException`.

### 4. Exemplos de Implementação

```java
// ✅ Exemplos práticos de implementação
public class ExemplosImplementacao {
    
    // ✅ Exemplo 1: Conexão de banco (fictícia)
    public static class MinhaConexao implements AutoCloseable {
        
        private boolean conectado = true;
        
        public void executarQuery(String sql) {
            if (!conectado) {
                throw new IllegalStateException("Desconectado");
            }
            System.out.println("Executando: " + sql);
        }
        
        @Override
        public void close() throws SQLException {
            if (conectado) {
                System.out.println("Fechando conexão");
                conectado = false;
                // Fechar conexão real aqui
            }
        }
    }
    
    // ✅ Exemplo 2: Lock customizado
    public static class MeuLock implements AutoCloseable {
        
        private boolean travado = false;
        
        public MeuLock() {
            System.out.println("Adquirindo lock");
            travado = true;
            // Adquirir lock real aqui
        }
        
        public void operacaoCritica() {
            if (!travado) {
                throw new IllegalStateException("Lock não adquirido");
            }
            System.out.println("Operação crítica");
        }
        
        @Override
        public void close() {
            if (travado) {
                System.out.println("Liberando lock");
                travado = false;
                // Liberar lock real aqui
            }
        }
    }
    
    // ✅ Exemplo 3: Timer customizado
    public static class MeuTimer implements AutoCloseable {
        
        private long inicio;
        
        public MeuTimer() {
            inicio = System.currentTimeMillis();
            System.out.println("Timer iniciado");
        }
        
        @Override
        public void close() {
            long duracao = System.currentTimeMillis() - inicio;
            System.out.println("Duração: " + duracao + "ms");
        }
    }
    
    // ✅ Usar
    public static void usar() throws SQLException {
        // Conexão
        try (MinhaConexao conn = new MinhaConexao()) {
            conn.executarQuery("SELECT * FROM usuarios");
        }
        
        // Lock
        try (MeuLock lock = new MeuLock()) {
            lock.operacaoCritica();
        }
        
        // Timer
        try (MeuTimer timer = new MeuTimer()) {
            // Código a ser cronometrado
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
```

**Exemplos**: conexão, lock, timer (qualquer recurso).

### 5. Idempotência do close()

```java
// ✅ close() deve ser idempotente
public class IdempotenciaClose {
    
    // ✅ Implementação idempotente (pode chamar múltiplas vezes)
    public static class RecursoIdempotente implements AutoCloseable {
        
        private boolean fechado = false;
        
        @Override
        public void close() {
            if (!fechado) {  // ✅ Verifica se já foi fechado
                System.out.println("Fechando recurso");
                // Liberar recursos
                fechado = true;
            }
            // Chamadas subsequentes não fazem nada
        }
    }
    
    // ✅ Testar idempotência
    public static void testarIdempotencia() {
        RecursoIdempotente recurso = new RecursoIdempotente();
        
        recurso.close();  // 1ª vez: fecha
        recurso.close();  // 2ª vez: não faz nada
        recurso.close();  // 3ª vez: não faz nada
        
        /*
         * SAÍDA:
         * Fechando recurso  (só aparece UMA vez)
         * 
         * IDEMPOTÊNCIA:
         *   - Chamar múltiplas vezes OK
         *   - Não gera erro
         *   - Não duplica liberação
         */
    }
    
    // ❌ Implementação NÃO idempotente (problema)
    public static class RecursoNaoIdempotente implements AutoCloseable {
        
        @Override
        public void close() {
            // ❌ Sempre executa (não verifica se já foi fechado)
            System.out.println("Fechando recurso");
            // Pode causar problemas se chamar múltiplas vezes
        }
    }
}
```

**Idempotência**: close() múltiplas vezes **OK** (não gera erro).

### 6. Exceções em close()

```java
// ✅ Exceções em close()
public class ExcecoesClose {
    
    // ✅ close() pode lançar exceção
    public static class RecursoComExcecao implements AutoCloseable {
        
        @Override
        public void close() throws Exception {
            System.out.println("Tentando fechar");
            
            // Pode lançar exceção
            if (Math.random() > 0.5) {
                throw new Exception("Erro ao fechar");
            }
            
            System.out.println("Fechado com sucesso");
        }
    }
    
    // ✅ Usar (exceções suppressed)
    public static void usar() {
        try (RecursoComExcecao recurso = new RecursoComExcecao()) {
            System.out.println("Usando recurso");
            throw new RuntimeException("Erro no try");
            
        } catch (Exception e) {
            System.err.println("Exceção: " + e.getMessage());
            
            // ✅ Verificar suppressed
            Throwable[] suppressed = e.getSuppressed();
            for (Throwable s : suppressed) {
                System.err.println("Suppressed: " + s.getMessage());
            }
        }
        
        /*
         * SE close() lançar exceção:
         *   - Exceção do try: "Erro no try" (principal)
         *   - Exceção de close(): suppressed
         *   - Ambas preservadas
         */
    }
}
```

**Exceções**: close() pode lançar, adicionada como **suppressed**.

### 7. Classes JDK que Implementam

```java
// ✅ Classes do JDK que implementam AutoCloseable
public class ClassesJDK {
    
    /*
     * CLASSES COMUNS:
     * 
     * I/O:
     *   - FileReader, FileWriter
     *   - BufferedReader, BufferedWriter
     *   - FileInputStream, FileOutputStream
     *   - BufferedInputStream, BufferedOutputStream
     *   - PrintWriter, PrintStream
     *   - Scanner
     * 
     * BANCO DE DADOS:
     *   - Connection
     *   - Statement, PreparedStatement, CallableStatement
     *   - ResultSet
     * 
     * REDE:
     *   - Socket, ServerSocket
     *   - DatagramSocket
     * 
     * OUTROS:
     *   - ZipFile
     *   - Formatter
     *   - Stream (Java 8+)
     *   - etc.
     */
    
    // ✅ Exemplo com várias classes
    public static void exemploVariasClasses() throws Exception {
        // FileReader
        try (FileReader reader = new FileReader("arquivo.txt")) {
            reader.read();
        }
        
        // Scanner
        try (Scanner scanner = new Scanner(new File("dados.txt"))) {
            scanner.nextLine();
        }
        
        // PrintWriter
        try (PrintWriter writer = new PrintWriter("saida.txt")) {
            writer.println("Linha");
        }
        
        // Stream (Java 8+)
        try (Stream<String> linhas = Files.lines(Paths.get("arquivo.txt"))) {
            linhas.forEach(System.out::println);
        }
    }
}
```

**JDK**: FileReader, Scanner, Connection, Socket, Stream, etc.

### 8. Criar Recurso Customizado

```java
// ✅ Criar recurso customizado completo
public class RecursoCustomizado {
    
    public static class GerenciadorArquivo implements AutoCloseable {
        
        private FileWriter writer;
        private boolean fechado = false;
        
        // Construtor
        public GerenciadorArquivo(String caminho) throws IOException {
            this.writer = new FileWriter(caminho);
            System.out.println("Arquivo aberto: " + caminho);
        }
        
        // Métodos de uso
        public void escrever(String texto) throws IOException {
            if (fechado) {
                throw new IllegalStateException("Arquivo já fechado");
            }
            writer.write(texto);
            writer.write("\n");
        }
        
        public void flush() throws IOException {
            if (!fechado) {
                writer.flush();
            }
        }
        
        // AutoCloseable
        @Override
        public void close() throws IOException {
            if (!fechado) {
                System.out.println("Fechando arquivo");
                
                try {
                    flush();  // Flush antes de fechar
                } finally {
                    writer.close();  // Garantir close
                    fechado = true;
                }
            }
        }
    }
    
    // ✅ Usar
    public static void usar() throws IOException {
        try (GerenciadorArquivo arquivo = new GerenciadorArquivo("log.txt")) {
            arquivo.escrever("Log 1");
            arquivo.escrever("Log 2");
            arquivo.flush();
        }  // Fecha automaticamente
    }
}
```

**Customizado**: criar classe própria implementando AutoCloseable.

### 9. Hierarquia de Interfaces

```java
// ✅ Hierarquia AutoCloseable e Closeable
public class HierarquiaInterfaces {
    
    /*
     * HIERARQUIA:
     * 
     * AutoCloseable (java.lang)
     *   └── Closeable (java.io)
     *         ├── FileReader
     *         ├── FileWriter
     *         ├── BufferedReader
     *         ├── InputStream
     *         ├── OutputStream
     *         └── etc.
     * 
     * TODOS que implementam Closeable também são AutoCloseable
     */
    
    // ✅ Closeable É AutoCloseable
    public static void exemploHierarquia() throws IOException {
        // FileReader implementa Closeable (que estende AutoCloseable)
        AutoCloseable auto = new FileReader("arquivo.txt");
        Closeable close = new FileReader("arquivo.txt");
        FileReader reader = new FileReader("arquivo.txt");
        
        // ✅ Todos podem ser usados com try-with-resources
        try (FileReader r = new FileReader("arquivo.txt")) {
            // Usar
        }
    }
}
```

**Hierarquia**: Closeable **estende** AutoCloseable.

### 10. Resumo Visual: Interface AutoCloseable

```java
/*
 * INTERFACE AUTOCLOSEABLE
 * 
 * DEFINIÇÃO:
 * 
 * package java.lang;
 * 
 * @FunctionalInterface
 * public interface AutoCloseable {
 *     void close() throws Exception;
 * }
 * 
 * 
 * IMPLEMENTAR:
 * 
 * public class MeuRecurso implements AutoCloseable {
 *     
 *     private boolean fechado = false;
 *     
 *     public MeuRecurso() {
 *         // Adquirir recurso
 *     }
 *     
 *     public void usar() {
 *         if (fechado) {
 *             throw new IllegalStateException("Fechado");
 *         }
 *         // Usar recurso
 *     }
 *     
 *     @Override
 *     public void close() throws Exception {
 *         if (!fechado) {          // ← Idempotência
 *             // Liberar recurso
 *             fechado = true;
 *         }
 *     }
 * }
 * 
 * 
 * USAR:
 * 
 * try (MeuRecurso recurso = new MeuRecurso()) {
 *     recurso.usar();
 * }  // close() automático
 * 
 * 
 * COMPARAÇÃO:
 * 
 * ┌──────────────┬─────────────────┬──────────────────┐
 * │              │ AutoCloseable   │ Closeable        │
 * ├──────────────┼─────────────────┼──────────────────┤
 * │ Pacote       │ java.lang       │ java.io          │
 * │ Exceção      │ Exception       │ IOException      │
 * │ Uso          │ Genérico        │ I/O específico   │
 * │ Estende      │ Nada            │ AutoCloseable    │
 * │ Import       │ Não precisa     │ Precisa          │
 * └──────────────┴─────────────────┴──────────────────┘
 * 
 * 
 * CONTRATO:
 * 
 * ✅ DEVE:
 *    - Ser IDEMPOTENTE (chamar múltiplas vezes OK)
 *    - LIBERAR recursos
 *    - Poder lançar Exception
 *    - Executar rapidamente
 * 
 * ❌ NÃO DEVE:
 *    - Lançar InterruptedException
 *    - Bloquear indefinidamente
 *    - Ter side effects não relacionados
 * 
 * 
 * CLASSES JDK:
 * 
 * I/O:
 *   FileReader, FileWriter, BufferedReader,
 *   InputStream, OutputStream, Scanner
 * 
 * Banco:
 *   Connection, Statement, ResultSet
 * 
 * Rede:
 *   Socket, ServerSocket
 * 
 * Outros:
 *   Stream, ZipFile, Formatter
 */

public class ResumoAutoCloseable {
    public static void main(String[] args) {
        System.out.println("=== INTERFACE AUTOCLOSEABLE ===");
        System.out.println("\n✅ Definição:");
        System.out.println("  void close() throws Exception");
        System.out.println("\n✅ Permite:");
        System.out.println("  - Try-with-resources");
        System.out.println("  - Fechamento automático");
        System.out.println("\n✅ Contrato:");
        System.out.println("  - Idempotente (múltiplas vezes OK)");
        System.out.println("  - Liberar recursos");
    }
}
```

---

## Aplicabilidade

**AutoCloseable**:
- **Marca** recursos autofecháveis
- **Permite** try-with-resources
- **Garante** liberação

---

## Armadilhas

### 1. Não Ser Idempotente

```java
// ❌ close() não idempotente
public void close() {
    recurso.liberar();  // ❌ Erro se chamar 2x
}

// ✅ close() idempotente
private boolean fechado = false;
public void close() {
    if (!fechado) {
        recurso.liberar();
        fechado = true;
    }
}
```

### 2. Não Verificar Estado

```java
// ❌ Usar após close()
recurso.usar();  // ❌ Recurso já fechado

// ✅ Verificar estado
public void usar() {
    if (fechado) {
        throw new IllegalStateException("Fechado");
    }
    // Usar
}
```

### 3. Lançar InterruptedException

```java
// ❌ Lançar InterruptedException em close()
public void close() throws InterruptedException {
    Thread.sleep(1000);  // ❌ Evitar
}

// ✅ Não bloquear
public void close() {
    // Executar rapidamente
}
```

---

## Boas Práticas

### 1. Implementar Idempotência

```java
// ✅ close() idempotente
private boolean fechado = false;
public void close() {
    if (!fechado) {
        liberar();
        fechado = true;
    }
}
```

### 2. Verificar Estado Após Close

```java
// ✅ Verificar se fechado
public void usar() {
    if (fechado) {
        throw new IllegalStateException("Fechado");
    }
    // Usar
}
```

### 3. Documentar Comportamento

```java
// ✅ Documentar close()
/**
 * Fecha este recurso, liberando recursos do sistema.
 * Este método é idempotente - chamadas subsequentes não têm efeito.
 * 
 * @throws IOException se erro ao fechar
 */
@Override
public void close() throws IOException {
    // Implementação
}
```

---

## Resumo

**AutoCloseable**: interface para recursos **autofecháveis**.

**Definição**:
```java
public interface AutoCloseable {
    void close() throws Exception;
}
```

**Propósito**:
- Marcar recursos **autofecháveis**
- Permitir **try-with-resources**
- Garantir **liberação**

**vs Closeable**:
- **AutoCloseable**: genérico, `Exception`, `java.lang`
- **Closeable**: I/O, `IOException`, `java.io`, **estende** AutoCloseable

**Contrato**:
- **Idempotente** (múltiplas vezes OK)
- **Liberar** recursos
- Pode lançar **Exception**
- Executar **rapidamente**
- **Não** bloquear indefinidamente

**Implementar**:
- Criar classe com `close()`
- Verificar se **fechado** (idempotência)
- **Liberar** recursos
- Marcar como **fechado**

**Classes JDK**:
- **I/O**: FileReader, Scanner, InputStream
- **Banco**: Connection, Statement, ResultSet
- **Rede**: Socket, ServerSocket
- **Outros**: Stream, ZipFile, Formatter

**Exceções**:
- close() pode **lançar**
- Adicionada como **suppressed**
- **Não** suprime exceção original

**Regra de Ouro**: Implementar AutoCloseable para recursos que precisam **liberação**. close() deve ser **idempotente** (múltiplas vezes OK). **Verificar** estado após close(). **Executar** rapidamente (não bloquear). Use **try-with-resources** para fechamento automático.

