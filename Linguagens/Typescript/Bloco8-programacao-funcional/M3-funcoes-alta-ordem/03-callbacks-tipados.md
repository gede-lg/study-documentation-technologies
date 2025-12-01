# Callbacks Tipados

## 🎯 Introdução e Definição

### Definição Conceitual

**Callbacks tipados** referem-se a **funções callback com type annotations explícitas** em TypeScript, garantindo **type safety** para funções passadas como argumentos. Callback é função fornecida como parâmetro para outra função, executada posteriormente (chamada "de volta"). TypeScript adiciona **tipos** - assinatura do callback especifica **tipos de parâmetros** e **tipo de retorno**, prevenindo erros em compile-time.

Conceitualmente, callbacks tipados implementam **contract-based programming** - função receptora define **contrato** (assinatura) que callback deve seguir. TypeScript **enforces** contrato em compile-time - passar callback com assinatura incorreta resulta em erro. Promove **predictability** - tipo do callback garante comportamento esperado sem inspeção de implementação.

**Fundamento teórico:** Callbacks tipados são **type-safe function parameters** - diferentemente de JavaScript (qualquer função aceita), TypeScript requer **assinatura específica**. Type system verifica compatibilidade - parâmetros devem ser **supertipos** (contravariant), retorno deve ser **subtipo** (covariant). Permite **type inference** - TypeScript deduz tipos de parâmetros do callback baseado na assinatura esperada.

**Typed Callback Pattern**:
```
function receptor(callback: (param1: Type1, param2: Type2) => ReturnType) {
  const result = callback(value1, value2);  // ✅ Type-safe
}
```

### Contexto Histórico e Evolução

**JavaScript (1995):** Callbacks amplamente usados - eventos, async operations.

```javascript
// JavaScript - callback sem tipos
button.addEventListener("click", function(event) {
  // event type? Unknown
  console.log(event.target);
});
```

**JavaScript ES5 (2009):** Array methods com callbacks - forEach, map, filter.

```javascript
// ES5 - callbacks em arrays (sem type safety)
[1, 2, 3].map(function(item, index, array) {
  // Tipos inferidos em runtime
  return item * 2;
});
```

**TypeScript 0.9 (2013):** Function type annotations introduzidos.

```typescript
// TypeScript - callback tipado
function forEach(arr: number[], callback: (item: number) => void): void {
  for (const item of arr) {
    callback(item);  // ✅ Type-safe
  }
}

forEach([1, 2, 3], (item) => console.log(item));  // ✅ OK
forEach([1, 2, 3], (item: string) => console.log(item));  // ❌ Error
```

**TypeScript 1.4 (2015):** **Type inference** para callback parameters melhorado.

```typescript
// Type inference - TypeScript deduz tipo de 'item'
[1, 2, 3].forEach((item) => {
  console.log(item.toFixed(2));  // ✅ OK - item inferido como number
});
```

**TypeScript 2.0 (2016):** **Optional parameters** e **rest parameters** em callbacks.

```typescript
// Callback com parâmetros opcionais
type Callback = (value: number, index?: number, array?: number[]) => void;

function forEach(arr: number[], callback: Callback): void {
  arr.forEach((value, index, array) => callback(value, index, array));
}
```

**TypeScript 3.0 (2018):** **Tuple types** em rest parameters de callbacks.

```typescript
// Rest parameters tipados
type Callback = (...args: [number, string, boolean]) => void;
```

**TypeScript 4.0 (2020):** **Variadic tuple types** - rest parameters mais flexíveis.

```typescript
// Variadic tuples
type Callback<T extends any[]> = (...args: T) => void;
```

**Evolução de práticas:**

**Era JavaScript (sem tipos):**
```javascript
// Sem type safety
function process(callback) {
  callback("data");  // ⚠️ Tipo de argumento desconhecido
}
```

**Era TypeScript (tipado):**
```typescript
// Type safety completo
function process(callback: (data: string) => void): void {
  callback("data");  // ✅ Garantido: callback aceita string
}
```

