# Exclude<T, U> e Extract<T, U>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`Exclude<T, U>`** e **`Extract<T, U>`** são tipos utilitários built-in complementares que operam sobre **union types**. `Exclude` **remove** de `T` todos os tipos que são atribuíveis a `U`, enquanto `Extract` **mantém apenas** tipos de `T` que são atribuíveis a `U`. Conceitualmente, representam **operações de conjunto**: diferença (Exclude) e interseção (Extract).

Na essência, materializam princípios de **álgebra de tipos**, permitindo filtragem e seleção em unions, criando novos tipos derivados através de operações lógicas sobre conjuntos de tipos.

## 📋 Fundamentos

### Exclude<T, U>

```typescript
// Exclude: remove tipos de union
type Completo = "a" | "b" | "c" | "d";

type SemAB = Exclude<Completo, "a" | "b">;
// Resultado: "c" | "d"

type SemC = Exclude<Completo, "c">;
// Resultado: "a" | "b" | "d"

// Com tipos primitivos
type Primitivo = string | number | boolean;

type SemString = Exclude<Primitivo, string>;
// Resultado: number | boolean
```

### Extract<T, U>

```typescript
// Extract: mantém apenas tipos em comum
type Completo = "a" | "b" | "c" | "d";

type ApenasAB = Extract<Completo, "a" | "b">;
// Resultado: "a" | "b"

type ApenasC = Extract<Completo, "c">;
// Resultado: "c"

// Interseção de unions
type NumeroOuString = string | number | boolean;
type StringOuDate = string | Date;

type Comum = Extract<NumeroOuString, StringOuDate>;
// Resultado: string (único tipo em comum)
```

**Conceito-chave:** Exclude é **diferença de conjuntos** (T - U), Extract é **interseção** (T ∩ U).

### Implementação Interna

```typescript
// Exclude (built-in)
type Exclude<T, U> = T extends U ? never : T;

// Extract (built-in)
type Extract<T, U> = T extends U ? T : never;

// Explicação:
// - Conditional types aplicados distributivamente sobre union
// - Exclude: se T é atribuível a U, retorna never (remove), senão mantém T
// - Extract: se T é atribuível a U, retorna T (mantém), senão never (remove)
```

**Mecanismo:** Usa **conditional types** com distribuição sobre unions.

## 🔍 Análise Conceitual

### 1. Filtragem de Literais

```typescript
type Dia = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

// Apenas dias úteis (excluir final de semana)
type DiaUtil = Exclude<Dia, "sab" | "dom">;
// "seg" | "ter" | "qua" | "qui" | "sex"

// Apenas final de semana
type FimDeSemana = Extract<Dia, "sab" | "dom">;
// "sab" | "dom"

// Uso
function agendarReuniao(dia: DiaUtil): void {
  console.log(`Reunião agendada para ${dia}`);
}

agendarReuniao("seg"); // ✅ OK
// agendarReuniao("sab"); // ❌ Erro: sab não é DiaUtil
```

### 2. Remover Tipos Primitivos

```typescript
type MistoComplexo = string | number | { id: number } | boolean | null | undefined;

// Remover primitivos simples
type ApenasObjetos = Exclude<MistoComplexo, string | number | boolean | null | undefined>;
// Resultado: { id: number }

// Remover apenas nullish
type SemNullish = Exclude<MistoComplexo, null | undefined>;
// string | number | { id: number } | boolean
```

### 3. Eventos e Actions

```typescript
type Action =
  | { type: "INCREMENTAR" }
  | { type: "DECREMENTAR" }
  | { type: "RESETAR" }
  | { type: "SET_VALOR"; payload: number }
  | { type: "SALVAR" }
  | { type: "CARREGAR" };

// Apenas actions sem payload
type ActionSemPayload = Extract<Action, { type: string }>;
// Todas têm type, não filtra bem

// Melhor: usar distribuição
type ActionComPayload = Extract<Action, { payload: any }>;
// { type: "SET_VALOR"; payload: number }

type ActionSimples = Exclude<Action, { payload: any }>;
// Todas exceto SET_VALOR
```

### 4. Tipos de Função

```typescript
type Funcoes = (() => void) | ((x: number) => string) | string | number;

// Apenas funções
type ApenasFuncoes = Extract<Funcoes, Function>;
// (() => void) | ((x: number) => string)

// Sem funções
type SemFuncoes = Exclude<Funcoes, Function>;
// string | number
```

### 5. NonNullable (Implementado com Exclude)

```typescript
// NonNullable é apenas Exclude de null e undefined
type NonNullable<T> = Exclude<T, null | undefined>;

type Valor = string | number | null | undefined;

type ValorNaoNulo = NonNullable<Valor>;
// string | number
```

## 🎯 Aplicabilidade

### Validação de Status

