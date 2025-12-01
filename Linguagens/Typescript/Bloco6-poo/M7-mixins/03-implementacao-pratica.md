# Implementação Prática de Mixins

## 🎯 Introdução

A **implementação prática de mixins** envolve traduzir conceitos teóricos em código **production-ready**, robusto e manutenível. Este arquivo foca em **técnicas de implementação**, **idiomas TypeScript**, **edge cases**, **error handling**, e **best practices** para criar mixins que funcionam consistentemente em aplicações reais.

Diferente de conceitos abstratos, a implementação prática lida com **problemas concretos**: como preservar constructor signatures, lidar com propriedades privadas, garantir type safety em runtime, implementar conflict resolution, otimizar performance, e integrar mixins com tooling (bundlers, transpilers, IDEs). Abordaremos padrões testados em produção, anti-patterns comuns, e soluções para problemas frequentes.

## 📋 Sumário

### Fundamentos de Implementação
- Constructor preservation
- Property initialization order
- Method override strategies
- Static members handling

### Type Safety em Runtime
- Type guards para mixins
- Runtime validation
- Brand checking
- Instance type checking

### Error Handling
- Validation errors
- Composition errors
- Conflict detection
- Graceful degradation

### Performance
- Prototype chain optimization
- Lazy initialization
- Memory management
- Bundle size considerations

### Testing
- Unit testing mixins
- Integration testing
- Type testing
- Mock strategies

### Debugging
- Stack trace clarity
- DevTools integration
- Logging strategies
- Source maps

## 🧠 Fundamentos de Implementação

### Constructor Preservation

**Problema**: mixins frequentemente perdem constructor signature da base.

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

// ❌ ERRADO: perde signature
function BadMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Constructor sem parâmetros sobrescreve Base
    constructor() {
      super(); // ❌ Base pode precisar de argumentos!
    }
  };
}

// ✅ CORRETO: preserva signature
function GoodMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Rest parameters preservam argumentos
    constructor(...args: any[]) {
      super(...args);
    }
  };
}

// Teste
class User {
  constructor(public name: string, public age: number) {}
}

const MixedUser = GoodMixin(User);
const user = new MixedUser('Alice', 30); // ✅ funciona
```

**Constructor com inicialização customizada**:

```typescript
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp: number;
    
    constructor(...args: any[]) {
      super(...args);
      // Inicializar APÓS super()
      this.timestamp = Date.now();
    }
  };
}
```

**Typed constructor preservation**:

```typescript
// Helper para preservar tipos de constructor
type GConstructor<T = {}> = new (...args: any[]) => T;

function TypedMixin<TBase extends GConstructor<{ name: string }>>(Base: TBase) {
  return class extends Base {
    // TypeScript sabe que Base retorna { name: string }
    greet() {
      return `Hello, ${this.name}`; // type-safe
    }
  };
}
```

### Property Initialization Order

**Ordem crítica**: super() → propriedades da base → propriedades do mixin

```typescript
function OrderDemo<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // 1. Declaração (não inicializa ainda)
    mixinProp: string;
    
    constructor(...args: any[]) {
      // 2. super() PRIMEIRO (inicializa base)
      super(...args);
      
      // 3. Propriedades do mixin inicializadas APÓS super()
      this.mixinProp = 'initialized after super';
    }
  };
}
```

**Problema com property initializers**:

```typescript
function ProblematicMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // ❌ Initializer executado ANTES de super() internamente
    mixinProp = this.computeValue(); // pode acessar 'this' antes de super!
    
    private computeValue() {
      // 'this' pode estar em estado inválido
      return 'value';
    }
  };
}

