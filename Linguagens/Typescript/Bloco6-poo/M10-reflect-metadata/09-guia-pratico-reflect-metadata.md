# Guia Prático de Reflect e Metadata

## 🎯 Introdução

Guia **completo e prático** para usar Reflect API e Reflect Metadata em projetos TypeScript. Cobre **setup**, **organização**, **best practices**, **debugging**, **performance**, **exemplos reais** de frameworks (NestJS, TypeORM, class-validator).

## 📋 Sumário

### Setup e Configuração
- TypeScript config
- Instalação de dependências
- Import order
- Environment setup

### Organização de Código
- Estrutura de pastas
- Metadata keys organization
- Decorator organization
- Naming conventions

### Best Practices
- Usar Symbols para metadata keys
- Evitar circular dependencies
- Type safety
- Performance considerations

### Debugging
- Inspecionar metadata
- Debugging decorators
- Common errors
- Troubleshooting

### Performance
- Caching metadata
- Lazy loading
- Minimizar reflection calls
- Production optimizations

### Real-world Examples
- NestJS patterns
- TypeORM patterns
- class-validator patterns
- Custom framework example

## 🔧 Setup e Configuração

### 1. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    // Necessário para decorators
    "experimentalDecorators": true,
    
    // Necessário para design-time type metadata
    "emitDecoratorMetadata": true,
    
    // Recomendado
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // Source maps para debugging
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2. Instalação de Dependências

```bash
# reflect-metadata (obrigatório)
npm install reflect-metadata

# TypeScript (dev dependency)
npm install -D typescript @types/node

# Opcional - ferramentas úteis
npm install -D ts-node nodemon
```

```json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --exec ts-node src/index.ts",
    "start": "node dist/index.js"
  }
}
```

### 3. Import Order (CRÍTICO)

```typescript
// ✅ CORRETO - index.ts ou entry point
// 1. reflect-metadata PRIMEIRO (antes de tudo)
import 'reflect-metadata';

// 2. Depois imports normais
import { Injectable } from './decorators';
import { UserService } from './services/user.service';
import { DIContainer } from './core/container';

// ❌ ERRADO - reflect-metadata após imports
import { UserService } from './services/user.service'; // ← Pode não ter metadata!
import 'reflect-metadata'; // ← Muito tarde
```

### 4. Project Structure

```
src/
├── index.ts                 # Entry point (import 'reflect-metadata' aqui)
├── core/
│   ├── decorators/
│   │   ├── injectable.ts
│   │   ├── inject.ts
│   │   └── index.ts
│   ├── metadata/
│   │   ├── keys.ts         # Metadata keys centralizados
│   │   └── utils.ts
│   └── container.ts
├── modules/
│   ├── user/
│   │   ├── user.entity.ts
│   │   ├── user.service.ts
│   │   └── user.controller.ts
│   └── auth/
│       └── ...
└── utils/
    └── reflection.ts
```

## 🗂️ Organização de Código

### Metadata Keys Organization

```typescript
// src/core/metadata/keys.ts
// ✅ Centralizar todos os metadata keys

export const MetadataKeys = {
  // Dependency Injection
  INJECTABLE: Symbol('injectable'),
  INJECT: Symbol('inject'),
  SCOPE: Symbol('scope'),
  
  // ORM
  ENTITY: Symbol('entity'),
  COLUMN: Symbol('column'),
  PRIMARY_KEY: Symbol('primary'),
  RELATION: Symbol('relation'),
  
  // Validation
  VALIDATION: Symbol('validation'),
  
  // HTTP
  CONTROLLER: Symbol('controller'),
  ROUTE: Symbol('route'),
  MIDDLEWARE: Symbol('middleware'),
  
  // Design-time types (built-in)
  DESIGN_TYPE: 'design:type',
  DESIGN_PARAMTYPES: 'design:paramtypes',
  DESIGN_RETURNTYPE: 'design:returntype'
} as const;
```

### Decorator Organization

