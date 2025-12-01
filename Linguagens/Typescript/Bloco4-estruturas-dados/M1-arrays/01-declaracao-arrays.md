# Declaração de Arrays em TypeScript: Sintaxe, Type Annotations e Inferência de Tipos

## 🎯 Introdução e Definição

### Definição Conceitual

Um **array em TypeScript** é uma **estrutura de dados homogênea e ordenada** que armazena uma coleção de elementos do mesmo tipo (ou tipos compatíveis), acessíveis por índices numéricos sequenciais começando em zero. Conceitualmente, um array TypeScript é uma **lista tipada** - uma extensão do array JavaScript com **garantias de tipo em tempo de compilação**.

Na essência profunda, arrays em TypeScript incorporam dois paradigmas fundamentais:

1. **Estrutura de dados dinâmica** (herança do JavaScript): Arrays crescem e encolhem dinamicamente, sem necessidade de declarar tamanho fixo
2. **Tipagem estática** (adicionado pelo TypeScript): Cada array tem um **tipo de elemento** que o compilador verifica rigorosamente

TypeScript oferece **duas sintaxes equivalentes** para declarar arrays tipados:

```typescript
// Sintaxe 1: Tipo com colchetes (preferida)
let numeros: number[] = [1, 2, 3, 4, 5];

// Sintaxe 2: Generic Array<T>
let numeros: Array<number> = [1, 2, 3, 4, 5];
```

Ambas expressam exatamente o mesmo conceito: "um array de números". A diferença é puramente **sintática** - o comportamento e as garantias de tipo são idênticos.

O sistema de tipos do TypeScript garante que:
- **Todos elementos** sejam do tipo declarado
- **Operações** no array respeitem os tipos
- **Métodos de array** preservem type safety (ex: `map<U>` pode transformar `T[]` em `U[]`)

### Contexto Histórico e Motivação

Arrays existem em praticamente todas as linguagens de programação desde os primórdios da computação. Em **JavaScript** (ECMAScript), arrays são objetos especiais introduzidos desde a primeira versão (1995):

```javascript
// JavaScript: arrays sem tipagem
var numeros = [1, 2, 3];
numeros.push("texto"); // Permitido! Agora temos [1, 2, 3, "texto"]
numeros[0] = true;     // Permitido! Agora temos [true, 2, 3, "texto"]
```

**Problemas com arrays JavaScript sem tipagem**:
- **Heterogeneidade não intencional**: Arrays podem acumular tipos misturados sem intenção
- **Erros silenciosos**: Operações incompatíveis com tipos não são detectadas até runtime
- **Falta de IntelliSense**: Editores não sabem tipo dos elementos
- **Documentação implícita ausente**: Código não expressa que tipo de dados o array contém

**TypeScript** (lançado em 2012 pela Microsoft) introduziu **tipagem estática para arrays** com objetivos claros:

1. **Homogeneidade garantida**: Forçar que todos elementos sejam do mesmo tipo
2. **Detecção precoce de erros**: Erros de tipo detectados em compilação, não em runtime
3. **IntelliSense robusto**: Editores sabem exatamente tipo dos elementos
4. **Documentação viva**: Código expressa explicitamente tipos de dados
5. **Refatoração segura**: Mudanças de tipo são rastreadas pelo compilador

**Evolução das sintaxes**:

TypeScript desde a versão inicial ofereceu duas sintaxes:

```typescript
// TypeScript 0.8 (2012): ambas sintaxes já presentes
let numeros: number[];        // Sintaxe com colchetes
let numeros: Array<number>;   // Sintaxe genérica
```

**Por que duas sintaxes?**

- **`number[]`**: Inspirada em Java, C#, C++ - familiar para desenvolvedores vindos dessas linguagens
- **`Array<number>`**: Expressão explícita de **generic type** - consistente com outros tipos genéricos (`Promise<T>`, `Map<K, V>`)

**Consenso da comunidade**: Preferir `T[]` para tipos simples por **concisão**; usar `Array<T>` quando necessário para **clareza** ou em tipos complexos.

### Problema Fundamental que Resolve

