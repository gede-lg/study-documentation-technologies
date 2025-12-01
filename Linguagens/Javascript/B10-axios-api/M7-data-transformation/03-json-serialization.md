# 🎯 Introdução

A serialização automática de JSON representa uma das capacidades mais fundamentais e transparentes do Axios, operando silenciosamente em quase toda comunicação HTTP moderna. Esta funcionalidade automatiza a conversão bidirecional entre objetos JavaScript nativos e strings JSON transmissíveis pela rede, eliminando a necessidade de chamadas manuais a `JSON.stringify()` e `JSON.parse()` que caracterizavam bibliotecas HTTP mais antigas.

O valor desta automação transcende mera conveniência sintática. Serialização manual é propensa a erros sutis: esquecer de stringificar antes do envio resulta em transmissão de `[object Object]`, enquanto falhar em parsear na recepção entrega strings JSON ao código que espera objetos. Pior, inconsistências em serialização - usar `JSON.stringify()` em alguns lugares mas não em outros - criam bugs difíceis de rastrear onde comportamento varia conforme o call site.

Axios resolve estes problemas através de serialização inteligente que detecta tipos de dados e aplica conversão apropriada automaticamente. Quando você passa um objeto JavaScript para `axios.post()`, o Axios reconhece que deve stringificá-lo antes da transmissão. Quando uma resposta chega com `Content-Type: application/json`, o Axios parseia automaticamente a string JSON de volta para objeto JavaScript. Este processo bidirecional acontece de forma transparente, permitindo que desenvolvedores trabalhem exclusivamente com objetos JavaScript nativos.

No entanto, esta automação não é monolítica ou inflexível. Axios expõe pontos de controle que permitem customizar serialização quando necessário: configurar indentação para debugging, implementar custom serializers para tipos especiais (Date, BigInt), ou até substituir completamente o mecanismo de serialização para formatos não-JSON. Compreender tanto o comportamento automático quanto estas possibilidades de customização é essencial para arquiteturas HTTP robustas.

Este módulo explora a serialização JSON do Axios em profundidade, desde os mecanismos internos de detecção de tipos até patterns avançados de customização, preparando desenvolvedores para lidar com cenários desde os mais simples até os mais exóticos.

---

# 📋 Sumário

### **Fundamentos de JSON Serialization**
- Conceito de serialization/deserialization
- Por que JSON é formato dominante em APIs REST
- Papel da serialização no HTTP request/response cycle
- JSON.stringify() e JSON.parse() como primitivas

### **Serialização Automática no Axios**
- Detecção automática de objetos JavaScript
- Quando Axios aplica JSON.stringify()
- Condições para serialização automática
- Tipos de dados que são serializados automaticamente

### **Desserialização Automática**
- Content-Type detection para JSON responses
- JSON.parse() automático em transformResponse
- Handling de JSON malformado
- Configurações transitional (silentJSONParsing)

### **Content-Type Header**
- application/json e sua importância
- Configuração automática pelo Axios
- Override manual de Content-Type
- Casos onde Content-Type é crítico

### **Limitações de JSON.stringify()**
- Tipos não serializáveis (undefined, functions, symbols)
- Perda de prototypes e métodos
- Problemas com Date, RegExp, Map, Set
- Referências circulares

### **Customização de Serialização**
- Implementação de toJSON() em objetos
- Replacer function em JSON.stringify()
- Reviver function em JSON.parse()
- Custom transformers para tipos especiais

### **Casos de Uso Avançados**
- Pretty-printing para debugging
- Serialização de tipos não-JSON (Date, BigInt)
- Handling de deeply nested structures
- Compressão antes da serialização

### **Performance e Best Practices**
- Overhead de serialização em large payloads
- Caching de dados serializados
- Alternativas a JSON (MessagePack, BSON)
- Debugging de problemas de serialização

---

# 🧠 Fundamentos

## Conceito de Serialization e Deserialization

**Serialization** é o processo de converter estruturas de dados complexas (objetos, arrays) em formato sequencial transmissível (string, bytes). **Deserialization** é o processo inverso: converter dados serializados de volta para estruturas de dados utilizáveis.

