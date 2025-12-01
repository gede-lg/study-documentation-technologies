# Manipulação de Classes com Reflect

## 🎯 Introdução

**Manipulação de classes** via Reflect permite **examinar e modificar** estrutura de classes em runtime: construtores, prototypes, membros estáticos, herança, metadata. Essencial para **frameworks** (DI containers, ORMs, serializers).

### Operações Principais

```typescript
// 1. Obter constructor
const ctor = User; // Classe é constructor function

// 2. Examinar prototype
const proto = Reflect.getPrototypeOf(new User());

// 3. Listar membros
const instanceKeys = Reflect.ownKeys(proto);
const staticKeys = Reflect.ownKeys(User);

// 4. Acessar metadata
const tableName = Reflect.getMetadata('table', User);

// 5. Criar instância dinamicamente
const instance = Reflect.construct(User, ['Alice', 25]);
```

## 📋 Sumário

### Introspection
- Constructor examination
- Prototype chain traversal
- Property enumeration
- Static members inspection
- Metadata retrieval

### Modification
- Dynamic instantiation
- Property definition
- Metadata attachment
- Prototype manipulation

### Patterns
- Class registry
- Factory pattern
- ORM entity mapping
- Dependency injection
- Serialization frameworks

## 🔍 Constructor Examination

### Obter Constructor

```typescript
class User {
  constructor(public name: string, public age: number) {}
}

const user = new User('Alice', 25);

// Obter constructor da instância
const ctor = user.constructor;
console.log(ctor); // [class User]
console.log(ctor === User); // true

// Obter constructor via Reflect
const proto = Reflect.getPrototypeOf(user);
const ctor2 = proto!.constructor;
console.log(ctor2 === User); // true
```

### Constructor Name

```typescript
class User {}

console.log(User.name); // 'User'

// Instância → Constructor → Name
const user = new User();
console.log(user.constructor.name); // 'User'
```

### Constructor Parameters (design:paramtypes)

```typescript
import 'reflect-metadata';

@Reflect.metadata('injectable', true)
class Database {
  connect() {}
}

@Reflect.metadata('injectable', true)
class Logger {
  log(msg: string) {}
}

class UserService {
  constructor(
    private db: Database,
    private logger: Logger
  ) {}
}

// Obter tipos dos parâmetros do constructor
const paramTypes = Reflect.getMetadata('design:paramtypes', UserService);
console.log(paramTypes); // [Database, Logger]
console.log(paramTypes[0].name); // 'Database'
console.log(paramTypes[1].name); // 'Logger'
```

### Constructor Length

```typescript
class User {
  constructor(name: string, age: number, email: string) {}
}

// Número de parâmetros esperados
console.log(User.length); // 3
```

## 🔍 Prototype Chain Traversal

### Basic Traversal

```typescript
class Animal {
  speak() {
    return 'sound';
  }
}

class Dog extends Animal {
  bark() {
    return 'woof';
  }
}

const dog = new Dog();

// Nível 1: Dog.prototype
const proto1 = Reflect.getPrototypeOf(dog);
console.log(proto1 === Dog.prototype); // true

// Nível 2: Animal.prototype
const proto2 = Reflect.getPrototypeOf(proto1!);
console.log(proto2 === Animal.prototype); // true

// Nível 3: Object.prototype
const proto3 = Reflect.getPrototypeOf(proto2!);
console.log(proto3 === Object.prototype); // true

// Nível 4: null
const proto4 = Reflect.getPrototypeOf(proto3!);
console.log(proto4); // null
```

### Traverse Entire Chain

```typescript
function getPrototypeChain(obj: any): any[] {
  const chain: any[] = [];
  let current = obj;
  
  while (current !== null) {
    chain.push(current);
    current = Reflect.getPrototypeOf(current);
  }
  
  return chain;
}

class GrandParent {}
class Parent extends GrandParent {}
class Child extends Parent {}

const child = new Child();
const chain = getPrototypeChain(child);

console.log(chain.map(p => p.constructor?.name || 'null'));
// ['Child', 'Parent', 'GrandParent', 'Object', null]
```

