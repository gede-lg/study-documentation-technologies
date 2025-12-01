# Task Queue vs. Microtask Queue

## 🎯 Introdução e Definição

### Definição Conceitual

**Task Queue** (também chamada **Macrotask Queue** ou **Callback Queue**) e **Microtask Queue** são **duas filas separadas** que gerenciam **callbacks assíncronos** em JavaScript/TypeScript. **Task Queue** armazena callbacks de **macrotasks** (setTimeout, setInterval, I/O, UI events) - uma macrotask executada **por iteração do event loop**. **Microtask Queue** armazena callbacks de **microtasks** (Promise.then/catch/finally, queueMicrotask, MutationObserver) - **todas microtasks executadas** após cada macrotask, antes de próxima macrotask.

Conceitualmente, implementam **priority scheduling** - microtasks têm **prioridade sobre macrotasks**. Seguem **FIFO discipline** (First-In-First-Out) dentro de cada fila. TypeScript/JavaScript engines (V8) processam **todas microtasks** após **cada macrotask**, garantindo **microtask starvation** se microtasks continuamente agendarem novas microtasks.

**Fundamento teórico:** Task/Microtask queues derivam de **event-driven programming** - separar código assíncrono em unidades executáveis. Implementam **two-tier priority system** - microtasks (high priority) vs macrotasks (normal priority). Suportam **non-blocking execution** - callbacks agendados para futuro, liberando call stack. É **deterministic** - ordem bem definida: macrotask → all microtasks → render → next macrotask.

**Pattern básico:**
```typescript
// Task Queue vs. Microtask Queue

console.log("1. Sync start");

// MACROTASK - vai para Task Queue
setTimeout(() => {
  console.log("4. Timeout (macrotask)");
}, 0);

// MICROTASK - vai para Microtask Queue
Promise.resolve().then(() => {
  console.log("3. Promise (microtask)");
});

console.log("2. Sync end");

/*
Output:
1. Sync start
2. Sync end
3. Promise (microtask)    ← ANTES do setTimeout
4. Timeout (macrotask)

Explicação:
1. Código síncrono executa primeiro (call stack)
2. Call stack esvazia
3. Event loop processa TODAS microtasks (Promise)
4. Event loop pega próxima macrotask (setTimeout)

Microtasks SEMPRE antes de macrotasks!
*/
```

**Queue priority:**
```typescript
// Microtask Queue tem prioridade sobre Task Queue

setTimeout(() => {
  console.log("Macrotask 1");
}, 0);

setTimeout(() => {
  console.log("Macrotask 2");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask 1");
});

Promise.resolve().then(() => {
  console.log("Microtask 2");
});

console.log("Sync");

/*
Output:
Sync
Microtask 1
Microtask 2
Macrotask 1
Macrotask 2

Execution order:
1. Sync code (call stack)
2. ALL microtasks (Microtask Queue)
3. One macrotask (Task Queue)
4. Render (se necessário)
5. ALL new microtasks
6. Next macrotask
7. Repeat...

Event loop: macrotask → all microtasks → render → next macrotask
*/
```

**Nested scheduling:**
```typescript
// Microtask dentro de macrotask

setTimeout(() => {
  console.log("Macrotask 1 start");
  
  Promise.resolve().then(() => {
    console.log("Microtask inside Macrotask 1");
  });
  
  console.log("Macrotask 1 end");
}, 0);

setTimeout(() => {
  console.log("Macrotask 2");
}, 0);

/*
Output:
Macrotask 1 start
Macrotask 1 end
Microtask inside Macrotask 1  ← Executa ANTES de Macrotask 2
Macrotask 2

Event loop:
1. Pega Macrotask 1 do Task Queue
2. Executa Macrotask 1 (logs "start" e "end")
3. Macrotask 1 agenda microtask
4. Macrotask 1 completa
5. Event loop processa microtasks (executa microtask)
6. Microtask Queue vazia
7. Event loop pega Macrotask 2
8. Executa Macrotask 2
*/
```

### Contexto Histórico e Evolução

**Anos 1990:** Task Queue (macrotasks apenas).

