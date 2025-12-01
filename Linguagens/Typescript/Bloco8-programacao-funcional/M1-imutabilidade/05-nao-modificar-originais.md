# Não Modificar Arrays/Objetos Originais

## 🎯 Introdução e Definição

### Definição Conceitual

**Não modificar originais** é um princípio de **immutability** (imutabilidade) que estabelece que **data structures** (arrays, objects) nunca devem ser **modificadas in-place** após criação - ao invés de mutação, cria-se **nova versão** da structure com as alterações desejadas, preservando a original intacta. Este princípio garante **referential transparency** - mesma input sempre produz mesma output, sem side effects.

Conceitualmente, não modificar originais implementa **persistent data structures** - versões anteriores permanecem acessíveis após "modificações". Diferentemente de **ephemeral data structures** (mutáveis), onde modificação destrói estado anterior, persistent structures criam **nova versão** enquanto mantêm versão anterior. TypeScript/JavaScript usa **structural sharing** - partes não modificadas são compartilhadas entre versões.

**Fundamento teórico:** Immutability previne **temporal coupling** - código que depende de **ordem de execução** para funcionar corretamente. Com immutability, funções são **pure** (puras) - não têm side effects, sempre produzem mesmo output para mesmo input. Facilita **reasoning** sobre código - sem mutations inesperadas, behavior é previsível.

**Mutation vs Immutability**:
- **Mutation:** Modificar structure existente - altera estado in-place
- **Immutability:** Criar nova structure - original preservado

### Contexto Histórico e Evolução

**Lisp (1958):** Primeiro language com **immutable data structures** - cons cells imutáveis.

**Functional Programming (1960s-1970s):** Paradigma baseado em imutabilidade - Haskell, ML, Scheme.

**JavaScript ES5 (2009):** Array methods **mutating** (push, splice) vs **non-mutating** (map, filter).

```javascript
// ES5 - mutating methods
var arr = [1, 2, 3];
arr.push(4);  // Mutação - modifica arr

// ES5 - non-mutating methods
var doubled = arr.map(x => x * 2);  // Novo array - arr preservado
```

**React (2013):** Popularização de **immutability** em JavaScript - state updates imutáveis.

**Immutable.js (2014):** Library de **persistent data structures** para JavaScript.

**Redux (2015):** State management baseado em **immutability** - reducers são pure functions.

**JavaScript ES6 (2015):** **Spread operator** facilita immutability patterns.

```javascript
// ES6 - spread para immutability
const arr = [1, 2, 3];
const withItem = [...arr, 4];  // Novo array - arr preservado
```

**TypeScript 2.0 (2016):** **Readonly modifier** - enforcement de immutability.

**TypeScript 3.4 (2019):** **`as const` assertion** - immutability profunda.

**Evolução de práticas:**

**Era Mutation (JavaScript tradicional):**
```javascript
// Mutação - modifica original
const arr = [1, 2, 3];
arr.push(4);
arr.sort();
```

**Era Immutability (ES6+):**
```javascript
// Immutability - preserva original
const arr = [1, 2, 3];
const withItem = [...arr, 4];
const sorted = [...arr].sort();
```

**Era TypeScript Readonly:**
```typescript
// Readonly - compile-time enforcement
const arr: readonly number[] = [1, 2, 3];
arr.push(4);  // ❌ Error - immutability enforced
```

### Problema Fundamental que Resolve

Não modificar originais resolve problemas de **unexpected mutations**, **hard-to-debug bugs**, e **unpredictable behavior**.

**Problema 1: Mutation oculta**
```typescript
// Função que mutação oculta
function addItem(arr: number[], item: number): number[] {
  arr.push(item);  // ⚠️ Mutação - modifica argumento
  return arr;
}

const original = [1, 2, 3];
const updated = addItem(original, 4);

console.log(original);  // [1, 2, 3, 4] - original modificado!
console.log(updated);   // [1, 2, 3, 4] - mesma referência
console.log(original === updated);  // true - mesmo array
```

