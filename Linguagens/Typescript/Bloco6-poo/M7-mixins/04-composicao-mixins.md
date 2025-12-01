# Composição com Mixins

## 🎯 Introdução

**Composição com mixins** é a arte de **combinar múltiplos behaviors independentes** para criar classes ricas em funcionalidades sem hierarquias rígidas de herança. Este arquivo explora **estratégias de composição**, **ordem de aplicação**, **conflict resolution**, **composability patterns**, e **architectural patterns** para construir sistemas modulares, flexíveis e manuteníveis usando mixins.

A composição efetiva de mixins vai além de simplesmente empilhar mixins. Envolve entender **dependências entre mixins**, **precedência de métodos**, **state sharing**, **lifecycle coordination**, e **architectural patterns** (layer composition, feature toggles, plugin systems). Examinaremos como compor mixins de forma **declarativa**, **type-safe**, e **performática**, além de patterns avançados como **mixin pipelines**, **conditional composition**, e **dynamic composition**.

## 📋 Sumário

### Fundamentos de Composição
- Single mixin application
- Sequential composition
- Nested composition
- Flat composition strategies

### Ordem e Precedência
- Application order
- Method resolution order (MRO)
- Property shadowing
- Conflict resolution

### Composability Patterns
- Composable mixins
- Interface segregation
- Dependency injection
- Plugin architecture

### Composition Utilities
- applyMixins helper
- Mixin pipeline builder
- Composition validators
- Type-safe composers

### State Management
- Shared state between mixins
- State isolation
- State initialization order
- Lifecycle coordination

### Advanced Patterns
- Conditional composition
- Dynamic composition
- Lazy composition
- Mixin factories composition

## 🧠 Fundamentos de Composição

### Single Mixin Application

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin simples
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    
    getAge() {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

// Aplicação única
class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);
const user = new TimestampedUser('Alice');

console.log(user.name);      // 'Alice' (de User)
console.log(user.createdAt); // Date (de Timestamped)
console.log(user.getAge());  // número (de Timestamped)
```

### Sequential Composition

Aplicar mixins **um após o outro**, cada um estendendo o resultado anterior:

```typescript
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    
    activate() {
      this.isActive = true;
    }
    
    deactivate() {
      this.isActive = false;
    }
  };
}

function Deletable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isDeleted = false;
    
    softDelete() {
      this.isDeleted = true;
    }
    
    restore() {
      this.isDeleted = false;
    }
  };
}

// Composição sequencial (direita para esquerda)
class Entity {
  constructor(public id: number) {}
}

const Step1 = Timestamped(Entity);      // Entity + Timestamped
const Step2 = Activatable(Step1);       // Entity + Timestamped + Activatable
const Step3 = Deletable(Step2);         // Entity + Timestamped + Activatable + Deletable

const entity = new Step3(1);
entity.id;          // number (de Entity)
entity.createdAt;   // Date (de Timestamped)
entity.isActive;    // boolean (de Activatable)
entity.isDeleted;   // boolean (de Deletable)
```

### Nested Composition

Aplicar mixins **inline** em uma única expressão:

```typescript
// Composição nested (de dentro para fora)
const EnhancedEntity = Deletable(Activatable(Timestamped(Entity)));

const entity = new EnhancedEntity(1);

// Ordem de aplicação (innermost first):
// 1. Timestamped(Entity)       → Entity + createdAt
// 2. Activatable(...)          → ... + isActive, activate()
// 3. Deletable(...)            → ... + isDeleted, softDelete()
```

**Leitura da composição**:
- **Dentro → Fora**: Timestamped aplicado primeiro, depois Activatable, por último Deletable
- **Resultado**: Prototype chain `Deletable → Activatable → Timestamped → Entity`

### Flat Composition Strategies

**Evitar nesting profundo** usando utilities:

```typescript
// ❌ Difícil de ler
const Result = Mixin5(Mixin4(Mixin3(Mixin2(Mixin1(Base)))));

// ✅ Array-based composition
function applyMixins<TBase extends Constructor>(
  Base: TBase,
  mixins: Array<(base: any) => any>
): any {
  return mixins.reduce((CurrentBase, mixin) => mixin(CurrentBase), Base);
}

const Result = applyMixins(Base, [
  Mixin1,
  Mixin2,
  Mixin3,
  Mixin4,
  Mixin5
]);

// ✅ Pipeline builder (fluent API)
class MixinPipeline<TBase extends Constructor> {
  constructor(
    private base: TBase,
    private mixins: Array<(base: any) => any> = []
  ) {}
  