### Problema Fundamental que Resolve

Callbacks tipados resolvem problemas de **type errors em callbacks**, **documentação implícita**, e **refactoring seguro**.

**Problema 1: Type errors em runtime**
```javascript
// JavaScript - erro em runtime
function processNumbers(arr, callback) {
  arr.forEach(callback);
}

processNumbers([1, 2, 3], function(item) {
  console.log(item.toUpperCase());  // ❌ Runtime error - number não tem toUpperCase
});
```

**Solução: TypeScript detecta erro em compile-time**
```typescript
// TypeScript - erro em compile-time
function processNumbers(arr: number[], callback: (item: number) => void): void {
  arr.forEach(callback);
}

processNumbers([1, 2, 3], (item) => {
  console.log(item.toUpperCase());  // ❌ Error em compile-time
  // Property 'toUpperCase' does not exist on type 'number'
});

// ✅ Correção
processNumbers([1, 2, 3], (item) => {
  console.log(item.toFixed(2));  // ✅ OK - toFixed existe em number
});
```

**Problema 2: Documentação ausente**
```javascript
// JavaScript - sem documentação de tipos
function fetchData(url, onSuccess, onError) {
  // onSuccess recebe o quê? onError recebe o quê?
  fetch(url)
    .then(response => response.json())
    .then(data => onSuccess(data))
    .catch(error => onError(error));
}

// Uso - tipos desconhecidos
fetchData("/api", function(data) {
  // data type? Unknown - precisa inspecionar implementação
}, function(error) {
  // error type? Unknown
});
```

**Solução: Tipos documentam assinatura**
```typescript
// TypeScript - tipos são documentação
function fetchData(
  url: string,
  onSuccess: (data: any) => void,
  onError: (error: Error) => void
): void {
  fetch(url)
    .then(response => response.json())
    .then(data => onSuccess(data))
    .catch(error => onError(error));
}

// Uso - tipos explícitos
fetchData("/api", (data) => {
  // ✅ Type conhecido: any (pode melhorar com generic)
}, (error) => {
  // ✅ Type conhecido: Error
  console.error(error.message);  // ✅ Safe - Error tem message
});
```

**Problema 3: Refactoring inseguro**
```javascript
// JavaScript - refactoring quebra código silenciosamente
function sortArray(arr, compareFn) {
  return arr.sort(compareFn);
}

// Uso atual
sortArray([3, 1, 2], (a, b) => a - b);  // ✅ OK

// Alguém muda assinatura
function sortArray(arr, compareFn) {
  return arr.sort((a, b) => compareFn(b, a));  // ⚠️ Ordem invertida
}

// Código antigo quebra silenciosamente
sortArray([3, 1, 2], (a, b) => a - b);  // ⚠️ Resultado invertido - sem erro
```

**Solução: TypeScript detecta incompatibilidade**
```typescript
// TypeScript - refactoring seguro
function sortArray(
  arr: number[],
  compareFn: (a: number, b: number) => number
): number[] {
  return arr.sort(compareFn);
}

// Mudança de assinatura
function sortArrayNew(
  arr: number[],
  compareFn: (reversed: boolean, a: number, b: number) => number  // ⚠️ Nova assinatura
): number[] {
  return arr.sort((a, b) => compareFn(true, b, a));
}

// Código antigo - TypeScript detecta incompatibilidade
sortArrayNew([3, 1, 2], (a, b) => a - b);  // ❌ Error - assinatura incorreta
// Expected 3 arguments, but got 2
```

**Fundamento teórico:** Type safety previne **breaking changes silenciosos** - mudanças incompatíveis detectadas em compile-time.

### Importância no Ecossistema

Callbacks tipados são cruciais porque:

- **Type Safety:** Prevenir erros de tipo em compile-time
- **IntelliSense:** Autocomplete em editores (VSCode)
- **Documentation:** Tipos são documentação executável
- **Refactoring:** Mudanças de assinatura detectadas automaticamente
- **Type Inference:** TypeScript deduz tipos de parâmetros
- **API Design:** Contratos claros para APIs públicas
- **Error Prevention:** Catch erros antes de runtime
- **Developer Experience:** Feedback imediato durante desenvolvimento

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Type Annotations:** Assinatura explícita de callback
2. **Type Inference:** Dedução automática de tipos
3. **Variance:** Contravariance (params) e Covariance (return)
4. **Type Safety:** Verificação em compile-time
5. **IntelliSense:** Autocompletion baseado em tipos

### Pilares Fundamentais

- **Function Type:** `(param: Type) => ReturnType`
- **Type Aliases:** Definir tipos de callback reutilizáveis
- **Generic Callbacks:** Callbacks parametrizados
- **Optional Parameters:** Parâmetros opcionais em callback
- **Rest Parameters:** Arbitrary arguments em callback

### Visão Geral das Nuances

- **Inference:** TypeScript infere tipos de parâmetros
- **Explicit vs Inferred:** Quando anotar explicitamente
- **Void Return:** Callbacks sem retorno
- **Multiple Signatures:** Callback overloads
- **This Context:** Tipo de `this` em callback

## 🧠 Fundamentos Teóricos

### Basic Typed Callback

```typescript
// Callback simples - tipo explícito
function execute(callback: () => void): void {
  callback();
}

// Uso - type-safe
execute(() => console.log("Hello"));  // ✅ OK
execute(() => 123);  // ✅ OK - retorna number, mas void ignora

// ❌ Erro de tipo
execute("not a function");  // ❌ Error - esperado função
```

**Análise profunda:**

**Function type:** `() => void` - sem parâmetros, retorna void
**Void:** Aceita qualquer retorno, mas descarta valor

### Callback with Parameters

```typescript
// Callback com parâmetros tipados
function forEach(
  arr: number[],
  callback: (item: number, index: number) => void
): void {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

// Uso - type inference
forEach([1, 2, 3], (item, index) => {
  // TypeScript infere: item: number, index: number
  console.log(`${index}: ${item}`);
});

// ❌ Tipo incorreto
forEach([1, 2, 3], (item: string) => {  // ❌ Error - tipo incompatível
  console.log(item);
});
```

**Type inference:** TypeScript deduz tipos de `item` e `index` baseado na assinatura.

### Callback with Return Value

```typescript
// Callback que retorna valor
function map<T, U>(
  arr: T[],
  callback: (item: T, index: number) => U
): U[] {
  const result: U[] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i], i));
  }
  return result;
}

// Uso - type inference completo
const doubled = map([1, 2, 3], (item) => item * 2);
// Type: number[]

const strings = map([1, 2, 3], (item) => `Number ${item}`);
// Type: string[]

// ❌ Tipo de retorno incorreto verificado
const invalid = map([1, 2, 3], (item): string => {
  return item;  // ❌ Error - retorna number, esperado string
});
```

**Análise profunda:**

**Generic:** `<T, U>` - tipo de input e output
**Return type:** TypeScript infere `U` baseado no retorno do callback

### Princípios e Conceitos Subjacentes

#### Type Alias for Callbacks

```typescript
// Type alias - reutilizável
type Predicate<T> = (item: T, index: number) => boolean;
type Transformer<T, U> = (item: T, index: number) => U;
type Consumer<T> = (item: T, index: number) => void;

// Usar type aliases
function filter<T>(arr: T[], predicate: Predicate<T>): T[] {
  return arr.filter((item, index) => predicate(item, index));
}

function map<T, U>(arr: T[], transformer: Transformer<T, U>): U[] {
  return arr.map((item, index) => transformer(item, index));
}

function forEach<T>(arr: T[], consumer: Consumer<T>): void {
  arr.forEach((item, index) => consumer(item, index));
}

// Uso
const numbers = [1, 2, 3, 4, 5];

const evens = filter(numbers, (n) => n % 2 === 0);
const doubled = map(numbers, (n) => n * 2);
forEach(numbers, (n, i) => console.log(`${i}: ${n}`));
```

