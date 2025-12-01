# Symbols Como Propriedades: Padrões Avançados

## 🎯 Introdução e Definição

### Definição Conceitual

**Usar Symbols como propriedades** de objetos permite criar **chaves únicas** que não colidem com propriedades normais, implementar **pseudo-privacidade**, armazenar **metadata** e criar **polyfills** sem quebrar código existente.

**Sintaxe:**

```javascript
// Symbol como propriedade
const ID = Symbol('id');
const SECRET = Symbol('secret');

const usuario = {
    nome: 'João',           // Propriedade string normal
    email: 'joao@email.com',
    [ID]: 123,              // Propriedade Symbol
    [SECRET]: 'senha123'    // Propriedade Symbol
};

// Acessar
console.log(usuario.nome);      // "João"
console.log(usuario[ID]);       // 123
console.log(usuario[SECRET]);   // "senha123"

// Symbols não aparecem em enumeração
console.log(Object.keys(usuario));  // ["nome", "email"]
console.log(JSON.stringify(usuario));  // {"nome":"João","email":"joao@email.com"}

// Para acessar Symbols
console.log(Object.getOwnPropertySymbols(usuario));
// [Symbol(id), Symbol(secret)]

// Reflect.ownKeys obtém TUDO
console.log(Reflect.ownKeys(usuario));
// ["nome", "email", Symbol(id), Symbol(secret)]
```

**Características:**

- **Unique keys:** Symbols garantem unicidade
- **Non-enumerable:** Não aparecem em `Object.keys()`, `for...in`
- **JSON-ignored:** `JSON.stringify()` remove Symbols
- **Pseudo-privacy:** Dificulta acesso (não é 100% privado)
- **Metadata:** Armazenar dados internos

### Padrões Principais

**1. Pseudo-privacidade:**

```javascript
const _internal = Symbol('internal');

class MyClass {
    constructor(value) {
        this[_internal] = { value, timestamp: Date.now() };
    }
    
    getValue() {
        return this[_internal].value;
    }
}

const obj = new MyClass(42);
console.log(obj.getValue());  // 42
console.log(Object.keys(obj));  // [] (vazio!)

// Dificulta mas não previne acesso
const symbols = Object.getOwnPropertySymbols(obj);
console.log(obj[symbols[0]]);  // { value: 42, timestamp: ... }
```

**2. Metadata storage:**

```javascript
const METADATA = Symbol('metadata');

function track(obj, info) {
    obj[METADATA] = {
        createdAt: Date.now(),
        info: info
    };
}

const produto = { nome: 'Notebook', preco: 2500 };
track(produto, 'Product created');

console.log(produto[METADATA]);
// { createdAt: 1705320600000, info: 'Product created' }

// Não interfere com serialização
console.log(JSON.stringify(produto));
// {"nome":"Notebook","preco":2500}
```

**3. Polyfilling:**

```javascript
// Adicionar método sem quebrar código
if (!Array.prototype.customMethod) {
    const CUSTOM_METHOD = Symbol('customMethod');
    
    Array.prototype[CUSTOM_METHOD] = function() {
        return this.map(x => x * 2);
    };
}

// Uso
const arr = [1, 2, 3];
// arr[CUSTOM_METHOD](); // [2, 4, 6]
```

### Contexto Histórico e Motivação

**Problema pré-ES6:** Propriedades privadas/internas

```javascript
// ES5 - convenções frágeis
function MyClass(value) {
    this._internal = value;  // ❌ Apenas convenção!
    this.__private = 'secret';  // ❌ Ainda acessível!
}

const obj = new MyClass(42);
console.log(obj._internal);  // 42 (acessível!)
console.log(obj.__private);  // "secret" (acessível!)

// ❌ Sem garantia de privacidade
```

**ES6 (2015):** Symbols para pseudo-privacidade

```javascript
// ✅ Symbol dificulta acesso
const _internal = Symbol('internal');

class MyClass {
    constructor(value) {
        this[_internal] = value;
    }
}

const obj = new MyClass(42);
console.log(Object.keys(obj));  // [] (oculto!)

// Ainda acessível mas dificulta
const symbols = Object.getOwnPropertySymbols(obj);
console.log(obj[symbols[0]]);  // 42
```

