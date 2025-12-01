# Call Stack

## 🎯 Introdução e Definição

### Definição Conceitual

**Call Stack** (pilha de chamadas) é **estrutura de dados LIFO** (Last-In-First-Out) que **gerencia execução de funções** em JavaScript/TypeScript. Cada **chamada de função** cria **stack frame** (quadro de pilha) contendo **contexto de execução** (variáveis locais, parâmetros, endereço de retorno). Quando função **completa**, seu **frame é removido** (pop) do topo da pilha. Call stack **executa código síncronamente** - apenas uma função por vez (single-threaded execution).

Conceitualmente, call stack implementa **sequential execution model** - funções executam **até completarem** antes de próxima executar. Segue **synchronous semantics** - cada função bloqueia até terminar. TypeScript/JavaScript engines (V8, SpiderMonkey) implementam call stack com **limite de tamanho** - stack overflow ocorre quando **profundidade excede limite** (tipicamente ~10,000-15,000 frames).

**Fundamento teórico:** Call stack deriva de **activation records** em teoria de compiladores - registro que mantém estado de execução de função. Implementa **LIFO discipline** - última função chamada é primeira a retornar. Suporta **nested function calls** - funções podem chamar outras funções, criando **pilha de contextos aninhados**. É **deterministic** - mesma sequência de chamadas produz mesma pilha.

**Pattern básico:**
```typescript
// Call stack - LIFO execution

function third() {
  console.log("3. In third");
  console.trace("Stack trace");  // Mostra call stack
  // Call stack: third → second → first → global
}

function second() {
  console.log("2. In second");
  third();  // Push third() na stack
  console.log("5. Back in second");
  // third() completou, foi removed da stack
}

function first() {
  console.log("1. In first");
  second();  // Push second() na stack
  console.log("6. Back in first");
  // second() completou, foi removed da stack
}

first();  // Push first() na stack
console.log("7. Global scope");
// first() completou, stack está vazia

/*
Execução:
1. first() pushed → stack: [first]
2. second() pushed → stack: [first, second]
3. third() pushed → stack: [first, second, third]
4. third() completa, popped → stack: [first, second]
5. second() completa, popped → stack: [first]
6. first() completa, popped → stack: []
7. Volta para global scope
*/
```

**Stack frames structure:**
```typescript
// Stack frame - contexto de execução

function multiply(a: number, b: number): number {
  const result = a * b;  // Variável local
  return result;
}

function calculate(x: number, y: number): number {
  const doubled = x * 2;     // Variável local de calculate
  const tripled = y * 3;     // Variável local de calculate
  return multiply(doubled, tripled);  // Chama multiply
}

calculate(5, 10);

/*
Call stack quando dentro de multiply():

┌─────────────────────────────┐  ← Topo (executing)
│ multiply() frame            │
│ - a: 10                     │
│ - b: 30                     │
│ - result: 300               │
│ - return address: calculate │
├─────────────────────────────┤
│ calculate() frame           │
│ - x: 5                      │
│ - y: 10                     │
│ - doubled: 10               │
│ - tripled: 30               │
│ - return address: global    │
├─────────────────────────────┤
│ Global execution context    │
└─────────────────────────────┘  ← Base

Quando multiply() retorna:
- multiply() frame removido
- Execução volta para calculate()
- calculate() recebe valor 300
*/
```

**Stack visualization:**
```typescript
// Visualização do call stack

function levelThree() {
  console.log("Level 3");
  debugger;  // Pausa aqui - veja call stack no DevTools
  // Stack: [global, levelOne, levelTwo, levelThree]
}

function levelTwo() {
  console.log("Level 2");
  levelThree();  // Push levelThree
}

function levelOne() {
  console.log("Level 1");
  levelTwo();  // Push levelTwo
}

levelOne();  // Push levelOne

/*
Progressão da stack:

1. Início: []
2. levelOne() chamado: [levelOne]
3. levelTwo() chamado: [levelOne, levelTwo]
4. levelThree() chamado: [levelOne, levelTwo, levelThree]
5. levelThree() retorna: [levelOne, levelTwo]
6. levelTwo() retorna: [levelOne]
7. levelOne() retorna: []
8. Fim: []
*/
```

### Contexto Histórico e Evolução

**Anos 1950:** Call stack concept.

