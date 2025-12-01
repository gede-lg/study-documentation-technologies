# Array Destructuring - Nested Destructuring: Análise Conceitual

## 🎯 Definição

**Nested Destructuring** (desestruturação aninhada) permite desestruturar **arrays dentro de arrays** (arrays multidimensionais) em uma única expressão, extraindo valores de estruturas aninhadas profundamente sem necessidade de múltiplas atribuições.

```javascript
const matriz = [[1, 2], [3, 4], [5, 6]];

const [[a, b], [c, d], [e, f]] = matriz;

console.log(a, b); // 1, 2
console.log(c, d); // 3, 4
console.log(e, f); // 5, 6
```

**Conceito:** Desestruturar recursivamente arrays aninhados usando padrões que espelham a estrutura dos dados.

## 📋 Sintaxe

```javascript
// Array bidimensional
const [[a, b], [c, d]] = [[1, 2], [3, 4]];

// Array tridimensional
const [[[x]]] = [[[10]]];
```

## 🧠 Fundamentos Teóricos

### Pattern Matching Estrutural

O padrão de desestruturação deve **espelhar** a estrutura do array.

```javascript
// Estrutura: array de arrays
const dados = [
  [1, 2, 3],
  [4, 5, 6]
];

// Padrão espelha estrutura
const [
  [a, b, c],
  [d, e, f]
] = dados;

console.log(a); // 1
console.log(f); // 6
```

### Níveis Arbitrários de Profundidade

```javascript
// 3 níveis de profundidade
const profundo = [[[1, 2]], [[3, 4]]];

const [[[a, b]], [[c, d]]] = profundo;

console.log(a); // 1
console.log(d); // 4
```

### Misturar Aninhado com Não-Aninhado

```javascript
const misto = [1, [2, 3], 4];

const [a, [b, c], d] = misto;

console.log(a); // 1
console.log(b); // 2
console.log(c); // 3
console.log(d); // 4
```

## 🔍 Casos de Uso Práticos

### Matrizes

```javascript
const matriz = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const [[a, b, c], [d, e, f], [g, h, i]] = matriz;

console.log(e); // 5 (elemento central)
```

### Coordenadas 2D/3D

```javascript
const pontos = [
  [10, 20],
  [30, 40],
  [50, 60]
];

for (const [[x, y]] of [pontos]) {
  // Desestruturando cada ponto no loop
}

// Ou direto:
const [[x1, y1], [x2, y2], [x3, y3]] = pontos;
```

### Árvores e Grafos

```javascript
const arvore = [
  'raiz',
  [
    ['filho1', []],
    ['filho2', [
      ['neto1', []],
      ['neto2', []]
    ]]
  ]
];

const [raiz, [[filho1], [filho2, netos]]] = arvore;

console.log(raiz);   // 'raiz'
console.log(filho1); // 'filho1'
console.log(netos);  // [['neto1', []], ['neto2', []]]
```

### RGB de Múltiplas Cores

```javascript
const cores = [
  [255, 0, 0],     // vermelho
  [0, 255, 0],     // verde
  [0, 0, 255]      // azul
];

const [[r1, g1, b1], [r2, g2, b2], [r3, g3, b3]] = cores;

console.log(`Vermelho: rgb(${r1}, ${g1}, ${b1})`);
console.log(`Verde: rgb(${r2}, ${g2}, ${b2})`);
console.log(`Azul: rgb(${r3}, ${g3}, ${b3})`);
```

## ⚠️ Armadilhas

### Estrutura Incompatível

```javascript
const array = [1, 2, 3];

// ❌ Espera array aninhado, mas recebe número
const [[a]] = array; // TypeError: 1 is not iterable
```

### Profundidade Errada

```javascript
const dados = [[1, 2]];

// ❌ Tenta desestruturar 2 níveis, mas há apenas 1
const [[[a]]] = dados; // TypeError
```

### Defaults em Nested

```javascript
const dados = [
  [1, 2],
  // segundo array ausente
];

const [
  [a, b] = [0, 0],
  [c, d] = [0, 0]
] = dados;

console.log(a, b); // 1, 2
console.log(c, d); // 0, 0 (default)
```

Nested destructuring é poderoso para trabalhar com estruturas de dados hierárquicas, permitindo extrair valores profundos de forma declarativa e concisa.
