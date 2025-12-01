# Negação Aritmética (-)

## 🎯 Introdução e Definição

### Definição Conceitual

O **operador de negação aritmética (`-`)** é um operador unário que **inverte o sinal de um valor numérico**. Ele converte valores positivos em negativos e vice-versa, sem modificar a variável original.

**Sintaxe**:
```java
-expressao
```

**Características principais**:
- ✅ **Inverte sinal**: Positivo → Negativo, Negativo → Positivo
- ✅ **Não modifica variável**: Retorna novo valor, não altera original
- ✅ **Operador unário**: Opera sobre uma única expressão
- ✅ **Sem side effect**: Não modifica a variável (apenas retorna valor invertido)
- ⚠️ **Diferente de subtração**: `-x` é negação (unário), `a - b` é subtração (binário)

**Exemplo básico**:
```java
int x = 10;
int y = -x;  // y = -10 (negação de x)

System.out.println("x = " + x);  // x = 10 (não modificado)
System.out.println("y = " + y);  // y = -10
```

**Comparação: Negação vs Subtração**:
```java
// Negação unária (inverte sinal)
int a = 5;
int b = -a;  // b = -5 (negação)
System.out.println("a = " + a + ", b = " + b);  // a = 5, b = -5

// Subtração binária (operação entre dois valores)
int c = 10;
int d = 5;
int e = c - d;  // e = 5 (subtração)
System.out.println("c - d = " + e);  // 5
```

### Características Fundamentais

- 🔄 **Inversão de sinal**: `+n` torna-se `-n`, e `-n` torna-se `+n`
- 📋 **Retorna novo valor**: Não altera a variável original
- 🎯 **Aplicável a tipos numéricos**: int, long, float, double, byte, short
- ⚠️ **Promoção numérica**: Tipos menores que int são promovidos
- 💡 **Idempotência dupla**: `-(-x)` retorna `x` (dupla negação cancela)

---

## 📋 Sumário Conceitual

### Operação de Negação

```java
int x = 5;
int y = -x;

// Resultado:
// x permanece 5 (não modificado)
// y recebe -5 (sinal invertido)
```

**Tabela de inversão**:

| Valor Original | Negação (`-valor`) | Resultado |
|----------------|-------------------|-----------|
| `10` | `-10` | `-10` |
| `-5` | `-(-5)` | `5` |
| `0` | `-0` | `0` |
| `3.14` | `-3.14` | `-3.14` |
| `-2.5` | `-(-2.5)` | `2.5` |

---

## 🧠 Fundamentos Teóricos

### 1. Sintaxe e Uso Básico

**Negação de variável**:
```java
int numero = 10;
int negativo = -numero;

System.out.println("numero = " + numero);      // numero = 10
System.out.println("negativo = " + negativo);  // negativo = -10
```

**Negação de literal**:
```java
int a = -5;      // -5 (literal negativo)
int b = -(-5);   // 5 (dupla negação)
int c = -(10);   // -10 (negação de literal positivo)

System.out.println("a = " + a);  // a = -5
System.out.println("b = " + b);  // b = 5
System.out.println("c = " + c);  // c = -10
```

### 2. Negação em Expressões

**Uso em operações aritméticas**:
```java
int x = 10;
int resultado = -x + 20;
// 1. -x = -10
// 2. -10 + 20 = 10

System.out.println("resultado = " + resultado);  // resultado = 10
```

**Negação múltipla**:
```java
int a = 5, b = 3;
int soma = -a + -b;
// -a = -5
// -b = -3
// -5 + (-3) = -8

System.out.println("soma = " + soma);  // soma = -8
```

### 3. Dupla Negação

**Negação da negação**:
```java
int x = 10;
int y = -x;       // y = -10
int z = -y;       // z = -(-10) = 10

System.out.println("x = " + x);  // x = 10
System.out.println("y = " + y);  // y = -10
System.out.println("z = " + z);  // z = 10

// Direto
int valor = 5;
int dupla = -(-valor);  // 5
System.out.println("dupla = " + dupla);  // dupla = 5
```

