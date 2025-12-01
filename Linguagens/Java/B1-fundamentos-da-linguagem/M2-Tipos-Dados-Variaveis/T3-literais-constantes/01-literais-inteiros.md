# Literais Inteiros

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Literais inteiros** são **representações diretas de valores numéricos inteiros no código-fonte Java**, escritos literalmente pelo programador sem necessidade de cálculo ou conversão. Conceitualmente, são **constantes numéricas hardcoded** que representam valores fixos de tipos inteiros (`byte`, `short`, `int`, `long`) diretamente no código.

Um literal inteiro é valor que você escreve exatamente como aparece — `42`, `1000`, `-15` — diferentemente de variáveis (que armazenam valores) ou expressões (que calculam valores). O compilador Java reconhece esses padrões de dígitos como valores numéricos e os converte para representação binária apropriada.

Java suporta **quatro sistemas numéricos** para literais inteiros:

1. **Decimal (base 10):** Padrão, usa dígitos 0-9 (`42`, `1000`)
2. **Hexadecimal (base 16):** Prefixo `0x` ou `0X`, usa 0-9 e A-F (`0xFF`, `0x2A`)
3. **Octal (base 8):** Prefixo `0`, usa dígitos 0-7 (`077`, `012`)
4. **Binário (base 2):** Prefixo `0b` ou `0B`, usa 0 e 1 (`0b1010`, `0B11111111`)

**Tipo Padrão:** Por padrão, literais inteiros são tipo `int` (32 bits). Para `long` (64 bits), sufixo `L` ou `l` é necessário.

### Contexto Histórico e Motivação

**Sistemas Numéricos na Computação:**

Desde os primórdios da computação (anos 1940-50), diferentes bases numéricas foram usadas para representar dados:

- **Binário (base 2):** Representação nativa do hardware (bits 0/1)
- **Octal (base 8):** Popular em sistemas antigos (PDP-8, Unix antigo) por ser compacta e alinhar com palavras de 3 bits
- **Hexadecimal (base 16):** Extremamente popular desde 1960s por alinhar perfeitamente com bytes (2 dígitos hex = 1 byte)

**Adoção em Java:**

Java 1.0 (1996) suportava decimal, hexadecimal e octal — seguindo tradição de C/C++. **Binário foi adicionado em Java 7 (2011)**, refletindo necessidade crescente de manipulação de bits em aplicações modernas (redes, criptografia, compressão).

**Motivação para Múltiplas Bases:**

1. **Hexadecimal:** Compacto para representar valores de memória, cores RGB, flags de bits
   ```java
   int corBranca = 0xFFFFFF;  // Mais legível que 16777215
   ```

2. **Binário:** Explícito para operações bit a bit, máscaras, protocolos de rede
   ```java
   int permissoes = 0b111;  // read(1) write(1) execute(1) — claro
   ```

3. **Octal:** Histórico (Unix file permissions), menos usado hoje

**Evolução:**

- **Java 1.0-6:** Decimal, hex, octal
- **Java 7 (2011):** Literais binários (`0b`), underscores em literais (`1_000_000`)
- **Java 9+:** Métodos `Integer.parseUnsignedInt()` para valores sem sinal

### Problema Fundamental que Resolve

**1. Representação Direta de Valores:**

Sem literais, você precisaria construir valores através de operações (somar 1 + 1 + 1...). Literais permitem **expressar valores diretamente**.

**2. Legibilidade em Diferentes Contextos:**

- **Decimal:** Natural para matemática humana (`1000` é mais claro que `0x3E8`)
- **Hexadecimal:** Natural para endereços de memória, cores (`0xFF0000` claramente vermelho)
- **Binário:** Natural para flags (`0b1010` mostra padrão de bits)

**3. Compatibilidade com Hardware:**

Diferentes bases facilitam trabalhar com conceitos próximos ao hardware (endereços, registradores, protocolos) sem conversão mental constante.

**4. Redução de Erros:**

Representação apropriada reduz erros. Ex: `0b11111111` (8 bits todos 1) é menos propenso a erro que escrever `255` e contar se corresponde a 8 bits.

### Importância no Ecossistema

Literais inteiros são **fundamento da expressão de dados** em Java:

