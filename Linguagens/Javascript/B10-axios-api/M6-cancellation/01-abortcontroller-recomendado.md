# AbortController (recomendado)

## 🎯 Introdução e Definição

### Definição Conceitual

**AbortController** é uma **API Web nativa** para cancelar operações assíncronas, incluindo requisições HTTP feitas com Axios. Conceitualmente, é um **mecanismo de sinalização** que permite **abortar requisições em andamento** quando elas não são mais necessárias, economizando largura de banda, recursos de servidor e melhorando performance da aplicação.

Pense em AbortController como um **botão de parar** - quando você pressiona, a operação em andamento é **imediatamente cancelada**, liberando recursos. É como cancelar um pedido em um restaurante antes que ele chegue à mesa.

**Estrutura fundamental:**
```javascript
// Criar AbortController
const controller = new AbortController();

// Fazer requisição com signal
axios.get('/api/dados', {
  signal: controller.signal
});

// Cancelar requisição
controller.abort(); // ← Requisição cancelada imediatamente
```

**Fluxo de execução:**
```
1. Criar AbortController
2. Passar controller.signal para axios config
3. Requisição enviada ao servidor
4. Chamar controller.abort() quando quiser cancelar
5. Requisição cancelada, erro lançado (AbortError)
6. Catch block recebe erro
```

**Caso de uso clássico - Pesquisa com debounce:**
```javascript
let controller = null;

function search(query) {
  // Cancelar pesquisa anterior
  if (controller) {
    controller.abort();
  }
  
  // Criar novo controller
  controller = new AbortController();
  
  // Fazer requisição
  axios.get('/api/search', {
    params: { q: query },
    signal: controller.signal
  })
  .then(response => {
    console.log('Resultados:', response.data);
  })
  .catch(error => {
    if (error.name === 'CanceledError') {
      console.log('Pesquisa cancelada');
    } else {
      console.error('Erro:', error);
    }
  });
}

// Usuário digita 'javasc'
search('j');      // Requisição 1 iniciada
search('ja');     // Requisição 1 CANCELADA, Requisição 2 iniciada
search('jav');    // Requisição 2 CANCELADA, Requisição 3 iniciada
search('java');   // Requisição 3 CANCELADA, Requisição 4 iniciada
search('javasc'); // Requisição 4 CANCELADA, Requisição 5 iniciada

// Apenas a última requisição (search('javasc')) completa!
```

**Exemplo prático - Cancelar ao sair da página:**
```javascript
function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    axios.get('/api/usuario', {
      signal: controller.signal
    })
    .then(response => setUsuario(response.data))
    .catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('Erro:', error);
      }
    });
    
    // Cleanup: cancelar ao desmontar componente
    return () => {
      controller.abort();
    };
  }, []);
  
  return <div>{usuario?.nome}</div>;
}

// Se usuário sair da página antes da requisição completar,
// controller.abort() é chamado automaticamente (cleanup)
```

### Contexto Histórico e Motivação

**Antes de AbortController:**

Axios usava **CancelToken**, uma API proprietária para cancelamento:

```javascript
// ❌ CancelToken (antigo, deprecated)
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/dados', {
  cancelToken: source.token
});

source.cancel('Operação cancelada pelo usuário');

// Problemas:
// 1. API proprietária (apenas Axios)
// 2. Não é padrão Web
// 3. Complexo de usar
// 4. Deprecated desde Axios v0.22.0
```

**Com AbortController (moderno, recomendado):**

```javascript
// ✅ AbortController (moderno, padrão Web)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal
});

controller.abort();

// Vantagens:
// 1. API nativa do JavaScript (padrão Web)
// 2. Funciona com Fetch, Axios, e outras APIs
// 3. Simples de usar
// 4. Recomendado oficialmente pelo Axios
```

**Evolução:**
- **Antes de 2017:** Sem API nativa de cancelamento (apenas XMLHttpRequest.abort())
- **2017:** AbortController introduzido como padrão Web
- **2018:** Fetch API adota AbortController
- **2021:** Axios v0.22.0 adiciona suporte a AbortController
- **2021+:** CancelToken marcado como deprecated
- **Hoje:** AbortController é o padrão recomendado

