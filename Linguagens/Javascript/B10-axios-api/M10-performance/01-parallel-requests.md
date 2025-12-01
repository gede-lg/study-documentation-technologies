# 🎯 Introdução

Parallel requests representam técnica fundamental de performance optimization em aplicações web: executar múltiplas requisições HTTP simultaneamente em vez de sequencialmente, reduzindo drasticamente tempo total de carregamento. Esta técnica é especialmente poderosa quando aplicação precisa buscar dados de múltiplas sources independentes: perfil de usuário, lista de posts, notificações, configurações - requests que não dependem uns dos outros e podem ser executados concorrentemente.

O problema que parallel requests resolvem é **latency acumulada de sequential requests**: se cada request leva 200ms e você precisa fazer 5 requests, execução sequencial leva 1000ms (1 segundo). Com parallel execution, assumindo que servidor suporta concorrência, tempo total é aproximadamente igual ao request mais lento (~200ms), resultando em speedup de 5x. Esta diferença é perceptível para usuários e crítica para user experience.

JavaScript fornece `Promise.all()` como primitiva para paralelização: aceita array de Promises e retorna Promise que resolve quando todas as Promises do array completam, ou rejeita se qualquer uma falhar. No contexto Axios, cada `axios.get()`, `axios.post()`, etc. retorna Promise, tornando-se perfeito para `Promise.all()`. Pattern típico é criar array de request Promises, passar para `Promise.all()`, e destructure results quando todas completarem.

Entretanto, parallel requests têm nuances críticas: `Promise.all()` é **fail-fast** (rejeita se qualquer Promise falhar, cancelando outras), podendo ser inadequado se você quer resultados parciais; browsers limitam concurrent connections por hostname (~6 connections), então paralelizar 100 requests não resulta em 100x speedup; e alguns servers implementam rate limiting que pode rejeitar requests excessivamente paralelos. Implementações robustas devem considerar `Promise.allSettled()` para resultados parciais, throttling de concorrência, e error handling granular.

Este módulo explora parallel requests com Axios em profundidade: desde fundamentos de Promise.all e concurrency model do JavaScript, através de patterns práticos de data fetching paralelo, até techniques avançadas de error handling com Promise.allSettled, concurrency limiting, e integration com loading states em UI frameworks. Objetivo é capacitar você a maximizar performance via paralelização consciente e controlada.

---

# 📋 Sumário

### **Fundamentos de Parallel Requests**
- Problema resolvido por paralelização
- Sequential vs parallel execution
- Promise.all() API
- Browser concurrency limits

### **Basic Parallel Requests com Promise.all**
- Múltiplos GET requests
- Destructuring results
- Error handling (fail-fast)
- Timing comparison

### **Promise.allSettled()**
- Diferença vs Promise.all
- Resultados parciais
- Status: fulfilled vs rejected
- Use cases

### **Parallel POST/PUT Requests**
- Batch creation
- Simultaneous updates
- Transaction considerations

### **Mixed Request Types**
- GET + POST + PUT simultâneos
- Dependency handling
- Conditional parallelization

### **Error Handling Patterns**
- Try-catch com Promise.all
- Individual error handling
- Retry failed requests
- Fallback strategies

### **Performance Considerations**
- Browser connection limits
- Server-side concurrency
- Rate limiting
- Memory usage

### **Advanced Patterns**
- Concurrency limiting (p-limit)
- Priority-based execution
- Progressive loading
- Race conditions prevention

---

# 🧠 Fundamentos

## Problema Resolvido por Paralelização

**Sequential Execution** (waterfall):

```javascript
// ❌ Lento: 600ms total (200ms cada)
const user = await axios.get('/api/user');        // 200ms
const posts = await axios.get('/api/posts');      // 200ms
const comments = await axios.get('/api/comments'); // 200ms

// Total: 600ms
```

**Parallel Execution**:

