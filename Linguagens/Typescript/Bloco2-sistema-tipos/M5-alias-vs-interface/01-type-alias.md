# Type Alias: Nomeando Tipos com `type`

## 🎯 Introdução e Definição

Type alias é **declaração que atribui nome a qualquer tipo TypeScript** através da palavra-chave `type`, criando **referência reutilizável** para tipos complexos, unions, intersections, primitivos ou estruturas de objetos. Conceitualmente, representa **abstração nominal sobre tipos estruturais**: em vez de repetir `{ nome: string; idade: number }` múltiplas vezes, cria-se alias `Pessoa` que referencia essa estrutura. Type aliases são fundamentais para **DRY (Don't Repeat Yourself)**, documentação de tipos, composição de tipos complexos e abstração de implementação.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Palavra-chave `type`:** Define alias para tipos
2. **Qualquer Tipo:** Primitivos, objetos, unions, intersections, etc.
3. **Estrutural, Não Nominal:** Type alias não cria novo tipo, apenas nomeia existente
4. **Não Extensível:** Declarações não fundem (diferente de interfaces)
5. **Composição:** Trabalha com unions (`|`) e intersections (`&`)
6. **Genéricos:** Suporta parâmetros de tipo

**Conceito Central:** Type alias = **nome para tipo** - abstração que torna código mais legível e manutenível.

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

**Declaração:**
```typescript
type NomeDoTipo = TipoQualquer;
```

**Primitivos:**
```typescript
type Id = number;
type Nome = string;
type Ativo = boolean;

let userId: Id = 123;
let userName: Nome = "João";
let isActive: Ativo = true;
```

**Objetos:**
```typescript
type Usuario = {
  id: number;
  nome: string;
  email: string;
};

const usuario: Usuario = {
  id: 1,
  nome: "Maria",
  email: "maria@exemplo.com"
};
```

**Conceito:** Type alias **não cria novo tipo**, apenas **nomeia tipo existente**.

### Type Alias vs. Valor Real

**Equivalência Estrutural:**
```typescript
type Ponto = { x: number; y: number };

const p1: Ponto = { x: 10, y: 20 };

// Estruturalmente idêntico - TypeScript aceita
const p2: { x: number; y: number } = { x: 10, y: 20 };

function processar(ponto: Ponto) { }

processar(p1);  // OK
processar(p2);  // OK - tipo estrutural compatível
```

**Conceito:** TypeScript usa **compatibilidade estrutural**, não nominal - alias é apenas nome conveniente.

### Unions com Type Alias

**Union Types:**
```typescript
type Id = string | number;
type Status = "ativo" | "inativo" | "pendente";
type Resultado = Sucesso | Erro;

let id: Id = 123;        // OK
id = "abc-123";          // OK

let status: Status = "ativo";  // OK
```

**Conceito:** Type alias pode nomear **qualquer tipo**, incluindo unions.

### Intersections com Type Alias

**Intersection Types:**
```typescript
type Identificavel = { id: number };
type Nomeavel = { nome: string };

type Pessoa = Identificavel & Nomeavel;
// Pessoa = { id: number; nome: string }

const pessoa: Pessoa = {
  id: 1,
  nome: "João"
};
```

### Tuples e Arrays

**Tuples:**
```typescript
type Coordenada = [number, number];
type RGBColor = [number, number, number];

const ponto: Coordenada = [10, 20];
const vermelho: RGBColor = [255, 0, 0];
```

**Arrays:**
```typescript
type Numeros = number[];
type Usuarios = Array<Usuario>;

const lista: Numeros = [1, 2, 3];
```

### Functions com Type Alias

**Function Types:**
```typescript
type Operacao = (a: number, b: number) => number;

const somar: Operacao = (a, b) => a + b;
const subtrair: Operacao = (a, b) => a - b;
```

**Callbacks:**
```typescript
type Callback<T> = (erro: Error | null, resultado?: T) => void;

type EventHandler = (evento: Event) => void;
```

## 🔍 Análise Conceitual Profunda

### Generics em Type Alias

**Tipos Parametrizados:**
```typescript
type Container<T> = {
  valor: T;
  obter(): T;
  definir(novoValor: T): void;
};

const numeroContainer: Container<number> = {
  valor: 42,
  obter() { return this.valor; },
  definir(novoValor) { this.valor = novoValor; }
};

const stringContainer: Container<string> = {
  valor: "olá",
  obter() { return this.valor; },
  definir(novoValor) { this.valor = novoValor; }
};
```

**Múltiplos Parâmetros:**
```typescript
type Mapa<K, V> = {
  chave: K;
  valor: V;
};

type Par<A, B> = [A, B];

const idade: Mapa<string, number> = { chave: "idade", valor: 30 };
const coordenada: Par<number, number> = [10, 20];
```

**Constraints:**
```typescript
type ComprimentoMinimo<T extends { length: number }> = {
  item: T;
  tamanho: number;
};

const texto: ComprimentoMinimo<string> = {
  item: "olá",
  tamanho: 3
};

const array: ComprimentoMinimo<number[]> = {
  item: [1, 2, 3],
  tamanho: 3
};
```

### Mapped Types

**Transformação de Tipos:**
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Usuario = {
  nome: string;
  idade: number;
};

type UsuarioReadonly = Readonly<Usuario>;
// { readonly nome: string; readonly idade: number }

type UsuarioParcial = Partial<Usuario>;
// { nome?: string; idade?: number }
```

### Conditional Types

**Tipos Condicionais:**
```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;   // true
type B = IsString<number>;   // false

type NonNullable<T> = T extends null | undefined ? never : T;

type C = NonNullable<string | null>;  // string
```

### Template Literal Types

**String Patterns:**
```typescript
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// EventHandler = "onClick" | "onFocus" | "onBlur"

type HttpMethod = "GET" | "POST";
type Endpoint = "users" | "products";
type Route = `/${Endpoint}`;
// Route = "/users" | "/products"
```

### Index Signatures

**Propriedades Dinâmicas:**
```typescript
type Dictionary<T> = {
  [key: string]: T;
};

type StringDictionary = Dictionary<string>;
type NumberDictionary = Dictionary<number>;

const config: StringDictionary = {
  url: "https://api.com",
  timeout: "5000"
};
```

## 🎯 Aplicabilidade

### Quando Usar Type Alias

**1. Nomear Union Types:**
```typescript
type Id = string | number;
type Status = "ativo" | "inativo" | "pendente";
type Resposta = Sucesso | Erro;
```

**2. Nomear Intersection Types:**
```typescript
type UsuarioCompleto = Usuario & Autenticacao & Permissoes;
```

**3. Tipos Complexos:**
```typescript
type ConfigAPI = {
  url: string;
  timeout: number;
  retry: {
    maxTentativas: number;
    delay: number;
  };
  headers: Record<string, string>;
};
```

**4. Function Types:**
```typescript
type Middleware = (req: Request, res: Response, next: NextFunction) => void;
type Validator<T> = (valor: T) => boolean;
```

**5. Utility Types Customizados:**
```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### Padrões Comuns

**API Response Types:**
```typescript
type ApiResponse<T> = {
  dados: T;
  meta: {
    timestamp: Date;
    versao: string;
  };
};

type ErrorResponse = {
  erro: {
    codigo: string;
    mensagem: string;
    detalhes?: any;
  };
};

type Response<T> = ApiResponse<T> | ErrorResponse;
```

**Domain Models:**
```typescript
type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
};

type Perfil = {
  avatar?: string;
  bio?: string;
  redesSociais: RedeSocial[];
};

type RedeSocial = {
  plataforma: "twitter" | "linkedin" | "github";
  url: string;
};
```

**State Management:**
```typescript
type Estado = {
  usuario: Usuario | null;
  carregando: boolean;
  erro: string | null;
};

type Acao =
  | { tipo: "LOGIN_SUCESSO"; usuario: Usuario }
  | { tipo: "LOGIN_ERRO"; erro: string }
  | { tipo: "LOGOUT" };
```

## 🎯 Padrões Recomendados

### Nomenclatura

```typescript
// ✅ PascalCase para type aliases
type Usuario = { };
type ConfigAPI = { };
type HttpResponse = { };

// ❌ Evitar camelCase
type usuario = { };
type configAPI = { };
```

### Documentação

```typescript
/**
 * Representa um usuário do sistema
 * @property id - Identificador único
 * @property nome - Nome completo
 * @property email - Email para contato
 */
type Usuario = {
  id: number;
  nome: string;
  email: string;
};
```

### Organização em Arquivos

```typescript
// types/usuario.ts
export type Usuario = {
  id: number;
  nome: string;
};

export type UsuarioComPermissoes = Usuario & {
  permissoes: string[];
};

// types/api.ts
export type ApiResponse<T> = {
  dados: T;
  sucesso: boolean;
};
```

## ⚠️ Armadilhas Comuns

### 1. Não Pode Redeclarar

```typescript
type Usuario = { nome: string };
type Usuario = { idade: number };  // ERRO: Duplicate identifier
```

**Diferença de Interface:** Interfaces fundem; types não.

### 2. Não Pode ser Extends/Implements Diretamente

```typescript
type Base = { id: number };

// ❌ Classe não pode implements type diretamente (mas funciona na prática)
class Usuario implements Base { }  // OK na prática, mas menos idiomático

// ✅ Preferir interface para implements
interface IBase { id: number }
class Usuario implements IBase { }
```

### 3. Confusion com `typeof`

```typescript
const config = {
  url: "https://api.com",
  timeout: 5000
};

// Extrair tipo do valor
type Config = typeof config;
// Config = { url: string; timeout: number }
```

### 4. Circular References

```typescript
// ❌ Pode causar problemas
type Node = {
  valor: number;
  proximo: Node;  // Referência circular
};

// ✅ Usar com cuidado
type Node = {
  valor: number;
  proximo?: Node;  // Opcional para terminar recursão
};
```

## 🔗 Interconexões Conceituais

**Relacionado a:**
- **Interface:** Alternativa para objetos e classes
- **Union Types:** Type alias nomeia unions
- **Intersection Types:** Type alias nomeia intersections
- **Generics:** Type alias pode ser genérico
- **Utility Types:** Built-in type aliases como `Partial`, `Readonly`

**Progressão:**
Tipos inline → Type alias → Generics → Mapped types → Conditional types

## 🚀 Evolução e Próximos Conceitos

**Após dominar type alias:**
- **Interfaces:** Quando preferir interface
- **Mapped Types:** Transformações avançadas
- **Conditional Types:** Lógica em tipos
- **Template Literal Types:** Manipulação de strings
- **Utility Types:** Biblioteca padrão de type aliases

## 📚 Conclusão

**Type alias** é ferramenta fundamental para **nomear e reutilizar tipos** em TypeScript. Através da palavra-chave `type`, pode-se criar referências para **qualquer tipo** - primitivos, objetos, unions, intersections, functions, generics. Type aliases tornam código **mais legível, manutenível e DRY**.

**Conceitos Fundamentais:**
1. **`type NomeTipo = Tipo`:** Sintaxe básica
2. **Estrutural:** Não cria novo tipo, apenas nomeia
3. **Qualquer Tipo:** Primitivos, objetos, unions, etc.
4. **Não Funde:** Declarações múltiplas são erro
5. **Genéricos:** Suporta parâmetros de tipo
6. **Composição:** Trabalha com `|` e `&`

**Type alias = abstração nominal + reutilização + documentação de tipos.**
