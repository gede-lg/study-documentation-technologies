# Estendendo a Classe Error

## 🎯 Introdução e Definição

### Definição Conceitual

**Estender a classe Error** significa criar **subclasses customizadas** que **herdam** de `Error` base, permitindo definir **tipos específicos de erros** para diferentes situações no domínio da aplicação. Através de herança, custom error classes automaticamente **herdam** properties essenciais (`message`, `name`, `stack`) e métodos de Error, enquanto permitem **adicionar properties**, **métodos** e **comportamentos customizados** específicos para cada tipo de erro.

Conceitualmente, estender Error implementa **error taxonomy** - hierarquia organizada de tipos de erro que espelha a **arquitetura** e **lógica de negócio** da aplicação. Ao invés de lançar `Error` genérico, aplicação pode lançar `ValidationError`, `AuthenticationError`, `DatabaseError`, `NetworkError` - cada tipo representa **categoria específica** de falha com suas próprias características, metadata e tratamento apropriado.

TypeScript adiciona **type safety** forte a custom error classes - `instanceof` checks permitem **type narrowing** em catch clauses, garantindo acesso type-safe a properties customizadas. Compilador verifica que apenas properties definidas na classe são acessadas, prevenindo runtime errors de acessar properties inexistentes.

### Contexto Histórico e Evolução

**JavaScript Early (1990s-2000s):** Apenas `Error` genérico - sem mecanismo simples para subclasses.

**ES5 (2009):** Possível criar subclasses de Error - mas sintaxe era **complexa** e **error-prone**.

**ES6 (2015):** `class` syntax **simplificou** drasticamente criação de custom errors.

**TypeScript (2012+):** Type system adiciona **type safety** a custom error hierarchies.

**Node.js (2009+):** Popularizou custom errors - introduziu `SystemError`, `AssertionError`, etc.

**Bibliotecas modernas:** Express, NestJS, Apollo - extenso uso de custom error hierarchies.

**Evolução da sintaxe:**

**ES5 (complexo e frágil):**
```javascript
// ES5 - sintaxe complexa para subclasses
function ValidationError(message) {
  this.name = "ValidationError";
  this.message = message;
  
  // Capturar stack trace
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ValidationError);
  } else {
    this.stack = (new Error()).stack;
  }
}

// Configurar prototype chain
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;

// Uso
throw new ValidationError("Campo inválido");
```

**ES6+ (simples e direto):**
```typescript
// ES6+ - class syntax simplificada
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Uso
throw new ValidationError("Campo inválido");
```

**TypeScript moderno (type-safe):**
```typescript
// TypeScript - type safety completo
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
    console.log(e.field);  // Type-safe - TypeScript sabe que field existe
  }
}
```

### Problema Fundamental que Resolve

Estender Error resolve o problema de **lack of error categorization and type safety** com Error genérico.

**Problema: Error genérico não diferencia tipos**
```typescript
// ❌ Apenas Error - impossível diferenciar tipos
function processar(dados: any) {
  if (!dados.email) {
    throw new Error("Email obrigatório");
  }
  
  if (!autenticado) {
    throw new Error("Não autenticado");
  }
  
  if (!conexaoDatabase) {
    throw new Error("Database indisponível");
  }
  
  if (dados.valor < 0) {
    throw new Error("Valor inválido");
  }
}

try {
  processar(dados);
} catch (e) {
  // ❌ Como saber qual tipo de erro?
  // ❌ Como tratar diferentemente?
  // ❌ Validação vs Autenticação vs Database?
  console.error(e.message);
  
  // Precisa parse string - frágil!
  if (e.message.includes("autenticado")) {
    return res.status(401).json({ error: e.message });
  }
  // ... mais string matching frágil
}
```

