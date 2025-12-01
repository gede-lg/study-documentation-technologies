# T4.01 - Sintaxe Básica do try-catch

## Introdução

O bloco **try-catch** permite **capturar** e **tratar** exceções.

```java
/*
 * SINTAXE BÁSICA
 * 
 * try {
 *     // Código que PODE lançar exceção
 * } catch (TipoExcecao e) {
 *     // Código que TRATA a exceção
 * }
 * 
 * try:
 *   - Bloco onde código pode lançar exceção
 *   - DEVE ter pelo menos 1 catch ou finally
 * 
 * catch:
 *   - Captura exceção do tipo especificado
 *   - Executa SOMENTE se exceção ocorrer
 *   - Recebe objeto da exceção (variável)
 */

// ✅ Exemplo básico
try {
    int resultado = 10 / 0;  // ArithmeticException
} catch (ArithmeticException e) {
    System.err.println("Erro: divisão por zero");
}
```

**try-catch** = bloco para **capturar** e **tratar** exceções.

---

## Fundamentos

### 1. Estrutura Básica

```java
// ✅ Estrutura básica do try-catch
public class EstruturaBasica {
    
    public static void exemplo1() {
        System.out.println("Antes do try");
        
        try {
            System.out.println("Dentro do try - início");
            int resultado = 10 / 0;  // ArithmeticException
            System.out.println("Dentro do try - fim (NÃO executa)");
            
        } catch (ArithmeticException e) {
            System.out.println("Dentro do catch");
            System.err.println("Erro: " + e.getMessage());
        }
        
        System.out.println("Depois do try-catch");
        
        /*
         * SAÍDA:
         * Antes do try
         * Dentro do try - início
         * Dentro do catch
         * Erro: / by zero
         * Depois do try-catch
         */
    }
    
    /*
     * FLUXO DE EXECUÇÃO:
     * 
     * 1. Executa código ANTES do try
     * 2. Entra no bloco try
     * 3. Se exceção ocorre:
     *    - INTERROMPE execução do try
     *    - Pula para catch correspondente
     *    - Executa código do catch
     * 4. Se exceção NÃO ocorre:
     *    - Executa try completo
     *    - PULA catch
     * 5. Continua após try-catch
     */
}
```

**Estrutura**: `try` → exceção → `catch` → continua.

### 2. Sintaxe Completa

```java
// ✅ Sintaxe completa
public class SintaxeCompleta {
    
    public static void demonstrar() {
        
        // BLOCO TRY
        try {
            /*
             * - Contém código que PODE lançar exceção
             * - OBRIGATÓRIO ter pelo menos 1 catch OU finally
             * - Pode ter múltiplas linhas
             * - Executa até exceção ou fim
             */
            int[] array = {1, 2, 3};
            int valor = array[10];  // ArrayIndexOutOfBoundsException
            
        } catch (ArrayIndexOutOfBoundsException e) {
            /*
             * - Captura exceção do tipo especificado
             * - Recebe objeto exceção (variável 'e')
             * - Executa SOMENTE se exceção ocorrer
             * - Pode ter múltiplas linhas
             */
            System.err.println("Índice inválido: " + e.getMessage());
        }
        
        /*
         * SINTAXE:
         * 
         * try {
         *     comando1;
         *     comando2;
         *     ...
         * } catch (TipoExcecao nomeVariavel) {
         *     tratamento1;
         *     tratamento2;
         *     ...
         * }
         */
    }
}
```

**Sintaxe**: `try { código }` + `catch (Tipo var) { tratamento }`.

### 3. Variável de Exceção

```java
// ✅ Variável de exceção no catch
public class VariavelExcecao {
    
    public static void exemplo() {
        try {
            int resultado = 10 / 0;
            
        } catch (ArithmeticException e) {
            // ✅ Variável 'e' contém objeto da exceção
            
            // getMessage(): mensagem da exceção
            System.out.println("Mensagem: " + e.getMessage());  // "/ by zero"
            
            // getClass(): classe da exceção
            System.out.println("Classe: " + e.getClass().getName());
            
            // toString(): representação String
            System.out.println("ToString: " + e.toString());
            
            // printStackTrace(): imprime stack trace
            e.printStackTrace();
        }
        
        /*
         * VARIÁVEL DE EXCEÇÃO:
         *   - Nome convenção: 'e' ou 'ex'
         *   - Tipo: classe da exceção
         *   - Escopo: SOMENTE dentro do catch
         *   - Contém objeto da exceção lançada
         */
    }
    
    // ✅ Nomes comuns para variável
    public static void nomesComuns() {
        // Convenção 1: 'e'
        try {
            // código
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        // Convenção 2: 'ex'
        try {
            // código
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        
        // Convenção 3: nome descritivo
        try {
            // código
        } catch (FileNotFoundException fileNotFound) {
            fileNotFound.printStackTrace();
        }
    }
}
```

