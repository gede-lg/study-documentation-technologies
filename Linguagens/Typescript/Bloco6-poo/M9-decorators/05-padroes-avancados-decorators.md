# Padrões Avançados com Decorators: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Padrões avançados** com decorators combinam múltiplos conceitos: **composition de decorators**, **metadata-driven architecture**, **higher-order decorators**, **integração com generics**, **dependency injection**, **aspect-oriented programming em escala**. Representam aplicação sofisticada de decorators para construir frameworks completos.

Conceitualmente, decorators avançados materializam **separation of concerns em nível arquitetural**, onde funcionalidades transversais (autenticação, logging, caching, validação, transações) são completamente separadas da lógica de negócio via declarative programming.

### Problema que Resolve

```typescript
// ❌ Sem padrões avançados - lógica espalhada
class UserController {
  async createUser(req: any, res: any) {
    // 1. Validar request
    if (!req.body.email || !req.body.email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    
    // 2. Verificar autorização
    if (!req.user || !req.user.roles.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // 3. Logging
    console.log(`[${new Date().toISOString()}] createUser called by ${req.user.id}`);
    
    // 4. Transaction
    const transaction = await db.beginTransaction();
    
    try {
      // 5. Lógica de negócio misturada com infraestrutura
      const user = await this.userService.create(req.body, transaction);
      
      await transaction.commit();
      
      // 6. Cache invalidation
      await cache.delete('users:all');
      
      // 7. Response
      return res.status(201).json(user);
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// ✅ Com padrões avançados - separação completa
class UserController {
  @Post('/users')
  @RequireRole('admin')
  @ValidateBody(CreateUserDto)
  @Transactional
  @CacheInvalidate('users:*')
  @Log
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    // Apenas lógica de negócio
    return this.userService.create(dto);
  }
}
```

## 📋 Fundamentos

### Decorator Composition Pattern

```typescript
// Múltiplos decorators aplicados em ordem específica
function First(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('First evaluated');
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log('[First] Before');
    const result = original.apply(this, args);
    console.log('[First] After');
    return result;
  };
  
  return descriptor;
}

function Second(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('Second evaluated');
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log('[Second] Before');
    const result = original.apply(this, args);
    console.log('[Second] After');
    return result;
  };
  
  return descriptor;
}

class Example {
  @First
  @Second
  method() {
    console.log('[Method] Executing');
  }
}

// Evaluation order: Second → First (bottom to top)
// Execution order: First → Second → Method → Second → First (wrapping)

new Example().method();
// Output:
// Second evaluated
// First evaluated
// [First] Before
// [Second] Before
// [Method] Executing
// [Second] After
// [First] After
```

### Higher-Order Decorator Factory

```typescript
// Decorator que retorna decorator configurável
function Retry(options: { attempts?: number; delay?: number; exponential?: boolean } = {}) {
  const { attempts = 3, delay = 1000, exponential = false } = options;
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (attempt === attempts) throw error;
          
          const waitTime = exponential ? delay * Math.pow(2, attempt - 1) : delay;
          console.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    };
    
    return descriptor;
  };
}

class ApiService {
  @Retry({ attempts: 5, delay: 500, exponential: true })
  async fetchData(): Promise<any> {
    // Pode falhar, será retentado com backoff exponencial
    return fetch('https://api.example.com/data').then(r => r.json());
  }
}
```

## 🔍 Análise Conceitual

### 1. Metadata-Driven Validation System

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

interface ValidationRule {
  property: string;
  constraints: Array<{
    type: string;
    value?: any;
    message?: string;
  }>;
}

// Property decorators
function IsEmail(target: any, propertyKey: string) {
  addValidationRule(target, propertyKey, {
    type: 'isEmail',
    message: `${propertyKey} must be a valid email`
  });
}

function MinLength(length: number, message?: string) {
  return function(target: any, propertyKey: string) {
    addValidationRule(target, propertyKey, {
      type: 'minLength',
      value: length,
      message: message || `${propertyKey} must be at least ${length} characters`
    });
  };
}

