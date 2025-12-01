# Decorator Factories (com parâmetros)

## 🎯 Introdução e Definição

### Definição Conceitual

**Decorator factories** são **funções que retornam decorators** - permitem criar decorators **parametrizados** que podem ser customizados em cada uso. Diferentemente de decorators diretos (funções com assinatura fixa), factories aceitam **argumentos** e **retornam função decorator** configurada com esses argumentos. Pattern fundamental para criar decorators **reutilizáveis** e **configuráveis**.

Conceitualmente, decorator factory é **higher-order function** com assinatura `(...args: any[]) => DecoratorFunction`. Quando aplicado com `@factoryName(args)`, TypeScript **chama factory** com argumentos, **recebe decorator** retornado, e **aplica decorator** ao target. Permite **configurar comportamento** do decorator em cada uso sem duplicar código.

**Fundamento teórico:** Decorator factories implementam **parametric polymorphism** em decorators - mesmo decorator com comportamentos diferentes baseados em parâmetros. Permitem **configuration over convention** - cada uso pode especificar configuração. Essencial para frameworks (Angular, NestJS) onde decorators precisam aceitar metadata complexo (rotas, schemas, etc).

**Pattern básico:**
```
// Factory
function decorator(param: string) {
  return function(target: any) {
    // Usar param
  };
}

// Uso
@decorator("value")
class MyClass { }

// TypeScript chama: decorator("value") → retorna decorator → aplica a MyClass
```

**Diferença fundamental:**
- **Decorator direto:** `@decorator` - função aplicada diretamente
- **Decorator factory:** `@decorator(args)` - função chamada, retorna decorator

### Contexto Histórico e Evolução

**Python 2.4 (2004):** Decorator factories.

```python
# Python - decorator factory
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
```

**Java 5 (2004):** Annotations com parâmetros.

```java
// Java - annotations with parameters
@RequestMapping(value = "/users", method = RequestMethod.GET)
public List<User> getUsers() { }

@Cacheable(value = "users", key = "#id")
public User getUser(Long id) { }

@Scheduled(cron = "0 0 * * * *")
public void runTask() { }
```

**C# 2.0 (2005):** Attributes com parâmetros.

```csharp
// C# - attributes with parameters
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class UsersController { }

[HttpGet("{id}")]
[ResponseCache(Duration = 60)]
public User GetUser(int id) { }

[ValidateAntiForgeryToken]
[OutputCache(Duration = 300)]
public void Create(User user) { }
```

**TypeScript 1.5 (2015):** Decorator factories experimentais.

```typescript
// TypeScript 1.5 - decorator factories
function log(prefix: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix}: Calling ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class UserService {
  @log("[UserService]")
  getUser(id: number) {
    return { id, name: "Alice" };
  }
}
```

**Angular 2 (2016):** Extensive use de decorator factories.

```typescript
// Angular - decorator factories
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent { }

@NgModule({
  declarations: [UserComponent],
  imports: [CommonModule],
  exports: [UserComponent]
})
export class UserModule { }

@Injectable({ providedIn: 'root' })
export class UserService { }
```

**NestJS (2017):** Routing via decorator factories.

```typescript
// NestJS - routing decorators
@Controller('users')
export class UsersController {
  @Get()
  @HttpCode(200)
  @Header('Cache-Control', 'max-age=60')
  findAll() { }
  
  @Get(':id')
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id') id: string) { }
  
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateUserDto) { }
}
```

**TypeORM (2016):** Entity metadata via factories.

```typescript
// TypeORM - decorator factories
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;
  
  @Column({ unique: true })
  email: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
```

**class-validator (2016):** Validation com factories.

```typescript
// class-validator - validation factories
export class CreateUserDto {
  @IsString()
  @Length(3, 50, { message: 'Name must be 3-50 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  
  @IsInt()
  @Min(18, { message: 'Must be at least 18' })
  @Max(120)
  age: number;
}
```

**Swagger/OpenAPI (2016+):** API documentation decorators.

```typescript
// Swagger - API documentation
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  findAll() { }
  
  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: User })
  create(@Body() dto: CreateUserDto) { }
}
```

