# Stack Overflow em Recursão: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Stack overflow** (estouro de pilha) é o erro que ocorre quando a **call stack** (pilha de chamadas) atinge seu limite máximo de profundidade devido a recursão excessiva. Conceitualmente, representa **esgotamento de memória da pilha**, onde muitas chamadas recursivas pendentes excedem capacidade da stack.

## 📋 Fundamentos

### Call Stack e Recursão

Cada chamada de função é empilhada:

```typescript
function fatorial(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

fatorial(5);
// Stack cresce: fatorial(5) → fatorial(4) → fatorial(3) → fatorial(2) → fatorial(1)
// Depois decresce retornando valores
```

### Quando Ocorre Stack Overflow

```typescript
// ❌ Recursão sem caso base - infinita
function infinita(n: number): number {
  return infinita(n); // NUNCA para
}

// infinita(1); // RangeError: Maximum call stack size exceeded

// ❌ Caso base inalcançável
function errado(n: number): number {
  if (n === 0) return 0;
  return errado(n + 1); // Aumenta, nunca atinge 0
}

// ❌ Recursão muito profunda
function profunda(n: number): number {
  if (n === 0) return 0;
  return profunda(n - 1);
}

// profunda(100000); // Stack overflow - muitas chamadas
```

## 🔍 Análise Conceitual

### 1. Limite da Call Stack

Navegadores e Node.js têm limites diferentes:

```typescript
function testarLimite(n: number = 0): number {
  try {
    return testarLimite(n + 1);
  } catch (e) {
    return n; // Retorna profundidade máxima
  }
}

console.log(testarLimite());
// Chrome: ~10,000-15,000
// Firefox: ~50,000
// Node.js: ~10,000-15,000
```

### 2. Fibonacci - Problema Clássico

```typescript
// Recursão ineficiente - árvore exponencial de chamadas
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// fibonacci(40) faz ~300 milhões de chamadas recursivas!
// fibonacci(100) causaria stack overflow
```

### 3. Soluções para Stack Overflow

**a) Iteração ao invés de Recursão:**

```typescript
// Recursivo - pode estourar stack
function fatorialRecursivo(n: number): number {
  if (n <= 1) return 1;
  return n * fatorialRecursivo(n - 1);
}

// Iterativo - sem risco de stack overflow
function fatorialIterativo(n: number): number {
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}
```

**b) Tail Recursion (com otimização do compilador):**

```typescript
// Tail recursive - última operação é chamada recursiva
function fatorialTail(n: number, acumulador: number = 1): number {
  if (n <= 1) return acumulador;
  return fatorialTail(n - 1, n * acumulador);
}
```

**c) Memoization:**

```typescript
const memo = new Map<number, number>();

function fibonacciMemo(n: number): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const resultado = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
  memo.set(n, resultado);
  return resultado;
}

// Agora fibonacci(100) funciona sem stack overflow
```

**d) Trampolining:**

```typescript
type Thunk<T> = () => T | Thunk<T>;

function trampoline<T>(fn: Thunk<T>): T {
  let resultado: T | Thunk<T> = fn();

  while (typeof resultado === "function") {
    resultado = resultado();
  }

  return resultado;
}

// Função recursiva vira sequência de thunks
function fatorialTrampoline(n: number, acc: number = 1): Thunk<number> {
  if (n <= 1) return () => acc;
  return () => fatorialTrampoline(n - 1, n * acc);
}

trampoline(() => fatorialTrampoline(100000)); // Funciona!
```

## ⚠️ Detectar e Prevenir

```typescript
// Contador de profundidade
function recursaoSegura(n: number, profundidade: number = 0): number {
  const MAX_PROFUNDIDADE = 10000;

  if (profundidade > MAX_PROFUNDIDADE) {
    throw new Error("Recursão muito profunda");
  }

  if (n <= 1) return 1;
  return n * recursaoSegura(n - 1, profundidade + 1);
}
```

## 📚 Conclusão

Stack overflow ocorre quando recursão excede limite da call stack. Pode ser evitado com:
- Iteração quando apropriado
- Tail recursion otimizada
- Memoization para evitar recálculos
- Trampolining para recursões profundas

Compreender stack overflow é essencial para usar recursão com segurança, sabendo limites e quando preferir abordagens iterativas.
