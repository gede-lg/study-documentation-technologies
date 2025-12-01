# Generics em POO: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Generics em Programação Orientada a Objetos** são **parâmetros de tipo** aplicados a classes, interfaces e métodos, permitindo que estruturas orientadas a objetos sejam **parametrizadas por tipos**, criando componentes reutilizáveis que funcionam com múltiplos tipos mantendo **type safety completo**. Conceitualmente, representam **abstração sobre tipos** no nível de definição de classes e interfaces.

Na essência, generics em POO materializam o princípio de **polimorfismo paramétrico** aplicado a estruturas orientadas a objetos, onde uma classe genérica `Box<T>` não é uma classe específica, mas um **template** que gera classes específicas (`Box<number>`, `Box<string>`) quando parametrizado.

### Contexto Histórico

**Evolução de Generics em POO:**

1. **Smalltalk (1980s)**: Coleções heterogêneas (sem type safety)
2. **C++ Templates (1990s)**: Compile-time code generation
3. **Java Generics (2004)**: Type erasure, runtime compatibility
4. **C# Generics (2005)**: Reified generics (runtime type info)
5. **TypeScript (2012+)**: Structural typing + generics

**TypeScript Generics** herdam conceitos de C#/Java mas com twist: **structural typing** (duck typing) vs **nominal typing** (inheritance-based). Isso cria nuances únicas em como generics funcionam com interfaces e classes.

### Problema Fundamental que Resolve

Sem generics em POO, há **trade-off forçado** entre:

```typescript
// ❌ Opção 1: Type-safe mas duplicado
class NumberBox {
  private value: number;
  constructor(value: number) { this.value = value; }
  getValue(): number { return this.value; }
}

class StringBox {
  private value: string;
  constructor(value: string) { this.value = value; }
  getValue(): string { return this.value; }
}

// ❌ Opção 2: Reutilizável mas perde tipos
class AnyBox {
  private value: any;
  constructor(value: any) { this.value = value; }
  getValue(): any { return this.value; }
}

const box = new AnyBox(42);
const value = box.getValue(); // any - tipo perdido!
value.toUpperCase(); // Runtime error: value é number

// ✅ Generics: Type-safe E reutilizável
class Box<T> {
  private value: T;
  constructor(value: T) { this.value = value; }
  getValue(): T { return this.value; }
}

const numberBox = new Box(42); // Box<number> inferido
const stringBox = new Box("hello"); // Box<string> inferido

const num = numberBox.getValue(); // number
const str = stringBox.getValue(); // string
```

**Fundamento teórico:** Generics implementam **parametric polymorphism** em POO - permitindo classes/interfaces abstraírem sobre tipos mantendo **complete type information** em compile-time.

### Importância no Ecossistema TypeScript

Generics em POO são fundamentais porque:

- **Collections Framework**: `Array<T>`, `Map<K,V>`, `Set<T>` são genéricos
- **Design Patterns**: Repository, Factory, Builder patterns usam generics
- **Framework Integration**: React (`Component<Props, State>`), Angular, Vue
- **API Clients**: Reusable type-safe HTTP clients
- **Data Structures**: Type-safe stacks, queues, trees, graphs
- **State Management**: Redux, MobX, Zustand com typed stores
- **ORM/Database**: TypeORM, Prisma repositories genéricos

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Type Parameters**: `<T>` placeholder em definição de classe/interface
2. **Type Arguments**: Valores concretos para `T` em uso (`Box<number>`)
3. **Constraints**: `T extends Base` restringe tipos aceitos
4. **Variance**: Covariance, contravariance, invariance em relações de subtipagem
5. **Type Inference**: Dedução automática de type arguments
6. **Generic Methods**: Métodos genéricos dentro de classes (genéricas ou não)

### Pilares Fundamentais