```
ALGOL 60 - primeira linguagem com recursão
- Call stack para suportar recursive calls
- Stack frames para variáveis locais
```

**Anos 1970:** Stack-based execution model.

```
C language - explicit stack semantics
- Stack allocation para variáveis locais
- Stack overflow errors
```

**1995:** JavaScript criado - call stack desde início.

```javascript
// JavaScript 1.0 - call stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // Recursive stack
}
```

**2009:** V8 engine (Chrome) - optimized stack.

```javascript
// V8 - optimized call stack
// Stack size limit: ~10,000 frames
// Stack overflow detection
```

**TypeScript 1.0 (2012):** Types sobre call stack.

```typescript
// TypeScript - typed stack frames
function typed(x: number): number {
  return x * 2;
}
// Stack frame tem type information
```

**ES2015 (ES6):** Error.stack standardization.

```javascript
// ES6 - stack traces
try {
  throw new Error("Test");
} catch (error) {
  console.log(error.stack);  // Stack trace string
}
```

**Modern (2020+):** Developer tools integration.

```typescript
// Modern DevTools - stack visualization
console.trace("Current stack");  // Print stack
debugger;  // Pause and inspect stack

// Browser DevTools mostra:
// - Call stack panel
// - Frame-by-frame inspection
// - Variable inspection per frame
```

### Problema Fundamental que Resolve

Call stack resolve problemas de **function execution order**, **context isolation**, **return address tracking**, e **local state management**.

**Problema 1: Track Function Execution Order**
```typescript
// Sem call stack - impossível determinar ordem ❌

// Imagine código sem stack - como saber onde retornar?
function processData(data: string) {
  const parsed = parseData(data);
  const validated = validateData(parsed);
  return validated;
}

// Quando parseData() completa, como voltar para processData()?
// Como saber linha exata onde continuar?
// ✗ Sem stack, seria impossível
```

**Solução: Call stack mantém return address**
```typescript
// Call stack - track return addresses ✅

function parseData(data: string): object {
  console.log("Parsing...");
  return JSON.parse(data);
  // Stack sabe: retornar para processData, linha do assignment
}

function validateData(obj: object): object {
  console.log("Validating...");
  return obj;
  // Stack sabe: retornar para processData, linha do assignment
}

function processData(data: string) {
  const parsed = parseData(data);      // Stack: return address = aqui
  const validated = validateData(parsed);  // Stack: return address = aqui
  return validated;
}

// Call stack armazena:
// 1. Qual função chamou
// 2. Qual linha voltar
// 3. Variáveis locais da caller
```

**Problema 2: Local Variable Isolation**
```typescript
// Sem call stack - variáveis não isoladas ❌

// Imagine todas funções compartilhando variáveis
let sharedX: number;
let sharedY: number;

function multiply() {
  // ✗ Como garantir que 'x' e 'y' são desta chamada específica?
  // Se outra função também usa x/y, conflito!
  return sharedX * sharedY;
}

function calculate() {
  sharedX = 10;
  sharedY = 20;
  const result = multiply();
  // Se multiply() chamar outra função que modifica sharedX/sharedY,
  // valores podem estar incorretos quando multiply() retorna
}
```

**Solução: Stack frame isola variáveis**
```typescript
// Call stack - isolated stack frames ✅

function multiply(a: number, b: number): number {
  // 'a' e 'b' vivem no stack frame de multiply()
  // Isolados de outras chamadas
  const result = a * b;  // 'result' também isolado
  return result;
}

function calculate(x: number, y: number): number {
  // 'x' e 'y' vivem no stack frame de calculate()
  // Isolados de multiply()
  const doubled = x * 2;
  return multiply(doubled, y);
}

// Cada chamada tem seu próprio frame
// Variáveis não conflitam
calculate(5, 10);  // x=5, y=10 no frame de calculate
                   // a=10, b=10 no frame de multiply
```

**Problema 3: Nested Function Calls**
```typescript
// Sem call stack - chamadas aninhadas impossíveis ❌

// Como rastrear múltiplas funções chamando múltiplas funções?
function outer() {
  function inner() {
    function innerMost() {
      // ✗ Como voltar por todas camadas?
      // ✗ Como saber estado de cada função?
    }
    innerMost();
  }
  inner();
}
```

