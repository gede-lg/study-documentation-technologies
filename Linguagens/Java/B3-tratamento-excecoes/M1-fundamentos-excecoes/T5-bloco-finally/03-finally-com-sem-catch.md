# T5.03 - Finally com e sem Catch

## Introdução

O bloco `finally` pode ser usado **com** ou **sem** `catch`.

```java
/*
 * FINALLY COM E SEM CATCH
 * 
 * 3 COMBINAÇÕES VÁLIDAS:
 * 
 * 1. Try + Catch + Finally:
 *    try { }
 *    catch (Exception e) { }
 *    finally { }
 * 
 * 2. Try + Finally (sem catch):
 *    try { }
 *    finally { }
 * 
 * 3. Try + Catch (sem finally):
 *    try { }
 *    catch (Exception e) { }
 * 
 * ❌ INVÁLIDO: Try sozinho
 *    try { }  // ERRO de compilação
 */

// ✅ Válido: try + catch + finally
try {
    // código
} catch (Exception e) {
    // tratamento
} finally {
    // cleanup
}

// ✅ Válido: try + finally (sem catch)
try {
    // código
} finally {
    // cleanup (exceção propaga)
}
```

**Finally**: pode ter `catch` ou **não**.

---

## Fundamentos

### 1. Try + Catch + Finally

```java
// ✅ Try + Catch + Finally (completo)
public class TryCatchFinally {
    
    public static void exemploCompleto() {
        System.out.println("=== TRY + CATCH + FINALLY ===");
        
        try {
            System.out.println("1. Try - executando");
            int resultado = 10 / 0;  // Exceção
            System.out.println("X. Try - fim (não executa)");
            
        } catch (ArithmeticException e) {
            System.out.println("2. Catch - captura exceção");
            
        } finally {
            System.out.println("3. Finally - sempre executa");
        }
        
        System.out.println("4. Depois (continua normalmente)");
        
        /*
         * SAÍDA:
         * === TRY + CATCH + FINALLY ===
         * 1. Try - executando
         * 2. Catch - captura exceção
         * 3. Finally - sempre executa
         * 4. Depois (continua normalmente)
         * 
         * FLUXO:
         *   Try → Exceção → Catch → Finally → Depois
         * 
         * USO:
         *   - Capturar E tratar exceção
         *   - Liberar recursos
         *   - Continuar execução após tratamento
         */
    }
    
    public static void exemplo2() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // processar
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado");
            
        } catch (IOException e) {
            System.err.println("Erro ao ler");
            
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar");
                }
            }
        }
    }
}
```

**Try+Catch+Finally**: captura **e** trata, libera recursos, **continua**.

### 2. Try + Finally (Sem Catch)

```java
// ✅ Try + Finally (sem catch - exceção propaga)
public class TryFinally {
    
    public static void exemploSemCatch() {
        System.out.println("=== TRY + FINALLY (sem catch) ===");
        
        try {
            System.out.println("1. Try - executando");
            int resultado = 10 / 0;  // Exceção
            System.out.println("X. Try - fim (não executa)");
            
        } finally {
            System.out.println("2. Finally - executa ANTES de propagar");
        }
        
        // System.out.println("X. Depois (NÃO executa - exceção propaga)");
        
        /*
         * SAÍDA:
         * === TRY + FINALLY (sem catch) ===
         * 1. Try - executando
         * 2. Finally - executa ANTES de propagar
         * Exception in thread "main" java.lang.ArithmeticException: / by zero
         * 
         * FLUXO:
         *   Try → Exceção → Finally → Exceção PROPAGA
         * 
         * USO:
         *   - Liberar recursos MAS não tratar exceção
         *   - Deixar exceção propagar
         *   - Cleanup garantido mesmo sem tratamento
         */
    }
    
    public static void exemplo2() throws IOException {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // processar (pode lançar IOException)
            
        } finally {
            // ✅ Libera recurso MESMO que exceção propague
            if (reader != null) {
                reader.close();
            }
        }
        
        // ✅ IOException propaga para quem chamou
    }
    
    /*
     * QUANDO USAR TRY + FINALLY (sem catch):
     * 
     * 1. NÃO quer tratar exceção (deixar propagar)
     * 2. MAS precisa liberar recursos
     * 3. Quem chamou vai tratar exceção
     * 4. Cleanup garantido sem tratamento
     */
}
```

