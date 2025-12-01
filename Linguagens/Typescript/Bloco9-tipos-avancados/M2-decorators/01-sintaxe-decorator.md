# Sintaxe @decorator

## 🎯 Introdução e Definição

### Definição Conceitual

**Sintaxe `@decorator`** refere-se à notação especial do TypeScript para aplicar **decorators** - funções que **modificam ou anotam** classes, métodos, propriedades, ou parâmetros. Usando símbolo `@` seguido de nome de função, decorators são **declarativos** e **anexados** diretamente a declarações. Diferentemente de modificação imperativa, decorators são aplicados em **design-time** antes de código executar.

Conceitualmente, decorators implementam **metaprogramming** - código que modifica comportamento de outro código. Sintaxe `@decorator` é **syntactic sugar** para chamar função decorator com target como argumento. TypeScript transpila `@decorator` para chamada de função que recebe classe/método/propriedade como parâmetro, permitindo **modificação ou anotação** em tempo de declaração.

**Fundamento teórico:** Decorators derivam de **Python decorators** e **Java annotations**. Permitem **separation of concerns** - lógica transversal (logging, validação, caching) separada de lógica de negócio. TypeScript decorators são **experimentais** - requerem `experimentalDecorators: true` em `tsconfig.json`. Proposta de decorators do TC39 está em **Stage 3**.

**Pattern básico:**
```
@DecoratorFunction
class MyClass { }

// Equivalente a:
MyClass = DecoratorFunction(MyClass) || MyClass;
```

### Contexto Histórico e Evolução

**Python 2.4 (2004):** Introdução de decorators.

```python
# Python - decorator syntax
@staticmethod
def my_function():
    pass

# Equivalente a:
def my_function():
    pass
my_function = staticmethod(my_function)
```

**Java 5 (2004):** Annotations introduzidas.

```java
// Java - annotations
@Override
public void myMethod() { }

@Deprecated
public void oldMethod() { }
```

**ECMAScript Proposal (2014):** TC39 proposta de decorators para JavaScript.

```javascript
// ECMAScript decorators proposal
@decorator
class MyClass { }
```

**TypeScript 1.5 (2015):** Decorators experimentais introduzidos.

```typescript
// TypeScript 1.5 - experimental decorators
// tsconfig.json: "experimentalDecorators": true

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

**Angular 2 (2016):** Uso extensivo de decorators.

```typescript
// Angular - decorators everywhere
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @Input() name: string;
  @Output() clicked = new EventEmitter();
  
  @HostListener('click')
  onClick() { }
}
```

**MobX (2015):** Decorators para reactive state.

```typescript
// MobX - decorators para observables
class TodoStore {
  @observable todos = [];
  
  @computed get completedTodos() {
    return this.todos.filter(t => t.completed);
  }
  
  @action addTodo(todo) {
    this.todos.push(todo);
  }
}
```

**TypeORM (2016):** Decorators para ORM.

```typescript
// TypeORM - decorators para entities
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
  
  @Column()
  email: string;
}
```

**NestJS (2017):** Framework baseado em decorators.

```typescript
// NestJS - decorators para controllers
@Controller('users')
export class UsersController {
  @Get()
  findAll(): string {
    return 'This returns all users';
  }
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return 'User created';
  }
}
```

**TC39 Stage 3 (2022):** Nova proposta de decorators.

```javascript
// TC39 Stage 3 - decorators modernos
class MyClass {
  @logged
  method() { }
}
```

**TypeScript 5.0 (2023):** Suporte para decorators Stage 3.

```typescript
// TypeScript 5.0 - decorators Stage 3
// tsconfig.json: "experimentalDecorators": false (usa novos)

