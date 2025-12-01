# then, catch e finally

## 🎯 Introdução e Definição

### Definição Conceitual

**`.then()`**, **`.catch()`** e **`.finally()`** são **métodos para consumir Promises**, permitindo reagir a conclusão assíncrona. **`.then(onFulfilled, onRejected)`** registra callbacks para sucesso ou erro. **`.catch(onRejected)`** é syntactic sugar para `.then(null, onRejected)` - captura apenas erros. **`.finally(onFinally)`** executa sempre, independente de sucesso/erro - ideal para cleanup.

Diferentemente de executores (que criam Promise), estes métodos **consomem** Promise. `.then()` retorna **nova Promise** - permite chaining. Callbacks executam em **microtask queue** - após código síncrono, antes de setTimeout. TypeScript infere tipos - `.then<T, R>(callback)` transforma `Promise<T>` em `Promise<R>`.

**Fundamento teórico:** `.then()` implementa **functor mapping** - transformar valor dentro de contexto (Promise). `.catch()` implementa **error monad** - short-circuit em erro. `.finally()` segue **bracket pattern** - garantir cleanup (acquire/release). Métodos seguem **continuation-passing style** - passar função para executar após operação async.

**Pattern básico:**
```typescript
// .then() - registrar success callback

const promise = new Promise<number>((resolve, reject) => {
  setTimeout(() => resolve(42), 1000);
});

promise.then((value) => {
  console.log("Success:", value);  // "Success: 42"
  // Callback executado quando promise fulfilled
});
```

```typescript
// .catch() - registrar error callback

const errorPromise = new Promise<number>((resolve, reject) => {
  setTimeout(() => reject(new Error("Failed")), 1000);
});

errorPromise.catch((error) => {
  console.error("Error:", error.message);  // "Error: Failed"
  // Callback executado quando promise rejected
});
```

```typescript
// .finally() - executar sempre

promise
  .then(value => console.log("Success:", value))
  .catch(error => console.error("Error:", error))
  .finally(() => {
    console.log("Cleanup");  // Sempre executa
  });
```

**Retorno de nova Promise:**
```typescript
// Cada .then() retorna nova Promise - permite chaining

const promise = Promise.resolve(10);

const newPromise = promise.then(value => value * 2);
// newPromise é Promise<number>, não number

newPromise.then(value => {
  console.log(value);  // 20
});
```

### Contexto Histórico e Evolução

**JavaScript ES5 (2009):** Callbacks apenas.

```javascript
// ES5 - callbacks aninhados
asyncOperation(function(result) {
  successCallback(result);
}, function(error) {
  errorCallback(error);
});
```

**Libraries (2011):** jQuery Deferred.

```javascript
// jQuery 1.5 (2011) - .then()
$.ajax("/api/user")
  .then(
    function(data) { console.log(data); },
    function(error) { console.error(error); }
  );
```

**ES6/ES2015:** Promise.prototype.then/catch.

```javascript
// ES6 - .then() e .catch() nativos
fetch("/api/user")
  .then(response => response.json())
  .catch(error => console.error(error));
```

**ES2018:** Promise.prototype.finally.

```javascript
// ES2018 - .finally() adicionado
fetch("/api/user")
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log("Done"));  // Novo!
```

**TypeScript 1.0 (2014):** Typed .then().

```typescript
// TypeScript 1.0 - type-safe callbacks
const promise: Promise<number> = Promise.resolve(42);

promise.then((value: number) => {
  console.log(value);
});
```

**TypeScript 2.0 (2016):** Better inference.

```typescript
// TypeScript 2.0 - type inference
Promise.resolve(42).then(value => {
  // value: number (inferido)
  return value.toString();
}).then(str => {
  // str: string (inferido)
  console.log(str);
});
```

**TypeScript 3.0 (2018):** .finally() types.

```typescript
// TypeScript 3.0 - .finally() typed
promise
  .then(value => console.log(value))
  .finally(() => {
    // Sem parâmetros - executa sempre
  });
```

**Antes vs Depois:**

