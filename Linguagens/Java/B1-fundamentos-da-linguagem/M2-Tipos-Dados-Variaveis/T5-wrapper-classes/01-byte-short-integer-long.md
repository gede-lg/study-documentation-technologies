# Wrapper Classes: Byte, Short, Integer, Long

## 🎯 Introdução e Definição

### Definição Conceitual

**Wrapper Classes** são classes que **encapsulam tipos primitivos** em objetos, permitindo que valores primitivos sejam tratados como objetos. As classes `Byte`, `Short`, `Integer` e `Long` são os wrappers dos tipos primitivos inteiros `byte`, `short`, `int` e `long`, respectivamente.

**Mapeamento Primitivo → Wrapper**:
```java
byte    → Byte
short   → Short
int     → Integer
long    → Long
```

**Por que existem?**
1. **Collections**: Não aceitam tipos primitivos (ex: `List<int>` é inválido)
2. **Generics**: Requerem tipos de referência
3. **Null**: Primitivos não podem ser `null`, wrappers podem
4. **Métodos Utilitários**: Parsing, conversão, constantes, etc.

**Exemplo**:
```java
// Primitivo
int primitivo = 10;

// Wrapper (objeto)
Integer wrapper = Integer.valueOf(10);

// Collections requerem wrappers
List<Integer> lista = new ArrayList<>();
lista.add(10);  // Autoboxing: int → Integer
```

### Características Fundamentais

**Wrapper Classes de Inteiros**:
- 📦 **Encapsulam primitivos** em objetos
- 🔒 **Imutáveis**: Valor não pode ser alterado após criação
- 🎯 **Final**: Classes não podem ser estendidas
- 📊 **Constantes**: MIN_VALUE, MAX_VALUE, SIZE, etc.
- 🔄 **Métodos utilitários**: parse, valueOf, toString, etc.
- 💾 **Cache**: Valores comuns são cacheados (-128 a 127)

### Hierarquia de Classes

```
java.lang.Object
    └── java.lang.Number (abstract)
            ├── Byte
            ├── Short
            ├── Integer
            └── Long
```

**Number**: Classe abstrata que define métodos de conversão (`byteValue()`, `shortValue()`, `intValue()`, `longValue()`, `floatValue()`, `doubleValue()`).

---

## 📋 Sumário Conceitual

### As Quatro Classes Wrapper de Inteiros

| Wrapper Class | Primitivo | Tamanho | Range (Min → Max)                          |
|---------------|-----------|---------|---------------------------------------------|
| Byte          | byte      | 8 bits  | -128 → 127                                  |
| Short         | short     | 16 bits | -32,768 → 32,767                            |
| Integer       | int       | 32 bits | -2,147,483,648 → 2,147,483,647              |
| Long          | long      | 64 bits | -9,223,372,036,854,775,808 → 9,223,372,036,854,775,807 |

### Formas de Criação

1. **valueOf()** (recomendado): Usa cache quando possível
2. **Construtor** (deprecated Java 9+): Sempre cria novo objeto
3. **Autoboxing**: Conversão automática primitivo → wrapper

---

## 🧠 Fundamentos Teóricos

### 1. Classe Byte

**Wrapper de byte** (8 bits, -128 a 127)

**Constantes**:
```java
Byte.MIN_VALUE    // -128
Byte.MAX_VALUE    // 127
Byte.SIZE         // 8 (bits)
Byte.BYTES        // 1 (bytes)
Byte.TYPE         // Representa o tipo primitivo byte (Class<Byte>)
```

**Criação**:
```java
// valueOf() - recomendado (usa cache)
Byte b1 = Byte.valueOf((byte) 10);
Byte b2 = Byte.valueOf("10");

// Construtor - deprecated (Java 9+)
@Deprecated
Byte b3 = new Byte((byte) 10);

// Autoboxing
Byte b4 = 10;  // Equivale a Byte.valueOf(10)
```

