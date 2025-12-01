# Multiple Type Parameters: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Multiple type parameters** refere-se à capacidade de declarar **múltiplos parâmetros de tipo genéricos** em função, classe ou interface (ex: `<T, U, V>`), cada um representando tipo independente. Conceitualmente, representa **polimorfismo multi-dimensional**, onde função/estrutura pode ser abstrata sobre vários tipos simultaneamente, não apenas um.

Na essência, materializa o princípio de **abstração composicional**, permitindo relações complexas entre tipos de entrada e saída, transformações entre diferentes tipos e estruturas de dados heterogêneas tipadas.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Função com dois parâmetros de tipo
function par<T, U>(primeiro: T, segundo: U): [T, U] {
  return [primeiro, segundo];
}

const resultado1 = par(1, "texto");
// resultado1: [number, string]

const resultado2 = par(true, { id: 1 });
// resultado2: [boolean, { id: number }]

// Três parâmetros
function tripla<T, U, V>(a: T, b: U, c: V): { a: T; b: U; c: V } {
  return { a, b, c };
}

const obj = tripla(1, "x", true);
// obj: { a: number; b: string; c: boolean }
```

**Conceito-chave:** Cada parâmetro de tipo é **independente** e pode representar tipo diferente.

### Convenções de Nomenclatura

```typescript
// Convenções comuns:
// T, U, V - genéricos básicos
// K, V - Key, Value (para maps/records)
// E - Element (para coleções)
// R - Result/Return
// P - Props/Parameters

// Map/Dictionary
interface Map<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
}

// Transformação
function mapear<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.map(fn);
}

// Múltiplos tipos relacionados
function converter<Input, Output>(
  valor: Input,
  conversor: (i: Input) => Output
): Output {
  return conversor(valor);
}
```

## 🔍 Análise Conceitual

### 1. Tuplas e Pares Tipados

```typescript
// Função que cria tupla tipada
function criarPar<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const par1 = criarPar(1, "um");
// [number, string]

const par2 = criarPar({ id: 1 }, [1, 2, 3]);
// [{ id: number }, number[]]

// Inverter ordem
function inverter<A, B>(tupla: [A, B]): [B, A] {
  return [tupla[1], tupla[0]];
}

const invertido = inverter([1, "texto"]);
// [string, number]
```

### 2. Transformações Entre Tipos

```typescript
// Transformar tipo A em tipo B usando função
function transformar<Input, Output>(
  valores: Input[],
  transformador: (item: Input) => Output
): Output[] {
  return valores.map(transformador);
}

// Uso: number[] → string[]
const numeros = [1, 2, 3];
const strings = transformar(numeros, n => n.toString());
// strings: string[]

// Uso: User → UserDTO
interface User {
  id: number;
  nome: string;
  senha: string;
}

interface UserDTO {
  id: number;
  nome: string;
}

const users: User[] = [
  { id: 1, nome: "Ana", senha: "secret" }
];

const dtos = transformar(users, u => ({ id: u.id, nome: u.nome }));
// dtos: UserDTO[]
```

### 3. Combinação de Estruturas

```typescript
// Mesclar dois objetos de tipos diferentes
function mesclar<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const pessoa = { nome: "Ana", idade: 25 };
const contato = { email: "ana@example.com", telefone: "123" };

const completo = mesclar(pessoa, contato);
// completo: { nome: string; idade: number } & { email: string; telefone: string }

console.log(completo.nome); // ✅ OK
console.log(completo.email); // ✅ OK
```

### 4. Estruturas de Dados Genéricas

```typescript
// Map/Dictionary com key e value tipados
class Dictionary<K, V> {
  private items: Map<K, V> = new Map();

  set(key: K, value: V): void {
    this.items.set(key, value);
  }

  get(key: K): V | undefined {
    return this.items.get(key);
  }

  has(key: K): boolean {
    return this.items.has(key);
  }

  entries(): [K, V][] {
    return Array.from(this.items.entries());
  }
}

// Uso com diferentes combinações
const userById = new Dictionary<number, User>();
userById.set(1, { id: 1, nome: "Ana", senha: "x" });

const configByKey = new Dictionary<string, boolean>();
configByKey.set("darkMode", true);

const cacheByUrl = new Dictionary<string, { data: any; timestamp: number }>();
cacheByUrl.set("https://api.com", { data: {}, timestamp: Date.now() });
```

### 5. Result/Either Pattern

```typescript
// Success ou Error com tipos diferentes
type Result<T, E> =
  | { success: true; value: T }
  | { success: false; error: E };

function dividir(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Divisão por zero" };
  }
  return { success: true, value: a / b };
}

// Map sobre Result
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.success) {
    return { success: true, value: fn(result.value) };
  }
  return result;
}

const resultado = dividir(10, 2);
const dobrado = mapResult(resultado, x => x * 2);
// dobrado: Result<number, string>
```

## 🎯 Aplicabilidade

### API Request/Response

```typescript
// Request e Response podem ter tipos diferentes
async function apiCall<Req, Res>(
  endpoint: string,
  request: Req
): Promise<Res> {
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify(request)
  });
  return response.json();
}

// Uso
interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  token: string;
  userId: number;
}

