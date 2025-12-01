# Operador Módulo (%)

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Operador módulo (`%`)**, também chamado **operador resto**, calcula o **resto da divisão inteira** entre dois operandos. Conceitualmente, responde: "quanto sobra após dividir `a` por `b` o máximo de vezes possível inteiramente?"

**Sintaxe:**

```java
int resto = 10 % 3;  // 1 (10 = 3*3 + 1)
int par = 8 % 2;     // 0 (8 = 2*4 + 0)
int impar = 7 % 2;   // 1 (7 = 2*3 + 1)
```

**Fórmula:** `a % b` = `a - (a / b) * b` (onde `/` é divisão inteira)

### Contexto Histórico e Motivação

**Origem:** Módulo vem de aritmética modular (Gauss, século 19). Símbolo `%` estabelecido em linguagens de programação (C, 1972) por estar disponível em ASCII.

**Motivação:**
1. **Ciclicidade:** Padrões repetitivos (dias da semana, horas)
2. **Paridade:** Determinar par/ímpar
3. **Distribuição:** Distribuir itens uniformemente
4. **Hash Functions:** Base de muitos algoritmos de hash

### Problema Fundamental que Resolve

**1. Verificar Paridade:**
```java
boolean ehPar = (numero % 2 == 0);
```

**2. Ciclos:**
```java
int diaSemana = diaTotal % 7;  // 0-6 (domingo a sábado)
```

**3. Limitar Intervalo:**
```java
int indice = valorGrande % tamanhoArray;  // Garante índice válido
```

**4. Extrair Dígito:**
```java
int ultimoDigito = numero % 10;
```

### Importância no Ecossistema

Módulo é essencial em:
- **Algoritmos de Hash:** Distribuição uniforme
- **Criptografia:** Aritmética modular
- **Validações:** Dígitos verificadores (CPF, ISBN)
- **Estruturas de Dados:** Hash tables, circular buffers

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Resto da Divisão:** `a % b` = resto de `a / b`
2. **Tipos Suportados:** Inteiros e ponto flutuante
3. **Sinal do Resultado:** Mesmo sinal do **dividendo** (esquerda)
4. **Divisão por Zero:** `ArithmeticException` (int) ou `NaN` (float/double)
5. **Precedência:** Mesma de `*` e `/`

### Pilares Fundamentais

- **Remainder Operation:** Resto, não divisão
- **Sign of Dividend:** Sinal segue primeiro operando
- **Cyclic Behavior:** Útil para padrões cíclicos
- **Range Limiting:** Força valores em intervalo
- **Parity Check:** Par/ímpar via `% 2`

### Nuances Importantes

- **Módulo ≠ Modulo Matemático:** Java usa resto (sinal do dividendo), não módulo matemático
- **Negativo:** `-10 % 3` = `-1` (em Java), não `2` (matemática)
- **Float/Double:** `%` funciona, mas raro usar

---

## 🧠 Fundamentos Teóricos

### Módulo com Inteiros

**Sintaxe Básica:**

```java
int r1 = 10 % 3;   // 1
int r2 = 15 % 4;   // 3
int r3 = 8 % 2;    // 0
int r4 = 7 % 10;   // 7 (divisor maior que dividendo)
```

**Conceito:** Se `a < b`, então `a % b = a`.

**Verificar Paridade:**

```java
int numero = 42;
if (numero % 2 == 0) {
    System.out.println("Par");
} else {
    System.out.println("Ímpar");
}
```

### Módulo com Negativos

**Sinal Segue Dividendo (Esquerda):**

```java
int r1 = 10 % 3;    // 1
int r2 = -10 % 3;   // -1 (não 2!)
int r3 = 10 % -3;   // 1 (sinal do divisor ignorado)
int r4 = -10 % -3;  // -1
```

**Fórmula:** `a % b = a - (a / b) * b`

**Exemplo:** `-10 % 3`:
- `-10 / 3` = `-3` (divisão inteira trunca)
- `-3 * 3` = `-9`
- `-10 - (-9)` = `-1`

**Diferença com Módulo Matemático:**

Matemática: `-10 mod 3` = `2` (sempre não-negativo)
Java: `-10 % 3` = `-1` (sinal do dividendo)

**Obter Módulo Matemático:**

```java
int modMat = ((a % b) + b) % b;  // Sempre não-negativo
```

### Módulo com Ponto Flutuante

**Funciona, mas Raro:**

```java
double r = 10.5 % 3.0;  // 1.5
float f = 7.5f % 2.5f;  // 0.0f
```

**Conceito:** Resto de divisão flutuante. Pouco usado na prática.

### Módulo por Zero

