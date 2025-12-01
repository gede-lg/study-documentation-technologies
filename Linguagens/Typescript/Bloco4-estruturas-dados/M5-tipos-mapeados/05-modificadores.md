# Modificadores readonly e ? em Mapped Types TypeScript

## 🎯 Introdução

**Modificadores** em mapped types (`readonly` e `?`) permitem **adicionar, remover ou preservar** características de opcionalidade e mutabilidade nas propriedades, oferecendo controle fino sobre transformações de tipo.

## 📋 Conceitos Fundamentais

### Sintaxe de Modificadores

```typescript
// Adicionar modificador: +modificador (+ é implícito)
type AddReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type AddOptional<T> = {
  [K in keyof T]?: T[K];
};

// Remover modificador: -modificador
type RemoveReadonly<T> = {
  -readonly [K in keyof T]: T[K];
};

type RemoveOptional<T> = {
  [K in keyof T]-?: T[K];
};
```

### Preservação Automática (Homomorphic)

```typescript
type Fonte = {
  readonly nome: string;
  idade?: number;
};

// Sem modificadores explícitos: preserva originais
type Preservado<T> = {
  [K in keyof T]: T[K];
};

type Resultado = Preservado<Fonte>;
// { readonly nome: string; idade?: number } - preservado!
```

## 🧠 Fundamentos Teóricos

### Modificador readonly

#### Adicionar readonly (+readonly)

```typescript
// Sintaxe completa: +readonly (+ é opcional)
type Readonly<T> = {
  +readonly [K in keyof T]: T[K];
};

// Forma curta (+ implícito)
type ReadonlyShort<T> = {
  readonly [K in keyof T]: T[K];
};

type Mutavel = { nome: string; idade: number };
type Imutavel = Readonly<Mutavel>;
// { readonly nome: string; readonly idade: number }
```

#### Remover readonly (-readonly)

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type Imutavel = {
  readonly nome: string;
  readonly idade: number;
};

type Mutavel = Mutable<Imutavel>;
// { nome: string; idade: number } - readonly removido
```

### Modificador ? (Opcional)

#### Adicionar ? (+?)

```typescript
// Partial: torna todas propriedades opcionais
type Partial<T> = {
  [K in keyof T]?: T[K]; // +? é implícito
};

type Obrigatorio = { nome: string; idade: number };
type Opcional = Partial<Obrigatorio>;
// { nome?: string; idade?: number }
```

#### Remover ? (-?)

```typescript
// Required: torna todas propriedades obrigatórias
type Required<T> = {
  [K in keyof T]-?: T[K];
};

type Opcional = { nome?: string; idade?: number };
type Obrigatorio = Required<Opcional>;
// { nome: string; idade: number }
```

### Combinação de Modificadores

```typescript
// Adicionar readonly e remover opcional
type ReadonlyRequired<T> = {
  +readonly [K in keyof T]-?: T[K];
};

type Fonte = { nome?: string; idade?: number };
type Transformado = ReadonlyRequired<Fonte>;
// { readonly nome: string; readonly idade: number }

// Remover readonly e adicionar opcional
type MutablePartial<T> = {
  -readonly [K in keyof T]?: T[K];
};

type Imutavel = {
  readonly nome: string;
  readonly idade: number;
};

type Resultado = MutablePartial<Imutavel>;
// { nome?: string; idade?: number }
```

## 🔍 Análise Conceitual Profunda

### Utility Types Built-in

#### Readonly<T>

```typescript
// Definição
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Uso
type Usuario = { nome: string; idade: number };
type UsuarioReadonly = Readonly<Usuario>;

const usuario: UsuarioReadonly = { nome: "Ana", idade: 25 };
usuario.nome = "Bruno"; // ❌ Erro: readonly
```

#### Partial<T>

```typescript
// Definição
type Partial<T> = {
  [K in keyof T]?: T[K];
};

// Uso: updates parciais
function atualizar<T>(original: T, updates: Partial<T>): T {
  return { ...original, ...updates };
}

const usuario = { nome: "Ana", idade: 25, email: "ana@email.com" };
const atualizado = atualizar(usuario, { idade: 26 }); // ✅ OK
```

#### Required<T>

```typescript
// Definição
type Required<T> = {
  [K in keyof T]-?: T[K];
};

// Uso: garantir todas propriedades presentes
type Config = { host?: string; port?: number; debug?: boolean };

function validarConfig(config: Required<Config>) {
  // Todas propriedades garantidas
  console.log(config.host, config.port, config.debug);
}
```

### Modificadores Condicionais

```typescript
// Tornar readonly apenas propriedades de tipo específico
type ReadonlyStrings<T> = {
  [K in keyof T]: T[K] extends string ? readonly T[K] : T[K];
};

// ⚠️ readonly não funciona assim! Deve estar antes de [K in keyof T]
// Solução: usar conditional no valor do tipo

type ReadonlyIfString<T> = {
  readonly [K in keyof T]: T[K];
} & {
  [K in keyof T]: T[K] extends string ? never : T[K];
};
// Complexo - melhor usar outras abordagens
```

### Modificadores em Transformações Profundas

```typescript
// DeepReadonly recursivo
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
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

