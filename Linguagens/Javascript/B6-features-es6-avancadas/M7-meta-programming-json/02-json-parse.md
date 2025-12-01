# JSON.parse(): Desserialização de JSON para JavaScript

## 🎯 Introdução e Definição

### Definição Conceitual

**JSON.parse()** é um método global do JavaScript que **converte string JSON para valores JavaScript**, realizando **desserialização** (parsing), permitindo **receber dados** de APIs, **recuperar de localStorage**, e **transformar valores** durante parsing com **reviver function**.

**Sintaxe:**

```javascript
JSON.parse(text);
JSON.parse(text, reviver);
```

**Parâmetros:**

- **`text`**: String JSON a ser parseada (DEVE ser JSON válido)
- **`reviver`** (opcional): Function `(key, value) => newValue` para transformar valores

**Retorno:** Valor JavaScript correspondente à string JSON

**Exemplo básico:**

```javascript
// String JSON → Objeto
const json = '{"name":"Alice","age":30}';
const obj = JSON.parse(json);

console.log(obj);         // { name: 'Alice', age: 30 }
console.log(obj.name);    // "Alice"
console.log(typeof obj);  // "object"

// String JSON → Array
const jsonArr = '[1,2,3,"hello",true]';
const arr = JSON.parse(jsonArr);

console.log(arr);  // [1, 2, 3, "hello", true]
console.log(arr[0]);  // 1

// String JSON → Primitivo
console.log(JSON.parse('42'));        // 42 (number)
console.log(JSON.parse('"hello"'));   // "hello" (string)
console.log(JSON.parse('true'));      // true (boolean)
console.log(JSON.parse('null'));      // null
```

### Características Fundamentais

**JSON.parse():**

- **Desserializa strings:** JSON string → JavaScript value
- **Valida JSON:** Lança SyntaxError se inválido
- **Reviver function:** Transformar valores durante parsing
- **Tipos convertidos:** String → Object, Array, primitivos
- **Strict syntax:** JSON DEVE ser válido (aspas duplas, sem trailing commas, etc)
- **Performance:** Otimizado nativamente (C++ no V8)

### JSON String Válida: Requisitos

**JSON válido:**

```json
{
  "name": "Alice",
  "age": 30,
  "active": true,
  "address": {
    "city": "São Paulo"
  },
  "hobbies": ["reading", "coding"]
}
```

**Regras estritas:**

```
1. Keys SEMPRE entre aspas DUPLAS
   ✅ {"name": "Alice"}
   ❌ {name: "Alice"}        (sem aspas)
   ❌ {'name': 'Alice'}      (aspas simples)

2. Strings SEMPRE aspas DUPLAS
   ✅ "hello"
   ❌ 'hello'                (aspas simples)

3. SEM trailing commas
   ✅ {"a": 1, "b": 2}
   ❌ {"a": 1, "b": 2,}      (trailing comma)

4. SEM comments
   ❌ {"a": 1 /* comment */}

5. Tipos permitidos:
   - String: "text"
   - Number: 42, 3.14
   - Boolean: true, false
   - null
   - Object: {"key": "value"}
   - Array: [1, 2, 3]

6. Tipos NÃO permitidos:
   - undefined
   - Function
   - Symbol
   - Date (deve ser string ISO)
   - NaN, Infinity (devem ser null)
```

### Contexto Histórico e Motivação

**Problema pré-ES5:** Parsing com `eval()` (inseguro)

```javascript
// ❌ ES3/ES4: eval() para parsing (PERIGOSO!)
const jsonString = '{"name":"Alice"}';
const obj = eval('(' + jsonString + ')');

// ⚠️ PROBLEMA: eval() executa QUALQUER código JavaScript!
const malicious = '{"name":"Alice", "evil": alert("XSS Attack!")}';
// eval() executaria alert()!

// ❌ Vulnerabilidade de segurança crítica
```

**ES5 (2009):** `JSON.parse()` nativo e seguro

