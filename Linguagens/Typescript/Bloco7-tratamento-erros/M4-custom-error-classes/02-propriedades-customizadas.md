# Propriedades Customizadas em Erros

## 🎯 Introdução e Definição

### Definição Conceitual

**Propriedades customizadas** em custom error classes são **fields adicionais** além das properties padrão de Error (`message`, `name`, `stack`) que armazenam **metadata contextual** específica sobre o erro. Properties customizadas enriquecem erros com informações estruturadas como `field` (campo que falhou), `statusCode` (código HTTP), `userId` (usuário afetado), `query` (SQL que falhou), permitindo **error handling sofisticado** baseado em contexto completo do problema.

Conceitualmente, properties customizadas transformam erros de **mensagens simples** em **objetos ricos de dados** que carregam **contexto estruturado**. Ao invés de apenas saber "que" erro ocorreu (mensagem), aplicação sabe **exatamente** as circunstâncias - quais valores causaram erro, em qual operação, com quais parâmetros. Este contexto permite **targeted error handling**, **detailed logging**, **precise debugging** e **user-friendly error messages**.

TypeScript adiciona **type safety** a properties customizadas através de **class properties** - compilador verifica em compile-time que apenas properties definidas são acessadas. Quando erro é capturado e narrowed com `instanceof`, TypeScript sabe exatamente quais properties existem, prevenindo erros de acessar properties inexistentes.

### Contexto Histórico e Evolução

**JavaScript Early (1990s-2000s):** Error tinha apenas `message` - sem mecanismo para metadata.

**ES5 (2009):** Possível adicionar properties manualmente - mas sem type safety.

**ES6 (2015):** Class syntax simplificou definição de properties.

**TypeScript (2012+):** Type system garante type safety para custom properties.

**Node.js Error Conventions:** Estabeleceu padrões - `code`, `syscall`, `errno` em SystemError.

**HTTP Libraries:** Express, Axios - popularizaram `statusCode`, `status` properties.

**Evolução de práticas:**

**ES5 (manual property assignment):**
```javascript
// ES5 - adicionar properties manualmente
function ValidationError(message, field) {
  this.name = "ValidationError";
  this.message = message;
  this.field = field;  // Property customizada
  this.stack = (new Error()).stack;
}
ValidationError.prototype = Object.create(Error.prototype);

throw new ValidationError("Email inválido", "email");
```

**ES6+ (class properties):**
```javascript
// ES6+ - properties na classe
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;  // Property customizada
  }
}

throw new ValidationError("Email inválido", "email");
```

**TypeScript (type-safe properties):**
```typescript
// TypeScript - type safety completo
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,      // Type-safe
    public value: any          // Type-safe
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Email inválido", "email", "abc");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(e.field);  // ✅ Type-safe - TS sabe que field existe
    console.log(e.value);  // ✅ Type-safe
    // console.log(e.xyz);  // ❌ Error - TS sabe que xyz não existe
  }
}
```

### Problema Fundamental que Resolve

Properties customizadas resolvem o problema de **lack of error context** com apenas `message`.

**Problema: Apenas message - contexto insuficiente**
```typescript
// ❌ Apenas message - sem contexto estruturado
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Campo email é inválido para usuário 123");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(e.message);  // String concatenada
    
    // ❌ Como extrair campo que falhou?
    // ❌ Como obter userId?
    // ❌ Como obter valor inválido?
    // Precisa parse string - frágil!
    
    if (e.message.includes("email")) {
      // Parse string - horrível!
      const field = "email";  // Hardcoded
    }
  }
}
```

**Solução: Custom properties - contexto estruturado**
```typescript
// ✅ Custom properties - contexto rico
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,      // Campo que falhou
    public value: any,         // Valor inválido
    public userId?: number     // Usuário afetado
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError(
    "Email inválido",
    "email",
    "not-an-email",
    123
  );
} catch (e) {
  if (e instanceof ValidationError) {
    // ✅ Acesso type-safe a contexto estruturado
    console.log("Campo:", e.field);     // "email"
    console.log("Valor:", e.value);     // "not-an-email"
    console.log("Usuário:", e.userId);  // 123
    
    // ✅ Pode processar baseado em campo específico
    if (e.field === "email") {
      enviarDicaEmail(e.userId);
    }
    
    // ✅ Log estruturado
    logger.error({
      type: "validation",
      field: e.field,
      value: e.value,
      userId: e.userId,
      message: e.message
    });
  }
}
```

