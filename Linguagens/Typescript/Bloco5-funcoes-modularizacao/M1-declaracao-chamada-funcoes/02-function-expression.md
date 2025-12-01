# Function Expression em TypeScript

## 🎯 Introdução

**Function expression** é uma forma de criar funções como **valores atribuídos a variáveis**, permitindo funções anônimas, sem hoisting, e oferecendo maior flexibilidade para passar funções como dados.

## 📋 Conceitos Fundamentais

### Sintaxe Básica

```typescript
// Template de function expression
const nomeDaVariavel = function(parametro1: Tipo1, parametro2: Tipo2): TipoRetorno {
  // corpo da função
  return valor;
};

// Exemplo
const somar = function(a: number, b: number): number {
  return a + b;
};

const resultado = somar(5, 3); // 8
```

### Named vs Anonymous Function Expression

```typescript
// Anonymous: função sem nome próprio
const multiplicar = function(a: number, b: number): number {
  return a * b;
};

// Named: função com nome (útil para recursão e debug)
const fatorial = function calcularFatorial(n: number): number {
  if (n <= 1) return 1;
  return n * calcularFatorial(n - 1); // nome usado para recursão
};
```

## 🧠 Fundamentos Teóricos

### Não Tem Hoisting

```typescript
// ❌ Erro: não pode usar antes de declarar
console.log(somar(5, 3)); // ReferenceError

const somar = function(a: number, b: number): number {
  return a + b;
};

// ✅ OK: usar após declaração
const resultado = somar(5, 3);
```

### Funções São First-Class Citizens

```typescript
// Funções podem ser atribuídas a variáveis
const processar = function(x: number): number {
  return x * 2;
};

// Passadas como argumentos
function executar(fn: (x: number) => number, valor: number): number {
  return fn(valor);
}

executar(processar, 10); // 20

// Retornadas de outras funções
function criarMultiplicador(fator: number): (x: number) => number {
  return function(x: number): number {
    return x * fator;
  };
}

const dobrar = criarMultiplicador(2);
dobrar(5); // 10
```

### Tipagem de Function Expression

#### Anotação de Tipo na Variável

```typescript
// Tipo da função anotado na variável
const somar: (a: number, b: number) => number = function(a, b) {
  return a + b;
};

// TypeScript infere tipos dos parâmetros a partir da anotação
```

#### Anotação de Tipo na Função

```typescript
// Tipo da função anotado nos parâmetros e retorno
const dividir = function(a: number, b: number): number {
  return a / b;
};

// TypeScript infere tipo da variável a partir da função
```

#### Ambas as Anotações (Redundante mas Explícito)

```typescript
// Ambas anotações: mais verboso mas totalmente explícito
const multiplicar: (a: number, b: number) => number = function(a: number, b: number): number {
  return a * b;
};
```

## 🔍 Análise Conceitual Profunda

### Immediately Invoked Function Expression (IIFE)

```typescript
// IIFE: função executada imediatamente após definição
const resultado = (function(a: number, b: number): number {
  return a + b;
})(5, 3); // 8

// Útil para criar escopo isolado
(function(): void {
  const variavel = "privada";
  console.log(variavel);
})();

// variavel não existe fora da IIFE
```

### Closures com Function Expression

```typescript
function criarContador(): () => number {
  let contador = 0;
  
  // Function expression captura variável do escopo externo
  return function(): number {
    contador++;
    return contador;
  };
}

const incrementar = criarContador();
console.log(incrementar()); // 1
console.log(incrementar()); // 2
console.log(incrementar()); // 3

// contador está "fechado" dentro da função retornada
```

### Callbacks com Tipagem

```typescript
// Callback como function expression
function processar(numeros: number[], callback: (n: number) => number): number[] {
  return numeros.map(callback);
}

// Callback inline
const dobrados = processar([1, 2, 3], function(n: number): number {
  return n * 2;
}); // [2, 4, 6]

// Callback armazenado
const triplicar = function(n: number): number {
  return n * 3;
};

const triplicados = processar([1, 2, 3], triplicar); // [3, 6, 9]
```