**Solução: Immutability**
```typescript
// Função immutable - preserva original
function addItem(arr: number[], item: number): number[] {
  return [...arr, item];  // ✅ Novo array - original preservado
}

const original = [1, 2, 3];
const updated = addItem(original, 4);

console.log(original);  // [1, 2, 3] - preservado
console.log(updated);   // [1, 2, 3, 4] - novo array
console.log(original === updated);  // false - arrays diferentes
```

**Problema 2: Bugs difíceis de debugar**
```typescript
// Mutation causa bug sutil
const config = { port: 3000, host: "localhost" };

function setupServer(cfg: Config) {
  cfg.port = 8080;  // ⚠️ Mutação - modifica argumento
  server.listen(cfg.port, cfg.host);
}

setupServer(config);
console.log(config.port);  // 8080 - modificado! Bug sutil
```

**Solução: Immutability**
```typescript
// Immutable - sem side effects
function setupServer(cfg: Config): Config {
  const serverConfig = { ...cfg, port: 8080 };  // ✅ Novo object
  server.listen(serverConfig.port, serverConfig.host);
  return serverConfig;
}

setupServer(config);
console.log(config.port);  // 3000 - preservado
```

**Problema 3: React re-rendering incorreto**
```typescript
// Mutation impede React de detectar mudança
const [items, setItems] = useState([1, 2, 3]);

function addItem() {
  items.push(4);  // ⚠️ Mutação - mesma referência
  setItems(items);  // React não detecta mudança (referência igual)
  // Component NÃO re-renderiza
}
```

**Solução: Immutability**
```typescript
// Immutable - React detecta mudança
function addItem() {
  setItems([...items, 4]);  // ✅ Nova referência
  // React detecta mudança (referência diferente)
  // Component re-renderiza
}
```

**Fundamento teórico:** Immutability garante **referential transparency** - facilita reasoning e detectar mudanças.

### Importância no Ecossistema

Não modificar originais é crucial porque:

- **Predictability:** Behavior previsível, sem side effects
- **Debugging:** Easier - sem mutations ocultas
- **Time-Travel Debugging:** Preservar histórico de estados
- **React Performance:** Detecção eficiente de mudanças
- **Concurrency:** Thread-safe - sem race conditions
- **Testing:** Testes determinísticos
- **Undo/Redo:** Implementação trivial com histórico
- **Pure Functions:** Composable, testable, reusable

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Referential Transparency:** Mesma input → mesma output
2. **No Side Effects:** Funções não modificam argumentos
3. **Structural Sharing:** Partes não modificadas compartilhadas
4. **Pure Functions:** Sem mutations, sem side effects
5. **Persistent Data:** Versões anteriores preservadas

### Pilares Fundamentais

- **Preserve Original:** Original nunca modificado
- **Create New:** Criar nova version com mudanças
- **Non-Mutating Methods:** map, filter, reduce, etc.
- **Spread Operator:** Cópia immutable
- **Readonly Types:** Enforcement em compile-time

### Visão Geral das Nuances

- **Array Immutability:** Spread, map, filter, slice
- **Object Immutability:** Spread, Object.assign
- **Nested Immutability:** Deep copy necessário
- **Performance:** Structural sharing mitiga overhead
- **Readonly Enforcement:** TypeScript readonly

## 🧠 Fundamentos Teóricos

### Array Mutating vs Non-Mutating Methods

```typescript
const numbers = [3, 1, 4, 2, 5];

// ❌ MUTATING methods - modificam original
numbers.push(6);        // Adiciona element - MUTAÇÃO
numbers.pop();          // Remove last - MUTAÇÃO
numbers.shift();        // Remove first - MUTAÇÃO
numbers.unshift(0);     // Adiciona no início - MUTAÇÃO
numbers.splice(1, 2);   // Remove/adiciona - MUTAÇÃO
numbers.sort();         // Ordena - MUTAÇÃO
numbers.reverse();      // Inverte - MUTAÇÃO

// ✅ NON-MUTATING methods - preservam original
const mapped = numbers.map(x => x * 2);      // Novo array
const filtered = numbers.filter(x => x > 2); // Novo array
const sliced = numbers.slice(1, 3);          // Novo array
const concatenated = numbers.concat([6, 7]); // Novo array
const reduced = numbers.reduce((a, b) => a + b, 0);  // Valor
```

