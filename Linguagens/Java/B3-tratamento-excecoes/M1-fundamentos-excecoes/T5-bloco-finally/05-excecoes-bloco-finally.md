# T5.05 - Exceções em Bloco Finally

## Introdução

Exceções **podem** ser lançadas em `finally`, mas isso **suprime** exceções anteriores.

```java
/*
 * EXCEÇÕES EM BLOCO FINALLY
 * 
 * PROBLEMA:
 *   - Finally PODE lançar exceção
 *   - Exceção do finally SUPRIME exceção do try/catch
 *   - Perda de informação sobre erro original
 * 
 * SOLUÇÃO:
 *   - Try-catch DENTRO do finally
 *   - Capturar exceções de cleanup
 *   - Não deixar propagar
 */

// ❌ Exceção em finally SUPRIME exceção do try
try {
    throw new Exception("Erro original");  // ❌ SUPRIMIDA
} finally {
    throw new Exception("Erro finally");   // ✅ Propaga (suprime original)
}

// ✅ Capturar exceção em finally
try {
    throw new Exception("Erro original");
} finally {
    try {
        operacaoFinally();  // Pode lançar exceção
    } catch (Exception e) {
        logar(e);  // ✅ Captura (não suprime original)
    }
}
```

**Exceção em finally**: **suprime** exceção do try/catch (evitar).

---

## Fundamentos

### 1. Problema: Supressão de Exceção

```java
// ❌ Exceção em finally SUPRIME exceção do try
public class ProblemaSupressao {
    
    public static void exemploProblematico() {
        try {
            System.out.println("1. Try - lança exceção");
            throw new RuntimeException("Erro IMPORTANTE");
            
        } finally {
            System.out.println("2. Finally - lança exceção");
            throw new RuntimeException("Erro finally");
        }
        
        /*
         * SAÍDA:
         * 1. Try - lança exceção
         * 2. Finally - lança exceção
         * Exception in thread "main" RuntimeException: Erro finally
         * 
         * PROBLEMA:
         *   - Exceção do try: "Erro IMPORTANTE" é SUPRIMIDA
         *   - Exceção do finally: "Erro finally" PROPAGA
         *   - Perda de informação sobre erro original
         *   - Dificulta diagnóstico
         */
    }
    
    public static void exemploComCatch() {
        try {
            System.out.println("1. Try - lança exceção");
            throw new Exception("Erro try");
            
        } catch (Exception e) {
            System.out.println("2. Catch - captura: " + e.getMessage());
            throw new RuntimeException("Erro catch");
            
        } finally {
            System.out.println("3. Finally - lança exceção");
            throw new RuntimeException("Erro finally");
        }
        
        /*
         * SAÍDA:
         * 1. Try - lança exceção
         * 2. Catch - captura: Erro try
         * 3. Finally - lança exceção
         * Exception in thread "main" RuntimeException: Erro finally
         * 
         * PROBLEMA:
         *   - Exceção do catch: "Erro catch" é SUPRIMIDA
         *   - Exceção do finally: "Erro finally" PROPAGA
         *   - Perdeu "Erro catch"
         */
    }
    
    /*
     * REGRA:
     *   - Exceção em finally SUPRIME exceções anteriores
     *   - Apenas ÚLTIMA exceção (do finally) propaga
     *   - ❌ EVITAR lançar exceção em finally
     */
}
```

**Problema**: exceção finally **suprime** exceção try/catch.

### 2. Solução: Try-Catch Dentro do Finally

