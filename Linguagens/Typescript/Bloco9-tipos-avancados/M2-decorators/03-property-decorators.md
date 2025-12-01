# Property Decorators

## 🎯 Introdução e Definição

### Definição Conceitual

**Property decorators** são funções aplicadas a **declarações de propriedades** de classe usando sintaxe `@decorator`. Diferentemente de class decorators que operam em nível de classe, property decorators focam em **propriedades individuais** - modificando, anotando, ou interceptando acesso a propriedades específicas. Executam **uma vez** quando classe é **declarada**, recebendo **target** (prototype ou constructor) e **propertyKey** como parâmetros.

Conceitualmente, property decorator é função com assinatura `(target: any, propertyKey: string) => void`. **Não retorna valor** (diferente de method decorators que retornam descriptor). Não recebe **PropertyDescriptor** (diferente de method/accessor decorators). Propósito principal é **anexar metadata** via Reflect API ou **configurar property descriptor** manualmente via `Object.defineProperty`.

**Fundamento teórico:** Property decorators implementam **metaprogramming em nível de propriedade**. Permitem **validation**, **transformation**, **observation**, e **metadata attachment** declarativamente. Ideal para frameworks ORM (marcar colunas), validação (anexar regras), e reactive programming (observables). TypeScript não fornece descriptor automaticamente - decorator deve usar `Object.defineProperty` para modificar comportamento.

**Pattern básico:**
```
class MyClass {
  @decorator
  property: string;
}

// Decorator recebe (target, "property")
```

**Importante:** Property decorator **não pode modificar valor inicial** - apenas configurar como propriedade é acessada/modificada posteriormente.

### Contexto Histórico e Evolução

**Java 5 (2004):** Field annotations.

```java
// Java - field annotations
public class User {
    @Column(name = "user_name")
    private String name;
    
    @NotNull
    @Email
    private String email;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
}
```

**C# 2.0 (2005):** Attributes em fields.

```csharp
// C# - field attributes
public class User {
    [Column("user_name")]
    public string Name { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [DataType(DataType.DateTime)]
    public DateTime CreatedAt { get; set; }
}
```

**Python 2.6 (2008):** Property decorators.

```python
# Python - property decorators
class User:
    @property
    def name(self):
        return self._name
    
    @name.setter
    def name(self, value):
        if not value:
            raise ValueError("Name required")
        self._name = value
```

**TypeScript 1.5 (2015):** Property decorators experimentais.

```typescript
// TypeScript 1.5 - property decorators
function readonly(target: any, propertyKey: string) {
  // Metadata ou Object.defineProperty
}

class User {
  @readonly
  name: string;
}
```

**MobX (2015):** Observable properties via decorators.

```typescript
// MobX - observable decorators
class TodoStore {
  @observable todos: Todo[] = [];
  @observable filter: string = "all";
  
  @computed get filteredTodos() {
    // ...
  }
}
```

**TypeORM (2016):** Column decorators para ORM.

```typescript
// TypeORM - column decorators
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
```

**class-validator (2016):** Validation decorators.

```typescript
// class-validator - validation decorators
class User {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsInt()
  @Min(18)
  @Max(120)
  age: number;
}
```

**Angular (2016):** Input/Output decorators.

```typescript
// Angular - property decorators
@Component({ ... })
export class UserComponent {
  @Input() user: User;
  @Output() userUpdated = new EventEmitter<User>();
  
  @ViewChild('nameInput') nameInput: ElementRef;
}
```

**NestJS (2017):** Injection decorators.

```typescript
// NestJS - injection via property decorators
@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  
  @Inject('CONFIG')
  private config: ConfigService;
}
```

**TypeScript 5.0 (2023):** Suporte para decorators Stage 3.

```typescript
// TypeScript 5.0 - novos property decorators
class MyClass {
  @tracked
  property: string;
}
```

**Evolução de padrões:**

**Era manual (pré-decorators):**
```typescript
class User {
  name: string;
}

// Configurar manualmente após declaração
Object.defineProperty(User.prototype, 'name', {
  writable: false
});
```

**Era decorators experimentais:**
```typescript
class User {
  @readonly
  name: string;
}
```

**Era decorators Stage 3:**
```typescript
class User {
  @readonly
  accessor name: string;  // Novo accessor syntax
}
```

### Problema Fundamental que Resolve

