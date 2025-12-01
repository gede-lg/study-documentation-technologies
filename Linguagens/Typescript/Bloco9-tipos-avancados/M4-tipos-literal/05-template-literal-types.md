# Template Literal Types

## 🎯 Introdução e Definição

### Definição Conceitual

**Template literal types** são tipos TypeScript que permitem **construir novos tipos de string** usando **template string syntax** (backticks `` ` ``) com **interpolação de tipos**. Diferentemente de template strings JavaScript (runtime), template literal types operam em **type level** (compile-time), criando tipos através de **concatenação e transformação de literal types**.

Conceitualmente, template literal types implementam **string manipulation em type system** - capacidade de criar, combinar e transformar tipos de string através de patterns similares a template strings. Permitem **type-level string operations** - operações como concatenação, uppercase, lowercase, capitalize executadas em tipos ao invés de valores.

**Fundamento teórico:** Template literal types derivam de **dependent types** - tipos que dependem de valores (ou tipos) de outras expressões. Implementam **type-level computation** - computação puramente em type system sem runtime overhead. Diferente de string literals simples, template literal types permitem **parametric string types** - tipos de string parametrizados por outros tipos.

**Pattern básico:**
```typescript
// Template literal type - concatenação de tipos
type Greeting = `Hello, ${string}!`;

let greeting: Greeting;
greeting = "Hello, World!";   // ✓ OK
greeting = "Hello, TypeScript!";  // ✓ OK
greeting = "Hi, World!";      // ✗ Error - deve começar com "Hello, "
```

**Diferença fundamental:**
- **Template string (runtime):** `Hello, ${name}` - concatena valores
- **Template literal type (compile-time):** `` `Hello, ${string}` `` - descreve tipo de string

### Contexto Histórico e Evolução

**TypeScript 4.1 (2020):** Introdução de template literal types.

```typescript
// TypeScript 4.1 - template literal types
type World = "world";
type Greeting = `hello ${World}`;  // "hello world"

type EmailDomain = "gmail.com" | "yahoo.com";
type Email = `${string}@${EmailDomain}`;
// Email = `${string}@gmail.com` | `${string}@yahoo.com`
```

**Motivação inicial:** Type-safe string manipulation, CSS-in-JS types, event types, branded strings.

**TypeScript 4.1 (2020):** String manipulation utility types.

```typescript
// TypeScript 4.1 - string manipulation utilities
type Greeting = "hello world";

type Loud = Uppercase<Greeting>;      // "HELLO WORLD"
type Quiet = Lowercase<Greeting>;     // "hello world"
type Capitalized = Capitalize<Greeting>;  // "Hello world"
type Uncapitalized = Uncapitalize<Greeting>;  // "hello world"
```

**TypeScript 4.1 (2020):** Key remapping em mapped types.

```typescript
// TypeScript 4.1 - key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
```

**TypeScript 4.2 (2021):** Melhor inference com template literal types.

```typescript
// TypeScript 4.2 - melhor inference
function makeEvent<T extends string>(eventName: `${T}Changed`) {
  return eventName;
}

const event = makeEvent("valueChanged");
// event tem type "valueChanged", não string
```

**TypeScript 4.3 (2021):** Template literal types em conditional types.

```typescript
// TypeScript 4.3 - conditional types
type ExtractParam<Path extends string> = 
  Path extends `${string}/:${infer Param}/${string}` 
    ? Param 
    : never;

type Param = ExtractParam<"/users/:id/posts">;  // "id"
```

**TypeScript 4.5 (2021):** Melhor performance e inference.

```typescript
// TypeScript 4.5 - melhor performance
type Route = `/${string}`;
type ApiRoute = `/api${Route}`;
// Processamento mais rápido de template literals complexos
```

**TypeScript 4.8 (2022):** Improved intersection de template literals.

```typescript
// TypeScript 4.8 - melhor intersection
type A = `${string}foo`;
type B = `bar${string}`;
type C = A & B;  // `barfoo${string}` (melhor inference)
```

**Antes vs Depois:**

**Pré-TypeScript 4.1 (sem template literal types):**
```typescript
// Apenas string literals ou string genérico
type Greeting = "hello world";  // Literal exato
type GreetingAny = string;       // Qualquer string

// Sem pattern matching
function getUser(id: string) {
  // id pode ser qualquer string
}
```

**Pós-TypeScript 4.1 (com template literal types):**
```typescript
// Pattern matching com template literals
type UserId = `user_${number}`;

function getUser(id: UserId) {
  // id deve seguir pattern "user_123"
}

getUser("user_123");  // ✓ OK
// getUser("admin_456");  // ✗ Error
```

**Evolução de uso:**

**Era inicial (string literals):**
```typescript
type EventName = "onClick" | "onFocus" | "onBlur";
```

**Era template literals:**
```typescript
type Event = "Click" | "Focus" | "Blur";
type EventHandler = `on${Event}`;
// EventHandler = "onClick" | "onFocus" | "onBlur"
```

**Era key remapping:**
```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};
```

### Problema Fundamental que Resolve

Template literal types resolvem problemas de **type-safe string patterns**, **dynamic key generation**, e **string manipulation em type level**.

**Problema 1: Event handlers sem type safety**
```typescript
// Sem template literal types - eventos sem padrão
interface EventHandlers {
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
  // Precisa adicionar manualmente cada handler
}
```

**Solução: Template literal types geram handlers**
```typescript
// Com template literal types - handlers gerados
type Event = "click" | "focus" | "blur";
type EventHandler<E extends string> = `on${Capitalize<E>}`;

