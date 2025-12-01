# Callbacks Básicos: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

**Callback** é **função passada como argumento** para outra função, a ser executada posteriormente quando evento assíncrono completa ou condição específica é satisfeita. Conceitualmente, representa **continuation passing style**, onde você especifica "o que fazer depois" passando função que será invocada no futuro, permitindo código não-bloqueante executar enquanto aguarda operações demoradas (I/O, timers, requisições).

Na essência, callbacks materializam o princípio de **inversion of control**, onde em vez de código chamar função diretamente, você fornece função para framework/biblioteca chamar quando apropriado, fundamental para JavaScript assíncrono onde operações não bloqueiam thread principal.

## 📋 Fundamentos

### Callback Síncrono

```typescript
// Função que recebe callback
function processArray(arr: number[], callback: (item: number) => void): void {
  for (const item of arr) {
    callback(item);
  }
}

// Usando callback
processArray([1, 2, 3], (num) => {
  console.log(num * 2);
});

// Output:
// 2
// 4
// 6
```

**Conceito-chave:** Callback é **executado imediatamente** em loop - síncrono.

### Callback Assíncrono

```typescript
// setTimeout executa callback DEPOIS
setTimeout(() => {
  console.log('Executado depois de 1 segundo');
}, 1000);

console.log('Executado imediatamente');

// Output:
// "Executado imediatamente"
// (1 segundo depois)
// "Executado depois de 1 segundo"
```

**Conceito:** Callback assíncrono é **agendado** para executar no futuro, não bloqueia.

## 🔍 Análise Conceitual

### 1. Callbacks em Array Methods

```typescript
const numbers = [1, 2, 3, 4, 5];

// map - transforma cada elemento
const doubled = numbers.map((num) => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// filter - filtra elementos
const evens = numbers.filter((num) => num % 2 === 0);
console.log(evens);  // [2, 4]

// reduce - acumula valor
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);  // 15

// forEach - itera
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});
```

**Conceito:** Array methods recebem **callbacks síncronos** que executam para cada elemento.

### 2. Event Listeners (Callbacks Assíncronos)

```typescript
// DOM Event Listener
const button = document.getElementById('btn');

button?.addEventListener('click', (event) => {
  console.log('Button clicked!');
  console.log(event.target);
});

// Callback executado quando evento acontece
```

**Conceito:** Event listener registra **callback** que será invocado quando evento disparar.

### 3. setTimeout e setInterval

```typescript
// setTimeout - executa UMA VEZ depois de delay
setTimeout(() => {
  console.log('Executado após 2 segundos');
}, 2000);

// setInterval - executa REPETIDAMENTE
const intervalId = setInterval(() => {
  console.log('Executado a cada 1 segundo');
}, 1000);

// Cancelar interval
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Interval cancelado');
}, 5000);
```

**Output:**
```
Executado a cada 1 segundo
Executado a cada 1 segundo
Executado após 2 segundos
Executado a cada 1 segundo
Executado a cada 1 segundo
Interval cancelado
```

### 4. Callbacks com Parâmetros

```typescript
// Callback recebe resultado da operação
function fetchUser(id: number, callback: (user: User) => void): void {
  // Simula busca assíncrona
  setTimeout(() => {
    const user: User = {
      id,
      name: 'John Doe',
      email: 'john@example.com'
    };

    callback(user);
  }, 1000);
}

// Usar
fetchUser(1, (user) => {
  console.log(`User: ${user.name}`);
  console.log(`Email: ${user.email}`);
});
```

**Conceito:** Callback **recebe resultado** da operação assíncrona como parâmetro.

### 5. Múltiplos Callbacks

```typescript
interface Options {
  onSuccess: (data: string) => void;
  onError: (error: Error) => void;
}

function loadData(url: string, options: Options): void {
  // Simula requisição
  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      options.onSuccess('Data loaded successfully');
    } else {
      options.onError(new Error('Failed to load data'));
    }
  }, 1000);
}

// Usar
loadData('https://api.example.com/data', {
  onSuccess: (data) => {
    console.log('Success:', data);
  },
  onError: (error) => {
    console.error('Error:', error.message);
  }
});
```