Em HTTP, esta conversão é necessária porque:
1. **HTTP é protocolo text-based**: Request/response bodies são strings ou bytes
2. **JavaScript trabalha com objetos**: Código manipula estruturas ricas, não strings
3. **Network transport**: Dados precisam ser convertidos para formato que pode ser enviado via TCP/IP

**Exemplo do ciclo completo**:

```javascript
// 1. Objeto JavaScript (in-memory)
const user = { name: 'John', age: 30 };

// 2. Serialization (para transmissão)
const serialized = JSON.stringify(user);
// Result: '{"name":"John","age":30}'

// 3. Network transmission
// String é enviada via HTTP

// 4. Reception no servidor
// String é recebida

// 5. Deserialization (de volta para objeto)
const deserialized = JSON.parse(serialized);
// Result: { name: 'John', age: 30 }
```

Sem serialização, objetos JavaScript não podem ser transmitidos pela rede. Sem desserialização, strings recebidas não podem ser manipuladas como objetos.

## Por Que JSON é Formato Dominante

JSON (JavaScript Object Notation) tornou-se padrão de facto para APIs REST por razões técnicas e históricas:

**1. Native JavaScript Support**: JSON é subconjunto de JavaScript literal syntax. `JSON.parse()` e `JSON.stringify()` são built-in do language, oferecendo parsing/serialization extremamente rápidos.

**2. Human-Readable**: Diferente de formatos binários (Protocol Buffers, MessagePack), JSON é legível por humanos, facilitando debugging e development.

**3. Language Agnostic**: Apesar do nome "JavaScript", JSON tem parsers em praticamente toda linguagem moderna (Python, Ruby, Java, Go, etc.).

**4. Lightweight**: Comparado a XML (padrão anterior), JSON é mais conciso:

```xml
<!-- XML: verbose -->
<user>
  <name>John</name>
  <age>30</age>
</user>
```

```json
// JSON: conciso
{"name":"John","age":30}
```

**5. Type Support**: JSON suporta tipos primitivos (strings, numbers, booleans), arrays, e objetos nested, cobrindo maioria dos casos de uso.

**Trade-offs**: JSON não suporta todos os tipos JavaScript (Date, undefined, functions), não preserva metadata (prototypes, classes), e é menos eficiente que formatos binários para large payloads. Ainda assim, conveniência e ubiquidade superam limitações na maioria dos cenários.

## Papel no HTTP Request/Response Cycle

**Request Flow**:
```
JavaScript Object
  ↓ (JSON.stringify via transformRequest)
JSON String
  ↓ (HTTP POST/PUT)
Network Transmission
  ↓
Server Receives JSON String
  ↓ (Server parses)
Server-Side Object
```

**Response Flow**:
```
Server-Side Object
  ↓ (Server serializes)
JSON String
  ↓ (HTTP Response)
Network Transmission
  ↓
Axios Receives JSON String
  ↓ (JSON.parse via transformResponse)
JavaScript Object
```

Axios automatiza os passos de serialização (client→server) e desserialização (server→client), tornando o processo transparente para desenvolvedores.

## JSON.stringify() e JSON.parse() como Primitivas

Toda serialização JSON em JavaScript, incluindo no Axios, é construída sobre estas duas funções built-in:

**JSON.stringify(value, replacer, space)**:
- `value`: Objeto/array a serializar
- `replacer`: Função ou array para filtrar/transformar propriedades (opcional)
- `space`: Número ou string para indentação pretty-print (opcional)

```javascript
const obj = { name: 'John', age: 30 };

// Basic
JSON.stringify(obj); // '{"name":"John","age":30}'

// Com indentação
JSON.stringify(obj, null, 2);
// '{
//   "name": "John",
//   "age": 30
// }'

// Com replacer
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'number') return String(value);
  return value;
});
// '{"name":"John","age":"30"}' // age vira string
```

**JSON.parse(text, reviver)**:
- `text`: String JSON a parsear
- `reviver`: Função para transformar valores durante parsing (opcional)

```javascript
const json = '{"name":"John","createdAt":"2023-01-01T00:00:00Z"}';

// Basic
JSON.parse(json);
// { name: 'John', createdAt: '2023-01-01T00:00:00Z' }

// Com reviver
JSON.parse(json, (key, value) => {
  if (key === 'createdAt') return new Date(value);
  return value;
});
// { name: 'John', createdAt: Date(2023-01-01) }
```

