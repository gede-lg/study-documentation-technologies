# Tipos Condicionais Recursivos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Tipos condicionais recursivos** são tipos condicionais que **referenciam a si mesmos** em sua definição, permitindo processar estruturas de dados aninhadas de profundidade arbitrária. Conceitualmente, são o equivalente a funções recursivas aplicadas ao sistema de tipos, onde um tipo se define em termos de si mesmo para casos menores, seguindo o padrão **caso base + caso recursivo**.

Na essência, recursividade de tipos transforma o sistema de tipos em uma **linguagem de programação funcional completa**, capaz de processar estruturas complexas através de decomposição recursiva. É a materialização do princípio de **definição indutiva de tipos**, onde estruturas complexas são processadas quebrando-as em partes menores até atingir um caso base.

### Contexto Histórico e Motivação

Recursividade em tipos condicionais tornou-se viável com melhorias no **TypeScript 4.1 (novembro de 2020)**, que removeu limitações anteriores e introduziu **tail-call optimization** para tipos.

**Problema histórico:**

Antes do TypeScript 4.1, recursão profunda causava erros:

```typescript
// TypeScript 3.x - erro após ~40 níveis
type Profundo<T, N> = N extends 0 ? T : Profundo<T[], Decrement<N>>;
// Error: Type instantiation is excessively deep and possibly infinite
```

**Motivação:**

1. **Estruturas Aninhadas:** Processar objetos/arrays profundamente aninhados
2. **Transformações Complexas:** Aplicar operações recursivamente em toda estrutura
3. **Type-safe JSON:** Validar estruturas JSON arbitrariamente profundas
4. **Flatten/Unflatten:** Achatar ou desachatar estruturas
5. **Path Types:** Criar tipos baseados em caminhos de propriedades

### Problema Fundamental que Resolve

Tipos recursivos resolvem o problema de **processar estruturas de profundidade desconhecida**:

```typescript
// ❌ Sem recursão - limitado a níveis fixos
type Flatten2<T> = T extends (infer E)[]
  ? E extends (infer F)[]
    ? F // Apenas 2 níveis
    : E
  : T;

// ✅ Com recursão - profundidade arbitrária
type DeepFlatten<T> = T extends (infer E)[]
  ? DeepFlatten<E>  // Recursão!
  : T;

type R1 = DeepFlatten<number[][][]>;  // number
```

## 📋 Fundamentos

### Anatomia de Tipo Recursivo

```typescript
type Recursivo<T> = T extends CondicaoBase
  ? TipoBase                    // Caso base - para recursão
  : TransformaEChama<Recursivo<MenorT>>; // Caso recursivo
```

**Componentes:**

- **Caso Base:** Condição que para a recursão
- **Caso Recursivo:** Referência ao próprio tipo com argumento menor
- **Redução:** Cada chamada recursiva deve ser "menor" que a anterior

### Padrão Clássico

```typescript
type Countdown<N extends number, Acc extends any[] = []> =
  Acc['length'] extends N
    ? Acc                           // Caso base
    : Countdown<N, [...Acc, any]>;  // Caso recursivo

type Cinco = Countdown<5>; // [any, any, any, any, any]
```

## 🔍 Análise Conceitual Profunda

### 1. Deep Flatten (Achatamento Profundo)

```typescript
type DeepFlatten<T> = T extends readonly (infer E)[]
  ? DeepFlatten<E>  // Recursão até não ser mais array
  : T;              // Caso base - não é array

type R1 = DeepFlatten<number>;           // number
type R2 = DeepFlatten<number[]>;         // number
type R3 = DeepFlatten<number[][]>;       // number
type R4 = DeepFlatten<number[][][]>;     // number
type R5 = DeepFlatten<[[[string]]]>;     // string
```

**Conceito:** Recursão remove camadas de arrays até atingir tipo não-array.

### 2. Deep Readonly (Imutabilidade Profunda)

```typescript
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type Original = {
  a: string;
  b: {
    c: number;
    d: {
      e: boolean;
    };
  };
};

type Imutavel = DeepReadonly<Original>;
// {
//   readonly a: string;
//   readonly b: {
//     readonly c: number;
//     readonly d: {
//       readonly e: boolean;
//     };
//   };
// }
```

**Conceito:** Aplica `readonly` recursivamente a todas as propriedades em todos os níveis.

### 3. Deep Partial (Opcional Profundo)

```typescript
type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

type Config = {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
};

type ConfigOpcional = DeepPartial<Config>;
// Todas as propriedades em todos os níveis tornam-se opcionais
```

### 4. Path (Caminhos de Propriedades)

```typescript
type Paths<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? Paths<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

type Obj = {
  user: {
    name: string;
    address: {
      street: string;
      city: string;
    };
  };
};

type ObjPaths = Paths<Obj>;
// "user" | "user.name" | "user.address" | "user.address.street" | "user.address.city"
```