**Solução: Custom error classes com type safety**
```typescript
// ✅ Custom errors - tipos específicos
class ValidationError extends Error {
  constructor(message: string, public field: string) {
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
  constructor(message: string, public query?: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

function processar(dados: any) {
  if (!dados.email) {
    throw new ValidationError("Email obrigatório", "email");
  }
  
  if (!autenticado) {
    throw new AuthenticationError("Não autenticado");
  }
  
  if (!conexaoDatabase) {
    throw new DatabaseError("Database indisponível");
  }
}

try {
  processar(dados);
} catch (e) {
  // ✅ Type-based handling - type-safe
  if (e instanceof ValidationError) {
    console.log(`Campo ${e.field}: ${e.message}`);
    return res.status(400).json({ field: e.field, error: e.message });
  } else if (e instanceof AuthenticationError) {
    console.log("Auth error:", e.message);
    return res.status(401).json({ error: e.message });
  } else if (e instanceof DatabaseError) {
    console.log("DB error:", e.message, e.query);
    return res.status(500).json({ error: "Erro interno" });
  }
}
```

**Fundamento teórico:** Custom error classes fornecem **type safety**, **categorization** e **metadata** - tratamento específico por tipo.

### Importância no Ecossistema

Estender Error é crucial porque:

- **Type Safety:** TypeScript verifica tipos em compile-time
- **Error Taxonomy:** Organiza erros em hierarquia lógica
- **Specific Handling:** Cada tipo pode ter tratamento diferente
- **Metadata:** Properties customizadas carregam contexto
- **Code Organization:** Separa lógica de erro por domínio
- **API Design:** HTTP status codes baseados em tipo de erro
- **Debugging:** Stack trace + metadata facilitam debugging

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Class Extension:** `class CustomError extends Error`
2. **Super Call:** Construtor chama `super(message)`
3. **Name Assignment:** `this.name = "CustomError"`
4. **Inheritance:** Herda message, stack, name de Error
5. **Type Narrowing:** `instanceof` refina tipo em catch

### Pilares Fundamentais

- **Inheritance:** Custom errors herdam de Error base
- **Type Safety:** TypeScript verifica tipos estaticamente
- **Stack Trace:** Preservado automaticamente de Error
- **Custom Properties:** Adiciona metadata específica
- **Instanceof Checks:** Verifica tipo em runtime

### Visão Geral das Nuances

- **Super First:** `super()` deve ser chamado antes de `this`
- **Name Property:** Deve atribuir `this.name` explicitamente
- **captureStackTrace:** Node.js - corrige stack trace
- **Prototype Chain:** Mantém cadeia de prototypes
- **Generic Errors:** Base classes para hierarquias

## 🧠 Fundamentos Teóricos

### Basic Error Extension

```typescript
// Sintaxe básica - estender Error
class CustomError extends Error {
  constructor(message: string) {
    super(message);  // Chama construtor de Error
    this.name = "CustomError";  // Define nome do erro
  }
}

// Uso
try {
  throw new CustomError("Algo deu errado");
} catch (e) {
  if (e instanceof CustomError) {
    console.log(e.name);     // "CustomError"
    console.log(e.message);  // "Algo deu errado"
    console.log(e.stack);    // Stack trace completo
  }
}
```

**Análise profunda:**

**Componentes essenciais:**
1. **extends Error:** Declara herança de Error base
2. **super(message):** Inicializa Error base com mensagem
3. **this.name:** Identifica tipo do erro (importante para debugging)

**Fundamento teórico:** `super()` **deve** ser chamado antes de acessar `this` - inicializa instância de Error.

### Error with Custom Properties

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