Axios usa estas primitivas internamente, mas expõe configurações para customizar comportamento.

---

# 🔍 Análise

## Serialização Automática no Axios

Axios detecta automaticamente quando serialização é necessária e aplica `JSON.stringify()` apropriadamente:

**Código interno simplificado do Axios**:
```javascript
// transformRequest default
function(data, headers) {
  // Se data é objeto JavaScript comum
  if (utils.isObject(data) && !utils.isFormData(data) && !utils.isFile(data)) {
    // Define Content-Type
    headers['Content-Type'] = 'application/json;charset=utf-8';
    
    // Serializa para JSON
    return JSON.stringify(data);
  }
  
  // Para outros tipos (FormData, Blob, string), retorna sem modificar
  return data;
}
```

**Condições para serialização automática**:
1. `data` é objeto JavaScript (`typeof data === 'object'`)
2. `data` **não** é `FormData` (usado para uploads)
3. `data` **não** é `File` ou `Blob` (dados binários)
4. `data` **não** é `ArrayBuffer`, `DataView`, etc.

**Exemplos**:

```javascript
// ✅ Serializado automaticamente
axios.post('/api/user', { name: 'John', age: 30 });
// Request body: '{"name":"John","age":30}'

axios.post('/api/items', [1, 2, 3]);
// Request body: '[1,2,3]'

// ❌ NÃO serializado (já é string)
axios.post('/api/text', 'plain text');
// Request body: 'plain text'

// ❌ NÃO serializado (FormData)
const formData = new FormData();
formData.append('file', fileObject);
axios.post('/api/upload', formData);
// Request body: multipart form data
```

**Implicação Importante**: Se você passar objeto JavaScript, Axios **sempre** serializará (a menos que override `transformRequest`). Não é necessário chamar `JSON.stringify()` manualmente.

## Desserialização Automática

Axios parseia automaticamente responses JSON através do default `transformResponse`:

**Código interno simplificado**:
```javascript
// transformResponse default
function(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      // Se silentJSONParsing=true (default), retorna string original
      // Se false, lança erro
      if (this.transitional?.silentJSONParsing) {
        return data;
      }
      throw e;
    }
  }
  return data;
}
```

**Condições para desserialização**:
1. Response body é string
2. Parsing com `JSON.parse()` é bem-sucedido

**Não depende de Content-Type**: Diferente de algumas bibliotecas, Axios **não verifica Content-Type** para decidir se parseia. Se response body é string, tenta parsear. Isto significa:

```javascript
// Mesmo sem Content-Type: application/json, Axios parseia
// Response: '{"name":"John"}' (string)
axios.get('/api/user').then(response => {
  console.log(response.data); // { name: 'John' } (objeto)
});
```

**Vantagem**: Flexibilidade para APIs mal configuradas que retornam JSON mas não definem Content-Type correto.

**Desvantagem**: Tentará parsear qualquer string, podendo causar overhead ou erros.

## Handling de JSON Malformado

Por padrão, Axios **silencia** erros de parsing JSON:

```javascript
// Response: '{invalid json}'
axios.get('/api/data').then(response => {
  console.log(response.data); // '{invalid json}' (string, não erro)
});
```

Para **falhar** em JSON inválido:

```javascript
axios.get('/api/data', {
  transitional: {
    silentJSONParsing: false
  }
}).catch(error => {
  console.error('JSON parsing failed:', error);
});
```

**Configuração Global**:
```javascript
axios.defaults.transitional = {
  silentJSONParsing: false
};
```

**Use Case**: Em APIs bem comportadas onde JSON inválido indica erro servidor, configurar `silentJSONParsing: false` permite detectar problemas mais cedo.

## Content-Type Header

**Request Content-Type**: Axios define automaticamente quando serializa:

```javascript
axios.post('/api/user', { name: 'John' });
// Headers automaticamente incluem:
// Content-Type: application/json;charset=utf-8
```

**Override Manual**:
```javascript
axios.post('/api/user', { name: 'John' }, {
  headers: {
    'Content-Type': 'application/x-custom'
  }
});
// Content-Type: application/x-custom (override)
```

