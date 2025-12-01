# Generics em Classes: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Classes genéricas** (generic classes) são classes que declaram **type parameters** no nível de classe, tornando propriedades, métodos e constructors parametrizados por tipos. Conceitualmente, representam **templates de classes** que geram classes concretas quando parametrizados com tipos específicos.

Na essência, classes genéricas materializam o princípio de **code reuse com type safety**, onde uma única definição de classe funciona para múltiplos tipos sem duplicação de código ou perda de informação de tipo.

### Problema que Resolve

```typescript
// ❌ Sem generics - duplicação
class NumberStack {
  private items: number[] = [];
  push(item: number): void { this.items.push(item); }
  pop(): number | undefined { return this.items.pop(); }
}

class StringStack {
  private items: string[] = [];
  push(item: string): void { this.items.push(item); }
  pop(): string | undefined { return this.items.pop(); }
}

// ❌ Sem generics - perde tipos
class AnyStack {
  private items: any[] = [];
  push(item: any): void { this.items.push(item); }
  pop(): any | undefined { return this.items.pop(); }
}

const stack = new AnyStack();
stack.push(42);
const value = stack.pop(); // any - tipo perdido

// ✅ Com generics - type-safe e reutilizável
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

const numberStack = new Stack<number>();
numberStack.push(42);
const num = numberStack.pop(); // number | undefined

const stringStack = new Stack<string>();
stringStack.push("hello");
const str = stringStack.pop(); // string | undefined
```

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Declaração de classe genérica
class Box<T> {
  //     ^^^
  // Type parameter

  private value: T;
  //             ^
  // Usa type parameter

  constructor(value: T) {
    //                ^
    // Usa type parameter
    this.value = value;
  }

  getValue(): T {
    //        ^
    // Retorna type parameter
    return this.value;
  }

  setValue(value: T): void {
    //             ^
    // Parameter usa type parameter
    this.value = value;
  }
}

// Uso com tipo explícito
const numberBox = new Box<number>(42);
const stringBox = new Box<string>("hello");

// Uso com inferência (recomendado quando possível)
const inferredNumber = new Box(42);     // Box<number>
const inferredString = new Box("hello"); // Box<string>
```

### Properties Genéricas

```typescript
class Pair<T, U> {
  // Properties usam type parameters
  public first: T;
  public second: U;

  constructor(first: T, second: U) {
    this.first = first;
    this.second = second;
  }

  // Swap types
  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }
}

const pair = new Pair(42, "hello");
// Type: Pair<number, string>

const swapped = pair.swap();
// Type: Pair<string, number>
```

### Arrays e Collections

```typescript
class Collection<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  addAll(items: T[]): void {
    this.items.push(...items);
  }

  getAll(): T[] {
    return [...this.items];
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  size(): number {
    return this.items.length;
  }
}

const numbers = new Collection<number>();
numbers.add(1);
numbers.add(2);
numbers.addAll([3, 4, 5]);

const evens = numbers.filter(n => n % 2 === 0); // number[]
```

## 🔍 Análise Conceitual

### 1. Type Parameter Scope

```typescript
class Container<T> {
  // T disponível em toda classe

  // Property
  private value: T;

  // Constructor
  constructor(value: T) {
    this.value = value;
  }

  // Instance method
  getValue(): T {
    return this.value;
  }

  // Outro instance method
  setValue(value: T): void {
    this.value = value;
  }

  // Method com type parameter adicional
  transform<U>(fn: (value: T) => U): Container<U> {
    //       ^^^
    // Type parameter adicional (scope local ao método)
    return new Container(fn(this.value));
  }
}
```

**Conceito:** Type parameter `T` da classe está disponível em **todos** members não-static. Métodos podem declarar **type parameters adicionais** com scope local.

### 2. Constructor Inference

```typescript
class Point<T extends number | string> {
  constructor(public x: T, public y: T) {}
}

// TypeScript infere T do constructor
const numericPoint = new Point(10, 20);
// Type: Point<number>

const stringPoint = new Point("10", "20");
// Type: Point<string>

// ❌ Erro: tipos inconsistentes
// const mixedPoint = new Point(10, "20");
// T deve ser number OU string, não ambos
```

### 3. Method Chaining com Generics

```typescript
class Builder<T> {
  private obj: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    //                                          ^^^^
    // Retorna 'this' para chaining
    this.obj[key] = value;
    return this;
  }

  get<K extends keyof T>(key: K): T[K] | undefined {
    return this.obj[key];
  }

  build(): T {
    return this.obj as T;
  }
}

interface User {
  name: string;
  age: number;
  email: string;
}

