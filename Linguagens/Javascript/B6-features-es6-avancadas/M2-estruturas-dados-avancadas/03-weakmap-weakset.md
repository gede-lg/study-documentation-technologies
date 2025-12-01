# WeakMap e WeakSet: Referências Fracas e Garbage Collection

## 🎯 Introdução e Definição

### Definição Conceitual

**WeakMap** é uma **coleção de pares chave-valor** onde **apenas objetos podem ser chaves**, as referências são **weak (fracas)**, e as entradas são **automaticamente removidas** quando as chaves não são mais referenciadas, permitindo **garbage collection** e prevenindo **memory leaks**.

**WeakSet** é uma **coleção de objetos únicos** onde as referências são **weak (fracas)**, os objetos são **automaticamente removidos** quando não há mais referências, e **não possui iteração** ou método `.size`.

**Sintaxe WeakMap:**

```javascript
// Criar WeakMap
const wm = new WeakMap();

// Apenas objetos como chaves!
const key = { id: 1 };

// Adicionar
wm.set(key, 'some value');

// Buscar
console.log(wm.get(key));  // "some value"

// Verificar
console.log(wm.has(key));  // true

// Deletar
wm.delete(key);
console.log(wm.has(key));  // false

// ❌ NÃO existe .size
// console.log(wm.size);  // undefined

// ❌ NÃO existe .clear()
// wm.clear();  // TypeError

// ❌ NÃO iterável
// for (let entry of wm) {}  // TypeError
```

**Sintaxe WeakSet:**

```javascript
// Criar WeakSet
const ws = new WeakSet();

// Apenas objetos como valores!
const obj = { data: 'test' };

// Adicionar
ws.add(obj);

// Verificar
console.log(ws.has(obj));  // true

// Deletar
ws.delete(obj);
console.log(ws.has(obj));  // false

// ❌ NÃO existe .size
// console.log(ws.size);  // undefined

// ❌ NÃO existe .clear()
// ws.clear();  // TypeError

// ❌ NÃO iterável
// for (let value of ws) {}  // TypeError
```

### Características Fundamentais WeakMap

**WeakMap:**

- **Apenas objetos como chaves:** Primitivos rejeitados (TypeError)
- **Weak references:** Chaves não impedem garbage collection
- **Não enumerável:** Sem iteração, `.keys()`, `.values()`, `.entries()`
- **Sem `.size`:** Impossível saber quantidade de entradas
- **Sem `.clear()`:** Apenas `.delete()` individual
- **Garbage collected:** Entradas removidas quando chave não mais referenciada
- **Privacy:** Metadados privados sem poluir objeto

**WeakSet:**

- **Apenas objetos como valores:** Primitivos rejeitados (TypeError)
- **Weak references:** Valores não impedem garbage collection
- **Não enumerável:** Sem iteração
- **Sem `.size`:** Impossível saber quantidade
- **Sem `.clear()`:** Apenas `.delete()` individual
- **Garbage collected:** Valores removidos quando não mais referenciados

### WeakMap vs Map: Diferenças Fundamentais

**Map (strong references):**

```javascript
const map = new Map();
let key = { id: 1 };

map.set(key, 'value');

// Map mantém referência forte
key = null;  // Chave AINDA na memória (Map a referencia)

console.log(map.size);  // 1 (ainda existe!)

// Objeto NUNCA será garbage collected enquanto em Map
// Pode causar MEMORY LEAK!
```

**WeakMap (weak references):**

```javascript
const wm = new WeakMap();
let key = { id: 1 };

wm.set(key, 'value');

// WeakMap mantém referência fraca
key = null;  // Chave pode ser garbage collected

// ❌ Não podemos verificar .size
// console.log(wm.size);  // undefined

// Objeto eventualmente será GC
// WeakMap entry automaticamente removido
```

**Tabela comparativa conceitual:**