```javascript
// ✅ Rápido: ~200ms total (simultâneo)
const [user, posts, comments] = await Promise.all([
  axios.get('/api/user'),        // 200ms
  axios.get('/api/posts'),       // 200ms
  axios.get('/api/comments')     // 200ms
]);

// Total: ~200ms (tempo do request mais lento)
```

**Speedup**: 600ms → 200ms = **3x faster**

## Sequential vs Parallel Execution

**Sequential**:
```
Request 1: |████████| 200ms
Request 2:          |████████| 200ms
Request 3:                   |████████| 200ms
Total:     |████████████████████████| 600ms
```

**Parallel**:
```
Request 1: |████████| 200ms
Request 2: |████████| 200ms
Request 3: |████████| 200ms
Total:     |████████| 200ms
```

## Promise.all() API

**Syntax**:
```javascript
Promise.all(iterable)
```

**Parameters**:
- `iterable`: Array (ou iterable) de Promises

**Return**:
- Promise que resolve com array de resultados (mesma ordem)
- Ou rejeita com erro da primeira Promise que falhar

**Exemplo**:
```javascript
const promise1 = Promise.resolve(10);
const promise2 = Promise.resolve(20);
const promise3 = Promise.resolve(30);

const results = await Promise.all([promise1, promise2, promise3]);
console.log(results); // [10, 20, 30]
```

**Fail-Fast Behavior**:
```javascript
const promise1 = Promise.resolve(10);
const promise2 = Promise.reject(new Error('Failed'));
const promise3 = Promise.resolve(30);

try {
  await Promise.all([promise1, promise2, promise3]);
} catch (error) {
  console.error(error); // Error: Failed
  // promise1 e promise3 ainda executam, mas results são descartados
}
```

## Browser Concurrency Limits

Browsers limitam **concurrent HTTP connections por hostname**:

- HTTP/1.1: ~6 connections simultâneas
- HTTP/2: Multiplexing permite muito mais (100+)

**Implicação**:
```javascript
// 100 requests paralelos
const requests = Array.from({ length: 100 }, (_, i) => 
  axios.get(`/api/item/${i}`)
);

await Promise.all(requests);
// Browsers farão ~6 requests por vez (HTTP/1.1)
// Não executa todos 100 simultaneamente
```

**HTTP/2**: Se servidor suporta HTTP/2, multiplexing permite requests verdadeiramente paralelos.

---

# 🔍 Análise

## Basic Parallel Requests com Promise.all

### **Múltiplos GET Requests**

```javascript
import axios from 'axios';

async function loadDashboardData() {
  const [userResponse, postsResponse, notificationsResponse] = await Promise.all([
    axios.get('/api/user'),
    axios.get('/api/posts'),
    axios.get('/api/notifications')
  ]);
  
  return {
    user: userResponse.data,
    posts: postsResponse.data,
    notifications: notificationsResponse.data
  };
}

const data = await loadDashboardData();
console.log(data.user);
console.log(data.posts);
console.log(data.notifications);
```

### **Destructuring Results**

```javascript
// Opção 1: Destructuring de responses
const [userRes, postsRes, commentsRes] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
]);

const user = userRes.data;
const posts = postsRes.data;
const comments = commentsRes.data;
```

```javascript
// Opção 2: Extrair .data diretamente (com .then)
const [user, posts, comments] = await Promise.all([
  axios.get('/api/user').then(res => res.data),
  axios.get('/api/posts').then(res => res.data),
  axios.get('/api/comments').then(res => res.data)
]);

console.log(user);   // Diretamente os dados
console.log(posts);
console.log(comments);
```

### **Error Handling (Fail-Fast)**

```javascript
try {
  const [user, posts, comments] = await Promise.all([
    axios.get('/api/user'),        // ✅ Success
    axios.get('/api/posts'),       // ❌ 404 Error
    axios.get('/api/comments')     // ✅ Success (mas result descartado)
  ]);
  
  // Não chega aqui se qualquer request falhar
} catch (error) {
  console.error('One of the requests failed:', error);
  // Error do primeiro request que falhou (/api/posts)
}
```

