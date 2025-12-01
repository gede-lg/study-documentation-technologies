# Operador de Divisão (/)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Operador de divisão (`/`)** é operador aritmético binário que calcula o **quociente** da divisão do operando esquerdo pelo direito. Em Java, comportamento varia drasticamente dependendo dos tipos: **divisão inteira** (trunca decimal) ou **divisão de ponto flutuante** (preserva fração).

**Sintaxe:**

```java
int divInteira = 7 / 2;      // 3 (não 3.5!)
double divFlutuante = 7.0 / 2.0;  // 3.5
double mista = 7 / 2.0;      // 3.5 (um operando double → resultado double)
```

**Conceito Fundamental:** Se **ambos** operandos são inteiros, resultado é inteiro (truncado). Se **qualquer** operando é ponto flutuante, resultado é ponto flutuante.

### Contexto Histórico e Motivação

**Divisão Inteira vs Flutuante:**

Linguagens antigas (C, Pascal) distinguiam entre divisão inteira (`div`) e real (`/`). Java herdou de C abordagem de **tipo determina comportamento** — mesma sintaxe (`/`), semântica diferente baseada em tipos.

**Motivação:**

1. **Eficiência:** Divisão inteira é mais rápida (hardware)
2. **Controle:** Programador escolhe via tipos (int vs double)
3. **Compatibilidade:** Seguir precedente de C

**Trade-off:** Conveniência (sintaxe única) vs confusão (comportamentos diferentes).

### Problema Fundamental que Resolve

**1. Cálculos de Média:** `media = soma / quantidade`
**2. Distribuição:** `porPessoa = total / numeroPessoas`
**3. Conversões:** `horas = minutos / 60`
**4. Razões/Proporções:** `proporcao = parte / todo`

### Importância no Ecossistema

Divisão é essencial em:
- **Estatística:** Médias, percentis
- **Física:** Velocidade = distância / tempo
- **Finanças:** Preço por unidade
- **Algoritmos:** Busca binária, divisão e conquista

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Comportamento Dual:** Inteira (trunca) vs Flutuante (preserva)
2. **Divisão por Zero:** `ArithmeticException` (inteiros) ou `Infinity`/`NaN` (float/double)
3. **Não-Comutativo:** `a / b` ≠ `b / a`
4. **Precedência Alta:** Mesma de `*`
5. **Truncamento:** Divisão inteira descarta parte decimal

### Pilares Fundamentais

- **Type-Dependent Behavior:** Tipos determinam se inteira ou flutuante
- **Integer Division Truncates:** `7 / 2 = 3`, não `3.5`
- **Division by Zero:** Comportamento diferente para int vs float
- **Non-Commutative:** Ordem importa
- **Promotion Rules:** Operando float/double faz resultado float/double

---

## 🧠 Fundamentos Teóricos

### Divisão Inteira

**Ambos Inteiros → Resultado Inteiro (Truncado):**

```java
int a = 7, b = 2;
int quociente = a / b;  // 3 (não 3.5 — decimal descartado!)

int x = 10, y = 3;
int resultado = x / y;  // 3 (não 3.333...)
```

**Conceito:** Parte decimal é **truncada** (não arredondada) — `7 / 2` = `3`, não `4`.

**Truncamento vs Arredondamento:**

```java
int trunc = 7 / 2;        // 3 (truncado)
int arred = (int) Math.round(7.0 / 2.0);  // 4 (arredondado)
```

### Divisão de Ponto Flutuante

**Qualquer Operando Float/Double → Resultado Float/Double:**

```java
double a = 7.0, b = 2.0;
double resultado = a / b;  // 3.5

double mista = 7 / 2.0;    // 3.5 (int promovido a double)
float f = 7.0f / 2.0f;     // 3.5f
```

**Conceito:** Se **qualquer** operando é ponto flutuante, operação é ponto flutuante.

**Conversão Explícita:**

```java
int a = 7, b = 2;
double correto = (double) a / b;  // 3.5 (cast promove cálculo)

// Alternativa
double resultado = a / (double) b;  // 3.5
```

### Divisão por Zero

**Inteiros: `ArithmeticException`**

```java
int x = 10;
// int resultado = x / 0;  // RUNTIME ERROR: ArithmeticException: / by zero
```

**Conceito:** Divisão inteira por zero lança exceção em runtime (não compile-time!).

**Ponto Flutuante: `Infinity` ou `NaN`**

