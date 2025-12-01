# Arrow Functions em TypeScript

## 🎯 Introdução

**Arrow functions** (`=>`) são uma sintaxe concisa para criar funções introduzida no ES6, oferecendo **escrita curta**, **retorno implícito** e **lexical this binding**, tornando-se a forma preferida para funções em TypeScript moderno.

## 📋 Conceitos Fundamentais

### Sintaxe Básica

```typescript
// Template arrow function
const nomeDaFuncao = (parametro1: Tipo1, parametro2: Tipo2): TipoRetorno => {
  // corpo da função
  return valor;
};

// Exemplo
const somar = (a: number, b: number): number => {
  return a + b;
};

const resultado = somar(5, 3); // 8
```

### Sintaxe Curta (Implicit Return)

```typescript
// Com corpo de bloco: return explícito
const dobrar1 = (x: number): number => {
  return x * 2;
};

// Sem chaves: return implícito
const dobrar2 = (x: number): number => x * 2;

// Ambas são equivalentes
```

### Parâmetro Único Sem Parênteses

```typescript
// Um parâmetro: parênteses opcionais (mas tipos exigem)
const quadrado1 = (x: number): number => x * x;

// Sem tipo, parênteses podem ser omitidos (não recomendado)
const quadrado2 = x => x * x; // tipo inferido como any

// ✅ Melhor: sempre usar parênteses e tipos
const quadrado3 = (x: number): number => x * x;
```

## 🧠 Fundamentos Teóricos

### Lexical This Binding

```typescript
class Contador {
  contador = 0;
  
  // Function expression: this dinâmico
  incrementar1 = function(): void {
    setTimeout(function(): void {
      this.contador++; // ❌ Erro: this é undefined ou global
    }, 1000);
  };
  
  // Arrow function: this léxico (captura this do escopo externo)
  incrementar2 = (): void => {
    setTimeout((): void => {
      this.contador++; // ✅ OK: this é a instância de Contador
    }, 1000);
  };
}

const c = new Contador();
c.incrementar2(); // Funciona corretamente
```

### Não Tem Próprio this, arguments, super, new.target

```typescript
// Function tradicional: tem this e arguments
function tradicional(): void {
  console.log(arguments); // ✅ OK: [1, 2, 3]
  console.log(this); // this dinâmico
}

tradicional(1, 2, 3);

// Arrow function: não tem arguments
const arrow = (): void => {
  console.log(arguments); // ❌ Erro: arguments não existe
  console.log(this); // this léxico do escopo externo
};

// ✅ Use rest parameters em arrow functions
const arrowComRest = (...args: number[]): void => {
  console.log(args); // [1, 2, 3]
};

arrowComRest(1, 2, 3);
```

### Não Pode Ser Construtora

```typescript
// Function tradicional: pode ser construtora
function Pessoa(nome: string) {
  this.nome = nome;
}

const pessoa1 = new Pessoa("Ana"); // ✅ OK

// Arrow function: não pode ser construtora
const PessoaArrow = (nome: string) => {
  this.nome = nome;
};

const pessoa2 = new PessoaArrow("Bruno"); // ❌ Erro: não é construtora
```

## 🔍 Análise Conceitual Profunda

### Retorno Implícito vs Explícito

#### Retorno Implícito (Sem Chaves)

```typescript
// Expressão única: return implícito
const somar = (a: number, b: number): number => a + b;

const quadrado = (x: number): number => x * x;

const ehPar = (n: number): boolean => n % 2 === 0;

// Objeto literal: precisa de parênteses
const criarUsuario = (nome: string, idade: number) => ({
  nome,
  idade,
  ativo: true
}); // ✅ OK: parênteses indicam objeto, não bloco
```

#### Retorno Explícito (Com Chaves)

```typescript
// Múltiplas linhas: return explícito
const calcularIMC = (peso: number, altura: number): number => {
  const imc = peso / (altura * altura);
  return imc;
};

const validar = (senha: string): boolean => {
  if (senha.length < 8) {
    return false;
  }
  return true;
};
```

### Arrow Functions em Array Methods

```typescript
const numeros = [1, 2, 3, 4, 5];

// map: transformar cada elemento
const dobrados = numeros.map((n: number): number => n * 2);
// [2, 4, 6, 8, 10]

// filter: filtrar elementos
const pares = numeros.filter((n: number): boolean => n % 2 === 0);
// [2, 4]

// reduce: acumular valores
const soma = numeros.reduce((acc: number, n: number): number => acc + n, 0);
// 15

// find: encontrar primeiro elemento
const primeiro = numeros.find((n: number): boolean => n > 3);
// 4

// every: todos satisfazem condição
const todosPositivos = numeros.every((n: number): boolean => n > 0);
// true

// some: algum satisfaz condição
const temMaiorQue10 = numeros.some((n: number): boolean => n > 10);
// false
```

