# Literais de Ponto Flutuante

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Literais de ponto flutuante** são **representações diretas de valores numéricos fracionários no código-fonte Java**, expressando números reais com parte decimal ou notação científica. Conceitualmente, são **aproximações de números reais** representadas em formato binário IEEE 754, permitindo expressar valores como `3.14`, `0.001`, ou `6.022e23` (notação científica).

Diferentemente de literais inteiros (valores exatos), ponto flutuante é **aproximação**: nem todos os números decimais podem ser representados exatamente em binário. `0.1` em decimal é **dizima periódica** em binário, causando pequenos erros de arredondamento.

Java suporta **dois tipos de ponto flutuante**:

1. **`float`:** 32 bits, precisão simples (~7 dígitos decimais significativos), sufixo `f` ou `F`
2. **`double`:** 64 bits, precisão dupla (~15 dígitos decimais significativos), **tipo padrão** (opcional sufixo `d` ou `D`)

**Sintaxe de Literais:**

```java
double pi = 3.14159;          // Decimal padrão (double)
float temperatura = 36.5f;    // Requer sufixo f
double notacao = 1.23e4;      // Notação científica: 1.23 × 10⁴ = 12300.0
double hex = 0x1.8p3;         // Hex float (raro): 1.5 × 2³ = 12.0
```

### Contexto Histórico e Motivação

**IEEE 754 Standard (1985):**

Antes de 1985, cada fabricante de hardware tinha representação própria de ponto flutuante, causando incompatibilidades. IEEE padronizou formato binário, garantindo **portabilidade** e **consistência** entre plataformas.

Java adotou IEEE 754 desde versão 1.0 (1996), garantindo que `3.14f` representa **exatamente o mesmo valor binário** em Windows, Linux, ARM, x86 — fundamental para filosofia "Write Once, Run Anywhere".

**Motivação para Ponto Flutuante:**

**Problema:** Computadores representam números em binário. Inteiros são exatos, mas frações?

- `1/2 = 0.5` → `0.1` binário (exato)
- `1/3 = 0.333...` → dizima periódica decimal **e binário**
- `1/10 = 0.1` → dizima periódica em binário! (`0.0001100110011...`)

**Solução:** **Ponto Flutuante** — formato que armazena:
1. **Sinal** (1 bit): positivo/negativo
2. **Expoente** (8 bits float, 11 bits double): magnitude
3. **Mantissa** (23 bits float, 52 bits double): dígitos significativos

Permite representar **faixa enorme** de valores (`±1.7e308` em double) com **precisão limitada**.

**Evolução em Java:**

- **Java 1.0 (1996):** `float`, `double` seguindo IEEE 754
- **Java 1.2 (1998):** StrictFP para garantir reprodutibilidade bit-a-bit (controle de otimizações de FPU)
- **Java 7 (2011):** Underscores em literais float (`1_000.5f`)
- **Java 5+ (2004):** Hex float literals (`0x1.8p3`)

### Problema Fundamental que Resolve

**1. Representação de Números Reais:**

Matemática e ciência usam números reais (π, e, √2). Ponto flutuante permite **aproximar** esses valores em computador.

**2. Faixa Dinâmica:**

Inteiros têm faixa limitada (`int`: ±2 bilhões). `double` representa de `~10⁻³⁰⁸` a `~10³⁰⁸` — **astronômico** a **subatômico**.

**3. Cálculos Científicos:**

Física, engenharia, finanças exigem frações. Ponto flutuante viabiliza essas aplicações.

**4. Padronização:**

IEEE 754 garante que cálculos produzem mesmos resultados em qualquer plataforma — crítico para reprodutibilidade científica.

### Importância no Ecossistema

Literais de ponto flutuante são essenciais em:

- **Matemática/Ciência:** `double g = 9.81;` (gravidade)
- **Gráficos:** Coordenadas, transformações (`float x = 1.5f;`)
- **Finanças:** Taxas de juros (`double taxa = 0.05;` — 5%)
- **Machine Learning:** Pesos, gradientes (`float weight = 0.123f;`)
- **Física/Simulações:** Constantes (`double c = 299792458.0;` — velocidade da luz)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Tipo Padrão `double`:** Literais sem sufixo são `double` (64 bits)
2. **Sufixo `f` para `float`:** `float` requer `f` ou `F` obrigatório
3. **Notação Científica:** `1.23e4` = `1.23 × 10⁴`
4. **Aproximação:** Ponto flutuante é **aproximação**, não exato
5. **Valores Especiais:** `Infinity`, `-Infinity`, `NaN` (Not a Number)

