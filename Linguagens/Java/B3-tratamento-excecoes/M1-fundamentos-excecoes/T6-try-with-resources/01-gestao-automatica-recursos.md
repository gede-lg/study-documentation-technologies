# T6.01 - Gestão Automática de Recursos

## Introdução

**Try-with-resources** (Java 7+) **fecha** recursos **automaticamente** (sem `finally`).

```java
/*
 * TRY-WITH-RESOURCES (Java 7+)
 * 
 * GESTÃO AUTOMÁTICA:
 *   - Fecha recursos AUTOMATICAMENTE
 *   - Sem necessidade de finally
 *   - Sem código manual de close()
 *   - Garante fechamento SEMPRE
 * 
 * ANTES (Java 6 - finally manual):
 * FileReader reader = null;
 * try {
 *     reader = new FileReader("arquivo.txt");
 *     // usar
 * } finally {
 *     if (reader != null) {
 *         try {
 *             reader.close();
 *         } catch (IOException e) { }
 *     }
 * }
 * 
 * DEPOIS (Java 7+ - automático):
 * try (FileReader reader = new FileReader("arquivo.txt")) {
 *     // usar
 * }  // ✅ Fecha AUTOMATICAMENTE
 */

// ✅ Try-with-resources
try (FileReader reader = new FileReader("arquivo.txt")) {
    // Usar reader
    int data = reader.read();
}  // ✅ reader.close() chamado AUTOMATICAMENTE
```

**Try-with-resources**: fecha recursos **automaticamente**.

---

## Fundamentos

### 1. Problema: Finally Manual

```java
// ❌ ANTES Java 7: finally manual (verboso)
public class ProblemaFinallyManual {
    
    public static void antesJava7() {
        FileReader reader = null;
        BufferedReader buffered = null;
        
        try {
            // 1. Abrir recursos
            reader = new FileReader("arquivo.txt");
            buffered = new BufferedReader(reader);
            
            // 2. Usar recursos
            String linha = buffered.readLine();
            System.out.println(linha);
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado");
            
        } catch (IOException e) {
            System.err.println("Erro ao ler");
            
        } finally {
            // 3. Fechar recursos MANUALMENTE
            
            // ❌ Verboso: fechar cada recurso
            if (buffered != null) {
                try {
                    buffered.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar buffered");
                }
            }
            
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar reader");
                }
            }
        }
        
        /*
         * PROBLEMAS:
         *   - Código VERBOSO (muitas linhas)
         *   - Duplicação (try-catch para cada close)
         *   - Fácil ESQUECER verificar null
         *   - Fácil ESQUECER capturar exceção de close
         *   - Propenso a ERROS
         */
    }
}
```

**Problema**: finally manual **verboso**, propenso a **erros**.

### 2. Solução: Try-with-Resources

```java
// ✅ DEPOIS Java 7+: try-with-resources (conciso)
public class SolucaoTryWithResources {
    
    public static void depoisJava7() {
        // ✅ Recursos declarados no try ( )
        try (FileReader reader = new FileReader("arquivo.txt");
             BufferedReader buffered = new BufferedReader(reader)) {
            
            // Usar recursos
            String linha = buffered.readLine();
            System.out.println(linha);
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado");
            
        } catch (IOException e) {
            System.err.println("Erro ao ler");
        }
        
        // ✅ Recursos fechados AUTOMATICAMENTE
        // Sem finally
        // Sem código manual de close()
        
        /*
         * VANTAGENS:
         *   - Código CONCISO (poucas linhas)
         *   - SEM duplicação
         *   - NÃO precisa verificar null
         *   - NÃO precisa capturar exceção de close
         *   - Fechamento GARANTIDO
         *   - Menos propenso a ERROS
         */
    }
}
```

**Solução**: try-with-resources **conciso**, fecha **automaticamente**.

### 3. Comparação: Antes vs Depois

