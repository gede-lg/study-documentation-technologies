# Módulo 13: Unknown - Tipo Seguro para Valores Desconhecidos

## 🎯 Introdução

O tipo **unknown** é a alternativa type-safe ao **any**, introduzido no TypeScript 3.0. Ele representa valores de tipo desconhecido mas **força verificações** antes de qualquer operação, mantendo type safety.

## 📋 Sumário

1. **Conceito**: O que é unknown e como difere de any
2. **Type Guards**: Verificações necessárias
3. **Narrowing**: Refinamento de tipos
4. **Casos de Uso**: Aplicações práticas
5. **Comparação**: unknown vs any

## 🧠 Fundamentos

### Conceito Básico

```typescript
// unknown aceita qualquer valor
let unknownValue: unknown;

unknownValue = "string";
unknownValue = 42;
unknownValue = true;
unknownValue = { name: "John" };
unknownValue = [1, 2, 3];

// Mas não permite operações sem verificação
// unknownValue.toUpperCase(); // ❌ Erro!
// unknownValue.toFixed(2);    // ❌ Erro!
```

### Requer Type Guards

```typescript
function processUnknown(value: unknown) {
    // Verificação necessária
    if (typeof value === "string") {
        console.log(value.toUpperCase()); // ✓ OK - value é string aqui
    }
    
    if (typeof value === "number") {
        console.log(value.toFixed(2)); // ✓ OK - value é number aqui
    }
    
    if (Array.isArray(value)) {
        console.log(value.length); // ✓ OK - value é array aqui
    }
}
```

## 🔍 Type Narrowing com Unknown

### Verificações Básicas

```typescript
function handleUnknown(input: unknown) {
    // typeof guard
    if (typeof input === "string") {
        return input.toLowerCase();
    }
    
    // instanceof guard
    if (input instanceof Date) {
        return input.toISOString();
    }
    
    // Array check
    if (Array.isArray(input)) {
        return input.map(item => String(item));
    }
    
    // Property check
    if (typeof input === "object" && input !== null && "name" in input) {
        const obj = input as { name: unknown };
        if (typeof obj.name === "string") {
            return obj.name;
        }
    }
    
    return "Unknown type";
}
```

### Type Guards Customizados

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value &&
        "email" in value &&
        typeof (value as User).id === "number" &&
        typeof (value as User).name === "string" &&
        typeof (value as User).email === "string"
    );
}

function processData(data: unknown) {
    if (isUser(data)) {
        // data é User aqui
        console.log(`User: ${data.name} (${data.email})`);
    }
}
```

## 🎯 Casos de Uso Práticos

### API Response Handling

```typescript
async function fetchData(url: string): Promise<unknown> {
    const response = await fetch(url);
    return response.json(); // JSON.parse retorna any, mas declaramos unknown
}

interface ApiResponse {
    success: boolean;
    data: any;
}

function isApiResponse(value: unknown): value is ApiResponse {
    return (
        typeof value === "object" &&
        value !== null &&
        "success" in value &&
        typeof (value as ApiResponse).success === "boolean"
    );
}

async function handleApiCall() {
    const result = await fetchData("/api/data");
    
    if (isApiResponse(result)) {
        if (result.success) {
            console.log("Data:", result.data);
        }
    } else {
        console.error("Invalid response format");
    }
}
```

### Error Handling

```typescript
function handleError(error: unknown) {
    if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Stack:", error.stack);
    } else if (typeof error === "string") {
        console.error("Error string:", error);
    } else if (typeof error === "object" && error !== null) {
        console.error("Error object:", JSON.stringify(error));
    } else {
        console.error("Unknown error:", error);
    }
}

try {
    throw new Error("Something went wrong");
} catch (e) {
    handleError(e); // e é unknown no TypeScript moderno
}
```

### Validação de Entrada

```typescript
interface Config {
    apiKey: string;
    timeout: number;
    retries: number;
}

function validateConfig(input: unknown): Config {
    if (typeof input !== "object" || input === null) {
        throw new Error("Config must be an object");
    }
    
    const obj = input as Record<string, unknown>;
    
    if (typeof obj.apiKey !== "string") {
        throw new Error("apiKey must be a string");
    }
    
    if (typeof obj.timeout !== "number" || obj.timeout <= 0) {
        throw new Error("timeout must be a positive number");
    }
    
    if (typeof obj.retries !== "number" || obj.retries < 0) {
        throw new Error("retries must be a non-negative number");
    }
    
    return {
        apiKey: obj.apiKey,
        timeout: obj.timeout,
        retries: obj.retries
    };
}
```

## 🔗 Comparação: unknown vs any

```typescript
// ANY - Sem segurança
function unsafeAny(value: any) {
    return value.foo.bar(); // Compila, mas pode explodir em runtime
}

// UNKNOWN - Type-safe
function safeUnknown(value: unknown) {
    // return value.foo.bar(); // ❌ Erro de compilação
    
    if (typeof value === "object" && value !== null && "foo" in value) {
        const obj = value as { foo: unknown };
        if (typeof obj.foo === "object" && obj.foo !== null && "bar" in obj.foo) {
            const nested = obj.foo as { bar: unknown };
            if (typeof nested.bar === "function") {
                return nested.bar();
            }
        }
    }
}

// Unknown é atribuível a any, mas any não é atribuível a tipos específicos sem asserção
let anyVar: any;
let unknownVar: unknown;

anyVar = unknownVar;    // ✓ OK
unknownVar = anyVar;    // ✓ OK

let strVar: string;
// strVar = unknownVar; // ❌ Erro
strVar = anyVar;        // ✓ OK (perigoso)
```

---

**unknown** é a escolha correta quando você não conhece o tipo de um valor mas quer manter type safety, forçando verificações explícitas antes do uso.