#### 1. **Type Safety em Coleções**

Problema: Como garantir que uma coleção contenha apenas elementos de tipo específico?

```typescript
// ❌ JavaScript: sem garantias
let idades = [25, 30, 35];
idades.push("quarenta"); // Permitido! Mas incorreto semanticamente
idades.forEach(idade => {
  console.log(idade + 1); // "quarenta1" - bug!
});

// ✅ TypeScript: type safety
let idades: number[] = [25, 30, 35];
idades.push("quarenta"); 
// ERRO: Argument of type 'string' is not assignable to parameter of type 'number'

idades.forEach(idade => {
  console.log(idade + 1); // TypeScript garante que 'idade' é number
});
```

**Conceito**: Tipagem de array **previne bugs** ao forçar homogeneidade.

#### 2. **IntelliSense e Autocomplete**

Problema: Como editores sabem quais métodos/propriedades elementos do array possuem?

```typescript
interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

let usuarios: Usuario[] = [
  { nome: "Ana", email: "ana@email.com", idade: 25 },
  { nome: "Bruno", email: "bruno@email.com", idade: 30 }
];

// TypeScript sabe que cada elemento é Usuario
usuarios.forEach(usuario => {
  console.log(usuario.nome.toUpperCase()); // IntelliSense sugere .nome, .email, .idade
  console.log(usuario.email.toLowerCase()); // E métodos de string!
});
```

**Conceito**: Tipagem de array fornece **IntelliSense rico** para elementos.

#### 3. **Inferência de Tipo Automática**

Problema: Como evitar anotações de tipo redundantes quando tipo é óbvio?

```typescript
// TypeScript INFERE tipo automaticamente
let numeros = [1, 2, 3, 4, 5]; 
// Tipo inferido: number[]

let textos = ["a", "b", "c"];
// Tipo inferido: string[]

let usuarios = [
  { nome: "Ana", idade: 25 },
  { nome: "Bruno", idade: 30 }
];
// Tipo inferido: { nome: string; idade: number }[]

// Não precisa anotar explicitamente!
// let numeros: number[] = [1, 2, 3]; // Redundante
```

**Conceito**: TypeScript **infere tipos** quando possível, reduzindo verbosidade.

#### 4. **Transformações Type-Safe com Métodos**

Problema: Como garantir que transformações de array preservem type safety?

```typescript
let numeros: number[] = [1, 2, 3, 4, 5];

// map: transforma number[] em string[]
let textos: string[] = numeros.map(n => n.toString());
// TypeScript INFERE que resultado é string[]

// filter: preserva tipo original
let pares: number[] = numeros.filter(n => n % 2 === 0);
// TypeScript INFERE que resultado é number[]

// reduce: pode transformar para qualquer tipo
let soma: number = numeros.reduce((acc, n) => acc + n, 0);
// TypeScript INFERE que resultado é number (tipo do acumulador inicial)
```

**Conceito**: Métodos de array são **genericamente tipados** para preservar/transformar tipos.

### Importância no Ecossistema TypeScript

#### **Fundação para Estruturas de Dados**

Arrays são a **estrutura de dados mais fundamental** em TypeScript:
- Base para listas, filas, pilhas
- Usados internamente por Set, Map (para iteração)
- Retornados por quase todos métodos de coleção

#### **Genéricos em Ação**

Arrays demonstram **generics** na prática:

```typescript
// Array<T> é um tipo genérico
type MeuArray<T> = Array<T>;

let nums: MeuArray<number> = [1, 2, 3];
let strs: MeuArray<string> = ["a", "b"];
```

Compreender arrays tipados é **pré-requisito** para entender genéricos em TypeScript.

#### **Type Safety em Dados Reais**

Na prática, quase todo código TypeScript manipula arrays:
- APIs retornam arrays de objetos
- Bancos de dados retornam arrays de registros
- UI renderiza listas/arrays de componentes

