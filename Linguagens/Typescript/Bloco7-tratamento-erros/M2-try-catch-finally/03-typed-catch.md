# Type de Erro em Catch (Typed Catch)

## 🎯 Introdução e Definição

### Definição Conceitual

**Typed catch** (ou **catch binding typing**) refere-se ao **tipo** do parâmetro de erro capturado em bloco `catch` do TypeScript. Desde **TypeScript 4.0**, o catch binding tem tipo **`unknown`** por padrão (anteriormente era `any`), forçando desenvolvedores a realizar **type narrowing** explícito antes de acessar properties do erro. Esta mudança aumenta **type safety** - previne acesso a properties inexistentes e força validação explícita do tipo de erro.

Conceitualmente, typed catch trata o problema de **erros podem ser qualquer valor** em JavaScript - não apenas `Error` instances. Código pode lançar strings, numbers, objects arbitrários, ou `null`. TypeScript 4.0+ reconhece esta realidade usando tipo `unknown` (ao invés de assumir `Error`), forçando **runtime checks** via type guards (`instanceof`, `typeof`) antes de acessar properties.

Typed catch representa **filosofia do TypeScript** - type safety sem assumptions. Ao invés de assumir que catch sempre recebe `Error`, TypeScript força verificação explícita, prevenindo runtime errors como `Cannot read property 'message' of undefined`.

### Contexto Histórico e Motivação

**JavaScript (sempre):** Qualquer valor pode ser lançado com `throw` - não apenas `Error` instances.

```javascript
throw "string error";        // Válido
throw 42;                    // Válido
throw { custom: "object" };  // Válido
throw null;                  // Válido
throw new Error("Error");    // Convenção, mas não obrigatório
```

**TypeScript < 4.0:** Catch binding tinha tipo `any` - sem type checking.

```typescript
try {
  operacao();
} catch (e) {
  // e: any
  console.log(e.message);  // ✅ Compila, mas pode falhar em runtime
}
```

**TypeScript 4.0 (2020):** Mudou catch binding para `unknown` - força type narrowing.

```typescript
try {
  operacao();
} catch (e) {
  // e: unknown
  // console.log(e.message);  // ❌ Error: Property 'message' does not exist on type 'unknown'
  
  if (e instanceof Error) {
    console.log(e.message);  // ✅ OK após type narrowing
  }
}
```

**Motivação para typed catch:**
- **Type Safety:** Prevenir acesso a properties inexistentes
- **Runtime Validation:** Forçar checks explícitos de tipo
- **Error Handling:** Lidar corretamente com erros não-Error
- **Explicit Intent:** Código documenta expectativas sobre erro

### Problema Fundamental que Resolve

Typed catch resolve o problema de **acesso inseguro a error properties** quando erro pode ser qualquer tipo.

**Problema: Catch binding como `any` (TS < 4.0)**
```typescript
// TypeScript < 4.0
try {
  throw "string error";  // Não é Error instance
} catch (e) {
  // e: any
  console.log(e.message);  // ✅ Compila, mas undefined em runtime
  console.log(e.toUpperCase());  // ✅ Compila, mas erro em runtime
}
```

**Solução: Catch binding como `unknown` (TS 4.0+)**
```typescript
// TypeScript 4.0+
try {
  throw "string error";
} catch (e) {
  // e: unknown
  // console.log(e.message);  // ❌ Compile error
  
  // Type narrowing obrigatório
  if (e instanceof Error) {
    console.log(e.message);  // ✅ Safe
  } else if (typeof e === "string") {
    console.log(e.toUpperCase());  // ✅ Safe
  } else {
    console.log("Erro desconhecido:", e);
  }
}
```

**Exemplo Real: Lidar com diferentes tipos de erro**
```typescript
async function buscarDados(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    // e: unknown
    
    // Erro de rede (TypeError)
    if (e instanceof TypeError) {
      console.error("Erro de rede:", e.message);
      return null;
    }
    
    // Erro HTTP (Error)
    if (e instanceof Error) {
      console.error("Erro HTTP:", e.message);
      return null;
    }
    
    // Erro desconhecido
    console.error("Erro desconhecido:", String(e));
    return null;
  }
}
```

