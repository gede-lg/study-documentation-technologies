# Combinando Tipos com Intersection: Type1 & Type2

## 🎯 Introdução e Definição

Intersection type é **tipo TypeScript que combina múltiplos tipos** através do operador `&`, criando tipo que **possui todas as propriedades e características de todos os tipos combinados**. Conceitualmente, representa **união de características** (não união de valores como union): valor de intersection type `A & B` deve satisfazer **simultaneamente** os requisitos de `A` E de `B`. Intersection types são fundamentais para composição de tipos, mixins, extensão de interfaces e modelagem de objetos que agregam múltiplas capacidades.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Operador `&`:** Combina tipos em interseção
2. **"E" Lógico:** Valor deve satisfazer TODOS os tipos
3. **Agregação de Propriedades:** Resultado contém todas as propriedades
4. **Composição:** Construir tipos complexos de tipos simples
5. **vs. Union (`|`):** Union é "OU", Intersection é "E"
6. **Conflitos:** Propriedades incompatíveis resultam em `never`

**Conceito Central:** Intersection type = **todas as características combinadas** - valor deve ser A E B simultaneamente.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Intersection de Objetos:**
```typescript
type Nome = { nome: string };
type Idade = { idade: number };

type Pessoa = Nome & Idade;
// Pessoa = { nome: string; idade: number }

const pessoa: Pessoa = {
  nome: "João",
  idade: 30
};
```

**Conceito:** Intersection **agrega propriedades** de ambos os tipos.

### Semântica: "E" Lógico

**Comparação com Union:**
```typescript
// Union: OU (aceita A ou B)
type UnionAB = A | B;

// Intersection: E (deve ser A e B)
type IntersectionAB = A & B;
```

**Com Primitivos:**
```typescript
type StringAndNumber = string & number;
// StringAndNumber = never (impossível ser string E number)
```

**Conceito:** Primitivos diferentes não têm interseção - resultado é `never`.

**Com Objetos:**
```typescript
type A = { x: number };
type B = { y: string };

type AB = A & B;
// AB = { x: number; y: number }
```

**Conceito:** Objetos interseccionam **agregando propriedades**.

### Agregação de Propriedades

**Exemplo Completo:**
```typescript
type Identificavel = {
  id: number;
};

type Nomeavel = {
  nome: string;
};

type Timestampavel = {
  criadoEm: Date;
  atualizadoEm: Date;
};

type Usuario = Identificavel & Nomeavel & Timestampavel;
// Usuario = {
//   id: number;
//   nome: string;
//   criadoEm: Date;
//   atualizadoEm: Date;
// }

const usuario: Usuario = {
  id: 1,
  nome: "Maria",
  criadoEm: new Date(),
  atualizadoEm: new Date()
};
```

**Conceito:** Intersection de N tipos agrega propriedades de todos.

### Propriedades Sobrescritas

**Tipos Compatíveis:**
```typescript
type A = { x: number };
type B = { x: number };

type AB = A & B;
// AB = { x: number } (mesma propriedade, mesmo tipo)
```

**Tipos Incompatíveis:**
```typescript
type A = { x: string };
type B = { x: number };

type AB = A & B;
// AB = { x: never } (string & number = never)

// Impossível criar valor válido
const valor: AB = {
  x: ???  // Impossível satisfazer string E number
};
```

**Conceito:** Propriedade com tipos incompatíveis vira `never` - tipo impossível de instanciar.

### Intersection com Union

**Distribuição:**
```typescript
type A = { a: string };
type B = { b: number };
type C = { c: boolean };

type AB = A | B;
type Resultado = AB & C;
// Resultado = (A & C) | (B & C)
// = { a: string; c: boolean } | { b: number; c: boolean }
```

**Conceito:** Intersection **distribui sobre union** - cada membro da union é interseccionado.

## 🔍 Análise Conceitual Profunda

### Composição de Tipos

**Building Blocks:**
```typescript
type Coordenadas = {
  x: number;
  y: number;
};

type Colorido = {
  cor: string;
};

type Dimensionado = {
  largura: number;
  altura: number;
};

// Compor tipos complexos
type Ponto = Coordenadas & Colorido;
type Retangulo = Coordenadas & Dimensionado & Colorido;
type Circulo = Coordenadas & Colorido & { raio: number };
```

