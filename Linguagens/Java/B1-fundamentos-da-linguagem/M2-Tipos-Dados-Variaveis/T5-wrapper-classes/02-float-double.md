# Wrapper Classes: Float e Double

## 🎯 Introdução e Definição

### Definição Conceitual

**Float** e **Double** são wrapper classes que encapsulam os tipos primitivos de **ponto flutuante** `float` e `double`, permitindo representar números reais (com parte fracionária) como objetos.

**Mapeamento Primitivo → Wrapper**:
```java
float   → Float
double  → Double
```

**Características**:
- **Precisão**: `float` (32 bits, ~7 dígitos), `double` (64 bits, ~15-16 dígitos)
- **Valores especiais**: `POSITIVE_INFINITY`, `NEGATIVE_INFINITY`, `NaN`
- **IEEE 754**: Padrão internacional de representação de ponto flutuante
- **Uso**: Cálculos científicos, gráficos, medições, coordenadas

**Exemplo**:
```java
// Primitivos
float f = 123.456f;
double d = 123.456789012345;

// Wrappers
Float fObj = Float.valueOf(123.456f);
Double dObj = Double.valueOf(123.456789012345);

// Collections
List<Double> precos = new ArrayList<>();
precos.add(19.99);  // Autoboxing
```

### Características Fundamentais

**Float e Double**:
- 📊 **Precisão**: Float (7 dígitos), Double (15-16 dígitos)
- ♾️ **Valores especiais**: Infinity, -Infinity, NaN
- 🔒 **Imutáveis**: Valor não pode ser alterado
- 🎯 **Final**: Classes não podem ser estendidas
- 📐 **IEEE 754**: Seguem padrão de ponto flutuante
- ⚠️ **Imprecisão**: Não exatos para valores decimais

### Hierarquia de Classes

```
java.lang.Object
    └── java.lang.Number (abstract)
            ├── Float
            └── Double
```

---

## 📋 Sumário Conceitual

### Comparativo Float vs Double

| Característica   | Float                | Double                           |
|------------------|----------------------|----------------------------------|
| **Primitivo**    | float                | double                           |
| **Tamanho**      | 32 bits (4 bytes)    | 64 bits (8 bytes)                |
| **Precisão**     | ~7 dígitos decimais  | ~15-16 dígitos decimais          |
| **Range**        | ±1.4E-45 a ±3.4E+38  | ±4.9E-324 a ±1.7E+308            |
| **Sufixo literal**| f ou F              | nenhum (padrão) ou d/D           |
| **Uso comum**    | Gráficos, OpenGL     | Padrão, cálculos científicos     |
| **Cache**        | Não possui           | Não possui                       |

### Valores Especiais

```java
Float.POSITIVE_INFINITY   // +∞
Float.NEGATIVE_INFINITY   // -∞
Float.NaN                 // Not a Number

Double.POSITIVE_INFINITY  // +∞
Double.NEGATIVE_INFINITY  // -∞
Double.NaN                // Not a Number
```

---

## 🧠 Fundamentos Teóricos

### 1. Classe Float

**Wrapper de float** (32 bits, precisão simples)

**Constantes**:
```java
Float.MIN_VALUE           // 1.4E-45 (menor positivo)
Float.MAX_VALUE           // 3.4028235E38
Float.MIN_NORMAL          // 1.17549435E-38 (menor normal)
Float.MIN_EXPONENT        // -126
Float.MAX_EXPONENT        // 127
Float.SIZE                // 32 (bits)
Float.BYTES               // 4 (bytes)
Float.POSITIVE_INFINITY   // +∞
Float.NEGATIVE_INFINITY   // -∞
Float.NaN                 // Not a Number
Float.TYPE                // Representa o tipo primitivo float
```

**Criação**:
```java
// valueOf() - recomendado
Float f1 = Float.valueOf(123.456f);
Float f2 = Float.valueOf("123.456");

// Autoboxing
Float f3 = 123.456f;

// Construtor - deprecated (Java 9+)
@Deprecated
Float f4 = new Float(123.456f);
```

**Métodos principais**:

**Parsing**:
```java
float f = Float.parseFloat("123.456");         // "123.456" → 123.456f
float f2 = Float.parseFloat("1.23E10");        // Notação científica
float f3 = Float.parseFloat("Infinity");       // Float.POSITIVE_INFINITY
float f4 = Float.parseFloat("-Infinity");      // Float.NEGATIVE_INFINITY
float f5 = Float.parseFloat("NaN");            // Float.NaN
```