**Fundamento teórico:** Typed catch **documenta** e **valida** tipos de erro esperados.

### Importância no Ecossistema

Typed catch é importante porque:

- **Type Safety:** Previne bugs de acesso a properties inexistentes
- **Explicit Validation:** Força validação de tipo antes de usar erro
- **Better Error Handling:** Encoraja diferenciação entre tipos de erro
- **Code Quality:** Código é mais robusto e menos propenso a bugs
- **TypeScript Philosophy:** Representa evolução para type safety sem assumptions

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Unknown Type:** Catch binding é `unknown` (TS 4.0+), não `any`
2. **Type Narrowing:** Obrigatório para acessar error properties
3. **Type Guards:** `instanceof`, `typeof`, custom guards para narrowing
4. **Multiple Error Types:** Lidar com Error, string, number, objects
5. **Explicit Validation:** Código documenta expectativas sobre erro

### Pilares Fundamentais

- **Unknown Default:** Catch binding tem tipo `unknown` por padrão
- **Compile-Time Safety:** TypeScript previne acesso inseguro
- **Runtime Checks:** Type guards validam tipo em runtime
- **Type Narrowing:** `instanceof Error` é padrão mais comum
- **Fallback Handling:** Lidar com erros de tipo inesperado

### Visão Geral das Nuances

- **useUnknownInCatchVariables:** Opção `tsconfig.json` para controlar tipo
- **Type Assertion:** Possível mas não recomendado (`as Error`)
- **Custom Type Guards:** Criar guards para custom errors
- **Exhaustive Checks:** Garantir todos tipos de erro são tratados
- **String Coercion:** `String(e)` como fallback seguro

## 🧠 Fundamentos Teóricos

### Como Funciona Internalmente

#### Unknown Type in Catch (TypeScript 4.0+)

```typescript
// TypeScript 4.0+
try {
  operacao();
} catch (e) {
  // e: unknown
  
  // ❌ Compile error - unknown não tem properties
  // console.log(e.message);
  // console.log(e.stack);
  
  // ✅ Type narrowing obrigatório
  if (e instanceof Error) {
    console.log(e.message);  // OK - e: Error
    console.log(e.stack);    // OK - e: Error
  }
}
```

**Análise profunda:**

**Unknown vs Any:**
- `any`: Desabilita type checking - acesso a qualquer property compila
- `unknown`: Força type checking - acesso requer narrowing

**Compilação:**
```typescript
// TypeScript
try { } catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  }
}

// JavaScript gerado (igual)
try { } catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  }
}
```

**Conceito fundamental:** `unknown` type é **compile-time only** - não adiciona runtime checks, apenas force narrowing explícito.

#### Type Narrowing with instanceof

```typescript
try {
  throw new TypeError("Erro de tipo");
} catch (e) {
  // e: unknown
  
  if (e instanceof TypeError) {
    console.log("TypeError:", e.message);
    // Dentro deste bloco, e: TypeError
  } else if (e instanceof RangeError) {
    console.log("RangeError:", e.message);
    // Dentro deste bloco, e: RangeError
  } else if (e instanceof Error) {
    console.log("Error genérico:", e.message);
    // Dentro deste bloco, e: Error
  } else {
    console.log("Erro não-Error:", String(e));
    // e ainda é unknown, mas tratado com String()
  }
}
```

**Fundamento teórico:** `instanceof` é **type guard** - TypeScript entende e **narrow type** dentro do bloco.

### Princípios e Conceitos Subjacentes

#### Handling Non-Error Throws

```typescript
// JavaScript permite throw de qualquer valor
try {
  const tipo = Math.random();
  
  if (tipo < 0.2) {
    throw "string error";
  } else if (tipo < 0.4) {
    throw 42;
  } else if (tipo < 0.6) {
    throw { code: 500, message: "Server error" };
  } else if (tipo < 0.8) {
    throw null;
  } else {
    throw new Error("Error instance");
  }
} catch (e) {
  // e: unknown
  
  // Type guard para Error
  if (e instanceof Error) {
    console.log("Error:", e.message);
  }
  // Type guard para string
  else if (typeof e === "string") {
    console.log("String error:", e);
  }
  // Type guard para number
  else if (typeof e === "number") {
    console.log("Number error:", e);
  }
  // Type guard para object
  else if (e && typeof e === "object" && "message" in e) {
    console.log("Object error:", e.message);
  }
  // Null/undefined
  else if (e === null || e === undefined) {
    console.log("Null/undefined error");
  }
  // Fallback
  else {
    console.log("Unknown error:", String(e));
  }
}
```

