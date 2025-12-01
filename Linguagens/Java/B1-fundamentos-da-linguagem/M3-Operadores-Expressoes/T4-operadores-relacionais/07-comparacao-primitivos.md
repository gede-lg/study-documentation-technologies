# Comparação de Tipos Primitivos

## 🎯 Introdução e Definição

### Definição Conceitual

A **comparação de tipos primitivos** em Java envolve o uso de **operadores relacionais** (`==`, `!=`, `>`, `<`, `>=`, `<=`) para comparar valores de tipos primitivos (`byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`). Essas comparações retornam valores `boolean` e utilizam **conversão automática de tipos** quando necessário.

**Características principais**:
- ✅ **Compara valores**: Operadores comparam o **valor armazenado**, não referências
- ✅ **Conversão implícita**: Java promove tipos menores para maiores automaticamente
- ✅ **Resultado boolean**: Todas as comparações retornam `true` ou `false`
- ⚠️ **Imprecisão em ponto flutuante**: `float` e `double` podem ter erros de arredondamento
- 📋 **Compatibilidade entre tipos**: Tipos numéricos podem ser comparados entre si

**Exemplo básico**:
```java
// Comparação de int
int a = 10;
int b = 5;
System.out.println(a > b);  // true

// Comparação de double
double x = 3.14;
double y = 2.71;
System.out.println(x == y);  // false

// Comparação de char
char c1 = 'A';
char c2 = 'B';
System.out.println(c1 < c2);  // true

// Comparação de boolean
boolean flag1 = true;
boolean flag2 = false;
System.out.println(flag1 == flag2);  // false
```

### Características Fundamentais

- 🔍 **Comparação por valor**: Compara conteúdo, não referência
- 📊 **Promoção numérica**: Tipos são promovidos para tipo comum
- 🎯 **char como número**: `char` é comparado pelo código Unicode
- ⚠️ **boolean especial**: Apenas `==` e `!=` aplicáveis
- 💡 **Conversão automática**: Java converte tipos automaticamente

---

## 📋 Sumário Conceitual

### Tabela de Operadores Relacionais

| Operador | Descrição | Exemplo | Resultado |
|----------|-----------|---------|-----------|
| `==` | Igual a | `5 == 5` | `true` |
| `!=` | Diferente de | `5 != 3` | `true` |
| `>` | Maior que | `10 > 5` | `true` |
| `<` | Menor que | `5 < 10` | `true` |
| `>=` | Maior ou igual | `10 >= 10` | `true` |
| `<=` | Menor ou igual | `5 <= 10` | `true` |

### Tipos Primitivos Comparáveis

| Tipo | Comparação | Operadores Suportados |
|------|------------|----------------------|
| **byte, short, int, long** | Numérica | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **float, double** | Numérica (ponto flutuante) | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **char** | Código Unicode (numérica) | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| **boolean** | Lógica | `==`, `!=` |

---

## 🧠 Fundamentos Teóricos

### 1. Comparação de Tipos Inteiros

**Comparação de int**:
```java
int a = 10;
int b = 5;

System.out.println(a == b);  // false
System.out.println(a != b);  // true
System.out.println(a > b);   // true
System.out.println(a < b);   // false
System.out.println(a >= b);  // true
System.out.println(a <= b);  // false
```

**Comparação de byte, short, long**:
```java
byte b = 10;
short s = 10;
int i = 10;
long l = 10L;

System.out.println(b == s);  // true
System.out.println(s == i);  // true
System.out.println(i == l);  // true
```

### 2. Comparação de Tipos em Ponto Flutuante

**Comparação de double**:
```java
double x = 3.14;
double y = 2.71;

System.out.println(x == y);  // false
System.out.println(x > y);   // true
System.out.println(x < y);   // false
```

**Comparação de float**:
```java
float a = 5.5f;
float b = 5.5f;

System.out.println(a == b);  // true
```

**Problema de imprecisão**:
```java
double resultado = 0.1 + 0.2;
double esperado = 0.3;

System.out.println(resultado);  // 0.30000000000000004
System.out.println(resultado == esperado);  // false (imprecisão!)

// Solução: usar epsilon
double epsilon = 0.00001;
System.out.println(Math.abs(resultado - esperado) < epsilon);  // true
```

### 3. Comparação de char

**Comparação por código Unicode**:
```java
char c1 = 'A';  // Unicode 65
char c2 = 'B';  // Unicode 66

System.out.println(c1 == c2);  // false
System.out.println(c1 < c2);   // true (65 < 66)
System.out.println(c1 > c2);   // false
```

