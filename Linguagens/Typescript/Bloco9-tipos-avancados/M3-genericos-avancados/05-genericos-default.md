# Genéricos com Default: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Genéricos com default** (`<T = string>`) permitem especificar **valor padrão para parâmetro de tipo**, usado quando tipo não é especificado explicitamente nem pode ser inferido. Conceitualmente, representa **optional typing com fallback**, onde você fornece tipo "seguro" como padrão enquanto permite customização quando necessário.

Na essência, materializa o princípio de **sensible defaults**, tornando APIs genéricas mais ergonômicas ao eliminar necessidade de especificar tipos óbvios repetidamente, mantendo flexibilidade para casos especiais.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Genérico com default
function criar<T = string>(valor?: T): T {
  return (valor ?? "default") as T;
}

// Usa default (T = string)
const str1 = criar();
// str1: string

const str2 = criar("texto");
// str2: string

// Especifica tipo explicitamente
const num = criar<number>(42);
// num: number

// Inferência supera default
const inferido = criar(100);
// inferido: number (inferido, não default!)
```

**Conceito-chave:** Default é usado **apenas quando tipo não pode ser inferido nem especificado**.

### Múltiplos Defaults

```typescript
// Vários parâmetros com defaults
function processar<
  Input = string,
  Output = Input,
  Error = string
>(
  input: Input,
  converter?: (i: Input) => Output
): Output | Error {
  if (!converter) {
    return input as any;
  }

  try {
    return converter(input);
  } catch {
    return "Erro ao processar" as Error;
  }
}

// Todos defaults aplicados
const result1 = processar("texto");
// Input = string, Output = string, Error = string

// Especificar apenas Input
const result2 = processar<number>(42);
// Input = number, Output = number, Error = string
```

## 🔍 Análise Conceitual

### 1. Classes com Defaults

```typescript
// Container genérico com default
class Container<T = any> {
  constructor(public value: T) {}

  map<R = T>(fn: (value: T) => R): Container<R> {
    return new Container(fn(this.value));
  }

  get(): T {
    return this.value;
  }
}

// Usa default (T = any)
const container1 = new Container("texto");
// container1: Container<any> (default!)

// Especifica tipo
const container2 = new Container<number>(42);
// container2: Container<number>

// Inferência de map
const container3 = new Container(10).map(n => n.toString());
// container3: Container<string>
```

### 2. API Response com Default

```typescript
// Response genérica com default any
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

// Função que retorna response
async function fetch1(url: string): Promise<ApiResponse> {
  // T = any (default)
  const response = await fetch(url);
  return {
    data: await response.json(),
    status: response.status,
    message: "OK"
  };
}

// Especificar tipo de data
interface User {
  id: number;
  nome: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  // T = User (especificado)
  return fetch1(`/api/users/${id}`) as Promise<ApiResponse<User>>;
}
```

### 3. State Management com Default

```typescript
// Estado com tipo default
class Store<State = Record<string, any>> {
  constructor(private state: State) {}

  getState(): State {
    return this.state;
  }

  setState(newState: Partial<State>): void {
    this.state = { ...this.state, ...newState };
  }
}

// Uso sem tipo específico
const store1 = new Store({ count: 0, name: "App" });
// store1: Store<Record<string, any>>

// Uso com tipo específico
interface AppState {
  count: number;
  user: User | null;
}

const store2 = new Store<AppState>({ count: 0, user: null });
// store2: Store<AppState>
```

### 4. Eventos com Default

```typescript
// Event emitter com default void para payload
class EventEmitter<Events extends Record<string, any> = Record<string, void>> {
  private listeners: {
    [K in keyof Events]?: Array<(payload: Events[K]) => void>;
  } = {};

  on<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    const listeners = this.listeners[event] || [];
    listeners.forEach(listener => listener(payload));
  }
}

// Default: eventos sem payload
const emitter1 = new EventEmitter();
emitter1.on("click", () => console.log("Clicked"));
emitter1.emit("click", undefined);

// Tipado: eventos com payloads específicos
interface AppEvents {
  login: { userId: number };
  logout: void;
  dataUpdate: { data: any };
}

const emitter2 = new EventEmitter<AppEvents>();
emitter2.on("login", ({ userId }) => console.log(userId));
emitter2.emit("login", { userId: 123 });
```

### 5. Builder com Defaults Progressivos

```typescript
// Builder onde tipos vão sendo especificados
class QueryBuilder<
  Entity = any,
  Selected = Entity