### 4. Negação com Diferentes Tipos

**Tipos inteiros**:
```java
byte b = 10;
byte negB = (byte) -b;  // -10 (requer cast)

short s = 100;
short negS = (short) -s;  // -100 (requer cast)

int i = 1000;
int negI = -i;  // -1000

long l = 10000L;
long negL = -l;  // -10000
```

**Tipos de ponto flutuante**:
```java
float f = 3.14f;
float negF = -f;  // -3.14

double d = 2.718;
double negD = -d;  // -2.718
```

**Char (promovido para int)**:
```java
char c = 'A';  // 65 em Unicode
int negC = -c;  // -65
System.out.println("negC = " + negC);  // negC = -65
```

### 5. Negação de Zero

**Zero é neutro**:
```java
int zero = 0;
int negZero = -zero;

System.out.println("zero = " + zero);      // zero = 0
System.out.println("negZero = " + negZero);  // negZero = 0

// Zero positivo e negativo em ponto flutuante
double posZero = 0.0;
double negZeroDouble = -posZero;

System.out.println("posZero = " + posZero);          // 0.0
System.out.println("negZeroDouble = " + negZeroDouble);  // -0.0

// Comparação: são iguais
System.out.println(posZero == negZeroDouble);  // true
```

### 6. Promoção Numérica

**Tipos menores que int são promovidos**:
```java
byte b = 10;
// byte negB = -b;  // ❌ Erro! -b é int (promoção)
int negB = -b;      // ✅ OK: int

// Requer cast para byte
byte negByte = (byte) -b;  // ✅ OK com cast

short s = 100;
// short negS = -s;  // ❌ Erro! -s é int
int negS = -s;       // ✅ OK: int
```

### 7. Negação em Expressões Complexas

**Precedência de negação**:
```java
int x = 5;
int y = 3;

int resultado1 = -x * y;    // (-x) * y = -5 * 3 = -15
int resultado2 = -(x * y);  // -(x * y) = -(15) = -15

System.out.println("resultado1 = " + resultado1);  // -15
System.out.println("resultado2 = " + resultado2);  // -15

// Diferença com parênteses
int resultado3 = -x + y;    // -5 + 3 = -2
int resultado4 = -(x + y);  // -(5 + 3) = -8

System.out.println("resultado3 = " + resultado3);  // -2
System.out.println("resultado4 = " + resultado4);  // -8
```

### 8. Negação vs Subtração

**Negação (unário)**:
```java
int x = 10;
int neg = -x;  // Negação unária
System.out.println(neg);  // -10
```

**Subtração (binário)**:
```java
int a = 10;
int b = 5;
int sub = a - b;  // Subtração binária
System.out.println(sub);  // 5
```

**Combinação**:
```java
int valor = 10;
int resultado = 5 - -valor;  // 5 - (-10) = 5 + 10 = 15
System.out.println(resultado);  // 15
```

### 9. Negação com Overflow

**Limites de tipos**:
```java
// Maior negativo de int
int minInt = Integer.MIN_VALUE;  // -2147483648
int negMin = -minInt;            // 2147483648? NÃO! Overflow!
System.out.println(negMin);      // -2147483648 ⚠️ (overflow)

// Explicação: -(-2147483648) = 2147483648, mas max int = 2147483647
// Resultado: overflow para -2147483648 novamente

// Com long funciona
long minIntLong = Integer.MIN_VALUE;
long negMinLong = -minIntLong;  // 2147483648 (OK em long)
System.out.println(negMinLong);  // 2147483648
```

### 10. Negação em Métodos

**Retornar valor negado**:
```java
public class Matematica {
    public int negar(int valor) {
        return -valor;
    }
    
    public double valorAbsoluto(double num) {
        return (num < 0) ? -num : num;
    }
    
    public void exemplo() {
        System.out.println(negar(10));         // -10
        System.out.println(negar(-5));         // 5
        System.out.println(valorAbsoluto(-7.5));  // 7.5
        System.out.println(valorAbsoluto(3.2));   // 3.2
    }
}
```

