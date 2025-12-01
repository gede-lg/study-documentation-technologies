# T10.02 - Não Capturar Exception ou Throwable Genérico

## Introdução

**Evitar genérico**: não capturar **Exception** ou **Throwable**.

```java
/*
 * EVITAR GENÉRICO
 * 
 * ❌ NÃO FAZER:
 * catch (Exception e) { }     // Captura TUDO
 * catch (Throwable t) { }     // Captura ATÉ Error
 * catch (RuntimeException e) { }  // Oculta bugs
 * 
 * ✅ FAZER:
 * catch (IOException e) { }         // Específica
 * catch (FileNotFoundException e) { }  // Específica
 */

// ❌ Exception genérica
public class ExemploRuim {
    public static void main(String[] args) {
        try {
            String s = null;
            s.length();  // NullPointerException (BUG!)
        } catch (Exception e) {  // ❌ Captura bug
            System.err.println("Erro");  // Bug oculto
        }
    }
}

// ✅ Específica ou deixar subir
public class ExemploBom {
    public static void main(String[] args) {
        // ✅ Deixar NullPointerException subir (bug deve aparecer)
        String s = obterString();
        if (s != null) {  // ✅ Validar
            s.length();
        }
    }
    
    static String obterString() { return null; }
}
```

**Regra**: **não** capturar Exception, Throwable, RuntimeException genéricos.

---

## Fundamentos

### 1. Problemas de Exception Genérica

```java
// ❌ Exception genérica: múltiplos problemas
public class ProblemasGenerico {
    
    // ❌ Problema 1: Captura bugs
    public static void problema1() {
        try {
            String s = null;
            s.length();  // NullPointerException (BUG!)
        } catch (Exception e) {  // ❌ Captura NPE
            System.err.println("Erro");  // Bug oculto
        }
    }
    
    // ❌ Problema 2: Não sabe o que tratar
    public static void problema2() {
        try {
            operacao();
        } catch (Exception e) {  // ❌ Qual exceção?
            System.err.println("Erro");  // Como tratar?
        }
    }
    
    // ❌ Problema 3: Captura exceções inesperadas
    public static void problema3() {
        try {
            metodo();
        } catch (Exception e) {  // ❌ Captura TUDO
            // Pode capturar exceções que não deveria tratar
        }
    }
    
    static void operacao() throws IOException {
        new FileReader("arquivo.txt");
    }
    
    static void metodo() {
        // Pode lançar várias exceções
    }
}

/*
 * PROBLEMAS Exception GENÉRICA:
 * 
 * 1. CAPTURA BUGS:
 *    - NullPointerException
 *    - IllegalArgumentException
 *    - ArrayIndexOutOfBoundsException
 *    → Bugs deveriam APARECER, não serem OCULTADOS
 * 
 * 2. NÃO SABE TRATAR:
 *    - Qual exceção ocorreu?
 *    - Como tratar apropriadamente?
 *    → Tratamento genérico inadequado
 * 
 * 3. CAPTURA INESPERADAS:
 *    - Exceções que não deveria tratar
 *    - Dificulta manutenção
 */
```

**Problemas**: captura **bugs**, não sabe **tratar**, captura **inesperadas**.

### 2. Throwable Ainda Pior

```java
// ❌ Throwable: MUITO pior que Exception
public class ThrowableAindaPior {
    
    // ❌ Captura até Error
    public static void capturarThrowable() {
        try {
            operacao();
        } catch (Throwable t) {  // ❌ NUNCA fazer
            System.err.println("Erro");
        }
    }
    
    static void operacao() {
        // Simular OutOfMemoryError
        // throw new OutOfMemoryError();
    }
}

/*
 * HIERARQUIA:
 * 
 * Throwable
 *   ├── Error (não deve ser capturado)
 *   │     ├── OutOfMemoryError
 *   │     ├── StackOverflowError
 *   │     └── VirtualMachineError
 *   └── Exception
 *         ├── RuntimeException
 *         └── IOException
 * 
 * catch (Throwable t):
 *   - Captura Exception ✗
 *   - Captura Error ✗✗ (GRAVE!)
 * 
 * Error:
 *   - Condições graves
 *   - JVM não pode se recuperar
 *   - NÃO deve ser capturado
 *   - Exemplos: OutOfMemoryError, StackOverflowError
 */
```

