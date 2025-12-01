# Múltiplos Tipos em Intersection: Composição Avançada

## 🎯 Introdução e Definição

Intersection de múltiplos tipos é **combinação de três ou mais tipos** através de operadores `&` encadeados, criando tipo que **agrega todas as propriedades e características de todos os tipos participantes**. Conceitualmente, representa **composição modular progressiva**: construir tipos complexos combinando incrementalmente capacidades específicas de tipos menores e focados. Múltiplas intersections são fundação para **arquiteturas baseadas em traits**, sistemas de mixins e composição horizontal de funcionalidades.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Encadeamento:** `A & B & C & D & ...`
2. **Associatividade:** `(A & B) & C` = `A & (B & C)`
3. **Agregação Progressiva:** Cada `&` adiciona propriedades
4. **Traits/Mixins:** Padrão de composição horizontal
5. **Type Explosion:** Cuidado com tipos muito grandes
6. **Ordem:** Não importa para resultado, mas afeta legibilidade

**Conceito Central:** Múltiplas intersections = **construção modular** de tipos complexos a partir de blocos focados.

## 🧠 Fundamentos Teóricos

### Sintaxe e Associatividade

**Encadeamento Simples:**
```typescript
type A = { a: string };
type B = { b: number };
type C = { c: boolean };

type ABC = A & B & C;
// ABC = { a: string; b: number; c: boolean }
```

**Associatividade:**
```typescript
type ABC1 = (A & B) & C;
type ABC2 = A & (B & C);
type ABC3 = A & B & C;

// Todos são idênticos - ordem de avaliação não importa
```

**Conceito:** Intersection é **associativa** - parênteses não afetam resultado.

### Agregação Progressiva

**Building Up:**
```typescript
type Base = { id: number };
type ComNome = Base & { nome: string };
type ComEmail = ComNome & { email: string };
type ComSenha = ComEmail & { senha: string };

// ComSenha = { id: number; nome: string; email: string; senha: string }
```

**Conceito:** Cada intersection **adiciona propriedades** ao tipo acumulado.

### Múltiplos Tipos com Propriedades Independentes

**Traits Independentes:**
```typescript
type Identificavel = { id: number };
type Nomeavel = { nome: string };
type Timestampavel = { criadoEm: Date; atualizadoEm: Date };
type Ativavel = { ativo: boolean };
type Descritivel = { descricao: string };

type Entidade = Identificavel
  & Nomeavel
  & Timestampavel
  & Ativavel
  & Descritivel;

// Entidade = {
//   id: number;
//   nome: string;
//   criadoEm: Date;
//   atualizadoEm: Date;
//   ativo: boolean;
//   descricao: string;
// }
```

**Vantagem:** Cada trait é **independente e reutilizável**.

## 🔍 Traits e Mixins Pattern

### Traits Conceituais

**Definição:** Trait é tipo pequeno e focado que adiciona **capacidade específica**.

**Biblioteca de Traits:**
```typescript
// traits/identifiable.ts
export type Identifiable = {
  id: number;
};

// traits/timestamped.ts
export type Timestamped = {
  criadoEm: Date;
  atualizadoEm: Date;
};

// traits/auditable.ts
export type Auditable = {
  criadoPor: number;
  atualizadoPor: number;
};

// traits/softDeletable.ts
export type SoftDeletable = {
  deletadoEm: Date | null;
  restaurar(): void;
};

// traits/validatable.ts
export type Validatable = {
  validar(): boolean;
  erros: string[];
};

// traits/serializable.ts
export type Serializable = {
  toJSON(): object;
  fromJSON(data: object): void;
};
```

**Composição:**
```typescript
import { Identifiable, Timestamped, Auditable, SoftDeletable } from "./traits";

type Usuario = Identifiable
  & Timestamped
  & Auditable
  & SoftDeletable
  & {
    nome: string;
    email: string;
  };

type Produto = Identifiable
  & Timestamped
  & {
    nome: string;
    preco: number;
    estoque: number;
  };
```

**Conceito:** Compor tipos **selecionando traits necessários** para cada domínio.

### Mixins de Comportamento

