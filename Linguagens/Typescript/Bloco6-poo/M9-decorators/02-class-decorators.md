# Class Decorators: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Class decorators** são funções que recebem **constructor de classe** e podem retornar novo constructor ou modificar o existente. Conceitualmente, representam **higher-order constructors**, envolvendo ou estendendo classe original com comportamento adicional mantendo interface pública.

Na essência, class decorators materializam o princípio de **class augmentation**, onde funcionalidade é adicionada à classe sem modificar código original, permitindo patterns como Singleton, Sealed, Timestamped, Registry auto-registration.

### Problema que Resolve

```typescript
// ❌ Sem decorator - implementação manual
class DatabaseSingleton {
  private static instance: DatabaseSingleton;
  
  private constructor() {
    console.log('Database initialized');
  }
  
  static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }
}

// Boilerplate repetitivo para cada singleton

// ✅ Com decorator - reutilizável
function Singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: any;
  
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this;
    }
  };
}

@Singleton
class Database {
  constructor() {
    console.log('Database initialized');
  }
}

const db1 = new Database(); // "Database initialized"
const db2 = new Database(); // (não loga)
console.log(db1 === db2); // true
```

## 📋 Fundamentos

### Sintaxe e Signature

```typescript
// Class decorator signature
function MyDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
  //                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // Generic constraint: constructor function
  
  // Pode retornar novo constructor
  return class extends constructor {
    // Estende classe original
  };
  
  // Ou não retornar nada (modificação in-place)
}

@MyDecorator
class Example {
  // MyDecorator(Example) é chamado
}
```

**Componentes:**
- **Parameter**: `constructor` - constructor function da classe
- **Generic Constraint**: `{ new(...args: any[]): {} }` - tipo constructor
- **Return**: Novo constructor (opcional) ou `void`

### Modificação vs Substituição

```typescript
// Modificação in-place (não retorna)
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  // Não retorna - classe original modificada
}

@Sealed
class User {
  name: string;
}

// Substituição (retorna novo constructor)
function Timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    // Novo constructor que estende original
    createdAt = new Date();
  };
}

@Timestamped
class Article {
  title: string;
}

const article = new Article();
console.log(article.createdAt); // Date presente
```

## 🔍 Análise Conceitual

### 1. Extending Class

```typescript
// Decorator que adiciona propriedades/métodos
function WithId<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    id = Math.random();
    
    getId(): number {
      return this.id;
    }
  };
}

@WithId
class User {
  constructor(public name: string) {}
}

const user = new User('Alice');
console.log((user as any).getId()); // número aleatório
```

**Conceito:** Decorator retorna **nova classe** que estende original, adicionando members.

### 2. Wrapping Constructor

```typescript
// Decorator que intercepta constructor
function LogConstruction<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      console.log(`Creating instance of ${constructor.name}`);
      console.log('Arguments:', args);
      super(...args);
      console.log('Instance created');
    }
  };
}

@LogConstruction
class Product {
  constructor(public name: string, public price: number) {}
}

const product = new Product('Laptop', 1500);
// Output:
// Creating instance of Product
// Arguments: ["Laptop", 1500]
// Instance created
```

### 3. Singleton Implementation

```typescript
function Singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: T | null = null;
  
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
    }
  } as T;
}

@Singleton
class AppConfig {
  private settings: Map<string, any> = new Map();
  
  set(key: string, value: any): void {
    this.settings.set(key, value);
  }
  
  get(key: string): any {
    return this.settings.get(key);
  }
}

const config1 = new AppConfig();
config1.set('apiUrl', 'https://api.example.com');

const config2 = new AppConfig();
console.log(config2.get('apiUrl')); // 'https://api.example.com'
console.log(config1 === config2); // true
```

### 4. Freezing/Sealing

```typescript
// Prevent modifications
function Frozen<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      Object.freeze(this);
    }
  };
}

@Frozen
class Constants {
  PI = 3.14159;
  E = 2.71828;
}

const constants = new Constants();
// constants.PI = 3; // Error em strict mode: cannot assign to read only property
```

### 5. Auto-Registration