| Característica | Map | WeakMap |
|----------------|-----|---------|
| **Tipos de chave** | Qualquer tipo | Apenas objetos |
| **Referências** | Strong (impede GC) | Weak (permite GC) |
| **`.size`** | ✅ Sim | ❌ Não |
| **Iteração** | ✅ `for...of`, `.keys()`, etc | ❌ Não iterável |
| **`.clear()`** | ✅ Sim | ❌ Não |
| **Garbage collection** | Nunca (requer `.delete()` ou `.clear()`) | Automático |
| **Memory leaks** | Possível se não limpar | Impossível |
| **Use case** | Estruturas de dados genéricas | Metadados privados |

### WeakSet vs Set: Diferenças Fundamentais

**Set (strong references):**

```javascript
const set = new Set();
let obj = { id: 1 };

set.add(obj);

// Set mantém referência forte
obj = null;  // Objeto AINDA na memória

console.log(set.size);  // 1 (ainda existe!)

// Objeto nunca será GC enquanto em Set
```

**WeakSet (weak references):**

```javascript
const ws = new WeakSet();
let obj = { id: 1 };

ws.add(obj);

// WeakSet mantém referência fraca
obj = null;  // Objeto pode ser GC

// ❌ Não podemos verificar .size
// console.log(ws.size);  // undefined

// Objeto eventualmente será GC
```

**Tabela comparativa conceitual:**

| Característica | Set | WeakSet |
|----------------|-----|---------|
| **Tipos de valor** | Qualquer tipo | Apenas objetos |
| **Referências** | Strong | Weak |
| **`.size`** | ✅ Sim | ❌ Não |
| **Iteração** | ✅ `for...of` | ❌ Não iterável |
| **`.clear()`** | ✅ Sim | ❌ Não |
| **GC** | Nunca | Automático |
| **Use case** | Valores únicos | Tracking objetos sem memory leak |

### Contexto Histórico e Motivação

**Problema pré-ES6:** Memory leaks ao associar metadata

```javascript
// ES5 - metadata storage usando object como "map"
const metadata = {};
let element = document.getElementById('myDiv');

// Usar element como chave (convertido para string!)
metadata[element] = { clicks: 0 };

// ❌ Problema: element convertido para "[object HTMLDivElement]"
// ❌ Se element for destruído, metadata permanece
// ❌ MEMORY LEAK!

element = null;  // Elemento não é GC (metadata ainda referencia)
```

**Tentativa de solução:** Limpeza manual

```javascript
// Limpeza manual
function cleanup() {
    delete metadata[element];
}

// ❌ Desenvolvedor precisa lembrar de limpar
// ❌ Propenso a erros
// ❌ Difícil rastrear todos objetos
```

**ES6 (2015):** WeakMap introduzido

```javascript
// ✅ WeakMap resolve automaticamente
const metadata = new WeakMap();
let element = document.getElementById('myDiv');

metadata.set(element, { clicks: 0 });

element = null;  // Elemento pode ser GC
// WeakMap entry automaticamente removido!

// ✅ Sem memory leak
// ✅ Sem limpeza manual
```

**Motivações principais:**

1. **Prevent memory leaks:** Garbage collection automático
2. **Private metadata:** Associar dados sem poluir objeto
3. **DOM node tracking:** Metadados para elementos DOM
4. **Weak references:** Referências que não impedem GC
5. **Caching:** Cache que limpa automaticamente

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

**WeakMap:**
1. **Weak references:** Chaves não impedem GC
2. **Object keys only:** Apenas objetos como chaves
3. **Non-enumerable:** Sem iteração ou `.size`
4. **Auto cleanup:** Entradas removidas quando chave GC
5. **Privacy:** Metadados sem poluir objeto

**WeakSet:**
1. **Weak references:** Valores não impedem GC
2. **Objects only:** Apenas objetos como valores
3. **Non-enumerable:** Sem iteração ou `.size`
4. **Auto cleanup:** Valores removidos quando GC
5. **Tracking:** Rastrear objetos sem impedir GC

### Pilares Fundamentais

**WeakMap:**
- **`.set(key, value)`:** key DEVE ser objeto
- **`.get(key)`:** Buscar valor por chave objeto
- **`.has(key)`:** Verificar existência
- **`.delete(key)`:** Remover entrada