**Conversão**:
```java
Float obj = Float.valueOf(123.456f);
float primitivo = obj.floatValue();
double d = obj.doubleValue();     // Widening
int i = obj.intValue();           // Trunca
```

**Comparação**:
```java
Float a = 10.5f;
Float b = 20.7f;

int resultado = a.compareTo(b);               // -1 (a < b)
int resultado2 = Float.compare(10.5f, 20.7f); // -1

// Comparação considerando NaN
boolean igual = Float.compare(a, b) == 0;
```

**Verificações de Valores Especiais**:
```java
float f = 10.5f / 0;  // POSITIVE_INFINITY

boolean isInfinite = Float.isInfinite(f);     // true
boolean isFinite = Float.isFinite(f);         // false (Java 8+)
boolean isNaN = Float.isNaN(f);               // false

float nan = 0.0f / 0.0f;
boolean isNaN2 = Float.isNaN(nan);            // true
```

**String**:
```java
String str = Float.toString(123.456f);        // "123.456"
String hex = Float.toHexString(123.456f);     // Hex IEEE 754
```

**Bits (IEEE 754)**:
```java
int bits = Float.floatToIntBits(123.456f);    // Representação bruta
int rawBits = Float.floatToRawIntBits(123.456f); // Preserva NaN
float value = Float.intBitsToFloat(bits);     // Bits → float
```

### 2. Classe Double

**Wrapper de double** (64 bits, precisão dupla)

**Constantes**:
```java
Double.MIN_VALUE          // 4.9E-324 (menor positivo)
Double.MAX_VALUE          // 1.7976931348623157E308
Double.MIN_NORMAL         // 2.2250738585072014E-308
Double.MIN_EXPONENT       // -1022
Double.MAX_EXPONENT       // 1023
Double.SIZE               // 64 (bits)
Double.BYTES              // 8 (bytes)
Double.POSITIVE_INFINITY  // +∞
Double.NEGATIVE_INFINITY  // -∞
Double.NaN                // Not a Number
Double.TYPE               // Representa o tipo primitivo double
```

**Criação**:
```java
// valueOf() - recomendado
Double d1 = Double.valueOf(123.456789012345);
Double d2 = Double.valueOf("123.456");

// Autoboxing
Double d3 = 123.456;

// Construtor - deprecated
@Deprecated
Double d4 = new Double(123.456);
```

**Métodos principais**:

**Parsing**:
```java
double d = Double.parseDouble("123.456789012345");
double d2 = Double.parseDouble("1.23E100");    // Notação científica
double d3 = Double.parseDouble("Infinity");    // Double.POSITIVE_INFINITY
double d4 = Double.parseDouble("NaN");         // Double.NaN
```

**Conversão**:
```java
Double obj = Double.valueOf(123.456);
double primitivo = obj.doubleValue();
float f = obj.floatValue();       // ⚠️ Perda de precisão
int i = obj.intValue();           // Trunca
long l = obj.longValue();         // Trunca
```

**Comparação**:
```java
Double a = 10.5;
Double b = 20.7;

int resultado = a.compareTo(b);                // -1
int resultado2 = Double.compare(10.5, 20.7);   // -1
```

**Verificações**:
```java
double d = 10.0 / 0;  // POSITIVE_INFINITY

boolean isInfinite = Double.isInfinite(d);     // true
boolean isFinite = Double.isFinite(d);         // false (Java 8+)
boolean isNaN = Double.isNaN(d);               // false

double nan = 0.0 / 0.0;
boolean isNaN2 = Double.isNaN(nan);            // true
```

**String**:
```java
String str = Double.toString(123.456789012345); // "123.456789012345"
String hex = Double.toHexString(123.456);       // Hex IEEE 754
```

**Bits (IEEE 754)**:
```java
long bits = Double.doubleToLongBits(123.456);
long rawBits = Double.doubleToRawLongBits(123.456);
double value = Double.longBitsToDouble(bits);
```

**Soma precisa (Java 8+)**:
```java
double soma = Double.sum(10.5, 20.7);  // 31.2
```

**Max/Min (Java 8+)**:
```java
double max = Double.max(10.5, 20.7);   // 20.7
double min = Double.min(10.5, 20.7);   // 10.5
```

---

## 🔍 Análise Conceitual Profunda

### Representação IEEE 754

**Float (32 bits)**:
```
| Sinal (1 bit) | Expoente (8 bits) | Mantissa (23 bits) |
```

