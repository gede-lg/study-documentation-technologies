# Custom Error Classes: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Custom error classes** são **classes JavaScript especializadas** que estendem `Error` (ou subclasses), **encapsulando contexto específico** de domínio e permitindo **error handling diferenciado** via `instanceof`. Conceitualmente, custom errors transformam errors genéricos (`Error`, `TypeError`) em **tipos semânticos** (HTTPError, ValidationError, AuthError), facilitando **catch seletivo**, **logging estruturado** e **mensagens user-friendly**.

Custom errors são **fundamentais para aplicações escaláveis**: ao invés de checar `error.message` (frágil, dependente de string), código verifica **tipo do erro** (`error instanceof ValidationError`), permitindo **recovery strategies específicas** (retry em NetworkError, mostrar form em ValidationError, redirect em AuthError).

```javascript
// Erro genérico (sem contexto)
throw new Error('Request failed');

// ❓ Qual tipo de falha? Network? HTTP? Validação?
// Código consumidor não consegue diferenciar

// Custom error (contexto rico)
throw new HTTPError(404, 'Usuário não encontrado', { userId: 123 });

// ✅ Tipo claro, metadata estruturada
// Código pode tratar especificamente:
if (error instanceof HTTPError && error.status === 404) {
  showNotFoundPage();
} else if (error instanceof ValidationError) {
  showValidationErrors(error.errors);
}
```

### Contexto Histórico e Motivação

**Evolução de Error Handling em JavaScript:**

1. **ES3 (1999)**: `Error` object básico, sem subclassing robusto
2. **ES5 (2009)**: `Object.create()` permite herança, mas sintaxe complexa
3. **ES6 (2015)**: `class` syntax simplifica error subclassing
4. **Modern (2020+)**: Error causes (`new Error('msg', { cause: originalError })`)

**Motivação para Custom Errors:**

JavaScript `Error` é **genérico demais** para aplicações reais:

```javascript
// Antigo - apenas Error genérico
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
} catch (error) {
  // ❓ Network error ou HTTP error?
  // Apenas mensagem para diferenciar (frágil)
  if (error.message.includes('HTTP')) {
    // HTTP error
  } else {
    // Network error?
  }
}

// Moderno - custom errors
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new HTTPError(response.status, 'Request failed');
  }
} catch (error) {
  // ✅ Diferenciação robusta via instanceof
  if (error instanceof HTTPError) {
    console.log(`HTTP error: ${error.status}`);
  } else if (error instanceof NetworkError) {
    console.log('Network failure');
  }
}
```

### Problema Fundamental que Resolve

Custom errors resolvem problemas específicos de error handling:

**1. Type Safety**: `instanceof` checks ao invés de string matching
**2. Structured Data**: Propriedades específicas (status, errors, retryAfter)
**3. Error Hierarchy**: Hierarquia de classes (HTTPError → ClientError → ValidationError)
**4. Selective Catching**: Catch apenas tipos específicos
**5. Better Logging**: Stack traces customizados, metadata estruturada

### Importância no Ecossistema

Custom errors são **essenciais para código maintainable**:

- **API Clients**: HTTPError, NetworkError, TimeoutError
- **Validation**: ValidationError com field-level errors
- **Authentication**: AuthError, PermissionError
- **Business Logic**: DomainError subclasses
- **Framework Integration**: Integrar com error boundaries (React)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Class Inheritance**: Estender `Error` com `class MyError extends Error`
2. **Constructor Pattern**: Chamar `super()`, definir propriedades
3. **Stack Traces**: Preservar stack via `Error.captureStackTrace()`
4. **instanceof Checks**: Type checking robusto
5. **Error Hierarchy**: Hierarquias (NetworkError → TimeoutError)

### Pilares Fundamentais

- **Base Error Class**: `Error` built-in como foundation
- **Specialized Classes**: HTTPError, ValidationError, etc.
- **Metadata Properties**: status, errors, context
- **Error Causes**: `{ cause }` para error chaining
- **Custom Methods**: toJSON(), getUserMessage(), etc.