function IsPositive(target: any, propertyKey: string) {
  addValidationRule(target, propertyKey, {
    type: 'isPositive',
    message: `${propertyKey} must be positive`
  });
}

function addValidationRule(target: any, property: string, constraint: any) {
  const rules: ValidationRule[] = Reflect.getMetadata(validationKey, target) || [];
  
  const existing = rules.find(r => r.property === property);
  if (existing) {
    existing.constraints.push(constraint);
  } else {
    rules.push({ property, constraints: [constraint] });
  }
  
  Reflect.defineMetadata(validationKey, rules, target);
}

// Class decorator que adiciona método validate
function Validatable<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    validate(): { valid: boolean; errors: string[] } {
      const errors: string[] = [];
      const rules: ValidationRule[] = 
        Reflect.getMetadata(validationKey, Object.getPrototypeOf(this)) || [];
      
      for (const { property, constraints } of rules) {
        const value = (this as any)[property];
        
        for (const constraint of constraints) {
          let isValid = true;
          
          switch (constraint.type) {
            case 'isEmail':
              isValid = typeof value === 'string' && value.includes('@');
              break;
            case 'minLength':
              isValid = typeof value === 'string' && value.length >= constraint.value;
              break;
            case 'isPositive':
              isValid = typeof value === 'number' && value > 0;
              break;
          }
          
          if (!isValid) {
            errors.push(constraint.message || `Validation failed for ${property}`);
          }
        }
      }
      
      return { valid: errors.length === 0, errors };
    }
  };
}

@Validatable
class CreateUserDto {
  @IsEmail
  email: string;
  
  @MinLength(3, 'Username too short')
  username: string;
  
  @IsPositive
  age: number;
  
  constructor(email: string, username: string, age: number) {
    this.email = email;
    this.username = username;
    this.age = age;
  }
}

const dto1 = new CreateUserDto('invalid', 'ab', -5);
console.log((dto1 as any).validate());
// {
//   valid: false,
//   errors: [
//     'email must be a valid email',
//     'Username too short',
//     'age must be positive'
//   ]
// }

const dto2 = new CreateUserDto('alice@example.com', 'alice', 25);
console.log((dto2 as any).validate());
// { valid: true, errors: [] }
```

### 2. Dependency Injection Container

```typescript
import 'reflect-metadata';

const injectableKey = Symbol('injectable');
const injectKey = Symbol('inject');

// Class decorator - marca classe como injectable
function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(injectableKey, true, constructor);
    return constructor;
  };
}

// Parameter decorator - marca parâmetro para injeção
function Inject(token: any) {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingInjections = Reflect.getMetadata(injectKey, target) || [];
    existingInjections.push({ index: parameterIndex, token });
    Reflect.defineMetadata(injectKey, existingInjections, target);
  };
}

// Container
class Container {
  private services = new Map<any, any>();
  private singletons = new Map<any, any>();
  
  register<T>(token: new (...args: any[]) => T, singleton: boolean = true): void {
    if (!Reflect.getMetadata(injectableKey, token)) {
      throw new Error(`${token.name} must be decorated with @Injectable()`);
    }
    
    if (singleton) {
      this.singletons.set(token, null); // Marca como singleton
    }
    
    this.services.set(token, token);
  }
  
  resolve<T>(token: new (...args: any[]) => T): T {
    // Check singleton cache
    if (this.singletons.has(token) && this.singletons.get(token) !== null) {
      return this.singletons.get(token);
    }
    
    const targetClass = this.services.get(token);
    if (!targetClass) {
      throw new Error(`No provider found for ${token.name}`);
    }
    
    // Resolver dependencies
    const injections: Array<{ index: number; token: any }> = 
      Reflect.getMetadata(injectKey, targetClass) || [];
    
    const args: any[] = [];
    for (const injection of injections) {
      args[injection.index] = this.resolve(injection.token);
    }
    
    const instance = new targetClass(...args);
    
    // Cache singleton
    if (this.singletons.has(token)) {
      this.singletons.set(token, instance);
    }
    
    return instance;
  }
}