**Benefício:** Type aliases tornam assinaturas **legíveis** e **reutilizáveis**.

#### Optional Parameters in Callback

```typescript
// Callback com parâmetros opcionais
type Callback<T> = (item: T, index?: number, array?: T[]) => void;

function forEach<T>(arr: T[], callback: Callback<T>): void {
  arr.forEach((item, index, array) => callback(item, index, array));
}

// Uso - parâmetros opcionais
forEach([1, 2, 3], (item) => {
  console.log(item);  // ✅ OK - index e array omitidos
});

forEach([1, 2, 3], (item, index) => {
  console.log(`${index}: ${item}`);  // ✅ OK - array omitido
});

forEach([1, 2, 3], (item, index, array) => {
  console.log(`${index}/${array.length}: ${item}`);  // ✅ OK - todos fornecidos
});
```

**Optional parameters:** `index?: number` - callback pode omitir parâmetros.

### Generic Typed Callbacks

```typescript
// Generic callback - tipo parametrizado
function findFirst<T>(
  arr: T[],
  predicate: (item: T) => boolean
): T | undefined {
  for (const item of arr) {
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}

// Uso com diferentes tipos
const numbers = [1, 2, 3, 4, 5];
const firstEven = findFirst(numbers, (n) => n % 2 === 0);
// Type: number | undefined

interface User {
  id: number;
  name: string;
  active: boolean;
}

const users: User[] = [
  { id: 1, name: "Alice", active: false },
  { id: 2, name: "Bob", active: true }
];

const firstActive = findFirst(users, (u) => u.active);
// Type: User | undefined
```

**Análise profunda:**

**Generic `<T>`:** Callback type adapta ao tipo do array
**Type inference:** TypeScript infere `T` automaticamente

### Callback Type Variance

```typescript
// Contravariance - parâmetros podem ser mais gerais
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Callback espera Animal
function processAnimals(animals: Animal[], callback: (animal: Animal) => void): void {
  animals.forEach(callback);
}

// ✅ OK - callback aceita tipo mais geral (Animal ou any)
processAnimals([{ name: "Rex" }], (animal: Animal) => {
  console.log(animal.name);
});

// ✅ OK - callback aceita tipo mais específico (Dog) - contravariance
processAnimals([{ name: "Rex" }], (animal: Dog) => {
  // ⚠️ Funciona, mas perigoso - animal pode não ter 'breed'
  console.log(animal.breed);  // undefined se não for Dog
});

// Covariance - retorno pode ser mais específico
function mapAnimals(
  animals: Animal[],
  callback: (animal: Animal) => Animal
): Animal[] {
  return animals.map(callback);
}

// ✅ OK - retorna subtipo (Dog extends Animal)
const dogs = mapAnimals([{ name: "Rex" }], (animal): Dog => {
  return { ...animal, breed: "Labrador" };
});
```

**Fundamento teórico:**

**Contravariance:** Parâmetros podem ser **supertipos**
**Covariance:** Retorno pode ser **subtipo**

### Rest Parameters in Callbacks

```typescript
// Callback com rest parameters
type Callback = (...args: number[]) => number;

function compute(callback: Callback, ...values: number[]): number {
  return callback(...values);
}

// Uso - arbitrary number de argumentos
const sum = compute((a, b, c) => a + b + c, 1, 2, 3);  // 6
const max = compute((...nums) => Math.max(...nums), 5, 10, 3, 8);  // 10
```

**Rest parameters:** `...args: number[]` - aceita qualquer quantidade de argumentos.

### Modelo Mental para Compreensão

Pense em callbacks tipados como **contrato de trabalho**:

**Função receptora:** Empregador - define requisitos (assinatura)
**Callback:** Trabalhador - deve atender requisitos

**Analogia - Tomada Elétrica:**