Type safety em arrays é **crítico** para robustez de aplicações.

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Estrutura Homogênea Tipada**: Arrays TypeScript armazenam elementos do mesmo tipo `T`
2. **Duas Sintaxes Equivalentes**: `T[]` (preferida) e `Array<T>` (genérica explícita)
3. **Inferência Automática**: TypeScript deduz tipo do array baseado em elementos iniciais
4. **Type Safety Garantida**: Compilador previne inserção de tipos incompatíveis
5. **Métodos Genéricos**: Array methods (`map`, `filter`, etc.) preservam/transformam tipos

### Pilares Fundamentais

- **Indexação Zero-Based**: Primeiro elemento em índice 0
- **Tamanho Dinâmico**: Arrays crescem/encolhem automaticamente
- **Tipo de Elemento**: Definido em declaração ou inferido
- **Imutabilidade de Tipo**: Tipo de elemento não muda após declaração
- **Compatibilidade JavaScript**: Arrays TypeScript compilam para arrays JavaScript normais

### Visão Geral das Nuances

- **Anotação vs. Inferência**: Quando anotar explicitamente vs. confiar em inferência
- **Array vazio**: Requer anotação explícita (inferência não funciona)
- **Sintaxe em JSX**: Em React, preferir `Array<T>` para evitar conflito com tags JSX
- **ReadonlyArray**: Variante imutável de arrays
- **Tuplas**: Arrays com tipos fixos por posição

---

## 🧠 Fundamentos Teóricos

### Anatomia de um Array TypeScript

```typescript
// Estrutura completa
let identificador: TipoElemento[] = [elemento1, elemento2, ...];

// Exemplo concreto
let numeros: number[] = [1, 2, 3, 4, 5];
//  ^         ^          ^
//  |         |          |
//  |         |          +-- Elementos (literals)
//  |         +------------- Tipo de elemento
//  +----------------------- Identificador (nome da variável)
```

**Componentes**:
1. **Identificador**: Nome da variável (`numeros`)
2. **Type Annotation**: Tipo do array (`number[]`)
3. **Inicializador**: Lista de elementos (`[1, 2, 3, 4, 5]`)

### Duas Sintaxes: `T[]` vs. `Array<T>`

#### Sintaxe 1: Tipo com Colchetes (`T[]`)

```typescript
let numeros: number[] = [1, 2, 3];
let textos: string[] = ["a", "b", "c"];
let booleanos: boolean[] = [true, false];

// Arrays de tipos complexos
interface Pessoa {
  nome: string;
  idade: number;
}

let pessoas: Pessoa[] = [
  { nome: "Ana", idade: 25 },
  { nome: "Bruno", idade: 30 }
];

// Arrays multidimensionais
let matriz: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];
```

**Características**:
- **Concisa**: Menos caracteres
- **Legível**: Imediatamente reconhecível como array
- **Familiar**: Sintaxe similar a Java, C#, C++
- **Preferida** pela comunidade para tipos simples

#### Sintaxe 2: Generic Type (`Array<T>`)

```typescript
let numeros: Array<number> = [1, 2, 3];
let textos: Array<string> = ["a", "b", "c"];
let booleanos: Array<boolean> = [true, false];

interface Pessoa {
  nome: string;
  idade: number;
}

let pessoas: Array<Pessoa> = [
  { nome: "Ana", idade: 25 },
  { nome: "Bruno", idade: 30 }
];

// Arrays multidimensionais
let matriz: Array<Array<number>> = [
  [1, 2, 3],
  [4, 5, 6]
];
```

**Características**:
- **Explícita**: Claramente um tipo genérico
- **Consistente**: Mesmo padrão de `Promise<T>`, `Map<K, V>`
- **Necessária em JSX**: Em React/TSX, `<Component>` pode conflitar com sintaxe de tag
- **Verbosa**: Mais caracteres

#### Quando Usar Cada Uma?

**Use `T[]` (preferida):**
- Tipos simples e diretos
- Código não-JSX
- Quando concisão é desejada

```typescript
✅ let ids: number[] = [1, 2, 3];
✅ let nomes: string[] = ["Ana", "Bruno"];
```

**Use `Array<T>`:**
- Em arquivos JSX/TSX (evita ambiguidade)
- Quando consistência com outros genéricos é importante
- Em tipos complexos onde clareza ajuda

