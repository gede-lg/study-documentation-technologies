# Event Loop Order

## 🎯 Introdução e Definição

### Definição Conceitual

**Event Loop** é **mecanismo de execução** que coordena **call stack**, **task queue**, **microtask queue**, e **rendering** em JavaScript/TypeScript single-threaded runtime. Segue **ordem determinística**: **1) Execute script** (call stack), **2) Process ALL microtasks**, **3) Render** (se necessário no browser), **4) Process ONE macrotask**, **5) Repeat**. Event loop **nunca bloqueia** - quando call stack vazia, busca próximo trabalho nas queues.

Conceitualmente, implementa **run-to-completion semantics** - cada task executa **completamente** antes de próxima. Segue **non-blocking I/O model** - operações assíncronas (I/O, timers) não bloqueiam thread principal. TypeScript/JavaScript engines (V8, SpiderMonkey) executam event loop **continuamente** enquanto programa rodando - loop infinito checando work disponível.

**Fundamento teórico:** Event loop deriva de **reactor pattern** - demultiplexar eventos e dispatch para handlers. Implementa **cooperative multitasking** - tasks voluntariamente cedem controle (ao completarem), não preemptive. Suporta **event-driven concurrency** - múltiplas operações "concorrentes" via callbacks assíncronos, sem threads paralelas. É **deterministic** - mesma sequência de operações produz mesma ordem de execução.

**Pattern básico:**
```typescript
// Event Loop - ordem básica

console.log("1. Script start");  // Call stack

setTimeout(() => {
  console.log("4. Macrotask");   // Task Queue
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask");   // Microtask Queue
});

console.log("2. Script end");    // Call stack

/*
Output:
1. Script start
2. Script end
3. Microtask
4. Macrotask

Event Loop Order:
1. Execute script (call stack): log "1", "2"
2. Call stack empty
3. Process ALL microtasks: log "3"
4. Microtask queue empty
5. Check render (não aplicável aqui)
6. Process ONE macrotask: log "4"
7. Loop back to step 3 (check microtasks)
*/
```

**Complete iteration:**
```typescript
// Complete event loop iteration

console.log("Start");

setTimeout(() => {
  console.log("Macrotask 1");
  
  Promise.resolve().then(() => {
    console.log("Microtask in Macro 1");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask 1");
  
  setTimeout(() => {
    console.log("Macrotask 2");
  }, 0);
});

console.log("End");

/*
Output:
Start
End
Microtask 1
Macrotask 1
Microtask in Macro 1
Macrotask 2

Event Loop Iterations:

=== Iteration 1 ===
1. Call stack: "Start", "End"
2. Microtasks: "Microtask 1" (agenda Macrotask 2)
3. Render check
4. Macrotask: "Macrotask 1" (agenda microtask)

=== Iteration 2 ===
1. Call stack empty
2. Microtasks: "Microtask in Macro 1"
3. Render check
4. Macrotask: "Macrotask 2"

=== Iteration 3 ===
1. Call stack empty
2. Microtasks: empty
3. Task queue: empty
4. Wait for more work...
*/
```

**Visual model:**
```typescript
// Event loop - visual model

/*
┌───────────────────────────┐
│   JavaScript Runtime      │
│                           │
│  ┌─────────────────────┐  │
│  │   Call Stack        │  │  ← Executa código síncrono
│  │  [function frames]  │  │
│  └──────────┬──────────┘  │
│             │              │
│             ↓ Empty?       │
│  ┌─────────────────────┐  │
│  │ Microtask Queue     │  │  ← Process ALL
│  │ [Promise.then]      │  │
│  │ [queueMicrotask]    │  │
│  └──────────┬──────────┘  │
│             │              │
│             ↓ Empty?       │
│  ┌─────────────────────┐  │
│  │   Render            │  │  ← Update UI (browser)
│  └──────────┬──────────┘  │
│             │              │
│             ↓              │
│  ┌─────────────────────┐  │
│  │  Task Queue         │  │  ← Process ONE
│  │  [setTimeout]       │  │
│  │  [setInterval]      │  │
│  │  [I/O callbacks]    │  │
│  └──────────┬──────────┘  │
│             │              │
│             └──→ Repeat    │
└───────────────────────────┘

Event Loop CONTINUOUSLY:
1. Execute call stack until empty
2. Process ALL microtasks
3. Render (if needed)
4. Process ONE macrotask
5. Go to step 2
*/
```