**Solução: Stack empilha frames**
```typescript
// Call stack - stacked frames ✅

function innerMost(): string {
  console.log("InnerMost");
  return "Done";
  // Stack: [global, outer, inner, innerMost]
}

function inner(): string {
  console.log("Inner");
  const result = innerMost();  // Push innerMost
  console.log("Back in inner");
  return result;
  // innerMost popped, stack: [global, outer, inner]
}

function outer(): string {
  console.log("Outer");
  const result = inner();  // Push inner
  console.log("Back in outer");
  return result;
  // inner popped, stack: [global, outer]
}

outer();
// Stack progride: [] → [outer] → [outer,inner] → [outer,inner,innerMost]
//                 ← [outer,inner] ← [outer] ← []
```

**Problema 4: Recursion Support**
```typescript
// Sem call stack - recursão impossível ❌

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
  // ✗ Como rastrear cada chamada recursiva?
  // ✗ Como saber qual 'n' pertence a qual invocação?
}

// factorial(5) chama factorial(4) chama factorial(3)...
// Sem stack, não sabemos onde estamos
```

**Solução: Stack frame por invocação recursiva**
```typescript
// Call stack - recursion via stacked frames ✅

function factorial(n: number): number {
  console.log(`Called with n=${n}`);
  
  if (n <= 1) {
    console.log("Base case, returning 1");
    return 1;
  }
  
  const result = n * factorial(n - 1);
  console.log(`Returning ${result} for n=${n}`);
  return result;
}

factorial(5);

/*
Call stack durante recursão:

1. factorial(5) → stack: [factorial(5)]
2. factorial(4) → stack: [factorial(5), factorial(4)]
3. factorial(3) → stack: [factorial(5), factorial(4), factorial(3)]
4. factorial(2) → stack: [factorial(5), factorial(4), factorial(3), factorial(2)]
5. factorial(1) → stack: [factorial(5), ..., factorial(2), factorial(1)]
6. Base case → retorna 1, pop factorial(1)
7. factorial(2) calcula 2*1=2, pop factorial(2)
8. factorial(3) calcula 3*2=6, pop factorial(3)
9. factorial(4) calcula 4*6=24, pop factorial(4)
10. factorial(5) calcula 5*24=120, pop factorial(5)
11. Stack vazia, retorna 120

Cada invocação recursiva tem seu próprio 'n'!
*/
```

**Fundamento teórico:** Call stack implementa **activation record management** - rastrear execução através de **stack discipline** que preserva **calling context**.

### Importância no Ecossistema

Call stack é importante porque:

- **Execution order:** Define ordem de execução (LIFO)
- **Context isolation:** Isola variáveis locais
- **Return tracking:** Sabe onde retornar
- **Recursion support:** Permite chamadas recursivas
- **Error tracking:** Stack traces para debugging
- **Debugger integration:** DevTools mostram stack
- **Synchronous model:** Base para execution síncrono
- **Memory layout:** Define como memória organizada

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **LIFO structure:** Last-In-First-Out
2. **Stack frames:** Context per function call
3. **Synchronous execution:** One function at a time
4. **Return address:** Where to resume after call
5. **Local variables:** Isolated per frame

### Pilares Fundamentais

- **Push:** Add frame quando função chamada
- **Pop:** Remove frame quando função retorna
- **Frame contents:** Parameters, locals, return address
- **Stack limit:** Finite size (~10,000 frames)
- **Stack overflow:** Exceed limit error

### Visão Geral das Nuances

- **Single-threaded:** Um frame ativo por vez
- **Debugger visibility:** DevTools mostram stack
- **Error.stack:** Stack trace em exceptions
- **Tail call optimization:** Reusa frames (limitado)
- **Recursion depth:** Stack size limita recursão

## 🧠 Fundamentos Teóricos

### Basic Call Stack

```typescript
// Basic call stack - sequential execution

function add(a: number, b: number): number {
  console.log("add called");
  return a + b;
  // Stack: [global, add]
}

function calculate(): void {
  console.log("calculate called");
  const result = add(5, 10);  // Push add
  console.log("Result:", result);
  // add popped, stack: [global, calculate]
}

calculate();  // Push calculate
// calculate popped, stack: []

/*
Progression:
1. [] (empty)
2. [calculate] (pushed)
3. [calculate, add] (pushed)
4. [calculate] (add popped)
5. [] (calculate popped)
*/
```

**Basic:** Push/pop discipline.

### Princípios e Conceitos Subjacentes

