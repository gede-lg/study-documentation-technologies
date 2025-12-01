# T2.02 - Error: Erros Graves do Sistema

## Introdução

**Error** representa problemas **graves** do **sistema** (JVM) que aplicação **não deve** tratar.

```java
/*
 * HIERARQUIA ERROR
 * 
 *                  Throwable
 *                      |
 *          ┌───────────┴───────────┐
 *          |                       |
 *        Error ← ERROS GRAVES     Exception
 *          |
 *     ┌────┴────┬─────────┬──────────┬────────┐
 *     |         |         |          |        |
 * OutOfMemory Stack   Virtual   Linkage  Assertion
 *   Error    Overflow  Machine    Error    Error
 *            Error     Error
 */

// ❌ ERROR: JVM comprometida (NÃO tratar)
public static void causarError() {
    causarError();  // Recursão infinita
}  // StackOverflowError → programa DEVE encerrar

// ✅ EXCEPTION: problema recuperável (TRATAR)
public static void causarException() {
    throw new IllegalArgumentException("Argumento inválido");
}  // IllegalArgumentException → pode tratar e continuar
```

**Error** = sistema **quebrou**. Aplicação **não controla**.

---

## Fundamentos

### 1. Classe Error: Estrutura

```java
// ✅ Hierarquia da classe Error
public abstract class Error extends Throwable {
    // Construtores (mesmos de Throwable)
    public Error() { }
    public Error(String message) { }
    public Error(String message, Throwable cause) { }
    public Error(Throwable cause) { }
}

// ✅ Error é abstrato, usar subclasses
public class ExemploError {
    public static void main(String[] args) {
        // Verificar herança
        Error erro = new OutOfMemoryError("Sem memória");
        
        System.out.println("instanceof Error: " + (erro instanceof Error));          // true
        System.out.println("instanceof Throwable: " + (erro instanceof Throwable));  // true
        System.out.println("instanceof Exception: " + (erro instanceof Exception));  // false
        
        // Error NÃO é Exception
        System.out.println("\nError extends Throwable: true");
        System.out.println("Error extends Exception: false");
    }
}
```

**Error** estende **Throwable** diretamente (não é Exception).

### 2. OutOfMemoryError: Sem Memória

```java
// ❌ OutOfMemoryError: JVM sem memória
public class OutOfMemoryErrorExemplo {
    
    // Consumir memória até esgotar
    public static void consumirMemoria() {
        List<byte[]> lista = new ArrayList<>();
        
        System.out.println("Consumindo memória...");
        int iteracao = 0;
        
        while (true) {
            // Alocar 10 MB por vez
            lista.add(new byte[1024 * 1024 * 10]);
            iteracao++;
            
            if (iteracao % 10 == 0) {
                System.out.println("Iteração " + iteracao + 
                                 ", tamanho lista: " + lista.size());
            }
        }
        
        // ❌ OutOfMemoryError: Java heap space
        // JVM não consegue alocar mais memória
    }
    
    public static void main(String[] args) {
        // ⚠️ DESCOMENTAR QUEBRA O PROGRAMA
        // consumirMemoria();
        
        System.out.println("=== OutOfMemoryError ===");
        System.out.println("Causa: JVM sem memória heap");
        System.out.println("Ação: NÃO tratar (JVM comprometida)");
        System.out.println("Solução: Aumentar heap (-Xmx), otimizar código");
    }
}

/* Se executar consumirMemoria():
Consumindo memória...
Iteração 10, tamanho lista: 10
Iteração 20, tamanho lista: 20
...
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
    at OutOfMemoryErrorExemplo.consumirMemoria(...)
    at OutOfMemoryErrorExemplo.main(...)
*/
```

**OutOfMemoryError** = JVM **sem memória**. Programa deve **encerrar**.

### 3. StackOverflowError: Pilha Cheia

