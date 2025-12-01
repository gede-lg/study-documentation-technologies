# T5.01 - Execução Garantida do Finally

## Introdução

O bloco **finally** **sempre** executa, independente de exceção ou não.

```java
/*
 * BLOCO FINALLY
 * 
 * EXECUÇÃO GARANTIDA:
 *   - Executa SEMPRE
 *   - Com exceção ou sem
 *   - Exceção capturada ou não
 *   - Com return ou não
 * 
 * SINTAXE:
 * try {
 *     // código
 * } catch (Exception e) {
 *     // tratamento
 * } finally {
 *     // SEMPRE executa
 * }
 */

// ✅ Finally executa sempre
try {
    System.out.println("Try");
} catch (Exception e) {
    System.out.println("Catch");
} finally {
    System.out.println("Finally");  // ✅ SEMPRE executa
}

// Saída:
// Try
// Finally
```

**Finally** = execução **garantida** (sempre executa).

---

## Fundamentos

### 1. Execução com Sucesso (Sem Exceção)

```java
// ✅ Finally executa quando try tem sucesso
public class FinallyComSucesso {
    
    public static void exemplo1() {
        System.out.println("=== SUCESSO (sem exceção) ===");
        
        try {
            System.out.println("1. Try - início");
            int resultado = 10 / 2;
            System.out.println("2. Try - fim (resultado: " + resultado + ")");
            
        } catch (ArithmeticException e) {
            System.out.println("X. Catch (NÃO executa)");
            
        } finally {
            System.out.println("3. Finally - SEMPRE executa");
        }
        
        System.out.println("4. Depois do try-catch-finally");
        
        /*
         * SAÍDA:
         * === SUCESSO (sem exceção) ===
         * 1. Try - início
         * 2. Try - fim (resultado: 5)
         * 3. Finally - SEMPRE executa
         * 4. Depois do try-catch-finally
         * 
         * FLUXO:
         *   Try completo → Finally → Depois
         */
    }
    
    public static void exemplo2() {
        try {
            System.out.println("Abrindo arquivo");
            System.out.println("Lendo dados");
            System.out.println("Processando");
            
        } catch (Exception e) {
            System.out.println("Catch não executa");
            
        } finally {
            System.out.println("Fechando arquivo");  // ✅ Sempre executa
        }
        
        /*
         * SAÍDA:
         * Abrindo arquivo
         * Lendo dados
         * Processando
         * Fechando arquivo  ← Finally
         */
    }
}
```

**Sucesso**: try completo → **finally** → depois.

### 2. Execução com Exceção Capturada

```java
// ✅ Finally executa quando exceção é capturada
public class FinallyComExcecaoCapturada {
    
    public static void exemplo1() {
        System.out.println("=== EXCEÇÃO CAPTURADA ===");
        
        try {
            System.out.println("1. Try - início");
            int resultado = 10 / 0;  // ← Exceção
            System.out.println("X. Try - fim (NÃO executa)");
            
        } catch (ArithmeticException e) {
            System.out.println("2. Catch - captura exceção");
            
        } finally {
            System.out.println("3. Finally - SEMPRE executa");
        }
        
        System.out.println("4. Depois do try-catch-finally");
        
        /*
         * SAÍDA:
         * === EXCEÇÃO CAPTURADA ===
         * 1. Try - início
         * 2. Catch - captura exceção
         * 3. Finally - SEMPRE executa
         * 4. Depois do try-catch-finally
         * 
         * FLUXO:
         *   Try parcial → Catch → Finally → Depois
         */
    }
    
    public static void exemplo2() {
        try {
            System.out.println("Abrindo arquivo");
            System.out.println("Lendo dados");
            throw new RuntimeException("Erro ao ler");
            // System.out.println("Processando");  // Não executa
            
        } catch (RuntimeException e) {
            System.out.println("Erro: " + e.getMessage());
            
        } finally {
            System.out.println("Fechando arquivo");  // ✅ Sempre executa
        }
        
        /*
         * SAÍDA:
         * Abrindo arquivo
         * Lendo dados
         * Erro: Erro ao ler
         * Fechando arquivo  ← Finally
         */
    }
}
```

