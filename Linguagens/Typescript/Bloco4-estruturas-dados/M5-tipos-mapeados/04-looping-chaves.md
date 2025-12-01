# Looping Sobre Chaves em TypeScript com Mapped Types

## 🎯 Introdução

**Looping sobre chaves** em mapped types usa a sintaxe `[K in keyof T]` para **iterar sobre cada propriedade** de um tipo, aplicando transformações uniformemente. É **metaprogramação declarativa** em nível de tipo.

## 📋 Conceitos Fundamentais

### Sintaxe de Iteração

```typescript
// Template de mapped type
type MappedType<T> = {
  [K in keyof T]: Transformação;
};

// K é a variável de iteração (cada chave)
// keyof T gera união de chaves para iterar
// Para cada K, aplica transformação
```

### Exemplo Básico

```typescript
type Usuario = {
  nome: string;
  idade: number;
  email: string;
};

// Iterar e transformar todas propriedades em string
type UsuarioStrings = {
  [K in keyof Usuario]: string;
};
// Resultado: { nome: string; idade: string; email: string }

// Iterar e transformar em arrays
type UsuarioArrays = {
  [K in keyof Usuario]: Usuario[K][];
};
// Resultado: { nome: string[]; idade: number[]; email: string[] }
```

## 🧠 Fundamentos Teóricos

### Como a Iteração Funciona

TypeScript processa mapped types em etapas:

```typescript
type Exemplo<T> = {
  [K in keyof T]: T[K] | null;
};

type Original = { a: string; b: number };

// Passo 1: keyof Original → "a" | "b"
// Passo 2: Para K = "a": Original["a"] | null → string | null
// Passo 3: Para K = "b": Original["b"] | null → number | null
// Passo 4: Resultado: { a: string | null; b: number | null }
```

### Acesso Indexado Durante Iteração

```typescript
// T[K] acessa tipo da propriedade K em T
type Original = {
  nome: string;
  idade: number;
  ativo: boolean;
};

type Wrapper<T> = {
  [K in keyof T]: { value: T[K]; timestamp: Date };
};

type OriginalWrapped = Wrapper<Original>;
// {
//   nome: { value: string; timestamp: Date };
//   idade: { value: number; timestamp: Date };
//   ativo: { value: boolean; timestamp: Date };
// }
```

### Preservação vs Transformação de Chaves

```typescript
// Preservar chaves: K usado diretamente
type Preserve<T> = {
  [K in keyof T]: T[K];
};

// Transformar chaves: usar key remapping
type TransformKeys<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Original = { nome: string; idade: number };

type Preservado = Preserve<Original>;
// { nome: string; idade: number }

type Transformado = TransformKeys<Original>;
// { getNome: () => string; getIdade: () => number }
```

## 🔍 Análise Conceitual Profunda

### Transformações Durante Iteração

#### Adicionar Nullable

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Usuario = { nome: string; idade: number };
type UsuarioNullable = Nullable<Usuario>;
// { nome: string | null; idade: number | null }
```

#### Transformar Tipos Específicos

```typescript
type StringsToNumbers<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};

type Mixed = { a: string; b: number; c: string; d: boolean };
type Transformed = StringsToNumbers<Mixed>;
// { a: number; b: number; c: number; d: boolean }
```

#### Promisificar Propriedades

```typescript
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type Sync = {
  carregar: string;
  salvar: number;
  deletar: boolean;
};

type Async = Promisify<Sync>;
// {
//   carregar: Promise<string>;
//   salvar: Promise<number>;
//   deletar: Promise<boolean>;
// }
```

### Iteração com Conditional Types

```typescript
// Filtrar propriedades por tipo do valor
type FilterByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type Mixed = {
  nome: string;
  idade: number;
  ativo: boolean;
  email: string;
  quantidade: number;
};

type ApenasStrings = FilterByValueType<Mixed, string>;
// { nome: string; email: string }

type ApenasNumbers = FilterByValueType<Mixed, number>;
// { idade: number; quantidade: number }
```

### Nested Mapping (Recursivo)

```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

type Nested = {
  usuario: {
    nome: string;
    endereco: {
      rua: string;
      numero: number;
    };
  };
  config: {
    tema: string;
  };
};

type ReadonlyNested = DeepReadonly<Nested>;
// Todas propriedades aninhadas são readonly recursivamente
```

### Múltiplas Transformações Encadeadas

```typescript
type Usuario = { nome: string; idade: number; email: string };

// Encadear transformações
type Transformado = Readonly<Partial<Nullable<Usuario>>>;
// readonly { nome?: string | null; idade?: number | null; email?: string | null }