**Double (64 bits)**:
```
| Sinal (1 bit) | Expoente (11 bits) | Mantissa (52 bits) |
```

**Exemplo**:
```java
float f = 123.456f;
int bits = Float.floatToIntBits(f);
String binary = Integer.toBinaryString(bits);
System.out.println("Binário: " + binary);
// 01000010111101101110100101111001
```

### Valores Especiais: NaN e Infinity

**Infinity** (divisão por zero):
```java
double positiveInf = 10.0 / 0.0;   // POSITIVE_INFINITY
double negativeInf = -10.0 / 0.0;  // NEGATIVE_INFINITY

System.out.println(positiveInf);   // Infinity
System.out.println(negativeInf);   // -Infinity

// Operações com Infinity
double result1 = positiveInf + 10;  // Infinity
double result2 = positiveInf * 2;   // Infinity
double result3 = positiveInf - positiveInf;  // NaN
```

**NaN** (Not a Number):
```java
double nan1 = 0.0 / 0.0;           // NaN
double nan2 = Math.sqrt(-1);       // NaN
double nan3 = Double.POSITIVE_INFINITY - Double.POSITIVE_INFINITY; // NaN

// NaN é único: não é igual a nada, nem a si mesmo
System.out.println(nan1 == nan1);  // false (!!)
System.out.println(nan1 == nan2);  // false

// Use isNaN() para verificar
System.out.println(Double.isNaN(nan1));  // true
```

### Imprecisão de Ponto Flutuante

**Problema**: Valores decimais não são exatos.

```java
double a = 0.1;
double b = 0.2;
double soma = a + b;
System.out.println(soma);           // 0.30000000000000004 ⚠️
System.out.println(soma == 0.3);    // false ⚠️
```

**Razão**: Representação binária não é exata para muitos decimais.

**Solução 1**: Comparação com epsilon
```java
double epsilon = 0.00001;
boolean iguais = Math.abs(soma - 0.3) < epsilon;  // true
```

**Solução 2**: BigDecimal (finanças)
```java
import java.math.BigDecimal;

BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
BigDecimal soma = a.add(b);
System.out.println(soma);  // 0.3 ✅
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Cálculos Científicos

```java
public class CalculosCientificos {
    public void exemplo() {
        // Velocidade da luz (m/s)
        double c = 299792458.0;
        
        // Energia = massa × c²
        double massa = 0.001;  // kg
        double energia = massa * c * c;
        
        System.out.printf("Energia: %.2e J%n", energia);
        // Energia: 8.99e+13 J
    }
}
```

### Caso 2: Coordenadas Geográficas

```java
public class Coordenadas {
    private Double latitude;
    private Double longitude;
    