```java
// ✅ Capturar exceção dentro do finally
public class SolucaoTryCatchFinally {
    
    public static void exemploCorreto() {
        try {
            System.out.println("1. Try - lança exceção");
            throw new RuntimeException("Erro IMPORTANTE");
            
        } finally {
            System.out.println("2. Finally - cleanup");
            
            // ✅ Try-catch DENTRO do finally
            try {
                operacaoFinally();  // Pode lançar exceção
            } catch (Exception e) {
                // ✅ Captura exceção de cleanup
                System.err.println("Erro em finally: " + e.getMessage());
                // NÃO propaga (não suprime exceção original)
            }
        }
        
        /*
         * SAÍDA:
         * 1. Try - lança exceção
         * 2. Finally - cleanup
         * Erro em finally: (se operacaoFinally lançar)
         * Exception in thread "main" RuntimeException: Erro IMPORTANTE
         * 
         * ✅ SOLUÇÃO:
         *   - Exceção original ("Erro IMPORTANTE") PROPAGA
         *   - Exceção de finally capturada separadamente
         *   - Não há supressão
         */
    }
    
    public static void exemploLiberacaoRecurso() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // Processar (pode lançar IOException)
            throw new IOException("Erro ao ler");
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            throw new RuntimeException("Erro crítico", e);
            
        } finally {
            // ✅ Fechar com try-catch
            if (reader != null) {
                try {
                    reader.close();  // Pode lançar IOException
                } catch (IOException e) {
                    // ✅ Captura erro de close()
                    System.err.println("Erro ao fechar: " + e.getMessage());
                    // NÃO propaga (não suprime "Erro crítico")
                }
            }
        }
        
        /*
         * ✅ PADRÃO CORRETO:
         *   - Exceção original propaga
         *   - Erro de close() capturado separadamente
         *   - Sem supressão
         */
    }
    
    private static void operacaoFinally() throws Exception { }
}
```

**Solução**: try-catch **dentro** do finally (captura sem suprimir).

### 3. Close() Pode Lançar Exceção

```java
// ✅ close() pode lançar exceção
public class CloseExcecao {
    
    public static void exemplo() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // Processar
            
        } catch (IOException e) {
            System.err.println("Erro ao ler");
            
        } finally {
            if (reader != null) {
                // ❌ PROBLEMA: close() pode lançar IOException
                // reader.close();  // Pode lançar exceção não tratada
                
                // ✅ SOLUÇÃO: try-catch
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar: " + e.getMessage());
                }
            }
        }
        
        /*
         * POR QUE close() pode lançar exceção?
         * 
         * - Flush de buffer pode falhar
         * - Dispositivo pode ser removido
         * - Disco pode estar cheio
         * - Rede pode cair (streams de rede)
         * 
         * ✅ SEMPRE capturar exceção de close()
         */
    }
}
```

**close()**: pode lançar exceção (sempre capturar).

### 4. Múltiplos Recursos

```java
// ✅ Múltiplos recursos com exceções
public class MultiploRecursosExcecoes {
    
    public static void exemplo() {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = abrirConexao();
            stmt = conn.prepareStatement("SELECT ...");
            rs = stmt.executeQuery();
            // Processar
            
        } catch (SQLException e) {
            System.err.println("Erro SQL: " + e.getMessage());
            
        } finally {
            // ✅ Fechar TODOS com try-catch SEPARADO
            
            // ResultSet
            if (rs != null) {
                try {
                    rs.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar ResultSet: " + e.getMessage());
                }
            }
            
            // PreparedStatement
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar Statement: " + e.getMessage());
                }
            }
            
            // Connection
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    System.err.println("Erro ao fechar Connection: " + e.getMessage());
                }
            }
        }
        
        /*
         * ✅ IMPORTANTE:
         *   - Cada close() com seu PRÓPRIO try-catch
         *   - Se rs.close() falha, ainda tenta stmt e conn
         *   - Sem supressão de exceções
         */
    }
    
    private static Connection abrirConexao() throws SQLException { return null; }
    
    interface Connection {
        PreparedStatement prepareStatement(String sql) throws SQLException;
        void close() throws SQLException;
    }
    
    interface PreparedStatement {
        ResultSet executeQuery() throws SQLException;
        void close() throws SQLException;
    }
    
    interface ResultSet {
        void close() throws SQLException;
    }
}
```

**Múltiplos**: cada close() com try-catch **separado**.

### 5. Exceção em Finally com Return

