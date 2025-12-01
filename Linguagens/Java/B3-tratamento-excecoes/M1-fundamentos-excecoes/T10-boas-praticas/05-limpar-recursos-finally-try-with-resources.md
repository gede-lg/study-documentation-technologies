# T10.05 - Limpar Recursos em Finally ou Try-with-Resources

## Introdução

**Recursos**: devem ser **sempre liberados**, mesmo com exceção.

```java
/*
 * LIMPEZA DE RECURSOS
 * 
 * ❌ SEM LIMPEZA:
 * - Vazamento de recursos
 * - Conexões abertas
 * - Arquivos não fechados
 * 
 * ✅ GARANTIR LIMPEZA:
 * - finally: sempre executa
 * - try-with-resources: automático (Java 7+)
 */

// ❌ Sem limpeza: vazamento de recursos
public class SemLimpeza {
    public static void ler(String arquivo) throws IOException {
        FileReader fr = new FileReader(arquivo);
        BufferedReader br = new BufferedReader(fr);
        
        String linha = br.readLine();  // ❌ Se exceção aqui, não fecha
        // FileReader e BufferedReader ficam abertos (VAZAMENTO)
    }
}

// ✅ Finally: sempre limpa
public class ComFinally {
    public static void ler(String arquivo) throws IOException {
        FileReader fr = null;
        BufferedReader br = null;
        
        try {
            fr = new FileReader(arquivo);
            br = new BufferedReader(fr);
            String linha = br.readLine();
        } finally {
            // ✅ Sempre executa (mesmo com exceção)
            if (br != null) {
                br.close();  // Fecha BufferedReader
            }
            if (fr != null) {
                fr.close();  // Fecha FileReader
            }
        }
    }
}

// ✅ Try-with-resources: automático (MELHOR)
public class ComTryWithResources {
    public static void ler(String arquivo) throws IOException {
        try (FileReader fr = new FileReader(arquivo);
             BufferedReader br = new BufferedReader(fr)) {
            
            String linha = br.readLine();
            // ✅ Fecha AUTOMATICAMENTE (mesmo com exceção)
        }
    }
}
```

**Regra**: usar **try-with-resources** (preferencial) ou **finally** para garantir limpeza.

---

## Fundamentos

### 1. Por Que Limpar Recursos

```java
// ❌ Vazamento de recursos: problemas
public class VazamentoRecursos {
    
    public static void problema1() throws IOException {
        // ❌ Conexão não fechada
        Connection conn = DriverManager.getConnection("jdbc:...");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM tabela");
        
        // Se exceção aqui, conexão fica ABERTA
        // Pool de conexões esgota (too many connections)
    }
    
    public static void problema2() throws IOException {
        // ❌ Arquivo não fechado
        FileWriter fw = new FileWriter("dados.txt");
        fw.write("Dados importantes");
        
        // Se exceção aqui, buffer não flush
        // Dados NÃO escritos no disco (PERDIDOS)
    }
    
    public static void problema3() throws IOException {
        // ❌ Lock não liberado
        FileChannel canal = new RandomAccessFile("arquivo.txt", "rw").getChannel();
        FileLock lock = canal.lock();
        
        // Se exceção aqui, lock NÃO liberado
        // Outros processos BLOQUEADOS
    }
}

/*
 * PROBLEMAS VAZAMENTO:
 * 
 * 1. CONEXÕES BANCO:
 *    - Pool esgota
 *    - "Too many connections"
 *    - Aplicação trava
 * 
 * 2. ARQUIVOS:
 *    - Descritores esgotam
 *    - "Too many open files"
 *    - Dados não escritos (buffer)
 * 
 * 3. LOCKS:
 *    - Deadlock
 *    - Outros processos bloqueados
 * 
 * 4. MEMÓRIA:
 *    - Buffers grandes não liberados
 *    - OutOfMemoryError
 * 
 * 5. SISTEMA OPERACIONAL:
 *    - Recursos SO limitados
 *    - Handles, sockets, etc.
 */
```