**Problema**: Se um request falha, todos os results são descartados (mesmo os que sucederam).

### **Timing Comparison**

```javascript
// Sequential
console.time('Sequential');
const user = await axios.get('/api/user');
const posts = await axios.get('/api/posts');
const comments = await axios.get('/api/comments');
console.timeEnd('Sequential');
// Sequential: 645ms

// Parallel
console.time('Parallel');
const [userP, postsP, commentsP] = await Promise.all([
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
]);
console.timeEnd('Parallel');
// Parallel: 223ms (3x faster!)
```

## Promise.allSettled()

**Promise.allSettled()**: Espera todas Promises completarem (success ou failure), retornando array de results com status.

### **API**

```javascript
const results = await Promise.allSettled([
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
]);

// results é array de objetos:
// [
//   { status: 'fulfilled', value: Response },
//   { status: 'rejected', reason: Error },
//   { status: 'fulfilled', value: Response }
// ]
```

### **Handling Results**

```javascript
const results = await Promise.allSettled([
  axios.get('/api/user'),
  axios.get('/api/posts'),        // Falha
  axios.get('/api/comments')
]);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`Request ${index} succeeded:`, result.value.data);
  } else {
    console.error(`Request ${index} failed:`, result.reason.message);
  }
});
```

### **Extracting Successful Results**

```javascript
const promises = [
  axios.get('/api/user'),
  axios.get('/api/posts'),
  axios.get('/api/comments')
];

const results = await Promise.allSettled(promises);

const successfulData = results
  .filter(result => result.status === 'fulfilled')
  .map(result => result.value.data);

console.log('Successful results:', successfulData);
// Apenas dados dos requests que sucederam
```

### **Use Cases**

**Quando usar Promise.allSettled()**:
- Quer resultados parciais (alguns requests podem falhar)
- Loading de dados de múltiplas sources independentes
- Batch operations onde failures são aceitáveis

**Quando usar Promise.all()**:
- Todos requests são críticos (fail-fast desejado)
- Dados interdependentes

## Parallel POST/PUT Requests

### **Batch Creation**

```javascript
const newPosts = [
  { title: 'Post 1', content: 'Content 1' },
  { title: 'Post 2', content: 'Content 2' },
  { title: 'Post 3', content: 'Content 3' }
];

const createdPosts = await Promise.all(
  newPosts.map(post => 
    axios.post('/api/posts', post).then(res => res.data)
  )
);

console.log('Created posts:', createdPosts);
```

### **Simultaneous Updates**

```javascript
const updates = [
  { id: 1, status: 'published' },
  { id: 2, status: 'published' },
  { id: 3, status: 'published' }
];

await Promise.all(
  updates.map(update => 
    axios.put(`/api/posts/${update.id}`, { status: update.status })
  )
);

console.log('All posts updated');
```

### **Transaction Considerations**

⚠️ **Problema**: Parallel updates podem criar inconsistências se um falha.

**Exemplo**:
```javascript
try {
  await Promise.all([
    axios.post('/api/create-order', orderData),
    axios.post('/api/charge-payment', paymentData),
    axios.post('/api/update-inventory', inventoryData)
  ]);
} catch (error) {
  // Se payment falha, order pode já ter sido criado!
  // Necessário rollback manual ou transactions server-side
}
```

**Solução**: Para operações transacionais, preferir single request server-side que handle atomicidade.

## Mixed Request Types

```javascript
async function loadAndUpdate() {
  const [userData, updateResult, deleteResult] = await Promise.all([
    axios.get('/api/user/123'),              // GET
    axios.put('/api/settings', { theme: 'dark' }), // PUT
    axios.delete('/api/notifications/old')   // DELETE
  ]);
  
  return {
    user: userData.data,
    settingsUpdated: updateResult.data,
    notificationsDeleted: deleteResult.data
  };
}
```

