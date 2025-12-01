# Padrões Avançados com Reflect e Metadata

## 🎯 Introdução

**Padrões avançados** combinam Reflect API, Metadata, Decorators, Proxies para criar **frameworks completos**: DI containers, ORMs, validation, serialization, AOP, event systems, plugin architectures.

Este arquivo apresenta **implementações completas** de patterns reais usados em frameworks como NestJS, TypeORM, class-validator.

## 📋 Sumário

### Dependency Injection
- Container completo com scopes
- Circular dependency resolution
- Provider tokens e factory functions
- Injection tokens

### ORM Framework
- Entity metadata system
- Query builder
- Lazy loading
- Cascading operations

### Validation Framework
- Validation decorators
- Nested validation
- Custom validators
- Async validation

### Event System
- Event emitters com metadata
- Typed event handlers
- Event interception
- Event replay

### Plugin Architecture
- Plugin discovery
- Plugin lifecycle
- Plugin metadata
- Plugin dependencies

## 🎯 Dependency Injection Container

### Container Completo

```typescript
import 'reflect-metadata';

// Metadata keys
const INJECTABLE_KEY = Symbol('injectable');
const INJECT_KEY = Symbol('inject');
const SCOPE_KEY = Symbol('scope');

// Scopes
enum Scope {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient',
  REQUEST = 'request'
}

// Decorators
function Injectable(scope: Scope = Scope.SINGLETON) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, target);
    Reflect.defineMetadata(SCOPE_KEY, scope, target);
    return target;
  };
}

function Inject(token: any) {
  return function(target: any, propertyKey: string | undefined, parameterIndex: number) {
    const existingInjections = Reflect.getMetadata(INJECT_KEY, target) || [];
    existingInjections.push({ index: parameterIndex, token });
    Reflect.defineMetadata(INJECT_KEY, existingInjections, target);
  };
}

// Provider types
type Provider<T = any> = 
  | { provide: any; useClass: new (...args: any[]) => T }
  | { provide: any; useValue: T }
  | { provide: any; useFactory: (...args: any[]) => T; inject?: any[] };

// Container
class DIContainer {
  private singletons = new Map<any, any>();
  private providers = new Map<any, Provider>();
  private resolving = new Set<any>(); // Circular dependency detection
  
  register<T>(provider: Provider<T>): void {
    const token = provider.provide;
    this.providers.set(token, provider);
  }
  
  resolve<T>(token: new (...args: any[]) => T): T;
  resolve<T>(token: any): T;
  resolve<T>(token: any): T {
    // Detectar circular dependency
    if (this.resolving.has(token)) {
      throw new Error(`Circular dependency detected: ${token.name || token.toString()}`);
    }
    
    this.resolving.add(token);
    
    try {
      // Provider customizado
      const provider = this.providers.get(token);
      
      if (provider) {
        if ('useValue' in provider) {
          return provider.useValue;
        }
        
        if ('useFactory' in provider) {
          const deps = (provider.inject || []).map(dep => this.resolve(dep));
          return provider.useFactory(...deps);
        }
        
        if ('useClass' in provider) {
          return this.createInstance(provider.useClass);
        }
      }
      
      // Auto-resolve class
      if (typeof token === 'function') {
        return this.createInstance(token);
      }
      
      throw new Error(`No provider for ${token.toString()}`);
    } finally {
      this.resolving.delete(token);
    }
  }
  
  private createInstance<T>(ctor: new (...args: any[]) => T): T {
    // Verificar @Injectable
    const isInjectable = Reflect.getMetadata(INJECTABLE_KEY, ctor);
    if (!isInjectable) {
      throw new Error(`${ctor.name} is not injectable`);
    }
    
    // Verificar scope
    const scope = Reflect.getMetadata(SCOPE_KEY, ctor) || Scope.SINGLETON;
    
    // Singleton
    if (scope === Scope.SINGLETON && this.singletons.has(ctor)) {
      return this.singletons.get(ctor);
    }
    
    // Resolver dependências
    const paramTypes = Reflect.getMetadata('design:paramtypes', ctor) || [];
    const injections = Reflect.getMetadata(INJECT_KEY, ctor) || [];
    
    const dependencies = paramTypes.map((paramType: any, index: number) => {
      // @Inject customizado
      const injection = injections.find((inj: any) => inj.index === index);
      const token = injection?.token || paramType;
      
      return this.resolve(token);
    });
    
    // Criar instância
    const instance = Reflect.construct(ctor, dependencies);
    
    // Cachear singleton
    if (scope === Scope.SINGLETON) {
      this.singletons.set(ctor, instance);
    }
    
    return instance;
  }
  
  clear(): void {
    this.singletons.clear();
    this.providers.clear();
  }
}

// Exemplo de uso
@Injectable()
class Database {
  private connected = false;
  
  connect() {
    this.connected = true;
    console.log('[DB] Connected');
  }
  
  query(sql: string) {
    if (!this.connected) throw new Error('Not connected');
    console.log('[DB] Query:', sql);
    return [];
  }
}

@Injectable()
class Logger {
  log(msg: string) {
    console.log(`[LOG] ${msg}`);
  }
}

interface IConfig {
  appName: string;
  version: string;
}

const CONFIG_TOKEN = Symbol('CONFIG');

@Injectable()
class UserService {
  constructor(
    private db: Database,
    private logger: Logger,
    @Inject(CONFIG_TOKEN) private config: IConfig
  ) {
    this.logger.log(`UserService initialized with config: ${this.config.appName}`);
  }
  
  findAll() {
    this.logger.log('Finding all users');
    this.db.connect();
    return this.db.query('SELECT * FROM users');
  }
}

// Setup container
const container = new DIContainer();

// Registrar config via value provider
container.register({
  provide: CONFIG_TOKEN,
  useValue: { appName: 'MyApp', version: '1.0.0' }
});

// Resolver service
const userService = container.resolve(UserService);
// "[LOG] UserService initialized with config: MyApp"

userService.findAll();
// "[LOG] Finding all users"
// "[DB] Connected"
// "[DB] Query: SELECT * FROM users"

// Singleton test
const userService2 = container.resolve(UserService);
console.log(userService === userService2); // true (mesmo singleton)
```

