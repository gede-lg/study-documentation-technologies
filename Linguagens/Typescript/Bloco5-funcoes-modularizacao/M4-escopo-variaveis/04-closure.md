# Closure (Fechamento) no TypeScript: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Closure** (fechamento ou clausura) é o fenômeno onde uma função **captura e mantém acesso** a variáveis de seu escopo léxico externo, mesmo após o escopo externo ter terminado sua execução. Conceitualmente, é a combinação de uma **função + ambiente léxico** onde ela foi criada, formando uma "cápsula" que preserva estado.

Na essência, closures materializam o princípio de **lexical scoping** (escopo léxico), onde funções "lembram" do ambiente onde foram definidas, não onde são executadas. É o mecanismo que permite **encapsulamento de estado privado**, **fábricas de funções** e **programação funcional** em JavaScript/TypeScript.

### Contexto Histórico e Motivação

**Raízes Teóricas:**

Closures vêm da **lambda calculus** (Alonzo Church, 1930s) e linguagens funcionais como **Scheme** e **Lisp**. JavaScript herdou este conceito, tornando-o acessível em linguagem mainstream.

**Problema que Resolve:**

Antes de closures (em linguagens sem eles), criar estado privado persistente exigia:
- Variáveis globais (poluição)
- Objetos com propriedades públicas (sem privacidade)
- Complexidade adicional

**Com closures:**

```typescript
function criarContador() {
  let count = 0; // Privado, mas persistente

  return function() {
    return ++count; // Acessa count mesmo após criarContador() terminar
  };
}

const incrementar = criarContador();
console.log(incrementar()); // 1
console.log(incrementar()); // 2
console.log(incrementar()); // 3
// count é privado - não acessível externamente
```

**Motivação:**

1. **Estado Privado:** Encapsular dados sem classes
2. **Currying/Partial Application:** Fixar argumentos
3. **Callbacks/Event Handlers:** Preservar contexto
4. **Module Pattern:** Criar módulos antes de ES6 modules
5. **Memoization:** Cache de resultados

### Problema Fundamental que Resolve

Closures resolvem o problema de **manter estado entre chamadas de função sem variáveis globais**:

```typescript
// ❌ Sem closure - global necessário
let contadorGlobal = 0;

function incrementarGlobal(): number {
  return ++contadorGlobal;
}

// Problema: contadorGlobal pode ser modificado externamente

// ✅ Com closure - estado privado
function criarContador(): () => number {
  let contador = 0; // Privado

  return () => ++contador; // Closure captura contador
}

const inc = criarContador();
inc(); // 1
inc(); // 2
// contador é inacessível externamente
```

## 📋 Fundamentos

### Anatomia de um Closure

```typescript
function externa() {
  const mensagem = "Hello"; // Variável no escopo externo

  function interna() {
    console.log(mensagem); // Closure - captura mensagem
  }

  return interna;
}

const funcao = externa(); // externa() terminou
funcao(); // "Hello" - mensagem ainda acessível!
```

**Componentes:**

1. **Função externa:** Cria escopo e variáveis
2. **Função interna:** Referencia variáveis do escopo externo
3. **Retorno/Exposição:** Função interna escapa do escopo externo
4. **Captura:** Variáveis externas são "fechadas" no closure

### Lexical Scoping

```typescript
const nome = "Global";

function funcao1() {
  const nome = "Funcao1";

  function funcao2() {
    console.log(nome); // Qual nome?
  }

  funcao2(); // "Funcao1" - usa escopo onde funcao2 foi DEFINIDA
}

funcao1();
```

**Conceito:** Closure usa escopo léxico (onde foi definida), não dinâmico (onde é executada).

## 🔍 Análise Conceitual Profunda

### 1. Closure Simples

