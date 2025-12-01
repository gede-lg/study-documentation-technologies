# String Literal Types

## 🎯 Introdução e Definição

### Definição Conceitual

**String literal types** são tipos TypeScript que representam **valores exatos de strings** ao invés de tipo genérico `string`. Diferentemente do tipo `string` que aceita qualquer valor textual, string literal type restringe variável a **conjunto finito de strings específicas**. Exemplo: `type Direction = "north" | "south"` aceita apenas essas duas strings exatas, rejeitando qualquer outra.

Conceitualmente, string literal types implementam **nominal typing** em strings - tipo definido por **nome/valor exato** ao invés de estrutura. Combinados com **union types**, criam **enumerações tipadas** que fornecem **autocomplete**, **type checking**, e **documentação inline**. TypeScript valida em **compile-time** que apenas valores literais permitidos sejam usados.

**Fundamento teórico:** String literal types derivam de **refinement types** - tipos que refinam tipo base (`string`) com **predicados** (valor deve ser exatamente "x" ou "y"). Implementam **closed sets** - conjunto finito de valores permitidos. Diferente de enums (nominal types separados), literal types são **structural** - compatíveis com `string` em contextos permissivos, mas restritivos em contextos tipados.

**Pattern básico:**
```typescript
// Literal type - apenas "get" ou "post"
type Method = "get" | "post";

let method: Method;
method = "get";   // ✓ OK
method = "post";  // ✓ OK
method = "put";   // ✗ Error - não está na union
```

**Diferença fundamental:**
- **`string`:** Aceita qualquer string
- **String literal:** Aceita apenas strings específicas

### Contexto Histórico e Evolução

**TypeScript 1.8 (2016):** Introdução de string literal types.

```typescript
// TypeScript 1.8 - string literal types
type Easing = "ease-in" | "ease-out" | "ease-in-out";

function animate(easing: Easing) {
  if (easing === "ease-in") {
    // ...
  }
}

animate("ease-in");   // ✓ OK
// animate("linear");  // ✗ Error
```

**Motivação inicial:** Substituir enums em casos simples, fornecer type safety para strings constantes.

**TypeScript 2.0 (2016):** Discriminated unions com literal types.

```typescript
// TypeScript 2.0 - discriminated unions
type Success = { type: "success"; data: string };
type Error = { type: "error"; message: string };
type Result = Success | Error;

function handle(result: Result) {
  if (result.type === "success") {
    console.log(result.data);  // TypeScript sabe que é Success
  } else {
    console.log(result.message);  // TypeScript sabe que é Error
  }
}
```

**TypeScript 2.4 (2017):** String enums baseados em literal types.

```typescript
// TypeScript 2.4 - string enums
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

// Equivalente a literal types
type DirectionLiteral = "UP" | "DOWN" | "LEFT" | "RIGHT";
```

**TypeScript 3.4 (2019):** `const` assertions para literal types.

```typescript
// TypeScript 3.4 - const assertions
const config = {
  method: "GET" as const,  // type: "GET" (não string)
  url: "/api/users"
} as const;

// config.method tem type "GET", não string
```

**TypeScript 4.1 (2020):** Template literal types.

```typescript
// TypeScript 4.1 - template literal types
type HTTPMethod = "GET" | "POST";
type Endpoint = `/api/${string}`;
type Route = `${HTTPMethod} ${Endpoint}`;

// Route = "GET /api/users" | "POST /api/users" | ...
```

**Antes vs Depois:**

**Pré-TypeScript 1.8 (sem literal types):**
```typescript
// Apenas string genérico ou enums
function setAlignment(align: string) {
  // Sem type safety - aceita qualquer string
}

setAlignment("left");   // OK
setAlignment("invalid");  // OK (mas incorreto)
```

**Pós-TypeScript 1.8 (com literal types):**
```typescript
// Type safety com literal types
type Alignment = "left" | "center" | "right";

function setAlignment(align: Alignment) {
  // Type safety garantido
}

setAlignment("left");   // ✓ OK
// setAlignment("invalid");  // ✗ Error
```