**Inteiros: `ArithmeticException`**

```java
// int r = 10 % 0;  // RUNTIME ERROR: ArithmeticException
```

**Ponto Flutuante: `NaN`**

```java
double r = 10.0 % 0.0;  // NaN
```

---

## 🔍 Análise Conceitual Profunda

### Aplicações de Módulo

**1. Ciclos (Relógios, Calendários):**

```java
int hora24 = 25;
int hora12 = hora24 % 12;  // 1 (1 AM)

int dia = 10;  // 10º dia desde domingo (0)
int diaSemana = dia % 7;  // 3 (quarta-feira)
```

**2. Distribuição Circular:**

```java
int[] buffer = new int[10];
int indice = posicao % buffer.length;  // Garante 0-9
```

**3. Extrair Dígitos:**

```java
int numero = 12345;
int unidade = numero % 10;       // 5
int dezena = (numero / 10) % 10; // 4
```

**4. Verificar Múltiplo:**

```java
boolean ehMultiploDe5 = (numero % 5 == 0);
boolean ehMultiploDe3 = (numero % 3 == 0);
```

**5. Hash Functions:**

```java
int hash = chave.hashCode();
int indice = Math.abs(hash) % tamanhoTabela;
```

### FizzBuzz (Exemplo Clássico)

```java
for (int i = 1; i <= 100; i++) {
    if (i % 15 == 0) {
        System.out.println("FizzBuzz");
    } else if (i % 3 == 0) {
        System.out.println("Fizz");
    } else if (i % 5 == 0) {
        System.out.println("Buzz");
    } else {
        System.out.println(i);
    }
}
```

**Conceito:** `% 15` verifica múltiplo de 3 E 5 (15 = 3×5).

### Precedência

**Mesma de `*` e `/`:**

```java
int r = 10 + 15 % 4;  // 10 + 3 = 13 (módulo primeiro)
int r2 = (10 + 15) % 4;  // 25 % 4 = 1
```

---

## 🎯 Aplicabilidade e Contextos

### Alternância (Alternar Cores, Estados)

```java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        // Linha par (cor 1)
    } else {
        // Linha ímpar (cor 2)
    }
}
```

### Validação de Dados

**Dígito Verificador CPF:**

```java
int soma = /* cálculo específico */;
int digito = 11 - (soma % 11);
if (digito >= 10) digito = 0;
```

### Circular Buffers

```java
int[] buffer = new int[SIZE];
int writePos = 0;

void adicionar(int valor) {
    buffer[writePos] = valor;
    writePos = (writePos + 1) % SIZE;  // Volta ao início ao atingir fim
}
```

---

## ⚠️ Limitações e Considerações

### 1. Sinal com Negativos

```java
int r = -10 % 3;  // -1, não 2
```

**Mitigação:** Se precisa módulo matemático:
```java
int modMat = ((a % b) + b) % b;
```

### 2. Divisão por Zero

```java
// int r = 10 % 0;  // ArithmeticException
```

**Mitigação:** Validar divisor antes.

### 3. Performance

`%` pode ser lento comparado a operações bit a bit (quando aplicável).

**Exemplo:** Se `b` é potência de 2:
```java
int r = a % 8;  // Compilador pode otimizar para a & 7
```

JIT faz isso automaticamente — não otimizar manualmente.

---

## 🔗 Interconexões Conceituais

### Relação com Divisão

`a / b` = quociente, `a % b` = resto

**Verificação:** `a = (a / b) * b + (a % b)`

### Relação com Hash Functions

Base de muitos algoritmos de hash para distribuir valores.

### Relação com Aritmética Modular

Fundamento de criptografia (RSA, Diffie-Hellman).

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **`Math.floorMod()`:** Módulo matemático (Java 8+)
2. **Bit a Bit (`&`):** Alternativa para potências de 2
3. **Hash Tables:** Uso de módulo em estruturas de dados
4. **Operadores Compostos (`%=`):** `x %= 5`

---

## 📚 Conclusão

**Operador módulo (`%`)** calcula resto da divisão inteira, essencial para verificar paridade, criar padrões cíclicos, limitar intervalos e distribuir valores uniformemente. Sinal do resultado segue dividendo (esquerda) — `-10 % 3` = `-1`, não `2`. Divisão por zero causa `ArithmeticException` (int) ou `NaN` (float). Precedência igual a `*` e `/`. Amplamente usado em algoritmos de hash, validações, circular buffers e verificação de múltiplos. `Math.floorMod()` (Java 8+) fornece módulo matemático verdadeiro (sempre não-negativo). Compreender `%` e diferença com módulo matemático é crucial para algoritmos que dependem de aritmética modular.
