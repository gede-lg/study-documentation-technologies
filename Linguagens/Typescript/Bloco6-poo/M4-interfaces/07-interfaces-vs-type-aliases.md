# Interfaces vs. Type Aliases

## 🎯 Introdução e Definição

### Definição Conceitual

**Interfaces** e **Type Aliases** são dois mecanismos em TypeScript para definir **shapes** (formas) de tipos customizados. Ambos permitem nomear estruturas de objetos, funções, e tipos complexos, mas com **diferenças sutis** em capabilities, syntax, e semântica. Interface usa keyword `interface` e é tradicionalmente focada em **object shapes** e **contracts**, enquanto Type Alias usa `type` e pode representar **qualquer tipo** (primitives, unions, tuples, etc.), além de object shapes.

Conceitualmente, interfaces implementam **nominal typing philosophy** (embora TypeScript use structural typing) - definem contratos que podem ser implementados por classes e estendidos por outras interfaces. Type aliases implementam **type aliasing** - dão nome a qualquer tipo existente, incluindo complexos unions, intersections, mapped types. Ambos coexistem porque servem **propósitos levemente diferentes**, embora com overlap significativo.

### Contexto Histórico e Motivação

A evolução de interfaces e type aliases:

**TypeScript 0.8 (2012):** Introduziu **interfaces** como forma primária de definir object shapes, seguindo tradição de Java/C#.

**TypeScript 1.0 (2014):** Introduziu **type aliases** com keyword `type`, permitindo nomear union types, intersection types, e outros tipos avançados.

**Decisão de Design:** Manteve ambos por razões históricas e filosóficas:
- **Interfaces:** Familiares para desenvolvedores Java/C#, focadas em OOP, extensíveis
- **Type Aliases:** Mais flexíveis, funcionais, alinhados com natureza dinâmica de JavaScript

**TypeScript 2.x-4.x:** Ambos evoluíram, com overlap crescente. Type aliases ganharam capabilities que antes eram exclusivas de interfaces (ex: implements).

**Debate Comunidade:** "Qual usar?" é questão frequente. TypeScript team sugere preferir um consistentemente, mas não enforça.

A motivação para ter ambos: **flexibilidade**. Interfaces para contracts/OOP, type aliases para tipos complexos/funcionais.

### Problema Fundamental que Resolve

Interfaces e type aliases resolvem problemas similares:

**1. Naming Types:** Dar nomes semânticos a estruturas de tipos.

**2. Reusability:** Reutilizar definições de tipos em múltiplos lugares.

**3. Documentation:** Tipos nomeados servem como documentação.

**4. Abstraction:** Abstrair complexidade de tipos inline.

**Diferenças em problemas específicos:**
- **Interfaces:** Melhores para **contracts**, **class implementation**, **extensibility**
- **Type Aliases:** Melhores para **unions**, **tuples**, **primitives**, **computed types**

### Importância no Ecossistema

Escolha entre interfaces e type aliases é importante porque:

- **Code Consistency:** Codebases devem ser consistentes na escolha
- **Framework Conventions:** Alguns frameworks preferem um sobre outro (ex: React props - type)
- **Tooling:** IDEs podem ter suporte ligeiramente diferente
- **Readability:** Escolha afeta legibilidade e manutenibilidade
- **Evolution:** Interfaces são mais fáceis de estender sem quebrar código

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Syntax:** `interface Name {}` vs `type Name = {}`
2. **Scope:** Interfaces para objects/functions; Type aliases para qualquer tipo
3. **Extension:** Interfaces usam `extends`; Type aliases usam `&`
4. **Declaration Merging:** Interfaces suportam; Type aliases não
5. **Computed Properties:** Type aliases são mais poderosos

### Pilares Fundamentais

- **Interface:** Object shapes, class contracts, extensibility
- **Type Alias:** Unions, tuples, primitives, mapped types
- **Overlap:** Ambos podem definir object shapes
- **Implements:** Classes podem implementar ambos
- **Extends:** Interfaces podem estender type aliases (e vice-versa, com limitações)

### Visão Geral das Nuances

- **Performance:** Zero diferença - ambos desaparecem em runtime
- **Error Messages:** Interfaces podem ter mensagens mais claras
- **Compatibility:** Ambos são intercambiáveis para object shapes na maioria dos casos
- **Future-Proof:** Interfaces são mais fáceis de estender sem quebrar consumidores

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