**Maiúsculas vs Minúsculas**:
```java
char maiuscula = 'A';  // 65
char minuscula = 'a';  // 97

System.out.println(maiuscula == minuscula);  // false
System.out.println(maiuscula < minuscula);   // true (65 < 97)
```

**Comparação com número**:
```java
char letra = 'A';  // 65
int numero = 65;

System.out.println(letra == numero);  // true (char promovido para int)
```

### 4. Comparação de boolean

**Apenas == e !=**:
```java
boolean flag1 = true;
boolean flag2 = false;

System.out.println(flag1 == flag2);  // false
System.out.println(flag1 != flag2);  // true

// ❌ ERRO: operadores >, <, >=, <= não funcionam com boolean
// System.out.println(flag1 > flag2);  // Erro de compilação
```

**Comparação redundante (evitar)**:
```java
boolean ativo = true;

// ❌ Redundante
if (ativo == true) {
    System.out.println("Ativo");
}

// ✅ Idiomático
if (ativo) {
    System.out.println("Ativo");
}
```

### 5. Conversão Implícita entre Tipos

**Promoção numérica**:
```java
byte b = 10;
short s = 20;
int i = 30;
long l = 40L;
float f = 50.0f;
double d = 60.0;

// Java promove para o tipo "maior"
System.out.println(b == s);  // true (ambos promovidos para int)
System.out.println(i == l);  // true (i promovido para long)
System.out.println(l == f);  // true (l promovido para float)
System.out.println(f == d);  // true (f promovido para double)
```

**Hierarquia de promoção**:
```
byte → short → int → long → float → double
       char  ↗
```

**Exemplo de conversão**:
```java
int x = 10;
double y = 10.0;

System.out.println(x == y);  // true (x convertido para 10.0)
```

### 6. Comparação de Tipos Mistos

**int e double**:
```java
int inteiro = 10;
double pontoFlutuante = 10.0;

System.out.println(inteiro == pontoFlutuante);  // true (int → double)
```

**char e int**:
```java
char c = 'A';  // 65
int n = 65;

System.out.println(c == n);  // true (char → int)
```

**byte e long**:
```java
byte pequeno = 5;
long grande = 5L;

System.out.println(pequeno == grande);  // true (byte → long)
```

### 7. Comparação em Expressões

**Comparação de resultados de expressões**:
```java
int a = 10;
int b = 5;

System.out.println((a + b) == 15);  // true
System.out.println((a * 2) > (b + 10));  // true (20 > 15)
```

**Precedência de operadores**:
```java
int x = 5;

// Aritmética avaliada ANTES de comparação
boolean resultado = x + 5 == 10;  // (x + 5) == 10 → true
System.out.println(resultado);  // true
```

### 8. Valores Especiais de Ponto Flutuante

**NaN (Not a Number)**:
```java
double nan = Double.NaN;

System.out.println(nan == nan);  // false (NaN nunca é igual a nada!)
System.out.println(nan != nan);  // true

// Solução: usar Double.isNaN()
System.out.println(Double.isNaN(nan));  // true
```

**Infinito**:
```java
double positiveInfinity = Double.POSITIVE_INFINITY;
double negativeInfinity = Double.NEGATIVE_INFINITY;

System.out.println(positiveInfinity == positiveInfinity);  // true
System.out.println(positiveInfinity > 1000000);  // true
System.out.println(negativeInfinity < -1000000);  // true
```

**Zero positivo e negativo**:
```java
double zeroPositivo = 0.0;
double zeroNegativo = -0.0;

System.out.println(zeroPositivo == zeroNegativo);  // true (são considerados iguais)
```

### 9. Overflow e Underflow

**Overflow em int**:
```java
int max = Integer.MAX_VALUE;  // 2147483647
int overflow = max + 1;

System.out.println(overflow);  // -2147483648 (overflow!)
System.out.println(overflow > max);  // false (inesperado!)
```

**Underflow em int**:
```java
int min = Integer.MIN_VALUE;  // -2147483648
int underflow = min - 1;

System.out.println(underflow);  // 2147483647 (underflow!)
System.out.println(underflow < min);  // false (inesperado!)
```

### 10. Comparação de Constantes

**Valores literais**:
```java
System.out.println(5 == 5);    // true
System.out.println(3.14 > 2.71);  // true
System.out.println('A' < 'Z');   // true
System.out.println(true == false);  // false
```

