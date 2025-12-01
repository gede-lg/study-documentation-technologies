# Decorators em POO: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Decorators em Programação Orientada a Objetos** são **funções especiais** que modificam ou anotam classes, métodos, propriedades ou parâmetros usando sintaxe `@decorator`. Conceitualmente, representam **metaprogramação declarativa**, permitindo adicionar comportamento, metadata ou validações a elementos de POO sem modificar código original.

Na essência, decorators materializam o princípio de **separation of concerns**, onde aspectos transversais (logging, validation, caching, authorization) são extraídos do código principal e aplicados declarativamente via anotações.

### Contexto Histórico

**Evolução de Decorators:**

1. **Python (2004)**: Introduziu `@decorator` syntax para funções
2. **Java Annotations (2004)**: `@Override`, `@Deprecated` para metadata
3. **C# Attributes (2002)**: `[Attribute]` para metadata reflection
4. **JavaScript Proposal (2014)**: TC39 Stage 2 proposal
5. **TypeScript (2015)**: Implementou decorators experimentais
6. **ECMAScript Stage 3 (2022)**: Decorators padronizados
7. **TypeScript 5.0 (2023)**: Suporte a Stage 3 decorators

**TypeScript decorators** foram pioneiros, influenciando frameworks (Angular, NestJS, TypeORM) que dependem fortemente deles para dependency injection, routing, ORM mapping, validation.

### Problema Fundamental que Resolve

Sem decorators, cross-cutting concerns ficam misturados com lógica de negócio:

```typescript
// ❌ Sem decorators - código entrelaçado
class UserService {
  getUser(id: number): User {
    // Logging manual
    console.log(`[UserService] getUser called with id=${id}`);
    
    // Authorization manual
    if (!this.currentUser?.hasPermission('read:users')) {
      throw new Error('Unauthorized');
    }
    
    // Validation manual
    if (id <= 0) {
      throw new Error('Invalid id');
    }
    
    // Cache check manual
    const cached = this.cache.get(`user:${id}`);
    if (cached) return cached;
    
    // Lógica de negócio
    const user = this.repository.findById(id);
    
    // Cache set manual
    this.cache.set(`user:${id}`, user);
    
    return user;
  }
}

// ✅ Com decorators - separação de concerns
class UserService {
  @Log()
  @Authorize('read:users')
  @ValidateParams
  @Cacheable({ ttl: 3600 })
  getUser(@Positive id: number): User {
    // Apenas lógica de negócio
    return this.repository.findById(id);
  }
}
```

**Fundamento:** Decorators implementam **Aspect-Oriented Programming (AOP)** em TypeScript, permitindo aplicar aspectos (logging, caching, validation) declarativamente sem poluir lógica principal.

### Importância no Ecossistema TypeScript

Decorators são fundamentais porque:

- **Frameworks Enterprise**: Angular (`@Component`, `@Injectable`), NestJS (`@Controller`, `@Get`)
- **ORM/Database**: TypeORM (`@Entity`, `@Column`), Prisma, MikroORM
- **Validation**: class-validator (`@IsEmail`, `@MinLength`)
- **Dependency Injection**: InversifyJS, tsyringe
- **API Documentation**: Swagger/OpenAPI (`@ApiProperty`, `@ApiResponse`)
- **Testing**: Jest, Mocha test decorators
- **Serialization**: class-transformer (`@Type`, `@Expose`)
- **Authorization**: Role-based access control decorators

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Metaprogramação**: Código que modifica código em design-time
2. **Declarative Programming**: Especificar "o quê" em vez de "como"
3. **AOP (Aspect-Oriented Programming)**: Cross-cutting concerns separados
4. **Reflection**: Runtime metadata via Reflect API
5. **Composition**: Múltiplos decorators compostos bottom-to-top

### Pilares Fundamentais

- **Class Decorators**: `@decorator` aplicado a classe
- **Method Decorators**: `@decorator` aplicado a método
- **Property Decorators**: `@decorator` aplicado a propriedade
- **Accessor Decorators**: `@decorator` aplicado a getter/setter
- **Parameter Decorators**: `@decorator` aplicado a parâmetro

### Visão Geral das Nuances