Interfaces e type aliases são tratados similarmente pelo compilador:

**1. Parsing:** Identifica `interface` ou `type` keyword.

**2. Type Construction:**
   - **Interface:** Cria object type com members especificados
   - **Type Alias:** Cria alias para tipo à direita de `=`

**3. Type Checking:** Ambos usam **structural typing** - compatibilidade baseada em structure, não nome.

**4. Declaration Merging:**
   - **Interface:** Múltiplas declarations são merged automaticamente
   - **Type Alias:** Redeclaration é erro

**5. Code Generation:** Ambos desaparecem - JavaScript resultante é idêntico.

### Princípios e Conceitos Subjacentes

#### Structural Typing para Ambos

Tanto interfaces quanto type aliases usam structural typing:

```typescript
interface IPessoa {
  nome: string;
  idade: number;
}

type TPessoa = {
  nome: string;
  idade: number;
};

const obj = { nome: "Ana", idade: 25 };

const p1: IPessoa = obj; // ✅ OK
const p2: TPessoa = obj; // ✅ OK

// São intercambiáveis
const p3: IPessoa = {} as TPessoa; // ✅ OK
const p4: TPessoa = {} as IPessoa; // ✅ OK
```

**Fundamento conceitual:** Para object shapes, interfaces e type aliases são estruturalmente equivalentes.

#### Scope Differences

Type aliases podem representar **qualquer tipo**:

```typescript
// ✅ Type alias - pode ser primitive
type ID = string | number;
type Nome = string;
type Ativo = boolean;

// ✅ Type alias - pode ser union
type Resultado = Sucesso | Erro;

// ✅ Type alias - pode ser tuple
type Coordenada = [number, number];

// ❌ Interface - não pode ser primitive/union/tuple diretamente
// interface ID = string | number; // Erro de syntax
```

**Análise profunda:** Interfaces são sempre **object types**. Type aliases são universais.

#### Declaration Merging

Interfaces suportam declaration merging:

```typescript
interface Usuario {
  nome: string;
}

interface Usuario {
  idade: number;
}

// Merged automaticamente
const usuario: Usuario = {
  nome: "Ana",
  idade: 25
};

// Type alias - redeclaration é erro
type Pessoa = { nome: string; };
// type Pessoa = { idade: number; }; // ❌ Erro: Duplicate identifier
```

**Conceito crucial:** Declaration merging permite **augmentation** (aumentar interface existente). Útil para extending biblioteca de terceiros.

### Modelo Mental para Compreensão

Pense em interfaces vs type aliases como **contratos** vs **apelidos**:

- **Interface:** Contrato formal (ex: contrato de trabalho especificando responsabilidades)
- **Type Alias:** Apelido/abreviação (ex: "CEO" é apelido para "Chief Executive Officer")

**Interface:** Define **novo conceito** (contract) que pode ser implementado, estendido, augmented.

**Type Alias:** Dá **nome** a tipo existente (que pode ser simples ou complexo).

## 🔍 Análise Conceitual Profunda

### Object Shapes - Equivalentes

```typescript
// Interface
interface Pessoa {
  nome: string;
  idade: number;
  email?: string;
}

// Type Alias equivalente
type PessoaType = {
  nome: string;
  idade: number;
  email?: string;
};

// Funcionalmente idênticos
const p1: Pessoa = { nome: "Ana", idade: 25 };
const p2: PessoaType = { nome: "João", idade: 30 };
```

**Análise conceitual:** Para object shapes simples, são intercambiáveis.

### Extension vs Intersection

```typescript
// Interface - extends
interface Animal {
  nome: string;
}

interface Cachorro extends Animal {
  raca: string;
}

// Type Alias - intersection
type AnimalType = {
  nome: string;
};

type CachorroType = AnimalType & {
  raca: string;
};

// Resultados equivalentes
const c1: Cachorro = { nome: "Rex", raca: "Labrador" };
const c2: CachorroType = { nome: "Max", raca: "Beagle" };
```

**Fundamento teórico:** `extends` e `&` (intersection) têm resultado similar para object types.

### Union Types - Type Alias Only

```typescript
// ✅ Type Alias - union types
type Resultado = Sucesso | Erro;
type ID = string | number;
type Status = "ativo" | "inativo" | "pendente";

// ❌ Interface não pode representar union diretamente
// interface Resultado = Sucesso | Erro; // Syntax error
```

