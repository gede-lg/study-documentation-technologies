# T2.01 - Throwable (Raiz da Hierarquia)

## Introdução

**Throwable** é a **classe raiz** de todas as exceções e erros em Java.

```java
/*
 * HIERARQUIA COMPLETA
 * 
 *                    Object
 *                      |
 *                  Throwable ← RAIZ
 *                      |
 *          ┌───────────┴───────────┐
 *          |                       |
 *        Error                 Exception
 */

// ✅ Tudo que pode ser lançado/capturado é Throwable
throw new Exception("Exceção");        // ✅ Exception extends Throwable
throw new RuntimeException("Runtime"); // ✅ RuntimeException extends Exception
throw new Error("Erro");               // ✅ Error extends Throwable
throw new IOException("I/O");          // ✅ IOException extends Exception

// ❌ NÃO pode lançar qualquer classe
// throw new String("texto");  // ❌ ERRO: String não é Throwable
// throw new Integer(10);      // ❌ ERRO: Integer não é Throwable
```

**Somente** subclasses de **Throwable** podem ser lançadas (`throw`) ou capturadas (`catch`).

---

## Fundamentos

### 1. Classe Throwable: Estrutura Básica

```java
// ✅ Estrutura da classe Throwable (simplificada)
public class Throwable {
    private String message;        // Mensagem do erro
    private Throwable cause;       // Causa raiz
    private StackTraceElement[] stackTrace;  // Pilha de chamadas
    
    // Construtores
    public Throwable() { }
    public Throwable(String message) { }
    public Throwable(String message, Throwable cause) { }
    public Throwable(Throwable cause) { }
    
    // Métodos principais
    public String getMessage() { }
    public Throwable getCause() { }
    public StackTraceElement[] getStackTrace() { }
    public void printStackTrace() { }
    public String toString() { }
}

// ✅ Usar Throwable diretamente (raro)
public class ExemploThrowable {
    public static void main(String[] args) {
        // Criar Throwable
        Throwable t = new Throwable("Erro genérico");
        
        System.out.println("Mensagem: " + t.getMessage());
        System.out.println("toString: " + t.toString());
        System.out.println("\nStack Trace:");
        t.printStackTrace();
    }
}

/* Saída:
Mensagem: Erro genérico
toString: java.lang.Throwable: Erro genérico

Stack Trace:
java.lang.Throwable: Erro genérico
    at ExemploThrowable.main(ExemploThrowable.java:5)
*/
```

**Throwable** fornece **estrutura básica** para exceções e erros.

### 2. Dois Filhos Diretos: Error e Exception

```java
// ✅ Throwable tem APENAS 2 subclasses diretas
public class DoisFilhos {
    
    /*
     * Throwable
     *    ├── Error
     *    └── Exception
     */
    
    public static void main(String[] args) {
        // 1. ERROR
        Throwable erro = new OutOfMemoryError("Sem memória");
        System.out.println("OutOfMemoryError instanceof Error: " + 
                         (erro instanceof Error));      // true
        System.out.println("OutOfMemoryError instanceof Throwable: " + 
                         (erro instanceof Throwable));  // true
        
        // 2. EXCEPTION
        Throwable excecao = new IOException("I/O erro");
        System.out.println("\nIOException instanceof Exception: " + 
                         (excecao instanceof Exception));  // true
        System.out.println("IOException instanceof Throwable: " + 
                         (excecao instanceof Throwable));  // true
        
        // Ambos são Throwable
        processar(erro);
        processar(excecao);
    }
    
    // Método que aceita qualquer Throwable
    public static void processar(Throwable t) {
        System.out.println("\nProcessando: " + t.getClass().getSimpleName());
        System.out.println("Mensagem: " + t.getMessage());
    }
}
```

**Error** e **Exception** são os **únicos** filhos diretos de Throwable.

### 3. Métodos Principais de Throwable

