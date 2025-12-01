# Tabela Completa de Precedência de Operadores

## 🎯 Introdução e Definição

### Definição Conceitual

A **precedência de operadores** determina a **ordem** em que os operadores são avaliados em uma expressão que contém múltiplos operadores. Operadores com **maior precedência** são avaliados **antes** de operadores com menor precedência.

**Analogia**: Assim como na matemática `2 + 3 * 4` resulta em `14` (não `20`), porque a multiplicação tem precedência sobre a adição, em Java a precedência determina a ordem de avaliação.

**Exemplo fundamental**:
```java
int resultado = 2 + 3 * 4;  // 14, não 20
// Avaliação: 2 + (3 * 4) = 2 + 12 = 14
// '*' tem maior precedência que '+'
```

**Por que é importante**:
- ✅ Compreender como expressões complexas são avaliadas
- ✅ Evitar bugs sutis causados por ordem de avaliação incorreta
- ✅ Escrever código claro e previsível
- ✅ Evitar uso excessivo de parênteses desnecessários

---

## 📋 Sumário Conceitual

### Estrutura da Precedência

Java possui **15 níveis** de precedência (do maior para o menor):

**Nível 1 (MAIS ALTA)**: Pós-fixos, acesso a membros
**Nível 2**: Unários, cast
**Nível 3**: Multiplicativos
**Nível 4**: Aditivos
**Nível 5**: Shift
**Nível 6**: Relacionais
**Nível 7**: Igualdade
**Nível 8**: AND bit a bit
**Nível 9**: XOR bit a bit
**Nível 10**: OR bit a bit
**Nível 11**: AND lógico
**Nível 12**: OR lógico
**Nível 13**: Ternário
**Nível 14**: Atribuição
**Nível 15 (MAIS BAIXA)**: Lambda

**Regra geral**: Operadores com **maior precedência** são avaliados **primeiro**.

---

## 🧠 Fundamentos Teóricos

### 1. Tabela Completa de Precedência (Detalhada)

| Nível | Operadores | Categoria | Associatividade | Descrição |
|-------|-----------|-----------|----------------|-----------|
| **1** | `expr++` `expr--` | Pós-fixo | Esq → Dir | Incremento/decremento pós-fixado |
| **1** | `()` `[]` `.` | Acesso | Esq → Dir | Chamada método, acesso array, membro |
| **2** | `++expr` `--expr` | Prefixo | Dir → Esq | Incremento/decremento prefixado |
| **2** | `+expr` `-expr` | Unário | Dir → Esq | Mais/menos unário |
| **2** | `!` `~` | Unário | Dir → Esq | Negação lógica, complemento bit a bit |
| **2** | `(type)` | Cast | Dir → Esq | Conversão de tipo |
| **3** | `*` `/` `%` | Multiplicativo | Esq → Dir | Multiplicação, divisão, módulo |
| **4** | `+` `-` | Aditivo | Esq → Dir | Adição, subtração |
| **5** | `<<` `>>` `>>>` | Shift | Esq → Dir | Shift de bits |
| **6** | `<` `<=` `>` `>=` | Relacional | Esq → Dir | Comparação |
| **6** | `instanceof` | Tipo | Esq → Dir | Verificação de tipo |
| **7** | `==` `!=` | Igualdade | Esq → Dir | Igualdade, desigualdade |
| **8** | `&` | AND bit a bit | Esq → Dir | AND binário |
| **9** | `^` | XOR bit a bit | Esq → Dir | XOR binário |
| **10** | `\|` | OR bit a bit | Esq → Dir | OR binário |
| **11** | `&&` | AND lógico | Esq → Dir | AND lógico (curto-circuito) |
| **12** | `\|\|` | OR lógico | Esq → Dir | OR lógico (curto-circuito) |
| **13** | `? :` | Ternário | Dir → Esq | Operador condicional |
| **14** | `=` `+=` `-=` etc | Atribuição | Dir → Esq | Atribuição e compostos |
| **15** | `->` | Lambda | Dir → Esq | Expressão lambda |

### 2. Níveis de Precedência Detalhados

#### **Nível 1 - MAIOR PRECEDÊNCIA**