```typescript
✅ let ids: Array<number> = [1, 2, 3]; // Em JSX
✅ let promessas: Array<Promise<Response>> = [...]; // Clareza
```

### Inferência de Tipo Automática

TypeScript **infere** (deduz) tipo de arrays baseado nos elementos fornecidos:

```typescript
// Inferência simples
let numeros = [1, 2, 3, 4, 5];
// Tipo inferido: number[]

let textos = ["apple", "banana", "cherry"];
// Tipo inferido: string[]

let misturado = [1, "texto", true];
// Tipo inferido: (number | string | boolean)[]

// Inferência de objetos
let usuarios = [
  { nome: "Ana", idade: 25 },
  { nome: "Bruno", idade: 30 }
];
// Tipo inferido: { nome: string; idade: number }[]

// Array vazio: SEM INFERÊNCIA (tipo: any[])
let vazio = [];
// Tipo inferido: any[] (PERIGOSO!)

// Solução: anotar explicitamente
let vazio: string[] = [];
// Tipo: string[]
```

**Regras de Inferência**:
1. **Elementos presentes**: TypeScript analisa tipo de cada elemento
2. **Union type**: Se elementos têm tipos diferentes, cria union
3. **Array vazio**: Infere `any[]` (evite!)
4. **Objetos literais**: Infere estrutura exata dos objetos

#### Inferência vs. Anotação Explícita

```typescript
// ✅ INFERÊNCIA: quando tipo é óbvio
let nums = [1, 2, 3]; // number[] - claro!

// ✅ ANOTAÇÃO: quando tipo não é óbvio ou queremos restringir
let ids: number[] = []; // Explícita - array vazio
let resultados: (string | null)[] = ["ok", null]; // Explícita - union type específico

// ❌ REDUNDANTE: anotação desnecessária
let nums: number[] = [1, 2, 3]; 
// Desnecessário - inferência já funciona
```

### Type Safety em Operações

```typescript
let numeros: number[] = [1, 2, 3];

// ✅ Operações type-safe
numeros.push(4);           // OK: 4 é number
numeros[0] = 10;           // OK: 10 é number
let primeiro = numeros[0]; // Tipo: number

// ❌ Erros detectados em compilação
numeros.push("texto");     // ERRO: string não é number
numeros[1] = true;         // ERRO: boolean não é number
let texto: string = numeros[0]; // ERRO: number não é atribuível a string
```

### Declaração vs. Inicialização

```typescript
// Declaração + Inicialização (comum)
let numeros: number[] = [1, 2, 3];

// Declaração separada (array vazio)
let numeros: number[];
numeros = [1, 2, 3]; // Inicialização posterior

// Const com array (referência imutável, conteúdo mutável)
const numeros: number[] = [1, 2, 3];
numeros.push(4);        // OK: modifica conteúdo
numeros[0] = 10;        // OK: modifica conteúdo
// numeros = [5, 6, 7]; // ERRO: não pode reatribuir const

// ReadonlyArray: conteúdo também imutável
const numeros: ReadonlyArray<number> = [1, 2, 3];
// numeros.push(4);     // ERRO: push não existe em ReadonlyArray
// numeros[0] = 10;     // ERRO: índice é readonly
```

---

## 🔍 Análise Conceitual Profunda

### Tipos de Arrays Comuns

#### Arrays de Primitivos

```typescript
// Numbers
let inteiros: number[] = [1, 2, 3, 4, 5];
let decimais: number[] = [1.5, 2.7, 3.14];
let especiais: number[] = [Infinity, -Infinity, NaN];

// Strings
let nomes: string[] = ["Ana", "Bruno", "Carlos"];
let vazios: string[] = ["", "texto", ""];

// Booleans
let flags: boolean[] = [true, false, true];

// Null/Undefined (raramente útil)
let nulos: null[] = [null, null];
let indefinidos: undefined[] = [undefined, undefined];
```

#### Arrays de Tipos Complexos