### Factory Providers

```typescript
import 'reflect-metadata';

// ... (usar mesmo container acima)

@Injectable()
class CacheService {
  constructor(private ttl: number) {}
  
  get(key: string) {
    console.log(`[CACHE] Get ${key} (TTL: ${this.ttl}s)`);
  }
}

// Factory provider
container.register({
  provide: CacheService,
  useFactory: (config: IConfig) => {
    const ttl = config.appName === 'MyApp' ? 3600 : 300;
    return new CacheService(ttl);
  },
  inject: [CONFIG_TOKEN]
});

const cache = container.resolve(CacheService);
cache.get('user:1'); // "[CACHE] Get user:1 (TTL: 3600s)"
```

## 🎯 ORM Framework

### Entity Metadata System

```typescript
import 'reflect-metadata';

// Metadata keys
const ENTITY_KEY = Symbol('entity');
const COLUMN_KEY = Symbol('column');
const PRIMARY_KEY = Symbol('primary');
const RELATION_KEY = Symbol('relation');

// Column options
interface ColumnOptions {
  name?: string;
  type?: string;
  nullable?: boolean;
  default?: any;
  unique?: boolean;
}

// Relation options
interface RelationOptions {
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  target: () => any; // Lazy para evitar circular
  inverseSide?: string;
  cascade?: boolean;
}

// Decorators
function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(ENTITY_KEY, { tableName }, target);
    return target;
  };
}

function Column(options: ColumnOptions = {}) {
  return function(target: any, propertyKey: string) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    
    const columnMeta = {
      property: propertyKey,
      name: options.name || propertyKey,
      type: options.type || inferType(type),
      nullable: options.nullable ?? true,
      default: options.default,
      unique: options.unique ?? false
    };
    
    const columns = Reflect.getMetadata(COLUMN_KEY, target) || [];
    columns.push(columnMeta);
    Reflect.defineMetadata(COLUMN_KEY, columns, target);
  };
}

function PrimaryKey(target: any, propertyKey: string) {
  Reflect.defineMetadata(PRIMARY_KEY, propertyKey, target);
}

function Relation(options: RelationOptions) {
  return function(target: any, propertyKey: string) {
    const relations = Reflect.getMetadata(RELATION_KEY, target) || [];
    relations.push({ property: propertyKey, ...options });
    Reflect.defineMetadata(RELATION_KEY, relations, target);
  };
}

function inferType(type: any): string {
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
  
  @Column({ nullable: false, unique: true })
  email: string;
  
  @Column({ nullable: false })
  name: string;
  
  @Relation({
    type: 'one-to-many',
    target: () => Post,
    inverseSide: 'author',
    cascade: true
  })
  posts: Post[];
}

@Entity('posts')
class Post {
  @PrimaryKey
  @Column({ type: 'INTEGER', nullable: false })
  id: number;
  
  @Column({ nullable: false })
  title: string;
  
  @Column({ type: 'TEXT' })
  content: string;
  
  @Column({ name: 'author_id', type: 'INTEGER' })
  authorId: number;
  
  @Relation({
    type: 'many-to-one',
    target: () => User
  })
  author: User;
}

// Query Builder
class QueryBuilder<T> {
  private conditions: string[] = [];
  private orderByClause: string = '';
  private limitClause: string = '';
  
  constructor(private entityClass: any) {}
  
  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }
  
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByClause = `ORDER BY ${column} ${direction}`;
    return this;
  }
  
  limit(count: number): this {
    this.limitClause = `LIMIT ${count}`;
    return this;
  }
  
  toSQL(): string {
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, this.entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, this.entityClass.prototype) || [];
    
    const columns = columnsMeta.map((col: any) => col.name).join(', ');
    let sql = `SELECT ${columns} FROM ${entityMeta.tableName}`;
    
    if (this.conditions.length > 0) {
      sql += ` WHERE ${this.conditions.join(' AND ')}`;
    }
    
    if (this.orderByClause) {
      sql += ` ${this.orderByClause}`;
    }
    
    if (this.limitClause) {
      sql += ` ${this.limitClause}`;
    }
    
    return sql + ';';
  }
}

// Repository
class Repository<T> {
  constructor(private entityClass: new () => T) {}
  
  createQueryBuilder(): QueryBuilder<T> {
    return new QueryBuilder(this.entityClass);
  }
  
  generateCreateTableSQL(): string {
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, this.entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, this.entityClass.prototype) || [];
    const primaryKey = Reflect.getMetadata(PRIMARY_KEY, this.entityClass.prototype);
    
    const columnDefs = columnsMeta.map((col: any) => {
      let def = `${col.name} ${col.type}`;
      
      if (col.property === primaryKey) {
        def += ' PRIMARY KEY';
      }
      
      if (!col.nullable) {
        def += ' NOT NULL';
      }
      
      if (col.unique && col.property !== primaryKey) {
        def += ' UNIQUE';
      }
      
      if (col.default !== undefined) {
        def += ` DEFAULT ${col.default}`;
      }
      
      return def;
    });
    
    return `CREATE TABLE ${entityMeta.tableName} (\n  ${columnDefs.join(',\n  ')}\n);`;
  }
  
  generateInsertSQL(instance: T): string {
    const entityMeta = Reflect.getMetadata(ENTITY_KEY, this.entityClass);
    const columnsMeta = Reflect.getMetadata(COLUMN_KEY, this.entityClass.prototype) || [];
    
    const columns: string[] = [];
    const values: any[] = [];
    
    for (const col of columnsMeta) {
      const value = (instance as any)[col.property];
      
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
const userRepo = new Repository(User);

console.log(userRepo.generateCreateTableSQL());
// CREATE TABLE users (
//   id INTEGER PRIMARY KEY NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE,
//   name VARCHAR(255) NOT NULL
// );

const query = userRepo
  .createQueryBuilder()
  .where('email LIKE "%@example.com"')
  .orderBy('name', 'ASC')
  .limit(10)
  .toSQL();

console.log(query);
// SELECT id, email, name FROM users WHERE email LIKE "%@example.com" ORDER BY name ASC LIMIT 10;

const user = new User();
user.id = 1;
user.email = 'alice@example.com';
user.name = 'Alice';

console.log(userRepo.generateInsertSQL(user));
// INSERT INTO users (id, email, name) VALUES (1, 'alice@example.com', 'Alice');
```

