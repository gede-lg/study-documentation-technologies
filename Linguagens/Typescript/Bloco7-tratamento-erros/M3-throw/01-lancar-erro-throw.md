# Lançar Erro com Throw

## 🎯 Introdução e Definição

### Definição Conceitual

**Throw statement** é a **instrução** que **lança** (ou **dispara**) um erro em JavaScript/TypeScript, **interrompendo** imediatamente execução normal do código e **transferindo** controle para o bloco `catch` mais próximo na call stack. Throw é o mecanismo fundamental para **sinalizar condições excepcionais** - situações onde código não pode continuar executando normalmente e precisa **notificar** caller sobre o problema.

Conceitualmente, throw **inverte fluxo de controle** - ao invés de retornar valor normalmente, throw **"joga"** erro para cima na call stack, pulando todo código restante da função atual. Erro lançado **propaga** automaticamente através de chamadas de função até ser **capturado** por try/catch ou **terminar programa** se não capturado.

Throw pode lançar **qualquer valor** em JavaScript - `Error` instances, strings, numbers, objects, null. Porém, **convenção** e **best practice** é sempre lançar `Error` instances (ou subclasses), pois elas incluem **stack trace** e properties padronizadas (`message`, `name`).

### Contexto Histórico e Motivação

**JavaScript 1.3 (1998):** Introduziu `throw` statement junto com `try/catch`.

**ECMAScript 3 (1999):** Padronizou throw - pode lançar qualquer valor, não apenas `Error`.

**TypeScript (2012):** Manteve compatibilidade com JavaScript throw - sem modificações específicas.

**Evolução de error handling:**

**Antes de throw (return codes):**
```javascript
// Padrão antigo - return code para indicar erro
function dividir(a, b) {
  if (b === 0) {
    return null;  // Ou -1, ou undefined
  }
  return a / b;
}

const resultado = dividir(10, 0);
if (resultado === null) {
  console.log("Erro na divisão");
}
```

**Com throw (exceptions):**
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
  console.log("Erro capturado:", e);
}
```

**Motivação para throw:**
- **Explicit Error Signaling:** Sinalizar erros explicitamente ao invés de valores especiais
- **Automatic Propagation:** Erros propagam automaticamente pela call stack
- **Separation of Concerns:** Código normal separado de error handling
- **Stack Trace:** Error objects incluem stack trace para debugging
- **Type Safety:** Erros são diferenciados de valores normais

### Problema Fundamental que Resolve

Throw resolve o problema de **sinalizar condições excepcionais** de forma que **não possam ser ignoradas**.

**Problema: Return codes podem ser ignorados**
```typescript
// ❌ Return code pode ser ignorado
function validar(valor: number): boolean {
  if (valor < 0) {
    return false;  // Erro "silencioso"
  }
  return true;
}

// Caller pode ignorar return
validar(-5);  // Retorna false, mas nada impede continuar
processar(-5);  // Continua com valor inválido - bug!
```

**Solução: Throw força tratamento**
```typescript
// ✅ Throw não pode ser ignorado
function validar(valor: number): void {
  if (valor < 0) {
    throw new Error("Valor negativo não permitido");
  }
}

validar(-5);  // Lança erro - PRECISA ser tratado com try/catch
// ou programa termina
```

**Exemplo Real: Validação de Input**
```typescript
function processarPedido(pedido: any) {
  // Validações lançam erros se condições não atendidas
  if (!pedido.id) {
    throw new Error("ID do pedido é obrigatório");
  }
  
  if (pedido.valor <= 0) {
    throw new Error("Valor do pedido deve ser positivo");
  }
  
  if (!pedido.usuario) {
    throw new Error("Usuário é obrigatório");
  }
  
  // Se chegou aqui, pedido é válido
  return salvarPedido(pedido);
}

try {
  processarPedido({ id: null, valor: -10 });
} catch (e) {
  console.error("Pedido inválido:", e);
}
```

**Fundamento teórico:** Throw **força** caller a lidar com erro - não pode ser ignorado silenciosamente.

### Importância no Ecossistema

Throw é crucial porque:

- **Error Signaling:** Mecanismo padrão para sinalizar erros em JavaScript/TypeScript
- **Control Flow:** Permite interromper execução quando condição inválida
- **Separation of Concerns:** Separa validação de lógica de negócio
- **Stack Unwinding:** Erro propaga automaticamente até ser capturado
- **Debugging:** Error instances incluem stack trace

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Throw Statement:** Lança erro, interrompe execução
2. **Immediate Transfer:** Controle transfere para catch mais próximo
3. **Stack Unwinding:** Erro propaga pela call stack
4. **Any Value:** Throw pode lançar qualquer valor (mas convenção: Error)
5. **Uncaught Errors:** Erro não capturado termina programa

### Pilares Fundamentais

- **Error Launching:** Throw lança erro, não retorna
- **Control Flow Inversion:** Inverte fluxo - sobe call stack
- **Automatic Propagation:** Erro propaga até ser capturado
- **Exception Semantics:** Representa condição excepcional
- **Best Practice:** Sempre lançar Error instances

### Visão Geral das Nuances

- **Return vs Throw:** Throw não retorna - interrompe execução
- **Throw Expression:** Throw é expression, pode ser usado em conditionals
- **Re-throwing:** Catch pode re-lançar erro
- **Finally Execution:** Finally executa mesmo com throw
- **TypeScript Never:** Funções que só throw têm return type `never`

## 🧠 Fundamentos Teóricos

### Como Funciona Internalmente

#### Basic Throw Syntax

```typescript
throw new Error("Mensagem de erro");

