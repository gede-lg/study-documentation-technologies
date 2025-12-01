# Pipe vs. Compose

## 🎯 Introdução e Definição

### Definição Conceitual

**Pipe vs. Compose** refere-se à diferença entre duas abordagens de **composição de funções**: **pipe** (esquerda para direita) vs **compose** (direita para esquerda). Ambos combinam funções sequencialmente, mas diferem na **ordem de aplicação** e **legibilidade**. Pipe aplica funções na ordem escrita (f1 → f2 → f3), enquanto compose aplica na ordem reversa (f3 ← f2 ← f1).

Conceitualmente, ambos implementam **function composition**, mas otimizam para diferentes **modelos mentais**. Compose segue **notação matemática** - `(f ∘ g)(x) = f(g(x))`, direita para esquerda. Pipe segue **fluxo de leitura natural** - esquerda para direita, como código imperativo sequencial. TypeScript garante **type safety** em ambos - tipos devem ser compatíveis.

**Fundamento teórico:** Pipe e compose são **matematicamente equivalentes** - mesmo resultado, diferentes sintaxes. Escolha depende de **preferência** e **contexto**. Pipe é mais intuitivo para programadores acostumados com leitura esquerda→direita. Compose é familiar para quem conhece matemática/Haskell.

**Diferença fundamental:**
```
compose(f, g, h)(x) = f(g(h(x)))    // Direita → Esquerda
pipe(h, g, f)(x) = f(g(h(x)))       // Esquerda → Direita
```

### Contexto Histórico e Evolução

**Matemática (Séculos):** Composição de funções - notação `f ∘ g`.

```
(f ∘ g)(x) = f(g(x))

Ordem matemática: direita para esquerda
```

**Haskell (1990):** Operador de composição `.` (direita para esquerda).

```haskell
-- Haskell - composição matemática
(.) :: (b -> c) -> (a -> b) -> a -> c
(f . g) x = f (g x)

-- Uso
addOne x = x + 1
double x = x * 2

-- Composição - direita para esquerda
composed = double . addOne
composed 5  -- double(addOne(5)) = 12
```

**F# (2005):** Introduziu operador `>>` (pipe forward - esquerda para direita).

```fsharp
// F# - pipe forward operator
(>>) :: (a -> b) -> (b -> c) -> a -> c
(f >> g) x = g (f x)

// Uso
let addOne x = x + 1
let double x = x * 2

// Pipe - esquerda para direita
let piped = addOne >> double
piped 5  // double(addOne(5)) = 12

// Também: pipe apply operator |>
5 |> addOne |> double  // 12
```

**Elixir (2011):** Pipe operator `|>` como feature central.

```elixir
# Elixir - pipe operator
5
|> add_one()
|> double()
|> square()

# Equivalente a: square(double(add_one(5)))
```

**Ramda.js (2013):** `compose` (R→L) e `pipe` (L→R).

```javascript
// Ramda - ambas direções
import { compose, pipe } from 'ramda';

const addOne = n => n + 1;
const double = n => n * 2;

// Compose - direita para esquerda
const composed = compose(double, addOne);
composed(5);  // 12

// Pipe - esquerda para direita
const piped = pipe(addOne, double);
piped(5);  // 12
```

**Lodash/fp (2014):** `flowRight` (R→L) e `flow` (L→R).

```javascript
// Lodash/fp
import { flowRight, flow } from 'lodash/fp';

// flowRight = compose
const composed = flowRight(double, addOne);

// flow = pipe
const piped = flow(addOne, double);
```

**TypeScript (2012-presente):** Ambas abordagens implementadas manualmente.

```typescript
// TypeScript - implementar ambas
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

function pipe<A, B, C>(
  g: (a: A) => B,
  f: (b: B) => C
): (a: A) => C {
  return (a: A) => f(g(a));
}
```

**Evolução de preferências:**

**Era matemática/Haskell:** Compose dominante
**Era linguagens modernas:** Pipe ganhando popularidade
**Razão:** Legibilidade - pipe segue ordem natural de leitura

### Problema Fundamental que Resolve

Pipe e compose resolvem problemas de **legibilidade** e **expressividade** na composição de funções.

**Problema 1: Ordem de leitura vs. ordem de execução**
```typescript
// Compose - leitura reversa
const transform = compose(step3, step2, step1);

// Leitura: step3 ← step2 ← step1
// Execução: step1 → step2 → step3
// Ordem de leitura ≠ ordem de execução ❌
```