## 🎯 Validation Framework Completo

```typescript
import 'reflect-metadata';

const VALIDATION_KEY = Symbol('validation');

// Validation rule
interface ValidationRule {
  validator: (value: any, object: any) => boolean | Promise<boolean>;
  message: string | ((value: any, object: any) => string);
  async?: boolean;
}

// Helper para adicionar regras
function addValidationRule(target: any, propertyKey: string, rule: ValidationRule) {
  const rules = Reflect.getMetadata(VALIDATION_KEY, target, propertyKey) || [];
  rules.push(rule);
  Reflect.defineMetadata(VALIDATION_KEY, rules, target, propertyKey);
}

// Decorators básicos
function IsString(target: any, propertyKey: string) {
  addValidationRule(target, propertyKey, {
    validator: (value) => typeof value === 'string',
    message: `${propertyKey} must be a string`
  });
}

function IsEmail(target: any, propertyKey: string) {
  addValidationRule(target, propertyKey, {
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: `${propertyKey} must be a valid email`
  });
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    addValidationRule(target, propertyKey, {
      validator: (value) => typeof value === 'string' && value.length >= length,
      message: `${propertyKey} must be at least ${length} characters`
    });
  };
}

function Max(max: number) {
  return function(target: any, propertyKey: string) {
    addValidationRule(target, propertyKey, {
      validator: (value) => typeof value === 'number' && value <= max,
      message: `${propertyKey} must be at most ${max}`
    });
  };
}

// Async validator
function IsUnique(checkFn: (value: any) => Promise<boolean>) {
  return function(target: any, propertyKey: string) {
    addValidationRule(target, propertyKey, {
      validator: checkFn,
      message: `${propertyKey} must be unique`,
      async: true
    });
  };
}

// Nested validation
function ValidateNested(type: new () => any) {
  return function(target: any, propertyKey: string) {
    addValidationRule(target, propertyKey, {
      validator: async (value) => {
        if (Array.isArray(value)) {
          const results = await Promise.all(value.map(item => validate(item)));
          return results.every(r => r.length === 0);
        } else {
          const errors = await validate(value);
          return errors.length === 0;
        }
      },
      message: `${propertyKey} contains invalid nested objects`
    });
  };
}

// Custom validator
function Custom(validator: (value: any, object: any) => boolean, message: string) {
  return function(target: any, propertyKey: string) {
    addValidationRule(target, propertyKey, { validator, message });
  };
}

// Validator
async function validate(obj: any): Promise<string[]> {
  const errors: string[] = [];
  const proto = Object.getPrototypeOf(obj);
  const props = Reflect.ownKeys(obj);
  
  for (const prop of props) {
    const rules = Reflect.getMetadata(VALIDATION_KEY, proto, prop as string) || [];
    
    for (const rule of rules) {
      const value = obj[prop];
      let valid: boolean;
      
      if (rule.async) {
        valid = await rule.validator(value, obj);
      } else {
        valid = rule.validator(value, obj);
      }
      
      if (!valid) {
        const message = typeof rule.message === 'function'
          ? rule.message(value, obj)
          : rule.message;
        errors.push(message);
      }
    }
  }
  
  return errors;
}

// Exemplo de uso
class Address {
  @IsString
  @MinLength(3)
  street: string;
  
  @IsString
  city: string;
}

class CreateUserDto {
  @IsEmail
  @IsUnique(async (email) => {
    // Simular verificação no DB
    return email !== 'taken@example.com';
  })
  email: string;
  
  @IsString
  @MinLength(3)
  name: string;
  
  @Max(150)
  age: number;
  
  @ValidateNested(Address)
  address: Address;
  
  @Custom(
    (value, obj) => obj.age >= 18 ? value !== undefined : true,
    'License is required for users 18+'
  )
  driverLicense?: string;
}

// Teste
(async () => {
  const dto = new CreateUserDto();
  dto.email = 'invalid';
  dto.name = 'AB';
  dto.age = 200;
  dto.address = new Address();
  dto.address.street = 'AB';
  dto.address.city = 'NY';
  
  const errors = await validate(dto);
  console.log(errors);
  // [
  //   'email must be a valid email',
  //   'email must be unique',
  //   'name must be at least 3 characters',
  //   'age must be at most 150',
  //   'address contains invalid nested objects'
  // ]
})();
```

