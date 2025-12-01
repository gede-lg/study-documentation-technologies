# Array Methods com Type Safety em TypeScript: Generics, Inferência e Transformações Tipadas

## 🎯 Introdução

Os **métodos de array em TypeScript** são **genericamente tipados**, garantindo **type safety** completa em todas operações. Cada método preserva, transforma ou refina tipos de forma precisa através de **generics**, **type inference** e **type guards**.

## 📋 Conceitos Fundamentais

### Type Safety em Métodos

```typescript
let numeros: number[] = [1, 2, 3, 4, 5];

// map<U>: transforma T[] em U[]
let strings = numeros.map(n => n.toString());
// Tipo inferido: string[]

// filter: preserva tipo (ou refina com type predicate)
let pares = numeros.filter(n => n % 2 === 0);
// Tipo inferido: number[]

// reduce<U>: acumula em tipo U
let soma = numeros.reduce((acc, n) => acc + n, 0);
// Tipo inferido: number (tipo do acumulador inicial)
```

### Generics em Métodos

Todos métodos importantes usam **type parameters genéricos**:

```typescript
interface Array<T> {
  // map: transforma T em U
  map<U>(callbackfn: (value: T) => U): U[];
  
  // filter: preserva T (ou refina com type predicate)
  filter(predicate: (value: T) => boolean): T[];
  filter<S extends T>(predicate: (value: T) => value is S): S[];
  
  // reduce: acumula em U
  reduce<U>(callback: (acc: U, value: T) => U, initialValue: U): U;
  
  // find: retorna T | undefined
  find(predicate: (value: T) => boolean): T | undefined;
  
  // every/some: retorna boolean
  every(predicate: (value: T) => boolean): boolean;
  some(predicate: (value: T) => boolean): boolean;
}
```

## 🧠 Análise de Métodos Tipados

### map(): Transformação de Tipo

```typescript
interface Usuario {
  id: number;
  nome: string;
}

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" }
];

// Extrair propriedade: Usuario[] → string[]
let nomes: string[] = usuarios.map(u => u.nome);

// Transformar estrutura: Usuario[] → { id: number }[]
let ids = usuarios.map(u => ({ id: u.id }));
// Tipo inferido: { id: number }[]

// Generic explícito (raramente necessário)
let nomes = usuarios.map<string>(u => u.nome);
```

### filter(): Preservação e Refinamento

```typescript
type Valor = string | number | null;
let valores: Valor[] = [1, "texto", null, 2, "outro"];

// Sem type predicate: preserva tipo original
let semNulos = valores.filter(v => v !== null);
// Tipo: (string | number | null)[] (não refinado!)

// Com type predicate: refina tipo
function naoNulo<T>(v: T | null): v is T {
  return v !== null;
}

let refinados = valores.filter(naoNulo);
// Tipo: (string | number)[] (refinado! null removido)

// Type predicate inline
let numeros = valores.filter((v): v is number => typeof v === "number");
// Tipo: number[] (refinado!)
```

### reduce(): Transformação para Qualquer Tipo

```typescript
let numeros: number[] = [1, 2, 3, 4, 5];

// Reduzir para primitivo
let soma: number = numeros.reduce((acc, n) => acc + n, 0);

// Reduzir para objeto
interface Estatisticas {
  soma: number;
  quantidade: number;
  media: number;
}

let stats = numeros.reduce((acc, n) => {
  acc.soma += n;
  acc.quantidade++;
  acc.media = acc.soma / acc.quantidade;
  return acc;
}, { soma: 0, quantidade: 0, media: 0 } as Estatisticas);
// Tipo: Estatisticas

// Reduzir para estrutura diferente
let grupos: Record<string, number[]> = [1, 2, 3, 4, 5, 6].reduce((acc, n) => {
  const chave = n % 2 === 0 ? "pares" : "impares";
  if (!acc[chave]) acc[chave] = [];
  acc[chave].push(n);
  return acc;
}, {} as Record<string, number[]>);
// { pares: [2, 4, 6], impares: [1, 3, 5] }
```

### find() e findIndex(): Busca Tipada

