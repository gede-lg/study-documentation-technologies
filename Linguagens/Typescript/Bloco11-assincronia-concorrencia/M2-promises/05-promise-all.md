# Promise.all()

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.all()** é **método estático que executa múltiplas Promises em paralelo** e **retorna Promise única** que resolve quando **todas Promises resolvem**. Aceita **array (ou iterable) de Promises** e retorna **`Promise<Array<T>>`** - array com valores resolvidos na mesma ordem. Se **qualquer Promise rejeita**, Promise.all() **rejeita imediatamente** com erro da primeira Promise rejeitada (fail-fast behavior).

Diferentemente de chaining sequencial (espera uma completar para iniciar próxima), Promise.all() **inicia todas simultaneamente** - true parallel execution. Conceitualmente, implementa **concurrent composition** - compor operações paralelas. Seguindo **all-or-nothing semantics** - ou todas succedem ou resultado é erro. TypeScript preserva **tipos individuais** - `Promise.all([Promise<A>, Promise<B>])` retorna `Promise<[A, B]>` (tuple types).

**Fundamento teórico:** Promise.all() deriva de **applicative functor** - aplicar função sobre múltiplos contextos (Promises). Implementa **fork-join pattern** - fork múltiplas operações, join resultados. Suporta **short-circuit evaluation** - parar em primeiro erro. É **deterministic** - mesma entrada sempre produz mesma saída (order preserved). Performance improvement vem de **concurrent I/O** - operações I/O-bound executam em paralelo.

**Pattern básico:**
```typescript
// Promise.all() - executar múltiplas Promises em paralelo

const promise1 = fetch('/api/users').then(r => r.json());
const promise2 = fetch('/api/posts').then(r => r.json());
const promise3 = fetch('/api/comments').then(r => r.json());

// Executar todas em paralelo
Promise.all([promise1, promise2, promise3])
  .then(([users, posts, comments]) => {
    console.log("Users:", users);
    console.log("Posts:", posts);
    console.log("Comments:", comments);
    // Todos os dados disponíveis simultaneamente
  })
  .catch(error => {
    console.error("One or more requests failed:", error);
  });
```

**Performance comparison:**
```typescript
// Sequential (chaining) - LENTO ❌

const start1 = Date.now();

fetchUsers()
  .then(users => fetchPosts())    // Espera users
  .then(posts => fetchComments()) // Espera posts
  .then(comments => {
    console.log("Time:", Date.now() - start1);  // ~3000ms
  });

// Parallel (Promise.all) - RÁPIDO ✅

const start2 = Date.now();

Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]).then(results => {
  console.log("Time:", Date.now() - start2);  // ~1000ms
});

// 3x faster - operações em paralelo
```

**Fail-fast behavior:**
```typescript
// Qualquer rejeição → Promise.all() rejeita imediatamente

const p1 = Promise.resolve(1);
const p2 = Promise.reject(new Error("Failed"));
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
  .then(results => {
    console.log(results);  // ✗ Nunca executado
  })
  .catch(error => {
    console.error("Error:", error.message);  // "Failed"
  });

// p2 rejeita → Promise.all() rejeita
// p3 ainda completa (não é cancelada), mas resultado ignorado
```

### Contexto Histórico e Evolução

**ES6/ES2015:** Promise.all() introduzido.

```javascript
// ES6 - Promise.all() nativo
Promise.all([
  fetch('/api/user'),
  fetch('/api/posts')
]).then(([userResponse, postsResponse]) => {
  // Ambos responses disponíveis
});
```

**TypeScript 1.0 (2014):** Typed Promise.all().

```typescript
// TypeScript 1.0 - type-safe
const promises: Promise<number>[] = [
  Promise.resolve(1),
  Promise.resolve(2)
];

Promise.all(promises).then((results: number[]) => {
  console.log(results);  // [1, 2]
});
```

**TypeScript 3.0 (2018):** Tuple types.

