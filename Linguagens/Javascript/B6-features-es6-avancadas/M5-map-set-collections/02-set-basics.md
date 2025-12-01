# Set: Coleções de Valores Únicos

## 🎯 Introdução e Definição

### Definição Conceitual

**Set** é uma **estrutura de dados** introduzida no ES6 que armazena **valores únicos** de qualquer tipo, automaticamente **removendo duplicatas**, mantendo **ordem de inserção** e fornecendo **operações otimizadas** para membership testing.

**Sintaxe:**

```javascript
// Criar Set
const set = new Set();

// Adicionar valores
set.add(1);
set.add(2);
set.add(3);
set.add(2);  // Duplicata ignorada!

console.log(set.size);  // 3 (não 4!)

// Verificar existência
console.log(set.has(2));  // true
console.log(set.has(10));  // false

// Remover
set.delete(2);
console.log(set.size);  // 2

// Iterar
for (let value of set) {
    console.log(value);  // 1, 3
}

// Limpar
set.clear();
console.log(set.size);  // 0
```

**Características fundamentais:**

- **Valores únicos:** Duplicatas automaticamente removidas
- **Qualquer tipo:** Primitivos, objetos, funções
- **Ordem preservada:** Mantém ordem de inserção
- **Size property:** `.size` retorna quantidade de valores
- **Métodos dedicados:** `.add()`, `.has()`, `.delete()`, `.clear()`
- **Iterável:** Funciona com `for...of`, spread, destructuring

### Set vs Array: Diferenças Fundamentais

**Array (tradicional):**

```javascript
// Array permite duplicatas
const arr = [1, 2, 2, 3, 3, 3];
console.log(arr.length);  // 6

// Verificar existência: O(n)
console.log(arr.includes(2));  // true (busca linear)

// Remover duplicatas: manual
const unique = [...new Set(arr)];
console.log(unique);  // [1, 2, 3]

// Índice por posição
console.log(arr[0]);  // 1
```

**Set (moderno):**

```javascript
// Set remove duplicatas automaticamente
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log(set.size);  // 3

// Verificar existência: O(1) média
console.log(set.has(2));  // true (hash lookup)

// Já é único
const arr = [...set];
console.log(arr);  // [1, 2, 3]

// Sem índice (não é sequência indexada)
// set[0] ❌ undefined
```

**Tabela comparativa conceitual:**

| Característica | Array | Set |
|----------------|-------|-----|
| **Duplicatas** | Permite | Remove automaticamente |
| **Ordem** | Mantém por índice | Mantém ordem de inserção |
| **Acesso** | Por índice (`arr[i]`) | Apenas iteração |
| **Membership** | `.includes()` O(n) | `.has()` O(1) média |
| **Adicionar** | `.push()` O(1) amortizado | `.add()` O(1) amortizado |
| **Remover** | `.splice()` O(n) | `.delete()` O(1) média |
| **Size** | `.length` | `.size` |
| **Use case** | Sequências ordenadas | Valores únicos |

### Contexto Histórico e Motivação

**Problema pré-ES6:** Remover duplicatas manualmente

```javascript
// ES5 - remover duplicatas de array (ineficiente)
const numbers = [1, 2, 2, 3, 3, 3, 4];
const unique = [];

for (let i = 0; i < numbers.length; i++) {
    if (unique.indexOf(numbers[i]) === -1) {
        unique.push(numbers[i]);
    }
}

console.log(unique);  // [1, 2, 3, 4]

// ❌ Complexidade O(n²)!
// ❌ Verboso e propensa a erros
```

**Tentativas de solução:**

1. **Object keys:** Usar objeto como "set"

```javascript
const numbers = [1, 2, 2, 3, 3, 3];
const obj = {};

numbers.forEach(n => obj[n] = true);
const unique = Object.keys(obj).map(Number);

console.log(unique);  // [1, 2, 3]

// ❌ Apenas strings como chaves
// ❌ Conversão desnecessária
```

2. **Filter + indexOf:**

```javascript
const numbers = [1, 2, 2, 3, 3, 3];
const unique = numbers.filter((value, index, self) => 
    self.indexOf(value) === index
);

console.log(unique);  // [1, 2, 3]

// ❌ Ainda O(n²)
```

**ES6 (2015):** Set introduzido