### **Conditional Parallelization**

```javascript
async function loadData(userId, includeComments) {
  const promises = [
    axios.get(`/api/user/${userId}`),
    axios.get(`/api/posts?userId=${userId}`)
  ];
  
  if (includeComments) {
    promises.push(axios.get(`/api/comments?userId=${userId}`));
  }
  
  const results = await Promise.all(promises);
  
  return {
    user: results[0].data,
    posts: results[1].data,
    comments: includeComments ? results[2].data : null
  };
}
```

## Error Handling Patterns

### **Try-Catch com Promise.all**

```javascript
try {
  const [user, posts, comments] = await Promise.all([
    axios.get('/api/user'),
    axios.get('/api/posts'),
    axios.get('/api/comments')
  ]);
  
  // Success
  displayData({ user: user.data, posts: posts.data, comments: comments.data });
} catch (error) {
  // Qualquer request falhou
  showError('Failed to load data');
  console.error(error);
}
```

### **Individual Error Handling**

```javascript
const [userResult, postsResult, commentsResult] = await Promise.all([
  axios.get('/api/user').catch(err => ({ error: err })),
  axios.get('/api/posts').catch(err => ({ error: err })),
  axios.get('/api/comments').catch(err => ({ error: err }))
]);

// Check individual results
if (userResult.error) {
  console.error('User fetch failed:', userResult.error);
} else {
  console.log('User:', userResult.data);
}

if (postsResult.error) {
  console.error('Posts fetch failed:', postsResult.error);
} else {
  console.log('Posts:', postsResult.data);
}
```

### **Retry Failed Requests**

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

const [user, posts, comments] = await Promise.all([
  fetchWithRetry('/api/user'),
  fetchWithRetry('/api/posts'),
  fetchWithRetry('/api/comments')
]);
```

### **Fallback Strategies**

```javascript
async function loadDataWithFallbacks() {
  const results = await Promise.allSettled([
    axios.get('/api/user'),
    axios.get('/api/posts'),
    axios.get('/api/comments')
  ]);
  
  return {
    user: results[0].status === 'fulfilled' 
      ? results[0].value.data 
      : { name: 'Guest' }, // Fallback
    
    posts: results[1].status === 'fulfilled' 
      ? results[1].value.data 
      : [], // Empty array fallback
    
    comments: results[2].status === 'fulfilled' 
      ? results[2].value.data 
      : []
  };
}
```

## Performance Considerations

### **Browser Connection Limits**

```javascript
// ❌ 100 requests simultâneos (browsers limitam a ~6)
const requests = Array.from({ length: 100 }, (_, i) => 
  axios.get(`/api/item/${i}`)
);

await Promise.all(requests);
// Apenas ~6 executam simultaneamente (HTTP/1.1)
// Outros ficam enfileirados
```

**Solution**: Concurrency limiting (próximo tópico).

### **Server-Side Concurrency**

Server pode ter limites de concurrent connections:

```javascript
// Servidor pode rejeitar se receber muitos requests simultâneos
// Considerar batching ou throttling
```

### **Rate Limiting**

```javascript
// API pode ter rate limit (ex: 100 requests/minute)
// 50 requests simultâneos podem exceder limit

// Solution: Throttle ou batch requests
```

### **Memory Usage**

```javascript
// Múltiplos large responses simultaneamente consomem muita memória
const largeDataRequests = Array.from({ length: 50 }, (_, i) => 
  axios.get(`/api/large-dataset/${i}`, { responseType: 'blob' })
);

// Pode causar memory issues
await Promise.all(largeDataRequests);

// Solution: Process em batches
```

## Advanced Patterns

### **Concurrency Limiting**

Limitar número de requests simultâneos:

```javascript
async function limitConcurrency(tasks, limit) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = task().then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Uso
const tasks = Array.from({ length: 100 }, (_, i) => 
  () => axios.get(`/api/item/${i}`)
);