- **Inicialização de Variáveis:** `int idade = 25;`
- **Constantes:** `public static final int MAX_USERS = 1000;`
- **Array Sizes:** `int[] array = new int[100];`
- **Parâmetros:** `Thread.sleep(5000);`
- **Comparações:** `if (status == 200) { ... }`

**Bases Não-Decimais são Críticas em:**

- **Gráficos:** Cores RGB (`0xFF5733`)
- **Redes:** Endereços IP, máscaras (`0xFFFFFF00`)
- **Criptografia:** Chaves, hashes representados em hex
- **Sistemas Embarcados:** Manipulação direta de hardware

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Tipo Padrão int:** Literais inteiros sem sufixo são `int` (32 bits)
2. **Sufixo L para long:** `long` requer `L` ou `l` (preferir `L` maiúsculo)
3. **Quatro Bases:** Decimal (padrão), Hex (`0x`), Octal (`0`), Binário (`0b`)
4. **Sinal:** Literais podem ser precedidos por `-` (negação unária)
5. **Underscores (Java 7+):** Separadores visuais para legibilidade (`1_000_000`)

### Pilares Fundamentais

- **Representação Compile-Time:** Literais são resolvidos em compile-time, não runtime
- **Type Inference:** Compilador infere tipo baseado em contexto
- **Immutability:** Literais são valores imutáveis
- **Range Checking:** Compilador valida se literal cabe no tipo de destino
- **Radix Prefixes:** `0x`, `0`, `0b` determinam interpretação

### Nuances Importantes

- **Octal Trap:** `int x = 077;` é octal (63 decimal), não 77
- **Underscores Placement:** Não pode começar/terminar número, nem antes/depois de prefixos
- **Lowercase `l` vs Uppercase `L`:** `l` pode ser confundido com `1`, usar `L`
- **Overflow em Literais:** `int x = 3_000_000_000;` — erro de compilação (excede int max)

---

## 🧠 Fundamentos Teóricos

### Literais Decimais (Base 10)

**Definição:** Representação padrão usando dígitos 0-9.

**Sintaxe:**

```java
int dezenas = 42;
int centenas = 100;
int milhares = 1000;
int negativos = -500;
```

**Conceito Interno:**

Compilador converte decimal para binário:
- `42` decimal → `00101010` binário (em int de 32 bits: `0x0000002A`)

**Características:**

- **Padrão:** Se não há prefixo, é decimal
- **Sinal:** `-` é operador unário de negação, não parte do literal
- **Tipo:** `int` por padrão

**Exemplo com long:**

```java
long bilhoes = 5000000000L;  // Requer L, excede int max (2^31-1)
```

**Por Que L?** `5000000000` sem `L` seria tratado como `int`, mas excede max int (2.147.483.647) → erro de compilação. `L` indica tipo `long` (64 bits, max ~9 quintilhões).

### Literais Hexadecimais (Base 16)

**Definição:** Prefixo `0x` ou `0X`, usa dígitos 0-9 e A-F (case-insensitive).

**Sintaxe:**

```java
int hex1 = 0xFF;        // 255 decimal
int hex2 = 0x2A;        // 42 decimal
int hex3 = 0xDEADBEEF;  // 3735928559 decimal
int hex4 = 0X10;        // 16 decimal (0X também válido)
```

**Mapeamento Hex → Decimal:**

```
0x0 = 0    0x8 = 8
0x1 = 1    0x9 = 9
0x2 = 2    0xA = 10
0x3 = 3    0xB = 11
0x4 = 4    0xC = 12
0x5 = 5    0xD = 13
0x6 = 6    0xE = 14
0x7 = 7    0xF = 15
```

**Conversão:**

`0xFF` = `15*16 + 15 = 255`

`0x2A` = `2*16 + 10 = 42`

**Uso Comum:**

**Cores RGB:**

```java
int vermelho = 0xFF0000;  // Red: FF, Green: 00, Blue: 00
int verde    = 0x00FF00;
int azul     = 0x0000FF;
int branco   = 0xFFFFFF;
int preto    = 0x000000;
```

**Conceito:** Cada par de dígitos hex = 1 byte (8 bits). `0xRRGGBB` — 3 bytes para RGB.

