# Try/Catch com Async/Await

## 🎯 Introdução e Definição

### Definição Conceitual

**Try/catch com async/await** é **error handling pattern** que permite tratar **Promise rejections** usando **syntaxe síncrona**. Quando Promise **rejeita** dentro de await, rejection é **transformado em thrown error**, permitindo `catch` block capturar erro. Try/catch com async/await implementa **synchronous-style error handling** para código assíncrono - erros tratados como em código síncrono normal. Finally block **sempre executa** independente de sucesso ou erro, útil para **cleanup operations**.

Conceitualmente, try/catch transforma **Promise rejection** em **exception**, unificando error handling. Implementa **centralized error handling** - single catch block para múltiplos awaits. Segue **error propagation** - erros não tratados propagam para caller. Try/catch cria **error boundary** - delimita região onde erros são capturados.

**Fundamento teórico:** Try/catch deriva de **exception handling** tradicional - transposto para contexto assíncrono. Await transforma `Promise.reject(error)` em `throw error`, permitindo try/catch capturar. Implementa **synchronous exception semantics** - mesmo comportamento de try/catch síncrono. Finally garante **cleanup guarantee** - código cleanup sempre executa.

**Pattern básico:**
```typescript
// Try/catch captura Promise rejections

// Sem try/catch - rejection não tratada ❌
async function withoutTryCatch(): Promise<void> {
  const data = await fetchData();  // Se rejeitar, UnhandledPromiseRejection!
  console.log(data);
}

// Com try/catch - rejection capturada ✅
async function withTryCatch(): Promise<void> {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch:", error);
    // Error handled gracefully
  }
}

// Try/catch transforma rejection em catchable error
```

**Rejection becomes thrown error:**
```typescript
// Promise rejection vira thrown error em await

async function demonstrateRejection(): Promise<void> {
  try {
    // Promise rejeita
    const result = await Promise.reject(new Error("Something failed!"));
    
    // Linha acima lança erro, código abaixo não executa
    console.log(result);  // Nunca executado
  } catch (error) {
    console.error("Caught rejection:", error.message);  // "Something failed!"
  }
}

// await Promise.reject(error) === throw error
// Unified error handling
```

**Finally for cleanup:**
```typescript
// Finally sempre executa - cleanup garantido

async function withFinally(): Promise<void> {
  const connection = await openConnection();
  
  try {
    const data = await fetchData(connection);
    await processData(data);
  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    // Cleanup SEMPRE executa (sucesso ou erro)
    await connection.close();
    console.log("Connection closed");
  }
}

// Finally garante cleanup mesmo com erro
```

**Multiple awaits in try:**
```typescript
// Single try/catch para múltiplos awaits

async function multipleAwaits(): Promise<void> {
  try {
    const user = await fetchUser(123);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts);
    
    console.log("All data loaded");
  } catch (error) {
    // Captura erro de QUALQUER await acima
    console.error("Failed at some step:", error);
  }
}

// Single error handler para pipeline inteiro
// Muito mais limpo que múltiplos .catch()
```

### Contexto Histórico e Evolução

**Pre-ES2017:** Promise chains com .catch().

```javascript
// Promises - .catch() para erros
fetchData()
  .then(data => processData(data))
  .catch(error => {
    console.error("Error:", error);
  });

// .catch() para cada Promise
```

**ES2017 (ES8, 2017):** Try/catch com async/await.

```javascript
// ES2017 - try/catch com await
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Synchronous error handling syntax
```

**TypeScript 1.7 (2015):** Async/await transpilation.

```typescript
// TypeScript 1.7 - try/catch transpilado
async function getData(): Promise<Data> {
  try {
    return await fetchData();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Transpila para .catch() internamente
```

**TypeScript 2.0 (2016):** Never type para thrown errors.

```typescript
// TypeScript 2.0 - never type
function throwError(): never {
  throw new Error("Always throws");
}

async function example(): Promise<void> {
  try {
    throwError();  // never returns
  } catch (error) {
    console.error(error);
  }
}
```

**TypeScript 4.0 (2020):** Unknown type para catch clauses.

```typescript
// TypeScript 4.0 - catch clauses tipo unknown
try {
  await riskyOperation();
} catch (error: unknown) {  // error é unknown, não any
  if (error instanceof Error) {
    console.error(error.message);
  }
}

// Type safety melhorado em catch
```

