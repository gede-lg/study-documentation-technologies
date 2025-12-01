# Propagação de Erro

## 🎯 Introdução e Definição

### Definição Conceitual

**Error propagation** (propagação de erro) é o **mecanismo automático** pelo qual erros lançados com `throw` **sobem pela call stack** (pilha de chamadas) até serem **capturados** por um bloco `catch` ou **terminarem o programa** se não capturados. Quando função lança erro e não tem try/catch local, erro **automaticamente propaga** para a função caller - processo continua recursivamente até erro ser capturado ou não haver mais funções na call stack.

Conceitualmente, propagação de erro implementa **stack unwinding** - cada função na call stack é **desempilhada** (unwound) sucessivamente conforme erro sobe. Código restante em cada função **não executa** - execução pula direto para o catch block mais próximo na hierarquia de chamadas. Este comportamento permite **separation of concerns** - função pode lançar erro sem se preocupar em tratá-lo, delegando tratamento para níveis superiores.

TypeScript não altera semântica de propagação de erro do JavaScript - erros propagam **identicamente**. Porém, TypeScript adiciona **type awareness** através de control flow analysis - consegue inferir que código após `throw` é **unreachable** e marcar como dead code. Catch clause tem tipo `unknown` (TypeScript 4.0+), forçando type narrowing para acessar properties do erro.

### Contexto Histórico e Evolução

**JavaScript 1.3 (1998):** Introduziu throw/try/catch - propagação automática de erros.

**ECMAScript 3 (1999):** Padronizou stack unwinding semântico.

**Node.js (2009):** Popularizou error-first callbacks para async propagation.

**Promises (ES6/2015):** Introduziu `.catch()` para propagation em async code.

**Async/Await (ES2017):** Unificou error propagation - async/await usa try/catch normal.

**TypeScript 4.0 (2020):** Catch clause passou a ter tipo `unknown`.

**Evolução de práticas:**

**Sync Error Propagation (clássico):**
```javascript
function nivel3() {
  throw new Error("Erro");
}

function nivel2() {
  nivel3();  // Propaga erro
}

function nivel1() {
  nivel2();  // Propaga erro
}

try {
  nivel1();
} catch (e) {
  console.log("Erro capturado");
}
```

**Async Error Propagation (callbacks):**
```javascript
// Node.js style - error-first callback
fs.readFile("file.txt", (err, data) => {
  if (err) {
    // Erro propagado via callback
    callback(err);
    return;
  }
  callback(null, data);
});
```

**Async Error Propagation (Promises):**
```javascript
fetch("/api/dados")
  .then(r => r.json())
  .then(data => processar(data))
  .catch(e => console.error("Erro:", e));  // Propaga via .catch()
```

**Async Error Propagation (Async/Await):**
```typescript
async function buscar() {
  try {
    const response = await fetch("/api/dados");
    const data = await response.json();
    return processar(data);
  } catch (e) {
    console.error("Erro:", e);  // Propaga normalmente
  }
}
```

### Problema Fundamental que Resolve

Propagação automática resolve o problema de **error handling boilerplate** - sem propagação, cada função precisaria tratar ou passar erro manualmente.

**Problema: Manual error passing**
```typescript
// ❌ Sem propagação - passar erro manualmente
function nivel3(): [Error | null, any] {
  if (condicao) {
    return [new Error("Erro"), null];
  }
  return [null, resultado];
}

function nivel2(): [Error | null, any] {
  const [erro, resultado] = nivel3();
  if (erro) {
    return [erro, null];  // Passar erro manualmente
  }
  return [null, resultado];
}

function nivel1(): [Error | null, any] {
  const [erro, resultado] = nivel2();
  if (erro) {
    return [erro, null];  // Passar erro manualmente
  }
  return [null, resultado];
}

const [erro, resultado] = nivel1();
if (erro) {
  console.error("Erro:", erro);
}
```

**Solução: Automatic propagation**
```typescript
// ✅ Com propagação - automático
function nivel3() {
  if (condicao) {
    throw new Error("Erro");  // Lança
  }
  return resultado;
}

function nivel2() {
  return nivel3();  // Propaga automaticamente
}

function nivel1() {
  return nivel2();  // Propaga automaticamente
}

try {
  nivel1();
} catch (e) {
  console.error("Erro:", e);  // Captura no topo
}
```

