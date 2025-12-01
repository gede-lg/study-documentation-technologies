# Riscos de Perda de Dados em Narrowing

## 🎯 Introdução e Definição

### Definição Conceitual

**Perda de dados em narrowing** refere-se à **degradação ou alteração de informação** que ocorre quando um valor de um tipo de dado **maior** é convertido para um tipo **menor**, resultando em:
- **Overflow**: Valor excede capacidade do tipo destino
- **Truncamento**: Parte fracionária descartada
- **Perda de Precisão**: Arredondamento em ponto flutuante
- **Mudança de Sinal**: Overflow pode inverter sinal

**Exemplo Crítico**:
```java
int valor = 130;
byte resultado = (byte) valor;  // ⚠️ resultado = -126 (overflow!)
```

### Características Fundamentais

**Narrowing Conversions**:
- ⚠️ **Unsafe**: Podem perder informação
- 🔄 **Explícitas**: Requerem casting `(tipo)`
- 📉 **Imprevisíveis**: Resultado pode surpreender
- 🔍 **Validáveis**: Podem ser verificadas antes
- 🚨 **Silenciosas**: Sem exception/warning automático

### Contexto Histórico

**Java**: Diferente de linguagens como C, Java **exige casting explícito** para conversões narrowing, aumentando a **consciência do programador** sobre riscos potenciais.

**Design Philosophy**:
- **Segurança**: Evitar perda de dados acidental
- **Explicitação**: Programador assume responsabilidade
- **Previsibilidade**: Regras claras de conversão

---

## 📋 Sumário Conceitual

### Tipos de Perda de Dados

1. **Overflow**: Valor não cabe no tipo destino
2. **Truncamento**: Descarte de parte fracionária
3. **Perda de Precisão**: Arredondamento em floats
4. **Mudança de Sinal**: Overflow em tipos com sinal

### Hierarquia de Risco

```
double → float → long → int → short → byte
                            → char
```

Quanto maior a distância, maior o risco de perda.

---

## 🧠 Fundamentos Teóricos

### 1. Overflow em Tipos Inteiros

**Conceito**: Valor excede o **range** do tipo destino.

**Exemplo - int → byte**:
```java
int valor = 130;  // Range do byte: -128 a 127
byte resultado = (byte) valor;
System.out.println(resultado);  // -126 (overflow!)
```

**Por quê -126?**
- `130` em binário (32 bits): `0000 0000 0000 0000 0000 0000 1000 0010`
- Truncado para 8 bits: `1000 0010`
- Interpretado como byte (complemento de 2): `-126`

**Cálculo**:
```
130 - 256 = -126
```

**Regra Geral**:
Se `valor > max` ou `valor < min`:
```
resultado = valor % range
```

Onde `range = max - min + 1`.

**Exemplos**:

**byte** (range: -128 a 127, total: 256):
```java
int v1 = 128;
byte r1 = (byte) v1;  // -128

int v2 = 255;
byte r2 = (byte) v2;  // -1

int v3 = 256;
byte r3 = (byte) v3;  // 0
```

**short** (range: -32768 a 32767, total: 65536):
```java
int v1 = 32768;
short r1 = (short) v1;  // -32768

int v2 = 40000;
short r2 = (short) v2;  // -25536
```

### 2. Truncamento de Parte Fracionária

**Conceito**: Conversão de ponto flutuante para inteiro **descarta** a parte decimal.

**Exemplo - double → int**:
```java
double d1 = 123.456;
int i1 = (int) d1;  // 123 (parte .456 descartada)

double d2 = 123.999;
int i2 = (int) d2;  // 123 (não arredonda!)
```

**Importante**: Truncamento **não é arredondamento**!

**Valores Negativos**:
```java
double d3 = -123.456;
int i3 = (int) d3;  // -123 (trunca em direção a zero)
```

**Arredondamento Correto**:
```java
double d = 123.789;

// Truncamento
int t = (int) d;  // 123

// Arredondamento
int a = (int) Math.round(d);  // 124

// Arredondamento manual
int m = (int) (d + 0.5);  // 124 (para positivos)
```

### 3. Perda de Precisão em Ponto Flutuante

**Conceito**: `float` tem **menos bits de precisão** que `double`.