type EventHandlers = {
  [E in Event as EventHandler<E>]: () => void;
};
// { onClick: () => void; onFocus: () => void; onBlur: () => void }
```

**Problema 2: CSS-in-JS sem type safety**
```typescript
// Sem template literal types - propriedades CSS sem validação
const styles = {
  marginTop: "10px",
  paddingLeft: "20px",
  bordertopcolor: "red"  // Typo não detectado ❌
};
```

**Solução: Template literal types validam propriedades**
```typescript
// Com template literal types - propriedades validadas
type CSSProp = "margin" | "padding" | "border";
type Side = "Top" | "Right" | "Bottom" | "Left";
type CSSProperty = CSSProp | `${CSSProp}${Side}`;

type Styles = {
  [K in CSSProperty]?: string;
};

const styles: Styles = {
  marginTop: "10px",
  paddingLeft: "20px"
  // bordertopcolor: "red"  // ✗ Error - propriedade inválida
};
```

**Problema 3: Route parameters sem type extraction**
```typescript
// Sem template literal types - parâmetros sem type safety
function getRoute(path: string) {
  // Sem type safety para path
}

getRoute("/users/123");
getRoute("/invalid");  // Aceito ❌
```

**Solução: Template literal types validam routes**
```typescript
// Com template literal types - routes type-safe
type Route = `/users/${number}` | `/posts/${number}`;

function getRoute(path: Route) {
  // Type safety garantido
}

getRoute("/users/123");  // ✓ OK
// getRoute("/invalid");  // ✗ Error
```

**Problema 4: String transformation sem type preservation**
```typescript
// Sem template literal types - transformação sem type
function toUpperCase(s: string): string {
  return s.toUpperCase();
}

const result = toUpperCase("hello");
// result tem type string, não "HELLO"
```

**Solução: Template literal types preservam transformação**
```typescript
// Com template literal types - transformação type-safe
function toUpperCase<S extends string>(s: S): Uppercase<S> {
  return s.toUpperCase() as Uppercase<S>;
}

const result = toUpperCase("hello");
// result tem type "HELLO"
```

**Fundamento teórico:** Template literal types permitem **type-level string computation** - manipular strings em type system.

### Importância no Ecossistema

Template literal types são importantes porque:

- **String Patterns:** Validar patterns de strings em compile-time
- **Key Generation:** Gerar object keys dinamicamente
- **CSS-in-JS:** Type safety para propriedades CSS
- **Event Types:** Type-safe event handlers
- **Route Types:** Validar routes e extrair parameters
- **String Manipulation:** Uppercase, lowercase, capitalize em type level
- **API Design:** APIs expressivas com string types
- **Zero Cost:** Abstração compile-time sem overhead runtime

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Type-level Templates:** Template syntax em type system
2. **String Interpolation:** Interpolação de tipos em strings
3. **String Manipulation:** Uppercase, Lowercase, Capitalize, Uncapitalize
4. **Union Distribution:** Template literals distribuem sobre unions
5. **Key Remapping:** Gerar object keys com template literals

### Pilares Fundamentais

- **Template Syntax:** `` `text ${Type}` `` para templates
- **String Utilities:** `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, `Uncapitalize<T>`
- **Union Distribution:** Templates combinam com union members
- **Conditional Types:** Pattern matching com `infer`
- **Mapped Types:** Key remapping com template literals