- **Generic Classes**: `class Box<T> { ... }`
- **Generic Interfaces**: `interface Repository<T> { ... }`
- **Constraints**: `T extends Entity`, `K extends keyof T`
- **Multiple Parameters**: `<T, U, V>` múltiplos type parameters
- **Default Types**: `<T = string>` valores padrão
- **Static Members**: Limitações com members estáticos

### Visão Geral das Nuances

- **Structural Typing**: TypeScript usa estrutura, não herança
- **Type Erasure**: Generics removidos em runtime (como Java)
- **Variance**: Readonly implica covariance
- **Constructor Types**: `new (...args: any[]) => T`
- **this Type**: `this` como type parameter especial
- **Method Overloading**: Interaction com generic methods

## 🧠 Fundamentos Teóricos

### Anatomia de uma Classe Genérica

```typescript
// Classe genérica completa
class Container<T> {
  // Type parameter T disponível em toda classe
  private items: T[] = [];

  // Método que usa T
  add(item: T): void {
    this.items.push(item);
  }

  // Método retornando T
  get(index: number): T | undefined {
    return this.items[index];
  }

  // Método genérico adicional (além de T)
  map<U>(fn: (item: T) => U): Container<U> {
    const newContainer = new Container<U>();
    this.items.forEach(item => newContainer.add(fn(item)));
    return newContainer;
  }

  // Método que retorna array tipado
  getAll(): T[] {
    return [...this.items];
  }
}

// Uso
const numbers = new Container<number>();
numbers.add(42);
numbers.add(100);

const strings = numbers.map(n => n.toString()); // Container<string>
```

**Componentes:**
- **`<T>`**: Type parameter declaration no nível de classe
- **`T[]`**: Type parameter usado em propriedades
- **`item: T`**: Parameters de métodos
- **`: T`**: Return types de métodos
- **`<U>`**: Additional type parameter em método específico

### Interface Genérica

```typescript
// Interface genérica
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
  findAll(): Promise<T[]>;
}

// Implementação concreta
interface User {
  id: number;
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async findById(id: number): Promise<User | null> {
    // Implementação
    return null;
  }

  async save(entity: User): Promise<User> {
    // Implementação
    return entity;
  }

  async delete(id: number): Promise<void> {
    // Implementação
  }

  async findAll(): Promise<User[]> {
    // Implementação
    return [];
  }
}
```

**Conceito:** Interface define **contrato genérico**, implementação fornece **tipo concreto**.

### Type Parameters vs Type Arguments

```typescript
// DEFINIÇÃO - usa TYPE PARAMETERS (placeholders)
class Pair<T, U> {
  //         ^^^^
  //    Type Parameters
  constructor(public first: T, public second: U) {}
}

// USO - fornece TYPE ARGUMENTS (tipos concretos)
const pair1 = new Pair<number, string>(42, "hello");
//                    ^^^^^^^^^^^^^^^^
//                    Type Arguments

// Inferência - type arguments deduzidos de constructor arguments
const pair2 = new Pair(true, 100);
// Type arguments inferidos: <boolean, number>
```

**Distinção crucial:**
- **Type Parameters**: Variáveis de tipo na **definição**
- **Type Arguments**: Valores concretos no **uso**

### Constraints em Classes Genéricas

```typescript
// Constraint básico - T deve ter propriedade id
interface HasId {
  id: number;
}

class EntityStore<T extends HasId> {
  private items = new Map<number, T>();

  add(entity: T): void {
    // Safe: sabemos que T tem id
    this.items.set(entity.id, entity);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }
}

// ✅ User tem id
interface User extends HasId {
  name: string;
}

const userStore = new EntityStore<User>();

// ❌ Person não tem id
interface Person {
  name: string;
}

// const personStore = new EntityStore<Person>(); // Erro!
```

**Conceito:** Constraints garantem que `T` tenha propriedades/métodos necessários.

### Keyof Constraint