// Uso
try {
  throw new ValidationError(
    "Email inválido",
    "email",
    "not-an-email"
  );
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(e.message);  // "Email inválido"
    console.log(e.field);    // "email" - type-safe access
    console.log(e.value);    // "not-an-email"
  }
}
```

**Conceito fundamental:** Custom properties **enriquecem** erro com metadata - contexto completo do problema.

### Princípios e Conceitos Subjacentes

#### Multiple Custom Error Types

```typescript
// Validation errors
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Authentication errors
class AuthenticationError extends Error {
  constructor(message: string, public userId?: number) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Database errors
class DatabaseError extends Error {
  constructor(message: string, public query: string, public code?: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

// Network errors
class NetworkError extends Error {
  constructor(message: string, public statusCode: number, public url: string) {
    super(message);
    this.name = "NetworkError";
  }
}

// Uso - tratamento específico por tipo
try {
  operacao();
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Campo inválido: ${e.field}`);
  } else if (e instanceof AuthenticationError) {
    console.log("Não autenticado");
  } else if (e instanceof DatabaseError) {
    console.log(`Query falhou: ${e.query}`);
  } else if (e instanceof NetworkError) {
    console.log(`HTTP ${e.statusCode}: ${e.url}`);
  }
}
```

**Fundamento teórico:** Múltiplos custom error types permitem **type-based error handling** - cada tipo recebe tratamento específico.

#### Error Hierarchy with Base Class

```typescript
// Base error para toda aplicação
class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}

// Domain-specific errors estendem base
class ValidationError extends ApplicationError {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class BusinessRuleError extends ApplicationError {
  constructor(message: string, public rule: string) {
    super(message);
    this.name = "BusinessRuleError";
  }
}

// Catch pode verificar base ou específico
try {
  processar();
} catch (e) {
  // Catch base - todos erros da aplicação
  if (e instanceof ApplicationError) {
    console.log("App error:", e.message);
    logToMonitoring(e);
  }
  
  // Catch específico - tratamento detalhado
  if (e instanceof ValidationError) {
    console.log("Invalid field:", e.field);
  }
}
```

**Conceito avançado:** **Error hierarchy** - base comum + subclasses específicas. Base captura **todos** erros da aplicação; instanceof específico permite tratamento **granular**.

### Why Super Must Be Called First

```typescript
class CustomError extends Error {
  public timestamp: Date;
  
  constructor(message: string) {
    // ❌ ERRO - acessar 'this' antes de super()
    // this.timestamp = new Date();  // TypeError!
    
    super(message);  // ✅ Deve vir primeiro
    
    // ✅ OK - após super()
    this.timestamp = new Date();
    this.name = "CustomError";
  }
}
```

**Análise profunda:**

**Regra:** `super()` **deve** ser chamado antes de acessar `this`.

**Motivo:** Em TypeScript/JavaScript, subclasse não cria sua própria instância `this` - a instância é criada pela **classe pai** (Error). `super()` chama construtor do pai, que **cria e retorna** instância `this`. Apenas **após** `super()` retornar, `this` existe e pode ser usado.

**Fundamento teórico:** Herança em JavaScript usa **delegation** - objeto filho **delega** criação de instância para pai.

### Modelo Mental para Compreensão

Pense em estender Error como **especialização**:

**Error:** Categoria genérica - "Problema"
**ValidationError:** Subcategoria específica - "Problema de Validação"

**Analogia:**
- **Error:** Veículo (genérico)
- **ValidationError:** Carro (específico)
- **AuthenticationError:** Moto (específico)
- **DatabaseError:** Caminhão (específico)

Todos são veículos (Error), mas cada tipo tem características específicas.

**Metáfora - Diagnóstico Médico:**
- **Error:** "Paciente doente"
- **ValidationError:** "Paciente com sintomas de gripe"
- **DatabaseError:** "Paciente com problema cardíaco"

Cada diagnóstico específico permite **tratamento específico**.

**Hierarquia:**
```
Error (built-in JavaScript)
  ↑
ApplicationError (sua base)
  ↑
  ├─ ValidationError
  │   ├─ RequiredFieldError
  │   └─ InvalidFormatError
  ├─ AuthenticationError
  │   ├─ InvalidCredentialsError
  │   └─ TokenExpiredError
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
    
    // Node.js - remove construtor do stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

function exemplo() {
  throw new CustomError("Erro");
}

try {
  exemplo();
} catch (e) {
  if (e instanceof Error) {
    console.log(e.stack);
  }
}
```

**Análise profunda:**

**Sem `Error.captureStackTrace`:**
```
Error: Erro
  at new CustomError (file.js:2:11)  ← Construtor aparece
  at exemplo (file.js:10:9)
  at Object.<anonymous> (file.js:14:3)
```

**Com `Error.captureStackTrace(this, CustomError)`:**
```
Error: Erro
  at exemplo (file.js:10:9)  ← Construtor removido
  at Object.<anonymous> (file.js:14:3)
```

**Fundamento teórico:** `Error.captureStackTrace(this, CustomError)` remove construtor do stack trace - mostra apenas **onde erro foi lançado**, não onde foi construído. Mais limpo para debugging.

**Parâmetros:**
- `this`: Objeto que receberá stack trace
- `CustomError`: Função a partir da qual capturar (remove ela e acima dela)

#### HTTP Error Hierarchy

```typescript
// Base para HTTP errors
class HTTPError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "HTTPError";
  }
}

// Specific HTTP errors
class BadRequestError extends HTTPError {
  constructor(message: string) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

class UnauthorizedError extends HTTPError {
  constructor(message: string) {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

class NotFoundError extends HTTPError {
  constructor(message: string) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class InternalServerError extends HTTPError {
  constructor(message: string) {
    super(message, 500);
    this.name = "InternalServerError";
  }
}

// Express middleware - mapeia erros para status codes
app.use((err, req, res, next) => {
  if (err instanceof HTTPError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Erro interno" });
  }
});

// Uso
app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }
    res.json(user);
  } catch (e) {
    next(e);  // Express middleware trata
  }
});
```

**Conceito avançado:** **HTTP error hierarchy** - base `HTTPError` + subclasses para status codes específicos. Middleware mapeia automaticamente tipo de erro para HTTP status.

### Domain-Specific Error Classes

```typescript
// E-commerce domain errors

class ProductError extends Error {
  constructor(
    message: string,
    public productId: string,
    public reason: "out-of-stock" | "discontinued" | "invalid-price"
  ) {
    super(message);
    this.name = "ProductError";
  }
}

class PaymentError extends Error {
  constructor(
    message: string,
    public orderId: string,
    public amount: number,
    public paymentMethod: string,
    public gatewayResponse?: any
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

class ShippingError extends Error {
  constructor(
    message: string,
    public orderId: string,
    public address: string,
    public carrier?: string
  ) {
    super(message);
    this.name = "ShippingError";
  }
}

// Uso - business logic
function processarPedido(pedido: Order) {
  // Validar produto
  const produto = getProduto(pedido.produtoId);
  if (!produto.disponivel) {
    throw new ProductError(
      "Produto indisponível",
      produto.id,
      "out-of-stock"
    );
  }
  
  // Processar pagamento
  const pagamento = processarPagamento(pedido);
  if (!pagamento.sucesso) {
    throw new PaymentError(
      "Pagamento recusado",
      pedido.id,
      pedido.valor,
      pedido.metodoPagamento,
      pagamento.response
    );
  }
  
  // Calcular frete
  const frete = calcularFrete(pedido.endereco);
  if (!frete.disponivel) {
    throw new ShippingError(
      "Entrega indisponível para o endereço",
      pedido.id,
      pedido.endereco
    );
  }
}

// Catch - tratamento específico por domínio
try {
  processarPedido(pedido);
} catch (e) {
  if (e instanceof ProductError) {
    notificarEstoque(e.productId);
    return { error: "Produto indisponível", productId: e.productId };
  } else if (e instanceof PaymentError) {
    logPaymentFailure(e.orderId, e.gatewayResponse);
    return { error: "Pagamento falhou", orderId: e.orderId };
  } else if (e instanceof ShippingError) {
    return { error: "Entrega indisponível", address: e.address };
  }
}
```

**Fundamento teórico:** **Domain-specific errors** refletem conceitos do **negócio** - ProductError, PaymentError, ShippingError espelham domínio de e-commerce.

#### Error with Timestamp

```typescript
class TimestampedError extends Error {
  public readonly timestamp: Date;
  
  constructor(message: string) {
    super(message);
    this.name = "TimestampedError";
    this.timestamp = new Date();
  }
  
  getAge(): number {
    return Date.now() - this.timestamp.getTime();
  }
}

try {
  throw new TimestampedError("Erro");
} catch (e) {
  if (e instanceof TimestampedError) {
    console.log("Erro ocorreu:", e.timestamp);
    console.log("Há (ms):", e.getAge());
  }
}
```

**Conceito:** Custom errors podem ter **métodos** customizados - `getAge()` calcula tempo desde erro.

### Error with Context Object

```typescript
interface ErrorContext {
  userId?: number;
  requestId?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

class ContextualError extends Error {
  constructor(
    message: string,
    public context: ErrorContext
  ) {
    super(message);
    this.name = "ContextualError";
  }
  
  toString(): string {
    return `${this.name}: ${this.message}\nContext: ${JSON.stringify(this.context, null, 2)}`;
  }
}

// Uso
try {
  throw new ContextualError(
    "Operação falhou",
    {
      userId: 123,
      requestId: "req-456",
      operation: "updateProfile",
      metadata: { field: "email", value: "test@example.com" }
    }
  );
} catch (e) {
  if (e instanceof ContextualError) {
    console.log(e.toString());
    logToMonitoring({
      error: e.message,
      context: e.context,
      stack: e.stack
    });
  }
}
```

**Análise profunda:** **Context object** agrupa metadata relacionada - facilita logging estruturado e debugging.

#### Error Factory Pattern

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
  }
  
  // Factory methods - padrão conveniente
  static badRequest(message: string, code = "BAD_REQUEST") {
    return new AppError(message, code, 400);
  }
  
  static unauthorized(message: string, code = "UNAUTHORIZED") {
    return new AppError(message, code, 401);
  }
  
  static forbidden(message: string, code = "FORBIDDEN") {
    return new AppError(message, code, 403);
  }
  
  static notFound(message: string, code = "NOT_FOUND") {
    return new AppError(message, code, 404);
  }
  
  static internal(message: string, code = "INTERNAL_ERROR") {
    return new AppError(message, code, 500, false);
  }
}

// Uso - factory methods mais conveniente
try {
  throw AppError.notFound("Usuário não encontrado");
  // vs
  throw new AppError("Usuário não encontrado", "NOT_FOUND", 404);
} catch (e) {
  if (e instanceof AppError) {
    console.log(`[${e.code}] ${e.message}`);
    console.log(`HTTP ${e.statusCode}`);
    console.log(`Operational: ${e.isOperational}`);
  }
}
```

**Conceito avançado:** **Factory methods** simplificam criação - `AppError.notFound()` mais legível que `new AppError(..., 404)`.

### Generic Error Classes

```typescript
// Generic error com tipo de data
class TypedError<T> extends Error {
  constructor(
    message: string,
    public data: T
  ) {
    super(message);
    this.name = "TypedError";
  }
}

// Uso com tipos específicos
interface ValidationData {
  field: string;
  value: any;
  constraint: string;
}

interface PaymentData {
  orderId: string;
  amount: number;
  gatewayCode: string;
}

try {
  throw new TypedError<ValidationData>(
    "Validação falhou",
    {
      field: "email",
      value: "invalid",
      constraint: "must-be-email"
    }
  );
} catch (e) {
  if (e instanceof TypedError) {
    // e.data é type-safe - TypeScript sabe structure
    console.log(`Campo ${e.data.field} inválido`);
  }
}
```

**Fundamento teórico:** **Generic errors** com TypeScript generics permitem type-safe metadata de **qualquer tipo**.

#### Error Serialization

```typescript
class SerializableError extends Error {
  constructor(
    message: string,
    public code: string,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = "SerializableError";
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      metadata: this.metadata,
      stack: this.stack
    };
  }
  
