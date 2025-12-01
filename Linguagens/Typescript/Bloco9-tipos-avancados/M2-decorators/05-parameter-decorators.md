# Parameter Decorators

## 🎯 Introdução e Definição

### Definição Conceitual

**Parameter decorators** são funções aplicadas a **parâmetros de métodos** usando sintaxe `@decorator`. Diferentemente de decorators anteriores (class, property, method) que modificam comportamento, parameter decorators primariamente **anexam metadata** sobre parâmetros. Executam **uma vez** quando classe é **declarada**, recebendo **target** (prototype ou constructor), **propertyKey** (nome do método), e **parameterIndex** (índice do parâmetro).

Conceitualmente, parameter decorator é função com assinatura `(target: any, propertyKey: string, parameterIndex: number) => void`. **Não retorna valor** e **não pode modificar comportamento** diretamente - propósito é **anotar parâmetros** com metadata para uso posterior por outros decorators (especialmente method decorators). TypeScript não fornece mecanismo built-in para modificar valor de parâmetro - apenas permite **registrar informação** sobre parâmetro.

**Fundamento teórico:** Parameter decorators implementam **parameter metadata attachment** - padrão para marcar parâmetros com informação adicional (tipo, validação, source, etc). Uso principal é **dependency injection** (marcar parâmetros para injeção), **validation** (anexar regras de validação), e **routing** (marcar source de parâmetros como @Body, @Query, @Param). Requer **Reflect API** para armazenar e recuperar metadata.

**Pattern básico:**
```
class MyClass {
  method(@decorator param: string) { }
}

// Decorator recebe (target, "method", 0)
// parameterIndex 0 = primeiro parâmetro
```

**Importante:** Parameter decorator **sozinho não faz nada** - precisa ser **combinado com method decorator** que lê metadata e aplica lógica.

### Contexto Histórico e Evolução

**Java 5 (2004):** Parameter annotations.

```java
// Java - parameter annotations
public class UserController {
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
    
    public User createUser(@RequestBody @Valid User user) {
        return userService.create(user);
    }
    
    public void logEvent(@NotNull String event, @Min(1) int priority) {
        // ...
    }
}
```

**C# 2.0 (2005):** Parameter attributes.

```csharp
// C# - parameter attributes
public class UserController {
    public User GetUser([FromRoute] int id) {
        return _service.GetUser(id);
    }
    
    public void CreateUser([FromBody] User user) {
        _service.Create(user);
    }
    
    public void Log([Required] string message, [Range(1, 10)] int level) {
        // ...
    }
}
```

**Python 3.0 (2008):** Function annotations.

```python
# Python - parameter annotations
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"

# PEP 484 - Type hints
def process_user(user_id: int, active: bool = True) -> User:
    pass
```

**TypeScript 1.5 (2015):** Parameter decorators experimentais.

```typescript
// TypeScript 1.5 - parameter decorators
function logParameter(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} in ${propertyKey} decorated`);
}

class UserService {
  getUser(@logParameter id: number) {
    // ...
  }
}
```

**Angular 2 (2016):** Dependency injection via parameter decorators.

```typescript
// Angular - DI via parameter decorators
@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string,
    @Optional() private logger?: Logger
  ) { }
}

@Component({ ... })
export class UserComponent {
  constructor(
    private userService: UserService,
    @Inject(LOCALE_ID) private locale: string
  ) { }
}
```

**NestJS (2017):** Extensive parameter decorators para routing.

```typescript
// NestJS - parameter decorators
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('include') include?: string
  ) {
    return this.usersService.findOne(+id, include);
  }
  
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') auth: string,
    @Req() request: Request
  ) {
    return this.usersService.create(createUserDto);
  }
  
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Session() session: any
  ) {
    return this.usersService.update(+id, updateUserDto);
  }
}
```

**class-validator (2016):** Validation decorators para parâmetros.

```typescript
// class-validator - parameter validation
class CreateUserDto {
  @IsString()
  @Length(3, 50)
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsInt()
  @Min(18)
  age: number;
}

class UserService {
  createUser(@ValidateNested() dto: CreateUserDto) {
    // dto validado automaticamente
  }
}
```

**Inversify (2015):** DI container via parameter decorators.

```typescript
// Inversify - dependency injection
@injectable()
class Katana implements Weapon {
  public hit() {
    return "cut!";
  }
}

