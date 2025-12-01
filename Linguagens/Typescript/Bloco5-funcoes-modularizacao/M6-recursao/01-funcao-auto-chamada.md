# Recursão - Função que Chama a Si Mesma: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Recursão** é a técnica de programação onde uma função **chama a si mesma** diretamente ou indiretamente para resolver um problema quebrando-o em subproblemas menores da mesma natureza. Conceitualmente, representa **definição indutiva** de soluções, onde problema complexo é resolvido em termos de versões mais simples do mesmo problema.

Na essência, recursão materializa o princípio matemático de **prova por indução**, onde você resolve caso base e assume que solução funciona para casos menores, usando essa suposição para construir solução do caso maior. É tanto uma ferramenta poderosa de decomposição de problemas quanto um paradigma fundamental de programação funcional.

### Contexto Histórico e Motivação

**Raízes Matemáticas:**

Recursão vem da matemática, especialmente de:
- **Funções recursivas** (matemática pura, século XIX)
- **Lambda calculus** (Alonzo Church, 1930s)
- **Teoria da computação** (Alan Turing, 1936)

**Exemplo matemático clássico - Fatorial:**

```
n! = n × (n-1)!
5! = 5 × 4!
   = 5 × 4 × 3!
   = 5 × 4 × 3 × 2!
   = 5 × 4 × 3 × 2 × 1!
   = 5 × 4 × 3 × 2 × 1
   = 120
```

**Em Programação:**

```typescript
// Definição recursiva de fatorial
function fatorial(n: number): number {
  if (n === 0 || n === 1) {
    return 1; // Caso base
  }
  return n * fatorial(n - 1); // Chamada recursiva
}

fatorial(5); // 120
```

**Motivação:**

1. **Elegância:** Soluções recursivas são frequentemente mais simples e legíveis
2. **Estruturas Recursivas:** Naturais para árvores, listas ligadas, grafos
3. **Dividir e Conquistar:** Quebra problemas complexos em partes menores
4. **Expressividade Matemática:** Traduz definições matemáticas diretamente
5. **Programação Funcional:** Paradigma central em linguagens funcionais

### Problema Fundamental que Resolve

Recursão resolve problemas **naturalmente auto-similares** - problemas onde solução pode ser expressa em termos de subproblemas idênticos:

```typescript
// ❌ Iterativo - mais verboso para alguns problemas
function somarArrayIterativo(arr: number[]): number {
  let soma = 0;
  for (let i = 0; i < arr.length; i++) {
    soma += arr[i];
  }
  return soma;
}

// ✅ Recursivo - expressão natural da definição
function somarArray(arr: number[]): number {
  if (arr.length === 0) return 0; // Caso base
  return arr[0] + somarArray(arr.slice(1)); // Recursão
}
```

## 📋 Fundamentos

### Anatomia de Função Recursiva

```typescript
function recursiva(parametro: Tipo): TipoRetorno {
  // 1. CASO BASE - condição de parada
  if (condicaoBase) {
    return valorBase;
  }

  // 2. CHAMADA RECURSIVA - com parâmetro "menor"
  return algumCalculo(recursiva(parametroMenor));
}
```

**Componentes essenciais:**
1. **Caso base:** Condição de parada (previne recursão infinita)
2. **Chamada recursiva:** Função chama a si mesma
3. **Progressão:** Cada chamada deve aproximar do caso base

### Recursão Simples

```typescript
// Countdown recursivo
function countdown(n: number): void {
  if (n < 0) {
    return; // Caso base
  }

  console.log(n);
  countdown(n - 1); // Chamada recursiva
}

countdown(5);
// 5
// 4
// 3
// 2
// 1
// 0
```

## 🔍 Análise Conceitual Profunda

### 1. Call Stack em Recursão

```typescript
function fatorial(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial(n - 1);
}

// Execução de fatorial(4):
// fatorial(4)
//   → 4 * fatorial(3)
//       → 3 * fatorial(2)
//           → 2 * fatorial(1)
//               → 1 (caso base)
//           → 2 * 1 = 2
//       → 3 * 2 = 6
//   → 4 * 6 = 24
```

**Conceito:** Cada chamada recursiva é empilhada (call stack), depois desempilhada quando retorna.

