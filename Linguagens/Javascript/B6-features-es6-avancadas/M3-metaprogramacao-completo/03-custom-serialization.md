# Serialização Customizada: toJSON, Replacer e Reviver Patterns

## 🎯 Introdução e Definição

### Definição Conceitual

**Serialização customizada** é o processo de **controlar exatamente como objetos são convertidos para JSON** usando **`.toJSON()` method**, **`replacer` function/array**, e **`reviver` function**, permitindo **omitir dados sensíveis**, **transformar valores**, **preservar tipos customizados**, e **implementar round-trip serialization**.

**Técnicas principais:**

1. **`.toJSON()` method:** Define serialização customizada no próprio objeto
2. **`replacer` function:** Filtra/transforma durante `JSON.stringify()`
3. **`replacer` array:** Whitelist de propriedades em `JSON.stringify()`
4. **`reviver` function:** Transforma valores durante `JSON.parse()`

**Sintaxe:**

```javascript
// 1. toJSON method
const obj = {
    data: 'value',
    toJSON() {
        return { customFormat: this.data };
    }
};

JSON.stringify(obj);  // '{"customFormat":"value"}'

// 2. Replacer function
JSON.stringify(obj, (key, value) => {
    if (key === 'password') return undefined;
    return value;
});

// 3. Replacer array
JSON.stringify(obj, ['id', 'name']);  // Apenas id e name

// 4. Reviver function
JSON.parse(json, (key, value) => {
    if (key === 'date') return new Date(value);
    return value;
});
```

### Características Fundamentais

**Serialização customizada:**

- **`.toJSON()`:** Método no objeto define representação JSON
- **`replacer`:** Controle externo sobre serialização
- **`reviver`:** Re-hidratar objetos customizados
- **Privacy:** Omitir dados sensíveis (passwords, tokens)
- **Type preservation:** Preservar Map, Set, Date, classes customizadas
- **Round-trip:** Serialize → Parse → Objeto original

### Problemas que Resolve

**Problema 1: Dados sensíveis expostos**

```javascript
// ❌ Problema: password serializado
const user = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secret123'
};

console.log(JSON.stringify(user));
// '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
// ⚠️ Password exposto!

// ✅ Solução: toJSON customizado
const userSafe = {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secret123',
    
    toJSON() {
        return {
            name: this.name,
            email: this.email
            // password omitido
        };
    }
};

console.log(JSON.stringify(userSafe));
// '{"name":"Alice","email":"alice@example.com"}'
// ✅ Password não aparece!
```

**Problema 2: Date perde métodos**

```javascript
// ❌ Problema: Date vira string, perde métodos
const obj = { createdAt: new Date('2025-11-13') };

const json = JSON.stringify(obj);
console.log(json);
// '{"createdAt":"2025-11-13T00:00:00.000Z"}'

const parsed = JSON.parse(json);
console.log(parsed.createdAt);  // String!
console.log(typeof parsed.createdAt);  // "string"
// parsed.createdAt.getFullYear();  // ❌ TypeError

// ✅ Solução: reviver re-hidrata Date
const parsed2 = JSON.parse(json, (key, value) => {
    if (key === 'createdAt') {
        return new Date(value);  // String → Date
    }
    return value;
});

console.log(parsed2.createdAt instanceof Date);  // true
console.log(parsed2.createdAt.getFullYear());   // 2025 ✅
```

**Problema 3: Map/Set viram `{}`**