**Comportamentos Reutilizáveis:**
```typescript
type Loggable = {
  log(mensagem: string): void;
  logError(erro: Error): void;
};

type Cacheable = {
  cache: Map<string, any>;
  getCached(key: string): any;
  setCached(key: string, valor: any): void;
  clearCache(): void;
};

type EventEmitter = {
  eventos: Map<string, Function[]>;
  on(evento: string, handler: Function): void;
  emit(evento: string, ...args: any[]): void;
};

type Configurable = {
  config: Record<string, any>;
  getConfig(key: string): any;
  setConfig(key: string, valor: any): void;
};

// Componente com múltiplos comportamentos
type ComponenteCompleto = {
  render(): void;
} & Loggable
  & Cacheable
  & EventEmitter
  & Configurable;
```

### Camadas de Abstração

**Progressão de Complexidade:**
```typescript
// Camada 1: Dados básicos
type DadosBase = {
  id: number;
  nome: string;
};

// Camada 2: Metadados
type ComMetadados = DadosBase & {
  versao: number;
  checksum: string;
};

// Camada 3: Ciclo de vida
type ComCicloVida = ComMetadados & {
  criadoEm: Date;
  atualizadoEm: Date;
  deletadoEm: Date | null;
};

// Camada 4: Auditoria
type ComAuditoria = ComCicloVida & {
  criadoPor: number;
  atualizadoPor: number;
  historicoMudancas: Array<{
    data: Date;
    usuario: number;
    campo: string;
    valorAnterior: any;
    valorNovo: any;
  }>;
};

// Camada 5: Comportamentos
type EntidadeCompleta = ComAuditoria & {
  validar(): boolean;
  salvar(): Promise<void>;
  deletar(): Promise<void>;
};
```

**Conceito:** Construir **hierarquia de capacidades** progressivamente.

## 🎯 Padrões de Composição Avançados

### Composição Condicional

**Helper Types:**
```typescript
type MaybeTimestamped<T, WithTimestamp extends boolean> =
  WithTimestamp extends true
    ? T & { criadoEm: Date; atualizadoEm: Date }
    : T;

type Usuario = { nome: string; email: string };

type UsuarioComTimestamp = MaybeTimestamped<Usuario, true>;
// { nome: string; email: string; criadoEm: Date; atualizadoEm: Date }

type UsuarioSemTimestamp = MaybeTimestamped<Usuario, false>;
// { nome: string; email: string }
```

### Composição com Generics

**Wrapper Genérico:**
```typescript
type WithMetadata<T> = T & {
  _metadata: {
    versao: number;
    fonte: string;
    timestamp: Date;
  };
};

type WithPagination<T> = T & {
  paginacao: {
    pagina: number;
    porPagina: number;
    total: number;
  };
};

type WithStatus<T> = T & {
  status: "ativo" | "inativo" | "arquivado";
};

// Compor múltiplos wrappers
type Resposta<T> = WithMetadata<WithPagination<WithStatus<T>>>;

type ListaUsuarios = Resposta<{ usuarios: Usuario[] }>;
// ListaUsuarios = {
//   usuarios: Usuario[];
//   status: "ativo" | "inativo" | "arquivado";
//   paginacao: { ... };
//   _metadata: { ... };
// }
```

### Factory de Tipos

**Construtor Modular:**
```typescript
type BuildEntity<
  TData,
  WithId extends boolean = true,
  WithTimestamp extends boolean = true,
  WithAudit extends boolean = false
> = TData
  & (WithId extends true ? { id: number } : {})
  & (WithTimestamp extends true ? { criadoEm: Date; atualizadoEm: Date } : {})
  & (WithAudit extends true ? { criadoPor: number; atualizadoPor: number } : {});

type Produto = BuildEntity<
  { nome: string; preco: number },
  true,  // Com ID
  true,  // Com timestamp
  false  // Sem auditoria
>;

type Usuario = BuildEntity<
  { nome: string; email: string },
  true,  // Com ID
  true,  // Com timestamp
  true   // Com auditoria
>;
```

## 🎯 Aplicabilidade

### Arquitetura de Domínio