```java
// ❌ StackOverflowError: pilha de chamadas esgotada
public class StackOverflowErrorExemplo {
    
    // Recursão infinita
    public static void recursaoInfinita() {
        recursaoInfinita();  // Chama a si mesmo infinitamente
    }
    
    // Recursão profunda
    public static int fatorial(int n) {
        if (n <= 1) return 1;
        return n * fatorial(n - 1);
    }
    
    public static void main(String[] args) {
        // ⚠️ DESCOMENTAR QUEBRA O PROGRAMA
        // recursaoInfinita();
        
        // Fatorial muito grande
        try {
            int resultado = fatorial(1000000);  // Muito profundo
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError capturado");
            System.out.println("Mensagem: " + e.getMessage());
            // ⚠️ Pilha pode estar muito cheia para continuar
        }
        
        System.out.println("\n=== StackOverflowError ===");
        System.out.println("Causa: Pilha de chamadas cheia");
        System.out.println("Comum em: recursão infinita, recursão muito profunda");
        System.out.println("Ação: NÃO tratar (corrigir lógica)");
        System.out.println("Solução: Aumentar stack (-Xss), usar iteração");
    }
}

/* Se executar recursaoInfinita():
Exception in thread "main" java.lang.StackOverflowError
    at StackOverflowErrorExemplo.recursaoInfinita(...)
    at StackOverflowErrorExemplo.recursaoInfinita(...)
    at StackOverflowErrorExemplo.recursaoInfinita(...)
    ... (milhares de linhas repetidas)
*/
```

**StackOverflowError** = **pilha cheia** (recursão infinita/profunda).

### 4. VirtualMachineError: JVM Quebrou

```java
// ❌ VirtualMachineError: problema interno da JVM
public class VirtualMachineErrorExemplo {
    
    /*
     * VirtualMachineError (abstrato)
     *   ├── InternalError: erro interno da JVM
     *   ├── OutOfMemoryError: sem memória
     *   ├── StackOverflowError: pilha cheia
     *   └── UnknownError: erro desconhecido
     */
    
    public static void main(String[] args) {
        System.out.println("=== VirtualMachineError ===");
        System.out.println("Tipo: Abstrato (use subclasses)");
        System.out.println("Indica: Problema GRAVE da JVM");
        System.out.println("Subclasses:");
        System.out.println("  - OutOfMemoryError");
        System.out.println("  - StackOverflowError");
        System.out.println("  - InternalError");
        System.out.println("  - UnknownError");
        
        // Verificar hierarquia
        Error erro1 = new OutOfMemoryError();
        Error erro2 = new StackOverflowError();
        
        System.out.println("\nOutOfMemoryError instanceof VirtualMachineError: " + 
                         (erro1 instanceof VirtualMachineError));  // true
        System.out.println("StackOverflowError instanceof VirtualMachineError: " + 
                         (erro2 instanceof VirtualMachineError));  // true
    }
}
```

**VirtualMachineError** = problema **interno** da JVM.

### 5. LinkageError: Problema ao Carregar Classes

```java
// ❌ LinkageError: erro ao vincular classes
public class LinkageErrorExemplo {
    
    /*
     * LinkageError
     *   ├── NoClassDefFoundError: classe não encontrada em runtime
     *   ├── ClassFormatError: formato de classe inválido
     *   ├── VerifyError: verificação de bytecode falhou
     *   ├── UnsatisfiedLinkError: biblioteca nativa não encontrada
     *   ├── IncompatibleClassChangeError: classe mudou
     *   └── ExceptionInInitializerError: erro em inicializador estático
     */
    
    public static void main(String[] args) {
        System.out.println("=== LinkageError ===");
        System.out.println("Causa: Problema ao carregar/vincular classes");
        System.out.println("Subclasses:");
        System.out.println("  - NoClassDefFoundError: classe não encontrada");
        System.out.println("  - ClassFormatError: bytecode inválido");
        System.out.println("  - VerifyError: verificação falhou");
        System.out.println("  - UnsatisfiedLinkError: lib nativa ausente");
        System.out.println("  - IncompatibleClassChangeError: classe mudou");
        System.out.println("  - ExceptionInInitializerError: erro em static");
    }
}

// ❌ Exemplo NoClassDefFoundError
class ClasseComDependencia {
    public static void main(String[] args) {
        // Se DependenciaExterna.class não estiver no classpath:
        // NoClassDefFoundError: DependenciaExterna
        DependenciaExterna obj = new DependenciaExterna();
    }
}
```

