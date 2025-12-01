# Precedência de Operadores Lógicos

## 🎯 Introdução e Definição

### Definição Conceitual

**Precedência de operadores lógicos** define a **ordem em que operadores são avaliados** em uma expressão com múltiplos operadores, determinando qual operação é executada primeiro quando não há parênteses explícitos.

**Hierarquia dos operadores lógicos** (maior para menor precedência):
1. **`!` (NOT)** - Maior precedência
2. **`&&` (AND)** - Precedência intermediária
3. **`||` (OR)** - Menor precedência

**Exemplo básico**:
```java
boolean resultado = !false && true || false;
// Avaliação:
// 1. !false = true       (! tem maior precedência)
// 2. true && true = true (&&  tem precedência sobre ||)
// 3. true || false = true

System.out.println(resultado);  // true
```

### Características Fundamentais

- 📐 **Hierárquica**: Ordem fixa de avaliação
- 🎯 **Previsível**: Regras consistentes em toda expressão
- 🔗 **Associatividade**: Define ordem quando operadores têm mesma precedência
- 💡 **Parênteses**: Sobrescrevem precedência natural
- ⚡ **Short-circuit**: Aplicado após determinar precedência

---

## 📋 Sumário Conceitual

### Tabela de Precedência Completa (Operadores Principais)

| Prioridade | Operador | Descrição | Associatividade |
|-----------|----------|-----------|-----------------|
| 1 (maior) | `()` | Parênteses | N/A |
| 2 | `++`, `--`, `!`, `+`, `-` (unários) | Incremento, decremento, NOT, mais/menos unário | Direita → Esquerda |
| 3 | `*`, `/`, `%` | Multiplicação, divisão, módulo | Esquerda → Direita |
| 4 | `+`, `-` | Adição, subtração | Esquerda → Direita |
| 5 | `<<`, `>>`, `>>>` | Deslocamento de bits | Esquerda → Direita |
| 6 | `<`, `<=`, `>`, `>=`, `instanceof` | Relacionais | Esquerda → Direita |
| 7 | `==`, `!=` | Igualdade, diferença | Esquerda → Direita |
| 8 | `&` | AND bit a bit | Esquerda → Direita |
| 9 | `^` | XOR bit a bit | Esquerda → Direita |
| 10 | `\|` | OR bit a bit | Esquerda → Direita |
| 11 | **`&&`** | **AND lógico** | Esquerda → Direita |
| 12 | **`\|\|`** | **OR lógico** | Esquerda → Direita |
| 13 | `? :` | Ternário | Direita → Esquerda |
| 14 (menor) | `=`, `+=`, `-=`, etc. | Atribuição | Direita → Esquerda |

---

## 🧠 Fundamentos Teóricos

### 1. Precedência: NOT (!) > AND (&&) > OR (||)

**NOT tem maior precedência**:
```java
boolean a = false;
boolean b = true;

// ! é avaliado PRIMEIRO
boolean resultado = !a && b;
//                  (!a) && b  (parênteses implícitos)
//                  true && true
//                     true

System.out.println(resultado);  // true
```

**AND tem precedência sobre OR**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// && é avaliado ANTES de ||
boolean resultado = a && b || c;
//                  (a && b) || c  (parênteses implícitos)
//                  (true && false) || true
//                      false       || true
//                           true

System.out.println(resultado);  // true
```

**Todos juntos**:
```java
boolean resultado = !false && true || false;
// Ordem:
// 1. !false = true            (! maior precedência)
// 2. true && true = true      (&& antes de ||)
// 3. true || false = true

System.out.println(resultado);  // true
```

### 2. Associatividade: Mesma Precedência

**AND (&&) - Esquerda para Direita**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// Múltiplos && (mesma precedência)
boolean resultado = a && b && c;
//                  (a && b) && c  (esquerda → direita)
//                  (true && false) && true
//                      false       && true
//                           false

System.out.println(resultado);  // false
```

