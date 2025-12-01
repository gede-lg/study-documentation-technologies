# async Function que Retorna Promise: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**async function** é **declaração de função** precedida pela keyword `async` que automaticamente transforma função em Promise-returning function, onde valor retornado é envolvido em `Promise.resolve()` e exceções lançadas tornam-se `Promise.reject()`. Conceitualmente, representa **implicit Promise wrapping**, onde desenvolvedor escreve código que parece síncrono mas JavaScript engine garante que função sempre retorna Promise, facilitando composição assíncrona.

Na essência, async function materializa o princípio de **declarative asynchronicity**, onde simples keyword `async` comunica que função executará operações assíncronas, permitindo uso de `await` internamente e garantindo interface consistente (sempre Promise) para quem chama, independente de implementação interna.

## 📋 Fundamentos

### Declaração async

```typescript
// Função async básica
async function fetchUser(): Promise<User> {
  return { id: 1, name: 'John', email: 'john@example.com' };
}

// Função normal equivalente
function fetchUser(): Promise<User> {
  return Promise.resolve({ id: 1, name: 'John', email: 'john@example.com' });
}
```

**Conceito-chave:** `async` automaticamente **envolve retorno** em Promise.

### Async Arrow Function

```typescript
// Arrow function async
const getUser = async (): Promise<User> => {
  return { id: 1, name: 'John' };
};

// Method async
class UserService {
  async fetchUser(id: number): Promise<User> {
    return { id, name: 'John' };
  }
}
```

### Retorno Sempre é Promise

```typescript
async function getValue(): Promise<number> {
  return 42;
}

// Chamar função
const promise = getValue();
console.log(promise);  // Promise { <fulfilled>: 42 }

// Usar .then()
getValue().then(value => {
  console.log(value);  // 42
});

// Ou await
const value = await getValue();
console.log(value);  // 42
```

**Conceito:** Mesmo retornando valor direto, **sempre retorna Promise**.

## 🔍 Análise Conceitual

### 1. Transformação Automática

```typescript
// Input: async function
async function greet(name: string): Promise<string> {
  return `Hello ${name}`;
}

// JavaScript transforma internamente para:
function greet(name: string): Promise<string> {
  return new Promise((resolve) => {
    resolve(`Hello ${name}`);
  });
}
```

**Conceito:** `async` é **syntax sugar** que cria Promise automaticamente.

### 2. Throw vs Promise.reject

```typescript
// Throw em async function
async function failWithThrow(): Promise<never> {
  throw new Error('Failed');
}

// Equivalente a:
function failWithThrow(): Promise<never> {
  return Promise.reject(new Error('Failed'));
}

// Usar
failWithThrow()
  .then(() => console.log('Success'))
  .catch(error => console.error(error));  // Error: Failed
```

**Conceito:** `throw` em async function torna-se **Promise rejeitada**.

### 3. Retornando Promise de async Function

```typescript
// Retornar Promise diretamente
async function fetchData(): Promise<string> {
  return Promise.resolve('data');
}

// JavaScript NÃO envolve em Promise dupla
const result = await fetchData();
console.log(result);  // "data" (não Promise)

// Tipo retornado
type ReturnType = Promise<string>;  // NÃO Promise<Promise<string>>
```

**Conceito:** Retornar Promise de async function **não cria Promise aninhada** - JavaScript achata automaticamente.

### 4. Async Function sem await

```typescript
// Async function sem await dentro
async function justReturn(): Promise<number> {
  return 42;
}

// Ainda retorna Promise
const value = justReturn();
console.log(value);  // Promise { 42 }
```

**Conceito:** `async` keyword **sempre** faz função retornar Promise, mesmo sem `await` interno.

### 5. Return Types em TypeScript

```typescript
// Tipo explícito
async function getUser(): Promise<User> {
  return { id: 1, name: 'John' };
}

// Inferência de tipo
async function getNumber() {
  return 42;
}
// TypeScript infere: Promise<number>

// Void async
async function logData(): Promise<void> {
  console.log('Logging...');
  // Sem return ou return undefined
}

// Never (sempre rejeita)
async function alwaysFails(): Promise<never> {
  throw new Error('Always fails');
}
```

### 6. Async IIFE (Immediately Invoked Function Expression)

```typescript
// Executar código async imediatamente
(async () => {
  const user = await fetchUser(1);
  console.log(user);
})();

// Ou com tratamento de erro
(async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
```

**Conceito:** IIFE permite usar `await` em **top-level** (antes de ES2022).

### 7. Async Generators

```typescript
// Async generator function
async function* generateNumbers(): AsyncGenerator<number> {
  yield 1;
  await delay(100);
  yield 2;
  await delay(100);
  yield 3;
}

// Usar
for await (const num of generateNumbers()) {
  console.log(num);
}
// Output (com delays):
// 1
// 2
// 3
```

### 8. Comparação: Normal vs Async

