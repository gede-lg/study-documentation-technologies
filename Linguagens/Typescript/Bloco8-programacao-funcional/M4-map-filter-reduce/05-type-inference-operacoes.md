# Type Inference em Operações: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Type inference em operações** refere-se à capacidade do TypeScript de **deduzir automaticamente tipos** durante transformações com `map`, `filter` e `reduce`, sem necessidade de anotações explícitas. Conceitualmente, representa **inferência contextual progressiva**, onde compilador rastreia transformações e propagação de tipos através de pipeline funcional.

Na essência, type inference materializa o princípio de **type safety sem verbosidade**, onde sistema de tipos trabalha em segundo plano, garantindo segurança com mínima intervenção manual.

## 📋 Fundamentos

### Inferência Básica

```typescript
const numeros = [1, 2, 3, 4, 5];

// TypeScript infere tipos automaticamente
const dobrados = numeros.map(n => n * 2);
// dobrados: number[] (inferido!)
// n: number (inferido!)

const pares = numeros.filter(n => n % 2 === 0);
// pares: number[] (inferido!)
// n: number (inferido!)

const soma = numeros.reduce((acc, n) => acc + n, 0);
// soma: number (inferido!)
// acc: number, n: number (inferidos!)
```

**Conceito-chave:** TypeScript infere tipo do array original e propaga através das transformações.

## 🔍 Análise Conceitual

### 1. Inferência em Map

```typescript
const valores = [1, 2, 3];

// Transforma number → string
const strings = valores.map(n => n.toString());
// strings: string[] (inferido)
// Callback: (n: number) => string

// Transforma number → object
const objetos = valores.map(n => ({ valor: n, dobro: n * 2 }));
// objetos: { valor: number; dobro: number }[] (inferido)

// Transforma number → boolean
const saoGrandes = valores.map(n => n > 2);
// saoGrandes: boolean[] (inferido)
```

**Mecanismo:** TypeScript analisa **tipo de retorno do callback** para determinar tipo do array resultante.

### 2. Inferência em Filter

```typescript
const misturado = [1, "texto", 2, null, 3, undefined];
// misturado: (string | number | null | undefined)[]

// Filter não muda tipo por padrão
const numeros = misturado.filter(x => typeof x === "number");
// numeros: (string | number | null | undefined)[] (ainda união!)

// Type guard para narrowing
const apenasNumeros = misturado.filter((x): x is number => typeof x === "number");
// apenasNumeros: number[] (narrowed!)

// Remove falsy values
const truthy = misturado.filter(Boolean);
// truthy: (string | number)[] (remove null e undefined)
```

**Conceito-chave:** Filter sem type guard **preserva tipo original**. Use predicates tipados (`x is Type`) para narrowing.

### 3. Inferência em Reduce

```typescript
const valores = [1, 2, 3, 4, 5];

// Reduce number → number
const soma = valores.reduce((acc, n) => acc + n, 0);
// soma: number
// acc: number, n: number

// Reduce number → string
const concatenado = valores.reduce((acc, n) => acc + n, "");
// concatenado: string
// acc: string, n: number

// Reduce number → object
const agrupado = valores.reduce((acc, n) => {
  const chave = n % 2 === 0 ? "par" : "impar";
  if (!acc[chave]) acc[chave] = [];
  acc[chave].push(n);
  return acc;
}, {} as Record<string, number[]>);
// agrupado: Record<string, number[]>
// acc: Record<string, number[]>, n: number
```

**Mecanismo:** Tipo do **valor inicial** determina tipo do acumulador. TypeScript propaga através das iterações.

### 4. Inferência em Composição

