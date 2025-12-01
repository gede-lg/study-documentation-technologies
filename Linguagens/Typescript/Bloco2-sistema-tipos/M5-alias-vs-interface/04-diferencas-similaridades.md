# Diferenças e Similaridades: Type Alias vs. Interface

## 🎯 Introdução e Definição

Diferenças e similaridades entre type alias e interface representam **espectro de capacidades sobrepostas e exclusivas**: ambos podem descrever shapes de objetos (similaridade), mas cada um tem **características únicas** que o tornam mais apropriado para certos cenários. Conceitualmente, representa **convergência parcial de funcionalidades**: TypeScript evoluiu para que interface e type alias tenham **muita sobreposição** em casos comuns, mas **distinções fundamentais** permanecem em casos avançados. Compreender essas nuances é essencial para escolha informada.

## 📋 Sumário Conceitual

**Similaridades:**
1. Ambos descrevem shapes de objetos
2. Ambos suportam generics
3. Ambos suportam extends/intersection
4. Ambos podem ter propriedades opcionais/readonly
5. Ambos funcionam com `implements`

**Diferenças:**
1. Declaration merging (interface) vs. não (type)
2. Extends (interface) vs. intersection (type)
3. Union/intersection só em type
4. Mapped/conditional types só em type
5. `implements` mais idiomático com interface

**Conceito Central:** Grande sobreposição + diferenças específicas = escolha baseada em necessidade.

## 🧠 Tabela Comparativa

| Característica | Interface | Type Alias | Notas |
|----------------|-----------|------------|-------|
| **Básico** |
| Descrever objetos | ✅ | ✅ | Ambos funcionam |
| Propriedades opcionais | ✅ | ✅ | Sintaxe `?` |
| Propriedades readonly | ✅ | ✅ | Sintaxe `readonly` |
| Métodos | ✅ | ✅ | Ambos suportam |
| Index signatures | ✅ | ✅ | `[key: string]: Type` |
| **Generics** |
| Tipos parametrizados | ✅ | ✅ | `<T>` em ambos |
| Constraints | ✅ | ✅ | `<T extends Type>` |
| **Extensão** |
| Extends | ✅ | ❌ | `interface A extends B` |
| Intersection | ⚠️ | ✅ | Interface via `extends`, Type via `&` |
| Herança múltipla | ✅ | ✅ | Interface: `extends A, B`; Type: `A & B` |
| **Composição** |
| Union types | ❌ | ✅ | Apenas type: `A | B` |
| Intersection types | ⚠️ | ✅ | Type mais direto: `A & B` |
| Tuple types | ❌ | ✅ | Apenas type: `[string, number]` |
| **Avançado** |
| Declaration merging | ✅ | ❌ | Apenas interface |
| Mapped types | ❌ | ✅ | Apenas type |
| Conditional types | ❌ | ✅ | Apenas type |
| Template literals | ❌ | ✅ | Apenas type |
| **OOP** |
| `implements` | ✅ | ✅ | Ambos, mas interface mais idiomático |
| Classes | ✅ | ✅ | Ambos funcionam |
| **Outros** |
| Primitivos | ❌ | ✅ | Type: `type Id = number` |
| Function types | ⚠️ | ✅ | Interface requer object shape |
| Computed properties | ✅ | ✅ | `[K in keyof T]` |

## 🔍 Diferenças Detalhadas

### 1. Declaration Merging

**Interface (Funde):**
```typescript
interface Usuario {
  nome: string;
}

interface Usuario {
  email: string;
}

// Fusão automática:
// interface Usuario {
//   nome: string;
//   email: string;
// }

const u: Usuario = {
  nome: "João",
  email: "joao@exemplo.com"
};
```

**Type Alias (Erro):**
```typescript
type Usuario = {
  nome: string;
};

// ERRO: Duplicate identifier 'Usuario'
type Usuario = {
  email: string;
};
```

**Implicação:** Interface é **extensível** por natureza; Type é **sealed**.

### 2. Syntax de Extensão

**Interface (`extends`):**
```typescript
interface Animal {
  nome: string;
}

interface Cachorro extends Animal {
  raca: string;
}
// Cachorro = { nome, raca }
```

**Type Alias (Intersection `&`):**
```typescript
type Animal = {
  nome: string;
};

type Cachorro = Animal & {
  raca: string;
};
// Cachorro = { nome, raca }
```

**Resultado:** Equivalente para objetos, mas sintaxe difere.

### 3. Union Types

**Type Alias (Suporta):**
```typescript
type Id = string | number;
type Resultado = Sucesso | Erro;
type Status = "ativo" | "inativo";
```

**Interface (Não Suporta):**
```typescript
// ERRO: Interface cannot be union
// interface Id = string | number;
```

**Implicação:** Unions **exclusivo de type alias**.

### 4. Mapped Types

**Type Alias (Suporta):**
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

**Interface (Não Suporta):**
```typescript
// ERRO: Mapped types não funcionam em interfaces
// interface Readonly<T> = {
//   readonly [P in keyof T]: T[P];
// };
```

**Implicação:** Mapped types **exclusivo de type alias**.

### 5. Conditional Types

