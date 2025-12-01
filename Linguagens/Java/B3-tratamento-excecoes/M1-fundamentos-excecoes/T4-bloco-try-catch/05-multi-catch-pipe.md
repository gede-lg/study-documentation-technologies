# T4.05 - Multi-catch (Java 7+): pipe (|)

## Introdução

**Multi-catch** (Java 7+) permite capturar **múltiplas exceções** em **UM** catch usando `|`.

```java
/*
 * MULTI-CATCH (Java 7+)
 * 
 * SINTAXE:
 * catch (Tipo1 | Tipo2 | Tipo3 e) {
 *     // Trata Tipo1, Tipo2 ou Tipo3
 * }
 * 
 * ANTES (Java 6):
 * catch (Tipo1 e) { código }
 * catch (Tipo2 e) { código }
 * catch (Tipo3 e) { código }
 * 
 * DEPOIS (Java 7+):
 * catch (Tipo1 | Tipo2 | Tipo3 e) { código }
 */

// ✅ Multi-catch
try {
    // código
} catch (IOException | SQLException e) {
    // Captura IOException OU SQLException
    System.err.println("Erro: " + e.getMessage());
    e.printStackTrace();
}
```

**Multi-catch** = capturar **múltiplas** exceções com `|` (pipe).

---

## Fundamentos

### 1. Sintaxe Multi-catch

```java
// ✅ Sintaxe multi-catch
public class SintaxeMultiCatch {
    
    // ❌ ANTES Java 7 (código duplicado)
    public static void antesJava7() {
        try {
            processarDados();
            
        } catch (IOException e) {
            // Mesmo tratamento
            System.err.println("Erro: " + e.getMessage());
            logar(e);
            
        } catch (SQLException e) {
            // ❌ Código DUPLICADO (mesmo tratamento)
            System.err.println("Erro: " + e.getMessage());
            logar(e);
            
        } catch (ParseException e) {
            // ❌ Código DUPLICADO (mesmo tratamento)
            System.err.println("Erro: " + e.getMessage());
            logar(e);
        }
    }
    
    // ✅ DEPOIS Java 7+ (multi-catch)
    public static void depoisJava7() {
        try {
            processarDados();
            
        } catch (IOException | SQLException | ParseException e) {
            // ✅ UM catch para TODAS (sem duplicação)
            System.err.println("Erro: " + e.getMessage());
            logar(e);
        }
        
        /*
         * MULTI-CATCH:
         *   - Usa pipe | para separar tipos
         *   - UMA variável 'e' para todas
         *   - Sem código duplicado
         */
    }
    
    private static void processarDados() throws IOException, SQLException, ParseException { }
    private static void logar(Exception e) { }
}
```

**Sintaxe**: `catch (Tipo1 | Tipo2 | Tipo3 e)` com `|` (pipe).

### 2. Quando Usar Multi-catch

```java
// ✅ Quando usar multi-catch
public class QuandoUsarMultiCatch {
    
    // ✅ USAR: mesmo tratamento
    public static void usarMultiCatch() {
        try {
            operacaoCompleta();
            
        } catch (IOException | SQLException | TimeoutException e) {
            // ✅ Mesmo tratamento para todas
            System.err.println("Operação falhou: " + e.getMessage());
            logar(e);
            enviarAlerta(e);
        }
    }
    
    // ❌ NÃO usar: tratamentos diferentes
    public static void naoUsarMultiCatch() {
        try {
            operacaoCompleta();
            
        } catch (IOException e) {
            // Tratamento específico I/O
            System.err.println("Erro I/O: tentando novamente...");
            tentarNovamente();
            
        } catch (SQLException e) {
            // Tratamento específico SQL
            System.err.println("Erro SQL: verificando conexão...");
            verificarConexao();
            
        } catch (TimeoutException e) {
            // Tratamento específico timeout
            System.err.println("Timeout: aumentando tempo...");
            aumentarTimeout();
        }
        
        /*
         * USAR multi-catch QUANDO:
         *   - Mesmo TRATAMENTO para várias exceções
         *   - Evitar código DUPLICADO
         *   - Simplificar código
         * 
         * NÃO usar QUANDO:
         *   - Tratamentos DIFERENTES
         *   - Ações específicas por tipo
         */
    }
    
    private static void operacaoCompleta() throws IOException, SQLException, TimeoutException { }
    private static void logar(Exception e) { }
    private static void enviarAlerta(Exception e) { }
    private static void tentarNovamente() { }
    private static void verificarConexao() { }
    private static void aumentarTimeout() { }
}
```