**LinkageError** = problema ao **carregar** ou **vincular** classes.

### 6. AssertionError: Assertion Falhou

```java
// ✅ AssertionError: usado em TESTES
public class AssertionErrorExemplo {
    
    public static void validarIdade(int idade) {
        // Assertion: verificação de desenvolvimento
        assert idade >= 0 : "Idade não pode ser negativa";
        assert idade <= 150 : "Idade muito alta";
        
        System.out.println("Idade válida: " + idade);
    }
    
    public static void main(String[] args) {
        System.out.println("=== AssertionError ===");
        System.out.println("Uso: Validações de DESENVOLVIMENTO");
        System.out.println("Estado: Desabilitado por padrão");
        System.out.println("Habilitar: java -ea NomeClasse");
        
        // ✅ Assertions DESABILITADAS (padrão)
        validarIdade(-5);  // Não lança erro
        System.out.println("Validou -5 (assertions desabilitadas)");
        
        // ⚠️ Para habilitar: java -ea AssertionErrorExemplo
        // AssertionError será lançado se idade < 0
        
        System.out.println("\n⚠️ NÃO usar assertions em PRODUÇÃO");
        System.out.println("✅ Usar exceptions para validação de produção");
    }
    
    // ✅ PRODUÇÃO: usar Exception
    public static void validarIdadeProducao(int idade) {
        if (idade < 0) {
            throw new IllegalArgumentException("Idade negativa: " + idade);
        }
        if (idade > 150) {
            throw new IllegalArgumentException("Idade muito alta: " + idade);
        }
    }
}
```

**AssertionError** = erro de **teste** (desabilitado em produção).

### 7. Por Que NÃO Capturar Error?

```java
// ⚠️ Por que NÃO capturar Error?
public class PorQueNaoCapturar {
    
    // ❌ EXEMPLO 1: OutOfMemoryError
    public static void capturarOOM() {
        try {
            List<int[]> lista = new ArrayList<>();
            while (true) {
                lista.add(new int[1000000]);  // Consome memória
            }
        } catch (OutOfMemoryError e) {
            // ⚠️ JVM está SEM MEMÓRIA
            System.out.println("Capturou OutOfMemoryError");
            
            // ❌ Estado INCONSISTENTE
            // - Outros objetos podem estar corrompidos
            // - Garbage Collector pode não funcionar
            // - Novas alocações podem falhar
            
            // ❌ Tentar continuar pode PIORAR
            String texto = "teste";  // Pode falhar
            List<Integer> nova = new ArrayList<>();  // Pode falhar
            
            // ✅ CORRETO: logar e ENCERRAR
            System.err.println("ERRO CRÍTICO: Sem memória!");
            e.printStackTrace();
            System.exit(1);
        }
    }
    
    // ❌ EXEMPLO 2: StackOverflowError
    public static void capturarStackOverflow() {
        try {
            recursao();
        } catch (StackOverflowError e) {
            // ⚠️ Pilha está CHEIA
            System.out.println("Capturou StackOverflowError");
            
            // ❌ Chamar método pode FALHAR novamente
            processar();  // Pode causar NOVO StackOverflowError
            
            // ✅ CORRETO: logar e ENCERRAR
            System.err.println("ERRO: Stack overflow!");
            System.exit(1);
        }
    }
    
    private static void recursao() {
        recursao();
    }
    
    private static void processar() {
        // Qualquer método usa pilha
    }
    
    // ✅ O CORRETO: deixar Error propagar
    public static void deixarPropagar() {
        // Não captura Error
        // JVM encerra de forma controlada
        // Recursos são liberados pelo OS
        List<int[]> lista = new ArrayList<>();
        while (true) {
            lista.add(new int[1000000]);
        }
        // OutOfMemoryError → programa encerra
    }
}
```

