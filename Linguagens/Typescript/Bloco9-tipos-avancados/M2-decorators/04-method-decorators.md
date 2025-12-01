# Method Decorators

## 🎯 Introdução e Definição

### Definição Conceitual

**Method decorators** são funções aplicadas a **declarações de métodos** de classe usando sintaxe `@decorator`. Diferentemente de property decorators que focam em propriedades, method decorators operam em **métodos específicos** - modificando, anotando, ou interceptando chamadas de métodos. Executam **uma vez** quando classe é **declarada**, recebendo **target** (prototype ou constructor), **propertyKey** (nome do método), e **PropertyDescriptor** como parâmetros.

Conceitualmente, method decorator é função com assinatura `(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor | void`. **Pode retornar novo descriptor** que substitui original ou **modificar descriptor existente**. Diferente de property decorators, method decorators recebem **PropertyDescriptor** - objeto contendo `value` (função original), `writable`, `enumerable`, `configurable`.

**Fundamento teórico:** Method decorators implementam **method interception** - padrão de metaprogramming que intercepta chamadas de métodos para adicionar comportamento antes/depois/durante execução. Permitem **logging**, **caching**, **validation**, **error handling**, **performance monitoring** sem modificar código do método. Implementam **Aspect-Oriented Programming (AOP)** em TypeScript.

**Pattern básico:**
```
class MyClass {
  @decorator
  method() { }
}

// Decorator recebe (target, "method", descriptor)
// descriptor.value = função original
```

**Retorno:** Se decorator **retorna descriptor**, esse descriptor **substitui** original. Modificar `descriptor.value` permite **wrapping** do método original.

### Contexto Histórico e Evolução

**Java 5 (2004):** Method annotations.

```java
// Java - method annotations
public class UserService {
    @Override
    @Transactional
    @Cacheable(value = "users")
    public User getUser(Long id) {
        return repository.findById(id);
    }
    
    @Deprecated
    @Secured("ROLE_ADMIN")
    public void deleteUser(Long id) {
        repository.deleteById(id);
    }
}
```

**C# 2.0 (2005):** Method attributes.

```csharp
// C# - method attributes
public class UserController {
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public User GetUser(int id) {
        return _service.GetUser(id);
    }
    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public void CreateUser(User user) {
        _service.Create(user);
    }
}
```

**Python 2.4 (2004):** Function decorators.

```python
# Python - function decorators
@staticmethod
def my_static_method():
    pass

@cached
@retry(max_attempts=3)
def fetch_data(url):
    return requests.get(url)

@app.route('/users')
@login_required
def users():
    return render_template('users.html')
```

**TypeScript 1.5 (2015):** Method decorators experimentais.

```typescript
// TypeScript 1.5 - method decorators
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey}`);
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @log
  getUser(id: number) {
    return { id, name: "Alice" };
  }
}
```

**Angular 2 (2016):** Method decorators para lifecycle hooks.

```typescript
// Angular - method decorators
@Component({ ... })
export class UserComponent {
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    console.log('Clicked!', event);
  }
  
  @ViewChild('myDiv')
  myDiv: ElementRef;
}
```

**NestJS (2017):** Decorators para routing e middleware.

```typescript
// NestJS - routing decorators
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  findAll(): User[] {
    return this.usersService.findAll();
  }
  
  @Post()
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
```

**TypeORM (2016):** Method decorators para hooks.

```typescript
// TypeORM - lifecycle hooks
@Entity()
class User {
  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  
  @AfterLoad()
  computeFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
```

**MobX (2015):** Action decorators.

```typescript
// MobX - action decorators
class TodoStore {
  @observable todos = [];
  
  @action
  addTodo(todo: Todo) {
    this.todos.push(todo);
  }
  
  @action.bound
  removeTodo(id: number) {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}
```

**Express.js with decorators (2016+):**

```typescript
// Express decorators
@Controller('/api/users')
class UserController {
  @Get('/')
  getUsers() {
    return User.findAll();
  }
  
