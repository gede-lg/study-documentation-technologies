# Design-time Type Metadata

## 🎯 Introdução

**Design-time Type Metadata** é funcionalidade do TypeScript que **preserva informação de tipos em runtime** quando `emitDecoratorMetadata: true` está habilitado. TypeScript emite **automaticamente** três tipos de metadata para membros **decorados**:

- `design:type` - Tipo da propriedade
- `design:paramtypes` - Tipos dos parâmetros (constructor/método)
- `design:returntype` - Tipo de retorno (método)

Essencial para **Dependency Injection**, **validation**, **serialization**, **ORM**.

### Configuração Necessária

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // ← Habilita emissão de metadata
  }
}
```

```typescript
// Importar reflect-metadata PRIMEIRO
import 'reflect-metadata';
```

### Conceito

```typescript
import 'reflect-metadata';

class User {
  @Reflect.metadata('custom', 'value')
  name: string; // TypeScript emite metadata: design:type = String
}

const type = Reflect.getMetadata('design:type', User.prototype, 'name');
console.log(type); // [Function: String]
console.log(type.name); // 'String'
```

## 📋 Sumário

### design:type
- Property type metadata
- Tipos primitivos (string, number, boolean)
- Classes customizadas
- Arrays (perde tipo do elemento)
- Tipos complexos (Union, Intersection, Generic → Object)

### design:paramtypes
- Constructor parameters
- Method parameters
- Dependency Injection
- Limitações (generics, unions)

### design:returntype
- Method return types
- Async methods (Promise)
- Void methods
- Limitações (generics dentro de Promise)

### Limitações
- Type erasure (generics, unions, intersections)
- Interfaces não existem em runtime
- Apenas membros decorados
- Circular dependencies

## 🔍 design:type - Property Types

### Tipos Primitivos

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  str: string;
  
  @Reflect.metadata('custom', 'value')
  num: number;
  
  @Reflect.metadata('custom', 'value')
  bool: boolean;
  
  @Reflect.metadata('custom', 'value')
  sym: symbol;
  
  @Reflect.metadata('custom', 'value')
  bigInt: bigint;
}

// Obter tipos
console.log(Reflect.getMetadata('design:type', Example.prototype, 'str')); // [Function: String]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'num')); // [Function: Number]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'bool')); // [Function: Boolean]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'sym')); // [Function: Symbol]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'bigInt')); // [Function: BigInt]
```

### Classes Customizadas

```typescript
import 'reflect-metadata';

class Address {
  street: string;
  city: string;
}

class User {
  @Reflect.metadata('custom', 'value')
  address: Address;
}

const type = Reflect.getMetadata('design:type', User.prototype, 'address');
console.log(type); // [Function: Address]
console.log(type.name); // 'Address'
console.log(type === Address); // true
```

### Built-in Types

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  date: Date;
  
  @Reflect.metadata('custom', 'value')
  regex: RegExp;
  
  @Reflect.metadata('custom', 'value')
  map: Map<string, number>;
  
  @Reflect.metadata('custom', 'value')
  set: Set<string>;
}

console.log(Reflect.getMetadata('design:type', Example.prototype, 'date')); // [Function: Date]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'regex')); // [Function: RegExp]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'map')); // [Function: Map]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'set')); // [Function: Set]
```

### Arrays

```typescript
import 'reflect-metadata';

class User {
  id: number;
  name: string;
}

class Example {
  @Reflect.metadata('custom', 'value')
  numbers: number[]; // Perde informação de 'number'
  
  @Reflect.metadata('custom', 'value')
  users: User[]; // Perde informação de 'User'
  
  @Reflect.metadata('custom', 'value')
  matrix: number[][]; // Perde tudo
}

