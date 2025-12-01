# Error Stack Trace

## 🎯 Introdução e Definição

### Definição Conceitual

**Error Stack Trace** (ou **stack trace**, **call stack trace**) é uma **representação textual** da **call stack** (pilha de chamadas) no momento em que um **erro ocorre**. Stack trace mostra a **sequência de chamadas de funções** que levaram ao erro - qual função chamou qual, em que arquivo, e em que linha. Esta informação é **essencial para debugging**, permitindo rastrear a **origem exata** do problema através do caminho de execução.

Conceitualmente, stack trace é um **snapshot** do **execution context** no momento do erro. Quando JavaScript/TypeScript executa código, mantém uma **call stack** - estrutura de dados que registra funções sendo executadas. Quando erro ocorre, JavaScript captura esta stack e a formata como string na propriedade `Error.stack`. Stack trace típico mostra: **nome da função**, **arquivo**, **linha**, e **coluna** onde erro ocorreu, bem como **toda cadeia de chamadas** até aquele ponto.

Stack trace é **não padronizado** pelo ECMAScript - formato varia entre engines (V8/Chrome/Node, SpiderMonkey/Firefox, JavaScriptCore/Safari). Porém, é **universalmente suportado** e crucial para debugging.

### Contexto Histórico e Motivação

**JavaScript Inicial (1995):** Erros ocorriam sem informação de contexto - apenas mensagem.

**Error Object (1998):** Introduziu `Error` class com `message` e `name`.

**Stack Trace (2000s):** Engines começaram adicionar `stack` property:
- **V8 (Chrome/Node):** Stack trace detalhado com arquivo:linha:coluna
- **SpiderMonkey (Firefox):** Formato similar
- **JavaScriptCore (Safari):** Stack trace com menos detalhes

**Source Maps (2010s):** Permite mapear stack traces de código transpilado (TypeScript/minificado) para código original.

**Error.captureStackTrace (V8):** API para capturar stack customizado.

**Motivação para stack trace:**
- **Debugging:** Localizar origem do erro rapidamente
- **Error Reporting:** Enviar stack trace para logs/monitoring
- **Development:** IDEs usam stack trace para navigation
- **Production:** Stack traces em production ajudam diagnosticar bugs

### Problema Fundamental que Resolve

Stack trace resolve o problema de **rastrear origem de erros** em código complexo com múltiplas camadas de chamadas.

**Sem Stack Trace:**
```typescript
// Erro ocorre, mas não sabemos onde começou
function processar() {
  calcular();
}

function calcular() {
  dividir(10, 0);
}

function dividir(a: number, b: number) {
  return a / b;  // Infinity - não gera erro
}

processar();  // Onde está o problema?
```

**Com Stack Trace:**
```typescript
function processar() {
  calcular();
}

function calcular() {
  dividir(10, 0);
}

function dividir(a: number, b: number) {
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

try {
  processar();
} catch (e) {
  console.log(e.stack);
  // Error: Divisão por zero
  //     at dividir (arquivo.ts:10:11)
  //     at calcular (arquivo.ts:6:3)
  //     at processar (arquivo.ts:2:3)
  //     at <anonymous> (arquivo.ts:14:1)
}
```

**Análise profunda:** Stack trace mostra **caminho completo** - `processar` → `calcular` → `dividir` - identificando linha exata do erro.

**Com TypeScript Transpilado:**
```typescript
// TypeScript original
function processar() {
  calcular();  // Linha 2
}

// JavaScript gerado (sem source map)
function processar() {
  calcular();  // Linha pode mudar
}

// Stack trace sem source map
// Error: Divisão por zero
//     at dividir (arquivo.js:10:11)  // ❌ Aponta para JS, não TS

// Stack trace com source map
// Error: Divisão por zero
//     at dividir (arquivo.ts:10:11)  // ✅ Aponta para TS original
```

**Fundamento teórico:** Source maps permitem **mapear** stack traces de código transpilado para código **original**.

### Importância no Ecossistema

Stack trace é crucial porque:

