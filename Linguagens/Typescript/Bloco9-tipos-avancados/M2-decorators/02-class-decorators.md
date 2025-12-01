# Class Decorators

## 🎯 Introdução e Definição

### Definição Conceitual

**Class decorators** são funções aplicadas a **declarações de classes** usando sintaxe `@decorator`. Diferentemente de method/property decorators que modificam membros específicos, class decorators recebem **constructor da classe** como argumento e podem **modificar, substituir, ou anotar** classe inteira. Executam **uma única vez** quando classe é **declarada** (não quando instanciada).

Conceitualmente, class decorator é função com assinatura `(constructor: Function) => Function | void`. Pode **retornar novo constructor** (substituindo classe original) ou **modificar prototype existente**. TypeScript chama decorator com constructor como único parâmetro, permitindo **metaprogramming em nível de classe**.

**Fundamento teórico:** Class decorators implementam **Decorator Pattern** em nível de classe. Permitem **add-on functionality** - adicionar comportamento sem modificar código original. Diferente de herança (requer modificar classe), decorators aplicam modificações **externalmente** e **declarativamente**. Ideal para **cross-cutting concerns** (logging, validation, serialization).

**Pattern básico:**
```
@DecoratorFunction
class MyClass { }

// Equivalente a:
MyClass = DecoratorFunction(MyClass) || MyClass;
```

**Retorno:** Se decorator **retorna valor**, esse valor **substitui** classe original. Se não retorna, classe permanece inalterada (mas decorator pode ter modificado prototype).

### Contexto Histórico e Evolução

**Java 5 (2004):** Annotations em classes.

```java
// Java - class-level annotations
@Entity
@Table(name = "users")
public class User {
    private String name;
}

@Component
@Scope("singleton")
public class UserService { }
```

**Python 2.4 (2004):** Class decorators.

```python
# Python - class decorators
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class Database:
    pass
```

**C# 2.0 (2005):** Attributes em classes.

```csharp
// C# - class attributes
[Serializable]
[DataContract]
public class User {
    [DataMember]
    public string Name { get; set; }
}

[Route("api/users")]
[Authorize]
public class UsersController { }
```

**TypeScript 1.5 (2015):** Class decorators experimentais.

```typescript
// TypeScript 1.5 - class decorators
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}
```

**Angular 2 (2016):** Uso massivo de class decorators.

```typescript
// Angular - class decorators everywhere
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }

@Injectable({ providedIn: 'root' })
export class UserService { }

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

**NestJS (2017):** Decorators para injeção de dependência.

```typescript
// NestJS - class decorators para DI
@Controller('users')
export class UsersController { }

@Injectable()
export class UsersService { }

@Module({
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
```

**TypeORM (2016):** Decorators para ORM entities.

```typescript
// TypeORM - entity decorators
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
}

@Entity({ name: 'blog_posts' })
export class Post { }
```

**MobX (2015):** Decorators para observable stores.

```typescript
// MobX - observable class
@observer
class TodoList extends React.Component { }

class TodoStore {
  @observable todos = [];
}
```

**Inversify (2015):** Decorators para DI container.

```typescript
// Inversify - dependency injection
@injectable()
class Katana {
  public hit() { }
}

@injectable()
class Shuriken {
  public throw() { }
}
```

**TypeScript 5.0 (2023):** Suporte para decorators Stage 3.

```typescript
// TypeScript 5.0 - novos decorators
@sealed
class MyClass { }

// Sem experimentalDecorators
```

**Evolução de padrões:**

**Era manual (pré-decorators):**
```typescript
class MyClass { }
MyClass = sealed(MyClass) || MyClass;
```

**Era decorators experimentais:**
```typescript
@sealed
class MyClass { }
```

**Era decorators Stage 3:**
```typescript
@sealed
class MyClass { }  // API diferente internamente
```

### Problema Fundamental que Resolve

Class decorators resolvem problemas de **modificação de classe**, **metadata attachment**, e **boilerplate reduction**.

**Problema 1: Sealing class manualmente**
```typescript
// Sem decorator - sealing manual
class BankAccount {
  balance = 0;
}

Object.seal(BankAccount);
Object.seal(BankAccount.prototype);

// Repetir para cada classe ❌
```

**Solução: Decorator para sealing**
```typescript
// Com decorator - sealing declarativo
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BankAccount {
  balance = 0;
}

// Sealing via decorator ✅
```

**Problema 2: Singleton pattern boilerplate**
```typescript
// Sem decorator - singleton manual
class Database {
  private static instance: Database;
  
  private constructor() { }
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const db = Database.getInstance();

// Boilerplate em cada singleton ❌
```

**Solução: Decorator para singleton**
```typescript
// Com decorator - singleton automático
function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: T | null = null;
  
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
    }
  } as T;
}