```typescript
// TypeScript 3.0 - preserve individual types
Promise.all([
  Promise.resolve(42),        // number
  Promise.resolve("hello"),   // string
  Promise.resolve(true)       // boolean
]).then(([num, str, bool]) => {
  // num: number
  // str: string
  // bool: boolean
  // Tipos preservados - não any[]
});
```

**ES2020:** Promise.allSettled() adicionado.

```javascript
// ES2020 - allSettled não fail-fast
Promise.allSettled([p1, p2, p3])
  .then(results => {
    // Todos resultados, sucesso ou erro
  });

// Alternativa a Promise.all() fail-fast
```

**TypeScript 4.0 (2020):** Variadic tuple types.

```typescript
// TypeScript 4.0 - melhor inference
function promiseAll<T extends readonly unknown[]>(
  values: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }>;

// Inference preciso para Promise.all()
```

**Antes vs Depois:**

**Pré-Promise.all() (callbacks nested):**
```javascript
// Callbacks - difícil paralelizar ❌

let users, posts, comments;
let completed = 0;

fetchUsers(function(error, u) {
  if (error) return handleError(error);
  users = u;
  if (++completed === 3) process(users, posts, comments);
});

fetchPosts(function(error, p) {
  if (error) return handleError(error);
  posts = p;
  if (++completed === 3) process(users, posts, comments);
});

fetchComments(function(error, c) {
  if (error) return handleError(error);
  comments = c;
  if (++completed === 3) process(users, posts, comments);
});

// Verboso, propenso a race conditions
```

**Pós-Promise.all():**
```typescript
// Promise.all() - clean, parallel ✅

Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]).then(([users, posts, comments]) => {
  process(users, posts, comments);
}).catch(handleError);

// Conciso, seguro, parallel
```

### Problema Fundamental que Resolve

Promise.all() resolve problemas de **sequential bottleneck**, **callback coordination**, **error handling paralelo**, e **type safety**.

**Problema 1: Sequential Bottleneck - Lento**
```typescript
// Chaining sequencial - unnecessarily slow ❌

async function getAllData() {
  const start = Date.now();
  
  const users = await fetchUsers();        // 1000ms
  const posts = await fetchPosts();        // 1000ms
  const comments = await fetchComments();  // 1000ms
  
  console.log("Time:", Date.now() - start);  // ~3000ms
  
  return { users, posts, comments };
}

// Operações independentes executadas sequencialmente
// Desperdiça tempo - podiam executar em paralelo
```

**Solução: Promise.all() paralelo - rápido**
```typescript
// Promise.all() - parallel execution ✅

async function getAllData() {
  const start = Date.now();
  
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),        // Inicia imediatamente
    fetchPosts(),        // Inicia imediatamente
    fetchComments()      // Inicia imediatamente
  ]);
  
  console.log("Time:", Date.now() - start);  // ~1000ms (3x faster!)
  
  return { users, posts, comments };
}

// Operações executam em paralelo
// Tempo total = operação mais lenta (não soma)
```

**Problema 2: Callback Coordination - Complexo**
```typescript
// Callbacks - difícil coordenar múltiplas operações ❌

function getAllData(callback: (error: Error | null, data?: Data) => void) {
  let users: User[], posts: Post[], comments: Comment[];
  let errors: Error[] = [];
  let completed = 0;
  const total = 3;
  
  function checkComplete() {
    if (++completed === total) {
      if (errors.length > 0) {
        callback(errors[0]);
      } else {
        callback(null, { users, posts, comments });
      }
    }
  }
  
  fetchUsers((error, u) => {
    if (error) errors.push(error);
    else users = u;
    checkComplete();
  });
  
  fetchPosts((error, p) => {
    if (error) errors.push(error);
    else posts = p;
    checkComplete();
  });
  
  fetchComments((error, c) => {
    if (error) errors.push(error);
    else comments = c;
    checkComplete();
  });
}

// Verboso, propenso a bugs, race conditions
```