**Métodos principais**:
```java
// Parsing
byte b = Byte.parseByte("10");           // String → byte
byte b2 = Byte.parseByte("1010", 2);     // Base 2 (binário)

// Conversão
Byte obj = Byte.valueOf("10");
byte primitivo = obj.byteValue();        // Wrapper → primitivo

// Comparação
Byte b1 = 10;
Byte b2 = 20;
int resultado = b1.compareTo(b2);        // -1 (b1 < b2)
int resultado2 = Byte.compare(10, 20);   // Método estático

// String
String str = Byte.toString((byte) 10);   // "10"
String str2 = obj.toString();            // "10"

// Hash
int hash = obj.hashCode();               // Hash do valor
```

### 2. Classe Short

**Wrapper de short** (16 bits, -32,768 a 32,767)

**Constantes**:
```java
Short.MIN_VALUE    // -32768
Short.MAX_VALUE    // 32767
Short.SIZE         // 16 (bits)
Short.BYTES        // 2 (bytes)
Short.TYPE         // Representa o tipo primitivo short
```

**Criação**:
```java
// valueOf()
Short s1 = Short.valueOf((short) 100);
Short s2 = Short.valueOf("100");

// Autoboxing
Short s3 = 100;
```

**Métodos principais**:
```java
// Parsing
short s = Short.parseShort("100");
short s2 = Short.parseShort("1010", 2);  // Binário: 10

// Conversão
Short obj = Short.valueOf("100");
short primitivo = obj.shortValue();

// Comparação
Short s1 = 100;
Short s2 = 200;
int resultado = s1.compareTo(s2);        // -1
int resultado2 = Short.compare(100, 200); // -1

// Reverse bytes (útil em protocolos de rede)
short reversed = Short.reverseBytes((short) 0x1234);
// 0x1234 → 0x3412
```

### 3. Classe Integer

**Wrapper de int** (32 bits, -2³¹ a 2³¹-1)

**Constantes**:
```java
Integer.MIN_VALUE    // -2147483648
Integer.MAX_VALUE    // 2147483647
Integer.SIZE         // 32 (bits)
Integer.BYTES        // 4 (bytes)
Integer.TYPE         // Representa o tipo primitivo int
```

**Criação**:
```java
// valueOf() - recomendado
Integer i1 = Integer.valueOf(100);
Integer i2 = Integer.valueOf("100");
Integer i3 = Integer.valueOf("1010", 2);  // Base 2

// Autoboxing
Integer i4 = 100;

// Construtor - deprecated
@Deprecated
Integer i5 = new Integer(100);
```

**Métodos principais**:

**Parsing**:
```java
int i = Integer.parseInt("123");
int i2 = Integer.parseInt("FF", 16);      // Hexadecimal: 255
int i3 = Integer.parseInt("1010", 2);     // Binário: 10
int i4 = Integer.parseInt("77", 8);       // Octal: 63

// Unsigned parsing (Java 8+)
int unsigned = Integer.parseUnsignedInt("4000000000");
```

**Conversão**:
```java
Integer obj = Integer.valueOf(123);
int primitivo = obj.intValue();
long l = obj.longValue();
double d = obj.doubleValue();
```

**Comparação**:
```java
Integer a = 100;
Integer b = 200;

int resultado = a.compareTo(b);          // -1 (a < b)
int resultado2 = Integer.compare(100, 200); // -1

// Unsigned compare (Java 8+)
int unsigned = Integer.compareUnsigned(a, b);
```

**String e Bases**:
```java
String s1 = Integer.toString(123);       // "123"
String s2 = Integer.toString(255, 16);   // "ff" (hexadecimal)
String s3 = Integer.toString(10, 2);     // "1010" (binário)

String hex = Integer.toHexString(255);   // "ff"
String octal = Integer.toOctalString(63); // "77"
String binary = Integer.toBinaryString(10); // "1010"
```

