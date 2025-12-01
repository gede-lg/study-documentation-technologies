# T7.06 - Relançamento de Exceções

## Introdução

**Relançamento** (rethrow) captura exceção e lança **novamente** (throw).

```java
/*
 * RELANÇAMENTO (rethrow)
 * 
 * CONCEITO:
 *   - Capturar exceção (catch)
 *   - Executar ação (log, cleanup, etc.)
 *   - LANÇAR novamente (throw)
 *   - Propagar para quem chama
 * 
 * PADRÃO:
 * try {
 *     // código
 * } catch (Exception e) {
 *     // log, cleanup, etc.
 *     throw e;  ← RELANÇA
 * }
 * 
 * USO:
 *   - Logar e propagar
 *   - Cleanup e propagar
 *   - Adicionar contexto
 */

// ✅ Relançamento básico
public void metodo() throws IOException {
    try {
        // código que lança IOException
        throw new IOException("Erro original");
        
    } catch (IOException e) {
        System.err.println("Log: " + e.getMessage());
        throw e;  // ✅ RELANÇA mesma exceção
    }
}
```

**Relançamento**: capturar, executar ação, lançar **novamente**.

---

## Fundamentos

### 1. Relançar Mesma Exceção

```java
// ✅ Relançar mesma exceção
public class RelançarMesma {
    
    // ✅ Relançar após log
    public void metodo1() throws IOException {
        try {
            throw new IOException("Erro");
            
        } catch (IOException e) {
            System.err.println("Log: " + e.getMessage());
            throw e;  // ✅ Relança MESMA exceção
        }
    }
    
    // ✅ Relançar após cleanup
    public void metodo2() throws IOException {
        FileReader reader = null;
        try {
            reader = new FileReader("arquivo.txt");
            // usar reader
            
        } catch (IOException e) {
            // Cleanup antes de relançar
            if (reader != null) {
                try { reader.close(); } catch (IOException ex) { }
            }
            throw e;  // Relança após cleanup
        }
    }
    
    // ✅ Usar
    public static void testar() {
        RelançarMesma obj = new RelançarMesma();
        try {
            obj.metodo1();
        } catch (IOException e) {
            System.err.println("Capturada: " + e.getMessage());
        }
        
        /*
         * SAÍDA:
         * Log: Erro
         * Capturada: Erro
         * 
         * Exceção MESMA (relançada)
         */
    }
}
```

**Relançar**: `throw e` (mesma exceção).

### 2. Encadear Nova Exceção

```java
// ✅ Lançar nova exceção com causa original
public class EncadearNova {
    
    // ✅ RuntimeException com causa checked
    public void metodo1() {
        try {
            throw new IOException("Erro I/O");
            
        } catch (IOException e) {
            // Lançar RuntimeException com causa IOException
            throw new RuntimeException("Erro ao processar", e);
            //                                              ↑
            //                                           Causa
        }
    }
    
    // ✅ Exceção customizada com causa
    public void metodo2() throws ProcessamentoException {
        try {
            throw new SQLException("Erro SQL");
            
        } catch (SQLException e) {
            // Lançar customizada com causa SQLException
            throw new ProcessamentoException("Falha processar dados", e);
        }
    }
    
    static class ProcessamentoException extends Exception {
        public ProcessamentoException(String msg, Throwable causa) {
            super(msg, causa);
        }
    }
    
    // ✅ Verificar causa
    public static void testar() {
        EncadearNova obj = new EncadearNova();
        try {
            obj.metodo1();
            
        } catch (RuntimeException e) {
            System.err.println("Exceção: " + e.getMessage());
            System.err.println("Causa: " + e.getCause().getMessage());
            
            /*
             * SAÍDA:
             * Exceção: Erro ao processar
             * Causa: Erro I/O
             */
        }
    }
}
```

**Encadear**: `throw new Exc("msg", e)` (nova com causa).

### 3. Logar e Relançar

