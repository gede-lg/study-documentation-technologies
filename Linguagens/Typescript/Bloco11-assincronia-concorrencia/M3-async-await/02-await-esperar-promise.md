# await para Esperar Promise: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**await** é **operador unário** que pausa execução de async function até que Promise seja resolvida ou rejeitada, extraindo valor resolvido e retomando execução, ou propagando erro se Promise for rejeitada. Conceitualmente, representa **synchronous-looking asynchronous code**, onde desenvolvedor escreve código que parece sequencial/bloqueante mas JavaScript engine mantém non-blocking behavior através de suspend/resume mechanism.

Na essência, await materializa o princípio de **declarative waiting**, onde simples keyword comunica "aguarde este resultado assíncrono antes de continuar", eliminando callbacks aninhados e Promise chains, tornando código assíncrono tão legível quanto código síncrono enquanto preserva performance não-bloqueante.

## 📋 Fundamentos

### Sintaxe Básica await

```typescript
// await extrai valor de Promise
async function getUser(): Promise<User> {
  const response = await fetch('https://api.example.com/user/1');
  const user = await response.json();
  return user;
}

// Equivalente com Promises
function getUser(): Promise<User> {
  return fetch('https://api.example.com/user/1')
    .then(response => response.json())
    .then(user => user);
}
```

**Conceito-chave:** `await` **pausa** execução até Promise resolver e **extrai valor**.

### await Apenas em async Functions

```typescript
// ✅ await dentro de async function
async function fetchData(): Promise<string> {
  const data = await Promise.resolve('data');
  return data;
}

// ❌ await fora de async function (erro de sintaxe)
function fetchData(): Promise<string> {
  const data = await Promise.resolve('data');  // SyntaxError
  return data;
}

// ✅ Top-level await (ES2022, apenas em módulos)
// No arquivo .mjs ou com "type": "module"
const config = await loadConfig();
```

**Conceito:** `await` **só funciona** dentro de async functions (exceto top-level await em módulos ES2022+).

## 🔍 Análise Conceitual

### 1. Como await Funciona Internamente

```typescript
// Código com await
async function example(): Promise<number> {
  console.log('Before await');
  const result = await Promise.resolve(42);
  console.log('After await');
  return result;
}

// JavaScript engine transforma em:
function example(): Promise<number> {
  return new Promise((resolve) => {
    console.log('Before await');

    Promise.resolve(42).then(result => {
      console.log('After await');
      resolve(result);
    });
  });
}
```

**Conceito:** `await` é **syntax sugar** que transforma código em Promise chain internamente.

### 2. await Pausa, Mas Não Bloqueia

```typescript
async function longOperation(): Promise<void> {
  console.log('Start');

  await delay(2000);  // Pausa ESTA função por 2 segundos

  console.log('End');
}

console.log('Before calling');
longOperation();
console.log('After calling');

// Output:
// "Before calling"
// "Start"
// "After calling"
// (2 segundos depois)
// "End"
```

**Conceito fundamental:**
- `await` **pausa** execução da async function
- **NÃO bloqueia** thread principal (event loop continua)
- Outros códigos continuam executando normalmente

### 3. await Extrai Valor de Promise

```typescript
// Promise retorna Promise<number>
const promise: Promise<number> = Promise.resolve(42);
console.log(promise);  // Promise { <fulfilled>: 42 }

// await extrai o valor
async function getValue(): Promise<void> {
  const value: number = await promise;
  console.log(value);  // 42 (não é Promise!)
}
```

**Conceito:** `await` **unwraps** Promise - retorna valor direto, não Promise.

### 4. Tipo de await Expression

```typescript
// await muda tipo de Promise<T> para T
async function examples(): Promise<void> {
  // Promise<string>
  const promise1: Promise<string> = Promise.resolve('hello');

  // await extrai string
  const value1: string = await promise1;

  // Promise<number>
  const promise2: Promise<number> = fetchNumber();

  // await extrai number
  const value2: number = await promise2;

  // Promise<User>
  const promise3: Promise<User> = fetchUser(1);

  // await extrai User
  const value3: User = await promise3;
}
```

**Tipo de await:**
```typescript
await Promise<T>  →  T
await Promise<string>  →  string
await Promise<number>  →  number
```

### 5. await com Promise Rejeitada

```typescript
async function handleRejection(): Promise<void> {
  try {
    const result = await Promise.reject(new Error('Failed'));
    console.log(result);  // Nunca executa
  } catch (error) {
    console.error('Caught:', error.message);  // "Caught: Failed"
  }
}
```

**Conceito:** await em Promise **rejeitada** lança erro, que pode ser capturado com try...catch.

### 6. await com Non-Promise Values

```typescript
async function awaitNonPromise(): Promise<void> {
  // await em valor não-Promise
  const value1 = await 42;
  console.log(value1);  // 42

  const value2 = await 'hello';
  console.log(value2);  // "hello"

  const value3 = await { id: 1, name: 'John' };
  console.log(value3);  // { id: 1, name: 'John' }
}
```

