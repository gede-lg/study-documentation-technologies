# Reflect e Decorators

## 🎯 Introdução

**Reflect** e **Decorators** trabalham juntos para criar **metadata systems poderosos**. Decorators **aplicam transformações**, Reflect **armazena e consulta metadata**. Essa combinação é **fundamental** para frameworks como NestJS, TypeORM, class-validator.

## 📋 Sumário

### Fundamentos
- Por que usar Reflect com Decorators
- Design-time Type Metadata
- emitDecoratorMetadata
- Metadata Keys

### Padrões Básicos
- Armazenar metadata em decorators
- Ler metadata em runtime
- Class decorators + Reflect
- Method decorators + Reflect
- Property decorators + Reflect
- Parameter decorators + Reflect

### Padrões Avançados
- Dependency Injection
- Validation Framework
- ORM Entity Mapping
- HTTP Route Registration
- AOP (Aspect-Oriented Programming)

### Composição
- Combinar múltiplos decorators
- Decorator factories com metadata
- Metadata inheritance
- Metadata overriding

### Real-world Examples
- NestJS patterns
- TypeORM patterns
- class-validator patterns
- Custom framework

## 🔗 Por que usar Reflect com Decorators

### Problema: Decorators sozinhos têm limitações

```typescript
// ❌ Decorator sem metadata - informação perdida
function LogClass(target: any) {
  console.log(`Class registered: ${target.name}`);
  // Informação não persiste após execução
}

@LogClass
class User {
  name: string;
}

// Como saber quais classes foram decoradas? 🤔
// Como acessar essa informação depois? 🤔
```

### Solução: Reflect persiste metadata

```typescript
import 'reflect-metadata';

const REGISTERED_KEY = Symbol('registered');

// ✅ Decorator COM metadata - informação persistida
function LogClass(target: any) {
  Reflect.defineMetadata(REGISTERED_KEY, true, target);
  console.log(`Class registered: ${target.name}`);
}

@LogClass
class User {
  name: string;
}

// ✅ Acessar metadata depois
const isRegistered = Reflect.getMetadata(REGISTERED_KEY, User);
console.log(isRegistered); // true
```

### Benefícios

1. **Persistência**: Metadata sobrevive após decorator executar
2. **Consulta**: Acessar informações em qualquer momento
3. **Composição**: Múltiplos decorators adicionam metadata incrementalmente
4. **Introspection**: Descobrir capabilities de classes em runtime
5. **Framework Building**: Base para DI, ORM, validation, routing

## 📚 Design-time Type Metadata

### emitDecoratorMetadata

Quando `emitDecoratorMetadata: true` no `tsconfig.json`, TypeScript **automaticamente** emite metadata de tipos para elementos **decorados**.

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true // ← Habilita type metadata
  }
}
```

### Três tipos de metadata automática

```typescript
import 'reflect-metadata';

function Log(target: any, propertyKey: string) {
  // TypeScript adiciona automaticamente:
  
  // 1. design:type - Tipo da propriedade/retorno
  const type = Reflect.getMetadata('design:type', target, propertyKey);
  
  // 2. design:paramtypes - Tipos dos parâmetros
  const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  
  // 3. design:returntype - Tipo de retorno
  const returnType = Reflect.getMetadata('design:returntype', target, propertyKey);
  
  console.log({ type, paramTypes, returnType });
}

class User {
  @Log
  id: number; // design:type = Number
  
  @Log
  greet(name: string): string { // design:paramtypes = [String], design:returntype = String
    return `Hello ${name}`;
  }
}

// Output:
// { type: [Function: Number], paramTypes: undefined, returnType: undefined }
// { type: [Function: Function], paramTypes: [Function: String], returnType: [Function: String] }
```

### Importante: Apenas elementos decorados

```typescript
class Product {
  // ❌ SEM decorator = SEM metadata
  id: number;
  
  // ✅ COM decorator = COM metadata
  @Log
  name: string;
}

Reflect.getMetadata('design:type', Product.prototype, 'id'); // undefined
Reflect.getMetadata('design:type', Product.prototype, 'name'); // String
```

### Workaround: Decorator vazio

```typescript
// Decorator que não faz nada, só ativa metadata emission
function Metadata() {
  return function(target: any, propertyKey: string) {
    // Vazio intencionalmente
  };
}

