# Memory Leaks: Análise Conceitual

## 🎯 Definição

**Memory Leak** (vazamento de memória) ocorre quando um programa mantém referências a objetos que não são mais necessários, impedindo que o garbage collector os libere. Isso resulta em consumo crescente de memória que pode degradar performance e eventualmente causar crashes.

```javascript
// ❌ Memory leak: variável global cresce indefinidamente
let cache = [];

function processar(dados) {
  cache.push(dados); // Nunca limpa
  // ...
}

// A cada chamada, cache cresce e nunca é liberado
```

**Conceito:** Acúmulo não intencional de memória devido a referências persistentes desnecessárias.

## 📋 Causas Comuns

### 1. Variáveis Globais Acidentais

```javascript
// ❌ Leak: sem var/let/const cria global
function processar() {
  dados = { grande: new Array(1000000) }; // Global acidental
}

// ✅ Correto
function processar() {
  const dados = { grande: new Array(1000000) };
}
```

### 2. Event Listeners Não Removidos

```javascript
// ❌ Leak: listener nunca removido
const elemento = document.getElementById('botao');

elemento.addEventListener('click', function handler() {
  console.log('Clicou');
  // Elemento não pode ser coletado enquanto listener existir
});

// ✅ Correto: remover quando não necessário
const handler = () => console.log('Clicou');
elemento.addEventListener('click', handler);

// Cleanup
elemento.removeEventListener('click', handler);
```

### 3. Timers Não Cancelados

```javascript
// ❌ Leak: setInterval continua para sempre
function iniciar() {
  const dados = { grande: new Array(1000000) };

  setInterval(() => {
    console.log(dados); // dados nunca liberado
  }, 1000);
}

// ✅ Correto: cancelar quando não necessário
function iniciar() {
  const dados = { grande: new Array(1000000) };

  const intervalo = setInterval(() => {
    console.log(dados);
  }, 1000);

  return () => clearInterval(intervalo); // Retorna cleanup
}
```

### 4. Closures Retendo Contexto

```javascript
// ❌ Leak: closure mantém referência grande
function criarProcessador() {
  const dadosGrandes = new Array(1000000).fill('dado');

  return function processar(id) {
    // Closure mantém dadosGrandes em memória
    return `Processando ${id}`;
  };
}

// ✅ Correto: não referenciar se não usar
function criarProcessador() {
  // Não declarar dadosGrandes se não vai usar

  return function processar(id) {
    return `Processando ${id}`;
  };
}
```

### 5. Referências Circulares (Menos comum em JS moderno)

```javascript
// ❌ Potencial leak (engines antigas)
function criarCiclo() {
  const obj1 = {};
  const obj2 = {};

  obj1.ref = obj2;
  obj2.ref = obj1; // Ciclo

  // Engines modernas lidam bem, mas pode ser problema em DOM
}

// ✅ Quebrar ciclos explicitamente
function criarCiclo() {
  const obj1 = {};
  const obj2 = {};

  obj1.ref = obj2;
  obj2.ref = obj1;

  return () => {
    obj1.ref = null; // Quebrar ciclo
    obj2.ref = null;
  };
}
```

### 6. Cache Sem Limite

```javascript
// ❌ Leak: cache cresce infinitamente
const cache = {};

function obterDados(chave) {
  if (!(chave in cache)) {
    cache[chave] = buscarDados(chave);
  }
  return cache[chave];
}

// ✅ Correto: usar LRU cache ou WeakMap
class LRUCache {
  constructor(limite) {
    this.limite = limite;
    this.cache = new Map();
  }

  get(chave) {
    if (!this.cache.has(chave)) return null;

    const valor = this.cache.get(chave);
    this.cache.delete(chave);
    this.cache.set(chave, valor); // Move para fim
    return valor;
  }

  set(chave, valor) {
    if (this.cache.has(chave)) {
      this.cache.delete(chave);
    } else if (this.cache.size >= this.limite) {
      const primeirChave = this.cache.keys().next().value;
      this.cache.delete(primeirChave);
    }
    this.cache.set(chave, valor);
  }
}
```

### 7. Detached DOM Nodes

```javascript
// ❌ Leak: referência mantém DOM desanexado
let elemento = document.getElementById('temp');
const parent = elemento.parentNode;

parent.removeChild(elemento);
// elemento ainda em memória (referência existe)

// ✅ Correto: limpar referências
let elemento = document.getElementById('temp');
const parent = elemento.parentNode;

parent.removeChild(elemento);
elemento = null; // Liberar referência
```

## 🔍 Detectando Memory Leaks

### Chrome DevTools - Memory Profiler

```javascript
// Tirar heap snapshot antes
console.profile('Antes');

// Executar código suspeito
for (let i = 0; i < 1000; i++) {
  funcaoSuspeita();
}

// Tirar heap snapshot depois
console.profileEnd('Antes');

// Comparar snapshots para ver crescimento
```

### Performance.memory (Chrome)

```javascript
function monitorarMemoria() {
  if (performance.memory) {
    const usado = performance.memory.usedJSHeapSize;
    const total = performance.memory.totalJSHeapSize;
    const limite = performance.memory.jsHeapSizeLimit;

    console.log(`Usado: ${(usado / 1048576).toFixed(2)} MB`);
    console.log(`Total: ${(total / 1048576).toFixed(2)} MB`);
    console.log(`Limite: ${(limite / 1048576).toFixed(2)} MB`);
  }
}

setInterval(monitorarMemoria, 5000);
```

## ⚠️ Prevenção

### 1. WeakMap/WeakSet para Dados Temporários

```javascript
// ✅ WeakMap permite GC de chaves
const metadados = new WeakMap();

function associarMetadados(obj, meta) {
  metadados.set(obj, meta);
  // Quando obj não tem mais referências, entry é coletado
}
```

### 2. Cleanup em Componentes

```javascript
class Componente {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    this.intervalo = null;
  }

  montar() {
    document.addEventListener('click', this.handleClick);
    this.intervalo = setInterval(() => {}, 1000);
  }

  desmontar() {
    // Cleanup essencial
    document.removeEventListener('click', this.handleClick);
    clearInterval(this.intervalo);
    this.intervalo = null;
  }
}
```

### 3. Nullificar Referências Grandes

```javascript
function processar() {
  let dadosGrandes = new Array(1000000);

  // ... usar dados

  dadosGrandes = null; // Liberar explicitamente
}
```

### 4. Usar AbortController

```javascript
// ✅ Cancelamento limpo de fetch
const controller = new AbortController();

fetch('/api/dados', { signal: controller.signal })
  .then(resposta => resposta.json());

// Cleanup
controller.abort();
```

## 🚀 Boas Práticas

- ✅ Sempre remover event listeners ao destruir componentes
- ✅ Cancelar timers (setTimeout/setInterval) quando não necessários
- ✅ Usar WeakMap/WeakSet para associações temporárias
- ✅ Limitar tamanho de caches
- ✅ Nullificar referências grandes após uso
- ✅ Testar com heap snapshots regularmente
- ✅ Implementar métodos cleanup/dispose em classes

Memory leaks são bugs insidiosos que degradam performance gradualmente. Compreender suas causas e usar padrões de cleanup apropriados é essencial para aplicações JavaScript robustas e de longa duração.
