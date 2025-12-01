# T4.02 - Captura de Exceções

## Introdução

**Capturar** exceção = bloco `catch` **intercepta** exceção lançada.

```java
/*
 * CAPTURA DE EXCEÇÕES
 * 
 * COMO FUNCIONA:
 *   1. Código no try lança exceção
 *   2. JVM procura catch compatível
 *   3. Catch captura exceção
 *   4. Executa código do catch
 *   5. Continua após try-catch
 * 
 * COMPATIBILIDADE:
 *   - Catch captura tipo EXATO
 *   - Catch captura SUBCLASSES
 *   - Catch NÃO captura superclasses
 */

// ✅ Captura tipo exato
try {
    throw new ArithmeticException("Divisão zero");
} catch (ArithmeticException e) {
    System.err.println("Capturado: " + e.getMessage());
}
```

**Capturar** = catch **intercepta** exceção lançada.

---

## Fundamentos

### 1. Processo de Captura

```java
// ✅ Como funciona a captura
public class ProcessoCaptura {
    
    public static void demonstrar() {
        System.out.println("1. Antes do try");
        
        try {
            System.out.println("2. Dentro do try");
            
            // 3. Exceção lançada
            int resultado = 10 / 0;  // ArithmeticException
            
            System.out.println("NÃO executa");
            
        } catch (ArithmeticException e) {
            // 4. Catch captura
            System.out.println("3. Catch capturou exceção");
            System.out.println("4. Tipo: " + e.getClass().getSimpleName());
            System.out.println("5. Mensagem: " + e.getMessage());
        }
        
        System.out.println("6. Depois do try-catch");
        
        /*
         * PROCESSO:
         * 
         * 1. Antes do try
         * 2. Dentro do try
         * 3. Exceção lançada (ArithmeticException)
         *    ↓
         * 4. JVM procura catch compatível
         *    ↓
         * 5. Catch ArithmeticException encontrado
         *    ↓
         * 6. Catch captura exceção
         *    ↓
         * 7. Executa código do catch
         *    ↓
         * 8. Continua após try-catch
         */
    }
}
```

**Processo**: lança → JVM procura → catch captura → executa → continua.

### 2. Captura por Tipo Exato

```java
// ✅ Captura tipo exato
public class CapturaTipoExato {
    
    public static void exemplo1() {
        try {
            throw new NullPointerException("Objeto null");
            
        } catch (NullPointerException e) {
            // ✅ Captura NullPointerException (tipo exato)
            System.out.println("Capturado: NullPointerException");
            System.out.println("Mensagem: " + e.getMessage());
        }
    }
    
    public static void exemplo2() {
        try {
            throw new FileNotFoundException("Arquivo não existe");
            
        } catch (FileNotFoundException e) {
            // ✅ Captura FileNotFoundException (tipo exato)
            System.out.println("Capturado: FileNotFoundException");
            System.out.println("Arquivo: " + e.getMessage());
        }
    }
    
    public static void exemplo3() {
        try {
            int[] array = {1, 2, 3};
            int valor = array[10];  // ArrayIndexOutOfBoundsException
            
        } catch (ArrayIndexOutOfBoundsException e) {
            // ✅ Captura ArrayIndexOutOfBounds (tipo exato)
            System.out.println("Capturado: ArrayIndexOutOfBoundsException");
            System.out.println("Índice: " + e.getMessage());
        }
    }
}
```

**Tipo exato**: catch captura **exatamente** o tipo especificado.

### 3. Captura por Superclasse

```java
// ✅ Captura por superclasse (polimorfismo)
public class CapturaSuperclasse {
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   └── IOException
     *         └── FileNotFoundException
     */
    
    // ✅ Lançar FileNotFoundException, capturar IOException
    public static void exemplo1() {
        try {
            throw new FileNotFoundException("Arquivo não existe");
            
        } catch (IOException e) {
            // ✅ Captura FileNotFoundException (subclasse de IOException)
            System.out.println("Capturado: " + e.getClass().getSimpleName());
            // Saída: FileNotFoundException
            
            System.out.println("Mensagem: " + e.getMessage());
        }
    }
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   └── RuntimeException
     *         ├── ArithmeticException
     *         ├── NullPointerException
     *         └── IndexOutOfBoundsException
     *               └── ArrayIndexOutOfBoundsException
     */
    
    // ✅ Lançar ArithmeticException, capturar RuntimeException
    public static void exemplo2() {
        try {
            int resultado = 10 / 0;  // ArithmeticException
            
        } catch (RuntimeException e) {
            // ✅ Captura ArithmeticException (subclasse de RuntimeException)
            System.out.println("Capturado: " + e.getClass().getSimpleName());
            // Saída: ArithmeticException
        }
    }
    
    // ✅ Lançar qualquer exceção, capturar Exception
    public static void exemplo3() {
        try {
            throw new SQLException("Erro no banco");
            
        } catch (Exception e) {
            // ✅ Captura QUALQUER exceção (todas são subclasse de Exception)
            System.out.println("Capturado: " + e.getClass().getSimpleName());
            // Saída: SQLException
        }
    }
}
```

