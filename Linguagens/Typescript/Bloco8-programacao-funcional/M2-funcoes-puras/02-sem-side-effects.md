# Sem Side Effects (Efeitos Colaterais): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Ausência de side effects** (efeitos colaterais) significa que função **não modifica estado externo** nem interage com mundo exterior além de retornar valor. Conceitualmente, representa **isolamento funcional**, onde função opera em **bolha** - recebe inputs, processa, retorna output, sem alterar nada fora de seu escopo.

Na essência, funções sem side effects materializam o princípio de **não-interferência**, onde execução da função não tem consequências observáveis além do valor retornado, tornando comportamento completamente contido e auto-suficiente.

## 📋 Fundamentos

### O Que São Side Effects?

```typescript
// ✅ SEM side effects - apenas retorna valor
function somar(a: number, b: number): number {
  return a + b;
}

// ❌ COM side effects - modifica variável externa
let total = 0;

function somarComSideEffect(a: number, b: number): number {
  total = a + b; // Side effect: modifica estado externo
  return total;
}

// ❌ COM side effects - mutação de argumento
function adicionarItem(arr: number[], item: number): number[] {
  arr.push(item); // Side effect: modifica array recebido
  return arr;
}

// ✅ SEM side effects - retorna novo array
function adicionarItemPuro(arr: number[], item: number): number[] {
  return [...arr, item]; // Não modifica original
}

// ❌ COM side effects - I/O
function salvarDados(dados: string): void {
  console.log(dados);                    // Side effect: console
  localStorage.setItem("dados", dados);  // Side effect: storage
  fetch("/api", { body: dados });        // Side effect: rede
}
```

**Conceito-chave:** Side effect é **qualquer interação** com mundo externo ou modificação de estado fora do escopo da função.

### Tipos de Side Effects

```typescript
// 1. Modificar variável global
let contador = 0;
function incrementar(): void {
  contador++; // ❌ Side effect
}

// 2. Modificar argumento mutável
function limparArray(arr: any[]): void {
  arr.length = 0; // ❌ Side effect
}

// 3. I/O (console, arquivos, rede)
function log(msg: string): void {
  console.log(msg); // ❌ Side effect
}

// 4. Modificar DOM
function atualizarUI(): void {
  document.body.innerHTML = "Novo"; // ❌ Side effect
}

// 5. Exceções não tratadas
function dividir(a: number, b: number): number {
  if (b === 0) throw new Error("Divisão por zero"); // ❌ Side effect
  return a / b;
}

// 6. Alterar estado de objeto
class Contador {
  valor = 0;

  incrementar(): void {
    this.valor++; // ❌ Side effect
  }
}
```

## 🔍 Análise Conceitual

### 1. Mutação vs. Imutabilidade

```typescript
// ❌ COM side effect - mutação
function ordenarArray(arr: number[]): number[] {
  arr.sort((a, b) => a - b); // Modifica array original
  return arr;
}

const nums = [3, 1, 2];
ordenarArray(nums);
console.log(nums); // [1, 2, 3] - modificado!

// ✅ SEM side effect - imutável
function ordenarArrayPuro(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b); // Cria cópia
}

const nums2 = [3, 1, 2];
const ordenados = ordenarArrayPuro(nums2);
console.log(nums2);     // [3, 1, 2] - original intacto
console.log(ordenados); // [1, 2, 3] - novo array
```

**Conceito:** Funções puras **nunca** modificam dados recebidos - sempre criam novos valores.

### 2. Objetos Imutáveis

```typescript
interface Usuario {
  nome: string;
  idade: number;
}

// ❌ COM side effect
function atualizarIdade(usuario: Usuario, novaIdade: number): Usuario {
  usuario.idade = novaIdade; // Modifica objeto original
  return usuario;
}

// ✅ SEM side effect
function atualizarIdadePura(usuario: Usuario, novaIdade: number): Usuario {
  return {
    ...usuario,
    idade: novaIdade // Retorna novo objeto
  };
}

const user = { nome: "Ana", idade: 25 };
const userAtualizado = atualizarIdadePura(user, 26);

console.log(user);           // { nome: "Ana", idade: 25 } - original
console.log(userAtualizado); // { nome: "Ana", idade: 26 } - novo
```

### 3. Arrays - Métodos Puros vs. Impuros

```typescript
const numeros = [1, 2, 3, 4, 5];

// ✅ Métodos PUROS - retornam novo array
numeros.map(n => n * 2);      // [2, 4, 6, 8, 10] - original intacto
numeros.filter(n => n > 2);   // [3, 4, 5] - original intacto
numeros.slice(1, 3);          // [2, 3] - original intacto
numeros.concat([6, 7]);       // [1, 2, 3, 4, 5, 6, 7] - original intacto

// ❌ Métodos IMPUROS - modificam array original
numeros.push(6);       // Adiciona 6 - modifica original
numeros.pop();         // Remove último - modifica original
numeros.shift();       // Remove primeiro - modifica original
numeros.unshift(0);    // Adiciona no início - modifica original
numeros.sort();        // Ordena - modifica original
numeros.reverse();     // Inverte - modifica original
numeros.splice(1, 2);  // Remove elementos - modifica original

// ✅ Versões puras dos impuros
function pushPuro<T>(arr: T[], item: T): T[] {
  return [...arr, item];
}

function popPuro<T>(arr: T[]): T[] {
  return arr.slice(0, -1);
}

function sortPuro<T>(arr: T[]): T[] {
  return [...arr].sort();
}
```

### 4. Evitando Side Effects em Lógica de Negócio

