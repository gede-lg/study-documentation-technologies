# Funções Genéricas - Declaração: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Funções genéricas** (generic functions) são funções que operam sobre **tipos parametrizados**, usando **type parameters** (parâmetros de tipo) que são especificados ou inferidos durante a chamada. Conceitualmente, representam **funções polimórficas**, que funcionam com múltiplos tipos mantendo type safety.

Na essência, genéricos materializam o princípio de **reutilização type-safe**, onde mesma lógica funciona para diferentes tipos sem duplicação de código ou perda de informação de tipo.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Função genérica com type parameter T
function identidade<T>(valor: T): T {
  return valor;
}

// Uso com tipo explícito
identidade<number>(42);       // 42
identidade<string>("hello");  // "hello"

// Uso com inferência
identidade(42);     // T inferido como number
identidade("hello"); // T inferido como string
```

**Componentes:**
- **`<T>`:** Declaração de type parameter
- **`valor: T`:** Parâmetro usa type parameter
- **`: T`:** Retorno usa type parameter

### Problema que Resolve

```typescript
// ❌ Sem genéricos - perde tipo
function identidadeAny(valor: any): any {
  return valor;
}

const resultado = identidadeAny(42); // any - tipo perdido

// ❌ Sem genéricos - duplicação
function identidadeNumero(valor: number): number {
  return valor;
}

function identidadeString(valor: string): string {
  return valor;
}

// ✅ Com genéricos - type-safe e reutilizável
function identidadeGenerica<T>(valor: T): T {
  return valor;
}

const num = identidadeGenerica(42);     // number
const str = identidadeGenerica("hello"); // string
```

## 🔍 Análise Conceitual

### 1. Arrays Genéricos

```typescript
function primeiroElemento<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = primeiroElemento([1, 2, 3]);      // number | undefined
const str = primeiroElemento(["a", "b"]);     // string | undefined
```

### 2. Transformação Genérica

```typescript
function mapear<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numeros = [1, 2, 3];
const strings = mapear(numeros, n => n.toString()); // string[]
const dobrados = mapear(numeros, n => n * 2);       // number[]
```

### 3. Arrow Functions Genéricas

```typescript
// Arrow function genérica
const ultimo = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

// Múltiplos parâmetros
const par = <A, B>(a: A, b: B): [A, B] => [a, b];

par(1, "hello"); // [number, string]
```

### 4. Objetos Genéricos

```typescript
function clonar<T extends object>(obj: T): T {
  return { ...obj };
}

const usuario = { nome: "Ana", idade: 25 };
const copia = clonar(usuario); // { nome: string; idade: number }
```

### 5. Type Parameter em Callback

```typescript
function processar<T>(
  items: T[],
  callback: (item: T, index: number) => void
): void {
  items.forEach(callback);
}

processar([1, 2, 3], (n, i) => console.log(n * 2));
processar(["a", "b"], (s, i) => console.log(s.toUpperCase()));
```

## 🎯 Aplicabilidade

### Promise Genérica

```typescript
function delay<T>(ms: number, valor: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(valor), ms);
  });
}

delay(1000, "Pronto!").then(msg => console.log(msg)); // string
```

### Cache Genérico

```typescript
function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

## 📚 Conclusão

Funções genéricas usam type parameters para criar funções reutilizáveis e type-safe que funcionam com múltiplos tipos. São essenciais para bibliotecas, utilitários e qualquer código que precise ser polimórfico mantendo informação de tipo.