**TypeScript 5.0 (2023):** Suporte para decorators Stage 3.

```typescript
// TypeScript 5.0 - decorator factories Stage 3
@logged({ level: 'info' })
class MyClass { }
```

**Evolução de padrões:**

**Era manual (pré-factories):**
```typescript
// Configuração externa
const config = { prefix: "[LOG]" };

function log(target: any) {
  // Usar config global
}
```

**Era decorator factories:**
```typescript
// Configuração inline
function log(prefix: string) {
  return function(target: any) {
    // Usar prefix
  };
}

@log("[LOG]")
class MyClass { }
```

**Era modern factories:**
```typescript
// Configuração com options object
function log(options: { prefix: string; level: string }) {
  return function(target: any) {
    // Usar options
  };
}

@log({ prefix: "[LOG]", level: "info" })
class MyClass { }
```

### Problema Fundamental que Resolve

Decorator factories resolvem problemas de **decorator reusability**, **configuration**, e **avoiding code duplication**.

**Problema 1: Decorators não reutilizáveis**
```typescript
// Sem factory - decorator não configurável
function logInfo(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`[INFO] Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

function logWarning(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`[WARNING] Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

function logError(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`[ERROR] Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Código duplicado para cada nível de log ❌
```

**Solução: Factory parametrizado**
```typescript
// Com factory - decorator reutilizável
function log(level: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`[${level}] Calling ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class Service {
  @log("INFO")
  getUserInfo() { }
  
  @log("WARNING")
  deprecatedMethod() { }
  
  @log("ERROR")
  criticalOperation() { }
}

// Um factory, múltiplas configurações ✅
```

**Problema 2: Cache size não configurável**
```typescript
// Sem factory - cache size fixo
function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const cache = new Map();
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) return cache.get(key);
    
    const result = originalMethod.apply(this, args);
    
    // Cache size limitado a 100 (hardcoded) ❌
    if (cache.size >= 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}
```

**Solução: Factory com maxSize configurável**
```typescript
// Com factory - cache size configurável
function memoize(maxSize: number = 100) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const cache = new Map();
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) return cache.get(key);
      
      const result = originalMethod.apply(this, args);
      
      // Cache size configurável ✅
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      cache.set(key, result);
      return result;
    };
    
    return descriptor;
  };
}

class Service {
  @memoize(10)  // Cache pequeno
  quickOperation() { }
  
  @memoize(1000)  // Cache grande
  expensiveOperation() { }
}
```

**Problema 3: Validation rules hardcoded**
```typescript
// Sem factory - validation hardcoded
import "reflect-metadata";

const minLengthKey = Symbol("minLength3");

function minLength3(target: any, propertyKey: string, parameterIndex: number) {
  Reflect.defineMetadata(minLengthKey, 3, target, propertyKey);
}

// Criar novo decorator para cada min length ❌
```

**Solução: Factory parametrizado**
```typescript
// Com factory - validation configurável
import "reflect-metadata";

const validationKey = Symbol("validation");

function MinLength(min: number) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const validations = Reflect.getMetadata(validationKey, target, propertyKey) || [];
    validations.push({
      index: parameterIndex,
      validator: (value: string) => value.length >= min,
      message: `must be at least ${min} characters`
    });
    Reflect.defineMetadata(validationKey, validations, target, propertyKey);
  };
}

function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const validations = Reflect.getMetadata(validationKey, target, propertyKey) || [];
    
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
  @Validate
  createUser(@MinLength(3) name: string) { }
  
  @Validate
  setDescription(@MinLength(10) description: string) { }
}

// Um factory, qualquer min length ✅
```

**Problema 4: Retry attempts não configurável**
```typescript
// Sem factory - retry attempts fixo
function retry(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    let lastError: any;
    
    // Hardcoded 3 attempts ❌
    for (let i = 0; i < 3; i++) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        lastError = error;
      }
    }
    
    throw lastError;
  };
  
  return descriptor;
}
```

**Solução: Factory com attempts configurável**
```typescript
// Com factory - retry attempts configurável
function retry(maxAttempts: number = 3, delay: number = 1000) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
          }
        }
      }
      
      throw lastError;
    };
    
    return descriptor;
  };
}

class APIClient {
  @retry(5, 500)  // 5 attempts, 500ms delay
  async criticalRequest() { }
  
  @retry(2, 100)  // 2 attempts, 100ms delay
  async quickRequest() { }
}

// Retry configurável ✅
```

**Fundamento teórico:** Decorator factories promovem **parametric reusability** - um decorator genérico com comportamento customizado via parâmetros.

### Importância no Ecossistema

Decorator factories são cruciais porque:

- **Reusability:** Um factory, múltiplas configurações
- **Configuration:** Comportamento configurável em cada uso
- **DRY:** Evitar duplicação de decorators similares
- **Framework Integration:** Angular, NestJS, TypeORM usam extensivamente
- **Metadata:** Anexar metadata complexo (rotas, schemas, options)
- **Validation:** Regras de validação configuráveis
- **Flexibility:** Adaptar decorator ao contexto específico
- **Type Safety:** TypeScript infere tipos de parâmetros

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Higher-Order Function:** Função que retorna função
2. **Parameterization:** Aceita argumentos para configuração
3. **Return Decorator:** Retorna decorator configurado
4. **Call Syntax:** `@factory(args)` - chama factory, aplica decorator retornado
5. **Closure:** Decorator retornado tem acesso a parâmetros via closure

### Pilares Fundamentais

- **Factory Signature:** `(...args: any[]) => DecoratorFunction`
- **Decorator Return:** Retorna class/method/property/parameter decorator
- **Parameter Capture:** Closure captura parâmetros do factory
- **Configuration:** Comportamento customizado por parâmetros
- **Type Safety:** TypeScript valida tipos de parâmetros

### Visão Geral das Nuances

- **Optional Parameters:** Parâmetros com valores padrão
- **Options Object:** Passar objeto de configuração
- **Multiple Decorators:** Combinar factories diferentes
- **Generic Factories:** Factories com type parameters
- **Overloading:** Factories com múltiplas assinaturas

## 🧠 Fundamentos Teóricos

### Basic Decorator Factory

```typescript
// Decorator factory básico

function log(prefix: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix}: ${propertyKey} called`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class UserService {
  @log("[UserService]")
  getUser(id: number) {
    return { id, name: "Alice" };
  }
  
  @log("[INFO]")
  listUsers() {
    return [];
  }
}

const service = new UserService();
service.getUser(1);  // [UserService]: getUser called
service.listUsers();  // [INFO]: listUsers called
```

**Análise:** Factory **aceita parâmetro** (prefix), **retorna decorator** que usa parâmetro via **closure**.

### Factory with Multiple Parameters

```typescript
// Factory com múltiplos parâmetros

function retry(maxAttempts: number, delayMs: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          console.log(`Attempt ${attempt} failed`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        }
      }
      
      throw lastError;
    };
    
    return descriptor;
  };
}