### Problema Fundamental que Resolve

**AbortController resolve:**

1. **Race conditions:** Cancelar requisições antigas quando nova é feita
2. **Memory leaks:** Cancelar requisições ao desmontar componentes
3. **Bandwidth waste:** Não receber dados desnecessários
4. **Server load:** Reduzir carga no servidor (requisições canceladas)
5. **User experience:** Cancelar operações lentas quando usuário muda de ideia

**Exemplo prático - Race Condition em Pesquisa:**

**Sem cancelamento (problema):**
```javascript
// ❌ Race condition - resultados podem chegar fora de ordem
async function search(query) {
  const response = await axios.get('/api/search', { params: { q: query } });
  setResults(response.data);
}

// Usuário digita rapidamente: 'r' → 'react'
search('r');     // Requisição lenta (500ms)
search('react'); // Requisição rápida (100ms)

// Ordem de chegada:
// 1. 'react' retorna primeiro (100ms) - setResults([...])
// 2. 'r' retorna depois (500ms) - setResults([...]) ← SOBRESCREVE!

// Resultado: Usuário vê resultados de 'r' mesmo tendo buscado 'react'!
```

**Com cancelamento (solução):**
```javascript
// ✅ Cancelar requisição anterior
let controller = null;

async function search(query) {
  // Cancelar pesquisa anterior
  if (controller) {
    controller.abort();
  }
  
  controller = new AbortController();
  
  try {
    const response = await axios.get('/api/search', {
      params: { q: query },
      signal: controller.signal
    });
    setResults(response.data);
  } catch (error) {
    if (error.name !== 'CanceledError') {
      console.error('Erro:', error);
    }
  }
}

// Usuário digita: 'r' → 'react'
search('r');     // Requisição iniciada
search('react'); // Requisição anterior CANCELADA, nova iniciada

// Apenas 'react' retorna - sem race condition!
```

**Exemplo prático - Memory Leak em React:**

**Sem cancelamento (memory leak):**
```javascript
// ❌ Memory leak - setState em componente desmontado
function Usuario({ id }) {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    axios.get(`/api/usuarios/${id}`)
      .then(response => {
        setUsuario(response.data); // ← Erro se componente desmontado!
      });
  }, [id]);
  
  return <div>{usuario?.nome}</div>;
}

// Problema:
// 1. Requisição iniciada
// 2. Usuário navega para outra página (componente desmontado)
// 3. Requisição completa
// 4. setUsuario chamado em componente desmontado
// 5. Warning: "Can't perform a React state update on an unmounted component"
```

**Com cancelamento (sem memory leak):**
```javascript
// ✅ Cancelar ao desmontar
function Usuario({ id }) {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    axios.get(`/api/usuarios/${id}`, {
      signal: controller.signal
    })
    .then(response => {
      setUsuario(response.data); // ← Nunca chamado se componente desmontado
    })
    .catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('Erro:', error);
      }
    });
    
    // Cleanup: cancelar ao desmontar
    return () => {
      controller.abort();
    };
  }, [id]);
  
  return <div>{usuario?.nome}</div>;
}

// Agora:
// 1. Requisição iniciada
// 2. Usuário navega (componente desmontado)
// 3. cleanup executado: controller.abort()
// 4. Requisição cancelada
// 5. .then nunca executado - sem warning!
```

### Importância no Ecossistema

**AbortController é fundamental para:**

- **React/Vue/Angular:** Cancelar requisições ao desmontar componentes
- **Search/Autocomplete:** Cancelar pesquisas antigas
- **Infinite scroll:** Cancelar carregamento de página antiga
- **Real-time updates:** Cancelar polling quando componente desmonta
- **Tab switching:** Cancelar requisições de aba inativa
- **Mobile apps:** Economizar bateria/dados cancelando requisições

**Padrão de produção - React Hook:**

