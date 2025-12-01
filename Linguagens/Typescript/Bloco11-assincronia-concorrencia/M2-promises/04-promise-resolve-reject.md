# Promise.resolve() e Promise.reject()

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.resolve()** e **Promise.reject()** são **métodos estáticos para criar Promises pré-resolvidas/rejeitadas**. **`Promise.resolve(value)`** retorna **Promise fulfilled imediatamente** com valor. **`Promise.reject(reason)`** retorna **Promise rejected imediatamente** com erro. Diferentemente de `new Promise(executor)` que executa código assíncrono, estes métodos **criam Promise síncrona** - estado já definido.

Conceitualmente, são **factory methods** - criar Promises sem constructor. `Promise.resolve()` é útil para **converter valores em Promises** - normalizar retorno de funções. `Promise.reject()` é útil para **signal errors** - rejeitar Promise imediatamente. Ambos suportam **thenable recognition** - se argumento tem `.then()`, Promise.resolve() retorna wrapped version.

**Fundamento teórico:** Promise.resolve() implementa **unit/return** de monad - wrap valor em contexto Promise. Promise.reject() implementa **error injection** - criar Promise rejected sem executor. Seguem **immediate resolution pattern** - estado definido síncronamente, mas handlers (`.then()`) executam assíncronamente (microtask). TypeScript infere **tipo do valor** - `Promise.resolve<T>(value)` cria `Promise<T>`.

**Pattern básico:**
```typescript
// Promise.resolve() - criar Promise fulfilled

const resolvedPromise = Promise.resolve(42);
// Promise<number> fulfilled imediatamente com 42

resolvedPromise.then(value => {
  console.log(value);  // 42
});

// Equivalente a:
const equivalentPromise = new Promise<number>(resolve => {
  resolve(42);
});
```

```typescript
// Promise.reject() - criar Promise rejected

const rejectedPromise = Promise.reject(new Error("Failed"));
// Promise<never> rejected imediatamente

rejectedPromise.catch(error => {
  console.error(error.message);  // "Failed"
});

// Equivalente a:
const equivalentRejected = new Promise<never>((resolve, reject) => {
  reject(new Error("Failed"));
});
```

**Uso principal - converter valores:**
```typescript
// Converter valor em Promise - normalizar retorno

function getData(useCache: boolean): Promise<Data> {
  if (useCache) {
    const cachedData = getFromCache();
    return Promise.resolve(cachedData);  // Valor → Promise
  } else {
    return fetchFromAPI();  // Já retorna Promise
  }
}

// Retorno sempre Promise - consistência
```

**Thenable recognition:**
```typescript
// Promise.resolve() reconhece thenables

const thenable = {
  then(onFulfilled: (value: number) => void) {
    onFulfilled(42);
  }
};

Promise.resolve(thenable).then(value => {
  console.log(value);  // 42
});

// Thenable wrapped em Promise nativa
```

### Contexto Histórico e Evolução

**ES6/ES2015:** Promise.resolve/reject introduzidos.

```javascript
// ES6 - métodos estáticos
const resolved = Promise.resolve(42);
const rejected = Promise.reject(new Error("Failed"));

resolved.then(value => console.log(value));
rejected.catch(error => console.error(error));
```

**TypeScript 1.0 (2014):** Typed static methods.

```typescript
// TypeScript 1.0 - type inference
const numberPromise: Promise<number> = Promise.resolve(42);
const errorPromise: Promise<never> = Promise.reject(new Error("Failed"));
```

**TypeScript 2.0 (2016):** Better generics.

```typescript
// TypeScript 2.0 - automatic inference
const resolved = Promise.resolve(42);  // Promise<number> inferido
const rejected = Promise.reject(new Error("Failed"));  // Promise<never>
```

**ES2018:** Promise.finally() adicionado.

```javascript
// ES2018 - work com Promise.resolve/reject
Promise.resolve(42)
  .finally(() => console.log("Cleanup"))
  .then(value => console.log(value));
```

**TypeScript 4.5 (2021):** Awaited utility.

```typescript
// TypeScript 4.5 - Awaited<T>
type Result = Awaited<ReturnType<typeof Promise.resolve<string>>>;  // string
```

