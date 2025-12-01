# Tipagem de Erros

## 🎯 Introdução e Definição

### Definição Conceitual

**Tipagem de erros** refere-se ao uso do **type system** do TypeScript para garantir **type safety** ao trabalhar com erros - desde **lançar** erros com tipos específicos, **capturar** erros com type narrowing, até **acessar properties** de custom errors de forma type-safe. TypeScript trata catch clause como `unknown` (TypeScript 4.0+), forçando desenvolvedores a **verificar tipo** do erro antes de acessar properties, prevenindo runtime errors de acessar properties inexistentes.

Conceitualmente, tipagem de erros estende **type safety** do TypeScript para o domínio de **error handling** - enquanto TypeScript garante type safety para **happy path** (código sem erros), tipagem de erros garante type safety para **error path** (código que lida com falhas). Através de `instanceof` checks, type guards, discriminated unions e custom type predicates, TypeScript consegue **refinar tipo** de erro capturado, permitindo acesso type-safe a properties customizadas.

**Type safety** para erros é crucial porque previne bugs comuns: acessar property que não existe (`e.field` quando erro não tem `field`), assumir erro é sempre `Error` (pode ser string, number, object), não lidar com todos tipos de erro possíveis. TypeScript força **exhaustive handling** - compilador verifica que todos casos são tratados.

### Contexto Histórico e Evolução

**JavaScript (1995-2019):** Catch clause sempre teve tipo implícito `any` - sem type safety.

**TypeScript Early (2012-2020):** Catch clause era `any` - podia acessar qualquer property sem erro de compilação.

**TypeScript 4.0 (Agosto 2020):** **Breaking change** - catch clause passou a ser `unknown` ao invés de `any`.

**Motivação:** `any` em catch permitia código perigoso:
```typescript
// TypeScript < 4.0
try {
  operacao();
} catch (e) {
  // e: any - perigoso!
  console.log(e.message);  // OK em compile-time
  console.log(e.field);    // OK em compile-time (mas pode não existir!)
  console.log(e.xyz);      // OK em compile-time (mas não existe!)
}
```

**TypeScript 4.0+:** `unknown` força type checking:
```typescript
// TypeScript 4.0+
try {
  operacao();
} catch (e) {
  // e: unknown - type-safe!
  console.log(e.message);  // ❌ Error - e is unknown
  
  // Precisa type narrowing
  if (e instanceof Error) {
    console.log(e.message);  // ✅ OK - e é Error
  }
}
```

**TypeScript 4.4 (2021):** Melhorias em control flow analysis - inferência mais precisa de tipos em catch.

**Evolução de práticas:**

**Era Any (antes 4.0):**
```typescript
try {
  operacao();
} catch (e) {  // e: any
  console.log(e.message);  // Perigoso - assume Error
}
```

**Era Unknown (4.0+):**
```typescript
try {
  operacao();
} catch (e) {  // e: unknown
  if (e instanceof Error) {
    console.log(e.message);  // Type-safe
  }
}
```

**Era Modern (atualidade):**
```typescript
// Type guards customizados
function isValidationError(e: unknown): e is ValidationError {
  return e instanceof ValidationError;
}

try {
  operacao();
} catch (e) {
  if (isValidationError(e)) {
    console.log(e.field);  // Type-safe access
  }
}
```

### Problema Fundamental que Resolve

Tipagem de erros resolve o problema de **lack of type safety in error handling**.

**Problema: Sem type safety - runtime errors**
```typescript
// TypeScript < 4.0 - catch era 'any'
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new Error("Erro genérico");
} catch (e) {
  // e: any - assume que tem field
  console.log(e.field);  // ✅ Compile OK, ❌ Runtime: undefined
  // Erro genérico não tem 'field'!
}

try {
  throw "string error";
} catch (e) {
  // e: any - assume que é Error
  console.log(e.message);  // ✅ Compile OK, ❌ Runtime: undefined
  // String não tem 'message'!
}
```

