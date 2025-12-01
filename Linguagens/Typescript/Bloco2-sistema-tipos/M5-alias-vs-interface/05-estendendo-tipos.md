# Estendendo Tipos: `extends` vs. Intersection

## 🎯 Introdução e Definição

Extensão de tipos é **criação de tipos derivados que herdam características de tipos base**, realizada através de `extends` (interfaces) ou intersection `&` (type aliases). Conceitualmente, representa **composição vertical** (extends sugere hierarquia) vs. **composição horizontal** (intersection sugere agregação): `extends` comunica **relação "é-um"** com herança clara; `&` expressa **combinação de características** sem hierarquia implícita. Embora produzam resultados similares para objetos simples, diferem em semântica, capacidades e mensagens de erro do compilador.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Interface `extends`:** Herança hierárquica explícita
2. **Type `&`:** Composição por intersection
3. **Equivalência Parcial:** Resultados similares para objetos
4. **Semântica:** Extends = hierarquia; Intersection = agregação
5. **Mensagens de Erro:** Extends mais claras
6. **Múltiplas Extensões:** Ambos suportam

**Conceito Central:** Extends e intersection são **abordagens diferentes** para mesmo objetivo - criar tipos derivados.

## 🧠 Fundamentos Teóricos

### Interface com `extends`

**Sintaxe:**
```typescript
interface Base {
  id: number;
  nome: string;
}

interface Usuario extends Base {
  email: string;
  senha: string;
}

// Usuario = {
//   id: number;
//   nome: string;
//   email: string;
//   senha: string;
// }
```

**Conceito:** Interface filha **herda** propriedades da interface pai.

### Type Alias com Intersection

**Sintaxe:**
```typescript
type Base = {
  id: number;
  nome: string;
};

type Usuario = Base & {
  email: string;
  senha: string;
};

// Usuario = {
//   id: number;
//   nome: string;
//   email: string;
//   senha: string;
// }
```

**Conceito:** Type intersecciona **agregando** propriedades.

### Equivalência para Objetos Simples

**Resultados Idênticos:**
```typescript
// Extends
interface A extends B { c: string }

// Intersection
type A = B & { c: string }

// Ambos produzem tipo com propriedades de B + c
```

**Diferença:** Sintaxe e semântica, não resultado final.

## 🔍 Herança Múltipla

### Interface: Múltiplos `extends`

**Sintaxe:**
```typescript
interface Identificavel {
  id: number;
}

interface Timestampavel {
  criadoEm: Date;
  atualizadoEm: Date;
}

interface Nomeavel {
  nome: string;
}

interface Usuario extends Identificavel, Timestampavel, Nomeavel {
  email: string;
}

// Usuario = { id, criadoEm, atualizadoEm, nome, email }
```

**Conceito:** Interface pode **herdar de múltiplas** interfaces separadas por vírgula.

### Type Alias: Múltiplas Intersections

**Sintaxe:**
```typescript
type Identificavel = { id: number };
type Timestampavel = { criadoEm: Date; atualizadoEm: Date };
type Nomeavel = { nome: string };

type Usuario = Identificavel & Timestampavel & Nomeavel & {
  email: string;
};

// Usuario = { id, criadoEm, atualizadoEm, nome, email }
```

**Conceito:** Type pode **interseccionar múltiplos** tipos com `&`.

### Equivalência

**Ambos Produzem:**
```typescript
type Usuario = {
  id: number;
  criadoEm: Date;
  atualizadoEm: Date;
  nome: string;
  email: string;
};
```

## 🔍 Diferenças Comportamentais

### 1. Conflitos de Propriedades

**Interface `extends` (Erro Claro):**
```typescript
interface A {
  prop: string;
}

interface B {
  prop: number;
}

// ERRO: Interface 'C' incorrectly extends interface 'A'.
//   Types of property 'prop' are incompatible.
//     Type 'number' is not assignable to type 'string'.
interface C extends A, B { }
```

**Type Intersection (Cria `never`):**
```typescript
type A = { prop: string };
type B = { prop: number };

type C = A & B;
// C = { prop: string & number }
// C = { prop: never }

// Possível declarar, impossível instanciar
const obj: C = {
  prop: ???  // Impossível satisfazer
};
```

**Diferença:** Interface **detecta conflito em declaração**; Type cria tipo `never` **silenciosamente**.

### 2. Mensagens de Erro

**Interface (Mais Clara):**
```typescript
interface Animal {
  nome: string;
  idade: number;
}

interface Cachorro extends Animal {
  raca: string;
}

const dog: Cachorro = {
  nome: "Rex",
  // ERRO: Property 'idade' is missing in type '{ nome: string; }' but required in type 'Animal'.
};
```

**Type (Menos Específica):**
```typescript
type Animal = { nome: string; idade: number };
type Cachorro = Animal & { raca: string };

const dog: Cachorro = {
  nome: "Rex",
  // ERRO: Property 'idade' is missing...
  // (mensagem similar mas menos contexto de hierarquia)
};
```

**Diferença:** Extends **referencia base por nome**; Intersection mostra tipo expandido.

### 3. Recursão

**Interface (Suporta Naturalmente):**
```typescript
interface Node {
  valor: number;
  proximo?: Node;  // Referência a si mesma
}

const lista: Node = {
  valor: 1,
  proximo: {
    valor: 2,
    proximo: {
      valor: 3
    }
  }
};
```