### Contexto Histórico e Evolução

**1995:** JavaScript criado - event loop desde início.

```javascript
// JavaScript 1.0 - event-driven
document.onclick = function() {
  alert("Clicked");
};

// Event loop processa clicks
```

**2009:** Node.js - event loop para server-side.

```javascript
// Node.js - async I/O com event loop
fs.readFile('file.txt', (err, data) => {
  console.log(data);
});

// Event loop processa I/O callbacks
```

**ES5 (2011):** Formalized task model.

```javascript
// ES5 - setTimeout como macrotask
setTimeout(function() {
  console.log("Task");
}, 0);
```

**ES6 (2015):** Promises - microtask queue.

```javascript
// ES6 - Promise.then como microtask
Promise.resolve().then(() => {
  console.log("Microtask");
});

// Event loop processa microtasks ANTES de macrotasks
```

**HTML5 Living Standard (2016+):** Event loop spec.

```
HTML5 - formalizou event loop order:
1. Execute script
2. Microtasks
3. Update rendering
4. Macrotask
5. Repeat
```

**TypeScript 2.0+ (2016+):** Types para async.

```typescript
// TypeScript - typed async
const promise: Promise<number> = Promise.resolve(42);

setTimeout((): void => {
  console.log("Macro");
}, 0);

// Event loop processa com type safety
```

**2018:** queueMicrotask() - explicit scheduling.

```javascript
// queueMicrotask() API
queueMicrotask(() => {
  console.log("Microtask");
});
```

**Modern (2020+):** Consistent cross-engine behavior.

```typescript
// Behavior consistente - V8, SpiderMonkey, JavaScriptCore
console.log("1");
setTimeout(() => console.log("3"), 0);
Promise.resolve().then(() => console.log("2"));

// Todos engines: 1 → 2 → 3 (deterministic)
```

### Problema Fundamental que Resolve

Event loop resolve problemas de **non-blocking execution**, **async coordination**, **UI responsiveness**, e **single-threaded concurrency**.

**Problema 1: Blocking Operations Freeze UI**
```typescript
// Sem event loop - operações bloqueiam ❌

// Imagine código síncrono bloqueante
function processLargeData(data: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < 1000000; i++) {
    result.push(data[i] * 2);  // Processamento pesado
  }
  return result;
}

const data = Array.from({ length: 1000000 }, (_, i) => i);
const processed = processLargeData(data);  // BLOQUEIA por segundos

// Durante processamento:
// ✗ UI congelada
// ✗ Usuário não pode interagir
// ✗ Render bloqueado
// ✗ Outros eventos ignorados
```

**Solução: Event loop permite async processing**
```typescript
// Event loop - non-blocking ✅

function processLargeDataAsync(
  data: number[],
  chunkSize: number = 10000
): Promise<number[]> {
  return new Promise((resolve) => {
    const result: number[] = [];
    let index = 0;
    
    function processChunk(): void {
      const end = Math.min(index + chunkSize, data.length);
      
      for (let i = index; i < end; i++) {
        result.push(data[i] * 2);
      }
      
      index = end;
      
      if (index < data.length) {
        // Agenda próximo chunk (macrotask)
        setTimeout(processChunk, 0);
      } else {
        resolve(result);
      }
    }
    
    processChunk();
  });
}

const data = Array.from({ length: 1000000 }, (_, i) => i);
processLargeDataAsync(data).then(processed => {
  console.log("Done");
});

/*
Event loop processa:
1. Chunk 1 (10k items) - macrotask
2. Render opportunity - UI responde
3. Chunk 2 (10k items) - macrotask
4. Render opportunity - UI responde
5. ... (100 chunks total)

UI não congela - event loop intercala processamento e render
*/
```