**Evolução de uso:**

**Era inicial (enums):**
```typescript
enum Status {
  Pending,
  Success,
  Error
}
```

**Era moderna (literal types):**
```typescript
type Status = "pending" | "success" | "error";
```

**Era template literals:**
```typescript
type HttpStatus = `${number}`;
type SuccessStatus = "200" | "201" | "204";
```

### Problema Fundamental que Resolve

String literal types resolvem problemas de **type safety com strings**, **magic strings**, e **API design**.

**Problema 1: Magic strings sem type safety**
```typescript
// Sem literal types - magic strings
function setTheme(theme: string) {
  if (theme === "light") {
    // ...
  } else if (theme === "dark") {
    // ...
  }
}

setTheme("light");   // OK
setTheme("ligt");    // Typo - aceito, mas incorreto ❌
setTheme("blue");    // Valor inválido - aceito ❌
```

**Solução: Literal types restringem valores**
```typescript
// Com literal types - type safety
type Theme = "light" | "dark";

function setTheme(theme: Theme) {
  if (theme === "light") {
    // ...
  } else {
    // theme é "dark" aqui
  }
}

setTheme("light");   // ✓ OK
// setTheme("ligt");  // ✗ Error - typo detectado
// setTheme("blue");  // ✗ Error - valor inválido
```

**Problema 2: Enums verbose para casos simples**
```typescript
// Enums são verbose para poucos valores
enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE"
}

function request(method: HttpMethod) {
  // Precisa usar HttpMethod.Get ao invés de "GET"
}

request(HttpMethod.Get);  // Verbose ❌
```

**Solução: Literal types mais simples**
```typescript
// Literal types são concisos
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function request(method: HttpMethod) {
  // Usa string diretamente
}

request("GET");  // Simples ✅
```

**Problema 3: Configuração sem autocomplete**
```typescript
// Sem literal types - sem autocomplete
interface Config {
  alignment: string;
  size: string;
}

const config: Config = {
  alignment: "centre",  // Typo - não detectado ❌
  size: "medium"
};
```

**Solução: Literal types fornecem autocomplete**
```typescript
// Com literal types - autocomplete
type Alignment = "left" | "center" | "right";
type Size = "small" | "medium" | "large";

interface Config {
  alignment: Alignment;
  size: Size;
}

const config: Config = {
  alignment: "center",  // Autocomplete disponível ✅
  // alignment: "centre",  // ✗ Error - typo detectado
  size: "medium"
};
```

**Problema 4: API inconsistente**
```typescript
// Sem literal types - valores inconsistentes
function setStatus(status: string) { }

setStatus("Success");  // Capitalizado
setStatus("success");  // Lowercase
setStatus("OK");       // Diferente
// Todos aceitos - inconsistência ❌
```

**Solução: Literal types enforçam consistência**
```typescript
// Com literal types - valores consistentes
type Status = "success" | "error" | "pending";

function setStatus(status: Status) { }

setStatus("success");  // ✓ Consistente
// setStatus("Success");  // ✗ Error - capitalização incorreta
// setStatus("OK");  // ✗ Error - valor não permitido
```

**Fundamento teórico:** String literal types implementam **closed world assumption** - apenas valores explicitamente listados são válidos.

### Importância no Ecossistema

String literal types são cruciais porque:

- **Type Safety:** Detectar erros de typo em compile-time
- **Autocomplete:** IDEs fornecem sugestões de valores válidos
- **Documentation:** Tipo documenta valores permitidos
- **API Design:** Criar APIs expressivas e type-safe
- **Refactoring:** Rename automático de valores literais
- **Runtime Safety:** Reduzir erros em production
- **Pattern Matching:** Discriminated unions para exhaustiveness checking
- **Migration:** Substituir enums por tipos mais simples

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Exact Values:** Tipo representa valores exatos, não tipo genérico
2. **Union Types:** Combinar com union para múltiplos valores
3. **Compile-time Checking:** Validação em compile-time
4. **Structural Typing:** Compatível com `string` em contextos permissivos
5. **Autocomplete:** IDEs sugerem valores válidos

