# T9.01 - printStackTrace()

## Introdução

**printStackTrace()**: imprime **stack trace** completo da exceção.

```java
/*
 * printStackTrace()
 * 
 * FUNÇÃO:
 *   - Imprime stack trace completo
 *   - Mostra sequência de chamadas
 *   - Indica linha do erro
 *   - Exibe causa raiz
 * 
 * VERSÕES:
 *   - printStackTrace()           → System.err
 *   - printStackTrace(PrintStream) → stream customizado
 *   - printStackTrace(PrintWriter) → writer customizado
 */

// ✅ printStackTrace() básico
public class Exemplo {
    public static void main(String[] args) {
        try {
            metodo1();
        } catch (Exception e) {
            e.printStackTrace();  // Imprime stack trace
        }
    }
    
    static void metodo1() {
        metodo2();
    }
    
    static void metodo2() {
        throw new RuntimeException("Erro!");
    }
}

/*
 * SAÍDA:
 * java.lang.RuntimeException: Erro!
 *     at Exemplo.metodo2(Exemplo.java:18)
 *     at Exemplo.metodo1(Exemplo.java:14)
 *     at Exemplo.main(Exemplo.java:6)
 */
```

**printStackTrace()**: imprime **stack trace** em System.err.

---

## Fundamentos

### 1. printStackTrace() Básico

```java
// ✅ printStackTrace() sem parâmetros
public class PrintStackTraceBasico {
    
    public static void main(String[] args) {
        try {
            dividir(10, 0);
            
        } catch (ArithmeticException e) {
            System.out.println("=== ANTES ===");
            e.printStackTrace();  // Imprime em System.err
            System.out.println("=== DEPOIS ===");
        }
    }
    
    static int dividir(int a, int b) {
        return a / b;  // Lança ArithmeticException se b == 0
    }
}

/*
 * SAÍDA:
 * === ANTES ===
 * java.lang.ArithmeticException: / by zero
 *     at PrintStackTraceBasico.dividir(PrintStackTraceBasico.java:15)
 *     at PrintStackTraceBasico.main(PrintStackTraceBasico.java:6)
 * === DEPOIS ===
 * 
 * DESTINO: System.err (vermelho no console)
 */
```

**Básico**: `printStackTrace()` → **System.err**.

### 2. printStackTrace(PrintStream)

```java
// ✅ printStackTrace(PrintStream) - redirecionar para stream
public class PrintStackTracePrintStream {
    
    public static void main(String[] args) {
        try {
            // Para arquivo
            try (PrintStream ps = new PrintStream("erro.log")) {
                dividir(10, 0);
            } catch (ArithmeticException e) {
                PrintStream ps = new PrintStream("erro.log");
                e.printStackTrace(ps);  // Imprime em arquivo
                ps.close();
            }
            
            // Para System.out (stdout)
            try {
                dividir(10, 0);
            } catch (ArithmeticException e) {
                e.printStackTrace(System.out);  // System.out em vez de System.err
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static int dividir(int a, int b) {
        return a / b;
    }
}

/*
 * printStackTrace(PrintStream):
 *   - Redirecionar para arquivo
 *   - Redirecionar para System.out
 *   - Redirecionar para ByteArrayOutputStream
 */
```

**PrintStream**: redirecionar para **arquivo** ou **stream** customizado.

### 3. printStackTrace(PrintWriter)

```java
// ✅ printStackTrace(PrintWriter) - redirecionar para writer
public class PrintStackTracePrintWriter {
    
    public static void main(String[] args) {
        try {
            // Para arquivo
            try (PrintWriter pw = new PrintWriter("erro.log")) {
                dividir(10, 0);
            } catch (ArithmeticException e) {
                PrintWriter pw = new PrintWriter("erro.log");
                e.printStackTrace(pw);  // Imprime em arquivo
                pw.close();
            }
            
            // Para StringWriter (capturar como String)
            try {
                dividir(10, 0);
            } catch (ArithmeticException e) {
                StringWriter sw = new StringWriter();
                PrintWriter pw = new PrintWriter(sw);
                e.printStackTrace(pw);
                
                String stackTrace = sw.toString();
                System.out.println("Stack trace capturado:");
                System.out.println(stackTrace);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static int dividir(int a, int b) {
        return a / b;
    }
}

/*
 * printStackTrace(PrintWriter):
 *   - Redirecionar para arquivo
 *   - Capturar como String (StringWriter)
 *   - Redirecionar para writer customizado
 */
```