```java
// ✅ Logar exceção antes de relançar
public class LogarRelançar {
    
    private static final Logger logger = Logger.getLogger("App");
    
    // ✅ Log completo e relançar
    public void metodo1() throws IOException {
        try {
            throw new IOException("Erro leitura");
            
        } catch (IOException e) {
            // Logar exceção completa
            logger.log(Level.SEVERE, "Erro ao ler arquivo", e);
            throw e;  // Relançar
        }
    }
    
    // ✅ Log resumido e relançar
    public void metodo2() throws SQLException {
        try {
            throw new SQLException("Erro conexão");
            
        } catch (SQLException e) {
            // Log resumido
            logger.severe("Erro banco: " + e.getMessage());
            throw e;  // Relançar
        }
    }
    
    // ✅ Log condicional e relançar
    public void metodo3(boolean logAtivo) throws IOException {
        try {
            throw new IOException("Erro");
            
        } catch (IOException e) {
            if (logAtivo) {
                logger.info("Exceção: " + e.getMessage());
            }
            throw e;  // Relançar sempre
        }
    }
    
    /*
     * QUANDO LOGAR E RELANÇAR:
     *   ✅ Método intermediário (precisa propagar)
     *   ✅ Rastreamento de caminho da exceção
     *   ✅ Métricas/monitoramento
     * 
     * QUANDO NÃO:
     *   ❌ Método final (trata e não propaga)
     *   ❌ Evitar log duplicado
     */
}
```

**Logar**: registrar exceção antes de **relançar**.

### 4. Cleanup e Relançar

```java
// ✅ Cleanup antes de relançar
public class CleanupRelançar {
    
    // ✅ Fechar recurso e relançar
    public void metodo1() throws IOException {
        Connection conn = null;
        try {
            conn = DriverManager.getConnection("jdbc:...");
            // usar conexão
            throw new IOException("Erro");
            
        } catch (IOException e) {
            // Cleanup: fechar conexão
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException ex) {
                    System.err.println("Erro ao fechar: " + ex.getMessage());
                }
            }
            throw e;  // Relançar após cleanup
        }
    }
    
    // ✅ Reverter estado e relançar
    public void metodo2() throws IOException {
        boolean estadoOriginal = ativo;
        try {
            ativo = true;
            // operação que lança exceção
            throw new IOException("Erro");
            
        } catch (IOException e) {
            // Reverter estado
            ativo = estadoOriginal;
            throw e;  // Relançar após reverter
        }
    }
    
    private boolean ativo = false;
    
    // ✅ Liberar lock e relançar
    public void metodo3(Lock lock) throws IOException {
        lock.lock();
        try {
            // operação crítica
            throw new IOException("Erro");
            
        } catch (IOException e) {
            // Liberar lock SEMPRE
            lock.unlock();
            throw e;  // Relançar após liberar
        }
    }
    
    /*
     * PADRÃO:
     * 1. Adquirir recurso
     * 2. try { usar }
     * 3. catch { cleanup + relançar }
     */
}
```

**Cleanup**: liberar recursos antes de **relançar**.

### 5. Adicionar Contexto

```java
// ✅ Adicionar contexto ao relançar
public class AdicionarContexto {
    
    // ✅ Nova exceção com mensagem contextual
    public void processarUsuario(String userId) throws ProcessamentoException {
        try {
            // código que lança IOException
            throw new IOException("Erro leitura");
            
        } catch (IOException e) {
            // Adicionar contexto (userId)
            throw new ProcessamentoException(
                "Erro ao processar usuário: " + userId, e
            );
        }
    }
    
    // ✅ Múltiplos níveis de contexto
    public void processar(String arquivo, int linha) {
        try {
            processarLinha(linha);
            
        } catch (RuntimeException e) {
            // Adicionar contexto (arquivo + linha)
            throw new RuntimeException(
                "Erro em " + arquivo + ":" + linha + " - " + e.getMessage(), e
            );
        }
    }
    
    private void processarLinha(int linha) {
        throw new RuntimeException("Formato inválido");
    }
    
    static class ProcessamentoException extends Exception {
        public ProcessamentoException(String msg, Throwable causa) {
            super(msg, causa);
        }
    }
    
    // ✅ Usar
    public static void testar() throws ProcessamentoException {
        AdicionarContexto obj = new AdicionarContexto();
        obj.processarUsuario("user123");
        
        /*
         * EXCEÇÃO:
         * ProcessamentoException: Erro ao processar usuário: user123
         * Caused by: IOException: Erro leitura
         * 
         * Contexto "user123" adicionado
         */
    }
}
```

**Contexto**: nova exceção com mensagem **detalhada** + causa.

### 6. Relançar Seletivo

