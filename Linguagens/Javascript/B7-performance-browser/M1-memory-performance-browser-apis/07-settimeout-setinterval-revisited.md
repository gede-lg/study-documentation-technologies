# setTimeout e setInterval: Análise Avançada

## 🎯 Definição

**setTimeout** e **setInterval** são APIs de temporização que agendam execução de código após um delay (setTimeout) ou repetidamente em intervalos (setInterval). Apesar de parecerem simples, possuem nuances sutis relacionadas a precisão, throttling, event loop e gestão de recursos que são essenciais para uso avançado.

```javascript
// setTimeout: executa uma vez após delay
const timeoutId = setTimeout(() => {
  console.log('Executou após 1 segundo');
}, 1000);

// setInterval: executa repetidamente
const intervalId = setInterval(() => {
  console.log('Executa a cada 1 segundo');
}, 1000);

// Cancelamento
clearTimeout(timeoutId);
clearInterval(intervalId);
```

**Conceito:** Agendamento de código com delays, com comportamento não-trivial no Event Loop.

## 📋 Funcionamento Interno

### setTimeout: Delay Mínimo

```javascript
// ❌ Misconception: setTimeout(fn, 0) executa imediatamente
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');

// Saída: 1, 3, 2
// setTimeout agenda macrotask, não executa síncronamente
```

### Delay Real vs Especificado

```javascript
const inicio = performance.now();

setTimeout(() => {
  const real = performance.now() - inicio;
  console.log(`Especificado: 100ms, Real: ${real.toFixed(2)}ms`);
}, 100);

// Pode ser: 100.23ms, 101.45ms, 105.89ms
// Nunca menos que especificado, mas pode ser mais
```

### setInterval: Drift Problem

```javascript
// ❌ setInterval não garante tempo exato entre execuções
let contador = 0;
const inicio = performance.now();

const intervalo = setInterval(() => {
  const agora = performance.now();
  const esperado = (contador + 1) * 1000;
  const real = agora - inicio;
  const drift = real - esperado;

  console.log(`Execução ${++contador}: drift = ${drift.toFixed(2)}ms`);
}, 1000);

// Drift acumula ao longo do tempo:
// Execução 1: drift = 0.23ms
// Execução 2: drift = 1.47ms
// Execução 3: drift = 3.89ms
// ...
```

## 🧠 Nuances Avançadas

### Throttling em Background (Browser)

```javascript
// Browser: tabs em background são throttled (delay mínimo de 1s)
setInterval(() => {
  console.log('Tick'); // Pode não executar a cada 100ms em background
}, 100);

// Em background: pode executar a cada ~1000ms
// Em foreground: ~100ms
```

### Nested setTimeout Throttling

```javascript
// Browsers aplicam delay mínimo de 4ms após 5 níveis de nesting
function aninhado(nivel = 0) {
  console.log(`Nível ${nivel}: ${performance.now().toFixed(2)}ms`);

  if (nivel < 10) {
    setTimeout(() => aninhado(nivel + 1), 0);
  }
}

aninhado();

// Níveis 0-4: ~0ms entre cada
// Níveis 5+: ~4ms entre cada (throttling HTML5)
```

### setInterval não Espera Callback

```javascript
// ❌ Problema: setInterval pode enfileirar múltiplas execuções
setInterval(() => {
  // Se esta função demorar 1500ms
  processamentoLento(); // 1500ms
}, 1000);

// Intervalos enfileiram:
// t=0ms: execução 1 inicia
// t=1000ms: execução 2 enfileira (espera execução 1)
// t=1500ms: execução 1 termina, execução 2 inicia imediatamente
// t=2000ms: execução 3 enfileira
// ...
```

## 🔍 Padrões Avançados

### setTimeout Recursivo (Substituindo setInterval)

```javascript
// ✅ setTimeout recursivo garante tempo entre execuções
function executarComIntervalo() {
  processamento(); // Demora quanto for

  setTimeout(executarComIntervalo, 1000);
  // Próxima execução sempre 1s APÓS término da anterior
}

executarComIntervalo();

// vs setInterval: próxima execução 1s após INÍCIO da anterior
```

### Cancelamento Automático

```javascript
function executarComLimite(fn, intervalo, limite) {
  let contador = 0;

  const id = setInterval(() => {
    fn();

    if (++contador >= limite) {
      clearInterval(id);
    }
  }, intervalo);

  return id;
}

executarComLimite(() => console.log('Tick'), 1000, 5);
// Executa 5 vezes e para automaticamente
```

### Delay Dinâmico

```javascript
function executarComBackoff(fn, delayInicial = 1000, fator = 2, max = 10000) {
  let delay = delayInicial;

  function executar() {
    fn();

    delay = Math.min(delay * fator, max);
    setTimeout(executar, delay);
  }

  executar();
}

// Exponential backoff
executarComBackoff(() => console.log('Tick'));
// Executa: 1s, 2s, 4s, 8s, 10s, 10s, 10s...
```

### Timeout com Promise

