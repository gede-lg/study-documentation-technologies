# Type Safety em Mixins

## 🎯 Introdução

**Type safety em mixins** é crucial para manter **correção em compile-time** e **IntelliSense robusto** em composições complexas. TypeScript oferece **type system sofisticado** para modelar mixins, mas sua aplicação correta requer entender **generic constraints**, **conditional types**, **mapped types**, **type inference**, e **brand types**.

Este arquivo explora técnicas avançadas de **type-level programming** para garantir que mixins sejam **100% type-safe**: preservar constructor signatures, inferir tipos compostos, validar dependencies em compile-time, criar branded types para nominal typing, e implementar type guards robustos. Abordaremos problemas comuns de type inference, workarounds para limitações do TypeScript, e patterns para criar mixins que oferecem **excelente developer experience** (DX) via autocomplete e error reporting.

## 📋 Sumário

### Fundamentos de Tipos
- Constructor types
- Generic constraints
- Type inference
- Return type preservation

### Type Constraints
- Base class constraints
- Property constraints
- Method constraints
- Interface constraints

### Advanced Type Patterns
- Conditional types
- Mapped types
- Template literal types
- Recursive types

### Type Inference
- Automatic inference
- Explicit type annotations
- Helper types
- Type assertions

### Branded Types
- Nominal typing
- Type branding patterns
- Brand checking
- Smart constructors

### Type Guards
- Runtime type checking
- Symbol-based guards
- Property-based guards
- Composite guards

## 🧠 Fundamentos de Tipos

### Constructor Types

**Constructor type básico**:

```typescript
// Tipo genérico para qualquer constructor
type Constructor<T = {}> = new (...args: any[]) => T;

// Exemplo:
// Constructor<User> = new (...args: any[]) => User
```

**Constructor com parâmetros específicos**:

```typescript
// Constructor que aceita parâmetros específicos
type SpecificConstructor<T, Args extends any[] = any[]> = new (...args: Args) => T;

// Exemplo:
type UserConstructor = SpecificConstructor<User, [name: string, age: number]>;

// Mixin com constructor signature preservado
function TypedMixin<TBase extends SpecificConstructor<any, [string, number]>>(
  Base: TBase
) {
  return class extends Base {
    // TypeScript sabe os parâmetros do constructor
    constructor(name: string, age: number) {
      super(name, age);
    }
  };
}
```

**Abstract constructor type**:

```typescript
// Para classes abstratas
type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;

function MixinForAbstract<TBase extends AbstractConstructor>(Base: TBase) {
  return class extends Base {
    // OK com classes abstratas
  };
}
```

### Generic Constraints

**Constraint simples**:

```typescript
// Mixin que requer propriedade 'name'
function NamedMixin<TBase extends Constructor<{ name: string }>>(Base: TBase) {
  return class extends Base {
    greet() {
      return `Hello, ${this.name}`; // type-safe: 'name' garantido
    }
  };
}

// ✅ OK: User tem 'name'
class User {
  constructor(public name: string) {}
}
const NamedUser = NamedMixin(User);

// ❌ ERRO: Product não tem 'name'
class Product {
  constructor(public id: number) {}
}
const NamedProduct = NamedMixin(Product);
// Error: Type 'typeof Product' does not satisfy constraint
```

**Multiple constraints**:

```typescript
// Múltiplas propriedades requeridas
function FullProfileMixin<
  TBase extends Constructor<{
    name: string;
    email: string;
    age: number;
  }>
>(Base: TBase) {
  return class extends Base {
    getProfile() {
      return `${this.name} (${this.email}), age ${this.age}`;
    }
  };
}
```

**Method constraints**:

```typescript
// Requerer métodos específicos
function CacheableMixin<
  TBase extends Constructor<{
    getData(): any[];
  }>
>(Base: TBase) {
  return class extends Base {
    private cache: any[] | null = null;
    
    getCachedData() {
      if (!this.cache) {
        this.cache = this.getData(); // type-safe
      }
      return this.cache;
    }
  };
}
```

### Type Inference

**Automática**:

```typescript
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

class User {
  constructor(public name: string) {}
}

// TypeScript infere automaticamente:
const TimestampedUser = Timestamped(User);
// typeof TimestampedUser = (typeof User) & { timestamp: number }

const user = new TimestampedUser('Alice');
// tipo de user inferido como: User & { timestamp: number }

user.name;      // ✅ string (inferido de User)
user.timestamp; // ✅ number (inferido de Timestamped)
```

