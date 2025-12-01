# Type Inference com Genéricos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Type inference com genéricos** (inferência de tipos genéricos) é o processo pelo qual TypeScript **deduz automaticamente** os type parameters de função genérica baseado nos argumentos passados, eliminando necessidade de especificação explícita. Conceitualmente, representa **type inference contextual**, onde compilador analisa valores para determinar tipos mais específicos possíveis.

Na essência, type inference genérica materializa o princípio de **tipos implícitos sem perda de precisão**, onde desenvolvedor obtém type safety completo sem verbosidade sintática.

## 📋 Fundamentos

### Sintaxe Explícita vs. Inferida

```typescript
function identidade<T>(valor: T): T {
  return valor;
}

// Explícito - especifica tipo manualmente
identidade<number>(42);
identidade<string>("hello");

// Inferido - TypeScript deduz tipo do argumento
identidade(42);        // T inferido como number
identidade("hello");   // T inferido como string
identidade([1, 2, 3]); // T inferido como number[]
```

**Vantagem:** Código mais conciso mantendo type safety.

### Como Funciona a Inferência

```typescript
function primeiro<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = primeiro([1, 2, 3]);      // T = number
const str = primeiro(["a", "b"]);     // T = string
const bool = primeiro([true, false]); // T = boolean

// TypeScript analisa:
// - Argumento: [1, 2, 3] tem tipo number[]
// - Parâmetro: arr: T[]
// - Conclusão: T deve ser number
```

## 🔍 Análise Conceitual

### 1. Inferência com Múltiplos Parâmetros

```typescript
function mapear<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// TypeScript infere T e U
const strings = mapear([1, 2, 3], n => n.toString());
// T = number (de [1, 2, 3])
// U = string (retorno de n.toString())

const booleanos = mapear([1, 2, 3], n => n > 2);
// T = number
// U = boolean
```

**Conceito:** TypeScript infere múltiplos type parameters analisando todos argumentos e suas relações.

### 2. Inferência Bidirecional

```typescript
function processar<T>(valor: T, callback: (x: T) => void): void {
  callback(valor);
}

processar(42, n => {
  // n é number - inferido de valor: 42
  console.log(n * 2);
});

processar("hello", s => {
  // s é string - inferido de valor: "hello"
  console.log(s.toUpperCase());
});
```

**Conceito:** Tipo inferido de um argumento influencia tipo de outros argumentos (flow de tipos).

### 3. Inferência com Constraints

```typescript
function tamanho<T extends { length: number }>(valor: T): number {
  return valor.length;
}

tamanho("hello");   // T = string
tamanho([1, 2, 3]); // T = number[]
tamanho({ length: 5, nome: "teste" }); // T = { length: number; nome: string }
// tamanho(42); // Erro - não satisfaz constraint
```

### 4. Inferência Literal vs. Widening

```typescript
function criar<T>(valor: T): T {
  return valor;
}

const a = criar("hello");      // T = string (widened)
const b = criar("hello" as const); // T = "hello" (literal)

const c = criar(42);           // T = number (widened)
const d = criar(42 as const);  // T = 42 (literal)
```

**Conceito:** TypeScript por padrão faz "widening" (alargamento) de tipos literais para tipos gerais. Use `as const` para preservar literais.

### 5. Inferência com Arrays

```typescript
function ultimo<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

ultimo([1, 2, 3]);         // T = number
ultimo(["a", "b", "c"]);   // T = string

// Array misto - união
ultimo([1, "a", true]);    // T = string | number | boolean
```

### 6. Best Common Type

```typescript
function combinar<T>(a: T, b: T): T[] {
  return [a, b];
}

combinar(1, 2);        // T = number
combinar("a", "b");    // T = string

// Tipos diferentes - TypeScript busca tipo comum
combinar(1, "a");      // Erro - não há tipo comum
combinar<number | string>(1, "a"); // OK - explícito
```

## 🎯 Aplicabilidade

### Promise Genérica

```typescript
function aguardar<T>(promise: Promise<T>): Promise<T> {
  return promise.then(resultado => {
    console.log("Resolvido:", resultado);
    return resultado;
  });
}

// T inferido automaticamente
aguardar(fetch("/api").then(r => r.json())); // T = any
aguardar(Promise.resolve(42));               // T = number
aguardar(Promise.resolve("hello"));          // T = string
```

### Filter Type-Safe

```typescript
function filtrar<T>(arr: T[], predicado: (item: T) => boolean): T[] {
  return arr.filter(predicado);
}

const numeros = [1, 2, 3, 4, 5];
const pares = filtrar(numeros, n => n % 2 === 0);
// T = number inferido
// pares: number[]
```

### Compose Functions

```typescript
function compor<A, B, C>(
  f: (x: B) => C,
  g: (x: A) => B
): (x: A) => C {
  return x => f(g(x));
}

const toString = (n: number) => n.toString();
const tamanho = (s: string) => s.length;

const fn = compor(tamanho, toString);
// A = number, B = string, C = number (todos inferidos)

fn(123); // 3
```

## ⚠️ Quando Inferência Falha

### 1. Contexto Insuficiente

```typescript
function criar<T>(): T {
  return {} as T; // TypeScript não sabe qual T usar
}

// Erro - não pode inferir T
// const obj = criar();

// OK - especificado explicitamente
const obj = criar<{ nome: string }>();
```

### 2. Ambiguidade

```typescript
function processar<T>(valor?: T): T | undefined {
  return valor;
}

// T não pode ser inferido de undefined
const resultado = processar(); // Erro ou T = unknown
```

### 3. Quando Forçar Tipo Específico

```typescript
function array<T>(...items: T[]): T[] {
  return items;
}

// Inferência pode ser muito específica
const a = array(1, 2, 3); // T = number

// Forçar união quando necessário
const b = array<number | string>(1, "a"); // T = number | string
```

## 🎯 Boas Práticas

### 1. Confiar na Inferência Quando Possível

```typescript
// ❌ Verboso desnecessário
mapear<number, string>([1, 2, 3], n => n.toString());

// ✅ Conciso e igualmente type-safe
mapear([1, 2, 3], n => n.toString());
```

### 2. Especificar Explicitamente em Casos Ambíguos

```typescript
// Quando inferência não é óbvia
const misto = combinar<number | string>(1, "a");
```

### 3. Usar Type Annotations para Clareza

```typescript
// Anotar callback para melhor autocomplete
mapear([1, 2, 3], (n: number) => n.toString());
```

## 📚 Conclusão

Type inference com genéricos permite TypeScript deduzir automaticamente type parameters de argumentos, eliminando necessidade de especificação explícita na maioria dos casos. É essencial para código conciso e ergonômico mantendo type safety completo, representando equilíbrio entre conveniência e precisão de tipos.