**TypeScript 4.4 (2021):** useUnknownInCatchVariables.

```typescript
// TypeScript 4.4 - catch variables unknown por padrão
{
  "compilerOptions": {
    "useUnknownInCatchVariables": true
  }
}

try {
  await operation();
} catch (error) {  // error: unknown (não any)
  // Type guard necessário
}
```

**Modern (2020+):** AggregateError support.

```typescript
// ES2021 - AggregateError
try {
  await Promise.any([promise1, promise2, promise3]);
} catch (error) {
  if (error instanceof AggregateError) {
    console.error("All promises rejected:", error.errors);
  }
}
```

### Problema Fundamental que Resolve

Try/catch resolve problemas de **scattered error handling**, **Promise chain complexity**, **error recovery difficulty**, e **cleanup guarantee**.

**Problema 1: Scattered Error Handlers**
```typescript
// Promise chains - error handling espalhado ❌

function processData(data: RawData): Promise<Result> {
  return validateData(data)
    .catch(validationError => {
      console.error("Validation failed:", validationError);
      throw validationError;
    })
    .then(validated => transformData(validated))
    .catch(transformError => {
      console.error("Transform failed:", transformError);
      throw transformError;
    })
    .then(transformed => saveData(transformed))
    .catch(saveError => {
      console.error("Save failed:", saveError);
      throw saveError;
    });
}

// ✗ Múltiplos .catch() espalhados
// ✗ Código repetitivo
// ✗ Difícil manter
```

**Solução: Try/catch centralizado**
```typescript
// Try/catch - error handling unificado ✅

async function processData(data: RawData): Promise<Result> {
  try {
    const validated = await validateData(data);
    const transformed = await transformData(validated);
    const saved = await saveData(transformed);
    return saved;
  } catch (error) {
    // Single error handler para todo pipeline
    console.error("Processing failed:", error);
    throw error;
  }
}

// ✓ Single catch block
// ✓ Código limpo
// ✓ Fácil manter
```

**Problema 2: Cleanup Not Guaranteed**
```typescript
// Promise chains - cleanup pode não executar ❌

function processFile(filename: string): Promise<void> {
  let fileHandle: FileHandle | null = null;
  
  return openFile(filename)
    .then(handle => {
      fileHandle = handle;
      return readFile(handle);
    })
    .then(data => {
      return processData(data);
    })
    .then(() => {
      // Cleanup aqui só executa se sucesso
      if (fileHandle) {
        return fileHandle.close();
      }
    })
    .catch(error => {
      // Cleanup duplicado aqui
      if (fileHandle) {
        fileHandle.close();
      }
      throw error;
    });
}

// ✗ Cleanup duplicado (success e error paths)
// ✗ Easy esquecer cleanup em um path
```

**Solução: Finally garante cleanup**
```typescript
// Try/catch/finally - cleanup garantido ✅

async function processFile(filename: string): Promise<void> {
  const fileHandle = await openFile(filename);
  
  try {
    const data = await readFile(fileHandle);
    await processData(data);
  } catch (error) {
    console.error("Processing failed:", error);
    throw error;
  } finally {
    // Cleanup SEMPRE executa (sucesso ou erro)
    await fileHandle.close();
  }
}

// ✓ Single cleanup em finally
// ✓ Garantido executar
// ✓ Sem duplicação
```

**Problema 3: Error Information Lost**
```typescript
// Promise chains - contexto de erro perdido ❌

function fetchUserData(userId: number): Promise<UserData> {
  return fetchUser(userId)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts))
    .catch(error => {
      // Qual step falhou? fetchUser, fetchPosts, ou fetchComments?
      console.error("Something failed:", error);
      throw error;
    });
}

// ✗ Difícil saber qual Promise rejeitou
// ✗ Context lost
```

**Solução: Try/catch com error context**
```typescript
// Try/catch - error context preservado ✅

async function fetchUserData(userId: number): Promise<UserData> {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts);
    
    return { user, posts, comments };
  } catch (error) {
    // Stack trace mostra exatamente qual await falhou
    console.error("Failed to fetch user data:", error);
    console.error("User ID:", userId);  // Context disponível
    throw error;
  }
}

// ✓ Stack trace aponta linha exata
// ✓ Context variables acessíveis
```

