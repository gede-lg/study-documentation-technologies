# Tipo Primitivo int: Tipo Padrão para Inteiros

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo **`int`** é o **tipo primitivo padrão para números inteiros** em Java, ocupando **32 bits (4 bytes)** de memória. Armazena valores inteiros **com sinal** na faixa de **-2,147,483,648 a 2,147,483,647** (-2³¹ a 2³¹-1).

Como **tipo padrão**, literais inteiros sem sufixo são automaticamente tratados como `int`, e operações aritméticas entre tipos menores (`byte`, `short`) promovem para `int`. É o tipo mais usado para contadores, índices, cálculos inteiros e variáveis gerais.

### Características Fundamentais

- **Tamanho**: 32 bits (4 bytes)
- **Faixa**: -2,147,483,648 a 2,147,483,647 (-2³¹ a 2³¹-1)
- **Valor padrão**: 0
- **Tipo padrão** para literais inteiros
- **Tipo nativo** de processadores modernos (32/64 bits)
- **Wrapper class**: `java.lang.Integer`

### Contexto Histórico

**32 bits como Padrão**:
- **Anos 1980-90**: Transição de 16 bits (8086) para 32 bits (Intel 386/1985)
- **Java (1995)**: Adotou 32 bits como padrão universal
- **Razão**: Suficiente para maioria dos casos (≈ ±2 bilhões)

**Tamanho Fixo Cross-Platform**:
- Diferente de C/C++ onde `int` varia (16/32/64 bits)
- **Java garante**: `int` é **sempre 32 bits** em qualquer plataforma

### Problema Fundamental que Resolve

#### Tipo Universal para Inteiros

**Sem Tipo Padrão** (hipotético):
```java
// Teria que especificar tipo sempre
byte contador = 0b;   // b = byte
short indice = 10s;   // s = short
long grande = 1000l;  // l = long
```

**Com int como Padrão**:
```java
int contador = 0;     // ✅ Simples
int indice = 10;      // ✅ Padrão
long grande = 1000L;  // L apenas para long
```

#### Faixa Adequada para Maioria dos Casos

**±2 bilhões** cobre:
- Contadores de loops
- Índices de arrays
- População de países
- Transações financeiras (quantidade de itens)
- Segundos em 68 anos

---

## 📋 Sumário Conceitual

### Pilares Fundamentais

**Declaração**:
```java
int idade = 30;
int populacao = 212_000_000;  // Underscores (Java 7+)
int negativo = -500;
int max = 2_147_483_647;      // Integer.MAX_VALUE
int min = -2_147_483_648;     // Integer.MIN_VALUE
```

**Literais São int por Padrão**:
```java
int a = 100;        // ✅ int literal
long b = 100;       // ✅ int promovido a long
byte c = 100;       // ✅ int (verificado caber em byte)
double d = 100;     // ✅ int promovido a double
```

**Operações Não Requerem Casting**:
```java
int x = 10, y = 20;
int soma = x + y;   // ✅ int + int = int
int mult = x * y;   // ✅ Sem casting necessário
```

---

## 🧠 Fundamentos Teóricos

### Representação Binária

**32 bits = 2³² = 4,294,967,296 valores**:
- **1 bit**: Sinal
- **31 bits**: Magnitude

**Exemplos**:
```
Decimal         | Binário (32 bits)                          | Hex
----------------|-------------------------------------------|----------
0               | 0000 0000 0000 0000 0000 0000 0000 0000   | 0x00000000
1               | 0000 0000 0000 0000 0000 0000 0000 0001   | 0x00000001
2,147,483,647   | 0111 1111 1111 1111 1111 1111 1111 1111   | 0x7FFFFFFF (MAX)
-1              | 1111 1111 1111 1111 1111 1111 1111 1111   | 0xFFFFFFFF
-2,147,483,648  | 1000 0000 0000 0000 0000 0000 0000 0000   | 0x80000000 (MIN)
```

### Faixa de Valores

**Cálculo**:
```
Negativos: -2³¹ = -2,147,483,648
Positivos: 2³¹ - 1 = 2,147,483,647
Total: 4,294,967,296 valores
```

**Memorização Prática**:
```
MAX ≈ +2.1 bilhões
MIN ≈ -2.1 bilhões
```

### Literais Inteiros