```javascript
// ✅ JSON.parse() seguro (apenas parsing, sem execução)
const json = '{"name":"Alice"}';
const obj = JSON.parse(json);

// ✅ SyntaxError se inválido (não executa código)
try {
    JSON.parse('alert("hack")');
} catch (e) {
    console.log('JSON inválido - seguro!');
}
```

**Motivações principais:**

1. **Segurança:** Eliminar `eval()` inseguro
2. **Validação:** Garantir JSON válido
3. **Performance:** Implementação nativa otimizada
4. **Standardização:** Spec clara e consistente
5. **Interoperabilidade:** Mesmo comportamento em todas engines

### Problema Fundamental que Resolve

**Problema:** Como **converter string JSON recebida de API/storage** para **objetos JavaScript manipuláveis**?

**Cenário real - receber dados de API:**

```javascript
// API retorna JSON string
const response = await fetch('https://api.example.com/user/1');
const jsonText = await response.text();

console.log(jsonText);
// '{"id":1,"name":"Alice","email":"alice@example.com"}'

console.log(typeof jsonText);  // "string"

// ❌ String não é manipulável como objeto
// console.log(jsonText.name);  // undefined (string não tem .name!)

// ✅ JSON.parse() converte para objeto
const user = JSON.parse(jsonText);

console.log(user.name);   // "Alice"
console.log(user.email);  // "alice@example.com"
console.log(typeof user); // "object"

// Agora podemos manipular
user.name = 'Alice Smith';
```

**Cenário real - recuperar de localStorage:**

```javascript
// Dados foram salvos como JSON string
const jsonString = localStorage.getItem('settings');

console.log(jsonString);
// '{"theme":"dark","fontSize":14,"notifications":true}'

// ❌ String não é manipulável
// if (jsonString.theme === 'dark') {}  // ❌ não funciona

// ✅ Parse para objeto
const settings = JSON.parse(jsonString);

console.log(settings.theme);  // "dark"

if (settings.theme === 'dark') {
    // Aplicar tema dark
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Desserialização:** JSON string → JavaScript value
2. **Validação:** SyntaxError se JSON inválido
3. **Reviver function:** Transformação durante parsing
4. **Tipos convertidos:** Object, Array, String, Number, Boolean, null
5. **Strict parsing:** Segue spec JSON rigorosamente

### Pilares Fundamentais

- **`JSON.parse(text)`:** Parsing básico
- **`JSON.parse(text, reviver)`:** Parsing com transformação
- **SyntaxError:** Lançado se JSON inválido
- **Tipos suportados:** Subset do JavaScript
- **Performance:** Nativo e otimizado

### Visão Geral das Nuances

- **JSON strict:** Aspas duplas obrigatórias, sem trailing commas
- **Date handling:** Strings ISO precisam ser convertidas manualmente
- **Number precision:** Pode perder precisão em números muito grandes
- **Unicode:** Suporta caracteres unicode via `\uXXXX`
- **Whitespace:** Ignorado (espaços, tabs, newlines)

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

**Processo de parsing:**

```
1. Validar sintaxe JSON
   - Verificar aspas duplas
   - Verificar estrutura (brackets, braces)
   - Verificar trailing commas (erro se existir)
   
2. Tokenização
   - Dividir string em tokens
   - Identificar tipos (string, number, boolean, null, {, }, [, ], :, ,)
   
3. Parsing recursivo
   - Construir árvore de valores
   - Object: criar {} e adicionar propriedades
   - Array: criar [] e adicionar elementos
   - Primitivos: converter para tipo JavaScript
   
4. Aplicar reviver (se fornecido)
   - Chamar reviver(key, value) para cada propriedade
   - Bottom-up (folhas primeiro, root por último)
   