const user = new Builder<User>()
  .set('name', 'Ana')    // Builder<User>
  .set('age', 25)        // Builder<User>
  .set('email', 'ana@example.com') // Builder<User>
  .build();              // User
```

**Conceito:** Retornar `this` permite **method chaining** preservando tipo da instância.

### 4. Generic Inheritance

```typescript
// Base genérica
abstract class Repository<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  abstract validate(item: T): boolean;
}

// Subclass especifica tipo concreto
class UserRepository extends Repository<User> {
  validate(item: User): boolean {
    return item.name.length > 0 && item.email.includes('@');
  }

  // Método adicional específico
  findByEmail(email: string): User | undefined {
    return this.items.find(u => u.email === email);
  }
}

// Subclass mantém parâmetro genérico
class CachedRepository<T> extends Repository<T> {
  private cache = new Map<string, T>();

  validate(item: T): boolean {
    return true; // Default: sempre válido
  }

  addWithCache(key: string, item: T): void {
    this.add(item);
    this.cache.set(key, item);
  }
}

interface User {
  name: string;
  email: string;
}
```

**Padrões de herança:**
- **Especificar tipo concreto**: `extends Repository<User>`
- **Manter genérico**: `extends Repository<T>` (nova classe também genérica)

### 5. Composition vs Inheritance

```typescript
// Composition com generics
class Store<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

class Cache<T> {
  private map = new Map<string, T>();

  set(key: string, value: T): void {
    this.map.set(key, value);
  }

  get(key: string): T | undefined {
    return this.map.get(key);
  }
}

// Composição de componentes genéricos
class CachedStore<T> {
  private store = new Store<T>();
  private cache = new Cache<T>();

  add(key: string, item: T): void {
    this.store.add(item);
    this.cache.set(key, item);
  }

  get(key: string): T | undefined {
    return this.cache.get(key);
  }

  getAll(): T[] {
    return this.store.getAll();
  }
}
```

## 🎯 Aplicabilidade

### Stack (LIFO)

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}

// Uso
const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

while (!stack.isEmpty()) {
  console.log(stack.pop()); // 3, 2, 1
}
```

### Queue (FIFO)

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
queue.enqueue("third");

console.log(queue.dequeue()); // "first"
console.log(queue.dequeue()); // "second"
```

### Linked List

```typescript
class Node<T> {
  constructor(
    public value: T,
    public next: Node<T> | null = null
  ) {}
}

class LinkedList<T> {
  private head: Node<T> | null = null;

  prepend(value: T): void {
    this.head = new Node(value, this.head);
  }

  append(value: T): void {
    if (!this.head) {
      this.head = new Node(value);
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = new Node(value);
  }

  find(predicate: (value: T) => boolean): T | null {
    let current = this.head;
    while (current) {
      if (predicate(current.value)) {
        return current.value;
      }
      current = current.next;
    }
    return null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.prepend(0);

console.log(list.toArray()); // [0, 1, 2]
```

### Binary Search Tree

```typescript
class TreeNode<T> {
  constructor(
    public value: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;

  constructor(private compare: (a: T, b: T) => number) {}

  insert(value: T): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: TreeNode<T> | null, value: T): TreeNode<T> {
    if (!node) {
      return new TreeNode(value);
    }

    if (this.compare(value, node.value) < 0) {
      node.left = this.insertNode(node.left, value);
    } else {
      node.right = this.insertNode(node.right, value);
    }

    return node;
  }

  inOrder(callback: (value: T) => void): void {
    this.inOrderTraversal(this.root, callback);
  }

  private inOrderTraversal(node: TreeNode<T> | null, callback: (value: T) => void): void {
    if (!node) return;

    this.inOrderTraversal(node.left, callback);
    callback(node.value);
    this.inOrderTraversal(node.right, callback);
  }
}

// Uso
const tree = new BinarySearchTree<number>((a, b) => a - b);
tree.insert(5);
tree.insert(3);
tree.insert(7);
tree.insert(1);

tree.inOrder(value => console.log(value)); // 1, 3, 5, 7
```

### Result/Either Pattern

```typescript
class Result<T, E = Error> {
  private constructor(
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined);
  }

  static err<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
  }

  isOk(): boolean {
    return this._error === undefined;
  }

  isErr(): boolean {
    return this._error !== undefined;
  }

  unwrap(): T {
    if (this._error !== undefined) {
      throw new Error('Called unwrap on Err value');
    }
    return this._value!;
  }

  unwrapOr(defaultValue: T): T {
    return this._error !== undefined ? defaultValue : this._value!;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._error !== undefined) {
      return Result.err(this._error);
    }
    return Result.ok(fn(this._value!));
  }
}

