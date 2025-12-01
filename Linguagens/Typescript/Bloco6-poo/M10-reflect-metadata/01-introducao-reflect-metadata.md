# Reflect e Reflect Metadata: Introdução Completa

## 🎯 Introdução e Definição

**Reflect** é API nativa do ECMAScript (ES2015) que fornece métodos para **metaprogramação**: interceptar, examinar e modificar operações de objetos em tempo de execução. **Reflect Metadata** é extensão (biblioteca `reflect-metadata`) que adiciona capacidade de **anexar e ler metadata** arbitrária em classes, métodos, propriedades.

Conceitualmente, Reflect representa **abstração sobre operações de objeto**, permitindo programação introspectiva onde código pode examinar sua própria estrutura. Reflect Metadata adiciona **sistema de anotações** similar a Java Annotations ou C# Attributes.

### Problema que Resolve

```typescript
// ❌ Sem Reflect - manipulação direta complicada
function createProxy(obj: any, handler: any) {
  // Métodos imperativos não padronizados
  return new Proxy(obj, {
    get(target, prop) {
      return target[prop]; // Acesso direto
    },
    set(target, prop, value) {
      target[prop] = value; // Atribuição direta
      return true;
    }
  });
}

// ✅ Com Reflect - API funcional padronizada
function createProxy(obj: any, handler: any) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver); // API funcional
    },
    set(target, prop, value, receiver) {
      return Reflect.set(target, prop, value, receiver);
    }
  });
}

// ❌ Sem Reflect Metadata - impossível anexar metadata
class User {
  name: string; // Não há como marcar como "required" em runtime
}

// ✅ Com Reflect Metadata - metadata declarativa
import 'reflect-metadata';

const requiredKey = Symbol('required');

function Required(target: any, propertyKey: string) {
  Reflect.defineMetadata(requiredKey, true, target, propertyKey);
}

class User {
  @Required
  name: string; // Metadata indica "required"
}

const isRequired = Reflect.getMetadata(requiredKey, User.prototype, 'name');
console.log(isRequired); // true
```

## 📋 Sumário

### Reflect API Nativa (ES2015)
- `Reflect.get()` / `Reflect.set()` - Acesso a propriedades
- `Reflect.has()` - Verificar existência
- `Reflect.deleteProperty()` - Deletar propriedade
- `Reflect.ownKeys()` - Listar chaves
- `Reflect.construct()` - Criar instância
- `Reflect.apply()` - Invocar função
- `Reflect.getPrototypeOf()` / `Reflect.setPrototypeOf()`
- `Reflect.defineProperty()` / `Reflect.getOwnPropertyDescriptor()`

### Reflect Metadata API (biblioteca)
- `Reflect.defineMetadata()` - Definir metadata
- `Reflect.getMetadata()` - Ler metadata
- `Reflect.hasMetadata()` - Verificar metadata
- `Reflect.deleteMetadata()` - Remover metadata
- `Reflect.getMetadataKeys()` - Listar chaves de metadata
- Design-time type metadata (`design:type`, `design:paramtypes`, `design:returntype`)

## 🧠 Fundamentos Teóricos

### Metaprogramação

**Metaprogramação** é código que **manipula código**. Em TypeScript/JavaScript, Reflect permite:

1. **Introspection**: Examinar estrutura de objetos (propriedades, métodos, prototypes)
2. **Intercession**: Modificar comportamento (proxies, property descriptors)
3. **Reflection**: Informação sobre tipos em runtime (com metadata)

```typescript
// Introspection - examinar
const keys = Reflect.ownKeys(obj);
const proto = Reflect.getPrototypeOf(obj);

// Intercession - modificar
Reflect.set(obj, 'prop', newValue);
Reflect.defineProperty(obj, 'prop', { writable: false });

// Reflection - metadata
const type = Reflect.getMetadata('design:type', target, propertyKey);
```

### Metadata vs Properties

```typescript
class Example {
  // Property - armazena valor
  name: string = 'Alice';
  
  // Metadata - armazena informação SOBRE propriedade
  // (não visível sem Reflect API)
}

const ex = new Example();

// Acessar property
console.log(ex.name); // 'Alice'

// Acessar metadata (precisa ter sido definida)
const metadata = Reflect.getMetadata('custom:info', ex, 'name');
```