5. Retornar valor JavaScript resultante
```

**Implementação conceitual simplificada:**

```javascript
// Pseudo-código (simplificado)
function parseJSON(text) {
    // 1. Validar sintaxe
    if (!isValidJSON(text)) {
        throw new SyntaxError('Unexpected token');
    }
    
    // 2. Tokenize
    const tokens = tokenize(text);
    
    // 3. Parse recursivamente
    function parseValue(tokens) {
        const token = tokens.next();
        
        if (token === '{') return parseObject(tokens);
        if (token === '[') return parseArray(tokens);
        if (token === '"') return parseString(tokens);
        if (isNumber(token)) return parseNumber(token);
        if (token === 'true') return true;
        if (token === 'false') return false;
        if (token === 'null') return null;
        
        throw new SyntaxError('Unexpected token');
    }
    
    return parseValue(tokens);
}
```

### Tipos de Dados Convertidos

**String → String:**

```javascript
JSON.parse('"hello"');           // "hello"
JSON.parse('"hello\\nworld"');   // "hello\nworld" (newline)
JSON.parse('"say \\"hi\\""');    // 'say "hi"' (aspas escapadas)
JSON.parse('"\\u0048ello"');     // "Hello" (unicode)
```

**String → Number:**

```javascript
JSON.parse('42');       // 42
JSON.parse('3.14');     // 3.14
JSON.parse('-10');      // -10
JSON.parse('1e10');     // 10000000000 (notação científica)
JSON.parse('0.1');      // 0.1

// ❌ NaN, Infinity não são JSON válido
// JSON.parse('NaN');      // SyntaxError
// JSON.parse('Infinity'); // SyntaxError
```

**String → Boolean:**

```javascript
JSON.parse('true');   // true
JSON.parse('false');  // false
```

**String → null:**

```javascript
JSON.parse('null');  // null
```

**String → Object:**

```javascript
const json = '{"name":"Alice","age":30}';
const obj = JSON.parse(json);

console.log(obj);  // { name: 'Alice', age: 30 }
console.log(obj.name);  // "Alice"

// Nested objects
const nested = '{"user":{"name":"Bob","address":{"city":"NYC"}}}';
const obj2 = JSON.parse(nested);

console.log(obj2.user.address.city);  // "NYC"
```

**String → Array:**

```javascript
const json = '[1,2,3,"hello",true,null]';
const arr = JSON.parse(json);

console.log(arr);  // [1, 2, 3, "hello", true, null]
console.log(arr[0]);  // 1

// Nested arrays
const nested = '[[1,2],[3,4]]';
const arr2 = JSON.parse(nested);

console.log(arr2[0][1]);  // 2
```

---

## 🔍 Análise Conceitual Profunda

### Uso Básico

**Parse objeto:**

```javascript
const json = '{"name":"Alice","age":30,"active":true}';
const user = JSON.parse(json);

console.log(user.name);    // "Alice"
console.log(user.age);     // 30
console.log(user.active);  // true
```

**Parse array:**

```javascript
const json = '[1,2,3,4,5]';
const numbers = JSON.parse(json);

console.log(numbers);       // [1, 2, 3, 4, 5]
console.log(numbers.length); // 5
```

**Parse valores complexos:**

```javascript
const json = `{
    "users": [
        {"id": 1, "name": "Alice"},
        {"id": 2, "name": "Bob"}
    ],
    "total": 2,
    "page": 1
}`;

const data = JSON.parse(json);

console.log(data.users[0].name);  // "Alice"
console.log(data.total);          // 2
```

### Parâmetro `reviver` - Transformar Valores

**Reviver function:** `(key, value) => newValue`

```javascript
const json = '{"name":"Alice","age":30}';

// Transformar valores durante parsing
const obj = JSON.parse(json, (key, value) => {
    console.log(`Key: "${key}", Value:`, value);
    
    // Transformar strings para uppercase
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    
    return value;
});

// Saída:
// Key: "name", Value: Alice
// Key: "age", Value: 30
// Key: "", Value: { name: 'ALICE', age: 30 }

console.log(obj.name);  // "ALICE" (uppercase!)
```

**Converter Date strings:**

```javascript
const json = '{"name":"Alice","createdAt":"2025-11-13T10:00:00.000Z"}';

