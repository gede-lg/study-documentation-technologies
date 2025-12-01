# T3.03 - Unchecked: RuntimeException e Subclasses

## Introdução

**Unchecked exceptions** são exceções **não verificadas** pelo compilador (RuntimeException + Error).

```java
/*
 * UNCHECKED EXCEPTIONS
 * 
 * DEFINIÇÃO:
 *   - NÃO verificadas em tempo de compilação
 *   - Compilador NÃO obriga tratar ou declarar
 *   - RuntimeException + Error + suas subclasses
 * 
 * HIERARQUIA:
 *   Throwable
 *     ├── Error (UNCHECKED)
 *     │     └── OutOfMemoryError, StackOverflowError, ...
 *     │
 *     └── Exception
 *           ├── RuntimeException (UNCHECKED)
 *           │     ├── NullPointerException
 *           │     ├── ArithmeticException
 *           │     ├── IndexOutOfBoundsException
 *           │     └── ... (todas RuntimeException)
 *           │
 *           └── Checked Exceptions
 *                 └── IOException, SQLException, ...
 */

// ✅ UNCHECKED: compila SEM throws/try-catch
public static void dividir(int a, int b) {
    int resultado = a / b;  // ArithmeticException - OK sem tratamento
}

public static void acessar(int[] array, int indice) {
    int valor = array[indice];  // ArrayIndexOutOfBoundsException - OK
}

public static void imprimir(String texto) {
    System.out.println(texto.length());  // NullPointerException - OK
}

// ❌ CHECKED: NÃO compila sem throws/try-catch
// public static void ler(String caminho) {
//     FileReader reader = new FileReader(caminho);  // ERRO
// }
```

**Unchecked** = compilador **não verifica**. **Opcional** tratar.

---

## Fundamentos

### 1. RuntimeException: Raiz das Unchecked

```java
// ✅ RuntimeException é a raiz das exceções unchecked
public class RaizUnchecked {
    
    public static void demonstrarHierarquia() {
        // ✅ Verificar hierarquia
        RuntimeException unchecked = new NullPointerException("NPE");
        
        System.out.println("instanceof RuntimeException: " + 
                         (unchecked instanceof RuntimeException));  // true
        System.out.println("instanceof Exception: " + 
                         (unchecked instanceof Exception));         // true
        System.out.println("instanceof Throwable: " + 
                         (unchecked instanceof Throwable));         // true
        
        // RuntimeException É Exception (mas unchecked)
        System.out.println("\nRuntimeException extends Exception: true");
        System.out.println("RuntimeException é UNCHECKED: true");
    }
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   ├── RuntimeException (UNCHECKED)
     *   │     ├── NullPointerException
     *   │     ├── ArithmeticException
     *   │     ├── IndexOutOfBoundsException
     *   │     │     ├── ArrayIndexOutOfBoundsException
     *   │     │     └── StringIndexOutOfBoundsException
     *   │     ├── IllegalArgumentException
     *   │     │     └── NumberFormatException
     *   │     ├── IllegalStateException
     *   │     ├── ClassCastException
     *   │     └── ... (muitas outras)
     *   │
     *   └── Checked Exceptions
     *         └── IOException, SQLException, ...
     */
}
```

**RuntimeException** = raiz das **unchecked** (exceções de programação).

### 2. Principais Subclasses de RuntimeException