```java
// ❌ Exceção em finally DESCARTA return
public class ExcecaoFinallyReturn {
    
    public static int exemploProblematico() {
        try {
            System.out.println("1. Try - return 42");
            return 42;  // ❌ DESCARTADO
            
        } finally {
            System.out.println("2. Finally - lança exceção");
            throw new RuntimeException("Erro");  // Descarta return
        }
        
        /*
         * SAÍDA:
         * 1. Try - return 42
         * 2. Finally - lança exceção
         * Exception in thread "main" RuntimeException: Erro
         * (NÃO retorna 42)
         * 
         * PROBLEMA:
         *   - Return 42 é DESCARTADO
         *   - Exceção do finally PROPAGA
         *   - Método não retorna valor
         */
    }
    
    public static int exemploComCatch() {
        try {
            throw new Exception("Erro");
            
        } catch (Exception e) {
            System.out.println("Catch - return -1");
            return -1;  // ❌ DESCARTADO
            
        } finally {
            System.out.println("Finally - lança exceção");
            throw new RuntimeException("Erro finally");
        }
        
        /*
         * SAÍDA:
         * Catch - return -1
         * Finally - lança exceção
         * Exception in thread "main" RuntimeException: Erro finally
         * (NÃO retorna -1)
         */
    }
    
    /*
     * REGRA:
     *   - Exceção em finally DESCARTA return
     *   - Exceção PROPAGA
     *   - Método não retorna valor
     *   - ❌ EVITAR exceção em finally
     */
}
```

**Exceção+Return**: finally exceção **descarta** return do try/catch.

### 6. Logging de Exceção em Finally

```java
// ✅ Logar exceção em finally (sem propagar)
public class LoggingExcecaoFinally {
    
    public static void exemploLogging() {
        FileWriter writer = null;
        
        try {
            writer = new FileWriter("saida.txt");
            writer.write("Dados importantes");
            throw new IOException("Erro ao escrever");
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            throw new RuntimeException("Erro crítico", e);
            
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (IOException e) {
                    // ✅ LOGAR exceção de close()
                    System.err.println("Erro ao fechar (logado): " + e.getMessage());
                    // NÃO relançar (evitar supressão)
                    
                    // Opcional: logar com logger
                    // logger.error("Erro ao fechar", e);
                }
            }
        }
        
        /*
         * ✅ BOM:
         *   - Exceção de close() LOGADA
         *   - NÃO propaga (não suprime original)
         *   - Informação preservada em logs
         */
    }
}
```

**Logging**: logar exceção finally, **não** propagar.

### 7. Cadeia de Exceções

```java
// ✅ Cadeia de exceções (causa raiz)
public class CadeiaExcecoes {
    
    public static void exemplo() {
        try {
            processar();
            
        } catch (RuntimeException e) {
            System.err.println("Exceção capturada: " + e.getMessage());
            
            // ✅ Verificar causa (supressão)
            Throwable causa = e.getCause();
            if (causa != null) {
                System.err.println("Causa: " + causa.getMessage());
            }
            
            // ✅ Stack trace completo
            e.printStackTrace();
        }
    }
    
    private static void processar() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // Processar
            throw new IOException("Erro ao ler");
            
        } catch (IOException e) {
            // ✅ Lançar com causa
            throw new RuntimeException("Erro de processamento", e);
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // ✅ Logar (não propagar)
                    System.err.println("Aviso: Erro ao fechar");
                }
            }
        }
    }
    
    /*
     * ✅ BOA PRÁTICA:
     *   - Lançar exceção com CAUSA (new Exception(msg, causa))
     *   - Preserva cadeia de exceções
     *   - getCause() retorna exceção original
     *   - Stack trace completo
     */
}
```

**Cadeia**: lançar com **causa** (preserva exceção original).

### 8. Suppressed Exceptions (Java 7+)

```java
// ✅ Suppressed exceptions (try-with-resources)
public class SuppressedExceptions {
    
    /*
     * JAVA 7+ (try-with-resources):
     *   - Exceção de close() é ADICIONADA como suppressed
     *   - NÃO suprime exceção original
     *   - getSuppressed() retorna exceções suprimidas
     */
    
    public static void exemploTryWithResources() {
        try (FileReader reader = new FileReader("arquivo.txt")) {
            // Processar
            throw new IOException("Erro ao ler");
            
        } catch (IOException e) {
            System.err.println("Exceção: " + e.getMessage());
            
            // ✅ Verificar exceções suprimidas
            Throwable[] suppressed = e.getSuppressed();
            for (Throwable s : suppressed) {
                System.err.println("Suppressed: " + s.getMessage());
            }
        }
        
        /*
         * SE close() lançar exceção:
         *   - Exceção original: "Erro ao ler" PROPAGA
         *   - Exceção de close(): ADICIONADA como suppressed
         *   - Nenhuma é perdida
         * 
         * ✅ Try-with-resources > finally manual
         */
    }
    
    public static void exemploManual() {
        FileReader reader = null;
        IOException excecaoOriginal = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            throw new IOException("Erro ao ler");
            
        } catch (IOException e) {
            excecaoOriginal = e;
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    if (excecaoOriginal != null) {
                        // ✅ Adicionar como suppressed
                        excecaoOriginal.addSuppressed(e);
                    } else {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        
        if (excecaoOriginal != null) {
            throw new RuntimeException(excecaoOriginal);
        }
    }
}
```