  static fromJSON(json: any): SerializableError {
    const error = new SerializableError(
      json.message,
      json.code,
      json.metadata
    );
    error.stack = json.stack;
    return error;
  }
}

// Serializar para enviar via rede
try {
  throw new SerializableError(
    "Operação falhou",
    "OP_FAILED",
    { userId: 123 }
  );
} catch (e) {
  if (e instanceof SerializableError) {
    const json = JSON.stringify(e.toJSON());
    
    // Enviar ao servidor/cliente
    sendToServer(json);
    
    // Reconstruir do JSON
    const reconstructed = SerializableError.fromJSON(JSON.parse(json));
    console.log(reconstructed.message);  // "Operação falhou"
  }
}
```

**Análise profunda:** `toJSON()` permite **serializar** erro para JSON; `fromJSON()` **reconstrói** erro do JSON. Útil para comunicação cliente-servidor.

### Protecting Error Construction

```typescript
class ProtectedError extends Error {
  private constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "ProtectedError";
  }
  
  // Apenas factory methods podem criar instâncias
  static validation(field: string) {
    return new ProtectedError(
      `Campo ${field} inválido`,
      "VALIDATION_ERROR"
    );
  }
  
  static authentication() {
    return new ProtectedError(
      "Não autenticado",
      "AUTH_ERROR"
    );
  }
}

