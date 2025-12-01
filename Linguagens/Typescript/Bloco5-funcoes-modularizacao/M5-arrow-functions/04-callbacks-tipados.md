# Callbacks com Tipos Corretos no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Callbacks tipados** (typed callbacks) são funções passadas como argumentos para outras funções, com **type annotations completas** que especificam tipos de parâmetros e retorno. Conceitualmente, representam **contratos de função** que garantem que callbacks recebem argumentos corretos e retornam valores esperados, eliminando erros comuns de passagem de callbacks.

Na essência, callbacks tipados materializam o princípio de **type safety em programação funcional**, onde higher-order functions (funções que aceitam funções) podem confiar que callbacks fornecidos seguem interface esperada.

### Problema Fundamental que Resolve

Callbacks tipados resolvem o problema de **callbacks com assinaturas incompatíveis**:

```typescript
// ❌ JavaScript - sem type safety
function processar(numeros, callback) {
  return numeros.map(callback);
}

processar([1, 2, 3], function(n, index, arr) {
  // callback espera 3 parâmetros, mas podemos passar qualquer coisa
  return n.toUpperCase(); // Erro de runtime - number não tem toUpperCase
});

// ✅ TypeScript - type safe
function processarTipado(
  numeros: number[],
  callback: (valor: number, indice: number) => number
): number[] {
  return numeros.map(callback);
}

processarTipado([1, 2, 3], (n, i) => n * 2); // OK
// processarTipado([1, 2, 3], (n) => n.toUpperCase()); // Erro de compilação
```

## 📋 Fundamentos

### Sintaxe de Callback Tipado

```typescript
// Tipo inline
function executar(callback: (x: number) => string): void {
  const resultado = callback(10);
  console.log(resultado);
}

// Type alias
type Callback = (x: number) => string;

function executarComAlias(callback: Callback): void {
  const resultado = callback(10);
  console.log(resultado);
}

// Interface
interface CallbackInterface {
  (x: number): string;
}

function executarComInterface(callback: CallbackInterface): void {
  const resultado = callback(10);
  console.log(resultado);
}
```

### Inferência de Tipos em Callbacks

```typescript
const numeros = [1, 2, 3, 4, 5];

// TypeScript infere tipos de parâmetros do callback
numeros.map((n) => n * 2); // n é inferido como number

// Pode adicionar tipos explícitos
numeros.map((n: number): number => n * 2);

// Ou confiar na inferência
numeros.filter(n => n > 3); // n inferido como number, retorno inferido como boolean
```

## 🔍 Análise Conceitual Profunda

### 1. Callbacks em Array Methods

```typescript
const usuarios = [
  { nome: "Ana", idade: 25 },
  { nome: "João", idade: 30 },
  { nome: "Maria", idade: 28 }
];

// map - callback com tipo inferido
const nomes = usuarios.map(usuario => usuario.nome);
// TypeScript infere: (usuario: { nome: string; idade: number }) => string

// filter - callback retorna boolean
const adultos = usuarios.filter(usuario => usuario.idade >= 18);
// (usuario: { nome: string; idade: number }) => boolean

// reduce - callback com acumulador
const somaIdades = usuarios.reduce((acc, usuario) => acc + usuario.idade, 0);
// (acc: number, usuario: { nome: string; idade: number }) => number

// sort - callback retorna number
const ordenados = usuarios.sort((a, b) => a.idade - b.idade);
// (a: Usuario, b: Usuario) => number
```

### 2. Callbacks Personalizados

```typescript
// Função que aceita callback
function processar<T, R>(
  array: T[],
  callback: (item: T, index: number) => R
): R[] {
  return array.map(callback);
}

// Uso
const numeros = [1, 2, 3];
const strings = processar(numeros, (n, i) => `${i}: ${n}`);
// T = number, R = string

// Callback com múltiplos parâmetros
function forEach<T>(
  array: T[],
  callback: (item: T, index: number, arr: T[]) => void
): void {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}
```

### 3. Callbacks Opcionais

```typescript
// Callback opcional
function buscar(
  query: string,
  callback?: (resultados: string[]) => void
): void {
  const resultados = ["item1", "item2"];

  if (callback) {
    callback(resultados); // Type-safe - TypeScript sabe que callback existe
  }
}

// Uso
buscar("teste"); // OK - callback opcional
buscar("teste", resultados => console.log(resultados)); // OK
```

### 4. Error-First Callbacks (Node.js Style)

```typescript
// Padrão Node.js - callback com erro primeiro
type NodeCallback<T> = (erro: Error | null, resultado?: T) => void;

function lerArquivo(
  caminho: string,
  callback: NodeCallback<string>
): void {
  try {
    const conteudo = "conteúdo do arquivo";
    callback(null, conteudo); // Sucesso
  } catch (erro) {
    callback(erro as Error); // Erro
  }
}

// Uso
lerArquivo("arquivo.txt", (erro, conteudo) => {
  if (erro) {
    console.error(erro);
    return;
  }
  console.log(conteudo); // TypeScript sabe que conteudo existe aqui
});
```

### 5. Callbacks Genéricos

