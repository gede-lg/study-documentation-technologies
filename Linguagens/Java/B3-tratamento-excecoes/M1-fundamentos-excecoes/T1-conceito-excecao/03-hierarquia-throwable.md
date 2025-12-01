# T1.03 - Hierarquia de Exceções: Throwable

## Introdução

**Throwable** é a **raiz** de todas as exceções e erros em Java.

```java
/*
 * HIERARQUIA COMPLETA:
 * 
 *                    Object
 *                      |
 *                  Throwable (raiz de exceções)
 *                      |
 *          ┌───────────┴───────────┐
 *          |                       |
 *        Error                 Exception
 *          |                       |
 *   OutOfMemoryError      ┌────────┴────────┐
 *   StackOverflowError    |                 |
 *   VirtualMachineError   RuntimeException  IOException
 *   LinkageError          |                 SQLException
 *   AssertionError        |                 ClassNotFoundException
 *                         |                 FileNotFoundException
 *                 NullPointerException      ParseException
 *                 ArithmeticException       ...
 *                 IndexOutOfBoundsException
 *                 IllegalArgumentException
 *                 ClassCastException
 *                 ...
 */

// ✅ Throwable é a RAIZ
Throwable t = new Exception("Erro");  // ✅ Exception é Throwable
Throwable t2 = new Error("Erro grave");  // ✅ Error é Throwable
```

**Throwable** = tudo que pode ser **lançado** (`throw`) ou **capturado** (`catch`).

---

## Fundamentos

### 1. Classe Throwable

```java
// ✅ Throwable: classe raiz
public class ExemploThrowable {
    public static void main(String[] args) {
        // Criar Throwable diretamente (raro)
        Throwable t = new Throwable("Mensagem de erro");
        
        // Métodos principais de Throwable:
        System.out.println("Mensagem: " + t.getMessage());
        System.out.println("Causa: " + t.getCause());
        System.out.println("toString: " + t.toString());
        
        // Stack trace
        System.out.println("\nStack Trace:");
        t.printStackTrace();
        
        // Array de stack trace
        StackTraceElement[] stack = t.getStackTrace();
        for (StackTraceElement element : stack) {
            System.out.println("  " + element);
        }
    }
}

/* Saída:
Mensagem: Mensagem de erro
Causa: null
toString: java.lang.Throwable: Mensagem de erro

Stack Trace:
java.lang.Throwable: Mensagem de erro
    at ExemploThrowable.main(ExemploThrowable.java:5)
  ExemploThrowable.main(ExemploThrowable.java:5)
*/
```

**Throwable** fornece métodos para obter informações sobre o erro.

### 2. Dois Ramos Principais: Error e Exception

```java
// ✅ Throwable tem 2 subclasses diretas
public class DoisRamos {
    public static void main(String[] args) {
        // 1. ERROR: problemas graves
        Throwable erro = new OutOfMemoryError("Sem memória");
        System.out.println(erro instanceof Error);      // true
        System.out.println(erro instanceof Throwable);  // true
        
        // 2. EXCEPTION: problemas recuperáveis
        Throwable excecao = new IOException("Arquivo não encontrado");
        System.out.println(excecao instanceof Exception);  // true
        System.out.println(excecao instanceof Throwable);  // true
        
        // Ambos são Throwable
        processar(erro);
        processar(excecao);
    }
    
    public static void processar(Throwable t) {
        System.out.println("Tipo: " + t.getClass().getName());
        System.out.println("Mensagem: " + t.getMessage());
    }
}
```

**Error** e **Exception** estendem **Throwable**.

### 3. Hierarquia Error

```java
// ✅ Subclasses de Error (não tratar)
public class HierarquiaError {
    
    /*
     * Error
     *   ├── OutOfMemoryError
     *   ├── StackOverflowError
     *   ├── VirtualMachineError
     *   │     ├── InternalError
     *   │     └── UnknownError
     *   ├── LinkageError
     *   │     ├── NoClassDefFoundError
     *   │     ├── ClassFormatError
     *   │     └── VerifyError
     *   └── AssertionError
     */
    
    public static void exemploOutOfMemory() {
        List<byte[]> lista = new ArrayList<>();
        while (true) {
            lista.add(new byte[1024 * 1024]);  // OutOfMemoryError
        }
    }
    
    public static void exemploStackOverflow() {
        exemploStackOverflow();  // StackOverflowError
    }
    
    public static void exemploAssertion() {
        assert false : "Falhou";  // AssertionError (precisa -ea)
    }
    
    public static void main(String[] args) {
        // Mostrar hierarquia
        System.out.println("OutOfMemoryError instanceof Error: " + 
                         (new OutOfMemoryError() instanceof Error));
        System.out.println("OutOfMemoryError instanceof Throwable: " + 
                         (new OutOfMemoryError() instanceof Throwable));
        
        // ⚠️ Não executar os métodos (quebram o programa)
        // exemploOutOfMemory();
        // exemploStackOverflow();
    }
}
```