```typescript
// src/core/decorators/index.ts
export * from './injectable';
export * from './inject';
export * from './column';
export * from './entity';

// src/core/decorators/injectable.ts
import 'reflect-metadata';
import { MetadataKeys } from '../metadata/keys';

export enum Scope {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient'
}

export function Injectable(scope: Scope = Scope.SINGLETON) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(MetadataKeys.INJECTABLE, true, target);
    Reflect.defineMetadata(MetadataKeys.SCOPE, scope, target);
    return target;
  };
}

// src/core/decorators/inject.ts
import 'reflect-metadata';
import { MetadataKeys } from '../metadata/keys';

export function Inject(token: any) {
  return function(target: any, propertyKey: string | undefined, parameterIndex: number) {
    const existingInjections = Reflect.getMetadata(MetadataKeys.INJECT, target) || [];
    existingInjections.push({ index: parameterIndex, token });
    Reflect.defineMetadata(MetadataKeys.INJECT, existingInjections, target);
  };
}
```

### Utility Functions

```typescript
// src/utils/reflection.ts
import 'reflect-metadata';
import { MetadataKeys } from '../core/metadata/keys';

export class ReflectionUtils {
  /**
   * Obter tipo de propriedade
   */
  static getPropertyType(target: any, propertyKey: string): any {
    return Reflect.getMetadata(MetadataKeys.DESIGN_TYPE, target, propertyKey);
  }
  
  /**
   * Obter tipos de parâmetros
   */
  static getParameterTypes(target: any, propertyKey?: string): any[] {
    if (propertyKey) {
      return Reflect.getMetadata(MetadataKeys.DESIGN_PARAMTYPES, target, propertyKey) || [];
    }
    return Reflect.getMetadata(MetadataKeys.DESIGN_PARAMTYPES, target) || [];
  }
  
  /**
   * Obter tipo de retorno
   */
  static getReturnType(target: any, propertyKey: string): any {
    return Reflect.getMetadata(MetadataKeys.DESIGN_RETURNTYPE, target, propertyKey);
  }
  
  /**
   * Verificar se classe é injectable
   */
  static isInjectable(target: any): boolean {
    return Reflect.getMetadata(MetadataKeys.INJECTABLE, target) === true;
  }
  
  /**
   * Listar todos os métodos de uma classe
   */
  static getMethods(target: any): string[] {
    const proto = target.prototype || target;
    return Reflect.ownKeys(proto)
      .filter(key => key !== 'constructor' && typeof proto[key] === 'function')
      .map(key => String(key));
  }
  
  /**
   * Listar todas as propriedades de uma instância
   */
  static getProperties(instance: any): string[] {
    return Reflect.ownKeys(instance)
      .filter(key => typeof key === 'string')
      .map(String);
  }
}
```

## 🎯 Best Practices

### 1. Usar Symbols para Metadata Keys

```typescript
// ❌ EVITAR - strings podem colidir
Reflect.defineMetadata('validation', rules, target);

// ✅ PREFERIR - Symbols são únicos
const VALIDATION_KEY = Symbol('validation');
Reflect.defineMetadata(VALIDATION_KEY, rules, target);

// ✅ MELHOR - Centralizar em arquivo
import { MetadataKeys } from './metadata/keys';
Reflect.defineMetadata(MetadataKeys.VALIDATION, rules, target);
```

### 2. Type Safety

```typescript
// ✅ Criar types para metadata
interface ValidationMetadata {
  rules: ValidationRule[];
  async?: boolean;
}

interface EntityMetadata {
  tableName: string;
  schema?: string;
}

// Usar types em helpers
function getValidationMetadata(target: any, propertyKey: string): ValidationMetadata | undefined {
  return Reflect.getMetadata(MetadataKeys.VALIDATION, target, propertyKey);
}

function getEntityMetadata(target: any): EntityMetadata | undefined {
  return Reflect.getMetadata(MetadataKeys.ENTITY, target);
}
```

### 3. Evitar Circular Dependencies

```typescript
// ❌ PROBLEMA - circular dependency
// user.entity.ts
import { Post } from './post.entity';

@Entity()
class User {
  @Relation({ type: () => Post }) // ReferenceError!
  posts: Post[];
}

// ✅ SOLUÇÃO - usar função lazy
@Entity()
class User {
  @Relation({ type: () => Post }) // OK - função avaliada depois
  posts: Post[];
}

// ✅ SOLUÇÃO - forwardRef helper
function forwardRef<T>(typeFn: () => T): () => T {
  return typeFn;
}

@Entity()
class User {
  @Relation({ type: forwardRef(() => Post) })
  posts: Post[];
}
```

