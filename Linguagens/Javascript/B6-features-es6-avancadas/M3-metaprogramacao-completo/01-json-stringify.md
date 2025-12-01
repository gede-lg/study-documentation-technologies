# JSON.stringify(): Serialização de Objetos para JSON

## 🎯 Introdução e Definição

### Definição Conceitual

**JSON.stringify()** é um **método nativo** que **serializa** (converte) valores JavaScript para **strings JSON** (JavaScript Object Notation), permitindo **armazenamento**, **transmissão** e **intercâmbio de dados** entre sistemas de forma **padronizada** e **independente de linguagem**.

**Sintaxe:**

```javascript
JSON.stringify(value);
JSON.stringify(value, replacer);
JSON.stringify(value, replacer, space);
```

**Exemplo básico:**

```javascript
const obj = {
    name: 'Alice',
    age: 30,
    active: true
};

// Serializar objeto para string JSON
const jsonString = JSON.stringify(obj);

console.log(jsonString);
// '{"name":"Alice","age":30,"active":true}'

console.log(typeof jsonString);  // "string"

// Pode ser armazenado, transmitido ou enviado via HTTP
localStorage.setItem('user', jsonString);
```

**Características fundamentais:**

- **Serialização:** Converte valores JS → string JSON
- **Universal:** Formato independente de linguagem
- **Tipos suportados:** Object, Array, string, number, boolean, null
- **Tipos ignorados:** function, undefined, Symbol
- **Replacer parameter:** Filtrar/transformar valores
- **Space parameter:** Formatar saída (indentação)
- **toJSON method:** Customizar serialização

### JSON vs JavaScript Object Literal

**JavaScript Object Literal (código):**

```javascript
// JavaScript object literal (código executável)
const jsObj = {
    name: 'Alice',          // Chaves podem ser sem aspas
    age: 30,
    greet: function() {     // Pode ter funções
        console.log('Hi!');
    },
    [Symbol('id')]: 123,    // Pode ter Symbols
    undefined: undefined    // Pode ter undefined
};

console.log(typeof jsObj);  // "object"
console.log(jsObj.greet);   // [Function: greet]
```

**JSON String (dados):**

```javascript
// JSON string (formato de dados)
const jsonStr = '{"name":"Alice","age":30}';

// Características JSON:
// ✅ Chaves SEMPRE entre aspas duplas
// ✅ Strings SEMPRE entre aspas duplas
// ✅ Apenas tipos primitivos + object + array
// ❌ SEM funções
// ❌ SEM undefined
// ❌ SEM Symbols
// ❌ SEM Date (converte para string ISO)
// ❌ SEM RegExp (converte para {})

console.log(typeof jsonStr);  // "string"
```

**Tabela comparativa conceitual:**

| Característica | JavaScript Object | JSON String |
|----------------|-------------------|-------------|
| **Tipo** | Object (memória) | String (texto) |
| **Uso** | Código executável | Formato de dados |
| **Chaves** | Com/sem aspas | SEMPRE aspas duplas `"` |
| **Strings** | `'` ou `"` ou `` ` `` | SEMPRE aspas duplas `"` |
| **Funções** | ✅ Permitidas | ❌ Ignoradas |
| **undefined** | ✅ Permitido | ❌ Ignorado |
| **Symbol** | ✅ Permitido | ❌ Ignorado |
| **Date** | ✅ Objeto Date | Converte para string ISO |
| **Métodos** | ✅ Permitidos | ❌ Ignorados |
| **Comments** | ✅ Permitidos | ❌ Não permitidos |
| **Trailing comma** | ✅ Permitido (ES5+) | ❌ Não permitido |

### Contexto Histórico e Motivação

**Problema pré-JSON:** Formatos proprietários para data interchange

**Anos 90-2000:**

```javascript
// XML (verbose, complexo para parsing)
const xmlStr = `
<user>
    <name>Alice</name>
    <age>30</age>
    <active>true</active>
