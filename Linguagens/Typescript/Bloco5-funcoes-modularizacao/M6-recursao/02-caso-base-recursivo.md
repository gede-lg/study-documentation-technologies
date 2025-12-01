# Caso Base e Caso Recursivo: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Caso base** e **caso recursivo** são os dois componentes estruturais fundamentais de toda função recursiva. O **caso base** é a condição de parada que retorna valor diretamente sem recursão, enquanto o **caso recursivo** é a lógica que quebra o problema em subproblema menor chamando a função novamente.

Conceitualmente, representam **prova por indução matemática**: caso base é o passo inicial, caso recursivo é o passo indutivo que assume verdade para casos menores.

## 📋 Fundamentos

### Estrutura Formal

```typescript
function recursiva(n: number): TipoRetorno {
  // CASO BASE - condição de parada
  if (n === condicaoTermino) {
    return valorDireto;
  }

  // CASO RECURSIVO - reduz problema
  return operacao(recursiva(n - 1));
}
```

### Exemplo: Fatorial

```typescript
function fatorial(n: number): number {
  // Caso base: 0! = 1 e 1! = 1
  if (n === 0 || n === 1) {
    return 1;
  }

  // Caso recursivo: n! = n × (n-1)!
  return n * fatorial(n - 1);
}
```

## 🔍 Análise Conceitual

### 1. Múltiplos Casos Base

```typescript
function fibonacci(n: number): number {
  // Dois casos base
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Caso recursivo
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

### 2. Casos Base em Estruturas

```typescript
// Array - caso base é array vazio
function somarArray(arr: number[]): number {
  if (arr.length === 0) return 0; // Caso base
  return arr[0] + somarArray(arr.slice(1)); // Recursivo
}

// Árvore - caso base é nó nulo
function somarArvore(node: TreeNode | null): number {
  if (node === null) return 0; // Caso base
  return node.valor + somarArvore(node.esquerda) + somarArvore(node.direita);
}
```

### 3. Progressão Garantida

```typescript
// ✅ Correto - aproxima do caso base
function countdown(n: number): void {
  if (n < 0) return; // Caso base
  console.log(n);
  countdown(n - 1); // Reduz n
}

// ❌ Erro - não aproxima do caso base
function infinito(n: number): void {
  if (n === 0) return;
  console.log(n);
  infinito(n + 1); // Aumenta n - NUNCA atinge 0!
}
```

## 🎯 Aplicabilidade

### Potenciação

```typescript
function potencia(base: number, expoente: number): number {
  // Caso base: qualquer número elevado a 0 é 1
  if (expoente === 0) return 1;

  // Caso recursivo: base^n = base × base^(n-1)
  return base * potencia(base, expoente - 1);
}
```

### Soma de Dígitos

```typescript
function somaDigitos(n: number): number {
  // Caso base: número de um dígito
  if (n < 10) return n;

  // Caso recursivo: último dígito + soma do resto
  return (n % 10) + somaDigitos(Math.floor(n / 10));
}

somaDigitos(1234); // 1 + 2 + 3 + 4 = 10
```

## 📚 Conclusão

Caso base e caso recursivo formam a estrutura dual de toda recursão: base fornece condição de término, recursivo quebra problema em partes menores. Compreender essa dualidade é essencial para criar recursões corretas e eficientes.
