# Manipulação de Métodos com Reflect

## 🎯 Introdução

**Manipulação de métodos** via Reflect permite **enumerar, examinar, interceptar e modificar** métodos em runtime. Essencial para **AOP** (Aspect-Oriented Programming), logging, validation, caching, transactions, authorization.

### Operações Principais

```typescript
// 1. Enumerar métodos
const methods = Reflect.ownKeys(User.prototype).filter(key => 
  typeof User.prototype[key] === 'function' && key !== 'constructor'
);

// 2. Obter metadata de método
const httpMethod = Reflect.getMetadata('http:method', User.prototype, 'findAll');

// 3. Obter tipos de parâmetros
const paramTypes = Reflect.getMetadata('design:paramtypes', User.prototype, 'create');

// 4. Obter tipo de retorno
const returnType = Reflect.getMetadata('design:returntype', User.prototype, 'findAll');

// 5. Interceptar método (wrapping)
const original = User.prototype.save;
User.prototype.save = function(...args) {
  console.log('Before save');
  const result = Reflect.apply(original, this, args);
  console.log('After save');
  return result;
};
```

## 📋 Sumário

### Method Discovery
- Enumerar métodos de classe
- Filtrar por tipo (instance vs static)
- Distinguir sync vs async
- Examinar assinatura (parameters, return type)

### Metadata Inspection
- Parameter types (design:paramtypes)
- Return type (design:returntype)
- Custom metadata
- Parameter decorators metadata

### Method Interception
- Method wrapping
- Before/after hooks
- Error handling
- Performance timing

### Patterns
- AOP (Aspect-Oriented Programming)
- Method caching
- Transaction management
- Authorization
- Logging/auditing

## 🔍 Method Discovery

### Enumerar Métodos de Instância

```typescript
class User {
  name: string = 'Alice';
  
  greet() {
    return `Hello, ${this.name}`;
  }
  
  save() {
    return 'Saved';
  }
  
  delete() {
    return 'Deleted';
  }
}

// Obter todas as chaves do prototype
const allKeys = Reflect.ownKeys(User.prototype);
console.log(allKeys); // ['constructor', 'greet', 'save', 'delete']

// Filtrar apenas métodos (excluir constructor)
const methods = allKeys.filter(key => {
  return key !== 'constructor' && typeof User.prototype[key as any] === 'function';
});

console.log(methods); // ['greet', 'save', 'delete']
```

### Enumerar Métodos Estáticos

```typescript
class Database {
  static connect() {
    return 'Connected';
  }
  
  static disconnect() {
    return 'Disconnected';
  }
  
  query(sql: string) {
    return 'Result';
  }
}

// Métodos estáticos estão na classe (constructor function)
const allStaticKeys = Reflect.ownKeys(Database);
console.log(allStaticKeys);
// ['length', 'prototype', 'name', 'connect', 'disconnect']

// Filtrar métodos estáticos customizados
const staticMethods = allStaticKeys.filter(key => {
  const standardKeys = ['length', 'prototype', 'name'];
  return !standardKeys.includes(key as string) && 
         typeof Database[key as any] === 'function';
});

console.log(staticMethods); // ['connect', 'disconnect']
```

### Distinguir Sync vs Async

```typescript
class UserService {
  findAll() {
    return ['Alice', 'Bob'];
  }
  
  async fetchData() {
    return ['Data'];
  }
  
  async *generateItems() {
    yield 'Item 1';
    yield 'Item 2';
  }
}

const service = new UserService();
const proto = Object.getPrototypeOf(service);

function getMethodType(obj: any, methodName: string): string {
  const method = obj[methodName];
  
  if (method.constructor.name === 'AsyncGeneratorFunction') {
    return 'async-generator';
  }
  
  if (method.constructor.name === 'GeneratorFunction') {
    return 'generator';
  }
  
  if (method.constructor.name === 'AsyncFunction') {
    return 'async';
  }
  
  return 'sync';
}

console.log(getMethodType(proto, 'findAll')); // 'sync'
console.log(getMethodType(proto, 'fetchData')); // 'async'
console.log(getMethodType(proto, 'generateItems')); // 'async-generator'
```

### Method Descriptor