**Pré-.then() (callbacks):**
```javascript
// Callbacks - error-first pattern ❌

asyncOperation(function(error, result) {
  if (error) {
    handleError(error);
    return;
  }
  
  anotherAsyncOperation(result, function(error, result2) {
    if (error) {
      handleError(error);
      return;
    }
    
    // Pyramid of doom
  });
});
```

**Pós-.then() (Promises):**
```typescript
// .then() - flat chain ✅

asyncOperation()
  .then(result => anotherAsyncOperation(result))
  .then(result2 => console.log(result2))
  .catch(error => handleError(error));

// Flat, compositional
```

### Problema Fundamental que Resolve

`.then()`, `.catch()` e `.finally()` resolvem problemas de **callback composition**, **error handling**, **cleanup**, e **readability**.

**Problema 1: Callback Hell - Composição Difícil**
```typescript
// Callbacks - pyramid of doom ❌

getUserById(1, (error, user) => {
  if (error) {
    handleError(error);
    return;
  }
  
  getPostsByUser(user.id, (error, posts) => {
    if (error) {
      handleError(error);
      return;
    }
    
    getCommentsByPost(posts[0].id, (error, comments) => {
      if (error) {
        handleError(error);
        return;
      }
      
      // 4 níveis de indentação - ilegível
      console.log(comments);
    });
  });
});
```

**Solução: .then() permite flat chaining**
```typescript
// .then() - flat, compositional ✅

getUserById(1)
  .then(user => getPostsByUser(user.id))
  .then(posts => getCommentsByPost(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => handleError(error));

// Flat - apenas 1 nível de indentação
// Compositional - funções encadeadas
```

**Problema 2: Error Handling Duplicado**
```typescript
// Callbacks - tratar erro em cada nível ❌

operation1((error, result1) => {
  if (error) {
    handleError(error);  // Duplicado
    return;
  }
  
  operation2(result1, (error, result2) => {
    if (error) {
      handleError(error);  // Duplicado
      return;
    }
    
    operation3(result2, (error, result3) => {
      if (error) {
        handleError(error);  // Duplicado
        return;
      }
      
      // Muito código duplicado
    });
  });
});
```

**Solução: .catch() centraliza error handling**
```typescript
// .catch() - single error handler ✅

operation1()
  .then(result1 => operation2(result1))
  .then(result2 => operation3(result2))
  .then(result3 => console.log(result3))
  .catch(error => handleError(error));  // UM único handler

// Erro de qualquer .then() propaga para .catch()
```

**Problema 3: Cleanup Code Duplicado**
```typescript
// Sem .finally() - cleanup duplicado ❌

function fetchData() {
  showLoadingSpinner();  // Start loading
  
  fetch("/api/data")
    .then(response => {
      hideLoadingSpinner();  // Stop loading (duplicado)
      return response.json();
    })
    .catch(error => {
      hideLoadingSpinner();  // Stop loading (duplicado)
      throw error;
    });
}

// hideLoadingSpinner() duplicado em .then() e .catch()
```

**Solução: .finally() executa sempre**
```typescript
// .finally() - cleanup centralizado ✅

function fetchData() {
  showLoadingSpinner();
  
  return fetch("/api/data")
    .then(response => response.json())
    .catch(error => handleError(error))
    .finally(() => {
      hideLoadingSpinner();  // Executa SEMPRE
    });
}

// hideLoadingSpinner() uma vez - executa em sucesso OU erro
```

**Problema 4: Type Safety Perdida**
```typescript
// Callbacks - type safety difícil ❌

function getUser(
  id: number,
  callback: (error: Error | null, user?: User) => void
): void {
  // user?: User - opcional, confuso
  // Callback pode receber user ou não
}

getUser(1, (error, user) => {
  if (user) {  // Precisa verificar
    console.log(user.name);
  }
});
```

**Solução: .then() preserva types**
```typescript
// .then() - type-safe ✅

function getUser(id: number): Promise<User> {
  return Promise.resolve({ id: 1, name: "Alice" });
}

getUser(1).then(user => {
  // user: User (não opcional)
  console.log(user.name);  // ✓ Type-safe
});
```

**Fundamento teórico:** `.then()` implementa **monadic bind** - flatMap que preserva contexto (Promise) enquanto transforma valor.

### Importância no Ecossistema

`.then()`, `.catch()`, `.finally()` são importantes porque:

- **Composition:** Encadear operações assíncronas
- **Error propagation:** Erros propagam automaticamente
- **Cleanup:** .finally() garante execução
- **Readability:** Código flat vs pyramid
- **Type safety:** TypeScript infere tipos
- **Standard:** ES6/ES2018 universal
- **Foundation:** Base para async/await
- **Debugging:** Stack traces melhores

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **.then(onFulfilled):** Callback quando fulfilled
2. **.catch(onRejected):** Callback quando rejected
3. **.finally(onFinally):** Callback sempre executa
4. **Return new Promise:** Permite chaining
5. **Microtask execution:** Callbacks em microtask queue

### Pilares Fundamentais

- **onFulfilled:** `(value: T) => R`
- **onRejected:** `(error: any) => R`
- **onFinally:** `() => void`
- **Chaining:** Cada método retorna Promise
- **Error propagation:** Skip .then() quando rejeitado

### Visão Geral das Nuances

- **.then(null, onRejected):** Equivalente a `.catch()`
- **Return value:** Transforma Promise type
- **Return Promise:** Flattening automático
- **Throw in .then():** Vira rejected promise
- **.finally() no value:** Não recebe valor/erro

## 🧠 Fundamentos Teóricos

### Basic .then() Usage

```typescript
// .then() - registrar success callback

const promise = Promise.resolve(42);

promise.then((value) => {
  console.log("Received:", value);  // "Received: 42"
});

// .then() retorna nova Promise
const chainedPromise = promise.then(value => value * 2);

chainedPromise.then(doubled => {
  console.log(doubled);  // 84
});
```

**Basic .then():** Success callback.

### Princípios e Conceitos Subjacentes

#### .then() with Two Callbacks

```typescript
// .then(onFulfilled, onRejected) - ambos callbacks

const promise = Math.random() > 0.5
  ? Promise.resolve("Success")
  : Promise.reject(new Error("Failed"));

promise.then(
  (value) => {
    console.log("Fulfilled:", value);
  },
  (error) => {
    console.error("Rejected:", error.message);
  }
);

// ⚠️ Não recomendado - usar .catch() ao invés
```

**.then() Two Callbacks:** Possível mas não idiomático.

#### .catch() - Error Handler

```typescript
// .catch() - syntactic sugar para .then(null, onRejected)

const errorPromise = Promise.reject(new Error("Oops"));

// Usando .catch()
errorPromise.catch(error => {
  console.error("Caught:", error.message);
});

// Equivalente usando .then()
errorPromise.then(null, error => {
  console.error("Caught:", error.message);
});

// .catch() mais idiomático e legível
```

**.catch():** Preferred error handling.

### .finally() - Cleanup

```typescript
// .finally() - executa sempre, sucesso ou erro

let loading = false;

function fetchData(): Promise<string> {
  loading = true;
  
  return fetch("/api/data")
    .then(response => response.text())
    .catch(error => {
      console.error("Error:", error);
      throw error;  // Re-throw
    })
    .finally(() => {
      loading = false;  // Sempre executa
      console.log("Cleanup done");
    });
}

// loading = false executado independente de sucesso/erro
```

**.finally():** Always executes.

#### Return Values - Transform Promise

```typescript
// .then() return value transforma Promise type

const numberPromise: Promise<number> = Promise.resolve(42);

const stringPromise: Promise<string> = numberPromise.then(num => {
  return num.toString();  // number → string
});

stringPromise.then(str => {
  console.log(str);  // "42" (string)
});

// Promise<number> → Promise<string> via .then()
```

**Return Values:** Transform Promise type.

#### Return Promise - Flattening

```typescript
// Retornar Promise em .then() - auto-flattening

const promise = Promise.resolve(10);

const flatPromise = promise.then(value => {
  // Retornar Promise - não Promise<Promise<number>>
  return Promise.resolve(value * 2);
});

// flatPromise é Promise<number>, não Promise<Promise<number>>
flatPromise.then(doubled => {
  console.log(doubled);  // 20
});

// Auto-flattening - Promise unwrapped automaticamente
```

**Flattening:** Promises unwrapped automaticamente.

### Error Propagation

