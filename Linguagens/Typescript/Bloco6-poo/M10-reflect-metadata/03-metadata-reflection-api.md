# Metadata Reflection API (reflect-metadata)

## 🎯 Introdução

**reflect-metadata** é biblioteca que estende `Reflect` com capacidade de **definir e recuperar metadata** arbitrária em objetos, propriedades, métodos. Essencial para **decorators** e frameworks como Angular, NestJS, TypeORM.

### Instalação

```bash
npm install reflect-metadata
```

```typescript
// index.ts - PRIMEIRA linha
import 'reflect-metadata';
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Conceito

```typescript
// Metadata = Map<MetadataKey, MetadataValue> anexada a target

import 'reflect-metadata';

const target = {};

// Anexar metadata
Reflect.defineMetadata('key1', 'value1', target);
Reflect.defineMetadata('key2', { complex: 'object' }, target);

// Recuperar metadata
console.log(Reflect.getMetadata('key1', target)); // 'value1'
console.log(Reflect.getMetadata('key2', target)); // { complex: 'object' }
```

## 📋 Sumário Completo

### Define Metadata
- `Reflect.defineMetadata(key, value, target)` - Metadata em objeto
- `Reflect.defineMetadata(key, value, target, propertyKey)` - Metadata em propriedade/método

### Get Metadata
- `Reflect.getMetadata(key, target)` - Ler metadata (com herança)
- `Reflect.getOwnMetadata(key, target)` - Ler metadata (sem herança)
- `Reflect.getMetadata(key, target, propertyKey)` - Metadata de propriedade/método

### Check Metadata
- `Reflect.hasMetadata(key, target)` - Verificar existência (com herança)
- `Reflect.hasOwnMetadata(key, target)` - Verificar existência (sem herança)

### List Keys
- `Reflect.getMetadataKeys(target)` - Listar todas as chaves (com herança)
- `Reflect.getOwnMetadataKeys(target)` - Listar chaves próprias (sem herança)

### Delete Metadata
- `Reflect.deleteMetadata(key, target)` - Remover metadata

### Design-time Type Metadata
- `design:type` - Tipo da propriedade
- `design:paramtypes` - Tipos dos parâmetros (construtor/método)
- `design:returntype` - Tipo de retorno (método)

## 🔍 Reflect.defineMetadata()

### Sintaxe

```typescript
// Metadata em classe/objeto
Reflect.defineMetadata(metadataKey: any, metadataValue: any, target: Object): void

// Metadata em propriedade/método
Reflect.defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: Object,
  propertyKey: string | symbol
): void
```

### Metadata em Classe

```typescript
import 'reflect-metadata';

class User {
  name: string;
}

// Anexar metadata à classe
Reflect.defineMetadata('table', 'users', User);
Reflect.defineMetadata('schema', { database: 'main' }, User);

// Ler metadata
console.log(Reflect.getMetadata('table', User)); // 'users'
console.log(Reflect.getMetadata('schema', User)); // { database: 'main' }
```

### Metadata em Propriedade

```typescript
import 'reflect-metadata';

class User {
  name: string;
  email: string;
}

// Metadata em propriedades
Reflect.defineMetadata('required', true, User.prototype, 'name');
Reflect.defineMetadata('required', true, User.prototype, 'email');
Reflect.defineMetadata('format', 'email', User.prototype, 'email');

// Ler metadata de propriedade
console.log(Reflect.getMetadata('required', User.prototype, 'name')); // true
console.log(Reflect.getMetadata('format', User.prototype, 'email')); // 'email'
```

### Metadata em Método

```typescript
import 'reflect-metadata';

class UserService {
  findAll() {
    return [];
  }
  
  create(user: any) {
    return user;
  }
}

// Metadata em métodos
Reflect.defineMetadata('http', 'GET', UserService.prototype, 'findAll');
Reflect.defineMetadata('http', 'POST', UserService.prototype, 'create');
Reflect.defineMetadata('auth', true, UserService.prototype, 'create');

// Ler metadata de método
console.log(Reflect.getMetadata('http', UserService.prototype, 'findAll')); // 'GET'
console.log(Reflect.getMetadata('auth', UserService.prototype, 'create')); // true
```

### Symbol Keys

```typescript
import 'reflect-metadata';

// ✅ Usar Symbols evita colisões
const validationKey = Symbol('validation');
const serializationKey = Symbol('serialization');

