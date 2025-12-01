# Módulo 13: Never - Tipo que Nunca Ocorre

## 🎯 Introdução

O tipo **never** representa valores que **nunca devem ocorrer**. É usado para funções que nunca retornam, exhaustiveness checking e para eliminar possibilidades em unions types.

## 📋 Sumário

1. **Conceito**: O que é never
2. **Funções que Nunca Retornam**: throw e loops infinitos
3. **Exhaustiveness Checking**: Garantir cobertura completa
4. **Type Narrowing**: Eliminação de possibilidades
5. **Casos de Uso**: Aplicações práticas

## 🧠 Fundamentos

### Funções que Nunca Retornam

```typescript
// Função que lança erro - nunca retorna
function throwError(message: string): never {
    throw new Error(message);
}

// Loop infinito - nunca retorna
function infiniteLoop(): never {
    while (true) {
        console.log("Running...");
    }
}

// process.exit também nunca retorna
function exitProcess(): never {
    process.exit(1);
}
```

### Never em Type Narrowing

```typescript
function processValue(value: string | number) {
    if (typeof value === "string") {
        return value.toUpperCase();
    } else if (typeof value === "number") {
        return value.toFixed(2);
    } else {
        // value é never aqui - todas possibilidades eliminadas
        const exhaustiveCheck: never = value;
        throw new Error(`Unhandled type: ${exhaustiveCheck}`);
    }
}
```

## 🔍 Exhaustiveness Checking

### Com Discriminated Unions

```typescript
type Shape = 
    | { kind: "circle"; radius: number }
    | { kind: "square"; size: number }
    | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.size ** 2;
        case "rectangle":
            return shape.width * shape.height;
        default:
            // Se esquecer um caso, TypeScript detecta
            const _exhaustive: never = shape;
            throw new Error(`Unhandled shape: ${_exhaustive}`);
    }
}

// Se adicionar novo shape:
type ExtendedShape = Shape | { kind: "triangle"; base: number; height: number };

// TypeScript força atualização da função
function getExtendedArea(shape: ExtendedShape): number {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.size ** 2;
        case "rectangle":
            return shape.width * shape.height;
        // case "triangle": // Se comentar, erro em _exhaustive
        //     return (shape.base * shape.height) / 2;
        default:
            const _exhaustive: never = shape; // ❌ Erro se triangle não tratado
            throw new Error(`Unhandled shape: ${_exhaustive}`);
    }
}
```

### Em Condicionais

```typescript
type Status = "pending" | "approved" | "rejected";

function handleStatus(status: Status) {
    if (status === "pending") {
        console.log("Waiting for approval");
    } else if (status === "approved") {
        console.log("Approved!");
    } else if (status === "rejected") {
        console.log("Rejected");
    } else {
        // status é never - todos casos cobertos
        const _exhaustive: never = status;
        throw new Error(`Unknown status: ${_exhaustive}`);
    }
}
```

## 🎯 Aplicações Práticas

### Assertion Functions

```typescript
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

type Action = 
    | { type: "INCREMENT"; amount: number }
    | { type: "DECREMENT"; amount: number }
    | { type: "RESET" };

function reducer(state: number, action: Action): number {
    switch (action.type) {
        case "INCREMENT":
            return state + action.amount;
        case "DECREMENT":
            return state - action.amount;
        case "RESET":
            return 0;
        default:
            return assertNever(action); // Garante exhaustiveness
    }
}
```

### Intersecção Impossível

```typescript
// never em intersecções impossíveis
type Impossible = string & number; // never - impossível ser ambos

type OnlyString<T> = T extends string ? T : never;
type OnlyNumber<T> = T extends number ? T : never;

type StringsOnly = OnlyString<string | number | boolean>; // string
type NumbersOnly = OnlyNumber<string | number | boolean>; // number
```

### Filtragem de Tipos

```typescript
// Remover tipos de union
type NonNullable<T> = T extends null | undefined ? never : T;

type Example = NonNullable<string | null | undefined>; // string

// Filtrar propriedades
type FilterFlags<Base, Condition> = {
    [K in keyof Base]: Base[K] extends Condition ? never : K
}[keyof Base];

interface Example2 {
    name: string;
    age: number;
    active: boolean;
}

type NonBooleanKeys = FilterFlags<Example2, boolean>; // "name" | "age"
```

## ⚠️ Características Importantes

```typescript
// never é o tipo vazio - nenhum valor pode ser atribuído
let neverValue: never;
// neverValue = 1;          // ❌ Erro
// neverValue = "string";   // ❌ Erro
// neverValue = undefined;  // ❌ Erro

// never é subtipo de todos os tipos
let str: string = neverValue;    // ✓ OK (mas nunca acontece)
let num: number = neverValue;    // ✓ OK (mas nunca acontece)

// Mas nenhum tipo (exceto never) é atribuível a never
let nev: never;
// nev = 1 as never;  // Força com asserção (perigoso)

// Union com never é eliminado
type StringOrNever = string | never; // string
type NumberOrNever = number | never; // number
```

---

**never** é fundamental para garantir type safety em exhaustiveness checking e eliminar possibilidades impossíveis no sistema de tipos.
