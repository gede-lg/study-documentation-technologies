# Method Decorators: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Method decorators** são funções que recebem **PropertyDescriptor** do método e podem modificar seu comportamento wrapping a função original. Conceitualmente, representam **higher-order functions** aplicadas a métodos de classe, permitindo interceptar chamadas, adicionar lógica pré/pós-execução, modificar argumentos ou retorno.

Na essência, method decorators implementam **Aspect-Oriented Programming (AOP)**, onde cross-cutting concerns (logging, caching, authorization, transaction management) são separados da lógica de negócio principal.

### Problema que Resolve

```typescript
// ❌ Sem decorator - lógica misturada
class UserService {
  getUser(id: number) {
    console.log(`[LOG] getUser called with id: ${id}`);
    const start = performance.now();
    
    try {
      // Verificar autorização
      if (!this.isAuthorized()) {
        throw new Error('Unauthorized');
      }
      
      // Lógica de negócio
      const user = this.database.findById(id);
      
      const duration = performance.now() - start;
      console.log(`[LOG] getUser completed in ${duration}ms`);
      return user;
    } catch (error) {
      console.error(`[LOG] getUser failed:`, error);
      throw error;
    }
  }
  
  // Repetir para cada método...
}

// ✅ Com decorator - separação de concerns
class UserService {
  @Log
  @Authorize
  @Measure
  getUser(id: number) {
    // Apenas lógica de negócio
    return this.database.findById(id);
  }
}
```

## 📋 Fundamentos

### Signature e PropertyDescriptor

```typescript
function MethodDecorator(
  target: any,                    // prototype da classe (ou constructor se static method)
  propertyKey: string | symbol,  // nome do método
  descriptor: PropertyDescriptor // descritor do método
): PropertyDescriptor | void {
  // descriptor structure:
  // {
  //   value: Function,         // método original
  //   writable: boolean,
  //   enumerable: boolean,
  //   configurable: boolean
  // }
  
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    // Nova implementação que pode:
    // 1. Executar lógica antes
    // 2. Chamar método original: originalMethod.apply(this, args)
    // 3. Executar lógica depois
    // 4. Modificar retorno
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}
```

**Componentes:**
- **target**: Prototype da classe (instance methods) ou constructor (static methods)
- **propertyKey**: Nome do método sendo decorado
- **descriptor**: PropertyDescriptor contendo `value` (função original), `writable`, `enumerable`, `configurable`
- **Return**: Novo descriptor (opcional) ou `void`

### Wrapping Pattern

```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`[${target.constructor.name}] ${propertyKey} called with:`, args);
    
    const result = originalMethod.apply(this, args);
    //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Preservar contexto 'this'
    
    console.log(`[${target.constructor.name}] ${propertyKey} returned:`, result);
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

const calc = new Calculator();
calc.add(2, 3);
// Output:
// [Calculator] add called with: [2, 3]
// [Calculator] add returned: 5
```

## 🔍 Análise Conceitual

### 1. Logging e Monitoring

```typescript
function Measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    
    try {
      const result = await originalMethod.apply(this, args);
      const duration = performance.now() - start;
      
      console.log(`${propertyKey} executed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${propertyKey} failed after ${duration.toFixed(2)}ms`);
      throw error;
    }
  };
  
  return descriptor;
}

class DataService {
  @Measure
  async fetchData(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [{ id: 1 }, { id: 2 }];
  }
}

const service = new DataService();
await service.fetchData();
// Output: fetchData executed in 101.23ms
```

### 2. Memoization/Caching

```typescript
function Memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(`[Cache HIT] ${propertyKey}(${key})`);
      return cache.get(key);
    }
    
    console.log(`[Cache MISS] ${propertyKey}(${key})`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class MathService {
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const math = new MathService();
console.log(math.fibonacci(10)); // Cache MISS várias vezes
console.log(math.fibonacci(10)); // Cache HIT
```

### 3. Retry Logic

```typescript
function Retry(attempts: number = 3, delay: number = 1000) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (attempt === attempts) {
            console.error(`${propertyKey} failed after ${attempts} attempts`);
            throw error;
          }
          
          console.warn(`${propertyKey} attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };
    
    return descriptor;
  };
}

class ApiService {
  @Retry(3, 500)
  async fetchUserData(id: number): Promise<any> {
    // Simulação de falha aleatória
    if (Math.random() > 0.3) {
      throw new Error('Network error');
    }
    return { id, name: 'Alice' };
  }
}