// ❌ Arrays perdem informação do tipo do elemento
console.log(Reflect.getMetadata('design:type', Example.prototype, 'numbers')); // [Function: Array]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'users')); // [Function: Array]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'matrix')); // [Function: Array]
```

### Object e Any

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  obj: object;
  
  @Reflect.metadata('custom', 'value')
  any: any;
  
  @Reflect.metadata('custom', 'value')
  unknown: unknown;
}

console.log(Reflect.getMetadata('design:type', Example.prototype, 'obj')); // [Function: Object]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'any')); // [Function: Object]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'unknown')); // [Function: Object]
```

## 🔍 Type Erasure - Tipos Complexos

### Union Types

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  stringOrNumber: string | number; // ❌ Perde union
  
  @Reflect.metadata('custom', 'value')
  optional?: string; // ❌ Perde optional
}

// Union types viram Object
console.log(Reflect.getMetadata('design:type', Example.prototype, 'stringOrNumber')); // [Function: Object]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'optional')); // [Function: String]
```

### Intersection Types

```typescript
import 'reflect-metadata';

type A = { a: string };
type B = { b: number };

class Example {
  @Reflect.metadata('custom', 'value')
  intersection: A & B; // ❌ Perde intersection
}

console.log(Reflect.getMetadata('design:type', Example.prototype, 'intersection')); // [Function: Object]
```

### Generics

```typescript
import 'reflect-metadata';

class Example<T> {
  @Reflect.metadata('custom', 'value')
  value: T; // ❌ Perde T
  
  @Reflect.metadata('custom', 'value')
  array: Array<T>; // ❌ Perde T
}

const ex = new Example<string>();

// Generic type parameter é apagado
console.log(Reflect.getMetadata('design:type', Example.prototype, 'value')); // [Function: Object]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'array')); // [Function: Array]
```

### Interfaces

```typescript
import 'reflect-metadata';

interface IUser {
  name: string;
  age: number;
}

class Example {
  @Reflect.metadata('custom', 'value')
  user: IUser; // ❌ Interface não existe em runtime
}

// Interfaces viram Object
console.log(Reflect.getMetadata('design:type', Example.prototype, 'user')); // [Function: Object]
```

### Workaround - Usar Classes ao Invés de Interfaces

```typescript
import 'reflect-metadata';

// ❌ Interface - não funciona
interface IUser {
  name: string;
  age: number;
}

// ✅ Classe - funciona
class User {
  name: string;
  age: number;
}

class Example {
  @Reflect.metadata('custom', 'value')
  userInterface: IUser; // Object
  
  @Reflect.metadata('custom', 'value')
  userClass: User; // User
}

console.log(Reflect.getMetadata('design:type', Example.prototype, 'userInterface')); // [Function: Object]
console.log(Reflect.getMetadata('design:type', Example.prototype, 'userClass')); // [Function: User]
```

## 🔍 design:paramtypes - Parameter Types

### Constructor Parameters

```typescript
import 'reflect-metadata';

class Database {
  connect() {}
}

class Logger {
  log(msg: string) {}
}

@Reflect.metadata('injectable', true)
class UserService {
  constructor(
    private db: Database,
    private logger: Logger,
    private config: object
  ) {}
}

// Obter tipos dos parâmetros do constructor
const paramTypes = Reflect.getMetadata('design:paramtypes', UserService);
console.log(paramTypes); // [Database, Logger, Object]
console.log(paramTypes.map((t: any) => t.name)); // ['Database', 'Logger', 'Object']
```

### Method Parameters

```typescript
import 'reflect-metadata';

class User {
  id: number;
  name: string;
}

class UserService {
  @Reflect.metadata('http', 'POST')
  create(name: string, age: number, user: User) {
    return { name, age };
  }
  
  @Reflect.metadata('http', 'GET')
  findById(id: number) {
    return { id };
  }
}

// Method parameters
const createParams = Reflect.getMetadata('design:paramtypes', UserService.prototype, 'create');
console.log(createParams); // [String, Number, User]