**Máscaras de Bits:**

```java
int READ    = 0x04;  // 0000 0100
int WRITE   = 0x02;  // 0000 0010
int EXECUTE = 0x01;  // 0000 0001

int permissoes = READ | WRITE;  // 0x06 = 0000 0110
```

**Endereços:**

```java
int enderecoMemoria = 0xDEADBEEF;  // Comum em debugging, análise de memória
```

### Literais Octais (Base 8)

**Definição:** Prefixo `0` (zero), usa dígitos 0-7.

**Sintaxe:**

```java
int octal1 = 077;   // 63 decimal (7*8 + 7)
int octal2 = 010;   // 8 decimal
int octal3 = 0777;  // 511 decimal
```

**Armadilha Comum:**

```java
int x = 099;  // ERRO DE COMPILAÇÃO: 9 não é dígito octal válido

int y = 010;  // 8, NÃO 10!
```

**Conceito:** `0` inicial sinaliza octal. `010` ≠ `10` decimal.

**Conversão:**

`077` = `7*8¹ + 7*8⁰ = 56 + 7 = 63`

**Uso Histórico:**

**Permissões Unix:**

```java
int rwxPermissions = 0755;  // rwxr-xr-x
// 7 (111) = owner rwx
// 5 (101) = group r-x
// 5 (101) = others r-x
```

**Menos Comum Hoje:** Hexadecimal e binário substituíram octal na maioria dos contextos modernos.

### Literais Binários (Base 2)

**Definição:** Prefixo `0b` ou `0B` (Java 7+), usa dígitos 0 e 1.

**Sintaxe:**

```java
int binario1 = 0b1010;        // 10 decimal
int binario2 = 0b11111111;    // 255 decimal
int binario3 = 0B1100;        // 12 decimal
int binario4 = 0b00000001;    // 1 decimal
```

**Conversão:**

`0b1010` = `1*2³ + 0*2² + 1*2¹ + 0*2⁰ = 8 + 0 + 2 + 0 = 10`

**Uso Principal: Operações Bit a Bit**

**Máscaras:**

```java
int READ_PERMISSION    = 0b100;  // Bit 2
int WRITE_PERMISSION   = 0b010;  // Bit 1
int EXECUTE_PERMISSION = 0b001;  // Bit 0

int fullPermissions = 0b111;  // Todos os bits
```

**Conceito:** Cada bit representa flag booleana. Binário torna padrão explícito.

**Configurações de Hardware:**

```java
// Configurar registrador de 8 bits
int config = 0b10101010;  // Padrão alternado claramente visível
```

**Flags de Protocolo:**

```java
// TCP Flags
int SYN = 0b000010;
int ACK = 0b010000;
int FIN = 0b000001;

int synAckPacket = SYN | ACK;  // 0b010010
```

**Legibilidade:**

```java
// Qual mais claro?
int mask1 = 255;         // Quanto bits?
int mask2 = 0xFF;        // 2 dígitos hex = 1 byte
int mask3 = 0b11111111;  // 8 bits todos 1 — explícito
```

### Tipo Padrão e Sufixos

**Conceito:** Literais inteiros sem sufixo são tipo `int` (32 bits, signed).

**Sintaxe:**

```java
int x = 42;      // int (padrão)
long y = 42L;    // long (sufixo L)
long z = 42l;    // long (sufixo l, mas evitar — parece 1)
```

**Por Que Sufixo?**

```java
// ERRO: literal excede int max
// int grande = 3000000000;  // Compile error: integer number too large

// Correto: usar long
long grande = 3000000000L;
```

**Conceito:** `3000000000` > `Integer.MAX_VALUE` (2.147.483.647). Compilador tenta interpretar como `int`, falha. Sufixo `L` diz "interprete como long".

**Assignment to Smaller Types:**

```java
byte b = 100;   // OK: 100 cabe em byte (-128 a 127)
// byte b2 = 200;  // ERRO: 200 excede byte max (127)

short s = 30000;  // OK: cabe em short
```

**Conceito:** Compilador permite atribuir literal `int` a tipos menores (`byte`, `short`) **se valor cabe**. Isso é exceção especial para literais (não funciona com variáveis).

### Literais Negativos