**Decimal** (padrão):
```java
int dec = 100;
```

**Hexadecimal** (prefixo `0x` ou `0X`):
```java
int hex = 0xFF;       // 255
int hex2 = 0x1A2B;    // 6699
```

**Octal** (prefixo `0`) - **Evitar**:
```java
int oct = 010;        // 8 (confuso!)
int oct2 = 0777;      // 511
```

**Binário** (prefixo `0b` ou `0B`, Java 7+):
```java
int bin = 0b1010;     // 10
int bin2 = 0b1111_0000; // 240 (com underscores)
```

**Underscores em Literais** (Java 7+):
```java
int milhao = 1_000_000;
int bits = 0b1111_1111_0000_0000;
int hex = 0xFF_EC_DE_5E;
```

### Overflow

**Overflow** (exceder MAX):
```java
int max = 2_147_483_647;
max++;  // Resultado: -2,147,483,648 (enrola para MIN)
```

**Underflow** (exceder MIN):
```java
int min = -2_147_483_648;
min--;  // Resultado: 2,147,483,647 (enrola para MAX)
```

**Exemplo Prático**:
```java
int contador = Integer.MAX_VALUE - 2;
for (int i = 0; i < 5; i++) {
    System.out.println(contador);
    contador++;
}
// Saída:
// 2147483645
// 2147483646
// 2147483647
// -2147483648  ← Overflow!
// -2147483647
```

**Detecção de Overflow** (Java 8+):
```java
try {
    int resultado = Math.addExact(Integer.MAX_VALUE, 1);  // Lança ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Overflow detectado!");
}

// Outros métodos: Math.subtractExact(), multiplyExact(), etc.
```

### Promoção Numérica

**int NÃO é Promovido** (diferente de byte/short):
```java
int a = 10, b = 20;
int soma = a + b;     // ✅ int + int = int (sem promoção)
```

**Tipos Menores Promovidos a int**:
```java
byte b1 = 10, b2 = 20;
int resultado = b1 + b2;  // ✅ byte + byte = int
```

### Conversão (Casting)

**Widening** (automático para tipos maiores):
```java
int i = 100;
long l = i;       // ✅ Automático
float f = i;      // ✅ Automático
double d = i;     // ✅ Automático
```

**Narrowing** (manual para tipos menores):
```java
int i = 200;
byte b = i;       // ❌ ERRO: narrowing requer casting
byte b = (byte) i; // ✅ OK (200 vira -56 por overflow)

short s = i;      // ❌ ERRO
short s = (short) i; // ✅ OK
```

---

## 🔍 Análise Conceitual Profunda

### Comparação com Outros Tipos Inteiros

| Tipo | Tamanho | Faixa | Quando Usar |
|------|---------|-------|-------------|
| **byte** | 1 byte | -128 a 127 | I/O, arrays grandes |
| **short** | 2 bytes | -32,768 a 32,767 | Raramente |
| **int** | **4 bytes** | **≈ ±2 bilhões** | **Tipo padrão** |
| **long** | 8 bytes | ≈ ±9 quintilhões | Timestamps, IDs grandes |

### Wrapper Class: Integer

**Métodos Principais**:
```java
// Parsing
int i = Integer.parseInt("123");
int hex = Integer.parseInt("FF", 16);       // 255
int bin = Integer.parseInt("1010", 2);      // 10

// Conversão
String str = Integer.toString(42);          // "42"
String hexStr = Integer.toHexString(255);   // "ff"
String binStr = Integer.toBinaryString(10); // "1010"

// Constantes
Integer.MIN_VALUE  // -2147483648
Integer.MAX_VALUE  // 2147483647
Integer.SIZE       // 32 (bits)
Integer.BYTES      // 4 (bytes)

// Operações
Integer.compare(10, 20);       // -1
Integer.max(10, 20);           // 20
Integer.min(10, 20);           // 10
Integer.sum(10, 20);           // 30
```

**Cache de Valores** (-128 a 127):
```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b);  // true (cache)

Integer c = 1000;
Integer d = 1000;
System.out.println(c == d);  // false (novos objetos)
System.out.println(c.equals(d));  // true (compara valor)
```

