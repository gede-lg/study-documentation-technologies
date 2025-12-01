# Bloco Catch

## 🎯 Introdução e Definição

### Definição Conceitual

**Bloco catch** é a **estrutura de controle** que **captura** e **trata** erros lançados dentro de um bloco `try` correspondente. Quando erro ocorre em try block, execução **imediatamente transfere** para catch block, que recebe o **error object** como parâmetro e permite **recuperação graciosa** - registrar erro, exibir mensagem ao usuário, tentar operação alternativa, ou propagar erro de forma controlada.

Conceitualmente, catch block é **error handler** - define o que fazer quando código protegido falha. Catch recebe um **binding** (parâmetro) que representa o erro capturado, tradicionalmente chamado `e`, `err`, ou `error`. Este binding contém informações sobre o erro - mensagem, tipo, stack trace - permitindo **diagnóstico** e **tratamento adequado**.

TypeScript **aprimorou** catch binding em versão 4.0+ - ao invés de tipo `any` (padrão JavaScript), catch binding agora tem tipo `unknown` por default, forçando **type narrowing** explícito antes de acessar properties. Isso aumenta **type safety** - previne acesso a properties inexistentes.

### Contexto Histórico e Motivação

**JavaScript 1.4 (1998):** Introduziu `catch` clause como complemento de `try`.

**ECMAScript 3 (1999):** Padronizou catch com binding obrigatório: `catch (e)`.

**ECMAScript 2019 (ES10):** Permitiu **optional catch binding** - `catch` sem parâmetro: `catch { }`.

**TypeScript 4.0 (2020):** Mudou tipo de catch binding de `any` para `unknown` - aumentou type safety.

**Motivação histórica:**

**Antes de catch:**
```javascript
// Sem error handling - programa termina
function dividir(a, b) {
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

dividir(10, 0);  // Error não capturado - programa termina
```

**Com catch:**
```typescript
function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

try {
  const resultado = dividir(10, 0);
  console.log(resultado);
} catch (e) {
  console.log("Erro capturado e tratado:", e);
  // Programa continua normalmente
}
```

**Motivação para catch block:**
- **Error Recovery:** Recuperar de erros ao invés de crashar
- **Error Logging:** Registrar erros para debugging
- **User Feedback:** Exibir mensagens amigáveis ao usuário
- **Fallback Logic:** Tentar operação alternativa
- **Error Transformation:** Encapsular erro original em erro customizado

### Problema Fundamental que Resolve

Catch block resolve o problema de **o que fazer quando código falha**.

**Problema: Erro não tratado**
```typescript
// ❌ Sem catch - erro termina programa
try {
  JSON.parse('{ invalido }');
}
// Programa termina aqui com SyntaxError
console.log("Esta linha nunca executa");
```

**Solução: Catch trata erro**
```typescript
// ✅ Com catch - erro tratado, programa continua
try {
  JSON.parse('{ invalido }');
} catch (e) {
  console.log("JSON inválido, usando valores default");
}
console.log("Programa continua normalmente");  // ✅ Executa
```

**Exemplo Real: API Error Handling**
```typescript
async function buscarUsuario(id: number) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    // Catch permite tratamento adequado
    if (e instanceof Error && e.message.includes('404')) {
      console.log("Usuário não encontrado");
      return null;
    }
    console.error("Erro ao buscar usuário:", e);
    throw e;  // Re-throw para caller tratar
  }
}
```

**Fundamento teórico:** Catch permite **decisões contextuais** sobre como tratar cada tipo de erro.

### Importância no Ecossistema

Catch block é crucial porque:

- **Error Handling Strategy:** Define como aplicação responde a falhas
- **Application Resilience:** Permite recuperação graciosa
- **Debugging:** Facilita logging e diagnóstico
- **User Experience:** Permite feedback adequado ao usuário
- **Error Classification:** Diferentes tratamentos para diferentes erros

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Catch Binding:** Parâmetro que recebe error object
2. **Error Capture:** Catch captura qualquer erro do try correspondente
3. **Optional Binding:** ES2019+ permite catch sem parâmetro
4. **Type Narrowing:** TypeScript 4.0+ usa `unknown` type
5. **Error Handling:** Define recuperação de falhas

### Pilares Fundamentais

- **Error Parameter:** Catch recebe erro como binding
- **Execution Transfer:** Try com erro → imediato para catch
- **Single Catch:** Um catch captura todos erros do try
- **Error Access:** Binding permite acessar error properties
- **Recovery Logic:** Catch define como recuperar de erro

### Visão Geral das Nuances

- **Unknown Type:** TS 4.0+ - catch binding é `unknown`, não `any`
- **Type Guards:** Necessário type narrowing para acessar properties
- **Re-throwing:** Catch pode re-throw erro após logging
- **Optional Binding:** `catch { }` quando erro não é usado
- **Error Transformation:** Catch pode envolver erro em custom error

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Basic Catch Syntax

```typescript
try {
  throw new Error("Erro de teste");
} catch (e) {
  // e: unknown (TypeScript 4.0+)
  console.log("Erro capturado:", e);
}
```

**Análise profunda:**

**1. Execution Flow:**
```
Try block executa
  ↓
Erro ocorre
  ↓
Execução PARA no try
  ↓
Controle TRANSFERE para catch
  ↓
Catch executa com erro como binding
  ↓
Continua execução após try/catch
```

**2. Catch Binding:**
- Parâmetro que **recebe** error object
- Tradicionalmente chamado `e`, `err`, ou `error`
- Tipo `unknown` em TypeScript 4.0+ (antes era `any`)
- Scope: apenas dentro do catch block

#### Catch with Error Access

```typescript
try {
  throw new Error("Mensagem de erro");
} catch (e) {
  // TypeScript 4.0+: e é unknown
  // Precisa type narrowing
  
  if (e instanceof Error) {
    console.log("Mensagem:", e.message);
    console.log("Nome:", e.name);
    console.log("Stack:", e.stack);
  } else {
    console.log("Erro desconhecido:", e);
  }
}
```

**Conceito fundamental:** Catch binding permite **acesso** a error properties após type narrowing.

### Princípios e Conceitos Subjacentes

#### Catch Captures All Errors from Try

```typescript
try {
  const operacao = Math.random();
  
  if (operacao < 0.33) {
    throw new TypeError("Erro de tipo");
  } else if (operacao < 0.66) {
    throw new RangeError("Erro de range");
  } else {
    throw new Error("Erro genérico");
  }
} catch (e) {
  // Único catch captura TODOS os erros acima
  console.log("Erro capturado:", e);
}
```

**Fundamento teórico:** **Um catch** captura **qualquer erro** do try correspondente - JavaScript não tem multi-catch por tipo.

#### Type Narrowing in Catch (TypeScript)

```typescript
try {
  operacao();
} catch (e) {
  // e: unknown
  
  // ❌ Erro sem type narrowing
  // console.log(e.message);  // Error: Property 'message' does not exist on type 'unknown'
  
  // ✅ Type narrowing com instanceof
  if (e instanceof Error) {
    console.log(e.message);  // OK
  }
  
  // ✅ Type narrowing com type guard
  if (typeof e === "string") {
    console.log("Erro string:", e);
  }
  
  // ✅ Type assertion (menos seguro)
  const erro = e as Error;
  console.log(erro.message);
}
```

**Conceito crucial:** TypeScript 4.0+ requer **type narrowing** em catch - previne acesso inseguro.

#### Optional Catch Binding (ES2019)

```typescript
// ES2019+ - catch sem parâmetro
try {
  operacao();
} catch {
  // Sem binding - erro não acessível
  console.log("Erro ocorreu, mas não precisamos dos detalhes");
}

// Uso: quando erro não é relevante
try {
  JSON.parse(localStorage.getItem('config') || '{}');
} catch {
  // Ignora erro, usa default
  console.log("Config inválido, usando default");
}
```