### Pilares Fundamentais

- **IEEE 754 Compliance:** Representação binária padronizada
- **Finite Precision:** Precisão limitada (7 dígitos float, 15 double)
- **Range vs Precision:** Faixa enorme, precisão relativa
- **Rounding Errors:** Erros inevitáveis de arredondamento
- **Special Values:** `∞`, `-∞`, `NaN` representam condições especiais

### Nuances Importantes

- **`0.1 + 0.2 ≠ 0.3`:** Erro de arredondamento binário
- **Comparação com `==`:** Evitar — usar tolerância (`Math.abs(a - b) < epsilon`)
- **`float` vs `double`:** `float` economiza memória, `double` mais preciso
- **Overflow:** `1.0e308 * 10` = `Infinity`
- **Underflow:** Valores muito pequenos → `0.0`

---

## 🧠 Fundamentos Teóricos

### Literais Decimais (Notação Padrão)

**Sintaxe:**

```java
double d1 = 3.14;
double d2 = 0.001;
double d3 = 1234.5678;

float f1 = 3.14f;
float f2 = 0.5f;
```

**Conceito:** Ponto decimal separa parte inteira de fracionária. **Ponto** (`.`), não vírgula (Java usa convenção americana).

**Obrigatoriedade de Sufixo:**

```java
double x = 3.14;    // OK: padrão é double
float y = 3.14;     // ERRO: literal double não pode ser atribuído a float
float z = 3.14f;    // OK: sufixo f
```

**Por Que Erro?** `3.14` sem sufixo é `double` (64 bits). Atribuir a `float` (32 bits) perderia precisão — compilador exige explicitação com `f`.

**Casos Especiais:**

```java
double zero = 0.0;
double umInteiro = 1.0;  // Tecnicamente double, mas valor é 1
```

**Conceito:** `.0` torna literal ponto flutuante, mesmo sem parte fracionária.

### Notação Científica (Exponencial)

**Formato:** `<mantissa>e<expoente>` ou `<mantissa>E<expoente>`

**Significado:** `mantissa × 10^expoente`

**Sintaxe:**

```java
double numeroAvogadro = 6.022e23;     // 6.022 × 10²³
double cargaEletron   = 1.602e-19;    // 1.602 × 10⁻¹⁹
double bilhao         = 1e9;          // 1 × 10⁹ = 1.000.000.000
double milesimo       = 1e-3;         // 1 × 10⁻³ = 0.001

float velocidadeLuz = 3.0e8f;         // 3.0 × 10⁸ m/s
```

**Conceito:** Notação científica permite expressar números muito grandes ou muito pequenos de forma compacta e legível.

**Equivalências:**

```java
double a = 1.23e4;   // 12300.0
double b = 12300.0;
System.out.println(a == b);  // true
```

**Expoente Negativo:**

```java
double pequeno = 5.5e-4;  // 0.00055
```

**Conceito:** `e-4` significa dividir por `10⁴` (10.000).

### Literais Hexadecimais de Ponto Flutuante

**Sintaxe (Java 5+):** `0x<hex-digits>.P<binary-exponent>`

**Formato:** `0x<mantissa>p<expoente-binario>`

**Significado:** `mantissa × 2^expoente`

**Exemplo:**

```java
double hex1 = 0x1.0p0;   // 1.0 × 2⁰ = 1.0
double hex2 = 0x1.8p3;   // 1.5 × 2³ = 12.0
double hex3 = 0xA.Bp2;   // 10.6875 × 2² = 42.75
```

**Conversão Detalhada:**

`0x1.8p3`:
- `1.8` hex = `1` + `8/16` = `1.5` decimal
- `p3` = `× 2³` = `× 8`
- Resultado: `1.5 × 8 = 12.0`

**Uso:** Raramente usado, útil para representar valores **exatos** em binário (evitar arredondamento).

**Exemplo Prático:**

```java
// Representação exata de 0.1 é impossível em decimal, mas possível em hex float
double umDecimo_inexato = 0.1;           // Aproximação
double umDecimo_exato   = 0x1.999999999999ap-4;  // Valor binário exato mais próximo
```

**Conceito:** Hex float expõe representação binária subjacente, útil para debugging ou quando exatidão binária importa.

### Tipo Padrão e Sufixos

**Padrão: `double`**

```java
double d = 3.14;  // double por padrão
```

**Float Requer Sufixo:**

```java
float f1 = 3.14f;   // Sufixo f (minúsculo)
float f2 = 3.14F;   // Sufixo F (maiúsculo)
```

