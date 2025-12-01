# Instanceof Guard: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Instanceof guard** é técnica de **type narrowing** usando operador JavaScript `instanceof` para verificar se objeto é instância de classe/construtor específico, permitindo TypeScript **refinar tipo para classe concreta**. Conceitualmente, representa **prototype chain inspection**, onde verificação runtime examina cadeia de protótipos e informa sistema de tipos sobre tipo exato do objeto.

Na essência, materializa o princípio de **runtime type identification**, onde herança e prototype chain são usados para determinar tipo verdadeiro de objeto polimórfico, essencial para trabalhar com classes e hierarquias de tipos.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
class Cachorro {
  latir() {
    console.log("Au au!");
  }
}

class Gato {
  miar() {
    console.log("Miau!");
  }
}

function fazerBarulho(animal: Cachorro | Gato) {
  // Antes: Cachorro | Gato
  if (animal instanceof Cachorro) {
    // Dentro: Cachorro
    animal.latir(); // ✅ OK
    // animal.miar(); // ❌ Erro: miar não existe em Cachorro
  } else {
    // Aqui: Gato (único tipo restante)
    animal.miar(); // ✅ OK
  }
}

const dog = new Cachorro();
const cat = new Gato();

fazerBarulho(dog); // "Au au!"
fazerBarulho(cat); // "Miau!"
```

**Conceito-chave:** `instanceof` verifica **prototype chain** e TypeScript usa isso para **narrow type**.

### Com Herança

```typescript
class Animal {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
}

class Cachorro extends Animal {
  raça: string;
  constructor(nome: string, raça: string) {
    super(nome);
    this.raça = raça;
  }
}

class Gato extends Animal {
  pelagem: string;
  constructor(nome: string, pelagem: string) {
    super(nome);
    this.pelagem = pelagem;
  }
}