const api = new ApiService();
await api.fetchUserData(1);
// Pode tentar até 3 vezes antes de falhar
```

### 4. Timeout Handling

```typescript
function Timeout(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`${propertyKey} timed out after ${ms}ms`)), ms)
        )
      ]);
    };
    
    return descriptor;
  };
}

class SlowService {
  @Timeout(2000)
  async processData(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return 'Processed';
  }
}

const slowService = new SlowService();
try {
  await slowService.processData();
} catch (error) {
  console.error(error); // "processData timed out after 2000ms"
}
```

### 5. Authorization Check

```typescript
import 'reflect-metadata';

const rolesKey = Symbol('roles');

function RequireRole(...roles: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(rolesKey, roles, target, propertyKey);
    
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      // Assumindo que existe currentUser disponível
      const currentUser = (this as any).currentUser;
      
      if (!currentUser) {
        throw new Error('Authentication required');
      }
      
      const requiredRoles = Reflect.getMetadata(rolesKey, target, propertyKey);
      const hasRole = requiredRoles.some((role: string) => currentUser.roles.includes(role));
      
      if (!hasRole) {
        throw new Error(`Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class AdminService {
  currentUser = { name: 'Alice', roles: ['user'] };
  
  @RequireRole('admin')
  deleteUser(id: number): void {
    console.log(`User ${id} deleted`);
  }
  
  @RequireRole('user', 'admin')
  viewProfile(id: number): void {
    console.log(`Viewing profile ${id}`);
  }
}

const service = new AdminService();
service.viewProfile(1); // OK - tem role 'user'
// service.deleteUser(1); // Error - precisa role 'admin'
```

## 🎯 Aplicabilidade

### Transaction Management

```typescript
class TransactionManager {
  private inTransaction = false;
  
  beginTransaction() {
    this.inTransaction = true;
    console.log('[TX] Transaction started');
  }
  
  commit() {
    console.log('[TX] Transaction committed');
    this.inTransaction = false;
  }
  
  rollback() {
    console.log('[TX] Transaction rolled back');
    this.inTransaction = false;
  }
}

function Transactional(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const txManager = (this as any).txManager as TransactionManager;
    
    txManager.beginTransaction();
    
    try {
      const result = await originalMethod.apply(this, args);
      txManager.commit();
      return result;
    } catch (error) {
      txManager.rollback();
      throw error;
    }
  };
  
  return descriptor;
}

class UserRepository {
  txManager = new TransactionManager();
  
  @Transactional
  async createUser(name: string, email: string): Promise<void> {
    console.log(`Creating user: ${name}`);
    
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    // Salvar no banco
    console.log('User saved');
  }
}

const repo = new UserRepository();
await repo.createUser('Alice', 'alice@example.com');
// Output:
// [TX] Transaction started
// Creating user: Alice
// User saved
// [TX] Transaction committed

try {
  await repo.createUser('Bob', 'invalid');
} catch (error) {
  // [TX] Transaction started
  // Creating user: Bob
  // [TX] Transaction rolled back
}
```

### Validation

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

interface ValidationRule {
  paramIndex: number;
  validator: (value: any) => boolean;
  message: string;
}

function ValidateParams(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const rules: ValidationRule[] = Reflect.getMetadata(validationKey, target, propertyKey) || [];
    
    for (const rule of rules) {
      const value = args[rule.paramIndex];
      
      if (!rule.validator(value)) {
        throw new Error(`${propertyKey}: ${rule.message}`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

function IsPositive(target: any, propertyKey: string, parameterIndex: number) {
  const existingRules: ValidationRule[] = Reflect.getMetadata(validationKey, target, propertyKey) || [];
  
  existingRules.push({
    paramIndex: parameterIndex,
    validator: (value: any) => typeof value === 'number' && value > 0,
    message: `Parameter at index ${parameterIndex} must be positive`
  });
  
  Reflect.defineMetadata(validationKey, existingRules, target, propertyKey);
}

function IsString(target: any, propertyKey: string, parameterIndex: number) {
  const existingRules: ValidationRule[] = Reflect.getMetadata(validationKey, target, propertyKey) || [];
  
  existingRules.push({
    paramIndex: parameterIndex,
    validator: (value: any) => typeof value === 'string' && value.length > 0,
    message: `Parameter at index ${parameterIndex} must be non-empty string`
  });
  
  Reflect.defineMetadata(validationKey, existingRules, target, propertyKey);
}

class ProductService {
  @ValidateParams
  createProduct(@IsString name: string, @IsPositive price: number): void {
    console.log(`Creating product: ${name} at $${price}`);
  }
}

const productService = new ProductService();
productService.createProduct('Laptop', 1500); // OK
// productService.createProduct('', 1500); // Error: Parameter at index 0 must be non-empty string
// productService.createProduct('Phone', -10); // Error: Parameter at index 1 must be positive
```

### Deprecation Warning

```typescript
function Deprecated(message?: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.warn(`⚠️ ${target.constructor.name}.${propertyKey} is deprecated.`, message || '');
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class LegacyService {
  @Deprecated('Use getUserById instead')
  getUser(id: number): any {
    return { id, name: 'Alice' };
  }
  
  getUserById(id: number): any {
    return { id, name: 'Alice' };
  }
}

const legacy = new LegacyService();
legacy.getUser(1);
// Output: ⚠️ LegacyService.getUser is deprecated. Use getUserById instead
```

### Debounce/Throttle

```typescript
function Debounce(delay: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeoutId: NodeJS.Timeout;
    
    descriptor.value = function(...args: any[]) {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };
    
    return descriptor;
  };
}

function Throttle(delay: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let lastCall = 0;
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      
      if (now - lastCall >= delay) {
        lastCall = now;
        return originalMethod.apply(this, args);
      }
      
      console.log(`${propertyKey} throttled`);
    };
    
    return descriptor;
  };
}

class SearchService {
  @Debounce(300)
  search(query: string): void {
    console.log(`Searching for: ${query}`);
  }
  
  @Throttle(1000)
  trackEvent(event: string): void {
    console.log(`Tracking: ${event}`);
  }
}
```

## ⚠️ Limitações

### 1. Arrow Functions

```typescript
class Example {
  // ❌ Decorator não funciona com arrow functions
  @Log
  method = () => {
    return 'hello';
  };
  // Arrow function é property, não method
}
```

### 2. Type Information Lost

```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    //                         ^^^ Type lost
    return originalMethod.apply(this, args);
  };
}

class Example {
  @Log
  greet(name: string): string {
    return `Hello, ${name}`;
  }
}

// TypeScript não verifica tipos em runtime
```

### 3. Performance Overhead

```typescript
// Cada decorator adiciona call stack
@Decorator1
@Decorator2
@Decorator3
method() {
  // Original method está 3 níveis abaixo
}

// Impacto em hot paths
```

### 4. Cannot Decorate Getters/Setters Separately

```typescript
class Example {
  private _value: number = 0;
  
  // ❌ Precisa decorar getter E setter
  @Log
  get value(): number {
    return this._value;
  }
  
  @Log
  set value(val: number) {
    this._value = val;
  }
}
```

## 🔗 Interconexões

### Composição de Decorators

```typescript
function First(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('First decorator evaluated');
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log('First decorator executed');
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

function Second(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('Second decorator evaluated');
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log('Second decorator executed');
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class Example {
  @First
  @Second
  method() {
    console.log('Original method');
  }
}

// Output ao definir classe:
// Second decorator evaluated
// First decorator evaluated

// Output ao chamar método:
new Example().method();
// First decorator executed
// Second decorator executed
// Original method
```

### Com Class Decorators

```typescript
function LogClass<T extends { new(...args: any[]): {} }>(constructor: T) {
  console.log(`Class ${constructor.name} loaded`);
  return constructor;
}

function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log(`Method ${propertyKey} defined`);
  return descriptor;
}

@LogClass
class Service {
  @LogMethod
  doWork() {
    console.log('Working...');
  }
}

// Output:
// Method doWork defined
// Class Service loaded
```

## 🚀 Evolução e Padrões Modernos

### Pipeline Pattern

```typescript
function Pipeline(...steps: Array<(input: any) => any>) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      let result = originalMethod.apply(this, args);
      
      for (const step of steps) {
        result = step(result);
      }
      
      return result;
    };
    
    return descriptor;
  };
}

class DataProcessor {
  @Pipeline(
    (data: any) => data.trim(),
    (data: any) => data.toLowerCase(),
    (data: any) => data.replace(/\s+/g, '-')
  )
  processTitle(title: string): string {
    return title;
  }
}

const processor = new DataProcessor();
console.log(processor.processTitle('  Hello World  '));
// Output: "hello-world"
```

### Conditional Execution

```typescript
function OnlyInDevelopment(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    if (process.env.NODE_ENV !== 'development') {
      console.warn(`${propertyKey} only runs in development mode`);
      return;
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class DebugService {
  @OnlyInDevelopment
  debugLog(message: string): void {
    console.log('[DEBUG]', message);
  }
}
```

---

**Conclusão**: Method decorators permitem interceptar e modificar comportamento de métodos, implementando patterns como AOP, caching, retry logic, authorization, transaction management de forma declarativa e reutilizável.