- **Evaluation Order**: Properties → Methods → Class (bottom-to-top)
- **Factory Pattern**: `@decorator(params)` retorna decorator
- **Metadata**: `reflect-metadata` para armazenar informação adicional
- **Type Erasure**: Metadata de tipo disponível apenas com `emitDecoratorMetadata`
- **Composition**: Múltiplos decorators executam de baixo para cima
- **Return Value**: Class/Method decorators podem retornar novo valor

## 🧠 Fundamentos Teóricos

### Anatomia de um Decorator

```typescript
// Class Decorator
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@Sealed
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Method Decorator
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned`, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property Decorator
function ReadOnly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false
  });
}

class Config {
  @ReadOnly
  apiKey: string = 'secret-key';
}
```

### Decorator Factories

```typescript
// Factory que retorna decorator customizado
function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: string) {
        if (newValue.length < length) {
          throw new Error(`${propertyKey} must be at least ${length} characters`);
        }
        value = newValue;
      }
    });
  };
}

class User {
  @MinLength(3)
  username: string;
  
  @MinLength(8)
  password: string;
}

const user = new User();
// user.username = "ab"; // Error: username must be at least 3 characters
user.username = "alice"; // OK
```

### Execution Order

```typescript
function First() {
  console.log('First evaluated');
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('First executed');
  };
}

function Second() {
  console.log('Second evaluated');
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('Second executed');
  };
}

class Example {
  @First()
  @Second()
  method() {}
}

// Output:
// First evaluated
// Second evaluated
// Second executed
// First executed
```

**Conceito:** Decorators são **avaliados top-to-bottom**, mas **executados bottom-to-top**.

### Reflect Metadata

```typescript
import 'reflect-metadata';

// Definir metadata
function Entity(tableName: string) {
  return function(constructor: Function) {
    Reflect.defineMetadata('tableName', tableName, constructor);
  };
}

function Column(columnName: string) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata('columnName', columnName, target, propertyKey);
  };
}

@Entity('users')
class User {
  @Column('user_id')
  id: number;
  
  @Column('user_name')
  name: string;
}

// Ler metadata
const tableName = Reflect.getMetadata('tableName', User); // 'users'
const idColumnName = Reflect.getMetadata('columnName', User.prototype, 'id'); // 'user_id'
```

## 🔍 Análise Conceitual

### 1. Class Decorators

```typescript
// Decorator que adiciona timestamp
function Timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
    updatedAt = new Date();
    
    update() {
      this.updatedAt = new Date();
    }
  };
}

@Timestamped
class Article {
  constructor(public title: string, public content: string) {}
}

const article = new Article('Hello', 'World');
console.log(article.createdAt); // Current date
```

**Conceito:** Class decorator recebe constructor e pode retornar novo constructor que **estende** original.

### 2. Method Decorators

```typescript
// Decorator para memoization
function Memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log('Cache hit');
      return cache.get(key);
    }
    
    console.log('Cache miss');
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class Fibonacci {
  @Memoize
  calculate(n: number): number {
    if (n <= 1) return n;
    return this.calculate(n - 1) + this.calculate(n - 2);
  }
}

const fib = new Fibonacci();
fib.calculate(10); // Cache miss para cada chamada
fib.calculate(10); // Cache hit
```

### 3. Property Decorators com Validation

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

function Min(min: number) {
  return function(target: any, propertyKey: string) {
    const validations = Reflect.getMetadata(validationKey, target) || {};
    validations[propertyKey] = { min };
    Reflect.defineMetadata(validationKey, validations, target);
  };
}

function validate(obj: any): boolean {
  const validations = Reflect.getMetadata(validationKey, obj) || {};
  
  for (const [key, rules] of Object.entries(validations)) {
    const value = obj[key];
    if (rules.min !== undefined && value < rules.min) {
      console.error(`${key} must be >= ${rules.min}`);
      return false;
    }
  }
  
  return true;
}

class Product {
  @Min(0)
  price: number;
  
  @Min(1)
  quantity: number;
  
  constructor(price: number, quantity: number) {
    this.price = price;
    this.quantity = quantity;
  }
}

const product = new Product(100, 5);
validate(product); // true

const invalid = new Product(-10, 0);
validate(invalid); // false (price must be >= 0)
```

