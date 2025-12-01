# Manipulação de Propriedades com Reflect

## 🎯 Introdução

**Manipulação de propriedades** via Reflect permite **enumerar, examinar, modificar e anotar** propriedades em runtime. Essencial para **ORMs** (column mapping), **serialization**, **validation**, **reactive systems**, **data binding**.

### Operações Principais

```typescript
// 1. Enumerar propriedades
const props = Reflect.ownKeys(user); // Instância
const protoProps = Reflect.ownKeys(User.prototype); // Prototype

// 2. Obter/definir valores
const value = Reflect.get(user, 'name');
Reflect.set(user, 'name', 'Bob');

// 3. Property descriptor
const desc = Reflect.getOwnPropertyDescriptor(user, 'name');

// 4. Metadata de propriedade
const type = Reflect.getMetadata('design:type', User.prototype, 'name');
const validation = Reflect.getMetadata('validation', User.prototype, 'email');

// 5. Definir getter/setter
Reflect.defineProperty(obj, 'computed', {
  get() { return this._value * 2; },
  set(v) { this._value = v; }
});
```

## 📋 Sumário

### Property Discovery
- Enumerar propriedades (instance vs prototype)
- Distinguir data vs accessor properties
- Property descriptors
- Property types (design:type)

### Property Access
- Reflect.get() / Reflect.set()
- Getter/setter detection
- Private fields handling
- Computed properties

### Property Metadata
- Custom metadata attachment
- Validation metadata
- Serialization metadata
- ORM column metadata

### Patterns
- ORM column mapping
- Validation frameworks
- Serialization/deserialization
- Reactive properties
- Property change tracking

## 🔍 Property Discovery

### Instance vs Prototype Properties

```typescript
class User {
  // Instance property (inicializada no constructor)
  id: number = 1;
  name: string = 'Alice';
  
  // Accessor property (no prototype)
  get email() {
    return `${this.name.toLowerCase()}@example.com`;
  }
  
  // Method (no prototype)
  greet() {
    return 'Hello';
  }
}

const user = new User();

// Propriedades da INSTÂNCIA
const instanceProps = Reflect.ownKeys(user);
console.log(instanceProps); // ['id', 'name']

// Propriedades do PROTOTYPE
const protoProps = Reflect.ownKeys(Object.getPrototypeOf(user));
console.log(protoProps); // ['constructor', 'email', 'greet']
```

### Data vs Accessor Properties

```typescript
class Product {
  name: string = 'Widget'; // Data property
  
  private _price: number = 0;
  
  get price() { // Accessor property (getter)
    return this._price;
  }
  
  set price(value: number) { // Accessor property (setter)
    if (value < 0) throw new Error('Invalid price');
    this._price = value;
  }
}

const product = new Product();
const proto = Object.getPrototypeOf(product);

// Distinguir data vs accessor
function isDataProperty(obj: any, prop: string): boolean {
  const desc = Reflect.getOwnPropertyDescriptor(obj, prop);
  return desc !== undefined && 'value' in desc;
}

function isAccessorProperty(obj: any, prop: string): boolean {
  const desc = Reflect.getOwnPropertyDescriptor(obj, prop);
  return desc !== undefined && ('get' in desc || 'set' in desc);
}

console.log(isDataProperty(product, 'name')); // true
console.log(isAccessorProperty(proto, 'price')); // true
```

### Enumerable vs Non-enumerable

```typescript
const obj = { visible: 'yes' };

Object.defineProperty(obj, 'hidden', {
  value: 'no',
  enumerable: false
});

// Object.keys() só enumerable
console.log(Object.keys(obj)); // ['visible']

// Reflect.ownKeys() TODAS (enumerable + non-enumerable)
console.log(Reflect.ownKeys(obj)); // ['visible', 'hidden']

// Filtrar apenas enumerable
const enumerable = Reflect.ownKeys(obj).filter(key => {
  const desc = Reflect.getOwnPropertyDescriptor(obj, key);
  return desc?.enumerable === true;
});
console.log(enumerable); // ['visible']
```

### Property Descriptors

```typescript
class User {
  name: string = 'Alice';
  readonly id: number = 1;
  
  get email() {
    return `${this.name}@example.com`;
  }
}

const user = new User();

// Data property descriptor
const nameDesc = Reflect.getOwnPropertyDescriptor(user, 'name');
console.log(nameDesc);
// {
//   value: 'Alice',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// Readonly property descriptor
const idDesc = Reflect.getOwnPropertyDescriptor(user, 'id');
console.log(idDesc);
// {
//   value: 1,
//   writable: false,  // ← readonly
//   enumerable: true,
//   configurable: true
// }

// Accessor property descriptor
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

## 🔍 Property Access

### Reflect.get() / Reflect.set()

```typescript
class User {
  private _name: string = 'Alice';
  