```typescript
interface Produto {
  id: number;
  nome: string;
  estoque: number;
}

let produtos: Produto[] = [
  { id: 1, nome: "Mouse", estoque: 10 },
  { id: 2, nome: "Teclado", estoque: 0 }
];

// find: retorna Produto | undefined
let produto = produtos.find(p => p.id === 1);
// Tipo: Produto | undefined

// findIndex: retorna number
let indice = produtos.findIndex(p => p.estoque === 0);
// Tipo: number (ou -1 se não encontrado)

// Com type predicate
function temEstoque(p: Produto): p is Produto & { estoque: number } {
  return p.estoque > 0;
}

let disponivel = produtos.find(temEstoque);
// Tipo: (Produto & { estoque: number }) | undefined
```

### every() e some(): Testes Booleanos

```typescript
let numeros: number[] = [2, 4, 6, 8];

// every: todos atendem?
let todosPares: boolean = numeros.every(n => n % 2 === 0);
// true

// some: algum atende?
let algumMaiorQue5: boolean = numeros.some(n => n > 5);
// true

// Com type predicate em every: refina tipo
type Entrada = number | string;
let entradas: Entrada[] = [1, 2, 3];

function eNumero(v: Entrada): v is number {
  return typeof v === "number";
}

if (entradas.every(eNumero)) {
  // Dentro: entradas é tratado como number[]
  let soma = entradas.reduce((a, b) => a + b, 0);
}
```

## 🎯 Padrões Avançados

### Encadeamento de Métodos Tipados

```typescript
interface Venda {
  produto: string;
  valor: number;
  categoria: string;
}

let vendas: Venda[] = [
  { produto: "Mouse", valor: 50, categoria: "Eletrônicos" },
  { produto: "Livro", valor: 30, categoria: "Livros" },
  { produto: "Teclado", valor: 150, categoria: "Eletrônicos" }
];

// Pipeline tipado
let totalEletronicos = vendas
  .filter(v => v.categoria === "Eletrônicos")  // Venda[]
  .map(v => v.valor)                            // number[]
  .reduce((acc, v) => acc + v, 0);              // number
// 200

// TypeScript infere tipo em cada etapa!
```

### Métodos com Objetos Complexos

```typescript
interface Usuario {
  id: number;
  nome: string;
  idade: number;
}

let usuarios: Usuario[] = [
  { id: 1, nome: "Ana Silva", idade: 25 },
  { id: 2, nome: "Bruno Costa", idade: 30 },
  { id: 3, nome: "Carlos Dias", idade: 25 }
];

// Agrupar por idade
let porIdade = usuarios.reduce((acc, u) => {
  if (!acc[u.idade]) {
    acc[u.idade] = [];
  }
  acc[u.idade].push(u);
  return acc;
}, {} as Record<number, Usuario[]>);
// { 25: [Ana, Carlos], 30: [Bruno] }

// Ordenar por propriedade
let porNome = [...usuarios].sort((a, b) => 
  a.nome.localeCompare(b.nome)
);
```

## ⚠️ Armadilhas Comuns

### Armadilha 1: filter() sem Type Predicate

```typescript
let mixed: (number | string)[] = [1, "a", 2, "b"];

// ❌ Tipo não refina
let nums = mixed.filter(v => typeof v === "number");
// Tipo: (number | string)[] (não refinado!)

// ✅ Com type predicate
let nums = mixed.filter((v): v is number => typeof v === "number");
// Tipo: number[] (refinado!)
```

### Armadilha 2: Esquecer Valor Inicial em reduce()

```typescript
let numeros = [1, 2, 3];

// ⚠️ Sem valor inicial: usa primeiro elemento
let soma = numeros.reduce((acc, n) => acc + n);
// Funciona, mas tipo pode ser ambíguo

// ✅ Com valor inicial: tipo explícito
let soma = numeros.reduce((acc, n) => acc + n, 0);
// Tipo: number (inferido do 0)
```

## 🔗 Interconexões

### Relação com Generics

Métodos de array são **exemplos práticos de generics**:

```typescript
// map é genérico em T (elemento) e U (resultado)
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}
```

### Relação com Type Predicates

Type predicates permitem **refinamento de tipo** em filter/find:

```typescript
function eString(v: unknown): v is string {
  return typeof v === "string";
}

let valores = [1, "a", 2, "b"];
let strings = valores.filter(eString); // string[]
```

## 📚 Conclusão

Métodos de array em TypeScript são **completamente tipados** através de **generics**. TypeScript **infere tipos automaticamente** na maioria dos casos, mas permite **anotações explícitas** e **type predicates** quando necessário.

Domine **type predicates** para refinamento em `filter()` e compreenda como **generics** fluem através de **encadeamentos** de métodos para trabalhar eficientemente com transformações type-safe.
