# Property e Accessor Decorators: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Property decorators** recebem apenas `target` e `propertyKey`, sem `PropertyDescriptor`. **Accessor decorators** (para getters/setters) recebem `PropertyDescriptor` como method decorators. Juntos, permitem adicionar comportamento a propriedades: validação, transformação, observabilidade, metadata annotation.

Conceitualmente, property decorators implementam **metadata-driven programming**, onde propriedades carregam informações sobre validação, serialização, ORM mapping, que são processadas por frameworks.

### Problema que Resolve

```typescript
// ❌ Sem decorator - validação manual repetitiva
class User {
  private _email: string;
  
  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('Invalid email');
    }
    this._email = value;
  }
  
  get email(): string {
    return this._email;
  }
  
  // Repetir validação para cada propriedade...
}

// ✅ Com decorator - declarativo
class User {
  @IsEmail
  email: string;
  
  @MinLength(3)
  username: string;
  
  @IsPositive
  age: number;
}
```

## 📋 Fundamentos

### Property Decorator Signature

```typescript
function PropertyDecorator(
  target: any,                   // prototype da classe (ou constructor se static)
  propertyKey: string | symbol   // nome da propriedade
): void {
  // Não recebe PropertyDescriptor!
  // Pode usar Object.defineProperty para adicionar comportamento
  
  console.log(`Property ${String(propertyKey)} decorated`);
}

class Example {
  @PropertyDecorator
  name: string;
}
```

**Diferença crucial**: Property decorators **não** recebem `descriptor`, apenas `target` e `propertyKey`.

### Accessor Decorator Signature

```typescript
function AccessorDecorator(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor  // ← TEM descriptor
): PropertyDescriptor | void {
  // descriptor contém get/set functions
  // {
  //   get?: () => any,
  //   set?: (value: any) => void,
  //   enumerable: boolean,
  //   configurable: boolean
  // }
  
  const originalGet = descriptor.get;
  const originalSet = descriptor.set;
  
  descriptor.get = function() {
    console.log('Getting value');
    return originalGet?.call(this);
  };
  
  descriptor.set = function(value: any) {
    console.log('Setting value:', value);
    originalSet?.call(this, value);
  };
  
  return descriptor;
}

class Example {
  private _value: number = 0;
  
  @AccessorDecorator
  get value(): number {
    return this._value;
  }
  
  set value(val: number) {
    this._value = val;
  }
}
```

## 🔍 Análise Conceitual

### 1. Validation via Metadata

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

interface ValidationMetadata {
  property: string;
  constraints: Array<{ type: string; value?: any }>;
}

function IsEmail(target: any, propertyKey: string) {
  const existingValidations: ValidationMetadata[] = 
    Reflect.getMetadata(validationKey, target) || [];
  
  existingValidations.push({
    property: propertyKey,
    constraints: [{ type: 'isEmail' }]
  });
  
  Reflect.defineMetadata(validationKey, existingValidations, target);
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    const existingValidations: ValidationMetadata[] = 
      Reflect.getMetadata(validationKey, target) || [];
    
    existingValidations.push({
      property: propertyKey,
      constraints: [{ type: 'minLength', value: length }]
    });
    
    Reflect.defineMetadata(validationKey, existingValidations, target);
  };
}

// Validator service
class Validator {
  static validate(obj: any): string[] {
    const errors: string[] = [];
    const validations: ValidationMetadata[] = 
      Reflect.getMetadata(validationKey, Object.getPrototypeOf(obj)) || [];
    
    for (const { property, constraints } of validations) {
      const value = obj[property];
      
      for (const constraint of constraints) {
        if (constraint.type === 'isEmail' && !String(value).includes('@')) {
          errors.push(`${property} must be a valid email`);
        }
        if (constraint.type === 'minLength' && String(value).length < constraint.value) {
          errors.push(`${property} must be at least ${constraint.value} characters`);
        }
      }
    }
    
    return errors;
  }
}

class User {
  @IsEmail
  email: string;
  
  @MinLength(3)
  username: string;
  
  constructor(email: string, username: string) {
    this.email = email;
    this.username = username;
  }
}

const user1 = new User('invalid', 'ab');
const errors = Validator.validate(user1);
console.log(errors);
// ["email must be a valid email", "username must be at least 3 characters"]

const user2 = new User('alice@example.com', 'alice');
console.log(Validator.validate(user2)); // []
```

### 2. ReadOnly Properties

```typescript
function ReadOnly(target: any, propertyKey: string) {
  let value: any;
  
  Object.defineProperty(target, propertyKey, {
    get(): any {
      return value;
    },
    set(newValue: any): void {
      if (value === undefined) {
        // Permite primeira atribuição (no constructor)
        value = newValue;
      } else {
        throw new Error(`Property ${propertyKey} is read-only`);
      }
    },
    enumerable: true,
    configurable: true
  });
}

