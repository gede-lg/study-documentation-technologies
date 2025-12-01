# Funções que Lançam Erro

## 🎯 Introdução e Definição

### Definição Conceitual

**Funções que lançam erro** são funções cujo **único propósito** é gerar uma exception - elas **nunca completam normalmente**, sempre terminando o fluxo de execução através de `throw`. TypeScript tipa essas funções com **return type `never`**, indicando que a função **jamais retorna** um valor ao caller - o control flow é **interrompido** pela exception.

Conceitualmente, funções que lançam erro representam **terminal points** no control flow - quando chamadas, o fluxo de execução **não continua** na linha seguinte, mas sim pula para o `catch` block mais próximo (ou termina o programa se não houver tratamento). Diferentemente de funções normais que **retornam valor** e permitem execução continuar, funções que lançam erro **alteram control flow** abruptamente.

**Never type** (`never`) é o tipo mais restritivo em TypeScript - representa **valores que nunca ocorrem**. Para funções, `never` significa que a função **nunca retorna normalmente** - pode lançar erro, entrar em loop infinito, ou chamar `process.exit()`. É o **bottom type** da hierarquia de tipos - nenhum valor pode ser do tipo `never` (exceto `never` itself).

**Fundamento teórico:** Funções que lançam erro são **assertions** ou **validators** - verificam condições e falham se inválidas. São usadas para **fail-fast** - detectar erros cedo e prevenir estado inconsistente.

### Contexto Histórico e Evolução

**JavaScript (1995-2012):** Sem tipagem - funções que lançam erro não diferenciadas de funções normais.

**TypeScript Early (2012-2016):** Funções que sempre lançam tinham return type `void` - incorreto conceitualmente.

**TypeScript 2.0 (Setembro 2016):** **Introdução do `never` type** - representando funções que nunca retornam.

**Motivação:** Antes do `never`, código tinha inconsistências:

```typescript
// TypeScript < 2.0
function fail(message: string): void {  // void incorreto!
  throw new Error(message);
}

function example(x: number): string {
  if (x < 0) {
    fail("Negative number");  // TS achava que retorna void
  }
  return x.toString();  // ❌ TS não sabia que fail interrompe fluxo
}
```

**TypeScript 2.0+:** `never` corrige semântica:

```typescript
// TypeScript 2.0+
function fail(message: string): never {  // never correto!
  throw new Error(message);
}

function example(x: number): string {
  if (x < 0) {
    fail("Negative number");  // TS sabe que nunca retorna
  }
  return x.toString();  // ✅ TS entende que só chega aqui se x >= 0
}
```

**TypeScript 2.1 (Dezembro 2016):** Melhorias em **control flow analysis** - inferência mais precisa de `never`.

**TypeScript 2.8 (Março 2018):** `never` em conditional types - uso avançado em type-level programming.

**TypeScript 3.7 (Novembro 2019):** **Assertion functions** - funções que "assert" condições e refinam tipos.

**Evolução de práticas:**

**Era Pre-Never (antes 2.0):**
```typescript
function fail(): void {  // void semanticamente incorreto
  throw new Error();
}
```

**Era Never Basic (2.0-2.x):**
```typescript
function fail(): never {  // never correto
  throw new Error();
}
```

**Era Assertion Functions (3.7+):**
```typescript
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);  // never implícito
  }
}
```

### Problema Fundamental que Resolve

Funções que lançam erro resolvem o problema de **incorrect control flow analysis** e **missing type refinement**.

**Problema: Sem never - control flow incorreto**
```typescript
// TypeScript < 2.0 - sem never type
function validatePositive(x: number): void {  // void incorreto
  if (x < 0) {
    throw new Error("Must be positive");
  }
}

function processNumber(x: number | null): number {
  if (x === null) {
    validatePositive(x);  // ✅ Compila, mas x é null!
    // TS acha que execução continua aqui
  }
  return x * 2;  // ❌ Runtime error - x pode ser null
}
```