**Conceito:** `await` em **valor não-Promise** envolve automaticamente em `Promise.resolve()` e resolve imediatamente.

### 7. Sequencial vs Paralelo

```typescript
// ❌ Sequencial (lento - 3 segundos total)
async function sequential(): Promise<void> {
  const user = await fetchUser(1);      // 1 segundo
  const orders = await fetchOrders(1);  // 1 segundo
  const products = await fetchProducts(1);  // 1 segundo

  console.log(user, orders, products);
}

// ✅ Paralelo (rápido - 1 segundo total)
async function parallel(): Promise<void> {
  // Iniciar todas Promises simultaneamente
  const userPromise = fetchUser(1);
  const ordersPromise = fetchOrders(1);
  const productsPromise = fetchProducts(1);

  // Aguardar todas concluírem
  const user = await userPromise;
  const orders = await ordersPromise;
  const products = await productsPromise;

  console.log(user, orders, products);
}

// ✅ Paralelo com Promise.all (ideal)
async function parallelAll(): Promise<void> {
  const [user, orders, products] = await Promise.all([
    fetchUser(1),
    fetchOrders(1),
    fetchProducts(1)
  ]);

  console.log(user, orders, products);
}
```

**Conceito crítico:**
- **Sequencial:** cada `await` espera anterior completar
- **Paralelo:** iniciar Promises primeiro, depois `await`

### 8. await em Expressões

```typescript
async function awaitInExpressions(): Promise<void> {
  // await em expressão
  const result = (await fetchNumber()) * 2;

  // await em ternário
  const value = await condition ? fetchA() : fetchB();

  // await em template string
  const message = `User: ${await fetchUserName(1)}`;

  // await em array
  const numbers = [await fetchNum1(), await fetchNum2()];

  // await em função
  console.log(await fetchData());

  // await em return
  return await fetchFinalResult();
}
```

**Conceito:** `await` pode ser usado em **qualquer expressão** dentro de async function.

### 9. Múltiplos awaits Sequenciais

```typescript
async function processOrder(orderId: string): Promise<void> {
  // Cada await depende do anterior
  const order = await fetchOrder(orderId);

  const user = await fetchUser(order.userId);

  const payment = await processPayment(order.total, user.paymentMethod);

  const inventory = await updateInventory(order.items);

  const confirmation = await sendConfirmation(user.email, order.id);

  console.log('Order processed:', confirmation);
}
```

**Conceito:** Múltiplos `await` sequenciais quando cada operação **depende** da anterior.

### 10. await vs .then()

```typescript
// Usando .then()
function getUserOrders(userId: string): Promise<Order[]> {
  return fetchUser(userId)
    .then(user => fetchOrders(user.id))
    .then(orders => {
      console.log('Orders:', orders);
      return orders;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// Usando await (mais legível)
async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    console.log('Orders:', orders);
    return orders;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

**Vantagens de await:**
- Código **parece síncrono** (mais fácil ler)
- **try...catch** para error handling (mais natural)
- Menos indentação
- Debugging mais fácil

## 🎯 Aplicabilidade

### API Calls Sequenciais

```typescript
async function loadUserData(userId: string): Promise<UserData> {
  // Buscar dados básicos
  const user = await fetch(`/api/users/${userId}`).then(r => r.json());

  // Buscar dados dependentes
  const profile = await fetch(`/api/profiles/${user.profileId}`).then(r => r.json());

  const settings = await fetch(`/api/settings/${userId}`).then(r => r.json());

  return {
    ...user,
    profile,
    settings
  };
}
```

### Processamento Condicional

```typescript
async function authenticateUser(
  username: string,
  password: string
): Promise<AuthResult> {
  // Buscar usuário
  const user = await findUserByUsername(username);

  if (!user) {
    return { success: false, reason: 'User not found' };
  }

  // Validar senha
  const valid = await validatePassword(password, user.passwordHash);

  if (!valid) {
    return { success: false, reason: 'Invalid password' };
  }

  // Gerar token
  const token = await generateToken(user.id);

  return { success: true, token };
}
```

### Transformação de Dados

```typescript
async function transformUserData(userId: string): Promise<TransformedData> {
  const rawData = await fetchRawData(userId);

  const normalized = await normalizeData(rawData);

  const enriched = await enrichWithExternalData(normalized);

  const validated = await validateData(enriched);

  return validated;
}
```

### Loop com await

```typescript
async function processUsers(userIds: string[]): Promise<void> {
  for (const userId of userIds) {
    const user = await fetchUser(userId);
    const processed = await processUser(user);
    await saveProcessedUser(processed);

    console.log(`Processed user ${userId}`);
  }

  console.log('All users processed');
}
```

### Early Return

```typescript
async function getUserData(userId: string): Promise<User | null> {
  const cached = await checkCache(userId);

  if (cached) {
    return cached;  // Early return com cache
  }

  const user = await fetchFromDatabase(userId);

  if (!user) {
    return null;  // Early return se não encontrar
  }

  await saveToCache(userId, user);

  return user;
}
```

### Retry Logic

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      return result;  // Sucesso
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${i + 1} failed, retrying...`);
      await delay(1000 * (i + 1));  // Exponential backoff
    }
  }

  throw lastError!;
}