### Visão Geral das Nuances

- **Union Distribution:** `` `${A | B}` `` expande para `` `${A}` | `${B}` ``
- **Nested Templates:** Template literals podem ser aninhados
- **Primitive Types:** `string`, `number`, `boolean`, `bigint` podem ser interpolados
- **Infinite Types:** `` `${string}` `` representa qualquer string
- **Pattern Matching:** `infer` extrai partes de template

## 🧠 Fundamentos Teóricos

### Basic Template Literal Type

```typescript
// Template literal type básico

type World = "world";
type Greeting = `hello ${World}`;  // "hello world"

let greeting: Greeting;
greeting = "hello world";  // ✓ OK
// greeting = "hello TypeScript";  // ✗ Error
```

**Análise:** Template literal type concatena literal types.

### Union Distribution

```typescript
// Template literals distribuem sobre unions

type Color = "red" | "green" | "blue";
type Quantity = "one" | "two";

type ColoredObject = `${Quantity} ${Color} box`;
// ColoredObject = "one red box" | "one green box" | "one blue box" | 
//                 "two red box" | "two green box" | "two blue box"

const box: ColoredObject = "one red box";  // ✓ OK
```

**Distribution:** Template literals criam cartesian product de unions.

### Interpolating Primitive Types

```typescript
// Interpolar primitive types

type UserId = `user_${number}`;
type IsActive = `active_${boolean}`;
type BigNum = `big_${bigint}`;

let userId: UserId;
userId = "user_123";   // ✓ OK
userId = "user_456";   // ✓ OK
// userId = "user_abc";  // ✗ Error

let active: IsActive;
active = "active_true";   // ✓ OK
active = "active_false";  // ✓ OK
```

**Primitive Interpolation:** `number`, `boolean`, `bigint` podem ser interpolados.

### Princípios e Conceitos Subjacentes

#### String Manipulation Utilities

```typescript
// Uppercase, Lowercase, Capitalize, Uncapitalize

type Greeting = "hello world";

type Loud = Uppercase<Greeting>;           // "HELLO WORLD"
type Quiet = Lowercase<Greeting>;          // "hello world"
type Capitalized = Capitalize<Greeting>;   // "Hello world"
type Uncapitalized = Uncapitalize<Greeting>;  // "hello world"

// Combinar com template literals
type Name = "john";
type UpperName = Uppercase<Name>;  // "JOHN"
type Greeting2 = `Hello, ${Capitalize<Name>}!`;  // "Hello, John!"
```

**String Utilities:** Built-in utilities transformam strings.

#### Key Remapping

```typescript
// Key remapping em mapped types

type Getters<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// Setters
type Setters<T> = {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void;
};

type UserSetters = Setters<User>;
// { setName: (value: string) => void; setAge: (value: number) => void }
```

**Key Remapping:** Gerar object keys com template literals.

### Pattern Matching with Infer

```typescript
// Pattern matching com infer

// Extrair parameter de route
type ExtractParam<Path extends string> = 
  Path extends `${string}/:${infer Param}/${string}` 
    ? Param 
    : never;

type UserIdParam = ExtractParam<"/users/:id/posts">;  // "id"
type PostIdParam = ExtractParam<"/posts/:postId">;    // "postId"

// Extrair múltiplos parameters
type ExtractParams<Path extends string> = 
  Path extends `${string}/:${infer P1}/:${infer P2}` 
    ? [P1, P2] 
    : Path extends `${string}/:${infer P}` 
      ? [P] 
      : [];

type Params1 = ExtractParams<"/users/:userId/posts/:postId">;  // ["userId", "postId"]
type Params2 = ExtractParams<"/users/:id">;  // ["id"]
```