type ReadonlyNested = DeepReadonly<Nested>;
// Todas propriedades em todos níveis são readonly
```

### Modificadores com Filtros

```typescript
// Remover propriedades opcionais inteiramente
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OnlyRequired<T> = Pick<T, RequiredKeys<T>>;

type Mixed = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
};

type ApenasObrigatorios = OnlyRequired<Mixed>;
// { id: number; nome: string }
```

## 🎯 Aplicabilidade

### Imutabilidade em State Management

```typescript
type Estado = {
  contador: number;
  usuario: { nome: string; email: string };
  configuracoes: { tema: string };
};

// Estado sempre readonly
type EstadoImutavel = Readonly<Estado>;

// Reducer retorna novo estado
function reducer(estado: EstadoImutavel, acao: Acao): EstadoImutavel {
  // estado.contador++; // ❌ Erro: readonly
  
  return {
    ...estado,
    contador: estado.contador + 1 // ✅ Novo objeto
  };
}
```

### Partial Updates em APIs

```typescript
type Entity = {
  id: number;
  nome: string;
  email: string;
  criadoEm: Date;
  atualizadoEm: Date;
};

// DTO de atualização: tudo opcional exceto id
type UpdateDTO = Partial<Omit<Entity, "id">> & Pick<Entity, "id">;

function atualizar(dto: UpdateDTO): Entity {
  // dto.id: number (obrigatório)
  // dto.nome?: string (opcional)
  // dto.email?: string (opcional)
  // ...
}

atualizar({ id: 1, nome: "Novo Nome" }); // ✅ OK
atualizar({ nome: "Sem ID" }); // ❌ Erro: id obrigatório
```

### Form Validation

```typescript
type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

// Erros: todas propriedades opcionais (podem não ter erro)
type FormErrors = Partial<Record<keyof FormFields, string>>;

function validar(dados: FormFields): FormErrors {
  const erros: FormErrors = {};
  
  if (dados.nome.length < 3) {
    erros.nome = "Nome muito curto";
  }
  
  if (!dados.email.includes("@")) {
    erros.email = "Email inválido";
  }
  
  return erros;
}
```

### Configuration Merging

```typescript
type DefaultConfig = {
  readonly apiUrl: string;
  readonly timeout: number;
  readonly retries: number;
};

const defaults: DefaultConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

// User config: tudo opcional e mutável
type UserConfig = Partial<Mutable<DefaultConfig>>;

function criarConfig(userConfig: UserConfig): DefaultConfig {
  return {
    ...defaults,
    ...userConfig
  };
}
```

## ⚠️ Limitações

### Modificadores Não Afetam Index Signatures Diretamente

```typescript
type WithIndex = {
  [key: string]: number;
};

type Partial = Partial<WithIndex>;
// Index signature não se torna opcional!
```

### readonly é Shallow

```typescript
type NestedReadonly = Readonly<{
  usuario: { nome: string };
}>;

const data: NestedReadonly = { usuario: { nome: "Ana" } };

data.usuario = { nome: "Bruno" }; // ❌ Erro: readonly
data.usuario.nome = "Bruno"; // ✅ OK! Objeto interno é mutável
```

### Modificadores em Tuplas

```typescript
type Tupla = [string, number];

type TuplaPartial = Partial<Tupla>;
// [string?, number?] - funciona!

type TuplaReadonly = Readonly<Tupla>;
// readonly [string, number] - funciona!
```

## 🔗 Interconexões

### Com Conditional Types

```typescript
// Tornar propriedades opcionais apenas se forem de tipo específico
type PartialStrings<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | undefined : T[K];
};

type Mixed = { a: string; b: number; c: string };
type Resultado = PartialStrings<Mixed>;
// { a: string | undefined; b: number; c: string | undefined }
```

### Com Utility Types Combinados

```typescript
// Readonly + Partial
type ReadonlyPartial<T> = Readonly<Partial<T>>;

// Required + Mutable
type RequiredMutable<T> = Mutable<Required<T>>;

// Encadeamento complexo
type Transformado = Readonly<Required<Partial<{ a?: string; b?: number }>>>;
```

### Com Pick/Omit

```typescript
// Tornar específicas propriedades readonly
type ReadonlyProps<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>;

type Usuario = { id: number; nome: string; email: string };
type UsuarioComIDReadonly = ReadonlyProps<Usuario, "id">;
// { readonly id: number } & { nome: string; email: string }
```

## 📚 Conclusão

Modificadores **readonly** e **?** em mapped types permitem:

✅ Adicionar/remover imutabilidade (`+readonly` / `-readonly`)  
✅ Adicionar/remover opcionalidade (`+?` / `-?`)  
✅ Preservar modificadores originais (homomorphic)  
✅ Combinar modificadores em transformações  
✅ Criar utility types poderosos  

Use modificadores quando:
- Precisa controlar mutabilidade de tipos
- Quer tornar propriedades opcionais/obrigatórias
- Deseja transformar características de tipos existentes
- Necessita variações de tipos com diferentes garantias

Modificadores são **essenciais** para utility types como `Readonly`, `Partial`, `Required` e fundamentais para type-safe transformations em TypeScript.