```javascript
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processar() {
  console.log('Início');
  await sleep(1000);
  console.log('1 segundo depois');
  await sleep(2000);
  console.log('3 segundos depois (total)');
}
```

### Race com Timeout

```javascript
function comTimeout(promessa, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });

  return Promise.race([promessa, timeout]);
}

// Uso
try {
  const dados = await comTimeout(fetch('/api/dados'), 5000);
  console.log('Dados recebidos');
} catch (erro) {
  console.log('Timeout ou erro na requisição');
}
```

### Debounce

```javascript
function debounce(fn, delay) {
  let timeoutId = null;

  return function(...args) {
    // Cancelar timeout anterior
    clearTimeout(timeoutId);

    // Agendar nova execução
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Uso: executar após usuário parar de digitar
const salvarAutomatico = debounce(() => {
  console.log('Salvando...');
}, 500);

input.addEventListener('input', salvarAutomatico);
// Só salva 500ms APÓS última digitação
```

### Throttle

```javascript
function throttle(fn, limite) {
  let executando = false;

  return function(...args) {
    if (!executando) {
      fn.apply(this, args);
      executando = true;

      setTimeout(() => {
        executando = false;
      }, limite);
    }
  };
}

// Uso: limitar scroll handler
const handleScroll = throttle(() => {
  console.log('Scroll detectado');
}, 200);

window.addEventListener('scroll', handleScroll);
// Executa no máximo a cada 200ms
```

### Animação com setTimeout

```javascript
// ❌ setTimeout não é ideal para animações
function animarComTimeout() {
  elemento.style.left = parseInt(elemento.style.left || 0) + 1 + 'px';

  if (parseInt(elemento.style.left) < 500) {
    setTimeout(animarComTimeout, 16); // ~60 FPS
  }
}

// ✅ Preferir requestAnimationFrame (browser)
function animarComRAF() {
  elemento.style.left = parseInt(elemento.style.left || 0) + 1 + 'px';

  if (parseInt(elemento.style.left) < 500) {
    requestAnimationFrame(animarComRAF);
  }
}
```

## ⚠️ Armadilhas e Considerações

### 1. Closure e Loop

```javascript
// ❌ Problema clássico
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Saída: 3, 3, 3 (i é compartilhado)

// ✅ Solução 1: let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 1000);
}
// Saída: 0, 1, 2

// ✅ Solução 2: IIFE
for (var i = 0; i < 3; i++) {
  (function(valor) {
    setTimeout(() => console.log(valor), 1000);
  })(i);
}
```

### 2. Precisão Limitada

```javascript
// setTimeout não garante execução exata
const inicio = performance.now();
const delays = [];

for (let i = 0; i < 100; i++) {
  setTimeout(() => {
    delays.push(performance.now() - inicio - 100);
  }, 100);
}

// Delays variam: alguns 100.2ms, outros 105.8ms, etc.
// Nunca use setTimeout para timing crítico
```

### 3. Memory Leaks com Timers

```javascript
// ❌ Leak: timer nunca cancelado
function iniciar() {
  const dados = { grande: new Array(1000000) };

  setInterval(() => {
    console.log(dados.length); // dados nunca liberado
  }, 1000);
}

// ✅ Sempre retornar cleanup
function iniciar() {
  const dados = { grande: new Array(1000000) };

  const id = setInterval(() => {
    console.log(dados.length);
  }, 1000);

  return () => clearInterval(id);
}
```

### 4. setInterval Skipping

```javascript
// Browsers podem pular execuções se callback demorar muito
let executacoes = 0;

setInterval(() => {
  console.log(`Execução ${++executacoes}`);

  // Simular processamento lento
  const fim = Date.now() + 500;
  while (Date.now() < fim) {}
}, 100);

// Algumas execuções podem ser puladas
// Não é garantido: 1, 2, 3, 4, 5...
// Pode ser: 1, 2, 4, 6, 8... (pula ímpares)
```

### 5. this Context

```javascript
const obj = {
  valor: 42,

  metodo() {
    console.log(this.valor);
  },

  iniciar() {
    // ❌ this é undefined (ou window) no callback
    setTimeout(this.metodo, 1000);

    // ✅ Bind explícito
    setTimeout(this.metodo.bind(this), 1000);

    // ✅ Arrow function
    setTimeout(() => this.metodo(), 1000);
  }
};
```

## 🚀 Boas Práticas

1. **Use setTimeout recursivo** ao invés de setInterval quando precisar garantir tempo entre execuções
2. **Sempre cancele timers** ao destruir componentes/objetos
3. **Prefira requestAnimationFrame** para animações em browsers
4. **Não confie em precisão** de setTimeout/setInterval para timing crítico
5. **Use debounce/throttle** para otimizar eventos frequentes (scroll, resize, input)
6. **Considere Web Workers** para processamento intensivo que não bloqueie UI

setTimeout e setInterval são fundamentais mas sutis: compreender suas nuances permite usá-los efetivamente e evitar bugs comuns de timing, performance e gerenciamento de recursos.
