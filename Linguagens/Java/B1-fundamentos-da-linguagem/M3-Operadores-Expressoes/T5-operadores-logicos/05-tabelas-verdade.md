# Tabelas Verdade

## 🎯 Introdução e Definição

### Definição Conceitual

**Tabelas verdade** são representações formais que mostram **todos os possíveis resultados** de operações lógicas baseadas em **todas as combinações possíveis** de valores de entrada (`true` e `false`). São fundamentais para entender e validar expressões booleanas.

**Propósito**:
- 📊 **Visualizar**: Todas as combinações de entrada/saída
- 🧮 **Calcular**: Resultado de expressões lógicas complexas
- ✅ **Validar**: Equivalência entre expressões
- 🎓 **Ensinar**: Fundamento da lógica booleana

**Operadores cobertos**:
- `!` (NOT) - Negação
- `&&` (AND) - Conjunção
- `||` (OR) - Disjunção
- Combinações complexas

### Características Fundamentais

- 🔢 **2ⁿ linhas**: n variáveis → 2ⁿ combinações
- 📋 **Sistemática**: Lista todas as possibilidades
- 🎯 **Determinística**: Mesmo input → mesmo output
- 💡 **Base teórica**: Álgebra booleana
- 🔍 **Análise**: Ferramenta de verificação formal

---

## 📋 Sumário Conceitual

### Número de Combinações por Variáveis

| Variáveis | Combinações | Exemplo |
|-----------|-------------|---------|
| 1 | 2¹ = 2 | !A |
| 2 | 2² = 4 | A && B |
| 3 | 2³ = 8 | A && B \|\| C |
| 4 | 2⁴ = 16 | (A && B) \|\| (C && D) |

---

## 🧠 Fundamentos Teóricos

### 1. Operador NOT (!)

**Tabela verdade NOT**:
| A | !A |
|---|---|
| false | **true** |
| true | **false** |

**Código Java**:
```java
boolean a;

// false
a = false;
System.out.println(!a);  // true

// true
a = true;
System.out.println(!a);  // false
```

**Visualização completa**:
```java
System.out.println("A\t| !A");
System.out.println("--------");
System.out.println("false\t| " + !false);  // true
System.out.println("true\t| " + !true);    // false
```

**Propriedades**:
- **Dupla negação**: `!!A = A`
- **Exclusão do terceiro termo**: A é true OU false (não há terceira opção)

---

### 2. Operador AND (&&)

**Tabela verdade AND**:
| A | B | A && B |
|---|---|--------|
| false | false | false |
| false | true | false |
| true | false | false |
| true | true | **true** |

**Regra mnemônica**: **Somente true se AMBOS forem true**.

**Código Java**:
```java
boolean a, b;

// false && false = false
a = false; b = false;
System.out.println(a && b);  // false

// false && true = false
a = false; b = true;
System.out.println(a && b);  // false

// true && false = false
a = true; b = false;
System.out.println(a && b);  // false

// true && true = true
a = true; b = true;
System.out.println(a && b);  // true
```

**Visualização completa**:
```java
System.out.println("A\t| B\t| A && B");
System.out.println("------------------------");
for (boolean a : new boolean[]{false, true}) {
    for (boolean b : new boolean[]{false, true}) {
        System.out.println(a + "\t| " + b + "\t| " + (a && b));
    }
}

// Saída:
// A     | B     | A && B
// ------------------------
// false | false | false
// false | true  | false
// true  | false | false
// true  | true  | true
```

**Propriedades AND**:
- **Identidade**: `A && true = A`
- **Anulação**: `A && false = false`
- **Idempotência**: `A && A = A`
- **Comutatividade**: `A && B = B && A`
- **Associatividade**: `(A && B) && C = A && (B && C)`

---

### 3. Operador OR (||)

**Tabela verdade OR**:
| A | B | A \|\| B |
|---|---|--------|
| false | false | false |
| false | true | **true** |
| true | false | **true** |
| true | true | **true** |

