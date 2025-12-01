# T5.04 - Finally e Return

## Introdução

**Finally** executa **antes** do `return` (mas não impede o retorno).

```java
/*
 * FINALLY E RETURN
 * 
 * REGRAS:
 * 
 * 1. Finally executa ANTES do return
 * 2. Valor do return é PRESERVADO
 * 3. Finally NÃO pode alterar valor primitivo retornado
 * 4. Finally PODE alterar objeto retornado (referência)
 * 5. Return em finally SOBRESCREVE return do try/catch
 */

// ✅ Finally executa ANTES do return
public static int exemplo() {
    try {
        System.out.println("1. Try");
        return 10;  // ← Valor guardado, finally executa ANTES
    } finally {
        System.out.println("2. Finally - ANTES do return");
    }
    // 3. Método retorna 10
}

/*
 * SAÍDA:
 * 1. Try
 * 2. Finally - ANTES do return
 * (retorna 10)
 */
```

**Return**: finally executa **antes**, valor **preservado**.

---

## Fundamentos

### 1. Finally Executa Antes do Return

```java
// ✅ Finally executa antes do return
public class FinallyAntesReturn {
    
    public static int exemploBasico() {
        System.out.println("=== FINALLY ANTES RETURN ===");
        
        try {
            System.out.println("1. Try - início");
            System.out.println("2. Try - return 42");
            return 42;  // ← Valor guardado
            
        } finally {
            System.out.println("3. Finally - executa ANTES");
        }
        
        // 4. Método retorna 42
        
        /*
         * SAÍDA:
         * === FINALLY ANTES RETURN ===
         * 1. Try - início
         * 2. Try - return 42
         * 3. Finally - executa ANTES
         * (retorna 42)
         * 
         * ORDEM:
         *   Try encontra return → Guarda valor
         *   → Finally executa → Método retorna valor guardado
         */
    }
    
    public static void testar() {
        int resultado = exemploBasico();
        System.out.println("Resultado: " + resultado);
        
        /*
         * SAÍDA COMPLETA:
         * === FINALLY ANTES RETURN ===
         * 1. Try - início
         * 2. Try - return 42
         * 3. Finally - executa ANTES
         * Resultado: 42
         */
    }
}
```

**Ordem**: try encontra return → **guarda** valor → finally executa → **retorna**.

### 2. Valor do Return É Preservado

```java
// ✅ Valor do return é preservado
public class ValorPreservado {
    
    public static int exemplo1() {
        int valor = 10;
        
        try {
            System.out.println("Try - valor: " + valor);
            return valor;  // ← Retorna 10 (valor guardado)
            
        } finally {
            valor = 999;  // ❌ NÃO afeta return (já guardado)
            System.out.println("Finally - valor alterado: " + valor);
        }
        
        // Retorna 10 (NÃO 999)
        
        /*
         * SAÍDA:
         * Try - valor: 10
         * Finally - valor alterado: 999
         * (retorna 10, NÃO 999)
         * 
         * EXPLICAÇÃO:
         *   - return 10 guarda o VALOR 10
         *   - Finally altera variável local
         *   - MAS valor de retorno já foi guardado
         *   - Retorna 10 (valor original)
         */
    }
    
    public static int exemplo2() {
        try {
            return calcular();  // ← calcular() executa, valor guardado
            
        } finally {
            System.out.println("Finally executa");
        }
        
        // Retorna valor de calcular()
    }
    
    private static int calcular() {
        System.out.println("Calculando...");
        return 42;
    }
    
    public static void testar() {
        System.out.println("Resultado 1: " + exemplo1());
        System.out.println();
        System.out.println("Resultado 2: " + exemplo2());
        
        /*
         * SAÍDA:
         * Try - valor: 10
         * Finally - valor alterado: 999
         * Resultado 1: 10
         * 
         * Calculando...
         * Finally executa
         * Resultado 2: 42
         */
    }
}
```

**Valor**: return **guarda** valor, finally **não** afeta primitivo.

### 3. Return em Catch

```java
// ✅ Finally executa antes de return em catch
public class ReturnEmCatch {
    
    public static int exemplo() {
        try {
            System.out.println("1. Try");
            int resultado = 10 / 0;  // Exceção
            return resultado;  // NÃO executa
            
        } catch (ArithmeticException e) {
            System.out.println("2. Catch");
            return -1;  // ← Return no catch
            
        } finally {
            System.out.println("3. Finally - ANTES do return");
        }
        
        // 4. Método retorna -1
        
        /*
         * SAÍDA:
         * 1. Try
         * 2. Catch
         * 3. Finally - ANTES do return
         * (retorna -1)
         * 
         * ORDEM:
         *   Try → Exceção → Catch encontra return
         *   → Guarda -1 → Finally executa → Retorna -1
         */
    }
    
    public static String exemplo2() {
        try {
            throw new RuntimeException("Erro");
            
        } catch (RuntimeException e) {
            return "Erro capturado";
            
        } finally {
            System.out.println("Finally executa");
        }
    }
}
```

