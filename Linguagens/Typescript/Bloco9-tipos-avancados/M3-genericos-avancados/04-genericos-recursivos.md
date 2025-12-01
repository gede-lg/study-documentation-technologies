# Genéricos Recursivos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Genéricos recursivos** referem-se a **tipos genéricos que se referenciam a si mesmos** em sua definição, criando estruturas de tipo que podem representar hierarquias aninhadas arbitrariamente profundas. Conceitualmente, representa **recursive type construction**, onde tipo se define em termos de si próprio, permitindo modelar árvores, listas encadeadas, JSON profundo e outras estruturas recursivas.

Na essência, materializa o princípio de **self-similarity em tipos**, onde estrutura pode conter versões menores de si mesma, essencial para dados hierárquicos e operações recursivas type-safe.

## 📋 Fundamentos

### Tipos Recursivos Básicos

```typescript
// Tipo recursivo simples: árvore
type Tree<T> = {
  value: T;
  children: Tree<T>[];
};

// Uso
const tree: Tree<number> = {
  value: 1,
  children: [
    { value: 2, children: [] },
    {
      value: 3,
      children: [
        { value: 4, children: [] }
      ]
    }
  ]
};

// JSON recursivo
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

const data: Json = {
  nome: "Ana",
  idade: 25,
  ativo: true,
  tags: ["typescript", "programming"],
  config: {
    nested: {
      deep: "valor"
    }
  }
};
```

**Conceito-chave:** Tipo se refere a si mesmo, permitindo profundidade arbitrária.

### Funções com Tipos Recursivos

```typescript
// Função que trabalha com tipo recursivo
function mapTree<T, R>(
  tree: Tree<T>,
  fn: (value: T) => R
): Tree<R> {
  return {
    value: fn(tree.value),
    children: tree.children.map(child => mapTree(child, fn))
  };
}

// Uso
const numTree: Tree<number> = {
  value: 1,
  children: [
    { value: 2, children: [] },
    { value: 3, children: [] }
  ]
};

const strTree = mapTree(numTree, n => n.toString());
// strTree: Tree<string>
```

## 🔍 Análise Conceitual

### 1. Deep Readonly/Partial

```typescript
// DeepReadonly: torna tudo readonly recursivamente
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
}

const config: DeepReadonly<Config> = {
  server: {
    host: "localhost",
    port: 3000,
    ssl: {
      enabled: true,
      cert: "/path/to/cert"
    }
  }
};

// config.server.host = "outro"; // ❌ Erro: readonly
// config.server.ssl.enabled = false; // ❌ Erro: readonly profundo

// DeepPartial: torna tudo opcional recursivamente
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

const partial: DeepPartial<Config> = {
  server: {
    ssl: {
      enabled: true
      // cert opcional!
    }
    // host e port opcionais!
  }
};
```

### 2. Lista Encadeada

```typescript
// Lista encadeada tipada
type LinkedList<T> = {
  value: T;
  next: LinkedList<T> | null;
};

// Criar lista
function createList<T>(...values: T[]): LinkedList<T> | null {
  if (values.length === 0) return null;

  const [first, ...rest] = values;
  return {
    value: first,
    next: createList(...rest)
  };
}

// Percorrer lista
function* iterateList<T>(list: LinkedList<T> | null): Generator<T> {
  let current = list;
  while (current !== null) {
    yield current.value;
    current = current.next;
  }
}

// Uso
const list = createList(1, 2, 3, 4);
for (const value of iterateList(list)) {
  console.log(value);
}
```

### 3. Path em Objetos Aninhados

```typescript
// Tipo que extrai caminhos válidos de objeto aninhado
type Paths<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? Paths<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

interface User {
  id: number;
  profile: {
    name: string;
    address: {
      street: string;
      city: string;
    };
  };
}

type UserPaths = Paths<User>;
// "id" | "profile" | "profile.name" | "profile.address" |
// "profile.address.street" | "profile.address.city"

// Função type-safe para acessar path
function getPath<T, P extends Paths<T>>(obj: T, path: P): any {
  const keys = (path as string).split(".");
  let result: any = obj;

  for (const key of keys) {
    result = result[key];
  }

  return result;
}

const user: User = {
  id: 1,
  profile: {
    name: "Ana",
    address: {
      street: "Rua A",
      city: "São Paulo"
    }
  }
};

const city = getPath(user, "profile.address.city"); // "São Paulo"
// const invalid = getPath(user, "profile.invalid"); // ❌ Erro
```

### 4. Flatten (Achatar) Tipos Aninhados

```typescript
// Achatar arrays aninhados
type Flatten<T> = T extends Array<infer U>
  ? Flatten<U>
  : T;

type Nested = number[][][];
type Flat = Flatten<Nested>;
// number

// Flatten objetos
type FlattenObject<T> = T extends object
  ? { [K in keyof T]: FlattenObject<T[K]> }
  : T;

// Uso em função
function flatten<T extends any[]>(arr: T): Flatten<T>[] {
  const result: any[] = [];

  function helper(item: any) {
    if (Array.isArray(item)) {
      item.forEach(helper);
    } else {
      result.push(item);
    }
  }

  helper(arr);
  return result;
}

const nested = [1, [2, [3, [4]]]];
const flat = flatten(nested); // number[]
```