// ✅ Solução: inicializar em constructor
function CorrectMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    mixinProp: string;
    
    constructor(...args: any[]) {
      super(...args);
      this.mixinProp = this.computeValue(); // OK agora
    }
    
    private computeValue() {
      return 'value';
    }
  };
}
```

### Method Override Strategies

**Strategy 1: Replace** (substituir completamente)

```typescript
function ReplaceMixin<TBase extends Constructor<{ save(): void }>>(Base: TBase) {
  return class extends Base {
    save() {
      // Substituição completa, ignora implementação da base
      console.log('Saving with new implementation');
    }
  };
}
```

**Strategy 2: Augment** (aumentar com super)

```typescript
function AugmentMixin<TBase extends Constructor<{ save(): void }>>(Base: TBase) {
  return class extends Base {
    save() {
      console.log('Before save');
      super.save(); // chama implementação original
      console.log('After save');
    }
  };
}
```

**Strategy 3: Conditional** (chamar super condicionalmente)

```typescript
function ConditionalMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    save() {
      if ('save' in Base.prototype) {
        // Chama apenas se Base tem save()
        (super as any).save();
      } else {
        console.log('No base save, implementing new');
      }
    }
  };
}
```

**Strategy 4: Compose** (combinar retornos)

```typescript
function ComposeMixin<TBase extends Constructor<{ getData(): any[] }>>(Base: TBase) {
  return class extends Base {
    getData() {
      const baseData = super.getData();
      const mixinData = ['extra1', 'extra2'];
      return [...baseData, ...mixinData]; // combina resultados
    }
  };
}
```

### Static Members Handling

**Problema**: static members não compõem naturalmente.

```typescript
// ❌ Statics em mixin não são herdados pela classe final
function BadStaticMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    static staticMethod() {
      console.log('Static');
    }
  };
}

class User {}
const MixedUser = BadStaticMixin(User);
MixedUser.staticMethod(); // ❌ ERRO: staticMethod não existe no tipo

// ✅ Solução: copiar statics manualmente
function GoodStaticMixin<TBase extends Constructor>(Base: TBase) {
  const Mixed = class extends Base {
    instanceMethod() {
      console.log('Instance');
    }
  };
  
  // Copiar static methods
  (Mixed as any).staticMethod = function() {
    console.log('Static');
  };
  
  return Mixed;
}

// ✅ Solução 2: retornar objeto com class + statics
function BestStaticMixin<TBase extends Constructor>(Base: TBase) {
  class Mixed extends Base {
    instanceMethod() {
      console.log('Instance');
    }
  }
  
  return Object.assign(Mixed, {
    staticMethod() {
      console.log('Static');
    }
  });
}

const MixedUser2 = BestStaticMixin(User);
MixedUser2.staticMethod(); // ✅ OK
```

## 🔒 Type Safety em Runtime

### Type Guards para Mixins

```typescript
// Symbol para marcar mixin aplicado
const TIMESTAMPED_SYMBOL = Symbol('Timestamped');

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    [TIMESTAMPED_SYMBOL] = true as const;
    timestamp = Date.now();
  };
}

// Type guard
function isTimestamped(obj: any): obj is InstanceType<ReturnType<typeof Timestamped>> {
  return obj && typeof obj === 'object' && TIMESTAMPED_SYMBOL in obj;
}

// Uso
class User {}
const TimestampedUser = Timestamped(User);
const user = new TimestampedUser();

if (isTimestamped(user)) {
  console.log(user.timestamp); // type-safe
}
```

### Runtime Validation

```typescript
// Validar que base tem capabilities necessárias
function ValidatingMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      
      // Runtime check
      if (!('name' in this)) {
        throw new Error('ValidatingMixin requires "name" property on base');
      }
    }
    
    greet() {
      return `Hello, ${(this as any).name}`;
    }
  };
}

// Uso
class User {
  constructor(public name: string) {}
}

const ValidUser = ValidatingMixin(User); // OK

class Product {
  constructor(public id: number) {}
}

const ValidProduct = ValidatingMixin(Product);
const product = new ValidProduct(1); // ❌ Runtime error: requires "name"
```

### Brand Checking

```typescript
// Branded type pattern
const VALIDATED_BRAND = Symbol('Validated');

type Validated<T> = T & { [VALIDATED_BRAND]: true };

