# yield, next() e return: Análise Conceitual

## 🎯 yield Keyword

**yield** pausa execução do generator e produz um valor. Execução retoma de onde parou quando `next()` é chamado novamente.

```javascript
function* exemplo() {
  console.log('Início');
  yield 1;
  console.log('Meio');
  yield 2;
  console.log('Fim');
  return 3;
}

const gen = exemplo();
gen.next(); // 'Início' | { value: 1, done: false }
gen.next(); // 'Meio' | { value: 2, done: false }
gen.next(); // 'Fim' | { value: 3, done: true }
```

### yield Pode Receber Valores

```javascript
function* dialogo() {
  const nome = yield 'Qual seu nome?';
  const idade = yield 'Qual sua idade?';
  return `${nome}, ${idade} anos`;
}

const gen = dialogo();

console.log(gen.next().value);        // 'Qual seu nome?'
console.log(gen.next('João').value);  // 'Qual sua idade?'
console.log(gen.next(30).value);      // 'João, 30 anos'
```

## 📋 next() Method

**next(valor)** retoma generator e opcionalmente passa valor para expressão `yield`.

```javascript
function* contador() {
  let total = 0;

  while (true) {
    const incremento = yield total;
    total += incremento || 1;
  }
}

const gen = contador();

console.log(gen.next());    // { value: 0, done: false }
console.log(gen.next(5));   // { value: 5, done: false }
console.log(gen.next(10));  // { value: 15, done: false }
console.log(gen.next());    // { value: 16, done: false }
```

### Primeira Chamada next()

Primeiro `next()` nunca recebe valor (não há `yield` anterior).

```javascript
function* teste() {
  const x = yield 'primeiro';
  console.log('x =', x);
}

const gen = teste();

gen.next('ignorado'); // Valor ignorado
// { value: 'primeiro', done: false }

gen.next('usado');
// 'x = usado'
```

## 🔍 return Method

**return(valor)** encerra generator imediatamente.

```javascript
function* numeros() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numeros();

console.log(gen.next());        // { value: 1, done: false }
console.log(gen.return('fim')); // { value: 'fim', done: true }
console.log(gen.next());        // { value: undefined, done: true }
```

### Cleanup com try/finally

```javascript
function* recurso() {
  try {
    console.log('Abrindo...');
    yield 1;
    yield 2;
  } finally {
    console.log('Limpando...');
  }
}

const gen = recurso();
gen.next(); // 'Abrindo...'
gen.return(); // 'Limpando...'
```

## ⚠️ throw Method

**throw(erro)** injeta erro no generator.

```javascript
function* robusto() {
  try {
    yield 1;
    yield 2;
  } catch (erro) {
    console.log('Erro capturado:', erro.message);
  }
  yield 3;
}

const gen = robusto();

console.log(gen.next().value);              // 1
console.log(gen.throw(new Error('Ops')));   // 'Erro capturado: Ops'
                                             // { value: 3, done: false }
```

yield, next() e return() formam a tríade de controle de generators, permitindo comunicação bidirecional e controle fino de fluxo entre o generator e seu consumidor.