**Fundamento teórico:** Custom properties fornecem **structured context** - dados acessíveis programaticamente, não strings para parse.

### Importância no Ecossistema

Custom properties são cruciais porque:

- **Structured Data:** Contexto como dados estruturados, não strings
- **Type Safety:** TypeScript verifica properties em compile-time
- **Precise Handling:** Decisões baseadas em properties específicas
- **Rich Logging:** Logs estruturados com metadata completa
- **Debugging:** Contexto completo facilita debugging
- **User Feedback:** Mensagens específicas baseadas em properties
- **Error Recovery:** Retry logic baseado em properties

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Property Declaration:** `public field: string` no constructor
2. **Type Safety:** TypeScript verifica tipos das properties
3. **Structured Context:** Metadata como dados, não strings
4. **Instanceof Narrowing:** Type narrowing permite acesso type-safe
5. **Optional Properties:** Properties opcionais com `?`

### Pilares Fundamentais

- **Metadata Storage:** Properties armazenam contexto
- **Type Checking:** Compilador verifica properties
- **Structured Access:** Acesso programático a dados
- **Debugging Aid:** Properties facilitam debugging
- **Logging Enhancement:** Logs estruturados

### Visão Geral das Nuances

- **Public Shorthand:** `public field: string` em constructor parameter
- **Readonly Properties:** `readonly` para properties imutáveis
- **Optional Properties:** `field?: string` para opcionais
- **Complex Types:** Properties podem ser objects, arrays
- **Default Values:** Properties podem ter valores padrão

## 🧠 Fundamentos Teóricos

### Basic Custom Properties

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,      // Property customizada
    public value: any          // Property customizada
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Email inválido", "email", "abc");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(e.field);  // "email" - type-safe
    console.log(e.value);  // "abc"
  }
}
```

**Análise profunda:**

**TypeScript shorthand:** `public field: string` no constructor parameter automaticamente:
1. Declara property `field` na classe
2. Atribui valor do parâmetro à property

**Equivalente verbose:**
```typescript
class ValidationError extends Error {
  public field: string;
  public value: any;
  
  constructor(message: string, field: string, value: any) {
    super(message);
    this.name = "ValidationError";
    this.field = field;   // Atribuição manual
    this.value = value;   // Atribuição manual
  }
}
```

**Fundamento teórico:** TypeScript **shorthand** reduz boilerplate - property declaration + assignment em uma linha.

### Optional Properties

```typescript
class HTTPError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string,
    public method?: string,        // Opcional
    public requestId?: string      // Opcional
  ) {
    super(message);
    this.name = "HTTPError";
  }
}

// Com properties opcionais
throw new HTTPError("Falha", 500, "/api/users", "GET", "req-123");

// Sem properties opcionais
throw new HTTPError("Falha", 500, "/api/users");

// Catch
try {
  fetch();
} catch (e) {
  if (e instanceof HTTPError) {
    console.log(e.statusCode);  // number
    console.log(e.method);      // string | undefined
    
    // Type narrowing para optional
    if (e.method) {
      console.log(e.method.toUpperCase());  // string - narrowed
    }
  }
}
```

**Conceito fundamental:** Optional properties (`?`) permitem **flexibilidade** - nem sempre todo contexto está disponível.

### Princípios e Conceitos Subjacentes

#### Readonly Properties

```typescript
class ImmutableError extends Error {
  constructor(
    message: string,
    public readonly code: string,        // Readonly
    public readonly timestamp: Date      // Readonly
  ) {
    super(message);
    this.name = "ImmutableError";
  }
}

const err = new ImmutableError("Erro", "ERR_001", new Date());

console.log(err.code);      // ✅ Read OK
console.log(err.timestamp); // ✅ Read OK

// err.code = "ERR_002";     // ❌ Error - readonly
// err.timestamp = new Date(); // ❌ Error - readonly
```

**Fundamento teórico:** `readonly` garante **imutabilidade** - properties não podem ser alteradas após construção.

#### Complex Type Properties

```typescript
interface ErrorDetails {
  operation: string;
  parameters: Record<string, any>;
  timestamp: Date;
}

class DetailedError extends Error {
  constructor(
    message: string,
    public details: ErrorDetails,              // Object
    public affectedUsers: number[],            // Array
    public metadata: Map<string, string>       // Map
  ) {
    super(message);
    this.name = "DetailedError";
  }
}