  @Post('/')
  @Middleware(authenticate)
  @Validate(CreateUserSchema)
  createUser(@Body() data: CreateUserDto) {
    return User.create(data);
  }
}
```

**TypeScript 5.0 (2023):** Suporte para decorators Stage 3.

```typescript
// TypeScript 5.0 - novos method decorators
class MyClass {
  @logged
  method() { }
}
```

**Evolução de padrões:**

**Era manual (pré-decorators):**
```typescript
class MyClass {
  method() { }
}

const originalMethod = MyClass.prototype.method;
MyClass.prototype.method = function(...args) {
  console.log("Before");
  const result = originalMethod.apply(this, args);
  console.log("After");
  return result;
};
```

**Era decorators experimentais:**
```typescript
class MyClass {
  @wrap
  method() { }
}
```

**Era decorators Stage 3:**
```typescript
class MyClass {
  @wrap
  method() { }  // API diferente internamente
}
```

### Problema Fundamental que Resolve

Method decorators resolvem problemas de **logging repetitivo**, **error handling duplicado**, **caching manual**, e **cross-cutting concerns**.

**Problema 1: Logging manual em cada método**
```typescript
// Sem decorator - logging manual
class UserService {
  getUser(id: number) {
    console.log(`Calling getUser with ${id}`);
    const startTime = Date.now();
    
    const user = this.repository.find(id);
    
    const endTime = Date.now();
    console.log(`getUser took ${endTime - startTime}ms`);
    return user;
  }
  
  createUser(data: UserData) {
    console.log(`Calling createUser`);
    const startTime = Date.now();
    
    const user = this.repository.create(data);
    
    const endTime = Date.now();
    console.log(`createUser took ${endTime - startTime}ms`);
    return user;
  }
  
  // Logging repetido ❌
}
```

**Solução: Decorator centraliza logging**
```typescript
// Com decorator - logging centralizado
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const startTime = Date.now();
    
    const result = originalMethod.apply(this, args);
    
    const endTime = Date.now();
    console.log(`${propertyKey} took ${endTime - startTime}ms`);
    return result;
  };
  
  return descriptor;
}

class UserService {
  @log
  getUser(id: number) {
    return this.repository.find(id);
  }
  
  @log
  createUser(data: UserData) {
    return this.repository.create(data);
  }
  
  // Código limpo, logging via decorator ✅
}
```

**Problema 2: Try-catch repetitivo**
```typescript
// Sem decorator - error handling manual
class APIClient {
  async fetchUsers() {
    try {
      const response = await fetch('/api/users');
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  
  async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
  
  // Try-catch repetitivo ❌
}
```

**Solução: Decorator para error handling**
```typescript
// Com decorator - error handling centralizado
function catchErrors(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      console.error(`Error in ${propertyKey}:`, error);
      throw error;
    }
  };
  
  return descriptor;
}

class APIClient {
  @catchErrors
  async fetchUsers() {
    const response = await fetch('/api/users');
    return await response.json();
  }
  
  @catchErrors
  async fetchProducts() {
    const response = await fetch('/api/products');
    return await response.json();
  }
  
  // Error handling via decorator ✅
}
```

**Problema 3: Caching manual**
```typescript
// Sem decorator - caching manual
class DataService {
  private cache = new Map<string, any>();
  
  expensiveOperation(n: number) {
    const cacheKey = `expensiveOperation:${n}`;
    
    if (this.cache.has(cacheKey)) {
      console.log("Cache hit");
      return this.cache.get(cacheKey);
    }
    
    console.log("Computing...");
    const result = /* computation */;
    this.cache.set(cacheKey, result);
    return result;
  }
  
  // Caching manual em cada método ❌
}
```

**Solução: Decorator para memoization**
```typescript
// Com decorator - caching automático
function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log("Cache hit");
      return cache.get(key);
    }
    
    console.log("Computing...");
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class DataService {
  @memoize
  expensiveOperation(n: number) {
    // Computation
    return n * n;
  }
  
  // Caching via decorator ✅
}
```

**Problema 4: Validation boilerplate**
```typescript
// Sem decorator - validation manual
class UserService {
  createUser(name: string, email: string) {
    if (!name || !email) {
      throw new Error("Name and email required");
    }
    if (!email.includes('@')) {
      throw new Error("Invalid email");
    }
    
    // Lógica de negócio
  }
  