> {
  private selectFields?: (keyof Entity)[];
  private whereClause?: Partial<Entity>;

  select<K extends keyof Entity>(
    ...fields: K[]
  ): QueryBuilder<Entity, Pick<Entity, K>> {
    this.selectFields = fields;
    return this as any;
  }

  where(clause: Partial<Entity>): QueryBuilder<Entity, Selected> {
    this.whereClause = clause;
    return this;
  }

  build(): { select?: any[]; where?: any } {
    return {
      select: this.selectFields,
      where: this.whereClause
    };
  }
}

// Default: Entity = any, Selected = any
const query1 = new QueryBuilder();

// Especificar Entity
interface Product {
  id: number;
  name: string;
  price: number;
}

const query2 = new QueryBuilder<Product>()
  .select("id", "name")
  .where({ price: 100 });
```

## 🎯 Aplicabilidade

### React-like Components

```typescript
// Props com default
interface ComponentProps<T = any> {
  data: T;
  onLoad?: () => void;
}

function Component<T = any>(props: ComponentProps<T>): void {
  console.log(props.data);
  props.onLoad?.();
}

// Uso genérico
Component({ data: "qualquer coisa" });

// Uso tipado
Component<User>({ data: { id: 1, nome: "Ana" } });
```

### Cache Genérico

```typescript
class Cache<K = string, V = any> {
  private storage = new Map<K, V>();

  set(key: K, value: V): void {
    this.storage.set(key, value);
  }

  get(key: K): V | undefined {
    return this.storage.get(key);
  }

  has(key: K): boolean {
    return this.storage.has(key);
  }
}

// Default: string keys, any values
const cache1 = new Cache();
cache1.set("user:1", { id: 1, nome: "Ana" });

// Específico
const cache2 = new Cache<number, User>();
cache2.set(1, { id: 1, nome: "Bob" });
```

### Options/Config Objects

```typescript
interface FetchOptions<T = any> {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: T;
  headers?: Record<string, string>;
}

async function request<Req = any, Res = any>(
  options: FetchOptions<Req>
): Promise<Res> {
  const response = await fetch(options.url, {
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: options.headers
  });

  return response.json();
}

// Uso genérico
const res1 = await request({ url: "/api/data" });
// Req = any, Res = any

// Uso tipado
const res2 = await request<LoginRequest, LoginResponse>({
  url: "/api/login",
  method: "POST",
  body: { email: "user@example.com", senha: "pass" }
});
```

### Validators

```typescript
type Validator<T = any> = (value: any) => value is T;

function createValidator<T = any>(
  check: (value: any) => boolean
): Validator<T> {
  return (value: any): value is T => check(value);
}

// Default
const isString = createValidator(v => typeof v === "string");

// Específico
const isUser = createValidator<User>(
  v => typeof v === "object" && "id" in v && "nome" in v
);
```

## ⚠️ Considerações

### 1. Default vs Inferência

```typescript
function processar<T = string>(valor: T): T {
  return valor;
}

// Inferência supera default!
const num = processar(42);
// num: number (inferido, não string)

// Default só é usado sem inferência
const str = processar();
// ❌ Erro: falta argumento

// Para usar default, precisa tornar parâmetro opcional
function processar2<T = string>(valor?: T): T {
  return (valor ?? "default") as T;
}

const str2 = processar2();
// str2: string (default aplicado)
```

### 2. Default com Constraints

```typescript
// Default deve satisfazer constraint
interface HasId {
  id: number;
}

interface DefaultEntity extends HasId {
  id: number;
  name: string;
}

function processar<T extends HasId = DefaultEntity>(
  item: T
): number {
  return item.id;
}

// ❌ Default inválido
// function invalido<T extends HasId = string>() {}
// Erro: string não satisfaz HasId
```

### 3. Ordem de Parâmetros com Defaults

```typescript
// ✅ Defaults no final
function criar<T, U = T, V = U>() {}

// ❌ Evite defaults no meio
function evite<T = string, U>() {}
// Se especificar U, precisa especificar T também

// Melhor reordenar
function melhor<U, T = string>() {}
```

### 4. Defaults em Interfaces vs Types

```typescript
// Interface com default
interface Container<T = any> {
  value: T;
}

const c1: Container = { value: "qualquer" }; // T = any

// Type alias com default
type Result<T = void> = { success: true; data: T } | { success: false };

const r1: Result = { success: true, data: undefined }; // T = void
const r2: Result<number> = { success: true, data: 42 }; // T = number
```

## 📚 Conclusão

Genéricos com default (`<T = DefaultType>`) fornecem tipo padrão quando não especificado nem inferido. Tornam APIs mais ergonômicas eliminando necessidade de especificar tipos óbvios. Default é usado apenas quando inferência falha - inferência sempre tem prioridade. Úteis em containers, API responses, state management, eventos, caches e configurações. Default deve satisfazer constraints se houver. Coloque parâmetros com default no final para melhor usabilidade. Combine com parâmetros opcionais para máxima flexibilidade.