```java
double x = 10.0;
double inf = x / 0.0;       // Infinity
double negInf = -x / 0.0;   // -Infinity
double nan = 0.0 / 0.0;     // NaN (indefinido)

System.out.println(inf);    // Infinity
System.out.println(Double.isInfinite(inf));  // true
```

**Conceito:** Ponto flutuante não lança exceção — retorna valores especiais (`Infinity`, `NaN`).

---

## 🔍 Análise Conceitual Profunda

### Armadilha: Divisão Inteira Acidental

**Problema Comum:**

```java
int a = 5, b = 2;
double resultado = a / b;  // 2.0, não 2.5!
```

**Por Quê?**

1. `a / b` é divisão inteira (ambos int) → resultado `2`
2. `2` é atribuído a `double` → convertido para `2.0`

**Solução:**

```java
double correto = (double) a / b;  // 2.5
// ou
double correto2 = a / (double) b;  // 2.5
// ou
double correto3 = 1.0 * a / b;    // 2.5 (multiplicar por 1.0 promove)
```

### Precedência e Associatividade

**Mesma Precedência de `*`, `%`:**

```java
int r = 10 + 20 / 5;  // 10 + 4 = 14 (divisão primeiro)
int r2 = (10 + 20) / 5;  // 30 / 5 = 6
```

**Associatividade Esquerda:**

```java
int r = 100 / 5 / 2;  // (100 / 5) / 2 = 20 / 2 = 10
```

### Cálculo de Média (Armadilha Clássica)

**Errado:**

```java
int soma = 10 + 15 + 20;  // 45
int quantidade = 3;
double media = soma / quantidade;  // 15.0 (deveria ser 15.0, coincidência!)

// Mas:
int soma2 = 10 + 11;  // 21
double media2 = soma2 / 2;  // 10.0, não 10.5!
```

**Correto:**

```java
int soma = 10 + 11;
double media = (double) soma / 2;  // 10.5
// ou
double media = soma / 2.0;  // 10.5
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Divisão Inteira

**Distribuição de Itens:**

```java
int itens = 10;
int pessoas = 3;
int porPessoa = itens / pessoas;  // 3 (cada um recebe 3)
int sobra = itens % pessoas;       // 1 (1 item sobra)
```

**Conversões (Truncar):**

```java
int segundos = 125;
int minutos = segundos / 60;  // 2 minutos (trunca 5 segundos)
```

### Quando Usar Divisão Flutuante

**Médias:**

```java
double media = soma / (double) quantidade;
```

**Percentagens:**

```java
double percentual = (acertos / (double) total) * 100;
```

**Cálculos Científicos:**

```java
double velocidade = distancia / tempo;
```

---

## ⚠️ Limitações e Considerações

### 1. Divisão por Zero (Inteiros)

```java
int x = 10 / 0;  // ArithmeticException em runtime
```

**Mitigação:**

```java
if (divisor != 0) {
    int resultado = dividendo / divisor;
} else {
    // Tratar erro
}
```

### 2. Precisão de Ponto Flutuante

```java
double x = 1.0 / 3.0;  // 0.3333333333333333 (impreciso)
```

**Mitigação:** `BigDecimal` para precisão exata.

### 3. Divisão Inteira Acidental

```java
double media = soma / quantidade;  // Se ambos int, trunca!
```

**Mitigação:** Cast explícito: `(double) soma / quantidade`

---

## 🔗 Interconexões Conceituais

### Relação com Multiplicação

Operações inversas: `(a / b) * b ≈ a` (se não houver truncamento/overflow)

### Relação com Módulo

`a / b` = quociente, `a % b` = resto

### Relação com Arredondamento

Divisão inteira trunca; arredondar requer `Math.round()`

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Módulo (`%`):** Resto da divisão
2. **Divisão Inteira vs Flutuante:** Comparação detalhada
3. **`Math.floorDiv()`:** Divisão inteira com arredondamento para baixo (Java 8+)
4. **Operadores Compostos (`/=`):** `x /= 5`

---

## 📚 Conclusão

**Operador de divisão (`/`)** tem comportamento dual: divisão inteira (trunca decimal) se ambos operandos são inteiros, ou divisão flutuante (preserva fração) se qualquer operando é float/double. Divisão inteira por zero lança `ArithmeticException`; flutuante retorna `Infinity`/`NaN`. Armadilha comum: `int / int` resulta em int truncado, mesmo atribuído a double. Solução: cast explícito para double antes da divisão. Precedência igual a `*`, associatividade esquerda. Amplamente usado em médias, distribuições, conversões e cálculos científicos. Compreender distinção inteira vs flutuante é crítico para evitar bugs sutis de truncamento em cálculos numéricos.