**Catch**: return no catch também executa finally **antes**.

### 4. Múltiplos Returns

```java
// ✅ Finally executa antes de QUALQUER return
public class MultiploReturns {
    
    public static String exemplo(int valor) {
        try {
            if (valor < 0) {
                System.out.println("Return 1: negativo");
                return "Negativo";  // ← Return 1
            }
            
            if (valor == 0) {
                System.out.println("Return 2: zero");
                return "Zero";  // ← Return 2
            }
            
            System.out.println("Return 3: positivo");
            return "Positivo";  // ← Return 3
            
        } catch (Exception e) {
            System.out.println("Return 4: erro");
            return "Erro";  // ← Return 4
            
        } finally {
            System.out.println("Finally - executa antes de QUALQUER return");
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
         * Finally - executa antes de QUALQUER return
         * Resultado: Negativo
         * 
         * Return 2: zero
         * Finally - executa antes de QUALQUER return
         * Resultado: Zero
         * 
         * Return 3: positivo
         * Finally - executa antes de QUALQUER return
         * Resultado: Positivo
         */
    }
}
```

**Múltiplos**: finally antes de **qualquer** return.

### 5. Return em Finally SOBRESCREVE

```java
// ⚠️ Return em finally SOBRESCREVE return do try/catch
public class ReturnEmFinally {
    
    // ⚠️ EVITAR: return em finally
    public static int exemploProblematico() {
        try {
            System.out.println("Try - return 10");
            return 10;  // ❌ IGNORADO
            
        } finally {
            System.out.println("Finally - return 999");
            return 999;  // ⚠️ SOBRESCREVE return do try
        }
        
        // Retorna 999 (NÃO 10)
        
        /*
         * SAÍDA:
         * Try - return 10
         * Finally - return 999
         * (retorna 999, NÃO 10)
         * 
         * PROBLEMA:
         *   - Return do try (10) é IGNORADO
         *   - Return do finally (999) SOBRESCREVE
         *   - Confuso e inesperado
         *   - ❌ EVITAR return em finally
         */
    }
    
    // ⚠️ EVITAR: return em finally suprime exceção
    public static int exemploSupressao() {
        try {
            System.out.println("Try - lança exceção");
            throw new RuntimeException("Erro importante");
            
        } finally {
            System.out.println("Finally - return 0");
            return 0;  // ⚠️ SUPRIME exceção
        }
        
        // Retorna 0 (exceção é SUPRIMIDA)
        
        /*
         * SAÍDA:
         * Try - lança exceção
         * Finally - return 0
         * (retorna 0, exceção SUPRIMIDA)
         * 
         * PERIGO:
         *   - Exceção do try é SUPRIMIDA
         *   - Perde informação de erro
         *   - Erro silencioso
         *   - ❌ EVITAR return em finally
         */
    }
    
    /*
     * REGRA:
     *   ❌ NUNCA fazer return em finally
     *   - Sobrescreve return do try/catch
     *   - Suprime exceções
     *   - Confuso e perigoso
     */
}
```

**Return em finally**: **sobrescreve** try/catch, **suprime** exceção (evitar).

### 6. Finally Pode Alterar Objeto

```java
// ✅ Finally PODE alterar objeto (referência)
public class FinallyAlteraObjeto {
    
    // ✅ Primitivo: NÃO pode alterar
    public static int exemploPrimitivo() {
        int valor = 10;
        
        try {
            return valor;  // Retorna 10 (valor copiado)
            
        } finally {
            valor = 999;  // ❌ NÃO afeta return (primitivo copiado)
        }
        
        // Retorna 10
    }
    
    // ✅ Objeto: PODE alterar (referência)
    public static StringBuilder exemploObjeto() {
        StringBuilder sb = new StringBuilder("Olá");
        
        try {
            return sb;  // Retorna REFERÊNCIA para sb
            
        } finally {
            sb.append(" Mundo");  // ✅ ALTERA objeto (mesma referência)
        }
        
        // Retorna sb com "Olá Mundo"
        
        /*
         * DIFERENÇA:
         * 
         * PRIMITIVO:
         *   - Valor COPIADO no return
         *   - Finally não afeta cópia
         *   - Retorna valor original
         * 
         * OBJETO:
         *   - Referência retornada
         *   - Finally altera MESMO objeto
         *   - Retorna objeto alterado
         */
    }
    
    public static void testar() {
        System.out.println("Primitivo: " + exemploPrimitivo());
        System.out.println("Objeto: " + exemploObjeto());
        
        /*
         * SAÍDA:
         * Primitivo: 10
         * Objeto: Olá Mundo
         */
    }
}
```

