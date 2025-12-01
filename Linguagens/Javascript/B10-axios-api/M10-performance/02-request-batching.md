# 🎯 Introdução

Request batching representa estratégia complementar a parallel requests: em vez de executar múltiplos requests independentes simultaneamente, **agregar múltiplas operations em single request** para reduzir overhead HTTP e network round-trips. Esta técnica é especialmente valiosa quando aplicação precisa executar muitas operations similares: buscar dados de 50 users, atualizar status de 20 items, deletar 100 records - operações que individualmente gerariam dezenas ou centenas de HTTP requests.

O problema que request batching resolve é **overhead de múltiplos HTTP requests**: cada HTTP request tem custos fixos (TCP handshake, TLS negotiation, HTTP headers, latency de round-trip) que são independentes de payload size. Fazer 100 requests pequenos pode ser mais lento que 1 request grande devido a overhead acumulado. Batching reduz número de round-trips de 100 para 1, eliminando 99x de overhead, resultando em performance gains significativos.

Implementação de batching requer cooperation entre client e server: client deve **buffer requests** e agregá-los em batch, enquanto server deve expor **batch endpoints** que aceitam arrays de operations e retornam arrays de results. REST APIs tradicionalmente não suportam batching (cada endpoint opera em single resource), mas patterns como GraphQL queries, JSON-RPC batch requests, e custom batch endpoints permitem batching efetivo.

Entretanto, batching introduz trade-offs: **latency de buffering** (esperar acumular requests antes de enviar batch), **atomic failure** (se batch request falha, todas operations falham), e **complexity de error handling** (parsear quais operations em batch sucederam/falharam). Implementations devem balancear tamanho de batch (maior = mais eficiente, mas maior latency) com responsiveness, e implementar partial success handling para robustez.

Este módulo explora request batching em profundidade: desde conceitos fundamentais de agregação e batch endpoints, através de implementações práticas com Axios (batch GETs, POSTs, custom batch APIs), até patterns avançados de auto-batching (debouncing automático), partial failure handling, e integration com GraphQL e JSON-RPC. Objetivo é equipar você para implementar batching strategies que otimizam network efficiency sem sacrificar user experience.

---

# 📋 Sumário

### **Fundamentos de Request Batching**
- Problema resolvido por batching
- Overhead de múltiplos requests
- Batch vs parallel requests
- Trade-offs de batching

### **Batch Endpoints**
- Design de batch APIs
- Request format (array de operations)
- Response format (array de results)
- Partial success handling

### **Batch GET Requests**
- Fetching múltiplos resources
- Query string arrays
- POST com IDs (workaround GET limits)
- Pagination em batches

### **Batch POST/PUT/DELETE**
- Batch creation
- Batch updates
- Batch deletion
- Transaction semantics

### **Auto-Batching Pattern**
- Request buffering
- Debouncing
- Automatic flush
- Window-based batching

### **Error Handling**
- Atomic failures
- Partial success
- Mapping errors to operations
- Retry strategies

### **GraphQL Batching**
- GraphQL queries como batching natural
- Aliases para múltiplos queries
- DataLoader pattern

### **Best Practices**
- Batch size optimization
- Timeout configuration
- Monitoring batch efficiency
- Fallback to individual requests

---

# 🧠 Fundamentos

## Problema Resolvido por Batching

**Scenario**: Buscar dados de 50 users.

**Individual Requests** (❌):
```javascript
// 50 requests HTTP
for (let i = 1; i <= 50; i++) {
  await axios.get(`/api/users/${i}`);
}
// Total: ~50 * 100ms = 5000ms (overhead acumulado)
```

**Parallel Requests** (⚡ melhor):
```javascript
// 50 requests simultâneos
const requests = Array.from({ length: 50 }, (_, i) => 
  axios.get(`/api/users/${i + 1}`)
);
await Promise.all(requests);
// Total: ~100ms (paralelo) + browser/server limits
```