**Solução: Type safety com unknown + narrowing**
```typescript
// TypeScript 4.0+ - catch é 'unknown'
try {
  throw new Error("Erro genérico");
} catch (e) {
  // e: unknown - precisa narrowing
  console.log(e.field);  // ❌ Compile Error - e is unknown
  
  // Type narrowing necessário
  if (e instanceof ValidationError) {
    console.log(e.field);  // ✅ Type-safe - TS sabe que tem field
  } else if (e instanceof Error) {
    console.log(e.message);  // ✅ Type-safe - TS sabe que é Error
  } else {
    console.log("Unknown error:", e);
  }
}

try {
  throw "string error";
} catch (e) {
  if (typeof e === "string") {
    console.log(e.toUpperCase());  // ✅ Type-safe - TS sabe que é string
  } else if (e instanceof Error) {
    console.log(e.message);  // ✅ Type-safe
  }
}
```

**Fundamento teórico:** `unknown` type força **explicit type checking** - previne assumir tipo incorreto.

### Importância no Ecossistema

Tipagem de erros é crucial porque:

- **Type Safety:** Previne acessar properties inexistentes
- **Compile-Time Checks:** Erros detectados em compile-time, não runtime
- **Exhaustive Handling:** Força lidar com todos tipos possíveis
- **Refactoring Safety:** Renomear properties detecta usos em catch
- **Documentation:** Tipos documentam quais erros função pode lançar
- **IntelliSense:** Autocomplete para properties de custom errors
- **Maintenance:** Code review detecta error handling incorreto

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Unknown Type:** Catch clause é `unknown` (TS 4.0+)
2. **Type Narrowing:** `instanceof` refina tipo
3. **Type Guards:** Funções que verificam tipo
4. **Discriminated Unions:** Union types para diferentes erros
5. **Exhaustive Checking:** Garantir todos casos tratados

### Pilares Fundamentais

- **Unknown Catch:** Catch não assume tipo
- **Instanceof Checks:** Verifica se é instância de classe
- **Type Predicates:** `e is CustomError` type guards
- **Union Types:** Múltiplos tipos de erro possíveis
- **Never Type:** Funções que sempre lançam erro

### Visão Geral das Nuances

- **Type Narrowing:** `instanceof`, `typeof`, `in` operator
- **Custom Type Guards:** Funções `is` customizadas
- **Error Union Types:** `Error | ValidationError | ...`
- **Generic Errors:** Generic types para errors
- **Async Error Types:** Promises reject com unknown

## 🧠 Fundamentos Teóricos

### Basic Type Narrowing with Instanceof

```typescript
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class DatabaseError extends Error {
  constructor(message: string, public query: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

try {
  operacao();
} catch (e) {
  // e: unknown
  
  if (e instanceof ValidationError) {
    // e: ValidationError - narrowed
    console.log(e.field);     // ✅ Type-safe
    console.log(e.message);   // ✅ Type-safe
  } else if (e instanceof DatabaseError) {
    // e: DatabaseError - narrowed
    console.log(e.query);     // ✅ Type-safe
    console.log(e.message);   // ✅ Type-safe
  } else if (e instanceof Error) {
    // e: Error - narrowed
    console.log(e.message);   // ✅ Type-safe
    // console.log(e.field);  // ❌ Error - field não existe em Error
  } else {
    // e: unknown - não é Error
    console.log("Unknown error:", e);
  }
}
```

**Análise profunda:**

**Type Narrowing Flow:**
1. `e` começa como `unknown`
2. `instanceof ValidationError` → `e` é `ValidationError`
3. `instanceof DatabaseError` → `e` é `DatabaseError`
4. `instanceof Error` → `e` é `Error`
5. `else` → `e` permanece `unknown`

**Fundamento teórico:** `instanceof` é **type guard built-in** - TypeScript entende e refina tipo automaticamente.

### Type Guards for Errors

