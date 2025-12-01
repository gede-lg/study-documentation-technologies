# Browser vs Node.js: Diferenças no Event Loop

## 🎯 Definição

Embora **Browser** e **Node.js** compartilhem o motor V8 e conceitos de Event Loop, suas implementações diferem significativamente devido a contextos distintos: browsers focam em interação de UI e rendering, enquanto Node.js prioriza I/O de sistema de arquivos e rede. Essas diferenças afetam timing, prioridades de tarefas e APIs disponíveis.

```javascript
// Browser: foco em UI
setTimeout(() => console.log('Timer'), 0);
requestAnimationFrame(() => console.log('Frame')); // Específico de browser

// Node.js: foco em I/O
setTimeout(() => console.log('Timer'), 0);
setImmediate(() => console.log('Immediate')); // Específico de Node.js
```

**Conceito:** Diferentes contextos de execução resultam em variações de Event Loop e APIs.

## 📋 Estrutura do Event Loop

### Browser Event Loop

```
┌─────────────────────────┐
│   Execute Script        │ (código síncrono)
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│   Process Microtasks    │ (Promises, queueMicrotask)
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│   Render (opcional)     │ (60 FPS = a cada ~16ms)
│   - requestAnimationFrame
│   - Layout, Paint        │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│   Process Macrotask     │ (setTimeout, eventos)
└──────────┬──────────────┘
           │
           └──────────────────► Repetir
```

### Node.js Event Loop (libuv)

```
┌───────────────────────────┐
│        timers             │ (setTimeout, setInterval)
└─────────┬─────────────────┘
          │
┌─────────▼─────────────────┐
│   pending callbacks       │ (I/O callbacks adiados)
└─────────┬─────────────────┘
          │
┌─────────▼─────────────────┐
│      idle, prepare        │ (interno)
└─────────┬─────────────────┘
          │
┌─────────▼─────────────────┐
│         poll              │ (I/O: fs, net)
└─────────┬─────────────────┘
          │
┌─────────▼─────────────────┐
│        check              │ (setImmediate)
└─────────┬─────────────────┘
          │
┌─────────▼─────────────────┐
│   close callbacks         │ (socket.on('close'))
└─────────┬─────────────────┘
          │
          └───────────────────► Repetir

(Microtasks executam entre cada fase)
```

## 🧠 Diferenças Fundamentais

### 1. Macrotasks vs Fases

**Browser**: Macrotask Queue simples

```javascript
// Browser: uma macrotask por ciclo
setTimeout(() => console.log('1'), 0);
setTimeout(() => console.log('2'), 0);

// Ciclo 1: executa '1'
// Ciclo 2: executa '2'
```

**Node.js**: Múltiplas fases

```javascript
// Node.js: todas timers de uma fase executam juntas
setTimeout(() => console.log('1'), 0);
setTimeout(() => console.log('2'), 0);

// Fase timers: executa '1' e '2' consecutivamente
```

### 2. setImmediate (Node.js only)

```javascript
// Node.js: setImmediate executa na fase "check"
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));

// Ordem: depende do contexto
// Em I/O callback: immediate primeiro
// No início do script: ordem não garantida
```

**Browser**: `setImmediate` não existe (existe como polyfill)

### 3. process.nextTick (Node.js only)

```javascript
// Node.js: nextTick tem prioridade sobre microtasks
Promise.resolve().then(() => console.log('Promise'));
process.nextTick(() => console.log('nextTick'));

// Saída:
// nextTick (prioridade máxima)
// Promise

// nextTick executa ANTES de qualquer microtask
```

**Browser**: Não existe `process.nextTick`

### 4. requestAnimationFrame (Browser only)

```javascript
// Browser: sincronizado com refresh rate (60 FPS)
requestAnimationFrame(() => {
  console.log('Frame');
  // Executa antes de render, após microtasks
});

setTimeout(() => console.log('Timer'), 0);

// Saída típica:
// Timer (depende de quando próximo frame ocorre)
// Frame (antes de pintar)
```

**Node.js**: Não existe `requestAnimationFrame`

### 5. Rendering

**Browser**: Rendering integrado ao Event Loop

```javascript
// Microtasks bloqueiam rendering
Promise.resolve().then(() => {
  // Loop longo bloqueia UI
  for (let i = 0; i < 1000000000; i++) {}
});

// UI congela até microtask terminar
```

**Node.js**: Sem rendering (sem UI)

## 🔍 Casos Comparativos

### setTimeout vs setImmediate