```typescript
class User {
  greet() {
    return 'Hello';
  }
  
  get name() {
    return 'Alice';
  }
}

const proto = User.prototype;

// Descriptor de método
const methodDesc = Reflect.getOwnPropertyDescriptor(proto, 'greet');
console.log(methodDesc);
// {
//   value: [Function: greet],
//   writable: true,
//   enumerable: false,
//   configurable: true
// }

// Descriptor de getter
const getterDesc = Reflect.getOwnPropertyDescriptor(proto, 'name');
console.log(getterDesc);
// {
//   get: [Function: get name],
//   set: undefined,
//   enumerable: false,
//   configurable: true
// }
```

## 🔍 Metadata Inspection

### Parameter Types (design:paramtypes)

```typescript
import 'reflect-metadata';

class Database {
  connect() {}
}

class Logger {
  log(msg: string) {}
}

class UserService {
  @Reflect.metadata('custom', 'value')
  create(name: string, age: number, db: Database, logger: Logger) {
    return { name, age };
  }
}

// Obter tipos dos parâmetros
const paramTypes = Reflect.getMetadata('design:paramtypes', UserService.prototype, 'create');

console.log(paramTypes); // [String, Number, Database, Logger]
console.log(paramTypes.map((t: any) => t.name)); // ['String', 'Number', 'Database', 'Logger']
```

### Return Type (design:returntype)

```typescript
import 'reflect-metadata';

class User {
  id: number;
  name: string;
}

class UserService {
  @Reflect.metadata('custom', 'value')
  findAll(): User[] {
    return [];
  }
  
  @Reflect.metadata('custom', 'value')
  count(): number {
    return 0;
  }
  
  @Reflect.metadata('custom', 'value')
  async fetchUser(): Promise<User> {
    return new User();
  }
}

// Return types
const findAllReturn = Reflect.getMetadata('design:returntype', UserService.prototype, 'findAll');
console.log(findAllReturn.name); // 'Array' (perdeu informação de User[])

const countReturn = Reflect.getMetadata('design:returntype', UserService.prototype, 'count');
console.log(countReturn.name); // 'Number'

const fetchReturn = Reflect.getMetadata('design:returntype', UserService.prototype, 'fetchUser');
console.log(fetchReturn.name); // 'Promise' (perdeu informação de User)
```

### Custom Metadata

```typescript
import 'reflect-metadata';

const HTTP_METHOD_KEY = Symbol('http:method');
const AUTH_KEY = Symbol('auth');

function HttpGet(path: string) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(HTTP_METHOD_KEY, { method: 'GET', path }, target, propertyKey);
  };
}

function Authenticated(target: any, propertyKey: string) {
  Reflect.defineMetadata(AUTH_KEY, true, target, propertyKey);
}

class UserController {
  @HttpGet('/users')
  @Authenticated
  findAll() {
    return [];
  }
  
  @HttpGet('/users/:id')
  findOne() {
    return {};
  }
}

// Ler metadata
const httpMeta = Reflect.getMetadata(HTTP_METHOD_KEY, UserController.prototype, 'findAll');
const authMeta = Reflect.getMetadata(AUTH_KEY, UserController.prototype, 'findAll');

console.log(httpMeta); // { method: 'GET', path: '/users' }
console.log(authMeta); // true

const noAuth = Reflect.getMetadata(AUTH_KEY, UserController.prototype, 'findOne');
console.log(noAuth); // undefined
```

### Parameter Decorators Metadata

```typescript
import 'reflect-metadata';

const PARAM_META_KEY = Symbol('param:metadata');

function Validate(type: 'email' | 'number') {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const existingMeta = Reflect.getMetadata(PARAM_META_KEY, target, propertyKey) || [];
    existingMeta.push({ index: parameterIndex, type });
    Reflect.defineMetadata(PARAM_META_KEY, existingMeta, target, propertyKey);
  };
}

class UserService {
  create(
    @Validate('email') email: string,
    @Validate('number') age: number
  ) {
    return { email, age };
  }
}

// Obter metadata de parâmetros
const paramMeta = Reflect.getMetadata(PARAM_META_KEY, UserService.prototype, 'create');
console.log(paramMeta);
// [
//   { index: 0, type: 'email' },
//   { index: 1, type: 'number' }
// ]
```