```typescript
// Objetos literais
let pontos: { x: number; y: number }[] = [
  { x: 0, y: 0 },
  { x: 10, y: 20 }
];

// Interfaces
interface Produto {
  id: number;
  nome: string;
  preco: number;
}

let produtos: Produto[] = [
  { id: 1, nome: "Mouse", preco: 50 },
  { id: 2, nome: "Teclado", preco: 150 }
];

// Type aliases
type Coordenada = [number, number];
let coordenadas: Coordenada[] = [
  [0, 0],
  [10, 20],
  [30, 40]
];

// Enums
enum Status {
  Pendente,
  Aprovado,
  Rejeitado
}

let statusList: Status[] = [
  Status.Pendente,
  Status.Aprovado
];
```

#### Arrays Multidimensionais

```typescript
// Matriz 2D
let matriz: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Acesso
let elemento = matriz[1][2]; // 6

// Matriz 3D
let cubo: number[][][] = [
  [[1, 2], [3, 4]],
  [[5, 6], [7, 8]]
];

// Arrays de arrays de objetos
let grupos: Produto[][] = [
  [{ id: 1, nome: "Mouse", preco: 50 }],
  [{ id: 2, nome: "Teclado", preco: 150 }]
];
```

### Métodos de Array com Type Safety

```typescript
let numeros: number[] = [1, 2, 3, 4, 5];

// map: transforma tipo
let strings: string[] = numeros.map(n => n.toString());
// Tipo inferido: string[]

// filter: preserva tipo
let pares: number[] = numeros.filter(n => n % 2 === 0);
// Tipo inferido: number[]

// reduce: acumulador tipado
let soma: number = numeros.reduce((acc, n) => acc + n, 0);
// Tipo inferido: number

// find: retorna elemento ou undefined
let primeiro: number | undefined = numeros.find(n => n > 3);
// Tipo: number | undefined

// every/some: retorna boolean
let todosPares: boolean = numeros.every(n => n % 2 === 0);
// Tipo: boolean
```

### Padrões Comuns de Declaração

#### Pattern 1: Array Vazio com Tipo

```typescript
// ✅ Correto: anotar tipo explicitamente
let numeros: number[] = [];
numeros.push(1);
numeros.push(2);

// ❌ Incorreto: inferência resulta em any[]
let numeros = [];
numeros.push(1); // OK, mas numeros é any[]
```

#### Pattern 2: Array de Objetos com Interface

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Correto
let usuarios: Usuario[] = [];

usuarios.push({
  id: 1,
  nome: "Ana",
  email: "ana@email.com"
});

// TypeScript valida estrutura
usuarios.push({
  id: 2,
  nome: "Bruno"
  // ERRO: falta propriedade 'email'
});
```

#### Pattern 3: Const com Arrays

```typescript
// const: referência imutável
const CORES: string[] = ["vermelho", "verde", "azul"];

CORES.push("amarelo");   // OK: modifica conteúdo
CORES[0] = "roxo";       // OK: modifica conteúdo
// CORES = ["novo"];     // ERRO: não pode reatribuir const

// ReadonlyArray: conteúdo imutável
const CORES: ReadonlyArray<string> = ["vermelho", "verde", "azul"];
// CORES.push("amarelo"); // ERRO: push não existe
// CORES[0] = "roxo";     // ERRO: índice é readonly
```

#### Pattern 4: Array de Funções

```typescript
// Array de funções com assinatura
type Operacao = (a: number, b: number) => number;

let operacoes: Operacao[] = [
  (a, b) => a + b,
  (a, b) => a - b,
  (a, b) => a * b,
  (a, b) => a / b
];

// Uso
let resultado = operacoes[0](10, 5); // 15
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Sintaxe

#### Preferir `T[]`:

```typescript
✅ let ids: number[] = [1, 2, 3];
✅ let nomes: string[] = ["Ana", "Bruno"];
✅ let usuarios: Usuario[] = [...];
```

#### Preferir `Array<T>`:

```typescript
✅ // Em arquivos TSX/JSX
let componentes: Array<React.ReactNode> = [...];

✅ // Tipos complexos aninhados
let promessas: Array<Promise<Response>> = [...];

✅ // Consistência com outros genéricos
let mapa: Map<string, Array<number>> = new Map();
```