**OR (||) - Esquerda para Direita**:
```java
boolean a = false;
boolean b = false;
boolean c = true;

// Múltiplos || (mesma precedência)
boolean resultado = a || b || c;
//                  (a || b) || c  (esquerda → direita)
//                  (false || false) || true
//                       false       || true
//                            true

System.out.println(resultado);  // true
```

**NOT (!) - Direita para Esquerda**:
```java
boolean a = true;

// Múltiplos ! (direita → esquerda)
boolean resultado = !!!a;
//                  !!((!a))
//                  !!(false)
//                  !(true)
//                   false

System.out.println(resultado);  // false
```

### 3. Precedência vs Parênteses

**Sem parênteses (precedência natural)**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// && antes de ||
boolean resultado = a && b || c;
//                  (a && b) || c
System.out.println(resultado);  // true
```

**Com parênteses (ordem forçada)**:
```java
boolean a = true;
boolean b = false;
boolean c = true;

// || executado primeiro (parênteses)
boolean resultado = a && (b || c);
//                  true && (false || true)
//                  true &&     true
//                       true
System.out.println(resultado);  // true
```

**Comparação**:
```java
boolean a = false;
boolean b = true;
boolean c = false;

// Sem parênteses: && primeiro
boolean r1 = a && b || c;     // (a && b) || c = false || false = false

// Com parênteses: || primeiro
boolean r2 = a && (b || c);   // a && (b || c) = false && true = false

// Mesmo resultado neste caso, mas lógica diferente
System.out.println(r1);  // false
System.out.println(r2);  // false
```

### 4. Precedência com Operadores Relacionais

**Relacionais têm precedência MAIOR que lógicos**:
```java
int x = 10;
int y = 5;
boolean a = true;

// Relacionais avaliados ANTES de &&
boolean resultado = x > 5 && y < 10;
//                  (x > 5) && (y < 10)  (parênteses implícitos)
//                  (10 > 5) && (5 < 10)
//                     true  &&   true
//                         true

System.out.println(resultado);  // true
```

**Ordem completa**:
```java
// Precedência: ! > relacionais (>, <, etc.) > == > && > ||
boolean resultado = !false && 10 > 5 || 3 == 3;
// 1. !false = true
// 2. 10 > 5 = true
// 3. 3 == 3 = true
// 4. true && true = true  (&&)
// 5. true || true = true  (||)

System.out.println(resultado);  // true
```

### 5. Precedência com Aritméticos

**Aritméticos têm precedência MAIOR que relacionais**:
```java
int x = 10;
int y = 5;

// Aritmética avaliada ANTES de comparação
boolean resultado = x + y > 10;
//                  (x + y) > 10  (parênteses implícitos)
//                  (10 + 5) > 10
//                     15    > 10
//                       true

System.out.println(resultado);  // true
```

**Ordem completa com aritmética**:
```java
// Precedência: * / % > + - > relacionais > && > ||
boolean resultado = 10 + 5 * 2 > 15 && 3 < 5;
// 1. 5 * 2 = 10         (*)
// 2. 10 + 10 = 20       (+)
// 3. 20 > 15 = true     (>)
// 4. 3 < 5 = true       (<)
// 5. true && true = true (&&)

System.out.println(resultado);  // true
```

### 6. Expressões Complexas

**Múltiplos níveis de precedência**:
```java
int a = 10;
int b = 5;
boolean c = false;

// ! > * > + > > > && > ||
boolean resultado = !c && a + b * 2 > 15 || a < b;
// 1. b * 2 = 10         (*)
// 2. a + 10 = 20        (+)
// 3. !c = true          (!)
// 4. 20 > 15 = true     (>)
// 5. 10 < 5 = false     (<)
// 6. true && true = true (&&)
// 7. true || false = true (||)

