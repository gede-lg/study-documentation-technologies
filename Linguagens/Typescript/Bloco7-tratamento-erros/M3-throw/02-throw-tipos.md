# Throw de String, Object e Error

## 🎯 Introdução e Definição

### Definição Conceitual

**Throw value types** refere-se à flexibilidade do JavaScript/TypeScript de **lançar qualquer tipo de valor** com `throw` statement - não apenas `Error` instances, mas também **strings**, **numbers**, **objects**, **null**, **undefined**, ou qualquer outro valor. Embora tecnicamente possível lançar qualquer valor, **best practice** e **convenção** da comunidade JavaScript é **sempre lançar Error instances** (ou subclasses de Error), pois elas fornecem **stack trace**, properties padronizadas (`message`, `name`) e melhor **debugging experience**.

Conceitualmente, throw aceitar qualquer valor é herança do **design flexível** do JavaScript - linguagem não impõe restrições de tipo em runtime. Porém, esta flexibilidade traz **trade-offs** - lançar valores primitivos (strings, numbers) **perde stack trace** e dificulta debugging; lançar objects literais não tem **interface padronizada** para acessar informações do erro.

TypeScript **não adiciona restrições** ao que pode ser lançado - mantém compatibilidade total com JavaScript. Porém, TypeScript **encoraja** uso de Error instances através de:
- Tipo `unknown` para catch clause (força type narrowing)
- Type guards para verificar se erro é Error instance
- Warnings em linters como ESLint (regra `no-throw-literal`)

### Contexto Histórico e Evolução

**JavaScript 1.3 (1998):** Introduziu throw - pode lançar **qualquer valor**.

**ECMAScript 3 (1999):** Padronizou throw - sem restrições de tipo.

**Error Object (ES3):** Introduziu `Error` constructor - mas não obrigou seu uso.

**Best Practices (2000s):** Comunidade estabeleceu convenção - sempre throw Error.

**TypeScript 4.0 (2020):** `catch` clause passa a ter tipo `unknown` (antes era `any`).

**TypeScript 4.4 (2021):** Melhorias em control flow analysis com throw.

**Evolução de práticas:**

**Anos 2000 (early JavaScript):**
```javascript
// Comum lançar strings
throw "Erro: divisão por zero";

// Ou numbers
throw 404;
```

**Anos 2010 (JavaScript moderno):**
```typescript
// Convenção: sempre throw Error
throw new Error("Divisão por zero");

// Ou custom Error classes
throw new ValidationError("Campo inválido");
```

**TypeScript moderno (2020+):**
```typescript
// catch tem tipo unknown - force type checking
try {
  algo();
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);
  }
}
```

### Problema Fundamental que Resolve/Cria

**Problema que flexibilidade resolve:**
- JavaScript não força tipo específico - qualquer valor pode ser erro
- Permite lançar valores simples em casos triviais
- Compatibilidade com código legado que lança strings

**Problema que flexibilidade cria:**
- **Loss of Stack Trace:** Strings/numbers não incluem stack trace
- **Inconsistent Interface:** Objects literais não têm properties padronizadas
- **Difficult Debugging:** Sem stack trace, difícil encontrar origem do erro
- **Type Confusion:** Em TypeScript, catch clause precisa type narrowing

**Exemplo do problema:**

```typescript
// ❌ Throw string - sem stack trace
function exemplo1() {
  throw "Erro aconteceu";
}

try {
  exemplo1();
} catch (e) {
  console.log(e);  // "Erro aconteceu" - sem stack trace!
  // Não sabemos ONDE erro foi lançado
}

// ✅ Throw Error - com stack trace
function exemplo2() {
  throw new Error("Erro aconteceu");
}

try {
  exemplo2();
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);  // "Erro aconteceu"
    console.log(e.stack);    // Stack trace completo!
  }
}
```

**Fundamento teórico:** Error instances fornecem **metadata essencial** (stack trace, name, message) que valores primitivos não têm.

### Importância no Ecossistema

Entender tipos de valores em throw é crucial porque:

- **Best Practice Enforcement:** Saber por que sempre usar Error
- **Legacy Code:** Código antigo pode lançar strings - precisa lidar
- **Type Safety:** TypeScript força type narrowing em catch
- **Debugging:** Stack trace é essencial para debugging
- **Consistency:** Error instances fornecem interface consistente

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Throw Any Value:** JavaScript permite throw de qualquer tipo
2. **Error Instances:** Best practice - sempre throw Error
3. **Stack Trace:** Apenas Error instances incluem stack trace
4. **Type Narrowing:** TypeScript força verificação de tipo em catch
5. **Legacy Code:** Código antigo pode lançar strings/numbers

### Pilares Fundamentais

- **Flexibility:** Throw aceita qualquer valor
- **Convention:** Sempre throw Error instances
- **Debugging:** Stack trace é crucial
- **Type Safety:** TypeScript catch é `unknown`
- **Interface:** Error tem properties padronizadas

### Visão Geral das Nuances

- **String Throws:** Válido mas perde stack trace
- **Number Throws:** Válido mas sem metadata
- **Object Throws:** Válido mas sem interface padronizada
- **Error Throws:** Recomendado - tem stack trace e metadata
- **Custom Errors:** Subclasses de Error para casos específicos

## 🧠 Fundamentos Teóricos

### Throw String

```typescript
// Tecnicamente válido
throw "Mensagem de erro";

try {
  throw "Arquivo não encontrado";
} catch (e) {
  console.log(e);  // "Arquivo não encontrado"
  console.log(typeof e);  // "string"
}
```

**Análise profunda:**

**Características:**
- ✅ Simples - apenas mensagem
- ❌ Sem stack trace
- ❌ Sem properties (message, name)
- ❌ Difícil debugging
- ❌ Má prática

**Problema fundamental:**
```typescript
function nivel3() {
  throw "Erro no nível 3";
}

function nivel2() {
  nivel3();
}

function nivel1() {
  nivel2();
}

try {
  nivel1();
} catch (e) {
  console.log(e);  // "Erro no nível 3"
  // ❌ Não sabemos ONDE erro foi lançado!
  // ❌ Sem stack trace para rastrear
}
```

**Fundamento teórico:** Strings não carregam **metadata** sobre erro - apenas mensagem.

### Throw Number

```typescript
// HTTP status code
throw 404;

try {
  const response = fetch("/api/dados");
  if (!response.ok) {
    throw response.status;  // Lança número
  }
} catch (e) {
  console.log(e);  // 404
  console.log(typeof e);  // "number"
}
```

**Análise profunda:**

**Características:**
- ✅ Simples - código de erro
- ❌ Sem stack trace
- ❌ Sem mensagem descritiva
- ❌ Sem context
- ❌ Má prática

**Problema:**
```typescript
try {
  throw 500;
} catch (e) {
  // ❌ O que significa 500? Erro de servidor? Código de status?
  // ❌ Onde foi lançado?
  // ❌ Por que foi lançado?
  console.log(e);  // 500 - sem context!
}
```

**Fundamento teórico:** Numbers são **código** sem **semântica** - não explicam erro.

### Throw Object Literal

```typescript
// Object com properties customizadas
throw { code: 404, message: "Não encontrado" };

try {
  throw {
    type: "ValidationError",
    field: "email",
    value: "invalido",
    message: "Email inválido"
  };
} catch (e) {
  console.log(e);
  // { type: "ValidationError", field: "email", ... }
  console.log(typeof e);  // "object"
}
```

**Análise profunda:**

**Características:**
- ✅ Flexível - properties customizadas
- ✅ Estruturado - informações organizadas
- ❌ Sem stack trace
- ❌ Sem interface padronizada
- ❌ Type safety fraco

**Problema:**
```typescript
try {
  throw { code: 500, msg: "Erro" };  // 'msg'
} catch (e) {
  // ❌ Qual property usar? message? msg? error?
  // ❌ Interface inconsistente entre erros
  console.log(e.message);  // undefined - property errada!
}
```

**Fundamento teórico:** Objects literais não têm **interface padronizada** - cada erro pode ter properties diferentes.

### Throw Error Instance (Recommended)

```typescript
// ✅ Best practice - sempre throw Error
throw new Error("Mensagem descritiva");

try {
  throw new Error("Operação falhou");
} catch (e) {
  console.log(e instanceof Error);  // true
  console.log(e.message);  // "Operação falhou"
  console.log(e.name);     // "Error"
  console.log(e.stack);    // Stack trace completo
}
```

