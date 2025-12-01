# Mesma Entrada = Mesma Saída (Determinismo): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Determinismo funcional** (mesma entrada = mesma saída) é propriedade onde função **sempre retorna mesmo resultado** para mesmos argumentos, independente de quando ou quantas vezes é chamada. Conceitualmente, representa **comportamento matemático**, onde função é mapeamento consistente de domínio para contradomínio, sem dependência de estado externo ou tempo.

Na essência, determinismo materializa o princípio de **transparência referencial**, onde expressão pode ser substituída por seu valor sem alterar comportamento do programa, tornando função equivalente a cálculo matemático puro.

## 📋 Fundamentos

### Função Determinística vs. Não-Determinística

```typescript
// ✅ Determinística - mesma entrada, mesma saída
function somar(a: number, b: number): number {
  return a + b;
}

console.log(somar(2, 3)); // 5
console.log(somar(2, 3)); // 5 - sempre
console.log(somar(2, 3)); // 5 - sempre

// ❌ Não-determinística - depende de estado externo (tempo)
function agora(): Date {
  return new Date();
}

console.log(agora()); // 2024-01-15 10:00:00
console.log(agora()); // 2024-01-15 10:00:01 - diferente!
console.log(agora()); // 2024-01-15 10:00:02 - diferente!

// ❌ Não-determinística - depende de variável externa
let contador = 0;

function incrementar(): number {
  return ++contador;
}

console.log(incrementar()); // 1
console.log(incrementar()); // 2 - diferente!
console.log(incrementar()); // 3 - diferente!

// ❌ Não-determinística - aleatoriedade
function numeroAleatorio(): number {
  return Math.random();
}

console.log(numeroAleatorio()); // 0.542...
console.log(numeroAleatorio()); // 0.891... - diferente!
```

**Conceito-chave:** Função determinística é **previsível** e **consistente** - comportamento depende **apenas** dos argumentos.

### Transparência Referencial

```typescript
// Função determinística
function dobrar(n: number): number {
  return n * 2;
}

// Transparência referencial - pode substituir chamada pelo resultado
const x = dobrar(5) + dobrar(5);
// É equivalente a:
const y = 10 + 10;
// Ambos sempre resultam em 20

// Função não-determinística - NÃO tem transparência referencial
function aleatorio(): number {
  return Math.random();
}

const a = aleatorio() + aleatorio();
// NÃO é equivalente a:
const valorAleatorio = 0.5; // exemplo
const b = valorAleatorio + valorAleatorio;
// Resultados diferentes!
```

## 🔍 Análise Conceitual

### 1. Dependência Apenas de Argumentos

```typescript
// ✅ Determinística - usa apenas argumentos
function calcularArea(largura: number, altura: number): number {
  return largura * altura;
}

calcularArea(5, 10); // Sempre 50

// ❌ Não-determinística - acessa variável global
const PI = 3.14159;

function calcularAreaCirculo(raio: number): number {
  return PI * raio ** 2; // Depende de PI externo
}

// ✅ Determinística - PI como parâmetro
function calcularAreaCirculoPura(raio: number, pi: number): number {
  return pi * raio ** 2;
}

calcularAreaCirculoPura(5, 3.14159); // Sempre mesmo resultado
```

**Conceito:** Função pura recebe **todas** as dependências como argumentos explícitos.

### 2. Cálculos Matemáticos Puros

```typescript
// ✅ Funções matemáticas são naturalmente determinísticas
function fatorial(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

fatorial(5); // Sempre 120

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(7); // Sempre 13

function potencia(base: number, expoente: number): number {
  return base ** expoente;
}

potencia(2, 10); // Sempre 1024
```

### 3. Transformações de Dados

```typescript
// ✅ Determinística - transforma dados sem depender de estado
function maiuscula(texto: string): string {
  return texto.toUpperCase();
}

maiuscula("hello"); // Sempre "HELLO"

function inverter<T>(arr: T[]): T[] {
  return [...arr].reverse();
}

inverter([1, 2, 3]); // Sempre [3, 2, 1]

function filtrarPares(numeros: number[]): number[] {
  return numeros.filter(n => n % 2 === 0);
}

filtrarPares([1, 2, 3, 4, 5]); // Sempre [2, 4]
```

### 4. Composição de Funções Determinísticas

```typescript
// Funções determinísticas compõem-se em funções determinísticas
function dobrar(n: number): number {
  return n * 2;
}

function incrementar(n: number): number {
  return n + 1;
}

function processar(n: number): number {
  return incrementar(dobrar(n));
}

processar(5); // Sempre 11
// dobrar(5) = 10
// incrementar(10) = 11
```

**Propriedade:** Composição de funções determinísticas **preserva** determinismo.

### 5. Objetos Imutáveis