## 🎯 Event System com Metadata

```typescript
import 'reflect-metadata';

const EVENT_HANDLER_KEY = Symbol('event:handler');
const EVENT_EMITTER_KEY = Symbol('event:emitter');

// Event handler decorator
function OnEvent(eventName: string) {
  return function(target: any, propertyKey: string) {
    const handlers = Reflect.getMetadata(EVENT_HANDLER_KEY, target.constructor) || [];
    handlers.push({ event: eventName, method: propertyKey });
    Reflect.defineMetadata(EVENT_HANDLER_KEY, handlers, target.constructor);
  };
}

// Event emitter
class EventEmitter {
  private listeners = new Map<string, Set<(data: any) => void>>();
  private history: Array<{ event: string; data: any; timestamp: number }> = [];
  
  on(event: string, handler: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }
  
  emit(event: string, data: any): void {
    // Armazenar histórico
    this.history.push({ event, data, timestamp: Date.now() });
    
    // Notificar listeners
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of handlers) {
        handler(data);
      }
    }
  }
  
  replay(event: string): void {
    const events = this.history.filter(e => e.event === event);
    for (const e of events) {
      this.emit(e.event, e.data);
    }
  }
  
  getHistory(event?: string): any[] {
    if (event) {
      return this.history.filter(e => e.event === event);
    }
    return this.history;
  }
}

// Auto-register handlers
function registerEventHandlers(instance: any, emitter: EventEmitter): void {
  const handlers = Reflect.getMetadata(EVENT_HANDLER_KEY, instance.constructor) || [];
  
  for (const handler of handlers) {
    const method = instance[handler.method].bind(instance);
    emitter.on(handler.event, method);
  }
}

// Exemplo de uso
class UserEventHandler {
  @OnEvent('user:created')
  onUserCreated(data: { id: number; name: string }) {
    console.log('[HANDLER] User created:', data);
  }
  
  @OnEvent('user:updated')
  onUserUpdated(data: { id: number; changes: any }) {
    console.log('[HANDLER] User updated:', data);
  }
  
  @OnEvent('user:created')
  sendWelcomeEmail(data: { id: number; name: string }) {
    console.log('[EMAIL] Welcome email sent to:', data.name);
  }
}

const emitter = new EventEmitter();
const handler = new UserEventHandler();

registerEventHandlers(handler, emitter);

emitter.emit('user:created', { id: 1, name: 'Alice' });
// "[HANDLER] User created: { id: 1, name: 'Alice' }"
// "[EMAIL] Welcome email sent to: Alice"

emitter.emit('user:updated', { id: 1, changes: { name: 'Alice Smith' } });
// "[HANDLER] User updated: { id: 1, changes: { name: 'Alice Smith' } }"

console.log(emitter.getHistory('user:created'));
// [{ event: 'user:created', data: { id: 1, name: 'Alice' }, timestamp: ... }]
```