#### Stack Trace Inspection

```typescript
// Stack trace - debugging tool

function deepFunction(): void {
  console.trace("Stack trace at deepFunction");
  // Mostra call stack completo
  
  throw new Error("Error in deepFunction");
}

function middleFunction(): void {
  deepFunction();
}

function topFunction(): void {
  middleFunction();
}

try {
  topFunction();
} catch (error) {
  console.log("Error stack:");
  console.log((error as Error).stack);
  /*
  Stack trace mostra:
  deepFunction (at line X)
  middleFunction (at line Y)
  topFunction (at line Z)
  global scope (at line W)
  */
}
```

**Stack Trace:** Debugging aid.

#### Recursive Stack Frames

```typescript
// Recursion - múltiplos frames da mesma função

function countdown(n: number): void {
  console.log(n);
  
  if (n <= 0) {
    console.log("Blastoff!");
    console.trace("Stack at base case");
    return;
  }
  
  countdown(n - 1);  // Recursive call
}

countdown(5);

/*
Call stack progression:

countdown(5) → [countdown(5)]
countdown(4) → [countdown(5), countdown(4)]
countdown(3) → [countdown(5), countdown(4), countdown(3)]
countdown(2) → [countdown(5), countdown(4), countdown(3), countdown(2)]
countdown(1) → [countdown(5), ..., countdown(2), countdown(1)]
countdown(0) → [countdown(5), ..., countdown(1), countdown(0)]
Base case    → Stack unwinds (pop cada frame)

Cada frame tem seu próprio 'n':
- countdown(5) frame: n=5
- countdown(4) frame: n=4
- countdown(3) frame: n=3
- etc.
*/
```

**Recursion:** Frame per invocation.

### Stack Overflow Example

```typescript
// Stack overflow - exceed limit

function infiniteRecursion(count: number): number {
  console.log(`Call ${count}`);
  return infiniteRecursion(count + 1);  // Never stops
}

try {
  infiniteRecursion(0);
} catch (error) {
  console.error("Stack overflow!");
  console.error((error as Error).message);
  // RangeError: Maximum call stack size exceeded
}

/*
Stack cresce indefinidamente:
[infiniteRecursion(0)]
[infiniteRecursion(0), infiniteRecursion(1)]
[infiniteRecursion(0), infiniteRecursion(1), infiniteRecursion(2)]
...
[infiniteRecursion(0), ..., infiniteRecursion(9999)]
[infiniteRecursion(0), ..., infiniteRecursion(10000)] ← OVERFLOW!

Engine detecta limite excedido → RangeError
*/
```

**Stack Overflow:** Recursion too deep.

#### Frame Variable Inspection

```typescript
// Variáveis isoladas por frame

function outer(x: number): void {
  const outerVar = "outer";
  console.log(`outer: x=${x}, outerVar=${outerVar}`);
  
  function inner(y: number): void {
    const innerVar = "inner";
    console.log(`inner: y=${y}, innerVar=${innerVar}`);
    console.log(`inner can access x: ${x}`);  // Closure
    console.log(`inner can access outerVar: ${outerVar}`);  // Closure
    
    debugger;  // Pause - inspect frames in DevTools
    /*
    Frame de inner():
    - y: 10
    - innerVar: "inner"
    - Closure scope (outer frame):
      - x: 5
      - outerVar: "outer"
    
    Frame de outer():
    - x: 5
    - outerVar: "outer"
    */
  }
  
  inner(10);
}

outer(5);

/*
Call stack:
┌──────────────────┐
│ inner frame      │
│ - y: 10          │
│ - innerVar       │
├──────────────────┤
│ outer frame      │
│ - x: 5           │
│ - outerVar       │
├──────────────────┤
│ global           │
└──────────────────┘
*/
```

**Frame Isolation:** Variables scoped to frame.

### Real-World Example - Expression Evaluation

