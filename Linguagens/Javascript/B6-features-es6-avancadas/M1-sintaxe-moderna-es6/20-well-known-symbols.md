# Well-Known Symbols: Metaprogramming e Protocols

## 🎯 Introdução e Definição

### Definição Conceitual

**Well-known Symbols** (Symbols bem conhecidos) são **Symbols built-in** definidos pelo JavaScript que permitem **customizar comportamento** de objetos e implementar **protocols** (protocolos) para iteração, conversão de tipo, comparação, etc.

**Sintaxe:**

```javascript
// Well-known Symbols são propriedades estáticas de Symbol
console.log(Symbol.iterator);       // Symbol(Symbol.iterator)
console.log(Symbol.toPrimitive);    // Symbol(Symbol.toPrimitive)
console.log(Symbol.toStringTag);    // Symbol(Symbol.toStringTag)

// Usar para customizar comportamento
const obj = {
    // Symbol.iterator - tornar objeto iterável
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

// Agora obj é iterável!
for (let value of obj) {
    console.log(value);  // 0, 1, 2
}

// Symbol.toStringTag - customizar Object.prototype.toString
const customObj = {
    [Symbol.toStringTag]: 'MeuObjeto'
};

console.log(Object.prototype.toString.call(customObj));
// "[object MeuObjeto]"

// Symbol.toPrimitive - conversão customizada
const numero = {
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') return 42;
        if (hint === 'string') return 'quarenta e dois';
        return true;  // default
    }
};

console.log(+numero);      // 42 (hint: 'number')
console.log(`${numero}`);  // "quarenta e dois" (hint: 'string')
console.log(numero + '');  // "quarenta e dois" (hint: 'default')
```

**Características:**

- **Built-in:** Definidos pela especificação ECMAScript
- **Static properties:** `Symbol.iterator`, `Symbol.toPrimitive`, etc.
- **Protocols:** Definem interfaces para comportamento
- **Metaprogramming:** Customizar operações fundamentais
- **Unique:** São Symbols (únicos), mas compartilhados globalmente

### Lista Completa de Well-Known Symbols

```javascript
// ITERATION
Symbol.iterator          // for...of, spread, destructuring
Symbol.asyncIterator     // for await...of

// TYPE CONVERSION
Symbol.toPrimitive       // Conversão para primitivo
Symbol.toStringTag       // Object.prototype.toString()

// INSTANCEOF
Symbol.hasInstance       // instanceof operator customizado

// COLLECTIONS
Symbol.isConcatSpreadable  // Array.prototype.concat() behavior

// REGEX
Symbol.match             // String.prototype.match()
Symbol.matchAll          // String.prototype.matchAll()
Symbol.replace           // String.prototype.replace()
Symbol.search            // String.prototype.search()
Symbol.split             // String.prototype.split()

// MISC
Symbol.species           // Constructor derivado para subclasses
Symbol.unscopables       // Propriedades excluídas de with statement
```

### Contexto Histórico e Motivação

**Problema pré-ES6:** Impossível customizar comportamento fundamental de objetos

```javascript
// ES5 - objetos customizados não iteráveis
const obj = { a: 1, b: 2, c: 3 };

// ❌ Não funciona
// for (let value of obj) { }  // TypeError: obj is not iterable

// ❌ Não funciona
// [...obj]  // TypeError

// Apenas arrays/strings são iteráveis nativamente
```

**ES6 (2015):** Well-known Symbols introduzidos

```javascript
// ✅ Agora podemos tornar obj iterável!
const obj = {
    a: 1,
    b: 2,
    c: 3,
    
    [Symbol.iterator]() {
        const keys = Object.keys(this);
        let index = 0;
        
        return {
            next: () => {
                if (index < keys.length) {
                    const key = keys[index++];
                    return { value: this[key], done: false };
                }
                return { done: true };
            }
        };
    }
};

// Funciona!
for (let value of obj) {
    console.log(value);  // 1, 2, 3
}

console.log([...obj]);  // [1, 2, 3]
```

**Motivações principais:**

1. **Protocols:** Definir interfaces padrão (iteration, conversion)
2. **Extensibility:** Estender comportamento sem quebrar código
3. **Metaprogramming:** Customizar operações fundamentais
4. **Backward compatibility:** Adicionar features sem conflitos
5. **Type safety:** TypeScript type checking com protocols