**Análise profunda:**

**Mutating methods:**
- Modificam array **in-place**
- **Não** retornam novo array (alguns retornam removed element)
- **Quebram** immutability

**Non-mutating methods:**
- **Preservam** original
- Retornam **novo array** ou valor
- **Respeitam** immutability

**Fundamento teórico:** Preferir **non-mutating methods** - previsíveis e seguros.

### Immutable Array Operations

```typescript
const original = [1, 2, 3, 4, 5];

// ✅ Adicionar element (immutable)
const withItem = [...original, 6];           // Final
const withPrefix = [0, ...original];         // Início
const withMiddle = [...original.slice(0, 2), 2.5, ...original.slice(2)];  // Meio

// ✅ Remover element (immutable)
const withoutFirst = original.slice(1);      // Remove primeiro
const withoutLast = original.slice(0, -1);   // Remove último
const withoutIndex = [...original.slice(0, 2), ...original.slice(3)];  // Remove index 2

// ✅ Update element (immutable)
const updated = original.map((x, i) => i === 2 ? 10 : x);  // Update index 2

// ✅ Sort (immutable)
const sorted = [...original].sort((a, b) => a - b);  // Cópia + sort

// ✅ Reverse (immutable)
const reversed = [...original].reverse();  // Cópia + reverse

console.log(original);  // [1, 2, 3, 4, 5] - sempre preservado
```

**Pattern:** Criar **cópia** (spread) antes de usar mutating method.

### Princípios e Conceitos Subjacentes

#### Immutable Object Operations

```typescript
const original = { id: 1, name: "Alice", age: 30 };

// ✅ Update property (immutable)
const updated = { ...original, age: 31 };

// ✅ Add property (immutable)
const extended = { ...original, email: "alice@example.com" };

// ✅ Remove property (immutable)
const { age, ...rest } = original;  // Destructuring - rest sem 'age'

// ✅ Update nested property (immutable - deep)
const user = {
  id: 1,
  profile: { name: "Alice", age: 30 }
};

const updatedUser = {
  ...user,
  profile: { ...user.profile, age: 31 }  // Spread aninhado
};

console.log(original);  // { id: 1, name: "Alice", age: 30 } - preservado
console.log(user.profile.age);  // 30 - preservado
```

**Fundamento teórico:** Spread operator cria **shallow copy** - para nested, spread recursivamente.

#### Pure Functions

```typescript
// ❌ Impure - modifica argumento (side effect)
function impureAddItem(arr: number[], item: number): number[] {
  arr.push(item);  // Mutação - side effect
  return arr;
}

// ✅ Pure - não modifica argumento
function pureAddItem(arr: number[], item: number): number[] {
  return [...arr, item];  // Novo array - sem side effect
}

// ❌ Impure - modifica global state
let count = 0;
function impureIncrement(): number {
  count++;  // Mutação de global - side effect
  return count;
}

// ✅ Pure - sem global state
function pureIncrement(current: number): number {
  return current + 1;  // Sem side effect - retorna novo valor
}
```

**Conceito fundamental:** **Pure functions**:
- Mesma input → mesma output
- Sem side effects (mutations, I/O, etc.)
- Referentially transparent

### Immutability with Array Methods

```typescript
const numbers = [1, 2, 3, 4, 5];

// ✅ map - transforma elements (immutable)
const doubled = numbers.map(x => x * 2);
// [2, 4, 6, 8, 10]

// ✅ filter - filtra elements (immutable)
const evens = numbers.filter(x => x % 2 === 0);
// [2, 4]

// ✅ reduce - agrega values (immutable)
const sum = numbers.reduce((acc, x) => acc + x, 0);
// 15

// ✅ flatMap - map + flatten (immutable)
const expanded = numbers.flatMap(x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6, 4, 8, 5, 10]

// ✅ slice - cria subarray (immutable)
const subset = numbers.slice(1, 4);
// [2, 3, 4]

console.log(numbers);  // [1, 2, 3, 4, 5] - sempre preservado
```