    public Coordenadas(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    public double distancia(Coordenadas outra) {
        // Fórmula de Haversine (simplificada)
        double dlat = Math.toRadians(outra.latitude - this.latitude);
        double dlon = Math.toRadians(outra.longitude - this.longitude);
        
        double a = Math.sin(dlat / 2) * Math.sin(dlat / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        double raioTerra = 6371.0;  // km
        return raioTerra * c;
    }
}
```

### Caso 3: Tratamento de Valores Especiais

```java
public class ValoresEspeciais {
    public Double calcularMedia(List<Double> valores) {
        if (valores == null || valores.isEmpty()) {
            return Double.NaN;  // Não definido
        }
        
        double soma = 0.0;
        for (Double valor : valores) {
            if (valor == null || Double.isNaN(valor) || Double.isInfinite(valor)) {
                continue;  // Ignora valores inválidos
            }
            soma += valor;
        }
        
        return soma / valores.size();
    }
    
    public void exemplo() {
        List<Double> valores = Arrays.asList(10.5, 20.7, null, Double.NaN, 30.2);
        Double media = calcularMedia(valores);
        
        if (Double.isNaN(media)) {
            System.out.println("Média indefinida");
        } else {
            System.out.printf("Média: %.2f%n", media);
        }
    }
}
```

### Caso 4: Comparação com Epsilon

```java
public class ComparacaoEpsilon {
    private static final double EPSILON = 1e-10;
    
    public boolean iguais(double a, double b) {
        return Math.abs(a - b) < EPSILON;
    }
    
    public void exemplo() {
        double a = 0.1 + 0.2;
        double b = 0.3;
        
        System.out.println(a == b);         // false ⚠️
        System.out.println(iguais(a, b));   // true ✅
    }
}
```

### Caso 5: Parsing com Validação

```java
public class ParsingValidacao {
    public Double parseDoubleSafe(String str) {
        if (str == null || str.trim().isEmpty()) {
            return null;
        }
        
        try {
            double valor = Double.parseDouble(str.trim());
            
            // Rejeitar Infinity e NaN
            if (Double.isInfinite(valor) || Double.isNaN(valor)) {
                return null;
            }
            
            return valor;
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    public void exemplo() {
        Double d1 = parseDoubleSafe("123.456");   // 123.456
        Double d2 = parseDoubleSafe("Infinity");  // null
        Double d3 = parseDoubleSafe("abc");       // null
        Double d4 = parseDoubleSafe(null);        // null
    }
}
```

### Caso 6: Formatação de Saída

```java
import java.text.DecimalFormat;

public class FormatacaoDouble {
    public void exemplo() {
        double valor = 1234.56789;
        
        // printf
        System.out.printf("%.2f%n", valor);          // 1234.57
        System.out.printf("%,.2f%n", valor);         // 1,234.57
        System.out.printf("%.2e%n", valor);          // 1.23e+03
        
        // DecimalFormat
        DecimalFormat df1 = new DecimalFormat("#,##0.00");
        System.out.println(df1.format(valor));       // 1,234.57
        
        DecimalFormat df2 = new DecimalFormat("0.00E0");
        System.out.println(df2.format(valor));       // 1.23E3
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Imprecisão em Valores Decimais

**Problema**: Valores decimais não são exatos.

```java
double d = 0.1 + 0.2;
System.out.println(d);        // 0.30000000000000004
System.out.println(d == 0.3); // false
```

**Solução**: BigDecimal ou comparação com epsilon.

### 2. NaN Não É Igual a Nada

**Problema**: `NaN != NaN`

```java
double nan = Double.NaN;
System.out.println(nan == nan);  // false ⚠️
```

**Solução**: Usar `Double.isNaN()`.
```java
System.out.println(Double.isNaN(nan));  // true ✅
```

### 3. Comparação com == É Perigosa

**Problema**: Imprecisão + comparação exata = bug.

```java
double a = 0.1 + 0.2;
if (a == 0.3) {  // ❌ false
    // Nunca executa!
}
```

**Solução**: Epsilon.
```java
if (Math.abs(a - 0.3) < 1e-10) {  // ✅ true
    // Executa
}
```

### 4. Operações com Infinity

**Problema**: Infinity propaga em operações.

```java
double inf = Double.POSITIVE_INFINITY;
double result = inf + 100;  // Infinity
```

**Solução**: Validar antes de operar.
```java
if (!Double.isInfinite(valor)) {
    // Operar
}
```

### 5. Float vs Double: Precisão

**Problema**: Float tem precisão limitada.

```java
float f = 0.123456789f;
System.out.println(f);  // 0.12345679 (arredondado)

double d = 0.123456789012345;
System.out.println(d);  // 0.123456789012345 (preciso)
```

**Solução**: Prefira `double` para precisão.

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Tipos Primitivos**: Base dos wrappers
- **IEEE 754**: Padrão de representação
- **BigDecimal**: Alternativa para precisão exata
- **Math**: Operações matemáticas
- **Formatação**: printf, DecimalFormat

---

## 🚀 Boas Práticas

1. ✅ **Prefira double a float**
   ```java
   double d = 123.456;  // ✅ Mais preciso
   ```

2. ✅ **Use BigDecimal para finanças**
   ```java
   BigDecimal preco = new BigDecimal("19.99");
   ```

3. ✅ **Compare com epsilon, não com ==**
   ```java
   boolean iguais = Math.abs(a - b) < 1e-10;
   ```

4. ✅ **Valide NaN e Infinity**
   ```java
   if (Double.isFinite(valor)) {
       // Seguro
   }
   ```

5. ✅ **Use isNaN() para verificar NaN**
   ```java
   if (Double.isNaN(valor)) {
       // Tratar
   }
   ```

6. ⚠️ **Nunca use == para comparar doubles**
   ```java
   // ❌ Perigoso
   if (a == b) { ... }
   
   // ✅ Seguro
   if (Math.abs(a - b) < epsilon) { ... }
   ```

7. ✅ **Documente precisão esperada**
   ```java
   /**
    * @param valor Precisão de até 15 dígitos decimais
    */
   public void processar(double valor) { ... }
   ```

8. ✅ **Use sufixo f para literais float**
   ```java
   float f = 123.456f;  // ✅ Explícito
   ```