**PrintWriter**: redirecionar para **arquivo** ou capturar como **String**.

### 4. Capturar Stack Trace como String

```java
// ✅ Capturar stack trace como String
public class CapturarStackTrace {
    
    // ✅ Método para capturar stack trace
    public static String getStackTraceAsString(Throwable t) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        t.printStackTrace(pw);
        return sw.toString();
    }
    
    public static void main(String[] args) {
        try {
            dividir(10, 0);
            
        } catch (ArithmeticException e) {
            // Capturar como String
            String stackTrace = getStackTraceAsString(e);
            
            // Usar String (logar, salvar, enviar, etc.)
            System.out.println("=== STACK TRACE ===");
            System.out.println(stackTrace);
            
            // Exemplo: logar
            // logger.error(stackTrace);
            
            // Exemplo: salvar em banco
            // salvarErro(stackTrace);
        }
    }
    
    static int dividir(int a, int b) {
        return a / b;
    }
}

/*
 * CAPTURAR COMO STRING:
 *   1. StringWriter sw = new StringWriter()
 *   2. PrintWriter pw = new PrintWriter(sw)
 *   3. e.printStackTrace(pw)
 *   4. sw.toString()
 */
```

**String**: StringWriter + PrintWriter + **toString()**.

### 5. Stack Trace com Causa

```java
// ✅ Stack trace com causa (chained exception)
public class StackTraceComCausa {
    
    public static void main(String[] args) {
        try {
            metodo1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void metodo1() throws Exception {
        try {
            metodo2();
        } catch (IOException e) {
            throw new Exception("Erro no método 1", e);
            //                                      ↑
            //                                   Causa
        }
    }
    
    static void metodo2() throws IOException {
        throw new IOException("Erro no método 2");
    }
}

/*
 * SAÍDA:
 * java.lang.Exception: Erro no método 1
 *     at StackTraceComCausa.metodo1(StackTraceComCausa.java:14)
 *     at StackTraceComCausa.main(StackTraceComCausa.java:6)
 * Caused by: java.io.IOException: Erro no método 2
 *     at StackTraceComCausa.metodo2(StackTraceComCausa.java:19)
 *     at StackTraceComCausa.metodo1(StackTraceComCausa.java:12)
 *     ... 1 more
 * 
 * "Caused by": mostra causa raiz
 * "... 1 more": frames comuns omitidos
 */
```

**Com causa**: mostra **"Caused by"** e causa raiz.

### 6. Stack Trace Multilinha

```java
// ✅ Stack trace com múltiplos níveis de causa
public class StackTraceMultinivel {
    
    public static void main(String[] args) {
        try {
            nivel1();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    static void nivel1() throws Exception {
        try {
            nivel2();
        } catch (Exception e) {
            throw new Exception("Nível 1", e);
        }
    }
    
    static void nivel2() throws Exception {
        try {
            nivel3();
        } catch (Exception e) {
            throw new Exception("Nível 2", e);
        }
    }
    
    static void nivel3() throws Exception {
        throw new IOException("Nível 3 - causa raiz");
    }
}

/*
 * SAÍDA:
 * java.lang.Exception: Nível 1
 *     at StackTraceMultinivel.nivel1(...)
 *     at StackTraceMultinivel.main(...)
 * Caused by: java.lang.Exception: Nível 2
 *     at StackTraceMultinivel.nivel2(...)
 *     at StackTraceMultinivel.nivel1(...)
 *     ... 1 more
 * Caused by: java.io.IOException: Nível 3 - causa raiz
 *     at StackTraceMultinivel.nivel3(...)
 *     at StackTraceMultinivel.nivel2(...)
 *     ... 2 more
 * 
 * Múltiplos "Caused by" mostram cadeia completa
 */
```