**Análise profunda:** Array methods **funcionais** são **immutable by design**.

### Readonly for Enforcement

```typescript
// Readonly array - compile-time enforcement
const numbers: readonly number[] = [1, 2, 3];

// ❌ Mutating methods - bloqueados
numbers.push(4);     // ❌ Error: push não existe
numbers.pop();       // ❌ Error: pop não existe
numbers.splice(1, 1); // ❌ Error: splice não existe
numbers.sort();      // ❌ Error: sort não existe

// ✅ Non-mutating methods - permitidos
const doubled = numbers.map(x => x * 2);     // ✅ OK
const filtered = numbers.filter(x => x > 1); // ✅ OK
const sliced = numbers.slice(1, 3);          // ✅ OK

// Readonly object
const config: {
  readonly port: number;
  readonly host: string;
} = { port: 3000, host: "localhost" };

config.port = 8080;  // ❌ Error: readonly property
```

**Fundamento teórico:** `readonly` **enforces** immutability em **compile-time** - previne mutations acidentais.

### Modelo Mental para Compreensão

Pense em immutability como **edição de documentos**:

**Mutation:** Editar documento original - destrói versão anterior
**Immutability:** Salvar como nova versão - original preservado

**Analogia - Fotografia:**

**Mutation:** Rabiscar na foto original - destrói original
**Immutability:** Editar cópia - original intacto

**Metáfora - Git Commits:**

**Mutation:** Force push - sobrescreve história
**Immutability:** Novo commit - histórico preservado

**Fluxo immutable:**
```
original = [1, 2, 3]
  ↓
Quero adicionar 4
  ↓
Criar cópia: [...original, 4]
  ↓
original = [1, 2, 3] (preservado)
updated = [1, 2, 3, 4] (novo)
```

**Fluxo mutável (evitar):**
```
array = [1, 2, 3]
  ↓
array.push(4) - MUTAÇÃO
  ↓
array = [1, 2, 3, 4] (modificado in-place)
[1, 2, 3] perdido - não existe mais
```

## 🔍 Análise Conceitual Profunda

### Immutability with Nested Structures

```typescript
// Nested structure - shallow immutability insuficiente
const user = {
  id: 1,
  profile: {
    name: "Alice",
    address: {
      city: "NYC",
      country: "USA"
    }
  }
};

// ❌ Shallow copy - nested compartilhado
const shallow = { ...user };
shallow.profile.address.city = "LA";  // MODIFICA ORIGINAL
console.log(user.profile.address.city);  // "LA" - afetado!

// ✅ Deep copy manual - spread recursivo
const deep = {
  ...user,
  profile: {
    ...user.profile,
    address: {
      ...user.profile.address,
      city: "LA"
    }
  }
};
console.log(user.profile.address.city);  // "NYC" - preservado
```

**Pattern:** **Deep immutability** requer spread recursivo - verbose mas explícito.

**Alternativa - Immer library:**
```typescript
import produce from "immer";

const updated = produce(user, draft => {
  draft.profile.address.city = "LA";  // "Mutação" em draft
});
// Immer cria immutable copy automaticamente
console.log(user.profile.address.city);  // "NYC" - preservado
```

#### Performance Considerations

```typescript
// Immutability tem overhead - criar novos objects
const large = Array.from({ length: 10000 }, (_, i) => ({ id: i }));

// ❌ Performance issue - criar copy a cada iteração
for (let i = 0; i < 1000; i++) {
  const updated = [...large, { id: 10000 + i }];  // Nova alocação
}

// ✅ Melhor - batch updates
const newItems = Array.from({ length: 1000 }, (_, i) => ({ id: 10000 + i }));
const updated = [...large, ...newItems];  // Single alocação
```

**Consideração:** Immutability tem **overhead** - usar **structural sharing** libraries (Immutable.js, Immer) para performance.

### Immutability in React

