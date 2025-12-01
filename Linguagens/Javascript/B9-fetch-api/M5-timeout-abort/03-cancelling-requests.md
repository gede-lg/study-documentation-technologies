# Cancelling Requests: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Cancelling requests** é o processo de **interromper fetch requests em andamento** antes de completarem, liberando **recursos de rede**, **memória** e **threads** alocados para operação. Conceitualmente, cancelamento transforma requests de **fire-and-forget** (disparar e esquecer) em **operações controláveis**, onde aplicação pode **abortar proativamente** quando resultado não é mais necessário, melhorando **performance**, **responsividade** e **eficiência de recursos**.

Cancelamento via **AbortController** é **cooperativo**: browser interrompe fetch, fecha conexão TCP, e rejeita Promise com **AbortError**, mas **servidor pode continuar processando** (cancelamento não é comunicado ao servidor em HTTP/1.1). Aplicação deve **detectar AbortError** e tratá-lo como **cancelamento intencional** (não erro real), evitando logging/alertas desnecessários.

```javascript
// Request sem cancelamento - continua mesmo se não necessário
const promise = fetch('/api/dados-grandes');

// Usuário navega para outra página
// ❌ Request continua, desperdiça banda/memória

// Request cancelável - pode ser abortado
const controller = new AbortController();
const promise = fetch('/api/dados-grandes', {
  signal: controller.signal
});

// Usuário navega - cancelar request
controller.abort();
// ✅ Request interrompido, recursos liberados
// Promise rejeita com AbortError
```

### Contexto Histórico e Motivação

**Evolução de Request Cancellation:**

1. **XMLHttpRequest (1999)**: `xhr.abort()` method - cancelamento imperativo
2. **Fetch API (2015)**: Sem cancelamento inicialmente (Promise não cancelável)
3. **AbortController (2017)**: API padrão para cancelamento cooperativo
4. **Modern (2020+)**: Cancelamento ubíquo (fetch, streams, custom operations)

**Motivação para Cancelamento:**

Promises são **não canceláveis por design**, causando problemas em Fetch:

```javascript
// Problema (2015-2017): Promise não cancelável
const promise = fetch('/api/dados');

// Não há como cancelar - request continua
// Desperdiça recursos, pode causar memory leaks

// Solução (2017+): AbortController
const controller = new AbortController();
const promise = fetch('/api/dados', {
  signal: controller.signal
});

controller.abort(); // Cancelar request
```

### Problema Fundamental que Resolve

Request cancellation resolve problemas específicos:

**1. Resource Waste**: Prevenir requests desnecessários (componente desmontado)
**2. Race Conditions**: Cancelar requests antigos (search-as-you-type)
**3. User Control**: Permitir usuário cancelar operações longas
**4. Memory Leaks**: Evitar state updates em componentes desmontados
**5. Network Efficiency**: Liberar bandwidth de requests obsoletos

### Importância no Ecossistema

Request cancellation é **essencial para aplicações modernas**:

- **SPAs (React/Vue)**: Cleanup ao desmontar componentes
- **Search/Autocomplete**: Cancelar requests antigos ao digitar
- **Navigation**: Cancelar requests ao mudar página
- **File Upload**: Permitir usuário cancelar upload
- **Polling**: Parar polling ao sair de página

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Cooperative Cancellation**: Browser aborta, servidor pode continuar
2. **AbortController Pattern**: Controller cria signal, signal passado para fetch
3. **Resource Cleanup**: Conexões fechadas, memória liberada
4. **Promise Rejection**: Fetch rejeita com DOMException: 'AbortError'
5. **Idempotent**: abort() pode ser chamado múltiplas vezes (safe)

### Pilares Fundamentais

- **AbortController**: Gerencia cancelamento
- **AbortSignal**: Passado para fetch
- **abort() method**: Dispara cancelamento
- **AbortError**: Exception lançada ao cancelar
- **signal.aborted**: Flag indicando se cancelado

### Visão Geral das Nuances

- Cancelamento não afeta servidor (HTTP/1.1)
- AbortError não é erro real (cancelamento intencional)
- Signal pode ser compartilhado entre requests
- Cancelar após response retornar não tem efeito
- Cleanup deve verificar signal.aborted antes de state updates

---