**Infer:** Extrair partes de template literal types.

#### Event Handler Pattern

```typescript
// Event handlers com template literals

type Event = "click" | "focus" | "blur" | "change";

type EventHandler<E extends string> = `on${Capitalize<E>}`;

type EventHandlers = {
  [E in Event as EventHandler<E>]: (event: Event) => void;
};

// EventHandlers = {
//   onClick: (event: Event) => void;
//   onFocus: (event: Event) => void;
//   onBlur: (event: Event) => void;
//   onChange: (event: Event) => void;
// }

const handlers: EventHandlers = {
  onClick: (e) => console.log("Clicked"),
  onFocus: (e) => console.log("Focused"),
  onBlur: (e) => console.log("Blurred"),
  onChange: (e) => console.log("Changed")
};
```

**Event Handlers:** Gerar event handler types.

### CSS-in-JS Types

```typescript
// CSS properties com template literals

type CSSBasicProp = "margin" | "padding" | "border";
type Side = "Top" | "Right" | "Bottom" | "Left";
type Corner = "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";

type CSSProperty = 
  | CSSBasicProp 
  | `${CSSBasicProp}${Side}` 
  | `border${Corner}Radius`;

type CSSObject = {
  [K in CSSProperty]?: string | number;
};

const styles: CSSObject = {
  margin: "10px",
  marginTop: "5px",
  paddingLeft: "20px",
  borderTopLeftRadius: "5px"
};
```

**CSS Types:** Type-safe CSS properties.

#### HTTP Method + Path Pattern

```typescript
// HTTP method + path pattern

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Route = `/api/${string}`;
type HttpRoute = `${HttpMethod} ${Route}`;

type ApiRoute = 
  | "GET /api/users" 
  | "POST /api/users" 
  | "GET /api/posts" 
  | "DELETE /api/posts";

function handleRoute(route: ApiRoute) {
  // Type-safe route handling
}

handleRoute("GET /api/users");   // ✓ OK
// handleRoute("PATCH /api/users");  // ✗ Error
```

**HTTP Routes:** Combinar method e path.

### Recursive Template Literals

```typescript
// Recursive template literals

type Join<T extends string[], D extends string = ""> = 
  T extends [infer F extends string, ...infer R extends string[]] 
    ? R extends [] 
      ? F 
      : `${F}${D}${Join<R, D>}` 
    : "";

type Path = Join<["api", "users", "123"], "/">;  // "api/users/123"
type CSV = Join<["a", "b", "c"], ",">;           // "a,b,c"
```

**Recursive:** Template literals em tipos recursivos.

#### Branded String Types

```typescript
// Branded string types com template literals

type Brand<K, T> = K & { __brand: T };

type Email = Brand<string, "Email">;
type Url = Brand<string, "Url">;

// Validação com template literal
type ValidEmail = `${string}@${string}.${string}`;

function sendEmail(email: Email & ValidEmail) {
  // Email type-safe e validado
}

const email = "user@example.com" as Email & ValidEmail;
sendEmail(email);
```

**Branded Types:** Combinar branding com template literals.

### Modelo Mental para Compreensão

Pense em template literal types como **moldes de string**:

**String literal:** String exata fixa
**Template literal type:** Molde com slots para tipos

**Analogia - Mad Libs:**

**String literal:** "The cat sat on the mat" (fixo)
**Template literal:** "The ${animal} sat on the ${object}" (slots)

**Metáfora - Formulário:**

**String literal:** Formulário preenchido
**Template literal:** Formulário em branco com campos

**Fluxo de type checking:**
```
1. TypeScript expande template literal type
2. Distribui sobre unions (cartesian product)
3. Valida se valor corresponde ao pattern
4. Se sim, aceita (compile-time ✓)
5. Se não, erro de compilação (compile-time ✗)
6. Runtime: valores são strings normais
```

**Exemplo visual:**
```
type Greeting = `Hello, ${string}!`;

let msg: Greeting;

msg = "Hello, World!";     ✓ Corresponde ao pattern
msg = "Hi, World!";        ✗ Não corresponde (não começa com "Hello, ")
msg = "Hello, TypeScript"; ✗ Não corresponde (não termina com "!")
```

