# Sobrecarga de Método (Method Overloading)

## 🎯 Introdução e Definição

### Definição Conceitual

**Method overloading** (sobrecarga de método) em TypeScript é a técnica de definir **múltiplas assinaturas** para um mesmo método, onde cada assinatura especifica diferentes combinações de **tipos de parâmetros** e **tipos de retorno**. Essencialmente, permite que um método aceite diferentes "shapes" de argumentos enquanto mantém **type safety**. Conceitualmente, overloading implementa **polimorfismo ad-hoc** - mesmo nome, comportamentos diferentes baseados em tipos de entrada.

TypeScript implementa overloading de forma única: você declara **múltiplas assinaturas de função** (overload signatures) seguidas de uma **única implementação** (implementation signature). O compilador usa as assinaturas declaradas para **type checking**, mas apenas a implementação é executada em runtime. A implementação deve ser genérica o suficiente para lidar com todas as assinaturas declaradas.

### Contexto Histórico e Motivação

A evolução de method overloading:

**Linguagens Clássicas (Java, C#, C++):** Overloading é nativo - múltiplas definições de método com mesmo nome e parâmetros diferentes coexistem. Compilador escolhe qual executar baseado em tipos de argumentos.

**JavaScript:** Não tem overloading nativo - último método definido sobrescreve anteriores. Desenvolvedores usavam **runtime type checking** e **argumentos opcionais**:
```javascript
function processar(valor) {
  if (typeof valor === "string") { /* ... */ }
  else if (typeof valor === "number") { /* ... */ }
}
```

**TypeScript:** Introduziu **declarative overloading** - assinaturas múltiplas para type checking, implementação única para runtime. Best of both worlds: **type safety** em compile-time, **flexibilidade** em runtime.

**Motivação:**
- **Type Safety:** Validar diferentes combinações de argumentos
- **IntelliSense:** IDEs mostram assinaturas específicas
- **Documentation:** Overloads documentam uso permitido
- **API Design:** APIs podem aceitar múltiplas formas de input

### Problema Fundamental que Resolve

Method overloading resolve problemas específicos:

**1. Type-Safe Variadic Behavior**
```typescript
// Sem overload - type unsafe
function criar(valor: string | number): Resultado {
  // Tipo de retorno não depende de input
}

// Com overload - type safe
function criar(valor: string): ResultadoString;
function criar(valor: number): ResultadoNumber;
function criar(valor: string | number): ResultadoString | ResultadoNumber {
  // Implementação
}
```

**2. Different Parameter Combinations**
```typescript
// Overload para aceitar diferentes aridades
function buscar(id: number): Usuario;
function buscar(nome: string, email: string): Usuario;
function buscar(arg1: number | string, arg2?: string): Usuario {
  // Implementação única lida com ambos casos
}
```

**3. Return Type Correlation**
```typescript
// Tipo de retorno depende de tipo de entrada
function parse(input: string): object;
function parse(input: string, reviver: Function): any;
function parse(input: string, reviver?: Function): object | any {
  return JSON.parse(input, reviver);
}
```

**4. Optional vs Required Parameters**
```typescript
// Diferentes níveis de opcionalidade
function log(mensagem: string): void;
function log(mensagem: string, nivel: number): void;
function log(mensagem: string, nivel: number, timestamp: Date): void;
function log(mensagem: string, nivel?: number, timestamp?: Date): void {
  // Implementação
}
```

### Importância no Ecossistema

Method overloading é importante porque:

- **Library APIs:** Bibliotecas TypeScript usam overloading para APIs flexíveis
- **Type Safety:** Previne erros em compile-time
- **Developer Experience:** IntelliSense mostra exatamente quais combinações são válidas
- **Migration from JavaScript:** Permite tipagem de funções JavaScript variádicas
- **DOM APIs:** TypeScript stdlib usa overloading extensivamente (ex: `addEventListener`)

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Multiple Signatures:** Declarar várias assinaturas do mesmo método
2. **Single Implementation:** Apenas uma implementação que cobre todos casos
3. **Compile-Time Resolution:** TypeScript escolhe assinatura baseado em tipos
4. **Type Narrowing:** Implementação usa type guards para distinguir casos
5. **Overload Order:** Assinaturas mais específicas devem vir antes de genéricas

### Pilares Fundamentais

- **Overload Signatures:** `function nome(param: Type1): ReturnType1;`
- **Implementation Signature:** `function nome(param: Type1 | Type2): ReturnType1 | ReturnType2 { }`
- **Type Guards:** `if (typeof param === "string")` na implementação
- **Specificity:** Assinaturas específicas antes de genéricas
- **Compatibility:** Implementação deve ser compatível com todas overloads

### Visão Geral das Nuances

- **Not Runtime:** Overloads desaparecem em JavaScript compilado
- **Call Signature Resolution:** TypeScript escolhe overload mais específico
- **Generic Overloads:** Podem combinar overloading com generics
- **Class Methods:** Overloading funciona em métodos de classe
- **Constructor Overloading:** Construtores também podem ter overloads

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Compilation Process

```typescript
// TypeScript source
function processar(valor: string): string;
function processar(valor: number): number;
function processar(valor: string | number): string | number {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  }
  return valor * 2;
}

// JavaScript compilado (ES5)
function processar(valor) {
  if (typeof valor === "string") {
    return valor.toUpperCase();
  }
  return valor * 2;
}
```

**Análise profunda da compilação:**
1. **Overload Signatures:** Removidas completamente - existem apenas em type checking
2. **Implementation:** Única função no JavaScript resultante
3. **Type Guards:** Implementação usa runtime checks (`typeof`, `instanceof`) para distinguir casos
4. **Type Information:** Perdida em runtime - apenas compile-time

**Fundamento conceitual:** Overloading é **compile-time feature** - não existe em runtime.

### Princípios e Conceitos Subjacentes

#### Overload Resolution

```typescript
function criar(id: number): Item;
function criar(nome: string): Item;
function criar(id: number, nome: string): Item;
function criar(arg1: number | string, arg2?: string): Item {
  // Implementação
}

criar(42);          // ✅ Usa overload 1: (id: number) => Item
criar("produto");   // ✅ Usa overload 2: (nome: string) => Item
criar(42, "prod");  // ✅ Usa overload 3: (id: number, nome: string) => Item
// criar(true);     // ❌ Erro - nenhum overload aceita boolean
```

**Conceito crucial:** TypeScript escolhe **primeiro overload compatível** de cima para baixo.

#### Implementation Signature Compatibility

```typescript
// ✅ Implementação compatível com ambos overloads
function processar(valor: string): string;
function processar(valor: number): number;
function processar(valor: string | number): string | number {
  // Union type cobre ambos overloads
  return typeof valor === "string" ? valor : valor.toString();
}

// ❌ Implementação incompatível
function processar2(valor: string): string;
function processar2(valor: number): number;
// function processar2(valor: boolean): boolean {  // Erro!
//   // boolean não é compatível com string | number
// }
```

**Análise profunda:** Implementation signature deve ser **superset** de todos overloads.

#### Specificity Order

```typescript
// ✅ Correto - específico para genérico
function buscar(id: number): Usuario;
function buscar(filtro: Filtro): Usuario[];
function buscar(arg: number | Filtro): Usuario | Usuario[] {
  // Implementação
}

// ❌ Incorreto - genérico antes de específico
function buscar2(arg: number | string): Resultado;  // Muito genérico
function buscar2(id: number): Usuario;  // Nunca será usado!
```

**Fundamento teórico:** Assinaturas **mais específicas** devem vir **antes** de genéricas.

### Modelo Mental para Compreensão

Pense em overloading como **menu de restaurante**:

- **Overload Signatures:** Itens do menu (diferentes pratos que podem ser pedidos)
- **Implementation Signature:** Cozinha (prepara todos pratos com equipamento/ingredientes compartilhados)
- **Type Guards:** Chef verifica pedido e prepara prato específico

**Cliente (chamada de função):** Pede item específico do menu
**Atendente (compilador):** Valida que pedido está no menu
**Cozinha (implementação):** Prepara pedido usando lógica interna

**Analogia:**
```typescript
// Menu
function pedir(hamburguer: "classico"): Hamburguer;
function pedir(pizza: "margherita"): Pizza;

// Cozinha
function pedir(item: "classico" | "margherita"): Hamburguer | Pizza {
  if (item === "classico") return new Hamburguer();
  return new Pizza();
}
```

## 🔍 Análise Conceitual Profunda

### Basic Method Overloading

```typescript
function dobrar(valor: number): number;
function dobrar(valor: string): string;
function dobrar(valor: number | string): number | string {
  if (typeof valor === "number") {
    return valor * 2;
  }
  return valor + valor;
}

const n = dobrar(5);      // number (10)
const s = dobrar("hi");   // string ("hihi")
```

**Análise teórica:** Tipo de retorno depende de tipo de entrada - type-safe correlation.

### Overloading com Diferentes Aridades

```typescript
function criar(nome: string): Produto;
function criar(nome: string, preco: number): Produto;
function criar(nome: string, preco: number, desconto: number): Produto;
function criar(nome: string, preco?: number, desconto?: number): Produto {
  return {
    nome,
    preco: preco ?? 0,
    desconto: desconto ?? 0
  };
}

criar("Livro");               // ✅ 1 parâmetro
criar("Livro", 50);           // ✅ 2 parâmetros
criar("Livro", 50, 10);       // ✅ 3 parâmetros
```

**Fundamento conceitual:** Overloads permitem diferentes quantidades de parâmetros com type safety.

### Return Type Variation

```typescript
function buscar(id: number): Usuario;
function buscar(filtro: object): Usuario[];
function buscar(arg: number | object): Usuario | Usuario[] {
  if (typeof arg === "number") {
    return { id: arg, nome: "User" };  // Usuario único
  }
  return [{ id: 1, nome: "User1" }];   // Array de usuarios
}

const usuario: Usuario = buscar(1);        // ✅ Type: Usuario
const usuarios: Usuario[] = buscar({});    // ✅ Type: Usuario[]
```

**Análise profunda:** Tipo de retorno varia baseado em tipo de parâmetro.

### Generic Overloads

```typescript
function mapear<T>(array: T[], fn: (item: T) => T): T[];
function mapear<T, U>(array: T[], fn: (item: T) => U): U[];
function mapear<T, U>(array: T[], fn: (item: T) => T | U): (T | U)[] {
  return array.map(fn);
}

const numeros = mapear([1, 2], x => x * 2);      // number[]
const strings = mapear([1, 2], x => x.toString()); // string[]
```

**Conceito avançado:** Overloading com generics permite diferentes transformações de tipo.

### Optional Parameter Overloads

```typescript
function log(mensagem: string): void;
function log(mensagem: string, nivel: "info" | "error"): void;
function log(mensagem: string, nivel?: "info" | "error"): void {
  const n = nivel ?? "info";
  console.log(`[${n}] ${mensagem}`);
}

log("Olá");              // ✅ Usa overload 1
log("Erro", "error");    // ✅ Usa overload 2
```

**Fundamento teórico:** Overloads com parâmetros opcionais progressivos.

### Overloading com Union Types

```typescript
function formatar(valor: string): string;
function formatar(valor: number): string;
function formatar(valor: Date): string;
function formatar(valor: string | number | Date): string {
  if (valor instanceof Date) {
    return valor.toISOString();
  }
  if (typeof valor === "number") {
    return valor.toFixed(2);
  }
  return valor.toUpperCase();
}

formatar("hello");        // "HELLO"
formatar(42);             // "42.00"
formatar(new Date());     // "2025-11-15T..."
```

**Análise profunda:** Implementation usa type guards (`instanceof`, `typeof`) para routing.

### Class Method Overloading

```typescript
class Calculadora {
  somar(a: number, b: number): number;
  somar(a: string, b: string): string;
  somar(a: number | string, b: number | string): number | string {
    if (typeof a === "number" && typeof b === "number") {
      return a + b;
    }
    return String(a) + String(b);
  }
}

const calc = new Calculadora();
calc.somar(1, 2);       // 3 (number)
calc.somar("a", "b");   // "ab" (string)
```

**Conceito avançado:** Métodos de classe podem ter overloads assim como funções.

### Constructor Overloading

```typescript
class Usuario {
  nome: string;
  email: string;

  constructor(nome: string);
  constructor(nome: string, email: string);
  constructor(nome: string, email?: string) {
    this.nome = nome;
    this.email = email ?? `${nome}@example.com`;
  }
}

const u1 = new Usuario("Ana");              // email gerado
const u2 = new Usuario("Ana", "ana@a.com"); // email fornecido
```

**Análise profunda:** Construtores podem ter múltiplas assinaturas.

### Overloading com Literal Types

```typescript
function criar(tipo: "usuario"): Usuario;
function criar(tipo: "admin"): Admin;
function criar(tipo: "usuario" | "admin"): Usuario | Admin {
  if (tipo === "usuario") {
    return { tipo: "usuario", nome: "" };
  }
  return { tipo: "admin", nome: "", permissoes: [] };
}

const u = criar("usuario");  // Type: Usuario
const a = criar("admin");    // Type: Admin
```

**Fundamento teórico:** Literal types permitem type narrowing preciso.

### Overloading com Tuple Types

```typescript
function processar(args: [string]): string;
function processar(args: [number, number]): number;
function processar(args: [string] | [number, number]): string | number {
  if (typeof args[0] === "string") {
    return args[0].toUpperCase();
  }
  return args[0] + args[1];
}

processar(["hello"]);   // "HELLO" (string)
processar([5, 10]);     // 15 (number)
```

**Conceito avançado:** Tuple types em overloads para parâmetros estruturados.

### Conditional Return Types

```typescript
function obter(incluirMetadata: true): ResultadoComMetadata;
function obter(incluirMetadata: false): ResultadoSimples;
function obter(incluirMetadata: boolean): ResultadoComMetadata | ResultadoSimples {
  if (incluirMetadata) {
    return { data: {}, metadata: { timestamp: Date.now() } };
  }
  return { data: {} };
}

const comMeta = obter(true);   // ResultadoComMetadata
const semMeta = obter(false);  // ResultadoSimples
```

**Análise profunda:** Tipo de retorno depende de boolean literal.

### Overloading com Callbacks

```typescript
function async executar(callback: () => void): void;
function async executar(callback: () => Promise<void>): Promise<void>;
function async executar(callback: () => void | Promise<void>): void | Promise<void> {
  return callback();
}

executar(() => console.log("sync"));     // void
executar(async () => fetch("/api"));     // Promise<void>
```

**Fundamento teórico:** Overloads distinguem callbacks sync vs async.

### Rest Parameters com Overloading

```typescript
function combinar(...itens: string[]): string;
function combinar(...itens: number[]): number;
function combinar(...itens: (string | number)[]): string | number {
  if (typeof itens[0] === "string") {
    return itens.join("");
  }
  return itens.reduce((a, b) => Number(a) + Number(b), 0);
}

combinar("a", "b", "c");  // "abc" (string)
combinar(1, 2, 3);        // 6 (number)
```

**Conceito avançado:** Rest parameters podem ser overloaded.

### Overload com Type Predicates

```typescript
function isString(valor: unknown): valor is string;
function isString(valor: unknown, strict: true): valor is string;
function isString(valor: unknown, strict?: boolean): boolean {
  return typeof valor === "string";
}

const val: unknown = "hello";
if (isString(val)) {
  val.toUpperCase();  // ✅ Type narrowed to string
}
```

**Análise profunda:** Overloads com type predicates para type guards.

## 🎯 Aplicabilidade e Contextos

### DOM API Pattern

```typescript
function addEventListener(tipo: "click", handler: (e: MouseEvent) => void): void;
function addEventListener(tipo: "keydown", handler: (e: KeyboardEvent) => void): void;
function addEventListener(tipo: string, handler: (e: Event) => void): void {
  document.addEventListener(tipo, handler);
}

addEventListener("click", (e) => {
  e.button;  // ✅ MouseEvent - tem propriedade button
});

addEventListener("keydown", (e) => {
  e.key;  // ✅ KeyboardEvent - tem propriedade key
});
```

**Raciocínio:** Event listeners têm diferentes tipos de evento baseado em tipo string.

### API Client

```typescript
class ApiClient {
  get(url: string): Promise<unknown>;
  get<T>(url: string, parser: (data: unknown) => T): Promise<T>;
  async get<T>(url: string, parser?: (data: unknown) => T): Promise<T | unknown> {
    const response = await fetch(url);
    const data = await response.json();
    return parser ? parser(data) : data;
  }
}

const client = new ApiClient();
client.get("/users");                        // Promise<unknown>
client.get("/users", (d) => d as Usuario[]); // Promise<Usuario[]>
```

**Raciocínio:** Parser opcional determina tipo de retorno.

### Factory Function

```typescript
function criar(tipo: "quadrado", lado: number): Quadrado;
function criar(tipo: "circulo", raio: number): Circulo;
function criar(tipo: "quadrado" | "circulo", medida: number): Quadrado | Circulo {
  if (tipo === "quadrado") {
    return { tipo, lado: medida, area: () => medida ** 2 };
  }
  return { tipo, raio: medida, area: () => Math.PI * medida ** 2 };
}

const q = criar("quadrado", 5);  // Quadrado
const c = criar("circulo", 3);   // Circulo
```

**Raciocínio:** Factory cria diferentes tipos baseado em discriminant.

### Query Builder

```typescript
class QueryBuilder {
  where(campo: string, valor: string): this;
  where(campo: string, operador: string, valor: string): this;
  where(campo: string, arg2: string, arg3?: string): this {
    // Implementação
    return this;
  }
}

const query = new QueryBuilder()
  .where("nome", "Ana")              // 2 args
  .where("idade", ">", "18");        // 3 args
```

**Raciocínio:** Query methods aceitam diferentes combinações de parâmetros.

## ⚠️ Limitações e Considerações Teóricas

### Não é Runtime

```typescript
function teste(x: number): number;
function teste(x: string): string;
function teste(x: any): any {
  // Runtime não sabe qual overload foi chamado
  return x;
}
```

**Limitação:** Overloads desaparecem em JavaScript compilado.

### Implementation Must Cover All

```typescript
function processar(x: string): string;
function processar(x: number): number;
// ❌ Implementação deve aceitar string | number
// function processar(x: string): string { }  // Erro!
```

**Limitação:** Implementation signature deve ser compatível com todos overloads.

### Specificity Order Matters

```typescript
// ❌ Overload genérico esconde específico
function buscar(arg: any): any;  // Muito genérico - sempre usado
function buscar(id: number): Usuario;  // Nunca usado!
```

**Limitação:** Ordem importa - específicos primeiro.

### No Runtime Dispatch

```typescript
function processar(x: string | number): string | number {
  // ❌ TypeScript não injeta código para escolher branch
  // Desenvolvedor deve implementar type guards manualmente
}
```

**Limitação:** Implementação deve manualmente dispatch baseado em tipo.

## 🔗 Interconexões Conceituais

**Relação com Generics:** Overloading pode ser alternativa a generics em alguns casos.

**Relação com Union Types:** Implementation usa unions; overloads refinam.

**Relação com Type Guards:** Implementação usa guards para routing.

**Relação com Polimorfismo:** Overloading é forma de polimorfismo ad-hoc.

## 🚀 Evolução e Próximos Conceitos

Dominar method overloading prepara para:
- **Substituição de Tipos:** Liskov Substitution Principle
- **Duck Typing:** Structural typing avançado
- **Interfaces Polimórficas:** Contratos flexíveis
- **Advanced Type Patterns:** Conditional types, mapped types