```typescript
// Erros propagam até .catch()

Promise.resolve(10)
  .then(value => {
    console.log("Step 1:", value);  // "Step 1: 10"
    return value * 2;
  })
  .then(value => {
    console.log("Step 2:", value);  // "Step 2: 20"
    throw new Error("Something failed");  // Erro!
  })
  .then(value => {
    console.log("Step 3:", value);  // ✗ Skipped
    return value * 2;
  })
  .catch(error => {
    console.error("Caught:", error.message);  // "Caught: Something failed"
  });

// .then() após erro é skipped
// Erro propaga até primeiro .catch()
```

**Error Propagation:** Skip .then() quando rejeitado.

#### Recover from Error

```typescript
// .catch() pode recuperar de erro

Promise.reject(new Error("Failed"))
  .catch(error => {
    console.error("Error:", error.message);
    return "Default value";  // Recover - retornar valor
  })
  .then(value => {
    console.log("Recovered:", value);  // "Recovered: Default value"
  });

// .catch() retorna fulfilled Promise - chain continua
```

**Recover:** .catch() pode retornar valor.

### Throw in .then()

```typescript
// Throw em .then() vira rejected promise

Promise.resolve(10)
  .then(value => {
    if (value < 100) {
      throw new Error("Value too small");  // Exception
    }
    return value;
  })
  .catch(error => {
    console.error("Caught:", error.message);  // "Caught: Value too small"
  });

// Exception em .then() automaticamente vira rejected promise
```

**Throw:** Exception → rejected promise.

#### .finally() Transparency

```typescript
// .finally() não modifica valor/erro

Promise.resolve(42)
  .finally(() => {
    console.log("Cleanup");
    return 100;  // ⚠️ Ignorado - não muda valor
  })
  .then(value => {
    console.log(value);  // 42 (não 100)
  });

Promise.reject(new Error("Failed"))
  .finally(() => {
    console.log("Cleanup");
    return "Ignored";  // ⚠️ Ignorado
  })
  .catch(error => {
    console.error(error.message);  // "Failed" (erro original)
  });

// .finally() é transparente - valor/erro passa através
```

**.finally() Transparency:** Não modifica valor/erro.

### Real-World Example - HTTP Request

```typescript
// HTTP request com .then()/.catch()/.finally()

interface User {
  id: number;
  name: string;
}

let isLoading = false;

function fetchUser(id: number): Promise<User> {
  isLoading = true;
  
  return fetch(`/api/users/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((user: User) => {
      console.log("User fetched:", user.name);
      return user;
    })
    .catch(error => {
      console.error("Fetch failed:", error.message);
      throw error;  // Re-throw
    })
    .finally(() => {
      isLoading = false;  // Cleanup
      console.log("Request complete");
    });
}

// Usar
fetchUser(1)
  .then(user => console.log("Success:", user))
  .catch(error => console.error("Error:", error));
```

**Real-World:** Complete HTTP request pattern.

#### Modelo Mental para Compreensão

Pense em `.then()` como **assembly line**:

**Assembly line:** Estações de trabalho sequenciais
**.then() chain:** Operações sequenciais
**Product transformation:** Valor transformado
**Quality control:** .catch() detecta erros
**Final inspection:** .finally() cleanup

**Analogia - Mail Delivery:**

**Package sent:** Promise created
**Delivery route:** .then() chain
**Recipient receives:** onFulfilled callback
**Return to sender:** onRejected/.catch()
**Delivery confirmation:** .finally()

**Metáfora - Water Pipeline:**

**Water flow:** Valor através da chain
**Pipe sections:** .then() transformations
**Leak detection:** .catch() errors
**Valve close:** .finally() cleanup
**Flow continues:** Chaining

**Fluxo visual:**
```
Promise
    ↓
.then(value => ...)  → Transform value
    ↓
.then(value => ...)  → Transform again
    ↓ (error thrown)
.then(...)  → SKIPPED
    ↓
.catch(error => ...)  → Handle error
    ↓
.finally(...)  → Cleanup (sempre)
```

## 🔍 Análise Conceitual Profunda

### Microtask Queue Execution

```typescript
// .then() callbacks executam em microtask queue

console.log("1: Sync");