System.out.println(resultado);  // true
```

**Quebra passo a passo**:
```java
public class PrecedenciaCompleta {
    public static void main(String[] args) {
        int a = 10;
        int b = 5;
        boolean c = false;
        
        // Expressão completa
        boolean resultado = !c && a + b * 2 > 15 || a < b;
        
        // Passo a passo
        System.out.println("Passo 1 (b * 2): " + (b * 2));           // 10
        System.out.println("Passo 2 (a + 10): " + (a + 10));         // 20
        System.out.println("Passo 3 (!c): " + (!c));                 // true
        System.out.println("Passo 4 (20 > 15): " + (20 > 15));       // true
        System.out.println("Passo 5 (a < b): " + (a < b));           // false
        System.out.println("Passo 6 (true && true): " + (true && true));  // true
        System.out.println("Passo 7 (true || false): " + (true || false)); // true
        System.out.println("Resultado final: " + resultado);         // true
    }
}
```

### 7. Short-Circuit e Precedência

**Precedência determina ordem, short-circuit otimiza**:
```java
boolean a = false;
boolean b = true;
boolean c = true;

// && tem precedência sobre ||
// a && b é avaliado PRIMEIRO (resultado: false)
// Como resultado é false, || avalia c
boolean resultado = a && b || c;
//                  (a && b) || c
//                  (false && b) || c  (short-circuit: b NÃO avaliado)
//                      false    || c
//                      false    || true
//                           true

System.out.println(resultado);  // true
```

**Demonstração com métodos**:
```java
public class PrecedenciaShortCircuit {
    static boolean metodoA() {
        System.out.println("metodoA executado");
        return false;
    }
    
    static boolean metodoB() {
        System.out.println("metodoB executado");
        return true;
    }
    
    static boolean metodoC() {
        System.out.println("metodoC executado");
        return true;
    }
    
    public static void main(String[] args) {
        // metodoA() && metodoB() || metodoC()
        boolean resultado = metodoA() && metodoB() || metodoC();
        System.out.println("Resultado: " + resultado);
    }
}

// Saída:
// metodoA executado
// metodoC executado
// Resultado: true
// (metodoB NÃO executado devido a short-circuit do &&)
```

### 8. Precedência com Incremento/Decremento

**Unários têm precedência alta**:
```java
int x = 5;
boolean resultado = ++x > 5;
//                  (++x) > 5  (++ é unário, maior precedência)
//                    6   > 5
//                      true

System.out.println(resultado);  // true
System.out.println(x);          // 6
```

**Combinado com NOT**:
```java
boolean a = false;

// ! e ++ têm precedência similar (unários)
// Associatividade direita → esquerda
boolean resultado = !!a;
//                  !(!a)
//                  !(true)
//                   false

System.out.println(resultado);  // false
```

### 9. Precedência com Atribuição

**Atribuição tem MENOR precedência**:
```java
boolean a, b, c;

// && e || avaliados ANTES de =
a = false && true || true;
//  (false && true) || true  (precedência)
//       false       || true
//            true
System.out.println(a);  // true

// Equivalente com parênteses explícitos:
b = ((false && true) || true);
System.out.println(b);  // true
```

**Atribuição composta**:
```java
boolean valor = true;

// && avaliado ANTES de &=
valor &= false || true;
//       (false || true)  (precedência)
//            true
// valor = valor & true
// valor = true & true = true

System.out.println(valor);  // true
```

### 10. Tabela Resumo de Precedência

**Ordem de avaliação (maior para menor)**:
```java
// 1. Parênteses () - SEMPRE primeiro
// 2. Unários: ++, --, !, +, - (unário)
// 3. Multiplicativos: *, /, %
// 4. Aditivos: +, -
// 5. Deslocamento: <<, >>, >>>
// 6. Relacionais: <, <=, >, >=, instanceof
// 7. Igualdade: ==, !=
// 8. AND bit a bit: &
// 9. XOR bit a bit: ^
// 10. OR bit a bit: |
// 11. AND lógico: &&
// 12. OR lógico: ||
// 13. Ternário: ? :
// 14. Atribuição: =, +=, -=, *=, etc.
```

**Exemplo usando todos níveis principais**:
```java
int x = 10;
int y = 5;
boolean a = true;
boolean b = false;

