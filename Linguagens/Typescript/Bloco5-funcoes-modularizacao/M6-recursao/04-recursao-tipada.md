# Recursão com Tipos no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Recursão tipada** refere-se ao uso de **type annotations completas** em funções recursivas, garantindo type safety tanto nos casos base quanto recursivos. Conceitualmente, representa **contratos recursivos type-safe**, onde TypeScript verifica que cada nível da recursão mantém consistência de tipos.

## 📋 Fundamentos

### Type Annotations Básicas

```typescript
// Função recursiva com tipos explícitos
function fatorial(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

// Array recursivo
function somarArray(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr[0] + somarArray(arr.slice(1));
}
```

### Genéricos em Recursão

```typescript
// Função recursiva genérica
function achatar<T>(arr: (T | T[])[]): T[] {
  if (arr.length === 0) return [];

  const primeiro = arr[0];

  if (Array.isArray(primeiro)) {
    return [...achatar(primeiro), ...achatar(arr.slice(1))];
  }

  return [primeiro, ...achatar(arr.slice(1))];
}

achatar([1, [2, [3, 4]]]); // number[]
achatar(["a", ["b", "c"]]); // string[]
```

## 🔍 Análise Conceitual

### 1. Estruturas de Dados Recursivas

```typescript
// Nó de lista ligada
interface ListNode<T> {
  valor: T;
  proximo: ListNode<T> | null;
}

// Buscar com tipos
function buscar<T>(node: ListNode<T> | null, valor: T): boolean {
  if (node === null) return false;
  if (node.valor === valor) return true;
  return buscar(node.proximo, valor);
}

// Árvore binária
interface TreeNode<T> {
  valor: T;
  esquerda: TreeNode<T> | null;
  direita: TreeNode<T> | null;
}

function somarArvore(node: TreeNode<number> | null): number {
  if (node === null) return 0;
  return node.valor + somarArvore(node.esquerda) + somarArvore(node.direita);
}
```

### 2. Union Types em Recursão

```typescript
type JSON = string | number | boolean | null | JSON[] | { [key: string]: JSON };

function clonarJSON(valor: JSON): JSON {
  if (valor === null || typeof valor !== "object") {
    return valor; // Primitivos
  }

  if (Array.isArray(valor)) {
    return valor.map(clonarJSON); // Recursão em array
  }

  // Objeto
  const resultado: { [key: string]: JSON } = {};
  for (const chave in valor) {
    resultado[chave] = clonarJSON(valor[chave]);
  }
  return resultado;
}
```

### 3. Conditional Types Recursivos

```typescript
// Deep Readonly
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type Obj = {
  a: number;
  b: { c: string };
};

type ReadonlyObj = DeepReadonly<Obj>;
// { readonly a: number; readonly b: { readonly c: string } }
```

### 4. Type Guards em Recursão

```typescript
function ehNumero(valor: unknown): valor is number {
  return typeof valor === "number";
}

function somarProfundo(arr: unknown[]): number {
  if (arr.length === 0) return 0;

  const primeiro = arr[0];

  if (Array.isArray(primeiro)) {
    return somarProfundo(primeiro) + somarProfundo(arr.slice(1));
  }

  if (ehNumero(primeiro)) {
    return primeiro + somarProfundo(arr.slice(1));
  }

  return somarProfundo(arr.slice(1));
}
```

### 5. Inferência de Tipos

```typescript
// TypeScript infere tipo de retorno recursivo
function inverterArray<T>(arr: T[]): T[] {
  if (arr.length === 0) return [];
  return [...inverterArray(arr.slice(1)), arr[0]];
}

const numeros = inverterArray([1, 2, 3]); // number[]
const textos = inverterArray(["a", "b"]); // string[]
```

## 🎯 Aplicabilidade

### Validação Recursiva

```typescript
interface Schema {
  tipo: "string" | "number" | "objeto";
  propriedades?: { [key: string]: Schema };
}

function validar(valor: unknown, schema: Schema): boolean {
  if (schema.tipo === "string") {
    return typeof valor === "string";
  }

  if (schema.tipo === "number") {
    return typeof valor === "number";
  }

  if (schema.tipo === "objeto" && schema.propriedades) {
    if (typeof valor !== "object" || valor === null) return false;

    const obj = valor as { [key: string]: unknown };

    for (const chave in schema.propriedades) {
      if (!validar(obj[chave], schema.propriedades[chave])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
```

### Path Navigation

```typescript
type Path = string[];

function obterValor<T>(obj: T, path: Path): unknown {
  if (path.length === 0) return obj;

  const [primeiro, ...resto] = path;
  const valor = (obj as any)[primeiro];

  return obterValor(valor, resto);
}

const dados = { usuario: { nome: "Ana", idade: 25 } };
obterValor(dados, ["usuario", "nome"]); // "Ana"
```

## 📚 Conclusão

Recursão com tipos no TypeScript combina poder de recursão com type safety, garantindo consistência de tipos em todos os níveis. É essencial para estruturas recursivas (árvores, listas), transformações profundas e algoritmos recursivos type-safe.
