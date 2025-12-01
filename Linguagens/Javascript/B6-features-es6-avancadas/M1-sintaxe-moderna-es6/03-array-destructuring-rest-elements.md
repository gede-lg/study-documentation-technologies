# Array Destructuring - Rest Elements: Análise Conceitual

## 🎯 Definição

**Rest Elements** (elementos rest/resto) em array destructuring usam a sintaxe `...` (spread) para capturar **todos os elementos restantes** de um array em uma nova array. Permite extrair os primeiros elementos individualmente e agrupar o restante.

```javascript
const numeros = [1, 2, 3, 4, 5];

const [primeiro, segundo, ...resto] = numeros;

console.log(primeiro); // 1
console.log(segundo);  // 2
console.log(resto);    // [3, 4, 5]
```

**Conceito:** Coletar elementos restantes não desestruturados em um único array.

## 📋 Sintaxe

```javascript
const [elemento1, elemento2, ...resto] = array;
```

**Restrição:** Rest element deve ser **sempre o último** no padrão.

```javascript
// ✅ OK
const [a, b, ...resto] = array;

// ❌ ERRO
const [a, ...resto, b] = array; // SyntaxError
```

## 🧠 Fundamentos Teóricos

### Rest Cria Novo Array

```javascript
const original = [1, 2, 3, 4, 5];
const [a, b, ...resto] = original;

console.log(resto); // [3, 4, 5]

// resto é um NOVO array
resto.push(6);
console.log(resto);    // [3, 4, 5, 6]
console.log(original); // [1, 2, 3, 4, 5] (inalterado)
```

### Rest com Array Vazio

```javascript
const [a, b, ...resto] = [1, 2];

console.log(a);     // 1
console.log(b);     // 2
console.log(resto); // [] (array vazio, não undefined)
```

### Rest Captura Tudo que Sobra

```javascript
const [primeiro, ...todos] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(primeiro); // 1
console.log(todos);    // [2, 3, 4, 5, 6, 7, 8, 9, 10]
```

## 🔍 Casos de Uso Práticos

### Separar Cabeçalho de Corpo

```javascript
const csv = ['Nome', 'Idade', 'Cidade', 'João', '30', 'SP', 'Maria', '25', 'RJ'];

const [col1, col2, col3, ...dados] = csv;

console.log('Colunas:', col1, col2, col3);
// Colunas: Nome Idade Cidade

console.log('Dados:', dados);
// Dados: ['João', '30', 'SP', 'Maria', '25', 'RJ']
```

### Head/Tail Pattern

```javascript
function somar([primeiro, ...resto]) {
  if (resto.length === 0) {
    return primeiro;
  }
  return primeiro + somar(resto);
}

console.log(somar([1, 2, 3, 4, 5])); // 15
```

### Ignorar Alguns, Capturar Restantes

```javascript
const ranking = ['Ouro', 'Prata', 'Bronze', '4º', '5º', '6º', '7º'];

const [primeiro, segundo, terceiro, ...demais] = ranking;

console.log(`Pódio: ${primeiro}, ${segundo}, ${terceiro}`);
// Pódio: Ouro, Prata, Bronze

console.log(`Outros: ${demais.join(', ')}`);
// Outros: 4º, 5º, 6º, 7º
```

### Clonar Array (Parcialmente)

```javascript
const original = [1, 2, 3, 4, 5];

// Pular primeiro elemento e clonar resto
const [, ...clone] = original;

console.log(clone); // [2, 3, 4, 5]
```

### Parâmetros Variádicos

```javascript
function criarTime([tecnico, capitao, ...jogadores]) {
  return {
    tecnico,
    capitao,
    jogadores,
    total: 2 + jogadores.length
  };
}

const time = criarTime(['Carlos', 'João', 'Pedro', 'Ana', 'Maria', 'José']);

console.log(time);
// {
//   tecnico: 'Carlos',
//   capitao: 'João',
//   jogadores: ['Pedro', 'Ana', 'Maria', 'José'],
//   total: 6
// }
```

## ⚠️ Considerações

### Rest Deve Ser Último

```javascript
// ❌ ERRO
const [...resto, ultimo] = [1, 2, 3]; // SyntaxError

// ✅ OK
const [primeiro, ...resto] = [1, 2, 3];
```

### Apenas Um Rest

```javascript
// ❌ ERRO
const [...resto1, ...resto2] = [1, 2, 3]; // SyntaxError
```

### Rest com Defaults

```javascript
const [a = 1, ...resto] = [];

console.log(a);     // 1 (default)
console.log(resto); // [] (vazio)
```

Rest elements são essenciais para pattern matching flexível em arrays, permitindo separar elementos específicos do restante de forma concisa.
