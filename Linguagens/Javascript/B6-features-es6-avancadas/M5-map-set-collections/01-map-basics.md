# Map: Collections de Chave-Valor Avançadas

## 🎯 Introdução e Definição

### Definição Conceitual

**Map** é uma **estrutura de dados** (data structure) introduzida no ES6 que armazena pares **chave-valor** onde **qualquer tipo** pode ser chave (não apenas strings), mantendo **ordem de inserção** e fornecendo **métodos otimizados** para manipulação.

**Sintaxe:**

```javascript
// Criar Map
const map = new Map();

// Adicionar pares chave-valor
map.set('nome', 'João');
map.set('idade', 30);
map.set(true, 'boolean key');
map.set({ id: 1 }, 'object key');
map.set([1, 2], 'array key');

// Obter valor
console.log(map.get('nome'));  // "João"

// Verificar existência
console.log(map.has('idade'));  // true

// Tamanho
console.log(map.size);  // 5

// Deletar
map.delete('idade');
console.log(map.size);  // 4

// Limpar tudo
map.clear();
console.log(map.size);  // 0
```

**Características fundamentais:**

- **Qualquer tipo como chave:** Objetos, funções, primitivos
- **Ordem preservada:** Mantém ordem de inserção
- **Size property:** `.size` retorna quantidade de entries
- **Métodos dedicados:** `.set()`, `.get()`, `.has()`, `.delete()`, `.clear()`
- **Iterável:** Funciona com `for...of`, spread, destructuring
- **Performance:** Otimizado para adição/remoção frequente

### Map vs Object: Diferenças Fundamentais

**Object (tradicional):**

```javascript
// Object - chaves apenas strings/symbols
const obj = {
    nome: 'João',
    idade: 30
};

// Acessar
console.log(obj.nome);  // "João"
console.log(obj['idade']);  // 30

// Tamanho: manual
console.log(Object.keys(obj).length);  // 2

// Herda do prototype
console.log(obj.toString);  // [Function: toString] (herdado!)

// Ordem de chaves: não garantida historicamente
```

**Map (moderno):**

```javascript
// Map - qualquer tipo como chave
const map = new Map();
map.set('nome', 'João');
map.set('idade', 30);

// Acessar
console.log(map.get('nome'));  // "João"

// Tamanho: built-in
console.log(map.size);  // 2

// Sem prototype pollution
console.log(map.toString);  // undefined (Map não herda propriedades)

// Ordem garantida: sempre ordem de inserção
```

**Tabela comparativa conceitual:**

| Característica | Object | Map |
|----------------|--------|-----|
| **Tipo de chave** | String, Symbol | Qualquer tipo |
| **Ordem** | Não garantida (ES5) | Sempre ordem de inserção |
| **Size** | `Object.keys(obj).length` | `map.size` (O(1)) |
| **Iteração** | `for...in`, `Object.keys()` | `for...of`, `.forEach()` |
| **Performance** | Otimizado para propriedades fixas | Otimizado para adição/remoção |
| **Prototype** | Herda de `Object.prototype` | Não herda propriedades |
| **Serialização** | `JSON.stringify()` funciona | Não serializável diretamente |

### Contexto Histórico e Motivação

**Problema pré-ES6:** Objects como mapas improvisados

```javascript
// ES5 - usar Object como Map (limitado)
const userRoles = {};

userRoles['user123'] = 'admin';
userRoles['user456'] = 'editor';

// ❌ Apenas strings como chaves
// userRoles[{ id: 1 }] = 'role';  // Chave vira "[object Object]"!

// ❌ Prototype pollution
userRoles.toString = 'hacked';  // Sobrescreve método herdado

// ❌ Tamanho manual
const count = Object.keys(userRoles).length;

// ❌ Ordem não garantida
```

**Tentativas de solução:**

1. **`Object.create(null)`:** Criar objeto sem prototype