**ES2022:** Private fields (`#`) para true privacy

```javascript
// ✅ Verdadeiramente privado
class Secure {
    #private = 'secret';
    
    getPrivate() {
        return this.#private;
    }
}

const secure = new Secure();
// console.log(secure.#private);  // SyntaxError!
console.log(secure.getPrivate());  // "secret"
```

**Motivações para Symbols como propriedades:**

1. **Backward compatibility:** Funciona em ES6+
2. **Metadata:** Anexar dados sem poluir namespace
3. **Polyfills:** Adicionar features sem conflitos
4. **Library internals:** Dados internos de bibliotecas
5. **Framework communication:** Compartilhar dados entre frameworks

### Problema Fundamental que Resolve

**Problema:** Como armazenar **dados internos** em objetos sem **expor** em enumeração ou **colidir** com propriedades futuras?

**Solução:** Symbols como propriedades fornecem **chaves únicas e ocultas**.

**Exemplo - framework metadata:**

```javascript
// Framework armazena metadata sem poluir objeto
const FRAMEWORK_DATA = Symbol('frameworkData');

function createComponent(config) {
    const component = {
        ...config,
        [FRAMEWORK_DATA]: {
            id: Math.random(),
            createdAt: Date.now(),
            hooks: []
        }
    };
    
    return component;
}

const button = createComponent({
    type: 'button',
    label: 'Click me'
});

// Usuário vê apenas configuração
console.log(button);
// { type: 'button', label: 'Click me' }

console.log(Object.keys(button));
// ['type', 'label']

// Framework acessa metadata
console.log(button[FRAMEWORK_DATA]);
// { id: 0.123..., createdAt: 1705320600000, hooks: [] }
```

### Importância no Ecossistema

Symbols como propriedades são **essenciais** para:

- **Framework internals:** React, Vue, Angular armazenam metadata
- **Library design:** Dados internos sem poluir API pública
- **Polyfills:** Adicionar features sem quebrar código
- **Metadata:** Tracking, debugging, profiling
- **Cross-framework communication:** Compartilhar dados

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Unique keys:** Symbols garantem unicidade
2. **Non-enumerable:** Ocultos em enumeração
3. **Pseudo-privacy:** Dificulta mas não previne acesso
4. **Metadata:** Armazenar dados internos
5. **Polyfills:** Adicionar features sem conflitos

### Pilares Fundamentais

- **`[Symbol()]`:** Computed property name
- **`Object.getOwnPropertySymbols()`:** Obter Symbols
- **`Reflect.ownKeys()`:** Obter todas chaves
- **Non-enumerable por padrão:** Não aparecem em loops
- **JSON-ignored:** Removidos em `JSON.stringify()`

### Visão Geral das Nuances

- **Not true privacy:** Acessível via reflection
- **Shared Symbols:** `Symbol.for()` cross-module
- **WeakMap alternative:** Para true privacy
- **Property descriptors:** Configurar enumerable, writable

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Computed Property Names

```javascript
// Symbol usado como computed property
const sym = Symbol('key');

const obj = {
    [sym]: 'value'  // Computed property name
};

// Equivalente a:
const obj2 = {};
obj2[sym] = 'value';

console.log(obj[sym] === obj2[sym]);  // true
```

#### Non-Enumerable por Padrão

```javascript
const sym = Symbol('prop');
const obj = {
    normalProp: 'visible',
    [sym]: 'hidden'
};

// for...in não vê Symbols
for (let key in obj) {
    console.log(key);  // "normalProp"
}

// Object.keys() não vê Symbols
console.log(Object.keys(obj));  // ["normalProp"]

// Descriptor mostra enumerable: true para normais
console.log(Object.getOwnPropertyDescriptor(obj, 'normalProp'));
// { value: 'visible', writable: true, enumerable: true, configurable: true }

// Symbol também é enumerable (mas oculto em métodos normais)
console.log(Object.getOwnPropertyDescriptor(obj, sym));
// { value: 'hidden', writable: true, enumerable: true, configurable: true }
```

