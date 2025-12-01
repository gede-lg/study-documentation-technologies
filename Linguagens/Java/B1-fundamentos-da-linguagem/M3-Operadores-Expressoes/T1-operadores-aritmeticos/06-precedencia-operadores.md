# Precedência de Operadores Aritméticos

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Precedência de operadores** define a **ordem de avaliação** em expressões com múltiplos operadores. Conceitualmente, é sistema de **prioridades hierárquicas** que determina quais operações executam primeiro quando não há parênteses explícitos. Similar à ordem de operações matemática (PEMDAS/BODMAS).

**Exemplo:**

```java
int resultado = 2 + 3 * 4;  // 14, não 20
// Multiplicação tem precedência maior → 3 * 4 = 12 → 2 + 12 = 14
```

**Conceito Fundamental:** Precedência elimina ambiguidade. Sem ela, `2 + 3 * 4` teria duas interpretações possíveis. Precedência estabelece **uma** interpretação padrão.

### Contexto Histórico e Motivação

**Notação Algébrica:**

Matemática estabeleceu ordem de operações séculos atrás (século 16-17). Convenção universal: multiplicação/divisão antes de adição/subtração.

**Linguagens de Programação:**

FORTRAN (1957) codificou precedência matemática em sintaxe de linguagem. Todas as linguagens subsequentes seguiram convenção similar por consistência com matemática e expectativas de programadores.

**Motivação:**

1. **Consistência com Matemática:** Programadores conhecem ordem matemática
2. **Redução de Parênteses:** `a + b * c` mais legível que `a + (b * c)`
3. **Eliminar Ambiguidade:** Expressão tem significado único
4. **Otimização:** Compilador sabe como avaliar eficientemente

### Problema Fundamental que Resolve

**Ambiguidade:**

Sem precedência, `2 + 3 * 4` poderia significar:
- `(2 + 3) * 4` = `20`
- `2 + (3 * 4)` = `14`

Precedência resolve: multiplicação primeiro → `14`.

### Importância no Ecossistema

Precedência é **fundamento de parsing** — compiladores usam para construir árvores de sintaxe abstrata (AST). Programadores devem conhecer para escrever expressões corretas.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Hierarquia:** Operadores têm níveis de precedência
2. **Alta Precedência Executa Primeiro:** `*` antes de `+`
3. **Parênteses Sobrescrevem:** `()` tem precedência máxima
4. **Associatividade:** Desempata operadores mesma precedência
5. **Avaliação Esquerda-para-Direita:** Padrão para operadores aritméticos

### Pilares Fundamentais

- **Mathematical Consistency:** Segue ordem matemática padrão
- **Hierarchical Levels:** Múltiplos níveis de precedência
- **Parentheses Override:** `()` forçam ordem específica
- **Left-to-Right Associativity:** `+`, `-`, `*`, `/`, `%` associam à esquerda
- **Deterministic Evaluation:** Expressão tem significado único

---

## 🧠 Fundamentos Teóricos

### Tabela de Precedência (Operadores Aritméticos)

**Maior Precedência (Avalia Primeiro) → Menor:**

1. **`()`** — Parênteses (forçam avaliação)
2. **`+`, `-`** (unários) — Positivo/negativo
3. **`*`, `/`, `%`** — Multiplicação, divisão, módulo
4. **`+`, `-`** (binários) — Adição, subtração

**Exemplo Completo:**

```java
int r = -5 + 3 * 4 / 2 - 1;
// Passo 1: Unário → -5
// Passo 2: * → 3 * 4 = 12
// Passo 3: / → 12 / 2 = 6
// Passo 4: + (esquerda-direita) → -5 + 6 = 1
// Passo 5: - → 1 - 1 = 0
```

### Multiplicação, Divisão, Módulo (`*`, `/`, `%`)

**Precedência Alta (Executam Antes de `+`, `-`):**

```java
int r1 = 10 + 5 * 2;     // 10 + 10 = 20
int r2 = 10 - 8 / 4;     // 10 - 2 = 8
int r3 = 15 + 10 % 3;    // 15 + 1 = 16
```

**Conceito:** `*`, `/`, `%` têm **mesma precedência** entre si (resolvido por associatividade).

### Adição e Subtração (`+`, `-`)

**Precedência Baixa (Executam Após `*`, `/`, `%`):**

```java
int r1 = 2 + 3 - 1;      // (2 + 3) - 1 = 4 (esquerda-direita)
int r2 = 10 - 5 + 2;     // (10 - 5) + 2 = 7
```

### Parênteses (`()`)

**Precedência Máxima (Forçam Avaliação):**

```java
int r1 = (2 + 3) * 4;    // 5 * 4 = 20 (parênteses forçam adição primeiro)
int r2 = 2 + (3 * 4);    // 2 + 12 = 14 (redundante, mas explícito)
```

**Aninhamento:**

```java
int r = ((2 + 3) * (4 - 1)) / 5;  // (5 * 3) / 5 = 15 / 5 = 3
```

