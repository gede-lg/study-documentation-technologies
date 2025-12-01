# Tuplas em TypeScript: Arrays de Tamanho Fixo com Tipos Posicionais

## 🎯 Introdução

**Tuplas** são **arrays de tamanho fixo** onde cada **posição** tem um **tipo específico**. Diferem de arrays normais pela **estrutura rígida** e **tipagem posicional**.

## 📋 Conceitos Fundamentais

### Declaração de Tuplas

```typescript
// Tupla básica: [string, number]
let usuario: [string, number];
usuario = ["Ana", 25];     // ✅ válido
usuario = [25, "Ana"];     // ❌ ordem errada
usuario = ["Ana"];         // ❌ falta elemento

// Array normal vs Tupla
let arrayNormal: number[] = [1, 2, 3, 4, 5];  // tamanho variável
let tupla: [number, number] = [1, 2];         // exatamente 2 números
```

### Tipos Posicionais

```typescript
// Cada posição tem tipo específico
let dados: [string, number, boolean];
dados = ["texto", 42, true];

// Acesso tipado por índice
let nome: string = dados[0];   // string
let idade: number = dados[1];   // number
let ativo: boolean = dados[2];  // boolean

// TypeScript conhece tipo de cada posição
dados[0].toUpperCase();  // ✅ método de string
dados[1].toFixed(2);     // ✅ método de number
dados[2] && console.log("ativo");  // ✅ operador boolean
```

## 🧠 Características de Tuplas

### Tuplas Readonly

```typescript
// Tupla mutável
let mutavel: [string, number] = ["Ana", 25];
mutavel[0] = "Bruno";  // ✅ permitido
mutavel.push("extra");  // ⚠️ TypeScript permite (bug conhecido!)

// Tupla readonly: imutável
let imutavel: readonly [string, number] = ["Ana", 25];
imutavel[0] = "Bruno";  // ❌ erro: índice readonly
imutavel.push("extra");  // ❌ erro: push não existe em readonly
```

### Elementos Opcionais

```typescript
// Tupla com elemento opcional
let coordenadas: [number, number, number?];

coordenadas = [10, 20];       // ✅ 2D (z opcional)
coordenadas = [10, 20, 30];   // ✅ 3D (z fornecido)

// Tipo do elemento opcional: number | undefined
let z: number | undefined = coordenadas[2];

// Múltiplos opcionais
let config: [string, number?, boolean?];
config = ["app"];           // ✅
config = ["app", 3000];     // ✅
config = ["app", 3000, true];  // ✅
```

### Rest Elements em Tuplas

```typescript
// Rest element: captura elementos restantes
let lista: [string, ...number[]];
lista = ["cabeçalho", 1, 2, 3, 4, 5];  // ✅

// Rest no meio (TypeScript 4.2+)
let complexo: [boolean, ...string[], number];
complexo = [true, "a", "b", "c", 42];  // ✅

// Múltiplos tipos no rest
let misto: [string, ...(number | boolean)[]];
misto = ["inicio", 1, true, 2, false];  // ✅
```

### Labeled Tuples (TypeScript 4.0+)

```typescript
// Tupla sem labels: confuso
let semLabel: [string, number, boolean];

// Tupla com labels: clara
let comLabel: [nome: string, idade: number, ativo: boolean];
comLabel = ["Ana", 25, true];

// Labels são documentação (não afetam tipo)
let coord1: [x: number, y: number];
let coord2: [number, number];
// coord1 e coord2 são compatíveis!

// Labels em opcionais e rest
type Config = [
  app: string,
  porta?: number,
  ...flags: boolean[]
];
```

## 🎯 Casos de Uso

### Retorno de Múltiplos Valores

```typescript
// Função retornando tupla
function dividir(a: number, b: number): [quociente: number, resto: number] {
  return [Math.floor(a / b), a % b];
}

let [quoc, resto] = dividir(17, 5);
// quoc = 3, resto = 2

// useState no React (padrão de tupla)
type UseStateReturn<T> = [state: T, setState: (value: T) => void];

function useState<T>(inicial: T): UseStateReturn<T> {
  let state = inicial;
  const setState = (value: T) => { state = value; };
  return [state, setState];
}

let [contador, setContador] = useState(0);
```

### Dados Estruturados Fixos

```typescript
// Registro de log
type LogEntry = [
  timestamp: Date,
  level: "INFO" | "WARN" | "ERROR",
  message: string
];

let logs: LogEntry[] = [
  [new Date(), "INFO", "Sistema iniciado"],
  [new Date(), "ERROR", "Falha de conexão"]
];

// Coordenadas geográficas
type LatLng = [latitude: number, longitude: number];
let localizacao: LatLng = [-23.5505, -46.6333];  // São Paulo

// RGB/RGBA cores
type RGB = [red: number, green: number, blue: number];
type RGBA = [red: number, green: number, blue: number, alpha: number];

let cor: RGB = [255, 0, 0];  // vermelho
let corTransparente: RGBA = [255, 0, 0, 0.5];
```

