# Promise Chaining

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise chaining** é **pattern de encadear múltiplas operações assíncronas sequencialmente** usando `.then()`. Cada `.then()` retorna **nova Promise** - permite adicionar outro `.then()`. Diferentemente de callbacks aninhados (pyramid of doom), chaining mantém **código flat** - apenas um nível de indentação. Valor retornado em `.then()` torna-se **valor da próxima Promise na chain**.

Conceitualmente, chaining implementa **functional composition** - compor funções assíncronas. Segue **railway-oriented programming** - operações sequenciais com error handling automático. Promise chain é **monadic pipeline** - valores fluem através de transformações, erros short-circuit até `.catch()`. TypeScript infere **tipos através da chain** - `Promise<A> → Promise<B> → Promise<C>`.

**Fundamento teórico:** Chaining deriva de **continuation monad** - cada `.then()` é continuation do anterior. Implementa **pipeline pattern** - dados fluem através de estágios. Suporta **automatic error propagation** - erro em qualquer estágio pula `.then()` subsequentes até `.catch()`. Retornar Promise em `.then()` causa **automatic flattening** - `Promise<Promise<T>>` vira `Promise<T>`.

**Pattern básico:**
```typescript
// Promise chaining - operações sequenciais

function getUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

function getPosts(userId: number): Promise<Post[]> {
  return fetch(`/api/posts?userId=${userId}`).then(r => r.json());
}

function getComments(postId: number): Promise<Comment[]> {
  return fetch(`/api/comments?postId=${postId}`).then(r => r.json());
}

// Chain - flat, legível
getUser(1)
  .then(user => {
    console.log("User:", user.name);
    return getPosts(user.id);  // Retorna Promise<Post[]>
  })
  .then(posts => {
    console.log("Posts:", posts.length);
    return getComments(posts[0].id);  // Retorna Promise<Comment[]>
  })
  .then(comments => {
    console.log("Comments:", comments.length);
  })
  .catch(error => {
    console.error("Error:", error);
  });
```

**Fluxo da chain:**
```
getUser(1)           → Promise<User>
  ↓
.then(user => ...)   → Promise<Post[]>
  ↓
.then(posts => ...)  → Promise<Comment[]>
  ↓
.then(comments => ...) → Promise<void>
  ↓
.catch(error => ...)  → Captura qualquer erro
```

**Valor retornado propaga:**
```typescript
// Cada .then() retorna Promise - chaining possível

Promise.resolve(10)
  .then(value => value * 2)       // Promise<number> (20)
  .then(value => value.toString()) // Promise<string> ("20")
  .then(value => value.length)     // Promise<number> (2)
  .then(length => console.log(length)); // Promise<void>
```

### Contexto Histórico e Evolução

**JavaScript ES5 (2009):** Callbacks aninhados.

```javascript
// ES5 - callback hell ❌
getUser(1, function(error, user) {
  if (error) return handleError(error);
  
  getPosts(user.id, function(error, posts) {
    if (error) return handleError(error);
    
    getComments(posts[0].id, function(error, comments) {
      if (error) return handleError(error);
      
      // Pyramid of doom - 4 níveis
      console.log(comments);
    });
  });
});
```

**Libraries (2011-2014):** Q, Bluebird - chaining.

```javascript
// Q library (2011)
Q.fcall(getUser, 1)
  .then(function(user) {
    return getPosts(user.id);
  })
  .then(function(posts) {
    return getComments(posts[0].id);
  })
  .catch(function(error) {
    handleError(error);
  });

// Flat - chaining library-based
```

**ES6/ES2015:** Native Promise chaining.

```javascript
// ES6 - native Promise chaining ✅
getUser(1)
  .then(user => getPosts(user.id))
  .then(posts => getComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => handleError(error));

// Native, flat, compositional
```

**TypeScript 1.0 (2014):** Type-safe chaining.

```typescript
// TypeScript 1.0 - types através da chain
getUser(1)
  .then((user: User) => getPosts(user.id))
  .then((posts: Post[]) => getComments(posts[0].id))
  .then((comments: Comment[]) => console.log(comments));
```

**TypeScript 2.0 (2016):** Type inference.