**Conceito:** Múltiplos callbacks para diferentes **cenários** (sucesso, erro).

### 6. Callback vs Função Normal

```typescript
// Função normal - executa imediatamente
function executaAgora(): void {
  console.log('Executado imediatamente');
}

executaAgora();  // Chama diretamente

// Callback - executa quando framework decide
function executaDepois(callback: () => void): void {
  setTimeout(callback, 1000);
}

executaDepois(() => {
  console.log('Executado quando framework decidir');
});
```

**Diferença fundamental:**
- **Função normal:** você controla QUANDO executa
- **Callback:** framework/biblioteca controla QUANDO executa

### 7. Callbacks em Node.js (File System)

```typescript
import fs from 'fs';

// Leitura assíncrona com callback
fs.readFile('data.txt', 'utf-8', (error, data) => {
  if (error) {
    console.error('Error reading file:', error);
    return;
  }

  console.log('File contents:', data);
});

console.log('Reading file...');

// Output:
// "Reading file..."
// (depois de I/O completar)
// "File contents: ..."
```

**Conceito:** I/O em Node.js é **assíncrono** - callback executado quando operação completa.

### 8. Custom Async Function com Callback

```typescript
// Função que aceita callback
function delay(ms: number, callback: () => void): void {
  setTimeout(callback, ms);
}

// Usar
console.log('Start');

delay(2000, () => {
  console.log('2 seconds passed');
});

console.log('End');

// Output:
// "Start"
// "End"
// (2 segundos)
// "2 seconds passed"
```

**Conceito:** Funções customizadas podem aceitar **callbacks** para operações assíncronas.

## 🎯 Aplicabilidade

### Processamento de Dados

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

function processProducts(
  products: Product[],
  onEach: (product: Product) => void,
  onComplete: () => void
): void {
  products.forEach(onEach);
  onComplete();
}

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Mouse', price: 50 },
  { id: 3, name: 'Keyboard', price: 100 }
];

processProducts(
  products,
  (product) => {
    console.log(`${product.name}: $${product.price}`);
  },
  () => {
    console.log('All products processed');
  }
);
```

### Animation Loop

```typescript
function animate(
  duration: number,
  onFrame: (progress: number) => void,
  onComplete: () => void
): void {
  const startTime = Date.now();

  function frame() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    onFrame(progress);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      onComplete();
    }
  }

  requestAnimationFrame(frame);
}

// Usar
animate(
  2000,  // 2 segundos
  (progress) => {
    const element = document.getElementById('box');
    if (element) {
      element.style.left = `${progress * 300}px`;
    }
  },
  () => {
    console.log('Animation complete');
  }
);
```

### Retry Logic

```typescript
function retryOperation<T>(
  operation: (callback: (error: Error | null, result?: T) => void) => void,
  maxRetries: number,
  onComplete: (error: Error | null, result?: T) => void
): void {
  let attempts = 0;

  function attempt() {
    attempts++;

    operation((error, result) => {
      if (error && attempts < maxRetries) {
        console.log(`Attempt ${attempts} failed, retrying...`);
        setTimeout(attempt, 1000);
      } else {
        onComplete(error, result);
      }
    });
  }

  attempt();
}

// Usar
retryOperation(
  (callback) => {
    // Simula operação que pode falhar
    const success = Math.random() > 0.7;
    setTimeout(() => {
      if (success) {
        callback(null, 'Success!');
      } else {
        callback(new Error('Operation failed'));
      }
    }, 500);
  },
  3,  // máximo 3 tentativas
  (error, result) => {
    if (error) {
      console.error('Failed after retries:', error);
    } else {
      console.log('Result:', result);
    }
  }
);
```

### Queue Processing

```typescript
type Task = (callback: () => void) => void;