// Código após throw NÃO executa
console.log("Esta linha não executa");
```

**Análise profunda:**

**Execution Flow:**
```
→ Executa até throw
→ Throw lança erro
→ Execução PARA imediatamente
→ Código após throw NÃO executa
→ Controle transfere para catch (se existir)
→ Ou programa termina (se não capturado)
```

**Conceito fundamental:** Throw **interrompe** execução - não retorna, não continua.

#### Throw with Try/Catch

```typescript
function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divisão por zero");
  }
  return a / b;
}

try {
  const resultado = dividir(10, 0);
  console.log("Esta linha não executa");
} catch (e) {
  console.log("Erro capturado:", e);
}

// Output: "Erro capturado: Error: Divisão por zero"
```

**Fundamento teórico:** Throw transfere controle para **catch block** - código após throw não executa.

### Princípios e Conceitos Subjacentes

#### Throw Interrupts Execution

```typescript
function exemplo() {
  console.log("1");
  console.log("2");
  throw new Error("Erro");
  console.log("3");  // ❌ Nunca executa
  console.log("4");  // ❌ Nunca executa
}

try {
  exemplo();
} catch (e) {
  console.log("Erro capturado");
}

// Output:
// "1"
// "2"
// "Erro capturado"
```

**Conceito crucial:** Throw **para** execução imediatamente - código após throw é **unreachable**.

#### Throw Without Try/Catch

```typescript
function exemplo() {
  throw new Error("Erro não capturado");
}

exemplo();
// Programa termina com uncaught error
// Node.js: processo termina com exit code 1
// Browser: erro no console, script para
```

**Fundamento teórico:** Erro não capturado **termina programa** - comportamento padrão de exceptions.

#### Throw in Nested Functions

```typescript
function nivel3() {
  throw new Error("Erro no nível 3");
}

function nivel2() {
  nivel3();
  console.log("Nunca executa");
}

function nivel1() {
  nivel2();
  console.log("Nunca executa");
}

try {
  nivel1();
} catch (e) {
  console.log("Erro capturado:", e.message);
}

// Erro propaga: nivel3 → nivel2 → nivel1 → catch
```

**Análise profunda:** Throw **propaga** pela call stack - pula todas funções intermediárias até catch.

### Modelo Mental para Compreensão

Pense em throw como **alarme de emergência**:

**Return:** Saída normal - porta da frente
**Throw:** Saída de emergência - alarme dispara, todos param

**Analogia:**
- **Execução normal:** Caminho planejado
- **Throw:** Emergência - abandona caminho, vai direto para saída

**Fluxo:**
```
Função A chama B
  ↓
B chama C
  ↓
C: throw Error
  ↓
❌ C interrompida
  ↓
❌ B interrompida
  ↓
❌ A interrompida
  ↓
✅ Catch captura (ou programa termina)
```

## 🔍 Análise Conceitual Profunda

### Throw Expression

```typescript
// Throw é expression - pode ser usado em conditionals
const valor = condicao ? calcular() : throw new Error("Condição falsa");

// Nullish coalescing com throw
const usuario = buscarUsuario() ?? throw new Error("Usuário não encontrado");

// Optional chaining com throw
const nome = usuario?.nome ?? throw new Error("Nome não encontrado");
```

**Conceito avançado:** Throw é **expression** (não apenas statement) - pode ser usado em lugares que esperam valor.

#### Throw in Conditionals

```typescript
function validar(valor: number) {
  if (valor < 0) {
    throw new Error("Valor negativo");
  }
  
  if (valor > 100) {
    throw new Error("Valor muito alto");
  }
  
  // Se chegou aqui, valor é válido
  return valor;
}
```

**Fundamento teórico:** Throw permite **validações guard clauses** - falha rápido se condições não atendidas.

### Throw vs Return

```typescript
// Return - execução normal
function somar(a: number, b: number): number {
  return a + b;
  console.log("Nunca executa");  // Dead code
}