</user>
`;

// ❌ Verboso (muitas tags)
// ❌ Parsing complexo
// ❌ Mais bytes para transmitir

// Formatos customizados (não padronizados)
const customFormat = "name:Alice|age:30|active:true";
// ❌ Cada sistema tinha seu formato
// ❌ Difícil interoperabilidade
```

**2001:** Douglas Crockford especifica JSON

```javascript
// JSON: simples, leve, baseado em JavaScript
const jsonStr = '{"name":"Alice","age":30,"active":true}';

// ✅ Sintaxe familiar (JavaScript-like)
// ✅ Parsing nativo em JavaScript
// ✅ Leve (menos bytes que XML)
// ✅ Independente de linguagem
// ✅ Padronizado (RFC 8259)
```

**ES5 (2009):** `JSON.stringify()` e `JSON.parse()` nativos

```javascript
// Antes ES5: bibliotecas externas (json2.js)
// Após ES5: métodos nativos

const obj = { name: 'Alice', age: 30 };

// Serializar
const jsonStr = JSON.stringify(obj);
console.log(jsonStr);  // '{"name":"Alice","age":30}'

// Parse
const parsed = JSON.parse(jsonStr);
console.log(parsed);  // { name: 'Alice', age: 30 }

// ✅ Nativo (sem dependências)
// ✅ Rápido (engine-optimized)
// ✅ Padronizado
```

**Motivações principais:**

1. **Data interchange:** Trocar dados entre cliente-servidor
2. **API communication:** Formato padrão para REST APIs
3. **Storage:** Armazenar dados em localStorage, files
4. **Serialization:** Persistir estado de aplicações
5. **Cross-language:** Funciona em JavaScript, Python, Java, etc.

### Problema Fundamental que Resolve

**Problema:** Como **transmitir/armazenar** estruturas de dados JavaScript complexas em **formato de texto** que possa ser **reconstituído** posteriormente ou em **outros sistemas**?

**Cenário real - API communication:**

```javascript
// Cliente (JavaScript): enviar dados para servidor
const user = {
    name: 'Alice',
    age: 30,
    preferences: {
        theme: 'dark',
        notifications: true
    }
};

// ❌ Não pode enviar objeto diretamente via HTTP
// fetch('/api/users', {
//     body: user  // ❌ TypeError: body must be string or FormData
// });

// ✅ Serializar para JSON string
const jsonStr = JSON.stringify(user);

fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: jsonStr  // ✅ String JSON
});

// Servidor recebe:
// '{"name":"Alice","age":30,"preferences":{"theme":"dark","notifications":true}}'

// Servidor (qualquer linguagem) pode fazer parse:
// Python: json.loads(jsonStr)
// Java: new ObjectMapper().readValue(jsonStr)
// PHP: json_decode($jsonStr)
```

### Importância no Ecossistema

JSON.stringify() é **essencial** para:

- **REST APIs:** Enviar/receber dados JSON
- **LocalStorage:** Armazenar objetos complexos
- **State management:** Serializar estado Redux/Vuex
- **Logging:** Converter objetos para strings
- **Deep cloning:** Clonar objetos (com limitações)
- **Data export:** Exportar dados para arquivos

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Serialização:** Valor JavaScript → String JSON
2. **Format compliance:** Output sempre válido JSON (RFC 8259)
3. **Type handling:** Diferentes comportamentos por tipo
4. **Replacer function:** Transformar valores durante serialização
5. **Space parameter:** Formatar output com indentação

### Pilares Fundamentais

- **`JSON.stringify(value)`:** Serializar valor básico
- **`JSON.stringify(value, replacer)`:** Filtrar/transformar
- **`JSON.stringify(value, replacer, space)`:** Formatar output
- **Tipos suportados:** Object, Array, primitivos básicos
- **Tipos ignorados:** Function, undefined, Symbol

### Visão Geral das Nuances

- **Circular references:** Lançam TypeError
- **Property order:** Não garantida para objects
- **BigInt:** Lança TypeError (não suportado)
- **NaN/Infinity:** Convertidos para `null`
- **Date:** Converte para string ISO 8601
- **toJSON method:** Permite customização

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

