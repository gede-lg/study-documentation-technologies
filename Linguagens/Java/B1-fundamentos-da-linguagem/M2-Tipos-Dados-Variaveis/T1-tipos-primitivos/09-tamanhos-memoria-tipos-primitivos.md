# Tamanhos de Memória dos Tipos Primitivos

## 🎯 Introdução e Definição

### Definição Conceitual

**Tipos primitivos** em Java possuem **tamanhos fixos e independentes de plataforma**, garantindo portabilidade total do código. Diferente de linguagens como C/C++ (onde `int` pode ter 16, 32 ou 64 bits dependendo da arquitetura), Java define **precisamente o tamanho de cada tipo primitivo**, assegurando que um programa compilado funcione identicamente em qualquer sistema.

Esta característica é fundamental para:
- **Portabilidade**: Código funciona igual em Windows, Linux, Mac, etc.
- **Previsibilidade**: Desenvolvedores sabem exatamente a capacidade de cada tipo
- **Compatibilidade**: Dados serializados podem ser compartilhados entre plataformas

### Contexto Histórico

**Java (1995) - "Write Once, Run Anywhere"**:
- Decisão de design: **tamanhos fixos cross-platform**
- Contraste com C/C++:
  - C: `int` varia de 16 a 64 bits dependendo da plataforma
  - Java: `int` é **sempre 32 bits**

**Razão**: Aplicações Java devem produzir resultados idênticos em qualquer dispositivo (servidores, desktops, dispositivos embarcados).

### Problema Fundamental que Resolve

#### Inconsistência de Tamanhos entre Plataformas

**C/C++ (problemático)**:
```c
// Em sistema 16-bit: sizeof(int) = 2 bytes
// Em sistema 32-bit: sizeof(int) = 4 bytes
// Em sistema 64-bit: sizeof(int) = 4 ou 8 bytes
int valor = 70000;  // ❌ Overflow em 16-bit, OK em 32/64-bit
```

**Java (consistente)**:
```java
// Em QUALQUER plataforma: int = 4 bytes
int valor = 70000;  // ✅ SEMPRE funciona (dentro da faixa de int)
```

#### Serialização Cross-Platform

**Problema**: Dados gravados em uma plataforma devem ser lidos em outra.

**Solução Java**:
```java
// Dados serializados em Windows (32-bit)
ObjectOutputStream out = new ObjectOutputStream(file);
out.writeInt(123456);  // Sempre 4 bytes

// Dados lidos em Linux (64-bit)
ObjectInputStream in = new ObjectInputStream(file);
int valor = in.readInt();  // ✅ Sempre lê 4 bytes corretamente
```

---

## 📋 Sumário Conceitual

### Tabela de Tamanhos

| Tipo | Tamanho (bits) | Tamanho (bytes) | Faixa de Valores |
|------|----------------|-----------------|-------------------|
| **byte** | 8 | 1 | -128 a 127 |
| **short** | 16 | 2 | -32,768 a 32,767 |
| **int** | 32 | 4 | ≈ ±2.1 bilhões (-2³¹ a 2³¹-1) |
| **long** | 64 | 8 | ≈ ±9.2 quintilhões (-2⁶³ a 2⁶³-1) |
| **float** | 32 | 4 | ≈ ±3.4 × 10³⁸ (~6-7 dígitos) |
| **double** | 64 | 8 | ≈ ±1.7 × 10³⁰⁸ (~15-16 dígitos) |
| **char** | 16 | 2 | 0 a 65,535 (Unicode UTF-16) |
| **boolean** | 1 (teórico) | 1 (prática) | true ou false |

### Relações de Tamanho

**1 byte = 8 bits**

```
byte    [1 byte]   ●
short   [2 bytes]  ● ●
int     [4 bytes]  ● ● ● ●
long    [8 bytes]  ● ● ● ● ● ● ● ●
float   [4 bytes]  ● ● ● ●
double  [8 bytes]  ● ● ● ● ● ● ● ●
char    [2 bytes]  ● ●
boolean [1 byte]   ●
```