class Product {
  @Metadata()
  id: number; // Agora tem metadata!
  
  @Metadata()
  name: string;
}
```

## 🔑 Metadata Keys

### Usar Symbols (recomendado)

```typescript
// ✅ PREFERIR - Symbols são únicos, evitam colisões
const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const VALIDATION_KEY = Symbol('validation');

Reflect.defineMetadata(ENTITY_KEY, { table: 'users' }, User);
Reflect.defineMetadata(COLUMN_KEY, { type: 'varchar' }, User.prototype, 'name');
```

### Strings também funcionam

```typescript
// ⚠️ OK mas cuidado com colisões
Reflect.defineMetadata('entity', { table: 'users' }, User);
Reflect.defineMetadata('column', { type: 'varchar' }, User.prototype, 'name');
```

### Centralizar keys

```typescript
// ✅ MELHOR - centralizar em arquivo
// metadata-keys.ts
export const MetadataKeys = {
  ENTITY: Symbol('entity'),
  COLUMN: Symbol('column'),
  VALIDATION: Symbol('validation'),
  ROUTE: Symbol('route'),
  INJECTABLE: Symbol('injectable')
} as const;

// Usar em decorators
import { MetadataKeys } from './metadata-keys';

Reflect.defineMetadata(MetadataKeys.ENTITY, data, target);
```

## 🎨 Padrões Básicos

### Class Decorator + Reflect

```typescript
import 'reflect-metadata';

// Metadata key
const ENTITY_KEY = Symbol('entity');

// Interface para metadata
interface EntityMetadata {
  tableName: string;
  schema?: string;
}

// Class decorator
function Entity(tableName: string, schema?: string): ClassDecorator {
  return function(target: any) {
    const metadata: EntityMetadata = { tableName, schema };
    Reflect.defineMetadata(ENTITY_KEY, metadata, target);
  };
}

// Helper para ler metadata
function getEntityMetadata(target: any): EntityMetadata | undefined {
  return Reflect.getMetadata(ENTITY_KEY, target);
}

// Uso
@Entity('users', 'public')
class User {
  id: number;
  name: string;
}

// Ler metadata
const entityMeta = getEntityMetadata(User);
console.log(entityMeta);
// { tableName: 'users', schema: 'public' }
```

### Property Decorator + Reflect

```typescript
import 'reflect-metadata';

const COLUMN_KEY = Symbol('column');

interface ColumnMetadata {
  name?: string;
  type: string;
  nullable?: boolean;
}

function Column(options: Partial<ColumnMetadata> = {}): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    // Obter tipo automaticamente
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    
    const metadata: ColumnMetadata = {
      name: options.name || String(propertyKey),
      type: options.type || type?.name.toLowerCase() || 'unknown',
      nullable: options.nullable ?? true
    };
    
    Reflect.defineMetadata(COLUMN_KEY, metadata, target, propertyKey);
  };
}

// Helper para ler metadata de propriedade
function getColumnMetadata(target: any, propertyKey: string): ColumnMetadata | undefined {
  return Reflect.getMetadata(COLUMN_KEY, target, propertyKey);
}

// Uso
class User {
  @Column()
  id: number;
  
  @Column({ nullable: false })
  name: string;
  
  @Column({ type: 'varchar', nullable: true })
  email: string;
}

// Ler metadata
const idMeta = getColumnMetadata(User.prototype, 'id');
console.log(idMeta);
// { name: 'id', type: 'number', nullable: true }

const nameMeta = getColumnMetadata(User.prototype, 'name');
console.log(nameMeta);
// { name: 'name', type: 'string', nullable: false }
```

### Method Decorator + Reflect

```typescript
import 'reflect-metadata';

const ROUTE_KEY = Symbol('route');

interface RouteMetadata {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
}

function Route(method: RouteMetadata['method'], path: string): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const metadata: RouteMetadata = { method, path };
    Reflect.defineMetadata(ROUTE_KEY, metadata, target, propertyKey);
  };
}

// Shorthand decorators
function Get(path: string): MethodDecorator {
  return Route('GET', path);
}