**Batch Request** (✅ ideal):
```javascript
// 1 request com 50 IDs
const response = await axios.post('/api/users/batch', {
  ids: [1, 2, 3, ..., 50]
});
// Total: ~100ms (single round-trip)
```

**Comparison**:
- Individual: 5000ms
- Parallel: ~100ms (mas 50 requests)
- Batch: ~100ms (1 request)

## Overhead de Múltiplos Requests

**Overhead per Request**:
- TCP handshake: ~1 RTT (round-trip time)
- TLS negotiation: ~2 RTTs
- HTTP headers: ~1KB (request + response)
- Latency: 50-200ms dependendo de network

**Example**:
- 100 requests pequenos (1KB payload cada)
- Overhead headers: 100KB
- Payload total: 100KB
- **Total transferido: 200KB** (50% é overhead!)

**Batch**:
- 1 request com 100 items (100KB payload)
- Overhead headers: 1KB
- **Total transferido: 101KB** (1% overhead)

## Batch vs Parallel Requests

| Aspecto | Parallel Requests | Batch Request |
|---------|------------------|---------------|
| **Número de requests** | Múltiplos | Single |
| **Overhead HTTP** | Alto (N requests) | Baixo (1 request) |
| **Browser limits** | Sim (~6 concurrent) | Não |
| **Server load** | N connections | 1 connection |
| **Latency** | 1 RTT (se paralelo) | 1 RTT |
| **Error handling** | Individual | Agregado |
| **Server support** | Padrão REST | Requer batch endpoint |

**Quando usar cada**:
- **Parallel**: Requests independentes de diferentes endpoints
- **Batch**: Múltiplas operations no mesmo endpoint/resource type

## Trade-offs de Batching

**Vantagens**:
- ✅ Reduz overhead HTTP
- ✅ Menos network round-trips
- ✅ Menor carga no servidor (1 connection vs N)
- ✅ Bypassa browser connection limits

**Desvantagens**:
- ❌ Latency de buffering (esperar acumular batch)
- ❌ Requer server support (batch endpoints)
- ❌ Error handling mais complexo
- ❌ Atomic failure (all-or-nothing em alguns casos)

---

# 🔍 Análise

## Batch Endpoints

### **Design de Batch API**

**Request Format**:
```javascript
POST /api/users/batch
{
  "ids": [1, 2, 3, 4, 5]
}
```

**Response Format** (success):
```javascript
{
  "results": [
    { "id": 1, "name": "John", "email": "john@example.com" },
    { "id": 2, "name": "Jane", "email": "jane@example.com" },
    { "id": 3, "name": "Bob", "email": "bob@example.com" },
    { "id": 4, "name": "Alice", "email": "alice@example.com" },
    { "id": 5, "name": "Charlie", "email": "charlie@example.com" }
  ]
}
```

**Response Format** (partial success):
```javascript
{
  "results": [
    { "id": 1, "status": "success", "data": { "name": "John", ... } },
    { "id": 2, "status": "success", "data": { "name": "Jane", ... } },
    { "id": 3, "status": "error", "error": "User not found" },
    { "id": 4, "status": "success", "data": { "name": "Alice", ... } },
    { "id": 5, "status": "error", "error": "Access denied" }
  ]
}
```

### **Server Implementation Example** (Node.js/Express)

```javascript
app.post('/api/users/batch', async (req, res) => {
  const { ids } = req.body;
  
  const results = await Promise.allSettled(
    ids.map(id => User.findById(id))
  );
  
  const response = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        id: ids[index],
        status: 'success',
        data: result.value
      };
    } else {
      return {
        id: ids[index],
        status: 'error',
        error: result.reason.message
      };
    }
  });
  
  res.json({ results: response });
});
```

## Batch GET Requests

### **Query String Arrays**

```javascript
// GET com múltiplos IDs (se server suporta)
const response = await axios.get('/api/users', {
  params: {
    ids: [1, 2, 3, 4, 5]
  }
});

// Request URL: /api/users?ids[]=1&ids[]=2&ids[]=3&ids[]=4&ids[]=5
// Ou: /api/users?ids=1,2,3,4,5 (depende de server parsing)
```

