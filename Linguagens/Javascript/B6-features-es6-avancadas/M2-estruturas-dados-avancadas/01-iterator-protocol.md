# Iterator Protocol: Análise Conceitual

## 🎯 Definição

O **Iterator Protocol** (protocolo de iterador) é uma interface que define o comportamento padrão de iteração em JavaScript. Um objeto é considerado um **iterator** se implementa o método `next()` que retorna objetos no formato `{ value, done }`, permitindo percorrer sequências de valores um de cada vez.

```javascript
// Iterator simples
const iterator = {
  valores: [1, 2, 3],
  indice: 0,

  next() {
    if (this.indice < this.valores.length) {
      return {
        value: this.valores[this.indice++],
        done: false
      };
    }
    return { value: undefined, done: true };
  }
};

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

**Conceito:** Protocolo que padroniza a forma de iterar sequencialmente sobre coleções de dados.

## 📋 Estrutura do Protocolo

### Método next()

O iterator deve ter método `next()` que retorna objeto com:
- **value:** Próximo valor da sequência
- **done:** Boolean indicando se iteração terminou

```javascript
{
  value: any,      // Valor atual (pode ser undefined quando done=true)
  done: boolean    // true quando sequência terminou
}
```

### Estados do Iterator

```javascript
const iterator = criarIterator([10, 20]);

// Estado 1: primeiro valor
iterator.next(); // { value: 10, done: false }

// Estado 2: segundo valor
iterator.next(); // { value: 20, done: false }

// Estado 3: sequência completa
iterator.next(); // { value: undefined, done: true }

// Estado 4+: sempre done=true
iterator.next(); // { value: undefined, done: true }
```

## 🧠 Fundamentos Teóricos

### Iterador é Objeto com Estado

Iterator mantém **estado interno** (posição atual na sequência).

```javascript
function criarContador(max) {
  let contador = 0;

  return {
    next() {
      if (contador < max) {
        return { value: contador++, done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

const it = criarContador(3);

console.log(it.next().value); // 0 (estado interno: contador=1)
console.log(it.next().value); // 1 (estado interno: contador=2)
console.log(it.next().value); // 2 (estado interno: contador=3)
console.log(it.next().done);  // true
```

### Iterador é Consumível (One-Time Use)

Uma vez esgotado, iterator não "reseta".

```javascript
const iterator = [1, 2, 3][Symbol.iterator]();

// Consumir completamente
while (true) {
  const { value, done } = iterator.next();
  if (done) break;
  console.log(value);
}

// Tentar reusar - não funciona
const { done } = iterator.next();
console.log(done); // true (ainda esgotado)
```

### value é Opcional Quando done=true

```javascript
// Ambos são válidos quando done=true:
{ done: true, value: undefined }
{ done: true }

// Geralmente retorna undefined
return { done: true };
// Equivalente a:
return { done: true, value: undefined };
```

## 🔍 Implementações Práticas

### Range Iterator

```javascript
function range(inicio, fim, passo = 1) {
  let atual = inicio;

  return {
    next() {
      if (atual < fim) {
        const valor = atual;
        atual += passo;
        return { value: valor, done: false };
      }
      return { done: true };
    }
  };
}

const numeros = range(0, 10, 2);

console.log(numeros.next()); // { value: 0, done: false }
console.log(numeros.next()); // { value: 2, done: false }
console.log(numeros.next()); // { value: 4, done: false }
```

### Fibonacci Iterator

```javascript
function fibonacci(limite) {
  let a = 0, b = 1, contador = 0;

  return {
    next() {
      if (contador++ < limite) {
        const valor = a;
        [a, b] = [b, a + b];
        return { value: valor, done: false };
      }
      return { done: true };
    }
  };
}

const fib = fibonacci(5);

console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
```

### Iterator Infinito

```javascript
function numerosPares() {
  let n = 0;

  return {
    next() {
      const valor = n;
      n += 2;
      return { value: valor, done: false }; // Nunca termina
    }
  };
}

const pares = numerosPares();

// Cuidado: loop infinito se não houver break
for (let i = 0; i < 5; i++) {
  console.log(pares.next().value); // 0, 2, 4, 6, 8
}
```

### Iterator com Dados Externos

```javascript
function criarIteratorArquivo(linhas) {
  let indice = 0;

  return {
    next() {
      if (indice < linhas.length) {
        return {
          value: {
            numero: indice + 1,
            conteudo: linhas[indice++]
          },
          done: false
        };
      }
      return { done: true };
    }
  };
}

const arquivo = criarIteratorArquivo(['linha 1', 'linha 2', 'linha 3']);

let resultado = arquivo.next();
while (!resultado.done) {
  console.log(`${resultado.value.numero}: ${resultado.value.conteudo}`);
  resultado = arquivo.next();
}
// 1: linha 1
// 2: linha 2
// 3: linha 3
```

## ⚠️ Considerações

### Protocolo vs Implementação

```javascript
// ✅ Implementa protocolo (tem next())
const iterador = {
  next() {
    return { value: 1, done: true };
  }
};

// ❌ Não implementa protocolo (falta next())
const naoIterador = {
  proximo() { // Nome errado
    return { value: 1, done: true };
  }
};
```

### return() Opcional

Iterator pode ter método `return()` para limpeza.

```javascript
function criarIteratorComCleanup() {
  return {
    next() {
      return { value: Math.random(), done: false };
    },
    return() {
      console.log('Limpando recursos...');
      return { done: true };
    }
  };
}

const it = criarIteratorComCleanup();
it.next();
it.return(); // 'Limpando recursos...'
```

### throw() Opcional

Iterator pode ter método `throw()` para injetar erros.

```javascript
const iterator = {
  next() {
    return { value: 1, done: false };
  },
  throw(erro) {
    console.log('Erro recebido:', erro.message);
    return { done: true };
  }
};

iterator.throw(new Error('Algo deu errado'));
```

## 🚀 Relação com Outros Conceitos

Iterator Protocol é a base para:
- **Iterable Protocol:** Objetos que produzem iterators
- **for...of:** Consome iterators automaticamente
- **Generators:** Forma simplificada de criar iterators
- **Spread operator:** Expande iterables usando iterators
- **Array.from():** Converte iterables para arrays

O Iterator Protocol é o contrato fundamental que permite iteração uniforme em JavaScript, sendo a base sobre a qual toda a infraestrutura de iteração moderna foi construída.
