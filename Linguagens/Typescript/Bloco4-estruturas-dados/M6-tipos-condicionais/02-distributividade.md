# Tipos Condicionais Distribuídos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Distributividade** (distributive conditional types) é um comportamento automático onde tipos condicionais aplicados a **union types** são distribuídos sobre cada membro da union individualmente. Conceitualmente, é a transformação de `ConditionalType<A | B | C>` em `ConditionalType<A> | ConditionalType<B> | ConditionalType<C>`, onde a condição é aplicada a cada tipo separadamente e os resultados são unidos novamente.

Na essência, distributividade transforma tipos condicionais em **operações map sobre unions**, aplicando a lógica condicional elemento por elemento, similar ao método `.map()` em arrays. É a materialização do princípio de **composição através de unions**, onde operações complexas são decompostas em transformações simples por tipo.

### Problema Fundamental que Resolve

Distributividade permite operar sobre cada membro de uma union type individualmente:

```typescript
// Sem distributividade (comportamento manual)
type Filtrar<T> = T extends string ? T : never;
type Resultado = Filtrar<string> | Filtrar<number> | Filtrar<boolean>;
// string | never | never → string

// Com distributividade (automático)
type ResultadoAuto = Filtrar<string | number | boolean>;
// string - aplicação distribuída automaticamente
```

## 📋 Fundamentos

### Como Funciona

Quando um tipo condicional recebe uma **naked type parameter** (parâmetro de tipo "nu", sem wrapper) que é uma union, o TypeScript distribui automaticamente:

```typescript
type Wrapper<T> = T extends string ? `str:${T}` : `other:${T & string}`;

// Union type como entrada
type Resultado = Wrapper<"a" | "b" | 42>;

// TypeScript distribui automaticamente:
// Wrapper<"a"> | Wrapper<"b"> | Wrapper<42>
// `str:a` | `str:b` | `other:42`
```

**Conceito:** Cada membro da union é testado individualmente, resultados são unidos.

### Condição para Distributividade

Distributividade ocorre SOMENTE quando:

1. O tipo testado é um **naked type parameter** (`T`, não `T[]` ou `[T]`)
2. O tipo é uma **union type**

```typescript
// ✅ Distribui - T é naked
type Dist<T> = T extends string ? true : false;
type R1 = Dist<string | number>; // true | false

// ❌ Não distribui - T está wrapped em array
type NaoDist<T> = [T] extends [string] ? true : false;
type R2 = NaoDist<string | number>; // false
```

## 🔍 Análise Conceitual Profunda

### 1. Filtragem de Tipos

```typescript
type RemoverNull<T> = T extends null | undefined ? never : T;

type Original = string | number | null | undefined | boolean;
type Limpo = RemoverNull<Original>;
// string | number | boolean

// Processo de distribuição:
// RemoverNull<string> → string
// RemoverNull<number> → number
// RemoverNull<null> → never
// RemoverNull<undefined> → never
// RemoverNull<boolean> → boolean
// Resultado: string | number | never | never | boolean → string | number | boolean
```

**Conceito:** `never` em union desaparece, criando efeito de filtro.

### 2. Transformação de Cada Membro

```typescript
type ToArray<T> = T extends any ? T[] : never;

type Nums = ToArray<string | number | boolean>;
// string[] | number[] | boolean[]

// Distribuição:
// ToArray<string> → string[]
// ToArray<number> → number[]
// ToArray<boolean> → boolean[]
```

**Conceito:** Cada tipo da union é transformado independentemente.

### 3. Utilitário Built-in: `Exclude<T, U>`

```typescript
// Implementação interna do TypeScript
type Exclude<T, U> = T extends U ? never : T;

type Exemplo = Exclude<"a" | "b" | "c", "a">;
// "b" | "c"

// Distribuição:
// "a" extends "a" → never
// "b" extends "a" → "b"
// "c" extends "a" → "c"
// Resultado: never | "b" | "c" → "b" | "c"
```

### 4. Utilitário Built-in: `Extract<T, U>`

```typescript
// Implementação interna
type Extract<T, U> = T extends U ? T : never;

type Exemplo = Extract<"a" | "b" | "c", "a" | "b">;
// "a" | "b"

// Distribuição:
// "a" extends "a" | "b" → "a"
// "b" extends "a" | "b" → "b"
// "c" extends "a" | "b" → never
```

### 5. Utilitário Built-in: `NonNullable<T>`

