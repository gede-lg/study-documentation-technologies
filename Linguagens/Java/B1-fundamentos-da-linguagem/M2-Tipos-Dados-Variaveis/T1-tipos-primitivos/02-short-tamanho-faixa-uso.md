# Tipo Primitivo short: Tamanho, Faixa de Valores e Uso

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo **`short`** é um **tipo inteiro de tamanho intermediário** em Java, ocupando **16 bits (2 bytes)** de memória. É um tipo primitivo que armazena números inteiros **com sinal** na faixa de **-32,768 a 32,767** (-2¹⁵ a 2¹⁵-1).

O `short` oferece **compromisso entre economia de memória** (`byte` usa apenas 1 byte) e **faixa de valores** (`int` tem faixa muito maior), sendo útil em arrays grandes onde `byte` é insuficiente mas `int` desperdiçaria memória.

### Características Fundamentais

- **Tamanho**: 16 bits (2 bytes)
- **Faixa**: -32,768 a 32,767 (-2¹⁵ a 2¹⁵-1)
- **Valor padrão**: 0
- **Tipo numérico inteiro** com sinal (complemento de dois)
- **Wrapper class**: `java.lang.Short`

### Contexto Histórico

**Origem**: Tamanho de palavra (word) em arquiteturas antigas
- **16 bits** era tamanho comum de registradores/barramentos nos anos 1970-80
- Processadores Intel 8086 (1978): registradores de 16 bits
- Java (1995) incluiu `short` por compatibilidade com essas arquiteturas

**Declínio de Uso**:
- Processadores modernos (32/64 bits) operam nativamente com `int`/`long`
- `short` raramente traz benefício de performance hoje
- **Uso primário**: economia de memória em estruturas grandes

### Problema Fundamental que Resolve

#### Economia de Memória em Arrays Médios

**Cenário**: Armazenar 10 milhões de números na faixa -20,000 a +20,000.

**Opção 1: byte** (1 byte):
❌ Insuficiente - faixa máxima -128 a 127

**Opção 2: int** (4 bytes):
```java
int[] dados = new int[10_000_000];  // 10M × 4 bytes = 40 MB
```

**Opção 3: short** (2 bytes):
```java
short[] dados = new short[10_000_000];  // 10M × 2 bytes = 20 MB
```

**Economia**: **50% de memória** vs `int`.

---

## 📋 Sumário Conceitual

### Pilares Fundamentais

**Declaração e Inicialização**:
```java
short idade = 25;
short temperatura = -15;
short max = 32767;      // Máximo
short min = -32768;     // Mínimo
```

**Literal Fora da Faixa**:
```java
short s = 50000;        // ❌ ERRO: 50000 > 32767
short s = (short) 50000; // ✅ OK (overflow: vira -15536)
```

**Promoção a int em Expressões**:
```java
short a = 100;
short b = 200;
short soma = a + b;     // ❌ ERRO: a + b promovido a int
short soma = (short) (a + b); // ✅ OK
```

---

## 🧠 Fundamentos Teóricos

### Representação Binária

**16 bits = 2¹⁶ = 65,536 valores possíveis**:
- **Bit mais significativo**: Sinal
- **15 bits restantes**: Magnitude

**Exemplos**:
```
Decimal   | Binário (16 bits)      | Hexadecimal
----------|------------------------|-------------
    0     | 0000 0000 0000 0000    | 0x0000
    1     | 0000 0000 0000 0001    | 0x0001
32767     | 0111 1111 1111 1111    | 0x7FFF (max)
   -1     | 1111 1111 1111 1111    | 0xFFFF
-32768    | 1000 0000 0000 0000    | 0x8000 (min)
```

### Faixa de Valores

**Cálculo**:
- **Negativos**: -2¹⁵ = -32,768
- **Positivos**: 2¹⁵ - 1 = 32,767
- **Total**: 65,536 valores

**Comparação com byte**:
```
byte:  -128 a +127       (256 valores)
short: -32,768 a +32,767 (65,536 valores - 256× mais que byte)
int:   ≈ -2 bilhões a +2 bilhões
```

### Overflow

```java
short s = 32767;
s++;  // Resultado: -32768 (overflow)

short s2 = -32768;
s2--;  // Resultado: 32767 (underflow)
```

### Promoção Numérica

**Regra**: `short` é promovido a `int` em expressões.

```java
short x = 10;
short y = 20;

int resultado = x + y;      // ✅ OK
short resultado = x + y;    // ❌ ERRO
short resultado = (short) (x + y); // ✅ OK
```

**Razão**: CPU moderna opera com 32 bits nativamente - promover para `int` evita overflow em cálculos intermediários.

### Conversão (Casting)

**Widening** (automático):
```java
short s = 1000;
int i = s;       // ✅ Automático
long l = s;      // ✅ Automático
double d = s;    // ✅ Automático
```