  get name() {
    console.log('Getter called');
    return this._name;
  }
  
  set name(value: string) {
    console.log('Setter called');
    this._name = value;
  }
}

const user = new User();

// Reflect.get() chama getter
const name = Reflect.get(user, 'name');
// "Getter called"
console.log(name); // 'Alice'

// Reflect.set() chama setter
Reflect.set(user, 'name', 'Bob');
// "Setter called"

console.log(user.name); // 'Bob'
```

### Receiver Parameter

```typescript
const parent = {
  _value: 10,
  get value() {
    return this._value;
  },
  set value(v: number) {
    this._value = v;
  }
};

const child = Object.create(parent);
child._value = 20;

// Sem receiver customizado - usa 'child' como 'this'
console.log(Reflect.get(child, 'value')); // 20

// Com receiver customizado
const other = { _value: 30 };
console.log(Reflect.get(parent, 'value', other)); // 30 (usa 'other' como 'this')
```

### Computed Properties

```typescript
class Rectangle {
  width: number = 10;
  height: number = 5;
  
  get area() {
    return this.width * this.height;
  }
  
  get perimeter() {
    return 2 * (this.width + this.height);
  }
}

const rect = new Rectangle();

// Computed properties são getters
console.log(Reflect.get(rect, 'area')); // 50
console.log(Reflect.get(rect, 'perimeter')); // 30

rect.width = 20;
console.log(Reflect.get(rect, 'area')); // 100 (recalculado)
```

### Interceptar Access

```typescript
class User {
  name: string = 'Alice';
  private _password: string = 'secret';
}

const user = new User();