class Product {
  name: string;
}

Reflect.defineMetadata(validationKey, { required: true }, Product.prototype, 'name');
Reflect.defineMetadata(serializationKey, { serialize: true }, Product.prototype, 'name');

console.log(Reflect.getMetadata(validationKey, Product.prototype, 'name')); // { required: true }
console.log(Reflect.getMetadata(serializationKey, Product.prototype, 'name')); // { serialize: true }
```

## 🔍 Reflect.getMetadata()

### Sintaxe

```typescript
Reflect.getMetadata(metadataKey: any, target: Object): any
Reflect.getMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any
```

### Busca com Herança

```typescript
import 'reflect-metadata';

// Metadata em classe pai
class Animal {
  name: string;
}
Reflect.defineMetadata('species', 'mammal', Animal);

// Classe filha sem metadata própria
class Dog extends Animal {}

// getMetadata busca na cadeia de prototypes
console.log(Reflect.getMetadata('species', Dog)); // 'mammal' (herdado!)
console.log(Reflect.getMetadata('species', Animal)); // 'mammal'
```

### Propriedade Não Existente

```typescript
import 'reflect-metadata';

class User {
  name: string;
}

// Metadata inexistente retorna undefined
console.log(Reflect.getMetadata('nonexistent', User)); // undefined
```

### Metadata Complexa

```typescript
import 'reflect-metadata';

interface ValidationRule {
  type: 'string' | 'number' | 'email';
  required?: boolean;
  minLength?: number;
}

class User {
  email: string;
}

const emailRule: ValidationRule = {
  type: 'email',
  required: true,
  minLength: 5
};

Reflect.defineMetadata('validation', emailRule, User.prototype, 'email');

const rule = Reflect.getMetadata('validation', User.prototype, 'email') as ValidationRule;
console.log(rule.type); // 'email'
console.log(rule.required); // true
console.log(rule.minLength); // 5
```

## 🔍 Reflect.getOwnMetadata()

### Sintaxe

```typescript
Reflect.getOwnMetadata(metadataKey: any, target: Object): any
Reflect.getOwnMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): any
```

### Sem Herança

```typescript
import 'reflect-metadata';

class Animal {
  name: string;
}
Reflect.defineMetadata('species', 'mammal', Animal);

class Dog extends Animal {}

// getMetadata busca na cadeia
console.log(Reflect.getMetadata('species', Dog)); // 'mammal'

// getOwnMetadata NÃO busca na cadeia
console.log(Reflect.getOwnMetadata('species', Dog)); // undefined
console.log(Reflect.getOwnMetadata('species', Animal)); // 'mammal'
```

### Uso Prático

```typescript
import 'reflect-metadata';

class Base {
  id: number;
}
Reflect.defineMetadata('primary', true, Base.prototype, 'id');

class User extends Base {
  name: string;
}
Reflect.defineMetadata('required', true, User.prototype, 'name');

// Listar apenas metadata própria de User
const ownKeys = Reflect.getOwnMetadataKeys(User.prototype, 'name');
console.log(ownKeys); // ['required'] (não inclui 'primary' de Base)
```

## 🔍 Reflect.hasMetadata()

### Sintaxe

```typescript
Reflect.hasMetadata(metadataKey: any, target: Object): boolean
Reflect.hasMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean
```

### Verificar Existência

```typescript
import 'reflect-metadata';

class User {
  email: string;
}

Reflect.defineMetadata('validation', { required: true }, User.prototype, 'email');

// Verificar se metadata existe
console.log(Reflect.hasMetadata('validation', User.prototype, 'email')); // true
console.log(Reflect.hasMetadata('nonexistent', User.prototype, 'email')); // false
```

### Com Herança

```typescript
import 'reflect-metadata';

class Animal {
  name: string;
}
Reflect.defineMetadata('meta', 'value', Animal);

class Dog extends Animal {}

// hasMetadata busca na cadeia
console.log(Reflect.hasMetadata('meta', Dog)); // true (herdado)
console.log(Reflect.hasMetadata('meta', Animal)); // true
```

## 🔍 Reflect.hasOwnMetadata()

### Sintaxe

```typescript
Reflect.hasOwnMetadata(metadataKey: any, target: Object): boolean
Reflect.hasOwnMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean
```

### Sem Herança

```typescript
import 'reflect-metadata';