```javascript
// ❌ Problema: Map não serializável
const data = {
    users: new Map([
        [1, 'Alice'],
        [2, 'Bob']
    ])
};

console.log(JSON.stringify(data));
// '{"users":{}}'  ⚠️ Map virou {}!

// ✅ Solução: toJSON customizado
data.users.toJSON = function() {
    return Array.from(this.entries());
};

console.log(JSON.stringify(data));
// '{"users":[[1,"Alice"],[2,"Bob"]]}'  ✅

// Re-hidratar com reviver
const json = '{"users":[[1,"Alice"],[2,"Bob"]]}';
const parsed = JSON.parse(json, (key, value) => {
    if (key === 'users' && Array.isArray(value)) {
        return new Map(value);
    }
    return value;
});

console.log(parsed.users instanceof Map);  // true
console.log(parsed.users.get(1));  // "Alice" ✅
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **`.toJSON()` method:** Controle interno de serialização
2. **`replacer` function:** Controle externo de serialização
3. **`reviver` function:** Re-hidratação durante parsing
4. **Type markers:** Preservar informação de tipo
5. **Round-trip:** Serialize + Parse = objeto original

### Pilares Fundamentais

- **Privacy:** Omitir dados sensíveis
- **Type preservation:** Preservar Map, Set, Date, classes
- **Transformation:** Converter valores durante serialização
- **Validation:** Validar estrutura durante parsing
- **Deep cloning:** Clone completo com tipos preservados

### Visão Geral das Nuances

- **Precedência:** `.toJSON()` executado ANTES de `replacer`
- **Reviver order:** Bottom-up (folhas → root)
- **Circular refs:** Requer estratégia customizada
- **Performance:** Overhead de transformações customizadas

---

## 🧠 Fundamentos Teóricos

### Precedência: toJSON → replacer

```javascript
const obj = {
    name: 'Alice',
    
    toJSON() {
        console.log('1. toJSON called');
        return { customName: this.name };
    }
};

const json = JSON.stringify(obj, (key, value) => {
    console.log('2. replacer called:', key, value);
    return value;
});

// Saída:
// 1. toJSON called
// 2. replacer called:  { customName: 'Alice' }
// 2. replacer called: customName Alice

// toJSON executado PRIMEIRO, depois replacer processa resultado
```

### Reviver Execution Order (Bottom-Up)

```javascript
const json = '{"user":{"name":"Alice","age":30}}';

JSON.parse(json, (key, value) => {
    console.log(`Key: "${key}"`);
    return value;
});

// Saída (bottom-up):
// Key: "name"   (folha)
// Key: "age"    (folha)
// Key: "user"   (nested object)
// Key: ""       (root) - SEMPRE POR ÚLTIMO

// Reviver processa folhas PRIMEIRO, root POR ÚLTIMO
```

---

## 🔍 Análise Conceitual Profunda

### `.toJSON()` Method - Serialização Customizada

**Basic usage:**

```javascript
const point = {
    x: 10,
    y: 20,
    
    toJSON() {
        return {
            type: 'Point',
            coordinates: [this.x, this.y]
        };
    }
};

console.log(JSON.stringify(point));
// '{"type":"Point","coordinates":[10,20]}'
```

**Omitir propriedades privadas:**

```javascript
class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this._password = password;  // "privado"
    }
    
    toJSON() {
        // Retornar apenas dados públicos
        return {
            name: this.name,
            email: this.email
            // _password omitido
        };
    }
}

const user = new User('Alice', 'alice@example.com', 'secret');

console.log(JSON.stringify(user));
// '{"name":"Alice","email":"alice@example.com"}'
// _password não aparece!
```

**Adicionar metadata:**

```javascript
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.createdAt = new Date();
    }
    
    toJSON() {
        return {
            type: 'Product',  // Metadata
            name: this.name,
            price: this.price,
            createdAt: this.createdAt.toISOString()
        };
    }
}

const product = new Product('Laptop', 1200);

console.log(JSON.stringify(product, null, 2));
/*
{
  "type": "Product",
  "name": "Laptop",
  "price": 1200,
  "createdAt": "2025-11-13T10:00:00.000Z"
}
*/
```

**Transformar estrutura:**

```javascript
class Person {
    constructor(firstName, lastName, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
    
    toJSON() {
        return {
            fullName: `${this.firstName} ${this.lastName}`,
            age: this.age,
            isAdult: this.age >= 18
        };
    }
}

const person = new Person('Alice', 'Smith', 30);

console.log(JSON.stringify(person));
// '{"fullName":"Alice Smith","age":30,"isAdult":true}'
```

### Replacer Function - Filtragem e Transformação

**Omitir propriedades específicas:**

```javascript
const user = {
    id: 1,
    name: 'Alice',
    password: 'secret',
    token: 'abc123'
};

// Omitir campos sensíveis
const json = JSON.stringify(user, (key, value) => {
    if (key === 'password' || key === 'token') {
        return undefined;  // Omite
    }
    return value;
});

console.log(json);
// '{"id":1,"name":"Alice"}'
```

**Transformar valores:**

```javascript
const data = {
    name: 'Alice',
    age: 30,
    salary: 5000
};

// Ofuscar salary
const json = JSON.stringify(data, (key, value) => {
    if (key === 'salary') {
        return '***';  // Ofuscar
    }
    return value;
});

console.log(json);
// '{"name":"Alice","age":30,"salary":"***"}'
```

**Converter tipos customizados:**

```javascript
const data = {
    name: 'Alice',
    createdAt: new Date('2025-11-13'),
    tags: new Set(['javascript', 'react'])
};

// Serializar Date e Set
const json = JSON.stringify(data, (key, value) => {
    // Date → ISO string
    if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
    }
    
    // Set → Array
    if (value instanceof Set) {
        return { __type: 'Set', value: [...value] };
    }
    
    return value;
});