**Função receptora:** Tomada - especifica voltagem/amperagem (tipo)
**Callback:** Plug - deve ser compatível (tipo correto)

**Metáfora - API Contract:**

**Tipo do callback:** Especificação - documenta interface esperada
**Implementação:** Código - deve seguir especificação

**Fluxo de verificação:**
```
1. Definir tipo de callback esperado
2. Passar callback ao chamar função
3. TypeScript verifica compatibilidade
   - Parâmetros: callback aceita tipos esperados?
   - Retorno: callback retorna tipo esperado?
4. Se incompatível: erro em compile-time
5. Se compatível: type-safe execution
```

**Exemplo concreto:**
```typescript
// Contrato: callback recebe string, retorna number
function process(callback: (text: string) => number): void {
  const result = callback("hello");  // ✅ Type-safe
  console.log(result.toFixed(2));    // ✅ result é number
}

// Implementação compatível
process((text) => text.length);  // ✅ OK - string → number

// Implementação incompatível
process((text) => text.toUpperCase());  // ❌ Error - string → string
```

## 🔍 Análise Conceitual Profunda

### Callback Overloads

```typescript
// Callback com múltiplas assinaturas
interface OverloadedCallback {
  (value: number): string;
  (value: string): number;
}

function transform(callback: OverloadedCallback, value: number | string): string | number {
  if (typeof value === "number") {
    return callback(value);  // Chama primeira assinatura
  } else {
    return callback(value);  // Chama segunda assinatura
  }
}

// Callback que implementa ambas assinaturas
const converter: OverloadedCallback = (value: any): any => {
  if (typeof value === "number") {
    return value.toString();
  } else {
    return parseInt(value);
  }
};

console.log(transform(converter, 42));     // "42" (string)
console.log(transform(converter, "100"));  // 100 (number)
```

**Overloads:** Callback aceita **múltiplas assinaturas** - TypeScript escolhe baseado em tipo de argumento.

#### This Context Typing

```typescript
// Tipo de 'this' em callback
interface CallbackThis {
  multiplier: number;
}

function forEach(
  arr: number[],
  callback: (this: CallbackThis, item: number) => number
): number[] {
  const context: CallbackThis = { multiplier: 2 };
  return arr.map(item => callback.call(context, item));
}

// Uso - 'this' tipado
const result = forEach([1, 2, 3], function(item) {
  return item * this.multiplier;  // ✅ 'this' é CallbackThis
});

console.log(result);  // [2, 4, 6]

// ❌ Arrow function não pode usar 'this' tipado
forEach([1, 2, 3], (item) => {
  return item * this.multiplier;  // ❌ Error - arrow function não tem 'this'
});
```

**This typing:** `(this: Type, ...)` - especifica tipo de `this` no callback.

### Async Callbacks

```typescript
// Callback async - retorna Promise
async function processAsync<T, U>(
  arr: T[],
  callback: (item: T) => Promise<U>
): Promise<U[]> {
  const results: U[] = [];
  for (const item of arr) {
    const result = await callback(item);  // Await callback
    results.push(result);
  }
  return results;
}

// Uso
const urls = ["/api/user/1", "/api/user/2", "/api/user/3"];

const users = await processAsync(urls, async (url) => {
  const response = await fetch(url);
  return response.json();  // Retorna Promise<any>
});

console.log(users);  // Array de users
```

**Async callback:** `(item: T) => Promise<U>` - callback retorna Promise.

#### Error-First Callbacks

```typescript
// Error-first callback (Node.js style)
type ErrorFirstCallback<T> = (error: Error | null, result?: T) => void;

function readFile(
  path: string,
  callback: ErrorFirstCallback<string>
): void {
  // Simular async file read
  setTimeout(() => {
    if (path === "/invalid") {
      callback(new Error("File not found"));
    } else {
      callback(null, "File content");
    }
  }, 100);
}

// Uso
readFile("/valid", (error, result) => {
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Content:", result);  // result: string | undefined
  }
});
```

**Pattern:** Primeiro parâmetro é **error** (null se sucesso), segundo é **resultado**.