```java
// ✅ Comparação: finally manual vs try-with-resources
public class ComparacaoAntesDepois {
    
    // ❌ ANTES (Java 6): 25+ linhas
    public static void antesJava6() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DriverManager.getConnection("jdbc:...");
            stmt = conn.prepareStatement("SELECT * FROM usuarios");
            rs = stmt.executeQuery();
            
            while (rs.next()) {
                System.out.println(rs.getString("nome"));
            }
            
        } catch (SQLException e) {
            System.err.println("Erro SQL");
            
        } finally {
            if (rs != null) {
                try { rs.close(); }
                catch (SQLException e) { }
            }
            if (stmt != null) {
                try { stmt.close(); }
                catch (SQLException e) { }
            }
            if (conn != null) {
                try { conn.close(); }
                catch (SQLException e) { }
            }
        }
    }
    
    // ✅ DEPOIS (Java 7+): 12 linhas
    public static void depoisJava7() {
        try (Connection conn = DriverManager.getConnection("jdbc:...");
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM usuarios");
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                System.out.println(rs.getString("nome"));
            }
            
        } catch (SQLException e) {
            System.err.println("Erro SQL");
        }
        
        // ✅ Fechamento automático (ordem inversa)
    }
    
    /*
     * REDUÇÃO:
     *   - Antes: 25+ linhas
     *   - Depois: 12 linhas
     *   - 50% MENOS código
     *   - Mais LEGÍVEL
     *   - Menos ERROS
     */
}
```

**Redução**: **50%** menos código, mais **legível**.

### 4. Recursos Suportados

```java
// ✅ Recursos suportados por try-with-resources
public class RecursosSuportados {
    
    /*
     * REQUISITO:
     *   - Implementar AutoCloseable OU Closeable
     *   - Ter método close()
     */
    
    // ✅ Arquivos
    public static void arquivos() throws IOException {
        try (FileReader reader = new FileReader("arquivo.txt");
             FileWriter writer = new FileWriter("saida.txt");
             BufferedReader buffered = new BufferedReader(reader)) {
            
            String linha = buffered.readLine();
            writer.write(linha);
        }
    }
    
    // ✅ Streams
    public static void streams() throws IOException {
        try (FileInputStream input = new FileInputStream("dados.bin");
             FileOutputStream output = new FileOutputStream("copia.bin");
             BufferedInputStream buffered = new BufferedInputStream(input)) {
            
            int data;
            while ((data = buffered.read()) != -1) {
                output.write(data);
            }
        }
    }
    
    // ✅ Banco de dados
    public static void bancoDados() throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:...");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT ...")) {
            
            while (rs.next()) {
                System.out.println(rs.getString(1));
            }
        }
    }
    
    // ✅ Sockets
    public static void sockets() throws IOException {
        try (Socket socket = new Socket("localhost", 8080);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true)) {
            
            out.println("HELLO");
            String resposta = in.readLine();
        }
    }
    
    /*
     * RECURSOS COMUNS:
     *   - FileReader, FileWriter
     *   - BufferedReader, BufferedWriter
     *   - FileInputStream, FileOutputStream
     *   - Connection, Statement, ResultSet
     *   - Socket, ServerSocket
     *   - Scanner
     *   - Formatter
     *   - ZipFile
     *   - etc.
     */
}
```

**Suportados**: qualquer **AutoCloseable** ou **Closeable**.

### 5. Ordem de Fechamento

```java
// ✅ Ordem de fechamento: INVERSA
public class OrdemFechamento {
    
    public static void exemplo() throws IOException {
        System.out.println("=== ORDEM DE FECHAMENTO ===");
        
        try (Recurso1 r1 = new Recurso1();
             Recurso2 r2 = new Recurso2();
             Recurso3 r3 = new Recurso3()) {
            
            System.out.println("Usando recursos");
            
        }  // ✅ Fechamento AUTOMÁTICO
        
        /*
         * SAÍDA:
         * === ORDEM DE FECHAMENTO ===
         * Recurso1 criado
         * Recurso2 criado
         * Recurso3 criado
         * Usando recursos
         * Recurso3 fechado  ← Último criado, primeiro fechado
         * Recurso2 fechado
         * Recurso1 fechado  ← Primeiro criado, último fechado
         * 
         * ORDEM:
         *   - Abertura: r1 → r2 → r3
         *   - Fechamento: r3 → r2 → r1 (INVERSA)
         * 
         * MOTIVO:
         *   - r3 pode depender de r2
         *   - r2 pode depender de r1
         *   - Fechar em ordem inversa garante dependências
         */
    }
    
    static class Recurso1 implements AutoCloseable {
        Recurso1() { System.out.println("Recurso1 criado"); }
        public void close() { System.out.println("Recurso1 fechado"); }
    }
    
    static class Recurso2 implements AutoCloseable {
        Recurso2() { System.out.println("Recurso2 criado"); }
        public void close() { System.out.println("Recurso2 fechado"); }
    }
    
    static class Recurso3 implements AutoCloseable {
        Recurso3() { System.out.println("Recurso3 criado"); }
        public void close() { System.out.println("Recurso3 fechado"); }
    }
}
```

**Ordem**: fechamento **inverso** (último aberto, primeiro fechado).

### 6. Execução Garantida