### 4. Validar Metadata

```typescript
// ✅ Validar que decorator foi aplicado
function getEntityMetadata(target: any): EntityMetadata {
  const metadata = Reflect.getMetadata(MetadataKeys.ENTITY, target);
  
  if (!metadata) {
    throw new Error(`${target.name} is not an entity. Did you forget @Entity()?`);
  }
  
  return metadata;
}

// ✅ Validar configuração TypeScript
function ensureDecoratorMetadata() {
  class Test {
    prop: string;
  }
  
  const type = Reflect.getMetadata('design:type', Test.prototype, 'prop');
  
  if (!type) {
    throw new Error(
      'emitDecoratorMetadata is not enabled. ' +
      'Add "emitDecoratorMetadata": true to tsconfig.json'
    );
  }
}
```

## 🐛 Debugging

### Inspecionar Metadata

```typescript
// Helper para debug
class MetadataInspector {
  static inspectClass(target: any): void {
    console.log(`\n=== Class: ${target.name} ===`);
    
    // Metadata da classe
    const classKeys = Reflect.getMetadataKeys(target);
    console.log('Class metadata keys:', classKeys);
    
    for (const key of classKeys) {
      const value = Reflect.getMetadata(key, target);
      console.log(`  ${String(key)}:`, value);
    }
    
    // Metadata de propriedades
    const proto = target.prototype;
    const props = Reflect.ownKeys(proto);
    
    for (const prop of props) {
      if (prop === 'constructor') continue;
      
      const propKeys = Reflect.getMetadataKeys(proto, prop as string);
      
      if (propKeys.length > 0) {
        console.log(`\nProperty: ${String(prop)}`);
        
        for (const key of propKeys) {
          const value = Reflect.getMetadata(key, proto, prop as string);
          console.log(`  ${String(key)}:`, value);
        }
      }
    }
  }
  
  static inspectInstance(instance: any): void {
    console.log(`\n=== Instance of ${instance.constructor.name} ===`);
    
    const props = Reflect.ownKeys(instance);
    
    for (const prop of props) {
      console.log(`${String(prop)}:`, instance[prop]);
    }
  }
}

// Uso
@Entity('users')
class User {
  @Column()
  @PrimaryKey
  id: number;
  
  @Column()
  name: string;
}

MetadataInspector.inspectClass(User);
// === Class: User ===
// Class metadata keys: [Symbol(entity)]
//   Symbol(entity): { tableName: 'users' }
// 
// Property: id
//   Symbol(column): { ... }
//   Symbol(primary): true
//   design:type: [Function: Number]
// 
// Property: name
//   Symbol(column): { ... }
//   design:type: [Function: String]
```

### Debugging Decorators

```typescript
// ✅ Logging decorator para debug
function LogDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log('[DECORATOR]', {
    class: target.constructor.name,
    property: propertyKey,
    descriptor
  });
  
  return descriptor;
}

class Example {
  @LogDecorator
  method() {}
}
// [DECORATOR] { class: 'Example', property: 'method', descriptor: {...} }
```

### Common Errors

```typescript
// ❌ ERRO: "Reflect.getMetadata is not a function"
// CAUSA: Esqueceu de importar reflect-metadata
// SOLUÇÃO: Adicionar import 'reflect-metadata' no entry point

// ❌ ERRO: design:type retorna undefined
// CAUSA: emitDecoratorMetadata não habilitado ou propriedade sem decorator
// SOLUÇÃO: 
//   1. Verificar tsconfig.json: "emitDecoratorMetadata": true
//   2. Adicionar decorator na propriedade

// ❌ ERRO: design:type retorna Object ao invés do tipo correto
// CAUSA: Union type, Generic, ou Interface
// SOLUÇÃO: Usar classe concreta ou passar tipo via decorator

// ❌ ERRO: Circular dependency
// CAUSA: Imports circulares entre arquivos
// SOLUÇÃO: Usar lazy loading (funções) para tipos
```

## ⚡ Performance