## 🧠 Fundamentos Teóricos

### Cancelamento Básico

```javascript
const controller = new AbortController();

// Iniciar request
const promise = fetch('/api/dados', {
  signal: controller.signal
});

promise
  .then(response => response.json())
  .then(data => {
    console.log('Dados:', data);
  })
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request cancelado');
    } else {
      console.error('Erro:', error);
    }
  });

// Cancelar request
controller.abort();

// Promise rejeita imediatamente com:
// DOMException: The user aborted a request.
```

### User-Initiated Cancellation

```javascript
import { useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [controllerRef] = useState({ current: null });
  
  async function fetchData() {
    // Cancelar request anterior se existir
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    const controller = new AbortController();
    controllerRef.current = controller;
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/dados-grandes', {
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      // Verificar se não foi cancelado antes de atualizar state
      if (!controller.signal.aborted) {
        setData(result);
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Usuário cancelou request');
      } else {
        console.error('Erro:', error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      controllerRef.current = null;
    }
  }
  
  function handleCancel() {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }
  
  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        Buscar Dados
      </button>
      
      {loading && (
        <button onClick={handleCancel}>
          Cancelar
        </button>
      )}
      
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### Component Unmount Cleanup (React)

```javascript
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchUser() {
      try {
        const response = await fetch(`/api/usuarios/${userId}`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        setUser(data);
        
      } catch (err) {
        // Ignorar AbortError (componente desmontou)
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
    
    // Cleanup - cancelar ao desmontar ou userId mudar
    return () => {
      controller.abort();
    };
    
  }, [userId]);
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return <div>{user?.nome}</div>;
}
```

### Search-as-You-Type com Cancelamento

```javascript
import { useState, useEffect } from 'react';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  useEffect(() => {
    // Não buscar se query vazia
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const controller = new AbortController();
    
    // Debounce - aguardar 300ms antes de buscar
    const timeoutId = setTimeout(async () => {
      try {
        setSearching(true);
        
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        
        // Verificar se não cancelado antes de atualizar
        if (!controller.signal.aborted) {
          setResults(data.results);
        }
        
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search error:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }, 300);
    
    // Cleanup - cancelar request anterior ao digitar nova letra
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
    
  }, [query]);
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      
      {searching && <div>Buscando...</div>}
      
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Benefício**: Apenas **última busca** é processada, requests antigos cancelados.

### Cancelamento em Múltiplos Requests Paralelos

```javascript
async function buscarDadosParalelos() {
  const controller = new AbortController();
  const { signal } = controller;
  
  try {
    // Múltiplos fetches com mesmo signal
    const [usuarios, produtos, pedidos] = await Promise.all([
      fetch('/api/usuarios', { signal }),
      fetch('/api/produtos', { signal }),
      fetch('/api/pedidos', { signal })
    ]);
    
    // Processar responses
    const [usuariosData, produtosData, pedidosData] = await Promise.all([
      usuarios.json(),
      produtos.json(),
      pedidos.json()
    ]);
    
    return {
      usuarios: usuariosData,
      produtos: produtosData,
      pedidos: pedidosData
    };
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Todos requests cancelados');
    }
    throw error;
  }
}

// Uso com cancelamento
const controller = new AbortController();

buscarDadosParalelos()
  .then(data => console.log('Dados:', data))
  .catch(error => {
    if (error.name !== 'AbortError') {
      console.error('Erro:', error);
    }
  });

// Cancelar todos requests de uma vez
controller.abort();
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Request Deduplication

```javascript
class APIClient {
  constructor() {
    this.pendingRequests = new Map();
  }
  
  async fetch(url, options = {}) {
    // Chave única por URL + method
    const key = `${options.method || 'GET'}:${url}`;
    
    // Se request já pendente, cancelar anterior
    if (this.pendingRequests.has(key)) {
      const { controller } = this.pendingRequests.get(key);
      controller.abort();
    }
    
    // Criar novo controller
    const controller = new AbortController();
    const promise = fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    // Armazenar request pendente
    this.pendingRequests.set(key, { controller, promise });
    
    try {
      const response = await promise;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`Request duplicado cancelado: ${key}`);
        throw error;
      }
      
      throw error;
      
    } finally {
      // Remover da lista de pendentes
      this.pendingRequests.delete(key);
    }
  }
}

