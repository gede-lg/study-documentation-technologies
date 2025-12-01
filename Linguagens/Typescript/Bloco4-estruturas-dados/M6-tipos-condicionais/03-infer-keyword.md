# Infer Keyword em Tipos Condicionais: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`infer` keyword** é uma feature avançada de tipos condicionais que permite **extrair e capturar tipos** de estruturas complexas durante a verificação de compatibilidade. Conceitualmente, `infer` funciona como uma **variável de tipo** que o TypeScript deduz automaticamente baseado na estrutura sendo testada, permitindo capturar partes de tipos complexos para uso posterior.

Na essência, `infer` transforma tipos condicionais em ferramentas de **pattern matching** e **extração de tipos**, similar a destructuring de objetos mas operando no nível de tipos. É a materialização do conceito de **tipos como padrões**, onde você especifica a forma esperada e deixa o TypeScript inferir os componentes específicos.

### Contexto Histórico e Motivação

`infer` foi introduzido junto com tipos condicionais no **TypeScript 2.8 (março de 2018)** como resposta à necessidade de extrair tipos de estruturas genéricas.

**Problema histórico:**

Antes de `infer`, era impossível extrair tipos de estruturas complexas sem conhecimento prévio:

```typescript
// Impossível sem infer: extrair tipo de retorno de função
type ReturnType<T> = ???; // Como extrair tipo de retorno?

// Overloads complexos eram necessários
function obterRetorno<R>(fn: () => R): R;
function obterRetorno<R>(fn: (a: any) => R): R;
// ... infinitos overloads
```

**Motivação:**

1. **Extração de Tipos:** Capturar componentes de tipos complexos
2. **Pattern Matching:** Verificar estrutura e extrair partes simultaneamente
3. **Utility Types Poderosos:** Criar ferramentas como `ReturnType<T>`, `Parameters<T>`
4. **Type-level Destructuring:** Decompor tipos complexos em partes
5. **Metaprogramação:** Habilitar transformações de tipos sofisticadas

### Problema Fundamental que Resolve

`infer` resolve o problema de **extrair tipos desconhecidos de estruturas conhecidas**:

```typescript
// ❌ Sem infer - impossível
type RetornoImpossivel<T> = T extends (...args: any[]) => ??? ? ??? : never;

// ✅ Com infer - possível
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = ReturnType<() => string>;  // string
type R2 = ReturnType<() => number>;  // number
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
T extends Pattern<infer U> ? U : Fallback
```

**Componentes:**

- **`infer U`:** Declara variável de tipo `U` que será inferida
- **`Pattern<infer U>`:** Padrão onde `U` será capturado
- **`? U`:** Usa o tipo inferido no ramo verdadeiro
- **`: Fallback`:** Tipo quando padrão não casa

### Como Funciona Internamente

TypeScript tenta "encaixar" o tipo `T` no padrão, inferindo valores para variáveis `infer`:

```typescript
type PrimeiroElemento<T> = T extends [infer First, ...any[]] ? First : never;

type T1 = PrimeiroElemento<[string, number, boolean]>;
// TypeScript tenta: [string, number, boolean] extends [infer First, ...any[]]
// Infere: First = string
// Retorna: string

type T2 = PrimeiroElemento<[]>;
// [] não casa com [infer First, ...any[]]
// Retorna: never
```

## 🔍 Análise Conceitual Profunda

### 1. Extrair Tipo de Retorno de Função

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type R1 = ReturnType<() => string>;                  // string
type R2 = ReturnType<(x: number) => boolean>;        // boolean
type R3 = ReturnType<(a: string, b: number) => void>; // void
type R4 = ReturnType<string>;                        // never - não é função
```

**Conceito:** `infer R` captura o tipo de retorno da função, seja qual for.

### 2. Extrair Tipos de Parâmetros

```typescript
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type P1 = Parameters<(a: string, b: number) => void>;
// [a: string, b: number] - tupla dos parâmetros

type P2 = Parameters<() => void>;
// []

type P3 = Parameters<(x: number) => void>;
// [x: number]
```

**Conceito:** `infer P` captura todos os parâmetros como tupla.

### 3. Extrair Tipo de Elemento de Array

```typescript
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type E1 = ArrayElement<string[]>;           // string
type E2 = ArrayElement<number[]>;           // number
type E3 = ArrayElement<(string | number)[]>; // string | number
type E4 = ArrayElement<string>;             // never - não é array
```

**Conceito:** `infer E` captura o tipo dos elementos do array.

### 4. Extrair Tipo de Promise

```typescript
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type U1 = Unwrap<Promise<string>>;  // string
type U2 = Unwrap<Promise<number>>;  // number
type U3 = Unwrap<string>;           // string - passa direto
```

**Conceito:** Extrai tipo interno de Promise, ou retorna tipo original se não for Promise.

### 5. Múltiplos `infer` na Mesma Condição

```typescript
type PrimeiroEUltimo<T> = T extends [infer First, ...any[], infer Last]
  ? [First, Last]
  : never;

