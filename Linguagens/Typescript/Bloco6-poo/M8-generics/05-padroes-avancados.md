# Padrões Avançados com Generics em POO: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Padrões avançados com generics em POO** são técnicas sofisticadas que combinam generics com type system features avançados (conditional types, mapped types, infer, template literals) e design patterns clássicos para criar abstrações type-safe altamente reutilizáveis. Conceitualmente, representam **meta-programação a nível de tipos**, onde tipos são computados, transformados e manipulados dinamicamente.

Na essência, padrões avançados materializam o princípio de **type-level programming**, onde lógica complexa é expressa no type system, garantindo correção em compile-time sem overhead em runtime.

## 📋 Fundamentos

### Fluent API com Method Chaining

```typescript
class QueryBuilder<T> {
  private _select?: (keyof T)[];
  private _where?: Partial<T>;
  private _orderBy?: keyof T;

  select<K extends keyof T>(...fields: K[]): QueryBuilder<Pick<T, K>> {
    //                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Retorna novo tipo com apenas campos selecionados
    const newBuilder = new QueryBuilder<Pick<T, K>>();
    newBuilder._select = fields;
    return newBuilder;
  }

  where(conditions: Partial<T>): this {
    this._where = conditions;
    return this;
  }

  orderBy(field: keyof T): this {
    this._orderBy = field;
    return this;
  }

  execute(): Promise<T[]> {
    // Executa query
    return Promise.resolve([]);
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Uso
const query = new QueryBuilder<User>()
  .select('name', 'email')  // QueryBuilder<Pick<User, 'name' | 'email'>>
  .where({ age: 25 })
  .orderBy('name')
  .execute();

// Type: Promise<{ name: string; email: string }[]>
```

### Builder Pattern com Type-State

```typescript
// Estados do builder
type BuilderState = 'empty' | 'hasName' | 'hasEmail' | 'complete';

class UserBuilder<S extends BuilderState = 'empty'> {
  private name?: string;
  private email?: string;
  private age?: number;

  // setName disponível apenas se não tem name
  setName(this: UserBuilder<'empty'>, name: string): UserBuilder<'hasName'> {
    const builder = new UserBuilder<'hasName'>();
    builder.name = name;
    return builder;
  }

  // setEmail disponível apenas se tem name
  setEmail(this: UserBuilder<'hasName'>, email: string): UserBuilder<'hasEmail'> {
    const builder = new UserBuilder<'hasEmail'>();
    builder.name = this.name;
    builder.email = email;
    return builder;
  }

  // setAge disponível se tem email
  setAge(this: UserBuilder<'hasEmail'>, age: number): UserBuilder<'complete'> {
    const builder = new UserBuilder<'complete'>();
    builder.name = this.name;
    builder.email = this.email;
    builder.age = age;
    return builder;
  }

  // build() apenas disponível quando complete
  build(this: UserBuilder<'complete'>): User {
    return {
      name: this.name!,
      email: this.email!,
      age: this.age!
    };
  }
}

interface User {
  name: string;
  email: string;
  age: number;
}

// Uso type-safe
const user = new UserBuilder()
  .setName('Ana')      // UserBuilder<'hasName'>
  .setEmail('ana@example.com')  // UserBuilder<'hasEmail'>
  .setAge(25)          // UserBuilder<'complete'>
  .build();            // User

// ❌ Erro: não pode build() sem completar
// const invalid = new UserBuilder().setName('Ana').build();
```

### Repository Pattern com Generics Avançados

```typescript
interface Entity {
  id: number;
}

interface Repository<T extends Entity> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
}

// Base repository com query methods
abstract class BaseRepository<T extends Entity> implements Repository<T> {
  protected abstract tableName: string;

  async findById(id: number): Promise<T | null> {
    // Implementação
    return null;
  }

  async findAll(): Promise<T[]> {
    // Implementação
    return [];
  }

  async save(entity: T): Promise<T> {
    // Implementação
    return entity;
  }

  async delete(id: number): Promise<void> {
    // Implementação
  }

  // Query builder genérico
  where<K extends keyof T>(field: K, value: T[K]): QueryBuilder<T> {
    return new QueryBuilder<T>().where({ [field]: value } as any);
  }

  // Busca por campo específico
  async findBy<K extends keyof T>(field: K, value: T[K]): Promise<T[]> {
    // Implementação
    return [];
  }
}

// Implementação concreta
interface User extends Entity {
  name: string;
  email: string;
  age: number;
}

class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';

  // Métodos específicos de User
  async findByEmail(email: string): Promise<User | null> {
    return this.findBy('email', email).then(users => users[0] || null);
  }

  async findAdults(): Promise<User[]> {
    return this.where('age', 18 as any).execute();
  }
}

class QueryBuilder<T> {
  where(conditions: Partial<T>): this {
    return this;
  }

  execute(): Promise<T[]> {
    return Promise.resolve([]);
  }
}
```