**WeakSet:**
- **`.add(value)`:** value DEVE ser objeto
- **`.has(value)`:** Verificar existência
- **`.delete(value)`:** Remover valor

### Visão Geral das Nuances

- **Não iterável:** Impossível enumerar entradas/valores
- **Garbage collection:** Timing não determinístico
- **Object-only:** Primitivos causam TypeError
- **No size:** Impossível saber quantidade
- **No clear:** Apenas delete individual

---

## 🧠 Fundamentos Teóricos

### Como Funcionam Weak References

#### Strong References (Map/Set)

```javascript
// Strong reference: objeto NUNCA será GC enquanto referenciado
const map = new Map();
let obj = { data: 'large object' };

map.set(obj, 'metadata');

// Mesmo removendo todas outras referências:
obj = null;

// Objeto AINDA existe na memória (Map o referencia!)
// map.get(???) ainda retornaria 'metadata' se tivéssemos referência
```

**Problema:** Object permanece na memória indefinidamente, causando **memory leak** se esquecermos de limpar Map.

#### Weak References (WeakMap/WeakSet)

```javascript
// Weak reference: objeto PODE ser GC se não houver outras referências
const wm = new WeakMap();
let obj = { data: 'large object' };

wm.set(obj, 'metadata');

// Remover todas outras referências:
obj = null;

// Objeto PODE ser garbage collected!
// WeakMap entry será AUTOMATICAMENTE removido
// wm.get(obj) eventualmente retornará undefined (após GC)
```

**Solução:** Garbage collector **pode** remover objeto quando não há outras referências **strong**. WeakMap entry é automaticamente removido.

### Garbage Collection Behavior

**Quando objeto é GC:**

```
1. Objeto tem APENAS weak references (WeakMap/WeakSet)
2. Não há strong references (variáveis, Map, Set, closures, etc)
3. Garbage collector executa (timing não determinístico)
4. Objeto é removido da memória
5. WeakMap/WeakSet entries automaticamente removidos
```

**Timing não determinístico:**

```javascript
const wm = new WeakMap();
let obj = { id: 1 };

wm.set(obj, 'value');

obj = null;  // Tornar elegível para GC

// ⚠️ Não sabemos QUANDO GC vai executar!
// Pode ser imediato, pode ser daqui a 10 minutos

console.log(wm.has(???));  // Não temos referência para verificar!

// GC executa quando runtime decide (pressão de memória, idle time, etc)
```

### Por Que Apenas Objetos?

**Primitivos são imutáveis e copiados por valor:**

```javascript
// Primitivo: copiado por valor
let a = 42;
let b = a;  // CÓPIA de 42

a = 100;
console.log(b);  // 42 (não afetado)

// Impossível ter "weak reference" para primitivo!
// Cada variável tem sua PRÓPRIA CÓPIA

const wm = new WeakMap();
// wm.set(42, 'value');  // ❌ TypeError: Invalid value used as weak map key
```

**Objetos são mutáveis e referenciados:**

```javascript
// Objeto: referenciado
let obj1 = { id: 1 };
let obj2 = obj1;  // MESMA REFERÊNCIA

obj1.id = 100;
console.log(obj2.id);  // 100 (afetado!)

// Possível ter weak reference para REFERÊNCIA do objeto
const wm = new WeakMap();
wm.set(obj1, 'value');  // ✅ OK
```

**Motivação:**

- **Primitivos:** Não têm identidade única (42 === 42 sempre)
- **Objetos:** Têm identidade única (obj1 !== obj2 mesmo se conteúdo igual)
- **GC:** Apenas objetos são garbage collected (primitivos são valores)

---

## 🔍 Análise Conceitual Profunda

### WeakMap: Operações Básicas

**Criação:**

```javascript
// Criar vazio
const wm1 = new WeakMap();

// Inicializar com iterable de [key, value] pares
const key1 = { id: 1 };
const key2 = { id: 2 };

const wm2 = new WeakMap([
    [key1, 'value 1'],
    [key2, 'value 2']
]);

console.log(wm2.get(key1));  // "value 1"
```