## 🔍 Análise Conceitual Profunda

### Template Literals vs String Literals

```typescript
// String literal - valor exato
type ExactGreeting = "hello world";

let exact: ExactGreeting;
exact = "hello world";  // ✓ OK
// exact = "hello TypeScript";  // ✗ Error

// Template literal - pattern
type PatternGreeting = `hello ${string}`;

let pattern: PatternGreeting;
pattern = "hello world";       // ✓ OK
pattern = "hello TypeScript";  // ✓ OK
// pattern = "hi world";       // ✗ Error

// Vantagens de template literals:
// - Pattern matching
// - Union distribution
// - Key generation
// - String manipulation

// Vantagens de string literals:
// - Valores exatos
// - Mais simples
```

**Comparison:** Template literals permitem patterns, string literals são exatos.

#### Cartesian Product

```typescript
// Template literals criam cartesian product de unions

type Size = "small" | "medium" | "large";
type Color = "red" | "green" | "blue";

type ClassName = `${Size}-${Color}`;
// ClassName = "small-red" | "small-green" | "small-blue" | 
//             "medium-red" | "medium-green" | "medium-blue" | 
//             "large-red" | "large-green" | "large-blue"

// 3 sizes × 3 colors = 9 combinations
```

**Cartesian Product:** Template literals criam todas as combinações.

### Nested Template Literals

```typescript
// Template literals aninhados

type Prefix = "Mr" | "Mrs";
type Name = "Smith" | "Jones";
type Suffix = "Jr" | "Sr";

type FullName = `${Prefix}. ${Name}${` ${Suffix}` | ""}`;
// FullName = "Mr. Smith Jr" | "Mr. Smith Sr" | "Mr. Smith" | 
//            "Mrs. Smith Jr" | "Mrs. Smith Sr" | "Mrs. Smith" | ...
```

**Nesting:** Template literals podem ser aninhados.

#### String Manipulation Chains

```typescript
// Encadear string manipulation utilities

type Name = "john doe";

type Step1 = Capitalize<Name>;           // "John doe"
type Step2 = Uppercase<Name>;            // "JOHN DOE"

// Combinar com template literals
type FirstName = "john";
type LastName = "doe";

type FullName = `${Capitalize<FirstName>} ${Capitalize<LastName>}`;
// FullName = "John Doe"

// Recursive manipulation
type Words<S extends string> = 
  S extends `${infer Word} ${infer Rest}` 
    ? Capitalize<Word> | Words<Rest> 
    : Capitalize<S>;

type Capitalized = Words<"hello world typescript">;
// Capitalized = "Hello" | "World" | "Typescript"
```

**Chaining:** Combinar múltiplas transformations.

### Conditional Types with Templates

```typescript
// Conditional types com template literals

// Extract file extension
type ExtractExt<Path extends string> = 
  Path extends `${string}.${infer Ext}` ? Ext : never;

type Ext1 = ExtractExt<"file.txt">;      // "txt"
type Ext2 = ExtractExt<"image.png">;     // "png"
type Ext3 = ExtractExt<"no_extension">;  // never

// Extract domain from email
type ExtractDomain<Email extends string> = 
  Email extends `${string}@${infer Domain}` ? Domain : never;

type Domain1 = ExtractDomain<"user@example.com">;  // "example.com"
type Domain2 = ExtractDomain<"invalid">;           // never
```

**Conditional Templates:** Pattern matching com infer.

#### Mapped Types with Templates

```typescript
// Mapped types com template literals

// Generate getter/setter pairs
type Accessors<T> = {
  [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<K & string>}`]: (value: T[K]) => void;
};

interface User {
  name: string;
  age: number;
}

type UserAccessors = Accessors<User>;
// {
//   getName: () => string;
//   setName: (value: string) => void;
//   getAge: () => number;
//   setAge: (value: number) => void;
// }
```

**Mapped Templates:** Gerar múltiplas keys.

### Type-level String Operations

```typescript
// Operações de string em type level

