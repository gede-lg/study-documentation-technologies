# Generics em Interfaces: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Interfaces genéricas** (generic interfaces) são interfaces que declaram **type parameters**, permitindo que contratos sejam parametrizados por tipos. Conceitualmente, representam **contratos abstratos sobre tipos**, definindo estruturas que funcionam com múltiplos tipos mantendo type safety.

Na essência, interfaces genéricas materializam o princípio de **abstração polimórfica**, onde uma interface define **forma** (shape) sem especificar **tipo concreto**, permitindo implementações type-safe para diferentes tipos.

### Problema que Resolve

```typescript
// ❌ Sem generics - duplicação de interfaces
interface NumberRepository {
  findById(id: number): number | null;
  save(item: number): void;
  delete(id: number): void;
}

interface StringRepository {
  findById(id: number): string | null;
  save(item: string): void;
  delete(id: number): void;
}

// ❌ Sem generics - perde tipos
interface AnyRepository {
  findById(id: number): any;
  save(item: any): void;
  delete(id: number): void;
}

// ✅ Com generics - type-safe e reutilizável
interface Repository<T> {
  findById(id: number): T | null;
  save(item: T): void;
  delete(id: number): void;
}

// Implementações type-safe
class UserRepository implements Repository<User> {
  findById(id: number): User | null {
    // Implementação
    return null;
  }

  save(item: User): void {
    // item é tipado como User
  }

  delete(id: number): void {
    // Implementação
  }
}
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Interface genérica
interface Box<T> {
  //        ^^^
  // Type parameter

  value: T;
  //     ^
  // Property usa type parameter

  getValue(): T;
  //          ^
  // Method retorna type parameter

  setValue(value: T): void;
  //              ^
  // Parameter usa type parameter
}

// Implementação
class NumberBox implements Box<number> {
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  setValue(value: number): void {
    this.value = value;
  }
}

// Uso
const box: Box<number> = new NumberBox(42);
```

### Múltiplos Type Parameters

```typescript
interface Pair<T, U> {
  first: T;
  second: U;
}

interface Map<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
}

// Implementação
class SimpleMap<K, V> implements Map<K, V> {
  private items = new Map<K, V>();

  get(key: K): V | undefined {
    return this.items.get(key);
  }

  set(key: K, value: V): void {
    this.items.set(key, value);
  }

  has(key: K): boolean {
    return this.items.has(key);
  }

  delete(key: K): boolean {
    return this.items.delete(key);
  }
}
```

### Generic Function Signatures

```typescript
interface Transformer<T, U> {
  transform(input: T): U;
}

interface Predicate<T> {
  test(value: T): boolean;
}

interface Comparator<T> {
  compare(a: T, b: T): number;
}

// Implementações
class StringLengthTransformer implements Transformer<string, number> {
  transform(input: string): number {
    return input.length;
  }
}

class EvenNumberPredicate implements Predicate<number> {
  test(value: number): boolean {
    return value % 2 === 0;
  }
}

class NumberComparator implements Comparator<number> {
  compare(a: number, b: number): number {
    return a - b;
  }
}
```

## 🔍 Análise Conceitual

### 1. Interface vs Type Alias com Generics

```typescript
// Interface genérica
interface Box<T> {
  value: T;
}

// Type alias genérico
type BoxType<T> = {
  value: T;
};

// Ambos funcionam similarmente
const box1: Box<number> = { value: 42 };
const box2: BoxType<number> = { value: 42 };

// Interface pode ser estendida
interface ExtendedBox<T> extends Box<T> {
  label: string;
}

// Type alias usa intersection
type ExtendedBoxType<T> = BoxType<T> & {
  label: string;
};
```

**Diferenças:**
- **Interface**: Pode ser declarada múltiplas vezes (declaration merging)
- **Type alias**: Mais flexível (unions, tuples, mapped types)
- **Escolha**: Interfaces para POO, type aliases para utility types

### 2. Extending Generic Interfaces

```typescript
// Base interface genérica
interface Repository<T> {
  findAll(): T[];
  findById(id: number): T | null;
}

// Extends com tipo concreto
interface UserRepository extends Repository<User> {
  findByEmail(email: string): User | null;
}

// Extends mantendo genérico
interface CachedRepository<T> extends Repository<T> {
  clearCache(): void;
}

// Múltipla herança
interface AuditedRepository<T> extends Repository<T>, Auditable {
  getAuditLog(): AuditEntry[];
}

interface Auditable {
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuditEntry {
  action: string;
  timestamp: Date;
}
```

### 3. Index Signatures Genéricas

