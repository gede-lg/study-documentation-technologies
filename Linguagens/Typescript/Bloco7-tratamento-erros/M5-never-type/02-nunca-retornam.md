# Nunca Retornam

## 🎯 Introdução e Definição

### Definição Conceitual

**Funções que nunca retornam** são funções cujo **control flow jamais completa normalmente** - elas não produzem valor de retorno ao caller, mas sim **interrompem execução** através de mechanisms como `throw`, `process.exit()`, loops infinitos, ou recursão infinita. TypeScript representa essas funções com **return type `never`**, o **bottom type** da hierarquia de tipos, indicando que a função **jamais produz valor**.

Conceitualmente, funções que nunca retornam representam **terminal operations** - pontos de execução onde o fluxo normal **cessa**. Diferentemente de funções que retornam `void` (completam e retornam `undefined`), funções `never` **não completam** - elas alteram o control flow de forma irreversível: lançam exception (transferindo controle para catch), terminam o processo (saindo do programa), ou entram em loop/recursão infinita.

**Never type** (`never`) é o tipo mais específico em TypeScript - é **subtype** de todos os tipos (pode ser atribuído a qualquer tipo), mas **nenhum tipo** é subtype de `never` (exceto `never` itself). Representa **empty set** na teoria dos tipos - conjunto vazio de valores. Nenhum valor pode satisfazer tipo `never`.

**Fundamento teórico:** `never` codifica **absence of normal completion** - função não retorna porque:
1. **Throws exception** - transfere controle via error handling
2. **Exits process** - termina programa (`process.exit()`)
3. **Infinite loop** - nunca completa (`while(true)`)
4. **Infinite recursion** - chama a si mesma indefinidamente

### Contexto Histórico e Evolução

**JavaScript (1995-2012):** Sem type system - impossível distinguir funções que retornam vs nunca retornam.

**TypeScript Early (2012-2016):** Sem `never` type - funções que sempre lançam tipadas como `void`.

**Problema pre-never:**
```typescript
// TypeScript < 2.0
function panic(): void {  // void semanticamente incorreto
  throw new Error("Panic!");
}

function example(): string {
  panic();  // TS achava que retorna void
  return "unreachable";  // TS não detecta unreachable code
}
```

**TypeScript 2.0 (Setembro 2016):** **Introdução do `never` type**.

