# Casting entre Tipos Primitivos

## 🎯 Introdução e Definição

### Definição Conceitual

**Casting** é a operação **explícita** de conversão entre tipos de dados primitivos, utilizando o **operador de casting** `(tipo)`. Esta operação permite que o programador force uma conversão que:
- Pode resultar em **perda de dados** (narrowing)
- É **segura e automática** em widening (opcional)
- Requer **conhecimento dos riscos** envolvidos

**Sintaxe Geral**:
```java
tipo_destino variavel = (tipo_destino) valor_origem;
```

**Exemplo**:
```java
int i = 100;
byte b = (byte) i;  // Cast explícito: int → byte
```

### Características Fundamentais

**Casting**:
- 🔄 **Explícito**: Requer sintaxe `(tipo)`
- ⚠️ **Unsafe**: Pode perder dados em narrowing
- ✅ **Opcional**: Não necessário em widening
- 🎯 **Direcionado**: Programador assume responsabilidade
- 📏 **Type-safe**: Validado em compile-time

### Problema que Resolve

**Compatibilidade de Tipos**: Permite usar valores de um tipo em contextos que exigem outro.

```java
double d = 123.456;
int i = (int) d;  // Cast necessário: double → int
```

---

## 📋 Sumário Conceitual

### Tipos de Casting

1. **Widening Cast** (Opcional): Tipo menor → maior
2. **Narrowing Cast** (Obrigatório): Tipo maior → menor
3. **Cast de Precisão**: Ponto flutuante ↔ inteiro
4. **Cast de Tamanho**: Entre inteiros de diferentes tamanhos

### Matriz de Casting

```
           byte  short  char  int  long  float  double
byte        -     ✅     ⚠️    ✅   ✅    ✅     ✅
short       ⚠️    -      ⚠️    ✅   ✅    ✅     ✅
char        ⚠️    ⚠️     -     ✅   ✅    ✅     ✅
int         ⚠️    ⚠️     ⚠️    -    ✅    ✅     ✅
long        ⚠️    ⚠️     ⚠️    ⚠️   -     ✅     ✅
float       ⚠️    ⚠️     ⚠️    ⚠️   ⚠️    -      ✅
double      ⚠️    ⚠️     ⚠️    ⚠️   ⚠️    ⚠️     -

Legenda:
✅ Widening (automático, cast opcional)
⚠️ Narrowing (cast obrigatório, risco de perda)
- Mesmo tipo (sem conversão)
```

---

## 🧠 Fundamentos Teóricos

### 1. Widening Casting (Opcional)

**Conceito**: Conversão de tipo **menor** para **maior** é **automática**, mas pode usar cast explícito.

**Hierarquia**:
```
byte → short → int → long → float → double
       char → int
```

**Exemplos**:

**Sem cast** (implícito):
```java
byte b = 10;
int i = b;  // ✅ Widening automático

int i2 = 100;
long l = i2;  // ✅ Widening automático

float f = l;  // ✅ Widening automático
```

**Com cast** (explícito, mas redundante):
```java
byte b = 10;
int i = (int) b;  // ✅ OK, mas desnecessário

long l = (long) 100;  // ✅ OK, mas desnecessário
```

**Quando Usar Cast em Widening**:
- **Legibilidade**: Tornar conversão explícita
- **Evitar ambiguidade**: Em expressões complexas

### 2. Narrowing Casting (Obrigatório)

**Conceito**: Conversão de tipo **maior** para **menor** **exige cast** explícito.

**Hierarquia Inversa**:
```
double → float → long → int → short → byte
                              → char
```

**Exemplos**:

**int → byte**:
```java
int i = 100;
byte b = (byte) i;  // ✅ OK: 100 cabe em byte

int i2 = 200;
byte b2 = (byte) i2;  // ⚠️ OK, mas overflow: -56
```

**long → int**:
```java
long l = 1000L;
int i = (int) l;  // ✅ OK: 1000 cabe em int

long l2 = 3000000000L;
int i2 = (int) l2;  // ⚠️ OK, mas overflow: -1294967296
```

**double → float**:
```java
double d = 123.456;
float f = (float) d;  // ✅ OK, perda de precisão mínima
```

**double → int**:
```java
double d = 123.456;
int i = (int) d;  // ⚠️ OK, trunca: 123
```

### 3. Casting entre Inteiros