## 🔍 Method Interception

### Basic Wrapping

```typescript
class User {
  name: string = 'Alice';
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

// Interceptar método
const original = User.prototype.greet;

User.prototype.greet = function(...args: any[]) {
  console.log('Before greet');
  
  // Invocar original preservando 'this'
  const result = Reflect.apply(original, this, args);
  
  console.log('After greet');
  return result;
};

const user = new User();
console.log(user.greet());
// "Before greet"
// "After greet"
// "Hello, Alice"
```

### Before/After Hooks

```typescript
function createHookedMethod(
  target: any,
  methodName: string,
  before?: () => void,
  after?: () => void
) {
  const original = target[methodName];
  
  target[methodName] = function(...args: any[]) {
    if (before) before.call(this);
    
    const result = Reflect.apply(original, this, args);
    
    if (after) after.call(this);
    
    return result;
  };
}

class UserService {
  save() {
    console.log('Saving...');
    return 'Saved';
  }
}

createHookedMethod(
  UserService.prototype,
  'save',
  function() { console.log('Transaction begin'); },
  function() { console.log('Transaction commit'); }
);

const service = new UserService();
service.save();
// "Transaction begin"
// "Saving..."
// "Transaction commit"
```

### Error Handling

```typescript
function withErrorHandling(target: any, methodName: string) {
  const original = target[methodName];
  
  target[methodName] = function(...args: any[]) {
    try {
      return Reflect.apply(original, this, args);
    } catch (error) {
      console.error(`Error in ${methodName}:`, error);
      throw error;
    }
  };
}

class Calculator {
  divide(a: number, b: number) {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
}

withErrorHandling(Calculator.prototype, 'divide');

const calc = new Calculator();
console.log(calc.divide(10, 2)); // 5

try {
  calc.divide(10, 0);
} catch (e) {
  // Error logged: "Error in divide: Error: Division by zero"
}
```

### Performance Timing

```typescript
function withTiming(target: any, methodName: string) {
  const original = target[methodName];
  
  target[methodName] = function(...args: any[]) {
    const start = performance.now();
    
    const result = Reflect.apply(original, this, args);
    
    const duration = performance.now() - start;
    console.log(`${methodName} took ${duration.toFixed(2)}ms`);
    
    return result;
  };
}

class DataProcessor {
  process(items: number[]) {
    return items.map(x => x * 2);
  }
}

withTiming(DataProcessor.prototype, 'process');

const processor = new DataProcessor();
processor.process([1, 2, 3, 4, 5]);
// "process took 0.15ms"
```

## 🎯 AOP (Aspect-Oriented Programming)

### Logging Aspect

```typescript
import 'reflect-metadata';

const LOG_KEY = Symbol('log');

function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  Reflect.defineMetadata(LOG_KEY, true, target, propertyKey);
  
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`[LOG] Calling ${propertyKey} with args:`, args);
    
    const result = Reflect.apply(original, this, args);
    
    console.log(`[LOG] ${propertyKey} returned:`, result);
    
    return result;
  };
  
  return descriptor;
}

class MathService {
  @Log
  add(a: number, b: number) {
    return a + b;
  }
  
  @Log
  multiply(a: number, b: number) {
    return a * b;
  }
}

const math = new MathService();
math.add(5, 3);
// "[LOG] Calling add with args: [5, 3]"
// "[LOG] add returned: 8"

math.multiply(4, 2);
// "[LOG] Calling multiply with args: [4, 2]"
// "[LOG] multiply returned: 8"
```

### Caching Aspect