**Operadores pós-fixos e acesso**:
```java
int[] arr = {1, 2, 3};
int x = 5;

// Pós-fixo
x++;        // x = 6
arr[0]++;   // arr[0] = 2

// Acesso a membros
String s = "abc";
int len = s.length();  // Chamada de método

// Array
int val = arr[0];      // Acesso a array

// Múltiplos acessos
obj.campo.metodo()[0]  // Avaliado da esquerda para direita
```

**Exemplos de precedência**:
```java
int[] arr = {1, 2, 3};
int x = arr[0]++;  // x = 1 (pós-fixo retorna valor antes de incrementar)
                   // arr[0] = 2 (depois incrementa)

// Avaliação: arr[0] primeiro, depois ++
```

#### **Nível 2 - Unários e Cast**

**Prefixo, unários, cast**:
```java
int x = 5;

// Prefixo (maior precedência que pós-fixo em contexto)
++x;        // x = 6

// Unários
int y = -x;      // y = -6
boolean b = !true;  // b = false
int z = ~x;      // z = complemento bit a bit de 6

// Cast
double d = 3.14;
int i = (int) d;  // i = 3
```

**Precedência do cast**:
```java
int x = (int) 3.14 + 2.5;  // (int)3.14 primeiro = 3, depois 3 + 2.5 = 5.5? NÃO!
// Na verdade: (int)(3.14) + 2.5 = 3.0 + 2.5 = 5.5 (conversão para double)

// Para cast de toda a expressão:
int y = (int) (3.14 + 2.5);  // (int)5.64 = 5
```

#### **Nível 3 - Multiplicativos**

```java
int a = 10 + 3 * 4;     // 10 + 12 = 22
int b = 10 / 2 + 3;     // 5 + 3 = 8
int c = 10 % 3 * 2;     // (10 % 3) * 2 = 1 * 2 = 2

// Múltiplos multiplicativos: esquerda para direita
int d = 20 / 4 / 2;     // (20 / 4) / 2 = 5 / 2 = 2
int e = 20 / 4 * 2;     // (20 / 4) * 2 = 5 * 2 = 10
```

#### **Nível 4 - Aditivos**

```java
int a = 10 - 3 + 2;     // (10 - 3) + 2 = 7 + 2 = 9
int b = 10 + 3 - 2;     // (10 + 3) - 2 = 13 - 2 = 11

// Concatenação de strings (+ tem múltiplas funções)
String s = "a" + "b" + "c";  // "abc"
String t = 1 + 2 + "3";      // "33" (1+2=3, "3"+"3"="33")
String u = "1" + 2 + 3;      // "123" ("1"+2="12", "12"+3="123")
```

#### **Nível 5 - Shift**

```java
int a = 1 << 3;      // 1 * 2³ = 8
int b = 16 >> 2;     // 16 / 2² = 4
int c = -1 >>> 1;    // Shift sem sinal

// Shift tem precedência entre aditivos e relacionais
int d = 2 + 1 << 2;  // (2 + 1) << 2 = 3 << 2 = 12
int e = 8 >> 1 + 1;  // 8 >> (1 + 1) = 8 >> 2 = 2
```

#### **Nível 6 - Relacionais e instanceof**

```java
boolean a = 5 > 3;           // true
boolean b = 10 <= 10;        // true
boolean c = "abc" instanceof String;  // true

// Relacionais têm precedência entre shift e igualdade
boolean d = 1 << 2 > 3;      // (1 << 2) > 3 = 4 > 3 = true
boolean e = 5 > 3 == true;   // (5 > 3) == true = true == true = true
```

#### **Nível 7 - Igualdade**

```java
boolean a = 5 == 5;          // true
boolean b = 5 != 3;          // true

// Igualdade tem menor precedência que relacionais
boolean c = 5 > 3 == true;   // (5 > 3) == true = true == true = true
boolean d = 5 == 5 && true;  // (5 == 5) && true = true && true = true
```

#### **Nível 8-10 - Operadores Bit a Bit**

