# ReturnType<F> e Parameters<F>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`ReturnType<F>`** e **`Parameters<F>`** são tipos utilitários built-in que **extraem informações de assinaturas de função**. `ReturnType` obtém **tipo de retorno** de função `F`, enquanto `Parameters` extrai **tipos dos parâmetros** como tupla. Conceitualmente, representam **reflexão de tipos**, permitindo derivar tipos a partir de definições de função existentes.

Na essência, materializam o princípio de **type introspection**, onde você examina e reutiliza estrutura de tipos de funções, evitando duplicação e garantindo consistência entre definições relacionadas.

## 📋 Fundamentos

### ReturnType<F>

```typescript
// Função exemplo
function obterUsuario(): { id: number; nome: string } {
  return { id: 1, nome: "Ana" };
}

// Extrair tipo de retorno
type Usuario = ReturnType<typeof obterUsuario>;
// Resultado: { id: number; nome: string }

// Uso
const usuario: Usuario = { id: 2, nome: "Bob" };

// Com funções genéricas
function criar<T>(valor: T): T {
  return valor;
}

type RetornoCriar = ReturnType<typeof criar>;
// T (tipo genérico)
```

### Parameters<F>

```typescript
// Função exemplo
function processar(id: number, nome: string, ativo: boolean): void {
  console.log(id, nome, ativo);
}

// Extrair tipos dos parâmetros
type ParamsProcessar = Parameters<typeof processar>;
// Resultado: [number, string, boolean]

// Uso: chamar função com parâmetros tipados
const params: ParamsProcessar = [1, "Ana", true];
processar(...params); // ✅ Type-safe
```

**Conceito-chave:** ReturnType extrai **saída**, Parameters extrai **entrada** de função.

### Implementação Interna

```typescript
// ReturnType (built-in)
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;

// Parameters (built-in)
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;

// Explicação:
// - T extends (...args: any) => any: constraint - T deve ser função
// - infer R/P: captura tipo inferido (retorno/parâmetros)
// - Conditional type com inference
```

**Mecanismo:** Usa **conditional types** com **infer** para extrair tipos.

## 🔍 Análise Conceitual

### 1. Reutilização de Tipos

```typescript
// Função de API
async function buscarProdutos(
  categoria: string,
  limite: number,
  offset: number
): Promise<{ produtos: Produto[]; total: number }> {
  // Implementação...
  return { produtos: [], total: 0 };
}

// Extrair tipo de retorno (sem Promise)
type ResultadoBusca = Awaited<ReturnType<typeof buscarProdutos>>;
// { produtos: Produto[]; total: number }

// Extrair parâmetros para validação
type ParamsBusca = Parameters<typeof buscarProdutos>;
// [string, number, number]

// Usar em outra função
function validarBusca(...args: ParamsBusca): boolean {
  const [categoria, limite, offset] = args;
  return limite > 0 && offset >= 0 && categoria.length > 0;
}
```

### 2. Wrappers e Decorators

```typescript
function logging<F extends (...args: any[]) => any>(fn: F) {
  return function(...args: Parameters<F>): ReturnType<F> {
    console.log(`Chamando ${fn.name} com:`, args);
    const result = fn(...args);
    console.log(`Resultado:`, result);
    return result;
  };
}

// Uso
function somar(a: number, b: number): number {
  return a + b;
}

const somarComLog = logging(somar);
const resultado = somarComLog(2, 3);
// Log: Chamando somar com: [2, 3]
// Log: Resultado: 5
// resultado: number (type-safe!)
```

### 3. Callbacks Tipados

```typescript
// Biblioteca de eventos
class EventEmitter<Events extends Record<string, (...args: any[]) => any>> {
  private listeners: {
    [K in keyof Events]?: Events[K][];
  } = {};

  on<K extends keyof Events>(
    evento: K,
    callback: Events[K]
  ): void {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento]!.push(callback);
  }

  emit<K extends keyof Events>(
    evento: K,
    ...args: Parameters<Events[K]>
  ): void {
    const callbacks = this.listeners[evento] || [];
    callbacks.forEach(cb => cb(...args));
  }
}

// Uso
interface AppEvents {
  userLogin: (userId: number, timestamp: Date) => void;
  dataUpdate: (data: any) => void;
}

const emitter = new EventEmitter<AppEvents>();

emitter.on("userLogin", (userId, timestamp) => {
  // userId: number, timestamp: Date (inferido!)
  console.log(`User ${userId} logged in at ${timestamp}`);
});

emitter.emit("userLogin", 123, new Date()); // ✅ Type-safe
// emitter.emit("userLogin", "abc", new Date()); // ❌ Erro: "abc" não é number
```

### 4. Factory Functions

```typescript
interface Usuario {
  id: number;
  nome: string;
}

function criarUsuario(nome: string): Usuario {
  return { id: Math.random(), nome };
}

// Factory genérico que usa ReturnType
function criarFactory<F extends (...args: any[]) => any>(
  criador: F
): (...args: Parameters<F>) => ReturnType<F>[] {
  return (...args) => {
    return [criador(...args), criador(...args)];
  };
}

const criarDoisUsuarios = criarFactory(criarUsuario);
const usuarios = criarDoisUsuarios("Ana");
// usuarios: Usuario[]
```

