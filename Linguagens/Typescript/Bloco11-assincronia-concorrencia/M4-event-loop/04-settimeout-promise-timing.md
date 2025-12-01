# setTimeout vs. Promise Timing

## 🎯 Introdução e Definição

### Definição Conceitual

**setTimeout** e **Promise.then** têm **timing behaviors fundamentalmente diferentes** devido a **queue placement** no event loop. **setTimeout** agenda **macrotask** (task queue) - executa **após microtasks** e **render opportunity**, com **minimum delay** (~4ms browsers, ~1ms Node.js) mesmo com `setTimeout(fn, 0)`. **Promise.then** agenda **microtask** (microtask queue) - executa **imediatamente após call stack esvaziar**, **antes de qualquer macrotask**, com **no minimum delay**.

Conceitualmente, implementam **two-tier priority system** - microtasks (Promise) têm **higher priority** que macrotasks (setTimeout). Seguem **different scheduling semantics** - setTimeout é **timer-based** (minimum delay), Promise.then é **immediate scheduling** (próximo microtask checkpoint). TypeScript/JavaScript engines processam **ALL microtasks** antes de **cada macrotask**, criando **predictable ordering** - Promise.then sempre antes de setTimeout.

**Fundamento teórico:** setTimeout/Promise timing deriva de **event loop phases** - macrotasks processadas uma por vez com render opportunities entre, microtasks processadas em batch após cada macrotask. Implementa **responsive execution model** - microtasks (urgent work) processadas rapidamente, macrotasks (deferred work) processadas com delays. Suporta **deterministic async ordering** - código pode confiar que Promise.then executa antes de setTimeout(0).

**Pattern básico:**
```typescript
// setTimeout vs. Promise.then - timing difference

console.log("1. Sync start");

setTimeout(() => {
  console.log("4. setTimeout (macrotask)");
}, 0);  // Delay 0 - ainda é macrotask

Promise.resolve().then(() => {
  console.log("3. Promise.then (microtask)");
});

console.log("2. Sync end");

/*
Output:
1. Sync start
2. Sync end
3. Promise.then (microtask)    ← ANTES de setTimeout
4. setTimeout (macrotask)      ← DEPOIS de Promise

Timing:
- setTimeout(0): ~4ms minimum (browsers), após microtasks
- Promise.then: ~0ms, imediatamente após call stack

Promise.then SEMPRE executa antes de setTimeout,
mesmo com setTimeout(fn, 0)!
*/
```

**Minimum delay:**
```typescript
// setTimeout minimum delay

const start = Date.now();

setTimeout(() => {
  const elapsed = Date.now() - start;
  console.log(`setTimeout(0) elapsed: ${elapsed}ms`);
  // Browser: ~4-10ms (HTML5 spec: minimum 4ms)
  // Node.js: ~1-2ms
}, 0);

Promise.resolve().then(() => {
  const elapsed = Date.now() - start;
  console.log(`Promise.then elapsed: ${elapsed}ms`);
  // ~0-1ms (executa quase imediatamente)
});

/*
Output:
Promise.then elapsed: 0ms      ← Quase instantâneo
setTimeout(0) elapsed: 5ms     ← Minimum delay enforcement

setTimeout NUNCA é instantâneo, mesmo com delay 0!
Browsers/Node.js aplicam minimum delays
*/
```

**Execution order guarantee:**
```typescript
// Promise SEMPRE antes de setTimeout

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(`setTimeout ${i}`);
  }, 0);
  
  Promise.resolve().then(() => {
    console.log(`Promise ${i}`);
  });
}

/*
Output:
Promise 0
Promise 1
Promise 2
Promise 3
Promise 4
setTimeout 0  ← Todas Promises ANTES de qualquer setTimeout
setTimeout 1
setTimeout 2
setTimeout 3
setTimeout 4

Event loop:
1. Call stack: schedule todos setTimeout/Promise
2. Microtask queue: [Promise 0, 1, 2, 3, 4]
3. Process ALL microtasks
4. Task queue: [setTimeout 0, 1, 2, 3, 4]
5. Process ONE setTimeout per iteration

TODAS Promises processadas ANTES de QUALQUER setTimeout!
*/
```

### Contexto Histórico e Evolução

**1995:** JavaScript - setTimeout desde início.

```javascript
// JavaScript 1.0 - setTimeout
setTimeout(function() {
  console.log("Timer callback");
}, 1000);

// Macrotask desde início
```