```typescript
interface Ponto {
  x: number;
  y: number;
}

// ✅ Determinística - retorna novo objeto
function moverPonto(ponto: Ponto, dx: number, dy: number): Ponto {
  return {
    x: ponto.x + dx,
    y: ponto.y + dy
  };
}

const p1 = { x: 0, y: 0 };
moverPonto(p1, 5, 10); // Sempre { x: 5, y: 10 }
moverPonto(p1, 5, 10); // Sempre { x: 5, y: 10 }

// ❌ Não-determinística - modifica objeto
function moverPontoMutavel(ponto: Ponto, dx: number, dy: number): void {
  ponto.x += dx;
  ponto.y += dy;
}

// Resultado depende de estado anterior do objeto
```

## 🎯 Aplicabilidade

### Cálculos Complexos

```typescript
interface Produto {
  preco: number;
  quantidade: number;
}

function calcularTotal(produtos: Produto[]): number {
  return produtos.reduce((total, p) => total + p.preco * p.quantidade, 0);
}

const carrinho = [
  { preco: 10, quantidade: 2 },
  { preco: 5, quantidade: 3 }
];

calcularTotal(carrinho); // Sempre 35
```

### Validação

```typescript
function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

validarEmail("user@example.com"); // Sempre true
validarEmail("invalid");          // Sempre false

function validarIdade(idade: number): boolean {
  return idade >= 18 && idade <= 120;
}

validarIdade(25); // Sempre true
validarIdade(15); // Sempre false
```

### Formatação

```typescript
function formatarMoeda(valor: number, moeda: string = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: moeda
  }).format(valor);
}

formatarMoeda(1234.56); // Sempre "R$ 1.234,56"

function formatarData(data: Date): string {
  return data.toISOString().split("T")[0];
}

const dataFixa = new Date("2024-01-15");
formatarData(dataFixa); // Sempre "2024-01-15"
```

### Parsing

```typescript
function parseJSON<T>(json: string): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

parseJSON('{"nome": "Ana"}'); // Sempre { nome: "Ana" }
parseJSON('invalid');          // Sempre null

function parseNumero(texto: string): number | null {
  const num = Number(texto);
  return isNaN(num) ? null : num;
}

parseNumero("42");  // Sempre 42
parseNumero("abc"); // Sempre null
```

## ⚠️ Fontes Comuns de Não-Determinismo

### 1. Tempo e Data

```typescript
// ❌ Não-determinística
function obterTimestamp(): number {
  return Date.now();
}

function obterHora(): string {
  return new Date().toLocaleTimeString();
}

// ✅ Determinística - recebe data como argumento
function formatarDataHora(data: Date): string {
  return data.toLocaleString();
}

const dataFixa = new Date("2024-01-15T10:30:00");
formatarDataHora(dataFixa); // Sempre "15/01/2024, 10:30:00"
```

### 2. Aleatoriedade

```typescript
// ❌ Não-determinística
function gerarId(): string {
  return Math.random().toString(36).substring(7);
}

// ✅ Determinística - recebe seed como argumento
function gerarIdDeterministico(seed: number): string {
  // Implementação de random com seed
  return ((seed * 9301 + 49297) % 233280).toString(36);
}

gerarIdDeterministico(42); // Sempre mesmo resultado
```

### 3. Estado Mutável

```typescript
// ❌ Não-determinística - depende de estado
class Contador {
  private valor = 0;

  incrementar(): number {
    return ++this.valor; // Resultado depende de chamadas anteriores
  }
}

// ✅ Determinística - sem estado
function incrementar(valor: number): number {
  return valor + 1;
}

incrementar(5); // Sempre 6
```

### 4. I/O e Rede

```typescript
// ❌ Não-determinística - lê arquivo
function lerArquivo(): string {
  return fs.readFileSync("config.txt", "utf-8");
}

// ❌ Não-determinística - rede
async function buscarAPI(): Promise<any> {
  return fetch("/api/data").then(r => r.json());
}

// ✅ Determinística - recebe dados como argumento
function processarDados(dados: string): any {
  return JSON.parse(dados);
}
```

## 📚 Vantagens do Determinismo

### 1. Memoization (Cache)

```typescript
// Só funciona com funções determinísticas
function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!; // Retorna cache - seguro apenas se determinística
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const fibonacciMemo = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
});

fibonacciMemo(40); // Primeira vez: calcula
fibonacciMemo(40); // Segunda vez: retorna cache instantaneamente
```

### 2. Paralelização

```typescript
// Funções determinísticas podem ser executadas em paralelo com segurança
const numeros = [1, 2, 3, 4, 5];

function calcularPesado(n: number): number {
  // Cálculo determinístico pesado
  return n ** 3;
}

// Pode paralelizar sem problemas
Promise.all(numeros.map(n =>
  Promise.resolve(calcularPesado(n))
)); // Resultados sempre consistentes
```

### 3. Otimização do Compilador

```typescript
// Compilador pode otimizar funções determinísticas
function calcular(x: number): number {
  return x * 2 + 10;
}

const a = calcular(5) + calcular(5);
// Compilador pode otimizar para:
const b = 20 + 20; // Calcula em tempo de compilação
```

## 📚 Conclusão

Determinismo (mesma entrada = mesma saída) é propriedade fundamental de funções puras, garantindo que resultado depende **apenas** dos argumentos. Torna função previsível, testável, paralelizável e permite otimizações como memoization. É base para transparência referencial e raciocínio equacional sobre código.