```javascript
// ✅ Set resolve elegantemente
const numbers = [1, 2, 2, 3, 3, 3];
const unique = new Set(numbers);

console.log([...unique]);  // [1, 2, 3]

// ✅ O(n) para criar Set
// ✅ O(1) para membership testing
// ✅ Sintaxe concisa
```

**Motivações principais:**

1. **Uniqueness:** Garantir valores únicos automaticamente
2. **Performance:** Membership testing O(1) vs O(n)
3. **Set operations:** Union, intersection, difference
4. **Standard library:** Evitar reimplementações
5. **Memory efficiency:** Hash table interna otimizada

### Problema Fundamental que Resolve

**Problema:** Como **armazenar valores únicos** eficientemente com **membership testing rápido** e **operações de conjunto**?

**Cenário real - tracking de IDs únicos:**

```javascript
// Problema: rastrear IDs únicos de usuários ativos
const activeUserIds = [];

function addActiveUser(userId) {
    if (!activeUserIds.includes(userId)) {
        activeUserIds.push(userId);
    }
}

// ❌ O(n) para verificar se já existe
// ❌ O(n) para adicionar se único
// ❌ Complexidade total: O(n) por operação

// Com 10.000 usuários ativos:
// - 10.000 verificações = ~5.000.000 comparações (média)

// ✅ Set resolve com O(1) por operação
const activeUserIds = new Set();

function addActiveUser(userId) {
    activeUserIds.add(userId);  // O(1) - adiciona apenas se único
}

// Sempre O(1), independente do tamanho!
console.log(activeUserIds.has(123));  // O(1)
activeUserIds.delete(123);  // O(1)
```

### Importância no Ecossistema

Set é **essencial** para:

- **Deduplication:** Remover duplicatas de arrays
- **Membership testing:** Verificar existência rápida
- **Set operations:** Union, intersection, difference
- **Unique constraints:** Garantir valores únicos
- **Graph algorithms:** Visited nodes tracking
- **Data validation:** Verificar valores permitidos

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Uniqueness:** Valores únicos garantidos automaticamente
2. **Value equality:** SameValueZero algorithm (NaN === NaN)
3. **Ordem preservada:** Mantém ordem de inserção
4. **Hash-based:** Implementação interna via hash table
5. **Iterável:** Implementa iteration protocol

### Pilares Fundamentais

- **`.add(value)`:** Adicionar valor (ignora se duplicata)
- **`.has(value)`:** Verificar existência (O(1) média)
- **`.delete(value)`:** Remover valor (O(1) média)
- **`.clear()`:** Remover todos valores
- **`.size`:** Quantidade de valores únicos

### Visão Geral das Nuances

- **Object comparison:** Por referência, não valor
- **NaN handling:** NaN considerado igual a si mesmo
- **+0 vs -0:** Tratados como iguais
- **Primitive types:** Comparados por valor
- **No indexing:** Sem acesso por índice (não é array)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Hash Table Implementation

Set é tipicamente implementado como **hash table** otimizada:

```
Conceito:
1. Hash function transforma valor em índice
2. Valor armazenado na posição do índice
3. Collision handling (encadeamento)
4. Dynamic resizing quando necessário

Performance esperada:
- add(): O(1) amortizado
- has(): O(1) média
- delete(): O(1) média
- Iteração: O(n)
- size: O(1)
```

#### Value Equality (SameValueZero)

Set usa **SameValueZero** algorithm para comparar valores:

```javascript
const set = new Set();

// NaN === NaN em Set (diferente de ===)
set.add(NaN);
set.add(NaN);
console.log(set.size);  // 1 (NaN duplicado removido!)

// Mas NaN !== NaN em JavaScript normal
console.log(NaN === NaN);  // false

// +0 e -0 considerados iguais
set.add(+0);
set.add(-0);
console.log(set.size);  // 2 (+0 e NaN, -0 sobrescreveu +0)

// Primitivos comparados por VALOR
set.add(42);
set.add(42);
console.log(set.size);  // 3 (42 duplicado removido)

// Objetos comparados por REFERÊNCIA
const obj1 = { id: 1 };
const obj2 = { id: 1 };

set.add(obj1);
set.add(obj2);
console.log(set.size);  // 5 (obj1 e obj2 são DIFERENTES!)

console.log(obj1 === obj2);  // false (referências diferentes)
```

### Princípios Conceituais

#### Automatic Deduplication

Set **automaticamente** remove duplicatas:

```javascript
// Array com duplicatas
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];

// Set remove duplicatas na criação
const unique = new Set(numbers);

console.log(unique.size);  // 4 (1, 2, 3, 4)
console.log([...unique]);  // [1, 2, 3, 4]

// Adicionar duplicata não muda size
unique.add(2);
console.log(unique.size);  // 4 (ainda!)

// .add() retorna Set (permite chaining)
unique.add(5).add(6).add(7);
console.log(unique.size);  // 7
```

#### Insertion Order

Set **sempre** mantém ordem de inserção (como Map):

```javascript
const set = new Set();

// Inserir em ordem específica
set.add('c');
set.add('a');
set.add('b');

// Iteração mantém ordem
for (let value of set) {
    console.log(value);
    // "c" (primeiro inserido)
    // "a" (segundo)
    // "b" (terceiro)
}

// Readicionar não muda ordem
set.add('a');  // Já existe, ordem não muda

for (let value of set) {
    console.log(value);  // c, a, b (ordem original)
}
```

---

## 🔍 Análise Conceitual Profunda

### Criação e Inicialização

**Criação vazia:**

```javascript
const set = new Set();
console.log(set.size);  // 0
```

**Inicialização com iterable:**

```javascript
// Array
const set1 = new Set([1, 2, 3, 2, 1]);
console.log(set1.size);  // 3 (duplicatas removidas)

// String (iterável de caracteres)
const set2 = new Set('hello');
console.log([...set2]);  // ['h', 'e', 'l', 'o'] (um 'l')

// Outro Set
const set3 = new Set(set1);
console.log(set3.size);  // 3 (cópia)

// Qualquer iterable
const set4 = new Set([1, 2, 3].values());
console.log(set4.size);  // 3
```

**Inicialização com generator:**

```javascript
function* uniqueNumbers() {
    yield 1;
    yield 2;
    yield 3;
    yield 2;  // Duplicata
}

const set = new Set(uniqueNumbers());
console.log(set.size);  // 3 (duplicata removida)
```

### Operações Básicas

**`.add(value)` - Adicionar Valor:**

```javascript
const set = new Set();

// Adicionar
set.add(1);
set.add(2);
set.add(3);
console.log(set.size);  // 3

// Adicionar duplicata (ignorado)
set.add(2);
console.log(set.size);  // 3 (ainda)

// Chaining
set.add(4).add(5).add(6);
console.log(set.size);  // 6

// .add() retorna Set
const returned = set.add(7);
console.log(returned === set);  // true (mesmo Set)
```

**`.has(value)` - Verificar Existência:**

```javascript
const set = new Set([1, 2, 3]);

console.log(set.has(2));  // true
console.log(set.has(10));  // false

// Performance: O(1) média
// Muito mais rápido que array.includes() que é O(n)
```

**`.delete(value)` - Remover Valor:**

```javascript
const set = new Set([1, 2, 3, 4]);

// Deletar existente
const deleted = set.delete(2);
console.log(deleted);  // true (deletado)
console.log(set.size);  // 3

// Deletar inexistente
const notDeleted = set.delete(10);
console.log(notDeleted);  // false (não existia)
```

**`.clear()` - Remover Todos:**

```javascript
const set = new Set([1, 2, 3, 4, 5]);
console.log(set.size);  // 5

set.clear();
console.log(set.size);  // 0
console.log(set.has(1));  // false
```

**`.size` Property:**

```javascript
const set = new Set();
console.log(set.size);  // 0

set.add(1).add(2).add(3);
console.log(set.size);  // 3

set.add(2);  // Duplicata
console.log(set.size);  // 3 (não mudou)

set.delete(1);
console.log(set.size);  // 2

// .size é property (não método!)
// set.size() ❌ TypeError
```

### Iteração

**`for...of` com valores:**

```javascript
const set = new Set(['a', 'b', 'c']);

// Itera sobre valores
for (let value of set) {
    console.log(value);
    // "a"
    // "b"
    // "c"
}
```

**`.keys()` - Iterar Valores (alias de `.values()`):**

```javascript
const set = new Set([1, 2, 3]);

// .keys() retorna VALORES (não "chaves")
// Existe apenas para API consistency com Map
for (let value of set.keys()) {
    console.log(value);
    // 1
    // 2
    // 3
}

console.log(set.keys === set.values);  // false (funções diferentes)
// Mas retornam mesmo iterator
```

**`.values()` - Iterar Valores:**