### Padrões CSV/Dados Tabulares

```typescript
// Linha de CSV como tupla
type CsvRow = [id: number, nome: string, email: string, idade: number];

let dados: CsvRow[] = [
  [1, "Ana Silva", "ana@example.com", 25],
  [2, "Bruno Costa", "bruno@example.com", 30]
];

// Processar com tipos seguros
dados.forEach(([id, nome, email, idade]) => {
  console.log(`${id}: ${nome} (${idade} anos) - ${email}`);
});
```

## ⚠️ Diferenças: Tupla vs Array vs Object

```typescript
// 1. TUPLA: tamanho fixo, tipos posicionais
let tupla: [string, number] = ["Ana", 25];
tupla[0];  // string
tupla[1];  // number

// 2. ARRAY: tamanho variável, tipo único
let array: string[] = ["Ana", "Bruno", "Carlos"];
array[0];  // string
array[1];  // string
array[999];  // string | undefined (runtime)

// 3. OBJETO: propriedades nomeadas
let objeto = { nome: "Ana", idade: 25 };
objeto.nome;   // string
objeto.idade;  // number

// Quando usar cada um?
// Tupla: dados relacionados, ordem importa, quantidade fixa
// Array: coleção homogênea, tamanho variável
// Objeto: propriedades nomeadas, autoexplicativo
```

## 🔧 Destructuring com Tuplas

```typescript
// Destructuring posicional
let ponto: [number, number, number] = [10, 20, 30];
let [x, y, z] = ponto;

// Ignorar elementos
let [primeiro, , terceiro] = ponto;  // pula segundo

// Rest em destructuring
let numeros: [number, number, ...number[]] = [1, 2, 3, 4, 5];
let [a, b, ...resto] = numeros;
// a = 1, b = 2, resto = [3, 4, 5]

// Com tipos explícitos
let dados: [string, number] = ["Ana", 25];
let nomeUsuario: string;
let idadeUsuario: number;
[nomeUsuario, idadeUsuario] = dados;
```

## ⚠️ Limitações e Armadilhas

### Armadilha 1: Métodos de Array Não Verificados

```typescript
let tupla: [string, number] = ["Ana", 25];

// ⚠️ push/pop funcionam mas quebram contrato de tupla!
tupla.push("extra");  // TypeScript permite (problema conhecido)
console.log(tupla);   // ["Ana", 25, "extra"] - não é mais tupla válida!

// Solução: usar readonly
let segura: readonly [string, number] = ["Ana", 25];
segura.push("extra");  // ❌ erro de compilação
```

### Armadilha 2: Acesso Fora dos Limites

```typescript
let tupla: [string, number] = ["Ana", 25];

// TypeScript não impede acesso fora dos limites em runtime
let terceiro = tupla[2];  // undefined em runtime, mas TypeScript não avisa!
console.log(terceiro);    // undefined

// Solução: usar length ou validação runtime
if (tupla.length > 2) {
  let terceiro = tupla[2];
}
```

### Armadilha 3: Conversão para Array

```typescript
let tupla: [string, number] = ["Ana", 25];

// Passar tupla onde array é esperado: perde tipo posicional
function processarArray(arr: (string | number)[]) {
  // arr[0] agora é string | number (perdeu precisão)
}

processarArray(tupla);  // tupla vira array genérico

// Tupla preserva tipo apenas quando tipo esperado é tupla
function processarTupla(t: [string, number]) {
  // t[0] é string, t[1] é number
}
```

## 🔗 Interconexões

### Tuplas e Type Inference

```typescript
// Inferência: array, não tupla
let inferido = ["Ana", 25];
// Tipo: (string | number)[] (array genérico!)

// Forçar tupla com 'as const'
let comConst = ["Ana", 25] as const;
// Tipo: readonly ["Ana", 25] (tupla literal readonly!)

// Inferência em funções
function retornarDados() {
  return ["Ana", 25];  // retorna (string | number)[]
}

function retornarTupla(): [string, number] {
  return ["Ana", 25];  // retorna [string, number]
}
```

### Tuplas e Generics

```typescript
// Generic que retorna tupla
function par<T, U>(primeiro: T, segundo: U): [T, U] {
  return [primeiro, segundo];
}

let resultado = par("texto", 42);
// Tipo: [string, number]

// Tupla genérica variável
type Tripla<T, U, V> = [T, U, V];
let tripla: Tripla<string, number, boolean> = ["Ana", 25, true];
```

## 📚 Conclusão

Tuplas são **arrays de tamanho e tipo fixos**, úteis para **retornos múltiplos**, **dados estruturados simples** e **coleções heterogêneas ordenadas**. Use **readonly** para segurança, **labels** para clareza, e prefira **objetos** quando nomes de propriedades melhorarem legibilidade.

TypeScript oferece **elementos opcionais**, **rest elements** e **labeled tuples** para flexibilidade, mas tenha cuidado com **métodos de array** que podem quebrar o contrato de tupla.
