# Métodos Úteis das Wrapper Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Wrapper Classes** fornecem uma rica API de **métodos utilitários** para manipulação, conversão, comparação e formatação de valores. Esses métodos eliminam a necessidade de código repetitivo e oferecem funcionalidades que tipos primitivos não possuem.

**Categorias principais**:
1. **Parsing**: Converter strings em valores
2. **Conversão**: Transformar entre tipos
3. **Comparação**: Ordenar e comparar valores
4. **Formatação**: Converter valores em strings formatadas
5. **Verificação**: Testar propriedades (NaN, infinito, etc.)
6. **Operações bit-a-bit**: Manipulação binária
7. **Matemática**: Operações matemáticas

**Exemplo**:
```java
// Parsing
int numero = Integer.parseInt("123");

// Conversão
String hex = Integer.toHexString(255);  // "ff"

// Comparação
int resultado = Integer.compare(10, 20);  // -1

// Verificação
boolean infinito = Double.isInfinite(1.0 / 0.0);  // true
```

### Características Fundamentais

- 🎯 **Estáticos e de instância**: Métodos úteis em ambas formas
- 🔄 **Conversões**: Entre tipos, bases numéricas, strings
- 📊 **Comparações**: Null-safe e otimizadas
- 🛠️ **Utilitários**: Funções matemáticas e de formatação
- ⚠️ **Tratamento de erros**: NumberFormatException em parsing
- 🎭 **Valores especiais**: Infinito, NaN, MIN/MAX

---

## 📋 Sumário Conceitual

### Categorias de Métodos

**Parsing e Conversão**:
- `parseInt()`, `parseDouble()`, `parseBoolean()`, etc.
- `valueOf()`: String ou primitivo → Wrapper
- `toString()`: Wrapper → String
- `toBinaryString()`, `toHexString()`, `toOctalString()`

**Comparação**:
- `compareTo()`: Comparação de instância
- `compare()`: Comparação estática
- `equals()`: Igualdade de valor
- `max()`, `min()`: Maior/menor valor

**Conversão entre tipos**:
- `byteValue()`, `shortValue()`, `intValue()`, etc.
- `doubleValue()`, `floatValue()`

**Verificação**:
- `isInfinite()`, `isFinite()`, `isNaN()` (Float/Double)
- `isDigit()`, `isLetter()`, `isWhitespace()` (Character)

**Operações bit-a-bit** (Integer/Long):
- `bitCount()`, `highestOneBit()`, `lowestOneBit()`
- `reverse()`, `rotateLeft()`, `rotateRight()`

---

## 🧠 Fundamentos Teóricos

### 1. Parsing: String → Primitivo

**parseInt()**, **parseLong()**, **parseDouble()**, etc.

```java
// Inteiros
int i1 = Integer.parseInt("123");       // 123
int i2 = Integer.parseInt("FF", 16);    // 255 (hexadecimal)
int i3 = Integer.parseInt("1010", 2);   // 10 (binário)
int i4 = Integer.parseInt("-456");      // -456

// Long
long l1 = Long.parseLong("9999999999"); // 9999999999L

// Double
double d1 = Double.parseDouble("3.14");    // 3.14
double d2 = Double.parseDouble("1.5e10");  // 15000000000.0 (notação científica)
double d3 = Double.parseDouble("Infinity");// Infinity
double d4 = Double.parseDouble("NaN");     // NaN

// Float
float f1 = Float.parseFloat("2.5");  // 2.5f

// Boolean
boolean b1 = Boolean.parseBoolean("true");  // true
boolean b2 = Boolean.parseBoolean("TRUE");  // true (case-insensitive)
boolean b3 = Boolean.parseBoolean("yes");   // false ⚠️ (só "true" retorna true)
```

**Exceção**: `NumberFormatException` se string inválida.
```java
try {
    int num = Integer.parseInt("abc");  // ❌ NumberFormatException
} catch (NumberFormatException e) {
    System.err.println("Número inválido!");
}
```