```javascript
const map = Object.create(null);
map.key = 'value';
console.log(map.toString);  // undefined (sem prototype)

// Mas ainda limitado a string keys
```

2. **Arrays de tuplas:** `[[key, value], ...]`

```javascript
const pairs = [
    ['key1', 'value1'],
    ['key2', 'value2']
];

// Busca O(n) - ineficiente!
const value = pairs.find(([k]) => k === 'key1')[1];
```

**ES6 (2015):** Map introduzido

```javascript
// ✅ Map resolve todos os problemas
const map = new Map();

// Qualquer tipo como chave
map.set('string', 'value1');
map.set(123, 'value2');
map.set(true, 'value3');
map.set({ id: 1 }, 'value4');
map.set([1, 2], 'value5');

// Size built-in
console.log(map.size);  // 5

// Ordem garantida
for (let [key, value] of map) {
    console.log(key, value);  // Ordem de inserção mantida
}

// Performance otimizada
map.set('new', 'value');  // O(1) amortizado
map.get('new');  // O(1) lookup
map.delete('new');  // O(1)
```

**Motivações principais:**

1. **Chaves não-string:** Usar objetos, funções, etc. como chaves
2. **Performance:** Operações otimizadas para add/remove frequente
3. **Size tracking:** `.size` em tempo constante
4. **Ordem preservada:** Iteração previsível
5. **Sem prototype:** Evitar prototype pollution
6. **Iteration protocols:** Integração com `for...of`, spread

### Problema Fundamental que Resolve

**Problema:** Como criar **estrutura chave-valor eficiente** que aceite **qualquer tipo** como chave, mantenha **ordem de inserção** e forneça **performance otimizada** para add/remove?

**Cenário real - cache de funções:**

```javascript
// Problema: cachear resultados de funções com qualquer argumento
function expensiveCalculation(obj) {
    // Cálculo pesado...
    return obj.value * 2;
}

// ❌ Object não funciona (chave vira string)
const cacheObj = {};
const key1 = { value: 10 };
cacheObj[key1] = expensiveCalculation(key1);  // key vira "[object Object]"

const key2 = { value: 20 };
console.log(cacheObj[key2]);  // 20 (ERRADO! Deveria ser undefined)
// key2 também vira "[object Object]", colide com key1!

// ✅ Map funciona (chave é objeto real)
const cacheMap = new Map();
const keyA = { value: 10 };
cacheMap.set(keyA, expensiveCalculation(keyA));

const keyB = { value: 20 };
console.log(cacheMap.get(keyB));  // undefined (correto!)
cacheMap.set(keyB, expensiveCalculation(keyB));
console.log(cacheMap.get(keyB));  // 40 (correto!)

// Chaves são comparadas por REFERÊNCIA, não por valor convertido
```

### Importância no Ecossistema

Map é **essencial** para:

- **Caching:** Memoization com chaves complexas
- **Data structures:** Implementar graphs, adjacency lists
- **Metadata storage:** Associar dados a objetos sem modificá-los
- **Frequency counting:** Contar ocorrências de elementos
- **LRU cache:** Least Recently Used cache implementation
- **Framework internals:** React, Vue usam Maps para tracking

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Chave flexível:** Qualquer tipo JavaScript como chave
2. **Ordem preservada:** Sempre mantém ordem de inserção
3. **Size tracking:** `.size` property em O(1)
4. **Métodos dedicados:** API clara e consistente
5. **Iterável:** Implementa iteration protocol

### Pilares Fundamentais

- **`.set(key, value)`:** Adicionar/atualizar entry
- **`.get(key)`:** Obter valor por chave
- **`.has(key)`:** Verificar existência de chave
- **`.delete(key)`:** Remover entry
- **`.clear()`:** Remover todos entries
- **`.size`:** Quantidade de entries

### Visão Geral das Nuances

