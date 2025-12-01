# Funções como Retorno

## 🎯 Introdução e Definição

### Definição Conceitual

**Funções como retorno** referem-se à capacidade de **retornar funções de outras funções**, permitindo que funções **criem e retornem novas funções dinamicamente**. Em TypeScript, funções são **first-class values** - podem ser retornadas como qualquer outro valor. Quando uma função **retorna outra função**, ela é chamada **higher-order function** (função de alta ordem), e a função retornada é chamada **closure** quando captura variáveis do escopo externo.

Conceitualmente, retornar funções implementa **factory pattern** - função externa **fabrica** funções customizadas baseadas em parâmetros. TypeScript adiciona **type safety** - função retornada tem **tipo de função** especificado, garantindo assinatura correta em compile-time. Pattern permite **configuração prévia** - criar funções especializadas a partir de função genérica.

**Fundamento teórico:** Funções que retornam funções implementam **partial application** e **currying** - fixar alguns argumentos de função e retornar nova função que aceita argumentos restantes. Promove **code reuse** - criar variações de função sem duplicação. Closure permite **encapsulation** - função retornada mantém acesso a variáveis do escopo externo mesmo após função externa terminar.

**Function Returning Function Pattern**:
```
function outer(config: Config): (input: Input) => Output {
  // Lógica de configuração
  return (input: Input) => {
    // Usa config e input
    return output;
  };
}
```

### Contexto Histórico e Evolução

**Lisp (1958):** Primeiro language com **first-class functions** - retornar funções naturalmente.

**Scheme (1975):** **Closures** - função retornada captura ambiente léxico.

**JavaScript ES3 (1999):** Closures suportados - funções podem retornar funções.

```javascript
// JavaScript - retornar função (sem tipos)
function createMultiplier(factor) {
  return function(n) {  // Closure - captura 'factor'
    return n * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**JavaScript ES6 (2015):** **Arrow functions** simplificam retorno de funções.

```javascript
// ES6 - arrow function retorna arrow function
const createMultiplier = (factor) => (n) => n * factor;

const double = createMultiplier(2);
console.log(double(5));  // 10
```

**TypeScript 1.0 (2012):** **Type annotations** para funções retornadas.

```typescript
// TypeScript - tipo de função retornada
function createMultiplier(factor: number): (n: number) => number {
  return (n: number) => n * factor;  // ✅ Type safe
}

const double = createMultiplier(2);
console.log(double(5));  // 10 (type: number)
console.log(double("5"));  // ❌ Error - tipo incorreto
```

**TypeScript 2.0 (2016):** **Generic return types** - funções retornadas genéricas.

```typescript
// Generic - tipo de retorno parametrizado
function createMapper<T, U>(fn: (item: T) => U): (arr: T[]) => U[] {
  return (arr: T[]) => arr.map(fn);
}

const doubleMapper = createMapper((n: number) => n * 2);
console.log(doubleMapper([1, 2, 3]));  // [2, 4, 6]
```

**TypeScript 3.0 (2018):** **Tuple types** em retornos - múltiplas funções retornadas.

```typescript
// Retornar tupla de funções
function createCounterOps(): [(n: number) => void, () => number] {
  let count = 0;
  return [
    (n: number) => { count += n; },  // Increment
    () => count  // Get
  ];
}

const [increment, getCount] = createCounterOps();
increment(5);
console.log(getCount());  // 5
```

**Evolução de práticas:**

**Era JavaScript (sem tipos):**
```javascript
// Sem type safety - tipo de retorno desconhecido
function createAdder(x) {
  return function(y) {  // Tipo de y?
    return x + y;  // Tipo de retorno?
  };
}
```

**Era TypeScript (tipado):**
```typescript
// Type safety - tipos explícitos
function createAdder(x: number): (y: number) => number {
  return (y: number) => x + y;  // ✅ Tudo tipado
}
```

### Problema Fundamental que Resolve

Funções como retorno resolvem problemas de **configuração repetitiva**, **código duplicado**, e **falta de especialização**.

**Problema 1: Configuração repetitiva**
```typescript
// Sem factory - configuração repetida
function applyDiscount10(price: number): number {
  return price * 0.9;  // 10% discount
}

function applyDiscount20(price: number): number {
  return price * 0.8;  // 20% discount
}

function applyDiscount30(price: number): number {
  return price * 0.7;  // 30% discount
}