**Vantagem:** **Reutilização** - tipos base combinam-se para formar tipos complexos.

### Mixins Pattern

**Conceito:** Adicionar capacidades a tipos base.

```typescript
type Serializavel = {
  serializar(): string;
  deserializar(dados: string): void;
};

type Validavel = {
  validar(): boolean;
  erros: string[];
};

type Loggable = {
  log(mensagem: string): void;
};

type Modelo = {
  id: number;
  nome: string;
};

type ModeloCompleto = Modelo & Serializavel & Validavel & Loggable;

const modelo: ModeloCompleto = {
  id: 1,
  nome: "Exemplo",
  serializar() { return JSON.stringify(this); },
  deserializar(dados) { Object.assign(this, JSON.parse(dados)); },
  validar() { return this.nome.length > 0; },
  erros: [],
  log(msg) { console.log(msg); }
};
```

**Conceito:** Intersection permite **composição horizontal** de capacidades.

### Extending Interfaces via Intersection

**Alternativa a `extends`:**
```typescript
interface Base {
  id: number;
  nome: string;
}

// Com extends
interface UsuarioExtends extends Base {
  email: string;
}

// Com intersection
type UsuarioIntersection = Base & {
  email: string;
};

// Ambos equivalentes para uso
const u1: UsuarioExtends = { id: 1, nome: "João", email: "joao@exemplo.com" };
const u2: UsuarioIntersection = { id: 1, nome: "João", email: "joao@exemplo.com" };
```

**Diferença:** `extends` é sintaxe de interface; `&` funciona com types e interfaces.

### Intersection com Literais

**Refinamento:**
```typescript
type Status = "ativo" | "inativo";
type Premium = { premium: true };

type UsuarioAtivo = { status: "ativo" } & Premium;
// UsuarioAtivo = { status: "ativo"; premium: true }

const usuario: UsuarioAtivo = {
  status: "ativo",
  premium: true
};
```

**Literais Incompatíveis:**
```typescript
type A = { tipo: "A" };
type B = { tipo: "B" };

type AB = A & B;
// AB = { tipo: "A" & "B" } = { tipo: never }
// Impossível de instanciar
```

**Conceito:** Intersection de literais diferentes na mesma propriedade = `never`.

## 🎯 Aplicabilidade

### Quando Usar Intersection

**1. Composição de Capacidades:**
```typescript
type Autenticavel = {
  login(usuario: string, senha: string): boolean;
  logout(): void;
};

type Auditavel = {
  ultimoAcesso: Date;
  historicoAcoes: string[];
};

type UsuarioSistema = {
  id: number;
  nome: string;
} & Autenticavel & Auditavel;
```

**2. Extending Types:**
```typescript
type ConfigBase = {
  url: string;
  timeout: number;
};

type ConfigAvancada = ConfigBase & {
  retry: number;
  cache: boolean;
};
```

**3. Merge de Objetos:**
```typescript
type Opcoes1 = { a: string; b: number };
type Opcoes2 = { c: boolean; d: string };

type OpcoesCompletas = Opcoes1 & Opcoes2;

function configurar(opcoes: OpcoesCompletas) {
  // Acessa a, b, c, d
}
```

**4. Adicionar Metadados:**
```typescript
type Dado<T> = T & {
  _metadata: {
    versao: number;
    timestamp: Date;
  };
};

type Usuario = { nome: string; email: string };
type UsuarioComMetadata = Dado<Usuario>;
```

**5. Mixins de Comportamento:**
```typescript
type Timestampable = {
  criadoEm: Date;
  atualizadoEm: Date;
};

type SoftDeletable = {
  deletadoEm?: Date;
  restaurar(): void;
};

type EntidadeCompleta<T> = T & Timestampable & SoftDeletable;
```

### Padrões de Composição