```javascript
// Hook customizado para fetch com auto-cancelamento
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    
    axios.get(url, { signal: controller.signal })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'CanceledError') {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => {
      controller.abort();
    };
  }, [url]);
  
  return { data, loading, error };
}

// Uso
function App() {
  const { data, loading } = useFetch('/api/usuarios');
  
  if (loading) return <div>Carregando...</div>;
  
  return <div>{data.map(u => <div key={u.id}>{u.nome}</div>)}</div>;
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **API nativa:** AbortController é padrão Web (não específico do Axios)
2. **Signal:** controller.signal passado para axios config
3. **Abort:** controller.abort() cancela requisição
4. **CanceledError:** Erro lançado quando requisição é cancelada
5. **Cleanup:** Cancelar em useEffect cleanup, componentWillUnmount, etc.

### Pilares Fundamentais

- **new AbortController():** Criar instância
- **controller.signal:** Objeto AbortSignal para passar ao axios
- **controller.abort():** Cancelar requisição
- **error.name === 'CanceledError':** Detectar cancelamento
- **Cleanup:** Sempre cancelar ao desmontar/sair

### Visão Geral das Nuances

- **Reusabilidade:** controller.abort() só pode ser chamado uma vez (criar novo para nova requisição)
- **Timing:** abort() antes de resposta chegar = cancelado, depois = não tem efeito
- **Error handling:** Sempre verificar CanceledError para não logar como erro real
- **Multiple requests:** Um controller pode cancelar múltiplas requisições
- **Compatibilidade:** Axios v0.22.0+ (versões antigas não suportam)

---

## 🧠 Fundamentos Teóricos

### Criando AbortController

```javascript
// Criar instância
const controller = new AbortController();

// AbortController tem 2 propriedades:
console.log(controller.signal); // AbortSignal object
console.log(controller.abort);  // Function
```

**AbortSignal:**
- Objeto passado para axios config
- Propriedade `aborted`: boolean (true se cancelado)
- Evento `abort`: disparado quando controller.abort() chamado

**controller.abort():**
- Função que cancela requisição
- Pode receber razão opcional: `controller.abort('Usuário cancelou')`

### Passando Signal para Axios

```javascript
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal // ← Passa signal aqui
});
```

**Config completo:**
```javascript
axios({
  method: 'get',
  url: '/api/dados',
  signal: controller.signal, // ← Adicionar signal
  params: { page: 1 },
  headers: { 'X-Custom': 'value' }
});
```

**Shorthand methods:**
```javascript
const controller = new AbortController();

// GET
axios.get('/api/dados', { signal: controller.signal });

// POST
axios.post('/api/posts', data, { signal: controller.signal });

// PUT
axios.put('/api/posts/1', data, { signal: controller.signal });

// DELETE
axios.delete('/api/posts/1', { signal: controller.signal });
```

### Cancelando Requisição

```javascript
const controller = new AbortController();

// Iniciar requisição
axios.get('/api/dados', {
  signal: controller.signal
})
.then(response => {
  console.log('Sucesso:', response.data);
})
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Requisição cancelada');
  } else {
    console.error('Erro:', error);
  }
});

// Cancelar após 1 segundo
setTimeout(() => {
  controller.abort();
  console.log('Abort chamado');
}, 1000);
```

**Fluxo:**
1. Requisição iniciada
2. 1 segundo passa
3. `controller.abort()` chamado
4. Requisição cancelada
5. `.catch` recebe CanceledError
6. `.then` NUNCA executado

### Detectando Cancelamento

**Verificar error.name:**
```javascript
axios.get('/api/dados', { signal: controller.signal })
  .catch(error => {
    if (error.name === 'CanceledError') {
      console.log('Requisição foi cancelada');
    } else if (error.response) {
      console.error('Erro HTTP:', error.response.status);
    } else if (error.request) {
      console.error('Erro de rede');
    } else {
      console.error('Erro:', error.message);
    }
  });
```

**Verificar axios.isCancel():**
```javascript
import axios from 'axios';

axios.get('/api/dados', { signal: controller.signal })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('Requisição cancelada:', error.message);
    } else {
      console.error('Erro:', error);
    }
  });
```

### Abort Reason (Razão do Cancelamento)

```javascript
const controller = new AbortController();

