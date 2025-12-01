# Custom Error Classes

## 🎯 Introdução e Definição

### Definição Conceitual

**Custom Error Classes** são **subclasses de Error** criadas para representar **tipos específicos de erros** no domínio da aplicação. Ao invés de lançar `Error` genérico, custom errors permitem **categorizar erros**, adicionar **properties customizadas**, fornecer **mensagens mais descritivas** e habilitar **type-safe error handling** através de `instanceof` checks. Custom errors são fundamentais para **structured error handling** em aplicações complexas.

Conceitualmente, custom error classes implementam **error taxonomy** - hierarquia de tipos de erro que espelha a arquitetura da aplicação. Por exemplo: `ValidationError`, `AuthenticationError`, `DatabaseError`, `HTTPError` - cada tipo representa categoria específica de falha com suas próprias **características** e **metadata**.

TypeScript adiciona **type safety** a custom errors - pode-se usar `instanceof` para **narrow type** do erro em catch clause e acessar properties específicas de forma type-safe. Custom errors também permitem **error filtering** - catch pode tratar tipos específicos diferentemente ou re-lançar erros que não consegue lidar.

### Contexto Histórico e Evolução

**JavaScript Early (2000s):** Apenas `Error` genérico - sem custom errors.

**ES5 (2009):** Possível criar subclasses de Error - mas sintaxe complexa.

**ES6 (2015):** `class` syntax simplificou criação de custom errors.

**TypeScript (2012):** Type safety para custom errors com `instanceof`.

**Node.js (2009+):** Popularizou custom errors - `SystemError`, `AssertionError`, etc.

**Evolução de práticas:**

**ES5 (sintaxe complexa):**
```javascript
// ES5 - difícil criar subclasses de Error
function ValidationError(message) {
  this.name = "ValidationError";
  this.message = message;
  this.stack = (new Error()).stack;
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
```

**ES6+ (class syntax):**
```typescript
// ES6+ - simples com class
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

**TypeScript moderno:**
```typescript
// TypeScript - type-safe custom errors
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Email inválido", "email", "abc");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(e.field);  // Type-safe access
  }
}
```

### Problema Fundamental que Resolve

Custom error classes resolvem o problema de **lack of error categorization** com `Error` genérico.

**Problema: Error genérico não categoriza**
```typescript
// ❌ Apenas Error - sem categorização
function processarPedido(pedido: any) {
  if (!pedido.id) {
    throw new Error("ID é obrigatório");
  }
  
  if (!usuarioAutenticado) {
    throw new Error("Não autenticado");
  }
  
  if (!conectadoDatabase) {
    throw new Error("Database indisponível");
  }
}

try {
  processarPedido(pedido);
} catch (e) {
  // ❌ Como diferenciar tipo de erro?
  // Todos são apenas Error
  console.error(e.message);
}
```

**Solução: Custom errors categorizam**
```typescript
// ✅ Custom errors - categorização clara
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

function processarPedido(pedido: any) {
  if (!pedido.id) {
    throw new ValidationError("ID é obrigatório");
  }
  
  if (!usuarioAutenticado) {
    throw new AuthenticationError("Não autenticado");
  }
  
  if (!conectadoDatabase) {
    throw new DatabaseError("Database indisponível");
  }
}

try {
  processarPedido(pedido);
} catch (e) {
  // ✅ Tratamento específico por tipo
  if (e instanceof ValidationError) {
    console.error("Erro de validação:", e.message);
    // Retorna 400 Bad Request
  } else if (e instanceof AuthenticationError) {
    console.error("Erro de autenticação:", e.message);
    // Retorna 401 Unauthorized
  } else if (e instanceof DatabaseError) {
    console.error("Erro de database:", e.message);
    // Retorna 500 Internal Server Error
  }
}
```

**Fundamento teórico:** Custom errors permitem **type-based error handling** - diferentes ações para diferentes tipos.

### Importância no Ecossistema

Custom error classes são cruciais porque:

- **Error Taxonomy:** Organiza erros em hierarquia
- **Type Safety:** TypeScript verifica tipos em catch
- **Specific Handling:** Trata cada tipo diferentemente
- **Metadata:** Adiciona properties customizadas
- **Code Organization:** Separa lógica de erro por tipo

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Extend Error:** Custom errors estendem Error base
2. **Name Property:** Cada custom error tem `name` único
3. **Custom Properties:** Adiciona metadata específica
4. **Type Safety:** `instanceof` verifica tipo
5. **Error Hierarchy:** Organiza erros em hierarquia

### Pilares Fundamentais

- **Inheritance:** Custom errors herdam de Error
- **Categorization:** Cada classe representa categoria
- **Type Narrowing:** `instanceof` refina tipo
- **Metadata:** Properties customizadas
- **Stack Trace:** Preservado de Error

### Visão Geral das Nuances

- **Super Call:** Construtor deve chamar `super(message)`
- **Name Assignment:** Deve atribuir `this.name`
- **Stack Trace:** Pode corrigir com `Error.captureStackTrace`
- **Generic Errors:** Pode criar hierarquias com base genérica
- **Error Wrapping:** Pode encapsular erros originais

## 🧠 Fundamentos Teóricos

### Basic Custom Error

```typescript
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