**Unsigned Operations** (Java 8+):
```java
int unsigned = Integer.parseUnsignedInt("3000000000");  // > Integer.MAX_VALUE
String unsignedStr = Integer.toUnsignedString(-1);      // "4294967295"

int comp = Integer.compareUnsigned(-1, 1);  // 1 (unsigned: -1 = 4294967295 > 1)
```

---

## 🎯 Aplicabilidade e Contextos

### Uso 1: Contadores e Loops

```java
for (int i = 0; i < 1000; i++) {  // int é tipo padrão
    // Processar
}

int contador = 0;
while (contador < 100) {
    contador++;
}
```

### Uso 2: Índices de Arrays/Collections

```java
int[] array = new int[100];
for (int i = 0; i < array.length; i++) {  // índice sempre int
    array[i] = i * 2;
}

List<String> lista = Arrays.asList("A", "B", "C");
for (int i = 0; i < lista.size(); i++) {
    System.out.println(lista.get(i));
}
```

### Uso 3: Cálculos Inteiros

```java
public class Calculadora {
    public int somar(int a, int b) {
        return a + b;
    }
    
    public int fatorial(int n) {
        if (n <= 1) return 1;
        
        int resultado = 1;
        for (int i = 2; i <= n; i++) {
            resultado *= i;
        }
        return resultado;
    }
}
```

### Uso 4: Representação de Valores Discretos

```java
public class Produto {
    private int quantidade;    // Quantidade de itens
    private int preco;         // Preço em centavos (evita float)
    
    public int getValorTotal() {
        return quantidade * preco;  // Cálculo em centavos
    }
    
    public double getValorTotalReais() {
        return getValorTotal() / 100.0;  // Converte para reais
    }
}
```

### Uso 5: Flags e Bitmasks (32 bits)

```java
public class Permissoes {
    private static final int LER     = 1 << 0;  // 0001
    private static final int ESCREVER = 1 << 1;  // 0010
    private static final int EXECUTAR = 1 << 2;  // 0100
    private static final int DELETAR  = 1 << 3;  // 1000
    
    private int flags;
    
    public void conceder(int permissao) {
        flags |= permissao;
    }
    
    public boolean tem(int permissao) {
        return (flags & permissao) != 0;
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Overflow em Cálculos

**Problema**: Multiplicação/potência pode exceder MAX.

```java
int milhao = 1_000_000;
int resultado = milhao * milhao;  // Overflow! Resultado incorreto
```

**Solução**: Usar `long` ou `BigInteger`.

```java
long resultado = (long) milhao * milhao;  // ✅ 1,000,000,000,000
BigInteger big = BigInteger.valueOf(milhao).pow(2);
```

### 2. Divisão Inteira

**Cuidado**: Divisão entre `int` resulta em `int` (trunca decimais).

```java
int a = 10, b = 3;
int resultado = a / b;  // 3 (não 3.333...)
```

**Solução**: Converter para `double`.

```java
double resultado = (double) a / b;  // 3.333...
```

### 3. Precisão para Valores Monetários

**Problema**: `int` não tem casas decimais.

**Opção 1**: Usar centavos (multiplicar por 100).

```java
int precoEmCentavos = 1999;  // R$ 19,99
```

**Opção 2**: Usar `BigDecimal` (preferível para dinheiro).

```java
BigDecimal preco = new BigDecimal("19.99");
```

---

## 🔗 Interconexões Conceituais

**Próximos Tipos**:
- **long**: Para valores que excedem ±2 bilhões (próximo arquivo)
- **float/double**: Para números decimais

**Relação com Outras Estruturas**:
- **Arrays**: `int[]`, índices sempre `int`
- **Collections**: `size()` retorna `int`
- **Streams**: `IntStream` para operações com `int`

---

## 🚀 Boas Práticas

1. ✅ **Usar `int` como padrão** para variáveis inteiras
2. ✅ **Não usar `byte`/`short`** a menos que economia de memória seja crítica
3. ✅ **Usar underscores** em literais grandes: `1_000_000`
4. ✅ **Detectar overflow** com `Math.*Exact()` (Java 8+)
5. ✅ **Validar faixa** antes de casting para tipos menores
6. ❌ **Evitar `new Integer()`** (deprecated - usar `Integer.valueOf()`)
7. ❌ **Evitar octal** (prefixo `0`) - confuso e propenso a erros
8. ✅ **Usar `BigDecimal`** para valores monetários (não `int` ou `double`)