// Ordem importa!
// 1. Nullable: adiciona | null
// 2. Partial: adiciona ?
// 3. Readonly: adiciona readonly
```

## 🎯 Aplicabilidade

### State Management

```typescript
type Estado = {
  contador: number;
  usuario: { nome: string; email: string };
  configuracoes: { tema: string };
};

// Gerar action creators automaticamente
type ActionCreators<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type EstadoActions = ActionCreators<Estado>;
// {
//   setContador: (value: number) => void;
//   setUsuario: (value: { nome: string; email: string }) => void;
//   setConfiguracoes: (value: { tema: string }) => void;
// }
```

### Form Handling

```typescript
type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

// Estado de cada campo
type FieldState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

type FormState = FieldState<FormFields>;
// {
//   nome: { value: string; error: string | null; touched: boolean };
//   email: { value: string; error: string | null; touched: boolean };
//   ...
// }
```

### API Client Type-Safe

```typescript
type Endpoints = {
  "/users": { id: number; nome: string }[];
  "/products": { id: number; titulo: string; preco: number }[];
  "/orders": { id: number; total: number }[];
};

// Gerar métodos de API
type ApiClient<T> = {
  [K in keyof T]: {
    get: () => Promise<T[K]>;
    post: (data: T[K]) => Promise<T[K]>;
  };
};

type Client = ApiClient<Endpoints>;
// {
//   "/users": { get: () => Promise<...>; post: (data: ...) => Promise<...> };
//   "/products": { get: () => Promise<...>; post: (data: ...) => Promise<...> };
//   ...
// }
```

### Event Emitters

```typescript
type Events = {
  "user:login": { userId: number; timestamp: Date };
  "user:logout": { userId: number };
  "data:update": { id: string; data: any };
};

// Gerar listeners tipados
type EventListeners<T> = {
  [K in keyof T]: Array<(payload: T[K]) => void>;
};

type Listeners = EventListeners<Events>;
// {
//   "user:login": Array<(payload: { userId: number; timestamp: Date }) => void>;
//   "user:logout": Array<(payload: { userId: number }) => void>;
//   ...
// }
```

## ⚠️ Limitações

### Não Pode Adicionar Propriedades Novas

```typescript
// ❌ Mapped types não podem adicionar propriedades inexistentes
type ComExtra<T> = {
  [K in keyof T]: T[K];
  extra: string; // ❌ Erro de sintaxe
};

// ✅ Use intersection
type ComExtraCorreto<T> = {
  [K in keyof T]: T[K];
} & {
  extra: string;
};
```

### Performance com Tipos Grandes

```typescript
// ⚠️ Muitas propriedades + transformações complexas = lento
type Enorme = { /* 1000+ propriedades */ };

type MuitasTransformacoes = Readonly<Partial<Nullable<Required<Enorme>>>>;
// Pode ser lento para compilar
```

### Limitações com Index Signatures

```typescript
type WithIndex = {
  [key: string]: number;
  especifica: string;
};

type Mapeado = {
  [K in keyof WithIndex]: WithIndex[K] | null;
};
// Index signature pode ter comportamento inesperado
```

## 🔗 Interconexões

### Com Key Remapping (TS 4.1+)

```typescript
type RemapKeys<T> = {
  [K in keyof T as `${string & K}_novo`]: T[K];
};

type Original = { nome: string; idade: number };
type Remapeado = RemapKeys<Original>;
// { nome_novo: string; idade_novo: number }
```

### Com Template Literal Types

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type Usuario = { nome: string; idade: number };

type UsuarioGetters = Getters<Usuario>;
// { getNome: () => string; getIdade: () => number }

type UsuarioSetters = Setters<Usuario>;
// { setNome: (value: string) => void; setIdade: (value: number) => void }
```

### Com Union Distribution

```typescript
type ToArray<T> = {
  [K in keyof T]: T[K][];
};

type A = { a: string };
type B = { b: number };

type Union = ToArray<A | B>;
// { a: string[] } | { b: number[] }
// Distribuído sobre união!
```

## 📚 Conclusão

Looping sobre chaves com **[K in keyof T]** permite:

✅ Iterar sistematicamente sobre propriedades  
✅ Aplicar transformações uniformes  
✅ Criar tipos derivados automaticamente  
✅ Manter DRY em transformações de tipo  
✅ Type-safe metaprogramming  

Use looping quando:
- Precisa transformar todas propriedades igualmente
- Quer gerar variantes de tipos (readonly, partial, etc.)
- Deseja automatizar criação de tipos relacionados
- Necessita aplicar padrão a múltiplas propriedades

Looping em mapped types é **fundação de utility types** e essencial para programação avançada em TypeScript.
