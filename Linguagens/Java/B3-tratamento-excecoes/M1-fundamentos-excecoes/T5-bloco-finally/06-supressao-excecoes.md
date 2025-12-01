# T5.06 - Supressão de Exceções

## Introdução

**Supressão** ocorre quando uma exceção **oculta** outra (geralmente em `finally`).

```java
/*
 * SUPRESSÃO DE EXCEÇÕES
 * 
 * O QUE É:
 *   - Uma exceção OCULTA outra
 *   - Exceção original é PERDIDA
 *   - Apenas última exceção propaga
 * 
 * ONDE OCORRE:
 *   - Exceção em finally suprime exceção do try/catch
 *   - Return em finally suprime exceção do try/catch
 *   - Exceção em catch suprime exceção do try (rara)
 * 
 * PROBLEMA:
 *   - Perda de informação
 *   - Dificulta diagnóstico
 *   - Erro silencioso
 */

// ❌ Supressão: exceção finally oculta exceção try
try {
    throw new Exception("Original");  // ❌ SUPRIMIDA
} finally {
    throw new Exception("Finally");   // ✅ Propaga
}
// Só "Finally" propaga, "Original" perdida

// ✅ Solução: capturar exceção finally
try {
    throw new Exception("Original");  // ✅ Propaga
} finally {
    try {
        operacao();  // Pode lançar
    } catch (Exception e) {
        logar(e);  // ✅ Não suprime
    }
}
```

**Supressão**: exceção **oculta** outra (evitar).

---

## Fundamentos

### 1. Supressão por Exceção em Finally

```java
// ❌ Supressão por exceção em finally
public class SupressaoExcecaoFinally {
    
    public static void exemploSupressao() {
        try {
            System.out.println("1. Try - lança exceção");
            throw new IOException("Erro ao ler arquivo");  // ❌ SUPRIMIDA
            
        } finally {
            System.out.println("2. Finally - lança exceção");
            throw new RuntimeException("Erro ao fechar");  // ✅ Propaga
        }
        
        /*
         * SAÍDA:
         * 1. Try - lança exceção
         * 2. Finally - lança exceção
         * Exception in thread "main" RuntimeException: Erro ao fechar
         * 
         * SUPRESSÃO:
         *   - IOException "Erro ao ler arquivo" é SUPRIMIDA
         *   - RuntimeException "Erro ao fechar" PROPAGA
         *   - IOException PERDIDA (não aparece em stack trace)
         */
    }
    
    public static void exemploComCatch() {
        try {
            throw new IOException("Erro I/O");
            
        } catch (IOException e) {
            System.out.println("Catch - captura IOException");
            throw new RuntimeException("Erro processamento");  // ❌ SUPRIMIDA
            
        } finally {
            System.out.println("Finally - lança exceção");
            throw new RuntimeException("Erro cleanup");  // ✅ Propaga
        }
        
        /*
         * SAÍDA:
         * Catch - captura IOException
         * Finally - lança exceção
         * Exception in thread "main" RuntimeException: Erro cleanup
         * 
         * SUPRESSÃO:
         *   - RuntimeException "Erro processamento" SUPRIMIDA
         *   - RuntimeException "Erro cleanup" PROPAGA
         */
    }
    
    /*
     * REGRA:
     *   - Exceção em finally SEMPRE suprime exceções anteriores
     *   - Apenas ÚLTIMA exceção (do finally) propaga
     *   - ❌ PROBLEMA: perda de informação sobre erro original
     */
}
```

**Exceção finally**: suprime exceção try/catch.

### 2. Supressão por Return em Finally