// Mais funções para outros percentuais... ❌ Duplicação
```

**Solução: Factory function retorna função especializada**
```typescript
// Factory - cria funções de desconto
function createDiscounter(percentage: number): (price: number) => number {
  return (price: number) => price * (1 - percentage / 100);
}

// Criar funções especializadas
const discount10 = createDiscounter(10);
const discount20 = createDiscounter(20);
const discount30 = createDiscounter(30);

// Usar
console.log(discount10(100));  // 90
console.log(discount20(100));  // 80
console.log(discount30(100));  // 70
```

**Problema 2: Falta de type safety em closures**
```javascript
// JavaScript - closure sem tipos
function createGreeter(greeting) {
  return function(name) {  // ⚠️ Tipo de name?
    return greeting + ", " + name;  // Tipo de retorno?
  };
}

const greet = createGreeter("Hello");
console.log(greet(123));  // "Hello, 123" - bug sutil
```

**Solução: TypeScript garante tipos**
```typescript
// TypeScript - tipos garantidos
function createGreeter(greeting: string): (name: string) => string {
  return (name: string) => `${greeting}, ${name}`;  // ✅ Type safe
}

const greet = createGreeter("Hello");
console.log(greet("Alice"));  // ✅ OK - "Hello, Alice"
console.log(greet(123));  // ❌ Error - tipo incorreto
```

**Problema 3: Tight coupling - dependência de implementação**
```typescript
// Tight coupling - logger hardcoded
function processData(data: string[]): void {
  console.log("Processing started");  // ⚠️ Hardcoded
  // Process...
  console.log("Processing complete");  // ⚠️ Hardcoded
}

// Se quiser logger diferente, precisa modificar função
```

**Solução: Factory retorna função com logger injetado**
```typescript
// Factory - logger configurável
function createProcessor(
  logger: (message: string) => void
): (data: string[]) => void {
  return (data: string[]) => {
    logger("Processing started");  // ✅ Logger injetado
    // Process...
    logger("Processing complete");  // ✅ Logger injetado
  };
}

// Diferentes loggers
const consoleProcessor = createProcessor((msg) => console.log(msg));
const fileProcessor = createProcessor((msg) => writeToFile(msg));

consoleProcessor(data);  // Loga para console
fileProcessor(data);     // Loga para arquivo
```

**Fundamento teórico:** Factory pattern com closures implementa **dependency injection** - configuração encapsulada.

### Importância no Ecossistema

Funções como retorno são cruciais porque:

- **Factory Pattern:** Criar funções especializadas dinamicamente
- **Partial Application:** Fixar argumentos, retornar função parcial
- **Currying:** Transformar função multi-param em sequência de funções
- **Configuration:** Encapsular configuração em closure
- **Encapsulation:** Estado privado em closure
- **Higher-Order Functions:** Fundamento de programação funcional
- **Type Safety:** TypeScript garante assinatura da função retornada
- **Code Reuse:** Evitar duplicação de código similar

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **First-Class Functions:** Funções são valores retornáveis
2. **Closures:** Função retornada captura escopo externo
3. **Factory Pattern:** Criar funções customizadas
4. **Type Safety:** Função retornada tem tipo específico
5. **Lexical Scope:** Função retornada acessa variáveis externas

### Pilares Fundamentais

- **Return Type:** `(): (param: Type) => ReturnType`
- **Closure Capture:** Variáveis externas capturadas
- **Generic Returns:** Função retornada genérica
- **Currying:** Transformar multi-param em single-param
- **Partial Application:** Fixar alguns parâmetros

### Visão Geral das Nuances

- **Arrow Function Returns:** `() => () => value`
- **Multiple Returns:** Retornar tupla de funções
- **Async Returns:** Retornar funções async
- **Generic Factories:** Factory genérico
- **Type Inference:** TypeScript infere tipo de retorno

## 🧠 Fundamentos Teóricos

### Basic Function Returning Function

```typescript
// Função retorna função - básico
function createAdder(x: number): (y: number) => number {
  return (y: number) => x + y;  // Closure - captura 'x'
}

// Criar funções especializadas
const add5 = createAdder(5);
const add10 = createAdder(10);

// Usar
console.log(add5(3));   // 8  (5 + 3)
console.log(add10(3));  // 13 (10 + 3)
```

**Análise profunda:**

**Closure:** Função retornada **captura** `x` do escopo externo
**Lifetime:** `x` permanece acessível mesmo após `createAdder` retornar
**Type:** Função retornada tem tipo `(y: number) => number`

### Arrow Function Returning Arrow Function

```typescript
// Arrow function retorna arrow function - conciso
const createMultiplier = (factor: number): (n: number) => number => {
  return (n: number) => n * factor;
};