**Error** tem várias subclasses para diferentes problemas de sistema.

### 4. Hierarquia Exception

```java
// ✅ Subclasses de Exception
public class HierarquiaException {
    
    /*
     * Exception
     *   ├── RuntimeException (unchecked)
     *   │     ├── NullPointerException
     *   │     ├── ArithmeticException
     *   │     ├── IndexOutOfBoundsException
     *   │     │     ├── ArrayIndexOutOfBoundsException
     *   │     │     └── StringIndexOutOfBoundsException
     *   │     ├── IllegalArgumentException
     *   │     │     └── NumberFormatException
     *   │     ├── IllegalStateException
     *   │     ├── ClassCastException
     *   │     └── UnsupportedOperationException
     *   │
     *   └── (Outras - checked)
     *         ├── IOException
     *         │     ├── FileNotFoundException
     *         │     ├── EOFException
     *         │     └── SocketException
     *         ├── SQLException
     *         ├── ClassNotFoundException
     *         ├── ParseException
     *         └── InterruptedException
     */
    
    public static void exemplosRuntimeException() {
        // NullPointerException
        String texto = null;
        // texto.length();  // NullPointerException
        
        // ArithmeticException
        // int x = 10 / 0;  // ArithmeticException
        
        // ArrayIndexOutOfBoundsException
        int[] arr = {1, 2, 3};
        // int y = arr[10];  // ArrayIndexOutOfBoundsException
        
        // NumberFormatException
        // int z = Integer.parseInt("abc");  // NumberFormatException
    }
    
    public static void exemplosCheckedException() throws IOException, SQLException {
        // IOException
        // FileReader reader = new FileReader("arquivo.txt");
        
        // SQLException
        // Connection conn = DriverManager.getConnection("...");
    }
    
    public static void main(String[] args) {
        // Mostrar hierarquia
        System.out.println("NullPointerException instanceof RuntimeException: " + 
                         (new NullPointerException() instanceof RuntimeException));
        System.out.println("IOException instanceof Exception: " + 
                         (new IOException() instanceof Exception));
        System.out.println("IOException instanceof RuntimeException: " + 
                         (new IOException() instanceof RuntimeException));  // false
    }
}
```

**Exception** tem dois grupos: **RuntimeException** (unchecked) e **outras** (checked).

### 5. instanceof com Hierarquia

```java
// ✅ Verificar tipo na hierarquia
public class InstanceOfHierarquia {
    public static void main(String[] args) {
        Exception e = new IOException("Erro I/O");
        
        // Verificar hierarquia
        System.out.println("instanceof IOException: " + (e instanceof IOException));        // true
        System.out.println("instanceof Exception: " + (e instanceof Exception));            // true
        System.out.println("instanceof Throwable: " + (e instanceof Throwable));            // true
        System.out.println("instanceof Object: " + (e instanceof Object));                  // true
        System.out.println("instanceof RuntimeException: " + (e instanceof RuntimeException)); // false
        System.out.println("instanceof Error: " + (e instanceof Error));                    // false
        
        // RuntimeException
        RuntimeException re = new NullPointerException("Null");
        System.out.println("\ninstanceof NullPointerException: " + (re instanceof NullPointerException)); // true
        System.out.println("instanceof RuntimeException: " + (re instanceof RuntimeException));     // true
        System.out.println("instanceof Exception: " + (re instanceof Exception));                   // true
        System.out.println("instanceof Throwable: " + (re instanceof Throwable));                   // true
        System.out.println("instanceof IOException: " + (re instanceof IOException));               // false
    }
}
```

`instanceof` verifica **toda a hierarquia** (subclasse é da superclasse).

### 6. Capturar por Hierarquia