### Problema Fundamental que Resolve

**Problema:** Como permitir que **objetos customizados** implementem **comportamentos nativos** (iteração, conversão, etc.) sem **quebrar código existente**?

**Solução:** Well-known Symbols fornecem **chaves únicas** que não colidem com propriedades existentes.

**Exemplo - tornar classe iterável:**

```javascript
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    
    // Implementar protocol de iteração
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        
        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
}

const range = new Range(1, 5);

// Funciona com for...of!
for (let num of range) {
    console.log(num);  // 1, 2, 3, 4, 5
}

// Funciona com spread!
console.log([...range]);  // [1, 2, 3, 4, 5]

// Funciona com destructuring!
const [first, second] = range;
console.log(first, second);  // 1, 2
```

### Importância no Ecossistema

Well-known Symbols são **fundamentais** para:

- **Iteration protocols:** `for...of`, spread, destructuring
- **Type conversion:** Customizar conversão para primitivo
- **Framework internals:** React, Vue, Angular usam protocols
- **Library design:** Criar APIs que seguem padrões nativos
- **Async iteration:** `for await...of`

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Built-in Symbols:** Definidos pela especificação
2. **Protocols:** Interfaces para comportamento
3. **Metaprogramming:** Customizar operações
4. **Static properties:** Acessados via `Symbol.iterator`, etc.
5. **Unique but shared:** Únicos mas compartilhados globalmente

### Pilares Fundamentais

- **Symbol.iterator:** Protocol de iteração
- **Symbol.toPrimitive:** Conversão para primitivo
- **Symbol.toStringTag:** toString customizado
- **Symbol.hasInstance:** instanceof customizado
- **Symbol.species:** Constructor derivado

### Visão Geral das Nuances

- **Iterator protocol:** `next()`, `value`, `done`
- **Hint parameter:** 'number', 'string', 'default'
- **Return value:** Tipos esperados por cada protocol
- **Built-in integration:** Operadores usam Symbols automaticamente

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Well-Known Symbols São Compartilhados

```javascript
// Well-known Symbols são únicos mas compartilhados
const iter1 = Symbol.iterator;
const iter2 = Symbol.iterator;

console.log(iter1 === iter2);  // true (mesmo Symbol!)

// Diferente de Symbol() normal
const custom1 = Symbol('iterator');
const custom2 = Symbol('iterator');
console.log(custom1 === custom2);  // false
```

#### Operators Use Symbols Internally

```javascript
// for...of internamente chama obj[Symbol.iterator]()
const arr = [1, 2, 3];

for (let value of arr) {
    console.log(value);
}

// Equivalente a:
const iterator = arr[Symbol.iterator]();
let result = iterator.next();

while (!result.done) {
    console.log(result.value);
    result = iterator.next();
}
```

### Princípios Conceituais

#### Iterator Protocol

```javascript
// Protocol: objeto com método next()
const iterator = {
    next() {
        return {
            value: /* próximo valor */,
            done: /* boolean */
        };
    }
};

// Iterable protocol: objeto com [Symbol.iterator]()
const iterable = {
    [Symbol.iterator]() {
        return iterator;  // Retorna iterator
    }
};
```

#### ToPrimitive Hint

```javascript
// hint pode ser: 'number', 'string', 'default'
const obj = {
    [Symbol.toPrimitive](hint) {
        console.log('Hint:', hint);
        
        if (hint === 'number') return 42;
        if (hint === 'string') return 'quarenta e dois';
        return null;  // default
    }
};

+obj;           // Hint: number
`${obj}`;       // Hint: string
obj + '';       // Hint: default
obj == 42;      // Hint: default
```

---

## 🔍 Análise Conceitual Profunda

### Symbol.iterator - Iteration Protocol

```javascript
// Tornar objeto iterável
const fibonacci = {
    [Symbol.iterator]() {
        let [a, b] = [0, 1];
        let count = 0;
        const max = 10;
        
        return {
            next() {
                if (count++ < max) {
                    [a, b] = [b, a + b];
                    return { value: a, done: false };
                }
                return { done: true };
            }
        };
    }
};

// Uso
console.log([...fibonacci]);
// [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]

for (let num of fibonacci) {
    console.log(num);  // 1, 1, 2, 3, 5, 8, 13, 21, 34, 55
}

const [first, second, third] = fibonacci;
console.log(first, second, third);  // 1, 1, 2
```

