# Objects com Propriedades Readonly

## 🎯 Introdução e Definição

### Definição Conceitual

**Readonly properties** são properties de objects/classes marcadas com modifier `readonly`, que **previne reatribuição** da property após inicialização. `readonly` cria **property-level immutability** - a property não pode ser modificada após ser definida, seja na declaração ou no constructor (para classes). Diferentemente de `const` (que protege binding de variável), `readonly` protege **property value** dentro de object.

Conceitualmente, `readonly` estabelece **write-once semantics** para properties - podem ser lidas infinitas vezes, mas escritas apenas uma vez (inicialização). Para **primitivos**, `readonly` garante imutabilidade completa da property. Para **objetos aninhados**, `readonly` é **shallow** (superficial) - protege a referência mas não o conteúdo do objeto referenciado.

**Fundamento teórico:** `readonly` implementa **encapsulation** - previne modificação acidental de properties que devem ser constantes. É enforcement em **compile-time** (TypeScript) - em runtime (JavaScript), properties são normais. `readonly` é puramente **type-checking feature** - desaparece após compilação.

**Imutabilidade de property** vs **imutabilidade de value**:
- **Property readonly:** Property não pode ser reatribuída
- **Deep readonly:** Property + conteúdo aninhado são readonly
- **Const:** Binding de variável não pode ser reatribuído

### Contexto Histórico e Evolução

**JavaScript (1995-presente):** Sem readonly nativo - apenas `Object.defineProperty()` com `writable: false`.

**TypeScript 1.0 (2012):** Sem `readonly` modifier.

**TypeScript 2.0 (Setembro 2016):** **Introdução do `readonly` modifier** para properties.

**Motivação para readonly:**
- Prevenir modificação acidental de properties
- Documentar intenção (property não deve mudar)
- Compile-time safety (vs runtime Object.freeze)
- Immutability patterns

**TypeScript 2.0 readonly:**
```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const p: Point = { x: 10, y: 20 };
p.x = 5;  // ❌ Error: Cannot assign to 'x' because it is a read-only property
```

**TypeScript 2.1 (Dezembro 2016):** `readonly` em **index signatures**.

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

const arr: ReadonlyStringArray = ["a", "b"];
arr[0] = "c";  // ❌ Error: Index signature readonly
```

**TypeScript 2.8 (Março 2018):** **`Readonly<T>` utility type** - torna todas properties readonly.

```typescript
interface User {
  name: string;
  age: number;
}

const user: Readonly<User> = { name: "Alice", age: 30 };
user.age = 31;  // ❌ Error: readonly
```

**TypeScript 3.4 (Março 2019):** **`as const` assertion** - readonly profundo para literals.

```typescript
const config = { port: 3000, host: "localhost" } as const;
// Type: { readonly port: 3000; readonly host: "localhost" }
```

**TypeScript 3.7 (Novembro 2019):** `readonly` em **tuple types**.

```typescript
type Point = readonly [number, number];
const p: Point = [10, 20];
p[0] = 5;  // ❌ Error: readonly tuple
```

**TypeScript 4.5 (Novembro 2021):** Melhorias em **type narrowing** com readonly.

**Evolução de práticas:**

**Era Pre-Readonly (antes 2.0):**
```typescript
interface Config {
  port: number;  // Sem proteção
}

const cfg: Config = { port: 3000 };
cfg.port = 8080;  // ✅ Permitido - sem readonly
```

**Era Readonly Basic (2.0+):**
```typescript
interface Config {
  readonly port: number;  // Protegido
}

const cfg: Config = { port: 3000 };
cfg.port = 8080;  // ❌ Error: readonly
```

**Era Utility Types (2.8+):**
```typescript
type Config = { port: number; host: string };
const cfg: Readonly<Config> = { port: 3000, host: "localhost" };
cfg.port = 8080;  // ❌ Error: readonly
```

**Era As Const (3.4+):**
```typescript
const cfg = { port: 3000, host: "localhost" } as const;
cfg.port = 8080;  // ❌ Error: readonly
```

### Problema Fundamental que Resolve

`readonly` resolve o problema de **accidental property mutation** e **lack of property immutability**.

**Problema: Modificação acidental de properties**
```typescript
// Sem readonly - property pode ser modificada
interface Point {
  x: number;
  y: number;
}