  // Validation repetitiva ❌
}
```

**Solução: Decorator para validation**
```typescript
// Com decorator - validation declarativa
function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    for (const arg of args) {
      if (arg === null || arg === undefined) {
        throw new Error(`Invalid argument in ${propertyKey}`);
      }
    }
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @validate
  createUser(name: string, email: string) {
    // Lógica de negócio sem validation boilerplate
  }
  
  // Validation via decorator ✅
}
```

**Fundamento teórico:** Method decorators promovem **aspect-oriented programming** - separar cross-cutting concerns (logging, validation, caching) de lógica de negócio.

### Importância no Ecossistema

Method decorators são cruciais porque:

- **Logging:** Centralizar logging de chamadas de métodos
- **Performance Monitoring:** Medir tempo de execução
- **Caching/Memoization:** Cache automático de resultados
- **Error Handling:** Try-catch centralizado
- **Validation:** Validação de argumentos declarativa
- **Authorization:** Verificar permissões antes de executar
- **Retry Logic:** Retry automático em falhas
- **Deprecation Warnings:** Avisar sobre métodos deprecados
- **Framework Integration:** Routing (NestJS), lifecycle hooks (Angular)

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **PropertyDescriptor:** Recebe descriptor com `value` (método original)
2. **Return Value:** Pode retornar novo descriptor
3. **Method Wrapping:** Padrão comum - wrap método original
4. **Context Preservation:** Usar `apply(this, args)` para preservar contexto
5. **Design-time Execution:** Executa quando classe declarada

### Pilares Fundamentais

- **Signature:** `(target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor | void`
- **Target:** Prototype (instance methods) ou constructor (static methods)
- **PropertyKey:** Nome do método como string
- **Descriptor:** Objeto com `value`, `writable`, `enumerable`, `configurable`
- **Value:** `descriptor.value` é função original

### Visão Geral das Nuances

- **Async Methods:** Funciona com métodos async
- **Multiple Decorators:** Executam bottom-to-top
- **Context Binding:** Preservar `this` com `apply`/`call`
- **Return Handling:** Propagar return value do método original
- **Error Propagation:** Permitir errors propagarem (ou capturar)

## 🧠 Fundamentos Teóricos

### Basic Method Decorator

```typescript
// Method decorator básico

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log("Decorating method:", propertyKey);
  console.log("Original method:", descriptor.value);
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

// Output:
// Decorating method: add
// Original method: [Function: add]
```

**Análise:** Decorator recebe **descriptor** contendo método original em `descriptor.value`.

### Method Wrapping

```typescript
// Wrapping de método

function measure(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with:`, args);
    const start = performance.now();
    
    const result = originalMethod.apply(this, args);
    
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    
    return result;
  };
  
  return descriptor;
}

class MathService {
  @measure
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const service = new MathService();
service.fibonacci(10);
// Calling fibonacci with: [10]
// ... (recursive calls)
// fibonacci took 0.123ms
```

**Wrapping:** Substituir `descriptor.value` com função que **chama original**.

### Async Method Decorator

```typescript
// Decorator para métodos async

function retry(maxAttempts: number = 3) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          console.log(`Attempt ${attempt} failed, retrying...`);
          
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
      
      throw lastError;
    };
    
    return descriptor;
  };
}

class APIClient {
  @retry(3)
  async fetchData(url: string) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    return response.json();
  }
}

const client = new APIClient();
await client.fetchData("https://api.example.com/data");
// Se falhar: tenta 3 vezes com delay crescente
```

**Async:** Decorator funciona com **métodos async** - usar `await` internamente.

### Princípios e Conceitos Subjacentes

#### Memoization Decorator

```typescript
// Decorator para memoization

function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}`);
      return cache.get(key);
    }
    
    console.log(`Cache miss, computing ${propertyKey}`);
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @memoize
  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