---

## 🔍 Análise Conceitual Profunda

### Negação não Modifica Variável Original

**Importante**: Negação não altera a variável.
```java
int x = 10;
int y = -x;  // y = -10, mas x ainda é 10

System.out.println("x = " + x);  // x = 10 (não modificado)
System.out.println("y = " + y);  // y = -10

// Para modificar x:
x = -x;  // Agora x = -10
System.out.println("x após negação = " + x);  // x após negação = -10
```

### Diferença: Negação vs Subtração

**Operador `-` tem dois usos**:
```java
// 1. Negação unária (um operando)
int a = 10;
int negA = -a;  // Negação: -10

// 2. Subtração binária (dois operandos)
int b = 10;
int c = 5;
int diff = b - c;  // Subtração: 5

// Combinação
int x = 10;
int y = 5 - -x;  // 5 - (-10) = 5 + 10 = 15
System.out.println(y);  // 15
```

### Precedência de Negação

**Negação tem alta precedência**:
```java
int x = 5;
int resultado = -x + 3;  // (-x) + 3 = -5 + 3 = -2

// Negação avaliada antes de soma
System.out.println(resultado);  // -2

// Com parênteses
int resultado2 = -(x + 3);  // -(5 + 3) = -8
System.out.println(resultado2);  // -8
```

### Identidade Matemática

**Propriedades matemáticas**:
```java
int x = 5;

// Dupla negação = identidade
System.out.println(-(-x) == x);  // true

// Distributiva
int a = 3, b = 4;
System.out.println(-(a + b) == (-a) + (-b));  // true
// -(3 + 4) = -7
// (-3) + (-4) = -7
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Inversão de Sinal

```java
public class InversaoSinal {
    public void exemplo() {
        int temperatura = 25;
        int temperaturaInvertida = -temperatura;
        
        System.out.println("Temperatura: " + temperatura + "°C");
        System.out.println("Invertida: " + temperaturaInvertida + "°C");
    }
}
```

### Caso 2: Cálculo de Valor Absoluto

```java
public class ValorAbsoluto {
    public int abs(int valor) {
        return (valor < 0) ? -valor : valor;
    }
    
    public void exemplo() {
        System.out.println(abs(-10));  // 10
        System.out.println(abs(5));    // 5
        System.out.println(abs(0));    // 0
    }
}
```

### Caso 3: Conversão de Débito/Crédito

```java
public class Transacao {
    public double calcularSaldo(double credito, double debito) {
        return credito + (-debito);  // Débito como valor negativo
    }
    
    public void exemplo() {
        double saldo = calcularSaldo(1000.0, 250.0);
        System.out.println("Saldo: " + saldo);  // 750.0
    }
}
```

### Caso 4: Coordenadas Opostas

```java
public class Coordenada {
    private int x, y;
    
    public Coordenada getOposta() {
        return new Coordenada(-x, -y);
    }
    
    public Coordenada(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
    
    public void exemplo() {
        Coordenada p1 = new Coordenada(5, 3);
        Coordenada p2 = p1.getOposta();
        
        System.out.println("P1: " + p1);  // (5, 3)
        System.out.println("P2: " + p2);  // (-5, -3)
    }
}
```

### Caso 5: Diferença de Tempo

```java
public class Tempo {
    public int calcularDiferenca(int horaInicio, int horaFim) {
        int diferenca = horaFim - horaInicio;
        
        // Garantir valor positivo
        return (diferenca < 0) ? -diferenca : diferenca;
    }
    