- **Debugging:** Essencial para localizar bugs rapidamente
- **Error Monitoring:** Sentry, LogRocket usam stack traces
- **IDE Integration:** VS Code navega para linha do erro via stack trace
- **Production Debugging:** Stack traces em logs ajudam diagnosticar bugs remotos
- **Testing:** Test frameworks mostram stack trace de assertions falhadas

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Call Stack:** Pilha de funções sendo executadas
2. **Stack Trace:** Representação textual da call stack no momento do erro
3. **Stack Frames:** Cada entrada na stack (função, arquivo, linha, coluna)
4. **Source Maps:** Mapeamento de código transpilado para original
5. **Stack Trace Formats:** Variam entre engines (V8, SpiderMonkey)

### Pilares Fundamentais

- **Error.stack:** Property contendo stack trace
- **Stack Frames:** Função + arquivo + linha + coluna
- **Call Stack Order:** Stack trace mostra ordem inversa (última chamada primeiro)
- **Source Maps:** `.map` files para mapear código transpilado
- **Stack Trace Limits:** Engines limitam profundidade (default 10 frames em V8)

### Visão Geral das Nuances

- **Non-Standard:** `stack` property não é padronizado ECMAScript
- **Format Variation:** Formato varia entre V8, SpiderMonkey, JavaScriptCore
- **Async Stack Traces:** Async/await pode quebrar stack trace (Node 12+ melhorou)
- **Error.captureStackTrace:** V8-specific API para customizar stack
- **Stack Trace Parsing:** Parsers como `error-stack-parser` normalizam formato

## 🧠 Fundamentos Teóricos

### Como Funciona Internalmente

#### Call Stack Mechanism

```typescript
// Código
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error("Erro em C");
}

// Call stack durante execução:
// [global]
// [global] -> a()
// [global] -> a() -> b()
// [global] -> a() -> b() -> c()  // Erro aqui

// Stack trace captura este momento:
// Error: Erro em C
//     at c (...)
//     at b (...)
//     at a (...)
//     at <anonymous> (...)
```

**Análise profunda:**

**1. Call Stack Building:**
- Cada chamada de função adiciona **frame** à stack
- Frame contém: função, argumentos, variáveis locais, linha de retorno
- Stack cresce conforme funções são chamadas

**2. Stack Unwinding (Error):**
- Quando erro ocorre, JavaScript **captura** estado atual da stack
- Formata stack como string: `Error.stack`
- Stack é "unwound" (desempilhada) até erro ser capturado ou programa terminar

**3. Stack Trace Format (V8):**
```
Error: <message>
    at <function> (<file>:<line>:<column>)
    at <function> (<file>:<line>:<column>)
    ...
```

#### Stack Trace Components

```typescript
function exemplo() {
  throw new Error("Teste");
}

try {
  exemplo();
} catch (e) {
  console.log(e.stack);
}

// Output (V8):
// Error: Teste
//     at exemplo (arquivo.ts:2:9)
//     at <anonymous> (arquivo.ts:6:3)

// Componentes de cada frame:
// - Função: "exemplo"
// - Arquivo: "arquivo.ts"
// - Linha: 2
// - Coluna: 9
```

**Conceito fundamental:** Stack trace tem **múltiplos frames** - cada frame representa uma chamada de função.

### Princípios e Conceitos Subjacentes

#### Stack Trace Structure (V8)

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
}

// Stack trace (V8/Node.js):
// Error: Erro na função C
//     at funcaoC (arquivo.ts:10:9)
//     at funcaoB (arquivo.ts:6:3)
//     at funcaoA (arquivo.ts:2:3)
//     at Object.<anonymous> (arquivo.ts:14:3)
//     at Module._compile (internal/modules/cjs/loader.js:1137:30)
//     at Object.Module._extensions..js (internal/modules/cjs/loader.js:1157:10)
//     ...
```

**Análise profunda:**

**Ordem:** Stack trace mostra ordem **inversa** - última chamada (onde erro ocorreu) primeiro.

**Frames:**
- `funcaoC`: Onde erro foi lançado
- `funcaoB`: Chamou funcaoC
- `funcaoA`: Chamou funcaoB
- `<anonymous>`: Global scope

**Internal Frames:** Node.js inclui frames internos (Module._compile) - podem ser filtrados.

#### Stack Trace Formats - Engine Comparison

**V8 (Chrome/Node.js):**
```
Error: mensagem
    at funcao (arquivo.ts:linha:coluna)
    at funcao2 (arquivo.ts:linha:coluna)