class TaskQueue {
  private tasks: Task[] = [];
  private running = false;

  add(task: Task): void {
    this.tasks.push(task);
    if (!this.running) {
      this.run();
    }
  }

  private run(): void {
    if (this.tasks.length === 0) {
      this.running = false;
      return;
    }

    this.running = true;
    const task = this.tasks.shift()!;

    task(() => {
      console.log('Task completed');
      this.run();  // Processar próxima task
    });
  }
}

// Usar
const queue = new TaskQueue();

queue.add((done) => {
  console.log('Task 1 starting');
  setTimeout(() => {
    console.log('Task 1 done');
    done();
  }, 1000);
});

queue.add((done) => {
  console.log('Task 2 starting');
  setTimeout(() => {
    console.log('Task 2 done');
    done();
  }, 500);
});
```

### Promisify Callback

```typescript
// Converter callback para Promise
function promisify<T>(
  fn: (callback: (error: Error | null, result?: T) => void) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result!);
      }
    });
  });
}

// Função com callback
function fetchData(callback: (error: Error | null, data?: string) => void): void {
  setTimeout(() => {
    callback(null, 'Data fetched');
  }, 1000);
}

// Usar como Promise
promisify(fetchData)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## ⚠️ Considerações

### 1. Callback Não é Sempre Assíncrono

```typescript
// Callback SÍNCRONO
[1, 2, 3].forEach((num) => {
  console.log(num);  // Executado IMEDIATAMENTE
});

console.log('Done');

// Output:
// 1
// 2
// 3
// "Done"
```

**Conceito:** forEach executa callback **sincronamente** - não há delay.

### 2. This Context em Callbacks

```typescript
class Counter {
  count = 0;

  increment(): void {
    this.count++;
  }

  startIncrementing(): void {
    // ❌ ERRO: this undefined
    setTimeout(function() {
      this.increment();  // TypeError
    }, 1000);

    // ✅ Arrow function preserva this
    setTimeout(() => {
      this.increment();  // Funciona
    }, 1000);

    // ✅ bind preserva this
    setTimeout(function() {
      this.increment();
    }.bind(this), 1000);
  }
}
```

### 3. Memory Leaks em Event Listeners

```typescript
// ❌ Memory leak - listener nunca removido
function setupButton() {
  const button = document.getElementById('btn');

  button?.addEventListener('click', () => {
    console.log('Clicked');
  });
}

// Chamado múltiplas vezes = múltiplos listeners
setupButton();
setupButton();
setupButton();

// ✅ Remover listener quando não necessário
function setupButton() {
  const button = document.getElementById('btn');

  const handleClick = () => {
    console.log('Clicked');
  };

  button?.addEventListener('click', handleClick);

  // Cleanup
  return () => {
    button?.removeEventListener('click', handleClick);
  };
}

const cleanup = setupButton();
// Depois...
cleanup();
```

### 4. Callback Executado Múltiplas Vezes

```typescript
// ⚠️ Cuidado: callback pode ser chamado múltiplas vezes
function processItems(
  items: string[],
  callback: (item: string) => void
): void {
  items.forEach(callback);
}

processItems(['a', 'b', 'c'], (item) => {
  console.log(item);
});

// Output:
// "a"
// "b"
// "c"
```

## 📚 Conclusão

Callback é **função passada como argumento** para ser executada posteriormente. Callbacks síncronos executam imediatamente (map, filter, forEach). Callbacks assíncronos executam no futuro (setTimeout, event listeners, I/O). Inversion of control: framework decide QUANDO executar callback. Callbacks recebem resultados de operações como parâmetros. Arrow functions preservam `this` context. Event listeners precisam cleanup para evitar memory leaks. Callbacks são base de programação assíncrona JavaScript, mas levam a callback hell em operações encadeadas (resolvido por Promises/async-await). Error-first callbacks convenção Node.js. Callbacks podem ser síncronos ou assíncronos dependendo da função que os invoca.

