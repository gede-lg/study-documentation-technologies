# T1.02 - Diferença Entre Erro e Exceção

## Introdução

**Java** diferencia **Error** (problema grave do sistema) de **Exception** (problema recuperável).

```java
// ❌ ERROR: problema GRAVE do sistema (não tratar)
public static void causarStackOverflow() {
    causarStackOverflow();  // Recursão infinita
}  // StackOverflowError - sistema quebra

// ✅ EXCEPTION: problema RECUPERÁVEL (tratar)
public static void dividir(int a, int b) {
    if (b == 0) {
        throw new ArithmeticException("Divisor zero");
    }
    System.out.println(a / b);
}  // ArithmeticException - pode tratar
```

**Error** = sistema quebrou, **não recupera**.  
**Exception** = problema na aplicação, **pode tratar**.

---

## Fundamentos

### 1. Hierarquia: Throwable

```java
/*
 * Hierarquia de exceções Java:
 * 
 *              Throwable (raiz)
 *                   |
 *        ┌──────────┴──────────┐
 *        |                     |
 *      Error              Exception
 *        |                     |
 *   (Erros graves)      ┌──────┴──────┐
 *   - OutOfMemoryError  |             |
 *   - StackOverflowError RuntimeException  (Outras)
 *   - VirtualMachineError   |               |
 *                     (Unchecked)      (Checked)
 *                     - NullPointer    - IOException
 *                     - ArithmeticException - SQLException
 */

// ✅ Throwable é a raiz
public class HierarquiaExcecao {
    public static void main(String[] args) {
        // Tudo que pode ser lançado é Throwable
        try {
            throw new Exception("Exceção");
        } catch (Throwable t) {  // Captura TUDO
            System.out.println("Capturou: " + t.getClass().getName());
        }
        
        try {
            throw new Error("Erro");
        } catch (Throwable t) {  // Captura TUDO
            System.out.println("Capturou: " + t.getClass().getName());
        }
    }
}
```

**Throwable** = raiz de **tudo** que pode ser lançado/capturado.

### 2. Error: Problemas Graves do Sistema

```java
// ❌ ERROR: problemas que aplicação NÃO DEVE tratar
public class ExemplosError {
    
    // 1. STACK OVERFLOW ERROR
    public static void recursaoInfinita() {
        recursaoInfinita();  // Chama a si mesmo infinitamente
    }
    // Pilha de chamadas estoura: StackOverflowError
    
    // 2. OUT OF MEMORY ERROR
    public static void consumirMemoria() {
        List<byte[]> lista = new ArrayList<>();
        while (true) {
            lista.add(new byte[1024 * 1024]);  // 1 MB por vez
        }
    }
    // Memória esgota: OutOfMemoryError
    
    // 3. VIRTUAL MACHINE ERROR
    // JVM quebra completamente
    
    public static void main(String[] args) {
        // ⚠️ NÃO é recomendado capturar Error
        try {
            recursaoInfinita();
        } catch (StackOverflowError e) {
            // Mesmo capturando, JVM pode estar comprometida
            System.out.println("Stack overflow!");
        }
    }
}
```

**Error** = problema **grave** do **sistema** (JVM). **NÃO** deve ser tratado pela aplicação.

### 3. Exception: Problemas Recuperáveis

```java
// ✅ EXCEPTION: problemas que aplicação PODE e DEVE tratar
public class ExemplosException {
    
    // 1. ARQUIVO NÃO ENCONTRADO
    public static void lerArquivo(String caminho) throws IOException {
        FileReader reader = new FileReader(caminho);  // FileNotFoundException
        reader.close();
    }
    
    // 2. DIVISÃO POR ZERO
    public static int dividir(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Divisor é zero");
        }
        return a / b;
    }
    
    // 3. NULL POINTER
    public static int tamanho(String texto) {
        if (texto == null) {
            throw new NullPointerException("Texto é null");
        }
        return texto.length();
    }
    
    // 4. ÍNDICE INVÁLIDO
    public static int obterElemento(int[] arr, int indice) {
        if (indice < 0 || indice >= arr.length) {
            throw new ArrayIndexOutOfBoundsException("Índice: " + indice);
        }
        return arr[indice];
    }
    
    public static void main(String[] args) {
        // ✅ Tratar exceções
        try {
            lerArquivo("arquivo.txt");
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado");
        }
        
        try {
            int resultado = dividir(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Erro ao dividir: " + e.getMessage());
        }
    }
}
```