```

**SpiderMonkey (Firefox):**
```
funcao@arquivo.ts:linha:coluna
funcao2@arquivo.ts:linha:coluna
```

**JavaScriptCore (Safari):**
```
funcao@arquivo.ts:linha:coluna
funcao2@arquivo.ts:linha:coluna
```

**Fundamento teórico:** Formato varia, mas informação essencial (função, arquivo, linha) é consistente.

#### Stack Trace Limits

```typescript
// V8 - limitar profundidade de stack trace
Error.stackTraceLimit = 5;  // Default: 10

function recursiva(n: number): any {
  if (n === 0) throw new Error("Stack trace limitado");
  return recursiva(n - 1);
}

try {
  recursiva(20);
} catch (e) {
  console.log(e.stack);
  // Mostra apenas 5 frames mais recentes, não todos os 20
}

// Remover limite (não recomendado)
Error.stackTraceLimit = Infinity;
```

**Limitação:** Stack trace é limitado para evitar overhead - pode não mostrar call stack completo.

#### Source Maps - Transpiled Code

**TypeScript Original (app.ts):**
```typescript
function processar() {
  validar();  // Linha 2
}

function validar() {
  throw new Error("Validação falhou");  // Linha 6
}

processar();
```

**JavaScript Transpilado (app.js):**
```javascript
function processar() {
  validar();  // Linha pode mudar
}

function validar() {
  throw new Error("Validação falhou");
}

processar();
```

**Stack Trace Sem Source Map:**
```
Error: Validação falhou
    at validar (app.js:5:9)  // ❌ Aponta para JS
    at processar (app.js:2:3)
```

**Stack Trace Com Source Map:**
```
Error: Validação falhou
    at validar (app.ts:6:9)  // ✅ Aponta para TS original
    at processar (app.ts:2:3)
```

**Conceito crucial:** Source maps (.map files) permitem **mapear** stack traces de código transpilado para código **original**.

### Modelo Mental para Compreensão

Pense em stack trace como **breadcrumbs** (migalhas de pão) que mostram caminho percorrido até erro:

**Call Stack (Execution):**
```
[Global] → funcaoA() → funcaoB() → funcaoC() → ERROR
```

**Stack Trace (Representation):**
```
ERROR em funcaoC (linha 10)
  ← chamado por funcaoB (linha 6)
    ← chamado por funcaoA (linha 2)
      ← chamado por Global (linha 14)
```

## 🔍 Análise Conceitual Profunda

### Stack Trace Parsing

```typescript
// Stack trace como string
const stackTrace = `
Error: Teste
    at funcaoC (arquivo.ts:10:9)
    at funcaoB (arquivo.ts:6:3)
    at funcaoA (arquivo.ts:2:3)
`;

// Parsear manualmente (simplificado)
function parseStackTrace(stack: string) {
  const frames = stack.split('\n').slice(1);  // Remove primeira linha (message)
  
  return frames.map(frame => {
    const match = frame.match(/at (.+) \((.+):(\d+):(\d+)\)/);
    if (match) {
      return {
        funcao: match[1],
        arquivo: match[2],
        linha: parseInt(match[3]),
        coluna: parseInt(match[4]),
      };
    }
    return null;
  }).filter(Boolean);
}

console.log(parseStackTrace(stackTrace));
// [
//   { funcao: 'funcaoC', arquivo: 'arquivo.ts', linha: 10, coluna: 9 },
//   { funcao: 'funcaoB', arquivo: 'arquivo.ts', linha: 6, coluna: 3 },
//   { funcao: 'funcaoA', arquivo: 'arquivo.ts', linha: 2, coluna: 3 }
// ]
```

**Análise profunda:** Parsear stack trace permite **extrair informações estruturadas** para análise programática.

#### Error.captureStackTrace (V8)

```typescript
// Customizar stack trace (V8/Node.js only)
class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
    
    // Capturar stack trace, mas remover constructor
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