```typescript
// ❌ COM side effects
let saldo = 1000;

function sacar(valor: number): boolean {
  if (valor > saldo) {
    console.log("Saldo insuficiente"); // Side effect: console
    return false;
  }
  saldo -= valor; // Side effect: modifica estado global
  console.log(`Sacado: ${valor}`); // Side effect: console
  return true;
}

// ✅ SEM side effects
interface Conta {
  saldo: number;
}

interface ResultadoSaque {
  sucesso: boolean;
  novaConta: Conta;
  mensagem: string;
}

function sacarPuro(conta: Conta, valor: number): ResultadoSaque {
  if (valor > conta.saldo) {
    return {
      sucesso: false,
      novaConta: conta, // Retorna conta inalterada
      mensagem: "Saldo insuficiente"
    };
  }

  return {
    sucesso: true,
    novaConta: { saldo: conta.saldo - valor }, // Nova conta
    mensagem: `Sacado: ${valor}`
  };
}
```

### 5. Composição de Funções Puras

```typescript
// Funções puras compõem-se perfeitamente
function dobrar(n: number): number {
  return n * 2;
}

function incrementar(n: number): number {
  return n + 1;
}

function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2)}`;
}

// Composição pura
function processar(valor: number): string {
  return formatarMoeda(incrementar(dobrar(valor)));
}

processar(10); // "R$ 21.00" - sem side effects em nenhuma etapa
```

## 🎯 Side Effects Necessários (Isolamento)

### 1. Separação de Lógica e I/O

```typescript
// Núcleo puro - lógica de negócio
function calcularDesconto(valor: number, percentual: number): number {
  return valor * (1 - percentual / 100);
}

// Camada de I/O - side effects isolados
function aplicarDesconto(valor: number, percentual: number): void {
  const resultado = calcularDesconto(valor, percentual); // Pura
  console.log(`Valor final: R$ ${resultado.toFixed(2)}`); // Side effect isolado
}
```

### 2. Arquitetura em Camadas

```typescript
// Camada pura - transformação de dados
function processarPedido(pedido: Pedido): PedidoProcessado {
  return {
    id: pedido.id,
    total: pedido.items.reduce((sum, item) => sum + item.preco, 0),
    status: "processado"
  };
}

// Camada de efeitos - I/O
async function salvarPedido(pedido: Pedido): Promise<void> {
  const processado = processarPedido(pedido); // Pura

  // Side effects isolados aqui
  await db.save(processado);
  await enviarEmail(pedido.cliente.email);
  console.log("Pedido salvo");
}
```

### 3. Functional Core, Imperative Shell

```typescript
// Core funcional - 100% puro
function validarUsuario(dados: DadosUsuario): Result<Usuario> {
  if (!dados.email.includes("@")) {
    return { sucesso: false, erro: "Email inválido" };
  }
  return { sucesso: true, dados: { nome: dados.nome, email: dados.email } };
}

// Shell imperativo - side effects
async function cadastrarUsuario(dados: DadosUsuario): Promise<void> {
  const resultado = validarUsuario(dados); // Pura

  if (!resultado.sucesso) {
    // Side effects
    console.error(resultado.erro);
    throw new Error(resultado.erro);
  }

  // Side effects
  await db.insert(resultado.dados);
  await enviarEmailBoasVindas(resultado.dados.email);
}
```

## ⚠️ Identificando Side Effects Ocultos

### 1. Date/Time

```typescript
// ❌ Side effect oculto - depende de relógio
function obterIdadeAtual(anoNascimento: number): number {
  return new Date().getFullYear() - anoNascimento;
}

// ✅ Pura - recebe ano atual como argumento
function calcularIdade(anoNascimento: number, anoAtual: number): number {
  return anoAtual - anoNascimento;
}
```

### 2. Random

```typescript
// ❌ Side effect - aleatoriedade
function gerarSenha(): string {
  return Math.random().toString(36).substring(7);
}

// ✅ Pura - recebe seed
function gerarSenhaDeterministica(seed: number): string {
  return ((seed * 9301 + 49297) % 233280).toString(36);
}
```

### 3. Exceções

```typescript
// ❌ Side effect - exceção
function dividir(a: number, b: number): number {
  if (b === 0) throw new Error("Divisão por zero");
  return a / b;
}

// ✅ Pura - retorna Result
function dividirSeguro(a: number, b: number): Result<number> {
  if (b === 0) {
    return { sucesso: false, erro: "Divisão por zero" };
  }
  return { sucesso: true, dados: a / b };
}
```

## 📚 Vantagens de Funções Sem Side Effects

### 1. Testabilidade

```typescript
// Fácil testar - sem mocks necessários
function somar(a: number, b: number): number {
  return a + b;
}

// Teste simples
expect(somar(2, 3)).toBe(5);

// vs.

// Difícil testar - precisa mockar console, db, etc
function processarComSideEffects(dados: any): void {
  console.log(dados);
  db.save(dados);
  sendEmail(dados.email);
}
```

### 2. Paralelização Segura

```typescript
// Pode executar em paralelo sem problemas
const resultados = await Promise.all(
  dados.map(d => processarPuro(d))
);
```

### 3. Raciocínio Local

```typescript
// Para entender função pura, basta olhar ela mesma
function calcular(x: number): number {
  return x * 2 + 10;
}

// Para entender função com side effects, precisa rastrear estado global
let global = 0;
function calcularComSideEffect(x: number): number {
  global += x;
  return global * 2;
}
```

## 📚 Conclusão

Ausência de side effects significa função não modifica estado externo nem interage com mundo exterior. Torna função isolada, testável, paralelizável e fácil de raciocinar. Side effects necessários devem ser isolados em camadas específicas (Functional Core, Imperative Shell), mantendo núcleo da lógica puro.