**Operações Bit a Bit**:
```java
int bits = Integer.bitCount(15);         // 4 (quantidade de bits 1)
int highestBit = Integer.highestOneBit(10); // 8 (bit mais significativo)
int lowestBit = Integer.lowestOneBit(10);   // 2 (bit menos significativo)

int reversed = Integer.reverse(10);      // Inverte todos os bits
int reversedBytes = Integer.reverseBytes(0x12345678); // Inverte bytes

int leadingZeros = Integer.numberOfLeadingZeros(10);  // 28
int trailingZeros = Integer.numberOfTrailingZeros(10); // 1

int rotated = Integer.rotateLeft(10, 2);  // Rotaciona bits à esquerda
int rotated2 = Integer.rotateRight(10, 2); // Rotaciona bits à direita
```

**Sinais**:
```java
int sinal = Integer.signum(10);          // 1 (positivo)
int sinal2 = Integer.signum(-10);        // -1 (negativo)
int sinal3 = Integer.signum(0);          // 0
```

**Unsigned (Java 8+)**:
```java
String unsignedStr = Integer.toUnsignedString(value);
long unsignedLong = Integer.toUnsignedLong(value);

int divisao = Integer.divideUnsigned(a, b);
int resto = Integer.remainderUnsigned(a, b);
```

### 4. Classe Long

**Wrapper de long** (64 bits, -2⁶³ a 2⁶³-1)

**Constantes**:
```java
Long.MIN_VALUE    // -9223372036854775808
Long.MAX_VALUE    // 9223372036854775807
Long.SIZE         // 64 (bits)
Long.BYTES        // 8 (bytes)
Long.TYPE         // Representa o tipo primitivo long
```

**Criação**:
```java
// valueOf()
Long l1 = Long.valueOf(1000L);
Long l2 = Long.valueOf("1000");
Long l3 = Long.valueOf("FF", 16);

// Autoboxing
Long l4 = 1000L;
```

**Métodos principais** (similares a Integer):
```java
// Parsing
long l = Long.parseLong("123456789");
long l2 = Long.parseLong("FF", 16);
long unsigned = Long.parseUnsignedLong("10000000000000000000");

// Conversão
Long obj = Long.valueOf(123456789L);
long primitivo = obj.longValue();
int i = obj.intValue();  // ⚠️ Pode causar overflow

// Comparação
Long a = 1000L;
Long b = 2000L;
int resultado = a.compareTo(b);          // -1
int resultado2 = Long.compare(1000L, 2000L); // -1

// String
String str = Long.toString(123456789L);
String hex = Long.toHexString(255L);     // "ff"
String binary = Long.toBinaryString(10L); // "1010"

// Operações bit a bit (similares a Integer)
int bits = Long.bitCount(15L);
long highestBit = Long.highestOneBit(10L);
long reversed = Long.reverse(10L);
```

---

## 🔍 Análise Conceitual Profunda

### Tabela Comparativa Completa

| Característica        | Byte          | Short         | Integer       | Long          |
|-----------------------|---------------|---------------|---------------|---------------|
| **Primitivo**         | byte          | short         | int           | long          |
| **Tamanho (bits)**    | 8             | 16            | 32            | 64            |
| **Tamanho (bytes)**   | 1             | 2             | 4             | 8             |
| **MIN_VALUE**         | -128          | -32,768       | -2,147,483,648| -2⁶³          |
| **MAX_VALUE**         | 127           | 32,767        | 2,147,483,647 | 2⁶³-1         |
| **Cache padrão**      | -128 a 127    | -128 a 127    | -128 a 127    | -128 a 127    |
| **Uso comum**         | Dados binários| Otimização    | Padrão inteiro| Timestamps, IDs|
| **Sufixo literal**    | (cast)        | (cast)        | (nenhum)      | L             |

### Herança de Number

Todos herdam de `java.lang.Number`, que define métodos de conversão:

```java
public abstract class Number {
    public abstract byte byteValue();
    public abstract short shortValue();
    public abstract int intValue();
    public abstract long longValue();
    public abstract float floatValue();
    public abstract double doubleValue();
}
```

**Exemplo**:
```java
Integer i = 100;

byte b = i.byteValue();      // 100
short s = i.shortValue();    // 100
int primitivo = i.intValue(); // 100
long l = i.longValue();      // 100L
float f = i.floatValue();    // 100.0f
double d = i.doubleValue();  // 100.0
```

### Cache de Valores