// Ainda mais conciso - implicit return
const createMultiplier2 = (factor: number) => (n: number) => n * factor;

// Uso
const double = createMultiplier2(2);
const triple = createMultiplier2(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**Sintaxe concisa:** `(factor) => (n) => ...` - duas arrow functions encadeadas.

**Type inference:** TypeScript infere tipo de retorno automaticamente.

### Closure Capturing Variables

```typescript
// Closure captura variáveis externas
function createCounter(): () => number {
  let count = 0;  // Variável privada - capturada por closure
  
  return () => {
    count++;  // Acessa e modifica 'count'
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1());  // 1
console.log(counter1());  // 2
console.log(counter1());  // 3

console.log(counter2());  // 1 - counter independente
console.log(counter2());  // 2
```

**Análise profunda:**

**Encapsulation:** `count` é privado - só acessível via função retornada
**State:** Cada invocação de `createCounter` cria **novo estado**
**Independence:** `counter1` e `counter2` são **independentes**

### Princípios e Conceitos Subjacentes

#### Factory Pattern

```typescript
// Factory - criar validadores customizados
type Validator<T> = (value: T) => boolean;

function createRangeValidator(min: number, max: number): Validator<number> {
  return (value: number) => value >= min && value <= max;
}

// Criar validadores especializados
const isValidAge = createRangeValidator(0, 120);
const isValidPercentage = createRangeValidator(0, 100);
const isValidTemperature = createRangeValidator(-273, 1000);

// Usar
console.log(isValidAge(25));        // true
console.log(isValidAge(150));       // false
console.log(isValidPercentage(50)); // true
console.log(isValidPercentage(150)); // false
```

**Pattern:** Factory cria **funções especializadas** a partir de **configuração**.

#### Multiple Functions Returned

```typescript
// Retornar múltiplas funções - tupla
function createCounterOps(): {
  increment: () => void;
  decrement: () => void;
  getValue: () => number;
  reset: () => void;
} {
  let count = 0;
  
  return {
    increment: () => { count++; },
    decrement: () => { count--; },
    getValue: () => count,
    reset: () => { count = 0; }
  };
}

const counter = createCounterOps();

counter.increment();
counter.increment();
console.log(counter.getValue());  // 2

counter.decrement();
console.log(counter.getValue());  // 1

counter.reset();
console.log(counter.getValue());  // 0
```

**Pattern:** Retornar **objeto de funções** - API encapsulada com estado privado.

### Partial Application

```typescript
// Partial application - fixar alguns parâmetros
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

// Criar função parcial - fixar primeiro parâmetro
function partial(a: number): (b: number, c: number) => number {
  return (b: number, c: number) => multiply(a, b, c);
}

// Função especializada
const multiplyBy2 = partial(2);

console.log(multiplyBy2(3, 4));  // 24 (2 * 3 * 4)
console.log(multiplyBy2(5, 6));  // 60 (2 * 5 * 6)
```

**Conceito fundamental:** **Partial application** - fixar argumentos, retornar função com menos parâmetros.

### Currying

```typescript
// Currying - transformar multi-param em sequence de single-param
function add(a: number, b: number, c: number): number {
  return a + b + c;
}

// Versão curried - cada função retorna função
function addCurried(a: number): (b: number) => (c: number) => number {
  return (b: number) => (c: number) => a + b + c;
}

// Uso - aplicar argumentos um de cada vez
const add5 = addCurried(5);        // Fixar 'a'
const add5and3 = add5(3);          // Fixar 'b'
const result = add5and3(2);        // Fixar 'c'

console.log(result);  // 10 (5 + 3 + 2)

// Ou direto
console.log(addCurried(5)(3)(2));  // 10
```

**Currying:** Cada função aceita **um argumento** e retorna **próxima função** ou **resultado final**.

**Benefício:** Permite **partial application** em qualquer estágio.

### Generic Factory

```typescript
// Factory genérico - tipo parametrizado
function createMapper<T, U>(fn: (item: T) => U): (arr: T[]) => U[] {
  return (arr: T[]) => arr.map(fn);
}

// Criar mappers especializados
const doubleMapper = createMapper((n: number) => n * 2);
const lengthMapper = createMapper((s: string) => s.length);
const upperMapper = createMapper((s: string) => s.toUpperCase());

// Usar
console.log(doubleMapper([1, 2, 3]));        // [2, 4, 6]
console.log(lengthMapper(["a", "ab", "abc"])); // [1, 2, 3]
console.log(upperMapper(["a", "b", "c"]));   // ["A", "B", "C"]
```

**Análise profunda:**

**Generic:** `<T, U>` - função retornada transforma `T[]` em `U[]`
**Type safety:** TypeScript garante tipos corretos em toda cadeia

### Closure with Multiple Variables

```typescript
// Closure captura múltiplas variáveis
function createFormatter(
  prefix: string,
  suffix: string
): (text: string) => string {
  return (text: string) => `${prefix}${text}${suffix}`;
}

// Diferentes formatadores
const htmlBold = createFormatter("<b>", "</b>");
const htmlItalic = createFormatter("<i>", "</i>");
const brackets = createFormatter("[", "]");
const quotes = createFormatter('"', '"');

// Usar
console.log(htmlBold("Hello"));     // "<b>Hello</b>"
console.log(htmlItalic("World"));   // "<i>World</i>"
console.log(brackets("Note"));      // "[Note]"
console.log(quotes("Text"));        // '"Text"'
```

**Closure:** Captura **múltiplas variáveis** (`prefix`, `suffix`) simultaneamente.

### Modelo Mental para Compreensão

Pense em funções que retornam funções como **fábrica de ferramentas**:

**Função externa:** Fábrica - recebe especificações
**Função retornada:** Ferramenta customizada - criada conforme especificações

**Analogia - Molde de Cookie:**

**Função externa:** Criar molde customizado (forma)
**Função retornada:** Molde pronto - cortar cookies (uso)

**Metáfora - Template Pattern:**

**Função externa:** Definir template com placeholders
**Função retornada:** Template preenchido - pronto para usar

**Fluxo de execução:**
```
1. Chamar função externa (factory) com configuração
2. Factory cria closure - captura configuração
3. Factory retorna função (closure)
4. Closure retornado pode ser chamado múltiplas vezes
5. Cada chamada usa configuração capturada
```

**Exemplo concreto:**
```typescript
// Factory: Criar logger customizado
function createLogger(prefix: string): (message: string) => void {
  // 1. Captura 'prefix' em closure
  return (message: string) => {
    // 2. Usa 'prefix' capturado
    console.log(`[${prefix}] ${message}`);
  };
}

// 3. Criar loggers especializados
const errorLogger = createLogger("ERROR");
const infoLogger = createLogger("INFO");

// 4. Usar - 'prefix' preservado
errorLogger("Something failed");  // [ERROR] Something failed
infoLogger("All good");           // [INFO] All good
```

## 🔍 Análise Conceitual Profunda

### Async Function Return

```typescript
// Retornar função async
function createFetcher(baseUrl: string): (endpoint: string) => Promise<any> {
  return async (endpoint: string) => {
    const response = await fetch(`${baseUrl}${endpoint}`);
    return response.json();
  };
}

// Criar fetchers para diferentes APIs
const githubFetcher = createFetcher("https://api.github.com");
const jsonPlaceholderFetcher = createFetcher("https://jsonplaceholder.typicode.com");

// Usar
const repos = await githubFetcher("/users/microsoft/repos");
const posts = await jsonPlaceholderFetcher("/posts");
```

**Pattern:** Factory cria **async functions** com configuração encapsulada.

#### Memoization Pattern

```typescript
// Memoization - cache results em closure
function createMemoized<T extends any[], R>(
  fn: (...args: T) => R
): (...args: T) => R {
  const cache = new Map<string, R>();
  
  return (...args: T) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key)!;
    }
    
    console.log("Computing...");
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Função cara
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Versão memoized
const memoizedFib = createMemoized(fibonacci);

console.log(memoizedFib(10));  // Computing... 55
console.log(memoizedFib(10));  // Cache hit! 55
```

**Pattern:** Closure mantém **cache privado** - otimiza performance.

### Private State Pattern

```typescript
// Estado privado via closure
function createBankAccount(initialBalance: number) {
  let balance = initialBalance;  // Privado - só acessível via métodos
  const transactions: string[] = [];
  
  return {
    deposit: (amount: number) => {
      if (amount <= 0) throw new Error("Invalid amount");
      balance += amount;
      transactions.push(`Deposit: +${amount}`);
    },
    
    withdraw: (amount: number) => {
      if (amount <= 0) throw new Error("Invalid amount");
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      transactions.push(`Withdraw: -${amount}`);
    },
    
    getBalance: () => balance,
    
    getTransactions: () => [...transactions]  // Cópia - não expõe array interno
  };
}

const account = createBankAccount(1000);

account.deposit(500);
account.withdraw(200);

console.log(account.getBalance());  // 1300
console.log(account.getTransactions());  // ["Deposit: +500", "Withdraw: -200"]

// ❌ Não há como acessar 'balance' diretamente - encapsulado
```

**Encapsulation:** `balance` e `transactions` são **privados** - só acessíveis via métodos retornados.

#### Compose Function

```typescript
// Compose - combinar funções
function compose<T>(
  ...fns: Array<(value: T) => T>
): (value: T) => T {
  return (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);
}

// Funções individuais
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n ** 2;

// Compor - direita para esquerda
const transform = compose(square, double, addOne);

console.log(transform(2));  // square(double(addOne(2))) = square(double(3)) = square(6) = 36
```

**Pattern:** `compose` retorna **função composta** - executa funções em sequência.

### Generic Currying

```typescript
// Currying genérico - tipos preservados
function curry2<T, U, R>(
  fn: (a: T, b: U) => R
): (a: T) => (b: U) => R {
  return (a: T) => (b: U) => fn(a, b);
}

function curry3<T, U, V, R>(
  fn: (a: T, b: U, c: V) => R
): (a: T) => (b: U) => (c: V) => R {
  return (a: T) => (b: U) => (c: V) => fn(a, b, c);
}

// Função original
function multiply(a: number, b: number, c: number): number {
  return a * b * c;
}

// Versão curried
const multiplyCurried = curry3(multiply);

// Uso
const multiplyBy2 = multiplyCurried(2);
const multiplyBy2And3 = multiplyBy2(3);
const result = multiplyBy2And3(4);

console.log(result);  // 24 (2 * 3 * 4)
```

**Type safety:** Currying genérico preserva **todos os tipos**.

#### Lazy Evaluation

```typescript
// Lazy evaluation - computar apenas quando necessário
function createLazy<T>(
  compute: () => T
): () => T {
  let cached: T | undefined;
  let computed = false;
  
  return () => {
    if (!computed) {
      console.log("Computing...");
      cached = compute();
      computed = true;
    }
    return cached!;
  };
}

// Computação cara
const expensiveValue = createLazy(() => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
});

// Não computa até primeira chamada
console.log("Lazy created");

// Primeira chamada - computa
console.log(expensiveValue());  // Computing... 499999500000

// Próximas chamadas - usa cache
console.log(expensiveValue());  // 499999500000 (sem "Computing...")
```

**Pattern:** Closure mantém **cache** - computa **apenas uma vez** (lazy + memoization).

### Higher-Order Type Safety

```typescript
// Type safety complexo - função retorna função com constraints
function createValidator<T>(
  validate: (value: unknown) => value is T
): (value: unknown) => T {
  return (value: unknown): T => {
    if (!validate(value)) {
      throw new Error("Validation failed");
    }
    return value;
  };
}

// Type guards
function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

// Criar validadores tipados
const validateNumber = createValidator(isNumber);
const validateString = createValidator(isString);

// Uso
const num = validateNumber(42);  // Type: number
const str = validateString("hello");  // Type: string

// ❌ Runtime error
// const invalid = validateNumber("not a number");
```

**Type narrowing:** Função retornada usa **type guard** para narrowing.

#### Conditional Return Types

```typescript
// Conditional return - tipo de retorno depende de parâmetro
function createParser<T extends "number" | "string">(
  type: T
): T extends "number" ? (value: string) => number : (value: string) => string {
  if (type === "number") {
    return ((value: string) => parseFloat(value)) as any;
  } else {
    return ((value: string) => value.trim()) as any;
  }
}

// Tipo inferido corretamente
const parseNumber = createParser("number");  // Type: (value: string) => number
const parseString = createParser("string");  // Type: (value: string) => string

console.log(parseNumber("42.5"));   // 42.5 (number)
console.log(parseString("  hello  ")); // "hello" (string)
```

**Conditional type:** Tipo de retorno **depende de parâmetro** - type-safe factory.

### Recursive Function Return

```typescript
// Função retorna função recursiva
function createPower(exponent: number): (base: number) => number {
  return (base: number): number => {
    if (exponent === 0) return 1;
    if (exponent === 1) return base;
    
    // Recursão
    const half = createPower(Math.floor(exponent / 2))(base);
    return exponent % 2 === 0 ? half * half : half * half * base;
  };
}

const square = createPower(2);
const cube = createPower(3);
const power4 = createPower(4);

console.log(square(5));   // 25
console.log(cube(3));     // 27
console.log(power4(2));   // 16
```

**Pattern:** Função retornada pode ser **recursiva** - complexidade encapsulada.

#### Event Emitter Pattern

```typescript
// Event emitter via closures
type Listener<T> = (event: T) => void;

function createEventEmitter<T>() {
  const listeners: Listener<T>[] = [];
  
  return {
    on: (listener: Listener<T>) => {
      listeners.push(listener);
      
      // Retorna função de cleanup
      return () => {
        const index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
      };
    },
    
    emit: (event: T) => {
      listeners.forEach(listener => listener(event));
    }
  };
}

// Uso
const emitter = createEventEmitter<string>();

const unsubscribe1 = emitter.on((msg) => console.log("Listener 1:", msg));
const unsubscribe2 = emitter.on((msg) => console.log("Listener 2:", msg));

emitter.emit("Hello");  // Ambos recebem

unsubscribe1();  // Remove listener 1

emitter.emit("World");  // Apenas listener 2 recebe
```

**Pattern:** `on` retorna **cleanup function** - permite remover listener.

### Builder Pattern

```typescript
// Builder pattern com funções retornadas
interface Config {
  host?: string;
  port?: number;
  ssl?: boolean;
}

function createConfigBuilder() {
  const config: Config = {};
  
  return {
    setHost: (host: string) => {
      config.host = host;
      return createConfigBuilder();  // Retorna novo builder - fluent API
    },
    setPort: (port: number) => {
      config.port = port;
      return createConfigBuilder();
    },
    setSSL: (ssl: boolean) => {
      config.ssl = ssl;
      return createConfigBuilder();
    },
    build: () => ({ ...config })
  };
}

// Uso - fluent API
const config = createConfigBuilder()
  .setHost("localhost")
  .setPort(8080)
  .setSSL(true)
  .build();

console.log(config);  // { host: "localhost", port: 8080, ssl: true }
```

**Pattern:** Cada método retorna **novo builder** - permite **chaining**.

## 🎯 Aplicabilidade e Contextos

### Factory Functions

```typescript
const createValidator = (min: number, max: number) => 
  (value: number) => value >= min && value <= max;
```

**Raciocínio:** Criar funções especializadas a partir de configuração.

### Currying

```typescript
const add = (a: number) => (b: number) => a + b;
```

**Raciocínio:** Partial application - fixar argumentos progressivamente.

### Encapsulation

```typescript
function createCounter() {
  let count = 0;
  return () => ++count;
}
```

**Raciocínio:** Estado privado via closure.

## ⚠️ Limitações e Considerações Teóricas

### Memory Overhead

```typescript
// Cada closure captura variáveis - overhead
const functions = Array.from({ length: 1000 }, (_, i) =>
  createCounter()  // 1000 closures independentes
);
```

**Limitação:** Closures consomem memória para variáveis capturadas.

### Type Complexity

```typescript
// Tipos aninhados complexos - verbosos
type Factory = () => (a: number) => (b: string) => (c: boolean) => Result;
```

**Consideração:** Múltiplos níveis de retorno - tipos complexos.

### Debugging Difficulty

```typescript
// Stack traces com closures - menos claros
const fn = createFactory()(arg1)(arg2);
```

**Consideração:** Debugging com múltiplas funções aninhadas é harder.

## 🔗 Interconexões Conceituais

**Relação com Closures:** Funções retornadas capturam escopo externo.

**Relação com Currying:** Retornar funções implementa currying.

**Relação com Factory Pattern:** Criar objetos/funções dinamicamente.

**Relação com Partial Application:** Fixar argumentos progressivamente.

**Relação com Encapsulation:** Estado privado via closure.

## 🚀 Evolução e Próximos Conceitos

Dominar funções como retorno prepara para:
- **Callbacks Tipados:** Type safety avançado em callbacks
- **Higher-Order Typed:** Genéricos complexos
- **Functional Composition:** Combinar funções
- **Monads e Functors:** Conceitos avançados de FP