**Motivação (GitHub Issue #8652):**
- Precisão em control flow analysis
- Detectar unreachable code
- Type narrowing em union types
- Exhaustive checking em pattern matching

**TypeScript 2.0+ com never:**
```typescript
// TypeScript 2.0+
function panic(): never {  // never correto
  throw new Error("Panic!");
}

function example(): string {
  panic();  // TS sabe que nunca retorna
  return "unreachable";  // ⚠️ TS detecta: unreachable code
}
```

**TypeScript 2.1 (Dezembro 2016):** Melhorias em **control flow analysis** - TypeScript detecta:
- Unreachable code após `never`
- Type narrowing com `never`
- Never em conditional types

**TypeScript 2.8 (Março 2018):** `never` em **conditional types** - type-level programming avançado.

**TypeScript 3.7 (Novembro 2019):** **Assertion functions** (`asserts`) - funções que refinam tipos sem retornar valor.

**TypeScript 4.8 (Agosto 2022):** Melhorias em **narrowing** - `never` mais preciso em complex control flow.

**Evolução conceitual:**

**Era Pre-Never (antes 2.0):** Sem representação para "nunca retorna"
**Era Never Basic (2.0-2.x):** Never para throw e loops
**Era Control Flow (2.x-3.x):** Never com narrowing avançado
**Era Modern (3.7+):** Assertion functions, exhaustive checking

### Problema Fundamental que Resolve

Funções que nunca retornam resolvem o problema de **imprecise control flow analysis** e **missing exhaustiveness checking**.

**Problema 1: Control flow incorreto**
```typescript
// Sem never - control flow incorreto
function fail(msg: string): void {  // void incorreto
  throw new Error(msg);
}

function getValue(x: string | null): string {
  if (x === null) {
    fail("x is null");
    // TS acha que execução continua aqui
  }
  // TS acha que x pode ser null
  return x.toUpperCase();  // ❌ TS não sabe que x é string
}
```

**Solução: Never - control flow correto**
```typescript
// Com never - control flow correto
function fail(msg: string): never {  // never correto
  throw new Error(msg);
}

function getValue(x: string | null): string {
  if (x === null) {
    fail("x is null");  // TS sabe que nunca retorna
    // TS sabe que código aqui é unreachable
  }
  // TS sabe que x é string (null eliminado)
  return x.toUpperCase();  // ✅ Type-safe
}
```

**Problema 2: Sem exhaustiveness checking**
```typescript
// Sem never - não detecta casos faltando
type Color = "red" | "green" | "blue";

function getColorCode(color: Color): string {
  switch (color) {
    case "red":
      return "#FF0000";
    case "green":
      return "#00FF00";
    // blue faltando - TS não detecta!
  }
  // ❌ TS não alerta que falta case
  return "";  // Workaround - código incorreto
}
```

**Solução: Never - exhaustiveness checking**
```typescript
// Com never - detecta casos faltando
function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

function getColorCode(color: Color): string {
  switch (color) {
    case "red":
      return "#FF0000";
    case "green":
      return "#00FF00";
    default:
      // ❌ Error: color é 'blue', não 'never'
      return assertNever(color);  // TS detecta blue faltando
  }
}
```

**Problema 3: Unreachable code não detectado**
```typescript
// Sem never
function panic(): void {
  throw new Error();
}

function example() {
  panic();
  console.log("dead code");  // TS não avisa - código morto
}
```

**Solução: Never - detecta unreachable code**
```typescript
// Com never
function panic(): never {
  throw new Error();
}

function example() {
  panic();
  console.log("dead code");  // ⚠️ TS avisa: unreachable code
}
```

**Fundamento teórico:** `never` permite TypeScript **reason about control flow** - entender quando código é unreachable, quando tipo foi eliminado, quando cases estão completos.

### Importância no Ecossistema

Funções que nunca retornam são cruciais porque:

- **Type Safety:** Previne assumir que execução continua
- **Control Flow Analysis:** TS entende fluxo de execução precisamente
- **Unreachable Code Detection:** Detecta dead code em compile-time
- **Type Narrowing:** Elimina tipos de union após never
- **Exhaustive Checking:** Garante pattern matching completo
- **Compiler Optimization:** Código unreachable pode ser eliminado
- **Documentation:** Tipo documenta que função interrompe fluxo
- **Refactoring Safety:** Mudanças em union types detectadas
- **Bottom Type Theory:** Fundamento teórico sólido

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Never Type:** Bottom type - nenhum valor possível
2. **Control Flow Termination:** Função não completa normalmente
3. **Unreachable Code:** Código após never jamais executa
4. **Type Narrowing:** Never elimina tipos de unions
5. **Exhaustiveness:** Garantir todos casos tratados

### Pilares Fundamentais

- **Bottom Type:** Never é subtype de todos os tipos
- **Empty Set:** Never representa conjunto vazio de valores
- **Non-Returning:** Função jamais retorna valor
- **Flow Interruption:** Control flow é interrompido
- **Compile-Time Detection:** Unreachable code detectado

### Visão Geral das Nuances

- **Throw vs Exit vs Loop:** Diferentes formas de never
- **Never vs Void:** Void retorna undefined, never não retorna
- **Never in Unions:** Never eliminado de union types
- **Assertion Functions:** Asserts keyword para type refinement
- **Exhaustive Checking:** Pattern de assertNever

## 🧠 Fundamentos Teóricos

### Never Type Foundations

```typescript
// Never é bottom type - subtype de todos os tipos
let n: never;

// Never pode ser atribuído a qualquer tipo
let s: string = n;  // ✅ OK - never é subtype de string
let num: number = n;  // ✅ OK - never é subtype de number
let obj: object = n;  // ✅ OK - never é subtype de object

// Nenhum tipo pode ser atribuído a never (exceto never)
n = "string";  // ❌ Error - string não é never
n = 123;       // ❌ Error - number não é never
n = {};        // ❌ Error - object não é never

// Apenas never pode ser atribuído a never
let n2: never;
n = n2;  // ✅ OK - never é never
```

**Análise profunda:**

**Bottom Type Theory:**
- `never` está no **bottom** da hierarquia de tipos
- É **subtype** de todos os tipos
- **Nenhum tipo** é subtype de `never`
- Representa **empty set** - sem valores possíveis

**Hierarquia de tipos:**
```
unknown (top type - qualquer valor)
  ↓
any
  ↓
string, number, object, etc.
  ↓
never (bottom type - nenhum valor)
```

**Fundamento teórico:** `never` é **uninhabited type** - não existe valor que satisfaça tipo `never`.

### Forms of Never - Throw

```typescript
// 1. Throw exception
function fail(message: string): never {
  throw new Error(message);
}

function validateAge(age: number): void {
  if (age < 0) {
    fail("Age cannot be negative");  // never
  }
}
```

**Conceito:** `throw` **transfere control** para catch block mais próximo - função que sempre lança nunca retorna normalmente.

### Forms of Never - Process Exit

```typescript
// 2. Process exit
function exitWithError(code: number): never {
  console.error("Fatal error");
  process.exit(code);  // Termina processo - nunca retorna
}

function criticalFailure() {
  exitWithError(1);  // never
  console.log("unreachable");  // Dead code
}
```

**Análise profunda:** `process.exit()` **termina programa** - não há retorno ao caller.

### Princípios e Conceitos Subjacentes

#### Forms of Never - Infinite Loop

```typescript
// 3. Infinite loop
function infiniteLoop(): never {
  while (true) {
    // Loop nunca termina
  }
}

function keepRetrying(): never {
  while (true) {
    try {
      performOperation();
      // Se chegou aqui, nunca sai do loop
    } catch (e) {
      console.log("Retrying...");
    }
  }
}
```

**Fundamento teórico:** Loop infinito **nunca completa** - função jamais retorna.

#### Forms of Never - Infinite Recursion

```typescript
// 4. Infinite recursion
function recurseForever(): never {
  return recurseForever();  // Chama a si mesma infinitamente
}

// Recursão com condição que nunca é verdadeira
function recursiveNever(n: number): never {
  if (n > 0) {
    return recursiveNever(n + 1);  // Incrementa - nunca será <= 0
  }
  return recursiveNever(n + 1);  // Sempre incrementa
}
```

**Análise profunda:** Recursão infinita **esgota call stack** eventualmente - mas conceitualmente nunca retorna.

### Never in Control Flow Analysis

```typescript
function assertNonNull<T>(value: T | null, name: string): asserts value is T {
  if (value === null) {
    throw new Error(`${name} is null`);  // never implícito
  }
}

function processUser(user: User | null) {
  // user: User | null
  assertNonNull(user, "user");
  // user: User - null eliminado por never
  console.log(user.name);  // ✅ Type-safe
}
```

**Conceito fundamental:** Assertion functions usam `never` **implicitamente** - throw em branch elimina tipo.

**Control flow analysis:**
1. `user: User | null` antes de `assertNonNull`
2. `if (value === null)` → branch `null`
3. `throw` → `never` - elimina `null` do tipo
4. Após `assertNonNull` → `user: User`

### Never with Type Narrowing

```typescript
type Response = 
  | { status: "success"; data: string }
  | { status: "error"; message: string };

function handleResponse(response: Response): string {
  if (response.status === "success") {
    return response.data;  // response: { status: "success"; data: string }
  } else {
    // response: { status: "error"; message: string }
    throw new Error(response.message);  // never
  }
  // Unreachable - todos caminhos cobertos
}

// TypeScript sabe que função retorna string (nunca chega aqui)
```

**Fundamento teórico:** `never` em branch **elimina tipo** - narrowing automático.

### Modelo Mental para Compreensão

Pense em funções que nunca retornam como **buracos negros**:

**Função normal:** Foguete vai ao espaço e retorna à Terra
**Função never:** Foguete entra em buraco negro - **nunca retorna**

**Analogia - Viagem:**

**Função normal:** Sair de casa → trabalhar → voltar para casa
**Função never:** Sair de casa → entrar em portal para outra dimensão → **nunca volta**

**Metáfora - Estrada:**

**Função normal:** Carro na estrada → chega ao destino → retorna
**Função never:** Carro cai em abismo - **nunca chega**

**Fluxo:**
```
função normal():
  executa código
  return valor  → retorna ao caller
  
função never():
  executa código
  throw/exit/loop  → NUNCA retorna
  [unreachable]    → esta linha não existe no universo
```

**Bottom Type - Conjunto Vazio:**

**Analogia matemática:**
- `unknown` = conjunto universal (todos os valores)
- `string` = conjunto de strings
- `never` = conjunto vazio (∅) - nenhum valor

Nenhum valor pode ser do tipo `never` - conjunto vazio não contém elementos.

## 🔍 Análise Conceitual Profunda

### Exhaustive Checking with Never

```typescript
type Animal = 
  | { kind: "dog"; bark: string }
  | { kind: "cat"; meow: string }
  | { kind: "bird"; chirp: string };

function assertNever(value: never): never {
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

function animalSound(animal: Animal): string {
  switch (animal.kind) {
    case "dog":
      return animal.bark;
    case "cat":
      return animal.meow;
    case "bird":
      return animal.chirp;
    default:
      // animal: never - todos casos tratados
      return assertNever(animal);
  }
}

// Se adicionar tipo a Animal:
type Animal2 = 
  | { kind: "dog"; bark: string }
  | { kind: "cat"; meow: string }
  | { kind: "bird"; chirp: string }
  | { kind: "fish"; swim: string };  // Novo!

function animalSound2(animal: Animal2): string {
  switch (animal.kind) {
    case "dog":
      return animal.bark;
    case "cat":
      return animal.meow;
    case "bird":
      return animal.chirp;
    default:
      // ❌ Error: animal é 'fish', não 'never'
      return assertNever(animal);  // Compile error!
  }
}
```

**Análise profunda:**

**Pattern de exhaustive checking:**
1. Default case chama `assertNever(value)`
2. `assertNever` aceita apenas `never`
3. Se todos casos tratados → `value` é `never` → ✅ OK
4. Se caso faltando → `value` não é `never` → ❌ Error

**Fundamento teórico:** Compiler verifica **exhaustiveness** - garante que todos variantes de union foram tratados.

#### Never in Union Types

```typescript
// Never é eliminado de union types
type Example1 = string | never;  // string
type Example2 = number | never;  // number
type Example3 = never | boolean;  // boolean

type Example4 = string | number | never;  // string | number

// Never em todas branches = never
type Example5 = never | never;  // never

// Uso prático
type NonNullable<T> = T extends null | undefined ? never : T;

type Result1 = NonNullable<string | null>;  // string
type Result2 = NonNullable<number | undefined>;  // number
type Result3 = NonNullable<boolean | null | undefined>;  // boolean
```

**Conceito fundamental:** `never` em union **é eliminado** - representa "empty set", união com empty set não muda o conjunto.

**Teoria dos conjuntos:**
```
string ∪ never = string
number ∪ never = number
string ∪ number ∪ never = string ∪ number
```

### Never with Function Return Types

```typescript
// Função com branch never e branch normal
function mayFail(shouldFail: boolean): string {
  if (shouldFail) {
    throw new Error("Failed");  // never
  }
  return "success";  // string
}
// Return type: string (never eliminado)

// Função que sempre lança
function alwaysFails(): never {
  throw new Error("Always fails");
}
// Return type: never (todos paths são never)

// Função com todas branches never
function complexNever(n: number): never {
  if (n > 0) {
    throw new Error("Positive");
  } else if (n < 0) {
    throw new Error("Negative");
  } else {
    throw new Error("Zero");
  }
  // Todos paths lançam - return type é never
}
```

**Análise profunda:** TypeScript analisa **todos control flow paths**:
- Se **algum path** retorna valor normal → tipo é union (never eliminado)
- Se **todos paths** são never → tipo é never

#### Assertion Functions - Asserts Keyword

```typescript
// Assertion function - refina tipo sem return explícito
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");  // never implícito
  }
  // Se não lançou, value é string
}

function processValue(value: unknown) {
  // value: unknown
  assertIsString(value);
  // value: string - type narrowed
  console.log(value.toUpperCase());  // ✅ Type-safe
}

// Assertion para array
function assertIsArray<T>(value: unknown): asserts value is T[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected array");
  }
}

function processArray(value: unknown) {
  assertIsArray<number>(value);
  // value: number[]
  console.log(value.map(x => x * 2));  // ✅ Type-safe
}
```

**Conceito avançado:** `asserts` keyword cria **assertion functions** - refinam tipo após execução sem return value.

**Fundamento teórico:**
- Assertion function **não retorna valor** (void)
- Mas **refina tipo** do parâmetro
- Se assertion falha → `throw` (never)
- Se assertion passa → tipo refinado

### Never in Conditional Types

```typescript
// Conditional type com never
type Exclude<T, U> = T extends U ? never : T;

type Result1 = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"
type Result2 = Exclude<string | number, string>;  // number

// Implementação conceptual:
// Exclude<"a" | "b" | "c", "a">
// = ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ("c" extends "a" ? never : "c")
// = never | "b" | "c"
// = "b" | "c"  (never eliminado)
```

**Análise profunda:** `never` em conditional types usado para **filter out** tipos de union.

#### Never with Generic Constraints

```typescript
// Generic que nunca pode ser instanciado
function impossibleFunction<T extends never>(value: T): T {
  return value;  // value: never - nenhum valor possível
}

// ❌ Impossível chamar - nenhum argumento é never
// impossibleFunction("string");  // Error
// impossibleFunction(123);       // Error

// Uso prático - garantir tipo específico
type MustBeNever<T> = T extends never ? T : "Error: not never";

type Test1 = MustBeNever<never>;  // never
type Test2 = MustBeNever<string>;  // "Error: not never"
```

**Fundamento teórico:** Generic constrained a `never` **não pode ser instanciado** - nenhum tipo satisfaz constraint.

### Never in Async Functions

```typescript
// Async function que sempre rejeita
async function alwaysRejects(): Promise<never> {
  throw new Error("Always fails");
}

async function processAsync() {
  try {
    const result = await alwaysRejects();  // result: never
    console.log(result);  // Unreachable - never executa
  } catch (e) {
    console.log("Caught:", e);
  }
}

// Async function com infinite loop
async function infiniteAsyncLoop(): Promise<never> {
  while (true) {
    await delay(1000);
    // Loop infinito - nunca resolve
  }
}
```

**Análise profunda:** Async functions que nunca resolvem têm tipo `Promise<never>` - promise nunca fulfills (apenas rejects ou pendente infinitamente).

#### Never with Void - Comparison

```typescript
// Void - retorna undefined
function logMessage(msg: string): void {
  console.log(msg);
  // retorna undefined implicitamente
}

const result1: void = logMessage("Hello");  // result1: void (undefined)

// Never - nunca retorna
function throwError(msg: string): never {
  throw new Error(msg);
}

const result2: never = throwError("Error");  // Unreachable - nunca atinge

// Diferença crítica
function example1(): void {
  logMessage("log");  // Execução continua
  console.log("After log");  // ✅ Executado
}

function example2(): never {
  throwError("error");  // Execução NÃO continua
  console.log("After throw");  // ❌ Unreachable
}
```

**Comparação fundamental:**

**Void:**
- Função **completa** normalmente
- Retorna `undefined`
- Execução **continua** após chamada
- Tipo: representa "sem valor útil"

**Never:**
- Função **não completa** normalmente
- **Não retorna** - interrompe fluxo
- Execução **não continua** após chamada
- Tipo: representa "nenhum valor possível"

### Never in Error Handling Patterns

```typescript
class Result<T, E> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E
  ) {}
  
  static ok<T>(value: T): Result<T, never> {
    return new Result(value, undefined);
  }
  
  static err<E>(error: E): Result<never, E> {
    return new Result(undefined, error);
  }
  
  isOk(): this is Result<T, never> {
    return this.error === undefined;
  }
  
  unwrap(): T {
    if (this.error !== undefined) {
      throw new Error("Called unwrap on error");  // never
    }
    return this.value!;
  }
}

const success = Result.ok<string>("value");  // Result<string, never>
const failure = Result.err<string>("error");  // Result<never, string>
```

**Conceito avançado:** `never` em generic types indica **impossibility** - `Result<T, never>` nunca tem erro, `Result<never, E>` nunca tem valor.

#### Never in Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function assertString(value: unknown): asserts value is string {
  if (!isString(value)) {
    throw new Error("Not a string");  // never
  }
}