**Suppressed**: try-with-resources adiciona exceção close() como **suppressed**.

### 9. Quando Propagar Exceção de Finally

```java
// ⚠️ Quando propagar exceção de finally
public class PropagacaoExcecaoFinally {
    
    // ❌ EVITAR: propagar exceção de finally
    public static void evitar() {
        try {
            processar();
        } finally {
            // ❌ Lança exceção (suprime exceção do try)
            throw new RuntimeException("Erro cleanup");
        }
    }
    
    // ✅ RARO: propagar apenas se try teve sucesso
    public static void raroMasValido() {
        boolean sucesso = false;
        
        try {
            processar();
            sucesso = true;  // ✅ Try teve sucesso
            
        } finally {
            if (!sucesso) {
                // ✅ Try falhou, não lançar (evitar supressão)
                try {
                    cleanup();
                } catch (Exception e) {
                    logar(e);
                }
            } else {
                // ⚠️ Try teve sucesso, pode lançar
                cleanup();  // Pode lançar exceção
            }
        }
    }
    
    private static void processar() { }
    private static void cleanup() throws Exception { }
    private static void logar(Exception e) { }
}
```

**Propagar**: só se try teve **sucesso** (evitar supressão).

### 10. Resumo Visual: Exceções em Finally

```java
/*
 * EXCEÇÕES EM BLOCO FINALLY
 * 
 * PROBLEMA - SUPRESSÃO:
 * 
 * try {
 *     throw new Exception("Original"); ─────┐ SUPRIMIDA
 * } finally {                               │
 *     throw new Exception("Finally"); ──────┼──┐ PROPAGA
 * }                                         │  │
 * Exceção: "Finally" ◄──────────────────────┘  │
 * ("Original" perdida) ◄───────────────────────┘
 * 
 * 
 * SOLUÇÃO - TRY-CATCH DENTRO:
 * 
 * try {
 *     throw new Exception("Original"); ─────────┐ PROPAGA
 * } finally {                                   │
 *     try {                                     │
 *         cleanup(); ────────┐                  │
 *     } catch (Exc e) {     │                  │
 *         logar(e); ◄───────┘ Captura          │
 *     }                                         │
 * }                                             │
 * Exceção: "Original" ◄─────────────────────────┘
 * (cleanup logado separadamente)
 * 
 * 
 * CLOSE() COM EXCEÇÃO:
 * 
 * try {
 *     throw new IOException("Erro leitura"); ───┐
 * } finally {                                    │
 *     if (reader != null) {                     │
 *         try {                                 │
 *             reader.close(); ───┐              │
 *         } catch (IOException e) {             │
 *             logar(e); ◄────────┘ Captura      │
 *         }                                     │
 *     }                                         │
 * }                                             │
 * IOException: "Erro leitura" ◄─────────────────┘
 * 
 * 
 * EXCEÇÃO + RETURN:
 * 
 * try {
 *     return 42; ──────────────┐ DESCARTADO
 * } finally {                  │
 *     throw new Exception(); ──┼──┐ PROPAGA
 * }                            │  │
 * Exceção lançada ◄────────────┘  │
 * (42 perdido) ◄──────────────────┘
 * 
 * 
 * MÚLTIPLOS RECURSOS:
 * 
 * finally {
 *     // Cada um com TRY-CATCH SEPARADO
 *     
 *     if (r1 != null) {
 *         try { r1.close(); }
 *         catch (Exc e) { logar(e); } ← NÃO afeta r2
 *     }
 *     
 *     if (r2 != null) {
 *         try { r2.close(); }
 *         catch (Exc e) { logar(e); } ← NÃO afeta r3
 *     }
 *     
 *     if (r3 != null) {
 *         try { r3.close(); }
 *         catch (Exc e) { logar(e); }
 *     }
 * }
 * 
 * 
 * REGRAS:
 * 
 * ❌ EVITAR:
 *    - Lançar exceção em finally sem capturar
 *    - Deixar close() lançar exceção
 *    - Propagar exceção de cleanup
 * 
 * ✅ FAZER:
 *    - Try-catch DENTRO do finally
 *    - Capturar exceção de cada close()
 *    - Logar exceções de cleanup
 *    - NÃO propagar (evitar supressão)
 * 
 * ✅ ALTERNATIVA:
 *    - Try-with-resources (Java 7+)
 *    - Exceções suppressed (não perdidas)
 */

public class ResumoExcecoesFinally {
    public static void main(String[] args) {
        System.out.println("=== EXCEÇÕES EM FINALLY ===");
        System.out.println("\n❌ Problema:");
        System.out.println("  - Exceção finally SUPRIME original");
        System.out.println("\n✅ Solução:");
        System.out.println("  - Try-catch DENTRO do finally");
        System.out.println("  - Capturar close() separadamente");
        System.out.println("  - LOGAR, não propagar");
        System.out.println("\n⚠️ close() pode lançar exceção!");
    }
}
```