**Regra mnemônica**: **True se PELO MENOS UMA for true**.

**Código Java**:
```java
boolean a, b;

// false || false = false
a = false; b = false;
System.out.println(a || b);  // false

// false || true = true
a = false; b = true;
System.out.println(a || b);  // true

// true || false = true
a = true; b = false;
System.out.println(a || b);  // true

// true || true = true
a = true; b = true;
System.out.println(a || b);  // true
```

**Visualização completa**:
```java
System.out.println("A\t| B\t| A || B");
System.out.println("------------------------");
for (boolean a : new boolean[]{false, true}) {
    for (boolean b : new boolean[]{false, true}) {
        System.out.println(a + "\t| " + b + "\t| " + (a || b));
    }
}

// Saída:
// A     | B     | A || B
// ------------------------
// false | false | false
// false | true  | true
// true  | false | true
// true  | true  | true
```

**Propriedades OR**:
- **Identidade**: `A || false = A`
- **Anulação**: `A || true = true`
- **Idempotência**: `A || A = A`
- **Comutatividade**: `A || B = B || A`
- **Associatividade**: `(A || B) || C = A || (B || C)`

---

### 4. Operador XOR (^) - Exclusive OR

**Tabela verdade XOR**:
| A | B | A ^ B |
|---|---|-------|
| false | false | false |
| false | true | **true** |
| true | false | **true** |
| true | true | false |

**Regra**: **True se EXATAMENTE UMA for true** (diferentes).

**Código Java**:
```java
boolean a, b;

// false ^ false = false (iguais)
a = false; b = false;
System.out.println(a ^ b);  // false

// false ^ true = true (diferentes)
a = false; b = true;
System.out.println(a ^ b);  // true

// true ^ false = true (diferentes)
a = true; b = false;
System.out.println(a ^ b);  // true

// true ^ true = false (iguais)
a = true; b = true;
System.out.println(a ^ b);  // false
```

**Equivalência**:
```java
// A ^ B = (A && !B) || (!A && B)
boolean a = true, b = false;

boolean xor1 = a ^ b;
boolean xor2 = (a && !b) || (!a && b);

System.out.println(xor1 == xor2);  // true
```

---

### 5. Combinação de Operadores

**Expressão: `A && B || C`**

**Tabela verdade completa (3 variáveis = 8 linhas)**:
| A | B | C | A && B | A && B \|\| C |
|---|---|---|--------|--------------|
| false | false | false | false | false |
| false | false | true | false | **true** |
| false | true | false | false | false |
| false | true | true | false | **true** |
| true | false | false | false | false |
| true | false | true | false | **true** |
| true | true | false | **true** | **true** |
| true | true | true | **true** | **true** |

**Código Java**:
```java
System.out.println("A\t| B\t| C\t| A && B || C");
System.out.println("----------------------------------------");

for (boolean a : new boolean[]{false, true}) {
    for (boolean b : new boolean[]{false, true}) {
        for (boolean c : new boolean[]{false, true}) {
            boolean resultado = a && b || c;
            System.out.println(a + "\t| " + b + "\t| " + c + "\t| " + resultado);
        }
    }
}
```

---

### 6. Lei de De Morgan

**Primeira lei: `!(A && B) = !A || !B`**

**Tabela de verificação**:
| A | B | A && B | !(A && B) | !A | !B | !A \|\| !B | Iguais? |
|---|---|--------|----------|----|----|----------|---------|
| false | false | false | **true** | true | true | **true** | ✅ |
| false | true | false | **true** | true | false | **true** | ✅ |
| true | false | false | **true** | false | true | **true** | ✅ |
| true | true | true | **false** | false | false | **false** | ✅ |