```typescript
// Type guard customizado
function isValidationError(e: unknown): e is ValidationError {
  return e instanceof ValidationError;
}

function isDatabaseError(e: unknown): e is DatabaseError {
  return e instanceof DatabaseError;
}

try {
  operacao();
} catch (e) {
  if (isValidationError(e)) {
    // e: ValidationError - narrowed
    console.log(e.field);  // ✅ Type-safe
  } else if (isDatabaseError(e)) {
    // e: DatabaseError - narrowed
    console.log(e.query);  // ✅ Type-safe
  }
}
```

**Conceito fundamental:** **Type predicates** (`e is ValidationError`) permitem criar type guards customizados - função retorna boolean + refina tipo.

### Princípios e Conceitos Subjacentes

#### Typeof for Primitive Error Types

```typescript
try {
  // JavaScript permite throw de qualquer tipo
  throw "string error";
  // throw 404;
  // throw { code: "ERR" };
} catch (e) {
  // Type narrowing com typeof
  if (typeof e === "string") {
    console.log(e.toUpperCase());  // ✅ Type-safe - e é string
  } else if (typeof e === "number") {
    console.log(e.toFixed(2));     // ✅ Type-safe - e é number
  } else if (typeof e === "object" && e !== null) {
    console.log(e);                // e: object
  }
}
```

**Fundamento teórico:** `typeof` é type guard para **tipos primitivos** - string, number, boolean, etc.

#### In Operator for Property Checking

```typescript
interface ErrorWithCode {
  code: string;
  message: string;
}

try {
  operacao();
} catch (e) {
  // 'in' operator verifica se property existe
  if (typeof e === "object" && e !== null && "code" in e) {
    // e: object & { code: unknown }
    const error = e as ErrorWithCode;
    console.log(error.code);  // Type-safe após cast
  }
  
  if (e instanceof Error && "field" in e) {
    // e: Error & { field: unknown }
    console.log((e as any).field);  // Precisa cast
  }
}
```

**Análise profunda:** `in` operator verifica **existência de property** - útil para objects sem classe definida.

### Discriminated Unions for Error Types

```typescript
// Union type para todos erros possíveis
type AppError =
  | ValidationError
  | DatabaseError
  | NetworkError
  | AuthenticationError;

function handleError(e: AppError) {
  // Discriminated union - switch no 'name'
  switch (e.name) {
    case "ValidationError":
      // e: ValidationError
      console.log(e.field);
      break;
    case "DatabaseError":
      // e: DatabaseError
      console.log(e.query);
      break;
    case "NetworkError":
      // e: NetworkError
      console.log(e.statusCode);
      break;
    case "AuthenticationError":
      // e: AuthenticationError
      console.log(e.userId);
      break;
    default:
      // TypeScript verifica exhaustiveness
      const _exhaustive: never = e;
      return _exhaustive;
  }
}

try {
  operacao();
} catch (e) {
  if (e instanceof Error && isAppError(e)) {
    handleError(e as AppError);
  }
}

function isAppError(e: Error): e is AppError {
  return (
    e instanceof ValidationError ||
    e instanceof DatabaseError ||
    e instanceof NetworkError ||
    e instanceof AuthenticationError
  );
}
```

**Conceito avançado:** **Discriminated unions** permitem exhaustive checking - TypeScript garante que todos casos são tratados.

### Generic Error Types

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
}

interface DBData {
  query: string;
  params: any[];
}

function processValidationError(e: TypedError<ValidationData>) {
  console.log(e.data.field);   // ✅ Type-safe
  console.log(e.data.value);   // ✅ Type-safe
}

function processDBError(e: TypedError<DBData>) {
  console.log(e.data.query);   // ✅ Type-safe
  console.log(e.data.params);  // ✅ Type-safe
}