```java
// ❌ Supressão por return em finally
public class SupressaoReturnFinally {
    
    public static int exemploSupressao() {
        try {
            System.out.println("1. Try - lança exceção");
            throw new RuntimeException("Erro IMPORTANTE");  // ❌ SUPRIMIDA
            
        } finally {
            System.out.println("2. Finally - return");
            return 999;  // ⚠️ Suprime exceção
        }
        
        /*
         * SAÍDA:
         * 1. Try - lança exceção
         * 2. Finally - return
         * (retorna 999)
         * 
         * SUPRESSÃO:
         *   - RuntimeException "Erro IMPORTANTE" SUPRIMIDA
         *   - Return 999 SUPRIME exceção
         *   - Método retorna normalmente (sem exceção)
         *   - ❌ Erro SILENCIOSO
         */
    }
    
    public static int exemploComCatch() {
        try {
            throw new IOException("Erro I/O");
            
        } catch (IOException e) {
            System.out.println("Catch - captura e relança");
            throw new RuntimeException("Erro crítico", e);  // ❌ SUPRIMIDA
            
        } finally {
            System.out.println("Finally - return");
            return -1;  // ⚠️ Suprime exceção
        }
        
        /*
         * SAÍDA:
         * Catch - captura e relança
         * Finally - return
         * (retorna -1)
         * 
         * SUPRESSÃO:
         *   - RuntimeException "Erro crítico" SUPRIMIDA
         *   - Return -1 SUPRIME exceção
         *   - Quem chama recebe -1 (sem saber do erro)
         */
    }
    
    /*
     * REGRA:
     *   - Return em finally SUPRIME exceções
     *   - Método retorna normalmente (sem exceção)
     *   - ❌ EVITAR return em finally
     */
}
```

**Return finally**: suprime exceção (retorna normal).

### 3. Problema: Perda de Informação

```java
// ❌ Perda de informação por supressão
public class PerdaInformacao {
    
    public static void processar() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("dados_importantes.txt");
            // Processar dados críticos
            throw new IOException("Falha crítica ao processar dados");  // ❌ SUPRIMIDA
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            throw new RuntimeException("Erro de processamento", e);  // ❌ SUPRIMIDA
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // ❌ PROBLEMA: lançar aqui suprime exceção original
                    throw new RuntimeException("Erro ao fechar");  // Suprime tudo
                }
            }
        }
        
        /*
         * PROBLEMA:
         *   - "Falha crítica ao processar dados" PERDIDA
         *   - "Erro de processamento" PERDIDO
         *   - Só "Erro ao fechar" propaga
         *   - DIAGNÓSTICO: impossível saber o erro real
         *   - IMPACTO: dados críticos podem estar corrompidos
         */
    }
    
    /*
     * SOLUÇÃO: NÃO lançar em finally
     * 
     * finally {
     *     if (reader != null) {
     *         try {
     *             reader.close();
     *         } catch (IOException e) {
     *             // ✅ LOGAR, não lançar
     *             logger.error("Erro ao fechar", e);
     *         }
     *     }
     * }
     */
}
```

**Perda**: exceção **original** perdida (diagnóstico impossível).

### 4. Solução: Capturar Exceção em Finally

```java
// ✅ Solução: capturar exceção em finally
public class SolucaoCapturar {
    
    public static void processar() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // Processar
            throw new IOException("Erro ao processar");  // ✅ PROPAGA
            
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
            throw new RuntimeException("Erro crítico", e);  // ✅ PROPAGA
            
        } finally {
            if (reader != null) {
                // ✅ Try-catch DENTRO do finally
                try {
                    reader.close();
                } catch (IOException e) {
                    // ✅ Captura (não suprime original)
                    System.err.println("Aviso: Erro ao fechar - " + e.getMessage());
                    // Opcional: logar com logger
                }
            }
        }
        
        /*
         * RESULTADO:
         *   - RuntimeException "Erro crítico" PROPAGA
         *   - IOException de close() capturada e logada
         *   - SEM supressão
         *   - Informação completa preservada
         */
    }
}
```

**Solução**: try-catch **dentro** finally (não suprime).

### 5. Suppressed Exceptions (Java 7+)