// Throw - execução excepcional
function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divisão por zero");
    console.log("Nunca executa");  // Dead code
  }
  return a / b;
}
```

**Análise profunda:**
- **Return:** Retorna valor, função termina normalmente
- **Throw:** Lança erro, função termina abruptamente, erro propaga

#### Throw with Finally

```typescript
function exemplo() {
  try {
    console.log("Try");
    throw new Error("Erro");
    console.log("Nunca executa");
  } finally {
    console.log("Finally");
  }
}

try {
  exemplo();
} catch (e) {
  console.log("Catch:", e.message);
}

// Output:
// "Try"
// "Finally"
// "Catch: Erro"
```

**Conceito crucial:** Finally **sempre executa** mesmo com throw - garante cleanup.

### Throw in Arrow Functions

```typescript
// Arrow function com throw
const validar = (valor: number) => {
  if (valor < 0) throw new Error("Negativo");
  return valor;
};

// Arrow function expression com throw
const obterValor = (condicao: boolean) =>
  condicao ? 42 : throw new Error("Condição falsa");
```

**Fundamento teórico:** Throw funciona **identicamente** em arrow functions.

#### Throw in Async Functions

```typescript
async function buscarDados() {
  const response = await fetch("/api/dados");
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}

// Catch captura throw em async function
buscarDados()
  .then(dados => console.log(dados))
  .catch(e => console.error("Erro:", e));

// Ou com async/await
async function exemplo() {
  try {
    const dados = await buscarDados();
    console.log(dados);
  } catch (e) {
    console.error("Erro:", e);
  }
}
```

**Análise profunda:** Throw em async function **rejeita Promise** - capturável com `.catch()` ou try/catch.

### Early Return vs Throw

```typescript
// Early return - indica ausência de valor
function buscarUsuario(id: number): Usuario | null {
  if (id < 0) {
    return null;  // Valor especial indica erro
  }
  return buscarNoDatabase(id);
}

// Throw - indica erro
function buscarUsuarioStrict(id: number): Usuario {
  if (id < 0) {
    throw new Error("ID inválido");  // Erro explícito
  }
  return buscarNoDatabase(id);
}
```

**Fundamento teórico:**
- **Return null:** Erro "esperado" - caller pode lidar facilmente
- **Throw:** Erro "excepcional" - não deve ser ignorado

#### Throw in Constructors

```typescript
class Usuario {
  constructor(public nome: string, public idade: number) {
    if (idade < 0) {
      throw new Error("Idade não pode ser negativa");
    }
    
    if (!nome) {
      throw new Error("Nome é obrigatório");
    }
  }
}

try {
  const usuario = new Usuario("", -5);
} catch (e) {
  console.error("Erro ao criar usuário:", e);
}
```

**Conceito avançado:** Throw em constructor **impede criação** de instância - objeto não é criado.

### Throw in Getters/Setters

```typescript
class Conta {
  private _saldo = 0;
  
  get saldo(): number {
    return this._saldo;
  }
  
  set saldo(valor: number) {
    if (valor < 0) {
      throw new Error("Saldo não pode ser negativo");
    }
    this._saldo = valor;
  }
}

const conta = new Conta();
try {
  conta.saldo = -100;
} catch (e) {
  console.error("Erro:", e);
}
```

**Fundamento teórico:** Throw em setter **valida** atribuições - previne estado inválido.

#### Throw in Array Methods

```typescript
const numeros = [1, 2, 3, 4, 5];

try {
  const resultado = numeros.map(n => {
    if (n === 3) {
      throw new Error("Valor proibido: 3");
    }
    return n * 2;
  });
} catch (e) {
  console.error("Erro no map:", e);
}

// Throw interrompe iteração - map não completa
```

**Análise profunda:** Throw em callback **interrompe iteração** - resto do array não é processado.

### Throw in Promises

```typescript
// Throw em Promise executor rejeita Promise
const promise = new Promise((resolve, reject) => {
  throw new Error("Erro no executor");
  // Equivalente a: reject(new Error("Erro no executor"));
});

promise.catch(e => console.error("Erro:", e));

// Throw em .then() rejeita Promise
fetch("/api/dados")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .catch(e => console.error("Erro:", e));
```

**Conceito crucial:** Throw em Promise context **rejeita Promise** automaticamente.

#### Conditional Throw

```typescript
function validar(valor: number): void {
  // Guard clause - throw se inválido
  if (valor < 0) throw new Error("Negativo");
  if (valor > 100) throw new Error("Muito alto");
  if (!Number.isInteger(valor)) throw new Error("Deve ser inteiro");
  
  // Se chegou aqui, valor é válido
}

// Uso
try {
  validar(150);
} catch (e) {
  console.error("Validação falhou:", e);
}
```

**Fundamento teórico:** **Guard clauses** com throw simplificam validações - falha rápido.

### Throw in Loops

```typescript
const numeros = [1, 2, 3, 4, 5];