**Variável** no catch = objeto da **exceção** lançada.

### 4. Try com Sucesso (Sem Exceção)

```java
// ✅ Try executa completamente (sem exceção)
public class TryComSucesso {
    
    public static void exemplo() {
        System.out.println("1. Antes do try");
        
        try {
            System.out.println("2. Try - início");
            int resultado = 10 / 2;  // OK - sem exceção
            System.out.println("3. Try - resultado: " + resultado);
            System.out.println("4. Try - fim");
            
        } catch (ArithmeticException e) {
            System.out.println("CATCH - NÃO executa");
        }
        
        System.out.println("5. Depois do try-catch");
        
        /*
         * SAÍDA (sem exceção):
         * 1. Antes do try
         * 2. Try - início
         * 3. Try - resultado: 5
         * 4. Try - fim
         * 5. Depois do try-catch
         * 
         * CATCH NÃO executa (sem exceção)
         */
    }
}
```

**Sem exceção**: try **completo**, catch **não** executa.

### 5. Try com Exceção

```java
// ✅ Try interrompido por exceção
public class TryComExcecao {
    
    public static void exemplo() {
        System.out.println("1. Antes do try");
        
        try {
            System.out.println("2. Try - início");
            int resultado = 10 / 0;  // ArithmeticException
            System.out.println("3. Try - NÃO executa");
            System.out.println("4. Try - NÃO executa");
            
        } catch (ArithmeticException e) {
            System.out.println("5. CATCH - executa");
            System.err.println("6. Erro: " + e.getMessage());
        }
        
        System.out.println("7. Depois do try-catch");
        
        /*
         * SAÍDA (com exceção):
         * 1. Antes do try
         * 2. Try - início
         * 5. CATCH - executa
         * 6. Erro: / by zero
         * 7. Depois do try-catch
         * 
         * Linhas 3-4 do try NÃO executam (exceção interrompe)
         */
    }
}
```

**Com exceção**: try **interrompido**, catch **executa**.

### 6. Exceção Não Capturada

```java
// ✅ Exceção não capturada (catch errado)
public class ExcecaoNaoCapturada {
    
    public static void exemplo() {
        try {
            int[] array = {1, 2, 3};
            int valor = array[10];  // ArrayIndexOutOfBoundsException
            
        } catch (ArithmeticException e) {
            // ❌ CATCH ERRADO - não captura ArrayIndexOutOfBounds
            System.err.println("NÃO executa");
        }
        
        System.out.println("NÃO executa (exceção não capturada)");
        
        /*
         * RESULTADO:
         *   - ArrayIndexOutOfBounds lançada
         *   - catch ArithmeticException NÃO captura
         *   - Exceção PROPAGA (não capturada)
         *   - Programa QUEBRA
         * 
         * ERRO:
         * Exception in thread "main" 
         * java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds...
         */
    }
}
```

**Catch errado** = exceção **não capturada** (propaga).

### 7. Tipos Compatíveis no Catch

```java
// ✅ Catch captura tipo especificado E subclasses
public class TiposCompativeis {
    
    // ✅ Catch captura tipo EXATO
    public static void exemplo1() {
        try {
            throw new NullPointerException("NPE");
            
        } catch (NullPointerException e) {
            // ✅ Captura NullPointerException
            System.out.println("Capturado: " + e.getClass().getSimpleName());
        }
    }
    
    // ✅ Catch captura SUBCLASSE
    public static void exemplo2() {
        try {
            throw new FileNotFoundException("Arquivo não encontrado");
            
        } catch (IOException e) {
            // ✅ Captura FileNotFoundException (subclasse de IOException)
            System.out.println("Capturado: " + e.getClass().getSimpleName());
            // Saída: FileNotFoundException
        }
    }
    
    // ✅ Catch genérico captura TODAS
    public static void exemplo3() {
        try {
            throw new ArithmeticException("Divisão zero");
            
        } catch (Exception e) {
            // ✅ Exception captura TODAS (ArithmeticException é Exception)
            System.out.println("Capturado: " + e.getClass().getSimpleName());
            // Saída: ArithmeticException
        }
    }
    
    /*
     * HIERARQUIA:
     * 
     * Throwable
     *   └── Exception
     *         ├── IOException
     *         │     └── FileNotFoundException
     *         │
     *         └── RuntimeException
     *               ├── ArithmeticException
     *               ├── NullPointerException
     *               └── ...
     * 
     * CAPTURA:
     *   - catch(FileNotFoundException) → captura SOMENTE FileNotFound
     *   - catch(IOException) → captura IOException E FileNotFound
     *   - catch(Exception) → captura TODAS exceções
     */
}
```