- **Chave comparison:** Por referência (objetos), por valor (primitivos)
- **NaN handling:** `NaN === NaN` em Map (diferente de `===`)
- **Iteration order:** Keys, values, entries na ordem de inserção
- **Memory:** Mantém referências fortes (vs WeakMap)
- **Chaining:** `.set()` retorna Map (permite chaining)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Hash Table Implementation

Map é tipicamente implementado como **hash table** (tabela hash) otimizada:

```
Conceito:
1. Hash function transforma chave em índice
2. Valor armazenado na posição do índice
3. Collision handling (encadeamento ou open addressing)
4. Dynamic resizing quando load factor > threshold

Performance esperada:
- set(): O(1) amortizado
- get(): O(1) média
- has(): O(1) média
- delete(): O(1) média
- clear(): O(n)
- Iteração: O(n)
```

#### Key Equality

Map usa **SameValueZero** algorithm para comparar chaves:

```javascript
// SameValueZero: similar a ===, mas NaN === NaN
const map = new Map();

// NaN como chave funciona!
map.set(NaN, 'NaN value');
console.log(map.get(NaN));  // "NaN value" (funciona!)

// NaN === NaN é false normalmente
console.log(NaN === NaN);  // false

// Mas Map trata NaN como igual
map.set(NaN, 'updated');
console.log(map.size);  // 1 (NaN não duplicado!)

// +0 e -0 são considerados iguais
map.set(+0, 'zero');
map.set(-0, 'negative zero');
console.log(map.size);  // 1 (só um zero!)
console.log(map.get(+0));  // "negative zero" (sobrescrito)

// Objetos comparados por REFERÊNCIA
const obj1 = { id: 1 };
const obj2 = { id: 1 };
map.set(obj1, 'obj1');
map.set(obj2, 'obj2');
console.log(map.size);  // 2 (objetos diferentes!)
```

### Princípios Conceituais

#### Insertion Order Preservation

Map **sempre** mantém ordem de inserção:

```javascript
const map = new Map();

// Inserir em ordem específica
map.set('c', 3);
map.set('a', 1);
map.set('b', 2);

// Iteração mantém ordem de inserção
for (let [key, value] of map) {
    console.log(key);
    // "c" (primeiro inserido)
    // "a" (segundo inserido)
    // "b" (terceiro inserido)
}

// Atualizar não muda ordem
map.set('a', 10);  // Atualiza valor, não reordena

for (let [key, value] of map) {
    console.log(key, value);
    // "c" 3
    // "a" 10 (ordem mantida!)
    // "b" 2
}
```

#### Chaining Pattern

`.set()` retorna o Map, permitindo chaining:

```javascript
const map = new Map()
    .set('a', 1)
    .set('b', 2)
    .set('c', 3)
    .set('d', 4);

console.log(map.size);  // 4

// Útil para inicialização concisa
```

---

## 🔍 Análise Conceitual Profunda

### Criação e Inicialização

**Criação vazia:**

```javascript
const map = new Map();
console.log(map.size);  // 0
```

**Inicialização com iterable:**

```javascript
// Array de pares [key, value]
const map1 = new Map([
    ['nome', 'João'],
    ['idade', 30],
    ['ativo', true]
]);

console.log(map1.size);  // 3

// Qualquer iterable que produza [key, value]
const entries = [
    [1, 'one'],
    [2, 'two'],
    [3, 'three']
];

const map2 = new Map(entries);
console.log(map2.get(2));  // "two"

// De outro Map
const map3 = new Map(map1);
console.log(map3.size);  // 3 (cópia shallow)
```

**Inicialização com generator:**

```javascript
function* pairGenerator() {
    yield ['a', 1];
    yield ['b', 2];
    yield ['c', 3];
}

const map = new Map(pairGenerator());
console.log(map.size);  // 3
```

### Operações Básicas

**`.set(key, value)` - Adicionar/Atualizar:**