  with(mixin: (base: any) => any) {
    return new MixinPipeline(this.base, [...this.mixins, mixin]);
  }
  
  build() {
    return applyMixins(this.base, this.mixins);
  }
}

function compose<T extends Constructor>(base: T) {
  return new MixinPipeline(base);
}

// Uso fluente
const Result = compose(Base)
  .with(Mixin1)
  .with(Mixin2)
  .with(Mixin3)
  .with(Mixin4)
  .with(Mixin5)
  .build();
```

## 📊 Ordem e Precedência

### Application Order

A **ordem de aplicação determina precedência** em caso de conflitos:

```typescript
function MixinA<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    value = 'A';
    method() {
      return 'Method A';
    }
  };
}

function MixinB<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    value = 'B';
    method() {
      return 'Method B';
    }
  };
}

class Base {
  value = 'Base';
  method() {
    return 'Method Base';
  }
}

// Ordem 1: A depois B (B sobrescreve A)
const Result1 = MixinB(MixinA(Base));
const instance1 = new Result1();
console.log(instance1.value);   // 'B' (MixinB aplicado por último vence)
console.log(instance1.method()); // 'Method B'

// Ordem 2: B depois A (A sobrescreve B)
const Result2 = MixinA(MixinB(Base));
const instance2 = new Result2();
console.log(instance2.value);   // 'A' (MixinA aplicado por último vence)
console.log(instance2.method()); // 'Method A'
```

**Regra**: **Último aplicado vence** (most-outer mixin wins).

### Method Resolution Order (MRO)

```typescript
// Prototype chain: MixinC → MixinB → MixinA → Base → Object

function MixinA<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    method() {
      console.log('A before');
      if ('method' in Base.prototype) {
        (super as any).method();
      }
      console.log('A after');
    }
  };
}

function MixinB<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    method() {
      console.log('B before');
      super.method();
      console.log('B after');
    }
  };
}

function MixinC<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    method() {
      console.log('C before');
      super.method();
      console.log('C after');
    }
  };
}

class Base {
  method() {
    console.log('Base method');
  }
}

const Composed = MixinC(MixinB(MixinA(Base)));
const instance = new Composed();
instance.method();

// Output (MRO: C → B → A → Base):
// C before
// B before
// A before
// Base method
// A after
// B after
// C after
```

**MRO**: método procurado de **subclasse → superclasse** na cadeia.

### Property Shadowing

```typescript
function MixinA<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    value = 'A';
  };
}

function MixinB<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    value = 'B'; // shadowing: esconde 'value' de MixinA
  };
}

const Composed = MixinB(MixinA(Base));
const instance = new Composed();

console.log(instance.value); // 'B' (MixinB shadowing MixinA)

// Acessar valor shadowed (não recomendado, mas possível):
console.log(Object.getPrototypeOf(Object.getPrototypeOf(instance)).value); // 'A'
```

### Conflict Resolution

**Strategy 1: Last Wins** (padrão)

```typescript
// Não faz nada especial, último mixin sobrescreve
const Composed = MixinB(MixinA(Base)); // MixinB vence
```

**Strategy 2: Explicit Super Call** (composição)

```typescript
function LoggingMixin<TBase extends Constructor<{ save(): void }>>(Base: TBase) {
  return class extends Base {
    save() {
      console.log('Before save');
      super.save(); // compõe com implementação anterior
      console.log('After save');
    }
  };
}
```

**Strategy 3: Conditional Override** (preservar se não existir)

```typescript
function ConditionalMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      
      // Só adiciona se não existir
      if (!('value' in this)) {
        (this as any).value = 'default';
      }
    }
  };
}
```

**Strategy 4: Aliasing** (renomear para evitar conflito)

```typescript
function AliasingMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    save() {
      return 'Mixin save';
    }
    
    // Alias para método original
    originalSave() {
      return super.save ? super.save() : undefined;
    }
  };
}
```

**Strategy 5: Conflict Detection** (avisar desenvolvedor)

```typescript
function ConflictAwareMixin<TBase extends Constructor>(Base: TBase) {
  const baseKeys = Object.getOwnPropertyNames(Base.prototype);
  const mixinKeys = ['save', 'delete'];
  
  const conflicts = mixinKeys.filter(key => baseKeys.includes(key));
  
  if (conflicts.length > 0) {
    console.warn(`ConflictAwareMixin overrides: ${conflicts.join(', ')}`);
  }
  
  return class extends Base {
    save() {
      return 'Mixin save';
    }
    
    delete() {
      return 'Mixin delete';
    }
  };
}
```

## 🔧 Composability Patterns

### Composable Mixins

Mixins devem ser **independentes** (sem acoplamento) para compor livremente:

```typescript
// ✅ BOM: mixins independentes
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    activate() { this.isActive = true; }
  };
}