**Type (Suporta mas Menos Idiomático):**
```typescript
type Node = {
  valor: number;
  proximo?: Node;
};

// Funciona, mas type aliases recursivos podem ser complexos
```

## 🎯 Semântica e Intenção

### Extends: Hierarquia

**Comunicação de Conceito:**
```typescript
interface Veiculo {
  velocidadeMaxima: number;
}

interface Carro extends Veiculo {
  numeroPortas: number;
}

interface Moto extends Veiculo {
  temCarenagem: boolean;
}
```

**Intenção:** **"Carro é-um Veiculo"** - relação hierárquica clara.

### Intersection: Composição

**Comunicação de Conceito:**
```typescript
type Loggable = { log(msg: string): void };
type Cacheable = { cache: Map<any, any> };
type Configurable = { config: Record<string, any> };

type ComponenteRico = Componente & Loggable & Cacheable & Configurable;
```

**Intenção:** **"ComponenteRico tem capacidades de logging, cache e configuração"** - composição de traits.

### Escolha Baseada em Semântica

**Hierarquia Clara → Extends:**
```typescript
// ✅ Extends comunica hierarquia
interface Animal { }
interface Mamifero extends Animal { }
interface Cachorro extends Mamifero { }
```

**Composição de Traits → Intersection:**
```typescript
// ✅ Intersection comunica agregação
type EntidadeCompleta = Entidade & Timestampable & Auditable & Serializable;
```

## 🎯 Interface Extends Type Alias

### Possível e Válido

**Interface Pode Estender Type:**
```typescript
type Base = {
  id: number;
  nome: string;
};

interface Usuario extends Base {
  email: string;
}

// Usuario = { id, nome, email }
```

**Conceito:** Interface pode **extends** type alias que descreve objeto.

### Type Alias Pode Interseccionar Interface

**Type Pode Interseccionar Interface:**
```typescript
interface Base {
  id: number;
  nome: string;
}

type Usuario = Base & {
  email: string;
};

// Usuario = { id, nome, email }
```

**Conceito:** Type pode **interseccionar** interface normalmente.

### Interoperabilidade Completa

**Misturar Livremente:**
```typescript
interface A { a: string }
type B = { b: number }

interface C extends A, B {  // Interface extends interface + type
  c: boolean;
}

type D = A & B & { d: string };  // Type intersecciona interface + type
```

## 🎯 Padrões Recomendados

### Usar Extends Para

**1. Hierarquias OOP:**
```typescript
interface Forma {
  calcularArea(): number;
}

interface Circulo extends Forma {
  raio: number;
}

interface Retangulo extends Forma {
  largura: number;
  altura: number;
}
```

**2. Refinamento de Contratos:**
```typescript
interface Repository<T> {
  findById(id: number): Promise<T | null>;
}

interface UsuarioRepository extends Repository<Usuario> {
  findByEmail(email: string): Promise<Usuario | null>;
}
```

### Usar Intersection Para

**1. Mixins/Traits:**
```typescript
type WithTimestamp = { criadoEm: Date; atualizadoEm: Date };
type WithAudit = { criadoPor: number; atualizadoPor: number };

type Entidade = Base & WithTimestamp & WithAudit;
```

**2. Composição Ad-Hoc:**
```typescript
type RequestWithUser = Request & { usuario: Usuario };
type ResponseWithMeta = Response & { meta: Metadata };
```

**3. Utility Types:**
```typescript
type ReadonlyUser = Readonly<Usuario> & { version: number };
type PartialConfig = Partial<Config> & { url: string };  // url obrigatório
```

## ⚠️ Armadilhas Comuns

### 1. Conflito Silencioso com Intersection

```typescript
type A = { id: string };
type B = { id: number };

type C = A & B;  // { id: never } - compila mas inútil
```

**Solução:** Usar extends para detectar conflito cedo.

### 2. Extends Apenas para Objetos

```typescript
// ❌ ERRO: Interface can only extend an object type
interface StringInterface extends string { }

// ✅ Type pode interseccionar primitivos (resulta em never)
type StringType = string & { custom: true };  // never
```

### 3. Ordem em Extends vs. Intersection

```typescript
// Extends: ordem às vezes importa para overrides
interface A extends B, C { }  // C pode override B

// Intersection: ordem nunca importa (comutativa)
type A = B & C;  // = C & B
```

## 📚 Conclusão

**Extends e intersection** oferecem **abordagens diferentes para extensão de tipos**: extends é **hierárquico e explícito**, comunicando relação "é-um"; intersection é **compositivo e flexível**, agregando características. Ambos produzem **resultados similares** para objetos simples, mas diferem em **semântica**, **mensagens de erro** e **detecção de conflitos**.

**Conceitos Fundamentais:**
1. **Extends:** Herança hierárquica (interface)
2. **Intersection (`&`):** Composição por agregação (type)
3. **Equivalência:** Resultados similares para objetos
4. **Conflitos:** Extends detecta cedo; Intersection cria `never`
5. **Semântica:** Extends = "é-um"; Intersection = "tem"
6. **Interoperabilidade:** Podem misturar interface e type

**Escolha extends para hierarquia; intersection para composição horizontal.**