**Antes vs Depois:**

**Pré-Promise.resolve() - verboso:**
```javascript
// Sem Promise.resolve() - verbose ❌

function getValue(cached: boolean, callback) {
  if (cached) {
    // Valor síncrono - precisa wrapper
    setTimeout(() => {
      callback(null, getCachedValue());
    }, 0);
  } else {
    fetchValue(callback);
  }
}

// Inconsistente - mix sync/async
```

**Pós-Promise.resolve() - consistente:**
```typescript
// Com Promise.resolve() - consistent ✅

function getValue(cached: boolean): Promise<Value> {
  if (cached) {
    return Promise.resolve(getCachedValue());  // Sync → Promise
  } else {
    return fetchValue();  // Já Promise
  }
}

// Sempre retorna Promise - consistência
```

### Problema Fundamental que Resolve

Promise.resolve() e Promise.reject() resolvem problemas de **mixed sync/async returns**, **value wrapping**, **error creation**, e **consistency**.

**Problema 1: Mixed Sync/Async Returns**
```typescript
// Retornar às vezes valor, às vezes Promise - inconsistente ❌

function getData(useCache: boolean): Data | Promise<Data> {
  if (useCache) {
    return getCachedData();  // Sync - retorna Data
  } else {
    return fetch('/api/data').then(r => r.json());  // Async - retorna Promise<Data>
  }
}

// Caller precisa lidar com ambos
const result = getData(true);

if (result instanceof Promise) {
  result.then(data => process(data));
} else {
  process(result);
}

// Verboso, propenso a erros
```

**Solução: Promise.resolve() normaliza retorno**
```typescript
// Sempre retornar Promise - consistente ✅

function getData(useCache: boolean): Promise<Data> {
  if (useCache) {
    const cachedData = getCachedData();
    return Promise.resolve(cachedData);  // Data → Promise<Data>
  } else {
    return fetch('/api/data').then(r => r.json());  // Promise<Data>
  }
}

// Caller sempre trata como Promise
getData(true).then(data => process(data));
getData(false).then(data => process(data));

// Consistente, fácil usar
```

**Problema 2: Wrap Values em Promise Verbosamente**
```typescript
// Sem Promise.resolve() - verboso ❌

function wrapValue(value: number): Promise<number> {
  return new Promise<number>(resolve => {
    resolve(value);  // Verboso para valor simples
  });
}

// Muito código para tarefa simples
```

**Solução: Promise.resolve() conciso**
```typescript
// Promise.resolve() - conciso ✅

function wrapValue(value: number): Promise<number> {
  return Promise.resolve(value);  // Uma linha
}

// Mesmo resultado, menos código
```

**Problema 3: Error Signaling Verboso**
```typescript
// Sem Promise.reject() - verboso ❌

function validateAge(age: number): Promise<number> {
  if (age < 0) {
    return new Promise<number>((resolve, reject) => {
      reject(new Error("Age cannot be negative"));
    });
  }
  
  return Promise.resolve(age);
}

// Verboso para rejection simples
```

**Solução: Promise.reject() conciso**
```typescript
// Promise.reject() - conciso ✅

function validateAge(age: number): Promise<number> {
  if (age < 0) {
    return Promise.reject(new Error("Age cannot be negative"));
  }
  
  return Promise.resolve(age);
}

// Mais legível, conciso
```

**Problema 4: Thenable Compatibility**
```typescript
// Thenable (jQuery Deferred, etc) - incompatível com Promise ❌

const jqueryDeferred = $.ajax('/api/data');
// jqueryDeferred é thenable, não Promise nativa

// Não pode usar Promise.all()
Promise.all([jqueryDeferred, otherPromise]);  // ✗ Type error
```

**Solução: Promise.resolve() converte thenable**
```typescript
// Promise.resolve() normaliza thenable ✅

const jqueryDeferred = $.ajax('/api/data');

const nativePromise = Promise.resolve(jqueryDeferred);
// Thenable → Promise nativa

// Agora pode usar Promise.all()
Promise.all([nativePromise, otherPromise]).then(results => {
  console.log(results);
});

// Compatibilidade com libraries antigas
```

**Fundamento teórico:** Promise.resolve() implementa **coercion to monad** - converter qualquer valor/thenable em Promise consistente.

