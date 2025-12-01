# T2.03 - Exception: Exceções Verificadas

## Introdução

**Exception** representa problemas **recuperáveis** da **aplicação** que **devem** ser tratados.

```java
/*
 * HIERARQUIA EXCEPTION
 * 
 *                  Throwable
 *                      |
 *          ┌───────────┴───────────┐
 *          |                       |
 *        Error                 Exception ← RECUPERÁVEL
 *                                  |
 *                      ┌───────────┴──────────┐
 *                      |                      |
 *              RuntimeException         Checked Exceptions
 *               (unchecked)              (VERIFICADAS)
 *                      |                      |
 *          NullPointerException      IOException
 *          ArithmeticException       SQLException
 *                 ...                ClassNotFoundException
 *                                           ...
 */

// ✅ EXCEPTION: problema recuperável (DEVE tratar)
public static void lerArquivo(String caminho) throws IOException {
    FileReader reader = new FileReader(caminho);  // throws FileNotFoundException
    // ...
}  // IOException = checked → DEVE tratar ou declarar

// ❌ ERROR: JVM comprometida (NÃO tratar)
public static void recursaoInfinita() {
    recursaoInfinita();
}  // StackOverflowError → programa encerra
```

**Exception** = problema **recuperável**. Aplicação **controla** e **deve tratar**.

---

## Fundamentos

### 1. Classe Exception: Estrutura

```java
// ✅ Hierarquia da classe Exception
public class Exception extends Throwable {
    // Construtores
    public Exception() { }
    public Exception(String message) { }
    public Exception(String message, Throwable cause) { }
    public Exception(Throwable cause) { }
}

// ✅ Exception é a raiz das exceções recuperáveis
public class ExemploException {
    public static void main(String[] args) {
        // Verificar hierarquia
        Exception excecao = new IOException("I/O erro");
        
        System.out.println("instanceof Exception: " + (excecao instanceof Exception));  // true
        System.out.println("instanceof Throwable: " + (excecao instanceof Throwable));  // true
        System.out.println("instanceof Error: " + (excecao instanceof Error));          // false
        
        // Exception NÃO é Error
        System.out.println("\nException extends Throwable: true");
        System.out.println("Exception extends Error: false");
    }
}
```

**Exception** estende **Throwable** diretamente (não é Error).

### 2. Exception: Checked (Verificadas)

```java
// ✅ Checked exceptions: compilador OBRIGA tratar
public class CheckedExceptions {
    
    // ❌ ERRO: IOException não tratada
    public static void lerArquivoErro(String caminho) {
        // FileReader reader = new FileReader(caminho);  // ❌ ERRO DE COMPILAÇÃO
        // Unreported exception java.io.FileNotFoundException; must be caught or declared
    }
    
    // ✅ SOLUÇÃO 1: declarar com throws
    public static void lerArquivoThrows(String caminho) throws IOException {
        FileReader reader = new FileReader(caminho);  // ✅ Declara IOException
        // Chamador DEVE tratar ou declarar também
    }
    
    // ✅ SOLUÇÃO 2: capturar com try-catch
    public static void lerArquivoTryCatch(String caminho) {
        try {
            FileReader reader = new FileReader(caminho);  // ✅ Dentro de try
            // ...
        } catch (FileNotFoundException e) {
            System.out.println("Arquivo não encontrado: " + caminho);
        } catch (IOException e) {
            System.out.println("Erro ao ler arquivo: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        // Chamar método com throws
        try {
            lerArquivoThrows("config.txt");
        } catch (IOException e) {
            System.out.println("Erro: " + e.getMessage());
        }
        
        // Chamar método com try-catch (não precisa tratar)
        lerArquivoTryCatch("config.txt");
    }
}
```

**Checked exceptions** (Exception - RuntimeException) = compilador **obriga** tratar ou declarar.

### 3. Principais Checked Exceptions