class Animal {
  name: string;
}
Reflect.defineMetadata('meta', 'value', Animal);

class Dog extends Animal {}

// hasMetadata busca na cadeia
console.log(Reflect.hasMetadata('meta', Dog)); // true

// hasOwnMetadata NÃO busca na cadeia
console.log(Reflect.hasOwnMetadata('meta', Dog)); // false
console.log(Reflect.hasOwnMetadata('meta', Animal)); // true
```

## 🔍 Reflect.getMetadataKeys()

### Sintaxe

```typescript
Reflect.getMetadataKeys(target: Object): any[]
Reflect.getMetadataKeys(target: Object, propertyKey: string | symbol): any[]
```

### Listar Chaves

```typescript
import 'reflect-metadata';

class User {
  email: string;
}

Reflect.defineMetadata('key1', 'value1', User.prototype, 'email');
Reflect.defineMetadata('key2', 'value2', User.prototype, 'email');
Reflect.defineMetadata('key3', 'value3', User.prototype, 'email');

const keys = Reflect.getMetadataKeys(User.prototype, 'email');
console.log(keys); // ['key1', 'key2', 'key3']
```

### Com Herança

```typescript
import 'reflect-metadata';

class Base {
  id: number;
}
Reflect.defineMetadata('base:meta', 'value', Base.prototype, 'id');

class User extends Base {
  id: number;
}
Reflect.defineMetadata('user:meta', 'value', User.prototype, 'id');

// getMetadataKeys inclui herança
const allKeys = Reflect.getMetadataKeys(User.prototype, 'id');
console.log(allKeys); // ['user:meta', 'base:meta']
```

## 🔍 Reflect.getOwnMetadataKeys()

### Sintaxe

```typescript
Reflect.getOwnMetadataKeys(target: Object): any[]
Reflect.getOwnMetadataKeys(target: Object, propertyKey: string | symbol): any[]
```

### Sem Herança

```typescript
import 'reflect-metadata';

class Base {
  id: number;
}
Reflect.defineMetadata('base:meta', 'value', Base.prototype, 'id');

class User extends Base {
  id: number;
}
Reflect.defineMetadata('user:meta', 'value', User.prototype, 'id');

// getOwnMetadataKeys NÃO inclui herança
const ownKeys = Reflect.getOwnMetadataKeys(User.prototype, 'id');
console.log(ownKeys); // ['user:meta']
```

### Iterar Todas as Metadata

```typescript
import 'reflect-metadata';

class Product {
  name: string;
}

const validationKey = Symbol('validation');
const serializationKey = Symbol('serialization');

Reflect.defineMetadata(validationKey, { required: true }, Product.prototype, 'name');
Reflect.defineMetadata(serializationKey, { expose: true }, Product.prototype, 'name');

// Obter todas as metadata
const keys = Reflect.getOwnMetadataKeys(Product.prototype, 'name');

for (const key of keys) {
  const value = Reflect.getOwnMetadata(key, Product.prototype, 'name');
  console.log(key, value);
}
// Symbol(validation) { required: true }
// Symbol(serialization) { expose: true }
```

## 🔍 Reflect.deleteMetadata()

### Sintaxe

```typescript
Reflect.deleteMetadata(metadataKey: any, target: Object): boolean
Reflect.deleteMetadata(metadataKey: any, target: Object, propertyKey: string | symbol): boolean
```

### Remover Metadata

```typescript
import 'reflect-metadata';

class User {
  email: string;
}

Reflect.defineMetadata('temp', 'temporary data', User.prototype, 'email');

console.log(Reflect.hasMetadata('temp', User.prototype, 'email')); // true

// Deletar metadata
const deleted = Reflect.deleteMetadata('temp', User.prototype, 'email');
console.log(deleted); // true

console.log(Reflect.hasMetadata('temp', User.prototype, 'email')); // false
```

### Metadata Inexistente

```typescript
import 'reflect-metadata';

class User {}

// Deletar metadata inexistente retorna false
const deleted = Reflect.deleteMetadata('nonexistent', User);
console.log(deleted); // false
```

## 🎯 Design-time Type Metadata

### emitDecoratorMetadata

Quando `emitDecoratorMetadata: true` está habilitado, TypeScript **automaticamente** emite metadata de tipo para membros **decorados**.

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // ← Emite metadata de tipo
  }
}
```

### design:type