### Factory Pattern com Dependency Injection

```typescript
// Registry de tipos
type FactoryRegistry = {
  'user': User;
  'product': Product;
  'order': Order;
};

// Factory genérico
class Factory {
  private constructors = new Map<string, new (...args: any[]) => any>();

  register<K extends keyof FactoryRegistry>(
    key: K,
    ctor: new (...args: any[]) => FactoryRegistry[K]
  ): void {
    this.constructors.set(key, ctor);
  }

  create<K extends keyof FactoryRegistry>(
    key: K,
    ...args: any[]
  ): FactoryRegistry[K] {
    const ctor = this.constructors.get(key);
    if (!ctor) throw new Error(`No constructor for ${key}`);
    return new ctor(...args);
  }
}

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  productIds: number[];
}

class UserImpl implements User {
  constructor(public id: number, public name: string) {}
}

class ProductImpl implements Product {
  constructor(public id: number, public name: string, public price: number) {}
}

// Uso
const factory = new Factory();
factory.register('user', UserImpl);
factory.register('product', ProductImpl);

const user = factory.create('user', 1, 'Ana'); // User
const product = factory.create('product', 1, 'Laptop', 1500); // Product
```

## 🔍 Análise Conceitual

### 1. Conditional Types em Classes

```typescript
// Result type condicional
type Result<T, E = Error> = T extends void
  ? { ok: true } | { ok: false; error: E }
  : { ok: true; value: T } | { ok: false; error: E };

class Operation<T, E = Error> {
  async execute(): Promise<Result<T, E>> {
    try {
      const value = await this.perform();
      return this.createSuccess(value);
    } catch (error) {
      return { ok: false, error: error as E };
    }
  }

  protected async perform(): Promise<T> {
    throw new Error('Not implemented');
  }

  private createSuccess(value: T): Result<T, E> {
    // Conditional return baseado em T
    if (value === undefined) {
      return { ok: true } as Result<T, E>;
    }
    return { ok: true, value } as Result<T, E>;
  }
}

// Uso
class FetchUser extends Operation<User, string> {
  protected async perform(): Promise<User> {
    return { id: 1, name: 'Ana', email: 'ana@example.com', age: 25 };
  }
}

const result = await new FetchUser().execute();
if (result.ok && 'value' in result) {
  console.log(result.value.name);
}
```

### 2. Mapped Types em Repositories

```typescript
// Gera métodos findBy<Field> automaticamente
type FindByMethods<T> = {
  [K in keyof T as `findBy${Capitalize<string & K>}`]: (value: T[K]) => Promise<T[]>;
};

interface User {
  id: number;
  name: string;
  email: string;
}

// Type: {
//   findById(value: number): Promise<User[]>;
//   findByName(value: string): Promise<User[]>;
//   findByEmail(value: string): Promise<User[]>;
// }
type UserFindMethods = FindByMethods<User>;

class UserRepository implements Partial<UserFindMethods> {
  async findByEmail(value: string): Promise<User[]> {
    // Implementação
    return [];
  }

  async findByName(value: string): Promise<User[]> {
    // Implementação
    return [];
  }
}
```

### 3. Infer em Generic Classes

```typescript
// Extrai tipo de retorno de método
type ExtractReturnType<T> = T extends { execute(): infer R } ? R : never;

class AsyncOperation<T> {
  async execute(): Promise<T> {
    return {} as T;
  }
}

type OperationResult = ExtractReturnType<AsyncOperation<User>>;
// Type: Promise<User>

// Unwrap Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

type UnwrappedResult = Awaited<OperationResult>;
// Type: User
```

### 4. Variance em Generics