**Problema 4: Conditional Error Handling Difficult**
```typescript
// Promise chains - conditional error handling complexo ❌

function fetchDataWithRetry(): Promise<Data> {
  return fetchData()
    .catch(error => {
      if (error.code === 'NETWORK_ERROR') {
        // Retry
        return wait(1000).then(() => fetchData());
      } else {
        // Re-throw
        throw error;
      }
    })
    .catch(error => {
      // Outro catch para segundo attempt?
      throw error;
    });
}

// ✗ Nested .catch() confuso
// ✗ Retry logic complicado
```

**Solução: Try/catch com conditional handling**
```typescript
// Try/catch - conditional error handling limpo ✅

async function fetchDataWithRetry(): Promise<Data> {
  try {
    return await fetchData();
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      // Retry
      console.log("Network error, retrying...");
      await wait(1000);
      return await fetchData();  // Second attempt
    } else {
      // Re-throw other errors
      throw error;
    }
  }
}

// ✓ Clear conditional logic
// ✓ Easy read retry flow
// ✓ Natural error filtering
```

**Fundamento teórico:** Try/catch implementa **synchronous exception semantics** em código assíncrono, unificando error handling e garantindo **cleanup execution**.

### Importância no Ecossistema

Try/catch com async/await é importante porque:

- **Unified error handling:** Errors tratados uniformemente
- **Cleanup guarantee:** Finally sempre executa
- **Code readability:** Error handling natural
- **Error context:** Stack traces melhores
- **Type safety:** TypeScript infere error types
- **Standard practice:** Padrão moderno
- **Framework support:** React, Node.js usam try/catch
- **Testing:** Easier test error scenarios

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Rejection → Exception:** Promise.reject vira throw
2. **Centralized handling:** Single catch para múltiplos awaits
3. **Finally cleanup:** Sempre executa
4. **Error propagation:** Erros propagam se não tratados
5. **Type safe:** TypeScript infere error types

### Pilares Fundamentais

- **Try block:** Código que pode falhar
- **Catch block:** Error handling
- **Finally block:** Cleanup garantido
- **Throw:** Re-lançar erros
- **Error types:** instanceof checks

### Visão Geral das Nuances

- **Multiple catches:** Catch específico por error type
- **Nested try/catch:** Inner catch overrides outer
- **No catch:** Finally ainda executa
- **Async finally:** Pode usar await em finally
- **Error re-throwing:** throw dentro de catch

## 🧠 Fundamentos Teóricos

### Basic Try/Catch

```typescript
// Basic try/catch com async/await

async function basicExample(): Promise<void> {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Rejection capturado em catch
```

**Basic:** Try block + catch block.

### Princípios e Conceitos Subjacentes

#### Finally Always Executes

```typescript
// Finally sempre executa, independente de sucesso/erro

async function demonstrateFinally(): Promise<void> {
  console.log("Start");
  
  try {
    console.log("Try block");
    await riskyOperation();
    console.log("Success");
  } catch (error) {
    console.log("Catch block");
  } finally {
    console.log("Finally block - ALWAYS runs");
  }
  
  console.log("End");
}

// Success path:
// Start → Try → Success → Finally → End

// Error path:
// Start → Try → Catch → Finally → End

// Finally SEMPRE executa!
```

**Finally:** Guaranteed execution.

#### Multiple Awaits in Try

```typescript
// Single try/catch para múltiplos awaits

async function multipleAwaits(): Promise<void> {
  try {
    const step1 = await doStep1();
    const step2 = await doStep2(step1);
    const step3 = await doStep3(step2);
    
    console.log("All steps completed");
  } catch (error) {
    // Captura erro de QUALQUER await
    console.error("Failed at some step:", error);
  }
}

// Error em qualquer step é capturado
// Não precisa try/catch para cada await
```

**Multiple Awaits:** Single catch handles all.

### Catch Error Type

```typescript
// Catch com type checking (TypeScript 4.0+)

async function typedCatch(): Promise<void> {
  try {
    await riskyOperation();
  } catch (error: unknown) {  // error é unknown, não any
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack:", error.stack);
    } else if (typeof error === 'string') {
      console.error("String error:", error);
    } else {
      console.error("Unknown error:", error);
    }
  }
}

// Type guards para error handling seguro
```

**Type Safe:** Unknown error type, type guards.

#### Re-throwing Errors