**Vazamento**: conexões abertas, arquivos não fechados, **locks** não liberados.

### 2. Finally: Sempre Executa

```java
// ✅ Finally: garantia de execução
public class FinallyGarantia {
    
    public static void exemplo1() {
        FileReader fr = null;
        try {
            fr = new FileReader("arquivo.txt");
            // Operações...
        } catch (IOException e) {
            System.out.println("Erro: " + e.getMessage());
        } finally {
            // ✅ SEMPRE executa (mesmo com exceção)
            if (fr != null) {
                try {
                    fr.close();
                } catch (IOException e) {
                    System.out.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
    }
    
    public static void exemplo2() {
        try {
            return;  // Return no try
        } finally {
            // ✅ AINDA ASSIM executa (antes do return)
            System.out.println("Finally executado antes do return");
        }
    }
    
    public static void exemplo3() {
        try {
            throw new RuntimeException("Erro");
        } finally {
            // ✅ Executa ANTES de propagar exceção
            System.out.println("Finally executado antes de propagar");
        }
    }
}

/*
 * FINALLY: SEMPRE EXECUTA
 * 
 * 1. APÓS TRY (sem exceção):
 * try {
 *     // Sucesso
 * } finally {
 *     // ✅ Executa
 * }
 * 
 * 2. APÓS CATCH (com exceção):
 * try {
 *     // Exceção
 * } catch (Exception e) {
 *     // Trata
 * } finally {
 *     // ✅ Executa
 * }
 * 
 * 3. ANTES DE RETURN:
 * try {
 *     return;  // Return
 * } finally {
 *     // ✅ Executa ANTES do return
 * }
 * 
 * 4. ANTES DE PROPAGAR EXCEÇÃO:
 * try {
 *     throw new Exception();
 * } finally {
 *     // ✅ Executa ANTES de propagar
 * }
 * 
 * ÚNICA EXCEÇÃO: System.exit()
 * try {
 *     System.exit(0);  // ❌ Mata JVM
 * } finally {
 *     // NÃO executa
 * }
 */
```

**Finally**: **sempre** executa (sucesso, exceção, return), exceto System.exit().

### 3. Finally: Pattern Correto

```java
// ✅ Finally: pattern correto para múltiplos recursos
public class FinallyPatternCorreto {
    
    public static void exemplo1() throws IOException {
        FileReader fr = null;
        BufferedReader br = null;
        
        try {
            fr = new FileReader("arquivo.txt");
            br = new BufferedReader(fr);
            
            String linha = br.readLine();
            // Processar...
            
        } finally {
            // ✅ Fechar recursos na ordem INVERSA
            if (br != null) {
                try {
                    br.close();  // Fecha BufferedReader primeiro
                } catch (IOException e) {
                    // Log erro, mas não re-lança (permitir fechar fr)
                    System.err.println("Erro ao fechar BufferedReader: " + e);
                }
            }
            
            if (fr != null) {
                try {
                    fr.close();  // Depois FileReader
                } catch (IOException e) {
                    System.err.println("Erro ao fechar FileReader: " + e);
                }
            }
        }
    }
    
    public static void exemplo2() throws SQLException {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DriverManager.getConnection("jdbc:...");
            stmt = conn.prepareStatement("SELECT * FROM tabela");
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                // Processar...
            }
            
        } finally {
            // ✅ Ordem inversa: rs -> stmt -> conn
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar ResultSet: " + e);
                }
            }
            
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar Statement: " + e);
                }
            }
            
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar Connection: " + e);
                }
            }
        }
    }
}

/*
 * PATTERN CORRETO FINALLY:
 * 
 * 1. DECLARAR FORA TRY:
 * Resource r = null;  // ✅ Fora para finally acessar
 * try {
 *     r = new Resource();
 * } finally {
 *     if (r != null) r.close();
 * }
 * 
 * 2. VERIFICAR NULL:
 * finally {
 *     if (r != null) {  // ✅ Evitar NullPointerException
 *         r.close();
 *     }
 * }
 * 
 * 3. ORDEM INVERSA:
 * // Abrir: r1 -> r2 -> r3
 * // Fechar: r3 -> r2 -> r1 (INVERSO)
 * 
 * 4. TRY/CATCH PARA CADA close():
 * finally {
 *     if (r1 != null) {
 *         try { r1.close(); }  // ✅ Cada close() próprio try
 *         catch (Exception e) { }
 *     }
 * }
 * // Permite fechar r2 mesmo se r1.close() falhar
 * 
 * 5. NÃO RE-LANÇAR EXCEÇÃO close():
 * catch (Exception e) {
 *     // Log, mas NÃO throw
 *     // Permitir fechar outros recursos
 * }
 */
```