**Try+Finally**: libera recursos, exceção **propaga**.

### 3. Diferença: Com Catch vs Sem Catch

```java
// ✅ Diferença: com catch vs sem catch
public class DiferencaComSemCatch {
    
    // ✅ COM CATCH: exceção é CAPTURADA
    public static void comCatch() {
        System.out.println("=== COM CATCH ===");
        
        try {
            System.out.println("1. Try");
            throw new RuntimeException("Erro");
            
        } catch (RuntimeException e) {
            System.out.println("2. Catch - CAPTURA");
            
        } finally {
            System.out.println("3. Finally");
        }
        
        System.out.println("4. Depois - CONTINUA");
        
        /*
         * SAÍDA:
         * === COM CATCH ===
         * 1. Try
         * 2. Catch - CAPTURA
         * 3. Finally
         * 4. Depois - CONTINUA  ← Exceção capturada, continua
         */
    }
    
    // ✅ SEM CATCH: exceção PROPAGA
    public static void semCatch() {
        System.out.println("=== SEM CATCH ===");
        
        try {
            System.out.println("1. Try");
            throw new RuntimeException("Erro");
            
        } finally {
            System.out.println("2. Finally");
        }
        
        // System.out.println("X. Depois - NÃO EXECUTA");
        
        /*
         * SAÍDA:
         * === SEM CATCH ===
         * 1. Try
         * 2. Finally
         * Exception in thread "main" RuntimeException: Erro  ← Propaga
         */
    }
    
    /*
     * DIFERENÇA:
     * 
     * COM CATCH:
     *   - Exceção CAPTURADA
     *   - Tratamento executado
     *   - Continua após finally
     * 
     * SEM CATCH:
     *   - Exceção NÃO capturada
     *   - Finally executa
     *   - Exceção PROPAGA
     */
}
```

**Com catch**: captura, **continua**. **Sem catch**: propaga, **para**.

### 4. Finally Obrigatório Ter Catch ou Finally

```java
// ❌ Try PRECISA ter catch OU finally
public class TryObrigatorio {
    
    // ❌ Try sozinho (NÃO compila)
    public static void trySozinho() {
        // try {
        //     // código
        // }
        
        /*
         * ERRO COMPILAÇÃO:
         * "'try' without 'catch', 'finally' or resource declarations"
         * 
         * Try PRECISA ter:
         *   - catch OU
         *   - finally OU
         *   - try-with-resources
         */
    }
    
    // ✅ Try + catch (sem finally) - OK
    public static void tryComCatch() {
        try {
            // código
        } catch (Exception e) {
            // tratamento
        }
        
        // ✅ VÁLIDO: tem catch
    }
    
    // ✅ Try + finally (sem catch) - OK
    public static void tryComFinally() {
        try {
            // código
        } finally {
            // cleanup
        }
        
        // ✅ VÁLIDO: tem finally
    }
    
    // ✅ Try + catch + finally - OK
    public static void tryComCatchFinally() {
        try {
            // código
        } catch (Exception e) {
            // tratamento
        } finally {
            // cleanup
        }
        
        // ✅ VÁLIDO: tem catch E finally
    }
}
```

**Try**: precisa ter `catch` **ou** `finally` (não pode sozinho).

### 5. Quando Usar Cada Um

