# Union de Literais para Restrição

## 🎯 Introdução e Definição

### Definição Conceitual

**Union de literais para restrição** é pattern TypeScript que combina **múltiplos literal types** (string, number, boolean) através de **union operator** (`|`) para criar **conjunto finito de valores permitidos**. Diferentemente de tipos primitivos genéricos (`string`, `number`, `boolean`) que aceitam qualquer valor, union de literais restringe valores a **lista explícita predefinida**.

Conceitualmente, union de literais implementa **enumeration types** - tipos que representam **conjunto discreto de valores nomeados**. Cria **closed set** - conjunto onde todos os membros são conhecidos em compile-time. Permite **exhaustiveness checking** - garantia que todos os valores possíveis foram tratados.

**Fundamento teórico:** Union de literais deriva de **sum types** (tagged unions) - tipo que pode ser **um de vários valores possíveis**. Implementa **disjoint union** - união de tipos disjuntos onde apenas um membro é válido por vez. Diferente de unions estruturais, literal unions criam **value-based discrimination** - discriminação baseada em valores exatos ao invés de estrutura.

**Pattern básico:**
```typescript
// Union de string literals - apenas valores específicos
type Direction = "north" | "south" | "east" | "west";

let direction: Direction;
direction = "north";  // ✓ OK
direction = "south";  // ✓ OK
direction = "up";     // ✗ Error - não está na union
```

**Diferença fundamental:**
- **`string`:** Aceita qualquer string (infinite set)
- **Union de literals:** Aceita apenas strings específicas (finite set)

### Contexto Histórico e Evolução

**TypeScript 1.8 (2016):** Introdução de union de literal types.

```typescript
// TypeScript 1.8 - union de literals
type Status = "pending" | "success" | "error";
type Priority = 1 | 2 | 3 | 4 | 5;

function setStatus(status: Status) {
  console.log(status);
}

setStatus("success");  // ✓ OK
// setStatus("loading");  // ✗ Error
```

**Motivação inicial:** Substituir enums em casos simples, fornecer type safety para valores discretos.

**TypeScript 2.0 (2016):** Discriminated unions (tagged unions).

```typescript
// TypeScript 2.0 - discriminated unions
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; size: number };
type Rectangle = { kind: "rectangle"; width: number; height: number };

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {  // kind discrimina union members
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
```

**TypeScript 2.0 (2016):** `never` type para exhaustiveness checking.

```typescript
// TypeScript 2.0 - exhaustiveness checking
type Action = "create" | "update" | "delete";

function handleAction(action: Action) {
  switch (action) {
    case "create":
      // Handle create
      break;
    case "update":
      // Handle update
      break;
    case "delete":
      // Handle delete
      break;
    default:
      const _exhaustive: never = action;  // Garante todos os casos cobertos
      throw new Error(`Unhandled action: ${_exhaustive}`);
  }
}
```

**TypeScript 2.4 (2017):** String enums baseados em union de literals.

```typescript
// TypeScript 2.4 - string enums
enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST"
}

// Equivalente a union de literals (conceito)
type DirectionLiteral = "NORTH" | "SOUTH" | "EAST" | "WEST";
```

**TypeScript 3.4 (2019):** `const` assertions para criar unions.

```typescript
// TypeScript 3.4 - const assertions
const DIRECTIONS = ["north", "south", "east", "west"] as const;
type Direction = typeof DIRECTIONS[number];  // "north" | "south" | "east" | "west"

const STATUSES = {
  Pending: "pending",
  Success: "success",
  Error: "error"
} as const;
type Status = typeof STATUSES[keyof typeof STATUSES];  // "pending" | "success" | "error"
```

**TypeScript 4.1 (2020):** Template literal types.

```typescript
// TypeScript 4.1 - template literal types
type HttpMethod = "GET" | "POST";
type Endpoint = `/api/${string}`;
type Route = `${HttpMethod} ${Endpoint}`;
// Route = "GET /api/..." | "POST /api/..."
```

**TypeScript 4.9 (2022):** `satisfies` operator para constraint checking.