### Visão Geral das Nuances

- Sempre chamar `super()` no constructor
- Definir `this.name = 'ClassName'` para stack traces
- `Error.captureStackTrace()` remove constructor do stack (Node.js)
- `instanceof` funciona com hierarquias (ValidationError instanceof Error)
- Serialização JSON requer método custom (`toJSON()`)

---

## 🧠 Fundamentos Teóricos

### Pattern Base: Estendendo Error

```javascript
class CustomError extends Error {
  constructor(message) {
    super(message);
    
    // Nome do erro (aparece em stack traces)
    this.name = this.constructor.name;
    
    // Capturar stack trace (remove constructor do stack)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Uso
throw new CustomError('Algo deu errado');

// Stack trace:
// CustomError: Algo deu errado
//   at myFunction (file.js:10:11)
//   at ...
```

**Componentes Essenciais:**

1. **super(message)**: Chama constructor de Error (define message, stack)
2. **this.name**: Nome do erro (para identificação em logs)
3. **Error.captureStackTrace()**: Remove constructor do stack trace (Node.js only)

### HTTPError - Erro HTTP com Status

```javascript
class HTTPError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'HTTPError';
    this.status = status;
    this.data = data;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Helper - verificar se é client error
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }
  
  // Helper - verificar se é server error
  isServerError() {
    return this.status >= 500 && this.status < 600;
  }
  
  // Serialização JSON
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      data: this.data
    };
  }
}

// Uso
try {
  const response = await fetch('/api/usuario/999');
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HTTPError(
      response.status,
      `Request failed: ${response.status}`,
      errorData
    );
  }
  
} catch (error) {
  if (error instanceof HTTPError) {
    console.log(`Status: ${error.status}`);
    console.log(`Data:`, error.data);
    
    if (error.isClientError()) {
      console.log('Client-side issue');
    }
  }
}
```

### ValidationError - Erros de Validação

```javascript
class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    
    // Mapa de erros por campo
    // { email: "Email inválido", nome: "Campo obrigatório" }
    this.errors = errors;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Verificar se campo específico tem erro
  hasFieldError(field) {
    return field in this.errors;
  }
  
  // Obter erro de campo específico
  getFieldError(field) {
    return this.errors[field] || null;
  }
  
  // Obter todos campos com erro
  getFields() {
    return Object.keys(this.errors);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors
    };
  }
}

// Uso
async function criarUsuario(dados) {
  const errors = {};
  
  if (!dados.nome) {
    errors.nome = 'Nome é obrigatório';
  }
  
  if (!dados.email || !dados.email.includes('@')) {
    errors.email = 'Email inválido';
  }
  
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validação falhou', errors);
  }
  
  // Processar...
}

// Handling
try {
  await criarUsuario({ nome: '', email: 'invalido' });
  
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Campos com erro:', error.getFields()); // ['nome', 'email']
    
    // Mostrar erros no formulário
    for (const [field, message] of Object.entries(error.errors)) {
      showFieldError(field, message);
    }
  }
}
```

### NetworkError - Erros de Rede

```javascript
class NetworkError extends Error {
  constructor(message, url = null, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.url = url;
    this.originalError = originalError;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Verificar se é offline
  isOffline() {
    return !navigator.onLine;
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      url: this.url,
      offline: this.isOffline()
    };
  }
}

// Uso
async function fetchComNetworkError(url) {
  try {
    return await fetch(url);
  } catch (error) {
    // TypeError: Failed to fetch
    throw new NetworkError(
      'Network request failed',
      url,
      error
    );
  }
}

// Handling
try {
  await fetchComNetworkError('/api/dados');
  
} catch (error) {
  if (error instanceof NetworkError) {
    if (error.isOffline()) {
      console.log('Usuário está offline');
    } else {
      console.log('Falha de rede:', error.url);
    }
  }
}
```

