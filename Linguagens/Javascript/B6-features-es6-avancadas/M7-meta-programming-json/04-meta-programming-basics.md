# Meta-Programming: Property Descriptors e Object Control

## 🎯 Introdução e Definição

### Definição Conceitual

**Meta-programming** é a capacidade de **programar o comportamento da própria linguagem**, permitindo **controlar como propriedades funcionam**, **definir características de objetos** (mutabilidade, extensibilidade), e **interceptar operações** em objetos através de **property descriptors**, **Object.defineProperty()**, **Object.freeze()**, **Object.seal()**, e **Object.preventExtensions()**.

**Técnicas principais:**

1. **Property descriptors:** Configurar propriedades (writable, enumerable, configurable)
2. **Object.defineProperty():** Definir propriedades com controle fino
3. **Object.getOwnPropertyDescriptor():** Inspecionar descriptors
4. **Object.freeze():** Tornar objeto completamente imutável
5. **Object.seal():** Prevenir adição/remoção de propriedades
6. **Object.preventExtensions():** Prevenir apenas adição

**Sintaxe:**

```javascript
// Definir propriedade com descriptor
Object.defineProperty(obj, 'prop', {
    value: 42,
    writable: false,      // Não pode ser alterado
    enumerable: true,     // Aparece em for...in
    configurable: false   // Não pode deletar ou reconfigurar
});

// Obter descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, 'prop');

// Congelar objeto (completamente imutável)
Object.freeze(obj);

// Selar objeto (não pode add/remove props)
Object.seal(obj);

// Prevenir extensões (não pode adicionar props)
Object.preventExtensions(obj);
```

### Características Fundamentais

**Meta-programming:**

- **Property descriptors:** Controlar comportamento de propriedades
- **Attributes:** `value`, `writable`, `enumerable`, `configurable`
- **Accessor descriptors:** `get`, `set` (getters/setters)
- **Immutability:** Freeze, seal, preventExtensions
- **Introspection:** Inspecionar características de objetos
- **Fine control:** Controle granular sobre objetos

### Property Descriptors: Anatomia

**Data descriptor:**

```javascript
{
    value: 42,              // Valor da propriedade
    writable: true,         // Pode ser alterado? (default: false)
    enumerable: true,       // Aparece em for...in? (default: false)
    configurable: true      // Pode deletar/reconfigurar? (default: false)
}
```

**Accessor descriptor:**

```javascript
{
    get: function() {       // Getter function
        return this._value;
    },
    set: function(newVal) { // Setter function
        this._value = newVal;
    },
    enumerable: true,       // Aparece em for...in?
    configurable: true      // Pode deletar/reconfigurar?
}
```

**⚠️ Data e Accessor são mutuamente exclusivos:**

```javascript
// ❌ ERRO: misturar value com get/set
Object.defineProperty(obj, 'prop', {
    value: 42,           // Data descriptor
    get() { return 10; } // Accessor descriptor
    // TypeError: Invalid property descriptor
});
```

### Contexto Histórico e Motivação

**Problema ES3:** Sem controle sobre propriedades

```javascript
// ES3 - propriedades sempre mutáveis
const obj = { name: 'Alice' };

obj.name = 'Bob';  // Pode alterar
delete obj.name;   // Pode deletar

// Impossível criar constantes verdadeiras
// Impossível criar propriedades hidden (non-enumerable)
```

**ES5 (2009):** Property descriptors introduzidos

```javascript
// ✅ ES5 - controle fino
const obj = {};

Object.defineProperty(obj, 'ID', {
    value: 123,
    writable: false,      // Constante!
    enumerable: false,    // Hidden em for...in
    configurable: false   // Não pode deletar
});

obj.ID = 456;  // Ignorado (strict mode: TypeError)
console.log(obj.ID);  // 123 (não mudou)

delete obj.ID;  // Ignorado (strict mode: TypeError)
console.log(obj.ID);  // 123 (ainda existe)

for (let key in obj) {
    console.log(key);  // Não imprime (não enumerável)
}
```

**Motivações principais:**