// Múltiplos níveis de precedência
boolean resultado = !b && x * 2 + y > 20 || a;
// 1. x * 2 = 20         (*)
// 2. 20 + y = 25        (+)
// 3. !b = true          (!)
// 4. 25 > 20 = true     (>)
// 5. true && true = true (&&)
// 6. true || true = true (||)

System.out.println(resultado);  // true
```

---

## 🔍 Análise Conceitual Profunda

### Por que Precedência Importa?

**1. Previsibilidade do código**:
```java
// Sem conhecer precedência, resultado é ambíguo
boolean resultado = a && b || c;

// Com conhecimento de precedência:
// && tem precedência sobre ||
// Logo: (a && b) || c
```

**2. Evitar bugs sutis**:
```java
boolean podeDirigir = idade > 18 && temCarteira || isAdmin;
// Interpretado como: (idade > 18 && temCarteira) || isAdmin
// Administrador pode dirigir mesmo sem idade/carteira!

// Se a intenção era outra:
boolean podeDirigir = idade > 18 && (temCarteira || isAdmin);
```

**3. Otimização do compilador**:
```java
// Compilador usa precedência para otimizar
// Expressões com precedência correta podem ser simplificadas
```

### Associatividade Explicada

**Esquerda para Direita (AND, OR)**:
```java
// a && b && c é avaliado como:
// ((a && b) && c)
// Primeiro a && b, depois resultado && c

// a || b || c é avaliado como:
// ((a || b) || c)
// Primeiro a || b, depois resultado || c
```

**Direita para Esquerda (NOT, unários)**:
```java
// !!!a é avaliado como:
// !(!(!a))
// Primeiro !a, depois !(!a), depois !(resultado)

// ++--x é avaliado como:
// ++(--x)
// Primeiro --x, depois ++resultado
```

### Quando Usar Parênteses

**Sempre use quando**:
1. Ordem diferente da precedência natural
2. Expressão complexa (mesmo que precedência esteja correta)
3. Legibilidade é mais importante que concisão

```java
// ❌ Confia na precedência (menos claro)
if (a && b || c && d) { }

// ✅ Usa parênteses (mais claro)
if ((a && b) || (c && d)) { }
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação com Precedência Correta

```java
public class ValidadorUsuario {
    public boolean isValido(Usuario usuario) {
        // Precedência: != > && > ||
        // (usuario != null && usuario.isAtivo()) || usuario.isAdmin()
        return usuario != null && usuario.isAtivo() || usuario.isAdmin();
        
        // ✅ Melhor: parênteses explícitos
        // return (usuario != null && usuario.isAtivo()) || usuario.isAdmin();
    }
}
```

### Caso 2: Filtros com Múltiplas Condições

```java
public class FiltroProduto {
    public boolean aceitar(Produto p, double precoMax, String categoria) {
        // Precedência: != > && > ||
        return p != null && 
               p.getPreco() <= precoMax &&
               (categoria == null || p.getCategoria().equals(categoria));
    }
}
```

### Caso 3: Controle de Acesso

```java
public class SistemaAcesso {
    public boolean podeAcessar(Usuario usuario, Recurso recurso) {
        // Precedência implícita: && antes de ||
        return usuario.isAdmin() ||
               usuario.isProprietario(recurso) && recurso.isPublico();
        
        // Pode ser confuso! Melhor:
        // return usuario.isAdmin() ||
        //        (usuario.isProprietario(recurso) && recurso.isPublico());
    }
}
```

### Caso 4: Cálculos com Condições

```java
public class CalculadoraDesconto {
    public double calcularDesconto(double valor, int quantidade, boolean vip) {
        // Precedência: * > > > && > ||
        double desconto = 0;
        
        if (vip || quantidade > 10 && valor * quantidade > 1000) {
            desconto = 0.15;
        }
        
        return desconto;
        
        // ✅ Mais claro:
        // if (vip || (quantidade > 10 && (valor * quantidade) > 1000)) {
    }
}
```

### Caso 5: Expressões Complexas Simplificadas

