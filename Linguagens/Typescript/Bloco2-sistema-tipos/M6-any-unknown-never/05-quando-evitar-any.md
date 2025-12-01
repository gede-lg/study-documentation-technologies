# Módulo 13: Quando Evitar Any - Boas Práticas de Type Safety

## 🎯 Introdução

O uso excessivo de **any** anula os benefícios do TypeScript. Este tópico explora **por que evitar any** e **quais alternativas usar** para manter type safety.

## 📋 Sumário

1. **Problemas do Any**: Por que any é prejudicial
2. **Alternativas**: Opções mais seguras
3. **Padrões Comuns**: Substituindo any em cenários típicos
4. **Migração**: Como remover any gradualmente
5. **Regras**: Quando any é aceitável

## 🧠 Por Que Evitar Any

### Perda de Type Safety

```typescript
// ❌ Com any - nenhuma verificação
function processData(data: any) {
    return data.foo.bar.baz(); // Compila, explode em runtime
}

// ✅ Com tipos adequados
interface Data {
    foo: {
        bar: {
            baz: () => string;
        };
    };
}

function processDataSafe(data: Data) {
    return data.foo.bar.baz(); // Type-safe
}
```

### Propagação de Any

```typescript
// any contamina código
const value: any = getData();
const result = value.transform(); // result é any
const final = result.format();    // final é any
// Toda a cadeia perde type safety

function getData(): any {
    return { transform: () => ({ format: () => "data" }) };
}
```

### Refactoring Perigoso

```typescript
interface User {
    name: string;
    email: string;
}

// ❌ Mudanças em User não são detectadas
function displayUser(user: any) {
    console.log(user.name);
    console.log(user.email);
    console.log(user.age); // Sem erro se age não existir
}

// ✅ Mudanças são detectadas
function displayUserSafe(user: User) {
    console.log(user.name);
    console.log(user.email);
    // console.log(user.age); // ❌ Erro - age não existe
}
```

## 🔍 Alternativas ao Any

### 1. Unknown para Tipos Desconhecidos

```typescript
// ❌ Evitar
function parseJSON(json: string): any {
    return JSON.parse(json);
}

// ✅ Melhor
function parseJSONSafe(json: string): unknown {
    return JSON.parse(json);
}

// Uso com type guard
interface ApiResponse {
    status: string;
    data: any;
}

function isApiResponse(value: unknown): value is ApiResponse {
    return (
        typeof value === "object" &&
        value !== null &&
        "status" in value &&
        "data" in value
    );
}

const result = parseJSONSafe('{"status":"ok","data":{}}');
if (isApiResponse(result)) {
    console.log(result.status); // Type-safe
}
```

### 2. Generics para Flexibilidade

```typescript
// ❌ Evitar
function identity(value: any): any {
    return value;
}

// ✅ Melhor
function identitySafe<T>(value: T): T {
    return value;
}

const num = identitySafe(42);        // number
const str = identitySafe("hello");   // string

// Array wrapper
function wrapInArray<T>(value: T): T[] {
    return [value];
}

const numbers = wrapInArray(5);      // number[]
const strings = wrapInArray("hi");   // string[]
```

### 3. Union Types para Múltiplas Possibilidades

```typescript
// ❌ Evitar
function formatValue(value: any): string {
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    return "unknown";
}

// ✅ Melhor
function formatValueSafe(value: string | number | boolean): string {
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    return value ? "true" : "false";
}
```

### 4. Type Assertions Específicas

```typescript
// ❌ Evitar
const element: any = document.getElementById("myId");
element.value = "text";

// ✅ Melhor
const element = document.getElementById("myId") as HTMLInputElement;
if (element) {
    element.value = "text"; // Type-safe
}

// Ainda melhor com type guard
function isInputElement(el: HTMLElement | null): el is HTMLInputElement {
    return el !== null && el.tagName === "INPUT";
}

const el = document.getElementById("myId");
if (isInputElement(el)) {
    el.value = "text";
}
```

### 5. Interfaces e Types Adequados

