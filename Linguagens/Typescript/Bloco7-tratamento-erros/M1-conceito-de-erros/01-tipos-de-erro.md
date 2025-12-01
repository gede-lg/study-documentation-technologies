# Tipos de Erro em TypeScript

## 🎯 Introdução e Definição

### Definição Conceitual

**Tipos de erro em TypeScript** referem-se às diferentes **categorias de problemas** que podem ocorrer durante desenvolvimento, compilação e execução de código TypeScript. Esses erros são classificados em **quatro categorias principais**: **syntax errors** (erros de sintaxe), **type errors** (erros de tipo), **runtime errors** (erros de execução), e **logical errors** (erros lógicos). Cada categoria representa um **momento diferente** na detecção do problema e requer **estratégias distintas** de prevenção e correção.

Conceitualmente, TypeScript introduz uma **camada adicional de verificação** comparado a JavaScript puro - **compile-time type checking**. Isso permite detectar **type errors** antes de executar código, reduzindo significativamente bugs que chegariam a produção. Porém, TypeScript não elimina **runtime errors** (erros que só aparecem durante execução) nem **logical errors** (código sintaticamente correto e type-safe, mas com lógica incorreta).

### Contexto Histórico e Motivação

A evolução de error handling:

**JavaScript (1995):** Apenas **runtime errors** - erros descobertos durante execução. Sem type checking, bugs de tipo eram comuns (`undefined is not a function`).

**Linters (JSLint, ESLint):** Introduziram **static analysis** - detectar problemas potenciais sem executar código (variáveis não usadas, comparações suspeitas).

**TypeScript (2012):** Adicionou **compile-time type checking** - detectar erros de tipo antes de executar. Motivação: **"Fail fast"** - detectar erros o mais cedo possível no ciclo de desenvolvimento.

**Error Categories:**
- **Syntax Errors:** Sempre existiram - código malformado que nem parser consegue processar
- **Type Errors:** Introduzidos por TypeScript - incompatibilidades de tipo detectadas em compile-time
- **Runtime Errors:** Sempre existiram - erros durante execução (null reference, division by zero)
- **Logical Errors:** Sempre existiram - código funciona mas produz resultado incorreto

**Motivação para type checking:**
- **Early Detection:** Detectar erros em desenvolvimento, não em produção
- **Better Tooling:** IDEs mostram erros em tempo real
- **Documentation:** Types documentam contratos esperados
- **Refactoring Safety:** Mudanças que quebram contratos são detectadas

### Problema Fundamental que Resolve

Diferentes tipos de erro ajudam a identificar problemas em diferentes estágios:

**1. Syntax Errors - Detectados Imediatamente**
```typescript
// ❌ Syntax Error - código malformado
const x = ;  // SyntaxError: Unexpected token ';'
functio soma() {}  // SyntaxError: Unexpected token 'soma'
```

**2. Type Errors - Detectados em Compile-Time**
```typescript
// ❌ Type Error - incompatibilidade de tipo
const num: number = "texto";  // Type 'string' is not assignable to type 'number'

function somar(a: number, b: number) {
  return a + b;
}
somar(5, "10");  // Argument of type 'string' is not assignable to parameter of type 'number'
```

**3. Runtime Errors - Detectados Durante Execução**
```typescript
// ✅ Type-safe, mas erro em runtime
const obj: any = null;
obj.metodo();  // TypeError: Cannot read property 'metodo' of null

const arr = [1, 2, 3];
arr[10].toString();  // TypeError: Cannot read property 'toString' of undefined
```

**4. Logical Errors - Passam Despercebidos**
```typescript
// ✅ Sintaticamente correto, type-safe, mas lógica errada
function calcularDesconto(preco: number, desconto: number): number {
  return preco + desconto;  // ❌ Deveria subtrair, não somar!
}

calcularDesconto(100, 10);  // 110 - errado, mas sem erro
```

### Importância no Ecossistema

Compreender tipos de erro é importante porque:

- **Development Workflow:** Cada tipo exige estratégia diferente de detecção/correção
- **Tooling:** IDEs, linters, compiladores detectam diferentes tipos
- **Testing Strategy:** Testes focam em runtime/logical errors que compilador não pega
- **Debugging:** Saber tipo de erro acelera debugging
- **Code Quality:** TypeScript elimina classe inteira de erros (type errors)

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Syntax Errors:** Código malformado, não compila
2. **Type Errors:** Incompatibilidade de tipos, detectado em compile-time
3. **Runtime Errors:** Erros durante execução, não previstos por types
4. **Logical Errors:** Lógica incorreta, código funciona mas resultado errado
5. **Detection Timing:** Diferentes momentos de detecção (parse, compile, runtime, testing)

### Pilares Fundamentais

- **Static Analysis:** Syntax e type errors detectados sem executar código
- **Dynamic Errors:** Runtime errors só aparecem durante execução
- **Type System:** TypeScript previne type errors, mas não runtime errors
- **Testing:** Único jeito de detectar logical errors
- **Fail Fast:** Detectar erros o mais cedo possível

### Visão Geral das Nuances

- **Type Erasure:** Types desaparecem em runtime - não previnem runtime errors
- **Any Type:** `any` desabilita type checking - permite type errors em runtime
- **Strict Mode:** `strict: true` aumenta detecção de type errors
- **Linting:** ESLint detecta padrões suspeitos além de type checking
- **Unit Tests:** Necessários para detectar logical errors

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Error Detection Pipeline

```
Código TypeScript
      ↓
[1. Parser] → Syntax Errors detectados
      ↓
[2. Type Checker] → Type Errors detectados
      ↓
[3. Transpilation] → JavaScript gerado
      ↓
[4. Runtime] → Runtime Errors detectados
      ↓
[5. Execution] → Logical Errors (resultados incorretos)
```

**Análise profunda do pipeline:**

**1. Parsing (Syntax Errors):**
- Parser lê código e constrói AST (Abstract Syntax Tree)
- Se sintaxe é inválida, parsing falha
- Exemplo: `const x = ;` - token inesperado

**2. Type Checking (Type Errors):**
- Type checker valida compatibilidade de tipos
- Se tipos incompatíveis, compilação falha
- Exemplo: `const x: number = "texto";`

**3. Transpilation:**
- TypeScript é convertido para JavaScript
- Types são removidos (type erasure)
- JavaScript gerado não tem type information

**4. Runtime Execution (Runtime Errors):**
- JavaScript é executado
- Erros que TypeScript não previu aparecem
- Exemplo: `null.toString()` - types dizem OK, runtime falha

**5. Logic Execution (Logical Errors):**
- Código executa sem erros, mas produz resultado errado
- Apenas testes/validação manual detectam
- Exemplo: `preco + desconto` ao invés de `preco - desconto`

### Princípios e Conceitos Subjacentes

#### Syntax Errors - Parse-Time

```typescript
// ❌ Syntax Error - missing value
const numero = ;

// ❌ Syntax Error - invalid token
const nome = "Ana"" ;

// ❌ Syntax Error - missing closing brace
function somar(a, b) {
  return a + b;
// Missing }

// ❌ Syntax Error - invalid keyword
functio teste() {}  // 'functio' não é keyword válido
```

**Conceito crucial:** Syntax errors são **parse errors** - código não pode nem ser analisado. Compilador/parser não consegue construir AST.

#### Type Errors - Compile-Time

```typescript
// ❌ Type Error - type mismatch
const idade: number = "25";  
// Type 'string' is not assignable to type 'number'

// ❌ Type Error - wrong argument type
function dobrar(x: number): number {
  return x * 2;
}
dobrar("5");  
// Argument of type 'string' is not assignable to parameter of type 'number'

// ❌ Type Error - property doesn't exist
interface Usuario {
  nome: string;
}
const usuario: Usuario = { nome: "Ana" };
console.log(usuario.idade);  
// Property 'idade' does not exist on type 'Usuario'

// ❌ Type Error - cannot call non-function
const valor: number = 10;
valor();  
// This expression is not callable. Type 'Number' has no call signatures
```

