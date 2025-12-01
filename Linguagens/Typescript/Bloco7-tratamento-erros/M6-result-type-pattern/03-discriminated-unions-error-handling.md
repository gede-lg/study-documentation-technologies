# Discriminated Unions para Error Handling: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Discriminated unions** (também conhecidas como tagged unions ou algebraic data types) para error handling usam **propriedade literal como discriminante** (`tipo`, `kind`, `tag`) para distinguir entre variantes de erro, permitindo TypeScript fazer **exhaustive pattern matching** e **type narrowing preciso**. Conceitualmente, representa **tipos soma com discriminação**, onde cada variante tem tag única que identifica sua natureza.

Na essência, discriminated unions materializam o princípio de **modelagem explícita de estados**, onde cada tipo de erro é variante distinta com estrutura própria, e propriedade discriminante permite TypeScript verificar exaustivamente todos os casos possíveis.

## 📋 Fundamentos

### Estrutura Básica

```typescript
// Variantes de erro com discriminante 'tipo'
interface NetworkError {
  tipo: "network";    // Literal type - discriminante
  mensagem: string;
  statusCode?: number;
}

interface ValidationError {
  tipo: "validation"; // Literal type - discriminante
  campo: string;
  mensagem: string;
}

interface AuthError {
  tipo: "auth";       // Literal type - discriminante
  codigo: 401 | 403;
}

// Discriminated union de erros
type AppError = NetworkError | ValidationError | AuthError;

interface Success<T> {
  success: true;
  data: T;
}

interface Failure {
  success: false;
  error: AppError;
}

type Result<T> = Success<T> | Failure;

// Uso com narrowing
function tratarErro(erro: AppError): void {
  // Type narrowing baseado no discriminante 'tipo'
  switch (erro.tipo) {
    case "network":
      // TypeScript sabe que é NetworkError
      console.error(`Erro de rede: ${erro.mensagem}`);
      if (erro.statusCode) {
        console.error(`Status: ${erro.statusCode}`);
      }
      break;

    case "validation":
      // TypeScript sabe que é ValidationError
      console.error(`Validação falhou no campo '${erro.campo}': ${erro.mensagem}`);
      break;

    case "auth":
      // TypeScript sabe que é AuthError
      console.error(`Erro de autenticação: ${erro.codigo}`);
      break;

    default:
      // Exhaustiveness check
      const _exhaustive: never = erro;
      return _exhaustive;
  }
}
```

**Conceito-chave:** Propriedade literal (`tipo`) permite TypeScript determinar **exatamente** qual variante está presente.

### Exhaustiveness Checking

```typescript
type AppError = NetworkError | ValidationError | AuthError;

function tratarErro(erro: AppError): string {
  switch (erro.tipo) {
    case "network":
      return "Erro de rede";
    case "validation":
      return "Erro de validação";
    // ❌ Falta case "auth" - TypeScript detecta!
  }
  // Erro: Not all code paths return a value
}

// ✅ Correto - todos os casos tratados
function tratarErroCompleto(erro: AppError): string {
  switch (erro.tipo) {
    case "network":
      return "Erro de rede";
    case "validation":
      return "Erro de validação";
    case "auth":
      return "Erro de autenticação";
    default:
      const _exhaustive: never = erro;
      return _exhaustive;
  }
}
```

## 🔍 Análise Conceitual

### 1. Hierarquia de Erros

```typescript
// Erros de validação específicos
interface RequiredFieldError {
  tipo: "validation";
  categoria: "required";
  campo: string;
}

interface InvalidFormatError {
  tipo: "validation";
  categoria: "format";
  campo: string;
  esperado: string;
  recebido: string;
}

interface OutOfRangeError {
  tipo: "validation";
  categoria: "range";
  campo: string;
  min: number;
  max: number;
  valor: number;
}

type ValidationError = RequiredFieldError | InvalidFormatError | OutOfRangeError;

// Erros de banco de dados
interface NotFoundError {
  tipo: "database";
  categoria: "not_found";
  entidade: string;
  id: number | string;
}

interface ConstraintError {
  tipo: "database";
  categoria: "constraint";
  constraint: string;
}

type DatabaseError = NotFoundError | ConstraintError;

// Union de todos os erros
type AppError = ValidationError | DatabaseError | NetworkError;

// Tratamento hierárquico
function tratarErro(erro: AppError): void {
  switch (erro.tipo) {
    case "validation":
      // Narrowing para ValidationError
      switch (erro.categoria) {
        case "required":
          console.log(`Campo '${erro.campo}' é obrigatório`);
          break;
        case "format":
          console.log(`Campo '${erro.campo}': esperado ${erro.esperado}, recebido ${erro.recebido}`);
          break;
        case "range":
          console.log(`Campo '${erro.campo}': ${erro.valor} fora do intervalo [${erro.min}, ${erro.max}]`);
          break;
      }
      break;

    case "database":
      switch (erro.categoria) {
        case "not_found":
          console.log(`${erro.entidade} ${erro.id} não encontrado`);
          break;
        case "constraint":
          console.log(`Violação de constraint: ${erro.constraint}`);
          break;
      }
      break;

    case "network":
      console.log(`Erro de rede: ${erro.mensagem}`);
      break;
  }
}
```