**Constantes nomeadas**:
```java
final int MAXIMO = 100;
int valor = 50;

if (valor < MAXIMO) {
    System.out.println("Abaixo do máximo");
}
```

---

## 🔍 Análise Conceitual Profunda

### Comparação por Valor vs Referência

**Tipos primitivos: comparação por valor**:
```java
int a = 10;
int b = 10;

System.out.println(a == b);  // true (compara valores)
```

**Objetos: comparação por referência (não primitivos)**:
```java
Integer x = new Integer(10);
Integer y = new Integer(10);

System.out.println(x == y);  // false (compara referências, não valores)
System.out.println(x.equals(y));  // true (compara valores)
```

### Promoção Numérica Detalhada

**Regras de promoção**:
1. Se um operando é `double`, o outro é convertido para `double`
2. Senão, se um operando é `float`, o outro é convertido para `float`
3. Senão, se um operando é `long`, o outro é convertido para `long`
4. Senão, ambos são convertidos para `int`

**Exemplos**:
```java
byte b = 5;
short s = 10;
int i = 15;
long l = 20L;
float f = 25.0f;
double d = 30.0;

// byte + short → int
System.out.println(b == s);  // Ambos promovidos para int

// int + long → long
System.out.println(i == l);  // int promovido para long

// long + float → float
System.out.println(l == f);  // long promovido para float

// float + double → double
System.out.println(f == d);  // float promovido para double
```

### Tabela de Conversões Automáticas

| Operando 1 | Operando 2 | Tipo Resultante |
|------------|------------|-----------------|
| `byte` | `byte` | `int` |
| `byte` | `short` | `int` |
| `byte` | `int` | `int` |
| `byte` | `long` | `long` |
| `int` | `double` | `double` |
| `char` | `int` | `int` |
| `float` | `double` | `double` |

### Imprecisão em Ponto Flutuante

**Por que ocorre?**:
```java
// Representação binária limitada causa imprecisão
double a = 0.1;  // Não pode ser representado exatamente em binário
double b = 0.2;  // Não pode ser representado exatamente em binário
double soma = a + b;  // 0.30000000000000004

System.out.println(soma == 0.3);  // false
```

**Solução: epsilon**:
```java
double epsilon = 0.00001;
double diferenca = Math.abs(soma - 0.3);

if (diferenca < epsilon) {
    System.out.println("São considerados iguais");
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Intervalo

```java
public class ValidadorIntervalo {
    public boolean estaNoIntervalo(int valor, int min, int max) {
        return valor >= min && valor <= max;
    }
    
    public void exemplo() {
        System.out.println(estaNoIntervalo(5, 1, 10));   // true
        System.out.println(estaNoIntervalo(15, 1, 10));  // false
    }
}
```

### Caso 2: Comparação de Notas

```java
public class SistemaNotas {
    public String avaliar(double nota) {
        if (nota >= 9.0) {
            return "A";
        } else if (nota >= 7.0) {
            return "B";
        } else if (nota >= 5.0) {
            return "C";
        } else {
            return "F";
        }
    }
}
```

### Caso 3: Comparação de Caracteres

```java
public class ValidadorCaractere {
    public boolean isLetraMaiuscula(char c) {
        return c >= 'A' && c <= 'Z';
    }
    
    public boolean isLetraMinuscula(char c) {
        return c >= 'a' && c <= 'z';
    }
    
    public boolean isDigito(char c) {
        return c >= '0' && c <= '9';
    }
}
```

### Caso 4: Encontrar Máximo e Mínimo

```java
public class Matematica {
    public int max(int a, int b) {
        return (a > b) ? a : b;
    }
    
    public int min(int a, int b) {
        return (a < b) ? a : b;
    }
    
    public int maxArray(int[] array) {
        int max = array[0];
        for (int num : array) {
            if (num > max) {
                max = num;
            }
        }
        return max;
    }
}
```

### Caso 5: Comparação com Epsilon

```java
public class ComparadorDouble {
    private static final double EPSILON = 0.00001;
    
    public boolean iguais(double a, double b) {
        return Math.abs(a - b) < EPSILON;
    }
    