**Análise profunda:** Type errors são detectados pelo **type checker** em compile-time. TypeScript analisa todo código e valida compatibilidade de tipos antes de gerar JavaScript.

#### Runtime Errors - Execution-Time

```typescript
// ✅ Type-safe, mas erro em runtime
function dividir(a: number, b: number): number {
  return a / b;  // Divisão por zero não é type error
}
dividir(10, 0);  // Infinity - não gera erro, mas resultado inválido

// ✅ Type-safe, mas null reference error
const obj: { nome: string } | null = null;
// obj.nome;  // ❌ Type error detectado
const obj2: any = null;
obj2.nome;  // ✅ Type OK (any), mas runtime error

// ✅ Type-safe, mas array out of bounds
const arr: number[] = [1, 2, 3];
const valor = arr[100];  // undefined - não gera erro
valor.toFixed(2);  // TypeError: Cannot read property 'toFixed' of undefined

// ✅ Type-safe, mas JSON parse error
const json = '{ invalido }';
JSON.parse(json);  // SyntaxError: Unexpected token i in JSON
```

**Fundamento teórico:** Runtime errors ocorrem durante **execução** e não podem ser previstos por type system estático. TypeScript não adiciona runtime checks - apenas compile-time.

#### Logical Errors - Semantic Errors

```typescript
// ✅ Sintaticamente correto e type-safe, mas lógica errada
function calcularMedia(numeros: number[]): number {
  const soma = numeros.reduce((acc, n) => acc + n, 0);
  return soma / (numeros.length + 1);  // ❌ Deveria ser length, não length + 1
}
calcularMedia([10, 20, 30]);  // 15 (errado) - esperado 20

// ✅ Type-safe, mas condição invertida
function isAdulto(idade: number): boolean {
  return idade < 18;  // ❌ Deveria ser >=, não <
}
isAdulto(25);  // false (errado) - esperado true

// ✅ Type-safe, mas loop infinito
function contar(): number {
  let count = 0;
  while (count < 10) {
    console.log(count);
    // ❌ Esqueceu de incrementar - loop infinito
  }
  return count;
}
```

**Conceito avançado:** Logical errors são mais perigosos porque **não geram erros** - código executa, mas produz resultado incorreto. Apenas **testes** e **code review** detectam.

### Modelo Mental para Compreensão

Pense em tipos de erro como **barreiras de segurança** em diferentes estágios:

**Syntax Errors:** Portão de entrada
- "Código nem consegue entrar - malformado"
- Detectado: Parser

**Type Errors:** Inspeção de segurança
- "Código entrou, mas documentos (types) estão errados"
- Detectado: Type checker

**Runtime Errors:** Problemas durante operação
- "Código passou inspeção, mas algo falha durante uso"
- Detectado: Runtime execution

**Logical Errors:** Resultado incorreto
- "Tudo parece OK, mas produto final está defeituoso"
- Detectado: Testes/validação manual

## 🔍 Análise Conceitual Profunda

### Syntax Errors - Exemplos Detalhados

```typescript
// Missing semicolon ou token
const x = 5
const y = 10  // ⚠️ ASI (Automatic Semicolon Insertion) pode corrigir

// Unmatched brackets
const arr = [1, 2, 3;  // ❌ Expected ']'

// Invalid operator
const resultado = 5 ** * 2;  // ❌ Unexpected token

// Keyword misuse
const function = 5;  // ❌ 'function' é reserved keyword

// Invalid string
const str = "texto sem fechar;  // ❌ Unterminated string
```

**Análise teórica:** Syntax errors violam **gramática da linguagem** - código não pode ser parseado em AST.

### Type Errors - Casos Comuns

```typescript
// Primitive type mismatch
const nome: string = 123;  // ❌

// Object shape mismatch
interface Pessoa {
  nome: string;
  idade: number;
}
const pessoa: Pessoa = { nome: "Ana" };  // ❌ Missing 'idade'

// Function signature mismatch
function somar(a: number, b: number): number {
  return a + b;
}
const resultado: string = somar(5, 10);  // ❌ Type 'number' is not assignable to type 'string'

// Array type mismatch
const numeros: number[] = [1, 2, "3"];  // ❌ Type 'string' is not assignable to type 'number'

// Null/undefined access
const usuario: { nome: string } | undefined = undefined;
usuario.nome;  // ❌ Object is possibly 'undefined'

// Wrong property access
interface Config {
  host: string;
}
const config: Config = { host: "localhost" };
config.port;  // ❌ Property 'port' does not exist on type 'Config'
```