### Princípios Conceituais

#### Reflection Methods

```javascript
const sym1 = Symbol('sym1');
const sym2 = Symbol('sym2');

const obj = {
    stringProp: 'a',
    numberProp: 123,
    [sym1]: 'symbol1',
    [sym2]: 'symbol2'
};

// String keys apenas
console.log(Object.keys(obj));  // ["stringProp", "numberProp"]
console.log(Object.getOwnPropertyNames(obj));  // ["stringProp", "numberProp"]

// Symbol keys apenas
console.log(Object.getOwnPropertySymbols(obj));  // [Symbol(sym1), Symbol(sym2)]

// TODAS as chaves (strings + Symbols)
console.log(Reflect.ownKeys(obj));
// ["stringProp", "numberProp", Symbol(sym1), Symbol(sym2)]
```

---

## 🔍 Análise Conceitual Profunda

### Privacy Pattern

```javascript
// Pseudo-privacidade com Symbols
const _balance = Symbol('balance');
const _transactions = Symbol('transactions');

class BankAccount {
    constructor(initialBalance) {
        this[_balance] = initialBalance;
        this[_transactions] = [];
    }
    
    deposit(amount) {
        this[_balance] += amount;
        this[_transactions].push({ type: 'deposit', amount, date: new Date() });
    }
    
    withdraw(amount) {
        if (amount > this[_balance]) {
            throw new Error('Insufficient funds');
        }
        
        this[_balance] -= amount;
        this[_transactions].push({ type: 'withdraw', amount, date: new Date() });
    }
    
    getBalance() {
        return this[_balance];
    }
    
    getTransactions() {
        return [...this[_transactions]];  // Cópia
    }
}

const account = new BankAccount(1000);
account.deposit(500);
account.withdraw(200);

console.log(account.getBalance());  // 1300
console.log(Object.keys(account));  // [] (vazio!)

// Dificulta acesso direto
// console.log(account._balance);  // undefined (não existe)

// Mas ainda acessível via reflection
const symbols = Object.getOwnPropertySymbols(account);
console.log(account[symbols[0]]);  // 1300 (balance)
```

### Metadata Storage

```javascript
// Armazenar metadata sem poluir objeto
const CREATED_AT = Symbol('createdAt');
const MODIFIED_AT = Symbol('modifiedAt');
const VERSION = Symbol('version');

class Document {
    constructor(title, content) {
        this.title = title;
        this.content = content;
        
        this[CREATED_AT] = Date.now();
        this[MODIFIED_AT] = Date.now();
        this[VERSION] = 1;
    }
    
    update(newContent) {
        this.content = newContent;
        this[MODIFIED_AT] = Date.now();
        this[VERSION]++;
    }
    
    getMetadata() {
        return {
            createdAt: new Date(this[CREATED_AT]),
            modifiedAt: new Date(this[MODIFIED_AT]),
            version: this[VERSION]
        };
    }
}

const doc = new Document('My Doc', 'Content');
doc.update('New content');

console.log(doc);  // { title: 'My Doc', content: 'New content' }
console.log(doc.getMetadata());
// { createdAt: Date, modifiedAt: Date, version: 2 }

console.log(JSON.stringify(doc));
// {"title":"My Doc","content":"New content"} (metadata oculta!)
```

### Polyfilling Pattern

```javascript
// Adicionar método a Array.prototype sem conflito
if (!Array.prototype.sum) {
    const SUM_METHOD = Symbol.for('Array.prototype.sum');
    
    Object.defineProperty(Array.prototype, SUM_METHOD, {
        value: function() {
            return this.reduce((acc, n) => acc + n, 0);
        },
        writable: true,
        configurable: true,
        enumerable: false
    });
    
    // Alias público (se desejar)
    Array.prototype.sum = Array.prototype[SUM_METHOD];
}

const nums = [1, 2, 3, 4, 5];
console.log(nums.sum());  // 15

// Se JavaScript adicionar Array.prototype.sum futuramente,
// Symbol garante que versão polyfilled permanece acessível
```

