# Conversão Explícita (Narrowing)

## 🎯 Introdução e Definição

### Definição Conceitual

**Conversão explícita** (ou **narrowing conversion**) é o processo de converter um tipo de dado **maior** para um tipo **menor**, exigindo **sintaxe explícita de casting**. Esta conversão pode resultar em **perda de dados** ou **perda de precisão**, por isso o compilador Java **não permite** que seja feita automaticamente.

**Narrowing** significa "estreitamento" - o tipo de destino tem **menos bits** e pode **não acomodar** todos os valores possíveis do tipo de origem.

**Sintaxe** (explícita):
```java
long valorLong = 100L;
int valorInt = (int) valorLong;  // ✅ Conversão explícita (long → int)
```

**Hierarquia de Narrowing** (maior → menor):
```
double → float → long → int → short → byte
                              → char
```

### Características Fundamentais

**Conversão Explícita**:
- ⚠️ **Manual**: Requer casting explícito `(tipo)valor`
- ⚠️ **Arriscada**: Pode perder dados ou precisão
- ✅ **Verificada em compilação**: Compilador exige casting
- ❌ **Sem exceções em runtime**: Truncamento silencioso
- 📉 **Estreitamento**: Tipo destino tem menos bits

**Exemplo Básico**:
```java
double d = 3.14;
float f = (float) d;    // ✅ double → float (narrowing)
long l = (long) f;      // ✅ float → long (trunca parte decimal)
int i = (int) l;        // ✅ long → int
short s = (short) i;    // ✅ int → short
byte b = (byte) s;      // ✅ short → byte
```

### Contexto Histórico

**Java 1.0 (1995)**: Decisão de design para **segurança de tipos**:
- **Conversões perigosas** devem ser **explícitas**
- Programador assume **responsabilidade** pela perda de dados
- Contrasta com C/C++ (conversões implícitas perigosas)

**Filosofia**: "Se pode perder dados, deve ser explícito."

### Problema Fundamental que Resolve

#### Prevenção de Erros Acidentais

**Sem narrowing explícito** (hipotético):
```java
long l = 9999999999L;
int i = l;  // ⚠️ Conversão implícita truncaria valor (PERIGOSO!)
```

**Com narrowing explícito** (Java):
```java
long l = 9999999999L;
int i = l;  // ❌ ERRO: incompatible types: possible loss of precision
```

**Solução consciente**:
```java
long l = 9999999999L;
int i = (int) l;  // ✅ OK (programador assume responsabilidade)
System.out.println(i);  // 1410065407 (valor truncado/overflow)
```

---

## 📋 Sumário Conceitual

### Conversões Explícitas Necessárias

**Tipos de Ponto Flutuante**:
```java
double → float
```

**Ponto Flutuante para Inteiros**:
```java
double/float → long/int/short/byte
```

**Tipos Inteiros** (maior para menor):
```java
long → int → short → byte
     → char
```

### Tabela de Conversões Explícitas

| De ↓ / Para → | byte | short | char | int | long | float | double |
|---------------|------|-------|------|-----|------|-------|--------|
| **short**     | ⚠️   | —     | ⚠️   | ✅  | ✅   | ✅    | ✅     |
| **char**      | ⚠️   | ⚠️    | —    | ✅  | ✅   | ✅    | ✅     |
| **int**       | ⚠️   | ⚠️    | ⚠️   | —   | ✅   | ✅    | ✅     |
| **long**      | ⚠️   | ⚠️    | ⚠️   | ⚠️  | —    | ✅    | ✅     |
| **float**     | ⚠️   | ⚠️    | ⚠️   | ⚠️  | ⚠️   | —     | ✅     |
| **double**    | ⚠️   | ⚠️    | ⚠️   | ⚠️  | ⚠️   | ⚠️    | —      |

✅ = Conversão implícita (widening)  
⚠️ = Conversão explícita necessária (narrowing)

---

## 🧠 Fundamentos Teóricos

### 1. Narrowing de Tipos Inteiros

**long → int**:
```java
long l = 1000L;
int i = (int) l;  // ✅ OK (1000 cabe em int)

long l2 = 9999999999L;  // Maior que Integer.MAX_VALUE
int i2 = (int) l2;       // ⚠️ Overflow (truncamento)
System.out.println(i2);  // 1410065407 (valor incorreto!)
```

**int → short**:
```java
int i = 100;
short s = (short) i;  // ✅ OK (100 cabe em short)

int i2 = 50000;        // Maior que Short.MAX_VALUE (32767)
short s2 = (short) i2; // ⚠️ Overflow
System.out.println(s2); // -15536 (valor negativo incorreto!)
```

**short → byte**:
```java
short s = 100;
byte b = (byte) s;  // ✅ OK (100 cabe em byte)

short s2 = 200;      // Maior que Byte.MAX_VALUE (127)
byte b2 = (byte) s2; // ⚠️ Overflow
System.out.println(b2); // -56 (valor incorreto!)
```

**int → char**:
```java
int i = 65;
char c = (char) i;  // ✅ OK (c = 'A')

int i2 = -1;
char c2 = (char) i2; // ⚠️ Valor negativo → char (65535)
System.out.println((int) c2); // 65535
```