const results = await limitConcurrency(tasks, 5); // Max 5 concurrent
```

**Com p-limit library**:

```javascript
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent

const promises = Array.from({ length: 100 }, (_, i) => 
  limit(() => axios.get(`/api/item/${i}`))
);

const results = await Promise.all(promises);
```

### **Priority-Based Execution**

```javascript
async function priorityFetch(priorityUrls, normalUrls) {
  // Fetch priority requests first
  const priorityResults = await Promise.all(
    priorityUrls.map(url => axios.get(url))
  );
  
  // Then fetch normal requests
  const normalResults = await Promise.all(
    normalUrls.map(url => axios.get(url))
  );
  
  return {
    priority: priorityResults.map(res => res.data),
    normal: normalResults.map(res => res.data)
  };
}
```

### **Progressive Loading**

```javascript
async function progressiveLoad(urls, onBatch) {
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(url => axios.get(url).then(res => res.data))
    );
    
    results.push(...batchResults);
    onBatch(batchResults); // Update UI progressivamente
  }
  
  return results;
}

// Uso
await progressiveLoad(urls, (batch) => {
  console.log('Loaded batch:', batch);
  updateUI(batch);
});
```

### **Race Conditions Prevention**

```javascript
// ❌ Race condition: Múltiplos updates simultâneos
await Promise.all([
  axios.put('/api/counter/increment'),
  axios.put('/api/counter/increment'),
  axios.put('/api/counter/increment')
]);
// Counter pode não incrementar corretamente (race)

// ✅ Sequential para operations com race conditions
for (let i = 0; i < 3; i++) {
  await axios.put('/api/counter/increment');
}

// Ou usar server-side batching
await axios.put('/api/counter/increment', { count: 3 });
```

---

# 🎯 Aplicabilidade

## Quando Usar Parallel Requests

**Independent Data Fetching**: Dashboard loading (user, posts, notifications).

**Batch Operations**: Criar/atualizar múltiplos items.

**Multiple API Sources**: Agregação de dados de diferentes endpoints.

**Performance Critical**: Reduzir latency total.

## Quando Evitar

**Sequential Dependencies**: Request B depende de resultado de Request A.

**Transactional Operations**: Operações que devem ser atômicas.

**Rate-Limited APIs**: Pode exceder limits.

**Race Conditions**: Updates simultâneos do mesmo resource.

---

# ⚠️ Limitações

## Fail-Fast Behavior (Promise.all)

Se um request falha, todos results são descartados. Usar `Promise.allSettled()` para resultados parciais.

## Browser Concurrency Limits

HTTP/1.1 limita a ~6 concurrent connections por hostname.

## Server Capacity

Server pode não suportar muitos concurrent requests.

## Memory Usage

Múltiplos large responses simultaneamente consomem memória.

---

# 🔗 Interconexões

## Builds on Promises

Promise.all é JavaScript primitive para paralelização.

## Complements Request Batching

Batching reduz número de requests; paralelização acelera múltiplos requests.

## Requires Error Handling

Parallel requests necessitam error handling robusto.

---

# 🚀 Evolução

## Promise.any()

Retorna primeiro Promise que resolve (race positivo).

## Top-Level Await

Permite await fora de async functions (modules).

## HTTP/3 (QUIC)

Multiplexing ainda mais eficiente que HTTP/2.

---

**Conclusão Integrada**: Parallel requests com Promise.all transformam performance através de concurrent execution, reduzindo latency de waterfall sequential para tempo do request mais lento. Axios retorna Promises, integrando perfeitamente com Promise.all. Promise.allSettled permite resultados parciais quando alguns requests falham. Advanced patterns incluem concurrency limiting para respeitar browser/server constraints, progressive loading para UI responsiva, e error handling granular. Paralelização consciente é ferramenta essencial para maximizar performance em aplicações data-intensive.