**Exception** = problema na **aplicação**. **DEVE** ser tratado.

### 4. Comparação: Error vs Exception

```java
// ✅ Diferenças principais
public class ErrorVsException {
    
    // ERROR: Sistema quebrou
    public static void exemploError() {
        // ❌ NÃO TRATAR: problema do sistema
        try {
            causarOutOfMemory();
        } catch (OutOfMemoryError e) {
            // ⚠️ JVM pode estar comprometida
            // Melhor deixar programa encerrar
            System.err.println("Sem memória!");
            System.exit(1);  // Encerrar programa
        }
    }
    
    // EXCEPTION: Aplicação encontrou problema
    public static void exemploException() {
        // ✅ TRATAR: problema da aplicação
        try {
            processarDados("dados inválidos");
        } catch (IllegalArgumentException e) {
            // ✅ Pode recuperar e continuar
            System.out.println("Dados inválidos, usando padrão");
            processarDados("dados padrão");
        }
    }
    
    private static void causarOutOfMemory() {
        int[] arr = new int[Integer.MAX_VALUE];  // OutOfMemoryError
    }
    
    private static void processarDados(String dados) {
        if (!dados.equals("dados padrão")) {
            throw new IllegalArgumentException("Dados inválidos");
        }
        System.out.println("Processando: " + dados);
    }
}
```

| Aspecto | **Error** | **Exception** |
|---------|-----------|---------------|
| **Origem** | Sistema/JVM | Aplicação |
| **Gravidade** | Grave (irrecuperável) | Recuperável |
| **Tratamento** | NÃO tratar | DEVE tratar |
| **Continuidade** | Programa deve encerrar | Programa pode continuar |
| **Exemplos** | OutOfMemoryError, StackOverflowError | IOException, SQLException |

### 5. Quando Ocorrem Errors

```java
// ❌ Situações que causam ERROR
public class SituacoesError {
    
    // 1. STACK OVERFLOW ERROR
    public static void recursaoInfinita() {
        recursaoInfinita();
    }
    
    // 2. OUT OF MEMORY ERROR
    public static void consumirMemoria() {
        List<int[]> lista = new ArrayList<>();
        while (true) {
            lista.add(new int[1000000]);  // Consome memória
        }
    }
    
    // 3. LINKAGE ERROR
    // Erro ao carregar classes
    
    // 4. ASSERTION ERROR
    public static void validar() {
        assert false : "Validação falhou";  // AssertionError
    }
    
    // 5. VIRTUAL MACHINE ERROR
    // JVM encontra problema interno
    
    public static void main(String[] args) {
        System.out.println("⚠️ Executar esses métodos QUEBRA o programa!");
        
        // Descomentar para ver os erros:
        // recursaoInfinita();     // StackOverflowError
        // consumirMemoria();      // OutOfMemoryError
        // validar();              // AssertionError (precisa -ea)
    }
}
```

**Errors** = problemas **graves** da JVM.

### 6. Quando Ocorrem Exceptions

```java
// ✅ Situações que causam EXCEPTION (tratáveis)
public class SituacoesException {
    
    // 1. ARQUIVO NÃO EXISTE
    public static void lerArquivo() throws IOException {
        FileReader reader = new FileReader("arquivo.txt");
    }
    
    // 2. CONEXÃO FALHA
    public static void conectarBanco() throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:...");
    }
    
    // 3. DADO INVÁLIDO
    public static void converterNumero(String texto) {
        int numero = Integer.parseInt(texto);  // NumberFormatException
    }
    
    // 4. ÍNDICE INVÁLIDO
    public static void acessarArray(int[] arr, int indice) {
        int valor = arr[indice];  // ArrayIndexOutOfBoundsException
    }
    
    // 5. NULL POINTER
    public static void tamanhoTexto(String texto) {
        int tamanho = texto.length();  // NullPointerException
    }
    
    // 6. DIVISÃO POR ZERO
    public static void dividir(int a, int b) {
        int resultado = a / b;  // ArithmeticException
    }
    
    public static void main(String[] args) {
        // ✅ Todas podem ser tratadas
        try {
            lerArquivo();
        } catch (IOException e) {
            System.out.println("Arquivo não encontrado");
        }
        
        try {
            converterNumero("abc");
        } catch (NumberFormatException e) {
            System.out.println("Texto não é número");
        }
        
        try {
            dividir(10, 0);
        } catch (ArithmeticException e) {
            System.out.println("Divisão por zero");
        }
    }
}
```