```java
// ✅ Quando usar cada combinação
public class QuandoUsarCadaUm {
    
    // ✅ USO 1: Try + Catch + Finally
    // QUANDO: Tratar exceção E liberar recursos
    public static void usarTryCatchFinally() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // processar
            
        } catch (IOException e) {
            // ✅ TRATAR exceção
            System.err.println("Erro: " + e.getMessage());
            criarArquivoPadrao();
            
        } finally {
            // ✅ LIBERAR recurso
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) { }
            }
        }
        
        /*
         * USO: Try + Catch + Finally
         *   - QUER tratar exceção
         *   - E liberar recursos
         *   - Continuar execução
         */
    }
    
    // ✅ USO 2: Try + Finally (sem catch)
    // QUANDO: Liberar recursos MAS não tratar exceção
    public static void usarTryFinally() throws IOException {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            // processar
            
        } finally {
            // ✅ LIBERAR recurso
            if (reader != null) {
                reader.close();
            }
        }
        
        // ✅ IOException PROPAGA (quem chama trata)
        
        /*
         * USO: Try + Finally (sem catch)
         *   - NÃO quer tratar exceção aqui
         *   - MAS precisa liberar recursos
         *   - Deixar exceção propagar
         */
    }
    
    // ✅ USO 3: Try + Catch (sem finally)
    // QUANDO: Tratar exceção mas não tem recursos
    public static void usarTryCatch() {
        try {
            int resultado = calcular();
            processar(resultado);
            
        } catch (IllegalArgumentException e) {
            // ✅ TRATAR exceção
            System.err.println("Argumento inválido");
            usarValorPadrao();
        }
        
        // ✅ Sem recursos para liberar (não precisa finally)
        
        /*
         * USO: Try + Catch (sem finally)
         *   - Tratar exceção
         *   - Sem recursos para liberar
         *   - Continuar execução
         */
    }
    
    private static void criarArquivoPadrao() { }
    private static int calcular() { return 0; }
    private static void processar(int v) { }
    private static void usarValorPadrao() { }
}
```

**Try+Catch+Finally**: tratar **e** liberar. **Try+Finally**: só liberar. **Try+Catch**: só tratar.

### 6. Propagação de Exceção

```java
// ✅ Propagação com finally
public class PropagacaoComFinally {
    
    // ✅ COM CATCH: exceção NÃO propaga
    public static void comCatch() {
        System.out.println("=== COM CATCH ===");
        
        try {
            metodoComCatch();
            System.out.println("Continua aqui");  // ✅ Executa
            
        } catch (Exception e) {
            System.out.println("Captura aqui: " + e.getMessage());
        }
    }
    
    private static void metodoComCatch() {
        try {
            throw new RuntimeException("Erro");
        } catch (RuntimeException e) {
            System.out.println("Captura no método");
            // ✅ Exceção CAPTURADA (não propaga)
        } finally {
            System.out.println("Finally executa");
        }
    }
    
    // ✅ SEM CATCH: exceção PROPAGA
    public static void semCatch() {
        System.out.println("=== SEM CATCH ===");
        
        try {
            metodoSemCatch();
            System.out.println("X. Não continua");  // ❌ NÃO executa
            
        } catch (Exception e) {
            System.out.println("Captura aqui: " + e.getMessage());
        }
    }
    
    private static void metodoSemCatch() {
        try {
            throw new RuntimeException("Erro");
        } finally {
            System.out.println("Finally executa");
            // ✅ Exceção PROPAGA
        }
    }
    
    /*
     * SAÍDA comCatch():
     * === COM CATCH ===
     * Captura no método
     * Finally executa
     * Continua aqui  ← Continua
     * 
     * SAÍDA semCatch():
     * === SEM CATCH ===
     * Finally executa
     * Captura aqui: Erro  ← Propaga
     */
}
```

**Com catch**: não propaga. **Sem catch**: propaga após finally.

### 7. Finally com Throws

```java
// ✅ Finally com throws (sem catch)
public class FinallyComThrows {
    
    // ✅ Try + Finally + Throws
    public static void processar(String arquivo) throws IOException {
        FileReader reader = null;
        
        try {
            reader = new FileReader(arquivo);
            // processar (pode lançar IOException)
            
        } finally {
            // ✅ Libera recurso ANTES de propagar
            if (reader != null) {
                reader.close();
            }
        }
        
        // ✅ IOException propaga (throws declara)
        
        /*
         * USO COMUM:
         *   - Método declara throws
         *   - Não quer tratar exceção
         *   - MAS precisa liberar recursos
         *   - Finally garante cleanup
         */
    }
    
    // Quem chama trata
    public static void usar() {
        try {
            processar("dados.txt");
        } catch (IOException e) {
            System.err.println("Erro: " + e.getMessage());
        }
    }
}
```

