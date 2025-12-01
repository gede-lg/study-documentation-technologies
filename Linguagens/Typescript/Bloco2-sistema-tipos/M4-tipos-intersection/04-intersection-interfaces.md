# Intersection com Interfaces: Composição e Extensão

## 🎯 Introdução e Definição

Intersection com interfaces é **combinação de interfaces através do operador `&`**, criando tipo que **herda todas as propriedades e métodos de interfaces participantes**. Conceitualmente, representa **alternativa a `extends`** para composição de interfaces, oferecendo **maior flexibilidade** ao permitir combinação de múltiplas interfaces definidas separadamente, mistura de interfaces com types, e composição ad-hoc sem hierarquia formal. Intersection de interfaces é fundação para **composição horizontal**, múltipla herança simulada e arquiteturas modulares.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **`&` vs `extends`:** Intersection é alternativa mais flexível a extends
2. **Composição Horizontal:** Combinar capacidades sem hierarquia
3. **Interface + Type:** Misturar interfaces com type aliases
4. **Múltipla Herança:** Simular herança múltipla via intersection
5. **Declaration Merging:** Interfaces fundem automaticamente
6. **Flexibilidade:** Compor dinamicamente sem modificar definições originais

**Conceito Central:** Intersection de interfaces = **composição sem hierarquia** - combinar capacidades livremente.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Intersection de Interfaces:**
```typescript
interface Identificavel {
  id: number;
}

interface Nomeavel {
  nome: string;
}

type Pessoa = Identificavel & Nomeavel;
// Pessoa = { id: number; nome: string }

const pessoa: Pessoa = {
  id: 1,
  nome: "João"
};
```

**Conceito:** Intersection **agrega propriedades** de ambas as interfaces.

### `&` vs `extends`

**Com `extends`:**
```typescript
interface Base {
  id: number;
}

interface Usuario extends Base {
  nome: string;
  email: string;
}

// Usuario = { id: number; nome: string; email: string }
```

**Com Intersection:**
```typescript
interface Base {
  id: number;
}

type Usuario = Base & {
  nome: string;
  email: string;
};

// Usuario = { id: number; nome: string; email: string }
```

**Equivalência:** Para casos simples, ambos produzem resultado idêntico.

### Vantagens de Intersection

**1. Composição Ad-Hoc (sem modificar interfaces):**
```typescript
interface Pessoa {
  nome: string;
}

interface Empregado {
  empresa: string;
  salario: number;
}

// Compor sem estender interfaces originais
type Funcionario = Pessoa & Empregado;

// Impossível com extends sem modificar Pessoa ou Empregado
```

**2. Combinar Múltiplas Interfaces:**
```typescript
interface A { a: string }
interface B { b: number }
interface C { c: boolean }

// Com intersection (direto)
type ABC = A & B & C;

// Com extends (precisa de interface intermediária)
interface ABC_Extends extends A, B, C {}
```

**3. Misturar Interface com Type:**
```typescript
interface Base {
  id: number;
}

type Metadata = {
  criadoEm: Date;
  atualizadoEm: Date;
};

// Intersection permite misturar interface e type
type Entidade = Base & Metadata;

// Não seria possível com extends puro
```

### Múltiplas Interfaces

**Pattern de Composição:**
```typescript
interface Identificavel {
  id: number;
}

interface Timestampavel {
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Auditavel {
  criadoPor: number;
  atualizadoPor: number;
}

interface SoftDeletable {
  deletadoEm: Date | null;
}

// Compor livremente
type Usuario = Identificavel
  & Timestampavel
  & Auditavel
  & {
    nome: string;
    email: string;
  };

type Produto = Identificavel
  & Timestampavel
  & SoftDeletable
  & {
    nome: string;
    preco: number;
  };
```

**Conceito:** Cada entidade **seleciona capacidades necessárias** sem hierarquia rígida.

## 🔍 Interface Declaration Merging

### Fusão Automática