### Symbol.iterator - Generator Simplification

```javascript
// Generator simplifica iterators
const range = {
    start: 1,
    end: 5,
    
    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
};

console.log([...range]);  // [1, 2, 3, 4, 5]
```

### Symbol.asyncIterator - Async Iteration

```javascript
// Async iteration protocol
const asyncIterable = {
    async *[Symbol.asyncIterator]() {
        for (let i = 1; i <= 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            yield i;
        }
    }
};

// for await...of
(async () => {
    for await (let value of asyncIterable) {
        console.log(value);  // 1 (100ms), 2 (200ms), 3 (300ms)
    }
})();
```

### Symbol.toPrimitive - Type Conversion

```javascript
const produto = {
    nome: 'Notebook',
    preco: 2500,
    
    [Symbol.toPrimitive](hint) {
        console.log('Converting to:', hint);
        
        if (hint === 'number') {
            return this.preco;
        }
        
        if (hint === 'string') {
            return `${this.nome} - R$ ${this.preco}`;
        }
        
        // default
        return this.preco;
    }
};

console.log(+produto);              // 2500 (hint: number)
console.log(`${produto}`);          // "Notebook - R$ 2500" (hint: string)
console.log(produto + 100);         // 2600 (hint: default)
console.log(produto == 2500);       // true (hint: default)
```

### Symbol.toStringTag - Object.prototype.toString

```javascript
// Customizar Object.prototype.toString()
class ValidatorClass {
    [Symbol.toStringTag] = 'Validator';
}

const validator = new ValidatorClass();

console.log(Object.prototype.toString.call(validator));
// "[object Validator]"

// Comparação com default
class Normal {}
const normal = new Normal();

console.log(Object.prototype.toString.call(normal));
// "[object Object]"

// Built-in types
console.log(Object.prototype.toString.call([]));         // "[object Array]"
console.log(Object.prototype.toString.call(new Map()));  // "[object Map]"
console.log(Object.prototype.toString.call(/regex/));    // "[object RegExp]"
```

### Symbol.hasInstance - instanceof Customization

```javascript
// Customizar instanceof operator
class MyArray {
    static [Symbol.hasInstance](instance) {
        return Array.isArray(instance);
    }
}

console.log([] instanceof MyArray);  // true
console.log([1, 2, 3] instanceof MyArray);  // true
console.log({} instanceof MyArray);  // false

// Outro exemplo
class PrimitiveNumber {
    static [Symbol.hasInstance](instance) {
        return typeof instance === 'number';
    }
}

console.log(42 instanceof PrimitiveNumber);  // true
console.log('42' instanceof PrimitiveNumber);  // false
```

### Symbol.isConcatSpreadable - Array.concat Behavior

```javascript
// Controlar spread em Array.prototype.concat()
const arr1 = [1, 2];
const arr2 = [3, 4];

console.log(arr1.concat(arr2));  // [1, 2, 3, 4] (spread)

// Prevenir spread
arr2[Symbol.isConcatSpreadable] = false;
console.log(arr1.concat(arr2));  // [1, 2, [3, 4]] (não spread!)

// Object-like array
const arrayLike = {
    length: 2,
    0: 'a',
    1: 'b',
    [Symbol.isConcatSpreadable]: true
};

console.log([].concat(arrayLike));  // ['a', 'b'] (spread!)
```

### Symbol.species - Derived Constructor

```javascript
// Customizar constructor usado em métodos derivados
class MyArray extends Array {
    static get [Symbol.species]() {
        return Array;  // Usar Array em vez de MyArray
    }
}

const myArr = new MyArray(1, 2, 3);
console.log(myArr instanceof MyArray);  // true

// map() retorna Array (não MyArray!)
const mapped = myArr.map(x => x * 2);
console.log(mapped instanceof MyArray);  // false
console.log(mapped instanceof Array);    // true

// Sem Symbol.species (comportamento padrão)
class DefaultArray extends Array {}

const defArr = new DefaultArray(1, 2, 3);
const defMapped = defArr.map(x => x * 2);
console.log(defMapped instanceof DefaultArray);  // true
```

### Symbol.match - String.prototype.match