// Proxy para interceptar acesso
const proxy = new Proxy(user, {
  get(target, prop, receiver) {
    // Bloquear acesso a propriedades privadas
    if (typeof prop === 'string' && prop.startsWith('_')) {
      throw new Error(`Cannot access private property ${prop}`);
    }
    
    return Reflect.get(target, prop, receiver);
  },
  
  set(target, prop, value, receiver) {
    // Validar antes de setar
    if (prop === 'name' && typeof value !== 'string') {
      throw new TypeError('name must be string');
    }
    
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log(proxy.name); // 'Alice'

try {
  console.log(proxy._password); // Error!
} catch (e) {
  console.log(e.message); // "Cannot access private property _password"
}

proxy.name = 'Bob'; // OK

try {
  proxy.name = 123; // TypeError!
} catch (e) {
  console.log(e.message); // "name must be string"
}
```

## 🔍 Property Types (design:type)

### Basic Types

```typescript
import 'reflect-metadata';

class User {
  @Reflect.metadata('custom', 'value')
  name: string;
  
  @Reflect.metadata('custom', 'value')
  age: number;
  
  @Reflect.metadata('custom', 'value')
  active: boolean;
  
  @Reflect.metadata('custom', 'value')
  createdAt: Date;
  
  @Reflect.metadata('custom', 'value')
  tags: string[];
  
  @Reflect.metadata('custom', 'value')
  metadata: object;
}

// Obter tipos
const nameType = Reflect.getMetadata('design:type', User.prototype, 'name');
console.log(nameType); // [Function: String]

const ageType = Reflect.getMetadata('design:type', User.prototype, 'age');
console.log(ageType); // [Function: Number]

const activeType = Reflect.getMetadata('design:type', User.prototype, 'active');
console.log(activeType); // [Function: Boolean]

const dateType = Reflect.getMetadata('design:type', User.prototype, 'createdAt');
console.log(dateType); // [Function: Date]

const tagsType = Reflect.getMetadata('design:type', User.prototype, 'tags');
console.log(tagsType); // [Function: Array] (perdeu informação de string[])

const metaType = Reflect.getMetadata('design:type', User.prototype, 'metadata');
console.log(metaType); // [Function: Object]
```

### Custom Classes

```typescript
import 'reflect-metadata';

class Address {
  street: string;
  city: string;
}

class User {
  @Reflect.metadata('custom', 'value')
  address: Address;
  
  @Reflect.metadata('custom', 'value')
  addresses: Address[]; // Array perde informação de Address
}

const addressType = Reflect.getMetadata('design:type', User.prototype, 'address');
console.log(addressType); // [Function: Address]

const addressesType = Reflect.getMetadata('design:type', User.prototype, 'addresses');
console.log(addressesType); // [Function: Array] (perdeu Address)
```

## 🔍 Property Metadata

### Custom Metadata

```typescript
import 'reflect-metadata';

const REQUIRED_KEY = Symbol('required');
const MIN_LENGTH_KEY = Symbol('minLength');

function Required(target: any, propertyKey: string) {
  Reflect.defineMetadata(REQUIRED_KEY, true, target, propertyKey);
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(MIN_LENGTH_KEY, length, target, propertyKey);
  };
}

class User {
  @Required
  @MinLength(3)
  name: string;
  
  @Required
  email: string;
  
  bio?: string; // Optional, sem decorators
}

// Verificar metadata
const nameRequired = Reflect.getMetadata(REQUIRED_KEY, User.prototype, 'name');
const nameMinLength = Reflect.getMetadata(MIN_LENGTH_KEY, User.prototype, 'name');

console.log(nameRequired); // true
console.log(nameMinLength); // 3

const emailRequired = Reflect.getMetadata(REQUIRED_KEY, User.prototype, 'email');
console.log(emailRequired); // true

const bioRequired = Reflect.getMetadata(REQUIRED_KEY, User.prototype, 'bio');
console.log(bioRequired); // undefined
```

### Validation Metadata

```typescript
import 'reflect-metadata';

const VALIDATION_KEY = Symbol('validation');

interface ValidationRule {
  type: 'string' | 'number' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max';
  value?: any;
  message: string;
}

function addValidation(target: any, propertyKey: string, rule: ValidationRule) {
  const rules = Reflect.getMetadata(VALIDATION_KEY, target, propertyKey) || [];
  rules.push(rule);
  Reflect.defineMetadata(VALIDATION_KEY, rules, target, propertyKey);
}

function IsString(target: any, propertyKey: string) {
  addValidation(target, propertyKey, {
    type: 'string',
    message: `${propertyKey} must be a string`
  });
}

function IsEmail(target: any, propertyKey: string) {
  addValidation(target, propertyKey, {
    type: 'email',
    message: `${propertyKey} must be a valid email`
  });
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    addValidation(target, propertyKey, {
      type: 'minLength',
      value: length,
      message: `${propertyKey} must be at least ${length} characters`
    });
  };
}

function Max(max: number) {
  return function(target: any, propertyKey: string) {
    addValidation(target, propertyKey, {
      type: 'max',
      value: max,
      message: `${propertyKey} must be at most ${max}`
    });
  };
}

class CreateUserDto {
  @IsString
  @MinLength(3)
  name: string;
  
  @IsEmail
  email: string;
  
  @Max(150)
  age: number;
}

// Validator
function validate(obj: any): string[] {
  const errors: string[] = [];
  const proto = Object.getPrototypeOf(obj);
  const props = Reflect.ownKeys(obj);
  
  for (const prop of props) {
    const rules = Reflect.getMetadata(VALIDATION_KEY, proto, prop as string) || [];
    
    for (const rule of rules) {
      const value = obj[prop];
      let valid = true;
      
      switch (rule.type) {
        case 'string':
          valid = typeof value === 'string';
          break;
        case 'email':
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'minLength':
          valid = typeof value === 'string' && value.length >= rule.value;
          break;
        case 'max':
          valid = typeof value === 'number' && value <= rule.value;
          break;
      }
      
      if (!valid) {
        errors.push(rule.message);
      }
    }
  }
  
  return errors;
}

const dto = new CreateUserDto();
dto.name = 'AB'; // Too short
dto.email = 'invalid'; // Not email
dto.age = 200; // Too high

console.log(validate(dto));
// [
//   'name must be at least 3 characters',
//   'email must be a valid email',
//   'age must be at most 150'
// ]
```

### Serialization Metadata

```typescript
import 'reflect-metadata';

const SERIALIZE_KEY = Symbol('serialize');

interface SerializeOptions {
  name?: string; // Nome no JSON
  exclude?: boolean; // Excluir da serialização
  transform?: (value: any) => any; // Transformar valor
}

function Serialize(options: SerializeOptions = {}) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(SERIALIZE_KEY, options, target, propertyKey);
  };
}

class User {
  @Serialize()
  id: number = 1;
  
  @Serialize({ name: 'full_name' })
  name: string = 'Alice';
  
  @Serialize({ transform: (d: Date) => d.toISOString() })
  createdAt: Date = new Date();
  
