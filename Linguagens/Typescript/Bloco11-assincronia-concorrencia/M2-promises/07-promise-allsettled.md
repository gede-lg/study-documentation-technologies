# Promise.allSettled()

## 🎯 Introdução e Definição

### Definição Conceitual

**Promise.allSettled()** é **método estático que aguarda todas Promises completarem** (settled), **independente de sucesso ou erro**, retornando **array com status e valor/reason de cada Promise**. Diferentemente de Promise.all() (fail-fast - rejeita na primeira falha), allSettled() **nunca rejeita** - sempre resolve com array de resultados. Cada resultado é **objeto com `status`** ('fulfilled' ou 'rejected') e **`value`** (se fulfilled) ou **`reason`** (se rejected).

Conceitualmente, implementa **complete observation pattern** - observar conclusão de todas operações sem short-circuit. Segue **no-fail semantics** - nenhuma Promise individual causa falha total. TypeScript infere **discriminated union** - `PromiseSettledResult<T>` pode ser `PromiseFulfilledResult<T>` ou `PromiseRejectedResult`. Útil para **batch operations**, **error aggregation**, e **partial success scenarios**.

**Fundamento teórico:** Promise.allSettled() deriva de **monadic sequence** - sequenciar operações preservando todos resultados (sucessos e falhas). Implementa **non-failing composition** - composição que nunca falha completamente. Suporta **complete error reporting** - coletar todos erros, não apenas primeiro. É **deterministic** - sempre retorna mesmo número de resultados que input Promises.

**Pattern básico:**
```typescript
// Promise.allSettled() - aguarda todas completarem

const p1 = Promise.resolve(42);
const p2 = Promise.reject(new Error("Failed"));
const p3 = Promise.resolve("Success");

Promise.allSettled([p1, p2, p3]).then(results => {
  console.log(results);
  /*
  [
    { status: 'fulfilled', value: 42 },
    { status: 'rejected', reason: Error: Failed },
    { status: 'fulfilled', value: 'Success' }
  ]
  */
});

// Sempre resolve - nunca rejeita
// Retorna todos resultados, sucessos e falhas
```

**Comparação Promise.all() vs allSettled():**
```typescript
// Promise.all() - fail-fast ❌

Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error("Error")),
  Promise.resolve(3)
]).then(results => {
  console.log(results);  // ✗ Nunca executado
}).catch(error => {
  console.error(error);  // "Error"
  // Perdemos results de p1 e p3
});

// Promise.allSettled() - collect all ✅

Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error("Error")),
  Promise.resolve(3)
]).then(results => {
  console.log(results);
  /*
  [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: Error },
    { status: 'fulfilled', value: 3 }
  ]
  */
  
  // Temos TODOS resultados - sucessos e falhas
});
```

**Type structure:**
```typescript
// PromiseSettledResult - discriminated union

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

interface PromiseRejectedResult {
  status: 'rejected';
  reason: any;
}

// Usar type guards
Promise.allSettled([p1, p2, p3]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log("Success:", result.value);  // Type-safe
    } else {
      console.error("Error:", result.reason);  // Type-safe
    }
  });
});
```

### Contexto Histórico e Evolução

**ES2020:** Promise.allSettled() introduzido.

```javascript
// ES2020 - allSettled() adicionado
Promise.allSettled([p1, p2, p3])
  .then(results => {
    // Todos resultados disponíveis
  });

// Antes - simular com Promise.all() + wrappers
Promise.all([
  p1.then(v => ({ status: 'fulfilled', value: v }))
    .catch(e => ({ status: 'rejected', reason: e })),
  p2.then(v => ({ status: 'fulfilled', value: v }))
    .catch(e => ({ status: 'rejected', reason: e }))
]);
```

**TypeScript 3.8 (2020):** allSettled() types.

```typescript
// TypeScript 3.8 - typed allSettled()
Promise.allSettled([
  Promise.resolve(42),
  Promise.reject(new Error("Failed"))
]).then((results: PromiseSettledResult<number | never>[]) => {
  // Type-safe results
});
```

**TypeScript 4.0 (2020):** Better union inference.

```typescript
// TypeScript 4.0 - discriminated unions
Promise.allSettled([
  Promise.resolve(42),        // number
  Promise.resolve("hello"),   // string
  Promise.reject(new Error())
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      // result.value: number | string
    }
  });
});
```

**TypeScript 4.5 (2021):** Awaited utility.

