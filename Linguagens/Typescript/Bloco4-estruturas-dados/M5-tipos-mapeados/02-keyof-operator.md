# Operador keyof em TypeScript: Extração de Chaves de Tipos

## 🎯 Introdução

O operador **keyof** extrai **todas as chaves** de um tipo objeto como **união de strings literais**. É fundamental para **programação genérica** e **mapped types**, permitindo operações type-safe sobre propriedades.

## 📋 Conceitos Fundamentais

### Sintaxe Básica

```typescript
type Usuario = {
  nome: string;
  idade: number;
  email: string;
};

// keyof extrai chaves como união
type ChavesUsuario = keyof Usuario;
// Tipo: "nome" | "idade" | "email"

// Uso: restringir a chaves válidas
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const usuario: Usuario = { nome: "Ana", idade: 25, email: "ana@email.com" };

let nome = getProperty(usuario, "nome"); // ✅ OK, tipo: string
let idade = getProperty(usuario, "idade"); // ✅ OK, tipo: number
let invalido = getProperty(usuario, "senha"); // ❌ Erro: "senha" não existe
```

### Resultado Como Union Type

```typescript
type Pessoa = {
  nome: string;
  sobrenome: string;
  idade: number;
};

type Chaves = keyof Pessoa;
// "nome" | "sobrenome" | "idade"

// Pode usar em type narrowing
function processar(chave: Chaves) {
  if (chave === "nome") {
    // chave é "nome"
  } else if (chave === "sobrenome") {
    // chave é "sobrenome"
  } else {
    // chave é "idade"
  }
}
```

## 🧠 Fundamentos Teóricos

### keyof com Index Signatures

```typescript
// Objeto com index signature
type Dictionary = {
  [key: string]: number;
};

type ChavesDict = keyof Dictionary;
// Tipo: string | number
// ⚠️ Inclui number porque obj[0] é válido em JS (convertido para string)

// Objeto com chaves específicas + index signature
type MixedObject = {
  nome: string;
  [key: string]: string | number;
};

type ChavesMixed = keyof MixedObject;
// Tipo: string | number
```

**Conceito:** Com index signature `[key: string]`, keyof retorna `string | number` porque JavaScript permite acesso numérico.

### keyof com Arrays

```typescript
type Arr = string[];

type ChavesArray = keyof Arr;
// Tipo: number | "length" | "toString" | "push" | "pop" | ...
// Todas propriedades de Array!

// Prático: usar com índices numéricos
function getElemento<T>(arr: T[], index: number): T {
  return arr[index];
}
```

### keyof com Tipos Primitivos

```typescript
type ChavesString = keyof string;
// "toString" | "charAt" | "charCodeAt" | "concat" | "indexOf" | ...

type ChavesNumber = keyof number;
// "toString" | "toFixed" | "toExponential" | "toPrecision" | ...

type ChavesBoolean = keyof boolean;
// "valueOf"

// keyof any
type ChavesAny = keyof any;
// string | number | symbol (todas chaves possíveis)
```

### keyof com Union Types

```typescript
type A = { a: string; b: number };
type B = { b: number; c: boolean };

type ChavesUnion = keyof (A | B);
// Tipo: "b" (interseção de chaves!)
// Só "b" existe em AMBOS os tipos

type ChavesIntersection = keyof (A & B);
// Tipo: "a" | "b" | "c" (união de chaves)
```

**Conceito profundo:**
- `keyof (A | B)` → Chaves presentes em **todos** os tipos da união
- `keyof (A & B)` → Chaves presentes em **qualquer** tipo da interseção

## 🔍 Análise Conceitual Profunda

### Uso em Genéricos Restritos

```typescript
// Garantir que K é chave válida de T
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

type Usuario = { id: number; nome: string; email: string };
const usuario: Usuario = { id: 1, nome: "Ana", email: "ana@email.com" };

const parcial = pick(usuario, ["id", "nome"]); // ✅ OK
// Tipo: { id: number; nome: string }

const invalido = pick(usuario, ["id", "senha"]); // ❌ Erro: "senha" não existe
```

### Mapeamento de Propriedades

```typescript
// Criar tipo de getters baseado em propriedades
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Usuario = {
  nome: string;
  idade: number;
};

type UsuarioGetters = Getters<Usuario>;
// {
//   getNome: () => string;
//   getIdade: () => number;
// }
```

### Filtragem de Chaves por Tipo de Valor