// Sem reviver: createdAt é string
const obj1 = JSON.parse(json);
console.log(obj1.createdAt);  // "2025-11-13T10:00:00.000Z" (string)
console.log(obj1.createdAt instanceof Date);  // false

// Com reviver: converter para Date
const obj2 = JSON.parse(json, (key, value) => {
    if (key === 'createdAt') {
        return new Date(value);  // String → Date
    }
    return value;
});

console.log(obj2.createdAt);  // Date object
console.log(obj2.createdAt instanceof Date);  // true
console.log(obj2.createdAt.getFullYear());   // 2025
```

**Filtrar propriedades:**

```javascript
const json = '{"id":1,"name":"Alice","password":"secret","role":"admin"}';

// Omitir password
const obj = JSON.parse(json, (key, value) => {
    if (key === 'password') {
        return undefined;  // Omite propriedade
    }
    return value;
});

console.log(obj);  // { id: 1, name: 'Alice', role: 'admin' }
// password omitido!
```

**Validação durante parsing:**

```javascript
const json = '{"age":-5}';

const obj = JSON.parse(json, (key, value) => {
    if (key === 'age' && value < 0) {
        throw new Error('Age cannot be negative');
    }
    return value;
});

// Error: Age cannot be negative
```

**Ordem de chamadas (bottom-up):**

```javascript
const json = '{"a":1,"b":{"c":2}}';

JSON.parse(json, (key, value) => {
    console.log(`Key: "${key}"`);
    return value;
});

// Saída (bottom-up):
// Key: "a"     (folha)
// Key: "c"     (folha nested)
// Key: "b"     (objeto nested)
// Key: ""      (root object) - SEMPRE por último
```

### Error Handling - SyntaxError

**JSON inválido lança SyntaxError:**

```javascript
// ❌ Keys sem aspas
try {
    JSON.parse('{name: "Alice"}');
} catch (e) {
    console.log(e.message);
    // "Unexpected token n in JSON at position 1"
}

// ❌ Aspas simples
try {
    JSON.parse("{'name': 'Alice'}");
} catch (e) {
    console.log(e.message);
    // "Unexpected token ' in JSON at position 1"
}

// ❌ Trailing comma
try {
    JSON.parse('{"name":"Alice",}');
} catch (e) {
    console.log(e.message);
    // "Unexpected token } in JSON at position 17"
}

// ❌ undefined não é JSON válido
try {
    JSON.parse('undefined');
} catch (e) {
    console.log(e.message);
    // "Unexpected token u in JSON at position 0"
}

// ❌ Comentários não permitidos
try {
    JSON.parse('{"name":"Alice" /* comment */}');
} catch (e) {
    console.log(e.message);
    // SyntaxError
}
```

**Validação robusta:**

```javascript
function safeJSONParse(text, fallback = null) {
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error('JSON parsing failed:', e.message);
        return fallback;
    }
}

const result1 = safeJSONParse('{"name":"Alice"}');
console.log(result1);  // { name: 'Alice' }

const result2 = safeJSONParse('invalid json', { error: true });
console.log(result2);  // { error: true }
```

**Validar antes de parsear:**

```javascript
function isValidJSON(text) {
    try {
        JSON.parse(text);
        return true;
    } catch (e) {
        return false;
    }
}

console.log(isValidJSON('{"name":"Alice"}'));  // true
console.log(isValidJSON('{name: "Alice"}'));   // false
console.log(isValidJSON('undefined'));         // false
```

### Edge Cases e Nuances

**Whitespace ignorado:**

```javascript
const json1 = '{"name":"Alice"}';
const json2 = `{
    "name"  :  "Alice"
}`;
const json3 = '{\n\t"name"\n:\n"Alice"\n}';

// Todos parseiam para mesmo resultado
console.log(JSON.parse(json1));  // { name: 'Alice' }
console.log(JSON.parse(json2));  // { name: 'Alice' }
console.log(JSON.parse(json3));  // { name: 'Alice' }
```

**Number precision:**

```javascript
// Números muito grandes podem perder precisão
const json = '{"bigNum":12345678901234567890}';
const obj = JSON.parse(json);