**Código Java**:
```java
for (boolean a : new boolean[]{false, true}) {
    for (boolean b : new boolean[]{false, true}) {
        boolean lado1 = !(a && b);
        boolean lado2 = !a || !b;
        
        System.out.println("A=" + a + ", B=" + b + 
                           ": !(A && B)=" + lado1 + 
                           ", !A || !B=" + lado2 + 
                           " → Iguais: " + (lado1 == lado2));
    }
}
```

**Segunda lei: `!(A || B) = !A && !B`**

**Tabela de verificação**:
| A | B | A \|\| B | !(A \|\| B) | !A | !B | !A && !B | Iguais? |
|---|---|--------|----------|----|----|----------|---------|
| false | false | false | **true** | true | true | **true** | ✅ |
| false | true | true | **false** | true | false | **false** | ✅ |
| true | false | true | **false** | false | true | **false** | ✅ |
| true | true | true | **false** | false | false | **false** | ✅ |

---

### 7. Expressões Complexas: `(A || B) && (C || D)`

**Tabela verdade completa (4 variáveis = 16 linhas)**:
| A | B | C | D | A \|\| B | C \|\| D | (A \|\| B) && (C \|\| D) |
|---|---|---|---|---------|---------|------------------------|
| false | false | false | false | false | false | false |
| false | false | false | true | false | true | false |
| false | false | true | false | false | true | false |
| false | false | true | true | false | true | false |
| false | true | false | false | true | false | false |
| false | true | false | true | **true** | **true** | **true** |
| false | true | true | false | **true** | **true** | **true** |
| false | true | true | true | **true** | **true** | **true** |
| true | false | false | false | true | false | false |
| true | false | false | true | **true** | **true** | **true** |
| true | false | true | false | **true** | **true** | **true** |
| true | false | true | true | **true** | **true** | **true** |
| true | true | false | false | true | false | false |
| true | true | false | true | **true** | **true** | **true** |
| true | true | true | false | **true** | **true** | **true** |
| true | true | true | true | **true** | **true** | **true** |

**Código gerador de tabela verdade**:
```java
public class GeradorTabelaVerdade {
    public static void main(String[] args) {
        System.out.println("A\t| B\t| C\t| D\t| A || B\t| C || D\t| (A || B) && (C || D)");
        System.out.println("------------------------------------------------------------------------");
        
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                for (boolean c : new boolean[]{false, true}) {
                    for (boolean d : new boolean[]{false, true}) {
                        boolean parte1 = a || b;
                        boolean parte2 = c || d;
                        boolean resultado = parte1 && parte2;
                        
                        System.out.printf("%s\t| %s\t| %s\t| %s\t| %s\t| %s\t| %s\n",
                            a, b, c, d, parte1, parte2, resultado);
                    }
                }
            }
        }
    }
}
```

---

### 8. Implicação Lógica: `A → B` (Se A então B)

**Definição**: `A → B = !A || B`

**Tabela verdade**:
| A | B | A → B (!A \|\| B) |
|---|---|---------------|
| false | false | **true** |
| false | true | **true** |
| true | false | **false** |
| true | true | **true** |

**Regra**: **Falso apenas quando A é true e B é false**.

**Código Java**:
```java
public class Implicacao {
    static boolean implica(boolean a, boolean b) {
        return !a || b;
    }
    
    public static void main(String[] args) {
        System.out.println("A\t| B\t| A → B");
        System.out.println("------------------------");
        
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                System.out.println(a + "\t| " + b + "\t| " + implica(a, b));
            }
        }
    }
}
```

---

### 9. Equivalência Lógica: `A ↔ B` (A se e somente se B)

**Definição**: `A ↔ B = (A && B) || (!A && !B)`

**Tabela verdade**:
| A | B | A ↔ B |
|---|---|-------|
| false | false | **true** |
| false | true | false |
| true | false | false |
| true | true | **true** |

**Regra**: **True quando A e B têm o MESMO valor**.

