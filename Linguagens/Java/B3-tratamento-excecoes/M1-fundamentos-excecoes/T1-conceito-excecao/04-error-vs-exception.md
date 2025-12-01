# T1.04 - Error vs Exception: Diferenças Detalhadas

## Introdução

**Error** = problema **grave** do sistema (JVM).  
**Exception** = problema **recuperável** da aplicação.

```java
// ❌ ERROR: JVM quebrou (NÃO tratar)
public static void causarError() {
    causarError();  // Recursão infinita
}  // StackOverflowError - sistema comprometido

// ✅ EXCEPTION: aplicação encontrou problema (TRATAR)
public static void causarException() {
    throw new IllegalArgumentException("Argumento inválido");
}  // IllegalArgumentException - pode tratar e continuar
```

**Error** → encerrar programa.  
**Exception** → tratar e continuar.

---

## Fundamentos

### 1. Comparação Lado a Lado

```java
// ✅ Error vs Exception: diferenças principais
public class ErrorVsException {
    
    // ERROR: OutOfMemoryError
    public static void exemploError() {
        List<byte[]> lista = new ArrayList<>();
        while (true) {
            lista.add(new byte[1024 * 1024 * 10]);  // 10 MB
        }
        // ❌ OutOfMemoryError: JVM sem memória
        // Sistema comprometido
        // Programa DEVE encerrar
    }
    
    // EXCEPTION: IllegalArgumentException
    public static void exemploException(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade inválida: " + idade);
        }
        // ✅ Problema da aplicação
        // Pode ser tratado
        // Programa pode continuar
    }
    
    public static void main(String[] args) {
        // ✅ EXCEPTION: tratar
        try {
            exemploException(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro tratado: " + e.getMessage());
            System.out.println("Usando valor padrão: 0");
            exemploException(0);  // Tenta novamente
        }
        
        // ❌ ERROR: NÃO tratar (descomentar quebra programa)
        // exemploError();  // OutOfMemoryError -> CRASH
    }
}
```

| **Aspecto** | **Error** | **Exception** |
|------------|-----------|---------------|
| **Origem** | Sistema/JVM | Aplicação |
| **Gravidade** | GRAVE (irrecuperável) | Recuperável |
| **Tratamento** | NÃO tratar | DEVE tratar |
| **Continuidade** | Programa encerra | Programa continua |
| **Causa** | Problema de recursos/JVM | Lógica/dados inválidos |
| **Exemplos** | OutOfMemoryError, StackOverflowError | IOException, SQLException |

### 2. Exemplos de Error

```java
// ❌ ERRORS: problemas graves do sistema
public class ExemplosError {
    
    // 1. STACK OVERFLOW ERROR
    public static void recursaoInfinita() {
        recursaoInfinita();
    }
    // Pilha de chamadas cheia → StackOverflowError
    
    // 2. OUT OF MEMORY ERROR
    public static void semMemoria() {
        int[] arr = new int[Integer.MAX_VALUE];
    }
    // JVM sem memória → OutOfMemoryError
    
    // 3. VIRTUAL MACHINE ERROR
    // Erro interno da JVM (muito raro)
    
    // 4. NO CLASS DEF FOUND ERROR
    // Classe não encontrada em runtime (problema de classpath)
    
    // 5. LINKAGE ERROR
    // Problema ao carregar classes dependentes
    
    // 6. ASSERTION ERROR
    public static void validarComAssertion() {
        assert false : "Falha";  // Precisa -ea
    }
    // Assertion falhou → AssertionError
    
    public static void main(String[] args) {
        System.out.println("=== Tipos de Error ===");
        System.out.println("StackOverflowError: pilha de chamadas cheia");
        System.out.println("OutOfMemoryError: JVM sem memória");
        System.out.println("VirtualMachineError: JVM quebrou");
        System.out.println("NoClassDefFoundError: classe não encontrada");
        System.out.println("AssertionError: assertion falhou");
        
        // ⚠️ NÃO executar (quebram programa)
        // recursaoInfinita();
        // semMemoria();
    }
}
```

**Errors** indicam problemas **graves** que aplicação **não controla**.

### 3. Exemplos de Exception