**byte ↔ short ↔ int ↔ long**:

```java
// Widening: automático
byte b = 10;
short s = b;
int i = s;
long l = i;

// Narrowing: cast obrigatório
long l2 = 100L;
int i2 = (int) l2;
short s2 = (short) i2;
byte b2 = (byte) s2;
```

**char ↔ inteiros**:

**char → int** (widening, automático):
```java
char c = 'A';  // 65
int i = c;  // ✅ 65 (automático)
```

**int → char** (narrowing, cast obrigatório):
```java
int i = 65;
char c = (char) i;  // ✅ 'A'

int i2 = 200;
char c2 = (char) i2;  // ✅ 'È' (200 em Unicode)
```

**char ↔ byte/short** (sempre narrowing):
```java
char c = 'A';  // 65
byte b = (byte) c;  // ⚠️ OK: 65 cabe em byte

char c2 = 'Ç';  // 199
byte b2 = (byte) c2;  // ⚠️ Overflow: -57

short s = (short) c;  // ⚠️ Cast necessário (char é unsigned)
```

### 4. Casting entre Ponto Flutuante e Inteiros

**Inteiro → Ponto Flutuante** (widening, automático):
```java
int i = 100;
float f = i;  // ✅ 100.0
double d = i;  // ✅ 100.0

long l = 123456789L;
float f2 = l;  // ⚠️ Perda de precisão possível
double d2 = l;  // ✅ Sem perda de precisão
```

**Ponto Flutuante → Inteiro** (narrowing, cast obrigatório):
```java
float f = 123.456f;
int i = (int) f;  // ⚠️ 123 (trunca)

double d = 987.654;
long l = (long) d;  // ⚠️ 987 (trunca)
int i2 = (int) d;  // ⚠️ 987 (trunca)
byte b = (byte) d;  // ⚠️ Overflow + trunca
```

### 5. Casting entre Ponto Flutuante

**float → double** (widening, automático):
```java
float f = 123.456f;
double d = f;  // ✅ Automático
```

**double → float** (narrowing, cast obrigatório):
```java
double d = 123.456789012;
float f = (float) d;  // ⚠️ Perda de precisão
System.out.println(f);  // 123.45679
```

---

## 🔍 Análise Conceitual Profunda

### Tabela Completa de Casting entre Primitivos

| De       | Para    | Tipo      | Cast Obrig.? | Risco                        |
|----------|---------|-----------|--------------|------------------------------|
| byte     | short   | Widening  | Não          | Nenhum                       |
| byte     | int     | Widening  | Não          | Nenhum                       |
| byte     | long    | Widening  | Não          | Nenhum                       |
| byte     | float   | Widening  | Não          | Nenhum                       |
| byte     | double  | Widening  | Não          | Nenhum                       |
| byte     | char    | Narrowing | Sim          | Negativos → valores grandes  |
| short    | byte    | Narrowing | Sim          | Overflow se > 127            |
| short    | int     | Widening  | Não          | Nenhum                       |
| short    | long    | Widening  | Não          | Nenhum                       |
| short    | float   | Widening  | Não          | Nenhum                       |
| short    | double  | Widening  | Não          | Nenhum                       |
| short    | char    | Narrowing | Sim          | Negativos → valores grandes  |
| char     | byte    | Narrowing | Sim          | Overflow se > 127            |
| char     | short   | Narrowing | Sim          | Valores > 32767 → overflow   |
| char     | int     | Widening  | Não          | Nenhum                       |
| char     | long    | Widening  | Não          | Nenhum                       |
| char     | float   | Widening  | Não          | Nenhum                       |
| char     | double  | Widening  | Não          | Nenhum                       |
| int      | byte    | Narrowing | Sim          | Overflow se fora [-128,127]  |
| int      | short   | Narrowing | Sim          | Overflow se > 32767          |
| int      | char    | Narrowing | Sim          | Negativos → valores grandes  |
| int      | long    | Widening  | Não          | Nenhum                       |
| int      | float   | Widening  | Não          | Perda precisão (valores grandes)|
| int      | double  | Widening  | Não          | Nenhum                       |
| long     | byte    | Narrowing | Sim          | Overflow múltiplo            |
| long     | short   | Narrowing | Sim          | Overflow múltiplo            |
| long     | char    | Narrowing | Sim          | Overflow múltiplo            |
| long     | int     | Narrowing | Sim          | Overflow se > 2^31-1         |
| long     | float   | Widening  | Não          | Perda precisão (valores grandes)|
| long     | double  | Widening  | Não          | Nenhum                       |
| float    | byte    | Narrowing | Sim          | Trunca + overflow            |
| float    | short   | Narrowing | Sim          | Trunca + overflow            |
| float    | char    | Narrowing | Sim          | Trunca + overflow            |
| float    | int     | Narrowing | Sim          | Truncamento parte fracionária|
| float    | long    | Narrowing | Sim          | Truncamento parte fracionária|
| float    | double  | Widening  | Não          | Nenhum                       |
| double   | byte    | Narrowing | Sim          | Trunca + overflow            |
| double   | short   | Narrowing | Sim          | Trunca + overflow            |
| double   | char    | Narrowing | Sim          | Trunca + overflow            |
| double   | int     | Narrowing | Sim          | Truncamento parte fracionária|
| double   | long    | Narrowing | Sim          | Truncamento parte fracionária|
| double   | float   | Narrowing | Sim          | Perda de precisão            |

