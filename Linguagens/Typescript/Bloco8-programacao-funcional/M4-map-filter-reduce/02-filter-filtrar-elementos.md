# Filter - Filtrar Elementos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Filter** é método de array que **seleciona elementos** que satisfazem predicado (condição), retornando **novo array** apenas com elementos aprovados. Conceitualmente, representa **seleção condicional**, onde função predicado atua como critério de admissão, criando subconjunto do array original.

Na essência, `filter` materializa o princípio de **filtragem imutável**, separando elementos desejados dos indesejados sem modificar original.

## 📋 Fundamentos

### Sintaxe

```typescript
interface Array<T> {
  filter(predicate: (value: T, index: number, array: T[]) => boolean): T[];
}

const numeros = [1, 2, 3, 4, 5, 6];

// Apenas pares
const pares = numeros.filter(n => n % 2 === 0);
// [2, 4, 6]

// Apenas ímpares
const impares = numeros.filter(n => n % 2 !== 0);
// [1, 3, 5]

// Maiores que 3
const maiores = numeros.filter(n => n > 3);
// [4, 5, 6]
```

**Conceito-chave:** Filter retorna array **potencialmente menor** - apenas elementos que retornam `true`.

## 🔍 Análise Conceitual

### 1. Predicados Simples

```typescript
const palavras = ["casa", "apartamento", "flat", "sobrado"];

// Por tamanho
const curtas = palavras.filter(p => p.length <= 4);
// ["casa", "flat"]

// Por conteúdo
const comA = palavras.filter(p => p.includes("a"));
// ["casa", "apartamento", "flat"]

// Negação
const semO = palavras.filter(p => !p.includes("o"));
// ["casa", "flat"]
```

### 2. Filtrar Objetos

```typescript
interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

const produtos: Produto[] = [
  { nome: "A", preco: 100, estoque: 5 },
  { nome: "B", preco: 50, estoque: 0 },
  { nome: "C", preco: 200, estoque: 10 }
];

// Disponíveis
const disponiveis = produtos.filter(p => p.estoque > 0);

// Caros
const caros = produtos.filter(p => p.preco > 100);

// Múltiplas condições
const ofertas = produtos.filter(p =>
  p.estoque > 0 && p.preco < 150
);
```

### 3. Remover Valores Falsy

```typescript
const valores = [0, 1, false, true, "", "hello", null, undefined, NaN, 42];

// Remove falsy
const truthy = valores.filter(Boolean);
// [1, true, "hello", 42]

// Remove apenas null/undefined
const semNulos = valores.filter(v => v != null);
// [0, 1, false, true, "", "hello", NaN, 42]
```

### 4. Com Índice

```typescript
const letras = ["a", "b", "c", "d", "e"];

// Apenas índices pares
const indicesPares = letras.filter((_, i) => i % 2 === 0);
// ["a", "c", "e"]

// Primeiros 3
const primeiros = letras.filter((_, i) => i < 3);
// ["a", "b", "c"]
```

## 🎯 Aplicabilidade

### Busca e Validação

```typescript
interface Usuario {
  id: number;
  nome: string;
  ativo: boolean;
  idade: number;
}

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana", ativo: true, idade: 25 },
  { id: 2, nome: "Bob", ativo: false, idade: 17 },
  { id: 3, nome: "Carol", ativo: true, idade: 30 }
];

// Usuários ativos
const ativos = usuarios.filter(u => u.ativo);

// Maiores de idade ativos
const maioresAtivos = usuarios.filter(u =>
  u.ativo && u.idade >= 18
);

// Buscar por nome
const resultado = usuarios.filter(u =>
  u.nome.toLowerCase().includes("a")
);
```

### Limpeza de Dados

```typescript
const dados = [
  { valor: 10 },
  { valor: null },
  { valor: 20 },
  { valor: undefined },
  { valor: 30 }
];

// Remove inválidos
const validos = dados.filter(d => d.valor != null);
```

### Remoção de Duplicatas

```typescript
const numeros = [1, 2, 2, 3, 3, 3, 4];

const unicos = numeros.filter((n, i, arr) =>
  arr.indexOf(n) === i
);
// [1, 2, 3, 4]
```

## 📚 Conclusão

`filter` seleciona elementos que satisfazem predicado, retornando novo array (potencialmente menor) sem modificar original. Essencial para seleção condicional, busca, validação e limpeza de dados.
