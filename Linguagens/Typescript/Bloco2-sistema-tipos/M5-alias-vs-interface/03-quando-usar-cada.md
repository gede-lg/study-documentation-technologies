# Quando Usar Type Alias vs. Interface: Guia de Decisão

## 🎯 Introdução e Definição

Escolha entre type alias e interface é **decisão arquitetural** baseada em **natureza do tipo, uso pretendido e características necessárias**. Embora ambos possam descrever shapes de objetos, cada um tem **pontos fortes específicos**: interfaces são ideais para **contratos extensíveis** e orientação a objetos; type aliases brilham em **composição de tipos** (unions, intersections) e tipos complexos. Conceitualmente, representa **trade-off entre extensibilidade e expressividade**: interfaces priorizam extensão e declaração merging; type aliases priorizam flexibilidade e composição.

## 📋 Sumário Conceitual

**Aspectos Centrais:**
1. **Interface:** Contratos extensíveis, OOP, declaration merging
2. **Type Alias:** Composição, unions, intersections, tipos complexos
3. **Overlap:** Ambos descrevem shapes de objetos
4. **Casos Claros:** Alguns cenários favorecem um sobre outro
5. **Preferências:** Comunidade e style guides influenciam escolha
6. **Hybrid Approach:** Possível usar ambos no mesmo projeto

**Conceito Central:** Escolha depende de **características necessárias** e **contexto de uso**.

## 🧠 Matriz de Decisão

### Decision Tree

```
Preciso definir...
├─ Union ou Intersection?
│  └─ Use TYPE ALIAS
│     Exemplo: type Id = string | number
│
├─ Tipo para ser implementado por classe?
│  └─ Use INTERFACE
│     Exemplo: class Usuario implements IUsuario
│
├─ Tipo que pode ser estendido por bibliotecas?
│  └─ Use INTERFACE (declaration merging)
│     Exemplo: interface Window { minhaAPI: API }
│
├─ Tipo complexo (mapped, conditional, template literal)?
│  └─ Use TYPE ALIAS
│     Exemplo: type Readonly<T> = { readonly [P in keyof T]: T[P] }
│
├─ Shape de objeto simples?
│  └─ AMBOS funcionam (preferência por INTERFACE por convenção)
│     Exemplo: interface Usuario { nome: string }
│
└─ Tuple, primitive, function type?
   └─ Use TYPE ALIAS
      Exemplo: type Coordenada = [number, number]
```

## 🔍 Use Interface Quando

### 1. Definir Contratos de Classe

**Cenário:** Classes implementarão o tipo.

```typescript
// ✅ Interface - idiomático para implements
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}

class UsuarioRepository implements Repository<Usuario> {
  async findById(id: number) { /* ... */ }
  async save(entity: Usuario) { /* ... */ }
}
```

**Por quê:** `implements` é semanticamente associado a interfaces.

### 2. APIs Públicas que Podem Ser Estendidas

**Cenário:** Bibliotecas ou frameworks que usuários podem estender.

```typescript
// ✅ Interface - permite declaration merging
interface PluginAPI {
  versao: string;
  registrar(plugin: Plugin): void;
}

// Usuários podem estender
declare module "minha-lib" {
  interface PluginAPI {
    novoMetodo(): void;
  }
}
```

**Por quê:** Declaration merging permite extensão sem modificar código original.

### 3. Herança Hierárquica

**Cenário:** Estruturas com herança clara e natural.

```typescript
// ✅ Interface - extends é mais expressivo
interface Animal {
  nome: string;
  idade: number;
}

interface Mamifero extends Animal {
  gestacao: number;
}

interface Cachorro extends Mamifero {
  raca: string;
}
```

**Por quê:** `extends` comunica claramente hierarquia de herança.

### 4. Shapes de Objetos Simples (Convenção)

**Cenário:** Objetos de domínio, DTOs, modelos.

```typescript
// ✅ Interface - convenção da comunidade
interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}
```

**Por quê:** Convenção TypeScript prefere interface para objetos puros.

## 🔍 Use Type Alias Quando

### 1. Union Types

**Cenário:** Tipo pode ser uma de múltiplas opções.

```typescript
// ✅ Type alias - interfaces não suportam unions
type Id = string | number;
type Status = "ativo" | "inativo" | "pendente";
type Resultado = Sucesso | Erro;
```

**Por quê:** Interfaces não podem descrever unions.

### 2. Intersection Types

**Cenário:** Combinar múltiplos tipos.

```typescript
// ✅ Type alias - mais direto que extends
type UsuarioCompleto = Usuario & Autenticacao & Permissoes;
type MergeTwoTypes = TypeA & TypeB;
```

**Por quê:** `&` é mais conciso que criar interface intermediária.

### 3. Tuples

**Cenário:** Arrays de comprimento e tipos fixos.

```typescript
// ✅ Type alias - interfaces não expressam tuples naturalmente
type Coordenada = [number, number];
type RGBColor = [number, number, number];
type Resultado = [boolean, string];
```

**Por quê:** Sintaxe de tuple é incompatível com interfaces.

### 4. Primitivos e Function Types

**Cenário:** Alias para tipos primitivos ou funções.