const findParams = Reflect.getMetadata('design:paramtypes', UserService.prototype, 'findById');
console.log(findParams); // [Number]
```

### Dependency Injection

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
  // design:paramtypes detecta automaticamente Database e Logger
  constructor(
    private db: Database,
    private logger: Logger
  ) {}
  
  findAll() {
    this.logger.log('Finding users');
    this.db.query('SELECT * FROM users');
  }
}

// Container usa design:paramtypes para auto-wiring
class Container {
  private instances = new Map<any, any>();
  
  resolve<T>(ctor: new (...args: any[]) => T): T {
    if (this.instances.has(ctor)) {
      return this.instances.get(ctor);
    }
    
    // Obter tipos de parâmetros via metadata
    const paramTypes = Reflect.getMetadata('design:paramtypes', ctor) || [];
    
    // Resolver dependências recursivamente
    const dependencies = paramTypes.map((dep: any) => this.resolve(dep));
    
    // Criar instância
    const instance = Reflect.construct(ctor, dependencies);
    
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

### Optional Parameters

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  method(required: string, optional?: number) {
    return { required, optional };
  }
}

// Optional parameters aparecem normalmente
const paramTypes = Reflect.getMetadata('design:paramtypes', Example.prototype, 'method');
console.log(paramTypes); // [String, Number]
// (não há diferença entre required e optional em metadata)
```

### Default Parameters

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  method(name: string, count: number = 10) {
    return { name, count };
  }
}

// Default value não aparece em metadata
const paramTypes = Reflect.getMetadata('design:paramtypes', Example.prototype, 'method');
console.log(paramTypes); // [String, Number]
```

### Rest Parameters

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  method(first: string, ...rest: number[]) {
    return { first, rest };
  }
}

// Rest parameter aparece como Array
const paramTypes = Reflect.getMetadata('design:paramtypes', Example.prototype, 'method');
console.log(paramTypes); // [String, Array]
// (perde informação de que é number[])
```

## 🔍 design:returntype - Return Types

### Primitive Returns

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  getString(): string {
    return 'hello';
  }
  
  @Reflect.metadata('custom', 'value')
  getNumber(): number {
    return 42;
  }
  
  @Reflect.metadata('custom', 'value')
  getBoolean(): boolean {
    return true;
  }
}

console.log(Reflect.getMetadata('design:returntype', Example.prototype, 'getString')); // [Function: String]
console.log(Reflect.getMetadata('design:returntype', Example.prototype, 'getNumber')); // [Function: Number]
console.log(Reflect.getMetadata('design:returntype', Example.prototype, 'getBoolean')); // [Function: Boolean]
```

### Class Returns

```typescript
import 'reflect-metadata';

class User {
  name: string;
  age: number;
}

class UserService {
  @Reflect.metadata('custom', 'value')
  getUser(): User {
    return new User();
  }
  
  @Reflect.metadata('custom', 'value')
  getUsers(): User[] {
    return [];
  }
}

console.log(Reflect.getMetadata('design:returntype', UserService.prototype, 'getUser')); // [Function: User]
console.log(Reflect.getMetadata('design:returntype', UserService.prototype, 'getUsers')); // [Function: Array]
// (perde informação de User[])
```

### Void Return

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  doSomething(): void {
    console.log('Done');
  }
}

// void vira undefined
const returnType = Reflect.getMetadata('design:returntype', Example.prototype, 'doSomething');
console.log(returnType); // undefined
```

### Async Methods (Promise)

```typescript
import 'reflect-metadata';

class User {
  id: number;
  name: string;
}

class UserService {
  @Reflect.metadata('custom', 'value')
  async fetchUser(): Promise<User> {
    return new User();
  }
  
  @Reflect.metadata('custom', 'value')
  async fetchUsers(): Promise<User[]> {
    return [];
  }
  
  @Reflect.metadata('custom', 'value')
  async processData(): Promise<void> {
    // ...
  }
}

// Promise preservado, mas perde tipo genérico
console.log(Reflect.getMetadata('design:returntype', UserService.prototype, 'fetchUser')); // [Function: Promise]
console.log(Reflect.getMetadata('design:returntype', UserService.prototype, 'fetchUsers')); // [Function: Promise]
console.log(Reflect.getMetadata('design:returntype', UserService.prototype, 'processData')); // [Function: Promise]
// (todos retornam Promise, mas perdem User/User[]/void)
```

