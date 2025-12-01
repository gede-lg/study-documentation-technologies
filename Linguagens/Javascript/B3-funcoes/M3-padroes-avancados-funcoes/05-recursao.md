# Recursão em JavaScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Recursão** é uma técnica de programação onde uma função **chama a si mesma** para resolver um problema dividindo-o em **subproblemas menores** da mesma natureza. É um conceito fundamental que modela problemas recursivos naturais (árvores, estruturas aninhadas, fractais) de forma direta e elegante.

Conceitualmente, recursão se baseia em dois pilares:

1. **Caso Base:** Condição que termina a recursão (solução trivial)
2. **Caso Recursivo:** Função se chama com problema reduzido

Uma função recursiva deve **sempre** progredir em direção ao caso base para evitar recursão infinita.

### Exemplo Fundamental

```javascript
// Fatorial: n! = n × (n-1)!
function fatorial(n) {
  // Caso base: 0! = 1
  if (n === 0) return 1;

  // Caso recursivo: n! = n × (n-1)!
  return n * fatorial(n - 1);
}

console.log(fatorial(5)); // 120
```

**Por que recursão funciona?**

- `fatorial(5)` chama `fatorial(4)`
- `fatorial(4)` chama `fatorial(3)`
- ...até `fatorial(0)` retornar 1 (caso base)
- Resultados "sobem" calculando: 1 × 1 × 2 × 3 × 4 × 5 = 120

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Auto-Referência:** Função se chama
2. **Divisão de Problema:** Quebra em subproblemas menores
3. **Caso Base:** Condição de parada obrigatória
4. **Caso Recursivo:** Progresso em direção ao base
5. **Stack de Chamadas:** Cada chamada empilhada na call stack

### Pilares Fundamentais

- **Caso Base:** SEM ele, recursão infinita
- **Progresso:** Cada chamada deve aproximar do base
- **Confiança:** "Assumir" que chamada recursiva funciona
- **Call Stack:** Limite de profundidade (stack overflow)
- **Overhead:** Recursão tem custo de chamadas empilhadas

---

## 🧠 Fundamentos Teóricos

### Anatomia de Função Recursiva

```javascript
function recursiva(problema) {
  // 1. CASO BASE - condição de parada
  if (condicaoBase(problema)) {
    return solucaoTrivial;
  }

  // 2. CASO RECURSIVO
  const subProblema = reduzir(problema);
  const resultadoSubProblema = recursiva(subProblema);

  // 3. COMBINAR resultado
  return combinar(resultadoSubProblema);
}
```

### Como Call Stack Funciona

```javascript
function fatorial(n) {
  if (n === 0) return 1;
  return n * fatorial(n - 1);
}

fatorial(3);
```

**Call Stack (visualização):**

```
fatorial(3)
  └─> 3 * fatorial(2)
          └─> 2 * fatorial(1)
                  └─> 1 * fatorial(0)
                          └─> 1 (caso base)

Stack unwinds (desempilha):
fatorial(0) retorna 1
fatorial(1) retorna 1 * 1 = 1
fatorial(2) retorna 2 * 1 = 2
fatorial(3) retorna 3 * 2 = 6
```

Cada chamada adiciona frame à stack. Caso base inicia "desempilhamento".

### Recursão vs Iteração

**Mesma função - duas formas:**

```javascript
// Recursivo
function somaRecursiva(n) {
  if (n === 0) return 0;
  return n + somaRecursiva(n - 1);
}

// Iterativo
function somaIterativa(n) {
  let soma = 0;
  for (let i = 1; i <= n; i++) {
    soma += i;
  }
  return soma;
}
```

**Trade-offs:**

| Aspecto | Recursão | Iteração |
|---------|----------|----------|
| **Clareza** | Elegante para problemas recursivos | Mais verbosa |
| **Performance** | Overhead de chamadas | Mais rápida |
| **Memória** | Usa stack (limite) | Usa variáveis (constante) |
| **Stack Overflow** | Sim (profundidade) | Não |

**Quando preferir recursão:** Estruturas recursivas (árvores), problemas dividir-e-conquistar, quando clareza > performance.

---

## 🔍 Exemplos Clássicos

### 1. Fatorial