```typescript
// TypeScript 4.9 - satisfies operator
type Color = "red" | "green" | "blue";

const color = "red" satisfies Color;  // ✓ OK - type: "red" (literal preservado)
// const invalid = "yellow" satisfies Color;  // ✗ Error
```

**Antes vs Depois:**

**Pré-TypeScript 1.8 (sem union de literals):**
```typescript
// Apenas primitivos genéricos ou enums
function setAlignment(align: string) {
  // Sem type safety - aceita qualquer string
}

setAlignment("left");
setAlignment("invalid");  // Aceito (mas incorreto)
```

**Pós-TypeScript 1.8 (com union de literals):**
```typescript
// Type safety com union de literals
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
enum HttpMethod {
  Get = "GET",
  Post = "POST"
}
```

**Era moderna (union de literals):**
```typescript
type HttpMethod = "GET" | "POST";
```

**Era const assertions:**
```typescript
const HTTP_METHODS = ["GET", "POST"] as const;
type HttpMethod = typeof HTTP_METHODS[number];
```

### Problema Fundamental que Resolve

Union de literais resolve problemas de **type safety com valores discretos**, **magic values**, e **configuration validation**.

**Problema 1: Magic values sem type safety**
```typescript
// Sem union de literals - magic values
function setTheme(theme: string) {
  if (theme === "light") {
    // ...
  } else if (theme === "dark") {
    // ...
  }
}

setTheme("light");   // OK
setTheme("ligt");    // Typo - aceito ❌
setTheme("blue");    // Valor inválido - aceito ❌
```

**Solução: Union de literals restringe valores**
```typescript
// Com union de literals - type safety
type Theme = "light" | "dark" | "auto";

function setTheme(theme: Theme) {
  if (theme === "light") {
    // ...
  } else if (theme === "dark") {
    // ...
  }
}

setTheme("light");   // ✓ OK
// setTheme("ligt");  // ✗ Error - typo detectado
// setTheme("blue");  // ✗ Error - valor inválido
```

**Problema 2: Configuração sem validação**
```typescript
// Sem union de literals - valores arbitrários
interface Config {
  size: string;
  color: string;
}

const config: Config = {
  size: "gigantic",  // Valor inválido - aceito ❌
  color: "#xyz"      // Cor inválida - aceito ❌
};
```

**Solução: Union de literals valida configuração**
```typescript
// Com union de literals - configuração validada
type Size = "small" | "medium" | "large";
type Color = "red" | "green" | "blue";

interface Config {
  size: Size;
  color: Color;
}

const config: Config = {
  size: "medium",  // ✓ OK
  color: "blue"    // ✓ OK
  // size: "gigantic",  // ✗ Error
  // color: "#xyz"      // ✗ Error
};
```

**Problema 3: Pattern matching sem exhaustiveness checking**
```typescript
// Sem union de literals - casos perdidos
function handleStatus(status: string) {
  switch (status) {
    case "pending":
      return "Aguardando...";
    case "success":
      return "Sucesso!";
    // Falta caso "error" - não detectado ❌
  }
}
```

**Solução: Union de literals com exhaustiveness checking**
```typescript
// Com union de literals - exhaustiveness checking
type Status = "pending" | "success" | "error";

function handleStatus(status: Status): string {
  switch (status) {
    case "pending":
      return "Aguardando...";
    case "success":
      return "Sucesso!";
    case "error":
      return "Erro!";
    default:
      const _exhaustive: never = status;  // Garante todos os casos
      return _exhaustive;
  }
}
```

**Problema 4: API design sem autocomplete**
```typescript
// Sem union de literals - sem autocomplete
function request(method: string, url: string) {
  // Sem autocomplete para method
}

request("get", "/api");  // Sem sugestões ❌
```

**Solução: Union de literals fornece autocomplete**
```typescript
// Com union de literals - autocomplete disponível
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function request(method: HttpMethod, url: string) {
  // Autocomplete sugere métodos válidos
}

request("GET", "/api");  // IDE sugere valores ✅
```