**Fundamento conceitual:** Type errors violam **contratos de tipo** - TypeScript detecta incompatibilidades em compile-time.

### Runtime Errors - Cenários Típicos

```typescript
// Null/undefined dereferencing
const obj: any = null;
obj.metodo();  // TypeError: Cannot read property 'metodo' of null

// Type coercion issues
const resultado = "5" * "10";  // 50 (coerção implícita)
const invalido = "abc" * "def";  // NaN - não é erro, mas resultado inválido

// Array bounds
const arr = [1, 2, 3];
console.log(arr[10]);  // undefined - não é erro

// Division by zero
const div = 10 / 0;  // Infinity - não é erro em JavaScript

// JSON parsing
const dados = JSON.parse('{ invalido }');  // SyntaxError em runtime

// Network errors
fetch("url-invalida").then(r => r.json());  // Network error em runtime

// Stack overflow
function recursiva(): any {
  return recursiva();  // RangeError: Maximum call stack size exceeded
}
recursiva();
```

**Análise profunda:** Runtime errors ocorrem em **tempo de execução** e não podem ser previstos por type system estático de TypeScript.

### Logical Errors - Bugs Silenciosos

```typescript
// Off-by-one error
function primeirosN(arr: number[], n: number): number[] {
  return arr.slice(0, n + 1);  // ❌ Deveria ser n, não n + 1
}
primeirosN([1, 2, 3, 4, 5], 3);  // [1, 2, 3, 4] - errado

// Wrong comparison operator
function maiorQue(a: number, b: number): boolean {
  return a <= b;  // ❌ Deveria ser >, não <=
}
maiorQue(10, 5);  // false - errado

// Incorrect calculation
function calcularJuros(principal: number, taxa: number, anos: number): number {
  return principal * taxa * anos;  // ❌ Fórmula de juros simples incorreta
}

// Wrong array method
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter(n => n % 2 === 1);  // ❌ Deveria ser === 0 para pares

// Async/await misuse
async function buscarDados() {
  const dados = fetch("/api");  // ❌ Esqueceu await - dados é Promise, não resposta
  return dados.json();  // TypeError em runtime
}
```

**Conceito crucial:** Logical errors são **semanticamente incorretos** - código funciona, mas não faz o que deveria.

### Interaction Between Error Types

```typescript
// Syntax error previne type checking
const x = ;  // SyntaxError - compilação para aqui

// Type error pode mascarar runtime error
function processar(obj: { valor: number }) {
  return obj.valor * 2;
}
// processar(null);  // ❌ Type error detectado
// Se passasse, seria runtime error (null reference)

// Type error pode mascarar logical error
function calcular(a: number, b: number): string {
  return a + b;  // ❌ Type error - expected string, got number
  // Se fosse `return (a + b).toString()`, passaria type check
  // Mas se lógica deveria ser subtração, seria logical error
}
```

**Fundamento teórico:** Erros são detectados em **ordem sequencial** - syntax → type → runtime → logic.

### `any` Type Bypasses Type Checking

```typescript
// `any` desabilita type checking
const valor: any = "texto";
const numero: number = valor;  // ✅ Type OK (any permite tudo)
const resultado = numero * 2;  // NaN em runtime

// `any` propaga
function processar(x: any) {
  return x.toUpperCase();  // ✅ Type OK, mas pode falhar em runtime
}
processar(123);  // TypeError: x.toUpperCase is not a function
```

**Limitação:** `any` type **desabilita type safety** - type errors viram runtime errors.

### Strict Mode Impact