### 2. Narrowing de Ponto Flutuante

**double → float**:
```java
double d = 3.14;
float f = (float) d;  // ✅ OK

double d2 = 1.7976931348623157E308;  // Double.MAX_VALUE
float f2 = (float) d2;                // ⚠️ Overflow → Infinity
System.out.println(f2);               // Infinity
```

**float → int/long**:
```java
float f = 3.14f;
int i = (int) f;     // ✅ 3 (trunca parte decimal)
long l = (long) f;   // ✅ 3

float f2 = 3.99f;
int i2 = (int) f2;   // ✅ 3 (não arredonda, trunca!)
```

**double → int/long**:
```java
double d = 123.456;
int i = (int) d;     // ✅ 123 (trunca .456)
long l = (long) d;   // ✅ 123

double d2 = 1e20;    // Muito grande para int
int i2 = (int) d2;   // ⚠️ Overflow → Integer.MAX_VALUE
System.out.println(i2); // 2147483647
```

### 3. Truncamento vs Arredondamento

**Importante**: Narrowing **trunca**, não arredonda!

```java
double d = 9.99;
int i = (int) d;     // ✅ 9 (não 10!)

float f = 2.7f;
int i2 = (int) f;    // ✅ 2 (não 3!)
```

**Para arredondar**:
```java
double d = 9.99;
int i = (int) Math.round(d);  // ✅ 10 (arredonda)
```

### 4. Overflow em Narrowing

**Conceito**: Quando valor não cabe no tipo de destino, ocorre **wrap-around** (módulo).

**Fórmula**: `resultado = valor % (max - min + 1) + min`

**Exemplo int → byte**:
```java
int i = 130;         // Fora da faixa de byte (-128 a 127)
byte b = (byte) i;   // ⚠️ Overflow
System.out.println(b); // -126

// Cálculo: 130 % 256 = 130
// Como byte é signed: 130 - 256 = -126
```

**Exemplo int → short**:
```java
int i = 40000;        // Fora da faixa de short (-32768 a 32767)
short s = (short) i;  // ⚠️ Overflow
System.out.println(s); // -25536

// Cálculo: 40000 % 65536 = 40000
// Como short é signed: 40000 - 65536 = -25536
```

---

## 🔍 Análise Conceitual Profunda

### Conversões Seguras (Valor Dentro da Faixa)

**Exemplo**: Converter valores pequenos.

```java
long l = 100L;
int i = (int) l;      // ✅ 100 (sem perda)

double d = 50.0;
int i2 = (int) d;     // ✅ 50 (sem perda)

int i3 = 65;
char c = (char) i3;   // ✅ 'A' (sem perda)
```

### Conversões com Perda de Dados

**Overflow em inteiros**:
```java
int i = Integer.MAX_VALUE;  // 2147483647
short s = (short) i;         // ⚠️ -1 (overflow)

long l = Long.MAX_VALUE;     // 9223372036854775807
int i2 = (int) l;            // ⚠️ -1 (overflow)
```

**Perda de parte decimal**:
```java
double d = 3.99999;
int i = (int) d;     // ✅ 3 (perde .99999)

float f = 123.456f;
int i2 = (int) f;    // ✅ 123 (perde .456)
```

**Valores negativos**:
```java
int i = -100;
char c = (char) i;   // ⚠️ 65436 (char é unsigned!)
```

### Valores Especiais (Infinity, NaN)

**Infinity → int**:
```java
double d = Double.POSITIVE_INFINITY;
int i = (int) d;     // ⚠️ Integer.MAX_VALUE (2147483647)

double d2 = Double.NEGATIVE_INFINITY;
int i2 = (int) d2;   // ⚠️ Integer.MIN_VALUE (-2147483648)
```

**NaN → int**:
```java
double d = Double.NaN;
int i = (int) d;     // ⚠️ 0
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Truncamento de Ponto Flutuante

```java
public class TruncamentoExemplo {
    public int obterParteInteira(double valor) {
        return (int) valor;  // ✅ Trunca parte decimal
    }
    
    public void exemplo() {
        System.out.println(obterParteInteira(3.14));   // 3
        System.out.println(obterParteInteira(9.99));   // 9
        System.out.println(obterParteInteira(-2.7));   // -2
    }
}
```

### Caso 2: Conversão de ASCII para char

```java
public class AsciiConverter {
    public char intParaChar(int codigoAscii) {
        return (char) codigoAscii;
    }
    
    public void exemplo() {
        System.out.println(intParaChar(65));   // 'A'
        System.out.println(intParaChar(97));   // 'a'
        System.out.println(intParaChar(48));   // '0'
    }
}
```

### Caso 3: Downsizing Controlado

```java
public class DownsizingSeguro {
    public short longParaShort(long valor) {
        if (valor < Short.MIN_VALUE || valor > Short.MAX_VALUE) {
            throw new IllegalArgumentException("Valor fora da faixa de short");
        }
        return (short) valor;
    }
    
