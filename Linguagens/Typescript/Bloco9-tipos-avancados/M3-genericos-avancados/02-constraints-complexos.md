# Constraints Complexos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Constraints complexos** referem-se ao uso de **restrições avançadas em parâmetros de tipo genéricos**, combinando `extends`, tipos utilitários, unions, intersections e conditional types para limitar tipos aceitos de forma sofisticada (ex: `<T extends Partial<U>>`, `<K extends keyof T>`). Conceitualmente, representa **type-level programming**, onde você expressa regras complexas sobre quais tipos são válidos.

Na essência, materializa o princípio de **design by contract em tipos**, garantindo invariantes estruturais e relacionamentos entre tipos, tornando APIs mais seguras e expressivas sem sacrificar flexibilidade.

## 📋 Fundamentos

### Constraints Básicos

```typescript
// Constraint simples: T deve ter propriedade 'id'
function getId<T extends { id: number }>(obj: T): number {
  return obj.id;
}

getId({ id: 1, nome: "Ana" }); // ✅ OK
// getId({ nome: "Bob" }); // ❌ Erro: falta 'id'

// Constraint com interface
interface Identificavel {
  id: number;
}

function processar<T extends Identificavel>(item: T): void {
  console.log(item.id);
}
```

### Keyof Constraint

```typescript
// K deve ser chave de T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const usuario = { id: 1, nome: "Ana", idade: 25 };

const nome = getProperty(usuario, "nome"); // string
const id = getProperty(usuario, "id"); // number
// const invalido = getProperty(usuario, "inexistente"); // ❌ Erro
```

**Conceito-chave:** Constraints definem **subset válido** de tipos que genérico pode aceitar.

## 🔍 Análise Conceitual

### 1. Constraints com Tipos Utilitários

```typescript
// T deve ser versão parcial de U
function atualizar<T, U extends Partial<T>>(
  objeto: T,
  atualizacao: U
): T {
  return { ...objeto, ...atualizacao };
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const user: Usuario = { id: 1, nome: "Ana", email: "ana@example.com" };

// Aceita subset de propriedades
const atualizado = atualizar(user, { nome: "Ana Silva" }); // ✅ OK
// const erro = atualizar(user, { idade: 30 }); // ❌ Erro: 'idade' não existe em Usuario

// Required constraint
function validar<T extends Required<{ id: number; nome: string }>>(
  obj: T
): boolean {
  return obj.id > 0 && obj.nome.length > 0;
}

// Readonly constraint
function processoRead<T extends Readonly<{ valor: number }>>(
  config: T
): number {
  // config.valor = 10; // ❌ Erro: readonly
  return config.valor * 2;
}
```

### 2. Constraints com Union Types

```typescript
// T deve ser um dos tipos especificados
function processar<T extends string | number>(valor: T): T {
  if (typeof valor === "string") {
    return valor.toUpperCase() as T;
  }
  return (valor * 2) as T;
}

processar("texto"); // ✅ OK
processar(42); // ✅ OK
// processar(true); // ❌ Erro: boolean não é string | number

// Constraint com literal union
type Status = "pending" | "approved" | "rejected";

function setStatus<S extends Status>(status: S): void {
  console.log(`Status: ${status}`);
}

setStatus("approved"); // ✅ OK
// setStatus("invalid"); // ❌ Erro
```

### 3. Constraints Relacionais (Entre Parâmetros)

```typescript
// T deve estender U
function copiar<T extends U, U>(origem: T, destino: U): U {
  return { ...destino, ...origem };
}

interface Base {
  id: number;
}

interface Extendido extends Base {
  nome: string;
}

const base: Base = { id: 1 };
const ext: Extendido = { id: 2, nome: "Ana" };

copiar(ext, base); // ✅ OK: Extendido extends Base
// copiar(base, ext); // ❌ Erro: Base não extends Extendido

// Array element deve estender tipo específico
function filtrar<T, E extends T>(
  arr: T[],
  predicate: (item: T) => item is E
): E[] {
  return arr.filter(predicate);
}
```

### 4. Constraints com Conditional Types

```typescript
// T deve ser array, extrair tipo do elemento
type ElementType<T> = T extends (infer E)[] ? E : never;

function primeiro<T extends any[]>(arr: T): ElementType<T> | undefined {
  return arr[0];
}

const nums = [1, 2, 3];
const el = primeiro(nums); // number | undefined

// T deve ser função, extrair retorno
function executar<F extends (...args: any[]) => any>(
  fn: F
): ReturnType<F> {
  return fn();
}

const resultado = executar(() => 42); // number
```

### 5. Constraints com Intersection Types

```typescript
// T deve ter id E timestamp
function salvar<T extends { id: number } & { timestamp: Date }>(
  item: T
): void {
  console.log(`Salvando item ${item.id} de ${item.timestamp}`);
}

salvar({ id: 1, timestamp: new Date(), nome: "Ana" }); // ✅ OK
// salvar({ id: 1 }); // ❌ Erro: falta timestamp
// salvar({ timestamp: new Date() }); // ❌ Erro: falta id

// Combinar múltiplos constraints
interface Serializable {
  toJSON(): string;
}

interface Comparable {
  compareTo(other: this): number;
}

function processar<T extends Serializable & Comparable>(item: T): void {
  const json = item.toJSON();
  const comparison = item.compareTo(item);
}
```

## 🎯 Aplicabilidade

### Repository Pattern com Constraints