// Podem ser combinados em qualquer ordem
const Option1 = Activatable(Timestamped(Base));
const Option2 = Timestamped(Activatable(Base));

// ❌ RUIM: mixin acoplado (requer outro mixin)
function AgeCalculator<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    getAge() {
      // ❌ Assume que 'createdAt' existe (acoplamento a Timestamped)
      return Date.now() - (this as any).createdAt.getTime();
    }
  };
}

// ✅ MELHOR: declarar dependência explicitamente
function AgeCalculator<TBase extends Constructor<{ createdAt: Date }>>(Base: TBase) {
  return class extends Base {
    getAge() {
      return Date.now() - this.createdAt.getTime(); // type-safe
    }
  };
}
```

### Interface Segregation

Mixins devem ter **responsabilidade única** (Single Responsibility Principle):

```typescript
// ❌ RUIM: mixin fazendo muitas coisas
function GodMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Timestamping
    createdAt = new Date();
    
    // Activation
    isActive = false;
    activate() {}
    
    // Logging
    log(msg: string) {}
    
    // Validation
    validate() {}
    
    // ... 20 mais responsabilidades
  };
}

// ✅ BOM: mixins focados
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    getAge() {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    activate() { this.isActive = true; }
    deactivate() { this.isActive = false; }
  };
}

function Loggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(message: string) {
      console.log(`[${this.constructor.name}] ${message}`);
    }
  };
}

// Compor conforme necessidade
const FullyFeatured = Loggable(Activatable(Timestamped(Base)));
const Simple = Timestamped(Base);
```

### Dependency Injection

Injetar dependências via **configuration objects**:

```typescript
// Mixin que aceita dependencies
function CacheableMixin<TBase extends Constructor>(config: {
  cache: Cache;
  ttl: number;
}) {
  return function(Base: TBase) {
    return class extends Base {
      getCached<T>(key: string, fetcher: () => T): T {
        const cached = config.cache.get(key);
        
        if (cached && cached.expiry > Date.now()) {
          return cached.value;
        }
        
        const value = fetcher();
        config.cache.set(key, {
          value,
          expiry: Date.now() + config.ttl
        });
        
        return value;
      }
    };
  };
}

interface Cache {
  get(key: string): any;
  set(key: string, value: any): void;
}

const memoryCache: Cache = {
  data: new Map(),
  get(key) { return this.data.get(key); },
  set(key, value) { this.data.set(key, value); }
};

// Uso
const CacheableUser = CacheableMixin({
  cache: memoryCache,
  ttl: 5000
})(User);
```

### Plugin Architecture

```typescript
// Plugin = Mixin + Metadata
interface PluginMetadata {
  name: string;
  version: string;
  dependencies: string[];
}

function createPlugin<TBase extends Constructor>(
  metadata: PluginMetadata,
  implementation: (base: TBase) => any
) {
  const plugin = implementation;
  (plugin as any).__metadata = metadata;
  return plugin;
}

// Criar plugins
const TimestampPlugin = createPlugin(
  { name: 'Timestamp', version: '1.0.0', dependencies: [] },
  <TBase extends Constructor>(Base: TBase) => {
    return class extends Base {
      createdAt = new Date();
    };
  }
);

const AgePlugin = createPlugin(
  { name: 'Age', version: '1.0.0', dependencies: ['Timestamp'] },
  <TBase extends Constructor<{ createdAt: Date }>>(Base: TBase) => {
    return class extends Base {
      getAge() {
        return Date.now() - this.createdAt.getTime();
      }
    };
  }
);

// Plugin manager
class PluginManager {
  private plugins: Map<string, any> = new Map();
  
  register(plugin: any) {
    const metadata = plugin.__metadata as PluginMetadata;
    
    // Validar dependências
    for (const dep of metadata.dependencies) {
      if (!this.plugins.has(dep)) {
        throw new Error(`Plugin ${metadata.name} requires ${dep}`);
      }
    }
    
    this.plugins.set(metadata.name, plugin);
  }
  
  apply<TBase extends Constructor>(Base: TBase): any {
    let result = Base;
    
    // Aplicar plugins em ordem de dependência
    for (const [name, plugin] of this.plugins) {
      result = plugin(result);
    }
    
    return result;
  }
}