**Todas as classes wrapper de inteiros** cacheiam valores no range **-128 a 127** por padrão.

```java
// Valores no cache (-128 a 127)
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // ✅ true (mesmo objeto)

// Valores fora do cache
Integer c = 200;
Integer d = 200;
System.out.println(c == d);  // ❌ false (objetos diferentes)

// ✅ SEMPRE use equals() para comparar valores
System.out.println(c.equals(d));  // true
```

**Por que existe o cache?**
- **Performance**: Valores pequenos são usados frequentemente
- **Memória**: Evita criar múltiplos objetos para o mesmo valor
- **Flyweight Pattern**: Reutilização de objetos imutáveis

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Uso em Collections

```java
import java.util.*;

public class WrapperCollections {
    public void exemplo() {
        // ❌ Impossível usar primitivo
        // List<int> lista = new ArrayList<>();
        
        // ✅ Wrapper em Collection
        List<Integer> numeros = new ArrayList<>();
        numeros.add(10);   // Autoboxing
        numeros.add(20);
        numeros.add(30);
        
        // Unboxing ao obter
        int primeiro = numeros.get(0);  // 10
        
        // Soma com streams (Java 8+)
        int soma = numeros.stream()
                          .mapToInt(Integer::intValue)
                          .sum();  // 60
    }
}
```

### Caso 2: Valores Null (Tri-state)

```java
public class ValoresNull {
    // Primitivo: não pode ser null (binary state: tem valor ou 0)
    private int idade;  // Valor padrão: 0
    
    // Wrapper: pode ser null (tri-state: tem valor, é 0, ou é null)
    private Integer idadeWrapper;  // Valor padrão: null
    
    public void exemplo() {
        // Primitivo: 0 pode significar "não definido" ou "zero"
        if (idade == 0) {
            // Ambíguo: é realmente zero ou não foi definido?
        }
        
        // Wrapper: null = não definido, 0 = zero
        if (idadeWrapper == null) {
            System.out.println("Idade não definida");
        } else if (idadeWrapper == 0) {
            System.out.println("Idade é zero");
        }
    }
}
```

### Caso 3: Parsing e Validação

```java
public class ParsingWrapper {
    public Integer parseIntSafe(String str) {
        try {
            return Integer.valueOf(str);  // Retorna Wrapper
        } catch (NumberFormatException e) {
            return null;  // ✅ Wrapper pode ser null
        }
    }
    
    public void exemplo() {
        Integer valor = parseIntSafe("123");
        if (valor != null) {
            int i = valor;  // Unboxing seguro
            System.out.println("Valor: " + i);
        } else {
            System.out.println("Parsing falhou");
        }
    }
}
```

### Caso 4: Constantes e Limites

```java
public class ConstantesWrapper {
    public void exemplo() {
        System.out.println("byte: " + Byte.MIN_VALUE + " a " + Byte.MAX_VALUE);
        System.out.println("short: " + Short.MIN_VALUE + " a " + Short.MAX_VALUE);
        System.out.println("int: " + Integer.MIN_VALUE + " a " + Integer.MAX_VALUE);
        System.out.println("long: " + Long.MIN_VALUE + " a " + Long.MAX_VALUE);
        
        // Validação de range
        int valor = 200;
        if (valor >= Byte.MIN_VALUE && valor <= Byte.MAX_VALUE) {
            byte b = (byte) valor;
        } else {
            System.out.println("Valor não cabe em byte");
        }
    }
}
```

### Caso 5: Conversão entre Bases

```java
public class ConversaoBases {
    public void exemplo() {
        // Decimal → outras bases
        int decimal = 255;
        String binario = Integer.toBinaryString(decimal);   // "11111111"
        String octal = Integer.toOctalString(decimal);      // "377"
        String hexa = Integer.toHexString(decimal);         // "ff"
        
        System.out.println("Decimal: " + decimal);
        System.out.println("Binário: " + binario);
        System.out.println("Octal: " + octal);
        System.out.println("Hexadecimal: " + hexa);
        
        // Outras bases → decimal
        int fromBinary = Integer.parseInt("11111111", 2);   // 255
        int fromOctal = Integer.parseInt("377", 8);         // 255
        int fromHexa = Integer.parseInt("FF", 16);          // 255
    }
}
```