**Código Java**:
```java
public class Equivalencia {
    static boolean equivale(boolean a, boolean b) {
        return (a && b) || (!a && !b);
        // Equivalente: return a == b;
    }
    
    public static void main(String[] args) {
        System.out.println("A\t| B\t| A ↔ B");
        System.out.println("------------------------");
        
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                System.out.println(a + "\t| " + b + "\t| " + equivale(a, b));
            }
        }
    }
}
```

---

### 10. Gerador Universal de Tabelas Verdade

**Classe genérica**:
```java
public class TabelaVerdade {
    @FunctionalInterface
    interface ExpressaoBooleana {
        boolean avaliar(boolean... valores);
    }
    
    public static void gerar(int numVariaveis, ExpressaoBooleana expressao) {
        int numLinhas = (int) Math.pow(2, numVariaveis);
        
        // Cabeçalho
        for (int i = 0; i < numVariaveis; i++) {
            System.out.print((char)('A' + i) + "\t| ");
        }
        System.out.println("Resultado");
        System.out.println("-".repeat(numVariaveis * 8 + 10));
        
        // Linhas
        for (int i = 0; i < numLinhas; i++) {
            boolean[] valores = new boolean[numVariaveis];
            
            // Gera combinação binária
            for (int j = 0; j < numVariaveis; j++) {
                valores[j] = (i & (1 << (numVariaveis - 1 - j))) != 0;
                System.out.print(valores[j] + "\t| ");
            }
            
            boolean resultado = expressao.avaliar(valores);
            System.out.println(resultado);
        }
    }
    
    public static void main(String[] args) {
        // Exemplo: A && B || C
        gerar(3, valores -> valores[0] && valores[1] || valores[2]);
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Importância das Tabelas Verdade

**1. Verificação formal**:
```java
// Verificar se duas expressões são equivalentes
// !(A && B) vs !A || !B
for (boolean a : new boolean[]{false, true}) {
    for (boolean b : new boolean[]{false, true}) {
        boolean expr1 = !(a && b);
        boolean expr2 = !a || !b;
        
        if (expr1 != expr2) {
            System.out.println("Não são equivalentes!");
            return;
        }
    }
}
System.out.println("São equivalentes!");  // Executa
```

**2. Debugging de lógica complexa**:
```java
// Debug: gerar tabela para entender comportamento
public class DebugLogica {
    static boolean logicaComplexa(boolean a, boolean b, boolean c) {
        return (a || b) && (!c || a);
    }
    
    public static void main(String[] args) {
        // Gera tabela para visualizar
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                for (boolean c : new boolean[]{false, true}) {
                    System.out.printf("A=%s, B=%s, C=%s → %s\n",
                        a, b, c, logicaComplexa(a, b, c));
                }
            }
        }
    }
}
```

### Álgebra Booleana

**Leis fundamentais**:
```java
// Comutatividade
A && B = B && A
A || B = B || A

// Associatividade
(A && B) && C = A && (B && C)
(A || B) || C = A || (B || C)

// Distributividade
A && (B || C) = (A && B) || (A && C)
A || (B && C) = (A || B) && (A || C)

// De Morgan
!(A && B) = !A || !B
!(A || B) = !A && !B

// Absorção
A && (A || B) = A
A || (A && B) = A
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Equivalência

```java
public class ValidadorExpressoes {
    public static boolean saoEquivalentes(
        BiFunction<Boolean, Boolean, Boolean> expr1,
        BiFunction<Boolean, Boolean, Boolean> expr2) {
        
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                if (!expr1.apply(a, b).equals(expr2.apply(a, b))) {
                    return false;
                }
            }
        }
        return true;
    }
    
    public static void main(String[] args) {
        // Verifica: !(A && B) = !A || !B
        boolean equiv = saoEquivalentes(
            (a, b) -> !(a && b),
            (a, b) -> !a || !b
        );
        System.out.println("Equivalentes: " + equiv);  // true
    }
}
```

### Caso 2: Gerador de Testes Unitários