```java
// ✅ Suppressed exceptions: solução automática
public class SuppressedExceptions {
    
    /*
     * JAVA 7+ (try-with-resources):
     *   - Exceção de close() NÃO suprime exceção original
     *   - Exceção de close() ADICIONADA como "suppressed"
     *   - Ambas exceções preservadas
     *   - getSuppressed() retorna array de exceções suprimidas
     */
    
    // ✅ Try-with-resources: sem supressão
    public static void exemploTryWithResources() {
        try (FileReader reader = new FileReader("arquivo.txt")) {
            System.out.println("Processando");
            throw new IOException("Erro ao processar");  // ✅ Principal
            
        } catch (IOException e) {
            System.err.println("Exceção principal: " + e.getMessage());
            
            // ✅ Verificar exceções suppressed
            Throwable[] suppressed = e.getSuppressed();
            System.err.println("Suppressed count: " + suppressed.length);
            
            for (Throwable s : suppressed) {
                System.err.println("  Suppressed: " + s.getMessage());
            }
        }
        
        /*
         * SE close() lançar IOException:
         * 
         * SAÍDA:
         * Processando
         * Exceção principal: Erro ao processar
         * Suppressed count: 1
         *   Suppressed: (exceção de close())
         * 
         * ✅ AMBAS exceções preservadas:
         *   - Principal: "Erro ao processar"
         *   - Suppressed: exceção de close()
         */
    }
    
    // ❌ Finally manual: COM supressão
    public static void exemploFinallyManual() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            throw new IOException("Erro ao processar");  // ❌ Suprimida
            
        } catch (IOException e) {
            throw new RuntimeException("Erro processamento", e);  // ❌ Suprimida
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // ❌ Lançar suprime exceção do catch
                    throw new RuntimeException("Erro close");  // Suprime tudo
                }
            }
        }
        
        /*
         * COMPARAÇÃO:
         * 
         * TRY-WITH-RESOURCES:
         *   ✅ SEM supressão
         *   ✅ Exceções suppressed
         *   ✅ Informação completa
         * 
         * FINALLY MANUAL (com throw):
         *   ❌ COM supressão
         *   ❌ Perda de informação
         *   ❌ Diagnóstico difícil
         */
    }
}
```

**Suppressed**: try-with-resources **adiciona** close() como suppressed.

### 6. Adicionar Manualmente Suppressed

```java
// ✅ Adicionar manualmente exceção suppressed
public class AdicionarSuppressed {
    
    public static void processar() {
        FileReader reader = null;
        IOException excecaoOriginal = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // Processar
            throw new IOException("Erro ao processar");
            
        } catch (IOException e) {
            excecaoOriginal = e;  // ✅ Guardar original
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    if (excecaoOriginal != null) {
                        // ✅ Adicionar como suppressed
                        excecaoOriginal.addSuppressed(e);
                    } else {
                        // Se não tem original, lançar close()
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        
        // ✅ Lançar original (com suppressed)
        if (excecaoOriginal != null) {
            throw new RuntimeException(excecaoOriginal);
        }
        
        /*
         * VANTAGEM:
         *   - Exceção original PROPAGA
         *   - Exceção de close() como SUPPRESSED
         *   - Informação completa preservada
         * 
         * ✅ PADRÃO:
         *   1. Guardar exceção original
         *   2. Capturar exceção de close()
         *   3. Adicionar como suppressed
         *   4. Lançar original
         */
    }
}
```

**Manual**: adicionar close() como suppressed com `addSuppressed()`.

### 7. Múltiplas Supressões