try {
  throw new CustomError("Algo deu errado");
} catch (e) {
  if (e instanceof CustomError) {
    console.log(e.name);     // "CustomError"
    console.log(e.message);  // "Algo deu errado"
    console.log(e.stack);    // Stack trace
  }
}
```

**Análise profunda:**

**Componentes essenciais:**
1. **extends Error:** Herda de Error base
2. **super(message):** Chama construtor de Error
3. **this.name:** Define nome do erro

**Fundamento teórico:** Custom error **herda** stack trace e properties de Error.

### Custom Error with Properties

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError(
    "Email inválido",
    "email",
    "not-an-email"
  );
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(e.message);  // "Email inválido"
    console.log(e.field);    // "email"
    console.log(e.value);    // "not-an-email"
  }
}
```

**Conceito fundamental:** Custom properties adicionam **metadata** específica do erro.

### Princípios e Conceitos Subjacentes

#### HTTP Error Class

```typescript
class HTTPError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "HTTPError";
  }
}

async function buscarDados() {
  const response = await fetch("/api/dados");
  
  if (!response.ok) {
    throw new HTTPError(
      response.status,
      `HTTP Error: ${response.statusText}`
    );
  }
  
  return response.json();
}

try {
  await buscarDados();
} catch (e) {
  if (e instanceof HTTPError) {
    console.log(`HTTP ${e.statusCode}: ${e.message}`);
    
    if (e.statusCode === 404) {
      console.log("Recurso não encontrado");
    } else if (e.statusCode >= 500) {
      console.log("Erro do servidor");
    }
  }
}
```

**Fundamento teórico:** Custom errors encapsulam **domain-specific metadata** (HTTP status code).

#### Database Error Class

```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    public query: string,
    public code?: string
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

async function executarQuery(sql: string) {
  try {
    return await database.execute(sql);
  } catch (e) {
    throw new DatabaseError(
      "Falha ao executar query",
      sql,
      e.code
    );
  }
}

try {
  await executarQuery("SELECT * FROM usuarios");
} catch (e) {
  if (e instanceof DatabaseError) {
    console.error("Query falhou:", e.query);
    console.error("Código:", e.code);
  }
}
```

**Análise profunda:** DatabaseError inclui **query** e **code** - essencial para debugging.

### Error Hierarchy

```typescript
// Base error para domínio
class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

// Errors específicos estendem base
class ValidationError extends ApplicationError {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message: string, public userId?: number) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class AuthorizationError extends ApplicationError {
  constructor(message: string, public resource: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

// Catch pode verificar base ou específico
try {
  processar();
} catch (e) {
  if (e instanceof ApplicationError) {
    // Todos erros da aplicação
    console.log("App error:", e.message);
  }
  
  if (e instanceof ValidationError) {
    // Apenas validation errors
    console.log("Field:", e.field);
  }
}
```

**Conceito avançado:** **Error hierarchy** - base comum + subclasses específicas.

### Modelo Mental para Compreensão

Pense em custom errors como **tipos de exceções**:

**Error genérico:** "Problema aconteceu"
**Custom error:** "Problema de validação no campo email"

**Analogia:**
- **Error:** Sintoma genérico - "Dor"
- **Custom Error:** Diagnóstico específico - "Dor de cabeça por enxaqueca"

**Metáfora:**
- **Error:** Alarme genérico
- **Custom Error:** Alarme específico - "Incêndio" vs "Intrusão" vs "Vazamento"

**Hierarquia:**
```
ApplicationError (base)
  ├─ ValidationError
  │   ├─ RequiredFieldError
  │   └─ InvalidFormatError
  ├─ AuthenticationError
  └─ DatabaseError
      ├─ ConnectionError
      └─ QueryError
```

## 🔍 Análise Conceitual Profunda

### Error.captureStackTrace (Node.js)

```typescript
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
    
    // Node.js - captura stack trace corretamente
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
```

**Conceito avançado:** `Error.captureStackTrace` remove construtor do stack trace - mostra apenas onde erro foi lançado.

**Sem captureStackTrace:**
```
Error: Mensagem
  at new CustomError (file.js:2:11)  ← Construtor no stack
  at exemplo (file.js:10:15)
```

**Com captureStackTrace:**
```
Error: Mensagem
  at exemplo (file.js:10:15)  ← Construtor removido
```

