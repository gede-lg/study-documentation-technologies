# Erro de Compilação vs Runtime

## 🎯 Introdução e Definição

### Definição Conceitual

**Erro de compilação vs runtime** refere-se à distinção fundamental entre **erros detectados durante compile-time** (quando TypeScript é transpilado para JavaScript) e **erros detectados durante runtime** (quando JavaScript é executado). Esta distinção é **absolutamente central** para compreender TypeScript, pois TypeScript adiciona **static type checking** (verificação estática de tipos) que detecta erros **antes** de executar código, enquanto JavaScript detecta erros **apenas** durante execução.

Conceitualmente, **compile-time errors** (ou **static errors**) são problemas que TypeScript **type checker** identifica analisando código **sem executá-lo** - incompatibilidades de tipo, propriedades inexistentes, argumentos incorretos. Já **runtime errors** (ou **dynamic errors**) são problemas que só aparecem **durante execução** - null reference, division by zero, network failures, JSON parse errors.

A distinção é crucial porque TypeScript usa **type erasure** - types são removidos durante transpilação, gerando JavaScript puro. Logo, **type information não existe em runtime** - apenas em compile-time. Isso significa que TypeScript **não adiciona runtime checks** - apenas compile-time checks.

### Contexto Histórico e Motivação

**JavaScript (1995):** Apenas **runtime error detection** - erros descobertos durante execução. Sem type system, bugs de tipo eram comuns.

**Static Analysis Tools (2000s):** JSLint, JSHint introduziram **static analysis** - detectar problemas sem executar código.

**TypeScript (2012):** Introduziu **compile-time type checking** - detectar incompatibilidades de tipo antes de executar.

**Motivação para compile-time checking:**
- **Fail Fast:** Detectar erros em desenvolvimento, não em produção
- **Better DX:** IDEs mostram erros em tempo real
- **Refactoring Safety:** Mudanças que quebram contratos são detectadas
- **Documentation:** Types documentam contratos esperados

**Type Erasure:**
- Types são removidos durante transpilação
- JavaScript gerado não tem type information
- Runtime behavior é idêntico a JavaScript puro
- TypeScript não adiciona runtime overhead

### Problema Fundamental que Resolve

A distinção compile-time vs runtime resolve dois problemas:

**1. Early Error Detection (Compile-Time)**

Sem TypeScript (apenas JavaScript):
```javascript
// JavaScript - erro só aparece em runtime
function somar(a, b) {
  return a + b;
}

somar(5, "10");  // "510" - bug silencioso (type coercion)
somar(5);  // NaN - undefined + 5
```

Com TypeScript (compile-time checking):
```typescript
// TypeScript - erro detectado antes de executar
function somar(a: number, b: number): number {
  return a + b;
}

somar(5, "10");  // ❌ Compile error: Argument of type 'string' is not assignable to parameter of type 'number'
somar(5);  // ❌ Compile error: Expected 2 arguments, but got 1
```

**2. Runtime Error Limitation (Type Erasure)**

TypeScript não previne todos runtime errors:
```typescript
// ✅ Type-safe em compile-time
function dividir(a: number, b: number): number {
  return a / b;
}

dividir(10, 0);  // Infinity - não é erro em JavaScript
// TypeScript não adiciona check: if (b === 0) throw Error

// ✅ Type-safe, mas runtime error
const obj: { valor: number } | null = Math.random() > 0.5 ? { valor: 10 } : null;
// obj.valor;  // ❌ Compile error: Object is possibly 'null'

const obj2: any = null;
obj2.valor;  // ✅ Compile OK (any bypassa checking), mas TypeError em runtime
```

### Importância no Ecossistema

Compreender compile-time vs runtime errors é crucial porque:

- **TypeScript Limitations:** TypeScript não é runtime type checker - apenas compile-time
- **Defensive Programming:** Runtime checks ainda são necessários
- **Testing Strategy:** Testes focam em runtime errors que compilador não detecta
- **Production Bugs:** Erros em produção são sempre runtime errors
- **Type Assertions:** `as` assertions não validam em runtime

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Compile-Time Errors:** Detectados por TypeScript type checker, antes de executar
2. **Runtime Errors:** Detectados durante execução JavaScript
3. **Type Erasure:** Types são removidos - não existem em runtime
4. **Static Analysis:** TypeScript analisa código sem executá-lo
5. **No Runtime Overhead:** TypeScript não adiciona runtime checks

