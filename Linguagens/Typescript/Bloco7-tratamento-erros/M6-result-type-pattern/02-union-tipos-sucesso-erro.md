# Union Tipos para Sucesso/Erro: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Union tipos para sucesso/erro** representam resultado de operação como **união de dois tipos distintos**: tipo de sucesso (`Success<T>`) e tipo de erro (`Failure<E>`), criando `Result<T, E> = Success<T> | Failure<E>`. Conceitualmente, representa **bifurcação type-safe**, onde resultado é exclusivamente sucesso OU erro, nunca ambos, com TypeScript garantindo tratamento correto via narrowing.

Na essência, union types materializam o princípio de **tipos mutuamente exclusivos**, onde estrutura de dados modela precisamente os estados possíveis de uma operação, eliminando estados inválidos e tornando erro explícito no sistema de tipos.

## 📋 Fundamentos

### Estrutura com Union Types

```typescript
// Tipo de sucesso
interface Success<T> {
  success: true;  // Literal type
  data: T;
}

// Tipo de erro
interface Failure {
  success: false; // Literal type
  error: string;
}

// Union type - OU sucesso OU erro
type Result<T> = Success<T> | Failure;

// Função retorna union
function dividir(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: "Divisão por zero"
    };
  }

  return {
    success: true,
    data: a / b
  };
}

// Type narrowing garante acesso seguro
const resultado = dividir(10, 2);

if (resultado.success) {
  // TypeScript sabe que é Success<number>
  console.log(resultado.data); // ✅ 'data' existe
  // console.log(resultado.error); // ❌ Erro: 'error' não existe em Success
} else {
  // TypeScript sabe que é Failure
  console.log(resultado.error); // ✅ 'error' existe
  // console.log(resultado.data); // ❌ Erro: 'data' não existe em Failure
}
```

**Conceito-chave:** Literal types (`true`/`false`) permitem discriminação precisa entre sucesso e erro.

### Vantagens sobre Result com Propriedades Opcionais

```typescript
// ❌ Propriedades opcionais - estados inválidos possíveis
interface ResultRuim<T> {
  success: boolean;
  data?: T;      // Pode estar presente em erro
  error?: string; // Pode estar presente em sucesso
}

// Estados inválidos possíveis:
const ruim1: ResultRuim<number> = { success: true }; // Sucesso sem data
const ruim2: ResultRuim<number> = { success: true, error: "ops" }; // Sucesso com erro
const ruim3: ResultRuim<number> = { success: false, data: 42 }; // Erro com data

// ✅ Union types - apenas estados válidos
type ResultBom<T> = Success<T> | Failure;

// ❌ Estados inválidos impossíveis
// const bom1: ResultBom<number> = { success: true }; // Erro: falta 'data'
// const bom2: ResultBom<number> = { success: true, error: "ops" }; // Erro: 'error' inválido
```

**Vantagem:** Union types **eliminam estados inválidos** em tempo de compilação.

## 🔍 Análise Conceitual

### 1. Type Narrowing Automático

```typescript
type Result<T> = Success<T> | Failure;

function processar(resultado: Result<number>): void {
  // Type guard baseado em 'success'
  if (resultado.success) {
    // Tipo refinado para Success<number>
    const dobro = resultado.data * 2;
    console.log(`Sucesso: ${dobro}`);
  } else {
    // Tipo refinado para Failure
    console.error(`Erro: ${resultado.error}`);
  }
}

// Também funciona com switch
function processar2(resultado: Result<string>): void {
  switch (resultado.success) {
    case true:
      console.log(resultado.data.toUpperCase());
      break;
    case false:
      console.error(resultado.error);
      break;
  }
}
```

### 2. Erro Tipado com Genéricos