try {
  throw new DetailedError(
    "Operação falhou",
    {
      operation: "updateUsers",
      parameters: { ids: [1, 2, 3], field: "email" },
      timestamp: new Date()
    },
    [1, 2, 3],
    new Map([["requestId", "123"], ["sessionId", "abc"]])
  );
} catch (e) {
  if (e instanceof DetailedError) {
    console.log(e.details.operation);           // "updateUsers"
    console.log(e.affectedUsers.length);        // 3
    console.log(e.metadata.get("requestId"));   // "123"
  }
}
```

**Análise profunda:** Custom properties podem ser **qualquer tipo** - primitivos, objects, arrays, Maps, Sets.

### Properties with Default Values

```typescript
class ConfigurableError extends Error {
  constructor(
    message: string,
    public severity: "low" | "medium" | "high" = "medium",  // Default
    public retryable: boolean = true                         // Default
  ) {
    super(message);
    this.name = "ConfigurableError";
  }
}

// Com defaults
throw new ConfigurableError("Erro");
// severity = "medium", retryable = true

// Overriding defaults
throw new ConfigurableError("Erro crítico", "high", false);

try {
  operacao();
} catch (e) {
  if (e instanceof ConfigurableError) {
    console.log(e.severity);   // "medium" ou custom
    console.log(e.retryable);  // true ou custom
    
    if (e.retryable) {
      retry();
    }
  }
}
```

**Conceito:** Default values permitem **properties opcionais com fallback** - caller não precisa sempre fornecer.

### Computed Properties

```typescript
class TimestampedError extends Error {
  public readonly timestamp: Date;
  
  constructor(message: string, public code: string) {
    super(message);
    this.name = "TimestampedError";
    this.timestamp = new Date();  // Computed no construtor
  }
  
  // Getter - property computada dinamicamente
  get age(): number {
    return Date.now() - this.timestamp.getTime();
  }
  
  get ageInSeconds(): number {
    return Math.floor(this.age / 1000);
  }
}

try {
  throw new TimestampedError("Erro", "ERR_001");
} catch (e) {
  if (e instanceof TimestampedError) {
    console.log(e.timestamp);      // Data/hora do erro
    console.log(e.age);            // Milissegundos desde erro
    console.log(e.ageInSeconds);   // Segundos desde erro
  }
}
```

**Fundamento teórico:** **Getters** criam properties **computadas dinamicamente** - valor calculado quando acessado.

### Modelo Mental para Compreensão

Pense em custom properties como **formulário de diagnóstico**:

**Error sem properties:** "Paciente doente"
**Error com properties:** Formulário completo - "Paciente João, 35 anos, sintomas: febre 39°C, início: ontem, alergias: penicilina"

**Analogia:**
- **message:** Resumo do problema
- **field:** Onde problema ocorreu
- **value:** Valor que causou problema
- **userId:** Quem foi afetado
- **timestamp:** Quando ocorreu

**Metáfora - Acidente de Carro:**
- **message:** "Acidente ocorreu"
- **location:** "Avenida Paulista, km 5"
- **vehicles:** ["Carro A", "Carro B"]
- **severity:** "alta"
- **weather:** "chuva forte"

Properties customizadas são **contexto estruturado** - não apenas "o que" mas "onde", "quando", "quem", "como".

## 🔍 Análise Conceitual Profunda

### HTTP Error with Rich Properties

```typescript
class HTTPError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public url: string,
    public method: string,
    public requestHeaders?: Record<string, string>,
    public responseHeaders?: Record<string, string>,
    public requestBody?: any,
    public responseBody?: any
  ) {
    super(message);
    this.name = "HTTPError";
  }
  
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }
  
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
  
  toString(): string {
    return `${this.method} ${this.url} - ${this.statusCode} ${this.message}`;
  }
}