---

## 🧠 Fundamentos Teóricos

### Cálculo de Faixa de Valores

**Tipos Inteiros com Sinal** (complemento de 2):
```
Faixa = -2^(n-1) a 2^(n-1) - 1
onde n = número de bits
```

**Exemplos**:
```
byte  (8 bits):  -2^7  a 2^7-1  = -128 a 127
short (16 bits): -2^15 a 2^15-1 = -32,768 a 32,767
int   (32 bits): -2^31 a 2^31-1 = -2,147,483,648 a 2,147,483,647
long  (64 bits): -2^63 a 2^63-1 = -9,223,372,036,854,775,808 a 9,223,372,036,854,775,807
```

**Tipo Unsigned** (apenas char):
```
char (16 bits): 0 a 2^16-1 = 0 a 65,535
```

### Tipos de Ponto Flutuante (IEEE 754)

**float (32 bits)**:
```
| Sinal (1 bit) | Expoente (8 bits) | Mantissa (23 bits) |
```

**double (64 bits)**:
```
| Sinal (1 bit) | Expoente (11 bits) | Mantissa (52 bits) |
```

**Comparação de Precisão**:
- **float**: 2²³ ≈ 8.3 milhões de valores → **~6-7 dígitos decimais**
- **double**: 2⁵² ≈ 4.5 × 10¹⁵ valores → **~15-16 dígitos decimais**

### boolean: Caso Especial

**Tamanho Teórico**:
- Apenas 2 valores (true/false) → **1 bit suficiente**

**Tamanho Prático**:
- **Variável**: JVM otimiza (pode usar registradores)
- **Campo de classe**: Pelo menos **1 byte** (alinhamento de memória)
- **Array**: **1 byte por elemento** (`boolean[]`)

**Razão**: CPUs modernas acessam memória em bytes (não bits individuais).

---

## 🔍 Análise Conceitual Profunda

### Impacto na Memória

#### Arrays

**Exemplo**: Array de 1 milhão de elementos

```java
byte[]    array1M = new byte[1_000_000];    // 1 MB
short[]   array1M = new short[1_000_000];   // 2 MB
int[]     array1M = new int[1_000_000];     // 4 MB
long[]    array1M = new long[1_000_000];    // 8 MB
float[]   array1M = new float[1_000_000];   // 4 MB
double[]  array1M = new double[1_000_000];  // 8 MB
char[]    array1M = new char[1_000_000];    // 2 MB
boolean[] array1M = new boolean[1_000_000]; // 1 MB (JVM-dependente)
```

**Economia de Memória**:
```java
// Usar byte ao invés de int: 75% de economia
byte[] bytes = new byte[1_000_000];  // 1 MB
int[] ints = new int[1_000_000];     // 4 MB (4× maior)

// Usar float ao invés de double: 50% de economia
float[] floats = new float[1_000_000];   // 4 MB
double[] doubles = new double[1_000_000]; // 8 MB (2× maior)
```

#### Objetos

**Wrapper Classes** (overhead adicional):
```java
// Primitivo
int primitivo = 42;  // 4 bytes

// Wrapper (objeto)
Integer wrapper = 42;  // ~16 bytes (4 bytes do int + overhead de objeto)
```

**Overhead de Objeto** (aproximado):
- **Header**: 12-16 bytes (mark word, class pointer, etc.)
- **Padding**: Arredondamento para múltiplos de 8 bytes

### Trade-offs: Memória vs Precisão vs Performance

