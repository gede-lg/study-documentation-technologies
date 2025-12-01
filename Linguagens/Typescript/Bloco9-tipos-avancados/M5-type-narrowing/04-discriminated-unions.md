# Discriminated Unions: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Discriminated unions** (também chamados **tagged unions** ou **variant types**) são **union types onde cada membro possui propriedade literal comum** (discriminant/tag) que uniquamente identifica o tipo. Conceitualmente, representa **type discrimination através de marker**, onde propriedade específica serve como identificador único permitindo TypeScript determinar tipo exato via narrowing automático.

Na essência, materializa o princípio de **exhaustive pattern matching**, onde union de tipos tagged permite verificação tipo-segura completa de todos os casos possíveis, tornando impossível esquecer de tratar algum caso.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Union simples (não discriminada)
type Shape1 = { radius: number } | { width: number; height: number };

// ❌ Difícil de diferenciar
function area1(shape: Shape1): number {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;
  }
  return shape.width * shape.height;
}

// ✅ Discriminated union (com propriedade 'kind')
interface Circle {
  kind: "circle"; // Discriminant literal
  radius: number;
}

interface Rectangle {
  kind: "rectangle"; // Discriminant literal
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

// Narrowing automático baseado em 'kind'
function area(shape: Shape): number {
  if (shape.kind === "circle") {
    // shape: Circle (narrowed!)
    return Math.PI * shape.radius ** 2;
  } else {
    // shape: Rectangle (narrowed!)
    return shape.width * shape.height;
  }
}

const c: Circle = { kind: "circle", radius: 10 };
const r: Rectangle = { kind: "rectangle", width: 5, height: 10 };

console.log(area(c)); // 314.159...
console.log(area(r)); // 50
```

**Conceito-chave:** Propriedade discriminant (ex: `kind`) com **tipo literal** permite TypeScript **narrow automaticamente**.

### Exhaustiveness Checking

```typescript
type Shape = Circle | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // shape: Circle
      return Math.PI * shape.radius ** 2;

    case "rectangle":
      // shape: Rectangle
      return shape.width * shape.height;

    default:
      // shape: never (todos os casos cobertos!)
      const _exhaustive: never = shape;
      throw new Error(`Caso não tratado: ${_exhaustive}`);
  }
}

// Se adicionar novo tipo na union, TypeScript avisa!
interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type NewShape = Circle | Rectangle | Triangle;

// ❌ Erro: Triangle não é never
// function areaNew(shape: NewShape): number {
//   switch (shape.kind) {
//     case "circle": return ...;
//     case "rectangle": return ...;
//     default:
//       const _exhaustive: never = shape; // Erro aqui!
//   }
// }
```

## 🔍 Análise Conceitual

### 1. Result/Either Pattern

```typescript
interface Success<T> {
  type: "success";
  value: T;
}

interface Failure<E> {
  type: "failure";
  error: E;
}

type Result<T, E> = Success<T> | Failure<E>;

// Funções helper
function success<T>(value: T): Success<T> {
  return { type: "success", value };
}

function failure<E>(error: E): Failure<E> {
  return { type: "failure", error };
}

// Uso
function dividir(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return failure("Divisão por zero");
  }
  return success(a / b);
}

const resultado = dividir(10, 2);

if (resultado.type === "success") {
  // resultado: Success<number>
  console.log(`Resultado: ${resultado.value}`);
} else {
  // resultado: Failure<string>
  console.error(`Erro: ${resultado.error}`);
}
```

### 2. State Management

```typescript
interface IdleState {
  status: "idle";
}

interface LoadingState {
  status: "loading";
  progress: number;
}

interface SuccessState<T> {
  status: "success";
  data: T;
}

interface ErrorState {
  status: "error";
  message: string;
}

type AsyncState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;

function renderState<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case "idle":
      // state: IdleState
      return "Aguardando...";

    case "loading":
      // state: LoadingState
      return `Carregando... ${state.progress}%`;

    case "success":
      // state: SuccessState<T>
      return `Dados: ${JSON.stringify(state.data)}`;

    case "error":
      // state: ErrorState
      return `Erro: ${state.message}`;

    default:
      const _exhaustive: never = state;
      return _exhaustive;
  }
}

// Uso
let state: AsyncState<User> = { status: "idle" };

console.log(renderState(state)); // "Aguardando..."

state = { status: "loading", progress: 50 };
console.log(renderState(state)); // "Carregando... 50%"

state = { status: "success", data: { id: 1, nome: "Ana" } };
console.log(renderState(state)); // "Dados: {...}"
```

### 3. Actions/Events

```typescript
interface LoginAction {
  type: "LOGIN";
  payload: { email: string; senha: string };
}

interface LogoutAction {
  type: "LOGOUT";
}

interface UpdateProfileAction {
  type: "UPDATE_PROFILE";
  payload: { nome: string; avatar?: string };
}

interface DeleteAccountAction {
  type: "DELETE_ACCOUNT";
  payload: { confirmacao: string };
}

type Action =
  | LoginAction
  | LogoutAction
  | UpdateProfileAction
  | DeleteAccountAction;

