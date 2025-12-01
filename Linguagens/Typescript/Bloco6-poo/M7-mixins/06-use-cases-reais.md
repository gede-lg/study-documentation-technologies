# Use Cases Reais de Mixins

## 🎯 Introdução

Mixins brilham em **cenários reais de aplicações enterprise** onde behaviors ortogonais precisam ser combinados flexivelmente. Este arquivo apresenta **use cases práticos** testados em produção: **cross-cutting concerns** (logging, caching, timestamps), **feature flags**, **plugin systems**, **ORM patterns**, **event systems**, **validation frameworks**, e **architectural patterns** para aplicações complexas.

Cada use case demonstra **problema → solução com mixins → implementação completa** com código production-ready, incluindo type safety, error handling, testing strategies, e performance considerations. Abordaremos patterns de frameworks populares (NestJS, TypeORM), libraries (class-validator), e arquiteturas customizadas para diferentes domínios (e-commerce, SaaS, gaming).

## 📋 Sumário

### Cross-cutting Concerns
- Timestamps (createdAt, updatedAt)
- Soft delete
- Audit logging
- Request tracking

### Caching & Performance
- Method result caching
- Query result caching
- Lazy loading
- Memoization

### Feature Management
- Feature flags
- A/B testing
- Progressive rollout
- Deprecation warnings

### Domain Patterns
- Entity lifecycle
- Aggregate root
- Domain events
- Validation

### Framework Integration
- NestJS providers
- TypeORM entities
- Express middleware
- React HOC pattern

### Plugin Systems
- Plugin registration
- Plugin lifecycle
- Plugin dependencies
- Plugin configuration

## 🔄 Cross-cutting Concerns

### Timestamps (createdAt, updatedAt)

**Problema**: Todas as entidades precisam rastrear criação e atualização.

```typescript
// Solução com mixin
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt: Date;
    updatedAt: Date;
    
    constructor(...args: any[]) {
      super(...args);
      const now = new Date();
      this.createdAt = now;
      this.updatedAt = now;
    }
    
    touch() {
      this.updatedAt = new Date();
    }
  };
}

// Aplicar em múltiplas entidades
class User {
  constructor(public name: string) {}
}

class Product {
  constructor(public title: string, public price: number) {}
}

class Order {
  constructor(public userId: number, public total: number) {}
}

const TimestampedUser = Timestamped(User);
const TimestampedProduct = Timestamped(Product);
const TimestampedOrder = Timestamped(Order);

// Uso
const user = new TimestampedUser('Alice');
console.log(user.createdAt); // Data de criação

setTimeout(() => {
  user.touch(); // Atualizar updatedAt
  console.log(user.updatedAt); // Data atualizada
}, 1000);
```

### Soft Delete

**Problema**: Entidades devem ser marcadas como deletadas sem remoção física.

```typescript
function SoftDeletable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    deletedAt: Date | null = null;
    
    get isDeleted(): boolean {
      return this.deletedAt !== null;
    }
    
    softDelete(): void {
      if (this.isDeleted) {
        throw new Error('Already deleted');
      }
      this.deletedAt = new Date();
    }
    
    restore(): void {
      if (!this.isDeleted) {
        throw new Error('Not deleted');
      }
      this.deletedAt = null;
    }
  };
}

// Combinar com Timestamped
const FullEntity = SoftDeletable(Timestamped(User));

const user = new FullEntity('Alice');
console.log(user.createdAt);   // ✅ de Timestamped
console.log(user.isDeleted);   // false

user.softDelete();
console.log(user.isDeleted);   // true
console.log(user.deletedAt);   // Date

user.restore();
console.log(user.isDeleted);   // false
```

### Audit Logging

**Problema**: Registrar todas as mudanças em entidades para auditoria.

```typescript
interface AuditLog {
  timestamp: Date;
  action: string;
  userId?: number;
  changes: Record<string, { old: any; new: any }>;
}

function Auditable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private auditLogs: AuditLog[] = [];
    
    protected logChange(action: string, changes: Record<string, { old: any; new: any }>, userId?: number) {
      this.auditLogs.push({
        timestamp: new Date(),
        action,
        userId,
        changes
      });
    }
    
    getAuditLogs(): ReadonlyArray<AuditLog> {
      return this.auditLogs;
    }
    
    getLastChange(): AuditLog | undefined {
      return this.auditLogs[this.auditLogs.length - 1];
    }
  };
}

// Usar com Proxy para auto-tracking
function createAuditableProxy<T extends object>(instance: T, userId?: number): T {
  return new Proxy(instance, {
    set(target: any, prop: string, value: any) {
      const oldValue = target[prop];
      
      if (oldValue !== value && 'logChange' in target) {
        target.logChange('update', {
          [prop]: { old: oldValue, new: value }
        }, userId);
      }
      
      target[prop] = value;
      return true;
    }
  });
}

// Uso
const AuditableUser = Auditable(User);
const user = createAuditableProxy(new AuditableUser('Alice'), 123);

user.name = 'Bob';

console.log(user.getAuditLogs());
// [
//   {
//     timestamp: Date,
//     action: 'update',
//     userId: 123,
//     changes: { name: { old: 'Alice', new: 'Bob' } }
//   }
// ]
```