**Processo de serialização:**

```
1. Verificar tipo do value
2. Se value.toJSON existe → chamar e usar resultado
3. Se value é primitivo → serializar diretamente
4. Se value é object/array → recursivamente serializar propriedades
5. Se replacer fornecido → aplicar em cada valor
6. Se space fornecido → adicionar indentação
7. Retornar string JSON final
```

**Algoritmo conceitual:**

```javascript
// Pseudo-código simplificado de JSON.stringify()
function stringify(value, replacer, space) {
    // 1. Tratar toJSON
    if (value && typeof value.toJSON === 'function') {
        value = value.toJSON();
    }
    
    // 2. Aplicar replacer
    if (typeof replacer === 'function') {
        value = replacer('', value);
    }
    
    // 3. Serializar por tipo
    if (value === null) return 'null';
    if (value === undefined) return undefined;  // Ignorado
    if (typeof value === 'boolean') return String(value);
    if (typeof value === 'number') {
        return isFinite(value) ? String(value) : 'null';
    }
    if (typeof value === 'string') {
        return '"' + escapeString(value) + '"';
    }
    if (Array.isArray(value)) {
        return '[' + value.map(v => stringify(v)).join(',') + ']';
    }
    if (typeof value === 'object') {
        const props = Object.keys(value)
            .filter(k => value[k] !== undefined)
            .map(k => '"' + k + '":' + stringify(value[k]));
        return '{' + props.join(',') + '}';
    }
    
    return undefined;  // Function, Symbol, etc → ignorados
}
```

### Type Handling (Tratamento por Tipo)

**Tipos que serializam normalmente:**

```javascript
// String
JSON.stringify('hello');  // '"hello"'

// Number
JSON.stringify(42);  // '42'
JSON.stringify(3.14);  // '3.14'

// Boolean
JSON.stringify(true);  // 'true'
JSON.stringify(false);  // 'false'

// null
JSON.stringify(null);  // 'null'

// Array
JSON.stringify([1, 2, 3]);  // '[1,2,3]'

// Object
JSON.stringify({ a: 1, b: 2 });  // '{"a":1,"b":2}'
```

**Tipos especiais:**

```javascript
// undefined → omitido em objects, null em arrays
JSON.stringify({ a: undefined });  // '{}'
JSON.stringify([undefined]);  // '[null]'

// Function → omitido em objects, null em arrays
JSON.stringify({ fn: function() {} });  // '{}'
JSON.stringify([function() {}]);  // '[null]'

// Symbol → omitido em objects, null em arrays
JSON.stringify({ s: Symbol('id') });  // '{}'
JSON.stringify([Symbol('id')]);  // '[null]'

// NaN → null
JSON.stringify(NaN);  // 'null'

// Infinity → null
JSON.stringify(Infinity);  // 'null'
JSON.stringify(-Infinity);  // 'null'

// BigInt → TypeError!
try {
    JSON.stringify(123n);
} catch (e) {
    console.log(e.message);  // Do not know how to serialize a BigInt
}
```

**Date → ISO 8601 string:**

```javascript
const date = new Date('2024-01-15T10:30:00Z');

JSON.stringify(date);
// '"2024-01-15T10:30:00.000Z"'

// Date.toJSON() é chamado internamente
console.log(date.toJSON());  // "2024-01-15T10:30:00.000Z"
```

**RegExp → empty object:**

```javascript
JSON.stringify(/regex/);  // '{}'

// RegExp não tem toJSON() e não é array
// Serializado como object vazio
```

**Map/Set → empty object:**

```javascript
JSON.stringify(new Map([['a', 1]]));  // '{}'
JSON.stringify(new Set([1, 2, 3]));   // '{}'

// Map/Set não são plain objects
// Serializam como {}
```

### Comportamento com Objects e Arrays

**Objects - propriedades enumeráveis:**