**Response Content-Type**: Axios **não usa** Content-Type para decidir se parseia (como mencionado), mas é boa prática servidor definir corretamente:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"name":"John"}
```

**Importância do Charset**: `charset=utf-8` garante que caracteres especiais são corretamente codificados:

```javascript
// Com charset correto
axios.post('/api/user', { name: 'José' });
// Request: {"name":"José"} (corretamente codificado)

// Sem charset, alguns servidores podem mal-interpretar
```

## Limitações de JSON.stringify()

JSON tem restrições sobre quais tipos JavaScript podem ser serializados:

**1. undefined, functions, symbols são omitidos**:
```javascript
const obj = {
  name: 'John',
  age: undefined,
  greet: function() { return 'Hi'; },
  id: Symbol('id')
};

JSON.stringify(obj);
// '{"name":"John"}'
// age, greet, id foram omitidos!
```

**2. Date vira string**:
```javascript
const obj = { createdAt: new Date('2023-01-01') };
JSON.stringify(obj);
// '{"createdAt":"2023-01-01T00:00:00.000Z"}'
// Parsing retorna string, não Date object
```

**3. RegExp, Map, Set viram objetos vazios**:
```javascript
JSON.stringify({ regex: /abc/g });
// '{"regex":{}}'

JSON.stringify({ map: new Map([['a', 1]]) });
// '{"map":{}}'
```

**4. Referências circulares lançam erro**:
```javascript
const obj = {};
obj.self = obj; // Referência circular

JSON.stringify(obj);
// TypeError: Converting circular structure to JSON
```

**5. Prototypes e métodos são perdidos**:
```javascript
class User {
  constructor(name) { this.name = name; }
  greet() { return `Hi, ${this.name}`; }
}

const user = new User('John');
const serialized = JSON.stringify(user);
// '{"name":"John"}'

const parsed = JSON.parse(serialized);
// { name: 'John' } (plain object, não User instance)

parsed.greet(); // TypeError: greet is not a function
```

**Implicações**: Ao usar Axios, tenha cuidado com tipos não-JSON. Eles podem ser silenciosamente omitidos ou mal serializados.

## Customização via toJSON()

Objetos podem implementar método `toJSON()` para controlar serialização:

```javascript
class User {
  constructor(name, password) {
    this.name = name;
    this.password = password; // Sensitivo
  }
  
  toJSON() {
    // Retorna versão serializable sem password
    return {
      name: this.name,
      // password omitido
    };
  }
}

const user = new User('John', 'secret123');
JSON.stringify(user);
// '{"name":"John"}' (password não incluído)
```

**Com Date**:
```javascript
// Date já tem toJSON() built-in
const date = new Date('2023-01-01');
date.toJSON(); // '2023-01-01T00:00:00.000Z'

// Customizar
Date.prototype.toJSON = function() {
  return this.getTime(); // Retorna timestamp em vez de ISO string
};

JSON.stringify({ createdAt: new Date('2023-01-01') });
// '{"createdAt":1672531200000}'
```

**Cuidado**: Modificar prototypes built-in pode causar problemas. Prefira wrapper classes.

## Replacer Function

`JSON.stringify()` aceita replacer function para transformar valores durante serialização:

```javascript
const obj = {
  name: 'John',
  age: 30,
  password: 'secret'
};

const json = JSON.stringify(obj, (key, value) => {
  // Omitir campos sensíveis
  if (key === 'password') return undefined;
  
  // Converter números para strings
  if (typeof value === 'number') return String(value);
  
  return value;
});

// '{"name":"John","age":"30"}'
```

**Usar com Axios via transformRequest**:
```javascript
axios.post('/api/user', userData, {
  transformRequest: [
    (data) => {
      return JSON.stringify(data, (key, value) => {
        if (key === 'password') return undefined;
        return value;
      });
    }
  ]
});
```

## Reviver Function

`JSON.parse()` aceita reviver function para transformar valores durante parsing:

```javascript
const json = '{"name":"John","createdAt":"2023-01-01T00:00:00Z"}';

const obj = JSON.parse(json, (key, value) => {
  // Converter strings ISO para Date
  if (key === 'createdAt') {
    return new Date(value);
  }
  return value;
});