```java
// ✅ Métodos importantes herdados por TODAS exceções/erros
public class MetodosThrowable {
    
    public static void main(String[] args) {
        try {
            metodoA();
        } catch (Exception e) {
            // 1. getMessage(): mensagem descritiva
            System.out.println("1. getMessage():");
            System.out.println("   " + e.getMessage());
            
            // 2. toString(): tipo + mensagem
            System.out.println("\n2. toString():");
            System.out.println("   " + e.toString());
            
            // 3. getCause(): exceção que causou esta
            System.out.println("\n3. getCause():");
            System.out.println("   " + e.getCause());
            
            // 4. getStackTrace(): array de elementos da pilha
            System.out.println("\n4. getStackTrace():");
            StackTraceElement[] stack = e.getStackTrace();
            for (StackTraceElement element : stack) {
                System.out.println("   " + element);
            }
            
            // 5. printStackTrace(): imprime stack completo
            System.out.println("\n5. printStackTrace():");
            e.printStackTrace();
            
            // 6. getClass(): tipo da exceção
            System.out.println("\n6. getClass():");
            System.out.println("   " + e.getClass());
            System.out.println("   " + e.getClass().getName());
            System.out.println("   " + e.getClass().getSimpleName());
            
            // 7. getLocalizedMessage(): mensagem localizada
            System.out.println("\n7. getLocalizedMessage():");
            System.out.println("   " + e.getLocalizedMessage());
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

**Todos** os métodos de Throwable são **herdados** por exceções e erros.

### 4. Construtores de Throwable

```java
// ✅ 4 construtores principais
public class ConstrutoresThrowable {
    
    public static void main(String[] args) {
        // 1. Construtor SEM argumentos
        Throwable t1 = new Throwable();
        System.out.println("1. Sem argumentos:");
        System.out.println("   Mensagem: " + t1.getMessage());  // null
        
        // 2. Construtor com MENSAGEM
        Throwable t2 = new Throwable("Mensagem de erro");
        System.out.println("\n2. Com mensagem:");
        System.out.println("   Mensagem: " + t2.getMessage());
        
        // 3. Construtor com MENSAGEM e CAUSA
        IOException causa = new IOException("Causa original");
        Throwable t3 = new Throwable("Erro encapsulado", causa);
        System.out.println("\n3. Com mensagem e causa:");
        System.out.println("   Mensagem: " + t3.getMessage());
        System.out.println("   Causa: " + t3.getCause());
        System.out.println("   Mensagem causa: " + t3.getCause().getMessage());
        
        // 4. Construtor com CAUSA apenas
        Throwable t4 = new Throwable(causa);
        System.out.println("\n4. Com causa apenas:");
        System.out.println("   Mensagem: " + t4.getMessage());  // toString() da causa
        System.out.println("   Causa: " + t4.getCause());
    }
}

/* Saída:
1. Sem argumentos:
   Mensagem: null

2. Com mensagem:
   Mensagem: Mensagem de erro

3. Com mensagem e causa:
   Mensagem: Erro encapsulado
   Causa: java.io.IOException: Causa original
   Mensagem causa: Causa original

4. Com causa apenas:
   Mensagem: java.io.IOException: Causa original
   Causa: java.io.IOException: Causa original
*/
```

**Construtores** permitem criar exceções com mensagem e/ou causa.

### 5. Lançar e Capturar Throwable

```java
// ✅ Lançar e capturar Throwable
public class LancarCapturarThrowable {
    
    // Lançar Throwable genérico (raro)
    public static void lancarThrowable() throws Throwable {
        throw new Throwable("Erro genérico");
    }
    
    // Capturar Throwable (captura TUDO)
    public static void capturarThrowable() {
        try {
            lancarThrowable();
        } catch (Throwable t) {  // Captura Error + Exception
            System.out.println("Capturou Throwable: " + t.getMessage());
        }
    }
    
    // ⚠️ Capturar Throwable captura Error também
    public static void capturaTudo() {
        try {
            // Pode lançar Error ou Exception
            if (Math.random() > 0.5) {
                throw new OutOfMemoryError("Sem memória");
            } else {
                throw new IOException("I/O erro");
            }
        } catch (Throwable t) {
            // ⚠️ Captura AMBOS (Error e Exception)
            System.out.println("Capturou: " + t.getClass().getSimpleName());
        }
    }
    