**Problema 2: No Coordination Between Async Operations**
```typescript
// Sem event loop order - coordenação impossível ❌

// Imagine múltiplas operações async sem order definida
fetchUser().then(user => {
  console.log("User:", user);
});

fetchPosts().then(posts => {
  console.log("Posts:", posts);
});

// ✗ Ordem indeterminada - qual executa primeiro?
// ✗ Não sabemos quando processadas
// ✗ Race conditions
```

**Solução: Event loop order determinística**
```typescript
// Event loop - ordem determinística ✅

console.log("1. Start");

Promise.resolve().then(() => {
  console.log("2. Microtask 1");
});

setTimeout(() => {
  console.log("4. Macrotask");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask 2");
});

/*
Output ALWAYS:
1. Start
2. Microtask 1
3. Microtask 2
4. Macrotask

Event loop garante:
- Microtasks ANTES de macrotasks
- FIFO dentro de cada queue
- Deterministic execution order
*/
```

**Problema 3: I/O Blocks Single Thread**
```typescript
// Sem event loop - I/O bloqueante ❌

// Imagine leitura síncrona de arquivo
const data = fs.readFileSync('large-file.txt');  // BLOQUEIA
console.log("After read");

// Durante readFileSync:
// ✗ Thread bloqueada
// ✗ Nada mais executa
// ✗ UI congelada (browser)
// ✗ Server não responde requests (Node)
```

**Solução: Event loop com async I/O**
```typescript
// Event loop - non-blocking I/O ✅

fs.readFile('large-file.txt', (err, data) => {
  console.log("2. File read");
});

console.log("1. After scheduling read");

/*
Event loop:
1. readFile inicia operação I/O (não bloqueante)
2. Callback agendado para task queue
3. Call stack continua executando (log "1")
4. Event loop aguarda I/O completar (no background)
5. I/O completa → callback entra task queue
6. Event loop processa callback (log "2")

Thread nunca bloqueada - I/O em background
*/
```

**Problema 4: No Priority for Urgent Work**
```typescript
// Sem microtask queue - sem prioridade ❌

// Imagine Promise.then() e setTimeout mesma prioridade
setTimeout(() => {
  console.log("Heavy work");
}, 0);

Promise.resolve().then(() => {
  console.log("Urgent Promise");  // Deveria executar ANTES
});

// ✗ Se mesma queue, ordem FIFO → timeout primeiro
// ✗ Promise espera timeout completar
```

**Solução: Event loop com microtask priority**
```typescript
// Event loop - microtask priority ✅

setTimeout(() => {
  console.log("2. Macrotask");
}, 0);

Promise.resolve().then(() => {
  console.log("1. Urgent Microtask");
});

/*
Event loop order:
1. Process ALL microtasks (Promise)
2. Process ONE macrotask (setTimeout)

Output:
1. Urgent Microtask  ← Executa PRIMEIRO
2. Macrotask

Priority system garante work urgente processa primeiro
*/
```

**Fundamento teórico:** Event loop implementa **non-blocking concurrency** - single thread com **cooperative multitasking** via **event-driven callbacks**.

### Importância no Ecossistema

Event loop é importante porque:

- **Non-blocking:** Async operations não bloqueiam
- **UI responsiveness:** Render entre tasks
- **Single-threaded concurrency:** Múltiplas operações sem threads
- **Deterministic:** Ordem bem definida
- **I/O efficiency:** Handle múltiplas I/O operations
- **Promise semantics:** Microtask priority
- **Framework foundation:** React, Vue, Node.js usam event loop
- **Performance:** Efficient resource utilization

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Continuous loop:** Nunca para (enquanto programa rodando)
2. **Order:** Script → Microtasks → Render → Macrotask → Repeat
3. **Non-blocking:** Thread nunca bloqueia
4. **Single-threaded:** Uma tarefa por vez (call stack)
5. **Cooperative:** Tasks voluntariamente cedem controle

### Pilares Fundamentais