class APIClient {
  @retry(3, 1000)
  async fetchData(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed");
    return response.json();
  }
}
```

**Multiple Parameters:** Factory aceita **vários parâmetros** para configuração complexa.

### Factory with Options Object

```typescript
// Factory com options object

interface LogOptions {
  prefix?: string;
  logArgs?: boolean;
  logResult?: boolean;
}

function log(options: LogOptions = {}) {
  const { prefix = "[LOG]", logArgs = false, logResult = false } = options;
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix} ${propertyKey} called`);
      
      if (logArgs) {
        console.log("Arguments:", args);
      }
      
      const result = originalMethod.apply(this, args);
      
      if (logResult) {
        console.log("Result:", result);
      }
      
      return result;
    };
    
    return descriptor;
  };
}

class Calculator {
  @log({ prefix: "[CALC]", logArgs: true, logResult: true })
  add(a: number, b: number) {
    return a + b;
  }
  
  @log({ prefix: "[CALC]" })
  multiply(a: number, b: number) {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(5, 3);
// [CALC] add called
// Arguments: [5, 3]
// Result: 8
```

**Options Object:** Passar **objeto de configuração** - mais legível para múltiplas opções.

### Princípios e Conceitos Subjacentes

#### Validation Factory

```typescript
// Factory para validação

import "reflect-metadata";

const validationKey = Symbol("validation");

interface ValidationRule {
  index: number;
  validator: (value: any) => boolean;
  message: string;
}

function Range(min: number, max: number, message?: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const validations: ValidationRule[] = Reflect.getMetadata(validationKey, target, propertyKey) || [];
    
    validations.push({
      index: parameterIndex,
      validator: (value: number) => value >= min && value <= max,
      message: message || `must be between ${min} and ${max}`
    });
    
    Reflect.defineMetadata(validationKey, validations, target, propertyKey);
  };
}

function Email(message?: string) {
  return function(target: any, propertyKey: string, parameterIndex: number) {
    const validations: ValidationRule[] = Reflect.getMetadata(validationKey, target, propertyKey) || [];
    
    validations.push({
      index: parameterIndex,
      validator: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: message || "must be valid email"
    });
    
    Reflect.defineMetadata(validationKey, validations, target, propertyKey);
  };
}

function Validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    const validations: ValidationRule[] = Reflect.getMetadata(validationKey, target, propertyKey) || [];
    
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
  @Validate
  createUser(
    @Email("Invalid email format") email: string,
    @Range(18, 120, "Age must be 18-120") age: number
  ) {
    console.log(`User created: ${email}, ${age}`);
  }
}

const service = new UserService();
service.createUser("alice@example.com", 25);  // ✓ OK
// service.createUser("invalid", 25);  // ✗ Error: Parameter 0 Invalid email format
// service.createUser("alice@example.com", 150);  // ✗ Error: Parameter 1 Age must be 18-120
```

