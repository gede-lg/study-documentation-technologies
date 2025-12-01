# Arrays de Tipos Primitivos

## 🎯 Introdução e Definição

**Arrays de tipos primitivos** armazenam **valores diretamente** na memória (não referências), oferecendo **máxima eficiência** em termos de velocidade de acesso e uso de memória. Diferente de arrays de objetos, cada elemento ocupa exatamente o espaço do tipo primitivo.

**Conceito central**: valores primitivos são **armazenados inline** no array, sem indireção através de referências, resultando em acesso **O(1) direto** e **cache-friendly**.

**Sintaxe fundamental**:
```java
tipoPrimitivo[] nomeArray = new tipoPrimitivo[tamanho];
```

**Exemplo básico**:
```java
int[] numeros = new int[3];  // [0, 0, 0] - valores diretamente armazenados
// Cada elemento ocupa exatamente 4 bytes (tamanho de int)
```

Arrays de primitivos são **inicializados automaticamente** com valores padrão específicos do tipo, nunca contêm "lixo de memória".

## 📋 Fundamentos Teóricos

### 1️⃣ Tipos Primitivos Suportados - Todos os 8 Tipos

Java suporta arrays para **todos os 8 tipos primitivos**:

```java
// Tipos inteiros
byte[] bytes = new byte[5];       // 8 bits: [-128, 127]
short[] shorts = new short[3];    // 16 bits: [-32768, 32767]
int[] ints = new int[4];          // 32 bits: [-2³¹, 2³¹-1]
long[] longs = new long[2];       // 64 bits: [-2⁶³, 2⁶³-1]

// Tipos de ponto flutuante
float[] floats = new float[3];    // 32 bits: IEEE 754
double[] doubles = new double[2]; // 64 bits: IEEE 754

// Outros tipos
char[] chars = new char[3];       // 16 bits: Unicode [0, 65535]
boolean[] flags = new boolean[2]; // 1 bit (geralmente 1 byte)
```

### 2️⃣ Valores Padrão - Tabela Completa

Cada tipo primitivo tem um **valor padrão específico** para inicialização:

**Tabela de valores padrão**:

| Tipo | Valor Padrão | Representação | Exemplo |
|------|-------------|---------------|---------|
| `byte` | `0` | `(byte) 0` | `new byte[2]` → `[0, 0]` |
| `short` | `0` | `(short) 0` | `new short[2]` → `[0, 0]` |
| `int` | `0` | `0` | `new int[3]` → `[0, 0, 0]` |
| `long` | `0` | `0L` | `new long[2]` → `[0L, 0L]` |
| `float` | `0.0` | `0.0f` | `new float[2]` → `[0.0f, 0.0f]` |
| `double` | `0.0` | `0.0` ou `0.0d` | `new double[2]` → `[0.0, 0.0]` |
| `char` | `'\u0000'` | Null character | `new char[2]` → `['\u0000', '\u0000']` |
| `boolean` | `false` | `false` | `new boolean[3]` → `[false, false, false]` |

**Nota**: `'\u0000'` (char padrão) é o **null character**, não um espaço `' '`.

### 3️⃣ Armazenamento Direto - Inline Storage

Valores primitivos são **armazenados diretamente** no array, sem referências:

```java
int[] arr = {10, 20, 30};
// Memória: [10][20][30] - valores consecutivos
// Não: [ref1][ref2][ref3] -> objetos separados

// Comparação com array de objetos
Integer[] arrObj = {10, 20, 30};
// Memória: [ref1][ref2][ref3] -> [Integer(10)][Integer(20)][Integer(30)]
```

**Vantagem**: **cache-friendly** - valores consecutivos na memória melhoram hits de cache.

### 4️⃣ Performance Superior - Comparação com Wrappers

Arrays de primitivos têm **performance significativamente superior** a arrays de wrappers:

```java
// Primitivo: acesso direto, sem overhead
int[] primitivos = new int[1_000_000];
int soma = 0;
for (int i = 0; i < primitivos.length; i++) {
    soma += primitivos[i];  // Acesso direto
}

// Wrapper: unboxing, garbage collection, referências
Integer[] wrappers = new Integer[1_000_000];
int soma2 = 0;
for (int i = 0; i < wrappers.length; i++) {
    soma2 += wrappers[i];  // Unboxing automático (overhead)
}
```