```typescript
// Covariance - Array<T> é covariante
class Animal {
  name: string = '';
}

class Dog extends Animal {
  breed: string = '';
}

// ✅ OK: Dog[] é subtipo de Animal[]
const dogs: Dog[] = [];
const animals: Animal[] = dogs; // Covariant

// Contravariance - funções são contravariantes em parâmetros
type Handler<T> = (item: T) => void;

const handleAnimal: Handler<Animal> = (animal) => {
  console.log(animal.name);
};

const handleDog: Handler<Dog> = handleAnimal; // ✅ OK: Contravariant

// Invariance - classes mutáveis são invariantes
class Box<T> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
}

const dogBox = new Box<Dog>(new Dog());
// ❌ Erro: Box<Dog> não é subtipo de Box<Animal> (invariant)
// const animalBox: Box<Animal> = dogBox;
```

### 5. Higher-Order Generics

```typescript
// Generic que recebe outro generic
type Container<T> = { value: T };

class Functor<F extends <T>(...args: any[]) => any> {
  map<A, B>(fa: ReturnType<F>, f: (a: A) => B): any {
    // Implementação abstrata
  }
}

// Monad pattern
interface Monad<T> {
  flatMap<U>(f: (value: T) => Monad<U>): Monad<U>;
  map<U>(f: (value: T) => U): Monad<U>;
}

class Maybe<T> implements Monad<T> {
  constructor(private value: T | null) {}

  flatMap<U>(f: (value: T) => Maybe<U>): Maybe<U> {
    if (this.value === null) return new Maybe<U>(null);
    return f(this.value);
  }

  map<U>(f: (value: T) => U): Maybe<U> {
    if (this.value === null) return new Maybe<U>(null);
    return new Maybe(f(this.value));
  }

  getOrElse(defaultValue: T): T {
    return this.value ?? defaultValue;
  }
}

// Uso
const maybe = new Maybe(5)
  .map(n => n * 2)           // Maybe<number>
  .flatMap(n => new Maybe(n.toString())); // Maybe<string>

console.log(maybe.getOrElse('0')); // "10"
```

## 🎯 Aplicabilidade

### Decorator Pattern com Generics

```typescript
interface Component<T> {
  execute(): T;
}

abstract class Decorator<T> implements Component<T> {
  constructor(protected component: Component<T>) {}

  abstract execute(): T;
}

class LoggingDecorator<T> extends Decorator<T> {
  execute(): T {
    console.log('Executing...');
    const result = this.component.execute();
    console.log('Done');
    return result;
  }
}

class CachingDecorator<T> extends Decorator<T> {
  private cache: T | null = null;

  execute(): T {
    if (this.cache) return this.cache;
    this.cache = this.component.execute();
    return this.cache;
  }
}

// Componente concreto
class DataFetcher implements Component<User[]> {
  execute(): User[] {
    return [{ id: 1, name: 'Ana', email: 'ana@example.com', age: 25 }];
  }
}

// Composição
const fetcher = new CachingDecorator(
  new LoggingDecorator(new DataFetcher())
);

fetcher.execute(); // Logs + fetches + caches
fetcher.execute(); // Returns from cache
```

### Adapter Pattern com Type Transformation

```typescript
// Source e Target diferentes
interface LegacyUser {
  user_id: number;
  user_name: string;
  user_email: string;
}

interface ModernUser {
  id: number;
  name: string;
  email: string;
}

// Adapter genérico
abstract class Adapter<Source, Target> {
  abstract adapt(source: Source): Target;

  adaptMany(sources: Source[]): Target[] {
    return sources.map(s => this.adapt(s));
  }
}

class UserAdapter extends Adapter<LegacyUser, ModernUser> {
  adapt(source: LegacyUser): ModernUser {
    return {
      id: source.user_id,
      name: source.user_name,
      email: source.user_email
    };
  }
}

// Uso
const legacy: LegacyUser = {
  user_id: 1,
  user_name: 'Ana',
  user_email: 'ana@example.com'
};

const adapter = new UserAdapter();
const modern = adapter.adapt(legacy);
console.log(modern); // { id: 1, name: 'Ana', email: 'ana@example.com' }
```

### Event Emitter Type-Safe