// ❌ Construtor privado - não pode usar 'new'
// const err = new ProtectedError("msg", "code");  // Error!

// ✅ Apenas via factory methods
const err = ProtectedError.validation("email");
```

**Conceito:** Construtor **privado** força uso de factory methods - garante erros são criados **corretamente**.

## 🎯 Aplicabilidade e Contextos

### REST API Error Handling

```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Express middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code
      }
    });
  } else {
    res.status(500).json({ error: "Erro interno" });
  }
});
```

**Raciocínio:** Custom APIError encapsula HTTP status code - middleware mapeia erro para response.

### Database Operations

```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    public query: string,
    public errorCode?: string
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

async function executarQuery(sql: string) {
  try {
    return await db.execute(sql);
  } catch (e) {
    throw new DatabaseError(
      "Query falhou",
      sql,
      e.code
    );
  }
}
```

**Raciocínio:** DatabaseError inclui query que falhou - essencial para debugging.

### Form Validation

```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

function validarFormulario(dados: any) {
  const errors = [];
  
  if (!dados.nome) {
    errors.push({ field: "nome", message: "Nome obrigatório" });
  }
  
  if (!dados.email?.includes("@")) {
    errors.push({ field: "email", message: "Email inválido" });
  }
  
  if (errors.length > 0) {
    throw new ValidationError("Formulário inválido", errors);
  }
}
```

**Raciocínio:** ValidationError agrupa múltiplos erros - retorna todos de uma vez.

## ⚠️ Limitações e Considerações Teóricas

### Transpilation Issues

```typescript
// TypeScript transpilado pode perder instanceof
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