**`.set(key, value)` - Adicionar/Atualizar:**

```javascript
const wm = new WeakMap();
const key = { id: 1 };

// Adicionar
wm.set(key, 'first value');
console.log(wm.get(key));  // "first value"

// Atualizar (mesma chave)
wm.set(key, 'updated value');
console.log(wm.get(key));  // "updated value"

// Chaining
const key2 = { id: 2 };
const key3 = { id: 3 };

wm.set(key2, 'v2').set(key3, 'v3');

// ❌ Primitivo como chave: TypeError
try {
    wm.set(42, 'value');
} catch (e) {
    console.log(e.message);  // Invalid value used as weak map key
}

try {
    wm.set('string', 'value');
} catch (e) {
    console.log(e.message);  // Invalid value used as weak map key
}
```

**`.get(key)` - Buscar Valor:**

```javascript
const wm = new WeakMap();
const key = { id: 1 };

wm.set(key, 'my value');

console.log(wm.get(key));  // "my value"

// Chave inexistente: undefined
const otherKey = { id: 999 };
console.log(wm.get(otherKey));  // undefined

// ❌ Primitivo: TypeError (em alguns engines) ou undefined
console.log(wm.get(42));  // undefined (ou TypeError)
```

**`.has(key)` - Verificar Existência:**

```javascript
const wm = new WeakMap();
const key = { id: 1 };

wm.set(key, 'value');

console.log(wm.has(key));  // true

const otherKey = { id: 2 };
console.log(wm.has(otherKey));  // false

// ❌ Primitivo
console.log(wm.has(42));  // false
```

**`.delete(key)` - Remover Entrada:**

```javascript
const wm = new WeakMap();
const key = { id: 1 };

wm.set(key, 'value');

console.log(wm.has(key));  // true

const deleted = wm.delete(key);
console.log(deleted);  // true (foi deletado)
console.log(wm.has(key));  // false

// Deletar inexistente
const notDeleted = wm.delete({ id: 999 });
console.log(notDeleted);  // false (não existia)
```

### WeakSet: Operações Básicas

**Criação:**

```javascript
// Criar vazio
const ws1 = new WeakSet();

// Inicializar com iterable de objetos
const obj1 = { id: 1 };
const obj2 = { id: 2 };

const ws2 = new WeakSet([obj1, obj2]);

console.log(ws2.has(obj1));  // true
```

**`.add(value)` - Adicionar Objeto:**

```javascript
const ws = new WeakSet();
const obj = { id: 1 };

// Adicionar
ws.add(obj);
console.log(ws.has(obj));  // true

// Adicionar duplicata (ignorado)
ws.add(obj);
console.log(ws.has(obj));  // true (ainda)

// Chaining
const obj2 = { id: 2 };
const obj3 = { id: 3 };

ws.add(obj2).add(obj3);

// ❌ Primitivo: TypeError
try {
    ws.add(42);
} catch (e) {
    console.log(e.message);  // Invalid value used in weak set
}
```

**`.has(value)` - Verificar Existência:**

```javascript
const ws = new WeakSet();
const obj = { id: 1 };

ws.add(obj);

console.log(ws.has(obj));  // true

const otherObj = { id: 2 };
console.log(ws.has(otherObj));  // false
```

**`.delete(value)` - Remover Objeto:**

```javascript
const ws = new WeakSet();
const obj = { id: 1 };

ws.add(obj);

const deleted = ws.delete(obj);
console.log(deleted);  // true
console.log(ws.has(obj));  // false
```

### Use Cases: WeakMap

**1. Private Data Storage (Dados Privados):**

```javascript
// Armazenar dados privados sem poluir objeto
const privateData = new WeakMap();

class Person {
    constructor(name, age) {
        this.name = name;  // Público
        
        // Armazenar idade como privado em WeakMap
        privateData.set(this, { age });
    }
    
    getAge() {
        return privateData.get(this).age;
    }
    
    setAge(age) {
        privateData.get(this).age = age;
    }
}

const person = new Person('Alice', 30);

console.log(person.name);  // "Alice" (público)
console.log(person.age);   // undefined (privado!)
console.log(person.getAge());  // 30

// ✅ Quando person é GC, privateData entry é automaticamente removido
// ✅ Sem memory leak
```