**Exceção capturada**: try parcial → catch → **finally** → depois.

### 3. Execução com Exceção NÃO Capturada

```java
// ✅ Finally executa mesmo se exceção NÃO é capturada
public class FinallyComExcecaoNaoCapturada {
    
    public static void exemplo1() {
        System.out.println("=== EXCEÇÃO NÃO CAPTURADA ===");
        
        try {
            System.out.println("1. Try - início");
            int resultado = 10 / 0;  // ← Exceção
            System.out.println("X. Try - fim (NÃO executa)");
            
        } finally {
            System.out.println("2. Finally - SEMPRE executa");
        }
        
        // System.out.println("X. Depois (NÃO executa)");
        // Programa quebra após finally
        
        /*
         * SAÍDA:
         * === EXCEÇÃO NÃO CAPTURADA ===
         * 1. Try - início
         * 2. Finally - SEMPRE executa
         * Exception in thread "main" java.lang.ArithmeticException: / by zero
         * 
         * FLUXO:
         *   Try parcial → Finally → Exceção propaga (programa quebra)
         */
    }
    
    public static void exemplo2() {
        try {
            System.out.println("Abrindo arquivo");
            System.out.println("Lendo dados");
            throw new RuntimeException("Erro crítico");
            
        } finally {
            System.out.println("Fechando arquivo");  // ✅ Executa ANTES de propagar
        }
        
        /*
         * SAÍDA:
         * Abrindo arquivo
         * Lendo dados
         * Fechando arquivo  ← Finally executa
         * Exception in thread "main" java.lang.RuntimeException: Erro crítico
         * 
         * IMPORTANTE:
         *   - Finally executa ANTES da exceção propagar
         *   - Garante fechamento de recursos
         */
    }
}
```

**Exceção não capturada**: try parcial → **finally** → exceção **propaga**.

### 4. Execução com Return

```java
// ✅ Finally executa mesmo com return
public class FinallyComReturn {
    
    public static int exemplo1() {
        System.out.println("=== COM RETURN ===");
        
        try {
            System.out.println("1. Try - início");
            System.out.println("2. Try - return");
            return 10;  // ← Return, mas finally executa ANTES
            
        } finally {
            System.out.println("3. Finally - executa ANTES do return");
        }
        
        // ✅ Ordem: Try → Finally → Return
        
        /*
         * SAÍDA:
         * === COM RETURN ===
         * 1. Try - início
         * 2. Try - return
         * 3. Finally - executa ANTES do return
         * (retorna 10)
         * 
         * FLUXO:
         *   Try encontra return → Finally executa → Método retorna
         */
    }
    
    public static String exemplo2() {
        try {
            System.out.println("Processando");
            return "Sucesso";
            
        } catch (Exception e) {
            return "Erro";
            
        } finally {
            System.out.println("Limpando");  // ✅ Executa ANTES do return
        }
    }
    
    public static void testar() {
        System.out.println("Resultado: " + exemplo1());
        /*
         * SAÍDA:
         * === COM RETURN ===
         * 1. Try - início
         * 2. Try - return
         * 3. Finally - executa ANTES do return
         * Resultado: 10
         */
    }
}
```

**Return**: try encontra return → **finally** executa → método **retorna**.

### 5. Execução com Break/Continue