### 1. Caching Metadata

```typescript
// ✅ Cache metadata para evitar lookups repetidos
class MetadataCache {
  private cache = new Map<string, any>();
  
  get<T>(target: any, key: any, propertyKey?: string): T | undefined {
    const cacheKey = this.getCacheKey(target, key, propertyKey);
    
    if (!this.cache.has(cacheKey)) {
      const value = propertyKey
        ? Reflect.getMetadata(key, target, propertyKey)
        : Reflect.getMetadata(key, target);
      
      this.cache.set(cacheKey, value);
    }
    
    return this.cache.get(cacheKey);
  }
  
  private getCacheKey(target: any, key: any, propertyKey?: string): string {
    const targetName = target.name || target.constructor?.name || 'unknown';
    const keyStr = typeof key === 'symbol' ? key.toString() : String(key);
    return `${targetName}:${keyStr}:${propertyKey || 'class'}`;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const metadataCache = new MetadataCache();

// Uso
const entityMeta = metadataCache.get(User, MetadataKeys.ENTITY); // Cache miss
const entityMeta2 = metadataCache.get(User, MetadataKeys.ENTITY); // Cache hit!
```

### 2. Lazy Loading

```typescript
// ✅ Carregar metadata apenas quando necessário
class LazyMetadata<T> {
  private _value?: T;
  private loaded = false;
  
  constructor(private loader: () => T) {}
  
  get value(): T {
    if (!this.loaded) {
      this._value = this.loader();
      this.loaded = true;
    }
    return this._value!;
  }
}

class User {
  // Lazy metadata
  private static _entityMetadata = new LazyMetadata(() => 
    Reflect.getMetadata(MetadataKeys.ENTITY, User)
  );
  
  static get entityMetadata() {
    return this._entityMetadata.value; // Carrega apenas na primeira vez
  }
}
```

### 3. Minimize Reflection Calls

```typescript
// ❌ EVITAR - múltiplos getMetadata para mesma informação
function processEntity(entityClass: any) {
  const tableName = Reflect.getMetadata(MetadataKeys.ENTITY, entityClass)?.tableName;
  const schema = Reflect.getMetadata(MetadataKeys.ENTITY, entityClass)?.schema;
  // ...
}

// ✅ PREFERIR - single lookup
function processEntity(entityClass: any) {
  const entity = Reflect.getMetadata(MetadataKeys.ENTITY, entityClass);
  const tableName = entity?.tableName;
  const schema = entity?.schema;
  // ...
}
```

### 4. Production Optimizations

```typescript
// ✅ Remover debugging em produção
const DEBUG = process.env.NODE_ENV !== 'production';

function debugMetadata(target: any) {
  if (DEBUG) {
    MetadataInspector.inspectClass(target);
  }
}

// ✅ Strip metadata em produção (se não necessário)
// Configurar bundler para remover reflect-metadata

// webpack.config.js
module.exports = {
  // ...
  externals: process.env.NODE_ENV === 'production' 
    ? { 'reflect-metadata': 'reflect-metadata' }
    : {}
};
```

## 🌍 Real-world Examples

### NestJS Patterns

```typescript
// NestJS usa Reflect Metadata extensivamente

import 'reflect-metadata';

// 1. Dependency Injection
@Injectable()
class UserService {
  constructor(
    private userRepository: UserRepository,
    private configService: ConfigService
  ) {}
}

// 2. HTTP Routes
@Controller('users')
class UserController {
  @Get()
  findAll(): User[] {
    return [];
  }
  
  @Post()
  create(@Body() dto: CreateUserDto): User {
    return new User();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string): User {
    return new User();
  }
}

// 3. Guards
@Injectable()
class AuthGuard {
  canActivate(context: ExecutionContext): boolean {
    // Verificar metadata de rota
    const roles = Reflect.getMetadata('roles', context.getHandler());
    return true;
  }
}

@Controller('admin')
class AdminController {
  @Get()
  @Roles('admin')
  dashboard() {}
}
```

### TypeORM Patterns

```typescript
// TypeORM usa metadata para ORM

import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  name: string;
  
  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  title: string;
  
  @Column('text')
  content: string;
  
  @ManyToOne(() => User, user => user.posts)
  author: User;
}
```