console.log(json);
// '{"name":"Alice","createdAt":{"__type":"Date","value":"2025-11-13T00:00:00.000Z"},"tags":{"__type":"Set","value":["javascript","react"]}}'
```

**Logging de transformações:**

```javascript
const obj = {
    a: 1,
    b: { c: 2 },
    d: [3, 4]
};

JSON.stringify(obj, (key, value) => {
    console.log(`Processing: key="${key}", type=${typeof value}`);
    return value;
});

// Saída:
// Processing: key="", type=object     (root)
// Processing: key="a", type=number
// Processing: key="b", type=object
// Processing: key="c", type=number
// Processing: key="d", type=object    (array é object)
// Processing: key="0", type=number
// Processing: key="1", type=number
```

### Replacer Array - Whitelist de Propriedades

**Selecionar campos específicos:**

```javascript
const user = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secret',
    role: 'admin',
    createdAt: new Date()
};

// Apenas id, name, email
const json = JSON.stringify(user, ['id', 'name', 'email']);

console.log(json);
// '{"id":1,"name":"Alice","email":"alice@example.com"}'
// password, role, createdAt omitidos
```

**Nested objects:**

```javascript
const data = {
    user: {
        id: 1,
        name: 'Alice',
        password: 'secret'
    },
    token: 'abc123',
    timestamp: Date.now()
};

// Incluir user, id, name (mas não password, token, timestamp)
const json = JSON.stringify(data, ['user', 'id', 'name']);

console.log(json);
// '{"user":{"id":1,"name":"Alice"}}'
```

**Arrays em whitelist:**

```javascript
const data = {
    users: [
        { id: 1, name: 'Alice', password: 'secret1' },
        { id: 2, name: 'Bob', password: 'secret2' }
    ]
};

// Whitelist aplica a propriedades de cada objeto
const json = JSON.stringify(data, ['users', 'id', 'name']);

console.log(json);
// '{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]}'
// passwords omitidos
```

### Reviver Function - Re-hidratação

**Converter Date strings:**

```javascript
const json = '{"name":"Alice","createdAt":"2025-11-13T10:00:00.000Z"}';

// Auto-detectar ISO date strings
const parsed = JSON.parse(json, (key, value) => {
    // Regex para ISO 8601 date
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;  // String → Date
        }
    }
    return value;
});

console.log(parsed.createdAt instanceof Date);  // true
console.log(parsed.createdAt.getFullYear());   // 2025
```

**Re-hidratar tipos customizados com metadata:**

```javascript
// Serializar com type markers
const data = {
    date: new Date('2025-11-13'),
    set: new Set([1, 2, 3]),
    map: new Map([['a', 1], ['b', 2]])
};

const json = JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
        return { __type: 'Date', value: value.toISOString() };
    }
    if (value instanceof Set) {
        return { __type: 'Set', value: [...value] };
    }
    if (value instanceof Map) {
        return { __type: 'Map', value: [...value] };
    }
    return value;
});

console.log(json);

// Re-hidratar
const parsed = JSON.parse(json, (key, value) => {
    if (value && typeof value === 'object' && value.__type) {
        switch (value.__type) {
            case 'Date':
                return new Date(value.value);
            case 'Set':
                return new Set(value.value);
            case 'Map':
                return new Map(value.value);
        }
    }
    return value;
});

console.log(parsed.date instanceof Date);  // true
console.log(parsed.set instanceof Set);    // true
console.log(parsed.map instanceof Map);    // true
```

**Re-hidratar classes customizadas:**

```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    toJSON() {
        return {
            __type: 'User',
            name: this.name,
            email: this.email
        };
    }
    
    static fromJSON(data) {
        return new User(data.name, data.email);
    }
}