```typescript
import 'reflect-metadata';

function LogType(target: any, propertyKey: string) {
  const type = Reflect.getMetadata('design:type', target, propertyKey);
  console.log(`${propertyKey} type:`, type.name);
}

class User {
  @LogType
  name: string; // "name type: String"
  
  @LogType
  age: number; // "age type: Number"
  
  @LogType
  active: boolean; // "active type: Boolean"
  
  @LogType
  createdAt: Date; // "createdAt type: Date"
  
  @LogType
  tags: string[]; // "tags type: Array"
  
  @LogType
  metadata: object; // "metadata type: Object"
}
```

### design:paramtypes

```typescript
import 'reflect-metadata';

function LogParams(target: any, propertyKey: string) {
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  console.log(`${propertyKey} params:`, paramTypes.map((t: any) => t.name));
}

class Database {
  query: string;
}

class UserService {
  constructor(db: Database) {}
  
  @LogParams
  findById(id: number, includeDeleted: boolean) {
    // "findById params: ['Number', 'Boolean']"
  }
  
  @LogParams
  create(name: string, age: number, db: Database) {
    // "create params: ['String', 'Number', 'Database']"
  }
}
```

### design:returntype

```typescript
import 'reflect-metadata';

function LogReturn(target: any, propertyKey: string) {
  const returnType = Reflect.getMetadata('design:returntype', target, propertyKey);
  console.log(`${propertyKey} returns:`, returnType.name);
}

class UserService {
  @LogReturn
  findAll(): User[] {
    // "findAll returns: Array"
    return [];
  }
  
  @LogReturn
  count(): number {
    // "count returns: Number"
    return 0;
  }
  
  @LogReturn
  getName(): string {
    // "getName returns: String"
    return '';
  }
  
  @LogReturn
  async fetchData(): Promise<any> {
    // "fetchData returns: Promise"
    return null;
  }
}
```

## 🎯 Dependency Injection com Type Metadata

```typescript
import 'reflect-metadata';

// Metadata keys
const INJECT_KEY = Symbol('inject');
const INJECTABLE_KEY = Symbol('injectable');

// Decorators
function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
    return target;
  };
}

function Inject(token?: any) {
  return function(target: any, propertyKey: string | undefined, parameterIndex: number) {
    const existingInjections = Reflect.getMetadata(INJECT_KEY, target) || [];
    
    // Se token não fornecido, usar design:paramtypes
    if (!token) {
      const paramTypes = Reflect.getMetadata('design:paramtypes', target);
      token = paramTypes[parameterIndex];
    }
    
    existingInjections.push({ index: parameterIndex, token });
    Reflect.defineMetadata(INJECT_KEY, existingInjections, target);
  };
}

// Services
@Injectable()
class Database {
  query(sql: string) {
    console.log('Executing:', sql);
  }
}

@Injectable()
class Logger {
  log(message: string) {
    console.log('[LOG]', message);
  }
}

@Injectable()
class UserService {
  // design:paramtypes detecta Database e Logger automaticamente
  constructor(
    private db: Database,
    private logger: Logger
  ) {}
  
  findAll() {
    this.logger.log('Finding all users');
    this.db.query('SELECT * FROM users');
  }
}

// Container
class Container {
  private instances = new Map<any, any>();
  
  resolve<T>(token: new (...args: any[]) => T): T {
    // Verificar se já instanciado
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }
    
    // Verificar se é @Injectable
    const isInjectable = Reflect.getMetadata(INJECTABLE_KEY, token);
    if (!isInjectable) {
      throw new Error(`${token.name} is not injectable`);
    }
    
    // Obter dependências
    const paramTypes = Reflect.getMetadata('design:paramtypes', token) || [];
    const injections = Reflect.getMetadata(INJECT_KEY, token) || [];
    
    // Resolver dependências
    const dependencies = paramTypes.map((paramType: any, index: number) => {
      const injection = injections.find((inj: any) => inj.index === index);
      const dependencyToken = injection?.token || paramType;
      return this.resolve(dependencyToken);
    });
    
    // Criar instância
    const instance = new token(...dependencies);
    
    // Cachear
    this.instances.set(token, instance);
    
    return instance;
  }
}

// Uso
const container = new Container();
const service = container.resolve(UserService);
service.findAll();
// "[LOG] Finding all users"
// "Executing: SELECT * FROM users"
```