```java
// ✅ EXCEPTIONS: problemas recuperáveis da aplicação
public class ExemplosException {
    
    // 1. ARQUIVO NÃO ENCONTRADO
    public static void lerArquivo(String caminho) throws IOException {
        FileReader reader = new FileReader(caminho);
        // FileNotFoundException se arquivo não existir
        reader.close();
    }
    
    // 2. NULL POINTER
    public static int tamanho(String texto) {
        if (texto == null) {
            throw new NullPointerException("Texto é null");
        }
        return texto.length();
    }
    
    // 3. DIVISÃO POR ZERO
    public static int dividir(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Divisor é zero");
        }
        return a / b;
    }
    
    // 4. ÍNDICE INVÁLIDO
    public static int obter(int[] arr, int indice) {
        if (indice < 0 || indice >= arr.length) {
            throw new ArrayIndexOutOfBoundsException("Índice: " + indice);
        }
        return arr[indice];
    }
    
    // 5. CONVERSÃO INVÁLIDA
    public static int converter(String texto) {
        return Integer.parseInt(texto);
        // NumberFormatException se não for número
    }
    
    // 6. CAST INVÁLIDO
    public static Integer cast(Object obj) {
        return (Integer) obj;
        // ClassCastException se não for Integer
    }
    
    public static void main(String[] args) {
        // ✅ TODAS podem ser tratadas
        try {
            lerArquivo("arquivo.txt");
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado, usando padrão");
        }
        
        try {
            int x = dividir(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Divisão por zero, retornando 0");
        }
        
        try {
            int num = converter("abc");
        } catch (NumberFormatException e) {
            System.out.println("Texto inválido, usando 0");
        }
    }
}
```

**Exceptions** indicam problemas **recuperáveis** que aplicação **deve tratar**.

### 4. Por Que NÃO Tratar Error?

```java
// ⚠️ Por que NÃO capturar Error?
public class PorQueNaoCapturarError {
    
    // ❌ EXEMPLO 1: OutOfMemoryError
    public static void tentarCapturarOOM() {
        try {
            List<int[]> lista = new ArrayList<>();
            while (true) {
                lista.add(new int[1000000]);
            }
        } catch (OutOfMemoryError e) {
            // ⚠️ Capturou, mas JVM está SEM MEMÓRIA
            System.out.println("Sem memória!");
            
            // ❌ Tentar continuar pode PIORAR
            String texto = "teste";  // Pode falhar
            List<Integer> nova = new ArrayList<>();  // Pode falhar
            
            // JVM está em estado INCONSISTENTE
            // Outros objetos podem não funcionar
            // Garbage Collector pode não conseguir liberar memória
        }
    }
    
    // ❌ EXEMPLO 2: StackOverflowError
    public static void tentarCapturarStackOverflow() {
        try {
            recursao();
        } catch (StackOverflowError e) {
            // ⚠️ Capturou, mas pilha está CHEIA
            System.out.println("Stack overflow!");
            
            // ❌ Chamar qualquer método pode FALHAR
            processar();  // Pode causar NOVO StackOverflowError
        }
    }
    
    private static void recursao() {
        recursao();
    }
    
    private static void processar() {
        // Qualquer chamada de método usa pilha
    }
    
    // ✅ O CORRETO: deixar Error propagar
    public static void deixarPropagar() {
        // Não captura Error
        // JVM encerra de forma controlada
        // Recursos são liberados
        List<int[]> lista = new ArrayList<>();
        while (true) {
            lista.add(new int[1000000]);
        }
        // OutOfMemoryError → programa encerra
    }
    
    // ✅ Se REALMENTE precisar capturar (raro)
    public static void capturarParaLogar() {
        try {
            operacaoCritica();
        } catch (OutOfMemoryError e) {
            // Logar erro crítico
            System.err.println("ERRO CRÍTICO: Sem memória!");
            e.printStackTrace();
            
            // Liberar recursos se possível
            liberarRecursos();
            
            // ENCERRAR programa
            System.exit(1);
        }
    }
    
    private static void operacaoCritica() {
        // Operação que pode esgotar memória
    }
    
    private static void liberarRecursos() {
        // Tentar liberar recursos antes de encerrar
    }
}
```

**Error** = JVM comprometida. Capturar **não resolve**. Melhor **encerrar**.