**Server** (Express):
```javascript
app.get('/api/users', async (req, res) => {
  const ids = Array.isArray(req.query.ids) 
    ? req.query.ids 
    : req.query.ids.split(',');
  
  const users = await User.find({ id: { $in: ids } });
  res.json({ users });
});
```

### **POST com IDs (workaround GET limits)**

URLs têm limite de tamanho (~2KB em alguns browsers/servers). Para muitos IDs, usar POST:

```javascript
// POST em vez de GET para batch fetch
const response = await axios.post('/api/users/query', {
  ids: Array.from({ length: 100 }, (_, i) => i + 1)
});

const users = response.data.users;
```

### **Pagination em Batches**

```javascript
async function fetchAllUsersBatched(totalUsers, batchSize = 50) {
  const results = [];
  
  for (let offset = 0; offset < totalUsers; offset += batchSize) {
    const ids = Array.from(
      { length: Math.min(batchSize, totalUsers - offset) },
      (_, i) => offset + i + 1
    );
    
    const response = await axios.post('/api/users/batch', { ids });
    results.push(...response.data.results);
  }
  
  return results;
}

const allUsers = await fetchAllUsersBatched(500, 50); // 10 batches of 50
```

## Batch POST/PUT/DELETE

### **Batch Creation**

```javascript
const newUsers = [
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: 'jane@example.com' },
  { name: 'Bob', email: 'bob@example.com' }
];

const response = await axios.post('/api/users/batch-create', {
  users: newUsers
});

const createdUsers = response.data.results;
// [
//   { id: 101, name: 'John', ... },
//   { id: 102, name: 'Jane', ... },
//   { id: 103, name: 'Bob', ... }
// ]
```

### **Batch Updates**

```javascript
const updates = [
  { id: 1, status: 'active' },
  { id: 2, status: 'inactive' },
  { id: 3, status: 'active' }
];

const response = await axios.put('/api/users/batch-update', {
  updates
});

console.log(response.data.updated); // 3
```

### **Batch Deletion**

```javascript
const idsToDelete = [10, 20, 30, 40, 50];

const response = await axios.delete('/api/users/batch', {
  data: { ids: idsToDelete }
});

console.log(response.data.deleted); // 5
```

### **Transaction Semantics**

**All-or-Nothing** (atomic):
```javascript
// Server garante: todos sucesso ou todos falham
try {
  await axios.post('/api/orders/batch-create', { orders });
  // Todos orders criados
} catch (error) {
  // Nenhum order criado (rollback)
}
```

**Partial Success**:
```javascript
const response = await axios.post('/api/users/batch-update', { updates });

const successful = response.data.results.filter(r => r.status === 'success');
const failed = response.data.results.filter(r => r.status === 'error');

console.log(`${successful.length} updated, ${failed.length} failed`);
```

## Auto-Batching Pattern

### **Request Buffering**

Automatically batch requests que ocorrem em curto intervalo:

```javascript
class BatchQueue {
  constructor(batchFn, options = {}) {
    this.batchFn = batchFn;
    this.maxBatchSize = options.maxBatchSize || 50;
    this.maxWaitTime = options.maxWaitTime || 10; // ms
    
    this.queue = [];
    this.timer = null;
  }
  
  add(item) {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      
      // Auto-flush se batch está cheio
      if (this.queue.length >= this.maxBatchSize) {
        this.flush();
      } else {
        // Schedule flush após maxWaitTime
        if (!this.timer) {
          this.timer = setTimeout(() => this.flush(), this.maxWaitTime);
        }
      }
    });
  }
  
  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.maxBatchSize);
    const items = batch.map(b => b.item);
    
    try {
      const results = await this.batchFn(items);
      
      batch.forEach((b, index) => {
        b.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(b => {
        b.reject(error);
      });
    }
  }
}

// Uso
const userBatcher = new BatchQueue(async (userIds) => {
  const response = await axios.post('/api/users/batch', { ids: userIds });
  return response.data.results;
}, { maxBatchSize: 50, maxWaitTime: 10 });

// Múltiplas calls são automaticamente batched
const user1Promise = userBatcher.add(1);
const user2Promise = userBatcher.add(2);
const user3Promise = userBatcher.add(3);

const [user1, user2, user3] = await Promise.all([
  user1Promise, 
  user2Promise, 
  user3Promise
]);
// Single batch request com IDs [1, 2, 3]
```

