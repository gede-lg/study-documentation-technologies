# Rest Elements em Tuplas TypeScript

## 🎯 Introdução

**Rest elements** em tuplas permitem capturar **quantidade variável de elementos do mesmo tipo** em posições finais, combinando precisão posicional com flexibilidade de array.

## 📋 Conceitos Fundamentais

### Sintaxe de Rest Elements

```typescript
// Sintaxe: ...Tipo[] no final da tupla
type ListaComHeader = [header: string, ...items: number[]];

let lista: ListaComHeader = ["Números", 1, 2, 3, 4, 5]; // ✅ OK
let lista2: ListaComHeader = ["Vazio"]; // ✅ OK (zero elementos rest)
```

### Posicionamento de Rest Elements

Rest elements **devem vir no final** da tupla (ou após elementos opcionais):

```typescript
// ✅ OK: rest no final
type Valido = [string, ...number[]];

// ❌ Erro: rest não pode estar no início ou meio
type Invalido = [...number[], string]; // Erro em versões antigas

// ✅ OK desde TypeScript 4.0: rest no início
type ValidoModerno = [...number[], string];

// ✅ OK desde TypeScript 4.2: rest no meio
type MuitoFlexivel = [boolean, ...string[], number];
```

## 🧠 Fundamentos Teóricos

### Rest Elements Capturam Array

Rest elements expandem para array de comprimento variável:

```typescript
type TuplaRest = [string, ...number[]];

let t1: TuplaRest = ["texto"]; // rest = []
let t2: TuplaRest = ["texto", 1]; // rest = [1]
let t3: TuplaRest = ["texto", 1, 2, 3]; // rest = [1, 2, 3]

// Destructuring captura rest
const [cabecalho, ...numeros] = t3;
// cabecalho: string, numeros: number[]
```

### Tipos Posicionais + Array Variável

Rest combina **type safety posicional** com **flexibilidade de coleção**:

```typescript
type CSV = [id: number, nome: string, ...extras: string[]];

function processarCSV(linha: CSV) {
  const [id, nome, ...campos] = linha;
  // id: number (tipado precisamente)
  // nome: string (tipado precisamente)
  // campos: string[] (array de tamanho variável)
  
  console.log(`ID: ${id}, Nome: ${nome}`);
  console.log(`Extras: ${campos.join(", ")}`);
}

processarCSV([1, "Ana", "email@example.com", "SP", "Brasil"]);
```

### Rest Elements com Tipos Union

```typescript
type Mixed = [boolean, ...(string | number)[]];

let m1: Mixed = [true, 1, "texto", 2, "outro"]; // ✅ OK
let m2: Mixed = [false]; // ✅ OK

// Rest pode ser array de união
const [flag, ...resto] = m1;
// flag: boolean, resto: (string | number)[]
```

### Multiple Rest Elements (TypeScript 4.0+)

```typescript
// Rest no início e final
type Wrapped = [...string[], number, ...boolean[]];

let w: Wrapped = ["a", "b", 42, true, false]; // ✅ OK

// Rest no meio
type Middle = [string, ...number[], boolean];

let mid: Middle = ["texto", 1, 2, 3, true]; // ✅ OK
```

## 🔍 Análise Conceitual Profunda

### Variadic Tuple Types

Rest elements permitem **tuplas variádicas** - tamanho determinado por tipo genérico:

```typescript
// Adicionar elemento ao final de tupla genérica
type Append<T extends any[], U> = [...T, U];

type Original = [string, number];
type ComBoolean = Append<Original, boolean>;
// Tipo: [string, number, boolean]

// Concatenar tuplas
type Concat<T extends any[], U extends any[]> = [...T, ...U];

type Tupla1 = [string, number];
type Tupla2 = [boolean, symbol];
type Combinada = Concat<Tupla1, Tupla2>;
// Tipo: [string, number, boolean, symbol]
```

### Spread em Chamadas de Função

```typescript
type Args = [x: number, y: number, ...rest: number[]];

function soma(x: number, y: number, ...rest: number[]): number {
  return x + y + rest.reduce((a, b) => a + b, 0);
}

let args: Args = [1, 2, 3, 4, 5];

// ✅ Spread type-safe
soma(...args); // OK! TypeScript valida compatibilidade
```

### Type Inference com Rest

```typescript
function criarTupla<T extends any[]>(...elementos: T): T {
  return elementos;
}

// Inferência mantém tipo preciso
let tupla = criarTupla("texto", 42, true);
// Tipo: [string, number, boolean]

// Sem generics: perderia precisão
function semGenerics(...elementos: any[]): any[] {
  return elementos;
}

let tuplaGenerica = semGenerics("texto", 42, true);
// Tipo: any[] (menos preciso)
```

### Rest Elements com Readonly

```typescript
type ReadonlyRest = readonly [string, ...number[]];

let t: ReadonlyRest = ["texto", 1, 2, 3];

// ❌ Imutável
t[0] = "novo"; // Erro: readonly
t.push(4); // Erro: push não existe

// ✅ Pode ler
const [texto, ...numeros] = t; // OK
```

## 🎯 Aplicabilidade