**Throwable**: captura até **Error** (grave, não recuperável).

### 3. RuntimeException Genérica

```java
// ❌ RuntimeException genérica oculta bugs
public class RuntimeExceptionGenerica {
    
    // ❌ Capturar RuntimeException genérica
    public static void problema1() {
        try {
            String s = null;
            s.length();  // NullPointerException
        } catch (RuntimeException e) {  // ❌ Oculta bug
            System.err.println("Erro");
        }
    }
    
    // ❌ Captura bugs de programação
    public static void problema2() {
        try {
            int[] array = {1, 2, 3};
            System.out.println(array[10]);  // ArrayIndexOutOfBoundsException
        } catch (RuntimeException e) {  // ❌ Bug deveria aparecer
            System.err.println("Erro");
        }
    }
    
    // ✅ Deixar bugs subirem
    public static void correto() {
        // ✅ Não capturar: bug deve aparecer no desenvolvimento
        String s = obterString();
        if (s != null) {  // ✅ Validar
            s.length();
        }
        
        int[] array = {1, 2, 3};
        int indice = obterIndice();
        if (indice < array.length) {  // ✅ Validar
            System.out.println(array[indice]);
        }
    }
    
    static String obterString() { return null; }
    static int obterIndice() { return 10; }
}

/*
 * RuntimeException GENÉRICA:
 * 
 * ❌ Oculta BUGS:
 *    - NullPointerException
 *    - IllegalArgumentException
 *    - ArrayIndexOutOfBoundsException
 * 
 * ✅ ALTERNATIVAS:
 *    1. VALIDAR (prevenir)
 *    2. Deixar SUBIR (bug aparece)
 *    3. Capturar ESPECÍFICA (se necessário)
 */
```

**RuntimeException**: oculta **bugs** de programação.

### 4. Quando Exception Genérica (Exceções)

```java
// ⚠️ Exception genérica: RARAMENTE aceitável
public class QuandoExceptionGenerica {
    
    // ⚠️ Aceitável: ponto de entrada (main, thread)
    public static void main(String[] args) {
        try {
            executar();
        } catch (Exception e) {  // ⚠️ OK: ponto entrada
            logger.log(Level.SEVERE, "Erro fatal", e);
            System.exit(1);
        }
    }
    
    // ⚠️ Aceitável: thread
    public void run() {
        try {
            processarTarefa();
        } catch (Exception e) {  // ⚠️ OK: thread não pode morrer
            logger.log(Level.SEVERE, "Erro thread", e);
            // Tentar continuar ou notificar
        }
    }
    
    // ⚠️ Aceitável: framework/lib (re-throw)
    public void framework() {
        try {
            plugin.executar();
        } catch (Exception e) {  // ⚠️ OK: não conhece exceções do plugin
            throw new FrameworkException("Erro plugin", e);  // Re-throw
        }
    }
    
    // ❌ NÃO aceitável: código normal
    public void codigoNormal() {
        try {
            processar();
        } catch (Exception e) {  // ❌ Código normal: ser específico
            System.err.println("Erro");
        }
    }
    
    static void executar() throws Exception { }
    void processarTarefa() throws Exception { }
    static void processar() throws IOException { }
    
    static class Plugin {
        void executar() throws Exception { }
    }
    static Plugin plugin = new Plugin();
    static Logger logger = Logger.getLogger("App");
}

/*
 * Exception GENÉRICA ACEITÁVEL (RARO):
 * 
 * 1. PONTO ENTRADA (main):
 *    - Última linha defesa
 *    - Logar e terminar
 * 
 * 2. THREAD:
 *    - Thread não pode morrer
 *    - Logar e tentar continuar
 * 
 * 3. FRAMEWORK/LIB:
 *    - Não conhece exceções do plugin
 *    - Capturar e re-throw com contexto
 * 
 * CÓDIGO NORMAL: SER ESPECÍFICO
 */
```

**Exceções raras**: main, thread, framework (com re-throw).

### 5. Alternativas a Exception Genérica