### 4. Composição de Decorators

```typescript
function Retry(attempts: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      for (let i = 0; i < attempts; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (i === attempts - 1) throw error;
          console.log(`Attempt ${i + 1} failed, retrying...`);
        }
      }
    };
    
    return descriptor;
  };
}

function Timeout(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), ms)
        )
      ]);
    };
    
    return descriptor;
  };
}

class ApiClient {
  @Retry(3)
  @Timeout(5000)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }
}
```

**Conceito:** Decorators compõem bottom-to-top: `Timeout` executa primeiro, depois `Retry`.

### 5. Parameter Decorators

```typescript
import 'reflect-metadata';

const requiredKey = Symbol('required');

function Required(target: any, propertyKey: string, parameterIndex: number) {
  const required = Reflect.getMetadata(requiredKey, target, propertyKey) || [];
  required.push(parameterIndex);
  Reflect.defineMetadata(requiredKey, required, target, propertyKey);
}

function ValidateParams(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const required: number[] = Reflect.getMetadata(requiredKey, target, propertyKey) || [];
    
    for (const index of required) {
      if (args[index] === undefined || args[index] === null) {
        throw new Error(`Parameter at index ${index} is required`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @ValidateParams
  createUser(@Required name: string, @Required email: string, age?: number) {
    console.log(`Creating user: ${name}, ${email}, ${age || 'N/A'}`);
  }
}

const service = new UserService();
service.createUser('Alice', 'alice@example.com'); // OK
// service.createUser(null, 'test@example.com'); // Error
```

## 🎯 Aplicabilidade

### Dependency Injection

```typescript
import 'reflect-metadata';

const INJECTABLE_KEY = Symbol('injectable');

function Injectable() {
  return function(constructor: Function) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, constructor);
  };
}

class Container {
  private services = new Map<any, any>();
  
  register<T>(token: new (...args: any[]) => T): void {
    if (!Reflect.getMetadata(INJECTABLE_KEY, token)) {
      throw new Error('Class must be decorated with @Injectable');
    }
    this.services.set(token, new token());
  }
  
  resolve<T>(token: new (...args: any[]) => T): T {
    return this.services.get(token);
  }
}

@Injectable()
class UserRepository {
  findAll() {
    return ['Alice', 'Bob'];
  }
}

@Injectable()
class UserService {
  constructor(private repo: UserRepository) {}
  
  getUsers() {
    return this.repo.findAll();
  }
}

const container = new Container();
container.register(UserRepository);
const repo = container.resolve(UserRepository);
```

### Singleton Pattern

```typescript
function Singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: T;
  
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
      return instance;
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
const db2 = new Database(); // (não loga novamente)
console.log(db1 === db2); // true
```

### Logging/Monitoring

```typescript
function Monitor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const start = Date.now();
    
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;
      console.log(`[SUCCESS] ${propertyKey} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`[ERROR] ${propertyKey} failed in ${duration}ms`, error);
      throw error;
    }
  };
  
  return descriptor;
}

class PaymentService {
  @Monitor
  async processPayment(amount: number): Promise<void> {
    // Simulação
    await new Promise(resolve => setTimeout(resolve, 100));
    if (amount < 0) throw new Error('Invalid amount');
  }
}
```

### Authorization

```typescript
import 'reflect-metadata';

const rolesKey = Symbol('roles');