console.log(obj.createdAt instanceof Date); // true
```

**Usar com Axios via transformResponse**:
```javascript
axios.get('/api/user', {
  transformResponse: [
    (data) => {
      if (typeof data === 'string') {
        return JSON.parse(data, (key, value) => {
          if (key.endsWith('At') || key.endsWith('Date')) {
            return new Date(value);
          }
          return value;
        });
      }
      return data;
    }
  ]
});
```

## Serialização de Tipos Especiais

**BigInt**:
```javascript
// ❌ BigInt não é serializável por padrão
const obj = { largeNumber: 9007199254740991n };
JSON.stringify(obj);
// TypeError: Do not know how to serialize a BigInt

// ✅ Converter para string
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
});
// '{"largeNumber":"9007199254740991"}'
```

**Map/Set**:
```javascript
// ✅ Converter para array
const map = new Map([['a', 1], ['b', 2]]);

JSON.stringify({
  map: Array.from(map.entries())
});
// '{"map":[["a",1],["b",2]]}'

// Desserializar
const parsed = JSON.parse('{"map":[["a",1],["b",2]]}');
const restoredMap = new Map(parsed.map);
```

**Date (preservando tipo)**:
Via `transformResponse`:
```javascript
axios.defaults.transformResponse = [
  ...axios.defaults.transformResponse,
  (data) => {
    // Detectar campos que são dates
    const dateFields = ['createdAt', 'updatedAt', 'birthDate'];
    
    function convertDates(obj) {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      for (const key in obj) {
        const value = obj[key];
        
        if (dateFields.includes(key) && typeof value === 'string') {
          obj[key] = new Date(value);
        } else if (typeof value === 'object') {
          convertDates(value); // Recursivo para nested
        }
      }
      
      return obj;
    }
    
    return convertDates(data);
  }
];
```

## Pretty-Printing para Debugging

Em development, pretty-print facilita debugging:

```javascript
// Via transformRequest
if (process.env.NODE_ENV === 'development') {
  axios.defaults.transformRequest = [
    (data) => {
      if (typeof data === 'object') {
        return JSON.stringify(data, null, 2); // Indentação 2 espaços
      }
      return data;
    }
  ];
}
```

**Network Tab mostrará**:
```json
{
  "name": "John",
  "age": 30,
  "address": {
    "city": "NYC"
  }
}
```

Em vez de:
```json
{"name":"John","age":30,"address":{"city":"NYC"}}
```

**Atenção**: Pretty-printing aumenta payload size. Usar apenas em development.

## Handling de Deeply Nested Structures

Estruturas profundamente nested podem causar stack overflow em serialização recursiva:

```javascript
// Estrutura muito nested
const deep = { level: 1 };
let current = deep;
for (let i = 2; i <= 10000; i++) {
  current.next = { level: i };
  current = current.next;
}

JSON.stringify(deep);
// RangeError: Maximum call stack size exceeded
```

**Solução**: Implementar serialization iterativa ou limitar profundidade:

```javascript
function safeStringify(obj, maxDepth = 10) {
  const cache = new Set();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // Detectar circular
      if (cache.has(value)) {
        return '[Circular]';
      }
      cache.add(value);
      
      // Limitar profundidade
      const depth = cache.size;
      if (depth > maxDepth) {
        return '[Too Deep]';
      }
    }
    
    return value;
  });
}
```

---

# 🎯 Aplicabilidade

## Cenários Onde Serialização Automática Brilha

**APIs REST Padrão**: Para APIs que seguem convenções REST com JSON, serialização automática do Axios elimina boilerplate completamente.

**Prototyping Rápido**: Em desenvolvimento inicial, não precisar se preocupar com serialização acelera iteration.

**Teams com Diversos Skill Levels**: Serialização automática reduz surface area para erros de desenvolvedores júnior que podem esquecer `JSON.stringify()`.

## Quando Customizar Serialização

**Tipos Não-JSON**: Quando trabalhar com Date, Map, Set, BigInt que precisam ser preservados após round-trip.

**Sensitive Data**: Implementar `toJSON()` ou replacer para omitir campos sensíveis (passwords, tokens).

**Legacy APIs**: APIs que esperam formatos peculiares (XML, form-urlencoded) requerem custom serializers.

**Performance Critical**: Em cenários de high-throughput, substituir JSON por formatos binários (MessagePack) pode reduzir latência e bandwidth.

## Combinação com Transformers

Serialização automática opera **dentro** de `transformRequest`/`transformResponse`, mas pode ser customizada:

```javascript
// transformRequest customizado que ainda usa JSON
axios.defaults.transformRequest = [
  (data) => {
    // Custom logic antes da serialização
    const sanitized = removeNullValues(data);
    
    // Serializar manualmente com replacer
    return JSON.stringify(sanitized, customReplacer);
  }
];
```

---

# ⚠️ Limitações

## Perda de Tipo e Metadata

JSON não preserva:
- Prototypes (class instances viram plain objects)
- Métodos (functions são omitidas)
- Tipos especiais (Date vira string, Map/Set viram `{}`)
- undefined (omitido ou vira null em arrays)

**Implicação**: Round-trip (serialize → deserialize) não garante igualdade estrutural.

## Referências Circulares

JSON não suporta. Tentar serializar objeto com referência circular lança erro:

```javascript
const obj = { name: 'John' };
obj.self = obj;