```java
// ✅ Alternativas a Exception genérica
public class AlternativasGenerico {
    
    // ✅ 1. Múltiplos catches específicos
    public static void alternativa1() {
        try {
            processar();
        } catch (FileNotFoundException e) {  // Específica
            criarArquivo();
        } catch (NumberFormatException e) {  // Específica
            usarPadrao();
        } catch (IOException e) {  // Específica
            logar(e);
        }
    }
    
    // ✅ 2. Multi-catch (mesmo tratamento)
    public static void alternativa2() {
        try {
            processar();
        } catch (FileNotFoundException | NumberFormatException e) {
            usarPadrao();  // Mesmo tratamento
        } catch (IOException e) {
            logar(e);
        }
    }
    
    // ✅ 3. Deixar subir (declarar throws)
    public static void alternativa3() throws IOException {
        processar();  // Deixar IOException subir
    }
    
    // ✅ 4. Validar (prevenir RuntimeException)
    public static void alternativa4() {
        String s = obterString();
        if (s != null) {  // Validar
            s.length();
        }
    }
    
    // ✅ 5. Encadear específica
    public static void alternativa5() throws ProcessamentoException {
        try {
            processar();
        } catch (IOException e) {  // Específica
            throw new ProcessamentoException("Erro processar", e);
        }
    }
    
    static void processar() throws IOException {
        new FileReader("arquivo.txt");
    }
    
    static void criarArquivo() { }
    static void usarPadrao() { }
    static void logar(Exception e) { }
    static String obterString() { return null; }
}

class ProcessamentoException extends Exception {
    public ProcessamentoException(String msg, Throwable causa) {
        super(msg, causa);
    }
}

/*
 * ALTERNATIVAS Exception GENÉRICA:
 * 
 * 1. MÚLTIPLOS CATCHES:
 *    catch (Tipo1 e) { }
 *    catch (Tipo2 e) { }
 * 
 * 2. MULTI-CATCH:
 *    catch (Tipo1 | Tipo2 e) { }
 * 
 * 3. DEIXAR SUBIR:
 *    throws IOException
 * 
 * 4. VALIDAR:
 *    if (s != null) { }
 * 
 * 5. ENCADEAR ESPECÍFICA:
 *    throw new MinhaException("msg", e)
 */
```

**Alternativas**: catches **específicos**, multi-catch, **throws**, **validar**, encadear.

### 6. Impacto no Debug

```java
// ❌ Exception genérica dificulta debug
public class ImpactoDebug {
    
    // ❌ Dificulta debug
    public static void dificultaDebug() {
        try {
            operacao1();
            operacao2();
            operacao3();
        } catch (Exception e) {  // ❌ Qual operação falhou?
            System.err.println("Erro");  // Mensagem genérica
            // Difícil saber ONDE e O QUE falhou
        }
    }
    
    // ✅ Facilita debug
    public static void facilitaDebug() {
        try {
            operacao1();
        } catch (IOException e) {  // ✅ Específica: sabe que operacao1 falhou
            System.err.println("Erro operacao1: " + e.getMessage());
        }
        
        try {
            operacao2();
        } catch (NumberFormatException e) {  // ✅ Específica: sabe que operacao2 falhou
            System.err.println("Erro operacao2: " + e.getMessage());
        }
        
        try {
            operacao3();
        } catch (SQLException e) {  // ✅ Específica: sabe que operacao3 falhou
            System.err.println("Erro operacao3: " + e.getMessage());
        }
    }
    
    static void operacao1() throws IOException { }
    static void operacao2() throws NumberFormatException { }
    static void operacao3() throws SQLException { }
}

/*
 * DEBUG:
 * 
 * ❌ Exception genérica:
 *    - Não sabe QUAL operação falhou
 *    - Mensagem genérica
 *    - Dificulta rastreamento
 * 
 * ✅ Específica:
 *    - Sabe QUAL operação falhou
 *    - Mensagem específica
 *    - Facilita rastreamento
 */
```

**Debug**: genérica **dificulta**, específica **facilita**.

### 7. Manutenção e Evolução