### 2. Result com Discriminated Union

```typescript
interface Success<T> {
  status: "success";
  data: T;
}

interface Failure<E> {
  status: "failure";
  error: E;
}

interface Loading {
  status: "loading";
}

// Estado de requisição assíncrona
type AsyncState<T, E> = Success<T> | Failure<E> | Loading;

function renderizar<T>(state: AsyncState<T, AppError>): string {
  switch (state.status) {
    case "loading":
      return "Carregando...";

    case "success":
      return `Dados: ${JSON.stringify(state.data)}`;

    case "failure":
      // Pode tratar erro discriminado
      switch (state.error.tipo) {
        case "network":
          return `Erro de rede: ${state.error.mensagem}`;
        case "validation":
          return `Erro de validação em ${state.error.campo}`;
        case "auth":
          return `Não autorizado (${state.error.codigo})`;
      }
  }
}
```

### 3. Pattern Matching com Helper

```typescript
type AppError = NetworkError | ValidationError | AuthError;

// Helper para pattern matching
function matchError<R>(
  erro: AppError,
  handlers: {
    network: (e: NetworkError) => R;
    validation: (e: ValidationError) => R;
    auth: (e: AuthError) => R;
  }
): R {
  switch (erro.tipo) {
    case "network":
      return handlers.network(erro);
    case "validation":
      return handlers.validation(erro);
    case "auth":
      return handlers.auth(erro);
  }
}

// Uso
const mensagem = matchError(erro, {
  network: (e) => `Rede: ${e.mensagem}`,
  validation: (e) => `Validação: ${e.campo}`,
  auth: (e) => `Auth: ${e.codigo}`
});
```

### 4. Transformação de Erros

```typescript
// Mapear erros de domínio para erros HTTP
function toHttpError(erro: AppError): {
  status: number;
  mensagem: string;
} {
  switch (erro.tipo) {
    case "network":
      return {
        status: erro.statusCode ?? 500,
        mensagem: erro.mensagem
      };

    case "validation":
      return {
        status: 400,
        mensagem: `Campo '${erro.campo}': ${erro.mensagem}`
      };

    case "auth":
      return {
        status: erro.codigo,
        mensagem: "Acesso negado"
      };

    default:
      const _exhaustive: never = erro;
      return _exhaustive;
  }
}
```

### 5. Composição de Results

```typescript
type Result<T, E> = Success<T> | Failure<E>;

async function operacaoCompleta(): Promise<Result<Usuario, AppError>> {
  // 1. Validar entrada
  const validacao = validarEntrada();
  if (validacao.status === "failure") {
    return validacao; // ValidationError
  }

  // 2. Buscar no banco
  const usuario = await buscarUsuario(validacao.data.id);
  if (usuario.status === "failure") {
    return usuario; // DatabaseError ou NetworkError
  }

  // 3. Verificar permissões
  const permissao = verificarPermissoes(usuario.data);
  if (permissao.status === "failure") {
    return permissao; // AuthError
  }

  return {
    status: "success",
    data: usuario.data
  };
}
```

## 🎯 Aplicabilidade

### API Error Handling

```typescript
interface ApiSuccess<T> {
  status: "success";
  data: T;
  meta: { timestamp: string };
}

interface ApiError {
  status: "error";
  error: {
    codigo: string;
    mensagem: string;
    detalhes?: any;
  };
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

async function chamarApi<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      return {
        status: "success",
        data,
        meta: { timestamp: new Date().toISOString() }
      };
    }

    return {
      status: "error",
      error: {
        codigo: `HTTP_${response.status}`,
        mensagem: data.message || "Erro desconhecido"
      }
    };
  } catch (e) {
    return {
      status: "error",
      error: {
        codigo: "NETWORK_ERROR",
        mensagem: e instanceof Error ? e.message : "Falha de conexão"
      }
    };
  }
}

// Uso
const response = await chamarApi<Usuario>("/api/usuarios/1");

switch (response.status) {
  case "success":
    console.log(`Usuário: ${response.data.nome}`);
    console.log(`Timestamp: ${response.meta.timestamp}`);
    break;

  case "error":
    console.error(`[${response.error.codigo}] ${response.error.mensagem}`);
    break;
}
```