### Pilares Fundamentais

- **Type Checking:** Compile-time - valida compatibilidade de tipos
- **Type Erasure:** Runtime - types desaparecem
- **Transpilation:** TypeScript → JavaScript (sem types)
- **Static Safety:** Erros detectados antes de executar
- **Dynamic Validation:** Runtime checks ainda necessários

### Visão Geral das Nuances

- **Strict Mode:** `strict: true` aumenta compile-time checking
- **Any Type:** `any` bypassa compile-time checking - move erros para runtime
- **Non-Null Assertion:** `!` bypassa null checking - pode causar runtime error
- **Type Assertions:** `as` não valida em runtime
- **Defensive Programming:** Runtime validations ainda necessárias

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Compilation Pipeline

```
TypeScript Source Code
        ↓
[Type Checking] → Compile-Time Errors detectados
        ↓
[Transpilation] → Types removidos (Type Erasure)
        ↓
JavaScript Code (sem types)
        ↓
[Execution] → Runtime Errors detectados
```

**Análise profunda:**

**1. Type Checking Phase (Compile-Time)**
- TypeScript type checker analisa código
- Valida compatibilidade de tipos
- Detecta incompatibilidades, propriedades inexistentes, argumentos incorretos
- Erros impedem geração de JavaScript (se `noEmitOnError: true`)

**2. Type Erasure Phase (Transpilation)**
- Types e interfaces são removidos
- Apenas código JavaScript puro permanece
- Type guards viram código JavaScript regular
- Type information não existe em runtime

**3. Runtime Phase (Execution)**
- JavaScript é executado (Node.js, browser)
- Erros que TypeScript não previu aparecem
- Null reference, division by zero, network errors
- TypeScript não adiciona runtime checks

### Princípios e Conceitos Subjacentes

#### Compile-Time Error Detection

```typescript
// ❌ Compile-Time Error - type mismatch
const idade: number = "25";  
// Type 'string' is not assignable to type 'number'

// ❌ Compile-Time Error - property doesn't exist
interface Usuario {
  nome: string;
}
const usuario: Usuario = { nome: "Ana" };
usuario.idade;  
// Property 'idade' does not exist on type 'Usuario'

// ❌ Compile-Time Error - wrong argument count
function somar(a: number, b: number): number {
  return a + b;
}
somar(5);  
// Expected 2 arguments, but got 1

// ❌ Compile-Time Error - incompatible return type
function obterNome(): string {
  return 123;  
  // Type 'number' is not assignable to type 'string'
}
```

**Conceito fundamental:** Compile-time errors são detectados por **static analysis** - TypeScript analisa código sem executá-lo.

#### Runtime Error Examples

```typescript
// ✅ Type-safe, mas runtime error
function processar(obj: any): void {
  console.log(obj.nome.toUpperCase());  
}
processar(null);  
// TypeError: Cannot read property 'nome' of null

// ✅ Type-safe, mas array out of bounds
const arr: number[] = [1, 2, 3];
const valor = arr[100];  // undefined
valor.toFixed(2);  
// TypeError: Cannot read property 'toFixed' of undefined

// ✅ Type-safe, mas JSON parse error
const dados = '{ invalido }';
JSON.parse(dados);  
// SyntaxError: Unexpected token i in JSON

// ✅ Type-safe, mas network error
async function buscarUsuario(id: number): Promise<any> {
  const response = await fetch(`/api/usuarios/${id}`);
  return response.json();
}
buscarUsuario(999);  // 404 Not Found em runtime
```

**Fundamento teórico:** Runtime errors ocorrem durante **execução** e não podem ser previstos por type system estático.

#### Type Erasure in Action

TypeScript:
```typescript
interface Usuario {
  nome: string;
  idade: number;
}

function cumprimentar(usuario: Usuario): string {
  return `Olá, ${usuario.nome}!`;
}

const usuario: Usuario = { nome: "Ana", idade: 30 };
cumprimentar(usuario);
```

JavaScript gerado (após transpilação):
```javascript
function cumprimentar(usuario) {
  return `Olá, ${usuario.nome}!`;
}

const usuario = { nome: "Ana", idade: 30 };
cumprimentar(usuario);
```