```java
// ❌ Exception genérica dificulta manutenção
public class ManutencaoEvolucao {
    
    // ❌ Dificulta adicionar nova exceção
    public static void versao1() {
        try {
            processar();
        } catch (Exception e) {  // ❌ Genérica
            System.err.println("Erro");
        }
    }
    
    // Evoluiu: processar agora lança SQLException também
    static void processar() throws IOException, SQLException {
        // ...
    }
    
    // ❌ SQLException capturada genericamente
    // Desenvolvedor não sabe que precisa tratar SQLException
    // Compilador não avisa
    
    // ✅ Facilita manutenção
    public static void versao2() {
        try {
            processar();
        } catch (IOException e) {  // ✅ Específica
            System.err.println("Erro I/O");
        } catch (SQLException e) {  // ✅ Compilador OBRIGA adicionar
            System.err.println("Erro SQL");
        }
    }
}

/*
 * MANUTENÇÃO:
 * 
 * ❌ Exception genérica:
 *    - Nova exceção: compilador NÃO avisa
 *    - Desenvolvedor pode NÃO saber
 *    - Tratamento inadequado
 * 
 * ✅ Específica:
 *    - Nova exceção: compilador AVISA
 *    - Desenvolvedor OBRIGADO adicionar catch
 *    - Tratamento apropriado
 */
```

**Manutenção**: específica **obriga** tratar novas exceções (compilador avisa).

### 8. Testes e Exception Genérica

```java
// ❌ Exception genérica dificulta testes
public class TestesExceptionGenerica {
    
    // ❌ Teste impreciso
    @Test
    public void testeGenerico() {
        try {
            metodo();
            fail("Deveria lançar exceção");
        } catch (Exception e) {  // ❌ Qualquer Exception
            // Passou, mas qual exceção?
        }
    }
    
    // ✅ Teste preciso
    @Test
    public void testeEspecifico() {
        assertThrows(IllegalArgumentException.class, () -> {
            metodo();
        });
        // ✅ Espera IllegalArgumentException ESPECÍFICA
    }
    
    // ✅ Teste com mensagem
    @Test
    public void testeComMensagem() {
        IllegalArgumentException e = assertThrows(
            IllegalArgumentException.class, 
            () -> metodo()
        );
        assertEquals("Argumento inválido", e.getMessage());
    }
    
    static void metodo() {
        throw new IllegalArgumentException("Argumento inválido");
    }
}

/*
 * TESTES:
 * 
 * ❌ Exception genérica:
 *    - Impreciso
 *    - Qualquer Exception passa
 * 
 * ✅ Específica:
 *    - Preciso
 *    - Apenas tipo correto passa
 *    - Verificar mensagem
 */
```

**Testes**: específica permite **verificação precisa**.

### 9. Logging e Exception Genérica

```java
// ❌ Exception genérica dificulta logging
public class LoggingExceptionGenerica {
    
    private static final Logger logger = Logger.getLogger("App");
    
    // ❌ Log genérico
    public static void logGenerico() {
        try {
            processar();
        } catch (Exception e) {  // ❌ Genérica
            logger.log(Level.SEVERE, "Erro", e);
            // Log: "Erro" (genérico)
        }
    }
    
    // ✅ Log específico
    public static void logEspecifico() {
        try {
            processar();
        } catch (FileNotFoundException e) {  // ✅ Específica
            logger.log(Level.WARNING, "Arquivo não encontrado", e);
            // Log: "Arquivo não encontrado" (específico)
        } catch (IOException e) {  // ✅ Específica
            logger.log(Level.SEVERE, "Erro I/O crítico", e);
            // Log: "Erro I/O crítico" (específico)
        }
    }
    
    static void processar() throws IOException {
        new FileReader("arquivo.txt");
    }
}

/*
 * LOGGING:
 * 
 * ❌ Exception genérica:
 *    - Mensagem genérica
 *    - Dificulta análise logs
 * 
 * ✅ Específica:
 *    - Mensagem específica
 *    - Facilita análise logs
 *    - Níveis apropriados (WARNING, SEVERE)
 */
```

**Logging**: específica permite **mensagens** e **níveis** apropriados.

### 10. Resumo Visual

