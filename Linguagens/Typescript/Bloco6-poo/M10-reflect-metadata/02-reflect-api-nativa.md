# Reflect API Nativa (ES2015)

## 🎯 Introdução

**Reflect** é objeto global do ECMAScript 2015 que fornece métodos para **operações reflexivas interceptáveis**. Todos os métodos Reflect são estáticos e espelham operações fundamentais de objetos JavaScript.

### Motivação

```typescript
// ❌ Antes do Reflect - operações inconsistentes
const obj = { name: 'Alice' };

// Get - operador
obj.name;

// Set - operador
obj.name = 'Bob';

// Delete - operador com retorno booleano
delete obj.name;

// Has - operador 'in'
'name' in obj;

// Define - Object método que lança exceção
Object.defineProperty(obj, 'age', { value: 25 });

// ✅ Com Reflect - API funcional consistente
Reflect.get(obj, 'name');
Reflect.set(obj, 'name', 'Bob');
Reflect.deleteProperty(obj, 'name');
Reflect.has(obj, 'name');
Reflect.defineProperty(obj, 'age', { value: 25 }); // Retorna boolean
```

**Vantagens**:
1. **API funcional** - métodos ao invés de operadores
2. **Retornos consistentes** - boolean para sucesso/falha
3. **Composability** - uso em higher-order functions
4. **Proxy integration** - handlers usam Reflect

## 📋 Sumário Completo

### Property Access
- `Reflect.get(target, propertyKey, receiver?)` - Ler propriedade
- `Reflect.set(target, propertyKey, value, receiver?)` - Escrever propriedade

### Property Management
- `Reflect.has(target, propertyKey)` - Verificar existência
- `Reflect.deleteProperty(target, propertyKey)` - Deletar propriedade
- `Reflect.ownKeys(target)` - Listar todas as chaves

### Property Descriptors
- `Reflect.defineProperty(target, propertyKey, descriptor)` - Definir descriptor
- `Reflect.getOwnPropertyDescriptor(target, propertyKey)` - Obter descriptor

### Prototype Chain
- `Reflect.getPrototypeOf(target)` - Obter prototype
- `Reflect.setPrototypeOf(target, prototype)` - Definir prototype

### Object Extensibility
- `Reflect.isExtensible(target)` - Verificar se extensível
- `Reflect.preventExtensions(target)` - Prevenir extensões

### Function Invocation
- `Reflect.apply(func, thisArg, argumentsList)` - Invocar função
- `Reflect.construct(constructor, argumentsList, newTarget?)` - Criar instância

## 🔍 Reflect.get()

### Sintaxe

```typescript
Reflect.get(target: object, propertyKey: PropertyKey, receiver?: any): any
```

### Comportamento

```typescript
const obj = {
  name: 'Alice',
  get greeting() {
    return `Hello, I'm ${this.name}`;
  }
};

// Acesso normal
console.log(Reflect.get(obj, 'name')); // 'Alice'

// Getter - 'this' é obj
console.log(Reflect.get(obj, 'greeting')); // "Hello, I'm Alice"

// Receiver customizado - 'this' é receiver
const other = { name: 'Bob' };
console.log(Reflect.get(obj, 'greeting', other)); // "Hello, I'm Bob"
```

### Herança

```typescript
const parent = {
  get value() {
    return 'parent';
  }
};

const child = Object.create(parent);
child.childValue = 'child';

// Busca na prototype chain
console.log(Reflect.get(child, 'value')); // 'parent'
console.log(Reflect.get(child, 'childValue')); // 'child'
```

### Símbolos

```typescript
const sym = Symbol('secret');
const obj = {
  [sym]: 'hidden value'
};

console.log(Reflect.get(obj, sym)); // 'hidden value'
```

### Comparação com Operador

```typescript
const obj = { name: 'Alice' };

// Equivalentes
obj.name;
obj['name'];
Reflect.get(obj, 'name');

// Vantagens de Reflect
function safeGet(obj: any, prop: string): any {
  return Reflect.get(obj, prop); // Funcional, composable
}

// Computed property com Reflect
const prop = 'name';
const value = Reflect.get(obj, prop);
```

## 🔍 Reflect.set()

### Sintaxe

```typescript
Reflect.set(target: object, propertyKey: PropertyKey, value: any, receiver?: any): boolean
```

### Comportamento

```typescript
const obj = { name: 'Alice' };

// Set retorna boolean (sucesso/falha)
const success = Reflect.set(obj, 'name', 'Bob');
console.log(success); // true
console.log(obj.name); // 'Bob'