```java
// Nível 8: AND (&)
int a = 5 & 3;       // 0101 & 0011 = 0001 = 1

// Nível 9: XOR (^)
int b = 5 ^ 3;       // 0101 ^ 0011 = 0110 = 6

// Nível 10: OR (|)
int c = 5 | 3;       // 0101 | 0011 = 0111 = 7

// Ordem: & antes de ^, ^ antes de |
int d = 5 & 3 ^ 1;   // (5 & 3) ^ 1 = 1 ^ 1 = 0
int e = 5 ^ 3 | 1;   // (5 ^ 3) | 1 = 6 | 1 = 7
```

#### **Nível 11-12 - Operadores Lógicos**

```java
// Nível 11: AND lógico (&&)
boolean a = true && false;    // false

// Nível 12: OR lógico (||)
boolean b = true || false;    // true

// && tem maior precedência que ||
boolean c = true || false && false;  // true || (false && false) = true
boolean d = false && true || true;   // (false && true) || true = true

// Curto-circuito
boolean e = false && (1 / 0 > 0);  // false (não avalia 1/0)
boolean f = true || (1 / 0 > 0);   // true (não avalia 1/0)
```

#### **Nível 13 - Operador Ternário**

```java
int a = true ? 10 : 20;      // 10
int b = false ? 10 : 20;     // 20

// Ternário tem precedência entre lógicos e atribuição
int c = true ? 1 + 2 : 3;    // true ? (1 + 2) : 3 = 3
int d = 5 > 3 ? 10 : 20;     // (5 > 3) ? 10 : 20 = 10

// Aninhamento (associatividade direita para esquerda)
int e = true ? false ? 1 : 2 : 3;  // true ? (false ? 1 : 2) : 3 = 2
```

#### **Nível 14 - Atribuição**

```java
int a, b, c;
a = b = c = 10;  // Associatividade direita: a = (b = (c = 10))

// Atribuição tem menor precedência que operadores aritméticos
int d = 5 + 3;   // d = (5 + 3) = 8

// Atribuições compostas
int e = 10;
e += 5;          // e = e + 5 = 15
e *= 2;          // e = e * 2 = 30
```

#### **Nível 15 - Lambda (MENOR PRECEDÊNCIA)**

```java
// Lambda tem menor precedência
Function<Integer, Integer> f = x -> x * 2;

// Em expressões, lambda tem precedência mais baixa
Supplier<Integer> s = () -> 5 + 3;  // () -> (5 + 3)
```

### 3. Tabela Simplificada (Memorização)

**Mnemônico**: "**P**arênteses **U**nários **M**ultiplica **A**diciona **S**hift **R**elacional **I**gualdade **B**it **L**ógico **T**ernário **A**tribuição **L**ambda"

| Nível | Categoria | Operadores |
|-------|-----------|-----------|
| 1 | **P**ós-fixo/Acesso | `++ -- () [] .` |
| 2 | **U**nários/Cast | `++ -- + - ! ~ (type)` |
| 3 | **M**ultiplicativos | `* / %` |
| 4 | **A**ditivos | `+ -` |
| 5 | **S**hift | `<< >> >>>` |
| 6 | **R**elacionais | `< <= > >= instanceof` |
| 7 | **I**gualdade | `== !=` |
| 8-10 | **B**it a bit | `& ^ \|` |
| 11-12 | **L**ógicos | `&& \|\|` |
| 13 | **T**ernário | `? :` |
| 14 | **A**tribuição | `= += -= ...` |
| 15 | **L**ambda | `->` |

### 4. Precedência vs Ordem de Avaliação

**⚠️ IMPORTANTE**: Precedência ≠ Ordem de avaliação de operandos.

**Precedência**: Qual operador é aplicado primeiro.
**Ordem de avaliação**: Qual operando é calculado primeiro.

```java
// Precedência: * antes de +
int a = 2 + 3 * 4;  // 2 + (3 * 4) = 14

// Ordem de avaliação: SEMPRE esquerda para direita (em Java)
int b = metodo1() + metodo2() * metodo3();
// Avaliação: metodo1(), metodo2(), metodo3(), depois * e +
```

**Exemplo com efeitos colaterais**:
```java
int x = 0;
int resultado = ++x + ++x * ++x;  // x = 1, x = 2, x = 3
// Ordem de avaliação: ++x (x=1), ++x (x=2), ++x (x=3)
// Aplicação: 1 + (2 * 3) = 1 + 6 = 7
// Resultado: 7, x = 3
```