Property decorators resolvem problemas de **validation**, **metadata attachment**, **observation**, e **access control**.

**Problema 1: Validation boilerplate**
```typescript
// Sem decorator - validation manual
class User {
  private _email: string;
  
  get email(): string {
    return this._email;
  }
  
  set email(value: string) {
    if (!value.includes('@')) {
      throw new Error('Invalid email');
    }
    this._email = value;
  }
}

// Repetir para cada propriedade validada ❌
```

**Solução: Decorator para validation**
```typescript
// Com decorator - validation declarativa
function Email(target: any, propertyKey: string) {
  let value: string;
  
  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: string) {
      if (!newValue.includes('@')) {
        throw new Error('Invalid email');
      }
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class User {
  @Email
  email: string;
}

const user = new User();
user.email = "test@example.com";  // ✓ OK
// user.email = "invalid";  // ✗ Error

// Validation via decorator ✅
```

**Problema 2: Metadata separado de propriedades**
```typescript
// Sem decorator - metadata externo
class User {
  id: number;
  name: string;
  email: string;
}

// Metadata de colunas separado
const columnMetadata = new Map();
columnMetadata.set('id', { type: 'integer', primaryKey: true });
columnMetadata.set('name', { type: 'varchar', length: 100 });
columnMetadata.set('email', { type: 'varchar', unique: true });

// Metadata longe da declaração ❌
```

**Solução: Decorator anexa metadata**
```typescript
// Com decorator - metadata junto com propriedade
import "reflect-metadata";

const columnMetadataKey = Symbol("column");

function Column(options: any) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(columnMetadataKey, options, target, propertyKey);
  };
}

class User {
  @Column({ type: 'integer', primaryKey: true })
  id: number;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;
  
  @Column({ type: 'varchar', unique: true })
  email: string;
}

// Ler metadata
const emailMetadata = Reflect.getMetadata(columnMetadataKey, User.prototype, 'email');
console.log(emailMetadata);  // { type: 'varchar', unique: true }

// Metadata declarado junto com propriedade ✅
```

**Problema 3: Observable properties manual**
```typescript
// Sem decorator - observable manual
class Store {
  private _count = 0;
  private listeners: Function[] = [];
  
  get count(): number {
    return this._count;
  }
  
  set count(value: number) {
    this._count = value;
    this.listeners.forEach(fn => fn(value));
  }
  
  subscribe(fn: Function) {
    this.listeners.push(fn);
  }
}

// Repetir para cada propriedade observável ❌
```

**Solução: Decorator para observable**
```typescript
// Com decorator - observable declarativo
function Observable(target: any, propertyKey: string) {
  const listeners = new Map<any, Function[]>();
  let value: any;
  
  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: any) {
      const oldValue = value;
      value = newValue;
      
      const instanceListeners = listeners.get(this) || [];
      instanceListeners.forEach(fn => fn(newValue, oldValue));
    },
    enumerable: true,
    configurable: true
  });
  
  // Adicionar método subscribe
  const subscribeMethod = `subscribe${propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1)}`;
  target[subscribeMethod] = function(fn: Function) {
    if (!listeners.has(this)) {
      listeners.set(this, []);
    }
    listeners.get(this)!.push(fn);
  };
}

class Store {
  @Observable
  count: number = 0;
}

const store = new Store();
(store as any).subscribeCount((newValue: number, oldValue: number) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

store.count = 5;  // Count changed from 0 to 5
store.count = 10; // Count changed from 5 to 10

// Observable via decorator ✅
```

**Problema 4: Readonly properties repetitivas**
```typescript
// Sem decorator - readonly manual
class Config {
  private _apiUrl: string;
  
  constructor(apiUrl: string) {
    this._apiUrl = apiUrl;
    Object.defineProperty(this, 'apiUrl', {
      value: this._apiUrl,
      writable: false
    });
  }
  
  get apiUrl(): string {
    return this._apiUrl;
  }
}

// Boilerplate para cada readonly property ❌
```

**Solução: Decorator para readonly**
```typescript
// Com decorator - readonly declarativo
function Readonly(target: any, propertyKey: string) {
  let value: any;
  
  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: any) {
      if (value !== undefined) {
        throw new Error(`Cannot modify readonly property: ${propertyKey}`);
      }
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class Config {
  @Readonly
  apiUrl: string;
  
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
}

const config = new Config("https://api.example.com");
console.log(config.apiUrl);  // "https://api.example.com"
// config.apiUrl = "https://malicious.com";  // Error: Cannot modify readonly property

// Readonly via decorator ✅
```