**Capturar Error** = JVM **comprometida**. Continuar pode **piorar**.

### 8. Casos Raros: Quando Capturar Error

```java
// ⚠️ Raros casos onde capturar Error pode fazer sentido
public class RarosCapturarError {
    
    // ✅ CASO 1: Logar erro crítico antes de encerrar
    public static void logarCritico() {
        try {
            operacaoPerigosa();
        } catch (OutOfMemoryError e) {
            // ✅ Logar erro
            System.err.println("ERRO CRÍTICO: Sem memória!");
            e.printStackTrace();
            
            // ✅ Notificar administradores
            notificarAdmin("Aplicação sem memória", e);
            
            // ✅ Salvar estado crítico se possível
            salvarEstadoEmergencia();
            
            // ✅ ENCERRAR programa
            System.exit(1);
        }
    }
    
    // ✅ CASO 2: Servidores/Frameworks (isolar requests)
    public static void isolamentoServidor() {
        // Servidor pode capturar Error de UMA request
        // para não derrubar TODAS as requests
        try {
            processarRequest();
        } catch (Error e) {
            // ✅ Logar
            System.err.println("Error na request: " + e);
            
            // ✅ Responder erro 500
            enviarErro500();
            
            // Request falha, mas servidor continua
            // (JVM pode estar comprometida, mas tenta continuar)
        }
    }
    
    // ✅ CASO 3: Testes (AssertionError)
    public static void capturarAssertion() {
        try {
            assert false : "Teste falhou";
        } catch (AssertionError e) {
            // ✅ OK em testes
            System.out.println("Assertion falhou: " + e.getMessage());
        }
    }
    
    private static void operacaoPerigosa() { }
    private static void notificarAdmin(String msg, Throwable e) { }
    private static void salvarEstadoEmergencia() { }
    private static void processarRequest() { }
    private static void enviarErro500() { }
}
```

**Capturar Error** só em casos **muito específicos** (logging, servidores, testes).

### 9. Hierarquia Completa de Error

```java
/*
 * HIERARQUIA COMPLETA DE ERROR
 * 
 * Error (abstract)
 *   │
 *   ├── VirtualMachineError (abstract)
 *   │     ├── OutOfMemoryError ← Sem memória
 *   │     ├── StackOverflowError ← Pilha cheia
 *   │     ├── InternalError ← Erro interno JVM
 *   │     └── UnknownError ← Erro desconhecido
 *   │
 *   ├── LinkageError (abstract)
 *   │     ├── NoClassDefFoundError ← Classe não encontrada
 *   │     ├── ClassFormatError ← Bytecode inválido
 *   │     ├── VerifyError ← Verificação falhou
 *   │     ├── UnsatisfiedLinkError ← Lib nativa ausente
 *   │     ├── IncompatibleClassChangeError ← Classe mudou
 *   │     └── ExceptionInInitializerError ← Erro em static
 *   │
 *   ├── AssertionError ← Assertion falhou
 *   │
 *   ├── ThreadDeath ← Thread parada (deprecated)
 *   │
 *   └── IOError ← Erro I/O grave
 */

public class HierarquiaCompleta {
    public static void main(String[] args) {
        System.out.println("=== Hierarquia Error ===\n");
        
        System.out.println("VirtualMachineError:");
        System.out.println("  - OutOfMemoryError: JVM sem memória");
        System.out.println("  - StackOverflowError: pilha cheia");
        System.out.println("  - InternalError: erro interno JVM");
        
        System.out.println("\nLinkageError:");
        System.out.println("  - NoClassDefFoundError: classe não encontrada");
        System.out.println("  - ClassFormatError: bytecode inválido");
        System.out.println("  - VerifyError: verificação falhou");
        
        System.out.println("\nOutros:");
        System.out.println("  - AssertionError: assertion falhou");
        System.out.println("  - IOError: I/O grave");
    }
}
```

### 10. Error vs Exception: Comparação