  @Serialize({ exclude: true })
  password: string = 'secret';
  
  internalId: number = 999; // Sem decorator = não serializado
}

class Serializer {
  static serialize(instance: any): any {
    const result: any = {};
    const proto = Object.getPrototypeOf(instance);
    const props = Reflect.ownKeys(instance);
    
    for (const prop of props) {
      const options = Reflect.getMetadata(SERIALIZE_KEY, proto, prop as string);
      
      // Sem metadata = não serializar
      if (!options) continue;
      
      // Excluído explicitamente
      if (options.exclude) continue;
      
      let value = instance[prop];
      
      // Transformar valor
      if (options.transform) {
        value = options.transform(value);
      }
      
      // Usar nome customizado ou original
      const key = options.name || prop;
      result[key] = value;
    }
    
    return result;
  }
}

const user = new User();
const json = Serializer.serialize(user);

console.log(json);
// {
//   id: 1,
//   full_name: 'Alice',
//   createdAt: '2024-01-15T10:30:00.000Z'
// }
// (password e internalId não incluídos)
```

## 🎯 ORM Column Mapping

```typescript
import 'reflect-metadata';

const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const PRIMARY_KEY = Symbol('primary');
const RELATION_KEY = Symbol('relation');

// Decorators
function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(ENTITY_KEY, { tableName }, target);
    return target;
  };
}

function Column(options: {
  name?: string;
  type?: string;
  nullable?: boolean;
  default?: any;
} = {}) {
  return function(target: any, propertyKey: string) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    
    const columnMeta = {
      property: propertyKey,
      name: options.name || propertyKey,
      type: options.type || inferSQLType(type),
      nullable: options.nullable ?? true,
      default: options.default
    };
    
    const columns = Reflect.getMetadata(COLUMN_KEY, target) || [];
    columns.push(columnMeta);
    Reflect.defineMetadata(COLUMN_KEY, columns, target);
  };
}

function PrimaryKey(target: any, propertyKey: string) {
  Reflect.defineMetadata(PRIMARY_KEY, propertyKey, target);
}

function inferSQLType(type: any): string {
  if (type === String) return 'VARCHAR(255)';
  if (type === Number) return 'INTEGER';
  if (type === Boolean) return 'BOOLEAN';
  if (type === Date) return 'TIMESTAMP';
  return 'TEXT';
}

// Entities
@Entity('users')
class User {
  @PrimaryKey
  @Column({ type: 'INTEGER', nullable: false })
  id: number;
  
  @Column({ nullable: false })
  name: string;
  
  @Column({ name: 'email_address', nullable: true })
  email?: string;
  
  @Column({ type: 'TIMESTAMP', default: 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

// Query Generator
class QueryGenerator {
  static createTable(entityClass: any): string {
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, entityClass.prototype) || [];
    const primaryKey = Reflect.getMetadata(PRIMARY_KEY, entityClass.prototype);
    
    const columnDefs = columnsMeta.map((col: any) => {
      let def = `${col.name} ${col.type}`;
      
      if (col.property === primaryKey) {
        def += ' PRIMARY KEY';
      }
      
      if (!col.nullable) {
        def += ' NOT NULL';
      }
      
      if (col.default !== undefined) {
        def += ` DEFAULT ${col.default}`;
      }
      
      return def;
    });
    
    return `CREATE TABLE ${entityMeta.tableName} (\n  ${columnDefs.join(',\n  ')}\n);`;
  }
  
  static insert(instance: any): string {
    const entityClass = instance.constructor;
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, entityClass.prototype) || [];
    
    const columns: string[] = [];
    const values: any[] = [];
    
    for (const col of columnsMeta) {
      const value = instance[col.property];
      
      if (value !== undefined) {
        columns.push(col.name);
        
        if (typeof value === 'string') {
          values.push(`'${value}'`);
        } else if (value instanceof Date) {
          values.push(`'${value.toISOString()}'`);
        } else {
          values.push(value);
        }
      }
    }
    
    return `INSERT INTO ${entityMeta.tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});`;
  }
}

// Uso
console.log(QueryGenerator.createTable(User));
// CREATE TABLE users (
//   id INTEGER PRIMARY KEY NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   email_address VARCHAR(255),
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

const user = new User();
user.id = 1;
user.name = 'Alice';
user.email = 'alice@example.com';
user.createdAt = new Date();

console.log(QueryGenerator.insert(user));
// INSERT INTO users (id, name, email_address, createdAt) VALUES (1, 'Alice', 'alice@example.com', '2024-01-15T10:30:00.000Z');
```

## 🎯 Reactive Properties

```typescript
import 'reflect-metadata';

const REACTIVE_KEY = Symbol('reactive');

type PropertyChangeListener = (newValue: any, oldValue: any, propertyName: string) => void;

function Reactive(target: any, propertyKey: string) {
  Reflect.defineMetadata(REACTIVE_KEY, true, target, propertyKey);
  
  const privateKey = Symbol(`_${String(propertyKey)}`);
  
  // Definir getter/setter
  Reflect.defineProperty(target, propertyKey, {
    get() {
      return this[privateKey];
    },
    set(newValue: any) {
      const oldValue = this[privateKey];
      
      if (oldValue !== newValue) {
        this[privateKey] = newValue;
        
        // Notificar listeners
        if (this._listeners) {
          for (const listener of this._listeners) {
            listener(newValue, oldValue, propertyKey);
          }
        }
      }
    },
    enumerable: true,
    configurable: true
  });
}

class ReactiveModel {
  private _listeners: PropertyChangeListener[] = [];
  