| Tipo | Memória | Precisão/Faixa | Performance | Quando Usar |
|------|---------|----------------|-------------|-------------|
| **byte** | ★★★★★ (mínima) | ★☆☆☆☆ (-128 a 127) | ★★★★☆ | I/O, arrays grandes |
| **short** | ★★★★☆ | ★★☆☆☆ (±32k) | ★★★★☆ | Raramente |
| **int** | ★★★☆☆ | ★★★★☆ (±2 bilhões) | ★★★★★ | **Tipo padrão** |
| **long** | ★★☆☆☆ | ★★★★★ (±9 quintilhões) | ★★★★☆ | Timestamps, IDs |
| **float** | ★★★☆☆ | ★★☆☆☆ (6-7 dígitos) | ★★★★☆ | GPUs, memória crítica |
| **double** | ★★☆☆☆ | ★★★★★ (15-16 dígitos) | ★★★★★ | **Tipo padrão (decimais)** |
| **char** | ★★★★☆ | N/A (Unicode) | ★★★★★ | Caracteres |
| **boolean** | ★★★★★ | N/A (true/false) | ★★★★★ | Flags |

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Otimização de Memória em Arrays Grandes

**Problema**: Processar milhões de pixels de imagem.

```java
public class ImagemProcessamento {
    // RGB: cada componente de 0 a 255
    private byte[] red;    // 1 MB (1 milhão de pixels)
    private byte[] green;  // 1 MB
    private byte[] blue;   // 1 MB
    // Total: 3 MB
    
    // ❌ Usar int desperdiçaria memória
    // private int[] red;    // 4 MB
    // private int[] green;  // 4 MB
    // private int[] blue;   // 4 MB
    // Total desperdiçado: 12 MB (4× maior!)
    
    public void setPixel(int index, int r, int g, int b) {
        red[index] = (byte) r;    // 0-255 cabe em byte
        green[index] = (byte) g;
        blue[index] = (byte) b;
    }
    
    public int getRed(int index) {
        return red[index] & 0xFF;  // Converter para unsigned (0-255)
    }
}
```

### Caso 2: Escolha de Tipo para Cálculos Científicos

```java
public class SimulacaoFisica {
    // ✅ double: precisão crítica (15-16 dígitos)
    private double posicaoX;
    private double posicaoY;
    private double velocidade;
    
    // ❌ float: precisão insuficiente (~6-7 dígitos)
    // Erros acumulativos em simulações longas
    
    public void atualizar(double deltaTime) {
        posicaoX += velocidade * deltaTime;
        // Com float, erros se acumulariam a cada frame
    }
}
```

### Caso 3: Timestamps e IDs

```java
public class Sistema {
    // ✅ long: timestamp em milissegundos (> 2 bilhões)
    private long timestampCriacao = System.currentTimeMillis();
    
    // ❌ int: overflow em 2038 (problema do Ano 2038)
    // private int timestamp = (int) System.currentTimeMillis();  // ERRO!
    
    // ✅ long: IDs únicos de alta granularidade
    private long userId;
    
    // ❌ int: apenas 2 bilhões de IDs possíveis (insuficiente)
}
```

### Caso 4: Coordenadas Gráficas

```java
public class Vertex3D {
    // ✅ float: GPUs otimizadas para float
    private float x, y, z;
    
    // Arrays de milhões de vértices:
    // float[] vertices = new float[3_000_000];  // 12 MB
    // double[] vertices = new double[3_000_000]; // 24 MB (2× maior, sem benefício real em gráficos)
    
    public Vertex3D(float x, float y, float z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
```

### Caso 5: Compactação de Dados de Sensores

```java
public class SensorData {
    // Temperatura: -40°C a 85°C (resolução 0.1°C)
    // Armazenar como short (valor × 10)
    private short[] temperaturas;  // 2 bytes/leitura
    
    public void registrarTemperatura(int index, double celsius) {
        // Converte -40.0 a 85.0 → -400 a 850
        temperaturas[index] = (short) (celsius * 10);
    }
    
    public double obterTemperatura(int index) {
        return temperaturas[index] / 10.0;
    }
    
    // ✅ Economia:
    // 1 milhão de leituras:
    // short: 2 MB
    // double: 8 MB (4× maior)
}
```