- **Call stack:** Execute synchronous code
- **Microtask queue:** Process ALL microtasks
- **Render:** Update UI (browser only)
- **Task queue:** Process ONE macrotask
- **Loop back:** Check microtasks again

### Visão Geral das Nuances

- **Browser vs Node:** Browser tem render step
- **Timing:** No guaranteed timing (setTimeout não exato)
- **Starvation:** Infinite microtasks block macrotasks
- **Priority:** Microtasks > Macrotasks
- **FIFO:** Within each queue

## 🧠 Fundamentos Teóricos

### Basic Event Loop Cycle

```typescript
// Basic event loop - one cycle

console.log("1. Sync");

setTimeout(() => console.log("4. Macro"), 0);

Promise.resolve().then(() => console.log("3. Micro"));

console.log("2. Sync");

/*
Event Loop Cycle:

Step 1: Execute script (call stack)
- console.log("1. Sync")
- Schedule setTimeout → Task Queue
- Schedule Promise → Microtask Queue
- console.log("2. Sync")
- Call stack empty

Step 2: Process microtasks
- Execute Promise callback
- console.log("3. Micro")
- Microtask Queue empty

Step 3: Render (if browser, if needed)
- Not applicable here

Step 4: Process ONE macrotask
- Execute setTimeout callback
- console.log("4. Macro")

Step 5: Loop back to Step 2
- Check microtasks (empty)
- Task queue empty
- Wait for more work...
*/
```

**Basic:** Single event loop cycle.

### Princípios e Conceitos Subjacentes

#### Multiple Iterations

```typescript
// Multiple event loop iterations

setTimeout(() => {
  console.log("Macro 1");
  
  Promise.resolve().then(() => {
    console.log("Micro in Macro 1");
  });
}, 0);

setTimeout(() => {
  console.log("Macro 2");
}, 0);

Promise.resolve().then(() => {
  console.log("Micro 1");
});

/*
Output:
Micro 1
Macro 1
Micro in Macro 1
Macro 2

Event Loop Iterations:

=== Iteration 1 ===
1. Script executed (scheduled tasks)
2. Microtasks: "Micro 1"
3. Macrotask: "Macro 1" (schedules microtask)

=== Iteration 2 ===
1. (Call stack empty)
2. Microtasks: "Micro in Macro 1"
3. Macrotask: "Macro 2"

=== Iteration 3 ===
1. (Call stack empty)
2. Microtasks: empty
3. Task queue: empty
4. Wait...
*/
```

**Multiple:** Multiple event loop iterations.

#### Render Timing (Browser)

```typescript
// Browser - render timing

console.log("Start");

requestAnimationFrame(() => {
  console.log("3. RAF (before render)");
});

Promise.resolve().then(() => {
  console.log("2. Microtask");
});

setTimeout(() => {
  console.log("4. Macrotask (after render)");
}, 0);

console.log("1. End");

/*
Output (Browser):
Start
1. End
2. Microtask
3. RAF (before render)
[Render happens]
4. Macrotask

Browser Event Loop:
1. Script
2. Microtasks
3. requestAnimationFrame callbacks
4. RENDER
5. Macrotask

Render happens AFTER microtasks, BEFORE next macrotask
*/
```

**Render:** Browser render timing.

### Nested Scheduling

```typescript
// Nested scheduling - multiple levels

console.log("1. Start");

setTimeout(() => {
  console.log("4. Macro 1");
  
  Promise.resolve().then(() => {
    console.log("5. Micro in Macro 1");
    
    setTimeout(() => {
      console.log("7. Macro in Micro in Macro 1");
    }, 0);
  });
  
  setTimeout(() => {
    console.log("6. Macro 2 in Macro 1");
  }, 0);
}, 0);

Promise.resolve().then(() => {
  console.log("3. Micro 1");
});

console.log("2. End");

/*
Output:
1. Start
2. End
3. Micro 1
4. Macro 1
5. Micro in Macro 1
6. Macro 2 in Macro 1
7. Macro in Micro in Macro 1

Event Loop tracking queues:

After script:
- Microtask: [Micro 1]
- Task: [Macro 1]

After Micro 1:
- Microtask: []
- Task: [Macro 1]

After Macro 1:
- Microtask: [Micro in Macro 1]
- Task: [Macro 2 in Macro 1]

After Micro in Macro 1:
- Microtask: []
- Task: [Macro 2 in Macro 1, Macro in Micro in Macro 1]

Continue...
*/
```