```javascript
const set = new Set([1, 2, 3]);

for (let value of set.values()) {
    console.log(value);
    // 1
    // 2
    // 3
}

// Converter para array
const arr = [...set.values()];
console.log(arr);  // [1, 2, 3]
```

**`.entries()` - Iterar [value, value] Pairs:**

```javascript
const set = new Set(['a', 'b', 'c']);

// .entries() retorna [value, value] (não [key, value]!)
// Existe apenas para API consistency com Map
for (let entry of set.entries()) {
    console.log(entry);
    // ["a", "a"]
    // ["b", "b"]
    // ["c", "c"]
}

// Destructuring
for (let [value1, value2] of set.entries()) {
    console.log(value1, value2);  // value1 === value2 sempre!
}
```

**`.forEach()` - Callback Iterator:**

```javascript
const set = new Set([1, 2, 3]);

// forEach(callback(value, valueAgain, set))
set.forEach((value, valueAgain, setRef) => {
    console.log(value, valueAgain);
    console.log(setRef === set);  // true
});

// 1 1
// true
// 2 2
// true
// 3 3
// true

// Nota: callback recebe value duas vezes!
// (Para consistência com Map.forEach(value, key, map))
```

### Valores de Qualquer Tipo

**Primitivos:**

```javascript
const set = new Set();

set.add(1);        // Number
set.add('hello');  // String
set.add(true);     // Boolean
set.add(null);     // Null
set.add(undefined); // Undefined
set.add(Symbol('s')); // Symbol

console.log(set.size);  // 6

// Cada primitivo único
set.add(1);  // Duplicata ignorada
console.log(set.size);  // 6 (ainda)
```

**Objetos:**

```javascript
const set = new Set();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

set.add(obj1);
set.add(obj2);
console.log(set.size);  // 2

// Objetos com mesmos VALORES são diferentes
const obj3 = { id: 1 };  // Mesmo conteúdo que obj1
set.add(obj3);
console.log(set.size);  // 3 (obj3 é referência diferente!)

console.log(obj1 === obj3);  // false

// Adicionar mesma REFERÊNCIA é duplicata
set.add(obj1);
console.log(set.size);  // 3 (obj1 já existia)
```

**Arrays:**

```javascript
const set = new Set();

const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];

set.add(arr1);
set.add(arr2);
console.log(set.size);  // 2 (arrays diferentes!)

// Arrays comparados por REFERÊNCIA
console.log(arr1 === arr2);  // false

set.add([1, 2, 3]);  // Novo array
console.log(set.size);  // 3
```

**Funções:**

```javascript
const set = new Set();

function fn1() { console.log('fn1'); }
function fn2() { console.log('fn2'); }

set.add(fn1);
set.add(fn2);
console.log(set.size);  // 2

// Mesmo nome, mas referências diferentes
function duplicate() {}
const duplicate2 = function duplicate() {};

set.add(duplicate);
set.add(duplicate2);
console.log(set.size);  // 4 (funções diferentes!)
```

### Conversões

**Set para Array:**

```javascript
const set = new Set([1, 2, 3]);

// Spread operator
const arr1 = [...set];
console.log(arr1);  // [1, 2, 3]

// Array.from()
const arr2 = Array.from(set);
console.log(arr2);  // [1, 2, 3]

// Iteration manual
const arr3 = [];
for (let value of set) {
    arr3.push(value);
}
console.log(arr3);  // [1, 2, 3]
```

**Array para Set (remove duplicatas):**

```javascript
const arr = [1, 2, 2, 3, 3, 3, 4];

const set = new Set(arr);
console.log([...set]);  // [1, 2, 3, 4]

// One-liner para remover duplicatas
const unique = [...new Set(arr)];
console.log(unique);  // [1, 2, 3, 4]
```

**String para Set (caracteres únicos):**

```javascript
const str = 'hello world';

const chars = new Set(str);
console.log([...chars]);
// ['h', 'e', 'l', 'o', ' ', 'w', 'r', 'd']

// Contar caracteres únicos
console.log(chars.size);  // 8
```

### Operações de Conjunto (Set Theory)

**Union (União) - A ∪ B:**

```javascript
// União: todos elementos de A e B
function union(setA, setB) {
    return new Set([...setA, ...setB]);
}

const a = new Set([1, 2, 3]);
const b = new Set([3, 4, 5]);

const unionSet = union(a, b);
console.log([...unionSet]);  // [1, 2, 3, 4, 5]

// Alternativa: loop
function unionLoop(setA, setB) {
    const result = new Set(setA);  // Copiar setA
    
    for (let value of setB) {
        result.add(value);
    }
    
    return result;
}
```