### Check Inheritance

```typescript
function isInstanceOf(obj: any, ctor: any): boolean {
  let proto = Reflect.getPrototypeOf(obj);
  
  while (proto !== null) {
    if (proto === ctor.prototype) {
      return true;
    }
    proto = Reflect.getPrototypeOf(proto);
  }
  
  return false;
}

class Animal {}
class Dog extends Animal {}

const dog = new Dog();

console.log(isInstanceOf(dog, Dog)); // true
console.log(isInstanceOf(dog, Animal)); // true
console.log(isInstanceOf(dog, Object)); // true
```

## 🔍 Property Enumeration

### Instance Properties

```typescript
class User {
  id: number = 1;
  name: string = 'Alice';
  
  greet() {
    return 'Hello';
  }
}

const user = new User();

// Propriedades da instância (não métodos)
const ownKeys = Reflect.ownKeys(user);
console.log(ownKeys); // ['id', 'name']

// Propriedades enumeráveis
const keys = Object.keys(user);
console.log(keys); // ['id', 'name']
```

### Prototype Properties (Methods)

```typescript
class User {
  name: string = 'Alice';
  
  greet() {
    return 'Hello';
  }
  
  farewell() {
    return 'Goodbye';
  }
}

const user = new User();

// Métodos estão no prototype
const protoKeys = Reflect.ownKeys(Object.getPrototypeOf(user));
console.log(protoKeys); // ['constructor', 'greet', 'farewell']

// Filtrar apenas métodos
const methods = protoKeys.filter(key => {
  return key !== 'constructor' && typeof user[key as keyof User] === 'function';
});

console.log(methods); // ['greet', 'farewell']
```

### All Properties (Instance + Prototype)

```typescript
function getAllProperties(obj: any): string[] {
  const props = new Set<string>();
  
  // Propriedades da instância
  Reflect.ownKeys(obj).forEach(key => {
    if (typeof key === 'string') props.add(key);
  });
  
  // Propriedades do prototype chain
  let proto = Reflect.getPrototypeOf(obj);
  while (proto !== null && proto !== Object.prototype) {
    Reflect.ownKeys(proto).forEach(key => {
      if (typeof key === 'string' && key !== 'constructor') {
        props.add(key);
      }
    });
    proto = Reflect.getPrototypeOf(proto);
  }
  
  return Array.from(props);
}

class Animal {
  type: string = 'mammal';
  breathe() {}
}

class Dog extends Animal {
  breed: string = 'Labrador';
  bark() {}
}

const dog = new Dog();
console.log(getAllProperties(dog)); // ['type', 'breed', 'breathe', 'bark']
```

### Property Descriptors

```typescript
class User {
  name: string = 'Alice';
  
  get email() {
    return 'alice@example.com';
  }
}

const user = new User();

// Instance property descriptor
const nameDesc = Reflect.getOwnPropertyDescriptor(user, 'name');
console.log(nameDesc);
// {
//   value: 'Alice',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// Prototype property descriptor (getter)
const emailDesc = Reflect.getOwnPropertyDescriptor(
  Object.getPrototypeOf(user),
  'email'
);
console.log(emailDesc);
// {
//   get: [Function: get email],
//   set: undefined,
//   enumerable: false,
//   configurable: true
// }
```

## 🔍 Static Members Inspection

### Static Properties

```typescript
class Database {
  static instance: Database | null = null;
  static maxConnections: number = 100;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

// Listar membros estáticos
const staticKeys = Reflect.ownKeys(Database);
console.log(staticKeys);
// ['length', 'prototype', 'name', 'instance', 'maxConnections', 'getInstance']

// Filtrar apenas custom statics
const customStatics = staticKeys.filter(key => {
  return !['length', 'prototype', 'name'].includes(key as string);
});

console.log(customStatics); // ['instance', 'maxConnections', 'getInstance']
```

### Static vs Instance