**Fundamento teórico:** Union de literais implementa **closed world assumption** - apenas valores explicitamente listados são válidos.

### Importância no Ecossistema

Union de literais é crucial porque:

- **Type Safety:** Detectar valores inválidos em compile-time
- **Autocomplete:** IDEs fornecem sugestões de valores válidos
- **Documentation:** Tipo documenta valores permitidos
- **API Design:** Criar APIs expressivas e type-safe
- **Refactoring:** Rename automático de valores literais
- **Exhaustiveness:** Garantir todos os casos tratados
- **Discriminated Unions:** Base para pattern matching
- **Zero Cost:** Abstração compile-time sem overhead runtime

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Finite Sets:** Conjunto finito de valores permitidos
2. **Union Operator:** `|` combina literal types
3. **Mixed Types:** Combinar strings, numbers, booleans
4. **Exhaustiveness:** Garantir todos os valores tratados
5. **Autocomplete:** IDEs sugerem valores válidos

### Pilares Fundamentais

- **Union Syntax:** `"a" | "b" | "c"` para múltiplos valores
- **Type Alias:** `type Name = "a" | "b"` para reutilização
- **Const Assertion:** `as const` para criar unions de arrays/objects
- **Narrowing:** Type narrowing com valores literais
- **Discriminated Unions:** Pattern matching type-safe

### Visão Geral das Nuances

- **Mixed Types:** Union pode misturar string, number, boolean literals
- **Const Assertions:** `as const` cria union de array elements
- **Object Keys:** Union de object values via `typeof obj[keyof typeof obj]`
- **Template Literals:** Combinar unions com template literals
- **Exhaustiveness:** `never` type garante todos os casos cobertos

## 🧠 Fundamentos Teóricos

### Basic Union of Literals

```typescript
// Union básica de string literals

type Direction = "north" | "south" | "east" | "west";

let direction: Direction;
direction = "north";  // ✓ OK
direction = "south";  // ✓ OK
// direction = "up";  // ✗ Error
```

**Análise:** Union combina literal types com `|`.

### Mixed Type Unions

```typescript
// Union misturando diferentes tipos de literals

type MixedUnion = "hello" | 42 | true;

let value: MixedUnion;
value = "hello";  // ✓ OK (string literal)
value = 42;       // ✓ OK (number literal)
value = true;     // ✓ OK (boolean literal)
// value = "world";  // ✗ Error
// value = 43;       // ✗ Error
// value = false;    // ✗ Error
```

**Mixed Types:** Union pode combinar strings, numbers, booleans.

### Type Alias for Reusability

```typescript
// Type alias para reutilização

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HttpStatus = 200 | 201 | 204 | 400 | 404 | 500;

interface Request {
  method: HttpMethod;
  url: string;
}

interface Response {
  status: HttpStatus;
  data?: any;
}

function fetch(req: Request): Response {
  // TypeScript sabe os valores permitidos
  return { status: 200 };
}
```

**Type Alias:** Reutilizar unions em múltiplos lugares.

### Princípios e Conceitos Subjacentes

#### Const Assertions para Arrays

```typescript
// Const assertion cria union de array elements

const DIRECTIONS = ["north", "south", "east", "west"] as const;

// typeof DIRECTIONS é readonly ["north", "south", "east", "west"]
type Direction = typeof DIRECTIONS[number];
// Direction = "north" | "south" | "east" | "west"

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

move("north");  // ✓ OK
// move("up");  // ✗ Error
```

**Const Assertion:** `as const` + indexed access cria union.

#### Const Assertions para Objects

```typescript
// Const assertion cria union de object values

const HTTP_STATUS = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  ServerError: 500
} as const;

// Union de values
type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
// HttpStatus = 200 | 201 | 400 | 404 | 500

// Union de keys
type HttpStatusName = keyof typeof HTTP_STATUS;
// HttpStatusName = "OK" | "Created" | "BadRequest" | "NotFound" | "ServerError"
```

**Object Values:** Extrair union de object values.

### Discriminated Unions