```javascript
const obj = {
    name: 'Alice',
    age: 30
};

// Apenas propriedades enumeráveis
Object.defineProperty(obj, 'secret', {
    value: 'hidden',
    enumerable: false
});

JSON.stringify(obj);
// '{"name":"Alice","age":30}'
// 'secret' omitido (não enumerável)
```

**Arrays - todos elementos:**

```javascript
const arr = [1, 2, 3];
arr[10] = 10;  // Sparse array

JSON.stringify(arr);
// '[1,2,3,null,null,null,null,null,null,null,10]'

// Holes preenchidos com null
```

**Nested structures:**

```javascript
const nested = {
    user: {
        name: 'Alice',
        address: {
            city: 'NYC',
            zip: '10001'
        }
    },
    tags: ['admin', 'verified']
};

JSON.stringify(nested);
// '{"user":{"name":"Alice","address":{"city":"NYC","zip":"10001"}},"tags":["admin","verified"]}'
```

---

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

**Apenas value:**

```javascript
const obj = { name: 'Alice', age: 30 };

const json = JSON.stringify(obj);
console.log(json);
// '{"name":"Alice","age":30}'

// Output compacto (sem espaços)
```

**Com replacer (null = sem filtragem):**

```javascript
const obj = { name: 'Alice', age: 30 };

const json = JSON.stringify(obj, null);
console.log(json);
// '{"name":"Alice","age":30}'

// Mesmo resultado que sem replacer
```

**Com space (indentação):**

```javascript
const obj = { name: 'Alice', age: 30 };

const json = JSON.stringify(obj, null, 2);
console.log(json);
// {
//   "name": "Alice",
//   "age": 30
// }

// Formatado com 2 espaços de indentação
```

### Replacer Parameter

**Replacer como array (whitelist):**

```javascript
const user = {
    name: 'Alice',
    age: 30,
    password: 'secret123',
    email: 'alice@example.com'
};

// Incluir apenas 'name' e 'email'
const json = JSON.stringify(user, ['name', 'email']);
console.log(json);
// '{"name":"Alice","email":"alice@example.com"}'

// 'age' e 'password' omitidos
```

**Replacer como função (transformer):**

```javascript
const user = {
    name: 'Alice',
    age: 30,
    salary: 50000
};

// Replacer function: (key, value) => transformedValue
const json = JSON.stringify(user, (key, value) => {
    // Primeira chamada: key === '' (root object)
    if (key === '') return value;
    
    // Ocultar salary
    if (key === 'salary') return undefined;  // Omitir
    
    // Uppercasear strings
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    
    return value;
});

console.log(json);
// '{"name":"ALICE","age":30}'
```

**Replacer - ordem de execução:**

```javascript
const obj = {
    a: {
        b: {
            c: 1
        }
    }
};

JSON.stringify(obj, (key, value) => {
    console.log('Key:', key, 'Value:', value);
    return value;
});

// Output:
// Key:  Value: { a: { b: { c: 1 } } }  (root)
// Key: a Value: { b: { c: 1 } }
// Key: b Value: { c: 1 }
// Key: c Value: 1

// Ordem: depth-first (profundidade primeiro)
```

**Replacer - modificar valores:**

```javascript
const data = {
    name: 'Alice',
    age: 30,
    createdAt: new Date('2024-01-15')
};

const json = JSON.stringify(data, (key, value) => {
    // Converter Date para timestamp
    if (value instanceof Date) {
        return value.getTime();
    }
    
    return value;
});

console.log(json);
// '{"name":"Alice","age":30,"createdAt":1705276800000}'
```

### Space Parameter

**Space como number (quantidade de espaços):**

```javascript
const obj = { name: 'Alice', age: 30 };

// 2 espaços
console.log(JSON.stringify(obj, null, 2));
// {
//   "name": "Alice",
//   "age": 30
// }

// 4 espaços
console.log(JSON.stringify(obj, null, 4));
// {
//     "name": "Alice",
//     "age": 30
// }

// Máximo: 10 espaços (values > 10 truncados para 10)
console.log(JSON.stringify(obj, null, 100));  // Usa 10 espaços
```

**Space como string (custom indentation):**