console.log(obj.bigNum);
// 12345678901234567000 (perda de precisão!)

// JavaScript numbers são IEEE 754 double (53 bits de precisão)

// ✅ Para números grandes: usar string
const json2 = '{"bigNum":"12345678901234567890"}';
const obj2 = JSON.parse(json2);
console.log(obj2.bigNum);  // "12345678901234567890" (string preserva)
```

**Unicode characters:**

```javascript
// Unicode escapado
const json = '{"text":"\\u0048ello \\u4E16\\u754C"}';
const obj = JSON.parse(json);

console.log(obj.text);  // "Hello 世界"

// Unicode direto (também funciona)
const json2 = '{"text":"Hello 世界"}';
const obj2 = JSON.parse(json2);
console.log(obj2.text);  // "Hello 世界"
```

**Empty strings e valores:**

```javascript
JSON.parse('""');       // "" (empty string)
JSON.parse('0');        // 0
JSON.parse('false');    // false
JSON.parse('null');     // null
JSON.parse('{}');       // {} (empty object)
JSON.parse('[]');       // [] (empty array)

// ❌ Empty string não é JSON válido para objeto
// JSON.parse('');  // SyntaxError: Unexpected end of JSON input
```

**Duplicate keys:**

```javascript
// JSON com keys duplicadas
const json = '{"name":"Alice","name":"Bob"}';
const obj = JSON.parse(json);

console.log(obj.name);  // "Bob" (último valor prevalece)

// ⚠️ JSON spec não define comportamento (implementation-dependent)
// Mas engines modernas usam último valor
```

### Use Cases Práticos

**1. Receber dados de API:**

```javascript
// fetch retorna Response
const response = await fetch('https://api.example.com/users/1');

// .json() método usa JSON.parse() internamente
const user = await response.json();

console.log(user.name);  // "Alice"

// Equivalente manual:
const text = await response.text();
const user2 = JSON.parse(text);
```

**2. Recuperar de localStorage:**

```javascript
// Salvar
const settings = { theme: 'dark', fontSize: 14 };
localStorage.setItem('settings', JSON.stringify(settings));

// Recuperar
const json = localStorage.getItem('settings');
const parsed = JSON.parse(json);

console.log(parsed.theme);  // "dark"

// Com fallback
function getSettings() {
    try {
        const json = localStorage.getItem('settings');
        return json ? JSON.parse(json) : { theme: 'light', fontSize: 12 };
    } catch (e) {
        return { theme: 'light', fontSize: 12 };  // Fallback se parsing falhar
    }
}
```

**3. WebSocket messages:**

```javascript
const ws = new WebSocket('wss://example.com/socket');

ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
            showNotification(data.message);
        }
    } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
    }
};
```

**4. Configuration files:**

```javascript
// Carregar config.json
const response = await fetch('/config.json');
const config = await response.json();

console.log(config.apiBaseUrl);
console.log(config.features.darkMode);
```

**5. Deep cloning:**

```javascript
const original = {
    name: 'Alice',
    address: { city: 'São Paulo' },
    hobbies: ['reading', 'coding']
};

// Deep clone via JSON (com limitações)
const clone = JSON.parse(JSON.stringify(original));

clone.address.city = 'Rio';
console.log(original.address.city);  // "São Paulo" (não afetado)

// ⚠️ Limitações:
// - Functions perdidas
// - Dates viram strings
// - undefined perdido
// - Circular refs: TypeError
```

**6. Validação de input:**

```javascript
function validateUserInput(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        // Validar estrutura
        if (!data.name || !data.email) {
            throw new Error('Missing required fields');
        }
        
        // Validar tipos
        if (typeof data.name !== 'string') {
            throw new Error('Name must be string');
        }
        
        return data;
    } catch (e) {
        throw new Error(`Invalid input: ${e.message}`);
    }
}