## 🎯 Validation Framework

```typescript
import 'reflect-metadata';

const VALIDATION_KEY = Symbol('validation');

// Validation decorators
function IsString(target: any, propertyKey: string) {
  addValidation(target, propertyKey, {
    validator: (value: any) => typeof value === 'string',
    message: `${propertyKey} must be a string`
  });
}

function IsEmail(target: any, propertyKey: string) {
  addValidation(target, propertyKey, {
    validator: (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: `${propertyKey} must be a valid email`
  });
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    addValidation(target, propertyKey, {
      validator: (value: any) => typeof value === 'string' && value.length >= length,
      message: `${propertyKey} must be at least ${length} characters`
    });
  };
}

function Max(max: number) {
  return function(target: any, propertyKey: string) {
    addValidation(target, propertyKey, {
      validator: (value: any) => typeof value === 'number' && value <= max,
      message: `${propertyKey} must be at most ${max}`
    });
  };
}

// Helper
function addValidation(target: any, propertyKey: string, rule: any) {
  const rules = Reflect.getMetadata(VALIDATION_KEY, target, propertyKey) || [];
  rules.push(rule);
  Reflect.defineMetadata(VALIDATION_KEY, rules, target, propertyKey);
}

// Validator
function validate(obj: any): string[] {
  const errors: string[] = [];
  const prototype = Object.getPrototypeOf(obj);
  
  // Obter todas as propriedades
  const properties = Reflect.ownKeys(obj);
  
  for (const property of properties) {
    const rules = Reflect.getMetadata(VALIDATION_KEY, prototype, property as string) || [];
    
    for (const rule of rules) {
      if (!rule.validator(obj[property])) {
        errors.push(rule.message);
      }
    }
  }
  
  return errors;
}

// Uso
class CreateUserDto {
  @IsString
  @MinLength(3)
  name: string;
  
  @IsEmail
  email: string;
  
  @Max(150)
  age: number;
}

const dto = new CreateUserDto();
dto.name = 'AB'; // Too short
dto.email = 'invalid'; // Not email
dto.age = 200; // Too high

const errors = validate(dto);
console.log(errors);
// [
//   'name must be at least 3 characters',
//   'email must be a valid email',
//   'age must be at most 150'
// ]
```

## ⚠️ Limitações

### 1. Type Erasure - Generics

```typescript
import 'reflect-metadata';

class Repository<T> {
  @Reflect.metadata('custom', 'value')
  items: T[]; // Runtime: Array, perde informação de T
}

const repo = new Repository<User>();

// design:type só sabe que é Array
const type = Reflect.getMetadata('design:type', repo, 'items');
console.log(type); // [Function: Array] - não sabe que é User[]
```

### 2. Type Erasure - Union Types

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  value: string | number; // Runtime: Object
}

const ex = new Example();
const type = Reflect.getMetadata('design:type', ex, 'value');
console.log(type); // [Function: Object] - perde union
```

### 3. Type Erasure - Interfaces

```typescript
import 'reflect-metadata';

interface IUser {
  name: string;
}

class Example {
  @Reflect.metadata('custom', 'value')
  user: IUser; // Runtime: Object (interfaces não existem em runtime)
}

const ex = new Example();
const type = Reflect.getMetadata('design:type', ex, 'user');
console.log(type); // [Function: Object]
```

### 4. Apenas Membros Decorados

```typescript
import 'reflect-metadata';

class Example {
  decorated: string; // ❌ Sem decorator, sem metadata
  
  @Reflect.metadata('custom', 'value')
  withDecorator: string; // ✅ Com decorator, metadata emitida
}

// design:type só existe para membros decorados
const type1 = Reflect.getMetadata('design:type', Example.prototype, 'decorated');
console.log(type1); // undefined

const type2 = Reflect.getMetadata('design:type', Example.prototype, 'withDecorator');
console.log(type2); // [Function: String]
```

---

**Conclusão**: Reflect Metadata fornece sistema poderoso de anotações para TypeScript. Design-time type metadata (`design:type`, `design:paramtypes`, `design:returntype`) permite frameworks construírem funcionalidades sofisticadas (DI, validation, serialization) baseadas em tipos. Limitação principal é type erasure de generics, unions, interfaces.

## 📚 Próximo Arquivo

**04-manipulacao-classes.md** - Introspection e manipulação de classes em runtime