**Narrowing** (manual):
```java
int i = 40000;
short s = i;      // ❌ ERRO
short s = (short) i; // ✅ OK (overflow: 40000 vira -25536)
```

**Literal dentro da faixa**:
```java
short s = 30000;  // ✅ OK (compilador verifica)
short s = 40000;  // ❌ ERRO (fora da faixa)
```

---

## 🔍 Análise Conceitual Profunda

### Comparação: byte vs short vs int

| Aspecto | byte | short | int |
|---------|------|-------|-----|
| **Tamanho** | 1 byte | **2 bytes** | 4 bytes |
| **Faixa** | -128 a 127 | **-32,768 a 32,767** | ≈ -2 bilhões a +2 bilhões |
| **Casos de Uso** | I/O binário, pixels | Arrays médios | **Tipo padrão** para inteiros |
| **Promoção** | Promovido a int | Promovido a int | N/A |

### Wrapper Class: Short

**Métodos Principais**:
```java
// Parsing
short s = Short.parseShort("1000");
short s2 = Short.parseShort("3E8", 16);  // Hexadecimal: 0x3E8 = 1000

// Constantes
Short.MIN_VALUE  // -32768
Short.MAX_VALUE  // 32767
Short.SIZE       // 16 (bits)
Short.BYTES      // 2 (bytes)

// Conversão
String str = Short.toString((short) 500);

// Comparação
Short.compare((short) 100, (short) 200);  // -1
```

**Cache** (-128 a 127):
```java
Short s1 = 100;
Short s2 = 100;
System.out.println(s1 == s2);  // true (cache)

Short s3 = 1000;
Short s4 = 1000;
System.out.println(s3 == s4);  // false (fora do cache)
```

---

## 🎯 Aplicabilidade e Contextos

### Uso 1: Audio PCM (Pulse Code Modulation)

**Áudio 16-bit**:
```java
public class AudioBuffer {
    private short[] samples;  // Amostras de áudio (-32768 a +32767)
    
    public AudioBuffer(int numSamples) {
        samples = new short[numSamples];
    }
    
    public void setSample(int index, short valor) {
        samples[index] = valor;  // -32768 a +32767 representa amplitude
    }
    
    public short getSample(int index) {
        return samples[index];
    }
}
```

### Uso 2: Coordenadas em Grade Limitada

```java
public class Coordenada {
    private short x, y;  // Faixa: -32768 a +32767
    
    public Coordenada(short x, short y) {
        this.x = x;
        this.y = y;
    }
    
    public double distancia(Coordenada outra) {
        int dx = this.x - outra.x;  // Promovido a int
        int dy = this.y - outra.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
```

### Uso 3: Leitura de Dados Binários

```java
public class LeitorBinario {
    public static short lerShort(InputStream is) throws IOException {
        int byteAlto = is.read();  // 8 bits mais significativos
        int byteBaixo = is.read(); // 8 bits menos significativos
        
        // Combinar bytes (big-endian)
        return (short) ((byteAlto << 8) | byteBaixo);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Faixa Ainda Limitada

**Problema**: 32,767 pode ser insuficiente.

```java
short populacao = 50000;  // ❌ ERRO: 50000 > 32767
```

**Solução**: Usar `int` se faixa for insuficiente.

### 2. Raridade de Uso Moderno

**Realidade**: `short` é **raramente usado** em código moderno Java.

**Motivos**:
- Memória é abundante (GBs disponíveis)
- `int` é tipo padrão - menos castings
- Benefício marginal de economia de 2 bytes

**Quando Realmente Usar**:
✅ Arrays **muito grandes** (milhões de elementos)
✅ Interoperabilidade com **formatos binários** (audio, protocolos)
✅ APIs legadas que exigem `short`

### 3. Promoção Constante

```java
short a = 100, b = 200;
short soma = (short) (a + b);  // Casting sempre necessário
```

**Alternativa**: Usar `int` diretamente para variáveis temporárias.

---

## 🔗 Interconexões Conceituais

**Próximos Tipos**:
- **int**: Tipo padrão para inteiros (próximo arquivo)
- **long**: Para valores muito grandes

**Uso Conjunto**:
```java
byte pequeno = 100;    // 1 byte
short medio = 20000;   // 2 bytes
int grande = 2000000;  // 4 bytes
```

---

## 🚀 Boas Práticas

1. ✅ Usar `short` **apenas em arrays grandes** onde memória é crítica
2. ✅ Usar `short` em **formatos binários específicos** (audio PCM, protocolos)
3. ❌ **Evitar `short`** para variáveis locais/contadores (preferir `int`)
4. ❌ Evitar `new Short()` (deprecated - usar `Short.valueOf()`)
5. ✅ Preferir `int` como **tipo padrão** - menos conversões, código mais limpo