**Exceptions** = problemas da **aplicação** que **podem** ser tratados.

### 7. Por Que NÃO Capturar Error?

```java
// ⚠️ Por que NÃO capturar Error?
public class PorQueNaoCapturarError {
    
    // ❌ Capturar Error: JVM pode estar COMPROMETIDA
    public static void mauExemplo() {
        try {
            int[] arr = new int[Integer.MAX_VALUE];  // OutOfMemoryError
        } catch (OutOfMemoryError e) {
            // ⚠️ Capturou, mas JVM está sem memória
            // Outros objetos podem falhar
            // Estado inconsistente
            System.out.println("Sem memória, continuando...");
            
            // ❌ Tentar continuar pode piorar
            String texto = "Texto";  // Pode falhar
            List<Integer> lista = new ArrayList<>();  // Pode falhar
        }
    }
    
    // ✅ Deixar Error propagar
    public static void bomExemplo() {
        // Não captura Error
        // JVM encerra programa de forma controlada
        // Recursos são liberados
        int[] arr = new int[Integer.MAX_VALUE];  // OutOfMemoryError -> CRASH
    }
    
    // ✅ Se REALMENTE precisar capturar Error
    public static void excecaoRara() {
        try {
            // Código crítico
            operacaoCritica();
        } catch (OutOfMemoryError e) {
            // Logar erro
            System.err.println("ERRO GRAVE: Sem memória!");
            e.printStackTrace();
            
            // Encerrar programa de forma controlada
            System.exit(1);
        }
    }
    
    private static void operacaoCritica() {
        // Operação que pode consumir muita memória
    }
}
```

**Error** = JVM comprometida. Melhor **encerrar** programa.

### 8. Throwable: Capturar Tudo?

```java
// ⚠️ Capturar Throwable captura TUDO (Error + Exception)
public class CapturarThrowable {
    
    // ❌ MAU: captura Error também
    public static void mauExemplo() {
        try {
            causarProblema();
        } catch (Throwable t) {  // ❌ Captura Error também
            System.out.println("Capturou: " + t);
            // Pode capturar OutOfMemoryError, StackOverflowError...
        }
    }
    
    // ✅ BOM: captura apenas Exception
    public static void bomExemplo() {
        try {
            causarProblema();
        } catch (Exception e) {  // ✅ Apenas Exception
            System.out.println("Capturou exceção: " + e);
            // Errors propagam normalmente
        }
    }
    
    // ✅ MELHOR: captura específico
    public static void melhorExemplo() {
        try {
            causarProblema();
        } catch (IllegalArgumentException e) {  // ✅ Específico
            System.out.println("Argumento inválido: " + e);
        } catch (IOException e) {
            System.out.println("Erro de I/O: " + e);
        }
    }
    
    private static void causarProblema() throws IOException {
        // Pode lançar várias exceções
    }
}
```

**NÃO** capturar `Throwable` (captura Error também). Preferir `Exception` ou **específico**.

### 9. AssertionError: Caso Especial

```java
// ✅ AssertionError: Error usado para TESTES
public class AssertionErrorExemplo {
    
    public static void validarIdade(int idade) {
        // Assertion: verifica condição durante desenvolvimento
        assert idade >= 0 : "Idade não pode ser negativa";
        
        // Resto do código
        System.out.println("Idade válida: " + idade);
    }
    
    public static void main(String[] args) {
        // ✅ Assertions DESABILITADAS por padrão
        validarIdade(-5);  // Não lança erro (assertions desabilitadas)
        
        // ⚠️ Para habilitar: java -ea NomeClasse
        // AssertionError será lançado se idade < 0
    }
}

// ✅ Usar para validações de DESENVOLVIMENTO
// ❌ NÃO usar para validações de PRODUÇÃO

// ✅ PRODUÇÃO: usar Exception
public static void validarIdadeProdução(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade não pode ser negativa");
    }
}
```