#### Multiple Custom Properties

```typescript
class DetailedError extends Error {
  public timestamp: Date;
  public context: any;
  
  constructor(
    message: string,
    public code: string,
    public severity: "low" | "medium" | "high",
    context?: any
  ) {
    super(message);
    this.name = "DetailedError";
    this.timestamp = new Date();
    this.context = context;
  }
}

try {
  throw new DetailedError(
    "Operação falhou",
    "OP_FAIL_001",
    "high",
    { userId: 123, operation: "delete" }
  );
} catch (e) {
  if (e instanceof DetailedError) {
    console.log("Code:", e.code);
    console.log("Severity:", e.severity);
    console.log("Time:", e.timestamp);
    console.log("Context:", e.context);
  }
}
```

**Fundamento teórico:** Custom errors podem ter **múltiplas properties** - rica metadata.

### Error Factory Functions

```typescript
// Factory para criar erros padronizados
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public httpStatus: number
  ) {
    super(message);
    this.name = "AppError";
  }
  
  static badRequest(message: string) {
    return new AppError(message, "BAD_REQUEST", 400);
  }
  
  static unauthorized(message: string) {
    return new AppError(message, "UNAUTHORIZED", 401);
  }
  
  static notFound(message: string) {
    return new AppError(message, "NOT_FOUND", 404);
  }
  
  static internal(message: string) {
    return new AppError(message, "INTERNAL_ERROR", 500);
  }
}

// Uso
try {
  throw AppError.notFound("Usuário não encontrado");
} catch (e) {
  if (e instanceof AppError) {
    console.log(`HTTP ${e.httpStatus}: ${e.message}`);
  }
}
```

**Conceito avançado:** **Factory methods** simplificam criação de erros específicos.

#### Error with Cause Chain

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = "AppError";
  }
}

try {
  try {
    throw new Error("Database connection failed");
  } catch (e) {
    throw new AppError(
      "Falha ao buscar usuário",
      e instanceof Error ? e : undefined
    );
  }
} catch (e) {
  if (e instanceof AppError) {
    console.log("Error:", e.message);
    console.log("Caused by:", e.cause?.message);
  }
}
```

**Análise profunda:** **Error chaining** preserva erro original - contexto completo.

### Type Guards for Custom Errors

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthError extends Error {
  constructor(message: string, public userId: number) {
    super(message);
    this.name = "AuthError";
  }
}

// Type guard
function isValidationError(e: unknown): e is ValidationError {
  return e instanceof ValidationError;
}

function isAuthError(e: unknown): e is AuthError {
  return e instanceof AuthError;
}

try {
  processar();
} catch (e) {
  if (isValidationError(e)) {
    console.log("Field:", e.field);  // Type-safe
  } else if (isAuthError(e)) {
    console.log("User:", e.userId);  // Type-safe
  }
}
```

**Fundamento teórico:** Type guards fornecem **type narrowing** - acesso type-safe a properties.

#### Generic Error Classes

```typescript
// Base genérica
class DomainError<T> extends Error {
  constructor(message: string, public data: T) {
    super(message);
    this.name = "DomainError";
  }
}

// Uso com tipos específicos
interface ValidationData {
  field: string;
  value: any;
  rule: string;
}

interface AuthData {
  userId: number;
  attemptedAction: string;
}

try {
  throw new DomainError<ValidationData>(
    "Validação falhou",
    { field: "email", value: "abc", rule: "email" }
  );
} catch (e) {
  if (e instanceof DomainError) {
    console.log(e.data);  // Type-safe access
  }
}
```

**Conceito avançado:** **Generic errors** permitem type-safe metadata de qualquer tipo.

### Error Serialization

```typescript
class SerializableError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "SerializableError";
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack
    };
  }
  
  static fromJSON(json: any) {
    const error = new SerializableError(json.message, json.code);
    error.stack = json.stack;
    return error;
  }
}

// Serializar para enviar ao cliente
try {
  throw new SerializableError("Erro", "ERR_001");
} catch (e) {
  if (e instanceof SerializableError) {
    const json = JSON.stringify(e.toJSON());
    // Envia json ao cliente
    console.log(json);
  }
}
```

**Análise profunda:** **Error serialization** permite enviar erros via rede.

#### Specific Domain Errors

```typescript
// Erro de produto
class ProductError extends Error {
  constructor(
    message: string,
    public productId: number,
    public reason: "out-of-stock" | "discontinued" | "invalid-price"
  ) {
    super(message);
    this.name = "ProductError";
  }
}

// Erro de pagamento
class PaymentError extends Error {
  constructor(
    message: string,
    public orderId: number,
    public paymentMethod: string,
    public gatewayCode?: string
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

try {
  processarPedido();
} catch (e) {
  if (e instanceof ProductError) {
    console.log(`Produto ${e.productId}: ${e.reason}`);
  } else if (e instanceof PaymentError) {
    console.log(`Pagamento ${e.orderId} falhou: ${e.gatewayCode}`);
  }
}
```