1. **Immutability:** Criar objetos e propriedades imutáveis
2. **Privacy:** Propriedades não enumeráveis (hidden)
3. **Constants:** Propriedades read-only
4. **Security:** Prevenir modificação de objetos críticos
5. **Framework design:** APIs mais robustas

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Property descriptors:** Metadados que controlam propriedades
2. **Data vs Accessor:** Dois tipos de descriptors
3. **Attributes:** `writable`, `enumerable`, `configurable`
4. **Object mutability:** Freeze, seal, preventExtensions
5. **Introspection:** Obter e inspecionar descriptors

### Pilares Fundamentais

- **`Object.defineProperty()`:** Definir propriedade com descriptor
- **`Object.getOwnPropertyDescriptor()`:** Obter descriptor
- **`Object.freeze()`:** Imutabilidade completa
- **`Object.seal()`:** Prevenir add/remove props
- **`Object.preventExtensions()`:** Prevenir apenas add

### Visão Geral das Nuances

- **Default values:** Descriptors têm defaults diferentes ao usar defineProperty vs literal
- **Strict mode:** Operações proibidas lançam TypeError
- **Shallow:** Freeze/seal são shallow (não afetam nested objects)
- **Prototype chain:** Descriptors não afetam prototype

---

## 🧠 Fundamentos Teóricos

### Property Descriptor Attributes

**`value`:** Valor da propriedade (data descriptor)

```javascript
const obj = {};

Object.defineProperty(obj, 'name', {
    value: 'Alice'
});

console.log(obj.name);  // "Alice"
```

**`writable`:** Pode ser alterado?

```javascript
const obj = {};

Object.defineProperty(obj, 'ID', {
    value: 123,
    writable: false  // Read-only!
});

obj.ID = 456;  // Ignorado em sloppy mode
console.log(obj.ID);  // 123 (não mudou)

'use strict';
obj.ID = 789;  // ❌ TypeError: Cannot assign to read only property
```

**`enumerable`:** Aparece em enumeração?

```javascript
const obj = {};

Object.defineProperty(obj, 'public', {
    value: 'visible',
    enumerable: true   // Aparece
});

Object.defineProperty(obj, 'private', {
    value: 'hidden',
    enumerable: false  // Não aparece
});

console.log(Object.keys(obj));  // ['public']

for (let key in obj) {
    console.log(key);  // Apenas "public"
}

console.log(obj.private);  // "hidden" (existe, mas hidden)
```

**`configurable`:** Pode deletar ou reconfigurar?

```javascript
const obj = {};

Object.defineProperty(obj, 'permanent', {
    value: 'fixed',
    configurable: false  // Não pode deletar/reconfigurar
});

delete obj.permanent;  // Ignorado
console.log(obj.permanent);  // "fixed" (ainda existe)

// Tentar reconfigurar
try {
    Object.defineProperty(obj, 'permanent', {
        value: 'changed'
    });
} catch (e) {
    console.log(e.message);
    // "Cannot redefine property: permanent"
}
```

### Default Values

**Object literal vs defineProperty:**

```javascript
// Object literal - propriedades são totalmente configuráveis
const obj1 = { name: 'Alice' };

const desc1 = Object.getOwnPropertyDescriptor(obj1, 'name');
console.log(desc1);
/*
{
  value: 'Alice',
  writable: true,      // ✅ Padrão: true
  enumerable: true,    // ✅ Padrão: true
  configurable: true   // ✅ Padrão: true
}
*/

// defineProperty - defaults são FALSE!
const obj2 = {};
Object.defineProperty(obj2, 'name', {
    value: 'Bob'
    // writable: false       (default)
    // enumerable: false     (default)
    // configurable: false   (default)
});

const desc2 = Object.getOwnPropertyDescriptor(obj2, 'name');
console.log(desc2);
/*
{
  value: 'Bob',
  writable: false,     // ❌ Padrão: false
  enumerable: false,   // ❌ Padrão: false
  configurable: false  // ❌ Padrão: false
}
*/
```

---

## 🔍 Análise Conceitual Profunda

### Object.defineProperty() - Definir Propriedades

**Uso básico:**

```javascript
const obj = {};

Object.defineProperty(obj, 'name', {
    value: 'Alice',
    writable: true,
    enumerable: true,
    configurable: true
});

console.log(obj.name);  // "Alice"
```

**Definir múltiplas propriedades:**