```javascript
// JavaScript inicial - apenas setTimeout
setTimeout(function() {
  console.log("Async callback");
}, 0);

// Apenas Task Queue (macrotasks)
```

**2007:** Node.js - nextTick introduzido.

```javascript
// Node.js - process.nextTick (precursor de microtasks)
process.nextTick(() => {
  console.log("Next tick");
  // Executa antes de I/O callbacks
});
```

**ES6 (2015):** Promises - Microtask Queue standardized.

```javascript
// ES6 - Promise.then usa Microtask Queue
Promise.resolve().then(() => {
  console.log("Microtask");
});

// Microtask Queue oficialmente parte da spec
```

**2015:** HTML5 spec - Task vs Microtask.

```
HTML5 Living Standard:
- Task: setTimeout, setInterval, I/O
- Microtask: Promise, MutationObserver, queueMicrotask
- Event loop order defined
```

**2018:** queueMicrotask() API.

```javascript
// queueMicrotask() - explicit microtask scheduling
queueMicrotask(() => {
  console.log("Explicit microtask");
});

// Antes: Promise.resolve().then() era workaround
```

**TypeScript 2.0+ (2016+):** Types para async.

```typescript
// TypeScript - typed Promise (microtask)
const promise: Promise<number> = Promise.resolve(42);

promise.then((value: number) => {
  console.log(value);
  // Microtask Queue
});
```

**Modern (2020+):** Consistent behavior across engines.

```typescript
// Behavior consistente - V8, SpiderMonkey, JavaScriptCore
setTimeout(() => console.log("Macro"), 0);
Promise.resolve().then(() => console.log("Micro"));
queueMicrotask(() => console.log("Micro 2"));

// Todos engines: Sync → Micro → Micro 2 → Macro
```

### Problema Fundamental que Resolve

Task/Microtask queues resolvem problemas de **async priority**, **callback ordering**, **UI responsiveness**, e **Promise semantics**.

**Problema 1: Need Different Priorities for Async Code**
```typescript
// Sem microtask queue - todos async callbacks mesma prioridade ❌

// Imagine apenas Task Queue - sem priority
setTimeout(() => {
  console.log("Heavy I/O");
}, 0);

// Promise callback - deveria executar mais cedo
Promise.resolve().then(() => {
  console.log("Quick Promise");
});

// ✗ Se ambos Task Queue, ordem indeterminada
// ✗ Promise pode esperar muito tempo
// ✗ Sem priorização
```

**Solução: Microtask Queue tem priority**
```typescript
// Microtask Queue - high priority ✅

setTimeout(() => {
  console.log("2. Macrotask (I/O)");
}, 0);

Promise.resolve().then(() => {
  console.log("1. Microtask (Promise)");
});

/*
Output:
1. Microtask (Promise)  ← Executa PRIMEIRO
2. Macrotask (I/O)

Microtask Queue esvaziada ANTES de pegar próxima macrotask
Garante Promises respondem rapidamente
*/
```

**Problema 2: Promise Chain Should Execute Together**
```typescript
// Sem microtask priority - Promise chain interrompida ❌

// Imagine Promise.then() usando Task Queue
Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    return 42;
  })
  .then((value) => {
    console.log("Promise 2:", value);
  });

setTimeout(() => {
  console.log("Timeout");
}, 0);

// Se Promise.then() usasse Task Queue:
// Output poderia ser: Promise 1 → Timeout → Promise 2
// ✗ Chain interrompida por setTimeout
```

**Solução: Microtasks executam todas juntas**
```typescript
// Microtask Queue - chain não interrompida ✅

Promise.resolve()
  .then(() => {
    console.log("1. Promise 1");
    return 42;
  })
  .then((value) => {
    console.log("2. Promise 2:", value);
  });

setTimeout(() => {
  console.log("3. Timeout");
}, 0);

/*
Output:
1. Promise 1
2. Promise 2: 42
3. Timeout

Promise chain executa completa (todas microtasks)
ANTES de processar setTimeout (macrotask)
*/
```