**Type Alias (Suporta):**
```typescript
type IsString<T> = T extends string ? true : false;
type NonNullable<T> = T extends null | undefined ? never : T;
```

**Interface (Não Suporta):**
```typescript
// ERRO: Conditional types não funcionam em interfaces
```

**Implicação:** Conditional types **exclusivo de type alias**.

### 6. Tuples

**Type Alias (Natural):**
```typescript
type Coordenada = [number, number];
type RGB = [number, number, number];
```

**Interface (Verbose):**
```typescript
// Possível mas não idiomático
interface Coordenada extends Array<number> {
  0: number;
  1: number;
  length: 2;
}
```

**Implicação:** Tuples **muito mais natural com type alias**.

### 7. Primitivos

**Type Alias (Suporta):**
```typescript
type Id = number;
type Nome = string;
```

**Interface (Não Suporta):**
```typescript
// ERRO: Interface só descreve objetos
// interface Id = number;
```

### 8. Function Types

**Type Alias (Direto):**
```typescript
type Operacao = (a: number, b: number) => number;
type Callback = (erro: Error | null, dados?: any) => void;
```

**Interface (Como Objeto Callable):**
```typescript
interface Operacao {
  (a: number, b: number): number;
}

const somar: Operacao = (a, b) => a + b;
```

**Diferença:** Type é mais conciso; Interface requer call signature.

## 🔍 Similaridades Detalhadas

### 1. Shapes de Objetos

**Ambos Equivalentes:**
```typescript
// Interface
interface Usuario {
  id: number;
  nome: string;
}

// Type
type Usuario = {
  id: number;
  nome: string;
};
```

### 2. Propriedades Opcionais e Readonly

**Ambos Equivalentes:**
```typescript
// Interface
interface Config {
  url: string;
  timeout?: number;
  readonly apiKey: string;
}

// Type
type Config = {
  url: string;
  timeout?: number;
  readonly apiKey: string;
};
```

### 3. Generics

**Ambos Equivalentes:**
```typescript
// Interface
interface Container<T> {
  valor: T;
  obter(): T;
}

// Type
type Container<T> = {
  valor: T;
  obter(): T;
};
```

### 4. Implements

**Ambos Funcionam:**
```typescript
// Interface
interface Logger {
  log(msg: string): void;
}

class ConsoleLogger implements Logger {
  log(msg: string) { console.log(msg); }
}

// Type
type Logger = {
  log(msg: string): void;
};

class ConsoleLogger implements Logger {
  log(msg: string) { console.log(msg); }
}
```

**Nota:** Interface é mais idiomático para `implements`.

### 5. Index Signatures

**Ambos Equivalentes:**
```typescript
// Interface
interface Dictionary {
  [key: string]: string;
}

// Type
type Dictionary = {
  [key: string]: string;
};
```

## 🎯 Performance e Comportamento

### Compilation

**Ambos:**
- Apagados em JavaScript transpilado (não existem em runtime)
- Zero overhead de runtime
- Apenas verificação em compile-time

### Type Checking Performance

**Interface:**
- Geralmente mais rápido para type checking
- Cacheada internamente pelo compilador
- Melhor para grandes codebases

**Type Alias:**
- Pode ser mais lento em casos complexos
- Não cacheada da mesma forma
- Diferença negligível em maioria dos casos

**Recomendação Microsoft:**
> "Prefer interfaces. Interfaces are faster to type-check in large codebases."

**Realidade:** Diferença raramente perceptível em aplicações normais.

## 🎯 Migração e Interoperabilidade

### Type Alias → Interface

**Possível para Objetos:**
```typescript
// Antes (Type)
type Usuario = {
  nome: string;
  email: string;
};

// Depois (Interface)
interface Usuario {
  nome: string;
  email: string;
}
```

**Impossível para Unions/Mapped/Conditional:**
```typescript
// Não pode migrar
type Id = string | number;  // Union
type Keys = keyof Usuario;  // keyof
```

### Interface → Type Alias

**Sempre Possível:**
```typescript
// Antes (Interface)
interface Usuario {
  nome: string;
}

// Depois (Type)
type Usuario = {
  nome: string;
};
```

**Mas perde declaration merging:**
```typescript
// Com interface - funde
interface Usuario { nome: string; }
interface Usuario { email: string; }  // OK

// Com type - erro
type Usuario = { nome: string; };
type Usuario = { email: string; };  // ERRO
```

## 📚 Conclusão

**Type alias e interface têm grande sobreposição** para shapes de objetos simples, mas **diferenças fundamentais** em casos avançados. Interface oferece **declaration merging** e é **idiomática para OOP**. Type alias é **necessária** para unions, mapped types, conditional types e tuples.

**Diferenças Chave:**
1. **Declaration Merging:** Só interface
2. **Unions:** Só type
3. **Mapped Types:** Só type
4. **Conditional Types:** Só type
5. **Tuples:** Type é natural
6. **Primitivos:** Só type

**Similaridades:**
1. Shapes de objetos
2. Generics
3. Propriedades opcionais/readonly
4. `implements`
5. Index signatures

**Use características como guia, não preferência arbitrária.**