### Quando Anotar Explicitamente

```typescript
// ✅ Array vazio
let itens: string[] = [];

// ✅ Union type específico
let valores: (number | null)[] = [1, null, 2];

// ✅ Parâmetros de função
function processar(numeros: number[]): void {
  // ...
}

// ✅ Propriedades de classe
class Lista {
  private itens: string[] = [];
}
```

### Quando Confiar em Inferência

```typescript
// ✅ Elementos presentes e tipo óbvio
let nums = [1, 2, 3]; // number[]
let texts = ["a", "b"]; // string[]

// ✅ Retorno de função
function getNumeros() {
  return [1, 2, 3]; // Inferido: number[]
}
```

---

## ⚠️ Limitações e Armadilhas

### Armadilha 1: Array Vazio sem Anotação

```typescript
// ❌ Perigoso: tipo any[]
let itens = [];
itens.push(1);
itens.push("texto"); // Permitido - any[] aceita qualquer coisa!

// ✅ Seguro: anotar tipo
let itens: number[] = [];
itens.push(1);
// itens.push("texto"); // ERRO!
```

### Armadilha 2: Const não Previne Mutação de Conteúdo

```typescript
const numeros: number[] = [1, 2, 3];

numeros.push(4);    // OK! Modifica conteúdo
numeros[0] = 10;    // OK! Modifica conteúdo
// const previne apenas reatribuição da REFERÊNCIA

// Para imutabilidade, use ReadonlyArray
const numeros: ReadonlyArray<number> = [1, 2, 3];
// numeros.push(4);    // ERRO!
// numeros[0] = 10;    // ERRO!
```

### Armadilha 3: Acesso Out of Bounds

```typescript
let numeros: number[] = [1, 2, 3];

let valor = numeros[10]; // undefined (TypeScript não previne!)
// Tipo de 'valor': number (mas valor real é undefined)

// TypeScript não verifica bounds em tempo de compilação
// Use optional chaining ou verificações manuais
let valorSeguro = numeros[10] ?? 0; // 0 se undefined
```

---

## 🔗 Interconexões Conceituais

### Relação com Generics

Arrays são o exemplo mais comum de **tipos genéricos**:

```typescript
// Array é um tipo genérico
type MeuArray<T> = T[];

let nums: MeuArray<number> = [1, 2, 3];
let strs: MeuArray<string> = ["a", "b"];
```

### Relação com Tuplas

Tuplas são arrays com **tipo e comprimento fixos**:

```typescript
// Array: comprimento variável, tipo homogêneo
let numeros: number[] = [1, 2, 3, 4, 5];

// Tupla: comprimento fixo, tipos por posição
let pessoa: [string, number] = ["Ana", 25];
```

### Relação com ReadonlyArray

```typescript
// Array mutável
let mutavel: number[] = [1, 2, 3];
mutavel.push(4);

// Array imutável
let imutavel: ReadonlyArray<number> = [1, 2, 3];
// imutavel.push(4); // ERRO!
```

---

## 🚀 Próximos Conceitos

Após dominar declaração de arrays:
1. **Arrays com múltiplos tipos** (`(string | number)[]`)
2. **Arrays de objetos** (tipagem de estruturas complexas)
3. **Readonly arrays** (imutabilidade)
4. **Array methods tipados** (generics em ação)
5. **Tuplas** (arrays com tipos fixos)

---

## 📚 Conclusão

A declaração de arrays em TypeScript une a **flexibilidade dinâmica do JavaScript** com a **segurança de tipos do TypeScript**. As duas sintaxes (`T[]` e `Array<T>`) oferecem a mesma funcionalidade, permitindo escolha baseada em contexto e preferência.

A **inferência automática de tipos** reduz verbosidade enquanto mantém type safety. Para arrays vazios ou quando tipo não é óbvio, **anotações explícitas** são essenciais.

Dominar tipagem de arrays é fundamental para todo código TypeScript, pois arrays são onipresentes em aplicações reais - desde manipulação de dados de APIs até renderização de listas em UI.