**Conceito crucial:** Union types requerem type aliases.

### Tuple Types - Type Alias Only

```typescript
// ✅ Type Alias - tuples
type Coordenada = [number, number];
type NomeIdade = [string, number];

// ❌ Interface não pode representar tuple diretamente
// Workaround: array-like object
interface ITuple {
  0: number;
  1: number;
  length: 2;
}
```

**Análise profunda:** Tuples são naturalmente expressas como type aliases.

### Primitive Types - Type Alias Only

```typescript
// ✅ Type Alias - nomear primitivos
type Nome = string;
type Idade = number;
type Ativo = boolean;

// ❌ Interface não pode alias primitivos
```

**Fundamento conceitual:** Type aliases podem nomear qualquer tipo, incluindo primitivos.

### Declaration Merging - Interface Only

```typescript
// Interface - merging
interface Janela {
  titulo: string;
}

interface Janela {
  largura: number;
}

// Merged: Janela = { titulo: string; largura: number; }

// Type - não suporta merging
type Config = { host: string; };
// type Config = { porta: number; }; // ❌ Erro
```

**Análise teórica:** Declaration merging é exclusivo de interfaces.

### Implements - Both

```typescript
interface ILogger {
  log(msg: string): void;
}

type TLogger = {
  log(msg: string): void;
};

// Classe pode implementar ambos
class ConsoleLogger1 implements ILogger {
  log(msg: string) { console.log(msg); }
}

class ConsoleLogger2 implements TLogger {
  log(msg: string) { console.log(msg); }
}
```

**Conceito avançado:** Classes podem implementar tanto interfaces quanto type aliases (desde que sejam object types).

### Extends - Both Directions

```typescript
// Interface extends type alias
type Animal = {
  nome: string;
};

interface Cachorro extends Animal {
  raca: string;
}

// Type alias "extends" interface via intersection
interface Pessoa {
  nome: string;
}

type Funcionario = Pessoa & {
  cargo: string;
};
```

**Análise profunda:** Interfaces e type aliases podem interoperar.

### Mapped Types - Type Alias Advantage

```typescript
// ✅ Type Alias - mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// ❌ Interface não suporta mapped type syntax
```

**Conceito crucial:** Mapped types, conditional types, template literal types requerem type aliases.

### Recursive Types - Both (com diferenças)

```typescript
// Interface - recursivo direto
interface Node {
  valor: number;
  proximo?: Node;
}

// Type Alias - recursivo direto
type TNode = {
  valor: number;
  proximo?: TNode;
};

// Ambos funcionam igualmente
```

**Fundamento teórico:** Ambos suportam tipos recursivos.

### Index Signatures - Both

```typescript
// Interface
interface Dicionario {
  [chave: string]: string;
}

// Type Alias
type TDicionario = {
  [chave: string]: string;
};

// Equivalentes
const d1: Dicionario = { a: "1", b: "2" };
const d2: TDicionario = { c: "3", d: "4" };
```

**Análise teórica:** Index signatures funcionam em ambos.

### Function Types - Both

```typescript
// Interface - call signature
interface Soma {
  (a: number, b: number): number;
}

// Type Alias - function type
type TSoma = (a: number, b: number) => number;

// Equivalentes
const somar1: Soma = (a, b) => a + b;
const somar2: TSoma = (a, b) => a + b;
```

**Conceito avançado:** Ambos podem representar function types, com syntaxes diferentes.

### Utility Types - Type Alias

```typescript
// TypeScript utility types são type aliases
type ReadonlyPessoa = Readonly<Pessoa>;
type PartialConfig = Partial<Config>;
type PickNome = Pick<Usuario, "nome">;

// Não podem ser interfaces
```

**Análise profunda:** Utility types avançados dependem de features exclusivas de type aliases.

### Computed Property Names - Type Alias Advantage

```typescript
const CHAVE = "nome";

// ✅ Type Alias - computed property
type Obj = {
  [CHAVE]: string;
};

// ❌ Interface - não suporta computed property names diretamente
interface IObj {
  // [CHAVE]: string; // Erro
}
```

**Fundamento conceitual:** Type aliases são mais flexíveis com computed properties.

## 🎯 Aplicabilidade e Contextos

### Quando Usar Interface

**1. Object Contracts**
```typescript
interface Usuario {
  id: number;
  nome: string;
}
```