**Nested:** Complex scheduling patterns.

#### Long Task Blocking

```typescript
// Long synchronous task blocks event loop

console.log("1. Start");

setTimeout(() => {
  console.log("Will execute AFTER long task");
}, 0);

// Long synchronous task
console.log("2. Long task starting...");
const start = Date.now();
while (Date.now() - start < 3000) {
  // Busy loop - blocks for 3 seconds
}
console.log("3. Long task finished");

/*
Output:
1. Start
2. Long task starting...
[3 second pause]
3. Long task finished
Will execute AFTER long task

Event loop blocked:
- Synchronous while loop blocks call stack
- setTimeout callback can't execute (waiting for stack to empty)
- Event loop stuck for 3 seconds
- No render during this time (browser freezes)

⚠️ AVOID long synchronous tasks!
*/
```

**Blocking:** Long tasks block event loop.

### Real-World Example - Data Processing Pipeline

```typescript
// Real-world - data processing with event loop

interface DataChunk {
  id: number;
  data: number[];
}

async function processDataPipeline(chunks: DataChunk[]): Promise<void> {
  console.log("Pipeline start");
  
  for (const chunk of chunks) {
    // Process chunk (synchronous)
    console.log(`Processing chunk ${chunk.id}`);
    const processed = chunk.data.map(n => n * 2);
    
    // Yield to event loop (microtask)
    await Promise.resolve();
    
    // Validate (synchronous)
    console.log(`Validating chunk ${chunk.id}`);
    const valid = processed.every(n => n > 0);
    
    // Yield to event loop
    await Promise.resolve();
    
    // Save (simulate async I/O with macrotask)
    await new Promise(resolve => {
      setTimeout(() => {
        console.log(`Saved chunk ${chunk.id}`);
        resolve(undefined);
      }, 0);
    });
  }
  
  console.log("Pipeline complete");
}

const testChunks: DataChunk[] = [
  { id: 1, data: [1, 2, 3] },
  { id: 2, data: [4, 5, 6] }
];

processDataPipeline(testChunks);

/*
Output:
Pipeline start
Processing chunk 1
Validating chunk 1
Saved chunk 1
Processing chunk 2
Validating chunk 2
Saved chunk 2
Pipeline complete

Event Loop iterations:
- Process chunk 1 (sync)
- Microtask (await Promise.resolve)
- Validate chunk 1 (sync)
- Microtask (await Promise.resolve)
- Macrotask (setTimeout save)
- Microtask (Promise from await resolves)
- Process chunk 2 (sync)
- ... repeat

Pipeline yields to event loop between steps
Allows UI updates, other events
*/
```

**Real-World:** Data pipeline with event loop yielding.

#### Modelo Mental para Compreensão

Pense em event loop como **restaurant service**:

**Chef (call stack):** Prepara um prato por vez (synchronous)
**Urgent orders (microtasks):** Processadas ANTES de próximo prato
**Regular orders (macrotasks):** Um prato por vez
**Clean tables (render):** Entre pedidos
**Loop:** Prato → urgent orders → clean → next prato

**Analogia - Mail Processing:**

**Inbox (task queue):** Regular mail
**Priority inbox (microtask queue):** Urgent mail
**Desk (call stack):** Process one item
**Processing loop:**
1. Process current item (call stack)
2. Check ALL priority mail (microtasks)
3. Organize desk (render)
4. Get next regular mail (macrotask)
5. Repeat

**Metáfora - Train Stations:**

**Train (current task):** Arrives at station
**Passengers board (sync code):** Execute
**Express passengers (microtasks):** Board ALL before departure
**Train leaves:** Macrotask completes
**Next train:** Next macrotask
**Loop:** Continuous service