**Multinível**: múltiplos **"Caused by"** mostram cadeia.

### 7. Diferença System.out vs System.err

```java
// ✅ Demonstrar diferença System.out vs System.err
public class OutVsErr {
    
    public static void main(String[] args) {
        System.out.println("1. Mensagem em System.out");
        
        try {
            throw new RuntimeException("Erro!");
        } catch (RuntimeException e) {
            e.printStackTrace();  // System.err (padrão)
        }
        
        System.out.println("2. Mensagem em System.out");
        
        try {
            throw new RuntimeException("Erro!");
        } catch (RuntimeException e) {
            e.printStackTrace(System.out);  // System.out (forçado)
        }
        
        System.out.println("3. Mensagem em System.out");
    }
}

/*
 * System.err vs System.out:
 * 
 * System.err:
 *   - Stream de ERRO (stderr)
 *   - Vermelho no console (IDE)
 *   - NÃO bufferizado (flush automático)
 *   - Padrão de printStackTrace()
 * 
 * System.out:
 *   - Stream de SAÍDA (stdout)
 *   - Preto/branco no console
 *   - Bufferizado (flush manual)
 *   - Usar printStackTrace(System.out)
 */
```

**System.err**: vermelho, não bufferizado (**padrão**). **System.out**: branco, bufferizado.

### 8. Quando Usar printStackTrace()

```java
// ✅ Quando usar printStackTrace()
public class QuandoUsarPrintStackTrace {
    
    private static final Logger logger = Logger.getLogger("App");
    
    // ❌ NÃO usar em produção (System.err)
    public void metodo1() {
        try {
            operacao();
        } catch (Exception e) {
            e.printStackTrace();  // ❌ Produção: logar, não printStackTrace
        }
    }
    
    // ✅ Usar em desenvolvimento/debug
    public void metodo2() {
        try {
            operacao();
        } catch (Exception e) {
            e.printStackTrace();  // ✅ Debug: OK temporário
        }
    }
    
    // ✅ Produção: logar
    public void metodo3() {
        try {
            operacao();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Erro ao executar operação", e);
            // ✅ Logger captura stack trace automaticamente
        }
    }
    
    // ✅ Produção: capturar e salvar
    public void metodo4() {
        try {
            operacao();
        } catch (Exception e) {
            String stackTrace = getStackTraceAsString(e);
            salvarErro(stackTrace);  // Salvar em banco, arquivo, etc.
        }
    }
    
    private void operacao() throws Exception {
        throw new Exception("Erro!");
    }
    
    private void salvarErro(String stackTrace) {
        // Salvar em banco, arquivo, etc.
    }
    
    private String getStackTraceAsString(Throwable t) {
        StringWriter sw = new StringWriter();
        t.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }
}

/*
 * QUANDO USAR:
 * 
 * ✅ Desenvolvimento/debug
 * ✅ Testes (visualizar erros)
 * ✅ Scripts/utilitários
 * 
 * ❌ Produção (usar logger)
 * ❌ Aplicações web/servidor
 * ❌ Código biblioteca
 */
```

