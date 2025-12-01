# reduce() - Acumulação e Agregação em TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

O método `reduce()` é uma **função de redução de alta ordem** que processa sequencialmente os elementos de um array, **acumulando-os em um único valor** através da aplicação repetida de uma função redutora. Conceitualmente, `reduce()` implementa o padrão matemático de **fold** (dobra) ou **catamorfismo**: uma operação que "colapsa" uma estrutura de dados em um valor singular através de combinação sistemática.

Na essência profunda, `reduce()` é uma **máquina de agregação universal**: você fornece um array de elementos, um **acumulador inicial**, e uma **função que define como combinar o acumulador com cada elemento**. O método itera pelo array, atualizando o acumulador em cada passo, e retorna o valor final acumulado. Essa simplicidade aparente esconde um poder extraordinário - `reduce()` é, teoricamente, capaz de **implementar qualquer operação de array**: `map()`, `filter()`, `find()`, `every()`, `some()` podem todos ser expressos usando `reduce()`.

Em TypeScript, `reduce()` é **genericamente tipado** com dois type parameters: `T` (tipo dos elementos do array) e `U` (tipo do acumulador/resultado), permitindo transformações de tipo arbitrárias. O compilador rastreia tipos através da redução, garantindo que acumulador e elementos sejam combinados com type safety completa.

### Contexto Histórico e Motivação

O método `reduce()` foi introduzido no JavaScript com **ECMAScript 5 (ES5)** em 2009, mas seu conceito remonta a **décadas de pesquisa em linguagens funcionais**. A operação de "fold" (dobra) foi formalizada na década de 1960-1970 em linguagens como **LISP**, **APL**, e **ML**, onde é reconhecida como uma das **abstrações mais poderosas** da programação funcional.

**Nomenclatura histórica**:
- **LISP**: `reduce` ou `accumulate`
- **Haskell**: `foldl` (fold left) e `foldr` (fold right)
- **ML/OCaml**: `fold_left` e `fold_right`
- **Python**: `reduce()` (movido para `functools` no Python 3)
- **JavaScript/TypeScript**: `reduce()` e `reduceRight()`

**Antes do ES5**, agregar arrays requeria loops imperativos com variáveis de acumulação:

```javascript
// Abordagem pré-ES5: somatório manual
var numeros = [1, 2, 3, 4, 5];
var soma = 0;

for (var i = 0; i < numeros.length; i++) {
  soma = soma + numeros[i];
}
```

Este padrão, embora funcional, apresenta problemas conceituais e práticos:
- **Verbosidade**: Muito código para expressar conceito simples ("combine todos elementos com operação")
- **Estado mutável explícito**: Variável `soma` é mutada repetidamente
- **Mistura de responsabilidades**: Iteração, acumulação e lógica de combinação no mesmo bloco
- **Não generalizado**: Cada tipo de agregação requer novo loop
- **Baixa composição**: Difícil de encadear ou reutilizar lógica

**A motivação fundamental** para `reduce()` foi:

1. **Abstração de padrão universal**: Reconhecer que "iterar acumulando" é um padrão ubíquo
2. **Generalização**: Uma operação que pode expressar qualquer agregação (soma, produto, máximo, concatenação, agrupamento, etc.)
3. **Composição funcional**: Permitir encadeamento com `map()`, `filter()` e outras operações
4. **Imutabilidade**: Evitar mutação de variáveis externas, encapsulando estado no acumulador
5. **Expressividade**: Comunicar intenção de "reduzir collection a valor único" claramente

Com **TypeScript**, `reduce()` ganhou **type safety extraordinária**. O sistema de tipos rastreia:
- **Tipo de entrada** (`T`): Tipo dos elementos do array
- **Tipo de saída** (`U`): Tipo do acumulador/resultado
- **Transformação de tipo**: Permite reduzir `Array<T>` para qualquer tipo `U`
- **Inferência contextual**: TypeScript infere tipos baseado no acumulador inicial

```typescript
const numeros: number[] = [1, 2, 3, 4, 5];

// TypeScript infere tipo do acumulador automaticamente
const soma = numeros.reduce((acc, n) => acc + n, 0);
// Tipo de 'soma': number (inferido de valor inicial 0)

const textos = numeros.reduce((acc, n) => acc + n.toString(), "");
// Tipo de 'textos': string (inferido de valor inicial "")
```

### Problema Fundamental que Resolve

O método `reduce()` resolve múltiplos problemas fundamentais na programação funcional:

#### 1. **Agregação Generalizada**

O problema central é a necessidade de **combinar múltiplos valores em um único resultado** através de operação sistemática:

```typescript
// Problema: Como somar todos números?
const numeros = [1, 2, 3, 4, 5];

// Solução imperativa: loop com acumulador
let soma = 0;
for (const n of numeros) {
  soma += n;
}

// Solução declarativa: reduce
const soma = numeros.reduce((acc, n) => acc + n, 0);
```

**Conceito**: `reduce()` abstrai o padrão "itere acumulando", permitindo foco na **operação de combinação** ao invés da mecânica de iteração.

#### 2. **Operador Universal de Transformação**

`reduce()` é **universal** no sentido de que pode implementar qualquer operação de array:

```typescript
// map() implementado com reduce()
function meuMap<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.reduce((acc, item) => {
    acc.push(fn(item));
    return acc;
  }, [] as U[]);
}

// filter() implementado com reduce()
function meuFilter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.reduce((acc, item) => {
    if (predicate(item)) {
      acc.push(item);
    }
    return acc;
  }, [] as T[]);
}

// find() implementado com reduce()
function meuFind<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  return array.reduce((acc, item) => {
    if (acc === undefined && predicate(item)) {
      return item;
    }
    return acc;
  }, undefined as T | undefined);
}
```

**Conceito profundo**: Qualquer operação que processa array sequencialmente pode ser expressa como `reduce()`. Isso faz de `reduce()` a **abstração mais poderosa** dos métodos de array.

#### 3. **Transformação de Estrutura de Dados**

`reduce()` permite **transformar arrays em estruturas arbitrárias**:

```typescript
interface Usuario {
  id: number;
  nome: string;
  idade: number;
}

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana", idade: 25 },
  { id: 2, nome: "Bruno", idade: 30 },
  { id: 3, nome: "Carlos", idade: 25 }
];

// Array → Objeto (agrupamento por idade)
const porIdade = usuarios.reduce((acc, usuario) => {
  const idade = usuario.idade;
  if (!acc[idade]) {
    acc[idade] = [];
  }
  acc[idade].push(usuario);
  return acc;
}, {} as Record<number, Usuario[]>);

// Resultado: { 25: [Ana, Carlos], 30: [Bruno] }

// Array → Map
const mapa = usuarios.reduce((acc, usuario) => {
  acc.set(usuario.id, usuario);
  return acc;
}, new Map<number, Usuario>());

// Array → Set (valores únicos)
const idades = usuarios.reduce((acc, usuario) => {
  acc.add(usuario.idade);
  return acc;
}, new Set<number>());
```

**Conceito**: `reduce()` é uma **ponte universal** entre estruturas de dados.

#### 4. **Cálculos Estatísticos e Agregações Complexas**

```typescript
interface Venda {
  produto: string;
  quantidade: number;
  valorUnitario: number;
}

const vendas: Venda[] = [
  { produto: "Mouse", quantidade: 2, valorUnitario: 50 },
  { produto: "Teclado", quantidade: 1, valorUnitario: 150 },
  { produto: "Monitor", quantidade: 1, valorUnitario: 800 }
];

// Cálculo complexo: valor total de todas vendas
const valorTotal = vendas.reduce((acc, venda) => {
  return acc + (venda.quantidade * venda.valorUnitario);
}, 0);
// 100 + 150 + 800 = 1050

// Agregação múltipla em um único reduce
interface Estatisticas {
  total: number;
  quantidade: number;
  media: number;
}

const estatisticas = vendas.reduce((acc, venda) => {
  const valor = venda.quantidade * venda.valorUnitario;
  acc.total += valor;
  acc.quantidade += venda.quantidade;
  acc.media = acc.total / acc.quantidade;
  return acc;
}, { total: 0, quantidade: 0, media: 0 } as Estatisticas);
```

#### 5. **Composição Sequencial de Transformações**

`reduce()` permite aplicar **sequência de transformações** de forma acumulativa:

```typescript
// Pipeline funcional com reduce
const operacoes = [
  (n: number) => n * 2,
  (n: number) => n + 10,
  (n: number) => n * n
];

const resultado = operacoes.reduce((valor, operacao) => {
  return operacao(valor);
}, 5);
// 5 → 10 (×2) → 20 (+10) → 400 (²)
```

### Importância no Ecossistema TypeScript

O método `reduce()` ocupa uma posição **singular e fundamental**:

#### **Paradigma Funcional Avançado**

`reduce()` é considerado o **ápice da programação funcional** em arrays. Dominar `reduce()` significa compreender conceitos profundos:
- **Fold (catamorfismo)**: Colapsar estrutura recursiva em valor
- **Accumulator pattern**: Padrão de acumulação de estado
- **Function composition**: Composição através de agregação
- **Type transformation**: Transformação de tipos via redução

