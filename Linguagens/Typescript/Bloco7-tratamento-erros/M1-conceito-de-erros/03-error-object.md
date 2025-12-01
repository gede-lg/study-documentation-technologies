# Error Object

## 🎯 Introdução e Definição

### Definição Conceitual

**Error Object** refere-se à **classe Error nativa do JavaScript** (e TypeScript) que representa **erros em runtime**. Todo erro lançado em JavaScript/TypeScript é uma **instância** de `Error` ou de suas **subclasses** (`TypeError`, `ReferenceError`, `SyntaxError`, etc.). O Error object contém **propriedades essenciais** para diagnosticar problemas: `message` (descrição do erro), `name` (tipo do erro), e `stack` (stack trace completo).

Conceitualmente, Error object é o **mecanismo padrão** para representar e propagar erros em JavaScript/TypeScript. Quando código lança erro com `throw new Error("mensagem")`, uma **instância de Error** é criada com informações sobre o problema. Esta instância pode ser **capturada** com `try/catch`, **propagada** pela call stack, ou **deixada sem tratamento** (causando crash do programa).

TypeScript **não modifica** o comportamento de Error object - usa exatamente o mesmo mecanismo de JavaScript. Porém, TypeScript permite **tipar** errors em catch blocks (desde TS 4.0) e criar **custom error classes** com type safety.

### Contexto Histórico e Motivação

**JavaScript 1.3 (1998):** Introduziu `Error` constructor e `try/catch` statement.

**ECMAScript 3 (1999):** Padronizou Error object com propriedades `name` e `message`.

**Subclasses de Error:**
- `SyntaxError`: Erros de parsing
- `TypeError`: Operação em tipo incompatível
- `ReferenceError`: Variável não declarada
- `RangeError`: Valor fora do range
- `URIError`: Uso inválido de funções URI

**Error.stack (não padronizado):** V8 (Chrome/Node.js) introduziu `stack` property - stack trace completo. Outros engines seguiram, mas formato varia.

**TypeScript (2012):** Manteve compatibilidade total com JavaScript Error object. TS 4.0 adicionou `unknown` type para catch binding.

**Motivação:**
- **Structured Error Handling:** Error object estrutura informações sobre erro
- **Stack Trace:** `stack` property facilita debugging
- **Error Types:** Subclasses categorizam erros
- **Propagation:** Errors propagam pela call stack até serem capturados

### Problema Fundamental que Resolve

Error object resolve dois problemas fundamentais:

**1. Structured Error Information**

Sem Error object (throwing strings):
```javascript
// ❌ Má prática - throw string
throw "Divisão por zero";

try {
  operacao();
} catch (e) {
  console.log(e);  // Apenas "Divisão por zero" - sem stack trace, sem context
}
```

Com Error object:
```typescript
// ✅ Boa prática - throw Error instance
throw new Error("Divisão por zero");

try {
  operacao();
} catch (e) {
  console.log(e.message);  // "Divisão por zero"
  console.log(e.name);     // "Error"
  console.log(e.stack);    // Stack trace completo
}
```

**2. Error Type Differentiation**

Sem subclasses:
```javascript
// ❌ Sem diferenciação de tipo
function processar(valor) {
  if (typeof valor !== "number") {
    throw new Error("Tipo inválido");
  }
  if (valor < 0) {
    throw new Error("Valor inválido");
  }
}

try {
  processar("abc");
} catch (e) {
  // Difícil distinguir tipo de erro
  if (e.message.includes("Tipo")) {
    // ...
  }
}
```

Com subclasses:
```typescript
// ✅ Com diferenciação de tipo
function processar(valor: unknown): number {
  if (typeof valor !== "number") {
    throw new TypeError("Valor deve ser number");
  }
  if (valor < 0) {
    throw new RangeError("Valor deve ser >= 0");
  }
  return valor;
}

try {
  processar("abc");
} catch (e) {
  if (e instanceof TypeError) {
    console.log("Erro de tipo");
  } else if (e instanceof RangeError) {
    console.log("Erro de range");
  }
}
```

### Importância no Ecossistema

Error object é crucial porque:

- **Standard Error Handling:** Mecanismo padrão em JavaScript/TypeScript
- **Debugging:** Stack trace facilita localizar origem do erro
- **Error Propagation:** Errors propagam automaticamente pela call stack
- **Type Safety:** TypeScript permite tipar custom errors
- **Library Integration:** Todas bibliotecas usam Error object

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Error Class:** Classe nativa para representar erros
2. **Message Property:** Descrição textual do erro
3. **Name Property:** Tipo/nome do erro
4. **Stack Property:** Stack trace completo (não padronizado)
5. **Built-in Subclasses:** TypeError, ReferenceError, SyntaxError, RangeError

### Pilares Fundamentais