**2009:** setTimeout(0) trick popular.

```javascript
// setTimeout(0) - defer execution
function heavyWork() {
  // Heavy computation
}

setTimeout(heavyWork, 0);  // "Defer" to next tick
console.log("Continues");

// Permite UI responder
```

**ES6 (2015):** Promise.then - microtask queue.

```javascript
// ES6 - Promise.then tem timing diferente
Promise.resolve().then(() => {
  console.log("Promise");
});

setTimeout(() => {
  console.log("Timeout");
}, 0);

// Promise ANTES de setTimeout (new behavior)
```

**2015:** HTML5 spec - minimum delay 4ms.

```
HTML5 Living Standard:
- setTimeout minimum delay: 4ms (nested timers)
- Prevents CPU spinning
- Applies even to setTimeout(fn, 0)
```

**2016:** Developers discover Promise timing.

```javascript
// Promise.then mais rápido que setTimeout(0)
// Usado para "immediate" async execution
queueMicrotask(() => {
  // Faster than setTimeout(0)
});
```

**2018:** queueMicrotask() - explicit microtask.

```javascript
// queueMicrotask() - same timing as Promise.then
queueMicrotask(() => {
  console.log("Microtask");
});

// Mais semântico que Promise.resolve().then()
```

**TypeScript 2.0+ (2016+):** Types para timing.

```typescript
// TypeScript - typed async timing
const timeoutId: number = setTimeout((): void => {
  console.log("Timeout");
}, 0);

const promise: Promise<void> = Promise.resolve().then((): void => {
  console.log("Promise");
});

// Type safety com different timing behaviors
```

**Modern (2020+):** Consistent cross-browser timing.

```typescript
// Consistent behavior - todos engines
setTimeout(() => console.log("Macro"), 0);
Promise.resolve().then(() => console.log("Micro"));

// Todos browsers/engines: Micro → Macro (deterministic)
```

### Problema Fundamental que Resolve

setTimeout/Promise timing resolve problemas de **execution priority**, **responsive UI**, **deterministic ordering**, e **performance optimization**.

**Problema 1: Need Immediate Async Execution**
```typescript
// setTimeout(0) tem delay - não "immediate" ❌

const start = Date.now();

setTimeout(() => {
  const elapsed = Date.now() - start;
  console.log(`setTimeout: ${elapsed}ms`);
  // ~4-10ms delay (não immediate)
}, 0);

// ✗ Precisa async execution, mas setTimeout tem delay
// ✗ UI pode renderizar entre
// ✗ Outros eventos podem processar
```

**Solução: Promise.then immediate async**
```typescript
// Promise.then - immediate async execution ✅

const start = Date.now();

Promise.resolve().then(() => {
  const elapsed = Date.now() - start;
  console.log(`Promise: ${elapsed}ms`);
  // ~0-1ms (quase instantâneo)
});

/*
Promise.then:
- Executa ASAP após call stack esvaziar
- No minimum delay
- Antes de render
- Antes de qualquer timer

Ideal para work urgente que precisa executar imediatamente
*/
```

**Problema 2: Uncertain Execution Order with setTimeout**
```typescript
// setTimeout(0) ordem incerta com outros timers ❌

setTimeout(() => {
  console.log("Timer 1");
}, 0);

// Heavy sync work aqui
for (let i = 0; i < 1000000; i++) {
  // Busy loop
}

setTimeout(() => {
  console.log("Timer 2");
}, 0);

// ✗ Ordem pode variar dependendo de timing
// ✗ Se Timer 1 delay passou durante loop, pode executar antes de Timer 2 agendar
```

**Solução: Promise.then deterministic order**
```typescript
// Promise.then - ordem determinística ✅

Promise.resolve().then(() => {
  console.log("Promise 1");
});

// Heavy sync work
for (let i = 0; i < 1000000; i++) {
  // Busy loop
}

Promise.resolve().then(() => {
  console.log("Promise 2");
});

/*
Output ALWAYS:
Promise 1
Promise 2

Microtask queue FIFO - ordem garantida
Ambas agendadas ANTES de loop completar
Processadas em ordem após call stack esvaziar
*/
```

**Problema 3: UI Updates Between Async Operations**
```typescript
// setTimeout permite render entre operations ❌

function updateUI(data: Data[]): void {
  data.forEach(item => {
    setTimeout(() => {
      processItem(item);  // Macrotask
    }, 0);
  });
}

// ✗ Render pode acontecer entre cada processItem
// ✗ UI pode mostrar estado inconsistente (partially updated)
// ✗ Causando visual glitches
```