```java
// ✅ Finally executa mesmo com break/continue
public class FinallyComBreakContinue {
    
    // ✅ Finally com break
    public static void exemploBreak() {
        System.out.println("=== COM BREAK ===");
        
        for (int i = 0; i < 3; i++) {
            try {
                System.out.println("Try - i=" + i);
                if (i == 1) {
                    break;  // ← Break, mas finally executa ANTES
                }
                
            } finally {
                System.out.println("Finally - i=" + i);
            }
        }
        
        /*
         * SAÍDA:
         * === COM BREAK ===
         * Try - i=0
         * Finally - i=0
         * Try - i=1
         * Finally - i=1  ← Finally executa ANTES do break
         */
    }
    
    // ✅ Finally com continue
    public static void exemploContinue() {
        System.out.println("=== COM CONTINUE ===");
        
        for (int i = 0; i < 3; i++) {
            try {
                System.out.println("Try - i=" + i);
                if (i == 1) {
                    continue;  // ← Continue, mas finally executa ANTES
                }
                System.out.println("Fim try - i=" + i);
                
            } finally {
                System.out.println("Finally - i=" + i);
            }
        }
        
        /*
         * SAÍDA:
         * === COM CONTINUE ===
         * Try - i=0
         * Fim try - i=0
         * Finally - i=0
         * Try - i=1
         * Finally - i=1  ← Finally executa ANTES do continue
         * Try - i=2
         * Fim try - i=2
         * Finally - i=2
         */
    }
}
```

**Break/Continue**: finally executa **antes** do break/continue.

### 6. Execução com System.exit()

```java
// ❌ Finally NÃO executa com System.exit()
public class FinallyComSystemExit {
    
    public static void exemplo() {
        System.out.println("=== COM SYSTEM.EXIT ===");
        
        try {
            System.out.println("1. Try - início");
            System.exit(0);  // ← JVM ENCERRA (finally NÃO executa)
            System.out.println("X. Try - fim (NÃO executa)");
            
        } finally {
            System.out.println("X. Finally (NÃO executa)");
        }
        
        /*
         * SAÍDA:
         * === COM SYSTEM.EXIT ===
         * 1. Try - início
         * (JVM encerra - finally NÃO executa)
         * 
         * EXCEÇÃO:
         *   - System.exit() ENCERRA a JVM
         *   - Finally NÃO executa
         *   - Única situação que finally não executa
         */
    }
    
    /*
     * ÚNICA EXCEÇÃO:
     *   - System.exit(código) ENCERRA JVM
     *   - Finally NÃO executa
     *   - Todos os threads param
     *   - Shutdown hooks executam (mas não finally)
     */
}
```

**System.exit()**: **única** exceção (finally **não** executa).

### 7. Múltiplos Returns

```java
// ✅ Finally executa com múltiplos returns
public class FinallyMultiplosReturns {
    
    public static String exemplo(int valor) {
        try {
            if (valor < 0) {
                System.out.println("Return 1: negativo");
                return "Negativo";
            }
            if (valor == 0) {
                System.out.println("Return 2: zero");
                return "Zero";
            }
            System.out.println("Return 3: positivo");
            return "Positivo";
            
        } catch (Exception e) {
            System.out.println("Return 4: erro");
            return "Erro";
            
        } finally {
            System.out.println("Finally - SEMPRE executa");
        }
        
        /*
         * QUALQUER RETURN:
         *   - Finally executa ANTES
         *   - Não importa qual return
         */
    }
    
    public static void testar() {
        System.out.println("Resultado: " + exemplo(-5));
        System.out.println();
        System.out.println("Resultado: " + exemplo(0));
        System.out.println();
        System.out.println("Resultado: " + exemplo(10));
        
        /*
         * SAÍDA:
         * Return 1: negativo
         * Finally - SEMPRE executa
         * Resultado: Negativo
         * 
         * Return 2: zero
         * Finally - SEMPRE executa
         * Resultado: Zero
         * 
         * Return 3: positivo
         * Finally - SEMPRE executa
         * Resultado: Positivo
         */
    }
}
```

**Múltiplos returns**: finally executa **antes** de qualquer return.

### 8. Finally Aninhado