// Após transpilação para ES5, instanceof pode falhar
```

**Limitação:** Transpilação para ES5 pode quebrar `instanceof` - workaround: verificar `e.name`.

### Serialization Loses Prototype

```typescript
const error = new CustomError("Mensagem");
const json = JSON.stringify(error);
const parsed = JSON.parse(json);

console.log(parsed instanceof CustomError);  // false
// Parsed é object literal, perde prototype
```

**Consideração:** JSON serialization perde prototype chain - precisa reconstruir com `fromJSON`.

### Stack Trace Performance

```typescript
// Criar Error é relativamente caro
for (let i = 0; i < 1000000; i++) {
  new CustomError("Erro");  // Slow - captura stack trace
}
```

**Limitação:** Error creation tem overhead de stack trace capture - evitar em hot paths.

## 🔗 Interconexões Conceituais

**Relação com Error:** Custom errors herdam de Error base.

**Relação com Inheritance:** Usa herança de classes.

**Relação com Instanceof:** Type checking via instanceof.

**Relação com Type Narrowing:** Refina tipo em catch clauses.

**Relação com Stack Trace:** Preserva stack trace de Error.

## 🚀 Evolução e Próximos Conceitos

Dominar extensão de Error prepara para:
- **Error Properties:** Adicionar metadata customizada
- **Error Messages:** Mensagens descritivas
- **Error Typing:** Type safety completo
- **Error Hierarchies:** Hierarquias complexas de erros
