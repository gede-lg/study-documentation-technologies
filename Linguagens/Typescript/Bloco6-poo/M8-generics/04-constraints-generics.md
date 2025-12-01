# Constraints em Generics de POO: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Constraints em generics** (generic constraints) são **restrições sobre type parameters** que limitam quais tipos podem ser usados como type arguments. Conceitualmente, representam **pré-condições de tipo**, garantindo que type parameters tenham propriedades, métodos ou estruturas específicas necessárias para funcionamento correto da classe/interface.

Na essência, constraints materializam o princípio de **type safety com garantias**, onde `<T extends Base>` significa "T pode ser qualquer tipo, **desde que** seja subtipo de Base", permitindo acesso seguro a members de Base dentro de código genérico.

### Problema que Resolve

```typescript
// ❌ Sem constraints - erro ao acessar propriedades
class Printer<T> {
  print(item: T): void {
    // Erro: T pode não ter toString
    // console.log(item.toString());
  }
}

// ❌ Workaround inseguro com type assertion
class UnsafePrinter<T> {
  print(item: T): void {
    console.log((item as any).toString()); // Perde type safety
  }
}

// ✅ Com constraint - type-safe
class SafePrinter<T extends { toString(): string }> {
  print(item: T): void {
    console.log(item.toString()); // ✅ Garantido que existe
  }
}

// Uso
const printer = new SafePrinter<number>();
printer.print(42); // OK

// ❌ Erro: null não tem toString
// const nullPrinter = new SafePrinter<null>(); // Erro de compilação!
```

**Fundamento:** Constraints permitem escrever código genérico que **assume** que T tem certos members, com **garantia em compile-time** de que essa suposição é válida.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Constraint básico: T extends Type
class Container<T extends object> {
  //              ^^^^^^^^^^^^^^^^
  // T deve ser object (não primitivo)

  constructor(private value: T) {}

  // Pode usar spread operator (object only)
  clone(): T {
    return { ...this.value };
  }
}

// ✅ OK: User é object
interface User {
  name: string;
  age: number;
}

const userContainer = new Container<User>({ name: "Ana", age: 25 });

// ❌ Erro: number não é object
// const numberContainer = new Container<number>(42);
```

### Extends com Interface

```typescript
interface HasId {
  id: number;
}

class Repository<T extends HasId> {
  //              ^^^^^^^^^^^^^^^^
  // T deve ter propriedade id: number

  private items = new Map<number, T>();

  add(item: T): void {
    // Safe: sabemos que T tem id
    this.items.set(item.id, item);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }
}

// ✅ OK: User tem id
interface User extends HasId {
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: "Ana", email: "ana@example.com" });

// ❌ Erro: Person não tem id
interface Person {
  name: string;
}

// const personRepo = new Repository<Person>(); // Erro!
```

### Extends com Union Types

```typescript
class Stringifier<T extends string | number | boolean> {
  //               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // T pode ser string, number OU boolean

  stringify(value: T): string {
    return String(value);
  }

  parse(str: string): T {
    // Implementação simplificada
    return str as unknown as T;
  }
}

// ✅ OK
const stringifier1 = new Stringifier<number>();
const stringifier2 = new Stringifier<boolean>();

// ❌ Erro: object não está no union
// const stringifier3 = new Stringifier<object>();
```

### Keyof Constraint

```typescript
class PropertyAccessor<T, K extends keyof T> {
  //                      ^^^^^^^^^^^^^^^^^^^
  // K deve ser chave de T

  get(obj: T, key: K): T[K] {
    return obj[key];
  }

  set(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
  }
}

interface User {
  name: string;
  age: number;
  email: string;
}

const accessor = new PropertyAccessor<User, 'name'>();
const user: User = { name: "Ana", age: 25, email: "ana@example.com" };

const name = accessor.get(user, 'name'); // string
accessor.set(user, 'name', 'Bob');

// ❌ Erro: 'invalid' não é key de User
// accessor.get(user, 'invalid');
```

## 🔍 Análise Conceitual

### 1. Constraints vs Assertions

```typescript
// Constraint - garantia em compile-time
class WithConstraint<T extends { length: number }> {
  getLength(value: T): number {
    return value.length; // ✅ Safe
  }
}

// Sem constraint - precisa de assertion
class WithoutConstraint<T> {
  getLength(value: T): number {
    // ❌ Erro: T pode não ter length
    // return value.length;

    // Precisa de type guard ou assertion
    if (typeof value === 'object' && value !== null && 'length' in value) {
      return (value as any).length;
    }
    return 0;
  }
}

// Constraint é superior: type safety em compile-time
const withConstraint = new WithConstraint<string>();
console.log(withConstraint.getLength("hello")); // 5

const withConstraint2 = new WithConstraint<number[]>();
console.log(withConstraint2.getLength([1, 2, 3])); // 3
```

### 2. Multiple Constraints via Intersection

```typescript
interface HasId {
  id: number;
}

interface HasTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

// Múltiplas constraints usando &
class AuditedRepository<T extends HasId & HasTimestamp> {
  //                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // T deve ter id E timestamps