```java
// ✅ Relançar apenas certas exceções
public class RelançarSeletivo {
    
    // ✅ Tratar algumas, relançar outras
    public void metodo1() throws SQLException {
        try {
            // código que pode lançar IOException ou SQLException
            if (Math.random() > 0.5) {
                throw new IOException("Erro I/O");
            } else {
                throw new SQLException("Erro SQL");
            }
            
        } catch (IOException e) {
            // TRATA IOException (não relança)
            System.err.println("Erro I/O tratado: " + e.getMessage());
            
        } catch (SQLException e) {
            // RELANÇA SQLException
            System.err.println("Erro SQL - relançando");
            throw e;
        }
    }
    
    // ✅ Relançar se não puder recuperar
    public void metodo2() throws IOException {
        int tentativas = 0;
        while (tentativas < 3) {
            try {
                // tentar operação
                throw new IOException("Erro temporário");
                
            } catch (IOException e) {
                tentativas++;
                if (tentativas < 3) {
                    // Tentar novamente
                    System.err.println("Tentativa " + tentativas + " falhou");
                } else {
                    // Relançar após 3 tentativas
                    throw e;
                }
            }
        }
    }
    
    // ✅ Relançar se crítico
    public void metodo3() throws IOException {
        try {
            throw new IOException("Erro disco");
            
        } catch (IOException e) {
            if (eCritico(e)) {
                // RELANÇA se crítico
                throw e;
            } else {
                // TRATA se não crítico
                System.err.println("Erro não crítico: " + e.getMessage());
            }
        }
    }
    
    private boolean eCritico(IOException e) {
        return e.getMessage().contains("disco");
    }
}
```

**Seletivo**: tratar **algumas**, relançar **outras**.

### 7. Relançar vs Finally

```java
// ✅ Relançar em catch vs finally
public class RelançarVsFinally {
    
    // ✅ Relançar em catch (preferir)
    public void comCatch() throws IOException {
        FileReader reader = null;
        try {
            reader = new FileReader("arquivo.txt");
            
        } catch (IOException e) {
            // Cleanup
            if (reader != null) {
                try { reader.close(); } catch (IOException ex) { }
            }
            throw e;  // ✅ Relançar em catch
        }
    }
    
    // ❌ Relançar em finally (evitar)
    public void comFinally() throws IOException {
        try {
            throw new IOException("Erro");
            
        } finally {
            // ❌ EVITAR relançar em finally
            // throw new RuntimeException("Erro finally");
            // ↑ Suprimiria IOException do try
        }
    }
    
    // ✅ Cleanup em finally, relançar automático
    public void finallyCleanup() throws IOException {
        FileReader reader = null;
        try {
            reader = new FileReader("arquivo.txt");
            throw new IOException("Erro");
            
        } finally {
            // Cleanup em finally
            if (reader != null) {
                try { reader.close(); } catch (IOException e) { }
            }
            // Exceção do try propaga AUTOMATICAMENTE
            // Não precisa throw
        }
    }
    
    /*
     * REGRA:
     * 
     * ✅ Relançar em CATCH (preferir)
     *    - Cleanup + relançar explícito
     * 
     * ✅ Finally SEM relançar
     *    - Cleanup em finally
     *    - Exceção propaga automaticamente
     * 
     * ❌ Relançar em FINALLY (evitar)
     *    - Suprime exceção do try
     */
}
```

**Preferir**: relançar em **catch** (não finally).

### 8. Multi-Catch e Relançar

```java
// ✅ Multi-catch com relançamento
public class MultiCatchRelançar {
    
    // ✅ Multi-catch relançar (Java 7+)
    public void metodo1() throws IOException, SQLException {
        try {
            if (Math.random() > 0.5) {
                throw new IOException("Erro I/O");
            } else {
                throw new SQLException("Erro SQL");
            }
            
        } catch (IOException | SQLException e) {
            // ↑ Multi-catch
            System.err.println("Log: " + e.getMessage());
            throw e;  // ✅ Relança (tipo mais específico)
        }
    }
    
    // ✅ Multi-catch tipo comum
    public void metodo2() throws Exception {
        try {
            if (Math.random() > 0.5) {
                throw new IOException("Erro I/O");
            } else {
                throw new SQLException("Erro SQL");
            }
            
        } catch (IOException | SQLException e) {
            System.err.println("Log: " + e.getMessage());
            throw e;  // Relança (tipo Exception - comum)
        }
    }
    
    /*
     * MULTI-CATCH:
     * 
     * catch (IOException | SQLException e)
     * 
     * Tipo de 'e':
     *   - Java 7+: tipo mais específico (IOException | SQLException)
     *   - Relançar: throw e (mantém tipo original)
     */
}
```

**Multi-catch**: relançar mantém tipo **original**.

### 9. Relançar com Wrapper