```typescript
// TypeScript 4.5 - Awaited<T>
type Results = Awaited<ReturnType<typeof Promise.allSettled<[Promise<number>, Promise<string>]>>>;
// PromiseSettledResult<number | string>[]
```

**Antes (manual workaround):**
```typescript
// Pré-ES2020 - simular allSettled() manualmente ❌

function allSettledPolyfill<T>(promises: Promise<T>[]): Promise<PromiseSettledResult<T>[]> {
  return Promise.all(
    promises.map(promise =>
      promise
        .then(value => ({ status: 'fulfilled' as const, value }))
        .catch(reason => ({ status: 'rejected' as const, reason }))
    )
  );
}

// Verboso, propenso a erros
```

**Depois (nativo):**
```typescript
// ES2020 - nativo, conciso ✅

Promise.allSettled(promises).then(results => {
  // All results
});
```

### Problema Fundamental que Resolve

Promise.allSettled() resolve problemas de **partial failures**, **error aggregation**, **batch processing**, e **complete reporting**.

**Problema 1: Lose Successful Results on Any Error**
```typescript
// Promise.all() - perde sucessos quando qualquer falha ❌

async function processMultipleFiles(files: string[]): Promise<void> {
  try {
    const results = await Promise.all(
      files.map(file => processFile(file))
    );
    
    console.log("All processed:", results);
  } catch (error) {
    console.error("One file failed:", error);
    // ✗ Perdemos resultados de arquivos que processaram com sucesso
  }
}

// Se 1 de 100 arquivos falha → perdemos 99 sucessos
```

**Solução: allSettled() preserva todos resultados**
```typescript
// Promise.allSettled() - preserva sucessos ✅

async function processMultipleFiles(files: string[]): Promise<void> {
  const results = await Promise.allSettled(
    files.map(file => processFile(file))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  console.log(`Processed: ${successful.length}/${files.length}`);
  console.log(`Failed: ${failed.length}`);
  
  // Temos TODOS resultados - sucessos e falhas
  successful.forEach(result => {
    console.log("Success:", result.value);
  });
  
  failed.forEach(result => {
    console.error("Error:", result.reason);
  });
}

// Se 1 de 100 falha → temos 99 sucessos + 1 erro
```

**Problema 2: Cannot Collect All Errors**
```typescript
// Promise.all() - apenas primeiro erro ❌

async function validateMultipleInputs(inputs: Input[]): Promise<void> {
  try {
    await Promise.all(
      inputs.map(input => validateInput(input))
    );
  } catch (error) {
    console.error("Validation error:", error);
    // ✗ Apenas primeiro erro - não sabemos outros problemas
  }
}

// Usuário vê apenas primeiro erro
// Precisa corrigir, resubmit, ver próximo erro (frustrante)
```

**Solução: allSettled() coleta todos erros**
```typescript
// Promise.allSettled() - todos erros ✅

async function validateMultipleInputs(inputs: Input[]): Promise<ValidationResult> {
  const results = await Promise.allSettled(
    inputs.map(input => validateInput(input))
  );
  
  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason);
  
  if (errors.length > 0) {
    return {
      valid: false,
      errors  // TODOS erros coletados
    };
  }
  
  return { valid: true, errors: [] };
}

// Usuário vê TODOS erros de uma vez
// Corrige todos, resubmit (melhor UX)
```

**Problema 3: Batch Operations with Partial Success**
```typescript
// Promise.all() - sem partial success ❌

async function sendEmailsToUsers(users: User[]): Promise<void> {
  try {
    await Promise.all(
      users.map(user => sendEmail(user.email))
    );
    
    console.log("All emails sent");
  } catch (error) {
    console.error("Email failed:", error);
    // ✗ Não sabemos quantos emails enviaram
    // Não podemos retry apenas falhas
  }
}

// 1 email falha → não sabemos quais enviaram
```

**Solução: allSettled() partial success tracking**
```typescript
// Promise.allSettled() - track partial success ✅

async function sendEmailsToUsers(users: User[]): Promise<EmailReport> {
  const results = await Promise.allSettled(
    users.map(user => sendEmail(user.email))
  );
  
  const sent = results.filter(r => r.status === 'fulfilled');
  const failed = results
    .map((r, index) => ({ result: r, user: users[index] }))
    .filter(({ result }) => result.status === 'rejected');
  
  console.log(`Emails: ${sent.length} sent, ${failed.length} failed`);
  
  // Retry apenas falhas
  if (failed.length > 0) {
    console.log("Retrying failed emails...");
    await retryFailedEmails(failed.map(f => f.user));
  }
  
  return {
    total: users.length,
    sent: sent.length,
    failed: failed.length
  };
}

// Track exato - retry apenas falhas
```