**Solução: Pipe alinha leitura e execução**
```typescript
// Pipe - leitura e execução alinhadas
const transform = pipe(step1, step2, step3);

// Leitura: step1 → step2 → step3
// Execução: step1 → step2 → step3
// Ordem de leitura = ordem de execução ✅
```

**Problema 2: Legibilidade com transformações complexas**
```typescript
// Compose - difícil seguir fluxo
const process = compose(
  formatOutput,
  calculateTotal,
  filterValid,
  parseInput
);

// Mental model: "Começo lendo formatOutput, mas executa parseInput primeiro?"
// Confuso ❌
```

**Solução: Pipe torna fluxo explícito**
```typescript
// Pipe - fluxo natural
const process = pipe(
  parseInput,
  filterValid,
  calculateTotal,
  formatOutput
);

// Mental model: "Parse, depois filter, depois calculate, depois format"
// Claro ✅
```

**Problema 3: Compatibilidade com código imperativo**
```typescript
// Código imperativo sequencial
const result1 = parseInput(data);
const result2 = filterValid(result1);
const result3 = calculateTotal(result2);
const result4 = formatOutput(result3);

// Compose não reflete essa ordem
const composed = compose(formatOutput, calculateTotal, filterValid, parseInput);

// Pipe reflete ordem imperativa
const piped = pipe(parseInput, filterValid, calculateTotal, formatOutput);
```

**Fundamento teórico:** Pipe facilita **migração de imperativo para funcional** - ordem se mantém.

### Importância no Ecossistema

Pipe vs. Compose é importante porque:

- **Readability:** Pipe mais legível para maioria dos programadores
- **Natural Flow:** Esquerda→direita segue leitura natural
- **Imperative Migration:** Facilita refatorar código imperativo
- **Mathematical Tradition:** Compose familiar em matemática/Haskell
- **Flexibility:** Escolher ferramenta certa para contexto
- **Type Safety:** Ambos preservam type safety
- **Expressiveness:** Expressar intenção claramente
- **Team Preference:** Respeitar preferências de equipe

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Compose:** Direita para esquerda (R→L)
2. **Pipe:** Esquerda para direita (L→R)
3. **Mathematical:** Compose segue notação matemática
4. **Natural:** Pipe segue leitura natural
5. **Equivalence:** Ambos matematicamente equivalentes

### Pilares Fundamentais

- **Order:** Ordem de aplicação de funções
- **Readability:** Legibilidade do código
- **Convention:** Convenções de linguagem/biblioteca
- **Mental Model:** Modelo mental de leitura
- **Type Flow:** Fluxo de tipos

### Visão Geral das Nuances