### 2. valueOf(): String/Primitivo → Wrapper

**valueOf()** retorna **wrapper** (usa cache quando aplicável).

```java
// Primitivo → Wrapper
Integer i1 = Integer.valueOf(10);    // Integer (cache)
Long l1 = Long.valueOf(100L);        // Long (cache)
Double d1 = Double.valueOf(3.14);    // Double (sem cache)

// String → Wrapper
Integer i2 = Integer.valueOf("123");      // 123
Integer i3 = Integer.valueOf("FF", 16);   // 255 (hexadecimal)
Boolean b1 = Boolean.valueOf("true");     // Boolean.TRUE (cache)
Double d2 = Double.valueOf("2.5");        // 2.5

// Cache
Integer a = Integer.valueOf(100);
Integer b = Integer.valueOf(100);
System.out.println(a == b);  // true (cache -128 a 127)

Integer c = Integer.valueOf(200);
Integer d = Integer.valueOf(200);
System.out.println(c == d);  // false (fora do cache)
```

### 3. toString(): Wrapper/Primitivo → String

**toString()** converte valor em string.

```java
// Método de instância
Integer num = 123;
String str1 = num.toString();  // "123"

// Método estático
String str2 = Integer.toString(456);      // "456"
String str3 = Integer.toString(255, 16);  // "ff" (hexadecimal)
String str4 = Integer.toString(10, 2);    // "1010" (binário)

// Outros tipos
String str5 = Double.toString(3.14);      // "3.14"
String str6 = Boolean.toString(true);     // "true"
String str7 = Character.toString('A');    // "A"
```

### 4. Conversões de Base Numérica (Integer/Long)

**toBinaryString()**, **toHexString()**, **toOctalString()**.

```java
int num = 255;

// Conversões
String bin = Integer.toBinaryString(num);  // "11111111"
String hex = Integer.toHexString(num);     // "ff"
String oct = Integer.toOctalString(num);   // "377"

System.out.println("255 em binário: " + bin);
System.out.println("255 em hexadecimal: " + hex);
System.out.println("255 em octal: " + oct);

// Negativos (representação em complemento de 2)
int negativo = -1;
String binNeg = Integer.toBinaryString(negativo);
System.out.println(binNeg);  // "11111111111111111111111111111111" (32 bits)
```

### 5. Comparação: compareTo() e compare()

**compareTo()** (método de instância):
```java
Integer a = 10;
Integer b = 20;
Integer c = 10;

System.out.println(a.compareTo(b));  // -1 (a < b)
System.out.println(b.compareTo(a));  // 1 (b > a)
System.out.println(a.compareTo(c));  // 0 (a == c)

// Ordenação
List<Integer> numeros = Arrays.asList(30, 10, 20);
Collections.sort(numeros);  // Usa compareTo()
System.out.println(numeros);  // [10, 20, 30]
```

**compare()** (método estático):
```java
int resultado1 = Integer.compare(10, 20);  // -1
int resultado2 = Integer.compare(20, 10);  // 1
int resultado3 = Integer.compare(15, 15);  // 0

// Útil em lambdas
List<Integer> numeros = Arrays.asList(30, 10, 20);
numeros.sort(Integer::compare);  // Ordenação crescente
System.out.println(numeros);  // [10, 20, 30]
```

### 6. max() e min()

**max()** e **min()** (Java 8+):
```java
int maior = Integer.max(10, 20);   // 20
int menor = Integer.min(10, 20);   // 10

long maiorL = Long.max(100L, 200L);      // 200L
double maiorD = Double.max(3.14, 2.71);  // 3.14

// Uso em streams
List<Integer> numeros = Arrays.asList(30, 10, 20);
int max = numeros.stream()
                 .max(Integer::compare)
                 .orElse(0);
System.out.println("Máximo: " + max);  // 30
```

