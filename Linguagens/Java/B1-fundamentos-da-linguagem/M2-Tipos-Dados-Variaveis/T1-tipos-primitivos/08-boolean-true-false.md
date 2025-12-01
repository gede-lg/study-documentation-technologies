# Tipo Primitivo boolean: true e false

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo **`boolean`** é o **tipo primitivo mais simples** em Java, representando valores **lógicos binários**: **`true`** (verdadeiro) ou **`false`** (falso). Diferente de outras linguagens onde valores numéricos podem ser interpretados como booleanos (ex: C, onde 0 = false, não-zero = true), em Java **boolean é um tipo distinto** e **não pode ser convertido de/para números**.

É fundamental para **controle de fluxo** (if, while, for), **expressões condicionais**, **flags de estado** e **lógica de negócios**.

### Características Fundamentais

- **Valores possíveis**: Apenas `true` ou `false`
- **Tamanho teórico**: 1 bit (mas ocupa pelo menos 1 byte na prática)
- **Valor padrão**: `false`
- **Não conversível** para/de tipos numéricos
- **Wrapper class**: `java.lang.Boolean`
- **Case-sensitive**: `true`/`false` (minúsculas obrigatórias)

### Contexto Histórico

**Lógica Booleana (George Boole, 1847)**:
- Matemático inglês criou álgebra booleana
- Base teórica para circuitos digitais e programação

**Java (1995)**:
- Tipo `boolean` separado dos numéricos (diferente de C/C++)
- Decisão de design: **segurança de tipos** (type safety)
- Evita erros comuns: `if (x = 0)` vs `if (x == 0)`

### Problema Fundamental que Resolve

#### Type Safety: Separação Lógica vs Numérica

**Em C** (confuso):
```c
int x = 5;
if (x = 0) {  // ❌ Atribuição acidental (sempre false)
    // Nunca executa
}
if (x) {  // ✅ OK (não-zero = true)
    // Executa se x != 0
}
```

**Em Java** (seguro):
```java
int x = 5;
if (x = 0) {  // ❌ ERRO DE COMPILAÇÃO: int não é boolean
    
}
if (x != 0) {  // ✅ Deve ser explicitamente comparado
    
}
```

#### Expressividade: Intenção Clara

**Sem boolean** (hipotético):
```java
int usuarioLogado = 1;  // 1 = true, 0 = false (confuso)
```

**Com boolean**:
```java
boolean usuarioLogado = true;  // ✅ Intenção clara
```

---

## 📋 Sumário Conceitual

### Declaração e Inicialização

**Literais**:
```java
boolean verdadeiro = true;
boolean falso = false;
```

**Expressões Condicionais**:
```java
boolean maiorDeIdade = idade >= 18;
boolean ehPar = (numero % 2) == 0;
boolean ehNulo = objeto == null;
```

**Operadores Lógicos**:
```java
boolean a = true, b = false;

boolean and = a && b;   // false (AND lógico)
boolean or = a || b;    // true (OR lógico)
boolean not = !a;       // false (NOT lógico)
boolean xor = a ^ b;    // true (XOR - ou exclusivo)
```

**Comparação**:
```java
boolean igual = (10 == 10);        // true
boolean diferente = (10 != 5);     // true
boolean maior = (10 > 5);          // true
boolean menorIgual = (5 <= 10);    // true
```

---

## 🧠 Fundamentos Teóricos

### Tamanho em Memória

**Teoria vs Prática**:
- **Teoricamente**: 1 bit suficiente (2 valores possíveis)
- **Na prática**: Depende da JVM e do contexto

**Tamanho Real**:
1. **Variável local**: Geralmente otimizado (pode usar registradores)
2. **Campo de classe**: Pelo menos **1 byte** (8 bits) por alinhamento de memória
3. **Array**: **1 byte por elemento** (`boolean[]`)
4. **Bitset**: Bibliotecas como `BitSet` permitem 1 bit/valor