---

## ⚠️ Limitações e Considerações

### 1. Overhead de Wrapper Classes

**Problema**: Autoboxing cria objetos pesados.

```java
// Primitivo
int[] array = new int[1_000_000];  // 4 MB

// Wrapper (List)
List<Integer> lista = new ArrayList<>();
for (int i = 0; i < 1_000_000; i++) {
    lista.add(i);  // ~16 bytes por Integer → ~16 MB + overhead do ArrayList
}
```

**Solução**: Usar primitivos sempre que possível.

### 2. Conversão com Perda de Dados

**Problema**: Casting de tipos maiores para menores.

```java
long grande = 10_000_000_000L;
int pequeno = (int) grande;  // ⚠️ Perde dados (truncamento)
System.out.println(pequeno);  // 1410065408 (incorreto!)
```

**Solução**: Validar antes de converter.

```java
if (grande >= Integer.MIN_VALUE && grande <= Integer.MAX_VALUE) {
    int seguro = (int) grande;
} else {
    throw new ArithmeticException("Valor não cabe em int");
}
```

### 3. Precisão de Ponto Flutuante

**Problema**: float tem precisão limitada.

```java
float f = 123456789.123456789f;
System.out.println(f);  // 1.23456792E8 (arredondado após 7 dígitos)

double d = 123456789.123456789;
System.out.println(d);  // 1.2345678912345679E8 (≈16 dígitos)
```

**Solução**: Usar double para cálculos gerais.

### 4. Alinhamento de Memória

**Problema**: JVM pode adicionar padding.

```java
public class Exemplo {
    private boolean flag1;  // 1 byte
    private int valor;      // 4 bytes
    private boolean flag2;  // 1 byte
    // Total esperado: 6 bytes
    // Total real: ~12 bytes (padding para alinhamento)
}
```

**Solução**: Agrupar tipos do mesmo tamanho.

```java
public class ExemploOtimizado {
    private int valor;      // 4 bytes
    private boolean flag1;  // 1 byte
    private boolean flag2;  // 1 byte
    // Total: ~8 bytes (menos padding)
}
```

---

## 🔗 Interconexões Conceituais

**Próximos Tópicos**:
- **Valores Padrão**: Valores default de cada tipo primitivo
- **Conversões (Casting)**: Widening e narrowing
- **Wrapper Classes**: Integer, Double, Boolean, etc.

**Relação com Outras Estruturas**:
- **Arrays**: Multiplicam tamanho pelo número de elementos
- **Collections**: Requerem wrappers (overhead adicional)
- **Serialização**: Tipos primitivos têm representação binária fixa

---

## 🚀 Boas Práticas

1. ✅ **Preferir int** para variáveis inteiras (tipo padrão)
2. ✅ **Usar byte** apenas para I/O ou arrays grandes
3. ✅ **Evitar short** (raramente necessário)
4. ✅ **Usar long** para timestamps e IDs
5. ✅ **Preferir double** para decimais (tipo padrão)
6. ✅ **Usar float** apenas quando memória é crítica (GPUs, arrays grandes)
7. ✅ **Usar primitivos** ao invés de wrappers quando possível
8. ✅ **Validar antes de casting** para tipos menores
9. ✅ **Agrupar campos** do mesmo tamanho para otimizar padding
10. ✅ **Documentar escolhas** de tipos quando otimização de memória é aplicada

### Decisão de Tipo: Fluxograma

```
Precisa armazenar números?
│
├─ Inteiros?
│  │
│  ├─ Valores < ±2 bilhões? → int (padrão)
│  ├─ Valores > ±2 bilhões? → long
│  ├─ Array gigante (0-255)? → byte
│  └─ Raramente → short
│
└─ Decimais?
   │
   ├─ Precisão crítica? → double (padrão)
   ├─ Memória crítica + precisão OK? → float
   └─ Valores monetários? → BigDecimal (não primitivo!)
```