```java
// ✅ Capturar exceções pela hierarquia
public class CapturarHierarquia {
    public static void main(String[] args) {
        // ORDEM IMPORTA: mais específico primeiro
        try {
            throw new FileNotFoundException("Arquivo não encontrado");
        } catch (FileNotFoundException e) {  // ✅ Mais específico
            System.out.println("Arquivo não encontrado: " + e.getMessage());
        } catch (IOException e) {  // IOException é pai de FileNotFoundException
            System.out.println("Erro I/O: " + e.getMessage());
        } catch (Exception e) {  // Exception é pai de IOException
            System.out.println("Erro geral: " + e.getMessage());
        }
        
        // ❌ ORDEM ERRADA: não compila
        /*
        try {
            throw new FileNotFoundException();
        } catch (Exception e) {  // ❌ Muito genérico primeiro
            System.out.println("Erro geral");
        } catch (IOException e) {  // ❌ ERRO: nunca será alcançado
            System.out.println("Erro I/O");
        }
        */
    }
}
```

**Ordem** de `catch`: **mais específico** primeiro, **mais genérico** depois.

### 7. Polimorfismo com Throwable

```java
// ✅ Polimorfismo: tratar diferentes exceções de forma uniforme
public class PolimorfismoThrowable {
    
    public static void processar(Throwable t) {
        System.out.println("=== Processando Throwable ===");
        System.out.println("Tipo: " + t.getClass().getName());
        System.out.println("Mensagem: " + t.getMessage());
        
        // Verificar tipo específico
        if (t instanceof Error) {
            System.out.println("⚠️ É um Error (grave)");
        } else if (t instanceof RuntimeException) {
            System.out.println("⚠️ É RuntimeException (unchecked)");
        } else if (t instanceof Exception) {
            System.out.println("✅ É Exception checked");
        }
    }
    
    public static void main(String[] args) {
        processar(new OutOfMemoryError("Sem memória"));
        System.out.println();
        processar(new NullPointerException("Null"));
        System.out.println();
        processar(new IOException("I/O error"));
    }
}

/* Saída:
=== Processando Throwable ===
Tipo: java.lang.OutOfMemoryError
Mensagem: Sem memória
⚠️ É um Error (grave)

=== Processando Throwable ===
Tipo: java.lang.NullPointerException
Mensagem: Null
⚠️ É RuntimeException (unchecked)

=== Processando Throwable ===
Tipo: java.io.IOException
Mensagem: I/O error
✅ É Exception checked
*/
```

**Polimorfismo** permite tratar diferentes exceções com **mesmo método**.

### 8. Métodos Importantes de Throwable

```java
// ✅ Métodos principais de Throwable
public class MetodosThrowable {
    public static void main(String[] args) {
        try {
            metodoA();
        } catch (Exception e) {
            // 1. getMessage(): mensagem do erro
            System.out.println("getMessage(): " + e.getMessage());
            
            // 2. toString(): tipo + mensagem
            System.out.println("toString(): " + e.toString());
            
            // 3. getCause(): causa raiz
            System.out.println("getCause(): " + e.getCause());
            
            // 4. getStackTrace(): array de elementos
            System.out.println("\ngetStackTrace():");
            StackTraceElement[] stack = e.getStackTrace();
            for (StackTraceElement element : stack) {
                System.out.println("  " + element);
            }
            
            // 5. printStackTrace(): imprime stack completo
            System.out.println("\nprintStackTrace():");
            e.printStackTrace();
            
            // 6. getClass(): tipo da exceção
            System.out.println("\ngetClass(): " + e.getClass());
            System.out.println("getClass().getName(): " + e.getClass().getName());
        }
    }
    
    public static void metodoA() throws Exception {
        metodoB();
    }
    
    public static void metodoB() throws Exception {
        metodoC();
    }
    
    public static void metodoC() throws Exception {
        throw new Exception("Erro no método C");
    }
}
```

**Throwable** fornece métodos para **inspecionar** a exceção.

### 9. Criar Exceção com Causa

```java
// ✅ Exceção com causa (chaining)
public class ExcecaoComCausa {
    
    public static void processar() throws Exception {
        try {
            // Operação que falha
            FileReader reader = new FileReader("arquivo.txt");
        } catch (FileNotFoundException e) {
            // Lançar nova exceção com causa
            throw new Exception("Erro ao processar arquivo", e);
        }
    }
    
    public static void main(String[] args) {
        try {
            processar();
        } catch (Exception e) {
            System.out.println("Mensagem: " + e.getMessage());
            System.out.println("Causa: " + e.getCause());
            System.out.println("Mensagem da causa: " + e.getCause().getMessage());
            
            System.out.println("\nStack trace completo:");
            e.printStackTrace();
        }
    }
}

/* Saída:
Mensagem: Erro ao processar arquivo
Causa: java.io.FileNotFoundException: arquivo.txt (No such file or directory)
Mensagem da causa: arquivo.txt (No such file or directory)

Stack trace completo:
java.lang.Exception: Erro ao processar arquivo
    at ExcecaoComCausa.processar(...)
    at ExcecaoComCausa.main(...)
Caused by: java.io.FileNotFoundException: arquivo.txt (No such file or directory)
    at java.io.FileInputStream.<init>(...)
    at java.io.FileReader.<init>(...)
    at ExcecaoComCausa.processar(...)
    ... 1 more
*/
```