function reducer(state: any, action: Action): any {
  switch (action.type) {
    case "LOGIN":
      // action: LoginAction
      console.log(`Login com ${action.payload.email}`);
      return { ...state, user: action.payload };

    case "LOGOUT":
      // action: LogoutAction
      console.log("Logout");
      return { ...state, user: null };

    case "UPDATE_PROFILE":
      // action: UpdateProfileAction
      console.log(`Atualizando perfil: ${action.payload.nome}`);
      return { ...state, user: { ...state.user, ...action.payload } };

    case "DELETE_ACCOUNT":
      // action: DeleteAccountAction
      if (action.payload.confirmacao === "DELETAR") {
        return null;
      }
      return state;

    default:
      const _exhaustive: never = action;
      throw new Error(`Action não tratada: ${_exhaustive}`);
  }
}
```

### 4. API Responses

```typescript
interface NotFoundResponse {
  status: 404;
  message: string;
}

interface UnauthorizedResponse {
  status: 401;
  message: string;
}

interface SuccessResponse<T> {
  status: 200;
  data: T;
}

interface ServerErrorResponse {
  status: 500;
  error: string;
}

type ApiResponse<T> =
  | NotFoundResponse
  | UnauthorizedResponse
  | SuccessResponse<T>
  | ServerErrorResponse;

function handleResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case 200:
      // response: SuccessResponse<T>
      console.log("Sucesso:", response.data);
      break;

    case 401:
      // response: UnauthorizedResponse
      console.error("Não autorizado:", response.message);
      redirectToLogin();
      break;

    case 404:
      // response: NotFoundResponse
      console.error("Não encontrado:", response.message);
      break;

    case 500:
      // response: ServerErrorResponse
      console.error("Erro do servidor:", response.error);
      break;

    default:
      const _exhaustive: never = response;
      return _exhaustive;
  }
}
```

### 5. Form Steps/Wizard

```typescript
interface Step1Data {
  step: 1;
  nome: string;
  email: string;
}

interface Step2Data {
  step: 2;
  endereco: string;
  cidade: string;
}

interface Step3Data {
  step: 3;
  cartao: string;
  cvv: string;
}

type WizardData = Step1Data | Step2Data | Step3Data;

function validateStep(data: WizardData): boolean {
  switch (data.step) {
    case 1:
      // data: Step1Data
      return data.nome.length > 0 && data.email.includes("@");

    case 2:
      // data: Step2Data
      return data.endereco.length > 0 && data.cidade.length > 0;

    case 3:
      // data: Step3Data
      return data.cartao.length === 16 && data.cvv.length === 3;

    default:
      const _exhaustive: never = data;
      return false;
  }
}
```

## 🎯 Aplicabilidade

### WebSocket Messages

```typescript
interface ConnectMessage {
  type: "connect";
  clientId: string;
}

interface DisconnectMessage {
  type: "disconnect";
}

interface DataMessage {
  type: "data";
  payload: any;
}

interface ErrorMessage {
  type: "error";
  code: number;
  message: string;
}

type WebSocketMessage =
  | ConnectMessage
  | DisconnectMessage
  | DataMessage
  | ErrorMessage;

function handleMessage(msg: WebSocketMessage): void {
  switch (msg.type) {
    case "connect":
      console.log(`Cliente conectado: ${msg.clientId}`);
      break;

    case "disconnect":
      console.log("Cliente desconectado");
      break;

    case "data":
      processData(msg.payload);
      break;

    case "error":
      console.error(`Erro ${msg.code}: ${msg.message}`);
      break;
  }
}
```

### Command Pattern

```typescript
interface CreateCommand {
  command: "create";
  data: Record<string, any>;
}

interface UpdateCommand {
  command: "update";
  id: number;
  changes: Record<string, any>;
}

interface DeleteCommand {
  command: "delete";
  id: number;
}

interface ListCommand {
  command: "list";
  filters?: Record<string, any>;
}

type Command = CreateCommand | UpdateCommand | DeleteCommand | ListCommand;

async function executeCommand(cmd: Command): Promise<any> {
  switch (cmd.command) {
    case "create":
      return await db.create(cmd.data);

    case "update":
      return await db.update(cmd.id, cmd.changes);

    case "delete":
      return await db.delete(cmd.id);

    case "list":
      return await db.list(cmd.filters);
  }
}
```

## ⚠️ Considerações

### 1. Escolha do Discriminant

```typescript
// ✅ Bom: literal específico
interface A { type: "A"; valueA: string }
interface B { type: "B"; valueB: number }

// ❌ Evite: tipos amplos
interface C { type: string; valueC: boolean } // string genérico não ajuda

// ✅ Bom: vários discriminants possíveis
interface Circle { kind: "circle"; radius: number }
interface Square { kind: "square"; side: number }
```

### 2. Naming Conventions

```typescript
// Comum: "type", "kind", "tag", "variant"
interface A { type: "A" }
interface B { kind: "B" }
interface C { tag: "C" }
interface D { variant: "D" }

// Consistência é importante - escolha um padrão
```

### 3. Generics com Discriminated Unions

```typescript
interface Loading { status: "loading" }
interface Success<T> { status: "success"; data: T }
interface Error { status: "error"; error: string }

type AsyncResult<T> = Loading | Success<T> | Error;

function isSuccess<T>(result: AsyncResult<T>): result is Success<T> {
  return result.status === "success";
}
```

## 📚 Conclusão

Discriminated unions usam propriedade literal comum (discriminant) para identificar uniquamente cada membro de union. TypeScript realiza narrowing automático baseado no discriminant. Permitem exhaustiveness checking - compilador avisa se esquecer de tratar algum caso. Ideais para Result/Either, state management, actions/events, API responses, form wizards e command patterns. Use `switch` com `never` no default para garantir exhaustiveness. Escolha nome de discriminant consistente ("type", "kind", "status"). Pattern matching type-safe sem boilerplate.