```typescript
// TypeScript 2.0 - inference automático
getUser(1)
  .then(user => getPosts(user.id))  // user: User (inferido)
  .then(posts => getComments(posts[0].id))  // posts: Post[] (inferido)
  .then(comments => console.log(comments));  // comments: Comment[] (inferido)

// Sem type annotations - inferido automaticamente
```

**ES2017:** async/await - syntax sugar.

```typescript
// ES2017 - async/await equivalente
async function getData() {
  const user = await getUser(1);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  console.log(comments);
}

// Mesmo comportamento, syntax diferente
```

**Antes vs Depois:**

**Pré-Chaining (callbacks):**
```javascript
// Callbacks - pyramid of doom ❌
step1(function(result1) {
  step2(result1, function(result2) {
    step3(result2, function(result3) {
      step4(result3, function(result4) {
        step5(result4, function(result5) {
          // 6 níveis de indentação - ilegível
          console.log(result5);
        });
      });
    });
  });
});
```

**Pós-Chaining (Promises):**
```typescript
// Promise chaining - flat ✅
step1()
  .then(result1 => step2(result1))
  .then(result2 => step3(result2))
  .then(result3 => step4(result3))
  .then(result4 => step5(result4))
  .then(result5 => console.log(result5));

// 1 nível de indentação - legível
```

### Problema Fundamental que Resolve

Promise chaining resolve problemas de **callback hell**, **readability**, **error handling**, e **composition**.

**Problema 1: Pyramid of Doom - Ilegível**
```typescript
// Callbacks aninhados - pyramid of doom ❌

function fetchUserData(userId: number, callback: (data: any) => void) {
  fetchUser(userId, (error, user) => {
    if (error) return handleError(error);
    
    fetchProfile(user.id, (error, profile) => {
      if (error) return handleError(error);
      
      fetchSettings(user.id, (error, settings) => {
        if (error) return handleError(error);
        
        fetchPreferences(user.id, (error, preferences) => {
          if (error) return handleError(error);
          
          // 5 níveis de indentação - código "desliza" para direita
          // Difícil ler, manter, debugar
          callback({
            user,
            profile,
            settings,
            preferences
          });
        });
      });
    });
  });
}
```

**Solução: Chaining mantém código flat**
```typescript
// Promise chaining - flat, legível ✅

function fetchUserData(userId: number): Promise<UserData> {
  let user: User;
  let profile: Profile;
  let settings: Settings;
  
  return fetchUser(userId)
    .then(u => {
      user = u;
      return fetchProfile(user.id);
    })
    .then(p => {
      profile = p;
      return fetchSettings(user.id);
    })
    .then(s => {
      settings = s;
      return fetchPreferences(user.id);
    })
    .then(preferences => {
      return { user, profile, settings, preferences };
    });
}

// 1 nível de indentação consistente
// Flat, legível, maintainable
```

**Problema 2: Error Handling Duplicado**
```typescript
// Callbacks - error handling em cada nível ❌

operation1((error, result1) => {
  if (error) {
    logError(error);  // Duplicado
    notifyUser(error);
    return;
  }
  
  operation2(result1, (error, result2) => {
    if (error) {
      logError(error);  // Duplicado
      notifyUser(error);
      return;
    }
    
    operation3(result2, (error, result3) => {
      if (error) {
        logError(error);  // Duplicado
        notifyUser(error);
        return;
      }
      
      // Código error handling triplicado
    });
  });
});
```

**Solução: Single .catch() para toda chain**
```typescript
// Promise chaining - single error handler ✅

operation1()
  .then(result1 => operation2(result1))
  .then(result2 => operation3(result2))
  .then(result3 => console.log("Success:", result3))
  .catch(error => {
    logError(error);      // UM único lugar
    notifyUser(error);
  });

// Erro de QUALQUER .then() propaga para .catch()
// DRY - Don't Repeat Yourself
```

**Problema 3: Composition Difícil**
```typescript
// Callbacks - difícil compor operações ❌

function processData(data: Data, callback: (result: Result) => void) {
  validate(data, (error, validData) => {
    if (error) return callback(error);
    
    transform(validData, (error, transformedData) => {
      if (error) return callback(error);
      
      save(transformedData, (error, savedData) => {
        if (error) return callback(error);
        
        notify(savedData, (error, result) => {
          if (error) return callback(error);
          
          callback(null, result);
        });
      });
    });
  });
}

// Difícil adicionar/remover steps
// Difícil reordenar operações
```