@sealed
class MyClass { }
```

**Evolução de sintaxe:**

**Era Python:**
```python
@decorator
def function(): pass
```

**Era TypeScript experimental:**
```typescript
@decorator
class MyClass { }
```

**Era TypeScript 5.0+:**
```typescript
@decorator
class MyClass { }  // Mesma syntax, implementação diferente
```

### Problema Fundamental que Resolve

Sintaxe `@decorator` resolve problemas de **código repetitivo**, **cross-cutting concerns**, e **modificação imperativa**.

**Problema 1: Lógica transversal espalhada**
```typescript
// Sem decorators - logging manual em todo método
class UserService {
  getUser(id: number) {
    console.log(`Calling getUser with ${id}`);
    const startTime = Date.now();
    
    // Lógica de negócio
    const user = this.repository.find(id);
    
    const endTime = Date.now();
    console.log(`getUser took ${endTime - startTime}ms`);
    return user;
  }
  
  createUser(data: UserData) {
    console.log(`Calling createUser`);
    const startTime = Date.now();
    
    // Lógica de negócio
    const user = this.repository.create(data);
    
    const endTime = Date.now();
    console.log(`createUser took ${endTime - startTime}ms`);
    return user;
  }
  
  // Logging repetido em cada método ❌
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
  
  // Lógica de negócio limpa, logging via decorator ✅
}
```

**Problema 2: Modificação imperativa após declaração**
```typescript
// Sem decorators - modificação imperativa
class MyClass {
  method() { }
}

// Modificar após declaração - separado e verboso
const originalMethod = MyClass.prototype.method;
MyClass.prototype.method = function(...args: any[]) {
  console.log("Before");
  const result = originalMethod.apply(this, args);
  console.log("After");
  return result;
};

// Modificação longe da declaração ❌
```

**Solução: Decorator declara modificação junto com método**
```typescript
// Com decorator - modificação declarativa
function wrap(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log("Before");
    const result = originalMethod.apply(this, args);
    console.log("After");
    return result;
  };
  return descriptor;
}

class MyClass {
  @wrap
  method() { }
  
  // Modificação declarada junto com método ✅
}
```

**Problema 3: Metadados separados de código**
```typescript
// Sem decorators - metadados externos
class User {
  id: number;
  name: string;
  email: string;
}

// Metadados de validação separados
const validationRules = {
  User: {
    name: { required: true, minLength: 3 },
    email: { required: true, format: 'email' }
  }
};

// Metadados longe da definição ❌
```

**Solução: Decorators anexam metadados à definição**
```typescript
// Com decorators - metadados junto com código
class User {
  id: number;
  
  @Required()
  @MinLength(3)
  name: string;
  
  @Required()
  @Email()
  email: string;
  
  // Metadados declarados junto com propriedades ✅
}
```

**Fundamento teórico:** Decorators promovem **declarative programming** - expressar "o que fazer" ao invés de "como fazer".

### Importância no Ecossistema

Sintaxe `@decorator` é crucial porque:

- **Declarative:** Código declarativo e legível
- **DRY:** Evitar repetição de código transversal
- **Separation of Concerns:** Separar lógica transversal de negócio
- **Metadata:** Anexar metadados a declarações
- **Framework Integration:** Usado extensivamente em frameworks (Angular, NestJS)
- **Aspect-Oriented Programming:** Implementar AOP em TypeScript
- **Clean Code:** Lógica de negócio limpa, concerns transversais via decorators
- **Maintainability:** Mudanças em lógica transversal centralizadas

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **@ Syntax:** Símbolo `@` marca decorator
2. **Function Call:** Decorator é função chamada em design-time
3. **Target Modification:** Decorator modifica/anota target
4. **Declarative:** Abordagem declarativa vs imperativa
5. **Metaprogramming:** Código que modifica código

### Pilares Fundamentais

- **Decorator Function:** Função que recebe target
- **Target:** Classe, método, propriedade, ou parâmetro
- **Design-time:** Aplicado quando classe definida
- **Transpilation:** Compilado para JavaScript válido
- **Experimental:** Requer flag em tsconfig

### Visão Geral das Nuances

- **Multiple Decorators:** Vários decorators em cascade
- **Evaluation Order:** Ordem de avaliação específica
- **Return Value:** Decorator pode retornar novo valor
- **Metadata:** Refletir metadados via Reflect API
- **Composition:** Compor decorators

## 🧠 Fundamentos Teóricos

### Basic Decorator Syntax

```typescript
// Sintaxe básica de decorator