  onChange(listener: PropertyChangeListener) {
    this._listeners.push(listener);
  }
}

class User extends ReactiveModel {
  @Reactive
  name: string;
  
  @Reactive
  age: number;
  
  email: string; // Não reativo
}

// Uso
const user = new User();

user.onChange((newValue, oldValue, prop) => {
  console.log(`${prop} changed: ${oldValue} → ${newValue}`);
});

user.name = 'Alice'; // "name changed: undefined → Alice"
user.name = 'Bob'; // "name changed: Alice → Bob"
user.age = 25; // "age changed: undefined → 25"
user.email = 'test@example.com'; // (sem log, não é reativo)
```

## 🎯 Property Change Tracking

```typescript
import 'reflect-metadata';

const TRACKED_KEY = Symbol('tracked');

function Tracked(target: any, propertyKey: string) {
  Reflect.defineMetadata(TRACKED_KEY, true, target, propertyKey);
}

class ChangeTracker {
  private changes = new Map<string, { old: any; new: any }>();
  
  track(propertyName: string, oldValue: any, newValue: any) {
    this.changes.set(propertyName, { old: oldValue, new: newValue });
  }
  
  getChanges() {
    return new Map(this.changes);
  }
  
  hasChanges() {
    return this.changes.size > 0;
  }
  
  reset() {
    this.changes.clear();
  }
}

function makeTrackable<T extends { new(...args: any[]): {} }>(target: T) {
  return class extends target {
    _tracker = new ChangeTracker();
    _original: any = {};
    
    constructor(...args: any[]) {
      super(...args);
      
      const proto = Object.getPrototypeOf(this);
      const props = Reflect.ownKeys(this);
      
      for (const prop of props) {
        const isTracked = Reflect.getMetadata(TRACKED_KEY, proto, prop as string);
        
        if (isTracked) {
          this._original[prop] = this[prop];
          
          const privateKey = Symbol(`_tracked_${String(prop)}`);
          this[privateKey] = this[prop];
          
          Reflect.defineProperty(this, prop, {
            get() {
              return this[privateKey];
            },
            set(newValue: any) {
              const oldValue = this[privateKey];
              
              if (oldValue !== newValue) {
                this[privateKey] = newValue;
                this._tracker.track(prop as string, this._original[prop], newValue);
              }
            },
            enumerable: true,
            configurable: true
          });
        }
      }
    }
  };
}

@makeTrackable
class User {
  @Tracked
  name: string = 'Alice';
  
  @Tracked
  age: number = 25;
  
  email: string = 'alice@example.com'; // Não tracked
}

// Uso
const user = new User();

console.log(user._tracker.hasChanges()); // false

user.name = 'Bob';
user.age = 30;
user.email = 'bob@example.com'; // Não tracked

console.log(user._tracker.hasChanges()); // true
console.log(user._tracker.getChanges());
// Map {
//   'name' => { old: 'Alice', new: 'Bob' },
//   'age' => { old: 25, new: 30 }
// }
// (email não aparece)

user._tracker.reset();
console.log(user._tracker.hasChanges()); // false
```

---

**Conclusão**: Manipulação de propriedades via Reflect permite ORM column mapping, validation, serialization, reactive systems. Combinação de property descriptors, `design:type` metadata, custom metadata, e getter/setter interception habilita frameworks poderosos.

## 📚 Próximo Arquivo

**07-design-time-type-metadata.md** - Design-time type metadata em profundidade (design:type, design:paramtypes, design:returntype)