    public void exemplo() {
        System.out.println(calcularDiferenca(10, 15));  // 5
        System.out.println(calcularDiferenca(15, 10));  // 5
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Overflow em Integer.MIN_VALUE

**Problema**: Negação do menor valor causa overflow.
```java
int minInt = Integer.MIN_VALUE;  // -2147483648
int negado = -minInt;            // -2147483648 ⚠️ (overflow!)

System.out.println(minInt);   // -2147483648
System.out.println(negado);   // -2147483648 (esperado: 2147483648)

// Solução: usar tipo maior
long negadoLong = -(long) minInt;  // 2147483648
System.out.println(negadoLong);    // 2147483648
```

### 2. Promoção Numérica

**Problema**: Tipos menores que int são promovidos.
```java
byte b = 10;
// byte negB = -b;  // ❌ Erro: incompatible types (int cannot be converted to byte)

// Solução: cast explícito
byte negB = (byte) -b;  // ✅ OK
System.out.println(negB);  // -10
```

### 3. Confusão com Subtração

**Problema**: Operador `-` tem duplo significado.
```java
int x = 10;

int a = -x;      // Negação unária: -10
int b = 5 - x;   // Subtração binária: -5
int c = 5 - -x;  // Subtração de negação: 5 - (-10) = 15

System.out.println("a = " + a);  // a = -10
System.out.println("b = " + b);  // b = -5
System.out.println("c = " + c);  // c = 15
```

### 4. Zero Negativo em Float/Double

**Problema**: `-0.0` existe em ponto flutuante.
```java
double posZero = 0.0;
double negZero = -0.0;

System.out.println(posZero == negZero);  // true (comparação)
System.out.println(1.0 / posZero);       // Infinity
System.out.println(1.0 / negZero);       // -Infinity ⚠️

// Verificar com Double.compare
System.out.println(Double.compare(posZero, negZero));  // 1 (diferentes)
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Subtração (-)**: Mesmo símbolo, mas operador binário
- **Operadores Aritméticos**: Parte das operações matemáticas
- **Valor Absoluto**: `Math.abs()` usa negação quando necessário
- **Expressões**: Negação retorna valor, não modifica variável
- **Promoção Numérica**: Tipos menores promovidos para int
- **Precedência de Operadores**: Alta precedência (avaliado cedo)
- **Overflow**: Cuidado com limites de tipos

---

## 🚀 Boas Práticas

1. ✅ **Use para inverter sinal sem modificar original**
   ```java
   int valor = 10;
   int oposto = -valor;  // ✅ Inversão sem modificar valor
   ```

2. ✅ **Use parênteses para clareza**
   ```java
   int resultado = -(x + y);  // ✅ Claro que nega a soma
   // vs
   int resultado = -x + y;    // Pode ser confuso
   ```

3. ✅ **Cuidado com overflow em Integer.MIN_VALUE**
   ```java
   int min = Integer.MIN_VALUE;
   long negado = -(long) min;  // ✅ Usa long para evitar overflow
   ```

4. ✅ **Use para implementar valor absoluto**
   ```java
   public int abs(int n) {
       return (n < 0) ? -n : n;  // ✅ Claro e eficiente
   }
   ```

5. ✅ **Documente dupla negação**
   ```java
   int x = -(-valor);  // Dupla negação = valor original
   ```

6. ✅ **Prefira Math.abs() quando disponível**
   ```java
   // ❌ Manual
   int abs = (x < 0) ? -x : x;
   
   // ✅ Mais claro
   int abs = Math.abs(x);
   ```

7. ✅ **Cast explícito para tipos menores**
   ```java
   byte b = 10;
   byte negB = (byte) -b;  // ✅ Cast explícito
   ```

8. ✅ **Evite múltiplas negações na mesma expressão**
   ```java
   // ❌ Confuso
   int r = -a + -b - -c;
   
   // ✅ Mais claro
   int r = (-a) + (-b) - (-c);
   ```

9. ✅ **Use em coordenadas e vetores**
   ```java
   Ponto oposto = new Ponto(-x, -y);  // ✅ Inversão de coordenadas
   ```

10. ✅ **Combine com operador ternário para abs**
    ```java
    int absoluto = (n < 0) ? -n : n;  // ✅ Idioma comum
    ```