```java
// ✅ Múltiplas exceções suppressed
public class MultiplasSuppressoes {
    
    public static void processar() {
        Recurso1 r1 = null;
        Recurso2 r2 = null;
        Recurso3 r3 = null;
        Exception excecaoOriginal = null;
        
        try {
            r1 = new Recurso1();
            r2 = new Recurso2();
            r3 = new Recurso3();
            
            // Processar
            throw new Exception("Erro processamento");
            
        } catch (Exception e) {
            excecaoOriginal = e;
            
        } finally {
            // ✅ Fechar todos, adicionar suppressed
            
            if (r3 != null) {
                try {
                    r3.fechar();
                } catch (Exception e) {
                    if (excecaoOriginal != null) {
                        excecaoOriginal.addSuppressed(e);
                    }
                }
            }
            
            if (r2 != null) {
                try {
                    r2.fechar();
                } catch (Exception e) {
                    if (excecaoOriginal != null) {
                        excecaoOriginal.addSuppressed(e);
                    }
                }
            }
            
            if (r1 != null) {
                try {
                    r1.fechar();
                } catch (Exception e) {
                    if (excecaoOriginal != null) {
                        excecaoOriginal.addSuppressed(e);
                    }
                }
            }
        }
        
        if (excecaoOriginal != null) {
            throw new RuntimeException(excecaoOriginal);
        }
        
        /*
         * RESULTADO:
         *   - Exceção original: "Erro processamento"
         *   - Suppressed: exceção de r3.fechar()
         *   - Suppressed: exceção de r2.fechar()
         *   - Suppressed: exceção de r1.fechar()
         * 
         * ✅ TODAS exceções preservadas
         */
    }
    
    static class Recurso1 { void fechar() throws Exception { } }
    static class Recurso2 { void fechar() throws Exception { } }
    static class Recurso3 { void fechar() throws Exception { } }
}
```

**Múltiplas**: adicionar **todas** close() como suppressed.

### 8. Detectar Supressão em Stack Trace

```java
// ✅ Detectar supressão em stack trace
public class DetectarSupressao {
    
    public static void exemplo() {
        try {
            metodoComSupressao();
            
        } catch (Exception e) {
            System.err.println("=== EXCEÇÃO CAPTURADA ===");
            System.err.println("Principal: " + e.getMessage());
            System.err.println();
            
            // ✅ Stack trace mostra suppressed
            e.printStackTrace();
            
            /*
             * SAÍDA (com suppressed):
             * 
             * java.lang.RuntimeException: Erro processamento
             *     at ...
             *     Suppressed: java.io.IOException: Erro close
             *         at ...
             * 
             * SAÍDA (sem suppressed - supressão):
             * 
             * java.lang.RuntimeException: Erro close
             *     at ...
             * 
             * (Exceção original PERDIDA - só aparece a de close)
             */
        }
    }
    
    private static void metodoComSupressao() throws Exception {
        try (RecursoAutofechavel recurso = new RecursoAutofechavel()) {
            throw new Exception("Erro processamento");
        }
    }
    
    static class RecursoAutofechavel implements AutoCloseable {
        @Override
        public void close() throws Exception {
            throw new IOException("Erro close");
        }
    }
}
```

**Stack trace**: mostra exceção principal **e** suppressed.

### 9. Quando Usar Suppressed

```java
// ✅ Quando usar suppressed
public class QuandoUsarSuppressed {
    
    // ✅ USAR: quando exceção de cleanup não deve suprimir original
    public static void usarSuppressed() {
        IOException excecaoOriginal = null;
        FileReader reader = null;
        
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
                        // ✅ Adicionar suppressed
                        excecaoOriginal.addSuppressed(e);
                    }
                }
            }
        }
        
        if (excecaoOriginal != null) {
            throw new RuntimeException(excecaoOriginal);
        }
    }
    
    // ✅ NÃO USAR: quando exceção de cleanup não é importante
    public static void naoUsarSuppressed() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            throw new IOException("Erro ao ler");
            
        } catch (IOException e) {
            throw new RuntimeException("Erro crítico", e);
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    // ✅ Apenas logar (não adicionar suppressed)
                    System.err.println("Aviso: erro ao fechar");
                    // Exceção de close não é crítica
                }
            }
        }
    }
    
    /*
     * QUANDO USAR:
     *   ✅ Exceção de cleanup é IMPORTANTE
     *   ✅ Quer preservar TODAS exceções
     *   ✅ Diagnóstico completo necessário
     * 
     * QUANDO NÃO USAR:
     *   ❌ Exceção de cleanup não é importante
     *   ❌ Apenas logar é suficiente
     *   ❌ Evitar complexidade desnecessária
     */
}
```

