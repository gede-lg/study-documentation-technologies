# T3.01 - Checked: Verificadas em Tempo de Compilação

## Introdução

**Checked exceptions** são exceções **verificadas** pelo **compilador** em tempo de **compilação**.

```java
/*
 * CHECKED EXCEPTIONS
 * 
 * DEFINIÇÃO:
 *   - Verificadas em TEMPO DE COMPILAÇÃO
 *   - Compilador OBRIGA tratar ou declarar
 *   - Subclasses de Exception (exceto RuntimeException)
 * 
 * HIERARQUIA:
 *   Exception
 *     ├── RuntimeException (UNCHECKED)
 *     │     └── ... (NullPointerException, etc.)
 *     │
 *     └── Checked Exceptions
 *           ├── IOException
 *           ├── SQLException
 *           ├── ClassNotFoundException
 *           └── ... (todas não são RuntimeException)
 */

// ❌ ERRO DE COMPILAÇÃO: IOException não tratada
public static void lerArquivo(String caminho) {
    FileReader reader = new FileReader(caminho);  // ❌ ERRO
}
// Unreported exception java.io.FileNotFoundException; must be caught or declared

// ✅ SOLUÇÃO 1: declarar com throws
public static void lerArquivo(String caminho) throws IOException {
    FileReader reader = new FileReader(caminho);  // ✅ OK
}

// ✅ SOLUÇÃO 2: capturar com try-catch
public static void lerArquivo(String caminho) {
    try {
        FileReader reader = new FileReader(caminho);  // ✅ OK
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

**Checked** = compilador **verifica** e **obriga** tratar.

---

## Fundamentos

### 1. O Que é Verificação em Compilação?

```java
// ✅ Compilador VERIFICA exceções checked
public class VerificacaoCompilacao {
    
    // ❌ NÃO COMPILA: IOException não tratada
    public static void exemplo1() {
        // FileReader reader = new FileReader("arquivo.txt");  // ❌ ERRO
        /*
         * ERRO DE COMPILAÇÃO:
         * java: unreported exception java.io.FileNotFoundException;
         * must be caught or declared to be thrown
         */
    }
    