### 5. Casos Especiais de Precedência

#### **Concatenação de Strings**

```java
// + com strings tem precedência multiplicativa
String s1 = 1 + 2 + "3";      // (1 + 2) + "3" = "33"
String s2 = "1" + 2 + 3;      // ("1" + 2) + 3 = "123"
String s3 = "1" + (2 + 3);    // "1" + 5 = "15"

// Comparação
boolean b = "a" + "b" == "ab";  // ("a" + "b") == "ab" (precedência de +)
```

#### **instanceof e Cast**

```java
Object obj = "abc";

// instanceof tem precedência sobre ==
boolean b1 = obj instanceof String == true;  // (obj instanceof String) == true

// Cast tem alta precedência
String s = (String) obj + "def";  // ((String)obj) + "def"
```

#### **Incremento e Acesso**

```java
int[] arr = {1, 2, 3};

// Pós-fixo tem maior precedência
int a = arr[0]++;  // arr[0] primeiro, depois ++
                   // a = 1, arr[0] = 2

// Prefixo e acesso
int b = ++arr[1];  // ++arr[1] (arr[1] incrementado antes de retornar)
                   // b = 3, arr[1] = 3
```

### 6. Precedência em Expressões Complexas

```java
// Expressão complexa
int resultado = 2 + 3 * 4 / 2 % 3 << 1 > 5 ? 10 : 20;

// Passo a passo:
// 1. Multiplicativos: 3 * 4 = 12
int r1 = 2 + 12 / 2 % 3 << 1 > 5 ? 10 : 20;

// 2. Multiplicativos: 12 / 2 = 6
int r2 = 2 + 6 % 3 << 1 > 5 ? 10 : 20;

// 3. Multiplicativos: 6 % 3 = 0
int r3 = 2 + 0 << 1 > 5 ? 10 : 20;

// 4. Aditivos: 2 + 0 = 2
int r4 = 2 << 1 > 5 ? 10 : 20;

// 5. Shift: 2 << 1 = 4
int r5 = 4 > 5 ? 10 : 20;

// 6. Relacional: 4 > 5 = false
int r6 = false ? 10 : 20;

// 7. Ternário: false ? 10 : 20 = 20
int resultado = 20;
```

### 7. Tabela de Precedência com Exemplos

| Categoria | Exemplo | Resultado | Explicação |
|-----------|---------|-----------|------------|
| Pós-fixo | `arr[0]++` | `arr[0]` depois `++` | Acesso antes de incremento |
| Unário | `-5 + 3` | `(-5) + 3 = -2` | Negação antes de adição |
| Multiplicativo | `2 + 3 * 4` | `2 + (3*4) = 14` | Multiplicação antes de adição |
| Aditivo | `10 - 3 + 2` | `(10-3) + 2 = 9` | Esquerda para direita |
| Shift | `2 + 1 << 2` | `(2+1) << 2 = 12` | Adição antes de shift |
| Relacional | `5 > 3 == true` | `(5>3) == true` | Comparação antes de igualdade |
| Igualdade | `5 == 5 && true` | `(5==5) && true` | Igualdade antes de lógico |
| AND bit | `5 & 3 ^ 1` | `(5&3) ^ 1 = 0` | AND antes de XOR |
| XOR bit | `5 ^ 3 \| 1` | `(5^3) \| 1 = 7` | XOR antes de OR |
| OR bit | `5 \| 3 && true` | `(5\|3) && true` | OR bit antes de lógico |
| AND lógico | `true \|\| false && false` | `true \|\| (false&&false)` | AND antes de OR |
| OR lógico | `false && true \|\| true` | `(false&&true) \|\| true` | AND antes de OR |
| Ternário | `5 > 3 ? 1 : 2` | `(5>3) ? 1 : 2 = 1` | Relacional antes de ternário |
| Atribuição | `a = 5 + 3` | `a = (5+3) = 8` | Adição antes de atribuição |

### 8. Precedência e Parênteses

**Parênteses sempre têm maior precedência** - forçam avaliação específica.

```java
// Sem parênteses (precedência natural)
int a = 2 + 3 * 4;        // 14

// Com parênteses (força ordem)
int b = (2 + 3) * 4;      // 20

// Múltiplos níveis de parênteses
int c = ((2 + 3) * 4) / 5;  // 4
```