### Pilares Fundamentais

- **Literal Syntax:** `"value"` como tipo
- **Union Literal:** `"a" | "b" | "c"` para múltiplos valores
- **Type Alias:** `type Name = "literal"` para reutilização
- **Const Assertion:** `as const` para inferir literal type
- **Narrowing:** Type narrowing com literal types

### Visão Geral das Nuances

- **Case Sensitivity:** "GET" e "get" são tipos diferentes
- **Widening:** Literal types podem widen para `string`
- **Const vs Let:** `const` infere literal type, `let` infere `string`
- **Template Literals:** TS 4.1+ permite template literal types
- **Index Signatures:** Literal types em object keys

## 🧠 Fundamentos Teóricos

### Basic String Literal Type

```typescript
// String literal type básico

type Direction = "north";

let direction: Direction;
direction = "north";  // ✓ OK
// direction = "south";  // ✗ Error
// direction = "North";  // ✗ Error - case sensitive
```

**Análise:** Tipo aceita apenas valor exato "north".

### Union of Literal Types

```typescript
// Union de literal types

type CardinalDirection = "north" | "south" | "east" | "west";

function move(direction: CardinalDirection) {
  console.log(`Moving ${direction}`);
}

move("north");  // ✓ OK
move("east");   // ✓ OK
// move("northeast");  // ✗ Error
```

**Union:** Combinar múltiplos literal types com `|`.

### Type Alias for Reusability

```typescript
// Type alias para reutilização

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface Request {
  method: HttpMethod;
  url: string;
}

function fetch(req: Request): void {
  // TypeScript sabe que req.method é um dos 5 valores
}

const req: Request = {
  method: "GET",
  url: "/api/users"
};
```

**Type Alias:** Reutilizar literal types em múltiplos lugares.

### Princípios e Conceitos Subjacentes

#### Const Assertion

```typescript
// Const assertion para literal types

// Sem const assertion
const config1 = {
  method: "GET",  // type: string
  timeout: 5000   // type: number
};

// Com const assertion
const config2 = {
  method: "GET",  // type: "GET"
  timeout: 5000   // type: 5000
} as const;

// config2.method tem type "GET", não string
// config2 é readonly
```

**As Const:** Inferir literal types ao invés de tipos primitivos.

#### Type Narrowing

```typescript
// Type narrowing com literal types

type Status = "idle" | "loading" | "success" | "error";

function handleStatus(status: Status) {
  if (status === "loading") {
    // TypeScript sabe que status é "loading" aqui
    console.log("Loading...");
  } else if (status === "success") {
    // TypeScript sabe que status é "success" aqui
    console.log("Success!");
  } else if (status === "error") {
    // TypeScript sabe que status é "error" aqui
    console.log("Error!");
  } else {
    // TypeScript sabe que status é "idle" aqui
    console.log("Idle");
  }
}
```

**Narrowing:** TypeScript **refina** tipo em cada branch.

### Function Return Type

```typescript
// Literal type como return type

function getStatus(): "success" | "error" {
  const success = Math.random() > 0.5;
  return success ? "success" : "error";
  
  // return "pending";  // ✗ Error - "pending" não está no return type
}

const status = getStatus();
// status tem type "success" | "error", não string
```

**Return Type:** Restringir valores retornados.

#### Discriminated Unions

```typescript
// Discriminated unions com literal types

type Circle = {
  kind: "circle";
  radius: number;
};

type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type Square = {
  kind: "square";
  size: number;
};

type Shape = Circle | Rectangle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
  }
}

const circle: Circle = { kind: "circle", radius: 10 };
console.log(getArea(circle));  // 314.159...
```

**Discriminated Union:** Literal type `kind` discrimina union members.

### Object Keys

```typescript
// Literal types em object keys

type Config = {
  theme: "light" | "dark";
  language: "en" | "pt" | "es";
  fontSize: "small" | "medium" | "large";
};

const config: Config = {
  theme: "dark",
  language: "pt",
  fontSize: "medium"
};

// Autocomplete disponível para todos os valores
```