**Explícita com helper type**:

```typescript
// Helper para extrair tipo de instância
type InstanceType<T extends Constructor> = T extends new (...args: any[]) => infer R ? R : never;

// Uso explícito
type TimestampedUserInstance = InstanceType<typeof TimestampedUser>;
// = User & { timestamp: number }

const user: TimestampedUserInstance = new TimestampedUser('Alice');
```

### Return Type Preservation

**Preservar tipo de retorno de mixin**:

```typescript
// Mixin com tipo de retorno explícito
function Activatable<TBase extends Constructor>(
  Base: TBase
): TBase & Constructor<{ isActive: boolean; activate(): void }> {
  return class extends Base {
    isActive = false;
    activate() {
      this.isActive = true;
    }
  } as any; // type assertion necessária
}

// Uso
const ActivatableUser = Activatable(User);
// tipo: typeof User & Constructor<{ isActive: boolean; activate(): void }>

const user = new ActivatableUser('Alice');
user.name;      // ✅ string
user.isActive;  // ✅ boolean
user.activate(); // ✅ () => void
```

## 🔒 Type Constraints

### Property Constraints

**Constraint com tipos primitivos**:

```typescript
function NumericIdMixin<TBase extends Constructor<{ id: number }>>(Base: TBase) {
  return class extends Base {
    isValidId() {
      return this.id > 0; // type-safe: id é number
    }
  };
}
```

**Constraint com tipos complexos**:

```typescript
interface Address {
  street: string;
  city: string;
}

function AddressableMixin<TBase extends Constructor<{ address: Address }>>(
  Base: TBase
) {
  return class extends Base {
    getFullAddress() {
      return `${this.address.street}, ${this.address.city}`;
    }
  };
}
```

**Constraint com optional properties**:

```typescript
function OptionalEmailMixin<TBase extends Constructor<{ email?: string }>>(
  Base: TBase
) {
  return class extends Base {
    hasEmail(): this is this & { email: string } {
      return this.email !== undefined;
    }
    
    sendEmail(subject: string) {
      if (!this.hasEmail()) {
        throw new Error('Email not available');
      }
      console.log(`Sending to ${this.email}: ${subject}`);
    }
  };
}
```

### Interface Constraints

**Constraint com interface**:

```typescript
interface Identifiable {
  id: number | string;
  getIdentifier(): string;
}

function CacheKeyMixin<TBase extends Constructor<Identifiable>>(Base: TBase) {
  return class extends Base {
    getCacheKey() {
      return `cache:${this.getIdentifier()}`;
    }
  };
}

// Uso
class User implements Identifiable {
  constructor(public id: number, public name: string) {}
  
  getIdentifier() {
    return `user-${this.id}`;
  }
}

const CacheableUser = CacheKeyMixin(User); // ✅ OK
```

**Constraint com múltiplas interfaces**:

```typescript
interface Timestamped {
  createdAt: Date;
}

interface Identifiable {
  id: number;
}

function AuditMixin<TBase extends Constructor<Timestamped & Identifiable>>(
  Base: TBase
) {
  return class extends Base {
    getAuditLog() {
      return `Entity ${this.id} created at ${this.createdAt.toISOString()}`;
    }
  };
}
```

## 🎨 Advanced Type Patterns

### Conditional Types

**Aplicar mixin condicionalmente por tipo**:

```typescript
// Mixin aplicado apenas se tipo satisfaz condição
type ConditionalMixin<
  TBase extends Constructor,
  T = InstanceType<TBase>
> = T extends { id: number }
  ? TBase & Constructor<{ identify(): string }>
  : TBase;

function identifiableMixin<TBase extends Constructor>(
  Base: TBase
): ConditionalMixin<TBase> {
  const instance = {} as InstanceType<TBase>;
  
  if ('id' in instance && typeof instance.id === 'number') {
    return class extends Base {
      identify() {
        return `ID: ${(this as any).id}`;
      }
    } as any;
  }
  
  return Base as any;
}
```

**Conditional constraint**:

```typescript
// Tipo condicional baseado em propriedade
type RequireIfHasEmail<T> = T extends { email: string }
  ? T & { sendEmail(subject: string): void }
  : T;

function emailMixin<TBase extends Constructor>(
  Base: TBase
): Constructor<RequireIfHasEmail<InstanceType<TBase>>> {
  return class extends Base {
    sendEmail(this: { email?: string }, subject: string) {
      if (this.email) {
        console.log(`Sending to ${this.email}: ${subject}`);
      }
    }
  } as any;
}
```

