# Mixins - Patterns Avançados

## 🎯 Introdução

**Patterns avançados de mixins** expandem o conceito básico de composição de comportamento para cenários sofisticados que exigem **type safety rigoroso, controle fino de composição, e integração com recursos avançados do TypeScript**. Estes patterns evoluíram da prática de usar mixins em aplicações reais de larga escala, onde necessidades como generic constraints complexos, conditional application, branded types, decorator integration, e mixin factories parametrizados se tornaram essenciais para manter código robusto, type-safe e manutenível.

Os patterns explorados transcendem a aplicação linear de mixins, abordando composição condicional baseada em tipos runtime, criação de mixin hierarchies com dependencies gerenciadas, integration com metadata systems (como decorators), construção de DSLs (Domain-Specific Languages) baseados em mixins, e técnicas de type-level programming que garantem correção em compile-time de configurações complexas de mixins. Cada pattern resolve problemas específicos encontrados em arquiteturas enterprise: desde validação de invariants de composição até otimização de performance em runtime.

Dominar estes patterns permite construir **frameworks e libraries extensíveis** onde usuários podem compor funcionalidades de forma declarativa e type-safe, criar **plugin architectures** robustas onde plugins são mixins validados em compile-time, e implementar **aspect-oriented programming** (AOP) em TypeScript através de mixins que encapsulam cross-cutting concerns com type guarantees. O objetivo é elevar mixins de simples técnica de reuso para ferramenta arquitetural sofisticada.

---

## 📋 Sumário

1. **Generic Mixin Factories**
   - Parameterized mixins
   - Configuration objects
   - Type inference from config
   - Default values handling

2. **Conditional Mixins**
   - Type-based application
   - Runtime feature detection
   - Branded types integration
   - Conditional type constraints

3. **Mixin Dependencies**
   - Required base capabilities
   - Dependency injection
   - Composition validation
   - Dependency graph resolution

4. **Branded Type Mixins**
   - Nominal typing via mixins
   - Type branding patterns
   - Compile-time validation
   - Smart constructors

5. **Mixin Composition Utilities**
   - applyMixins helper
   - Mixin pipeline builder
   - Type-safe composition
   - Conflict resolution strategies

6. **Metadata-aware Mixins**
   - Decorator integration
   - Reflect metadata
   - Runtime type information
   - Validation mixins

7. **Performance Patterns**
   - Lazy initialization
   - Memoization
   - Prototype optimization
   - Tree shaking considerations

---

## 🧠 Fundamentos

### Generic Mixin Factories

**Parameterized mixins** aceitam configuração e retornam mixin customizado:

```typescript
// Tipo base para constructor
type Constructor<T = {}> = new (...args: any[]) => T;

// Mixin factory com parâmetros
function Cacheable<TBase extends Constructor>(options: {
  ttl: number; // time to live em ms
  maxSize: number;
}) {
  return function (Base: TBase) {
    return class extends Base {
      private cache = new Map<string, { value: any; expiry: number }>();
      
      getCached<T>(key: string, fetcher: () => T): T {
        const cached = this.cache.get(key);
        
        if (cached && cached.expiry > Date.now()) {
          return cached.value;
        }
        
        const value = fetcher();
        this.cache.set(key, {
          value,
          expiry: Date.now() + options.ttl
        });
        
        // Limpa cache se exceder maxSize
        if (this.cache.size > options.maxSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        
        return value;
      }
    };
  };
}

// Uso com configuração
class DataService {}

const CacheableService = Cacheable({ ttl: 5000, maxSize: 100 })(DataService);
const service = new CacheableService();

const data = service.getCached('users', () => fetchUsers());
```

**Configuration Objects com Type Inference**:

```typescript
// Config com tipos complexos
interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  prefix?: string;
  timestamp?: boolean;
}

function Loggable<TBase extends Constructor>(config: LoggerConfig) {
  return function (Base: TBase) {
    return class extends Base {
      log(message: string, level: LoggerConfig['level'] = 'info') {
        if (this.shouldLog(level, config.level)) {
          const prefix = config.prefix ? `[${config.prefix}] ` : '';
          const timestamp = config.timestamp ? `${new Date().toISOString()} ` : '';
          console.log(`${timestamp}${prefix}${message}`);
        }
      }
      
      private shouldLog(
        messageLevel: LoggerConfig['level'],
        configLevel: LoggerConfig['level']
      ): boolean {
        const levels = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(messageLevel) >= levels.indexOf(configLevel);
      }
    };
  };
}

// Type inference do config
const UserService = Loggable({
  level: 'info',
  prefix: 'UserService',
  timestamp: true
})(class {});

const service = new UserService();
service.log('User created', 'info'); // [2025-11-20T10:00:00Z] [UserService] User created
```

**Default Values Handling**:

```typescript
// Config com defaults via Partial + Required
interface PaginationConfig {
  pageSize: number;
  maxPage: number;
  startPage: number;
}

const defaultPaginationConfig: PaginationConfig = {
  pageSize: 10,
  maxPage: 100,
  startPage: 1
};

function Paginatable<TBase extends Constructor>(
  config: Partial<PaginationConfig> = {}
) {
  const finalConfig = { ...defaultPaginationConfig, ...config };
  
  return function (Base: TBase) {
    return class extends Base {
      private currentPage = finalConfig.startPage;
      
      nextPage() {
        if (this.currentPage < finalConfig.maxPage) {
          this.currentPage++;
        }
      }
      
      getPageSize() {
        return finalConfig.pageSize;
      }
    };
  };
}

// Uso com defaults
const ServiceWithDefaults = Paginatable()(class {});
const ServiceCustom = Paginatable({ pageSize: 20 })(class {});
```

### Conditional Mixins

**Type-based Application** (aplicar mixin apenas se tipo satisfaz condição):

```typescript
// Helper type para checar se tipo tem propriedade
type HasProperty<T, K extends string> = K extends keyof T ? true : false;

// Mixin condicional baseado em tipo
function IdentifiableMixin<
  TBase extends Constructor,
  T = InstanceType<TBase>
>(Base: TBase) {
  type Result = T extends { id: any }
    ? TBase & Constructor<{ identify(): string }>
    : TBase;
  
  return (T extends { id: any }
    ? class extends Base {
        identify() {
          return `ID: ${(this as any).id}`;
        }
      }
    : Base) as Result;
}

// ✅ Mixin aplicado (tem 'id')
class User {
  constructor(public id: number, public name: string) {}
}
const IdentifiableUser = IdentifiableMixin(User);
const user = new IdentifiableUser(1, 'Alice');
user.identify(); // "ID: 1"

// ✅ Mixin NÃO aplicado (sem 'id')
class Product {
  constructor(public name: string) {}
}
const IdentifiableProduct = IdentifiableMixin(Product);
const product = new IdentifiableProduct('Book');
// product.identify(); // ❌ método não existe (correto)
```

**Runtime Feature Detection**:

```typescript
// Aplicar mixin apenas se feature disponível em runtime
function StorageMixin<TBase extends Constructor>(Base: TBase) {
  const hasLocalStorage = typeof localStorage !== 'undefined';
  
  if (!hasLocalStorage) {
    // Retorna base inalterada se localStorage não disponível
    return Base;
  }
  
  return class extends Base {
    save(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    
    load<T>(key: string): T | null {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  };
}

// Funciona em browser, não adiciona métodos em Node.js
```

**Branded Types Integration**:

```typescript
// Brand para garantir validação
type Brand<K, T> = K & { __brand: T };
type ValidatedEmail = Brand<string, 'Email'>;

// Mixin que requer branded type
function EmailableMixin<TBase extends Constructor<{ email: ValidatedEmail }>>(
  Base: TBase
) {
  return class extends Base {
    sendEmail(subject: string, body: string) {
      // email garantidamente validado (branded type)
      console.log(`Sending to ${this.email}: ${subject}`);
    }
  };
}

// Função para criar branded email
function validateEmail(email: string): ValidatedEmail {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email');
  }
  return email as ValidatedEmail;
}

// Uso
class User {
  constructor(public email: ValidatedEmail) {}
}

const EmailableUser = EmailableMixin(User);
const user = new EmailableUser(validateEmail('alice@example.com'));
user.sendEmail('Hello', 'World'); // OK, email validado
```

### Mixin Dependencies

**Required Base Capabilities** (mixin que depende de outro mixin):

```typescript
// Mixin base: Timestamped
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
  };
}

// Mixin dependente: AgeCalculator (requer Timestamped)
function AgeCalculator<
  TBase extends Constructor<{ createdAt: Date }>
>(Base: TBase) {
  return class extends Base {
    getAge() {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

// ✅ Uso correto (Timestamped aplicado primeiro)
class Entity {}
const TimestampedEntity = Timestamped(Entity);
const AgedEntity = AgeCalculator(TimestampedEntity);

const entity = new AgedEntity();
console.log(entity.getAge()); // OK

// ❌ ERRO: sem Timestamped primeiro
const BrokenEntity = AgeCalculator(Entity);
// Type 'typeof Entity' does not satisfy constraint 'Constructor<{ createdAt: Date }>'
```

**Dependency Injection Pattern**:

```typescript
// Mixin que injeta dependências
function Injectable<TBase extends Constructor, TDeps>(
  dependencies: TDeps
) {
  return function (Base: TBase) {
    return class extends Base {
      protected deps = dependencies;
      
      getDependency<K extends keyof TDeps>(key: K): TDeps[K] {
        return this.deps[key];
      }
    };
  };
}

// Definindo dependências
interface AppDeps {
  logger: { log(msg: string): void };
  cache: { get(key: string): any };
}

const deps: AppDeps = {
  logger: { log: (msg) => console.log(msg) },
  cache: { get: (key) => null }
};

// Aplicando
class Service {}
const InjectableService = Injectable(deps)(Service);

const service = new InjectableService();
service.getDependency('logger').log('Hello'); // type-safe!
```

**Composition Validation** (garantir ordem correta):

```typescript
// Símbolo para marcar mixin aplicado
const TIMESTAMPED_BRAND = Symbol('Timestamped');

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    [TIMESTAMPED_BRAND] = true;
    createdAt = new Date();
  };
}

// Validar que Timestamped foi aplicado
function AgeCalculator<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    getAge() {
      // Runtime check
      if (!(TIMESTAMPED_BRAND in this)) {
        throw new Error('AgeCalculator requires Timestamped mixin');
      }
      return Date.now() - (this as any).createdAt.getTime();
    }
  };
}
```

### Branded Type Mixins

**Nominal Typing via Mixins**:

```typescript
// Brand symbol
const VALIDATED_USER_BRAND = Symbol('ValidatedUser');

// Mixin que adiciona brand
function ValidatedUser<TBase extends Constructor<{
  name: string;
  email: string;
}>>(Base: TBase) {
  return class extends Base {
    [VALIDATED_USER_BRAND] = true as const;
    
    constructor(...args: any[]) {
      super(...args);
      this.validate();
    }
    
    private validate() {
      if (!this.name || this.name.length === 0) {
        throw new Error('Name is required');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        throw new Error('Invalid email');
      }
    }
  };
}

// Type guard para branded type
function isValidatedUser(obj: any): obj is InstanceType<ReturnType<typeof ValidatedUser>> {
  return obj && VALIDATED_USER_BRAND in obj;
}

// Função que aceita apenas validated users
function processUser(user: InstanceType<ReturnType<typeof ValidatedUser>>) {
  // user garantidamente validado
  console.log(`Processing ${user.name}`);
}

// Uso
class User {
  constructor(public name: string, public email: string) {}
}

const ValidUser = ValidatedUser(User);
const user = new ValidUser('Alice', 'alice@example.com'); // valida no constructor

if (isValidatedUser(user)) {
  processUser(user); // OK
}
```

**Smart Constructors com Mixins**:

```typescript
// Mixin que torna constructor privado e expõe factory
function SmartConstructor<TBase extends Constructor>(
  validator: (instance: InstanceType<TBase>) => boolean
) {
  return function (Base: TBase) {
    return class extends Base {
      private constructor(...args: any[]) {
        super(...args);
      }
      
      static create(...args: any[]): InstanceType<typeof Base> | null {
        const instance = new (Base as any)(...args);
        if (validator(instance)) {
          return instance;
        }
        return null;
      }
    };
  };
}

// Uso
class User {
  constructor(public age: number) {}
}

const ValidUser = SmartConstructor<typeof User>(
  (user) => user.age >= 18
)(User);

const adult = ValidUser.create(25); // OK
const minor = ValidUser.create(15); // null (validação falhou)
```

### Mixin Composition Utilities

**applyMixins Helper** (aplicar múltiplos mixins de uma vez):

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;
type Mixin<TBase extends Constructor> = (Base: TBase) => any;

// Utility para aplicar array de mixins
function applyMixins<TBase extends Constructor>(
  Base: TBase,
  mixins: Mixin<any>[]
): any {
  return mixins.reduce((CurrentBase, mixin) => mixin(CurrentBase), Base);
}

// Uso
class User {
  constructor(public name: string) {}
}

const mixins = [
  Timestamped,
  Activatable,
  Loggable({ level: 'info' })
];

const EnhancedUser = applyMixins(User, mixins);
const user = new EnhancedUser('Alice');
// user tem name, createdAt, isActive, activate(), log()
```

**Mixin Pipeline Builder** (fluent API):

```typescript
class MixinBuilder<TBase extends Constructor> {
  constructor(private base: TBase, private mixins: Mixin<any>[] = []) {}
  
  with<M extends Mixin<any>>(mixin: M): MixinBuilder<TBase> {
    return new MixinBuilder(this.base, [...this.mixins, mixin]);
  }
  
  build(): any {
    return applyMixins(this.base, this.mixins);
  }
}

function mixinBuilder<T extends Constructor>(base: T) {
  return new MixinBuilder(base);
}

// Uso fluente
const EnhancedUser = mixinBuilder(User)
  .with(Timestamped)
  .with(Activatable)
  .with(Loggable({ level: 'info' }))
  .build();