**Conceito crucial:** Typed catch força **lidar explicitamente** com todos tipos possíveis.

#### Custom Type Guard for Errors

```typescript
// Type guard function
function isError(e: unknown): e is Error {
  return e instanceof Error;
}

function isErrorWithMessage(e: unknown): e is { message: string } {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    typeof (e as any).message === "string"
  );
}

try {
  operacao();
} catch (e) {
  if (isError(e)) {
    console.log(e.message);  // e: Error
  } else if (isErrorWithMessage(e)) {
    console.log(e.message);  // e: { message: string }
  } else {
    console.log(String(e));
  }
}
```

**Análise profunda:** Custom type guards permitem **reuso** de lógica de narrowing.

#### Type Assertion (Not Recommended)

```typescript
try {
  operacao();
} catch (e) {
  // ❌ Type assertion - não type-safe
  const erro = e as Error;
  console.log(erro.message);  // Compila, mas pode falhar em runtime
  
  // ✅ Melhor: type guard
  if (e instanceof Error) {
    console.log(e.message);  // Type-safe
  }
}
```

**Limitação:** Type assertion **bypassa type checking** - usar apenas quando absolutamente certo do tipo.

### Modelo Mental para Compreensão

Pense em `unknown` type como **caixa lacrada**:

**Any:** Caixa aberta - pega qualquer coisa sem verificar
- Perigoso - pode não ter o que esperamos

**Unknown:** Caixa lacrada - precisa abrir e verificar antes de usar
- Seguro - verifica conteúdo antes de usar

**Type Narrowing:** Processo de abrir e verificar a caixa
- `instanceof Error`: "É um Error?"
- `typeof e === "string"`: "É string?"

## 🔍 Análise Conceitual Profunda

### useUnknownInCatchVariables Option

```json
// tsconfig.json
{
  "compilerOptions": {
    "useUnknownInCatchVariables": true  // Default desde TS 4.0
  }
}
```

**Com `true` (padrão TS 4.0+):**
```typescript
try {
  operacao();
} catch (e) {
  // e: unknown
}
```

**Com `false` (comportamento TS < 4.0):**
```typescript
try {
  operacao();
} catch (e) {
  // e: any
  console.log(e.message);  // ✅ Compila sem narrowing
}
```

**Fundamento teórico:** `useUnknownInCatchVariables` permite **opt-out** de unknown type se necessário para backward compatibility.

#### Exhaustive Error Handling

```typescript
// Garantir todos tipos são tratados
function handleError(e: unknown): string {
  if (e instanceof Error) {
    return `Error: ${e.message}`;
  }
  if (typeof e === "string") {
    return `String error: ${e}`;
  }
  if (typeof e === "number") {
    return `Number error: ${e}`;
  }
  if (typeof e === "boolean") {
    return `Boolean error: ${e}`;
  }
  if (e === null) {
    return "Null error";
  }
  if (e === undefined) {
    return "Undefined error";
  }
  if (typeof e === "object") {
    return `Object error: ${JSON.stringify(e)}`;
  }
  
  // Never deveria chegar aqui
  const _exhaustive: never = e;
  return String(_exhaustive);
}

try {
  operacao();
} catch (e) {
  console.log(handleError(e));
}
```

**Conceito avançado:** **Exhaustive checking** garante todos tipos possíveis são tratados.

### Type Narrowing Patterns

**Pattern 1: instanceof Error (mais comum)**
```typescript
try {
  operacao();
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  } else {
    console.log(String(e));
  }
}
```