### Request Tracking

**Problema**: Rastrear requests em sistemas distribuídos.

```typescript
interface RequestContext {
  requestId: string;
  correlationId: string;
  userId?: number;
  timestamp: Date;
}

function RequestTracked<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private requestContext?: RequestContext;
    
    setRequestContext(context: RequestContext): void {
      this.requestContext = context;
    }
    
    getRequestContext(): RequestContext | undefined {
      return this.requestContext;
    }
    
    protected logWithContext(message: string, level: 'info' | 'warn' | 'error' = 'info') {
      const ctx = this.requestContext;
      const prefix = ctx
        ? `[${ctx.requestId}] [${ctx.correlationId}]`
        : '[no-context]';
      
      console[level](`${prefix} ${message}`);
    }
  };
}

// Uso em service
class UserService {
  getUser(id: number) {
    return { id, name: 'Alice' };
  }
}

const TrackedService = RequestTracked(UserService);
const service = new TrackedService();

// Middleware define context
service.setRequestContext({
  requestId: 'req-123',
  correlationId: 'corr-456',
  userId: 789,
  timestamp: new Date()
});

// Service usa context
service.logWithContext('Fetching user'); // [req-123] [corr-456] Fetching user
const user = service.getUser(1);
```

## ⚡ Caching & Performance

### Method Result Caching

**Problema**: Cachear resultados de métodos caros.

```typescript
interface CacheOptions {
  ttl: number; // milliseconds
  maxSize: number;
}

function Cacheable<TBase extends Constructor>(options: CacheOptions) {
  return function(Base: TBase) {
    return class extends Base {
      private cache = new Map<string, { value: any; expiry: number }>();
      
      protected memoize<T>(key: string, fn: () => T): T {
        const cached = this.cache.get(key);
        
        if (cached && cached.expiry > Date.now()) {
          console.log(`Cache HIT: ${key}`);
          return cached.value;
        }
        
        console.log(`Cache MISS: ${key}`);
        const value = fn();
        
        this.cache.set(key, {
          value,
          expiry: Date.now() + options.ttl
        });
        
        // Limitar tamanho do cache
        if (this.cache.size > options.maxSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey!);
        }
        
        return value;
      }
      
      clearCache(key?: string): void {
        if (key) {
          this.cache.delete(key);
        } else {
          this.cache.clear();
        }
      }
    };
  };
}

// Uso
class DataService {
  fetchExpensiveData(id: number): string {
    console.log('Expensive operation...');
    return `Data for ${id}`;
  }
}

const CachedService = Cacheable({ ttl: 5000, maxSize: 100 })(DataService);
const service = new CachedService();

// Wrapper manual ou decorator
class MyService extends CachedService {
  getCachedData(id: number) {
    return this.memoize(`data-${id}`, () => this.fetchExpensiveData(id));
  }
}

const myService = new MyService();
myService.getCachedData(1); // Cache MISS, Expensive operation...
myService.getCachedData(1); // Cache HIT
```

### Lazy Loading

**Problema**: Inicializar recursos caros apenas quando necessário.

```typescript
function LazyLoadable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private lazyResources = new Map<string, any>();
    
    protected getLazy<T>(key: string, initializer: () => T): T {
      if (!this.lazyResources.has(key)) {
        console.log(`Lazy-loading: ${key}`);
        this.lazyResources.set(key, initializer());
      }
      return this.lazyResources.get(key);
    }
  };
}

// Uso
class DatabaseService {
  // Recurso caro
  private createConnection() {
    console.log('Creating expensive DB connection...');
    return { query: (sql: string) => `Result of: ${sql}` };
  }
}

const LazyDB = LazyLoadable(DatabaseService);

class MyDB extends LazyDB {
  get connection() {
    return this.getLazy('connection', () => this.createConnection());
  }
  
  query(sql: string) {
    return this.connection.query(sql);
  }
}

const db = new MyDB();
console.log('DB instance created'); // Nenhum log de connection ainda
db.query('SELECT *'); // Lazy-loading: connection, Creating expensive DB connection...
db.query('SELECT * FROM users'); // Reutiliza connection existente
```