**Solução: Chaining é compositional**
```typescript
// Promise chaining - compositional ✅

function processData(data: Data): Promise<Result> {
  return validate(data)
    .then(validData => transform(validData))
    .then(transformedData => save(transformedData))
    .then(savedData => notify(savedData));
}

// Fácil adicionar step:
function processDataExtended(data: Data): Promise<Result> {
  return validate(data)
    .then(validData => transform(validData))
    .then(transformedData => enrich(transformedData))  // ✅ Novo step
    .then(enrichedData => save(enrichedData))
    .then(savedData => notify(savedData));
}

// Fácil reordenar, adicionar, remover
```

**Problema 4: Values Across Callbacks**
```typescript
// Callbacks - difícil acessar valores anteriores ❌

function getData(callback: (data: CompleteData) => void) {
  fetchUser((error, user) => {
    if (error) return callback(error);
    
    // Precisamos 'user' nos próximos callbacks
    fetchPosts(user.id, (error, posts) => {
      if (error) return callback(error);
      
      // Precisamos 'user' e 'posts' aqui
      fetchComments(posts[0].id, (error, comments) => {
        if (error) return callback(error);
        
        // Finalmente temos user, posts, comments
        callback(null, { user, posts, comments });
      });
    });
  });
}

// user/posts disponíveis via closure
// Verboso, propenso a erros
```

**Solução: Acumular valores com chaining**
```typescript
// Promise chaining - accumulate values ✅

function getData(): Promise<CompleteData> {
  let user: User;
  let posts: Post[];
  
  return fetchUser()
    .then(u => {
      user = u;  // Guardar para depois
      return fetchPosts(user.id);
    })
    .then(p => {
      posts = p;  // Guardar para depois
      return fetchComments(posts[0].id);
    })
    .then(comments => {
      // Temos user, posts, comments
      return { user, posts, comments };
    });
}

// Ou usando Promise.all() para paralelo
function getDataParallel(userId: number): Promise<CompleteData> {
  return fetchUser(userId)
    .then(user => {
      return Promise.all([
        Promise.resolve(user),
        fetchPosts(user.id),
      ]);
    })
    .then(([user, posts]) => {
      return Promise.all([
        Promise.resolve(user),
        Promise.resolve(posts),
        fetchComments(posts[0].id),
      ]);
    })
    .then(([user, posts, comments]) => {
      return { user, posts, comments };
    });
}
```

**Fundamento teórico:** Chaining implementa **Kleisli composition** - compor funções que retornam monads (Promises).

### Importância no Ecossistema

Promise chaining é importante porque:

- **Readability:** Código flat vs pyramid
- **Composition:** Compor operações facilmente
- **Error handling:** Single .catch() handler
- **Sequential operations:** Order garantido
- **Type safety:** TypeScript infere tipos
- **Standard:** ES6 universal pattern
- **Foundation:** Base para async/await
- **Debugging:** Stack traces lineares

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Return new Promise:** `.then()` retorna Promise
2. **Flat chaining:** Evita pyramid of doom
3. **Sequential execution:** Order garantido
4. **Error propagation:** Até `.catch()`
5. **Type inference:** Tipos através da chain

### Pilares Fundamentais

- **Return Promise:** Permite chaining
- **Flattening:** `Promise<Promise<T>>` → `Promise<T>`
- **Value propagation:** Valor flui pela chain
- **Error short-circuit:** Skip .then() em erro
- **Single .catch():** Centralizar error handling

### Visão Geral das Nuances

- **Implicit return:** `value` vs `Promise<value>`
- **Mixed returns:** Valores e Promises
- **Error recovery:** .catch() pode retornar valor
- **Multiple .catch():** Re-throw errors
- **.finally() position:** Não quebra chain

## 🧠 Fundamentos Teóricos

### Basic Chaining

```typescript
// Basic chaining - sequential operations

Promise.resolve(10)
  .then(value => {
    console.log("Step 1:", value);  // 10
    return value * 2;
  })
  .then(value => {
    console.log("Step 2:", value);  // 20
    return value + 5;
  })
  .then(value => {
    console.log("Step 3:", value);  // 25
    return value.toString();
  })
  .then(value => {
    console.log("Step 4:", value);  // "25"
  });

// Cada .then() retorna Promise
// Valor retornado vira valor da próxima Promise
```