```java
// ✅ Execução garantida do close()
public class ExecucaoGarantida {
    
    // ✅ Com sucesso (sem exceção)
    public static void comSucesso() throws IOException {
        System.out.println("=== COM SUCESSO ===");
        
        try (Recurso recurso = new Recurso()) {
            System.out.println("1. Usando recurso");
            System.out.println("2. Sucesso");
        }
        
        System.out.println("3. Depois do try");
        
        /*
         * SAÍDA:
         * === COM SUCESSO ===
         * Recurso criado
         * 1. Usando recurso
         * 2. Sucesso
         * Recurso fechado  ← Automático
         * 3. Depois do try
         */
    }
    
    // ✅ Com exceção capturada
    public static void comExcecaoCapturada() {
        System.out.println("=== COM EXCEÇÃO CAPTURADA ===");
        
        try (Recurso recurso = new Recurso()) {
            System.out.println("1. Usando recurso");
            throw new RuntimeException("Erro");
            
        } catch (RuntimeException e) {
            System.out.println("2. Catch - exceção capturada");
        }
        
        System.out.println("3. Depois do try");
        
        /*
         * SAÍDA:
         * === COM EXCEÇÃO CAPTURADA ===
         * Recurso criado
         * 1. Usando recurso
         * Recurso fechado  ← Automático ANTES do catch
         * 2. Catch - exceção capturada
         * 3. Depois do try
         */
    }
    
    // ✅ Com exceção NÃO capturada
    public static void comExcecaoNaoCapturada() {
        System.out.println("=== COM EXCEÇÃO NÃO CAPTURADA ===");
        
        try (Recurso recurso = new Recurso()) {
            System.out.println("1. Usando recurso");
            throw new RuntimeException("Erro");
        }
        
        /*
         * SAÍDA:
         * === COM EXCEÇÃO NÃO CAPTURADA ===
         * Recurso criado
         * 1. Usando recurso
         * Recurso fechado  ← Automático ANTES de propagar
         * Exception in thread "main" RuntimeException: Erro
         */
    }
    
    static class Recurso implements AutoCloseable {
        Recurso() { System.out.println("Recurso criado"); }
        public void close() { System.out.println("Recurso fechado"); }
    }
}
```

**Garantia**: close() **sempre** executa (com ou sem exceção).

### 7. Try-with-Resources vs Finally

```java
// ✅ Comparação detalhada
public class TryWithResourcesVsFinally {
    
    // ❌ Finally manual (16 linhas)
    public static void comFinally() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            int data = reader.read();
            System.out.println("Dados: " + data);
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar");
                }
            }
        }
    }
    
    // ✅ Try-with-resources (7 linhas)
    public static void comTryWithResources() {
        try (FileReader reader = new FileReader("arquivo.txt")) {
            int data = reader.read();
            System.out.println("Dados: " + data);
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    /*
     * COMPARAÇÃO:
     * 
     * FINALLY MANUAL:
     *   ❌ 16 linhas
     *   ❌ Declarar fora do try
     *   ❌ Verificar null
     *   ❌ Try-catch para close()
     *   ❌ Propenso a erros
     * 
     * TRY-WITH-RESOURCES:
     *   ✅ 7 linhas (56% menos)
     *   ✅ Declarar no try ( )
     *   ✅ Sem verificar null
     *   ✅ Sem try-catch para close()
     *   ✅ Menos propenso a erros
     *   ✅ Exceções suppressed
     */
}
```

**vs Finally**: **56%** menos código, menos **erros**.

### 8. Vantagens Try-with-Resources

```java
// ✅ Vantagens do try-with-resources
public class VantagensTryWithResources {
    
    /*
     * VANTAGEM 1: CÓDIGO CONCISO
     *   - 50-60% menos linhas
     *   - Mais legível
     *   - Menos verboso
     */
    
    /*
     * VANTAGEM 2: FECHAMENTO GARANTIDO
     *   - Sempre fecha recursos
     *   - Com ou sem exceção
     *   - Com ou sem return
     *   - Ordem inversa correta
     */
    
    /*
     * VANTAGEM 3: SEM CÓDIGO MANUAL
     *   - Não precisa verificar null
     *   - Não precisa try-catch para close()
     *   - Não precisa lembrar de fechar
     *   - Automático
     */
    
    /*
     * VANTAGEM 4: EXCEÇÕES SUPPRESSED
     *   - Exceção de close() não suprime exceção do try
     *   - Adicionada como suppressed
     *   - getSuppressed() retorna array
     *   - Informação completa
     */
    
    /*
     * VANTAGEM 5: MENOS ERROS
     *   - Não esquecer null check
     *   - Não esquecer close()
     *   - Não esquecer capturar exceção de close()
     *   - Não errar ordem de fechamento
     */
    
    /*
     * VANTAGEM 6: MANUTENÇÃO
     *   - Adicionar recurso: uma linha
     *   - Remover recurso: uma linha
     *   - Sem mexer em finally
     *   - Fácil modificar
     */
}
```