type R1 = PrimeiroEUltimo<[1, 2, 3, 4]>;
// [1, 4]

type R2 = PrimeiroEUltimo<["a", "b"]>;
// ["a", "b"]

type R3 = PrimeiroEUltimo<[string]>;
// [string, string] - primeiro e último são o mesmo
```

**Conceito:** Múltiplos `infer` em um padrão capturam partes diferentes.

### 6. `infer` em Posições Covariantes vs Contravariantes

```typescript
// Covariante (tipo de retorno) - inferência única
type CovRetorno<T> = T extends () => infer R ? R : never;

// Contravariante (parâmetros) - intersection quando múltiplos
type Contra<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;

type C1 = Contra<{ a: (x: string) => void; b: (x: number) => void }>;
// string & number (intersection - impossível, resulta em never)

type C2 = Contra<{ a: (x: string) => void; b: (x: string) => void }>;
// string
```

**Conceito:** Comportamento de inferência muda baseado em variância de posição.

### 7. `infer` Aninhado

```typescript
type DeepUnwrap<T> = T extends Promise<infer U>
  ? U extends Promise<infer V>
    ? V
    : U
  : T;

type D1 = DeepUnwrap<Promise<Promise<string>>>;  // string
type D2 = DeepUnwrap<Promise<number>>;           // number
type D3 = DeepUnwrap<string>;                    // string
```

**Conceito:** `infer` pode ser usado recursivamente para desembrulhar estruturas aninhadas.

## 🎯 Aplicabilidade e Contextos

### 1. Utility Types Built-in

```typescript
// ReturnType
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// Parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// ConstructorParameters
type ConstructorParameters<T> = T extends new (...args: infer P) => any
  ? P
  : never;

// InstanceType
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : any;
```

### 2. Flattening (Achatamento) de Arrays

```typescript
type Flatten<T> = T extends (infer E)[] ? E : T;

type F1 = Flatten<string[]>;      // string
type F2 = Flatten<number[][]>;    // number[] - achata um nível
```

### 3. Extração de Propriedades

```typescript
type GetProperty<T, K> = K extends keyof T
  ? T[K]
  : never;

type PropType<T> = T extends { prop: infer P } ? P : never;

type Obj = { prop: number };
type P = PropType<Obj>; // number
```

### 4. Unwrapping de Wrappers

```typescript
type Unwrap<T> =
  T extends Promise<infer U> ? U :
  T extends Array<infer U> ? U :
  T;

type U1 = Unwrap<Promise<string>>;  // string
type U2 = Unwrap<number[]>;         // number
type U3 = Unwrap<boolean>;          // boolean
```

## ⚠️ Limitações e Considerações

### 1. `infer` Apenas em Ramo `extends`

```typescript
// ✅ Correto - infer no padrão
type OK<T> = T extends (infer U)[] ? U : never;

// ❌ Erro - infer no ramo verdadeiro
type Errado<T> = T extends any[] ? infer U : never;
```

### 2. Inferência em Posições Contravariantes Cria Intersection

```typescript
type Contra<T> = T extends {
  fn1: (arg: infer A) => void;
  fn2: (arg: infer A) => void;
} ? A : never;

type C = Contra<{
  fn1: (arg: string) => void;
  fn2: (arg: number) => void;
}>;
// string & number → never (impossível)
```

### 3. Ambiguidade com Múltiplos `infer` com Mesmo Nome

Em posições covariantes (retorno), cria union. Em contravariantes (parâmetros), cria intersection:

```typescript
// Covariante - union
type Cov<T> = T extends { a: infer U; b: infer U } ? U : never;
type C1 = Cov<{ a: string; b: number }>; // string | number

// Contravariante - intersection
type Contra<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
} ? U : never;
type C2 = Contra<{ a: (x: string) => void; b: (x: number) => void }>;
// string & number → never
```

## 🔗 Interconexões Conceituais

`infer` conecta-se com:

- **Conditional Types:** Base para usar `infer`
- **Pattern Matching:** Conceito similar de destructuring
- **Generics:** `infer` cria type parameters implícitos
- **Utility Types:** Fundamenta `ReturnType`, `Parameters`, etc.
- **Mapped Types:** Frequentemente usados juntos

## 🚀 Evolução e Próximos Conceitos

Dominar `infer` prepara para:

1. **Conditional Types Recursivos:** `infer` em estruturas recursivas
2. **Template Literal Types:** `infer` com padrões de string
3. **Tipos Avançados:** Transformações complexas de tipos
4. **Metaprogramação Completa:** Criar DSLs de tipos

## 📚 Conclusão

`infer` keyword é ferramenta fundamental para programação avançada de tipos, permitindo extrair e capturar tipos de estruturas complexas através de pattern matching. É essencial para criar utility types poderosos, desembrulhar wrappers e realizar transformações sofisticadas no sistema de tipos.

Compreender `infer` é dominar a arte de pattern matching no nível de tipos, onde estruturas complexas são decompostas e seus componentes extraídos para reutilização e transformação.