```java
// ✅ Principais RuntimeExceptions
public class PrincipaisRuntimeExceptions {
    
    public static void main(String[] args) {
        System.out.println("=== Principais RuntimeExceptions ===\n");
        
        // 1. NullPointerException
        exemploNPE();
        
        // 2. ArithmeticException
        exemploArithmetic();
        
        // 3. ArrayIndexOutOfBoundsException
        exemploArrayIndex();
        
        // 4. StringIndexOutOfBoundsException
        exemploStringIndex();
        
        // 5. NumberFormatException
        exemploNumberFormat();
        
        // 6. IllegalArgumentException
        exemploIllegalArgument();
        
        // 7. IllegalStateException
        exemploIllegalState();
        
        // 8. ClassCastException
        exemploClassCast();
        
        // 9. UnsupportedOperationException
        exemploUnsupported();
    }
    
    // 1. NullPointerException: objeto null
    public static void exemploNPE() {
        System.out.println("1. NullPointerException:");
        String texto = null;
        try {
            texto.length();  // ❌ NPE
        } catch (NullPointerException e) {
            System.out.println("   Causa: objeto null");
        }
        System.out.println();
    }
    
    // 2. ArithmeticException: operação aritmética inválida
    public static void exemploArithmetic() {
        System.out.println("2. ArithmeticException:");
        try {
            int resultado = 10 / 0;  // ❌ Divisão por zero
        } catch (ArithmeticException e) {
            System.out.println("   Causa: " + e.getMessage());
        }
        System.out.println();
    }
    
    // 3. ArrayIndexOutOfBoundsException: índice inválido array
    public static void exemploArrayIndex() {
        System.out.println("3. ArrayIndexOutOfBoundsException:");
        int[] array = {1, 2, 3};
        try {
            int valor = array[10];  // ❌ Índice 10
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("   Causa: índice 10 (tamanho: 3)");
        }
        System.out.println();
    }
    
    // 4. StringIndexOutOfBoundsException: índice inválido String
    public static void exemploStringIndex() {
        System.out.println("4. StringIndexOutOfBoundsException:");
        String texto = "teste";
        try {
            char c = texto.charAt(10);  // ❌ Índice 10
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("   Causa: índice 10 (tamanho: 5)");
        }
        System.out.println();
    }
    
    // 5. NumberFormatException: conversão inválida
    public static void exemploNumberFormat() {
        System.out.println("5. NumberFormatException:");
        try {
            int numero = Integer.parseInt("abc");  // ❌ "abc" não é número
        } catch (NumberFormatException e) {
            System.out.println("   Causa: \"abc\" não é número");
        }
        System.out.println();
    }
    
    // 6. IllegalArgumentException: argumento inválido
    public static void exemploIllegalArgument() {
        System.out.println("6. IllegalArgumentException:");
        try {
            Thread.sleep(-1000);  // ❌ Timeout negativo
        } catch (IllegalArgumentException e) {
            System.out.println("   Causa: " + e.getMessage());
        } catch (InterruptedException e) {
            // InterruptedException é checked
        }
        System.out.println();
    }
    
    // 7. IllegalStateException: estado inválido
    public static void exemploIllegalState() {
        System.out.println("7. IllegalStateException:");
        Iterator<Integer> it = Arrays.asList(1, 2, 3).iterator();
        try {
            it.remove();  // ❌ Sem next() antes
        } catch (IllegalStateException e) {
            System.out.println("   Causa: remove() sem next()");
        }
        System.out.println();
    }
    
    // 8. ClassCastException: cast inválido
    public static void exemploClassCast() {
        System.out.println("8. ClassCastException:");
        Object obj = "texto";
        try {
            Integer numero = (Integer) obj;  // ❌ String não é Integer
        } catch (ClassCastException e) {
            System.out.println("   Causa: String → Integer");
        }
        System.out.println();
    }
    
    // 9. UnsupportedOperationException: operação não suportada
    public static void exemploUnsupported() {
        System.out.println("9. UnsupportedOperationException:");
        List<Integer> lista = Arrays.asList(1, 2, 3);
        try {
            lista.add(4);  // ❌ Lista imutável
        } catch (UnsupportedOperationException e) {
            System.out.println("   Causa: lista imutável (Arrays.asList)");
        }
        System.out.println();
    }
}
```

**RuntimeException** cobre erros de **programação** (bugs).

### 3. IndexOutOfBoundsException: Hierarquia