**Análise profunda:**

**Características:**
- ✅ Stack trace incluído
- ✅ Properties padronizadas (message, name, stack)
- ✅ Interface consistente
- ✅ Debugging eficiente
- ✅ Best practice

**Vantagens:**
```typescript
function nivel3() {
  throw new Error("Erro no nível 3");
}

function nivel2() {
  nivel3();
}

function nivel1() {
  nivel2();
}

try {
  nivel1();
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);  // "Erro no nível 3"
    console.log(e.stack);
    // Stack trace completo:
    // Error: Erro no nível 3
    //   at nivel3 (...)
    //   at nivel2 (...)
    //   at nivel1 (...)
    //   at <main> (...)
  }
}
```

**Fundamento teórico:** Error instances incluem **stack trace** - essencial para debugging.

### Princípios e Conceitos Subjacentes

#### Error Object Properties

```typescript
const erro = new Error("Mensagem de erro");

console.log(erro.message);  // "Mensagem de erro"
console.log(erro.name);     // "Error"
console.log(erro.stack);    // Stack trace string

// Stack trace exemplo:
// Error: Mensagem de erro
//   at Object.<anonymous> (/path/to/file.js:1:13)
//   at Module._compile (internal/modules/cjs/loader.js:...)
//   ...
```

**Conceito fundamental:**

**Error Properties:**
- `message`: Mensagem descritiva do erro
- `name`: Tipo do erro ("Error", "TypeError", etc.)
- `stack`: Stack trace - call stack quando erro foi criado

**Stack Trace Formato:**
```
Error: <message>
  at <function> (<file>:<line>:<column>)
  at <function> (<file>:<line>:<column>)
  ...
```

#### TypeScript Catch Clause Type

```typescript
// TypeScript 4.0+ - catch tem tipo 'unknown'
try {
  algo();
} catch (e) {
  // e tem tipo 'unknown' - não 'any'
  console.log(e.message);  // ❌ Error - 'e' is unknown
  
  // Precisa type narrowing
  if (e instanceof Error) {
    console.log(e.message);  // ✅ OK - e é Error
  }
}
```

**Fundamento teórico:** TypeScript usa `unknown` para **forçar type checking** - não pode assumir que erro é Error.

#### Type Guards for Error Checking

```typescript
function isError(e: unknown): e is Error {
  return e instanceof Error;
}

try {
  algo();
} catch (e) {
  if (isError(e)) {
    console.log(e.message);  // Type-safe
    console.log(e.stack);
  } else {
    console.log("Erro não é Error instance:", e);
  }
}
```

**Conceito avançado:** Type guards **refinam tipo** - garantem type safety em catch.

### Modelo Mental para Compreensão

Pense em throw values como **mensagens**:

**String:** Bilhete simples - apenas texto
**Number:** Código - sem explicação
**Object:** Formulário - campos arbitrários
**Error:** Envelope registrado - com rastreamento completo

**Analogia:**

**Throw string:** Gritar mensagem - sem registro de onde veio
**Throw Error:** Enviar carta registrada - com tracking completo

**Metáfora:**
- **String/Number:** Sintoma - "Dor de cabeça"
- **Error:** Diagnóstico completo - "Dor de cabeça causada por X, detectada em Y, histórico Z"

## 🔍 Análise Conceitual Profunda

### Throw Null/Undefined

```typescript
// Válido mas raramente útil
throw null;
throw undefined;

try {
  throw null;
} catch (e) {
  console.log(e);  // null
  console.log(e === null);  // true
}
```

**Análise profunda:**

**Características:**
- ❌ Sem informação - apenas null/undefined
- ❌ Sem stack trace
- ❌ Sem mensagem
- ❌ Praticamente inútil
- ❌ Nunca usar

**Problema:** Lançar null não comunica **nada** sobre erro.

### Throw Boolean

```typescript
// Tecnicamente válido
throw true;
throw false;

try {
  const sucesso = false;
  if (!sucesso) {
    throw false;
  }
} catch (e) {
  console.log(e);  // false
  console.log(typeof e);  // "boolean"
}
```

**Fundamento teórico:** Boolean como erro não tem **semântica** - true/false não explicam problema.

### Throw Array