**Problema 4: Testing - Need All Results**
```typescript
// Promise.all() - difícil testar partial failures ❌

test("API endpoints", async () => {
  try {
    const results = await Promise.all([
      testEndpoint('/api/users'),
      testEndpoint('/api/posts'),
      testEndpoint('/api/comments')
    ]);
    
    // Todos passaram
    expect(results).toHaveLength(3);
  } catch (error) {
    // Qual endpoint falhou? Não sabemos os outros
    fail("Some endpoint failed");
  }
});
```

**Solução: allSettled() complete test report**
```typescript
// Promise.allSettled() - complete test report ✅

test("API endpoints", async () => {
  const results = await Promise.allSettled([
    testEndpoint('/api/users'),
    testEndpoint('/api/posts'),
    testEndpoint('/api/comments')
  ]);
  
  const passed = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  console.log(`Tests: ${passed.length} passed, ${failed.length} failed`);
  
  // Report detalhado de TODOS endpoints
  results.forEach((result, index) => {
    const endpoints = ['/api/users', '/api/posts', '/api/comments'];
    
    if (result.status === 'fulfilled') {
      console.log(`✓ ${endpoints[index]}: OK`);
    } else {
      console.error(`✗ ${endpoints[index]}: ${result.reason}`);
    }
  });
  
  // Test ainda pode falhar, mas temos report completo
  expect(failed.length).toBe(0);
});
```

**Fundamento teórico:** Promise.allSettled() implementa **complete observation** - observar todos outcomes sem short-circuit, preservando informação completa.

### Importância no Ecossistema

Promise.allSettled() é importante porque:

- **Partial success:** Processar sucessos mesmo com falhas
- **Error aggregation:** Coletar todos erros
- **Batch operations:** Operações bulk com retry
- **Testing:** Complete test reports
- **User experience:** Mostrar todos problemas de uma vez
- **Reliability:** Não desperdiçar trabalho bem-sucedido
- **Debugging:** Informação completa sobre falhas
- **Reconciliation:** Identificar divergências

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Never rejects:** Sempre resolve com array
2. **All results:** Sucessos e falhas
3. **Status field:** 'fulfilled' ou 'rejected'
4. **Complete observation:** Aguarda todas
5. **Discriminated union:** Type-safe results

### Pilares Fundamentais

- **Input:** Array (iterable) de Promises
- **Output:** `Promise<PromiseSettledResult<T>[]>`
- **Never fails:** Sempre resolve
- **Preserves all:** Todos resultados incluídos
- **Order preserved:** Mesma ordem do input

### Visão Geral das Nuances

- **Empty array:** allSettled([]) → resolve([])
- **Type guards:** `if (result.status === 'fulfilled')`
- **Error collection:** Filtrar rejections
- **Success collection:** Filtrar fulfillments
- **Testing utility:** Complete test results

## 🧠 Fundamentos Teóricos

### Basic Promise.allSettled()

```typescript
// Basic allSettled() - todos resultados

const promises = [
  Promise.resolve(1),
  Promise.reject(new Error("Failed")),
  Promise.resolve(3)
];

Promise.allSettled(promises).then(results => {
  console.log(results);
  /*
  [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: Error: Failed },
    { status: 'fulfilled', value: 3 }
  ]
  */
});
```

**Basic:** Coletar todos resultados.

### Princípios e Conceitos Subjacentes

#### Type Guards - Discriminated Union

```typescript
// Type guards - type-safe access

Promise.allSettled([
  Promise.resolve<number>(42),
  Promise.reject(new Error("Failed")),
  Promise.resolve<string>("Hello")
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      // result: PromiseFulfilledResult<number | string>
      console.log("Success:", result.value);
      // result.value: number | string
    } else {
      // result: PromiseRejectedResult
      console.error("Error:", result.reason);
      // result.reason: any
    }
  });
});
```

**Type Guards:** Safe access com discriminated union.

#### Filter Successes and Failures