```javascript
const map = new Map();

// Adicionar
map.set('nome', 'João');
map.set('idade', 30);

// Atualizar (chave já existe)
map.set('nome', 'Maria');
console.log(map.get('nome'));  // "Maria"

// Retorna Map (chaining)
map.set('a', 1).set('b', 2).set('c', 3);
console.log(map.size);  // 5
```

**`.get(key)` - Obter Valor:**

```javascript
const map = new Map([
    ['nome', 'João'],
    ['idade', 30]
]);

console.log(map.get('nome'));  // "João"
console.log(map.get('idade'));  // 30

// Chave inexistente retorna undefined
console.log(map.get('email'));  // undefined

// Undefined vs chave com valor undefined
map.set('key', undefined);
console.log(map.get('key'));  // undefined
console.log(map.has('key'));  // true (chave existe!)
console.log(map.has('inexistente'));  // false
```

**`.has(key)` - Verificar Existência:**

```javascript
const map = new Map([
    ['nome', 'João'],
    ['idade', 30]
]);

console.log(map.has('nome'));  // true
console.log(map.has('email'));  // false

// Útil para evitar undefined ambiguity
if (map.has('nome')) {
    console.log('Nome encontrado:', map.get('nome'));
}
```

**`.delete(key)` - Remover Entry:**

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

// Deletar
const deleted = map.delete('b');
console.log(deleted);  // true (deletado)
console.log(map.size);  // 2

// Tentar deletar inexistente
const notDeleted = map.delete('x');
console.log(notDeleted);  // false (não existia)
```

**`.clear()` - Remover Tudo:**

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

console.log(map.size);  // 3

map.clear();
console.log(map.size);  // 0
console.log(map.has('a'));  // false
```

**`.size` Property:**

```javascript
const map = new Map();
console.log(map.size);  // 0

map.set('a', 1);
console.log(map.size);  // 1

map.set('b', 2).set('c', 3);
console.log(map.size);  // 3

map.delete('b');
console.log(map.size);  // 2

map.clear();
console.log(map.size);  // 0

// .size é property (não método!)
// map.size() ❌ TypeError
```

### Iteração

**`for...of` com entries:**

```javascript
const map = new Map([
    ['nome', 'João'],
    ['idade', 30],
    ['ativo', true]
]);

// Padrão: itera sobre entries [key, value]
for (let entry of map) {
    console.log(entry);
    // ["nome", "João"]
    // ["idade", 30]
    // ["ativo", true]
}

// Destructuring direto
for (let [key, value] of map) {
    console.log(`${key}: ${value}`);
    // "nome: João"
    // "idade: 30"
    // "ativo: true"
}
```

**`.keys()` - Iterar Chaves:**

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

for (let key of map.keys()) {
    console.log(key);
    // "a"
    // "b"
    // "c"
}

// Converter para array
const keysArray = [...map.keys()];
console.log(keysArray);  // ["a", "b", "c"]
```

**`.values()` - Iterar Valores:**

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

for (let value of map.values()) {
    console.log(value);
    // 1
    // 2
    // 3
}

const valuesArray = [...map.values()];
console.log(valuesArray);  // [1, 2, 3]
```

**`.entries()` - Iterar Entries:**

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2]
]);

// .entries() é equivalente ao iterator padrão
for (let [key, value] of map.entries()) {
    console.log(key, value);
    // "a" 1
    // "b" 2
}

// map[Symbol.iterator] === map.entries
console.log(map[Symbol.iterator] === map.entries);  // true
```

**`.forEach()` - Callback Iterator:**

```javascript
const map = new Map([
    ['nome', 'João'],
    ['idade', 30]
]);

// forEach(callback(value, key, map))
map.forEach((value, key, mapRef) => {
    console.log(`${key}: ${value}`);
    console.log(mapRef === map);  // true (referência ao Map)
});

// "nome: João"
// true
// "idade: 30"
// true

// Nota: ordem dos parâmetros é (value, key), não (key, value)!
// (Para consistência com Array.forEach)
```

### Chaves de Qualquer Tipo

**Objetos como chaves:**

```javascript
const map = new Map();