@singleton
class Database {
  constructor() {
    console.log("Database created");
  }
}

const db1 = new Database();  // Database created
const db2 = new Database();  // Não cria novamente
console.log(db1 === db2);    // true

// Singleton via decorator ✅
```

**Problema 3: Metadata separado de classe**
```typescript
// Sem decorator - metadata externo
class User {
  name: string;
  email: string;
}

// Metadata de validação separado
const validationMetadata = new Map();
validationMetadata.set(User, {
  tableName: 'users',
  columns: ['name', 'email']
});

// Metadata longe da declaração ❌
```

**Solução: Decorator anexa metadata**
```typescript
// Com decorator - metadata junto com classe
function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    (constructor as any).tableName = tableName;
    return constructor;
  };
}

@Entity('users')
class User {
  name: string;
  email: string;
}

console.log((User as any).tableName);  // "users"

// Metadata declarado junto com classe ✅
```

**Problema 4: Logging de instanciação repetitivo**
```typescript
// Sem decorator - logging manual
class UserService {
  constructor() {
    console.log("UserService instantiated");
  }
}

class ProductService {
  constructor() {
    console.log("ProductService instantiated");
  }
}

// Repetir em cada classe ❌
```

**Solução: Decorator para logging**
```typescript
// Com decorator - logging centralizado
function logInstantiation<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      console.log(`${constructor.name} instantiated with:`, args);
      super(...args);
    }
  };
}

@logInstantiation
class UserService {
  constructor(private name: string) { }
}

@logInstantiation
class ProductService {
  constructor(private id: number) { }
}

new UserService("Alice");  // UserService instantiated with: ["Alice"]
new ProductService(123);   // ProductService instantiated with: [123]

// Logging via decorator ✅
```

**Fundamento teórico:** Class decorators promovem **declarative class enhancement** - modificar comportamento de classe declarativamente ao invés de imperativamente.

### Importância no Ecossistema

Class decorators são cruciais porque:

- **Framework Integration:** Usado em Angular, NestJS, TypeORM
- **Metadata:** Anexar metadata para reflection
- **DRY:** Evitar boilerplate em padrões comuns (singleton, sealed, etc)
- **Dependency Injection:** Marcar classes para DI containers
- **ORM:** Marcar entities e configurações
- **Validation:** Anexar regras de validação
- **Serialization:** Configurar serialização/desserialização
- **Declarative:** Código declarativo e legível

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Constructor Parameter:** Decorator recebe constructor
2. **Return Value:** Pode retornar novo constructor
3. **One-time Execution:** Executa quando classe declarada
4. **Class Enhancement:** Modificar ou anotar classe
5. **Metadata Attachment:** Anexar metadata via Reflect

### Pilares Fundamentais

- **Signature:** `(constructor: Function) => Function | void`
- **Replacement:** Retornar novo constructor substitui classe
- **Modification:** Modificar prototype/constructor existente
- **Metadata:** Anexar propriedades estáticas
- **Composition:** Múltiplos decorators compostos

### Visão Geral das Nuances

- **Generic Constraint:** `<T extends { new(...args: any[]): {} }>`
- **Return Type:** Retornar `T` preserva tipo
- **Super Call:** Constructor novo deve chamar `super()`
- **Multiple Decorators:** Executam bottom-to-top
- **Reflect Metadata:** Usar `reflect-metadata` para metadata complexo

## 🧠 Fundamentos Teóricos

### Basic Class Decorator

```typescript
// Class decorator básico

function logClass(constructor: Function) {
  console.log(`Class ${constructor.name} was decorated`);
}

@logClass
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Output: Class User was decorated

const user = new User("Alice");
```

**Análise:** Decorator executado **uma vez** quando classe **declarada**, não quando instanciada.

### Decorator Returning New Constructor

```typescript
// Decorator retornando novo constructor

function withTimestamp<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    timestamp = new Date();
    
    constructor(...args: any[]) {
      super(...args);
      console.log(`Instance created at ${this.timestamp}`);
    }
  };
}

@withTimestamp
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const user = new User("Alice");
// Instance created at [Date]