```javascript
// Node.js: comportamento depende do contexto

// 1. Script principal (ordem não garantida)
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
// Pode ser: timeout → immediate OU immediate → timeout

// 2. Dentro de I/O callback (ordem garantida)
const fs = require('fs');
fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
  // Sempre: immediate → timeout
  // (setImmediate executa na fase check, atual)
  // (setTimeout executa na próxima fase timers)
});
```

**Browser**: Apenas `setTimeout` existe

```javascript
// Browser: setTimeout é única opção
setTimeout(() => console.log('1'), 0);
setTimeout(() => console.log('2'), 0);

// Uma macrotask por ciclo (geralmente)
```

### Microtask Timing

**Browser**:

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');

  // Criar nova microtask
  Promise.resolve().then(() => console.log('4'));
});

console.log('5');

// 1, 5, 3, 4, 2
// Todas microtasks antes de macrotask
```

**Node.js**:

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => {
  console.log('3');
  Promise.resolve().then(() => console.log('4'));
});

process.nextTick(() => {
  console.log('5');
  process.nextTick(() => console.log('6'));
});

console.log('7');

// 1, 7, 5, 6, 3, 4, 2
// nextTick > microtasks > timers
```

### I/O Operations

**Node.js**: Poll phase dedicada

```javascript
const fs = require('fs');

fs.readFile('arquivo.txt', (err, data) => {
  console.log('Arquivo lido');
  // Callback executa na fase poll ou pending callbacks
});

setTimeout(() => console.log('Timer'), 0);

// Ordem depende de quando I/O completa
```

**Browser**: I/O através de Web APIs

```javascript
fetch('/api/dados').then(() => {
  console.log('Fetch completo');
  // Microtask (Promise)
});

setTimeout(() => console.log('Timer'), 0);

// fetch resolve como microtask
// Timer é macrotask
```

## ⚠️ Armadilhas Comuns

### 1. Assumir Ordem Consistente

```javascript
// ❌ Código que assume ordem específica
setTimeout(() => {
  // Assume que sempre executa antes de setImmediate
}, 0);
setImmediate(() => {});

// ✅ Correto: não assumir ordem entre diferentes APIs
```

### 2. process.nextTick Starvation (Node.js)

```javascript
// ❌ nextTick recursivo bloqueia Event Loop
function recursivo() {
  process.nextTick(recursivo);
}
recursivo();

// Event Loop nunca passa para próxima fase
// I/O nunca processa

// ✅ Usar setImmediate para permitir I/O
function recursivo() {
  setImmediate(recursivo);
}
```

### 3. Microtask vs rAF (Browser)

```javascript
// ❌ Animar com microtask
function animar() {
  Promise.resolve().then(() => {
    elemento.style.left = '10px';
    animar(); // Não sincroniza com frames
  });
}

// ✅ Usar requestAnimationFrame
function animar() {
  requestAnimationFrame(() => {
    elemento.style.left = '10px';
    animar(); // Sincronizado com refresh rate
  });
}
```

## 🚀 APIs Específicas de Cada Ambiente

### Browser-only

```javascript
// UI e Rendering
requestAnimationFrame(callback);
requestIdleCallback(callback);

// Web APIs
fetch(url);
navigator.geolocation.getCurrentPosition();
document.addEventListener('click', handler);
window.localStorage.setItem('key', 'value');

// Workers
new Worker('script.js');
```

### Node.js-only

```javascript
// Process
process.nextTick(callback);
setImmediate(callback);

// File System
fs.readFile('arquivo.txt', callback);
fs.writeFile('arquivo.txt', data, callback);

// Networking
const server = http.createServer();
server.listen(3000);

// Streams
stream.pipe(destination);
```

### Universais (mas comportamento diferente)

```javascript
// Timers: mesma API, timing diferente
setTimeout(callback, ms);
setInterval(callback, ms);

// Promises: mesma API, contexto diferente
Promise.resolve().then(callback);

// Console: mesma API, output diferente
console.log('mensagem');
```

## 📊 Resumo Comparativo

| Feature | Browser | Node.js |
|---------|---------|---------|
| **Event Loop** | Foco em UI/rendering | Fases libuv (timers, poll, check) |
| **Macrotasks** | Uma por ciclo | Todas de uma fase por ciclo |
| **setImmediate** | ❌ Não existe | ✅ Fase check |
| **process.nextTick** | ❌ Não existe | ✅ Prioridade máxima |
| **rAF** | ✅ Sincroniza frames | ❌ Não existe |
| **Rendering** | ✅ Integrado | ❌ Sem UI |
| **I/O** | Web APIs (fetch, etc) | libuv (fs, net) |

Compreender essas diferenças é crucial para escrever código portável e evitar surpresas ao migrar entre ambientes ou usar bibliotecas universais (isomorphic code).