```typescript
// Extrair apenas chaves cujos valores são de tipo específico
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type Mixed = {
  nome: string;
  idade: number;
  ativo: boolean;
  email: string;
};

type ChavesString = KeysOfType<Mixed, string>;
// "nome" | "email"

type ChavesNumber = KeysOfType<Mixed, number>;
// "idade"
```

### Validação de Chaves em Runtime

```typescript
function hasKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}

const usuario = { nome: "Ana", idade: 25 };

if (hasKey(usuario, "nome")) {
  // TypeScript sabe: "nome" é keyof typeof usuario
  let valor = usuario["nome"]; // ✅ Type-safe
}

let chave: string = "email";
if (hasKey(usuario, chave)) {
  // Type guard: chave é refinado para keyof typeof usuario
  let valor = usuario[chave]; // ✅ OK
}
```

## 🎯 Aplicabilidade

### Funções Genéricas Type-Safe

```typescript
function pluck<T, K extends keyof T>(array: T[], key: K): T[K][] {
  return array.map(item => item[key]);
}

type Produto = { id: number; nome: string; preco: number };
const produtos: Produto[] = [
  { id: 1, nome: "Mouse", preco: 50 },
  { id: 2, nome: "Teclado", preco: 150 }
];

const nomes = pluck(produtos, "nome"); // string[]
const precos = pluck(produtos, "preco"); // number[]
const invalido = pluck(produtos, "categoria"); // ❌ Erro
```

### Form Handling

```typescript
type FormData = {
  nome: string;
  email: string;
  idade: number;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

function setError<K extends keyof FormData>(
  errors: FormErrors,
  field: K,
  message: string
): void {
  errors[field] = message;
}

const errors: FormErrors = {};
setError(errors, "email", "Email inválido"); // ✅ OK
setError(errors, "senha", "Senha fraca"); // ❌ Erro: "senha" não existe
```

### Event Emitters Type-Safe

```typescript
type Events = {
  "user:created": { id: number; nome: string };
  "user:updated": { id: number };
  "user:deleted": { id: number };
};

type EventKey = keyof Events;
// "user:created" | "user:updated" | "user:deleted"

function on<K extends EventKey>(
  event: K,
  handler: (payload: Events[K]) => void
): void {
  // Registrar listener
}

on("user:created", (payload) => {
  // payload: { id: number; nome: string }
  console.log(payload.nome);
});

on("user:updated", (payload) => {
  // payload: { id: number }
  console.log(payload.id);
});
```

### Deep Property Access

```typescript
type DeepKeys<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}.${DeepKeys<T[K]>}` | K
    : K;
}[keyof T];

type Usuario = {
  nome: string;
  endereco: {
    rua: string;
    cidade: string;
  };
};

type Paths = DeepKeys<Usuario>;
// "nome" | "endereco" | "endereco.rua" | "endereco.cidade"
```

## ⚠️ Limitações

### keyof Não Funciona com Valores

```typescript
const usuario = { nome: "Ana", idade: 25 };

// ❌ Erro: keyof não funciona com valores
type Chaves = keyof usuario; // Erro!

// ✅ Use typeof primeiro
type ChavesCorreto = keyof typeof usuario;
// "nome" | "idade"
```

### Chaves Privadas Não São Incluídas

```typescript
class Usuario {
  public nome: string;
  private senha: string;
  
  constructor(nome: string, senha: string) {
    this.nome = nome;
    this.senha = senha;
  }
}

type ChavesUsuario = keyof Usuario;
// Apenas "nome" (senha é privada)
```

### keyof com Tipos Complexos Pode Ser Amplo

```typescript
type Complexo = {
  [key: string]: any;
};

type Chaves = keyof Complexo;
// string | number (muito amplo!)
```

## 🔗 Interconexões

### Com typeof

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

type ConfigKeys = keyof typeof config;
// "apiUrl" | "timeout" | "retries"
```

### Com Mapped Types

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
```

### Com Conditional Types

```typescript
type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type Usuario = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
};

type Obrigatorias = RequiredKeys<Usuario>; // "id" | "nome"
type Opcionais = OptionalKeys<Usuario>; // "email" | "telefone"
```

## 📚 Conclusão

**keyof** é operador fundamental para:

✅ Extrair chaves de tipos como união  
✅ Restringir genéricos a chaves válidas  
✅ Criar mapped types  
✅ Type-safe property access  
✅ Validação de chaves em runtime  

Use keyof quando:
- Precisa garantir chave válida em genéricos
- Quer iterar sobre propriedades de tipo
- Deseja criar transformações baseadas em chaves
- Necessita type safety em acesso dinâmico

**keyof** é essencial para programação avançada em TypeScript e base de utility types como `Pick`, `Omit`, `Record`.
