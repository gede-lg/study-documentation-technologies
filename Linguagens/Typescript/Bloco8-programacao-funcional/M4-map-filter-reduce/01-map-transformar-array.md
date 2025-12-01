# Map - Transformar Array: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Map** é método de array que **transforma cada elemento** aplicando função de transformação, retornando **novo array** com resultados sem modificar original. Conceitualmente, representa **projeção funcional**, onde cada elemento do domínio é mapeado para elemento no contradomínio via função, criando correspondência um-para-um.

Na essência, `map` materializa o princípio de **transformação imutável**, onde operação de mapeamento preserva estrutura (mesmo tamanho) mas altera conteúdo, sendo operação fundamental da programação funcional.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
// Assinatura do map
interface Array<T> {
  map<U>(callback: (value: T, index: number, array: T[]) => U): U[];
}

// Uso básico
const numeros = [1, 2, 3, 4, 5];

const dobrados = numeros.map(n => n * 2);
console.log(dobrados); // [2, 4, 6, 8, 10]
console.log(numeros);  // [1, 2, 3, 4, 5] - original intacto

// Com função nomeada
function dobrar(n: number): number {
  return n * 2;
}

const resultado = numeros.map(dobrar); // [2, 4, 6, 8, 10]
```

**Conceito-chave:** Map **sempre** retorna array de mesmo tamanho, transformando cada elemento.

### Parâmetros do Callback

```typescript
const letras = ["a", "b", "c"];

const resultado = letras.map((elemento, indice, arrayCompleto) => {
  console.log(`Elemento: ${elemento}`);
  console.log(`Índice: ${indice}`);
  console.log(`Array completo:`, arrayCompleto);
  return elemento.toUpperCase();
});

// Output:
// Elemento: a, Índice: 0, Array completo: ["a", "b", "c"]
// Elemento: b, Índice: 1, Array completo: ["a", "b", "c"]
// Elemento: c, Índice: 2, Array completo: ["a", "b", "c"]

// Resultado: ["A", "B", "C"]
```

## 🔍 Análise Conceitual

### 1. Transformações Simples

```typescript
// Transformação numérica
const numeros = [1, 2, 3, 4];
const quadrados = numeros.map(n => n ** 2);
// [1, 4, 9, 16]

const raizes = numeros.map(n => Math.sqrt(n));
// [1, 1.414..., 1.732..., 2]

// Transformação de string
const palavras = ["hello", "world"];
const maiusculas = palavras.map(p => p.toUpperCase());
// ["HELLO", "WORLD"]

const tamanhos = palavras.map(p => p.length);
// [5, 5]

// Transformação de tipo
const textos = ["1", "2", "3"];
const numerosConvertidos = textos.map(t => Number(t));
// [1, 2, 3]
```

### 2. Transformação de Objetos

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana", email: "ana@example.com" },
  { id: 2, nome: "Bob", email: "bob@example.com" }
];

// Extrair propriedade
const nomes = usuarios.map(u => u.nome);
// ["Ana", "Bob"]

const ids = usuarios.map(u => u.id);
// [1, 2]

// Transformar estrutura
const resumos = usuarios.map(u => ({
  nomeCompleto: u.nome.toUpperCase(),
  dominio: u.email.split("@")[1]
}));
// [
//   { nomeCompleto: "ANA", dominio: "example.com" },
//   { nomeCompleto: "BOB", dominio: "example.com" }
// ]

// Adicionar propriedade
const usuariosComStatus = usuarios.map(u => ({
  ...u,
  ativo: true
}));
// Cada usuário ganha propriedade 'ativo: true'
```

### 3. Map com Índice

```typescript
const letras = ["a", "b", "c"];

// Usar índice na transformação
const comIndice = letras.map((letra, i) => `${i}: ${letra}`);
// ["0: a", "1: b", "2: c"]

// Criar objetos com índice
const objetos = letras.map((letra, i) => ({
  id: i,
  valor: letra
}));
// [
//   { id: 0, valor: "a" },
//   { id: 1, valor: "b" },
//   { id: 2, valor: "c" }
// ]
```

### 4. Map Preserva Estrutura

```typescript
const original = [1, 2, 3, 4, 5];

// Sempre retorna array do mesmo tamanho
console.log(original.map(n => n * 2).length); // 5
console.log(original.map(n => n.toString()).length); // 5
console.log(original.map(() => "x").length); // 5

// Mesmo com valores undefined/null
const comNulos = [1, 2, 3];
const resultado = comNulos.map(n => n > 2 ? n : null);
// [null, null, 3] - ainda tem 3 elementos
```

### 5. Map vs. ForEach

```typescript
const numeros = [1, 2, 3];

// ForEach - não retorna nada, usado para side effects
numeros.forEach(n => {
  console.log(n); // Side effect
});
// Retorna: undefined

// Map - retorna novo array
const dobrados = numeros.map(n => n * 2);
// Retorna: [2, 4, 6]

// ❌ Usar map para side effects (anti-pattern)
numeros.map(n => {
  console.log(n); // Desperdiça array criado
});

// ✅ Usar forEach para side effects
numeros.forEach(n => {
  console.log(n);
});

// ✅ Usar map para transformação
const transformados = numeros.map(n => n * 2);
```