function Post(path: string): MethodDecorator {
  return Route('POST', path);
}

// Helper para ler rotas de uma classe
function getRoutes(target: any): Map<string, RouteMetadata> {
  const routes = new Map<string, RouteMetadata>();
  const proto = target.prototype || target;
  
  // Iterar sobre métodos
  for (const key of Reflect.ownKeys(proto)) {
    if (key === 'constructor') continue;
    
    const metadata = Reflect.getMetadata(ROUTE_KEY, proto, key);
    if (metadata) {
      routes.set(String(key), metadata);
    }
  }
  
  return routes;
}

// Uso
class UserController {
  @Get('/users')
  findAll() {
    return [];
  }
  
  @Get('/users/:id')
  findOne() {
    return {};
  }
  
  @Post('/users')
  create() {
    return {};
  }
}

// Ler rotas
const routes = getRoutes(UserController);
for (const [method, metadata] of routes) {
  console.log(`${method}: ${metadata.method} ${metadata.path}`);
}
// findAll: GET /users
// findOne: GET /users/:id
// create: POST /users
```

### Parameter Decorator + Reflect

```typescript
import 'reflect-metadata';

const INJECT_KEY = Symbol('inject');

interface InjectMetadata {
  index: number;
  token: any;
}

function Inject(token: any): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingInjects: InjectMetadata[] = 
      Reflect.getMetadata(INJECT_KEY, target, propertyKey!) || [];
    
    existingInjects.push({ index: parameterIndex, token });
    
    Reflect.defineMetadata(INJECT_KEY, existingInjects, target, propertyKey!);
  };
}

// Helper para ler injeções
function getInjections(target: any, propertyKey?: string): InjectMetadata[] {
  if (propertyKey) {
    return Reflect.getMetadata(INJECT_KEY, target, propertyKey) || [];
  }
  return Reflect.getMetadata(INJECT_KEY, target) || [];
}

// Tokens
const USER_REPOSITORY = Symbol('UserRepository');
const CONFIG_SERVICE = Symbol('ConfigService');

// Uso
class UserService {
  constructor(
    @Inject(USER_REPOSITORY) userRepo: any,
    @Inject(CONFIG_SERVICE) config: any
  ) {}
}

// Ler injeções do constructor
const injections = getInjections(UserService);
console.log(injections);
// [
//   { index: 0, token: Symbol(UserRepository) },
//   { index: 1, token: Symbol(ConfigService) }
// ]
```

## 🚀 Padrões Avançados

### Dependency Injection

```typescript
import 'reflect-metadata';

// Metadata keys
const INJECTABLE_KEY = Symbol('injectable');
const INJECT_KEY = Symbol('inject');

// Decorators
function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
    return target;
  };
}

function Inject(token: any): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingInjects = Reflect.getMetadata(INJECT_KEY, target) || [];
    existingInjects.push({ index: parameterIndex, token });
    Reflect.defineMetadata(INJECT_KEY, existingInjects, target);
  };
}

// DI Container
class DIContainer {
  private services = new Map<any, any>();
  
  register<T>(token: any, service: new(...args: any[]) => T): void {
    this.services.set(token, service);
  }
  
  resolve<T>(token: any): T {
    const target = this.services.get(token);
    
    if (!target) {
      throw new Error(`No provider for ${String(token)}`);
    }
    
    // Verificar se é injectable
    if (!Reflect.getMetadata(INJECTABLE_KEY, target)) {
      throw new Error(`${target.name} is not injectable`);
    }
    
    // Obter injeções via @Inject
    const injections: Array<{ index: number; token: any }> = 
      Reflect.getMetadata(INJECT_KEY, target) || [];
    
    // Obter tipos via design:paramtypes
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    
    // Resolver dependências
    const dependencies = paramTypes.map((type: any, index: number) => {
      // Priorizar @Inject se presente
      const injection = injections.find(inj => inj.index === index);
      const depToken = injection ? injection.token : type;
      
      return this.resolve(depToken);
    });
    
    // Criar instância
    return new target(...dependencies);
  }
}

// Exemplo
const USER_REPO = Symbol('UserRepository');
const EMAIL_SERVICE = Symbol('EmailService');