try {
  throw new HTTPError(
    "Not Found",
    404,
    "/api/users/999",
    "GET",
    { "Authorization": "Bearer token" },
    { "Content-Type": "application/json" },
    null,
    { error: "User not found" }
  );
} catch (e) {
  if (e instanceof HTTPError) {
    console.log(e.toString());           // "GET /api/users/999 - 404 Not Found"
    console.log(e.isClientError);        // true
    console.log(e.requestHeaders);       // Headers
    console.log(e.responseBody?.error);  // "User not found"
    
    // Log estruturado
    logger.error({
      type: "http",
      method: e.method,
      url: e.url,
      status: e.statusCode,
      requestHeaders: e.requestHeaders,
      responseBody: e.responseBody
    });
  }
}
```

**Análise profunda:** HTTPError com **properties ricas** - contexto HTTP completo (headers, body, method, URL).

#### Database Error with Query Context

```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    public query: string,
    public params?: any[],
    public errorCode?: string,
    public affectedRows?: number,
    public databaseName?: string,
    public tableName?: string
  ) {
    super(message);
    this.name = "DatabaseError";
  }
  
  get isConstraintViolation(): boolean {
    return this.errorCode?.includes("CONSTRAINT") ?? false;
  }
  
  get isDuplicateKey(): boolean {
    return this.errorCode?.includes("DUPLICATE") ?? false;
  }
  
  formatQuery(): string {
    if (!this.params) return this.query;
    
    return this.query.replace(/\?/g, () => {
      const param = this.params?.shift();
      return typeof param === "string" ? `'${param}'` : String(param);
    });
  }
}

try {
  throw new DatabaseError(
    "Query failed",
    "INSERT INTO users (email, name) VALUES (?, ?)",
    ["user@example.com", "João"],
    "ER_DUP_ENTRY",
    0,
    "app_db",
    "users"
  );
} catch (e) {
  if (e instanceof DatabaseError) {
    console.log("Query:", e.formatQuery());
    // "INSERT INTO users (email, name) VALUES ('user@example.com', 'João')"
    
    console.log("Database:", e.databaseName);
    console.log("Table:", e.tableName);
    
    if (e.isDuplicateKey) {
      console.log("Email já existe");
    }
  }
}
```

**Conceito avançado:** DatabaseError com **contexto SQL completo** - query, params, database, table, error code.

### Validation Error with Multiple Errors

```typescript
interface FieldError {
  field: string;
  value: any;
  constraint: string;
  message: string;
}

class ValidationError extends Error {
  constructor(
    message: string,
    public errors: FieldError[]
  ) {
    super(message);
    this.name = "ValidationError";
  }
  
  getFieldError(field: string): FieldError | undefined {
    return this.errors.find(e => e.field === field);
  }
  
  hasFieldError(field: string): boolean {
    return this.errors.some(e => e.field === field);
  }
  
  get fieldNames(): string[] {
    return this.errors.map(e => e.field);
  }
}

try {
  throw new ValidationError(
    "Formulário inválido",
    [
      { field: "email", value: "abc", constraint: "email", message: "Email inválido" },
      { field: "age", value: -5, constraint: "min", message: "Idade deve ser positiva" },
      { field: "name", value: "", constraint: "required", message: "Nome obrigatório" }
    ]
  );
} catch (e) {
  if (e instanceof ValidationError) {
    console.log("Campos inválidos:", e.fieldNames);  // ["email", "age", "name"]
    
    e.errors.forEach(err => {
      console.log(`${err.field}: ${err.message}`);
    });
    
    if (e.hasFieldError("email")) {
      const emailError = e.getFieldError("email");
      console.log("Email error:", emailError?.message);
    }
  }
}
```

**Fundamento teórico:** Property pode ser **array de objects** - ValidationError agrupa múltiplos field errors.

#### Business Error with Domain Context

```typescript
interface OrderContext {
  orderId: string;
  customerId: number;
  items: Array<{ productId: string; quantity: number }>;
  totalAmount: number;
}

class OrderError extends Error {
  constructor(
    message: string,
    public reason: "insufficient-stock" | "payment-failed" | "invalid-address",
    public context: OrderContext,
    public recoverable: boolean = true
  ) {
    super(message);
    this.name = "OrderError";
  }
  
  get orderTotal(): number {
    return this.context.totalAmount;
  }
  
  get itemCount(): number {
    return this.context.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  toClientError(): object {
    return {
      error: this.message,
      reason: this.reason,
      orderId: this.context.orderId,
      recoverable: this.recoverable
    };
  }
}

try {
  throw new OrderError(
    "Produto fora de estoque",
    "insufficient-stock",
    {
      orderId: "ORD-123",
      customerId: 456,
      items: [
        { productId: "PROD-1", quantity: 2 },
        { productId: "PROD-2", quantity: 1 }
      ],
      totalAmount: 299.90
    }
  );
} catch (e) {
  if (e instanceof OrderError) {
    console.log("Pedido:", e.context.orderId);
    console.log("Razão:", e.reason);
    console.log("Total items:", e.itemCount);
    console.log("Valor:", e.orderTotal);
    
    if (e.reason === "insufficient-stock" && e.recoverable) {
      notificarEstoque(e.context.orderId);
    }
    
    // Retornar ao cliente
    res.status(400).json(e.toClientError());
  }
}
```

**Análise profunda:** **Business domain error** com contexto rico - order details, reason, recovery flag.

### Error with Cause Chain

```typescript
class ChainedError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: Error  // Erro original
  ) {
    super(message);
    this.name = "ChainedError";
  }
  
  getCauseChain(): Error[] {
    const chain: Error[] = [this];
    let current: Error | undefined = this.cause;
    
    while (current) {
      chain.push(current);
      if (current instanceof ChainedError) {
        current = current.cause;
      } else {
        break;
      }
    }
    
    return chain;
  }
  
  getRootCause(): Error {
    const chain = this.getCauseChain();
    return chain[chain.length - 1];
  }
}