**Problema 3: UI Responsiveness vs Async Work**
```typescript
// Sem separação - UI pode bloquear ❌

// Imagine todos callbacks Task Queue
for (let i = 0; i < 1000; i++) {
  Promise.resolve().then(() => {
    // Work intensivo
  });
}

// ✗ Se Promises usassem Task Queue, UI bloquearia
// ✗ 1000 macrotasks antes de render
```

**Solução: Microtasks entre macrotasks e render**
```typescript
// Microtask Queue - não bloqueia render tanto ✅

// Event loop order:
// 1. Macrotask
// 2. ALL microtasks
// 3. Render (se necessário)
// 4. Next macrotask

setTimeout(() => {
  console.log("Macrotask 1");
  
  // Agenda 100 microtasks
  for (let i = 0; i < 100; i++) {
    Promise.resolve().then(() => {
      console.log(`Microtask ${i}`);
    });
  }
}, 0);

setTimeout(() => {
  console.log("Macrotask 2");
}, 0);

/*
Execution:
1. Macrotask 1 executa
2. Agenda 100 microtasks
3. Macrotask 1 completa
4. ALL 100 microtasks executam
5. Render opportunity
6. Macrotask 2 executa

Microtasks podem bloquear render se infinitas
Mas design permite render entre macrotasks
*/
```

**Problema 4: Ordering Guarantees for Promises**
```typescript
// Promise spec requer ordering ❌

// Promise/A+ spec: .then() deve executar assincronamente
// Mas ANTES de I/O callbacks

const promise = Promise.resolve(42);

promise.then(value => {
  console.log("Promise:", value);
});

setTimeout(() => {
  console.log("Timeout");
}, 0);

// Spec requer: Promise ANTES de Timeout
// ✗ Sem Microtask Queue, difícil garantir
```

**Solução: Microtask Queue garante ordering**
```typescript
// Microtask Queue - ordering garantido ✅

Promise.resolve(42).then(value => {
  console.log("1. Promise:", value);
});

setTimeout(() => {
  console.log("2. Timeout");
}, 0);

/*
Promise/A+ spec compliance:
- .then() callbacks são microtasks
- Microtasks executam ANTES de macrotasks
- Ordering garantido: Promise → Timeout

Output sempre:
1. Promise: 42
2. Timeout
*/
```

**Fundamento teórico:** Task/Microtask queues implementam **two-tier priority scheduling** - separar async callbacks por urgência, permitindo **responsive execution**.

### Importância no Ecossistema

Task/Microtask queues são importantes porque:

- **Promise semantics:** Microtasks para .then()/.catch()/.finally()
- **Priority scheduling:** Microtasks antes de macrotasks
- **UI responsiveness:** Render opportunities entre macrotasks
- **Ordering guarantees:** Deterministic async execution
- **Spec compliance:** Promise/A+, HTML5 specs
- **Performance:** Batch related work (microtasks)
- **Async/await:** Built on Promises (microtasks)
- **Testing:** Predictable async behavior

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Two queues:** Task Queue (macrotasks) vs Microtask Queue
2. **Priority:** Microtasks ALWAYS before next macrotask
3. **FIFO:** Both queues First-In-First-Out
4. **All microtasks:** Process ALL before next macrotask
5. **One macrotask:** Process ONE per event loop iteration

### Pilares Fundamentais

- **Task Queue:** setTimeout, setInterval, I/O, UI events
- **Microtask Queue:** Promise.then, queueMicrotask, MutationObserver
- **Event loop order:** Macrotask → all microtasks → render → repeat
- **Starvation risk:** Infinite microtasks block macrotasks
- **Deterministic:** Well-defined execution order

### Visão Geral das Nuances

- **process.nextTick (Node):** Higher priority que microtasks
- **setImmediate (Node):** Macrotask
- **requestAnimationFrame:** Before render, não microtask
- **MutationObserver:** Microtask (DOM changes)
- **queueMicrotask():** Explicit microtask scheduling

## 🧠 Fundamentos Teóricos

### Basic Queue Difference