### **DataLoader Pattern** (Facebook)

```javascript
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (userIds) => {
  const response = await axios.post('/api/users/batch', { 
    ids: userIds 
  });
  
  // DataLoader expects results in same order as input
  const userMap = new Map(response.data.results.map(u => [u.id, u]));
  return userIds.map(id => userMap.get(id) || new Error('Not found'));
});

// Uso
const user1 = await userLoader.load(1);
const user2 = await userLoader.load(2);
const user3 = await userLoader.load(3);

// DataLoader automatically batches + caches
```

## Error Handling

### **Atomic Failures**

```javascript
try {
  await axios.post('/api/orders/batch-create', { orders });
  console.log('All orders created');
} catch (error) {
  if (error.response?.status === 400) {
    console.error('Batch validation failed:', error.response.data.errors);
    // None created
  } else if (error.response?.status === 500) {
    console.error('Server error - transaction rolled back');
    // None created
  }
}
```

### **Partial Success**

```javascript
const response = await axios.post('/api/users/batch-create', { users });

response.data.results.forEach((result, index) => {
  if (result.status === 'success') {
    console.log(`User ${index} created:`, result.data);
  } else {
    console.error(`User ${index} failed:`, result.error);
  }
});

const successCount = response.data.results.filter(r => r.status === 'success').length;
console.log(`${successCount}/${users.length} users created`);
```

### **Mapping Errors to Operations**

```javascript
const operations = [
  { type: 'create', data: { name: 'John' } },
  { type: 'update', id: 5, data: { status: 'active' } },
  { type: 'delete', id: 10 }
];

const response = await axios.post('/api/batch', { operations });

response.data.results.forEach((result, index) => {
  const operation = operations[index];
  
  if (result.status === 'error') {
    console.error(`${operation.type} failed:`, result.error);
  }
});
```

### **Retry Strategies**

```javascript
async function batchWithRetry(items, maxRetries = 3) {
  let attempt = 0;
  let failedItems = items;
  const successResults = [];
  
  while (attempt < maxRetries && failedItems.length > 0) {
    const response = await axios.post('/api/batch', { items: failedItems });
    
    const successful = response.data.results.filter(r => r.status === 'success');
    const failed = response.data.results.filter(r => r.status === 'error');
    
    successResults.push(...successful);
    
    failedItems = failed.map((f, index) => failedItems[index]);
    attempt++;
    
    if (failedItems.length > 0 && attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  return {
    successful: successResults,
    failed: failedItems
  };
}
```

## GraphQL Batching

GraphQL permite múltiplos queries em single request:

```javascript
const query = `
  query {
    user1: user(id: 1) { name email }
    user2: user(id: 2) { name email }
    user3: user(id: 3) { name email }
    posts: posts(limit: 10) { title }
  }
`;

const response = await axios.post('/graphql', { query });

console.log(response.data.data.user1);
console.log(response.data.data.user2);
console.log(response.data.data.user3);
console.log(response.data.data.posts);
```

**DataLoader com GraphQL**:

```javascript
const userLoader = new DataLoader(async (userIds) => {
  const query = `
    query GetUsers($ids: [ID!]!) {
      users(ids: $ids) { id name email }
    }
  `;
  
  const response = await axios.post('/graphql', { 
    query, 
    variables: { ids: userIds } 
  });
  
  const userMap = new Map(response.data.data.users.map(u => [u.id, u]));
  return userIds.map(id => userMap.get(id));
});
```