```typescript
// Implementação interna
type NonNullable<T> = T extends null | undefined ? never : T;

type Limpo = NonNullable<string | null | number | undefined>;
// string | number
```

### 6. Evitando Distributividade

Use wrappers quando não quiser distribuição:

```typescript
// Distribui
type Dist<T> = T extends string ? true : false;
type R1 = Dist<string | number>; // true | false

// Não distribui - wrapped em tupla
type NaoDist<T> = [T] extends [string] ? true : false;
type R2 = NaoDist<string | number>; // false

// Não distribui - wrapped em array
type NaoDistArray<T> = T[] extends string[] ? true : false;
type R3 = NaoDistArray<string | number>; // false
```

**Conceito:** Wrapper quebra o "naked type parameter", evitando distribuição.

### 7. Uso com `never`

```typescript
type SemFuncoes<T> = T extends Function ? never : T;

type Tipos = string | number | (() => void) | boolean;
type Filtrado = SemFuncoes<Tipos>;
// string | number | boolean

// (() => void) extends Function → never
```

## 🎯 Aplicabilidade e Contextos

### 1. Filtragem de Union Types

```typescript
type SomenteStrings<T> = T extends string ? T : never;

type Entrada = "a" | 42 | "b" | true | "c";
type Saida = SomenteStrings<Entrada>;
// "a" | "b" | "c"
```

### 2. Mapeamento de Tipos

```typescript
type Promisify<T> = T extends any ? Promise<T> : never;

type Original = string | number | boolean;
type Promisificado = Promisify<Original>;
// Promise<string> | Promise<number> | Promise<boolean>
```

### 3. Validação Distribuída

```typescript
type EhPrimitivo<T> = T extends string | number | boolean | null | undefined
  ? T
  : never;

type Misturado = string | { a: 1 } | number | null;
type Primitivos = EhPrimitivo<Misturado>;
// string | number | null
```

### 4. Construindo Utility Types Customizados

```typescript
type PickByType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
};

interface Usuario {
  id: number;
  nome: string;
  idade: number;
  ativo: boolean;
}

type NumericKeys = PickByType<Usuario, number>;
// { id: number; idade: number }
```

## ⚠️ Limitações e Considerações

### 1. Distributividade Nem Sempre Desejada

```typescript
// Problema: distribui quando não queremos
type TestaUnion<T> = T extends string | number ? true : false;

type R = TestaUnion<string | number>; // true - distribui!
// Esperávamos testar a union completa

// Solução: wrapper
type TestaUnionCorreto<T> = [T] extends [string | number] ? true : false;
type R2 = TestaUnionCorreto<string | number>; // true
type R3 = TestaUnionCorreto<string | boolean>; // false
```

### 2. Performance com Unions Grandes

Distribuir sobre unions muito grandes pode impactar performance de compilação:

```typescript
type UnionGigante = "a" | "b" | "c" | /* ... 100+ tipos */;
type Mapeado = Transform<UnionGigante>; // Pode ser lento
```

### 3. Ordem Não Garantida

A ordem dos membros na union resultante não é garantida:

```typescript
type R = Filtrar<"c" | "a" | "b">; // Pode ser "a" | "b" | "c" ou ordem diferente
```

## 🔗 Interconexões Conceituais

Distributividade conecta-se com:

- **Union Types:** Base para distribuição
- **Mapped Types:** Frequentemente usados juntos
- **Utility Types:** Muitos built-ins dependem de distributividade (`Exclude`, `Extract`, `NonNullable`)
- **Type Guards:** Versão runtime de filtragem de tipos

## 🚀 Evolução e Próximos Conceitos

Dominar distributividade prepara para:

1. **`infer` Keyword:** Extrair tipos durante distribuição
2. **Conditional Types Recursivos:** Distribuição em estruturas aninhadas
3. **Template Literal Types:** Distribuição com transformações de strings
4. **Mapped Types Avançados:** Combinação de distribuição e mapeamento

## 📚 Conclusão

Distributividade em tipos condicionais é mecanismo poderoso que permite aplicar transformações e filtros sobre union types automaticamente, tratando cada membro individualmente. É essencial para criar utility types robustos, filtrar tipos indesejados e transformar unions de forma elegante.

Compreender distributividade é dominar a natureza composicional do sistema de tipos TypeScript, onde operações complexas são decompostas em transformações simples aplicadas elemento por elemento.