// Usage
@Injectable()
class Database {
  query(sql: string) {
    console.log('Executing:', sql);
    return [];
  }
}

@Injectable()
class Logger {
  log(message: string) {
    console.log('[LOG]', message);
  }
}

@Injectable()
class UserRepository {
  constructor(
    @Inject(Database) private db: Database,
    @Inject(Logger) private logger: Logger
  ) {}
  
  findAll() {
    this.logger.log('Finding all users');
    return this.db.query('SELECT * FROM users');
  }
}

@Injectable()
class UserService {
  constructor(
    @Inject(UserRepository) private repo: UserRepository,
    @Inject(Logger) private logger: Logger
  ) {}
  
  getUsers() {
    this.logger.log('UserService.getUsers called');
    return this.repo.findAll();
  }
}

const container = new Container();
container.register(Database);
container.register(Logger);
container.register(UserRepository);
container.register(UserService);

const userService = container.resolve(UserService);
userService.getUsers();
// Output:
// [LOG] UserService.getUsers called
// [LOG] Finding all users
// Executing: SELECT * FROM users
```

### 3. Route Handler Pattern (Express-like)

```typescript
import 'reflect-metadata';

const routesKey = Symbol('routes');

interface RouteMetadata {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  propertyKey: string;
}

function Get(path: string) {
  return createRouteDecorator('GET', path);
}

function Post(path: string) {
  return createRouteDecorator('POST', path);
}

function Put(path: string) {
  return createRouteDecorator('PUT', path);
}

function Delete(path: string) {
  return createRouteDecorator('DELETE', path);
}

function createRouteDecorator(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const routes: RouteMetadata[] = Reflect.getMetadata(routesKey, target.constructor) || [];
    
    routes.push({ method, path, propertyKey });
    
    Reflect.defineMetadata(routesKey, routes, target.constructor);
    
    return descriptor;
  };
}

// Controller decorator
function Controller(basePath: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    const routes: RouteMetadata[] = Reflect.getMetadata(routesKey, constructor) || [];
    
    console.log(`Registering controller: ${constructor.name}`);
    for (const route of routes) {
      const fullPath = basePath + route.path;
      console.log(`  ${route.method} ${fullPath} -> ${route.propertyKey}`);
    }
    
    return constructor;
  };
}

// Middleware decorators
function UseGuard(guard: any) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const allowed = await guard.canActivate(args[0]); // args[0] = context/request
      
      if (!allowed) {
        throw new Error('Forbidden');
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

@Controller('/users')
class UserController {
  @Get('/')
  findAll() {
    return [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
  }
  
  @Get('/:id')
  findOne(id: number) {
    return { id, name: 'Alice' };
  }
  
  @Post('/')
  @UseGuard({ canActivate: async () => true })
  create(data: any) {
    return { id: 3, ...data };
  }
  
  @Delete('/:id')
  @UseGuard({ canActivate: async () => true })
  delete(id: number) {
    return { success: true };
  }
}

// Output:
// Registering controller: UserController
//   GET /users/ -> findAll
//   GET /users/:id -> findOne
//   POST /users/ -> create
//   DELETE /users/:id -> delete
```

### 4. AOP Logging System

```typescript
import 'reflect-metadata';

const logKey = Symbol('log');

interface LogConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  includeArgs?: boolean;
  includeResult?: boolean;
  includeDuration?: boolean;
}

function Log(config: LogConfig = { level: 'info' }) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(logKey, config, target, propertyKey);
    
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const start = performance.now();
      const className = target.constructor.name;
      
      // Log entrada
      let message = `[${config.level.toUpperCase()}] ${className}.${propertyKey}`;
      
      if (config.includeArgs) {
        message += ` | Args: ${JSON.stringify(args)}`;
      }
      
      console.log(message);
      
      try {
        const result = await originalMethod.apply(this, args);
        
        // Log sucesso
        const duration = performance.now() - start;
        let successMessage = `[${config.level.toUpperCase()}] ${className}.${propertyKey} succeeded`;
        
        if (config.includeDuration) {
          successMessage += ` | Duration: ${duration.toFixed(2)}ms`;
        }
        
        if (config.includeResult) {
          successMessage += ` | Result: ${JSON.stringify(result)}`;
        }
        
        console.log(successMessage);
        
        return result;
      } catch (error) {
        // Log erro
        const duration = performance.now() - start;
        console.error(
          `[ERROR] ${className}.${propertyKey} failed after ${duration.toFixed(2)}ms`,
          error
        );
        throw error;
      }
    };
    
    return descriptor;
  };
}