**Análise profunda:** Interface `Usuario` e type annotations **desaparecem** - JavaScript gerado é idêntico a código JavaScript puro.

#### Type Guards - Compile vs Runtime

```typescript
interface Cachorro {
  latir(): void;
}

interface Gato {
  miar(): void;
}

type Animal = Cachorro | Gato;

// ❌ Compile error
function fazerBarulho(animal: Animal): void {
  animal.latir();  
  // Property 'latir' does not exist on type 'Animal'
  // Property 'latir' does not exist on type 'Gato'
}

// ✅ Type guard - compile-time narrowing + runtime check
function fazerBarulho2(animal: Animal): void {
  if ("latir" in animal) {  // Runtime check
    animal.latir();  // Compile-time narrowing para Cachorro
  } else {
    animal.miar();  // Compile-time narrowing para Gato
  }
}
```

**JavaScript gerado:**
```javascript
function fazerBarulho2(animal) {
  if ("latir" in animal) {  // Runtime check permanece
    animal.latir();
  } else {
    animal.miar();
  }
}
```

**Conceito crucial:** Type guard tem **dupla função** - compile-time narrowing (TypeScript entende tipo) + runtime check (código JavaScript valida).

### Modelo Mental para Compreensão

Pense em compile-time vs runtime como **duas fases distintas**:

**Compile-Time (Build Phase):**
- "Inspeção de documentos" - TypeScript valida contratos
- Erros impedem geração de JavaScript
- Type information disponível
- Static analysis - sem executar código

**Runtime (Execution Phase):**
- "Operação real" - JavaScript executa
- Erros aparecem durante execução
- Type information não existe (type erasure)
- Dynamic validation - apenas o que código valida explicitamente

## 🔍 Análise Conceitual Profunda

### Compile-Time Checking - Casos Detalhados

```typescript
// Type incompatibility
const nome: string = 123;  // ❌ Compile error

// Missing properties
interface Config {
  host: string;
  port: number;
}
const config: Config = { host: "localhost" };  // ❌ Missing 'port'

// Excess properties
const config2: Config = { 
  host: "localhost", 
  port: 3000,
  timeout: 5000  // ❌ 'timeout' does not exist in type 'Config'
};

// Function signature mismatch
function calcular(x: number, y: number): number {
  return x + y;
}
const resultado: string = calcular(5, 10);  // ❌ Type 'number' is not assignable to type 'string'

// Undefined/null access (strict mode)
const usuario: { nome: string } | undefined = undefined;
usuario.nome;  // ❌ Object is possibly 'undefined'

// Wrong method call
const valor: number = 10;
valor.toUpperCase();  // ❌ Property 'toUpperCase' does not exist on type 'number'
```

**Fundamento conceitual:** Compile-time errors violam **contratos de tipo** - TypeScript detecta incompatibilidades sem executar código.

### Runtime Errors - Cenários Típicos

```typescript
// Null dereferencing (com any ou non-null assertion)
const obj: any = null;
obj.metodo();  // TypeError em runtime

const obj2: { valor: number } | null = null;
obj2!.valor;  // TypeError em runtime (! bypassa checking)

// Array index out of bounds
const arr: number[] = [1, 2, 3];
console.log(arr[100]);  // undefined - não é erro
arr[100].toString();  // TypeError: Cannot read property 'toString' of undefined

// Type coercion producing unexpected results
const resultado = "5" * "10";  // 50 (coerção implícita)
const invalido = "abc" * "def";  // NaN

// Division by zero
const div = 10 / 0;  // Infinity - não é erro em JavaScript

// JSON parsing
const json = '{ "nome": "Ana" }';
const dados = JSON.parse(json);  // OK
const invalido2 = JSON.parse('{ invalido }');  // SyntaxError em runtime

// Network errors
fetch("/api/dados")
  .then(r => r.json())
  .catch(err => console.log(err));  // Network error em runtime

// Async errors
async function processar() {
  const dados = await fetch("/api");  // Pode falhar em runtime
  return dados.json();
}
```

**Análise profunda:** Runtime errors ocorrem em **tempo de execução** - TypeScript não adiciona runtime checks, apenas compile-time checks.

### Type Erasure - Exemplos Avançados