### Callbacks com Arrow Functions

```typescript
// setTimeout com arrow function
setTimeout((): void => {
  console.log("Executado após 1 segundo");
}, 1000);

// addEventListener (simulado)
function addEventListener(evento: string, handler: (e: Event) => void): void {
  // registrar evento...
}

addEventListener("click", (e: Event): void => {
  console.log("Clicou!", e);
});

// Promise com arrow function
fetch("https://api.example.com/data")
  .then((response: Response): Promise<any> => response.json())
  .then((data: any): void => console.log(data))
  .catch((erro: Error): void => console.error(erro));
```

### Higher-Order Functions

```typescript
// Função que retorna arrow function
const criarMultiplicador = (fator: number): ((x: number) => number) => {
  return (x: number): number => x * fator;
};

const dobrar = criarMultiplicador(2);
const triplicar = criarMultiplicador(3);

dobrar(5); // 10
triplicar(5); // 15

// Função que recebe arrow function
const aplicar = (fn: (x: number) => number, valor: number): number => {
  return fn(valor);
};

aplicar((x: number): number => x * 2, 10); // 20
```

### Currying com Arrow Functions

```typescript
// Currying: transformar função de múltiplos parâmetros em sequência de funções
const somar = (a: number) => (b: number): number => a + b;

const somar5 = somar(5);
console.log(somar5(3)); // 8
console.log(somar5(10)); // 15

// Currying com três parâmetros
const multiplicar = (a: number) => (b: number) => (c: number): number => a * b * c;

const mult2 = multiplicar(2);
const mult2e3 = mult2(3);
console.log(mult2e3(4)); // 24

// Uso direto
console.log(multiplicar(2)(3)(4)); // 24
```

## 🎯 Aplicabilidade

### React/Framework Components

```typescript
// Event handlers em componentes
interface Props {
  onSave: (data: string) => void;
}

const Component = ({ onSave }: Props) => {
  const handleClick = (): void => {
    onSave("dados");
  };
  
  // Arrow function inline
  return {
    onClick: (): void => console.log("Clicou!")
  };
};
```

### Functional Programming Patterns

```typescript
// Composição de funções
const compose = <T>(...fns: Array<(arg: T) => T>) => (x: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), x);

const dobrar = (x: number): number => x * 2;
const incrementar = (x: number): number => x + 1;
const quadrado = (x: number): number => x * x;

const transformar = compose(quadrado, incrementar, dobrar);
transformar(3); // ((3 * 2) + 1)² = 49
```

### Predicates e Type Guards

```typescript
// Predicate functions
const ehPositivo = (n: number): boolean => n > 0;
const ehPar = (n: number): boolean => n % 2 === 0;
const ehString = (valor: unknown): valor is string => typeof valor === "string";

// Uso
const numeros = [-2, -1, 0, 1, 2, 3, 4];
const positivos = numeros.filter(ehPositivo); // [1, 2, 3, 4]
const paresPositivos = positivos.filter(ehPar); // [2, 4]
```

### API Client Methods

```typescript
class ApiClient {
  private baseUrl = "https://api.example.com";
  
  // Arrow function como método de classe: this sempre correto
  get = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  };
  
  post = async <T>(endpoint: string, data: any): Promise<T> => {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    return response.json();
  };
}

const client = new ApiClient();
const getData = client.get; // ✅ OK: this sempre é client
getData("/users"); // Funciona!
```

### Data Transformation Pipelines

```typescript
type Usuario = { id: number; nome: string; idade: number; ativo: boolean };

const usuarios: Usuario[] = [
  { id: 1, nome: "Ana", idade: 25, ativo: true },
  { id: 2, nome: "Bruno", idade: 30, ativo: false },
  { id: 3, nome: "Carla", idade: 22, ativo: true }
];

// Pipeline de transformações
const resultado = usuarios
  .filter((u: Usuario): boolean => u.ativo)
  .map((u: Usuario): string => u.nome)
  .sort((a: string, b: string): number => a.localeCompare(b));
// ["Ana", "Carla"]
```

## ⚠️ Limitações

### Não Pode Ser Usada como Método em Prototype