```typescript
// React state - immutability OBRIGATÓRIA
const [todos, setTodos] = useState<Todo[]>([
  { id: 1, text: "Learn TS", done: false },
  { id: 2, text: "Build app", done: false }
]);

// ❌ ERRADO - mutação não funciona
function markDone(id: number) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = true;  // ⚠️ Mutação - React NÃO detecta
    setTodos(todos);   // Mesma referência - sem re-render
  }
}

// ✅ CORRETO - immutable update
function markDone(id: number) {
  setTodos(todos.map(todo =>
    todo.id === id
      ? { ...todo, done: true }  // Novo object
      : todo
  ));  // Novo array - React detecta mudança
}

// ✅ Adicionar todo
function addTodo(text: string) {
  setTodos([...todos, { id: Date.now(), text, done: false }]);
}

// ✅ Remover todo
function removeTodo(id: number) {
  setTodos(todos.filter(todo => todo.id !== id));
}
```

**Fundamento teórico:** React usa **shallow equality** (`===`) para detectar mudanças - requer **nova referência**.

#### Immutability in Redux Reducers

```typescript
// Redux reducer - DEVE ser pure function
interface State {
  count: number;
  items: string[];
  user: { name: string; age: number } | null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    // ✅ Immutable - retorna novo state
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, age: action.payload } : null
      };
    
    default:
      return state;  // Sem mudança - retorna mesmo state
  }
}

// ❌ ERRADO - mutação quebra Redux
function badReducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      state.count++;  // ⚠️ MUTAÇÃO - quebra time-travel debugging
      return state;
    
    case "ADD_ITEM":
      state.items.push(action.payload);  // ⚠️ MUTAÇÃO
      return state;
    
    default:
      return state;
  }
}
```

**Análise profunda:** Redux **exige** immutability - permite **time-travel debugging** e **optimized rendering**.

### Immutability Testing

```typescript
// Test - immutability facilita assertions
function addItem(arr: number[], item: number): number[] {
  return [...arr, item];
}

// ✅ Test - original preservado
test("addItem preserves original", () => {
  const original = [1, 2, 3];
  const originalCopy = [...original];  // Snapshot antes
  
  const result = addItem(original, 4);
  
  expect(original).toEqual(originalCopy);  // Original não mudou
  expect(result).toEqual([1, 2, 3, 4]);    // Resultado correto
  expect(result).not.toBe(original);       // Referências diferentes
});
```

**Benefício:** Immutability torna testes **determinísticos** - sem side effects ocultos.

#### Immutability for Time-Travel

```typescript
// Time-travel debugging - histórico de estados
class StateManager<T> {
  private history: T[] = [];
  private currentIndex = -1;
  
  push(state: T): void {
    // Truncate future se voltou no tempo
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    this.history.push(state);  // Adicionar novo state
    this.currentIndex++;
  }
  
  undo(): T | undefined {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
  }
  
  redo(): T | undefined {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
  }
  
  current(): T | undefined {
    return this.history[this.currentIndex];
  }
}

// Uso
const stateManager = new StateManager<State>();

stateManager.push({ count: 0 });
stateManager.push({ count: 1 });  // Novo state - anterior preservado
stateManager.push({ count: 2 });

console.log(stateManager.current());  // { count: 2 }
console.log(stateManager.undo());     // { count: 1 }
console.log(stateManager.undo());     // { count: 0 }
console.log(stateManager.redo());     // { count: 1 }
```

**Conceito avançado:** Immutability permite **undo/redo trivial** - estados anteriores preservados.

### Structural Sharing

```typescript
// Structural sharing - efficiency com immutability
const original = {
  user: { id: 1, name: "Alice" },
  settings: { theme: "dark", fontSize: 14 },
  data: { items: [1, 2, 3] }
};

// Update apenas 'theme'
const updated = {
  ...original,
  settings: { ...original.settings, theme: "light" }
};

// Structural sharing:
console.log(updated.user === original.user);  // true - compartilhado
console.log(updated.settings === original.settings);  // false - modificado
console.log(updated.data === original.data);  // true - compartilhado

// Apenas 'settings' object foi alocado - resto compartilhado
```