**AssertionError** = Error para **testes** (desabilitado em produção).

### 10. Resumo Visual

```java
/*
 * ERROR vs EXCEPTION
 * 
 * ERROR:
 *   - Origem: Sistema/JVM
 *   - Gravidade: GRAVE (irrecuperável)
 *   - Ação: NÃO tratar (deixar programa encerrar)
 *   - Exemplos:
 *     * OutOfMemoryError (sem memória)
 *     * StackOverflowError (pilha cheia)
 *     * VirtualMachineError (JVM quebrou)
 * 
 * EXCEPTION:
 *   - Origem: Aplicação
 *   - Gravidade: Recuperável
 *   - Ação: TRATAR (catch)
 *   - Exemplos:
 *     * IOException (arquivo não encontrado)
 *     * SQLException (banco inacessível)
 *     * NullPointerException (objeto null)
 *     * ArithmeticException (divisão por zero)
 */

public class ResumoErrorException {
    public static void main(String[] args) {
        // ❌ ERROR: deixar propagar
        // causarError();  // OutOfMemoryError -> CRASH
        
        // ✅ EXCEPTION: tratar
        try {
            causarException();
        } catch (Exception e) {
            System.out.println("Exceção tratada: " + e.getMessage());
        }
        
        System.out.println("Programa continua...");
    }
    
    private static void causarError() {
        int[] arr = new int[Integer.MAX_VALUE];  // OutOfMemoryError
    }
    
    private static void causarException() {
        throw new IllegalArgumentException("Argumento inválido");
    }
}
```

---

## Aplicabilidade

**Error**:
- Problemas **graves** do sistema
- JVM comprometida
- **NÃO** tratar (deixar encerrar)

**Exception**:
- Problemas **recuperáveis**
- Aplicação pode continuar
- **DEVE** tratar

---

## Armadilhas

### 1. Capturar Error

```java
// ❌ Capturar Error
catch (OutOfMemoryError e) { }

// ✅ Deixar propagar
// Não capturar Error
```

### 2. Capturar Throwable

```java
// ❌ Captura Error também
catch (Throwable t) { }

// ✅ Capturar Exception
catch (Exception e) { }
```

### 3. Usar AssertionError em Produção

```java
// ❌ Assertion em produção
assert idade >= 0;  // Desabilitado por padrão

// ✅ Exception em produção
if (idade < 0) {
    throw new IllegalArgumentException("Idade inválida");
}
```

---

## Boas Práticas

### 1. Nunca Capturar Error

```java
// ❌ Não capturar Error
// JVM pode estar comprometida

// ✅ Deixar Error propagar
// Programa encerra de forma controlada
```

### 2. Capturar Exception Específica

```java
// ✅ Específico
catch (FileNotFoundException e) { }
catch (SQLException e) { }

// ⚠️ Muito genérico
catch (Exception e) { }

// ❌ Captura Error também
catch (Throwable t) { }
```

### 3. Documentar Exceções

```java
/**
 * @throws IOException se arquivo não existir
 * @throws IllegalArgumentException se caminho for null
 */
public void lerArquivo(String caminho) throws IOException {
    // ...
}
```

---

## Resumo

**Error** vs **Exception**:

**Error**:
- Origem: **Sistema/JVM**
- Gravidade: **GRAVE** (irrecuperável)
- Tratamento: **NÃO** tratar
- Ação: Deixar programa **encerrar**
- Exemplos: `OutOfMemoryError`, `StackOverflowError`

**Exception**:
- Origem: **Aplicação**
- Gravidade: **Recuperável**
- Tratamento: **DEVE** tratar
- Ação: Programa **continua**
- Exemplos: `IOException`, `SQLException`, `NullPointerException`

**Hierarquia**:
```
Throwable
├── Error (NÃO tratar)
└── Exception (TRATAR)
```

**Regra de Ouro**: **Error** = problema **grave** do sistema, **NÃO** tratar. **Exception** = problema **recuperável** da aplicação, **DEVE** tratar. **NUNCA** capturar `Throwable` ou `Error`. Preferir `Exception` ou tipos **específicos**.