Promise.resolve().then(() => {
  console.log("3: Microtask");
});

console.log("2: Sync");

setTimeout(() => {
  console.log("4: Macrotask");
}, 0);

// Output:
// "1: Sync"
// "2: Sync"
// "3: Microtask"
// "4: Macrotask"

// Microtasks executam ANTES de macrotasks (setTimeout)
```

**Microtasks:** .then() callbacks em microtask queue.

### Type Transformations

```typescript
// .then() transforma tipos - type inference

const numberPromise: Promise<number> = Promise.resolve(42);

const stringPromise: Promise<string> = numberPromise.then(num => num.toString());

const boolPromise: Promise<boolean> = stringPromise.then(str => str.length > 0);

const voidPromise: Promise<void> = boolPromise.then(bool => {
  console.log(bool);
  // No return - Promise<void>
});

// TypeScript infere cada tipo automaticamente
```

**Type Transformations:** TypeScript infere tipos.

#### Multiple .catch() Handlers

```typescript
// Múltiplos .catch() na chain

Promise.reject(new Error("Initial error"))
  .catch(error => {
    console.error("First catch:", error.message);
    throw new Error("Second error");  // Re-throw novo erro
  })
  .catch(error => {
    console.error("Second catch:", error.message);
    return "Recovered";  // Recover
  })
  .then(value => {
    console.log("Continued:", value);  // "Continued: Recovered"
  });

// Cada .catch() pode re-throw ou recover
```

**Multiple .catch():** Sequencial error handling.

### .finally() with Rejection

```typescript
// .finally() com rejected promise

Promise.reject(new Error("Failed"))
  .finally(() => {
    console.log("Cleanup");  // Executa mesmo com erro
  })
  .catch(error => {
    console.error("Error:", error.message);  // "Error: Failed"
  });

// .finally() executa, erro propaga
```

**.finally() Rejection:** Erro continua propagando.

## 🎯 Aplicabilidade e Contextos

### HTTP Requests

```typescript
fetch("/api/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => console.log("Done"));
```

**Raciocínio:** Pattern comum para APIs.

### Database Queries

```typescript
db.query("SELECT * FROM users")
  .then(users => processUsers(users))
  .catch(error => logError(error))
  .finally(() => db.close());
```

**Raciocínio:** Cleanup (close connection).

### UI Loading States

```typescript
showSpinner();

fetchData()
  .then(data => renderData(data))
  .catch(error => showError(error))
  .finally(() => hideSpinner());
```

**Raciocínio:** .finally() para UI cleanup.

## ⚠️ Limitações e Considerações Teóricas

### .finally() Cannot Modify Value

```typescript
// .finally() não pode modificar valor ❌

Promise.resolve(42)
  .finally(() => {
    return 100;  // Ignorado
  })
  .then(value => {
    console.log(value);  // 42, não 100
  });
```

**Limitação:** .finally() transparente.

### Unhandled Rejections

```typescript
// Promise sem .catch() - unhandled rejection ⚠️

Promise.reject(new Error("Oops"));
// Node.js: UnhandledPromiseRejectionWarning

// Solução - sempre adicionar .catch()
Promise.reject(new Error("Oops"))
  .catch(error => console.error(error));
```

**Consideração:** Sempre adicionar .catch().

### .then() vs async/await Readability

```typescript
// .then() chain pode ficar complexo

fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments));

// async/await mais legível
async function getData() {
  const user = await fetchUser();
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  console.log(comments);
}
```

**Consideração:** async/await para chains complexas.

## 🔗 Interconexões Conceituais

**Relação com Promise creation:** Consumir promises.

**Relação com chaining:** Compor operações.

**Relação com async/await:** Syntax sugar.

**Relação com Event Loop:** Microtasks.

**Relação com Error handling:** Propagação.

## 🚀 Evolução e Próximos Conceitos

Dominar .then()/.catch()/.finally() prepara para:
- **Promise chaining:** Compor múltiplas operações
- **async/await:** Syntax sugar para promises
- **Promise.all():** Executar múltiplas em paralelo
- **Promise.race():** Competição entre promises
- **Error handling:** Try/catch com async/await
- **Microtasks:** Event loop e task queues
