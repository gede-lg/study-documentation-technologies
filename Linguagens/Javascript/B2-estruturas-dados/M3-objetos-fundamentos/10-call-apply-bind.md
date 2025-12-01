# Métodos call(), apply() e bind() em JavaScript: Manipulação Explícita de Contexto

## 🎯 Introdução e Definição

### Definição Conceitual

Os métodos **`call()`**, **`apply()`** e **`bind()`** são **ferramentas fundamentais** para **manipulação explícita do contexto** (`this`) em JavaScript. Representam o **mecanismo primário** para **explicit binding**, permitindo **controle programático** sobre qual objeto será referenciado por `this` durante a execução de uma função.

**Conceitos centrais:**
- **`call()`**: Invoca função imediatamente com contexto e argumentos específicos
- **`apply()`**: Similar ao call(), mas aceita argumentos como array
- **`bind()`**: Cria nova função com contexto permanentemente vinculado

### Problema Fundamental que Resolvem

Resolvem o **problema da perda de contexto** em JavaScript, onde `this` pode ser **indefinido ou incorreto** dependendo de **como** uma função é chamada, não **onde** foi definida.

```javascript
const usuario = {
  nome: "João",
  cumprimentar() {
    console.log(`Olá, eu sou ${this.nome}`);
  }
};

// ❌ Problema: context loss
const saudar = usuario.cumprimentar;
saudar(); // "Olá, eu sou undefined"

// ✅ Solução: explicit binding
const outroUsuario = { nome: "Maria" };
saudar.call(outroUsuario); // "Olá, eu sou Maria"
```

---

## 📋 Sumário Conceitual

### Diferenças Fundamentais

| Método | Execução | Argumentos | Retorno |
|--------|----------|------------|---------|
| `call()` | Imediata | Individuais | Resultado da função |
| `apply()` | Imediata | Array/Array-like | Resultado da função |
| `bind()` | Retorna função | Individuais | Nova função bound |

### Casos de Uso Principais

- **Method Borrowing**: Usar métodos de outros objetos
- **Context Preservation**: Manter `this` em callbacks
- **Partial Application**: Criar funções especializadas
- **Function Composition**: Combinar funções mantendo contexto

---

## 🧠 Fundamentos Teóricos

### call() - Invocação Imediata com Contexto

```javascript
// Syntax: func.call(thisArg, arg1, arg2, ...)

// Exemplo básico
function apresentar(idade, profissao) {
  return `${this.nome}, ${idade} anos, ${profissao}`;
}

const pessoa1 = { nome: "Ana" };
const pessoa2 = { nome: "Carlos" };

const resultado1 = apresentar.call(pessoa1, 25, "Designer");
const resultado2 = apresentar.call(pessoa2, 30, "Developer");

console.log(resultado1); // "Ana, 25 anos, Designer"
console.log(resultado2); // "Carlos, 30 anos, Developer"

// Method borrowing com call()
const arrayLike = {
  0: "primeiro",
  1: "segundo", 
  2: "terceiro",
  length: 3
};

// Emprestar slice() do Array.prototype
const resultado = Array.prototype.slice.call(arrayLike, 1);
console.log(resultado); // ["segundo", "terceiro"]

// Converter NodeList para Array
const elementos = document.querySelectorAll('.classe');
const arrayElementos = Array.prototype.slice.call(elementos);
```

### apply() - Argumentos como Array

```javascript
// Syntax: func.apply(thisArg, [argsArray])

function calcular(operacao, ...numeros) {
  console.log(`Calculadora: ${this.nome}`);
  
  switch(operacao) {
    case 'soma': return numeros.reduce((a, b) => a + b, 0);
    case 'multiplicacao': return numeros.reduce((a, b) => a * b, 1);
    default: return 0;
  }
}

const calculadora = { nome: "Calc Pro" };
const numeros = [10, 20, 30, 40];

// apply() é ideal quando argumentos estão em array
const soma = calcular.apply(calculadora, ['soma', ...numeros]);
const produto = calcular.apply(calculadora, ['multiplicacao', ...numeros]);

console.log(soma);    // 100
console.log(produto); // 240000

// Uso clássico: Math.max/min com arrays
const valores = [1, 5, 3, 9, 2];
const maximo = Math.max.apply(null, valores);
const minimo = Math.min.apply(null, valores);

console.log(maximo); // 9
console.log(minimo); // 1

// Versão moderna com spread operator
const maximoModerno = Math.max(...valores);
const minimoModerno = Math.min(...valores);
```

### bind() - Criação de Função com Contexto Fixo