**Usar**: mesmo **tratamento** para várias exceções (evita duplicação).

### 3. Restrições Multi-catch

```java
// ✅ Restrições do multi-catch
public class RestricoesMultiCatch {
    
    /*
     * RESTRIÇÃO 1: Não pode haver HIERARQUIA
     * 
     * ❌ ERRO: FileNotFoundException É IOException (subclasse)
     */
    public static void restricao1() {
        try {
            // código
            
        } // catch (IOException | FileNotFoundException e) {
          //     // ❌ ERRO: FileNotFoundException já está em IOException
          // }
        
        /*
         * ERRO COMPILAÇÃO:
         * "The exception FileNotFoundException is already caught 
         *  by the alternative IOException"
         * 
         * MOTIVO:
         *   - IOException captura FileNotFoundException
         *   - Redundante especificar FileNotFoundException
         */
    }
    
    /*
     * RESTRIÇÃO 2: Variável é implicitamente FINAL
     */
    public static void restricao2() {
        try {
            // código
            
        } catch (IOException | SQLException e) {
            // ❌ NÃO pode reatribuir 'e'
            // e = new IOException();  // ERRO
            
            // ✅ Pode usar 'e'
            System.err.println(e.getMessage());
            e.printStackTrace();
        }
        
        /*
         * VARIÁVEL FINAL:
         *   - 'e' é implicitamente final
         *   - NÃO pode reatribuir
         *   - Pode usar métodos
         */
    }
    
    /*
     * RESTRIÇÃO 3: Só métodos COMUNS das exceções
     */
    public static void restricao3() {
        try {
            // código
            
        } catch (IOException | SQLException e) {
            // ✅ Métodos COMUNS (de Exception)
            e.getMessage();
            e.getCause();
            e.printStackTrace();
            
            // ❌ Métodos ESPECÍFICOS (não compilam)
            // if (e instanceof SQLException) {
            //     SQLException sql = (SQLException) e;
            //     sql.getSQLState();  // ✅ Após cast
            // }
        }
    }
}
```

**Restrições**: sem **hierarquia**, variável **final**, só métodos **comuns**.

### 4. Multi-catch vs Múltiplos Catch

```java
// ✅ Comparação: multi-catch vs múltiplos catch
public class MultiCatchVsMultiplos {
    
    // ❌ Múltiplos catch (código duplicado)
    public static void multiplosCatch() {
        try {
            operacao();
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            logar(e);
            
        } catch (SQLException e) {
            System.err.println("Erro: " + e.getMessage());  // Duplicado
            logar(e);                                       // Duplicado
            
        } catch (TimeoutException e) {
            System.err.println("Erro: " + e.getMessage());  // Duplicado
            logar(e);                                       // Duplicado
        }
    }
    
    // ✅ Multi-catch (sem duplicação)
    public static void multiCatch() {
        try {
            operacao();
            
        } catch (IOException | SQLException | TimeoutException e) {
            // ✅ Código uma única vez
            System.err.println("Erro: " + e.getMessage());
            logar(e);
        }
    }
    
    // ✅ Misto: multi-catch + catch específico
    public static void misto() {
        try {
            operacao();
            
        } catch (FileNotFoundException e) {
            // Tratamento ESPECÍFICO para arquivo não encontrado
            System.err.println("Arquivo não encontrado");
            criarArquivoPadrao();
            
        } catch (IOException | SQLException e) {
            // ✅ Multi-catch para tratamento COMUM
            System.err.println("Erro: " + e.getMessage());
            logar(e);
        }
    }
    
    private static void operacao() throws IOException, SQLException, TimeoutException { }
    private static void logar(Exception e) { }
    private static void criarArquivoPadrao() { }
}
```