**Solução: Promise.then batches before render**
```typescript
// Promise.then - batch processing antes de render ✅

function updateUI(data: Data[]): void {
  data.forEach(item => {
    Promise.resolve().then(() => {
      processItem(item);  // Microtask
    });
  });
}

/*
Event loop:
1. Todas Promises agendadas (microtasks)
2. Call stack esvazia
3. Process ALL microtasks (todos processItem)
4. Render opportunity (após todos processados)

UI atualiza uma vez, com todos dados processados
No partial updates, no glitches
*/
```

**Problema 4: Performance - Unnecessary Delays**
```typescript
// setTimeout adds unnecessary delays ❌

async function fetchMultiple(urls: string[]): Promise<Data[]> {
  const results: Data[] = [];
  
  for (const url of urls) {
    await new Promise(resolve => {
      setTimeout(() => {
        fetch(url).then(data => {
          results.push(data);
          resolve(undefined);
        });
      }, 0);
    });
  }
  
  return results;
}

// ✗ setTimeout delay (~4ms) entre cada fetch
// ✗ Total overhead: 4ms * urls.length
// ✗ Desnecessário - apenas precisa async, não delay
```

**Solução: Promise.then no delay overhead**
```typescript
// Promise.then - no unnecessary delays ✅

async function fetchMultiple(urls: string[]): Promise<Data[]> {
  const results: Data[] = [];
  
  for (const url of urls) {
    const data = await fetch(url);
    results.push(data);
  }
  
  return results;
}

/*
await usa Promise.then (microtask):
- No setTimeout delays
- Executa ASAP
- Faster overall
- 10 URLs: ~0ms overhead vs ~40ms com setTimeout(0)
*/
```

**Fundamento teórico:** setTimeout/Promise timing implementa **priority-based scheduling** - microtasks (urgent) vs macrotasks (deferred), permitindo **responsive e efficient execution**.

### Importância no Ecossistema

setTimeout/Promise timing é importante porque:

- **Deterministic ordering:** Promise.then sempre antes de setTimeout
- **Performance:** Promise.then no delay overhead
- **UI responsiveness:** Batch microtasks before render
- **Async patterns:** await usa Promise (microtask timing)
- **Testing:** Predictable async behavior
- **Framework scheduling:** React, Vue use microtasks
- **Spec compliance:** HTML5, ES6 specs define timing
- **Developer expectations:** Code relies on timing differences

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Different queues:** setTimeout → Task Queue, Promise → Microtask Queue
2. **Priority:** Microtasks ALWAYS before macrotasks
3. **Minimum delay:** setTimeout has ~4ms minimum (browsers)
4. **No delay:** Promise.then executes ASAP
5. **Deterministic:** Promise.then always before setTimeout(0)

### Pilares Fundamentais

- **setTimeout(fn, 0):** Macrotask, ~4ms minimum delay
- **Promise.then():** Microtask, ~0ms delay
- **Execution order:** Promise.then → setTimeout
- **Batching:** Microtasks batch together
- **Render:** Between macrotasks, not microtasks

### Visão Geral das Nuances

- **setTimeout delay:** Never 0, minimum ~4ms (browsers)
- **Nested setTimeout:** Delay increases to 4ms after 5 levels
- **queueMicrotask:** Same timing as Promise.then
- **setImmediate (Node):** Macrotask, after I/O
- **process.nextTick (Node):** Higher priority than microtasks

## 🧠 Fundamentos Teóricos

### Basic Timing Difference

```typescript
// Basic setTimeout vs Promise timing

console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");

/*
Output:
Start
End
Promise       ← ANTES de setTimeout
setTimeout    ← DEPOIS de Promise

Timing:
- setTimeout: macrotask, ~4ms delay
- Promise: microtask, ~0ms delay

Promise SEMPRE antes de setTimeout!
*/
```

**Basic:** Promise before setTimeout.

### Princípios e Conceitos Subjacentes

#### Minimum Delay Enforcement