// Uso
const manager = new PluginManager();
manager.register(TimestampPlugin);
manager.register(AgePlugin);

const EnhancedUser = manager.apply(User);
```

## 🛠️ Composition Utilities

### applyMixins Helper

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;
type Mixin<TBase extends Constructor> = (base: TBase) => any;

function applyMixins<TBase extends Constructor>(
  Base: TBase,
  mixins: Mixin<any>[]
): any {
  return mixins.reduce(
    (CurrentBase, mixin) => mixin(CurrentBase),
    Base as any
  );
}

// Uso
const Enhanced = applyMixins(User, [
  Timestamped,
  Activatable,
  Deletable
]);
```

### Mixin Pipeline Builder

```typescript
class MixinPipeline<TBase extends Constructor> {
  constructor(
    private base: TBase,
    private appliedMixins: Mixin<any>[] = []
  ) {}
  
  with(mixin: Mixin<any>): MixinPipeline<any> {
    return new MixinPipeline(this.base, [...this.appliedMixins, mixin]);
  }
  
  when(condition: boolean, mixin: Mixin<any>): MixinPipeline<any> {
    if (condition) {
      return this.with(mixin);
    }
    return this;
  }
  
  build(): any {
    return applyMixins(this.base, this.appliedMixins);
  }
}

function compose<T extends Constructor>(base: T) {
  return new MixinPipeline(base);
}

// Uso
const isProduction = process.env.NODE_ENV === 'production';

const Enhanced = compose(User)
  .with(Timestamped)
  .with(Activatable)
  .when(!isProduction, LoggableMixin({ level: 'debug' }))
  .build();
```

### Composition Validators

```typescript
// Validar que composição é válida
function validateComposition<TBase extends Constructor>(
  Base: TBase,
  mixins: Mixin<any>[]
): void {
  const appliedNames = new Set<string>();
  
  for (const mixin of mixins) {
    const name = mixin.name || 'AnonymousMixin';
    
    if (appliedNames.has(name)) {
      console.warn(`Mixin ${name} applied multiple times`);
    }
    
    appliedNames.add(name);
  }
}

function safeApplyMixins<TBase extends Constructor>(
  Base: TBase,
  mixins: Mixin<any>[]
): any {
  validateComposition(Base, mixins);
  return applyMixins(Base, mixins);
}
```

### Type-safe Composers

```typescript
// Composer com type constraints
function composeTyped<
  TBase extends Constructor,
  M1 extends Mixin<TBase>,
  M2 extends Mixin<ReturnType<M1>>,
  M3 extends Mixin<ReturnType<M2>>
>(
  base: TBase,
  m1: M1,
  m2: M2,
  m3: M3
): ReturnType<M3> {
  return m3(m2(m1(base)));
}

// Uso type-safe
const result = composeTyped(
  User,
  Timestamped,      // OK: aceita User
  AgeCalculator,    // OK: aceita Timestamped result ({ createdAt: Date })
  Activatable       // OK: aceita AgeCalculator result
);
```

## 🔄 State Management

### Shared State Between Mixins

```typescript
// Mixins compartilhando estado via Symbol
const STATE_SYMBOL = Symbol('SharedState');

interface SharedState {
  metadata: Map<string, any>;
}

function getSharedState(instance: any): SharedState {
  if (!instance[STATE_SYMBOL]) {
    instance[STATE_SYMBOL] = {
      metadata: new Map()
    };
  }
  return instance[STATE_SYMBOL];
}

function MixinA<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    setMetadata(key: string, value: any) {
      const state = getSharedState(this);
      state.metadata.set(key, value);
    }
  };
}

function MixinB<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    getMetadata(key: string) {
      const state = getSharedState(this);
      return state.metadata.get(key);
    }
  };
}

// Uso
const Enhanced = MixinB(MixinA(User));
const user = new Enhanced('Alice');
user.setMetadata('role', 'admin'); // MixinA
console.log(user.getMetadata('role')); // MixinB acessa mesmo state
```

### State Isolation