### 5. Quando Tratar Exception

```java
// ✅ Quando e como tratar Exception
public class QuandoTratarException {
    
    // ✅ TRATAR quando puder RECUPERAR
    public static void tratarRecuperavel() {
        try {
            FileReader reader = new FileReader("config.txt");
            reader.close();
        } catch (FileNotFoundException e) {
            // ✅ Pode recuperar: usar configuração padrão
            System.out.println("Config não encontrado, usando padrão");
            usarConfigPadrao();
        } catch (IOException e) {
            System.out.println("Erro ao fechar arquivo");
        }
    }
    
    // ✅ TRATAR para fornecer CONTEXTO
    public static void tratarParaContexto() throws Exception {
        try {
            processarDados();
        } catch (IOException e) {
            // Adiciona contexto e relança
            throw new Exception("Erro ao processar dados do cliente", e);
        }
    }
    
    // ✅ TRATAR para LIBERAR recursos
    public static void tratarParaLiberar() {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection("jdbc:...");
            // Usar conexão
        } catch (SQLException e) {
            System.out.println("Erro de banco: " + e.getMessage());
        } finally {
            // ✅ Sempre liberar recurso
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
    
    // ✅ TRATAR para LOGAR
    public static void tratarParaLogar() {
        try {
            operacaoPerigosa();
        } catch (Exception e) {
            // Logar exceção
            logger.error("Erro na operação", e);
            // Relançar ou retornar valor padrão
            throw new RuntimeException("Falha na operação", e);
        }
    }
    
    // ❌ NÃO TRATAR se não puder fazer nada útil
    public static void naoTratarInutil() {
        try {
            processarDados();
        } catch (IOException e) {
            // ❌ Captura e não faz NADA
            // Melhor deixar propagar
        }
    }
    
    private static void usarConfigPadrao() { }
    private static void processarDados() throws IOException { }
    private static void operacaoPerigosa() throws Exception { }
    private static Logger logger = Logger.getLogger("app");
}
```

**Tratar** quando puder: **recuperar**, adicionar **contexto**, **liberar** recursos, **logar**.

### 6. Error e Exception na Prática

```java
// ✅ Comparação prática
public class ComparacaoPratica {
    
    // ❌ ERROR: sistema quebrou
    public static void sistemaQuebrado() {
        // StackOverflowError
        sistemaQuebrado();  // Recursão infinita
        
        // ⚠️ O que acontece:
        // 1. Pilha de chamadas esgota
        // 2. JVM não consegue criar novo frame
        // 3. StackOverflowError lançado
        // 4. Programa encerra
        // 5. NÃO há como recuperar
    }
    
    // ✅ EXCEPTION: problema na aplicação
    public static void problemaAplicacao(int valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("Valor negativo: " + valor);
        }
        
        // ✅ O que acontece:
        // 1. Validação falha
        // 2. IllegalArgumentException lançado
        // 3. Pode ser capturado
        // 4. Programa pode continuar
        // 5. Pode usar valor padrão
    }
    
    public static void main(String[] args) {
        // ❌ ERROR: quebra programa
        // sistemaQuebrado();  // CRASH
        
        // ✅ EXCEPTION: trata e continua
        try {
            problemaAplicacao(-5);
        } catch (IllegalArgumentException e) {
            System.out.println("Erro: " + e.getMessage());
            System.out.println("Usando valor padrão: 0");
            problemaAplicacao(0);  // ✅ Continua
        }
        
        System.out.println("Programa continua normalmente");
    }
}
```

**Error** quebra programa. **Exception** pode ser tratada.

### 7. Tabela Completa: Error vs Exception