```typescript
// Index signature genérico
interface Dictionary<T> {
  [key: string]: T;
}

const scores: Dictionary<number> = {
  alice: 100,
  bob: 95,
  charlie: 87
};

const config: Dictionary<string | number> = {
  host: "localhost",
  port: 3000,
  timeout: 5000
};

// Generic record
interface Record<K extends string | number | symbol, V> {
  [key in K]: V;
}

type Roles = "admin" | "user" | "guest";
const permissions: Record<Roles, string[]> = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};
```

### 4. Function Properties

```typescript
interface Callable<T, R> {
  (arg: T): R;
  description: string;
}

// Implementação
const doubler: Callable<number, number> = Object.assign(
  (n: number) => n * 2,
  { description: "Doubles a number" }
);

console.log(doubler(5)); // 10
console.log(doubler.description); // "Doubles a number"

// Interface com métodos e call signature
interface Parser<T> {
  (input: string): T;
  validate(input: string): boolean;
  defaultValue: T;
}
```

### 5. Readonly Generics

```typescript
interface ReadonlyBox<T> {
  readonly value: T;
  getValue(): T;
}

interface ImmutableList<T> {
  readonly items: readonly T[];
  get(index: number): T | undefined;
  concat(other: ImmutableList<T>): ImmutableList<T>;
}

// Implementação
class ImmutableListImpl<T> implements ImmutableList<T> {
  readonly items: readonly T[];

  constructor(items: T[]) {
    this.items = Object.freeze([...items]);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  concat(other: ImmutableList<T>): ImmutableList<T> {
    return new ImmutableListImpl([...this.items, ...other.items]);
  }
}
```

## 🎯 Aplicabilidade

### Repository Pattern

```typescript
interface Entity {
  id: number;
}

interface Repository<T extends Entity> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

// Implementação genérica
abstract class BaseRepository<T extends Entity> implements Repository<T> {
  protected items: Map<number, T> = new Map();

  async findById(id: number): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.items.values());
  }

  async save(entity: T): Promise<T> {
    this.items.set(entity.id, entity);
    return entity;
  }

  async update(id: number, partial: Partial<T>): Promise<T> {
    const existing = this.items.get(id);
    if (!existing) throw new Error('Not found');
    
    const updated = { ...existing, ...partial };
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<void> {
    this.items.delete(id);
  }
}

interface User extends Entity {
  name: string;
  email: string;
}

class UserRepository extends BaseRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(u => u.email === email) || null;
  }
}
```

### Observer Pattern

```typescript
interface Observer<T> {
  update(data: T): void;
}

interface Observable<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

// Implementação
class EventEmitter<T> implements Observable<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Uso
interface WeatherData {
  temperature: number;
  humidity: number;
}

class WeatherDisplay implements Observer<WeatherData> {
  update(data: WeatherData): void {
    console.log(`Temperature: ${data.temperature}°C`);
    console.log(`Humidity: ${data.humidity}%`);
  }
}

const weatherStation = new EventEmitter<WeatherData>();
const display = new WeatherDisplay();

weatherStation.subscribe(display);
weatherStation.notify({ temperature: 25, humidity: 60 });
```

### Strategy Pattern

```typescript
interface Strategy<T, R> {
  execute(data: T): R;
}

class Context<T, R> {
  constructor(private strategy: Strategy<T, R>) {}

  setStrategy(strategy: Strategy<T, R>): void {
    this.strategy = strategy;
  }

  executeStrategy(data: T): R {
    return this.strategy.execute(data);
  }
}

// Strategies concretas
class SortAscending implements Strategy<number[], number[]> {
  execute(data: number[]): number[] {
    return [...data].sort((a, b) => a - b);
  }
}

class SortDescending implements Strategy<number[], number[]> {
  execute(data: number[]): number[] {
    return [...data].sort((a, b) => b - a);
  }
}

// Uso
const context = new Context<number[], number[]>(new SortAscending());
console.log(context.executeStrategy([3, 1, 2])); // [1, 2, 3]

context.setStrategy(new SortDescending());
console.log(context.executeStrategy([3, 1, 2])); // [3, 2, 1]
```

### Factory Pattern

```typescript
interface Factory<T> {
  create(...args: any[]): T;
}

// Factory genérico
class GenericFactory<T> implements Factory<T> {
  constructor(private ctor: new (...args: any[]) => T) {}

  create(...args: any[]): T {
    return new this.ctor(...args);
  }
}

class User {
  constructor(public name: string, public email: string) {}
}

class Product {
  constructor(public name: string, public price: number) {}
}

// Uso
const userFactory = new GenericFactory(User);
const user = userFactory.create("Ana", "ana@example.com");

const productFactory = new GenericFactory(Product);
const product = productFactory.create("Laptop", 1500);
```

### Serializer/Deserializer

