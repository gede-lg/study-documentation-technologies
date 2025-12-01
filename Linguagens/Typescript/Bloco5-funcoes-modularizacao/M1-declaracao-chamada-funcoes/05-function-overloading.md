# Function Overloading em TypeScript

## 🎯 Introdução

**Function overloading** (sobrecarga de funções) permite definir **múltiplas assinaturas** para uma mesma função, oferecendo diferentes combinações de tipos de parâmetros e retorno, com **type safety** garantido em tempo de compilação.

## 📋 Conceitos Fundamentais

### Sintaxe Básica

```typescript
// Assinaturas de sobrecarga (overload signatures)
function processar(valor: string): string;
function processar(valor: number): number;

// Assinatura de implementação (implementation signature)
function processar(valor: string | number): string | number {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  } else {
    return valor * 2;
  }
}

// Uso type-safe
const resultado1 = processar("texto"); // tipo: string
const resultado2 = processar(42); // tipo: number
```

### Estrutura de Overloading

```typescript
// 1. Declarar assinaturas de sobrecarga
function funcao(param1: Tipo1): Retorno1;
function funcao(param1: Tipo2, param2: Tipo3): Retorno2;

// 2. Implementação que cobre todas as assinaturas
function funcao(param1: Tipo1 | Tipo2, param2?: Tipo3): Retorno1 | Retorno2 {
  // lógica que atende todas as sobrecargas
}
```

## 🧠 Fundamentos Teóricos

### Resolução de Sobrecarga

TypeScript **tenta cada assinatura em ordem** até encontrar match:

```typescript
function converter(valor: string): number;
function converter(valor: number): string;
function converter(valor: boolean): string;

function converter(valor: string | number | boolean): string | number {
  if (typeof valor === "string") {
    return parseInt(valor); // retorna number
  } else if (typeof valor === "number") {
    return valor.toString(); // retorna string
  } else {
    return valor.toString(); // retorna string
  }
}

// TypeScript usa primeira assinatura que corresponde aos argumentos
const num = converter("123"); // tipo: number (primeira assinatura)
const str = converter(456); // tipo: string (segunda assinatura)
const bool = converter(true); // tipo: string (terceira assinatura)
```

### Assinatura de Implementação Não É Visível

```typescript
function somar(a: number, b: number): number;
function somar(a: string, b: string): string;

function somar(a: number | string, b: number | string): number | string {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  } else {
    return String(a) + String(b);
  }
}

// ✅ Válido: corresponde a overload signatures
somar(5, 3); // number
somar("5", "3"); // string

// ❌ Inválido: não corresponde a nenhuma overload signature
somar(5, "3"); // Erro! Implementação aceita, mas overload não
```

### Ordem das Assinaturas Importa

```typescript
// ⚠️ Ordem específica → genérica
function processar(valor: string): string;
function processar(valor: string | number): string | number;

function processar(valor: string | number): string | number {
  return typeof valor === "string" ? valor.toUpperCase() : valor * 2;
}

const resultado = processar("texto"); // tipo: string (primeira assinatura)

// ✅ Correto: mais específica primeiro
```

## 🔍 Análise Conceitual Profunda

### Overloading com Diferentes Aridades

```typescript
// Número diferente de parâmetros
function criar(nome: string): { nome: string };
function criar(nome: string, idade: number): { nome: string; idade: number };

function criar(nome: string, idade?: number): any {
  if (idade !== undefined) {
    return { nome, idade };
  } else {
    return { nome };
  }
}

const obj1 = criar("Ana"); // tipo: { nome: string }
const obj2 = criar("Bruno", 30); // tipo: { nome: string; idade: number }
```

### Overloading com Diferentes Tipos de Retorno

```typescript
// Retorno depende do tipo de entrada
function primeiro(array: string[]): string;
function primeiro(array: number[]): number;

function primeiro(array: string[] | number[]): string | number {
  return array[0];
}

const str = primeiro(["a", "b", "c"]); // tipo: string
const num = primeiro([1, 2, 3]); // tipo: number
```

### Overloading com Union vs Literal Types