#### **Universalidade e Poder Expressivo**

Como visto, `reduce()` pode expressar qualquer operação de array. Isso o torna:
- **Ferramenta de último recurso**: Quando `map`/`filter` não são suficientes
- **Base de bibliotecas**: Muitas bibliotecas implementam operações complexas com `reduce()`
- **Performance em pipelines**: Um `reduce()` pode fazer o trabalho de vários `map()`/`filter()` combinados

#### **Type Safety Avançada em TypeScript**

A assinatura de `reduce()` demonstra **genéricos covariantes complexos**:

```typescript
interface Array<T> {
  reduce<U>(
    callbackfn: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U
  ): U;
  
  // Sobrecarga: se não fornecer initialValue, retorno é T
  reduce(
    callbackfn: (accumulator: T, currentValue: T, currentIndex: number, array: T[]) => T
  ): T;
}
```

**Conceitos demonstrados**:
- **Tipo genérico independente** (`U`): Acumulador pode ser tipo diferente de `T`
- **Sobrecarga de método**: Comportamento diferente com/sem `initialValue`
- **Type inference**: TypeScript infere `U` do tipo de `initialValue`

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Agregação Universal**: Combina todos elementos de array em valor único
2. **Acumulador Persistente**: Mantém estado através das iterações
3. **Função Redutora**: Define como combinar acumulador com elemento atual
4. **Transformação de Tipo**: Pode reduzir `Array<T>` para qualquer tipo `U`
5. **Flexibilidade Estrutural**: Resultado pode ser primitivo, objeto, array, Map, Set, etc.

### Pilares Fundamentais

- **Callback com Acumulador**: Função recebe acumulador e retorna acumulador atualizado
- **Valor Inicial**: Define tipo e estado inicial do acumulador
- **Processamento Sequencial**: Elementos são processados da esquerda para direita
- **Imutabilidade do Array**: Array original nunca é modificado
- **Retorno do Último Acumulador**: Valor final do acumulador é retornado

### Visão Geral das Nuances

- **Valor Inicial Opcional**: Pode ser omitido (usa primeiro elemento), mas não recomendado
- **Arrays Vazios**: Sem valor inicial + array vazio = erro runtime
- **Tipo do Acumulador**: Determina tipo do retorno (inferência TypeScript)
- **Performance**: Um `reduce()` complexo pode ser mais rápido que múltiplos `map()`/`filter()`
- **Complexidade Cognitiva**: Mais difícil de ler que `map()`/`filter()` - use com moderação

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Implementação conceitual de `reduce()`:

```typescript
// Implementação conceitual simplificada
Array.prototype.reduce = function<T, U>(
  reducer: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U,
  initialValue?: U
): U {
  const array: T[] = this;
  const length = array.length;
  
  // Determina índice inicial e acumulador inicial
  let accumulator: U;
  let startIndex: number;
  
  if (initialValue !== undefined) {
    // Valor inicial fornecido
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // Valor inicial NÃO fornecido: usa primeiro elemento
    if (length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    accumulator = array[0] as unknown as U; // Primeiro elemento como acumulador
    startIndex = 1;
  }
  
  // Itera pelo array, atualizando acumulador
  for (let i = startIndex; i < length; i++) {
    if (i in array) { // Verifica arrays esparsos
      accumulator = reducer(accumulator, array[i], i, array);
    }
  }
  
  // Retorna acumulador final
  return accumulator;
};
```

#### Etapas da Execução

1. **Inicialização do Acumulador**:
   - Se `initialValue` fornecido: acumulador = `initialValue`, começa no índice 0
   - Se não fornecido: acumulador = primeiro elemento, começa no índice 1

2. **Iteração Sequencial**: Loop de início até `length - 1`

3. **Aplicação do Reducer**: Para cada elemento:
   ```typescript
   accumulator = reducer(accumulator, elemento, índice, array)
   ```

4. **Atualização do Acumulador**: Resultado do reducer torna-se novo acumulador

5. **Retorno**: Após processar todos elementos, retorna acumulador final

#### Visualização do Fluxo

```
Array: [1, 2, 3, 4, 5]
Initial: 0
Reducer: (acc, n) => acc + n

Passo 0: acc = 0 (inicial)
Passo 1: acc = reducer(0, 1) = 0 + 1 = 1
Passo 2: acc = reducer(1, 2) = 1 + 2 = 3
Passo 3: acc = reducer(3, 3) = 3 + 3 = 6
Passo 4: acc = reducer(6, 4) = 6 + 4 = 10
Passo 5: acc = reducer(10, 5) = 10 + 5 = 15
Retorno: 15
```