### Form Validation

```typescript
interface ValidField {
  estado: "valid";
  valor: string;
}

interface InvalidField {
  estado: "invalid";
  erros: string[];
}

interface PendingField {
  estado: "pending";
}

type FieldState = ValidField | InvalidField | PendingField;

interface FormState {
  nome: FieldState;
  email: FieldState;
  senha: FieldState;
}

function validarCampo(campo: string, valor: string): FieldState {
  const erros: string[] = [];

  if (!valor) {
    erros.push("Campo obrigatório");
  }

  if (campo === "email" && !valor.includes("@")) {
    erros.push("Email inválido");
  }

  if (campo === "senha" && valor.length < 8) {
    erros.push("Senha deve ter 8+ caracteres");
  }

  if (erros.length > 0) {
    return { estado: "invalid", erros };
  }

  return { estado: "valid", valor };
}

function renderizarCampo(field: FieldState): string {
  switch (field.estado) {
    case "valid":
      return `✓ ${field.valor}`;

    case "invalid":
      return `✗ Erros: ${field.erros.join(", ")}`;

    case "pending":
      return "...";
  }
}
```

### State Machine com Discriminated Unions

```typescript
interface Idle {
  estado: "idle";
}

interface Loading {
  estado: "loading";
  progresso: number;
}

interface Success<T> {
  estado: "success";
  data: T;
}

interface Error {
  estado: "error";
  erro: AppError;
  retry: () => void;
}

type AsyncState<T> = Idle | Loading | Success<T> | Error;

class DataFetcher<T> {
  private state: AsyncState<T> = { estado: "idle" };

  async carregar(): Promise<void> {
    this.state = { estado: "loading", progresso: 0 };

    try {
      // Simular progresso
      for (let i = 0; i <= 100; i += 10) {
        this.state = { estado: "loading", progresso: i };
        await new Promise(r => setTimeout(r, 100));
      }

      const data = await this.buscar();
      this.state = { estado: "success", data };

    } catch (e) {
      this.state = {
        estado: "error",
        erro: {
          tipo: "network",
          mensagem: e instanceof Error ? e.message : "Erro"
        },
        retry: () => this.carregar()
      };
    }
  }

  private async buscar(): Promise<T> {
    // Implementação
    throw new Error("Not implemented");
  }

  render(): string {
    switch (this.state.estado) {
      case "idle":
        return "Clique para carregar";

      case "loading":
        return `Carregando... ${this.state.progresso}%`;

      case "success":
        return `Dados: ${JSON.stringify(this.state.data)}`;

      case "error":
        return `Erro: ${this.state.erro.mensagem} [Retry]`;
    }
  }
}
```

## ⚠️ Considerações

### 1. Escolha do Discriminante

```typescript
// ✅ Bom - literal strings descritivas
interface NetworkError {
  tipo: "network";
}

// ❌ Ruim - números podem ser ambíguos
interface NetworkError {
  codigo: 1;
}

// ✅ Bom - enum para garantir valores válidos
enum ErrorType {
  Network = "network",
  Validation = "validation",
  Auth = "auth"
}

interface NetworkError {
  tipo: ErrorType.Network;
}
```

### 2. Evitar Discriminantes Opcionais

```typescript
// ❌ Ruim - discriminante opcional
interface Error {
  tipo?: "network" | "validation";
}

// ✅ Bom - sempre presente
interface Error {
  tipo: "network" | "validation";
}
```

### 3. Manter Variantes Disjuntas

```typescript
// ❌ Ruim - variantes com propriedades sobrepostas
interface ErrorA {
  tipo: "A";
  mensagem: string;
  codigo: number;
}

interface ErrorB {
  tipo: "B";
  mensagem: string;
  codigo: number;
}

// ✅ Melhor - base comum + variantes específicas
interface BaseError {
  tipo: "A" | "B";
  mensagem: string;
}

interface ErrorA extends BaseError {
  tipo: "A";
  detalhesA: string;
}

interface ErrorB extends BaseError {
  tipo: "B";
  detalhesB: number;
}
```

## 📚 Conclusão

Discriminated unions para error handling usam propriedade literal como discriminante para distinguir variantes de erro, permitindo TypeScript fazer narrowing preciso e exhaustiveness checking. São superiores a hierarquias de classes para modelar estados mutuamente exclusivos, garantindo tratamento completo de todos os casos e tornando impossível estados inválidos. Essencial para state machines, APIs type-safe e modelagem explícita de erros.