```javascript
function fatorial(n) {
  if (n === 0) return 1;
  return n * fatorial(n - 1);
}
```

### 2. Fibonacci

```javascript
// Versão simples (ineficiente)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Com memoization (eficiente)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}
```

### 3. Soma de Array

```javascript
function somaArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + somaArray(arr.slice(1));
}
```

### 4. Busca Binária (Divide-and-Conquer)

```javascript
function buscaBinaria(arr, alvo, inicio = 0, fim = arr.length - 1) {
  // Caso base: não encontrado
  if (inicio > fim) return -1;

  const meio = Math.floor((inicio + fim) / 2);

  // Caso base: encontrado
  if (arr[meio] === alvo) return meio;

  // Caso recursivo: metade esquerda ou direita
  if (arr[meio] > alvo) {
    return buscaBinaria(arr, alvo, inicio, meio - 1);
  } else {
    return buscaBinaria(arr, alvo, meio + 1, fim);
  }
}
```

### 5. Percorrer Árvore (DFS)

```javascript
function percorrerArvore(node) {
  if (!node) return; // Caso base: nó nulo

  console.log(node.valor); // Processa nó atual

  // Recursão nos filhos
  percorrerArvore(node.esquerda);
  percorrerArvore(node.direita);
}
```

### 6. Flatten Array Aninhado

```javascript
function flatten(arr) {
  let resultado = [];

  for (let item of arr) {
    if (Array.isArray(item)) {
      resultado = resultado.concat(flatten(item)); // Recursão
    } else {
      resultado.push(item);
    }
  }

  return resultado;
}

flatten([1, [2, [3, 4], 5], 6]); // [1, 2, 3, 4, 5, 6]
```

---

## ⚠️ Stack Overflow

### O Problema

JavaScript tem limite de profundidade da call stack (~10.000-100.000 calls dependendo do ambiente):

```javascript
function recursaoInfinita(n) {
  return recursaoInfinita(n + 1); // SEM caso base!
}

// recursaoInfinita(0); // RangeError: Maximum call stack size exceeded
```

### Exemplo Real de Overflow

```javascript
// Fatorial de número grande
function fatorial(n) {
  if (n === 0) return 1;
  return n * fatorial(n - 1);
}

// fatorial(100000); // Stack overflow!
```

### Solução: Iteração ou Tail Call Optimization

```javascript
// Versão iterativa (sem limite de stack)
function fatorialIterativo(n) {
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

fatorialIterativo(100000); // Funciona (mas resultado é Infinity)
```

### Tail Call Optimization (TCO)

**Tail call:** Chamada recursiva é a **última operação** da função.

```javascript
// NÃO é tail call
function fatorial(n) {
  if (n === 0) return 1;
  return n * fatorial(n - 1); // Multiplicação após recursão
}

// É tail call
function fatorialTail(n, acumulador = 1) {
  if (n === 0) return acumulador;
  return fatorialTail(n - 1, n * acumulador); // Recursão é última operação
}
```

**Nota:** TCO está especificado em ES6 mas poucos engines implementam (apenas Safari/JavaScriptCore).

---

## 🎯 Quando Usar Recursão

**✅ Use recursão quando:**

- Estrutura de dados é recursiva (árvores, graphs)
- Algoritmos divide-and-conquer (quicksort, mergesort)
- Problemas naturalmente recursivos (fractais, permutações)
- Clareza é mais importante que performance máxima

**❌ Evite recursão quando:**

- Performance crítica (iteração é mais rápida)
- Profundidade grande (risco de stack overflow)
- Solução iterativa é igualmente clara
- Ambiente não suporta TCO e precisa escalar

---

## 🔗 Conceitos Relacionados

- **Memoization:** Cache resultados para evitar recálculo
- **Dynamic Programming:** Resolver subproblemas uma vez
- **Tail Call Optimization:** Otimizar recursão para não crescer stack
- **Divide-and-Conquer:** Estratégia recursiva fundamental

---

## 🚀 Conclusão

Recursão é ferramenta poderosa para problemas recursivos naturais. Essencial entender caso base, progressão, e limitações (stack overflow). Com prática, reconhecer quando recursão simplifica solução vs quando iteração é melhor.