class Config {
  @ReadOnly
  apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey; // OK - primeira atribuição
  }
}

const config = new Config('secret123');
console.log(config.apiKey); // 'secret123'
// config.apiKey = 'newkey'; // Error: Property apiKey is read-only
```

### 3. Observable Properties

```typescript
const observersKey = Symbol('observers');

function Observable(target: any, propertyKey: string) {
  const privateKey = Symbol(propertyKey);
  
  Object.defineProperty(target, propertyKey, {
    get(): any {
      return this[privateKey];
    },
    set(value: any): void {
      const oldValue = this[privateKey];
      this[privateKey] = value;
      
      // Notificar observers
      const observers: Array<(oldValue: any, newValue: any) => void> = 
        this[observersKey]?.[propertyKey] || [];
      
      for (const observer of observers) {
        observer(oldValue, value);
      }
    },
    enumerable: true,
    configurable: true
  });
}

class ObservableModel {
  private [observersKey]: Record<string, Array<(oldValue: any, newValue: any) => void>> = {};
  
  observe(property: string, callback: (oldValue: any, newValue: any) => void): void {
    if (!this[observersKey][property]) {
      this[observersKey][property] = [];
    }
    this[observersKey][property].push(callback);
  }
}

class User extends ObservableModel {
  @Observable
  name: string;
  
  @Observable
  email: string;
  
  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }
}

const user = new User('Alice', 'alice@example.com');

user.observe('name', (oldValue, newValue) => {
  console.log(`Name changed from ${oldValue} to ${newValue}`);
});

user.name = 'Bob'; // Output: Name changed from Alice to Bob
```

### 4. Lazy Initialization

```typescript
function Lazy(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalGet = descriptor.get;
  
  if (!originalGet) {
    throw new Error('@Lazy can only be used on getters');
  }
  
  descriptor.get = function() {
    const value = originalGet.call(this);
    
    // Replace getter with computed value
    Object.defineProperty(this, propertyKey, {
      value,
      writable: false,
      configurable: false,
      enumerable: descriptor.enumerable
    });
    
    return value;
  };
  
  return descriptor;
}

class ExpensiveService {
  @Lazy
  get config(): any {
    console.log('Computing config...');
    // Operação custosa
    return {
      apiUrl: 'https://api.example.com',
      timeout: 5000
    };
  }
}

const service = new ExpensiveService();
console.log(service.config); // "Computing config..." + config object
console.log(service.config); // Apenas config object (não computa novamente)
```

### 5. Type Transformation

```typescript
function ToNumber(target: any, propertyKey: string) {
  const privateKey = Symbol(propertyKey);
  
  Object.defineProperty(target, propertyKey, {
    get(): number {
      return this[privateKey];
    },
    set(value: any): void {
      this[privateKey] = Number(value);
    },
    enumerable: true,
    configurable: true
  });
}

function ToUpperCase(target: any, propertyKey: string) {
  const privateKey = Symbol(propertyKey);
  
  Object.defineProperty(target, propertyKey, {
    get(): string {
      return this[privateKey];
    },
    set(value: any): void {
      this[privateKey] = String(value).toUpperCase();
    },
    enumerable: true,
    configurable: true
  });
}

class Product {
  @ToNumber
  price: number;
  
  @ToUpperCase
  name: string;
  
  constructor(name: string, price: any) {
    this.name = name;
    this.price = price;
  }
}

const product = new Product('laptop', '1500');
console.log(product.price); // 1500 (number)
console.log(product.name); // "LAPTOP"
```

## 🎯 Aplicabilidade

### ORM Column Mapping

```typescript
import 'reflect-metadata';

const columnsKey = Symbol('columns');

interface ColumnMetadata {
  propertyName: string;
  columnName: string;
  type: string;
  nullable: boolean;
  unique: boolean;
}

function Column(options: { name?: string; type: string; nullable?: boolean; unique?: boolean }) {
  return function(target: any, propertyKey: string) {
    const columns: ColumnMetadata[] = Reflect.getMetadata(columnsKey, target) || [];
    
    columns.push({
      propertyName: propertyKey,
      columnName: options.name || propertyKey,
      type: options.type,
      nullable: options.nullable ?? false,
      unique: options.unique ?? false
    });
    
    Reflect.defineMetadata(columnsKey, columns, target);
  };
}