```typescript
// setTimeout minimum delay

const measurements: number[] = [];

for (let i = 0; i < 10; i++) {
  const start = Date.now();
  
  setTimeout(() => {
    const elapsed = Date.now() - start;
    measurements.push(elapsed);
    
    if (measurements.length === 10) {
      const avg = measurements.reduce((a, b) => a + b) / 10;
      console.log(`Average delay: ${avg.toFixed(2)}ms`);
      // Browser: ~4-6ms
      // Node.js: ~1-2ms
    }
  }, 0);
}

/*
Browser output:
Average delay: 4.8ms

Node.js output:
Average delay: 1.2ms

setTimeout(0) NEVER 0ms:
- Browsers: HTML5 spec minimum 4ms
- Node.js: libuv minimum ~1ms
- Prevents CPU spinning
*/
```

**Minimum Delay:** setTimeout never instant.

#### Promise Immediate Execution

```typescript
// Promise.then immediate execution

const measurements: number[] = [];

for (let i = 0; i < 10; i++) {
  const start = Date.now();
  
  Promise.resolve().then(() => {
    const elapsed = Date.now() - start;
    measurements.push(elapsed);
    
    if (measurements.length === 10) {
      const avg = measurements.reduce((a, b) => a + b) / 10;
      console.log(`Average delay: ${avg.toFixed(2)}ms`);
      // ~0-1ms (quase instantâneo)
    }
  });
}

/*
Output:
Average delay: 0.3ms

Promise.then:
- No minimum delay
- Executes ASAP after call stack
- Microtask checkpoint
- Much faster than setTimeout
*/
```

**Immediate:** Promise.then near-instant.

### Multiple setTimeout vs Promise

```typescript
// Multiple setTimeout vs Promise ordering

console.log("Start");

for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(`setTimeout ${i}`);
  }, 0);
}

for (let i = 0; i < 3; i++) {
  Promise.resolve().then(() => {
    console.log(`Promise ${i}`);
  });
}

console.log("End");

/*
Output:
Start
End
Promise 0
Promise 1
Promise 2
setTimeout 0
setTimeout 1
setTimeout 2

Event loop:
1. Sync: "Start", "End"
2. Microtasks: ALL Promises (Promise 0, 1, 2)
3. Macrotask: setTimeout 0
4. Check microtasks (empty)
5. Macrotask: setTimeout 1
6. Check microtasks (empty)
7. Macrotask: setTimeout 2

ALL Promises BEFORE ANY setTimeout!
*/
```

**Multiple:** Batch behavior difference.

#### Nested Timing

```typescript
// Nested setTimeout vs Promise

setTimeout(() => {
  console.log("Outer setTimeout");
  
  setTimeout(() => {
    console.log("Inner setTimeout");
  }, 0);
  
  Promise.resolve().then(() => {
    console.log("Inner Promise");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("Outer Promise");
});

/*
Output:
Outer Promise         ← Microtask first
Outer setTimeout      ← Macrotask
Inner Promise         ← Microtask before next macrotask
Inner setTimeout      ← Next macrotask

Event loop:
1. Microtasks: Outer Promise
2. Macrotask: Outer setTimeout (schedules inner)
3. Microtasks: Inner Promise
4. Macrotask: Inner setTimeout

Microtasks sempre processadas entre macrotasks
*/
```

**Nested:** Interleaving pattern.

### Real-World Example - Data Processing

```typescript
// Real-world - setTimeout vs Promise timing

interface DataItem {
  id: number;
  value: string;
}

// ❌ SLOW - setTimeout adds delays
async function processWithSetTimeout(items: DataItem[]): Promise<void> {
  const start = Date.now();
  
  for (const item of items) {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        console.log(`Process ${item.id}`);
        resolve();
      }, 0);
    });
  }
  
  const elapsed = Date.now() - start;
  console.log(`setTimeout total: ${elapsed}ms`);
  // 10 items × 4ms = ~40ms overhead
}

// ✅ FAST - Promise immediate
async function processWithPromise(items: DataItem[]): Promise<void> {
  const start = Date.now();
  
  for (const item of items) {
    await Promise.resolve().then(() => {
      console.log(`Process ${item.id}`);
    });
  }
  
  const elapsed = Date.now() - start;
  console.log(`Promise total: ${elapsed}ms`);
  // ~1-2ms total (no delay overhead)
}

const testItems: DataItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  value: `Item ${i}`
}));

// Compare
processWithSetTimeout(testItems);  // ~40ms
processWithPromise(testItems);     // ~2ms

/*
Performance difference:
- setTimeout: ~4ms delay per item
- Promise: ~0ms delay per item

Para 100 items:
- setTimeout: ~400ms
- Promise: ~10ms

Promise 40x FASTER para async iteration!
*/
```

**Real-World:** Performance comparison.

#### Modelo Mental para Compreensão