    public byte intParaByte(int valor) {
        if (valor < Byte.MIN_VALUE || valor > Byte.MAX_VALUE) {
            throw new IllegalArgumentException("Valor fora da faixa de byte");
        }
        return (byte) valor;
    }
}
```

### Caso 4: Arredondamento vs Truncamento

```java
public class ArredondamentoExemplo {
    public int truncar(double valor) {
        return (int) valor;  // Trunca
    }
    
    public int arredondar(double valor) {
        return (int) Math.round(valor);  // Arredonda
    }
    
    public void exemplo() {
        double valor = 9.7;
        
        System.out.println(truncar(valor));     // 9
        System.out.println(arredondar(valor));  // 10
    }
}
```

### Caso 5: Extração de Bytes de Inteiro

```java
public class ExtrairBytes {
    public void exibirBytes(int valor) {
        byte b0 = (byte) (valor);           // Byte menos significativo
        byte b1 = (byte) (valor >> 8);
        byte b2 = (byte) (valor >> 16);
        byte b3 = (byte) (valor >> 24);     // Byte mais significativo
        
        System.out.printf("0x%02X %02X %02X %02X%n", b3, b2, b1, b0);
    }
    
    public void exemplo() {
        exibirBytes(0x12345678);  // 0x12 34 56 78
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Overflow Silencioso

**Problema**: Overflow não lança exceção.

```java
int i = Integer.MAX_VALUE + 1;
short s = (short) i;  // ⚠️ Overflow sem aviso
System.out.println(s); // 0 (valor incorreto!)
```

**Solução**: Validar antes de converter.
```java
if (i >= Short.MIN_VALUE && i <= Short.MAX_VALUE) {
    short s = (short) i;
} else {
    throw new IllegalArgumentException("Overflow!");
}
```

### 2. Perda de Parte Decimal

**Problema**: Truncamento pode ser indesejado.

```java
double preco = 9.99;
int precoInt = (int) preco;  // ⚠️ 9 (perde .99)
```

**Solução**: Arredondar se necessário.
```java
int precoInt = (int) Math.round(preco);  // ✅ 10
```

### 3. Valores Negativos em char

**Problema**: char é unsigned, valores negativos ficam incorretos.

```java
int i = -1;
char c = (char) i;  // ⚠️ 65535 (não -1!)
```

**Solução**: Validar antes de converter.
```java
if (i >= 0 && i <= Character.MAX_VALUE) {
    char c = (char) i;
}
```

### 4. Infinity e NaN

**Problema**: Conversão de valores especiais.

```java
double d = Double.POSITIVE_INFINITY;
int i = (int) d;  // ⚠️ Integer.MAX_VALUE (não infinity!)
```

**Solução**: Verificar antes.
```java
if (Double.isFinite(d)) {
    int i = (int) d;
} else {
    // Tratar infinity/NaN
}
```

### 5. double → float (Overflow)

**Problema**: Valor muito grande vira Infinity.

```java
double d = Double.MAX_VALUE;
float f = (float) d;  // ⚠️ Infinity
```

**Solução**: Validar faixa.
```java
if (d >= -Float.MAX_VALUE && d <= Float.MAX_VALUE) {
    float f = (float) d;
} else {
    // Valor fora da faixa de float
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Conversão Implícita (Widening)**: Operação inversa
- **Promoção Numérica**: Conversão automática em expressões
- **Overflow**: Consequência de narrowing
- **Wrapper Classes**: Métodos de conversão segura
- **Math.round()**: Arredondamento antes de narrowing

---

## 🚀 Boas Práticas

1. ✅ **Valide antes de converter**
   ```java
   if (longValue <= Integer.MAX_VALUE && longValue >= Integer.MIN_VALUE) {
       int i = (int) longValue;
   }
   ```

2. ✅ **Use Math.round() para arredondar**
   ```java
   double d = 9.7;
   int i = (int) Math.round(d);  // ✅ 10 (não 9)
   ```

3. ✅ **Documente conversões arriscadas**
   ```java
   /**
    * Converte long para int.
    * Atenção: pode causar overflow se valor > Integer.MAX_VALUE
    */
   public int converter(long valor) {
       return (int) valor;
   }
   ```

4. ❌ **Evite conversões desnecessárias**
   ```java
   long l = 100L;
   int i = (int) l;  // ⚠️ Desnecessário se l sempre cabe em int
   ```

5. ✅ **Use constantes para validação**
   ```java
   if (valor >= Byte.MIN_VALUE && valor <= Byte.MAX_VALUE) {
       byte b = (byte) valor;
   }
   ```

6. ✅ **Trate Infinity e NaN**
   ```java
   if (Double.isFinite(d)) {
       int i = (int) d;
   } else {
       // Tratar caso especial
   }
   ```

7. ✅ **Prefira wrapper classes para conversões seguras**
   ```java
   String s = "123";
   int i = Integer.parseInt(s);  // ✅ Lança exceção se inválido
   ```

8. ⚠️ **Cuidado com truncamento silencioso**
   ```java
   double d = 9.99;
   int i = (int) d;  // ⚠️ 9 (trunca, não arredonda)
   ```