**Fundamento teórico:** Propagação automática **elimina boilerplate** - erro sobe automaticamente até ser capturado.

### Importância no Ecossistema

Error propagation é crucial porque:

- **Automatic Handling:** Erros sobem automaticamente
- **Separation of Concerns:** Função não precisa tratar erro localmente
- **Clean Code:** Menos boilerplate de error handling
- **Stack Unwinding:** Garante cleanup automático
- **Consistent Semantics:** Comportamento previsível

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Automatic Propagation:** Erro sobe call stack automaticamente
2. **Stack Unwinding:** Funções são desempilhadas até catch
3. **Uncaught Termination:** Erro não capturado termina programa
4. **Catch Stops Propagation:** Catch captura e para propagação
5. **Re-throw:** Catch pode re-lançar para continuar propagação

### Pilares Fundamentais

- **Call Stack:** Erro sobe pela pilha de chamadas
- **Automatic:** Não precisa passar manualmente
- **Immediate:** Código após throw não executa
- **Finally Executes:** Finally roda durante unwinding
- **Type Unknown:** TypeScript catch é `unknown`

### Visão Geral das Nuances

- **Nested Try/Catch:** Catch interno para propagação externa
- **Re-throwing:** Catch pode processar e re-lançar
- **Async Propagation:** Promises/async propagam via rejection
- **Event Loop:** Erro em callback não propaga para caller original
- **Multiple Catches:** Cada nível pode ter catch

## 🧠 Fundamentos Teóricos

### Basic Propagation

```typescript
function nivel3() {
  throw new Error("Erro no nível 3");
}

function nivel2() {
  nivel3();  // Erro propaga automaticamente
  console.log("Nunca executa");
}

function nivel1() {
  nivel2();  // Erro propaga automaticamente
  console.log("Nunca executa");
}

try {
  nivel1();
  console.log("Nunca executa");
} catch (e) {
  console.log("Erro capturado:", e.message);
}

// Output: "Erro capturado: Erro no nível 3"
```

**Análise profunda:**

**Fluxo de propagação:**
```
nivel1() chama nivel2()
  ↓
nivel2() chama nivel3()
  ↓
nivel3() lança erro
  ↓
❌ nivel3 interrompida
  ↓
❌ nivel2 interrompida (código após nivel3() não executa)
  ↓
❌ nivel1 interrompida (código após nivel2() não executa)
  ↓
✅ Catch captura erro
```

**Fundamento teórico:** Erro **pula** todo código entre throw e catch.

### Stack Trace Shows Propagation

```typescript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error("Erro em c");
}

try {
  a();
} catch (e) {
  if (e instanceof Error) {
    console.log(e.stack);
  }
}

// Stack trace mostra propagação:
// Error: Erro em c
//   at c (...)
//   at b (...)
//   at a (...)
//   at Object.<anonymous> (...)
```

**Conceito fundamental:** Stack trace **documenta caminho** que erro percorreu.

### Princípios e Conceitos Subjacentes

#### Uncaught Error Terminates

```typescript
function exemplo() {
  throw new Error("Não capturado");
}

exemplo();  // ❌ Programa termina aqui

console.log("Nunca executa");

// Node.js: processo termina com exit code 1
// Browser: erro no console, script para
```

**Fundamento teórico:** Erro não capturado **termina programa** - não há mais call stack para propagar.

#### Catch Stops Propagation

```typescript
function nivel3() {
  throw new Error("Erro");
}

function nivel2() {
  try {
    nivel3();
  } catch (e) {
    console.log("Capturado em nivel2");
    // Propagação PARA aqui
  }
}

function nivel1() {
  nivel2();
  console.log("Continua normalmente");  // ✅ Executa
}

nivel1();

// Output:
// "Capturado em nivel2"
// "Continua normalmente"
```

**Análise profunda:** Catch **para propagação** - funções acima continuam normalmente.

### Re-throwing Errors