@Injectable()
class UserRepository {
  findById(id: number) {
    return { id, name: 'Alice' };
  }
}

@Injectable()
class EmailService {
  send(to: string, message: string) {
    console.log(`Email sent to ${to}: ${message}`);
  }
}

@Injectable()
class UserService {
  constructor(
    @Inject(USER_REPO) private userRepo: UserRepository,
    @Inject(EMAIL_SERVICE) private emailService: EmailService
  ) {}
  
  registerUser(id: number) {
    const user = this.userRepo.findById(id);
    this.emailService.send(user.name, 'Welcome!');
  }
}

// Uso
const container = new DIContainer();
container.register(USER_REPO, UserRepository);
container.register(EMAIL_SERVICE, EmailService);
container.register(UserService, UserService);

const userService = container.resolve<UserService>(UserService);
userService.registerUser(1);
// Email sent to Alice: Welcome!
```

### Validation Framework

```typescript
import 'reflect-metadata';

const VALIDATION_KEY = Symbol('validation');

// Tipos
type ValidationRule = {
  type: string;
  options?: any;
  message?: string;
};

// Decorators de validação
function IsEmail(message?: string): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidationRule(target, propertyKey, {
      type: 'email',
      message: message || `${String(propertyKey)} must be a valid email`
    });
  };
}

function MinLength(min: number, message?: string): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidationRule(target, propertyKey, {
      type: 'minLength',
      options: { min },
      message: message || `${String(propertyKey)} must be at least ${min} characters`
    });
  };
}

function Max(max: number, message?: string): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidationRule(target, propertyKey, {
      type: 'max',
      options: { max },
      message: message || `${String(propertyKey)} must be at most ${max}`
    });
  };
}

function IsOptional(): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidationRule(target, propertyKey, {
      type: 'optional'
    });
  };
}

// Helper para adicionar regra
function addValidationRule(target: any, propertyKey: string | symbol, rule: ValidationRule): void {
  const existingRules: ValidationRule[] = 
    Reflect.getMetadata(VALIDATION_KEY, target, propertyKey) || [];
  
  existingRules.push(rule);
  
  Reflect.defineMetadata(VALIDATION_KEY, existingRules, target, propertyKey);
}

// Validator
class Validator {
  validate(obj: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const proto = Object.getPrototypeOf(obj);
    
    // Iterar sobre propriedades
    for (const key of Reflect.ownKeys(proto)) {
      if (key === 'constructor') continue;
      
      const rules: ValidationRule[] = Reflect.getMetadata(VALIDATION_KEY, proto, key) || [];
      const value = obj[key];
      
      for (const rule of rules) {
        const error = this.validateRule(value, rule, String(key));
        if (error) {
          errors.push(error);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  private validateRule(value: any, rule: ValidationRule, propertyKey: string): string | null {
    // Optional - pular se valor é undefined
    if (rule.type === 'optional' && value === undefined) {
      return null;
    }
    
    switch (rule.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return rule.message!;
        }
        break;
        
      case 'minLength':
        if (value.length < rule.options.min) {
          return rule.message!;
        }
        break;
        
      case 'max':
        if (value > rule.options.max) {
          return rule.message!;
        }
        break;
    }
    
    return null;
  }
}

// Uso
class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(3)
  name: string;
  
  @Max(150)
  age: number;
  
  @IsOptional()
  bio?: string;
}

const validator = new Validator();

const dto1 = Object.assign(new CreateUserDto(), {
  email: 'invalid',
  name: 'AB',
  age: 200
});

const result1 = validator.validate(dto1);
console.log(result1);
// {
//   valid: false,
//   errors: [
//     'email must be a valid email',
//     'name must be at least 3 characters',
//     'age must be at most 150'
//   ]
// }

const dto2 = Object.assign(new CreateUserDto(), {
  email: 'alice@example.com',
  name: 'Alice',
  age: 30
});

const result2 = validator.validate(dto2);
console.log(result2);
// { valid: true, errors: [] }
```

### ORM Entity Mapping

```typescript
import 'reflect-metadata';

const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const PRIMARY_KEY = Symbol('primary');

// Decorators
function Entity(tableName: string): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(ENTITY_KEY, { tableName }, target);
  };
}

