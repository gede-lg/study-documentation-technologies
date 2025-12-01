# Loops com Async/Await

## 🎯 Introdução e Definição

### Definição Conceitual

**Loops com async/await** são **iteration patterns** que combinam **loop constructs** (for, while, for...of) com **await expressions**, permitindo **sequential ou parallel async iteration**. Diferentes loop types produzem **diferentes execution behaviors** - `for...of` com await executa **sequencialmente**, enquanto `map()` + `Promise.all()` executa **paralelamente**. Pattern escolha depende se **order matters** e se **operations são independentes**.

Conceitualmente, loops assíncronos implementam **iterated async execution** - aplicar operação assíncrona a múltiplos items. Seguem **sequential vs parallel semantics** - `for await` sequencial, `Promise.all(map())` paralelo. Cada pattern tem **performance tradeoffs** - sequential slower mas preserva ordem, parallel faster mas sem ordem garantida.

**Fundamento teórico:** Loops assíncronos derivam de **iteration patterns** transposto para contexto assíncrono. Implementam **collection processing** - transformar/filtrar/reduzir collections assincronamente. Seguem **blocking vs non-blocking** - await em loop bloqueia próxima iteração, Promise.all não bloqueia. Performance depende de **dependency structure** - sequential para dependent, parallel para independent.

**Pattern básico:**
```typescript
// Loop patterns - sequential vs parallel

// Sequential loop - 1 por vez ❌ (slow se independentes)
async function sequentialLoop(ids: number[]): Promise<User[]> {
  const users: User[] = [];
  
  for (const id of ids) {
    const user = await fetchUser(id);  // Wait cada um
    users.push(user);
  }
  
  return users;
}

// 10 IDs × 100ms each = 1000ms total

// Parallel loop - todos juntos ✅ (fast se independentes)
async function parallelLoop(ids: number[]): Promise<User[]> {
  return await Promise.all(
    ids.map(id => fetchUser(id))  // Todos concorrentes
  );
}

// 10 IDs × 100ms = 100ms total (10x faster!)

// Sequential quando ordem importa ou operações dependentes
// Parallel quando ordem não importa e operações independentes
```

**for...of com await - sequential:**
```typescript
// for...of - sequential iteration

async function processItemsSequentially(items: Item[]): Promise<void> {
  for (const item of items) {
    console.log(`Processing ${item.id}...`);
    
    await processItem(item);  // Wait antes de próximo
    
    console.log(`Processed ${item.id}`);
  }
  
  console.log("All done");
}

/*
Timeline (3 items, 1s cada):
0s: Processing 1...
1s: Processed 1
1s: Processing 2...
2s: Processed 2
2s: Processing 3...
3s: Processed 3
3s: All done

Total: 3s (sequential)
*/
```

**map() + Promise.all() - parallel:**
```typescript
// map + Promise.all - parallel iteration

async function processItemsParallel(items: Item[]): Promise<void> {
  console.log("Processing all items...");
  
  await Promise.all(
    items.map(item => processItem(item))  // Todos iniciam juntos
  );
  
  console.log("All done");
}

/*
Timeline (3 items, 1s cada):
0s: Processing all items...
1s: All done

Total: 1s (parallel - 3x faster!)
*/
```

**Choosing pattern:**
```typescript
// Quando usar sequential vs parallel

// Sequential (for...of) quando:
// 1. Ordem de execução importa
async function orderedProcessing(items: Item[]): Promise<void> {
  for (const item of items) {
    await processInOrder(item);  // Must maintain order
  }
}

// 2. Operação N+1 depende de resultado de N
async function dependentProcessing(items: Item[]): Promise<void> {
  let accumulated = 0;
  
  for (const item of items) {
    accumulated = await processWithAccumulator(item, accumulated);
  }
}

// 3. Rate limiting (controlar concorrência)
async function rateLimited(items: Item[]): Promise<void> {
  for (const item of items) {
    await processItem(item);
    await delay(100);  // Throttle: 100ms entre requests
  }
}

// Parallel (Promise.all + map) quando:
// 1. Operações independentes
async function independentProcessing(items: Item[]): Promise<Data[]> {
  return await Promise.all(
    items.map(item => fetchData(item.id))  // Independent fetches
  );
}

// 2. Ordem não importa
async function unorderedProcessing(items: Item[]): Promise<void> {
  await Promise.all(
    items.map(item => processItem(item))  // Order doesn't matter
  );
}

// 3. Performance critical
async function fastProcessing(ids: number[]): Promise<User[]> {
  return await Promise.all(
    ids.map(id => fetchUser(id))  // Fast concurrent fetching
  );
}
```