// Falha em objeto frozen
Object.freeze(obj);
const failed = Reflect.set(obj, 'name', 'Charlie');
console.log(failed); // false (não lança exceção!)
console.log(obj.name); // 'Bob' (inalterado)
```

### Setter com Receiver

```typescript
const obj = {
  _value: 0,
  set value(v: number) {
    console.log('Setter called on', this);
    this._value = v;
  }
};

// Receiver padrão é target
Reflect.set(obj, 'value', 10);
console.log(obj._value); // 10

// Receiver customizado
const other = { _value: 0 };
Reflect.set(obj, 'value', 20, other); // Setter usa 'other' como 'this'
console.log(obj._value); // 10 (inalterado)
console.log(other._value); // 20 (modificado)
```

### Proxies

```typescript
const target = { count: 0 };

const proxy = new Proxy(target, {
  set(target, prop, value, receiver) {
    console.log(`Setting ${String(prop)} to ${value}`);
    
    // ✅ Usar Reflect.set preserva receiver
    return Reflect.set(target, prop, value, receiver);
  }
});

proxy.count = 5; // "Setting count to 5"
console.log(target.count); // 5
```

### Strict Mode Difference

```typescript
'use strict';

const obj = {};
Object.defineProperty(obj, 'readonly', {
  value: 'immutable',
  writable: false
});

// ❌ Operador lança TypeError em strict mode
try {
  obj.readonly = 'changed'; // TypeError!
} catch (e) {
  console.log(e);
}

// ✅ Reflect retorna false (não lança)
const success = Reflect.set(obj, 'readonly', 'changed');
console.log(success); // false
console.log(obj.readonly); // 'immutable'
```

## 🔍 Reflect.has()

### Sintaxe

```typescript
Reflect.has(target: object, propertyKey: PropertyKey): boolean
```

### Comportamento

```typescript
const obj = { name: 'Alice', age: 25 };

// Equivalente ao operador 'in'
console.log(Reflect.has(obj, 'name')); // true
console.log(Reflect.has(obj, 'email')); // false
console.log('name' in obj); // true (equivalente)
```

### Prototype Chain

```typescript
const parent = { inherited: 'value' };
const child = Object.create(parent);
child.own = 'own value';

// Busca na cadeia de prototypes
console.log(Reflect.has(child, 'own')); // true
console.log(Reflect.has(child, 'inherited')); // true
console.log(Reflect.has(child, 'nonexistent')); // false
```

### Propriedades Herdadas

```typescript
const obj = { custom: 'value' };

// Propriedades de Object.prototype
console.log(Reflect.has(obj, 'toString')); // true
console.log(Reflect.has(obj, 'hasOwnProperty')); // true
```

### Símbolos

```typescript
const sym = Symbol('key');
const obj = { [sym]: 'value' };

console.log(Reflect.has(obj, sym)); // true
```

## 🔍 Reflect.deleteProperty()

### Sintaxe

```typescript
Reflect.deleteProperty(target: object, propertyKey: PropertyKey): boolean
```

### Comportamento

```typescript
const obj = { name: 'Alice', age: 25 };

// Retorna boolean indicando sucesso
const deleted = Reflect.deleteProperty(obj, 'name');
console.log(deleted); // true
console.log(obj); // { age: 25 }

// Propriedade inexistente retorna true
const notFound = Reflect.deleteProperty(obj, 'email');
console.log(notFound); // true
```

### Non-configurable Properties

```typescript
const obj = {};
Object.defineProperty(obj, 'permanent', {
  value: 'cannot delete',
  configurable: false
});

// ❌ Operador lança TypeError em strict mode
'use strict';
try {
  delete obj.permanent; // TypeError!
} catch (e) {
  console.log(e);
}

// ✅ Reflect retorna false
const deleted = Reflect.deleteProperty(obj, 'permanent');
console.log(deleted); // false
console.log(obj.permanent); // 'cannot delete' (inalterado)
```

### Comparação

```typescript
const obj = { temp: 'value' };

// Equivalentes
delete obj.temp;
Reflect.deleteProperty(obj, 'temp');

// Vantagem de Reflect - retorno consistente
function safedelete(obj: any, prop: string): boolean {
  return Reflect.deleteProperty(obj, prop); // Boolean claro
}
```

## 🔍 Reflect.ownKeys()

### Sintaxe

```typescript
Reflect.ownKeys(target: object): (string | symbol)[]
```

### Comportamento

```typescript
const sym = Symbol('secret');

const obj = {
  name: 'Alice',
  age: 25,
  [sym]: 'hidden'
};