const resposta = await apiCall<LoginRequest, LoginResponse>(
  "/api/login",
  { email: "user@example.com", senha: "pass" }
);
// resposta: LoginResponse
```

### Conversores e Adaptadores

```typescript
// Conversor genérico entre formatos
interface Converter<From, To> {
  convert(value: From): To;
}

class NumberToStringConverter implements Converter<number, string> {
  convert(value: number): string {
    return value.toString();
  }
}

class DateToTimestampConverter implements Converter<Date, number> {
  convert(value: Date): number {
    return value.getTime();
  }
}

// Composição de conversores
function composeConverters<A, B, C>(
  conv1: Converter<A, B>,
  conv2: Converter<B, C>
): Converter<A, C> {
  return {
    convert: (value: A) => conv2.convert(conv1.convert(value))
  };
}
```

### State Machines

```typescript
// Estado e Evento podem ser tipos diferentes
class StateMachine<State, Event> {
  constructor(
    private state: State,
    private transitions: Map<State, Map<Event, State>>
  ) {}

  dispatch(event: Event): State {
    const stateTransitions = this.transitions.get(this.state);
    if (!stateTransitions) {
      return this.state;
    }

    const nextState = stateTransitions.get(event);
    if (nextState) {
      this.state = nextState;
    }

    return this.state;
  }

  getState(): State {
    return this.state;
  }
}

// Uso
type TrafficLightState = "red" | "yellow" | "green";
type TrafficLightEvent = "timer" | "emergency";

const trafficLight = new StateMachine<TrafficLightState, TrafficLightEvent>(
  "red",
  new Map([
    ["red", new Map([["timer", "green"]])],
    ["green", new Map([["timer", "yellow"], ["emergency", "red"]])],
    ["yellow", new Map([["timer", "red"]])]
  ])
);

trafficLight.dispatch("timer"); // red → green
```

### Validadores e Parsers

```typescript
// Input e Output podem ser diferentes
interface Parser<Input, Output> {
  parse(input: Input): Output | null;
}

class JsonParser<T> implements Parser<string, T> {
  parse(input: string): T | null {
    try {
      return JSON.parse(input);
    } catch {
      return null;
    }
  }
}

class IntParser implements Parser<string, number> {
  parse(input: string): number | null {
    const num = parseInt(input, 10);
    return isNaN(num) ? null : num;
  }
}

// Uso
const jsonParser = new JsonParser<User>();
const user = jsonParser.parse('{"id": 1, "nome": "Ana"}');
// user: User | null
```

### Builders Tipados

```typescript
// Builder state e final type diferentes
class QueryBuilder<T, Selected = T> {
  private selectFields?: (keyof T)[];
  private whereClause?: Partial<T>;

  select<K extends keyof T>(...fields: K[]): QueryBuilder<T, Pick<T, K>> {
    this.selectFields = fields;
    return this as any;
  }

  where(clause: Partial<T>): QueryBuilder<T, Selected> {
    this.whereClause = clause;
    return this;
  }

  build(): { fields?: (keyof T)[]; where?: Partial<T> } {
    return {
      fields: this.selectFields,
      where: this.whereClause
    };
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const query = new QueryBuilder<Product>()
  .select("id", "name")
  .where({ price: 100 })
  .build();
```

## ⚠️ Considerações

### 1. Ordem dos Parâmetros

```typescript
// Ordem importa quando há inferência parcial
function criar<T, U>(valor: T): U {
  return valor as unknown as U;
}

// Precisa especificar ambos se especificar algum
const resultado = criar<number, string>(42);

// Melhor: colocar tipos inferíveis primeiro
function melhor<T, U>(valor: T, conversor: (v: T) => U): U {
  return conversor(valor);
}

// Infere ambos!
const res = melhor(42, n => n.toString());
// res: string (inferido)
```

### 2. Muitos Parâmetros = Complexidade

```typescript
// ❌ Difícil de entender
function complexo<T, U, V, W, X, Y>(
  a: T, b: U, c: V, d: W, e: X
): Y {
  // ...
}

// ✅ Melhor: agrupar em objetos
interface Params<T, U, V> {
  primeiro: T;
  segundo: U;
  terceiro: V;
}

function simplificado<T, U, V, R>(params: Params<T, U, V>): R {
  // ...
}
```

### 3. Relações Entre Parâmetros

```typescript
// Parâmetros podem ter constraints entre si
function copiar<T extends U, U>(origem: T, destino: U): void {
  Object.assign(destino, origem);
}

// T deve ser mais específico que U
interface Base { id: number }
interface Extendido extends Base { nome: string }

const base: Base = { id: 1 };
const ext: Extendido = { id: 2, nome: "Ana" };

copiar(ext, base); // ✅ OK: Extendido extends Base
// copiar(base, ext); // ❌ Erro: Base não extends Extendido
```

## 📚 Conclusão

Multiple type parameters (`<T, U, V>`) permitem abstrair sobre múltiplos tipos independentemente em funções, classes e interfaces. Essenciais para estruturas que relacionam diferentes tipos: tuplas, transformações, Result/Either, maps, conversores, parsers e builders. Cada parâmetro é independente mas pode ter constraints relativos. Ordem importa para inferência. Convenções: T/U/V genéricos, K/V para keys/values, Input/Output para transformações. Evite excesso de parâmetros - agrupe em objetos quando necessário.