function Column(options: { name?: string; type?: string } = {}): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    
    Reflect.defineMetadata(COLUMN_KEY, {
      name: options.name || String(propertyKey),
      type: options.type || type?.name.toLowerCase()
    }, target, propertyKey);
  };
}

function PrimaryKey(): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(PRIMARY_KEY, true, target, propertyKey);
  };
}

// Query Builder
class QueryBuilder {
  static select<T>(entityClass: new() => T): string {
    const entity = Reflect.getMetadata(ENTITY_KEY, entityClass);
    const proto = entityClass.prototype;
    
    const columns: string[] = [];
    
    for (const key of Reflect.ownKeys(proto)) {
      if (key === 'constructor') continue;
      
      const columnMeta = Reflect.getMetadata(COLUMN_KEY, proto, key);
      if (columnMeta) {
        columns.push(columnMeta.name);
      }
    }
    
    return `SELECT ${columns.join(', ')} FROM ${entity.tableName}`;
  }
  
  static insert<T>(entityClass: new() => T, obj: Partial<T>): string {
    const entity = Reflect.getMetadata(ENTITY_KEY, entityClass);
    const proto = entityClass.prototype;
    
    const columns: string[] = [];
    const values: any[] = [];
    
    for (const key of Reflect.ownKeys(proto)) {
      if (key === 'constructor') continue;
      
      const columnMeta = Reflect.getMetadata(COLUMN_KEY, proto, key);
      if (columnMeta && obj[key as keyof T] !== undefined) {
        columns.push(columnMeta.name);
        values.push(obj[key as keyof T]);
      }
    }
    
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    return `INSERT INTO ${entity.tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
  }
}

// Uso
@Entity('users')
class User {
  @PrimaryKey()
  @Column()
  id: number;
  
  @Column()
  name: string;
  
  @Column()
  email: string;
}

console.log(QueryBuilder.select(User));
// SELECT id, name, email FROM users

console.log(QueryBuilder.insert(User, { name: 'Alice', email: 'alice@example.com' }));
// INSERT INTO users (name, email) VALUES ($1, $2)
```

### HTTP Route Registration

```typescript
import 'reflect-metadata';

const CONTROLLER_KEY = Symbol('controller');
const ROUTE_KEY = Symbol('route');

// Decorators
function Controller(prefix: string): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(CONTROLLER_KEY, { prefix }, target);
  };
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function createRouteDecorator(method: HttpMethod) {
  return function(path: string = ''): MethodDecorator {
    return function(target: any, propertyKey: string | symbol) {
      const routes = Reflect.getMetadata(ROUTE_KEY, target.constructor) || [];
      routes.push({ method, path, handler: propertyKey });
      Reflect.defineMetadata(ROUTE_KEY, routes, target.constructor);
    };
  };
}

const Get = createRouteDecorator('GET');
const Post = createRouteDecorator('POST');
const Put = createRouteDecorator('PUT');
const Delete = createRouteDecorator('DELETE');

// Application
class Application {
  private routes: any[] = [];
  
  registerController(controller: any): void {
    const controllerMeta = Reflect.getMetadata(CONTROLLER_KEY, controller);
    const routes = Reflect.getMetadata(ROUTE_KEY, controller) || [];
    
    for (const route of routes) {
      const fullPath = `${controllerMeta.prefix}${route.path}`;
      
      this.routes.push({
        method: route.method,
        path: fullPath,
        handler: route.handler
      });
      
      console.log(`[ROUTE] ${route.method.padEnd(6)} ${fullPath} -> ${controller.name}.${String(route.handler)}`);
    }
  }
  
  getRoutes() {
    return this.routes;
  }
}

// Uso
@Controller('/users')
class UserController {
  @Get()
  findAll() {
    return [{ id: 1, name: 'Alice' }];
  }
  
  @Get('/:id')
  findOne() {
    return { id: 1, name: 'Alice' };
  }
  
  @Post()
  create() {
    return { id: 2, name: 'Bob' };
  }
  
  @Put('/:id')
  update() {
    return { id: 1, name: 'Alice Updated' };
  }
  
  @Delete('/:id')
  remove() {
    return { deleted: true };
  }
}

@Controller('/posts')
class PostController {
  @Get()
  findAll() {
    return [];
  }
  
  @Post()
  create() {
    return {};
  }
}

// Bootstrap
const app = new Application();
app.registerController(UserController);
app.registerController(PostController);

// Output:
// [ROUTE] GET    /users -> UserController.findAll
// [ROUTE] GET    /users/:id -> UserController.findOne
// [ROUTE] POST   /users -> UserController.create
// [ROUTE] PUT    /users/:id -> UserController.update
// [ROUTE] DELETE /users/:id -> UserController.remove
// [ROUTE] GET    /posts -> PostController.findAll
// [ROUTE] POST   /posts -> PostController.create
```

### AOP (Aspect-Oriented Programming)

```typescript
import 'reflect-metadata';

const ASPECT_KEY = Symbol('aspect');

// Tipos
type Aspect = 'before' | 'after' | 'around';

interface AspectMetadata {
  type: Aspect;
  handler: (context: any) => void | any;
}

// Decorator genérico para aspects
function createAspectDecorator(type: Aspect, handler: (context: any) => void | any): MethodDecorator {
  return function(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const aspects: AspectMetadata[] = Reflect.getMetadata(ASPECT_KEY, target, propertyKey) || [];
    aspects.push({ type, handler });
    Reflect.defineMetadata(ASPECT_KEY, aspects, target, propertyKey);
    
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const context = {
        target: this,
        method: propertyKey,
        args
      };
      
      // Before aspects
      for (const aspect of aspects.filter(a => a.type === 'before')) {
        aspect.handler(context);
      }
      
      // Around aspects (wrap execution)
      let result: any;
      const aroundAspects = aspects.filter(a => a.type === 'around');
      
      if (aroundAspects.length > 0) {
        // Execute com around
        result = aroundAspects[0].handler({
          ...context,
          proceed: () => originalMethod.apply(this, args)
        });
      } else {
        // Execute normalmente
        result = originalMethod.apply(this, args);
      }
      
      // After aspects
      for (const aspect of aspects.filter(a => a.type === 'after')) {
        aspect.handler({ ...context, result });
      }
      
      return result;
    };
    
    return descriptor;
  };
}

// Decorators específicos
function Log(): MethodDecorator {
  return createAspectDecorator('before', (context) => {
    console.log(`[LOG] Calling ${String(context.method)} with args:`, context.args);
  });
}

function Measure(): MethodDecorator {
  return createAspectDecorator('around', (context) => {
    const start = Date.now();
    const result = context.proceed();
    const duration = Date.now() - start;
    console.log(`[MEASURE] ${String(context.method)} took ${duration}ms`);
    return result;
  });
}

function CacheResult(): MethodDecorator {
  const cache = new Map<string, any>();
  
  return createAspectDecorator('around', (context) => {
    const key = JSON.stringify(context.args);
    
    if (cache.has(key)) {
      console.log(`[CACHE] Hit for ${String(context.method)}`);
      return cache.get(key);
    }
    
    console.log(`[CACHE] Miss for ${String(context.method)}`);
    const result = context.proceed();
    cache.set(key, result);
    return result;
  });
}

// Uso
class UserService {
  @Log()
  @Measure()
  findById(id: number) {
    // Simular delay
    for (let i = 0; i < 1000000; i++) {}
    return { id, name: 'Alice' };
  }
  
  @Log()
  @CacheResult()
  @Measure()
  expensiveCalculation(n: number): number {
    // Simular cálculo pesado
    for (let i = 0; i < 10000000; i++) {}
    return n * 2;
  }
}

const service = new UserService();

service.findById(1);
// [LOG] Calling findById with args: [1]
// [MEASURE] findById took 2ms

service.expensiveCalculation(10);
// [LOG] Calling expensiveCalculation with args: [10]
// [CACHE] Miss for expensiveCalculation
// [MEASURE] expensiveCalculation took 25ms

service.expensiveCalculation(10);
// [LOG] Calling expensiveCalculation with args: [10]
// [CACHE] Hit for expensiveCalculation
// [MEASURE] expensiveCalculation took 0ms
```

## 🔄 Composição

### Combinar Múltiplos Decorators

```typescript
import 'reflect-metadata';

const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const VALIDATION_KEY = Symbol('validation');

// Decorators podem ser empilhados
class User {
  @Column()
  @MinLength(3)
  @IsEmail()
  email: string;
  
  @Column()
  @MinLength(2)
  name: string;
}

// Metadata acumulada
const emailValidations = Reflect.getMetadata(VALIDATION_KEY, User.prototype, 'email');
const emailColumn = Reflect.getMetadata(COLUMN_KEY, User.prototype, 'email');

console.log(emailValidations);
// [{ type: 'minLength', ... }, { type: 'email', ... }]

console.log(emailColumn);
// { name: 'email', type: 'string' }
```

### Decorator Factory Composto

```typescript
// Criar decorator que aplica múltiplos decorators
function ValidatedColumn(validations: PropertyDecorator[]): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    // Aplicar @Column
    Column()(target, propertyKey);
    
    // Aplicar validações
    for (const validation of validations) {
      validation(target, propertyKey);
    }
  };
}

// Uso simplificado
class Product {
  @ValidatedColumn([MinLength(3), IsEmail()])
  email: string;
}
```

### Metadata Inheritance

```typescript
import 'reflect-metadata';

const CONFIG_KEY = Symbol('config');

function Config(options: any): ClassDecorator {
  return function(target: any) {
    // Obter metadata do pai
    const parentMeta = Reflect.getMetadata(CONFIG_KEY, Object.getPrototypeOf(target)) || {};
    
    // Merge com metadata atual
    const metadata = { ...parentMeta, ...options };
    
    Reflect.defineMetadata(CONFIG_KEY, metadata, target);
  };
}

@Config({ database: 'users' })
class BaseEntity {}

@Config({ cache: true })
class User extends BaseEntity {}

// User herda metadata de BaseEntity + adiciona cache
const userConfig = Reflect.getMetadata(CONFIG_KEY, User);
console.log(userConfig);
// { database: 'users', cache: true }
```

## 🌟 Real-world Examples

### NestJS Pattern

```typescript
import 'reflect-metadata';

// Simplified NestJS-style implementation

const INJECTABLE_KEY = Symbol('injectable');
const CONTROLLER_KEY = Symbol('controller');
const ROUTE_KEY = Symbol('route');
const PARAM_KEY = Symbol('param');

// @Injectable()
function Injectable(): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
  };
}

// @Controller()
function Controller(prefix: string): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(CONTROLLER_KEY, { prefix }, target);
  };
}

// @Get(), @Post()
function Get(path: string = ''): MethodDecorator {
  return function(target: any, propertyKey: string | symbol) {
    const routes = Reflect.getMetadata(ROUTE_KEY, target.constructor) || [];
    routes.push({ method: 'GET', path, handler: propertyKey });
    Reflect.defineMetadata(ROUTE_KEY, routes, target.constructor);
  };
}

// @Param(), @Body()
function Param(name: string): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const params = Reflect.getMetadata(PARAM_KEY, target, propertyKey!) || [];
    params.push({ index: parameterIndex, type: 'param', name });
    Reflect.defineMetadata(PARAM_KEY, params, target, propertyKey!);
  };
}

function Body(): ParameterDecorator {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const params = Reflect.getMetadata(PARAM_KEY, target, propertyKey!) || [];
    params.push({ index: parameterIndex, type: 'body' });
    Reflect.defineMetadata(PARAM_KEY, params, target, propertyKey!);
  };
}

// Service
@Injectable()
class UserService {
  findAll() {
    return [{ id: 1, name: 'Alice' }];
  }
  
  findOne(id: string) {
    return { id, name: 'Alice' };
  }
  
  create(data: any) {
    return { id: '2', ...data };
  }
}

// Controller
@Controller('/users')
class UserController {
  constructor(private userService: UserService) {}
  
  @Get()
  findAll() {
    return this.userService.findAll();
  }
  
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  
  @Post()
  create(@Body() data: any) {
    return this.userService.create(data);
  }
}
```

### TypeORM Pattern

```typescript
import 'reflect-metadata';

// Simplified TypeORM-style implementation

const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const PRIMARY_KEY = Symbol('primary');
const RELATION_KEY = Symbol('relation');

function Entity(tableName: string): ClassDecorator {
  return function(target: any) {
    Reflect.defineMetadata(ENTITY_KEY, { tableName }, target);
  };
}

function PrimaryGeneratedColumn(): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(PRIMARY_KEY, true, target, propertyKey);
    Reflect.defineMetadata(COLUMN_KEY, { 
      name: String(propertyKey), 
      type: 'integer', 
      primary: true 
    }, target, propertyKey);
  };
}

function Column(options: any = {}): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    Reflect.defineMetadata(COLUMN_KEY, {
      name: options.name || String(propertyKey),
      type: options.type || type?.name.toLowerCase(),
      nullable: options.nullable ?? true
    }, target, propertyKey);
  };
}

function OneToMany(typeFn: () => any, inverseSide: (obj: any) => any): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(RELATION_KEY, {
      type: 'one-to-many',
      target: typeFn,
      inverseSide
    }, target, propertyKey);
  };
}

function ManyToOne(typeFn: () => any, inverseSide: (obj: any) => any): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(RELATION_KEY, {
      type: 'many-to-one',
      target: typeFn,
      inverseSide
    }, target, propertyKey);
  };
}

// Entities
@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;
  
  @Column({ type: 'text' })
  content: string;
  
  @ManyToOne(() => User, user => user.posts)
  author: User;
}
```

### class-validator Pattern

```typescript
import 'reflect-metadata';

// Simplified class-validator-style implementation

const VALIDATION_KEY = Symbol('validation');

function IsEmail(options?: any): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidation(target, propertyKey, {
      type: 'isEmail',
      message: options?.message || `${String(propertyKey)} must be an email`
    });
  };
}

function MinLength(min: number, options?: any): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidation(target, propertyKey, {
      type: 'minLength',
      constraints: [min],
      message: options?.message || `${String(propertyKey)} must be longer than ${min} characters`
    });
  };
}

function Max(max: number, options?: any): PropertyDecorator {
  return function(target: any, propertyKey: string | symbol) {
    addValidation(target, propertyKey, {
      type: 'max',
      constraints: [max],
      message: options?.message || `${String(propertyKey)} must not be greater than ${max}`
    });
  };
}

function addValidation(target: any, propertyKey: string | symbol, validation: any) {
  const validations = Reflect.getMetadata(VALIDATION_KEY, target, propertyKey) || [];
  validations.push(validation);
  Reflect.defineMetadata(VALIDATION_KEY, validations, target, propertyKey);
}

function validate(obj: any): any[] {
  const errors: any[] = [];
  const proto = Object.getPrototypeOf(obj);
  
  for (const key of Reflect.ownKeys(proto)) {
    const validations = Reflect.getMetadata(VALIDATION_KEY, proto, key) || [];
    
    for (const validation of validations) {
      const value = obj[key];
      let isValid = true;
      
      switch (validation.type) {
        case 'isEmail':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          break;
        case 'minLength':
          isValid = value && value.length >= validation.constraints[0];
          break;
        case 'max':
          isValid = value <= validation.constraints[0];
          break;
      }
      
      if (!isValid) {
        errors.push({
          property: String(key),
          value,
          message: validation.message
        });
      }
    }
  }
  
  return errors;
}

// DTO
class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(3)
  name: string;
  
  @Max(150)
  age: number;
}

// Uso
const dto = Object.assign(new CreateUserDto(), {
  email: 'invalid',
  name: 'AB',
  age: 200
});

const errors = validate(dto);
console.log(errors);
// [
//   { property: 'email', value: 'invalid', message: 'email must be an email' },
//   { property: 'name', value: 'AB', message: 'name must be longer than 3 characters' },
//   { property: 'age', value: 200, message: 'age must not be greater than 150' }
// ]
```

---

**Conclusão**: **Reflect + Decorators** = **Metadata System Poderoso**. Decorators **aplicam transformações**, Reflect **persiste e consulta metadata**. Essa combinação permite criar **frameworks robustos** (DI, ORM, Validation, Routing, AOP) com **APIs declarativas elegantes**. TypeScript automaticamente emite **design-time type metadata** quando `emitDecoratorMetadata: true`, facilitando **type-based features** (auto-wiring DI, type-based validation).