```javascript
const obj = { name: 'Alice', age: 30 };

// Tabs
console.log(JSON.stringify(obj, null, '\t'));
// {
// 	"name": "Alice",
// 	"age": 30
// }

// Custom string (máximo 10 caracteres)
console.log(JSON.stringify(obj, null, '>>>'));
// {
// >>>"name": "Alice",
// >>>"age": 30
// }

// Mais de 10 caracteres → truncado para 10
JSON.stringify(obj, null, '12345678901234');  // Usa '1234567890'
```

### Tipos Primitivos

**String escaping:**

```javascript
// Caracteres especiais escapados
JSON.stringify('Hello\nWorld');
// '"Hello\\nWorld"'

JSON.stringify('Tab\there');
// '"Tab\\there"'

JSON.stringify('Quote: "test"');
// '"Quote: \\"test\\""'

JSON.stringify('Backslash: \\');
// '"Backslash: \\\\"'

// Unicode escape
JSON.stringify('\u0000');
// '"\\u0000"'
```

**Numbers:**

```javascript
JSON.stringify(42);        // '42'
JSON.stringify(3.14);      // '3.14'
JSON.stringify(-10);       // '-10'
JSON.stringify(0);         // '0'

// Especiais → null
JSON.stringify(NaN);       // 'null'
JSON.stringify(Infinity);  // 'null'
JSON.stringify(-Infinity); // 'null'
```

**Booleans e null:**

```javascript
JSON.stringify(true);   // 'true'
JSON.stringify(false);  // 'false'
JSON.stringify(null);   // 'null'
```

### Objects

**Plain objects:**

```javascript
const obj = {
    name: 'Alice',
    age: 30,
    active: true,
    address: null
};

JSON.stringify(obj);
// '{"name":"Alice","age":30,"active":true,"address":null}'
```

**Nested objects:**

```javascript
const user = {
    name: 'Alice',
    profile: {
        bio: 'Developer',
        skills: ['JS', 'React']
    }
};

JSON.stringify(user, null, 2);
// {
//   "name": "Alice",
//   "profile": {
//     "bio": "Developer",
//     "skills": [
//       "JS",
//       "React"
//     ]
//   }
// }
```

**Property order (não garantida):**

```javascript
const obj = { z: 1, a: 2, m: 3 };

// Ordem pode variar entre engines
JSON.stringify(obj);
// Pode ser: '{"z":1,"a":2,"m":3}'
// Ou:       '{"a":2,"m":3,"z":1}'

// ⚠️ Não confie em ordem de propriedades!
```

**Non-enumerable properties (ignoradas):**

```javascript
const obj = { visible: true };

Object.defineProperty(obj, 'hidden', {
    value: 'secret',
    enumerable: false
});

JSON.stringify(obj);
// '{"visible":true}'

// 'hidden' omitido (não enumerável)
```

**Symbol keys (ignorados):**

```javascript
const obj = {
    name: 'Alice',
    [Symbol('id')]: 123
};

JSON.stringify(obj);
// '{"name":"Alice"}'

// Symbol key ignorado
```

**undefined values (omitidos):**

```javascript
const obj = {
    name: 'Alice',
    age: undefined,
    active: true
};

JSON.stringify(obj);
// '{"name":"Alice","active":true}'

// 'age' omitido (valor undefined)
```

**Functions (omitidas):**

```javascript
const obj = {
    name: 'Alice',
    greet: function() { console.log('Hi'); },
    age: 30
};

JSON.stringify(obj);
// '{"name":"Alice","age":30}'

// 'greet' omitido (função)
```

### Arrays

**Basic arrays:**

```javascript
JSON.stringify([1, 2, 3]);
// '[1,2,3]'

JSON.stringify(['a', 'b', 'c']);
// '["a","b","c"]'
```

**Mixed types:**

```javascript
JSON.stringify([1, 'text', true, null]);
// '[1,"text",true,null]'
```

**Nested arrays:**

```javascript
JSON.stringify([[1, 2], [3, 4]]);
// '[[1,2],[3,4]]'
```