```typescript
// Re-throw erro para propagate

async function rethrowExample(): Promise<void> {
  try {
    await riskyOperation();
  } catch (error) {
    console.error("Error occurred:", error);
    
    // Log erro mas re-throw para caller handle
    throw error;  // Propagate error
  }
}

// Caller
try {
  await rethrowExample();
} catch (error) {
  // Error propagated aqui
  console.error("Caught at caller:", error);
}
```

**Re-throw:** Propagate error to caller.

#### Async Finally

```typescript
// Finally pode ter await (async cleanup)

async function asyncFinally(): Promise<void> {
  const resource = await acquireResource();
  
  try {
    await useResource(resource);
  } catch (error) {
    console.error("Operation failed:", error);
  } finally {
    // Async cleanup em finally
    await resource.release();
    console.log("Resource released");
  }
}

// Finally pode ser async
```

**Async Finally:** Await in finally block.

### Nested Try/Catch

```typescript
// Try/catch aninhados

async function nestedTryCatch(): Promise<void> {
  try {
    console.log("Outer try");
    
    try {
      console.log("Inner try");
      await innerRiskyOperation();
    } catch (innerError) {
      console.error("Inner catch:", innerError);
      // Inner error handled aqui
    }
    
    await outerRiskyOperation();
  } catch (outerError) {
    console.error("Outer catch:", outerError);
    // Outer errors (não inner) handled aqui
  }
}

// Inner catch intercepta erros antes outer
```

**Nested:** Inner catch overrides outer.

### Real-World Example - Database Transaction

```typescript
// Real-world - database transaction com error handling

interface DatabaseConnection {
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  close(): Promise<void>;
}

async function performTransaction(
  connection: DatabaseConnection,
  userId: number,
  amount: number
): Promise<void> {
  await connection.beginTransaction();
  
  try {
    // Step 1: Debit from user
    await connection.execute(
      'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
      [amount, userId]
    );
    
    // Step 2: Credit to destination
    await connection.execute(
      'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
      [amount, 999]
    );
    
    // Step 3: Log transaction
    await connection.execute(
      'INSERT INTO transactions (user_id, amount) VALUES (?, ?)',
      [userId, amount]
    );
    
    // Success - commit
    await connection.commit();
    console.log("Transaction committed");
  } catch (error) {
    // Error - rollback
    console.error("Transaction failed, rolling back:", error);
    await connection.rollback();
    throw error;  // Re-throw para caller
  } finally {
    // Cleanup - always close connection
    await connection.close();
    console.log("Connection closed");
  }
}

// Usage
try {
  await performTransaction(db, 123, 100);
} catch (error) {
  console.error("Failed to perform transaction:", error);
}
```

**Real-World:** Database transaction with rollback.

#### Modelo Mental para Compreensão

Pense em try/catch/finally como **safety net**:

**Try (trapeze act):** Risky operation
**Catch (safety net):** Catches falls
**Finally (cleanup crew):** Always runs
**Throw (fall):** Error occurs
**Re-throw (bounce):** Pass error up

**Analogia - Restaurant Kitchen:**

**Try (cooking):** Prepare dish
**Catch (spill):** Handle accidents
**Finally (cleaning):** Clean station regardless
**Success:** Dish served
**Error:** Spill handled, re-cook or abort

**Metáfora - Parachute Jump:**

**Try (jump):** Attempt jump
**Catch (reserve chute):** Backup if main fails
**Finally (land):** Always land eventually
**Success:** Main chute opens
**Error:** Use reserve

**Fluxo visual:**
```
Try/Catch/Finally Flow:

try {
  await step1();  ← If error, jump to catch
  await step2();  ← If error, jump to catch
  await step3();  ← If error, jump to catch
}
catch (error) {
  handle(error);  ← Error handling
  throw error;    ← Optional re-throw
}
finally {
  cleanup();      ← ALWAYS executes
}
```

## 🔍 Análise Conceitual Profunda

### Error Filtering

```typescript
// Catch específico por tipo de erro

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function errorFiltering(): Promise<void> {
  try {
    await riskyOperation();
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error("Network issue - retry?");
      // Handle network errors
    } else if (error instanceof ValidationError) {
      console.error("Invalid data:", error.message);
      // Handle validation errors
    } else {
      console.error("Unknown error:", error);
      throw error;  // Re-throw unknown errors
    }
  }
}

// Filter errors por tipo
```

**Filtering:** instanceof checks for error types.

#### Try Without Catch