**Pattern 2: typeof string**
```typescript
try {
  throw "erro string";
} catch (e) {
  if (typeof e === "string") {
    console.log(e.toUpperCase());
  }
}
```

**Pattern 3: Custom error shape**
```typescript
interface ApiError {
  status: number;
  message: string;
}

function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "status" in e &&
    "message" in e &&
    typeof (e as any).status === "number" &&
    typeof (e as any).message === "string"
  );
}

try {
  operacao();
} catch (e) {
  if (isApiError(e)) {
    console.log(`API Error ${e.status}: ${e.message}`);
  }
}
```

**Fundamento teórico:** Diferentes **type guards** para diferentes **shapes** de erro.

#### Handling Error Subclasses

```typescript
class ValidationError extends Error {
  constructor(message: string, public campo: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = "NetworkError";
  }
}

try {
  operacao();
} catch (e) {
  // Ordem importa - mais específico primeiro
  if (e instanceof ValidationError) {
    console.log(`Validation error no campo ${e.campo}: ${e.message}`);
  } else if (e instanceof NetworkError) {
    console.log(`Network error ${e.statusCode}: ${e.message}`);
  } else if (e instanceof Error) {
    console.log(`Generic error: ${e.message}`);
  } else {
    console.log(`Unknown error: ${String(e)}`);
  }
}
```

**Análise profunda:** **Ordem** de instanceof checks importa - mais específico antes de genérico.

### String Coercion as Fallback

```typescript
try {
  operacao();
} catch (e) {
  // String(e) é fallback seguro para qualquer tipo
  console.error("Erro:", String(e));
  
  // JSON.stringify pode falhar com valores circulares
  // console.log(JSON.stringify(e));  // ⚠️ Pode lançar erro
  
  // String() nunca falha
  const errorString = String(e);  // ✅ Seguro para qualquer valor
}
```

**Conceito crucial:** `String(e)` é **fallback universal** - funciona com qualquer tipo.

#### Error Logging with Type Safety

```typescript
function logError(e: unknown): void {
  // Log estruturado com type safety
  if (e instanceof Error) {
    console.error({
      type: "Error",
      name: e.name,
      message: e.message,
      stack: e.stack,
    });
  } else if (typeof e === "string") {
    console.error({
      type: "String",
      value: e,
    });
  } else if (typeof e === "number") {
    console.error({
      type: "Number",
      value: e,
    });
  } else {
    console.error({
      type: "Unknown",
      value: String(e),
    });
  }
}

try {
  operacao();
} catch (e) {
  logError(e);
}
```

**Fundamento teórico:** Type narrowing permite **logging estruturado** type-safe.

### Type Narrowing with in Operator

```typescript
interface HttpError {
  status: number;
  statusText: string;
}

try {
  operacao();
} catch (e) {
  // `in` operator para check de properties
  if (
    typeof e === "object" &&
    e !== null &&
    "status" in e &&
    "statusText" in e
  ) {
    const httpError = e as HttpError;
    console.log(`HTTP ${httpError.status}: ${httpError.statusText}`);
  }
}
```

**Conceito avançado:** `in` operator é **type guard** - TypeScript narrow type baseado em property existence.

#### Async Error Handling

```typescript
async function exemplo() {
  try {
    await operacaoAsync();
  } catch (e) {
    // e: unknown (mesmo em async)
    
    if (e instanceof Error) {
      console.error("Async error:", e.message);
    } else {
      console.error("Unknown async error:", String(e));
    }
  }
}
```

**Fundamento teórico:** Typed catch funciona **identicamente** em async functions.

### Migration from TS < 4.0

```typescript
// Código antigo (TS < 4.0)
try {
  operacao();
} catch (e) {
  // e: any
  console.log(e.message);  // ✅ Compila
}

// Migração para TS 4.0+
try {
  operacao();
} catch (e) {
  // e: unknown
  // console.log(e.message);  // ❌ Compile error
  
  // Adicionar type narrowing
  if (e instanceof Error) {
    console.log(e.message);  // ✅ OK
  }
}

// Ou usar type assertion (não recomendado, mas funciona)
try {
  operacao();
} catch (e) {
  const erro = e as Error;  // Bypass type checking
  console.log(erro.message);
}
```