```typescript
function nivel3() {
  throw new Error("Erro original");
}

function nivel2() {
  try {
    nivel3();
  } catch (e) {
    console.log("Processar em nivel2");
    throw e;  // Re-lança - continua propagação
  }
}

function nivel1() {
  try {
    nivel2();
    console.log("Nunca executa");
  } catch (e) {
    console.log("Capturado em nivel1");
  }
}

nivel1();

// Output:
// "Processar em nivel2"
// "Capturado em nivel1"
```

**Conceito crucial:** Re-throw permite **processar** erro localmente e **continuar propagação**.

### Finally During Propagation

```typescript
function nivel3() {
  throw new Error("Erro");
}

function nivel2() {
  try {
    nivel3();
  } finally {
    console.log("Finally em nivel2");
    // Executa DURANTE propagação
  }
}

function nivel1() {
  try {
    nivel2();
  } catch (e) {
    console.log("Capturado em nivel1");
  }
}

nivel1();

// Output:
// "Finally em nivel2"
// "Capturado em nivel1"
```

**Fundamento teórico:** Finally **sempre executa** durante stack unwinding - garante cleanup.

### Modelo Mental para Compreensão

Pense em error propagation como **alarme de emergência**:

**Throw:** Alarme dispara no andar 1
**Propagation:** Alarme sobe pelos andares
**Catch:** Alguém no andar 5 desativa alarme

**Analogia:**
- **Call stack:** Prédio com andares
- **Throw:** Alarme no andar inferior
- **Propagation:** Alarme sobe
- **Catch:** Desativar alarme em andar superior
- **Finally:** Procedimento de emergência (sempre executado)

**Metáfora:**
- **Função:** Pessoa passando bola
- **Erro:** Bola pegando fogo
- **Propagation:** Ninguém segura - passa para cima
- **Catch:** Alguém apaga o fogo

## 🔍 Análise Conceitual Profunda

### Nested Try/Catch Propagation

```typescript
function processo() {
  try {
    try {
      throw new Error("Erro interno");
    } catch (e) {
      console.log("Catch interno");
      throw e;  // Re-lança para catch externo
    }
  } catch (e) {
    console.log("Catch externo");
  }
}

processo();

// Output:
// "Catch interno"
// "Catch externo"
```

**Análise profunda:** Catch interno **processa** erro, re-lança para catch externo **continuar tratamento**.

#### Selective Re-throwing

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function processo() {
  try {
    operacao();
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log("Validação falhou - recuperável");
      // NÃO re-lança - trata localmente
    } else {
      console.log("Erro desconhecido - propagando");
      throw e;  // Re-lança outros erros
    }
  }
}
```

**Conceito avançado:** **Selective re-throwing** - trata erros conhecidos, propaga desconhecidos.

### Error Wrapping During Propagation

```typescript
class AppError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = "AppError";
  }
}

function nivel3() {
  throw new Error("Erro baixo nível");
}

function nivel2() {
  try {
    nivel3();
  } catch (e) {
    // Encapsula erro original
    throw new AppError(
      "Erro em nivel2",
      e instanceof Error ? e : undefined
    );
  }
}

function nivel1() {
  try {
    nivel2();
  } catch (e) {
    if (e instanceof AppError) {
      console.log("Erro:", e.message);
      console.log("Causado por:", e.cause?.message);
    }
  }
}

nivel1();

// Output:
// "Erro: Erro em nivel2"
// "Causado por: Erro baixo nível"
```

**Fundamento teórico:** **Error wrapping** adiciona contexto durante propagação - mantém erro original.

### Async Error Propagation with Promises

```typescript
async function nivel3() {
  throw new Error("Erro async");
}

async function nivel2() {
  return nivel3();  // Propaga Promise rejection
}

async function nivel1() {
  return nivel2();  // Propaga Promise rejection
}

// Captura com .catch()
nivel1()
  .then(() => console.log("Sucesso"))
  .catch(e => console.log("Erro:", e.message));