**Object Keys:** Literal types em propriedades de objetos.

#### Array of Literals

```typescript
// Array de literal types

type Permission = "read" | "write" | "delete";

const userPermissions: Permission[] = ["read", "write"];

userPermissions.push("delete");  // ✓ OK
// userPermissions.push("execute");  // ✗ Error
```

**Array:** Array restrito a literal types específicos.

### Modelo Mental para Compreensão

Pense em string literal types como **menu de opções**:

**`string`:** Menu aberto - escolha qualquer texto
**Literal type:** Menu fechado - escolha apenas opções listadas

**Analogia - Formulário Dropdown:**

**`string`:** Campo de texto livre
**Literal type:** Dropdown com opções fixas ("small", "medium", "large")

**Metáfora - Cardápio de Restaurante:**

**`string`:** "Peça qualquer coisa"
**Literal type:** Cardápio com pratos específicos

**Fluxo de type checking:**
```
1. Desenvolvedor escreve valor string
2. TypeScript verifica se valor está na union de literais
3. Se sim, aceita (compile-time ✓)
4. Se não, erro de compilação (compile-time ✗)
5. Runtime: valor é string normal
```

**Exemplo visual:**
```
type Size = "S" | "M" | "L";

let size: Size;

size = "M";     ✓ Valor na union
size = "XL";    ✗ Valor não na union
size = "m";     ✗ Case sensitive
```

## 🔍 Análise Conceitual Profunda

### Literal Types vs Enums

```typescript
// Enums
enum ColorEnum {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

function setColorEnum(color: ColorEnum) {
  console.log(color);
}

setColorEnum(ColorEnum.Red);  // Precisa usar ColorEnum.Red

// Literal types
type ColorLiteral = "RED" | "GREEN" | "BLUE";

function setColorLiteral(color: ColorLiteral) {
  console.log(color);
}

setColorLiteral("RED");  // Usa string diretamente

// Vantagens de literal types:
// - Mais conciso
// - Sem namespace pollution
// - Compatível com strings normais
// - Melhor para JSON serialization

// Vantagens de enums:
// - Reverse mapping (numeric enums)
// - Valor único garantido
// - Namespace explícito
```

**Comparison:** Literal types são mais leves, enums mais estruturados.

#### Const vs Let

```typescript
// Const infere literal type
const method = "GET";  // type: "GET"

// Let infere string
let method2 = "GET";  // type: string

// Forçar literal type com let
let method3: "GET" = "GET";  // type: "GET"

// Ou usar const assertion
let method4 = "GET" as const;  // type: "GET"
```

**Inference:** `const` infere literal type automaticamente, `let` infere `string`.

### Widening

```typescript
// Widening de literal types

function getMethod() {
  return "GET";  // Return type inferido: string (widened)
}

const method = getMethod();  // type: string

// Prevenir widening com explicit return type
function getMethod2(): "GET" {
  return "GET";  // Return type: "GET"
}

const method2 = getMethod2();  // type: "GET"

// Ou usar const assertion
function getMethod3() {
  return "GET" as const;  // Return type: "GET"
}

const method3 = getMethod3();  // type: "GET"
```

**Widening:** Literal types podem widen para tipo primitivo - prevenir com tipo explícito ou `as const`.

#### Pattern Matching

```typescript
// Pattern matching com literal types

type Action =
  | { type: "increment"; amount: number }
  | { type: "decrement"; amount: number }
  | { type: "reset" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "increment":
      return state + action.amount;  // action.amount existe
    case "decrement":
      return state - action.amount;  // action.amount existe
    case "reset":
      return 0;  // action não tem amount
    default:
      // Exhaustiveness checking
      const _exhaustive: never = action;
      return state;
  }
}
```

**Pattern Matching:** Literal types permitem pattern matching type-safe.

### Literal Types in Generics