console.log(user.timestamp);  // Date object
console.log(user.name);       // "Alice"
```

**Return:** Decorator **retorna novo constructor** que estende original - adiciona `timestamp`.

### Sealed Class Decorator

```typescript
// Decorator para sealing class

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

// Tentar adicionar propriedade - falha em strict mode
(Greeter as any).newProperty = "test";  // Ignorado (sealed)
console.log((Greeter as any).newProperty);  // undefined
```

**Sealed:** `Object.seal` previne **adicionar/remover** propriedades.

### Princípios e Conceitos Subjacentes

#### Singleton Decorator

```typescript
// Decorator para singleton pattern

function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: any = null;
  
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this;
    }
  };
}

@singleton
class Database {
  connections = 0;
  
  connect() {
    this.connections++;
    console.log(`Connected. Total connections: ${this.connections}`);
  }
}

const db1 = new Database();
db1.connect();  // Connected. Total connections: 1

const db2 = new Database();
db2.connect();  // Connected. Total connections: 2

console.log(db1 === db2);  // true (mesma instância)
```

**Singleton:** Decorator garante **única instância** - retorna mesma instância sempre.

#### Logger Decorator

```typescript
// Decorator para logging de instanciação

function logInstances<T extends { new(...args: any[]): {} }>(constructor: T) {
  const instances: any[] = [];
  
  const newConstructor: any = function(...args: any[]) {
    console.log(`Creating instance of ${constructor.name}`);
    console.log("Arguments:", args);
    
    const instance = new constructor(...args);
    instances.push(instance);
    
    console.log(`Total instances: ${instances.length}`);
    return instance;
  };
  
  newConstructor.prototype = constructor.prototype;
  newConstructor.instances = instances;
  
  return newConstructor as T;
}

@logInstances
class User {
  constructor(public name: string) { }
}

const user1 = new User("Alice");
// Creating instance of User
// Arguments: ["Alice"]
// Total instances: 1

const user2 = new User("Bob");
// Creating instance of User
// Arguments: ["Bob"]
// Total instances: 2

console.log((User as any).instances);  // [User, User]
```

**Logger:** Decorator rastreia **todas instâncias** criadas.

### Entity Metadata Decorator

```typescript
// Decorator para metadata de entidade

function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    (constructor as any).tableName = tableName;
    (constructor as any).isEntity = true;
    
    return constructor;
  };
}

@Entity('users')
class User {
  id: number;
  name: string;
}

@Entity('products')
class Product {
  id: number;
  title: string;
}

console.log((User as any).tableName);    // "users"
console.log((User as any).isEntity);     // true
console.log((Product as any).tableName); // "products"
```

**Metadata:** Decorator anexa **metadata estático** à classe.

#### Validation Decorator

```typescript
// Decorator para validação de construtor

function validateConstructor<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      console.log("Validating constructor arguments...");
      
      for (const arg of args) {
        if (arg === null || arg === undefined) {
          throw new Error("Constructor arguments cannot be null or undefined");
        }
      }
      
      super(...args);
      console.log("Validation passed");
    }
  };
}

@validateConstructor
class User {
  constructor(public name: string, public email: string) { }
}

const user = new User("Alice", "alice@example.com");
// Validating constructor arguments...
// Validation passed

// const invalid = new User(null, "test");  // Error
```

**Validation:** Decorator **valida argumentos** de construtor.

### Freezing Decorator

```typescript
// Decorator para freezing instances

function frozen<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      Object.freeze(this);
    }
  };
}

@frozen
class Config {
  constructor(public apiUrl: string, public timeout: number) { }
}

const config = new Config("https://api.example.com", 5000);

// Tentar modificar - falha silenciosamente (ou erro em strict mode)
(config as any).apiUrl = "https://malicious.com";
console.log(config.apiUrl);  // "https://api.example.com" (não modificado)
```

**Frozen:** `Object.freeze` torna instâncias **imutáveis**.

#### Reflection Metadata

```typescript
// Decorator usando reflect-metadata

import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function serializable(constructor: Function) {
  Reflect.defineMetadata(formatMetadataKey, "JSON", constructor);
}

@serializable
class User {
  constructor(public name: string) { }
}

const format = Reflect.getMetadata(formatMetadataKey, User);
console.log(format);  // "JSON"
```

**Reflect Metadata:** Usar `reflect-metadata` para **metadata complexo**.

### Mixin Decorator

```typescript
// Decorator para aplicar mixin

function Timestamped<T extends { new(...args: any[]): {} }>(Base: T) {
  return class extends Base {
    timestamp = new Date();
    
    getTimestamp() {
      return this.timestamp;
    }
  };
}