function distance(p: Point): number {
  p.x = 0;  // ⚠️ Acidental - modifica original
  p.y = 0;
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}

const point = { x: 3, y: 4 };
const d = distance(point);
console.log(point);  // { x: 0, y: 0 } - modificado!
```

**Solução: readonly previne modificação**
```typescript
// Com readonly - property protegida
interface Point {
  readonly x: number;
  readonly y: number;
}

function distance(p: Point): number {
  p.x = 0;  // ❌ Error: Cannot assign to 'x' because it is readonly
  p.y = 0;  // ❌ Error: Cannot assign to 'y' because it is readonly
  return Math.sqrt(p.x ** 2 + p.y ** 2);
}
```

**Problema: Sem proteção de configurações**
```typescript
// Sem readonly - config pode ser modificada
const CONFIG = {
  API_URL: "https://api.example.com",
  TIMEOUT: 5000
};

function setupClient() {
  CONFIG.API_URL = "https://dev.example.com";  // ⚠️ Modifica global
}
```

**Solução: readonly protege configurações**
```typescript
// Com readonly - config protegida
const CONFIG: {
  readonly API_URL: string;
  readonly TIMEOUT: number;
} = {
  API_URL: "https://api.example.com",
  TIMEOUT: 5000
};

function setupClient() {
  CONFIG.API_URL = "https://dev.example.com";  // ❌ Error: readonly
}
```

**Problema: Class properties mutáveis**
```typescript
// Sem readonly - property mutável
class User {
  id: number;
  name: string;
  
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

const user = new User(1, "Alice");
user.id = 999;  // ⚠️ ID não deveria mudar
```

**Solução: readonly protege properties**
```typescript
// Com readonly - property protegida
class User {
  readonly id: number;
  name: string;
  
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

const user = new User(1, "Alice");
user.id = 999;  // ❌ Error: Cannot assign to 'id' because it is readonly
user.name = "Bob";  // ✅ OK - name não é readonly
```

**Fundamento teórico:** `readonly` implementa **principle of least privilege** - property só é mutável se necessário.

### Importância no Ecossistema

`readonly` é crucial porque:

- **Prevent Bugs:** Evita modificação acidental de properties
- **Intent Documentation:** Documenta que property não deve mudar
- **Compile-Time Safety:** Erros detectados antes de runtime
- **Refactoring Safety:** Mudanças em readonly detectadas
- **Immutability Patterns:** Base para functional programming
- **API Design:** Garante contratos de interface
- **Type Safety:** TypeScript enforces readonly
- **Self-Documenting Code:** Readonly sinaliza constância

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Property Immutability:** Property não pode ser modificada
2. **Compile-Time Enforcement:** TypeScript verifica readonly
3. **Shallow Immutability:** Apenas property protegida, não conteúdo
4. **Class Constructor:** Readonly pode ser inicializada em constructor
5. **Interface Contracts:** Readonly em interfaces documenta intenção

### Pilares Fundamentais

- **No Reassignment:** Property não pode ser reatribuída
- **Initialization:** Pode ser inicializada na declaração ou constructor
- **Type Checking:** Enforcement em compile-time
- **Shallow Protection:** Não protege objetos aninhados
- **Readonly Utility:** `Readonly<T>` torna todas properties readonly

### Visão Geral das Nuances

- **Readonly for Primitives:** Imutabilidade completa
- **Readonly for Objects:** Referência readonly, conteúdo mutável
- **Readonly Arrays:** Previne push/pop/splice
- **Readonly Index Signatures:** Arrays/records readonly
- **As Const:** Readonly profundo para literals

## 🧠 Fundamentos Teóricos

### Basic Readonly Properties

```typescript
// Interface com readonly properties
interface User {
  readonly id: number;
  readonly email: string;
  name: string;  // Não readonly - mutável
}

const user: User = {
  id: 1,
  email: "alice@example.com",
  name: "Alice"
};

// ❌ Não pode modificar readonly properties
user.id = 2;  // ❌ Error: Cannot assign to 'id' because it is readonly
user.email = "bob@example.com";  // ❌ Error: readonly

// ✅ Pode modificar properties não-readonly
user.name = "Bob";  // ✅ OK
```

**Análise profunda:**

**Readonly vs mutável:**
- `readonly id` → não pode modificar
- `name` → pode modificar

**Type checking:**
- TypeScript **previne** atribuição em compile-time
- JavaScript (runtime) **não tem** readonly - é normal property

**Fundamento teórico:** `readonly` é **type-level constraint** - desaparece após compilação.

### Readonly in Classes

```typescript
// Class com readonly properties
class Point {
  readonly x: number;
  readonly y: number;
  