**Finally+Throws**: libera recursos, **throws** propaga.

### 8. Try Aninhado com Finally

```java
// ✅ Try aninhado com finally
public class TryAninhadoFinally {
    
    public static void exemplo() {
        System.out.println("=== TRY ANINHADO ===");
        
        try {
            System.out.println("1. Try externo");
            
            try {
                System.out.println("2. Try interno");
                throw new RuntimeException("Erro");
                
            } finally {
                System.out.println("3. Finally interno");
            }
            
        } catch (RuntimeException e) {
            System.out.println("4. Catch externo");
            
        } finally {
            System.out.println("5. Finally externo");
        }
        
        /*
         * SAÍDA:
         * === TRY ANINHADO ===
         * 1. Try externo
         * 2. Try interno
         * 3. Finally interno   ← Executa ANTES de propagar
         * 4. Catch externo      ← Captura exceção propagada
         * 5. Finally externo    ← Executa
         * 
         * FLUXO:
         *   - Try interno → Exceção → Finally interno
         *   - Propaga → Catch externo → Finally externo
         */
    }
}
```

**Aninhado**: finally interno **antes** de propagar para externo.

### 9. Múltiplos Catch com Finally

```java
// ✅ Múltiplos catch com finally
public class MultiplosCatchComFinally {
    
    public static void exemplo() {
        FileReader reader = null;
        
        try {
            reader = new FileReader("arquivo.txt");
            processar(reader);
            
        } catch (FileNotFoundException e) {
            System.err.println("Arquivo não encontrado");
            
        } catch (IOException e) {
            System.err.println("Erro ao ler");
            
        } catch (RuntimeException e) {
            System.err.println("Erro de processamento");
            
        } finally {
            // ✅ Finally executa APÓS QUALQUER catch
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    System.err.println("Erro ao fechar");
                }
            }
        }
        
        /*
         * MÚLTIPLOS CATCH + FINALLY:
         *   - Finally executa após QUALQUER catch
         *   - Ou após try (se sem exceção)
         *   - Garante cleanup em todos os casos
         */
    }
    
    private static void processar(FileReader r) throws IOException { }
}
```

**Múltiplos catch**: finally após **qualquer** catch.

### 10. Resumo Visual: Com e Sem Catch

```java
/*
 * FINALLY COM E SEM CATCH
 * 
 * COMBINAÇÕES VÁLIDAS:
 * 
 * 1. TRY + CATCH + FINALLY:
 * 
 *    try {
 *        código ──────────┐
 *    } catch (Exc e) {   │
 *        CAPTURA ◄───────┘
 *    } finally {         │
 *        cleanup ◄───────┘
 *    }                   │
 *    CONTINUA ◄──────────┘
 * 
 *    - Exceção CAPTURADA
 *    - Tratamento executado
 *    - Finally executa
 *    - CONTINUA execução
 * 
 * 
 * 2. TRY + FINALLY (sem catch):
 * 
 *    try {
 *        código ──────────┐
 *    } finally {         │
 *        cleanup ◄───────┘
 *    }                   │
 *    PROPAGA ◄───────────┘
 * 
 *    - Exceção NÃO capturada
 *    - Finally executa
 *    - Exceção PROPAGA
 *    - NÃO continua
 * 
 * 
 * 3. TRY + CATCH (sem finally):
 * 
 *    try {
 *        código ──────────┐
 *    } catch (Exc e) {   │
 *        CAPTURA ◄───────┘
 *    }                   │
 *    CONTINUA ◄──────────┘
 * 
 *    - Exceção CAPTURADA
 *    - Tratamento executado
 *    - CONTINUA execução
 *    - Sem cleanup garantido
 * 
 * 
 * ❌ INVÁLIDO: TRY SOZINHO
 * 
 *    try {
 *        código
 *    }  ← ERRO: "'try' without 'catch', 'finally'"
 * 
 * 
 * QUANDO USAR CADA:
 * 
 * TRY + CATCH + FINALLY:
 *   ✅ Tratar exceção
 *   ✅ Liberar recursos
 *   ✅ Continuar execução
 * 
 * TRY + FINALLY (sem catch):
 *   ✅ Liberar recursos
 *   ✅ NÃO tratar exceção
 *   ✅ Deixar propagar
 * 
 * TRY + CATCH (sem finally):
 *   ✅ Tratar exceção
 *   ❌ Sem recursos para liberar
 *   ✅ Continuar execução
 */

public class ResumoComSemCatch {
    public static void main(String[] args) {
        System.out.println("=== FINALLY COM E SEM CATCH ===");
        System.out.println("\n✅ Try + Catch + Finally:");
        System.out.println("  - Captura E libera");
        System.out.println("  - CONTINUA execução");
        System.out.println("\n✅ Try + Finally (sem catch):");
        System.out.println("  - Libera MAS não captura");
        System.out.println("  - Exceção PROPAGA");
        System.out.println("\n❌ Try sozinho: ERRO compilação");
    }
}
```