```typescript
class Example {
  static staticProp = 'static';
  instanceProp = 'instance';
  
  static staticMethod() {}
  instanceMethod() {}
}

// Statics estão na classe (constructor function)
console.log(Reflect.has(Example, 'staticProp')); // true
console.log(Reflect.has(Example, 'instanceProp')); // false

// Instance props estão na instância ou prototype
const ex = new Example();
console.log(Reflect.has(ex, 'instanceProp')); // true
console.log(Reflect.has(ex, 'staticProp')); // false
```

## 🔍 Metadata Retrieval

### Class-level Metadata

```typescript
import 'reflect-metadata';

const TABLE_KEY = Symbol('table');
const SCHEMA_KEY = Symbol('schema');

@Reflect.metadata(TABLE_KEY, 'users')
@Reflect.metadata(SCHEMA_KEY, { database: 'main' })
class User {
  id: number;
  name: string;
}

// Obter metadata da classe
const tableName = Reflect.getMetadata(TABLE_KEY, User);
const schema = Reflect.getMetadata(SCHEMA_KEY, User);

console.log(tableName); // 'users'
console.log(schema); // { database: 'main' }
```

### Property Metadata

```typescript
import 'reflect-metadata';

const COLUMN_KEY = Symbol('column');

class User {
  @Reflect.metadata(COLUMN_KEY, { type: 'varchar', length: 255 })
  name: string;
  
  @Reflect.metadata(COLUMN_KEY, { type: 'integer' })
  age: number;
}

// Listar todas as propriedades com metadata
function getColumnsMetadata(target: any) {
  const proto = target.prototype;
  const properties = Reflect.ownKeys(proto).filter(key => key !== 'constructor');
  
  const columns = [];
  
  for (const prop of properties) {
    const metadata = Reflect.getMetadata(COLUMN_KEY, proto, prop as string);
    if (metadata) {
      columns.push({ property: prop, ...metadata });
    }
  }
  
  return columns;
}

console.log(getColumnsMetadata(User));
// [
//   { property: 'name', type: 'varchar', length: 255 },
//   { property: 'age', type: 'integer' }
// ]
```

### Method Metadata

```typescript
import 'reflect-metadata';

const ROUTE_KEY = Symbol('route');

class UserController {
  @Reflect.metadata(ROUTE_KEY, { method: 'GET', path: '/users' })
  findAll() {}
  
  @Reflect.metadata(ROUTE_KEY, { method: 'POST', path: '/users' })
  create() {}
  
  @Reflect.metadata(ROUTE_KEY, { method: 'DELETE', path: '/users/:id' })
  delete() {}
}

// Extrair rotas
function getRoutes(target: any) {
  const proto = target.prototype;
  const methods = Reflect.ownKeys(proto).filter(key => {
    return key !== 'constructor' && typeof proto[key] === 'function';
  });
  
  return methods.map(method => {
    const metadata = Reflect.getMetadata(ROUTE_KEY, proto, method as string);
    return { handler: method, ...metadata };
  });
}

console.log(getRoutes(UserController));
// [
//   { handler: 'findAll', method: 'GET', path: '/users' },
//   { handler: 'create', method: 'POST', path: '/users' },
//   { handler: 'delete', method: 'DELETE', path: '/users/:id' }
// ]
```

## 🔍 Dynamic Instantiation

### Reflect.construct()

```typescript
class User {
  constructor(public name: string, public age: number) {}
}

// Criar instância dinamicamente
const user = Reflect.construct(User, ['Alice', 25]);
console.log(user); // User { name: 'Alice', age: 25 }
console.log(user instanceof User); // true
```

### Factory Pattern