### Union Returns

```typescript
import 'reflect-metadata';

class Example {
  @Reflect.metadata('custom', 'value')
  getValue(): string | number {
    return 'hello';
  }
  
  @Reflect.metadata('custom', 'value')
  getNullable(): User | null {
    return null;
  }
}

class User {}

// Union types viram Object
console.log(Reflect.getMetadata('design:returntype', Example.prototype, 'getValue')); // [Function: Object]
console.log(Reflect.getMetadata('design:returntype', Example.prototype, 'getNullable')); // [Function: Object]
```

## 🎯 Uso Prático - Auto Validation

```typescript
import 'reflect-metadata';

// Decorator que valida tipos automaticamente
function ValidateTypes(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
  
  descriptor.value = function(...args: any[]) {
    // Validar cada argumento
    for (let i = 0; i < paramTypes.length; i++) {
      const expectedType = paramTypes[i];
      const actualValue = args[i];
      
      // Validação baseada no tipo
      if (expectedType === String && typeof actualValue !== 'string') {
        throw new TypeError(`Argument ${i} must be string, got ${typeof actualValue}`);
      }
      
      if (expectedType === Number && typeof actualValue !== 'number') {
        throw new TypeError(`Argument ${i} must be number, got ${typeof actualValue}`);
      }
      
      if (expectedType === Boolean && typeof actualValue !== 'boolean') {
        throw new TypeError(`Argument ${i} must be boolean, got ${typeof actualValue}`);
      }
      
      // Classes customizadas
      if (typeof expectedType === 'function' && expectedType !== Object) {
        if (!(actualValue instanceof expectedType)) {
          throw new TypeError(`Argument ${i} must be instance of ${expectedType.name}`);
        }
      }
    }
    
    return Reflect.apply(original, this, args);
  };
  
  return descriptor;
}

class User {
  constructor(public name: string) {}
}

class Example {
  @ValidateTypes
  process(name: string, age: number, active: boolean, user: User) {
    console.log('Processing:', { name, age, active, user });
  }
}

const ex = new Example();

// ✅ Argumentos corretos
ex.process('Alice', 25, true, new User('Bob'));
// "Processing: { name: 'Alice', age: 25, active: true, user: User { name: 'Bob' } }"

// ❌ Tipo incorreto
try {
  ex.process(123, 25, true, new User('Bob')); // TypeError!
} catch (e) {
  console.log(e.message); // "Argument 0 must be string, got number"
}

try {
  ex.process('Alice', '25', true, new User('Bob')); // TypeError!
} catch (e) {
  console.log(e.message); // "Argument 1 must be number, got string"
}

try {
  ex.process('Alice', 25, true, { name: 'Bob' }); // TypeError!
} catch (e) {
  console.log(e.message); // "Argument 3 must be instance of User"
}
```

## 🎯 Uso Prático - Type-based Serialization

```typescript
import 'reflect-metadata';

const SERIALIZE_KEY = Symbol('serialize');

function Serialize(target: any, propertyKey: string) {
  Reflect.defineMetadata(SERIALIZE_KEY, true, target, propertyKey);
}

class Serializer {
  static serialize(instance: any): any {
    const result: any = {};
    const proto = Object.getPrototypeOf(instance);
    const props = Reflect.ownKeys(instance);
    
    for (const prop of props) {
      const shouldSerialize = Reflect.getMetadata(SERIALIZE_KEY, proto, prop as string);
      
      if (!shouldSerialize) continue;
      
      const type = Reflect.getMetadata('design:type', proto, prop as string);
      let value = instance[prop];
      
      // Transformar baseado no tipo
      if (type === Date && value instanceof Date) {
        value = value.toISOString();
      } else if (type === Boolean) {
        value = Boolean(value);
      } else if (type === Number) {
        value = Number(value);
      } else if (type === String) {
        value = String(value);
      } else if (type === Array) {
        value = Array.isArray(value) ? value : [];
      }
      
      result[prop] = value;
    }
    
    return result;
  }
}

class User {
  @Serialize
  id: number = 1;
  
  @Serialize
  name: string = 'Alice';
  
  @Serialize
  createdAt: Date = new Date('2024-01-15');
  
  @Serialize
  active: boolean = true;
  
  password: string = 'secret'; // Não serializado
}

const user = new User();
const json = Serializer.serialize(user);

console.log(json);
// {
//   id: 1,
//   name: 'Alice',
//   createdAt: '2024-01-15T00:00:00.000Z',
//   active: true
// }
```