### Princípios e Conceitos Subjacentes

#### 1. **Fold (Catamorfismo)**

Na teoria das categorias e programação funcional, **fold** é uma operação que **colapsa uma estrutura recursiva** em um valor:

```
Lista recursiva:  1 : (2 : (3 : (4 : [])))
Fold left (+, 0): (((0 + 1) + 2) + 3) + 4 = 10
```

**Conceito**: `reduce()` é **fold left** (dobra à esquerda) - processa da esquerda para direita, acumulando à esquerda.

JavaScript também tem `reduceRight()` para **fold right** (dobra à direita):

```typescript
const numeros = [1, 2, 3, 4];

// reduce (left): ((0 + 1) + 2) + 3) + 4
const somaEsquerda = numeros.reduce((acc, n) => acc + n, 0);

// reduceRight (right): 1 + (2 + (3 + (4 + 0)))
const somaDireita = numeros.reduceRight((acc, n) => n + acc, 0);

// Para soma, resultado é idêntico (operação comutativa)
// Mas para operações não-comutativas, a ordem importa:
const textos = ["a", "b", "c"];
textos.reduce((acc, t) => acc + t, ""); // "abc"
textos.reduceRight((acc, t) => t + acc, ""); // "cba"
```

#### 2. **Accumulator Pattern (Padrão Acumulador)**

O acumulador é uma variável que **carrega estado através das iterações**:

```typescript
// Padrão imperativo explícito
let acc = 0; // Acumulador externo
for (const n of numeros) {
  acc = acc + n; // Atualização explícita
}

// reduce: acumulador encapsulado
const resultado = numeros.reduce((acc, n) => acc + n, 0);
```

**Benefício**: Acumulador é **encapsulado** dentro do `reduce()`, não poluindo escopo externo. Estado é **local e funcional**.

#### 3. **Imutabilidade do Acumulador (Conceito Ideal)**

Embora tecnicamente possível mutate acumulador, a **prática funcional recomenda imutabilidade**:

```typescript
// ❌ Mutação do acumulador (possível mas não ideal)
const resultado = numeros.reduce((acc, n) => {
  acc.push(n * 2); // Mutação
  return acc;
}, []);

// ✅ Imutabilidade (criar novo acumulador a cada passo)
const resultado = numeros.reduce((acc, n) => {
  return [...acc, n * 2]; // Novo array (spread)
}, []);

// Para objetos:
// ❌ Mutação
acc.propriedade = valor;

// ✅ Imutabilidade
return { ...acc, propriedade: valor };
```

**Trade-off**: Imutabilidade é mais pura e previsível, mas pode ter overhead de performance para arrays/objetos grandes. Na prática, mutação de acumulador em `reduce()` é **aceitável** se acumulador não "escapa" (não é usado fora do reduce).

#### 4. **Associatividade e Comutatividade**

Para algumas operações, a **ordem não importa** (comutativas); para outras, importa:

```typescript
// Operação COMUTATIVA: ordem não importa
const soma = [1, 2, 3].reduce((acc, n) => acc + n, 0);
// (0 + 1) + 2 + 3 = 6
// 3 + 2 + (1 + 0) = 6 (mesmo resultado)

// Operação NÃO-COMUTATIVA: ordem importa
const subtracao = [1, 2, 3].reduce((acc, n) => acc - n, 0);
// (0 - 1) - 2 - 3 = -6
// 3 - 2 - (1 - 0) = diferente!
```

**Implicação**: Se operação não é comutativa, `reduce()` e `reduceRight()` produzem resultados diferentes.

### Relação com Outros Conceitos

#### **Recursão e Iteração**

`reduce()` é essencialmente **recursão transformada em iteração**:

```typescript
// Versão recursiva (somatório)
function somaRecursiva(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr[0] + somaRecursiva(arr.slice(1));
}

// Equivalente com reduce (iterativo internamente)
const soma = arr.reduce((acc, n) => acc + n, 0);
```

**Conceito**: `reduce()` **evita stack overflow** que recursão profunda causaria, mantendo semantica recursiva.

#### **Monoids (Estruturas Algébricas)**

Em matemática, um **monoid** é uma estrutura com:
1. Operação binária associativa
2. Elemento identidade

`reduce()` é perfeito para monoids:

```typescript
// Monoid de adição: (Number, +, 0)
// Operação: +
// Identidade: 0
[1, 2, 3].reduce((acc, n) => acc + n, 0);

// Monoid de multiplicação: (Number, *, 1)
// Operação: *
// Identidade: 1
[2, 3, 4].reduce((acc, n) => acc * n, 1);

// Monoid de concatenação: (String, +, "")
// Operação: +
// Identidade: ""
["a", "b", "c"].reduce((acc, s) => acc + s, "");

// Monoid de arrays: (Array, concat, [])
[[1, 2], [3, 4], [5]].reduce((acc, arr) => acc.concat(arr), []);
```

**Conceito**: Quando operação forma monoid, `reduce()` é **teoricamente sólido**.

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica e Anatomia

#### Forma Fundamental

```typescript
const numeros: number[] = [1, 2, 3, 4, 5];

// Sintaxe completa
const soma = numeros.reduce(
  function(acumulador, valorAtual) {
    return acumulador + valorAtual;
  },
  0 // Valor inicial
);

// Sintaxe com arrow function (moderna)
const soma = numeros.reduce((acc, n) => acc + n, 0);

// Sintaxe com todos parâmetros
const soma = numeros.reduce((acc, valorAtual, indice, array) => {
  console.log(`Índice ${indice}: ${acc} + ${valorAtual}`);
  return acc + valorAtual;
}, 0);
```

**Anatomia**:
- **`numeros.reduce`**: Método chamado no array
- **Primeiro argumento**: Função redutora (reducer)
  - **`acc`**: Acumulador (carrega resultado intermediário)
  - **`valorAtual`**: Elemento atual sendo processado
  - **`indice`** (opcional): Índice do elemento atual
  - **`array`** (opcional): Array original completo
  - **Retorno**: Novo valor do acumulador
- **Segundo argumento**: Valor inicial do acumulador
- **Retorno do `reduce()`**: Acumulador final

#### Parâmetros da Função Redutora

```typescript
interface Produto {
  nome: string;
  preco: number;
}

const produtos: Produto[] = [
  { nome: "Mouse", preco: 50 },
  { nome: "Teclado", preco: 150 },
  { nome: "Monitor", preco: 800 }
];

const total = produtos.reduce((
  acumulador: number,    // Acumulador (tipo number)
  produto: Produto,      // Elemento atual (tipo Produto)
  indice: number,        // Índice (0, 1, 2, ...)
  array: Produto[]       // Array original completo
) => {
  console.log(`Processando ${indice + 1}/${array.length}: ${produto.nome}`);
  return acumulador + produto.preco;
}, 0); // Valor inicial: 0

// Output:
// Processando 1/3: Mouse
// Processando 2/3: Teclado
// Processando 3/3: Monitor
// total = 1000
```

### Tipagem em reduce()

#### Inferência de Tipo do Acumulador

TypeScript **infere automaticamente** o tipo de `U` (acumulador) baseado no valor inicial:

```typescript
const numeros = [1, 2, 3, 4, 5];

// Valor inicial: number → Acumulador: number
const soma = numeros.reduce((acc, n) => acc + n, 0);
// Tipo de 'soma': number

// Valor inicial: string → Acumulador: string
const concatenado = numeros.reduce((acc, n) => acc + n, "");
// Tipo de 'concatenado': string

// Valor inicial: array → Acumulador: array
const dobrados = numeros.reduce((acc, n) => {
  acc.push(n * 2);
  return acc;
}, [] as number[]);
// Tipo de 'dobrados': number[]

// Valor inicial: objeto → Acumulador: objeto
const estatisticas = numeros.reduce((acc, n) => {
  acc.soma += n;
  acc.quantidade++;
  return acc;
}, { soma: 0, quantidade: 0 });
// Tipo de 'estatisticas': { soma: number; quantidade: number }
```

#### Anotação Explícita de Tipo

```typescript
// Anotação explícita do tipo genérico
const resultado = numeros.reduce<number>((acc, n) => acc + n, 0);

// Com interface para acumulador complexo
interface Resumo {
  total: number;
  media: number;
  maximo: number;
}

const resumo = numeros.reduce<Resumo>((acc, n) => {
  acc.total += n;
  acc.maximo = Math.max(acc.maximo, n);
  acc.media = acc.total / numeros.length;
  return acc;
}, {
  total: 0,
  media: 0,
  maximo: -Infinity
});
```

#### Transformação de Tipo Array → Objeto