**Fluxo visual:**
```
Event Loop Cycle:

    ┌──────────────┐
    │  Call Stack  │ Execute sync code
    └──────┬───────┘
           │ Empty?
           ↓
    ┌──────────────┐
    │  Microtasks  │ Process ALL
    └──────┬───────┘
           │ Empty?
           ↓
    ┌──────────────┐
    │   Render     │ Update UI (browser)
    └──────┬───────┘
           ↓
    ┌──────────────┐
    │  Macrotask   │ Process ONE
    └──────┬───────┘
           │
           └──→ Loop back to Microtasks
```

## 🔍 Análise Conceitual Profunda

### Complete Event Loop Order

```typescript
// Complete event loop - all components

console.log("1. Script start");

setTimeout(() => {
  console.log("7. Timeout 1");
  
  queueMicrotask(() => {
    console.log("8. Microtask in Timeout 1");
  });
  
  setTimeout(() => {
    console.log("10. Timeout 3");
  }, 0);
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise 1");
  
  Promise.resolve().then(() => {
    console.log("4. Promise 2 (nested)");
  });
});

queueMicrotask(() => {
  console.log("5. queueMicrotask");
});

setTimeout(() => {
  console.log("9. Timeout 2");
}, 0);

console.log("2. Script end");

/*
Output:
1. Script start
2. Script end
3. Promise 1
4. Promise 2 (nested)
5. queueMicrotask
7. Timeout 1
8. Microtask in Timeout 1
9. Timeout 2
10. Timeout 3

Event Loop detailed:

=== Initial Script ===
Call stack: log "1", schedule timeouts/promises, log "2"

=== After Script (Iteration 1) ===
Microtasks:
- Promise 1 → schedules Promise 2
- Promise 2 (nested)
- queueMicrotask
All processed before moving on

=== Iteration 2 ===
Macrotask: Timeout 1 → schedules microtask and Timeout 3
Microtasks: Microtask in Timeout 1

=== Iteration 3 ===
Macrotask: Timeout 2

=== Iteration 4 ===
Macrotask: Timeout 3
*/
```

**Complete:** Full event loop with all components.

#### Node.js Event Loop Phases

```typescript
// Node.js - event loop phases

/*
Node.js Event Loop Phases:

┌───────────────────────────┐
┌─>│           timers          │  setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O callbacks deferred
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal use
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  Retrieve new I/O events
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  socket.on('close', ...)
   └───────────────────────────┘

Between each phase:
- process.nextTick queue (highest priority)
- Microtask queue (Promises)
*/

// Example
setTimeout(() => console.log("setTimeout"), 0);

setImmediate(() => console.log("setImmediate"));

Promise.resolve().then(() => console.log("Promise"));

process.nextTick(() => console.log("nextTick"));

/*
Output (Node.js):
nextTick      ← Highest priority
Promise       ← Microtask
setTimeout    ← Timers phase
setImmediate  ← Check phase

Node.js event loop mais complex que browser
*/
```

**Node.js:** Different event loop phases.

### Browser Event Loop with Rendering

```typescript
// Browser - rendering in event loop

let frame = 0;

function animate(): void {
  console.log(`Frame ${frame++}`);
  
  // Schedule microtask
  Promise.resolve().then(() => {
    console.log(`  Microtask in frame ${frame - 1}`);
  });
  
  // Schedule next frame
  if (frame < 3) {
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);

/*
Browser Event Loop:

Frame 0:
1. Execute animate() callback
2. log "Frame 0"
3. Schedule microtask
4. Schedule next RAF
5. Process microtasks: log "  Microtask in frame 0"
6. Execute RAF callbacks (none yet)
7. RENDER

Frame 1:
1. Execute animate() callback
2. log "Frame 1"
3. Schedule microtask
4. Schedule next RAF
5. Process microtasks: log "  Microtask in frame 1"
6. Execute RAF callbacks (none yet)
7. RENDER

Frame 2:
1. Execute animate() callback
2. log "Frame 2"
3. Schedule microtask
4. Process microtasks: log "  Microtask in frame 2"
5. RENDER

Render happens ~60 FPS (every 16.7ms)
Event loop coordinates with display refresh
*/
```