**Diferenças**:
- **Primitivos**: sem alocação de objetos, sem GC pressure
- **Wrappers**: cada elemento é objeto, requer unboxing, mais memória

### 5️⃣ Uso de Memória - Cálculo Preciso

Cada tipo primitivo ocupa **espaço fixo** por elemento:

```java
// Cálculo de memória
byte[] bytes = new byte[100];    // 100 * 1 byte = 100 bytes
short[] shorts = new short[100]; // 100 * 2 bytes = 200 bytes
int[] ints = new int[100];       // 100 * 4 bytes = 400 bytes
long[] longs = new long[100];    // 100 * 8 bytes = 800 bytes
float[] floats = new float[100]; // 100 * 4 bytes = 400 bytes
double[] doubles = new double[100]; // 100 * 8 bytes = 800 bytes
char[] chars = new char[100];    // 100 * 2 bytes = 200 bytes (Unicode)
boolean[] bools = new boolean[100]; // Geralmente 100 bytes (1 byte/elemento)
```

**Nota**: há overhead adicional do header do array (~12-16 bytes).

### 6️⃣ Inicialização com Valores Específicos

Arrays podem ser **inicializados diretamente** com valores literais:

```java
int[] nums = {1, 2, 3, 4, 5};
double[] vals = {1.5, 2.7, 3.9};
boolean[] flags = {true, false, true};
char[] vogais = {'a', 'e', 'i', 'o', 'u'};

// Com new (para atribuição posterior)
int[] arr;
arr = new int[]{10, 20, 30};
```

**Vantagem**: mais conciso que inicializar elemento por elemento.

### 7️⃣ Operações Aritméticas Diretas

Primitivos suportam **operações aritméticas diretas** sem conversões:

```java
int[] a = {1, 2, 3};
int[] b = {4, 5, 6};
int[] soma = new int[3];

for (int i = 0; i < a.length; i++) {
    soma[i] = a[i] + b[i];  // Operação direta, sem boxing
}

// Com wrappers (menos eficiente)
Integer[] aObj = {1, 2, 3};
Integer[] bObj = {4, 5, 6};
Integer[] somaObj = new Integer[3];
for (int i = 0; i < aObj.length; i++) {
    somaObj[i] = aObj[i] + bObj[i];  // Unboxing + operação + boxing
}
```

### 8️⃣ Arrays de char - Strings Mutáveis

Arrays de `char` funcionam como **strings mutáveis**:

```java
char[] chars = {'J', 'a', 'v', 'a'};
chars[0] = 'L';  // Modifica para "Lava"

// Conversão String <-> char[]
String str = "Hello";
char[] arr = str.toCharArray();  // String -> char[]
String novaStr = new String(arr);  // char[] -> String

// Manipulação de texto
char[] texto = {'h', 'e', 'l', 'l', 'o'};
texto[0] = Character.toUpperCase(texto[0]);  // "Hello"
```

**Uso**: manipulação de texto eficiente, buffers de caracteres.

### 9️⃣ Arrays de boolean - Flags e Estados

Arrays de `boolean` ideais para **representar estados binários**:

```java
boolean[] respostas = new boolean[10];  // Quiz com 10 perguntas
respostas[0] = true;   // Pergunta 1: correta
respostas[1] = false;  // Pergunta 2: incorreta

// Contar respostas corretas
int corretas = 0;
for (boolean resposta : respostas) {
    if (resposta) corretas++;
}

// Flags de configuração
boolean[] opcoes = {true, false, true};  // [verbose, debug, logging]
```

### 🔟 Arrays de byte - Buffers Binários

Arrays de `byte` amplamente usados para **I/O binário**:

```java
// Buffer de leitura
byte[] buffer = new byte[1024];
int bytesLidos = inputStream.read(buffer);

// Dados binários
byte[] dados = {0x48, 0x65, 0x6C, 0x6C, 0x6F};  // "Hello" em ASCII

// Imagens, arquivos, rede
byte[] imagemBytes = Files.readAllBytes(Paths.get("imagem.jpg"));
```

**Uso**: arquivos, rede, serialização, criptografia.

## 🎯 Aplicabilidade

**1. Cálculos Matemáticos e Científicos**:
```java
double[] coeficientes = {1.5, -2.3, 4.7};
double resultado = 0;
for (int i = 0; i < coeficientes.length; i++) {
    resultado += coeficientes[i] * Math.pow(x, i);
}
```