## Best Practices

### **1. Batch Size Optimization**

```javascript
// ❌ Batch muito pequeno (overhead de múltiplos batches)
const batchSize = 5;

// ❌ Batch muito grande (latency, timeout)
const batchSize = 10000;

// ✅ Balanceado (50-200 típico)
const batchSize = 100;
```

**Tuning**:
- Testar com dados reais
- Considerar payload size
- Considerar server capacity
- Monitorar timeout rates

### **2. Timeout Configuration**

```javascript
// Batch requests podem demorar mais
const response = await axios.post('/api/batch', { items }, {
  timeout: 30000 // 30 segundos (vs 5s default)
});
```

### **3. Monitoring**

```javascript
async function batchRequest(items) {
  const startTime = Date.now();
  
  const response = await axios.post('/api/batch', { items });
  
  const duration = Date.now() - startTime;
  const itemsPerSecond = items.length / (duration / 1000);
  
  console.log(`Batched ${items.length} items in ${duration}ms`);
  console.log(`Throughput: ${itemsPerSecond.toFixed(2)} items/sec`);
  
  // Send metrics
  sendMetric('batch_request_duration', duration);
  sendMetric('batch_request_size', items.length);
  
  return response.data;
}
```

### **4. Fallback to Individual Requests**

```javascript
async function fetchUsers(userIds) {
  if (userIds.length <= 5) {
    // Poucos IDs: individual requests (parallel)
    const results = await Promise.all(
      userIds.map(id => axios.get(`/api/users/${id}`))
    );
    return results.map(r => r.data);
  } else {
    // Muitos IDs: batch request
    const response = await axios.post('/api/users/batch', { ids: userIds });
    return response.data.results;
  }
}
```

---

# 🎯 Aplicabilidade

## Quando Usar Request Batching

**Múltiplas Operations Similares**: Fetching/updating/deleting múltiplos items.

**High Volume**: Operações com centenas ou milhares de items.

**Network Constrained**: Reduzir overhead HTTP em conexões lentas.

**Server Load Reduction**: Reduzir número de connections.

## Quando Evitar

**Real-Time Updates**: Latency de buffering inaceitável.

**Low Volume**: < 5 items (overhead de batching não compensa).

**No Server Support**: Server não expõe batch endpoints.

**Atomic Requirements**: Se partial success é inaceitável.

---

# ⚠️ Limitações

## Server Support Required

Batching requer que server implemente batch endpoints.

## Buffering Latency

Auto-batching adiciona delay (esperar acumular batch).

## Error Complexity

Partial success handling é mais complexo que all-or-nothing.

## Timeout Risks

Batches grandes podem exceder timeouts.

---

# 🔗 Interconexões

## Complements Parallel Requests

Batching reduz número de requests; parallelization acelera múltiplos requests independentes.

## Enables GraphQL Efficiency

GraphQL queries são forma natural de batching.

## Builds on Promise Patterns

Auto-batching usa Promises para coordinate async operations.

---

# 🚀 Evolução

## HTTP/2 Push

Server pode push múltiplos resources proactively.

## GraphQL Federation

Batch queries across multiple GraphQL services.

## gRPC Streaming

Bidirectional streaming como alternative a batching.

---

**Conclusão Integrada**: Request batching otimiza network efficiency agregando múltiplas operations em single HTTP request, eliminando overhead acumulado de headers e round-trips. Implementations requerem batch endpoints server-side e handling de partial success/failure client-side. Auto-batching patterns (DataLoader, custom queues) automatizam aggregation com debouncing. GraphQL fornece batching natural via aliased queries. Best practices incluem batch size optimization (50-200 típico), timeout tuning, monitoring de throughput, e fallback para individual requests quando apropriado. Batching é complementar a parallel requests: paralelização acelera múltiplos requests independentes, batching reduz número total de requests.