**Pattern**: declarar fora try, verificar **null**, ordem **inversa**, try/catch **cada** close().

### 4. Try-with-Resources: Automático

```java
// ✅ Try-with-resources: automático e simples
public class TryWithResourcesAutomatico {
    
    // ✅ Um recurso
    public static void exemplo1() throws IOException {
        try (FileReader fr = new FileReader("arquivo.txt")) {
            int ch = fr.read();
            // ✅ FileReader fechado AUTOMATICAMENTE
        }
        // Equivalente a finally com fr.close()
    }
    
    // ✅ Múltiplos recursos
    public static void exemplo2() throws IOException {
        try (FileReader fr = new FileReader("arquivo.txt");
             BufferedReader br = new BufferedReader(fr)) {
            
            String linha = br.readLine();
            // ✅ Fecha AUTOMATICAMENTE na ordem INVERSA:
            // 1. br.close()
            // 2. fr.close()
        }
    }
    
    // ✅ Banco de dados
    public static void exemplo3() throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:...");
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM tabela");
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                // Processar...
            }
            // ✅ Fecha automaticamente: rs -> stmt -> conn
        }
    }
}

/*
 * TRY-WITH-RESOURCES:
 * 
 * SINTAXE:
 * try (Resource1 r1 = new Resource1();
 *      Resource2 r2 = new Resource2()) {
 *     // Usar r1 e r2
 * }
 * // ✅ Fecha AUTOMATICAMENTE na ordem INVERSA
 * 
 * REQUISITO:
 * - Recurso DEVE implementar AutoCloseable
 * - Interface AutoCloseable:
 *   void close() throws Exception
 * 
 * VANTAGENS:
 * 1. Código LIMPO (sem finally verboso)
 * 2. AUTOMÁTICO (fecha sempre)
 * 3. ORDEM CORRETA (inversa)
 * 4. EXCEÇÕES SUPRIMIDAS (addSuppressed)
 * 5. SEGURO (mesmo com exceção)
 * 
 * JAVA 9+: Variáveis pré-existentes
 * Resource r = new Resource();
 * try (r) {  // ✅ Java 9+
 *     // Usar r
 * }
 */
```

**Try-with-resources**: fecha **automaticamente**, ordem **inversa**, código **limpo**.

### 5. AutoCloseable Interface