**2. Processamento de Dados Numéricos**:
```java
int[] vendas = new int[365];  // Vendas diárias
double media = Arrays.stream(vendas).average().orElse(0);
```

**3. Flags e Estados Binários**:
```java
boolean[] diasUteis = {true, true, true, true, true, false, false};
```

**4. Buffers de Bytes**:
```java
byte[] buffer = new byte[8192];  // Buffer de I/O
```

**5. Processamento de Imagens**:
```java
int[] pixels = new int[1920 * 1080];  // RGB pixels
```

**6. Algoritmos de Ordenação**:
```java
int[] numeros = {5, 2, 8, 1, 9};
Arrays.sort(numeros);  // [1, 2, 5, 8, 9]
```

**7. Estatísticas e Agregações**:
```java
double[] notas = {7.5, 8.0, 6.5, 9.0};
double media = Arrays.stream(notas).average().orElse(0);
double max = Arrays.stream(notas).max().orElse(0);
```

## ⚠️ Armadilhas Comuns

**1. Valores Padrão Podem Mascarar Bugs**:
```java
int[] contadores = new int[5];  // [0, 0, 0, 0, 0]
if (contadores[0] == 0) {  // ⚠️ Sempre true inicialmente
    // Pode executar sem intenção
}
```

**2. Confundir com Wrappers (Integer[] vs int[])**:
```java
int[] primitivos = new int[3];  // ✅ Primitivos
Integer[] wrappers = new Integer[3];  // ⚠️ Objetos (todos null!)

primitivos[0] = 10;  // OK
wrappers[0] = 10;    // Autoboxing (cria Integer)
```

**3. char Padrão Não é Espaço**:
```java
char[] chars = new char[3];  // ['\u0000', '\u0000', '\u0000']
if (chars[0] == ' ') {  // ❌ false! Padrão é '\u0000', não ' '
    // Não executa
}
```

**4. boolean[] Não Economiza Tanto Quanto Bitset**:
```java
boolean[] flags = new boolean[1000];  // Geralmente 1000 bytes
// Para muitos flags, considere BitSet (mais eficiente)
BitSet bitset = new BitSet(1000);  // ~125 bytes
```

## ✅ Boas Práticas

**1. Inicialize Explicitamente Quando Necessário**:
```java
// ❌ Dependendo de valor padrão (pode confundir)
int[] arr = new int[5];  // [0, 0, 0, 0, 0]

// ✅ Inicialização explícita
int[] arr = {-1, -1, -1, -1, -1};  // Valor sentinela claro
```

**2. Use Tipos Apropriados (Economize Memória)**:
```java
// ❌ Desperdício para valores pequenos
int[] idades = new int[1000];  // 4000 bytes

// ✅ Mais eficiente
byte[] idades = new byte[1000];  // 1000 bytes (idades 0-127)
```

**3. Prefira Primitivos para Performance**:
```java
// ❌ Menos eficiente
Integer[] nums = new Integer[1_000_000];  // Objetos, GC pressure

// ✅ Mais eficiente
int[] nums = new int[1_000_000];  // Primitivos, sem overhead
```

**4. Valide Valores Antes de Usar**:
```java
int[] dados = new int[10];
// ...
if (dados[i] == 0) {  // Pode ser valor padrão ou valor real
    // Verifique se foi realmente inicializado
}
```

**5. Use Arrays.fill() para Inicialização Uniforme**:
```java
int[] arr = new int[100];
Arrays.fill(arr, -1);  // Todos elementos = -1
```

**6. Considere BitSet para Muitos Booleans**:
```java
// Para > 1000 flags
BitSet flags = new BitSet(10_000);  // Mais eficiente que boolean[]
```

## 📚 Resumo Executivo

Arrays de primitivos armazenam **valores diretamente** (não referências), oferecendo **performance superior** e **menor uso de memória** comparado a arrays de wrappers.

**Tipos suportados**: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean`

**Valores padrão**:
- Numéricos: `0` (int, long, etc) ou `0.0` (float, double)
- `boolean`: `false`
- `char`: `'\u0000'` (null character)

**Vantagens**:
- **Performance**: acesso direto O(1), sem unboxing
- **Memória**: tamanho fixo por elemento, sem overhead de objetos
- **Cache**: valores consecutivos (cache-friendly)

**Quando usar**: cálculos numéricos, performance crítica, grandes volumes de dados, buffers, flags.
