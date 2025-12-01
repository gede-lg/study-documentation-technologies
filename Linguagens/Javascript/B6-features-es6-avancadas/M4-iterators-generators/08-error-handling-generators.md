# Error Handling em Generators: Análise Conceitual

## 🎯 Definição

Generators suportam **tratamento de erros bidirecional**: podem capturar erros internamente com try/catch e receber erros externos via `throw()`, permitindo controle robusto de exceções em iteração.

```javascript
function* robusto() {
  try {
    yield 1;
    yield 2;
  } catch (erro) {
    console.log('Erro capturado:', erro.message);
    yield 'recuperado';
  }
}

const gen = robusto();

console.log(gen.next().value);                    // 1
console.log(gen.throw(new Error('Ops')).value);   // 'Erro capturado: Ops'
                                                   // 'recuperado'
```

**Conceito:** Controle bidirecional de exceções entre generator e consumidor.

## 📋 Formas de Error Handling

### Erro Interno (Propagado)

```javascript
function* comErro() {
  yield 1;
  throw new Error('Erro interno');
  yield 2; // Nunca executado
}

const gen = comErro();

console.log(gen.next()); // { value: 1, done: false }

try {
  gen.next(); // Lança erro
} catch (e) {
  console.log('Capturado:', e.message);
}
```

### Erro Externo (Injetado)

```javascript
function* comCatch() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log('Interno:', e.message);
  }
  yield 3;
}

const gen = comCatch();

gen.next(); // 1
gen.throw(new Error('Externo')); // 'Interno: Externo'
                                  // { value: 3, done: false }
```

### Finally para Cleanup

```javascript
function* comRecurso() {
  try {
    console.log('Alocando...');
    yield 1;
    yield 2;
  } finally {
    console.log('Limpando...');
  }
}

const gen = comRecurso();

gen.next(); // 'Alocando...'
gen.throw(new Error()); // 'Limpando...' (cleanup executado)
```

## 🔍 Padrões Práticos

### Retry Automático

```javascript
function* comRetry(tentativas) {
  for (let i = 0; i < tentativas; i++) {
    try {
      yield `Tentativa ${i + 1}`;
      return 'Sucesso';
    } catch (erro) {
      if (i === tentativas - 1) {
        throw erro; // Última tentativa
      }
      console.log('Tentando novamente...');
    }
  }
}

const gen = comRetry(3);

gen.next();
gen.throw(new Error()); // 'Tentando novamente...'
gen.throw(new Error()); // 'Tentando novamente...'
gen.throw(new Error()); // Lança erro
```

### Validação de Entrada

```javascript
function* validador() {
  while (true) {
    const entrada = yield 'Digite número:';

    if (typeof entrada !== 'number') {
      throw new Error('Não é número');
    }

    if (entrada < 0) {
      throw new Error('Deve ser positivo');
    }

    yield `Válido: ${entrada}`;
  }
}
```

Error handling em generators permite criar sequências robustas que podem se recuperar de erros, fazer cleanup apropriado e comunicar problemas de forma estruturada.
