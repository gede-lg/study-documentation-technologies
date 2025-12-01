# Error-First Callbacks: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Error-first callbacks** (callbacks error-first) é **convenção** onde callback recebe erro como **primeiro parâmetro** e resultado como segundo, permitindo verificação de erro antes de processar resultado. Popularizada pelo Node.js, representa **explicit error handling**, onde erro é cidadão de primeira classe que deve ser tratado explicitamente, diferente de exceções síncronas que podem ser esquecidas.

Na essência, error-first callbacks materializam o princípio de **fail-fast with explicit handling**, onde operações assíncronas comunicam falhas através de parâmetro dedicado que força desenvolvedor a decidir conscientemente como lidar com erros, prevenindo bugs silenciosos de erros não tratados.

## 📋 Fundamentos

### Assinatura Error-First

```typescript
// Padrão Error-First
type ErrorFirstCallback<T> = (error: Error | null, result?: T) => void;

// Sucesso: error = null, result tem valor
// Falha: error = Error, result é undefined
```

**Conceito-chave:**
- **Primeiro parâmetro:** `Error | null`
- **Segundo parâmetro:** resultado (apenas se error for null)

### Exemplo Básico

```typescript
import fs from 'fs';

// API Node.js usa error-first
fs.readFile('data.txt', 'utf-8', (error, data) => {
  if (error) {
    // Lidar com erro
    console.error('Error reading file:', error.message);
    return;
  }

  // Processar resultado (data só existe se não houver erro)
  console.log('File contents:', data);
});
```

**Pattern:**
```typescript
callback(error, result?) {
  if (error) {
    // Handle error
    return;
  }

  // Use result
}
```

## 🔍 Análise Conceitual

### 1. Por Que Error Primeiro?

```typescript
// ✅ Error-first (Node.js convention)
function fetchData(callback: (error: Error | null, data?: string) => void) {
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      callback(null, 'Data fetched successfully');
    } else {
      callback(new Error('Failed to fetch data'));
    }
  }, 1000);
}

// Uso FORÇA verificar erro primeiro
fetchData((error, data) => {
  if (error) {
    console.error(error);  // DEVE tratar erro
    return;
  }

  console.log(data);  // Seguro: data existe se chegou aqui
});
```

**Vantagens:**
1. **Força error handling** - erro é primeiro, não pode ignorar
2. **Consistência** - todas APIs Node.js seguem padrão
3. **Type safety** - TypeScript sabe que data só existe se error for null

### 2. Convenções de Error-First

```typescript
// Convenção 1: Error sempre primeiro parâmetro
function operation(
  callback: (error: Error | null, result?: any) => void
): void {}

// Convenção 2: null indica sucesso
callback(null, result);

// Convenção 3: Error object indica falha
callback(new Error('Something went wrong'));

// Convenção 4: Resultado é undefined em erro
// Não passar resultado se houver erro
callback(error);  // ✅
// callback(error, undefined);  // Redundante mas OK
```

### 3. Error Types

```typescript
// Error genérico
callback(new Error('Generic error'));

// Error customizado
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

callback(new ValidationError('Invalid input'));

// Error com dados extras
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

callback(new ApiError('Not found', 404));
```

### 4. Multiple Callbacks (Success/Error)

```typescript
// ❌ Múltiplos callbacks (menos comum)
function fetchData(
  onSuccess: (data: string) => void,
  onError: (error: Error) => void
): void {
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      onSuccess('Data fetched');
    } else {
      onError(new Error('Failed'));
    }
  }, 1000);
}

// ✅ Error-first (padrão Node.js)
function fetchData(
  callback: (error: Error | null, data?: string) => void
): void {
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      callback(null, 'Data fetched');
    } else {
      callback(new Error('Failed'));
    }
  }, 1000);
}
```

**Por que error-first é melhor:**
- Um callback em vez de dois
- Padrão consistente
- Menos confusão sobre ordem de parâmetros

### 5. Implementação Error-First