// Ou com async/await
async function exemplo() {
  try {
    await nivel1();
  } catch (e) {
    console.log("Erro:", e instanceof Error ? e.message : e);
  }
}
```

**Análise profunda:** Throw em async function **rejeita Promise** - propaga via Promise chain.

#### Event Loop Breaks Propagation

```typescript
function exemplo() {
  try {
    setTimeout(() => {
      throw new Error("Erro em callback");
    }, 0);
  } catch (e) {
    // ❌ NÃO captura - erro em callback diferente
    console.log("Nunca captura");
  }
}

exemplo();

// Erro não capturado - termina programa
// Event loop executa callback DEPOIS de try/catch terminar
```

**Conceito crucial:** **Event loop** quebra propagação - callback executa em **call stack diferente**.

**Solução:**
```typescript
function exemplo() {
  setTimeout(() => {
    try {
      throw new Error("Erro em callback");
    } catch (e) {
      console.log("Capturado dentro do callback");
    }
  }, 0);
}
```

### Propagation with Multiple Callers

```typescript
function operacao() {
  throw new Error("Erro");
}

function path1() {
  try {
    operacao();
  } catch (e) {
    console.log("Path1 captura");
  }
}

function path2() {
  operacao();  // Propaga - sem try/catch
}

path1();  // Captura localmente
// Output: "Path1 captura"

try {
  path2();
} catch (e) {
  console.log("Captura externa");
}
// Output: "Captura externa"
```

**Fundamento teórico:** **Mesmo erro** pode ter **tratamentos diferentes** dependendo de quem chama.

#### Propagation Across Modules

```typescript
// arquivo: database.ts
export function query(sql: string) {
  if (!connected) {
    throw new Error("Database não conectado");
  }
  return executeQuery(sql);
}

// arquivo: service.ts
import { query } from "./database";

export function buscarUsuario(id: number) {
  return query(`SELECT * FROM users WHERE id = ${id}`);
  // Propaga erro de query automaticamente
}

// arquivo: controller.ts
import { buscarUsuario } from "./service";

export function getUser(req, res) {
  try {
    const usuario = buscarUsuario(req.params.id);
    res.json(usuario);
  } catch (e) {
    console.error("Erro ao buscar usuário:", e);
    res.status(500).json({ error: "Erro interno" });
  }
}
```

**Análise profunda:** Erro propaga **através de módulos** - database → service → controller.

### Error Propagation with Return Values

```typescript
function processar(): number {
  try {
    operacao();
    return 42;
  } catch (e) {
    console.log("Erro capturado");
    return -1;  // Return alternativo após catch
  }
}

function exemplo() {
  const resultado = processar();
  console.log(resultado);  // -1 se erro, 42 se sucesso
}
```

**Conceito:** Catch pode **retornar valor alternativo** ao invés de propagar.

#### Propagation with Cleanup

```typescript
function processo() {
  const recurso = adquirirRecurso();
  
  try {
    operacao(recurso);
  } finally {
    liberarRecurso(recurso);  // Cleanup durante propagação
  }
  
  // Se operacao() lançou erro, finally libera recurso
  // e erro continua propagando
}

try {
  processo();
} catch (e) {
  console.log("Erro capturado após cleanup");
}
```

**Fundamento teórico:** Finally garante **cleanup** mesmo durante propagação.

### Transformation During Propagation

```typescript
function nivel3() {
  throw new Error("Erro técnico: DB connection failed");
}

function nivel2() {
  try {
    nivel3();
  } catch (e) {
    // Transforma erro técnico em erro de usuário
    throw new Error("Não foi possível buscar dados. Tente novamente.");
  }
}

function nivel1() {
  try {
    nivel2();
  } catch (e) {
    // Usuário vê mensagem amigável
    console.log(e instanceof Error ? e.message : e);
  }
}

nivel1();
// Output: "Não foi possível buscar dados. Tente novamente."
```

**Conceito avançado:** **Error transformation** - converte erros técnicos em mensagens user-friendly.

#### Conditional Propagation

```typescript
function operacao(retryable: boolean) {
  try {
    processo();
  } catch (e) {
    if (retryable) {
      console.log("Retry...");
      return retry();
    } else {
      console.log("Não recuperável - propagando");
      throw e;
    }
  }
}
```

**Análise profunda:** **Conditional propagation** - decide se propaga baseado em context.

### Propagation with Logging

```typescript
function nivel3() {
  throw new Error("Erro em nivel3");
}