try {
  try {
    try {
      throw new Error("Network timeout");
    } catch (e) {
      throw new ChainedError(
        "Failed to fetch data",
        "FETCH_ERROR",
        e instanceof Error ? e : undefined
      );
    }
  } catch (e) {
    throw new ChainedError(
      "Failed to load user profile",
      "PROFILE_ERROR",
      e instanceof Error ? e : undefined
    );
  }
} catch (e) {
  if (e instanceof ChainedError) {
    console.log("Error chain:");
    e.getCauseChain().forEach((err, i) => {
      console.log(`${i}: ${err.message}`);
    });
    // 0: Failed to load user profile
    // 1: Failed to fetch data
    // 2: Network timeout
    
    console.log("Root cause:", e.getRootCause().message);
    // "Network timeout"
  }
}
```

**Conceito avançado:** **Error chaining** via `cause` property - mantém histórico completo de erros.

#### Error with Metadata Map

```typescript
class MetadataError extends Error {
  private metadata: Map<string, any>;
  
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "MetadataError";
    this.metadata = new Map();
  }
  
  setMetadata(key: string, value: any): this {
    this.metadata.set(key, value);
    return this;  // Chainable
  }
  
  getMetadata(key: string): any {
    return this.metadata.get(key);
  }
  
  getAllMetadata(): Record<string, any> {
    return Object.fromEntries(this.metadata);
  }
}

try {
  throw new MetadataError("Operation failed", "OP_FAIL")
    .setMetadata("userId", 123)
    .setMetadata("operation", "updateProfile")
    .setMetadata("timestamp", new Date())
    .setMetadata("retryCount", 3);
} catch (e) {
  if (e instanceof MetadataError) {
    console.log("User:", e.getMetadata("userId"));
    console.log("Operation:", e.getMetadata("operation"));
    console.log("All metadata:", e.getAllMetadata());
  }
}
```

**Fundamento teórico:** **Dynamic metadata** via Map - flexibilidade para adicionar properties arbitrárias.

### Enum-Based Error Properties

```typescript
enum ErrorSeverity {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

enum ErrorCategory {
  Validation = "VALIDATION",
  Authentication = "AUTH",
  Authorization = "AUTHZ",
  Database = "DB",
  Network = "NET",
  Business = "BIZ"
}

class CategorizedError extends Error {
  constructor(
    message: string,
    public category: ErrorCategory,
    public severity: ErrorSeverity,
    public code: string
  ) {
    super(message);
    this.name = "CategorizedError";
  }
  
  get isCritical(): boolean {
    return this.severity === ErrorSeverity.Critical;
  }
  
  get requiresAlert(): boolean {
    return this.severity >= ErrorSeverity.High;
  }
}

try {
  throw new CategorizedError(
    "Database connection lost",
    ErrorCategory.Database,
    ErrorSeverity.Critical,
    "DB_CONN_LOST"
  );
} catch (e) {
  if (e instanceof CategorizedError) {
    console.log("Category:", e.category);       // "DB"
    console.log("Severity:", e.severity);       // 4
    console.log("Critical:", e.isCritical);     // true
    
    if (e.requiresAlert) {
      sendAlertToOps(e);
    }
  }
}
```

**Análise profunda:** **Enum properties** fornecem **type-safe categorization** - valores limitados a opções válidas.

### Error with Serialization

```typescript
class SerializableError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public metadata: Record<string, any> = {}
  ) {
    super(message);
    this.name = "SerializableError";
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      metadata: this.metadata,
      stack: this.stack
    };
  }
  
  static fromJSON(json: any): SerializableError {
    const error = new SerializableError(
      json.message,
      json.code,
      json.statusCode,
      json.metadata
    );
    error.stack = json.stack;
    return error;
  }
  
  toClientSafe() {
    // Remove stack trace para cliente
    return {
      error: this.message,
      code: this.code
    };
  }
}