```typescript
interface Serializer<T> {
  serialize(data: T): string;
  deserialize(json: string): T;
}

class JsonSerializer<T> implements Serializer<T> {
  serialize(data: T): string {
    return JSON.stringify(data);
  }

  deserialize(json: string): T {
    return JSON.parse(json);
  }
}

interface User {
  name: string;
  age: number;
}

const serializer = new JsonSerializer<User>();
const user: User = { name: "Ana", age: 25 };

const json = serializer.serialize(user);
console.log(json); // {"name":"Ana","age":25}

const deserialized = serializer.deserialize(json);
console.log(deserialized); // { name: "Ana", age: 25 }
```

### Iterator Pattern

```typescript
interface Iterator<T> {
  next(): IteratorResult<T>;
  hasNext(): boolean;
}

interface IteratorResult<T> {
  value: T;
  done: boolean;
}

interface Iterable<T> {
  getIterator(): Iterator<T>;
}

// Implementação
class ArrayIterator<T> implements Iterator<T> {
  private index = 0;

  constructor(private items: T[]) {}

  next(): IteratorResult<T> {
    if (this.hasNext()) {
      return {
        value: this.items[this.index++],
        done: false
      };
    }
    
    return {
      value: undefined as any,
      done: true
    };
  }

  hasNext(): boolean {
    return this.index < this.items.length;
  }
}

class Collection<T> implements Iterable<T> {
  constructor(private items: T[]) {}

  getIterator(): Iterator<T> {
    return new ArrayIterator(this.items);
  }
}

// Uso
const collection = new Collection([1, 2, 3, 4, 5]);
const iterator = collection.getIterator();

while (iterator.hasNext()) {
  console.log(iterator.next().value);
}
```

## ⚠️ Limitações

### 1. Cannot Implement Generic Interface Twice

```typescript
interface Converter<T, U> {
  convert(value: T): U;
}

// ❌ Erro: não pode implementar com tipos diferentes
// class MultiConverter implements Converter<string, number>, Converter<number, string> {
//   convert(value: string | number): string | number {
//     // Ambíguo
//   }
// }

// ✅ Solução: métodos específicos
class MultiConverter {
  convertStringToNumber(value: string): number {
    return parseInt(value);
  }

  convertNumberToString(value: number): string {
    return value.toString();
  }
}
```

### 2. Declaration Merging Complexities

```typescript
// Interface pode ser declarada múltiplas vezes
interface Box<T> {
  value: T;
}

interface Box<T> {
  getValue(): T;
}

// Merged interface
const box: Box<number> = {
  value: 42,
  getValue() {
    return this.value;
  }
};

// ❌ Erro: type parameters devem ser idênticos
// interface Box<U> {
//   setValue(value: U): void;
// }
```

## 🔗 Interconexões

### Com Type Aliases

```typescript
// Interface genérica
interface Result<T, E> {
  ok: boolean;
  value?: T;
  error?: E;
}

// Type alias helper
type Ok<T> = Result<T, never> & { ok: true; value: T };
type Err<E> = Result<never, E> & { ok: false; error: E };

function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

function err<E>(error: E): Err<E> {
  return { ok: false, error };
}
```

### Com Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - todos optional
type UserUpdate = Partial<User>;

// Pick - selecionar keys
type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

// Omit - excluir keys
type UserWithoutPassword = Omit<User, 'password'>;

// Readonly
type ImmutableUser = Readonly<User>;

// Combinar com interface genérica
interface Repository<T> {
  update(id: number, data: Partial<T>): Promise<T>;
  create(data: Omit<T, 'id'>): Promise<T>;
  findById(id: number): Promise<Readonly<T> | null>;
}
```

## 🚀 Evolução e Padrões Modernos

### Branded Types

```typescript
interface Brand<K, T> {
  __brand: K;
  value: T;
}

type Email = Brand<'Email', string>;
type UserId = Brand<'UserId', number>;

function createEmail(value: string): Email {
  // Validação
  if (!value.includes('@')) {
    throw new Error('Invalid email');
  }
  return { __brand: 'Email', value } as Email;
}

function createUserId(value: number): UserId {
  return { __brand: 'UserId', value } as UserId;
}

// Type-safe usage
const email = createEmail('user@example.com');
const userId = createUserId(123);

// ❌ Erro: tipos incompatíveis
// const wrongId: UserId = email;
```

### Higher-Kinded Types (Simulation)

```typescript
interface Functor<F> {
  map<A, B>(fa: F, f: (a: A) => B): F;
}

// Simulating with generic interfaces
interface Container<T> {
  value: T;
  map<U>(f: (value: T) => U): Container<U>;
}

class Box<T> implements Container<T> {
  constructor(public value: T) {}

  map<U>(f: (value: T) => U): Box<U> {
    return new Box(f(this.value));
  }
}
```

---

**Conclusão**: Interfaces genéricas definem contratos abstratos sobre tipos, permitindo polimorfismo type-safe. São fundamentais para design patterns, abstrações reutilizáveis, e arquiteturas modulares.