```javascript
const obj = {};

Object.defineProperties(obj, {
    firstName: {
        value: 'Alice',
        writable: true,
        enumerable: true
    },
    lastName: {
        value: 'Smith',
        writable: true,
        enumerable: true
    },
    fullName: {
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        enumerable: true
    }
});

console.log(obj.fullName);  // "Alice Smith"
```

**Propriedade read-only (constante):**

```javascript
const config = {};

Object.defineProperty(config, 'API_KEY', {
    value: 'secret-key-123',
    writable: false,       // Read-only
    enumerable: true,
    configurable: false    // Não pode deletar
});

config.API_KEY = 'hacked';  // Ignorado
console.log(config.API_KEY);  // "secret-key-123"

delete config.API_KEY;  // Ignorado
console.log(config.API_KEY);  // "secret-key-123"
```

**Propriedade hidden (non-enumerable):**

```javascript
const obj = {
    public: 'visible'
};

Object.defineProperty(obj, 'private', {
    value: 'hidden',
    writable: true,
    enumerable: false,  // Hidden!
    configurable: true
});

console.log(Object.keys(obj));  // ['public']

for (let key in obj) {
    console.log(key);  // Apenas "public"
}

console.log(obj.private);  // "hidden" (existe!)

// Mas aparece em getOwnPropertyNames
console.log(Object.getOwnPropertyNames(obj));
// ['public', 'private']
```

**Accessor descriptor (getter/setter):**

```javascript
const person = {
    _age: 0  // "Private" backing field
};

Object.defineProperty(person, 'age', {
    get() {
        console.log('Getting age');
        return this._age;
    },
    set(value) {
        console.log('Setting age to', value);
        if (value < 0) {
            throw new Error('Age cannot be negative');
        }
        this._age = value;
    },
    enumerable: true,
    configurable: true
});

person.age = 30;  // "Setting age to 30"
console.log(person.age);  // "Getting age" → 30

// person.age = -5;  // Error: Age cannot be negative
```

### Object.getOwnPropertyDescriptor() - Inspecionar

**Obter descriptor:**

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

const nameDesc = Object.getOwnPropertyDescriptor(obj, 'name');
console.log(nameDesc);
/*
{
  value: 'Alice',
  writable: true,
  enumerable: true,
  configurable: true
}
*/

// Propriedade inexistente
const noneDesc = Object.getOwnPropertyDescriptor(obj, 'notExist');
console.log(noneDesc);  // undefined
```

**Obter todos descriptors:**

```javascript
const obj = {
    a: 1,
    b: 2
};

const descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors);
/*
{
  a: {
    value: 1,
    writable: true,
    enumerable: true,
    configurable: true
  },
  b: {
    value: 2,
    writable: true,
    enumerable: true,
    configurable: true
  }
}
*/
```

**Copiar objeto com descriptors:**

```javascript
const original = {};

Object.defineProperty(original, 'prop', {
    value: 42,
    writable: false,
    enumerable: false,
    configurable: false
});

// Cópia simples NÃO preserva descriptors
const copy1 = { ...original };
const desc1 = Object.getOwnPropertyDescriptor(copy1, 'prop');
console.log(desc1);  // undefined (prop não copiado - não enumerável)

// ✅ Copiar COM descriptors
const copy2 = Object.defineProperties(
    {},
    Object.getOwnPropertyDescriptors(original)
);

const desc2 = Object.getOwnPropertyDescriptor(copy2, 'prop');
console.log(desc2);
/*
{
  value: 42,
  writable: false,
  enumerable: false,
  configurable: false
}
*/
```

### Object.freeze() - Imutabilidade Completa

**Congelar objeto:**

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

Object.freeze(obj);

// ❌ Não pode alterar propriedades
obj.name = 'Bob';  // Ignorado
console.log(obj.name);  // "Alice"

// ❌ Não pode adicionar propriedades
obj.email = 'alice@example.com';  // Ignorado
console.log(obj.email);  // undefined

// ❌ Não pode deletar propriedades
delete obj.age;  // Ignorado
console.log(obj.age);  // 30

// ❌ Não pode reconfigurar
try {
    Object.defineProperty(obj, 'name', {
        value: 'Charlie'
    });
} catch (e) {
    console.log('Cannot redefine');
}
```

**Verificar se congelado:**

```javascript
const obj = { name: 'Alice' };

console.log(Object.isFrozen(obj));  // false

Object.freeze(obj);

console.log(Object.isFrozen(obj));  // true
```