### Framework Communication

```javascript
// Frameworks compartilham dados via Symbols globais
const REACT_ELEMENT = Symbol.for('react.element');
const VUE_COMPONENT = Symbol.for('vue.component');

// React-like
function createElement(type, props) {
    return {
        [REACT_ELEMENT]: true,
        type,
        props
    };
}

// Vue-like integration
function isReactElement(obj) {
    return obj && obj[REACT_ELEMENT] === true;
}

const element = createElement('div', { className: 'container' });
console.log(isReactElement(element));  // true

// Symbol.for() garante compatibilidade cross-module
```

### Weak Privacy with Symbol + Closure

```javascript
// Combinar Symbol com closure para stronger privacy
function createSecureObject(secret) {
    const SECRET = Symbol('secret');
    
    return {
        [SECRET]: secret,
        
        getSecret() {
            return this[SECRET];
        },
        
        setSecret(newSecret) {
            this[SECRET] = newSecret;
        }
    };
}

const obj = createSecureObject('password123');
console.log(obj.getSecret());  // "password123"

// Symbol não está exposto
console.log(Object.getOwnPropertySymbols(obj));
// [Symbol(secret)] (mas não temos referência!)

// Dificulta ainda mais acesso
```

### Combining Multiple Symbols

```javascript
const STATE = Symbol('state');
const ACTIONS = Symbol('actions');
const COMPUTED = Symbol('computed');

class Store {
    constructor(initialState) {
        this[STATE] = { ...initialState };
        this[ACTIONS] = {};
        this[COMPUTED] = {};
    }
    
    registerAction(name, fn) {
        this[ACTIONS][name] = fn;
    }
    
    dispatch(actionName, payload) {
        const action = this[ACTIONS][actionName];
        if (!action) {
            throw new Error(`Action ${actionName} not found`);
        }
        
        action(this[STATE], payload);
    }
    
    getState() {
        return { ...this[STATE] };
    }
}

const store = new Store({ count: 0 });

store.registerAction('increment', (state) => {
    state.count++;
});

store.dispatch('increment');
console.log(store.getState());  // { count: 1 }

// Internals ocultos
console.log(Object.keys(store));  // [] (vazio!)
```

### Symbol + WeakMap (True Privacy)

```javascript
// Combinar Symbol com WeakMap para true privacy
const privateData = new WeakMap();
const PRIVATE = Symbol('private');

class SecureClass {
    constructor(secret) {
        privateData.set(this, { secret });
    }
    
    getSecret() {
        return privateData.get(this).secret;
    }
    
    setSecret(newSecret) {
        privateData.get(this).secret = newSecret;
    }
}

const secure = new SecureClass('password');
console.log(secure.getSecret());  // "password"

// Não há como acessar privateData de fora
console.log(Object.keys(secure));  // []
console.log(Object.getOwnPropertySymbols(secure));  // []
console.log(privateData.get(secure));  // undefined (fora do escopo!)
```

### Symbol Enum Pattern

```javascript
// Usar Symbols para enum values (garantia de unicidade)
const STATUS = {
    PENDING: Symbol('pending'),
    APPROVED: Symbol('approved'),
    REJECTED: Symbol('rejected')
};

class Order {
    constructor() {
        this.status = STATUS.PENDING;
    }
    
    approve() {
        this.status = STATUS.APPROVED;
    }
    
    reject() {
        this.status = STATUS.REJECTED;
    }
    
    isPending() {
        return this.status === STATUS.PENDING;
    }
}

const order = new Order();
console.log(order.isPending());  // true

order.approve();
console.log(order.status === STATUS.APPROVED);  // true

// Impossível criar valor igual por acidente
const fakePending = Symbol('pending');
console.log(fakePending === STATUS.PENDING);  // false
```

### Versioning with Symbols