```typescript
// Registry pattern
const registry = new Map<string, any>();

function Register(name: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    registry.set(name, constructor);
    return constructor;
  };
}

@Register('UserService')
class UserService {
  getUsers() {
    return ['Alice', 'Bob'];
  }
}

@Register('ProductService')
class ProductService {
  getProducts() {
    return ['Laptop', 'Phone'];
  }
}

// Factory usando registry
function create(name: string): any {
  const Service = registry.get(name);
  if (!Service) throw new Error(`Service ${name} not found`);
  return new Service();
}

const userService = create('UserService');
console.log(userService.getUsers()); // ['Alice', 'Bob']
```

## 🎯 Aplicabilidade

### Metadata Annotation

```typescript
import 'reflect-metadata';

const entityKey = Symbol('entity');

interface EntityMetadata {
  tableName: string;
  primaryKey?: string;
}

function Entity(metadata: EntityMetadata) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(entityKey, metadata, constructor);
    return constructor;
  };
}

@Entity({ tableName: 'users', primaryKey: 'id' })
class User {
  id: number;
  name: string;
  email: string;
}

// ORM pode ler metadata
const metadata = Reflect.getMetadata(entityKey, User);
console.log(metadata); // { tableName: 'users', primaryKey: 'id' }

// Gerar SQL baseado em metadata
function generateCreateTableSQL(entityClass: Function): string {
  const metadata: EntityMetadata = Reflect.getMetadata(entityKey, entityClass);
  if (!metadata) throw new Error('Not an entity');
  
  return `CREATE TABLE ${metadata.tableName} (...)`;
}
```

### Dependency Injection

```typescript
import 'reflect-metadata';

const injectableKey = Symbol('injectable');

function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(injectableKey, true, constructor);
    return constructor;
  };
}

class Container {
  private services = new Map<any, any>();
  
  register<T>(token: new (...args: any[]) => T): void {
    if (!Reflect.getMetadata(injectableKey, token)) {
      throw new Error(`${token.name} must be decorated with @Injectable`);
    }
    this.services.set(token, new token());
  }
  
  resolve<T>(token: new (...args: any[]) => T): T {
    return this.services.get(token);
  }
}

@Injectable()
class Database {
  query(sql: string) {
    console.log('Executing:', sql);
  }
}

@Injectable()
class UserRepository {
  constructor(private db: Database) {}
  
  findAll() {
    this.db.query('SELECT * FROM users');
  }
}

const container = new Container();
container.register(Database);
container.register(UserRepository);

const repo = container.resolve(UserRepository);
repo.findAll();
```

### Validation Schema

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

interface ValidationRule {
  property: string;
  rules: { type: string; value?: any }[];
}

function ValidateClass(validations: ValidationRule[]) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(validationKey, validations, constructor);
    
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        
        // Validar após construção
        const rules: ValidationRule[] = Reflect.getMetadata(validationKey, constructor);
        
        for (const { property, rules: propRules } of rules) {
          const value = (this as any)[property];
          
          for (const rule of propRules) {
            if (rule.type === 'required' && (value === null || value === undefined)) {
              throw new Error(`${property} is required`);
            }
            if (rule.type === 'minLength' && value.length < rule.value) {
              throw new Error(`${property} must be at least ${rule.value} characters`);
            }
          }
        }
      }
    };
  };
}

@ValidateClass([
  { property: 'username', rules: [{ type: 'required' }, { type: 'minLength', value: 3 }] },
  { property: 'email', rules: [{ type: 'required' }] }
])
class User {
  constructor(public username: string, public email: string) {}
}

// const user1 = new User('ab', 'test@example.com'); // Error: username must be at least 3 characters
const user2 = new User('alice', 'alice@example.com'); // OK
```

### Mixins via Decorator

```typescript
// Mixin que adiciona timestamp
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();
    
    touch() {
      this.updatedAt = new Date();
    }
  };
}

function Versioned<T extends Constructor>(Base: T) {
  return class extends Base {
    version = 1;
    
    incrementVersion() {
      this.version++;
    }
  };
}

// Aplicar múltiplos mixins via composition
@Versioned
@Timestamped
class Document {
  constructor(public content: string) {}
}

const doc = new Document('Hello');
console.log((doc as any).createdAt); // Date
console.log((doc as any).version); // 1
(doc as any).incrementVersion();
console.log((doc as any).version); // 2
```

### Performance Tracking

```typescript
const performanceData = new Map<string, { count: number; totalTime: number }>();