```java
// ✅ IndexOutOfBoundsException: classe abstrata
public class IndexOutOfBoundsHierarquia {
    
    /*
     * HIERARQUIA:
     * 
     * RuntimeException
     *   └── IndexOutOfBoundsException (abstract)
     *         ├── ArrayIndexOutOfBoundsException
     *         └── StringIndexOutOfBoundsException
     */
    
    public static void demonstrar() {
        // ArrayIndexOutOfBoundsException
        int[] array = {1, 2, 3};
        try {
            int valor = array[10];
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("ArrayIndexOutOfBoundsException: " + e.getMessage());
        }
        
        // StringIndexOutOfBoundsException
        String texto = "teste";
        try {
            char c = texto.charAt(10);
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("StringIndexOutOfBoundsException: " + e.getMessage());
        }
        
        // ✅ Capturar classe pai (IndexOutOfBoundsException)
        try {
            int[] nums = {1, 2, 3};
            int x = nums[10];
        } catch (IndexOutOfBoundsException e) {
            // Captura Array E String IndexOutOfBounds
            System.out.println("IndexOutOfBoundsException: " + e.getMessage());
        }
    }
}
```

**IndexOutOfBoundsException** = pai de **Array** e **String** IndexOutOfBounds.

### 4. IllegalArgumentException: Hierarquia

```java
// ✅ IllegalArgumentException: validação de parâmetros
public class IllegalArgumentHierarquia {
    
    /*
     * HIERARQUIA:
     * 
     * RuntimeException
     *   └── IllegalArgumentException
     *         ├── NumberFormatException
     *         └── ... (outras)
     */
    
    // Lançar IllegalArgumentException para parâmetro inválido
    public static void setIdade(int idade) {
        if (idade < 0 || idade > 150) {
            throw new IllegalArgumentException(
                "Idade inválida: " + idade + " (esperado: 0-150)"
            );
        }
        System.out.println("Idade válida: " + idade);
    }
    
    // NumberFormatException é subclasse de IllegalArgumentException
    public static void demonstrarNumberFormat() {
        try {
            int numero = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("NumberFormatException: " + e.getMessage());
            
            // ✅ NumberFormatException é IllegalArgumentException
            System.out.println("instanceof IllegalArgumentException: " + 
                             (e instanceof IllegalArgumentException));  // true
        }
    }
    
    // Capturar IllegalArgumentException captura NumberFormatException
    public static void capturarPai() {
        try {
            int numero = Integer.parseInt("abc");
        } catch (IllegalArgumentException e) {
            // ✅ Captura NumberFormatException também
            System.out.println("Capturou: " + e.getClass().getSimpleName());
        }
    }
}
```

**IllegalArgumentException** = validação de **parâmetros**. **NumberFormatException** é subclasse.

### 5. Error: Também é Unchecked

```java
// ✅ Error também é unchecked
public class ErrorUnchecked {
    
    /*
     * UNCHECKED = RuntimeException + Error
     * 
     * Throwable
     *   ├── Error (UNCHECKED)
     *   │     ├── OutOfMemoryError
     *   │     ├── StackOverflowError
     *   │     └── ...
     *   │
     *   └── Exception
     *         ├── RuntimeException (UNCHECKED)
     *         │     └── ...
     *         │
     *         └── Checked
     *               └── ...
     */
    
    // ✅ Error NÃO obriga throws/try-catch
    public static void metodoComError() {
        // ✅ Compila sem throws
        throw new OutOfMemoryError("Sem memória");
    }
    
    // ⚠️ Error NÃO deve ser capturado (JVM comprometida)
    public static void naoCapturarError() {
        // ⚠️ Compila, mas não recomendado
        try {
            throw new OutOfMemoryError("OOM");
        } catch (OutOfMemoryError e) {
            // ⚠️ JVM comprometida, não deve continuar
        }
    }
    
    public static void main(String[] args) {
        System.out.println("=== Error é Unchecked ===");
        System.out.println("Compilador NÃO obriga tratar Error");
        System.out.println("Mas NÃO deve capturar (JVM comprometida)");
    }
}
```

**Error** é **unchecked** (mas **não** deve ser capturado).

### 6. Unchecked: Opcional Declarar/Tratar