function nivel2() {
  try {
    nivel3();
  } catch (e) {
    console.log("[nivel2] Erro detectado:", e instanceof Error ? e.message : e);
    throw e;  // Loga e propaga
  }
}

function nivel1() {
  try {
    nivel2();
  } catch (e) {
    console.log("[nivel1] Erro capturado:", e instanceof Error ? e.message : e);
  }
}

nivel1();

// Output:
// "[nivel2] Erro detectado: Erro em nivel3"
// "[nivel1] Erro capturado: Erro em nivel3"
```

**Fundamento teórico:** Cada nível pode **logar** erro antes de propagar - debugging trail.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
// Camadas: Database → Service → Controller

// Database
function dbQuery(sql: string) {
  if (!connected) {
    throw new Error("Database não conectado");
  }
  return execute(sql);
}

// Service
function userService(id: number) {
  const user = dbQuery(`SELECT * FROM users WHERE id = ${id}`);
  // Propaga erro de database automaticamente
  return user;
}

// Controller
app.get("/users/:id", (req, res) => {
  try {
    const user = userService(req.params.id);
    res.json(user);
  } catch (e) {
    console.error("Erro:", e);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});
```

**Raciocínio:** Erro propaga database → service → controller - capturado no topo.

### Validation Chain

```typescript
function validarEmail(email: string) {
  if (!email.includes("@")) {
    throw new ValidationError("Email inválido", "email", email);
  }
}

function validarIdade(idade: number) {
  if (idade < 0) {
    throw new ValidationError("Idade inválida", "idade", idade);
  }
}

function validarUsuario(usuario: any) {
  validarEmail(usuario.email);    // Propaga se inválido
  validarIdade(usuario.idade);    // Propaga se inválido
  // Se chegou aqui, usuário é válido
}

try {
  validarUsuario({ email: "abc", idade: -5 });
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`${e.field}: ${e.message}`);
  }
}
```

**Raciocínio:** Validações propagam erros - primeira inválida para todo processo.

### Async Operation Chain

```typescript
async function fetchData() {
  const response = await fetch("/api/data");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function processData() {
  const data = await fetchData();  // Propaga erro de fetch
  return transform(data);
}

async function main() {
  try {
    const result = await processData();
    console.log(result);
  } catch (e) {
    console.error("Erro:", e);
  }
}
```

**Raciocínio:** Erros async propagam via Promise rejection.

## ⚠️ Limitações e Considerações Teóricas

### Event Loop Isolation

```typescript
try {
  setTimeout(() => {
    throw new Error("Erro");
  }, 0);
} catch (e) {
  // ❌ NÃO captura
}
```

**Limitação:** Event loop cria **novo call stack** - propagação não cruza.

### Performance Impact

```typescript
// Stack unwinding tem overhead
function deep(n: number) {
  if (n === 0) {
    throw new Error("Bottom");
  }
  deep(n - 1);
}

deep(10000);  // Unwind 10000 stack frames - lento
```

**Consideração:** Deep call stacks com propagação são **custosos**.

### Lost Context Without Wrapping

```typescript
function lowLevel() {
  throw new Error("Connection timeout");
}

function highLevel() {
  lowLevel();  // Propaga - mas perde context
}
```

**Limitação:** Propagação simples pode perder **context** - wrapping ajuda.

## 🔗 Interconexões Conceituais

**Relação com Call Stack:** Erro sobe pela call stack.

**Relação com Stack Unwinding:** Funções desempilhadas durante propagação.

**Relação com Try/Catch:** Catch para propagação.

**Relação com Finally:** Finally executa durante propagação.

**Relação com Re-throw:** Permite continuar propagação após processar.

## 🚀 Evolução e Próximos Conceitos

Dominar error propagation prepara para:
- **Error Recovery Patterns:** Estratégias de recuperação
- **Error Boundaries:** React error boundaries
- **Global Error Handlers:** Capturar erros não tratados
- **Async Error Handling:** Propagação em Promises/async