- **Error Constructor:** `new Error(message)` cria instância
- **Error Properties:** `message`, `name`, `stack`
- **Error Inheritance:** Subclasses herdam de Error
- **Error Propagation:** Errors propagam até serem capturados
- **Error Catching:** `try/catch` captura errors

### Visão Geral das Nuances

- **Stack Trace Format:** Varia entre engines (V8, SpiderMonkey)
- **Error Causes:** `Error(message, { cause })` (ES2022)
- **Custom Errors:** Criar subclasses de Error
- **TypeScript Typing:** `unknown` type em catch desde TS 4.0
- **Error Serialization:** JSON.stringify não serializa stack

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Error Object Structure

```typescript
// Error instance
const erro = new Error("Algo deu errado");

console.log(erro.message);  // "Algo deu errado"
console.log(erro.name);     // "Error"
console.log(erro.stack);    // Stack trace:
// Error: Algo deu errado
//     at <anonymous>:1:14
//     at ...
```

**Análise profunda:**

**1. Message Property:**
- String passada ao constructor
- Descrição textual do erro
- Acessível via `erro.message`

**2. Name Property:**
- Nome da classe do erro
- Default: `"Error"`
- Subclasses: `"TypeError"`, `"ReferenceError"`, etc.

**3. Stack Property:**
- Stack trace completo
- Mostra call stack no momento do erro
- Não padronizado - formato varia entre engines
- V8 (Chrome/Node): `Error: message\n    at function (file:line:column)`

#### Error Constructor

```typescript
// Forma 1: new Error(message)
const erro1 = new Error("Mensagem de erro");

// Forma 2: Error(message) - sem new (equivalente)
const erro2 = Error("Mensagem de erro");

// Forma 3: Com cause (ES2022)
const erroOriginal = new Error("Erro original");
const erro3 = new Error("Erro wrapper", { cause: erroOriginal });

console.log(erro3.message);  // "Erro wrapper"
console.log(erro3.cause);    // Error: Erro original
```

**Conceito fundamental:** `new Error(message)` cria nova instância com `message`, `name`, e `stack` preenchidos.

### Princípios e Conceitos Subjacentes

#### Built-in Error Types

```typescript
// TypeError - operação em tipo incompatível
const valor: any = "texto";
valor.toFixed(2);  // TypeError: valor.toFixed is not a function

const obj: any = null;
obj.metodo();  // TypeError: Cannot read property 'metodo' of null

// ReferenceError - variável não declarada
console.log(variavelInexistente);  // ReferenceError: variavelInexistente is not defined

// SyntaxError - sintaxe inválida
JSON.parse('{ invalido }');  // SyntaxError: Unexpected token i in JSON

// RangeError - valor fora do range
function recursiva(): any {
  return recursiva();
}
recursiva();  // RangeError: Maximum call stack size exceeded

const arr = new Array(-1);  // RangeError: Invalid array length

// URIError - uso inválido de URI functions
decodeURIComponent('%');  // URIError: URI malformed
```

**Fundamento teórico:** Cada subclass representa **categoria específica** de erro - facilita tratamento diferenciado.

#### Creating Error Instances

```typescript
// Erro simples
const erro = new Error("Operação falhou");

// Erro com informações adicionais (properties customizadas)
class ValidationError extends Error {
  campo: string;
  
  constructor(message: string, campo: string) {
    super(message);
    this.name = "ValidationError";
    this.campo = campo;
  }
}

const erroValidacao = new ValidationError("Campo inválido", "email");
console.log(erroValidacao.message);  // "Campo inválido"
console.log(erroValidacao.campo);    // "email"
console.log(erroValidacao.name);     // "ValidationError"
```

**Análise profunda:** Custom error classes permitem adicionar **properties específicas** e **type safety**.

#### Error Properties in Detail

```typescript
const erro = new Error("Teste de erro");

// message - descrição textual
console.log(erro.message);  // "Teste de erro"
console.log(typeof erro.message);  // "string"

// name - tipo do erro
console.log(erro.name);  // "Error"
console.log(typeof erro.name);  // "string"

// stack - stack trace (não padronizado)
console.log(erro.stack);
// Error: Teste de erro
//     at <anonymous>:1:14
//     at ...

console.log(typeof erro.stack);  // "string" | "undefined"
```

**Conceito crucial:** `message` e `name` são padronizados; `stack` não é (mas amplamente suportado).

#### Error.prototype

```typescript
// Error.prototype.toString()
const erro = new Error("Teste");
console.log(erro.toString());  // "Error: Teste"

// Error.prototype.name (pode ser sobrescrito)
erro.name = "CustomError";
console.log(erro.toString());  // "CustomError: Teste"
```

**Fundamento teórico:** Error é classe regular - herda de Object, tem prototype methods.