**Raciocínio:** Definir contratos que classes podem implementar.

**2. Class Implementation**
```typescript
interface Logger {
  log(msg: string): void;
}

class ConsoleLogger implements Logger {
  log(msg: string) {}
}
```

**Raciocínio:** Interfaces são idiomáticas para class contracts.

**3. Extensibility**
```typescript
interface Plugin {
  nome: string;
}

// Consumidor pode augment
interface Plugin {
  versao: string;
}
```

**Raciocínio:** Declaration merging permite extensão.

**4. Public APIs**
```typescript
export interface Config {
  apiUrl: string;
}
```

**Raciocínio:** Interfaces são mais fáceis de estender sem quebrar consumidores.

### Quando Usar Type Alias

**1. Union Types**
```typescript
type Status = "ativo" | "inativo";
type ID = string | number;
```

**Raciocínio:** Type aliases são únicos para unions.

**2. Tuple Types**
```typescript
type Coordenada = [number, number];
```

**Raciocínio:** Tuples são naturalmente type aliases.

**3. Mapped/Conditional Types**
```typescript
type Readonly<T> = { readonly [P in keyof T]: T[P] };
```

**Raciocínio:** Advanced type manipulation requer type aliases.

**4. Primitive Aliases**
```typescript
type Nome = string;
```

**Raciocínio:** Dar semântica a primitivos.

### Quando São Intercambiáveis

Para **object shapes simples**, escolha é estilo:

```typescript
// Ambos OK
interface Pessoa { nome: string; }
type Pessoa = { nome: string; };
```

**Guia:** Escolha um e seja consistente no codebase.

## ⚠️ Limitações e Considerações Teóricas

### Interface Limitations

- Não pode representar unions, tuples, primitives
- Não suporta mapped types
- Não pode ter computed property names

### Type Alias Limitations

- Não suporta declaration merging
- Pode ser menos clara em mensagens de erro (às vezes)

### Performance

Zero diferença - ambos desaparecem em compilação.

### Error Messages

Interfaces às vezes geram mensagens mais legíveis:

```typescript
interface Usuario { nome: string; }
type TUsuario = { nome: string; };

const u1: Usuario = {}; 
// Error: Type '{}' is missing property 'nome' from type 'Usuario'

const u2: TUsuario = {};
// Error: Type '{}' is missing property 'nome' from type 'TUsuario'
```

## 🔗 Interconexões Conceituais

**Relação com OOP:** Interfaces são mais alinhadas com OOP (Java, C#).

**Relação com FP:** Type aliases são mais alinhados com programação funcional.

**Relação com Utility Types:** Type aliases são base para utility types.

**Relação com Declaration Merging:** Interfaces uniquas nessa capability.

## 🚀 Evolução e Próximos Conceitos

Dominar diferenças prepara para:
- **Advanced Types:** Mapped, conditional, template literal types
- **Utility Types:** `Partial`, `Readonly`, `Pick`, etc.
- **Declaration Merging:** Augmenting interfaces de bibliotecas
- **Type Manipulation:** Transformações complexas de tipos

## 📊 Comparação Resumida

| Feature | Interface | Type Alias |
|---------|-----------|------------|
| Object shapes | ✅ | ✅ |
| Union types | ❌ | ✅ |
| Tuple types | ❌ (workaround) | ✅ |
| Primitive types | ❌ | ✅ |
| Function types | ✅ | ✅ |
| Mapped types | ❌ | ✅ |
| Conditional types | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Extends | ✅ | ✅ (via &) |
| Implements | ✅ | ✅ (object type) |
| Computed properties | ❌ | ✅ |

## 💡 Recomendações Práticas

**Convenção Sugerida:**
1. **Interfaces:** Para object shapes que podem ser implementados por classes ou estendidos
2. **Type Aliases:** Para unions, tuples, mapped types, e aliases de primitivos
3. **Consistência:** Escolha um como padrão para object shapes e mantenha consistência

**React Example:**
```typescript
// Props - Type (convenção comum)
type ButtonProps = {
  label: string;
  onClick: () => void;
};

// State - Type
type AppState = {
  count: number;
};
```

**API Design:**
```typescript
// Public API - Interface (extensível)
export interface Config {
  apiUrl: string;
}

// Internal types - Type Alias
type InternalState = "idle" | "loading" | "error";
```