**Conceito:** Interfaces com mesmo nome **fundem automaticamente** em escopo.

```typescript
interface Usuario {
  id: number;
  nome: string;
}

interface Usuario {
  email: string;
}

// Fusão automática:
// interface Usuario {
//   id: number;
//   nome: string;
//   email: string;
// }

const usuario: Usuario = {
  id: 1,
  nome: "João",
  email: "joao@exemplo.com"
};
```

**Intersection vs. Merging:**
```typescript
// Merging (interfaces fundem automaticamente)
interface A { x: number }
interface A { y: string }
// A = { x: number; y: string }

// Intersection (composição explícita)
interface B { x: number }
interface C { y: string }
type BC = B & C;
// BC = { x: number; y: string }
```

**Diferença:** Merging é **automático e implícito**; Intersection é **explícito e controlado**.

### Augmentation de Bibliotecas

**Estender Interfaces de Bibliotecas:**
```typescript
// Em @types/express
interface Request {
  // Definição original
}

// No seu código (augmentation)
interface Request {
  usuario?: Usuario;
  token?: string;
}

// Agora Request tem propriedades originais + novas
app.get("/", (req, res) => {
  const usuario = req.usuario;  // Type-safe
});
```

**Intersection para Wrapper:**
```typescript
import { Request as ExpressRequest } from "express";

type MeuRequest = ExpressRequest & {
  usuario?: Usuario;
  token?: string;
};

function handler(req: MeuRequest) {
  const usuario = req.usuario;
}
```

**Diferença:** Merging modifica globalmente; Intersection cria tipo local.

## 🎯 Padrões Avançados

### Simulando Herança Múltipla

**Conceito:** TypeScript não suporta herança múltipla de classes, mas intersection simula para tipos.

```typescript
interface Animal {
  comer(): void;
  dormir(): void;
}

interface Voador {
  voar(): void;
  altitude: number;
}

interface Nadador {
  nadar(): void;
  profundidade: number;
}

// "Herança múltipla" via intersection
type Pato = Animal & Voador & Nadador;

const pato: Pato = {
  comer() { console.log("Comendo"); },
  dormir() { console.log("Dormindo"); },
  voar() { console.log("Voando"); },
  altitude: 100,
  nadar() { console.log("Nadando"); },
  profundidade: 10
};
```

### Mixin Pattern com Interfaces

**Definir Comportamentos:**
```typescript
interface Logger {
  log(mensagem: string): void;
  logError(erro: Error): void;
}

interface Cacheable {
  cache: Map<string, any>;
  getCache(key: string): any;
  setCache(key: string, valor: any): void;
}

interface EventEmitter {
  on(evento: string, handler: Function): void;
  emit(evento: string, ...args: any[]): void;
}

// Componente com múltiplos mixins
type ComponenteRico = {
  render(): void;
} & Logger
  & Cacheable
  & EventEmitter;

const componente: ComponenteRico = {
  render() { },
  log(msg) { console.log(msg); },
  logError(err) { console.error(err); },
  cache: new Map(),
  getCache(key) { return this.cache.get(key); },
  setCache(key, valor) { this.cache.set(key, valor); },
  on(evento, handler) { },
  emit(evento, ...args) { }
};
```

### Conditional Intersection

**Com Generics:**
```typescript
interface Base {
  id: number;
}

type WithTimestamp<T> = T & {
  criadoEm: Date;
  atualizadoEm: Date;
};

type WithAudit<T> = T & {
  criadoPor: number;
  atualizadoPor: number;
};

// Compor condicionalmente
type BuildEntity<
  TBase extends Base,
  WithTime extends boolean = true,
  WithAudit extends boolean = false
> = TBase
  & (WithTime extends true ? { criadoEm: Date; atualizadoEm: Date } : {})
  & (WithAudit extends true ? { criadoPor: number; atualizadoPor: number } : {});

interface Usuario extends Base {
  nome: string;
}

type UsuarioCompleto = BuildEntity<Usuario, true, true>;
// UsuarioCompleto = { id, nome, criadoEm, atualizadoEm, criadoPor, atualizadoPor }
```