### 7. sum() (Java 8+)

**sum()** soma dois valores:
```java
int soma = Integer.sum(10, 20);      // 30
long somaL = Long.sum(100L, 200L);   // 300L
double somaD = Double.sum(1.5, 2.5); // 4.0
```

### 8. Conversão entre Tipos: xxxValue()

**byteValue()**, **shortValue()**, **intValue()**, etc.

```java
Integer num = 1000;

byte b = num.byteValue();      // -24 (overflow! 1000 % 256 = 232, signed = -24)
short s = num.shortValue();    // 1000
int i = num.intValue();        // 1000
long l = num.longValue();      // 1000L
float f = num.floatValue();    // 1000.0f
double d = num.doubleValue();  // 1000.0

// Verificar overflow
if (num > Byte.MAX_VALUE || num < Byte.MIN_VALUE) {
    System.out.println("Overflow ao converter para byte!");
}
```

### 9. Verificação de Valores Especiais (Float/Double)

**isInfinite()**, **isFinite()**, **isNaN()**.

```java
double infinito = Double.POSITIVE_INFINITY;
double naoNumero = Double.NaN;
double normal = 3.14;

// isInfinite()
System.out.println(Double.isInfinite(infinito));  // true
System.out.println(Double.isInfinite(normal));    // false

// isFinite() (Java 8+)
System.out.println(Double.isFinite(normal));      // true
System.out.println(Double.isFinite(infinito));    // false
System.out.println(Double.isFinite(naoNumero));   // false

// isNaN()
System.out.println(Double.isNaN(naoNumero));      // true
System.out.println(Double.isNaN(normal));         // false

// NaN é especial
System.out.println(naoNumero == naoNumero);       // false ⚠️
System.out.println(Double.isNaN(naoNumero));      // true ✅
```

### 10. Operações Bit-a-Bit (Integer/Long)

**bitCount()**: Conta bits '1'.
```java
int num = 7;  // 0111 em binário
int bits = Integer.bitCount(num);  // 3
```

**highestOneBit()**: Bit '1' mais significativo.
```java
int num = 10;  // 1010 em binário
int highest = Integer.highestOneBit(num);  // 8 (1000)
```

**lowestOneBit()**: Bit '1' menos significativo.
```java
int num = 10;  // 1010 em binário
int lowest = Integer.lowestOneBit(num);  // 2 (0010)
```

**reverse()**: Inverte ordem dos bits.
```java
int num = 1;  // 00000000000000000000000000000001
int reversed = Integer.reverse(num);
System.out.println(Integer.toBinaryString(reversed));
// 10000000000000000000000000000000
```

**rotateLeft()**, **rotateRight()**: Rotação de bits.
```java
int num = 1;  // 00000001
int rotated = Integer.rotateLeft(num, 2);  // 00000100 (4)
```

### 11. Classificação de Caracteres (Character)

**isLetter()**, **isDigit()**, **isWhitespace()**, etc.

```java
char letra = 'A';
char digito = '5';
char espaco = ' ';

System.out.println(Character.isLetter(letra));      // true
System.out.println(Character.isDigit(digito));      // true
System.out.println(Character.isWhitespace(espaco)); // true

System.out.println(Character.isUpperCase('A'));     // true
System.out.println(Character.isLowerCase('a'));     // true

// Conversão de caso
char upper = Character.toUpperCase('a');  // 'A'
char lower = Character.toLowerCase('A');  // 'a'
```

### 12. hashCode()

**hashCode()** gera código hash para uso em hash tables.

```java
Integer num1 = 100;
Integer num2 = 100;

int hash1 = num1.hashCode();  // 100 (para Integer, hashCode = valor)
int hash2 = num2.hashCode();  // 100

System.out.println(hash1 == hash2);  // true

// Método estático (Java 8+)
int hash3 = Integer.hashCode(100);  // 100
```

---