@injectable()
class Ninja implements Warrior {
  constructor(
    @inject(TYPES.Weapon) private weapon: Weapon
  ) { }
  
  public fight() {
    return this.weapon.hit();
  }
}
```

**TypeScript 5.0 (2023):** Suporte para decorators Stage 3.

```typescript
// TypeScript 5.0 - novos parameter decorators
class MyClass {
  method(@validated param: string) { }
}
```

**Evolução de padrões:**

**Era manual (pré-decorators):**
```typescript
// Metadata manual
const paramMetadata = new Map();
paramMetadata.set('UserService.getUser.0', { type: 'PathParam', name: 'id' });
```

**Era decorators experimentais:**
```typescript
class UserService {
  getUser(@PathParam('id') id: number) { }
}
```

**Era decorators Stage 3:**
```typescript
class UserService {
  getUser(@PathParam('id') id: number) { }  // API diferente internamente
}
```

### Problema Fundamental que Resolve

Parameter decorators resolvem problemas de **metadata attachment**, **validation**, **dependency injection**, e **parameter source identification**.

**Problema 1: DI manual**
```typescript
// Sem decorator - DI manual
class UserService {
  constructor() {
    this.db = container.resolve('Database');
    this.logger = container.resolve('Logger');
  }
}

// Manual e verboso ❌
```

**Solução: Decorator para DI**
```typescript
// Com decorator - DI declarativa
import "reflect-metadata";

const injectMetadataKey = Symbol("inject");

function Inject(token: any) {
  return function(target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingParams = Reflect.getMetadata(injectMetadataKey, target, propertyKey) || [];
    existingParams.push({ index: parameterIndex, token });
    Reflect.defineMetadata(injectMetadataKey, existingParams, target, propertyKey);
  };
}

class Database {
  connect() { console.log("DB connected"); }
}

class Logger {
  log(msg: string) { console.log("LOG:", msg); }
}

class UserService {
  constructor(
    @Inject(Database) db: Database,
    @Inject(Logger) logger: Logger
  ) {
    db.connect();
    logger.log("UserService created");
  }
}

// Container resolve automaticamente
class Container {
  static instances = new Map();
  
  static register(token: any, instance: any) {
    this.instances.set(token, instance);
  }
  
  static resolve<T>(constructor: { new(...args: any[]): T }): T {
    const params = Reflect.getMetadata(injectMetadataKey, constructor, undefined) || [];
    
    const injections = params
      .sort((a: any, b: any) => a.index - b.index)
      .map((p: any) => this.instances.get(p.token));
    
    return new constructor(...injections);
  }
}

Container.register(Database, new Database());
Container.register(Logger, new Logger());

const service = Container.resolve(UserService);
// DB connected
// LOG: UserService created

// DI via decorator ✅
```

**Problema 2: Validation metadata separado**
```typescript
// Sem decorator - validation manual
class UserService {
  createUser(name: string, age: number) {
    if (typeof name !== 'string') {
      throw new Error('name must be string');
    }
    if (typeof age !== 'number' || age < 18) {
      throw new Error('age must be number >= 18');
    }
    
    // Lógica de negócio
  }
  
  // Validation manual em cada método ❌
}
```

**Solução: Decorator para validation metadata**
```typescript
// Com decorator - validation declarativa
import "reflect-metadata";

const validationMetadataKey = Symbol("validation");

function Min(min: number) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const validations = Reflect.getMetadata(validationMetadataKey, target, propertyKey) || [];
    validations.push({
      index: parameterIndex,
      validator: (value: number) => value >= min,
      message: `Parameter ${parameterIndex} must be >= ${min}`
    });
    Reflect.defineMetadata(validationMetadataKey, validations, target, propertyKey);
  };
}