TypeScript:
```typescript
// Generic function
function primeiro<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Type assertion
const valor = obterValor() as string;

// Union type
function processar(x: string | number): void {
  if (typeof x === "string") {
    console.log(x.toUpperCase());
  } else {
    console.log(x.toFixed(2));
  }
}

// Enum
enum Cor {
  Vermelho,
  Verde,
  Azul
}

const cor: Cor = Cor.Vermelho;
```

JavaScript gerado:
```javascript
// Generic <T> desaparece
function primeiro(arr) {
  return arr[0];
}

// Type assertion desaparece
const valor = obterValor();

// Union type desaparece, mas typeof check permanece
function processar(x) {
  if (typeof x === "string") {
    console.log(x.toUpperCase());
  } else {
    console.log(x.toFixed(2));
  }
}

// Enum vira objeto JavaScript
var Cor;
(function (Cor) {
  Cor[Cor["Vermelho"] = 0] = "Vermelho";
  Cor[Cor["Verde"] = 1] = "Verde";
  Cor[Cor["Azul"] = 2] = "Azul";
})(Cor || (Cor = {}));

const cor = Cor.Vermelho;
```

**Conceito avançado:** Types desaparecem, mas **enums viram código JavaScript** - única exceção de type erasure.

### Strict Mode Impact

```typescript
// tsconfig.json: "strict": false
let nome;  // Implicitamente 'any' - bypassa checking
nome = 5;
nome = "texto";
nome.toUpperCase();  // Runtime error se nome for number

function processar(obj) {  // Implicitamente 'any'
  return obj.valor * 2;  // Compile OK, runtime error se obj for null
}

// tsconfig.json: "strict": true
let nome2;  // ❌ Variable 'nome2' implicitly has an 'any' type

function processar2(obj) {  // ❌ Parameter 'obj' implicitly has an 'any' type
  return obj.valor * 2;
}

const usuario: { nome?: string } = {};
usuario.nome.toUpperCase();  // ❌ Object is possibly 'undefined'
```

**Fundamento teórico:** **Strict mode** aumenta compile-time checking - mais erros detectados antes de executar, menos em runtime.

### Any Type - Moving Errors to Runtime

```typescript
// any bypassa compile-time checking
const valor: any = "texto";
const numero: number = valor;  // ✅ Compile OK
numero.toFixed(2);  // TypeError em runtime: numero.toFixed is not a function

// any propaga
function processar(x: any) {
  return x.toUpperCase();  // ✅ Compile OK
}
processar(123);  // TypeError em runtime

// Comparação: com types corretos
const valor2: string = "texto";
const numero2: number = valor2;  // ❌ Compile error
// Erro detectado em compile-time, não em runtime
```

**Limitação:** `any` type **desabilita compile-time checking** - type errors viram runtime errors.

### Non-Null Assertion Operator

```typescript
interface Usuario {
  nome: string;
}

const usuario: Usuario | null = obterUsuario();

// ❌ Compile error
// usuario.nome;  // Object is possibly 'null'

// ✅ Compile OK com non-null assertion
usuario!.nome;  // ⚠️ Se usuario for null, runtime error

// ✅ Melhor: type guard (compile-time narrowing + runtime check)
if (usuario !== null) {
  usuario.nome;  // Safe
}
```

**Análise profunda:** Non-null assertion (`!`) **bypassa compile-time checking** - pode transformar compile error em runtime error.

### Type Assertions

```typescript
// Type assertion não valida em runtime
const elemento = document.getElementById("meuId") as HTMLInputElement;
elemento.value = "texto";  
// ✅ Compile OK
// ⚠️ Se elemento for null ou não for input, runtime error

// Assertion pode mascarar type error
const numero: number = "123" as any as number;  // ✅ Compile OK (forçado)
numero.toFixed(2);  // TypeError: numero.toFixed is not a function

// Melhor: validação explícita
const elemento2 = document.getElementById("meuId");
if (elemento2 instanceof HTMLInputElement) {
  elemento2.value = "texto";  // Safe
}
```

**Limitação:** Type assertions **não validam em runtime** - apenas dizem ao TypeScript "confie em mim".

### Defensive Programming - Runtime Checks