**Basic:** Sequential transformations.

### Princípios e Conceitos Subjacentes

#### Return Promise - Flattening

```typescript
// Retornar Promise em .then() - auto-flattening

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

Promise.resolve("Start")
  .then(value => {
    console.log(value);  // "Start"
    return delay(1000);  // Retorna Promise<void>
  })
  .then(() => {
    console.log("After 1 second");  // Executado após delay
    return delay(500);
  })
  .then(() => {
    console.log("After 1.5 seconds total");
  });

// Retornar Promise - próximo .then() espera resolução
// Não é Promise<Promise<void>> - é Promise<void> (flattened)
```

**Flattening:** Automatic Promise unwrapping.

#### Return Value vs Return Promise

```typescript
// Return value - wrapped em Promise
// Return Promise - flattened

Promise.resolve(10)
  .then(value => {
    return value * 2;  // Return 20 - wrapped em Promise<number>
  })
  .then(value => {
    console.log(value);  // 20
    return Promise.resolve(value * 2);  // Return Promise<number>
  })
  .then(value => {
    console.log(value);  // 40 (Promise flattened)
  });

// Ambos funcionam - Promise wrapping/flattening automático
```

**Return Types:** Value wrapped, Promise flattened.

### Sequential Async Operations

```typescript
// Operações assíncronas sequenciais - garantir ordem

function fetchUser(id: number): Promise<User> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: "Alice", email: "alice@example.com" });
    }, 100);
  });
}

function fetchPosts(userId: number): Promise<Post[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, userId, title: "Post 1" },
        { id: 2, userId, title: "Post 2" },
      ]);
    }, 100);
  });
}

function fetchComments(postId: number): Promise<Comment[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, postId, text: "Comment 1" },
        { id: 2, postId, text: "Comment 2" },
      ]);
    }, 100);
  });
}

// Chain - sequential execution
fetchUser(1)
  .then(user => {
    console.log("User:", user.name);
    return fetchPosts(user.id);  // Espera fetchUser completar
  })
  .then(posts => {
    console.log("Posts:", posts.length);
    return fetchComments(posts[0].id);  // Espera fetchPosts completar
  })
  .then(comments => {
    console.log("Comments:", comments.length);  // Espera fetchComments completar
  });

// Order garantido: fetchUser → fetchPosts → fetchComments
// Total: ~300ms (sequential)
```

**Sequential:** Garantir ordem de execução.

#### Error Propagation Through Chain

```typescript
// Erro propaga através da chain até .catch()

Promise.resolve(10)
  .then(value => {
    console.log("Step 1:", value);  // "Step 1: 10"
    return value * 2;
  })
  .then(value => {
    console.log("Step 2:", value);  // "Step 2: 20"
    throw new Error("Something failed");  // ✗ Erro!
  })
  .then(value => {
    console.log("Step 3:", value);  // ✗ SKIPPED
    return value * 2;
  })
  .then(value => {
    console.log("Step 4:", value);  // ✗ SKIPPED
    return value * 2;
  })
  .catch(error => {
    console.error("Caught:", error.message);  // "Caught: Something failed"
  })
  .then(() => {
    console.log("Continues after catch");  // ✓ Executa
  });

// Step 3 e 4 skipped
// Erro propaga até primeiro .catch()
// Chain pode continuar após .catch()
```

**Error Propagation:** Skip .then() até .catch().

### Accumulate Values Across Chain

```typescript
// Acumular valores através da chain

interface UserData {
  user: User;
  posts: Post[];
  comments: Comment[];
}

function getUserData(userId: number): Promise<UserData> {
  let user: User;
  let posts: Post[];
  
  return fetchUser(userId)
    .then(u => {
      user = u;  // Guardar user
      return fetchPosts(user.id);
    })
    .then(p => {
      posts = p;  // Guardar posts
      return fetchComments(posts[0].id);
    })
    .then(comments => {
      // Agora temos user, posts, comments
      return { user, posts, comments };
    });
}

// Usar
getUserData(1).then(data => {
  console.log(data.user.name);
  console.log(data.posts.length);
  console.log(data.comments.length);
});
```