**Solução: Never - control flow correto**
```typescript
// TypeScript 2.0+ - com never type
function validatePositive(x: number): never {  // never correto
  throw new Error("Must be positive");
}

function processNumber(x: number | null): number {
  if (x === null) {
    validatePositive(x);  // TS sabe que nunca retorna
    // TS sabe que código aqui é unreachable
  }
  // TS sabe que x não é null aqui
  return x * 2;  // ✅ Type-safe - x é number
}
```

**Problema: Sem never - type narrowing incorreto**
```typescript
// Sem never
function fail(message: string): void {
  throw new Error(message);
}

function getValue(x: string | number): string {
  if (typeof x === "number") {
    fail("Expected string");
    // TS acha que execução continua
  }
  // TS acha que x pode ser number | string
  return x.toUpperCase();  // ❌ Error - x pode ser number
}
```

**Solução: Never - type narrowing correto**
```typescript
// Com never
function fail(message: string): never {
  throw new Error(message);
}

function getValue(x: string | number): string {
  if (typeof x === "number") {
    fail("Expected string");  // TS sabe que nunca retorna
  }
  // TS sabe que x é string aqui (number foi eliminado)
  return x.toUpperCase();  // ✅ Type-safe - x é string
}
```

**Fundamento teórico:** `never` permite **control flow analysis** preciso - TypeScript entende que código após `never` é **unreachable** ou que tipo foi **narrowed**.

### Importância no Ecossistema

Funções que lançam erro são cruciais porque:

- **Control Flow Analysis:** TS entende que execução não continua
- **Type Narrowing:** Elimina tipos em union types
- **Fail-Fast:** Detecta erros cedo no fluxo
- **Validation:** Funções de validação que garantem invariantes
- **Assertions:** Funções que assertam condições
- **Exhaustive Checking:** Garante todos casos tratados
- **Type Safety:** Previne código unreachable
- **Documentation:** Tipo `never` documenta que função nunca retorna

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Never Type:** Tipo para funções que nunca retornam
2. **Control Flow:** Interrupção de fluxo de execução
3. **Type Narrowing:** Eliminação de tipos após never
4. **Unreachable Code:** Código após never é unreachable
5. **Assertion Functions:** Funções que garantem condições

### Pilares Fundamentais

- **Throw Statement:** Lançar erro interrompe fluxo
- **Never Return Type:** Indica função nunca retorna
- **Fail-Fast Pattern:** Falhar cedo ao invés de propagar erro
- **Invariant Checking:** Garantir condições sempre verdadeiras
- **Type Guards with Never:** Narrow types com funções que lançam

### Visão Geral das Nuances

- **Never vs Void:** Void retorna undefined, never nunca retorna
- **Explicit vs Implicit Never:** Declarar never ou inferir
- **Assertion Functions:** `asserts` keyword para type refinement
- **Unreachable Code Detection:** TS detecta código após never
- **Never in Union Types:** Never é eliminado de unions

## 🧠 Fundamentos Teóricos

### Basic Never Return Type

```typescript
// Função que sempre lança erro - return type never
function fail(message: string): never {
  throw new Error(message);
}

// Uso
function processValue(x: number) {
  if (x < 0) {
    fail("Value must be positive");
    // Código aqui é unreachable - TS sabe
  }
  console.log(x);  // TS sabe que x >= 0
}
```

**Análise profunda:**

**Semântica de never:**
- Função **nunca completa normalmente**
- Sempre lança exception ou entra em loop infinito
- Return type `never` documenta comportamento

**Control flow analysis:**
- TypeScript sabe que `fail()` nunca retorna
- Código após `fail()` é **unreachable**
- Type narrowing aplica-se antes de `fail()`

**Fundamento teórico:** `never` é **bottom type** - não possui valores, representa ausência de retorno.

### Never with Type Narrowing

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    default:
      // shape: never - todos casos tratados
      return assertNever(shape);  // Exhaustive check
  }
}
```

**Conceito fundamental:** **Exhaustive checking** - `assertNever` garante que todos casos de union foram tratados.

**Análise profunda:**

Se adicionar novo tipo a `Shape` sem tratar no switch:
```typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number; height: number };  // Novo!

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    default:
      // ❌ Error: shape não é never - é triangle!
      return assertNever(shape);  // Compile error
  }
}
```

TypeScript alerta que `triangle` não foi tratado!

### Princípios e Conceitos Subjacentes

#### Validation Functions with Never

```typescript
function validateEmail(email: string): never | void {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    throw new Error("Invalid email format");  // never
  }
  // void - retorna undefined se válido
}