### class-validator Patterns

```typescript
// class-validator usa metadata para validação

import 'reflect-metadata';
import { IsEmail, MinLength, Max, ValidateNested } from 'class-validator';

class Address {
  @MinLength(3)
  street: string;
  
  @MinLength(2)
  city: string;
}

class CreateUserDto {
  @IsEmail()
  email: string;
  
  @MinLength(3)
  name: string;
  
  @Max(150)
  age: number;
  
  @ValidateNested()
  @Type(() => Address)
  address: Address;
}

// Uso
import { validate } from 'class-validator';

const dto = new CreateUserDto();
dto.email = 'invalid';
dto.name = 'AB';
dto.age = 200;

validate(dto).then(errors => {
  console.log(errors);
});
```

### Custom Framework Example

```typescript
// Framework completo usando Reflect Metadata

import 'reflect-metadata';

// 1. Setup metadata keys
const MetadataKeys = {
  CONTROLLER: Symbol('controller'),
  ROUTE: Symbol('route'),
  MIDDLEWARE: Symbol('middleware'),
  INJECTABLE: Symbol('injectable')
};

// 2. Decorators
function Controller(prefix: string) {
  return function(target: any) {
    Reflect.defineMetadata(MetadataKeys.CONTROLLER, { prefix }, target);
  };
}

function Get(path: string = '') {
  return function(target: any, propertyKey: string) {
    const routes = Reflect.getMetadata(MetadataKeys.ROUTE, target.constructor) || [];
    routes.push({ method: 'GET', path, handler: propertyKey });
    Reflect.defineMetadata(MetadataKeys.ROUTE, routes, target.constructor);
  };
}

// 3. Application
class Application {
  private routes: any[] = [];
  
  registerController(controller: any): void {
    const controllerMeta = Reflect.getMetadata(MetadataKeys.CONTROLLER, controller);
    const routes = Reflect.getMetadata(MetadataKeys.ROUTE, controller) || [];
    
    for (const route of routes) {
      const fullPath = `${controllerMeta.prefix}${route.path}`;
      
      this.routes.push({
        method: route.method,
        path: fullPath,
        handler: new controller()[route.handler].bind(new controller())
      });
      
      console.log(`[ROUTE] ${route.method} ${fullPath}`);
    }
  }
  
  handleRequest(method: string, path: string): any {
    const route = this.routes.find(r => r.method === method && r.path === path);
    
    if (!route) {
      return { error: 'Not found' };
    }
    
    return route.handler();
  }
}

// 4. Controller
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
}

// 5. Uso
const app = new Application();
app.registerController(UserController);
// [ROUTE] GET /users
// [ROUTE] GET /users/:id

console.log(app.handleRequest('GET', '/users'));
// [{ id: 1, name: 'Alice' }]
```

---

**Conclusão**: Reflect e Metadata são fundamentais para frameworks modernos TypeScript. Setup correto (reflect-metadata primeiro, emitDecoratorMetadata habilitado), organização (Symbols centralizados, type safety), best practices (caching, lazy loading), e debugging são essenciais para uso profissional.

## 🎓 Módulo Completo

Este é o último arquivo do módulo **M10-reflect-metadata**. Você agora tem conhecimento completo sobre:

1. ✅ **Introdução** - Conceitos, motivação, API overview
2. ✅ **Reflect API Nativa** - Todos os métodos Reflect (ES2015)
3. ✅ **Metadata Reflection API** - reflect-metadata biblioteca completa
4. ✅ **Manipulação de Classes** - Introspection, metadata, DI, factories
5. ✅ **Manipulação de Métodos** - AOP, interception, caching, transactions
6. ✅ **Manipulação de Propriedades** - Property descriptors, validation, ORM
7. ✅ **Design-time Type Metadata** - design:type, paramtypes, returntype
8. ✅ **Padrões Avançados** - DI container, ORM, validation, events, plugins
9. ✅ **Guia Prático** - Setup, best practices, debugging, performance, exemplos reais

**Próximos passos**: Aplicar esses conceitos em projetos reais, estudar código-fonte de NestJS/TypeORM/class-validator para ver implementações profissionais.
