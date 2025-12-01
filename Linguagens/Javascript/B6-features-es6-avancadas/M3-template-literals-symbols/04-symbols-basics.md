# Symbols: Identificadores Únicos e Primitivos

## 🎯 Introdução e Definição

### Definição Conceitual

**Symbol** é um **primitive type** (tipo primitivo) introduzido no ES6 que cria **identificadores únicos e imutáveis**. Cada Symbol é **garantidamente único**, mesmo que criados com a mesma descrição.

**Sintaxe:**

```javascript
// Criar Symbol
const sym = Symbol();
console.log(typeof sym);  // "symbol"

// Com descrição (opcional, para debugging)
const sym2 = Symbol('minha descrição');
console.log(sym2.toString());  // "Symbol(minha descrição)"

// SEMPRE ÚNICO - mesmo descrição!
const a = Symbol('test');
const b = Symbol('test');
console.log(a === b);  // false (ÚNICOS!)

// Usar como propriedade de objeto
const chave = Symbol('id');
const obj = {
    [chave]: 123  // Propriedade Symbol
};

console.log(obj[chave]);  // 123
console.log(Object.keys(obj));  // [] (Symbol não enumerável!)
```

**Características:**

- **Primitive type:** 7º tipo primitivo (string, number, boolean, null, undefined, symbol, bigint)
- **Único:** Cada Symbol é diferente de todos os outros
- **Imutável:** Não pode ser modificado
- **Não-enumerável:** Não aparece em `Object.keys()`, `for...in`
- **Descrição opcional:** String para debugging
- **Não usa `new`:** `Symbol()` (não `new Symbol()`)

### Primitive Types em JavaScript

```javascript
// 7 tipos primitivos:
typeof 'string'     // "string"
typeof 123          // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object" (bug histórico!)
typeof Symbol()     // "symbol" ⭐
typeof 123n         // "bigint"

// Symbol é PRIMITIVO (não objeto!)
const sym = Symbol();
console.log(sym instanceof Object);  // false
console.log(typeof sym);  // "symbol"
```

### Contexto Histórico e Motivação

**Problema pré-ES6:** Como criar **propriedades únicas** em objetos sem conflitos de nome?

```javascript
// ES5 - propriedades string podem colidir
const obj = {};

// Biblioteca A
obj.id = 'lib-a-123';

// Biblioteca B (sobrescreve!)
obj.id = 'lib-b-456';

console.log(obj.id);  // "lib-b-456" (perdeu valor de A!)

// ❌ Name collision!
```

**Tentativas de solução:**

1. **Prefixos:** `_private`, `$$internal` (convenção, não garantia)
2. **Closures:** Variáveis privadas (complexo)
3. **WeakMaps:** Associar dados privados (ES6, mas diferente)

**ES6 (2015):** Symbols introduzidos

```javascript
// ✅ Symbols garantem unicidade
const idA = Symbol('id');
const idB = Symbol('id');

const obj = {
    [idA]: 'lib-a-123',
    [idB]: 'lib-b-456'
};

console.log(obj[idA]);  // "lib-a-123"
console.log(obj[idB]);  // "lib-b-456"

// Sem colisão! ✅
```

**Motivações principais:**

1. **Unicidade garantida:** Evitar name collisions
2. **Metaprogramming:** Well-known Symbols (Symbol.iterator, etc.)
3. **Propriedades "privadas":** Não-enumeráveis
4. **Extensibility:** Adicionar comportamento a objetos sem quebrar código existente
5. **Protocols:** Definir interfaces customizadas (iteração, conversão)

### Problema Fundamental que Resolve

**Problema:** Como adicionar **propriedades únicas** a objetos sem risco de **sobrescrever** propriedades existentes ou futuras?

**Cenário real - extending built-ins:**

```javascript
// ❌ Perigoso - pode quebrar código futuro
Array.prototype.myMethod = function() { /* ... */ };

// Se JavaScript adicionar Array.prototype.myMethod futuramente,
// código quebra!

// ✅ Symbol garante não quebrar nada
const myMethod = Symbol('myMethod');
Array.prototype[myMethod] = function() { /* ... */ };

const arr = [1, 2, 3];
arr[myMethod]();  // Funciona!

// Não interfere com propriedades normais
console.log(Object.keys(arr));  // ["0", "1", "2"] (myMethod oculto!)
```

### Importância no Ecossistema

Symbols são **essenciais** para:

- **Metaprogramming:** Well-known Symbols (Symbol.iterator, Symbol.toPrimitive)
- **Iteration protocols:** `for...of`, spread operator
- **Privacy:** Propriedades "privadas" (não 100%, mas dificulta acesso)
- **Library design:** Adicionar funcionalidade sem conflitos
- **Framework internals:** React, Vue usam Symbols internamente

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Primitive type:** 7º tipo primitivo
2. **Uniqueness:** Cada Symbol é único
3. **Immutability:** Não pode ser modificado
4. **Description:** String opcional para debugging
5. **Non-enumerable:** Não aparece em loops/keys

### Pilares Fundamentais

- **`Symbol()`:** Factory function (não constructor)
- **`Symbol.for(key)`:** Global symbol registry
- **`Symbol.keyFor(sym)`:** Obter chave global
- **Well-known Symbols:** Symbol.iterator, Symbol.toPrimitive, etc.
- **Object properties:** Usar Symbols como chaves

### Visão Geral das Nuances

- **Não coerção:** Symbol não converte para string/number
- **Reflection:** `Object.getOwnPropertySymbols()`
- **JSON:** Symbols ignorados em `JSON.stringify()`
- **Description vs key:** Descrição != chave global

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Symbol() Factory Function

```javascript
// Symbol() é FACTORY FUNCTION (não constructor)
const sym1 = Symbol();

// ❌ NÃO use new
// const sym2 = new Symbol();  // TypeError: Symbol is not a constructor

// Com descrição
const sym3 = Symbol('my description');

// Descrição é APENAS para debugging
console.log(sym3.toString());  // "Symbol(my description)"
console.log(sym3.description);  // "my description"

// Descrição NÃO afeta unicidade
const a = Symbol('test');
const b = Symbol('test');
console.log(a === b);  // false (ainda únicos!)
```

#### Uniqueness Guarantee

```javascript
// Cada Symbol() retorna novo valor único
const sym1 = Symbol();
const sym2 = Symbol();
const sym3 = Symbol();

console.log(sym1 === sym2);  // false
console.log(sym2 === sym3);  // false
console.log(sym1 === sym3);  // false

// Mesmo com descrição idêntica
const a = Symbol('x');
const b = Symbol('x');
console.log(a === b);  // false

// Única forma de ter Symbol igual: mesma referência
const c = a;
console.log(a === c);  // true (mesma referência)
```

### Princípios Conceituais

#### Symbol Como Propriedade de Objeto

```javascript
const id = Symbol('id');
const nome = Symbol('nome');

const usuario = {
    [id]: 123,           // Symbol property
    [nome]: 'João',      // Symbol property
    email: 'joao@email.com'  // String property normal
};

// Acessar
console.log(usuario[id]);     // 123
console.log(usuario[nome]);   // "João"
console.log(usuario.email);   // "joao@email.com"

// Symbols NÃO aparecem em enumeração normal
console.log(Object.keys(usuario));  // ["email"]
console.log(Object.getOwnPropertyNames(usuario));  // ["email"]

// Para obter Symbols
console.log(Object.getOwnPropertySymbols(usuario));  // [Symbol(id), Symbol(nome)]

// Reflect.ownKeys obtém TUDO (strings + Symbols)
console.log(Reflect.ownKeys(usuario));  // ["email", Symbol(id), Symbol(nome)]
```

#### Symbol.for() - Global Registry

```javascript
// Symbol.for(key) cria/obtém Symbol GLOBAL
const sym1 = Symbol.for('app.id');
const sym2 = Symbol.for('app.id');

console.log(sym1 === sym2);  // true (MESMO Symbol!)

// Diferente de Symbol() normal
const sym3 = Symbol('app.id');
console.log(sym1 === sym3);  // false (Symbol() sempre único)

// Symbol.keyFor() obtém chave global
console.log(Symbol.keyFor(sym1));  // "app.id"
console.log(Symbol.keyFor(sym3));  // undefined (não está no registry)
```

**Global registry:** Compartilhar Symbols entre módulos, frames, workers.

---

## 🔍 Análise Conceitual Profunda

### Criando Symbols

```javascript
// Sem descrição
const sym1 = Symbol();

// Com descrição (recomendado para debugging)
const sym2 = Symbol('userId');
const sym3 = Symbol('uniqueKey');

// Descrição não afeta unicidade
const a = Symbol('test');
const b = Symbol('test');
console.log(a === b);  // false

// Acessar descrição
console.log(sym2.description);  // "userId"
console.log(sym2.toString());   // "Symbol(userId)"
```

### Symbol Como Object Key

