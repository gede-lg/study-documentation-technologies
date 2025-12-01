# Promise.race()

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.race()** é **método estático que retorna Promise que resolve/rejeita assim que primeira Promise do array resolve/rejeita**. Aceita **array (ou iterable) de Promises** e retorna **Promise única** com valor/erro da **primeira a completar** (settled). Diferentemente de Promise.all() (aguarda todas), race() implementa **winner-takes-all** - apenas primeiro resultado importa, restantes ignoradas.

Conceitualmente, race() implementa **competitive execution** - múltiplas Promises competem, primeira vence. Segue **first-come-first-served semantics** - ordem de conclusão, não ordem no array. TypeScript infere **union type** - `Promise.race([Promise<A>, Promise<B>])` retorna `Promise<A | B>`. Útil para **timeouts**, **fallbacks**, e **performance optimization** (fastest source wins).

**Fundamento teórico:** Promise.race() deriva de **ambiguous choice operator** - escolher entre múltiplas possibilidades, primeira disponível vence. Implementa **non-deterministic computation** - resultado depende de timing, não inputs. Suporta **short-circuit evaluation** - primeira conclusão determina resultado, restantes ignoradas (mas continuam executando). É **racing pattern** - competição entre recursos/operações.

**Pattern básico:**
```typescript
// Promise.race() - primeira a resolver vence

const p1 = new Promise(resolve => setTimeout(() => resolve("Slow"), 2000));
const p2 = new Promise(resolve => setTimeout(() => resolve("Fast"), 500));
const p3 = new Promise(resolve => setTimeout(() => resolve("Medium"), 1000));

Promise.race([p1, p2, p3]).then(result => {
  console.log("Winner:", result);  // "Fast" (p2 completou primeiro)
});

// p2 resolve em 500ms → race() resolve com "Fast"
// p3 e p1 continuam executando mas resultados ignorados
```

**Uso principal - timeout:**
```typescript
// Timeout pattern - fail se demorar muito

function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const fetchPromise = fetch(url);
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Usar
fetchWithTimeout('/api/data', 5000)
  .then(response => console.log("Success:", response))
  .catch(error => console.error("Failed or timeout:", error));

// Se fetch > 5s → timeout rejeita → race() rejeita
// Se fetch < 5s → fetch resolve → race() resolve
```

**First rejection vence também:**
```typescript
// Promise.race() - primeira rejection também vence

const p1 = new Promise((_, reject) => setTimeout(() => reject(new Error("Error")), 100));
const p2 = new Promise(resolve => setTimeout(() => resolve("Success"), 200));

Promise.race([p1, p2])
  .then(result => {
    console.log("Success:", result);  // ✗ Não executa
  })
  .catch(error => {
    console.error("Error:", error.message);  // "Error" - p1 rejeitou primeiro
  });

// p1 rejeita em 100ms → race() rejeita
// p2 completaria em 200ms mas ignorada
```

### Contexto Histórico e Evolução

**ES6/ES2015:** Promise.race() introduzido.

```javascript
// ES6 - Promise.race() nativo
Promise.race([
  fetch('/primary-server'),
  fetch('/backup-server')
]).then(response => {
  // Primeira resposta vence
});
```

**TypeScript 1.0 (2014):** Typed race().

```typescript
// TypeScript 1.0 - type-safe
const promises: Promise<number>[] = [
  Promise.resolve(1),
  Promise.resolve(2)
];

Promise.race(promises).then((result: number) => {
  console.log(result);  // 1 ou 2 (primeira)
});
```

**TypeScript 3.0 (2018):** Union types.

```typescript
// TypeScript 3.0 - preserve individual types
Promise.race([
  Promise.resolve(42),        // number
  Promise.resolve("hello"),   // string
  Promise.resolve(true)       // boolean
]).then(result => {
  // result: number | string | boolean (union type)
});
```

**ES2020:** Promise.any() adicionado.

```javascript
// ES2020 - any() ignora rejections
Promise.any([p1, p2, p3])
  .then(result => {
    // Primeira fulfilled (ignora rejections)
  });

// race() aceita rejection
// any() ignora rejections até todas falharem
```

**TypeScript 4.5 (2021):** Awaited utility.