```typescript
// Discriminated unions com literal type discriminator

type SuccessResult = {
  status: "success";
  data: string;
};

type ErrorResult = {
  status: "error";
  message: string;
};

type LoadingResult = {
  status: "loading";
};

type Result = SuccessResult | ErrorResult | LoadingResult;

function handleResult(result: Result) {
  switch (result.status) {
    case "success":
      console.log(result.data);     // TypeScript sabe que é SuccessResult
      break;
    case "error":
      console.log(result.message);  // TypeScript sabe que é ErrorResult
      break;
    case "loading":
      console.log("Loading...");    // TypeScript sabe que é LoadingResult
      break;
  }
}
```

**Discriminated Union:** Literal type `status` discrimina union members.

#### Exhaustiveness Checking

```typescript
// Exhaustiveness checking com never type

type Action = "create" | "update" | "delete";

function handleAction(action: Action): void {
  switch (action) {
    case "create":
      console.log("Creating...");
      break;
    case "update":
      console.log("Updating...");
      break;
    case "delete":
      console.log("Deleting...");
      break;
    default:
      // Se todos os casos cobertos, action é never aqui
      const _exhaustive: never = action;
      throw new Error(`Unhandled action: ${_exhaustive}`);
  }
}

// Se adicionar novo valor a Action (e.g., "archive"),
// TypeScript detecta que default case não é never
```

**Exhaustiveness:** `never` type garante todos os valores tratados.

### Type Narrowing

```typescript
// Type narrowing com union de literals

type Status = "pending" | "success" | "error";

function getStatusMessage(status: Status): string {
  if (status === "pending") {
    return "Aguardando...";  // status narrowed to "pending"
  } else if (status === "success") {
    return "Concluído!";     // status narrowed to "success"
  } else {
    return "Falhou!";        // status narrowed to "error"
  }
}
```

**Narrowing:** Equality checks refinam tipo.

#### Template Literal Types

```typescript
// Union de literals com template literal types

type Size = "small" | "medium" | "large";
type Color = "red" | "green" | "blue";

type ClassName = `${Size}-${Color}`;
// ClassName = "small-red" | "small-green" | "small-blue" | 
//             "medium-red" | "medium-green" | "medium-blue" | 
//             "large-red" | "large-green" | "large-blue"

const className: ClassName = "medium-blue";  // ✓ OK
// const invalid: ClassName = "huge-yellow";  // ✗ Error
```

**Template Literals:** Combinar unions com template literals.

### Extract and Exclude

```typescript
// Extract e Exclude operam em unions

type AllColors = "red" | "green" | "blue" | "yellow" | "purple";

// Extract - extrair subset
type PrimaryColors = Extract<AllColors, "red" | "green" | "blue">;
// PrimaryColors = "red" | "green" | "blue"

// Exclude - remover subset
type NonPrimaryColors = Exclude<AllColors, "red" | "green" | "blue">;
// NonPrimaryColors = "yellow" | "purple"
```

**Extract/Exclude:** Manipular unions.

#### Generic Constraints

```typescript
// Generic constraints com union de literals

type Direction = "north" | "south" | "east" | "west";

function move<D extends Direction>(direction: D): D {
  console.log(`Moving ${direction}`);
  return direction;
}

const result = move("north");  // result tem type "north"
// move("up");  // ✗ Error - não está na union
```

**Generics:** Union de literals como constraint.

### Modelo Mental para Compreensão

Pense em union de literais como **menu de opções**:

**Tipo primitivo:** Menu aberto - escolha qualquer valor
**Union de literals:** Menu fechado - escolha apenas opções listadas

**Analogia - Dropdown:**

**`string`:** Campo de texto livre
**Union de literals:** Dropdown com opções específicas

**Metáfora - Cardápio:**

**`string`:** "Peça qualquer coisa"
**Union de literals:** Cardápio com pratos específicos

**Fluxo de type checking:**
```
1. Desenvolvedor escreve valor
2. TypeScript verifica se valor está na union
3. Se sim, aceita (compile-time ✓)
4. Se não, erro de compilação (compile-time ✗)
5. Runtime: valores são primitivos normais
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

### Union de Literals vs Enums

```typescript
// Enums
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