**Validation:** Factories para **validação parametrizada** com mensagens customizadas.

#### Throttle Factory

```typescript
// Factory para throttle configurável

function throttle(delayMs: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let lastCall = 0;
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      
      if (now - lastCall >= delayMs) {
        lastCall = now;
        return originalMethod.apply(this, args);
      } else {
        console.log(`Throttled: ${propertyKey}`);
      }
    };
    
    return descriptor;
  };
}

class EventHandler {
  @throttle(1000)
  onScroll() {
    console.log("Scroll handled");
  }
  
  @throttle(500)
  onResize() {
    console.log("Resize handled");
  }
}
```

**Throttle:** Delay **configurável** para cada método.

### Memoization Factory

```typescript
// Factory para memoization com maxSize

function memoize(maxSize: number = 100) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, any>();
    
    descriptor.value = function(...args: any[]) {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        console.log(`Cache hit: ${propertyKey}`);
        return cache.get(key);
      }
      
      console.log(`Cache miss: ${propertyKey}`);
      const result = originalMethod.apply(this, args);
      
      // LRU eviction
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      cache.set(key, result);
      return result;
    };
    
    return descriptor;
  };
}

class Calculator {
  @memoize(10)
  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
  
  @memoize(1000)
  expensiveComputation(n: number): number {
    // Computation...
    return n * n;
  }
}
```

**Memoization:** Cache **size configurável** para cada método.

#### Authorization Factory

```typescript
// Factory para autorização

interface User {
  role: string;
}

function authorize(allowedRoles: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const currentUser: User = (this as any).currentUser;
      
      if (!currentUser) {
        throw new Error("Unauthorized: not logged in");
      }
      
      if (!allowedRoles.includes(currentUser.role)) {
        throw new Error(`Unauthorized: requires ${allowedRoles.join(' or ')}`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class AdminController {
  currentUser: User;
  
  @authorize(['admin'])
  deleteUser(id: number) {
    console.log(`Deleting user ${id}`);
  }
  
  @authorize(['admin', 'moderator'])
  banUser(id: number) {
    console.log(`Banning user ${id}`);
  }
  
  @authorize(['admin', 'moderator', 'user'])
  viewUser(id: number) {
    console.log(`Viewing user ${id}`);
  }
}

const controller = new AdminController();
controller.currentUser = { role: 'moderator' };

// controller.deleteUser(1);  // Error: requires admin
controller.banUser(1);  // ✓ OK: Banning user 1
controller.viewUser(1);  // ✓ OK: Viewing user 1
```