```java
// ✅ Unchecked: opcional declarar ou tratar
public class OpcionalTratar {
    
    // ✅ OPÇÃO 1: NÃO declarar, NÃO tratar (mais comum)
    public static void opcao1(int a, int b) {
        int resultado = a / b;  // ArithmeticException - OK sem tratamento
    }
    
    // ✅ OPÇÃO 2: DECLARAR com throws (opcional, mas permitido)
    public static void opcao2(int a, int b) throws ArithmeticException {
        int resultado = a / b;  // OK declarar unchecked
    }
    
    // ✅ OPÇÃO 3: TRATAR com try-catch (opcional)
    public static void opcao3(int a, int b) {
        try {
            int resultado = a / b;
        } catch (ArithmeticException e) {
            System.err.println("Erro: divisão por zero");
        }
    }
    
    // ✅ Chamar método que lança unchecked
    public static void chamar() {
        // NÃO precisa throws ou try-catch
        opcao1(10, 0);  // OK
        opcao2(10, 0);  // OK
        opcao3(10, 0);  // OK
    }
    
    /*
     * COMPARAR com checked:
     * 
     * Checked IOException:
     *   - ❌ NÃO compila sem throws/try-catch
     *   - DEVE escolher uma opção
     * 
     * Unchecked ArithmeticException:
     *   - ✅ COMPILA sem throws/try-catch
     *   - Opcional declarar/tratar
     */
}
```

**Unchecked** = **opcional** declarar ou tratar (compila sem).

### 7. Por Que Unchecked Existe?

```java
// ✅ Por que unchecked (não obriga tratar)?
public class PorQueUnchecked {
    
    /*
     * RAZÃO 1: Erros de PROGRAMAÇÃO (bugs)
     *   - NullPointerException: deveria validar null
     *   - ArithmeticException: deveria validar divisor != 0
     *   - IndexOutOfBounds: deveria validar índice
     *   → Não são situações esperadas (são BUGS)
     */
    
    /*
     * RAZÃO 2: Muito COMUM
     *   - Se NullPointer fosse checked: try-catch em TODO acesso
     *   - Se ArithmeticException fosse checked: try-catch em TODA divisão
     *   - Código ficaria MUITO verboso
     */
    
    // ❌ SE NullPointer fosse checked (verboso demais)
    public static void seNPEFosseChecked(String texto) {
        // try {
        //     System.out.println(texto.length());
        // } catch (NullPointerException e) { }
        // 
        // try {
        //     System.out.println(texto.toUpperCase());
        // } catch (NullPointerException e) { }
        // 
        // → Código MUITO verboso
    }
    
    // ✅ NPE sendo unchecked (código limpo)
    public static void npeUnchecked(String texto) {
        // ✅ Prevenir com validação
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        
        // ✅ Agora seguro (não lança NPE)
        System.out.println(texto.length());
        System.out.println(texto.toUpperCase());
    }
    
    /*
     * RAZÃO 3: Sob CONTROLE do desenvolvedor
     *   - Null: validar parâmetros
     *   - Divisão zero: validar divisor
     *   - Índice: validar limites
     *   → Desenvolvedor PODE prevenir
     */
    
    public static void main(String[] args) {
        System.out.println("=== Por Que Unchecked? ===");
        System.out.println("1. Erros de PROGRAMAÇÃO (bugs)");
        System.out.println("2. Muito COMUM (código ficaria verboso)");
        System.out.println("3. Sob CONTROLE (pode prevenir)");
    }
}
```

**Unchecked** = erros de **programação** (bugs). Muito **comuns**. **Prevenir** é melhor que tratar.

### 8. Unchecked: Prevenir ao Invés de Tratar

