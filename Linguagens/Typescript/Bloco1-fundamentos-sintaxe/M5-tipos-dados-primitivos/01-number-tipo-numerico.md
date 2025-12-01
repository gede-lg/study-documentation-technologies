# Number (Inteiros e Decimais, Infinity, NaN): Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo `number` em TypeScript representa **valores numéricos** usando o padrão **IEEE 754 de ponto flutuante de 64 bits** (double precision), unificando inteiros, decimais, valores especiais (Infinity, -Infinity, NaN) e notações científicas em um **único tipo primitivo**. Conceitualmente, `number` é uma **abstração sobre representação binária de números** que permite operações aritméticas, comparações e transformações matemáticas, servindo como tipo fundamental para qualquer computação quantitativa em TypeScript.

Na essência, TypeScript (herdando de JavaScript) não distingue entre **inteiros e números de ponto flutuante** - ambos são `number`. Um valor `42` (aparentemente inteiro) e `42.7` (decimal) têm o mesmo tipo subjacente, armazenados internamente no mesmo formato IEEE 754. Esta decisão de design simplifica o sistema de tipos mas introduz nuances importantes: **precisão limitada** (números muito grandes ou com muitas casas decimais podem perder exatidão), **valores especiais** (Infinity, NaN que representam condições matemáticas excepcionais), e **coerção de tipo** (operações podem converter implicitamente strings ou outros tipos para números).

Mais profundamente, `number` não é apenas um tipo - é um **modelo computacional de números reais** com limitações práticas. Enquanto matemática pura trabalha com infinitos reais, computadores implementam aproximações finitas. O tipo `number` representa intervalo de aproximadamente **±5 × 10³⁰⁸** com **15-17 dígitos de precisão decimal**. Valores fora deste intervalo tornam-se `Infinity`; cálculos inválidos produzem `NaN` (Not-a-Number). Compreender estas limitações é crucial para evitar bugs sutis em cálculos financeiros, científicos ou estatísticos.

### Contexto Histórico e Evolução

A história do tipo `number` em JavaScript/TypeScript reflete evolução de linguagens de programação e padrões numéricos:

**JavaScript Origins (1995) - IEEE 754:**
Brendan Eich, ao criar JavaScript para Netscape, escolheu **IEEE 754 double-precision** como único tipo numérico:

**Motivação:**
- **Simplicidade:** Um tipo para todos números (não int, float, double separados como C/Java)
- **Padrão Universal:** IEEE 754 usado por praticamente todas CPUs modernas
- **Suficiente para Web:** Scripting de páginas não requeria precisão extrema

**IEEE 754 (1985) - Padrão de Ponto Flutuante:**
Padrão definido pela IEEE (Institute of Electrical and Electronics Engineers) para representação binária de números:

**Estrutura de 64 bits:**
```
1 bit   |  11 bits    |  52 bits
Sinal   |  Expoente   |  Mantissa (fração)
```

**Características:**
- **Sinal:** 0 = positivo, 1 = negativo
- **Expoente:** Representa magnitude (escala)
- **Mantissa:** Representa precisão (dígitos significativos)

**Valores Especiais:**
- **Infinity:** Resultado de overflow (número muito grande)
- **-Infinity:** Overflow negativo
- **NaN:** Resultado de operação indefinida (0/0, √-1)
- **+0 e -0:** Zeros com sinal (geralmente equivalentes)

**JavaScript 1.0-ES5 (1995-2009) - Number Único:**
JavaScript manteve `number` como único tipo numérico por 15+ anos:

```javascript
var inteiro = 42;
var decimal = 3.14;
var notacao = 6.022e23; // 6.022 × 10²³

typeof inteiro; // "number"
typeof decimal; // "number"
typeof notacao; // "number"
```

**Problemas Emergentes:**
- **Precisão Financeira:** `0.1 + 0.2 !== 0.3` (0.30000000000000004)
- **Inteiros Grandes:** Seguro apenas até `2⁵³ - 1` (9007199254740991)
- **Cálculos Científicos:** Arredondamento introduz erros acumulados

**ES2015 (2015) - Number Constants:**
ECMAScript 2015 adicionou constantes úteis:

```javascript
Number.MAX_SAFE_INTEGER; // 9007199254740991 (2⁵³ - 1)
Number.MIN_SAFE_INTEGER; // -9007199254740991
Number.EPSILON;          // 2.220446049250313e-16 (menor diferença representável)
Number.MAX_VALUE;        // 1.7976931348623157e+308 (maior número)
Number.MIN_VALUE;        // 5e-324 (menor número positivo)
```

**ES2020 (2020) - BigInt:**
Reconhecendo limitações de `number`, JavaScript adicionou `bigint` para inteiros arbitrariamente grandes (tópico separado).

**TypeScript (2012-presente) - Type Safety:**
TypeScript adiciona **verificação de tipo estática** para `number`:

```typescript
let idade: number = 30;
idade = 'trinta'; // Erro TS: Type 'string' not assignable to 'number'
```

**Estado Atual (2020s):**
`number` permanece tipo numérico padrão em TypeScript, complementado por `bigint` para casos específicos.

### Problema Fundamental que Resolve

O tipo `number` resolve problemas fundamentais de **representação e operação numérica** em programação:

**1. Unificação de Tipos Numéricos:**

**Problema:** Linguagens como C/Java têm múltiplos tipos (int, long, float, double) - complexidade.

**Solução TypeScript/JavaScript:** Um tipo `number` para todos casos comuns:

```typescript
let contador: number = 0;       // "Inteiro"
let preco: number = 19.99;      // Decimal
let pi: number = 3.14159265359; // Precisão
let distancia: number = 1.5e8;  // Notação científica (150 milhões)
```

**Conceito:** Simplicidade - desenvolvedores não escolhem entre int/float/double.

**2. Operações Aritméticas Diretas:**

**Problema:** Precisar de conversões explícitas entre tipos numéricos.

**Solução:** Todas operações funcionam naturalmente:

```typescript
const a: number = 10;
const b: number = 3.5;

const soma = a + b;           // 13.5
const produto = a * b;        // 35
const divisao = a / b;        // 2.857142857142857
const potencia = a ** 2;      // 100
const modulo = a % b;         // 3 (resto da divisão)
```

**3. Valores Especiais para Condições Excepcionais:**

**Problema:** Como representar overflow, operações inválidas?

**Solução:** Valores especiais `Infinity` e `NaN`:

```typescript
const overflow: number = 1e308 * 10;  // Infinity (número muito grande)
const divisaoPorZero: number = 1 / 0; // Infinity
const raizNegativa: number = Math.sqrt(-1); // NaN
const invalido: number = 0 / 0;       // NaN

// Verificações
Number.isFinite(overflow);     // false
Number.isNaN(raizNegativa);    // true
```

**Conceito:** Sistema não quebra - retorna valores especiais que código pode testar.

**4. Compatibilidade com Hardware:**

**Problema:** Precisar de representação que CPUs processam eficientemente.

**Solução:** IEEE 754 é padrão de hardware - operações otimizadas nativamente.

**5. Precisão Suficiente para Web:**

**Problema:** Precisão infinita impossível; quanto é suficiente?

**Solução:** 15-17 dígitos decimais adequados para maioria dos casos:

```typescript
const latitude: number = -23.550520;  // GPS (7 decimais)
const monetario: number = 1234.56;    // Dinheiro (2 decimais)
const cientifico: number = 6.022e23;  // Constante de Avogadro
```

### Importância no Ecossistema

O tipo `number` é absolutamente fundamental no ecossistema TypeScript:

**1. Base para Computação Quantitativa:**
Qualquer cálculo - contadores, preços, estatísticas, física - usa `number`.

**2. APIs Nativas:**
`Math` object, `Date` timestamps, array lengths - todos retornam `number`.

**3. Interoperabilidade:**
Comunicação com APIs HTTP, bancos de dados - números são universais.

**4. Type Safety:**
TypeScript previne erros comuns de tipo:

```typescript
function calcularDesconto(preco: number, percentual: number): number {
  return preco * (1 - percentual / 100);
}

calcularDesconto(100, '10'); // Erro TS: '10' não é number
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Representação:** IEEE 754 double-precision (64 bits)
2. **Unificação:** Inteiros e decimais são mesmo tipo
3. **Valores Especiais:** Infinity, -Infinity, NaN
4. **Precisão:** ~15-17 dígitos decimais
5. **Intervalo:** ±5 × 10³⁰⁸ aproximadamente

### Pilares Fundamentais

**Declaração:**
```typescript
let x: number = 42;
let y: number = 3.14;
let z: number = 1e6; // 1 milhão
```

**Valores Especiais:**
```typescript
const inf: number = Infinity;
const negInf: number = -Infinity;
const notANumber: number = NaN;
```

**Operações:**
```typescript
const soma = 10 + 5;        // 15
const subtracao = 10 - 5;   // 5
const multiplicacao = 10 * 5; // 50
const divisao = 10 / 5;     // 2
const potencia = 10 ** 2;   // 100
const modulo = 10 % 3;      // 1
```

### Visão Geral das Nuances

**Precisão Limitada:**
```typescript
0.1 + 0.2 === 0.3; // false! (0.30000000000000004)
```

**Safe Integer Range:**
```typescript
Number.MAX_SAFE_INTEGER; // 9007199254740991
9007199254740992 + 1 === 9007199254740992 + 2; // true! (perda de precisão)
```

**NaN é Único:**
```typescript
NaN === NaN; // false! (NaN nunca é igual a si mesmo)
Number.isNaN(NaN); // true (usar função para verificar)
```

---

## 🧠 Fundamentos Teóricos

### Representação Interna (IEEE 754)

#### Estrutura de 64 Bits

```
Bit:    63      62-52           51-0
        ↓       ↓               ↓
       [S] [Expoente] [Mantissa/Fração]
        1 bit  11 bits   52 bits
```

**Componentes:**
- **Sinal (S):** 0 = positivo, 1 = negativo
- **Expoente (E):** 11 bits (bias = 1023)
- **Mantissa (M):** 52 bits (fração)

**Valor Calculado:**
```
(-1)^S × 1.M × 2^(E - 1023)
```

**Exemplo: Representar 5.75:**

```
5.75 em binário = 101.11 = 1.0111 × 2²

Sinal: 0 (positivo)
Expoente: 2 + 1023 = 1025 = 10000000001 (binário)
Mantissa: 0111 (52 bits preenchidos com zeros)

Resultado: 0 10000000001 0111000000000000000000000000000000000000000000000000
```

#### Valores Especiais

**Infinity:**
```
Expoente: todos 1s (2047)
Mantissa: todos 0s
Sinal: 0 (Infinity) ou 1 (-Infinity)
```

**NaN:**
```
Expoente: todos 1s (2047)
Mantissa: qualquer valor não-zero
```

**Zero:**
```
Expoente: todos 0s
Mantissa: todos 0s
Sinal: 0 (+0) ou 1 (-0)
```

### Precisão e Limitações

#### Problema de Precisão Decimal

**Por que 0.1 + 0.2 !== 0.3?**

```typescript
0.1 + 0.2; // 0.30000000000000004
```

**Razão:** 0.1 e 0.2 não têm representação exata em binário (como 1/3 em decimal = 0.333...):

```
0.1 (decimal) = 0.0001100110011001100... (binário, infinito)
0.2 (decimal) = 0.0011001100110011001... (binário, infinito)
```

IEEE 754 **arredonda** após 52 bits, introduzindo erro minúsculo que acumula.

**Solução:**
```typescript
// Comparação com epsilon
const epsilon = Number.EPSILON; // 2.220446049250313e-16
Math.abs(0.1 + 0.2 - 0.3) < epsilon; // true

// Ou arredondar para decimais fixos
parseFloat((0.1 + 0.2).toFixed(10)) === 0.3; // true
```

#### Safe Integer Range

Inteiros representáveis exatamente: **-2⁵³ + 1** a **2⁵³ - 1**

```typescript
Number.MAX_SAFE_INTEGER; // 9007199254740991 (2⁵³ - 1)
Number.MIN_SAFE_INTEGER; // -9007199254740991 (-(2⁵³ - 1))
```

**Por que limitado?**
Mantissa tem 52 bits + 1 bit implícito = 53 bits de precisão.

**Fora do Range:**
```typescript
const grande = 9007199254740992; // 2⁵³
grande + 1 === grande + 2; // true! (ambos arredondados para 9007199254740992)