## 🎯 Plugin Architecture

```typescript
import 'reflect-metadata';

const PLUGIN_KEY = Symbol('plugin');

interface PluginMetadata {
  name: string;
  version: string;
  dependencies?: string[];
}

// Plugin decorator
function Plugin(metadata: PluginMetadata) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(PLUGIN_KEY, metadata, target);
    return target;
  };
}

// Plugin interface
interface IPlugin {
  onLoad?(): void;
  onUnload?(): void;
}

// Plugin manager
class PluginManager {
  private plugins = new Map<string, { instance: IPlugin; metadata: PluginMetadata }>();
  private loadOrder: string[] = [];
  
  register(pluginClass: new () => IPlugin): void {
    const metadata = Reflect.getMetadata(PLUGIN_KEY, pluginClass);
    
    if (!metadata) {
      throw new Error(`${pluginClass.name} is not a plugin`);
    }
    
    // Verificar dependências
    if (metadata.dependencies) {
      for (const dep of metadata.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${metadata.name} requires ${dep}`);
        }
      }
    }
    
    // Criar instância
    const instance = new pluginClass();
    
    // Armazenar
    this.plugins.set(metadata.name, { instance, metadata });
    this.loadOrder.push(metadata.name);
    
    // Lifecycle hook
    if (instance.onLoad) {
      instance.onLoad();
    }
    
    console.log(`[PLUGIN] Loaded: ${metadata.name} v${metadata.version}`);
  }
  
  unload(pluginName: string): void {
    const plugin = this.plugins.get(pluginName);
    
    if (!plugin) {
      throw new Error(`Plugin ${pluginName} not found`);
    }
    
    // Lifecycle hook
    if (plugin.instance.onUnload) {
      plugin.instance.onUnload();
    }
    
    this.plugins.delete(pluginName);
    this.loadOrder = this.loadOrder.filter(name => name !== pluginName);
    
    console.log(`[PLUGIN] Unloaded: ${pluginName}`);
  }
  
  get(pluginName: string): IPlugin | undefined {
    return this.plugins.get(pluginName)?.instance;
  }
  
  list(): PluginMetadata[] {
    return this.loadOrder.map(name => this.plugins.get(name)!.metadata);
  }
}

