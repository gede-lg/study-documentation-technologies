# Readonly Properties

## 🎯 Introdução e Definição

### Definição Conceitual

**Readonly properties** em interfaces TypeScript são members que podem ser lidos mas **não podem ser modificados** após inicialização. São declaradas usando o **modifier** `readonly` antes do nome da property. Isso garante **imutabilidade** em nível de tipo: após objeto ser criado com valores iniciais, essas properties não podem ser reatribuídas, impedindo mutações acidentais e facilitando raciocínio sobre código.

Conceitualmente, readonly properties implementam **write-once semantics** (semântica de escrita única): valores podem ser atribuídos durante **inicialização** (construction/literal creation), mas quaisquer tentativas subsequentes de modificação resultam em **compile-time error**. Isso não torna objetos completamente imutáveis (properties nested mutáveis ainda podem mudar), mas previne reassignment da property raiz.

### Contexto Histórico e Motivação

A evolução de readonly/immutability:

**C++ (1985):** Introduziu `const` keyword para variáveis e members imutáveis.

**Java (1995):** Introduziu `final` para campos que podem ser atribuídos apenas uma vez.

**C# (2000):** Introduziu `readonly` fields - atribuídos apenas em declaração ou constructor.

**JavaScript ES5 (2009):** Introduziu `Object.freeze()` e property descriptors com `writable: false` para imutabilidade runtime.

**TypeScript 1.3 (2014):** Introduziu `readonly` modifier para properties, trazendo imutabilidade para compile-time.

**Rust (2010s):** Popularizou **immutability by default** - variáveis são imutáveis a menos que marcadas `mut`.

**TypeScript 2.0 (2016):** Adicionou `readonly` para arrays (`ReadonlyArray<T>`) e tuples.

A motivação era **preventing unintended mutations**: muitos bugs ocorrem por modificações acidentais de estado. Readonly properties tornam intenção explícita e compilador previne violações, aumentando **predictability** (previsibilidade) e facilitando **concurrent programming** (dados imutáveis são thread-safe).

### Problema Fundamental que Resolve

Readonly properties resolvem problemas críticos:

**1. Accidental Mutations:** Prevenir modificações não intencionais de estado crítico.

**2. Contract Enforcement:** Garantir que certos dados não mudam após criação.

**3. Functional Programming:** Facilitar paradigma funcional onde imutabilidade é fundamental.

**4. Thread Safety:** Dados readonly podem ser compartilhados entre threads sem sincronização.

**5. Cache Invalidation:** Valores que não mudam podem ser cached indefinidamente.

**6. Predictability:** Código é mais previsível quando estado não muda inesperadamente.

### Importância no Ecossistema

Readonly properties são fundamentais porque:

- **React/Redux:** State é readonly por convenção - mutations são antipattern
- **Immutable Data Structures:** Base para bibliotecas como Immer, ImmutableJS
- **Configuration:** Configs carregadas uma vez e nunca modificadas
- **Domain Models:** Entidades com IDs imutáveis, timestamps
- **Type Safety:** Compilador previne bugs de mutação

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Immutability:** Property não pode ser reatribuída após inicialização
2. **Compile-Time:** Verificação acontece em compile-time, não runtime
3. **Shallow:** Readonly é superficial - objetos nested podem ser mutáveis
4. **Initialization:** Pode ser atribuído em declaração ou constructor
5. **Read Access:** Leitura continua funcionando normalmente

### Pilares Fundamentais

- **Syntax:** `readonly propertyName: Type`
- **Assignment:** Apenas em initialization (literal ou constructor)
- **Reassignment:** Bloqueado pelo compilador
- **Nested Objects:** Readonly não se propaga automaticamente
- **Arrays:** `ReadonlyArray<T>` ou `readonly T[]` para arrays imutáveis

### Visão Geral das Nuances

- **Type System Level:** Readonly é feature do type system, não runtime
- **Optional + Readonly:** Podem ser combinados (`readonly prop?: Type`)
- **Mapped Types:** `Readonly<T>` torna todas properties readonly
- **Const Assertions:** `as const` torna object literals deeply readonly

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Quando TypeScript compila readonly properties:

**1. Parsing:** Identifica `readonly` modifier na property declaration.

**2. Type Checking (Initialization):**
   - Permite assignment em object literal
   - Permite assignment em constructor
   - Permite assignment em declaração de class field

**3. Type Checking (Reassignment):**
   - Detecta tentativas de reassignment
   - Gera erro: `Cannot assign to 'X' because it is a read-only property`

**4. Type Checking (Methods):**
   - Methods que tentam modificar readonly property geram erro
   - Mesmo dentro da própria classe

**5. Code Generation:** **Não afeta JavaScript** - readonly é removido. Proteção é apenas compile-time.