```typescript
// ❌ Evitar
function processConfig(config: any) {
    console.log(config.apiUrl);
    console.log(config.timeout);
}

// ✅ Melhor
interface Config {
    apiUrl: string;
    timeout: number;
    retries?: number;
}

function processConfigSafe(config: Config) {
    console.log(config.apiUrl);
    console.log(config.timeout);
    if (config.retries) {
        console.log(config.retries);
    }
}
```

## 🎯 Padrões de Substituição

### API Responses

```typescript
// ❌ Padrão ruim
async function fetchDataBad(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
}

// ✅ Padrão bom
interface User {
    id: number;
    name: string;
}

async function fetchUser(url: string): Promise<User> {
    const response = await fetch(url);
    const data: unknown = await response.json();
    
    if (isUser(data)) {
        return data;
    }
    throw new Error("Invalid user data");
}

function isUser(value: unknown): value is User {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "name" in value
    );
}
```

### Event Handlers

```typescript
// ❌ Evitar
function handleEventBad(event: any) {
    console.log(event.target.value);
}

// ✅ Melhor
function handleEvent(event: Event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
        console.log(target.value);
    }
}

// Ainda melhor com tipo específico
function handleInputChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        const value = event.target.value;
        console.log(value.trim());
    }
}
```

### Bibliotecas Externas

```typescript
// ❌ Evitar
import * as lib from "untyped-library";
const result: any = lib.doSomething();

// ✅ Melhor - criar tipos
declare module "untyped-library" {
    export function doSomething(): string;
    export function processData(data: unknown): { result: boolean };
}

import * as lib from "untyped-library";
const result: string = lib.doSomething(); // Type-safe
```

## 🚀 Migração Gradual

### Estratégia de Remoção

```typescript
// Passo 1: Identificar any com strict mode
// tsconfig.json: "noImplicitAny": true

// Passo 2: Substituir any por unknown
function step1(data: unknown) { // Era any
    // Adicionar type guards
    if (typeof data === "object" && data !== null) {
        // Processar
    }
}

// Passo 3: Criar interfaces específicas
interface ProcessedData {
    value: string;
    count: number;
}

function step2(data: ProcessedData) { // Era unknown
    console.log(data.value, data.count);
}

// Passo 4: Adicionar validação
function validateData(input: unknown): ProcessedData {
    if (
        typeof input === "object" &&
        input !== null &&
        "value" in input &&
        "count" in input &&
        typeof (input as ProcessedData).value === "string" &&
        typeof (input as ProcessedData).count === "number"
    ) {
        return input as ProcessedData;
    }
    throw new Error("Invalid data format");
}
```

## ⚠️ Quando Any É Aceitável

```typescript
// ✓ Aceitável: Migração gradual de JavaScript
// TODO: Tipar adequadamente
function legacyFunction(data: any) {
    return data.process();
}

// ✓ Aceitável: Prototipagem rápida (temporário)
function prototype(input: any) {
    // TODO: Adicionar tipos depois
    return input;
}

// ✓ Aceitável: Wrapper para biblioteca sem tipos
function libraryWrapper(options: any) {
    return externalLib.call(options);
}

declare const externalLib: { call: (opts: any) => any };

// ❌ NÃO aceitável: Código de produção novo
// Sempre use alternativas type-safe
```

## 📊 Checklist de Alternativas

```typescript
// Antes de usar any, pergunte:

// 1. Posso usar unknown?
let value: unknown; // ✓ Força type guards

// 2. Posso usar generics?
function generic<T>(input: T): T { return input; } // ✓ Type-safe

// 3. Posso usar union types?
type Multi = string | number | boolean; // ✓ Cobre possibilidades

// 4. Posso criar interface/type?
interface Specific { prop: string; } // ✓ Define estrutura

// 5. Posso usar type assertion?
const typed = value as SpecificType; // ✓ Específico

// 6. É realmente necessário?
// Se sim, limite escopo e documente
```

---

**Evitar any** mantém os benefícios do TypeScript: detecção de erros em tempo de compilação, autocomplete, refactoring seguro e documentação viva do código.
