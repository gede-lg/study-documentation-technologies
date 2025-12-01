# NonNullable<T>: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**`NonNullable<T>`** é tipo utilitário built-in que **remove `null` e `undefined`** de union type `T`, garantindo que tipo resultante não pode ser nulo. Conceitualmente, representa **garantia de presença de valor**, eliminando possibilidade de ausência (nullish values), criando versão "não-nulável" de qualquer tipo.

Na essência, materializa o princípio de **null safety explícita**, permitindo refinar tipos que podem ser nulos para versões garantidamente presentes, essencial para strict null checking e programação defensiva.

## 📋 Fundamentos

### Sintaxe e Comportamento

```typescript
// Tipo que pode ser nulo
type Valor = string | number | null | undefined;

// Remove null e undefined
type ValorNaoNulo = NonNullable<Valor>;
// Resultado: string | number

// Uso
const v1: Valor = "texto"; // ✅ OK
const v2: Valor = null; // ✅ OK
const v3: Valor = undefined; // ✅ OK

const nv1: ValorNaoNulo = "texto"; // ✅ OK
const nv2: ValorNaoNulo = 42; // ✅ OK
// const nv3: ValorNaoNulo = null; // ❌ Erro
// const nv4: ValorNaoNulo = undefined; // ❌ Erro
```

**Conceito-chave:** NonNullable remove apenas `null` e `undefined`, mantém outros tipos da union.

### Implementação Interna

```typescript
// Definição real (built-in)
type NonNullable<T> = T extends null | undefined ? never : T;

// Equivalente usando Exclude
type NonNullable<T> = Exclude<T, null | undefined>;

// Explicação:
// - Conditional type: se T é null/undefined, retorna never
// - Senão, retorna T
// - Distribuição sobre union remove null/undefined de cada membro
```

**Mecanismo:** Usa **conditional types** (ou `Exclude`) para filtrar nullish values.

## 🔍 Análise Conceitual

### 1. Validação e Refinamento

```typescript
function processarValor(valor: string | null): void {
  // valor pode ser null aqui

  if (valor !== null) {
    // TypeScript infere: valor é string (narrowing automático)
    console.log(valor.toUpperCase());
  }
}

// Com NonNullable para documentar tipo
function obterValorGarantido(
  valor: string | null
): NonNullable<typeof valor> {
  if (valor === null) {
    throw new Error("Valor não pode ser nulo");
  }

  return valor; // TypeScript sabe que aqui é string
}

// Uso
const resultado = obterValorGarantido("texto"); // string (garantido)
```

### 2. Arrays e Filtragem

```typescript
const valores: (number | null | undefined)[] = [1, null, 2, undefined, 3, null, 4];

// Filtrar nullish values
const valoresLimpos = valores.filter((v): v is NonNullable<typeof v> => v != null);
// valoresLimpos: number[]

console.log(valoresLimpos); // [1, 2, 3, 4]

// Ou usando função auxiliar
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null;
}

const limpos2 = valores.filter(isNonNullable);
// limpos2: number[]
```

### 3. Propriedades Opcionais

```typescript
interface Usuario {
  id: number;
  nome: string;
  email?: string; // Opcional: string | undefined
  telefone?: string;
}

// Tornar email obrigatório e não-nulo
type UsuarioComEmail = Usuario & {
  email: NonNullable<Usuario["email"]>;
};
// email: string (não mais undefined)

const u1: Usuario = { id: 1, nome: "Ana" }; // ✅ OK

const u2: UsuarioComEmail = { id: 1, nome: "Ana" }; // ❌ Erro: falta email

const u3: UsuarioComEmail = {
  id: 1,
  nome: "Ana",
  email: "ana@example.com" // ✅ OK
};
```

### 4. Parâmetros de Função

```typescript
// Função que aceita valor nullable
function buscar(id: number): Usuario | null {
  // Pode retornar null se não encontrar
  return Math.random() > 0.5 ? { id, nome: "Ana" } : null;
}

// Função que garante retorno não-nulo
function buscarObrigatorio(id: number): NonNullable<ReturnType<typeof buscar>> {
  const usuario = buscar(id);

  if (usuario === null) {
    throw new Error(`Usuário ${id} não encontrado`);
  }

  return usuario;
}

// Uso
const u = buscarObrigatorio(1); // Usuario (garantido, não null)
console.log(u.nome.toUpperCase()); // ✅ Safe
```

### 5. Configurações com Defaults

```typescript
interface Config {
  timeout?: number;
  retries?: number;
  baseUrl?: string;
}

const configParcial: Config = {
  timeout: 5000
  // retries e baseUrl podem ser undefined
};

// Aplicar defaults
function obterConfigCompleta(config: Config): Record<keyof Config, NonNullable<Config[keyof Config]>> {
  return {
    timeout: config.timeout ?? 5000,
    retries: config.retries ?? 3,
    baseUrl: config.baseUrl ?? "https://api.example.com"
  };
}

const completa = obterConfigCompleta(configParcial);
// Todas propriedades garantidas não-undefined
console.log(completa.retries + 1); // ✅ Safe
```

