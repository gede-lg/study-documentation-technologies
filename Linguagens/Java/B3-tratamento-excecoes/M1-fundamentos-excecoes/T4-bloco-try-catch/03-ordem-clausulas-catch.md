# T4.03 - Ordem de Cláusulas catch

## Introdução

A **ordem** dos blocos `catch` é **crítica**: mais **específico** antes de **genérico**.

```java
/*
 * ORDEM DE CATCH
 * 
 * REGRA:
 *   - Catch MAIS ESPECÍFICO primeiro
 *   - Catch MAIS GENÉRICO depois
 *   - Subclasse ANTES de superclasse
 * 
 * MOTIVO:
 *   - JVM verifica catch de CIMA para BAIXO
 *   - PRIMEIRO compatível vence
 *   - Se genérico primeiro, específico NUNCA executa
 */

// ✅ CORRETO: específico → genérico
try {
    // código
} catch (FileNotFoundException e) {     // Específico
    // trata FileNotFound
} catch (IOException e) {                // Genérico
    // trata outras IOException
}

// ❌ ERRO: genérico → específico (NÃO compila)
// try {
//     // código
// } catch (IOException e) {             // Genérico primeiro
//     // ...
// } catch (FileNotFoundException e) {   // ❌ ERRO: já capturado
//     // ...
// }
```

**Ordem**: **específico** primeiro, **genérico** depois.

---

## Fundamentos

### 1. Por Que a Ordem Importa?

```java
// ✅ Por que ordem importa
public class PorQueOrdemImporta {
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   └── IOException
     *         └── FileNotFoundException
     * 
     * FileNotFoundException É IOException (polimorfismo)
     */
    
    // ✅ ORDEM CORRETA
    public static void ordemCorreta() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            
        } catch (FileNotFoundException e) {
            // ✅ 1º: Mais específico
            System.out.println("Arquivo não encontrado");
            
        } catch (IOException e) {
            // ✅ 2º: Mais genérico
            System.out.println("Erro I/O");
        }
        
        /*
         * FUNCIONA:
         *   - FileNotFoundException lançada
         *   - JVM verifica catch de cima para baixo
         *   - Primeiro catch (FileNotFound) captura
         *   - Segundo catch ignorado
         */
    }
    
    // ❌ ORDEM ERRADA (NÃO COMPILA)
    public static void ordemErrada() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            
        } catch (IOException e) {
            // ❌ Genérico PRIMEIRO
            System.out.println("Erro I/O");
            
        } // catch (FileNotFoundException e) {
          //     // ❌ ERRO DE COMPILAÇÃO
          //     // "exception FileNotFoundException has already been caught"
          //     System.out.println("Arquivo não encontrado");
          // }
        
        /*
         * NÃO COMPILA:
         *   - IOException captura FileNotFoundException também
         *   - catch FileNotFound NUNCA executaria (código morto)
         *   - Compilador detecta e gera erro
         */
    }
}
```

**Ordem importa**: JVM verifica **top-down**, **primeiro** compatível vence.

### 2. Erro de Compilação: Ordem Errada

```java
// ❌ Compilador detecta ordem errada
public class ErroCompilacao {
    
    public static void exemplo1() {
        try {
            Class.forName("MinhaClasse");
            
        } catch (Exception e) {
            // Genérico primeiro
            
        } // catch (ClassNotFoundException e) {
          //     // ❌ ERRO: exception ClassNotFoundException has already been caught
          // }
    }
    
    public static void exemplo2() {
        try {
            FileReader reader = new FileReader("arquivo.txt");
            
        } catch (IOException e) {
            // Genérico primeiro
            
        } // catch (FileNotFoundException e) {
          //     // ❌ ERRO: exception FileNotFoundException has already been caught
          // }
    }
    
    public static void exemplo3() {
        try {
            int[] array = {1, 2, 3};
            int x = array[10];
            
        } catch (RuntimeException e) {
            // Genérico primeiro
            
        } // catch (ArrayIndexOutOfBoundsException e) {
          //     // ❌ ERRO: exception ArrayIndexOutOfBoundsException has already been caught
          // }
    }
    
    /*
     * MENSAGEM DE ERRO:
     * 
     * "exception XException has already been caught"
     * 
     * SIGNIFICA:
     *   - Catch anterior já captura esta exceção
     *   - Este catch NUNCA executaria
     *   - Código morto (dead code)
     */
}
```