// Uso
const api = new APIClient();

// Requests duplicados - anterior cancelado
api.fetch('/api/usuarios'); // Cancelado
api.fetch('/api/usuarios'); // Cancelado
const data = await api.fetch('/api/usuarios'); // Executa

console.log('Apenas última request executada');
```

### Pattern 2: Navigation Cancellation

```javascript
// Router-like navigation com cancelamento
class Router {
  constructor() {
    this.currentController = null;
  }
  
  async navigate(path) {
    // Cancelar navegação anterior
    if (this.currentController) {
      this.currentController.abort();
    }
    
    const controller = new AbortController();
    this.currentController = controller;
    
    try {
      // Buscar dados da nova página
      const response = await fetch(`/api/pages${path}`, {
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const pageData = await response.json();
      
      // Verificar se não cancelado
      if (!controller.signal.aborted) {
        this.renderPage(pageData);
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Navegação cancelada (nova navegação iniciada)');
      } else {
        console.error('Erro na navegação:', error);
      }
    }
  }
  
  renderPage(data) {
    console.log('Renderizar página:', data);
  }
}

// Uso
const router = new Router();

router.navigate('/home');    // Cancelado
router.navigate('/about');   // Cancelado
router.navigate('/contact'); // Executa

// Apenas última navegação renderizada
```

### Pattern 3: File Upload Cancellation

```javascript
import { useState } from 'react';

function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadController, setUploadController] = useState(null);
  
  async function handleUpload(file) {
    const controller = new AbortController();
    setUploadController(controller);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setUploading(true);
      setProgress(0);
      
      // XMLHttpRequest para progress (Fetch não suporta nativamente)
      await uploadWithProgress(formData, controller.signal, (percent) => {
        setProgress(percent);
      });
      
      console.log('Upload completo');
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelado pelo usuário');
      } else {
        console.error('Erro no upload:', error);
      }
    } finally {
      setUploading(false);
      setProgress(0);
      setUploadController(null);
    }
  }
  
  function handleCancel() {
    if (uploadController) {
      uploadController.abort();
    }
  }
  
  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      
      {uploading && (
        <div>
          <progress value={progress} max="100" />
          <span>{progress}%</span>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

// Helper com XMLHttpRequest (Fetch não suporta upload progress)
function uploadWithProgress(formData, signal, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Listener para abort signal
    signal.addEventListener('abort', () => {
      xhr.abort();
      reject(new DOMException('Aborted', 'AbortError'));
    });
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Network error'));
    });
    
    xhr.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'));
    });
    
    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}
```

### Pattern 4: Polling com Cancelamento

```javascript
async function startPolling(url, interval = 2000) {
  const controller = new AbortController();
  const { signal } = controller;
  
  async function poll() {
    while (!signal.aborted) {
      try {
        const response = await fetch(url, { signal });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Poll data:', data);
        
        // Condição de parada
        if (data.status === 'completed') {
          console.log('Polling completo');
          break;
        }
        
        // Aguardar interval antes de próximo poll
        await new Promise(resolve => {
          const timeoutId = setTimeout(resolve, interval);
          
          // Cancelar sleep se aborted
          signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            resolve();
          }, { once: true });
        });
        
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Polling cancelado');
          break;
        }
        
        console.error('Erro no polling:', error);
        // Continuar polling mesmo com erro
      }
    }
  }
  
  poll();
  
  // Retornar função para cancelar
  return () => controller.abort();
}

// Uso
const stopPolling = startPolling('/api/job-status', 2000);

// Cancelar polling após 10s
setTimeout(stopPolling, 10000);
```

### Pattern 5: Race Condition Prevention

```javascript
class DataLoader {
  constructor() {
    this.currentLoadId = 0;
    this.currentController = null;
  }
  
  async load(params) {
    // Incrementar ID para detectar requests obsoletos
    const loadId = ++this.currentLoadId;
    
    // Cancelar request anterior
    if (this.currentController) {
      this.currentController.abort();
    }
    
    const controller = new AbortController();
    this.currentController = controller;
    
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verificar se este ainda é o request mais recente
      if (loadId === this.currentLoadId && !controller.signal.aborted) {
        console.log('Dados atualizados:', data);
        return data;
      } else {
        console.log('Request obsoleto ignorado');
        return null;
      }
      
    } catch (error) {
      // Ignorar AbortError de requests obsoletos
      if (error.name === 'AbortError') {
        console.log(`Request ${loadId} cancelado`);
        return null;
      }
      
      throw error;
    }
  }
}