```java
// ✅ Prevenir unchecked com validações
public class PrevenirUnchecked {
    
    // ❌ MAU: tratar unchecked (deveria prevenir)
    public static void mau(String texto, int divisor, int[] array, int indice) {
        try {
            System.out.println(texto.length());
            int resultado = 10 / divisor;
            int valor = array[indice];
        } catch (NullPointerException e) {
            // ❌ Captura bug (deveria prevenir)
        } catch (ArithmeticException e) {
            // ❌ Captura bug (deveria prevenir)
        } catch (ArrayIndexOutOfBoundsException e) {
            // ❌ Captura bug (deveria prevenir)
        }
    }
    
    // ✅ BOM: prevenir com validações
    public static void bom(String texto, int divisor, int[] array, int indice) {
        // ✅ Validar parâmetros
        if (texto == null) {
            throw new IllegalArgumentException("Texto não pode ser null");
        }
        if (divisor == 0) {
            throw new IllegalArgumentException("Divisor não pode ser zero");
        }
        if (array == null) {
            throw new IllegalArgumentException("Array não pode ser null");
        }
        if (indice < 0 || indice >= array.length) {
            throw new IllegalArgumentException(
                "Índice inválido: " + indice + " (tamanho: " + array.length + ")"
            );
        }
        
        // ✅ Agora seguro (não lança exceção)
        System.out.println(texto.length());
        int resultado = 10 / divisor;
        int valor = array[indice];
    }
}
```

**Prevenir** com validações >>> capturar unchecked.

### 9. Unchecked: Quando Tratar?

```java
// ✅ Raros casos onde tratar unchecked faz sentido
public class QuandoTratarUnchecked {
    
    // ✅ CASO 1: Input do USUÁRIO (imprevisível)
    public static void inputUsuario(String input) {
        try {
            int numero = Integer.parseInt(input);  // NumberFormatException
            System.out.println("Número: " + numero);
        } catch (NumberFormatException e) {
            // ✅ OK: usuário pode digitar qualquer coisa
            System.out.println("Entrada inválida. Digite um número.");
        }
    }
    
    // ✅ CASO 2: API de terceiros (pode lançar unchecked)
    public static void apiTerceiros(Object obj) {
        try {
            // API externa pode lançar RuntimeException
            obj.toString();
        } catch (NullPointerException e) {
            // ✅ OK: proteger contra API mal implementada
            System.err.println("API retornou null");
        }
    }
    
    // ✅ CASO 3: Aplicação CRÍTICA (não pode parar)
    public static void aplicacaoCritica() {
        try {
            processarDados();
        } catch (RuntimeException e) {
            // ✅ OK: aplicação crítica não pode quebrar
            System.err.println("Erro inesperado: " + e.getMessage());
            logger.error("Runtime exception", e);
            enviarAlerta(e);
        }
    }
    
    private static void processarDados() { }
    private static void logger.error(String msg, Exception e) { }
    private static void enviarAlerta(Exception e) { }
}
```

**Tratar unchecked** apenas em casos **específicos** (input usuário, API terceiros, aplicação crítica).

### 10. Resumo Visual: Hierarquia Unchecked

```java
/*
 * HIERARQUIA COMPLETA UNCHECKED
 * 
 * Throwable
 *   │
 *   ├── Error (UNCHECKED)
 *   │     ├── VirtualMachineError
 *   │     │     ├── OutOfMemoryError
 *   │     │     ├── StackOverflowError
 *   │     │     └── InternalError
 *   │     ├── LinkageError
 *   │     │     ├── NoClassDefFoundError
 *   │     │     └── ClassFormatError
 *   │     └── AssertionError
 *   │
 *   └── Exception
 *         │
 *         ├── RuntimeException (UNCHECKED)
 *         │     │
 *         │     ├── NullPointerException
 *         │     │
 *         │     ├── ArithmeticException
 *         │     │
 *         │     ├── IndexOutOfBoundsException
 *         │     │     ├── ArrayIndexOutOfBoundsException
 *         │     │     └── StringIndexOutOfBoundsException
 *         │     │
 *         │     ├── IllegalArgumentException
 *         │     │     └── NumberFormatException
 *         │     │
 *         │     ├── IllegalStateException
 *         │     │
 *         │     ├── ClassCastException
 *         │     │
 *         │     ├── UnsupportedOperationException
 *         │     │
 *         │     └── ... (muitas outras)
 *         │
 *         └── Checked Exceptions
 *               └── IOException, SQLException, ...
 */

public class ResumoHierarquia {
    public static void main(String[] args) {
        System.out.println("=== UNCHECKED = RuntimeException + Error ===");
        System.out.println("\nRuntimeException (principais):");
        System.out.println("  - NullPointerException");
        System.out.println("  - ArithmeticException");
        System.out.println("  - ArrayIndexOutOfBoundsException");
        System.out.println("  - NumberFormatException");
        System.out.println("  - IllegalArgumentException");
        System.out.println("  - IllegalStateException");
        System.out.println("  - ClassCastException");
        
        System.out.println("\nError (não tratar):");
        System.out.println("  - OutOfMemoryError");
        System.out.println("  - StackOverflowError");
    }
}
```