// Sem captureStackTrace:
const erro1 = new Error("Teste");
console.log(erro1.stack);
// Error: Teste
//     at new Error (...)  // Constructor aparece
//     at <anonymous> (...)

// Com captureStackTrace:
const erro2 = new CustomError("Teste");
console.log(erro2.stack);
// CustomError: Teste
//     at <anonymous> (...)  // Constructor não aparece
```

**Fundamento teórico:** `Error.captureStackTrace(target, constructor)` captura stack trace mas **exclui** frames acima de `constructor`.

#### Stack Trace Filtering

```typescript
// Filtrar frames internos do Node.js
function filtrarStackTrace(stack: string): string {
  return stack
    .split('\n')
    .filter(line => {
      // Remover frames internos do Node
      return !line.includes('node_modules') &&
             !line.includes('internal/') &&
             !line.includes('Module._compile');
    })
    .join('\n');
}

try {
  throw new Error("Teste");
} catch (e) {
  console.log(filtrarStackTrace(e.stack));
  // Stack trace apenas com código da aplicação
}
```

**Conceito avançado:** Filtrar stack trace remove **noise** (frames internos) - facilita localizar código da aplicação.

#### Async Stack Traces

```typescript
// Problema: async quebra stack trace (Node < 12)
async function funcaoA() {
  await funcaoB();
}

async function funcaoB() {
  await funcaoC();
}

async function funcaoC() {
  throw new Error("Erro async");
}

// Stack trace sem async context (Node < 12):
// Error: Erro async
//     at funcaoC (arquivo.ts:10:9)
//     at async funcaoB (arquivo.ts:6:9)
// ❌ Stack trace não mostra funcaoA

// Node 12+ com --async-stack-traces:
// Error: Erro async
//     at funcaoC (arquivo.ts:10:9)
//     at async funcaoB (arquivo.ts:6:9)
//     at async funcaoA (arquivo.ts:2:9)
// ✅ Stack trace completo
```

**Limitação:** Async operations podem **quebrar** stack trace - Node 12+ melhorou com `--async-stack-traces`.

#### Stack Trace em Promise Rejections

```typescript
// Promise rejection sem stack trace adequado
function funcaoA() {
  return funcaoB();
}

function funcaoB() {
  return Promise.reject(new Error("Erro promise"));
}

funcaoA().catch(e => {
  console.log(e.stack);
  // Error: Erro promise
  //     at funcaoB (arquivo.ts:6:24)
  // ❌ Não mostra funcaoA
});

// Melhor: throw dentro de async function
async function funcaoA2() {
  await funcaoB2();
}

async function funcaoB2() {
  throw new Error("Erro async");
}

funcaoA2().catch(e => {
  console.log(e.stack);
  // Error: Erro async
  //     at funcaoB2 (arquivo.ts:20:9)
  //     at async funcaoA2 (arquivo.ts:16:3)
  // ✅ Stack trace completo
});
```

**Fundamento teórico:** Promise rejections têm **stack trace limitado** - async/await melhora.

### Source Maps - Deep Dive

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "sourceMap": true  // Gera .map files
  }
}
```

**TypeScript (app.ts):**
```typescript
function processar() {
  validar();
}

function validar() {
  throw new Error("Erro");
}

processar();
```

**JavaScript Gerado (app.js):**
```javascript
function processar() {
  validar();
}

function validar() {
  throw new Error("Erro");
}

processar();
//# sourceMappingURL=app.js.map
```

**Source Map (app.js.map):**
```json
{
  "version": 3,
  "file": "app.js",
  "sourceRoot": "",
  "sources": ["app.ts"],
  "mappings": "AAAA,SAAS,SAAS;IAChB,OAAO,EAAE,CAAC;AACZ,CAAC..."
}
```

**Stack Trace (Browser/Node com source-map-support):**
```
Error: Erro
    at validar (app.ts:6:9)  // ✅ Aponta para TS original
    at processar (app.ts:2:3)
```

**Conceito crucial:** Source maps contêm **mappings** que traduzem posições no JS para TS original.

#### Source Map Support (Node.js)

