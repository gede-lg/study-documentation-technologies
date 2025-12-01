# Módulo 14: Type Narrowing em Condicionais - Refinamento Automático de Tipos

## 🎯 Introdução

O **type narrowing** é uma das características mais poderosas do TypeScript, permitindo que o compilador **refine automaticamente** os tipos baseado em verificações condicionais. Este mecanismo garante type safety enquanto mantém flexibilidade no código.

## 📋 Sumário

1. **Control Flow Analysis**: Como TypeScript analisa fluxo de código
2. **Type Guards Básicos**: typeof, instanceof, in operator
3. **User-defined Type Guards**: Funções personalizadas de verificação
4. **Discriminated Unions**: Pattern matching com propriedades discriminantes
5. **Assertion Functions**: Garantias de tipo em runtime
6. **Limitações**: Casos onde narrowing falha

## 🧠 Fundamentos Conceituais

### Control Flow Analysis

```typescript
function processValue(input: string | number | boolean) {
    // Antes da verificação: input pode ser string | number | boolean
    console.log("Input type:", typeof input);
    
    if (typeof input === "string") {
        // Dentro deste bloco: input é definitivamente string
        console.log(input.toUpperCase()); // ✓ Métodos de string disponíveis
        console.log(input.length); // ✓ Propriedades de string disponíveis
        // input.toFixed(); // ✗ Erro: toFixed não existe em string
    }
    
    if (typeof input === "number") {
        // Aqui: input é definitivamente number
        console.log(input.toFixed(2)); // ✓ Métodos de number disponíveis
        console.log(input > 0); // ✓ Comparações numéricas
        // input.charAt(); // ✗ Erro: charAt não existe em number
    }
    
    // Após as verificações: TypeScript ainda considera o tipo original
    // porque as verificações não são exhaustivas
}
```

### Type Guards Fundamentais

```typescript
// typeof guard
function typeofGuard(value: unknown) {
    if (typeof value === "string") {
        return value.toUpperCase(); // value é string
    }
    if (typeof value === "number") {
        return value.toFixed(2); // value é number
    }
    return String(value); // value é unknown ainda
}

// instanceof guard
class User {
    name: string;
    constructor(name: string) { this.name = name; }
    greet() { return `Hello, ${this.name}`; }
}

class Admin extends User {
    permissions: string[];
    constructor(name: string, permissions: string[]) {
        super(name);
        this.permissions = permissions;
    }
    manage() { return "Managing system"; }
}

function handleUser(user: User | Admin) {
    if (user instanceof Admin) {
        // user é definitivamente Admin aqui
        console.log(user.manage()); // ✓ Método de Admin disponível
        console.log(user.permissions); // ✓ Propriedade de Admin
    }
    
    // user é User | Admin aqui (não foi refinado)
    console.log(user.greet()); // ✓ Método disponível em ambos
}

// in operator guard
interface Dog {
    breed: string;
    bark(): void;
}

interface Cat {
    color: string;
    meow(): void;
}

function petSound(pet: Dog | Cat) {
    if ("bark" in pet) {
        // pet é Dog aqui
        pet.bark(); // ✓ Método de Dog
        console.log(pet.breed); // ✓ Propriedade de Dog
    } else {
        // pet é Cat aqui (else automático)
        pet.meow(); // ✓ Método de Cat
        console.log(pet.color); // ✓ Propriedade de Cat
    }
}
```

### User-defined Type Guards

```typescript
// Type predicate functions
interface ApiSuccess {
    status: "success";
    data: any;
}

interface ApiError {
    status: "error";
    message: string;
    code: number;
}

type ApiResponse = ApiSuccess | ApiError;

// Custom type guard function
function isSuccess(response: ApiResponse): response is ApiSuccess {
    return response.status === "success";
}

function isError(response: ApiResponse): response is ApiError {
    return response.status === "error";
}

function handleApiResponse(response: ApiResponse) {
    if (isSuccess(response)) {
        // response é ApiSuccess aqui
        console.log("Data received:", response.data);
    }
    
    if (isError(response)) {
        // response é ApiError aqui
        console.error(`Error ${response.code}: ${response.message}`);
    }
}

// Type guard mais complexo
function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

function processInput(input: unknown) {
    if (isStringArray(input)) {
        // input é string[] aqui
        input.forEach(str => console.log(str.toUpperCase()));
    }
}
```