```typescript
// Task Queue (macrotask) vs Microtask Queue

// MACROTASK - Task Queue
setTimeout(() => {
  console.log("Macrotask");
}, 0);

// MICROTASK - Microtask Queue
Promise.resolve().then(() => {
  console.log("Microtask");
});

queueMicrotask(() => {
  console.log("Microtask 2");
});

console.log("Sync");

/*
Output:
Sync
Microtask
Microtask 2
Macrotask

Order:
1. Sync code (call stack)
2. ALL microtasks (Microtask Queue)
3. Macrotask (Task Queue)
*/
```

**Basic:** Microtasks before macrotasks.

### Princípios e Conceitos Subjacentes

#### Multiple Microtasks

```typescript
// Todas microtasks executam antes de próxima macrotask

setTimeout(() => console.log("Macro 1"), 0);

Promise.resolve().then(() => console.log("Micro 1"));
Promise.resolve().then(() => console.log("Micro 2"));
Promise.resolve().then(() => console.log("Micro 3"));

setTimeout(() => console.log("Macro 2"), 0);

/*
Output:
Micro 1
Micro 2
Micro 3
Macro 1
Macro 2

Event loop:
1. Call stack empty
2. Process ALL microtasks (Micro 1, 2, 3)
3. Microtask Queue empty
4. Process ONE macrotask (Macro 1)
5. Check microtasks (empty)
6. Process ONE macrotask (Macro 2)
*/
```

**Multiple:** All microtasks processed together.

#### Microtask Scheduling Microtask

```typescript
// Microtask pode agendar outra microtask

Promise.resolve().then(() => {
  console.log("Microtask 1");
  
  // Agenda nova microtask
  Promise.resolve().then(() => {
    console.log("Microtask 2 (nested)");
  });
});

setTimeout(() => {
  console.log("Macrotask");
}, 0);

/*
Output:
Microtask 1
Microtask 2 (nested)  ← Executa ANTES de Macrotask
Macrotask

Event loop:
1. Process Microtask 1
2. Microtask 1 agenda Microtask 2
3. Continue processando microtasks
4. Process Microtask 2
5. Microtask Queue vazia
6. Process Macrotask
*/
```

**Nested:** Microtask queue continues processing.

### Macrotask Scheduling Microtask

```typescript
// Macrotask pode agendar microtask

setTimeout(() => {
  console.log("Macrotask 1 start");
  
  Promise.resolve().then(() => {
    console.log("Microtask (from Macrotask 1)");
  });
  
  console.log("Macrotask 1 end");
}, 0);

setTimeout(() => {
  console.log("Macrotask 2");
}, 0);

/*
Output:
Macrotask 1 start
Macrotask 1 end
Microtask (from Macrotask 1)  ← ANTES de Macrotask 2
Macrotask 2

Event loop:
1. Process Macrotask 1
2. Macrotask 1 completa, agendou microtask
3. Check Microtask Queue - não vazia
4. Process microtask
5. Microtask Queue vazia
6. Process Macrotask 2
*/
```

**Macrotask → Microtask:** Microtask antes de próxima macrotask.

#### Microtask Starvation

```typescript
// DANGER - infinite microtasks bloqueiam macrotasks

function addMicrotask(): void {
  Promise.resolve().then(() => {
    console.log("Microtask");
    addMicrotask();  // Agenda outra microtask
  });
}

setTimeout(() => {
  console.log("Macrotask - NEVER RUNS");
}, 0);

addMicrotask();

/*
Event loop:
1. Process Microtask
2. Microtask agenda nova Microtask
3. Microtask Queue nunca fica vazia
4. Macrotask NUNCA executa
5. UI BLOQUEADA (no browser)

⚠️ MICROTASK STARVATION:
- Infinite microtasks bloqueiam event loop
- Macrotasks nunca executam
- Render nunca acontece
- Browser/Node congela
*/
```

**Starvation:** Infinite microtasks block macrotasks.

### Real-World Example - Promise Chain vs setTimeout