### Mapped Types

**Mapear propriedades**:

```typescript
// Tornar todas as propriedades readonly
function ReadonlyMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      
      // Freeze instance
      Object.freeze(this);
    }
  } as Constructor<Readonly<InstanceType<TBase>>>;
}

// Uso
class User {
  constructor(public name: string) {}
}

const ReadonlyUser = ReadonlyMixin(User);
const user = new ReadonlyUser('Alice');

user.name = 'Bob'; // ❌ Error: Cannot assign to 'name' because it is a read-only property
```

**Mapear métodos**:

```typescript
// Tipo que extrai apenas métodos
type MethodsOf<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// Mixin que loga todos os métodos
function LogMethodsMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      
      const proto = Object.getPrototypeOf(this);
      const methods = Object.getOwnPropertyNames(proto).filter(
        name => name !== 'constructor' && typeof proto[name] === 'function'
      );
      
      for (const method of methods) {
        const original = proto[method];
        proto[method] = function(...args: any[]) {
          console.log(`Calling ${method}`);
          return original.apply(this, args);
        };
      }
    }
  };
}
```

### Template Literal Types

**Type-safe string operations**:

```typescript
// Tipo para event names
type EventName<T extends string> = `on${Capitalize<T>}`;

function EventEmitterMixin<TBase extends Constructor, Events extends string>(
  Base: TBase,
  events: Events[]
) {
  return class extends Base {
    private listeners = new Map<Events, Function[]>();
    
    on(event: Events, callback: Function) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event)!.push(callback);
    }
    
    emit(event: Events, ...args: any[]) {
      this.listeners.get(event)?.forEach(cb => cb(...args));
    }
  } as TBase & Constructor<{
    on(event: Events, callback: Function): void;
    emit(event: Events, ...args: any[]): void;
  }>;
}

// Uso type-safe
const UserEvents = ['created', 'updated', 'deleted'] as const;
type UserEvent = typeof UserEvents[number];

const EventEmitterUser = EventEmitterMixin(User, UserEvents);
const user = new EventEmitterUser('Alice');

user.on('created', () => {}); // ✅ OK
user.on('invalid', () => {}); // ❌ Error: Argument of type '"invalid"' is not assignable
```

### Recursive Types

**Mixin chain type**:

```typescript
// Tipo recursivo para chain de mixins
type MixinChain<
  TBase extends Constructor,
  TMixins extends Array<(base: any) => any>
> = TMixins extends [infer First, ...infer Rest]
  ? First extends (base: TBase) => infer Result
    ? Rest extends Array<(base: any) => any>
      ? MixinChain<Constructor<Result>, Rest>
      : Constructor<Result>
    : never
  : TBase;

// Função que usa tipo recursivo
function applyMixinsTyped<
  TBase extends Constructor,
  TMixins extends Array<(base: any) => any>
>(
  Base: TBase,
  mixins: TMixins
): MixinChain<TBase, TMixins> {
  return mixins.reduce(
    (CurrentBase, mixin) => mixin(CurrentBase),
    Base
  ) as any;
}
```

## 🏷️ Branded Types

### Type Branding Pattern

**Brand symbol**:

```typescript
// Symbol único para brand
const VALIDATED_USER_BRAND = Symbol('ValidatedUser');

// Tipo branded
type ValidatedUser = User & {
  readonly [VALIDATED_USER_BRAND]: true;
};

// Mixin que adiciona brand
function ValidatedUserMixin<TBase extends Constructor<User>>(Base: TBase) {
  return class extends Base {
    [VALIDATED_USER_BRAND] = true as const;
    
    constructor(...args: any[]) {
      super(...args);
      this.validate();
    }
    
    private validate() {
      if (!this.name || this.name.length === 0) {
        throw new Error('Name is required');
      }
    }
  } as Constructor<ValidatedUser>;
}

// Type guard
function isValidatedUser(obj: any): obj is ValidatedUser {
  return obj && VALIDATED_USER_BRAND in obj;
}

// Função que aceita apenas validated users
function processValidatedUser(user: ValidatedUser) {
  console.log(`Processing validated user: ${user.name}`);
}

// Uso
class User {
  constructor(public name: string) {}
}

const ValidUser = ValidatedUserMixin(User);
const user = new ValidUser('Alice');

if (isValidatedUser(user)) {
  processValidatedUser(user); // ✅ type-safe
}

const normalUser = new User('Bob');
processValidatedUser(normalUser); // ❌ Error: not ValidatedUser
```