```typescript
// Event map
type EventMap = {
  'user:created': User;
  'user:updated': User;
  'user:deleted': { id: number };
  'error': Error;
};

class EventEmitter<Events extends Record<string, any>> {
  private listeners = new Map<keyof Events, Set<(data: any) => void>>();

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  off<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }
}

// Uso type-safe
const emitter = new EventEmitter<EventMap>();

emitter.on('user:created', (user) => {
  console.log(`User created: ${user.name}`);
});

emitter.on('user:deleted', (data) => {
  console.log(`User deleted: ${data.id}`);
});

emitter.emit('user:created', { id: 1, name: 'Ana', email: 'ana@example.com', age: 25 });
emitter.emit('user:deleted', { id: 1 });

// ❌ Erro: tipo errado
// emitter.emit('user:created', { id: 1 }); // Falta name, email, age
```

### State Machine com Generics

```typescript
// Estados e transições
type State = 'idle' | 'loading' | 'success' | 'error';

type Transitions = {
  idle: 'loading';
  loading: 'success' | 'error';
  success: 'idle';
  error: 'idle';
};

class StateMachine<S extends string, T extends Record<S, S>> {
  constructor(private state: S) {}

  getState(): S {
    return this.state;
  }

  transition<From extends S, To extends T[From]>(
    from: From,
    to: To
  ): boolean {
    if (this.state !== from) return false;
    this.state = to as S;
    return true;
  }

  // Verifica se transição é válida
  canTransition<From extends S>(from: From, to: T[From]): boolean {
    return this.state === from;
  }
}

// Uso
const machine = new StateMachine<State, Transitions>('idle');

machine.transition('idle', 'loading'); // ✅ OK
machine.transition('loading', 'success'); // ✅ OK

// ❌ Erro: transição inválida
// machine.transition('success', 'loading'); // 'loading' não está em Transitions['success']
```

### Proxy Pattern com Type Preservation

```typescript
interface Subject<T> {
  request(): T;
}

class RealSubject<T> implements Subject<T> {
  constructor(private data: T) {}

  request(): T {
    console.log('RealSubject: Processing request');
    return this.data;
  }
}

class ProxySubject<T> implements Subject<T> {
  private realSubject: RealSubject<T> | null = null;

  constructor(private data: T) {}

  request(): T {
    if (!this.realSubject) {
      console.log('Proxy: Creating RealSubject');
      this.realSubject = new RealSubject(this.data);
    }
    
    console.log('Proxy: Forwarding request');
    return this.realSubject.request();
  }
}

// Uso
const proxy = new ProxySubject<User>({ id: 1, name: 'Ana', email: 'ana@example.com', age: 25 });
const user = proxy.request(); // Lazy initialization
```

## ⚠️ Limitações

### 1. Type System Complexity

```typescript
// Muito complexo - difícil manter
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

type ComplexType<T> = DeepPartial<DeepReadonly<T>>;

// ❌ Evite complexity excessiva
// class Complex<T extends ComplexType<any>> { }
```

### 2. Performance em Compile-Time

```typescript
// Types recursivos podem ser lentos
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Limitação de profundidade
type DeepNested = JSONValue[][][][][][][][]; // Pode causar slowdown
```

## 🚀 Evolução e Padrões Modernos

### Dependency Injection Container

```typescript
type Constructor<T> = new (...args: any[]) => T;

class Container {
  private services = new Map<string, any>();

  register<T>(key: string, implementation: Constructor<T>): void {
    this.services.set(key, implementation);
  }

  resolve<T>(key: string): T {
    const implementation = this.services.get(key);
    if (!implementation) throw new Error(`Service ${key} not found`);
    return new implementation();
  }
}

// Uso
const container = new Container();
container.register('UserRepository', UserRepository);

const repo = container.resolve<UserRepository>('UserRepository');
```

### Pipeline Pattern

```typescript
type Pipe<T, U> = (input: T) => U;

class Pipeline<T> {
  constructor(private value: T) {}

  pipe<U>(fn: Pipe<T, U>): Pipeline<U> {
    return new Pipeline(fn(this.value));
  }

  execute(): T {
    return this.value;
  }
}

// Uso
const result = new Pipeline(5)
  .pipe(n => n * 2)
  .pipe(n => n.toString())
  .pipe(s => s + '!')
  .execute(); // "10!"
```

---

**Conclusão**: Padrões avançados com generics combinam type system features sofisticados com design patterns clássicos para criar abstrações type-safe, reutilizáveis e altamente expressivas.