function Tracked<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      const start = performance.now();
      super(...args);
      const duration = performance.now() - start;
      
      const className = constructor.name;
      const data = performanceData.get(className) || { count: 0, totalTime: 0 };
      data.count++;
      data.totalTime += duration;
      performanceData.set(className, data);
      
      console.log(`${className} construction took ${duration.toFixed(2)}ms`);
    }
  };
}

@Tracked
class ExpensiveService {
  private data: number[] = [];
  
  constructor() {
    // Simulação de operação custosa
    for (let i = 0; i < 1000000; i++) {
      this.data.push(Math.random());
    }
  }
}

new ExpensiveService();
new ExpensiveService();

const stats = performanceData.get('ExpensiveService');
console.log(`Average construction time: ${(stats!.totalTime / stats!.count).toFixed(2)}ms`);
```

## ⚠️ Limitações

### 1. Cannot Access Instance Members

```typescript
// ❌ Decorator não tem acesso a instance members
function Invalid<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    init() {
      // this.someInstanceProperty // Não está disponível aqui
    }
  };
}
```

### 2. Type Information Lost

```typescript
@Timestamped
class User {
  name: string;
}

const user = new User();
// user.createdAt // Error: Property 'createdAt' doesn't exist on type 'User'

// Solução: type assertion
console.log((user as any).createdAt);

// Ou: definir interface
interface WithTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

const user2 = new User() as User & WithTimestamp;
console.log(user2.createdAt); // OK
```

### 3. Constructor Parameter Types

```typescript
function Log<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      //          ^^^^^^^^^^
      // Type information lost (any[])
      super(...args);
    }
  };
}
```

### 4. Static Members Challenge

```typescript
class Example {
  static config = { debug: true };
  
  static getConfig() {
    return Example.config;
  }
}

@SomeDecorator
class DecoratedExample {
  static config = { debug: true };
  // Static members podem não ser preservados corretamente
}
```

## 🔗 Interconexões

### Com Method Decorators

```typescript
function Logged<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      console.log(`[${constructor.name}] Constructing with:`, args);
      super(...args);
    }
  };
}

function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`[${target.constructor.name}] ${propertyKey} called`);
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

@Logged
class Service {
  @LogMethod
  doWork() {
    console.log('Working...');
  }
}

const service = new Service();
service.doWork();
// Output:
// [Service] Constructing with: []
// [Service] doWork called
// Working...
```

### Com Generics

```typescript
function Repository<Entity>(entityName: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      entityName = entityName;
      
      save(entity: Entity): void {
        console.log(`Saving ${this.entityName}:`, entity);
      }
      
      findAll(): Entity[] {
        console.log(`Finding all ${this.entityName}`);
        return [];
      }
    };
  };
}

interface User {
  id: number;
  name: string;
}

@Repository<User>('User')
class UserRepository {}

const repo = new UserRepository() as any;
repo.save({ id: 1, name: 'Alice' });
```

## 🚀 Evolução e Padrões Modernos

### Abstract Factory Pattern

```typescript
const factories = new Map<string, any>();

function Factory(name: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    factories.set(name, constructor);
    return constructor;
  };
}

@Factory('sqlite')
class SQLiteDatabase {
  connect() {
    console.log('Connected to SQLite');
  }
}

@Factory('postgres')
class PostgresDatabase {
  connect() {
    console.log('Connected to PostgreSQL');
  }
}

function createDatabase(type: string): any {
  const DatabaseClass = factories.get(type);
  if (!DatabaseClass) throw new Error(`Unknown database type: ${type}`);
  return new DatabaseClass();
}

const db = createDatabase('postgres');
db.connect(); // "Connected to PostgreSQL"
```

### Proxy Pattern

```typescript
function Proxied<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      
      return new Proxy(this, {
        get(target, prop) {
          console.log(`Accessing property: ${String(prop)}`);
          return (target as any)[prop];
        },
        set(target, prop, value) {
          console.log(`Setting property: ${String(prop)} = ${value}`);
          (target as any)[prop] = value;
          return true;
        }
      });
    }
  };
}

@Proxied
class User {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}

const user = new User('Alice');
// Output: Accessing property: name
// Output: Setting property: name = Alice

console.log(user.name);
// Output: Accessing property: name
// Alice
```

---

**Conclusão**: Class decorators permitem modificar ou estender classes declarativamente, implementando patterns como Singleton, Registry, Metadata Annotation, Dependency Injection sem modificar código original.