```java
// ✅ Comparação final: Error vs Exception
public class ErrorVsException {
    
    public static void comparacao() {
        System.out.println("=== ERROR vs EXCEPTION ===\n");
        
        System.out.println("ERROR:");
        System.out.println("  - Origem: Sistema/JVM");
        System.out.println("  - Gravidade: GRAVE (irrecuperável)");
        System.out.println("  - Tratamento: NÃO tratar");
        System.out.println("  - Estado JVM: Comprometido");
        System.out.println("  - Ação: Deixar propagar (encerrar)");
        System.out.println("  - Exemplos: OutOfMemoryError, StackOverflowError");
        
        System.out.println("\nEXCEPTION:");
        System.out.println("  - Origem: Aplicação");
        System.out.println("  - Gravidade: Recuperável");
        System.out.println("  - Tratamento: DEVE tratar");
        System.out.println("  - Estado JVM: Normal");
        System.out.println("  - Ação: Capturar e tratar");
        System.out.println("  - Exemplos: IOException, SQLException");
    }
    
    public static void main(String[] args) {
        comparacao();
    }
}
```

---

## Aplicabilidade

**Error** indica:
- Problemas **graves** do sistema
- JVM **comprometida**
- Recursos **esgotados**
- Estado **inconsistente**

**Não** capturar (deixar programa encerrar).

---

## Armadilhas

### 1. Capturar Error

```java
// ❌ Não capturar
catch (OutOfMemoryError e) { }

// ✅ Deixar propagar
// Programa encerra
```

### 2. Tentar Continuar Após Error

```java
// ❌ Continuar após Error
catch (OutOfMemoryError e) {
    // Continuar... ❌ JVM comprometida
}

// ✅ Logar e encerrar
catch (OutOfMemoryError e) {
    logger.critical("OOM", e);
    System.exit(1);
}
```

### 3. Usar Assertions em Produção

```java
// ❌ Assertion em produção (desabilitado)
assert valor > 0;

// ✅ Exception em produção
if (valor <= 0) {
    throw new IllegalArgumentException("Valor inválido");
}
```

---

## Boas Práticas

### 1. Nunca Capturar Error

```java
// ❌ Não capturar
// JVM está comprometida

// ✅ Deixar propagar
// Programa encerra de forma controlada
```

### 2. Aumentar Recursos JVM

```java
// ✅ Prevenir OutOfMemoryError
// java -Xmx2g MinhaClasse  // 2 GB heap

// ✅ Prevenir StackOverflowError
// java -Xss2m MinhaClasse  // 2 MB stack
```

### 3. Usar Exceptions para Validação

```java
// ❌ Assertion (desabilitado produção)
assert idade >= 0;

// ✅ Exception (sempre ativa)
if (idade < 0) {
    throw new IllegalArgumentException("Idade negativa");
}
```

---

## Resumo

**Error** = problema **grave** do **sistema** (JVM).

**Subclasses principais**:
- **OutOfMemoryError**: JVM sem memória
- **StackOverflowError**: pilha cheia
- **VirtualMachineError**: JVM quebrou
- **LinkageError**: erro ao carregar classes
- **AssertionError**: assertion falhou (testes)

**Características**:
- **Origem**: Sistema/JVM
- **Gravidade**: GRAVE (irrecuperável)
- **Estado JVM**: Comprometido
- **Tratamento**: NÃO tratar
- **Ação**: Deixar propagar (encerrar)

**Por que não tratar**:
- JVM em estado **inconsistente**
- Continuar pode **piorar**
- Outros objetos podem estar **corrompidos**
- **Encerrar** é mais seguro

**Casos raros para capturar**:
- **Logar** erro crítico antes de encerrar
- **Servidores**: isolar request (não derrubar servidor)
- **Testes**: AssertionError

**Regra de Ouro**: **Error** = JVM **quebrou**. **NÃO** capturar. Deixar programa **encerrar**. Prevenir com **recursos adequados** (-Xmx, -Xss). Usar **Exception** para validações de produção (não assertions).