// Retorna TODAS as chaves (strings + symbols)
const keys = Reflect.ownKeys(obj);
console.log(keys); // ['name', 'age', Symbol(secret)]

// Comparação com Object.keys
console.log(Object.keys(obj)); // ['name', 'age'] (só strings)
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(secret)]
```

### Non-enumerable Properties

```typescript
const obj = { name: 'Alice' };
Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false
});

// Reflect.ownKeys inclui non-enumerable
console.log(Reflect.ownKeys(obj)); // ['name', 'hidden']

// Object.keys só enumerable
console.log(Object.keys(obj)); // ['name']
```

### Arrays

```typescript
const arr = ['a', 'b', 'c'];

console.log(Reflect.ownKeys(arr)); // ['0', '1', '2', 'length']
```

### Herança

```typescript
const parent = { inherited: 'value' };
const child = Object.create(parent);
child.own = 'own value';

// Só propriedades próprias (não herança)
console.log(Reflect.ownKeys(child)); // ['own']
console.log(Reflect.ownKeys(parent)); // ['inherited']
```

## 🔍 Reflect.defineProperty()

### Sintaxe

```typescript
Reflect.defineProperty(
  target: object,
  propertyKey: PropertyKey,
  descriptor: PropertyDescriptor
): boolean
```

### Comportamento

```typescript
const obj = {};

// ✅ Reflect retorna boolean
const success = Reflect.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: true,
  enumerable: true,
  configurable: true
});

console.log(success); // true
console.log(obj.name); // 'Alice'

// ❌ Object.defineProperty lança exceção ou retorna objeto
Object.defineProperty(obj, 'age', { value: 25 });
```

### Getter/Setter

```typescript
const obj = {};

Reflect.defineProperty(obj, 'fullName', {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(value: string) {
    const [first, last] = value.split(' ');
    this.firstName = first;
    this.lastName = last;
  },
  enumerable: true,
  configurable: true
});

obj.fullName = 'Alice Smith';
console.log(obj.firstName); // 'Alice'
console.log(obj.lastName); // 'Smith'
console.log(obj.fullName); // 'Alice Smith'
```

### Read-only Property

```typescript
const obj = {};

Reflect.defineProperty(obj, 'constant', {
  value: 42,
  writable: false,
  configurable: false
});

console.log(obj.constant); // 42

// Não pode modificar
const changed = Reflect.set(obj, 'constant', 99);
console.log(changed); // false
console.log(obj.constant); // 42
```

### Comparação

```typescript
const obj = {};

// ❌ Object.defineProperty - lança exceção
try {
  Object.preventExtensions(obj);
  Object.defineProperty(obj, 'new', { value: 'fail' }); // TypeError!
} catch (e) {
  console.log('Exception thrown');
}

// ✅ Reflect.defineProperty - retorna false
Object.preventExtensions(obj);
const success = Reflect.defineProperty(obj, 'new', { value: 'fail' });
console.log(success); // false (sem exceção)
```

## 🔍 Reflect.getOwnPropertyDescriptor()

### Sintaxe

```typescript
Reflect.getOwnPropertyDescriptor(target: object, propertyKey: PropertyKey): PropertyDescriptor | undefined
```

### Comportamento

```typescript
const obj = {
  name: 'Alice',
  get age() {
    return 25;
  }
};

// Data property
const nameDesc = Reflect.getOwnPropertyDescriptor(obj, 'name');
console.log(nameDesc);
// {
//   value: 'Alice',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// Accessor property
const ageDesc = Reflect.getOwnPropertyDescriptor(obj, 'age');
console.log(ageDesc);
// {
//   get: [Function: get age],
//   set: undefined,
//   enumerable: true,
//   configurable: true
// }

// Propriedade inexistente
const noDesc = Reflect.getOwnPropertyDescriptor(obj, 'email');
console.log(noDesc); // undefined
```

### Non-enumerable

```typescript
const obj = {};
Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false
});

const desc = Reflect.getOwnPropertyDescriptor(obj, 'hidden');
console.log(desc);
// {
//   value: 'secret',
//   writable: false,
//   enumerable: false,
//   configurable: false
// }
```

### Herança

```typescript
const parent = { inherited: 'value' };
const child = Object.create(parent);

// Só propriedades próprias (não herança)
const desc = Reflect.getOwnPropertyDescriptor(child, 'inherited');
console.log(desc); // undefined

const parentDesc = Reflect.getOwnPropertyDescriptor(parent, 'inherited');
console.log(parentDesc); // { value: 'value', ... }
```

## 🔍 Reflect.getPrototypeOf()

### Sintaxe

```typescript
Reflect.getPrototypeOf(target: object): object | null
```

### Comportamento

```typescript
const parent = { inherited: 'value' };
const child = Object.create(parent);