// Melhor: separar validação
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function requireValidEmail(email: string): void {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");  // never implícito
  }
}

// Ou: função que lança
function assertValidEmail(email: string): never {
  throw new Error("Invalid email format");
}

function processEmail(email: string) {
  if (!isValidEmail(email)) {
    assertValidEmail(email);  // never - interrompe fluxo
  }
  // email é válido aqui
  console.log(email.toLowerCase());
}
```

**Fundamento teórico:** Funções de validação podem **retornar void** (sucesso) ou **lançar erro** (never) - pattern comum para fail-fast.

#### Never with Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function assertString(value: unknown): asserts value is string {
  if (!isString(value)) {
    throw new Error("Expected string");  // never implícito
  }
}

function processValue(value: unknown) {
  assertString(value);  // Assert que é string
  // value: string - type narrowing
  console.log(value.toUpperCase());  // ✅ Type-safe
}
```

**Conceito avançado:** **Assertion functions** com `asserts` keyword - refinam tipo sem return explícito.

### Error Factory Functions

```typescript
// Factory que cria e lança erro
function throwValidationError(field: string, value: any): never {
  throw new ValidationError(
    `Invalid ${field}: ${value}`,
    field,
    value
  );
}

function throwNotFoundError(resource: string, id: number): never {
  throw new NotFoundError(resource, id);
}

function throwUnauthorizedError(reason: string): never {
  throw new UnauthorizedError(reason);
}

// Uso
function getUser(id: number): User {
  if (id < 0) {
    throwValidationError("id", id);  // never - interrompe
  }
  
  const user = database.find(id);
  if (!user) {
    throwNotFoundError("User", id);  // never - interrompe
  }
  
  return user;
}
```

**Análise profunda:** **Error factory functions** centralizam criação de erros - todas têm return type `never`.

### Never in Conditional Returns

```typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");  // never implícito
  }
  return a / b;
}

// TS infere return type baseado em control flow
// Sem throw: return type seria number
// Com throw: return type continua number (never eliminado)
```

**Fundamento teórico:** `never` em branch de if não afeta return type - apenas branch que retorna normalmente determina tipo.

### Modelo Mental para Compreensão

Pense em funções que lançam erro como **alarmes de emergência**:

**Função normal:** Elevador sobe/desce - retorna ao térreo
**Função never:** Alarme de incêndio - interrompe tudo, evacua prédio - **nunca** retorna à operação normal

**Analogia - Rodovia:**

**Função normal:** Carro segue pela rodovia - chega ao destino
**Função never:** Barreira policial - carro é **parado** - nunca chega ao destino original

**Metáfora - Jogos:**

**Função normal:** Jogador completa fase - avança para próxima
**Função never:** Game Over - jogo **termina** - nunca chega à próxima fase

**Fluxo:**
```
função normal():
  instrução 1
  instrução 2
  return valor  → retorna ao caller
  
função never():
  instrução 1
  throw erro    → nunca retorna - salta para catch
  [unreachable] → esta linha nunca executa
```

## 🔍 Análise Conceitual Profunda

### Explicit Never Return Type

```typescript
// Explícito - documentado claramente
function fail(message: string): never {
  throw new Error(message);
}

// Implícito - TS infere never
function fail2(message: string) {  // Return type inferido: never
  throw new Error(message);
}

// Melhor: explícito para clareza
function createError(code: string): never {
  throw new AppError(code);
}
```

**Análise profunda:** Declarar `never` **explicitamente** documenta intenção - preferível a inferência implícita.

#### Never vs Void

```typescript
// void - função retorna undefined
function logError(message: string): void {
  console.error(message);
  // retorna undefined implicitamente
}

// never - função nunca retorna
function throwError(message: string): never {
  throw new Error(message);
  // nunca retorna
}

// Diferença crítica
function example() {
  logError("Error");  // Execução continua
  console.log("After log");  // ✅ Executado
  
  throwError("Error");  // Execução NÃO continua
  console.log("After throw");  // ❌ Never executado (unreachable)
}
```