```typescript
interface Entity {
  id: number;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

// Repository só aceita entidades com id e timestamps
class Repository<T extends Entity & Timestamped> {
  private items: T[] = [];

  save(item: T): void {
    const existing = this.items.findIndex(i => i.id === item.id);

    if (existing >= 0) {
      item.updatedAt = new Date();
      this.items[existing] = item;
    } else {
      this.items.push(item);
    }
  }

  findById(id: number): T | undefined {
    return this.items.find(i => i.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }
}

// Uso
interface User extends Entity, Timestamped {
  nome: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.save({
  id: 1,
  nome: "Ana",
  email: "ana@example.com",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Type-Safe Event System

```typescript
// Evento deve ter tipo string literal
type EventMap = {
  [K: string]: (...args: any[]) => void;
};

class TypedEventEmitter<Events extends EventMap> {
  private listeners: {
    [K in keyof Events]?: Events[K][];
  } = {};

  on<K extends keyof Events>(event: K, listener: Events[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(
    event: K,
    ...args: Parameters<Events[K]>
  ): void {
    const listeners = this.listeners[event] || [];
    listeners.forEach(listener => listener(...args));
  }
}

// Uso
interface AppEvents {
  userLogin: (userId: number, timestamp: Date) => void;
  dataUpdate: (data: any) => void;
  error: (message: string, code: number) => void;
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("userLogin", (userId, timestamp) => {
  console.log(`User ${userId} at ${timestamp}`);
});

emitter.emit("userLogin", 123, new Date()); // ✅ Type-safe
// emitter.emit("userLogin", "abc", new Date()); // ❌ Erro: "abc" não é number
```

### Builder com State Transitions

```typescript
// Builder que garante ordem de chamadas
interface BuilderState {
  hasName?: boolean;
  hasEmail?: boolean;
}

class UserBuilder<State extends BuilderState = {}> {
  private data: Partial<User> = {};

  setName(nome: string): UserBuilder<State & { hasName: true }> {
    this.data.nome = nome;
    return this as any;
  }

  setEmail(email: string): UserBuilder<State & { hasEmail: true }> {
    this.data.email = email;
    return this as any;
  }

  // build só funciona se hasName e hasEmail estão true
  build(
    this: UserBuilder<{ hasName: true; hasEmail: true }>
  ): User {
    return this.data as User;
  }
}

// Uso
const user = new UserBuilder()
  .setName("Ana")
  .setEmail("ana@example.com")
  .build(); // ✅ OK

// const invalid = new UserBuilder()
//   .setName("Bob")
//   .build(); // ❌ Erro: falta email
```

### Generic Components com Props Constraints

```typescript
// Props devem ter id
interface BaseProps {
  id: string;
}

function Component<P extends BaseProps>(props: P): void {
  console.log(`Component ${props.id}`);
  // Pode acessar outras propriedades de P também
}

// Uso
Component({ id: "1", title: "Test" }); // ✅ OK
// Component({ title: "Test" }); // ❌ Erro: falta id

// Children constraint
interface WithChildren<T> {
  children: T[];
}

function renderList<T, P extends WithChildren<T>>(props: P): void {
  props.children.forEach(child => {
    // Render child
  });
}
```

### Deep Partial com Constraints

```typescript
// Tipo recursivo com constraint
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// Função que aceita update profundamente parcial
function deepUpdate<T extends Record<string, any>>(
  original: T,
  update: DeepPartial<T>
): T {
  return { ...original, ...update } as T;
}

interface Config {
  server: {
    host: string;
    port: number;
  };
  database: {
    url: string;
    pool: number;
  };
}

const config: Config = {
  server: { host: "localhost", port: 3000 },
  database: { url: "postgres://...", pool: 10 }
};

// Atualizar apenas parte
const updated = deepUpdate(config, {
  server: { port: 8080 } // Não precisa de host
});
```

## ⚠️ Considerações

### 1. Constraints vs Type Assertions

```typescript
// ❌ Type assertion - não garante runtime
function processar(valor: any): number {
  return (valor as number) * 2; // Pode crashar se não for number
}

// ✅ Constraint - garante em compile time
function processarSeguro<T extends number>(valor: T): number {
  return valor * 2; // Type-safe
}
```

### 2. Constraints Muito Restritivos

```typescript
// ❌ Constraint muito específico - pouco reutilizável
function processar<T extends { id: number; nome: string; email: string }>(
  obj: T
): void {
  // Só aceita objetos com exatamente essas 3 propriedades
}

// ✅ Constraint mínimo necessário - mais flexível
function processarFlexivel<T extends { id: number }>(obj: T): void {
  // Aceita qualquer objeto com id
}
```

### 3. Constraints com Conditional Types

```typescript
// Constraint condicional
type ArrayOrSingle<T> = T extends any[] ? T : T[];

function toArray<T>(value: T): ArrayOrSingle<T> {
  return (Array.isArray(value) ? value : [value]) as ArrayOrSingle<T>;
}

const arr1 = toArray([1, 2, 3]); // number[]
const arr2 = toArray(42); // number[]
```

## 📚 Conclusão

Constraints complexos usam `extends` combinado com tipos utilitários (`Partial`, `Required`, `Readonly`), `keyof`, unions, intersections e conditional types para restringir genéricos de forma sofisticada. Permitem expressar regras como "T deve ser parcial de U", "K deve ser chave de T", "T deve ter id E timestamp". Essenciais para repositories, event emitters, builders com state, componentes genéricos e type-safe APIs. Use constraints mínimos necessários para flexibilidade. Constraints garantem type safety em compile time sem runtime overhead.
