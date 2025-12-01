# User-Defined Type Guards (Type Predicates): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**User-defined type guards** (type predicates) são **funções customizadas** que realizam verificação runtime e informam TypeScript sobre tipo usando sintaxe `valor is Tipo` no retorno. Conceitualmente, representa **custom type assertion**, onde desenvolvedor encapsula lógica de verificação e retorna boolean que TypeScript interpreta como proof of type.

Na essência, materializa o princípio de **programmer-defined narrowing**, permitindo criar guards para tipos complexos que `typeof` e `instanceof` não conseguem verificar (interfaces, types, union types customizados), estendendo capacidade de narrowing do TypeScript.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
interface Usuario {
  nome: string;
  email: string;
}

// Type predicate: retorno é "valor is Usuario"
function isUsuario(valor: unknown): valor is Usuario {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "nome" in valor &&
    "email" in valor &&
    typeof (valor as any).nome === "string" &&
    typeof (valor as any).email === "string"
  );
}

// Uso
function processar(valor: unknown): void {
  if (isUsuario(valor)) {
    // valor: Usuario (narrowed!)
    console.log(`Nome: ${valor.nome}`);
    console.log(`Email: ${valor.email}`);
  } else {
    console.log("Não é usuário");
  }
}

processar({ nome: "Ana", email: "ana@example.com" }); // OK
processar({ nome: "Bob" }); // "Não é usuário"
```

**Conceito-chave:** Retorno `valor is Tipo` informa TypeScript que **quando função retorna true, valor é do tipo especificado**.

### Comparação com Boolean

```typescript
// ❌ Retorno boolean comum - não faz narrowing
function isUsuario1(valor: unknown): boolean {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "nome" in valor &&
    "email" in valor
  );
}

function test1(valor: unknown) {
  if (isUsuario1(valor)) {
    // valor: unknown (não narrowed!)
    // console.log(valor.nome); // ❌ Erro
  }
}

// ✅ Type predicate - faz narrowing
function isUsuario2(valor: unknown): valor is Usuario {
  return (
    typeof valor === "object" &&
    valor !== null &&
    "nome" in valor &&
    "email" in valor
  );
}

function test2(valor: unknown) {
  if (isUsuario2(valor)) {
    // valor: Usuario (narrowed!)
    console.log(valor.nome); // ✅ OK
  }
}
```

## 🔍 Análise Conceitual

### 1. Verificação de Interfaces

```typescript
interface Animal {
  nome: string;
  idade: number;
}

interface Cachorro extends Animal {
  raça: string;
}

interface Gato extends Animal {
  pelagem: string;
}

// Type guard para Cachorro
function isCachorro(animal: Animal): animal is Cachorro {
  return "raça" in animal;
}

// Type guard para Gato
function isGato(animal: Animal): animal is Gato {
  return "pelagem" in animal;
}

// Uso
function descrever(animal: Animal): void {
  console.log(`${animal.nome}, ${animal.idade} anos`);

  if (isCachorro(animal)) {
    // animal: Cachorro
    console.log(`Raça: ${animal.raça}`);
  } else if (isGato(animal)) {
    // animal: Gato
    console.log(`Pelagem: ${animal.pelagem}`);
  }
}
```

### 2. Arrays Tipados

```typescript
// Guard para array de tipo específico
function isStringArray(valor: unknown): valor is string[] {
  return (
    Array.isArray(valor) &&
    valor.every(item => typeof item === "string")
  );
}

function isNumberArray(valor: unknown): valor is number[] {
  return (
    Array.isArray(valor) &&
    valor.every(item => typeof item === "number")
  );
}

// Uso
function processar(arr: unknown): void {
  if (isStringArray(arr)) {
    // arr: string[]
    arr.forEach(str => console.log(str.toUpperCase()));
  } else if (isNumberArray(arr)) {
    // arr: number[]
    const soma = arr.reduce((acc, n) => acc + n, 0);
    console.log(`Soma: ${soma}`);
  }
}

processar(["a", "b", "c"]); // "A" "B" "C"
processar([1, 2, 3]); // "Soma: 6"
```

### 3. Nullable Values

```typescript
// Guard para remover null/undefined
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null;
}

// Uso
const valores: (number | null | undefined)[] = [1, null, 2, undefined, 3];

const limpos = valores.filter(isNonNullable);
// limpos: number[] (narrowed!)

limpos.forEach(n => console.log(n * 2)); // ✅ Safe
```

### 4. Union Type Guards

```typescript
type Sucesso = { tipo: "sucesso"; dados: any };
type Erro = { tipo: "erro"; mensagem: string };
type Resultado = Sucesso | Erro;

// Guard para Sucesso
function isSucesso(resultado: Resultado): resultado is Sucesso {
  return resultado.tipo === "sucesso";
}

// Guard para Erro
function isErro(resultado: Resultado): resultado is Erro {
  return resultado.tipo === "erro";
}

// Uso
function processar(resultado: Resultado): void {
  if (isSucesso(resultado)) {
    // resultado: Sucesso
    console.log("Dados:", resultado.dados);
  } else {
    // resultado: Erro (narrowed automaticamente)
    console.error("Erro:", resultado.mensagem);
  }
}
```

### 5. Validação Complexa

```typescript
interface ConfigValida {
  host: string;
  port: number;
  timeout: number;
}