```typescript
// TypeScript 4.5 - Awaited<T>
type Result = Awaited<ReturnType<typeof Promise.race<[Promise<number>, Promise<string>]>>>;
// number | string
```

**Antes vs Depois:**

**Pré-Promise.race() (callbacks):**
```javascript
// Callbacks - difícil implementar racing ❌

let completed = false;

fetchPrimary(function(error, result) {
  if (!completed) {
    completed = true;
    if (error) handleError(error);
    else handleResult(result);
  }
});

fetchBackup(function(error, result) {
  if (!completed) {
    completed = true;
    if (error) handleError(error);
    else handleResult(result);
  }
});

// Precisa flag manual, propenso a race conditions
```

**Pós-Promise.race():**
```typescript
// Promise.race() - clean ✅

Promise.race([
  fetchPrimary(),
  fetchBackup()
]).then(result => {
  handleResult(result);
}).catch(error => {
  handleError(error);
});

// Automático, seguro
```

### Problema Fundamental que Resolve

Promise.race() resolve problemas de **timeouts**, **fallback sources**, **performance optimization**, e **redundancy**.

**Problema 1: No Timeout Mechanism**
```typescript
// Sem timeout - request pode travar indefinidamente ❌

async function fetchData(url: string): Promise<Data> {
  const response = await fetch(url);
  return response.json();
}

// Se servidor não responde - trava para sempre
fetchData('/api/slow-endpoint');  // Pode nunca completar
```

**Solução: Promise.race() implementa timeout**
```typescript
// Timeout com race() ✅

function fetchWithTimeout(url: string, timeoutMs: number): Promise<Data> {
  const fetchPromise = fetch(url).then(r => r.json());
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), timeoutMs);
  });
  
  return Promise.race([fetchPromise, timeoutPromise]);
}

// Usar
fetchWithTimeout('/api/slow-endpoint', 5000)
  .then(data => console.log("Success:", data))
  .catch(error => {
    if (error.message === "Timeout") {
      console.error("Request took too long");
    }
  });

// Garante conclusão em máximo 5s
```

**Problema 2: Single Point of Failure**
```typescript
// Single source - sem fallback ❌

async function getData(): Promise<Data> {
  return fetch('/primary-api').then(r => r.json());
}

// Se primary-api falha → sem dados
```

**Solução: Promise.race() fallback automático**
```typescript
// Multiple sources - fastest vence ✅

async function getDataWithFallback(): Promise<Data> {
  return Promise.race([
    fetch('/primary-api').then(r => r.json()),
    fetch('/backup-api').then(r => r.json()),
    fetch('/cache-api').then(r => r.json())
  ]);
}

// Primeira fonte disponível vence
// Redundância - se uma falha, outras podem suceder
```

**Problema 3: Performance - Wait for Slowest**
```typescript
// Aguardar source mais lenta - desperdiça tempo ❌

async function loadImage(): Promise<string> {
  // Sempre aguarda CDN específico
  const response = await fetch('https://cdn1.example.com/image.jpg');
  return response.url;
}

// Se CDN1 está lento - usuário espera
```

**Solução: Promise.race() usa fastest source**
```typescript
// Multiple CDNs - fastest vence ✅

async function loadImageOptimized(): Promise<string> {
  return Promise.race([
    fetch('https://cdn1.example.com/image.jpg').then(r => r.url),
    fetch('https://cdn2.example.com/image.jpg').then(r => r.url),
    fetch('https://cdn3.example.com/image.jpg').then(r => r.url)
  ]);
}

// Primeiro CDN disponível vence
// Otimização automática - melhor performance
```

**Problema 4: User Experience - Long Waits**
```typescript
// Sem feedback - usuário não sabe status ❌

async function search(query: string): Promise<Results> {
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  return results;
}

// Usuário não sabe se está carregando ou travado
```

**Solução: Promise.race() partial results**
```typescript
// Show partial results rapidamente ✅

async function searchWithPartialResults(query: string): Promise<Results> {
  const fullSearch = fetch(`/api/search?q=${query}`).then(r => r.json());
  
  const partialSearch = new Promise<Results>(resolve => {
    setTimeout(() => {
      resolve({ items: [], partial: true });
    }, 500);
  });
  
  return Promise.race([
    fullSearch,
    partialSearch
  ]).then(results => {
    if (results.partial) {
      // Mostrar "loading" message
      console.log("Loading full results...");
    }
    return results;
  });
}

// Se full search < 500ms → mostra full
// Se full search > 500ms → mostra partial + loading
```