## 🔍 Análise Conceitual Profunda

### Parsing com Bases Numéricas

**Integer.parseInt()** e **Long.parseLong()** aceitam bases de 2 a 36.

```java
// Base 2 (binário)
int bin = Integer.parseInt("1010", 2);  // 10

// Base 8 (octal)
int oct = Integer.parseInt("17", 8);    // 15

// Base 10 (decimal)
int dec = Integer.parseInt("100", 10);  // 100

// Base 16 (hexadecimal)
int hex = Integer.parseInt("FF", 16);   // 255

// Base 36 (máximo: 0-9, A-Z)
int b36 = Integer.parseInt("ZZ", 36);   // 1295
```

### Cache e valueOf()

**valueOf()** usa **cache** (Integer: -128 a 127).

```java
// Cache
Integer a = Integer.valueOf(100);
Integer b = Integer.valueOf(100);
System.out.println(a == b);  // true (mesmo objeto)

// Fora do cache
Integer c = Integer.valueOf(200);
Integer d = Integer.valueOf(200);
System.out.println(c == d);  // false (objetos diferentes)

// Sempre use equals()
System.out.println(c.equals(d));  // true ✅
```

### Comparação Null-Safe

**compare()** é null-safe quando usado com Collections.

```java
List<Integer> numeros = Arrays.asList(30, null, 10, 20);

// ❌ compareTo() falha com null
// numeros.sort(Integer::compareTo);  // NullPointerException

// ✅ Comparator.nullsFirst/nullsLast
numeros.sort(Comparator.nullsFirst(Integer::compare));
System.out.println(numeros);  // [null, 10, 20, 30]
```

### Conversão Sem Perda vs Com Perda

**Sem perda** (widening):
```java
Integer num = 100;
long l = num.longValue();    // ✅ Sem perda
double d = num.doubleValue();// ✅ Sem perda
```

**Com perda** (narrowing):
```java
Integer num = 1000;
byte b = num.byteValue();  // ⚠️ Overflow! -24
short s = num.shortValue();// ✅ Sem perda (1000 cabe em short)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação e Parsing de Entrada

```java
public class ValidadorNumero {
    public Integer parseNumero(String input) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        
        try {
            return Integer.valueOf(input.trim());
        } catch (NumberFormatException e) {
            System.err.println("Número inválido: " + input);
            return null;
        }
    }
    
    public void exemplo() {
        System.out.println(parseNumero("123"));   // 123
        System.out.println(parseNumero("  45 ")); // 45
        System.out.println(parseNumero("abc"));   // null
        System.out.println(parseNumero(null));    // null
    }
}
```

### Caso 2: Conversão de Bases Numéricas

```java
public class ConversaoBases {
    public void mostrarConversoes(int numero) {
        System.out.println("Decimal: " + numero);
        System.out.println("Binário: " + Integer.toBinaryString(numero));
        System.out.println("Hexadecimal: " + Integer.toHexString(numero));
        System.out.println("Octal: " + Integer.toOctalString(numero));
    }
    
    public void exemplo() {
        mostrarConversoes(255);
        // Decimal: 255
        // Binário: 11111111
        // Hexadecimal: ff
        // Octal: 377
    }
}
```

### Caso 3: Comparação e Ordenação

```java
import java.util.*;

public class OrdenacaoNumeros {
    public void exemplo() {
        List<Integer> numeros = Arrays.asList(30, 10, 50, 20, 40);
        
        // Ordenação crescente
        numeros.sort(Integer::compare);
        System.out.println("Crescente: " + numeros);  // [10, 20, 30, 40, 50]
        
        // Ordenação decrescente
        numeros.sort((a, b) -> Integer.compare(b, a));
        System.out.println("Decrescente: " + numeros);  // [50, 40, 30, 20, 10]
        
        // Máximo e mínimo
        int max = Collections.max(numeros);  // 50
        int min = Collections.min(numeros);  // 10
        System.out.println("Max: " + max + ", Min: " + min);
    }
}
```

### Caso 4: Verificação de Valores Especiais

```java
public class VerificadorValores {
    public void processar(double valor) {
        if (Double.isNaN(valor)) {
            System.out.println("Não é um número (NaN)");
        } else if (Double.isInfinite(valor)) {
            System.out.println("Infinito");
        } else if (Double.isFinite(valor)) {
            System.out.println("Número finito: " + valor);
        }
    }
    
