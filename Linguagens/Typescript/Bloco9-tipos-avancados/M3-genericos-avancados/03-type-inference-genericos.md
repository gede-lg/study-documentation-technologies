# Type Inference em Genéricos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Type inference em genéricos** refere-se à capacidade do TypeScript de **deduzir automaticamente parâmetros de tipo** a partir de argumentos passados, sem necessidade de especificação explícita. Conceitualmente, representa **type deduction**, onde compilador analisa valores concretos e infere tipos abstratos correspondentes, tornando código genérico tão conveniente quanto código não-genérico.

Na essência, materializa o princípio de **type safety sem verbosidade**, onde sistema de tipos trabalha para você, deduzindo tipos complexos de forma transparente, mantendo segurança com ergonomia.

## 📋 Fundamentos

### Inferência Básica

```typescript
// Função genérica
function identidade<T>(valor: T): T {
  return valor;
}

// ✅ TypeScript infere T = number
const num = identidade(42);
// num: number

// ✅ Infere T = string
const str = identidade("texto");
// str: string

// ✅ Infere T = { id: number }
const obj = identidade({ id: 1 });
// obj: { id: number }

// Também funciona explicitamente (mas desnecessário)
const explicit = identidade<number>(42);
```

**Conceito-chave:** TypeScript **analisa argumentos** para deduzir tipos genéricos automaticamente.

### Inferência com Múltiplos Parâmetros

```typescript
function par<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

// Infere T = number, U = string
const resultado = par(1, "texto");
// resultado: [number, string]

// Infere tipos complexos
const complexo = par({ id: 1 }, [true, false]);
// complexo: [{ id: number }, boolean[]]
```

## 🔍 Análise Conceitual

### 1. Inferência de Arrays

```typescript
function primeiro<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numeros = [1, 2, 3];
const el1 = primeiro(numeros);
// el1: number | undefined (T inferido como number)

const palavras = ["a", "b", "c"];
const el2 = primeiro(palavras);
// el2: string | undefined

// Array de union
const misturado = [1, "texto", true];
const el3 = primeiro(misturado);
// el3: string | number | boolean | undefined
```

### 2. Inferência a Partir de Retorno de Callback

```typescript
function mapear<T, R>(arr: T[], fn: (item: T) => R): R[] {
  return arr.map(fn);
}

const numeros = [1, 2, 3];

// Infere T = number, R = string
const strings = mapear(numeros, n => n.toString());
// strings: string[]

// Infere T = number, R = boolean
const booleanos = mapear(numeros, n => n > 2);
// booleanos: boolean[]

// Infere T = number, R = { valor: number; dobro: number }
const objetos = mapear(numeros, n => ({ valor: n, dobro: n * 2 }));
// objetos: { valor: number; dobro: number }[]
```

### 3. Inferência com Constraints

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const usuario = {
  id: 1,
  nome: "Ana",
  idade: 25
};

// Infere T = typeof usuario, K = "nome"
const nome = getProperty(usuario, "nome");
// nome: string (tipo exato de usuario["nome"])

// Infere K = "idade"
const idade = getProperty(usuario, "idade");
// idade: number

// ❌ Erro: "invalido" não é keyof typeof usuario
// const erro = getProperty(usuario, "invalido");
```

### 4. Inferência Contextual

```typescript
// TypeScript usa contexto para inferir tipos
function processar<T>(
  valor: T,
  handlers: {
    onSuccess: (v: T) => void;
    onError: (err: Error) => void;
  }
): void {
  try {
    handlers.onSuccess(valor);
  } catch (err) {
    handlers.onError(err as Error);
  }
}

// T inferido como number, callbacks recebem number
processar(42, {
  onSuccess: v => console.log(v * 2), // v: number (inferido!)
  onError: err => console.error(err)
});

// T inferido como { id: number }
processar({ id: 1 }, {
  onSuccess: obj => console.log(obj.id), // obj: { id: number }
  onError: err => console.error(err)
});
```

### 5. Inferência com Generic Classes

```typescript
class Container<T> {
  constructor(public value: T) {}

  map<R>(fn: (value: T) => R): Container<R> {
    return new Container(fn(this.value));
  }
}

// T inferido como number
const container1 = new Container(42);
// container1: Container<number>

// map infere R = string
const container2 = container1.map(n => n.toString());
// container2: Container<string>

// Encadeamento com inferência
const resultado = new Container(10)
  .map(n => n * 2)      // Container<number>
  .map(n => n > 15)     // Container<boolean>
  .map(b => b ? "sim" : "não"); // Container<string>
// resultado: Container<string>
```

## 🎯 Aplicabilidade

### Promise e Async/Await

```typescript
async function buscar<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

// Especificar tipo explicitamente
interface User {
  id: number;
  nome: string;
}

const user = await buscar<User>("/api/user");
// user: User

