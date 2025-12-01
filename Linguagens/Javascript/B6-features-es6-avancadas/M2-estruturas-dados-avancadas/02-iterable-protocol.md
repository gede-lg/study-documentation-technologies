# Iterable Protocol: Análise Conceitual

## 🎯 Definição

O **Iterable Protocol** (protocolo iterável) define como objetos se tornam **iteráveis**, ou seja, como produzem iterators. Um objeto é iterável se implementa o método `[Symbol.iterator]()` que retorna um iterator. Iterables podem ser usados em `for...of`, spread operator, e outras construções que esperam sequências.

```javascript
// Objeto iterável
const iteravel = {
  [Symbol.iterator]() {
    let contador = 0;

    return {
      next() {
        if (contador < 3) {
          return { value: contador++, done: false };
        }
        return { done: true };
      }
    };
  }
};

// Pode usar for...of
for (const valor of iteravel) {
  console.log(valor); // 0, 1, 2
}

// Pode usar spread
console.log([...iteravel]); // [0, 1, 2]
```

**Conceito:** Protocolo que permite objetos serem iterados em loops e operações de sequência.

## 📋 Estrutura do Protocolo

### Método [Symbol.iterator]

Objeto iterável deve ter:
```javascript
objeto[Symbol.iterator] = function() {
  return iterator; // Objeto que implementa iterator protocol
};
```

### Iterables Nativos

JavaScript tem muitos iterables nativos:

```javascript
// Arrays
const array = [1, 2, 3];
console.log(array[Symbol.iterator]); // function

// Strings
const string = 'abc';
console.log(string[Symbol.iterator]); // function

// Maps
const mapa = new Map([['a', 1]]);
console.log(mapa[Symbol.iterator]); // function

// Sets
const conjunto = new Set([1, 2, 3]);
console.log(conjunto[Symbol.iterator]); // function

// NodeLists (DOM)
const elementos = document.querySelectorAll('div');
console.log(elementos[Symbol.iterator]); // function
```

## 🧠 Fundamentos Teóricos

### Diferença: Iterable vs Iterator

**Iterable:** Objeto que **produz** iterator (tem `[Symbol.iterator]()`)
**Iterator:** Objeto que **executa** iteração (tem `next()`)

```javascript
const array = [1, 2, 3];

// array é ITERABLE
console.log(typeof array[Symbol.iterator]); // 'function'

// Chamar [Symbol.iterator]() produz ITERATOR
const iterator = array[Symbol.iterator]();
console.log(typeof iterator.next); // 'function'

// Consumir iterator
console.log(iterator.next()); // { value: 1, done: false }
```

### Múltiplas Iterações Independentes

Iterables podem criar múltiplos iterators independentes.

```javascript
const numeros = {
  valores: [1, 2, 3],

  [Symbol.iterator]() {
    let indice = 0;
    const valores = this.valores;

    return {
      next() {
        if (indice < valores.length) {
          return { value: valores[indice++], done: false };
        }
        return { done: true };
      }
    };
  }
};

// Dois iterators independentes
const it1 = numeros[Symbol.iterator]();
const it2 = numeros[Symbol.iterator]();

console.log(it1.next().value); // 1
console.log(it2.next().value); // 1 (independente de it1)
console.log(it1.next().value); // 2
console.log(it2.next().value); // 2
```

### Iterator Também Pode Ser Iterable

Iterator pode implementar `[Symbol.iterator]()` retornando `this`.

```javascript
const iteratorIteravel = {
  contador: 0,

  next() {
    if (this.contador < 3) {
      return { value: this.contador++, done: false };
    }
    return { done: true };
  },

  [Symbol.iterator]() {
    return this; // Retorna a si mesmo
  }
};

// Funciona como iterator
console.log(iteratorIteravel.next()); // { value: 0, done: false }

// E como iterable
for (const valor of iteratorIteravel) {
  console.log(valor); // 1, 2 (continua de onde parou)
}
```

## 🔍 Implementações Práticas

### Range Iterable

```javascript
function range(inicio, fim, passo = 1) {
  return {
    [Symbol.iterator]() {
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
  };
}

const numeros = range(0, 10, 2);

for (const n of numeros) {
  console.log(n); // 0, 2, 4, 6, 8
}

// Pode reutilizar (cria novo iterator)
console.log([...numeros]); // [0, 2, 4, 6, 8]
```

### Objeto com Propriedades Iteráveis

```javascript
const biblioteca = {
  livros: [
    { titulo: 'Livro 1', autor: 'Autor 1' },
    { titulo: 'Livro 2', autor: 'Autor 2' },
    { titulo: 'Livro 3', autor: 'Autor 3' }
  ],

  [Symbol.iterator]() {
    let indice = 0;
    const livros = this.livros;

    return {
      next() {
        if (indice < livros.length) {
          return { value: livros[indice++], done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const livro of biblioteca) {
  console.log(`${livro.titulo} - ${livro.autor}`);
}
```

### Iterable Condicional

```javascript
const colecao = {
  itens: [1, 2, 3, 4, 5],
  filtro: null,

  [Symbol.iterator]() {
    let indice = 0;
    const itens = this.itens;
    const filtro = this.filtro;

    return {
      next() {
        while (indice < itens.length) {
          const valor = itens[indice++];

          if (!filtro || filtro(valor)) {
            return { value: valor, done: false };
          }
        }
        return { done: true };
      }
    };
  }
};

// Sem filtro
console.log([...colecao]); // [1, 2, 3, 4, 5]

// Com filtro
colecao.filtro = n => n % 2 === 0;
console.log([...colecao]); // [2, 4]
```

## ⚠️ Considerações

### Objetos Não São Iteráveis

```javascript
const obj = { a: 1, b: 2, c: 3 };

// ❌ ERRO: objetos comuns não são iteráveis
for (const valor of obj) { } // TypeError

// ✅ Usar Object.keys/values/entries
for (const chave of Object.keys(obj)) {
  console.log(chave);
}
```

### Tornar Objeto Iterável

```javascript
const pessoa = {
  nome: 'João',
  idade: 30,
  cidade: 'SP',

  [Symbol.iterator]() {
    const chaves = Object.keys(this);
    let indice = 0;

    return {
      next: () => {
        if (indice < chaves.length) {
          const chave = chaves[indice++];
          return {
            value: [chave, this[chave]],
            done: false
          };
        }
        return { done: true };
      }
    };
  }
};

for (const [chave, valor] of pessoa) {
  console.log(`${chave}: ${valor}`);
}
// nome: João
// idade: 30
// cidade: SP
```

### Consumindo Iterables

```javascript
const iteravel = range(1, 4);

// for...of
for (const n of iteravel) { }

// Spread
const array = [...iteravel];

// Destructuring
const [a, b, c] = iteravel;

// Array.from
const arr = Array.from(iteravel);

// Promise.all/race/etc
// await Promise.all(iteravel);
```

Iterable Protocol permite que qualquer objeto customize seu comportamento de iteração, tornando-o compatível com toda infraestrutura de loops e operações de sequência do JavaScript moderno.
