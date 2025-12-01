# Custom Iterators: Análise Conceitual

## 🎯 Definição

**Custom Iterators** são iterators criados manualmente para coleções ou sequências customizadas, implementando os protocolos iterator e iterable para controlar exatamente como objetos são iterados.

```javascript
const fila = {
  itens: ['A', 'B', 'C'],

  [Symbol.iterator]() {
    let indice = 0;
    const itens = this.itens;

    return {
      next() {
        if (indice < itens.length) {
          return { value: itens[indice++], done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const item of fila) {
  console.log(item); // A, B, C
}
```

**Conceito:** Tornar objetos customizados iteráveis implementando os protocolos manualmente.

## 🔍 Exemplos Práticos

### Estrutura de Dados: Linked List

```javascript
class Node {
  constructor(valor) {
    this.valor = valor;
    this.proximo = null;
  }
}

class LinkedList {
  constructor() {
    this.cabeca = null;
  }

  adicionar(valor) {
    const novoNo = new Node(valor);

    if (!this.cabeca) {
      this.cabeca = novoNo;
    } else {
      let atual = this.cabeca;
      while (atual.proximo) {
        atual = atual.proximo;
      }
      atual.proximo = novoNo;
    }
  }

  [Symbol.iterator]() {
    let atual = this.cabeca;

    return {
      next() {
        if (atual) {
          const valor = atual.valor;
          atual = atual.proximo;
          return { value: valor, done: false };
        }
        return { done: true };
      }
    };
  }
}

const lista = new LinkedList();
lista.adicionar(10);
lista.adicionar(20);
lista.adicionar(30);

for (const valor of lista) {
  console.log(valor); // 10, 20, 30
}
```

### Árvore Binária (In-Order)

```javascript
class BinaryTree {
  constructor(valor) {
    this.valor = valor;
    this.esquerda = null;
    this.direita = null;
  }

  [Symbol.iterator]() {
    const pilha = [];
    let atual = this;

    return {
      next() {
        while (atual) {
          pilha.push(atual);
          atual = atual.esquerda;
        }

        if (pilha.length === 0) {
          return { done: true };
        }

        atual = pilha.pop();
        const valor = atual.valor;
        atual = atual.direita;

        return { value: valor, done: false };
      }
    };
  }
}

const arvore = new BinaryTree(5);
arvore.esquerda = new BinaryTree(3);
arvore.direita = new BinaryTree(7);

console.log([...arvore]); // [3, 5, 7]
```

### Matrix 2D

```javascript
class Matrix {
  constructor(linhas, colunas) {
    this.dados = Array(linhas).fill().map(() => Array(colunas).fill(0));
  }

  [Symbol.iterator]() {
    let linha = 0, coluna = 0;
    const dados = this.dados;

    return {
      next() {
        if (linha < dados.length) {
          const valor = dados[linha][coluna];

          coluna++;
          if (coluna >= dados[linha].length) {
            coluna = 0;
            linha++;
          }

          return { value: valor, done: false };
        }
        return { done: true };
      }
    };
  }
}

const matriz = new Matrix(2, 3);
matriz.dados[0] = [1, 2, 3];
matriz.dados[1] = [4, 5, 6];

console.log([...matriz]); // [1, 2, 3, 4, 5, 6]
```

Custom iterators permitem que qualquer estrutura de dados seja integrada ao ecossistema de iteração do JavaScript, funcionando com for...of, spread, destructuring e todas operações que esperam iterables.