class PaymentService {
  @Log({ level: 'info', includeArgs: true, includeResult: true, includeDuration: true })
  async processPayment(amount: number, currency: string): Promise<{ transactionId: string }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { transactionId: 'txn_123456' };
  }
  
  @Log({ level: 'warn', includeDuration: true })
  async refund(transactionId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

const paymentService = new PaymentService();
await paymentService.processPayment(99.99, 'USD');
// Output:
// [INFO] PaymentService.processPayment | Args: [99.99,"USD"]
// [INFO] PaymentService.processPayment succeeded | Duration: 101.23ms | Result: {"transactionId":"txn_123456"}

await paymentService.refund('txn_123456');
// Output:
// [WARN] PaymentService.refund
// [WARN] PaymentService.refund succeeded | Duration: 51.45ms
```

### 5. Cache Layer Pattern

```typescript
interface CacheOptions {
  ttl?: number; // milliseconds
  key?: (args: any[]) => string;
}

function Cacheable(options: CacheOptions = {}) {
  const cache = new Map<string, { value: any; expiry: number }>();
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const cacheKey = options.key 
        ? options.key(args) 
        : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;
      
      // Check cache
      const cached = cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        console.log(`[Cache HIT] ${cacheKey}`);
        return cached.value;
      }
      
      console.log(`[Cache MISS] ${cacheKey}`);
      
      // Execute method
      const result = await originalMethod.apply(this, args);
      
      // Store in cache
      const ttl = options.ttl || 60000; // default 1 minute
      cache.set(cacheKey, {
        value: result,
        expiry: Date.now() + ttl
      });
      
      return result;
    };
    
    return descriptor;
  };
}

function CacheInvalidate(pattern: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const result = await originalMethod.apply(this, args);
      
      // Invalidate matching cache entries
      // (simplified - real implementation would need shared cache reference)
      console.log(`[Cache] Invalidating pattern: ${pattern}`);
      
      return result;
    };
    
    return descriptor;
  };
}

class UserService {
  @Cacheable({ ttl: 30000, key: (args) => `user:${args[0]}` })
  async getUser(id: number): Promise<any> {
    console.log(`Fetching user ${id} from database...`);
    await new Promise(resolve => setTimeout(resolve, 100));
    return { id, name: 'Alice', email: 'alice@example.com' };
  }
  
  @CacheInvalidate('user:*')
  async updateUser(id: number, data: any): Promise<void> {
    console.log(`Updating user ${id}...`);
  }
}

const userService = new UserService();

await userService.getUser(1); // Cache MISS - fetches from DB
await userService.getUser(1); // Cache HIT - returns from cache
await userService.updateUser(1, { name: 'Alice Updated' }); // Invalidates cache
await userService.getUser(1); // Cache MISS - fetches fresh data
```

## 🎯 Aplicabilidade

### Complete Framework Pattern (NestJS-like)

```typescript
import 'reflect-metadata';

// === Decorators ===
const controllerKey = Symbol('controller');
const routesKey = Symbol('routes');
const paramsKey = Symbol('params');

function Controller(prefix: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    Reflect.defineMetadata(controllerKey, { prefix }, constructor);
    return constructor;
  };
}

function Get(path: string = '') {
  return createRouteDecorator('GET', path);
}