**Fundamento teórico:** Promise.race() implementa **speculative execution** - iniciar múltiplas operações especulativamente, usar primeira que completa.

### Importância no Ecossistema

Promise.race() é importante porque:

- **Timeouts:** Garantir bounded execution time
- **Fallbacks:** Múltiplas fontes redundantes
- **Performance:** Usar fastest source
- **User experience:** Feedback rápido
- **Reliability:** Redundância aumenta availability
- **Testing:** Simular timing scenarios
- **Load balancing:** Distribuir carga
- **Circuit breaker:** Fail-fast patterns

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **First wins:** Primeira a resolver/rejeitar vence
2. **Competitive:** Promises competem
3. **Timing-dependent:** Não determinístico
4. **Union type:** TypeScript infere union
5. **Others continue:** Restantes não cancelam

### Pilares Fundamentais

- **Input:** Array (iterable) de Promises
- **Output:** Promise com valor/erro da primeira
- **Non-deterministic:** Depende de timing
- **First settled:** Fulfilled ou rejected
- **Ignore others:** Resultados restantes descartados

### Visão Geral das Nuances

- **Empty array:** Promise.race([]) → pending forever
- **Single Promise:** race([p]) → retorna p
- **Rejection wins:** Primeira rejection também vence
- **No cancellation:** Promises continuam executando
- **Testing:** Útil para timing tests

## 🧠 Fundamentos Teóricos

### Basic Promise.race()

```typescript
// Basic race() - primeira vence

const slow = new Promise(resolve => setTimeout(() => resolve("Slow"), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve("Fast"), 500));

Promise.race([slow, fast]).then(result => {
  console.log(result);  // "Fast" - primeira a resolver
});
```

**Basic:** Primeira a completar vence.

### Princípios e Conceitos Subjacentes

#### Timeout Pattern

```typescript
// Timeout pattern - use case mais comum

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  
  return Promise.race([promise, timeout]);
}

// Usar
withTimeout(fetch('/api/data'), 5000)
  .then(response => console.log("Success"))
  .catch(error => console.error("Failed or timeout"));
```

**Timeout:** Garantir bounded time.

#### Rejection Wins Too

```typescript
// Primeira rejection também vence

const p1 = new Promise((_, reject) => 
  setTimeout(() => reject(new Error("Failed")), 100)
);

const p2 = new Promise(resolve => 
  setTimeout(() => resolve("Success"), 200)
);

Promise.race([p1, p2])
  .catch(error => {
    console.error("Error:", error.message);  // "Failed"
  });

// p1 rejeita em 100ms → race() rejeita
// Não aguarda p2 (200ms)
```

**Rejection:** Primeira rejection vence.

### Type Inference - Union Types

```typescript
// TypeScript - union types

interface User { id: number; name: string; }
interface Post { id: number; title: string; }

Promise.race([
  Promise.resolve<User>({ id: 1, name: "Alice" }),
  Promise.resolve<Post>({ id: 1, title: "Post" })
]).then(result => {
  // result: User | Post (union type)
  
  if ('name' in result) {
    console.log("User:", result.name);
  } else {
    console.log("Post:", result.title);
  }
});
```

**Types:** Union de tipos possíveis.

#### Multiple Fallback Sources

```typescript
// Fallback pattern - múltiplas fontes

async function getDataReliable(): Promise<Data> {
  return Promise.race([
    fetch('/primary-api').then(r => r.json()),
    fetch('/backup-api-1').then(r => r.json()),
    fetch('/backup-api-2').then(r => r.json()),
    getFromCache()
  ]).catch(error => {
    // Todas falharam
    console.error("All sources failed");
    throw error;
  });
}

// Primeira fonte disponível vence
// Maximiza availability
```

**Fallback:** Redundância automática.

### Performance - Fastest Source

```typescript
// Performance optimization - fastest CDN

function loadResourceFast(path: string): Promise<Response> {
  const cdns = [
    'https://cdn1.example.com',
    'https://cdn2.example.com',
    'https://cdn3.example.com',
    'https://cdn4.example.com'
  ];
  
  const promises = cdns.map(cdn => fetch(`${cdn}${path}`));
  
  return Promise.race(promises);
}

// Primeiro CDN disponível vence
// Otimização automática de performance
```