### 2. Recursão em Estruturas de Dados

```typescript
// Estrutura recursiva - lista ligada
interface Node<T> {
  valor: T;
  proximo: Node<T> | null;
}

// Calcular comprimento recursivamente
function comprimento<T>(node: Node<T> | null): number {
  if (node === null) return 0; // Caso base
  return 1 + comprimento(node.proximo); // Recursão
}

// Buscar valor
function buscar<T>(node: Node<T> | null, valor: T): boolean {
  if (node === null) return false; // Caso base - não encontrado
  if (node.valor === valor) return true; // Caso base - encontrado
  return buscar(node.proximo, valor); // Recursão
}
```

### 3. Recursão em Árvores

```typescript
interface TreeNode {
  valor: number;
  esquerda: TreeNode | null;
  direita: TreeNode | null;
}

// Somar todos os valores de árvore
function somarArvore(node: TreeNode | null): number {
  if (node === null) return 0; // Caso base

  return (
    node.valor +
    somarArvore(node.esquerda) +
    somarArvore(node.direita)
  );
}

// Altura da árvore
function altura(node: TreeNode | null): number {
  if (node === null) return 0; // Caso base

  const alturaEsquerda = altura(node.esquerda);
  const alturaDireita = altura(node.direita);

  return 1 + Math.max(alturaEsquerda, alturaDireita);
}
```

### 4. Fibonacci Recursivo

```typescript
// Clássico exemplo de recursão (ineficiente)
function fibonacci(n: number): number {
  if (n <= 1) return n; // Casos base: fib(0) = 0, fib(1) = 1

  return fibonacci(n - 1) + fibonacci(n - 2); // Duas chamadas recursivas
}

// fibonacci(5) faz árvore de chamadas:
//              fib(5)
//            /        \
//        fib(4)      fib(3)
//       /     \      /    \
//   fib(3)  fib(2) fib(2) fib(1)
//   ...
```

### 5. Recursão Mútua

```typescript
// Funções que chamam uma a outra
function ehPar(n: number): boolean {
  if (n === 0) return true;
  return ehImpar(n - 1);
}

function ehImpar(n: number): boolean {
  if (n === 0) return false;
  return ehPar(n - 1);
}

console.log(ehPar(4));   // true
console.log(ehImpar(5)); // true
```

**Conceito:** Recursão indireta - funções se chamam mutuamente.

### 6. Recursão em Strings

```typescript
// Inverter string recursivamente
function inverter(str: string): string {
  if (str === "") return ""; // Caso base

  // Primeiro caractere vai pro final + inversão do resto
  return inverter(str.slice(1)) + str[0];
}

inverter("hello"); // "olleh"

// Palindrome check
function ehPalindromo(str: string): boolean {
  if (str.length <= 1) return true; // Caso base

  if (str[0] !== str[str.length - 1]) return false;

  return ehPalindromo(str.slice(1, -1)); // Recursão no meio
}

ehPalindromo("radar"); // true
```

### 7. Recursão em Arrays

```typescript
// Achatar array aninhado (flatten)
function achatar(arr: any[]): any[] {
  if (arr.length === 0) return []; // Caso base

  const primeiro = arr[0];

  // Se primeiro elemento é array, achatar ele também
  if (Array.isArray(primeiro)) {
    return [...achatar(primeiro), ...achatar(arr.slice(1))];
  }

  // Se não é array, concatenar com achatamento do resto
  return [primeiro, ...achatar(arr.slice(1))];
}

achatar([1, [2, [3, 4], 5], 6]); // [1, 2, 3, 4, 5, 6]
```

## 🎯 Aplicabilidade e Contextos

### 1. Dividir e Conquistar (Merge Sort)

```typescript
function mergeSort(arr: number[]): number[] {
  // Caso base - array com 0 ou 1 elemento já está ordenado
  if (arr.length <= 1) return arr;

  const meio = Math.floor(arr.length / 2);
  const esquerda = arr.slice(0, meio);
  const direita = arr.slice(meio);

  // Recursão - ordena metades e mescla
  return merge(mergeSort(esquerda), mergeSort(direita));
}

function merge(esquerda: number[], direita: number[]): number[] {
  const resultado: number[] = [];
  let i = 0, j = 0;

  while (i < esquerda.length && j < direita.length) {
    if (esquerda[i] < direita[j]) {
      resultado.push(esquerda[i++]);
    } else {
      resultado.push(direita[j++]);
    }
  }

  return [...resultado, ...esquerda.slice(i), ...direita.slice(j)];
}
```