function Post(path: string = '') {
  return createRouteDecorator('POST', path);
}

function createRouteDecorator(method: string, path: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const routes = Reflect.getMetadata(routesKey, target.constructor) || [];
    routes.push({ method, path, handler: propertyKey });
    Reflect.defineMetadata(routesKey, routes, target.constructor);
    return descriptor;
  };
}

function Body() {
  return createParameterDecorator('body');
}

function Param(name: string) {
  return createParameterDecorator('param', name);
}

function Query(name: string) {
  return createParameterDecorator('query', name);
}

function createParameterDecorator(type: string, name?: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getMetadata(paramsKey, target, propertyKey) || [];
    params.push({ index: parameterIndex, type, name });
    Reflect.defineMetadata(paramsKey, params, target, propertyKey);
  };
}

// === Application ===
class App {
  private controllers: any[] = [];
  
  registerController(controller: any): void {
    this.controllers.push(controller);
  }
  
  start(): void {
    console.log('Application started\n');
    
    for (const controller of this.controllers) {
      const controllerMeta = Reflect.getMetadata(controllerKey, controller.constructor);
      const routes = Reflect.getMetadata(routesKey, controller.constructor) || [];
      
      console.log(`Controller: ${controller.constructor.name}`);
      console.log(`Prefix: ${controllerMeta.prefix}`);
      console.log('Routes:');
      
      for (const route of routes) {
        const fullPath = controllerMeta.prefix + route.path;
        console.log(`  ${route.method} ${fullPath} -> ${route.handler}()`);
      }
      
      console.log('');
    }
  }
  
  // Simulate request handling
  async handleRequest(method: string, path: string, context: any): Promise<any> {
    for (const controller of this.controllers) {
      const controllerMeta = Reflect.getMetadata(controllerKey, controller.constructor);
      const routes = Reflect.getMetadata(routesKey, controller.constructor) || [];
      
      for (const route of routes) {
        const fullPath = controllerMeta.prefix + route.path;
        
        if (route.method === method && this.matchPath(fullPath, path)) {
          const params = Reflect.getMetadata(paramsKey, Object.getPrototypeOf(controller), route.handler) || [];
          const args: any[] = [];
          
          for (const param of params) {
            if (param.type === 'body') {
              args[param.index] = context.body;
            } else if (param.type === 'param') {
              args[param.index] = context.params[param.name];
            } else if (param.type === 'query') {
              args[param.index] = context.query[param.name];
            }
          }
          
          return await controller[route.handler](...args);
        }
      }
    }
    
    throw new Error('Route not found');
  }
  
  private matchPath(pattern: string, path: string): boolean {
    return pattern === path; // Simplified
  }
}

// === Controllers ===
@Controller('/users')
class UserController {
  @Get('/')
  findAll(@Query('page') page: string): any {
    return { users: ['Alice', 'Bob'], page };
  }
  
  @Get('/:id')
  findOne(@Param('id') id: string): any {
    return { id, name: 'Alice' };
  }
  
  @Post('/')
  create(@Body() data: any): any {
    return { id: 3, ...data };
  }
}

@Controller('/products')
class ProductController {
  @Get('/')
  findAll(): any {
    return { products: ['Laptop', 'Phone'] };
  }
}

// === Bootstrap ===
const app = new App();
app.registerController(new UserController());
app.registerController(new ProductController());
app.start();

// Simulate requests
console.log('--- Simulating Requests ---\n');

app.handleRequest('GET', '/users/', { query: { page: '2' } }).then(result => {
  console.log('GET /users/?page=2');
  console.log('Response:', result);
  console.log('');
});

app.handleRequest('GET', '/users/:id', { params: { id: '123' } }).then(result => {
  console.log('GET /users/123');
  console.log('Response:', result);
  console.log('');
});