**Diferença crucial**: Properties são dados do objeto, Metadata são **dados sobre o objeto** (meta-informação).

### Design-time vs Runtime

```typescript
import 'reflect-metadata';

class User {
  name: string;
  age: number;
}

// Design-time: TypeScript conhece tipos
// Runtime: JavaScript não tem tipos

// Com emitDecoratorMetadata: true
// TypeScript emite metadata de tipo em runtime
const nameType = Reflect.getMetadata('design:type', User.prototype, 'name');
console.log(nameType); // [Function: String]

const ageType = Reflect.getMetadata('design:type', User.prototype, 'age');
console.log(ageType); // [Function: Number]
```

## 🔍 Reflect API Nativa - Visão Geral

### Reflect vs Operadores Tradicionais

```typescript
const obj = { name: 'Alice', age: 25 };

// Tradicional vs Reflect
obj.name;                           // vs  Reflect.get(obj, 'name')
obj.name = 'Bob';                   // vs  Reflect.set(obj, 'name', 'Bob')
'name' in obj;                      // vs  Reflect.has(obj, 'name')
delete obj.name;                    // vs  Reflect.deleteProperty(obj, 'name')
Object.keys(obj);                   // vs  Reflect.ownKeys(obj)
new Constructor();                  // vs  Reflect.construct(Constructor, [])
func.apply(thisArg, args);          // vs  Reflect.apply(func, thisArg, args)
Object.getPrototypeOf(obj);         // vs  Reflect.getPrototypeOf(obj)
Object.defineProperty(obj, ...);    // vs  Reflect.defineProperty(obj, ...)
```

**Vantagens de Reflect**:
1. **API funcional** consistente (retorna boolean/valor ao invés de throw)
2. **Composability** com Proxy handlers
3. **Receiver context** preservado em getters/setters
4. **Padronização** de operações reflexivas

### Exemplo: Reflect em Proxy

```typescript
const target = {
  name: 'Alice',
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    console.log(`Getting ${String(prop)}`);
    // ✅ Usar Reflect preserva 'this' context em getters
    return Reflect.get(target, prop, receiver);
  },
  
  set(target, prop, value, receiver) {
    console.log(`Setting ${String(prop)} to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
});

proxy.name = 'Bob'; // "Setting name to Bob"
console.log(proxy.greet()); // "Getting greet" → "Hello, I'm Bob"
```

## 🎯 Reflect Metadata - Visão Geral

### Setup Necessário

```bash
npm install reflect-metadata
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // ← Emite metadata de tipo
  }
}
```

```typescript
// index.ts - PRIMEIRA linha
import 'reflect-metadata';
```

### Conceito de Metadata Keys

```typescript
import 'reflect-metadata';

// Metadata = Map<MetadataKey, MetadataValue>
// Cada target+propertyKey pode ter múltiplas entradas

const target = {};

// Definir múltiplas metadata com chaves diferentes
Reflect.defineMetadata('key1', 'value1', target);
Reflect.defineMetadata('key2', 'value2', target);
Reflect.defineMetadata('custom:validation', { required: true }, target);

// Ler
console.log(Reflect.getMetadata('key1', target)); // 'value1'
console.log(Reflect.getMetadata('key2', target)); // 'value2'

// Listar todas as chaves
const keys = Reflect.getMetadataKeys(target);
console.log(keys); // ['key1', 'key2', 'custom:validation']
```

### Metadata em Classes, Métodos, Propriedades

```typescript
import 'reflect-metadata';

// Metadata em CLASSE
Reflect.defineMetadata('class:meta', { tableName: 'users' }, User);

// Metadata em PROPRIEDADE
Reflect.defineMetadata('prop:meta', { required: true }, User.prototype, 'name');

// Metadata em MÉTODO
Reflect.defineMetadata('method:meta', { auth: true }, User.prototype, 'save');

class User {
  name: string;
  
  save() {
    // ...
  }
}

// Ler metadata
const classMeta = Reflect.getMetadata('class:meta', User);
const propMeta = Reflect.getMetadata('prop:meta', User.prototype, 'name');
const methodMeta = Reflect.getMetadata('method:meta', User.prototype, 'save');