```java
// ✅ Recurso personalizado: implementar AutoCloseable
public class RecursoPersonalizado implements AutoCloseable {
    private final String nome;
    
    public RecursoPersonalizado(String nome) {
        this.nome = nome;
        System.out.println("Abrindo recurso: " + nome);
    }
    
    public void operar() {
        System.out.println("Operando: " + nome);
    }
    
    @Override
    public void close() {
        // ✅ Implementar limpeza
        System.out.println("Fechando recurso: " + nome);
    }
}

// ✅ Uso com try-with-resources
public class UsoRecursoPersonalizado {
    public static void main(String[] args) {
        try (RecursoPersonalizado recurso = new RecursoPersonalizado("MeuRecurso")) {
            recurso.operar();
            // ✅ close() chamado automaticamente
        }
    }
}

/*
 * AUTOCLOSEABLE:
 * 
 * INTERFACE:
 * @FunctionalInterface
 * public interface AutoCloseable {
 *     void close() throws Exception;
 * }
 * 
 * CLOSEABLE (extends AutoCloseable):
 * public interface Closeable extends AutoCloseable {
 *     void close() throws IOException;  // Mais específico
 * }
 * 
 * DIFERENÇA:
 * - AutoCloseable: close() throws Exception (genérico)
 * - Closeable: close() throws IOException (específico)
 * 
 * RECURSOS JDK IMPLEMENTAM:
 * - FileReader, FileWriter (Closeable)
 * - BufferedReader, BufferedWriter (Closeable)
 * - Connection, Statement, ResultSet (AutoCloseable)
 * - InputStream, OutputStream (Closeable)
 * - Socket (Closeable)
 * 
 * IMPLEMENTAR PRÓPRIO:
 * - Recursos que precisam limpeza
 * - Conexões customizadas
 * - Locks, handles, etc.
 */

// ✅ Exemplo: Lock personalizado
public class MeuLock implements AutoCloseable {
    private boolean travado = false;
    
    public void travar() {
        travado = true;
        System.out.println("Lock adquirido");
    }
    
    @Override
    public void close() {
        if (travado) {
            travado = false;
            System.out.println("Lock liberado");
        }
    }
}

// ✅ Uso
public class UsoLock {
    public static void main(String[] args) {
        try (MeuLock lock = new MeuLock()) {
            lock.travar();
            // Operação crítica...
            // ✅ Lock liberado automaticamente
        }
    }
}
```

**AutoCloseable**: interface para try-with-resources, implementar close().

### 6. Exceções Suprimidas

```java
// ✅ Exceções suprimidas: addSuppressed()
public class ExcecoesSuppressed {
    
    public static void exemplo() throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader("arquivo.txt"))) {
            String linha = br.readLine();
            
            if (linha == null) {
                throw new IOException("Arquivo vazio");  // Exceção 1
            }
            // Se br.close() também lançar exceção (Exceção 2)
            // Exceção 1 é propagada, Exceção 2 é SUPRIMIDA
        }
    }
    
    public static void recuperarSuprimidas() {
        try {
            exemplo();
        } catch (IOException e) {
            System.out.println("Exceção principal: " + e.getMessage());
            
            // ✅ Recuperar exceções suprimidas
            Throwable[] suprimidas = e.getSuppressed();
            for (Throwable t : suprimidas) {
                System.out.println("Suprimida: " + t.getMessage());
            }
        }
    }
}

/*
 * EXCEÇÕES SUPRIMIDAS:
 * 
 * CENÁRIO:
 * try (Resource r = new Resource()) {
 *     throw new Exception("Exceção 1");  // No try
 * }
 * // r.close() lança Exception("Exceção 2")  // No close
 * 
 * COMPORTAMENTO:
 * - Exceção 1 (try) é PROPAGADA
 * - Exceção 2 (close) é SUPRIMIDA
 * - Exceção 2 adicionada via addSuppressed()
 * 
 * RECUPERAR:
 * catch (Exception e) {
 *     Throwable[] suprimidas = e.getSuppressed();
 *     // Acessa exceções suprimidas
 * }
 * 
 * FINALLY TRADICIONAL:
 * - Exceção close() SOBRESCREVE exceção try
 * - Perde exceção original (RUIM)
 * 
 * TRY-WITH-RESOURCES:
 * - Exceção try é MANTIDA
 * - Exceção close() é SUPRIMIDA (não perde)
 */
```

**Suprimidas**: exceção try **propagada**, exceção close() **suprimida** (addSuppressed).