### Nominal Typing via Brands

**Brand type helper**:

```typescript
// Generic brand type
type Brand<K, T> = K & { __brand: T };

// Branded primitives
type Email = Brand<string, 'Email'>;
type UserId = Brand<number, 'UserId'>;
type Timestamp = Brand<number, 'Timestamp'>;

// Smart constructors
function createEmail(value: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error('Invalid email');
  }
  return value as Email;
}

function createUserId(value: number): UserId {
  if (value <= 0) {
    throw new Error('Invalid user ID');
  }
  return value as UserId;
}

// Mixin com branded types
function EmailableMixin<TBase extends Constructor<{ email: Email }>>(Base: TBase) {
  return class extends Base {
    sendEmail(subject: string) {
      // email garantidamente validado (branded)
      console.log(`Sending to ${this.email}: ${subject}`);
    }
  };
}

// Uso
class User {
  constructor(public email: Email) {}
}

const EmailableUser = EmailableMixin(User);

const validEmail = createEmail('alice@example.com');
const user = new EmailableUser(validEmail); // ✅ OK

const invalidEmail = 'not-an-email';
const user2 = new EmailableUser(invalidEmail as Email); // ❌ Error em runtime
```

## 🛡️ Type Guards

### Symbol-based Guards

```typescript
// Symbol para identificar mixin
const TIMESTAMPED_SYMBOL = Symbol('Timestamped');

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    [TIMESTAMPED_SYMBOL] = true as const;
    timestamp = Date.now();
    
    getAge() {
      return Date.now() - this.timestamp;
    }
  };
}

// Type guard usando symbol
function isTimestamped(obj: any): obj is InstanceType<ReturnType<typeof Timestamped>> {
  return obj && typeof obj === 'object' && TIMESTAMPED_SYMBOL in obj;
}

// Uso
const TimestampedUser = Timestamped(User);
const user = new TimestampedUser('Alice');

if (isTimestamped(user)) {
  console.log(user.getAge()); // ✅ type-safe
}
```

### Property-based Guards

```typescript
// Type guard baseado em propriedades
function hasTimestamp(obj: any): obj is { timestamp: number; getAge(): number } {
  return obj &&
    typeof obj === 'object' &&
    'timestamp' in obj &&
    typeof obj.timestamp === 'number' &&
    'getAge' in obj &&
    typeof obj.getAge === 'function';
}

// Uso
function processIfTimestamped(obj: any) {
  if (hasTimestamp(obj)) {
    console.log(`Age: ${obj.getAge()}ms`); // type-safe
  }
}
```

### Composite Guards

```typescript
// Combinar múltiplos type guards
function isTimestampedAndActivatable(
  obj: any
): obj is InstanceType<ReturnType<typeof Timestamped>> &
          InstanceType<ReturnType<typeof Activatable>> {
  return isTimestamped(obj) && isActivatable(obj);
}

// Uso
const Enhanced = Activatable(Timestamped(User));
const user = new Enhanced('Alice');

if (isTimestampedAndActivatable(user)) {
  console.log(user.getAge());     // ✅ de Timestamped
  console.log(user.isActive);     // ✅ de Activatable
  user.activate();                // ✅ de Activatable
}
```

### Generic Type Guards

```typescript
// Type guard genérico para qualquer mixin
function hasMixin<T>(
  obj: any,
  symbol: symbol
): obj is T {
  return obj && typeof obj === 'object' && symbol in obj;
}

// Uso
const ACTIVATABLE_SYMBOL = Symbol('Activatable');

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    [ACTIVATABLE_SYMBOL] = true as const;
    isActive = false;
    activate() { this.isActive = true; }
  };
}

type ActivatableInstance = InstanceType<ReturnType<typeof Activatable>>;

const user: any = new (Activatable(User))('Alice');

if (hasMixin<ActivatableInstance>(user, ACTIVATABLE_SYMBOL)) {
  user.activate(); // ✅ type-safe
}
```

---

**Conclusão**: Type safety em mixins requer **generic constraints** para validar bases, **conditional types** para lógica condicional, **branded types** para nominal typing, e **type guards** para runtime checking. Combine **mapped types**, **template literals**, e **recursive types** para type-level programming avançado que garante **100% type safety** em composições complexas.