function Tagged<T extends { new(...args: any[]): {} }>(Base: T) {
  return class extends Base {
    tag = "default";
    
    setTag(tag: string) {
      this.tag = tag;
    }
  };
}

@Tagged
@Timestamped
class User {
  constructor(public name: string) { }
}

const user = new User("Alice");
console.log(user.name);                    // "Alice"
console.log((user as any).getTimestamp()); // Date
(user as any).setTag("admin");
console.log((user as any).tag);            // "admin"
```

**Mixin:** Múltiplos decorators aplicam **mixins** - combinam comportamentos.

### Modelo Mental para Compreensão

Pense em class decorator como **wrapper de presente**:

**Classe original:** Presente sem embrulho
**Decorator:** Papel de embrulho
**Classe modificada:** Presente embrulhado

Decorator **envolve** classe com funcionalidade adicional.

**Analogia - Camadas de Roupa:**

**Classe base:** Pessoa sem roupa
**Decorator 1:** Camiseta
**Decorator 2:** Jaqueta
**Decorator 3:** Casaco

Cada decorator adiciona **camada** de funcionalidade.

**Metáfora - Construção de Casa:**

**Classe:** Estrutura da casa
**Decorator:** Acabamento (pintura, decoração, etc)
**Classe final:** Casa completa

**Fluxo de execução:**
```
1. TypeScript encontra @decorator
2. Chama decorator(Constructor)
3. Decorator retorna novo constructor ou modifica existente
4. TypeScript substitui classe original (se retornou novo)
5. Instâncias usam classe modificada
```

**Exemplo visual:**
```
@Timestamped
@Tagged
@Logged
class User { }