// Usar
const data = await fetchWithRetry(() => fetchData());
```

### Timeout com await

```typescript
async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), timeoutMs);
  });

  return await Promise.race([promise, timeoutPromise]);
}

// Usar
try {
  const user = await fetchWithTimeout(fetchUser(1), 5000);
  console.log(user);
} catch (error) {
  console.error('Request timed out');
}
```

## ⚠️ Considerações

### 1. await Apenas em async Functions

```typescript
// ❌ ERRO: await fora de async function
function getData() {
  const data = await fetchData();  // SyntaxError
  return data;
}

// ✅ Deve estar em async function
async function getData() {
  const data = await fetchData();
  return data;
}

// ✅ IIFE async
(async () => {
  const data = await fetchData();
  console.log(data);
})();
```

### 2. Cuidado com await em Loops

```typescript
// ❌ forEach não funciona com await
async function processItems(items: string[]): Promise<void> {
  items.forEach(async (item) => {
    await processItem(item);  // Não espera!
  });

  console.log('Done');  // Executa ANTES de processar items
}

// ✅ Use for...of
async function processItems(items: string[]): Promise<void> {
  for (const item of items) {
    await processItem(item);
  }

  console.log('Done');  // Executa DEPOIS
}

// ✅ Paralelo com Promise.all + map
async function processItems(items: string[]): Promise<void> {
  await Promise.all(items.map(item => processItem(item)));

  console.log('Done');
}
```

### 3. await Desnecessário

```typescript
// ❌ await desnecessário em return
async function getUser(id: string): Promise<User> {
  return await fetchUser(id);
}

// ✅ Retornar Promise diretamente
async function getUser(id: string): Promise<User> {
  return fetchUser(id);
}

// MAS: await necessário para try...catch
async function getUser(id: string): Promise<User> {
  try {
    return await fetchUser(id);  // Necessário para catch funcionar
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

### 4. Performance: Sequencial vs Paralelo

```typescript
// ❌ Lento: operações independentes executadas sequencialmente
async function loadData(): Promise<void> {
  const users = await fetchUsers();      // 1 segundo
  const products = await fetchProducts();  // 1 segundo
  const orders = await fetchOrders();    // 1 segundo
  // Total: 3 segundos
}

// ✅ Rápido: operações independentes em paralelo
async function loadData(): Promise<void> {
  const [users, products, orders] = await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders()
  ]);
  // Total: 1 segundo (execução paralela)
}
```

### 5. Top-Level await (ES2022)

```typescript
// Antes ES2022: IIFE necessário
(async () => {
  const config = await loadConfig();
  startApp(config);
})();

// ES2022+: top-level await
const config = await loadConfig();
startApp(config);
```

**Requisitos para top-level await:**
- `"module": "esnext"` ou superior no tsconfig.json
- Arquivo `.mjs` OU `"type": "module"` no package.json
- Apenas em **módulos ES**, não em scripts

### 6. await em Non-Promise

```typescript
async function example(): Promise<void> {
  // await em valor não-Promise funciona, mas é redundante
  const value = await 42;  // Funciona (mas desnecessário)

  // Melhor: não usar await
  const value2 = 42;
}
```

### 7. Debugging com await

```typescript
// await facilita debugging
async function debug(): Promise<void> {
  const user = await fetchUser(1);
  debugger;  // Pode inspecionar user diretamente

  const orders = await fetchOrders(user.id);
  debugger;  // Pode inspecionar orders
}

// vs .then() (mais difícil debugar)
function debug(): Promise<void> {
  return fetchUser(1)
    .then(user => {
      debugger;  // Dentro de callback
      return fetchOrders(user.id);
    })
    .then(orders => {
      debugger;
    });
}
```

## 📚 Conclusão

await é **operador** que pausa async function até Promise resolver, extraindo valor resolvido. Apenas funciona dentro de async functions (exceto top-level await ES2022+ em módulos). await transforma `Promise<T>` em `T`. Pausa execução da função mas **não bloqueia** thread principal. Promise rejeitada lança erro capturável com try...catch. await em valor não-Promise envolve em Promise.resolve() automaticamente. Múltiplos awaits sequenciais quando cada depende do anterior; usar Promise.all para operações paralelas independentes. await desnecessário em return (exceto com try...catch). forEach não funciona com await - usar for...of. await torna código assíncrono parecer síncrono, mais legível que .then() chains. Debugging mais fácil que Promises. await é syntax sugar - JavaScript transforma em Promise chain internamente.