// Uso
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Result.err("Division by zero");
  }
  return Result.ok(a / b);
}

const result1 = divide(10, 2);
console.log(result1.unwrap()); // 5

const result2 = divide(10, 0);
console.log(result2.unwrapOr(0)); // 0
```

## ⚠️ Limitações

### 1. Static Members Cannot Use Type Parameters

```typescript
class Box<T> {
  // ❌ Erro: static member não pode usar T
  // static defaultValue: T;

  // ❌ Erro: static method não pode usar T da classe
  // static getDefault(): T { }

  // ✅ OK: static method com próprio generic
  static create<U>(value: U): Box<U> {
    return new Box(value);
  }

  // ✅ OK: instance member usa T
  private value: T;

  constructor(value: T) {
    this.value = value;
  }
}
```

**Razão:** Static members pertencem à **classe**, não a **instâncias**. Type parameter `T` só existe quando há instância.

### 2. Cannot Check Type at Runtime

```typescript
class Container<T> {
  constructor(private value: T) {}

  // ❌ Não funciona: T não existe em runtime
  isString(): boolean {
    // return this.value instanceof T; // Erro!
    // Workaround:
    return typeof this.value === 'string';
  }

  // ❌ Não funciona: T não existe em runtime
  isType(type: T): boolean {
    // return this.value instanceof type; // Erro!
    return false;
  }
}
```

**Solução:** Passar tipo em runtime separadamente:

```typescript
class Container<T> {
  constructor(
    private value: T,
    private typeChecker?: (value: unknown) => value is T
  ) {}

  isType(): boolean {
    if (!this.typeChecker) return false;
    return this.typeChecker(this.value);
  }
}

// Type guard
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const container = new Container("hello", isString);
console.log(container.isType()); // true
```

### 3. Private/Protected Limitations

```typescript
class Base<T> {
  protected value: T;

  constructor(value: T) {
    this.value = value;
  }
}

class Derived<T> extends Base<T> {
  // ✅ Pode acessar protected member
  getValue(): T {
    return this.value;
  }
}

// ❌ Não pode acessar de fora
const derived = new Derived(42);
// console.log(derived.value); // Erro: protected
```

## 🔗 Interconexões

### Com Generic Methods

Classes genéricas podem ter **métodos genéricos adicionais**:

```typescript
class Collection<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  // Método genérico adicional
  map<U>(fn: (item: T) => U): Collection<U> {
    //  ^^^
    // Type parameter adicional
    const newCollection = new Collection<U>();
    this.items.forEach(item => newCollection.add(fn(item)));
    return newCollection;
  }

  // Outro método genérico
  zip<U>(other: Collection<U>): Collection<[T, U]> {
    const result = new Collection<[T, U]>();
    const length = Math.min(this.items.length, other.items.length);
    
    for (let i = 0; i < length; i++) {
      result.add([this.items[i], other.items[i]]);
    }
    
    return result;
  }
}
```

### Com Interfaces Genéricas

Classes implementam interfaces genéricas:

```typescript
interface Comparable<T> {
  compareTo(other: T): number;
}

class Person implements Comparable<Person> {
  constructor(public name: string, public age: number) {}

  compareTo(other: Person): number {
    return this.age - other.age;
  }
}

const p1 = new Person("Ana", 25);
const p2 = new Person("Bob", 30);

console.log(p1.compareTo(p2)); // -5
```

## 🚀 Evolução e Padrões Modernos

### Readonly Properties

```typescript
class ImmutableBox<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  // ❌ Não pode modificar
  // setValue(value: T): void {
  //   this.value = value; // Erro: readonly
  // }

  // ✅ Cria nova instância
  withValue(value: T): ImmutableBox<T> {
    return new ImmutableBox(value);
  }
}
```

### Type-State Pattern

```typescript
type ValidationState = 'unvalidated' | 'validated';

class Data<T, S extends ValidationState = 'unvalidated'> {
  constructor(private value: T) {}

  // Validate retorna novo tipo
  validate(): Data<T, 'validated'> {
    // Validação
    return new Data<T, 'validated'>(this.value);
  }

  // save() só disponível quando validated
  save(this: Data<T, 'validated'>): void {
    console.log('Saving:', this.value);
  }
}

const data = new Data({ name: "Ana" });
// data.save(); // Erro: não validado

const validated = data.validate();
validated.save(); // ✅ OK
```

---

**Conclusão**: Classes genéricas são fundamentais para estruturas de dados type-safe, design patterns, e qualquer código orientado a objetos que precise de reutilização com type safety completo.