```typescript
// Array de mensagens de erro
throw ["Erro 1", "Erro 2", "Erro 3"];

try {
  throw ["Campo obrigatório", "Formato inválido"];
} catch (e) {
  if (Array.isArray(e)) {
    e.forEach(msg => console.log(msg));
  }
}
```

**Análise profunda:**

**Uso (raro):**
- Lançar múltiplos erros de validação
- ❌ Mas melhor usar ValidationError custom com array de erros

**Problema:**
- Sem stack trace
- Sem interface padronizada
- Difícil type checking

### Throw Function

```typescript
// Tecnicamente válido mas absurdo
throw function() { console.log("Erro"); };

try {
  throw () => "Erro";
} catch (e) {
  if (typeof e === "function") {
    const mensagem = e();
    console.log(mensagem);
  }
}
```

**Fundamento teórico:** Lançar function é válido mas **não faz sentido** - erros devem ser dados, não código.

### Error Constructor Variants

```typescript
// Error genérico
throw new Error("Erro genérico");

// TypeError - erro de tipo
throw new TypeError("Esperado number, recebeu string");

// RangeError - valor fora do range
throw new RangeError("Índice fora do array");

// ReferenceError - variável não definida
throw new ReferenceError("Variável não existe");

// SyntaxError - erro de sintaxe
throw new SyntaxError("JSON inválido");

// URIError - URI malformado
throw new URIError("URI inválida");
```

**Análise profunda:**

**Built-in Error Types:**
- `Error`: Erro genérico
- `TypeError`: Tipo incorreto
- `RangeError`: Valor fora do intervalo
- `ReferenceError`: Referência inválida
- `SyntaxError`: Sintaxe inválida
- `URIError`: URI malformada

**Uso:**
```typescript
function dividir(a: number, b: number): number {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Argumentos devem ser numbers");
  }
  
  if (b === 0) {
    throw new RangeError("Divisão por zero");
  }
  
  return a / b;
}
```

**Fundamento teórico:** Built-in Error types **categorizam** erros - facilitam tratamento específico.

### Throw with Error Message Interpolation

```typescript
const usuario = "João";
const idade = -5;

throw new Error(`Idade inválida para usuário ${usuario}: ${idade}`);

// Mensagens descritivas com context
function validar(valor: number, min: number, max: number) {
  if (valor < min || valor > max) {
    throw new Error(
      `Valor ${valor} fora do intervalo [${min}, ${max}]`
    );
  }
}
```

**Conceito crucial:** Error messages devem incluir **context** - valores que causaram erro.

### Comparing Throw Types

```typescript
// ❌ Throw string
try {
  throw "Divisão por zero";
} catch (e) {
  console.log(e);  // "Divisão por zero"
  // Sem stack trace!
}

// ❌ Throw object
try {
  throw { code: 500, msg: "Erro" };
} catch (e) {
  console.log(e);  // { code: 500, msg: "Erro" }
  // Sem stack trace!
}

// ✅ Throw Error
try {
  throw new Error("Divisão por zero");
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);  // "Divisão por zero"
    console.log(e.stack);    // Stack trace completo
  }
}
```

**Comparação:**

| Tipo | Stack Trace | Interface | Type Safety | Recomendação |
|------|-------------|-----------|-------------|--------------|
| String | ❌ | ❌ | ❌ | Evitar |
| Number | ❌ | ❌ | ❌ | Evitar |
| Object | ❌ | ❌ | ⚠️ | Evitar |
| Error | ✅ | ✅ | ✅ | **Usar sempre** |

### Error with Cause (ES2022)

```typescript
// ES2022 - Error com 'cause'
try {
  operacaoDeBanco();
} catch (erroOriginal) {
  throw new Error("Falha na transação", { cause: erroOriginal });
}

// Encadeia erros
try {
  try {
    throw new Error("Erro baixo nível");
  } catch (e) {
    throw new Error("Erro alto nível", { cause: e });
  }
} catch (e) {
  if (e instanceof Error) {
    console.log(e.message);  // "Erro alto nível"
    console.log(e.cause);    // Error: "Erro baixo nível"
  }
}
```

**Conceito avançado:** `cause` permite **encadear erros** - mantém erro original + adiciona context.

### TypeScript Unknown Catch