```typescript
// Criar função error-first
function readUserData(
  userId: string,
  callback: (error: Error | null, user?: User) => void
): void {
  // Simula operação assíncrona
  setTimeout(() => {
    // Validação
    if (!userId) {
      return callback(new Error('User ID is required'));
    }

    // Simula busca em DB
    const users: Record<string, User> = {
      '1': { id: '1', name: 'John', email: 'john@example.com' },
      '2': { id: '2', name: 'Jane', email: 'jane@example.com' }
    };

    const user = users[userId];

    if (!user) {
      return callback(new Error('User not found'));
    }

    // Sucesso
    callback(null, user);
  }, 500);
}

// Usar
readUserData('1', (error, user) => {
  if (error) {
    console.error('Error:', error.message);
    return;
  }

  console.log('User:', user!.name);
});
```

### 6. Error Propagation

```typescript
// Propagar erros através de callbacks
function getUser(
  userId: string,
  callback: (error: Error | null, user?: User) => void
): void {
  fetchFromDatabase(userId, (error, data) => {
    if (error) {
      // Propagar erro
      return callback(error);
    }

    // Validar dados
    if (!data.email) {
      return callback(new Error('Invalid user data'));
    }

    callback(null, data);
  });
}

function getOrders(
  userId: string,
  callback: (error: Error | null, orders?: Order[]) => void
): void {
  getUser(userId, (error, user) => {
    if (error) {
      // Propagar erro de getUser
      return callback(error);
    }

    fetchOrders(user!.id, callback);
  });
}
```

### 7. Parallel Operations com Error-First

```typescript
// Executar múltiplas operações paralelas
function fetchMultiple(
  callback: (error: Error | null, results?: [User, Settings]) => void
): void {
  let user: User | null = null;
  let settings: Settings | null = null;
  let errorOccurred: Error | null = null;
  let completed = 0;

  function checkComplete() {
    completed++;

    if (errorOccurred) {
      callback(errorOccurred);
      return;
    }

    if (completed === 2) {
      callback(null, [user!, settings!]);
    }
  }

  fetchUser('1', (error, data) => {
    if (error) {
      errorOccurred = error;
    } else {
      user = data!;
    }
    checkComplete();
  });

  fetchSettings('1', (error, data) => {
    if (error) {
      errorOccurred = error;
    } else {
      settings = data!;
    }
    checkComplete();
  });
}
```

### 8. Wrapping Promises em Error-First

```typescript
// Converter Promise para error-first callback
function promiseToCallback<T>(
  promise: Promise<T>,
  callback: (error: Error | null, result?: T) => void
): void {
  promise
    .then(result => callback(null, result))
    .catch(error => callback(error));
}

// Usar
const userPromise = fetch('https://api.example.com/user/1').then(r => r.json());

promiseToCallback(userPromise, (error, user) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(user);
});
```

## 🎯 Aplicabilidade

### File System Operations

```typescript
import fs from 'fs';

// Ler arquivo
fs.readFile('config.json', 'utf-8', (error, data) => {
  if (error) {
    console.error('Error reading config:', error);
    return;
  }

  const config = JSON.parse(data);
  console.log('Config loaded:', config);
});

// Escrever arquivo
fs.writeFile('output.txt', 'Hello World', (error) => {
  if (error) {
    console.error('Error writing file:', error);
    return;
  }

  console.log('File written successfully');
});

// Verificar se arquivo existe
fs.access('data.txt', fs.constants.F_OK, (error) => {
  if (error) {
    console.log('File does not exist');
  } else {
    console.log('File exists');
  }
});
```

### Database Operations

```typescript
// MongoDB-style callback
function findUser(
  userId: string,
  callback: (error: Error | null, user?: User) => void
): void {
  db.collection('users').findOne({ _id: userId }, (error, doc) => {
    if (error) {
      return callback(error);
    }

    if (!doc) {
      return callback(new Error('User not found'));
    }

    callback(null, doc as User);
  });
}

// Usar
findUser('123', (error, user) => {
  if (error) {
    console.error('Database error:', error);
    return;
  }

  console.log('User found:', user!.name);
});
```

### HTTP Requests

```typescript
import https from 'https';

function httpGet(
  url: string,
  callback: (error: Error | null, data?: string) => void
): void {
  https.get(url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      if (response.statusCode === 200) {
        callback(null, data);
      } else {
        callback(new Error(`HTTP ${response.statusCode}`));
      }
    });
  }).on('error', (error) => {
    callback(error);
  });
}

// Usar
httpGet('https://api.example.com/data', (error, data) => {
  if (error) {
    console.error('Request failed:', error);
    return;
  }

  console.log('Response:', data);
});
```