### Event Handlers

```typescript
// Type para event handler
type EventHandler = (event: Event) => void;

// Function expression como event handler
const handleClick: EventHandler = function(event: Event): void {
  console.log("Clicou!", event.target);
};

// Simulação de registro de evento
function addEventListener(tipo: string, handler: EventHandler): void {
  // registra handler...
}

addEventListener("click", handleClick);
```

### Higher-Order Functions

```typescript
// Função que retorna função
function criarSaudacao(saudacao: string): (nome: string) => string {
  return function(nome: string): string {
    return `${saudacao}, ${nome}!`;
  };
}

const digaOla = criarSaudacao("Olá");
const digaTchau = criarSaudacao("Tchau");

console.log(digaOla("Ana")); // "Olá, Ana!"
console.log(digaTchau("Bruno")); // "Tchau, Bruno!"

// Função que recebe função
function aplicarDuasVezes(fn: (x: number) => number, valor: number): number {
  return fn(fn(valor));
}

const incrementar = function(x: number): number {
  return x + 1;
};

aplicarDuasVezes(incrementar, 5); // 7
```

## 🎯 Aplicabilidade

### Callbacks Assíncronos

```typescript
type Callback<T> = (erro: Error | null, resultado?: T) => void;

function buscarDados(id: number, callback: Callback<string>): void {
  setTimeout(function(): void {
    if (id > 0) {
      callback(null, `Dados do ID ${id}`);
    } else {
      callback(new Error("ID inválido"));
    }
  }, 1000);
}

// Uso
buscarDados(10, function(erro: Error | null, resultado?: string): void {
  if (erro) {
    console.error(erro.message);
  } else {
    console.log(resultado);
  }
});
```

### Array Methods com Function Expression

```typescript
const numeros = [1, 2, 3, 4, 5];

// map com function expression
const dobrados = numeros.map(function(n: number): number {
  return n * 2;
}); // [2, 4, 6, 8, 10]

// filter com function expression
const pares = numeros.filter(function(n: number): boolean {
  return n % 2 === 0;
}); // [2, 4]

// reduce com function expression
const soma = numeros.reduce(function(acc: number, n: number): number {
  return acc + n;
}, 0); // 15
```

### Factory Functions

```typescript
type Usuario = {
  nome: string;
  email: string;
  ativo: boolean;
};

// Factory function usando function expression
const criarUsuario = function(nome: string, email: string): Usuario {
  return {
    nome,
    email,
    ativo: true
  };
};

const usuario1 = criarUsuario("Ana", "ana@email.com");
const usuario2 = criarUsuario("Bruno", "bruno@email.com");
```

### Strategy Pattern

```typescript
type Estrategia = (valor: number) => number;

const estrategias = {
  dobrar: function(valor: number): number {
    return valor * 2;
  },
  triplicar: function(valor: number): number {
    return valor * 3;
  },
  quadruplicar: function(valor: number): number {
    return valor * 4;
  }
};

function aplicarEstrategia(estrategia: keyof typeof estrategias, valor: number): number {
  return estrategias[estrategia](valor);
}

aplicarEstrategia("dobrar", 5); // 10
aplicarEstrategia("triplicar", 5); // 15
```

### Memoization

```typescript
function memoizar<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
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

const fibonacci = memoizar(function(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // Rápido com cache
```

## ⚠️ Limitações

### Não Tem Hoisting

```typescript
// ❌ Erro: variável não foi declarada ainda
console.log(processar(10)); // ReferenceError

const processar = function(x: number): number {
  return x * 2;
};

// Variáveis let/const têm "temporal dead zone"
```

### Recursão com Funções Anônimas é Difícil