function ValidatedMixin<TBase extends Constructor>(
  validator: (instance: any) => boolean
) {
  return function(Base: TBase) {
    return class extends Base {
      [VALIDATED_BRAND] = true as const;
      
      constructor(...args: any[]) {
        super(...args);
        
        if (!validator(this)) {
          throw new Error('Validation failed');
        }
      }
    } as Constructor<Validated<InstanceType<TBase>>>;
  };
}

// Type guard para validated
function isValidated<T>(obj: T): obj is Validated<T> {
  return obj && typeof obj === 'object' && VALIDATED_BRAND in obj;
}

// Função que aceita apenas validated
function processValidated<T>(obj: Validated<T>) {
  console.log('Processing validated object');
}

// Uso
class User {
  constructor(public age: number) {}
}

const ValidUser = ValidatedMixin((instance) => instance.age >= 18)(User);

const adult = new ValidUser(25);
if (isValidated(adult)) {
  processValidated(adult); // ✅ type-safe
}
```

## ⚠️ Error Handling

### Validation Errors

```typescript
// Custom error para mixins
class MixinValidationError extends Error {
  constructor(
    public mixinName: string,
    public reason: string
  ) {
    super(`${mixinName}: ${reason}`);
    this.name = 'MixinValidationError';
  }
}

function EmailableMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    sendEmail(this: { email?: string }, subject: string) {
      if (!this.email) {
        throw new MixinValidationError(
          'EmailableMixin',
          'Instance must have "email" property'
        );
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        throw new MixinValidationError(
          'EmailableMixin',
          'Invalid email format'
        );
      }
      
      console.log(`Sending email to ${this.email}: ${subject}`);
    }
  };
}
```

### Composition Errors

```typescript
// Detectar composição inválida
const MIXIN_METADATA = Symbol('MixinMetadata');

interface MixinMetadata {
  name: string;
  requires: symbol[];
}

function createMixin<TBase extends Constructor>(
  metadata: MixinMetadata,
  implementation: (Base: TBase) => any
) {
  return function(Base: TBase) {
    // Verificar dependências
    const baseMetadata = (Base as any)[MIXIN_METADATA] as MixinMetadata | undefined;
    
    for (const requirement of metadata.requires) {
      if (!baseMetadata || !baseMetadata.requires.includes(requirement)) {
        throw new Error(
          `${metadata.name} requires mixin with symbol ${String(requirement)}`
        );
      }
    }
    
    const Mixed = implementation(Base);
    (Mixed as any)[MIXIN_METADATA] = metadata;
    return Mixed;
  };
}

// Uso
const TIMESTAMPED = Symbol('Timestamped');
const AGE_CALCULATOR = Symbol('AgeCalculator');

const Timestamped = createMixin(
  { name: 'Timestamped', requires: [] },
  <TBase extends Constructor>(Base: TBase) => {
    return class extends Base {
      createdAt = new Date();
    };
  }
);

const AgeCalculator = createMixin(
  { name: 'AgeCalculator', requires: [TIMESTAMPED] },
  <TBase extends Constructor<{ createdAt: Date }>>(Base: TBase) => {
    return class extends Base {
      getAge() {
        return Date.now() - this.createdAt.getTime();
      }
    };
  }
);

// ✅ OK
class Entity {}
const ValidComposition = AgeCalculator(Timestamped(Entity));

// ❌ ERRO: missing dependency
const InvalidComposition = AgeCalculator(Entity);
// Error: AgeCalculator requires mixin with symbol Symbol(Timestamped)
```

### Conflict Detection

```typescript
// Detectar conflitos de propriedades
function detectConflicts<TBase extends Constructor>(
  Base: TBase,
  mixinName: string,
  newProperties: string[]
): void {
  const baseKeys = new Set(Object.getOwnPropertyNames(Base.prototype));
  
  const conflicts = newProperties.filter(prop => baseKeys.has(prop));
  
  if (conflicts.length > 0) {
    console.warn(
      `${mixinName} overrides properties: ${conflicts.join(', ')}`
    );
  }
}