```java
// ✅ Checked exceptions mais comuns
public class PrincipaisChecked {
    
    // 1. IOException: problemas de I/O
    public static void exemploIOException() throws IOException {
        // FileNotFoundException: arquivo não existe
        FileReader reader = new FileReader("arquivo.txt");
        
        // EOFException: fim do arquivo inesperado
        DataInputStream input = new DataInputStream(new FileInputStream("data.bin"));
        input.readInt();  // Pode lançar EOFException
        
        // SocketException: problemas de rede
        Socket socket = new Socket("localhost", 8080);
    }
    
    // 2. SQLException: problemas com banco de dados
    public static void exemploSQLException() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/db");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT * FROM users");
        // Qualquer operação pode lançar SQLException
    }
    
    // 3. ClassNotFoundException: classe não encontrada
    public static void exemploClassNotFoundException() throws ClassNotFoundException {
        // Carregar classe dinamicamente
        Class<?> classe = Class.forName("com.exemplo.MinhaClasse");
    }
    
    // 4. ParseException: erro ao fazer parsing
    public static void exemploParseException() throws ParseException {
        SimpleDateFormat formato = new SimpleDateFormat("dd/MM/yyyy");
        Date data = formato.parse("31/12/2023");  // throws ParseException
    }
    
    // 5. InterruptedException: thread interrompida
    public static void exemploInterruptedException() throws InterruptedException {
        Thread.sleep(1000);  // throws InterruptedException
    }
    
    public static void main(String[] args) {
        System.out.println("=== Principais Checked Exceptions ===");
        System.out.println("IOException: I/O (arquivo, rede)");
        System.out.println("SQLException: Banco de dados");
        System.out.println("ClassNotFoundException: Classe não encontrada");
        System.out.println("ParseException: Erro ao fazer parsing");
        System.out.println("InterruptedException: Thread interrompida");
    }
}
```

**Checked exceptions** cobrem situações **externas** (arquivo, rede, BD).

### 4. Por Que Checked Exceptions Existem?

```java
// ✅ Por que checked exceptions?
public class PorQueChecked {
    
    // SITUAÇÃO: arquivo pode não existir
    public static String lerConfiguracao(String caminho) throws IOException {
        // ✅ Compilador OBRIGA chamador estar CIENTE
        FileReader reader = new FileReader(caminho);  // throws FileNotFoundException
        BufferedReader br = new BufferedReader(reader);
        return br.readLine();
    }
    
    public static void main(String[] args) {
        // ✅ Chamador DEVE decidir como tratar
        try {
            String config = lerConfiguracao("config.txt");
            System.out.println("Config: " + config);
        } catch (FileNotFoundException e) {
            // ✅ Arquivo não existe: usar configuração padrão
            System.out.println("Config não encontrada, usando padrão");
            String config = obterConfigPadrao();
        } catch (IOException e) {
            // ✅ Outro erro I/O: logar e notificar
            System.err.println("Erro ao ler config: " + e.getMessage());
            notificarAdministrador(e);
        }
    }
    
    private static String obterConfigPadrao() {
        return "configuração padrão";
    }
    
    private static void notificarAdministrador(Exception e) {
        // Notificar...
    }
}

/*
 * POR QUE CHECKED?
 * 
 * 1. Situação ESPERADA: arquivo pode não existir mesmo com código correto
 * 2. Fora do CONTROLE: não podemos garantir arquivo existe
 * 3. Chamador CIENTE: deve estar preparado para falha
 * 4. Recuperação: pode usar config padrão, solicitar caminho, etc.
 */
```

**Checked exceptions** = situações **esperadas** do mundo real.

### 5. Checked vs Unchecked

```java
// ✅ Diferença entre checked e unchecked
public class CheckedVsUnchecked {
    
    // CHECKED: situação ESPERADA (arquivo pode não existir)
    public static void exemploChecked(String caminho) throws IOException {
        // ✅ Pode acontecer MESMO com código correto
        FileReader reader = new FileReader(caminho);
        // Compilador OBRIGA tratar
    }
    
    // UNCHECKED: erro de PROGRAMAÇÃO (deveria prevenir)
    public static void exemploUnchecked(String texto) {
        // ❌ NullPointerException: BUG no código
        System.out.println(texto.length());  // Deveria validar texto != null
        // Compilador NÃO obriga tratar
    }
    
    // ✅ CORRETO: prevenir unchecked com validação
    public static void exemploCorreto(String texto) {
        // ✅ Validar entrada
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        
        System.out.println(texto.length());  // Seguro
    }
    
    public static void main(String[] args) {
        System.out.println("=== Checked vs Unchecked ===");
        System.out.println("\nCHECKED:");
        System.out.println("  - Situação ESPERADA (pode acontecer)");
        System.out.println("  - Fora do controle (arquivo, rede, BD)");
        System.out.println("  - Compilador OBRIGA tratar");
        System.out.println("  - Exemplo: IOException, SQLException");
        
        System.out.println("\nUNCHECKED:");
        System.out.println("  - Erro de PROGRAMAÇÃO (bug)");
        System.out.println("  - Sob controle (validar, prevenir)");
        System.out.println("  - Compilador NÃO obriga");
        System.out.println("  - Exemplo: NullPointerException, IllegalArgumentException");
    }
}
```