**Quando**: desenvolvimento/**debug**. **Produção**: usar **logger**.

### 9. Alternativas a printStackTrace()

```java
// ✅ Alternativas a printStackTrace()
public class AlternativasPrintStackTrace {
    
    private static final Logger logger = Logger.getLogger("App");
    
    // ✅ 1. Logger (RECOMENDADO produção)
    public void metodo1() {
        try {
            operacao();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Erro", e);
            // Logger captura stack trace automaticamente
        }
    }
    
    // ✅ 2. getMessage() (mensagem apenas)
    public void metodo2() {
        try {
            operacao();
        } catch (Exception e) {
            System.err.println("Erro: " + e.getMessage());
            // Sem stack trace, apenas mensagem
        }
    }
    
    // ✅ 3. toString() (tipo + mensagem)
    public void metodo3() {
        try {
            operacao();
        } catch (Exception e) {
            System.err.println(e.toString());
            // "java.lang.Exception: mensagem"
        }
    }
    
    // ✅ 4. getStackTrace() (array de StackTraceElement)
    public void metodo4() {
        try {
            operacao();
        } catch (Exception e) {
            StackTraceElement[] stack = e.getStackTrace();
            System.err.println("Primeiro elemento:");
            System.err.println("  Classe: " + stack[0].getClassName());
            System.err.println("  Método: " + stack[0].getMethodName());
            System.err.println("  Arquivo: " + stack[0].getFileName());
            System.err.println("  Linha: " + stack[0].getLineNumber());
        }
    }
    
    // ✅ 5. Capturar como String (custom format)
    public void metodo5() {
        try {
            operacao();
        } catch (Exception e) {
            String stackTrace = getStackTraceAsString(e);
            // Processar, formatar, enviar
        }
    }
    
    private void operacao() throws Exception {
        throw new Exception("Erro!");
    }
    
    private String getStackTraceAsString(Throwable t) {
        StringWriter sw = new StringWriter();
        t.printStackTrace(new PrintWriter(sw));
        return sw.toString();
    }
}

/*
 * ALTERNATIVAS:
 * 
 * 1. Logger.log(Level, msg, e)      → PRODUÇÃO
 * 2. getMessage()                    → Mensagem apenas
 * 3. toString()                      → Tipo + mensagem
 * 4. getStackTrace()                 → Array programático
 * 5. Capturar como String            → Custom format
 */
```

**Alternativas**: Logger (**produção**), getMessage(), toString(), **getStackTrace()**.

### 10. Resumo Visual

```java
/*
 * printStackTrace()
 * 
 * VERSÕES:
 * 
 * 1. printStackTrace()
 *    - Sem parâmetros
 *    - Destino: System.err
 *    - Uso: debug, desenvolvimento
 * 
 * 2. printStackTrace(PrintStream ps)
 *    - Parâmetro: PrintStream
 *    - Destino: stream customizado
 *    - Uso: arquivo, System.out
 * 
 * 3. printStackTrace(PrintWriter pw)
 *    - Parâmetro: PrintWriter
 *    - Destino: writer customizado
 *    - Uso: arquivo, StringWriter
 * 
 * 
 * EXEMPLO BÁSICO:
 * 
 * try {
 *     metodo();
 * } catch (Exception e) {
 *     e.printStackTrace();  // System.err
 * }
 * 
 * 
 * REDIRECIONAR ARQUIVO:
 * 
 * try {
 *     metodo();
 * } catch (Exception e) {
 *     PrintWriter pw = new PrintWriter("erro.log");
 *     e.printStackTrace(pw);
 *     pw.close();
 * }
 * 
 * 
 * CAPTURAR COMO STRING:
 * 
 * try {
 *     metodo();
 * } catch (Exception e) {
 *     StringWriter sw = new StringWriter();
 *     PrintWriter pw = new PrintWriter(sw);
 *     e.printStackTrace(pw);
 *     String stackTrace = sw.toString();
 * }
 * 
 * 
 * STACK TRACE COM CAUSA:
 * 
 * java.lang.Exception: Erro 1
 *     at Classe.metodo1(Classe.java:10)
 *     at Classe.main(Classe.java:5)
 * Caused by: java.io.IOException: Erro 2
 *     at Classe.metodo2(Classe.java:15)
 *     at Classe.metodo1(Classe.java:8)
 *     ... 1 more
 * 
 * 
 * QUANDO USAR:
 * 
 * ✅ Desenvolvimento/debug
 * ✅ Testes
 * ✅ Scripts
 * 
 * ❌ Produção (usar Logger)
 * ❌ Aplicações web
 * ❌ Bibliotecas
 * 
 * 
 * ALTERNATIVAS:
 * 
 * Logger.log(Level.SEVERE, "msg", e)  // PRODUÇÃO
 * e.getMessage()                       // Mensagem
 * e.toString()                         // Tipo + mensagem
 * e.getStackTrace()                    // Array
 */