**Authorization:** Roles **configuráveis** para cada método.

### Rate Limit Factory

```typescript
// Factory para rate limiting

function rateLimit(maxCalls: number, windowMs: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const calls: number[] = [];
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      
      // Remove old calls
      while (calls.length > 0 && calls[0] < now - windowMs) {
        calls.shift();
      }
      
      if (calls.length >= maxCalls) {
        throw new Error(`Rate limit: max ${maxCalls} calls per ${windowMs}ms`);
      }
      
      calls.push(now);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class APIClient {
  @rateLimit(10, 60000)  // 10 calls per minute
  publicAPI() {
    console.log("Public API called");
  }
  
  @rateLimit(100, 60000)  // 100 calls per minute
  authenticatedAPI() {
    console.log("Authenticated API called");
  }
}
```

**Rate Limit:** Limits **configuráveis** para diferentes endpoints.

#### Timeout Factory

```typescript
// Factory para timeout

function timeout(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
        )
      ]);
    };
    
    return descriptor;
  };
}

class ExternalService {
  @timeout(5000)  // 5 second timeout
  async fetchData() {
    // Slow operation
    await new Promise(resolve => setTimeout(resolve, 10000));
    return "data";
  }
  
  @timeout(1000)  // 1 second timeout
  async quickOperation() {
    return "quick";
  }
}

const service = new ExternalService();
// await service.fetchData();  // Error: Timeout after 5000ms
```

**Timeout:** Timeout **configurável** para operações async.

### Modelo Mental para Compreensão

Pense em decorator factory como **fábrica de carimbos**:

**Factory:** Máquina que cria carimbos
**Parâmetros:** Configuração do carimbo (texto, cor, tamanho)
**Decorator retornado:** Carimbo criado
**Aplicação:** Carimbar documento

**Analogia - Molde de Biscoito:**

**Factory:** Cortador de biscoito ajustável
**Parâmetros:** Tamanho e forma desejados
**Decorator:** Cortador configurado
**Target:** Massa (classe/método)

**Metáfora - Template Printer:**

**Factory:** Impressora com template
**Parâmetros:** Dados para preencher template
**Decorator:** Template preenchido
**Print:** Aplicar a documento

**Fluxo de execução:**
```
1. TypeScript encontra @factory(args)
2. Chama factory(args)
3. Factory retorna decorator function
4. TypeScript aplica decorator retornado a target
5. Decorator usa args via closure
```

**Exemplo visual:**
```
@log({ prefix: "[INFO]", logResult: true })
method() { }

Execução:
1. Chama log({ prefix: "[INFO]", logResult: true })
2. log retorna decorator function
3. Decorator function recebe (target, propertyKey, descriptor)
4. Decorator usa options.prefix e options.logResult via closure
5. Decorator wraps method
```

## 🔍 Análise Conceitual Profunda

### Class Decorator Factory

```typescript
// Factory para class decorator

function entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    (constructor as any).tableName = tableName;
    return constructor;
  };
}

@entity('users')
class User {
  id: number;
  name: string;
}

@entity('products')
class Product {
  id: number;
  title: string;
}

console.log((User as any).tableName);     // "users"
console.log((Product as any).tableName);  // "products"
```

**Class Factory:** Factory para **class decorators** com configuração.

#### Property Decorator Factory

```typescript
// Factory para property decorator

import "reflect-metadata";

const columnMetadataKey = Symbol("column");

interface ColumnOptions {
  type: string;
  length?: number;
  unique?: boolean;
}

function Column(options: ColumnOptions) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(columnMetadataKey, options, target, propertyKey);
  };
}

class User {
  @Column({ type: 'integer', unique: true })
  id: number;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;
  
  @Column({ type: 'varchar', unique: true })
  email: string;
}

const nameMetadata = Reflect.getMetadata(columnMetadataKey, User.prototype, 'name');
console.log(nameMetadata);  // { type: 'varchar', length: 100 }
```