### Contexto Histórico e Evolução

**Pre-ES2015:** Callback loops eram complexos.

```javascript
// Callbacks - difficult to loop
function processItems(items, callback) {
  let index = 0;
  
  function processNext() {
    if (index >= items.length) {
      callback();
      return;
    }
    
    processItem(items[index], (error) => {
      if (error) {
        callback(error);
        return;
      }
      index++;
      processNext();
    });
  }
  
  processNext();
}

// Recursive callback pattern - complex
```

**ES2015 (ES6):** Promise loops com .then().

```javascript
// ES6 - Promise reduce pattern
items.reduce((promise, item) => {
  return promise.then(() => processItem(item));
}, Promise.resolve());

// Better mas ainda verbose
```

**ES2017 (ES8):** for...of com await.

```javascript
// ES2017 - natural loop syntax
async function processItems(items) {
  for (const item of items) {
    await processItem(item);
  }
}

// Clean sequential iteration
```

**ES2018:** for await...of para async iterables.

```javascript
// ES2018 - async iteration protocol
async function* asyncGenerator() {
  yield await fetchData1();
  yield await fetchData2();
}

for await (const data of asyncGenerator()) {
  console.log(data);
}

// Async iterators
```

**TypeScript 2.3 (2017):** Async iteration support.

```typescript
// TypeScript - for await...of
async function processStream(stream: AsyncIterable<Data>) {
  for await (const chunk of stream) {
    await processChunk(chunk);
  }
}

// Type-safe async iteration
```

**Modern (2018+):** Pattern awareness.

```typescript
// Modern - escolher pattern correto

// Sequential quando necessário
for (const item of items) {
  await processItem(item);
}

// Parallel quando possível
await Promise.all(items.map(item => processItem(item)));

// Performance-conscious choices
```

**TypeScript 4.5 (2021):** Better async type inference.

```typescript
// TypeScript 4.5 - melhor inference
const results = await Promise.all(
  items.map(async (item) => {
    const result = await processItem(item);
    return result;
  })
);

// Type: typeof results inferido corretamente
```

### Problema Fundamental que Resolve

Loops assíncronos resolvem problemas de **collection processing**, **sequential vs parallel execution**, **iteration control**, e **error handling em loops**.

**Problema 1: Callback Loop Complexity**
```typescript
// Callbacks - loop iteration complexo ❌

function processItemsWithCallbacks(
  items: Item[],
  callback: (error?: Error) => void
): void {
  let index = 0;
  
  function processNext() {
    if (index >= items.length) {
      callback();  // Done
      return;
    }
    
    const item = items[index];
    processItem(item, (error) => {
      if (error) {
        callback(error);
        return;
      }
      
      index++;
      processNext();  // Recurse para próximo
    });
  }
  
  processNext();
}

// ✗ Recursive pattern complexo
// ✗ Difícil rastrear flow
// ✗ Error handling complicado
```

**Solução: for...of com await - natural iteration**
```typescript
// for...of - natural loop syntax ✅

async function processItems(items: Item[]): Promise<void> {
  for (const item of items) {
    await processItem(item);
  }
}

// ✓ Natural loop syntax
// ✓ Easy to read
// ✓ Simple error handling (try/catch)
```

**Problema 2: Array Method Parallelism Unclear**
```typescript
// Array methods - não óbvio se parallel ou sequential ❌

// Isto é parallel ou sequential? Não é claro!
async function processItems(items: Item[]): Promise<void> {
  items.forEach(async (item) => {
    await processItem(item);  // ❌ forEach não espera Promises!
  });
  
  console.log("Done?");  // Executa ANTES de processing completar
}

// forEach NÃO espera async callbacks
// Todas async operations iniciam mas função retorna imediatamente
```

**Solução: Explicit sequential (for...of) ou parallel (Promise.all)**
```typescript
// Sequential explícito ✅
async function processSequential(items: Item[]): Promise<void> {
  for (const item of items) {
    await processItem(item);
  }
  console.log("Done");  // Executa APÓS todos processados
}

// Parallel explícito ✅
async function processParallel(items: Item[]): Promise<void> {
  await Promise.all(
    items.map(item => processItem(item))
  );
  console.log("Done");  // Executa APÓS todos processados
}

// ✓ Intent claro (sequential vs parallel)
// ✓ Await garante completion antes de "Done"
```