**Vantagens**: conciso, garantido, automático, suppressed, menos erros.

### 9. Quando Usar

```java
// ✅ Quando usar try-with-resources
public class QuandoUsar {
    
    // ✅ SEMPRE que possível
    public static void sempreQuePossivel() throws IOException {
        // ✅ Recurso implementa AutoCloseable
        try (FileReader reader = new FileReader("arquivo.txt")) {
            // Usar
        }
    }
    
    // ✅ Múltiplos recursos
    public static void multiplosRecursos() throws IOException {
        try (FileReader input = new FileReader("entrada.txt");
             FileWriter output = new FileWriter("saida.txt")) {
            
            int data;
            while ((data = input.read()) != -1) {
                output.write(data);
            }
        }
    }
    
    // ✅ Banco de dados
    public static void bancoDados() throws SQLException {
        try (Connection conn = DriverManager.getConnection("jdbc:...");
             PreparedStatement stmt = conn.prepareStatement("...")) {
            
            stmt.executeUpdate();
        }
    }
    
    // ❌ NÃO usar: recurso não implementa AutoCloseable
    public static void naoUsar() {
        // Scanner de System.in não deve ser fechado
        Scanner scanner = new Scanner(System.in);
        String linha = scanner.nextLine();
        // NÃO fechar (fecha System.in)
    }
    
    /*
     * QUANDO USAR:
     *   ✅ Arquivos (Reader, Writer, Stream)
     *   ✅ Banco de dados (Connection, Statement, ResultSet)
     *   ✅ Sockets (Socket, ServerSocket)
     *   ✅ Qualquer AutoCloseable
     * 
     * QUANDO NÃO USAR:
     *   ❌ Scanner(System.in) - não fechar
     *   ❌ Recursos que não implementam AutoCloseable
     *   ❌ Recursos que não devem ser fechados
     */
}
```

**Usar**: **sempre** que recurso implementa AutoCloseable.

### 10. Resumo Visual: Gestão Automática

```java
/*
 * GESTÃO AUTOMÁTICA DE RECURSOS
 * 
 * ANTES (Java 6 - finally manual):
 * 
 * Recurso r = null;          ← Declarar fora
 * try {
 *     r = new Recurso();     ← Criar
 *     usar(r);
 * } catch (Exception e) {
 *     tratar(e);
 * } finally {
 *     if (r != null) {       ← Verificar null
 *         try {
 *             r.close();     ← Fechar manual
 *         } catch (Exc e) {  ← Capturar exceção close
 *         }
 *     }
 * }
 * 
 * 
 * DEPOIS (Java 7+ - automático):
 * 
 * try (Recurso r = new Recurso()) {  ← Declarar + criar
 *     usar(r);
 * } catch (Exception e) {
 *     tratar(e);
 * }
 * // ✅ Fecha AUTOMATICAMENTE (sem finally)
 * // ✅ Sem verificar null
 * // ✅ Sem try-catch para close()
 * 
 * 
 * FLUXO DE EXECUÇÃO:
 * 
 * 1. CRIAR recursos (declarados no try)
 *    ↓
 * 2. USAR recursos (corpo do try)
 *    ↓
 * 3. FECHAR recursos (automático - ordem inversa)
 *    ↓
 * 4. CATCH (se exceção)
 *    ↓
 * 5. CONTINUAR execução
 * 
 * 
 * ORDEM DE FECHAMENTO:
 * 
 * try (R1 r1 = new R1();  ← 1º criar
 *      R2 r2 = new R2();  ← 2º criar
 *      R3 r3 = new R3()) {← 3º criar
 *     usar(r1, r2, r3);
 * }
 * // 1º fechar: r3 (último criado)
 * // 2º fechar: r2
 * // 3º fechar: r1 (primeiro criado)
 * 
 * 
 * COMPARAÇÃO:
 * 
 * ┌─────────────────┬──────────┬─────────────────┐
 * │                 │ Finally  │ Try-with-res    │
 * ├─────────────────┼──────────┼─────────────────┤
 * │ Linhas código   │ 16       │ 7 (56% menos)   │
 * │ Verificar null  │ ✅ Sim   │ ❌ Não          │
 * │ Try-catch close │ ✅ Sim   │ ❌ Não          │
 * │ Suppressed      │ ❌ Manual│ ✅ Automático   │
 * │ Erros           │ Comum    │ Raro            │
 * │ Legibilidade    │ Baixa    │ Alta            │
 * └─────────────────┴──────────┴─────────────────┘
 * 
 * 
 * VANTAGENS:
 * 
 * ✅ Código CONCISO (50-60% menos)
 * ✅ Fechamento GARANTIDO
 * ✅ SEM código manual
 * ✅ Exceções SUPPRESSED
 * ✅ MENOS erros
 * ✅ Fácil MANUTENÇÃO
 */

public class ResumoGestaoAutomatica {
    public static void main(String[] args) {
        System.out.println("=== GESTÃO AUTOMÁTICA (Java 7+) ===");
        System.out.println("\n✅ Try-with-resources:");
        System.out.println("  - Fecha AUTOMATICAMENTE");
        System.out.println("  - 50-60% MENOS código");
        System.out.println("  - SEM finally manual");
        System.out.println("  - Exceções SUPPRESSED");
        System.out.println("\n🎯 Usar SEMPRE que possível");
    }
}
```