```typescript
// Filtrar sucessos e falhas

async function processItems(items: Item[]): Promise<ProcessReport> {
  const results = await Promise.allSettled(
    items.map(item => processItem(item))
  );
  
  // Filtrar sucessos
  const successes = results.filter(
    (r): r is PromiseFulfilledResult<ProcessedItem> => r.status === 'fulfilled'
  );
  
  // Filtrar falhas
  const failures = results.filter(
    (r): r is PromiseRejectedResult => r.status === 'rejected'
  );
  
  return {
    total: items.length,
    succeeded: successes.length,
    failed: failures.length,
    successResults: successes.map(r => r.value),
    errors: failures.map(r => r.reason)
  };
}
```

**Filtering:** Separar sucessos e falhas.

### Retry Failed Operations

```typescript
// Retry apenas operações que falharam

async function processWithRetry<T>(
  operations: (() => Promise<T>)[],
  maxRetries: number = 3
): Promise<T[]> {
  let attempts = 0;
  let currentOps = operations;
  const allResults: T[] = [];
  
  while (attempts < maxRetries && currentOps.length > 0) {
    attempts++;
    console.log(`Attempt ${attempts}, processing ${currentOps.length} operations`);
    
    const results = await Promise.allSettled(
      currentOps.map(op => op())
    );
    
    // Coletar sucessos
    const successes = results
      .map((r, index) => ({ result: r, index }))
      .filter((item): item is { result: PromiseFulfilledResult<T>, index: number } => 
        item.result.status === 'fulfilled'
      );
    
    successes.forEach(({ result }) => {
      allResults.push(result.value);
    });
    
    // Identificar falhas para retry
    const failedIndices = results
      .map((r, index) => ({ result: r, index }))
      .filter(item => item.result.status === 'rejected')
      .map(item => item.index);
    
    // Preparar retry
    currentOps = failedIndices.map(index => currentOps[index]);
    
    if (currentOps.length > 0 && attempts < maxRetries) {
      console.log(`${currentOps.length} operations failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  
  if (currentOps.length > 0) {
    throw new Error(`${currentOps.length} operations failed after ${maxRetries} retries`);
  }
  
  return allResults;
}
```

**Retry:** Retry apenas falhas.

#### Validation - Collect All Errors

```typescript
// Validação - coletar todos erros

interface ValidationError {
  field: string;
  message: string;
}