### Modelo Mental para Compreensão

Pense em Error object como **snapshot do problema**:

**Message:** "O que aconteceu?"
- Descrição textual do erro

**Name:** "Que tipo de problema?"
- Categoria do erro (TypeError, RangeError, etc.)

**Stack:** "Onde aconteceu?"
- Caminho de execução até o erro

**Cause:** "Por que aconteceu?" (ES2022)
- Erro que causou este erro

## 🔍 Análise Conceitual Profunda

### Error Constructor - Formas de Uso

```typescript
// 1. Mensagem simples
const erro1 = new Error("Operação falhou");

// 2. Sem mensagem
const erro2 = new Error();
console.log(erro2.message);  // ""

// 3. Com cause (ES2022)
try {
  JSON.parse('{ invalido }');
} catch (erroOriginal) {
  throw new Error("Falha ao processar dados", { cause: erroOriginal });
}

// 4. Sem `new` (equivalente)
const erro3 = Error("Mensagem");  // Mesmo que new Error("Mensagem")
```

**Análise profunda:** `new Error(message)` é forma mais comum; `cause` ajuda a encadear erros.

### Built-in Error Subclasses

```typescript
// TypeError - tipo incompatível
try {
  const obj: any = null;
  obj.metodo();
} catch (e) {
  console.log(e instanceof TypeError);  // true
  console.log(e.name);  // "TypeError"
  console.log(e.message);  // "Cannot read property 'metodo' of null"
}

// ReferenceError - variável não declarada
try {
  console.log(variavelInexistente);
} catch (e) {
  console.log(e instanceof ReferenceError);  // true
}

// SyntaxError - sintaxe inválida
try {
  JSON.parse('{ invalido }');
} catch (e) {
  console.log(e instanceof SyntaxError);  // true
}

// RangeError - valor fora do range
try {
  new Array(-1);
} catch (e) {
  console.log(e instanceof RangeError);  // true
}

// URIError - URI malformed
try {
  decodeURIComponent('%');
} catch (e) {
  console.log(e instanceof URIError);  // true
}
```

**Fundamento conceitual:** Subclasses permitem **instanceof checks** para tratamento diferenciado.

### Custom Error Classes

```typescript
// Erro customizado simples
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

// Erro com propriedades adicionais
class ValidationError extends Error {
  campo: string;
  valor: any;
  
  constructor(message: string, campo: string, valor: any) {
    super(message);
    this.name = "ValidationError";
    this.campo = campo;
    this.valor = valor;
  }
}

// Erro com código
class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// Uso
function validarIdade(idade: number): void {
  if (idade < 0) {
    throw new ValidationError("Idade inválida", "idade", idade);
  }
}

try {
  validarIdade(-5);
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Campo: ${e.campo}, Valor: ${e.valor}`);
  }
}
```

**Conceito avançado:** Custom errors adicionam **type safety** e **context específico**.

### Error Stack Trace

```typescript
function funcaoA() {
  funcaoB();
}

function funcaoB() {
  funcaoC();
}

function funcaoC() {
  throw new Error("Erro na função C");
}

try {
  funcaoA();
} catch (e) {
  console.log(e.stack);
  // Error: Erro na função C
  //     at funcaoC (<anonymous>:10:9)
  //     at funcaoB (<anonymous>:6:3)
  //     at funcaoA (<anonymous>:2:3)
  //     at <anonymous>:14:3
}
```

**Análise profunda:** Stack trace mostra **caminho de execução** - facilita localizar origem do erro.

### Error Cause Chaining (ES2022)

```typescript
// Encadear erros
async function buscarUsuario(id: number) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    return response.json();
  } catch (erroOriginal) {
    throw new Error(`Falha ao buscar usuário ${id}`, { cause: erroOriginal });
  }
}

try {
  await buscarUsuario(123);
} catch (e) {
  console.log(e.message);  // "Falha ao buscar usuário 123"
  console.log(e.cause);    // FetchError original
}
```

**Fundamento teórico:** `cause` permite **encadear erros** - preservar contexto original.

### Error Serialization

```typescript
const erro = new Error("Teste de erro");
erro.name = "CustomError";

// JSON.stringify não serializa stack
const json = JSON.stringify(erro);
console.log(json);  // "{}"

// Workaround: getOwnPropertyNames
const erroSerializado = JSON.stringify(erro, Object.getOwnPropertyNames(erro));
console.log(erroSerializado);
// {"message":"Teste de erro","name":"CustomError","stack":"..."}

// Custom toJSON
class SerializableError extends Error {
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    };
  }
}