**Fundamento teórico:** Property decorators promovem **declarative property configuration** - anexar comportamento/metadata a propriedades sem boilerplate.

### Importância no Ecossistema

Property decorators são cruciais porque:

- **Validation:** Validação declarativa de propriedades
- **ORM Mapping:** Mapear propriedades para colunas (TypeORM)
- **Metadata:** Anexar metadata para reflection
- **Observability:** Criar propriedades observáveis (MobX)
- **Dependency Injection:** Marcar propriedades para injeção
- **Serialization:** Configurar serialização/desserialização
- **Access Control:** Readonly, private, etc
- **Framework Integration:** Angular Input/Output, NestJS injection

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **No Return Value:** Property decorator não retorna valor
2. **No Descriptor:** Não recebe PropertyDescriptor automaticamente
3. **Metadata Attachment:** Principal uso é anexar metadata
4. **Object.defineProperty:** Modificar comportamento via defineProperty
5. **Design-time Execution:** Executa quando classe declarada

### Pilares Fundamentais

- **Signature:** `(target: any, propertyKey: string) => void`
- **Target:** Prototype (instance properties) ou constructor (static properties)
- **PropertyKey:** Nome da propriedade como string
- **Metadata:** Reflect.defineMetadata para anexar metadata
- **Descriptor Config:** Object.defineProperty para modificar acesso

### Visão Geral das Nuances

- **Instance vs Static:** Target difere para propriedades de instância vs estáticas
- **Initialization:** Decorator não pode modificar valor inicial
- **Getter/Setter:** Usar Object.defineProperty para interceptar acesso
- **Multiple Decorators:** Executam bottom-to-top
- **Reflect Metadata:** Requer `reflect-metadata` e `emitDecoratorMetadata: true`

## 🧠 Fundamentos Teóricos

### Basic Property Decorator

```typescript
// Property decorator básico

function logProperty(target: any, propertyKey: string) {
  console.log(`Property ${propertyKey} decorated`);
  console.log("Target:", target);
}

class User {
  @logProperty
  name: string;
  
  @logProperty
  email: string;
}

// Output:
// Property name decorated
// Target: User {}
// Property email decorated
// Target: User {}
```

**Análise:** Decorator executado **uma vez** para cada propriedade quando classe **declarada**.

### Validation Decorator

```typescript
// Decorator para validação

function MinLength(min: number) {
  return function(target: any, propertyKey: string) {
    let value: string;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: string) {
        if (newValue.length < min) {
          throw new Error(`${propertyKey} must be at least ${min} characters`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @MinLength(3)
  username: string;
}

const user = new User();
user.username = "Alice";  // ✓ OK (5 characters)
// user.username = "Al";  // ✗ Error (2 characters)
```

**Validation:** Decorator intercepta **setter** para validar valor.

### Metadata Attachment

```typescript
// Decorator para anexar metadata

import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function Required(target: any, propertyKey: string) {
  Reflect.defineMetadata(requiredMetadataKey, true, target, propertyKey);
}

class User {
  @Required
  name: string;
  
  @Required
  email: string;
  
  age?: number;
}

// Validar objeto usando metadata
function validate(obj: any): boolean {
  const properties = Object.keys(obj.constructor.prototype);
  
  for (const prop of properties) {
    const isRequired = Reflect.getMetadata(requiredMetadataKey, obj, prop);
    if (isRequired && !obj[prop]) {
      console.log(`${prop} is required`);
      return false;
    }
  }
  
  return true;
}

const user = new User();
user.name = "Alice";
// user.email não definido

validate(user);  // Output: email is required
```

**Metadata:** Decorator anexa **metadata** via Reflect API.

### Princípios e Conceitos Subjacentes

#### Readonly Decorator

```typescript
// Decorator para propriedade readonly

function Readonly(target: any, propertyKey: string) {
  let value: any;
  let hasBeenSet = false;
  
  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: any) {
      if (hasBeenSet) {
        console.warn(`Cannot reassign readonly property: ${propertyKey}`);
        return;
      }
      value = newValue;
      hasBeenSet = true;
    },
    enumerable: true,
    configurable: true
  });
}

class Config {
  @Readonly
  apiUrl: string;
  
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
}

const config = new Config("https://api.example.com");
console.log(config.apiUrl);  // "https://api.example.com"

config.apiUrl = "https://other.com";
// Warning: Cannot reassign readonly property: apiUrl

console.log(config.apiUrl);  // "https://api.example.com" (não modificado)
```