```typescript
// ✅ Type alias - interfaces só descrevem objetos
type Id = number;
type Nome = string;
type Callback = (erro: Error | null, dados?: any) => void;
type Operacao = (a: number, b: number) => number;
```

**Por quê:** Interfaces não podem ser primitivos ou function types puros.

### 5. Mapped Types

**Cenário:** Transformações de tipos.

```typescript
// ✅ Type alias - mapped types são exclusivos de types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Keys<T> = keyof T;
```

**Por quê:** Mapped types só funcionam com type aliases.

### 6. Conditional Types

**Cenário:** Tipos com lógica condicional.

```typescript
// ✅ Type alias - conditional types exclusivos de types
type IsString<T> = T extends string ? true : false;
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

**Por quê:** Conditional types só funcionam com type aliases.

### 7. Template Literal Types

**Cenário:** Tipos baseados em padrões de string.

```typescript
// ✅ Type alias - template literals exclusivos de types
type EventName = "click" | "focus";
type EventHandler = `on${Capitalize<EventName>}`;
// EventHandler = "onClick" | "onFocus"

type Route = `/${string}`;
```

**Por quê:** Template literal types só funcionam com type aliases.

## 🎯 Casos de Sobreposição

### Shapes de Objetos: Ambos Funcionam

**Com Interface:**
```typescript
interface Usuario {
  id: number;
  nome: string;
  email: string;
}
```

**Com Type Alias:**
```typescript
type Usuario = {
  id: number;
  nome: string;
  email: string;
};
```

**Preferência:** **Interface por convenção**, mas ambos são válidos.

### Extensão: Abordagens Diferentes

**Com Interface (`extends`):**
```typescript
interface Base {
  id: number;
}

interface Usuario extends Base {
  nome: string;
}
```

**Com Type Alias (`&`):**
```typescript
type Base = {
  id: number;
};

type Usuario = Base & {
  nome: string;
};
```

**Preferência:** Interface para hierarquia clara; Type para composição ad-hoc.

## 🎯 Recomendações por Contexto

### Bibliotecas Públicas

**Preferir Interface:**
- APIs públicas extensíveis
- Contratos que usuários implementam
- Tipos que podem precisar de declaration merging

```typescript
// ✅ Biblioteca pública
export interface PluginConfig {
  nome: string;
  versao: string;
}

export interface Plugin {
  config: PluginConfig;
  initialize(): Promise<void>;
}
```

### Código de Aplicação

**Misturar Conforme Necessário:**
- Interface para models/entities
- Type para estados, actions, unions
- Type para utility types

```typescript
// Domínio - Interface
interface Usuario {
  id: number;
  nome: string;
}

// Estado - Type (union)
type Estado = "carregando" | "sucesso" | "erro";

// Action - Type (discriminated union)
type Acao =
  | { tipo: "FETCH"; }
  | { tipo: "SUCCESS"; dados: Usuario[] }
  | { tipo: "ERROR"; erro: string };
```

### Utility Types Internos

**Type Alias:**
- Sempre use type para mapped/conditional types
- Composições complexas

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type Flatten<T> = T extends Array<infer U> ? U : T;
```

## 🎯 Guidelines de Style Guides

### Google TypeScript Style Guide

**Preferir Type Alias:**
> "Prefer type aliases over interfaces for simple object types."

**Razão:** Consistência e simplicidade.

### Microsoft TypeScript Handbook

**Preferir Interface:**
> "If you would like a heuristic, use interface until you need to use features from type."

**Razão:** Extensibilidade e declaration merging.

### Airbnb

**Preferir Interface para Objetos:**
> "Use interfaces for object shapes and type aliases for everything else."

**Razão:** Separação clara de concerns.

## 🎯 Checklist de Decisão

**Use INTERFACE se:**
- ☑ Será implementada por classes (`implements`)
- ☑ Pode ser estendida por outros (declaration merging)
- ☑ É shape de objeto simples (convenção)
- ☑ Tem hierarquia de herança clara
- ☑ É API pública de biblioteca

**Use TYPE ALIAS se:**
- ☑ É union type (`A | B`)
- ☑ É intersection type (`A & B`)
- ☑ É tuple (`[string, number]`)
- ☑ É primitivo nomeado (`type Id = number`)
- ☑ É function type (`type Fn = () => void`)
- ☑ Usa mapped types
- ☑ Usa conditional types
- ☑ Usa template literal types

**Ambos Funcionam se:**
- ⚪ É shape de objeto simples
- ⚪ Precisa de extensão (interface com `extends`, type com `&`)

## 📚 Conclusão

**Escolha entre interface e type alias** depende de **características necessárias** e **contexto**. Interface é ideal para **contratos OOP**, **extensibilidade** e **declaration merging**. Type alias é necessário para **unions**, **intersections**, **mapped types** e **tipos avançados**.

**Regras de Ouro:**
1. **Unions/Intersections:** Type alias
2. **Classes (`implements`):** Interface (idiomático)
3. **Declaration Merging:** Interface
4. **Mapped/Conditional Types:** Type alias
5. **Shapes Simples:** Interface (convenção) ou Type (funciona)
6. **Na Dúvida:** Interface para objetos, Type para tudo mais

**Ambos são ferramentas poderosas - use conforme necessidade, não dogma.**