```typescript
const numeros = [1, 2, 3, 4, 5, 6];

// Pipeline: number[] → number[] → number[] → number
const resultado = numeros
  .filter(n => n % 2 === 0)  // Etapa 1: number[] (pares)
  .map(n => n ** 2)           // Etapa 2: number[] (quadrados)
  .reduce((acc, n) => acc + n, 0); // Etapa 3: number (soma)

// TypeScript rastreia cada transformação:
// 1. numeros: number[]
// 2. filter retorna: number[]
// 3. map retorna: number[]
// 4. reduce retorna: number

// Pipeline complexo
interface Produto {
  nome: string;
  preco: number;
  categoria: string;
}

const produtos: Produto[] = [
  { nome: "A", preco: 100, categoria: "Tech" },
  { nome: "B", preco: 50, categoria: "Casa" }
];

const nomesTech = produtos
  .filter(p => p.categoria === "Tech")  // Produto[]
  .map(p => p.nome)                      // string[]
  .map(n => n.toUpperCase());            // string[]

// nomesTech: string[] (inferido completamente)
```

### 5. Inferência com Genéricos

```typescript
// Função genérica que usa map
function transformar<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const nums = [1, 2, 3];
const strs = transformar(nums, n => n.toString());
// strs: string[]
// T = number (inferido de nums)
// U = string (inferido do retorno de fn)

// Função genérica com filter
function filtrarPor<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const pares = filtrarPor([1, 2, 3, 4], n => n % 2 === 0);
// pares: number[]
// T = number (inferido)
```

### 6. Type Narrowing em Filter

```typescript
interface Animal {
  tipo: "cachorro" | "gato";
  nome: string;
}

interface Cachorro extends Animal {
  tipo: "cachorro";
  latir: () => void;
}

interface Gato extends Animal {
  tipo: "gato";
  miar: () => void;
}

const animais: Animal[] = [
  { tipo: "cachorro", nome: "Rex", latir: () => console.log("Au!") },
  { tipo: "gato", nome: "Mia", miar: () => console.log("Miau!") }
];

// Sem type guard - tipo não muda
const cachorros1 = animais.filter(a => a.tipo === "cachorro");
// cachorros1: Animal[] (ainda Animal!)

// Com type guard - narrowing
const cachorros2 = animais.filter((a): a is Cachorro => a.tipo === "cachorro");
// cachorros2: Cachorro[] (narrowed!)
// Agora pode acessar .latir()

cachorros2.forEach(c => c.latir()); // ✅ OK
// cachorros1.forEach(c => c.latir()); // ❌ Erro: latir não existe em Animal
```

## 🎯 Aplicabilidade

### Transformações Tipadas

```typescript
interface UsuarioAPI {
  user_id: number;
  user_name: string;
}

interface Usuario {
  id: number;
  nome: string;
}

const dadosAPI: UsuarioAPI[] = [
  { user_id: 1, user_name: "Ana" },
  { user_id: 2, user_name: "Bob" }
];

// TypeScript infere transformação completa
const usuarios = dadosAPI.map(u => ({
  id: u.user_id,
  nome: u.user_name
}));
// usuarios: { id: number; nome: string }[] (inferido)

// Com type assertion para garantir tipo específico
const usuariosTipados = dadosAPI.map((u): Usuario => ({
  id: u.user_id,
  nome: u.user_name
}));
// usuariosTipados: Usuario[] (explícito)
```

### Agregações Complexas

```typescript
interface Venda {
  produto: string;
  quantidade: number;
  preco: number;
}

const vendas: Venda[] = [
  { produto: "A", quantidade: 2, preco: 50 },
  { produto: "B", quantidade: 1, preco: 100 }
];

// Reduce com tipo complexo inferido
const resumo = vendas.reduce((acc, venda) => ({
  totalVendas: acc.totalVendas + 1,
  totalItens: acc.totalItens + venda.quantidade,
  faturamento: acc.faturamento + (venda.quantidade * venda.preco)
}), {
  totalVendas: 0,
  totalItens: 0,
  faturamento: 0
});
// resumo: { totalVendas: number; totalItens: number; faturamento: number }

// Com interface explícita
interface ResumoVendas {
  totalVendas: number;
  totalItens: number;
  faturamento: number;
}

const resumoTipado = vendas.reduce<ResumoVendas>((acc, venda) => ({
  totalVendas: acc.totalVendas + 1,
  totalItens: acc.totalItens + venda.quantidade,
  faturamento: acc.faturamento + (venda.quantidade * venda.preco)
}), {
  totalVendas: 0,
  totalItens: 0,
  faturamento: 0
});
```