**double → float**:
```java
double d = 123.456789012345;
float f = (float) d;  // ⚠️ Precisão reduzida
System.out.println(f);  // 123.45679 (arredondado)
```

**Exemplo Crítico**:
```java
double d = 0.1234567890123456789;
float f = (float) d;
System.out.println(d);  // 0.1234567890123456789
System.out.println(f);  // 0.12345679 (apenas 7-8 dígitos)
```

**long/int → float**:
```java
long l = 123456789012345L;
float f = (float) l;  // ⚠️ Perda de precisão
System.out.println(l);  // 123456789012345
System.out.println(f);  // 1.23456788E14 (arredondado)
```

**Razão**: `float` tem **24 bits de mantissa** (≈7 dígitos decimais).

### 4. Mudança de Sinal por Overflow

**Conceito**: Overflow pode **inverter o sinal** do valor.

**Exemplo - int → byte**:
```java
int positivo = 128;
byte resultado = (byte) positivo;
System.out.println(resultado);  // -128 (positivo → negativo!)
```

**Visualização**:
```
128 (int):  0000 0000 ... 1000 0000
↓ trunca para 8 bits
1000 0000 (byte): -128 (bit de sinal = 1)
```

**Exemplo - long → int**:
```java
long positivo = 2147483648L;  // Integer.MAX_VALUE + 1
int resultado = (int) positivo;
System.out.println(resultado);  // -2147483648 (Integer.MIN_VALUE)
```

### 5. Valores Especiais (float/double)

**Conversão de Infinity e NaN**:

```java
double dInf = Double.POSITIVE_INFINITY;
float fInf = (float) dInf;  // Float.POSITIVE_INFINITY

double dNaN = Double.NaN;
float fNaN = (float) dNaN;  // Float.NaN
```

**Conversão para inteiros**:
```java
double dInf = Double.POSITIVE_INFINITY;
int iInf = (int) dInf;  // Integer.MAX_VALUE

double dNInf = Double.NEGATIVE_INFINITY;
int iNInf = (int) dNInf;  // Integer.MIN_VALUE

double dNaN = Double.NaN;
int iNaN = (int) dNaN;  // 0
```

---

## 🔍 Análise Conceitual Profunda

### Tabela de Riscos por Conversão

| De       | Para  | Risco Principal             | Exemplo                           |
|----------|-------|-----------------------------|-----------------------------------|
| int      | byte  | Overflow (valor > 127)      | `130 → -126`                      |
| int      | short | Overflow (valor > 32767)    | `40000 → -25536`                  |
| long     | int   | Overflow (valor > 2^31 - 1) | `2147483648L → -2147483648`       |
| double   | int   | Truncamento (.xxx perdido)  | `123.999 → 123`                   |
| double   | float | Perda de precisão           | `0.123456789012 → 0.12345679`     |
| long     | float | Perda de precisão           | `123456789012345L → 1.23456788E14`|
| float    | int   | Truncamento + overflow      | `Float.MAX_VALUE → 2147483647`    |
| char     | byte  | Overflow (char > 127)       | `'Ç' → overflow`                  |

### Exemplo Completo: Cascata de Perdas

```java
public class CascataPerdas {
    public static void main(String[] args) {
        // 1. Valor inicial (double)
        double d = 123456.789012345;
        System.out.println("double: " + d);
        // Saída: 123456.789012345
        
        // 2. double → float (perda de precisão)
        float f = (float) d;
        System.out.println("float:  " + f);
        // Saída: 123456.79 (arredondado)
        
        // 3. float → long (truncamento)
        long l = (long) f;
        System.out.println("long:   " + l);
        // Saída: 123456 (parte fracionária perdida)
        
        // 4. long → int (sem perda, valor cabe)
        int i = (int) l;
        System.out.println("int:    " + i);
        // Saída: 123456
        
        // 5. int → short (overflow!)
        short s = (short) i;
        System.out.println("short:  " + s);
        // Saída: -7616 (overflow!)
        
        // 6. short → byte (overflow!)
        byte b = (byte) s;
        System.out.println("byte:   " + b);
        // Saída: 32 (overflow!)
    }
}
```

**Resumo das Perdas**:
1. **Precisão**: `123456.789012345` → `123456.79`
2. **Truncamento**: `123456.79` → `123456`
3. **Overflow (short)**: `123456` → `-7616`
4. **Overflow (byte)**: `-7616` → `32`

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação Antes de Narrowing