### TimeoutError - Timeout de Requisição

```javascript
class TimeoutError extends Error {
  constructor(message, timeoutMs, url = null) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeoutMs;
    this.url = url;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      timeout: this.timeout,
      url: this.url
    };
  }
}

// Uso
async function fetchComTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new TimeoutError(
        `Request timeout após ${timeoutMs}ms`,
        timeoutMs,
        url
      );
    }
    
    throw error;
  }
}

// Handling
try {
  await fetchComTimeout('/api/dados-lentos', 3000);
  
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log(`Timeout: ${error.timeout}ms`);
    
    // Retry com timeout maior
    await fetchComTimeout(error.url, error.timeout * 2);
  }
}
```

### AuthError - Erros de Autenticação

```javascript
class AuthError extends Error {
  constructor(message, type = 'UNKNOWN') {
    super(message);
    this.name = 'AuthError';
    
    // Tipos: TOKEN_EXPIRED, INVALID_CREDENTIALS, UNAUTHORIZED
    this.type = type;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  requiresLogin() {
    return this.type === 'TOKEN_EXPIRED' || 
           this.type === 'UNAUTHORIZED';
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type
    };
  }
}

// Uso
async function fetchComAuth(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({}));
    
    // Determinar tipo de auth error
    let type = 'UNAUTHORIZED';
    if (errorData.code === 'TOKEN_EXPIRED') {
      type = 'TOKEN_EXPIRED';
    }
    
    throw new AuthError('Authentication failed', type);
  }
  
  return response;
}

// Handling
try {
  await fetchComAuth('/api/perfil', getToken());
  
} catch (error) {
  if (error instanceof AuthError) {
    if (error.requiresLogin()) {
      // Redirecionar para login
      redirectToLogin();
    } else {
      console.error('Auth error:', error.type);
    }
  }
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Error Hierarchy

```javascript
// Base error class
class AppError extends Error {
  constructor(message, code = 'UNKNOWN') {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

// HTTP errors
class HTTPError extends AppError {
  constructor(status, message, data = null) {
    super(message, `HTTP_${status}`);
    this.name = 'HTTPError';
    this.status = status;
    this.data = data;
  }
  
  toJSON() {
    return {
      ...super.toJSON(),
      status: this.status,
      data: this.data
    };
  }
}

// Client errors (4xx)
class ClientError extends HTTPError {
  constructor(status, message, data = null) {
    super(status, message, data);
    this.name = 'ClientError';
  }
}

// Specific client errors
class ValidationError extends ClientError {
  constructor(message, errors = {}) {
    super(422, message, errors);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

class NotFoundError extends ClientError {
  constructor(resource, id = null) {
    super(404, `${resource} não encontrado`, { id });
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

class UnauthorizedError extends ClientError {
  constructor(message = 'Não autenticado') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

// Server errors (5xx)
class ServerError extends HTTPError {
  constructor(status, message, data = null) {
    super(status, message, data);
    this.name = 'ServerError';
  }
}

// Usage - catching by hierarchy
try {
  await apiCall();
  
} catch (error) {
  if (error instanceof ValidationError) {
    // Mais específico
    handleValidationErrors(error.errors);
    
  } else if (error instanceof ClientError) {
    // Categoria - outros 4xx
    handleClientError(error);
    
  } else if (error instanceof ServerError) {
    // Categoria - 5xx
    handleServerError(error);
    
  } else if (error instanceof HTTPError) {
    // Base HTTP - qualquer HTTP error
    handleHTTPError(error);
    
  } else if (error instanceof AppError) {
    // Base App - qualquer app error
    handleAppError(error);
    
  } else {
    // Unknown error
    handleUnknownError(error);
  }
}
```

### Pattern 2: Error Factory

```javascript
class ErrorFactory {
  static createFromResponse(response, errorData = {}) {
    const { status } = response;
    
    // Success - não é erro
    if (response.ok) {
      return null;
    }
    
    // Client errors (4xx)
    if (status === 400) {
      return new ValidationError(
        errorData.message || 'Dados inválidos',
        errorData.errors || {}
      );
    }
    
    if (status === 401) {
      return new UnauthorizedError(errorData.message);
    }
    
    if (status === 403) {
      return new PermissionError(errorData.message || 'Sem permissão');
    }
    
    if (status === 404) {
      return new NotFoundError(
        errorData.resource || 'Recurso',
        errorData.id
      );
    }
    
    if (status === 409) {
      return new ConflictError(
        errorData.message || 'Conflito',
        errorData.field
      );
    }
    
    if (status === 422) {
      return new ValidationError(
        errorData.message || 'Validação falhou',
        errorData.errors || {}
      );
    }
    
    if (status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After'), 10) || 60;
      return new RateLimitError(
        errorData.message || 'Muitas requisições',
        retryAfter
      );
    }
    
    // Server errors (5xx)
    if (status >= 500) {
      return new ServerError(
        status,
        errorData.message || 'Erro no servidor'
      );
    }
    
    // Unknown
    return new HTTPError(status, `HTTP ${status}`, errorData);
  }
  
  static createFromNetworkError(error, url) {
    if (error.name === 'AbortError') {
      return new TimeoutError('Request timeout', 0, url);
    }
    
    return new NetworkError('Network failure', url, error);
  }
}

// Uso
async function fetchComFactory(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = ErrorFactory.createFromResponse(response, errorData);
      throw error;
    }
    
    return response;
    
  } catch (error) {
    // Network error
    if (error instanceof TypeError) {
      throw ErrorFactory.createFromNetworkError(error, url);
    }
    
    // Re-throw custom errors
    throw error;
  }
}

// Handling - errors já tipados
try {
  await fetchComFactory('/api/usuario/123');
  
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log(`${error.resource} #${error.data.id} não encontrado`);
  } else if (error instanceof ValidationError) {
    console.log('Erros:', error.errors);
  }
}
```

### Pattern 3: Error Wrapping (Causes)

```javascript
class OperationError extends Error {
  constructor(operation, message, cause = null) {
    super(message);
    this.name = 'OperationError';
    this.operation = operation;
    this.cause = cause; // Original error
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Recursivamente obter root cause
  getRootCause() {
    let error = this;
    while (error.cause) {
      error = error.cause;
    }
    return error;
  }
  
  // Full error chain
  getErrorChain() {
    const chain = [this];
    let error = this;
    
    while (error.cause) {
      error = error.cause;
      chain.push(error);
    }
    
    return chain;
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      operation: this.operation,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message
      } : null
    };
  }
}

// Uso - wrapping errors
async function buscarUsuario(id) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    
    if (!response.ok) {
      throw new HTTPError(response.status, 'HTTP error');
    }
    
    return await response.json();
    
  } catch (error) {
    // Wrap error original com contexto
    throw new OperationError(
      'buscarUsuario',
      `Falha ao buscar usuário ${id}`,
      error // Cause
    );
  }
}

async function carregarPerfil(userId) {
  try {
    const usuario = await buscarUsuario(userId);
    // ...
    
  } catch (error) {
    throw new OperationError(
      'carregarPerfil',
      'Falha ao carregar perfil',
      error
    );
  }
}

// Handling - error chain
try {
  await carregarPerfil(123);
  
} catch (error) {
  console.error('Error chain:');
  
  for (const err of error.getErrorChain()) {
    console.log(`- ${err.name}: ${err.message}`);
  }
  
  // Output:
  // - OperationError: Falha ao carregar perfil
  // - OperationError: Falha ao buscar usuário 123
  // - HTTPError: HTTP error
  
  const rootCause = error.getRootCause();
  console.log('Root cause:', rootCause.name);
}
```

### Pattern 4: Error Context Enhancement

```javascript
class ContextualError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'ContextualError';
    this.context = {
      ...context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  addContext(key, value) {
    this.context[key] = value;
    return this;
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      context: this.context,
      stack: this.stack
    };
  }
}