```javascript
// Syntax: func.bind(thisArg, arg1, arg2, ...)

class Timer {
  constructor(nome) {
    this.nome = nome;
    this.contador = 0;
  }
  
  tick() {
    this.contador++;
    console.log(`${this.nome}: ${this.contador}`);
  }
  
  iniciar() {
    // ❌ Problema: this será global no callback
    // setInterval(this.tick, 1000);
    
    // ✅ Solução: bind() fixa o contexto
    setInterval(this.tick.bind(this), 1000);
  }
}

const timer = new Timer("MeuTimer");
timer.iniciar(); // Funciona corretamente

// Partial application com bind()
function multiplicar(fator, numero) {
  return fator * numero;
}

const duplicar = multiplicar.bind(null, 2);
const triplicar = multiplicar.bind(null, 3);

console.log(duplicar(5));  // 10
console.log(triplicar(5)); // 15

// Bind com contexto e argumentos parciais
function saudar(cumprimento, pontuacao) {
  return `${cumprimento}, ${this.nome}${pontuacao}`;
}

const pessoa = { nome: "João" };
const cumprimentoFormal = saudar.bind(pessoa, "Bom dia");

console.log(cumprimentoFormal("!")); // "Bom dia, João!"
console.log(cumprimentoFormal(".")); // "Bom dia, João."
```

---

## 🔍 Análise Conceitual Profunda

### Performance Comparison

```javascript
// Benchmark dos três métodos
function benchmarkContextMethods() {
  const obj = { valor: 42 };
  
  function operacao(x, y) {
    return this.valor + x + y;
  }
  
  const iteracoes = 1000000;
  
  // Test call()
  console.time('call()');
  for (let i = 0; i < iteracoes; i++) {
    operacao.call(obj, i, i);
  }
  console.timeEnd('call()');
  
  // Test apply()
  console.time('apply()');
  for (let i = 0; i < iteracoes; i++) {
    operacao.apply(obj, [i, i]);
  }
  console.timeEnd('apply()');
  
  // Test bind() (criando função uma vez)
  const boundFunction = operacao.bind(obj);
  console.time('bind() pre-bound');
  for (let i = 0; i < iteracoes; i++) {
    boundFunction(i, i);
  }
  console.timeEnd('bind() pre-bound');
  
  // Test bind() (criando função a cada iteração - anti-pattern)
  console.time('bind() per-call');
  for (let i = 0; i < iteracoes; i++) {
    const bound = operacao.bind(obj);
    bound(i, i);
  }
  console.timeEnd('bind() per-call');
}

benchmarkContextMethods();
```

### Advanced Method Borrowing

```javascript
// Padrões avançados de method borrowing
const AdvancedBorrowing = {
  // Array methods em objetos array-like
  arrayMethods: {
    slice: Array.prototype.slice,
    forEach: Array.prototype.forEach,
    map: Array.prototype.map,
    filter: Array.prototype.filter,
    reduce: Array.prototype.reduce
  },
  
  // String methods em números
  stringMethods: {
    charAt: String.prototype.charAt,
    substring: String.prototype.substring,
    toUpperCase: String.prototype.toUpperCase
  },
  
  // Aplicar array methods
  useArrayMethods(arrayLike) {
    const slice = this.arrayMethods.slice;
    const map = this.arrayMethods.map;
    
    // Converter para array real
    const realArray = slice.call(arrayLike);
    
    // Aplicar transformações
    const doubled = map.call(arrayLike, x => x * 2);
    
    return { realArray, doubled };
  },
  
  // Aplicar string methods em números
  useStringMethods(numero) {
    const str = String(numero);
    const charAt = this.stringMethods.charAt;
    const toUpperCase = this.stringMethods.toUpperCase;
    
    return {
      firstDigit: charAt.call(str, 0),
      upperStr: toUpperCase.call(str)
    };
  }
};

// Teste de method borrowing
const nodeList = document.querySelectorAll('div'); // Simulated
const arrayLikeObj = { 0: 10, 1: 20, 2: 30, length: 3 };

const results = AdvancedBorrowing.useArrayMethods(arrayLikeObj);
console.log(results); // { realArray: [10, 20, 30], doubled: [20, 40, 60] }
```

---

## 🎯 Aplicabilidade e Contextos

### Event Handler Context Management