function isConfigValida(config: unknown): config is ConfigValida {
  if (typeof config !== "object" || config === null) {
    return false;
  }

  const c = config as any;

  return (
    typeof c.host === "string" &&
    c.host.length > 0 &&
    typeof c.port === "number" &&
    c.port > 0 &&
    c.port < 65536 &&
    typeof c.timeout === "number" &&
    c.timeout > 0
  );
}

// Uso
function aplicarConfig(config: unknown): void {
  if (isConfigValida(config)) {
    // config: ConfigValida
    console.log(`Conectando a ${config.host}:${config.port}`);
    console.log(`Timeout: ${config.timeout}ms`);
  } else {
    throw new Error("Configuração inválida");
  }
}
```

## 🎯 Aplicabilidade

### API Response Validation

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

// Uso
async function fetchUser(id: number): Promise<Usuario | null> {
  const response: ApiResponse<Usuario> = await fetch(`/api/users/${id}`)
    .then(r => r.json());

  if (isSuccessResponse(response)) {
    // response: ApiSuccessResponse<Usuario>
    return response.data;
  } else {
    // response: ApiErrorResponse
    console.error(response.error);
    return null;
  }
}
```

### Form Validation

```typescript
interface FormData {
  nome: string;
  email: string;
  idade: number;
}

function isValidFormData(data: unknown): data is FormData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const d = data as any;

  return (
    typeof d.nome === "string" &&
    d.nome.trim().length > 0 &&
    typeof d.email === "string" &&
    d.email.includes("@") &&
    typeof d.idade === "number" &&
    d.idade >= 0 &&
    d.idade < 150
  );
}

function handleSubmit(data: unknown): void {
  if (isValidFormData(data)) {
    // data: FormData
    console.log("Dados válidos:", data);
    salvarNoBackend(data);
  } else {
    console.error("Dados inválidos");
  }
}
```

### Event Guards

```typescript
function isMouseEvent(event: Event): event is MouseEvent {
  return event instanceof MouseEvent;
}

function isKeyboardEvent(event: Event): event is KeyboardEvent {
  return event instanceof KeyboardEvent;
}

function handleEvent(event: Event): void {
  if (isMouseEvent(event)) {
    // event: MouseEvent
    console.log(`Click em ${event.clientX}, ${event.clientY}`);
  } else if (isKeyboardEvent(event)) {
    // event: KeyboardEvent
    console.log(`Tecla pressionada: ${event.key}`);
  }
}
```

### Filter with Type Guards

```typescript
interface Pessoa {
  nome: string;
  idade?: number;
}

function temIdade(pessoa: Pessoa): pessoa is Pessoa & { idade: number } {
  return pessoa.idade !== undefined;
}

const pessoas: Pessoa[] = [
  { nome: "Ana", idade: 25 },
  { nome: "Bob" }, // sem idade
  { nome: "Carol", idade: 30 }
];

const comIdade = pessoas.filter(temIdade);
// comIdade: (Pessoa & { idade: number })[]

comIdade.forEach(p => {
  console.log(`${p.nome}: ${p.idade} anos`); // ✅ idade garantida
});
```

### JSON Parsing

```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "username" in value &&
    "email" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).username === "string" &&
    typeof (value as any).email === "string"
  );
}

function parseUser(json: string): User | null {
  try {
    const parsed = JSON.parse(json);

    if (isUser(parsed)) {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

const user = parseUser('{"id": 1, "username": "ana", "email": "ana@example.com"}');
// user: User | null
```

## ⚠️ Considerações

### 1. Responsabilidade do Desenvolvedor

```typescript
// ❌ Guard mentiroso - TypeScript confia!
function isNumber(value: unknown): value is number {
  return true; // Sempre retorna true (errado!)
}

const x: unknown = "texto";
if (isNumber(x)) {
  // x: number (mas é string!)
  console.log(x.toFixed(2)); // Runtime error!
}

// ✅ Guard correto
function isNumberCorreto(value: unknown): value is number {
  return typeof value === "number";
}
```

### 2. Performance de Validações

```typescript
// ❌ Validação muito custosa
function isValidObject(obj: unknown): obj is ComplexType {
  // Serializar para validar
  const json = JSON.stringify(obj);
  // Parse e validação profunda
  // Muito lento!
}

// ✅ Validação eficiente
function isValidObjectRapido(obj: unknown): obj is ComplexType {
  // Verificar apenas propriedades essenciais
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj
  );
}
```

### 3. Generics em Type Guards

```typescript
// Type guard genérico
function isArrayOf<T>(
  arr: unknown,
  guard: (item: unknown) => item is T
): arr is T[] {
  return Array.isArray(arr) && arr.every(guard);
}

// Uso
function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

const nums: unknown = [1, 2, 3];
if (isArrayOf(nums, isNumber)) {
  // nums: number[]
  console.log(nums.map(n => n * 2));
}
```

## 📚 Conclusão

User-defined type guards (`valor is Tipo`) permitem criar funções customizadas que realizam narrowing através de type predicates. Essenciais para validar interfaces, types, unions customizados e estruturas que `typeof`/`instanceof` não conseguem. Retorno booleano informa TypeScript sobre tipo quando true. Responsabilidade do desenvolvedor garantir verificação correta - TypeScript confia na asserção. Ideais para API validation, form data, JSON parsing, nullable filtering e event handling. Combine verificações runtime com type predicates para type-safe operations sem type assertions.