**Problema 3: Performance for Independent Operations**
```typescript
// Sequential quando parallel seria melhor ❌

async function fetchAllUsers(userIds: number[]): Promise<User[]> {
  const users: User[] = [];
  
  for (const userId of userIds) {
    const user = await fetchUser(userId);  // Sequential
    users.push(user);
  }
  
  return users;
}

// 100 users × 50ms each = 5000ms (5 seconds!)
// ✗ Operações independentes executam sequencialmente
// ✗ Muito lento
```

**Solução: Parallel para independent operations**
```typescript
// Parallel - muito mais rápido ✅

async function fetchAllUsers(userIds: number[]): Promise<User[]> {
  return await Promise.all(
    userIds.map(userId => fetchUser(userId))
  );
}

// 100 users × 50ms = 50ms (100x faster!)
// ✓ Concurrent fetching
// ✓ Optimal para independent operations
```

**Problema 4: Error Handling in Loops**
```typescript
// Error handling em loops - alguns patterns ruins ❌

// Pattern 1: forEach com async ❌
items.forEach(async (item) => {
  try {
    await processItem(item);
  } catch (error) {
    console.error(error);  // Error handling funciona
  }
});
// Mas forEach não espera, então função retorna imediatamente

// Pattern 2: map sem Promise.all ❌
const promises = items.map(async (item) => {
  return await processItem(item);
});
// promises é array de Promises, não results!
// Precisa await Promise.all(promises)
```

**Solução: Proper error handling patterns**
```typescript
// Sequential com error handling ✅
async function processWithErrors(items: Item[]): Promise<void> {
  for (const item of items) {
    try {
      await processItem(item);
    } catch (error) {
      console.error(`Failed to process ${item.id}:`, error);
      // Continue to next item
    }
  }
}

// Parallel com error handling ✅
async function processParallelWithErrors(items: Item[]): Promise<void> {
  const results = await Promise.allSettled(
    items.map(item => processItem(item))
  );
  
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Item ${index} failed:`, result.reason);
    }
  });
}

// ✓ Proper await
// ✓ Error handling works correctly
```

**Fundamento teórico:** Loops assíncronos implementam **collection processing patterns** com controle sobre **execution order** e **concurrency**, otimizando **performance** enquanto mantendo **code readability**.

### Importância no Ecossistema

Loops assíncronos são importantes porque:

- **Collection processing:** Process arrays/sets assincronamente
- **Performance control:** Sequential vs parallel choice
- **Readability:** Natural loop syntax
- **Error handling:** Try/catch works naturally
- **Type safety:** TypeScript infere tipos
- **Common pattern:** Muito usado em real-world code
- **API batch operations:** Fetch múltiplos resources
- **Data pipelines:** Transform data collections

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **for...of + await:** Sequential iteration
2. **map + Promise.all:** Parallel iteration
3. **forEach:** DOESN'T wait (avoid com async)
4. **for await...of:** Async iterables
5. **reduce:** Sequential accumulation

### Pilares Fundamentais

- **Sequential:** for...of, while, do...while com await
- **Parallel:** Promise.all com map/filter
- **Order preservation:** for...of mantém ordem
- **Error handling:** try/catch em loops
- **Performance:** Choose sequential vs parallel

### Visão Geral das Nuances

- **forEach não espera:** Avoid forEach com async callbacks
- **map retorna Promises:** Precisa Promise.all para await
- **Async reduce:** Sequential accumulation pattern
- **Batching:** Control concurrency com batches
- **Early exit:** break/continue funcionam em for loops

## 🧠 Fundamentos Teóricos

### Basic for...of Loop

```typescript
// Basic sequential iteration

async function basicLoop(items: Item[]): Promise<void> {
  for (const item of items) {
    await processItem(item);
  }
}

// Sequential: 1 por vez
```

**Basic:** Sequential processing with for...of.

### Princípios e Conceitos Subjacentes

#### while Loop com Await

```typescript
// while loop - conditional iteration

async function processWhile(items: Item[]): Promise<void> {
  let index = 0;
  
  while (index < items.length) {
    const item = items[index];
    await processItem(item);
    index++;
  }
}

// Similar a for loop, mas com condição explícita
```

**while:** Conditional iteration.

#### map() + Promise.all()

```typescript
// map + Promise.all - parallel processing

async function processParallel(items: Item[]): Promise<Result[]> {
  return await Promise.all(
    items.map(item => processItem(item))
  );
}