**Análise profunda:** Optional catch binding útil quando **detalhes do erro não importam**.

#### Catch Scope

```typescript
try {
  throw new Error("Teste");
} catch (e) {
  // e só existe dentro deste catch block
  console.log(e);
}

// console.log(e);  // ❌ Error: Cannot find name 'e'

// Múltiplos catch (nested) podem ter mesmo nome
try {
  try {
    throw new Error("Interno");
  } catch (e) {
    console.log("Catch interno:", e);
  }
} catch (e) {
  console.log("Catch externo:", e);
}
```

**Fundamento teórico:** Catch binding é **block-scoped** - não acessível fora do catch.

### Modelo Mental para Compreensão

Pense em catch como **cláusula de contingência**:

**Try:** "Tente fazer isto"
**Catch:** "Se algo der errado, faça isto"

**Fluxo de Decisão:**
```
Try executa
  ↓
Sucesso? → Pula catch, continua
  ↓
Erro? → Entra em catch
  ↓
Catch trata erro
  ↓
Continua execução
```

## 🔍 Análise Conceitual Profunda

### Catch with Different Error Types

```typescript
try {
  const operacao = Math.random();
  
  if (operacao < 0.25) {
    throw new TypeError("Erro de tipo");
  } else if (operacao < 0.5) {
    throw new RangeError("Erro de range");
  } else if (operacao < 0.75) {
    throw new Error("Erro genérico");
  } else {
    throw "String error";  // Má prática, mas possível
  }
} catch (e) {
  // Diferenciação por instanceof
  if (e instanceof TypeError) {
    console.log("Erro de tipo:", e.message);
  } else if (e instanceof RangeError) {
    console.log("Erro de range:", e.message);
  } else if (e instanceof Error) {
    console.log("Erro genérico:", e.message);
  } else {
    console.log("Erro não-Error:", String(e));
  }
}
```

**Análise profunda:** JavaScript não tem **multi-catch** (como Java) - usar `instanceof` para diferenciar.

#### Catch with Error Logging

```typescript
try {
  await operacaoPerigosa();
} catch (e) {
  // Log para debugging
  console.error("Erro capturado:", e);
  
  if (e instanceof Error) {
    console.error("Stack trace:", e.stack);
  }
  
  // Enviar para serviço de monitoring
  // Sentry.captureException(e);
  
  // Exibir mensagem ao usuário
  alert("Operação falhou. Tente novamente.");
}
```

**Conceito avançado:** Catch permite **múltiplas ações** - logging, monitoring, user feedback.

### Catch with Re-throwing

```typescript
try {
  const resultado = await operacaoExterna();
} catch (e) {
  // Log erro localmente
  console.error("Erro na operação externa:", e);
  
  // Re-throw para caller tratar
  throw e;
}

// Ou transformar erro
try {
  const resultado = await operacaoExterna();
} catch (e) {
  throw new Error(`Falha na operação: ${e}`);
}
```

**Fundamento teórico:** **Re-throwing** permite logging local mas **delega tratamento** para caller.

#### Catch with Fallback Logic

```typescript
function carregarConfig(): Config {
  try {
    const json = localStorage.getItem('config');
    return JSON.parse(json || '{}');
  } catch (e) {
    console.warn("Config inválido, usando default:", e);
    return { theme: 'light', language: 'pt-BR' };  // Default
  }
}
```

**Conceito crucial:** Catch permite **fallback** - retornar valor alternativo quando operação falha.

### Catch in Async Functions

```typescript
async function buscarDados() {
  try {
    const response = await fetch("/api/dados");
    return await response.json();
  } catch (e) {
    // Catch captura:
    // 1. Network errors (fetch rejection)
    // 2. JSON parse errors
    console.error("Erro ao buscar dados:", e);
    return null;
  }
}
```