**Checked** = esperado e externo. **Unchecked** = bug (validar).

### 6. Tratamento de Checked Exceptions

```java
// ✅ Formas de tratar checked exceptions
public class TratamentoChecked {
    
    // 1. Tratar LOCALMENTE com try-catch
    public static void tratarLocal() {
        try {
            FileReader reader = new FileReader("config.txt");
            BufferedReader br = new BufferedReader(reader);
            String linha = br.readLine();
            System.out.println("Leu: " + linha);
        } catch (FileNotFoundException e) {
            System.out.println("Arquivo não encontrado, usando padrão");
        } catch (IOException e) {
            System.out.println("Erro ao ler: " + e.getMessage());
        }
    }
    
    // 2. PROPAGAR com throws (chamador trata)
    public static void propagar() throws IOException {
        FileReader reader = new FileReader("config.txt");
        // Não trata: declara throws
        // Chamador DEVE tratar
    }
    
    // 3. CONTEXTUALIZAR (capturar e relançar com contexto)
    public static void contextualizar(String cliente) throws Exception {
        try {
            Connection conn = DriverManager.getConnection("jdbc:...");
            // ...
        } catch (SQLException e) {
            // ✅ Adiciona contexto
            throw new Exception("Erro ao processar cliente " + cliente, e);
        }
    }
    
    // 4. CONVERTER para unchecked (quando apropriado)
    public static void converterUnchecked() {
        try {
            FileReader reader = new FileReader("config.txt");
            // ...
        } catch (IOException e) {
            // ✅ Erro FATAL: encapsular em unchecked
            throw new RuntimeException("Config obrigatória não encontrada", e);
        }
    }
    
    // 5. RECUPERAR (fallback, retry, alternativa)
    public static void recuperar() {
        try {
            // Tentar arquivo principal
            FileReader reader = new FileReader("config.txt");
        } catch (FileNotFoundException e) {
            try {
                // ✅ Fallback: arquivo backup
                FileReader reader = new FileReader("config.backup.txt");
            } catch (FileNotFoundException e2) {
                // ✅ Último recurso: config padrão
                System.out.println("Usando configuração padrão");
            }
        } catch (IOException e) {
            System.err.println("Erro I/O: " + e.getMessage());
        }
    }
}
```

**Tratamento**: local, propagar, contextualizar, converter, recuperar.

### 7. Múltiplas Checked Exceptions

```java
// ✅ Tratar múltiplas checked exceptions
public class MultiplasChecked {
    
    // Método que pode lançar múltiplas exceções
    public static void operacaoCompleta() throws IOException, SQLException, 
                                                 ClassNotFoundException {
        // I/O
        FileReader reader = new FileReader("config.txt");
        
        // Banco de dados
        Connection conn = DriverManager.getConnection("jdbc:...");
        
        // Carregar classe
        Class<?> classe = Class.forName("com.exemplo.MinhaClasse");
    }
    
    // Tratar cada exceção de forma diferente
    public static void tratarDiferenciado() {
        try {
            operacaoCompleta();
        } catch (FileNotFoundException e) {
            // ✅ Arquivo não encontrado: criar arquivo
            System.out.println("Criando arquivo de config...");
            criarArquivo("config.txt");
        } catch (IOException e) {
            // ✅ Outro erro I/O: logar e notificar
            System.err.println("Erro I/O: " + e.getMessage());
            notificarAdministrador(e);
        } catch (SQLException e) {
            // ✅ Erro BD: reconectar
            System.err.println("Erro BD: " + e.getMessage());
            reconectar();
        } catch (ClassNotFoundException e) {
            // ✅ Classe não encontrada: erro fatal
            System.err.println("Classe não encontrada: " + e.getMessage());
            throw new RuntimeException("Dependência ausente", e);
        }
    }
    
    // Java 7+: multi-catch
    public static void multiCatch() {
        try {
            operacaoCompleta();
        } catch (IOException | SQLException e) {
            // ✅ Tratar ambas da mesma forma
            System.err.println("Erro: " + e.getMessage());
            logar(e);
        } catch (ClassNotFoundException e) {
            // ✅ Tratar diferente
            throw new RuntimeException("Classe ausente", e);
        }
    }
    
    private static void criarArquivo(String caminho) { }
    private static void notificarAdministrador(Exception e) { }
    private static void reconectar() { }
    private static void logar(Exception e) { }
}
```