**2. DOM Node Metadata (Metadados de Elementos DOM):**

```javascript
// Associar metadata a elementos DOM sem poluir DOM
const elementMetadata = new WeakMap();

function trackClicks(element) {
    // Inicializar metadata se não existe
    if (!elementMetadata.has(element)) {
        elementMetadata.set(element, { clicks: 0 });
    }
    
    element.addEventListener('click', () => {
        const data = elementMetadata.get(element);
        data.clicks++;
        console.log(`Clicks: ${data.clicks}`);
    });
}

const button = document.getElementById('myButton');
trackClicks(button);

// ✅ Se button for removido do DOM:
// button.remove();
// button = null;

// ✅ WeakMap entry automaticamente removido (sem memory leak)
```

**3. Memoization/Caching (Cache com Auto-Cleanup):**

```javascript
// Cache que limpa automaticamente quando objetos não são mais usados
const cache = new WeakMap();

function expensiveOperation(obj) {
    // Verificar cache
    if (cache.has(obj)) {
        console.log('Cache hit!');
        return cache.get(obj);
    }
    
    // Computar resultado
    console.log('Computing...');
    const result = obj.data.toUpperCase();
    
    // Armazenar em cache
    cache.set(obj, result);
    
    return result;
}

let obj = { data: 'hello world' };

console.log(expensiveOperation(obj));  // "Computing..." + "HELLO WORLD"
console.log(expensiveOperation(obj));  // "Cache hit!" + "HELLO WORLD"

obj = null;  // Cache entry automaticamente removido quando GC

// ✅ Cache limpa sozinho quando objetos não são mais necessários
```

**4. Object Extension (Estender Objetos sem Modificá-los):**

```javascript
// Adicionar propriedades a objetos sem modificar prototype
const extensions = new WeakMap();

function extend(obj, properties) {
    extensions.set(obj, properties);
}

function getExtension(obj, key) {
    const ext = extensions.get(obj);
    return ext ? ext[key] : undefined;
}

const obj = { name: 'Original' };

// Estender sem modificar
extend(obj, { customProp: 'Extended value' });

console.log(obj.customProp);  // undefined (não polui objeto)
console.log(getExtension(obj, 'customProp'));  // "Extended value"
```

**5. Observer Pattern (Tracking Observers):**

```javascript
// Rastrear observers sem impedir GC
const observers = new WeakMap();

class Subject {
    notify(data) {
        // Notificar todos observers registrados
        // (Não podemos iterar WeakMap, então precisamos outro approach)
    }
}

function observe(subject, observer) {
    if (!observers.has(subject)) {
        observers.set(subject, new Set());
    }
    
    observers.get(subject).add(observer);
}

// ✅ Quando subject é GC, observers entry removido automaticamente
```

### Use Cases: WeakSet

**1. Marking Objects (Marcar Objetos Processados):**

```javascript
// Rastrear objetos processados sem impedir GC
const processedObjects = new WeakSet();

function processItem(item) {
    if (processedObjects.has(item)) {
        console.log('Already processed');
        return;
    }
    
    console.log('Processing...');
    // ... processing logic ...
    
    processedObjects.add(item);
}

let obj = { id: 1 };

processItem(obj);  // "Processing..."
processItem(obj);  // "Already processed"

obj = null;  // WeakSet entry automaticamente removido
```

**2. Tracking DOM Elements (Rastrear Elementos DOM):**

```javascript
// Rastrear elementos visitados/selecionados
const selectedElements = new WeakSet();

function selectElement(element) {
    selectedElements.add(element);
    element.classList.add('selected');
}

function deselectElement(element) {
    selectedElements.delete(element);
    element.classList.remove('selected');
}

function isSelected(element) {
    return selectedElements.has(element);
}

const div = document.getElementById('myDiv');
selectElement(div);

console.log(isSelected(div));  // true

// ✅ Se div for removido, WeakSet entry limpo automaticamente
```