### Discriminated Union Callbacks

```typescript
// Callback com discriminated union
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type ResultCallback<T> = (result: Result<T>) => void;

function fetchData<T>(
  url: string,
  callback: ResultCallback<T>
): void {
  fetch(url)
    .then(response => response.json())
    .then(data => callback({ success: true, data }))
    .catch(error => callback({ success: false, error: error.message }));
}

// Uso - type narrowing
fetchData<User>("/api/user", (result) => {
  if (result.success) {
    console.log(result.data.name);  // ✅ result.data: User
  } else {
    console.error(result.error);    // ✅ result.error: string
  }
});
```

**Pattern:** Callback recebe **discriminated union** - type narrowing via `success` property.

#### Callback Constraints

```typescript
// Callback com constraints
interface HasId {
  id: number;
}

function processItems<T extends HasId>(
  items: T[],
  callback: (item: T) => void
): void {
  items.forEach(item => {
    console.log(`Processing item ${item.id}`);
    callback(item);
  });
}

// Uso - T deve ter 'id'
interface Product extends HasId {
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Book", price: 20 },
  { id: 2, name: "Pen", price: 5 }
];

processItems(products, (product) => {
  console.log(product.name);  // ✅ OK - product: Product
});

// ❌ Tipo sem 'id'
interface Person {
  name: string;
}

const people: Person[] = [{ name: "Alice" }];

processItems(people, (person) => {  // ❌ Error - Person não tem 'id'
  console.log(person.name);
});
```

**Constraint:** `T extends HasId` - garante que `T` tem propriedade `id`.

### Conditional Callback Types

```typescript
// Tipo de callback depende de parâmetro
type Callback<T> = T extends string
  ? (value: T) => number
  : (value: T) => string;

function process<T extends string | number>(
  value: T,
  callback: Callback<T>
): T extends string ? number : string {
  return callback(value) as any;
}

// Uso - tipo inferido
const length = process("hello", (str) => str.length);
// Type: number

const stringified = process(42, (num) => num.toString());
// Type: string
```

**Conditional type:** Tipo de callback **depende de tipo genérico** `T`.

#### Callback Type Guards

```typescript
// Callback como type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function filter<T, U extends T>(
  arr: T[],
  guard: (item: T) => item is U
): U[] {
  return arr.filter(guard);
}

// Uso - type narrowing
const mixed: (string | number)[] = [1, "a", 2, "b", 3];

const strings = filter(mixed, isString);
// Type: string[]

const numbers = filter(mixed, (item): item is number => typeof item === "number");
// Type: number[]
```

**Type guard callback:** `(item: T) => item is U` - narrows tipo para `U`.

### Multiple Callback Parameters

```typescript
// Múltiplos callbacks
function fetchDataWithCallbacks(
  url: string,
  onSuccess: (data: any) => void,
  onError: (error: Error) => void,
  onProgress?: (progress: number) => void
): void {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    onProgress?.(progress);  // Opcional
    if (progress >= 100) clearInterval(interval);
  }, 100);
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      clearInterval(interval);
      onSuccess(data);
    })
    .catch(error => {
      clearInterval(interval);
      onError(error);
    });
}

// Uso
fetchDataWithCallbacks(
  "/api/data",
  (data) => console.log("Success:", data),
  (error) => console.error("Error:", error),
  (progress) => console.log(`${progress}% complete`)
);
```

**Pattern:** Diferentes callbacks para diferentes eventos (success/error/progress).

#### Recursive Callback Types

```typescript
// Callback recursivo
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

type Visitor<T> = (node: TreeNode<T>, depth: number) => void;

function traverseTree<T>(
  node: TreeNode<T>,
  visitor: Visitor<T>,
  depth: number = 0
): void {
  visitor(node, depth);
  
  if (node.children) {
    for (const child of node.children) {
      traverseTree(child, visitor, depth + 1);
    }
  }
}

// Uso
const tree: TreeNode<string> = {
  value: "root",
  children: [
    { value: "child1", children: [{ value: "grandchild1" }] },
    { value: "child2" }
  ]
};

traverseTree(tree, (node, depth) => {
  console.log("  ".repeat(depth) + node.value);
});
// Output:
// root
//   child1
//     grandchild1
//   child2
```