Number.isSafeInteger(grande); // false
```

**Solução:** Usar `bigint` para inteiros grandes.

### Operações Aritméticas

#### Operadores Básicos

```typescript
const a: number = 10;
const b: number = 3;

a + b;  // 13 (adição)
a - b;  // 7 (subtração)
a * b;  // 30 (multiplicação)
a / b;  // 3.3333333333333335 (divisão)
a % b;  // 1 (módulo/resto)
a ** b; // 1000 (exponenciação - 10³)
```

#### Divisão por Zero

```typescript
10 / 0;   // Infinity
-10 / 0;  // -Infinity
0 / 0;    // NaN
```

#### Operações com NaN

```typescript
NaN + 10;  // NaN
NaN * 5;   // NaN
NaN / 2;   // NaN
NaN ** 2;  // NaN
```

**Regra:** Qualquer operação com NaN resulta em NaN.

#### Operações com Infinity

```typescript
Infinity + 10;        // Infinity
Infinity * 2;         // Infinity
Infinity / 2;         // Infinity
10 / Infinity;        // 0
Infinity - Infinity;  // NaN
Infinity / Infinity;  // NaN
```

### Funções Utilitárias

#### Number.isNaN vs. isNaN Global

```typescript
// Global isNaN (converte para número primeiro - problemático)
isNaN('hello');      // true (converte 'hello' → NaN)
isNaN(undefined);    // true (converte undefined → NaN)

// Number.isNaN (verifica se É NaN sem conversão - recomendado)
Number.isNaN('hello');    // false ('hello' não É NaN, é string)
Number.isNaN(undefined);  // false
Number.isNaN(NaN);        // true
```

#### Number.isFinite vs. isFinite Global

```typescript
// Global isFinite (converte para número)
isFinite('123');     // true (converte '123' → 123)

// Number.isFinite (sem conversão - recomendado)
Number.isFinite('123');   // false ('123' é string, não number finito)
Number.isFinite(123);     // true
Number.isFinite(Infinity); // false
```

#### Number.parseInt / parseFloat

```typescript
Number.parseInt('42');       // 42
Number.parseInt('42.99');    // 42 (trunca parte decimal)
Number.parseInt('42px');     // 42 (ignora caracteres não-numéricos no final)

Number.parseFloat('3.14');   // 3.14
Number.parseFloat('3.14abc'); // 3.14
```

---

## 🔍 Análise Conceitual Profunda

### Casos de Uso

#### 1. Contadores e Índices

```typescript
let contador: number = 0;
contador++;

const items: string[] = ['a', 'b', 'c'];
for (let i: number = 0; i < items.length; i++) {
  console.log(items[i]);
}
```

#### 2. Cálculos Financeiros

```typescript
function calcularTotal(preco: number, quantidade: number, desconto: number): number {
  const subtotal = preco * quantidade;
  const valorDesconto = subtotal * (desconto / 100);
  return subtotal - valorDesconto;
}

// Atenção: usar bibliotecas especializadas (decimal.js) para precisão crítica
```

#### 3. Timestamps

```typescript
const agora: number = Date.now(); // Milissegundos desde 1970-01-01
const timestamp: number = new Date('2024-01-15').getTime();
```

#### 4. Coordenadas Geográficas

```typescript
interface Coordenada {
  latitude: number;  // -90 a 90
  longitude: number; // -180 a 180
}

const saoPaulo: Coordenada = {
  latitude: -23.550520,
  longitude: -46.633308
};
```

#### 5. Probabilidades e Estatísticas

```typescript
function media(valores: number[]): number {
  const soma = valores.reduce((acc, val) => acc + val, 0);
  return soma / valores.length;
}