**Análise profunda:** Immutability **não copia tudo** - apenas partes modificadas são novas, resto é compartilhado.

#### Immutability with Class Instances

```typescript
// Class instance - cuidado com methods
class User {
  constructor(
    public id: number,
    public name: string
  ) {}
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

const user = new User(1, "Alice");

// ❌ Spread perde prototype (methods)
const updated = { ...user, name: "Bob" };
console.log(updated.greet);  // undefined - method perdido

// ✅ Solução - factory method
class User {
  // ...
  
  withName(name: string): User {
    return new User(this.id, name);  // Nova instância
  }
}

const updated2 = user.withName("Bob");
console.log(updated2.greet());  // "Hello, Bob" - method preservado
```

**Limitação:** Spread **não preserva** prototype - classes precisam **factory methods**.

### Immutability Patterns

```typescript
// Pattern 1: Update item in array
const updateItem = <T>(
  arr: T[],
  predicate: (item: T) => boolean,
  updater: (item: T) => T
): T[] => {
  return arr.map(item => predicate(item) ? updater(item) : item);
};

// Pattern 2: Remove item from array
const removeItem = <T>(
  arr: T[],
  predicate: (item: T) => boolean
): T[] => {
  return arr.filter(item => !predicate(item));
};

// Pattern 3: Insert item at index
const insertAt = <T>(arr: T[], index: number, item: T): T[] => {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
};

// Pattern 4: Toggle boolean property
const toggleProp = <T extends Record<K, boolean>, K extends keyof T>(
  obj: T,
  key: K
): T => {
  return { ...obj, [key]: !obj[key] };
};

// Uso
const todos = [
  { id: 1, text: "A", done: false },
  { id: 2, text: "B", done: false }
];

const updated = updateItem(
  todos,
  todo => todo.id === 1,
  todo => ({ ...todo, done: true })
);
```

**Patterns:** Helper functions para **common immutable operations**.

## 🎯 Aplicabilidade e Contextos

### React State Management

```typescript
// Immutable state updates
const [state, setState] = useState({ count: 0, items: [] });

setState(prev => ({ ...prev, count: prev.count + 1 }));
```

**Raciocínio:** React depende de immutability para performance.

### Redux Reducers

```typescript
// Pure reducers
function reducer(state, action) {
  return { ...state, ...updates };  // Novo state
}
```

**Raciocínio:** Reducers devem ser pure functions.

### Function Arguments

```typescript
// Não modificar arguments
function process(arr: number[]): number[] {
  return [...arr].sort();  // Cópia antes de sort
}
```

**Raciocínio:** Funções não devem ter side effects.

## ⚠️ Limitações e Considerações Teóricas

### Performance Overhead

```typescript
// Criar copies tem custo
const large = Array(10000).fill(0);
const updated = [...large, 1];  // Alocação de 10001 elements
```

**Limitação:** Immutability tem overhead - mitigar com structural sharing.

### Shallow Copy Insufficient

```typescript
const obj = { nested: { x: 1 } };
const copy = { ...obj };
copy.nested.x = 2;  // Modifica original
```

**Consideração:** Deep immutability requer spread recursivo.

### Learning Curve

```typescript
// Immutability patterns menos intuitivos
const updated = arr.map((item, i) => i === 2 ? newItem : item);
```

**Consideração:** Requer prática para naturalizar patterns.

## 🔗 Interconexões Conceituais

**Relação com Spread Operator:** Spread implementa immutability.

**Relação com Pure Functions:** Immutability é requisito para pureza.

**Relação com Functional Programming:** Paradigma baseado em immutability.

**Relação com React:** React otimizado para immutability.

**Relação com Readonly:** Readonly enforces immutability.

## 🚀 Evolução e Próximos Conceitos

Dominar não modificar originais prepara para:
- **Funções Puras:** Pure functions sem side effects
- **Functional Programming:** Paradigma completo
- **Advanced React Patterns:** Optimizations e hooks
- **State Management:** Redux, MobX patterns