function RequireRole(...roles: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(rolesKey, roles, target, propertyKey);
    
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const userRoles = this.currentUser?.roles || [];
      const requiredRoles = Reflect.getMetadata(rolesKey, target, propertyKey);
      
      const hasRole = requiredRoles.some((role: string) => userRoles.includes(role));
      
      if (!hasRole) {
        throw new Error('Unauthorized');
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class AdminService {
  currentUser?: { roles: string[] };
  
  @RequireRole('admin', 'superuser')
  deleteUser(id: number): void {
    console.log(`Deleting user ${id}`);
  }
}
```

### ORM Mapping

```typescript
import 'reflect-metadata';

const entityKey = Symbol('entity');
const columnKey = Symbol('column');

function Entity(tableName: string) {
  return function(constructor: Function) {
    Reflect.defineMetadata(entityKey, { tableName }, constructor);
  };
}

function Column(options?: { name?: string; type?: string }) {
  return function(target: any, propertyKey: string) {
    const columns = Reflect.getMetadata(columnKey, target.constructor) || [];
    columns.push({ property: propertyKey, ...options });
    Reflect.defineMetadata(columnKey, columns, target.constructor);
  };
}

@Entity('users')
class User {
  @Column({ name: 'user_id', type: 'int' })
  id: number;
  
  @Column({ name: 'user_name', type: 'varchar' })
  name: string;
  
  @Column({ type: 'varchar' })
  email: string;
}

// ORM pode ler metadata para gerar SQL
const entity = Reflect.getMetadata(entityKey, User);
const columns = Reflect.getMetadata(columnKey, User);
console.log(entity); // { tableName: 'users' }
console.log(columns); // [{ property: 'id', name: 'user_id', type: 'int' }, ...]
```

## ⚠️ Limitações

### 1. Experimental Feature

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

**Limitação:** Decorators ainda são experimental feature (Stage 3), requer flag.

### 2. Runtime Overhead

```typescript
// Cada decorator adiciona overhead
@Dec1
@Dec2
@Dec3
@Dec4
@Dec5
method() {
  // Wrapped 5 vezes
}
```

**Consideração:** Múltiplos decorators aumentam call stack e podem impactar performance.

### 3. Type Erasure

```typescript
function LogType(target: any, propertyKey: string) {
  // Sem emitDecoratorMetadata, type não disponível
  const type = Reflect.getMetadata('design:type', target, propertyKey);
  console.log(type); // undefined sem flag
}
```

**Limitação:** Metadata de tipo requer `emitDecoratorMetadata: true` e `reflect-metadata`.

### 4. Cannot Decorate Arrow Functions

```typescript
class Example {
  // ❌ Erro: não pode decorar arrow function
  // @Log
  // method = () => {};
  
  // ✅ OK: método normal
  @Log
  method() {}
}
```

## 🔗 Interconexões

### Com Generics

```typescript
function Validate<T>(validator: (value: T) => boolean) {
  return function(target: any, propertyKey: string) {
    let value: T;
    
    Object.defineProperty(target, propertyKey, {
      get() { return value; },
      set(newValue: T) {
        if (!validator(newValue)) {
          throw new Error(`Invalid value for ${propertyKey}`);
        }
        value = newValue;
      }
    });
  };
}

class User {
  @Validate<string>(v => v.length >= 3)
  username: string;
  
  @Validate<number>(v => v >= 0)
  age: number;
}
```

### Com Mixins

```typescript
function Loggable(constructor: Function) {
  (constructor.prototype as any).log = function(message: string) {
    console.log(`[${constructor.name}] ${message}`);
  };
}

@Loggable
class Service {
  doWork() {
    (this as any).log('Working...');
  }
}
```

## 🚀 Evolução e Padrões Modernos

### Stage 3 Decorators

```typescript
// ECMAScript Stage 3 syntax (TypeScript 5.0+)
function logged(value: Function, context: ClassMethodDecoratorContext) {
  const name = String(context.name);
  
  return function(this: any, ...args: any[]) {
    console.log(`Calling ${name}`);
    return value.apply(this, args);
  };
}

class Example {
  @logged
  method() {
    console.log('Method body');
  }
}
```

### Accessor Decorators

```typescript
function Clamp(min: number, max: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalSet = descriptor.set!;
    
    descriptor.set = function(value: number) {
      const clamped = Math.max(min, Math.min(max, value));
      originalSet.call(this, clamped);
    };
    
    return descriptor;
  };
}

class Volume {
  private _level: number = 50;
  
  @Clamp(0, 100)
  set level(value: number) {
    this._level = value;
  }
  
  get level() {
    return this._level;
  }
}

const vol = new Volume();
vol.level = 150; // Clamped to 100
console.log(vol.level); // 100
```

---

**Conclusão Conceitual**: Decorators em POO permitem metaprogramação declarativa, separando cross-cutting concerns (logging, validation, caching) da lógica de negócio. São fundamentais para frameworks enterprise, dependency injection, ORM mapping, e qualquer código que necessite aspect-oriented programming.