async function validateForm(form: FormData): Promise<ValidationResult> {
  const validations = [
    validateEmail(form.email),
    validatePassword(form.password),
    validateAge(form.age),
    validatePhone(form.phone)
  ];
  
  const results = await Promise.allSettled(validations);
  
  const errors: ValidationError[] = results
    .map((result, index) => {
      const fields = ['email', 'password', 'age', 'phone'];
      
      if (result.status === 'rejected') {
        return {
          field: fields[index],
          message: result.reason.message
        };
      }
      return null;
    })
    .filter((error): error is ValidationError => error !== null);
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Usar
validateForm(formData).then(result => {
  if (!result.valid) {
    // Mostrar TODOS erros ao usuário
    result.errors.forEach(error => {
      showError(error.field, error.message);
    });
  }
});
```

**Validation:** Complete error reporting.

### Real-World Example - Batch File Upload

```typescript
// Batch file upload com progress tracking

interface UploadResult {
  filename: string;
  status: 'success' | 'failed';
  url?: string;
  error?: string;
}

async function uploadFiles(files: File[]): Promise<UploadResult[]> {
  console.log(`Uploading ${files.length} files...`);
  
  const uploadPromises = files.map(file => 
    uploadFile(file)
      .then(url => ({ filename: file.name, url }))
  );
  
  const results = await Promise.allSettled(uploadPromises);
  
  const uploadResults: UploadResult[] = results.map((result, index) => {
    const filename = files[index].name;
    
    if (result.status === 'fulfilled') {
      return {
        filename,
        status: 'success',
        url: result.value.url
      };
    } else {
      return {
        filename,
        status: 'failed',
        error: result.reason.message
      };
    }
  });
  
  const successful = uploadResults.filter(r => r.status === 'success');
  const failed = uploadResults.filter(r => r.status === 'failed');
  
  console.log(`Upload complete: ${successful.length} succeeded, ${failed.length} failed`);
  
  // Retry failed uploads
  if (failed.length > 0) {
    console.log("Retrying failed uploads...");
    const retryFiles = failed
      .map(result => files.find(f => f.name === result.filename))
      .filter((f): f is File => f !== undefined);
    
    const retryResults = await uploadFiles(retryFiles);
    
    // Merge results
    failed.forEach((failedResult, index) => {
      const retryResult = retryResults[index];
      if (retryResult.status === 'success') {
        const idx = uploadResults.findIndex(r => r.filename === failedResult.filename);
        uploadResults[idx] = retryResult;
      }
    });
  }
  
  return uploadResults;
}

// Usar
uploadFiles(selectedFiles).then(results => {
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✓ ${result.filename}: ${result.url}`);
    } else {
      console.error(`✗ ${result.filename}: ${result.error}`);
    }
  });
});
```

**Real-World:** Batch upload com retry.

#### Modelo Mental para Compreensão

Pense em Promise.allSettled() como **exam results**:

**Students:** Promises individuais
**Take exam:** Executar operações
**All finish:** Aguardar todos completarem
**Pass/Fail:** status fulfilled/rejected
**Report card:** Array com todos resultados
**No one fails class:** Sempre resolve (não rejeita)

**Analogia - Survey Results:**

**Survey questions:** Múltiplas Promises
**Responses:** Alguns respondem, alguns não
**Collect all:** Todas respostas coletadas
**Analysis:** Process sucessos e falhas
**Complete data:** Não descarta parciais

**Metáfora - Quality Control:**

**Batch production:** Múltiplas operações
**Inspect all:** Verificar cada item
**Pass/Fail:** Classificar cada um
**Report:** Lista completa - bons e defeituosos
**Don't stop:** Inspeção completa (não para em primeiro defeito)

**Fluxo visual:**
```
Promise.allSettled([p1, p2, p3])
          ↓
    p1    p2    p3  ← Executam em paralelo
    ✓     ✗     ✓
    ↓     ↓     ↓
Aguarda TODAS completarem
          ↓
[
  {status: 'fulfilled', value: ...},
  {status: 'rejected', reason: ...},
  {status: 'fulfilled', value: ...}
]
```

## 🔍 Análise Conceitual Profunda

### Comparison - all() vs allSettled()

```typescript
// Promise.all() - fail-fast
Promise.all([p1, p2, p3])
  .then(results => {
    // Só executa se TODAS succedem
    // results: [value1, value2, value3]
  })
  .catch(error => {
    // Executa se QUALQUER falha
    // error: primeiro erro
    // Perdemos resultados de sucessos
  });

// Promise.allSettled() - never fails
Promise.allSettled([p1, p2, p3])
  .then(results => {
    // SEMPRE executa
    // results: array com status de cada uma
    // Temos TODOS resultados - sucessos e falhas
  });
  // Nunca .catch() - allSettled() nunca rejeita
```

**Comparison:** Fail-fast vs complete observation.

### Performance Metrics Collection

```typescript
// Coletar performance metrics - alguns podem falhar

interface MetricResult {
  metric: string;
  value?: number;
  error?: string;
  duration: number;
}

async function collectMetrics(): Promise<MetricResult[]> {
  const metricOperations = [
    { name: 'cpu', fn: () => measureCPU() },
    { name: 'memory', fn: () => measureMemory() },
    { name: 'disk', fn: () => measureDisk() },
    { name: 'network', fn: () => measureNetwork() }
  ];
  
  const promises = metricOperations.map(async ({ name, fn }) => {
    const start = Date.now();
    try {
      const value = await fn();
      return {
        metric: name,
        value,
        duration: Date.now() - start
      };
    } catch (error) {
      return Promise.reject({
        metric: name,
        error: error.message,
        duration: Date.now() - start
      });
    }
  });
  
  const results = await Promise.allSettled(promises);
  
  return results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return result.reason;
    }
  });
}

// Coletar todas metrics disponíveis
// Mesmo se algumas falharem
collectMetrics().then(metrics => {
  metrics.forEach(metric => {
    if (metric.value !== undefined) {
      console.log(`${metric.metric}: ${metric.value} (${metric.duration}ms)`);
    } else {
      console.error(`${metric.metric}: ${metric.error} (${metric.duration}ms)`);
    }
  });
});
```

**Metrics:** Partial success acceptable.

#### Migration Pattern - Gradual Rollout

```typescript
// Migration - deploy múltiplas regiões, track sucessos/falhas

interface DeploymentResult {
  region: string;
  status: 'success' | 'failed';
  version?: string;
  error?: string;
}

async function deployToAllRegions(
  version: string,
  regions: string[]
): Promise<DeploymentResult[]> {
  const deployments = regions.map(region =>
    deployToRegion(region, version)
      .then(() => ({ region, version }))
  );
  
  const results = await Promise.allSettled(deployments);
  
  const deploymentResults = results.map((result, index) => {
    const region = regions[index];
    
    if (result.status === 'fulfilled') {
      return {
        region,
        status: 'success' as const,
        version: result.value.version
      };
    } else {
      return {
        region,
        status: 'failed' as const,
        error: result.reason.message
      };
    }
  });
  
  const successful = deploymentResults.filter(r => r.status === 'success');
  const failed = deploymentResults.filter(r => r.status === 'failed');
  
  console.log(`Deployment: ${successful.length}/${regions.length} regions`);
  
  // Se maioria falhou, rollback sucessos
  if (failed.length > successful.length) {
    console.log("Majority failed, rolling back...");
    await rollbackRegions(successful.map(r => r.region));
  }
  
  return deploymentResults;
}
```

**Migration:** Gradual rollout com rollback.

### Empty Array Edge Case

```typescript
// Empty array - resolve imediatamente com []

Promise.allSettled([]).then(results => {
  console.log(results);  // []
  console.log("Empty array resolved immediately");
});

// Útil para casos edge em batch processing
async function processBatch(items: Item[]): Promise<Report> {
  if (items.length === 0) {
    return { processed: 0, failed: 0 };
  }
  
  const results = await Promise.allSettled(
    items.map(item => processItem(item))
  );
  
  // ...
}
```

**Edge Case:** Empty array handling.

## 🎯 Aplicabilidade e Contextos

### Batch Processing

```typescript
Promise.allSettled(
  items.map(item => processItem(item))
).then(results => {
  const succeeded = results.filter(r => r.status === 'fulfilled');
  // Process all available results
});
```

**Raciocínio:** Partial success acceptable.

### Validation - All Errors

```typescript
Promise.allSettled(validations).then(results => {
  const errors = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
  // Show all errors to user
});
```

**Raciocínio:** User needs all feedback.

### Testing - Complete Report

```typescript
Promise.allSettled(tests).then(results => {
  results.forEach((result, i) => {
    console.log(`Test ${i}: ${result.status}`);
  });
});
```

**Raciocínio:** Complete test results.

## ⚠️ Limitações e Considerações Teóricas

### Always Resolves - No Short-Circuit

```typescript
// allSettled() aguarda TODAS - não short-circuit

const slow1 = delay(5000, 1);
const fast = Promise.reject(new Error("Fast fail"));
const slow2 = delay(5000, 3);

Promise.allSettled([slow1, fast, slow2]).then(results => {
  console.log("After 5 seconds");  // Aguarda slow1 e slow2
});

// Mesmo fast falhando imediatamente
// Aguarda slow1 e slow2 completarem (5s)

// Promise.all() rejeitaria imediatamente
```

**Limitação:** Não short-circuit em erro.

### More Memory Overhead

```typescript
// allSettled() guarda TODOS resultados

const promises = Array.from({ length: 10000 }, (_, i) =>
  processLargeData(i)
);

const results = await Promise.allSettled(promises);
// results array com 10000 entries
// Mais memória que Promise.all() (que poderia fail-fast)
```

**Consideração:** Memory com grandes batches.

### Type Complexity

```typescript
// Union types podem ser complexos

Promise.allSettled([
  Promise.resolve<number>(42),
  Promise.resolve<string>("hello"),
  Promise.resolve<boolean>(true)
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      // result.value: number | string | boolean
      // Type guard necessário para disambiguate
    }
  });
});
```

**Consideração:** Type guards para unions.

## 🔗 Interconexões Conceituais

**Relação com Promise.all():** Fail-fast vs complete.

**Relação com Error handling:** Aggregate errors.

**Relação com Batch processing:** Partial success.

**Relação com Testing:** Complete test reports.

**Relação com Retry logic:** Retry apenas falhas.

## 🚀 Evolução e Próximos Conceitos

Dominar Promise.allSettled() prepara para:
- **Error aggregation:** Advanced error collection
- **Batch processing:** Chunking strategies
- **Retry patterns:** Exponential backoff
- **Circuit breakers:** Fault tolerance
- **Monitoring:** Metrics collection
- **Testing frameworks:** Complete test suites