```typescript
// TypeScript 4.0+ - catch é 'unknown'
try {
  algo();
} catch (e) {
  // e: unknown
  
  // Type narrowing necessário
  if (typeof e === "string") {
    console.log("String error:", e);
  } else if (typeof e === "number") {
    console.log("Number error:", e);
  } else if (e instanceof Error) {
    console.log("Error instance:", e.message);
  } else {
    console.log("Unknown error:", e);
  }
}
```

**Fundamento teórico:** `unknown` força **exhaustive type checking** - lidar com todos casos possíveis.

### Throw in Production Code

```typescript
// ❌ Código legado - throw string
if (!usuario) {
  throw "Usuário não encontrado";
}

// ✅ Código moderno - throw Error
if (!usuario) {
  throw new Error("Usuário não encontrado");
}

// ✅ Ainda melhor - Error com context
if (!usuario) {
  throw new Error(`Usuário não encontrado: ID ${usuarioId}`);
}

// ✅ Ideal - Custom Error
if (!usuario) {
  throw new UsuarioNaoEncontradoError(usuarioId);
}
```

**Best Practice:** Sempre throw Error instances - prefira custom errors para casos específicos.

## 🎯 Aplicabilidade e Contextos

### Legacy Code Compatibility

```typescript
// Lidar com código que pode lançar qualquer tipo
function chamarLegacyCode() {
  try {
    legacyFunction();  // Pode lançar string, number, object...
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error:", e.message);
    } else if (typeof e === "string") {
      console.error("String error:", e);
    } else {
      console.error("Unknown error:", e);
    }
  }
}
```

**Raciocínio:** Legacy code pode lançar qualquer tipo - precisa type guards.

### HTTP Error Handling

```typescript
// ✅ Throw Error com HTTP status
async function buscarDados() {
  const response = await fetch("/api/dados");
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Melhor: Custom HTTPError
class HTTPError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HTTPError";
  }
}

async function buscarDados2() {
  const response = await fetch("/api/dados");
  
  if (!response.ok) {
    throw new HTTPError(response.status, response.statusText);
  }
  
  return response.json();
}
```

**Raciocínio:** Custom Error classes fornecem **type safety** e **metadata** adicional.

### Validation Errors

```typescript
// ✅ Error com mensagem descritiva
function validarEmail(email: string): void {
  if (!email.includes("@")) {
    throw new Error(`Email inválido: ${email}`);
  }
}

// Melhor: Custom ValidationError
class ValidationError extends Error {
  constructor(public field: string, public value: any, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function validarEmail2(email: string): void {
  if (!email.includes("@")) {
    throw new ValidationError("email", email, "Email deve conter @");
  }
}
```

**Raciocínio:** Validation errors se beneficiam de custom Error classes com metadata.

## ⚠️ Limitações e Considerações Teóricas

### No Stack Trace for Non-Error Values

```typescript
// ❌ String - sem stack trace
throw "Erro aconteceu";

// ✅ Error - com stack trace
throw new Error("Erro aconteceu");
```

**Limitação:** Apenas Error instances têm stack trace - essencial para debugging.

### Catch Type is Unknown

```typescript
try {
  algo();
} catch (e) {
  // e: unknown - precisa type narrowing
  console.log(e.message);  // ❌ Error - e is unknown
}
```

**Consideração:** TypeScript não assume tipo do erro - sempre verificar.

### No Standard Interface for Objects

```typescript
// Interface inconsistente
throw { code: 404, msg: "Erro" };
throw { error: "Erro", status: 500 };
throw { message: "Erro", type: "ValidationError" };

// Qual property usar? msg? error? message?
```

**Limitação:** Objects não têm interface padronizada - dificulta tratamento consistente.

## 🔗 Interconexões Conceituais

**Relação com Throw:** Throw aceita qualquer valor - mas convenção: Error.

**Relação com Error Object:** Error instances são best practice.

**Relação com Stack Trace:** Apenas Error tem stack trace.

**Relação com TypeScript:** Catch é `unknown` - força type narrowing.

**Relação com Custom Errors:** Subclasses de Error para casos específicos.

## 🚀 Evolução e Próximos Conceitos

Dominar throw types prepara para:
- **Custom Error Classes:** Criar erros específicos do domínio
- **Error Hierarchies:** Hierarquias de erros
- **Error Handling Patterns:** Best practices
- **Error Propagation:** Como erros propagam