---

## Aplicabilidade

**Exceções em finally**:
- **Problema**: suprime exceção original
- **Solução**: try-catch **dentro**
- **close()**: sempre capturar

---

## Armadilhas

### 1. Lançar Exceção em Finally

```java
// ❌ Lançar exceção em finally
try {
    throw new Exception("Original");
} finally {
    throw new Exception("Finally");  // ❌ Suprime original
}
```

### 2. Não Capturar close()

```java
// ❌ Não capturar close()
finally {
    reader.close();  // ❌ Pode lançar exceção
}

// ✅ Capturar close()
finally {
    try {
        reader.close();
    } catch (IOException e) {
        logar(e);
    }
}
```

### 3. Não Verificar Null

```java
// ❌ Não verificar null
finally {
    try {
        reader.close();  // ❌ NullPointerException
    } catch (IOException e) { }
}

// ✅ Verificar null
finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException e) { }
    }
}
```

---

## Boas Práticas

### 1. Try-Catch Dentro do Finally

```java
// ✅ Try-catch dentro do finally
finally {
    if (recurso != null) {
        try {
            recurso.close();
        } catch (Exception e) {
            logar(e);  // ✅ Não propaga
        }
    }
}
```

### 2. Cada Close com Try-Catch Separado

```java
// ✅ Cada close com try-catch separado
finally {
    if (r1 != null) try { r1.close(); } catch (Exception e) { logar(e); }
    if (r2 != null) try { r2.close(); } catch (Exception e) { logar(e); }
    if (r3 != null) try { r3.close(); } catch (Exception e) { logar(e); }
}
```

### 3. Usar Try-with-Resources

```java
// ✅ Try-with-resources (Java 7+)
try (FileReader reader = new FileReader("arquivo.txt")) {
    processar(reader);
}  // ✅ Fecha automaticamente, exceções suppressed
```

---

## Resumo

**Exceções em finally**: podem **suprimir** exceção original.

**Problema**:
- Exceção finally **suprime** try/catch
- Perda de informação erro **original**
- Dificulta **diagnóstico**

**Solução**:
- Try-catch **dentro** do finally
- **Capturar** exceção de cleanup
- **Logar**, não propagar
- Não suprime original

**close()**:
- **Pode** lançar exceção
- **Sempre** capturar
- Try-catch para **cada** close()

**Múltiplos recursos**:
- Try-catch **separado** cada um
- Se um falha, **continua** outros
- Sem supressão

**Return**:
- Exceção finally **descarta** return
- Valor **perdido**
- Exceção **propaga**

**Suppressed** (Java 7+):
- Try-with-resources **adiciona** suppressed
- Exceção original **propaga**
- Close() **não** perdida
- `getSuppressed()` retorna array

**Regra de Ouro**: **Nunca** lançar exceção em finally sem capturar. **Sempre** try-catch dentro do finally para close(). **Logar** exceções de cleanup, não propagar. Usar **try-with-resources** quando possível (exceções suppressed).