function descrever(animal: Animal) {
  console.log(`Nome: ${animal.nome}`);

  if (animal instanceof Cachorro) {
    // animal: Cachorro
    console.log(`Raça: ${animal.raça}`);
  } else if (animal instanceof Gato) {
    // animal: Gato
    console.log(`Pelagem: ${animal.pelagem}`);
  }
}
```

## 🔍 Análise Conceitual

### 1. Error Handling

```typescript
function processar(valor: unknown): void {
  try {
    // Processar valor
    throw new Error("Algo deu errado");
  } catch (error) {
    // error: unknown por padrão

    if (error instanceof Error) {
      // error: Error
      console.error(`Erro: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    } else {
      // error: unknown (pode ser qualquer coisa)
      console.error("Erro desconhecido:", error);
    }
  }
}

// Custom errors
class ValidationError extends Error {
  constructor(
    message: string,
    public campo: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

function handleError(error: unknown): void {
  if (error instanceof ValidationError) {
    // error: ValidationError
    console.error(`Campo inválido: ${error.campo}`);
  } else if (error instanceof NetworkError) {
    // error: NetworkError
    console.error(`Erro de rede (${error.statusCode}): ${error.message}`);
  } else if (error instanceof Error) {
    // error: Error
    console.error(`Erro: ${error.message}`);
  } else {
    console.error("Erro desconhecido");
  }
}
```

### 2. Built-in Types

```typescript
function processar(valor: unknown): string {
  if (valor instanceof Date) {
    // valor: Date
    return valor.toISOString();
  }

  if (valor instanceof Array) {
    // valor: any[] (não infere tipo do elemento)
    return `Array com ${valor.length} elementos`;
  }

  if (valor instanceof RegExp) {
    // valor: RegExp
    return valor.source;
  }

  if (valor instanceof Map) {
    // valor: Map<unknown, unknown>
    return `Map com ${valor.size} entradas`;
  }

  if (valor instanceof Set) {
    // valor: Set<unknown>
    return `Set com ${valor.size} elementos`;
  }

  return String(valor);
}

console.log(processar(new Date())); // "2025-01-15T..."
console.log(processar([1, 2, 3])); // "Array com 3 elementos"
console.log(processar(/test/)); // "test"
```

### 3. DOM Elements

```typescript
function handleElement(element: Element): void {
  if (element instanceof HTMLInputElement) {
    // element: HTMLInputElement
    console.log(`Valor: ${element.value}`);
    element.focus();
  } else if (element instanceof HTMLButtonElement) {
    // element: HTMLButtonElement
    console.log(`Texto: ${element.textContent}`);
    element.disabled = true;
  } else if (element instanceof HTMLDivElement) {
    // element: HTMLDivElement
    element.style.backgroundColor = "red";
  }
}

// Event handling
function handleEvent(event: Event): void {
  if (event instanceof MouseEvent) {
    // event: MouseEvent
    console.log(`Posição: ${event.clientX}, ${event.clientY}`);
  } else if (event instanceof KeyboardEvent) {
    // event: KeyboardEvent
    console.log(`Tecla: ${event.key}`);
  } else if (event instanceof FocusEvent) {
    // event: FocusEvent
    console.log(`Alvo: ${event.target}`);
  }
}
```

### 4. Union de Classes

```typescript
class Sucesso<T> {
  constructor(public data: T) {}
}

class Falha<E> {
  constructor(public error: E) {}
}

type Resultado<T, E> = Sucesso<T> | Falha<E>;

function processar<T, E>(resultado: Resultado<T, E>): void {
  if (resultado instanceof Sucesso) {
    // resultado: Sucesso<T>
    console.log("Dados:", resultado.data);
  } else {
    // resultado: Falha<E>
    console.error("Erro:", resultado.error);
  }
}

const ok = new Sucesso({ id: 1, nome: "Ana" });
const err = new Falha("Falha ao buscar dados");

processar(ok); // "Dados: { id: 1, nome: 'Ana' }"
processar(err); // "Erro: Falha ao buscar dados"
```

### 5. Múltiplas Verificações

```typescript
class Usuario {
  constructor(public nome: string) {}
}

class Admin extends Usuario {
  constructor(nome: string, public nivel: number) {
    super(nome);
  }
}

class SuperAdmin extends Admin {
  constructor(nome: string, nivel: number, public permissions: string[]) {
    super(nome, nivel);
  }
}

function verificarPermissoes(user: Usuario): void {
  console.log(`Usuário: ${user.nome}`);

  if (user instanceof SuperAdmin) {
    // user: SuperAdmin
    console.log(`SuperAdmin com ${user.permissions.length} permissões`);
    console.log(`Nível: ${user.nivel}`);
  } else if (user instanceof Admin) {
    // user: Admin (não SuperAdmin)
    console.log(`Admin nível ${user.nivel}`);
  } else {
    // user: Usuario (não Admin nem SuperAdmin)
    console.log("Usuário comum");
  }
}
```

## 🎯 Aplicabilidade

### API Response Classes

```typescript
class ApiSuccessResponse<T> {
  constructor(
    public data: T,
    public status: number
  ) {}
}

class ApiErrorResponse {
  constructor(
    public message: string,
    public code: number
  ) {}
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return new ApiSuccessResponse(data, response.status);
  } catch (error) {
    return new ApiErrorResponse("Falha na requisição", 500);
  }
}

// Uso
const response = await fetchData<User>("/api/user");

if (response instanceof ApiSuccessResponse) {
  // response: ApiSuccessResponse<User>
  console.log(response.data.nome);
} else {
  // response: ApiErrorResponse
  console.error(`Erro ${response.code}: ${response.message}`);
}
```

### State Pattern

```typescript
abstract class State {
  abstract handle(): void;
}

class IdleState extends State {
  handle() {
    console.log("Sistema ocioso");
  }
}

class LoadingState extends State {
  constructor(public progress: number) {
    super();
  }

  handle() {
    console.log(`Carregando... ${this.progress}%`);
  }
}

class ErrorState extends State {
  constructor(public error: string) {
    super();
  }

  handle() {
    console.error(`Erro: ${this.error}`);
  }
}

class App {
  constructor(private state: State) {}

  setState(state: State) {
    this.state = state;

    if (state instanceof LoadingState) {
      // state: LoadingState
      console.log(`Progresso atual: ${state.progress}%`);
    } else if (state instanceof ErrorState) {
      // state: ErrorState
      this.notifyError(state.error);
    }

    this.state.handle();
  }

  private notifyError(error: string) {
    console.error("Notificando erro:", error);
  }
}
```

### Command Pattern

```typescript
abstract class Command {
  abstract execute(): void;
}

class CreateCommand extends Command {
  constructor(private data: any) {
    super();
  }

  execute() {
    console.log("Criando:", this.data);
  }
}

class DeleteCommand extends Command {
  constructor(private id: number) {
    super();
  }

  execute() {
    console.log("Deletando ID:", this.id);
  }
}

class UpdateCommand extends Command {
  constructor(
    private id: number,
    private data: any
  ) {
    super();
  }

  execute() {
    console.log("Atualizando ID:", this.id, "com", this.data);
  }
}

function processarComando(cmd: Command): void {
  if (cmd instanceof CreateCommand) {
    // cmd: CreateCommand
    console.log("Preparando para criar");
  } else if (cmd instanceof DeleteCommand) {
    // cmd: DeleteCommand
    console.log("Preparando para deletar");
  }

  cmd.execute();
}
```

## ⚠️ Considerações

### 1. Não Funciona com Interfaces

```typescript
interface Usuario {
  nome: string;
}

function processar(user: Usuario | string) {
  // ❌ Erro: 'Usuario' only refers to a type, but is being used as a value here
  // if (user instanceof Usuario) { }

  // ✅ Use typeof ou property check
  if (typeof user === "string") {
    console.log(user.toUpperCase());
  } else {
    console.log(user.nome);
  }
}
```

### 2. Transpilação e Polyfills

```typescript
// Classes modernas podem não funcionar em JS antigo
class MinhaClasse {
  constructor(public valor: number) {}
}

// Em ES5, instanceof pode não funcionar como esperado
// Certifique-se que target no tsconfig é compatível
```

### 3. Instanceof com Generics

```typescript
class Container<T> {
  constructor(public value: T) {}
}

function processar<T>(valor: Container<T> | T): void {
  if (valor instanceof Container) {
    // valor: Container<T>
    console.log(valor.value);
  } else {
    // valor: T
    console.log(valor);
  }
}
```

### 4. Arrays e Typed Arrays

```typescript
function processar(arr: unknown): void {
  if (arr instanceof Array) {
    // arr: any[]
    console.log(`Array com ${arr.length} elementos`);
  }

  // Para typed arrays
  if (arr instanceof Int32Array) {
    // arr: Int32Array
    console.log("Int32Array");
  }

  if (arr instanceof Uint8Array) {
    // arr: Uint8Array
    console.log("Uint8Array");
  }
}
```

## 📚 Conclusão

Instanceof guard verifica se objeto é instância de classe através de prototype chain, refinando tipo para classe específica. Funciona com classes, built-ins (Date, Array, Error, RegExp, Map, Set), DOM elements e custom classes. Essencial para error handling (Error subclasses), polimorfismo, state/command patterns e API responses tipadas. Não funciona com interfaces (apenas runtime). Cuidado com transpilação para ES5. Combine com typeof e property checks para verificações completas. Permite type-safe operations em hierarquias de classes sem type assertions.