```javascript
const SECRET_KEY = Symbol('secret');

const config = {
    publicUrl: 'https://api.example.com',
    [SECRET_KEY]: 'super-secret-api-key'
};

// Acessar
console.log(config.publicUrl);      // "https://api.example.com"
console.log(config[SECRET_KEY]);    // "super-secret-api-key"

// Não enumerável
console.log(Object.keys(config));   // ["publicUrl"]
for (let key in config) {
    console.log(key);  // "publicUrl" (SECRET_KEY oculto!)
}

// JSON.stringify ignora Symbols
console.log(JSON.stringify(config));
// {"publicUrl":"https://api.example.com"} (SECRET_KEY removido!)
```

### Symbol.for() e Symbol.keyFor()

```javascript
// Criar Symbol global
const globalId = Symbol.for('app.config.id');

// Obter mesmo Symbol
const sameGlobalId = Symbol.for('app.config.id');

console.log(globalId === sameGlobalId);  // true

// Obter chave
console.log(Symbol.keyFor(globalId));  // "app.config.id"

// Symbol local não tem chave
const localId = Symbol('local');
console.log(Symbol.keyFor(localId));  // undefined

// Uso cross-module
// module-a.js
export const USER_ID = Symbol.for('app.user.id');

// module-b.js
const USER_ID = Symbol.for('app.user.id');  // Mesmo Symbol!
```

### Uniqueness Demonstration

```javascript
// Mesmo com descrições iguais, são diferentes
const sym1 = Symbol('unique');
const sym2 = Symbol('unique');
const sym3 = Symbol('unique');

console.log(sym1 === sym2);  // false
console.log(sym2 === sym3);  // false

// Única forma de igualdade: mesma referência
const sym4 = sym1;
console.log(sym1 === sym4);  // true

// Comparação com primitivos normais
const str1 = 'test';
const str2 = 'test';
console.log(str1 === str2);  // true (strings são iguais se valores iguais)

const num1 = 42;
const num2 = 42;
console.log(num1 === num2);  // true

// Symbol é único SEMPRE (exceto global registry)
```

### Non-Enumerable Properties

```javascript
const id = Symbol('id');
const obj = {
    name: 'João',
    age: 30,
    [id]: 123
};

// Loops não veem Symbols
for (let key in obj) {
    console.log(key);  // "name", "age" (sem Symbol)
}

// Object methods ignoram Symbols
console.log(Object.keys(obj));  // ["name", "age"]
console.log(Object.getOwnPropertyNames(obj));  // ["name", "age"]
console.log(Object.values(obj));  // ["João", 30]
console.log(Object.entries(obj));  // [["name", "João"], ["age", 30]]

// Para obter Symbols
console.log(Object.getOwnPropertySymbols(obj));  // [Symbol(id)]

// Reflect.ownKeys obtém TUDO
console.log(Reflect.ownKeys(obj));  // ["name", "age", Symbol(id)]
```

### Symbol vs String Keys

```javascript
const obj = {
    // String keys
    name: 'João',
    'first-name': 'João',
    
    // Symbol keys
    [Symbol('id')]: 123,
    [Symbol.for('global-id')]: 456
};

// String keys enumeráveis
console.log(Object.keys(obj));  // ["name", "first-name"]

// Symbol keys ocultos
console.log(Object.getOwnPropertySymbols(obj));
// [Symbol(id), Symbol(global-id)]
```

### Preventing Name Collisions

```javascript
// Biblioteca A
const libA = {
    version: Symbol('version')
};

libA[libA.version] = '1.0.0';

// Biblioteca B
const libB = {
    version: Symbol('version')  // Diferente de libA.version!
};

libB[libB.version] = '2.0.0';

// Mesclando
const app = {
    ...libA,
    ...libB
};

console.log(app[libA.version]);  // "1.0.0"
console.log(app[libB.version]);  // "2.0.0"

// Sem colisão! ✅
```

### Type Coercion Restrictions

```javascript
const sym = Symbol('test');

// ❌ Symbol NÃO converte para string
// console.log('Symbol: ' + sym);  // TypeError

// ✅ Conversão explícita funciona
console.log('Symbol: ' + sym.toString());  // "Symbol: Symbol(test)"
console.log('Symbol: ' + String(sym));     // "Symbol: Symbol(test)"
console.log(`Symbol: ${sym.description}`); // "Symbol: test"

// ❌ Symbol NÃO converte para number
// console.log(sym + 1);  // TypeError

// ✅ Boolean coercion funciona
console.log(Boolean(sym));  // true (todos Symbols são truthy)
if (sym) {
    console.log('Truthy');  // Executa
}
```

### Symbol Description Property