function processValue(value: unknown) {
  // Type guard - retorna boolean
  if (isString(value)) {
    console.log(value.toUpperCase());  // value: string
  }
  
  // Assertion - usa never
  assertString(value);  // Se não lança, value é string
  console.log(value.toUpperCase());  // value: string
}
```

**Análise profunda:**

**Type Guard:** Retorna `boolean` - caller decide o que fazer
**Assertion Function:** Usa `never` (throw) - força tipo ou falha

### Never in Discriminated Unions

```typescript
type State =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handleState(state: State): void {
  switch (state.status) {
    case "loading":
      console.log("Loading...");
      return;
    case "success":
      console.log(state.data);
      return;
    case "error":
      console.log(state.error);
      return;
    default:
      // state: never - exhaustive
      const _exhaustive: never = state;
      throw new Error(`Unhandled state: ${(_exhaustive as any).status}`);
  }
}
```

**Fundamento teórico:** Default case assignment a `never` garante **compile-time exhaustiveness** - se novo status adicionado, default causa erro.

### Never with Branded Types

```typescript
// Branded type com never
type Brand<K, T> = K & { __brand: T };

type PositiveNumber = Brand<number, "positive">;
type NegativeNumber = Brand<number, "negative">;

function assertPositive(n: number): asserts n is PositiveNumber {
  if (n <= 0) {
    throw new Error("Not positive");  // never
  }
}