**Recursive:** Callback usado em **estrutura recursiva** (tree traversal).

### Callback Composition

```typescript
// Compor callbacks
function compose<T>(
  ...callbacks: Array<(value: T) => T>
): (value: T) => T {
  return (value: T) => callbacks.reduce((acc, fn) => fn(acc), value);
}

// Callbacks individuais
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n ** 2;

// Compor
const transform = compose(addOne, double, square);

console.log(transform(2));  // ((2 + 1) * 2) ** 2 = 36
```

**Composition:** Combinar múltiplos callbacks em **pipeline**.

#### Event Emitter Callbacks

```typescript
// Event emitter com callbacks tipados
type EventMap = {
  "data": (data: string) => void;
  "error": (error: Error) => void;
  "close": () => void;
};

class TypedEventEmitter<T extends EventMap> {
  private listeners: { [K in keyof T]?: T[K][] } = {};
  
  on<K extends keyof T>(event: K, callback: T[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }
  
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(...args as any));
    }
  }
}

// Uso
const emitter = new TypedEventEmitter<EventMap>();

emitter.on("data", (data) => {
  console.log("Data:", data);  // data: string
});

emitter.on("error", (error) => {
  console.error("Error:", error.message);  // error: Error
});

emitter.on("close", () => {
  console.log("Closed");  // sem parâmetros
});

emitter.emit("data", "Hello");
emitter.emit("error", new Error("Oops"));
emitter.emit("close");
```

**Type safety:** Event map garante que **cada evento** tem **callback correto**.

## 🎯 Aplicabilidade e Contextos

### Array Methods

```typescript
arr.map((item) => item * 2);
arr.filter((item) => item > 0);
```

**Raciocínio:** Callbacks tipados garantem transformações type-safe.

### Event Handlers

```typescript
button.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX, event.clientY);
});
```

**Raciocínio:** Event types previnem erros de acesso a propriedades.

### Async Operations

```typescript
fetchData(url, (data: User[]) => processUsers(data));
```

**Raciocínio:** Tipos garantem callback recebe dados corretos.

## ⚠️ Limitações e Considerações Teóricas

### Type Inference Limits

```typescript
// Type inference pode falhar com lógica complexa
const complex = (callback: (a: any, b: any) => any) => {
  return callback(1, "2");  // ⚠️ any - sem type safety
};
```

**Limitação:** `any` desabilita type safety - preferir tipos explícitos.

### Callback Hell

```typescript
// Callbacks aninhados - difícil tipar
doSomething((result1) => {
  doAnother(result1, (result2) => {
    doMore(result2, (result3) => {
      // Callback hell...
    });
  });
});
```

**Consideração:** Preferir Promises/async-await para async chains.

### Variance Complexity

```typescript
// Variance pode confundir
type Callback = (animal: Dog) => Animal;  // Contravariant/Covariant
```

**Consideração:** Variance rules complexas - preferir tipos simples quando possível.

## 🔗 Interconexões Conceituais

**Relação com Higher-Order Functions:** Callbacks são função parâmetro.

**Relação com Generics:** Callbacks genéricos para type safety.

**Relação com Type Inference:** TypeScript deduz tipos de callback.

**Relação com Type Guards:** Callbacks podem narrow types.

**Relação com Functional Programming:** Callbacks em map/filter/reduce.

## 🚀 Evolução e Próximos Conceitos

Dominar callbacks tipados prepara para:
- **Higher-Order Typed:** Genéricos complexos em HOF
- **Promises e Async/Await:** Alternativas a callbacks
- **Observable Patterns:** RxJS e reactive programming
- **Event Systems:** Type-safe event emitters