```typescript
// Promise chain (microtasks) vs setTimeout (macrotasks)

console.log("Start");

setTimeout(() => {
  console.log("Timeout 1");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    return Promise.resolve();
  })
  .then(() => {
    console.log("Promise 2");
  })
  .then(() => {
    console.log("Promise 3");
  });

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

console.log("End");

/*
Output:
Start
End
Promise 1
Promise 2
Promise 3
Timeout 1
Timeout 2

Event loop:
1. Sync: "Start", "End"
2. Call stack empty
3. Microtasks: Promise 1, 2, 3 (ALL)
4. Microtask Queue empty
5. Macrotask: Timeout 1
6. Check microtasks (empty)
7. Macrotask: Timeout 2

Promise chain completa ANTES de qualquer setTimeout
*/
```

**Real-World:** Promise chains não interrompidas.

#### Modelo Mental para Compreensão

Pense em Task/Microtask queues como **VIP lane vs regular lane**:

**VIP lane:** Microtask Queue
**Regular lane:** Task Queue
**VIP always first:** Microtasks antes de macrotasks
**All VIPs processed:** Todas microtasks antes de próxima macrotask
**One regular at a time:** Uma macrotask por vez

**Analogia - Email Priority:**

**Urgent emails:** Microtasks
**Normal emails:** Macrotasks
**Check urgent first:** Processar todas microtasks
**Then one normal:** Processar uma macrotask
**Repeat:** Check urgent again

**Metáfora - Restaurant Service:**

**Table orders (macrotasks):** Atender uma mesa por vez
**Urgent requests (microtasks):** Atender TODAS requests urgentes antes de próxima mesa
**Service loop:** Mesa → todas requests urgentes → próxima mesa

**Fluxo visual:**
```
Event Loop:

┌──────────────────┐
│  Call Stack      │  Execute sync code
└────────┬─────────┘
         │ Empty
         ↓
┌──────────────────┐
│ Microtask Queue  │  Process ALL microtasks
│ [Promise.then]   │
│ [queueMicrotask] │
└────────┬─────────┘
         │ Empty
         ↓
┌──────────────────┐
│   Render         │  Update UI (if needed)
└────────┬─────────┘
         ↓
┌──────────────────┐
│  Task Queue      │  Process ONE macrotask
│ [setTimeout]     │
│ [setInterval]    │
└────────┬─────────┘
         │
         └──→ Repeat
```

## 🔍 Análise Conceitual Profunda

### Event Loop Order

```typescript
// Complete event loop order

console.log("1. Sync start");

setTimeout(() => {
  console.log("5. Timeout");
  
  Promise.resolve().then(() => {
    console.log("6. Promise in Timeout");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise 1");
  
  setTimeout(() => {
    console.log("7. Timeout in Promise");
  }, 0);
});

Promise.resolve().then(() => {
  console.log("4. Promise 2");
});

console.log("2. Sync end");

/*
Output:
1. Sync start
2. Sync end
3. Promise 1
4. Promise 2
5. Timeout
6. Promise in Timeout
7. Timeout in Promise

Event loop iterations:

Iteration 1:
- Call stack: "1", "2"
- Microtasks: "3", "4" (ALL)
- Macrotask: "5"
- Macrotask agenda microtask

Iteration 2:
- Microtasks: "6"
- Macrotask: "7"
*/
```

**Event Loop:** Complete iteration order.

#### Node.js - process.nextTick

```typescript
// Node.js - process.nextTick tem prioridade sobre microtasks

setTimeout(() => console.log("4. Timeout"), 0);

Promise.resolve().then(() => console.log("3. Promise"));

process.nextTick(() => console.log("2. nextTick"));

console.log("1. Sync");

/*
Output (Node.js):
1. Sync
2. nextTick        ← ANTES de Promise
3. Promise
4. Timeout

Node.js order:
1. Sync code
2. process.nextTick queue (highest priority)
3. Microtask queue (Promises)
4. Task queue (setTimeout)

process.nextTick > microtasks > macrotasks
*/
```

**Node.js:** nextTick higher priority.

### Browser - requestAnimationFrame

```typescript
// Browser - requestAnimationFrame timing

setTimeout(() => console.log("Timeout"), 0);

Promise.resolve().then(() => console.log("Promise"));

requestAnimationFrame(() => console.log("RAF"));

console.log("Sync");

/*
Output (Browser):
Sync
Promise
RAF (before render)
Timeout

Browser event loop:
1. Sync code
2. Microtasks (Promise)
3. requestAnimationFrame callbacks (before render)
4. Render
5. Macrotask (Timeout)

RAF executa ANTES de render, DEPOIS de microtasks
Não é microtask nem macrotask
*/
```