```typescript
interface Success<T> {
  success: true;
  data: T;
}

interface Failure<E> {
  success: false;
  error: E;
}

type Result<T, E = string> = Success<T> | Failure<E>;

// Erro customizado
interface ValidationError {
  campo: string;
  mensagem: string;
  codigo: number;
}

function validar(email: string): Result<string, ValidationError> {
  if (!email.includes("@")) {
    return {
      success: false,
      error: {
        campo: "email",
        mensagem: "Email inválido",
        codigo: 400
      }
    };
  }

  return {
    success: true,
    data: email
  };
}

const resultado = validar("invalido");
if (!resultado.success) {
  // TypeScript sabe que error é ValidationError
  console.log(`[${resultado.error.codigo}] ${resultado.error.campo}: ${resultado.error.mensagem}`);
}
```

### 3. Helpers Type-Safe

```typescript
// Helper para criar sucesso
function ok<T>(data: T): Success<T> {
  return { success: true, data };
}

// Helper para criar erro
function err<E = string>(error: E): Failure<E> {
  return { success: false, error };
}

// Uso
const sucesso = ok(42);           // Success<number>
const falha = err("Algo errado"); // Failure<string>
const falhaCustom = err<ValidationError>({
  campo: "nome",
  mensagem: "Obrigatório",
  codigo: 400
}); // Failure<ValidationError>
```

### 4. Map e Chain (Functor/Monad)

```typescript
// Map: transforma Success, propaga Failure
function map<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  if (result.success) {
    return ok(fn(result.data));
  }
  return result; // Propaga erro
}

// FlatMap/Chain: evita Result<Result<T>>
function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => Result<U, E>
): Result<U, E> {
  if (result.success) {
    return fn(result.data);
  }
  return result;
}

// Uso
const resultado = ok(10)
  |> (r => map(r, n => n * 2))           // ok(20)
  |> (r => flatMap(r, n => n > 15 ? ok(n) : err("Muito pequeno"))) // ok(20)
  |> (r => map(r, n => n.toString()));   // ok("20")
```

### 5. Múltiplos Tipos de Erro

```typescript
interface NetworkError {
  tipo: "network";
  mensagem: string;
}

interface ValidationError {
  tipo: "validation";
  campo: string;
  mensagem: string;
}

interface AuthError {
  tipo: "auth";
  codigo: number;
}

type AppError = NetworkError | ValidationError | AuthError;

type Result<T> = Success<T> | Failure<AppError>;

async function buscarUsuario(id: number): Promise<Result<Usuario>> {
  try {
    const response = await fetch(`/api/usuarios/${id}`);

    if (response.status === 401) {
      return err({
        tipo: "auth",
        codigo: 401
      });
    }

    if (!response.ok) {
      return err({
        tipo: "network",
        mensagem: `HTTP ${response.status}`
      });
    }

    const data = await response.json();
    return ok(data);

  } catch (e) {
    return err({
      tipo: "network",
      mensagem: "Falha de conexão"
    });
  }
}

// Type narrowing em erro
const resultado = await buscarUsuario(1);

if (!resultado.success) {
  switch (resultado.error.tipo) {
    case "network":
      console.error(`Erro de rede: ${resultado.error.mensagem}`);
      break;
    case "validation":
      console.error(`Validação falhou em ${resultado.error.campo}`);
      break;
    case "auth":
      console.error(`Não autorizado: ${resultado.error.codigo}`);
      break;
  }
}
```

## 🎯 Aplicabilidade

### Pipeline de Validações

```typescript
interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

function validarNome(nome: string): Result<string> {
  if (nome.length < 3) {
    return err("Nome deve ter 3+ caracteres");
  }
  return ok(nome);
}

function validarEmail(email: string): Result<string> {
  if (!email.includes("@")) {
    return err("Email inválido");
  }
  return ok(email);
}

function validarIdade(idade: number): Result<number> {
  if (idade < 18) {
    return err("Deve ter 18+ anos");
  }
  return ok(idade);
}

function criarUsuario(
  nome: string,
  email: string,
  idade: number
): Result<Usuario> {
  const nomeResult = validarNome(nome);
  if (!nomeResult.success) return nomeResult;

  const emailResult = validarEmail(email);
  if (!emailResult.success) return emailResult;

  const idadeResult = validarIdade(idade);
  if (!idadeResult.success) return idadeResult;

  return ok({
    nome: nomeResult.data,
    email: emailResult.data,
    idade: idadeResult.data
  });
}
```