### Princípios e Conceitos Subjacentes

#### Write-Once Semantics

Readonly permite escrita apenas durante inicialização:

```typescript
interface Ponto {
  readonly x: number;
  readonly y: number;
}

// Inicialização - OK
const p1: Ponto = { x: 10, y: 20 };

// Leitura - OK
console.log(p1.x); // 10
console.log(p1.y); // 20

// Modificação - ERRO
// p1.x = 15; // ❌ Cannot assign to 'x' because it is a read-only property
// p1.y = 25; // ❌ Cannot assign to 'y' because it is a read-only property
```

**Fundamento conceitual:** Readonly properties estabelecem **invariant** (invariância): valores definidos na criação nunca mudam.

#### Shallow Readonly

Readonly é **superficial** - não se propaga para nested objects:

```typescript
interface Config {
  readonly host: string;
  readonly opcoes: {
    timeout: number;
    retry: boolean;
  };
}

const config: Config = {
  host: "localhost",
  opcoes: {
    timeout: 5000,
    retry: true
  }
};

// config.host = "api.com"; // ❌ Erro: readonly
// config.opcoes = { timeout: 10000, retry: false }; // ❌ Erro: readonly

// Mas nested properties são mutáveis!
config.opcoes.timeout = 10000; // ✅ OK
config.opcoes.retry = false;   // ✅ OK
```

**Análise profunda:** `readonly` afeta apenas property raiz. Para imutabilidade deep, nested objects também devem ser readonly.

#### Deep Readonly

Para imutabilidade profunda, todos níveis devem ser readonly:

```typescript
interface ConfigDeep {
  readonly host: string;
  readonly opcoes: {
    readonly timeout: number;
    readonly retry: boolean;
  };
}

const config: ConfigDeep = {
  host: "localhost",
  opcoes: {
    timeout: 5000,
    retry: true
  }
};

// config.host = "api.com"; // ❌ Erro
// config.opcoes = { timeout: 10000, retry: false }; // ❌ Erro
// config.opcoes.timeout = 10000; // ❌ Erro - nested readonly
// config.opcoes.retry = false; // ❌ Erro - nested readonly
```

**Conceito crucial:** Deep readonly requer marcar todos níveis. TypeScript tem utility type `Readonly<T>` mas apenas para primeiro nível.

### Modelo Mental para Compreensão

Pense em readonly properties como **certidão de nascimento**:

- **Readonly Properties:** Data de nascimento, nome de pai/mãe
- **Initialization:** Quando documento é criado, informações são registradas
- **Read Access:** Você pode ler informações a qualquer momento
- **Modification:** Não pode mudar informações após registro (são permanentes)
- **Compiler:** Auditor que previne tentativas de falsificação

Informações são "gravadas em pedra" na criação e nunca mudam.

## 🔍 Análise Conceitual Profunda

### Sintaxe Básica

```typescript
interface Livro {
  readonly isbn: string;    // Readonly
  readonly titulo: string;  // Readonly
  autor: string;            // Mutable
  paginas: number;          // Mutable
}

const livro: Livro = {
  isbn: "978-3-16-148410-0",
  titulo: "Clean Code",
  autor: "Robert Martin",
  paginas: 464
};

// Leitura - sempre OK
console.log(livro.isbn);   // "978-3-16-148410-0"
console.log(livro.titulo); // "Clean Code"

// Modificação de mutable - OK
livro.autor = "Uncle Bob";
livro.paginas = 500;

// Modificação de readonly - ERRO
// livro.isbn = "novo-isbn"; // ❌ Cannot assign to 'isbn' because it is read-only
// livro.titulo = "Outro"; // ❌ Cannot assign to 'titulo' because it is read-only
```

**Análise conceitual:** `readonly` marca properties específicas como imutáveis. Outras properties continuam mutáveis.

### Readonly em Classes

```typescript
class Usuario {
  readonly id: number;
  readonly criadoEm: Date;
  nome: string;
  
  constructor(id: number, nome: string) {
    // Pode atribuir readonly em constructor
    this.id = id;
    this.criadoEm = new Date();
    this.nome = nome;
  }
  
  renomear(novoNome: string): void {
    this.nome = novoNome; // ✅ OK - mutable
    // this.id = Math.random(); // ❌ Erro - readonly
  }
}

const usuario = new Usuario(1, "Ana");
console.log(usuario.id); // 1
console.log(usuario.criadoEm);

usuario.nome = "Maria"; // ✅ OK
// usuario.id = 2; // ❌ Erro: Cannot assign to 'id' because it is read-only
// usuario.criadoEm = new Date(); // ❌ Erro
```

**Fundamento teórico:** Em classes, readonly properties podem ser atribuídas em **declaração** ou **constructor**, mas não em methods ou externamente.

