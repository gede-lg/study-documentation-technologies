# Array Destructuring - Swapping Variables: Análise Conceitual

## 🎯 Definição

**Swapping Variables** (troca de variáveis) usando array destructuring é uma técnica elegante para **trocar os valores** de duas ou mais variáveis em uma única linha, sem necessidade de variável temporária. É um dos usos mais práticos e idiomáticos de array destructuring.

```javascript
// Antes (ES5): necessita variável temporária
let a = 1;
let b = 2;

let temp = a;
a = b;
b = temp;

console.log(a, b); // 2, 1

// Agora (ES6): destructuring elegante
let x = 1;
let y = 2;

[x, y] = [y, x];

console.log(x, y); // 2, 1
```

**Conceito:** Criar array temporário com valores na ordem trocada e desestruturar de volta para as variáveis originais.

## 📋 Sintaxe

```javascript
[a, b] = [b, a];
```

**Funcionamento:**
1. Lado direito: `[b, a]` cria array com valores trocados
2. Lado esquerdo: `[a, b]` desestrutura array para variáveis
3. Resultado: valores foram trocados

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

```javascript
let x = 10;
let y = 20;

// [x, y] = [y, x]
// Passo 1: Avaliar lado direito ANTES de atribuição
// -> [20, 10] (array temporário)
//
// Passo 2: Desestruturar para lado esquerdo
// -> x = 20 (primeiro elemento)
// -> y = 10 (segundo elemento)

[x, y] = [y, x];

console.log(x, y); // 20, 10
```

**Princípio:** O lado direito é **avaliado completamente** antes da atribuição, criando snapshot dos valores originais.

### Múltiplas Variáveis

Pode-se trocar 3+ variáveis simultaneamente.

```javascript
let a = 1;
let b = 2;
let c = 3;

// Rotação para direita
[a, b, c] = [c, a, b];

console.log(a, b, c); // 3, 1, 2

// Rotação para esquerda
[a, b, c] = [b, c, a];

console.log(a, b, c); // 1, 2, 3 (volta ao original)
```

### Swap sem Reatribuição Direta

```javascript
// Pode usar em arrays de objetos
const pontos = [[10, 20], [30, 40]];

[pontos[0], pontos[1]] = [pontos[1], pontos[0]];

console.log(pontos); // [[30, 40], [10, 20]]
```

## 🔍 Casos de Uso Práticos

### Algoritmos de Ordenação

```javascript
function bubbleSort(array) {
  const resultado = [...array];

  for (let i = 0; i < resultado.length; i++) {
    for (let j = 0; j < resultado.length - 1 - i; j++) {
      if (resultado[j] > resultado[j + 1]) {
        // Swap elegante
        [resultado[j], resultado[j + 1]] = [resultado[j + 1], resultado[j]];
      }
    }
  }

  return resultado;
}

console.log(bubbleSort([5, 3, 8, 1, 2]));
// [1, 2, 3, 5, 8]
```

### Inversão de Coordenadas

```javascript
function inverterCoordenadas(pontos) {
  return pontos.map(([x, y]) => [y, x]);
}

const original = [[1, 2], [3, 4], [5, 6]];
const invertido = inverterCoordenadas(original);

console.log(invertido); // [[2, 1], [4, 3], [6, 5]]
```

### Fibonacci com Swap

```javascript
function fibonacci(n) {
  let a = 0;
  let b = 1;

  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }

  return a;
}

console.log(fibonacci(10)); // 55
```

### Reverter Array In-Place

```javascript
function reverter(array) {
  let esquerda = 0;
  let direita = array.length - 1;

  while (esquerda < direita) {
    [array[esquerda], array[direita]] = [array[direita], array[esquerda]];
    esquerda++;
    direita--;
  }

  return array;
}

const arr = [1, 2, 3, 4, 5];
reverter(arr);
console.log(arr); // [5, 4, 3, 2, 1]
```

### Rotação de Valores

```javascript
let primeiro = 'A';
let segundo = 'B';
let terceiro = 'C';

// Rotação cíclica
[primeiro, segundo, terceiro] = [terceiro, primeiro, segundo];

console.log(primeiro, segundo, terceiro); // C, A, B
```

### Shuffle (Embaralhar)

```javascript
function embaralhar(array) {
  const resultado = [...array];

  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }

  return resultado;
}

console.log(embaralhar([1, 2, 3, 4, 5]));
// [3, 1, 5, 2, 4] (ordem aleatória)
```

### Corrigir Ordem de Dados

```javascript
function normalizarData(data) {
  let [dia, mes, ano] = data.split('/');

  // Se ano está no início (ISO), trocar
  if (ano && ano.length === 4 && dia.length === 4) {
    [dia, ano] = [ano, dia];
  }

  return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
}

console.log(normalizarData('2024/12/25')); // 25/12/2024
console.log(normalizarData('25/12/2024')); // 25/12/2024
```

## ⚠️ Comparação com Alternativas

### Com Variável Temporária (ES5)

```javascript
// Tradicional
let a = 1;
let b = 2;

let temp = a;
a = b;
b = temp;

// 3 linhas, variável extra
```

### Com Operações Aritméticas (Hack)

```javascript
let a = 10;
let b = 20;

a = a + b; // 30
b = a - b; // 10
a = a - b; // 20

// Funciona mas:
// - Menos legível
// - Pode causar overflow
// - Não funciona com strings/objetos
```

### Com XOR (Hack para Números)

```javascript
let a = 10;
let b = 20;

a ^= b;
b ^= a;
a ^= b;

// Funciona mas:
// - Muito críptico
// - Apenas para números
// - Difícil de entender
```

### Com Destructuring (Melhor)

```javascript
let a = 10;
let b = 20;

[a, b] = [b, a];

// ✅ Claro
// ✅ Conciso
// ✅ Funciona com qualquer tipo
// ✅ Performático
```

## 🚀 Boas Práticas

### Preferir Destructuring

```javascript
// ✅ Moderno e claro
[x, y] = [y, x];

// ❌ Verboso
const temp = x;
x = y;
y = temp;
```

### Múltiplas Trocas

```javascript
// ✅ Swap múltiplo em uma linha
[a, b, c, d] = [d, c, b, a];

// ❌ Múltiplas linhas com temp
```

### Documentar Lógica Complexa

```javascript
// Rotacionar RGB → GBR (verde, azul, vermelho)
[r, g, b] = [g, b, r];
```

Swapping variables com array destructuring é uma das features mais elegantes do ES6, transformando uma operação tradicional de 3 linhas em uma expressão concisa e expressiva de uma linha.