  private items = new Map<number, T>();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  updateTimestamp(id: number): void {
    const item = this.items.get(id);
    if (item) {
      item.updatedAt = new Date(); // ✅ Safe: T tem updatedAt
    }
  }
}

// ✅ OK: User tem ambos
interface User extends HasId, HasTimestamp {
  name: string;
}

// ❌ Erro: Product tem id mas não timestamps
interface Product extends HasId {
  name: string;
  price: number;
}

// const productRepo = new AuditedRepository<Product>(); // Erro!
```

### 3. Constraint Inheritance

```typescript
// Base constraint
class BaseContainer<T extends object> {
  constructor(protected value: T) {}

  clone(): T {
    return { ...this.value };
  }
}

// Subclass pode adicionar mais constraints
class EntityContainer<T extends object & { id: number }> extends BaseContainer<T> {
  //                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Constraint mais restritivo

  getId(): number {
    return this.value.id; // ✅ Safe
  }
}

// ❌ Erro: number não satisfaz constraint de EntityContainer
// class NumberContainer extends EntityContainer<number> { }

// ✅ OK
interface Entity {
  id: number;
  name: string;
}

class MyEntityContainer extends EntityContainer<Entity> { }
```

### 4. Conditional Types em Constraints

```typescript
// Constraint com conditional type
type NonNullable<T> = T extends null | undefined ? never : T;

class SafeContainer<T extends NonNullable<T>> {
  //                ^^^^^^^^^^^^^^^^^^^^^^^^^
  // T não pode ser null ou undefined

  constructor(private value: T) {}

  getValue(): T {
    return this.value; // Garantido não-null
  }
}

// ✅ OK
const container = new SafeContainer<number>(42);

// ❌ Erro: null não satisfaz constraint
// const nullContainer = new SafeContainer<null>(null);
```

### 5. Recursive Constraints

```typescript
interface TreeNode<T> {
  value: T;
  children: TreeNode<T>[];
}

class Tree<T extends TreeNode<any>> {
  //        ^^^^^^^^^^^^^^^^^^^^^^^^
  // T deve ser TreeNode

  constructor(private root: T) {}

  traverse(callback: (node: T) => void): void {
    this.traverseNode(this.root, callback);
  }

  private traverseNode(node: T, callback: (node: T) => void): void {
    callback(node);
    node.children.forEach(child => this.traverseNode(child as T, callback));
  }
}

// Uso
interface MyNode extends TreeNode<string> {
  value: string;
  children: MyNode[];
  metadata: { level: number };
}

const tree = new Tree<MyNode>({
  value: "root",
  children: [],
  metadata: { level: 0 }
});
```

## 🎯 Aplicabilidade

### Comparable Interface

```typescript
interface Comparable<T> {
  compareTo(other: T): number;
}

class SortedList<T extends Comparable<T>> {
  //             ^^^^^^^^^^^^^^^^^^^^^^^^^^
  // T deve ser comparável

  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
    this.items.sort((a, b) => a.compareTo(b));
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// Implementação
class Person implements Comparable<Person> {
  constructor(public name: string, public age: number) {}

  compareTo(other: Person): number {
    return this.age - other.age;
  }
}

const list = new SortedList<Person>();
list.add(new Person("Ana", 25));
list.add(new Person("Bob", 30));
list.add(new Person("Charlie", 20));

console.log(list.getAll().map(p => p.name)); // ["Charlie", "Ana", "Bob"]
```

### Constructor Type Constraint

```typescript
interface Constructor<T> {
  new (...args: any[]): T;
}

class Factory<T, C extends Constructor<T>> {
  //              ^^^^^^^^^^^^^^^^^^^^^^^^^^
  // C deve ser constructor de T

  constructor(private ctor: C) {}

  create(...args: any[]): T {
    return new this.ctor(...args);
  }
}

class User {
  constructor(public name: string, public email: string) {}
}

const factory = new Factory(User);
const user = factory.create("Ana", "ana@example.com");
console.log(user.name); // "Ana"
```

### Serializable Constraint

```typescript
interface Serializable {
  toJSON(): object;
  fromJSON(json: object): void;
}

class Storage<T extends Serializable> {
  //           ^^^^^^^^^^^^^^^^^^^^^^^^
  // T deve ser serializável

  private items = new Map<string, T>();

  save(key: string, item: T): void {
    const json = item.toJSON();
    localStorage.setItem(key, JSON.stringify(json));
    this.items.set(key, item);
  }

  load(key: string, instance: T): T | null {
    const json = localStorage.getItem(key);
    if (!json) return null;

    instance.fromJSON(JSON.parse(json));
    return instance;
  }
}

// Implementação
class User implements Serializable {
  constructor(public name: string = '', public age: number = 0) {}

  toJSON(): object {
    return { name: this.name, age: this.age };
  }

  fromJSON(json: any): void {
    this.name = json.name;
    this.age = json.age;
  }
}

const storage = new Storage<User>();
storage.save('user1', new User("Ana", 25));

const loaded = storage.load('user1', new User());
console.log(loaded?.name); // "Ana"
```

### Array-like Constraint

```typescript
interface ArrayLike<T> {
  length: number;
  [index: number]: T;
}

class ArrayWrapper<T, A extends ArrayLike<T>> {
  //                  ^^^^^^^^^^^^^^^^^^^^^^^^
  // A deve ser array-like de T