```typescript
// Constraint usando keyof
class PropertyExtractor<T, K extends keyof T> {
  extract(obj: T, key: K): T[K] {
    return obj[key];
  }
}

interface Person {
  name: string;
  age: number;
  email: string;
}

const extractor = new PropertyExtractor<Person, 'name'>();
const name = extractor.extract({ name: "Ana", age: 25, email: "ana@example.com" }, 'name');
// Type: string

// ❌ Erro: 'invalid' não é key de Person
// const invalid = extractor.extract(person, 'invalid');
```

**Conceito:** `K extends keyof T` garante que `K` é chave válida de `T`.

### Múltiplos Type Parameters

```typescript
// Múltiplos parâmetros independentes
class BiMap<K, V> {
  private forward = new Map<K, V>();
  private backward = new Map<V, K>();

  set(key: K, value: V): void {
    this.forward.set(key, value);
    this.backward.set(value, key);
  }

  getByKey(key: K): V | undefined {
    return this.forward.get(key);
  }

  getByValue(value: V): K | undefined {
    return this.backward.get(value);
  }
}

// Uso
const idToName = new BiMap<number, string>();
idToName.set(1, "Alice");
idToName.set(2, "Bob");

idToName.getByKey(1);     // "Alice"
idToName.getByValue("Bob"); // 2
```

### Default Type Parameters

```typescript
// Type parameter com valor padrão
class ResponseWrapper<T = unknown> {
  constructor(
    public data: T,
    public status: number = 200
  ) {}
}

// Usa default (unknown)
const response1 = new ResponseWrapper({ message: "OK" }, 200);
// Type: ResponseWrapper<{ message: string }>

// Especifica explicitamente
const response2 = new ResponseWrapper<User>(user, 200);
// Type: ResponseWrapper<User>
```

## 🎯 Aplicabilidade e Contextos

### Stack Genérico (Estrutura de Dados)

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
}

// Uso type-safe
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.pop(); // number | undefined
```

### Repository Pattern

```typescript
// Base repository genérico
abstract class BaseRepository<T extends { id: number }> {
  protected items: Map<number, T> = new Map();

  save(entity: T): T {
    this.items.set(entity.id, entity);
    return entity;
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  delete(id: number): boolean {
    return this.items.delete(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }
}

// Repositório específico
interface Product {
  id: number;
  name: string;
  price: number;
}

class ProductRepository extends BaseRepository<Product> {
  findByPriceRange(min: number, max: number): Product[] {
    return this.findAll().filter(p => p.price >= min && p.price <= max);
  }
}
```

### Builder Pattern Genérico

```typescript
class Builder<T> {
  private obj: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.obj[key] = value;
    return this;
  }

  build(): T {
    return this.obj as T;
  }
}

interface User {
  name: string;
  email: string;
  age: number;
}

const user = new Builder<User>()
  .set('name', 'Ana')
  .set('email', 'ana@example.com')
  .set('age', 25)
  .build();
```

### Factory Pattern

```typescript
interface Entity {
  id: number;
}

class Factory<T extends Entity> {
  private nextId = 1;

  constructor(private creator: (id: number) => T) {}

  create(): T {
    return this.creator(this.nextId++);
  }
}

interface User extends Entity {
  name: string;
}

const userFactory = new Factory<User>((id) => ({
  id,
  name: `User ${id}`
}));

const user1 = userFactory.create(); // { id: 1, name: "User 1" }
const user2 = userFactory.create(); // { id: 2, name: "User 2" }
```

## ⚠️ Limitações e Restrições

### 1. Static Members Não Podem Usar Type Parameters

```typescript
class Container<T> {
  // ❌ Erro: static member não pode usar T
  // static defaultValue: T;

  // ✅ OK: static member com próprio generic
  static create<U>(value: U): Container<U> {
    const container = new Container<U>();
    // ...
    return container;
  }
}
```

**Razão:** Static members pertencem à classe, não a instâncias. `T` só existe em instâncias.

### 2. Type Erasure (Runtime)

```typescript
class Box<T> {
  constructor(private value: T) {}