**Freeze é shallow:**

```javascript
const obj = {
    name: 'Alice',
    address: {
        city: 'NYC'
    }
};

Object.freeze(obj);

// ❌ Não pode alterar root
obj.name = 'Bob';  // Ignorado
console.log(obj.name);  // "Alice"

// ✅ MAS pode alterar nested!
obj.address.city = 'LA';
console.log(obj.address.city);  // "LA" (MUDOU!)

// ⚠️ Freeze NÃO é deep!
```

**Deep freeze:**

```javascript
function deepFreeze(obj) {
    // Congelar objeto
    Object.freeze(obj);
    
    // Recursivamente congelar propriedades
    Object.getOwnPropertyNames(obj).forEach(prop => {
        const value = obj[prop];
        
        if (value && typeof value === 'object') {
            deepFreeze(value);  // Recursão
        }
    });
    
    return obj;
}

const obj = {
    name: 'Alice',
    address: {
        city: 'NYC',
        coords: { lat: 40, lng: -74 }
    }
};

deepFreeze(obj);

// ❌ Não pode alterar nada
obj.name = 'Bob';  // Ignorado
obj.address.city = 'LA';  // Ignorado
obj.address.coords.lat = 50;  // Ignorado

console.log(obj.address.city);  // "NYC"
console.log(obj.address.coords.lat);  // 40
```

### Object.seal() - Prevenir Add/Delete

**Selar objeto:**

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

Object.seal(obj);

// ✅ PODE alterar propriedades existentes
obj.name = 'Bob';
console.log(obj.name);  // "Bob" (MUDOU!)

obj.age = 31;
console.log(obj.age);  // 31 (MUDOU!)

// ❌ NÃO pode adicionar propriedades
obj.email = 'alice@example.com';  // Ignorado
console.log(obj.email);  // undefined

// ❌ NÃO pode deletar propriedades
delete obj.age;  // Ignorado
console.log(obj.age);  // 31 (ainda existe)

// ❌ NÃO pode reconfigurar
try {
    Object.defineProperty(obj, 'name', {
        enumerable: false
    });
} catch (e) {
    console.log('Cannot reconfigure');
}
```

**Verificar se selado:**

```javascript
const obj = { name: 'Alice' };

console.log(Object.isSealed(obj));  // false

Object.seal(obj);

console.log(Object.isSealed(obj));  // true
```

**Seal vs Freeze:**

```javascript
const sealed = { value: 1 };
Object.seal(sealed);

sealed.value = 2;  // ✅ OK (pode alterar)
console.log(sealed.value);  // 2

const frozen = { value: 1 };
Object.freeze(frozen);

frozen.value = 2;  // ❌ Ignorado
console.log(frozen.value);  // 1
```

### Object.preventExtensions() - Prevenir Adição

**Prevenir extensões:**

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

Object.preventExtensions(obj);

// ✅ PODE alterar propriedades existentes
obj.name = 'Bob';
console.log(obj.name);  // "Bob"

// ✅ PODE deletar propriedades existentes
delete obj.age;
console.log(obj.age);  // undefined (DELETADO!)

// ❌ NÃO pode adicionar propriedades
obj.email = 'alice@example.com';  // Ignorado
console.log(obj.email);  // undefined

// ✅ PODE reconfigurar propriedades existentes
Object.defineProperty(obj, 'name', {
    writable: false
});
```

**Verificar se extensível:**

```javascript
const obj = { name: 'Alice' };

console.log(Object.isExtensible(obj));  // true

Object.preventExtensions(obj);

console.log(Object.isExtensible(obj));  // false
```

**Comparação: freeze vs seal vs preventExtensions:**

| Operação | Normal | preventExtensions | seal | freeze |
|----------|--------|-------------------|------|--------|
| **Alterar valor** | ✅ | ✅ | ✅ | ❌ |
| **Adicionar prop** | ✅ | ❌ | ❌ | ❌ |
| **Deletar prop** | ✅ | ✅ | ❌ | ❌ |
| **Reconfigurar prop** | ✅ | ✅ | ❌ | ❌ |

### Use Cases Práticos

**1. Configuração imutável:**