### 7. Finally vs Try-with-Resources

```java
// ❌ Finally: verboso e propício a erros
public class FinallyVerboso {
    public static void copiar(String origem, String destino) throws IOException {
        FileReader fr = null;
        BufferedReader br = null;
        FileWriter fw = null;
        BufferedWriter bw = null;
        
        try {
            fr = new FileReader(origem);
            br = new BufferedReader(fr);
            fw = new FileWriter(destino);
            bw = new BufferedWriter(fw);
            
            String linha;
            while ((linha = br.readLine()) != null) {
                bw.write(linha);
                bw.newLine();
            }
            
        } finally {
            // ❌ Verboso (8 linhas!)
            if (bw != null) {
                try { bw.close(); } catch (IOException e) { }
            }
            if (fw != null) {
                try { fw.close(); } catch (IOException e) { }
            }
            if (br != null) {
                try { br.close(); } catch (IOException e) { }
            }
            if (fr != null) {
                try { fr.close(); } catch (IOException e) { }
            }
        }
    }
}

// ✅ Try-with-resources: limpo e seguro
public class TryWithResourcesLimpo {
    public static void copiar(String origem, String destino) throws IOException {
        try (FileReader fr = new FileReader(origem);
             BufferedReader br = new BufferedReader(fr);
             FileWriter fw = new FileWriter(destino);
             BufferedWriter bw = new BufferedWriter(fw)) {
            
            String linha;
            while ((linha = br.readLine()) != null) {
                bw.write(linha);
                bw.newLine();
            }
            // ✅ Fecha AUTOMATICAMENTE (limpo!)
        }
    }
}

/*
 * COMPARAÇÃO:
 * 
 * FINALLY:
 * ❌ Verboso (muito código)
 * ❌ Propício a erros (esquecer null check)
 * ❌ Ordem manual (pode errar)
 * ❌ Exceção close() SOBRESCREVE try
 * ❌ Não escalável (muitos recursos)
 * 
 * TRY-WITH-RESOURCES:
 * ✅ Conciso (1 linha por recurso)
 * ✅ Seguro (automático)
 * ✅ Ordem automática (inversa)
 * ✅ Exceções suprimidas (preserva original)
 * ✅ Escalável (quantos recursos precisar)
 * 
 * RECOMENDAÇÃO:
 * - SEMPRE preferir try-with-resources (Java 7+)
 * - Finally apenas se Java 6 ou recurso não AutoCloseable
 */
```

**Comparação**: try-with-resources **limpo** e **seguro**, finally **verboso**.

### 8. Recursos Não AutoCloseable

```java
// ❌ Recurso NÃO AutoCloseable: usar finally
public class RecursoNaoAutoCloseable {
    
    public static void exemplo1() {
        Lock lock = new ReentrantLock();
        lock.lock();  // ✅ Adquirir lock
        
        try {
            // Operação crítica...
        } finally {
            lock.unlock();  // ✅ Liberar lock (SEMPRE)
        }
    }
    
    public static void exemplo2() {
        ExecutorService executor = Executors.newFixedThreadPool(10);
        
        try {
            executor.submit(() -> { /* tarefa */ });
            // Usar executor...
        } finally {
            executor.shutdown();  // ✅ Desligar executor (SEMPRE)
        }
    }
}

/*
 * RECURSOS NÃO AUTOCLOSEABLE:
 * 
 * EXEMPLOS:
 * - Lock (ReentrantLock, ReadWriteLock)
 * - ExecutorService
 * - Semaphore
 * - CountDownLatch
 * 
 * PATTERN:
 * Resource r = acquire();
 * try {
 *     // Usar recurso
 * } finally {
 *     r.release();  // ✅ Liberar
 * }
 * 
 * ALTERNATIVA: Wrapper AutoCloseable
 */

// ✅ Wrapper: tornar AutoCloseable
public class LockWrapper implements AutoCloseable {
    private final Lock lock;
    
    public LockWrapper(Lock lock) {
        this.lock = lock;
        lock.lock();  // Adquire no construtor
    }
    
    @Override
    public void close() {
        lock.unlock();  // Libera no close
    }
}

// ✅ Uso com try-with-resources
public class UsoLockWrapper {
    public static void main(String[] args) {
        Lock lock = new ReentrantLock();
        
        try (LockWrapper wrapper = new LockWrapper(lock)) {
            // Operação crítica...
            // ✅ Lock liberado automaticamente
        }
    }
}
```