// Plugins
@Plugin({ name: 'logger', version: '1.0.0' })
class LoggerPlugin implements IPlugin {
  onLoad() {
    console.log('[LOGGER] Logger plugin initialized');
  }
  
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

@Plugin({
  name: 'database',
  version: '1.0.0',
  dependencies: ['logger']
})
class DatabasePlugin implements IPlugin {
  private logger?: LoggerPlugin;
  
  onLoad() {
    console.log('[DATABASE] Database plugin initialized');
  }
  
  setLogger(logger: LoggerPlugin) {
    this.logger = logger;
  }
  
  query(sql: string) {
    this.logger?.log(`Executing query: ${sql}`);
    return [];
  }
}

// Uso
const manager = new PluginManager();

manager.register(LoggerPlugin);
// "[LOGGER] Logger plugin initialized"
// "[PLUGIN] Loaded: logger v1.0.0"

manager.register(DatabasePlugin);
// "[DATABASE] Database plugin initialized"
// "[PLUGIN] Loaded: database v1.0.0"

const logger = manager.get('logger') as LoggerPlugin;
const db = manager.get('database') as DatabasePlugin;

db.setLogger(logger);
db.query('SELECT * FROM users');
// "[LOG] Executing query: SELECT * FROM users"

console.log(manager.list());
// [
//   { name: 'logger', version: '1.0.0' },
//   { name: 'database', version: '1.0.0', dependencies: ['logger'] }
// ]
```

---

**Conclusão**: Padrões avançados combinam Reflect, Metadata, Decorators para criar frameworks completos. DI containers, ORMs, validation, event systems, plugin architectures são construídos sobre essas primitivas. Frameworks como NestJS, TypeORM, class-validator implementam esses patterns.

## 📚 Próximo Arquivo

**09-guia-pratico-reflect-metadata.md** - Guia prático completo com setup, best practices, debugging, performance, exemplos reais