```java
/*
 * NÃO CAPTURAR Exception/Throwable GENÉRICO
 * 
 * ❌ EVITAR:
 * 
 * catch (Exception e) { }          // Captura TUDO
 * catch (Throwable t) { }          // Captura até Error
 * catch (RuntimeException e) { }   // Oculta bugs
 * 
 * 
 * PROBLEMAS:
 * 
 * 1. CAPTURA BUGS:
 *    try {
 *        String s = null;
 *        s.length();  // NullPointerException
 *    } catch (Exception e) {  // ❌ Bug oculto
 *        System.err.println("Erro");
 *    }
 * 
 * 2. NÃO SABE TRATAR:
 *    catch (Exception e) {
 *        System.err.println("Erro");  // Como tratar?
 *    }
 * 
 * 3. CAPTURA INESPERADAS:
 *    - Exceções que não deveria tratar
 * 
 * 4. DIFICULTA DEBUG:
 *    - Não sabe qual operação falhou
 * 
 * 5. DIFICULTA MANUTENÇÃO:
 *    - Compilador não avisa novas exceções
 * 
 * 6. DIFICULTA TESTES:
 *    - Verificação imprecisa
 * 
 * 7. DIFICULTA LOGGING:
 *    - Mensagens genéricas
 * 
 * 
 * HIERARQUIA:
 * 
 * Throwable ❌ NUNCA capturar genérico
 *   ├── Error ❌ NÃO capturar
 *   │     ├── OutOfMemoryError
 *   │     └── StackOverflowError
 *   └── Exception ❌ EVITAR capturar genérico
 *         ├── RuntimeException ❌ EVITAR capturar genérico
 *         │     ├── NullPointerException ✅ Específica OK
 *         │     └── IllegalArgumentException ✅ Específica OK
 *         └── IOException ✅ Específica ✅
 *               └── FileNotFoundException ✅ Específica ✅
 * 
 * 
 * ✅ ALTERNATIVAS:
 * 
 * 1. ESPECÍFICAS:
 * catch (FileNotFoundException e) { }
 * catch (IOException e) { }
 * 
 * 2. MULTI-CATCH:
 * catch (FileNotFoundException | NumberFormatException e) { }
 * 
 * 3. DECLARAR throws:
 * public void metodo() throws IOException { }
 * 
 * 4. VALIDAR:
 * if (s != null) { s.length(); }
 * 
 * 5. ENCADEAR:
 * catch (IOException e) {
 *     throw new ProcessamentoException("msg", e);
 * }
 * 
 * 
 * QUANDO Exception GENÉRICA (RARO):
 * 
 * ⚠️ MAIN (ponto entrada):
 * public static void main(String[] args) {
 *     try {
 *         executar();
 *     } catch (Exception e) {  // ⚠️ OK: última defesa
 *         logger.log(Level.SEVERE, "Erro fatal", e);
 *         System.exit(1);
 *     }
 * }
 * 
 * ⚠️ THREAD:
 * public void run() {
 *     try {
 *         processar();
 *     } catch (Exception e) {  // ⚠️ OK: thread não pode morrer
 *         logger.log(Level.SEVERE, "Erro", e);
 *     }
 * }
 * 
 * ⚠️ FRAMEWORK (re-throw):
 * try {
 *     plugin.executar();
 * } catch (Exception e) {  // ⚠️ OK: não conhece exceções plugin
 *     throw new FrameworkException("Erro", e);
 * }
 * 
 * 
 * COMPARAÇÃO:
 * 
 * ❌ GENÉRICA:
 * try {
 *     processar();
 * } catch (Exception e) {
 *     System.err.println("Erro");  // Qual erro?
 * }
 * 
 * Problemas:
 *   - Captura bugs
 *   - Não sabe tratar
 *   - Dificulta debug
 * 
 * ✅ ESPECÍFICA:
 * try {
 *     processar();
 * } catch (FileNotFoundException e) {
 *     System.err.println("Arquivo não encontrado");
 *     criarArquivo();
 * } catch (IOException e) {
 *     System.err.println("Erro I/O");
 *     logar(e);
 * }
 * 
 * Vantagens:
 *   - Sabe exatamente o erro
 *   - Tratamento apropriado
 *   - Facilita debug
 */

public class ExemploEvitarGenerico {
    
    private static final Logger logger = Logger.getLogger("App");
    
    // ❌ ERRADO: Exception genérica
    public static void exemploErrado() {
        try {
            processar("arquivo.txt");
        } catch (Exception e) {  // ❌ Genérica
            System.err.println("Erro");  // Qual erro? Como tratar?
        }
    }
    
    // ✅ CORRETO: Específicas
    public static void exemploCorreto() {
        try {
            processar("arquivo.txt");
        } catch (FileNotFoundException e) {  // ✅ Específica
            logger.log(Level.WARNING, "Arquivo não encontrado", e);
            criarArquivoPadrao();
        } catch (NumberFormatException e) {  // ✅ Específica
            logger.log(Level.WARNING, "Formato inválido", e);
            usarValorPadrao();
        } catch (IOException e) {  // ✅ Específica
            logger.log(Level.SEVERE, "Erro I/O crítico", e);
        }
    }
    
    static void processar(String arquivo) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(arquivo));
        String linha = br.readLine();
        int valor = Integer.parseInt(linha);
        System.out.println("Valor: " + valor);
        br.close();
    }
    
    static void criarArquivoPadrao() { }
    static void usarValorPadrao() { }
}
```