```javascript
class EventManager {
  constructor() {
    this.handlers = new Map();
    this.context = { manager: this };
  }
  
  // Método que usa bind() para preservar contexto
  addEventListener(element, event, handler, useCapture = false) {
    // Wrapper que mantém contexto do manager
    const wrappedHandler = function(e) {
      console.log(`Event ${event} handled by:`, this.manager.constructor.name);
      return handler.call(this, e);
    }.bind(this.context);
    
    element.addEventListener(event, wrappedHandler, useCapture);
    
    // Armazenar para cleanup posterior
    const key = `${element.id}-${event}`;
    this.handlers.set(key, { element, event, handler: wrappedHandler });
  }
  
  // Cleanup usando referências preservadas
  removeEventListener(elementId, event) {
    const key = `${elementId}-${event}`;
    const stored = this.handlers.get(key);
    
    if (stored) {
      stored.element.removeEventListener(stored.event, stored.handler);
      this.handlers.delete(key);
    }
  }
}

// Function Composition com Context
const FunctionComposer = {
  // Compor funções preservando contexto específico
  compose(...functions) {
    return function(context, ...args) {
      return functions.reduceRight((acc, fn) => {
        return fn.call(context, acc);
      }, args[0]);
    };
  },
  
  // Pipeline com contextos diferentes
  pipeline(context, ...functions) {
    return function(...args) {
      return functions.reduce((acc, fn) => {
        return fn.call(context, acc);
      }, args[0]);
    };
  }
};

// Demonstração
const processor = {
  name: "DataProcessor",
  
  addPrefix(value) {
    return `${this.name}: ${value}`;
  },
  
  toUpperCase(value) {
    return value.toUpperCase();
  },
  
  addSuffix(value) {
    return `${value} [${this.name}]`;
  }
};

const composed = FunctionComposer.compose(
  processor.addSuffix,
  processor.toUpperCase,
  processor.addPrefix
);

const result = composed(processor, "hello world");
console.log(result); // "DATAPROCESSOR: HELLO WORLD [DataProcessor]"
```

---

## ⚠️ Limitações e Considerações

### Anti-patterns Comuns

```javascript
// ❌ Anti-pattern: bind() em loops
function badBindInLoop() {
  const handlers = [];
  const context = { name: "Context" };
  
  for (let i = 0; i < 1000; i++) {
    // Cria nova função a cada iteração - ineficiente
    handlers.push(function(data) {
      return `${this.name}: ${data}`;
    }.bind(context));
  }
  
  return handlers;
}

// ✅ Melhor: uma função bound reutilizada
function goodBindPattern() {
  const context = { name: "Context" };
  
  const boundHandler = function(data) {
    return `${this.name}: ${data}`;
  }.bind(context);
  
  const handlers = [];
  for (let i = 0; i < 1000; i++) {
    handlers.push(boundHandler);
  }
  
  return handlers;
}

// ❌ Anti-pattern: apply() com argumentos fixos
function badApplyUsage() {
  const obj = { name: "Test" };
  
  function process(a, b, c) {
    return `${this.name}: ${a + b + c}`;
  }
  
  // Usar apply() quando call() seria mais direto
  return process.apply(obj, [1, 2, 3]);
}

// ✅ Melhor: usar call() para argumentos fixos
function goodCallUsage() {
  const obj = { name: "Test" };
  
  function process(a, b, c) {
    return `${this.name}: ${a + b + c}`;
  }
  
  return process.call(obj, 1, 2, 3);
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Modern Alternatives e Best Practices

```javascript
// Arrow functions como alternativa ao bind()
class ModernContextManagement {
  constructor(name) {
    this.name = name;
  }
  
  // Método tradicional com bind()
  traditionalMethod() {
    setTimeout(function() {
      console.log(this.name);
    }.bind(this), 100);
  }
  
  // Método moderno com arrow function
  modernMethod() {
    setTimeout(() => {
      console.log(this.name);
    }, 100);
  }
  
  // Método híbrido para casos específicos
  hybridMethod(callback) {
    const context = this;
    
    // Use arrow function quando possível
    const arrowCallback = (...args) => callback.call(context, ...args);
    
    // Use bind() quando precisar de função nomeada para debugging
    const boundCallback = callback.bind(context);
    
    return { arrowCallback, boundCallback };
  }
}

// Async/await preserva contexto naturalmente
class AsyncContextExample {
  constructor(name) {
    this.name = name;
  }
  
  async processData(data) {
    console.log(`Processing in ${this.name}`);
    
    // Contexto preservado através de await
    const result1 = await this.step1(data);
    const result2 = await this.step2(result1);
    const result3 = await this.step3(result2);
    
    return result3;
  }
  
  async step1(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Step 1 in ${this.name}`);
        resolve(data + 1);
      }, 100);
    });
  }
  
  async step2(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Step 2 in ${this.name}`);
        resolve(data * 2);
      }, 100);
    });
  }
  
  async step3(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Step 3 in ${this.name}`);
        resolve(data + 10);
      }, 100);
    });
  }
}
```

---

## 📚 Conclusão

Os métodos **`call()`**, **`apply()`** e **`bind()`** são **ferramentas essenciais** para **controle explícito de contexto** em JavaScript. **call()** e **apply()** executam funções imediatamente com contexto específico, diferindo apenas na forma de passar argumentos. **bind()** cria novas funções com contexto permanente.

**Casos principais:**
- **Method borrowing** entre objetos
- **Context preservation** em callbacks
- **Partial application** e currying
- **Function composition** mantendo contexto

São fundamentais para **programação funcional**, **orientação a objetos** e **event handling** eficaz em JavaScript moderno.