**Solução: Promise.all() coordena automaticamente**
```typescript
// Promise.all() - automatic coordination ✅

function getAllData(): Promise<Data> {
  return Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]).then(([users, posts, comments]) => {
    return { users, posts, comments };
  });
}

// Conciso, seguro, automatic
// Sem race conditions, sem contadores manuais
```

**Problema 3: Error Handling Duplicado**
```typescript
// Sem Promise.all() - error handling complexo ❌

async function getData() {
  try {
    const users = await fetchUsers();
  } catch (error) {
    handleError(error);
    return;
  }
  
  try {
    const posts = await fetchPosts();
  } catch (error) {
    handleError(error);
    return;
  }
  
  try {
    const comments = await fetchComments();
  } catch (error) {
    handleError(error);
    return;
  }
  
  // Error handling triplicado
}
```

**Solução: Promise.all() single error handler**
```typescript
// Promise.all() - single catch ✅

async function getData() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);
    
    return { users, posts, comments };
  } catch (error) {
    handleError(error);  // UM único handler
  }
}

// Erro de qualquer Promise → catch
// DRY - Don't Repeat Yourself
```

**Problema 4: Lose Type Information**
```typescript
// Array homogêneo - perde tipos individuais ❌

const promises: Promise<any>[] = [
  fetchUsers(),     // Promise<User[]>
  fetchPosts(),     // Promise<Post[]>
  fetchComments()   // Promise<Comment[]>
];

Promise.all(promises).then((results: any[]) => {
  // results é any[] - perdeu type information
  const users = results[0];  // any - unsafe
  const posts = results[1];  // any - unsafe
});
```

**Solução: Promise.all() preserva tipos (tuple)**
```typescript
// Promise.all() - preserve types ✅

Promise.all([
  fetchUsers(),     // Promise<User[]>
  fetchPosts(),     // Promise<Post[]>
  fetchComments()   // Promise<Comment[]>
]).then(([users, posts, comments]) => {
  // users: User[] (type-safe)
  // posts: Post[] (type-safe)
  // comments: Comment[] (type-safe)
  
  console.log(users[0].name);  // ✓ Type-safe
});

// TypeScript infere tuple type [User[], Post[], Comment[]]
```

**Fundamento teórico:** Promise.all() implementa **concurrent reduction** - reduzir múltiplas Promises a single result, executando em paralelo.

### Importância no Ecossistema

Promise.all() é importante porque:

- **Performance:** Parallel execution (I/O-bound)
- **Coordination:** Sincronizar múltiplas Promises
- **Simplicity:** Código conciso vs callbacks
- **Type safety:** Preserva tipos individuais
- **Error handling:** Single catch handler
- **Standard:** ES6 universal pattern
- **Testing:** Aguardar múltiplos mocks
- **Data fetching:** Multiple APIs simultaneously

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Parallel execution:** Inicia todas simultaneamente
2. **Wait all:** Resolve quando todas resolvem
3. **Fail-fast:** Rejeita na primeira rejeição
4. **Order preserved:** Array mantém ordem
5. **Tuple types:** TypeScript preserva tipos

### Pilares Fundamentais

- **Input:** Array (iterable) de Promises
- **Output:** Promise<Array<T>> com resultados
- **Parallel:** Não é sequential
- **All-or-nothing:** Todas ou erro
- **Deterministic:** Mesma ordem sempre

### Visão Geral das Nuances

- **Empty array:** Promise.all([]) → resolve([])
- **Non-Promise values:** Auto-wrapped
- **Execution starts:** Before Promise.all()
- **Short-circuit:** Primeira rejeição para tudo
- **Pending Promises:** Continuam (não cancelam)

## 🧠 Fundamentos Teóricos

### Basic Promise.all()

```typescript
// Basic Promise.all() - parallel execution

const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then(results => {
  console.log(results);  // [1, 2, 3]
  // Array com valores na mesma ordem
});
```