**3. Preventing Duplicate Processing (Prevenir Processamento Duplicado):**

```javascript
// Garantir processamento único sem memory leak
const processed = new WeakSet();

async function processOnce(resource) {
    if (processed.has(resource)) {
        throw new Error('Resource already processed');
    }
    
    processed.add(resource);
    
    // ... processing ...
    
    return 'Success';
}

const resource = { url: 'https://api.example.com/data' };

await processOnce(resource);  // OK
// await processOnce(resource);  // Error: Resource already processed
```

### Garbage Collection em Ação

**Demonstração conceitual (timing não garantido):**

```javascript
const wm = new WeakMap();
const ws = new WeakSet();

(function() {
    let obj = { data: 'temporary' };
    
    wm.set(obj, 'metadata');
    ws.add(obj);
    
    console.log(wm.has(obj));  // true
    console.log(ws.has(obj));  // true
    
    // obj sai de escopo aqui
})();

// obj foi GC (eventualmente)
// WeakMap entry removido automaticamente
// WeakSet entry removido automaticamente

// ❌ Não podemos verificar porque perdemos referência!
// console.log(wm.has(???));  // Sem referência para testar
```

**Forçar GC (apenas para testes - não disponível em produção):**

```javascript
// ⚠️ Apenas Node.js com flag --expose-gc
// node --expose-gc script.js

const wm = new WeakMap();
let obj = { id: 1 };

wm.set(obj, 'value');

obj = null;  // Tornar elegível para GC

if (global.gc) {
    global.gc();  // Forçar GC (apenas em ambiente de teste)
}

// Entry foi removido (após GC)
```

### Diferenças de Map/Set

**Map pode ter primitivos como chaves:**

```javascript
const map = new Map();

map.set(42, 'number key');
map.set('hello', 'string key');
map.set(true, 'boolean key');

console.log(map.size);  // 3

// WeakMap: apenas objetos
const wm = new WeakMap();
// wm.set(42, 'value');  // ❌ TypeError
```

**Map é enumerável:**

```javascript
const map = new Map([
    [{ id: 1 }, 'v1'],
    [{ id: 2 }, 'v2']
]);

// Iterar
for (let [key, value] of map) {
    console.log(key, value);
}

console.log(map.size);  // 2

// WeakMap: não enumerável
const wm = new WeakMap([
    [{ id: 1 }, 'v1'],
    [{ id: 2 }, 'v2']
]);

// for (let entry of wm) {}  // ❌ TypeError: wm is not iterable
// console.log(wm.size);  // undefined
```

**Map tem `.clear()`:**

```javascript
const map = new Map([
    [{ id: 1 }, 'v1'],
    [{ id: 2 }, 'v2']
]);

map.clear();
console.log(map.size);  // 0

// WeakMap: sem .clear()
const wm = new WeakMap();
// wm.clear();  // ❌ TypeError: wm.clear is not a function
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar WeakMap

**Use quando:**

1. **Private data:** Dados privados sem poluir objeto
2. **DOM metadata:** Metadados para elementos DOM
3. **Caching:** Cache com auto-cleanup
4. **Memory-sensitive:** Prevenir memory leaks
5. **Object extension:** Estender objetos sem modificar

**Exemplos:**

```javascript
// 1. Private data
const privateData = new WeakMap();
class MyClass {
    constructor() {
        privateData.set(this, { secret: 'value' });
    }
}

// 2. DOM metadata
const elementData = new WeakMap();
elementData.set(domElement, { clicks: 0 });

// 3. Caching
const cache = new WeakMap();
cache.set(obj, computedResult);

// 4. Memory-sensitive
const listeners = new WeakMap();