### Discriminated Unions e Pattern Matching

```typescript
// Union discriminado com type narrowing
interface LoadingState {
    type: "loading";
    progress: number;
}

interface SuccessState {
    type: "success";
    data: any;
    timestamp: number;
}

interface ErrorState {
    type: "error";
    message: string;
    retryable: boolean;
}

type AppState = LoadingState | SuccessState | ErrorState;

function renderUI(state: AppState) {
    // Pattern matching com type narrowing automático
    switch (state.type) {
        case "loading":
            // state é LoadingState aqui
            return `Loading... ${state.progress}%`;
            
        case "success":
            // state é SuccessState aqui
            return `Success at ${new Date(state.timestamp).toLocaleString()}`;
            
        case "error":
            // state é ErrorState aqui
            const retry = state.retryable ? " (can retry)" : " (final)";
            return `Error: ${state.message}${retry}`;
            
        default:
            // Exhaustiveness check
            const _exhaustive: never = state;
            throw new Error(`Unhandled state: ${_exhaustive}`);
    }
}
```

## 🔍 Análise Avançada

### Assertion Functions

```typescript
// Assert function - garante tipo ou lança erro
function assertIsNumber(value: unknown): asserts value is number {
    if (typeof value !== "number") {
        throw new Error(`Expected number, got ${typeof value}`);
    }
}

function processNumber(input: unknown) {
    assertIsNumber(input);
    // Após assertion, input é definitivamente number
    console.log(input.toFixed(2)); // ✓ Sem erro de tipo
}

// Assert function para null checking
function assertNotNull<T>(value: T | null | undefined): asserts value is T {
    if (value == null) {
        throw new Error("Value is null or undefined");
    }
}

function getUserName(user: User | null) {
    assertNotNull(user);
    // user é definitivamente User aqui
    return user.name; // ✓ Sem erro de tipo
}
```

### Narrowing com Arrays e Objects

```typescript
// Array narrowing
function processArrays(input: string[] | number[]) {
    if (input.length > 0 && typeof input[0] === "string") {
        // input é string[] aqui
        input.forEach(str => console.log(str.toUpperCase()));
    }
}

// Object shape narrowing
interface HasName {
    name: string;
}

interface HasAge {
    age: number;
}

function processObject(obj: HasName | HasAge) {
    if ("name" in obj) {
        // obj é HasName aqui
        console.log(obj.name.toUpperCase());
    }
    
    if ("age" in obj) {
        // obj é HasAge aqui
        console.log(`Age: ${obj.age} years`);
    }
}
```

## ⚠️ Limitações do Type Narrowing

### Casos onde Narrowing Falha

```typescript
// Problema: mutação após narrowing
let value: string | number = "hello";

if (typeof value === "string") {
    // value é string aqui
    console.log(value.toUpperCase()); // ✓ OK
    
    value = 42; // Mutação!
    
    // TypeScript ainda pensa que value é string
    console.log(value.toUpperCase()); // ✗ Runtime error!
}

// Solução: usar const assertions ou readonly
function safeFunctionScope(input: string | number) {
    if (typeof input === "string") {
        // input não pode ser reatribuído aqui - seguro
        return input.toUpperCase();
    }
    return input.toFixed(2);
}
```

## 🎯 Aplicações Práticas

### Sistema de Validação

```typescript
interface ValidationContext {
    errors: string[];
    warnings: string[];
}

function validateEmail(email: unknown, context: ValidationContext): email is string {
    if (typeof email !== "string") {
        context.errors.push("Email must be a string");
        return false;
    }
    
    if (!email.includes("@")) {
        context.errors.push("Email must contain @");
        return false;
    }
    
    if (email.length < 5) {
        context.warnings.push("Email seems too short");
    }
    
    return true;
}

function processEmailInput(input: unknown) {
    const context: ValidationContext = { errors: [], warnings: [] };
    
    if (validateEmail(input, context)) {
        // input é string aqui e válido
        console.log(`Processing email: ${input.toLowerCase()}`);
    } else {
        console.error("Validation failed:", context.errors);
    }
    
    if (context.warnings.length > 0) {
        console.warn("Warnings:", context.warnings);
    }
}
```

---

Type narrowing é fundamental para escrever código TypeScript type-safe e expressivo, permitindo que o compilador entenda e verifique diferentes caminhos de execução baseados em verificações condicionais.