```typescript
// ❌ Difícil: função anônima não tem nome para chamar a si mesma
const fatorial = function(n: number): number {
  if (n <= 1) return 1;
  return n * ???(n - 1); // Como chamar a si mesma?
};

// ✅ Solução 1: named function expression
const fatorial1 = function calcular(n: number): number {
  if (n <= 1) return 1;
  return n * calcular(n - 1);
};

// ✅ Solução 2: usar nome da variável (mas pode ser reatribuída!)
const fatorial2 = function(n: number): number {
  if (n <= 1) return 1;
  return n * fatorial2(n - 1); // depende de fatorial2 não mudar
};
```

### Performance com Criação Repetida

```typescript
// ⚠️ Cada chamada cria nova função na memória
function criarHandlers(n: number): Array<() => void> {
  const handlers: Array<() => void> = [];
  
  for (let i = 0; i < n; i++) {
    // Nova função criada a cada iteração
    handlers.push(function(): void {
      console.log(i);
    });
  }
  
  return handlers;
}

// Pode ser ineficiente com muitas funções
```

## 🔗 Interconexões

### Com Function Declaration

```typescript
// Function declaration: hoisting, sempre nomeada
function declarada(x: number): number {
  return x * 2;
}

// Function expression: sem hoisting, pode ser anônima
const expressao = function(x: number): number {
  return x * 2;
};

// Uso é idêntico
declarada(5); // 10
expressao(5); // 10
```

### Com Arrow Functions

```typescript
// Function expression tradicional
const somar1 = function(a: number, b: number): number {
  return a + b;
};

// Arrow function (function expression concisa)
const somar2 = (a: number, b: number): number => {
  return a + b;
};

// Arrow function curta
const somar3 = (a: number, b: number): number => a + b;

// Principal diferença: binding de this
```

### Com Type Aliases de Função

```typescript
// Type alias para assinatura de função
type Operacao = (a: number, b: number) => number;

// Function expression com tipo
const somar: Operacao = function(a, b) {
  return a + b;
};

const subtrair: Operacao = function(a, b) {
  return a - b;
};

const multiplicar: Operacao = function(a, b) {
  return a * b;
};
```

### Com Interfaces de Função

```typescript
interface Transformador {
  (valor: number): number;
}

const dobrar: Transformador = function(valor) {
  return valor * 2;
};

const triplicar: Transformador = function(valor) {
  return valor * 3;
};

function aplicar(transformador: Transformador, valor: number): number {
  return transformador(valor);
}
```

## 🚀 Evolução e Contexto Histórico

### JavaScript ES5: Function Expression

```javascript
// JavaScript ES5
var somar = function(a, b) {
  return a + b;
};

// Sem tipos: bugs comuns
somar(5, "3"); // "53" - concatenação
```

### TypeScript: Tipagem em Function Expression

```typescript
// TypeScript: tipos previnem bugs
const somar = function(a: number, b: number): number {
  return a + b;
};

somar(5, "3"); // ❌ Erro de compilação
```

### ES6: Arrow Functions Simplificam

```typescript
// Function expression tradicional
const dobrar1 = function(x: number): number {
  return x * 2;
};

// Arrow function (ES6+): mais concisa
const dobrar2 = (x: number): number => x * 2;

// Ambas são function expressions, arrow é sintaxe mais curta
```

## 📚 Conclusão

**Function expression** em TypeScript oferece:

✅ Funções como valores de primeira classe  
✅ Flexibilidade para passar como argumentos  
✅ Sem hoisting (ordem previsível)  
✅ Suporte a funções anônimas e nomeadas  
✅ Base para closures e callbacks  

Use function expression quando:
- Quer passar função como argumento
- Precisa criar função dinamicamente
- Deseja evitar hoisting
- Quer closure sobre variáveis externas
- Função é usada como callback

Function expression é **essencial para programação funcional** e closures em TypeScript, complementando function declarations com maior flexibilidade.