```typescript
type Constructor<T = any> = new (...args: any[]) => T;

class Factory {
  private static registry = new Map<string, Constructor>();
  
  static register(name: string, ctor: Constructor) {
    this.registry.set(name, ctor);
  }
  
  static create<T>(name: string, ...args: any[]): T {
    const ctor = this.registry.get(name);
    
    if (!ctor) {
      throw new Error(`No constructor registered for '${name}'`);
    }
    
    return Reflect.construct(ctor, args);
  }
}

class User {
  constructor(public name: string) {}
}

class Product {
  constructor(public id: number, public name: string) {}
}

// Registrar classes
Factory.register('User', User);
Factory.register('Product', Product);

// Criar instâncias dinamicamente
const user = Factory.create<User>('User', 'Alice');
const product = Factory.create<Product>('Product', 1, 'Widget');

console.log(user); // User { name: 'Alice' }
console.log(product); // Product { id: 1, name: 'Widget' }
```

### DI Container com Auto-wiring

```typescript
import 'reflect-metadata';

const INJECTABLE_KEY = Symbol('injectable');

function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
    return target;
  };
}

@Injectable()
class Database {
  query(sql: string) {
    console.log('Query:', sql);
  }
}

@Injectable()
class Logger {
  log(msg: string) {
    console.log('[LOG]', msg);
  }
}

@Injectable()
class UserService {
  constructor(private db: Database, private logger: Logger) {}
  
  findAll() {
    this.logger.log('Finding users');
    this.db.query('SELECT * FROM users');
  }
}

class Container {
  private instances = new Map<any, any>();
  
  resolve<T>(ctor: new (...args: any[]) => T): T {
    // Retornar instância existente
    if (this.instances.has(ctor)) {
      return this.instances.get(ctor);
    }
    
    // Verificar @Injectable
    const injectable = Reflect.getMetadata(INJECTABLE_KEY, ctor);
    if (!injectable) {
      throw new Error(`${ctor.name} is not injectable`);
    }
    
    // Resolver dependências
    const paramTypes = Reflect.getMetadata('design:paramtypes', ctor) || [];
    const dependencies = paramTypes.map((dep: any) => this.resolve(dep));
    
    // Criar instância
    const instance = Reflect.construct(ctor, dependencies);
    
    // Cachear
    this.instances.set(ctor, instance);
    
    return instance;
  }
}

const container = new Container();
const service = container.resolve(UserService);
service.findAll();
// "[LOG] Finding users"
// "Query: SELECT * FROM users"
```

## 🎯 ORM Entity Mapping

```typescript
import 'reflect-metadata';

// Metadata keys
const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const PRIMARY_KEY = Symbol('primary');

// Decorators
function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(ENTITY_KEY, { tableName }, target);
    return target;
  };
}

function Column(options: { type: string; nullable?: boolean } = { type: 'varchar' }) {
  return function(target: any, propertyKey: string) {
    const columns = Reflect.getMetadata(COLUMN_KEY, target) || [];
    columns.push({ property: propertyKey, ...options });
    Reflect.defineMetadata(COLUMN_KEY, columns, target);
  };
}

function PrimaryKey(target: any, propertyKey: string) {
  Reflect.defineMetadata(PRIMARY_KEY, propertyKey, target);
}

// Entity
@Entity('users')
class User {
  @PrimaryKey
  @Column({ type: 'integer' })
  id: number;
  
  @Column({ type: 'varchar', nullable: false })
  name: string;
  
  @Column({ type: 'varchar', nullable: true })
  email?: string;
}

// Entity Manager
class EntityManager {
  generateCreateTableSQL(entityClass: any): string {
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, entityClass.prototype) || [];
    const primaryKey = Reflect.getMetadata(PRIMARY_KEY, entityClass.prototype);
    
    const columnDefs = columnsMeta.map((col: any) => {
      let def = `${col.property} ${col.type.toUpperCase()}`;
      
      if (col.property === primaryKey) {
        def += ' PRIMARY KEY';
      }
      
      if (!col.nullable) {
        def += ' NOT NULL';
      }
      
      return def;
    });
    
    return `CREATE TABLE ${entityMeta.tableName} (\n  ${columnDefs.join(',\n  ')}\n);`;
  }
  
  generateInsertSQL(instance: any): string {
    const entityClass = instance.constructor;
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, entityClass.prototype) || [];
    
    const columns = columnsMeta.map((col: any) => col.property);
    const values = columns.map((col: string) => {
      const value = instance[col];
      return typeof value === 'string' ? `'${value}'` : value;
    });
    
    return `INSERT INTO ${entityMeta.tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
  }
}