### Operações Assíncronas Encadeadas

```typescript
async function login(
  email: string,
  senha: string
): Promise<Result<{ token: string; usuario: Usuario }>> {
  // 1. Validar credenciais
  const validacao = validarCredenciais(email, senha);
  if (!validacao.success) return validacao;

  // 2. Buscar usuário
  const usuarioResult = await buscarPorEmail(email);
  if (!usuarioResult.success) return usuarioResult;

  // 3. Verificar senha
  const senhaOk = await verificarSenha(senha, usuarioResult.data.hashSenha);
  if (!senhaOk) {
    return err("Senha incorreta");
  }

  // 4. Gerar token
  const token = gerarToken(usuarioResult.data.id);

  return ok({
    token,
    usuario: usuarioResult.data
  });
}
```

### Agregação de Resultados

```typescript
function combinarResultados<T>(
  results: Result<T>[]
): Result<T[]> {
  const dados: T[] = [];

  for (const result of results) {
    if (!result.success) {
      return result; // Retorna primeiro erro
    }
    dados.push(result.data);
  }

  return ok(dados);
}

// Versão que coleta todos os erros
function combinarTodosResultados<T>(
  results: Result<T>[]
): Result<T[], string[]> {
  const dados: T[] = [];
  const erros: string[] = [];

  for (const result of results) {
    if (result.success) {
      dados.push(result.data);
    } else {
      erros.push(result.error);
    }
  }

  if (erros.length > 0) {
    return { success: false, error: erros };
  }

  return ok(dados);
}
```

### Repository Pattern

```typescript
interface Usuario {
  id: number;
  nome: string;
}

type DbError = { tipo: "not_found" } | { tipo: "connection" } | { tipo: "constraint" };

class UsuarioRepository {
  async buscar(id: number): Promise<Result<Usuario, DbError>> {
    try {
      const usuario = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);

      if (!usuario) {
        return err({ tipo: "not_found" });
      }

      return ok(usuario);
    } catch (e) {
      return err({ tipo: "connection" });
    }
  }

  async salvar(usuario: Usuario): Promise<Result<Usuario, DbError>> {
    try {
      await db.query("INSERT INTO usuarios VALUES (?, ?)", [usuario.id, usuario.nome]);
      return ok(usuario);
    } catch (e) {
      if (e.code === "UNIQUE_CONSTRAINT") {
        return err({ tipo: "constraint" });
      }
      return err({ tipo: "connection" });
    }
  }
}
```

## ⚠️ Considerações

### 1. Exhaustiveness Checking

```typescript
type Result<T> = Success<T> | Failure;

function handle(result: Result<number>): void {
  if (result.success) {
    console.log(result.data);
  }
  // ⚠️ TypeScript não força tratar Failure
}

// ✅ Melhor: usar switch para exhaustiveness
function handleExhaustive(result: Result<number>): void {
  switch (result.success) {
    case true:
      console.log(result.data);
      return;
    case false:
      console.error(result.error);
      return;
  }
  // TypeScript garante que todos os casos foram tratados
}
```

### 2. Verbosidade em Encadeamento

```typescript
// Verboso
const r1 = operacao1();
if (!r1.success) return r1;

const r2 = operacao2(r1.data);
if (!r2.success) return r2;

// Solução: early return helper
function tryCatch<T>(fn: () => T): Result<T> {
  try {
    return ok(fn());
  } catch (e) {
    return err(e instanceof Error ? e.message : "Erro desconhecido");
  }
}
```

## 📚 Conclusão

Union tipos para sucesso/erro criam bifurcação type-safe entre `Success<T>` e `Failure<E>`, eliminando estados inválidos e garantindo tratamento correto via narrowing. É superior a propriedades opcionais pois modela precisamente estados possíveis, tornando erro explícito e impossibilitando estados inconsistentes em tempo de compilação.