```typescript
// tsconfig.json: "strict": false
let nome;  // ✅ Implicitamente 'any'
nome = 5;
nome = "texto";  // Tudo OK

// tsconfig.json: "strict": true
let nome2;  // ❌ Variable 'nome2' implicitly has an 'any' type
const obj: { valor?: number } = {};
obj.valor.toFixed(2);  // ❌ Object is possibly 'undefined'
```

**Conceito avançado:** **Strict mode** aumenta detecção de type errors - mais erros em compile-time, menos em runtime.

### Non-Null Assertion Operator

```typescript
interface Usuario {
  nome: string;
}

const usuario: Usuario | null = obterUsuario();

// ❌ Type error - possibly null
// usuario.nome;

// ✅ Type OK com non-null assertion
usuario!.nome;  // ⚠️ Perigoso - se for null, runtime error

// Melhor: type guard
if (usuario !== null) {
  usuario.nome;  // ✅ Type narrowing
}
```

**Análise profunda:** Non-null assertion (`!`) **bypassa type checking** - pode transformar type error em runtime error.

### Type Assertions

```typescript
const valor = obterValor() as string;  // Type assertion
valor.toUpperCase();  // ✅ Type OK, mas se valor não for string, runtime error

// Type assertion pode mascarar type error
const numero: number = "123" as any as number;  // ✅ Type OK (forçado)
numero.toFixed(2);  // TypeError: numero.toFixed is not a function
```

**Limitação:** Type assertions **não validam em runtime** - apenas dizem ao TypeScript "confie em mim".

## 🎯 Aplicabilidade e Contextos

### Development Workflow

```typescript
// 1. Editor mostra syntax errors em tempo real
const x =   // ❌ Squiggle vermelho no editor

// 2. Type errors antes de compilar
const idade: number = "25";  // ❌ Editor mostra erro

// 3. Runtime errors durante execução/testes
const obj: any = null;
obj.metodo();  // ❌ Descoberto em runtime

// 4. Logical errors em testes
expect(calcularMedia([10, 20])).toBe(15);  // ❌ Test fails - resultado é 10
```

**Raciocínio:** Cada tipo de erro é detectado em momento diferente do workflow.

### Error Prevention Strategy

```typescript
// Syntax: Linter/Editor
// Type: TypeScript strict mode
// Runtime: Defensive programming + try/catch
// Logic: Unit tests + code review

function dividir(a: number, b: number): number {
  // Prevenir runtime error
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

// Prevenir logical error com testes
test("dividir deve calcular corretamente", () => {
  expect(dividir(10, 2)).toBe(5);
  expect(dividir(10, 5)).toBe(2);
});
```

**Raciocínio:** Camadas de defesa - syntax/type (compilador), runtime (defensive code), logic (tests).

## ⚠️ Limitações e Considerações Teóricas

### TypeScript Não Previne Runtime Errors

```typescript
// ✅ Type-safe, mas runtime error
const arr: number[] = [1, 2, 3];
arr[100].toString();  // TypeError
```

**Limitação:** Type system é **estático** - não adiciona runtime checks.

### Logical Errors Passam Despercebidos

```typescript
// ✅ Compila, executa, mas errado
function somar(a: number, b: number): number {
  return a * b;  // ❌ Deveria somar, não multiplicar
}
```

**Limitação:** Compilador não entende **intenção** - apenas valida types.

### `any` Quebra Type Safety

```typescript
const x: any = "texto";
const y: number = x;  // ✅ OK, mas unsafe
```

**Limitação:** `any` é escape hatch que desabilita checking.

## 🔗 Interconexões Conceituais

**Relação com Debugging:** Cada tipo requer estratégia de debug diferente.

**Relação com Testing:** Testes focam em runtime/logical errors.

**Relação com Linting:** ESLint detecta padrões suspeitos além de types.

**Relação com Strict Mode:** Aumenta detecção de type errors.

## 🚀 Evolução e Próximos Conceitos

Dominar tipos de erro prepara para:
- **Error Handling:** Try/catch/finally
- **Custom Errors:** Criar classes de erro customizadas
- **Error Propagation:** Throw e propagação de erros
- **Defensive Programming:** Validações para prevenir runtime errors