axios.get('/api/dados', { signal: controller.signal })
  .catch(error => {
    if (error.name === 'CanceledError') {
      console.log('Cancelado:', error.message);
    }
  });

// Abort com razão customizada
controller.abort('Usuário cancelou a operação');

// Output: Cancelado: Usuário cancelou a operação
```

### Múltiplas Requisições - Um Controller

**Um controller pode cancelar várias requisições:**

```javascript
const controller = new AbortController();

// Múltiplas requisições com mesmo signal
const promise1 = axios.get('/api/usuarios', { signal: controller.signal });
const promise2 = axios.get('/api/posts', { signal: controller.signal });
const promise3 = axios.get('/api/comentarios', { signal: controller.signal });

// Cancelar TODAS de uma vez
controller.abort();

// Todas as 3 requisições canceladas!
```

**Uso - Cancelar operações relacionadas:**
```javascript
async function carregarDashboard() {
  const controller = new AbortController();
  
  try {
    const [usuarios, posts, stats] = await Promise.all([
      axios.get('/api/usuarios', { signal: controller.signal }),
      axios.get('/api/posts', { signal: controller.signal }),
      axios.get('/api/stats', { signal: controller.signal })
    ]);
    
    setDashboard({ usuarios: usuarios.data, posts: posts.data, stats: stats.data });
  } catch (error) {
    if (error.name !== 'CanceledError') {
      console.error('Erro:', error);
    }
  }
  
  return controller;
}

// Carregar dashboard
const controller = await carregarDashboard();

// Cancelar tudo se usuário sair
window.addEventListener('beforeunload', () => {
  controller.abort();
});
```

### AbortController em React

**Pattern: Cancelar ao desmontar componente**

```javascript
function Usuario({ id }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    
    axios.get(`/api/usuarios/${id}`, {
      signal: controller.signal
    })
    .then(response => {
      setUsuario(response.data);
      setLoading(false);
    })
    .catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('Erro:', error);
        setLoading(false);
      }
    });
    
    // Cleanup: cancelar ao desmontar OU quando id mudar
    return () => {
      controller.abort();
    };
  }, [id]); // ← Re-executar quando id mudar
  
  if (loading) return <div>Carregando...</div>;
  
  return <div>{usuario?.nome}</div>;
}

// Comportamento:
// 1. Componente monta, id=1 → requisição /api/usuarios/1
// 2. id muda para 2 → cleanup executa (cancela req 1), nova requisição /api/usuarios/2
// 3. Componente desmonta → cleanup executa (cancela req 2)
```

### AbortController em Search/Autocomplete

**Pattern: Cancelar pesquisa anterior**

```javascript
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const controllerRef = useRef(null);
  
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    // Cancelar pesquisa anterior
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    // Criar novo controller
    controllerRef.current = new AbortController();
    
    // Fazer pesquisa
    axios.get('/api/search', {
      params: { q: query },
      signal: controllerRef.current.signal
    })
    .then(response => {
      setResults(response.data);
    })
    .catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('Erro:', error);
      }
    });
    
    // Cleanup: cancelar ao desmontar
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Pesquisar..."
      />
      <ul>
        {results.map(r => <li key={r.id}>{r.titulo}</li>)}
      </ul>
    </div>
  );
}

// Comportamento:
// Usuário digita: 'r' → 'rea' → 'react'
// 1. query='r' → requisição 1
// 2. query='rea' → requisição 1 cancelada, requisição 2
// 3. query='react' → requisição 2 cancelada, requisição 3
// Apenas requisição 3 completa!
```

### AbortController com Timeout Manual

```javascript
const controller = new AbortController();

// Cancelar após 5 segundos
const timeoutId = setTimeout(() => {
  controller.abort('Timeout de 5 segundos');
}, 5000);

axios.get('/api/dados', {
  signal: controller.signal
})
.then(response => {
  clearTimeout(timeoutId); // ← Cancelar timeout se requisição completar
  console.log('Sucesso:', response.data);
})
.catch(error => {
  clearTimeout(timeoutId);
  
  if (error.name === 'CanceledError') {
    console.log('Timeout:', error.message);
  } else {
    console.error('Erro:', error);
  }
});
```

### Verificando se Signal já foi Aborted

```javascript
const controller = new AbortController();