**Arrays com undefined/function/Symbol → null:**

```javascript
JSON.stringify([1, undefined, 3]);
// '[1,null,3]'

JSON.stringify([1, function() {}, 3]);
// '[1,null,3]'

JSON.stringify([1, Symbol('id'), 3]);
// '[1,null,3]'

// ⚠️ undefined/function/Symbol viram null em arrays
// (diferente de objects onde são omitidos)
```

**Sparse arrays:**

```javascript
const arr = [1, 2];
arr[5] = 5;

JSON.stringify(arr);
// '[1,2,null,null,null,5]'

// Holes preenchidos com null
```

### toJSON Method

**Custom serialization:**

```javascript
const user = {
    name: 'Alice',
    password: 'secret123',
    
    // Define como este objeto será serializado
    toJSON() {
        return {
            name: this.name
            // password omitido por segurança
        };
    }
};

JSON.stringify(user);
// '{"name":"Alice"}'

// toJSON() controla serialização
```

**Date usa toJSON internamente:**

```javascript
const date = new Date('2024-01-15T10:30:00Z');

// Date.prototype.toJSON() retorna ISO string
console.log(date.toJSON());
// "2024-01-15T10:30:00.000Z"

JSON.stringify(date);
// '"2024-01-15T10:30:00.000Z"'

// toJSON() chamado automaticamente
```

**toJSON com nested objects:**

```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.createdAt = new Date();
    }
    
    toJSON() {
        return {
            name: this.name,
            age: this.age,
            created: this.createdAt.toISOString()
        };
    }
}

const person = new Person('Alice', 30);

JSON.stringify(person, null, 2);
// {
//   "name": "Alice",
//   "age": 30,
//   "created": "2024-01-15T10:30:00.000Z"
// }
```

### Circular References

**Erro com referências circulares:**

```javascript
const obj = { name: 'Alice' };
obj.self = obj;  // Referência circular!

try {
    JSON.stringify(obj);
} catch (e) {
    console.log(e.message);
    // TypeError: Converting circular structure to JSON
}

// ❌ JSON não suporta referências circulares
```

**Arrays com referências circulares:**

```javascript
const arr = [1, 2];
arr.push(arr);  // Circular!

try {
    JSON.stringify(arr);
} catch (e) {
    console.log(e.message);
    // TypeError: Converting circular structure to JSON
}
```

**Workaround com replacer:**

```javascript
const seen = new WeakSet();

const obj = { name: 'Alice' };
obj.self = obj;

const json = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
            return '[Circular]';  // Marcar circular
        }
        seen.add(value);
    }
    return value;
});

console.log(json);
// '{"name":"Alice","self":"[Circular]"}'
```

### Use Cases Práticos

**1. API Communication:**

```javascript
// Enviar dados para servidor
const user = {
    name: 'Alice',
    email: 'alice@example.com'
};

fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
});
```

**2. LocalStorage:**

```javascript
// Armazenar objeto complexo
const state = {
    user: { name: 'Alice', id: 123 },
    preferences: { theme: 'dark' }
};

localStorage.setItem('appState', JSON.stringify(state));

// Recuperar
const stored = JSON.parse(localStorage.getItem('appState'));
console.log(stored.user.name);  // "Alice"
```

**3. Logging:**

```javascript
const data = {
    timestamp: Date.now(),
    level: 'error',
    message: 'Something went wrong',
    context: { userId: 123, action: 'login' }
};

console.log(JSON.stringify(data, null, 2));
// Output formatado para debugging
```

**4. Deep Clone (limitado):**

```javascript
const original = {
    name: 'Alice',
    age: 30,
    address: { city: 'NYC' }
};

// Clone via JSON (apenas plain data)
const clone = JSON.parse(JSON.stringify(original));

console.log(clone);
// { name: 'Alice', age: 30, address: { city: 'NYC' } }

console.log(clone !== original);  // true (cópia profunda)
console.log(clone.address !== original.address);  // true

// ⚠️ Perde funções, Dates viram strings, etc.
```