```typescript
import 'reflect-metadata';

const CACHE_KEY = Symbol('cache');

function Cached(ttl: number = 60000) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const cache = new Map<string, { value: any; expires: number }>();
    
    descriptor.value = function(...args: any[]) {
      const key = JSON.stringify(args);
      const now = Date.now();
      
      // Cache hit
      const cached = cache.get(key);
      if (cached && cached.expires > now) {
        console.log(`[CACHE] Hit for ${propertyKey}(${key})`);
        return cached.value;
      }
      
      // Cache miss
      console.log(`[CACHE] Miss for ${propertyKey}(${key})`);
      const result = Reflect.apply(original, this, args);
      
      cache.set(key, {
        value: result,
        expires: now + ttl
      });
      
      return result;
    };
    
    return descriptor;
  };
}

class DataService {
  @Cached(5000) // 5 seconds
  fetchUser(id: number) {
    console.log(`[DB] Fetching user ${id}`);
    return { id, name: `User ${id}` };
  }
}

const service = new DataService();

service.fetchUser(1);
// "[CACHE] Miss for fetchUser([1])"
// "[DB] Fetching user 1"

service.fetchUser(1); // Within 5s
// "[CACHE] Hit for fetchUser([1])"

service.fetchUser(2);
// "[CACHE] Miss for fetchUser([2])"
// "[DB] Fetching user 2"
```

### Transaction Aspect

```typescript
import 'reflect-metadata';

const TRANSACTIONAL_KEY = Symbol('transactional');

class TransactionManager {
  private inTransaction = false;
  
  begin() {
    console.log('[TX] BEGIN');
    this.inTransaction = true;
  }
  
  commit() {
    console.log('[TX] COMMIT');
    this.inTransaction = false;
  }
  
  rollback() {
    console.log('[TX] ROLLBACK');
    this.inTransaction = false;
  }
  
  isActive() {
    return this.inTransaction;
  }
}

const txManager = new TransactionManager();

function Transactional(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const startedHere = !txManager.isActive();
    
    if (startedHere) {
      txManager.begin();
    }
    
    try {
      const result = Reflect.apply(original, this, args);
      
      if (startedHere) {
        txManager.commit();
      }
      
      return result;
    } catch (error) {
      if (startedHere) {
        txManager.rollback();
      }
      throw error;
    }
  };
  
  return descriptor;
}

class UserService {
  @Transactional
  create(name: string) {
    console.log('[DB] INSERT user:', name);
    if (name === 'error') throw new Error('Validation failed');
    return { id: 1, name };
  }
  
  @Transactional
  update(id: number, name: string) {
    console.log('[DB] UPDATE user:', id, name);
    return { id, name };
  }
}

const service = new UserService();

service.create('Alice');
// "[TX] BEGIN"
// "[DB] INSERT user: Alice"
// "[TX] COMMIT"

try {
  service.create('error');
} catch (e) {
  // "[TX] BEGIN"
  // "[DB] INSERT user: error"
  // "[TX] ROLLBACK"
}
```

### Authorization Aspect

```typescript
import 'reflect-metadata';

const ROLES_KEY = Symbol('roles');

function RequireRoles(...roles: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(ROLES_KEY, roles, target, propertyKey);
    
    const original = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const userRoles = (this as any).currentUserRoles || [];
      const requiredRoles = Reflect.getMetadata(ROLES_KEY, target, propertyKey);
      
      const hasRole = requiredRoles.some((role: string) => userRoles.includes(role));
      
      if (!hasRole) {
        throw new Error(`Unauthorized: requires roles ${requiredRoles.join(' or ')}`);
      }
      
      return Reflect.apply(original, this, args);
    };
    
    return descriptor;
  };
}

class AdminService {
  currentUserRoles: string[] = [];
  
  @RequireRoles('admin', 'superuser')
  deleteUser(id: number) {
    console.log(`Deleting user ${id}`);
    return true;
  }
  
  @RequireRoles('admin')
  resetPassword(id: number) {
    console.log(`Resetting password for user ${id}`);
    return true;
  }
}

const service = new AdminService();

// Sem roles
try {
  service.deleteUser(1);
} catch (e) {
  console.log(e.message); // "Unauthorized: requires roles admin or superuser"
}

// Com role adequada
service.currentUserRoles = ['admin'];
service.deleteUser(1); // "Deleting user 1"
service.resetPassword(1); // "Resetting password for user 1"
```

## 🎯 Method Signature Analysis

### Extract Complete Signature