**Fundamento teórico:**

**Void:** Função **completa** mas não retorna valor útil (retorna `undefined`)
**Never:** Função **nunca completa** - interrompe fluxo via exception/loop/exit

### Complex Never Scenarios

```typescript
// Função com múltiplos exits
function processValue(x: number): string {
  if (x < 0) {
    throw new Error("Negative");  // never aqui
  }
  if (x === 0) {
    return "zero";  // string aqui
  }
  return x.toString();  // string aqui
}
// Return type: string (never eliminado de union)

// Função que sempre lança
function alwaysFails(): never {
  while (true) {
    if (Math.random() > 0) {
      throw new Error("Failed");
    }
  }
}
// Return type: never (todos caminhos são never)
```

**Análise profunda:** TypeScript analisa **todos control flow paths** - se todos são `never`, função é `never`; se algum retorna valor, `never` é eliminado.

#### Assertion Functions with Asserts

```typescript
// Type predicate com never implícito
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string");  // never implícito
  }
}

// Uso
function processValue(value: unknown) {
  assertIsString(value);  // Assert tipo
  // value: string - type narrowing automático
  console.log(value.toUpperCase());  // ✅ Type-safe
}

// Assertion para non-null
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
}

function processUser(user: User | null) {
  assertDefined(user);  // Assert non-null
  // user: User - null eliminado
  console.log(user.name);  // ✅ Type-safe
}
```

**Conceito avançado:** `asserts` keyword cria **assertion functions** - refinam tipo automaticamente após chamada.

### Never in Generic Functions

```typescript
function assertType<T>(value: unknown, check: (v: unknown) => v is T): asserts value is T {
  if (!check(value)) {
    throw new Error("Type assertion failed");  // never
  }
}

function isNumber(v: unknown): v is number {
  return typeof v === "number";
}

function processValue(value: unknown) {
  assertType(value, isNumber);  // Assert que é number
  // value: number
  console.log(value.toFixed(2));  // ✅ Type-safe
}
```

**Fundamento teórico:** Generics com assertion functions permitem **type-safe assertions** reusáveis.

#### Never in Error Handling Utilities

```typescript
class ErrorHandler {
  static throw(error: Error): never {
    throw error;
  }
  
  static throwIf(condition: boolean, error: Error): void {
    if (condition) {
      throw error;  // never implícito no branch
    }
  }
  
  static throwUnless(condition: boolean, error: Error): void {
    if (!condition) {
      throw error;  // never implícito no branch
    }
  }
}

// Uso
function validateAge(age: number): void {
  ErrorHandler.throwIf(
    age < 0,
    new ValidationError("Age must be positive", "age", age)
  );
  
  ErrorHandler.throwIf(
    age > 150,
    new ValidationError("Age must be realistic", "age", age)
  );
}
```

**Análise profunda:** Utility functions que **condicionalmente lançam** têm return type `void` (podem completar normalmente).

### Never with Union Type Elimination

```typescript
type Response = 
  | { success: true; data: string }
  | { success: false; error: string };

function handleResponse(response: Response): string {
  if (response.success) {
    return response.data;  // data existe em success: true
  } else {
    // response: { success: false; error: string }
    throw new Error(response.error);  // never
  }
  // Unreachable - todos caminhos cobertos
}
```

**Fundamento teórico:** `never` em branch elimina tipo de union - TypeScript sabe que branch "success" foi tratado.

#### Never in Exhaustive Pattern Matching

```typescript
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
      // action: never - todos casos tratados
      throw new Error(`Unknown action: ${(action as any).type}`);
  }
}

// Se adicionar novo tipo a Action, default branch causará erro
type Action2 =
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" }
  | { type: "MULTIPLY"; factor: number };  // Novo!

function reducer2(state: number, action: Action2): number {
  switch (action.type) {
    case "INCREMENT":
      return state + action.amount;
    case "DECREMENT":
      return state - action.amount;
    case "RESET":
      return 0;
    default:
      // ❌ Error: action não é never - é MULTIPLY!
      throw new Error(`Unknown action: ${action.type}`);
      // TS detecta que MULTIPLY não foi tratado
  }
}
```