**Accumulate:** Guardar valores intermediários.

#### Transform Types Through Chain

```typescript
// Transformar tipos através da chain

interface User {
  id: number;
  name: string;
}

interface UserDTO {
  userId: number;
  userName: string;
  uppercaseName: string;
}

function transformUserData(userId: number): Promise<UserDTO> {
  return fetchUser(userId)           // Promise<User>
    .then((user: User) => {
      return {
        userId: user.id,
        userName: user.name
      };                               // Promise<{userId, userName}>
    })
    .then(dto => {
      return {
        ...dto,
        uppercaseName: dto.userName.toUpperCase()
      };                               // Promise<UserDTO>
    });
}

// Promise<User> → Promise<UserDTO>
// TypeScript infere tipos automaticamente
```

**Type Transformation:** Tipos através da chain.

### Real-World Example - Data Pipeline

```typescript
// Pipeline de dados - fetch, validate, transform, save

interface RawData {
  id: number;
  value: string;
}

interface ValidatedData {
  id: number;
  value: string;
  isValid: true;
}

interface TransformedData {
  id: number;
  processedValue: string;
  timestamp: number;
}

function fetchRawData(id: number): Promise<RawData> {
  return fetch(`/api/data/${id}`).then(r => r.json());
}

function validateData(data: RawData): Promise<ValidatedData> {
  return new Promise((resolve, reject) => {
    if (data.value.length > 0) {
      resolve({ ...data, isValid: true });
    } else {
      reject(new Error("Invalid data"));
    }
  });
}

function transformData(data: ValidatedData): Promise<TransformedData> {
  return Promise.resolve({
    id: data.id,
    processedValue: data.value.toUpperCase(),
    timestamp: Date.now()
  });
}

function saveData(data: TransformedData): Promise<void> {
  return fetch('/api/save', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(() => undefined);
}

// Pipeline completo - chaining
function processDataPipeline(id: number): Promise<void> {
  return fetchRawData(id)
    .then(rawData => validateData(rawData))
    .then(validatedData => transformData(validatedData))
    .then(transformedData => saveData(transformedData))
    .then(() => {
      console.log("Pipeline complete");
    })
    .catch(error => {
      console.error("Pipeline failed:", error.message);
      throw error;  // Re-throw
    });
}

// Usar
processDataPipeline(123);
```

**Real-World:** Complete data pipeline.

#### Modelo Mental para Compreensão

Pense em chaining como **assembly line**:

**Assembly line:** Produto passa por estações
**Promise chain:** Valor passa por .then()
**Each station:** Transforma produto
**Each .then():** Transforma valor
**Quality control:** .catch() detecta defeitos
**Final product:** Valor final

**Analogia - Water Pipeline:**

**Water source:** Promise inicial
**Pipe sections:** .then() transformations
**Valves:** Controlar fluxo
**Filters:** Transformar água
**Leak detector:** .catch() errors
**Destination:** Valor final

**Metáfora - Mail Delivery Route:**

**Package:** Valor inicial
**Delivery route:** Chain de .then()
**Each stop:** Transformação
**Final destination:** Último .then()
**Return to sender:** .catch() error

**Fluxo visual:**
```
Promise.resolve(10)
       ↓
.then(x => x * 2)      → 20
       ↓
.then(x => x + 5)      → 25
       ↓
.then(x => x.toString()) → "25"
       ↓
.then(x => console.log(x))
       ↓
  Final result
```

## 🔍 Análise Conceitual Profunda

### Chaining vs Nesting

```typescript
// Anti-pattern - nesting .then() (pyramid) ❌

fetchUser(1)
  .then(user => {
    return fetchPosts(user.id)
      .then(posts => {
        return fetchComments(posts[0].id)
          .then(comments => {
            // Pyramid voltou! Não fazer isso
            return { user, posts, comments };
          });
      });
  });

// Correto - flat chaining ✅

let user: User;
let posts: Post[];

fetchUser(1)
  .then(u => {
    user = u;
    return fetchPosts(user.id);
  })
  .then(p => {
    posts = p;
    return fetchComments(posts[0].id);
  })
  .then(comments => {
    return { user, posts, comments };
  });
```