## 🎚️ Feature Management

### Feature Flags

**Problema**: Habilitar/desabilitar features em runtime.

```typescript
interface FeatureFlags {
  [featureName: string]: boolean;
}

function FeatureToggleable<TBase extends Constructor>(
  initialFlags: FeatureFlags
) {
  return function(Base: TBase) {
    return class extends Base {
      private features: FeatureFlags = { ...initialFlags };
      
      enableFeature(name: string): void {
        this.features[name] = true;
      }
      
      disableFeature(name: string): void {
        this.features[name] = false;
      }
      
      isFeatureEnabled(name: string): boolean {
        return this.features[name] ?? false;
      }
      
      protected requireFeature(name: string): void {
        if (!this.isFeatureEnabled(name)) {
          throw new Error(`Feature "${name}" is disabled`);
        }
      }
    };
  };
}

// Uso
class PaymentService {
  processPayment(amount: number) {
    return `Processing $${amount}`;
  }
}

const FeaturePayment = FeatureToggleable({
  'paypal': true,
  'stripe': false,
  'crypto': false
})(PaymentService);

class MyPayment extends FeaturePayment {
  payWithPaypal(amount: number) {
    this.requireFeature('paypal');
    return this.processPayment(amount);
  }
  
  payWithStripe(amount: number) {
    this.requireFeature('stripe');
    return this.processPayment(amount);
  }
}

const payment = new MyPayment();
payment.payWithPaypal(100); // ✅ OK
payment.payWithStripe(100); // ❌ Error: Feature "stripe" is disabled

payment.enableFeature('stripe');
payment.payWithStripe(100); // ✅ OK agora
```

### A/B Testing

**Problema**: Testar variantes de features.

```typescript
type Variant = 'A' | 'B';

function ABTestable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private variant: Variant = 'A';
    private experiments = new Map<string, { variant: Variant; startDate: Date }>();
    
    setVariant(experimentName: string, variant: Variant): void {
      this.variant = variant;
      this.experiments.set(experimentName, {
        variant,
        startDate: new Date()
      });
    }
    
    getVariant(experimentName: string): Variant {
      return this.experiments.get(experimentName)?.variant || 'A';
    }
    
    protected runExperiment<T>(
      experimentName: string,
      variantA: () => T,
      variantB: () => T
    ): T {
      const variant = this.getVariant(experimentName);
      return variant === 'A' ? variantA() : variantB();
    }
  };
}

// Uso
class RecommendationService {
  baseRecommendations(): string[] {
    return ['Item 1', 'Item 2', 'Item 3'];
  }
}

const ABRecommendations = ABTestable(RecommendationService);

class MyRecommendations extends ABRecommendations {
  getRecommendations(): string[] {
    return this.runExperiment(
      'recommendation-algorithm',
      () => {
        // Variant A: algoritmo simples
        return this.baseRecommendations();
      },
      () => {
        // Variant B: algoritmo avançado
        return [...this.baseRecommendations(), 'ML Item 1', 'ML Item 2'];
      }
    );
  }
}

const service = new MyRecommendations();

// User 1 (variant A)
service.setVariant('recommendation-algorithm', 'A');
console.log(service.getRecommendations()); // ['Item 1', 'Item 2', 'Item 3']

// User 2 (variant B)
service.setVariant('recommendation-algorithm', 'B');
console.log(service.getRecommendations()); // ['Item 1', 'Item 2', 'Item 3', 'ML Item 1', 'ML Item 2']
```

## 🏗️ Domain Patterns

### Entity Lifecycle

**Problema**: Gerenciar estados de entidade (draft, active, archived).

```typescript
enum EntityState {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

function Stateful<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _state: EntityState = EntityState.DRAFT;
    
    get state(): EntityState {
      return this._state;
    }
    
    publish(): void {
      if (this._state !== EntityState.DRAFT) {
        throw new Error('Can only publish draft entities');
      }
      this._state = EntityState.ACTIVE;
    }
    
    archive(): void {
      if (this._state !== EntityState.ACTIVE) {
        throw new Error('Can only archive active entities');
      }
      this._state = EntityState.ARCHIVED;
    }
    
    unarchive(): void {
      if (this._state !== EntityState.ARCHIVED) {
        throw new Error('Can only unarchive archived entities');
      }
      this._state = EntityState.ACTIVE;
    }
  };
}

// Uso
class BlogPost {
  constructor(public title: string, public content: string) {}
}

const StatefulPost = Stateful(BlogPost);
const post = new StatefulPost('My Post', 'Content here');

console.log(post.state); // 'draft'
post.publish();
console.log(post.state); // 'active'
post.archive();
console.log(post.state); // 'archived'
```