function aleatorio(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
```

### Armadilhas Comuns

#### ❌ Comparação Direta de Floats

```typescript
// ❌ Ruim
0.1 + 0.2 === 0.3; // false

// ✅ Bom - usar epsilon
function aproximadamenteIgual(a: number, b: number): boolean {
  return Math.abs(a - b) < Number.EPSILON;
}

aproximadamenteIgual(0.1 + 0.2, 0.3); // true
```

#### ❌ Confundir NaN

```typescript
// ❌ Ruim
const resultado = 0 / 0;
if (resultado === NaN) { } // Nunca true! NaN !== NaN

// ✅ Bom
if (Number.isNaN(resultado)) { } // true
```

#### ❌ Inteiros Muito Grandes

```typescript
// ❌ Ruim - perda de precisão
const grande: number = 9007199254740993;
grande === 9007199254740992; // true! (arredondado)

// ✅ Bom - usar bigint
const grande: bigint = 9007199254740993n;
```

#### ❌ Conversão Implícita Perigosa

```typescript
// ❌ Ruim
const soma = '10' + 20; // '1020' (concatenação de string!)

// ✅ Bom - conversão explícita
const soma = Number('10') + 20; // 30
```

### Boas Práticas

#### ✅ Usar Type Annotations

```typescript
// ✅ Explícito
function calcular(x: number, y: number): number {
  return x + y;
}

calcular(10, 20);     // OK
calcular('10', 20);   // Erro TS
```

#### ✅ Validar Entrada

```typescript
function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Divisão por zero');
  }
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new Error('Valores devem ser finitos');
  }
  return a / b;
}
```

#### ✅ Usar Number Methods

```typescript
// ✅ Recomendado (type-safe)
Number.isNaN(valor);
Number.isFinite(valor);
Number.parseInt(string);

// ❌ Evitar (globais menos type-safe)
isNaN(valor);
isFinite(valor);
parseInt(string);
```

#### ✅ Arredondar Explicitamente

```typescript
// Arredondamento financeiro (sempre para cima)
const preco = Math.ceil(19.001 * 100) / 100; // 19.01

// Arredondamento padrão (mais próximo)
const media = Math.round(19.456 * 100) / 100; // 19.46

// Truncar decimais
const inteiro = Math.trunc(19.999); // 19
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar `number`

**1. Contadores e Índices:** Loops, arrays
**2. Cálculos Matemáticos:** Fórmulas, estatísticas
**3. Valores Monetários:** Com cuidado (bibliotecas especializadas para precisão)
**4. Timestamps:** Milissegundos desde epoch
**5. Coordenadas:** GPS, gráficos

### Quando NÃO Usar `number`

**1. Inteiros Muito Grandes:** Usar `bigint`
**2. Precisão Financeira Crítica:** Usar bibliotecas (decimal.js, big.js)
**3. Identificadores Únicos:** Preferir `string` ou `symbol`

---

## ⚠️ Limitações e Considerações Teóricas

### Limitação: Precisão Decimal

**Problema:** Erros de arredondamento.

```typescript
0.1 + 0.2; // 0.30000000000000004
```

**Mitigação:** Epsilon comparisons, bibliotecas decimais.

### Limitação: Inteiros Grandes

**Problema:** Precisão apenas até 2⁵³ - 1.

**Mitigação:** Usar `bigint` para inteiros grandes.

### Limitação: NaN Propagation

**Problema:** NaN contamina cálculos.

```typescript
const resultado = 10 + NaN; // NaN
```

**Mitigação:** Validar inputs antes de calcular.

---

## 🔗 Interconexões Conceituais

### Relação com BigInt

`bigint` complementa `number` para inteiros arbitrariamente grandes.

### Relação com Math Object

`Math` fornece funções para `number`: `Math.sqrt()`, `Math.pow()`, etc.

### Relação com Type Coercion

JavaScript converte implicitamente entre `number` e outros tipos - TypeScript previne.

---

## 🚀 Evolução e Próximos Conceitos

### Fundação para Cálculos

Dominar `number` é base para:
- Algoritmos matemáticos
- Estatísticas e probabilidade
- Manipulação de datas
- Gráficos e visualizações

### Preparação para Tipos Avançados

Entender `number` prepara para:
- Union types (`number | string`)
- Literal types (`42` como tipo)
- Generic numeric types

### Caminho para Precisão

Evolução:
1. **Usar `number`** → Casos gerais
2. **Entender Limitações** → Precisão, range
3. **Migrar para `bigint`/Bibliotecas** → Casos especiais

O tipo `number` é fundamental mas tem limitações - use conscientemente, valide inputs, e escolha ferramentas apropriadas (bigint, decimal.js) quando `number` não é suficiente.