```typescript
class Pessoa {
  nome: string;
  
  constructor(nome: string) {
    this.nome = nome;
  }
  
  // ❌ Evitar: arrow function como método pode ter problemas
  // (funciona em class fields, mas não em prototype)
}

// ✅ Melhor: método tradicional
class PessoaCorreta {
  nome: string;
  
  constructor(nome: string) {
    this.nome = nome;
  }
  
  saudar(): string {
    return `Olá, ${this.nome}`;
  }
}
```

### Não Tem arguments Object

```typescript
// ❌ Erro: arguments não existe
const somar = (): number => {
  return arguments[0] + arguments[1]; // ReferenceError
};

// ✅ Use rest parameters
const somarCorreto = (...numeros: number[]): number => {
  return numeros.reduce((acc, n) => acc + n, 0);
};
```

### Pode Ser Menos Legível em Casos Complexos

```typescript
// ⚠️ Arrow function complexa: difícil de ler
const processar = (dados: any[]): any[] => dados.filter((d: any): boolean => d.ativo).map((d: any): any => ({ ...d, processado: true })).sort((a: any, b: any): number => a.id - b.id);

// ✅ Melhor: quebrar em múltiplas linhas ou funções separadas
const processar2 = (dados: any[]): any[] => {
  const ativos = dados.filter((d: any): boolean => d.ativo);
  const processados = ativos.map((d: any): any => ({ ...d, processado: true }));
  const ordenados = processados.sort((a: any, b: any): number => a.id - b.id);
  return ordenados;
};
```

## 🔗 Interconexões

### Com Function Expression

```typescript
// Function expression tradicional
const somar1 = function(a: number, b: number): number {
  return a + b;
};

// Arrow function
const somar2 = (a: number, b: number): number => a + b;

// Principal diferença: this binding
```

### Com Genéricos

```typescript
// Arrow function genérica
const identidade = <T>(valor: T): T => valor;

const primeiroElemento = <T>(array: T[]): T | undefined => array[0];

const mapear = <T, U>(array: T[], fn: (item: T) => U): U[] =>
  array.map(fn);

// Uso
const num = identidade(42); // number
const primeiro = primeiroElemento([1, 2, 3]); // number | undefined
const dobrados = mapear([1, 2, 3], (x: number): number => x * 2); // number[]
```

### Com Async/Await

```typescript
// Arrow function assíncrona
const buscarDados = async (id: number): Promise<string> => {
  const response = await fetch(`https://api.example.com/${id}`);
  const data = await response.json();
  return data;
};

// Array method com async arrow function
const processarIDs = async (ids: number[]): Promise<string[]> => {
  const promises = ids.map(async (id: number): Promise<string> => {
    return await buscarDados(id);
  });
  
  return await Promise.all(promises);
};
```

## 🚀 Evolução e Contexto Histórico

### JavaScript ES5: Function Expression

```javascript
// ES5: function expression
var somar = function(a, b) {
  return a + b;
};

// this problemático em callbacks
var objeto = {
  valor: 10,
  processar: function() {
    setTimeout(function() {
      console.log(this.valor); // undefined! this não é objeto
    }, 1000);
  }
};
```

### ES6: Arrow Functions

```javascript
// ES6: arrow function
const somar = (a, b) => a + b;

// this léxico resolve problema
const objeto = {
  valor: 10,
  processar() {
    setTimeout(() => {
      console.log(this.valor); // 10! this é objeto
    }, 1000);
  }
};
```

### TypeScript: Arrow Functions com Tipos

```typescript
// TypeScript: tipos + arrow functions
const somar = (a: number, b: number): number => a + b;

const objeto = {
  valor: 10,
  processar(): void {
    setTimeout((): void => {
      console.log(this.valor); // Type-safe + this correto
    }, 1000);
  }
};
```

## 📚 Conclusão

**Arrow functions** em TypeScript oferecem:

✅ Sintaxe concisa e legível  
✅ Retorno implícito para expressões únicas  
✅ Lexical this binding (resolve problemas de contexto)  
✅ Ideal para callbacks e functional programming  
✅ Não tem arguments, super, new.target próprios  

Use arrow functions quando:
- Quer sintaxe concisa
- Precisa preservar contexto this
- Escreve callbacks ou array methods
- Usa programação funcional (map, filter, reduce)
- Não precisa de arguments object

Arrow functions são **padrão moderno para funções** em TypeScript, preferidas sobre function expressions na maioria dos casos.