// Definir decorator
function MyDecorator(target: any) {
  console.log("MyDecorator called with:", target);
}

// Aplicar decorator
@MyDecorator
class MyClass {
  // ...
}

// Equivalente a:
// MyClass = MyDecorator(MyClass) || MyClass;
```

**Análise:** `@MyDecorator` é syntactic sugar para `MyDecorator(MyClass)`.

### Decorator on Method

```typescript
// Decorator em método

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log("Decorating method:", propertyKey);
  console.log("Target:", target);
  console.log("Descriptor:", descriptor);
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}

// Output durante transpilação:
// Decorating method: add
// Target: Calculator { }
// Descriptor: { value: [Function], writable: true, enumerable: false, configurable: true }
```

**Target:** `target` é prototype da classe (para métodos de instância).

### Decorator on Property

```typescript
// Decorator em propriedade

function format(target: any, propertyKey: string) {
  console.log("Decorating property:", propertyKey);
  
  let value: any;
  
  const getter = () => value;
  const setter = (newValue: any) => {
    console.log(`Setting ${propertyKey} to ${newValue}`);
    value = newValue;
  };
  
  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true
  });
}

class User {
  @format
  name: string;
}

const user = new User();
user.name = "Alice";  // Output: Setting name to Alice
```

**Property Decorator:** Intercepta get/set de propriedade.

### Princípios e Conceitos Subjacentes

#### Multiple Decorators

```typescript
// Múltiplos decorators em cascata

function first() {
  console.log("first(): factory evaluated");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): decorator called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): decorator called");
  };
}

class MyClass {
  @first()
  @second()
  method() { }
}

// Output:
// first(): factory evaluated
// second(): factory evaluated
// second(): decorator called
// first(): decorator called

// Avaliação: top-to-bottom
// Execução: bottom-to-top
```

**Order:** Decorators avaliados **top-to-bottom**, executados **bottom-to-top**.

#### Decorator Composition

```typescript
// Compor decorators

function readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
  return descriptor;
}

function enumerable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
    return descriptor;
  };
}

class MyClass {
  @readonly
  @enumerable(false)
  method() { }
}

// Composição: readonly + enumerable
// method é readonly e não-enumerável
```

**Composition:** Decorators podem ser **compostos** para combinar comportamentos.

### tsconfig Configuration

```json
// tsconfig.json - habilitar decorators

{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

**Configuration:**
- `experimentalDecorators: true` - habilita decorators
- `emitDecoratorMetadata: true` - emite metadados de tipo (para Reflect)

### Transpiled Output

```typescript
// TypeScript source
@sealed
class Greeter {
  greeting: string;
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

```javascript
// Transpiled JavaScript (ES5)
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  // ... decorator logic
};

var Greeter = /** @class */ (function () {
  function Greeter() { }
  Greeter = __decorate([
    sealed
  ], Greeter);
  return Greeter;
}());

function sealed(constructor) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

**Transpilation:** TypeScript gera helper function `__decorate` para aplicar decorators.

#### Reflect Metadata

```typescript
// Reflect metadata para decorators

import "reflect-metadata";

function logType(target: any, propertyKey: string) {
  const type = Reflect.getMetadata("design:type", target, propertyKey);
  console.log(`${propertyKey} type:`, type);
}

class User {
  @logType
  name: string;  // Output: name type: String
  
  @logType
  age: number;   // Output: age type: Number
}
```

**Reflect Metadata:** `emitDecoratorMetadata` permite acessar tipos em runtime via Reflect API.

### Decorator Targets

```typescript
// Diferentes targets para decorators

// 1. Class Decorator
@classDecorator
class MyClass { }

// 2. Method Decorator
class MyClass {
  @methodDecorator
  method() { }
}

// 3. Property Decorator
class MyClass {
  @propertyDecorator
  property: string;
}

// 4. Accessor Decorator
class MyClass {
  @accessorDecorator
  get value() { return this._value; }
}

// 5. Parameter Decorator
class MyClass {
  method(@parameterDecorator param: string) { }
}
```