**Primitivo**: cópia (finally **não** afeta). **Objeto**: referência (finally **afeta**).

### 7. Return com Exceção

```java
// ✅ Finally executa mesmo com exceção + return
public class ReturnComExcecao {
    
    public static int exemplo1() {
        try {
            System.out.println("1. Try");
            throw new RuntimeException("Erro");
            
        } catch (RuntimeException e) {
            System.out.println("2. Catch - return -1");
            return -1;  // ← Return no catch
            
        } finally {
            System.out.println("3. Finally");
        }
        
        // 4. Retorna -1
        
        /*
         * SAÍDA:
         * 1. Try
         * 2. Catch - return -1
         * 3. Finally
         * (retorna -1)
         */
    }
    
    public static int exemplo2() {
        try {
            System.out.println("1. Try - return 10");
            return 10;
            
        } finally {
            System.out.println("2. Finally");
            // Exceção lançada AQUI
            // throw new RuntimeException();
        }
        
        // Se finally lançar exceção:
        //   - Return é DESCARTADO
        //   - Exceção do finally PROPAGA
    }
}
```

**Exceção**: catch return → finally executa → retorna. Finally exceção → **descarta** return.

### 8. Return em Loop

```java
// ✅ Finally com return em loop
public class ReturnEmLoop {
    
    public static int buscar(int[] valores, int alvo) {
        try {
            for (int i = 0; i < valores.length; i++) {
                if (valores[i] == alvo) {
                    System.out.println("Encontrado em índice " + i);
                    return i;  // ← Return dentro do loop
                }
            }
            
            System.out.println("Não encontrado");
            return -1;
            
        } finally {
            System.out.println("Finally - sempre executa");
        }
        
        /*
         * FLUXO:
         *   - Loop encontra valor → return
         *   - Finally executa ANTES de retornar
         *   - Método retorna índice
         */
    }
    
    public static void testar() {
        int[] valores = {10, 20, 30, 40};
        
        System.out.println("Resultado: " + buscar(valores, 30));
        /*
         * SAÍDA:
         * Encontrado em índice 2
         * Finally - sempre executa
         * Resultado: 2
         */
    }
}
```

**Loop**: return dentro loop → finally executa → **retorna**.

### 9. Return com Finally Aninhado

```java
// ✅ Return com finally aninhado
public class ReturnFinallyAninhado {
    
    public static int exemplo() {
        try {
            System.out.println("1. Try externo");
            
            try {
                System.out.println("2. Try interno - return 10");
                return 10;  // ← Return no try interno
                
            } finally {
                System.out.println("3. Finally interno");
            }
            
        } finally {
            System.out.println("4. Finally externo");
        }
        
        /*
         * SAÍDA:
         * 1. Try externo
         * 2. Try interno - return 10
         * 3. Finally interno   ← Executa
         * 4. Finally externo   ← Executa
         * (retorna 10)
         * 
         * ORDEM:
         *   Try interno → return → Finally interno
         *   → Finally externo → Retorna
         */
    }
}
```

**Aninhado**: finally interno → finally externo → **retorna**.

### 10. Resumo Visual: Finally e Return