**Análise profunda:** Catch em async function captura **Promise rejections** (com await).

#### Catch with Conditional Re-throw

```typescript
try {
  await operacao();
} catch (e) {
  if (e instanceof NetworkError) {
    // Erro recuperável - retry
    console.log("Erro de rede, tentando novamente...");
    await operacao();
  } else {
    // Erro não recuperável - re-throw
    throw e;
  }
}
```

**Fundamento teórico:** Catch pode **decidir** se trata ou propaga erro.

### Catch with Error Transformation

```typescript
class OperacaoError extends Error {
  constructor(message: string, public causa: Error) {
    super(message);
    this.name = "OperacaoError";
  }
}

try {
  await operacaoComplexa();
} catch (e) {
  // Encapsular erro original em erro customizado
  if (e instanceof Error) {
    throw new OperacaoError("Operação complexa falhou", e);
  }
  throw e;
}
```

**Conceito avançado:** Catch pode **encapsular** erro original, adicionando contexto.

#### Catch with Multiple Actions

```typescript
try {
  await salvarDados(dados);
} catch (e) {
  // 1. Log erro
  console.error("Erro ao salvar:", e);
  
  // 2. Reverter mudanças
  await reverterMudancas();
  
  // 3. Notificar usuário
  mostrarMensagem("Falha ao salvar. Mudanças revertidas.");
  
  // 4. Enviar para monitoring
  Sentry.captureException(e);
  
  // 5. Re-throw se necessário
  // throw e;
}
```

**Análise profunda:** Catch pode executar **múltiplas ações** de recuperação.

### Catch in Promises (Without Await)

```typescript
// Promise.catch() é equivalente a try/catch com await
fetch("/api/dados")
  .then(r => r.json())
  .then(dados => console.log(dados))
  .catch(e => {
    // Equivalente a catch block
    console.error("Erro:", e);
  });

// Equivalente com async/await:
async function buscar() {
  try {
    const r = await fetch("/api/dados");
    const dados = await r.json();
    console.log(dados);
  } catch (e) {
    console.error("Erro:", e);
  }
}
```

**Fundamento teórico:** `.catch()` em Promises é **análogo** a catch block em try/catch.

#### Catch with Error Code Handling

```typescript
try {
  const response = await fetch("/api/dados");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
} catch (e) {
  if (e instanceof Error) {
    if (e.message.includes('404')) {
      console.log("Recurso não encontrado");
      return null;
    } else if (e.message.includes('500')) {
      console.log("Erro no servidor");
      throw e;  // Re-throw server errors
    }
  }
  console.error("Erro desconhecido:", e);
  throw e;
}
```

**Conceito avançado:** Catch pode **classificar erros** por código/mensagem.

### Catch with Cleanup (Without Finally)

```typescript
let conexao: Connection | null = null;

try {
  conexao = await conectar();
  await executarOperacao(conexao);
} catch (e) {
  console.error("Erro:", e);
  
  // Cleanup em catch (se não usar finally)
  if (conexao) {
    await conexao.fechar();
  }
  
  throw e;
}
```

**Limitação:** Cleanup em catch não executa se **sem erro** - `finally` é melhor para cleanup.

#### Catch Binding Name Conventions

```typescript
// Convenção 1: 'e'
try {
  operacao();
} catch (e) {
  console.log(e);
}

// Convenção 2: 'err'
try {
  operacao();
} catch (err) {
  console.log(err);
}

// Convenção 3: 'error'
try {
  operacao();
} catch (error) {
  console.log(error);
}

// Convenção 4: nome específico
try {
  validarDados();
} catch (validationError) {
  console.log(validationError);
}
```

**Convenção:** `e` ou `error` são mais comuns - escolher consistentemente.

### Catch with Type Assertion (Less Safe)