try {
  throw new TypedError<ValidationData>(
    "Validation failed",
    { field: "email", value: "abc" }
  );
} catch (e) {
  if (e instanceof TypedError) {
    // e.data: unknown - precisa narrowing adicional
    if ("field" in e.data) {
      const validationError = e as TypedError<ValidationData>;
      processValidationError(validationError);
    }
  }
}
```

**Fundamento teórico:** **Generic types** fornecem type safety para data structure dentro de erro.

### Modelo Mental para Compreensão

Pense em tipagem de erros como **segurança em aeroporto**:

**Sem type safety (any):** Qualquer bagagem passa sem verificação - perigoso!
**Com type safety (unknown + narrowing):** Toda bagagem inspecionada antes de passar - seguro!

**Analogia:**

**Any:** Entrar em sala sem bater - não sabe o que tem lá
**Unknown:** Bater na porta, perguntar "quem está?" antes de entrar
**Type narrowing:** Verificar identidade antes de dar acesso

**Metáfora - Chaves e Fechaduras:**

**Any:** Chave mestra - abre qualquer porta (perigoso)
**Unknown:** Sem chave - precisa verificar qual porta é
**Type narrowing:** Usar chave certa para cada porta

**Fluxo:**
```
e: unknown (trancado)
  ↓
instanceof Error? (verificar)
  ↓ sim
e: Error (chave certa - pode acessar .message)
  ↓
instanceof ValidationError? (verificar mais)
  ↓ sim
e: ValidationError (chave específica - pode acessar .field)
```

## 🔍 Análise Conceitual Profunda

### Exhaustive Error Handling

```typescript
type AppError =
  | ValidationError
  | DatabaseError
  | NetworkError;

function handleAppError(e: AppError): string {
  if (e instanceof ValidationError) {
    return `Validation: ${e.field}`;
  } else if (e instanceof DatabaseError) {
    return `Database: ${e.query}`;
  } else if (e instanceof NetworkError) {
    return `Network: ${e.statusCode}`;
  }
  
  // TypeScript verifica exhaustiveness
  const _exhaustive: never = e;
  return _exhaustive;
}

// Se adicionar novo tipo a AppError, TypeScript alerta
type AppError2 =
  | ValidationError
  | DatabaseError
  | NetworkError
  | AuthenticationError;  // Novo tipo

function handleAppError2(e: AppError2): string {
  if (e instanceof ValidationError) {
    return `Validation: ${e.field}`;
  } else if (e instanceof DatabaseError) {
    return `Database: ${e.query}`;
  } else if (e instanceof NetworkError) {
    return `Network: ${e.statusCode}`;
  }
  // ❌ Error - AuthenticationError não tratado!
  const _exhaustive: never = e;  // e: AuthenticationError (não é never)
  return _exhaustive;
}
```

**Análise profunda:** **Never type** garante exhaustiveness - se algum tipo não for tratado, TypeScript alerta em compile-time.

#### Complex Type Guards

```typescript
interface APIError {
  statusCode: number;
  message: string;
  code: string;
}

function isAPIError(e: unknown): e is APIError {
  return (
    typeof e === "object" &&
    e !== null &&
    "statusCode" in e &&
    "message" in e &&
    "code" in e &&
    typeof (e as any).statusCode === "number" &&
    typeof (e as any).message === "string" &&
    typeof (e as any).code === "string"
  );
}

try {
  throw { statusCode: 404, message: "Not Found", code: "NOT_FOUND" };
} catch (e) {
  if (isAPIError(e)) {
    // e: APIError - fully type-safe
    console.log(e.statusCode);  // number
    console.log(e.message);     // string
    console.log(e.code);        // string
  }
}
```

**Conceito avançado:** **Complex type guards** verificam **structure** de object - validam que todas properties existem com tipos corretos.

### Error Type with Branded Types

```typescript
// Branded type para garantir tipo específico
type ValidationErrorBrand = { __brand: "ValidationError" };
type ValidationErrorType = Error & ValidationErrorBrand & {
  field: string;
  value: any;
};

function createValidationError(
  message: string,
  field: string,
  value: any
): ValidationErrorType {
  const error = new Error(message) as ValidationErrorType;
  error.field = field;
  error.value = value;
  (error as any).__brand = "ValidationError";
  return error;
}

function isValidationError(e: unknown): e is ValidationErrorType {
  return (
    typeof e === "object" &&
    e !== null &&
    "__brand" in e &&
    (e as any).__brand === "ValidationError"
  );
}

