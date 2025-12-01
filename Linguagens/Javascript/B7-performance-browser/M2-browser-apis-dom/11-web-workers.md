# Web Workers: Processamento em Background

## 🎯 Definição

**Web Workers** são threads JavaScript executando em background, separados da thread principal (UI), permitindo processamento intensivo sem bloquear a interface. Workers não têm acesso ao DOM, window ou document, mas podem realizar cálculos, processar dados, fazer requisições de rede e comunicar com a thread principal via mensagens.

```javascript
// main.js (thread principal)
const worker = new Worker('worker.js');

worker.postMessage({ tipo: 'calcular', valor: 1000000 });

worker.onmessage = e => {
  console.log('Resultado do worker:', e.data);
};

// worker.js (worker thread)
self.onmessage = e => {
  if (e.data.tipo === 'calcular') {
    const resultado = processamentoPesado(e.data.valor);
    self.postMessage(resultado);
  }
};
```

**Conceito:** Threads paralelas para processamento em background sem bloquear UI.

## 📋 Tipos de Workers

### Dedicated Worker

Worker dedicado a uma única página/script:

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage('Olá Worker');

worker.onmessage = e => {
  console.log('Resposta:', e.data);
};

worker.onerror = e => {
  console.error('Erro no worker:', e.message);
};

// worker.js
self.onmessage = e => {
  console.log('Recebeu:', e.data);
  self.postMessage('Olá Main Thread');
};
```

### Shared Worker

Worker compartilhado entre múltiplas páginas/scripts:

```javascript
// main.js (Página 1 e Página 2)
const worker = new SharedWorker('shared-worker.js');

worker.port.postMessage('Mensagem');

worker.port.onmessage = e => {
  console.log('Resposta:', e.data);
};

// shared-worker.js
self.onconnect = e => {
  const port = e.ports[0];

  port.onmessage = event => {
    console.log('Mensagem de página:', event.data);
    port.postMessage('Resposta compartilhada');
  };

  port.start();
};
```

### Service Worker

Worker especializado para PWAs (intercepta requisições de rede, cache):

```javascript
// Registrar service worker
navigator.serviceWorker.register('/service-worker.js')
  .then(registro => {
    console.log('Service Worker registrado:', registro);
  })
  .catch(erro => {
    console.error('Erro ao registrar:', erro);
  });

// service-worker.js
self.addEventListener('install', e => {
  console.log('Service Worker instalado');
});

self.addEventListener('fetch', e => {
  // Interceptar requisições
  e.respondWith(
    caches.match(e.request).then(resposta => {
      return resposta || fetch(e.request);
    })
  );
});
```

## 🧠 Comunicação com Workers

### postMessage() / onmessage

```javascript
// main.js
const worker = new Worker('worker.js');

// Enviar mensagem
worker.postMessage({ tipo: 'processar', dados: [1, 2, 3, 4, 5] });

// Receber mensagem
worker.onmessage = e => {
  console.log('Resultado:', e.data);
};

// worker.js
self.onmessage = e => {
  const { tipo, dados } = e.data;

  if (tipo === 'processar') {
    const resultado = dados.map(x => x * 2);
    self.postMessage(resultado);
  }
};
```

### Structured Clone Algorithm

```javascript
// Objetos são clonados (não compartilhados)
const dados = {
  texto: 'Olá',
  numero: 123,
  array: [1, 2, 3],
  objeto: { a: 1 },
  data: new Date(),
  regex: /\d+/
};

worker.postMessage(dados);

// Worker recebe cópia independente
// Modificações no worker não afetam original

// ⚠️ Funções não são clonáveis
const obj = { fn: () => {} };
// worker.postMessage(obj); // ❌ Erro: DataCloneError
```

### Transferable Objects

```javascript
// Transferir ownership (zero-copy)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB

// Transferir buffer (move, não copia)
worker.postMessage({ buffer }, [buffer]);

// ⚠️ buffer agora é inacessível na main thread
console.log(buffer.byteLength); // 0 (neutered)