**Performance:** Fastest source wins.

#### Empty Array - Pending Forever

```typescript
// Edge case - empty array ⚠️

const emptyRace = Promise.race([]);

// emptyRace fica pending PARA SEMPRE
// Nunca resolve nem rejeita

// Evitar - sempre verificar array não vazio
function safeRace<T>(promises: Promise<T>[]): Promise<T> {
  if (promises.length === 0) {
    return Promise.reject(new Error("No promises to race"));
  }
  return Promise.race(promises);
}
```

**Edge Case:** Empty array pending forever.

### Real-World Example - Image Loading

```typescript
// Image loading com timeout e fallback

async function loadImageOptimized(
  imageName: string,
  timeoutMs: number = 3000
): Promise<string> {
  // Timeout promise
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Image load timeout")), timeoutMs);
  });
  
  // Multiple sources
  const sources = [
    fetch(`https://cdn1.example.com/images/${imageName}`),
    fetch(`https://cdn2.example.com/images/${imageName}`),
    fetch(`https://cache.example.com/images/${imageName}`)
  ];
  
  try {
    const response = await Promise.race([...sources, timeout]);
    
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    throw new Error("Failed to load image");
  } catch (error) {
    console.error("Image load failed:", error);
    return '/images/placeholder.jpg';  // Fallback
  }
}

// Usar
loadImageOptimized('profile.jpg')
  .then(url => {
    document.querySelector('img')!.src = url;
  });
```

**Real-World:** Image loading optimization.

#### Modelo Mental para Compreensão

Pense em Promise.race() como **100m sprint**:

**Runners:** Promises individuais
**Race start:** Todas iniciam simultaneamente
**First finish:** Primeira a cruzar linha vence
**Others finish:** Continuam mas ignoradas
**Disqualification:** Rejection também vence (DNF)

**Analogia - Fast Food Drive-Thru:**

**Multiple lanes:** Múltiplas Promises
**First available:** Primeira janela livre atende
**Queue position:** Não importa ordem
**Service time:** Timing determina vencedor

**Metáfora - Server Ping:**

**Ping multiple servers:** Múltiplas fontes
**Fastest response:** Lowest latency vence
**Others respond:** Continuam mas descartadas
**Use fastest:** Otimização automática

**Fluxo visual:**
```
Promise.race([p1, p2, p3])
         ↓
    p1   p2   p3  ← Iniciam simultaneamente
    ↓    ↓    ↓
   2s   0.5s  1s  ← Executam em paralelo
         ↓
    p2 completa primeiro (0.5s)
         ↓
    Return p2 result
         ↓
    p1, p3 continuam mas ignoradas
```

## 🔍 Análise Conceitual Profunda

### Race with Different Types

```typescript
// Race com tipos diferentes - union type

type DataSource = 
  | { type: 'cache'; data: string; }
  | { type: 'api'; data: string; latency: number; }
  | { type: 'fallback'; data: string; };

function getData(): Promise<DataSource> {
  const cache = Promise.resolve<DataSource>({
    type: 'cache',
    data: 'cached-data'
  });
  
  const api = fetch('/api/data')
    .then(r => r.json())
    .then(data => ({
      type: 'api' as const,
      data,
      latency: 100
    }));
  
  const fallback = new Promise<DataSource>(resolve => {
    setTimeout(() => resolve({
      type: 'fallback',
      data: 'fallback-data'
    }), 5000);
  });
  
  return Promise.race([cache, api, fallback]);
}

// Usar
getData().then(result => {
  switch (result.type) {
    case 'cache':
      console.log("From cache:", result.data);
      break;
    case 'api':
      console.log("From API (latency:", result.latency, "ms)");
      break;
    case 'fallback':
      console.log("From fallback:", result.data);
      break;
  }
});
```

**Union Types:** Type discrimination.

### Retry with Timeout

```typescript
// Retry pattern com timeout