### Funções com Argumentos Variáveis

```typescript
// Função com primeiro argumento obrigatório + rest
type LogArgs = [message: string, ...data: any[]];

function log(...args: LogArgs) {
  const [message, ...data] = args;
  console.log(`[LOG] ${message}`, ...data);
}

log("Erro ocorreu"); // ✅ OK
log("Usuário criado", { id: 1, nome: "Ana" }); // ✅ OK
log("Valores:", 1, 2, 3, 4); // ✅ OK
```

### Dados Tabulares com Colunas Variáveis

```typescript
type LinhaCSV = [id: number, nome: string, ...campos: string[]];

const dados: LinhaCSV[] = [
  [1, "Ana Silva", "ana@email.com", "SP"],
  [2, "Bruno Costa", "bruno@email.com", "RJ", "Brasil", "Extra"],
  [3, "Carlos", "carlos@email.com"]
];

dados.forEach(([id, nome, ...extras]) => {
  console.log(`${id}: ${nome} - ${extras.length} campos extras`);
});
```

### Headers + Items Pattern

```typescript
type Lista<T> = [header: string, ...items: T[]];

let numeros: Lista<number> = ["Números Primos", 2, 3, 5, 7, 11];
let palavras: Lista<string> = ["Frutas", "maçã", "banana", "laranja"];

function exibirLista<T>(lista: Lista<T>) {
  const [titulo, ...itens] = lista;
  console.log(`${titulo}:`);
  itens.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
}

exibirLista(numeros);
exibirLista(palavras);
```

### Event Handlers com Payloads

```typescript
type EventHandler<T extends any[]> = [event: string, ...payload: T];

function emit<T extends any[]>(...args: EventHandler<T>) {
  const [event, ...payload] = args;
  console.log(`Evento: ${event}, Dados:`, payload);
}

emit("user:created", { id: 1, nome: "Ana" }); // ✅ OK
emit("data:updated", "campo1", "campo2", 42); // ✅ OK
```

## ⚠️ Limitações

### Rest Deve Ser Array Homogêneo

Rest element deve ser array de tipo único (ou união):

```typescript
// ✅ OK: rest de tipo único
type Valido = [string, ...number[]];

// ✅ OK: rest de união
type ValidoUnion = [string, ...(number | boolean)[]];

// ❌ Não pode ter rest de tupla heterogênea
// type Invalido = [string, ...[number, boolean]]; // Erro de sintaxe
```

### Posicionamento Restrito (antes TS 4.0)

Versões antigas só permitiam rest no final:

```typescript
// ✅ OK em todas versões
type Final = [string, ...number[]];

// ✅ OK apenas TypeScript 4.0+
type Inicio = [...number[], string];
type Meio = [boolean, ...string[], number];
```

### Inference com Multiple Rests é Complexa

```typescript
type Multi = [...string[], number, ...boolean[]];

// TypeScript pode ter dificuldade inferindo automaticamente
function processar<T extends any[]>(...args: Multi) {
  // Inference pode ser imprecisa em casos complexos
}
```

## 🔗 Interconexões

### Com Spread Operator

```typescript
type Tupla1 = [string, number];
type Tupla2 = [boolean, ...Tupla1];

// Spread em valores
let t1: Tupla1 = ["texto", 42];
let t2: Tupla2 = [true, ...t1];
// t2: [true, "texto", 42]
```

### Com Generics e Type Manipulation

```typescript
// Extrair primeiro elemento
type First<T extends any[]> = T extends [infer F, ...any[]]
  ? F
  : never;

type Teste1 = First<[string, number, boolean]>; // string

// Extrair resto
type Tail<T extends any[]> = T extends [any, ...infer R]
  ? R
  : [];

type Teste2 = Tail<[string, number, boolean]>; // [number, boolean]

// Reverter tupla (recursivo)
type Reverse<T extends any[]> = T extends [infer F, ...infer R]
  ? [...Reverse<R>, F]
  : [];

type Teste3 = Reverse<[1, 2, 3, 4]>; // [4, 3, 2, 1]
```

### Com Parâmetros de Função

```typescript
// Capturar tipos de parâmetros como tupla com rest
function variadicFunc(a: string, b: number, ...rest: boolean[]) {}

type Params = Parameters<typeof variadicFunc>;
// Tipo: [a: string, b: number, ...rest: boolean[]]
```

## 📚 Conclusão

Rest elements adicionam **flexibilidade de array** a tuplas mantendo **type safety posicional**. Permitem:

✅ Quantidade variável de elementos após posições fixas  
✅ Type-safe destructuring com rest  
✅ Composição de tuplas (concat, append)  
✅ Modelagem de funções variádicas  

Use rest elements quando:
- Primeiras posições têm significado específico
- Elementos restantes são homogêneos
- Comprimento total é desconhecido
- Precisa combinar precisão + flexibilidade

Desde TypeScript 4.0+:
- Rest pode vir no **início, meio ou fim**
- Múltiplos rest elements possíveis
- **Variadic tuple types** para manipulação avançada

Rest elements bridge tuplas rígidas e arrays flexíveis, criando estruturas poderosas e type-safe.