```javascript
const sym1 = Symbol('my description');
const sym2 = Symbol();  // Sem descrição

console.log(sym1.description);  // "my description"
console.log(sym2.description);  // undefined

// .description é read-only
// sym1.description = 'new';  // ❌ Não funciona (immutable)

// toString() retorna "Symbol(...)"
console.log(sym1.toString());  // "Symbol(my description)"
console.log(sym2.toString());  // "Symbol()"
```

### Well-Known Symbols Preview

```javascript
// JavaScript tem Symbols "bem conhecidos" built-in
console.log(Symbol.iterator);      // Symbol(Symbol.iterator)
console.log(Symbol.toPrimitive);   // Symbol(Symbol.toPrimitive)
console.log(Symbol.toStringTag);   // Symbol(Symbol.toStringTag)

// Usados para metaprogramming
const obj = {
    [Symbol.toStringTag]: 'CustomObject'
};

console.log(Object.prototype.toString.call(obj));
// "[object CustomObject]"

// Mais detalhes no próximo arquivo (well-known symbols)
```

### JSON Ignores Symbols

```javascript
const obj = {
    name: 'João',
    age: 30,
    [Symbol('id')]: 123,
    [Symbol('secret')]: 'password'
};

const json = JSON.stringify(obj);
console.log(json);
// {"name":"João","age":30} (Symbols removidos!)

// Parse não restaura Symbols
const parsed = JSON.parse(json);
console.log(Object.getOwnPropertySymbols(parsed));  // []
```

### Object.assign() e Symbols

```javascript
const source = {
    name: 'João',
    [Symbol('id')]: 123
};

const target = {};
Object.assign(target, source);

console.log(target.name);  // "João"
console.log(Object.getOwnPropertySymbols(target));
// [Symbol(id)] (Symbols copiados!)
```

### Symbol in Collections

```javascript
const sym1 = Symbol('a');
const sym2 = Symbol('b');

// Set
const set = new Set([sym1, sym2, sym1]);
console.log(set.size);  // 2 (sym1 duplicado removido)

// Map
const map = new Map([
    [sym1, 'valor A'],
    [sym2, 'valor B']
]);

console.log(map.get(sym1));  // "valor A"
console.log(map.get(sym2));  // "valor B"

// Symbol como chave funciona perfeitamente!
```

### Symbol Registry Use Case

```javascript
// Cross-module communication
// auth.js
export const TOKEN_KEY = Symbol.for('app.auth.token');

export function setToken(token) {
    globalThis[TOKEN_KEY] = token;
}

export function getToken() {
    return globalThis[TOKEN_KEY];
}

// api.js
const TOKEN_KEY = Symbol.for('app.auth.token');  // Mesmo Symbol!

function makeRequest() {
    const token = globalThis[TOKEN_KEY];
    // Usar token...
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Symbols

**Use quando:**

1. **Propriedades únicas:** Evitar name collisions
2. **Metaprogramming:** Implementar protocols (iteration, conversion)
3. **Library internals:** Adicionar funcionalidade sem expor
4. **Weak privacy:** Propriedades "privadas" (não 100% privado)
5. **Constants:** Enums com unicidade garantida

**Exemplos:**

```javascript
// 1. Propriedades únicas
const ID = Symbol('id');
obj[ID] = 123;

// 2. Metaprogramming
obj[Symbol.iterator] = function*() { /* ... */ };

// 3. Library internals
const INTERNAL_STATE = Symbol('state');
class MyClass {
    constructor() {
        this[INTERNAL_STATE] = {};
    }
}

// 4. Weak privacy
const _private = Symbol('private');
const obj2 = { [_private]: 'secret' };

// 5. Constants
const COLOR = {
    RED: Symbol('red'),
    GREEN: Symbol('green'),
    BLUE: Symbol('blue')
};
```

### Quando NÃO Usar Symbols

**Evite quando:**

1. **Serialização:** JSON.stringify remove Symbols
2. **Debugging:** Dificulta inspeção
3. **True privacy:** Use # private fields (classes)
4. **Performance crítica:** Overhead mínimo existe

```javascript
// ❌ Não para serialização
const obj = {
    [Symbol('id')]: 123
};
JSON.stringify(obj);  // {} (perdido!)

// ✅ Use string key
const obj2 = { id: 123 };

// ❌ Não para true privacy
const secret = Symbol('secret');
obj[secret] = 'password';
Object.getOwnPropertySymbols(obj);  // Ainda acessível!