```typescript
// Try/finally sem catch - cleanup garantido mas error propaga

async function tryFinally(): Promise<void> {
  const resource = await acquireResource();
  
  try {
    await useResource(resource);
  } finally {
    // Cleanup happens even if error
    await resource.release();
  }
  
  // Se error em useResource, propaga APÓS finally
}

// Usage
try {
  await tryFinally();
} catch (error) {
  // Error propagated aqui
  console.error("Operation failed:", error);
}
```

**No Catch:** Finally executes, error propagates.

### Error Recovery

```typescript
// Tentar recover de erros

async function errorRecovery(): Promise<Data> {
  try {
    return await fetchPrimarySource();
  } catch (primaryError) {
    console.warn("Primary source failed, trying backup");
    
    try {
      return await fetchBackupSource();
    } catch (backupError) {
      console.error("Both sources failed");
      throw new Error("All sources unavailable");
    }
  }
}

// Fallback em caso de erro
```

**Recovery:** Fallback on error.

#### Error Context

```typescript
// Adicionar context a erros

async function addErrorContext(userId: number): Promise<User> {
  try {
    const user = await fetchUser(userId);
    return user;
  } catch (error) {
    // Enrich error com context
    const contextError = new Error(
      `Failed to fetch user ${userId}: ${error.message}`
    );
    contextError.cause = error;  // Original error
    throw contextError;
  }
}

// Error wrapping com context
```

**Context:** Add context to errors.

### Finally with Return

```typescript
// Finally executa ANTES de return

async function finallyBeforeReturn(): Promise<number> {
  try {
    console.log("Try");
    return 42;  // Return value scheduled
  } finally {
    console.log("Finally");  // Executes BEFORE return
  }
}

await finallyBeforeReturn();

/*
Output:
Try
Finally
Return: 42

Finally executa antes de return value!
*/
```

**Return:** Finally runs before return.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
async function fetchUserSafe(id: number): Promise<User | null> {
  try {
    return await fetchUser(id);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
```

**Raciocínio:** Graceful error handling.

### Resource Cleanup

```typescript
async function processFile(path: string): Promise<void> {
  const file = await open(path);
  try {
    await processData(file);
  } finally {
    await file.close();
  }
}
```

**Raciocínio:** Guarantee resource cleanup.

### Transaction Rollback

```typescript
async function transaction(): Promise<void> {
  await db.begin();
  try {
    await db.query1();
    await db.query2();
    await db.commit();
  } catch {
    await db.rollback();
    throw;
  }
}
```

**Raciocínio:** Rollback on error.

## ⚠️ Limitações e Considerações Teóricas

### Catch All Errors

```typescript
// Catch captura TODOS erros, não apenas Promise rejections

async function catchesAll(): Promise<void> {
  try {
    const result = await fetchData();
    
    // Synchronous error TAMBÉM capturado
    throw new Error("Sync error");
  } catch (error) {
    // Captura sync E async errors
    console.error(error);
  }
}
```

**Consideração:** Catch handles all errors.

### Finally Cannot Suppress Errors

```typescript
// Finally não pode suprimir erros (não tem return handling)

async function finallyNoSuppress(): Promise<void> {
  try {
    throw new Error("Error!");
  } finally {
    // Finally executa mas error ainda propaga
    console.log("Cleanup");
  }
  
  // Error propaga daqui
}
```

**Limitação:** Finally can't suppress errors.

### Nested Try Complexity

```typescript
// Try/catch aninhados podem ficar complexos

async function tooNested(): Promise<void> {
  try {
    try {
      try {
        await operation();
      } catch (innerError) {
        // Handle inner
      }
    } catch (middleError) {
      // Handle middle
    }
  } catch (outerError) {
    // Handle outer
  }
}

// Evitar nesting excessivo
```

**Consideração:** Avoid excessive nesting.

## 🔗 Interconexões Conceituais

**Relação com Async/Await:** Enables sync-style error handling.

**Relação com Promises:** Catch handles Promise.reject.

**Relação com Error Types:** instanceof checks.

**Relação com Finally:** Cleanup guarantee.

**Relação com Throw:** Error propagation.

## 🚀 Evolução e Próximos Conceitos

Dominar Try/Catch prepara para:
- **Error handling patterns:** Advanced patterns
- **Custom errors:** Error class hierarchies
- **Error recovery:** Retry mechanisms
- **Testing:** Error scenario testing
- **Logging:** Error tracking
- **Monitoring:** Error monitoring
