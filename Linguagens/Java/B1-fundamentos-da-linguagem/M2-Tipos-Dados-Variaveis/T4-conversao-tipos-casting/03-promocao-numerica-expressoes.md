# Promoção Numérica em Expressões

## 🎯 Introdução e Definição

### Definição Conceitual

**Promoção numérica** é o processo automático pelo qual o compilador Java **converte temporariamente** operandos de tipos diferentes para um **tipo comum** antes de realizar uma operação aritmética ou relacional. Esta conversão garante que as operações sejam realizadas com **tipos compatíveis** e **precisão adequada**.

**Regras Fundamentais**:
1. **Operandos menores que int** → promovidos para `int`
2. **Tipos diferentes** → promovidos para o maior tipo
3. **Resultado** → mesmo tipo do maior operando

**Exemplo Básico**:
```java
byte b = 10;
short s = 20;
int resultado = b + s;  // b e s promovidos para int
```

### Características Fundamentais

**Promoção Numérica**:
- 🔄 **Automática**: Ocorre sem intervenção do programador
- ⏱️ **Temporária**: Apenas durante a operação
- 📈 **Unária**: Operando único → mínimo `int`
- 🔀 **Binária**: Dois operandos → tipo comum
- ✅ **Segura**: Não perde dados (widening)

### Contexto Histórico

**Java 1.0 (1995)**: Regras de promoção herdadas de C, com modificações:
- **Menor tipo**: `int` (C permitia `char`/`short` em expressões)
- **Consistência**: Regras claras e previsíveis
- **Segurança**: Evita overflow em operações intermediárias

### Problema Fundamental que Resolve

#### Compatibilidade de Tipos em Operações

**Sem promoção** (hipotético):
```java
byte b1 = 10;
byte b2 = 20;
byte resultado = b1 + b2;  // ⚠️ Como somar bytes diretamente?
```

**Com promoção** (Java):
```java
byte b1 = 10;
byte b2 = 20;
int resultado = b1 + b2;  // ✅ Ambos promovidos para int
```

---

## 📋 Sumário Conceitual

### Promoção Unária

**Regra**: Operandos `byte`, `short`, `char` → `int` antes de operações unárias.

```java
byte b = 10;
int resultado = +b;  // Promoção unária: byte → int
```

### Promoção Binária

**Regra**: Operandos promovidos para o maior tipo antes de operações binárias.

**Hierarquia**:
```
double > float > long > int
```

**Exemplos**:
```java
int + long → long
int + float → float
int + double → double
float + double → double
```

---

## 🧠 Fundamentos Teóricos

### 1. Promoção Numérica Unária

**Conceito**: Operandos **menores que int** são promovidos para `int` antes de operações unárias.

**Operandos afetados**: `byte`, `short`, `char`

**Exemplos**:

**Negação aritmética** (`-`):
```java
byte b = 10;
int resultado = -b;  // byte → int, depois negação
System.out.println(resultado);  // -10
```

**Complemento bit a bit** (`~`):
```java
byte b = 10;  // 0000 1010
int resultado = ~b;  // byte → int, depois complemento
System.out.println(resultado);  // -11 (1111 0101 em int)
```

**Incremento/Decremento** (`++`, `--`):
```java
byte b = 10;
b++;  // ✅ OK (exceção: atribuição composta não requer cast)
System.out.println(b);  // 11

// Mas:
byte b2 = 10;
byte resultado = b2 + 1;  // ❌ ERRO: b2 + 1 é int
```

### 2. Promoção Numérica Binária

**Conceito**: Operandos convertidos para o **maior tipo** entre eles.

**Regras de Promoção**:

1. **Se um operando é `double`** → outro é promovido para `double`
2. **Se um operando é `float`** → outro é promovido para `float`
3. **Se um operando é `long`** → outro é promovido para `long`
4. **Caso contrário** → ambos promovidos para `int`

**Exemplos**:

**byte + byte → int**:
```java
byte b1 = 10;
byte b2 = 20;
int resultado = b1 + b2;  // ✅ Ambos promovidos para int
```

**int + long → long**:
```java
int i = 100;
long l = 200L;
long resultado = i + l;  // ✅ i promovido para long
```

**int + float → float**:
```java
int i = 10;
float f = 20.5f;
float resultado = i + f;  // ✅ i promovido para float
```

**float + double → double**:
```java
float f = 10.5f;
double d = 20.7;
double resultado = f + d;  // ✅ f promovido para double
```

### 3. Expressões Mistas Complexas

**Exemplo**: Múltiplos tipos na mesma expressão.