**Targets:** Decorators aplicáveis a 5 diferentes targets.

### Modelo Mental para Compreensão

Pense em decorators como **adesivos em presente**:

**Classe/Método:** Presente embrulhado
**Decorator:** Adesivo colado no presente
**@ Syntax:** Ato de colar adesivo
**Decorator Function:** Informação no adesivo

Adesivo **anota** (adiciona informação) ou **modifica** (altera conteúdo do presente).

**Analogia - Etiquetas em Produto:**

**Produto:** Classe ou método
**Etiqueta:** Decorator
**Informação na etiqueta:** Metadata (preço, ingredientes, etc)
**Colar etiqueta:** Aplicar decorator com `@`

**Metáfora - Selos em Documento:**

**Documento:** Declaração de classe
**Selo:** Decorator (@deprecated, @override, etc)
**Carimbar:** Aplicar decorator
**Significado do selo:** Comportamento do decorator

**Fluxo de aplicação:**
```
1. TypeScript encontra @decorator
2. Chama decorator function com target
3. Decorator modifica ou anota target
4. Retorna target modificado (opcional)
5. TypeScript usa target modificado
```

**Exemplo visual:**
```
Código:
@sealed
@logged
class MyClass { }

Equivalente funcional:
MyClass = logged(MyClass) || MyClass;
MyClass = sealed(MyClass) || MyClass;

Ordem: bottom-to-top (logged primeiro, depois sealed)
```

## 🔍 Análise Conceitual Profunda

### Decorator Evaluation Order

```typescript
// Ordem de avaliação completa

function classDecorator(target: any) {
  console.log("4. Class decorator");
}

function methodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log("2. Method decorator");
}

function propertyDecorator(target: any, propertyKey: string) {
  console.log("1. Property decorator");
}

function parameterDecorator(target: any, propertyKey: string, parameterIndex: number) {
  console.log("3. Parameter decorator");
}

@classDecorator
class MyClass {
  @propertyDecorator
  property: string;
  
  @methodDecorator
  method(@parameterDecorator param: string) { }
}

// Output:
// 1. Property decorator
// 3. Parameter decorator
// 2. Method decorator
// 4. Class decorator

// Ordem: Property → Parameter → Method/Accessor → Class
```

**Order:** Ordem específica de avaliação - importantes para interações entre decorators.

#### Decorator Return Value

```typescript
// Decorator pode retornar novo constructor

function withTimestamp<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    timestamp = new Date();
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
console.log(user.name);       // "Alice"
console.log(user.timestamp);  // Date object
```

**Return:** Decorator pode **retornar novo constructor** - substitui original.

### Method Wrapping

```typescript
// Wrapping de método com decorator

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

**Wrapping:** Decorator comum - interceptar chamadas de método.

#### Caching Decorator

```typescript
// Decorator para caching

function memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();
  
  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log("Cache hit for:", key);
      return cache.get(key);
    }
    
    console.log("Cache miss, computing...");
    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };
  
  return descriptor;
}

class Calculator {
  @memoize
  expensiveOperation(n: number): number {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += n * i;
    }
    return result;
  }
}

const calc = new Calculator();
calc.expensiveOperation(5);  // Cache miss, computing...
calc.expensiveOperation(5);  // Cache hit for: [5]
```

**Caching:** Decorator para **memoization** - cache de resultados.

### Validation Decorator

```typescript
// Decorator para validação