## ⚠️ Limitações e Soluções

### Limitação 1: Generics

```typescript
import 'reflect-metadata';

// ❌ Problema
class Repository<T> {
  @Reflect.metadata('custom', 'value')
  items: T[]; // Perde T
}

// ✅ Solução: Passar tipo explicitamente via decorator
function TypedArray<T>(type: new () => T) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata('array:type', type, target, propertyKey);
  };
}

class User {}

class UserRepository {
  @TypedArray(User)
  items: User[];
}

const arrayType = Reflect.getMetadata('array:type', UserRepository.prototype, 'items');
console.log(arrayType); // [Function: User]
```

### Limitação 2: Union Types

```typescript
import 'reflect-metadata';

// ❌ Problema
class Example {
  @Reflect.metadata('custom', 'value')
  value: string | number; // Vira Object
}

// ✅ Solução: Passar tipos via decorator
function Union(...types: any[]) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata('union:types', types, target, propertyKey);
  };
}

class Example2 {
  @Union(String, Number)
  value: string | number;
}

const unionTypes = Reflect.getMetadata('union:types', Example2.prototype, 'value');
console.log(unionTypes); // [String, Number]
```

### Limitação 3: Interfaces

```typescript
import 'reflect-metadata';

// ❌ Problema
interface IUser {
  name: string;
}

class Example {
  @Reflect.metadata('custom', 'value')
  user: IUser; // Vira Object
}

// ✅ Solução: Usar classe ao invés de interface
class User {
  name: string;
}

class Example2 {
  @Reflect.metadata('custom', 'value')
  user: User; // Funciona
}

const type = Reflect.getMetadata('design:type', Example2.prototype, 'user');
console.log(type); // [Function: User]
```

### Limitação 4: Circular Dependencies

```typescript
import 'reflect-metadata';

// ❌ Problema
class UserService {
  @Reflect.metadata('inject', 'PostService')
  postService: PostService; // ReferenceError se PostService ainda não existe
}

class PostService {
  @Reflect.metadata('inject', 'UserService')
  userService: UserService;
}

// ✅ Solução: Usar forwardRef
function forwardRef(typeFn: () => any) {
  return function(target: any, propertyKey: string) {
    // Armazenar função ao invés de tipo direto
    Reflect.defineMetadata('forward:ref', typeFn, target, propertyKey);
  };
}

class UserService2 {
  @forwardRef(() => PostService2)
  postService: PostService2;
}

class PostService2 {
  @forwardRef(() => UserService2)
  userService: UserService2;
}

// Resolver tipo via função
const typeFn = Reflect.getMetadata('forward:ref', UserService2.prototype, 'postService');
const type = typeFn(); // Executa função para obter tipo
console.log(type); // [Function: PostService2]
```

---

**Conclusão**: Design-time type metadata (`design:type`, `design:paramtypes`, `design:returntype`) permite frameworks construírem funcionalidades sofisticadas baseadas em tipos. Limitação principal é type erasure (generics, unions, interfaces), mas existem workarounds (decorators customizados, classes ao invés de interfaces, forwardRef).

## 📚 Próximo Arquivo

**08-padroes-avancados-reflect.md** - Padrões avançados usando Reflect e Metadata