```typescript
interface Usuario {
  id: number;
  nome: string;
}

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" },
  { id: 3, nome: "Carlos" }
];

// Array<Usuario> → Record<number, Usuario>
const porId = usuarios.reduce((acc, usuario) => {
  acc[usuario.id] = usuario;
  return acc;
}, {} as Record<number, Usuario>);

// Tipo de 'porId': Record<number, Usuario>
// Resultado: { 1: {id: 1, nome: "Ana"}, 2: {...}, 3: {...} }
```

#### Transformação para Estruturas Complexas

```typescript
interface Venda {
  categoria: string;
  valor: number;
}

const vendas: Venda[] = [
  { categoria: "Eletrônicos", valor: 1000 },
  { categoria: "Livros", valor: 50 },
  { categoria: "Eletrônicos", valor: 500 },
  { categoria: "Livros", valor: 30 }
];

// Agrupar e somar por categoria
interface ResumoCategoria {
  total: number;
  quantidade: number;
}

const porCategoria = vendas.reduce((acc, venda) => {
  if (!acc[venda.categoria]) {
    acc[venda.categoria] = { total: 0, quantidade: 0 };
  }
  acc[venda.categoria].total += venda.valor;
  acc[venda.categoria].quantidade++;
  return acc;
}, {} as Record<string, ResumoCategoria>);

// Resultado:
// {
//   "Eletrônicos": { total: 1500, quantidade: 2 },
//   "Livros": { total: 80, quantidade: 2 }
// }
```

### Padrões Comuns de reduce()

#### 1. Somatório e Agregações Numéricas

```typescript
const numeros = [1, 2, 3, 4, 5];

// Soma
const soma = numeros.reduce((acc, n) => acc + n, 0);
// 15

// Produto
const produto = numeros.reduce((acc, n) => acc * n, 1);
// 120

// Média
const media = numeros.reduce((acc, n, i, arr) => {
  acc += n;
  return i === arr.length - 1 ? acc / arr.length : acc;
}, 0);
// 3

// Máximo
const maximo = numeros.reduce((acc, n) => Math.max(acc, n), -Infinity);
// 5

// Mínimo
const minimo = numeros.reduce((acc, n) => Math.min(acc, n), Infinity);
// 1
```

#### 2. Concatenação e Flatten

```typescript
const palavras = ["Olá", "mundo", "TypeScript"];

// Concatenar strings
const frase = palavras.reduce((acc, palavra) => acc + " " + palavra, "");
// " Olá mundo TypeScript"

// Flatten (achatar array de arrays)
const nested = [[1, 2], [3, 4], [5, 6]];
const achatado = nested.reduce((acc, arr) => acc.concat(arr), []);
// [1, 2, 3, 4, 5, 6]

// Deep flatten (recursivo)
function flattenDeep(arr: any[]): any[] {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flattenDeep(item));
    }
    return acc.concat(item);
  }, []);
}

flattenDeep([1, [2, [3, [4, 5]]]]); // [1, 2, 3, 4, 5]
```

#### 3. Agrupamento (Grouping)

```typescript
interface Pessoa {
  nome: string;
  idade: number;
  cidade: string;
}

const pessoas: Pessoa[] = [
  { nome: "Ana", idade: 25, cidade: "SP" },
  { nome: "Bruno", idade: 30, cidade: "RJ" },
  { nome: "Carlos", idade: 25, cidade: "SP" },
  { nome: "Diana", idade: 30, cidade: "SP" }
];

// Agrupar por idade
const porIdade = pessoas.reduce((acc, pessoa) => {
  const idade = pessoa.idade;
  if (!acc[idade]) {
    acc[idade] = [];
  }
  acc[idade].push(pessoa);
  return acc;
}, {} as Record<number, Pessoa[]>);

// Resultado:
// {
//   25: [Ana, Carlos],
//   30: [Bruno, Diana]
// }

// Agrupar por cidade
const porCidade = pessoas.reduce((acc, pessoa) => {
  acc[pessoa.cidade] = acc[pessoa.cidade] || [];
  acc[pessoa.cidade].push(pessoa);
  return acc;
}, {} as Record<string, Pessoa[]>);
```

#### 4. Contagem (Counting)

```typescript
const frutas = ["maçã", "banana", "maçã", "laranja", "banana", "maçã"];

// Contar ocorrências
const contagem = frutas.reduce((acc, fruta) => {
  acc[fruta] = (acc[fruta] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

// Resultado: { "maçã": 3, "banana": 2, "laranja": 1 }
```

#### 5. Remoção de Duplicatas