**Intersection (Interseção) - A ∩ B:**

```javascript
// Interseção: elementos presentes em A E B
function intersection(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
}

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const intersectionSet = intersection(a, b);
console.log([...intersectionSet]);  // [2, 3]

// Alternativa: loop
function intersectionLoop(setA, setB) {
    const result = new Set();
    
    for (let value of setA) {
        if (setB.has(value)) {
            result.add(value);
        }
    }
    
    return result;
}
```

**Difference (Diferença) - A \ B:**

```javascript
// Diferença: elementos em A mas NÃO em B
function difference(setA, setB) {
    return new Set([...setA].filter(x => !setB.has(x)));
}

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const diffSet = difference(a, b);
console.log([...diffSet]);  // [1]

// A \ B ≠ B \ A
const diffSet2 = difference(b, a);
console.log([...diffSet2]);  // [4]
```

**Symmetric Difference (Diferença Simétrica) - A Δ B:**

```javascript
// Diferença simétrica: elementos em A OU B, mas NÃO em ambos
function symmetricDifference(setA, setB) {
    const diff1 = difference(setA, setB);
    const diff2 = difference(setB, setA);
    
    return union(diff1, diff2);
}

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

const symDiff = symmetricDifference(a, b);
console.log([...symDiff]);  // [1, 4]

// Alternativa: filter duplo
function symmetricDifferenceAlt(setA, setB) {
    return new Set([
        ...[...setA].filter(x => !setB.has(x)),
        ...[...setB].filter(x => !setA.has(x))
    ]);
}
```

**Subset (Subconjunto) - A ⊆ B:**

```javascript
// Subset: todos elementos de A estão em B?
function isSubset(setA, setB) {
    for (let value of setA) {
        if (!setB.has(value)) {
            return false;
        }
    }
    return true;
}

const a = new Set([1, 2]);
const b = new Set([1, 2, 3, 4]);

console.log(isSubset(a, b));  // true (a ⊆ b)
console.log(isSubset(b, a));  // false (b não é subset de a)

// Usando Array.every()
function isSubsetAlt(setA, setB) {
    return [...setA].every(value => setB.has(value));
}
```

**Superset (Superconjunto) - A ⊇ B:**

```javascript
// Superset: B é subset de A?
function isSuperset(setA, setB) {
    return isSubset(setB, setA);
}

const a = new Set([1, 2, 3, 4]);
const b = new Set([1, 2]);

console.log(isSuperset(a, b));  // true (a ⊇ b)
console.log(isSuperset(b, a));  // false
```

### Clonagem

**Shallow copy:**

```javascript
const original = new Set([
    { id: 1 },
    { id: 2 }
]);

// Copiar via constructor
const copy1 = new Set(original);

// Copiar via spread
const copy2 = new Set([...original]);

console.log(copy1.size);  // 2
console.log(copy1 === original);  // false (Sets diferentes)

// MAS valores são shallow copy (mesma referência!)
const obj1 = [...original][0];
const obj2 = [...copy1][0];

console.log(obj1 === obj2);  // true (mesmo objeto!)

obj1.id = 100;
console.log([...copy1][0].id);  // 100 (afeta cópia!)
```

### Filter, Map, Reduce em Sets

**Filter:**

```javascript
function filterSet(set, predicate) {
    return new Set([...set].filter(predicate));
}

const numbers = new Set([1, 2, 3, 4, 5, 6]);

const evens = filterSet(numbers, n => n % 2 === 0);
console.log([...evens]);  // [2, 4, 6]
```

**Map (transform):**

```javascript
function mapSet(set, transformer) {
    return new Set([...set].map(transformer));
}

const numbers = new Set([1, 2, 3]);

const doubled = mapSet(numbers, n => n * 2);
console.log([...doubled]);  // [2, 4, 6]

// ⚠️ Cuidado: map pode gerar duplicatas que serão removidas!
const set = new Set([1, 2, 3]);
const halved = mapSet(set, n => Math.floor(n / 2));
console.log([...halved]);  // [0, 1] (1/2=0.5→0, 2/2=1, 3/2=1.5→1)
```

**Reduce:**