**Erro compilação**: catch genérico **antes** captura específico (código morto).

### 3. Ordem Correta: Específico → Genérico

```java
// ✅ Ordem correta: específico → genérico
public class OrdemCorreta {
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   ├── IOException
     *   │     ├── FileNotFoundException
     *   │     ├── EOFException
     *   │     └── SocketException
     *   │
     *   └── SQLException
     */
    
    public static void exemplo() {
        try {
            // Código que pode lançar várias exceções
            FileReader reader = new FileReader("arquivo.txt");
            reader.read();
            
        } catch (FileNotFoundException e) {
            // ✅ 1º: Mais específico
            System.err.println("Arquivo não encontrado: " + e.getMessage());
            
        } catch (EOFException e) {
            // ✅ 2º: Específico
            System.err.println("Fim de arquivo inesperado");
            
        } catch (IOException e) {
            // ✅ 3º: Genérico (captura outras IOException)
            System.err.println("Erro I/O: " + e.getMessage());
            
        } catch (Exception e) {
            // ✅ 4º: Muito genérico (captura TUDO)
            System.err.println("Erro inesperado: " + e.getMessage());
        }
        
        /*
         * ORDEM:
         *   1. FileNotFoundException (subclasse de IOException)
         *   2. EOFException (subclasse de IOException)
         *   3. IOException (superclasse de File e EOF)
         *   4. Exception (superclasse de TUDO)
         * 
         * ESPECÍFICO → GENÉRICO
         */
    }
}
```

**Correta**: FileNotFound → EOF → IOException → Exception (específico→genérico).

### 4. Hierarquia e Ordem

```java
// ✅ Ordem baseada em hierarquia
public class HierarquiaOrdem {
    
    /*
     * HIERARQUIA COMPLETA:
     * 
     * Throwable
     *   ├── Error
     *   │
     *   └── Exception
     *         ├── IOException
     *         │     ├── FileNotFoundException
     *         │     ├── EOFException
     *         │     └── SocketException
     *         │
     *         ├── SQLException
     *         │
     *         └── RuntimeException
     *               ├── ArithmeticException
     *               ├── NullPointerException
     *               └── IndexOutOfBoundsException
     *                     └── ArrayIndexOutOfBoundsException
     */
    
    // ✅ Ordem IOException
    public static void ordemIO() {
        try {
            // código
        } catch (FileNotFoundException e) {      // Nível 3
            // ...
        } catch (EOFException e) {               // Nível 3
            // ...
        } catch (IOException e) {                // Nível 2
            // ...
        } catch (Exception e) {                  // Nível 1
            // ...
        }
    }
    
    // ✅ Ordem RuntimeException
    public static void ordemRuntime() {
        try {
            // código
        } catch (ArrayIndexOutOfBoundsException e) {  // Nível 3
            // ...
        } catch (IndexOutOfBoundsException e) {       // Nível 2
            // ...
        } catch (RuntimeException e) {                // Nível 1
            // ...
        }
    }
    
    /*
     * REGRA:
     *   - Subclasse (nível mais baixo) PRIMEIRO
     *   - Superclasse (nível mais alto) DEPOIS
     *   - Folha → Raiz
     */
}
```

**Hierarquia**: **folha** (específico) primeiro, **raiz** (genérico) depois.

### 5. Exceções Sem Hierarquia (Ordem Livre)