**Conceito:** Parênteses mais internos avaliam primeiro.

---

## 🔍 Análise Conceitual Profunda

### Associatividade Esquerda-para-Direita

**Operadores Mesma Precedência:**

Quando operadores têm **mesma precedência**, associatividade determina ordem.

**Exemplo: `*`, `/`, `%` (Mesma Precedência):**

```java
int r = 12 / 3 * 2;  // (12 / 3) * 2 = 4 * 2 = 8
// Não: 12 / (3 * 2) = 12 / 6 = 2
```

**Associatividade Esquerda:** Agrupa da esquerda para direita.

**Exemplo: `+`, `-` (Mesma Precedência):**

```java
int r = 10 - 5 + 2;  // (10 - 5) + 2 = 5 + 2 = 7
// Não: 10 - (5 + 2) = 10 - 7 = 3
```

### Exemplos Complexos

**Exemplo 1:**

```java
int r = 2 + 3 * 4 - 5 / 2;
// Passo 1: 3 * 4 = 12
// Passo 2: 5 / 2 = 2 (divisão inteira)
// Passo 3: 2 + 12 = 14
// Passo 4: 14 - 2 = 12
```

**Exemplo 2:**

```java
int r = 100 / 10 * 5 + 20 % 3 - 2;
// Passo 1: 100 / 10 = 10
// Passo 2: 10 * 5 = 50
// Passo 3: 20 % 3 = 2
// Passo 4: 50 + 2 = 52
// Passo 5: 52 - 2 = 50
```

**Exemplo 3 (Com Parênteses):**

```java
int r = (10 + 5) * (20 - 3) / 5;
// Passo 1: (10 + 5) = 15
// Passo 2: (20 - 3) = 17
// Passo 3: 15 * 17 = 255
// Passo 4: 255 / 5 = 51
```

### Operadores Unários

**Precedência Alta (Antes de Binários):**

```java
int r1 = -5 + 3;   // (-5) + 3 = -2
int r2 = -2 * 3;   // (-2) * 3 = -6
```

**Conceito:** Unário `-` tem precedência **maior** que binários.

**Confusão Comum:**

```java
int x = 5;
int r = -x++;  // -(x++) = -5, depois x = 6
// Não: (-x)++ (inválido)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Parênteses

**Clareza:** Mesmo quando não necessários:

```java
int media = (soma1 + soma2) / 2;  // Claro, embora + já tenha precedência
```

**Forçar Ordem:**

```java
int r = (2 + 3) * 4;  // Parênteses necessários para 20 (vs 14)
```

**Legibilidade:** Expressões complexas:

```java
// Sem parênteses (correto mas difícil ler)
int r = a * b + c / d - e % f;

// Com parênteses (mais legível)
int r = (a * b) + (c / d) - (e % f);
```

### Armadilhas Comuns

**1. Esquecer Precedência:**

```java
int media = soma1 + soma2 / 2;  // ERRADO: soma1 + (soma2 / 2)
int correto = (soma1 + soma2) / 2;  // Certo
```

**2. Divisão Inteira:**

```java
double r = 10 / 4 + 0.5;  // 2.0 + 0.5 = 2.5 (divisão inteira primeiro!)
double correto = 10.0 / 4 + 0.5;  // 2.5 + 0.5 = 3.0
```

---

## ⚠️ Limitações e Considerações

### 1. Complexidade

Expressões muito complexas são difíceis de ler mesmo com precedência correta.

**Mitigação:** Quebrar em etapas:

```java
// Complexo
int r = (a + b) * (c - d) / (e + f) % g;

// Melhor
int soma1 = a + b;
int diff = c - d;
int soma2 = e + f;
int produto = soma1 * diff;
int divisao = produto / soma2;
int resto = divisao % g;
```

### 2. Precedência Varia Entre Linguagens

Java segue C/C++, mas outras linguagens podem diferir (ex: Python `**` para potenciação).

---

## 🔗 Interconexões Conceituais

### Relação com Parsing

Compiladores usam gramáticas baseadas em precedência para parsear expressões.

### Relação com AST (Abstract Syntax Tree)

Precedência determina estrutura da árvore de sintaxe.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Precedência Completa:** Incluir relacionais, lógicos, bit a bit
2. **Associatividade Direita:** Operadores como `=`, `? :`
3. **Short-Circuit:** `&&`, `||` e avaliação parcial

---

## 📚 Conclusão

**Precedência de operadores aritméticos** define ordem de avaliação em expressões, seguindo convenção matemática: `*`, `/`, `%` antes de `+`, `-`. Parênteses têm precedência máxima e forçam ordem específica. Operadores mesma precedência usam associatividade esquerda-para-direita. Compreender precedência é essencial para escrever expressões corretas e evitar bugs sutis. Parênteses explícitos melhoram legibilidade, especialmente em expressões complexas. Expressões muito complexas devem ser quebradas em etapas intermediárias para clareza e manutenibilidade.