const proto = Reflect.getPrototypeOf(child);
console.log(proto === parent); // true

// Object.prototype
const objProto = Reflect.getPrototypeOf({});
console.log(objProto === Object.prototype); // true

// null prototype
const nullProto = Object.create(null);
console.log(Reflect.getPrototypeOf(nullProto)); // null
```

### Classes

```typescript
class Animal {
  speak() {
    return 'sound';
  }
}

class Dog extends Animal {
  speak() {
    return 'bark';
  }
}

const dog = new Dog();

// Prototype é Dog.prototype
const proto1 = Reflect.getPrototypeOf(dog);
console.log(proto1 === Dog.prototype); // true

// Prototype de Dog.prototype é Animal.prototype
const proto2 = Reflect.getPrototypeOf(proto1);
console.log(proto2 === Animal.prototype); // true
```

### Comparação

```typescript
const obj = {};

// Equivalentes
Object.getPrototypeOf(obj);
Reflect.getPrototypeOf(obj);
obj.__proto__; // ❌ Deprecated
```

## 🔍 Reflect.setPrototypeOf()

### Sintaxe

```typescript
Reflect.setPrototypeOf(target: object, prototype: object | null): boolean
```

### Comportamento

```typescript
const parent = {
  greet() {
    return 'Hello';
  }
};

const child = { name: 'Alice' };

// Definir prototype
const success = Reflect.setPrototypeOf(child, parent);
console.log(success); // true

// child agora herda de parent
console.log(child.greet()); // 'Hello'
```

### Falha

```typescript
const obj = {};
Object.preventExtensions(obj);

// Não pode mudar prototype de objeto non-extensible
const success = Reflect.setPrototypeOf(obj, { new: 'proto' });
console.log(success); // false
```

### Circular Reference Prevention

```typescript
const obj1 = {};
const obj2 = {};

Reflect.setPrototypeOf(obj1, obj2);

// Circular reference é prevenida
const circular = Reflect.setPrototypeOf(obj2, obj1);
console.log(circular); // false
```

### Comparação

```typescript
const obj = {};
const proto = { custom: 'value' };

// ❌ Object.setPrototypeOf - lança exceção em falha
Object.setPrototypeOf(obj, proto);

// ✅ Reflect.setPrototypeOf - retorna boolean
Reflect.setPrototypeOf(obj, proto);
```

## 🔍 Reflect.isExtensible()

### Sintaxe

```typescript
Reflect.isExtensible(target: object): boolean
```

### Comportamento

```typescript
const obj = { name: 'Alice' };

console.log(Reflect.isExtensible(obj)); // true

// Após preventExtensions
Object.preventExtensions(obj);
console.log(Reflect.isExtensible(obj)); // false

// Após freeze
const frozen = Object.freeze({ value: 1 });
console.log(Reflect.isExtensible(frozen)); // false

// Após seal
const sealed = Object.seal({ value: 2 });
console.log(Reflect.isExtensible(sealed)); // false
```

### Comparação

```typescript
const obj = {};

// Equivalentes
Object.isExtensible(obj);
Reflect.isExtensible(obj);
```

## 🔍 Reflect.preventExtensions()

### Sintaxe

```typescript
Reflect.preventExtensions(target: object): boolean
```

### Comportamento

```typescript
const obj = { name: 'Alice' };

// Prevenir novas propriedades
const success = Reflect.preventExtensions(obj);
console.log(success); // true

// Não pode adicionar novas propriedades
const added = Reflect.set(obj, 'age', 25);
console.log(added); // false
console.log(obj.age); // undefined

// Propriedades existentes podem ser modificadas
const modified = Reflect.set(obj, 'name', 'Bob');
console.log(modified); // true
console.log(obj.name); // 'Bob'
```

### Comparação

```typescript
const obj = {};

// ❌ Object.preventExtensions - retorna objeto
const result1 = Object.preventExtensions(obj);
console.log(result1 === obj); // true

// ✅ Reflect.preventExtensions - retorna boolean
const result2 = Reflect.preventExtensions({});
console.log(typeof result2); // 'boolean'
```

## 🔍 Reflect.apply()

### Sintaxe

```typescript
Reflect.apply(target: Function, thisArg: any, argumentsList: ArrayLike<any>): any
```

### Comportamento

```typescript
function greet(greeting: string, punctuation: string) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };

// Invocar função com 'this' customizado
const result = Reflect.apply(greet, person, ['Hello', '!']);
console.log(result); // "Hello, I'm Alice!"