console.log(controller.signal.aborted); // false

controller.abort();

console.log(controller.signal.aborted); // true

// Uso - Evitar fazer requisição se já cancelado
if (!controller.signal.aborted) {
  axios.get('/api/dados', { signal: controller.signal });
} else {
  console.log('Signal já foi abortado');
}
```

### Event Listener no Signal

```javascript
const controller = new AbortController();

// Listener para evento abort
controller.signal.addEventListener('abort', () => {
  console.log('Signal foi abortado!');
  console.log('Razão:', controller.signal.reason);
});

// Fazer requisição
axios.get('/api/dados', { signal: controller.signal });

// Abort
controller.abort('Cancelado pelo usuário');

// Output: Signal foi abortado!
// Output: Razão: Cancelado pelo usuário
```

---

## 🔍 Análise Conceitual Profunda

### Caso 1: Search com Debounce + AbortController

```javascript
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function SearchWithDebounce() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const timeoutRef = useRef(null);
  
  useEffect(() => {
    // Limpar se query vazia
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    // Cancelar pesquisa anterior
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    // Cancelar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setLoading(true);
    
    // Debounce: esperar 300ms antes de pesquisar
    timeoutRef.current = setTimeout(() => {
      controllerRef.current = new AbortController();
      
      axios.get('/api/search', {
        params: { q: query },
        signal: controllerRef.current.signal
      })
      .then(response => {
        setResults(response.data);
        setLoading(false);
      })
      .catch(error => {
        if (error.name !== 'CanceledError') {
          console.error('Erro:', error);
          setLoading(false);
        }
      });
    }, 300);
    
    // Cleanup
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Pesquisar..."
      />
      {loading && <div>Pesquisando...</div>}
      <ul>
        {results.map(r => <li key={r.id}>{r.titulo}</li>)}
      </ul>
    </div>
  );
}
```

### Caso 2: Custom Hook useFetch com AbortController

```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    setLoading(true);
    setError(null);
    
    axios.get(url, {
      ...options,
      signal: controller.signal
    })
    .then(response => {
      setData(response.data);
      setLoading(false);
    })
    .catch(err => {
      if (err.name !== 'CanceledError') {
        setError(err);
        setLoading(false);
      }
    });
    
    return () => {
      controller.abort();
    };
  }, [url]);
  
  return { data, loading, error };
}

// Uso
function App() {
  const { data: usuarios, loading, error } = useFetch('/api/usuarios');
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    <ul>
      {usuarios.map(u => <li key={u.id}>{u.nome}</li>)}
    </ul>
  );
}
```

### Caso 3: Infinite Scroll com Cancelamento

```javascript
function InfiniteScroll() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  
  useEffect(() => {
    // Cancelar carregamento anterior
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    controllerRef.current = new AbortController();
    setLoading(true);
    
    axios.get('/api/items', {
      params: { page },
      signal: controllerRef.current.signal
    })
    .then(response => {
      setItems(prev => [...prev, ...response.data]);
      setLoading(false);
    })
    .catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('Erro:', error);
        setLoading(false);
      }
    });
    
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [page]);
  
  return (
    <div>
      {items.map(item => <div key={item.id}>{item.titulo}</div>)}
      {loading && <div>Carregando...</div>}
      <button onClick={() => setPage(p => p + 1)}>Carregar mais</button>
    </div>
  );
}
```

### Caso 4: Cancelar Todas as Requisições Pendentes

```javascript
class RequestManager {
  constructor() {
    this.controllers = new Map();
  }
  
  async request(key, url, config = {}) {
    // Cancelar requisição anterior com mesma key
    if (this.controllers.has(key)) {
      this.controllers.get(key).abort();
    }
    
    // Criar novo controller
    const controller = new AbortController();
    this.controllers.set(key, controller);
    
    try {
      const response = await axios.get(url, {
        ...config,
        signal: controller.signal
      });
      
      this.controllers.delete(key);
      return response;
    } catch (error) {
      this.controllers.delete(key);
      throw error;
    }
  }
  