**Fundamento teórico:** **Domain-specific errors** refletem conceitos do negócio.

### Error with Stack Trace Limit

```typescript
class DetailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DetailedError";
    
    // Node.js - limita stack trace
    Error.stackTraceLimit = 50;  // Default é 10
  }
}
```

**Conceito:** `Error.stackTraceLimit` controla profundidade de stack trace.

#### Multiple Inheritance Alternative

```typescript
// JavaScript não tem multiple inheritance
// Usar composition ao invés

interface ILoggable {
  log(): void;
}

class LoggableError extends Error implements ILoggable {
  constructor(message: string) {
    super(message);
    this.name = "LoggableError";
  }
  
  log() {
    console.error(`[${this.name}] ${this.message}`);
    console.error(this.stack);
  }
}

try {
  throw new LoggableError("Erro com logging");
} catch (e) {
  if (e instanceof LoggableError) {
    e.log();  // Método customizado
  }
}
```

**Fundamento teórico:** **Composition** adiciona comportamento a errors sem herança múltipla.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  
  if (!response.ok) {
    throw new APIError(
      response.statusText,
      response.status,
      `/api/users/${id}`
    );
  }
  
  return response.json();
}
```

**Raciocínio:** APIError encapsula HTTP status e endpoint - contexto completo.

### Form Validation

```typescript
class FormValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "FormValidationError";
  }
}

function validarFormulario(dados: any) {
  const errors = [];
  
  if (!dados.nome) {
    errors.push({ field: "nome", message: "Nome é obrigatório" });
  }
  
  if (!dados.email) {
    errors.push({ field: "email", message: "Email é obrigatório" });
  }
  
  if (errors.length > 0) {
    throw new FormValidationError("Formulário inválido", errors);
  }
}

try {
  validarFormulario({ nome: "" });
} catch (e) {
  if (e instanceof FormValidationError) {
    e.errors.forEach(err => {
      console.log(`${err.field}: ${err.message}`);
    });
  }
}
```

**Raciocínio:** FormValidationError agrupa múltiplos erros de validação.

### Business Logic Errors

```typescript
class BusinessRuleError extends Error {
  constructor(
    message: string,
    public rule: string,
    public violatedCondition: string
  ) {
    super(message);
    this.name = "BusinessRuleError";
  }
}

function transferir(valor: number, contaOrigem: Conta, contaDestino: Conta) {
  if (contaOrigem.saldo < valor) {
    throw new BusinessRuleError(
      "Saldo insuficiente",
      "MIN_BALANCE",
      `Saldo ${contaOrigem.saldo} < Valor ${valor}`
    );
  }
  
  if (valor > 10000) {
    throw new BusinessRuleError(
      "Valor excede limite",
      "MAX_TRANSFER",
      `Valor ${valor} > Limite 10000`
    );
  }
  
  // Executa transferência
}
```

**Raciocínio:** BusinessRuleError documenta regra de negócio violada.

## ⚠️ Limitações e Considerações Teóricas

### Stack Trace in Transpiled Code

```typescript
// TypeScript transpilado pode ter stack trace confuso
class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MyError";
    
    // Source maps ajudam, mas podem não estar disponíveis
  }
}
```

**Limitação:** Stack trace aponta para código transpilado - source maps necessários.

### Error Serialization Loses Prototype

```typescript
const error = new CustomError("Mensagem");
const json = JSON.stringify(error);
const parsed = JSON.parse(json);

console.log(parsed instanceof CustomError);  // false
// Parsed é object literal, não CustomError instance
```

**Consideração:** JSON serialization perde prototype - precisa reconstruir.

### Performance Overhead

```typescript
// Criar Error instances tem overhead
for (let i = 0; i < 1000000; i++) {
  new CustomError("Mensagem");  // Lento - captura stack trace
}
```

**Limitação:** Error creation é relativamente cara - evitar em hot paths.

## 🔗 Interconexões Conceituais

**Relação com Error:** Custom errors estendem Error base.

**Relação com Instanceof:** Verifica tipo de custom error.

**Relação com Type Narrowing:** Refina tipo em catch.

**Relação com Inheritance:** Hierarquia de custom errors.

**Relação com Error Propagation:** Custom errors propagam normalmente.

## 🚀 Evolução e Próximos Conceitos

Dominar custom error classes prepara para:
- **Error Propagation Patterns:** Como erros propagam em arquiteturas complexas
- **Error Recovery Strategies:** Recuperação de erros específicos
- **Logging & Monitoring:** Log estruturado de custom errors
- **Error Boundaries:** React error boundaries com custom errors