```typescript
// Callback genérico que preserva tipo
function transformar<T, U>(
  valor: T,
  callback: (item: T) => U
): U {
  return callback(valor);
}

const numero = transformar(5, n => n * 2); // numero: number
const texto = transformar(5, n => String(n)); // texto: string
const objeto = transformar("hello", s => ({ mensagem: s })); // objeto: { mensagem: string }
```

### 6. Callbacks com Type Predicates

```typescript
// Type predicate em callback
function filtrarTipo<T, S extends T>(
  array: T[],
  callback: (item: T) => item is S
): S[] {
  return array.filter(callback);
}

type Animal = { tipo: string };
type Cachorro = Animal & { latir: () => void };

const animais: Animal[] = [
  { tipo: "cachorro", latir: () => console.log("Au!") } as Cachorro,
  { tipo: "gato" }
];

// Callback é type predicate
const cachorros = filtrarTipo(
  animais,
  (animal): animal is Cachorro => animal.tipo === "cachorro"
);
// cachorros: Cachorro[]
```

### 7. Callbacks Assíncronos

```typescript
// Callback assíncrono
function executarAsync(
  callback: () => Promise<string>
): Promise<void> {
  return callback().then(resultado => {
    console.log(resultado);
  });
}

// Uso com async callback
executarAsync(async () => {
  const response = await fetch("/api/dados");
  return response.text();
});

// Callback com async/await
type AsyncCallback<T> = () => Promise<T>;

async function processar<T>(callback: AsyncCallback<T>): Promise<T> {
  const resultado = await callback();
  return resultado;
}
```

## 🎯 Aplicabilidade e Contextos

### 1. Higher-Order Functions

```typescript
// Função que retorna função
function criarMultiplicador(
  fator: number
): (x: number) => number {
  return (x: number) => x * fator;
}

const duplicar = criarMultiplicador(2);
const triplicar = criarMultiplicador(3);

duplicar(5); // 10
triplicar(5); // 15
```

### 2. Debounce/Throttle

```typescript
function debounce<Args extends any[]>(
  callback: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: number;

  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

// Uso
const buscar = debounce((termo: string) => {
  console.log(`Buscando: ${termo}`);
}, 300);

buscar("typescript"); // Type-safe
```

### 3. Memoization

```typescript
function memoize<Args extends any[], Return>(
  callback: (...args: Args) => Return
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const resultado = callback(...args);
    cache.set(key, resultado);
    return resultado;
  };
}

// Uso
const fibonacci = memoize((n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

### 4. Composição de Funções

```typescript
// Pipe - compor funções
function pipe<T>(...funcoes: Array<(arg: T) => T>) {
  return (valor: T): T => {
    return funcoes.reduce((acc, fn) => fn(acc), valor);
  };
}

const processar = pipe(
  (n: number) => n * 2,
  (n: number) => n + 1,
  (n: number) => n * n
);

processar(5); // ((5 * 2) + 1)^2 = 121
```

## ⚠️ Limitações e Considerações

### 1. Inferência vs. Anotação Explícita

```typescript
// Inferência funciona bem
[1, 2, 3].map(n => n * 2); // n inferido como number

// Mas às vezes explícito é mais claro
[1, 2, 3].map((n: number): number => n * 2);
```

### 2. Callbacks Complexos Podem Ser Verbosos

```typescript
// Type inline fica longo
function processar(
  callback: (
    item: { id: number; nome: string },
    index: number,
    array: Array<{ id: number; nome: string }>
  ) => boolean
): void {}

// Melhor usar type alias
type Item = { id: number; nome: string };
type Predicado = (item: Item, index: number, array: Item[]) => boolean;

function processarMelhor(callback: Predicado): void {}
```

### 3. Callbacks com `this`

```typescript
// Callback que usa this
interface Callback {
  (this: { valor: number }, x: number): number;
}

function executar(callback: Callback): number {
  return callback.call({ valor: 10 }, 5);
}

executar(function(x) {
  return this.valor + x; // this tipado
});
```

## 🔗 Interconexões Conceituais

Callbacks tipados conectam-se com:

- **Arrow Functions:** Sintaxe concisa para callbacks
- **Generics:** Callbacks genéricos que preservam tipos
- **Higher-Order Functions:** Funções que aceitam/retornam funções
- **Type Inference:** TypeScript infere tipos de callbacks
- **Functional Programming:** Composição, currying, memoization

## 🚀 Evolução e Próximos Conceitos

Dominar callbacks tipados prepara para:

1. **Event Handlers:** Callbacks para eventos DOM
2. **Promises:** Callbacks em `.then()`, `.catch()`
3. **Async Iterators:** Callbacks assíncronos
4. **Reactive Programming:** Observables e callbacks
5. **Function Composition:** Padrões avançados de composição

## 📚 Conclusão

Callbacks tipados garantem type safety em programação funcional, especificando tipos de parâmetros e retorno de funções passadas como argumentos. São essenciais para:

- Array methods type-safe (`.map()`, `.filter()`, etc.)
- Higher-order functions
- Composição e transformação de dados
- APIs ergonômicas e seguras

Compreender callbacks tipados é dominar a programação funcional type-safe no TypeScript, onde funções são cidadãos de primeira classe com garantias de tipo completas.