Pense em setTimeout vs Promise como **express lane vs regular lane**:

**Express lane (Promise):** No delays, immediate processing
**Regular lane (setTimeout):** Minimum wait time, deferred
**Priority:** Express always before regular
**Batching:** Express processes all together
**Delays:** Regular has minimum delay between

**Analogia - Mail Delivery:**

**Priority mail (Promise):** Delivered immediately
**Standard mail (setTimeout):** Delivered next business day (minimum delay)
**Processing:** All priority BEFORE any standard
**No instant standard:** Standard sempre tem delay

**Metáfora - Restaurant Service:**

**VIP customers (microtasks):** Served immediately when table ready
**Regular customers (macrotasks):** Minimum wait time (~4 minutes)
**Order:** ALL VIPs before ANY regular
**Batching:** VIPs served together

**Fluxo visual:**
```
setTimeout vs Promise:

Call Stack Empty
      ↓
┌─────────────────┐
│ Microtask Queue │  Promise.then
│ [Execute ALL]   │  ~0ms delay
└────────┬────────┘
         │
         ↓ After ALL microtasks
┌─────────────────┐
│  Task Queue     │  setTimeout
│ [Execute ONE]   │  ~4ms minimum delay
└─────────────────┘

Promise executes BEFORE setTimeout,
with NO minimum delay
```

## 🔍 Análise Conceitual Profunda

### Timing Measurements

```typescript
// Precise timing measurements

interface TimingResult {
  type: 'setTimeout' | 'Promise';
  delay: number;
}

async function measureTiming(): Promise<void> {
  const results: TimingResult[] = [];
  
  // Measure setTimeout
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        const delay = performance.now() - start;
        results.push({ type: 'setTimeout', delay });
        resolve();
      }, 0);
    });
  }
  
  // Measure Promise
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    
    await Promise.resolve().then(() => {
      const delay = performance.now() - start;
      results.push({ type: 'Promise', delay });
    });
  }
  
  // Analyze
  const timeoutAvg = results
    .filter(r => r.type === 'setTimeout')
    .reduce((sum, r) => sum + r.delay, 0) / 100;
  
  const promiseAvg = results
    .filter(r => r.type === 'Promise')
    .reduce((sum, r) => sum + r.delay, 0) / 100;
  
  console.log(`setTimeout average: ${timeoutAvg.toFixed(2)}ms`);
  console.log(`Promise average: ${promiseAvg.toFixed(2)}ms`);
  console.log(`Difference: ${(timeoutAvg - promiseAvg).toFixed(2)}ms`);
  
  /*
  Typical results (Browser):
  setTimeout average: 4.32ms
  Promise average: 0.08ms
  Difference: 4.24ms
  
  setTimeout ~50x slower than Promise!
  */
}
```

**Timing:** Precise measurements.

#### Nested setTimeout Clamping

```typescript
// Nested setTimeout - delay clamping

let depth = 0;

function nestedTimeout(): void {
  const start = Date.now();
  
  setTimeout(() => {
    const elapsed = Date.now() - start;
    depth++;
    
    console.log(`Depth ${depth}: ${elapsed}ms`);
    
    if (depth < 10) {
      nestedTimeout();
    }
  }, 0);
}

nestedTimeout();

/*
Output (Browser):
Depth 1: 1ms
Depth 2: 1ms
Depth 3: 1ms
Depth 4: 1ms
Depth 5: 4ms    ← Clamped to 4ms
Depth 6: 4ms
Depth 7: 4ms
Depth 8: 4ms
Depth 9: 4ms
Depth 10: 4ms

HTML5 spec: After 5 nested levels, setTimeout clamped to 4ms
Prevents infinite tight loops from spinning CPU
*/
```

**Clamping:** Nested setTimeout delay increases.

### Render Timing

```typescript
// setTimeout allows render, Promise doesn't

// ❌ setTimeout - render between iterations
function animateWithSetTimeout(): void {
  let frame = 0;
  
  function nextFrame(): void {
    if (frame < 100) {
      updateDisplay(frame);  // Update DOM
      
      setTimeout(() => {
        frame++;
        nextFrame();
      }, 0);
      
      // Render can happen here (between setTimeout callbacks)
    }
  }
  
  nextFrame();
}

// ✅ Promise - no render until all done
function animateWithPromise(): void {
  let frame = 0;
  
  function nextFrame(): void {
    if (frame < 100) {
      updateDisplay(frame);
      
      Promise.resolve().then(() => {
        frame++;
        nextFrame();
      });
      
      // NO render here - all microtasks process first
    }
  }
  
  nextFrame();
}

/*
setTimeout behavior:
- Render opportunity between each frame
- Can see intermediate states
- Smooth animation

Promise behavior:
- ALL frames process (100 microtasks)
- Render AFTER all complete
- User sees only final state
- ⚠️ Can block rendering for too long!

Use setTimeout for animations
Use Promise for batch updates
*/
```

