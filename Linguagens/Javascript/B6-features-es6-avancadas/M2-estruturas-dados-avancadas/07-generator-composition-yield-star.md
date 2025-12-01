# Generator Composition e yield*: Análise Conceitual

## 🎯 Definição

**yield*** (yield star/delegation) delega iteração para outro generator ou iterable, permitindo **composição** de generators. Funciona como "achatar" generators aninhados.

```javascript
function* gen1() {
  yield 1;
  yield 2;
}

function* gen2() {
  yield* gen1(); // Delegar para gen1
  yield 3;
}

console.log([...gen2()]); // [1, 2, 3]
```

**Conceito:** Composição hierárquica de generators delegando controle.

## 📋 Sintaxe

```javascript
function* principal() {
  yield* outroGenerator();
  yield* iterable;
}
```

### Diferença: yield vs yield*

```javascript
function* numeros() {
  yield 1;
  yield 2;
}

function* comYield() {
  yield numeros(); // Produz generator
}

function* comYieldStar() {
  yield* numeros(); // Produz valores
}

console.log([...comYield()]);     // [[Generator]]
console.log([...comYieldStar()]); // [1, 2]
```

## 🔍 Casos de Uso

### Composição de Sequências

```javascript
function* letras() {
  yield 'a';
  yield 'b';
}

function* numeros() {
  yield 1;
  yield 2;
}

function* combinado() {
  yield* letras();
  yield* numeros();
}

console.log([...combinado()]); // ['a', 'b', 1, 2]
```

### Árvore Recursiva

```javascript
class Node {
  constructor(valor) {
    this.valor = valor;
    this.filhos = [];
  }

  *percorrer() {
    yield this.valor;

    for (const filho of this.filhos) {
      yield* filho.percorrer(); // Recursão
    }
  }
}

const raiz = new Node(1);
raiz.filhos.push(new Node(2), new Node(3));
raiz.filhos[0].filhos.push(new Node(4));

console.log([...raiz.percorrer()]); // [1, 2, 4, 3]
```

### Flatten Array

```javascript
function* flatten(array) {
  for (const item of array) {
    if (Array.isArray(item)) {
      yield* flatten(item); // Recursivo
    } else {
      yield item;
    }
  }
}

const aninhado = [1, [2, [3, [4]], 5], 6];
console.log([...flatten(aninhado)]); // [1, 2, 3, 4, 5, 6]
```

## ⚠️ Com Iterables Nativos

```javascript
function* exemplo() {
  yield* 'abc';      // String é iterable
  yield* [1, 2, 3];  // Array é iterable
  yield* new Set([4, 5]); // Set é iterable
}

console.log([...exemplo()]); // ['a', 'b', 'c', 1, 2, 3, 4, 5]
```

yield* permite construir generators complexos a partir de generators simples, promovendo modularidade e reutilização através de composição.