---

## Aplicabilidade

**Try-with-resources**:
- **Fecha** automaticamente
- **Sem** finally manual
- **Garante** fechamento
- **Reduz** erros

---

## Armadilhas

### 1. Não Implementa AutoCloseable

```java
// ❌ Recurso não implementa AutoCloseable
class MinhaClasse {
    void close() { }  // Tem close() mas não implementa
}

// try (MinhaClasse obj = new MinhaClasse()) {  // ❌ ERRO
// }

// ✅ Implementar AutoCloseable
class MinhaClasse implements AutoCloseable {
    public void close() { }
}
```

### 2. Fechar System.in

```java
// ❌ Não fechar Scanner(System.in)
// try (Scanner sc = new Scanner(System.in)) {  // ❌ Fecha System.in
// }

// ✅ Não usar try-with-resources
Scanner sc = new Scanner(System.in);
// Não fechar
```

### 3. Recurso Null

```java
// ❌ Recurso null no try
FileReader reader = null;
try (reader) {  // ❌ NullPointerException
}

// ✅ Criar no try
try (FileReader reader = new FileReader("arquivo.txt")) {
}
```

---

## Boas Práticas

### 1. Usar Sempre Que Possível

```java
// ✅ Sempre usar try-with-resources
try (FileReader reader = new FileReader("arquivo.txt")) {
    // Usar
}  // ✅ Fecha automaticamente
```

### 2. Múltiplos Recursos

```java
// ✅ Declarar múltiplos recursos
try (FileReader input = new FileReader("in.txt");
     FileWriter output = new FileWriter("out.txt")) {
    // Usar ambos
}  // ✅ Fecha ambos (ordem inversa)
```

### 3. Preferir a Finally Manual

```java
// ❌ Finally manual (evitar quando possível)
FileReader r = null;
try {
    r = new FileReader("arquivo.txt");
} finally {
    if (r != null) r.close();
}

// ✅ Try-with-resources (preferir)
try (FileReader r = new FileReader("arquivo.txt")) {
}
```

---

## Resumo

**Gestão automática**: try-with-resources fecha recursos **automaticamente**.

**Sintaxe**:
```java
try (Recurso r = new Recurso()) {
    // Usar r
}  // ✅ Fecha automaticamente
```

**Antes (Java 6)**:
- Finally **manual**
- Verificar **null**
- Try-catch para **close()**
- **16** linhas
- Propenso a **erros**

**Depois (Java 7+)**:
- Fechamento **automático**
- **Sem** null check
- **Sem** try-catch close()
- **7** linhas (56% menos)
- **Menos** erros

**Vantagens**:
- Código **conciso** (50-60% menos)
- Fechamento **garantido**
- **Sem** código manual
- Exceções **suppressed**
- **Menos** erros
- Fácil **manutenção**

**Ordem**:
- Fechamento **inverso**
- Último aberto, primeiro **fechado**
- Garante **dependências**

**Execução**:
- Fecha **sempre** (com ou sem exceção)
- **Antes** de catch
- **Antes** de propagação

**Requisito**:
- Implementar **AutoCloseable** ou **Closeable**
- Ter método **close()**

**Regra de Ouro**: Usar try-with-resources **sempre** que possível (recursos AutoCloseable). **Substitui** finally manual. Código **50-60% menor**. Fechamento **garantido**. Exceções **suppressed** (não suprime original).