```typescript
const comDuplicatas = [1, 2, 2, 3, 4, 3, 5, 1];

// Remover duplicatas (usando includes)
const unicos = comDuplicatas.reduce((acc, n) => {
  if (!acc.includes(n)) {
    acc.push(n);
  }
  return acc;
}, [] as number[]);
// [1, 2, 3, 4, 5]

// Com Set (mais eficiente)
const unicosSet = [...new Set(comDuplicatas)]; // Sem reduce, melhor performance
```

#### 6. Construção de Objeto a partir de Array

```typescript
const pares = [
  ["nome", "Ana"],
  ["idade", 25],
  ["cidade", "SP"]
];

// Array de pares → Objeto
const objeto = pares.reduce((acc, [chave, valor]) => {
  acc[chave] = valor;
  return acc;
}, {} as Record<string, any>);

// Resultado: { nome: "Ana", idade: 25, cidade: "SP" }
```

#### 7. Pipeline de Transformações

```typescript
// Compor funções com reduce
const operacoes = [
  (n: number) => n + 10,
  (n: number) => n * 2,
  (n: number) => n - 5
];

const pipe = operacoes.reduce((valor, operacao) => {
  return operacao(valor);
}, 5);
// 5 → +10 = 15 → ×2 = 30 → -5 = 25
```

### Valor Inicial: Com vs. Sem

#### Com Valor Inicial (Recomendado)

```typescript
// ✅ RECOMENDADO: sempre fornecer valor inicial
const soma = [1, 2, 3].reduce((acc, n) => acc + n, 0);

// Benefícios:
// 1. Type safety: TypeScript sabe tipo do acumulador
// 2. Segurança: funciona com arrays vazios
// 3. Clareza: intenção é explícita
```

#### Sem Valor Inicial (Perigoso)

```typescript
// ⚠️ Sem valor inicial: usa primeiro elemento
const soma = [1, 2, 3].reduce((acc, n) => acc + n);
// Funciona: 1 + 2 + 3 = 6

// ❌ PERIGO: array vazio = erro!
const vazio = [].reduce((acc, n) => acc + n);
// TypeError: Reduce of empty array with no initial value

// ⚠️ Tipo pode ser ambíguo
const resultado = numeros.reduce((acc, n) => acc + n);
// TypeScript não sabe se acumulador é number ou string
```

**Regra de ouro**: **SEMPRE forneça valor inicial** para segurança e clareza.

---

Vou continuar com a segunda metade do arquivo sobre reduce():

```typescript
### Composição com Outros Métodos

#### reduce após map/filter

```typescript
const produtos = [
  { nome: "Mouse", preco: 50, categoria: "Eletrônicos" },
  { nome: "Cadeira", preco: 400, categoria: "Móveis" },
  { nome: "Teclado", preco: 150, categoria: "Eletrônicos" }
];

// Pipeline: filter → map → reduce
const totalEletronicos = produtos
  .filter(p => p.categoria === "Eletrônicos")
  .map(p => p.preco)
  .reduce((acc, preco) => acc + preco, 0);
// 50 + 150 = 200

// Equivalente com reduce apenas (mais eficiente)
const totalEletronicosOtimizado = produtos.reduce((acc, p) => {
  if (p.categoria === "Eletrônicos") {
    return acc + p.preco;
  }
  return acc;
}, 0);
```

**Trade-off**: Pipeline (`filter + map + reduce`) é mais legível; `reduce` puro é mais performático (uma única iteração).

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar reduce()

#### Cenário 1: Agregações Complexas

Quando você precisa calcular múltiplas estatísticas em uma passada:

```typescript
const numeros = [10, 20, 30, 40, 50];

const estatisticas = numeros.reduce((acc, n) => {
  acc.soma += n;
  acc.quantidade++;
  acc.maximo = Math.max(acc.maximo, n);
  acc.minimo = Math.min(acc.minimo, n);
  acc.media = acc.soma / acc.quantidade;
  return acc;
}, {
  soma: 0,
  quantidade: 0,
  maximo: -Infinity,
  minimo: Infinity,
  media: 0
});
```

#### Cenário 2: Transformação de Estrutura

Quando você precisa transformar array em objeto, Map, Set, ou outra estrutura:

```typescript
// Array → Map
const mapa = usuarios.reduce((acc, u) => {
  acc.set(u.id, u);
  return acc;
}, new Map<number, Usuario>());

// Array → Objeto indexado
const porId = usuarios.reduce((acc, u) => {
  acc[u.id] = u;
  return acc;
}, {} as Record<number, Usuario>);
```

#### Cenário 3: Quando Precisar de "Memória" Entre Iterações

Quando processamento de um elemento depende de elementos anteriores:

```typescript
// Exemplo: calcular diferenças consecutivas
const valores = [10, 15, 12, 20];