**Exemplo**:
```java
public class MemoriaBoolean {
    private boolean flag;  // Ocupa pelo menos 1 byte (na prática)
}

boolean[] array = new boolean[8];  // 8 bytes (1 byte/elemento)
```

### Operadores Lógicos

**AND (`&&` - short-circuit)**:
```
true  && true  = true
true  && false = false
false && true  = false  (não avalia segundo operando)
false && false = false  (não avalia segundo operando)
```

**OR (`||` - short-circuit)**:
```
true  || true  = true  (não avalia segundo operando)
true  || false = true  (não avalia segundo operando)
false || true  = true
false || false = false
```

**NOT (`!`)**:
```
!true  = false
!false = true
```

**XOR (`^` - ou exclusivo)**:
```
true  ^ true  = false (ambos iguais)
true  ^ false = true  (diferentes)
false ^ true  = true  (diferentes)
false ^ false = false (ambos iguais)
```

**AND/OR Bitwise (`&`, `|`)** - NÃO short-circuit:
```java
boolean resultado = (true & false);  // false (avalia ambos operandos sempre)
```

### Short-Circuit Evaluation

**`&&` e `||` param se resultado já for conhecido**:

```java
// && para no primeiro false
boolean resultado = false && (10 / 0 == 5);  // ✅ OK (não avalia divisão por zero)

// || para no primeiro true
boolean resultado = true || (10 / 0 == 5);   // ✅ OK (não avalia divisão por zero)
```

**Uso Prático**:
```java
// Evita NullPointerException
if (objeto != null && objeto.metodo()) {  // ✅ Seguro (avalia null primeiro)
    // Executa
}

// Se fosse bitwise (&)
if (objeto != null & objeto.metodo()) {  // ❌ NullPointerException se objeto == null
    
}
```

### Tabelas Verdade

**AND (`&&`)**:

| A | B | A && B |
|---|---|--------|
| T | T | **T** |
| T | F | F |
| F | T | F |
| F | F | F |

**OR (`||`)**:

| A | B | A \|\| B |
|---|---|----------|
| T | T | **T** |
| T | F | **T** |
| F | T | **T** |
| F | F | F |

**XOR (`^`)**:

| A | B | A ^ B |
|---|---|-------|
| T | T | F |
| T | F | **T** |
| F | T | **T** |
| F | F | F |

---

## 🔍 Análise Conceitual Profunda

### Wrapper Class: Boolean

**Métodos Principais**:
```java
// Parsing
boolean b1 = Boolean.parseBoolean("true");   // true
boolean b2 = Boolean.parseBoolean("false");  // false
boolean b3 = Boolean.parseBoolean("TRUE");   // true (case-insensitive)
boolean b4 = Boolean.parseBoolean("abc");    // false (qualquer coisa != "true")

// Constantes
Boolean verdadeiro = Boolean.TRUE;
Boolean falso = Boolean.FALSE;

// Conversão
String str = Boolean.toString(true);  // "true"

// Comparação
Boolean.compare(true, false);  // 1 (true > false)
Boolean.compare(false, true);  // -1
Boolean.compare(true, true);   // 0

// Operações lógicas
Boolean.logicalAnd(true, false);  // false
Boolean.logicalOr(true, false);   // true
Boolean.logicalXor(true, false);  // true
```

**Cache de Valores**:
```java
Boolean a = true;
Boolean b = true;
System.out.println(a == b);  // true (TRUE e FALSE são cached)

Boolean c = Boolean.valueOf(true);
Boolean d = Boolean.valueOf(true);
System.out.println(c == d);  // true (mesmo objeto)
```

**Autoboxing/Unboxing**:
```java
boolean primitivo = true;
Boolean wrapper = primitivo;  // Autoboxing
boolean de_volta = wrapper;   // Unboxing
```

### Comparação: boolean vs Boolean

| Aspecto | boolean | Boolean |
|---------|---------|---------|
| **Tipo** | Primitivo | Objeto |
| **Valores** | `true`, `false` | `true`, `false`, `null` |
| **Valor padrão** | `false` | `null` |
| **Memória** | ~1 byte | ~16 bytes (objeto) |
| **Performance** | Mais rápido | Overhead de objeto |
| **Uso** | Variáveis locais, flags | Collections, APIs |