**Usar suppressed**: quando exceção close() é **importante**.

### 10. Resumo Visual: Supressão de Exceções

```java
/*
 * SUPRESSÃO DE EXCEÇÕES
 * 
 * SUPRESSÃO POR EXCEÇÃO EM FINALLY:
 * 
 * try {
 *     throw new Exc("Original"); ──────┐ SUPRIMIDA
 * } finally {                          │
 *     throw new Exc("Finally"); ───────┼──┐ PROPAGA
 * }                                    │  │
 * Exceção: "Finally" ◄─────────────────┘  │
 * ("Original" PERDIDA) ◄──────────────────┘
 * 
 * 
 * SUPRESSÃO POR RETURN EM FINALLY:
 * 
 * try {
 *     throw new Exc("Erro"); ──────────┐ SUPRIMIDA
 * } finally {                          │
 *     return 0; ───────────────────────┼──┐ SUPRIME
 * }                                    │  │
 * Retorna 0 (sem exceção) ◄────────────┘  │
 * (Exceção PERDIDA) ◄─────────────────────┘
 * 
 * 
 * SOLUÇÃO - CAPTURAR EM FINALLY:
 * 
 * try {
 *     throw new Exc("Original"); ──────────┐ PROPAGA
 * } finally {                              │
 *     try {                                │
 *         cleanup(); ──────┐               │
 *     } catch (Exc e) {   │               │
 *         logar(e); ◄─────┘ Captura       │
 *     }                                    │
 * }                                        │
 * Exceção: "Original" ◄────────────────────┘
 * (cleanup logado separadamente)
 * 
 * 
 * SUPPRESSED EXCEPTIONS (Java 7+):
 * 
 * try (Recurso r = abrir()) {
 *     throw new Exc("Principal"); ─────────┐ Principal
 * }                                        │
 * // close() automático ──────┐           │
 *                             │           │
 * Exceção: "Principal" ◄──────┴───────────┘
 *   Suppressed: (exceção close()) ◄───────┘
 * 
 * 
 * ADICIONAR MANUALMENTE SUPPRESSED:
 * 
 * Exc original = null;
 * try {
 *     throw new Exc("Original"); ──────┐ Guardar
 * } catch (Exc e) {                   │
 *     original = e; ◄─────────────────┘
 * } finally {                         │
 *     try {                           │
 *         close(); ────────┐          │
 *     } catch (Exc e) {   │          │
 *         original.addSuppressed(e); ◄┴─┐ Adicionar
 *     }                                 │
 * }                                     │
 * throw original; ◄─────────────────────┘ Lançar com suppressed
 * 
 * 
 * COMPARAÇÃO:
 * 
 * ❌ COM SUPRESSÃO (finally lança):
 *    - Exceção original PERDIDA
 *    - Só exceção finally propaga
 *    - Diagnóstico impossível
 * 
 * ✅ SEM SUPRESSÃO (finally captura):
 *    - Exceção original PROPAGA
 *    - Exceção finally LOGADA
 *    - Informação completa
 * 
 * ✅ SUPPRESSED (try-with-resources):
 *    - Exceção original PROPAGA
 *    - Exceção close() SUPPRESSED
 *    - Ambas preservadas
 *    - getSuppressed() retorna array
 * 
 * 
 * REGRAS:
 * 
 * ❌ EVITAR:
 *    - Lançar exceção em finally
 *    - Return em finally (suprime exceção)
 *    - Deixar close() lançar exceção
 * 
 * ✅ FAZER:
 *    - Try-catch DENTRO do finally
 *    - Logar exceções de cleanup
 *    - Usar try-with-resources
 *    - Adicionar suppressed quando importante
 */

public class ResumoSupressao {
    public static void main(String[] args) {
        System.out.println("=== SUPRESSÃO DE EXCEÇÕES ===");
        System.out.println("\n❌ Problema:");
        System.out.println("  - Exceção finally SUPRIME original");
        System.out.println("  - Return finally SUPRIME exceção");
        System.out.println("  - Perda de informação");
        System.out.println("\n✅ Solução:");
        System.out.println("  - Try-catch DENTRO finally");
        System.out.println("  - Try-with-resources (suppressed)");
        System.out.println("  - addSuppressed() manual");
        System.out.println("\n🎯 Objetivo: preservar TODAS exceções");
    }
}
```