### 5. API Clients

```typescript
// Definir endpoints
const endpoints = {
  getUser: (id: number) => `/users/${id}`,
  updateUser: (id: number, data: Partial<Usuario>) => `/users/${id}`,
  deleteUser: (id: number) => `/users/${id}`
} as const;

// Gerar tipo de client
type ApiClient = {
  [K in keyof typeof endpoints]: (
    ...args: Parameters<typeof endpoints[K]>
  ) => Promise<any>;
};

// Implementação
const client: ApiClient = {
  getUser: async (id) => {
    const url = endpoints.getUser(id);
    return fetch(url).then(r => r.json());
  },
  updateUser: async (id, data) => {
    const url = endpoints.updateUser(id, data);
    return fetch(url, { method: "PUT", body: JSON.stringify(data) });
  },
  deleteUser: async (id) => {
    const url = endpoints.deleteUser(id);
    return fetch(url, { method: "DELETE" });
  }
};
```

## 🎯 Aplicabilidade

### Memoização

```typescript
function memoize<F extends (...args: any[]) => any>(fn: F): F {
  const cache = new Map<string, ReturnType<F>>();

  return ((...args: Parameters<F>): ReturnType<F> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as F;
}

// Uso
const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10)); // Calcula e cacheia
console.log(fibonacci(10)); // Retorna do cache
```

### Testing Utilities

```typescript
// Mock de função preservando tipos
function createMock<F extends (...args: any[]) => any>(
  returnValue: ReturnType<F>
): jest.Mock<ReturnType<F>, Parameters<F>> {
  return jest.fn(() => returnValue);
}

// Uso
function buscarDados(id: number): Promise<{ nome: string }> {
  return fetch(`/api/${id}`).then(r => r.json());
}

const mockBuscar = createMock<typeof buscarDados>(
  Promise.resolve({ nome: "Mock" })
);

// Teste
mockBuscar(123); // Type-safe: aceita number
// mockBuscar("abc"); // ❌ Erro
```

### Retry Logic

```typescript
async function retry<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  args: Parameters<F>,
  tentativas: number = 3
): Promise<ReturnType<F>> {
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fn(...args);
    } catch (error) {
      if (i === tentativas - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Nunca deve chegar aqui");
}

// Uso
async function fetchData(url: string): Promise<any> {
  return fetch(url).then(r => r.json());
}

const data = await retry(fetchData, ["https://api.example.com"]);
// data: any (tipo de retorno de fetchData)
```

### Compose/Pipe Functions

```typescript
function compose<A extends any[], B, C>(
  f: (b: B) => C,
  g: (...args: A) => B
): (...args: A) => C {
  return (...args) => f(g(...args));
}

// Uso
const somar = (a: number, b: number) => a + b;
const dobrar = (n: number) => n * 2;

const somarEDobrar = compose(dobrar, somar);
const resultado = somarEDobrar(2, 3); // (2 + 3) * 2 = 10
// resultado: number (inferido!)
```

## ⚠️ Considerações

### 1. Overloads

```typescript
// Função com overloads
function processar(valor: string): string;
function processar(valor: number): number;
function processar(valor: string | number): string | number {
  return valor;
}

// ReturnType pega última assinatura (implementation)
type Retorno = ReturnType<typeof processar>;
// string | number (não as específicas)

// Parameters também
type Params = Parameters<typeof processar>;
// [string | number]
```

### 2. Funções Genéricas

```typescript
function identidade<T>(valor: T): T {
  return valor;
}

// ReturnType de genérica retorna tipo genérico
type RetornoIdentidade = ReturnType<typeof identidade>;
// T (desconhecido)

// Precisa instanciar tipo
type RetornoIdentidadeString = ReturnType<(valor: string) => ReturnType<typeof identidade>>;
```

### 3. Awaited com Async Functions

```typescript
async function buscar(): Promise<{ id: number }> {
  return { id: 1 };
}

// ReturnType retorna Promise
type ComPromise = ReturnType<typeof buscar>;
// Promise<{ id: number }>

// Use Awaited para unwrap
type SemPromise = Awaited<ReturnType<typeof buscar>>;
// { id: number }
```

### 4. ConstructorParameters

```typescript
// Similar a Parameters, mas para construtores
class Usuario {
  constructor(public nome: string, public idade: number) {}
}

type ParamsUsuario = ConstructorParameters<typeof Usuario>;
// [string, number]

// Criar instância com spread
const params: ParamsUsuario = ["Ana", 25];
const usuario = new Usuario(...params);
```

## 📚 Conclusão

`ReturnType<F>` extrai tipo de retorno de função, `Parameters<F>` extrai tipos de parâmetros como tupla. Usam conditional types com `infer` para reflexão de tipos. Ideais para wrappers type-safe, decorators, memoização, factories, API clients e utilities de teste. Evitam duplicação de tipos e garantem consistência. Combine ReturnType com `Awaited` para async functions. Parameters útil para spread operators type-safe. Ambos preservam type safety ao derivar de funções existentes.