  cancelAll() {
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
  }
  
  cancel(key) {
    if (this.controllers.has(key)) {
      this.controllers.get(key).abort();
      this.controllers.delete(key);
    }
  }
}

// Uso
const manager = new RequestManager();

// Fazer requisições
manager.request('usuarios', '/api/usuarios');
manager.request('posts', '/api/posts');
manager.request('comentarios', '/api/comentarios');

// Cancelar apenas 'posts'
manager.cancel('posts');

// Ou cancelar todas
manager.cancelAll();
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar AbortController

**Use quando:**
- React/Vue/Angular: cancelar ao desmontar componentes
- Search/autocomplete: cancelar pesquisas antigas
- Tabs: cancelar requisições de aba inativa
- Infinite scroll: cancelar carregamento de página antiga
- Polling: cancelar ao desmontar
- User cancellation: botão "Cancelar" em uploads/downloads

### Quando Não Usar

**Evite se:**
- Requisições muito rápidas (overhead desnecessário)
- Requisições críticas que DEVEM completar (ex: pagamentos)
- Axios versão < 0.22.0 (não suporta AbortController)

---

## ⚠️ Limitações e Considerações Teóricas

### Controller Não é Reusável

```javascript
// ❌ ERRO - tentar reusar controller
const controller = new AbortController();

axios.get('/api/dados', { signal: controller.signal });
controller.abort();

// Tentar reusar (NÃO FUNCIONA!)
axios.get('/api/posts', { signal: controller.signal }); // ← Já aborted!

// ✅ CORRETO - criar novo controller
const controller1 = new AbortController();
axios.get('/api/dados', { signal: controller1.signal });
controller1.abort();

const controller2 = new AbortController();
axios.get('/api/posts', { signal: controller2.signal });
```

### Sempre Verificar CanceledError

```javascript
// ❌ Logar cancelamento como erro
axios.get('/api/dados', { signal: controller.signal })
  .catch(error => {
    console.error('ERRO:', error); // ← Loga cancelamento também!
  });

// ✅ Ignorar CanceledError
axios.get('/api/dados', { signal: controller.signal })
  .catch(error => {
    if (error.name !== 'CanceledError') {
      console.error('ERRO:', error);
    }
  });
```

### Abort Após Resposta Não Tem Efeito

```javascript
const controller = new AbortController();

axios.get('/api/dados', { signal: controller.signal })
  .then(response => {
    console.log('Resposta recebida');
    
    // Abort aqui não tem efeito (já completou)
    controller.abort();
  });
```

---

## 🔗 Interconexões Conceituais

### AbortController e Timeout Config

```javascript
// AbortController (cancelamento manual)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal,
  timeout: 5000 // ← Timeout automático (diferente de abort)
});

// Ambos podem coexistir:
// - timeout: cancela se demorar > 5s
// - abort: cancela manualmente quando quiser
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **CancelToken (deprecated):** API antiga do Axios
2. **Timeout config:** Cancelamento automático por tempo
3. **Cleanup patterns:** Organizar cancelamento em apps grandes

---

## 📚 Conclusão

**AbortController** é a **API moderna e recomendada** para cancelar requisições Axios.

**Dominar AbortController significa:**
- **Criar controller:** `new AbortController()`
- **Passar signal:** `{ signal: controller.signal }`
- **Cancelar:** `controller.abort()`
- **Detectar:** `error.name === 'CanceledError'`
- **Cleanup:** Cancelar em useEffect cleanup

**Use AbortController para:**
- ✅ Cancelar ao desmontar componentes
- ✅ Cancelar pesquisas antigas (search)
- ✅ Evitar race conditions
- ✅ Economizar largura de banda
- ✅ Melhorar UX (cancelar operações lentas)

**Evite:**
- ❌ Reusar controller (criar novo para cada requisição)
- ❌ Logar CanceledError como erro real
- ❌ Usar em Axios < 0.22.0 (não suportado)

Com **AbortController**, você constrói aplicações **eficientes e sem memory leaks**, cancelando requisições quando elas não são mais necessárias.