**Multi-catch**: evita **duplicação** de código (mesmo tratamento).

### 5. Tipo da Variável Multi-catch

```java
// ✅ Tipo da variável em multi-catch
public class TipoVariavelMultiCatch {
    
    public static void demonstrarTipo() {
        try {
            operacao();
            
        } catch (IOException | SQLException e) {
            // ✅ Tipo de 'e': tipo comum mais específico
            
            // getClass(): tipo REAL da exceção
            System.out.println("Tipo real: " + e.getClass().getName());
            // Pode ser: IOException OU SQLException
            
            // ✅ Métodos disponíveis: somente de Exception
            e.getMessage();     // ✅ Exception tem
            e.getCause();       // ✅ Exception tem
            e.printStackTrace();// ✅ Exception tem
            
            // ❌ Métodos específicos NÃO disponíveis
            // e.getSQLState();    // ❌ Só SQLException tem
            
            // ✅ Cast para acessar métodos específicos
            if (e instanceof SQLException) {
                SQLException sql = (SQLException) e;
                System.out.println("SQL State: " + sql.getSQLState());
            }
        }
        
        /*
         * TIPO DA VARIÁVEL:
         *   - Compilador usa tipo COMUM mais específico
         *   - No caso: Exception (pai de ambas)
         *   - Só métodos de Exception disponíveis
         *   - Usar instanceof + cast para específicos
         */
    }
    
    private static void operacao() throws IOException, SQLException { }
}
```

**Tipo variável**: tipo **comum** mais específico (Exception). Só métodos **comuns**.

### 6. Multi-catch com Finally

```java
// ✅ Multi-catch com finally
public class MultiCatchComFinally {
    
    public static void exemplo() {
        Connection conn = null;
        
        try {
            conn = abrirConexao();
            executarOperacao(conn);
            
        } catch (SQLException | TimeoutException e) {
            // ✅ Multi-catch para SQL e Timeout
            System.err.println("Operação falhou: " + e.getMessage());
            logar(e);
            
        } catch (IOException e) {
            // Catch separado para IOException
            System.err.println("Erro I/O: " + e.getMessage());
            
        } finally {
            // ✅ Finally executa SEMPRE
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
    }
    
    private static Connection abrirConexao() throws SQLException { return null; }
    private static void executarOperacao(Connection c) throws SQLException, TimeoutException, IOException { }
    private static void logar(Exception e) { }
    
    interface Connection {
        void close() throws SQLException;
    }
}
```

**Multi-catch** funciona normal com `finally`.

### 7. Multi-catch Aninhado

```java
// ✅ Multi-catch aninhado (raro)
public class MultiCatchAninhado {
    
    public static void exemplo() {
        try {
            operacaoExterna();
            
        } catch (IOException | SQLException e) {
            // ✅ Multi-catch externo
            System.err.println("Erro principal: " + e.getMessage());
            
            try {
                // Tentar recuperar
                operacaoRecuperacao();
                
            } catch (RuntimeException | Error erro) {
                // ✅ Multi-catch interno (aninhado)
                System.err.println("Falha recuperação: " + erro.getMessage());
            }
        }
    }
    
    private static void operacaoExterna() throws IOException, SQLException { }
    private static void operacaoRecuperacao() { }
}
```

**Aninhado**: multi-catch dentro de multi-catch (raro, mas válido).

### 8. Ordem Multi-catch com Outros Catch