```java
byte b = 10;
short s = 20;
int i = 30;
long l = 40L;
float f = 50.5f;
double d = 60.7;

double resultado = b + s + i + l + f + d;
// Promoções:
// b → int
// s → int
// b + s → int
// (b + s) + i → int
// ((b + s) + i) + l → long
// (((b + s) + i) + l) + f → float
// ((((b + s) + i) + l) + f) + d → double
```

### 4. Armadilha: Resultado de Operações

**Problema**: Resultado de operação entre `byte`/`short` é `int`.

```java
byte b1 = 10;
byte b2 = 20;
byte resultado = b1 + b2;  // ❌ ERRO: possible loss of precision
```

**Explicação**: `b1 + b2` resulta em `int`, não `byte`.

**Solução**: Casting explícito.
```java
byte resultado = (byte)(b1 + b2);  // ✅ OK
```

**Exceção**: Atribuições compostas (`+=`, `-=`, etc.) fazem cast automático.
```java
byte b = 10;
b += 20;  // ✅ OK (equivalente a: b = (byte)(b + 20))
```

---

## 🔍 Análise Conceitual Profunda

### Tabela de Promoção Binária

| Operando 1 | Operando 2 | Resultado da Promoção |
|------------|------------|-----------------------|
| byte       | byte       | int                   |
| byte       | short      | int                   |
| byte       | int        | int                   |
| byte       | long       | long                  |
| byte       | float      | float                 |
| byte       | double     | double                |
| short      | short      | int                   |
| short      | int        | int                   |
| short      | long       | long                  |
| short      | float      | float                 |
| short      | double     | double                |
| int        | int        | int                   |
| int        | long       | long                  |
| int        | float      | float                 |
| int        | double     | double                |
| long       | long       | long                  |
| long       | float      | float                 |
| long       | double     | double                |
| float      | float      | float                 |
| float      | double     | double                |
| double     | double     | double                |

### Operações Aritméticas e Promoção

**Adição** (`+`):
```java
byte b = 10;
short s = 20;
int resultado = b + s;  // byte, short → int
```

**Subtração** (`-`):
```java
int i = 100;
long l = 50L;
long resultado = i - l;  // int → long
```

**Multiplicação** (`*`):
```java
int i = 5;
float f = 2.5f;
float resultado = i * f;  // int → float
```

**Divisão** (`/`):
```java
int i = 10;
double d = 3.0;
double resultado = i / d;  // int → double (resultado: 3.333...)
```

**Módulo** (`%`):
```java
long l = 100L;
int i = 7;
long resultado = l % i;  // int → long
```

### Operações Bit a Bit e Promoção

**AND** (`&`):
```java
byte b1 = 0b1010;
byte b2 = 0b1100;
int resultado = b1 & b2;  // byte → int (resultado: 8 ou 0b1000)
```

**OR** (`|`):
```java
short s1 = 0b1010;
short s2 = 0b0101;
int resultado = s1 | s2;  // short → int (resultado: 15 ou 0b1111)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Operações com Tipos Pequenos

```java
public class OperacoesTiposPequenos {
    public void calcular() {
        byte b1 = 50;
        byte b2 = 70;
        
        // ❌ Erro: resultado é int
        // byte resultado = b1 + b2;
        
        // ✅ OK: Aceitar int
        int resultado = b1 + b2;
        
        // ✅ OK: Casting explícito
        byte resultadoByte = (byte)(b1 + b2);
        
        System.out.println(resultado);      // 120
        System.out.println(resultadoByte);  // 120
    }
}
```

### Caso 2: Atribuições Compostas (Exceção)

```java
public class AtribuicoesCompostas {
    public void exemplo() {
        byte b = 100;
        
        // ✅ OK: += faz cast automático
        b += 20;  // Equivalente a: b = (byte)(b + 20)
        
        // ❌ Erro sem +=
        // b = b + 20;  // ERRO: b + 20 é int
        
        System.out.println(b);  // 120
    }
}
```

### Caso 3: Expressões Mistas

```java
public class ExpressoesMistas {
    public double calcularMedia(int soma, int quantidade) {
        // Promoção: int → double
        return (double) soma / quantidade;  // Cast explícito
        
        // OU usar literal double
        // return soma / (double) quantidade;
    }
    