const user = new User('Alice', 'alice@example.com');

// Serialize
const json = JSON.stringify(user);
console.log(json);
// '{"__type":"User","name":"Alice","email":"alice@example.com"}'

// Deserialize
const parsed = JSON.parse(json, (key, value) => {
    if (value && value.__type === 'User') {
        return User.fromJSON(value);
    }
    return value;
});

console.log(parsed instanceof User);  // true
console.log(parsed.name);  // "Alice"
```

**Validação durante parsing:**

```javascript
const json = '{"age":-5,"name":"Alice"}';

try {
    const parsed = JSON.parse(json, (key, value) => {
        // Validar age
        if (key === 'age' && value < 0) {
            throw new Error('Age cannot be negative');
        }
        
        // Validar name
        if (key === 'name' && typeof value !== 'string') {
            throw new Error('Name must be string');
        }
        
        return value;
    });
} catch (e) {
    console.log('Validation error:', e.message);
    // "Age cannot be negative"
}
```

### Patterns Avançados

**Pattern 1: Deep cloning com tipos preservados**

```javascript
function deepClone(obj) {
    // Serialize com type markers
    const json = JSON.stringify(obj, (key, value) => {
        if (value instanceof Date) {
            return { __type: 'Date', value: value.toISOString() };
        }
        if (value instanceof Map) {
            return { __type: 'Map', value: [...value] };
        }
        if (value instanceof Set) {
            return { __type: 'Set', value: [...value] };
        }
        return value;
    });
    
    // Deserialize com re-hidratação
    return JSON.parse(json, (key, value) => {
        if (value && typeof value === 'object' && value.__type) {
            switch (value.__type) {
                case 'Date': return new Date(value.value);
                case 'Map': return new Map(value.value);
                case 'Set': return new Set(value.value);
            }
        }
        return value;
    });
}

const original = {
    name: 'Alice',
    createdAt: new Date(),
    tags: new Set(['js', 'react']),
    meta: new Map([['key', 'value']])
};

const clone = deepClone(original);

console.log(clone.createdAt instanceof Date);  // true
console.log(clone.tags instanceof Set);        // true
console.log(clone.meta instanceof Map);        // true
```

**Pattern 2: Versioning de schema**

```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    toJSON() {
        return {
            __version: 2,  // Schema version
            name: this.name,
            email: this.email
        };
    }
    
    static fromJSON(data) {
        // Migrar versões antigas
        if (data.__version === 1) {
            // Migrar v1 → v2
            return new User(data.fullName, data.emailAddress);
        }
        
        // v2 atual
        return new User(data.name, data.email);
    }
}

// Parse com migration
const jsonV1 = '{"__version":1,"fullName":"Alice","emailAddress":"alice@example.com"}';
const jsonV2 = '{"__version":2,"name":"Alice","email":"alice@example.com"}';

const user1 = User.fromJSON(JSON.parse(jsonV1));
const user2 = User.fromJSON(JSON.parse(jsonV2));

console.log(user1.name);  // "Alice" (migrated from v1)
console.log(user2.name);  // "Alice" (v2)
```

**Pattern 3: Circular reference handling**

```javascript
function stringifyWithCircular(obj) {
    const seen = new WeakSet();
    
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';  // Marcar circular ref
            }
            seen.add(value);
        }
        return value;
    });
}

const obj = { name: 'Alice' };
obj.self = obj;  // Circular!

console.log(stringifyWithCircular(obj));
// '{"name":"Alice","self":"[Circular]"}'
```

### Date Serialization Strategies

**Strategy 1: ISO string (padrão Date.toJSON)**

```javascript
const obj = {
    createdAt: new Date('2025-11-13T10:00:00Z')
};

const json = JSON.stringify(obj);
console.log(json);
// '{"createdAt":"2025-11-13T10:00:00.000Z"}'

// Parse com reviver
const parsed = JSON.parse(json, (key, value) => {
    if (key === 'createdAt') return new Date(value);
    return value;
});
```

**Strategy 2: Timestamp (milliseconds)**

```javascript
const obj = {
    createdAt: new Date('2025-11-13T10:00:00Z'),
    
    toJSON() {
        return {
            createdAt: this.createdAt.getTime()  // Timestamp
        };
    }
};

const json = JSON.stringify(obj);
// '{"createdAt":1731492000000}'