```java
public class ValidacaoNarrowing {
    public static byte intToByteSafe(int valor) {
        if (valor < Byte.MIN_VALUE || valor > Byte.MAX_VALUE) {
            throw new IllegalArgumentException(
                "Valor fora do range de byte: " + valor
            );
        }
        return (byte) valor;
    }
    
    public static void main(String[] args) {
        try {
            byte b1 = intToByteSafe(100);   // ✅ OK
            System.out.println(b1);         // 100
            
            byte b2 = intToByteSafe(200);   // ❌ Exception
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
            // Valor fora do range de byte: 200
        }
    }
}
```

### Caso 2: Arredondamento vs Truncamento

```java
public class ArredondamentoTruncamento {
    public static void main(String[] args) {
        double[] valores = {123.4, 123.5, 123.9, -123.4, -123.5, -123.9};
        
        for (double d : valores) {
            int truncado = (int) d;
            int arredondado = (int) Math.round(d);
            
            System.out.printf("%.1f → trunc: %d, round: %d%n",
                              d, truncado, arredondado);
        }
    }
}
```

**Saída**:
```
123.4 → trunc: 123, round: 123
123.5 → trunc: 123, round: 124
123.9 → trunc: 123, round: 124
-123.4 → trunc: -123, round: -123
-123.5 → trunc: -123, round: -123
-123.9 → trunc: -123, round: -124
```

### Caso 3: Detecção de Overflow

```java
public class DeteccaoOverflow {
    public static int longToIntSafe(long valor) {
        if (valor < Integer.MIN_VALUE || valor > Integer.MAX_VALUE) {
            throw new ArithmeticException(
                "Overflow ao converter long para int: " + valor
            );
        }
        return (int) valor;
    }
    
    // Alternativa: Math.toIntExact (Java 8+)
    public static int longToIntExact(long valor) {
        return Math.toIntExact(valor);  // Lança exception em overflow
    }
    
    public static void main(String[] args) {
        long grande = 3000000000L;
        
        // Unsafe
        int i1 = (int) grande;
        System.out.println(i1);  // -1294967296 (overflow silencioso!)
        
        // Safe (custom)
        try {
            int i2 = longToIntSafe(grande);
        } catch (ArithmeticException e) {
            System.err.println(e.getMessage());
        }
        
        // Safe (Java 8+)
        try {
            int i3 = Math.toIntExact(grande);
        } catch (ArithmeticException e) {
            System.err.println("Overflow detectado!");
        }
    }
}
```

### Caso 4: Perda de Precisão em Cálculos Financeiros

```java
import java.math.BigDecimal;

public class CalculosFinanceiros {
    public static void main(String[] args) {
        // ❌ Usando double/float
        double valor1 = 0.1;
        double valor2 = 0.2;
        double soma = valor1 + valor2;
        System.out.println("double: " + soma);  // 0.30000000000000004 ⚠️
        
        // ✅ Usando BigDecimal
        BigDecimal bd1 = new BigDecimal("0.1");
        BigDecimal bd2 = new BigDecimal("0.2");
        BigDecimal somaBd = bd1.add(bd2);
        System.out.println("BigDecimal: " + somaBd);  // 0.3 ✅
        
        // ❌ double → float (perda de precisão)
        double preciso = 0.123456789012;
        float impreciso = (float) preciso;
        System.out.printf("double: %.15f%n", preciso);    // 0.123456789012000
        System.out.printf("float:  %.15f%n", impreciso);  // 0.123456791043282 ⚠️
    }
}
```

### Caso 5: Conversão Segura com Saturação

```java
public class ConversaoSaturacao {
    /**
     * Converte int para byte com saturação (sem overflow).
     * Se valor > 127, retorna 127.
     * Se valor < -128, retorna -128.
     */
    public static byte intToByteSaturated(int valor) {
        if (valor > Byte.MAX_VALUE) {
            return Byte.MAX_VALUE;
        } else if (valor < Byte.MIN_VALUE) {
            return Byte.MIN_VALUE;
        }
        return (byte) valor;
    }
    
    public static void main(String[] args) {
        int[] valores = {50, 127, 128, 200, -100, -128, -200};
        
        for (int v : valores) {
            byte normal = (byte) v;
            byte saturado = intToByteSaturated(v);
            
            System.out.printf("int: %d → normal: %d, saturado: %d%n",
                              v, normal, saturado);
        }
    }
}
```