function setColorEnum(color: Color) {
  console.log(color);
}

setColorEnum(Color.Red);  // Precisa usar Color.Red

// Union de literals
type ColorLiteral = "RED" | "GREEN" | "BLUE";

function setColorLiteral(color: ColorLiteral) {
  console.log(color);
}

setColorLiteral("RED");  // Usa string diretamente

// Vantagens de union de literals:
// - Mais conciso
// - Sem código JavaScript gerado (zero-cost)
// - Compatível com primitivos
// - Melhor para JSON serialization
// - Const assertions criam unions facilmente

// Vantagens de enums:
// - Reverse mapping (numeric enums)
// - Namespace explícito
// - Auto-increment (numeric enums)
```

**Comparison:** Union de literals é zero-cost, enums geram runtime code.

#### Combining Multiple Unions

```typescript
// Combinar múltiplas unions

type Size = "small" | "medium" | "large";
type Color = "red" | "green" | "blue";

// Cartesian product com template literals
type SizeColor = `${Size}-${Color}`;
// SizeColor = "small-red" | "small-green" | ... (9 combinations)

// Union de unions
type SizeOrColor = Size | Color;
// SizeOrColor = "small" | "medium" | "large" | "red" | "green" | "blue"

// Intersection (não aplicável a literal unions - resultado never)
type Impossible = Size & Color;  // never (não há overlap)
```

**Combinations:** Combinar unions via template literals ou union operator.

### Const Assertions Patterns

```typescript
// Patterns com const assertions

// Pattern 1: Array to union
const ROLES = ["admin", "user", "guest"] as const;
type Role = typeof ROLES[number];  // "admin" | "user" | "guest"

// Pattern 2: Object values to union
const STATUS_CODES = {
  OK: 200,
  NotFound: 404,
  ServerError: 500
} as const;
type StatusCode = typeof STATUS_CODES[keyof typeof STATUS_CODES];
// StatusCode = 200 | 404 | 500

// Pattern 3: Object keys to union
type StatusName = keyof typeof STATUS_CODES;
// StatusName = "OK" | "NotFound" | "ServerError"

// Pattern 4: Nested object
const CONFIG = {
  themes: {
    light: "LIGHT",
    dark: "DARK"
  },
  sizes: {
    small: "S",
    large: "L"
  }
} as const;
type Theme = typeof CONFIG.themes[keyof typeof CONFIG.themes];
// Theme = "LIGHT" | "DARK"
```

**Const Patterns:** Extrair unions de estruturas com `as const`.

#### Branded Types with Unions

```typescript
// Branded types com union de literals

type Brand<K, T> = K & { __brand: T };

type UserId = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;

type UserStatus = "active" | "inactive" | "banned";
type BrandedUserStatus = Brand<UserStatus, "UserStatus">;

function setUserStatus(userId: UserId, status: BrandedUserStatus) {
  // Type-safe - userId e status são branded
}

// Precisa cast para criar branded values
const userId = 123 as UserId;
const status = "active" as BrandedUserStatus;

setUserStatus(userId, status);
```

**Branded Types:** Combinar unions com branded types.

### Recursive Unions

```typescript
// Recursive unions (limitado com literals)

type JsonPrimitive = string | number | boolean | null;
type JsonArray = Json[];
type JsonObject = { [key: string]: Json };

type Json = JsonPrimitive | JsonArray | JsonObject;

// Union de literals recursiva (limitado)
type NestedStatus = "idle" | `loading-${number}` | "success" | "error";
```

**Recursive:** Unions recursivos com template literals.

#### Conditional Types with Unions

```typescript
// Conditional types operam em unions distributivamente

type StringOrNumber = string | number;

// Conditional distribui sobre union
type IsString<T> = T extends string ? true : false;

type Test = IsString<StringOrNumber>;
// Test = IsString<string> | IsString<number>
//      = true | false
//      = boolean

// Non-distributive (usando tuple)
type IsStringNonDist<T> = [T] extends [string] ? true : false;