function ConflictAwareMixin<TBase extends Constructor>(Base: TBase) {
  detectConflicts(Base, 'ConflictAwareMixin', ['save', 'delete']);
  
  return class extends Base {
    save() {
      console.log('Mixin save');
    }
    
    delete() {
      console.log('Mixin delete');
    }
  };
}
```

### Graceful Degradation

```typescript
// Degradar gracefully quando feature não disponível
function OptionalFeatureMixin<TBase extends Constructor>(Base: TBase) {
  // Feature detection
  const hasFeature = typeof window !== 'undefined' && 'localStorage' in window;
  
  if (!hasFeature) {
    console.warn('OptionalFeatureMixin: localStorage not available, using memory fallback');
    
    // Fallback implementation
    return class extends Base {
      private memoryStorage = new Map<string, any>();
      
      save(key: string, value: any) {
        this.memoryStorage.set(key, value);
      }
      
      load(key: string) {
        return this.memoryStorage.get(key);
      }
    };
  }
  
  // Full implementation
  return class extends Base {
    save(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    
    load(key: string) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
  };
}
```

## ⚡ Performance

### Prototype Chain Optimization

```typescript
// ❌ EVITAR: criar muitas camadas de prototypes
const VeryDeep = Mixin10(Mixin9(Mixin8(Mixin7(Mixin6(
  Mixin5(Mixin4(Mixin3(Mixin2(Mixin1(Base)))))
)))));

// ✅ PREFERIR: combinar mixins em um único layer
function CombinedMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Combinar funcionalidades de múltiplos mixins
    // em uma única classe estendida
    
    // De Mixin1
    feature1() {}
    
    // De Mixin2
    feature2() {}
    
    // etc.
  };
}
```

### Lazy Initialization

```typescript
function LazyMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _expensiveResource?: ExpensiveResource;
    
    // Getter lazy-loads
    protected get expensiveResource(): ExpensiveResource {
      if (!this._expensiveResource) {
        console.log('Initializing expensive resource');
        this._expensiveResource = new ExpensiveResource();
      }
      return this._expensiveResource;
    }
    
    useResource() {
      return this.expensiveResource.doWork();
    }
  };
}

class ExpensiveResource {
  doWork() {
    return 'work done';
  }
}
```

### Memory Management

```typescript
// Cleanup em mixins
function CleanupMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private listeners: Array<() => void> = [];
    
    addListener(listener: () => void) {
      this.listeners.push(listener);
    }
    
    // Cleanup method
    dispose() {
      // Cleanup de recursos do mixin
      this.listeners = [];
      
      // Chamar cleanup da base se existir
      if ('dispose' in Base.prototype) {
        (super as any).dispose();
      }
    }
  };
}

// Uso
const CleanupUser = CleanupMixin(User);
const user = new CleanupUser();
user.addListener(() => {});
user.dispose(); // libera recursos
```

### Bundle Size Considerations

```typescript
// ❌ EVITAR: código não tree-shakeable
const allMixins = {
  Timestamped,
  Activatable,
  Loggable,
  Cacheable,
  // ... 50+ mixins
};

export default allMixins; // bundler inclui TODOS os mixins

// ✅ PREFERIR: exports nomeados tree-shakeable
export { Timestamped };
export { Activatable };
export { Loggable };
// ... cada mixin separado

// Usuário importa apenas o necessário
import { Timestamped, Activatable } from './mixins';
```

## 🧪 Testing

### Unit Testing Mixins

```typescript
import { describe, it, expect } from 'vitest';