### Retry Logic com Error-First

```typescript
function retryOperation<T>(
  operation: (callback: (error: Error | null, result?: T) => void) => void,
  maxRetries: number,
  callback: (error: Error | null, result?: T) => void
): void {
  let attempts = 0;

  function attempt() {
    attempts++;

    operation((error, result) => {
      if (error) {
        if (attempts < maxRetries) {
          console.log(`Attempt ${attempts} failed, retrying...`);
          setTimeout(attempt, 1000 * attempts);
        } else {
          callback(new Error(`Failed after ${maxRetries} attempts: ${error.message}`));
        }
      } else {
        callback(null, result);
      }
    });
  }

  attempt();
}

// Usar
retryOperation(
  (callback) => fetchData(callback),
  3,
  (error, data) => {
    if (error) {
      console.error('Final error:', error);
    } else {
      console.log('Success:', data);
    }
  }
);
```

### Validation Pipeline

```typescript
type ValidationCallback = (error: Error | null, valid?: boolean) => void;

function validateEmail(email: string, callback: ValidationCallback): void {
  setTimeout(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      callback(new Error('Invalid email format'));
    } else {
      callback(null, true);
    }
  }, 100);
}

function validatePassword(password: string, callback: ValidationCallback): void {
  setTimeout(() => {
    if (password.length < 8) {
      callback(new Error('Password too short'));
    } else {
      callback(null, true);
    }
  }, 100);
}

function validateUser(
  user: { email: string; password: string },
  callback: (error: Error | null, valid?: boolean) => void
): void {
  validateEmail(user.email, (error) => {
    if (error) return callback(error);

    validatePassword(user.password, (error) => {
      if (error) return callback(error);

      callback(null, true);
    });
  });
}
```

## ⚠️ Considerações

### 1. Sempre Verificar Error

```typescript
// ❌ ERRO: não verifica error
fs.readFile('file.txt', 'utf-8', (error, data) => {
  console.log(data);  // Pode ser undefined!
});

// ✅ Verifica error primeiro
fs.readFile('file.txt', 'utf-8', (error, data) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(data);  // Seguro
});
```

### 2. Não Chamar Callback Múltiplas Vezes

```typescript
// ❌ ERRO: callback chamado múltiplas vezes
function fetchData(callback: (error: Error | null, data?: string) => void) {
  setTimeout(() => {
    callback(null, 'data');
    callback(null, 'more data');  // ❌ Segundo callback!
  }, 1000);
}

// ✅ Chamar callback UMA vez
function fetchData(callback: (error: Error | null, data?: string) => void) {
  setTimeout(() => {
    callback(null, 'data');
  }, 1000);
}
```

### 3. Error vs Null

```typescript
// ✅ Passar null em sucesso
callback(null, result);

// ❌ NUNCA passar erro e resultado juntos
callback(error, result);  // Confuso!

// ✅ Erro OU resultado
if (error) {
  callback(error);
} else {
  callback(null, result);
}
```

### 4. Migração para Promises

```typescript
// Util.promisify converte error-first para Promise
import { promisify } from 'util';
import fs from 'fs';

const readFileAsync = promisify(fs.readFile);

// Usar como Promise
readFileAsync('file.txt', 'utf-8')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// Ou async/await
async function readFile() {
  try {
    const data = await readFileAsync('file.txt', 'utf-8');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## 📚 Conclusão

Error-first callbacks é **convenção Node.js** onde erro é primeiro parâmetro (`error: Error | null`) e resultado segundo. null indica sucesso, Error indica falha. Força verificação explícita de erro antes de processar resultado. Pattern: `if (error) return; // use result`. Consistente em todas APIs Node.js (fs, http, crypto). Propagar erros passando error para próximo callback. Não chamar callback múltiplas vezes. Não passar erro e resultado juntos. util.promisify converte para Promises. Alternativa: múltiplos callbacks (onSuccess/onError), mas error-first é padrão. TypeScript type safety: result só existe se error for null. Error-first pré-data Promises, substituído por async/await em código moderno, mas ainda usado em Node.js core APIs.