```typescript
// Overloading com literal types
function formatar(tipo: "data", valor: Date): string;
function formatar(tipo: "moeda", valor: number): string;
function formatar(tipo: "texto", valor: string): string;

function formatar(tipo: string, valor: Date | number | string): string {
  switch (tipo) {
    case "data":
      return (valor as Date).toLocaleDateString();
    case "moeda":
      return `R$ ${(valor as number).toFixed(2)}`;
    case "texto":
      return (valor as string).toUpperCase();
    default:
      return String(valor);
  }
}

const dataFormatada = formatar("data", new Date()); // tipo: string
const moedaFormatada = formatar("moeda", 123.45); // tipo: string
```

### Overloading com Generics

```typescript
// Combinar overloading com generics
function mapear<T>(array: T[], fn: (item: T) => T): T[];
function mapear<T, U>(array: T[], fn: (item: T) => U): U[];

function mapear<T, U = T>(array: T[], fn: (item: T) => T | U): (T | U)[] {
  return array.map(fn);
}

const numeros = [1, 2, 3];
const dobrados = mapear(numeros, (n) => n * 2); // tipo: number[]
const strings = mapear(numeros, (n) => n.toString()); // tipo: string[]
```

### Overloading com Optional Parameters

```typescript
function buscar(id: number): Promise<string>;
function buscar(id: number, incluirDetalhes: true): Promise<{ id: number; nome: string; detalhes: string }>;
function buscar(id: number, incluirDetalhes?: boolean): Promise<any>;

async function buscar(id: number, incluirDetalhes?: boolean): Promise<any> {
  if (incluirDetalhes) {
    // retorna objeto completo
    return { id, nome: "Item", detalhes: "Detalhes completos" };
  } else {
    // retorna apenas string
    return "Item";
  }
}

const simples = await buscar(1); // tipo: Promise<string>
const completo = await buscar(1, true); // tipo: Promise<{ id: number; nome: string; detalhes: string }>
```

## 🎯 Aplicabilidade

### API Client com Diferentes Configurações

```typescript
interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
}

// Overload: URL simples
function request(url: string): Promise<Response>;

// Overload: URL + método
function request(url: string, method: "GET" | "POST"): Promise<Response>;

// Overload: URL + método + config
function request(url: string, method: "GET" | "POST", config: RequestConfig): Promise<Response>;

// Implementação
async function request(
  url: string,
  method: "GET" | "POST" = "GET",
  config?: RequestConfig
): Promise<Response> {
  return fetch(url, {
    method,
    headers: config?.headers,
    // @ts-ignore
    timeout: config?.timeout
  });
}

// Uso type-safe
const response1 = await request("/api/users");
const response2 = await request("/api/users", "POST");
const response3 = await request("/api/users", "POST", { timeout: 5000 });
```

### createElement Type-Safe

```typescript
// Overload baseado no tipo de elemento
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "input"): HTMLInputElement;
function createElement(tag: string): HTMLElement;

function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// Tipo correto inferido
const div = createElement("div"); // HTMLDivElement
const span = createElement("span"); // HTMLSpanElement
const input = createElement("input"); // HTMLInputElement
const custom = createElement("custom-element"); // HTMLElement

// Acesso type-safe a propriedades específicas
input.value = "texto"; // ✅ OK: HTMLInputElement tem value
div.value = "texto"; // ❌ Erro: HTMLDivElement não tem value
```

### Query Builder Type-Safe

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
  idade: number;
}

// Overload: buscar por ID
function buscar(id: number): Promise<Usuario>;

// Overload: buscar com filtros
function buscar(filtros: Partial<Usuario>): Promise<Usuario[]>;

// Implementação
async function buscar(
  criterio: number | Partial<Usuario>
): Promise<Usuario | Usuario[]> {
  if (typeof criterio === "number") {
    // busca por ID retorna único usuário
    return { id: criterio, nome: "Ana", email: "ana@email.com", idade: 25 };
  } else {
    // busca por filtros retorna array
    return [
      { id: 1, nome: "Ana", email: "ana@email.com", idade: 25 }
    ];
  }
}

// Tipo correto inferido
const usuario = await buscar(1); // Promise<Usuario>
const usuarios = await buscar({ nome: "Ana" }); // Promise<Usuario[]>
```

### Event Emitter Type-Safe

```typescript
interface Events {
  "user:login": { userId: number; timestamp: Date };
  "user:logout": { userId: number };
  "data:update": { id: string; data: any };
}

class EventEmitter {
  // Overload para cada tipo de evento
  on(evento: "user:login", handler: (payload: Events["user:login"]) => void): void;
  on(evento: "user:logout", handler: (payload: Events["user:logout"]) => void): void;
  on(evento: "data:update", handler: (payload: Events["data:update"]) => void): void;
  