### 9. Erros Comuns de Precedência

**❌ Erro 1**: Assumir precedência incorreta
```java
// ❌ Assumir que == tem maior precedência que &&
if (a == b && c == d) { }  // Correto: (a==b) && (c==d)

// ❌ Pensar que é: a == (b && c) == d
```

**❌ Erro 2**: Confundir & e &&
```java
// & (bit) tem precedência MENOR que ==
// && (lógico) tem precedência MAIOR que ==
boolean b1 = 5 == 5 & true;   // (5==5) & true (bit a bit)
boolean b2 = 5 == 5 && true;  // (5==5) && true (lógico)
```

**❌ Erro 3**: Shift e adição
```java
int a = 2 + 1 << 2;  // (2+1) << 2 = 12, NÃO 2 + (1<<2) = 6
```

### 10. Precedência na Prática

**Caso 1: Validação**
```java
// Precedência correta
if (obj != null && obj instanceof String && ((String)obj).length() > 0) {
    // Avaliação: obj != null, depois instanceof, depois cast e length()
}
```

**Caso 2: Cálculos**
```java
// Cálculo de área com precedência
double area = PI * raio * raio + 2 * PI * raio * altura;
// Avaliação: todas as multiplicações primeiro, depois adições
```

**Caso 3: Flags de bit**
```java
// Combinação de flags
int flags = FLAG_A | FLAG_B & FLAG_C;
// Avaliação: (FLAG_B & FLAG_C) | FLAG_A (& antes de |)

// Para clareza, use parênteses:
int flagsClear = FLAG_A | (FLAG_B & FLAG_C);
```

---

## 🔍 Análise Conceitual Profunda

### Por Que Precedência É Importante?

**1. Previsibilidade**

Sem precedência clara, expressões seriam ambíguas:
```java
int x = 2 + 3 * 4;
// Poderia ser: (2 + 3) * 4 = 20
// Ou: 2 + (3 * 4) = 14
// Precedência define: 14
```

**2. Legibilidade**

Precedência bem definida permite expressões concisas sem parênteses excessivos:
```java
// Com precedência clara
if (x > 0 && y < 10 || z == 5) { }

// Sem precedência (tudo com parênteses):
if (((x > 0) && (y < 10)) || (z == 5)) { }
```

**3. Compatibilidade com Matemática**

Java segue convenções matemáticas:
```java
int x = a + b * c;  // Igual à matemática: a + (b × c)
```

### Origem da Precedência

**Inspiração C**: Java herdou precedência do C/C++.
**Matemática**: Segue regras de álgebra (multiplicação antes de adição).
**Lógica**: Operadores lógicos seguem álgebra booleana.

---

## 🎯 Aplicabilidade e Contextos

### 1. **Expressões Aritméticas**

```java
int total = preco * quantidade + taxaEntrega - desconto;
// Avaliação: (preco * quantidade) + taxaEntrega - desconto
```

### 2. **Condições Complexas**

```java
if (usuario != null && usuario.isAtivo() && usuario.getIdade() >= 18) {
    // Precedência: != primeiro, depois && da esquerda para direita
}
```

### 3. **Manipulação de Bits**

```java
int mascara = 0xFF << 8 | 0x0F;
// Avaliação: (0xFF << 8) | 0x0F
```

### 4. **Expressões Ternárias**

```java
int max = a > b ? a : b;
// Precedência: (a > b) primeiro, depois ternário
```

### 5. **Cálculos Científicos**

```java
double resultado = a * b + c * d / e - f % g;
// Avaliação: (a*b) + ((c*d)/e) - (f%g)
```

---

## ⚠️ Limitações e Armadilhas

### 1. **Confundir Bit a Bit com Lógicos**

```java
// ❌ ERRO: & tem precedência diferente de &&
if (a > 0 & b < 10)  // (a>0) & (b<10) - bit a bit, sem curto-circuito
if (a > 0 && b < 10) // (a>0) && (b<10) - lógico, com curto-circuito
```

### 2. **Incremento e Expressões**

```java
int x = 5;
int y = x++ + ++x;  // Complexo! Evite!
// Avaliação: x++ retorna 5 (x=6), ++x retorna 7 (x=7), resultado = 12
```

