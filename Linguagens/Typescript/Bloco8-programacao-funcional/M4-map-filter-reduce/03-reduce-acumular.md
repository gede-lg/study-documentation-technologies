# Reduce - Acumular: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Reduce** é método de array que **acumula valores** aplicando função redutora iterativamente, agregando array inteiro em **único valor**. Conceitualmente, representa **fold** (dobra), onde estrutura linear é "dobrada" em resultado único através de operação binária acumulativa.

Na essência, `reduce` materializa o princípio de **agregação funcional**, sendo operação mais poderosa e genérica - tanto map quanto filter podem ser implementados com reduce.

## 📋 Fundamentos

### Sintaxe

```typescript
interface Array<T> {
  reduce<U>(
    callback: (acumulador: U, valor: T, index: number, array: T[]) => U,
    valorInicial: U
  ): U;
}

// Soma
const numeros = [1, 2, 3, 4, 5];
const soma = numeros.reduce((acc, n) => acc + n, 0);
// 15

// Produto
const produto = numeros.reduce((acc, n) => acc * n, 1);
// 120

// Concatenação
const letras = ["a", "b", "c"];
const texto = letras.reduce((acc, letra) => acc + letra, "");
// "abc"
```

**Conceito-chave:** Reduce **transforma array em valor único** (número, string, objeto, array, etc).

## 🔍 Análise Conceitual

### 1. Como Funciona

```typescript
const nums = [1, 2, 3, 4];

const resultado = nums.reduce((acc, n) => {
  console.log(`Acc: ${acc}, Valor: ${n}`);
  return acc + n;
}, 0);

// Iteração 1: Acc: 0, Valor: 1 → retorna 1
// Iteração 2: Acc: 1, Valor: 2 → retorna 3
// Iteração 3: Acc: 3, Valor: 3 → retorna 6
// Iteração 4: Acc: 6, Valor: 4 → retorna 10
// Resultado final: 10
```

### 2. Agregações Numéricas

```typescript
const valores = [10, 20, 30, 40];

// Soma
const soma = valores.reduce((acc, v) => acc + v, 0);
// 100

// Média
const media = valores.reduce((acc, v) => acc + v, 0) / valores.length;
// 25

// Máximo
const maximo = valores.reduce((acc, v) => Math.max(acc, v), -Infinity);
// 40

// Mínimo
const minimo = valores.reduce((acc, v) => Math.min(acc, v), Infinity);
// 10
```

### 3. Construir Objetos

```typescript
interface Produto {
  categoria: string;
  preco: number;
}

const produtos: Produto[] = [
  { categoria: "A", preco: 100 },
  { categoria: "B", preco: 50 },
  { categoria: "A", preco: 200 }
];

// Agrupar por categoria
const agrupados = produtos.reduce((acc, p) => {
  if (!acc[p.categoria]) {
    acc[p.categoria] = [];
  }
  acc[p.categoria].push(p);
  return acc;
}, {} as Record<string, Produto[]>);
// { A: [{ categoria: "A", preco: 100 }, { categoria: "A", preco: 200 }], B: [{ categoria: "B", preco: 50 }] }

// Somar por categoria
const totais = produtos.reduce((acc, p) => {
  acc[p.categoria] = (acc[p.categoria] || 0) + p.preco;
  return acc;
}, {} as Record<string, number>);
// { A: 300, B: 50 }
```

### 4. Construir Arrays

```typescript
const numeros = [1, 2, 3, 4, 5];

// Achatar array
const aninhado = [[1, 2], [3, 4], [5]];
const achatado = aninhado.reduce((acc, arr) => [...acc, ...arr], []);
// [1, 2, 3, 4, 5]

// Implementar filter com reduce
const pares = numeros.reduce((acc, n) => {
  if (n % 2 === 0) acc.push(n);
  return acc;
}, [] as number[]);
// [2, 4]

// Implementar map com reduce
const dobrados = numeros.reduce((acc, n) => {
  acc.push(n * 2);
  return acc;
}, [] as number[]);
// [2, 4, 6, 8, 10]
```

### 5. Contar Ocorrências

```typescript
const frutas = ["maçã", "banana", "maçã", "laranja", "banana", "maçã"];

const contagem = frutas.reduce((acc, fruta) => {
  acc[fruta] = (acc[fruta] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
// { maçã: 3, banana: 2, laranja: 1 }
```

## 🎯 Aplicabilidade

### Pipeline de Transformações

```typescript
interface Usuario {
  nome: string;
  idade: number;
  ativo: boolean;
}

const usuarios: Usuario[] = [
  { nome: "Ana", idade: 25, ativo: true },
  { nome: "Bob", idade: 17, ativo: false },
  { nome: "Carol", idade: 30, ativo: true }
];

// Processar em uma passagem
const resumo = usuarios.reduce((acc, u) => {
  if (u.ativo && u.idade >= 18) {
    acc.total++;
    acc.somaIdades += u.idade;
    acc.nomes.push(u.nome);
  }
  return acc;
}, { total: 0, somaIdades: 0, nomes: [] as string[] });

console.log(resumo);
// { total: 2, somaIdades: 55, nomes: ["Ana", "Carol"] }
```

### Composição de Funções

```typescript
type Fn<T> = (x: T) => T;

function compose<T>(...fns: Fn<T>[]): Fn<T> {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

const dobrar = (n: number) => n * 2;
const incrementar = (n: number) => n + 1;
const quadrado = (n: number) => n ** 2;

const processar = compose(quadrado, incrementar, dobrar);
processar(3); // quadrado(incrementar(dobrar(3))) = 49
```

### Validação Acumulativa

```typescript
interface Erro {
  campo: string;
  mensagem: string;
}

const validacoes = [
  (dados: any) => dados.nome ? null : { campo: "nome", mensagem: "Obrigatório" },
  (dados: any) => dados.email?.includes("@") ? null : { campo: "email", mensagem: "Inválido" },
  (dados: any) => dados.idade >= 18 ? null : { campo: "idade", mensagem: "Menor de idade" }
];

const dados = { nome: "", email: "invalido", idade: 16 };

const erros = validacoes.reduce((acc, validar) => {
  const erro = validar(dados);
  if (erro) acc.push(erro);
  return acc;
}, [] as Erro[]);
// [{ campo: "nome", ... }, { campo: "email", ... }, { campo: "idade", ... }]
```

## 📚 Conclusão

`reduce` acumula array em valor único aplicando função redutora iterativamente. É mais poderoso que map/filter, podendo implementá-los. Ideal para agregações, agrupamentos, contagens e construção de estruturas complexas a partir de arrays.
