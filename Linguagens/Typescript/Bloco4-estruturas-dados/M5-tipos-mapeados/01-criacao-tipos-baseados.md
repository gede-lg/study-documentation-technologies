# Criação de Tipos Baseados em Outros em TypeScript: Mapped Types

## 🎯 Introdução

**Mapped Types** (Tipos Mapeados) permitem criar **novos tipos transformando sistematicamente** as propriedades de tipos existentes. São **metaprogramação em nível de tipo**, aplicando transformações a cada propriedade de um tipo fonte.

## 📋 Conceitos Fundamentais

### O Que São Mapped Types

```typescript
// Tipo fonte
type Usuario = {
  nome: string;
  idade: number;
  email: string;
};

// Mapped type: transforma todas propriedades em readonly
type UsuarioReadonly = {
  readonly [K in keyof Usuario]: Usuario[K];
};
// Resultado: { readonly nome: string; readonly idade: number; readonly email: string; }

// Mapped type: transforma todas propriedades em opcionais
type UsuarioPartial = {
  [K in keyof Usuario]?: Usuario[K];
};
// Resultado: { nome?: string; idade?: number; email?: string; }
```

### Sintaxe Fundamental

```typescript
type MappedType<T> = {
  [K in keyof T]: TransformacaoDoTipo;
};
```

**Componentes:**
- `[K in keyof T]`: Itera sobre cada chave de T
- `K`: Variável representando cada chave
- `keyof T`: Operador que extrai união de chaves
- `TransformacaoDoTipo`: Novo tipo para cada propriedade

## 🧠 Fundamentos Teóricos

### Mapeamento Como Transformação Funcional

Mapped types são **functores** no nível de tipo - aplicam função a cada elemento de uma estrutura:

```typescript
// Analogia com map em arrays:
// [1, 2, 3].map(x => x * 2) → [2, 4, 6]

// Em tipos:
type Dobrar<T> = {
  [K in keyof T]: [T[K], T[K]]; // "Dobra" cada tipo em tupla
};

type Original = { a: string; b: number };
type Dobrado = Dobrar<Original>;
// { a: [string, string]; b: [number, number] }
```

### Homomorphic Mapped Types

Mapped types que preservam modificadores (`readonly`, `?`) do tipo original são **homomórficos**:

```typescript
type Fonte = {
  readonly nome: string;
  idade?: number;
};

// Homomórfico: preserva readonly e ?
type Copia<T> = {
  [K in keyof T]: T[K];
};

type Resultado = Copia<Fonte>;
// { readonly nome: string; idade?: number } - modificadores preservados!
```

### Como TypeScript Processa Mapped Types

1. **Extração de chaves**: `keyof T` gera união de strings literais
2. **Iteração**: Para cada chave K na união
3. **Transformação**: Aplica transformação ao tipo `T[K]`
4. **Reconstrução**: Monta novo tipo objeto com propriedades transformadas

```typescript
type Processo<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};

type Fonte = { a: string; b: number; c: boolean };

// Passo 1: keyof Fonte → "a" | "b" | "c"
// Passo 2: Para K = "a": string extends string ? number : string → number
// Passo 3: Para K = "b": number extends string ? number : number → number
// Passo 4: Para K = "c": boolean extends string ? number : boolean → boolean
// Resultado: { a: number; b: number; c: boolean }
```

## 🔍 Análise Conceitual Profunda

### Utility Types Built-in

TypeScript inclui mapped types utilitários fundamentais:

#### Partial<T>

```typescript
// Definição interna
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Uso
type Usuario = { nome: string; idade: number };
type UsuarioParcial = Partial<Usuario>;
// { nome?: string; idade?: number }

// Aplicação: updates parciais
function atualizar(usuario: Usuario, updates: Partial<Usuario>) {
  return { ...usuario, ...updates };
}

atualizar({ nome: "Ana", idade: 25 }, { idade: 26 }); // ✅ OK
```

#### Required<T>

```typescript
// Definição interna
type Required<T> = {
  [K in keyof T]-?: T[K]; // -? remove opcionalidade
};

type Opcional = { nome?: string; idade?: number };
type Obrigatorio = Required<Opcional>;
// { nome: string; idade: number }
```

#### Readonly<T>

```typescript
// Definição interna
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Mutavel = { nome: string; idade: number };
type Imutavel = Readonly<Mutavel>;
// { readonly nome: string; readonly idade: number }
```

#### Record<K, T>

```typescript
// Definição interna
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

// Uso: criar objeto com chaves específicas
type Notas = Record<"matematica" | "portugues" | "historia", number>;
// { matematica: number; portugues: number; historia: number }

let notasAluno: Notas = {
  matematica: 9,
  portugues: 8,
  historia: 7
};
```

#### Pick<T, K>

```typescript
// Definição interna
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Usuario = { id: number; nome: string; email: string; senha: string };
type UsuarioPublico = Pick<Usuario, "id" | "nome">;
// { id: number; nome: string }
```

#### Omit<T, K>

```typescript
// Definição interna
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type Usuario = { id: number; nome: string; email: string; senha: string };
type SemSenha = Omit<Usuario, "senha">;
// { id: number; nome: string; email: string }
```