```typescript
function criarSaudacao(saudacao: string) {
  return function(nome: string) {
    return `${saudacao}, ${nome}!`; // Captura saudacao
  };
}

const dizerOi = criarSaudacao("Oi");
const dizerOla = criarSaudacao("Olá");

console.log(dizerOi("Ana"));   // "Oi, Ana!"
console.log(dizerOla("João")); // "Olá, João!"
```

**Conceito:** Cada closure mantém sua própria cópia de variáveis capturadas.

### 2. Contador com Múltiplos Métodos

```typescript
function criarContador(inicial: number = 0) {
  let count = inicial; // Privado

  return {
    incrementar: () => ++count,
    decrementar: () => --count,
    obter: () => count,
    resetar: () => { count = inicial; }
  };
}

const contador = criarContador(10);
contador.incrementar(); // 11
contador.incrementar(); // 12
contador.decrementar(); // 11
console.log(contador.obter()); // 11
contador.resetar();
console.log(contador.obter()); // 10
```

**Conceito:** Múltiplas funções compartilham mesmo closure (mesmo estado).

### 3. Closure em Loop (Problema Clássico)

```typescript
// ❌ Problema com var
const funcoesVar: Array<() => void> = [];

for (var i = 0; i < 3; i++) {
  funcoesVar.push(function() {
    console.log(i); // Closure captura i compartilhado
  });
}

funcoesVar[0](); // 3
funcoesVar[1](); // 3
funcoesVar[2](); // 3 - todos capturam mesmo i (final)

// ✅ Solução com let
const funcoesLet: Array<() => void> = [];

for (let j = 0; j < 3; j++) {
  funcoesLet.push(function() {
    console.log(j); // Cada iteração tem seu próprio j
  });
}

funcoesLet[0](); // 0
funcoesLet[1](); // 1
funcoesLet[2](); // 2
```

**Conceito:** `let` em loop cria novo escopo (e closure) por iteração.

### 4. Partial Application (Aplicação Parcial)

```typescript
function multiplicar(a: number) {
  return function(b: number) {
    return a * b; // Closure captura a
  };
}

const duplicar = multiplicar(2);
const triplicar = multiplicar(3);

console.log(duplicar(5));   // 10
console.log(triplicar(5));  // 15
```

**Conceito:** Closure permite fixar argumentos, criando funções especializadas.

### 5. Memoization com Closure

```typescript
function memoizar<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>(); // Closure captura cache

  return function(...args: Parameters<T>): ReturnType<T> {
    const chave = JSON.stringify(args);

    if (cache.has(chave)) {
      return cache.get(chave)!;
    }

    const resultado = fn(...args);
    cache.set(chave, resultado);
    return resultado;
  } as T;
}

const fibonacciLento = (n: number): number => {
  if (n <= 1) return n;
  return fibonacciLento(n - 1) + fibonacciLento(n - 2);
};

const fibonacciRapido = memoizar(fibonacciLento);

fibonacciRapido(40); // Rápido após primeira execução
```

**Conceito:** Closure preserva cache entre chamadas.

### 6. Module Pattern

```typescript
const Calculadora = (function() {
  // Estado privado
  let historico: number[] = [];
  let resultado = 0;

  // Funções privadas
  function registrar(operacao: string, valor: number): void {
    historico.push(valor);
    console.log(`${operacao}: ${valor}`);
  }

  // API pública (closures)
  return {
    somar(valor: number): typeof Calculadora {
      resultado += valor;
      registrar("somar", valor);
      return this;
    },

    subtrair(valor: number): typeof Calculadora {
      resultado -= valor;
      registrar("subtrair", valor);
      return this;
    },

    obterResultado(): number {
      return resultado;
    },

    obterHistorico(): number[] {
      return [...historico];
    }
  };
})();

Calculadora.somar(10).somar(5).subtrair(3);
console.log(Calculadora.obterResultado()); // 12
```

**Conceito:** IIFE cria closure para módulo com estado privado.

### 7. Event Handlers