**5. Data Export:**

```javascript
const data = [
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 }
];

// Exportar para arquivo JSON
const jsonStr = JSON.stringify(data, null, 2);
const blob = new Blob([jsonStr], { type: 'application/json' });
const url = URL.createObjectURL(blob);

// Criar link de download
const a = document.createElement('a');
a.href = url;
a.download = 'data.json';
a.click();
```

**6. Pretty Print:**

```javascript
const complexData = {
    users: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
    ],
    meta: { total: 2 }
};

console.log(JSON.stringify(complexData, null, 2));
// {
//   "users": [
//     {
//       "id": 1,
//       "name": "Alice"
//     },
//     {
//       "id": 2,
//       "name": "Bob"
//     }
//   ],
//   "meta": {
//     "total": 2
//   }
// }
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar JSON.stringify()

**Use quando:**

1. **API requests:** Enviar dados via HTTP
2. **Storage:** Persistir em localStorage/sessionStorage
3. **Logging:** Converter objetos para strings
4. **Serialization:** Armazenar estado de aplicação
5. **Data export:** Exportar dados para arquivos

**Exemplos:**

```javascript
// 1. API
fetch('/api', { body: JSON.stringify(data) });

// 2. Storage
localStorage.setItem('key', JSON.stringify(obj));

// 3. Logging
console.log(JSON.stringify(error, null, 2));

// 4. Serialization
const state = JSON.stringify(store.getState());

// 5. Export
downloadFile(JSON.stringify(data), 'data.json');
```

### Quando NÃO Usar

**Evite quando:**

1. **Funções:** Precisa preservar functions
2. **Dates:** Precisa preservar tipo Date (não string)
3. **Special types:** Map, Set, RegExp, etc.
4. **Circular refs:** Estruturas circulares
5. **Large data:** Muito dados (performance)

**Alternativas:**

```javascript
// 1. Funções → serialização customizada
// 2. Dates → usar replacer/reviver
// 3. Special types → implementar toJSON()
// 4. Circular → usar biblioteca (flatted, circular-json)
// 5. Large data → stream processing, chunking
```

---

## ⚠️ Limitações e Considerações Teóricas

### Tipos Não Suportados

```javascript
// BigInt → TypeError
try {
    JSON.stringify(123n);
} catch (e) {
    console.log(e.message);  // Do not know how to serialize a BigInt
}

// Symbol → ignorado em objects, null em arrays
JSON.stringify({ s: Symbol() });  // '{}'
JSON.stringify([Symbol()]);       // '[null]'

// Function → ignorado em objects, null em arrays
JSON.stringify({ fn() {} });  // '{}'
JSON.stringify([() => {}]);   // '[null]'

// undefined → ignorado em objects, null em arrays
JSON.stringify({ u: undefined });  // '{}'
JSON.stringify([undefined]);       // '[null]'
```

### Loss of Type Information

```javascript
const original = {
    date: new Date('2024-01-15'),
    regex: /test/,
    map: new Map([['a', 1]]),
    set: new Set([1, 2, 3])
};

const json = JSON.stringify(original);
console.log(json);
// '{"date":"2024-01-15T00:00:00.000Z","regex":{},"map":{},"set":{}}'

const parsed = JSON.parse(json);
console.log(parsed.date instanceof Date);  // false (é string!)
console.log(parsed.regex instanceof RegExp);  // false (é {})
```

### Circular References

```javascript
const obj = {};
obj.circular = obj;

// ❌ TypeError
try {
    JSON.stringify(obj);
} catch (e) {
    console.log('Circular reference error');
}

// Solução: usar biblioteca ou replacer custom
```

### Performance

```javascript
// JSON.stringify() pode ser lento com:
// - Objetos muito grandes
// - Estruturas profundamente aninhadas
// - Muitas propriedades

// Benchmark conceptual:
const huge = Array(100000).fill({ name: 'test', age: 30 });

console.time('stringify');
JSON.stringify(huge);
console.timeEnd('stringify');  // ~100-500ms