```java
// ✅ Exceções sem relação hierárquica: ordem livre
public class OrdemLivre {
    
    /*
     * HIERARQUIA:
     * 
     * Exception
     *   ├── IOException      (não relacionada com SQL)
     *   └── SQLException     (não relacionada com IO)
     * 
     * IOException e SQLException são "irmãs" (não hierarquia direta)
     */
    
    // ✅ Ordem 1: IO → SQL
    public static void ordem1() {
        try {
            // código
        } catch (IOException e) {
            // ...
        } catch (SQLException e) {
            // ...
        }
    }
    
    // ✅ Ordem 2: SQL → IO (também OK)
    public static void ordem2() {
        try {
            // código
        } catch (SQLException e) {
            // ...
        } catch (IOException e) {
            // ...
        }
    }
    
    /*
     * ORDEM LIVRE:
     *   - Exceções SEM relação hierárquica
     *   - QUALQUER ordem funciona
     *   - Não há "mais específico" entre elas
     * 
     * EXEMPLOS SEM RELAÇÃO:
     *   - IOException e SQLException
     *   - ArithmeticException e NullPointerException
     *   - FileNotFoundException e ClassNotFoundException
     */
}
```

**Sem hierarquia**: ordem **livre** (não há relação superclasse/subclasse).

### 6. Catch Exception Genérico por Último

```java
// ✅ Exception genérico sempre por ÚLTIMO
public class ExceptionPorUltimo {
    
    // ✅ CORRETO: específicos primeiro, Exception último
    public static void correto() {
        try {
            // código que pode lançar várias exceções
            
        } catch (FileNotFoundException e) {
            // Específico
            
        } catch (IOException e) {
            // Menos específico
            
        } catch (SQLException e) {
            // Específico (sem relação com IO)
            
        } catch (Exception e) {
            // ✅ Genérico POR ÚLTIMO (captura TUDO mais)
            System.err.println("Erro inesperado: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // ❌ ERRADO: Exception primeiro (NÃO compila)
    public static void errado() {
        try {
            // código
            
        } catch (Exception e) {
            // ❌ Genérico PRIMEIRO
            
        } // catch (IOException e) {
          //     // ❌ ERRO: already been caught
          // }
    }
    
    /*
     * REGRA:
     *   - Exception captura TODAS exceções
     *   - DEVE ser o ÚLTIMO catch
     *   - Se primeiro: nenhum outro catch executa
     */
}
```

**Exception** genérico sempre por **último** (captura tudo).

### 7. Catch Throwable (Mais Genérico)

```java
// ✅ Throwable: ainda mais genérico que Exception
public class CatchThrowable {
    
    /*
     * HIERARQUIA:
     * 
     * Throwable
     *   ├── Error
     *   │     └── OutOfMemoryError, StackOverflowError, ...
     *   │
     *   └── Exception
     *         └── ...
     */
    
    // ✅ Throwable ÚLTIMO (captura TUDO: Exception + Error)
    public static void exemplo() {
        try {
            // código
            
        } catch (FileNotFoundException e) {
            // Específico
            
        } catch (IOException e) {
            // Menos específico
            
        } catch (Exception e) {
            // Genérico (todas Exception)
            
        } catch (Throwable t) {
            // ✅ Mais genérico (Exception + Error)
            System.err.println("Erro grave: " + t.getMessage());
            t.printStackTrace();
        }
    }
    
    /*
     * ORDEM GERAL:
     *   1. Exceções específicas (FileNotFound, etc.)
     *   2. Exceções menos específicas (IOException, etc.)
     *   3. Exception (todas exceções)
     *   4. Throwable (exceções + erros)
     * 
     * ⚠️ Capturar Throwable/Error NÃO recomendado
     *    (erros graves da JVM)
     */
}
```

**Throwable** mais genérico que **Exception** (captura Error também).

### 8. Exemplo Completo: Ordem Múltipla

