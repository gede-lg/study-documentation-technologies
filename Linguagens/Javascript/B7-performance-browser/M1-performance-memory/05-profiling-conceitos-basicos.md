# Profiling: Conceitos Básicos

## 🎯 Definição

**Profiling** (perfilamento) é o processo de análise de performance de uma aplicação para identificar gargalos, consumo de recursos (CPU, memória, rede) e comportamento de execução. Através de ferramentas de profiling, desenvolvedores visualizam onde o tempo é gasto e onde otimizações terão maior impacto.

```javascript
// Profiling manual simples
console.profile('Processamento');

for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}

console.profileEnd('Processamento');
// Gera relatório no DevTools
```

**Conceito:** Análise sistemática de performance para identificação de bottlenecks.

## 📋 Tipos de Profiling

### CPU Profiling

Analisa quanto tempo CPU gasta em cada função:

```javascript
// Identificar funções lentas
function processar() {
  lenta();      // 80% do tempo
  rapida();     // 5% do tempo
  media();      // 15% do tempo
}

// CPU profiler revela que lenta() é o gargalo
```

### Memory Profiling

Analisa alocação e uso de memória:

```javascript
// Heap snapshots mostram:
// - Objetos em memória
// - Tamanho de cada objeto
// - Referências entre objetos
// - Memory leaks

const dados = new Array(1000000); // 8MB
// Snapshot mostra este array e suas referências
```

### Allocation Profiling

Rastreia alocações de memória ao longo do tempo:

```javascript
// Identificar alocações excessivas
function processarLote() {
  for (let i = 0; i < 10000; i++) {
    const temp = { id: i, dados: [1, 2, 3] }; // Alocação a cada iteração
    processar(temp);
  }
}

// Allocation profiler revela 10,000 objetos criados
```

## 🧠 Métricas Principais

### Call Stack (Pilha de Chamadas)

```javascript
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Call stack: main → a → b → c
  console.trace(); // Mostra stack
}
```

### Self Time vs Total Time

```javascript
function pai() {
  // Self time: 10ms (tempo próprio da função)
  trabalho(); // 5ms

  filho(); // Total time filho: 100ms

  trabalho(); // 5ms
  // Total time pai: 120ms (self + filhos)
}

// Self time: tempo gasto na função excluindo chamadas
// Total time: tempo total incluindo chamadas
```

### Flame Graph

Visualização hierárquica do tempo:

```
main                 [===================] 200ms
  ├─ processar       [============]       120ms
  │   ├─ validar     [===]                 30ms
  │   └─ calcular    [=========]           90ms
  └─ renderizar      [=======]             80ms
```

## 🔍 Ferramentas de Profiling

### Chrome DevTools

```javascript
// Performance tab:
// 1. Clicar em Record
// 2. Executar código
// 3. Parar recording
// 4. Analisar timeline

function exemplo() {
  const inicio = performance.now();

  // Código a medir
  for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
  }

  console.log(`Tempo: ${performance.now() - inicio}ms`);
}
```

### console.profile()

```javascript
console.profile('Minha Operação');

// Código a perfilar
processarDados();
analisarResultados();

console.profileEnd('Minha Operação');

// Resultado aparece em Profiler tab do DevTools
```

### Performance Marks e Measures

```javascript
// Marks: pontos de tempo
performance.mark('inicio-fetch');

await fetch('/api/dados');

performance.mark('fim-fetch');

// Measure: duração entre marks
performance.measure('fetch-duration', 'inicio-fetch', 'fim-fetch');

// Obter medidas
const medidas = performance.getEntriesByType('measure');
console.log(medidas[0].duration); // ms entre marks
```

### Node.js Profiling

```bash
# CPU profiling
node --prof app.js
# Gera isolate-*-v8.log

# Processar log
node --prof-process isolate-*-v8.log > profile.txt
```

```javascript
// Programático
const { Session } = require('inspector');
const session = new Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Código a perfilar
    processar();

    session.post('Profiler.stop', (err, { profile }) => {
      console.log(JSON.stringify(profile));
    });
  });
});
```

## ⚠️ Interpretando Resultados

### Identificar Hot Spots

```javascript
// Função chamada 100,000 vezes
function pequena() {
  return Math.sqrt(Math.random()); // 0.001ms cada
}

// Total: 100ms (100,000 × 0.001)
// Hot spot: otimizar esta função tem maior impacto
```