// 5. Extension
const extensions = new WeakMap();
extensions.set(obj, { extra: 'data' });
```

### Quando Usar Map

**Use quando:**

1. **Enumeration:** Necessita iterar entradas
2. **Size tracking:** Necessita saber quantidade
3. **Primitive keys:** Strings, numbers como chaves
4. **Persistence:** Dados devem persistir
5. **Serialization:** Necessita converter para JSON

### Quando Usar WeakSet

**Use quando:**

1. **Object tracking:** Rastrear objetos processados
2. **DOM elements:** Rastrear elementos sem memory leak
3. **Tagging:** Marcar objetos temporariamente
4. **Memory-sensitive:** Prevenir memory leaks

### Quando Usar Set

**Use quando:**

1. **Enumeration:** Necessita iterar valores
2. **Size tracking:** Necessita saber quantidade
3. **Primitive values:** Strings, numbers
4. **Persistence:** Valores devem persistir
5. **Set operations:** Union, intersection, difference

---

## ⚠️ Limitações e Considerações Teóricas

### Não Enumerável

```javascript
const wm = new WeakMap();
const ws = new WeakSet();

// ❌ Sem iteração
// for (let entry of wm) {}  // TypeError
// for (let value of ws) {}  // TypeError

// ❌ Sem .keys(), .values(), .entries()
// console.log([...wm.keys()]);  // TypeError

// ❌ Sem .forEach()
// wm.forEach(() => {});  // TypeError
```

**Razão:** Enumerar WeakMap/WeakSet exporia timing de GC (não determinístico).

### Sem .size

```javascript
const wm = new WeakMap();
const ws = new WeakSet();

// ❌ Sem .size
console.log(wm.size);  // undefined
console.log(ws.size);  // undefined
```

**Razão:** `.size` exigiria enumerar todas entradas, expondo timing de GC.

### Sem .clear()

```javascript
const wm = new WeakMap();
const ws = new WeakSet();

// ❌ Sem .clear()
// wm.clear();  // TypeError
// ws.clear();  // TypeError
```

**Razão:** `.clear()` exigiria conhecer todas entradas.

**Alternativa:** Criar novo WeakMap/WeakSet

```javascript
let wm = new WeakMap();
wm.set(obj, 'value');

// "Limpar" criando novo
wm = new WeakMap();
```

### Apenas Objetos

```javascript
const wm = new WeakMap();
const ws = new WeakSet();

// ❌ Primitivos causam TypeError
try {
    wm.set(42, 'value');
} catch (e) {
    console.log(e);  // TypeError: Invalid value used as weak map key
}

try {
    ws.add('string');
} catch (e) {
    console.log(e);  // TypeError: Invalid value used in weak set
}

// ✅ Apenas objetos
wm.set({}, 'value');  // OK
ws.add({});  // OK
```

### GC Timing Não Determinístico

```javascript
const wm = new WeakMap();
let obj = { id: 1 };

wm.set(obj, 'value');

obj = null;  // Tornar elegível para GC

// ⚠️ Não sabemos QUANDO entry será removido!
// Pode ser imediato, pode ser em minutos
// Depende do garbage collector

// Não confie em timing específico!
```

### Performance

```javascript
// WeakMap/WeakSet têm mesma complexidade que Map/Set
// - .set()/.add(): O(1) amortizado
// - .get()/.has(): O(1) média
// - .delete(): O(1) média

// MAS: sem overhead de enumeration
// Pode ser MAIS EFICIENTE em alguns casos (menos bookkeeping)
```

---

## 🔗 Interconexões Conceituais

### Relação com Map/Set

```javascript
// Map: strong references, enumerável, .size, .clear()
const map = new Map();

// WeakMap: weak references, não enumerável
const wm = new WeakMap();

// Set: strong references, enumerável
const set = new Set();

// WeakSet: weak references, não enumerável
const ws = new WeakSet();
```

### Relação com Garbage Collection

```javascript
// WeakMap/WeakSet permitem GC automático
// Essencial para evitar memory leaks

// Strong reference (impede GC)
const map = new Map();
map.set(obj, 'value');

// Weak reference (permite GC)
const wm = new WeakMap();
wm.set(obj, 'value');
```

### Relação com Privacy Patterns

```javascript
// WeakMap para dados privados (alternativa a # private fields)
const privateData = new WeakMap();