```typescript
try {
  operacao();
} catch (e) {
  // Type assertion - assume que é Error
  const erro = e as Error;
  console.log(erro.message);  // Não type-safe se e não for Error
  
  // Melhor: type guard
  if (e instanceof Error) {
    console.log(e.message);  // Type-safe
  }
}
```

**Limitação:** Type assertion **bypassa type checking** - preferir type guards.

#### Catch in Class Methods

```typescript
class ApiClient {
  async buscarDados(endpoint: string) {
    try {
      const response = await fetch(endpoint);
      return await response.json();
    } catch (e) {
      // Error handling em método de classe
      this.logError(e);
      throw e;
    }
  }
  
  private logError(e: unknown) {
    if (e instanceof Error) {
      console.error(`[ApiClient] ${e.message}`);
    }
  }
}
```

**Conceito avançado:** Catch em methods permite **encapsular** error handling.

### Catch with Custom Error Properties

```typescript
class ValidationError extends Error {
  constructor(message: string, public campo: string, public valor: any) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Idade inválida", "idade", -5);
} catch (e) {
  if (e instanceof ValidationError) {
    console.log(`Campo: ${e.campo}`);
    console.log(`Valor: ${e.valor}`);
    console.log(`Mensagem: ${e.message}`);
  }
}
```

**Fundamento teórico:** Custom errors permitem **type-safe access** a properties específicas.

## 🎯 Aplicabilidade e Contextos

### API Error Handling

```typescript
async function buscarUsuario(id: number) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    if (e instanceof Error && e.message.includes('404')) {
      return null;  // Usuário não encontrado
    }
    console.error("Erro ao buscar usuário:", e);
    throw e;
  }
}
```

**Raciocínio:** Catch permite **tratamento específico** por tipo de erro.

### JSON Parsing with Fallback

```typescript
function parseConfigSafe(json: string) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.warn("JSON inválido, usando default");
    return {};
  }
}
```

**Raciocínio:** Catch permite **fallback** quando parsing falha.

### Database Transaction Rollback

```typescript
async function executarTransacao() {
  try {
    await db.beginTransaction();
    await db.insert(...);
    await db.update(...);
    await db.commit();
  } catch (e) {
    await db.rollback();
    console.error("Transação revertida:", e);
    throw e;
  }
}
```

**Raciocínio:** Catch permite **rollback** quando transação falha.

## ⚠️ Limitações e Considerações Teóricas

### Single Catch per Try

```typescript
// JavaScript não tem multi-catch como Java
try {
  operacao();
} catch (e) {
  // Um catch captura TODOS os erros
  // Usar instanceof para diferenciar
}
```

**Limitação:** JavaScript não suporta multi-catch - usar `instanceof`.

### Catch Não Captura Promises Sem Await

```typescript
try {
  Promise.reject(new Error("Erro"));  // ❌ Não capturado
} catch (e) {
  console.log("Nunca executa");
}
```

**Limitação:** Catch não captura Promise rejections sem `await`.

### Unknown Type Requer Type Narrowing

```typescript
try {
  operacao();
} catch (e) {
  // e: unknown
  // console.log(e.message);  // ❌ Error
  if (e instanceof Error) {
    console.log(e.message);  // ✅ OK
  }
}
```

**Consideração:** TS 4.0+ requer type narrowing explícito.

## 🔗 Interconexões Conceituais

**Relação com Try:** Catch trata erros de try correspondente.

**Relação com Finally:** Finally executa após try/catch.

**Relação com Throw:** Catch captura erros lançados por throw.

**Relação com Type Guards:** Type narrowing necessário para type safety.

## 🚀 Evolução e Próximos Conceitos

Dominar catch block prepara para:
- **Typed Catch:** Type narrowing avançado
- **Finally Block:** Cleanup operations
- **Custom Errors:** Criar hierarquia de erros
- **Error Propagation:** Re-throwing strategies
