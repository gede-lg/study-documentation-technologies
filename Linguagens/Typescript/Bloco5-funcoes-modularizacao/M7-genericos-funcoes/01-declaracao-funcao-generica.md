# Múltiplos Parâmetros Genéricos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Múltiplos parâmetros genéricos** (multiple generic type parameters) são funções que declaram **dois ou mais type parameters independentes**, permitindo polimorfismo sobre múltiplos tipos simultaneamente. Conceitualmente, representam **funções polimórficas multidimensionais**, onde cada parâmetro de tipo pode variar independentemente dos outros.

Na essência, múltiplos genéricos materializam o princípio de **transformação type-safe entre domínios diferentes**, onde função opera com tipos de entrada e saída distintos mantendo relações precisas entre eles.

## 📋 Fundamentos

### Sintaxe Básica

```typescript
// Função com dois type parameters
function par<A, B>(primeiro: A, segundo: B): [A, B] {
  return [primeiro, segundo];
}

// Uso
par<number, string>(42, "hello");  // [number, string]
par(true, 100);                    // [boolean, number] - inferido
```

**Componentes:**
- **`<A, B>`:** Declaração de múltiplos type parameters
- **`primeiro: A, segundo: B`:** Cada parâmetro usa type parameter diferente
- **`: [A, B]`:** Retorno combina ambos type parameters

### Convenções de Nomenclatura

```typescript
// Convenção comum: T, U, V para genéricos abstratos
function transformar<T, U>(valor: T, fn: (x: T) => U): U {
  return fn(valor);
}

// Nomes descritivos quando significado é claro
function buscar<Key, Value>(mapa: Map<Key, Value>, chave: Key): Value | undefined {
  return mapa.get(chave);
}
```

## 🔍 Análise Conceitual

### 1. Transformação entre Tipos

```typescript
// Mapear de tipo T para tipo U
function mapear<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numeros = [1, 2, 3];
const strings = mapear(numeros, n => n.toString()); // string[]
const booleanos = mapear(numeros, n => n > 2);      // boolean[]
```

**Conceito:** `T` representa tipo de entrada, `U` representa tipo de saída. Função conecta dois domínios via função de transformação.

### 2. Pares e Tuplas Tipadas

```typescript
// Criar par tipado
function criarPar<A, B>(a: A, b: B): { primeiro: A; segundo: B } {
  return { primeiro: a, segundo: b };
}

const par1 = criarPar(42, "answer");     // { primeiro: number; segundo: string }
const par2 = criarPar(true, [1, 2, 3]);  // { primeiro: boolean; segundo: number[] }

// Inverter ordem de tupla
function inverterPar<A, B>(par: [A, B]): [B, A] {
  return [par[1], par[0]];
}

inverterPar([1, "a"]); // [string, number]
```

### 3. Composição de Funções

```typescript
// Compor duas funções com tipos diferentes
function compor<A, B, C>(
  f: (x: B) => C,
  g: (x: A) => B
): (x: A) => C {
  return (x: A) => f(g(x));
}

const dobrar = (n: number) => n * 2;
const paraString = (n: number) => n.toString();
const tamanho = (s: string) => s.length;

const fn = compor(tamanho, paraString); // (x: number) => number
fn(42); // 2 (tamanho de "42")
```

**Conceito:** Três type parameters para cadeia de transformação: `A → B → C`.

### 4. Merge de Objetos

```typescript
// Combinar dois objetos mantendo tipos
function merge<T extends object, U extends object>(
  obj1: T,
  obj2: U
): T & U {
  return { ...obj1, ...obj2 };
}

const a = { nome: "Ana", idade: 25 };
const b = { email: "ana@example.com" };

const resultado = merge(a, b);
// Tipo: { nome: string; idade: number; email: string }
```

### 5. Redução com Acumulador

```typescript
// Reduce com tipos de entrada e saída diferentes
function reduzir<T, U>(
  arr: T[],
  fn: (acumulador: U, item: T) => U,
  inicial: U
): U {
  let acc = inicial;
  for (const item of arr) {
    acc = fn(acc, item);
  }
  return acc;
}

// Somar números
reduzir([1, 2, 3], (acc, n) => acc + n, 0); // number

// Agrupar por propriedade
interface Pessoa { nome: string; idade: number; }
const pessoas: Pessoa[] = [
  { nome: "Ana", idade: 25 },
  { nome: "Bob", idade: 30 }
];

reduzir(
  pessoas,
  (acc, p) => {
    acc[p.nome] = p.idade;
    return acc;
  },
  {} as Record<string, number>
); // { Ana: 25, Bob: 30 }
```

## 🎯 Aplicabilidade

### Pipeline de Transformações

```typescript
function pipe<A, B, C>(
  valor: A,
  fn1: (x: A) => B,
  fn2: (x: B) => C
): C {
  return fn2(fn1(valor));
}

const resultado = pipe(
  "42",
  s => parseInt(s),    // string → number
  n => n * 2           // number → number
); // 84
```

### Cache Genérico com Chave/Valor

```typescript
class Cache<K, V> {
  private mapa = new Map<K, V>();

  definir<K, V>(chave: K, valor: V): void {
    this.mapa.set(chave, valor);
  }

  obter<K>(chave: K): V | undefined {
    return this.mapa.get(chave);
  }
}

const cache = new Cache<string, number>();
cache.definir("idade", 25);
cache.obter("idade"); // number | undefined
```

### Zippar Arrays

```typescript
function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const tamanho = Math.min(arr1.length, arr2.length);
  const resultado: [T, U][] = [];

  for (let i = 0; i < tamanho; i++) {
    resultado.push([arr1[i], arr2[i]]);
  }

  return resultado;
}

zip([1, 2, 3], ["a", "b"]); // [[number, string], [number, string]]
```

## ⚠️ Limitações

### 1. Inferência Parcial Não Suportada

```typescript
function criar<T, U>(valor: T, padrao: U): T | U {
  return valor ?? padrao;
}

// ❌ Não pode especificar apenas T
// criar<number>(42, "default"); // Erro

// ✅ Deve especificar todos ou nenhum
criar<number, string>(42, "default"); // OK
criar(42, "default");                 // OK - inferido
```

### 2. Ordem Importa para Inferência

```typescript
// T inferido de valor, U de fn
function processar<T, U>(valor: T, fn: (x: T) => U): U {
  return fn(valor);
}

processar(42, n => n.toString()); // T=number, U=string (inferido corretamente)

// Se ordem fosse invertida, inferência seria mais difícil
```

## 📚 Conclusão

Múltiplos parâmetros genéricos permitem funções polimórficas que operam sobre vários tipos independentes simultaneamente. São essenciais para transformações type-safe, composições, e operações que relacionam domínios de tipos diferentes mantendo precisão de tipos.