// Uso - rich context
async function processarPagamento(orderId, valor) {
  try {
    // ... lógica
    throw new Error('Pagamento recusado');
    
  } catch (error) {
    const contextualError = new ContextualError(
      'Falha ao processar pagamento',
      {
        orderId,
        valor,
        userId: getCurrentUserId(),
        paymentMethod: 'credit_card'
      }
    );
    
    // Log com contexto rico
    console.error(contextualError.toJSON());
    
    throw contextualError;
  }
}
```

### Pattern 5: Retryable Errors

```javascript
class RetryableError extends Error {
  constructor(message, maxRetries = 3, retryDelay = 1000) {
    super(message);
    this.name = 'RetryableError';
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
    this.attemptsMade = 0;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  canRetry() {
    return this.attemptsMade < this.maxRetries;
  }
  
  incrementAttempts() {
    this.attemptsMade++;
  }
  
  getNextDelay() {
    // Exponential backoff
    return this.retryDelay * Math.pow(2, this.attemptsMade);
  }
}

// Uso
async function fetchComRetry(url) {
  let lastError;
  
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch(url);
      
    } catch (error) {
      lastError = new RetryableError(
        'Request failed',
        3,
        1000
      );
      lastError.attemptsMade = i + 1;
      
      if (lastError.canRetry()) {
        const delay = lastError.getNextDelay();
        console.log(`Retry ${i + 1} em ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw lastError;
    }
  }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Error Classes por Domínio

#### API Client
- HTTPError, NetworkError, TimeoutError
- ClientError (4xx), ServerError (5xx)
- ValidationError, AuthError

#### Form Validation
- ValidationError com field-level errors
- FormatError, RequiredFieldError

#### Business Logic
- DomainError subclasses
- InsufficientBalanceError, DuplicateError

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. JSON Serialization**: Errors não serializam automaticamente (requer toJSON())
**2. Browser Differences**: Error.captureStackTrace() apenas Node.js
**3. Stack Traces**: Podem vazar informação sensível (sanitizar em prod)
**4. Inheritance Complexity**: Hierarquias profundas podem complicar

### Armadilhas Comuns

#### Armadilha 1: Esquecer super()

```javascript
// ❌ ERRO - sem super()
class MyError extends Error {
  constructor(message) {
    this.message = message; // Não funciona
  }
}

// ✅ CORRETO
class MyError extends Error {
  constructor(message) {
    super(message); // Essencial
    this.name = 'MyError';
  }
}
```

#### Armadilha 2: Não Definir this.name

```javascript
// ❌ Stack trace genérico
class MyError extends Error {
  constructor(message) {
    super(message);
    // Sem this.name
  }
}
// Stack: Error: message (não MyError)

// ✅ Stack trace claro
class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MyError';
  }
}
// Stack: MyError: message
```

---

## 🔗 Interconexões Conceituais

### Relação com Promises

Custom errors propagam via Promise rejection:
```javascript
Promise.reject(new ValidationError('Invalid'));
```

### Relação com Async/Await

Try/catch captura custom errors:
```javascript
try {
  await fetch();
} catch (error) {
  if (error instanceof HTTPError) { }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar custom errors:
1. **Error Monitoring**: Integração com Sentry
2. **Error Boundaries**: React error boundaries
3. **Error Serialization**: JSON/logging
4. **Error Recovery**: Automatic retry, fallbacks

---

## 📚 Conclusão

Custom error classes são **fundamentais para error handling robusto**.

Dominar custom errors significa:
- **Criar hierarquias** apropriadas (HTTPError → ClientError → ValidationError)
- **Adicionar metadata** relevante (status, errors, context)
- **Usar instanceof** para type checking
- **Implementar toJSON()** para serialization
- **Wrapping errors** para preservar causas

É a base para error handling type-safe e maintainable.