```javascript
const CONFIG = Object.freeze({
    API_URL: 'https://api.example.com',
    TIMEOUT: 5000,
    MAX_RETRIES: 3
});

// ❌ Não pode modificar config
// CONFIG.API_URL = 'https://hacked.com';  // Ignorado

export default CONFIG;
```

**2. Enum pattern:**

```javascript
const Status = Object.freeze({
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
});

// ❌ Não pode adicionar/modificar
// Status.CANCELLED = 'cancelled';  // Ignorado

function processOrder(status) {
    if (status === Status.PENDING) { /* ... */ }
}
```

**3. Private properties (via non-enumerable):**

```javascript
function createUser(name, password) {
    const user = {};
    
    // Public property
    Object.defineProperty(user, 'name', {
        value: name,
        writable: true,
        enumerable: true,
        configurable: false
    });
    
    // Private property (hidden)
    Object.defineProperty(user, '_password', {
        value: password,
        writable: true,
        enumerable: false,  // Hidden!
        configurable: false
    });
    
    // Public method
    Object.defineProperty(user, 'checkPassword', {
        value: function(pwd) {
            return this._password === pwd;
        },
        enumerable: false
    });
    
    return user;
}

const user = createUser('Alice', 'secret');

console.log(Object.keys(user));  // ['name'] (apenas public)
console.log(user.checkPassword('secret'));  // true
console.log(user._password);  // "secret" (ainda acessível, mas hidden)
```

**4. Validation via setters:**

```javascript
function createPerson(name, age) {
    const person = { _age: age };
    
    Object.defineProperty(person, 'age', {
        get() {
            return this._age;
        },
        set(value) {
            if (typeof value !== 'number') {
                throw new TypeError('Age must be number');
            }
            if (value < 0 || value > 150) {
                throw new RangeError('Age must be 0-150');
            }
            this._age = value;
        },
        enumerable: true
    });
    
    return person;
}

const person = createPerson('Alice', 30);

person.age = 31;  // ✅ OK
// person.age = -5;  // ❌ RangeError
// person.age = 'old';  // ❌ TypeError
```

**5. Computed properties:**

```javascript
const rectangle = {
    width: 10,
    height: 20
};

Object.defineProperty(rectangle, 'area', {
    get() {
        return this.width * this.height;
    },
    enumerable: true,
    configurable: true
});

console.log(rectangle.area);  // 200

rectangle.width = 15;
console.log(rectangle.area);  // 300 (recalculado!)
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Property Descriptors

**Use quando:**

1. **Constants:** Propriedades read-only
2. **Privacy:** Propriedades hidden (non-enumerable)
3. **Validation:** Getters/setters com validação
4. **Computed properties:** Propriedades calculadas dinamicamente
5. **Immutability:** Freeze objetos de configuração

### Quando Usar freeze/seal/preventExtensions

**freeze:**
- Configurações globais
- Enums
- Objetos que nunca devem mudar

**seal:**
- Objetos com schema fixo mas valores mutáveis
- DTOs (Data Transfer Objects)

**preventExtensions:**
- Prevenir adição acidental de propriedades
- Manter schema consistente

---

## ⚠️ Limitações e Considerações Teóricas

### Shallow Behavior

```javascript
// freeze/seal/preventExtensions são SHALLOW!

const obj = {
    nested: { value: 1 }
};

Object.freeze(obj);

// ❌ Não pode alterar root
obj.nested = { value: 2 };  // Ignorado

// ✅ MAS pode alterar nested!
obj.nested.value = 100;
console.log(obj.nested.value);  // 100

// Precisa deep freeze para nested objects
```

### Performance Overhead

```javascript
// defineProperty é mais lento que assignment literal

console.time('literal');
const obj1 = { a: 1, b: 2, c: 3 };
console.timeEnd('literal');
// ~0.01ms

console.time('defineProperty');
const obj2 = {};
Object.defineProperty(obj2, 'a', { value: 1, writable: true, enumerable: true });
Object.defineProperty(obj2, 'b', { value: 2, writable: true, enumerable: true });
Object.defineProperty(obj2, 'c', { value: 3, writable: true, enumerable: true });
console.timeEnd('defineProperty');
// ~0.1ms (10x mais lento!)
```

### Strict Mode Differences

```javascript
// Sloppy mode: operações proibidas IGNORADAS
const obj = {};
Object.defineProperty(obj, 'prop', {
    value: 1,
    writable: false
});