```typescript
// Cada mixin tem estado privado
function IsolatedMixinA<TBase extends Constructor>(Base: TBase) {
  const privateState = new WeakMap<any, { count: number }>();
  
  return class extends Base {
    incrementA() {
      const state = privateState.get(this) || { count: 0 };
      state.count++;
      privateState.set(this, state);
      return state.count;
    }
    
    getA() {
      return privateState.get(this)?.count || 0;
    }
  };
}

function IsolatedMixinB<TBase extends Constructor>(Base: TBase) {
  const privateState = new WeakMap<any, { count: number }>();
  
  return class extends Base {
    incrementB() {
      const state = privateState.get(this) || { count: 0 };
      state.count++;
      privateState.set(this, state);
      return state.count;
    }
    
    getB() {
      return privateState.get(this)?.count || 0;
    }
  };
}

// Uso
const Enhanced = IsolatedMixinB(IsolatedMixinA(User));
const user = new Enhanced('Alice');

user.incrementA(); // 1
user.incrementA(); // 2
user.incrementB(); // 1 (state isolado)

console.log(user.getA()); // 2
console.log(user.getB()); // 1
```

### Lifecycle Coordination

```typescript
// Coordenar lifecycle entre mixins
const LIFECYCLE_HOOKS = Symbol('LifecycleHooks');

interface LifecycleHooks {
  onInit: Array<() => void>;
  onDestroy: Array<() => void>;
}

function getHooks(instance: any): LifecycleHooks {
  if (!instance[LIFECYCLE_HOOKS]) {
    instance[LIFECYCLE_HOOKS] = {
      onInit: [],
      onDestroy: []
    };
  }
  return instance[LIFECYCLE_HOOKS];
}

function Lifecycle<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      
      // Executar hooks de inicialização
      const hooks = getHooks(this);
      hooks.onInit.forEach(hook => hook());
    }
    
    destroy() {
      // Executar hooks de destruição
      const hooks = getHooks(this);
      hooks.onDestroy.forEach(hook => hook());
    }
  };
}

function ResourceMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private resource?: Resource;
    
    constructor(...args: any[]) {
      super(...args);
      
      // Registrar hooks
      const hooks = getHooks(this);
      
      hooks.onInit.push(() => {
        console.log('ResourceMixin init');
        this.resource = new Resource();
      });
      
      hooks.onDestroy.push(() => {
        console.log('ResourceMixin destroy');
        this.resource?.dispose();
      });
    }
  };
}

// Lifecycle deve ser aplicado primeiro
const Enhanced = ResourceMixin(Lifecycle(User));
const user = new Enhanced('Alice'); // logs: ResourceMixin init
user.destroy(); // logs: ResourceMixin destroy
```

## 🚀 Advanced Patterns

### Conditional Composition

```typescript
// Aplicar mixin condicionalmente
function conditionalMixin<TBase extends Constructor>(
  condition: boolean,
  mixin: Mixin<TBase>
) {
  return function(Base: TBase): any {
    return condition ? mixin(Base) : Base;
  };
}

// Uso
const isDevelopment = process.env.NODE_ENV === 'development';

const Enhanced = applyMixins(User, [
  Timestamped,
  conditionalMixin(isDevelopment, LoggableMixin({ level: 'debug' })),
  Activatable
]);
```

### Dynamic Composition

```typescript
// Compor mixins em runtime baseado em configuração
interface FeatureConfig {
  timestamps: boolean;
  activation: boolean;
  logging: boolean;
}

function dynamicCompose<TBase extends Constructor>(
  Base: TBase,
  config: FeatureConfig
): any {
  const mixins: Mixin<any>[] = [];
  
  if (config.timestamps) {
    mixins.push(Timestamped);
  }
  
  if (config.activation) {
    mixins.push(Activatable);
  }
  
  if (config.logging) {
    mixins.push(LoggableMixin({ level: 'info' }));
  }
  
  return applyMixins(Base, mixins);
}

// Uso
const MinimalUser = dynamicCompose(User, {
  timestamps: false,
  activation: false,
  logging: false
});

const FullFeaturedUser = dynamicCompose(User, {
  timestamps: true,
  activation: true,
  logging: true
});
```

### Lazy Composition

```typescript
// Lazy-load mixins
function lazyMixin<TBase extends Constructor>(
  loader: () => Promise<Mixin<TBase>>
) {
  return async function(Base: TBase): Promise<any> {
    const mixin = await loader();
    return mixin(Base);
  };
}

// Uso
async function createEnhancedUser() {
  const Enhanced = await lazyMixin(() => import('./heavy-mixin').then(m => m.HeavyMixin))(User);
  return Enhanced;
}
```

---

**Conclusão**: Composição efetiva de mixins requer entender **ordem de aplicação**, **conflict resolution**, **state management**, e **lifecycle coordination**. Use **composition utilities** (applyMixins, pipeline builder), **validate compositions**, e aplique **architectural patterns** (plugins, feature toggles) para criar sistemas modulares e manuteníveis.