// Worker recebe ownership
// worker.js
self.onmessage = e => {
  const { buffer } = e.data;
  console.log(buffer.byteLength); // 1048576 (1MB)
};
```

## 🔍 Casos de Uso

### Processamento Intensivo

```javascript
// main.js: calcular números primos sem bloquear UI
const worker = new Worker('primos-worker.js');

document.querySelector('#calcular').addEventListener('click', () => {
  const limite = parseInt(document.querySelector('#limite').value);

  worker.postMessage({ tipo: 'calcular', limite });

  document.querySelector('#status').textContent = 'Calculando...';
});

worker.onmessage = e => {
  const primos = e.data;
  document.querySelector('#resultado').textContent = `Encontrados ${primos.length} primos`;
  document.querySelector('#status').textContent = 'Completo';
};

// primos-worker.js
self.onmessage = e => {
  if (e.data.tipo === 'calcular') {
    const primos = calcularPrimos(e.data.limite);
    self.postMessage(primos);
  }
};

function calcularPrimos(limite) {
  const primos = [];
  for (let n = 2; n <= limite; n++) {
    let ehPrimo = true;
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        ehPrimo = false;
        break;
      }
    }
    if (ehPrimo) primos.push(n);
  }
  return primos;
}
```

### Processar Imagem

```javascript
// main.js: aplicar filtro em imagem
const worker = new Worker('image-worker.js');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

worker.postMessage({
  tipo: 'grayscale',
  imageData
}, [imageData.data.buffer]); // Transferir ArrayBuffer

worker.onmessage = e => {
  const processado = e.data;
  ctx.putImageData(processado, 0, 0);
};

// image-worker.js
self.onmessage = e => {
  if (e.data.tipo === 'grayscale') {
    const imageData = e.data.imageData;
    const pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const media = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      pixels[i] = pixels[i + 1] = pixels[i + 2] = media;
    }

    self.postMessage(imageData, [imageData.data.buffer]);
  }
};
```

### Polling de API

```javascript
// main.js: atualizar dados periodicamente
const worker = new Worker('polling-worker.js');

worker.postMessage({ tipo: 'iniciar', intervalo: 5000, url: '/api/dados' });

worker.onmessage = e => {
  if (e.data.tipo === 'dados') {
    atualizarUI(e.data.dados);
  }
};

// polling-worker.js
let intervalId;

self.onmessage = e => {
  if (e.data.tipo === 'iniciar') {
    const { intervalo, url } = e.data;

    intervalId = setInterval(async () => {
      try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        self.postMessage({ tipo: 'dados', dados });
      } catch (erro) {
        self.postMessage({ tipo: 'erro', erro: erro.message });
      }
    }, intervalo);
  }

  if (e.data.tipo === 'parar') {
    clearInterval(intervalId);
  }
};
```

### Parsing de CSV/JSON Grande

```javascript
// main.js
const worker = new Worker('parser-worker.js');

fetch('/dados-grandes.csv')
  .then(r => r.text())
  .then(csv => {
    worker.postMessage({ tipo: 'parsearCSV', csv });
  });

worker.onmessage = e => {
  const dados = e.data;
  renderizarTabela(dados);
};

// parser-worker.js
self.onmessage = e => {
  if (e.data.tipo === 'parsearCSV') {
    const linhas = e.data.csv.split('\n');
    const dados = linhas.map(linha => {
      return linha.split(',').map(campo => campo.trim());
    });
    self.postMessage(dados);
  }
};
```

## ⚠️ Limitações e Restrições

### Sem Acesso ao DOM

```javascript
// worker.js

// ❌ Não tem acesso ao DOM
// document.querySelector('#elemento'); // Erro!
// window.alert('Mensagem'); // Erro!
// localStorage.setItem('chave', 'valor'); // Erro!

// ✅ APIs disponíveis:
// - fetch()
// - XMLHttpRequest
// - setTimeout/setInterval
// - IndexedDB
// - WebSockets
// - importScripts()
// - self, navigator, location (limitado)
```

### Importar Scripts

```javascript
// worker.js: importar bibliotecas
importScripts('biblioteca1.js', 'biblioteca2.js');

// Executado síncronamente antes de continuar
console.log('Scripts carregados');