    public void exemplo() {
        int soma = 100;
        int quantidade = 3;
        
        // ❌ Divisão inteira
        int media1 = soma / quantidade;  // 33 (truncado)
        
        // ✅ Divisão com promoção
        double media2 = (double) soma / quantidade;  // 33.333...
        
        System.out.println(media1);  // 33
        System.out.println(media2);  // 33.333333333333336
    }
}
```

### Caso 4: Literais e Promoção

```java
public class LiteraisPromocao {
    public void exemplo() {
        byte b = 10;
        
        // ✅ Literal int, mas cabe em byte
        byte resultado1 = b + 5;  // ❌ ERRO: b + 5 é int
        
        // ✅ Casting explícito
        byte resultado2 = (byte)(b + 5);  // OK
        
        // ✅ Atribuição composta
        b += 5;  // OK (cast automático)
    }
}
```

### Caso 5: Comparações com Promoção

```java
public class ComparacoesPromocao {
    public void exemplo() {
        byte b = 10;
        int i = 20;
        
        // Promoção: byte → int para comparação
        if (b < i) {  // ✅ OK (b promovido para int)
            System.out.println("b é menor que i");
        }
        
        float f = 30.5f;
        
        // Promoção: int → float para comparação
        if (i < f) {  // ✅ OK (i promovido para float)
            System.out.println("i é menor que f");
        }
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Resultado de Operações é int (mínimo)

**Problema**: Operação entre tipos pequenos resulta em `int`.

```java
byte b1 = 10;
byte b2 = 20;
byte resultado = b1 + b2;  // ❌ ERRO: possible loss of precision
```

**Solução**: Aceitar `int` ou fazer casting.
```java
int resultado = b1 + b2;  // ✅ OK
// OU
byte resultado = (byte)(b1 + b2);  // ✅ OK
```

### 2. Divisão Inteira vs Ponto Flutuante

**Problema**: Divisão entre inteiros resulta em inteiro (truncado).

```java
int a = 5;
int b = 2;
double resultado = a / b;  // ⚠️ 2.0 (não 2.5!)
```

**Solução**: Promover para `double` antes da divisão.
```java
double resultado = (double) a / b;  // ✅ 2.5
// OU
double resultado = a / (double) b;  // ✅ 2.5
```

### 3. Overflow em Promoção

**Problema**: Overflow pode ocorrer antes da promoção.

```java
int i = Integer.MAX_VALUE;
int j = 1;
long resultado = i + j;  // ⚠️ Overflow (i + j é int antes de virar long)
```

**Solução**: Promover antes da operação.
```java
long resultado = (long) i + j;  // ✅ OK (i promovido para long antes de somar)
```

### 4. Perda de Precisão em float

**Problema**: Promoção `int`/`long` → `float` pode perder precisão.

```java
int i = 123456789;
float f = i;  // ⚠️ Promoção implícita, mas perde precisão
System.out.println(f);  // 1.23456792E8 (arredondado)
```

**Solução**: Usar `double` quando precisão é crítica.
```java
double d = i;  // ✅ Sem perda de precisão para int
```

### 5. char em Operações

**Problema**: `char` é promovido para `int`, não `short`.

```java
char c = 'A';
short s = 10;
int resultado = c + s;  // ✅ Ambos promovidos para int
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Conversão Implícita (Widening)**: Base para promoção
- **Tipos Primitivos**: Hierarquia de promoção
- **Operadores Aritméticos**: Contexto de promoção
- **Overflow**: Pode ocorrer antes da promoção
- **Casting**: Necessário para reverter resultado

---

## 🚀 Boas Práticas

1. ✅ **Use int para operações com byte/short/char**
   ```java
   byte b1 = 10, b2 = 20;
   int resultado = b1 + b2;  // ✅ Aceitar int
   ```

2. ✅ **Use atribuições compostas quando possível**
   ```java
   byte b = 10;
   b += 20;  // ✅ Cast automático
   ```

3. ✅ **Promova para double em divisões**
   ```java
   double media = (double) soma / quantidade;  // ✅ Precisão
   ```

4. ✅ **Evite overflow em promoção tardia**
   ```java
   long resultado = (long) intMax + 1;  // ✅ Promove antes
   ```

5. ✅ **Use long para operações que podem estourar int**
   ```java
   long milissegundos = dias * 24L * 60 * 60 * 1000;
   ```

6. ✅ **Documente conversões não óbvias**
   ```java
   // Promoção para double para evitar truncamento
   double media = (double) soma / quantidade;
   ```

7. ❌ **Evite depender de promoção implícita em código crítico**
   ```java
   // ❌ Confuso
   byte b = (byte)(b1 + b2);
   
   // ✅ Claro
   int temp = b1 + b2;
   byte b = (byte) temp;
   ```