**Browser:** Rendering in event loop.

#### Event Loop Starvation

```typescript
// Event loop starvation - infinite microtasks

let count = 0;

function infiniteMicrotask(): void {
  if (count < 1000000) {
    count++;
    queueMicrotask(infiniteMicrotask);
  }
}

setTimeout(() => {
  console.log("Macrotask - NEVER RUNS (starved)");
}, 0);

infiniteMicrotask();

/*
Event Loop:
1. Script runs, schedules setTimeout and starts microtasks
2. Microtask queue: [infiniteMicrotask]
3. Process microtask → schedules another microtask
4. Microtask queue: [infiniteMicrotask]
5. Process microtask → schedules another
6. ... infinite loop
7. Macrotask NEVER processes (starved)

⚠️ DANGER: Infinite microtasks block event loop
Browser freezes, setTimeout never runs

Fix: Limit microtask depth or use setTimeout for yielding
*/

// Fixed version
function fixedMicrotask(): void {
  if (count < 1000000) {
    count++;
    
    // Yield every 1000 iterations
    if (count % 1000 === 0) {
      setTimeout(fixedMicrotask, 0);  // Macrotask (yields)
    } else {
      queueMicrotask(fixedMicrotask);
    }
  }
}
```

**Starvation:** Infinite microtasks block macrotasks.

## 🎯 Aplicabilidade e Contextos

### Async Data Fetching

```typescript
async function fetchDashboard(): Promise<void> {
  const user = await fetchUser();        // Macrotask (HTTP)
  const posts = await fetchPosts(user);  // Microtasks between
  render(posts);
}
// Event loop coordinates async operations
```

**Raciocínio:** Event loop manages async flow.

### Animation Loop

```typescript
function gameLoop(): void {
  updateGameState();  // Sync
  render();           // Sync
  requestAnimationFrame(gameLoop);  // Next frame
}
// Event loop coordinates with display refresh
```

**Raciocínio:** Event loop syncs with render.

### Batch Processing

```typescript
async function batchProcess(items: Item[]): Promise<void> {
  for (const item of items) {
    processItem(item);
    await Promise.resolve();  // Yield to event loop
  }
}
```

**Raciocínio:** Yield between batches.

## ⚠️ Limitações e Considerações Teóricas

### No Guaranteed Timing

```typescript
// setTimeout(0) não é instantâneo

const start = Date.now();
setTimeout(() => {
  const elapsed = Date.now() - start;
  console.log(`Elapsed: ${elapsed}ms`);  // ~4-10ms, not 0ms
}, 0);

// Browsers enforce minimum delay (~4ms)
// Node.js também tem delays
```

**Limitação:** No precise timing.

### Long Tasks Block Everything

```typescript
// Long sync task blocks event loop

function longTask(): void {
  for (let i = 0; i < 1000000000; i++) {
    // Busy loop
  }
}

longTask();  // Blocks for seconds
// UI frozen, no async code runs
```

**Consideração:** Break up long tasks.

### Platform Differences

```typescript
// Browser vs Node.js differences

// Browser: requestAnimationFrame exists
requestAnimationFrame(() => {});

// Node.js: setImmediate, process.nextTick
setImmediate(() => {});
process.nextTick(() => {});

// Write cross-platform carefully
```

**Consideração:** Platform-specific APIs.

## 🔗 Interconexões Conceituais

**Relação com Call Stack:** Stack must be empty for event loop.

**Relação com Promises:** Promise.then microtask priority.

**Relação com setTimeout:** Macrotask scheduling.

**Relação com Async/Await:** Built on event loop.

**Relação com Rendering:** Browser coordinates render.

## 🚀 Evolução e Próximos Conceitos

Dominar Event Loop Order prepara para:
- **Performance optimization:** Minimize blocking
- **Async patterns:** Efficient async code
- **Framework internals:** React, Vue scheduling
- **Testing:** Async test control
- **Debugging:** Understand async timing
- **Worker threads:** Multi-threaded JavaScript