```java
/*
 * COMPARAÇÃO DETALHADA
 * 
 * ┌─────────────────┬──────────────────────┬──────────────────────┐
 * │    ASPECTO      │        ERROR         │      EXCEPTION       │
 * ├─────────────────┼──────────────────────┼──────────────────────┤
 * │ Origem          │ Sistema/JVM          │ Aplicação            │
 * │ Gravidade       │ GRAVE                │ Recuperável          │
 * │ Tratamento      │ NÃO tratar           │ DEVE tratar          │
 * │ Continuidade    │ Programa encerra     │ Programa continua    │
 * │ Causa           │ Recursos esgotados   │ Dados/lógica inválida│
 * │ Previsível      │ NÃO                  │ SIM                  │
 * │ Controlável     │ NÃO                  │ SIM                  │
 * │ Recuperável     │ NÃO                  │ SIM                  │
 * │ Estado JVM      │ Comprometido         │ Normal               │
 * │ Ação            │ Encerrar             │ Tratar/Continuar     │
 * ├─────────────────┼──────────────────────┼──────────────────────┤
 * │ Exemplos        │ OutOfMemoryError     │ IOException          │
 * │                 │ StackOverflowError   │ SQLException         │
 * │                 │ VirtualMachineError  │ NullPointerException │
 * │                 │ NoClassDefFoundError │ ArithmeticException  │
 * │                 │ AssertionError       │ IllegalArgument      │
 * └─────────────────┴──────────────────────┴──────────────────────┘
 */
```

### 8. Quando Error Pode Ser Capturado

```java
// ⚠️ Raros casos onde capturar Error pode fazer sentido
public class RarosError {
    
    // ✅ CASO 1: AssertionError (testes)
    public static void tratarAssertion() {
        try {
            validarComAssert(false);
        } catch (AssertionError e) {
            // ✅ OK em testes
            System.out.println("Assertion falhou: " + e.getMessage());
        }
    }
    
    private static void validarComAssert(boolean condicao) {
        assert condicao : "Condição falsa";
    }
    
    // ✅ CASO 2: Logar Error antes de encerrar
    public static void logarErrorCritico() {
        try {
            operacaoQuePodeEstourarMemoria();
        } catch (OutOfMemoryError e) {
            // Logar erro crítico
            System.err.println("ERRO CRÍTICO: Sem memória!");
            e.printStackTrace();
            
            // Notificar administradores
            notificarAdmin("Aplicação sem memória");
            
            // ENCERRAR programa
            System.exit(1);
        }
    }
    
    // ✅ CASO 3: Frameworks/Servidores (controlar isolamento)
    public static void isolamentoServidor() {
        // Servidores web podem capturar Error de uma request
        // para não derrubar servidor inteiro
        try {
            processarRequest();
        } catch (Error e) {
            // Logar
            System.err.println("Error na request: " + e);
            // Responder erro 500
            enviarErro500();
            // Request falha, mas servidor continua
        }
    }
    
    private static void operacaoQuePodeEstourarMemoria() { }
    private static void notificarAdmin(String msg) { }
    private static void processarRequest() { }
    private static void enviarErro500() { }
}
```

**Capturar Error** só em casos **muito específicos** (testes, logging crítico, servidores).

### 9. Hierarquia Completa

```java
/*
 * HIERARQUIA COMPLETA
 * 
 *                    Throwable
 *                        |
 *           ┌────────────┴────────────┐
 *           |                         |
 *         Error                   Exception
 *           |                         |
 *     ┌─────┴─────┐          ┌────────┴────────┐
 *     |           |          |                 |
 * OutOfMemory  StackOver  Runtime         (Checked)
 *   Error      flowError  Exception       IOException
 *                           |             SQLException
 *                     ┌─────┴─────┐      ParseException
 *                     |           |      ...
 *                  NullPtr    Arithmetic
 *                  Exception  Exception
 *                  ...        ...
 * 
 * Error:
 *   - OutOfMemoryError
 *   - StackOverflowError
 *   - VirtualMachineError
 *   - NoClassDefFoundError
 *   - AssertionError
 * 
 * RuntimeException (unchecked):
 *   - NullPointerException
 *   - ArithmeticException
 *   - IndexOutOfBoundsException
 *   - IllegalArgumentException
 *   - ClassCastException
 * 
 * Checked Exception:
 *   - IOException
 *   - SQLException
 *   - ClassNotFoundException
 *   - ParseException
 *   - InterruptedException
 */
```

### 10. Decisão: Tratar ou Não?