**Double com Sufixo Opcional:**

```java
double d1 = 3.14;   // Padrão, sem sufixo
double d2 = 3.14d;  // Sufixo d explícito (raro)
double d3 = 3.14D;  // Sufixo D explícito
```

**Conceito:** `d`/`D` são redundantes (double é padrão), raramente usados. `f`/`F` são **obrigatórios** para `float`.

**Erro Comum:**

```java
// float x = 3.14;  // ERRO: possível perda de precisão
float x = (float) 3.14;  // OK: cast explícito
float y = 3.14f;         // OK: sufixo f
```

### Valores Especiais

**Infinity (Infinito):**

```java
double posInf = Double.POSITIVE_INFINITY;  // +∞
double negInf = Double.NEGATIVE_INFINITY;  // -∞

double overflow = 1.0e308 * 10;  // Infinity (overflow)
double divZero  = 1.0 / 0.0;     // Infinity
```

**Conceito:** Operações que excedem faixa de `double` resultam em `Infinity`.

**NaN (Not a Number):**

```java
double nan1 = Double.NaN;
double nan2 = 0.0 / 0.0;        // NaN (operação indefinida)
double nan3 = Math.sqrt(-1.0);  // NaN (raiz de negativo)
```

**Conceito:** `NaN` representa resultado indefinido ou inválido.

**Propriedades de NaN:**

```java
double nan = Double.NaN;
System.out.println(nan == nan);  // false! NaN ≠ NaN
System.out.println(Double.isNaN(nan));  // true
```

**Conceito Crítico:** `NaN` é **única valor que não é igual a si mesmo**. Sempre use `Double.isNaN()` para verificar.

**Checking for Special Values:**

```java
double x = 1.0 / 0.0;

if (Double.isInfinite(x)) {
    System.out.println("Infinito!");
}

if (Double.isNaN(x)) {
    System.out.println("NaN!");
}

if (Double.isFinite(x)) {  // Java 8+
    System.out.println("Valor finito normal");
}
```

### Precisão e Limites

**Float (32 bits):**

```java
float minPositive = Float.MIN_VALUE;    // ~1.4e-45 (menor positivo)
float maxValue    = Float.MAX_VALUE;    // ~3.4e38
int precision     = ~7;  // dígitos decimais significativos
```

**Double (64 bits):**

```java
double minPositive = Double.MIN_VALUE;   // ~4.9e-324
double maxValue    = Double.MAX_VALUE;   // ~1.7e308
int precision      = ~15;  // dígitos decimais significativos
```

**Exemplo de Perda de Precisão:**

```java
float f = 123456789.0f;
System.out.println(f);  // 1.23456792E8 (arredondado, 7 dígitos)

double d = 123456789.0;
System.out.println(d);  // 1.23456789E8 (exato para esse valor)
```

**Conceito:** `float` perde precisão após ~7 dígitos; `double` após ~15.

---

## 🔍 Análise Conceitual Profunda

### Problema de Representação Binária

**Por Que `0.1 + 0.2 ≠ 0.3`?**

```java
double resultado = 0.1 + 0.2;
System.out.println(resultado);  // 0.30000000000000004 (!)
System.out.println(resultado == 0.3);  // false
```

**Explicação:**

Decimal `0.1` = binário `0.0001100110011001100...` (dizima periódica infinita).

`double` tem 52 bits de mantissa — armazena aproximação:
```
0.1 ≈ 0.1000000000000000055511151231257827...
0.2 ≈ 0.2000000000000000111022302462515654...
soma = 0.3000000000000000444089209850062616...
```

**Conceito:** Maioria das frações decimais não tem representação exata em binário — erros de arredondamento são **inevitáveis**.

**Comparação Correta:**

```java
double a = 0.1 + 0.2;
double b = 0.3;

double epsilon = 1e-9;  // Tolerância
if (Math.abs(a - b) < epsilon) {
    System.out.println("Aproximadamente iguais");
}
```

**Conceito:** Comparar floats com `==` é armadilha. Use **tolerância** (epsilon).

### Underscores em Literais Float

**Sintaxe (Java 7+):**

```java
double grande = 1_000_000.5;
double preciso = 3.141_592_653_589;
float notacao = 6.022_140_76e23f;  // Número de Avogadro
```

**Regras:** Mesmas de inteiros — não em extremidades, não antes/depois de ponto/expoente.

**Exemplos Inválidos:**