### Transformações Customizadas

```typescript
// Tornar todas propriedades nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Usuario = { nome: string; idade: number };
type UsuarioNullable = Nullable<Usuario>;
// { nome: string | null; idade: number | null }

// Transformar tipos específicos
type StringsToNumbers<T> = {
  [K in keyof T]: T[K] extends string ? number : T[K];
};

type Original = { a: string; b: number; c: string };
type Transformado = StringsToNumbers<Original>;
// { a: number; b: number; c: number }

// Adicionar prefixo aos tipos
type Promised<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type Sync = { carregar: string; salvar: number };
type Async = Promised<Sync>;
// { carregar: Promise<string>; salvar: Promise<number> }
```

### Mapped Types com Conditional Types

```typescript
// Filtrar propriedades por tipo
type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

type Mixed = {
  nome: string;
  idade: number;
  ativo: boolean;
  email: string;
};

type ApenasStrings = FilterByType<Mixed, string>;
// { nome: string; email: string }

type ApenasNumeros = FilterByType<Mixed, number>;
// { idade: number }
```

## 🎯 Aplicabilidade

### State Management

```typescript
type Estado = {
  usuario: { nome: string; email: string };
  configuracoes: { tema: string; idioma: string };
  carregando: boolean;
};

// Actions creators tipados automaticamente
type Actions<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type EstadoActions = Actions<Estado>;
// {
//   setUsuario: (value: { nome: string; email: string }) => void;
//   setConfiguracoes: (value: { tema: string; idioma: string }) => void;
//   setCarregando: (value: boolean) => void;
// }
```

### Form Validation

```typescript
type FormData = {
  nome: string;
  email: string;
  idade: number;
};

// Tipo de erros de validação
type ValidationErrors<T> = {
  [K in keyof T]?: string; // Cada campo pode ter erro opcional
};

type FormErrors = ValidationErrors<FormData>;
// { nome?: string; email?: string; idade?: string }

function validar(data: FormData): FormErrors {
  const errors: FormErrors = {};
  
  if (data.nome.length < 3) {
    errors.nome = "Nome muito curto";
  }
  
  if (!data.email.includes("@")) {
    errors.email = "Email inválido";
  }
  
  return errors;
}
```

### API Response Types

```typescript
type Entity = {
  id: number;
  nome: string;
  criadoEm: Date;
};

// Tipo de criação (sem id e data)
type CreateDTO<T> = Omit<T, "id" | "criadoEm">;

type CriarEntity = CreateDTO<Entity>;
// { nome: string }

// Tipo de atualização (tudo opcional exceto id)
type UpdateDTO<T> = Partial<Omit<T, "id">> & Pick<T, "id">;

type AtualizarEntity = UpdateDTO<Entity>;
// { id: number; nome?: string; criadoEm?: Date }
```

## ⚠️ Limitações

### Não Pode Criar Novas Propriedades

```typescript
// ❌ Mapped types não podem adicionar propriedades inexistentes
type ComExtra<T> = {
  [K in keyof T]: T[K];
  extra: string; // ❌ Erro de sintaxe
};

// ✅ Use intersection para adicionar
type ComExtraCorreto<T> = {
  [K in keyof T]: T[K];
} & { extra: string };
```

### Performance em Tipos Muito Grandes

```typescript
// ⚠️ Cuidado com tipos com centenas de propriedades
type Gigante = { /* 500+ propriedades */ };

type Transformado = Readonly<Nullable<Partial<Gigante>>>;
// Pode ser lento para compilar e IDE pode ter dificuldade
```

### Index Signatures Especiais

```typescript
type ComIndex = {
  [key: string]: number;
  especial: string;
};

type Mapeado = Readonly<ComIndex>;
// Index signature readonly, mas TypeScript pode ter comportamentos inesperados
```

## 🔗 Interconexões

### Com Template Literal Types

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Usuario = { nome: string; idade: number };
type UsuarioGetters = Getters<Usuario>;
// { getNome: () => string; getIdade: () => number }
```

### Com Conditional Types

```typescript
type DeepPartial<T> = {
  [K in keyof T]: T[K] extends object ? DeepPartial<T[K]> : T[K] | undefined;
};

type Nested = {
  usuario: {
    nome: string;
    endereco: {
      rua: string;
      numero: number;
    };
  };
};

type Parcial = DeepPartial<Nested>;
// Todas propriedades aninhadas são opcionais recursivamente
```

## 📚 Conclusão

Mapped types são **transformações sistemáticas de tipos**, permitindo:

✅ Criar variações de tipos existentes  
✅ DRY (Don't Repeat Yourself) em nível de tipo  
✅ Utility types reutilizáveis  
✅ Type safety em transformações  

Use mapped types quando:
- Precisa variante de tipo (readonly, partial, etc.)
- Quer transformar todas propriedades uniformemente
- Deseja gerar tipos relacionados automaticamente
- Busca abstrair padrões de transformação

Mapped types são **fundação dos utility types** do TypeScript e essenciais para programação avançada em nível de tipo.