---

## Aplicabilidade

**Finally com/sem catch**:
- **Com catch**: captura **e** libera
- **Sem catch**: libera, **propaga**
- Try **precisa** catch ou finally

---

## Armadilhas

### 1. Try Sozinho

```java
// ❌ Try sozinho (erro compilação)
try {
    codigo();
}  // ❌ ERRO: precisa catch ou finally
```

### 2. Confundir Propagação

```java
// ❌ Com catch: NÃO propaga
try {
    throw new Exception();
} catch (Exception e) {
    // Captura (NÃO propaga)
} finally { }

// ✅ Sem catch: PROPAGA
try {
    throw new Exception();
} finally { }  // Propaga
```

### 3. Esquecer Throws

```java
// ❌ Sem catch precisa throws
public void metodo() {  // ❌ ERRO: precisa throws
    try {
        throw new IOException();
    } finally { }
}

// ✅ Com throws
public void metodo() throws IOException {
    try {
        throw new IOException();
    } finally { }  // ✅ OK: throws declara
}
```

---

## Boas Práticas

### 1. Usar Finally para Recursos

```java
// ✅ Finally para liberar recursos
try {
    recurso = adquirir();
} finally {
    if (recurso != null) {
        recurso.liberar();
    }
}
```

### 2. Try+Finally Quando Não Quer Tratar

```java
// ✅ Try+finally quando não quer tratar
public void metodo() throws Exception {
    try {
        operacao();
    } finally {
        cleanup();  // Libera mas não trata
    }
}
```

### 3. Try+Catch+Finally Quando Quer Ambos

```java
// ✅ Try+catch+finally quando quer ambos
try {
    operacao();
} catch (Exception e) {
    tratar(e);  // Trata
} finally {
    cleanup();  // Libera
}
```

---

## Resumo

**Finally com/sem catch**: ambos **válidos**.

**Try + Catch + Finally**:
- Exceção **capturada**
- Tratamento executado
- Recursos **liberados**
- **Continua** execução

**Try + Finally** (sem catch):
- Exceção **não** capturada
- Recursos **liberados**
- Exceção **propaga**
- **Não** continua

**Try + Catch** (sem finally):
- Exceção **capturada**
- Tratamento executado
- **Continua** execução
- Sem cleanup garantido

**Try precisa**:
- `catch` **ou** `finally`
- Não pode **sozinho**
- Erro de compilação

**Quando usar**:
- **Try+Catch+Finally**: tratar **e** liberar
- **Try+Finally**: liberar, **propagar**
- **Try+Catch**: só tratar (sem recursos)

**Propagação**:
- **Com catch**: não propaga (capturada)
- **Sem catch**: propaga (após finally)

**Regra de Ouro**: Try **precisa** catch ou finally. Use **try+catch+finally** para tratar e liberar. Use **try+finally** (sem catch) para liberar mas não tratar (deixar propagar). Finally executa **sempre** (com ou sem catch).