const valid = validateUserInput('{"name":"Alice","email":"alice@example.com"}');
// { name: 'Alice', email: 'alice@example.com' }

// const invalid = validateUserInput('{name: "Alice"}');
// Error: Invalid input: Unexpected token n in JSON at position 1
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar JSON.parse()

**Use quando:**

1. **Receber de API:** Response body JSON
2. **localStorage/sessionStorage:** Recuperar objetos
3. **WebSocket:** Parse messages
4. **Configuration:** Carregar configs JSON
5. **Deep clone:** Clone simples (com limitações)
6. **Data transformation:** Com reviver function

**Exemplos:**

```javascript
// 1. API
const data = await response.json();

// 2. localStorage
const obj = JSON.parse(localStorage.getItem('key'));

// 3. WebSocket
const msg = JSON.parse(event.data);

// 4. Config
const config = JSON.parse(configText);

// 5. Clone
const clone = JSON.parse(JSON.stringify(obj));

// 6. Transform
const obj = JSON.parse(json, reviverFunction);
```

### Quando Validar Input

**Sempre validar quando:**

1. **User input:** Nunca confie em input de usuário
2. **External API:** APIs podem mudar schema
3. **localStorage:** Pode estar corrompido
4. **File upload:** Arquivos podem ser maliciosos

```javascript
// ✅ Com validação
function safeLoad(key) {
    try {
        const json = localStorage.getItem(key);
        if (!json) return null;
        
        const data = JSON.parse(json);
        
        // Validar schema
        if (!isValidSchema(data)) {
            throw new Error('Invalid schema');
        }
        
        return data;
    } catch (e) {
        console.error('Load failed:', e);
        return null;
    }
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### JSON Strict Syntax

```javascript
// ❌ Todas causam SyntaxError:

// 1. Keys sem aspas
JSON.parse('{name: "Alice"}');

// 2. Aspas simples
JSON.parse("{'name': 'Alice'}");

// 3. Trailing comma
JSON.parse('{"name":"Alice",}');

// 4. Comments
JSON.parse('{"name":"Alice" /* comment */}');

// 5. undefined
JSON.parse('{"value": undefined}');

// 6. NaN, Infinity
JSON.parse('{"value": NaN}');

// 7. Funções
JSON.parse('{"fn": function() {}}');

// ✅ Sempre usar JSON válido:
JSON.parse('{"name":"Alice"}');
```

### Security Considerations

```javascript
// ✅ JSON.parse() é SEGURO (não executa código)
const userInput = '{"name":"<script>alert(\'XSS\')</script>"}';
const obj = JSON.parse(userInput);

console.log(obj.name);  // "<script>alert('XSS')</script>" (string, não executado)

// ⚠️ MAS: sanitizar output ao renderizar no DOM
// document.body.innerHTML = obj.name;  // ❌ XSS!
// document.body.textContent = obj.name; // ✅ Safe

// ✅ Sempre validar estrutura esperada
function validateUser(data) {
    if (typeof data.name !== 'string') throw new Error('Invalid name');
    if (typeof data.age !== 'number') throw new Error('Invalid age');
    // ...
}
```

### Performance

```javascript
// JSON.parse() é MUITO RÁPIDO (nativo C++)
const largeJSON = '[/* 10000 objects */]';

console.time('parse');
JSON.parse(largeJSON);
console.timeEnd('parse');
// parse: ~1-5ms (exemplo)

// Mais rápido que parsing manual em JavaScript
```

### Data Loss

```javascript
// Tipos não suportados são perdidos no round-trip

const original = {
    fn: function() {},     // Function
    sym: Symbol('s'),      // Symbol
    undef: undefined,      // undefined
    date: new Date(),      // Date → string
    map: new Map([[1,2]])  // Map → {}
};

const json = JSON.stringify(original);
const parsed = JSON.parse(json);

console.log(parsed);
// { date: "2025-11-13T..." }
// fn, sym, undef, map perdidos!
```

---

## 🔗 Interconexões Conceituais

### Relação com JSON.stringify()

```javascript
// Round-trip: stringify → parse
const original = { name: 'Alice', age: 30 };