```java
// ✅ Finally aninhado (cada um executa)
public class FinallyAninhado {
    
    public static void exemplo() {
        System.out.println("=== FINALLY ANINHADO ===");
        
        try {
            System.out.println("1. Try externo");
            
            try {
                System.out.println("2. Try interno");
                int resultado = 10 / 0;  // Exceção
                
            } finally {
                System.out.println("3. Finally interno");  // ✅ Executa
            }
            
        } catch (ArithmeticException e) {
            System.out.println("4. Catch externo");
            
        } finally {
            System.out.println("5. Finally externo");  // ✅ Executa
        }
        
        /*
         * SAÍDA:
         * === FINALLY ANINHADO ===
         * 1. Try externo
         * 2. Try interno
         * 3. Finally interno   ← Executa ANTES de propagar
         * 4. Catch externo
         * 5. Finally externo   ← Executa
         * 
         * FLUXO:
         *   - Try interno → Exceção → Finally interno
         *   - Exceção propaga → Catch externo → Finally externo
         */
    }
}
```

**Aninhado**: cada finally executa (interno antes de propagar).

### 9. Garantia de Execução

```java
// ✅ Garantia de execução do finally
public class GarantiaExecucao {
    
    public static void demonstrarGarantia() {
        int contador = 0;
        
        // ✅ Cenário 1: Sucesso
        try {
            contador++;
        } finally {
            System.out.println("Finally 1 executou");  // ✅ Sempre
        }
        
        // ✅ Cenário 2: Exceção capturada
        try {
            throw new RuntimeException();
        } catch (RuntimeException e) {
            contador++;
        } finally {
            System.out.println("Finally 2 executou");  // ✅ Sempre
        }
        
        // ✅ Cenário 3: Return
        metodoComReturn();
        
        // ✅ Cenário 4: Break
        for (int i = 0; i < 1; i++) {
            try {
                break;
            } finally {
                System.out.println("Finally 4 executou");  // ✅ Sempre
            }
        }
        
        /*
         * GARANTIA:
         *   - Sucesso: Finally executa
         *   - Exceção: Finally executa
         *   - Return: Finally executa
         *   - Break: Finally executa
         *   - Continue: Finally executa
         *   - System.exit(): Finally NÃO executa (única exceção)
         */
    }
    
    private static int metodoComReturn() {
        try {
            return 42;
        } finally {
            System.out.println("Finally 3 executou");  // ✅ Sempre
        }
    }
}
```

**Garantia**: finally **sempre** executa (exceto `System.exit()`).

### 10. Resumo Visual: Execução Garantida

```java
/*
 * EXECUÇÃO GARANTIDA DO FINALLY
 * 
 * CENÁRIOS DE EXECUÇÃO:
 * 
 * 1. SUCESSO (sem exceção):
 * 
 *    try {
 *        código completo  ────┐
 *    } finally {             │
 *        SEMPRE executa  ◄───┘
 *    }
 *    depois ◄────────────────┘
 * 
 * 
 * 2. EXCEÇÃO CAPTURADA:
 * 
 *    try {
 *        código parcial ──────┐
 *    } catch (Exception e) {  │
 *        captura  ◄───────────┘
 *    } finally {              │
 *        SEMPRE executa  ◄────┘
 *    }
 *    depois ◄─────────────────┘
 * 
 * 
 * 3. EXCEÇÃO NÃO CAPTURADA:
 * 
 *    try {
 *        código parcial ──────┐
 *    } finally {              │
 *        SEMPRE executa  ◄────┘
 *    }                        │
 *    exceção propaga  ◄───────┘
 * 
 * 
 * 4. COM RETURN:
 * 
 *    try {
 *        return valor  ───────┐
 *    } finally {              │
 *        executa ANTES  ◄─────┘
 *    }                        │
 *    método retorna  ◄────────┘
 * 
 * 
 * 5. COM BREAK/CONTINUE:
 * 
 *    try {
 *        break/continue ──────┐
 *    } finally {              │
 *        executa ANTES  ◄─────┘
 *    }                        │
 *    break/continue  ◄────────┘
 * 
 * 
 * ❌ ÚNICA EXCEÇÃO (finally NÃO executa):
 * 
 *    try {
 *        System.exit(0) ──────┐
 *    } finally {              │
 *        NÃO executa  X       │
 *    }                        │
 *    JVM encerra  ◄───────────┘
 * 
 * 
 * RESUMO:
 * 
 * ✅ SEMPRE EXECUTA:
 *    - Try completo (sucesso)
 *    - Exceção capturada
 *    - Exceção não capturada (antes de propagar)
 *    - Return (antes de retornar)
 *    - Break/Continue (antes de pular)
 *    - Múltiplos returns (qualquer um)
 *    - Finally aninhado (cada um)
 * 
 * ❌ NÃO EXECUTA:
 *    - System.exit() (JVM encerra)
 * 
 * USO PRINCIPAL:
 *    - Liberação de recursos
 *    - Fechamento de conexões
 *    - Cleanup garantido
 */

public class ResumoExecucaoGarantida {
    public static void main(String[] args) {
        System.out.println("=== EXECUÇÃO GARANTIDA DO FINALLY ===");
        System.out.println("\n✅ SEMPRE executa:");
        System.out.println("  - Sucesso (try completo)");
        System.out.println("  - Exceção (capturada ou não)");
        System.out.println("  - Return (antes de retornar)");
        System.out.println("  - Break/Continue (antes de pular)");
        System.out.println("\n❌ ÚNICA EXCEÇÃO:");
        System.out.println("  - System.exit() (JVM encerra)");
        System.out.println("\n🎯 USO: Liberação de recursos");
    }
}
```