**Domain-Driven Design:**
```typescript
// Core domain
type Entidade = {
  id: number;
};

type ValueObject = {
  equals(other: any): boolean;
};

type Agregado = Entidade & {
  versao: number;
};

// Specific domains
type Pedido = Agregado & {
  cliente: Cliente;
  itens: ItemPedido[];
  total: number;
  status: StatusPedido;
};

type Cliente = Entidade & {
  nome: string;
  email: string;
  endereco: Endereco;
};
```

### API Response Types

**Envelopes de Resposta:**
```typescript
type Success<T> = {
  sucesso: true;
  dados: T;
};

type Error = {
  sucesso: false;
  erro: {
    codigo: string;
    mensagem: string;
  };
};

type WithPagination = {
  paginacao: {
    pagina: number;
    total: number;
  };
};

type WithMeta = {
  meta: {
    timestamp: Date;
    versaoAPI: string;
  };
};

// Composição para diferentes endpoints
type RespostaPaginada<T> = (Success<T> | Error) & WithPagination & WithMeta;
type RespostaSimples<T> = (Success<T> | Error) & WithMeta;
```

### Plugin System

**Extensões Modulares:**
```typescript
type PluginCore = {
  nome: string;
  versao: string;
};

type PluginWithConfig = {
  config: Record<string, any>;
  configure(config: Record<string, any>): void;
};

type PluginWithLifecycle = {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
};

type PluginWithHooks = {
  hooks: Map<string, Function[]>;
  registerHook(nome: string, handler: Function): void;
};

// Plugin completo
type Plugin = PluginCore
  & PluginWithConfig
  & PluginWithLifecycle
  & PluginWithHooks;

// Plugin simples (sem lifecycle)
type SimplePlugin = PluginCore & PluginWithConfig;
```

## ⚠️ Armadilhas Comuns

### 1. Type Explosion (Tipos Muito Grandes)

```typescript
// ❌ Tipo gigante difícil de entender
type Monster = A & B & C & D & E & F & G & H & I & J & K & L;

// ✅ Agrupar em níveis
type Base = A & B & C;
type Extended = Base & D & E & F;
type Full = Extended & G & H & I;
```

### 2. Conflitos de Propriedades

```typescript
type A = { id: string };
type B = { id: number };
type C = { nome: string };

type ABC = A & B & C;
// ABC = { id: never; nome: string } - id é impossível
```

**Solução:** Renomear ou usar tipos compatíveis.

### 3. Ordem de Legibilidade

```typescript
// ❌ Ordem confusa
type Usuario = Email & Nome & Comportamento & Timestamp & Id;

// ✅ Ordem lógica (dados antes de comportamentos)
type Usuario = Id & Nome & Email & Timestamp & Comportamento;
```

### 4. Esquec er que Intersection Não É Union

```typescript
// Intersection: precisa de TODAS
type Inter = { a: string } & { b: number };
const inter: Inter = { a: "x", b: 1 };  // Ambas obrigatórias

// Union: precisa de UMA
type Union = { a: string } | { b: number };
const union: Union = { a: "x" };  // Apenas uma OK
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Single Intersection:** Base para múltiplas
- **Union Types:** Operação complementar
- **Generics:** Compor com parâmetros de tipo
- **Utility Types:** `Partial<A & B & C>`
- **Mixins de Classes:** Implementação runtime

**Progressão:**
Tipos simples → Intersection dupla → Múltiplas intersections → Composição avançada → Sistemas de traits

## 📚 Conclusão

**Múltiplas intersections** permitem **composição modular** de tipos complexos combinando blocos focados e reutilizáveis. São fundação para **arquiteturas baseadas em traits**, sistemas de plugins e composição horizontal de capacidades.

**Conceitos Fundamentais:**
1. **Encadeamento:** `A & B & C & ...` agrega todas as propriedades
2. **Associatividade:** Ordem de avaliação não importa
3. **Traits Pattern:** Tipos pequenos e focados componíveis
4. **Mixins:** Comportamentos reutilizáveis
5. **Composição Progressiva:** Construir complexidade incrementalmente
6. **Modularidade:** Separar concerns em tipos independentes

**Múltiplas intersections = arquitetura modular + reutilização + composição flexível.**