**Conceito:** Gera union de todos os caminhos possíveis em um objeto aninhado.

### 5. Deep Unwrap Promise

```typescript
type DeepUnwrapPromise<T> = T extends Promise<infer U>
  ? DeepUnwrapPromise<U>  // Recursão até não ser Promise
  : T;

type P1 = DeepUnwrapPromise<Promise<string>>;
// string

type P2 = DeepUnwrapPromise<Promise<Promise<Promise<number>>>>;
// number
```

### 6. JSON Type (Type-safe JSON)

```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

type DeepJSON<T> = T extends JSONValue
  ? T
  : T extends object
  ? { [K in keyof T]: DeepJSON<T[K]> }
  : never;

// Valida que tipo é serializável como JSON
type Valido = DeepJSON<{ a: string; b: number }>;  // OK
type Invalido = DeepJSON<{ fn: () => void }>;      // never em fn
```

### 7. Tuple to Union (Recursivo)

```typescript
type TupleToUnion<T extends readonly any[]> = T extends readonly [
  infer First,
  ...infer Rest
]
  ? First | TupleToUnion<Rest>  // Recursão sobre resto da tupla
  : never;                       // Caso base - tupla vazia

type R = TupleToUnion<[string, number, boolean]>;
// string | number | boolean
```

## 🎯 Aplicabilidade e Contextos

### 1. Validação de Estruturas Complexas

```typescript
type ValidateConfig<T> = T extends { [key: string]: ValidateConfig<any> }
  ? { [K in keyof T]: ValidateConfig<T[K]> }
  : T extends string | number | boolean
  ? T
  : never;
```

### 2. Transformações de API Response

```typescript
type ApiResponse<T> = {
  data: T;
  meta: { timestamp: number };
};

type DeepApiResponse<T> = T extends object
  ? { [K in keyof T]: DeepApiResponse<T[K]> }
  : ApiResponse<T>;
```

### 3. ORM/Database Schema Types

```typescript
type DeepRelations<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends { id: any }
        ? DeepRelations<T[K]>
        : T[K];
    }
  : T;
```

## ⚠️ Limitações e Considerações

### 1. Limite de Profundidade

TypeScript tem limite de recursão (~50 níveis em versões antigas, melhorado em 4.1+):

```typescript
type Profundo<N> = N extends 0
  ? "base"
  : Profundo<Decrement<N>>;

// Pode atingir limite se N muito grande
```

### 2. Performance de Compilação

Recursão profunda pode tornar compilação lenta:

```typescript
type Complexo<T> = /* muita recursão */;
// Pode aumentar tempo de compilação significativamente
```

### 3. Tail Recursion

TypeScript 4.1+ otimiza tail recursion, mas estrutura deve ser tail-recursive:

```typescript
// ✅ Tail recursive - otimizado
type Tail<T, Acc = []> = T extends [infer First, ...infer Rest]
  ? Tail<Rest, [...Acc, First]>
  : Acc;

// ❌ Não tail recursive - sem otimização
type NonTail<T> = T extends [infer First, ...infer Rest]
  ? [First, ...NonTail<Rest>]
  : [];
```

### 4. Circular References

Cuidado com referências circulares infinitas:

```typescript
// ❌ Infinito - nunca atinge caso base
type Infinito<T> = { nested: Infinito<T> };
```

## 🔗 Interconexões Conceituais

Tipos recursivos conectam-se com:

- **Conditional Types:** Base para expressões recursivas
- **`infer` Keyword:** Extrai componentes para processar recursivamente
- **Mapped Types:** Aplicar transformações recursivamente
- **Template Literal Types:** Construir strings recursivamente
- **Utility Types:** Muitos beneficiam de recursão (`DeepPartial`, `DeepReadonly`)

## 🚀 Evolução e Próximos Conceitos

Dominar recursividade de tipos prepara para:

1. **Type-level Programming Avançado:** DSLs de tipos
2. **Parser Types:** Tipos que parseiam strings
3. **Validator Types:** Validação complexa em compile-time
4. **Meta-frameworks:** Ferramentas que geram tipos automaticamente

## 📚 Conclusão

Tipos condicionais recursivos são a feature mais poderosa do sistema de tipos TypeScript, permitindo processar estruturas arbitrariamente profundas através de decomposição recursiva. São essenciais para transformações complexas, validação de estruturas aninhadas e criação de utility types avançados.

Compreender recursividade de tipos é dominar a programação funcional no nível de tipos, onde estruturas complexas são processadas através do padrão fundamental de caso base + caso recursivo, transformando o sistema de tipos em uma linguagem de computação completa.