```javascript
function reduceSet(set, reducer, initialValue) {
    return [...set].reduce(reducer, initialValue);
}

const numbers = new Set([1, 2, 3, 4]);

const sum = reduceSet(numbers, (acc, n) => acc + n, 0);
console.log(sum);  // 10
```

### Use Cases Práticos

**Remover Duplicatas de Array:**

```javascript
// Simples e eficiente
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const unique = [...new Set(numbers)];

console.log(unique);  // [1, 2, 3, 4]

// Funciona com qualquer tipo
const words = ['apple', 'banana', 'apple', 'cherry', 'banana'];
const uniqueWords = [...new Set(words)];
console.log(uniqueWords);  // ['apple', 'banana', 'cherry']
```

**Verificar Valores Permitidos:**

```javascript
const validStatuses = new Set(['pending', 'approved', 'rejected']);

function isValidStatus(status) {
    return validStatuses.has(status);
}

console.log(isValidStatus('pending'));   // true
console.log(isValidStatus('cancelled')); // false

// O(1) lookup vs array.includes() que é O(n)
```

**Tracking Visited Nodes (Graph/Tree):**

```javascript
function breadthFirstSearch(graph, start) {
    const visited = new Set();
    const queue = [start];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (visited.has(node)) continue;
        
        visited.add(node);
        console.log('Visited:', node);
        
        const neighbors = graph[node] || [];
        queue.push(...neighbors);
    }
    
    return visited;
}

const graph = {
    A: ['B', 'C'],
    B: ['D', 'E'],
    C: ['F'],
    D: [],
    E: ['F'],
    F: []
};

const visited = breadthFirstSearch(graph, 'A');
console.log([...visited]);  // ['A', 'B', 'C', 'D', 'E', 'F']
```

**Contar Elementos Únicos:**

```javascript
function countUnique(arr) {
    return new Set(arr).size;
}

const numbers = [1, 2, 2, 3, 3, 3];
console.log(countUnique(numbers));  // 3

const words = ['a', 'b', 'a', 'c', 'b'];
console.log(countUnique(words));  // 3
```

**Encontrar Elementos Comuns:**

```javascript
function findCommon(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    
    return [...intersection(set1, set2)];
}

const array1 = [1, 2, 3, 4];
const array2 = [3, 4, 5, 6];

console.log(findCommon(array1, array2));  // [3, 4]
```

**Tags/Categories System:**

```javascript
class Article {
    constructor(title) {
        this.title = title;
        this.tags = new Set();
    }
    
    addTag(tag) {
        this.tags.add(tag.toLowerCase());
        return this;
    }
    
    removeTag(tag) {
        this.tags.delete(tag.toLowerCase());
        return this;
    }
    
    hasTag(tag) {
        return this.tags.has(tag.toLowerCase());
    }
    
    getTags() {
        return [...this.tags];
    }
}

const article = new Article('JavaScript Sets');
article
    .addTag('JavaScript')
    .addTag('ES6')
    .addTag('Data Structures')
    .addTag('javascript');  // Duplicata (lowercase)

console.log(article.getTags());
// ['javascript', 'es6', 'data structures']
console.log(article.hasTag('ES6'));  // true
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Set

**Use quando:**

1. **Valores únicos:** Necessita garantir unicidade
2. **Membership testing:** Verificações frequentes de existência
3. **Remove duplicatas:** Limpar arrays
4. **Set operations:** Union, intersection, difference
5. **Performance:** O(1) lookup vs O(n) em arrays

**Exemplos:**

```javascript
// 1. Valores únicos
const uniqueIds = new Set();
uniqueIds.add(userId);

// 2. Membership
if (allowedRoles.has(userRole)) { }

// 3. Remove duplicatas
const unique = [...new Set(array)];

// 4. Set operations
const common = intersection(setA, setB);

// 5. Performance
set.has(value);  // O(1) vs array.includes(value) O(n)
```

### Quando Usar Array

**Use quando:**

1. **Ordem por índice:** Necessita `arr[i]`
2. **Duplicatas permitidas:** Valores podem repetir
3. **Array methods:** map, filter, reduce nativos
4. **Serialização:** JSON.stringify() direto
5. **Indexed access:** Acesso posicional

```javascript
// 1. Índice
const first = arr[0];

// 2. Duplicatas
const scores = [10, 10, 20, 20];

// 3. Array methods
arr.map(x => x * 2);

// 4. JSON
JSON.stringify(arr);