---

## 🎯 Aplicabilidade e Contextos

### Uso 1: Controle de Fluxo

```java
public class ControleFluxo {
    public String classificarIdade(int idade) {
        boolean ehCrianca = idade < 12;
        boolean ehAdolescente = idade >= 12 && idade < 18;
        boolean ehAdulto = idade >= 18 && idade < 60;
        boolean ehIdoso = idade >= 60;
        
        if (ehCrianca) {
            return "Criança";
        } else if (ehAdolescente) {
            return "Adolescente";
        } else if (ehAdulto) {
            return "Adulto";
        } else {
            return "Idoso";
        }
    }
    
    public void executarAcao(boolean condicao) {
        while (condicao) {
            // Executa até condicao ser false
            condicao = verificarCondicao();
        }
    }
}
```

### Uso 2: Flags de Estado

```java
public class Usuario {
    private boolean ativo;
    private boolean administrador;
    private boolean emailVerificado;
    
    public boolean podeAcessarPainelAdmin() {
        return ativo && administrador && emailVerificado;
    }
    
    public boolean precisaVerificarEmail() {
        return ativo && !emailVerificado;
    }
}
```

### Uso 3: Validação de Dados

```java
public class ValidadorDados {
    public boolean ehEmailValido(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        
        boolean contemArroba = email.contains("@");
        boolean contemPonto = email.contains(".");
        boolean tamanhoMinimo = email.length() >= 5;
        
        return contemArroba && contemPonto && tamanhoMinimo;
    }
    
    public boolean ehSenhaForte(String senha) {
        if (senha == null || senha.length() < 8) {
            return false;
        }
        
        boolean temMaiuscula = senha.chars().anyMatch(Character::isUpperCase);
        boolean temMinuscula = senha.chars().anyMatch(Character::isLowerCase);
        boolean temDigito = senha.chars().anyMatch(Character::isDigit);
        boolean temEspecial = senha.matches(".*[!@#$%^&*()].*");
        
        return temMaiuscula && temMinuscula && temDigito && temEspecial;
    }
}
```

### Uso 4: Lógica de Negócios

```java
public class SistemaVenda {
    private static final double DESCONTO_CLIENTE_VIP = 0.20;
    private static final double DESCONTO_COMPRA_GRANDE = 0.10;
    
    public double calcularPrecoFinal(double precoBase, boolean ehClienteVIP, boolean compraMaiorQue1000) {
        double preco = precoBase;
        
        if (ehClienteVIP || compraMaiorQue1000) {
            double desconto = ehClienteVIP ? DESCONTO_CLIENTE_VIP : DESCONTO_COMPRA_GRANDE;
            
            // VIP + compra grande = desconto acumulado
            if (ehClienteVIP && compraMaiorQue1000) {
                desconto = DESCONTO_CLIENTE_VIP + DESCONTO_COMPRA_GRANDE;
            }
            
            preco *= (1 - desconto);
        }
        
        return preco;
    }
}
```

### Uso 5: Implementação de Métodos equals()

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;  // Mesma referência
        }
        
        if (obj == null || getClass() != obj.getClass()) {
            return false;  // Nulo ou classe diferente
        }
        
        Pessoa outra = (Pessoa) obj;
        
        boolean nomeIgual = (nome == null && outra.nome == null) ||
                            (nome != null && nome.equals(outra.nome));
        boolean idadeIgual = (idade == outra.idade);
        
        return nomeIgual && idadeIgual;
    }
}
```

### Uso 6: Operador Ternário

```java
public class OperadorTernario {
    public String obterMensagem(boolean sucesso) {
        return sucesso ? "Operação bem-sucedida" : "Operação falhou";
    }
    
    public int obterMaximo(int a, int b) {
        return (a > b) ? a : b;
    }
    