const user1 = { id: 1, nome: 'João' };
const user2 = { id: 2, nome: 'Maria' };

map.set(user1, { role: 'admin', active: true });
map.set(user2, { role: 'editor', active: false });

console.log(map.get(user1));  // { role: 'admin', active: true }
console.log(map.get(user2));  // { role: 'editor', active: false }

// Objetos com mesmos valores são chaves DIFERENTES
const user3 = { id: 1, nome: 'João' };  // Mesmo conteúdo que user1
console.log(map.get(user3));  // undefined (referência diferente!)

console.log(user1 === user3);  // false (objetos diferentes)
```

**Funções como chaves:**

```javascript
const map = new Map();

function handler1() { console.log('Handler 1'); }
function handler2() { console.log('Handler 2'); }

map.set(handler1, { priority: 1, enabled: true });
map.set(handler2, { priority: 2, enabled: false });

console.log(map.get(handler1));  // { priority: 1, enabled: true }

// Executar função e obter metadata
const metadata = map.get(handler1);
if (metadata.enabled) {
    handler1();  // "Handler 1"
}
```

**Primitivos como chaves:**

```javascript
const map = new Map();

// String
map.set('string', 'String value');

// Number
map.set(42, 'Number value');

// Boolean
map.set(true, 'Boolean value');

// Null
map.set(null, 'Null value');

// Undefined
map.set(undefined, 'Undefined value');

// Symbol
const sym = Symbol('key');
map.set(sym, 'Symbol value');

console.log(map.size);  // 6

// Cada primitivo é chave distinta
console.log(map.get(42));  // "Number value"
console.log(map.get('42'));  // undefined (tipo diferente!)
```

**Arrays como chaves:**

```javascript
const map = new Map();

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];  // Mesmo conteúdo

map.set(arr1, 'Array 1');
map.set(arr2, 'Array 2');

console.log(map.size);  // 2 (arrays diferentes!)

console.log(map.get(arr1));  // "Array 1"
console.log(map.get(arr2));  // "Array 2"
console.log(map.get([1, 2, 3]));  // undefined (novo array!)

// Arrays comparados por REFERÊNCIA
console.log(arr1 === arr2);  // false
```

### Conversões

**Map para Array:**

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

// Spread entries
const entries = [...map];
console.log(entries);  // [["a", 1], ["b", 2], ["c", 3]]

// Array.from entries
const entries2 = Array.from(map);
console.log(entries2);  // [["a", 1], ["b", 2], ["c", 3]]

// Keys to array
const keys = [...map.keys()];
console.log(keys);  // ["a", "b", "c"]

// Values to array
const values = [...map.values()];
console.log(values);  // [1, 2, 3]
```

**Array para Map:**

```javascript
const pairs = [
    ['nome', 'João'],
    ['idade', 30],
    ['ativo', true]
];

const map = new Map(pairs);
console.log(map.size);  // 3
console.log(map.get('nome'));  // "João"
```

**Object para Map:**

```javascript
const obj = {
    nome: 'João',
    idade: 30,
    ativo: true
};

// Object.entries() retorna [key, value] pairs
const map = new Map(Object.entries(obj));

console.log(map.size);  // 3
console.log(map.get('nome'));  // "João"
```

**Map para Object:**

```javascript
const map = new Map([
    ['nome', 'João'],
    ['idade', 30],
    ['ativo', true]
]);

// Object.fromEntries() (ES2019)
const obj = Object.fromEntries(map);

console.log(obj);
// { nome: 'João', idade: 30, ativo: true }

// Manualmente (ES6)
const obj2 = {};
for (let [key, value] of map) {
    obj2[key] = value;
}
console.log(obj2);
// { nome: 'João', idade: 30, ativo: true }
```

### Clonagem

**Shallow copy:**