// Uso
const loader = new DataLoader();

loader.load({ filter: 'a' }); // Cancelado
loader.load({ filter: 'ab' }); // Cancelado
const data = await loader.load({ filter: 'abc' }); // Executa

// Apenas última load é processada
```

### Pattern 6: Cancellation Token Pattern

```javascript
// Token pattern (alternativa a passar controller)
class CancellationToken {
  constructor() {
    this.controller = new AbortController();
  }
  
  get signal() {
    return this.controller.signal;
  }
  
  get isCancelled() {
    return this.controller.signal.aborted;
  }
  
  cancel(reason) {
    this.controller.abort(reason);
  }
  
  throwIfCancelled() {
    if (this.isCancelled) {
      throw new DOMException('Cancelled', 'AbortError');
    }
  }
}

async function longOperation(token) {
  console.log('Iniciando operação...');
  
  // Step 1
  token.throwIfCancelled();
  await fetch('/api/step1', { signal: token.signal });
  console.log('Step 1 completo');
  
  // Step 2
  token.throwIfCancelled();
  await fetch('/api/step2', { signal: token.signal });
  console.log('Step 2 completo');
  
  // Step 3
  token.throwIfCancelled();
  await fetch('/api/step3', { signal: token.signal });
  console.log('Step 3 completo');
  
  return 'Operação completa';
}

// Uso
const token = new CancellationToken();

longOperation(token)
  .then(result => console.log(result))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Operação cancelada');
    }
  });

// Cancelar em qualquer ponto
setTimeout(() => token.cancel(), 2000);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Cancelar Requests

**✅ Component Unmount**: Sempre cancelar ao desmontar
**✅ Navigation**: Cancelar ao mudar página
**✅ Search**: Cancelar requests antigos ao digitar
**✅ Duplicate Requests**: Cancelar duplicados
**✅ User Initiated**: Botão "Cancelar" em operações longas

### Quando NÃO Cancelar

**❌ Critical Operations**: Pagamentos, confirmações
**❌ Analytics**: Logging, tracking
**❌ Side Effects**: Operações com efeitos no servidor

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Server Processing**: Cancelamento não afeta servidor (HTTP/1.1)
**2. Side Effects**: Operações já executadas não são revertidas
**3. Network Only**: Cancela apenas request, não processamento
**4. Timing**: Cancelar após response retornar não tem efeito

### Armadilhas Comuns

#### Armadilha 1: Não Verificar AbortError

```javascript
// ❌ ERRO - tratar AbortError como falha
catch (error) {
  reportError(error); // Poluir logs com cancelamentos
}

// ✅ CORRETO - ignorar AbortError
catch (error) {
  if (error.name !== 'AbortError') {
    reportError(error);
  }
}
```

#### Armadilha 2: State Update Após Cancel

```javascript
// ❌ ERRO - state update mesmo cancelado
catch (error) {
  setError(error); // Atualizar mesmo se AbortError
}

// ✅ CORRETO - verificar antes
catch (error) {
  if (error.name !== 'AbortError') {
    setError(error);
  }
}
```

---

## 🔗 Interconexões Conceituais

### Relação com AbortController

Cancelamento **usa AbortController** para sinalização.

### Relação com Cleanup

Cancelamento é **form de cleanup** - liberar recursos.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar cancellation:
1. **Cleanup Patterns**: Best practices de cleanup
2. **Resource Management**: Gerenciar recursos complexos
3. **Circuit Breaker**: Parar requests após failures

---

## 📚 Conclusão

Request cancellation é **essencial para aplicações eficientes**.

Dominar cancellation significa:
- **Cancelar** requests ao desmontar componentes
- **Ignorar AbortError** (não é erro real)
- **Verificar signal.aborted** antes de state updates
- Implementar **user cancellation** em operações longas
- Prevenir **race conditions** cancelando requests obsoletos

É fundamental para performance, UX e resource management.