try {
  throw new SerializableError(
    "Unauthorized",
    "AUTH_REQUIRED",
    401,
    { userId: 123, ip: "192.168.1.1" }
  );
} catch (e) {
  if (e instanceof SerializableError) {
    // Serializar para log
    const json = JSON.stringify(e.toJSON());
    logger.error(json);
    
    // Enviar ao cliente (sem stack)
    res.status(e.statusCode).json(e.toClientSafe());
  }
}
```

**Conceito:** **Serialization methods** permitem converter erro para JSON preservando custom properties.

## 🎯 Aplicabilidade e Contextos

### Form Validation with Field Context

```typescript
class FormValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any,
    public constraint: string
  ) {
    super(message);
    this.name = "FormValidationError";
  }
}

function validarEmail(email: string, fieldName: string = "email") {
  if (!email.includes("@")) {
    throw new FormValidationError(
      "Email deve conter @",
      fieldName,
      email,
      "email-format"
    );
  }
}

try {
  validarEmail("invalid", "userEmail");
} catch (e) {
  if (e instanceof FormValidationError) {
    showFieldError(e.field, e.message);
    logValidationError(e.field, e.value, e.constraint);
  }
}
```

**Raciocínio:** Field context permite **targeted UI feedback** - highlight campo específico.

### API Request Error

```typescript
class APIRequestError extends Error {
  constructor(
    message: string,
    public endpoint: string,
    public method: string,
    public statusCode: number,
    public requestId?: string
  ) {
    super(message);
    this.name = "APIRequestError";
  }
}

async function fetchData() {
  const response = await fetch("/api/data");
  
  if (!response.ok) {
    throw new APIRequestError(
      response.statusText,
      "/api/data",
      "GET",
      response.status,
      response.headers.get("X-Request-ID") || undefined
    );
  }
}
```

**Raciocínio:** HTTP context (endpoint, method, status) facilita debugging e retry logic.

### Business Rule Violation

```typescript
class BusinessRuleError extends Error {
  constructor(
    message: string,
    public rule: string,
    public violatedCondition: string,
    public currentValue: any,
    public expectedValue: any
  ) {
    super(message);
    this.name = "BusinessRuleError";
  }
}

function validarTransferencia(valor: number, saldo: number) {
  if (valor > saldo) {
    throw new BusinessRuleError(
      "Saldo insuficiente",
      "MIN_BALANCE",
      "valor <= saldo",
      valor,
      saldo
    );
  }
}
```

**Raciocínio:** Business context (regra, condição, valores) documenta violação.

## ⚠️ Limitações e Considerações Teóricas

### Memory Overhead

```typescript
// Properties adicionam overhead de memória
class HeavyError extends Error {
  constructor(
    message: string,
    public largeArray: any[],     // Muita memória
    public largeObject: any       // Muita memória
  ) {
    super(message);
  }
}
```

**Limitação:** Properties grandes (arrays, objects) aumentam uso de memória.

### Serialization Loss

```typescript
class ComplexError extends Error {
  constructor(
    message: string,
    public callback: () => void   // Function não serializa
  ) {
    super(message);
  }
}

const err = new ComplexError("Erro", () => {});
JSON.stringify(err);  // callback é perdido
```

**Consideração:** Functions, Symbols não serializam para JSON.

### Property Access Without Narrowing

```typescript
try {
  operacao();
} catch (e) {
  // ❌ e é unknown - precisa narrowing
  // console.log(e.field);  // Error!
  
  if (e instanceof ValidationError) {
    console.log(e.field);  // ✅ OK após narrowing
  }
}
```

**Limitação:** Sempre precisa type narrowing para acessar custom properties.

## 🔗 Interconexões Conceituais

**Relação com Error Classes:** Properties customizadas enriquecem custom errors.

**Relação com Type Safety:** TypeScript verifica properties.

**Relação com Instanceof:** Narrowing permite acesso type-safe.

**Relação com Logging:** Properties fornecem structured logging.

**Relação com Debugging:** Contexto rico facilita debugging.

## 🚀 Evolução e Próximos Conceitos

Dominar custom properties prepara para:
- **Error Messages:** Mensagens descritivas baseadas em properties
- **Error Typing:** Type safety completo
- **Error Serialization:** Serializar/deserializar erros
- **Error Monitoring:** Structured logging e monitoring