const erro2 = new SerializableError("Teste");
console.log(JSON.stringify(erro2));
// {"name":"Error","message":"Teste","stack":"..."}
```

**Limitação:** Error object não é serializado por padrão - `toJSON` necessário.

### TypeScript Error Typing

```typescript
// TS 3.x - catch binding era 'any'
try {
  operacao();
} catch (e) {
  // e: any
  console.log(e.message);  // No type checking
}

// TS 4.0+ - catch binding é 'unknown'
try {
  operacao();
} catch (e) {
  // e: unknown
  // console.log(e.message);  // ❌ Error: Object is of type 'unknown'
  
  if (e instanceof Error) {
    console.log(e.message);  // ✅ Type narrowing
  }
}

// Explicit type annotation
try {
  operacao();
} catch (e: unknown) {
  if (e instanceof Error) {
    console.log(e.message);
  } else {
    console.log(String(e));
  }
}
```

**Conceito crucial:** TS 4.0+ usa `unknown` em catch - força type checking explícito.

### Error vs Exception

```typescript
// JavaScript/TypeScript: qualquer valor pode ser thrown
throw "string error";  // ⚠️ Possível, mas má prática
throw 42;              // ⚠️ Possível, mas má prática
throw { custom: "object" };  // ⚠️ Possível, mas má prática

// Melhor: sempre throw Error instances
throw new Error("Mensagem");

// Catch captura qualquer valor
try {
  throw "erro";
} catch (e) {
  // e pode ser qualquer coisa
  if (e instanceof Error) {
    console.log(e.message);
  } else {
    console.log(String(e));
  }
}
```

**Fundamento teórico:** JavaScript permite throw de **qualquer valor** - mas Error instance é convenção.

### Error.captureStackTrace (Node.js/V8)

```typescript
// V8-specific - capturar stack trace customizado
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
    
    // Remover constructor do stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

const erro = new CustomError("Teste");
console.log(erro.stack);
// Stack trace começa de onde CustomError foi chamado, não do constructor
```

**Análise profunda:** `Error.captureStackTrace` permite **customizar stack trace** (V8 only).

### Error Stack Trace Limits

```typescript
// V8 - limitar stack trace
Error.stackTraceLimit = 10;  // Default é 10

function recursiva(n: number): any {
  if (n === 0) throw new Error("Stack trace");
  return recursiva(n - 1);
}

try {
  recursiva(50);
} catch (e) {
  console.log(e.stack);
  // Stack trace limitado a 10 frames
}
```

**Limitação:** Stack trace é limitado (default 10 frames em V8) - pode não mostrar call stack completo.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

async function buscarDados(url: string) {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new ApiError(
      `Falha ao buscar dados: ${response.statusText}`,
      response.status
    );
  }
  
  return response.json();
}

try {
  await buscarDados("/api/dados");
} catch (e) {
  if (e instanceof ApiError) {
    console.log(`Erro ${e.statusCode}: ${e.message}`);
  }
}
```

**Raciocínio:** Custom error com `statusCode` facilita tratamento de erros de API.

### Validation Errors

```typescript
class ValidationError extends Error {
  campo: string;
  
  constructor(message: string, campo: string) {
    super(message);
    this.name = "ValidationError";
    this.campo = campo;
  }
}

function validarEmail(email: string): void {
  if (!email.includes("@")) {
    throw new ValidationError("Email inválido", "email");
  }
}

try {
  validarEmail("invalido");
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Campo ${e.campo}: ${e.message}`);
  }
}
```

**Raciocínio:** ValidationError encapsula campo que falhou - facilita feedback ao usuário.

## ⚠️ Limitações e Considerações Teóricas

### Stack Trace Não Padronizado

```typescript
const erro = new Error("Teste");
console.log(erro.stack);
// Formato varia entre engines (V8, SpiderMonkey, JavaScriptCore)
```

**Limitação:** `stack` property não é padronizado - formato varia.

### Serialization Issues

```typescript
const erro = new Error("Teste");
JSON.stringify(erro);  // "{}" - stack não serializado
```

**Limitação:** Error object não é JSON-serializable por padrão.

### Error Cause Limited Support

```typescript
const erro = new Error("Mensagem", { cause: outraErro });  // ES2022
// Pode não funcionar em engines antigos
```

**Limitação:** `cause` option é ES2022 - suporte limitado em engines antigos.

## 🔗 Interconexões Conceituais

**Relação com Try/Catch:** Error instances são capturados por try/catch.

**Relação com Stack Trace:** Stack property mostra call stack.

**Relação com Custom Errors:** Extender Error permite criar erros customizados.

**Relação com TypeScript:** TS permite tipar custom errors.

## 🚀 Evolução e Próximos Conceitos

Dominar Error object prepara para:
- **Stack Trace:** Análise profunda de stack traces
- **Try/Catch:** Capturar e tratar errors
- **Custom Errors:** Criar hierarquia de erros customizados
- **Error Handling Patterns:** Best practices para error handling