```javascript
// Manter múltiplas versões de dados
const V1 = Symbol('v1');
const V2 = Symbol('v2');
const CURRENT_VERSION = Symbol('currentVersion');

class VersionedData {
    constructor(data) {
        this[V1] = { ...data };
        this[V2] = null;
        this[CURRENT_VERSION] = V1;
    }
    
    migrateToV2() {
        // Transformar dados de V1 para V2
        this[V2] = {
            ...this[V1],
            newField: 'migrated'
        };
        
        this[CURRENT_VERSION] = V2;
    }
    
    getData() {
        return { ...this[this[CURRENT_VERSION]] };
    }
    
    getVersion() {
        return this[CURRENT_VERSION].description;
    }
}

const data = new VersionedData({ name: 'Test' });
console.log(data.getData());  // { name: 'Test' }
console.log(data.getVersion());  // "v1"

data.migrateToV2();
console.log(data.getData());  // { name: 'Test', newField: 'migrated' }
console.log(data.getVersion());  // "v2"

// Ambas versões preservadas
console.log(Object.getOwnPropertySymbols(data));
// [Symbol(v1), Symbol(v2), Symbol(currentVersion)]
```

### Type Tagging

```javascript
// Usar Symbols para type tagging
const TYPE = Symbol('type');

function createTypedValue(type, value) {
    return {
        [TYPE]: type,
        value: value,
        
        isType(t) {
            return this[TYPE] === t;
        }
    };
}

const Types = {
    NUMBER: Symbol('number'),
    STRING: Symbol('string'),
    BOOLEAN: Symbol('boolean')
};

const num = createTypedValue(Types.NUMBER, 42);
const str = createTypedValue(Types.STRING, 'hello');

console.log(num.isType(Types.NUMBER));  // true
console.log(str.isType(Types.NUMBER));  // false

// Type tag oculto em serialização
console.log(JSON.stringify(num));  // {"value":42}
```

### Shared Symbols Across Modules

```javascript
// module-a.js
export const SHARED_STATE = Symbol.for('app.shared.state');

export function setState(obj, state) {
    obj[SHARED_STATE] = state;
}

// module-b.js
const SHARED_STATE = Symbol.for('app.shared.state');

export function getState(obj) {
    return obj[SHARED_STATE];
}

// app.js
const obj = {};
setState(obj, { user: 'João' });
console.log(getState(obj));  // { user: 'João' }

// Mesmo Symbol em módulos diferentes!
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Symbols Como Propriedades

**Use quando:**

1. **Metadata:** Anexar dados internos
2. **Framework internals:** Dados privados de bibliotecas
3. **Polyfills:** Adicionar features sem conflitos
4. **Weak privacy:** Dificultar (não prevenir) acesso
5. **Cross-module:** Compartilhar via `Symbol.for()`

**Exemplos:**

```javascript
// 1. Metadata
obj[Symbol('metadata')] = { created: Date.now() };

// 2. Framework internals
component[Symbol('reactInternals')] = { hooks: [] };

// 3. Polyfills
Array.prototype[Symbol('customMethod')] = function() { };

// 4. Weak privacy
this[Symbol('private')] = 'data';

// 5. Cross-module
const SHARED = Symbol.for('app.shared');
```

### Quando NÃO Usar

**Evite quando:**

1. **True privacy:** Use `#` private fields
2. **Serialização:** JSON.stringify remove Symbols
3. **Performance crítica:** Overhead mínimo existe
4. **Simplicidade:** String keys suficientes

```javascript
// ❌ Não para true privacy
const SECRET = Symbol('secret');
obj[SECRET] = 'password';
Object.getOwnPropertySymbols(obj);  // Ainda acessível!

// ✅ Use private fields
class Secure {
    #secret = 'password';
}

// ❌ Não para serialização
const obj2 = { [Symbol('id')]: 123 };
JSON.stringify(obj2);  // {} (perdido!)

// ✅ Use string key
const obj3 = { id: 123 };
```

---

## ⚠️ Limitações e Considerações Teóricas

### Not True Privacy

```javascript
// Symbols são acessíveis via reflection
const SECRET = Symbol('secret');
const obj = { [SECRET]: 'password' };

const symbols = Object.getOwnPropertySymbols(obj);
console.log(obj[symbols[0]]);  // "password" (acessado!)

// ✅ True privacy: WeakMap ou # fields
```