```typescript
import 'reflect-metadata';

interface MethodSignature {
  name: string;
  paramNames: string[];
  paramTypes: any[];
  returnType: any;
  isAsync: boolean;
}

function getMethodSignature(target: any, methodName: string): MethodSignature {
  const method = target[methodName];
  
  // Parameter names (via Function.toString parsing)
  const funcStr = method.toString();
  const paramMatch = funcStr.match(/\(([^)]*)\)/);
  const paramNames = paramMatch
    ? paramMatch[1].split(',').map(p => p.trim().split(/[:\s]/)[0]).filter(Boolean)
    : [];
  
  // Parameter types (via metadata)
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, methodName) || [];
  
  // Return type (via metadata)
  const returnType = Reflect.getMetadata('design:returntype', target, methodName);
  
  // Async detection
  const isAsync = method.constructor.name === 'AsyncFunction';
  
  return {
    name: methodName,
    paramNames,
    paramTypes,
    returnType,
    isAsync
  };
}

class UserService {
  @Reflect.metadata('custom', 'value')
  create(name: string, age: number, email: string) {
    return { name, age, email };
  }
  
  @Reflect.metadata('custom', 'value')
  async fetchById(id: number): Promise<any> {
    return { id };
  }
}

const createSig = getMethodSignature(UserService.prototype, 'create');
console.log(createSig);
// {
//   name: 'create',
//   paramNames: ['name', 'age', 'email'],
//   paramTypes: [String, Number, String],
//   returnType: Object,
//   isAsync: false
// }

const fetchSig = getMethodSignature(UserService.prototype, 'fetchById');
console.log(fetchSig);
// {
//   name: 'fetchById',
//   paramNames: ['id'],
//   paramTypes: [Number],
//   returnType: Promise,
//   isAsync: true
// }
```

### Generate API Documentation

```typescript
import 'reflect-metadata';

const ROUTE_KEY = Symbol('route');
const DESC_KEY = Symbol('description');

function Route(method: string, path: string) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(ROUTE_KEY, { method, path }, target, propertyKey);
  };
}

function Description(text: string) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(DESC_KEY, text, target, propertyKey);
  };
}

class UserController {
  @Route('GET', '/users')
  @Description('Get all users')
  findAll(): User[] {
    return [];
  }
  
  @Route('POST', '/users')
  @Description('Create a new user')
  create(name: string, email: string): User {
    return new User();
  }
  
  @Route('DELETE', '/users/:id')
  @Description('Delete user by ID')
  delete(id: number): boolean {
    return true;
  }
}

class User {}

function generateAPIDocs(controller: any) {
  const proto = controller.prototype;
  const methods = Reflect.ownKeys(proto).filter(key => 
    key !== 'constructor' && typeof proto[key] === 'function'
  );
  
  const docs = [];
  
  for (const method of methods) {
    const route = Reflect.getMetadata(ROUTE_KEY, proto, method as string);
    const desc = Reflect.getMetadata(DESC_KEY, proto, method as string);
    const paramTypes = Reflect.getMetadata('design:paramtypes', proto, method as string) || [];
    const returnType = Reflect.getMetadata('design:returntype', proto, method as string);
    
    docs.push({
      endpoint: `${route.method} ${route.path}`,
      description: desc,
      handler: method,
      parameters: paramTypes.map((t: any) => t.name),
      returns: returnType?.name
    });
  }
  
  return docs;
}

const docs = generateAPIDocs(UserController);
console.log(JSON.stringify(docs, null, 2));
// [
//   {
//     "endpoint": "GET /users",
//     "description": "Get all users",
//     "handler": "findAll",
//     "parameters": [],
//     "returns": "Array"
//   },
//   {
//     "endpoint": "POST /users",
//     "description": "Create a new user",
//     "handler": "create",
//     "parameters": ["String", "String"],
//     "returns": "User"
//   },
//   {
//     "endpoint": "DELETE /users/:id",
//     "description": "Delete user by ID",
//     "handler": "delete",
//     "parameters": ["Number"],
//     "returns": "Boolean"
//   }
// ]
```

---

**Conclusão**: Manipulação de métodos via Reflect permite AOP, interceptação, metadata-driven behavior. Combinação de `design:paramtypes`, `design:returntype`, custom metadata, e method wrapping habilita logging, caching, transactions, authorization, validation, documentation generation.

## 📚 Próximo Arquivo

**06-manipulacao-propriedades.md** - Property descriptors, getters/setters, property metadata