    public static void main(String[] args) {
        capturarThrowable();
        capturaTudo();
    }
}
```

**Capturar Throwable** = captura **Error** + **Exception** (geralmente não recomendado).

### 6. Throwable e Polimorfismo

```java
// ✅ Polimorfismo: tratar diferentes tipos como Throwable
public class PolimorfismoThrowable {
    
    // Método genérico que aceita qualquer Throwable
    public static void processar(Throwable t) {
        System.out.println("=== Processando Throwable ===");
        System.out.println("Tipo: " + t.getClass().getName());
        System.out.println("Tipo simples: " + t.getClass().getSimpleName());
        System.out.println("Mensagem: " + t.getMessage());
        
        // Identificar tipo específico
        if (t instanceof Error) {
            System.out.println("⚠️ É um Error (grave)");
        } else if (t instanceof RuntimeException) {
            System.out.println("⚠️ É RuntimeException (unchecked)");
        } else if (t instanceof Exception) {
            System.out.println("✅ É Exception checked");
        }
        
        System.out.println();
    }
    
    public static void main(String[] args) {
        // Processar diferentes tipos
        processar(new OutOfMemoryError("Sem memória"));
        processar(new NullPointerException("Null pointer"));
        processar(new IOException("I/O error"));
        processar(new SQLException("SQL error"));
    }
}

/* Saída:
=== Processando Throwable ===
Tipo: java.lang.OutOfMemoryError
Tipo simples: OutOfMemoryError
Mensagem: Sem memória
⚠️ É um Error (grave)

=== Processando Throwable ===
Tipo: java.lang.NullPointerException
Tipo simples: NullPointerException
Mensagem: Null pointer
⚠️ É RuntimeException (unchecked)

=== Processando Throwable ===
Tipo: java.io.IOException
Tipo simples: IOException
Mensagem: I/O error
✅ É Exception checked

=== Processando Throwable ===
Tipo: java.sql.SQLException
Tipo simples: SQLException
Mensagem: SQL error
✅ É Exception checked
*/
```

**Polimorfismo** permite **unificar** tratamento de diferentes tipos.

### 7. Chaining de Exceções (Causa)

```java
// ✅ Encadear exceções preservando causa original
public class ChainingExcecoes {
    
    public static void operacaoBaixoNivel() throws IOException {
        throw new IOException("Erro ao ler arquivo");
    }
    
    public static void operacaoMedioNivel() throws Exception {
        try {
            operacaoBaixoNivel();
        } catch (IOException e) {
            // ✅ Encadear: nova exceção com causa
            throw new Exception("Erro ao processar dados", e);
        }
    }
    
    public static void operacaoAltoNivel() throws RuntimeException {
        try {
            operacaoMedioNivel();
        } catch (Exception e) {
            // ✅ Encadear novamente
            throw new RuntimeException("Erro na operação", e);
        }
    }
    
    public static void main(String[] args) {
        try {
            operacaoAltoNivel();
        } catch (RuntimeException e) {
            System.out.println("Exceção capturada:");
            System.out.println("Mensagem: " + e.getMessage());
            System.out.println("Causa: " + e.getCause());
            System.out.println("Causa da causa: " + e.getCause().getCause());
            
            System.out.println("\nStack trace completo:");
            e.printStackTrace();
        }
    }
}

/* Saída:
Exceção capturada:
Mensagem: Erro na operação
Causa: java.lang.Exception: Erro ao processar dados
Causa da causa: java.io.IOException: Erro ao ler arquivo

Stack trace completo:
java.lang.RuntimeException: Erro na operação
    at ChainingExcecoes.operacaoAltoNivel(...)
    at ChainingExcecoes.main(...)
Caused by: java.lang.Exception: Erro ao processar dados
    at ChainingExcecoes.operacaoMedioNivel(...)
    at ChainingExcecoes.operacaoAltoNivel(...)
    ... 1 more
Caused by: java.io.IOException: Erro ao ler arquivo
    at ChainingExcecoes.operacaoBaixoNivel(...)
    at ChainingExcecoes.operacaoMedioNivel(...)
    ... 2 more
*/
```

**Chaining** preserva **histórico completo** da exceção.

### 8. StackTraceElement: Detalhes da Pilha

```java
// ✅ Analisar elementos do stack trace
public class StackTraceDetalhes {
    
