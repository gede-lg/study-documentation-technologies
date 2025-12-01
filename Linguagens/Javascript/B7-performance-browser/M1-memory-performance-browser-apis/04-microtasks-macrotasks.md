# Microtasks vs Macrotasks: Análise Conceitual

## 🎯 Definição

**Microtasks** e **Macrotasks** são duas filas de tarefas assíncronas no Event Loop com prioridades diferentes. Microtasks (Promises, queueMicrotask) executam **antes** de macrotasks (setTimeout, setInterval) e **todas** microtasks são processadas antes de qualquer macrotask.

```javascript
console.log('1: Síncrono');

setTimeout(() => console.log('2: Macrotask'), 0);

Promise.resolve().then(() => console.log('3: Microtask'));

console.log('4: Síncrono');

// Saída:
// 1: Síncrono
// 4: Síncrono
// 3: Microtask (antes de macrotask!)
// 2: Macrotask
```

**Conceito:** Sistema de priorização de tarefas assíncronas no Event Loop.

## 📋 Diferenças Fundamentais

### Macrotasks (Task Queue)

Fontes:
- setTimeout
- setInterval
- setImmediate (Node.js)
- I/O
- UI rendering
- requestAnimationFrame

```javascript
setTimeout(() => {
  console.log('Macrotask 1');
}, 0);

setTimeout(() => {
  console.log('Macrotask 2');
}, 0);

// Apenas UMA macrotask por ciclo de event loop
```

### Microtasks (Microtask Queue)

Fontes:
- Promise.then/catch/finally
- queueMicrotask()
- MutationObserver
- process.nextTick (Node.js - prioridade ainda maior)

```javascript
Promise.resolve().then(() => {
  console.log('Microtask 1');
});

Promise.resolve().then(() => {
  console.log('Microtask 2');
});

// TODAS microtasks executam antes de próxima macrotask
```

## 🧠 Event Loop

### Ciclo Completo

```
1. Executar código síncrono (call stack)
2. Processar TODAS as microtasks
3. Renderizar UI (se necessário)
4. Executar UMA macrotask
5. Voltar para passo 2
```

### Exemplo Detalhado

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');

  Promise.resolve().then(() => {
    console.log('Promise dentro Timeout');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');

  setTimeout(() => {
    console.log('Timeout dentro Promise');
  }, 0);
});

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');

// Saída:
// Start
// End
// Promise 1
// Promise 2
// Timeout 1
// Promise dentro Timeout
// Timeout dentro Promise
```

### Análise Passo a Passo

```
1. Stack: Start, End (síncronos)
2. Microtasks: Promise 1, Promise 2 (todas)
3. Macrotask: Timeout 1
4. Microtasks: Promise dentro Timeout
5. Macrotask: Timeout dentro Promise
```

## 🔍 queueMicrotask()

API explícita para adicionar microtasks:

```javascript
queueMicrotask(() => {
  console.log('Microtask manual');
});

setTimeout(() => {
  console.log('Macrotask');
}, 0);

// Microtask manual
// Macrotask
```

### Uso: Atualização em Batch

```javascript
class ReactiveObject {
  constructor() {
    this.listeners = [];
    this.pendente = false;
  }

  set valor(v) {
    this._valor = v;

    if (!this.pendente) {
      this.pendente = true;

      queueMicrotask(() => {
        this.listeners.forEach(fn => fn(this._valor));
        this.pendente = false;
      });
    }
  }

  onChange(fn) {
    this.listeners.push(fn);
  }
}

const obj = new ReactiveObject();

obj.onChange(v => console.log('Listener:', v));

obj.valor = 1;
obj.valor = 2;
obj.valor = 3;
// Apenas um listener dispara: 'Listener: 3'
// (batch de atualizações)
```

## ⚠️ Microtask Starvation

Microtasks podem bloquear macrotasks:

```javascript
// ❌ Problema: microtask infinito
function recursivaMicrotask() {
  queueMicrotask(() => {
    console.log('Microtask');
    recursivaMicrotask(); // Cria nova microtask
  });
}

recursivaMicrotask();

setTimeout(() => {
  console.log('Timeout NUNCA executa!');
}, 0);

// Microtasks rodam para sempre
// Macrotask nunca executa
// UI congela
```

### Solução: Usar Macrotask Ocasionalmente

```javascript
// ✅ Permitir macrotasks
function recursivaSaudavel(contador = 0) {
  queueMicrotask(() => {
    console.log('Microtask', contador);

    if (contador % 100 === 0) {
      // A cada 100, usar macrotask
      setTimeout(() => recursivaSaudavel(contador + 1), 0);
    } else {
      recursivaSaudavel(contador + 1);
    }
  });
}
```

## 🚀 Casos Práticos

### Garantir Ordem com Microtasks

```javascript
function processar() {
  console.log('Processando...');

  // Garantir que listeners executem após código síncrono
  queueMicrotask(() => {
    notificarListeners();
  });

  console.log('Processamento completo');
}
```

### Deferimento Mínimo

```javascript
// Adiar apenas até próximo microtask checkpoint
function deferirMinimo(fn) {
  queueMicrotask(fn);
}

console.log('1');
deferirMinimo(() => console.log('2'));
console.log('3');

// 1, 3, 2
```

### Comparação de Timings

```javascript
console.log('Start');

setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate')); // Node.js
Promise.resolve().then(() => console.log('Promise'));
queueMicrotask(() => console.log('queueMicrotask'));
process.nextTick(() => console.log('nextTick')); // Node.js

console.log('End');

// Node.js:
// Start
// End
// nextTick (prioridade máxima)
// Promise
// queueMicrotask
// setTimeout
// setImmediate
```

## 🔗 Relação com async/await

async/await usa microtasks:

```javascript
async function teste() {
  console.log('1');
  await Promise.resolve();
  console.log('2'); // Microtask
}

teste();

setTimeout(() => console.log('3'), 0); // Macrotask

console.log('4');

// 1, 4, 2, 3
```

Compreender microtasks vs macrotasks é essencial para prever ordem de execução assíncrona e evitar bugs sutis de timing em JavaScript.