### 5. Promises Aninhadas (Awaited)

```typescript
// Unwrap Promises recursivamente
type Awaited<T> = T extends Promise<infer U>
  ? Awaited<U>
  : T;

type P1 = Promise<number>;
type R1 = Awaited<P1>; // number

type P2 = Promise<Promise<string>>;
type R2 = Awaited<P2>; // string

type P3 = Promise<Promise<Promise<boolean>>>;
type R3 = Awaited<P3>; // boolean

// Função com unwrap automático
async function resolve<T>(value: T): Promise<Awaited<T>> {
  while (value instanceof Promise) {
    value = await value as any;
  }
  return value as Awaited<T>;
}
```

## 🎯 Aplicabilidade

### Component Tree (React-like)

```typescript
type Component<P = {}> = {
  props: P;
  children: Component[];
};

function renderTree<P>(component: Component<P>): void {
  console.log(component.props);
  component.children.forEach(renderTree);
}

const tree: Component<{ title: string }> = {
  props: { title: "App" },
  children: [
    {
      props: { title: "Header" },
      children: []
    },
    {
      props: { title: "Content" },
      children: [
        { props: { title: "Article" }, children: [] }
      ]
    }
  ]
};

renderTree(tree);
```

### File System

```typescript
type FileSystemNode<T> =
  | { type: "file"; name: string; content: T }
  | { type: "directory"; name: string; children: FileSystemNode<T>[] };

function findFile<T>(
  root: FileSystemNode<T>,
  name: string
): T | null {
  if (root.type === "file") {
    return root.name === name ? root.content : null;
  }

  for (const child of root.children) {
    const found = findFile(child, name);
    if (found !== null) return found;
  }

  return null;
}

const fs: FileSystemNode<string> = {
  type: "directory",
  name: "root",
  children: [
    { type: "file", name: "readme.md", content: "# README" },
    {
      type: "directory",
      name: "src",
      children: [
        { type: "file", name: "index.ts", content: "console.log('hi')" }
      ]
    }
  ]
};

const content = findFile(fs, "index.ts");
```

### Deep Merge

```typescript
type DeepMerge<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] extends object
        ? U[K] extends object
          ? DeepMerge<T[K], U[K]>
          : U[K]
        : U[K]
      : T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

function deepMerge<T extends object, U extends object>(
  obj1: T,
  obj2: U
): DeepMerge<T, U> {
  const result: any = { ...obj1 };

  for (const key in obj2) {
    if (
      typeof obj2[key] === "object" &&
      !Array.isArray(obj2[key]) &&
      key in result
    ) {
      result[key] = deepMerge(result[key], obj2[key]);
    } else {
      result[key] = obj2[key];
    }
  }

  return result;
}
```

### Schema Validation

```typescript
type Schema<T> = {
  [K in keyof T]: T[K] extends object
    ? Schema<T[K]>
    : { type: string; required: boolean };
};

function validateSchema<T>(value: any, schema: Schema<T>): value is T {
  // Validação recursiva
  for (const key in schema) {
    const fieldSchema = schema[key];

    if (typeof fieldSchema === "object" && "type" in fieldSchema) {
      // Campo primitivo
      if (fieldSchema.required && !(key in value)) {
        return false;
      }
    } else {
      // Campo objeto - recursão
      if (!validateSchema(value[key], fieldSchema)) {
        return false;
      }
    }
  }

  return true;
}
```

## ⚠️ Considerações

### 1. Limite de Recursão

```typescript
// TypeScript tem limite de profundidade (~45-50 níveis)
// Recursão muito profunda pode causar erro

type DeepArray = any[][][][][]...[]; // Eventualmente falha

// Use com moderação e documente limites
```

### 2. Performance de Compilação

```typescript
// Tipos recursivos complexos podem deixar compilação lenta
// Especialmente com unions grandes e múltiplas recursões

// ❌ Pode ser lento
type Complex<T> = T extends object
  ? { [K in keyof T]: Complex<T[K]> | Complex<T[K]>[] }
  : T;

// ✅ Simplifique quando possível
type Simpler<T> = T extends object
  ? { [K in keyof T]: Simpler<T[K]> }
  : T;
```

### 3. Tail Recursion

```typescript
// TypeScript não otimiza tail recursion
// Cuidado com tipos que recursam indefinidamente

// Tipo recursivo com caso base
type SafeRecursive<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends object
  ? { [K in keyof T]: SafeRecursive<T[K], Decrement<Depth>> }
  : T;

type Decrement<N extends number> = /* implementação */;
```

## 📚 Conclusão

Genéricos recursivos permitem tipos que se referenciam a si mesmos, modelando estruturas hierárquicas de profundidade arbitrária. Essenciais para árvores, listas encadeadas, DeepReadonly/DeepPartial, paths em objetos aninhados, component trees e file systems. TypeScript tem limite de profundidade de recursão (~45-50). Use com moderação - recursão complexa pode impactar performance de compilação. Sempre defina caso base para evitar recursão infinita. Combine com conditional types e mapped types para tipos utilitários profundos.