```java
public class GeradorTestes {
    public static void gerarTestesBooleanos(String metodo, 
                                            BiPredicate<Boolean, Boolean> logica) {
        System.out.println("@Test");
        System.out.println("public void testar" + metodo + "() {");
        
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                boolean resultado = logica.test(a, b);
                System.out.printf("    assertEquals(%s, %s(%s, %s));\n",
                    resultado, metodo, a, b);
            }
        }
        
        System.out.println("}");
    }
}
```

### Caso 3: Simplificação de Expressões

```java
public class SimplificadorLogica {
    // Expressão original complexa
    static boolean expressaoComplexa(boolean a, boolean b, boolean c) {
        return (a && b) || (a && c) || (b && c);
    }
    
    // Expressão simplificada (verificar com tabela verdade)
    static boolean expressaoSimplificada(boolean a, boolean b, boolean c) {
        return (a && (b || c)) || (b && c);
    }
    
    public static void main(String[] args) {
        // Verifica se são equivalentes
        boolean iguais = true;
        
        for (boolean a : new boolean[]{false, true}) {
            for (boolean b : new boolean[]{false, true}) {
                for (boolean c : new boolean[]{false, true}) {
                    if (expressaoComplexa(a, b, c) != 
                        expressaoSimplificada(a, b, c)) {
                        iguais = false;
                        break;
                    }
                }
            }
        }
        
        System.out.println("Expressões equivalentes: " + iguais);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Explosão Combinatória

**Problema**: Muitas variáveis geram muitas linhas.
```java
// 10 variáveis = 2^10 = 1024 linhas
// 20 variáveis = 2^20 = 1.048.576 linhas!
```

### 2. Não Representa Short-Circuit

**Problema**: Tabela mostra resultado lógico, não execução.
```java
// Tabela verdade mostra: false && true = false
// Mas NÃO mostra que segunda expressão não foi avaliada
```

### 3. Complexidade Visual

**Problema**: Tabelas grandes são difíceis de ler.
```java
// ✅ Solução: quebrar em sub-expressões
boolean parte1 = A && B;
boolean parte2 = C || D;
boolean resultado = parte1 && parte2;
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operadores lógicos**: AND, OR, NOT, XOR
- **Álgebra booleana**: Base matemática
- **Lei de De Morgan**: Transformação de expressões
- **Circuitos digitais**: Portas lógicas (AND, OR, NOT gates)
- **Lógica proposicional**: Fundamento filosófico
- **Teoria dos conjuntos**: Intersecção (AND), União (OR)

---

## 🚀 Boas Práticas

1. ✅ **Use tabelas para validar equivalências**
   ```java
   // Antes de simplificar, valide com tabela verdade
   ```

2. ✅ **Gere tabelas para expressões complexas**
   ```java
   // Entenda comportamento antes de implementar
   ```

3. ✅ **Documente com tabelas**
   ```java
   /**
    * Lógica: (A && B) || (C && D)
    * Tabela verdade:
    * A | B | C | D | Resultado
    * ---------------------------
    * T | T | F | F | T
    * ...
    */
   ```

4. ✅ **Simplifique com base em tabelas**
   ```java
   // Use tabela para verificar simplificações
   ```

5. ✅ **Teste todas as combinações**
   ```java
   @Test
   public void testarTodasCombinacoes() {
       // Baseado em tabela verdade
   }
   ```

6. ✅ **Quebre expressões grandes**
   ```java
   // Gere tabelas para sub-expressões
   boolean parte1 = ...;
   boolean parte2 = ...;
   ```

7. ✅ **Use ferramentas para gerar tabelas**
   ```java
   TabelaVerdade.gerar(3, valores -> ...);
   ```

8. ✅ **Valide Lei de De Morgan**
   ```java
   // Sempre verifique transformações com tabela
   ```

9. ✅ **Documente casos especiais**
   ```java
   // Destaque linhas importantes da tabela
   ```

10. ✅ **Ensine com tabelas verdade**
    ```java
    // Melhor forma de explicar lógica booleana
    ```