```java
// ✅ Exemplo completo com ordem correta
public class OrdemMultipla {
    
    public static void processarArquivo(String caminho) {
        try {
            // Abrir arquivo
            FileReader reader = new FileReader(caminho);
            BufferedReader br = new BufferedReader(reader);
            
            // Ler conteúdo
            String linha = br.readLine();
            
            // Processar
            int numero = Integer.parseInt(linha);
            int resultado = 100 / numero;
            
            br.close();
            
        } catch (FileNotFoundException e) {
            // ✅ 1º: Arquivo não encontrado (mais específico)
            System.err.println("Arquivo não encontrado: " + caminho);
            
        } catch (NumberFormatException e) {
            // ✅ 2º: Conversão inválida
            System.err.println("Linha não é número: " + e.getMessage());
            
        } catch (ArithmeticException e) {
            // ✅ 3º: Divisão por zero
            System.err.println("Divisão por zero");
            
        } catch (IOException e) {
            // ✅ 4º: Outros erros I/O (genérico para I/O)
            System.err.println("Erro ao ler arquivo: " + e.getMessage());
            
        } catch (RuntimeException e) {
            // ✅ 5º: Outras runtime (genérico para runtime)
            System.err.println("Erro runtime: " + e.getMessage());
            
        } catch (Exception e) {
            // ✅ 6º: Qualquer outra (mais genérico)
            System.err.println("Erro inesperado: " + e.getMessage());
            e.printStackTrace();
        }
        
        /*
         * ORDEM:
         *   1. FileNotFoundException (subclasse IOException)
         *   2. NumberFormatException (não relacionada)
         *   3. ArithmeticException (não relacionada)
         *   4. IOException (superclasse FileNotFound)
         *   5. RuntimeException (superclasse Number e Arithmetic)
         *   6. Exception (superclasse TUDO)
         * 
         * ESPECÍFICO → GENÉRICO
         */
    }
}
```

**Múltipla**: específicas → menos específicas → genéricas → Exception.

### 9. Validação IDE e Compilador

```java
// ✅ IDE e compilador validam ordem
public class ValidacaoOrdem {
    
    public static void exemplo() {
        try {
            // código
            
        } catch (IOException e) {
            // ...
            
        } // catch (FileNotFoundException e) {
          //     /*
          //      * IDE:
          //      *   - Sublinha vermelho
          //      *   - Erro: "exception has already been caught"
          //      * 
          //      * COMPILADOR:
          //      *   - Erro compilação
          //      *   - NÃO gera .class
          //      */
          // }
    }
    
    /*
     * VALIDAÇÃO:
     * 
     * IDE (IntelliJ, Eclipse, VS Code):
     *   - Detecta ordem errada
     *   - Sublinha vermelho
     *   - Tooltip com erro
     *   - Quick fix: reordenar catch
     * 
     * COMPILADOR (javac):
     *   - Erro compilação
     *   - Mensagem: "exception has already been caught"
     *   - NÃO gera arquivo .class
     */
}
```

**Validação**: IDE e compilador **detectam** ordem errada.

### 10. Resumo Visual: Ordem