  // ❌ Não pode checar tipo em runtime
  isString(): boolean {
    // return this.value instanceof T; // Erro!
    return typeof this.value === 'string'; // Workaround
  }
}

// Generics são removidos em runtime
const stringBox = new Box("hello");
const numberBox = new Box(42);

// Ambos são apenas Box em runtime
console.log(stringBox.constructor === numberBox.constructor); // true
```

### 3. Cannot Create Generic Array

```typescript
class Factory<T> {
  // ❌ Não pode instanciar T[]
  // createArray(length: number): T[] {
  //   return new Array<T>(length); // Funciona mas...
  // }

  // ✅ Correto
  createArray(length: number): T[] {
    return [];
  }
}
```

### 4. Constraints Não São Garantias Runtime

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

// Type assertion errada bypassa type safety
const validator = new Validator<HasName>();
validator.validate({ name: "Ana" }); // OK

// Runtime error se type assertion incorreta
const fakeObj = {} as HasName;
validator.validate(fakeObj); // Runtime error!
```

## 🔗 Interconexões

### Com Generics em Funções

Classes genéricas frequentemente têm **métodos genéricos adicionais**:

```typescript
class Collection<T> {
  private items: T[] = [];

  // Método genérico adicional
  map<U>(fn: (item: T) => U): Collection<U> {
    const newCollection = new Collection<U>();
    this.items.forEach(item => newCollection.add(fn(item)));
    return newCollection;
  }

  add(item: T): void {
    this.items.push(item);
  }
}
```

### Com Utility Types

Utility types funcionam com classes genéricas:

```typescript
class State<T> {
  constructor(private value: T) {}

  // Partial update
  update(partial: Partial<T>): void {
    this.value = { ...this.value, ...partial };
  }

  // Pick specific keys
  extract<K extends keyof T>(keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      result[key] = this.value[key];
    });
    return result;
  }
}
```

### Com Decorators

Decorators e generics:

```typescript
function Log<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      console.log(`Creating instance of ${constructor.name}`);
      super(...args);
    }
  };
}

@Log
class User<T> {
  constructor(public data: T) {}
}
```

## 🚀 Evolução e Padrões Modernos

### Fluent API com Generics

```typescript
class QueryBuilder<T> {
  private conditions: string[] = [];

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field: keyof T): this {
    // ...
    return this;
  }

  execute(): Promise<T[]> {
    // Execute query
    return Promise.resolve([]);
  }
}

// Uso fluente
const users = await new QueryBuilder<User>()
  .where('age > 18')
  .orderBy('name')
  .execute();
```

### Type-State Pattern

```typescript
// Estados diferentes com tipos diferentes
class Builder<T, TComplete extends boolean = false> {
  private obj: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): Builder<T, TComplete> {
    this.obj[key] = value;
    return this as any;
  }

  // build() só disponível quando completo
  build(this: Builder<T, true>): T {
    return this.obj as T;
  }
}
```

### Modelo Mental para Compreensão

Pense em classes genéricas como **moldes ajustáveis**:

**Molde de Cookie (`Box<T>`):**
- **Molde**: Classe genérica (formato fixo)
- **Ajuste `T`**: Tipo do cookie (chocolate, vanilla)
- **Produto**: Instância tipada (`Box<number>`, `Box<string>`)

**Fábrica Configurável (`Repository<T>`):**
- **Fábrica**: Interface genérica (operações padrão)
- **Configuração `T`**: Tipo de produto (User, Product)
- **Linha de Produção**: Implementação concreta

**Container de Transporte (`Container<T>`):**
- **Container**: Estrutura genérica (formato padrão)
- **Conteúdo `T`**: Tipo transportado (books, electronics)
- **Viagem**: Operações preservam tipo do conteúdo

---

**Conclusão Conceitual**: Generics em POO permitem **abstração sobre tipos** em classes e interfaces, criando componentes reutilizáveis que funcionam com múltiplos tipos mantendo type safety completo. São fundamentais para data structures, design patterns, frameworks, e qualquer código orientado a objetos que precise de polimorfismo paramétrico.