try {
  throw createValidationError("Invalid", "email", "abc");
} catch (e) {
  if (isValidationError(e)) {
    console.log(e.field);  // Type-safe
  }
}
```

**Fundamento teórico:** **Branded types** adicionam marker único - type guard verifica brand para garantir tipo exato.

#### Error Type Inference

```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

// TypeScript infere tipo de retorno baseado em throw
function alwaysThrows(): never {
  throw new AppError("Always fails", "ALWAYS_FAIL");
}

function maybeThrows(condition: boolean): string {
  if (condition) {
    throw new AppError("Condition failed", "CONDITION_FAIL");
  }
  return "success";
}

// Return type: string | never → simplifica para string
const result = maybeThrows(false);  // result: string
```

**Análise profunda:** TypeScript infere `never` para funções que **sempre lançam** erro - never em union types é eliminado.

### Async Error Typing

```typescript
async function fetchData(): Promise<string> {
  throw new ValidationError("Fetch failed", "url");
}

// Promise rejection é unknown
fetchData()
  .then(data => console.log(data))
  .catch(e => {
    // e: unknown - precisa narrowing
    if (e instanceof ValidationError) {
      console.log(e.field);  // Type-safe
    }
  });

// Com async/await
async function main() {
  try {
    await fetchData();
  } catch (e) {
    // e: unknown - precisa narrowing
    if (e instanceof ValidationError) {
      console.log(e.field);  // Type-safe
    }
  }
}
```

**Conceito:** **Promise rejection** também é `unknown` - mesmo type safety necessário.

#### Error Type Assertions

```typescript
try {
  operacao();
} catch (e) {
  // Type assertion - use com cuidado!
  const error = e as ValidationError;
  console.log(error.field);  // Não type-safe - assertion pode estar errada
  
  // Melhor: narrowing
  if (e instanceof ValidationError) {
    console.log(e.field);  // Type-safe
  }
}
```

**Consideração:** Type assertions (`as`) **bypassam** type checking - preferir type narrowing.

### Union Types for Multiple Error Sources

```typescript
type OperationError =
  | ValidationError
  | DatabaseError
  | NetworkError;

function performOperation(): string | OperationError {
  const validation = validateInput();
  if (validation instanceof Error) {
    return validation;  // Return error ao invés de throw
  }
  
  const dbResult = queryDatabase();
  if (dbResult instanceof Error) {
    return dbResult;
  }
  
  return "success";
}

const result = performOperation();

if (typeof result === "string") {
  console.log("Success:", result);
} else {
  // result: OperationError
  if (result instanceof ValidationError) {
    console.log("Validation:", result.field);
  } else if (result instanceof DatabaseError) {
    console.log("Database:", result.query);
  } else {
    console.log("Network:", result.statusCode);
  }
}
```

**Fundamento teórico:** Union types permitem **return error** ao invés de throw - type-safe error handling sem exceptions.

### Error Factory with Type Safety

```typescript
class ErrorFactory {
  static validation(field: string, value: any): ValidationError {
    return new ValidationError(
      `Field ${field} is invalid`,
      field,
      value
    );
  }
  
  static database(query: string): DatabaseError {
    return new DatabaseError(
      "Database query failed",
      query
    );
  }
  
  static network(statusCode: number): NetworkError {
    return new NetworkError(
      `HTTP ${statusCode}`,
      statusCode,
      ""
    );
  }
}

try {
  throw ErrorFactory.validation("email", "abc");
} catch (e) {
  // TypeScript sabe que é ValidationError
  if (e instanceof ValidationError) {
    console.log(e.field);  // Type-safe
  }
}
```

**Conceito:** **Factory methods** garantem tipo correto - TypeScript infere return type.

#### Error Type Documentation

```typescript
/**
 * Busca usuário por ID
 * @throws {ValidationError} Se ID é inválido
 * @throws {DatabaseError} Se query falha
 * @throws {NotFoundError} Se usuário não existe
 */