**Conceito:** Sinal `-` é **operador unário de negação**, não parte do literal.

```java
int negativo = -42;
```

**Internamente:**

1. Literal `42` é criado como `int` positivo
2. Operador `-` aplica negação (complemento de dois)
3. Resultado é `-42`

**Complemento de Dois:**

Java usa representação complemento de dois para números negativos.

**Exemplo:** `-1` em int (32 bits)

```
+1 = 0000 0000 0000 0000 0000 0000 0000 0001
-1 = 1111 1111 1111 1111 1111 1111 1111 1111  (todos os bits 1)
```

**Literal Hex Negativo:**

```java
int neg = -0xFF;  // -255 decimal
```

**Conceito:** `-` aplica-se após interpretação do literal hex.

---

## 🔍 Análise Conceitual Profunda

### Tabela de Conversão Entre Bases

| Decimal | Binário  | Octal | Hexadecimal |
|---------|----------|-------|-------------|
| 0       | 0b0      | 00    | 0x0         |
| 1       | 0b1      | 01    | 0x1         |
| 8       | 0b1000   | 010   | 0x8         |
| 10      | 0b1010   | 012   | 0xA         |
| 15      | 0b1111   | 017   | 0xF         |
| 16      | 0b10000  | 020   | 0x10        |
| 255     | 0b11111111 | 0377  | 0xFF        |

**Exemplos Práticos:**

```java
int dez_decimal = 10;
int dez_binario = 0b1010;
int dez_octal   = 012;
int dez_hex     = 0xA;

System.out.println(dez_decimal == dez_binario);  // true
System.out.println(dez_octal == dez_hex);        // true
// Todas representam mesmo valor: 10
```

### Underscores em Literais (Java 7+)

**Motivação:** Melhorar legibilidade de números grandes.

**Sintaxe:**

```java
int milhao     = 1_000_000;
int bilhao     = 1_000_000_000;
long trilhao   = 1_000_000_000_000L;

int hex = 0xFF_EC_DE_5E;  // Separar bytes
int bin = 0b1111_0000_1010_1100;  // Separar nibbles (4 bits)
```

**Regras:**

- ✅ Pode usar múltiplos underscores consecutivos: `1__000`
- ❌ Não pode começar ou terminar número: `_100`, `100_`
- ❌ Não pode antes/depois de prefixo: `0x_FF`, `0b_1010`
- ❌ Não pode antes/depois de sufixo: `100_L`, `100L_`
- ❌ Não pode sozinho: `_`

**Exemplos Inválidos:**

```java
// int x = _100;        // ERRO: começa com _
// int y = 100_;        // ERRO: termina com _
// int z = 0x_FF;       // ERRO: após prefixo
// long w = 100_L;      // ERRO: antes de sufixo
```

**Conceito:** Underscores são **ignorados pelo compilador** — puramente para humanos. `1_000` e `1000` geram bytecode idêntico.

### Range de Tipos Inteiros

**Limites:**

```java
byte:  -128 a 127                    (8 bits, signed)
short: -32.768 a 32.767              (16 bits, signed)
int:   -2.147.483.648 a 2.147.483.647  (32 bits, signed)
long:  -9.223.372.036.854.775.808 a 9.223.372.036.854.775.807  (64 bits, signed)
```

**Constantes de Limites:**

```java
System.out.println(Byte.MIN_VALUE);    // -128
System.out.println(Byte.MAX_VALUE);    // 127
System.out.println(Integer.MIN_VALUE); // -2147483648
System.out.println(Integer.MAX_VALUE); // 2147483647
System.out.println(Long.MAX_VALUE);    // 9223372036854775807
```

**Overflow em Literais:**

```java
// int x = 2147483648;  // ERRO: excede Integer.MAX_VALUE
long x = 2147483648L;   // OK: long suporta

// byte b = 128;  // ERRO: excede Byte.MAX_VALUE (127)
byte b = 127;     // OK
```

**Conceito:** Compilador valida literais em compile-time. Overflow de literal = erro de compilação.

### Conversão Implícita vs Explícita

**Assignment to Smaller Types (Casos Especiais):**