```java
// ✅ Fluxograma de decisão
public class DecisaoTratamento {
    
    /*
     * DECISÃO: Capturar ou não?
     * 
     * É um Error?
     *   └─ SIM → NÃO capturar (deixar propagar)
     *   └─ NÃO → É Exception?
     *       └─ SIM → Posso recuperar?
     *           ├─ SIM → Capturar e tratar
     *           └─ NÃO → Posso adicionar contexto?
     *               ├─ SIM → Capturar, logar e relançar
     *               └─ NÃO → Deixar propagar (declarar throws)
     */
    
    // ❌ Error: NÃO capturar
    public static void naoCapturarError() {
        // Deixa propagar
        causarStackOverflow();
    }
    
    // ✅ Exception recuperável: capturar
    public static void capturarRecuperavel() {
        try {
            lerConfig();
        } catch (IOException e) {
            // Pode recuperar: usa padrão
            usarConfigPadrao();
        }
    }
    
    // ✅ Exception com contexto: capturar, logar e relançar
    public static void capturarComContexto() throws Exception {
        try {
            processarCliente();
        } catch (SQLException e) {
            // Adiciona contexto
            logger.error("Erro ao processar cliente", e);
            throw new Exception("Falha no processamento", e);
        }
    }
    
    // ✅ Exception não recuperável: declarar throws
    public static void declararThrows() throws IOException {
        // Não trata, apenas declara
        lerArquivo();
    }
    
    private static void causarStackOverflow() {
        causarStackOverflow();
    }
    private static void lerConfig() throws IOException { }
    private static void usarConfigPadrao() { }
    private static void processarCliente() throws SQLException { }
    private static void lerArquivo() throws IOException { }
    private static Logger logger = Logger.getLogger("app");
}
```

**Decisão**: Error → **não** capturar. Exception → capturar se puder **recuperar** ou adicionar **contexto**.

---

## Aplicabilidade

**Error**:
- Problemas **graves** do sistema
- JVM **comprometida**
- **NÃO** tratar (deixar encerrar)
- Exemplos: sem memória, pilha cheia

**Exception**:
- Problemas **recuperáveis**
- Aplicação pode **continuar**
- **DEVE** tratar
- Exemplos: arquivo não encontrado, dados inválidos

---

## Armadilhas

### 1. Capturar Error

```java
// ❌ Capturar Error
try {
    causarError();
} catch (OutOfMemoryError e) {
    // JVM comprometida
}

// ✅ Deixar propagar
causarError();  // Error → encerra
```

### 2. Não Tratar Exception

```java
// ❌ Ignorar Exception
try {
    lerArquivo();
} catch (IOException e) {
    // Não faz nada
}

// ✅ Tratar ou relançar
try {
    lerArquivo();
} catch (IOException e) {
    logger.error("Erro", e);
    throw new RuntimeException(e);
}
```

### 3. Capturar Throwable

```java
// ❌ Captura Error também
catch (Throwable t) { }

// ✅ Capturar Exception
catch (Exception e) { }
```

---

## Boas Práticas

### 1. Nunca Capturar Error

```java
// ❌ Não capturar Error
// JVM pode estar comprometida

// ✅ Deixar Error propagar
```

### 2. Sempre Tratar Exception

```java
// ✅ Tratar ou declarar
try {
    operacao();
} catch (IOException e) {
    // Tratar
}

// Ou declarar
public void metodo() throws IOException {
    operacao();
}
```

### 3. Logar Exceções

```java
// ✅ Sempre logar
catch (Exception e) {
    logger.error("Erro ao processar", e);
}
```

---

## Resumo

**Error** vs **Exception**:

**Error**:
- **Sistema/JVM** comprometido
- **GRAVE** (irrecuperável)
- **NÃO** tratar
- Programa **encerra**
- Exemplos: `OutOfMemoryError`, `StackOverflowError`

**Exception**:
- **Aplicação** encontrou problema
- **Recuperável**
- **DEVE** tratar
- Programa **continua**
- Exemplos: `IOException`, `SQLException`, `NullPointerException`

**Decisão**:
- Error → **NÃO** capturar
- Exception → **capturar** se puder recuperar ou adicionar contexto
- **Logar** sempre que capturar

**Regra de Ouro**: **Error** = sistema quebrou, **deixe encerrar**. **Exception** = problema recuperável, **trate**. **NUNCA** capturar `Error` (JVM comprometida). **SEMPRE** tratar ou declarar `Exception`. **Logar** exceções para debugging.