const calc = new Calculator();
calc.factorial(5);  // Cache miss, computing factorial
calc.factorial(5);  // Cache hit for factorial
```

**Memoization:** Cache automático de **resultados** baseado em argumentos.

#### Validation Decorator

```typescript
// Decorator para validação de argumentos

function validateArgs(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      if (args[i] === null || args[i] === undefined) {
        throw new Error(`Argument ${i} in ${propertyKey} cannot be null or undefined`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @validateArgs
  createUser(name: string, email: string) {
    return { name, email };
  }
}

const service = new UserService();
service.createUser("Alice", "alice@example.com");  // ✓ OK
// service.createUser(null, "test@example.com");  // ✗ Error
```

**Validation:** Validar **argumentos** antes de executar método.

### Readonly Decorator

```typescript
// Decorator para tornar método readonly

function readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
  return descriptor;
}

class MyClass {
  @readonly
  importantMethod() {
    return "important data";
  }
}

const instance = new MyClass();
console.log(instance.importantMethod());  // "important data"

// Tentar sobrescrever - falha em strict mode
// instance.importantMethod = () => "hacked";  // Error em strict mode
```

**Readonly:** Tornar método **não substituível**.

#### Deprecation Decorator

```typescript
// Decorator para deprecation warnings

function deprecated(message?: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      console.warn(`DEPRECATED: ${propertyKey} is deprecated. ${message || ''}`);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class LegacyAPI {
  @deprecated("Use newMethod() instead")
  oldMethod() {
    return "old";
  }
  
  newMethod() {
    return "new";
  }
}

const api = new LegacyAPI();
api.oldMethod();
// Warning: DEPRECATED: oldMethod is deprecated. Use newMethod() instead
```

**Deprecation:** Avisar sobre **métodos deprecados**.

### Throttle Decorator

```typescript
// Decorator para throttle

function throttle(delay: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let lastCall = 0;
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      
      if (now - lastCall >= delay) {
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
    console.log("Scroll event processed");
  }
}

const handler = new EventHandler();

// Simular múltiplas chamadas rápidas
handler.onScroll();  // Scroll event processed
handler.onScroll();  // Throttled: onScroll
handler.onScroll();  // Throttled: onScroll

// Após 1 segundo
setTimeout(() => {
  handler.onScroll();  // Scroll event processed
}, 1100);
```

**Throttle:** Limitar **frequência** de execuções.

#### Debounce Decorator

```typescript
// Decorator para debounce

function debounce(delay: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeoutId: NodeJS.Timeout;
    
    descriptor.value = function(...args: any[]) {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };
    
    return descriptor;
  };
}

class SearchComponent {
  @debounce(500)
  onSearchInput(query: string) {
    console.log("Searching for:", query);
    // API call
  }
}

const component = new SearchComponent();

// Múltiplas chamadas rápidas - apenas última executa após delay
component.onSearchInput("a");
component.onSearchInput("ab");
component.onSearchInput("abc");
// Após 500ms: Searching for: abc
```

**Debounce:** Executar apenas **após delay** sem novas chamadas.

### Modelo Mental para Compreensão

Pense em method decorator como **interceptador de chamadas telefônicas**:

**Método original:** Pessoa que recebe chamada
**Decorator:** Secretária que intercepta
**Chamada de método:** Telefonema entrante
**Wrapper:** Secretária decide se passa chamada, registra, etc

**Analogia - Porteiro de Prédio:**

**Método:** Apartamento
**Decorator:** Porteiro
**Caller:** Visitante
**Execute:** Porteiro autoriza/registra antes de permitir entrada

**Metáfora - Middleware HTTP:**

**Request:** Argumentos do método
**Middleware:** Decorator
**Handler:** Método original
**Response:** Retorno do método

**Fluxo de execução:**
```
1. Código chama método decorado
2. Decorator intercepta chamada
3. Decorator executa lógica "before"
4. Decorator chama método original com apply(this, args)
5. Método original executa
6. Decorator recebe resultado
7. Decorator executa lógica "after"
8. Decorator retorna resultado (possivelmente modificado)
```

**Exemplo visual:**
```
@log
@validate
@measure
method(arg) { }

Execução (bottom-to-top):
1. measure wrapper intercepta
2. measure chama validate wrapper
3. validate wrapper valida args
4. validate chama log wrapper
5. log wrapper loga
6. log chama método original
7. Método executa
8. Retorno propaga: método → log → validate → measure → caller
```

## 🔍 Análise Conceitual Profunda

### Multiple Method Decorators

```typescript
// Múltiplos decorators em método

function first(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log("first decorator");
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log("first: before");
    const result = originalMethod.apply(this, args);
    console.log("first: after");
    return result;
  };
  return descriptor;
}