console.log(classMeta); // { tableName: 'users' }
console.log(propMeta); // { required: true }
console.log(methodMeta); // { auth: true }
```

## 🎯 Aplicabilidade

### 1. Dependency Injection

```typescript
import 'reflect-metadata';

const injectableKey = Symbol('injectable');
const injectKey = Symbol('inject');

function Injectable() {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(injectableKey, true, target);
    return target;
  };
}

function Inject(token: any) {
  return function(target: any, propertyKey: string | undefined, parameterIndex: number) {
    const existingInjections = Reflect.getMetadata(injectKey, target) || [];
    existingInjections.push({ index: parameterIndex, token });
    Reflect.defineMetadata(injectKey, existingInjections, target);
  };
}

@Injectable()
class Database {
  query(sql: string) {
    console.log('Executing:', sql);
  }
}

@Injectable()
class UserService {
  constructor(@Inject(Database) private db: Database) {}
  
  findAll() {
    this.db.query('SELECT * FROM users');
  }
}

// Container resolve dependencies usando metadata
class Container {
  resolve<T>(token: new (...args: any[]) => T): T {
    const injections = Reflect.getMetadata(injectKey, token) || [];
    
    const args = injections.map((inj: any) => this.resolve(inj.token));
    
    return new token(...args);
  }
}

const container = new Container();
const service = container.resolve(UserService);
service.findAll(); // "Executing: SELECT * FROM users"
```

### 2. Validation Framework

```typescript
import 'reflect-metadata';

const validationKey = Symbol('validation');

function IsEmail(target: any, propertyKey: string) {
  const rules = Reflect.getMetadata(validationKey, target) || [];
  rules.push({
    property: propertyKey,
    validator: (v: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: `${propertyKey} must be valid email`
  });
  Reflect.defineMetadata(validationKey, rules, target);
}

function MinLength(length: number) {
  return function(target: any, propertyKey: string) {
    const rules = Reflect.getMetadata(validationKey, target) || [];
    rules.push({
      property: propertyKey,
      validator: (v: any) => typeof v === 'string' && v.length >= length,
      message: `${propertyKey} must be at least ${length} characters`
    });
    Reflect.defineMetadata(validationKey, rules, target);
  };
}

class User {
  @IsEmail
  email: string;
  
  @MinLength(3)
  username: string;
}

function validate(obj: any): string[] {
  const errors: string[] = [];
  const rules = Reflect.getMetadata(validationKey, Object.getPrototypeOf(obj)) || [];
  
  for (const rule of rules) {
    if (!rule.validator(obj[rule.property])) {
      errors.push(rule.message);
    }
  }
  
  return errors;
}

const user = new User();
user.email = 'invalid';
user.username = 'ab';

console.log(validate(user));
// ['email must be valid email', 'username must be at least 3 characters']
```

### 3. ORM Column Mapping

```typescript
import 'reflect-metadata';

const entityKey = Symbol('entity');
const columnsKey = Symbol('columns');

function Entity(tableName: string) {
  return function<T extends { new(...args: any[]): {} }>(target: T) {
    Reflect.defineMetadata(entityKey, { tableName }, target);
    return target;
  };
}

function Column(options: { type: string; nullable?: boolean }) {
  return function(target: any, propertyKey: string) {
    const columns = Reflect.getMetadata(columnsKey, target) || [];
    columns.push({
      property: propertyKey,
      ...options
    });
    Reflect.defineMetadata(columnsKey, columns, target);
  };
}

@Entity('users')
class User {
  @Column({ type: 'integer' })
  id: number;
  
  @Column({ type: 'varchar(255)' })
  name: string;
  
  @Column({ type: 'varchar(255)', nullable: true })
  email?: string;
}

// Query generator
function generateCreateTable(entityClass: any): string {
  const entityMeta = Reflect.getMetadata(entityKey, entityClass);
  const columnsMeta = Reflect.getMetadata(columnsKey, entityClass.prototype);
  
  const columnDefs = columnsMeta.map((col: any) => {
    let def = `${col.property} ${col.type.toUpperCase()}`;
    if (!col.nullable) def += ' NOT NULL';
    return def;
  });
  
  return `CREATE TABLE ${entityMeta.tableName} (\n  ${columnDefs.join(',\n  ')}\n);`;
}

console.log(generateCreateTable(User));
// CREATE TABLE users (
//   id INTEGER NOT NULL,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255)
// );
```

## 🔗 Interconexões

### Com Decorators

```typescript
// Decorators são o mecanismo PRINCIPAL para usar Reflect Metadata

import 'reflect-metadata';

const metaKey = Symbol('meta');

// Decorator anexa metadata
function CustomDecorator(value: any) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata(metaKey, value, target, propertyKey);
  };
}