```javascript
const original = new Map([
    ['a', { value: 1 }],
    ['b', { value: 2 }]
]);

// Copiar via constructor
const copy1 = new Map(original);

// Copiar via spread
const copy2 = new Map([...original]);

// Copiar via Array.from
const copy3 = new Map(Array.from(original));

console.log(copy1.size);  // 2
console.log(copy1 === original);  // false (Maps diferentes)

// MAS valores são shallow copy (mesma referência!)
const objA = original.get('a');
const objB = copy1.get('a');
console.log(objA === objB);  // true (mesmo objeto!)

objA.value = 100;
console.log(copy1.get('a').value);  // 100 (afeta cópia!)
```

**Deep copy (manual):**

```javascript
function deepCloneMap(map) {
    const cloned = new Map();
    
    for (let [key, value] of map) {
        // Deep clone valor (usando JSON ou library)
        const clonedValue = JSON.parse(JSON.stringify(value));
        cloned.set(key, clonedValue);
    }
    
    return cloned;
}

const original = new Map([
    ['a', { value: 1 }],
    ['b', { value: 2 }]
]);

const copy = deepCloneMap(original);

const objOriginal = original.get('a');
const objCopy = copy.get('a');

console.log(objOriginal === objCopy);  // false (objetos diferentes!)

objOriginal.value = 100;
console.log(objCopy.value);  // 1 (não afetado!)
```

### Merge de Maps

```javascript
const map1 = new Map([
    ['a', 1],
    ['b', 2]
]);

const map2 = new Map([
    ['c', 3],
    ['d', 4]
]);

// Merge via spread
const merged = new Map([...map1, ...map2]);
console.log(merged.size);  // 4

// Merge com sobrescrita
const map3 = new Map([['a', 10], ['e', 5]]);

const merged2 = new Map([...map1, ...map3]);
console.log(merged2.get('a'));  // 10 (sobrescrito por map3)
console.log(merged2.size);  // 3 (a, b, e)

// Merge manual
function mergeMaps(...maps) {
    const result = new Map();
    
    for (let map of maps) {
        for (let [key, value] of map) {
            result.set(key, value);
        }
    }
    
    return result;
}

const merged3 = mergeMaps(map1, map2, map3);
console.log(merged3.size);  // 5
```

### Filter, Map, Reduce em Maps

**Filter:**

```javascript
function filterMap(map, predicate) {
    const filtered = new Map();
    
    for (let [key, value] of map) {
        if (predicate(value, key, map)) {
            filtered.set(key, value);
        }
    }
    
    return filtered;
}

const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3],
    ['d', 4]
]);

const evens = filterMap(map, (value) => value % 2 === 0);
console.log([...evens]);  // [["b", 2], ["d", 4]]
```

**Map (transform):**

```javascript
function mapMap(map, transformer) {
    const transformed = new Map();
    
    for (let [key, value] of map) {
        transformed.set(key, transformer(value, key, map));
    }
    
    return transformed;
}

const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

const doubled = mapMap(map, (value) => value * 2);
console.log([...doubled]);  // [["a", 2], ["b", 4], ["c", 6]]
```

**Reduce:**

```javascript
function reduceMap(map, reducer, initialValue) {
    let accumulator = initialValue;
    
    for (let [key, value] of map) {
        accumulator = reducer(accumulator, value, key, map);
    }
    
    return accumulator;
}

const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

const sum = reduceMap(map, (acc, value) => acc + value, 0);
console.log(sum);  // 6
```

### Use Cases Práticos

**Frequency Counter:**

```javascript
function countFrequency(arr) {
    const freq = new Map();
    
    for (let item of arr) {
        freq.set(item, (freq.get(item) || 0) + 1);
    }
    
    return freq;
}

const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const frequency = countFrequency(numbers);

console.log([...frequency]);
// [[1, 1], [2, 2], [3, 3], [4, 4]]

// Encontrar mais frequente
let maxCount = 0;
let mostFrequent;

for (let [num, count] of frequency) {
    if (count > maxCount) {
        maxCount = count;
        mostFrequent = num;
    }
}

console.log(mostFrequent);  // 4 (aparece 4 vezes)
```