```java
/*
 * ORDEM DE CATCH: ESPECÍFICO → GENÉRICO
 * 
 * ┌────────────────────────────────────────┐
 * │ try {                                  │
 * │     // código                          │
 * │ }                                      │
 * │ catch (Específica1 e) {                │  ← 1º: Mais específica
 * │     // ...                             │
 * │ }                                      │
 * │ catch (Específica2 e) {                │  ← 2º: Específica
 * │     // ...                             │
 * │ }                                      │
 * │ catch (MenosEspecífica e) {            │  ← 3º: Menos específica
 * │     // ...                             │
 * │ }                                      │
 * │ catch (Exception e) {                  │  ← 4º: Genérica (ÚLTIMA)
 * │     // ...                             │
 * │ }                                      │
 * └────────────────────────────────────────┘
 * 
 * HIERARQUIA EXEMPLO:
 * 
 * Exception
 *   └── IOException
 *         └── FileNotFoundException
 * 
 * ORDEM CORRETA:
 * 
 * ✅ catch (FileNotFoundException e)  ← Específica (folha)
 *    catch (IOException e)            ← Menos específica (meio)
 *    catch (Exception e)              ← Genérica (raiz)
 * 
 * ORDEM ERRADA:
 * 
 * ❌ catch (IOException e)            ← Genérica primeiro
 *    catch (FileNotFoundException e)  ← ERRO: já capturada
 * 
 * REGRA:
 * 
 *   Subclasse ANTES de Superclasse
 *   Folha ANTES de Raiz
 *   Específica ANTES de Genérica
 * 
 * MOTIVO:
 * 
 *   JVM procura catch de CIMA para BAIXO
 *   PRIMEIRO compatível vence
 *   Se genérico primeiro, específico NUNCA executa
 */

public class ResumoOrdem {
    public static void main(String[] args) {
        System.out.println("=== ORDEM DE CATCH ===");
        System.out.println("\n✅ REGRA: Específico → Genérico");
        System.out.println("✅ Subclasse ANTES de Superclasse");
        System.out.println("✅ Exception SEMPRE por ÚLTIMO");
        System.out.println("\n❌ Genérico primeiro = ERRO compilação");
    }
}
```

---

## Aplicabilidade

**Ordem correta** permite:
- **Tratar** casos específicos diferenciadamente
- **Evitar** código morto
- **Compilar** sem erros
- **Melhor** controle de exceções

---

## Armadilhas

### 1. Genérico Antes de Específico

```java
// ❌ Ordem errada (NÃO compila)
try {
    // código
} catch (IOException e) {
    // ...
} catch (FileNotFoundException e) {  // ❌ ERRO
    // ...
}
```

### 2. Exception Não Por Último

```java
// ❌ Exception não último (NÃO compila)
try {
    // código
} catch (Exception e) {
    // ...
} catch (IOException e) {  // ❌ ERRO
    // ...
}
```

### 3. Ignorar Hierarquia

```java
// ❌ Ignorar que FileNotFound É IOException
try {
    // código
} catch (IOException e) {      // Captura FileNotFound também
    // ...
} catch (FileNotFoundException e) {  // ❌ Nunca executa
    // ...
}
```

---

## Boas Práticas

### 1. Específico → Genérico

```java
// ✅ Ordem correta
catch (FileNotFoundException e) {    // Específico
}
catch (IOException e) {               // Genérico
}
catch (Exception e) {                 // Mais genérico
}
```

### 2. Exception Por Último

```java
// ✅ Exception sempre último
catch (IOException e) {
}
catch (SQLException e) {
}
catch (Exception e) {  // ✅ Último
}
```

### 3. Consultar Hierarquia

```java
// ✅ Verificar hierarquia antes de ordenar
// FileNotFoundException extends IOException
// Logo: FileNotFound ANTES de IOException
```

---

## Resumo

**Ordem**: **específico** → **genérico** (subclasse antes superclasse).

**Regra**:
- Subclasse **antes** de superclasse
- Folha **antes** de raiz
- Específica **antes** de genérica
- **Exception** sempre por **último**

**Motivo**:
- JVM verifica catch **top-down**
- **Primeiro** compatível vence
- Genérico primeiro = específico **nunca** executa

**Erro compilação**:
- "exception has already been caught"
- Genérico capturou específico antes
- Catch específico = **código morto**

**Sem hierarquia**:
- Ordem **livre**
- IOException e SQLException (irmãs)
- Não há "mais específico"

**Validação**:
- **IDE** detecta ordem errada
- **Compilador** gera erro
- Não gera `.class`

**Regra de Ouro**: Sempre **específico** antes **genérico**. FileNotFound → IOException → Exception. Compilador **detecta** ordem errada. Consultar **hierarquia** de classes.