## 🎯 Aplicabilidade

### Domain-Driven Design

**Aggregates e Entities:**
```typescript
interface Entity {
  id: number;
  versao: number;
}

interface ValueObject {
  equals(other: any): boolean;
}

interface AggregateRoot extends Entity {
  eventosDominio: any[];
}

// Compor domínio
interface Pedido extends AggregateRoot {
  cliente: Cliente;
  itens: ItemPedido[];
  total: number;
}

// Ou com intersection
type PedidoAlt = AggregateRoot & {
  cliente: Cliente;
  itens: ItemPedido[];
  total: number;
};
```

### Plugin Architecture

**Contratos de Plugin:**
```typescript
interface Plugin {
  nome: string;
  versao: string;
}

interface Configurable {
  config: Record<string, any>;
  configure(config: Record<string, any>): void;
}

interface Lifecycle {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}

interface HookProvider {
  hooks: Map<string, Function[]>;
  registerHook(nome: string, fn: Function): void;
}

// Plugin completo
type FullPlugin = Plugin & Configurable & Lifecycle & HookProvider;

// Plugin simples (apenas core + config)
type SimplePlugin = Plugin & Configurable;
```

### Repository Pattern

**Capacidades de Repositório:**
```typescript
interface Readable<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
}

interface Writable<T> {
  create(entity: T): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

interface Queryable<T> {
  query(filter: Partial<T>): Promise<T[]>;
  count(filter: Partial<T>): Promise<number>;
}

// Repository completo
type Repository<T> = Readable<T> & Writable<T> & Queryable<T>;

// Repository somente leitura
type ReadOnlyRepository<T> = Readable<T> & Queryable<T>;
```

## ⚠️ Armadilhas Comuns

### 1. Conflitos de Propriedades

```typescript
interface A {
  id: string;
}

interface B {
  id: number;
}

type AB = A & B;
// AB = { id: string & number } = { id: never }
```

**Solução:** Garantir tipos compatíveis.

### 2. Intersection vs. Extends em Interfaces

```typescript
// ❌ Interface não pode usar & diretamente
interface Usuario = Pessoa & Empregado;  // ERRO de sintaxe

// ✅ Usar extends
interface Usuario extends Pessoa, Empregado { }

// ✅ Ou type alias
type Usuario = Pessoa & Empregado;
```

### 3. Perder Declaration Merging

```typescript
// Com interface (merging funciona)
interface Config {
  url: string;
}

interface Config {
  timeout: number;
}
// Config = { url, timeout }

// Com type (não funde)
type Config = { url: string };
type Config = { timeout: number };  // ERRO: Duplicate identifier
```

### 4. Complexidade Excessiva

```typescript
// ❌ Difícil de ler
type Monster = A & B & C & D & E & F & G & H & I;

// ✅ Intermediários nomeados
type Core = A & B & C;
type Extended = Core & D & E;
type Full = Extended & F & G;
```

## 📚 Conclusão

**Intersection com interfaces** oferece **alternativa flexível a `extends`**, permitindo **composição horizontal** sem hierarquia rígida. Enquanto `extends` é apropriado para herança clara, intersection brilha em **composição ad-hoc**, **mixins** e **combinação de capacidades** independentes.

**Conceitos Fundamentais:**
1. **`&` com Interfaces:** Agrega propriedades e métodos
2. **vs. `extends`:** Intersection é mais flexível
3. **Composição Ad-Hoc:** Combinar sem modificar originais
4. **Múltiplas Interfaces:** Simular herança múltipla
5. **Interface + Type:** Misturar livremente
6. **Declaration Merging:** Interfaces fundem; types não

**Intersection de interfaces = composição flexível + herança horizontal + arquitetura modular.**