### Parameter Properties

```typescript
class Produto {
  constructor(
    public readonly id: number,        // Readonly parameter property
    public readonly nome: string,      // Readonly parameter property
    public preco: number               // Mutable parameter property
  ) {}
  
  ajustarPreco(novoPreco: number): void {
    this.preco = novoPreco; // ✅ OK
    // this.id = 999; // ❌ Erro
  }
}

const produto = new Produto(1, "Laptop", 3000);
console.log(produto.id);   // 1
console.log(produto.nome); // "Laptop"

produto.preco = 2500; // ✅ OK
// produto.id = 2; // ❌ Erro
// produto.nome = "PC"; // ❌ Erro
```

**Conceito avançado:** `readonly` pode ser combinado com parameter properties para criar fields readonly imutáveis de forma concisa.

### Readonly Arrays

```typescript
interface Dados {
  readonly valores: number[]; // Array é readonly
}

const dados: Dados = {
  valores: [1, 2, 3, 4, 5]
};

// Não pode reassign array
// dados.valores = [6, 7, 8]; // ❌ Erro: readonly

// Mas pode modificar conteúdo!
dados.valores.push(6); // ✅ OK - mutating array
dados.valores[0] = 99; // ✅ OK - mutating element

console.log(dados.valores); // [99, 2, 3, 4, 5, 6]
```

**Análise teórica:** `readonly valores: number[]` significa property `valores` não pode ser reatribuída, mas array em si é mutável.

### ReadonlyArray Type

Para array verdadeiramente imutável:

```typescript
interface Dados {
  readonly valores: ReadonlyArray<number>; // Readonly array type
  // Ou: readonly valores: readonly number[];
}

const dados: Dados = {
  valores: [1, 2, 3, 4, 5]
};

// Não pode reassign
// dados.valores = [6, 7, 8]; // ❌ Erro

// Não pode mutar
// dados.valores.push(6); // ❌ Erro: Property 'push' does not exist on type 'readonly number[]'
// dados.valores[0] = 99; // ❌ Erro: Index signature only permits reading

// Pode ler
console.log(dados.valores[0]); // 1
console.log(dados.valores.length); // 5

// Methods que não modificam funcionam
const dobrados = dados.valores.map(x => x * 2); // ✅ OK
console.log(dobrados); // [2, 4, 6, 8, 10]
```

**Fundamento conceitual:** `ReadonlyArray<T>` remove methods mutáveis (push, pop, etc.) e bloqueia index assignment.

### Readonly com Optional

```typescript
interface Config {
  readonly id: number;
  readonly nome?: string; // Readonly + Optional
}

const c1: Config = { id: 1 };
const c2: Config = { id: 2, nome: "Test" };

// c1.id = 3; // ❌ Erro: readonly
// c2.nome = "Other"; // ❌ Erro: readonly

// Mas pode omitir optional
const c3: Config = { id: 3 };
```

**Análise profunda:** `readonly` e `?` são compatíveis. Property pode ser omitida (optional), mas se presente, não pode ser modificada (readonly).

### Readonly Utility Type

```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

// Readonly<T> torna todas properties readonly
type UsuarioReadonly = Readonly<Usuario>;
// Equivalente a:
// interface UsuarioReadonly {
//   readonly id: number;
//   readonly nome: string;
//   readonly email: string;
// }

const usuario: UsuarioReadonly = {
  id: 1,
  nome: "Ana",
  email: "ana@example.com"
};

// usuario.nome = "Maria"; // ❌ Erro: readonly
// usuario.email = "maria@example.com"; // ❌ Erro: readonly
```

**Conceito crucial:** `Readonly<T>` é utility type que mapeia todas properties de `T` para readonly.

### Const Assertions

```typescript
// Sem const assertion
const config1 = {
  host: "localhost",
  porta: 3000
};
// Tipo: { host: string; porta: number }

config1.host = "api.com"; // ✅ OK - mutável
config1.porta = 443;      // ✅ OK - mutável

// Com const assertion
const config2 = {
  host: "localhost",
  porta: 3000
} as const;
// Tipo: { readonly host: "localhost"; readonly porta: 3000 }

// config2.host = "api.com"; // ❌ Erro: readonly
// config2.porta = 443; // ❌ Erro: readonly

// Arrays também
const nums1 = [1, 2, 3]; // number[]
nums1.push(4); // ✅ OK

const nums2 = [1, 2, 3] as const; // readonly [1, 2, 3]
// nums2.push(4); // ❌ Erro
```

**Análise teórica:** `as const` cria **deeply readonly** literal com **literal types**. Mais restrito que `Readonly<T>`.

### Readonly com Index Signatures