---

## Aplicabilidade

**Evitar genérico**:
- **Não** capturar Exception, Throwable, RuntimeException
- Usar catches **específicos**
- Exceções: main, thread, framework

---

## Armadilhas

### 1. Capturar Exception

```java
// ❌ Exception genérica
catch (Exception e) { }  // ❌ Captura tudo

// ✅ Específica
catch (IOException e) { }  // ✅ Sabe o que é
```

### 2. Capturar Throwable

```java
// ❌ Throwable (captura Error)
catch (Throwable t) { }  // ❌ Até Error

// ✅ Específica
catch (Exception e) { }  // ✅ Não captura Error
```

### 3. Ocultar Bugs

```java
// ❌ Oculta NullPointerException
catch (RuntimeException e) { }  // ❌ Bug oculto

// ✅ Deixar subir ou validar
if (s != null) { s.length(); }  // ✅ Validar
```

---

## Boas Práticas

### 1. Sempre Específica

```java
// ✅ Capturar específica
catch (FileNotFoundException e) { }
```

### 2. Múltiplos Catches

```java
// ✅ Cada tipo específico
catch (FileNotFoundException e) { }
catch (NumberFormatException e) { }
```

### 3. Validar RuntimeException

```java
// ✅ Prevenir com validação
if (s != null) { s.length(); }
```

---

## Resumo

**Evitar genérico**: **não** capturar Exception, Throwable, RuntimeException genéricos.

**Problemas**:
1. **Captura bugs** (NullPointerException, IllegalArgumentException)
2. **Não sabe tratar** (qual erro? como?)
3. **Captura inesperadas** (exceções que não deveria)
4. **Dificulta debug** (não sabe onde falhou)
5. **Dificulta manutenção** (compilador não avisa novas)
6. **Dificulta testes** (verificação imprecisa)
7. **Dificulta logging** (mensagens genéricas)

**Throwable**:
- Captura até **Error** (OutOfMemoryError, StackOverflowError)
- Error: condições **graves**, JVM não recupera
- **NUNCA** capturar Throwable genérico

**RuntimeException**:
- Oculta **bugs** de programação
- **Prevenir** com validação
- Deixar **subir** no desenvolvimento
- Capturar **específica** se necessário

**Alternativas**:
1. **Específicas**: `catch (FileNotFoundException e)`
2. **Multi-catch**: `catch (Tipo1 | Tipo2 e)`
3. **throws**: `public void metodo() throws IOException`
4. **Validar**: `if (s != null) { s.length(); }`
5. **Encadear**: `throw new MinhaException("msg", e)`

**Exceções raras** (Exception genérica aceitável):
- **main**: última linha defesa (logar e terminar)
- **Thread**: thread não pode morrer (logar e continuar)
- **Framework**: não conhece exceções plugin (re-throw com contexto)

**Debug e manutenção**:
- **Específica**: sabe ONDE e O QUE falhou
- **Genérica**: mensagem vaga, dificulta rastreamento
- **Compilador**: avisa novas exceções com específicas

**Regra de Ouro**: **NUNCA** capturar Exception, Throwable, RuntimeException genéricos em código normal. Usar catches **específicos** ou multi-catch. Validar ao invés de capturar RuntimeException. Exceções: main (última defesa), thread (não pode morrer), framework (re-throw). Bugs devem **aparecer**, não serem **ocultados**.