**Memoization:**

```javascript
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        // Usar JSON como chave (ou args[0] se único primitivo)
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log('Retornando do cache');
            return cache.get(key);
        }
        
        console.log('Calculando...');
        const result = fn(...args);
        cache.set(key, result);
        
        return result;
    };
}

const fibonacci = memoize((n) => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10));  // Calcula
console.log(fibonacci(10));  // Cache
console.log(fibonacci(5));   // Usa cache parcial
```

**Graph Adjacency List:**

```javascript
class Graph {
    constructor() {
        this.adjacencyList = new Map();
    }
    
    addVertex(vertex) {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    
    addEdge(vertex1, vertex2) {
        this.adjacencyList.get(vertex1).push(vertex2);
        this.adjacencyList.get(vertex2).push(vertex1);  // Undirected
    }
    
    getNeighbors(vertex) {
        return this.adjacencyList.get(vertex) || [];
    }
}

const graph = new Graph();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');

console.log(graph.getNeighbors('A'));  // ['B', 'C']
```

**Metadata Storage:**

```javascript
const elementMetadata = new Map();

function trackElement(element, metadata) {
    elementMetadata.set(element, {
        ...metadata,
        createdAt: Date.now()
    });
}

function getElementMetadata(element) {
    return elementMetadata.get(element);
}

// Uso
const div = document.createElement('div');
trackElement(div, { type: 'container', id: 'main' });

const metadata = getElementMetadata(div);
console.log(metadata);
// { type: 'container', id: 'main', createdAt: 1699891200000 }

// Sem modificar o DOM element!
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Map

**Use quando:**

1. **Chaves não-string:** Objetos, funções, arrays como chaves
2. **Adição/remoção frequente:** Performance otimizada
3. **Ordem importa:** Necessita preservar ordem de inserção
4. **Size tracking:** Necessita `.size` eficiente
5. **Iteração:** Necessita iterar sobre entries

**Exemplos:**

```javascript
// 1. Chaves não-string
const userRoles = new Map();
userRoles.set(userObject, 'admin');

// 2. Add/remove frequente
const cache = new Map();
cache.set(key, value);
cache.delete(oldKey);

// 3. Ordem importa
const orderedQueue = new Map();

// 4. Size tracking
console.log(map.size);  // O(1)

// 5. Iteração
for (let [key, value] of map) { }
```

### Quando Usar Object

**Use quando:**

1. **JSON serialization:** Necessita `JSON.stringify()`
2. **Chaves fixas:** Schema conhecido e fixo
3. **Property access:** Sintaxe `.property` desejada
4. **Simple data:** Estrutura simples de dados
5. **Compatibility:** Código legado espera Object

```javascript
// 1. JSON
const config = { api: 'url', timeout: 5000 };
JSON.stringify(config);  // Funciona

// 2. Chaves fixas
const user = { id: 1, name: 'João', email: '...' };

// 3. Property access
user.name;  // Mais limpo que map.get('name')

// 4. Simple data
const settings = { theme: 'dark', lang: 'pt' };

// 5. Compatibility
function legacy(obj) {
    return obj.property;  // Espera Object
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Serialização JSON

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2]
]);

// ❌ JSON.stringify remove dados
console.log(JSON.stringify(map));  // {}

// ✅ Converter para array primeiro
const serializable = [...map];
console.log(JSON.stringify(serializable));  // [["a",1],["b",2]]

// Deserializar
const parsed = JSON.parse('[["a",1],["b",2]]');
const restoredMap = new Map(parsed);
```

### Memory Leaks com Object Keys

```javascript
// Map mantém REFERÊNCIAS FORTES
const map = new Map();
let obj = { data: 'large data' };

map.set(obj, 'metadata');