**Catch** captura tipo **especificado** e **subclasses**.

### 8. Fluxo de Execução Completo

```java
// ✅ Fluxo de execução detalhado
public class FluxoExecucao {
    
    public static void exemploCompleto() {
        System.out.println("A. Início do método");
        
        int x = 10;
        
        System.out.println("B. Antes do try");
        
        try {
            System.out.println("C. Try - início");
            
            int y = x / 0;  // ArithmeticException
            
            System.out.println("D. Try - NÃO executa");
            int z = y + 5;
            System.out.println("E. Try - NÃO executa");
            
        } catch (ArithmeticException e) {
            System.out.println("F. Catch - executa");
            System.err.println("G. Erro: " + e.getMessage());
        }
        
        System.out.println("H. Depois do try-catch");
        System.out.println("I. Fim do método");
        
        /*
         * FLUXO (com exceção):
         * 
         * A → B → C → (exceção) → F → G → H → I
         * 
         * SAÍDA:
         * A. Início do método
         * B. Antes do try
         * C. Try - início
         * F. Catch - executa
         * G. Erro: / by zero
         * H. Depois do try-catch
         * I. Fim do método
         * 
         * Linhas D, E NÃO executam (exceção interrompe try)
         */
    }
    
    public static void exemploSemExcecao() {
        System.out.println("A. Início do método");
        
        int x = 10;
        
        System.out.println("B. Antes do try");
        
        try {
            System.out.println("C. Try - início");
            
            int y = x / 2;  // OK - sem exceção
            
            System.out.println("D. Try - resultado: " + y);
            int z = y + 5;
            System.out.println("E. Try - z = " + z);
            
        } catch (ArithmeticException e) {
            System.out.println("F. Catch - NÃO executa");
        }
        
        System.out.println("H. Depois do try-catch");
        System.out.println("I. Fim do método");
        
        /*
         * FLUXO (sem exceção):
         * 
         * A → B → C → D → E → H → I
         * 
         * SAÍDA:
         * A. Início do método
         * B. Antes do try
         * C. Try - início
         * D. Try - resultado: 5
         * E. Try - z = 10
         * H. Depois do try-catch
         * I. Fim do método
         * 
         * Linha F NÃO executa (sem exceção)
         */
    }
}
```

**Fluxo**: com exceção = try→catch→depois. Sem exceção = try→depois (pula catch).

### 9. Try Obrigatório com Catch ou Finally

```java
// ✅ Try DEVE ter catch OU finally
public class TryObrigatorio {
    
    // ✅ OK: try + catch
    public static void exemplo1() {
        try {
            int r = 10 / 0;
        } catch (ArithmeticException e) {
            e.printStackTrace();
        }
    }
    
    // ✅ OK: try + finally
    public static void exemplo2() {
        try {
            int r = 10 / 0;
        } finally {
            System.out.println("Finally");
        }
    }
    
    // ✅ OK: try + catch + finally
    public static void exemplo3() {
        try {
            int r = 10 / 0;
        } catch (ArithmeticException e) {
            e.printStackTrace();
        } finally {
            System.out.println("Finally");
        }
    }
    
    // ❌ ERRO: try sozinho (sem catch ou finally)
    // public static void erro() {
    //     try {
    //         int r = 10 / 0;
    //     }
    //     // ERRO: 'try' without 'catch', 'finally' or resource declarations
    // }
    
    /*
     * REGRAS:
     *   - try DEVE ter pelo menos:
     *     * 1 catch, OU
     *     * 1 finally, OU
     *     * ambos (catch + finally)
     *   - try sozinho NÃO compila
     */
}
```

**Try** deve ter `catch` **ou** `finally` (ou ambos).

### 10. Resumo Visual: Sintaxe