**Readonly:** Permitir **set inicial**, bloquear **reassignments**.

#### Format Decorator

```typescript
// Decorator para formatar valor

function Uppercase(target: any, propertyKey: string) {
  let value: string;
  
  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: string) {
      value = newValue.toUpperCase();
    },
    enumerable: true,
    configurable: true
  });
}

class User {
  @Uppercase
  username: string;
}

const user = new User();
user.username = "alice";
console.log(user.username);  // "ALICE"

user.username = "bob";
console.log(user.username);  // "BOB"
```

**Format:** Decorator **transforma** valor automaticamente.

### Default Value Decorator

```typescript
// Decorator para valor padrão

function Default(defaultValue: any) {
  return function(target: any, propertyKey: string) {
    let value: any = defaultValue;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: any) {
        value = newValue !== undefined ? newValue : defaultValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class User {
  @Default("Guest")
  name: string;
  
  @Default(0)
  age: number;
}

const user = new User();
console.log(user.name);  // "Guest"
console.log(user.age);   // 0

user.name = "Alice";
console.log(user.name);  // "Alice"
```

**Default:** Decorator define **valor padrão** se não fornecido.

#### Range Validation

```typescript
// Decorator para validação de range

function Range(min: number, max: number) {
  return function(target: any, propertyKey: string) {
    let value: number;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: number) {
        if (newValue < min || newValue > max) {
          throw new Error(`${propertyKey} must be between ${min} and ${max}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class Product {
  @Range(0, 100)
  discount: number;
  
  @Range(1, 1000)
  quantity: number;
}

const product = new Product();
product.discount = 20;   // ✓ OK
product.quantity = 500;  // ✓ OK

// product.discount = 150;  // ✗ Error (>100)
// product.quantity = 0;    // ✗ Error (<1)
```

**Range:** Decorator valida **range numérico**.

### Lazy Initialization

```typescript
// Decorator para lazy initialization