// Split string
type Split<S extends string, D extends string = ""> = 
  S extends `${infer Head}${D}${infer Tail}` 
    ? [Head, ...Split<Tail, D>] 
    : [S];

type Words = Split<"hello-world-typescript", "-">;
// ["hello", "world", "typescript"]

// Join array
type Join<T extends string[], D extends string = ""> = 
  T extends [infer F extends string, ...infer R extends string[]] 
    ? R extends [] 
      ? F 
      : `${F}${D}${Join<R, D>}` 
    : "";

type Path = Join<["api", "users", "123"], "/">;  // "api/users/123"
```

**String Operations:** Split, join em type level.

#### Utility Type Combinations

```typescript
// Combinar utility types com template literals

type EventType = "click" | "focus" | "blur";

// Create event handlers
type EventHandlers<Events extends string> = {
  [E in Events as `on${Capitalize<E>}`]: (event: Event) => void;
};

// Make all handlers optional
type OptionalHandlers = Partial<EventHandlers<EventType>>;

// Pick specific handlers
type ClickHandler = Pick<EventHandlers<EventType>, "onClick">;

// Omit specific handlers
type NonClickHandlers = Omit<EventHandlers<EventType>, "onClick">;
```

**Utility Combinations:** Combinar utilities com templates.

### Performance Considerations

```typescript
// Template literals podem gerar muitos tipos

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

// 10 × 10 = 100 tipos
type TwoDigits = `${Digit}${Digit}`;

// 10 × 10 × 10 = 1000 tipos
type ThreeDigits = `${Digit}${Digit}${Digit}`;

// Cuidado com explosão combinatorial!
// Preferir patterns menos específicos quando possível
type PhonePattern = `${string}-${string}-${string}`;  // Melhor que enumerar todos
```

**Performance:** Evitar explosão combinatorial.

## 🎯 Aplicabilidade e Contextos

### Event Handlers

```typescript
type Event = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<Event>}`;
```

**Raciocínio:** Type-safe event handler generation.

### CSS-in-JS

```typescript
type CSSProp = "margin" | "padding";
type Side = "Top" | "Right" | "Bottom" | "Left";
type CSSProperty = `${CSSProp}${Side}`;
```

**Raciocínio:** Type-safe CSS properties.

### Route Parameters

```typescript
type Route = `/users/${number}` | `/posts/${string}`;
```

**Raciocínio:** Type-safe route patterns.

### API Design

```typescript
type HttpMethod = "GET" | "POST";
type ApiRoute = `${HttpMethod} /api/${string}`;
```

**Raciocínio:** Combinar method e path.

## ⚠️ Limitações e Considerações Teóricas

### Combinatorial Explosion

```typescript
// Muitas unions criam muitos tipos
type A = "a" | "b" | "c" | "d" | "e";
type B = "1" | "2" | "3" | "4" | "5";
type C = "x" | "y" | "z";

type Combined = `${A}${B}${C}`;  // 5 × 5 × 3 = 75 tipos
```

**Limitação:** Explosão combinatorial pode degradar performance.

### Widening

```typescript
function getGreeting() {
  return "hello world";  // Return type widened to string
}

const greeting: `hello ${string}` = getGreeting();  // ✗ Error
```

**Consideração:** Widening pode causar incompatibilidade.

### No Runtime Validation

```typescript
type Email = `${string}@${string}.${string}`;

const email: Email = getUserEmail() as Email;
// Runtime: pode retornar string inválida
```

**Limitação:** Type assertion não valida em runtime.

## 🔗 Interconexões Conceituais

**Relação com String Literals:** Base para template literals.

**Relação com Union Types:** Template literals distribuem sobre unions.

**Relação com Mapped Types:** Key remapping com templates.

**Relação com Conditional Types:** Pattern matching com infer.

**Relação com Utility Types:** Uppercase, Lowercase, Capitalize, Uncapitalize.

## 🚀 Evolução e Próximos Conceitos

Dominar template literal types prepara para:
- **Discriminated Unions:** Pattern matching type-safe
- **Conditional Types:** Type-level programming avançado
- **Mapped Types:** Key remapping e transformations
- **Recursive Types:** Tipos recursivos com templates
- **Type-level Programming:** Computação em type system