### Domain Events

**Problema**: Emitir eventos de domínio para reações descentralizadas.

```typescript
interface DomainEvent {
  type: string;
  timestamp: Date;
  payload: any;
}

function EventEmitter<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private events: DomainEvent[] = [];
    private listeners = new Map<string, Array<(event: DomainEvent) => void>>();
    
    protected raise(type: string, payload: any): void {
      const event: DomainEvent = {
        type,
        timestamp: new Date(),
        payload
      };
      
      this.events.push(event);
      
      // Notificar listeners
      const handlers = this.listeners.get(type) || [];
      handlers.forEach(handler => handler(event));
    }
    
    on(eventType: string, handler: (event: DomainEvent) => void): void {
      if (!this.listeners.has(eventType)) {
        this.listeners.set(eventType, []);
      }
      this.listeners.get(eventType)!.push(handler);
    }
    
    getEvents(): ReadonlyArray<DomainEvent> {
      return this.events;
    }
    
    clearEvents(): void {
      this.events = [];
    }
  };
}

// Uso
class Order {
  constructor(public id: number, public total: number) {}
}

const EventOrder = EventEmitter(Order);

class MyOrder extends EventOrder {
  place() {
    // Lógica de negócio
    console.log('Order placed');
    
    // Emitir evento
    this.raise('OrderPlaced', { orderId: this.id, total: this.total });
  }
  
  cancel() {
    console.log('Order cancelled');
    this.raise('OrderCancelled', { orderId: this.id });
  }
}

const order = new MyOrder(1, 100);

// Registrar listeners
order.on('OrderPlaced', (event) => {
  console.log('Send confirmation email', event.payload);
});

order.on('OrderPlaced', (event) => {
  console.log('Update inventory', event.payload);
});

order.place();
// Order placed
// Send confirmation email { orderId: 1, total: 100 }
// Update inventory { orderId: 1, total: 100 }

console.log(order.getEvents());
// [{ type: 'OrderPlaced', timestamp: Date, payload: {...} }]
```

## 🔌 Plugin Systems

### Plugin Architecture

**Problema**: Sistema extensível via plugins.

```typescript
interface PluginMetadata {
  name: string;
  version: string;
  dependencies: string[];
}

type Plugin<TBase extends Constructor> = {
  metadata: PluginMetadata;
  mixin: (base: TBase) => any;
};

class PluginRegistry {
  private plugins = new Map<string, Plugin<any>>();
  
  register<TBase extends Constructor>(plugin: Plugin<TBase>): void {
    // Validar dependências
    for (const dep of plugin.metadata.dependencies) {
      if (!this.plugins.has(dep)) {
        throw new Error(
          `Plugin "${plugin.metadata.name}" requires "${dep}"`
        );
      }
    }
    
    this.plugins.set(plugin.metadata.name, plugin);
    console.log(`Registered plugin: ${plugin.metadata.name} v${plugin.metadata.version}`);
  }
  
  apply<TBase extends Constructor>(Base: TBase, pluginNames: string[]): any {
    let result = Base;
    
    for (const name of pluginNames) {
      const plugin = this.plugins.get(name);
      
      if (!plugin) {
        throw new Error(`Plugin "${name}" not found`);
      }
      
      result = plugin.mixin(result);
    }
    
    return result;
  }
  
  getPlugin(name: string): Plugin<any> | undefined {
    return this.plugins.get(name);
  }
}

// Criar plugins
const timestampPlugin: Plugin<any> = {
  metadata: {
    name: 'timestamp',
    version: '1.0.0',
    dependencies: []
  },
  mixin: Timestamped
};

const auditPlugin: Plugin<any> = {
  metadata: {
    name: 'audit',
    version: '1.0.0',
    dependencies: ['timestamp'] // requer timestamp
  },
  mixin: Auditable
};

// Uso
const registry = new PluginRegistry();
registry.register(timestampPlugin);
registry.register(auditPlugin);

const EnhancedUser = registry.apply(User, ['timestamp', 'audit']);
const user = new EnhancedUser('Alice');

console.log(user.createdAt);      // de timestamp plugin
console.log(user.getAuditLogs()); // de audit plugin
```

---

**Conclusão**: Mixins são ideais para **cross-cutting concerns** (timestamps, soft delete, audit), **caching**, **feature flags**, **domain patterns** (entity lifecycle, events), e **plugin systems**. Use mixins quando behavior precisa ser **compartilhado horizontalmente** entre classes sem hierarquia comum.