type Test2 = IsStringNonDist<StringOrNumber>;
// Test2 = false (union não satisfaz string)
```

**Conditional Distribution:** Conditional types distribuem sobre unions.

### Mapped Types with Unions

```typescript
// Mapped types com union de literals

type Status = "idle" | "loading" | "success" | "error";

// Map union to object
type StatusFlags = {
  [K in Status]: boolean;
};
// StatusFlags = { idle: boolean; loading: boolean; success: boolean; error: boolean }

// Map with value transformation
type StatusMessages = {
  [K in Status]: `Status is ${K}`;
};
// StatusMessages = { idle: "Status is idle"; loading: "Status is loading"; ... }

const messages: StatusMessages = {
  idle: "Status is idle",
  loading: "Status is loading",
  success: "Status is success",
  error: "Status is error"
};
```

**Mapped Types:** Transformar union em object type.

#### Utility Types with Unions

```typescript
// Utility types operam em unions

type AllStatus = "pending" | "success" | "error" | "cancelled";

// Partial - torna propriedades optional
type PartialStatus = Partial<{ status: AllStatus }>;
// { status?: AllStatus }

// Record - cria object type
type StatusMap = Record<AllStatus, string>;
// { pending: string; success: string; error: string; cancelled: string }

// Exclude - remove membros
type ActiveStatus = Exclude<AllStatus, "cancelled">;
// "pending" | "success" | "error"

// Extract - extrai membros
type FinalStatus = Extract<AllStatus, "success" | "error">;
// "success" | "error"

// NonNullable - remove null/undefined
type NonNull = NonNullable<AllStatus | null | undefined>;
// AllStatus
```

**Utility Types:** Manipular unions com utility types.

## 🎯 Aplicabilidade e Contextos

### API Design

```typescript
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type HttpStatus = 200 | 201 | 204 | 400 | 404 | 500;
```

**Raciocínio:** Type-safe HTTP methods e status codes.

### Configuration

```typescript
type Theme = "light" | "dark" | "auto";
type Language = "en" | "pt" | "es" | "fr";
type Size = "small" | "medium" | "large";
```

**Raciocínio:** Configurações com valores permitidos.

### State Management

```typescript
type LoadingState = "idle" | "loading" | "success" | "error";
```

**Raciocínio:** Estados de aplicação type-safe.

### Discriminated Unions

```typescript
type Result = 
  | { type: "success"; data: string }
  | { type: "error"; message: string };
```

**Raciocínio:** Pattern matching type-safe.

## ⚠️ Limitações e Considerações Teóricas

### Case Sensitivity

```typescript
type Status = "SUCCESS" | "ERROR";

let status: Status = "SUCCESS";  // ✓ OK
// let status2: Status = "success";  // ✗ Error - case sensitive
```

**Limitação:** Unions são case-sensitive.

### Widening

```typescript
function getStatus() {
  return "success";  // Return type widened to string
}

const status: "success" | "error" = getStatus();  // ✗ Error
```

**Consideração:** Widening pode causar incompatibilidade.

### Large Unions

```typescript
// Unions muito grandes são verbosas
type AllColors = "red" | "green" | "blue" | "yellow" | "purple" | 
                 "orange" | "pink" | "brown" | "black" | "white" | ...;
```

**Limitação:** Unions grandes são difíceis de manter.

## 🔗 Interconexões Conceituais

**Relação com Literal Types:** Union combina literal types.

**Relação com Discriminated Unions:** Base para pattern matching.

**Relação com Template Literals:** Combinar unions via templates.

**Relação com Enums:** Alternativa zero-cost a enums.

**Relação com Const Assertions:** `as const` cria unions facilmente.

## 🚀 Evolução e Próximos Conceitos

Dominar union de literais prepara para:
- **Template Literal Types:** String manipulation em type level
- **Discriminated Unions:** Pattern matching type-safe
- **Conditional Types:** Type-level programming
- **Mapped Types:** Transformar unions em objects
- **Utility Types:** Manipular unions com utilities