**Browser:** RAF before render.

#### MutationObserver - Microtask

```typescript
// MutationObserver - microtask queue

const observer = new MutationObserver(() => {
  console.log("2. DOM mutation (microtask)");
});

const div = document.createElement('div');
observer.observe(div, { childList: true });

console.log("1. Sync");

div.textContent = "Changed";  // Trigger mutation

setTimeout(() => {
  console.log("3. Timeout (macrotask)");
}, 0);

/*
Output:
1. Sync
2. DOM mutation (microtask)
3. Timeout (macrotask)

MutationObserver callbacks são microtasks
Executam ANTES de macrotasks (setTimeout)
*/
```

**MutationObserver:** Microtask scheduling.

### queueMicrotask API

```typescript
// queueMicrotask() - explicit microtask scheduling

setTimeout(() => console.log("3. Timeout"), 0);

queueMicrotask(() => {
  console.log("2. Microtask");
});

console.log("1. Sync");

/*
Output:
1. Sync
2. Microtask
3. Timeout

queueMicrotask():
- Explicitly schedule microtask
- Same queue as Promise.then()
- More semantic than Promise.resolve().then()
*/
```

**queueMicrotask:** Explicit microtask API.

## 🎯 Aplicabilidade e Contextos

### Promise Chains

```typescript
Promise.resolve()
  .then(() => fetchUser())
  .then(user => fetchPosts(user))
  .then(posts => render(posts));
// Chain executa sem interrupção (microtasks)
```

**Raciocínio:** Chain não interrompida por macrotasks.

### Batching Updates

```typescript
function batchUpdates(items: Item[]): void {
  items.forEach(item => {
    queueMicrotask(() => processItem(item));
  });
  // All microtasks executam juntas
}
```

**Raciocínio:** Batch related work.

### Debouncing with Microtask

```typescript
let pending = false;

function debounce(fn: () => void): void {
  if (!pending) {
    pending = true;
    queueMicrotask(() => {
      fn();
      pending = false;
    });
  }
}
```

**Raciocínio:** Execute once per event loop cycle.

## ⚠️ Limitações e Considerações Teóricas

### Microtask Starvation Risk

```typescript
// Infinite microtasks bloqueiam

function infiniteMicrotasks(): void {
  queueMicrotask(infiniteMicrotasks);
}

infiniteMicrotasks();
// Macrotasks nunca executam
// UI congela
```

**Limitação:** Microtasks podem starve macrotasks.

### No Guaranteed Timing

```typescript
// setTimeout(0) não garante 0ms

setTimeout(() => {
  console.log("Timeout");
}, 0);

// Não executa imediatamente
// Espera call stack + microtasks esvaziar
// Mínimo ~4ms em browsers
```

**Consideração:** Zero delay não é instantâneo.

### Different Behavior Node vs Browser

```typescript
// process.nextTick apenas Node.js

process.nextTick(() => {
  console.log("nextTick");
});
// TypeError em browser

// Use queueMicrotask para cross-platform
queueMicrotask(() => {
  console.log("Microtask");
});
```

**Consideração:** Platform differences.

## 🔗 Interconexões Conceituais

**Relação com Promises:** .then()/.catch() são microtasks.

**Relação com Event Loop:** Queues processadas por event loop.

**Relação com Async/Await:** Built on Promises (microtasks).

**Relação com setTimeout:** Macrotask scheduling.

**Relação com Call Stack:** Queues processadas quando stack vazia.

## 🚀 Evolução e Próximos Conceitos

Dominar Task/Microtask Queues prepara para:
- **Event Loop Order:** Complete execution model
- **Performance optimization:** Batch vs defer work
- **Async patterns:** Promise scheduling strategies
- **Testing async code:** Microtask flushing
- **Debugging:** Understanding async timing
- **Framework internals:** React, Vue scheduling