**Saída**:
```
int: 50 → normal: 50, saturado: 50
int: 127 → normal: 127, saturado: 127
int: 128 → normal: -128, saturado: 127
int: 200 → normal: -56, saturado: 127
int: -100 → normal: -100, saturado: -100
int: -128 → normal: -128, saturado: -128
int: -200 → normal: 56, saturado: -128
```

---

## ⚠️ Limitações e Considerações

### 1. Overflow Silencioso

**Problema**: Java **não lança exception** em overflow de narrowing.

```java
int grande = 200;
byte pequeno = (byte) grande;  // ⚠️ -56 (sem exception!)
```

**Solução**: Validar manualmente ou usar métodos `*Exact`.

```java
// Java 8+
try {
    int i = Math.toIntExact(longValue);
    byte b = Math.toIntExact(intValue);  // ❌ Não existe toByte Exact!
} catch (ArithmeticException e) {
    // Overflow detectado
}
```

### 2. Truncamento Não É Arredondamento

**Problema**: Casting trunca, não arredonda.

```java
double d = 123.99;
int i = (int) d;  // 123 (não 124!)
```

**Solução**: Usar `Math.round()`.

```java
int arredondado = (int) Math.round(d);  // 124
```

### 3. Perda de Precisão é Irreversível

**Problema**: Conversão `double → float` perde informação permanentemente.

```java
double d1 = 0.123456789012;
float f = (float) d1;
double d2 = f;  // ⚠️ Não recupera precisão original!
System.out.println(d1);  // 0.123456789012
System.out.println(d2);  // 0.12345679104328156
```

### 4. Cuidado com Valores Negativos

**Problema**: Truncamento vai em direção a zero.

```java
double d1 = -123.9;
int i1 = (int) d1;  // -123 (não -124!)
```

**Arredondamento correto para negativos**:
```java
int arredondado = (int) Math.round(d1);  // -124
```

### 5. char é Unsigned

**Problema**: `char` (0 a 65535) pode causar overflow em `byte`/`short`.

```java
char c = 200;
byte b = (byte) c;  // -56 (overflow!)

char c2 = '\u00FF';  // 255
byte b2 = (byte) c2;  // -1 (overflow!)
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Conversão Explícita (Narrowing)**: Base teórica
- **Tipos Primitivos**: Ranges e representação
- **Overflow**: Comportamento em narrowing
- **Operador de Casting**: Sintaxe para narrowing
- **Exceções**: Ausência de exceptions em overflow

---

## 🚀 Boas Práticas

1. ✅ **Valide antes de narrowing**
   ```java
   if (valor >= Byte.MIN_VALUE && valor <= Byte.MAX_VALUE) {
       byte b = (byte) valor;
   }
   ```

2. ✅ **Use Math.*Exact para int/long**
   ```java
   int seguro = Math.toIntExact(longValue);
   ```

3. ✅ **Arredonde em vez de truncar**
   ```java
   int arredondado = (int) Math.round(doubleValue);
   ```

4. ✅ **Use BigDecimal para finanças**
   ```java
   BigDecimal preciso = new BigDecimal("123.45");
   ```

5. ✅ **Documente conversões arriscadas**
   ```java
   // Cast seguro: valor validado no range de byte
   byte b = (byte) valorValidado;
   ```

6. ✅ **Prefira tipos maiores quando possível**
   ```java
   // ✅ Evita narrowing
   int resultado = byteValue1 + byteValue2;
   
   // ❌ Requer cast
   byte resultado = (byte)(byteValue1 + byteValue2);
   ```

7. ❌ **Evite casts cegos em dados externos**
   ```java
   // ❌ Perigoso
   byte b = (byte) Integer.parseInt(userInput);
   
   // ✅ Seguro
   int valor = Integer.parseInt(userInput);
   if (valor >= Byte.MIN_VALUE && valor <= Byte.MAX_VALUE) {
       byte b = (byte) valor;
   } else {
       throw new IllegalArgumentException("Valor inválido");
   }
   ```