### Caso 6: Operações Bit a Bit

```java
public class OperacoesBits {
    public void exemplo() {
        int valor = 10;  // 1010 em binário
        
        System.out.println("Valor: " + valor);
        System.out.println("Binário: " + Integer.toBinaryString(valor));
        System.out.println("Quantidade de bits 1: " + Integer.bitCount(valor));  // 2
        System.out.println("Bit mais significativo: " + Integer.highestOneBit(valor));  // 8
        System.out.println("Bit menos significativo: " + Integer.lowestOneBit(valor));  // 2
        System.out.println("Leading zeros: " + Integer.numberOfLeadingZeros(valor));    // 28
        System.out.println("Trailing zeros: " + Integer.numberOfTrailingZeros(valor));  // 1
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. NullPointerException em Unboxing

**Problema**: Unboxing de wrapper `null` causa NPE.

```java
Integer obj = null;
int i = obj;  // ❌ NullPointerException
```

**Solução**: Verificar null antes.
```java
if (obj != null) {
    int i = obj;
}
```

### 2. Comparação com == vs equals()

**Problema**: `==` compara referências, não valores.

```java
Integer a = 200;
Integer b = 200;
System.out.println(a == b);  // ❌ false (objetos diferentes)
```

**Solução**: Usar `equals()`.
```java
System.out.println(a.equals(b));  // ✅ true
```

### 3. Cache Pode Causar Confusão

**Problema**: Comportamento diferente dentro/fora do cache.

```java
Integer a = 127;
Integer b = 127;
System.out.println(a == b);  // true (cache)

Integer c = 128;
Integer d = 128;
System.out.println(c == d);  // false (não cache)
```

**Solução**: **NUNCA** use `==` para comparar wrappers.

### 4. Performance em Loops

**Problema**: Autoboxing em loops cria objetos desnecessários.

```java
// ❌ Lento (cria 1 milhão de objetos)
Integer soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}

// ✅ Rápido (primitivos)
int soma = 0;
for (int i = 0; i < 1_000_000; i++) {
    soma += i;
}
```

### 5. Overflow em Conversões

**Problema**: Conversão entre wrappers pode causar overflow.

```java
Long grande = Long.MAX_VALUE;
Integer overflow = grande.intValue();  // ⚠️ Overflow silencioso
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Tipos Primitivos**: Base dos wrappers
- **Autoboxing/Unboxing**: Conversão automática
- **Collections**: Requerem wrappers
- **Generics**: Trabalham com tipos de referência
- **Imutabilidade**: Wrappers são imutáveis
- **Cache**: Otimização de memória

---

## 🚀 Boas Práticas

1. ✅ **Prefira primitivos quando possível**
   ```java
   int i = 10;  // ✅ Mais eficiente
   ```

2. ✅ **Use wrappers em Collections e Generics**
   ```java
   List<Integer> lista = new ArrayList<>();
   ```

3. ✅ **SEMPRE use equals() para comparar wrappers**
   ```java
   Integer a = 200;
   Integer b = 200;
   System.out.println(a.equals(b));  // ✅ true
   ```

4. ✅ **Verifique null antes de unboxing**
   ```java
   Integer obj = mapa.get("chave");
   if (obj != null) {
       int i = obj;
   }
   ```

5. ✅ **Use valueOf() em vez de construtor**
   ```java
   Integer i = Integer.valueOf(10);  // ✅ Usa cache
   ```

6. ⚠️ **Evite autoboxing em loops críticos**
   ```java
   int soma = 0;  // ✅ Primitivo em loop
   for (int i = 0; i < 1_000_000; i++) {
       soma += i;
   }
   ```

7. ✅ **Use wrappers quando null é significativo**
   ```java
   Integer idade = null;  // "Não definido"
   ```

8. ✅ **Use constantes para limites**
   ```java
   if (valor >= Integer.MIN_VALUE && valor <= Integer.MAX_VALUE) {
       // ...
   }
   ```