class Example {
  @CustomDecorator({ custom: 'data' })
  method() {}
}

// Ler metadata anexada por decorator
const meta = Reflect.getMetadata(metaKey, Example.prototype, 'method');
console.log(meta); // { custom: 'data' }
```

### Com Proxy

```typescript
// Reflect é API padrão em Proxy handlers

const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    // Verificar metadata antes de retornar
    const metadata = Reflect.getMetadata('access:level', target, prop as string);
    
    if (metadata === 'private') {
      throw new Error(`Cannot access private property ${String(prop)}`);
    }
    
    return Reflect.get(target, prop, receiver);
  }
});
```

### Com Generics

```typescript
import 'reflect-metadata';

function Repository<T>(entityClass: new () => T) {
  return function<C extends { new(...args: any[]): {} }>(constructor: C) {
    // Armazenar tipo genérico em metadata
    Reflect.defineMetadata('entity:class', entityClass, constructor);
    return constructor;
  };
}

class User {
  id: number;
  name: string;
}

@Repository(User)
class UserRepository {
  findAll(): User[] {
    const entityClass = Reflect.getMetadata('entity:class', UserRepository);
    console.log('Entity class:', entityClass.name); // 'User'
    return [];
  }
}
```

## ⚠️ Limitações

### 1. Runtime Overhead

```typescript
// Metadata adiciona overhead de memória e processamento
// Cada metadata = Map entry

// Considerar usar apenas em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  Reflect.defineMetadata('debug:info', data, target);
}
```

### 2. Type Erasure

```typescript
// TypeScript tipos complexos são perdidos em runtime

import 'reflect-metadata';

class Example {
  // Design-time: TypeScript conhece User[]
  // Runtime: metadata só sabe Array
  users: User[];
}

const type = Reflect.getMetadata('design:type', Example.prototype, 'users');
console.log(type); // [Function: Array] - perdeu informação de User
```

### 3. Requires Polyfill

```typescript
// reflect-metadata não é nativo do JavaScript
// Precisa importar biblioteca

import 'reflect-metadata'; // ← Obrigatório
```

### 4. Experimental Feature

```typescript
// emitDecoratorMetadata é experimental
// Pode mudar no futuro

// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // ← Experimental
  }
}
```

## 🚀 Evolução

### TC39 Decorator Metadata Proposal

```typescript
// Futura API nativa (Stage 3)
// context.metadata ao invés de Reflect.defineMetadata

function MyDecorator(value: any, context: DecoratorContext) {
  context.metadata[Symbol.for('custom:key')] = 'value';
}

class Example {
  @MyDecorator
  method() {}
}

// Acessar via Symbol.metadata
const metadata = Example[Symbol.metadata];
console.log(metadata[Symbol.for('custom:key')]); // 'value'
```

### Metadata API Padronizada

Proposta para padronizar Reflect Metadata como parte do ECMAScript, eliminando necessidade de biblioteca externa.

---

**Conclusão**: Reflect API fornece metaprogramação funcional para JavaScript. Reflect Metadata adiciona sistema de anotações poderoso, essencial para frameworks modernos (Angular, NestJS, TypeORM). Combinação permite criar código altamente declarativo e introspectivo.

## 📚 Próximos Arquivos

1. **02-reflect-api-nativa.md** - Métodos Reflect nativos detalhados
2. **03-metadata-reflection-api.md** - API completa de Reflect Metadata
3. **04-manipulacao-classes.md** - Introspection e modificação de classes
4. **05-manipulacao-metodos.md** - Examinar e interceptar métodos
5. **06-manipulacao-propriedades.md** - Property descriptors e metadata
6. **07-design-type-metadata.md** - Type metadata em runtime
7. **08-padroes-avancados-reflect.md** - Patterns complexos
8. **09-guia-pratico-reflect.md** - Uso prático e exemplos reais