### Importância no Ecossistema

Promise.resolve() e Promise.reject() são importantes porque:

- **Consistency:** Normalizar retornos sync/async
- **Brevity:** Criar Promises concisamente
- **Thenable support:** Converter thenables
- **Type safety:** TypeScript infere tipos
- **Immediate values:** Wrap valores sem executor
- **Error signaling:** Reject sem executor
- **Testing:** Criar mocks facilmente
- **Interop:** Libraries antigas ↔ modernas

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Promise.resolve(value):** Fulfilled Promise
2. **Promise.reject(reason):** Rejected Promise
3. **Immediate creation:** Estado definido síncrono
4. **Thenable recognition:** Converter thenables
5. **Type inference:** `Promise<T>` from value

### Pilares Fundamentais

- **Static methods:** Não precisa instanciar
- **Value wrapping:** Converter valor → Promise
- **Error creation:** Criar rejected Promise
- **Normalization:** Sync/async consistency
- **Microtask handlers:** `.then()` ainda assíncrono

### Visão Geral das Nuances

- **Promise.resolve(promise):** Retorna mesma Promise
- **Thenable unwrapping:** Recursive até valor
- **Type Promise<never>:** Promise.reject() type
- **No executor:** Direto ao estado final
- **Testing utility:** Criar mocks

## 🧠 Fundamentos Teóricos

### Basic Promise.resolve()

```typescript
// Promise.resolve() - criar fulfilled Promise

const promise = Promise.resolve(42);
// Promise<number> fulfilled com 42

promise.then(value => {
  console.log(value);  // 42
});

// Type inference
const stringPromise = Promise.resolve("Hello");  // Promise<string>
const boolPromise = Promise.resolve(true);       // Promise<boolean>
```

**Basic resolve():** Wrap valor em Promise.

### Princípios e Conceitos Subjacentes

#### Basic Promise.reject()

```typescript
// Promise.reject() - criar rejected Promise

const errorPromise = Promise.reject(new Error("Failed"));
// Promise<never> rejected

errorPromise.catch(error => {
  console.error(error.message);  // "Failed"
});

// Type é Promise<never> - nunca fulfills
```

**Basic reject():** Criar rejected Promise.

#### Promise.resolve() with Promise

```typescript
// Promise.resolve(promise) - retorna mesma Promise

const original = new Promise(resolve => resolve(42));

const wrapped = Promise.resolve(original);

console.log(wrapped === original);  // true - mesma Promise

// Não cria nova Promise wrapper
// Otimização - retorna input
```

**resolve() Promise:** Retorna mesma Promise.

### Thenable Recognition

```typescript
// Promise.resolve() reconhece thenables

// Custom thenable
const thenable = {
  then(onFulfilled: (value: number) => void, onRejected?: (error: any) => void) {
    setTimeout(() => {
      onFulfilled(42);
    }, 1000);
  }
};

// Convert thenable → Promise
const promise = Promise.resolve(thenable);

promise.then(value => {
  console.log(value);  // 42 (após 1s)
});

// Thenable wrapped em Promise nativa
// Agora pode usar .catch(), .finally(), etc
```

**Thenable:** Converter em Promise nativa.

#### Normalize Sync/Async Returns

```typescript
// Normalizar retornos - sempre Promise

interface User {
  id: number;
  name: string;
}

const cache: Map<number, User> = new Map();

function getUser(id: number): Promise<User> {
  // Check cache - sync
  if (cache.has(id)) {
    const cachedUser = cache.get(id)!;
    return Promise.resolve(cachedUser);  // Sync → Promise
  }
  
  // Fetch from API - async
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then((user: User) => {
      cache.set(id, user);
      return user;
    });
}

// Caller sempre usa .then() - consistente
getUser(1).then(user => console.log(user.name));
getUser(2).then(user => console.log(user.name));
```

**Normalize:** Sync/async consistency.

### Early Return with Rejection