// Ou deixar inferir (menos preciso)
const data = await buscar("/api/data");
// data: unknown (sem inferência suficiente)
```

### React Components (Exemplo Conceitual)

```typescript
// Hook genérico
function useState<T>(initialValue: T): [T, (newValue: T) => void] {
  let value = initialValue;

  const setValue = (newValue: T) => {
    value = newValue;
  };

  return [value, setValue];
}

// T inferido como number
const [count, setCount] = useState(0);
// count: number, setCount: (newValue: number) => void

// T inferido como string
const [name, setName] = useState("Ana");
// name: string

// T inferido como User | null
const [user, setUser] = useState<User | null>(null);
// user: User | null
```

### Builder Pattern com Inferência

```typescript
class QueryBuilder<T> {
  private filters: Partial<T> = {};

  where<K extends keyof T>(key: K, value: T[K]): this {
    this.filters[key] = value;
    return this;
  }

  build(): Partial<T> {
    return this.filters;
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// T inferido como Product
const query = new QueryBuilder<Product>()
  .where("name", "Laptop") // K = "name", value deve ser string
  .where("price", 1000)    // K = "price", value deve ser number
  .build();

// query.where("name", 123); // ❌ Erro: 123 não é string
```

### Compose/Pipe com Inferência

```typescript
function compose<A, B, C>(
  f: (b: B) => C,
  g: (a: A) => B
): (a: A) => C {
  return a => f(g(a));
}

const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const toString = (n: number) => n.toString();

// Todos os tipos inferidos automaticamente
const pipeline = compose(toString, compose(double, addOne));
// pipeline: (a: number) => string

const resultado = pipeline(5);
// resultado: string ("12")
```

### Redux-like Reducers

```typescript
type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

function createAction<T extends string>(type: T): Action<T>;
function createAction<T extends string, P>(
  type: T,
  payload: P
): Action<T, P>;
function createAction(type: string, payload?: any) {
  return payload === undefined ? { type } : { type, payload };
}

// Inferência completa
const incrementAction = createAction("INCREMENT");
// incrementAction: { type: "INCREMENT" }

const setValueAction = createAction("SET_VALUE", 42);
// setValueAction: { type: "SET_VALUE"; payload: number }

const setUserAction = createAction("SET_USER", { id: 1, nome: "Ana" });
// setUserAction: { type: "SET_USER"; payload: { id: number; nome: string } }
```

## ⚠️ Considerações

### 1. Quando Inferência Não é Suficiente

```typescript
function criar<T>(): T {
  return {} as T;
}

// ❌ Não consegue inferir - precisa especificar
// const obj = criar(); // Erro

// ✅ Especificar explicitamente
const user = criar<User>();
// user: User

// Caso onde inferência ajuda
function criarComDefault<T>(valor: T): T {
  return valor;
}

const obj2 = criarComDefault({ id: 1 }); // ✅ Infere { id: number }
```

### 2. Inferência vs Anotação Explícita

```typescript
// Inferência pode ser muito ampla
function processar<T>(valor: T): T {
  return valor;
}

const result1 = processar({ tipo: "admin" });
// result1: { tipo: string } (tipo amplo demais!)

// Melhor: especificar quando precisa ser mais específico
type Role = "admin" | "user";
const result2 = processar<{ tipo: Role }>({ tipo: "admin" });
// result2: { tipo: "admin" | "user" }

// Ou usar 'as const'
const result3 = processar({ tipo: "admin" as const });
// result3: { tipo: "admin" }
```

### 3. Inferência com Overloads

```typescript
// Overloads permitem diferentes padrões de inferência
function processar<T>(valor: T): T;
function processar<T>(valor: T[]): T[];
function processar(valor: any): any {
  return Array.isArray(valor) ? valor : valor;
}

const single = processar(42); // number
const array = processar([1, 2, 3]); // number[]
```

### 4. Partial Type Argument Inference

```typescript
// TypeScript não suporta inferência parcial direta
function criar<T, U>(a: T, b: U): [T, U] {
  return [a, b];
}

// ❌ Não pode especificar só T
// const result = criar<string>(42, true);

// Workaround: reordenar parâmetros ou split em funções
function criarString<U>(b: U): [string, U] {
  return ["texto", b];
}

const result = criarString(42); // [string, number]
```

## 📚 Conclusão

Type inference em genéricos permite TypeScript deduzir parâmetros de tipo automaticamente analisando argumentos, eliminando necessidade de especificação explícita na maioria dos casos. Funciona com arrays, callbacks, constraints, contexto e classes genéricas. Essencial para ergonomia sem sacrificar type safety. Use inferência quando tipos podem ser deduzidos de argumentos; especifique explicitamente quando não há informação suficiente (ex: criar objeto vazio, tipos literais específicos). Combine com `as const` para literais, overloads para padrões complexos.