```java
// ✅ Ordem multi-catch com outros catch
public class OrdemMultiCatch {
    
    /*
     * HIERARQUIA:
     * Exception
     *   ├── IOException
     *   │     └── FileNotFoundException
     *   └── SQLException
     */
    
    // ✅ Ordem correta
    public static void ordemCorreta() {
        try {
            operacao();
            
        } catch (FileNotFoundException e) {
            // ✅ 1º: Mais específico (subclasse de IOException)
            System.err.println("Arquivo não encontrado");
            
        } catch (IOException | SQLException e) {
            // ✅ 2º: Multi-catch (IOException e SQLException)
            System.err.println("Erro I/O ou SQL");
            
        } catch (Exception e) {
            // ✅ 3º: Genérico (captura demais)
            System.err.println("Erro inesperado");
        }
        
        /*
         * ORDEM:
         *   1. FileNotFoundException (específico)
         *   2. IOException | SQLException (multi-catch)
         *   3. Exception (genérico)
         * 
         * ESPECÍFICO → GENÉRICO
         */
    }
    
    // ❌ Ordem errada (NÃO compila)
    public static void ordemErrada() {
        try {
            operacao();
            
        } // catch (IOException | SQLException e) {
          //     // IOException captura FileNotFoundException
          // }
          // catch (FileNotFoundException e) {
          //     // ❌ ERRO: já capturada por IOException acima
          // }
    }
    
    private static void operacao() throws IOException, SQLException { }
}
```

**Ordem**: multi-catch segue mesma regra (específico→genérico).

### 9. Vantagens Multi-catch

```java
// ✅ Vantagens do multi-catch
public class VantagensMultiCatch {
    
    // ❌ SEM multi-catch (verboso)
    public static void semMultiCatch() {
        try {
            processarArquivo();
            
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            logar("Erro", e);
            enviarEmail(e);
            
        } catch (EOFException e) {
            e.printStackTrace();        // Duplicado
            logar("Erro", e);           // Duplicado
            enviarEmail(e);             // Duplicado
            
        } catch (SocketException e) {
            e.printStackTrace();        // Duplicado
            logar("Erro", e);           // Duplicado
            enviarEmail(e);             // Duplicado
        }
        
        // ❌ Código DUPLICADO 3 vezes
    }
    
    // ✅ COM multi-catch (conciso)
    public static void comMultiCatch() {
        try {
            processarArquivo();
            
        } catch (FileNotFoundException | EOFException | SocketException e) {
            // ✅ Código UMA vez
            e.printStackTrace();
            logar("Erro", e);
            enviarEmail(e);
        }
    }
    
    /*
     * VANTAGENS:
     * 
     * 1. MENOS código (sem duplicação)
     * 2. Mais LEGÍVEL (clara intenção)
     * 3. Fácil MANUTENÇÃO (alterar uma vez)
     * 4. Menos ERROS (não esquecer duplicar mudança)
     */
    
    private static void processarArquivo() throws FileNotFoundException, EOFException, SocketException { }
    private static void logar(String msg, Exception e) { }
    private static void enviarEmail(Exception e) { }
}
```

**Vantagens**: menos código, legível, fácil manutenção, menos erros.

### 10. Resumo Visual: Multi-catch