try {
  for (const n of numeros) {
    if (n === 3) {
      throw new Error("Encontrou 3");
    }
    console.log(n);
  }
} catch (e) {
  console.error("Erro:", e);
}

// Output:
// 1
// 2
// "Erro: Error: Encontrou 3"
// Loop interrompido no 3
```

**Análise profunda:** Throw **interrompe loop** - não continua iterações.

#### Throw in Switch

```typescript
function processar(tipo: string) {
  switch (tipo) {
    case "A":
      return processoA();
    case "B":
      return processoB();
    default:
      throw new Error(`Tipo desconhecido: ${tipo}`);
  }
}

try {
  processar("C");
} catch (e) {
  console.error("Erro:", e);
}
```

**Fundamento teórico:** Throw em default case **garante** que tipos inesperados não passem silenciosamente.

### Throw and TypeScript Never Type

```typescript
// Função que sempre lança erro tem return type 'never'
function falhar(mensagem: string): never {
  throw new Error(mensagem);
}

// TypeScript entende que código após falhar() é unreachable
function exemplo(valor: number) {
  if (valor < 0) {
    falhar("Valor negativo");
    // TypeScript sabe que esta linha é unreachable
  }
  
  // TypeScript sabe que aqui valor >= 0
  return valor;
}
```

**Conceito avançado:** TypeScript usa `never` type para funções que **nunca retornam** (sempre throw ou loop infinito).

#### Throw in Class Methods

```typescript
class Calculadora {
  dividir(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Divisão por zero");
    }
    return a / b;
  }
  
  raizQuadrada(n: number): number {
    if (n < 0) {
      throw new Error("Raiz de número negativo");
    }
    return Math.sqrt(n);
  }
}

const calc = new Calculadora();

try {
  calc.dividir(10, 0);
} catch (e) {
  console.error("Erro:", e);
}
```

**Fundamento teórico:** Throw em methods permite **validações** antes de executar operação.

## 🎯 Aplicabilidade e Contextos

### Input Validation

```typescript
function processarIdade(idade: number): void {
  if (idade < 0) {
    throw new Error("Idade não pode ser negativa");
  }
  
  if (idade > 150) {
    throw new Error("Idade inválida (muito alta)");
  }
  
  // Processa idade válida
  console.log(`Idade: ${idade}`);
}
```

**Raciocínio:** Throw valida input - garante precondições antes de processar.

### API Error Handling

```typescript
async function buscarUsuario(id: number) {
  const response = await fetch(`/api/usuarios/${id}`);
  
  if (!response.ok) {
    throw new Error(`Falha ao buscar usuário: HTTP ${response.status}`);
  }
  
  return response.json();
}
```

**Raciocínio:** Throw sinaliza erro de API - caller precisa tratar.

### Invariant Checking

```typescript
function processarArray(arr: number[]): number {
  if (arr.length === 0) {
    throw new Error("Array não pode estar vazio");
  }
  
  return arr.reduce((a, b) => a + b);
}
```

**Raciocínio:** Throw garante invariants - condições que devem ser sempre verdadeiras.

## ⚠️ Limitações e Considerações Teóricas

### Throw Any Value (Not Just Error)

```typescript
throw "string error";  // Válido, mas má prática
throw 42;              // Válido, mas má prática
throw { code: 500 };   // Válido, mas má prática

// Melhor: sempre throw Error instances
throw new Error("Mensagem");
```

**Limitação:** JavaScript permite throw de qualquer valor - convenção: sempre Error.

### Uncaught Errors Terminate Program

```typescript
function exemplo() {
  throw new Error("Não capturado");
}

exemplo();  // Programa termina
console.log("Nunca executa");
```

**Consideração:** Erro não capturado **termina programa** - sempre ter try/catch em top level.

### Performance Overhead

```typescript
// Throw tem overhead - evitar em hot paths
for (let i = 0; i < 1000000; i++) {
  try {
    throw new Error("Erro");
  } catch (e) {
    // Muito overhead - evitar
  }
}
```

**Limitação:** Throw/catch tem overhead - evitar em performance-critical code.

## 🔗 Interconexões Conceituais

**Relação com Try/Catch:** Throw lança erros capturados por try/catch.

**Relação com Error Object:** Throw geralmente lança Error instances.

**Relação com Stack Unwinding:** Throw causa stack unwinding.

**Relação com Never Type:** Funções que só throw têm type `never`.

## 🚀 Evolução e Próximos Conceitos

Dominar throw prepara para:
- **Custom Error Classes:** Criar erros customizados
- **Error Propagation:** Como erros propagam
- **Error Handling Patterns:** Best practices
- **Async Error Handling:** Throw com Promises/async