```typescript
// Instalar: npm install source-map-support
import 'source-map-support/register';

// Agora stack traces apontam para TS original
function processar() {
  throw new Error("Teste");
}

processar();
// Error: Teste
//     at processar (app.ts:5:9)  // ✅ .ts, não .js
```

**Fundamento teórico:** `source-map-support` instala handler que traduz stack traces automaticamente.

### Stack Trace em Production

```typescript
// Minificação remove nomes de funções
// Original:
function processarUsuario(usuario) {
  validarUsuario(usuario);
}

// Minificado:
function a(b){c(b)}

// Stack trace em production (sem source map):
// Error: Erro
//     at c (bundle.js:1:234)  // ❌ Não sabemos que função é
//     at a (bundle.js:1:123)

// Stack trace com source map em production:
// Error: Erro
//     at validarUsuario (app.ts:10:5)  // ✅ Nome original
//     at processarUsuario (app.ts:6:3)
```

**Consideração:** Source maps em production expõem código original - decidir se publicar `.map` files.

### Custom Stack Trace Formatting

```typescript
// Customizar formato de stack trace
class CustomError extends Error {
  toDetailedString(): string {
    const frames = this.stack?.split('\n').slice(1) || [];
    
    return [
      `❌ ${this.name}: ${this.message}`,
      '',
      'Call Stack:',
      ...frames.map((frame, i) => `  ${i + 1}. ${frame.trim()}`),
    ].join('\n');
  }
}

const erro = new CustomError("Teste");
console.log(erro.toDetailedString());
// ❌ CustomError: Teste
//
// Call Stack:
//   1. at <anonymous> (arquivo.ts:15:14)
//   2. at ...
```

**Conceito avançado:** Customizar formatação de stack trace para logs/UI.

## 🎯 Aplicabilidade e Contextos

### Error Logging

```typescript
function logError(erro: Error): void {
  console.error('Error:', erro.message);
  console.error('Name:', erro.name);
  console.error('Stack Trace:');
  console.error(erro.stack);
}

try {
  operacao();
} catch (e) {
  if (e instanceof Error) {
    logError(e);
  }
}
```

**Raciocínio:** Stack trace em logs facilita debugging remoto.

### Error Monitoring (Sentry)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({ dsn: 'YOUR_DSN' });

try {
  operacao();
} catch (e) {
  Sentry.captureException(e);  // Envia stack trace para Sentry
}
```

**Raciocínio:** Tools como Sentry usam stack trace para agrupar erros e facilitar debugging.

### IDE Navigation

```typescript
// VS Code clica em stack trace e navega para arquivo:linha
// Error: Teste
//     at processar (app.ts:10:5)  // Ctrl+Click → abre app.ts:10
```

**Raciocínio:** IDEs usam stack trace para navigation.

## ⚠️ Limitações e Considerações Teóricas

### Non-Standard Property

```typescript
const erro = new Error("Teste");
console.log(erro.stack);  // string | undefined
// `stack` não é padronizado - formato varia
```

**Limitação:** `stack` property não é ECMAScript standard - pode não existir.

### Stack Trace Limits

```typescript
Error.stackTraceLimit = 10;  // V8 default
// Stack trace não mostra call stack completo se > 10 frames
```

**Limitação:** Stack trace é limitado - pode não mostrar caminho completo.

### Async Stack Traces

```typescript
// Promise rejections têm stack trace limitado
Promise.reject(new Error("Teste"));
// Stack trace não mostra onde Promise foi criado
```

**Limitação:** Async operations quebram stack trace (melhorou em Node 12+).

## 🔗 Interconexões Conceituais

**Relação com Error Object:** Stack trace é property de Error.

**Relação com Debugging:** Stack trace é essencial para localizar bugs.

**Relação com Source Maps:** Source maps traduzem stack traces.

**Relação com Testing:** Test frameworks mostram stack trace de assertions.

## 🚀 Evolução e Próximos Conceitos

Dominar stack trace prepara para:
- **Try/Catch/Finally:** Capturar e tratar errors
- **Error Propagation:** Como errors propagam pela stack
- **Custom Errors:** Criar erros com stack customizado
- **Error Monitoring:** Integração com Sentry/LogRocket
- **Debugging Tools:** Usar debugger e breakpoints