function processPositive(n: number) {
  assertPositive(n);  // Assert que é positive
  // n: PositiveNumber (branded)
  console.log(n * 2);
}
```

**Conceito:** Assertion functions com `never` permitem **brand types** - garantir invariantes em compile-time.

## 🎯 Aplicabilidade e Contextos

### Exhaustive Pattern Matching

```typescript
type Action = { type: "add" } | { type: "remove" };

function reducer(action: Action): void {
  switch (action.type) {
    case "add":
      return;
    case "remove":
      return;
    default:
      assertNever(action);  // Exhaustive
  }
}
```

**Raciocínio:** Garante todos casos tratados em compile-time.

### Validation and Assertions

```typescript
function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new Error("Value is undefined");
  }
}

function processUser(user: User | undefined) {
  assertDefined(user);
  console.log(user.name);  // Type-safe
}
```

**Raciocínio:** Type refinement com assertions.

### Fail-Fast Error Handling

```typescript
function fail(message: string): never {
  throw new Error(message);
}

function divide(a: number, b: number): number {
  if (b === 0) fail("Division by zero");
  return a / b;
}
```

**Raciocínio:** Detectar erros cedo, prevenir estado inconsistente.

## ⚠️ Limitações e Considerações Teóricas

### Unreachable Code Detection

```typescript
function example(): never {
  throw new Error();
  console.log("unreachable");  // ⚠️ TS avisa - dead code
}
```

**Limitação:** Código após never é dead code - deve ser removido.

### Never Must Not Complete

```typescript
function invalid(): never {
  if (Math.random() > 0.5) {
    throw new Error();
  }
  return "value";  // ❌ Error - never não pode retornar
}
```

**Consideração:** Função `never` **não pode** ter path que retorna normalmente.

### Type Inference Limits

```typescript
function implicit() {  // Inferido como 'never'
  throw new Error();
}

// Melhor: explicitar
function explicit(): never {  // Explícito
  throw new Error();
}
```

**Limitação:** Preferir declarar `never` explicitamente para clareza.

## 🔗 Interconexões Conceituais

**Relação com Throw:** Principal forma de criar never.

**Relação com Bottom Type:** Never é bottom type na hierarquia.

**Relação com Type Narrowing:** Never elimina tipos de unions.

**Relação com Assertion Functions:** Asserts usa never implicitamente.

**Relação com Exhaustiveness:** Never garante pattern matching completo.

**Relação com Control Flow:** Never interrompe fluxo permanentemente.

## 🚀 Evolução e Próximos Conceitos

Dominar funções que nunca retornam prepara para:
- **Result Type Pattern:** Alternativa type-safe a exceptions
- **Discriminated Unions:** Union types avançados
- **Type-Level Programming:** Never em conditional types
- **Advanced Type Guards:** Type refinement complexo