---

## Aplicabilidade

**Unchecked exceptions** são usadas para:
- Erros de **programação** (bugs)
- Situações **não esperadas** (deveriam prevenir)
- **Sob controle** (validações previnem)
- **Opcional** declarar/tratar

---

## Armadilhas

### 1. Tratar ao Invés de Prevenir

```java
// ❌ Tratar bug
try {
    int r = a / b;
} catch (ArithmeticException e) { }

// ✅ Prevenir
if (b == 0) {
    throw new IllegalArgumentException("Divisor zero");
}
```

### 2. Declarar throws Desnecessário

```java
// ⚠️ throws desnecessário (unchecked)
public void metodo() throws NullPointerException {
    // Unchecked: não precisa declarar
}

// ✅ Não declarar (opcional)
public void metodo() {
    // OK sem throws
}
```

### 3. Capturar Muito Genérico

```java
// ❌ Muito genérico
catch (RuntimeException e) { }

// ✅ Específico
catch (NullPointerException e) { }
catch (ArithmeticException e) { }
```

---

## Boas Práticas

### 1. Prevenir com Validações

```java
// ✅ Validar parâmetros
if (obj == null) {
    throw new IllegalArgumentException("Null");
}
if (divisor == 0) {
    throw new IllegalArgumentException("Zero");
}
```

### 2. Não Declarar throws (Opcional)

```java
// ✅ Não declarar unchecked (opcional)
public void processar(String texto) {
    // NullPointer possível, mas não declarar
}
```

### 3. Lançar IllegalArgumentException

```java
// ✅ Validação de entrada
public void setIdade(int idade) {
    if (idade < 0) {
        throw new IllegalArgumentException("Idade negativa");
    }
}
```

---

## Resumo

**Unchecked** = **RuntimeException** + **Error** (não verificadas).

**RuntimeException**:
- **Compilador NÃO obriga** tratar
- Erros de **programação** (bugs)
- **Prevenir** com validações
- **Opcional** declarar/tratar

**Principais**:
- **NullPointerException**: objeto null
- **ArithmeticException**: divisão por zero
- **ArrayIndexOutOfBoundsException**: índice inválido
- **NumberFormatException**: conversão inválida
- **IllegalArgumentException**: argumento inválido
- **IllegalStateException**: estado inválido
- **ClassCastException**: cast inválido

**Error** (também unchecked):
- **OutOfMemoryError**: sem memória
- **StackOverflowError**: pilha cheia
- **NÃO** deve ser capturado (JVM comprometida)

**Por que unchecked**:
- Erros de **programação** (não situação esperada)
- Muito **comuns** (obrigar tratar = verboso)
- **Sob controle** (validações previnem)

**Quando tratar**:
- **Input usuário** (imprevisível)
- **API terceiros** (pode lançar)
- **Aplicação crítica** (não pode parar)

**Regra de Ouro**: Unchecked = **bugs**. **Prevenir** com validações (não tratar). Lançar **IllegalArgumentException** para parâmetros inválidos. **Não** declarar `throws` (opcional). Tratar apenas casos **específicos**.