Execução (bottom-to-top):
1. Logged(User)      → User'
2. Tagged(User')     → User''
3. Timestamped(User'') → User''' (final)
```

## 🔍 Análise Conceitual Profunda

### Multiple Class Decorators

```typescript
// Múltiplos decorators em classe

function first(constructor: Function) {
  console.log("first decorator");
}

function second(constructor: Function) {
  console.log("second decorator");
}

function third(constructor: Function) {
  console.log("third decorator");
}

@first
@second
@third
class MyClass { }

// Output:
// third decorator
// second decorator
// first decorator

// Ordem: bottom-to-top
```

**Order:** Decorators executam **bottom-to-top** (último primeiro).

#### Constructor Replacement

```typescript
// Substituir constructor completamente

function reportableClassDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www.example.com";
  };
}

@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;
  
  constructor(title: string) {
    this.title = title;
  }
}

const bug = new BugReport("Needs dark mode");
console.log(bug.title);         // "Needs dark mode"
console.log(bug.type);          // "report"
console.log((bug as any).reportingURL);  // "http://www.example.com"
```

**Replacement:** Novo constructor **estende** original - preserva funcionalidade e adiciona nova.

### Adding Methods via Decorator

```typescript
// Adicionar métodos via decorator

function addHelperMethods<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    toJSON() {
      return JSON.stringify(this);
    }
    
    clone() {
      return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
  };
}

@addHelperMethods
class User {
  constructor(public name: string, public age: number) { }
}

const user = new User("Alice", 30);
console.log((user as any).toJSON());  // '{"name":"Alice","age":30}'

const cloned = (user as any).clone();
console.log(cloned.name);  // "Alice"
console.log(cloned === user);  // false (clone diferente)
```

**Methods:** Decorator adiciona **métodos helper** a todas instâncias.

#### Dependency Injection

```typescript
// Decorator para dependency injection

const injectionRegistry = new Map<any, any[]>();

function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    injectionRegistry.set(constructor, []);
    return constructor;
  };
}

function Inject(token: any) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const dependencies = injectionRegistry.get(target) || [];
    dependencies[parameterIndex] = token;
    injectionRegistry.set(target, dependencies);
  };
}

@Injectable()
class Database {
  connect() {
    console.log("Database connected");
  }
}

@Injectable()
class UserService {
  constructor(@Inject(Database) private db: Database) { }
  
  getUsers() {
    this.db.connect();
    return [];
  }
}

// Container simplificado
class Container {
  static resolve<T>(token: { new(...args: any[]): T }): T {
    const dependencies = injectionRegistry.get(token) || [];
    const injections = dependencies.map(dep => Container.resolve(dep));
    return new token(...injections);
  }
}

const service = Container.resolve(UserService);
service.getUsers();  // Database connected
```

**DI:** Decorators marcam classes para **dependency injection container**.

### Audit Trail Decorator

```typescript
// Decorator para audit trail

interface AuditLog {
  className: string;
  createdAt: Date;
  createdBy?: string;
}

const auditLogs: AuditLog[] = [];

function Auditable(createdBy?: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        
        auditLogs.push({
          className: constructor.name,
          createdAt: new Date(),
          createdBy
        });
      }
    };
  };
}

@Auditable("admin")
class User {
  constructor(public name: string) { }
}

@Auditable("system")
class Product {
  constructor(public title: string) { }
}

new User("Alice");
new Product("Laptop");

console.log(auditLogs);
// [
//   { className: 'User', createdAt: Date, createdBy: 'admin' },
//   { className: 'Product', createdAt: Date, createdBy: 'system' }
// ]
```

**Audit:** Decorator registra **audit trail** de criação de instâncias.

#### Auto-registration

```typescript
// Decorator para auto-registro

const registry = new Map<string, any>();

function Register(name: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    registry.set(name, constructor);
    return constructor;
  };
}

@Register('UserService')
class UserService {
  getUsers() {
    return ['Alice', 'Bob'];
  }
}

@Register('ProductService')
class ProductService {
  getProducts() {
    return ['Laptop', 'Phone'];
  }
}

// Usar registry
const UserServiceClass = registry.get('UserService');
const service = new UserServiceClass();
console.log(service.getUsers());  // ['Alice', 'Bob']
```

**Registry:** Decorator **registra classes automaticamente** em registry global.

### Performance Monitoring

```typescript
// Decorator para performance monitoring

const performanceMetrics = new Map<string, number[]>();

function Monitored<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      const start = performance.now();
      super(...args);
      const end = performance.now();
      
      const metrics = performanceMetrics.get(constructor.name) || [];
      metrics.push(end - start);
      performanceMetrics.set(constructor.name, metrics);
      
      console.log(`${constructor.name} instantiation took ${end - start}ms`);
    }
  };
}

@Monitored
class HeavyService {
  constructor() {
    // Simular trabalho pesado
    for (let i = 0; i < 1000000; i++) { }
  }
}

new HeavyService();
new HeavyService();
new HeavyService();

const metrics = performanceMetrics.get('HeavyService');
const avg = metrics!.reduce((a, b) => a + b, 0) / metrics!.length;
console.log(`Average instantiation time: ${avg}ms`);
```

**Monitoring:** Decorator coleta **métricas de performance** de instanciação.

## 🎯 Aplicabilidade e Contextos

### Sealing Classes

```typescript
@sealed
class MyClass { }
```

**Raciocínio:** Prevenir extensão/modificação de classe.

### Singleton Pattern

```typescript
@singleton
class Database { }
```

**Raciocínio:** Garantir única instância.

### Entity Metadata

```typescript
@Entity('users')
class User { }
```

**Raciocínio:** Anexar metadata para ORM.

### Dependency Injection

```typescript
@Injectable()
class Service { }
```

**Raciocínio:** Marcar para DI container.

## ⚠️ Limitações e Considerações Teóricas

### Type Preservation

```typescript
// Tipos podem se perder
@decorator
class MyClass {
  myMethod() { }
}

// myMethod pode não ser reconhecido pelo TypeScript
```

**Limitação:** TypeScript pode não inferir tipos de decorator.

### Constructor Complexity

```typescript
// Decorators complicam constructor
@decorator1
@decorator2
@decorator3
class MyClass { }
```

**Consideração:** Múltiplos decorators aumentam complexidade.

### Debugging Difficulty

```typescript
// Stack traces ficam complexos
```

**Consideração:** Debugging mais difícil com decorators.

## 🔗 Interconexões Conceituais

**Relação com Decorator Pattern:** Implementa Decorator Pattern.

**Relação com Singleton:** Implementa Singleton via decorator.

**Relação com DI:** Usado para Dependency Injection.

**Relação com ORM:** Marca entities em TypeORM.

**Relação com Frameworks:** Angular/NestJS usam extensivamente.

## 🚀 Evolução e Próximos Conceitos

Dominar class decorators prepara para:
- **Property Decorators:** Decorar propriedades específicas
- **Method Decorators:** Decorar métodos
- **Parameter Decorators:** Decorar parâmetros
- **Decorator Factories:** Criar decorators parametrizados
- **Reflect Metadata:** Metadata avançado com Reflect API