**Superclasse**: catch captura tipo **e subclasses** (polimorfismo).

### 4. Catch NÃO Captura Superclasse da Lançada

```java
// ❌ Catch NÃO captura superclasse da exceção lançada
public class CatchNaoCapturaSuperclasse {
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   └── IOException
     *         └── FileNotFoundException
     */
    
    // ❌ Lançar IOException, tentar capturar FileNotFoundException
    public static void exemplo1() {
        try {
            throw new IOException("Erro I/O");
            
        } catch (FileNotFoundException e) {
            // ❌ NÃO captura IOException (FileNotFound é SUBCLASSE)
            System.out.println("NÃO executa");
        }
        
        // IOException NÃO é capturada
        // Exceção PROPAGA (programa quebra)
        
        /*
         * REGRA:
         *   - Catch captura tipo E SUBCLASSES
         *   - Catch NÃO captura SUPERCLASSES
         * 
         * FileNotFoundException é subclasse de IOException
         * IOException NÃO é subclasse de FileNotFoundException
         * Logo: catch FileNotFound NÃO captura IOException
         */
    }
    
    // ❌ Lançar Exception, tentar capturar ArithmeticException
    public static void exemplo2() {
        try {
            throw new Exception("Exceção genérica");
            
        } catch (ArithmeticException e) {
            // ❌ NÃO captura Exception genérica
            System.out.println("NÃO executa");
        }
        
        // Exception genérica NÃO é ArithmeticException
        // Exceção PROPAGA
    }
}
```

**Não captura**: catch **não** captura superclasse da lançada.

### 5. Objeto da Exceção Capturada

```java
// ✅ Trabalhar com objeto exceção capturada
public class ObjetoExcecao {
    
    public static void demonstrar() {
        try {
            int[] array = new int[3];
            int valor = array[10];  // ArrayIndexOutOfBoundsException
            
        } catch (ArrayIndexOutOfBoundsException e) {
            // ✅ Variável 'e' contém objeto da exceção
            
            // 1. Mensagem da exceção
            String mensagem = e.getMessage();
            System.out.println("Mensagem: " + mensagem);
            // "Index 10 out of bounds for length 3"
            
            // 2. Classe da exceção
            Class<?> classe = e.getClass();
            System.out.println("Classe: " + classe.getName());
            // "java.lang.ArrayIndexOutOfBoundsException"
            
            // 3. toString()
            String texto = e.toString();
            System.out.println("ToString: " + texto);
            // "java.lang.ArrayIndexOutOfBoundsException: Index 10..."
            
            // 4. Stack trace
            System.err.println("Stack trace:");
            e.printStackTrace();
            
            // 5. Causa (se houver)
            Throwable causa = e.getCause();
            System.out.println("Causa: " + causa);  // null (sem causa)
        }
    }
}
```

**Objeto exceção**: variável no catch contém exceção capturada.

### 6. Métodos Úteis da Exceção

```java
// ✅ Métodos úteis do objeto exceção
public class MetodosExcecao {
    
    public static void demonstrar() {
        try {
            metodoA();
            
        } catch (Exception e) {
            System.out.println("=== Métodos da Exceção ===\n");
            
            // 1. getMessage() - mensagem da exceção
            System.out.println("1. getMessage():");
            System.out.println("   " + e.getMessage());
            
            // 2. getLocalizedMessage() - mensagem localizada
            System.out.println("\n2. getLocalizedMessage():");
            System.out.println("   " + e.getLocalizedMessage());
            
            // 3. toString() - representação String
            System.out.println("\n3. toString():");
            System.out.println("   " + e.toString());
            
            // 4. getClass() - classe da exceção
            System.out.println("\n4. getClass():");
            System.out.println("   " + e.getClass().getName());
            System.out.println("   " + e.getClass().getSimpleName());
            
            // 5. getCause() - causa raiz
            System.out.println("\n5. getCause():");
            System.out.println("   " + e.getCause());
            
            // 6. getStackTrace() - array de elementos pilha
            System.out.println("\n6. getStackTrace():");
            StackTraceElement[] stack = e.getStackTrace();
            for (int i = 0; i < Math.min(3, stack.length); i++) {
                System.out.println("   " + stack[i]);
            }
            
            // 7. printStackTrace() - imprime stack completo
            System.err.println("\n7. printStackTrace():");
            e.printStackTrace();
        }
    }
    
    private static void metodoA() {
        metodoB();
    }
    
    private static void metodoB() {
        metodoC();
    }
    
    private static void metodoC() {
        throw new RuntimeException("Erro no método C");
    }
}
```

