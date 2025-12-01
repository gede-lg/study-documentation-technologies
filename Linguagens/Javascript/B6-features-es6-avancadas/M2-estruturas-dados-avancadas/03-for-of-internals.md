# for...of Internals: Análise Conceitual

## 🎯 Definição

**for...of** é uma estrutura de loop que itera sobre **iterables** (objetos que implementam iterable protocol), consumindo seus iterators automaticamente. Internamente, o loop chama `[Symbol.iterator]()` para obter um iterator e então chama `next()` repetidamente até `done` ser `true`.

```javascript
const array = [1, 2, 3];

for (const valor of array) {
  console.log(valor);
}

// Equivalente manual:
const iterator = array[Symbol.iterator]();
let resultado = iterator.next();

while (!resultado.done) {
  const valor = resultado.value;
  console.log(valor);
  resultado = iterator.next();
}
```

**Conceito:** Abstração de alto nível que simplifica consumo de iterators.

## 🧠 Como Funciona

### Processo Interno

1. **Obter Iterator:** Chama `objeto[Symbol.iterator]()`
2. **Loop:** Repete `iterator.next()` enquanto `done === false`
3. **Atribuir:** Valor de `value` é atribuído à variável do loop
4. **Cleanup:** Se loop quebra, chama `iterator.return()` se existir

```javascript
// for...of
for (const item of iteravel) {
  // corpo
}

// Desugared (aproximação)
{
  const iterator = iteravel[Symbol.iterator]();
  let resultado;

  try {
    while (true) {
      resultado = iterator.next();

      if (resultado.done) {
        break;
      }

      const item = resultado.value;
      // corpo do loop
    }
  } finally {
    if (iterator.return) {
      iterator.return();
    }
  }
}
```

## 🔍 Características

### Funciona com Qualquer Iterable

```javascript
// Arrays
for (const n of [1, 2, 3]) { }

// Strings
for (const char of 'abc') { }

// Maps
for (const [chave, valor] of new Map([['a', 1]])) { }

// Sets
for (const valor of new Set([1, 2, 3])) { }

// Arguments
function teste() {
  for (const arg of arguments) { }
}

// Custom iterables
for (const n of range(0, 10)) { }
```

### Destructuring no Loop

```javascript
const pares = [[1, 2], [3, 4], [5, 6]];

for (const [a, b] of pares) {
  console.log(a, b);
}
// 1 2
// 3 4
// 5 6
```

### Break/Continue

```javascript
for (const n of [1, 2, 3, 4, 5]) {
  if (n === 3) continue;
  if (n === 5) break;
  console.log(n); // 1, 2, 4
}
```

## ⚠️ vs for...in

```javascript
const array = [10, 20, 30];
array.propriedade = 'extra';

// for...in: itera sobre CHAVES (índices)
for (const chave in array) {
  console.log(chave); // '0', '1', '2', 'propriedade'
}

// for...of: itera sobre VALORES
for (const valor of array) {
  console.log(valor); // 10, 20, 30
}
```

## 🚀 Vantagens

- ✅ Sintaxe limpa e legível
- ✅ Funciona com qualquer iterable
- ✅ Suporta break/continue/return
- ✅ Cleanup automático (return())
- ✅ Sem acesso a índice desnecessário

for...of é a forma idiomática moderna de iterar sobre sequências em JavaScript, abstraindo toda complexidade do iterator protocol em uma sintaxe simples e expressiva.