```typescript
// TypeScript não adiciona runtime checks
function dividir(a: number, b: number): number {
  return a / b;  // Sem check de divisão por zero
}
dividir(10, 0);  // Infinity

// Defensive programming - adicionar runtime checks manualmente
function dividirSafe(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

// Runtime validation para external data
interface Usuario {
  nome: string;
  idade: number;
}

function processarUsuario(dados: any): Usuario {
  // ❌ Unsafe - assume que dados tem shape correta
  // return dados as Usuario;
  
  // ✅ Safe - runtime validation
  if (
    typeof dados !== "object" ||
    typeof dados.nome !== "string" ||
    typeof dados.idade !== "number"
  ) {
    throw new Error("Dados inválidos");
  }
  return dados;
}
```

**Conceito crucial:** TypeScript não adiciona runtime checks - **defensive programming** ainda necessário.

### Runtime Type Checking Libraries

```typescript
// Zod - runtime validation
import { z } from "zod";

const UsuarioSchema = z.object({
  nome: z.string(),
  idade: z.number(),
});

function processarUsuario(dados: unknown) {
  const usuario = UsuarioSchema.parse(dados);  // Runtime validation
  // Se passar, 'usuario' tem type { nome: string; idade: number }
  console.log(usuario.nome);
}

// io-ts - runtime type checking
import * as t from "io-ts";

const UsuarioType = t.type({
  nome: t.string,
  idade: t.number,
});

function processar(dados: unknown) {
  if (UsuarioType.is(dados)) {
    // Type narrowing + runtime check
    console.log(dados.nome);
  }
}
```

**Fundamento teórico:** Libraries como Zod/io-ts adicionam **runtime type checking** que TypeScript não fornece.

## 🎯 Aplicabilidade e Contextos

### Development Workflow

```typescript
// 1. Editor mostra compile errors em tempo real
const idade: number = "25";  // ❌ Squiggle vermelho no editor

// 2. tsc compila e detecta errors
// $ tsc
// error TS2322: Type 'string' is not assignable to type 'number'

// 3. Runtime errors durante execução
const obj: any = null;
obj.metodo();  // ❌ TypeError em runtime

// 4. Tests detectam runtime errors
test("processar deve funcionar", () => {
  expect(processar(null)).toThrow();  // Runtime error
});
```

**Raciocínio:** Compile errors em desenvolvimento, runtime errors em execução/testes.

### API Response Validation

```typescript
// ❌ Unsafe - assume que API retorna shape correto
async function buscarUsuario(id: number): Promise<Usuario> {
  const response = await fetch(`/api/usuarios/${id}`);
  return response.json();  // ⚠️ Sem runtime validation
}

// ✅ Safe - runtime validation
async function buscarUsuarioSafe(id: number): Promise<Usuario> {
  const response = await fetch(`/api/usuarios/${id}`);
  const dados = await response.json();
  
  // Runtime validation
  if (
    typeof dados !== "object" ||
    typeof dados.nome !== "string" ||
    typeof dados.idade !== "number"
  ) {
    throw new Error("Resposta inválida da API");
  }
  
  return dados;
}
```

**Raciocínio:** External data precisa de **runtime validation** - types não garantem shape.

## ⚠️ Limitações e Considerações Teóricas

### TypeScript Não é Runtime Type Checker

```typescript
// TypeScript não adiciona runtime checks
function processar(x: number): void {
  console.log(x.toFixed(2));
}

const valor: any = "texto";
processar(valor);  // ✅ Compile OK, TypeError em runtime
```

**Limitação:** Type erasure - types não existem em runtime.

### Type Assertions Não Validam

```typescript
const dados = obterDados() as Usuario;  
// ✅ Compile OK
// ⚠️ Se dados não tiver shape correto, runtime error
```

**Limitação:** Assertions apenas mudam type em compile-time - não validam.

## 🔗 Interconexões Conceituais

**Relação com Type Erasure:** Types removidos - não existem em runtime.

**Relação com Strict Mode:** Aumenta compile-time checking.

**Relação com Testing:** Testes focam em runtime errors.

**Relação com Defensive Programming:** Runtime checks ainda necessários.

## 🚀 Evolução e Próximos Conceitos

Dominar compile vs runtime prepara para:
- **Error Object:** Classe Error e propriedades
- **Try/Catch:** Handling runtime errors
- **Custom Errors:** Criar classes de erro customizadas
- **Runtime Validation:** Libraries como Zod/io-ts