// Mesmo removendo referência externa, obj NÃO é garbage collected
obj = null;

// obj ainda existe no Map!
console.log(map.size);  // 1

// ✅ Use WeakMap para permitir GC (próximo arquivo)
```

### Performance: Map vs Object

```javascript
// Map é MAIS RÁPIDO para:
// - Adição/remoção frequente
// - Size tracking
// - Iteração

// Object é MAIS RÁPIDO para:
// - Property access simples (em alguns engines)
// - JSON serialization
// - Small, fixed-schema data

// Benchmark conceptual (varia por engine):
// Map.set(): ~0.5-1µs
// Object property: ~0.1-0.5µs
// Map.get(): ~0.5-1µs
// Object access: ~0.1-0.5µs
```

### Chave Comparison Gotchas

```javascript
// Objetos comparados por REFERÊNCIA
const key1 = { id: 1 };
const key2 = { id: 1 };

map.set(key1, 'value1');
console.log(map.get(key2));  // undefined (referência diferente!)

// ⚠️ Cuidado com arrays como chaves
map.set([1, 2], 'value');
console.log(map.get([1, 2]));  // undefined (novo array!)

// ✅ Guardar referência
const arrayKey = [1, 2];
map.set(arrayKey, 'value');
console.log(map.get(arrayKey));  // "value"
```

---

## 🔗 Interconexões Conceituais

### Relação com Set (Próximo)

```javascript
// Map: pares chave-valor
const map = new Map([['a', 1]]);

// Set: apenas valores únicos
const set = new Set([1, 2, 3]);
```

### Relação com WeakMap (Próximo)

```javascript
// Map: referências fortes
const map = new Map();

// WeakMap: referências fracas (garbage-collectable)
const weakMap = new WeakMap();
```

### Relação com Object

```javascript
// Object: chaves string/symbol
const obj = { key: 'value' };

// Map: chaves de qualquer tipo
const map = new Map([[obj, 'value']]);
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **Map** (você está aqui)
2. **Set** (próximo - valores únicos)
3. **WeakMap/WeakSet** (referências fracas)

### Preparação para Set

Set armazena **valores únicos** (sem duplicatas):

```javascript
// Set básico
const set = new Set([1, 2, 3, 2, 1]);
console.log(set.size);  // 3 (duplicatas removidas)

// Operações de conjunto
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// Union: new Set([...a, ...b])
// Intersection: new Set([...a].filter(x => b.has(x)))
// Difference: new Set([...a].filter(x => !b.has(x)))
```

Próximo: **Set Basics** detalhado.

---

## 📚 Conclusão

**Map** é estrutura de dados moderna para pares chave-valor com **qualquer tipo de chave**, **ordem preservada** e **performance otimizada**.

**Conceitos essenciais:**
- **Chaves flexíveis:** Qualquer tipo JavaScript (objetos, funções, primitivos)
- **Ordem preservada:** Sempre mantém ordem de inserção
- **`.set(key, value)`:** Adicionar/atualizar (retorna Map para chaining)
- **`.get(key)`:** Obter valor por chave (undefined se não existe)
- **`.has(key)`:** Verificar existência (boolean)
- **`.delete(key)`:** Remover entry (retorna boolean)
- **`.clear()`:** Remover todos entries
- **`.size`:** Quantidade de entries (property, não método)
- **Iterável:** `for...of`, `.keys()`, `.values()`, `.entries()`, `.forEach()`
- **SameValueZero:** NaN === NaN, +0 === -0 em Map
- **Object keys:** Comparados por referência, não valor
- **Performance:** O(1) para set/get/has/delete (amortizado)
- **Memory:** Referências fortes (vs WeakMap)
- **JSON:** Não serializável diretamente
- **Conversões:** Array ↔ Map, Object ↔ Map (via entries)

Dominar Map é essencial para **caching**, **data structures**, **metadata storage** e **performance-critical code** em JavaScript moderno!