obj.prop = 2;  // Ignorado silenciosamente
console.log(obj.prop);  // 1

// Strict mode: operações proibidas LANÇAM TypeError
'use strict';
const obj2 = {};
Object.defineProperty(obj2, 'prop', {
    value: 1,
    writable: false
});

// obj2.prop = 2;  // ❌ TypeError: Cannot assign to read only property
```

---

## 🔗 Interconexões Conceituais

### Relação com Classes

```javascript
// Classes usam descriptors internamente

class MyClass {
    constructor() {
        this.publicProp = 'public';
    }
    
    method() { /* ... */ }
}

const instance = new MyClass();

// method é non-enumerable!
const desc = Object.getOwnPropertyDescriptor(MyClass.prototype, 'method');
console.log(desc.enumerable);  // false
```

### Relação com Proxy

```javascript
// Proxy pode interceptar defineProperty

const obj = {};

const proxy = new Proxy(obj, {
    defineProperty(target, prop, descriptor) {
        console.log(`Defining ${prop}`);
        return Object.defineProperty(target, prop, descriptor);
    }
});

proxy.name = 'Alice';  // "Defining name"
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. JSON.stringify/parse (anterior)
2. Custom serialization (anterior)
3. **Meta-programming basics** (você está aqui)
4. **Proxy e Reflect** (próximo - interceptação avançada)

### Preparação para Proxy

**Proxy** permite interceptar **TODAS** operações em objetos:

```javascript
const obj = { name: 'Alice' };

const proxy = new Proxy(obj, {
    get(target, prop) {
        console.log(`Getting ${prop}`);
        return target[prop];
    },
    set(target, prop, value) {
        console.log(`Setting ${prop} = ${value}`);
        target[prop] = value;
        return true;
    }
});

proxy.name;  // "Getting name"
proxy.age = 30;  // "Setting age = 30"
```

Próximo: **Proxy e Reflect** com interceptação completa.

---

## 📚 Conclusão

**Meta-programming** com **property descriptors** permite **controle fino sobre objetos**, essencial para **immutability**, **privacy**, **validation**, e **APIs robustas**.

**Conceitos essenciais:**

**Property descriptors:**
- **Data descriptor:** `value`, `writable`, `enumerable`, `configurable`
- **Accessor descriptor:** `get`, `set`, `enumerable`, `configurable`
- Mutuamente exclusivos (data vs accessor)

**Object.defineProperty():**
- Define propriedade com descriptor customizado
- Defaults: `writable/enumerable/configurable = false`
- Use para constants, privacy, validation, computed properties

**Object.getOwnPropertyDescriptor():**
- Retorna descriptor de propriedade
- undefined se propriedade não existe
- Use para introspection, copying with descriptors

**Object.freeze():**
- Imutabilidade COMPLETA (não pode alterar, adicionar, deletar, reconfigurar)
- Shallow (nested objects ainda mutáveis)
- Use para configs, enums, constants

**Object.seal():**
- Previne add/delete (MAS pode alterar valores)
- Não pode reconfigurar
- Use para schema fixo com valores mutáveis

**Object.preventExtensions():**
- Previne APENAS adição de propriedades
- Pode alterar, deletar, reconfigurar existentes
- Use para prevenir extensão acidental

**Comparação:**

| Método | Alterar | Adicionar | Deletar | Reconfigurar |
|--------|---------|-----------|---------|--------------|
| **freeze** | ❌ | ❌ | ❌ | ❌ |
| **seal** | ✅ | ❌ | ❌ | ❌ |
| **preventExtensions** | ✅ | ❌ | ✅ | ✅ |

**Attributes:**
- **`writable`:** Pode alterar valor?
- **`enumerable`:** Aparece em for...in, Object.keys()?
- **`configurable`:** Pode deletar ou reconfigurar descriptor?

**Use cases:**
- Constants: `writable: false`
- Privacy: `enumerable: false`
- Validation: getters/setters
- Computed: getters dinâmicos
- Immutability: Object.freeze()

**Limitações:**
- freeze/seal/preventExtensions são shallow
- defineProperty tem overhead de performance
- Strict mode vs sloppy mode comportamento diferente

Dominar meta-programming é essencial para **framework design**, **library APIs**, **immutability patterns**, e **robust code** em JavaScript moderno!