```typescript
type Status = "pending" | "processing" | "completed" | "failed" | "cancelled";

// Status ativos (excluir finalizados)
type StatusAtivo = Exclude<Status, "completed" | "failed" | "cancelled">;
// "pending" | "processing"

// Status finalizados
type StatusFinal = Extract<Status, "completed" | "failed" | "cancelled">;
// "completed" | "failed" | "cancelled"

function podeCancelar(status: Status): boolean {
  type Cancelavel = StatusAtivo;
  const cancelavel: Cancelavel[] = ["pending", "processing"];

  return cancelavel.includes(status as Cancelavel);
}
```

### Tipos de Resposta HTTP

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

// Métodos que modificam dados
type MetodoMutante = Extract<HttpMethod, "POST" | "PUT" | "DELETE" | "PATCH">;
// "POST" | "PUT" | "DELETE" | "PATCH"

// Métodos seguros (apenas leitura)
type MetodoSeguro = Exclude<HttpMethod, MetodoMutante>;
// "GET" | "HEAD" | "OPTIONS"

function requisicaoSegura(metodo: MetodoSeguro, url: string): void {
  // Métodos que não alteram estado do servidor
  fetch(url, { method: metodo });
}
```

### Filtragem de Propriedades

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "user";
}

// Chaves que são string
type ChavesString = {
  [K in keyof Usuario]: Usuario[K] extends string ? K : never;
}[keyof Usuario];
// "nome" | "email" | "senha" | "role"

// Usando Extract
type ChavesNumericas = Extract<keyof Usuario, "id">;
// "id"

// Todas exceto id
type ChavesSemId = Exclude<keyof Usuario, "id">;
// "nome" | "email" | "senha" | "role"
```

### Event Handlers

```typescript
type AppEvent =
  | { type: "user:login"; userId: number }
  | { type: "user:logout" }
  | { type: "data:fetch"; endpoint: string }
  | { type: "data:save"; data: any }
  | { type: "error"; message: string };

// Apenas eventos de usuário
type UserEvent = Extract<AppEvent, { type: `user:${string}` }>;
// { type: "user:login"; userId: number } | { type: "user:logout" }

// Apenas eventos de dados
type DataEvent = Extract<AppEvent, { type: `data:${string}` }>;
// { type: "data:fetch"; endpoint: string } | { type: "data:save"; data: any }

// Eventos sem erro
type EventoSucesso = Exclude<AppEvent, { type: "error" }>;
```

### Permissões e Roles

```typescript
type Permission =
  | "read:posts"
  | "write:posts"
  | "delete:posts"
  | "read:users"
  | "write:users"
  | "delete:users"
  | "admin:all";

// Apenas permissões de leitura
type ReadPermission = Extract<Permission, `read:${string}`>;
// "read:posts" | "read:users"

// Sem admin
type UserPermission = Exclude<Permission, "admin:all">;

// Permissões de posts
type PostPermission = Extract<Permission, `${string}:posts`>;
// "read:posts" | "write:posts" | "delete:posts"
```

## ⚠️ Considerações

### 1. Distribuição sobre Unions

```typescript
// Exclude distribui sobre cada membro da union
type A = "a" | "b" | "c";
type B = "b";

type Result = Exclude<A, B>;
// Processo:
// "a" extends "b" ? never : "a" → "a"
// "b" extends "b" ? never : "b" → never
// "c" extends "b" ? never : "c" → "c"
// Resultado final: "a" | "c"
```

### 2. Exclude vs Omit

```typescript
interface Obj {
  a: string;
  b: number;
  c: boolean;
}

// Omit: remove propriedades de objeto
type WithoutA = Omit<Obj, "a">;
// { b: number; c: boolean }

// Exclude: opera sobre union de chaves
type KeysWithoutA = Exclude<keyof Obj, "a">;
// "b" | "c" (union de strings)

// Omit é implementado com Pick + Exclude
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
```

### 3. Extract com Tipos Complexos

```typescript
type Complex = { kind: "a"; x: number } | { kind: "b"; y: string } | { kind: "c" };

// Extract com discriminated union
type OnlyA = Extract<Complex, { kind: "a" }>;
// { kind: "a"; x: number }

type AorB = Extract<Complex, { kind: "a" | "b" }>;
// { kind: "a"; x: number } | { kind: "b"; y: string }
```

### 4. Never Type

```typescript
// Se remover tudo, resultado é never
type Tudo = "a" | "b" | "c";
type Nada = Exclude<Tudo, "a" | "b" | "c">;
// never

// Se nada em comum, Extract retorna never
type SemIntersecao = Extract<"a" | "b", "c" | "d">;
// never

// never em union some
type ComNever = "a" | "b" | never;
// "a" | "b" (never é removido automaticamente)
```

## 📚 Conclusão

`Exclude<T, U>` remove de union `T` todos os tipos atribuíveis a `U` (diferença de conjuntos), `Extract<T, U>` mantém apenas tipos em comum (interseção). Operam sobre unions usando conditional types com distribuição. Ideais para filtragem de literais, remoção de primitivos, seleção de eventos/actions, permissões e tipos derivados. Exclude é base do `NonNullable` e usado internamente pelo `Omit`. Extract útil para discriminated unions. Ambos retornam `never` quando resultado é vazio.