// All items processed concurrently
// Results preservam ordem do input array
```

**Parallel:** Concurrent processing with map.

### forEach() Pitfall

```typescript
// forEach NÃO espera async callbacks! ❌

async function wrongForEach(items: Item[]): Promise<void> {
  items.forEach(async (item) => {
    await processItem(item);
  });
  
  console.log("Done");  // ❌ Executa ANTES de processing!
}

// forEach chama callback mas não espera Promises
// Função retorna imediatamente

// Correto: use for...of ✅
async function correctForOf(items: Item[]): Promise<void> {
  for (const item of items) {
    await processItem(item);
  }
  
  console.log("Done");  // ✓ Executa APÓS processing
}
```

**Pitfall:** forEach doesn't await.

#### filter() com Async

```typescript
// filter com async - precisa Promise.all

async function filterAsync(items: Item[]): Promise<Item[]> {
  const results = await Promise.all(
    items.map(async (item) => {
      const valid = await isValid(item);
      return valid ? item : null;
    })
  );
  
  return results.filter((item): item is Item => item !== null);
}

// map to Promise<Item | null>, then filter nulls
```

**Filter:** Async filtering pattern.

#### reduce() com Async

```typescript
// reduce - sequential accumulation

async function reduceAsync(items: Item[]): Promise<number> {
  return await items.reduce(async (accPromise, item) => {
    const acc = await accPromise;  // Await accumulator
    const value = await processItem(item);
    return acc + value;
  }, Promise.resolve(0));
}

// Sequential: cada iteration espera anterior
```

**Reduce:** Async accumulation.

### for await...of (Async Iterables)

```typescript
// for await...of - async iterables

async function* asyncGenerator(): AsyncGenerator<number> {
  yield await fetchNumber1();
  yield await fetchNumber2();
  yield await fetchNumber3();
}

async function consumeAsyncIterable(): Promise<void> {
  for await (const num of asyncGenerator()) {
    console.log(num);
  }
}

// Async iteration protocol
```

**Async Iterable:** for await...of syntax.

### Real-World Example - Batch Processing

```typescript
// Real-world - process large dataset em batches

interface ProcessingResult {
  successful: number;
  failed: number;
  errors: Error[];
}

async function processBatch(
  items: Item[],
  batchSize: number
): Promise<ProcessingResult> {
  let successful = 0;
  let failed = 0;
  const errors: Error[] = [];
  
  // Process em batches para controlar concorrência
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}...`);
    
    // Parallel dentro de batch
    const results = await Promise.allSettled(
      batch.map(item => processItem(item))
    );
    
    // Count results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful++;
      } else {
        failed++;
        errors.push(result.reason);
        console.error(`Item ${batch[index].id} failed:`, result.reason);
      }
    });
    
    // Optional: delay between batches (rate limiting)
    if (i + batchSize < items.length) {
      await delay(1000);  // 1s delay between batches
    }
  }
  
  return { successful, failed, errors };
}

// Usage
const result = await processBatch(items, 10);
console.log(`Success: ${result.successful}, Failed: ${result.failed}`);

/*
Benefits:
- Controlled concurrency (10 concurrent per batch)
- Progress tracking (batch by batch)
- Error handling (collect all errors)
- Rate limiting (delay between batches)
*/
```

**Real-World:** Batch processing with concurrency control.

#### Modelo Mental para Compreensão

Pense em loops assíncronos como **factory assembly**:

**Sequential (for...of):** Single worker, one item at a time
**Parallel (Promise.all):** Multiple workers, all items simultaneously
**Batch:** Groups of workers, process batches
**Order:** Conveyor belt preserves order

**Analogia - Restaurant:**

**Sequential:** Cook prepares 1 order, then next (slow)
**Parallel:** Multiple cooks prepare all orders simultaneously (fast)
**Batch:** Cook prepares 5 orders, then next 5 (controlled)
**Order matters:** Serve in order received vs serve as ready

**Metáfora - Mail Delivery:**

**Sequential:** Deliver 1 letter, return, deliver next (slow)
**Parallel:** Deliver all letters on route simultaneously (fast)
**Batch:** Deliver 10 letters, return for next 10 (practical)

**Fluxo visual:**
```
Sequential Loop (for...of):
───────────────────────────
Time: 0   1s  2s  3s  4s
      │───│───│───│───│
      1   2   3   4   Done
      
Total: 4s

Parallel Loop (Promise.all + map):
───────────────────────────
Time: 0       1s
      │───────│
      1       Done
      2
      3
      4
      
Total: 1s (4x faster)

Batch Processing (batches of 2):
───────────────────────────
Time: 0   1s    2s
      │───│────│
      1,2   3,4  Done
      
Total: 2s (2x faster, controlled concurrency)
```