---

## Aplicabilidade

**Finally** garante:
- Execução **sempre** (exceto `System.exit()`)
- **Liberação** de recursos
- **Cleanup** garantido
- Fechamento de **conexões**

---

## Armadilhas

### 1. Assumir Que Finally NÃO Executa

```java
// ❌ Assumir que finally não executa
try {
    return calcular();
} finally {
    fecharRecurso();  // ✅ EXECUTA (antes do return)
}
```

### 2. System.exit() Pula Finally

```java
// ❌ System.exit() pula finally
try {
    System.exit(0);
} finally {
    fechar();  // ❌ NÃO executa
}
```

### 3. Exceção em Finally

```java
// ❌ Exceção em finally suprime exceção do try
try {
    throw new Exception("Original");
} finally {
    throw new Exception("Finally");  // ❌ Suprime "Original"
}
```

---

## Boas Práticas

### 1. Usar para Liberação de Recursos

```java
// ✅ Liberar recursos em finally
Connection conn = null;
try {
    conn = abrirConexao();
    processar(conn);
} finally {
    if (conn != null) {
        conn.close();  // ✅ Garante fechamento
    }
}
```

### 2. Não Lançar Exceção em Finally

```java
// ✅ Não lançar exceção em finally
try {
    operacao();
} finally {
    try {
        fechar();  // ✅ Capturar própria exceção
    } catch (Exception e) {
        logar(e);
    }
}
```

### 3. Não Fazer Return em Finally

```java
// ❌ Evitar return em finally
try {
    return calcular();
} finally {
    // return 0;  // ❌ Evitar (sobrescreve return do try)
}
```

---

## Resumo

**Finally**: execução **garantida** (sempre executa).

**Executa sempre**:
- Try **completo** (sucesso)
- Exceção **capturada**
- Exceção **não** capturada (antes de propagar)
- **Return** (antes de retornar)
- **Break/Continue** (antes de pular)
- **Múltiplos** returns (qualquer um)
- Finally **aninhado** (cada um)

**Única exceção**:
- `System.exit()` (JVM encerra, finally **não** executa)

**Ordem de execução**:
- **Sucesso**: try completo → finally → depois
- **Capturada**: try parcial → catch → finally → depois
- **Não capturada**: try parcial → finally → exceção propaga
- **Return**: try encontra return → finally → método retorna
- **Break/Continue**: try encontra break/continue → finally → pula

**Uso principal**:
- **Liberação** de recursos
- **Fechamento** de conexões
- **Cleanup** garantido
- **Sempre** executar código

**Regra de Ouro**: Finally **sempre** executa (exceto `System.exit()`). Usar para **liberar** recursos e garantir **cleanup**. Finally executa **antes** de return, break, continue ou propagação de exceção.