## 🎯 Aplicabilidade

### Normalização de Dados

```typescript
interface ProdutoAPI {
  product_id: number;
  product_name: string;
  price_in_cents: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

const dadosAPI: ProdutoAPI[] = [
  { product_id: 1, product_name: "Notebook", price_in_cents: 200000 },
  { product_id: 2, product_name: "Mouse", price_in_cents: 5000 }
];

// Normalizar estrutura
const produtos: Produto[] = dadosAPI.map(p => ({
  id: p.product_id,
  nome: p.product_name,
  preco: p.price_in_cents / 100
}));
// [
//   { id: 1, nome: "Notebook", preco: 2000 },
//   { id: 2, nome: "Mouse", preco: 50 }
// ]
```

### Formatação

```typescript
const valores = [1234.56, 789.12, 456.78];

// Formatar como moeda
const formatados = valores.map(v =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(v)
);
// ["R$ 1.234,56", "R$ 789,12", "R$ 456,78"]

// Arredondar
const arredondados = valores.map(v => Math.round(v));
// [1235, 789, 457]
```

### Projeção de Propriedades

```typescript
interface Pessoa {
  nome: string;
  idade: number;
  email: string;
  telefone: string;
}

const pessoas: Pessoa[] = [
  { nome: "Ana", idade: 25, email: "ana@example.com", telefone: "123" },
  { nome: "Bob", idade: 30, email: "bob@example.com", telefone: "456" }
];

// Projetar apenas algumas propriedades
const resumos = pessoas.map(p => ({
  nome: p.nome,
  email: p.email
}));
// Apenas nome e email

// DTO (Data Transfer Object)
type PessoaDTO = Pick<Pessoa, "nome" | "email">;
const dtos: PessoaDTO[] = pessoas.map(p => ({
  nome: p.nome,
  email: p.email
}));
```

### Parsing e Conversão

```typescript
const textos = ["1", "2", "3", "abc", "5"];

// Parse com tratamento de erro
const numeros = textos.map(t => {
  const num = Number(t);
  return isNaN(num) ? 0 : num;
});
// [1, 2, 3, 0, 5]

// Parse de JSON
const jsons = ['{"nome": "Ana"}', '{"nome": "Bob"}'];
const objetos = jsons.map(j => JSON.parse(j));
// [{ nome: "Ana" }, { nome: "Bob" }]

// Parse de datas
const dataStrings = ["2024-01-01", "2024-06-15"];
const datas = dataStrings.map(d => new Date(d));
// [Date, Date]
```

### Enriquecimento de Dados

```typescript
interface Produto {
  nome: string;
  preco: number;
}

const produtos: Produto[] = [
  { nome: "Notebook", preco: 2000 },
  { nome: "Mouse", preco: 50 }
];

// Adicionar propriedade calculada
const produtosComDesconto = produtos.map(p => ({
  ...p,
  precoComDesconto: p.preco * 0.9,
  desconto: p.preco * 0.1
}));

// Adicionar ID único
const produtosComId = produtos.map((p, i) => ({
  id: i + 1,
  ...p
}));
```

## ⚠️ Considerações

### 1. Map Não Filtra

```typescript
const numeros = [1, 2, 3, 4, 5];

// ❌ Map não remove elementos
const tentativaFiltro = numeros.map(n => {
  if (n % 2 === 0) return n;
  // Else implícito: return undefined
});
// [undefined, 2, undefined, 4, undefined] - ainda tem 5 elementos!

// ✅ Use filter para isso
const pares = numeros.filter(n => n % 2 === 0);
// [2, 4] - apenas elementos que passam no teste
```

### 2. Map é Imutável

```typescript
const original = [1, 2, 3];

const transformado = original.map(n => n * 2);

console.log(original);     // [1, 2, 3] - intacto
console.log(transformado); // [2, 4, 6] - novo array

// Mas cuidado com objetos aninhados
const objetos = [{ valor: 1 }, { valor: 2 }];

const mapeados = objetos.map(obj => {
  obj.valor *= 2; // ❌ MUTAÇÃO - modifica original!
  return obj;
});

console.log(objetos[0].valor); // 2 - original modificado!

// ✅ Criar novos objetos
const mapeadosCorreto = objetos.map(obj => ({
  ...obj,
  valor: obj.valor * 2
}));
```

### 3. Performance com Arrays Grandes

```typescript
// Map cria novo array - overhead de memória
const grande = Array(1_000_000).fill(0).map((_, i) => i);

// Se não precisa do array, use forEach
grande.forEach(n => {
  console.log(n); // Apenas side effect
});

// Ou for...of
for (const n of grande) {
  console.log(n);
}
```

## 📚 Conclusão

`map` transforma cada elemento de array aplicando função, retornando novo array de mesmo tamanho sem modificar original. É operação fundamental para transformações imutáveis, normalização de dados, formatação, projeção de propriedades e conversões de tipo. Preserva estrutura (tamanho) mas permite alterar conteúdo e tipo dos elementos completamente.