// ✅ Use private fields (classes)
class MyClass {
    #secret = 'password';  // Verdadeiramente privado
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Não É True Privacy

```javascript
const SECRET = Symbol('secret');
const obj = {
    [SECRET]: 'password'
};

// "Privado" mas ainda acessível
const symbols = Object.getOwnPropertySymbols(obj);
console.log(obj[symbols[0]]);  // "password" (acessado!)

// ✅ True privacy: private fields
class Secure {
    #secret = 'password';
    
    getSecret() {
        return this.#secret;
    }
}

const secure = new Secure();
// console.log(secure.#secret);  // SyntaxError (verdadeiramente privado!)
```

### JSON Serialization Loss

```javascript
const obj = {
    name: 'João',
    [Symbol('id')]: 123
};

const json = JSON.stringify(obj);
console.log(json);  // {"name":"João"} (Symbol perdido!)

// ✅ Workaround (se necessário)
function serializeWithSymbols(obj) {
    const symbols = Object.getOwnPropertySymbols(obj);
    const symbolData = symbols.map(sym => ({
        key: sym.description,
        value: obj[sym]
    }));
    
    return JSON.stringify({
        ...obj,
        __symbols: symbolData
    });
}
```

### No Auto-Coercion

```javascript
const sym = Symbol('test');

// ❌ TypeError
// '' + sym
// `${sym}`
// sym + 1

// ✅ Explícito
String(sym)  // "Symbol(test)"
sym.toString()  // "Symbol(test)"
```

### Description != Key

```javascript
// Description é para debugging, não é identifier
const sym1 = Symbol('test');
const sym2 = Symbol('test');

console.log(sym1.description === sym2.description);  // true
console.log(sym1 === sym2);  // false (ainda únicos!)

// Global registry: key É identifier
const global1 = Symbol.for('test');
const global2 = Symbol.for('test');
console.log(global1 === global2);  // true
```

---

## 🔗 Interconexões Conceituais

### Relação com Well-Known Symbols (Próximo)

```javascript
// Symbols normais
const mySymbol = Symbol('custom');

// Well-known Symbols (built-in)
Symbol.iterator
Symbol.toPrimitive
Symbol.toStringTag
// ... (próximo arquivo)
```

### Relação com Object Properties

```javascript
// String keys vs Symbol keys
const obj = {
    stringKey: 'value',        // Enumerável
    [Symbol('sym')]: 'value'   // Não-enumerável
};
```

### Relação com Metaprogramming

```javascript
// Symbol permite customizar comportamento
const obj = {
    [Symbol.toPrimitive](hint) {
        return hint === 'number' ? 42 : 'custom';
    }
};

console.log(+obj);  // 42
console.log(`${obj}`);  // "custom"
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Template Literals Basics
2. Tagged Templates
3. Raw Strings
4. **Symbols Basics** (você está aqui)
5. **Well-Known Symbols** (próximo)
6. Symbols as Properties

### Preparação para Well-Known Symbols

JavaScript define **Symbols bem conhecidos** para metaprogramming:

```javascript
// Symbol.iterator - protocol de iteração
const iterable = {
    [Symbol.iterator]() {
        let i = 0;
        return {
            next() {
                if (i < 3) {
                    return { value: i++, done: false };
                }
                return { done: true };
            }
        };
    }
};

for (let value of iterable) {
    console.log(value);  // 0, 1, 2
}

// Symbol.toPrimitive - conversão customizada
// Symbol.toStringTag - customizar Object.prototype.toString
// ... e mais (próximo arquivo)
```

Próximo: **Well-Known Symbols** detalhado.

---

## 📚 Conclusão

**Symbols** são **primitive type** para criar **identificadores únicos** que evitam **name collisions** e permitem **metaprogramming**.

**Conceitos essenciais:**
- **Primitive type:** 7º tipo primitivo em JavaScript
- **Uniqueness:** Cada `Symbol()` é garantidamente único
- **Immutability:** Symbols não podem ser modificados
- **Description:** String opcional para debugging
- **Factory function:** `Symbol()` (não `new Symbol()`)
- **Object keys:** Usar Symbols como propriedades
- **Non-enumerable:** Não aparecem em `Object.keys()`, `for...in`
- **`Symbol.for(key)`:** Global symbol registry
- **`Symbol.keyFor(sym)`:** Obter chave global
- **No coercion:** Não converte automaticamente para string/number
- **`Object.getOwnPropertySymbols()`:** Obter Symbols de objeto
- **JSON ignores:** `JSON.stringify()` remove Symbols
- **Weak privacy:** Dificulta mas não garante privacidade
- **Well-known Symbols:** Metaprogramming (próximo)

Dominar Symbols é essencial para **library design**, **metaprogramming** e **evitar name collisions** em JavaScript moderno!