const parsed = JSON.parse(json, (key, value) => {
    if (key === 'createdAt') return new Date(value);
    return value;
});
```

**Strategy 3: Type marker**

```javascript
const obj = {
    createdAt: new Date('2025-11-13'),
    
    toJSON() {
        return {
            createdAt: {
                __type: 'Date',
                value: this.createdAt.toISOString()
            }
        };
    }
};
```

### Map/Set Serialization

**Map serialization:**

```javascript
class SerializableMap extends Map {
    toJSON() {
        return {
            __type: 'Map',
            entries: [...this.entries()]
        };
    }
    
    static fromJSON(data) {
        return new SerializableMap(data.entries);
    }
}

const map = new SerializableMap([
    ['key1', 'value1'],
    ['key2', 'value2']
]);

const json = JSON.stringify(map);
console.log(json);
// '{"__type":"Map","entries":[["key1","value1"],["key2","value2"]]}'

const parsed = SerializableMap.fromJSON(JSON.parse(json));
console.log(parsed instanceof Map);  // true
console.log(parsed.get('key1'));     // "value1"
```

**Set serialization:**

```javascript
class SerializableSet extends Set {
    toJSON() {
        return {
            __type: 'Set',
            values: [...this]
        };
    }
    
    static fromJSON(data) {
        return new SerializableSet(data.values);
    }
}

const set = new SerializableSet([1, 2, 3]);

const json = JSON.stringify(set);
// '{"__type":"Set","values":[1,2,3]}'

const parsed = SerializableSet.fromJSON(JSON.parse(json));
console.log(parsed.has(2));  // true
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar toJSON()

**Use quando:**

1. **Privacy:** Omitir dados sensíveis (passwords, tokens)
2. **API responses:** Controlar exatamente o que é serializado
3. **Custom classes:** Definir representação JSON da classe
4. **Metadata:** Adicionar informação de tipo/versão

```javascript
class APIResponse {
    constructor(data) {
        this.data = data;
        this._internalCache = {};  // Não deve ser serializado
    }
    
    toJSON() {
        return {
            version: '1.0',
            data: this.data
            // _internalCache omitido
        };
    }
}
```

### Quando Usar Replacer

**Use quando:**

1. **Controle externo:** Não pode modificar classe original
2. **Conditional serialization:** Diferentes contextos
3. **Type conversion:** Converter tipos durante serialize
4. **Logging/Debug:** Inspecionar serialization process

```javascript
// Diferentes contextos
function serializeForAPI(obj) {
    return JSON.stringify(obj, (key, value) => {
        if (key.startsWith('_')) return undefined;  // Omitir privados
        return value;
    });
}

function serializeForStorage(obj) {
    return JSON.stringify(obj, (key, value) => {
        // Incluir tudo
        return value;
    });
}
```

### Quando Usar Reviver

**Use quando:**

1. **Re-hidratação:** Restaurar Date, Map, Set, classes
2. **Validation:** Validar dados durante parsing
3. **Migration:** Atualizar schemas antigos
4. **Type conversion:** Converter strings → tipos corretos

```javascript
// Validation + conversion
function parseUserData(json) {
    return JSON.parse(json, (key, value) => {
        // Convert dates
        if (key === 'createdAt') return new Date(value);
        
        // Validate age
        if (key === 'age' && value < 0) {
            throw new Error('Invalid age');
        }
        
        return value;
    });
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```javascript
// Serialization customizada adiciona overhead

const largeArray = new Array(10000).fill({ data: 'value' });

console.time('stringify normal');
JSON.stringify(largeArray);
console.timeEnd('stringify normal');
// ~5ms

console.time('stringify com replacer');
JSON.stringify(largeArray, (key, value) => value);
console.timeEnd('stringify com replacer');
// ~15ms (3x mais lento!)

// ⚠️ Replacer/reviver são chamados para CADA propriedade
```

### Circular References

```javascript
// toJSON não resolve circular refs automaticamente

const obj = {
    name: 'Alice',
    toJSON() {
        return {
            name: this.name,
            self: this  // ❌ Circular!
        };
    }
};

try {
    JSON.stringify(obj);
} catch (e) {
    console.log(e.message);  // "Converting circular structure to JSON"
}