```java
public class ValidadorComplexo {
    public boolean validar(int idade, boolean ativo, boolean premium, double saldo) {
        // Múltiplos níveis de precedência
        // ! > >= > && > ||
        return !ativo && idade >= 18 || premium && saldo > 100;
        
        // ✅ Quebrado em partes (mais legível):
        boolean usuarioInativo = !ativo && idade >= 18;
        boolean clientePremium = premium && saldo > 100;
        return usuarioInativo || clientePremium;
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Precedência Não é Universal

**Problema**: Outras linguagens têm ordens diferentes.
```java
// Java: && tem precedência sobre ||
// Outras linguagens podem diferir
// Sempre documente ou use parênteses ao migrar código
```

### 2. Confiança Excessiva na Precedência

**Problema**: Código difícil de ler.
```java
// ❌ Confia demais na precedência
if (!a && b || c && d || e) { }

// ✅ Use parênteses para clareza
if ((!a && b) || (c && d) || e) { }
```

### 3. Associatividade Não é Óbvia

**Problema**: Direção não é clara.
```java
// Qual ordem? (a && b) && c ou a && (b && c)?
// Resposta: esquerda → direita, mas não é óbvio
```

### 4. Mudanças em Versões

**Problema**: Precedência pode mudar (raramente).
```java
// Verifique documentação da versão Java usada
```

### 5. Conflito com Legibilidade

**Problema**: Precedência correta != código claro.
```java
// Tecnicamente correto, mas confuso:
if (a && b || c && d && e || f) { }

// Melhor:
boolean cond1 = a && b;
boolean cond2 = c && d && e;
if (cond1 || cond2 || f) { }
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operadores lógicos**: AND, OR, NOT
- **Associatividade**: Ordem quando precedência é igual
- **Parênteses**: Sobrescrevem precedência
- **Short-circuit**: Aplicado após resolver precedência
- **Operadores relacionais**: Precedência relativa
- **Álgebra booleana**: Base matemática
- **Compiladores**: Implementação de precedência

---

## 🚀 Boas Práticas

1. ✅ **Use parênteses quando houver dúvida**
   ```java
   if ((a && b) || (c && d)) {  // ✅ Claro
       // ...
   }
   ```

2. ✅ **Documente precedência não óbvia**
   ```java
   // Precedência: && antes de ||
   // Resultado: (usuarioAtivo && premium) || admin
   return usuarioAtivo && premium || admin;
   ```

3. ✅ **Quebre expressões complexas**
   ```java
   boolean usuarioValido = usuario != null && usuario.isAtivo();
   boolean temPermissao = usuarioValido && (isAdmin || isMod);
   ```

4. ✅ **Evite múltiplos níveis sem parênteses**
   ```java
   // ❌ Evitar
   if (a && b || c && d && e) { }
   
   // ✅ Usar parênteses
   if ((a && b) || (c && d && e)) { }
   ```

5. ✅ **Estude a tabela de precedência**
   ```java
   // Conheça: ! > && > ||
   // Saiba quando adicionar parênteses
   ```

6. ✅ **Prefira clareza a concisão**
   ```java
   // Parênteses "desnecessários" são OK se melhoram legibilidade
   if ((idade >= 18) && (temCarteira)) { }
   ```

7. ✅ **Use constantes para magic numbers**
   ```java
   final int IDADE_MINIMA = 18;
   if (idade >= IDADE_MINIMA && temCarteira) { }
   ```

8. ✅ **Teste com diferentes valores**
   ```java
   // Valide que precedência está correta
   @Test
   public void testarPrecedencia() {
       assertTrue((true && false) || true);
   }
   ```

9. ✅ **Evite negações múltiplas**
   ```java
   // ❌ Confuso
   if (!!(!a && !b)) { }
   
   // ✅ Simplifique
   if (!a && !b) { }
   ```

10. ✅ **Documente intenção, não só código**
    ```java
    // Acesso permitido se usuário ativo E (admin OU moderador)
    return usuarioAtivo && (isAdmin || isModerador);
    ```