```javascript
// Customizar String.prototype.match()
class CustomMatcher {
    constructor(pattern) {
        this.pattern = pattern;
    }
    
    [Symbol.match](str) {
        const index = str.indexOf(this.pattern);
        if (index === -1) return null;
        
        return [this.pattern, index];
    }
}

const matcher = new CustomMatcher('test');
const result = 'this is a test string'.match(matcher);

console.log(result);  // ['test', 10]
```

### Symbol.replace - String.prototype.replace

```javascript
// Customizar String.prototype.replace()
class Replacer {
    constructor(find, replace) {
        this.find = find;
        this.replace = replace;
    }
    
    [Symbol.replace](str) {
        return str.split(this.find).join(this.replace);
    }
}

const replacer = new Replacer('o', '0');
const result = 'Hello World'.replace(replacer);

console.log(result);  // "Hell0 W0rld"
```

### Symbol.split - String.prototype.split

```javascript
// Customizar String.prototype.split()
class CustomSplitter {
    constructor(separator) {
        this.separator = separator;
    }
    
    [Symbol.split](str) {
        const parts = str.split(this.separator);
        return parts.map(part => part.trim());
    }
}

const splitter = new CustomSplitter(',');
const result = 'a, b, c, d'.split(splitter);

console.log(result);  // ['a', 'b', 'c', 'd']
```

### Symbol.search - String.prototype.search

```javascript
// Customizar String.prototype.search()
class Searcher {
    constructor(pattern) {
        this.pattern = pattern;
    }
    
    [Symbol.search](str) {
        return str.indexOf(this.pattern);
    }
}

const searcher = new Searcher('World');
const index = 'Hello World'.search(searcher);

console.log(index);  // 6
```

### Multiple Well-Known Symbols

```javascript
// Objeto com múltiplos protocols
const customCollection = {
    items: [1, 2, 3, 4, 5],
    
    // Iteration
    *[Symbol.iterator]() {
        yield* this.items;
    },
    
    // toString
    [Symbol.toStringTag]: 'CustomCollection',
    
    // toPrimitive
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.items.length;
        }
        return this.items.join(', ');
    }
};

// Uso
for (let item of customCollection) {
    console.log(item);  // 1, 2, 3, 4, 5
}

console.log(Object.prototype.toString.call(customCollection));
// "[object CustomCollection]"

console.log(+customCollection);      // 5 (length)
console.log(`${customCollection}`);  // "1, 2, 3, 4, 5"
```

### Class with Well-Known Symbols

```javascript
class Vector {
    constructor(...components) {
        this.components = components;
    }
    
    // Iteration
    *[Symbol.iterator]() {
        yield* this.components;
    }
    
    // toString tag
    get [Symbol.toStringTag]() {
        return 'Vector';
    }
    
    // toPrimitive
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            // Magnitude
            return Math.sqrt(
                this.components.reduce((sum, c) => sum + c * c, 0)
            );
        }
        
        if (hint === 'string') {
            return `Vector(${this.components.join(', ')})`;
        }
        
        return this.components;
    }
}

const v = new Vector(3, 4);

// Iteration
console.log([...v]);  // [3, 4]

// toString
console.log(Object.prototype.toString.call(v));  // "[object Vector]"

// toPrimitive
console.log(+v);      // 5 (magnitude: sqrt(3² + 4²) = 5)
console.log(`${v}`);  // "Vector(3, 4)"
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Well-Known Symbols

**Use quando:**

1. **Custom iteration:** Tornar objetos iteráveis
2. **Type conversion:** Customizar conversão para primitivo
3. **Library design:** Seguir protocols nativos
4. **Framework integration:** Integrar com built-ins
5. **Metaprogramming:** Customizar comportamento fundamental

**Exemplos:**

```javascript
// 1. Custom iteration
class MyCollection {
    *[Symbol.iterator]() { /* ... */ }
}

// 2. Type conversion
const obj = {
    [Symbol.toPrimitive](hint) { /* ... */ }
};

// 3. Library design
class CustomArray {
    [Symbol.isConcatSpreadable] = true;
}

// 4. Framework integration
class Component {
    [Symbol.toStringTag] = 'ReactComponent';
}

// 5. Metaprogramming
class Type {
    static [Symbol.hasInstance](instance) { /* ... */ }
}
```

### Quando NÃO Usar

**Evite quando:**

1. **Overhead desnecessário:** Iteração simples
2. **Complexidade excessiva:** toString() suficiente
3. **Compatibility:** Browsers muito antigos

```javascript
// ❌ Over-engineering para iteration simples
const arr = {
    items: [1, 2, 3],
    [Symbol.iterator]() { return this.items[Symbol.iterator](); }
};