async function fetchWithRetry(
  url: string,
  retries: number = 3,
  timeoutMs: number = 5000
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), timeoutMs);
      });
      
      const response = await Promise.race([
        fetch(url),
        timeout
      ]);
      
      if (response.ok) {
        return response;
      }
      
      console.log(`Attempt ${attempt} failed with status ${response.status}`);
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        throw error;  // Last attempt - throw
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error("All retries failed");
}

// Usar
fetchWithRetry('/api/data')
  .then(response => console.log("Success"))
  .catch(error => console.error("Failed after retries"));
```

**Retry:** Combining race + retry logic.

#### Promise.race() vs Promise.any()

```typescript
// race() aceita rejection - any() ignora rejections

const p1 = Promise.reject(new Error("Error 1"));
const p2 = new Promise(resolve => setTimeout(() => resolve("Success"), 1000));

// race() - primeira rejection vence
Promise.race([p1, p2])
  .catch(error => {
    console.error("race() error:", error.message);  // "Error 1" (imediato)
  });

// any() - ignora rejections
Promise.any([p1, p2])
  .then(result => {
    console.log("any() success:", result);  // "Success" (após 1s)
  });

// race() = primeiro settled (fulfilled ou rejected)
// any() = primeiro fulfilled (ignora rejections)
```

**race vs any:** Rejection handling.

### Load Balancing Pattern

```typescript
// Load balancing - distribuir entre servers

class LoadBalancer {
  private servers = [
    'https://server1.example.com',
    'https://server2.example.com',
    'https://server3.example.com'
  ];
  
  async request(endpoint: string): Promise<any> {
    const promises = this.servers.map(server => 
      fetch(`${server}${endpoint}`).then(r => r.json())
    );
    
    try {
      return await Promise.race(promises);
    } catch (error) {
      // Se primeira falha, tentar outras
      console.error("Fastest server failed, trying others");
      
      // Fallback - aguardar qualquer sucesso
      return Promise.any(promises);
    }
  }
}

// Usar
const lb = new LoadBalancer();
lb.request('/api/data').then(data => console.log(data));
```

**Load Balancing:** Optimize server selection.

## 🎯 Aplicabilidade e Contextos

### API Timeouts

```typescript
withTimeout(fetch('/api/data'), 5000)
  .then(response => response.json())
  .catch(error => console.error(error));
```

**Raciocínio:** Bounded execution time.

### Redundant Sources

```typescript
Promise.race([
  fetch('/primary-cdn/image.jpg'),
  fetch('/backup-cdn/image.jpg')
]).then(response => displayImage(response));
```

**Raciocínio:** Availability optimization.

### User Feedback

```typescript
Promise.race([
  loadData(),
  delay(500).then(() => showLoading())
]).then(result => handleResult(result));
```

**Raciocínio:** Quick user feedback.

## ⚠️ Limitações e Considerações Teóricas

### No Cancellation

```typescript
// Promises perdedoras continuam executando

const slow = expensiveOperation();  // Operação cara
const fast = Promise.resolve("Fast");

Promise.race([slow, fast]).then(result => {
  console.log(result);  // "Fast"
});

// slow CONTINUA executando
// Desperdiça recursos - não há cancellation
```

**Limitação:** Operações continuam.

### Empty Array Forever Pending

```typescript
// Empty array - pending para sempre ⚠️

const race = Promise.race([]);

race.then(() => console.log("Never"));  // Nunca executa

// Sempre validar array não vazio
```

**Limitação:** Validar array.

### Memory Leaks Potential

```typescript
// Promises perdedoras retêm memória

const largeData = new Array(1000000).fill("data");

Promise.race([
  Promise.resolve("Fast"),
  processLargeData(largeData)  // Continua, retém memória
]);

// processLargeData continua
// largeData não pode ser garbage collected
```

**Consideração:** Memory com operações longas.

## 🔗 Interconexões Conceituais

**Relação com Promise.all():** All vs first.

**Relação com Promise.any():** Rejection handling.

**Relação com Timeouts:** Bounded execution.

**Relação com Fallbacks:** Redundancy.

**Relação com Performance:** Optimization.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise.race() prepara para:
- **Promise.any():** First fulfilled (ignore rejections)
- **Promise.allSettled():** All results
- **AbortController:** Cancellation
- **Timeout patterns:** Advanced timing
- **Circuit breakers:** Fail-fast systems
- **Load balancing:** Distributed systems