class QueryBuilder {
  static generateCreateTable(entityClass: any): string {
    const columns: ColumnMetadata[] = Reflect.getMetadata(columnsKey, entityClass.prototype) || [];
    
    const columnDefs = columns.map(col => {
      let def = `${col.columnName} ${col.type.toUpperCase()}`;
      if (!col.nullable) def += ' NOT NULL';
      if (col.unique) def += ' UNIQUE';
      return def;
    });
    
    return `CREATE TABLE ${entityClass.name.toLowerCase()} (\n  ${columnDefs.join(',\n  ')}\n);`;
  }
}

class User {
  @Column({ type: 'integer', unique: true })
  id: number;
  
  @Column({ name: 'user_name', type: 'varchar(255)' })
  username: string;
  
  @Column({ type: 'varchar(255)', unique: true })
  email: string;
  
  @Column({ type: 'integer', nullable: true })
  age: number;
}

console.log(QueryBuilder.generateCreateTable(User));
// CREATE TABLE user (
//   id INTEGER NOT NULL UNIQUE,
//   user_name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE,
//   age INTEGER
// );
```

### Serialization Control

```typescript
import 'reflect-metadata';

const serializableKey = Symbol('serializable');
const excludeKey = Symbol('exclude');

function Serializable(target: any, propertyKey: string) {
  const properties: string[] = Reflect.getMetadata(serializableKey, target) || [];
  properties.push(propertyKey);
  Reflect.defineMetadata(serializableKey, properties, target);
}

function Exclude(target: any, propertyKey: string) {
  const properties: string[] = Reflect.getMetadata(excludeKey, target) || [];
  properties.push(propertyKey);
  Reflect.defineMetadata(excludeKey, properties, target);
}

class Serializer {
  static toJSON(obj: any): string {
    const serializable: string[] = 
      Reflect.getMetadata(serializableKey, Object.getPrototypeOf(obj)) || [];
    const excluded: string[] = 
      Reflect.getMetadata(excludeKey, Object.getPrototypeOf(obj)) || [];
    
    const result: Record<string, any> = {};
    
    if (serializable.length > 0) {
      // Incluir apenas propriedades marcadas
      for (const prop of serializable) {
        if (!excluded.includes(prop)) {
          result[prop] = obj[prop];
        }
      }
    } else {
      // Incluir todas exceto excludedadas
      for (const prop of Object.keys(obj)) {
        if (!excluded.includes(prop)) {
          result[prop] = obj[prop];
        }
      }
    }
    
    return JSON.stringify(result);
  }
}

class User {
  @Serializable
  id: number;
  
  @Serializable
  username: string;
  
  @Exclude
  password: string;
  
  internalFlag: boolean;
  
  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.internalFlag = true;
  }
}