  constructor(x: number, y: number) {
    // ✅ Pode atribuir em constructor
    this.x = x;
    this.y = y;
  }
  
  move(dx: number, dy: number) {
    // ❌ Não pode modificar fora de constructor
    this.x += dx;  // ❌ Error: Cannot assign to 'x' because it is readonly
    this.y += dy;  // ❌ Error: Cannot assign to 'y' because it is readonly
  }
}

const p = new Point(10, 20);
p.x = 5;  // ❌ Error: readonly
```

**Conceito fundamental:** Readonly properties podem ser **inicializadas** em:
1. **Declaração** da property
2. **Constructor** da classe

Depois, **não podem** ser modificadas.

### Princípios e Conceitos Subjacentes

#### Readonly with Parameter Properties

```typescript
// Parameter properties - shorthand com readonly
class User {
  constructor(
    readonly id: number,
    readonly email: string,
    public name: string
  ) {
    // Properties declaradas e inicializadas automaticamente
  }
}

const user = new User(1, "alice@example.com", "Alice");
user.id = 2;  // ❌ Error: readonly
user.name = "Bob";  // ✅ OK - public mutável
```

**Análise profunda:** **Parameter properties** declaram e inicializam properties em uma linha - `readonly` torna-as imutáveis.

#### Readonly Arrays

```typescript
// Array readonly - previne modificação
const numbers: readonly number[] = [1, 2, 3, 4, 5];

// ❌ Métodos que modificam array - não permitidos
numbers.push(6);     // ❌ Error: Property 'push' does not exist on readonly array
numbers.pop();       // ❌ Error: 'pop' does not exist
numbers.splice(0, 1); // ❌ Error: 'splice' does not exist
numbers.sort();      // ❌ Error: 'sort' does not exist

// ❌ Modificar elements por index - não permitido
numbers[0] = 10;  // ❌ Error: Index signature readonly

// ✅ Métodos que não modificam - permitidos
numbers.map(x => x * 2);     // ✅ OK - retorna novo array
numbers.filter(x => x > 2);  // ✅ OK - não modifica original
numbers.slice(0, 2);         // ✅ OK - cria cópia
```

**Fundamento teórico:** `readonly` arrays **não têm** mutating methods (push, pop, splice, etc.) - apenas non-mutating methods.

**Type signature:**
```typescript
readonly T[]  // Syntax sugar
ReadonlyArray<T>  // Equivalent long form
```

### Readonly Index Signatures

```typescript
// Index signature readonly
interface ReadonlyStringMap {
  readonly [key: string]: string;
}

const map: ReadonlyStringMap = {
  name: "Alice",
  city: "NYC"
};

// ❌ Não pode modificar via index
map["name"] = "Bob";  // ❌ Error: Index signature readonly
map["age"] = "30";    // ❌ Error: Cannot add property

// ✅ Pode ler via index
console.log(map["name"]);  // ✅ OK
```

**Conceito:** Readonly index signatures previnem **modificação via indexing**.

### Readonly with Nested Objects - Shallow Immutability

```typescript
// Readonly é SHALLOW - não protege objetos aninhados
interface User {
  readonly id: number;
  readonly profile: {
    name: string;
    age: number;
  };
}

const user: User = {
  id: 1,
  profile: { name: "Alice", age: 30 }
};

// ❌ Não pode reatribuir readonly property
user.id = 2;  // ❌ Error: readonly
user.profile = { name: "Bob", age: 25 };  // ❌ Error: readonly

// ✅ MAS pode modificar conteúdo do objeto aninhado!
user.profile.name = "Bob";  // ✅ OK - profile properties não são readonly
user.profile.age = 31;      // ✅ OK
```

**Limitação crítica:** `readonly` é **shallow** - protege referência, não conteúdo aninhado.

**Solução - Deep readonly:**
```typescript
interface User {
  readonly id: number;
  readonly profile: {
    readonly name: string;
    readonly age: number;
  };
}

const user: User = {
  id: 1,
  profile: { name: "Alice", age: 30 }
};

user.profile.name = "Bob";  // ❌ Error: readonly
```

### Modelo Mental para Compreensão

Pense em `readonly` como **etiqueta "Não Tocar"**:

**Property normal:** Pode mexer livremente
**Readonly property:** Etiqueta "Não Tocar" - só pode olhar

**Analogia - Museu:**

**Sem readonly:** Visitante pode tocar nas obras
**Com readonly:** Obra atrás de vidro - pode ver, não pode tocar

**Metáfora - Documento:**

**Property mutável:** Documento editável - pode alterar texto
**Readonly property:** Documento assinado - não pode alterar após assinatura

**Fluxo:**
```
const obj: { readonly x: number } = { x: 10 }
  ↓
obj.x → 10  (readonly - só leitura)
  ↓
obj.x = 20  ❌ Não pode escrever

const obj2: { x: number } = { x: 10 }
  ↓
obj2.x → 10  (mutável)
  ↓
obj2.x = 20  ✅ Pode escrever
```

## 🔍 Análise Conceitual Profunda

### Readonly Utility Type

```typescript
// Readonly<T> - torna todas properties readonly
interface User {
  id: number;
  name: string;
  email: string;
}

// Todas properties readonly
type ReadonlyUser = Readonly<User>;
// Equivalent to:
// {
//   readonly id: number;
//   readonly name: string;
//   readonly email: string;
// }

const user: ReadonlyUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

user.name = "Bob";  // ❌ Error: readonly
```

**Conceito avançado:** `Readonly<T>` é **mapped type** - aplica `readonly` a todas properties.

**Implementação:**
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

#### Deep Readonly with Recursive Types

```typescript
// DeepReadonly - readonly recursivo
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

interface User {
  id: number;
  profile: {
    name: string;
    address: {
      city: string;
      country: string;
    };
  };
}

const user: DeepReadonly<User> = {
  id: 1,
  profile: {
    name: "Alice",
    address: {
      city: "NYC",
      country: "USA"
    }
  }
};

user.id = 2;  // ❌ Error: readonly
user.profile.name = "Bob";  // ❌ Error: readonly (deep)
user.profile.address.city = "LA";  // ❌ Error: readonly (deep)
```

**Conceito avançado:** **Recursive mapped types** aplicam readonly profundamente em estruturas aninhadas.

### As Const Assertion

```typescript
// As const - readonly profundo + literal types
const config = {
  port: 3000,
  host: "localhost",
  features: {
    auth: true,
    cache: false
  }
} as const;

// Type inferred:
// {
//   readonly port: 3000;
//   readonly host: "localhost";
//   readonly features: {
//     readonly auth: true;
//     readonly cache: false;
//   };
// }

config.port = 8080;  // ❌ Error: readonly
config.features.auth = false;  // ❌ Error: readonly (deep)

// Array as const
const colors = ["red", "green", "blue"] as const;
// Type: readonly ["red", "green", "blue"]

colors[0] = "yellow";  // ❌ Error: readonly
colors.push("purple");  // ❌ Error: readonly array
```

**Análise profunda:** `as const` aplica:
1. **Readonly** em todas properties (recursivamente)
2. **Literal types** ao invés de widened types

### Readonly with Function Parameters

```typescript
// Function aceita readonly array - não modifica
function sum(numbers: readonly number[]): number {
  numbers.push(0);  // ❌ Error: push não existe em readonly array
  
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Caller pode passar array mutável ou readonly
const nums1 = [1, 2, 3];
const nums2: readonly number[] = [4, 5, 6];

sum(nums1);  // ✅ OK - array mutável aceito
sum(nums2);  // ✅ OK - readonly array aceito
```

**Conceito:** Função com **readonly parameter** documenta que não modifica argumento.

**Variance:**
- `readonly T[]` é **contravariant** em T
- `T[]` pode ser passado onde `readonly T[]` é esperado

#### Readonly with Return Types

```typescript
// Function retorna readonly array - caller não pode modificar
function getNumbers(): readonly number[] {
  return [1, 2, 3, 4, 5];
}

const numbers = getNumbers();
numbers.push(6);  // ❌ Error: push não existe em readonly array

// Caller precisa fazer cópia para modificar
const mutableNumbers = [...numbers];  // Spread cria cópia mutável
mutableNumbers.push(6);  // ✅ OK - cópia mutável
```

**Fundamento teórico:** Retornar `readonly` previne caller de modificar internal state.

### Readonly with Tuples

```typescript
// Readonly tuple - elements não podem ser modificados
type Point = readonly [number, number];

const p: Point = [10, 20];

p[0] = 5;  // ❌ Error: Cannot assign to '0' because it is a read-only property
p.push(30);  // ❌ Error: 'push' does not exist on readonly tuple

// Readonly rest parameters
function average(...numbers: readonly number[]): number {
  numbers.push(0);  // ❌ Error: readonly
  
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}
```

**Análise profunda:** Readonly tuples **protegem indices** e **não têm mutating methods**.

#### Readonly in Generic Constraints

```typescript
// Generic constraint - T deve ter readonly property
interface HasReadonlyId {
  readonly id: number;
}

function processEntity<T extends HasReadonlyId>(entity: T): T {
  entity.id = 999;  // ❌ Error: Cannot assign to 'id' because it is readonly
  return entity;
}

// Uso
const user = { id: 1, name: "Alice" };
processEntity(user);  // id não pode ser modificado
```

**Conceito:** Generic constraints podem requerer **readonly properties**.

### Readonly with Mapped Types

```typescript
// Mapped type - torna properties opcionais e readonly
type PartialReadonly<T> = {
  readonly [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

const user: PartialReadonly<User> = {
  id: 1,
  name: "Alice"
  // email opcional
};

user.id = 2;  // ❌ Error: readonly
user.email = "alice@example.com";  // ❌ Error: readonly
```

**Conceito avançado:** Mapped types podem combinar `readonly` com outros modifiers (`?`, etc.).

#### Readonly vs Object.freeze

```typescript
// Readonly - compile-time only
const obj1: { readonly x: number } = { x: 10 };
obj1.x = 20;  // ❌ Error em compile-time
// Em runtime (JavaScript), property é normal

// Object.freeze - runtime immutability
const obj2 = Object.freeze({ x: 10 });
obj2.x = 20;  // Falha silenciosamente (strict mode: throws)
console.log(obj2.x);  // 10 - não modificado

// Combinar readonly + freeze
const obj3: { readonly x: number } = Object.freeze({ x: 10 });
// Compile-time E runtime immutability
```

**Comparação:**

| Feature | readonly | Object.freeze |
|---------|----------|---------------|
| Enforcement | Compile-time | Runtime |
| Shallow | Yes | Yes |
| Type System | Yes | No |
| Performance | Zero cost | Small overhead |

### Readonly with Class Inheritance

```typescript
// Base class com readonly property
class Entity {
  constructor(readonly id: number) {}
}

class User extends Entity {
  constructor(id: number, public name: string) {
    super(id);
  }
  
  changeId(newId: number) {
    this.id = newId;  // ❌ Error: Cannot assign to 'id' because it is readonly
  }
}

const user = new User(1, "Alice");
user.id = 2;  // ❌ Error: readonly
```

**Análise profunda:** Readonly properties **herdadas** permanecem readonly em subclasses.

#### Readonly with Getters

```typescript
// Getter simula readonly property
class Circle {
  constructor(private _radius: number) {}
  
  // Getter - readonly access
  get radius(): number {
    return this._radius;
  }
  
  // Sem setter - readonly
}

const circle = new Circle(10);
console.log(circle.radius);  // ✅ OK - getter
circle.radius = 20;  // ❌ Error: Cannot assign (no setter)

// Vs readonly property
class Circle2 {
  constructor(readonly radius: number) {}
}

const circle2 = new Circle2(10);
console.log(circle2.radius);  // ✅ OK
circle2.radius = 20;  // ❌ Error: readonly
```

**Comparação:**

**Getter (no setter):** Computed value, pode ter lógica
**Readonly property:** Stored value, simpler

### Readonly with Type Guards

```typescript
// Type guard com readonly
function isReadonlyArray(value: unknown): value is readonly any[] {
  return Array.isArray(value);
}

function process(value: unknown) {
  if (isReadonlyArray(value)) {
    value.push(1);  // ❌ Error: push não existe em readonly array
  }
}
```

**Limitação:** Type guards em **runtime** não distinguem readonly de mutável - apenas em type level.

## 🎯 Aplicabilidade e Contextos

### Configuration Objects

```typescript
const CONFIG: {
  readonly API_URL: string;
  readonly TIMEOUT: number;
  readonly MAX_RETRIES: number;
} = {
  API_URL: "https://api.example.com",
  TIMEOUT: 5000,
  MAX_RETRIES: 3
};

// Previne modificação acidental
CONFIG.API_URL = "other";  // ❌ Error
```

**Raciocínio:** Configurações não devem mudar durante execução.

### Data Transfer Objects (DTOs)

```typescript
interface UserDTO {
  readonly id: number;
  readonly email: string;
  readonly createdAt: Date;
}

function getUser(): UserDTO {
  return {
    id: 1,
    email: "alice@example.com",
    createdAt: new Date()
  };
}

const user = getUser();
user.id = 999;  // ❌ Error - previne modificação
```

**Raciocínio:** DTOs devem ser readonly - representam dados imutáveis.

### Function Parameters

```typescript
function processItems(items: readonly Item[]): void {
  items.push({});  // ❌ Error - documenta que não modifica
  
  items.forEach(item => console.log(item));
}
```

**Raciocínio:** Readonly parameters documentam non-mutation.

## ⚠️ Limitações e Considerações Teóricas

### Shallow Immutability

```typescript
const obj: { readonly x: { y: number } } = { x: { y: 10 } };
obj.x.y = 20;  // ✅ Permitido - shallow readonly
```

**Limitação:** Readonly não protege objetos aninhados.

### Compile-Time Only

```typescript
const obj: { readonly x: number } = { x: 10 };
// Em runtime (JavaScript), property é normal
```

**Consideração:** Readonly desaparece após compilação.

### Cannot Remove Readonly

```typescript
function modify(obj: { x: number }) {
  obj.x = 20;
}

const readonly: { readonly x: number } = { x: 10 };
modify(readonly);  // ❌ Error - não pode passar readonly para mutável
```

**Limitação:** Não pode "remover" readonly para passar a função mutável.

## 🔗 Interconexões Conceituais

**Relação com Const:** Const protege binding, readonly protege property.

**Relação com Imutabilidade:** Readonly é base para immutability.

**Relação com As Const:** As const aplica readonly profundamente.

**Relação com Spread:** Spread cria cópia sem readonly.

**Relação com Object.freeze:** Freeze é runtime, readonly é compile-time.

## 🚀 Evolução e Próximos Conceitos

Dominar readonly prepara para:
- **Spread Operator:** Cópia de objects/arrays
- **Imutabilidade Profunda:** Não modificar estruturas originais
- **Functional Programming:** Paradigma immutable
- **Mapped Types:** Utility types avançados