  constructor(private array: A) {}

  first(): T | undefined {
    return this.array[0];
  }

  last(): T | undefined {
    return this.array[this.array.length - 1];
  }

  map<U>(fn: (item: T) => U): U[] {
    const result: U[] = [];
    for (let i = 0; i < this.array.length; i++) {
      result.push(fn(this.array[i]));
    }
    return result;
  }
}

// Funciona com array
const arrayWrapper = new ArrayWrapper([1, 2, 3]);
console.log(arrayWrapper.first()); // 1

// Funciona com string (array-like)
const stringWrapper = new ArrayWrapper("hello");
console.log(stringWrapper.first()); // "h"
```

### Entity Constraint com Base Class

```typescript
abstract class Entity {
  abstract id: number;
  abstract validate(): boolean;
}

class EntityRepository<T extends Entity> {
  //                    ^^^^^^^^^^^^^^^^^^
  // T deve estender Entity

  private items = new Map<number, T>();

  add(entity: T): void {
    if (!entity.validate()) {
      throw new Error('Invalid entity');
    }
    this.items.set(entity.id, entity);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }
}

// Implementação concreta
class User extends Entity {
  constructor(public id: number, public name: string, public email: string) {
    super();
  }

  validate(): boolean {
    return this.name.length > 0 && this.email.includes('@');
  }
}

const repo = new EntityRepository<User>();
repo.add(new User(1, "Ana", "ana@example.com"));
```

## ⚠️ Limitações

### 1. Constraints Não São Runtime Checks

```typescript
interface HasName {
  name: string;
}

class Validator<T extends HasName> {
  validate(obj: T): boolean {
    // Compile-time: T tem name
    // Runtime: obj pode não ter name se type assertion errada
    return obj.name.length > 0;
  }
}

const validator = new Validator<HasName>();

// Type assertion errada bypassa constraint
const fakeObj = {} as HasName;
// validator.validate(fakeObj); // Runtime error!
```

**Solução:** Adicionar runtime validation:

```typescript
class SafeValidator<T extends HasName> {
  validate(obj: T): boolean {
    // Runtime check
    if (!obj || typeof obj !== 'object' || !('name' in obj)) {
      return false;
    }
    return obj.name.length > 0;
  }
}
```

### 2. Cannot Constraint Static Members

```typescript
class Container<T extends { toString(): string }> {
  // ❌ Erro: static member não pode usar T
  // static defaultValue: T;

  // ✅ OK: instance member
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  print(): void {
    console.log(this.value.toString()); // ✅ Safe: constraint garante
  }
}
```

### 3. Constraint Complexity Limits

```typescript
// Muito complexo - pode causar problemas de performance
type ComplexConstraint<T> = T extends {
  a: { b: { c: { d: { e: string } } } };
  f: Array<{ g: number }>;
  h: Map<string, Set<boolean>>;
}
  ? T
  : never;

// ❌ Evite constraints muito profundos
// class Complex<T extends ComplexConstraint<T>> { }
```

## 🔗 Interconexões

### Com Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Constraint com Partial
class UserUpdater<T extends Partial<User>> {
  update(data: T): void {
    // T é Partial<User>
  }
}

// Constraint com Pick
class UserPublicView<T extends Pick<User, 'id' | 'name' | 'email'>> {
  display(user: T): void {
    console.log(`${user.name} (${user.email})`);
  }
}

// Constraint com Omit
class UserCreator<T extends Omit<User, 'id'>> {
  create(data: T): User {
    return {
      id: Math.random(),
      ...data
    };
  }
}
```

### Com Mapped Types

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

class ImmutableContainer<T extends object> {
  private value: Readonly<T>;

  constructor(value: T) {
    this.value = Object.freeze({ ...value });
  }

  getValue(): Readonly<T> {
    return this.value;
  }
}
```

## 🚀 Evolução e Padrões Modernos

### Branded Type Constraints

```typescript
type Brand<K, T> = T & { __brand: K };

type PositiveNumber = Brand<'Positive', number>;
type Email = Brand<'Email', string>;

class PositiveContainer<T extends PositiveNumber> {
  //                     ^^^^^^^^^^^^^^^^^^^^^^^^
  // T deve ser PositiveNumber

  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }

  add(other: T): PositiveNumber {
    return (this.value + other) as PositiveNumber;
  }
}
```

### Discriminated Union Constraints

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number };

class ShapeProcessor<T extends Shape> {
  //                  ^^^^^^^^^^^^^^^^
  // T deve ser Shape

  area(shape: T): number {
    switch (shape.kind) {
      case 'circle':
        return Math.PI * shape.radius ** 2;
      case 'rectangle':
        return shape.width * shape.height;
    }
  }
}
```

---

**Conclusão**: Constraints em generics garantem type safety permitindo código genérico que **assume** propriedades/métodos com **garantia em compile-time**. São fundamentais para criar abstrações seguras e reutilizáveis.
