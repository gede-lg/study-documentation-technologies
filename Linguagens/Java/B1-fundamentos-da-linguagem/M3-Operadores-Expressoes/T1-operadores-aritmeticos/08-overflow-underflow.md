# Overflow e Underflow em Operações Aritméticas

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Overflow** e **underflow** são fenômenos que ocorrem quando resultado de operação aritmética **excede os limites de representação** do tipo numérico utilizado. Conceitualmente, representam **falha de contenção** — tentativa de armazenar valor maior (overflow) ou menor (underflow) que o tipo pode representar.

**Overflow:** Resultado **maior** que valor máximo representável → wrap-around para valores negativos (inteiros) ou `Infinity` (ponto flutuante)

**Underflow:** Resultado **menor** que valor mínimo representável → wrap-around para valores positivos (inteiros) ou valores subnormais próximos de zero (ponto flutuante)

**Exemplo Visual (int 32 bits):**

```
MAX_VALUE: 2.147.483.647
           2.147.483.647 + 1 → Overflow!
           Resultado: -2.147.483.648 (wrap-around)

MIN_VALUE: -2.147.483.648
           -2.147.483.648 - 1 → Underflow!
           Resultado: 2.147.483.647 (wrap-around)
```

**Conceito Fundamental:** Java **não sinaliza** overflow/underflow automaticamente — valores simplesmente "envolvem" (wrap-around) silenciosamente, fonte comum de bugs críticos.

### Contexto Histórico e Motivação

**Aritmética Modular:**