### Self Time Alto

```javascript
function processarTexto(texto) {
  // Self time alto: função faz muito trabalho próprio
  let resultado = '';
  for (let i = 0; i < texto.length; i++) {
    resultado += texto[i].toUpperCase(); // Concatenação lenta
  }
  return resultado;
}

// Otimização: usar array
function processarTextoOtimizado(texto) {
  return Array.from(texto).map(c => c.toUpperCase()).join('');
}
```

### Total Time Alto, Self Time Baixo

```javascript
function orquestrador() {
  // Self time: 1ms (pouco trabalho próprio)
  operacaoLenta1(); // 50ms
  operacaoLenta2(); // 50ms
  operacaoLenta3(); // 50ms
  // Total time: 151ms
}

// Gargalo está nas operações chamadas, não no orquestrador
```

## 🚀 Casos Práticos

### Otimizar Loop Baseado em Profile

```javascript
// ❌ Versão original (identificada por profiler)
function processar(items) {
  // Self time: 200ms
  for (let i = 0; i < items.length; i++) {
    document.getElementById('result').innerHTML += items[i];
    // DOM access + concatenação em cada iteração
  }
}

// ✅ Versão otimizada
function processar(items) {
  // Self time: 20ms
  const html = items.join('');
  document.getElementById('result').innerHTML = html;
  // DOM access uma vez, concatenação eficiente
}
```

### Identificar Memory Leak com Heap Snapshots

```javascript
// 1. Tirar snapshot inicial
// 2. Executar operação
let cache = [];

function adicionar() {
  cache.push({ dados: new Array(10000) });
}

for (let i = 0; i < 1000; i++) {
  adicionar();
}

// 3. Tirar snapshot final
// 4. Comparar: ver crescimento de 'cache'
// 5. Identificar que cache nunca é limpo
```

### Medir Impact de Otimização

```javascript
// Antes
performance.mark('inicio-v1');
funcaoOriginal();
performance.mark('fim-v1');
performance.measure('v1', 'inicio-v1', 'fim-v1');

// Depois
performance.mark('inicio-v2');
funcaoOtimizada();
performance.mark('fim-v2');
performance.measure('v2', 'inicio-v2', 'fim-v2');

// Comparar
const v1 = performance.getEntriesByName('v1')[0].duration;
const v2 = performance.getEntriesByName('v2')[0].duration;
console.log(`Melhoria: ${((v1 - v2) / v1 * 100).toFixed(2)}%`);
```

### Profiling de Rendering (Browser)

```javascript
function animar() {
  // Performance tab mostra:
  // - Tempo em JavaScript
  // - Tempo em Recalculate Style
  // - Tempo em Layout
  // - Tempo em Paint
  // - Tempo em Composite

  elemento.style.width = Math.random() * 100 + 'px'; // Causa layout
  requestAnimationFrame(animar);
}

// Profiler revela layout thrashing
```

## 🔗 Performance API Integration

```javascript
// User Timing API completo
class Profiler {
  static iniciar(nome) {
    performance.mark(`${nome}-inicio`);
  }

  static finalizar(nome) {
    performance.mark(`${nome}-fim`);
    performance.measure(nome, `${nome}-inicio`, `${nome}-fim`);

    const medida = performance.getEntriesByName(nome)[0];
    console.log(`${nome}: ${medida.duration.toFixed(2)}ms`);
  }

  static limpar() {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Uso
Profiler.iniciar('processamento');
processar();
Profiler.finalizar('processamento');
// 'processamento: 45.67ms'
```

## 📊 Boas Práticas

1. **Profile em produção-like**: Use builds de produção (minified, optimized)
2. **Amostragem significativa**: Execute múltiplas vezes para média
3. **Isolamento**: Profile uma operação por vez
4. **Baselines**: Compare com medições anteriores
5. **Foco no impacto**: Otimize hot spots, não detalhes irrelevantes
6. **Measure first**: Sempre perfilar antes de otimizar (evitar otimizações prematuras)

Profiling é a base de qualquer otimização eficaz: permite decisões baseadas em dados ao invés de intuição, identificando exatamente onde esforços de otimização terão maior retorno.