const user = new User(1, 'alice', 'secret123');
console.log(Serializer.toJSON(user));
// {"id":1,"username":"alice"}
```

### Range Validation

```typescript
function Range(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    const privateKey = Symbol(propertyKey);
    
    Object.defineProperty(target, propertyKey, {
      get(): number {
        return this[privateKey];
      },
      set(value: number): void {
        if (value < min || value > max) {
          throw new Error(`${propertyKey} must be between ${min} and ${max}`);
        }
        this[privateKey] = value;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class GameCharacter {
  @Range(1, 100)
  level: number;
  
  @Range(0, 1000)
  health: number;
  
  constructor(level: number, health: number) {
    this.level = level;
    this.health = health;
  }
}

const character = new GameCharacter(50, 500);
console.log(character.level); // 50

// character.level = 150; // Error: level must be between 1 and 100
```

### Computed Property with Cache

```typescript
function Computed(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalGet = descriptor.get;
  
  if (!originalGet) {
    throw new Error('@Computed can only be used on getters');
  }
  
  const cacheKey = Symbol(`${propertyKey}_cache`);
  const validKey = Symbol(`${propertyKey}_valid`);
  
  descriptor.get = function() {
    if (!this[validKey]) {
      this[cacheKey] = originalGet.call(this);
      this[validKey] = true;
    }
    return this[cacheKey];
  };
  
  // Método para invalidar cache
  (target as any)[`invalidate_${propertyKey}`] = function() {
    this[validKey] = false;
  };
  
  return descriptor;
}

class Rectangle {
  constructor(public width: number, public height: number) {}
  
  @Computed
  get area(): number {
    console.log('Computing area...');
    return this.width * this.height;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area); // "Computing area..." → 50
console.log(rect.area); // 50 (cache hit)
console.log(rect.area); // 50 (cache hit)

// Invalidar cache quando propriedades mudam
rect.width = 20;
(rect as any).invalidate_area();
console.log(rect.area); // "Computing area..." → 100
```

## ⚠️ Limitações

### 1. No PropertyDescriptor

```typescript
// ❌ Property decorator não recebe descriptor
function Invalid(target: any, propertyKey: string) {
  // Não há descriptor para modificar diretamente
  // Precisa usar Object.defineProperty
}
```

### 2. Initialization Order

```typescript
class Example {
  @PropertyDecorator
  name: string = 'Alice';
  // Decorator executa ANTES da atribuição
  // value inicial pode ser undefined no decorator
}
```

### 3. Static Properties

```typescript
class Example {
  @PropertyDecorator
  static config = { debug: true };
  // target será constructor, não prototype
}
```

### 4. Performance com Object.defineProperty

```typescript
// Cada property com getter/setter customizado adiciona overhead
class Model {
  @Observable // Define getter/setter
  prop1: any;
  
  @Observable
  prop2: any;
  
  // Múltiplas properties = múltiplos getter/setter calls
}
```

## 🔗 Interconexões

### Com Class Decorators

```typescript
import 'reflect-metadata';

const modelKey = Symbol('model');

function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(modelKey, { tableName }, constructor);
    return constructor;
  };
}

function PrimaryKey(target: any, propertyKey: string) {
  const columns: string[] = Reflect.getMetadata('primaryKeys', target) || [];
  columns.push(propertyKey);
  Reflect.defineMetadata('primaryKeys', columns, target);
}

@Entity('users')
class User {
  @PrimaryKey
  id: number;
  
  username: string;
}

const tableName = Reflect.getMetadata(modelKey, User);
const primaryKeys = Reflect.getMetadata('primaryKeys', User.prototype);
console.log(tableName); // { tableName: 'users' }
console.log(primaryKeys); // ['id']
```

### Com Method Decorators

```typescript
import 'reflect-metadata';

const requiredPropsKey = Symbol('requiredProps');

function Required(target: any, propertyKey: string) {
  const required: string[] = Reflect.getMetadata(requiredPropsKey, target) || [];
  required.push(propertyKey);
  Reflect.defineMetadata(requiredPropsKey, required, target);
}

function ValidateRequired(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const required: string[] = Reflect.getMetadata(requiredPropsKey, target) || [];
    
    for (const prop of required) {
      if ((this as any)[prop] === undefined || (this as any)[prop] === null) {
        throw new Error(`Property ${prop} is required before calling ${propertyKey}`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @Required
  apiKey: string;
  
  @Required
  baseUrl: string;
  
  @ValidateRequired
  fetchUsers(): void {
    console.log(`Fetching from ${this.baseUrl}`);
  }
}

const service = new UserService();
// service.fetchUsers(); // Error: Property apiKey is required

service.apiKey = 'secret';
service.baseUrl = 'https://api.example.com';
service.fetchUsers(); // OK
```

## 🚀 Evolução e Padrões Modernos

### TypeORM-like Pattern

```typescript
import 'reflect-metadata';

const entityKey = Symbol('entity');
const columnsKey = Symbol('columns');

function Entity(name: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(entityKey, { name }, constructor);
    return constructor;
  };
}

function PrimaryGeneratedColumn(target: any, propertyKey: string) {
  const columns = Reflect.getMetadata(columnsKey, target) || [];
  columns.push({ name: propertyKey, type: 'integer', primary: true, generated: true });
  Reflect.defineMetadata(columnsKey, columns, target);
}

function Column(options?: { type?: string; nullable?: boolean }) {
  return function(target: any, propertyKey: string) {
    const columns = Reflect.getMetadata(columnsKey, target) || [];
    columns.push({
      name: propertyKey,
      type: options?.type || 'varchar',
      nullable: options?.nullable ?? false
    });
    Reflect.defineMetadata(columnsKey, columns, target);
  };
}

@Entity('users')
class User {
  @PrimaryGeneratedColumn
  id: number;
  
  @Column()
  username: string;
  
  @Column({ nullable: true })
  email: string;
}

const entityMeta = Reflect.getMetadata(entityKey, User);
const columnsMeta = Reflect.getMetadata(columnsKey, User.prototype);
console.log(entityMeta); // { name: 'users' }
console.log(columnsMeta);
// [
//   { name: 'id', type: 'integer', primary: true, generated: true },
//   { name: 'username', type: 'varchar', nullable: false },
//   { name: 'email', type: 'varchar', nullable: true }
// ]
```

---

**Conclusão**: Property e Accessor decorators permitem adicionar comportamento a propriedades via metadata, validação, transformação, observabilidade. São fundamentais para frameworks ORM, validation, serialization.