### 2. Permutações

```typescript
function permutacoes(arr: number[]): number[][] {
  if (arr.length === 0) return [[]]; // Caso base

  const resultado: number[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const atual = arr[i];
    const resto = [...arr.slice(0, i), ...arr.slice(i + 1)];

    // Recursão - permutar resto e adicionar atual no início
    const permutacoesResto = permutacoes(resto);

    for (const perm of permutacoesResto) {
      resultado.push([atual, ...perm]);
    }
  }

  return resultado;
}

permutacoes([1, 2, 3]);
// [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
```

### 3. Caminho em Labirinto

```typescript
type Labirinto = number[][];

function encontrarCaminho(
  labirinto: Labirinto,
  x: number,
  y: number,
  visitados: Set<string> = new Set()
): boolean {
  // Caso base - fora dos limites
  if (x < 0 || y < 0 || x >= labirinto.length || y >= labirinto[0].length) {
    return false;
  }

  // Caso base - parede ou já visitado
  if (labirinto[x][y] === 1 || visitados.has(`${x},${y}`)) {
    return false;
  }

  // Caso base - chegou no destino
  if (labirinto[x][y] === 9) {
    return true;
  }

  visitados.add(`${x},${y}`);

  // Recursão - tenta 4 direções
  return (
    encontrarCaminho(labirinto, x + 1, y, visitados) ||
    encontrarCaminho(labirinto, x - 1, y, visitados) ||
    encontrarCaminho(labirinto, x, y + 1, visitados) ||
    encontrarCaminho(labirinto, x, y - 1, visitados)
  );
}
```

## ⚠️ Limitações e Considerações

### 1. Overhead de Call Stack

Cada chamada recursiva ocupa espaço na call stack:

```typescript
// Recursão profunda pode estourar stack
function profunda(n: number): number {
  if (n === 0) return 0;
  return profunda(n - 1);
}

// profunda(100000); // Stack overflow!
```

### 2. Performance Inferior (Sem Otimização)

```typescript
// Recursão ineficiente - recalcula subproblemas
function fibonacciLento(n: number): number {
  if (n <= 1) return n;
  return fibonacciLento(n - 1) + fibonacciLento(n - 2);
}
// fibonacciLento(40) é extremamente lento

// Solução: memoization
const memo = new Map<number, number>();

function fibonacciRapido(n: number): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const resultado = fibonacciRapido(n - 1) + fibonacciRapido(n - 2);
  memo.set(n, resultado);
  return resultado;
}
```

## 🔗 Interconexões Conceituais

Recursão conecta-se com:

- **Call Stack:** Mecanismo que permite recursão funcionar
- **Closures:** Recursão captura variáveis de escopo externo
- **Estruturas de Dados:** Árvores, listas ligadas são naturalmente recursivas
- **Algoritmos:** Merge sort, quick sort, DFS, backtracking
- **Programação Funcional:** Paradigma central

## 🚀 Evolução e Próximos Conceitos

Dominar recursão básica prepara para:

1. **Caso Base e Caso Recursivo:** Estrutura formal de recursão
2. **Stack Overflow:** Limites e problemas
3. **Tail Recursion:** Otimização de recursão
4. **Memoization:** Cache de resultados recursivos
5. **Dynamic Programming:** Técnica avançada baseada em recursão

## 📚 Conclusão

Recursão - função que chama a si mesma - é técnica fundamental onde problemas são resolvidos quebrando-os em subproblemas menores da mesma natureza. É essencial para:

- Estruturas de dados recursivas (árvores, listas ligadas)
- Algoritmos dividir e conquistar
- Problemas naturalmente recursivos (fatorial, fibonacci)
- Programação funcional

Compreender recursão é dominar paradigma poderoso de decomposição de problemas, onde soluções elegantes emergem de definições indutivas simples - caso base mais passo recursivo que aproxima do base.