```typescript
// Early return - validação com Promise.reject()

function divide(a: number, b: number): Promise<number> {
  // Validação - early return
  if (b === 0) {
    return Promise.reject(new Error("Division by zero"));
  }
  
  if (!isFinite(a) || !isFinite(b)) {
    return Promise.reject(new Error("Invalid numbers"));
  }
  
  // Operação válida
  return Promise.resolve(a / b);
}

// Usar
divide(10, 2)
  .then(result => console.log("Result:", result))  // 5
  .catch(error => console.error("Error:", error));

divide(10, 0)
  .catch(error => console.error("Error:", error.message));  // "Division by zero"
```

**Early Return:** Validação com reject().

#### Chaining with resolve/reject

```typescript
// Chain com Promise.resolve/reject

Promise.resolve(10)
  .then(value => {
    console.log("Step 1:", value);  // 10
    
    if (value < 100) {
      return Promise.reject(new Error("Value too small"));
    }
    
    return value * 2;
  })
  .then(value => {
    console.log("Step 2:", value);  // ✗ Skipped
  })
  .catch(error => {
    console.error("Error:", error.message);  // "Value too small"
  });
```

**Chaining:** Usar em chains.

### Testing Utilities

```typescript
// Testing - criar mocks com resolve/reject

// Mock função que retorna Promise
function mockFetchUser(success: boolean): Promise<User> {
  if (success) {
    return Promise.resolve({ id: 1, name: "Alice" });
  } else {
    return Promise.reject(new Error("User not found"));
  }
}

// Testar success case
test("fetch user success", async () => {
  const user = await mockFetchUser(true);
  expect(user.name).toBe("Alice");
});

// Testar error case
test("fetch user error", async () => {
  await expect(mockFetchUser(false))
    .rejects
    .toThrow("User not found");
});
```

**Testing:** Criar mocks facilmente.

#### Real-World Example - Cache Pattern

```typescript
// Cache pattern - mix sync/async

class DataService {
  private cache = new Map<string, any>();
  
  async getData(key: string): Promise<any> {
    // Check cache - sync
    if (this.cache.has(key)) {
      console.log("Cache hit");
      return Promise.resolve(this.cache.get(key));  // Sync → Promise
    }
    
    // Fetch from API - async
    console.log("Cache miss - fetching");
    try {
      const response = await fetch(`/api/data/${key}`);
      const data = await response.json();
      
      this.cache.set(key, data);
      return data;
    } catch (error) {
      return Promise.reject(new Error(`Failed to fetch ${key}`));
    }
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}

// Usar
const service = new DataService();

service.getData("user-1")
  .then(data => console.log(data));  // Cache miss

service.getData("user-1")
  .then(data => console.log(data));  // Cache hit - Promise.resolve()
```

**Real-World:** Cache pattern com normalize.

### Modelo Mental para Compreensão

Pense em Promise.resolve() como **gift wrapping**:

**Item:** Valor simples
**Gift wrap:** Promise wrapper
**Promise.resolve():** Wrapping service
**Immediate:** Wrapped instantaneamente
**Unwrap:** .then() para acessar

**Analogia - Express Delivery:**

**Package ready:** Valor disponível
**Promise.resolve():** Enviar imediatamente
**Already at destination:** Fulfilled imediatamente
**.then():** Receber package

**Metáfora - Instant Coffee:**

**Promise.resolve():** Instant coffee - ready immediately
**new Promise():** Brew coffee - takes time
**Value:** Coffee grounds
**Promise:** Coffee in cup

**Fluxo Promise.resolve():**
```
Value: 42
    ↓
Promise.resolve(42)
    ↓
Promise<number> (fulfilled)
    ↓
.then(value => ...)  → Executado assíncrono (microtask)
    ↓
Recebe 42
```

**Fluxo Promise.reject():**
```
Error: new Error("Failed")
    ↓
Promise.reject(error)
    ↓
Promise<never> (rejected)
    ↓
.catch(error => ...)  → Captura erro
    ↓
Recebe Error
```

## 🔍 Análise Conceitual Profunda

### Promise.resolve() Identity

```typescript
// Promise.resolve(promise) retorna mesma Promise

const p1 = new Promise(resolve => resolve(42));
const p2 = Promise.resolve(p1);

console.log(p1 === p2);  // true - mesma referência

// Otimização - não criar wrapper desnecessário
```

**Identity:** Otimização para Promises.

### Nested Thenables Unwrapping