```typescript
// Literal types em generics

function identity<T extends string>(value: T): T {
  return value;
}

const result1 = identity("hello");  // type: "hello"
const result2 = identity("world");  // type: "world"

// Generic com constraint de literal types
type Event = "click" | "focus" | "blur";

function addEventListener<E extends Event>(
  event: E,
  handler: (event: E) => void
) {
  // ...
}

addEventListener("click", (e) => {
  // e tem type "click"
});
```

**Generics:** Literal types preservados em generics.

#### Mapping Literal Types

```typescript
// Mapping literal types

type Status = "idle" | "loading" | "success" | "error";

type StatusMessages = {
  [K in Status]: string;
};

const messages: StatusMessages = {
  idle: "Waiting...",
  loading: "Loading...",
  success: "Done!",
  error: "Failed!"
};

// TypeScript garante que todas as keys existem
```

**Mapped Types:** Criar objetos com keys baseadas em literal types.

### Index Signatures

```typescript
// Index signatures com literal types

type HttpHeader = "Content-Type" | "Authorization" | "Accept";

type Headers = {
  [K in HttpHeader]?: string;
};

const headers: Headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer token"
};

// Autocomplete funciona para keys
```

**Index Signatures:** Usar literal types como keys.

#### Conditional Types

```typescript
// Conditional types com literal types

type IsGet<T> = T extends "GET" ? true : false;

type Test1 = IsGet<"GET">;   // true
type Test2 = IsGet<"POST">;  // false

// Extract específicos literal types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ReadMethod = Extract<HttpMethod, "GET">;  // "GET"
type WriteMethod = Exclude<HttpMethod, "GET">;  // "POST" | "PUT" | "DELETE"
```

**Conditional Types:** Operar em literal types condicionalmente.

### Literal Types com Intersection

```typescript
// Intersection com literal types

type Tagged = { tag: string };
type SpecificTag = { tag: "user" | "admin" };

// Intersection
type Result = Tagged & SpecificTag;
// Result = { tag: "user" | "admin" }

const user: Result = { tag: "user" };
// const invalid: Result = { tag: "guest" };  // ✗ Error
```

**Intersection:** Literal types em intersections.

## 🎯 Aplicabilidade e Contextos

### HTTP Methods

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
```

**Raciocínio:** API design type-safe para métodos HTTP.

### Configuration

```typescript
type Theme = "light" | "dark" | "auto";
type Language = "en" | "pt" | "es";
```

**Raciocínio:** Configurações com valores permitidos.

### State Management

```typescript
type LoadingState = "idle" | "loading" | "success" | "error";
```

**Raciocínio:** Estados de aplicação type-safe.

### Event Types

```typescript
type EventType = "click" | "focus" | "blur" | "change";
```

**Raciocínio:** Event listeners type-safe.

## ⚠️ Limitações e Considerações Teóricas

### Case Sensitivity

```typescript
type Method = "GET" | "POST";

let method: Method = "GET";  // ✓ OK
// let method2: Method = "get";  // ✗ Error - case sensitive
```

**Limitação:** Literal types são case-sensitive.

### Widening Issues

```typescript
function getStatus() {
  return "success";  // Return type widened to string
}

const status: "success" | "error" = getStatus();  // ✗ Error
```

**Consideração:** Widening pode causar incompatibilidade de tipos.

### No Runtime Validation

```typescript
type Status = "active" | "inactive";

const status: Status = getUserStatus() as Status;
// Runtime: pode retornar qualquer string
```

**Limitação:** Type assertion não valida em runtime.

## 🔗 Interconexões Conceituais

**Relação com Union Types:** Literal types usam union para múltiplos valores.

**Relação com Enums:** Alternativa mais leve a enums.

**Relação com Discriminated Unions:** Base para discriminated unions.

**Relação com Type Narrowing:** Permitem narrowing type-safe.

**Relação com Template Literals:** Base para template literal types.

## 🚀 Evolução e Próximos Conceitos

Dominar string literal types prepara para:
- **Number Literal Types:** Literal types numéricos
- **Boolean Literal Types:** `true` e `false` como tipos
- **Union de Literais:** Combinar diferentes literal types
- **Template Literal Types:** String manipulation em type level
- **Conditional Types:** Tipos condicionais com literals