**Métodos úteis**: `getMessage()`, `printStackTrace()`, `getClass()`, `getCause()`.

### 7. Captura e Processamento

```java
// ✅ Processar exceção capturada
public class CapturaProcessamento {
    
    // 1. Logar exceção
    public static void logarExcecao() {
        try {
            int resultado = 10 / 0;
            
        } catch (ArithmeticException e) {
            // ✅ Logar exceção
            System.err.println("ERRO: Divisão por zero");
            System.err.println("Mensagem: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // 2. Recuperar de erro
    public static int dividirSeguro(int a, int b) {
        try {
            return a / b;
            
        } catch (ArithmeticException e) {
            // ✅ Recuperar: retornar valor padrão
            System.err.println("Divisão por zero, retornando 0");
            return 0;
        }
    }
    
    // 3. Relançar exceção
    public static void relancar() throws Exception {
        try {
            int resultado = 10 / 0;
            
        } catch (ArithmeticException e) {
            // ✅ Logar e relançar
            System.err.println("Erro capturado, relançando...");
            throw new Exception("Erro ao calcular", e);
        }
    }
    
    // 4. Converter tipo exceção
    public static void converterTipo() {
        try {
            int resultado = 10 / 0;
            
        } catch (ArithmeticException e) {
            // ✅ Converter para tipo diferente
            throw new IllegalStateException("Estado inválido", e);
        }
    }
    
    // 5. Executar ação alternativa
    public static String lerArquivo(String caminho) {
        try {
            return Files.readString(Path.of(caminho));
            
        } catch (IOException e) {
            // ✅ Ação alternativa
            System.err.println("Arquivo não encontrado, usando padrão");
            return "conteúdo padrão";
        }
    }
}
```

**Processar**: logar, recuperar, relançar, converter, ação alternativa.

### 8. Captura em Cadeia de Chamadas

```java
// ✅ Captura em diferentes níveis
public class CapturaCadeia {
    
    public static void main(String[] args) {
        try {
            metodoA();
            
        } catch (ArithmeticException e) {
            // ✅ Captura aqui (nível mais alto)
            System.err.println("Capturado no main: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void metodoA() {
        System.out.println("MetodoA: chamando metodoB");
        metodoB();
        System.out.println("MetodoA: fim (NÃO executa)");
    }
    
    private static void metodoB() {
        System.out.println("MetodoB: chamando metodoC");
        metodoC();
        System.out.println("MetodoB: fim (NÃO executa)");
    }
    
    private static void metodoC() {
        System.out.println("MetodoC: lançando exceção");
        throw new ArithmeticException("Erro no método C");
    }
    
    /*
     * FLUXO:
     * 
     * main → metodoA → metodoB → metodoC
     *                              ↓
     *                         (exceção)
     *                              ↓
     *        metodoB ← metodoA ← main
     *          ↓         ↓        ↓
     *        volta    volta   CAPTURA
     * 
     * PROPAGAÇÃO:
     *   1. metodoC lança exceção
     *   2. metodoC não captura → propaga
     *   3. metodoB não captura → propaga
     *   4. metodoA não captura → propaga
     *   5. main captura → executa catch
     */
}
```

**Cadeia**: exceção **propaga** até encontrar catch compatível.

### 9. Primeira Captura Vence

```java
// ✅ Primeira captura compatível vence
public class PrimeiraCapturaVence {
    
    public static void exemplo() {
        try {
            throw new FileNotFoundException("Arquivo não existe");
            
        } catch (IOException e) {
            // ✅ ESTE captura (primeiro compatível)
            System.out.println("Capturado em IOException");
            System.out.println("Tipo real: " + e.getClass().getSimpleName());
            // Saída: FileNotFoundException
        }
        // catch (FileNotFoundException e) {
        //     // ❌ NUNCA executa (FileNotFound já capturado acima)
        //     System.out.println("NÃO executa");
        // }
        
        /*
         * REGRA:
         *   - JVM procura catch de CIMA para BAIXO
         *   - PRIMEIRO catch compatível vence
         *   - Demais catch ignorados
         * 
         * FileNotFoundException é IOException
         * Logo: catch IOException captura primeiro
         */
    }
}
```

**Primeira vence**: JVM usa **primeiro** catch compatível (top-down).

### 10. Resumo Visual: Captura