```typescript
// Thenable aninhado - unwrap recursivo

const nestedThenable = {
  then(onFulfilled: (value: any) => void) {
    onFulfilled({
      then(onFulfilled2: (value: number) => void) {
        onFulfilled2(42);
      }
    });
  }
};

Promise.resolve(nestedThenable).then(value => {
  console.log(value);  // 42 (unwrapped completamente)
});

// Unwrap recursivo até valor não-thenable
```

**Unwrapping:** Recursive até valor.

#### Type System Behavior

```typescript
// Type system - Promise.resolve/reject

// Promise.resolve() infere tipo
const num = Promise.resolve(42);           // Promise<number>
const str = Promise.resolve("hello");      // Promise<string>
const obj = Promise.resolve({ id: 1 });   // Promise<{id: number}>

// Promise.reject() sempre Promise<never>
const err1 = Promise.reject(new Error("Failed"));  // Promise<never>
const err2 = Promise.reject("Error string");       // Promise<never>

// never = nunca fulfills - apenas rejects
```

**Types:** Inference e never.

### Combining resolve/reject

```typescript
// Combinar resolve/reject - validação

function processValue(value: number): Promise<number> {
  // Validações - reject
  if (value < 0) {
    return Promise.reject(new Error("Negative value"));
  }
  
  if (value > 1000) {
    return Promise.reject(new Error("Value too large"));
  }
  
  // Valor válido - resolve
  return Promise.resolve(value * 2);
}

// Usar
processValue(10).then(result => console.log(result));  // 20
processValue(-5).catch(error => console.error(error.message));  // "Negative value"
processValue(2000).catch(error => console.error(error.message));  // "Value too large"
```

**Combining:** Validação pattern.

## 🎯 Aplicabilidade e Contextos

### Cache Pattern

```typescript
const cache = new Map();

function getData(key: string): Promise<Data> {
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key));
  }
  return fetchData(key);
}
```

**Raciocínio:** Normalize sync cache access.

### Validation

```typescript
function validate(value: number): Promise<number> {
  if (value < 0) {
    return Promise.reject(new Error("Invalid"));
  }
  return Promise.resolve(value);
}
```

**Raciocínio:** Early rejection.

### Testing Mocks

```typescript
function mockAPI(success: boolean): Promise<Data> {
  return success
    ? Promise.resolve(mockData)
    : Promise.reject(new Error("Failed"));
}
```

**Raciocínio:** Simple test mocks.

## ⚠️ Limitações e Considerações Teóricas

### Still Asynchronous Execution

```typescript
// .then() ainda executa assíncrono (microtask)

console.log("1");

Promise.resolve(42).then(value => {
  console.log("3:", value);
});

console.log("2");

// Output: "1", "2", "3: 42"
// .then() microtask - após código síncrono
```

**Limitação:** Handlers sempre assíncronos.

### Promise.resolve() não é Shallow Copy

```typescript
// Promise.resolve(object) - mesma referência

const obj = { value: 42 };
const promise = Promise.resolve(obj);

promise.then(resolved => {
  console.log(resolved === obj);  // true - mesma referência
  
  resolved.value = 100;  // Mutação afeta original
});

console.log(obj.value);  // 100 (eventual)
```

**Consideração:** Mesma referência, não clone.

### Error Type in reject()

```typescript
// Promise.reject() aceita qualquer tipo, mas use Error

// ⚠️ Evitar - string
Promise.reject("Error message");

// ✅ Preferir - Error object
Promise.reject(new Error("Error message"));

// Error objects têm stack traces - debugging
```

**Best Practice:** Usar Error objects.

## 🔗 Interconexões Conceituais

**Relação com new Promise():** Alternativa concisa.

**Relação com async/await:** Async function auto-resolve.

**Relação com Thenable:** Converter libraries antigas.

**Relação com Promise.all():** Criar arrays de Promises.

**Relação com Testing:** Mocks simples.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise.resolve/reject prepara para:
- **Promise.all():** Múltiplas Promises
- **Promise.race():** Primeira a resolver
- **Promise.allSettled():** Todas com resultado
- **async/await:** Syntax sugar
- **Error handling:** Try/catch async
- **Testing:** Advanced mocking