```java
// double x = _1.5;      // ERRO
// double y = 1_.5;      // ERRO
// double z = 1._5;      // ERRO
// double w = 1.5_;      // ERRO
// double v = 1.5e_10;   // ERRO
```

**Conceito:** Underscores melhoram legibilidade, ignorados pelo compilador.

### Float vs Double: Trade-offs

**Memory:**

- `float`: 4 bytes por valor
- `double`: 8 bytes por valor

**Uso de Float:**

- **Arrays grandes:** `float[] vertices = new float[1_000_000];` economiza 4MB vs `double[]`
- **GPUs:** Muitas GPUs otimizadas para `float`
- **Gráficos 3D:** Coordenadas, cores usam `float`

**Uso de Double:**

- **Cálculos Científicos:** Precisão crítica
- **Finanças:** Minimizar erros de arredondamento (ou usar `BigDecimal`)
- **Default Java:** Maioria das APIs retorna `double` (`Math.sqrt()`, etc.)

**Exemplo:**

```java
// Gráficos (performance > precisão)
float posX = 1.5f;
float posY = 2.3f;

// Ciência (precisão > performance)
double constantePlanck = 6.62607015e-34;
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Float vs Double

**Usar `float`:**

- Arrays muito grandes (economia de memória)
- Gráficos, jogos (performance)
- APIs que exigem `float` (OpenGL, Android Canvas)

**Usar `double`:**

- Cálculos matemáticos/científicos
- Default para a maioria dos casos
- Quando precisão importa

**Evitar Para Finanças:**

```java
// ❌ ERRADO para dinheiro
double preco = 0.1 + 0.2;  // 0.30000000000000004

// ✅ CORRETO para finanças
BigDecimal preco = new BigDecimal("0.1").add(new BigDecimal("0.2"));  // 0.3 exato
```

**Conceito:** Ponto flutuante **não é apropriado para dinheiro** — erros de arredondamento acumulam. Use `BigDecimal`.

### Cenários Práticos

**Cenário 1: Constantes Científicas**

```java
public static final double VELOCIDADE_LUZ = 299_792_458.0;  // m/s
public static final double GRAVIDADE = 9.80665;             // m/s²
public static final double PI = 3.141592653589793;
```

**Cenário 2: Coordenadas Gráficas**

```java
float x = 100.5f;
float y = 200.75f;
canvas.drawCircle(x, y, 50.0f, paint);
```

**Cenário 3: Cálculos Estatísticos**

```java
double media = soma / quantidade;
double desvioPadrao = Math.sqrt(variancia);
```

---

## ⚠️ Limitações e Considerações

### 1. Erros de Arredondamento

```java
double x = 0.1;
for (int i = 0; i < 10; i++) {
    x += 0.1;
}
System.out.println(x);  // 1.0999999999999999, não 1.1
```

**Mitigação:** Aceitar imprecisão ou usar `BigDecimal`.

### 2. Comparação com `==`

```java
double a = 0.1 * 3;
double b = 0.3;
System.out.println(a == b);  // false (!)
```

**Mitigação:** Usar tolerância.

### 3. Performance

Operações float são mais rápidas em algumas CPUs, mas diferença é mínima em aplicações típicas.

---

## 🔗 Interconexões Conceituais

### Relação com IEEE 754

Java segue IEEE 754 rigorosamente, garantindo portabilidade.

### Relação com `Math` Class

`Math.sqrt()`, `Math.sin()`, etc. retornam `double`.

### Relação com Wrapper Classes

`Float` e `Double` encapsulam primitivos, oferecem métodos utilitários.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **BigDecimal:** Aritmética decimal precisa para finanças
2. **Math Class:** Funções matemáticas avançadas
3. **Formatação:** `String.format()`, `NumberFormat`

---

## 📚 Conclusão

**Literais de ponto flutuante** representam números fracionários em Java, seguindo padrão IEEE 754 para portabilidade. Tipo padrão é `double` (64 bits, ~15 dígitos precisão); `float` (32 bits, ~7 dígitos) requer sufixo `f`. Suportam notação decimal (`3.14`) e científica (`6.02e23`). Ponto flutuante é **aproximação** — erros de arredondamento são inevitáveis, especialmente para frações decimais como `0.1`. Comparação com `==` é armadilha; usar tolerância. Valores especiais (`Infinity`, `NaN`) representam overflow e operações inválidas. Apropriado para cálculos científicos/matemáticos, mas **não para finanças** (usar `BigDecimal`). Trade-off fundamental é precisão vs faixa — ponto flutuante sacrifica exatidão absoluta por capacidade de representar valores astronômicos e subatômicos na mesma variável.