**Não AutoCloseable**: usar **finally**, ou criar **wrapper** AutoCloseable.

### 9. Resumo Visual

```java
/*
 * LIMPAR RECURSOS EM FINALLY OU TRY-WITH-RESOURCES
 * 
 * ❌ SEM LIMPEZA (VAZAMENTO):
 * public static void ruim() throws IOException {
 *     FileReader fr = new FileReader("arquivo.txt");
 *     BufferedReader br = new BufferedReader(fr);
 *     String linha = br.readLine();
 *     // ❌ Se exceção, recursos ficam ABERTOS
 * }
 * 
 * 
 * ✅ FINALLY (Java 6):
 * public static void comFinally() throws IOException {
 *     FileReader fr = null;
 *     BufferedReader br = null;
 *     
 *     try {
 *         fr = new FileReader("arquivo.txt");
 *         br = new BufferedReader(fr);
 *         String linha = br.readLine();
 *     } finally {
 *         if (br != null) {
 *             try { br.close(); }
 *             catch (IOException e) { }
 *         }
 *         if (fr != null) {
 *             try { fr.close(); }
 *             catch (IOException e) { }
 *         }
 *     }
 * }
 * 
 * 
 * ✅ TRY-WITH-RESOURCES (Java 7+, PREFERIR):
 * public static void comTryWithResources() throws IOException {
 *     try (FileReader fr = new FileReader("arquivo.txt");
 *          BufferedReader br = new BufferedReader(fr)) {
 *         
 *         String linha = br.readLine();
 *         // ✅ Fecha AUTOMATICAMENTE
 *     }
 * }
 * 
 * 
 * PATTERN FINALLY:
 * 
 * 1. Declarar FORA try:
 * Resource r = null;  // ✅ Acessível no finally
 * 
 * 2. Verificar NULL:
 * finally {
 *     if (r != null) { r.close(); }  // ✅ Evita NPE
 * }
 * 
 * 3. Ordem INVERSA:
 * // Abrir: r1 -> r2 -> r3
 * // Fechar: r3 -> r2 -> r1
 * 
 * 4. Try/catch CADA close():
 * if (r != null) {
 *     try { r.close(); }  // ✅ Próprio try
 *     catch (Exception e) { }
 * }
 * 
 * 5. NÃO re-lançar exceção close():
 * // Permitir fechar outros recursos
 * 
 * 
 * TRY-WITH-RESOURCES:
 * 
 * SINTAXE:
 * try (Resource r = new Resource()) {
 *     // Usar r
 * }
 * // ✅ r.close() AUTOMÁTICO
 * 
 * MÚLTIPLOS:
 * try (Resource1 r1 = new Resource1();
 *      Resource2 r2 = new Resource2()) {
 *     // Usar r1, r2
 * }
 * // ✅ Fecha: r2, depois r1 (INVERSO)
 * 
 * REQUISITO:
 * - Recurso DEVE implementar AutoCloseable
 * 
 * VANTAGENS:
 * 1. LIMPO (conciso)
 * 2. AUTOMÁTICO (sempre fecha)
 * 3. ORDEM CORRETA (inversa)
 * 4. EXCEÇÕES SUPRIMIDAS (preserva original)
 * 5. SEGURO (mesmo com exceção)
 * 
 * 
 * AUTOCLOSEABLE:
 * 
 * public interface AutoCloseable {
 *     void close() throws Exception;
 * }
 * 
 * IMPLEMENTAM:
 * - FileReader, FileWriter
 * - BufferedReader, BufferedWriter
 * - Connection, Statement, ResultSet
 * - InputStream, OutputStream
 * - Socket
 * 
 * PRÓPRIO:
 * public class MeuRecurso implements AutoCloseable {
 *     @Override
 *     public void close() {
 *         // Limpeza
 *     }
 * }
 * 
 * 
 * EXCEÇÕES SUPRIMIDAS:
 * 
 * try (Resource r = new Resource()) {
 *     throw new Exception("Exceção 1");  // Try
 * }
 * // r.close() lança Exception("Exceção 2")  // Close
 * 
 * RESULTADO:
 * - Exceção 1 (try) PROPAGADA
 * - Exceção 2 (close) SUPRIMIDA
 * 
 * RECUPERAR:
 * catch (Exception e) {
 *     Throwable[] suprimidas = e.getSuppressed();
 * }
 * 
 * 
 * COMPARAÇÃO:
 * 
 * FINALLY:
 * ❌ Verboso
 * ❌ Propício a erros
 * ❌ Exceção close() SOBRESCREVE try
 * 
 * TRY-WITH-RESOURCES:
 * ✅ Conciso
 * ✅ Seguro
 * ✅ Exceção try PRESERVADA
 * 
 * RECOMENDAÇÃO:
 * - SEMPRE try-with-resources (Java 7+)
 * - Finally apenas Java 6 ou não AutoCloseable
 * 
 * 
 * RECURSOS NÃO AUTOCLOSEABLE:
 * 
 * Lock lock = new ReentrantLock();
 * lock.lock();
 * try {
 *     // Operação
 * } finally {
 *     lock.unlock();  // ✅ Finally
 * }
 * 
 * WRAPPER:
 * public class LockWrapper implements AutoCloseable {
 *     public void close() { lock.unlock(); }
 * }
 * 
 * try (LockWrapper w = new LockWrapper(lock)) {
 *     // ✅ Automático
 * }
 */

public class ExemploLimpezaRecursos {
    
    // ❌ ERRADO: Sem limpeza
    public static void exemploErrado() throws IOException {
        FileReader fr = new FileReader("arquivo.txt");
        BufferedReader br = new BufferedReader(fr);
        String linha = br.readLine();
        // ❌ Vazamento se exceção
    }
    
    // ✅ CORRETO: Try-with-resources (PREFERIR)
    public static void exemploCorreto1() throws IOException {
        try (FileReader fr = new FileReader("arquivo.txt");
             BufferedReader br = new BufferedReader(fr)) {
            
            String linha = br.readLine();
            // ✅ Fecha automaticamente
        }
    }
    
    // ✅ CORRETO: Finally (se Java 6)
    public static void exemploCorreto2() throws IOException {
        FileReader fr = null;
        BufferedReader br = null;
        
        try {
            fr = new FileReader("arquivo.txt");
            br = new BufferedReader(fr);
            String linha = br.readLine();
        } finally {
            if (br != null) {
                try { br.close(); } catch (IOException e) { }
            }
            if (fr != null) {
                try { fr.close(); } catch (IOException e) { }
            }
        }
    }
    
    // ✅ Banco de dados
    public static void exemploBanco() throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:...");
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM tabela");
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                // Processar...
            }
            // ✅ Fecha: rs -> stmt -> conn
        }
    }
}
```