```java
byte b = 10;    // OK: literal int 10 cabe em byte
short s = 1000; // OK: literal int 1000 cabe em short

int valor = 10;
// byte b2 = valor;  // ERRO: não pode atribuir int a byte, mesmo que valor caiba
byte b2 = (byte) valor;  // OK: cast explícito
```

**Conceito:** Compilador permite literal `int` → tipos menores **apenas se literal cabe**. Para variáveis, cast explícito sempre necessário.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Base

**Decimal:**

- Matemática humana, contadores, tamanhos
- **Exemplo:** `int idade = 25;`, `int totalItems = 1000;`

**Hexadecimal:**

- Cores, endereços de memória, dumps de bytes
- **Exemplo:** `int cor = 0xFF5733;`, `int mask = 0xFFFF;`

**Binário:**

- Flags, máscaras de bits, configurações de hardware
- **Exemplo:** `int permissions = 0b111;`, `int config = 0b1010_1100;`

**Octal:**

- Permissões Unix (legado), pouco usado hoje
- **Exemplo:** `int perm = 0755;`

### Cenários Práticos

**Cenário 1: Cores RGB**

```java
int vermelho = 0xFF0000;
int verde    = 0x00FF00;
int azul     = 0x0000FF;

// Extrair componentes
int r = (vermelho >> 16) & 0xFF;
int g = (verde >> 8) & 0xFF;
int b = azul & 0xFF;
```

**Cenário 2: Flags de Configuração**

```java
int FLAG_ADMIN  = 0b0001;
int FLAG_EDITOR = 0b0010;
int FLAG_VIEWER = 0b0100;

int userPermissions = FLAG_ADMIN | FLAG_EDITOR;  // 0b0011

boolean isAdmin = (userPermissions & FLAG_ADMIN) != 0;  // true
```

**Cenário 3: Constantes Legíveis**

```java
public static final int MAX_CONNECTIONS = 1_000;
public static final long TIMEOUT_MS = 30_000L;  // 30 segundos
public static final int BUFFER_SIZE = 8_192;    // 8 KB
```

---

## ⚠️ Limitações e Considerações

### 1. Armadilha do Octal

**Problema:** `0` inicial = octal

```java
int x = 010;  // 8, NÃO 10!
int y = 099;  // ERRO: 9 não é dígito octal
```

**Mitigação:** Evitar `0` inicial a menos que intencionalmente octal. Preferir decimal ou hex.

### 2. Confusão `l` vs `L`

```java
long x = 123456789l;  // 'l' parece '1'
long y = 123456789L;  // 'L' claro
```

**Mitigação:** Sempre usar `L` maiúsculo.

### 3. Overflow de Literais

```java
// int grande = 3000000000;  // ERRO
long grande = 3000000000L;   // OK
```

**Mitigação:** Usar `L` para valores grandes.

---

## 🔗 Interconexões Conceituais

### Relação com Tipos Primitivos

Literais inteiros inicializam `byte`, `short`, `int`, `long`. Tipo do literal determina conversões necessárias.

### Relação com Operadores Bit a Bit

Literais binários/hex são naturais para operações bit a bit (`&`, `|`, `^`, `<<`, `>>`).

### Relação com Constantes

Literais frequentemente combinados com `final` para criar constantes nomeadas.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Literais de Ponto Flutuante:** `double`, `float`
2. **Operadores Aritméticos:** Como literais são usados em expressões
3. **Type Casting:** Conversão entre tipos numéricos
4. **Wrapper Classes:** `Integer.parseInt()`, `Long.parseLong()`

---

## 📚 Conclusão

**Literais inteiros** são representações diretas de valores numéricos no código Java, suportando quatro bases (decimal, hexadecimal, octal, binário) para atender diferentes contextos — matemática humana, manipulação de bits, endereços de memória. Tipo padrão é `int`; sufixo `L` indica `long`. Java 7 introduziu literais binários (`0b`) e underscores para legibilidade. Compilador valida literais em compile-time, garantindo que valores cabem em tipos de destino. Compreender literais inteiros é fundamento para inicializar variáveis, definir constantes, trabalhar com cores/flags/máscaras, e expressar valores de forma legível e apropriada ao contexto. Armadilhas incluem octal acidental (`010`), confusão entre `l` e `1`, e overflow em literais grandes sem sufixo `L`.