```java
/*
 * MULTI-CATCH (Java 7+)
 * 
 * SINTAXE:
 * 
 * catch (Tipo1 | Tipo2 | Tipo3 e) {
 *     // Tratamento
 * }
 * 
 * EQUIVALENTE A:
 * 
 * catch (Tipo1 e) { tratamento }
 * catch (Tipo2 e) { tratamento }
 * catch (Tipo3 e) { tratamento }
 * 
 * EXEMPLO:
 * 
 * ┌────────────────────────────────────────┐
 * │ try {                                  │
 * │     operacao();                        │
 * │ }                                      │
 * │ catch (IOException |                   │  ← Multi-catch
 * │        SQLException |                  │
 * │        TimeoutException e) {           │
 * │                                        │
 * │     // Captura QUALQUER uma:          │
 * │     //   - IOException     OU         │
 * │     //   - SQLException    OU         │
 * │     //   - TimeoutException           │
 * │                                        │
 * │     System.err.println(e.getMessage());│
 * │     logar(e);                          │
 * │ }                                      │
 * └────────────────────────────────────────┘
 * 
 * RESTRIÇÕES:
 * 
 * 1. SEM HIERARQUIA:
 *    ✅ IOException | SQLException    (sem relação)
 *    ❌ IOException | FileNotFoundException (hierarquia)
 * 
 * 2. VARIÁVEL FINAL:
 *    ✅ e.getMessage()
 *    ❌ e = new IOException()  (não pode reatribuir)
 * 
 * 3. SÓ MÉTODOS COMUNS:
 *    ✅ e.getMessage()     (Exception tem)
 *    ✅ e.printStackTrace() (Exception tem)
 *    ❌ e.getSQLState()    (só SQLException tem)
 * 
 * QUANDO USAR:
 * 
 * ✅ USAR:
 *    - Mesmo TRATAMENTO para várias exceções
 *    - Evitar código DUPLICADO
 *    - Simplificar código
 * 
 * ❌ NÃO USAR:
 *    - Tratamentos DIFERENTES
 *    - Ações específicas por tipo
 *    - Exceções com HIERARQUIA
 */

public class ResumoMultiCatch {
    public static void main(String[] args) {
        System.out.println("=== MULTI-CATCH (Java 7+) ===");
        System.out.println("\n✅ Sintaxe: catch (Tipo1 | Tipo2 e)");
        System.out.println("✅ Evita código DUPLICADO");
        System.out.println("✅ Mesmo TRATAMENTO para várias");
        System.out.println("\n❌ SEM hierarquia entre tipos");
        System.out.println("❌ Variável implicitamente FINAL");
    }
}
```

---

## Aplicabilidade

**Multi-catch** permite:
- **Evitar** código duplicado
- **Simplificar** código
- Mesmo **tratamento** múltiplas exceções
- Código mais **legível**

---

## Armadilhas

### 1. Hierarquia no Multi-catch

```java
// ❌ Hierarquia (NÃO compila)
catch (IOException | FileNotFoundException e) {
    // ❌ ERRO: FileNotFound já em IOException
}
```

### 2. Reatribuir Variável

```java
// ❌ Reatribuir variável final
catch (IOException | SQLException e) {
    e = new IOException();  // ❌ ERRO: final
}
```

### 3. Métodos Específicos

```java
// ❌ Método específico sem cast
catch (IOException | SQLException e) {
    e.getSQLState();  // ❌ ERRO: só SQLException tem
}
```

---

## Boas Práticas

### 1. Usar Quando Tratamento Igual

```java
// ✅ Mesmo tratamento
catch (IOException | SQLException | TimeoutException e) {
    logar(e);  // Mesmo para todas
}
```

### 2. Não Usar com Hierarquia

```java
// ✅ Sem hierarquia
catch (IOException | SQLException e) {  // OK
}

// ❌ Com hierarquia
// catch (IOException | FileNotFoundException e) {  // ERRO
// }
```

### 3. Cast para Métodos Específicos

```java
// ✅ Cast quando necessário
catch (IOException | SQLException e) {
    if (e instanceof SQLException) {
        SQLException sql = (SQLException) e;
        sql.getSQLState();  // ✅ Após cast
    }
}
```

---

## Resumo

**Multi-catch** (Java 7+): captura **múltiplas** exceções com `|` (pipe).

**Sintaxe**:
```java
catch (Tipo1 | Tipo2 | Tipo3 e) {
    // Trata qualquer uma
}
```

**Vantagens**:
- **Evita** código duplicado
- Mais **legível**
- Fácil **manutenção**
- **Simplifica** código

**Restrições**:
- **Sem hierarquia** entre tipos (não pode IOException | FileNotFoundException)
- Variável implicitamente **FINAL** (não pode reatribuir)
- Só métodos **comuns** (de Exception)

**Quando usar**:
- Mesmo **tratamento** para várias
- Evitar **duplicação** código
- **Simplificar** código

**Tipo variável**:
- Tipo **comum** mais específico
- Geralmente **Exception**
- Usar **cast** para métodos específicos

**Regra de Ouro**: Multi-catch quando **mesmo tratamento** para várias exceções. Sem **hierarquia** entre tipos. Variável **final**. Só métodos **comuns** (Exception). Cast para métodos **específicos**.