```typescript
// Complex expression - multiple stack frames

function multiply(a: number, b: number): number {
  console.log(`multiply(${a}, ${b})`);
  return a * b;
}

function add(a: number, b: number): number {
  console.log(`add(${a}, ${b})`);
  return a + b;
}

function subtract(a: number, b: number): number {
  console.log(`subtract(${a}, ${b})`);
  return a - b;
}

function evaluateExpression(): number {
  console.log("evaluateExpression started");
  
  // (5 + 3) * (10 - 2)
  const sum = add(5, 3);        // Push add, compute, pop
  const diff = subtract(10, 2);  // Push subtract, compute, pop
  const result = multiply(sum, diff);  // Push multiply, compute, pop
  
  console.log("evaluateExpression finished");
  return result;
}

const finalResult = evaluateExpression();
console.log("Final result:", finalResult);

/*
Call stack progression:

1. [evaluateExpression]
2. [evaluateExpression, add]           ← add(5, 3)
3. [evaluateExpression]                ← add popped, sum=8
4. [evaluateExpression, subtract]      ← subtract(10, 2)
5. [evaluateExpression]                ← subtract popped, diff=8
6. [evaluateExpression, multiply]      ← multiply(8, 8)
7. [evaluateExpression]                ← multiply popped, result=64
8. []                                  ← evaluateExpression popped

Output:
evaluateExpression started
add(5, 3)
subtract(10, 2)
multiply(8, 8)
evaluateExpression finished
Final result: 64
*/
```

**Real-World:** Expression evaluation order.

#### Modelo Mental para Compreensão

Pense em call stack como **stack of plates**:

**Plates:** Stack frames
**Add plate:** Push (function call)
**Remove plate:** Pop (function return)
**Top plate:** Currently executing function
**Can only access top:** Executa apenas topo
**LIFO:** Last added, first removed

**Analogia - Books on Desk:**

**Open book:** Função executando
**Place new book on top:** Chamar nova função
**Finish top book:** Função retorna
**Resume previous book:** Volta para caller
**Stack of books:** Call stack

**Metáfora - Nested Function Calls as Recursive Tasks:**

**Task:** Função
**Subtask:** Função chamada
**Pause current task:** Push new frame
**Complete subtask:** Pop frame
**Resume paused task:** Retomar caller
**Task stack:** Call stack

**Fluxo visual:**
```
Function calls:
main() → funcA() → funcB()

Stack progression:
[main]
[main, funcA]
[main, funcA, funcB]  ← funcB executing
[main, funcA]         ← funcB returned
[main]                ← funcA returned
[]                    ← main returned
```

## 🔍 Análise Conceitual Profunda

### Stack Frame Contents

```typescript
// Stack frame - complete context

function complexFunction(
  param1: number,
  param2: string
): { result: number; message: string } {
  // Frame contents:
  // - Parameters: param1, param2
  // - Local variables: localVar, obj
  // - Return address: where to resume in caller
  // - this binding (if method)
  
  const localVar = param1 * 2;
  const obj = { result: localVar, message: param2 };
  
  debugger;  // Inspect frame in DevTools
  /*
  Frame visualization:
  ┌──────────────────────────────┐
  │ complexFunction frame        │
  │ - param1: 10                 │
  │ - param2: "test"             │
  │ - localVar: 20               │
  │ - obj: {result:20, message:"test"} │
  │ - return address: caller line X │
  └──────────────────────────────┘
  */
  
  return obj;
}

complexFunction(10, "test");
```

**Frame Contents:** Complete execution context.

#### Tail Call Optimization (Limited in JS)

```typescript
// Tail call - recursion no último statement

// ✗ NOT tail call - multiplication após recursive call
function factorialNonTail(n: number): number {
  if (n <= 1) return 1;
  return n * factorialNonTail(n - 1);  // Multiplication AFTER call
  // Stack acumula: [fact(5), fact(4), fact(3), fact(2), fact(1)]
}

// ✓ Tail call - nada após recursive call (com accumulator)
function factorialTail(n: number, accumulator: number = 1): number {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // Nothing after call
  // Teoricamente, stack poderia reusar frame
  // Mas JS/TS engines raramente otimizam
}

/*
Tail Call Optimization (TCO):
- Engine pode reusar stack frame
- Evita stack growth
- Importante em linguagens funcionais (Scheme, Haskell)
- JavaScript: TCO especificado em ES6, mas pouco implementado
- TypeScript: Não garante TCO

Prática: Evite recursão muito profunda em JS/TS
*/
```

**TCO:** Limited support in JS/TS.

### Error Stack Traces

