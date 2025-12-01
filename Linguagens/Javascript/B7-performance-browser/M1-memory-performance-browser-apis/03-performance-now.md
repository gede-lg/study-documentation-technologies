# Performance.now(): Análise Conceitual

## 🎯 Definição

**Performance.now()** retorna um timestamp de alta resolução em milissegundos, representando o tempo decorrido desde o início da navegação (ou processo em Node.js). Oferece precisão de microssegundos (0.001ms) e é monótono (nunca volta atrás).

```javascript
const inicio = performance.now();

// Código a medir
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}

const fim = performance.now();
console.log(`Tempo: ${fim - inicio}ms`);
// Tempo: 3.4567ms
```

**Conceito:** Timer de alta precisão para medição de performance.

## 📋 Características

### Alta Resolução

```javascript
// Date.now(): precisão de ~1ms
console.log(Date.now()); // 1700000000000

// performance.now(): precisão de ~0.001ms (microssegundos)
console.log(performance.now()); // 123456.789012
```

### Monótono (Não Retroativo)

```javascript
// Date.now() pode voltar atrás (ajuste de relógio)
const d1 = Date.now();
// [usuário ajusta relógio do sistema]
const d2 = Date.now();
// d2 pode ser < d1 (!)

// performance.now() NUNCA volta atrás
const p1 = performance.now();
// [ajuste de relógio]
const p2 = performance.now();
// p2 sempre >= p1 (garantido)
```

### Origem de Tempo

```javascript
// Browser: tempo desde navigation start
console.log(performance.now()); // 1234.5 (ms desde página carregou)

// Node.js: tempo desde process start
console.log(performance.now()); // 5678.9 (ms desde node iniciou)
```

## 🔍 Casos de Uso

### Benchmarking

```javascript
function benchmark(funcao, iteracoes = 1000) {
  const inicio = performance.now();

  for (let i = 0; i < iteracoes; i++) {
    funcao();
  }

  const fim = performance.now();
  const total = fim - inicio;
  const media = total / iteracoes;

  return {
    total: total.toFixed(2) + 'ms',
    media: media.toFixed(4) + 'ms',
    iteracoes
  };
}

const resultado = benchmark(() => {
  [1, 2, 3].map(x => x * 2);
});

console.log(resultado);
// { total: '2.45ms', media: '0.0025ms', iteracoes: 1000 }
```

### Timeout Preciso

```javascript
function esperarPreciso(ms) {
  return new Promise(resolve => {
    const inicio = performance.now();

    function verificar() {
      if (performance.now() - inicio >= ms) {
        resolve();
      } else {
        requestAnimationFrame(verificar);
      }
    }

    verificar();
  });
}

// Mais preciso que setTimeout
await esperarPreciso(16.67); // Exatamente 1 frame a 60 FPS
```

### Medir FPS

```javascript
class FPSMeter {
  constructor() {
    this.frames = [];
    this.ultimoTempo = performance.now();
  }

  tick() {
    const agora = performance.now();
    const delta = agora - this.ultimoTempo;
    this.ultimoTempo = agora;

    this.frames.push(delta);
    if (this.frames.length > 60) {
      this.frames.shift();
    }
  }

  getFPS() {
    const media = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    return Math.round(1000 / media);
  }
}

const fps = new FPSMeter();

function animar() {
  fps.tick();
  console.log(`FPS: ${fps.getFPS()}`);
  requestAnimationFrame(animar);
}
```

### Cache com TTL

```javascript
class CacheComTTL {
  constructor(ttl = 5000) {
    this.ttl = ttl;
    this.cache = new Map();
  }

  set(chave, valor) {
    this.cache.set(chave, {
      valor,
      timestamp: performance.now()
    });
  }

  get(chave) {
    const entrada = this.cache.get(chave);
    if (!entrada) return null;

    const idade = performance.now() - entrada.timestamp;
    if (idade > this.ttl) {
      this.cache.delete(chave);
      return null;
    }

    return entrada.valor;
  }
}
```

## ⚠️ vs Date.now()

| Feature | performance.now() | Date.now() |
|---------|-------------------|------------|
| Resolução | Microssegundos (~0.001ms) | Milissegundos (~1ms) |
| Monótono | Sim (nunca retroage) | Não (pode retroagir) |
| Origem | Navigation/process start | Unix epoch (1970) |
| Uso | Medições de performance | Timestamps absolutos |

```javascript
// ✅ Usar performance.now() para duração
const inicio = performance.now();
processar();
console.log(performance.now() - inicio);

// ✅ Usar Date.now() para timestamp absoluto
const agora = Date.now();
salvarEvento({ timestamp: agora });
```

## 🚀 Performance API

performance.now() faz parte da Performance API maior:

```javascript
// Marks personalizados
performance.mark('inicio-processamento');
processar();
performance.mark('fim-processamento');

// Medir entre marks
performance.measure(
  'processamento',
  'inicio-processamento',
  'fim-processamento'
);

// Obter medições
const medidas = performance.getEntriesByName('processamento');
console.log(medidas[0].duration);
```

performance.now() é a ferramenta essencial para medições precisas de tempo em JavaScript, oferecendo resolução e confiabilidade impossíveis com Date.now().