axios.post('/api/data', obj);
// TypeError: Converting circular structure to JSON
```

**Workaround**: Usar bibliotecas como `flatted` que serializam estruturas circulares.

## Performance em Large Payloads

`JSON.stringify()` e `JSON.parse()` são bloqueantes. Para payloads muito grandes (MBs), podem causar UI freeze.

**Solução**: Considerar web workers para serialization/deserialization assíncrona, ou formatos binários mais eficientes.

## Charset Issues

Sem `charset=utf-8`, caracteres especiais podem ser mal interpretados por servidores. Axios define automaticamente, mas servidores antigos podem ignorar.

---

# 🔗 Interconexões

## Relação com transformRequest/transformResponse

Serialização automática é **implementada através** de default transformers. Custom transformers podem override este comportamento.

## Content-Type Coordination

Serialização JSON requer `Content-Type: application/json`. Axios coordena automaticamente, mas custom Content-Types requerem custom serialization.

## Error Handling

Erros de serialização (circular references, BigInt) lançam exceções **antes** do request ser enviado, capturáveis com try/catch ou `.catch()`.

## TypeScript Integration

TypeScript pode tipar payloads, mas não garante que serialização preserva tipos:

```typescript
interface User {
  name: string;
  createdAt: Date;
}

const user: User = { name: 'John', createdAt: new Date() };

axios.post<User>('/api/user', user);
// Request body: {"name":"John","createdAt":"2023-..."} 
// createdAt vira string!
```

**Solução**: Usar transformers para preservar Date.

---

# 🚀 Evolução

## De Manual para Automático

**Era XMLHttpRequest**: Serialização manual:
```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', '/api/user');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.send(JSON.stringify({ name: 'John' })); // Manual
```

**Era Axios**: Automático:
```javascript
axios.post('/api/user', { name: 'John' }); // Automático
```

## Formatos Alternativos Emergentes

**MessagePack**: Formato binário mais compacto que JSON:
```javascript
import msgpack from 'msgpack-lite';

axios.defaults.transformRequest = [
  (data) => msgpack.encode(data) // Serializa para MessagePack
];
```

**Protocol Buffers**: Usado por gRPC, extremamente eficiente mas requer schema.

**CBOR**: JSON binário, mais eficiente para large payloads.

**Trend**: Para high-performance APIs, formatos binários ganham adoção, mas JSON permanece dominante por simplicidade.

## Streaming JSON

Para datasets grandes, streaming parsers evitam carregar tudo em memória:

```javascript
// Conceitual (não suportado nativamente por Axios)
axios.get('/api/large-dataset', {
  responseType: 'stream',
  transformResponse: [
    (stream) => parseJSONStream(stream)
  ]
});
```

## Type-Safe Serialization

Bibliotecas como `class-transformer` oferecem serialization type-safe:

```javascript
import { plainToClass, classToPlain } from 'class-transformer';

axios.post('/api/user', classToPlain(userInstance));
```

**Futuro**: Maior integração entre type systems e serialization para prevenir bugs de tipo.

---

**Conclusão Integrada**: Serialização automática JSON do Axios elimina categoria inteira de bugs ao centralizar conversão de dados em ponto único e confiável. Compreender tanto o comportamento default quanto os pontos de customização permite que desenvolvedores mantenham simplicidade em casos comuns enquanto têm flexibilidade para cenários avançados. Combinado com transformers, forma pipeline completo que mantém código limpo e type-safe através de todo o stack HTTP.