    public void exemplo() {
        processar(3.14);                    // Número finito: 3.14
        processar(Double.POSITIVE_INFINITY);// Infinito
        processar(Double.NaN);              // Não é um número (NaN)
        processar(0.0 / 0.0);               // Não é um número (NaN)
    }
}
```

### Caso 5: Manipulação de Bits

```java
public class ManipuladorBits {
    public void analisarBits(int numero) {
        System.out.println("Número: " + numero);
        System.out.println("Binário: " + Integer.toBinaryString(numero));
        System.out.println("Bits '1': " + Integer.bitCount(numero));
        System.out.println("Bit mais alto: " + Integer.highestOneBit(numero));
        System.out.println("Bit mais baixo: " + Integer.lowestOneBit(numero));
    }
    
    public void exemplo() {
        analisarBits(10);
        // Número: 10
        // Binário: 1010
        // Bits '1': 2
        // Bit mais alto: 8
        // Bit mais baixo: 2
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. NumberFormatException em Parsing

**Problema**: Strings inválidas lançam exception.
```java
int num = Integer.parseInt("abc");  // ❌ NumberFormatException
```

**Solução**: Try-catch ou pré-validação.
```java
try {
    int num = Integer.parseInt(input);
} catch (NumberFormatException e) {
    System.err.println("Inválido!");
}
```

### 2. Overflow em xxxValue()

**Problema**: Conversão com perda de dados.
```java
Integer num = 1000;
byte b = num.byteValue();  // -24 ⚠️ (overflow)
```

**Solução**: Verificar limites.
```java
if (num >= Byte.MIN_VALUE && num <= Byte.MAX_VALUE) {
    byte b = num.byteValue();
}
```

### 3. NaN Comparação

**Problema**: `NaN != NaN`.
```java
double nan = Double.NaN;
System.out.println(nan == nan);  // false ⚠️
```

**Solução**: Use `isNaN()`.
```java
System.out.println(Double.isNaN(nan));  // true ✅
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Parsing**: Conversão String → Primitivo/Wrapper
- **Autoboxing/Unboxing**: Conversão automática
- **Cache**: valueOf() usa cache
- **Comparação**: compareTo(), compare(), equals()
- **Valores Especiais**: Infinito, NaN

---

## 🚀 Boas Práticas

1. ✅ **Use valueOf() ao invés de construtor**
   ```java
   Integer num = Integer.valueOf(10);  // ✅ Cache
   ```

2. ✅ **Trate NumberFormatException em parsing**
   ```java
   try {
       int num = Integer.parseInt(input);
   } catch (NumberFormatException e) {
       // Tratar erro
   }
   ```

3. ✅ **Verifique limites antes de narrowing**
   ```java
   if (num >= Byte.MIN_VALUE && num <= Byte.MAX_VALUE) {
       byte b = num.byteValue();
   }
   ```

4. ✅ **Use isNaN() para verificar NaN**
   ```java
   if (Double.isNaN(valor)) { /* ... */ }
   ```

5. ✅ **Prefira compare() em lambdas**
   ```java
   list.sort(Integer::compare);
   ```

6. ✅ **Use equals() para comparar wrappers**
   ```java
   if (num1.equals(num2)) { /* ... */ }
   ```

7. ✅ **Aproveite métodos estáticos de conversão**
   ```java
   String hex = Integer.toHexString(255);
   ```