```java
/*
 * SINTAXE BÁSICA DO TRY-CATCH
 * 
 * ┌──────────────────────────────────────┐
 * │ try {                                │
 * │     // Código que PODE lançar        │
 * │     comando1;                        │
 * │     comando2;  // ← exceção aqui     │
 * │     comando3;  // NÃO executa        │
 * │ } catch (TipoExcecao e) {            │
 * │     // Tratamento da exceção         │
 * │     comando4;                        │
 * │     comando5;                        │
 * │ }                                    │
 * │ // Continua após try-catch           │
 * │ comando6;                            │
 * └──────────────────────────────────────┘
 * 
 * FLUXO COM EXCEÇÃO:
 * 
 * comando1 → comando2 → exceção
 *                         ↓
 *                      comando4 → comando5
 *                         ↓
 *                      comando6
 * 
 * FLUXO SEM EXCEÇÃO:
 * 
 * comando1 → comando2 → comando3
 *                         ↓
 *                   (pula catch)
 *                         ↓
 *                      comando6
 * 
 * COMPONENTES:
 * 
 * try {
 *     - Bloco onde código pode lançar exceção
 *     - Executa até exceção ou fim
 *     - OBRIGATÓRIO ter catch OU finally
 * }
 * 
 * catch (TipoExcecao e) {
 *     - Captura exceção do tipo especificado
 *     - Variável 'e' contém objeto exceção
 *     - Executa SOMENTE se exceção ocorrer
 *     - Pode ter múltiplos catch
 * }
 */

public class ResumoSintaxe {
    public static void main(String[] args) {
        System.out.println("=== SINTAXE BÁSICA ===");
        
        System.out.println("\ntry {");
        System.out.println("    // Código que pode lançar");
        System.out.println("} catch (TipoExcecao e) {");
        System.out.println("    // Tratamento");
        System.out.println("}");
        
        System.out.println("\n✅ try: código que pode lançar");
        System.out.println("✅ catch: captura e trata");
        System.out.println("✅ e: variável com objeto exceção");
    }
}
```

---

## Aplicabilidade

**try-catch** é usado para:
- **Capturar** exceções checked (obrigatório)
- **Tratar** exceções unchecked (opcional)
- **Prevenir** programa quebrar
- **Recuperar** de erros

---

## Armadilhas

### 1. Catch Tipo Errado

```java
// ❌ Catch não captura tipo diferente
try {
    int[] arr = {1};
    int x = arr[10];  // ArrayIndexOutOfBounds
} catch (ArithmeticException e) {
    // ❌ Não captura (tipo diferente)
}
```

### 2. Try Vazio

```java
// ⚠️ Try vazio (válido mas inútil)
try {
    // vazio
} catch (Exception e) {
    // nunca executa
}
```

### 3. Catch Vazio

```java
// ❌ Catch vazio (engole exceção)
try {
    int r = 10 / 0;
} catch (ArithmeticException e) {
    // ❌ MAU: vazio (ignora erro)
}

// ✅ Pelo menos logar
catch (ArithmeticException e) {
    e.printStackTrace();
}
```

---

## Boas Práticas

### 1. Nome Descritivo para Variável

```java
// ✅ Nome padrão 'e'
catch (IOException e) {
    e.printStackTrace();
}

// ✅ Nome descritivo
catch (FileNotFoundException fileNotFound) {
    System.err.println("Arquivo: " + fileNotFound.getMessage());
}
```

### 2. Sempre Fazer Algo no Catch

```java
// ✅ Logar exceção
catch (IOException e) {
    logger.error("Erro I/O", e);
}

// ✅ Imprimir stack trace
catch (SQLException e) {
    e.printStackTrace();
}

// ✅ Mensagem útil
catch (ParseException e) {
    System.err.println("Formato inválido: " + e.getMessage());
}
```

### 3. Não Capturar Muito Genérico

```java
// ❌ Muito genérico
catch (Exception e) {
    // Captura TUDO
}

// ✅ Específico
catch (FileNotFoundException e) {
    // Captura só FileNotFound
}
```

---

## Resumo

**try-catch**: captura e trata exceções.

**Sintaxe**:
```java
try {
    // Código que pode lançar
} catch (TipoExcecao e) {
    // Tratamento
}
```

**Componentes**:
- **try**: bloco com código que pode lançar
- **catch**: captura exceção do tipo especificado
- **e**: variável contém objeto da exceção

**Fluxo**:
- **Com exceção**: try (até exceção) → catch → depois
- **Sem exceção**: try (completo) → (pula catch) → depois

**Regras**:
- try DEVE ter `catch` **ou** `finally`
- catch captura tipo **e subclasses**
- Catch **só** executa se exceção ocorrer
- Exceção **interrompe** try

**Variável**:
- Nome: `e`, `ex`, ou descritivo
- Escopo: **só** dentro do catch
- Métodos: `getMessage()`, `printStackTrace()`

**Regra de Ouro**: try = código que **pode** lançar. catch = **trata** exceção específica. Sempre fazer **algo** no catch (logar, mensagem, recuperar). Não deixar catch **vazio**.