```typescript
interface Dicionario {
  readonly [chave: string]: string;
}

const dic: Dicionario = {
  "hello": "olá",
  "world": "mundo"
};

console.log(dic["hello"]); // "olá"

// Não pode adicionar
// dic["goodbye"] = "tchau"; // ❌ Erro: readonly index signature

// Não pode modificar
// dic["hello"] = "oi"; // ❌ Erro: readonly

// Mas pode criar novo objeto
const novoDic: Dicionario = {
  ...dic,
  "goodbye": "tchau"
};
```

**Fundamento conceitual:** Readonly index signature previne adição/modificação de properties dinâmicas.

### Readonly Methods

Methods podem retornar readonly types:

```typescript
class Coleção {
  private items: number[] = [];
  
  adicionar(item: number): void {
    this.items.push(item);
  }
  
  // Retorna readonly array - previne mutação externa
  obterTodos(): ReadonlyArray<number> {
    return this.items;
  }
}

const colecao = new Coleção();
colecao.adicionar(1);
colecao.adicionar(2);

const items = colecao.obterTodos();
console.log(items); // [1, 2]

// items.push(3); // ❌ Erro: readonly array
// items[0] = 99; // ❌ Erro
```

**Conceito avançado:** Retornar readonly types de methods previne consumers de mutar estado interno.

### Readonly Tuples

```typescript
interface Coordenada {
  readonly posicao: readonly [number, number, number];
}

const coord: Coordenada = {
  posicao: [10, 20, 30]
};

console.log(coord.posicao[0]); // 10

// coord.posicao = [1, 2, 3]; // ❌ Erro: readonly property
// coord.posicao[0] = 99; // ❌ Erro: readonly tuple
// coord.posicao.push(4); // ❌ Erro: readonly
```

**Análise profunda:** `readonly [T1, T2, ...]` cria tuple readonly - não pode ser reatribuído nem mutado.

### Variance e Readonly

```typescript
interface Escrita {
  valor: number;
}

interface Leitura {
  readonly valor: number;
}

const escrita: Escrita = { valor: 10 };
const leitura: Leitura = escrita; // ✅ OK - escrita é compatível com leitura

leitura.valor; // 10
// leitura.valor = 20; // ❌ Erro: readonly

escrita.valor = 20; // ✅ OK
console.log(leitura.valor); // 20 - mudou porque referencia mesmo objeto!
```

**Fundamento teórico:** Mutable type é **subtype** de readonly type (covariant). Readonly não garante que objeto não mude, apenas que não pode mudar **via essa referência**.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Readonly

**1. Identifiers**
```typescript
interface Entidade {
  readonly id: number;
}
```

**Raciocínio:** IDs nunca devem mudar após criação.

**2. Timestamps**
```typescript
interface Auditavel {
  readonly criadoEm: Date;
}
```

**Raciocínio:** Data de criação é imutável.

**3. Configuration**
```typescript
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}
```

**Raciocínio:** Configs carregadas uma vez e não mudam.

**4. Immutable Data**
```typescript
interface Usuario {
  readonly nome: string;
}
```

**Raciocínio:** Dados que não devem mudar por design.

## ⚠️ Limitações e Considerações Teóricas

### Runtime Enforcement

Readonly é **compile-time only**:

```typescript
interface Pessoa {
  readonly nome: string;
}

const p: Pessoa = { nome: "Ana" };

// TypeScript previne
// p.nome = "Maria"; // ❌ Erro

// Mas JavaScript permite
(p as any).nome = "Maria"; // ✅ "Funciona" em runtime
console.log(p.nome); // "Maria"
```

**Solução:** Para imutabilidade runtime, use `Object.freeze()`.

### Shallow Immutability

Readonly não se propaga:

```typescript
interface Config {
  readonly opcoes: { timeout: number };
}

const c: Config = { opcoes: { timeout: 5000 } };
// c.opcoes = {}; // ❌ Erro
c.opcoes.timeout = 10000; // ✅ OK - nested mutable
```

**Solução:** Marcar nested objects também readonly.

### Performance

Zero overhead - readonly é removido em JavaScript.

## 🔗 Interconexões Conceituais

**Relação com Const:** `const` para variáveis, `readonly` para properties.

**Relação com Immutability:** Base para programação funcional.

**Relação com Utility Types:** `Readonly<T>` transforma tipos.

**Relação com React:** State e props são readonly por convenção.

## 🚀 Evolução e Próximos Conceitos

Dominar readonly prepara para:
- **Immutable Data Structures:** Bibliotecas como Immer
- **Readonly Utility Types:** `Readonly`, `ReadonlyArray`, `ReadonlyMap`
- **Const Assertions:** Deep readonly com `as const`
- **Functional Programming:** Imutabilidade como paradigma