---

## Aplicabilidade

**Sempre limpar**:
- **Arquivos**: FileReader, FileWriter
- **Conexões**: Connection, Socket
- **Streams**: InputStream, OutputStream
- **Locks**: ReentrantLock, ReadWriteLock

**Preferir**:
- **Try-with-resources** (Java 7+, automático)
- **Finally** apenas se Java 6 ou não AutoCloseable

---

## Armadilhas

### 1. Esquecer Fechar

```java
// ❌ Vazamento
FileReader fr = new FileReader("arquivo.txt");
// Sem finally ou try-with-resources

// ✅ Sempre fechar
try (FileReader fr = new FileReader("arquivo.txt")) { }
```

### 2. Fechar Ordem Errada

```java
// ❌ Ordem errada no finally
finally {
    fr.close();  // ❌ Antes
    br.close();  // ❌ Depois (usa fr)
}

// ✅ Ordem inversa
finally {
    br.close();  // ✅ Primeiro
    fr.close();  // ✅ Depois
}
```

### 3. Esquecer Null Check

```java
// ❌ NullPointerException
finally {
    fr.close();  // ❌ Se fr == null
}

// ✅ Verificar null
finally {
    if (fr != null) { fr.close(); }
}
```

---

## Boas Práticas

### 1. Try-with-Resources Sempre