    public String formatarStatus(boolean ativo) {
        String cor = ativo ? "verde" : "vermelho";
        String texto = ativo ? "ATIVO" : "INATIVO";
        return String.format("[%s] %s", cor, texto);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Não Conversível para int

**Problema**: Java não permite conversão boolean ↔ int.

```java
boolean flag = true;
int valor = flag;  // ❌ ERRO: incompatible types

int numero = 1;
boolean bool = numero;  // ❌ ERRO: incompatible types
```

**Solução**: Conversão manual.

```java
boolean flag = true;
int valor = flag ? 1 : 0;  // ✅ OK (operador ternário)

int numero = 1;
boolean bool = (numero != 0);  // ✅ OK (comparação explícita)
```

### 2. NullPointerException com Boolean Wrapper

**Problema**: `Boolean` (wrapper) pode ser `null`.

```java
Boolean wrapper = null;
if (wrapper) {  // ❌ NullPointerException (unboxing de null)
    
}
```

**Solução**: Verificar null ou usar primitivo.

```java
Boolean wrapper = null;
if (wrapper != null && wrapper) {  // ✅ Seguro
    
}

// Ou usar primitivo
boolean primitivo = false;  // Nunca null
```

### 3. Comparação com == vs equals()

**Primitivo**: Usar `==`.

```java
boolean a = true;
boolean b = true;
System.out.println(a == b);  // true
```

**Wrapper**: Usar `equals()` (ou `==` se cached).

```java
Boolean a = true;
Boolean b = true;
System.out.println(a == b);  // true (cached)
System.out.println(a.equals(b));  // true (recomendado)

Boolean c = Boolean.valueOf(true);
Boolean d = Boolean.valueOf(true);
System.out.println(c == d);  // true (mesmo objeto cached)
```

### 4. Case-Sensitive

**Problema**: `TRUE`, `False` não são válidos.

```java
boolean a = TRUE;   // ❌ ERRO: cannot find symbol
boolean b = True;   // ❌ ERRO: cannot find symbol
boolean c = true;   // ✅ OK (minúsculas)
```

### 5. Arrays boolean Não São Compactos

**Problema**: `boolean[]` usa 1 byte/elemento (não 1 bit).

```java
boolean[] flags = new boolean[8];  // 8 bytes (não 1 byte)
```

**Solução**: Usar `BitSet` para economia de memória.

```java
import java.util.BitSet;

BitSet bits = new BitSet(8);  // ~1 bit por flag
bits.set(0, true);
bits.set(1, false);
boolean valor = bits.get(0);  // true
```

---

## 🔗 Interconexões Conceituais

**Operadores Relacionados**:
- **Comparação**: `==`, `!=`, `<`, `>`, `<=`, `>=` (retornam boolean)
- **Lógicos**: `&&`, `||`, `!`, `^`
- **Ternário**: `condicao ? true : false`

**APIs que Usam boolean**:
- `Collections.isEmpty()`: retorna boolean
- `String.equals()`, `Object.equals()`: retorna boolean
- `Stream.filter()`: recebe `Predicate<T>` (retorna boolean)
- `Optional.isPresent()`: retorna boolean

---

## 🚀 Boas Práticas

1. ✅ **Usar boolean (primitivo)** para variáveis locais e flags
2. ✅ **Usar Boolean (wrapper)** apenas para Collections ou quando null é válido
3. ✅ **Nomear com prefixos**: `is`, `has`, `can`, `should`
   - `isActive`, `hasPermission`, `canDelete`, `shouldRetry`
4. ✅ **Evitar negação dupla**: `if (!notValid)` → `if (isValid)`
5. ✅ **Preferir `&&` e `||`** (short-circuit) ao invés de `&` e `|`
6. ✅ **Verificar null** antes de unboxing de `Boolean`
7. ❌ **Evitar comparação redundante**: `if (flag == true)` → `if (flag)`
8. ✅ **Usar operador ternário** para atribuições simples
9. ❌ **Evitar `new Boolean()`** (deprecated - usar `Boolean.valueOf()`)
10. ✅ **Usar `BitSet`** para grandes coleções de flags (economia de memória)