**Causa** (`cause`) preserva exceção **original** quando lançar nova.

### 10. Navegando pela Hierarquia

```java
// ✅ Navegar pela hierarquia de uma exceção
public class NavegarHierarquia {
    public static void main(String[] args) {
        Exception e = new FileNotFoundException("arquivo.txt");
        
        System.out.println("=== Hierarquia de " + e.getClass().getName() + " ===");
        
        // Subir pela hierarquia
        Class<?> classe = e.getClass();
        int nivel = 0;
        
        while (classe != null) {
            String indent = "  ".repeat(nivel);
            System.out.println(indent + classe.getName());
            
            // Próximo nível (superclasse)
            classe = classe.getSuperclass();
            nivel++;
        }
    }
}

/* Saída:
=== Hierarquia de java.io.FileNotFoundException ===
java.io.FileNotFoundException
  java.io.IOException
    java.lang.Exception
      java.lang.Throwable
        java.lang.Object
*/
```

Toda exceção **herda** de `Object` → `Throwable` → `Exception`/`Error`.

---

## Aplicabilidade

**Throwable** é usado para:
- **Raiz** de todas exceções/erros
- **Polimorfismo**: tratar diferentes tipos uniformemente
- **Métodos**: `getMessage()`, `printStackTrace()`, `getCause()`
- **Chaining**: preservar exceção original

---

## Armadilhas

### 1. Capturar Throwable

```java
// ❌ Captura Error também
try {
    // ...
} catch (Throwable t) {  // ❌ Captura Error
    // ...
}

// ✅ Capturar Exception
try {
    // ...
} catch (Exception e) {  // ✅ Não captura Error
    // ...
}
```

### 2. Ordem Errada de catch

```java
// ❌ Ordem errada (não compila)
try {
    // ...
} catch (Exception e) {  // ❌ Muito genérico primeiro
    // ...
} catch (IOException e) {  // ❌ ERRO: nunca alcançado
    // ...
}

// ✅ Ordem correta
try {
    // ...
} catch (IOException e) {  // ✅ Mais específico
    // ...
} catch (Exception e) {  // ✅ Mais genérico
    // ...
}
```

### 3. Ignorar Causa

```java
// ❌ Perder exceção original
try {
    // ...
} catch (IOException e) {
    throw new Exception("Erro");  // ❌ Perdeu IOException
}

// ✅ Preservar causa
try {
    // ...
} catch (IOException e) {
    throw new Exception("Erro", e);  // ✅ Preserva causa
}
```

---

## Boas Práticas

### 1. Capturar Específico

```java
// ✅ Específico
catch (FileNotFoundException e) { }
catch (IOException e) { }

// ⚠️ Genérico
catch (Exception e) { }
```

### 2. Preservar Causa

```java
// ✅ Usar construtor com causa
throw new Exception("Mensagem", causaOriginal);
```

### 3. Usar printStackTrace para Debug

```java
// ✅ Útil para debugging
catch (Exception e) {
    e.printStackTrace();
    // Ou usar logger:
    logger.error("Erro", e);
}
```

---

## Resumo

**Hierarquia Throwable**:

```
Object
  └── Throwable (raiz)
        ├── Error (grave, NÃO tratar)
        │     ├── OutOfMemoryError
        │     ├── StackOverflowError
        │     └── VirtualMachineError
        │
        └── Exception (recuperável, TRATAR)
              ├── RuntimeException (unchecked)
              │     ├── NullPointerException
              │     ├── ArithmeticException
              │     └── IndexOutOfBoundsException
              │
              └── Outras (checked)
                    ├── IOException
                    ├── SQLException
                    └── ClassNotFoundException
```

**Throwable**:
- **Raiz** de todas exceções/erros
- Fornece métodos: `getMessage()`, `printStackTrace()`, `getCause()`
- Permite **polimorfismo** (tratar diferentes tipos)
- Usado para **chaining** (causa)

**Ordem catch**: mais **específico** → mais **genérico**.

**Regra de Ouro**: **Throwable** = raiz de **tudo** que pode ser lançado/capturado. **Error** e **Exception** estendem **Throwable**. **Ordem** de `catch` importa (específico antes de genérico). **Preservar** causa quando relançar exceção. **NÃO** capturar `Throwable` diretamente (captura `Error`).