// Equivalente a
greet.apply(person, ['Hello', '!']);
```

### Array Methods

```typescript
const arr = [1, 2, 3, 4, 5];

// Math.max com array
const max = Reflect.apply(Math.max, null, arr);
console.log(max); // 5

// Equivalente a
Math.max.apply(null, arr);
Math.max(...arr);
```

### Variadic Functions

```typescript
function sum(...numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

const result = Reflect.apply(sum, null, [1, 2, 3, 4]);
console.log(result); // 10
```

### Comparação

```typescript
function func() {}

// Equivalentes
func.apply(thisArg, args);
func.call(thisArg, ...args);
Reflect.apply(func, thisArg, args);
```

## 🔍 Reflect.construct()

### Sintaxe

```typescript
Reflect.construct(target: Function, argumentsList: ArrayLike<any>, newTarget?: Function): any
```

### Comportamento

```typescript
class Person {
  constructor(public name: string, public age: number) {}
}

// Criar instância
const person = Reflect.construct(Person, ['Alice', 25]);
console.log(person); // Person { name: 'Alice', age: 25 }
console.log(person instanceof Person); // true

// Equivalente a
new Person('Alice', 25);
```

### newTarget Parameter

```typescript
class Animal {
  constructor(public name: string) {}
}

class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
}

// Criar instância de Animal, mas prototype de Dog
const instance = Reflect.construct(Animal, ['Buddy'], Dog);
console.log(instance.name); // 'Buddy'
console.log(instance instanceof Animal); // true
console.log(instance instanceof Dog); // true (!)
console.log(Object.getPrototypeOf(instance) === Dog.prototype); // true
```

### Factory Pattern

```typescript
class Product {
  constructor(public id: number, public name: string) {}
}

function createProduct(type: typeof Product, ...args: any[]) {
  return Reflect.construct(type, args);
}

const product = createProduct(Product, 1, 'Widget');
console.log(product); // Product { id: 1, name: 'Widget' }
```

### Comparação

```typescript
class Example {}

// Equivalentes
new Example();
Reflect.construct(Example, []);
```

## 🎯 Integração com Proxy

### Handler Completo

```typescript
const target = {
  name: 'Alice',
  age: 25,
  get greeting() {
    return `Hello, I'm ${this.name}`;
  }
};

const handler: ProxyHandler<typeof target> = {
  get(target, prop, receiver) {
    console.log(`GET ${String(prop)}`);
    return Reflect.get(target, prop, receiver);
  },
  
  set(target, prop, value, receiver) {
    console.log(`SET ${String(prop)} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  },
  
  has(target, prop) {
    console.log(`HAS ${String(prop)}`);
    return Reflect.has(target, prop);
  },
  
  deleteProperty(target, prop) {
    console.log(`DELETE ${String(prop)}`);
    return Reflect.deleteProperty(target, prop);
  },
  
  ownKeys(target) {
    console.log('OWN_KEYS');
    return Reflect.ownKeys(target);
  },
  
  getOwnPropertyDescriptor(target, prop) {
    console.log(`GET_DESCRIPTOR ${String(prop)}`);
    return Reflect.getOwnPropertyDescriptor(target, prop);
  },
  
  defineProperty(target, prop, descriptor) {
    console.log(`DEFINE ${String(prop)}`);
    return Reflect.defineProperty(target, prop, descriptor);
  }
};

const proxy = new Proxy(target, handler);

proxy.name; // "GET name"
proxy.age = 30; // "SET age = 30"
'greeting' in proxy; // "HAS greeting"
delete proxy.age; // "DELETE age"
Object.keys(proxy); // "OWN_KEYS"
```

### Validação com Reflect

```typescript
const target = { value: 0 };

const proxy = new Proxy(target, {
  set(target, prop, value, receiver) {
    if (prop === 'value' && typeof value !== 'number') {
      throw new TypeError('value must be a number');
    }
    
    return Reflect.set(target, prop, value, receiver);
  }
});

proxy.value = 10; // OK
try {
  proxy.value = 'invalid'; // TypeError!
} catch (e) {
  console.log(e.message); // 'value must be a number'
}
```

---

**Conclusão**: Reflect API fornece interface funcional padronizada para operações fundamentais de objetos JavaScript. Todos os métodos retornam valores consistentes (boolean/valor/undefined) ao invés de lançar exceções, tornando código mais robusto. Integração perfeita com Proxy handlers é caso de uso primário.

## 📚 Próximo Arquivo

**03-metadata-reflection-api.md** - API completa de Reflect Metadata (biblioteca `reflect-metadata`)