**Anti-pattern:** Evitar nesting .then().

### Multiple Error Handlers

```typescript
// Múltiplos .catch() handlers - recovery

function robustFetch(url: string): Promise<Response> {
  return fetch(url)
    .catch(error => {
      console.error("Fetch failed, retrying...");
      return fetch(url);  // Retry
    })
    .catch(error => {
      console.error("Retry failed, using cache");
      return getCachedResponse(url);  // Fallback
    })
    .catch(error => {
      console.error("All attempts failed");
      throw error;  // Re-throw
    });
}
```

**Multiple .catch():** Retry/fallback strategies.

#### .finally() in Chain

```typescript
// .finally() não quebra chain

let isLoading = false;

function fetchData(): Promise<Data> {
  isLoading = true;
  
  return fetch('/api/data')
    .then(response => response.json())
    .finally(() => {
      isLoading = false;  // Cleanup
    })
    .then(data => {
      // Chain continua - .finally() transparente
      console.log("Data:", data);
      return data;
    });
}
```

**.finally():** Não quebra chain.

### Parallel vs Sequential

```typescript
// Sequential - chaining (300ms total)

fetchUser(1)
  .then(user => fetchPosts(user.id))   // Espera user
  .then(posts => fetchComments(posts[0].id));  // Espera posts

// Parallel - Promise.all() (100ms total)

Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1)
]).then(([user, posts, comments]) => {
  // Todas executaram em paralelo
});
```

**Parallel vs Sequential:** Escolher apropriadamente.

## 🎯 Aplicabilidade e Contextos

### API Data Fetching

```typescript
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .catch(error => handleError(error));
```

**Raciocínio:** Sequential dependencies.

### Data Processing Pipeline

```typescript
loadData()
  .then(data => validate(data))
  .then(valid => transform(valid))
  .then(transformed => save(transformed))
  .catch(error => rollback(error));
```

**Raciocínio:** Multi-step pipeline.

### File Operations

```typescript
readFile('input.txt')
  .then(content => processContent(content))
  .then(processed => writeFile('output.txt', processed))
  .catch(error => console.error(error));
```

**Raciocínio:** Sequential I/O.

## ⚠️ Limitações e Considerações Teóricas

### Forgetting to Return

```typescript
// Esquecer return - quebra chain ❌

Promise.resolve(10)
  .then(value => {
    Promise.resolve(value * 2);  // ✗ Sem return
  })
  .then(value => {
    console.log(value);  // undefined - não retornou anterior
  });

// Correto - return Promise ✅
Promise.resolve(10)
  .then(value => {
    return Promise.resolve(value * 2);  // ✓ Return
  })
  .then(value => {
    console.log(value);  // 20
  });
```

**Limitação:** Lembrar return.

### Long Chains - Readability

```typescript
// Chain muito longa - difícil ler

fetchUser()
  .then(user => fetchProfile(user.id))
  .then(profile => fetchSettings(profile.id))
  .then(settings => fetchPreferences(settings.id))
  .then(prefs => fetchNotifications(prefs.id))
  .then(notifs => fetchMessages(notifs.id))
  .then(messages => processMessages(messages));

// Considerar async/await para chains longas
async function getData() {
  const user = await fetchUser();
  const profile = await fetchProfile(user.id);
  // ...
}
```

**Consideração:** async/await para readability.

### Error Position Matters

```typescript
// .catch() position importa

promise
  .then(step1)
  .catch(handleError)  // Captura erros de step1
  .then(step2);        // Executa mesmo com erro em step1

// vs

promise
  .then(step1)
  .then(step2)
  .catch(handleError);  // Captura erros de step1 E step2
```

**Consideração:** .catch() placement strategy.

## 🔗 Interconexões Conceituais

**Relação com .then():** Foundation de chaining.

**Relação com async/await:** Syntax sugar.

**Relação com Promise.all():** Parallel operations.

**Relação com Error handling:** Propagação.

**Relação com Functional programming:** Composition.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise chaining prepara para:
- **async/await:** Syntax sugar para chains
- **Promise.all():** Operações paralelas
- **Promise.race():** Competição
- **Error handling:** Try/catch async
- **Functional composition:** Compose functions
- **Generators:** yield/async iteration