### 3. **Cast e Operadores**

```java
double d = (double) 5 / 2;    // (double)5 / 2 = 2.5
double e = (double) (5 / 2);  // (double)2 = 2.0
```

### 4. **String + e Tipos Numéricos**

```java
String s = 1 + 2 + "3";  // "33" (1+2=3, "3"+"3"="33")
String t = "1" + 2 + 3;  // "123" ("1"+2="12", "12"+3="123")
```

### 5. **Atribuição em Condicionais**

```java
// ❌ ERRO comum: = em vez de ==
if (x = 5) { }  // ERRO: atribuição, não comparação

// ✅ Correto
if (x == 5) { }
```

---

## 🔗 Interconexões Conceituais

### Relacionamento com Outros Conceitos

- **Associatividade**: Define ordem entre operadores de mesma precedência
- **Tipos de Dados**: Conversões implícitas seguem precedência
- **Curto-Circuito**: && e || avaliam até resultado ser conhecido
- **Parênteses**: Sobrescrevem precedência natural
- **Ordem de Avaliação**: Operandos avaliados esquerda → direita

---

## 🚀 Boas Práticas

### 1. ✅ Conheça a Tabela de Precedência

Memorize ao menos:
- Multiplicativos antes de aditivos
- Relacionais antes de igualdade
- Igualdade antes de lógicos
- && antes de ||
- Lógicos antes de ternário
- Ternário antes de atribuição

### 2. ✅ Use Parênteses para Clareza

Mesmo com precedência correta, parênteses melhoram legibilidade:
```java
// Correto pela precedência, mas confuso
if (a && b || c && d) { }

// Melhor com parênteses
if ((a && b) || (c && d)) { }
```

### 3. ✅ Evite Expressões Muito Complexas

```java
// ❌ Complexo demais
int x = a + b * c / d % e << f > g ? h : i;

// ✅ Divida em etapas
int temp1 = b * c / d % e;
int temp2 = temp1 << f;
boolean condicao = temp2 > g;
int x = condicao ? h : i;
```

### 4. ✅ Cuidado com Incremento/Decremento

```java
// ❌ Evite
int y = x++ + ++x * x--;

// ✅ Prefira separar
x++;
++x;
int y = x;
x--;
```

### 5. ✅ Prefira && e || a & e |

```java
// ✅ Lógico (com curto-circuito)
if (obj != null && obj.metodo()) { }

// ❌ Bit a bit (sem curto-circuito, pode lançar exceção)
if (obj != null & obj.metodo()) { }
```

### 6. ✅ Teste Expressões Complexas

```java
@Test
void testPrecedencia() {
    assertEquals(14, 2 + 3 * 4);
    assertEquals(20, (2 + 3) * 4);
}
```

### 7. ✅ Documente Intenção

```java
// Cálculo de área total: base + lateral
double area = PI * r * r + 2 * PI * r * h;
```

### 8. ✅ Formatação Adequada

```java
// ✅ Bem formatado
int resultado = a * b 
              + c * d 
              - e / f;

// ❌ Mal formatado
int resultado=a*b+c*d-e/f;
```

### 9. ✅ Evite Side Effects em Expressões

```java
// ❌ Side effect dificulta compreensão
if (++x > 10 && metodoComEfeito()) { }

// ✅ Separe
x++;
if (x > 10 && metodoComEfeito()) { }
```

### 10. ✅ Ferramentas de Análise

Use IDEs e linters para detectar precedência confusa:
- IntelliJ IDEA: warnings de precedência
- SonarQube: regras de complexidade
- Checkstyle: verificação de parênteses

---

## 📚 Resumo

A **precedência de operadores** determina a ordem de avaliação em expressões complexas. Java possui **15 níveis** de precedência, do acesso a membros (maior) ao lambda (menor). Operadores **multiplicativos** têm precedência sobre **aditivos**, relacionais sobre igualdade, igualdade sobre lógicos, e lógicos sobre atribuição. **Parênteses** sempre têm maior precedência e devem ser usados para **clareza**, mesmo quando não obrigatórios. Evite expressões excessivamente complexas e prefira **dividir** em etapas para melhor **legibilidade** e **manutenibilidade**.