## 🔍 Análise Conceitual Profunda

### Early Exit from Loop

```typescript
// break/continue funcionam em for loops

async function findFirst(items: Item[]): Promise<Item | null> {
  for (const item of items) {
    const isTarget = await checkItem(item);
    
    if (isTarget) {
      return item;  // Early exit - para loop
    }
  }
  
  return null;  // Not found
}

// break/continue não funcionam com forEach/map
```

**Early Exit:** break/return work in for loops.

#### Async map() Pattern

```typescript
// Async map - transform array concurrently

async function transformItems(items: Item[]): Promise<Result[]> {
  return await Promise.all(
    items.map(async (item) => {
      const processed = await processItem(item);
      return transformResult(processed);
    })
  );
}

// All transformations concurrent
// Results em mesma ordem que input
```

**Map:** Async transformation.

### Sequential Accumulation

```typescript
// reduce para sequential accumulation

async function calculateTotal(items: Item[]): Promise<number> {
  let total = 0;
  
  for (const item of items) {
    const value = await getValue(item);
    total += value;
  }
  
  return total;
}

// Ou com reduce
async function calculateTotalReduce(items: Item[]): Promise<number> {
  return await items.reduce(async (totalPromise, item) => {
    const total = await totalPromise;
    const value = await getValue(item);
    return total + value;
  }, Promise.resolve(0));
}

// Both sequential
```

**Accumulation:** Sequential sum/accumulation.

#### Batching with Concurrency Control

```typescript
// Batch processing - controlar número concurrent operations

async function processBatched<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch em parallel (controlled concurrency)
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    );
    
    results.push(...batchResults);
  }
  
  return results;
}

// Usage
const results = await processBatched(
  items,
  10,  // Max 10 concurrent
  item => processItem(item)
);

// Evita overwhelm com muitos concurrent requests
```

**Batching:** Control concurrency level.

## 🎯 Aplicabilidade e Contextos

### Batch API Requests

```typescript
const users = await Promise.all(
  userIds.map(id => fetchUser(id))
);
```

**Raciocínio:** Fetch múltiplos users concurrently.

### Sequential Data Pipeline

```typescript
for (const item of items) {
  const validated = await validate(item);
  await save(validated);
}
```

**Raciocínio:** Process items em ordem.

### Rate-Limited Requests

```typescript
for (const item of items) {
  await processItem(item);
  await delay(100);  // Rate limit
}
```

**Raciocínio:** Throttle requests.

## ⚠️ Limitações e Considerações Teóricas

### forEach Doesn't Await

```typescript
// forEach NÃO espera async callbacks ❌

items.forEach(async (item) => {
  await processItem(item);  // Não esperado!
});

console.log("Done");  // Executa imediatamente

// Use for...of instead ✅
for (const item of items) {
  await processItem(item);
}
```

**Limitação:** forEach ignores returned Promises.

### map Returns Promises

```typescript
// map retorna array de Promises, não results ❌

const results = items.map(async (item) => {
  return await processItem(item);
});

// results é Promise<Result>[], não Result[]

// Precisa Promise.all ✅
const results = await Promise.all(
  items.map(async (item) => {
    return await processItem(item);
  })
);
```

**Consideração:** map needs Promise.all.

### Concurrency Overload

```typescript
// Muitos concurrent operations podem sobrecarregar ❌

await Promise.all(
  items.map(item => processItem(item))  // Se 10k items...
);

// Use batching ✅
await processBatched(items, 10, processItem);
```

**Consideração:** Control concurrency with batching.

## 🔗 Interconexões Conceituais

**Relação com Async/Await:** Foundation for loops.

**Relação com Promises:** Promise.all for parallel.

**Relação com Arrays:** Array methods (map, filter, reduce).

**Relação com Iteration:** for...of, while loops.

**Relação com Performance:** Sequential vs parallel choice.

## 🚀 Evolução e Próximos Conceitos

Dominar Loops Async prepara para:
- **Async iterators:** for await...of patterns
- **Stream processing:** Async data streams
- **Batching strategies:** Advanced concurrency control
- **Performance optimization:** When to parallelize
- **Error handling:** Loop error patterns
- **Testing:** Testing async iterations
