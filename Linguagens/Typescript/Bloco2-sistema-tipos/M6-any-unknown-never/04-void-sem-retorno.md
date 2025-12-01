# Módulo 13: Void - Funções Sem Retorno de Valor

## 🎯 Introdução

O tipo **void** representa a **ausência de valor de retorno**. É usado principalmente para funções que executam ações mas não retornam nada significativo.

## 📋 Sumário

1. **Conceito**: O que é void
2. **Funções Void**: Declaração e uso
3. **Void vs Undefined**: Diferenças importantes
4. **Callbacks**: Void em funções callback
5. **Casos de Uso**: Aplicações práticas

## 🧠 Fundamentos

### Conceito Básico

```typescript
// Função void - não retorna valor
function logMessage(message: string): void {
    console.log(message);
    // Sem return ou return sem valor
}

// Void aceita undefined implicitamente
function doSomething(): void {
    console.log("Doing something");
    return; // OK - return vazio
    // return undefined; // OK também
    // return null; // ❌ Erro - null não é void
}
```

### Funções que Não Retornam Valor

```typescript
// Típicas funções void
function printUser(name: string, age: number): void {
    console.log(`User: ${name}, Age: ${age}`);
}

function updateDOM(element: HTMLElement, text: string): void {
    element.textContent = text;
}

function saveToLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
}

// Event handlers são geralmente void
function handleClick(event: MouseEvent): void {
    console.log("Clicked at:", event.clientX, event.clientY);
}
```

## 🔍 Void vs Undefined

### Diferença Chave

```typescript
// void - pode retornar undefined implicitamente
function voidFunction(): void {
    console.log("No explicit return");
}

// undefined - deve retornar undefined explicitamente
function undefinedFunction(): undefined {
    console.log("Must return undefined");
    return undefined; // Obrigatório
}

// Atribuição
let voidResult: void = voidFunction();      // OK
let undefResult: undefined = undefinedFunction(); // OK

// void aceita qualquer retorno em contexto de callback
type VoidCallback = () => void;
const callback: VoidCallback = () => {
    return 42; // ✓ OK - retorno ignorado
};

// undefined não aceita outros retornos
type UndefinedCallback = () => undefined;
const callback2: UndefinedCallback = () => {
    // return 42; // ❌ Erro
    return undefined; // ✓ OK
};
```

### Em Variáveis

```typescript
// void em variáveis (raro)
let voidVar: void;
voidVar = undefined;  // ✓ OK - único valor atribuível
// voidVar = null;    // ❌ Erro em modo strict
// voidVar = 0;       // ❌ Erro

// Pouco útil em variáveis
let undefinedVar: undefined = undefined; // Mais claro
```

## 🎯 Callbacks e Event Handlers

### Void em Callbacks

```typescript
// Array methods com void
const numbers = [1, 2, 3, 4, 5];

numbers.forEach((num): void => {
    console.log(num * 2);
});

// addEventListener
const button = document.querySelector("button");
button?.addEventListener("click", (e): void => {
    console.log("Button clicked", e);
});

// Custom callback types
type Logger = (message: string) => void;

const logger: Logger = (msg) => {
    console.log(`[LOG] ${msg}`);
};

function executeWithLogging(callback: Logger, message: string): void {
    console.log("Starting...");
    callback(message);
    console.log("Done");
}
```

### Flexibilidade de Void

```typescript
// Void ignora retorno em callbacks
type VoidFunc = () => void;

// Todas são válidas
const func1: VoidFunc = () => { console.log("hi"); };
const func2: VoidFunc = () => { return; };
const func3: VoidFunc = () => { return undefined; };
const func4: VoidFunc = () => { return 42; }; // ✓ OK - retorno ignorado
const func5: VoidFunc = () => "string";       // ✓ OK - retorno ignorado

// Uso prático
function runCallback(callback: VoidFunc): void {
    const result = callback(); // result é void
    // console.log(result); // void não tem valor útil
}

runCallback(() => 42); // ✓ OK - 42 é ignorado
```

## 🔍 Casos de Uso Práticos

### Side Effects

```typescript
// Funções com side effects geralmente são void
class UserService {
    private users: Map<string, User> = new Map();
    
    addUser(user: User): void {
        this.users.set(user.id, user);
        console.log(`User ${user.name} added`);
    }
    
    removeUser(id: string): void {
        this.users.delete(id);
        console.log(`User ${id} removed`);
    }
    
    logAllUsers(): void {
        this.users.forEach(user => {
            console.log(user.name);
        });
    }
}

interface User {
    id: string;
    name: string;
}
```

### Async Void (Evitar)

```typescript
// ❌ EVITAR - async void em handlers
async function badAsyncVoid(): Promise<void> {
    await fetch("/api/data");
    console.log("Done");
}

// Problema: erros não capturados
button?.addEventListener("click", async (): Promise<void> => {
    await fetch("/api/data"); // Erro silencioso se falhar
});

// ✅ MELHOR - capturar erros
button?.addEventListener("click", (): void => {
    handleClickAsync().catch(error => {
        console.error("Error:", error);
    });
});

async function handleClickAsync(): Promise<void> {
    await fetch("/api/data");
}
```

### Métodos Void

```typescript
class Logger {
    private logs: string[] = [];
    
    log(message: string): void {
        this.logs.push(`${new Date().toISOString()}: ${message}`);
        console.log(message);
    }
    
    clear(): void {
        this.logs = [];
        console.clear();
    }
    
    printAll(): void {
        this.logs.forEach(log => console.log(log));
    }
}

// Observable pattern
type Observer<T> = (value: T) => void;

class Observable<T> {
    private observers: Observer<T>[] = [];
    
    subscribe(observer: Observer<T>): void {
        this.observers.push(observer);
    }
    
    notify(value: T): void {
        this.observers.forEach(observer => observer(value));
    }
}

const observable = new Observable<number>();
observable.subscribe((value) => {
    console.log("Received:", value);
});
observable.notify(42);
```

## ⚠️ Quando NÃO Usar Void

```typescript
// ❌ EVITAR - quando valor de retorno importa
function calculateSum(a: number, b: number): void {
    return; // Desperdiça cálculo
}

// ✅ CORRETO - retornar o valor
function calculateSumCorrect(a: number, b: number): number {
    return a + b;
}

// ❌ EVITAR - Promise<void> quando resultado importa
async function fetchUserBad(): Promise<void> {
    const response = await fetch("/api/user");
    const data = await response.json();
    // Não retorna data!
}

// ✅ CORRETO - retornar dados
async function fetchUserGood(): Promise<User> {
    const response = await fetch("/api/user");
    return response.json();
}
```

---

**void** é o tipo correto para funções que executam ações sem retornar valores significativos, sendo especialmente útil em event handlers, callbacks e métodos de side effects.