**Traits/Mixins:**
```typescript
type Nomeavel = { nome: string };
type Descritivel = { descricao: string };
type Ativavel = { ativo: boolean };

// Compor conforme necessário
type Produto = Nomeavel & Descritivel & Ativavel & { preco: number };
type Categoria = Nomeavel & Descritivel & { produtosIds: number[] };
```

**Partial Application:**
```typescript
type Base = { id: number; nome: string };

type ComTimestamp = Base & { timestamp: Date };
type ComUsuario = Base & { usuarioId: number };
type ComAmbos = Base & { timestamp: Date; usuarioId: number };
// Equivalente a: ComTimestamp & ComUsuario
```

## 🎯 Padrões Recomendados

### Nomenclatura Clara

```typescript
// ✅ Nomes descritivos
type UsuarioAutenticado = Usuario & Autenticacao;
type ProdutoComEstoque = Produto & Estoque;

// ❌ Nomes genéricos
type Tipo1E2 = Type1 & Type2;
```

### Tipos Base Reutilizáveis

```typescript
// types/mixins.ts
export type Timestamped = {
  criadoEm: Date;
  atualizadoEm: Date;
};

export type Identifiable = {
  id: number;
};

export type Auditable = {
  criadoPor: number;
  atualizadoPor: number;
};

// Usar em modelos
type Usuario = Identifiable & Timestamped & Auditable & {
  nome: string;
  email: string;
};
```

### Evitar Intersections Impossíveis

```typescript
// ❌ Evitar - impossível satisfazer
type Impossivel = string & number;

// ✅ Usar union se precisa aceitar ambos
type Possivel = string | number;
```

## ⚠️ Armadilhas Comuns

### 1. Propriedades Conflitantes

```typescript
type A = { id: string };
type B = { id: number };

type AB = A & B;
// AB = { id: string & number } = { id: never }

// Impossível criar
// const obj: AB = { id: ??? };
```

**Solução:** Garantir tipos compatíveis ou renomear propriedades.

### 2. Confundir com Union

```typescript
// Intersection: deve ter TODAS as propriedades
type Inter = { a: string } & { b: number };
const inter: Inter = { a: "x", b: 1 };  // Precisa de ambas

// Union: pode ter UMA das estruturas
type Union = { a: string } | { b: number };
const union1: Union = { a: "x" };  // OK
const union2: Union = { b: 1 };    // OK
```

### 3. Intersection de Primitivos

```typescript
type StringNumber = string & number;  // never
type TrueAndFalse = true & false;     // never

// Apenas objetos agregam propriedades sensatamente
```

### 4. Ordem Não Importa (mas Legibilidade Sim)

```typescript
type AB = A & B;
type BA = B & A;
// AB e BA são idênticos

// ✅ Preferir ordem lógica (base primeiro)
type Usuario = Pessoa & Autenticacao & Permissoes;
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Union Types:** Operação complementar (`|` vs `&`)
- **Interfaces:** `extends` é equivalente a intersection
- **Generics:** Constraints com intersection (`T extends A & B`)
- **Utility Types:** `Partial`, `Required`, etc. usam intersection
- **Mixins:** Pattern de composição com intersection

**Progressão:**
Tipos básicos → Intersection de tipos → Composição complexa → Mixins e traits

## 🚀 Evolução e Próximos Conceitos

**Após dominar intersection:**
- **Mapped Types:** Transformar tipos com intersection
- **Conditional Types:** `T extends A & B ? X : Y`
- **Mixins Avançados:** Composição de classes com intersection
- **Branded Types:** Intersection com tags nominais

## 📚 Conclusão

**Intersection types** permitem **composição de tipos** através do operador `&`, criando tipos que **agregam todas as propriedades** de tipos combinados. São fundamentais para mixins, extensão de tipos e composição horizontal de capacidades.

**Conceitos Fundamentais:**
1. **Operador `&`:** Combina tipos em interseção
2. **"E" Lógico:** Valor deve satisfazer TODOS os tipos
3. **Agregação:** Resultado tem todas as propriedades
4. **Primitivos Diferentes:** Resultam em `never`
5. **Objetos:** Agregam propriedades sensatamente
6. **Conflitos:** Propriedades incompatíveis = `never`

**Intersection = composição de tipos + mixins + agregação de capacidades.**