// Usar código importado
const resultado = funcaoDaBiblioteca();
```

### Contexto Global

```javascript
// worker.js

// 'self' é o contexto global (equivalente a 'window' na main thread)
console.log(self === this); // true

// Variáveis globais pertencem a 'self'
const minhaVar = 10;
console.log(self.minhaVar); // 10

// Fechar worker de dentro dele mesmo
self.close();
```

## 🎯 Gerenciamento de Workers

### Criar/Terminar Worker

```javascript
// Criar worker
const worker = new Worker('worker.js');

// Terminar worker (da main thread)
worker.terminate();

// Worker é destruído imediatamente, sem cleanup

// Terminar worker (de dentro do worker)
// worker.js
self.close();
// Worker termina após concluir código atual
```

### Tratamento de Erros

```javascript
// main.js
const worker = new Worker('worker.js');

worker.onerror = e => {
  console.error('Erro no worker:');
  console.error('Mensagem:', e.message);
  console.error('Arquivo:', e.filename);
  console.error('Linha:', e.lineno);
  e.preventDefault(); // Prevenir propagação do erro
};

// worker.js: erro lançado
throw new Error('Algo deu errado!');
```

### Worker Pool

```javascript
class WorkerPool {
  constructor(scriptUrl, tamanho = 4) {
    this.workers = [];
    this.tarefasPendentes = [];

    for (let i = 0; i < tamanho; i++) {
      const worker = new Worker(scriptUrl);
      worker.ocupado = false;

      worker.onmessage = e => {
        worker.ocupado = false;
        const tarefa = this.tarefasPendentes.shift();
        if (tarefa) {
          this.executar(tarefa.dados, tarefa.resolve, tarefa.reject);
        }

        // Resolver promessa da tarefa atual
        if (worker.resolveAtual) {
          worker.resolveAtual(e.data);
        }
      };

      this.workers.push(worker);
    }
  }

  executar(dados) {
    return new Promise((resolve, reject) => {
      const workerLivre = this.workers.find(w => !w.ocupado);

      if (workerLivre) {
        workerLivre.ocupado = true;
        workerLivre.resolveAtual = resolve;
        workerLivre.postMessage(dados);
      } else {
        this.tarefasPendentes.push({ dados, resolve, reject });
      }
    });
  }

  terminar() {
    this.workers.forEach(worker => worker.terminate());
  }
}

// Uso
const pool = new WorkerPool('worker.js', 4);

// Executar 100 tarefas em paralelo (máx 4 simultâneas)
const promessas = [];
for (let i = 0; i < 100; i++) {
  promessas.push(pool.executar({ tarefa: i }));
}

Promise.all(promessas).then(resultados => {
  console.log('Todas tarefas completas:', resultados);
  pool.terminar();
});
```

## 🚀 Inline Workers

### Criar Worker de String

```javascript
// Criar worker a partir de código inline (sem arquivo separado)
const codigoWorker = `
  self.onmessage = e => {
    const resultado = e.data * 2;
    self.postMessage(resultado);
  };
`;

const blob = new Blob([codigoWorker], { type: 'application/javascript' });
const workerUrl = URL.createObjectURL(blob);
const worker = new Worker(workerUrl);

worker.postMessage(10);

worker.onmessage = e => {
  console.log('Resultado:', e.data); // 20
  URL.revokeObjectURL(workerUrl); // Limpar
};
```

### Comlink (Biblioteca)

```javascript
// Simplificar comunicação com Workers usando Comlink
// npm install comlink

// main.js
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const API = Comlink.wrap(worker);

// Chamar funções do worker como se fossem locais
const resultado = await API.calcular(100);
console.log(resultado);

// worker.js
import * as Comlink from 'comlink';

const API = {
  calcular(n) {
    return n * n;
  },

  async buscarDados(url) {
    const resposta = await fetch(url);
    return resposta.json();
  }
};

Comlink.expose(API);
```

Web Workers são essenciais para aplicações web performáticas, permitindo processar grandes volumes de dados, executar cálculos complexos e realizar operações pesadas sem comprometer a responsividade da interface do usuário.