    public static void main(String[] args) {
        try {
            metodoA();
        } catch (Exception e) {
            System.out.println("=== Análise do Stack Trace ===\n");
            
            StackTraceElement[] stack = e.getStackTrace();
            
            for (int i = 0; i < stack.length; i++) {
                StackTraceElement element = stack[i];
                
                System.out.println("Elemento " + i + ":");
                System.out.println("  Classe: " + element.getClassName());
                System.out.println("  Método: " + element.getMethodName());
                System.out.println("  Arquivo: " + element.getFileName());
                System.out.println("  Linha: " + element.getLineNumber());
                System.out.println("  toString: " + element.toString());
                System.out.println();
            }
        }
    }
    
    public static void metodoA() throws Exception {
        metodoB();
    }
    
    public static void metodoB() throws Exception {
        metodoC();
    }
    
    public static void metodoC() throws Exception {
        throw new Exception("Erro aqui");
    }
}

/* Saída:
=== Análise do Stack Trace ===

Elemento 0:
  Classe: StackTraceDetalhes
  Método: metodoC
  Arquivo: StackTraceDetalhes.java
  Linha: 25
  toString: StackTraceDetalhes.metodoC(StackTraceDetalhes.java:25)

Elemento 1:
  Classe: StackTraceDetalhes
  Método: metodoB
  Arquivo: StackTraceDetalhes.java:21
  toString: StackTraceDetalhes.metodoB(StackTraceDetalhes.java:21)

Elemento 2:
  Classe: StackTraceDetalhes
  Método: metodoA
  Arquivo: StackTraceDetalhes.java:17
  toString: StackTraceDetalhes.metodoA(StackTraceDetalhes.java:17)

Elemento 3:
  Classe: StackTraceDetalhes
  Método: main
  Arquivo: StackTraceDetalhes.java:6
  toString: StackTraceDetalhes.main(StackTraceDetalhes.java:6)
*/
```

**StackTraceElement** contém **detalhes** de cada chamada.

### 9. Métodos Adicionais de Throwable

```java
// ✅ Outros métodos úteis
public class MetodosAdicionais {
    
    public static void main(String[] args) {
        try {
            metodoComCausa();
        } catch (Exception e) {
            // 1. initCause(): definir causa posteriormente
            Throwable novaCausa = new IOException("Nova causa");
            // e.initCause(novaCausa);  // Só se causa ainda não definida
            
            // 2. getSuppressed(): exceções suprimidas (try-with-resources)
            System.out.println("Exceções suprimidas: " + 
                             e.getSuppressed().length);
            
            // 3. addSuppressed(): adicionar exceção suprimida
            e.addSuppressed(new RuntimeException("Suprimida"));
            System.out.println("Após adicionar: " + 
                             e.getSuppressed().length);
            
            // 4. setStackTrace(): modificar stack trace (raro)
            StackTraceElement[] novoStack = new StackTraceElement[1];
            novoStack[0] = new StackTraceElement("MinhaClasse", "meuMetodo", 
                                                 "MeuArquivo.java", 42);
            e.setStackTrace(novoStack);
            
            // 5. fillInStackTrace(): recriar stack trace do ponto atual
            e.fillInStackTrace();
            
            System.out.println("\nStack trace modificado:");
            e.printStackTrace();
        }
    }
    