---

## Aplicabilidade

**Supressão**:
- **Problema**: exceção **oculta** outra
- **Solução**: capturar, suppressed
- **Objetivo**: preservar **todas**

---

## Armadilhas

### 1. Lançar em Finally

```java
// ❌ Lançar em finally suprime
try {
    throw new Exception("Original");
} finally {
    throw new Exception("Finally");  // ❌ Suprime
}
```

### 2. Return em Finally

```java
// ❌ Return em finally suprime
try {
    throw new Exception("Erro");
} finally {
    return 0;  // ❌ Suprime exceção
}
```

### 3. Não Usar Try-with-Resources

```java
// ❌ Finally manual (risco supressão)
finally {
    recurso.close();  // Pode lançar e suprimir
}

// ✅ Try-with-resources (suppressed)
try (Recurso r = abrir()) {
    processar(r);
}  // ✅ Exceções suppressed
```

---

## Boas Práticas

### 1. Try-Catch Dentro do Finally

```java
// ✅ Capturar em finally
finally {
    try {
        recurso.close();
    } catch (Exception e) {
        logar(e);  // ✅ Não suprime
    }
}
```

### 2. Usar Try-with-Resources

```java
// ✅ Try-with-resources (Java 7+)
try (FileReader r = new FileReader("arquivo.txt")) {
    processar(r);
}  // ✅ Exceções suppressed automaticamente
```

### 3. Adicionar Suppressed Quando Importante

```java
// ✅ Adicionar suppressed
Exception original = null;
try {
    operacao();
} catch (Exception e) {
    original = e;
} finally {
    try {
        cleanup();
    } catch (Exception e) {
        if (original != null) {
            original.addSuppressed(e);
        }
    }
}
if (original != null) throw original;
```

---

## Resumo

**Supressão**: exceção **oculta** outra (perda de informação).

**Causas**:
- **Exceção** em finally
- **Return** em finally
- **throw** em catch (raro)

**Problema**:
- Exceção **original** perdida
- Apenas **última** propaga
- **Diagnóstico** impossível
- Erro **silencioso** (return)

**Solução 1 - Capturar**:
- Try-catch **dentro** finally
- **Logar** exceção cleanup
- **Não** propagar
- Original **preservada**

**Solução 2 - Suppressed**:
- **Try-with-resources** (Java 7+)
- Exceção original **propaga**
- Close() **suppressed**
- `getSuppressed()` retorna array
- **Ambas** preservadas

**Solução 3 - Manual**:
- Guardar exceção **original**
- Capturar exceção **cleanup**
- `addSuppressed()` manual
- Lançar **original** com suppressed

**Quando usar suppressed**:
- Exceção cleanup **importante**
- Diagnóstico **completo** necessário
- Preservar **todas** exceções

**Stack trace**:
- Mostra exceção **principal**
- Mostra **suppressed** (indentado)
- "Suppressed:" no output

**Regra de Ouro**: **Nunca** lançar exceção em finally sem capturar (suprime original). **Nunca** return em finally (suprime exceção silenciosamente). **Sempre** usar try-with-resources quando possível (suppressed automático). Adicionar **suppressed** manual quando exceção cleanup é importante.