**Property Factory:** Anexar **metadata complexo** a propriedades.

### Generic Decorator Factory

```typescript
// Factory genérico com type parameters

function returns<T>(returnType: { new(): T }) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata("design:returntype", returnType, target, propertyKey);
  };
}

class UserService {
  @returns(Array)
  getUsers(): User[] {
    return [];
  }
  
  @returns(User)
  getUser(id: number): User {
    return new User();
  }
}
```

**Generic:** Factory com **type parameters** para type safety.

#### Combining Multiple Factories

```typescript
// Combinar múltiplos factories

function log(prefix: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      console.log(`${prefix}: ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}

function measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };
  return descriptor;
}

function cache(maxSize: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map();
    
    descriptor.value = function(...args: any[]) {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      
      const result = originalMethod.apply(this, args);
      
      if (cache.size >= maxSize) {
        cache.delete(cache.keys().next().value);
      }
      
      cache.set(key, result);
      return result;
    };
    
    return descriptor;
  };
}

class DataService {
  @log("[DataService]")
  @measure
  @cache(100)
  getData(id: number) {
    // Computation
    return { id, data: "..." };
  }
}

const service = new DataService();
service.getData(1);
// [DataService]: getData
// getData took 0.123ms
```

**Combination:** Combinar **factories e decorators diretos** - executam bottom-to-top.

### Factory with Defaults

```typescript
// Factory com valores padrão

interface LogOptions {
  prefix?: string;
  level?: 'info' | 'warn' | 'error';
  timestamp?: boolean;
}

function log(options: LogOptions = {}) {
  const {
    prefix = '[LOG]',
    level = 'info',
    timestamp = false
  } = options;
  
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      const ts = timestamp ? `[${new Date().toISOString()}] ` : '';
      console.log(`${ts}${prefix} [${level.toUpperCase()}] ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class Service {
  @log()  // Usa defaults
  method1() { }
  
  @log({ prefix: '[Service]' })  // Override prefix
  method2() { }
  
  @log({ level: 'error', timestamp: true })  // Override level e timestamp
  method3() { }
}
```

**Defaults:** Valores **padrão** para parâmetros opcionais.

## 🎯 Aplicabilidade e Contextos

### Configurable Logging

```typescript
@log({ prefix: "[API]", level: "info" })
method() { }
```

**Raciocínio:** Log com configuração específica.

### Parameterized Validation

```typescript
@Range(0, 100)
setDiscount(discount: number) { }
```

**Raciocínio:** Validação com limites configuráveis.

### Flexible Caching

```typescript
@memoize(1000)
expensiveComputation() { }
```

**Raciocínio:** Cache size adaptado ao método.

## ⚠️ Limitações e Considerações Teóricas

### Complexity

```typescript
// Factories adicionam nível extra de complexidade
@factory(arg1, arg2, arg3)
method() { }
```

**Limitação:** Mais difícil de entender que decorators diretos.

### Type Inference

```typescript
// TypeScript pode não inferir tipos corretamente
@factory(complexOptions)
method() { }
```

**Consideração:** Tipos podem se perder em factories complexos.

### Performance

```typescript
// Factory chamado para cada decorator
@factory()  // Chama factory
@factory()  // Chama factory novamente
```

**Consideração:** Overhead de chamadas de factory.

## 🔗 Interconexões Conceituais

**Relação com HOF:** Factories são higher-order functions.

**Relação com Closure:** Decorators retornados usam closure.

**Relação com Configuration:** Promovem configuration over convention.

**Relação com DRY:** Evitam duplicação de decorators similares.

**Relação com Frameworks:** Usado extensivamente em frameworks.

## 🚀 Evolução e Próximos Conceitos

Dominar decorator factories prepara para:
- **Advanced Metadata:** Metadata complexo com Reflect API
- **Framework Development:** Criar frameworks baseados em decorators
- **Custom Validators:** Sistemas de validação customizados
- **DI Containers:** Implementar containers de injeção de dependência
- **Aspect-Oriented Programming:** AOP patterns em TypeScript