```java
/*
 * PROCESSO DE CAPTURA
 * 
 *       ┌────────────────┐
 *       │ Código no try  │
 *       └────────┬───────┘
 *                │
 *                ▼
 *       ┌────────────────┐
 *       │ Exceção lançada│
 *       └────────┬───────┘
 *                │
 *                ▼
 *       ┌────────────────┐
 *       │ JVM procura    │
 *       │ catch          │
 *       │ compatível     │
 *       └────────┬───────┘
 *                │
 *        ┌───────┴────────┐
 *        │                │
 *       SIM              NÃO
 *        │                │
 *        ▼                ▼
 *  ┌──────────┐    ┌──────────┐
 *  │  Catch   │    │ Propaga  │
 *  │ captura  │    │ exceção  │
 *  └────┬─────┘    └────┬─────┘
 *       │               │
 *       ▼               ▼
 *  ┌──────────┐    ┌──────────┐
 *  │ Executa  │    │ Programa │
 *  │  catch   │    │  quebra  │
 *  └────┬─────┘    └──────────┘
 *       │
 *       ▼
 *  ┌──────────┐
 *  │Continua  │
 *  │  após    │
 *  │try-catch │
 *  └──────────┘
 * 
 * COMPATIBILIDADE:
 * 
 * ✅ Captura tipo EXATO:
 *    throw FileNotFoundException
 *    catch FileNotFoundException
 * 
 * ✅ Captura SUBCLASSE:
 *    throw FileNotFoundException
 *    catch IOException (superclasse)
 * 
 * ❌ NÃO captura SUPERCLASSE da lançada:
 *    throw IOException
 *    catch FileNotFoundException (subclasse)
 * 
 * ORDEM DE BUSCA:
 * 
 * catch (Tipo1 e1) {  ← 1º verificado
 * }
 * catch (Tipo2 e2) {  ← 2º verificado
 * }
 * catch (Tipo3 e3) {  ← 3º verificado
 * }
 * 
 * PRIMEIRO compatível vence!
 */

public class ResumoCaptura {
    public static void main(String[] args) {
        System.out.println("=== CAPTURA DE EXCEÇÕES ===");
        System.out.println("\n1. Exceção lançada");
        System.out.println("2. JVM procura catch compatível");
        System.out.println("3. Catch captura (tipo E subclasses)");
        System.out.println("4. Executa código catch");
        System.out.println("5. Continua após try-catch");
    }
}
```

---

## Aplicabilidade

**Captura** permite:
- **Interceptar** exceções
- **Processar** erros
- **Recuperar** de falhas
- **Prevenir** programa quebrar

---

## Armadilhas

### 1. Catch Tipo Incompatível

```java
// ❌ Catch incompatível
try {
    int x = array[10];  // ArrayIndexOutOfBounds
} catch (ArithmeticException e) {
    // ❌ Não captura (tipo diferente)
}
```

### 2. Ordem Catch Errada

```java
// ❌ Superclasse primeiro (nunca chega subclasse)
try {
    throw new FileNotFoundException();
} catch (IOException e) {
    // Captura aqui
}
catch (FileNotFoundException e) {
    // ❌ Nunca executa (código morto)
}
```

### 3. Catch Vazio

```java
// ❌ Catch vazio (engole erro)
try {
    processar();
} catch (Exception e) {
    // ❌ MAU: ignora erro
}
```

---

## Boas Práticas

### 1. Capturar Tipo Específico

```java
// ✅ Específico
catch (FileNotFoundException e) {
    // Trata arquivo não encontrado
}

// ❌ Genérico demais
catch (Exception e) {
    // Captura TUDO
}
```

### 2. Sempre Processar Exceção

```java
// ✅ Logar ou processar
catch (IOException e) {
    logger.error("Erro I/O", e);
    // ou
    e.printStackTrace();
}
```

### 3. Usar Métodos da Exceção

```java
// ✅ Usar informações da exceção
catch (SQLException e) {
    System.err.println("SQL Error: " + e.getMessage());
    System.err.println("SQL State: " + e.getSQLState());
    System.err.println("Error Code: " + e.getErrorCode());
}
```

---

## Resumo

**Captura**: catch **intercepta** exceção lançada.

**Processo**:
1. Código lança exceção
2. JVM procura catch compatível
3. Catch captura exceção
4. Executa código catch
5. Continua após try-catch

**Compatibilidade**:
- ✅ Captura tipo **exato**
- ✅ Captura **subclasses**
- ❌ NÃO captura **superclasses** da lançada

**Ordem**:
- JVM verifica catch **top-down**
- **Primeiro** compatível vence
- Demais catch ignorados

**Objeto exceção**:
- Variável no catch
- Métodos: `getMessage()`, `printStackTrace()`, `getClass()`, `getCause()`

**Processamento**:
- **Logar** exceção
- **Recuperar** (valor padrão)
- **Relançar** exceção
- **Converter** tipo
- **Ação alternativa**

**Regra de Ouro**: Catch captura tipo **e subclasses** (polimorfismo). **Primeiro** catch compatível vence. Sempre **processar** exceção (não deixar catch vazio). Usar tipo **específico** (não genérico).