**Conceito crucial:** Pattern de **exhaustive checking** - default branch só deve ser `never` se todos casos tratados.

### Never with Process Exit

```typescript
// Outras formas de never além de throw
function exitProcess(code: number): never {
  process.exit(code);  // Nunca retorna - termina processo
}

function infiniteLoop(): never {
  while (true) {
    // Loop infinito - nunca retorna
  }
}

function recursiveNever(): never {
  return recursiveNever();  // Recursão infinita - nunca retorna
}
```

**Análise profunda:** `never` não é apenas para `throw` - qualquer função que **nunca completa** tem tipo `never`.

#### Never in Async Functions

```typescript
// Async function que sempre rejeita
async function alwaysRejects(): Promise<never> {
  throw new Error("Always fails");
}

// Uso
async function processAsync() {
  try {
    await alwaysRejects();  // Promise<never>
    console.log("Unreachable");  // Never executado
  } catch (e) {
    console.log("Caught error");
  }
}
```

**Fundamento teórico:** Async functions que sempre lançam têm tipo `Promise<never>` - promise nunca resolve (apenas rejects).

### Never in Type-Level Programming

```typescript
// Conditional types com never
type NonNullable<T> = T extends null | undefined ? never : T;

type Result1 = NonNullable<string | null>;  // string
type Result2 = NonNullable<number | undefined>;  // number

// Filtering union types
type Filter<T, U> = T extends U ? T : never;

type Nums = Filter<string | number | boolean, number>;  // number
```

**Conceito avançado:** `never` em **type-level** usado para filtrar/eliminar tipos de unions.

## 🎯 Aplicabilidade e Contextos

### Input Validation

```typescript
function validatePositive(x: number): never {
  throw new Error("Must be positive");
}

function sqrt(x: number): number {
  if (x < 0) {
    validatePositive(x);  // never - interrompe
  }
  return Math.sqrt(x);
}
```

**Raciocínio:** Fail-fast - detectar input inválido cedo.

### Unreachable Code Detection

```typescript
function processShape(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return getCircleArea(shape);
    case "square":
      return getSquareArea(shape);
    default:
      assertNever(shape);  // Garante exhaustiveness
  }
}
```

**Raciocínio:** Exhaustive checking previne bugs.

### Assertion Utilities

```typescript
function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(`${name} is required`);
  }
}

function processUser(user: User | null) {
  assertDefined(user, "user");
  console.log(user.name);  // Type-safe
}
```

**Raciocínio:** Type refinement com assertions.

## ⚠️ Limitações e Considerações Teóricas

### Unreachable Code After Never

```typescript
function fail(): never {
  throw new Error();
}

function example() {
  fail();
  console.log("Never executed");  // ⚠️ Unreachable - dead code
}
```

**Limitação:** Código após `never` nunca executa - dead code.

### Never Inference Can Be Implicit

```typescript
function implicit() {  // Return type inferido: never
  throw new Error();
}
```

**Consideração:** Preferir explicitar `never` para clareza.

### Never with Try-Catch

```typescript
function mayNotFail(): never {
  try {
    throw new Error("Failed");
  } catch (e) {
    console.log("Caught");  // ⚠️ Função não é never se catch trata
    return;  // ❌ Error - função declarada como never
  }
}
```

**Limitação:** Função `never` não pode ter branch que retorna normalmente.

## 🔗 Interconexões Conceituais

**Relação com Throw:** Throw é principal forma de criar never.

**Relação com Type Narrowing:** Never elimina tipos de unions.

**Relação com Assertion Functions:** Asserts usa never implicitamente.

**Relação com Control Flow:** Never interrompe fluxo de execução.

**Relação com Bottom Type:** Never é bottom type - nenhum valor possível.

## 🚀 Evolução e Próximos Conceitos

Dominar funções que lançam erro prepara para:
- **Nunca Retornam:** Conceito completo de never type
- **Result Type Pattern:** Alternativa a exceptions
- **Exhaustive Checking:** Garantir completude de pattern matching
- **Type-Level Programming:** Never em tipos avançados