**Múltiplas exceções** = tratar cada de forma **apropriada**.

### 8. Liberação de Recursos com Checked

```java
// ✅ Liberar recursos mesmo com exceções
public class LiberacaoRecursos {
    
    // ❌ Recurso pode vazar
    public static void vazamento() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");
        // Se exceção aqui, reader NÃO é fechado
        String conteudo = ler(reader);
        reader.close();  // Pode não executar
    }
    
    // ✅ try-finally: sempre fecha
    public static void tryFinally() throws IOException {
        FileReader reader = null;
        try {
            reader = new FileReader("arquivo.txt");
            String conteudo = ler(reader);
        } finally {
            // ✅ SEMPRE executa (mesmo com exceção)
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // Logar erro ao fechar
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
    }
    
    // ✅ try-with-resources: fecha AUTOMATICAMENTE
    public static void tryWithResources() throws IOException {
        try (FileReader reader = new FileReader("arquivo.txt");
             BufferedReader br = new BufferedReader(reader)) {
            
            String linha = br.readLine();
            System.out.println(linha);
            
        }  // ✅ reader e br fechados AUTOMATICAMENTE (ordem inversa)
    }
    
    // ✅ Múltiplos recursos
    public static void multiplosTryWithResources() throws IOException {
        try (FileReader input = new FileReader("origem.txt");
             FileWriter output = new FileWriter("destino.txt");
             BufferedReader br = new BufferedReader(input);
             BufferedWriter bw = new BufferedWriter(output)) {
            
            String linha;
            while ((linha = br.readLine()) != null) {
                bw.write(linha);
                bw.newLine();
            }
            
        }  // ✅ Todos fechados automaticamente (ordem inversa: bw, br, output, input)
    }
    
    private static String ler(FileReader reader) throws IOException {
        return "";
    }
}
```

**try-with-resources** garante **liberação automática** de recursos.

### 9. Encadeamento de Checked Exceptions

```java
// ✅ Encadear checked exceptions preservando causa
public class EncadeamentoChecked {
    
    // Nível baixo: lança IOException
    public static void operacaoBaixoNivel() throws IOException {
        throw new FileNotFoundException("config.txt não encontrado");
    }
    
    // Nível médio: captura IOException e contextualiza
    public static void operacaoMedioNivel(String cliente) throws Exception {
        try {
            operacaoBaixoNivel();
        } catch (IOException e) {
            // ✅ Encadear: preserva causa original
            throw new Exception("Erro ao carregar config do cliente " + cliente, e);
        }
    }
    
    // Nível alto: captura Exception e trata
    public static void operacaoAltoNivel() {
        try {
            operacaoMedioNivel("Cliente123");
        } catch (Exception e) {
            System.err.println("Erro na operação:");
            System.err.println("Mensagem: " + e.getMessage());
            System.err.println("Causa: " + e.getCause());
            System.err.println("Causa raiz: " + e.getCause().getMessage());
            
            // Stack trace completo (mostra toda cadeia)
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        operacaoAltoNivel();
    }
}

/* Saída:
Erro na operação:
Mensagem: Erro ao carregar config do cliente Cliente123
Causa: java.io.FileNotFoundException: config.txt não encontrado
Causa raiz: config.txt não encontrado

Stack trace:
java.lang.Exception: Erro ao carregar config do cliente Cliente123
    at EncadeamentoChecked.operacaoMedioNivel(...)
    at EncadeamentoChecked.operacaoAltoNivel(...)
    at EncadeamentoChecked.main(...)
Caused by: java.io.FileNotFoundException: config.txt não encontrado
    at EncadeamentoChecked.operacaoBaixoNivel(...)
    at EncadeamentoChecked.operacaoMedioNivel(...)
    ... 2 more
*/
```

**Encadeamento** preserva **histórico completo** da exceção.

### 10. Documentação de Checked Exceptions