    public void exemplo() {
        double x = 0.1 + 0.2;
        double y = 0.3;
        
        System.out.println(x == y);  // false
        System.out.println(iguais(x, y));  // true
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Imprecisão de Ponto Flutuante

**Problema**: Erros de arredondamento.
```java
double a = 0.1 + 0.2;
System.out.println(a == 0.3);  // ❌ false

// ✅ Solução: epsilon
double epsilon = 0.00001;
System.out.println(Math.abs(a - 0.3) < epsilon);  // true
```

### 2. NaN é Especial

**Problema**: NaN não é igual a nada, nem a si mesmo.
```java
double nan = Double.NaN;
System.out.println(nan == nan);  // ❌ false

// ✅ Solução: usar Double.isNaN()
System.out.println(Double.isNaN(nan));  // true
```

### 3. Overflow/Underflow não Lança Exceção

**Problema**: Java não detecta overflow automaticamente.
```java
int max = Integer.MAX_VALUE;
int overflow = max + 1;

System.out.println(overflow < max);  // ❌ true (inesperado!)

// ✅ Solução: usar Math.addExact() (Java 8+)
try {
    int resultado = Math.addExact(max, 1);
} catch (ArithmeticException e) {
    System.out.println("Overflow detectado!");
}
```

### 4. Comparação de boolean com Operadores Numéricos

**Problema**: Operadores >, <, >=, <= não funcionam com boolean.
```java
boolean a = true;
boolean b = false;

// ❌ ERRO: bad operand types
// if (a > b) { }

// ✅ Solução: usar == ou !=
if (a != b) {
    System.out.println("Diferentes");
}
```

### 5. Conversão Implícita Pode Surpreender

**Problema**: char convertido para int pode ser inesperado.
```java
char c = 'A';  // 65

if (c == 65) {  // Compara com int
    System.out.println("A é 65");  // Executa
}

// Pode ser confuso se não souber que char é numérico
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Operadores Relacionais**: `==`, `!=`, `>`, `<`, `>=`, `<=`
- **Conversão de Tipos**: Promoção numérica automática
- **Tipos Primitivos**: byte, short, int, long, float, double, char, boolean
- **Wrapper Classes**: Integer, Double, Character, Boolean
- **Comparação de Objetos**: `.equals()`, `.compareTo()`
- **Precedência de Operadores**: Ordem de avaliação
- **Overflow/Underflow**: Limites de tipos numéricos
- **Valores Especiais**: NaN, Infinity, -0.0

---

## 🚀 Boas Práticas

1. ✅ **Use epsilon para comparação de doubles**
   ```java
   double epsilon = 0.00001;
   if (Math.abs(a - b) < epsilon) {  // ✅ Correto
       // Considera iguais
   }
   ```

2. ✅ **Use Double.isNaN() para verificar NaN**
   ```java
   if (Double.isNaN(valor)) {  // ✅ Correto
       System.out.println("Não é um número");
   }
   ```

3. ✅ **Use constantes para valores mágicos**
   ```java
   private static final int IDADE_MINIMA = 18;
   if (idade >= IDADE_MINIMA) {  // ✅ Legível
       // ...
   }
   ```

4. ✅ **Evite comparação direta de floats/doubles**
   ```java
   // ❌ Evitar
   if (valor == 3.14) { }
   
   // ✅ Usar epsilon
   if (Math.abs(valor - 3.14) < 0.001) { }
   ```

5. ✅ **Use Math.addExact() para detectar overflow**
   ```java
   try {
       int resultado = Math.addExact(a, b);  // ✅ Detecta overflow
   } catch (ArithmeticException e) {
       // Trata overflow
   }
   ```

6. ✅ **Prefira comparação idiomática de boolean**
   ```java
   // ❌ Redundante
   if (flag == true) { }
   
   // ✅ Idiomático
   if (flag) { }
   ```

7. ✅ **Use parênteses para clareza**
   ```java
   if ((a + b) == (c * d)) {  // ✅ Claro
       // ...
   }
   ```

8. ✅ **Documente comparações de char como números**
   ```java
   // Verifica se é letra maiúscula (A=65 até Z=90)
   if (c >= 'A' && c <= 'Z') {  // ✅ Comentário ajuda
       // ...
   }
   ```

9. ✅ **Use compareTo() para ordenação**
   ```java
   // Para ordenar de forma consistente
   Arrays.sort(array, (a, b) -> Integer.compare(a, b));
   ```

10. ✅ **Prefira tipos primitivos para performance**
    ```java
    // ✅ Mais rápido
    int a = 10;
    int b = 5;
    boolean resultado = a > b;
    
    // ❌ Mais lento (boxing/unboxing)
    Integer x = 10;
    Integer y = 5;
    boolean r = x > y;  // Unboxing automático
    ```