// Uso
const em = new EntityManager();

console.log(em.generateCreateTableSQL(User));
// CREATE TABLE users (
//   id INTEGER PRIMARY KEY,
//   name VARCHAR NOT NULL,
//   email VARCHAR
// );

const user = new User();
user.id = 1;
user.name = 'Alice';
user.email = 'alice@example.com';

console.log(em.generateInsertSQL(user));
// INSERT INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com');
```

## 🎯 Class Registry Pattern

```typescript
import 'reflect-metadata';

const REGISTERED_KEY = Symbol('registered');

class ClassRegistry {
  private static classes = new Map<string, any>();
  
  static register(name: string, cls: any) {
    this.classes.set(name, cls);
    Reflect.defineMetadata(REGISTERED_KEY, name, cls);
  }
  
  static get(name: string): any {
    return this.classes.get(name);
  }
  
  static getAll(): Map<string, any> {
    return new Map(this.classes);
  }
  
  static isRegistered(cls: any): boolean {
    return Reflect.hasMetadata(REGISTERED_KEY, cls);
  }
  
  static getRegisteredName(cls: any): string | undefined {
    return Reflect.getMetadata(REGISTERED_KEY, cls);
  }
}

// Auto-register decorator
function Registered(name: string) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    ClassRegistry.register(name, target);
    return target;
  };
}

// Classes
@Registered('User')
class User {
  constructor(public name: string) {}
}

@Registered('Product')
class Product {
  constructor(public id: number, public name: string) {}
}

// Uso
console.log(ClassRegistry.getAll().keys()); // MapIterator { 'User', 'Product' }

const UserClass = ClassRegistry.get('User');
const user = Reflect.construct(UserClass, ['Alice']);
console.log(user); // User { name: 'Alice' }

console.log(ClassRegistry.isRegistered(User)); // true
console.log(ClassRegistry.getRegisteredName(Product)); // 'Product'
```

## 🎯 Serialization Framework

```typescript
import 'reflect-metadata';

const SERIALIZE_KEY = Symbol('serialize');

function Serialize(options: { name?: string; transform?: (v: any) => any } = {}) {
  return function(target: any, propertyKey: string) {
    const metadata = Reflect.getMetadata(SERIALIZE_KEY, target) || [];
    metadata.push({
      property: propertyKey,
      name: options.name || propertyKey,
      transform: options.transform
    });
    Reflect.defineMetadata(SERIALIZE_KEY, metadata, target);
  };
}

class Serializer {
  static serialize(instance: any): any {
    const proto = Object.getPrototypeOf(instance);
    const metadata = Reflect.getMetadata(SERIALIZE_KEY, proto) || [];
    
    const result: any = {};
    
    for (const meta of metadata) {
      let value = instance[meta.property];
      
      if (meta.transform) {
        value = meta.transform(value);
      }
      
      result[meta.name] = value;
    }
    
    return result;
  }
}

// Uso
class User {
  @Serialize()
  id: number = 1;
  
  @Serialize({ name: 'full_name' })
  name: string = 'Alice';
  
  @Serialize({ transform: (d: Date) => d.toISOString() })
  createdAt: Date = new Date();
  
  password: string = 'secret'; // Não serializado
}

const user = new User();
const json = Serializer.serialize(user);

console.log(json);
// {
//   id: 1,
//   full_name: 'Alice',
//   createdAt: '2024-01-15T10:30:00.000Z'
// }
// (password não incluído)
```

---

**Conclusão**: Manipulação de classes via Reflect permite construir frameworks poderosos que operam sobre estrutura de código em runtime. Combinação de introspection (examinar), metadata (anotar), e dynamic instantiation (criar) habilita patterns como DI, ORM, serialization, validation.

## 📚 Próximo Arquivo

**05-manipulacao-metodos.md** - Examinar e interceptar métodos em runtime