### Exemplos de Casting Complexos

**Casting Encadeado**:
```java
double d = 123.456;
int i = (int) d;  // 123
short s = (short) i;  // 123
byte b = (byte) s;  // 123
```

**Casting em Expressões**:
```java
double d1 = 10.5;
double d2 = 20.7;
int soma = (int) d1 + (int) d2;  // 10 + 20 = 30

// ⚠️ Diferente de:
int somaTotal = (int) (d1 + d2);  // (int) 31.2 = 31
```

**Casting com Operadores**:
```java
int a = 10;
int b = 3;
double divisao = (double) a / b;  // 3.333... (a promovido)

// ⚠️ Diferente de:
double divisaoInteira = a / b;  // 3.0 (divisão inteira, depois widening)
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Conversão Segura (Widening)

```java
public class WideningCast {
    public void exemplo() {
        byte b = 10;
        short s = 20;
        int i = 30;
        long l = 40L;
        
        // Todos automáticos (widening)
        long total = b + s + i + l;  // ✅ OK
        
        // Cast explícito opcional (para legibilidade)
        long total2 = (long) b + (long) s + (long) i + l;
    }
}
```

### Caso 2: Conversão com Validação (Narrowing Seguro)

```java
public class NarrowingSafe {
    public static byte intToByte(int valor) {
        if (valor < Byte.MIN_VALUE || valor > Byte.MAX_VALUE) {
            throw new IllegalArgumentException(
                "Valor " + valor + " não cabe em byte"
            );
        }
        return (byte) valor;  // Cast seguro após validação
    }
    
    public static void main(String[] args) {
        try {
            byte b1 = intToByte(100);   // ✅ OK: 100
            byte b2 = intToByte(200);   // ❌ Exception
        } catch (IllegalArgumentException e) {
            System.err.println(e.getMessage());
        }
    }
}
```

### Caso 3: Truncamento Controlado

```java
public class TruncamentoControlado {
    public void exemplo() {
        double preco = 19.99;
        
        // Truncamento (descarta centavos)
        int reais = (int) preco;  // 19
        
        // Arredondamento (para cima se >= 0.50)
        int reaisArredondados = (int) Math.round(preco);  // 20
        
        // Centavos (parte fracionária)
        int centavos = (int) ((preco - reais) * 100);  // 99
        
        System.out.println("R$ " + reais + "," + centavos);
        // R$ 19,99
    }
}
```

### Caso 4: Divisão com Resultado Double

```java
public class DivisaoDouble {
    public double calcularMedia(int soma, int quantidade) {
        // ✅ Cast para obter precisão
        return (double) soma / quantidade;
        
        // ❌ Sem cast: divisão inteira
        // return soma / quantidade;  // Trunca!
    }
    
