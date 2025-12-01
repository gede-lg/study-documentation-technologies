# Generator Functions: Análise Conceitual

## 🎯 Definição

**Generator Functions** são funções especiais que podem pausar sua execução e retomá-la posteriormente, criando automaticamente iterators. Declaradas com `function*` (asterisco), usam `yield` para produzir valores e pausar execução.

```javascript
function* contador() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = contador();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

**Conceito:** Funções que retornam generators (iterators especiais) e podem pausar/retomar execução.

## 📋 Sintaxe

```javascript
// Function declaration
function* nomeDaFuncao() {
  yield valor;
}

// Function expression
const gen = function*() {
  yield valor;
};

// Method em objeto
const obj = {
  *metodo() {
    yield valor;
  }
};

// Arrow function NÃO suporta generators
// const gen = *() => { }; // SyntaxError
```

## 🧠 Fundamentos

### Generators são Iterator Factories

```javascript
function* numeros() {
  yield 1;
  yield 2;
  yield 3;
}

// Cada chamada cria NOVO generator
const gen1 = numeros();
const gen2 = numeros();

console.log(gen1.next().value); // 1
console.log(gen2.next().value); // 1 (independente)
```

### Generators são Lazy (Preguiçosos)

```javascript
function* valores() {
  console.log('Iniciando...');
  yield 1;
  console.log('Meio...');
  yield 2;
  console.log('Fim...');
  yield 3;
}

const gen = valores();
// Nada impresso ainda (não executou)

gen.next(); // 'Iniciando...' | { value: 1, done: false }
gen.next(); // 'Meio...' | { value: 2, done: false }
gen.next(); // 'Fim...' | { value: 3, done: false }
```

### Generators são Iterables

```javascript
function* letras() {
  yield 'a';
  yield 'b';
  yield 'c';
}

// Pode usar for...of
for (const letra of letras()) {
  console.log(letra); // a, b, c
}

// Pode usar spread
console.log([...letras()]); // ['a', 'b', 'c']

// Pode usar destructuring
const [x, y, z] = letras();
```

## 🔍 Exemplos Práticos

### Range Generator

```javascript
function* range(inicio, fim, passo = 1) {
  for (let i = inicio; i < fim; i += passo) {
    yield i;
  }
}

console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8]
```

### Fibonacci Infinito

```javascript
function* fibonacci() {
  let a = 0, b = 1;

  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Pegar apenas 10 primeiros
const fib = fibonacci();
const primeiros10 = [];

for (let i = 0; i < 10; i++) {
  primeiros10.push(fib.next().value);
}

console.log(primeiros10); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### ID Generator

```javascript
function* gerarIDs(prefixo = 'ID') {
  let contador = 1;

  while (true) {
    yield `${prefixo}-${contador++}`;
  }
}

const ids = gerarIDs('USER');

console.log(ids.next().value); // 'USER-1'
console.log(ids.next().value); // 'USER-2'
console.log(ids.next().value); // 'USER-3'
```

### Iterar Árvore

```javascript
class TreeNode {
  constructor(valor) {
    this.valor = valor;
    this.filhos = [];
  }

  *[Symbol.iterator]() {
    yield this.valor;

    for (const filho of this.filhos) {
      yield* filho; // Delegar para sub-árvore
    }
  }
}

const raiz = new TreeNode(1);
raiz.filhos.push(new TreeNode(2), new TreeNode(3));
raiz.filhos[0].filhos.push(new TreeNode(4));

console.log([...raiz]); // [1, 2, 4, 3]
```

## ⚠️ Considerações

### Generator é Consumível

```javascript
function* numeros() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numeros();

console.log([...gen]); // [1, 2, 3]
console.log([...gen]); // [] (esgotado)
```

### return Encerra Generator

```javascript
function* numeros() {
  yield 1;
  return 'fim';
  yield 2; // Nunca executado
}

const gen = numeros();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 'fim', done: true }
console.log(gen.next()); // { value: undefined, done: true }
```

Generator functions simplificam drasticamente a criação de iterators, transformando código complexo de estado manual em fluxo linear com pausas, tornando iteração customizada muito mais acessível.