describe('Timestamped Mixin', () => {
  it('should add timestamp property', () => {
    class Base {}
    const Timestamped = TimestampedMixin(Base);
    const instance = new Timestamped();
    
    expect(instance).toHaveProperty('timestamp');
    expect(typeof instance.timestamp).toBe('number');
  });
  
  it('should preserve base class properties', () => {
    class User {
      constructor(public name: string) {}
    }
    
    const TimestampedUser = TimestampedMixin(User);
    const user = new TimestampedUser('Alice');
    
    expect(user.name).toBe('Alice');
    expect(user.timestamp).toBeDefined();
  });
  
  it('should work with multiple mixins', () => {
    class Base {}
    const Enhanced = ActivatableMixin(TimestampedMixin(Base));
    const instance = new Enhanced();
    
    expect(instance.timestamp).toBeDefined();
    expect(instance.isActive).toBe(false);
  });
});
```

### Integration Testing

```typescript
describe('Mixin Integration', () => {
  it('should compose multiple mixins correctly', () => {
    class User {
      constructor(public name: string) {}
    }
    
    const EnhancedUser = applyMixins(User, [
      Timestamped,
      Activatable,
      Loggable({ level: 'info' })
    ]);
    
    const user = new EnhancedUser('Alice');
    
    // Test all features work together
    expect(user.name).toBe('Alice');
    expect(user.timestamp).toBeDefined();
    expect(user.isActive).toBe(false);
    
    user.activate();
    expect(user.isActive).toBe(true);
    
    user.log('test');
    // (verificar output se necessário)
  });
});
```

### Type Testing

```typescript
import { expectType } from 'tsd';

// Type testing com tsd
class User {
  constructor(public name: string) {}
}

const TimestampedUser = Timestamped(User);
const user = new TimestampedUser('Alice');

// Verificar tipos em compile-time
expectType<string>(user.name);
expectType<number>(user.timestamp);

// Verificar que tipos incorretos falham
// @ts-expect-error
expectType<boolean>(user.timestamp);
```

### Mock Strategies

```typescript
// Mock para testing de mixins
function createMockMixin<T>(mockImplementation: Partial<T>) {
  return function<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
      constructor(...args: any[]) {
        super(...args);
        Object.assign(this, mockImplementation);
      }
    };
  };
}

// Uso em testes
const MockLoggable = createMockMixin({
  log: vi.fn() // mock function
});

const TestClass = MockLoggable(User);
const instance = new TestClass('Alice');

instance.log('test');
expect(instance.log).toHaveBeenCalledWith('test');
```

## 🔍 Debugging

### Stack Trace Clarity

```typescript
// ❌ Classes anônimas dificultam debugging
function BadMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base { // <anonymous>
    method() {}
  };
}

// ✅ Classes nomeadas melhoram stack traces
function GoodMixin<TBase extends Constructor>(Base: TBase) {
  return class GoodMixinClass extends Base { // nome aparece em stack
    method() {}
  };
}

// ✅ Nome dinâmico baseado na base
function BestMixin<TBase extends Constructor>(Base: TBase) {
  const mixinName = `${Base.name}WithBestMixin`;
  
  return {
    [mixinName]: class extends Base {
      method() {}
    }
  }[mixinName];
}
```

### Logging Strategies

```typescript
// Logging decorator para debugging de mixins
function debugMixin(name: string) {
  return function<TBase extends Constructor>(mixin: (base: TBase) => any) {
    return function(Base: TBase) {
      console.log(`[DEBUG] Applying mixin: ${name} to ${Base.name}`);
      const Mixed = mixin(Base);
      console.log(`[DEBUG] Result: ${Mixed.name}`);
      return Mixed;
    };
  };
}

// Uso
const Timestamped = debugMixin('Timestamped')(<TBase extends Constructor>(Base: TBase) => {
  return class extends Base {
    timestamp = Date.now();
  };
});

// Output ao aplicar:
// [DEBUG] Applying mixin: Timestamped to User
// [DEBUG] Result: class extends User
```

### DevTools Integration

```typescript
// Adicionar metadata para DevTools
function devToolsMixin<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // @ts-ignore - propriedade para DevTools
    __DEVTOOLS__ = {
      mixinName: 'DevToolsMixin',
      appliedAt: new Date().toISOString(),
      baseClass: Base.name
    };
  };
}
```

---

**Conclusão**: Implementação prática de mixins requer atenção a **constructor preservation**, **property initialization order**, **error handling robusto**, **performance optimization**, e **testability**. Use **type guards**, **runtime validation**, **graceful degradation**, e **debugging tools** para criar mixins production-ready.