function second(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log("second decorator");
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log("second: before");
    const result = originalMethod.apply(this, args);
    console.log("second: after");
    return result;
  };
  return descriptor;
}

class MyClass {
  @first
  @second
  method() {
    console.log("method executing");
  }
}

const instance = new MyClass();
instance.method();

// Output:
// second decorator
// first decorator
// first: before
// second: before
// method executing
// second: after
// first: after
```

**Order:** Decorators **avaliados bottom-to-top**, execução **nested** (último decorator executa primeiro during runtime).

#### Authorization Decorator

```typescript
// Decorator para autorização

interface User {
  role: string;
}

function authorize(allowedRoles: string[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      // Obter usuário atual (simplificado)
      const currentUser: User = (this as any).currentUser;
      
      if (!currentUser) {
        throw new Error("Unauthorized: not logged in");
      }
      
      if (!allowedRoles.includes(currentUser.role)) {
        throw new Error(`Unauthorized: ${propertyKey} requires one of roles: ${allowedRoles.join(', ')}`);
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class AdminController {
  currentUser: User = { role: 'user' };
  
  @authorize(['admin'])
  deleteUser(id: number) {
    console.log(`Deleting user ${id}`);
  }
  
  @authorize(['admin', 'moderator'])
  banUser(id: number) {
    console.log(`Banning user ${id}`);
  }
}

const controller = new AdminController();

// controller.deleteUser(1);  // Error: Unauthorized

controller.currentUser = { role: 'admin' };
controller.deleteUser(1);  // Deleting user 1
```

**Authorization:** Verificar **permissões** antes de executar.

### Transaction Decorator

```typescript
// Decorator para transações

interface Database {
  beginTransaction(): void;
  commit(): void;
  rollback(): void;
}

function transactional(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = async function(...args: any[]) {
    const db: Database = (this as any).db;
    
    db.beginTransaction();
    console.log("Transaction started");
    
    try {
      const result = await originalMethod.apply(this, args);
      db.commit();
      console.log("Transaction committed");
      return result;
    } catch (error) {
      db.rollback();
      console.log("Transaction rolled back");
      throw error;
    }
  };
  
  return descriptor;
}

class UserService {
  db: Database = {
    beginTransaction() { console.log("BEGIN") },
    commit() { console.log("COMMIT") },
    rollback() { console.log("ROLLBACK") }
  };
  
  @transactional
  async createUserWithProfile(userData: any, profileData: any) {
    // Criar usuário
    console.log("Creating user...");
    
    // Criar perfil
    console.log("Creating profile...");
    
    return { user: userData, profile: profileData };
  }
}

const service = new UserService();
await service.createUserWithProfile({ name: "Alice" }, { bio: "Developer" });
// Transaction started
// BEGIN
// Creating user...
// Creating profile...
// COMMIT
// Transaction committed
```

**Transaction:** Gerenciar **transações** automaticamente.

#### Rate Limiting Decorator

```typescript
// Decorator para rate limiting

function rateLimit(maxCalls: number, windowMs: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const calls: number[] = [];
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      
      // Remover chamadas antigas
      while (calls.length > 0 && calls[0] < now - windowMs) {
        calls.shift();
      }
      
      if (calls.length >= maxCalls) {
        throw new Error(`Rate limit exceeded: max ${maxCalls} calls per ${windowMs}ms`);
      }
      
      calls.push(now);
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

class APIClient {
  @rateLimit(3, 1000)  // Max 3 calls per second
  apiCall(endpoint: string) {
    console.log(`Calling ${endpoint}`);
    return { success: true };
  }
}

const client = new APIClient();

client.apiCall("/users");    // ✓ OK
client.apiCall("/products");  // ✓ OK
client.apiCall("/orders");    // ✓ OK
// client.apiCall("/items");  // ✗ Error: Rate limit exceeded
```

**Rate Limiting:** Limitar **número de chamadas** em janela de tempo.

### Circuit Breaker

```typescript
// Decorator para circuit breaker pattern

function circuitBreaker(threshold: number, timeout: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let failures = 0;
    let circuitOpen = false;
    let nextAttempt = Date.now();
    
    descriptor.value = async function(...args: any[]) {
      if (circuitOpen && Date.now() < nextAttempt) {
        throw new Error("Circuit breaker is OPEN");
      }
      
      try {
        const result = await originalMethod.apply(this, args);
        
        // Reset on success
        failures = 0;
        circuitOpen = false;
        
        return result;
      } catch (error) {
        failures++;
        console.log(`Failure ${failures}/${threshold}`);
        
        if (failures >= threshold) {
          circuitOpen = true;
          nextAttempt = Date.now() + timeout;
          console.log(`Circuit breaker OPEN for ${timeout}ms`);
        }
        
        throw error;
      }
    };
    
    return descriptor;
  };
}

class ExternalService {
  @circuitBreaker(3, 5000)  // Open circuit after 3 failures, reset after 5s
  async callExternalAPI() {
    // Simular API externa instável
    if (Math.random() > 0.5) {
      throw new Error("External API error");
    }
    return { success: true };
  }
}

const service = new ExternalService();

for (let i = 0; i < 10; i++) {
  try {
    await service.callExternalAPI();
    console.log("Success");
  } catch (error) {
    console.log("Failed:", (error as Error).message);
  }
}
```

**Circuit Breaker:** Prevenir **chamadas repetitivas** a serviço falho.

## 🎯 Aplicabilidade e Contextos

### Logging

```typescript
@log
method() { }
```

**Raciocínio:** Registrar chamadas de método automaticamente.

### Performance Monitoring

```typescript
@measure
method() { }
```

**Raciocínio:** Medir tempo de execução.

### Caching

```typescript
@memoize
expensiveComputation() { }
```

**Raciocínio:** Cache automático de resultados.

### Error Handling

```typescript
@catchErrors
async fetchData() { }
```

**Raciocínio:** Try-catch centralizado.

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```typescript
// Wrappers adicionam overhead
@decorator1
@decorator2
@decorator3
method() { }
```

**Limitação:** Múltiplos decorators aumentam overhead de execução.

### Debugging Complexity

```typescript
// Stack traces ficam complexos com decorators
```

**Consideração:** Debugging mais difícil - stack traces mostram wrappers.

### Type Safety

```typescript
// Tipos podem se perder com decorators
@decorator
method(param: string): number { }

// TypeScript pode não inferir tipo corretamente
```

**Consideração:** Tipos podem se perder após decorators.

## 🔗 Interconexões Conceituais

**Relação com AOP:** Implementa Aspect-Oriented Programming.

**Relação com Middleware:** Similar a middleware HTTP.

**Relação com Proxy Pattern:** Implementa Proxy Pattern.

**Relação com Logging:** Centraliza logging.

**Relação com Caching:** Implementa memoization.

## 🚀 Evolução e Próximos Conceitos

Dominar method decorators prepara para:
- **Parameter Decorators:** Decorar parâmetros de métodos
- **Accessor Decorators:** Decorar getters/setters
- **Decorator Factories:** Criar decorators parametrizados
- **Reflect Metadata:** Metadata avançado para métodos
- **Decorator Composition:** Compor decorators complexos