function ValidateParams(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const validations = Reflect.getMetadata(validationMetadataKey, target, propertyKey) || [];
    
    for (const validation of validations) {
      if (!validation.validator(args[validation.index])) {
        throw new Error(validation.message);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @ValidateParams
  createUser(name: string, @Min(18) age: number) {
    console.log(`Creating user ${name}, age ${age}`);
  }
}

const service = new UserService();
service.createUser("Alice", 25);  // ✓ OK: Creating user Alice, age 25
// service.createUser("Bob", 15);  // ✗ Error: Parameter 1 must be >= 18

// Validation via decorator ✅
```

**Problema 3: Parameter source manual em routing**
```typescript
// Sem decorator - parameter source manual
class UserController {
  getUser(req: Request, res: Response) {
    const id = req.params.id;  // Manual extraction
    const include = req.query.include;
    
    // Lógica
  }
  
  // Manual extraction repetitiva ❌
}
```

**Solução: Decorators para parameter source**
```typescript
// Com decorator - parameter source declarativa
import "reflect-metadata";

const paramSourceKey = Symbol("paramSource");

function Param(name: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getMetadata(paramSourceKey, target, propertyKey) || [];
    params.push({ index: parameterIndex, source: 'params', name });
    Reflect.defineMetadata(paramSourceKey, params, target, propertyKey);
  };
}

function Query(name: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getMetadata(paramSourceKey, target, propertyKey) || [];
    params.push({ index: parameterIndex, source: 'query', name });
    Reflect.defineMetadata(paramSourceKey, params, target, propertyKey);
  };
}

function Body() {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const params = Reflect.getMetadata(paramSourceKey, target, propertyKey) || [];
    params.push({ index: parameterIndex, source: 'body' });
    Reflect.defineMetadata(paramSourceKey, params, target, propertyKey);
  };
}

// Simular framework que usa metadata
function createHandler(controller: any, methodName: string) {
  const method = controller[methodName];
  const params = Reflect.getMetadata(paramSourceKey, controller, methodName) || [];
  
  return function(req: any) {
    const args: any[] = [];
    
    for (const param of params) {
      if (param.source === 'params') {
        args[param.index] = req.params[param.name];
      } else if (param.source === 'query') {
        args[param.index] = req.query[param.name];
      } else if (param.source === 'body') {
        args[param.index] = req.body;
      }
    }
    
    return method.apply(controller, args);
  };
}

class UserController {
  getUser(@Param('id') id: string, @Query('include') include?: string) {
    console.log(`Getting user ${id}, include: ${include}`);
    return { id, include };
  }
  
  createUser(@Body() userData: any) {
    console.log("Creating user with data:", userData);
    return userData;
  }
}

const controller = new UserController();

const getUserHandler = createHandler(controller, 'getUser');
getUserHandler({ params: { id: '123' }, query: { include: 'profile' } });
// Getting user 123, include: profile

const createUserHandler = createHandler(controller, 'createUser');
createUserHandler({ body: { name: 'Alice', email: 'alice@example.com' } });
// Creating user with data: { name: 'Alice', email: 'alice@example.com' }

// Parameter source via decorators ✅
```

**Problema 4: Required parameters boilerplate**
```typescript
// Sem decorator - validation manual
class Service {
  process(name: string, value: number) {
    if (name === null || name === undefined) {
      throw new Error('name is required');
    }
    if (value === null || value === undefined) {
      throw new Error('value is required');
    }
    
    // Lógica
  }
  
  // Boilerplate repetitivo ❌
}
```

**Solução: Decorator para required parameters**
```typescript
// Com decorator - required declarativo
import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function Required(target: any, propertyKey: string, parameterIndex: number) {
  const required = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) || [];
  required.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, required, target, propertyKey);
}