```

**Type-safe Composition** (garantir compatibilidade):

```typescript
// Composição que valida compatibilidade de tipos
function composeMixins<
  TBase extends Constructor,
  M1 extends Mixin<TBase>,
  M2 extends Mixin<ReturnType<M1>>
>(base: TBase, mixin1: M1, mixin2: M2): ReturnType<M2> {
  return mixin2(mixin1(base));
}

// Uso
const result = composeMixins(
  User,
  Timestamped,      // M1
  AgeCalculator     // M2 (requer resultado de M1)
);
// Type-safe: AgeCalculator requer { createdAt: Date }
```

### Metadata-aware Mixins

**Decorator Integration**:

```typescript
// Mixin que lê metadata de decorators
function ValidationMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    validate(): boolean {
      const metadata = Reflect.getMetadata('validation', this.constructor);
      
      if (!metadata) return true;
      
      for (const [key, validators] of Object.entries(metadata)) {
        const value = (this as any)[key];
        for (const validator of validators as any[]) {
          if (!validator(value)) {
            throw new Error(`Validation failed for ${key}`);
          }
        }
      }
      
      return true;
    }
  };
}

// Decorator que adiciona metadata
function MinLength(length: number) {
  return function (target: any, propertyKey: string) {
    const existingMetadata = Reflect.getMetadata('validation', target.constructor) || {};
    const validators = existingMetadata[propertyKey] || [];
    validators.push((value: string) => value.length >= length);
    existingMetadata[propertyKey] = validators;
    Reflect.defineMetadata('validation', existingMetadata, target.constructor);
  };
}

// Uso combinado
class User {
  @MinLength(3)
  name: string = '';
}

const ValidatableUser = ValidationMixin(User);
const user = new ValidatableUser();
user.name = 'Al'; // 2 chars
user.validate(); // ❌ Error: Validation failed for name
```

### Performance Patterns

**Lazy Initialization**:

```typescript
function LazyLoggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _logger?: Logger;
    
    protected get logger(): Logger {
      if (!this._logger) {
        this._logger = new Logger(); // criado apenas quando acessado
      }
      return this._logger;
    }
    
    log(message: string) {
      this.logger.log(message);
    }
  };
}
```

**Memoization**:

```typescript
function Memoized<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private memoCache = new Map<string, any>();
    
    protected memoize<T>(key: string, fn: () => T): T {
      if (this.memoCache.has(key)) {
        return this.memoCache.get(key);
      }
      const result = fn();
      this.memoCache.set(key, result);
      return result;
    }
  };
}

class Calculator {
  expensiveCalculation(n: number): number {
    // cálculo caro
    return n * n;
  }
}

const MemoizedCalculator = Memoized(Calculator);
const calc = new MemoizedCalculator();
const result = (calc as any).memoize('calc_5', () => calc.expensiveCalculation(5));
```

---

## 🔍 Análise

**Generic Factories**:
- ✅ Flexibilidade via configuração
- ✅ Type inference excelente
- ❌ Sintaxe verbosa (factory retornando mixin)

**Conditional Mixins**:
- ✅ Type safety forte
- ✅ Evita runtime errors
- ❌ Complexidade de tipos

**Dependencies**:
- ✅ Garante ordem correta
- ✅ Compile-time validation
- ❌ Acoplamento entre mixins

**Branded Types**:
- ✅ Nominal typing
- ✅ Validation enforcement
- ❌ Verbose, requer guards

**Utilities**:
- ✅ DRY, reutilizável
- ✅ Fluent API friendly
- ❌ Type inference pode degradar

---

## 🎯 Aplicabilidade

**Generic Factories**: configurações complexas (cache, logging)
**Conditional Mixins**: feature flags, polyfills
**Dependencies**: frameworks com layers (data → business → presentation)
**Branded Types**: domain primitives críticos (Money, Email, UserId)
**Utilities**: libraries que fornecem muitos mixins

---

## ⚠️ Limitações

1. **Type complexity**: composições profundas confundem IDE
2. **Runtime overhead**: cada mixin adiciona layer
3. **Debugging**: stack traces complexos
4. **Bundle size**: mixins aumentam código gerado

---

## 🔗 Interconexões

**M7-01 - Conceito Mixins**: base para patterns avançados
**Bloco 4 - Generics**: constraints e type parameters
**Bloco 9 - Tipos Avançados**: conditional types, mapped types
**M2 - Decorators**: integração metadata

---

## 🚀 Evolução

**TypeScript 5.0+**: Decorators Stage 3 podem complementar mixins
**Effect Systems**: tracked side effects em mixins
**Tooling**: IDEs melhorando autocomplete para composições

**Recomendação 2025**:
- Usar generic factories para configuração complexa
- Aplicar conditional mixins para feature detection
- Implementar validation via branded types
- Limitar profundidade de composição (≤5 mixins)