const json = JSON.stringify(original);
// '{"name":"Alice","age":30}'

const parsed = JSON.parse(json);
// { name: 'Alice', age: 30 }

// ✅ Igual ao original (para tipos suportados)
console.log(JSON.stringify(parsed) === JSON.stringify(original));  // true
```

### Relação com Fetch API

```javascript
// Response.json() usa JSON.parse() internamente
const response = await fetch('/api/user');

// Método conveniente
const user = await response.json();

// Equivalente a:
const text = await response.text();
const user2 = JSON.parse(text);
```

### Relação com localStorage

```javascript
// localStorage + JSON = persistência de objetos

// Save
localStorage.setItem('data', JSON.stringify({ a: 1 }));

// Load
const data = JSON.parse(localStorage.getItem('data'));
```

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

1. JSON.stringify() (anterior)
2. **JSON.parse()** (você está aqui)
3. **Custom serialization** (próximo - toJSON, revivers patterns)
4. **Meta-programming** (Object.defineProperty, descriptors)

### Preparação para Custom Serialization

**Custom serialization** usa `.toJSON()` e `reviver` para controle fino:

```javascript
// toJSON customizado
class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
    
    toJSON() {
        return { name: this.name };  // Omite password
    }
}

const user = new User('Alice', 'secret');
const json = JSON.stringify(user);
// '{"name":"Alice"}'  (password omitido)

// Reviver customizado para re-hidratar
const parsed = JSON.parse(json, (key, value) => {
    if (value && value.type === 'User') {
        return new User(value.name, '');
    }
    return value;
});
```

Próximo: **Custom Serialization** com patterns avançados de `toJSON()` e `reviver`.

---

## 📚 Conclusão

**JSON.parse()** é o método para **desserializar strings JSON em valores JavaScript**, essencial para **receber dados de APIs**, **recuperar de storage**, e **processar mensagens**.

**Conceitos essenciais:**

- **Sintaxe:** `JSON.parse(text, reviver)`
- **Retorno:** Valor JavaScript (Object, Array, primitivos)
- **Reviver function:** `(key, value) => newValue` para transformação
- **SyntaxError:** Lançado se JSON inválido
- **JSON strict:** Aspas duplas obrigatórias, sem trailing commas, sem comments
- **Tipos convertidos:** Object, Array, String, Number, Boolean, null
- **Tipos não suportados:** undefined, Function, Symbol (causam erro ou são omitidos)
- **Whitespace:** Ignorado durante parsing
- **Unicode:** Suportado via `\uXXXX` ou diretamente
- **Number precision:** Pode perder precisão em números muito grandes
- **Duplicate keys:** Último valor prevalece (implementation-dependent)
- **Reviver order:** Bottom-up (folhas primeiro, root por último)
- **Security:** Seguro (não executa código), mas validar estrutura
- **Performance:** Nativo e otimizado (muito rápido)
- **Use cases:** API responses, localStorage, WebSocket, config files, deep cloning
- **Error handling:** try/catch para SyntaxError
- **Validation:** Sempre validar input externo

**Fluxo conceitual:**

```
JSON String
      ↓
  Validar sintaxe
      ↓
  Tokenizar
      ↓
  Parse recursivo
      ↓
  Aplicar reviver (bottom-up)
      ↓
  JavaScript Value
```

**Comparação stringify vs parse:**

| Operação | stringify() | parse() |
|----------|------------|---------|
| **Direção** | JavaScript → JSON | JSON → JavaScript |
| **Input** | Value | String |
| **Output** | String | Value |
| **Transform** | replacer function/array | reviver function |
| **Format** | space parameter | N/A |
| **Error** | TypeError (circular) | SyntaxError (invalid JSON) |

Dominar `JSON.parse()` é essencial para **data deserialization**, **API integration**, **storage retrieval**, e **message processing** em JavaScript moderno!