```typescript
// Error stack - debugging information

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

function level3(): void {
  throw new CustomError("Error at level 3");
}

function level2(): void {
  level3();
}

function level1(): void {
  level2();
}

try {
  level1();
} catch (error) {
  const err = error as CustomError;
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);
  console.error("Error stack:");
  console.error(err.stack);
  
  /*
  Stack trace output:
  CustomError: Error at level 3
    at level3 (file.ts:X:Y)
    at level2 (file.ts:A:B)
    at level1 (file.ts:C:D)
    at <global> (file.ts:E:F)
  
  Mostra exatamente:
  - Onde erro foi lançado (level3)
  - Caminho completo de chamadas (level3 ← level2 ← level1 ← global)
  - Line numbers para cada frame
  */
}
```

**Stack Trace:** Error debugging aid.

#### Async vs Sync Stack

```typescript
// Call stack - apenas funções síncronas

console.log("1. Start");

setTimeout(() => {
  console.log("3. Timeout callback");
  // Esta função NÃO está no call stack quando log "2" executa
  // Executará DEPOIS que call stack esvaziar
}, 0);

console.log("2. End");

/*
Call stack durante execução:

1. [global] → log "1. Start"
2. [global, setTimeout] → schedule callback
3. [global] → setTimeout popped
4. [global] → log "2. End"
5. [] → global popped, stack vazia
6. Event loop pega callback do task queue
7. [timeout callback] → log "3. Timeout callback"
8. [] → callback popped

Output:
1. Start
2. End
3. Timeout callback  ← DEPOIS que stack esvaziou

Call stack é síncrono - não contém async callbacks
*/
```

**Async:** Callbacks não ficam na stack.

## 🎯 Aplicabilidade e Contextos

### Debugging with Stack

```typescript
function buggyCode(x: number): number {
  debugger;  // Pause - inspect call stack
  return x * 2;
}

function caller(): void {
  buggyCode(5);
}

caller();
// DevTools mostra stack: caller → buggyCode
```

**Raciocínio:** Stack inspection para debugging.

### Recursion Implementation

```typescript
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
  // Stack gerencia recursive calls
}
```

**Raciocínio:** Stack suporta recursão.

### Error Handling - Stack Trace

```typescript
try {
  riskyOperation();
} catch (error) {
  console.error((error as Error).stack);
  // Stack trace mostra onde erro ocorreu
}
```

**Raciocínio:** Stack trace para errors.

## ⚠️ Limitações e Considerações Teóricas

### Stack Size Limit

```typescript
// Stack overflow - recursão muito profunda

function deepRecursion(n: number): number {
  if (n >= 15000) {
    // Típico limite: ~10,000-15,000 frames
    throw new Error("Would overflow");
  }
  return deepRecursion(n + 1);
}

try {
  deepRecursion(0);
} catch (error) {
  console.error("Stack limit reached");
  // RangeError: Maximum call stack size exceeded
}
```

**Limitação:** Finite stack size.

### No Tail Call Optimization

```typescript
// TCO não funciona na prática

function tailRecursive(n: number, acc: number = 0): number {
  if (n <= 0) return acc;
  return tailRecursive(n - 1, acc + n);
  // Mesmo sendo tail call, ainda cresce stack
}

// Solução: Use loop instead
function iterative(n: number): number {
  let acc = 0;
  for (let i = n; i > 0; i--) {
    acc += i;
  }
  return acc;  // Não usa stack recursivamente
}
```

**Consideração:** Prefer iteration over deep recursion.

### Async Code Not on Stack

```typescript
// Async callbacks não ficam no call stack durante espera

async function asyncFunc(): Promise<void> {
  console.log("Start");
  await delay(1000);  // Stack esvazia durante await
  console.log("After delay");
}

asyncFunc();
// asyncFunc não fica na stack durante delay
// Apenas quando código síncrono executando
```

**Consideração:** Stack apenas código síncrono.

## 🔗 Interconexões Conceituais

**Relação com Event Loop:** Stack must be empty for async callbacks.

**Relação com Recursion:** Stack enables recursive calls.

**Relação com Errors:** Stack trace em exceptions.

**Relação com Debugging:** DevTools mostram stack.

**Relação com Closures:** Inner functions access outer frames.

## 🚀 Evolução e Próximos Conceitos

Dominar Call Stack prepara para:
- **Event Loop:** Como async code executa
- **Task Queue:** Callbacks waiting for stack
- **Microtask Queue:** Promise callbacks
- **Memory management:** Stack vs heap allocation
- **Performance:** Stack frame costs
- **Debugging tools:** Advanced stack inspection