```typescript
// Função normal
function syncFunction(): number {
  return 42;
}

const value = syncFunction();
console.log(value);  // 42 (direto)

// Função async
async function asyncFunction(): Promise<number> {
  return 42;
}

const promise = asyncFunction();
console.log(promise);  // Promise { 42 }

// Precisa await/then para pegar valor
const value2 = await asyncFunction();
console.log(value2);  // 42
```

**Diferença fundamental:** async **sempre assíncrona** (microtask), normal **síncrona** (imediata).

## 🎯 Aplicabilidade

### API Wrapper

```typescript
class ApiClient {
  private baseUrl = 'https://api.example.com';

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Usar
const client = new ApiClient();

const user = await client.get<User>('/users/1');
const newUser = await client.post<User>('/users', { name: 'Jane' });
```

### Service Layer

```typescript
class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(data: CreateUserData): Promise<User> {
    // Validação pode lançar erro (Promise.reject)
    this.validate(data);

    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.repository.create({
      ...data,
      password: hashedPassword
    });

    return user;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  private validate(data: CreateUserData): void {
    if (!data.email) {
      throw new Error('Email required');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // Simula hash
    return `hashed_${password}`;
  }
}
```

### Utility Functions

```typescript
// Delay helper
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Timeout wrapper
async function timeout<T>(
  promise: Promise<T>,
  ms: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });

  return Promise.race([promise, timeoutPromise]);
}

// Retry logic
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      await delay(1000 * (i + 1));
    }
  }

  throw lastError!;
}
```

### Conditional Return

```typescript
async function getUserData(
  userId: string,
  includeOrders: boolean
): Promise<UserData | UserWithOrders> {
  const user = await fetchUser(userId);

  if (includeOrders) {
    const orders = await fetchOrders(userId);
    return { ...user, orders };
  }

  return user;
}
```

### Early Return

```typescript
async function processPayment(amount: number): Promise<PaymentResult> {
  // Validação com early return
  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  const balance = await getBalance();

  if (balance < amount) {
    return { status: 'failed', reason: 'Insufficient funds' };
  }

  const charge = await chargeCard(amount);

  return { status: 'success', transactionId: charge.id };
}
```

## ⚠️ Considerações

### 1. Async Function Sempre Assíncrona

```typescript
async function getValue(): Promise<number> {
  return 42;  // Sem await interno
}

console.log('Before');
const promise = getValue();
console.log('After');
console.log(promise);

// Output:
// "Before"
// "After"
// Promise { <pending> }

// Valor disponível apenas no próximo tick
promise.then(value => console.log(value));  // 42
```

**Conceito:** Mesmo sem `await`, async function executa em **microtask** (próximo tick).

### 2. Forgotten Return

```typescript
// ❌ Esqueceu return
async function getUser(): Promise<User | undefined> {
  const user = await fetchUser(1);
  // Esqueceu return!
}

const result = await getUser();
console.log(result);  // undefined

// ✅ Com return
async function getUser(): Promise<User> {
  const user = await fetchUser(1);
  return user;
}
```

### 3. Void vs Promise<void>

```typescript
// Função normal void (síncrona)
function logSync(): void {
  console.log('Sync log');
}

// Função async void (assíncrona)
async function logAsync(): Promise<void> {
  await delay(100);
  console.log('Async log');
}

// Usar
logSync();  // Executa imediatamente
logAsync();  // Retorna Promise, executa depois
```

### 4. Top-Level await (ES2022)

```typescript
// Sem top-level await (antes ES2022)
(async () => {
  const config = await loadConfig();
  startApp(config);
})();

// Com top-level await (ES2022+)
// Apenas em módulos ES
const config = await loadConfig();
startApp(config);
```

**Requisitos:**
- `"module": "esnext"` no tsconfig.json
- Extensão `.mjs` ou `"type": "module"` no package.json

### 5. Async Constructor (Não Possível)

```typescript
// ❌ Constructor não pode ser async
class Database {
  async constructor() {  // Erro de sintaxe
    await this.connect();
  }
}

// ✅ Pattern: static factory
class Database {
  private constructor() {}

  static async create(): Promise<Database> {
    const db = new Database();
    await db.connect();
    return db;
  }

  private async connect(): Promise<void> {
    // Conectar
  }
}

// Usar
const db = await Database.create();
```

## 📚 Conclusão

async function **sempre retorna Promise** automaticamente, envolvendo valor de retorno em Promise.resolve() e throw em Promise.reject(). Declarada com keyword `async` antes de function/arrow. Retornar Promise diretamente não cria aninhamento. Mesmo sem await interno, executa assincronamente (microtask). TypeScript infere Promise<T> como tipo de retorno. throw em async vira Promise rejeitada. Async IIFE para top-level await (pré-ES2022). Não pode ter async constructor - usar static factory. Async function é base para usar await internamente. Sempre assíncrona mesmo retornando valor direto. Promise.resolve/reject feito automaticamente por JavaScript engine.