### JSON Serialization Loss

```javascript
const obj = {
    visible: 'data',
    [Symbol('hidden')]: 'metadata'
};

console.log(JSON.stringify(obj));  // {"visible":"data"}
// Symbol perdido!

// ✅ Workaround (se necessário)
function serialize(obj) {
    const symbols = Object.getOwnPropertySymbols(obj);
    const symbolData = {};
    
    symbols.forEach(sym => {
        symbolData[sym.description || 'unknown'] = obj[sym];
    });
    
    return JSON.stringify({ ...obj, __symbols: symbolData });
}
```

### Property Descriptor Configuration

```javascript
const sym = Symbol('prop');
const obj = {};

// Definir Symbol property com descriptor
Object.defineProperty(obj, sym, {
    value: 'hidden',
    writable: false,     // Read-only
    enumerable: false,   // Não-enumerável
    configurable: false  // Não-configurável
});

// obj[sym] = 'new';  // ❌ Não funciona (writable: false)
// delete obj[sym];  // ❌ Não funciona (configurable: false)
```

---

## 🔗 Interconexões Conceituais

### Relação com Private Fields

```javascript
// Symbol: pseudo-privacy
const SECRET = Symbol('secret');
class WithSymbol {
    constructor() {
        this[SECRET] = 'password';
    }
}

// # private field: true privacy
class WithPrivate {
    #secret = 'password';
}
```

### Relação com WeakMap

```javascript
// WeakMap para true privacy
const privateData = new WeakMap();

class Secure {
    constructor(secret) {
        privateData.set(this, secret);
    }
    
    getSecret() {
        return privateData.get(this);
    }
}
```

### Relação com Well-Known Symbols

```javascript
// Custom Symbol vs well-known Symbol
const custom = Symbol('custom');
obj[custom] = 'value';

// Well-known Symbol
obj[Symbol.iterator] = function*() { };
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Template Literals Basics
2. Tagged Templates
3. Raw Strings
4. Symbols Basics
5. Well-Known Symbols
6. **Symbols as Properties** (você está aqui)

### Próximos Passos

**Módulos futuros relacionados:**

- **Private Fields (`#`):** True privacy
- **WeakMap/WeakSet:** Private data storage
- **Proxy/Reflect:** Metaprogramming avançado
- **Decorators:** Metadata e annotations

**Aprofundamento:**

```javascript
// Private fields (ES2022)
class Modern {
    #private = 'truly private';
}

// Proxy para metaprogramming
const proxy = new Proxy(obj, {
    get(target, prop) {
        // Interceptar acesso
    }
});

// WeakMap para true privacy
const data = new WeakMap();
class Secure {
    constructor() {
        data.set(this, {});
    }
}
```

---

## 📚 Conclusão

**Usar Symbols como propriedades** permite **pseudo-privacidade**, **metadata storage** e **polyfilling** sem conflitos.

**Conceitos essenciais:**
- **Unique keys:** Symbols garantem unicidade
- **Non-enumerable:** Ocultos em `Object.keys()`, `for...in`
- **JSON-ignored:** Removidos em `JSON.stringify()`
- **Pseudo-privacy:** Dificulta mas não previne acesso
- **`Object.getOwnPropertySymbols()`:** Obter Symbols
- **`Reflect.ownKeys()`:** Obter todas chaves
- **`Symbol.for()`:** Compartilhar cross-module
- **Privacy patterns:** Symbol + closure, Symbol + WeakMap
- **Metadata storage:** Dados internos sem poluir namespace
- **Polyfilling:** Adicionar features sem conflitos
- **Framework communication:** Compartilhar dados via global registry
- **Not true privacy:** Use `#` fields ou WeakMap
- **Type tagging:** Identificar tipos com Symbols
- **Versioning:** Manter múltiplas versões de dados

Dominar Symbols como propriedades é essencial para **library design**, **framework internals** e **metadata management** em JavaScript moderno!

**Módulo 36 completo!** Você domina agora **template literals**, **tagged templates**, **raw strings** e **Symbols** (basics, well-known, properties).