class MyClass {
    constructor() {
        privateData.set(this, { secret: 'value' });
    }
    
    getSecret() {
        return privateData.get(this).secret;
    }
}

// vs ES2022 # private fields
class MyClass2 {
    #secret = 'value';
    
    getSecret() {
        return this.#secret;
    }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. Map Basics
2. Set Basics
3. **WeakMap/WeakSet** (você está aqui)

### Síntese do Módulo M38

**Map:**
- Qualquer tipo como chave
- Enumerável (iteração, `.size`, `.clear()`)
- Strong references
- Use para estruturas de dados genéricas

**Set:**
- Valores únicos
- Enumerável
- Strong references
- Use para deduplicação, membership testing

**WeakMap:**
- Apenas objetos como chave
- Não enumerável
- Weak references (permite GC)
- Use para metadados privados, prevenir memory leaks

**WeakSet:**
- Apenas objetos como valor
- Não enumerável
- Weak references
- Use para tracking objetos sem memory leak

**Escolha:**

```javascript
// Precisa iterar? → Map/Set
// Precisa .size? → Map/Set
// Precisa primitive keys/values? → Map/Set
// Precisa evitar memory leaks? → WeakMap/WeakSet
// Precisa metadados privados? → WeakMap
// Precisa tracking temporário? → WeakSet
```

### Próximos Passos

**Conceitos relacionados:**

- **ES2022 Private Fields:** `#privateField`
- **Symbols:** Unique property keys
- **Proxy:** Interceptar operações em objetos
- **Reflect:** Metadata operations

---

## 📚 Conclusão

**WeakMap** e **WeakSet** são estruturas de dados com **weak references** que permitem **garbage collection automático**, essenciais para **prevenir memory leaks** e armazenar **metadados privados**.

**Conceitos essenciais:**

**WeakMap:**
- **Weak references:** Chaves não impedem GC
- **Object keys only:** Apenas objetos como chaves (primitivos causam TypeError)
- **`.set(key, value)`:** key DEVE ser objeto
- **`.get(key)`:** Buscar valor (undefined se não existe)
- **`.has(key)`:** Verificar existência (O(1))
- **`.delete(key)`:** Remover entrada individual
- **Não enumerável:** Sem iteração, `.keys()`, `.values()`, `.entries()`, `.forEach()`
- **Sem `.size`:** Impossível saber quantidade
- **Sem `.clear()`:** Apenas `.delete()` individual
- **Auto cleanup:** Entradas removidas quando chave GC
- **Use cases:** Private data, DOM metadata, caching, object extension

**WeakSet:**
- **Weak references:** Valores não impedem GC
- **Objects only:** Apenas objetos como valores
- **`.add(value)`:** value DEVE ser objeto
- **`.has(value)`:** Verificar existência (O(1))
- **`.delete(value)`:** Remover valor individual
- **Não enumerável:** Sem iteração, `.size`, `.clear()`
- **Auto cleanup:** Valores removidos quando GC
- **Use cases:** Object tracking, DOM elements, tagging, duplicate prevention

**WeakMap vs Map:**
- WeakMap: weak refs, apenas objetos, não enumerável, auto GC
- Map: strong refs, qualquer tipo, enumerável, manual cleanup

**WeakSet vs Set:**
- WeakSet: weak refs, apenas objetos, não enumerável
- Set: strong refs, qualquer tipo, enumerável

**GC Behavior:**
- Weak references permitem garbage collection
- Timing não determinístico (runtime decide)
- Previne memory leaks automaticamente

**Limitações:**
- Não iterável (exporia timing de GC)
- Sem `.size` (exigiria enumeração)
- Sem `.clear()` (exigiria conhecer todas entradas)
- Apenas objetos (primitivos são valores, não referências)

Dominar WeakMap e WeakSet é essencial para **memory management**, **privacy patterns**, **DOM manipulation sem memory leaks** e **caching inteligente** em JavaScript moderno!