async function buscarUsuario(id: number): Promise<User> {
  if (id < 0) {
    throw new ValidationError("ID inválido", "id", id);
  }
  
  try {
    const user = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    if (!user) {
      throw new NotFoundError("User", id);
    }
    return user;
  } catch (e) {
    if (e instanceof Error) {
      throw new DatabaseError("Query failed", e.message);
    }
    throw e;
  }
}

// Caller sabe quais erros esperar
try {
  await buscarUsuario(123);
} catch (e) {
  // Documenta erros possíveis
  if (e instanceof ValidationError) {
    // Handle validation
  } else if (e instanceof DatabaseError) {
    // Handle database
  } else if (e instanceof NotFoundError) {
    // Handle not found
  }
}
```

**Análise profunda:** **JSDoc @throws** documenta quais erros função pode lançar - não enforced mas útil para documentação.

### Result Type Pattern (Type-Safe Alternative)

```typescript
type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 2);

if (result.success) {
  console.log(result.value);  // number - type-safe
} else {
  console.log(result.error);  // string - type-safe
}
```

**Conceito avançado:** **Result type** - tipo explícito para sucesso/erro - alternativa type-safe a exceptions.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
type APIError = ValidationError | AuthenticationError | ServerError;

app.use((err: unknown, req: Request, res: Response) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.field });
  } else if (err instanceof AuthenticationError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ServerError) {
    res.status(500).json({ error: "Internal error" });
  } else {
    res.status(500).json({ error: "Unknown error" });
  }
});
```

**Raciocínio:** Type narrowing garante handling correto por tipo.

### Form Validation

```typescript
function validateForm(data: any): ValidationError[] | null {
  const errors: ValidationError[] = [];
  
  if (!data.email) {
    errors.push(new ValidationError("Required", "email", data.email));
  }
  
  return errors.length > 0 ? errors : null;
}

const errors = validateForm({ email: "" });
if (errors) {
  // errors: ValidationError[] - type-safe
  errors.forEach(e => console.log(e.field));
}
```

**Raciocínio:** Return type explicitly documenta error type.

### Database Operations

```typescript
async function query<T>(sql: string): Promise<T> {
  try {
    return await db.execute(sql);
  } catch (e) {
    if (e instanceof Error) {
      throw new DatabaseError("Query failed", sql);
    }
    throw e;
  }
}
```

**Raciocínio:** Type narrowing antes de re-throw garante tipo consistente.

## ⚠️ Limitações e Considerações Teóricas

### Type Assertions Bypass Safety

```typescript
try {
  operacao();
} catch (e) {
  const err = e as ValidationError;  // ⚠️ Bypass type checking
  console.log(err.field);  // Pode falhar se e não é ValidationError
}
```

**Limitação:** Type assertions removem type safety - usar com cuidado.

### No Throw Type Annotations

```typescript
// ❌ TypeScript não tem sintaxe para declarar throws
function exemplo() throws ValidationError {  // Syntax error
  throw new ValidationError("Error", "field", "value");
}
```

**Consideração:** TypeScript não força declarar quais erros função lança - apenas JSDoc.

### Unknown in Libraries

```typescript
// Bibliotecas antigas ainda usam any
declare function oldLib(): void;  // Pode lançar qualquer coisa

try {
  oldLib();
} catch (e) {
  // e: unknown - não sabemos o que oldLib lança
}
```

**Limitação:** Code de terceiros pode lançar tipos desconhecidos.

## 🔗 Interconexões Conceituais

**Relação com Error Classes:** Type safety para custom error classes.

**Relação com Type Narrowing:** Instanceof refina tipo.

**Relação com Type Guards:** Funções verificam tipo de erro.

**Relação com Union Types:** Múltiplos tipos de erro possíveis.

**Relação com Never Type:** Funções que sempre lançam.

## 🚀 Evolução e Próximos Conceitos

Dominar tipagem de erros prepara para:
- **Never Type:** Funções que nunca retornam
- **Result Type Pattern:** Alternativa type-safe a exceptions
- **Error Monitoring:** Structured error tracking
- **Advanced Type Guards:** Type narrowing complexo