    public void exemplo() {
        int soma = 100;
        int qtd = 3;
        
        // Sem cast
        double media1 = soma / qtd;  // 33.0 (divisão inteira!)
        
        // Com cast
        double media2 = (double) soma / qtd;  // 33.333...
        
        System.out.println(media1);  // 33.0
        System.out.println(media2);  // 33.333333333333336
    }
}
```

### Caso 5: Casting de char

```java
public class CastingChar {
    public void exemplo() {
        // char → int (valor Unicode)
        char c1 = 'A';
        int codigo = c1;  // 65 (automático)
        
        // int → char (caractere correspondente)
        int codigo2 = 66;
        char c2 = (char) codigo2;  // 'B' (cast obrigatório)
        
        // Aritmética com char
        char c3 = 'A';
        char proximo = (char) (c3 + 1);  // 'B' (cast obrigatório!)
        
        // ⚠️ Sem cast:
        // char proximo = c3 + 1;  // ERRO: int não pode virar char
        
        System.out.println("char: " + c1 + ", código: " + codigo);
        System.out.println("código: " + codigo2 + ", char: " + c2);
        System.out.println("próximo de A: " + proximo);
    }
}
```

### Caso 6: Casting em Arrays e Collections

```java
import java.util.Arrays;

public class CastingArrays {
    public void exemplo() {
        int[] inteiros = {10, 20, 30, 40, 50};
        
        // Conversão int[] → double[]
        double[] doubles = Arrays.stream(inteiros)
                                  .asDoubleStream()
                                  .toArray();
        
        // Conversão manual
        byte[] bytes = new byte[inteiros.length];
        for (int i = 0; i < inteiros.length; i++) {
            bytes[i] = (byte) inteiros[i];  // Cast para cada elemento
        }
        
        System.out.println("doubles: " + Arrays.toString(doubles));
        System.out.println("bytes: " + Arrays.toString(bytes));
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Cast Não Valida Range

**Problema**: Compilador aceita cast, mas não verifica overflow.

```java
int grande = 300;
byte pequeno = (byte) grande;  // ✅ Compila, mas overflow: 44
```

**Solução**: Validar manualmente.

### 2. Truncamento É Irreversível

**Problema**: Informação perdida não pode ser recuperada.

```java
double original = 123.456;
int truncado = (int) original;  // 123
double restaurado = truncado;  // 123.0 (não 123.456!)
```

### 3. Casting Não Arredonda

**Problema**: Conversão float/double → int trunca, não arredonda.

```java
double d = 123.99;
int i = (int) d;  // 123 (não 124!)
```

**Solução**: Usar `Math.round()`.

```java
int arredondado = (int) Math.round(d);  // 124
```

### 4. Perda de Precisão em long → float

**Problema**: `float` tem menos bits de precisão que `long`.

```java
long l = 123456789012345L;
float f = l;  // ⚠️ Perda de precisão (widening!)
System.out.println(l);  // 123456789012345
System.out.println(f);  // 1.23456788E14
```

### 5. Cast de boolean Não Existe

**Problema**: `boolean` não pode ser convertido para numérico.

```java
boolean b = true;
int i = (int) b;  // ❌ ERRO DE COMPILAÇÃO
```

**Solução**: Usar ternário.

```java
int i = b ? 1 : 0;  // ✅ OK
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Tipos Primitivos**: Base para conversões
- **Conversão Implícita**: Widening automático
- **Conversão Explícita**: Narrowing obrigatório
- **Operador de Casting**: Sintaxe `(tipo)`
- **Overflow**: Risco em narrowing
- **Truncamento**: Perda de parte fracionária

---

## 🚀 Boas Práticas

1. ✅ **Evite cast desnecessário em widening**
   ```java
   int i = 10;
   long l = i;  // ✅ Sem cast (desnecessário)
   ```

2. ✅ **Valide antes de narrowing**
   ```java
   if (valor >= Byte.MIN_VALUE && valor <= Byte.MAX_VALUE) {
       byte b = (byte) valor;
   }
   ```

3. ✅ **Use Math.round() para arredondar**
   ```java
   int arredondado = (int) Math.round(doubleValue);
   ```

4. ✅ **Prefira tipos maiores quando possível**
   ```java
   // ✅ Evita cast
   int soma = byte1 + byte2;
   
   // ❌ Requer cast
   byte soma = (byte)(byte1 + byte2);
   ```

5. ✅ **Documente casts não óbvios**
   ```java
   // Cast seguro: valor validado no range de byte
   byte b = (byte) valorValidado;
   ```

6. ❌ **Evite casts encadeados**
   ```java
   // ❌ Confuso
   byte b = (byte)(short)(int)(long) valor;
   
   // ✅ Claro
   byte b = (byte) valor;
   ```

7. ✅ **Use cast para forçar precisão em divisões**
   ```java
   double media = (double) soma / quantidade;  // ✅ Precisão
   ```