    // ✅ COMPILA: IOException declarada com throws
    public static void exemplo2() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");  // ✅ OK
    }
    
    // ✅ COMPILA: IOException tratada com try-catch
    public static void exemplo3() {
        try {
            FileReader reader = new FileReader("arquivo.txt");  // ✅ OK
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
    
    // ⚠️ COMPARAR com unchecked: NÃO verifica
    public static void exemplo4() {
        // ✅ COMPILA sem throws/try-catch
        int resultado = 10 / 0;  // ArithmeticException (unchecked)
    }
}
```

**Verificação** = compilador **detecta** e **exige** tratamento.

### 2. Por Que Verificar em Compilação?

```java
// ✅ Por que checked exceptions?
public class PorQueVerificar {
    
    /*
     * RAZÃO 1: Forçar CONSCIÊNCIA
     *   - Chamador DEVE estar ciente do possível erro
     *   - Não pode esquecer de tratar
     */
    public static String lerConfiguracao(String caminho) throws IOException {
        FileReader reader = new FileReader(caminho);
        // ...
        return "";
    }
    
    public static void exemplo1() {
        // ❌ NÃO COMPILA: deve tratar ou declarar
        // String config = lerConfiguracao("config.txt");
        
        // ✅ Chamador OBRIGADO a decidir como tratar
        try {
            String config = lerConfiguracao("config.txt");
        } catch (FileNotFoundException e) {
            // Decisão: usar config padrão
            String config = obterConfigPadrao();
        } catch (IOException e) {
            // Decisão: logar e notificar
            logger.error("Erro ao ler config", e);
            notificarAdmin(e);
        }
    }
    
    /*
     * RAZÃO 2: Situações ESPERADAS
     *   - Arquivo pode não existir MESMO com código correto
     *   - Rede pode falhar
     *   - Banco pode estar offline
     */
    public static void exemplo2() {
        // Situação ESPERADA: arquivo pode não existir
        // Código está CORRETO, mas arquivo pode estar ausente
        // Compilador força tratar essa possibilidade
    }
    
    /*
     * RAZÃO 3: Fora do CONTROLE
     *   - Aplicação não controla se arquivo existe
     *   - Aplicação não controla se rede funciona
     *   - Aplicação não controla se BD está online
     */
    public static void exemplo3() {
        // Não podemos GARANTIR que arquivo existe
        // Não podemos GARANTIR que rede funciona
        // → Compilador força preparar para falha
    }
    
    private static String obterConfigPadrao() { return ""; }
    private static void logger.error(String msg, Exception e) { }
    private static void notificarAdmin(Exception e) { }
}
```

**Verificação** obriga **consciência** de situações **esperadas** e **fora do controle**.

### 3. Hierarquia de Checked Exceptions

```java
/*
 * HIERARQUIA COMPLETA
 * 
 * Throwable
 *   │
 *   ├── Error (UNCHECKED)
 *   │     └── OutOfMemoryError, StackOverflowError, ...
 *   │
 *   └── Exception
 *         │
 *         ├── RuntimeException (UNCHECKED)
 *         │     └── NullPointerException, ArithmeticException, ...
 *         │
 *         └── CHECKED EXCEPTIONS
 *               ├── IOException
 *               │     ├── FileNotFoundException
 *               │     ├── EOFException
 *               │     ├── SocketException
 *               │     └── ...
 *               │
 *               ├── SQLException
 *               │
 *               ├── ClassNotFoundException
 *               │
 *               ├── ParseException
 *               │
 *               ├── InterruptedException
 *               │
 *               └── ... (todas Exception que NÃO são RuntimeException)
 */

public class HierarquiaChecked {
    
    public static void demonstrarHierarquia() {
        // ✅ Verificar hierarquia em runtime
        Exception checked = new IOException("I/O erro");
        
        System.out.println("instanceof Exception: " + 
                         (checked instanceof Exception));         // true
        System.out.println("instanceof RuntimeException: " + 
                         (checked instanceof RuntimeException));  // false
        System.out.println("instanceof Throwable: " + 
                         (checked instanceof Throwable));         // true
        
        // IOException é checked porque:
        // - É Exception (sim)
        // - NÃO é RuntimeException (correto)
    }
    
    // ✅ Todas subclasses de Exception (exceto RuntimeException) são checked
    public static void todasSaoChecked() throws Exception {
        // Checked
        throw new IOException("I/O");           // ✅ checked
        throw new SQLException("SQL");          // ✅ checked
        throw new ClassNotFoundException("Class");  // ✅ checked
        
        // Unchecked (RuntimeException)
        // throw new NullPointerException("NPE");  // ❌ unchecked
        // throw new ArithmeticException("Arith"); // ❌ unchecked
    }
}
```

**Checked** = `Exception` mas **não** `RuntimeException`.

### 4. Principais Checked Exceptions

```java
// ✅ Checked exceptions mais comuns
public class PrincipaisChecked {
    
    // 1. IOException: I/O (arquivo, rede)
    public static void exemploIO() throws IOException {
        // FileNotFoundException: arquivo não existe
        FileReader reader = new FileReader("arquivo.txt");
        
        // EOFException: fim inesperado do arquivo
        DataInputStream input = new DataInputStream(new FileInputStream("data.bin"));
        input.readInt();
        
        // SocketException: erro de rede
        Socket socket = new Socket("localhost", 8080);
        
        // Todas são IOException (checked)
    }
    
    // 2. SQLException: banco de dados
    public static void exemploSQL() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM users");
        // Qualquer operação BD pode lançar SQLException
    }
    
    // 3. ClassNotFoundException: classe não encontrada
    public static void exemploClassNotFound() throws ClassNotFoundException {
        // Carregar classe dinamicamente
        Class<?> classe = Class.forName("com.exemplo.MinhaClasse");
    }
    
    // 4. ParseException: erro ao fazer parsing
    public static void exemploParse() throws ParseException {
        SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
        Date data = formato.parse("31/12/2023");
    }
    
    // 5. InterruptedException: thread interrompida
    public static void exemploInterrupted() throws InterruptedException {
        Thread.sleep(1000);
    }
    
    // 6. CloneNotSupportedException: objeto não clonable
    public static void exemploClone() throws CloneNotSupportedException {
        Object obj = new Object();
        obj.clone();  // throws CloneNotSupportedException
    }
    
    public static void main(String[] args) {
        System.out.println("=== Principais Checked Exceptions ===");
        System.out.println("1. IOException: I/O (arquivo, rede)");
        System.out.println("2. SQLException: banco de dados");
        System.out.println("3. ClassNotFoundException: classe não encontrada");
        System.out.println("4. ParseException: parsing de dados");
        System.out.println("5. InterruptedException: thread interrompida");
        System.out.println("6. CloneNotSupportedException: clone não suportado");
    }
}
```

**Checked** cobre situações **externas** (arquivo, rede, BD, parsing).

### 5. Compilador Obriga: Exemplos Práticos

```java
// ✅ Exemplos de obrigatoriedade do compilador
public class CompiladorObriga {
    