// ✅ Use array diretamente
const arr2 = [1, 2, 3];

// ❌ Complexo para toString
const obj = {
    [Symbol.toStringTag]: 'MyObj',
    toString() { return 'MyObj'; }  // Duplicado!
};

// ✅ toString() suficiente
const obj2 = {
    toString() { return 'MyObj'; }
};
```

---

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```javascript
// Symbol.toPrimitive adiciona overhead
const obj = {
    [Symbol.toPrimitive](hint) {
        // Processamento customizado
        return 42;
    }
};

// Para milhões de conversões, considere impacto
```

### Iterator Must Return Iterator Protocol

```javascript
// ❌ Retorno incorreto
const bad = {
    [Symbol.iterator]() {
        return [1, 2, 3];  // ❌ Array não é iterator!
    }
};

// TypeError: Result of the Symbol.iterator method is not an object

// ✅ Retornar iterator protocol
const good = {
    [Symbol.iterator]() {
        const arr = [1, 2, 3];
        return arr[Symbol.iterator]();  // ✅ Iterator real
    }
};
```

### toPrimitive Must Return Primitive

```javascript
// ❌ Retornar objeto
const bad = {
    [Symbol.toPrimitive](hint) {
        return { value: 42 };  // ❌ Objeto!
    }
};

console.log(+bad);  // TypeError: Cannot convert object to primitive value

// ✅ Retornar primitivo
const good = {
    [Symbol.toPrimitive](hint) {
        return 42;  // ✅ Number (primitivo)
    }
};
```

---

## 🔗 Interconexões Conceituais

### Relação com Iteration Protocols

```javascript
// Symbol.iterator + generators
function* gen() {
    yield 1;
    yield 2;
}

const iter = gen();
console.log([...iter]);  // [1, 2]
```

### Relação com Type Coercion

```javascript
// Symbol.toPrimitive customiza coerção
const obj = {
    [Symbol.toPrimitive](hint) {
        return hint === 'number' ? 42 : 'string';
    }
};

console.log(+obj);  // 42
console.log(`${obj}`);  // "string"
```

### Relação com Operators

```javascript
// Operators usam well-known Symbols
// for...of → Symbol.iterator
// instanceof → Symbol.hasInstance
// + → Symbol.toPrimitive
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Template Literals Basics
2. Tagged Templates
3. Raw Strings
4. Symbols Basics
5. **Well-Known Symbols** (você está aqui)
6. **Symbols as Properties** (próximo)

### Preparação para Symbols as Properties

Usar Symbols como chaves de objeto com padrões avançados:

```javascript
// Símbolos como propriedades privadas
const _internal = Symbol('internal');

class MyClass {
    constructor() {
        this[_internal] = { secret: 'data' };
    }
    
    getInternal() {
        return this[_internal];
    }
}

// Privacy pattern
// Metadata storage
// Polyfilling
```

Próximo: **Symbols as Properties** - padrões avançados.

---

## 📚 Conclusão

**Well-known Symbols** permitem **metaprogramming** e implementação de **protocols** para customizar comportamento fundamental de objetos.

**Conceitos essenciais:**
- **Built-in Symbols:** Definidos pela especificação
- **Symbol.iterator:** Protocol de iteração (`for...of`)
- **Symbol.asyncIterator:** Async iteration (`for await...of`)
- **Symbol.toPrimitive:** Conversão customizada (hint: number/string/default)
- **Symbol.toStringTag:** Customizar `Object.prototype.toString()`
- **Symbol.hasInstance:** Customizar `instanceof`
- **Symbol.isConcatSpreadable:** Controlar spread em `concat()`
- **Symbol.species:** Constructor derivado para subclasses
- **Regex Symbols:** match, matchAll, replace, search, split
- **Protocols:** Interfaces padrão para comportamento
- **Metaprogramming:** Customizar operações fundamentais
- **Generators:** Simplificam iterators
- **Return values:** Devem seguir protocol (primitivos, iterators)

Dominar well-known Symbols é essencial para **criar APIs avançadas**, **integrar com built-ins** e **metaprogramming** em JavaScript moderno!
