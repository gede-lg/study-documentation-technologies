# Garbage Collection: Análise Conceitual

## 🎯 Definição

**Garbage Collection** (coleta de lixo) é o processo automático de gerenciamento de memória em JavaScript que identifica e libera objetos que não são mais acessíveis pelo programa, recuperando memória para reutilização. Diferente de linguagens como C/C++, JavaScript gerencia memória automaticamente.

```javascript
function criar() {
  const obj = { dados: new Array(1000000) }; // Aloca memória
  return obj;
}

let referencia = criar(); // obj tem referência
referencia = null;         // obj não tem mais referências
// GC pode coletar obj automaticamente
```

**Conceito:** Liberação automática de memória não mais acessível.

## 📋 Algoritmos de GC

### Mark-and-Sweep (Principal)

Algoritmo usado por V8 (Chrome/Node.js) e SpiderMonkey (Firefox).

**Fases:**
1. **Mark (Marcar):** Começando das raízes (globals, stack), marca todos objetos acessíveis
2. **Sweep (Varrer):** Libera objetos não marcados

```javascript
// Raízes GC:
// - Variáveis globais
// - Variáveis na call stack
// - Closures ativos

let global = { dados: 'A' };        // Raiz (global)

function processar() {
  let local = { dados: 'B' };       // Raiz (stack)
  let isolado = { dados: 'C' };

  global.ref = local; // 'local' alcançável via global
  // 'isolado' só alcançável via stack local

  return () => {
    console.log(local); // Closure mantém 'local' vivo
    // 'isolado' não é referenciado, será coletado
  };
}

const closure = processar();
// 'local' ainda vivo (referenciado por closure)
// 'isolado' coletado (não mais acessível)
```

### Generational GC (Geracional)

Objetos são categorizados por "geração":

- **Young Generation:** Objetos novos (maioria morre rápido)
- **Old Generation:** Objetos que sobreviveram múltiplas coletas

```javascript
// Young gen: alocações rápidas, coletas frequentes
function temporario() {
  const temp = { dados: [1, 2, 3] };
  return temp.dados.length;
}
// 'temp' morre imediatamente após função

// Old gen: objetos duradouros
const configuracao = { api: 'https://api.com' };
// Sobrevive por toda aplicação
```

### Incremental GC

GC executa em pequenos incrementos para evitar pausas longas:

```javascript
// Ao invés de pausar 100ms de uma vez:
// Pausa 10ms, executa código, pausa 10ms, etc.

// Minimiza impacto na UI
```

## 🧠 Alcançabilidade (Reachability)

Objeto é **alcançável** se existe caminho de referências das raízes até ele.

```javascript
const raiz = {
  obj1: { valor: 'A' },
  obj2: { valor: 'B' }
};

raiz.obj1.ref = raiz.obj2; // obj2 alcançável via obj1

delete raiz.obj2; // Ainda alcançável via obj1.ref

raiz.obj1 = null;
// Agora obj1 e obj2 não são alcançáveis → coletados
```

### Ciclos São Coletados

```javascript
function criarCiclo() {
  const obj1 = { nome: 'A' };
  const obj2 = { nome: 'B' };

  obj1.ref = obj2;
  obj2.ref = obj1; // Ciclo

  return obj1;
}

let ciclo = criarCiclo();
ciclo = null;

// Mesmo com ciclo, obj1 e obj2 não são alcançáveis
// Mark-and-sweep coleta ambos
```

## 🔍 Como GC Funciona (V8)

### Minor GC (Scavenge)

Coleta young generation frequentemente (ms):

```javascript
// Muitas alocações temporárias
for (let i = 0; i < 1000; i++) {
  const temp = { id: i, dados: [1, 2, 3] };
  processar(temp);
  // temp coletado imediatamente
}
```

### Major GC (Mark-Sweep-Compact)

Coleta old generation ocasionalmente (10-100ms):

```javascript
// Objetos duradouros
const cache = new Map();

for (let i = 0; i < 10000; i++) {
  cache.set(i, { dados: i });
}
// Cache permanece em old generation
```

## ⚠️ Quando GC Executa

GC é **não-determinístico**: você não controla quando executa.

```javascript
let obj = { dados: new Array(1000000) };
obj = null;

// GC pode executar:
// - Imediatamente
// - Em alguns milissegundos
// - Em alguns segundos
// - Quando memória ficar escassa

// ❌ Não há como forçar GC em produção
// (apenas para debug: --expose-gc no Node.js)
```

## 🚀 Otimizações

### 1. Object Pooling

```javascript
// Reutilizar objetos ao invés de criar/destruir
class ObjectPool {
  constructor(factory) {
    this.factory = factory;
    this.pool = [];
  }

  acquire() {
    return this.pool.pop() || this.factory();
  }

  release(obj) {
    this.pool.push(obj);
  }
}

const vetorPool = new ObjectPool(() => []);

function processar() {
  const vetor = vetorPool.acquire();
  // ... usar vetor
  vetor.length = 0; // Limpar
  vetorPool.release(vetor); // Devolver
}
```

### 2. Evitar Alocações em Hot Paths

```javascript
// ❌ Aloca objeto a cada frame (60 FPS = 60 objs/s)
function animar() {
  const posicao = { x: 0, y: 0 };
  renderizar(posicao);
  requestAnimationFrame(animar);
}

// ✅ Reutilizar objeto
const posicao = { x: 0, y: 0 };

function animar() {
  posicao.x += velocidade.x;
  posicao.y += velocidade.y;
  renderizar(posicao);
  requestAnimationFrame(animar);
}
```

### 3. WeakMap/WeakSet

```javascript
// ✅ Permite GC de chaves
const metadados = new WeakMap();

function associar(obj, meta) {
  metadados.set(obj, meta);
}

let elemento = document.getElementById('item');
associar(elemento, { timestamp: Date.now() });

elemento.remove();
elemento = null;
// Entry em metadados pode ser coletado
```

### 4. Limpar Referências Grandes

```javascript
function processar() {
  let dadosGrandes = carregarDados(); // 100MB

  const resultado = analisar(dadosGrandes);

  dadosGrandes = null; // Ajuda GC

  return resultado;
}
```

## 📊 Monitorar GC

### Node.js

```javascript
// --trace-gc flag
// node --trace-gc app.js

// Mostra:
// [GC] Scavenge 2.1 (5.0) -> 1.9 (6.0) MB, 0.5 ms
// [GC] Mark-sweep 10.2 (15.0) -> 8.1 (12.0) MB, 12.3 ms
```

### Chrome DevTools

```javascript
// Performance tab → Memory checkbox
// Visualizar GC events timeline
// Ver heap size ao longo do tempo
```

### Performance.measureUserAgentSpecificMemory()

```javascript
async function medirMemoria() {
  if (performance.measureUserAgentSpecificMemory) {
    const resultado = await performance.measureUserAgentSpecificMemory();
    console.log(resultado.bytes); // Uso de memória
  }
}
```

## 🔗 Relação com Performance

GC pode causar **pausas** (stop-the-world):

```javascript
// Minor GC: 1-5ms (imperceptível)
// Major GC: 10-100ms (pode causar jank)

// Em jogos/animações 60 FPS:
// Budget: 16.67ms/frame
// GC de 20ms = frame perdido

// Minimizar alocações em hot paths
```

Garbage Collection é fundamental para JavaScript, libertando desenvolvedores de gerenciamento manual de memória. Compreender seu funcionamento permite escrever código mais eficiente que colabora com GC ao invés de lutar contra ele.