// ✅ Precisa resolver manualmente
```

### Deep Cloning Limitations

```javascript
// JSON deep clone NÃO preserva:

const original = {
    fn: function() {},        // Function perdida
    sym: Symbol('s'),         // Symbol perdido
    undef: undefined,         // undefined perdido
    date: new Date(),         // Date → string (sem reviver)
    map: new Map([[1,2]]),    // Map → {}
    proto: Object.create({ inherited: true })  // Prototype perdido
};

const clone = JSON.parse(JSON.stringify(original));

console.log(clone);
// { date: "2025-11-13T...", map: {} }
// Muita informação perdida!
```

---

## 🔗 Interconexões Conceituais

### Relação com JSON.stringify/parse

```javascript
// toJSON integrado com stringify
const obj = { toJSON() { return { custom: true }; } };
JSON.stringify(obj);  // Usa toJSON()

// reviver integrado com parse
JSON.parse(json, reviverFn);  // Usa reviver
```

### Relação com Classes

```javascript
// Classes usam toJSON para serialization
class User {
    toJSON() { /* ... */ }
    static fromJSON(data) { /* ... */ }
}

// Round-trip
const json = JSON.stringify(user);
const restored = User.fromJSON(JSON.parse(json));
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. JSON.stringify() (anterior)
2. JSON.parse() (anterior)
3. **Custom serialization** (você está aqui)
4. **Meta-programming** (próximo - Object.defineProperty, descriptors)

### Preparação para Meta-programming

**Meta-programming** permite controle ainda mais fino sobre objetos:

```javascript
// Object.defineProperty - controlar property descriptors
Object.defineProperty(obj, 'secret', {
    value: 'hidden',
    enumerable: false,  // Não aparece em JSON.stringify()
    writable: false
});

JSON.stringify(obj);  // 'secret' omitido (não enumerável)

// Proxy - interceptar operações
const proxy = new Proxy(obj, {
    get(target, prop) {
        if (prop === 'toJSON') {
            return () => ({ intercepted: true });
        }
        return target[prop];
    }
});

JSON.stringify(proxy);  // Proxy intercepta toJSON
```

Próximo: **Meta-programming** com `Object.defineProperty()` e property descriptors.

---

## 📚 Conclusão

**Serialização customizada** permite **controle completo** sobre conversão **JavaScript ↔ JSON**, essencial para **privacy**, **type preservation**, e **round-trip serialization**.

**Conceitos essenciais:**

**`.toJSON()` method:**
- Define serialização customizada no objeto
- Executado ANTES de replacer
- Permite omitir dados sensíveis, transformar estrutura, adicionar metadata
- Use para privacy, custom classes, API responses

**`replacer` function:**
- Controle externo sobre serialização
- `(key, value) => newValue`
- Permite filtrar, transformar, converter tipos
- Chamado para CADA propriedade (overhead!)
- Use quando não pode modificar objeto original

**`replacer` array:**
- Whitelist de propriedades
- Seleciona apenas campos específicos
- Aplica a nested objects
- Use para expor apenas dados públicos

**`reviver` function:**
- Re-hidratação durante parsing
- `(key, value) => newValue`
- Executado bottom-up (folhas → root)
- Permite converter strings → Date, Map, Set, classes
- Use para validation, migration, type conversion

**Patterns avançados:**
- **Type markers:** `{ __type: 'Date', value: ... }`
- **Deep cloning:** Serialize + Parse com type preservation
- **Circular refs:** WeakSet para detectar
- **Versioning:** `__version` field para migrations
- **Map/Set:** Converter para arrays com type markers
- **Date:** ISO string, timestamp, ou type marker

**Performance:**
- Replacer/reviver adicionam overhead
- Chamados para CADA propriedade
- Use apenas quando necessário

**Limitações:**
- Circular refs requerem estratégia customizada
- Deep clone não preserva tudo (functions, symbols, prototype)
- Performance overhead em objetos grandes

**Round-trip pattern:**
```javascript
// Serialize
class MyClass {
    toJSON() { return { __type: 'MyClass', data: this.data }; }
    static fromJSON(obj) { return new MyClass(obj.data); }
}

// Usage
const json = JSON.stringify(instance);
const restored = MyClass.fromJSON(JSON.parse(json));
```

Dominar serialização customizada é essencial para **API design**, **data persistence**, **privacy**, e **type preservation** em JavaScript moderno!