**Basic:** Executar múltiplas em paralelo.

### Princípios e Conceitos Subjacentes

#### Timing - Parallel Execution

```typescript
// Comparar timing - sequential vs parallel

function delay(ms: number, value: number): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}

// Sequential - 6000ms total ❌
async function sequential() {
  const start = Date.now();
  
  const a = await delay(2000, 1);  // 2000ms
  const b = await delay(2000, 2);  // +2000ms = 4000ms
  const c = await delay(2000, 3);  // +2000ms = 6000ms
  
  console.log("Sequential:", Date.now() - start);  // ~6000ms
  return [a, b, c];
}

// Parallel - 2000ms total ✅
async function parallel() {
  const start = Date.now();
  
  const [a, b, c] = await Promise.all([
    delay(2000, 1),  // Inicia simultaneamente
    delay(2000, 2),  // Inicia simultaneamente
    delay(2000, 3)   // Inicia simultaneamente
  ]);
  
  console.log("Parallel:", Date.now() - start);  // ~2000ms (3x faster!)
  return [a, b, c];
}
```

**Timing:** Parallel 3x mais rápido.

#### Fail-Fast Behavior

```typescript
// Primeira rejeição → Promise.all() rejeita

const p1 = delay(1000, 1);
const p2 = Promise.reject(new Error("Failed at p2"));
const p3 = delay(3000, 3);

Promise.all([p1, p2, p3])
  .then(results => {
    console.log(results);  // ✗ Nunca executado
  })
  .catch(error => {
    console.error("Error:", error.message);  // "Failed at p2"
  });

// p2 rejeita imediatamente → Promise.all() rejeita
// p1 e p3 continuam executando (não são canceladas)
// Mas resultados são ignorados
```

**Fail-Fast:** Primeira rejeição para tudo.

### Order Preservation

```typescript
// Ordem preservada - mesmo com tempos diferentes

Promise.all([
  delay(3000, "third"),   // Mais lento
  delay(1000, "first"),   // Mais rápido
  delay(2000, "second")   // Médio
]).then(results => {
  console.log(results);  // ["third", "first", "second"]
  // Ordem do array input, não ordem de conclusão
});
```

**Order:** Sempre mesma ordem do input.

#### Type Preservation

```typescript
// TypeScript - tipos preservados (tuple)

interface User { id: number; name: string; }
interface Post { id: number; title: string; }
interface Comment { id: number; text: string; }

Promise.all([
  fetchUser(1),      // Promise<User>
  fetchPosts(),      // Promise<Post[]>
  fetchComments()    // Promise<Comment[]>
]).then(([user, posts, comments]) => {
  // user: User (não any)
  // posts: Post[] (não any)
  // comments: Comment[] (não any)
  
  console.log(user.name);          // ✓ Type-safe
  console.log(posts[0].title);     // ✓ Type-safe
  console.log(comments[0].text);   // ✓ Type-safe
});

// Tuple type: [User, Post[], Comment[]]
```

**Types:** Tuple types preservam tipos individuais.

### Non-Promise Values

```typescript
// Valores não-Promise - auto-wrapped

Promise.all([
  Promise.resolve(1),
  2,                      // Não é Promise
  Promise.resolve(3),
  4                       // Não é Promise
]).then(results => {
  console.log(results);  // [1, 2, 3, 4]
});

// Valores não-Promise wrapped em Promise.resolve()
// Equivalente: Promise.all([Promise.resolve(1), Promise.resolve(2), ...])
```

**Non-Promises:** Auto-wrapped.

#### Empty Array

```typescript
// Array vazio - resolve imediatamente

Promise.all([]).then(results => {
  console.log(results);  // []
  console.log("Resolved immediately");
});

// Promise.all([]) resolve com []
// Útil em casos edge
```

**Empty Array:** Resolve imediatamente.