```java
// ✅ Wrapper checked → unchecked
public class RelançarWrapper {
    
    // ✅ Converter checked → unchecked
    public void metodo1() {
        // NÃO declara throws (unchecked)
        try {
            throw new IOException("Erro checked");
            
        } catch (IOException e) {
            // Wrapper: RuntimeException com causa IOException
            throw new RuntimeException("Erro ao processar", e);
        }
    }
    
    // ✅ Wrapper genérico
    public void metodo2() {
        try {
            if (Math.random() > 0.5) {
                throw new IOException("Erro I/O");
            } else {
                throw new SQLException("Erro SQL");
            }
            
        } catch (IOException | SQLException e) {
            // Wrapper genérico para ambas
            throw new RuntimeException("Erro sistema", e);
        }
    }
    
    // ✅ Wrapper customizado
    public void metodo3() {
        try {
            throw new SQLException("Erro SQL");
            
        } catch (SQLException e) {
            // Wrapper customizado
            throw new DadosException("Erro acesso dados", e);
        }
    }
    
    static class DadosException extends RuntimeException {
        public DadosException(String msg, Throwable causa) {
            super(msg, causa);
        }
    }
    
    /*
     * WRAPPER checked → unchecked:
     *   - Método NÃO declara throws
     *   - Lança RuntimeException com causa checked
     *   - Quem chama NÃO obrigado capturar
     */
}
```

**Wrapper**: converter checked → **unchecked** (RuntimeException).

### 10. Resumo Visual: Relançamento

```java
/*
 * RELANÇAMENTO DE EXCEÇÕES
 * 
 * CONCEITO:
 * 
 * try {
 *     // código
 * } catch (Exception e) {
 *     // ação (log, cleanup, etc.)
 *     throw e;  ← RELANÇA
 * }
 * 
 * 
 * RELANÇAR MESMA:
 * 
 * public void metodo() throws IOException {
 *     try {
 *         throw new IOException("Erro");
 *     } catch (IOException e) {
 *         System.err.println("Log: " + e);
 *         throw e;  // MESMA exceção
 *     }
 * }
 * 
 * 
 * ENCADEAR NOVA:
 * 
 * public void metodo() {
 *     try {
 *         throw new IOException("Erro I/O");
 *     } catch (IOException e) {
 *         throw new RuntimeException("Erro processar", e);
 *         //                                           ↑
 *         //                                        Causa
 *     }
 * }
 * 
 * 
 * PADRÕES COMUNS:
 * 
 * 1. LOGAR E RELANÇAR:
 * 
 * catch (Exception e) {
 *     logger.log(Level.SEVERE, "Erro", e);
 *     throw e;
 * }
 * 
 * 2. CLEANUP E RELANÇAR:
 * 
 * catch (IOException e) {
 *     if (recurso != null) {
 *         recurso.close();
 *     }
 *     throw e;
 * }
 * 
 * 3. ADICIONAR CONTEXTO:
 * 
 * catch (IOException e) {
 *     throw new IOException("Arquivo: " + nome, e);
 * }
 * 
 * 4. SELETIVO:
 * 
 * catch (IOException e) {
 *     if (critico) {
 *         throw e;  // Relança
 *     } else {
 *         // Trata
 *     }
 * }
 * 
 * 5. WRAPPER (checked → unchecked):
 * 
 * catch (IOException e) {
 *     throw new RuntimeException("Erro", e);
 * }
 * 
 * 
 * CATCH vs FINALLY:
 * 
 * ✅ RELANÇAR EM CATCH:
 * 
 * try {
 *     // código
 * } catch (IOException e) {
 *     cleanup();
 *     throw e;  // ✅ Explícito
 * }
 * 
 * ✅ CLEANUP EM FINALLY:
 * 
 * try {
 *     // código
 * } finally {
 *     cleanup();
 *     // Exceção propaga AUTOMATICAMENTE
 * }
 * 
 * ❌ RELANÇAR EM FINALLY:
 * 
 * try {
 *     throw new IOException();
 * } finally {
 *     throw new RuntimeException();  // ❌ Suprime IOException
 * }
 * 
 * 
 * MULTI-CATCH:
 * 
 * try {
 *     // código
 * } catch (IOException | SQLException e) {
 *     log(e);
 *     throw e;  // Mantém tipo original
 * }
 * 
 * 
 * QUANDO USAR:
 * 
 * ✅ Logar e propagar
 * ✅ Cleanup e propagar
 * ✅ Adicionar contexto
 * ✅ Converter checked → unchecked
 * ✅ Método intermediário (não final)
 * 
 * ❌ Método final (trata, não propaga)
 * ❌ Evitar log duplicado
 * ❌ Relançar em finally
 */

public class ResumoRelançamento {
    public static void main(String[] args) {
        System.out.println("=== RELANÇAMENTO ===");
        System.out.println("\n✅ Conceito:");
        System.out.println("  - Capturar exceção");
        System.out.println("  - Executar ação");
        System.out.println("  - RELANÇAR (throw e)");
        System.out.println("\n✅ Padrões:");
        System.out.println("  - Logar e relançar");
        System.out.println("  - Cleanup e relançar");
        System.out.println("  - Adicionar contexto");
        System.out.println("  - Converter checked → unchecked");
    }
}
```