public class ExemploPrintStackTrace {
    
    public static void main(String[] args) {
        try {
            metodo1();
        } catch (Exception e) {
            // ✅ Básico
            e.printStackTrace();
            
            // ✅ Arquivo
            try (PrintWriter pw = new PrintWriter("erro.log")) {
                e.printStackTrace(pw);
            } catch (Exception ex) { }
            
            // ✅ String
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            String stackTrace = sw.toString();
        }
    }
    
    static void metodo1() throws Exception {
        metodo2();
    }
    
    static void metodo2() throws Exception {
        throw new Exception("Erro!");
    }
}
```

---

## Aplicabilidade

**printStackTrace()**:
- Imprime stack trace em **System.err**
- Desenvolvimento/**debug**
- **Produção**: usar Logger

---

## Armadilhas

### 1. Usar em Produção

```java
// ❌ printStackTrace em produção
catch (Exception e) {
    e.printStackTrace();  // ❌ System.err não é log
}

// ✅ Logger em produção
catch (Exception e) {
    logger.log(Level.SEVERE, "Erro", e);  // ✅ Logger
}
```

### 2. Não Fechar Stream

```java
// ❌ Não fechar
PrintWriter pw = new PrintWriter("erro.log");
e.printStackTrace(pw);
// ❌ Não fechou

// ✅ Fechar
try (PrintWriter pw = new PrintWriter("erro.log")) {
    e.printStackTrace(pw);
}  // ✅ Auto-close
```

---

## Boas Práticas

### 1. Logger em Produção

```java
// ✅ Logger (não printStackTrace)
logger.log(Level.SEVERE, "Erro ao processar", e);
```

### 2. Try-with-Resources

```java
// ✅ Try-with-resources
try (PrintWriter pw = new PrintWriter("erro.log")) {
    e.printStackTrace(pw);
}
```

### 3. Capturar como String

```java
// ✅ Capturar para processar
StringWriter sw = new StringWriter();
e.printStackTrace(new PrintWriter(sw));
String stackTrace = sw.toString();
salvarErro(stackTrace);
```

---

## Resumo

**printStackTrace()**: imprime **stack trace** completo da exceção.

**Versões**:
1. `printStackTrace()` → System.err (padrão)
2. `printStackTrace(PrintStream)` → stream customizado
3. `printStackTrace(PrintWriter)` → writer customizado

**Destino**:
- **System.err**: vermelho, não bufferizado (padrão)
- **System.out**: branco, bufferizado (forçar)
- **Arquivo**: PrintStream ou PrintWriter
- **String**: StringWriter + PrintWriter + toString()

**Stack trace**:
- Exceção: tipo + mensagem
- Sequência: chamadas de métodos
- Localização: classe, método, arquivo, linha
- **Caused by**: causa raiz (chained exception)
- **... N more**: frames comuns omitidos

**Quando usar**:
- ✅ Desenvolvimento/**debug**
- ✅ Testes (visualizar)
- ✅ Scripts/utilitários
- ❌ **Produção** (usar Logger)
- ❌ Aplicações web/servidor
- ❌ Bibliotecas

**Alternativas**:
- `Logger.log(Level, msg, e)` → **PRODUÇÃO**
- `getMessage()` → mensagem apenas
- `toString()` → tipo + mensagem
- `getStackTrace()` → array StackTraceElement
- StringWriter → capturar como String

**Capturar String**:
```java
StringWriter sw = new StringWriter();
e.printStackTrace(new PrintWriter(sw));
String stackTrace = sw.toString();
```

**Regra de Ouro**: `printStackTrace()` para **desenvolvimento/debug** apenas. **Produção**: usar Logger.log(). Redirecionar para arquivo com try-with-resources. Capturar como String usando StringWriter + PrintWriter. Stack trace mostra sequência de chamadas, linha do erro, e causa raiz ("Caused by"). System.err vermelho não bufferizado (padrão), System.out branco bufferizado (forçar).