### Real-World Example - Multiple API Calls

```typescript
// Fetch múltiplas APIs em paralelo

interface Dashboard {
  user: User;
  stats: Stats;
  notifications: Notification[];
  recentActivity: Activity[];
}

async function loadDashboard(userId: number): Promise<Dashboard> {
  const start = Date.now();
  
  try {
    const [user, stats, notifications, recentActivity] = await Promise.all([
      fetch(`/api/users/${userId}`).then(r => r.json()),
      fetch(`/api/stats/${userId}`).then(r => r.json()),
      fetch(`/api/notifications/${userId}`).then(r => r.json()),
      fetch(`/api/activity/${userId}`).then(r => r.json())
    ]);
    
    console.log("Load time:", Date.now() - start);  // ~500ms (parallel)
    // vs ~2000ms sequential (4 requests × 500ms each)
    
    return { user, stats, notifications, recentActivity };
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    throw error;
  }
}

// Usar
loadDashboard(123).then(dashboard => {
  console.log("Dashboard loaded:", dashboard);
});
```

**Real-World:** Dashboard loading pattern.

#### Modelo Mental para Compreensão

Pense em Promise.all() como **team project**:

**Team members:** Promises individuais
**Work in parallel:** Todos trabalham simultaneamente
**Project complete:** Quando todos terminam
**One fails:** Projeto falha

**Analogia - Restaurant Orders:**

**Multiple orders:** Múltiplas Promises
**Kitchen cooks:** Executam em paralelo
**Table served:** Quando todos pratos prontos
**One burnt:** Cancelar mesa inteira

**Metáfora - Race Team:**

**Relay race:** Sequential (lento)
**Team sprint:** Parallel (rápido)
**Finish together:** Aguardar todos
**One disqualified:** Equipe desqualificada

**Fluxo visual:**
```
Promise.all([p1, p2, p3])
        ↓
   p1  p2  p3  ← Iniciam simultaneamente
    ↓   ↓   ↓
   1s  2s  1.5s ← Executam em paralelo
        ↓
  Aguarda mais lento (2s)
        ↓
  [result1, result2, result3]
```

## 🔍 Análise Conceitual Profunda

### Execution Start Before Promise.all()

```typescript
// Promises executam ANTES de Promise.all() ⚠️

console.log("Start");

const p1 = fetch('/api/data1');  // ✓ Executando JÁ
const p2 = fetch('/api/data2');  // ✓ Executando JÁ
const p3 = fetch('/api/data3');  // ✓ Executando JÁ

console.log("Promises created");

// Aguardar alguns milliseconds
setTimeout(() => {
  Promise.all([p1, p2, p3]).then(results => {
    console.log("Results:", results);
  });
}, 1000);

// p1, p2, p3 já estão executando
// Promise.all() apenas aguarda conclusão
```

**Execution:** Promises já executando.

### Partial Results on Error

```typescript
// Erro - sem acesso a resultados parciais ❌

const p1 = delay(1000, 1);
const p2 = Promise.reject(new Error("Failed"));
const p3 = delay(500, 3);

Promise.all([p1, p2, p3])
  .catch(error => {
    console.error("Error:", error);
    // Não temos acesso a p3 (que pode ter completado)
  });

// Solução - Promise.allSettled() para resultados parciais
Promise.allSettled([p1, p2, p3])
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`p${index + 1} success:`, result.value);
      } else {
        console.error(`p${index + 1} failed:`, result.reason);
      }
    });
  });
```

**Partial Results:** Use allSettled().

#### Combining with Other Combinators

```typescript
// Combinar Promise.all() com Promise.race()

// Timeout pattern - fail se demorar muito
function withTimeout<T>(
  promises: Promise<T>[],
  timeoutMs: number
): Promise<T[]> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeoutMs);
  });
  
  return Promise.race([
    Promise.all(promises),
    timeout
  ]);
}

// Usar
withTimeout([
  fetch('/api/data1'),
  fetch('/api/data2')
], 5000).then(results => {
  console.log("Success:", results);
}).catch(error => {
  console.error("Failed or timeout:", error);
});
```