app.handleRequest('POST', '/users/', { body: { name: 'Charlie', email: 'charlie@example.com' } }).then(result => {
  console.log('POST /users/');
  console.log('Response:', result);
  console.log('');
});
```

## ⚠️ Limitações

### 1. Complexity and Learning Curve

```typescript
// Padrões avançados podem ser difíceis de entender
@Controller('/api')
@UseInterceptor(LoggingInterceptor)
@UseGuard(AuthGuard)
class ComplexController {
  @Get('/')
  @Cacheable({ ttl: 60000 })
  @Transform(ResponseDto)
  @ValidateQuery(QueryDto)
  @RateLimit({ max: 100, windowMs: 60000 })
  @Roles('admin', 'moderator')
  async complexMethod(@Query() query: any): Promise<any> {
    // Difícil rastrear fluxo de execução
  }
}
```

### 2. Performance Overhead

```typescript
// Cada decorator adiciona layer
// Múltiplos decorators = múltiplos wrappers = call stack profundo
```

### 3. Debugging Difficulty

```typescript
// Stack traces ficam complexos
// Error:
//   at descriptor.value (decorator5.ts:45)
//   at descriptor.value (decorator4.ts:32)
//   at descriptor.value (decorator3.ts:18)
//   at descriptor.value (decorator2.ts:67)
//   at descriptor.value (decorator1.ts:23)
//   at ComplexController.method (controller.ts:89)
```

## 🔗 Interconexões

### Com Generics

```typescript
function Repository<Entity>(entityClass: new () => Entity) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      entityType = entityClass;
      
      findAll(): Entity[] {
        console.log(`Finding all ${entityClass.name}`);
        return [];
      }
      
      findById(id: number): Entity | null {
        console.log(`Finding ${entityClass.name} by id: ${id}`);
        return null;
      }
    };
  };
}

class User {
  id: number;
  name: string;
}

@Repository(User)
class UserRepository {}

const repo = new UserRepository() as any;
console.log(repo.entityType); // [class User]
repo.findAll(); // "Finding all User"
```

### Com Mixins

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();
  };
}

function Tracked<T extends Constructor>(Base: T) {
  return class extends Base {
    id = Math.random();
  };
}

// Compor mixins via decorators
function ApplyMixins(...mixins: Array<(base: any) => any>) {
  return function<T extends Constructor>(constructor: T) {
    return mixins.reduce((acc, mixin) => mixin(acc), constructor);
  };
}

@ApplyMixins(Timestamped, Tracked)
class User {
  name: string;
}

const user = new User() as any;
console.log(user.createdAt); // Date
console.log(user.id); // number
```

## 🚀 Evolução e Padrões Modernos

### Stage 3 Decorators (ECMAScript 2024)

```typescript
// Nova sintaxe Stage 3 (TypeScript 5.0+)
function logged(value: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  
  return function(this: any, ...args: any[]) {
    console.log(`Calling ${methodName}`);
    const result = value.call(this, ...args);
    console.log(`${methodName} returned:`, result);
    return result;
  };
}

class Example {
  @logged
  greet(name: string) {
    return `Hello, ${name}`;
  }
}

// context object fornece:
// - context.kind: "method" | "class" | "accessor" | ...
// - context.name: nome do elemento
// - context.addInitializer(): hook de inicialização
// - context.metadata: shared metadata object
```

### Accessor Decorators (Stage 3)

```typescript
function logged(value: ClassAccessorDecoratorTarget<any, any>, context: ClassAccessorDecoratorContext) {
  return {
    get(this: any) {
      console.log(`Getting ${String(context.name)}`);
      return value.get.call(this);
    },
    set(this: any, val: any) {
      console.log(`Setting ${String(context.name)} to ${val}`);
      return value.set.call(this, val);
    }
  };
}

class Example {
  @logged
  accessor value = 0;
  // Gera getter e setter automaticamente
}

const example = new Example();
example.value = 42; // "Setting value to 42"
console.log(example.value); // "Getting value" → 42
```

---

**Conclusão**: Padrões avançados com decorators permitem construir frameworks completos com metadata-driven architecture, dependency injection, routing, validation, caching, AOP logging, separando completamente cross-cutting concerns da lógica de negócio.