- **reduceRight:** Compose usa reduceRight
- **reduce:** Pipe usa reduce
- **Naming:** flowRight vs flow (Lodash)
- **Operator:** `>>` vs `.` (F# vs Haskell)
- **Variadic:** Múltiplas funções em ambos

## 🧠 Fundamentos Teóricos

### Binary Compose

```typescript
// Compose - direita para esquerda
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Funções
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;

// Compor - ordem reversa
const transform = compose(double, addOne);

console.log(transform(5));  // double(addOne(5)) = 12
```

**Ordem:** Funções aplicadas da **direita para esquerda**.

### Binary Pipe

```typescript
// Pipe - esquerda para direita
function pipe<A, B, C>(
  g: (a: A) => B,
  f: (b: B) => C
): (a: A) => C {
  return (a: A) => f(g(a));
}

// Mesmas funções
const transform2 = pipe(addOne, double);

console.log(transform2(5));  // double(addOne(5)) = 12
```

**Ordem:** Funções aplicadas da **esquerda para direita**.

### Variadic Compose

```typescript
// Compose com múltiplas funções
function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Uso
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

// Leitura: square ← double ← addOne
// Execução: addOne → double → square
const transform = compose(square, double, addOne);

console.log(transform(3));  // square(double(addOne(3))) = 64
```

**Implementation:** `reduceRight` aplica funções da **direita para esquerda**.

### Princípios e Conceitos Subjacentes

#### Variadic Pipe

```typescript
// Pipe com múltiplas funções
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Uso
// Leitura: addOne → double → square
// Execução: addOne → double → square
const transform2 = pipe(addOne, double, square);

console.log(transform2(3));  // square(double(addOne(3))) = 64
```

**Implementation:** `reduce` aplica funções da **esquerda para direita**.

#### Side-by-side Comparison

```typescript
// Mesmas funções
const trim = (str: string) => str.trim();
const toLowerCase = (str: string) => str.toLowerCase();
const removeSpaces = (str: string) => str.replace(/\s+/g, "");
const addPrefix = (str: string) => `processed_${str}`;

// Compose - ler de baixo para cima
const withCompose = compose(
  addPrefix,       // 4. Adicionar prefixo
  removeSpaces,    // 3. Remover espaços
  toLowerCase,     // 2. Lowercase
  trim             // 1. Trim
);

// Pipe - ler de cima para baixo
const withPipe = pipe(
  trim,            // 1. Trim
  toLowerCase,     // 2. Lowercase
  removeSpaces,    // 3. Remover espaços
  addPrefix        // 4. Adicionar prefixo
);

const input = "  Hello World  ";
console.log(withCompose(input));  // "processed_helloworld"
console.log(withPipe(input));     // "processed_helloworld"

// Mesmo resultado, ordem de leitura diferente
```

**Insight:** Pipe é **mais intuitivo** - ordem de leitura = ordem de execução.

### Reading Direction Visualization

```typescript
// Visualizar direção de leitura

// Compose - leitura reversa (confuso)
const composeFlow = compose(
  step4,  // ← Lê aqui primeiro
  step3,  // ← Depois aqui
  step2,  // ← Depois aqui
  step1   // ← Último na leitura, primeiro na execução
);
// Execução: step1 → step2 → step3 → step4
// Ordem de leitura inverte ordem de execução

// Pipe - leitura natural (claro)
const pipeFlow = pipe(
  step1,  // → Lê e executa primeiro
  step2,  // → Depois lê e executa
  step3,  // → Depois lê e executa
  step4   // → Último na leitura e execução
);
// Execução: step1 → step2 → step3 → step4
// Ordem de leitura = ordem de execução
```

**Mental Model:** Pipe reduz **cognitive load** - não precisa reverter ordem mentalmente.

#### Equivalence Proof

```typescript
// Provar equivalência matemática

// Funções
const f = (n: number) => n + 10;
const g = (n: number) => n * 2;
const h = (n: number) => n - 3;

// Compose
const composed = compose(f, g, h);
// composed(x) = f(g(h(x)))

// Pipe (ordem reversa)
const piped = pipe(h, g, f);
// piped(x) = f(g(h(x)))

// Testar equivalência
const input = 5;
console.log(composed(input));  // f(g(h(5))) = f(g(2)) = f(4) = 14
console.log(piped(input));     // f(g(h(5))) = f(g(2)) = f(4) = 14

// compose(f, g, h) ≡ pipe(h, g, f)
```

**Theorem:** `compose(f, g, h) ≡ pipe(h, g, f)` - reversing order makes them equivalent.

### Real-world Example: Data Processing

```typescript
// Processar dados de usuários

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

// Transformações
const filterActive = (users: User[]) => users.filter(u => u.active);
const filterAdults = (users: User[]) => users.filter(u => u.age >= 18);
const sortByName = (users: User[]) => [...users].sort((a, b) => a.name.localeCompare(b.name));
const mapToNames = (users: User[]) => users.map(u => u.name);
const joinWithComma = (names: string[]) => names.join(", ");

// Compose - ler de baixo para cima (confuso)
const processWithCompose = compose(
  joinWithComma,    // 5. Join
  mapToNames,       // 4. Map to names
  sortByName,       // 3. Sort
  filterAdults,     // 2. Filter adults
  filterActive      // 1. Filter active
);

// Pipe - ler de cima para baixo (claro)
const processWithPipe = pipe(
  filterActive,     // 1. Filter active
  filterAdults,     // 2. Filter adults
  sortByName,       // 3. Sort
  mapToNames,       // 4. Map to names
  joinWithComma     // 5. Join
);

const users: User[] = [
  { id: 1, name: "Charlie", email: "c@ex.com", age: 25, active: true },
  { id: 2, name: "Alice", email: "a@ex.com", age: 17, active: true },
  { id: 3, name: "Bob", email: "b@ex.com", age: 30, active: false }
];

console.log(processWithCompose(users));  // "Charlie"
console.log(processWithPipe(users));     // "Charlie"
```

**Insight:** Pipe torna **fluxo de dados** imediatamente aparente.

#### Imperative to Functional Migration

```typescript
// Código imperativo original
function processNumbers(numbers: number[]): number {
  // 1. Filter evens
  const evens = numbers.filter(n => n % 2 === 0);
  
  // 2. Double
  const doubled = evens.map(n => n * 2);
  
  // 3. Filter > 5
  const greaterThan5 = doubled.filter(n => n > 5);
  
  // 4. Sum
  const sum = greaterThan5.reduce((acc, n) => acc + n, 0);
  
  return sum;
}

// Migrar para compose - ordem reversa (confuso)
const functionalCompose = compose(
  (arr: number[]) => arr.reduce((acc, n) => acc + n, 0),  // 4. Sum
  (arr: number[]) => arr.filter(n => n > 5),              // 3. Filter
  (arr: number[]) => arr.map(n => n * 2),                 // 2. Double
  (arr: number[]) => arr.filter(n => n % 2 === 0)         // 1. Filter evens
);

// Migrar para pipe - mesma ordem (fácil)
const functionalPipe = pipe(
  (arr: number[]) => arr.filter(n => n % 2 === 0),        // 1. Filter evens
  (arr: number[]) => arr.map(n => n * 2),                 // 2. Double
  (arr: number[]) => arr.filter(n => n > 5),              // 3. Filter
  (arr: number[]) => arr.reduce((acc, n) => acc + n, 0)   // 4. Sum
);
```

**Insight:** Pipe facilita **refatoração** - manter ordem original.

### Modelo Mental para Compreensão

Pense em pipe e compose como **direção de leitura**:

**Compose (Matemática/Haskell):**
- **Livros árabes/hebraicos:** Leitura direita → esquerda
- **Notação matemática:** `(f ∘ g)(x)` - ler `f`, depois `g`, executar reverso
- **Mental model:** "Pense no resultado, depois volte para início"

**Pipe (Linguagens modernas):**
- **Livros ocidentais:** Leitura esquerda → direita
- **Código imperativo:** Linha 1 → Linha 2 → Linha 3
- **Mental model:** "Siga o fluxo de dados naturalmente"

**Analogia - Linha de Montagem:**

**Compose:** Descrever linha de trás para frente
- "Produto final → Pintura → Montagem → Peças"
- Confuso para visualizar processo

**Pipe:** Descrever linha da frente para trás
- "Peças → Montagem → Pintura → Produto final"
- Natural para visualizar processo

**Metáfora - Receita:**

**Compose:** Listar passos ao contrário
- "Servir → Assar → Misturar → Preparar ingredientes"
- Difícil seguir

**Pipe:** Listar passos em ordem
- "Preparar ingredientes → Misturar → Assar → Servir"
- Fácil seguir

**Fluxo visual:**
```
Compose:  [f] ← [g] ← [h] ← input
Pipe:     input → [h] → [g] → [f]

Ambos executam: h(input) → g(result) → f(result)
Compose: Lê f primeiro, executa h primeiro
Pipe: Lê h primeiro, executa h primeiro
```

## 🔍 Análise Conceitual Profunda

### Performance Comparison

```typescript
// Performance - ambos equivalentes

// Compose
const compose = <T>(...fns: Array<(arg: T) => T>) =>
  (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);

// Pipe
const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);

// Benchmark
const iterations = 1000000;

const add1 = (n: number) => n + 1;
const mul2 = (n: number) => n * 2;
const sub3 = (n: number) => n - 3;

const composed = compose(sub3, mul2, add1);
const piped = pipe(add1, mul2, sub3);

// Compose timing
console.time("compose");
for (let i = 0; i < iterations; i++) {
  composed(5);
}
console.timeEnd("compose");

// Pipe timing
console.time("pipe");
for (let i = 0; i < iterations; i++) {
  piped(5);
}
console.timeEnd("pipe");

// Performance: Equivalente (diferença negligível)
```

**Resultado:** Performance é **equivalente** - escolha baseada em legibilidade.

#### TypeScript Type Inference

```typescript
// Type inference - ambos preservam tipos

// Compose - tipos fluem direita → esquerda
const c = compose(
  (n: number) => n.toString(),     // number → string
  (n: number) => n * 2,            // number → number
  (s: string) => parseInt(s, 10)  // string → number
);
// Type: (s: string) => string

// Pipe - tipos fluem esquerda → direita (mais intuitivo)
const p = pipe(
  (s: string) => parseInt(s, 10),  // string → number
  (n: number) => n * 2,            // number → number
  (n: number) => n.toString()      // number → string
);
// Type: (s: string) => string

// Pipe: Ordem de tipos = ordem de leitura
```

**Insight:** Pipe torna **type flow** mais óbvio - tipos seguem ordem de leitura.

### Library Conventions

```typescript
// Diferentes bibliotecas, diferentes nomes

// Ramda: compose (R→L) e pipe (L→R)
import { compose as ramdaCompose, pipe as ramdaPipe } from "ramda";

// Lodash/fp: flowRight (R→L) e flow (L→R)
import { flowRight, flow } from "lodash/fp";

// Equivalências
const withRamda = ramdaPipe(step1, step2, step3);
const withLodash = flow(step1, step2, step3);
// Ambos: step1 → step2 → step3

const withRamdaCompose = ramdaCompose(step3, step2, step1);
const withFlowRight = flowRight(step3, step2, step1);
// Ambos: step1 → step2 → step3
```

**Naming:**
- **Ramda:** `compose`, `pipe`
- **Lodash:** `flowRight`, `flow`
- **Convention:** Pipe/flow mais comum em JS moderno

#### Haskell vs F# Tradition

```typescript
// Haskell tradition - compose (.)
// compose :: (b -> c) -> (a -> b) -> a -> c

const haskellStyle = <A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
) => (a: A) => f(g(a));

const h1 = haskellStyle(double, addOne);
// Haskell: (.) double addOne

// F# tradition - pipe (>>)
// (>>) :: (a -> b) -> (b -> c) -> a -> c

const fsharpStyle = <A, B, C>(
  g: (a: A) => B,
  f: (b: B) => C
) => (a: A) => f(g(a));

const h2 = fsharpStyle(addOne, double);
// F#: (>>) addOne double

// Tradições diferentes, mesma funcionalidade
```

**Historical:** Haskell influenciou compose, F# influenciou pipe.

### Debugging Comparison

```typescript
// Debugging - ambos podem usar tap

const tap = <T>(fn: (value: T) => void) => (value: T): T => {
  fn(value);
  return value;
};

// Compose com tap
const debugCompose = compose(
  tap(v => console.log("After step3:", v)),
  step3,
  tap(v => console.log("After step2:", v)),
  step2,
  tap(v => console.log("After step1:", v)),
  step1
);

// Pipe com tap
const debugPipe = pipe(
  step1,
  tap(v => console.log("After step1:", v)),
  step2,
  tap(v => console.log("After step2:", v)),
  step3,
  tap(v => console.log("After step3:", v))
);

// Pipe: tap placement mais natural (após função correspondente)
```

**Insight:** Pipe facilita **debugging** - tap após função naturalmente.

#### Async Composition

```typescript
// Async composition - ambas direções

type AsyncFn<T, U> = (value: T) => Promise<U>;

// Async compose
const composeAsync = <A, B, C>(
  f: AsyncFn<B, C>,
  g: AsyncFn<A, B>
): AsyncFn<A, C> =>
  async (a: A) => f(await g(a));

// Async pipe
const pipeAsync = <A, B, C>(
  g: AsyncFn<A, B>,
  f: AsyncFn<B, C>
): AsyncFn<A, C> =>
  async (a: A) => f(await g(a));

// Uso
const fetchUser: AsyncFn<number, User> = async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
};

const enrichUser: AsyncFn<User, EnrichedUser> = async (user) => {
  const posts = await fetch(`/api/posts?userId=${user.id}`).then(r => r.json());
  return { ...user, posts };
};

// Compose - ler ao contrário
const processCompose = composeAsync(enrichUser, fetchUser);

// Pipe - ler naturalmente
const processPipe = pipeAsync(fetchUser, enrichUser);

// Pipe mais claro: "fetch, then enrich"
```

**Insight:** Pipe alinha com **async/await** syntax - ordem sequencial.

### Point-free Style

```typescript
// Point-free - omitir argumentos

const numbers = [1, 2, 3, 4, 5];

// Compose
const transformCompose = compose(square, double, addOne);

// Pipe
const transformPipe = pipe(addOne, double, square);

// Ambos point-free - nenhum argumento explícito
const result1 = numbers.map(transformCompose);
const result2 = numbers.map(transformPipe);

// Point-free facilita composição
```

**Pattern:** Point-free funciona **igualmente bem** com ambos.

#### Partial Application Integration

```typescript
// Partial application com compose e pipe

const multiply = (a: number) => (b: number) => a * b;
const add = (a: number) => (b: number) => a + b;
const subtract = (a: number) => (b: number) => b - a;

// Criar funções parciais
const double = multiply(2);
const triple = multiply(3);
const add10 = add(10);
const subtract5 = subtract(5);

// Compose com parciais
const transformC = compose(subtract5, triple, add10);

// Pipe com parciais
const transformP = pipe(add10, triple, subtract5);

console.log(transformC(5));  // (((5 + 10) * 3) - 5) = 40
console.log(transformP(5));  // (((5 + 10) * 3) - 5) = 40
```

**Pattern:** Partial application funciona perfeitamente com **ambos**.

### Method Chaining vs Composition

```typescript
// Method chaining (OOP)
class NumberProcessor {
  constructor(private value: number) {}
  
  addOne() {
    return new NumberProcessor(this.value + 1);
  }
  
  double() {
    return new NumberProcessor(this.value * 2);
  }
  
  square() {
    return new NumberProcessor(this.value * this.value);
  }
  
  getValue() {
    return this.value;
  }
}

// Chaining - esquerda para direita (como pipe)
const result1 = new NumberProcessor(5)
  .addOne()
  .double()
  .square()
  .getValue();

// Pipe - mesmo fluxo
const transform = pipe(addOne, double, square);
const result2 = transform(5);

console.log(result1);  // 144
console.log(result2);  // 144

// Method chaining ≈ pipe em legibilidade
```

**Insight:** Pipe tem **legibilidade similar** a method chaining.

### Team Conventions

```typescript
// Escolher baseado em contexto de time

// Time com background matemático/Haskell
const mathTeam = compose(f3, f2, f1);

// Time com background JavaScript/imperativo
const jsTeam = pipe(f1, f2, f3);

// Time misto - documentar convenção
// Convention: usar pipe por padrão para legibilidade
const teamConvention = pipe(f1, f2, f3);
```

**Best Practice:** Escolher e **documentar convenção** de time.

## 🎯 Aplicabilidade e Contextos

### When to Use Compose

```typescript
// Matematicamente orientado, Haskell-like
const transform = compose(finalize, process, parse);
```

**Raciocínio:** Time familiarizado com matemática/Haskell.

### When to Use Pipe

```typescript
// Leitura natural, imperativo-like
const transform = pipe(parse, process, finalize);
```

**Raciocínio:** Maioria dos times - legibilidade.

### Migration from Imperative

```typescript
// Imperativo → pipe (ordem mantida)
const result = pipe(step1, step2, step3);
```

**Raciocínio:** Refatoração fácil - ordem se mantém.

## ⚠️ Limitações e Considerações Teóricas

### Neither is "Better"

```typescript
// Equivalentes matematicamente
compose(f, g, h) ≡ pipe(h, g, f)
```

**Consideração:** Escolha é **preferência**, não performance/funcionalidade.

### Team Consistency

```typescript
// Misturar ambos - confuso
const result = compose(pipe(f1, f2), f3);
```

**Consideração:** Manter **consistência** - escolher um e usar sempre.

### Debugging Stack Traces

```typescript
// Stack traces similares em ambos
```

**Consideração:** Debugging similarmente complexo em ambos.

## 🔗 Interconexões Conceituais

**Relação com Function Composition:** Implementações diferentes da mesma ideia.

**Relação com Readability:** Pipe geralmente mais legível.

**Relação com Mathematical Notation:** Compose segue matemática.

**Relação com Imperative Code:** Pipe facilita migração.

**Relação com Method Chaining:** Pipe similar a chaining.

## 🚀 Evolução e Próximos Conceitos

Dominar pipe vs. compose prepara para:
- **Type Safety em Composição:** Garantir compatibilidade de tipos
- **Monads:** Abstrações funcionais avançadas
- **Category Theory:** Fundamentos matemáticos
- **Function Pipelines:** Arquiteturas baseadas em pipelines