```java
/*
 * FINALLY E RETURN
 * 
 * EXECUÇÃO:
 * 
 * try {
 *     return valor; ────────┐
 * } finally {              │
 *     cleanup(); ◄─────────┘ Executa ANTES
 * }                        │
 * Retorna valor ◄──────────┘
 * 
 * 
 * VALOR PRESERVADO:
 * 
 * int valor = 10;
 * try {
 *     return valor; ──────┐ Guarda 10
 * } finally {            │
 *     valor = 999; ─────┐│ Altera variável
 * }                     ││
 * Retorna 10 ◄──────────┘│ NÃO 999
 *                        │
 * Variável = 999 ◄───────┘ (mas não afeta return)
 * 
 * 
 * MÚLTIPLOS RETURNS:
 * 
 * try {
 *     if (x < 0) return "A"; ──┐
 *     if (x = 0) return "B"; ──┤
 *     return "C"; ─────────────┤
 * } finally {                  │
 *     cleanup(); ◄─────────────┘ Antes de QUALQUER
 * }
 * 
 * 
 * ⚠️ RETURN EM FINALLY (EVITAR):
 * 
 * try {
 *     return 10; ─────────┐ IGNORADO
 * } finally {            │
 *     return 999; ───────┼──┐ SOBRESCREVE
 * }                      │  │
 * Retorna 999 ◄──────────┘  │
 * (10 é ignorado) ◄─────────┘
 * 
 * 
 * PRIMITIVO VS OBJETO:
 * 
 * PRIMITIVO (cópia):
 * int x = 10;
 * try {
 *     return x; ──────────┐ Copia 10
 * } finally {            │
 *     x = 999; ──────────┤ Altera variável
 * }                      │
 * Retorna 10 ◄───────────┘ (cópia não afetada)
 * 
 * 
 * OBJETO (referência):
 * StringBuilder sb = new StringBuilder("A");
 * try {
 *     return sb; ─────────┐ Retorna referência
 * } finally {            │
 *     sb.append("B"); ───┼──┐ Altera objeto
 * }                      │  │
 * Retorna "AB" ◄─────────┴──┘ (mesma referência)
 * 
 * 
 * REGRAS:
 * 
 * ✅ SEMPRE:
 *    - Finally executa ANTES do return
 *    - Valor primitivo preservado
 *    - Múltiplos returns: finally antes de todos
 * 
 * ⚠️ ATENÇÃO:
 *    - Return em finally SOBRESCREVE
 *    - Objeto pode ser alterado (referência)
 *    - Finally com exceção descarta return
 * 
 * ❌ EVITAR:
 *    - Return em finally (sobrescreve)
 *    - Confiar em alteração de primitivo
 */

public class ResumoFinallyReturn {
    public static void main(String[] args) {
        System.out.println("=== FINALLY E RETURN ===");
        System.out.println("\n✅ Finally executa ANTES do return");
        System.out.println("✅ Valor primitivo PRESERVADO");
        System.out.println("✅ Objeto pode ser ALTERADO");
        System.out.println("\n⚠️ Return em finally SOBRESCREVE");
        System.out.println("❌ EVITAR return em finally");
    }
}
```

---

## Aplicabilidade

**Finally e return**:
- Finally executa **antes**
- Valor **preservado**
- **Cleanup** garantido

---

## Armadilhas

### 1. Return em Finally

```java
// ❌ Return em finally (sobrescreve)
try {
    return 10;
} finally {
    return 999;  // ❌ Sobrescreve (evitar)
}
// Retorna 999
```

### 2. Tentar Alterar Primitivo

```java
// ❌ Tentar alterar primitivo retornado
int x = 10;
try {
    return x;
} finally {
    x = 999;  // ❌ NÃO afeta return
}
// Retorna 10 (não 999)
```

### 3. Exceção em Finally Descarta Return

```java
// ❌ Exceção em finally descarta return
try {
    return 10;
} finally {
    throw new Exception();  // ❌ Descarta return
}
// Lança exceção (não retorna 10)
```

---

## Boas Práticas

### 1. Não Fazer Return em Finally

```java
// ✅ Não fazer return em finally
try {
    return calcular();
} finally {
    cleanup();  // ✅ Sem return
}
```

### 2. Confiar em Preservação de Valor

```java
// ✅ Valor é preservado
try {
    int resultado = calcular();
    return resultado;  // ✅ Valor preservado
} finally {
    cleanup();
}
```

### 3. Cuidado com Objetos

```java
// ✅ Cuidado: objeto pode ser alterado
StringBuilder sb = new StringBuilder("A");
try {
    return sb;  // Referência
} finally {
    sb.append("B");  // ⚠️ Altera objeto
}
// Retorna "AB"
```

---

## Resumo

**Finally e return**: finally executa **antes** do return.

**Ordem**:
- Try encontra return → **guarda** valor
- Finally **executa**
- Método **retorna** valor guardado

**Valor preservado**:
- **Primitivo**: cópia (finally **não** afeta)
- **Objeto**: referência (finally **pode** alterar)

**Múltiplos returns**:
- Finally antes de **qualquer** return
- Não importa qual return
- Ordem: return → finally → **retorna**

**Return em finally**:
- **Sobrescreve** return do try/catch
- **Suprime** exceções
- ❌ **Evitar** sempre

**Return em catch**:
- Finally executa **antes**
- Valor **preservado**
- Mesmas regras do try

**Exceção em finally**:
- **Descarta** return do try/catch
- Exceção do finally **propaga**
- Perda de valor de retorno

**Regra de Ouro**: Finally executa **antes** de return. Valor **primitivo** preservado (cópia). **Objeto** pode ser alterado (referência). **Nunca** fazer return em finally (sobrescreve e suprime exceção).