## 🎯 Aplicabilidade

### Validação de Input

```typescript
function validarEmail(email: string | null | undefined): string {
  type EmailValido = NonNullable<typeof email>;

  if (!email) {
    throw new Error("Email é obrigatório");
  }

  if (!email.includes("@")) {
    throw new Error("Email inválido");
  }

  return email; // TypeScript sabe: string (não null/undefined)
}

// Uso
try {
  const emailValidado = validarEmail("usuario@example.com");
  enviarEmail(emailValidado); // Seguro: nunca null
} catch (error) {
  console.error(error);
}
```

### Cache com Valores Opcionais

```typescript
class Cache<T> {
  private storage = new Map<string, T | null>();

  set(key: string, value: T | null): void {
    this.storage.set(key, value);
  }

  get(key: string): T | null | undefined {
    return this.storage.get(key);
  }

  // Retorna apenas se existir E não for null
  getNonNull(key: string): NonNullable<T> | undefined {
    const value = this.storage.get(key);

    if (value === null || value === undefined) {
      return undefined;
    }

    return value as NonNullable<T>;
  }
}

// Uso
const cache = new Cache<{ nome: string } | null>();
cache.set("user1", { nome: "Ana" });
cache.set("user2", null);

const user1 = cache.getNonNull("user1"); // { nome: string } | undefined
const user2 = cache.getNonNull("user2"); // undefined (porque value era null)
```

### API Response Handling

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function fetchUsuario(id: number): Promise<ApiResponse<Usuario>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: "Erro ao buscar usuário" };
  }
}

// Helper: extrair data garantida
function extrairData<T>(response: ApiResponse<T>): NonNullable<T> {
  if (response.error || response.data === null) {
    throw new Error(response.error || "Dados não disponíveis");
  }

  return response.data;
}

// Uso
const response = await fetchUsuario(1);
const usuario = extrairData(response); // Usuario (garantido não-null)
console.log(usuario.nome); // ✅ Safe
```

### Form Fields

```typescript
interface FormData {
  nome?: string;
  email?: string;
  idade?: number;
}

type FormErrors = {
  [K in keyof FormData]?: string;
};

function validarFormulario(dados: FormData): FormData & Record<keyof FormData, NonNullable<FormData[keyof FormData]>> {
  const erros: FormErrors = {};

  if (!dados.nome) {
    erros.nome = "Nome obrigatório";
  }

  if (!dados.email) {
    erros.email = "Email obrigatório";
  }

  if (!dados.idade || dados.idade < 0) {
    erros.idade = "Idade inválida";
  }

  if (Object.keys(erros).length > 0) {
    throw erros;
  }

  // Aqui garantimos que todos os campos estão presentes
  return dados as FormData & Record<keyof FormData, NonNullable<FormData[keyof FormData]>>;
}
```

## ⚠️ Considerações

### 1. NonNullable vs Definite Assignment

```typescript
// NonNullable: tipo estático
let valor1: string | null = "texto";
let valor2: NonNullable<typeof valor1>; // string

// valor2 = null; // ❌ Erro de tipo

// ! (definite assignment): asserção runtime
let valor3!: string; // Diz ao TypeScript: "será inicializado"
// Não há verificação - pode causar runtime error
console.log(valor3.length); // ✅ Compila, mas pode crashar!
```

### 2. NonNullable não é Type Guard

```typescript
function processar(valor: string | null): void {
  // NonNullable não realiza narrowing automático
  type ValorTipo = NonNullable<typeof valor>;

  // const v: ValorTipo = valor; // ❌ Erro: valor ainda pode ser null

  // Precisa de narrowing manual
  if (valor !== null) {
    const v: ValorTipo = valor; // ✅ OK agora
  }
}
```

### 3. Combinar com Outros Utilitários

```typescript
interface Opcoes {
  timeout?: number | null;
  retries?: number | null;
  cache?: boolean | null;
}

// Tornar tudo obrigatório e não-nulo
type OpcoesCompletas = {
  [K in keyof Required<Opcoes>]: NonNullable<Required<Opcoes>[K]>;
};
// {
//   timeout: number;
//   retries: number;
//   cache: boolean;
// }

const opcoes: OpcoesCompletas = {
  timeout: 5000,
  retries: 3,
  cache: true
};
```

### 4. Arrays e Readonly

```typescript
const valores: readonly (number | null)[] = [1, null, 2, null, 3];

// Filtrar mantendo readonly
const limpos: readonly NonNullable<(typeof valores)[number]>[] =
  valores.filter((v): v is NonNullable<typeof v> => v !== null);

// limpos: readonly number[]
```

## 📚 Conclusão

`NonNullable<T>` remove `null` e `undefined` de union type, garantindo presença de valor. Implementado com conditional types (ou `Exclude`). Ideal para validação de inputs, filtragem de arrays, refinamento de propriedades opcionais, garantias de retorno de funções e manipulação de API responses. Não realiza narrowing automático - precisa combinar com type guards. Use com `Required` para tornar propriedades obrigatórias E não-nulas. Essencial em strict null checking mode.