### Union Types e Narrowing

```typescript
type Resultado<T> =
  | { sucesso: true; dados: T }
  | { sucesso: false; erro: string };

const resultados: Resultado<number>[] = [
  { sucesso: true, dados: 10 },
  { sucesso: false, erro: "Falha" },
  { sucesso: true, dados: 20 }
];

// Extrair apenas sucessos com type guard
const sucessos = resultados.filter(
  (r): r is { sucesso: true; dados: number } => r.sucesso
);
// sucessos: { sucesso: true; dados: number }[]

// Pode acessar .dados com segurança
const valores = sucessos.map(s => s.dados);
// valores: number[]

// Sem type guard
const tentativa = resultados.filter(r => r.sucesso);
// tentativa: Resultado<number>[] (união ainda presente!)
// tentativa.map(t => t.dados); // ❌ Erro: dados não existe em todos
```

## ⚠️ Limitações e Boas Práticas

### 1. Quando Inferência Falha

```typescript
// ❌ Inferência ambígua
const arr = [];
// arr: any[] (não consegue inferir tipo vazio)

arr.push(1);      // Aceita number
arr.push("texto"); // Aceita string (problema!)

// ✅ Especificar tipo explicitamente
const arrTipado: number[] = [];
arrTipado.push(1);      // ✅ OK
// arrTipado.push("texto"); // ❌ Erro

// ❌ Reduce sem valor inicial
const nums = [1, 2, 3];
const resultado = nums.reduce((acc, n) => acc + n);
// acc: number | undefined (pode ser undefined!)

// ✅ Com valor inicial
const resultadoSeguro = nums.reduce((acc, n) => acc + n, 0);
// acc: number (garantido)
```

### 2. Type Assertions Quando Necessário

```typescript
interface Config {
  tema: "claro" | "escuro";
  idioma: string;
}

const configs = [
  { tema: "claro", idioma: "pt" },
  { tema: "escuro", idioma: "en" }
];
// configs: { tema: string; idioma: string }[] (tipo muito amplo!)

// ✅ Type assertion
const configsTipadas = [
  { tema: "claro" as const, idioma: "pt" },
  { tema: "escuro" as const, idioma: "en" }
];
// configsTipadas: { tema: "claro" | "escuro"; idioma: string }[]

// Ou tipo explícito no array
const configsExplicitas: Config[] = [
  { tema: "claro", idioma: "pt" },
  { tema: "escuro", idioma: "en" }
];
```

### 3. Genéricos para Flexibilidade

```typescript
// ❌ Específico demais
function mapearNumeros(arr: number[], fn: (n: number) => number): number[] {
  return arr.map(fn);
}

// ✅ Genérico - reutilizável
function mapear<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// Funciona com qualquer tipo
const nums = mapear([1, 2, 3], n => n * 2);        // number[]
const strs = mapear([1, 2, 3], n => String(n));   // string[]
const objs = mapear(["a", "b"], s => ({ letra: s })); // { letra: string }[]
```

## 📚 Conclusão

Type inference em operações map/filter/reduce permite TypeScript deduzir tipos automaticamente através de transformações, propagando tipos via pipeline sem anotações explícitas. Mecanismo analisa tipo inicial, retorno de callbacks e valor inicial de reduce. Para narrowing em filter, use type guards (`x is Type`). Quando inferência falha ou é ambígua, especifique tipos explicitamente ou use genéricos para máxima flexibilidade e segurança.