```java
// ✅ Sempre que possível
try (Resource r = new Resource()) { }
```

### 2. Implementar AutoCloseable

```java
// ✅ Recursos próprios
public class MeuRecurso implements AutoCloseable {
    public void close() { /* limpar */ }
}
```

### 3. Finally para Não AutoCloseable

```java
// ✅ Lock, ExecutorService
lock.lock();
try { } finally { lock.unlock(); }
```

---

## Resumo

**Limpeza**: recursos devem ser **sempre** liberados (mesmo com exceção).

**Problemas vazamento**:
- **Conexões**: pool esgota ("too many connections")
- **Arquivos**: descritores esgotam, dados não escritos
- **Locks**: deadlock, processos bloqueados
- **Memória**: OutOfMemoryError

**Finally**:
- **Sempre** executa (sucesso, exceção, return)
- Exceto System.exit()
- Pattern: declarar fora try, verificar **null**, ordem **inversa**, try/catch cada close()

**Try-with-resources** (Java 7+):
- Fecha **automaticamente** (mesmo com exceção)
- Ordem **inversa** automática
- Código **limpo** e **seguro**
- Requisito: recurso implementar **AutoCloseable**
- **Preferir** sempre que possível

**AutoCloseable**:
```java
public interface AutoCloseable {
    void close() throws Exception;
}
```
- Implementam: FileReader, Connection, InputStream, Socket
- Próprio: implementar close() para recursos customizados

**Exceções suprimidas**:
- Exceção try **propagada**
- Exceção close() **suprimida** (addSuppressed)
- Recuperar: `e.getSuppressed()`
- Finally: exceção close() **sobrescreve** try (ruim)

**Comparação**:
- **Finally**: verboso, propício erros, exceção close() sobrescreve
- **Try-with-resources**: conciso, seguro, exceção try preservada

**Recursos não AutoCloseable**:
- Lock, ExecutorService, Semaphore
- Usar **finally** para liberar
- Ou criar **wrapper** AutoCloseable

**Recomendação**:
- **SEMPRE** try-with-resources (Java 7+)
- Finally apenas Java 6 ou não AutoCloseable

**Pattern finally**:
```java
Resource r = null;
try {
    r = new Resource();
} finally {
    if (r != null) {  // Null check
        try { r.close(); }  // Próprio try
        catch (Exception e) { }  // Não re-lançar
    }
}
```

**Try-with-resources**:
```java
try (Resource1 r1 = new Resource1();
     Resource2 r2 = new Resource2()) {
    // Usar r1, r2
}
// Fecha automaticamente: r2, r1 (inverso)
```

**Regra de Ouro**: Sempre garantir limpeza recursos. Try-with-resources preferencial (automático limpo seguro). Finally se Java 6 ou não AutoCloseable. Verificar null. Ordem inversa. Exceção close() não re-lançar no finally. Implementar AutoCloseable recursos próprios. Exceções suprimidas preservam original try-with-resources.