function Lazy(initializer: () => any) {
  return function(target: any, propertyKey: string) {
    let value: any;
    let initialized = false;
    
    Object.defineProperty(target, propertyKey, {
      get() {
        if (!initialized) {
          value = initializer();
          initialized = true;
          console.log(`Lazy initialized: ${propertyKey}`);
        }
        return value;
      },
      set(newValue: any) {
        value = newValue;
        initialized = true;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class DataService {
  @Lazy(() => {
    console.log("Creating expensive connection...");
    return { connected: true };
  })
  connection: any;
}

const service = new DataService();
console.log("Service created");

// Acessar connection pela primeira vez
console.log(service.connection);
// Output:
// Service created
// Creating expensive connection...
// Lazy initialized: connection
// { connected: true }

// Acessos subsequentes não reinicializam
console.log(service.connection);
// { connected: true }
```

**Lazy:** Decorator implementa **lazy initialization** - inicializar apenas quando acessado.

#### Change Tracking

```typescript
// Decorator para tracking de mudanças

const changeTracking = new WeakMap<any, Map<string, any[]>>();

function Track(target: any, propertyKey: string) {
  let value: any;
  
  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: any) {
      if (!changeTracking.has(this)) {
        changeTracking.set(this, new Map());
      }
      
      const instanceChanges = changeTracking.get(this)!;
      if (!instanceChanges.has(propertyKey)) {
        instanceChanges.set(propertyKey, []);
      }
      
      instanceChanges.get(propertyKey)!.push({
        from: value,
        to: newValue,
        timestamp: new Date()
      });
      
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class User {
  @Track
  name: string;
  
  @Track
  email: string;
}

const user = new User();
user.name = "Alice";
user.name = "Bob";
user.email = "bob@example.com";

const changes = changeTracking.get(user);
console.log(changes?.get('name'));
// [
//   { from: undefined, to: 'Alice', timestamp: Date },
//   { from: 'Alice', to: 'Bob', timestamp: Date }
// ]
```

**Tracking:** Decorator rastreia **histórico de mudanças**.

### Modelo Mental para Compreensão

Pense em property decorator como **sensor instalado em porta**:

**Propriedade:** Porta de entrada
**Decorator:** Sensor de movimento
**Get:** Detectar quando alguém entra
**Set:** Detectar quando alguém sai

Sensor **observa** e **registra** atividade sem ser a porta.

**Analogia - Termostato em Sala:**

**Propriedade:** Temperatura da sala
**Decorator:** Termostato
**Set:** Quando temperatura muda, termostato valida/ajusta
**Metadata:** Configurações do termostato (min/max temperatura)

**Metáfora - Filtro de Água:**

**Propriedade:** Torneira
**Decorator:** Filtro instalado
**Set:** Água passa por filtro antes de chegar
**Get:** Retornar água filtrada

**Fluxo de execução:**
```
1. TypeScript encontra @decorator em propriedade
2. Chama decorator(target, propertyKey)
3. Decorator usa Object.defineProperty para configurar get/set
4. Quando propriedade acessada, get/set customizado executam
5. Decorator pode validar, transformar, ou logar
```

**Exemplo visual:**
```
class User {
  @MinLength(3)
  @Uppercase
  username: string;
}

Execução (bottom-to-top):
1. Uppercase configura get/set (transforma para uppercase)
2. MinLength configura get/set (valida min length)

Quando user.username = "alice":
1. MinLength.set valida length (5 >= 3) ✓
2. Uppercase.set transforma para "ALICE"
3. Valor armazenado: "ALICE"
```

## 🔍 Análise Conceitual Profunda

### Multiple Property Decorators

```typescript
// Múltiplos decorators em propriedade

function first(target: any, propertyKey: string) {
  console.log("first decorator:", propertyKey);
}

function second(target: any, propertyKey: string) {
  console.log("second decorator:", propertyKey);
}

class MyClass {
  @first
  @second
  property: string;
}

// Output:
// second decorator: property
// first decorator: property

// Ordem: bottom-to-top
```

**Order:** Decorators executam **bottom-to-top**.

#### Instance vs Static Properties

```typescript
// Decorators em propriedades de instância vs estáticas

function logTarget(target: any, propertyKey: string) {
  console.log("Target:", target);
  console.log("Property:", propertyKey);
}

class MyClass {
  @logTarget
  instanceProperty: string;
  
  @logTarget
  static staticProperty: string;
}

// Output:
// Target: MyClass {} (prototype - instance property)
// Property: instanceProperty
// Target: class MyClass { ... } (constructor - static property)
// Property: staticProperty
```

**Target:** **Prototype** para instance properties, **constructor** para static properties.

### Combining Validation Decorators

```typescript
// Combinar múltiplos decorators de validação

import "reflect-metadata";

const validatorsMetadataKey = Symbol("validators");

interface Validator {
  validate: (value: any) => boolean;
  message: string;
}

function addValidator(validator: Validator) {
  return function(target: any, propertyKey: string) {
    const validators = Reflect.getMetadata(validatorsMetadataKey, target, propertyKey) || [];
    validators.push(validator);
    Reflect.defineMetadata(validatorsMetadataKey, validators, target, propertyKey);
  };
}

function MinLength(min: number) {
  return addValidator({
    validate: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters`
  });
}

function MaxLength(max: number) {
  return addValidator({
    validate: (value: string) => value.length <= max,
    message: `Must be at most ${max} characters`
  });
}

function Email() {
  return addValidator({
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Must be valid email"
  });
}

class User {
  @MinLength(3)
  @MaxLength(50)
  username: string;
  
  @Email()
  email: string;
}

// Validar objeto
function validateObject(obj: any): boolean {
  const properties = Object.keys(obj);
  
  for (const prop of properties) {
    const validators: Validator[] = Reflect.getMetadata(validatorsMetadataKey, obj, prop) || [];
    
    for (const validator of validators) {
      if (!validator.validate(obj[prop])) {
        console.log(`${prop}: ${validator.message}`);
        return false;
      }
    }
  }
  
  return true;
}

const user = new User();
user.username = "Alice";
user.email = "alice@example.com";

console.log(validateObject(user));  // true

user.username = "Al";  // Too short
console.log(validateObject(user));  // username: Must be at least 3 characters
```

**Composition:** Múltiplos decorators **compõem validação complexa**.

#### Serialization Decorator

```typescript
// Decorator para configurar serialização

import "reflect-metadata";

const serializeMetadataKey = Symbol("serialize");

function Serialize(options?: { name?: string; exclude?: boolean }) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(serializeMetadataKey, options || {}, target, propertyKey);
  };
}

class User {
  @Serialize()
  id: number;
  
  @Serialize({ name: 'user_name' })
  name: string;
  
  @Serialize({ exclude: true })
  password: string;
  
  email: string;  // Não decorado - não serializado
}

function serialize(obj: any): any {
  const result: any = {};
  const properties = Object.keys(obj);
  
  for (const prop of properties) {
    const metadata = Reflect.getMetadata(serializeMetadataKey, obj, prop);
    
    if (metadata) {
      if (metadata.exclude) continue;
      
      const serializedName = metadata.name || prop;
      result[serializedName] = obj[prop];
    }
  }
  
  return result;
}

const user = new User();
user.id = 1;
user.name = "Alice";
user.password = "secret123";
user.email = "alice@example.com";

console.log(serialize(user));
// { id: 1, user_name: 'Alice' }
// (password excluído, email não serializado, name renomeado)
```

**Serialization:** Decorator configura **serialização customizada**.

### Dependency Injection

```typescript
// Decorator para dependency injection

import "reflect-metadata";

const injectMetadataKey = Symbol("inject");

function Inject(token: any) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(injectMetadataKey, token, target, propertyKey);
  };
}

class Database {
  connect() {
    console.log("Database connected");
  }
}

class Logger {
  log(message: string) {
    console.log("LOG:", message);
  }
}

class UserService {
  @Inject(Database)
  db: Database;
  
  @Inject(Logger)
  logger: Logger;
  
  getUsers() {
    this.db.connect();
    this.logger.log("Fetching users");
    return [];
  }
}

// Container simplificado
class Container {
  private instances = new Map<any, any>();
  
  register<T>(token: { new(): T }) {
    this.instances.set(token, new token());
  }
  
  resolve<T>(constructor: { new(): T }): T {
    const instance = new constructor();
    const properties = Object.keys(constructor.prototype);
    
    for (const prop of properties) {
      const token = Reflect.getMetadata(injectMetadataKey, instance, prop);
      if (token) {
        (instance as any)[prop] = this.instances.get(token);
      }
    }
    
    return instance;
  }
}

const container = new Container();
container.register(Database);
container.register(Logger);

const service = container.resolve(UserService);
service.getUsers();
// Database connected
// LOG: Fetching users
```

**DI:** Decorator marca propriedades para **dependency injection**.

## 🎯 Aplicabilidade e Contextos

### ORM Column Mapping

```typescript
@Column({ type: 'varchar' })
name: string;
```

**Raciocínio:** Mapear propriedade para coluna de database.

### Validation Rules

```typescript
@MinLength(3)
@Email()
email: string;
```

**Raciocínio:** Validação declarativa de propriedades.

### Observable Properties

```typescript
@Observable
count: number;
```

**Raciocínio:** Criar propriedades observáveis para reactive programming.

## ⚠️ Limitações e Considerações Teóricas

### No Initial Value Access

```typescript
// Decorator não pode acessar valor inicial
@decorator
property: string = "initial";  // Decorator não vê "initial"
```

**Limitação:** Decorator executado **antes** de valor inicial atribuído.

### Performance Overhead

```typescript
// Get/set customizados adicionam overhead
@decorator
property: string;
```

**Consideração:** Acesso a propriedade mais lento que acesso direto.

### Type Safety

```typescript
// TypeScript não infere tipos de decorators
@decorator
property: string;

// property pode não ter tipo correto após decorator
```

**Consideração:** Tipos podem se perder com decorators.

## 🔗 Interconexões Conceituais

**Relação com Validation:** Implementa validação declarativa.

**Relação com ORM:** TypeORM usa para mapear colunas.

**Relação com Observability:** MobX usa para observables.

**Relação com DI:** NestJS usa para injeção de dependências.

**Relação com Metadata:** Reflect API anexa metadata.

## 🚀 Evolução e Próximos Conceitos

Dominar property decorators prepara para:
- **Method Decorators:** Decorar métodos específicos
- **Parameter Decorators:** Decorar parâmetros de métodos
- **Accessor Decorators:** Decorar getters/setters
- **Decorator Factories:** Criar decorators parametrizados
- **Reflect Metadata:** Metadata avançado para reflection