    public static void metodoComCausa() throws Exception {
        try {
            throw new IOException("Causa");
        } catch (IOException e) {
            throw new Exception("Exceção principal", e);
        }
    }
}
```

**Throwable** tem métodos para **manipular** stack trace e causas.

### 10. Throwable: Resumo Visual

```java
/*
 * THROWABLE - RAIZ DA HIERARQUIA
 * 
 *                    Object
 *                      |
 *                  Throwable ← RAIZ
 *                      |
 *          ┌───────────┴───────────┐
 *          |                       |
 *        Error                 Exception
 *          |                       |
 *   OutOfMemoryError      ┌────────┴────────┐
 *   StackOverflowError    |                 |
 *          ...       RuntimeException   IOException
 *                          |            SQLException
 *                   NullPointerException   ...
 *                   ArithmeticException
 *                          ...
 * 
 * CARACTERÍSTICAS:
 *   - Classe RAIZ de todas exceções/erros
 *   - Somente Throwable pode ser lançado/capturado
 *   - 2 filhos diretos: Error e Exception
 *   - Fornece métodos para todas exceções
 * 
 * MÉTODOS PRINCIPAIS:
 *   - getMessage(): mensagem descritiva
 *   - getCause(): causa raiz
 *   - getStackTrace(): pilha de chamadas
 *   - printStackTrace(): imprime stack
 *   - toString(): tipo + mensagem
 * 
 * CONSTRUTORES:
 *   - Throwable()
 *   - Throwable(String message)
 *   - Throwable(String message, Throwable cause)
 *   - Throwable(Throwable cause)
 */

public class ResumoThrowable {
    public static void main(String[] args) {
        // ✅ Throwable é a raiz
        Throwable t = new Exception("Teste");
        
        System.out.println("instanceof Throwable: " + (t instanceof Throwable));  // true
        System.out.println("instanceof Object: " + (t instanceof Object));        // true
        System.out.println("instanceof Exception: " + (t instanceof Exception));  // true
    }
}
```

---

## Aplicabilidade

**Throwable** é usado para:
- **Raiz** de todas exceções/erros
- **Polimorfismo**: tratar diferentes tipos uniformemente
- **Métodos comuns**: `getMessage()`, `printStackTrace()`, etc.
- **Chaining**: preservar exceção original (`cause`)

---

## Armadilhas

### 1. Capturar Throwable Diretamente

```java
// ⚠️ Captura Error também
try {
    // ...
} catch (Throwable t) {  // ⚠️ Captura Error
    // ...
}

// ✅ Capturar Exception
try {
    // ...
} catch (Exception e) {  // ✅ Não captura Error
    // ...
}
```

### 2. Lançar Throwable Genérico

```java
// ⚠️ Muito genérico
throw new Throwable("Erro");

// ✅ Usar tipo específico
throw new Exception("Erro");
throw new IllegalArgumentException("Erro");
```

### 3. Não Preservar Causa

```java
// ❌ Perde exceção original
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

### 1. Não Capturar Throwable

```java
// ⚠️ Evitar
catch (Throwable t) { }

// ✅ Preferir Exception
catch (Exception e) { }
```

### 2. Preservar Causa em Chaining

```java
// ✅ Sempre preservar causa
throw new Exception("Mensagem", causaOriginal);
```

### 3. Usar Tipos Específicos

```java
// ✅ Específico
throw new FileNotFoundException("arquivo.txt");
throw new IllegalArgumentException("idade negativa");

// ⚠️ Genérico
throw new Exception("erro");
```

---

## Resumo

**Throwable** = **raiz** de todas exceções e erros.

**Estrutura**:
```
Object → Throwable → Error / Exception
```

**Filhos diretos**:
- **Error**: erros graves do sistema
- **Exception**: exceções recuperáveis

**Métodos principais**:
- `getMessage()`: mensagem descritiva
- `getCause()`: causa raiz
- `getStackTrace()`: pilha de chamadas
- `printStackTrace()`: imprime stack completo
- `toString()`: tipo + mensagem

**Construtores**:
- `Throwable()`
- `Throwable(String message)`
- `Throwable(String message, Throwable cause)`
- `Throwable(Throwable cause)`

**Características**:
- **Somente** Throwable pode ser lançado/capturado
- Fornece **estrutura básica** para exceções
- Permite **polimorfismo** (tratar diferentes tipos)
- Suporta **chaining** (causa)

**Regra de Ouro**: **Throwable** é a **raiz**. **Não** capturar Throwable diretamente (captura Error). **Preservar** causa em chaining. Usar **tipos específicos** (Exception, RuntimeException) ao invés de Throwable genérico.