// Considerar streaming para datasets grandes
```

### Property Order

```javascript
// Ordem de propriedades não garantida
const obj = { z: 1, a: 2, m: 3 };

// Pode variar entre engines
JSON.stringify(obj);

// ⚠️ Não confie em ordem!
// Use arrays se ordem importa: [{key: 'z', value: 1}, ...]
```

---

## 🔗 Interconexões Conceituais

### Relação com JSON.parse()

```javascript
// JSON.stringify() ⇄ JSON.parse() (inversos)

const obj = { name: 'Alice', age: 30 };

// Stringify: object → string
const json = JSON.stringify(obj);
console.log(json);  // '{"name":"Alice","age":30}'

// Parse: string → object
const parsed = JSON.parse(json);
console.log(parsed);  // { name: 'Alice', age: 30 }
```

### Relação com toJSON()

```javascript
// toJSON() customiza JSON.stringify()
const obj = {
    toJSON() {
        return 'custom';
    }
};

JSON.stringify(obj);  // '"custom"'
```

### Relação com Replacer/Reviver

```javascript
// Replacer (stringify) ⇄ Reviver (parse)

// Stringify com replacer
const json = JSON.stringify(
    { date: new Date() },
    (k, v) => v instanceof Date ? v.getTime() : v
);

// Parse com reviver
const parsed = JSON.parse(
    json,
    (k, v) => k === 'date' ? new Date(v) : v
);
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. **JSON.stringify()** (você está aqui)
2. **JSON.parse()** (próximo - deserialização)
3. **Custom serialization** (toJSON, replacer/reviver)

### Preparação para JSON.parse()

JSON.parse() é **inverso** de JSON.stringify():

```javascript
// Stringify: JS → JSON string
const json = JSON.stringify({ name: 'Alice' });
// '{"name":"Alice"}'

// Parse: JSON string → JS
const obj = JSON.parse(json);
// { name: 'Alice' }

// Round-trip
const original = { name: 'Alice', age: 30 };
const roundTrip = JSON.parse(JSON.stringify(original));
console.log(roundTrip);  // { name: 'Alice', age: 30 }
```

Próximo: **JSON.parse()** detalhado com reviver parameter, error handling, security.

---

## 📚 Conclusão

**JSON.stringify()** é método para **serializar** valores JavaScript em **strings JSON**, essencial para **API communication**, **storage** e **data interchange**.

**Conceitos essenciais:**

- **Sintaxe:** `JSON.stringify(value, replacer, space)`
- **Serialização:** Converte JS → JSON string
- **Tipos suportados:** Object, Array, string, number, boolean, null
- **Tipos ignorados:** function, undefined, Symbol (em objects)
- **Arrays:** undefined/function/Symbol → `null`
- **Replacer array:** Whitelist de propriedades
- **Replacer function:** `(key, value) => transformedValue`
- **Space number:** Quantidade de espaços (max 10)
- **Space string:** Custom indentation (max 10 chars)
- **toJSON method:** Customizar serialização
- **Date:** Converte para ISO 8601 string via `.toJSON()`
- **NaN/Infinity:** Convertidos para `null`
- **BigInt:** Lança TypeError
- **Circular references:** Lança TypeError
- **Non-enumerable:** Ignoradas
- **Symbol keys:** Ignorados
- **Property order:** Não garantida

**Type handling:**
- Primitivos → serialização direta
- Objects → apenas enumeráveis, omite undefined/function
- Arrays → todos elementos, undefined/function/Symbol → `null`
- Date → ISO string
- RegExp/Map/Set → `{}`

**Use cases:**
- API requests (POST/PUT bodies)
- LocalStorage persistence
- Logging/debugging
- State serialization
- Data export
- Deep clone (com limitações)

**Limitações:**
- Circular references causam TypeError
- Perde type information (Date → string)
- BigInt não suportado
- Performance com grandes datasets

Dominar JSON.stringify() é essencial para **API communication**, **data persistence** e **interoperabilidade** em JavaScript moderno!