    // ❌ EXEMPLO 1: FileReader sem tratamento
    public static void erro1() {
        // ❌ NÃO COMPILA
        // FileReader reader = new FileReader("arquivo.txt");
        /*
         * ERRO:
         * java: unreported exception java.io.FileNotFoundException;
         * must be caught or declared to be thrown
         */
    }
    
    // ✅ SOLUÇÃO 1A: throws
    public static void solucao1A() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");  // ✅ OK
    }
    
    // ✅ SOLUÇÃO 1B: try-catch
    public static void solucao1B() {
        try {
            FileReader reader = new FileReader("arquivo.txt");  // ✅ OK
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    // ❌ EXEMPLO 2: Método que declara checked mas não trata
    public static void erro2() {
        // ❌ NÃO COMPILA
        // metodoComThrows();
        /*
         * ERRO:
         * java: unreported exception java.io.IOException;
         * must be caught or declared to be thrown
         */
    }
    
    public static void metodoComThrows() throws IOException {
        throw new IOException("Erro");
    }
    
    // ✅ SOLUÇÃO 2A: throws
    public static void solucao2A() throws IOException {
        metodoComThrows();  // ✅ OK
    }
    
    // ✅ SOLUÇÃO 2B: try-catch
    public static void solucao2B() {
        try {
            metodoComThrows();  // ✅ OK
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    
    // ❌ EXEMPLO 3: Múltiplas checked exceptions
    public static void erro3() {
        // ❌ NÃO COMPILA
        // operacaoCompleta();
        /*
         * ERRO:
         * java: unreported exception java.io.IOException; ...
         * java: unreported exception java.sql.SQLException; ...
         */
    }
    
    public static void operacaoCompleta() throws IOException, SQLException {
        throw new IOException("I/O");
        // throw new SQLException("SQL");
    }
    
    // ✅ SOLUÇÃO 3: tratar todas
    public static void solucao3() {
        try {
            operacaoCompleta();  // ✅ OK
        } catch (IOException e) {
            System.err.println("Erro I/O: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
        }
    }
}
```

**Compilador** detecta checked **não tratada** e **não compila**.

### 6. Verificação em Tempo de Compilação vs Runtime

```java
// ✅ Checked vs Unchecked: quando o erro é detectado?
public class CompilaVsRuntime {
    
    // CHECKED: detectado em COMPILAÇÃO
    public static void exemploChecked() {
        // ❌ NÃO COMPILA (erro detectado ANTES de executar)
        // FileReader reader = new FileReader("arquivo.txt");
        
        System.out.println("=== CHECKED ===");
        System.out.println("Detectado: TEMPO DE COMPILAÇÃO");
        System.out.println("Compilador: ERRO (não compila)");
        System.out.println("Obriga: TRATAR ou DECLARAR");
    }
    
    // UNCHECKED: detectado em RUNTIME (se ocorrer)
    public static void exemploUnchecked() {
        // ✅ COMPILA (erro só detectado AO EXECUTAR)
        int resultado = 10 / 0;  // ArithmeticException
        
        System.out.println("=== UNCHECKED ===");
        System.out.println("Detectado: TEMPO DE EXECUÇÃO");
        System.out.println("Compilador: OK (compila)");
        System.out.println("Obriga: NÃO (opcional tratar)");
    }
    
    // Comparação lado a lado
    public static void comparacao() {
        System.out.println("=== COMPARAÇÃO ===\n");
        
        System.out.println("CHECKED (IOException):");
        System.out.println("  - Verificado: COMPILAÇÃO");
        System.out.println("  - Compilador: NÃO compila sem tratar");
        System.out.println("  - Obrigatório: throws OU try-catch");
        System.out.println("  - Quando: ANTES de executar");
        
        System.out.println("\nUNCHECKED (ArithmeticException):");
        System.out.println("  - Verificado: RUNTIME");
        System.out.println("  - Compilador: compila normalmente");
        System.out.println("  - Obrigatório: NÃO");
        System.out.println("  - Quando: AO executar (se ocorrer)");
    }
}
```

**Checked** = verificado em **compilação**. **Unchecked** = verificado em **runtime**.

### 7. IDE e Compilador: Warnings e Erros

```java
// ✅ Como IDE e compilador mostram checked exceptions
public class IDECompilador {
    
    // ❌ IDE mostra ERRO vermelho (não compila)
    public static void exemploIDE() {
        // FileReader reader = new FileReader("arquivo.txt");
        /*
         * IDE:
         *   - Sublinha vermelho (erro)
         *   - Tooltip: "Unhandled exception: java.io.FileNotFoundException"
         *   - Quick fix: "Add exception to method signature"
         *   - Quick fix: "Surround with try-catch"
         */
    }
    
    // ✅ Compilador linha de comando
    public static void exemploCompilador() {
        /*
         * javac Arquivo.java
         * 
         * Saída:
         *   Arquivo.java:5: error: unreported exception FileNotFoundException;
         *   must be caught or declared to be thrown
         *       FileReader reader = new FileReader("arquivo.txt");
         *                           ^
         *   1 error
         * 
         * → NÃO gera .class (não compila)
         */
    }
    
    // ✅ Após corrigir (throws ou try-catch)
    public static void corrigido() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");
        /*
         * IDE:
         *   - SEM erro vermelho
         *   - Compila normalmente
         * 
         * javac:
         *   - SEM erro
         *   - Gera .class
         */
    }
}
```

**IDE** e **compilador** mostram **erro** para checked não tratada.

### 8. Checked em Diferentes Contextos

```java
// ✅ Checked exceptions em diferentes situações
public class DiferentesContextos {
    
    // 1. Em CONSTRUTORES
    public static class Exemplo1 {
        private FileReader reader;
        
        // ❌ NÃO COMPILA sem throws
        // public Exemplo1(String caminho) {
        //     reader = new FileReader(caminho);
        // }
        
        // ✅ OK: construtor com throws
        public Exemplo1(String caminho) throws IOException {
            reader = new FileReader(caminho);
        }
    }
    
    // 2. Em MÉTODOS DE INTERFACE
    public interface Exemplo2 {
        // ✅ Interface pode declarar checked
        void processar(String arquivo) throws IOException;
    }
    
    public static class Implementacao implements Exemplo2 {
        // ✅ Implementação DEVE declarar mesma exceção (ou subclasse)
        @Override
        public void processar(String arquivo) throws IOException {
            FileReader reader = new FileReader(arquivo);
        }
        
        // ❌ NÃO pode adicionar NOVAS checked (mais restritiva)
        // public void processar(String arquivo) throws IOException, SQLException {
        // }
    }
    
    // 3. Em BLOCOS ESTÁTICOS
    public static class Exemplo3 {
        static {
            // ❌ NÃO pode lançar checked em static
            // throw new IOException("Erro");
            
            // ✅ DEVE tratar dentro do bloco
            try {
                FileReader reader = new FileReader("config.txt");
            } catch (IOException e) {
                // Tratar ou lançar unchecked
                throw new RuntimeException("Erro ao carregar config", e);
            }
        }
    }
    
    // 4. Em LAMBDAS/STREAMS
    public static void exemplo4() {
        List<String> arquivos = Arrays.asList("a.txt", "b.txt");
        
        // ❌ Lambda NÃO pode lançar checked diretamente
        // arquivos.forEach(arquivo -> {
        //     FileReader reader = new FileReader(arquivo);  // ERRO
        // });
        
        // ✅ DEVE tratar dentro do lambda
        arquivos.forEach(arquivo -> {
            try {
                FileReader reader = new FileReader(arquivo);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
```

**Checked** em construtores, interfaces, blocos estáticos e lambdas tem **regras específicas**.

### 9. Checked e Herança

```java
// ✅ Checked exceptions em hierarquia de classes
public class CheckedHeranca {
    
    // Classe base
    public static class Base {
        // Método que lança IOException
        public void processar(String arquivo) throws IOException {
            FileReader reader = new FileReader(arquivo);
        }
    }
    
    // Subclasse
    public static class Filha extends Base {
        // ✅ OK: NÃO lança exceção
        @Override
        public void processar(String arquivo) {
            System.out.println("Processando: " + arquivo);
        }
        
        // ✅ OK: lança MESMA exceção
        // @Override
        // public void processar(String arquivo) throws IOException {
        //     super.processar(arquivo);
        // }
        
        // ✅ OK: lança SUBCLASSE da exceção
        // @Override
        // public void processar(String arquivo) throws FileNotFoundException {
        //     FileReader reader = new FileReader(arquivo);
        // }
        
        // ❌ ERRO: NÃO pode lançar exceção MAIS AMPLA
        // @Override
        // public void processar(String arquivo) throws Exception {
        //     // ERRO: Exception é mais ampla que IOException
        // }
        
        // ❌ ERRO: NÃO pode lançar exceção DIFERENTE
        // @Override
        // public void processar(String arquivo) throws SQLException {
        //     // ERRO: SQLException não é subclasse de IOException
        // }
    }
    
    /*
     * REGRAS:
     *   - Pode NÃO lançar exceção
     *   - Pode lançar MESMA exceção
     *   - Pode lançar SUBCLASSE da exceção
     *   - NÃO pode lançar exceção MAIS AMPLA
     *   - NÃO pode lançar exceção DIFERENTE
     */
}
```

**Override** pode lançar exceção **igual**, **mais específica** ou **nenhuma** (não mais ampla).

### 10. Resumo Visual: Verificação em Compilação

```java
/*
 * CHECKED EXCEPTIONS: VERIFICAÇÃO EM COMPILAÇÃO
 * 
 * ┌─────────────────────────────────────────────────┐
 * │  CÓDIGO FONTE                                   │
 * │  public void ler() {                            │
 * │      FileReader r = new FileReader("file.txt"); │ ← IOException (checked)
 * │  }                                              │
 * └─────────────────┬───────────────────────────────┘
 *                   │
 *                   ▼
 *           ┌───────────────┐
 *           │  COMPILADOR   │
 *           │   (javac)     │
 *           └───────┬───────┘
 *                   │
 *         ┌─────────┴─────────┐
 *         │                   │
 *    VERIFICA             DETECTA
 *    checked              IOException
 *    exceptions           não tratada
 *         │                   │
 *         └─────────┬─────────┘
 *                   │
 *                   ▼
 *           ┌───────────────┐
 *           │  ERRO         │
 *           │  "unreported  │
 *           │   exception"  │
 *           └───────┬───────┘
 *                   │
 *         ┌─────────┴─────────┐
 *         │                   │
 *    SOLUÇÃO 1           SOLUÇÃO 2
 *    throws IOException  try-catch
 *         │                   │
 *         └─────────┬─────────┘
 *                   │
 *                   ▼
 *           ┌───────────────┐
 *           │  COMPILA      │
 *           │  .class       │
 *           └───────────────┘
 * 
 * TEMPO:
 *   - Verificação: COMPILAÇÃO (antes de executar)
 *   - Obrigatoriedade: SIM (não compila sem tratar)
 *   - Visibilidade: IDE mostra erro vermelho
 */

public class ResumoVisual {
    public static void main(String[] args) {
        System.out.println("=== CHECKED: VERIFICAÇÃO EM COMPILAÇÃO ===");
        System.out.println("\n1. ESCREVE código com checked exception");
        System.out.println("2. COMPILADOR verifica");
        System.out.println("3. DETECTA exceção não tratada");
        System.out.println("4. ERRO de compilação");
        System.out.println("5. OBRIGA: throws OU try-catch");
        System.out.println("6. CORRIGE código");
        System.out.println("7. COMPILA com sucesso");
    }
}
```

---

## Aplicabilidade

**Checked exceptions** são usadas para:
- Situações **esperadas** (arquivo ausente, rede falha)
- Problemas **externos** (fora do controle)
- **Forçar** chamador estar ciente
- **Obrigar** tratamento ou declaração

---

## Armadilhas

### 1. Esquecer de Tratar

```java
// ❌ Esqueceu: não compila
// FileReader r = new FileReader("file.txt");

// ✅ Lembrar: throws ou try-catch
```

### 2. Tratar Muito Genérico

```java
// ❌ Muito genérico
catch (Exception e) { }

// ✅ Específico
catch (FileNotFoundException e) { }
catch (IOException e) { }
```

### 3. Capturar e Ignorar

```java
// ❌ Captura e ignora
try {
    ler();
} catch (IOException e) {
    // Silencioso
}

// ✅ Logar ou tratar
catch (IOException e) {
    logger.error("Erro", e);
}
```

---

## Boas Práticas

### 1. Sempre Tratar ou Declarar

```java
// ✅ Declarar se não pode tratar
public void ler() throws IOException { }

// ✅ Tratar se pode recuperar
try { } catch (IOException e) {
    usarBackup();
}
```

### 2. Documentar com @throws

```java
/**
 * @throws IOException Se erro ao ler
 */
public void ler() throws IOException { }
```

### 3. Não Capturar Exception Genérico

```java
// ❌ Muito amplo
catch (Exception e) { }

// ✅ Específico
catch (IOException e) { }
```

---

## Resumo

**Checked exceptions** = verificadas em **tempo de compilação**.

**Características**:
- **Compilador OBRIGA** tratar ou declarar
- **Não compila** sem `throws` ou `try-catch`
- Subclasses de `Exception` (exceto `RuntimeException`)
- **IDE mostra erro** vermelho

**Principais**:
- `IOException`: I/O (arquivo, rede)
- `SQLException`: banco de dados
- `ClassNotFoundException`: classe não encontrada
- `ParseException`: parsing
- `InterruptedException`: thread interrompida

**Por que verificar**:
- **Forçar consciência** do chamador
- Situações **esperadas** (arquivo ausente)
- **Fora do controle** (rede, BD)

**Obrigatoriedade**:
- **DEVE** usar `throws` OU `try-catch`
- Compilador **detecta** e **não compila**
- IDE mostra **erro vermelho**

**Contextos especiais**:
- **Construtores**: podem ter `throws`
- **Interfaces**: podem declarar checked
- **Override**: pode ser igual/mais específica/nenhuma
- **Lambdas**: devem tratar internamente

**Regra de Ouro**: Checked = **compilador verifica**. **Obriga** tratar ou declarar. **Não compila** sem tratamento. Usar para situações **esperadas** e **externas**. Sempre **documentar** com `@throws`.