**Análise profunda:** Migração requer adicionar **type guards** em todos catch blocks.

#### Error Re-throwing with Type Safety

```typescript
try {
  operacao();
} catch (e) {
  // Log erro localmente
  if (e instanceof Error) {
    console.error("Erro capturado:", e.message);
  }
  
  // Re-throw preservando tipo
  throw e;  // e ainda é unknown
}

// Melhor: transformar em Error se não for
try {
  operacao();
} catch (e) {
  if (e instanceof Error) {
    throw e;
  } else {
    throw new Error(`Unexpected error: ${String(e)}`);
  }
}
```

**Conceito avançado:** Re-throwing pode **normalizar** erros para Error instances.

### Type Narrowing with Custom Classes

```typescript
class ValidationError extends Error {
  readonly __brand = "ValidationError";  // Nominal typing
  
  constructor(message: string, public campo: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function isValidationError(e: unknown): e is ValidationError {
  return (
    e instanceof ValidationError ||
    (typeof e === "object" && e !== null && "__brand" in e && e.__brand === "ValidationError")
  );
}

try {
  throw new ValidationError("Erro", "email");
} catch (e) {
  if (isValidationError(e)) {
    console.log(`Campo ${e.campo}: ${e.message}`);
  }
}
```

**Fundamento teórico:** Custom type guards permitem **nominal typing** para erro matching preciso.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
async function buscarUsuario(id: number) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    return await response.json();
  } catch (e) {
    if (e instanceof TypeError) {
      console.error("Erro de rede:", e.message);
    } else if (e instanceof SyntaxError) {
      console.error("Erro de parsing JSON:", e.message);
    } else if (e instanceof Error) {
      console.error("Erro genérico:", e.message);
    } else {
      console.error("Erro desconhecido:", String(e));
    }
    return null;
  }
}
```

**Raciocínio:** Type narrowing permite **tratamento específico** por tipo de erro.

### Validation with Custom Errors

```typescript
class ValidationError extends Error {
  constructor(message: string, public campo: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validarEmail(email: string): void {
  if (!email.includes("@")) {
    throw new ValidationError("Email inválido", "email");
  }
}

try {
  validarEmail("invalido");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Erro no campo ${e.campo}: ${e.message}`);
  } else if (e instanceof Error) {
    console.log(`Erro genérico: ${e.message}`);
  }
}
```

**Raciocínio:** Typed catch permite **type-safe access** a custom error properties.

## ⚠️ Limitações e Considerações Teóricas

### Type Assertion Bypasses Safety

```typescript
try {
  operacao();
} catch (e) {
  const erro = e as Error;  // ❌ Assume que é Error
  console.log(erro.message);  // Pode falhar se e não for Error
}
```

**Limitação:** Type assertion **não valida** em runtime - pode causar bugs.

### instanceof Não Funciona Cross-Realm

```typescript
// Em iframe ou worker, instanceof pode falhar
try {
  operacao();
} catch (e) {
  // instanceof pode retornar false mesmo se for Error
  // se Error veio de outro realm (iframe, worker)
}
```

**Limitação:** `instanceof` verifica prototype chain - pode falhar cross-realm.

### Unknown Requer Narrowing Always

```typescript
try {
  operacao();
} catch (e) {
  // e: unknown
  // Qualquer acesso requer narrowing
  // Pode ser verboso em código grande
}
```

**Consideração:** Unknown type aumenta verbosidade - tradeoff por safety.

## 🔗 Interconexões Conceituais

**Relação com Type Guards:** Type narrowing usa type guards.

**Relação com Unknown Type:** Catch binding usa unknown como safe default.

**Relação com Custom Errors:** Type narrowing permite identificar custom errors.

**Relação com Error Handling:** Typed catch melhora robustez de error handling.

## 🚀 Evolução e Próximos Conceitos

Dominar typed catch prepara para:
- **Custom Error Classes:** Criar hierarquia type-safe de erros
- **Error Propagation:** Re-throwing com type safety
- **Advanced Type Guards:** Type guards complexos para error shapes
- **Error Monitoring:** Logging type-safe de erros