**Render:** Different render timing.

#### Node.js setImmediate

```typescript
// Node.js - setImmediate vs setTimeout vs Promise

setTimeout(() => console.log("setTimeout"), 0);

setImmediate(() => console.log("setImmediate"));

Promise.resolve().then(() => console.log("Promise"));

process.nextTick(() => console.log("nextTick"));

/*
Output (Node.js):
nextTick       ← Highest priority
Promise        ← Microtask
setTimeout     ← Timers phase
setImmediate   ← Check phase

Node.js priority:
1. process.nextTick (special queue)
2. Microtasks (Promise)
3. Timers (setTimeout)
4. I/O callbacks
5. setImmediate

setImmediate executes AFTER I/O,
setTimeout executes in timers phase
*/
```

**Node.js:** Platform-specific timing.

### queueMicrotask API

```typescript
// queueMicrotask - same timing as Promise.then

console.log("Start");

setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve().then(() => console.log("Promise.then"));

queueMicrotask(() => console.log("queueMicrotask"));

console.log("End");

/*
Output:
Start
End
Promise.then
queueMicrotask
setTimeout

queueMicrotask:
- Same queue as Promise.then
- Same timing (microtask)
- More semantic than Promise.resolve().then()
- Executes before setTimeout

Use queueMicrotask for explicit microtask scheduling
*/
```

**queueMicrotask:** Explicit microtask timing.

## 🎯 Aplicabilidade e Contextos

### Batch UI Updates

```typescript
function batchUpdates(items: Item[]): void {
  items.forEach(item => {
    Promise.resolve().then(() => {
      updateDOM(item);
    });
  });
  // All updates before render
}
```

**Raciocínio:** Promise batches before render.

### Defer Heavy Work

```typescript
function deferHeavyWork(data: Data): void {
  setTimeout(() => {
    processHeavyData(data);
  }, 0);
  // Allow UI to update first
}
```

**Raciocínio:** setTimeout yields to render.

### Fast Async Iteration

```typescript
async function fastIteration(items: Item[]): Promise<void> {
  for (const item of items) {
    await Promise.resolve();  // Fast
    processItem(item);
  }
}
```

**Raciocínio:** Promise no delay overhead.

## ⚠️ Limitações e Considerações Teóricas

### setTimeout Not Precise

```typescript
// setTimeout não garante timing exato

setTimeout(() => {
  console.log("100ms?");
}, 100);

// Busy loop
const start = Date.now();
while (Date.now() - start < 200) {
  // Block for 200ms
}

// Callback executa APÓS 200ms, não 100ms
// setTimeout não preemptivo
```

**Limitação:** setTimeout timing não garantido.

### Promise Can Block Rendering

```typescript
// Infinite microtasks bloqueiam render

function infiniteMicrotask(): void {
  Promise.resolve().then(infiniteMicrotask);
}

infiniteMicrotask();
// UI congelada - render nunca acontece
```

**Consideração:** Limit microtask depth.

### Platform Differences

```typescript
// Different timing em diferentes plataformas

// Browser: setTimeout minimum ~4ms
// Node.js: setTimeout minimum ~1ms
// Deno: Similar to Node.js

// Write cross-platform carefully
```

**Consideração:** Platform-specific timing.

## 🔗 Interconexões Conceituais

**Relação com Event Loop:** Queues processadas em ordem.

**Relação com Microtasks:** Promise.then é microtask.

**Relação com Macrotasks:** setTimeout é macrotask.

**Relação com Async/Await:** await usa Promise timing.

**Relação com Performance:** Promise faster que setTimeout.

## 🚀 Evolução e Próximos Conceitos

Dominar setTimeout vs Promise Timing prepara para:
- **Performance optimization:** Choose right async primitive
- **Animation timing:** requestAnimationFrame vs setTimeout
- **Scheduler APIs:** React Scheduler, browser scheduling
- **Testing async code:** Control timing in tests
- **Debugging:** Understand async execution order
- **Worker threads:** Message passing timing