const diferencas = valores.reduce((acc, valor, i) => {
  if (i > 0) {
    acc.push(valor - valores[i - 1]);
  }
  return acc;
}, [] as number[]);
// [5, -3, 8] (15-10, 12-15, 20-12)
```

### Quando NÃO Usar reduce()

#### ❌ Para Transformações Simples (Use map)

```typescript
// ❌ Complicado com reduce
const dobrados = numeros.reduce((acc, n) => {
  acc.push(n * 2);
  return acc;
}, []);

// ✅ Simples com map
const dobrados = numeros.map(n => n * 2);
```

#### ❌ Para Filtragens (Use filter)

```typescript
// ❌ Confuso com reduce
const pares = numeros.reduce((acc, n) => {
  if (n % 2 === 0) acc.push(n);
  return acc;
}, []);

// ✅ Claro com filter
const pares = numeros.filter(n => n % 2 === 0);
```

#### ❌ Para Buscar Elemento (Use find)

```typescript
// ❌ Ineficiente com reduce (processa todos)
const usuario = usuarios.reduce((acc, u) => {
  if (u.id === 5) return u;
  return acc;
}, undefined as Usuario | undefined);

// ✅ Eficiente com find (para no primeiro)
const usuario = usuarios.find(u => u.id === 5);
```

---

## ⚠️ Limitações e Armadilhas

### Armadilhas Comuns

#### Armadilha 1: Esquecer Return

```typescript
// ❌ Sem return: acumulador torna-se undefined
const soma = numeros.reduce((acc, n) => {
  acc + n; // Sem 'return'!
}, 0);
// undefined!

// ✅ Com return
const soma = numeros.reduce((acc, n) => {
  return acc + n;
}, 0);
```

#### Armadilha 2: Não Fornecer Valor Inicial

```typescript
// ❌ Array vazio sem valor inicial = erro
const resultado = [].reduce((acc, n) => acc + n);
// TypeError!

// ✅ Com valor inicial
const resultado = [].reduce((acc, n) => acc + n, 0);
// 0 (seguro)
```

#### Armadilha 3: Mutação Não Intencional

```typescript
const objetos = [{ valor: 1 }, { valor: 2 }];

// ❌ Mutação do acumulador pode causar problemas
const modificados = objetos.reduce((acc, obj) => {
  obj.valor *= 2; // MUTOU objeto original!
  acc.push(obj);
  return acc;
}, []);

// Objetos originais foram modificados!

// ✅ Clone antes de modificar
const modificados = objetos.reduce((acc, obj) => {
  acc.push({ ...obj, valor: obj.valor * 2 });
  return acc;
}, []);
```

---

## 🔗 Interconexões Conceituais

### Relação com map/filter

`reduce()` é **generalização** de `map()` e `filter()`:

```typescript
// map() = reduce() que constrói novo array transformado
const mapComReduce = <T, U>(arr: T[], fn: (item: T) => U): U[] => {
  return arr.reduce((acc, item) => {
    acc.push(fn(item));
    return acc;
  }, [] as U[]);
};

// filter() = reduce() que constrói novo array filtrado
const filterComReduce = <T>(arr: T[], predicate: (item: T) => boolean): T[] => {
  return arr.reduce((acc, item) => {
    if (predicate(item)) acc.push(item);
    return acc;
  }, [] as T[]);
};
```

### Relação com Programação Funcional

`reduce()` implementa conceitos fundamentais:
- **Fold**: Colapsar estrutura
- **Catamorfismo**: Padrão de recursão
- **Monoids**: Operações associativas com identidade

---

## 🚀 Próximos Conceitos

Após dominar `reduce()`:
1. **reduceRight()**: Redução da direita para esquerda
2. **Transducers**: Composição eficiente de transformações
3. **Lazy evaluation**: Processamento sob demanda
4. **Function composition avançada**: Compor operações com reduce

---

## 📚 Conclusão

`reduce()` é o **método mais poderoso e versátil** dos arrays em TypeScript. Sua capacidade de expressar qualquer operação de agregação o torna indispensável para programação funcional avançada.

Embora tenha curva de aprendizado mais íngreme que `map()`/`filter()`, dominar `reduce()` abre portas para:
- Transformações complexas de dados
- Agregações estatísticas
- Reestruturação de dados
- Composição funcional avançada

Use `reduce()` com sabedoria: para operações simples, prefira `map()`/`filter()` (mais legíveis). Para agregações complexas e transformações de estrutura, `reduce()` é **insubstituível**.