---

## Aplicabilidade

**Relançamento**:
- **Logar** e propagar
- **Cleanup** e propagar
- **Adicionar** contexto

---

## Armadilhas

### 1. Relançar em Finally

```java
// ❌ Relançar em finally (suprime exceção try)
try {
    throw new IOException("Original");
} finally {
    throw new RuntimeException("Finally");  // ❌ Suprime IOException
}

// ✅ Relançar em catch
try {
    throw new IOException("Original");
} catch (IOException e) {
    throw e;  // ✅ OK
}
```

### 2. Perder Causa Original

```java
// ❌ Perder causa original
catch (IOException e) {
    throw new RuntimeException("Erro");  // ❌ Perdeu causa
}

// ✅ Preservar causa
catch (IOException e) {
    throw new RuntimeException("Erro", e);  // ✅ Preserva
}
```

### 3. Log Duplicado

```java
// ❌ Log duplicado (cada nível loga e relança)
public void metodoA() throws IOException {
    try {
        metodoB();
    } catch (IOException e) {
        logger.severe("Erro A");  // ❌ Log duplicado
        throw e;
    }
}

public void metodoB() throws IOException {
    try {
        throw new IOException();
    } catch (IOException e) {
        logger.severe("Erro B");  // ❌ Log duplicado
        throw e;
    }
}

// ✅ Logar apenas no nível final
public void metodoFinal() {
    try {
        metodoA();
    } catch (IOException e) {
        logger.severe("Erro final");  // ✅ Único log
    }
}
```

---

## Boas Práticas

### 1. Preservar Causa Original

```java
// ✅ Preservar causa ao encadear
catch (IOException e) {
    throw new RuntimeException("Erro processar", e);
    //                                           ↑
    //                                      Preserva
}
```

### 2. Adicionar Contexto Útil

```java
// ✅ Contexto específico
catch (IOException e) {
    throw new IOException(
        "Erro ao ler arquivo '" + filename + "' linha " + lineNumber,
        e
    );
}
```

### 3. Relançar em Catch (Não Finally)

```java
// ✅ Relançar em catch
try {
    // código
} catch (IOException e) {
    cleanup();
    throw e;  // ✅ Explícito em catch
}

// ✅ OU cleanup em finally
try {
    // código
} finally {
    cleanup();  // Exceção propaga automaticamente
}
```

---

## Resumo

**Relançamento**: capturar exceção, executar ação, lançar **novamente**.

**Padrão**:
```java
catch (Exception e) {
    // ação
    throw e;  // Relança
}
```

**Relançar Mesma**:
- `throw e` (mesma exceção)
- Mantém tipo **original**
- Precisa **throws** na assinatura

**Encadear Nova**:
- `throw new Exc("msg", e)` (nova com causa)
- Adiciona **contexto**
- Preserva exceção **original**
- `getCause()` retorna causa

**Padrões**:
1. **Logar** e relançar (rastreamento)
2. **Cleanup** e relançar (liberar recursos)
3. **Adicionar contexto** (informação extra)
4. **Seletivo** (tratar algumas, relançar outras)
5. **Wrapper** checked → unchecked (RuntimeException)

**Catch vs Finally**:
- **Catch**: relançar **explícito** (`throw e`)
- **Finally**: exceção propaga **automaticamente**
- **Não** relançar em finally (suprime try)

**Multi-Catch**:
- `catch (Exc1 | Exc2 e)`
- Relançar mantém tipo **original**
- Java 7+

**Wrapper**:
- Converter checked → **unchecked**
- `throw new RuntimeException("msg", e)`
- Método **não** declara throws
- Quem chama **não** obrigado capturar

**Quando Usar**:
- **Logar** e propagar (rastreamento)
- **Cleanup** antes de propagar
- **Adicionar** contexto (userId, filename, etc.)
- **Converter** checked → unchecked
- Método **intermediário** (não final)

**Quando Não**:
- Método **final** (trata, não propaga)
- Evitar **log duplicado**
- **Não** relançar em finally

**Regra de Ouro**: Relançar quando método **intermediário** (não sabe tratar completamente). **Logar** antes de relançar (rastreamento). **Cleanup** recursos antes de relançar. **Preservar** causa original ao encadear. **Adicionar** contexto útil (IDs, nomes, valores). **Não** relançar em finally (suprime exceção try). Preferir relançar em **catch** (explícito) ou cleanup em **finally** (automático).