function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    // Validar argumentos
    for (const arg of args) {
      if (arg === null || arg === undefined) {
        throw new Error(`Argument cannot be null or undefined`);
      }
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class UserService {
  @validate
  createUser(name: string, email: string) {
    return { name, email };
  }
}

const service = new UserService();
service.createUser("Alice", "alice@example.com");  // ✓ OK
service.createUser(null, "test@example.com");      // ✗ Error
```

**Validation:** Decorator para **validação de argumentos**.

#### Deprecation Warning

```typescript
// Decorator para deprecation warning

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
api.oldMethod();  // Warning: DEPRECATED: oldMethod is deprecated. Use newMethod() instead
```

**Deprecation:** Decorator para **avisos de deprecação**.

### Access Control

```typescript
// Decorator para controle de acesso

function requiresAuth(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    // Verificar autenticação (simplificado)
    const isAuthenticated = (this as any).isAuthenticated;
    
    if (!isAuthenticated) {
      throw new Error("Unauthorized: authentication required");
    }
    
    return originalMethod.apply(this, args);
  };
  
  return descriptor;
}

class AdminController {
  isAuthenticated = false;
  
  @requiresAuth
  deleteUser(id: number) {
    console.log(`Deleting user ${id}`);
  }
}

const controller = new AdminController();
// controller.deleteUser(1);  // Error: Unauthorized

controller.isAuthenticated = true;
controller.deleteUser(1);  // Deleting user 1
```

**Access Control:** Decorator para **controle de acesso**.

#### Retry Logic

```typescript
// Decorator para retry logic

function retry(maxRetries: number = 3) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          console.log(`Attempt ${attempt} failed, retrying...`);
          
          if (attempt < maxRetries) {
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
```

**Retry:** Decorator para **retry logic** em operações async.

### Throttle and Debounce

```typescript
// Decorators para throttle e debounce

function throttle(delay: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let lastCall = 0;
    
    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return originalMethod.apply(this, args);
      }
    };
    
    return descriptor;
  };
}

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

class EventHandler {
  @throttle(1000)
  onScroll() {
    console.log("Scroll event - throttled");
  }
  
  @debounce(500)
  onInput() {
    console.log("Input event - debounced");
  }
}
```

**Throttle/Debounce:** Decorators para **controle de frequência** de chamadas.

### Binding Context

```typescript
// Decorator para bind automático

function autobind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  
  return adjustedDescriptor;
}

class Component {
  name = "MyComponent";
  
  @autobind
  handleClick() {
    console.log(this.name);
  }
}

const component = new Component();
const handler = component.handleClick;

// Sem autobind: this seria undefined
// Com autobind: this está bound
handler();  // "MyComponent"
```

**Autobind:** Decorator para **bind automático** de contexto.

## 🎯 Aplicabilidade e Contextos

### Logging and Monitoring

```typescript
@log
class Service { }
```

**Raciocínio:** Centralizar logging transversal.

### Validation

```typescript
@validate
method(param: string) { }
```

**Raciocínio:** Validação declarativa de parâmetros.

### Caching

```typescript
@memoize
expensiveComputation() { }
```

**Raciocínio:** Cache automático de resultados.

## ⚠️ Limitações e Considerações Teóricas

### Experimental Feature

```typescript
// Requer experimentalDecorators: true
```

**Limitação:** Ainda experimental - API pode mudar.

### Runtime Overhead

```typescript
// Decorators adicionam overhead
@memoize
@log
@validate
method() { }
```

**Consideração:** Múltiplos decorators aumentam overhead.

### Debugging Complexity

```typescript
// Stack traces com decorators são complexos
```

**Consideração:** Debugging mais difícil com decorators.

## 🔗 Interconexões Conceituais

**Relação com Metaprogramming:** Decorators são metaprogramming.

**Relação com AOP:** Implementam Aspect-Oriented Programming.

**Relação com Reflection:** Usam Reflect API para metadata.

**Relação com Design Patterns:** Implementam Decorator Pattern.

**Relação com Frameworks:** Usado extensivamente (Angular, NestJS).

## 🚀 Evolução e Próximos Conceitos

Dominar sintaxe `@decorator` prepara para:
- **Class Decorators:** Decorar classes completas
- **Method Decorators:** Decorar métodos específicos
- **Property Decorators:** Decorar propriedades
- **Parameter Decorators:** Decorar parâmetros
- **Decorator Factories:** Criar decorators parametrizados