function ValidateRequired(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const required = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) || [];
    
    for (const index of required) {
      if (args[index] === null || args[index] === undefined) {
        throw new Error(`Parameter ${index} is required`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class Service {
  @ValidateRequired
  process(@Required name: string, @Required value: number, optional?: string) {
    console.log(`Processing ${name}: ${value}`);
  }
}

const service = new Service();
service.process("test", 123);  // ✓ OK: Processing test: 123
service.process("test", 123, "extra");  // ✓ OK: Processing test: 123
// service.process(null, 123);  // ✗ Error: Parameter 0 is required

// Required via decorator ✅
```

**Fundamento teórico:** Parameter decorators promovem **declarative parameter configuration** - anexar metadata a parâmetros para uso por method decorators.

### Importância no Ecossistema

Parameter decorators são cruciais porque:

- **Dependency Injection:** Marcar parâmetros para injeção (Angular, NestJS, Inversify)
- **Validation:** Anexar regras de validação a parâmetros
- **Routing:** Identificar source de parâmetros (@Body, @Query, @Param)
- **Metadata:** Armazenar informação adicional sobre parâmetros
- **Type Checking:** Validar tipos em runtime
- **Required/Optional:** Marcar parâmetros obrigatórios
- **Framework Integration:** Usado extensivamente em frameworks web
- **Documentation:** Gerar documentação de API (Swagger/OpenAPI)

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **No Return Value:** Parameter decorator não retorna valor
2. **Metadata Only:** Propósito principal é anexar metadata
3. **Parameter Index:** Recebe índice do parâmetro (0-based)
4. **Requires Method Decorator:** Precisa method decorator para aplicar lógica
5. **Reflect Metadata:** Usar Reflect API para armazenar metadata

### Pilares Fundamentais

- **Signature:** `(target: any, propertyKey: string, parameterIndex: number) => void`
- **Target:** Prototype (instance methods) ou constructor (static methods)
- **PropertyKey:** Nome do método (não do parâmetro)
- **ParameterIndex:** Índice do parâmetro (0 = primeiro)
- **Metadata Storage:** Reflect.defineMetadata para armazenar informação

### Visão Geral das Nuances

- **Execution Order:** Executam **right-to-left** (último parâmetro primeiro)
- **Constructor Parameters:** Funciona em constructors também
- **Combination:** Combinar com method decorators para aplicar lógica
- **emitDecoratorMetadata:** TypeScript pode emitir metadata de tipo automaticamente
- **Validation Pattern:** Pattern comum - parameter decorator + method decorator

## 🧠 Fundamentos Teóricos

### Basic Parameter Decorator

```typescript
// Parameter decorator básico

function logParameter(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Parameter ${parameterIndex} in ${propertyKey} decorated`);
  console.log("Target:", target);
}

class UserService {
  getUser(@logParameter id: number) {
    return { id, name: "Alice" };
  }
}

// Output:
// Parameter 0 in getUser decorated
// Target: UserService {}
```

**Análise:** Decorator recebe **índice do parâmetro** (0-based).

### Parameter Metadata

```typescript
// Anexar metadata a parâmetro

import "reflect-metadata";

const requiredMetadataKey = Symbol("required");

function Required(target: any, propertyKey: string, parameterIndex: number) {
  const existingRequired = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequired.push(parameterIndex);
  Reflect.defineMetadata(requiredMetadataKey, existingRequired, target, propertyKey);
}

function ValidateMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const required: number[] = Reflect.getMetadata(requiredMetadataKey, target, propertyKey) || [];
    
    for (const index of required) {
      if (args[index] === undefined || args[index] === null) {
        throw new Error(`Parameter at index ${index} is required`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @ValidateMethod
  createUser(@Required name: string, @Required email: string, age?: number) {
    console.log(`Creating user: ${name}, ${email}, ${age || 'N/A'}`);
  }
}

const service = new UserService();
service.createUser("Alice", "alice@example.com", 30);  // ✓ OK
service.createUser("Bob", "bob@example.com");  // ✓ OK
// service.createUser(null, "test@example.com");  // ✗ Error
```

**Pattern:** Parameter decorator anexa metadata, method decorator lê e aplica.

### Multiple Parameter Decorators

```typescript
// Múltiplos decorators em múltiplos parâmetros

import "reflect-metadata";

function First(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`First decorator on parameter ${parameterIndex}`);
}

function Second(target: any, propertyKey: string, parameterIndex: number) {
  console.log(`Second decorator on parameter ${parameterIndex}`);
}

class MyClass {
  method(
    @First @Second param1: string,
    @First param2: number
  ) { }
}

// Output:
// First decorator on parameter 1
// Second decorator on parameter 0
// First decorator on parameter 0

// Ordem: right-to-left (último parâmetro primeiro)
// Para mesmo parâmetro: bottom-to-top
```

**Order:** Decorators executam **right-to-left** (último parâmetro primeiro), **bottom-to-top** para mesmo parâmetro.

### Princípios e Conceitos Subjacentes

#### Type Validation Decorator

```typescript
// Decorator para validação de tipo

import "reflect-metadata";

const typeMetadataKey = Symbol("type");

function ValidateType(expectedType: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const types = Reflect.getMetadata(typeMetadataKey, target, propertyKey) || [];
    types.push({ index: parameterIndex, type: expectedType });
    Reflect.defineMetadata(typeMetadataKey, types, target, propertyKey);
  };
}

function TypeCheck(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const types = Reflect.getMetadata(typeMetadataKey, target, propertyKey) || [];
    
    for (const { index, type } of types) {
      const actualType = typeof args[index];
      if (actualType !== type) {
        throw new Error(`Parameter ${index} must be ${type}, got ${actualType}`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class Calculator {
  @TypeCheck
  add(@ValidateType('number') a: any, @ValidateType('number') b: any) {
    return a + b;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 10));  // 15
// calc.add("5", 10);  // Error: Parameter 0 must be number, got string
```

**Type Validation:** Validar **tipos em runtime** usando metadata.

#### Range Validation

```typescript
// Decorator para validação de range

import "reflect-metadata";

const rangeMetadataKey = Symbol("range");

function Range(min: number, max: number) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const ranges = Reflect.getMetadata(rangeMetadataKey, target, propertyKey) || [];
    ranges.push({ index: parameterIndex, min, max });
    Reflect.defineMetadata(rangeMetadataKey, ranges, target, propertyKey);
  };
}

function ValidateRanges(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const ranges = Reflect.getMetadata(rangeMetadataKey, target, propertyKey) || [];
    
    for (const { index, min, max } of ranges) {
      const value = args[index];
      if (value < min || value > max) {
        throw new Error(`Parameter ${index} must be between ${min} and ${max}`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class Product {
  @ValidateRanges
  setPrice(@Range(0, 10000) price: number) {
    console.log(`Price set to ${price}`);
  }
  
  @ValidateRanges
  setDiscount(@Range(0, 100) discount: number) {
    console.log(`Discount set to ${discount}%`);
  }
}

const product = new Product();
product.setPrice(999);  // ✓ OK: Price set to 999
product.setDiscount(20);  // ✓ OK: Discount set to 20%
// product.setPrice(-10);  // ✗ Error: Parameter 0 must be between 0 and 10000
// product.setDiscount(150);  // ✗ Error: Parameter 0 must be between 0 and 100
```

**Range:** Validar **range numérico** de parâmetros.

### Format Decorator

```typescript
// Decorator para formato de string

import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function Email(target: any, propertyKey: string, parameterIndex: number) {
  const formats = Reflect.getMetadata(formatMetadataKey, target, propertyKey) || [];
  formats.push({
    index: parameterIndex,
    validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "must be valid email"
  });
  Reflect.defineMetadata(formatMetadataKey, formats, target, propertyKey);
}

function Phone(target: any, propertyKey: string, parameterIndex: number) {
  const formats = Reflect.getMetadata(formatMetadataKey, target, propertyKey) || [];
  formats.push({
    index: parameterIndex,
    validator: (value: string) => /^\d{10,11}$/.test(value),
    message: "must be valid phone (10-11 digits)"
  });
  Reflect.defineMetadata(formatMetadataKey, formats, target, propertyKey);
}

function ValidateFormat(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const formats = Reflect.getMetadata(formatMetadataKey, target, propertyKey) || [];
    
    for (const { index, validator, message } of formats) {
      if (!validator(args[index])) {
        throw new Error(`Parameter ${index} ${message}`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @ValidateFormat
  registerUser(@Email email: string, @Phone phone: string) {
    console.log(`Registering user: ${email}, ${phone}`);
  }
}

const service = new UserService();
service.registerUser("alice@example.com", "1234567890");  // ✓ OK
// service.registerUser("invalid", "1234567890");  // ✗ Error: Parameter 0 must be valid email
// service.registerUser("alice@example.com", "123");  // ✗ Error: Parameter 1 must be valid phone
```

**Format:** Validar **formato** de strings (email, phone, etc).

#### Default Value Decorator

```typescript
// Decorator para valor padrão

import "reflect-metadata";

const defaultMetadataKey = Symbol("default");

function Default(defaultValue: any) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const defaults = Reflect.getMetadata(defaultMetadataKey, target, propertyKey) || [];
    defaults.push({ index: parameterIndex, value: defaultValue });
    Reflect.defineMetadata(defaultMetadataKey, defaults, target, propertyKey);
  };
}

function ApplyDefaults(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const defaults = Reflect.getMetadata(defaultMetadataKey, target, propertyKey) || [];
    
    for (const { index, value } of defaults) {
      if (args[index] === undefined) {
        args[index] = value;
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class Greeter {
  @ApplyDefaults
  greet(@Default("World") name?: string, @Default("Hello") greeting?: string) {
    console.log(`${greeting}, ${name}!`);
  }
}

const greeter = new Greeter();
greeter.greet();  // Hello, World!
greeter.greet("Alice");  // Hello, Alice!
greeter.greet("Bob", "Hi");  // Hi, Bob!
```

**Default:** Aplicar **valores padrão** a parâmetros undefined.

### Modelo Mental para Compreensão

Pense em parameter decorator como **etiqueta em argumento**:

**Método:** Função que recebe argumentos
**Parâmetro:** Slot para argumento
**Decorator:** Etiqueta colada no slot
**Metadata:** Informação na etiqueta

Etiqueta **marca** slot mas não modifica valor - outro código (method decorator) **lê etiquetas** e aplica lógica.

**Analogia - Formulário com Labels:**

**Método:** Formulário
**Parâmetros:** Campos do formulário
**Decorator:** Label/instrução em cada campo ("Required", "Email format", etc)
**Method Decorator:** Validador que lê labels e valida campos

**Metáfora - Ingredientes com Anotações:**

**Método:** Receita
**Parâmetros:** Ingredientes
**Decorator:** Anotação em cada ingrediente ("orgânico", "sem glúten", etc)
**Validation:** Checagem antes de cozinhar

**Fluxo de execução:**
```
1. TypeScript encontra @decorator em parâmetro
2. Chama decorator(target, propertyKey, parameterIndex)
3. Decorator anexa metadata via Reflect.defineMetadata
4. Method decorator lê metadata via Reflect.getMetadata
5. Method decorator aplica lógica baseada em metadata
6. Método original executa se validação passou
```

**Exemplo visual:**
```
class Service {
  @ValidateMethod
  process(
    @Required @Email email: string,
    @Range(0, 100) score: number
  ) { }
}

Metadata armazenado:
{
  "process": {
    "required": [0],
    "email": [0],
    "range": [{ index: 1, min: 0, max: 100 }]
  }
}

Quando process() chamado:
1. ValidateMethod intercepta
2. Lê metadata: required, email, range
3. Valida argumentos contra metadata
4. Se válido, chama método original
5. Se inválido, throw error
```

## 🔍 Análise Conceitual Profunda

### Constructor Parameter Decorators

```typescript
// Decorators em parâmetros de constructor

import "reflect-metadata";

const injectMetadataKey = Symbol("inject");

function Inject(token: any) {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const params = Reflect.getMetadata(injectMetadataKey, target) || [];
    params.push({ index: parameterIndex, token });
    Reflect.defineMetadata(injectMetadataKey, params, target);
  };
}

class Database {
  connect() { console.log("DB connected"); }
}

class Logger {
  log(msg: string) { console.log("LOG:", msg); }
}

class UserService {
  constructor(
    @Inject(Database) private db: Database,
    @Inject(Logger) private logger: Logger
  ) {
    this.db.connect();
    this.logger.log("Service initialized");
  }
}

// Container
class Container {
  static instances = new Map();
  
  static resolve<T>(constructor: { new(...args: any[]): T }): T {
    const params = Reflect.getMetadata(injectMetadataKey, constructor) || [];
    
    const injections = params
      .sort((a: any, b: any) => a.index - b.index)
      .map((p: any) => this.instances.get(p.token));
    
    return new constructor(...injections);
  }
}

Container.instances.set(Database, new Database());
Container.instances.set(Logger, new Logger());

const service = Container.instances(UserService);
// DB connected
// LOG: Service initialized
```

**Constructor:** Parameter decorators funcionam em **constructors** também - útil para DI.

#### Combining Multiple Validations

```typescript
// Combinar múltiplas validações

import "reflect-metadata";

const validationsKey = Symbol("validations");

interface Validation {
  index: number;
  validator: (value: any) => boolean;
  message: string;
}

function addValidation(validation: Omit<Validation, 'index'>) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const validations: Validation[] = Reflect.getMetadata(validationsKey, target, propertyKey) || [];
    validations.push({ ...validation, index: parameterIndex });
    Reflect.defineMetadata(validationsKey, validations, target, propertyKey);
  };
}

function Required(target: any, propertyKey: string, parameterIndex: number) {
  return addValidation({
    validator: (value) => value !== null && value !== undefined,
    message: "is required"
  })(target, propertyKey, parameterIndex);
}

function MinLength(min: number) {
  return addValidation({
    validator: (value: string) => value.length >= min,
    message: `must be at least ${min} characters`
  });
}

function MaxLength(max: number) {
  return addValidation({
    validator: (value: string) => value.length <= max,
    message: `must be at most ${max} characters`
  });
}

function ValidateAll(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const validations: Validation[] = Reflect.getMetadata(validationsKey, target, propertyKey) || [];
    
    for (const { index, validator, message } of validations) {
      if (!validator(args[index])) {
        throw new Error(`Parameter ${index} ${message}`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @ValidateAll
  createUser(
    @Required @MinLength(3) @MaxLength(50) username: string,
    @Required @MinLength(8) password: string
  ) {
    console.log(`User created: ${username}`);
  }
}

const service = new UserService();
service.createUser("alice", "password123");  // ✓ OK
// service.createUser("al", "password123");  // ✗ Error: Parameter 0 must be at least 3 characters
// service.createUser("alice", "pass");  // ✗ Error: Parameter 1 must be at least 8 characters
```

**Combination:** Combinar **múltiplas validações** em mesmo parâmetro.

### Transform Decorator

```typescript
// Decorator para transformar valor

import "reflect-metadata";

const transformKey = Symbol("transform");

function Transform(transformer: (value: any) => any) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const transforms = Reflect.getMetadata(transformKey, target, propertyKey) || [];
    transforms.push({ index: parameterIndex, transformer });
    Reflect.defineMetadata(transformKey, transforms, target, propertyKey);
  };
}

function ApplyTransforms(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const transforms = Reflect.getMetadata(transformKey, target, propertyKey) || [];
    
    for (const { index, transformer } of transforms) {
      args[index] = transformer(args[index]);
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

// Transformers comuns
const Trim = Transform((value: string) => value.trim());
const Lowercase = Transform((value: string) => value.toLowerCase());
const ToNumber = Transform((value: string) => Number(value));

class UserService {
  @ApplyTransforms
  createUser(
    @Trim @Lowercase username: string,
    @ToNumber age: string
  ) {
    console.log(`User: ${username}, Age: ${age} (${typeof age})`);
  }
}

const service = new UserService();
service.createUser("  ALICE  ", "30");
// User: alice, Age: 30 (number)
```

**Transform:** **Transformar** valores de parâmetros automaticamente.

## 🎯 Aplicabilidade e Contextos

### Dependency Injection

```typescript
constructor(@Inject(Database) db: Database) { }
```

**Raciocínio:** Marcar parâmetros para injeção de dependência.

### Parameter Validation

```typescript
method(@Required @Email email: string) { }
```

**Raciocínio:** Validação declarativa de parâmetros.

### Routing Parameters

```typescript
@Get(':id')
getUser(@Param('id') id: string) { }
```

**Raciocínio:** Identificar source de parâmetros (NestJS).

## ⚠️ Limitações e Considerações Teóricas

### Requires Method Decorator

```typescript
// Parameter decorator sozinho não faz nada
@decorator
method(param: string) { }

// Precisa method decorator para aplicar lógica
```

**Limitação:** Precisa **combinar com method decorator**.

### No Direct Modification

```typescript
// Não pode modificar valor diretamente
```

**Limitação:** Apenas anexa metadata - não modifica valor.

### Execution Order Complexity

```typescript
// Ordem right-to-left pode confundir
method(@Dec1 p1: string, @Dec2 p2: number) { }

// Dec2 executa primeiro
```

**Consideração:** Ordem de execução não intuitiva.

## 🔗 Interconexões Conceituais

**Relação com DI:** Usado para Dependency Injection.

**Relação com Validation:** Anexa regras de validação.

**Relação com Routing:** NestJS usa para routing (@Param, @Query, @Body).

**Relação com Metadata:** Armazena metadata via Reflect API.

**Relação com Method Decorators:** Combina com method decorators.

## 🚀 Evolução e Próximos Conceitos

Dominar parameter decorators prepara para:
- **Decorator Factories:** Criar decorators parametrizados
- **Reflect Metadata:** Metadata avançado com Reflect API
- **Decorator Composition:** Compor decorators complexos
- **Custom Validation:** Sistemas de validação customizados
- **DI Containers:** Implementar containers de injeção de dependência