  // Implementação
  on(evento: keyof Events, handler: (payload: any) => void): void {
    // registrar handler...
  }
  
  // Overload para emit
  emit(evento: "user:login", payload: Events["user:login"]): void;
  emit(evento: "user:logout", payload: Events["user:logout"]): void;
  emit(evento: "data:update", payload: Events["data:update"]): void;
  
  // Implementação
  emit(evento: keyof Events, payload: any): void {
    // emitir evento...
  }
}

const emitter = new EventEmitter();

// Type-safe: payload correto para cada evento
emitter.on("user:login", (payload) => {
  console.log(payload.userId, payload.timestamp); // ✅ OK
});

emitter.emit("user:login", { userId: 1, timestamp: new Date() }); // ✅ OK
emitter.emit("user:login", { userId: 1 }); // ❌ Erro: falta timestamp
```

## ⚠️ Limitações

### Implementação Deve Cobrir Todas as Sobrecargas

```typescript
// ❌ Erro: implementação não cobre todas as assinaturas
function processar(valor: string): string;
function processar(valor: number): number;

function processar(valor: string): string { // ❌ Só cobre primeira sobrecarga
  return valor.toUpperCase();
}

// ✅ Correto: implementação cobre todas
function processar2(valor: string): string;
function processar2(valor: number): number;

function processar2(valor: string | number): string | number {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  } else {
    return valor * 2;
  }
}
```

### Assinatura de Implementação Não É Chamável Diretamente

```typescript
function teste(a: number): number;
function teste(a: string): string;

function teste(a: number | string | boolean): number | string | boolean {
  // implementação aceita boolean também
  return a;
}

teste(true); // ❌ Erro: nenhuma sobrecarga aceita boolean
// Mesmo que implementação aceite, overload signatures não aceitam
```

### Pode Ser Verboso

```typescript
// ⚠️ Muitas sobrecargas: verboso
function format(tipo: "data", valor: Date): string;
function format(tipo: "moeda", valor: number): string;
function format(tipo: "cpf", valor: string): string;
function format(tipo: "telefone", valor: string): string;
function format(tipo: "cep", valor: string): string;
// ... mais 10 sobrecargas

// ✅ Alternativa: usar discriminated union
type FormatOptions =
  | { tipo: "data"; valor: Date }
  | { tipo: "moeda"; valor: number }
  | { tipo: "cpf"; valor: string };

function formatSimples(options: FormatOptions): string {
  // implementação
}
```

## 🔗 Interconexões

### Com Union Types

```typescript
// Overloading é mais específico que union
function processar(valor: string): string;
function processar(valor: number): number;

function processar(valor: string | number): string | number {
  // implementação
}

// vs Union simples (menos específico)
function processar2(valor: string | number): string | number {
  // retorno pode ser qualquer combinação
}

const resultado1 = processar("texto"); // tipo: string (específico)
const resultado2 = processar2("texto"); // tipo: string | number (genérico)
```

### Com Generics

```typescript
// Combinar overloading com constraints genéricos
function converter<T extends string>(valor: T): number;
function converter<T extends number>(valor: T): string;

function converter<T extends string | number>(valor: T): string | number {
  if (typeof valor === "string") {
    return parseInt(valor);
  } else {
    return valor.toString();
  }
}
```

### Com Classes

```typescript
class Builder {
  // Overloading em métodos de classe
  adicionar(valor: string): this;
  adicionar(valor: number): this;
  
  adicionar(valor: string | number): this {
    // implementação
    return this;
  }
}

const builder = new Builder();
builder.adicionar("texto").adicionar(123); // Fluent API type-safe
```

## 📚 Conclusão

**Function overloading** em TypeScript oferece:

✅ Múltiplas assinaturas para mesma função  
✅ Type safety com diferentes combinações de parâmetros  
✅ Retornos específicos baseados em entrada  
✅ Autocomplete e IntelliSense melhores  
✅ Documentação clara de uso  

Use function overloading quando:
- Função aceita diferentes tipos com comportamentos distintos
- Retorno depende do tipo de entrada
- Quer type safety mais específico que unions
- Precisa de autocomplete para diferentes casos
- Documenta API pública com múltiplas formas de uso

Function overloading é **ferramenta avançada para APIs type-safe**, oferecendo precisão de tipos superior a unions simples.