```typescript
function anexarEventos(elemento: HTMLElement) {
  let cliques = 0; // Privado ao closure

  elemento.addEventListener("click", function() {
    cliques++; // Closure captura cliques
    console.log(`Cliques: ${cliques}`);
  });
}

const botao = document.querySelector("button")!;
anexarEventos(botao);
// Cada clique incrementa cliques preservado no closure
```

## 🎯 Aplicabilidade e Contextos

### 1. Factories de Funções

```typescript
function criarValidador(minimo: number) {
  return function(valor: number): boolean {
    return valor >= minimo;
  };
}

const maiorQue18 = criarValidador(18);
const maiorQue21 = criarValidador(21);

maiorQue18(20); // true
maiorQue21(20); // false
```

### 2. Currying

```typescript
function curry<A, B, C>(fn: (a: A, b: B) => C) {
  return function(a: A) {
    return function(b: B) {
      return fn(a, b);
    };
  };
}

const somar = (a: number, b: number) => a + b;
const somarCurried = curry(somar);

const somar5 = somarCurried(5);
console.log(somar5(3)); // 8
console.log(somar5(7)); // 12
```

### 3. React Hooks (useEffect, useState)

```typescript
function useState<T>(valorInicial: T): [() => T, (novo: T) => void] {
  let estado = valorInicial; // Closure

  function obter(): T {
    return estado;
  }

  function definir(novo: T): void {
    estado = novo;
  }

  return [obter, definir];
}

const [getCount, setCount] = useState(0);
setCount(5);
console.log(getCount()); // 5
```

## ⚠️ Limitações e Considerações

### 1. Memory Leaks

Closures mantêm variáveis na memória:

```typescript
function criarGrande() {
  const dadosGrandes = new Array(1000000).fill("data");

  return function() {
    console.log(dadosGrandes.length); // dadosGrandes nunca liberado
  };
}

const funcao = criarGrande(); // Mantém 1M elementos na memória
```

**Solução:** Apenas capture o necessário.

### 2. Captura de Referência (Não Valor)

```typescript
let x = 10;

const funcao = () => console.log(x); // Captura referência a x

x = 20;

funcao(); // 20 (não 10!)
```

### 3. `this` em Closures

```typescript
const objeto = {
  nome: "Objeto",

  metodo: function() {
    setTimeout(function() {
      console.log(this.nome); // undefined - this não capturado corretamente
    }, 100);
  },

  metodoArrow: function() {
    setTimeout(() => {
      console.log(this.nome); // "Objeto" - arrow function captura this léxico
    }, 100);
  }
};
```

## 🔗 Interconexões Conceituais

Closures conectam-se com:

- **Lexical Scoping:** Base conceitual de closures
- **Escopo de Função/Bloco:** Closures capturam esses escopos
- **Higher-Order Functions:** Retornar/aceitar funções com closures
- **Currying/Partial Application:** Técnicas baseadas em closures
- **Module Pattern:** Encapsulamento via closures

## 🚀 Evolução e Próximos Conceitos

Dominar closures prepara para:

1. **Higher-Order Functions:** Funções que manipulam funções
2. **Functional Programming:** Imutabilidade e composição
3. **Async Patterns:** Callbacks, promises com closures
4. **React Hooks:** useState, useEffect baseados em closures
5. **Design Patterns:** Module, Factory, Singleton com closures

## 📚 Conclusão

Closures são mecanismo fundamental de JavaScript/TypeScript que permite funções capturar e preservar acesso a variáveis de escopos externos, essencial para:

- Encapsulamento de estado privado
- Criação de factories e currying
- Event handlers e callbacks
- Programação funcional
- Module pattern

Compreender closures é dominar um dos conceitos mais poderosos e elegantes de JavaScript, onde funções não são apenas blocos de código, mas **entidades vivas** que carregam seu ambiente léxico, permitindo padrões sofisticados de encapsulamento e composição.