```java
// ✅ Documentar checked exceptions com Javadoc
public class DocumentacaoChecked {
    
    /**
     * Lê configuração do arquivo especificado.
     * 
     * @param caminho Caminho do arquivo de configuração
     * @return Conteúdo do arquivo
     * @throws FileNotFoundException Se arquivo não existir
     * @throws IOException Se ocorrer erro ao ler arquivo
     */
    public static String lerConfiguracao(String caminho) 
            throws FileNotFoundException, IOException {
        
        FileReader reader = new FileReader(caminho);  // throws FileNotFoundException
        BufferedReader br = new BufferedReader(reader);
        return br.readLine();  // throws IOException
    }
    
    /**
     * Conecta ao banco de dados.
     * 
     * @param url URL do banco
     * @param usuario Nome do usuário
     * @param senha Senha
     * @return Conexão estabelecida
     * @throws SQLException Se não conseguir conectar
     */
    public static Connection conectar(String url, String usuario, String senha) 
            throws SQLException {
        
        return DriverManager.getConnection(url, usuario, senha);
    }
    
    public static void main(String[] args) {
        System.out.println("=== Documentação Checked ===");
        System.out.println("✅ Usar @throws em Javadoc");
        System.out.println("✅ Declarar no método (throws)");
        System.out.println("✅ IDE mostra warnings");
        System.out.println("✅ Compilador obriga tratar");
    }
}
```

**Javadoc @throws** documenta exceções para chamadores.

---

## Aplicabilidade

**Exception (checked)** é usada para:
- Problemas **externos** (arquivo, rede, BD)
- Situações **esperadas** (pode acontecer)
- **Fora do controle** da aplicação
- Obrigar chamador estar **ciente**

---

## Armadilhas

### 1. Capturar e Ignorar

```java
// ❌ Capturar e ignorar
try {
    lerArquivo("config.txt");
} catch (IOException e) {
    // ❌ Silencioso
}

// ✅ Sempre logar ou tratar
try {
    lerArquivo("config.txt");
} catch (IOException e) {
    logger.error("Erro", e);
    usarConfigPadrao();
}
```

### 2. Perder Causa Original

```java
// ❌ Não preserva causa
catch (IOException e) {
    throw new Exception("Erro");
}

// ✅ Preservar causa
catch (IOException e) {
    throw new Exception("Erro", e);
}
```

### 3. Capturar Muito Genérico

```java
// ❌ Muito genérico
catch (Exception e) {
    // Captura tudo
}

// ✅ Específico
catch (FileNotFoundException e) { }
catch (IOException e) { }
```

---

## Boas Práticas

### 1. Tratar de Forma Apropriada

```java
// ✅ Recuperar, contextualizar ou logar
catch (FileNotFoundException e) {
    usarArquivoBackup();
}
catch (SQLException e) {
    logger.error("Erro BD", e);
    throw new RuntimeException("BD inacessível", e);
}
```

### 2. Usar try-with-resources

```java
// ✅ Liberar recursos automaticamente
try (FileReader reader = new FileReader("arquivo.txt")) {
    // ...
}
```

### 3. Documentar com @throws

```java
/**
 * @throws IOException Se erro ao ler
 */
public void ler() throws IOException { }
```

---

## Resumo

**Exception** = problemas **recuperáveis** da **aplicação**.

**Checked exceptions** (Exception - RuntimeException):
- **Compilador obriga** tratar ou declarar
- Situações **esperadas** (arquivo, rede, BD)
- **Fora do controle** da aplicação

**Principais**:
- **IOException**: I/O (arquivo, rede)
- **SQLException**: Banco de dados
- **ClassNotFoundException**: Classe não encontrada
- **ParseException**: Erro parsing
- **InterruptedException**: Thread interrompida

**Tratamento**:
- **Local**: try-catch
- **Propagar**: throws
- **Contextualizar**: capturar e relançar com contexto
- **Converter**: encapsular em unchecked se fatal
- **Recuperar**: fallback, retry, alternativa

**Recursos**:
- **try-with-resources**: libera automaticamente
- **finally**: sempre executa
- **Chaining**: preserva causa (`new Exception(msg, cause)`)

**Regra de Ouro**: Checked exceptions = situações **esperadas** e **externas**. **Sempre** tratar de forma apropriada (recuperar, logar, contextualizar). **Nunca** capturar e ignorar. Usar **try-with-resources** para recursos. **Preservar** causa em encadeamento.