**Combinators:** Combinar all() + race().

### Performance Considerations

```typescript
// Performance - CPU-bound vs I/O-bound

// I/O-bound - Promise.all() acelera ✅
Promise.all([
  fetch('/api/data1'),   // Network I/O
  fetch('/api/data2'),   // Network I/O
  fetch('/api/data3')    // Network I/O
]);
// Parallel - 3x faster

// CPU-bound - Promise.all() não ajuda ⚠️
Promise.all([
  calculatePrimes(1000000),  // CPU-bound
  calculatePrimes(1000000),  // CPU-bound
  calculatePrimes(1000000)   // CPU-bound
]);
// JavaScript single-threaded - não paralelo real
// Use Web Workers para CPU-bound parallelism
```

**Performance:** I/O-bound benefits, CPU-bound não.

## 🎯 Aplicabilidade e Contextos

### Multiple API Calls

```typescript
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]).then(([users, posts, comments]) => {
  // Process all data
});
```

**Raciocínio:** Independent API calls.

### File Operations

```typescript
Promise.all([
  readFile('file1.txt'),
  readFile('file2.txt'),
  readFile('file3.txt')
]).then(([content1, content2, content3]) => {
  // Process all files
});
```

**Raciocínio:** Parallel file reads.

### Database Queries

```typescript
Promise.all([
  db.query('SELECT * FROM users'),
  db.query('SELECT * FROM orders'),
  db.query('SELECT * FROM products')
]).then(([users, orders, products]) => {
  // Combine data
});
```

**Raciocínio:** Independent queries.

## ⚠️ Limitações e Considerações Teóricas

### No Cancellation

```typescript
// Promises não podem ser canceladas

const p1 = delay(5000, 1);
const p2 = Promise.reject(new Error("Failed"));

Promise.all([p1, p2])
  .catch(error => {
    console.error("Error:", error);
  });

// p2 rejeita, mas p1 CONTINUA executando
// Não há como cancelar p1
```

**Limitação:** Promises continuam executando.

### First Error Only

```typescript
// Apenas primeiro erro - outros ignorados

const p1 = Promise.reject(new Error("Error 1"));
const p2 = Promise.reject(new Error("Error 2"));
const p3 = Promise.reject(new Error("Error 3"));

Promise.all([p1, p2, p3])
  .catch(error => {
    console.error(error.message);  // "Error 1" apenas
    // Error 2 e Error 3 ignorados
  });

// Use Promise.allSettled() para todos erros
```

**Limitação:** Apenas primeiro erro.

### Memory with Large Arrays

```typescript
// Array grande - memory considerations

const promises = Array.from({ length: 10000 }, (_, i) => 
  fetch(`/api/data/${i}`)
);

Promise.all(promises);  // ⚠️ 10000 requests simultâneos
// Pode sobrecarregar servidor/network

// Solução - batch processing
async function batchAll<T>(
  promises: Promise<T>[],
  batchSize: number
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < promises.length; i += batchSize) {
    const batch = promises.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  
  return results;
}

batchAll(promises, 10);  // 10 por vez
```

**Consideração:** Batch para grandes volumes.

## 🔗 Interconexões Conceituais

**Relação com Promise.race():** First vs all.

**Relação com Promise.allSettled():** Fail-fast vs all results.

**Relação com async/await:** await Promise.all().

**Relação com Concurrency:** Parallel execution.

**Relação com Performance:** I/O optimization.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise.all() prepara para:
- **Promise.race():** Primeira a resolver
- **Promise.allSettled():** Todas com resultado
- **Promise.any():** Primeira fulfilled
- **Concurrency control:** Rate limiting
- **Batch processing:** Chunking
- **Error aggregation:** Collect all errors