// 5. Indexed
arr.slice(1, 3);
```

---

## ⚠️ Limitações e Considerações Teóricas

### Sem Acesso por Índice

```javascript
const set = new Set([1, 2, 3]);

// ❌ Não há acesso por índice
console.log(set[0]);  // undefined (não funciona!)

// ✅ Converter para array primeiro
const arr = [...set];
console.log(arr[0]);  // 1
```

### Object Comparison por Referência

```javascript
const set = new Set();

const obj1 = { id: 1 };
const obj2 = { id: 1 };

set.add(obj1);
set.add(obj2);

console.log(set.size);  // 2 (objetos diferentes!)

// ⚠️ Mesmo conteúdo, mas referências diferentes
console.log(obj1 === obj2);  // false
```

### JSON Serialization

```javascript
const set = new Set([1, 2, 3]);

// ❌ JSON.stringify não funciona diretamente
console.log(JSON.stringify(set));  // {}

// ✅ Converter para array primeiro
const arr = [...set];
console.log(JSON.stringify(arr));  // [1,2,3]

// Custom toJSON
Set.prototype.toJSON = function() {
    return [...this];
};

console.log(JSON.stringify(set));  // [1,2,3]
```

### Performance: Set vs Array

```javascript
// Set é MAIS RÁPIDO para:
// - Membership testing (.has() vs .includes())
// - Garantir unicidade
// - Add/delete frequente

// Array é MAIS RÁPIDO para:
// - Acesso por índice
// - Iteração sequencial simples (em alguns casos)
// - Operações que precisam de ordem específica

// Benchmark conceptual (varia por engine):
// Set.has(): ~0.5-1µs (O(1))
// Array.includes(): ~50-500µs para 1000 items (O(n))
```

---

## 🔗 Interconexões Conceituais

### Relação com Map

```javascript
// Map: pares chave-valor
const map = new Map([['a', 1]]);

// Set: apenas valores
const set = new Set([1, 2, 3]);

// Set é como Map onde chave === valor
```

### Relação com Array

```javascript
// Array: permite duplicatas, acesso por índice
const arr = [1, 2, 2, 3];

// Set: sem duplicatas, sem índice
const set = new Set([1, 2, 2, 3]);  // size: 3
```

### Relação com WeakSet (Próximo)

```javascript
// Set: referências fortes
const set = new Set();

// WeakSet: referências fracas (garbage-collectable)
const weakSet = new WeakSet();
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Map Basics
2. **Set Basics** (você está aqui)
3. **WeakMap/WeakSet** (próximo - referências fracas)

### Preparação para WeakMap/WeakSet

WeakMap e WeakSet usam **weak references** (referências fracas):

```javascript
// Set: strong reference (impede GC)
const set = new Set();
let obj = { data: 'large' };
set.add(obj);

obj = null;  // obj ainda referenciado por Set (não é GC)

// WeakSet: weak reference (permite GC)
const weakSet = new WeakSet();
let obj2 = { data: 'large' };
weakSet.add(obj2);

obj2 = null;  // obj2 pode ser garbage collected!

// WeakSet não impede GC
// Útil para metadata sem memory leaks
```

Próximo: **WeakMap e WeakSet** detalhado.

---

## 📚 Conclusão

**Set** é estrutura de dados para **valores únicos** com **membership testing O(1)** e **operações de conjunto eficientes**.

**Conceitos essenciais:**
- **Valores únicos:** Duplicatas automaticamente removidas
- **`.add(value)`:** Adicionar (ignora duplicatas, retorna Set)
- **`.has(value)`:** Verificar existência (O(1) média)
- **`.delete(value)`:** Remover (O(1) média, retorna boolean)
- **`.clear()`:** Remover todos valores
- **`.size`:** Quantidade de valores únicos (property)
- **Iterável:** `for...of`, `.keys()`, `.values()`, `.entries()`, `.forEach()`
- **SameValueZero:** NaN === NaN, +0 === -0 em Set
- **Object comparison:** Por referência, não valor
- **Ordem preservada:** Sempre mantém ordem de inserção
- **Performance:** O(1) para add/has/delete (vs O(n) em arrays)
- **Set operations:** Union, intersection, difference, subset
- **Conversões:** Array ↔ Set (remove duplicatas)
- **No indexing:** Sem acesso por índice (não é array)

Dominar Set é essencial para **deduplication**, **membership testing**, **set theory operations** e **performance-critical code** em JavaScript moderno!