Comportamento de wrap-around vem de **aritmética modular** — números "circulam" ao atingir limites. Representação em complemento de dois (two's complement) causa esse efeito.

**Herança de C:**

Java herdou comportamento silencioso de C (1972). Alternativas incluem:
- **Ada:** Lança exceção em overflow (runtime)
- **Python:** Inteiros de precisão arbitrária (sem overflow)
- **Rust:** Pânico em debug, wrap-around em release

**Motivação Java:**

1. **Performance:** Verificação automática custosa (cada operação)
2. **Compatibilidade:** Seguir precedente de C/C++
3. **Controle:** Programador escolhe quando verificar

**Trade-off:** Performance vs segurança. Java priorizou performance, delegando verificações ao programador.

### Problema Fundamental que Resolve

**Overflow/Underflow NÃO resolve problema** — são **bugs** que precisam ser detectados e prevenidos.

**Problemas Causados:**

1. **Cálculos Financeiros Incorretos:** `saldo * juros` pode overflow
2. **Índices Inválidos:** `tamanho * fator` negativo após overflow
3. **Vulnerabilidades Segurança:** Buffer overflow exploits
4. **Resultados Absurdos:** Valor positivo vira negativo

**Soluções:**

- **Validação:** Verificar limites antes de operar
- **Tipos Maiores:** `long` ao invés de `int`
- **Math Exact:** `Math.addExact()`, `Math.multiplyExact()` (Java 8+)
- **BigInteger/BigDecimal:** Precisão arbitrária

### Importância no Ecossistema

**Overflow é crítico em:**

- **Finanças:** Cálculos monetários (juros, lucros)
- **Algoritmos:** Busca binária, arrays (índices)
- **Segurança:** Exploits clássicos (buffer overflow)
- **Sistemas Críticos:** Aeroespacial, médico (falhas catastróficas)

**Exemplo Histórico:** Ariane 5 (1996) — overflow em conversão 64→16 bits causou explosão de US$ 370 milhões.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Wrap-Around:** Valores "envolvem" ao atingir limites (não truncam)
2. **Silencioso:** Sem exceções automáticas (inteiros)
3. **Tipo-Dependente:** Inteiros vs ponto flutuante diferem
4. **Complemento de Dois:** Causa wrap-around em inteiros
5. **Infinity/NaN:** Ponto flutuante sinaliza com valores especiais

### Pilares Fundamentais

- **Two's Complement:** Representação causa wrap-around
- **Silent Overflow:** Java não lança exceção (inteiros)
- **Type-Specific Behavior:** int (wrap), float (Infinity)
- **Detection Required:** Programador deve verificar explicitamente
- **Prevention Strategies:** Validação, tipos maiores, Math exact

### Nuances Importantes

- **int vs long:** `long` posterga overflow, não elimina
- **float vs double:** `double` tem maior range, mas ainda pode overflow
- **BigInteger:** Solução definitiva (sem overflow, mas performance)
- **Math Exact (Java 8+):** Lança exceção em overflow

---

## 🧠 Fundamentos Teóricos

### Overflow em Inteiros (`int`, `long`)

**Wrap-Around Silencioso:**

```java
int max = Integer.MAX_VALUE;  // 2.147.483.647
int overflow = max + 1;       // -2.147.483.648 (!!)

System.out.println(max);      // 2147483647
System.out.println(overflow); // -2147483648 (wrap-around)
```

**Conceito:** Adicionar 1 ao máximo "volta ao início" (valor mínimo).

**Por Quê?** Representação em complemento de dois:

```
MAX_VALUE: 01111111 11111111 11111111 11111111
    + 1:   00000000 00000000 00000000 00000001
-----------
RESULTADO: 10000000 00000000 00000000 00000000 (MIN_VALUE)
```

Bit mais significativo (sign bit) vira 1 → valor negativo.

**Multiplicação (Comum):**

```java
int a = 50000;
int b = 50000;
int produto = a * b;  // 2.500.000.000 → overflow!

System.out.println(produto);  // -1794967296 (!!!)
```

**Conceito:** Produto excede `Integer.MAX_VALUE`, causa wrap-around.

### Underflow em Inteiros

**Wrap-Around Inverso:**

```java
int min = Integer.MIN_VALUE;  // -2.147.483.648
int underflow = min - 1;      // 2.147.483.647 (!!)

System.out.println(min);       // -2147483648
System.out.println(underflow); // 2147483647 (wrap-around)
```

**Conceito:** Subtrair 1 do mínimo "volta ao fim" (valor máximo).

**Negação de MIN_VALUE:**

```java
int min = Integer.MIN_VALUE;
int negado = -min;  // Overflow! -(-2.147.483.648) deveria ser 2.147.483.648
                    // Mas MAX_VALUE é 2.147.483.647 → Overflow!

System.out.println(negado);  // -2147483648 (igual ao original!)
```

**Conceito:** `-MIN_VALUE` não pode ser representado em `int` — overflow silencioso.

### Overflow em Ponto Flutuante (`float`, `double`)

**Infinity ao Invés de Wrap-Around:**

```java
double grande = 1.7e308;      // Próximo ao máximo
double overflow = grande * 10; // Infinity

System.out.println(overflow);  // Infinity
System.out.println(Double.isInfinite(overflow));  // true
```

**Conceito:** Ponto flutuante **não envolve** — retorna `Infinity` (positivo ou negativo).

**Operações com Infinity:**

```java
double x = Double.POSITIVE_INFINITY;
double r1 = x + 100;    // Infinity
double r2 = x * 2;      // Infinity
double r3 = x / 2;      // Infinity
double r4 = 1.0 / x;    // 0.0
```

### Underflow em Ponto Flutuante

**Valores Subnormais (Denormalizados):**

```java
double pequeno = 1e-320;  // Próximo ao mínimo positivo
double underflow = pequeno / 1e10;  // Subnormal

System.out.println(underflow);  // 1.0E-330 (muito pequeno)
```

**Conceito:** Ponto flutuante tem **números subnormais** entre zero e menor normal. Eventualmente, underflow extremo → `0.0`.

**Underflow para Zero:**

```java
double x = Double.MIN_VALUE;  // 4.9e-324 (menor positivo)
double y = x / 2;             // Underflow → 0.0

System.out.println(y);  // 0.0
```

---

## 🔍 Análise Conceitual Profunda

### Detecção Manual de Overflow

**Adição:**

```java
int a = 2_000_000_000;
int b = 200_000_000;

// Verificar antes de somar
if (a > 0 && b > 0 && a > Integer.MAX_VALUE - b) {
    System.out.println("Overflow detectado!");
} else {
    int soma = a + b;
}
```

**Conceito:** Se `a > MAX - b`, então `a + b > MAX` (overflow).

**Multiplicação (Complexo):**

```java
int a = 100_000;
int b = 30_000;

// Verificar: se a != 0 e (a * b) / a != b, houve overflow
long produto = (long) a * b;  // Usa long para calcular sem overflow
if (produto > Integer.MAX_VALUE || produto < Integer.MIN_VALUE) {
    System.out.println("Overflow em int!");
} else {
    int resultado = (int) produto;
}
```

### Math Exact (Java 8+)

**Lança `ArithmeticException` em Overflow:**

```java
int a = Integer.MAX_VALUE;

try {
    int r1 = Math.addExact(a, 1);  // Overflow!
} catch (ArithmeticException e) {
    System.out.println("Overflow capturado!");
}

try {
    int r2 = Math.multiplyExact(50000, 50000);  // Overflow!
} catch (ArithmeticException e) {
    System.out.println("Overflow em multiplicação!");
}
```

**Métodos Disponíveis:**

- `Math.addExact(int, int)`
- `Math.subtractExact(int, int)`
- `Math.multiplyExact(int, int)`
- `Math.incrementExact(int)`
- `Math.decrementExact(int)`
- `Math.negateExact(int)`

**Conceito:** Versões "seguras" de operações — lançam exceção ao invés de wrap-around silencioso.

### Uso de `long` para Prevenir Overflow

**Solução Comum:**

```java
int a = 50000;
int b = 50000;

// Cast para long antes de multiplicar
long produtoSeguro = (long) a * b;  // 2.500.000.000L (OK!)

System.out.println(produtoSeguro);  // 2500000000

// Verificar se cabe em int depois
if (produtoSeguro > Integer.MAX_VALUE) {
    System.out.println("Resultado maior que int suporta");
} else {
    int resultado = (int) produtoSeguro;
}
```

**Conceito:** `long` tem range maior (±9 quintilhões) — posterga overflow.

### BigInteger (Sem Overflow)

**Precisão Arbitrária:**

```java
import java.math.BigInteger;

BigInteger a = new BigInteger("999999999999999999999999");
BigInteger b = new BigInteger("888888888888888888888888");

BigInteger soma = a.add(b);  // Sem overflow!
BigInteger produto = a.multiply(b);  // Sem overflow!

System.out.println(soma);     // 1888888888888888888888887
System.out.println(produto);  // Enorme, mas correto
```

**Conceito:** `BigInteger` usa array de `int` internamente — cresce conforme necessário. **Sem overflow**, mas performance reduzida (não usa primitivos).

### Casos Extremos

**Divisão de MIN_VALUE por -1:**

```java
int min = Integer.MIN_VALUE;  // -2.147.483.648
int divisor = -1;

int resultado = min / divisor;  // Deveria ser 2.147.483.648, mas overflow!

System.out.println(resultado);  // -2147483648 (overflow!)
```

**Conceito:** `-MIN_VALUE` não cabe em `int` — overflow silencioso.

**Conversão long → int:**

```java
long grande = 3_000_000_000L;
int truncado = (int) grande;  // Perda de dados!

System.out.println(truncado);  // -1294967296 (truncamento)
```

**Conceito:** Cast força conversão, mas perde bits mais significativos — equivalente a `(int) (grande % 2^32)`.

---

## 🎯 Aplicabilidade e Contextos

### Quando Validar Overflow

**1. Cálculos Financeiros:**

```java
long saldo = 1_000_000_000L;
double juros = 1.05;  // 5%

// Usar BigDecimal para precisão exata
BigDecimal saldoBD = new BigDecimal("1000000000");
BigDecimal jurosBD = new BigDecimal("1.05");
BigDecimal novoSaldo = saldoBD.multiply(jurosBD);
```

**2. Índices de Array:**

```java
int tamanho = 100_000;
int fator = 30_000;

// Verificar overflow antes de calcular índice
long indice = (long) tamanho * fator;
if (indice > Integer.MAX_VALUE) {
    throw new IllegalArgumentException("Índice muito grande");
}
```

**3. Algoritmos (Busca Binária):**

```java
int low = 0;
int high = Integer.MAX_VALUE;

// ERRADO: (low + high) / 2 pode overflow!
int midErrado = (low + high) / 2;

// CORRETO: Evita overflow
int midCorreto = low + (high - low) / 2;
// Ou: int midCorreto = (low + high) >>> 1;  (shift lógico)
```

### Quando Usar Math Exact

**Crítico (Financeiro, Segurança):**

```java
int quantidade = recuperarQuantidade();
int preco = recuperarPreco();

// Garantir que não há overflow silencioso
int total = Math.multiplyExact(quantidade, preco);
```

### Quando Usar BigInteger

**Sem Limites:**

```java
// Fatorial de números grandes
BigInteger fatorial(int n) {
    BigInteger resultado = BigInteger.ONE;
    for (int i = 2; i <= n; i++) {
        resultado = resultado.multiply(BigInteger.valueOf(i));
    }
    return resultado;
}

System.out.println(fatorial(100));  // 93 dígitos!
```

---

## ⚠️ Limitações e Considerações

### 1. Performance de Verificações

Validação manual ou `Math.exact` adiciona overhead. Para loops intensivos, validar antes do loop:

```java
// Validar limites uma vez
if (fator > Integer.MAX_VALUE / tamanho) {
    throw new ArithmeticException("Overflow esperado");
}

// Loop sem verificações
for (int i = 0; i < n; i++) {
    resultado = tamanho * fator;  // Seguro, já validado
}
```

### 2. BigInteger é Lento

100-1000x mais lento que primitivos. Usar apenas quando necessário:

```java
// Se cabe em long, preferir long
long a = 1_000_000L;
long b = 500_000L;
long produto = a * b;  // OK, cabe em long

// BigInteger só para valores gigantes
```

### 3. Ponto Flutuante Silencioso

`Infinity` e `NaN` propagam silenciosamente:

```java
double x = 1e308 * 10;  // Infinity
double y = x + 100;     // Infinity (propagou)
double z = x / x;       // NaN (indefinido)

// Verificar explicitamente
if (Double.isInfinite(x) || Double.isNaN(x)) {
    throw new ArithmeticException("Overflow/NaN em double");
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Complemento de Dois

Overflow/underflow são consequência direta da representação em complemento de dois.

### Relação com Type Casting

Cast entre tipos pode causar overflow silencioso (`long` → `int`).

### Relação com Segurança

Buffer overflow exploits se baseiam em overflow de índices/tamanhos.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Operadores de Incremento/Decremento (`++`, `--`):** Podem causar overflow
2. **Operadores Bit a Bit:** Shift pode causar overflow
3. **BigDecimal:** Precisão exata para valores decimais
4. **StrictMath:** Comportamento determinístico em ponto flutuante

---

## 📚 Conclusão

**Overflow e underflow** são fenômenos silenciosos em Java onde operações aritméticas excedem limites de representação. Inteiros causam **wrap-around** (envolvem para valor oposto) sem exceção; ponto flutuante retorna **`Infinity`** ou valores subnormais. Problema crítico: overflow silencioso pode gerar bugs sutis em cálculos financeiros, índices e segurança. Soluções: validação manual, `Math.addExact()` / `Math.multiplyExact()` (Java 8+, lançam `ArithmeticException`), usar `long` ao invés de `int`, ou `BigInteger` para precisão arbitrária (sem overflow, mas performance reduzida). Casos críticos: multiplicação de grandes números, `-MIN_VALUE`, conversão `long` → `int`, busca binária (`(low + high) / 2` pode overflow — usar `low + (high - low) / 2`). Compreender overflow/underflow e estratégias de detecção/prevenção é essencial para escrever código numérico robusto e seguro.
