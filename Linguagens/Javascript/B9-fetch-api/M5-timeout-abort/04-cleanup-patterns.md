# Cleanup Patterns: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Cleanup patterns** são **padrões arquiteturais** para **liberar recursos** alocados durante operações assíncronas, garantindo que **memória**, **conexões de rede**, **event listeners**, **timers** e **promises** sejam **adequadamente descartados** quando não mais necessários. Conceitualmente, cleanup transforma código de **fire-and-forget** (disparar e esquecer) em **resource-aware** (consciente de recursos), prevenindo **memory leaks**, **stale updates** e **performance degradation**.

Cleanup é **responsabilidade do desenvolvedor**: JavaScript **não limpa automaticamente** resources ao desmontar componentes ou cancelar operações. Aplicação deve **explicitamente** cancelar timers, abortar requests, remover listeners, e **verificar signal.aborted** antes de state updates. **Pattern fundamental**: **always cleanup**, especialmente em **component lifecycle** (React useEffect, Vue onUnmounted).

```javascript
// ❌ SEM CLEANUP - memory leak
function ComponentSemCleanup() {
  useEffect(() => {
    const controller = new AbortController();
    
    fetch('/api/dados', { signal: controller.signal })
      .then(res => res.json())
      .then(data => setData(data)); // State update mesmo após unmount
    
    // FALTA cleanup - request continua, causa leak
  }, []);
}

// ✅ COM CLEANUP - correto
function ComponentComCleanup() {
  useEffect(() => {
    const controller = new AbortController();
    
    fetch('/api/dados', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (!controller.signal.aborted) {
          setData(data); // Só atualizar se não cancelado
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
    
    // Cleanup - abortar ao desmontar
    return () => controller.abort();
  }, []);
}
```

### Contexto Histórico e Motivação

**Evolução de Cleanup:**

1. **Early JavaScript (1995-2010)**: Cleanup manual via `clearTimeout`, `removeEventListener`
2. **jQuery era (2006-2015)**: `$(element).off()` para cleanup de events
3. **React (2013+)**: `componentWillUnmount`, `useEffect cleanup function`
4. **Modern (2017+)**: AbortController para cleanup de async operations

**Motivação para Cleanup Patterns:**

SPAs (Single Page Applications) criam/destroem componentes dinamicamente, causando problemas se cleanup não for feito:

```javascript
// Problema: Component desmonta mas request continua
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data)); // ❌ Atualiza state após unmount
  }, [userId]);
}

// Memory leak: state update em componente desmontado
// Warning: "Can't perform a React state update on an unmounted component"
```

### Problema Fundamental que Resolve

Cleanup patterns resolvem problemas específicos:

**1. Memory Leaks**: Timers/listeners não removidos consomem memória indefinidamente
**2. Stale Updates**: State updates após unmount causam warnings/bugs
**3. Resource Waste**: Requests continuam após componente desmontar
**4. Event Handler Leaks**: Listeners acumulam a cada render
**5. Race Conditions**: Requests antigos podem sobrescrever novos

### Importância no Ecossistema

Cleanup patterns são **essenciais para aplicações robustas**:

- **React**: useEffect cleanup previne memory leaks
- **Vue**: onUnmounted/onBeforeUnmount para cleanup
- **Svelte**: onDestroy para cleanup
- **Async Operations**: Cancelar fetch, timers, listeners
- **Event-Driven Apps**: Remover listeners ao destruir componentes

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Resource Lifecycle**: Criar → Usar → Cleanup
2. **Cleanup Timing**: Ao desmontar, mudar dependencies, cancelar
3. **Verification**: Checar signal.aborted antes de side effects
4. **Idempotence**: Cleanup pode ser chamado múltiplas vezes
5. **Completeness**: Cleanup deve liberar TODOS recursos alocados

### Pilares Fundamentais

- **AbortController**: Cancelar fetch requests
- **clearTimeout/clearInterval**: Limpar timers
- **removeEventListener**: Remover event listeners
- **signal.aborted check**: Prevenir stale updates
- **finally block**: Garantir cleanup mesmo com erro

### Visão Geral das Nuances

- Cleanup deve ser **idempotent** (safe chamar múltiplas vezes)
- **Finally block** garante cleanup em success/error/cancel
- **signal.aborted** deve ser checado antes de state updates
- Cleanup em **useEffect** executa antes de próximo effect
- Missing cleanup causa **memory leaks** e **performance degradation**

---

## 🧠 Fundamentos Teóricos

### Cleanup Básico em React

```javascript
import { useEffect, useState } from 'react';

function BasicCleanup() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Setup
    const controller = new AbortController();
    
    fetch('/api/dados', { signal: controller.signal })
      .then(res => res.json())
      .then(result => {
        // Verificar antes de atualizar
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
    
    // Cleanup function
    return () => {
      controller.abort();
    };
  }, []); // Dependencies
  
  return <div>{JSON.stringify(data)}</div>;
}
```

**Conceitos:**
- **Setup**: Criar resources (controller, fetch)
- **Usage**: Usar resources (fetch data)
- **Cleanup**: Liberar resources (abort)
- **Verification**: Checar signal.aborted antes de setData

### Cleanup de Timers

```javascript
function TimerCleanup() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Setup - criar interval
    const intervalId = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    
    // Cleanup - limpar interval
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  return <div>Count: {count}</div>;
}

// Sem cleanup:
// ❌ Interval continua após unmount
// ❌ Memory leak
// ❌ State update em componente desmontado
```

### Cleanup de Event Listeners

```javascript
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    // Setup - adicionar listener
    function handleScroll() {
      setScrollY(window.scrollY);
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup - remover listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return <div>Scroll: {scrollY}px</div>;
}

// Sem cleanup:
// ❌ Listener persiste após unmount
// ❌ Handler executa em componente desmontado
// ❌ Listeners acumulam a cada mount/unmount
```

### Cleanup Completo (Múltiplos Resources)

```javascript
function ComprehensiveCleanup({ userId }) {
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    // Resources
    const controller = new AbortController();
    let intervalId = null;
    
    // Listener
    function handleOnline() {
      setOnline(navigator.onLine);
    }
    
    // Setup
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOnline);
    
    // Fetch
    fetch(`/api/users/${userId}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => {
        if (!controller.signal.aborted) {
          setUser(data);
        }
      })
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      });
    
    // Timer
    intervalId = setInterval(() => {
      if (!controller.signal.aborted) {
        setElapsed(e => e + 1);
      }
    }, 1000);
    
    // Cleanup - liberar TODOS resources
    return () => {
      controller.abort();
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOnline);
    };
  }, [userId]);
  
  return (
    <div>
      <div>User: {user?.name}</div>
      <div>Online: {online ? 'Yes' : 'No'}</div>
      <div>Elapsed: {elapsed}s</div>
    </div>
  );
}
```

**Cleanup checklist:**
- ✅ Abort fetch (controller.abort)
- ✅ Clear interval (clearInterval)
- ✅ Remove listeners (removeEventListener × 2)
- ✅ Check signal.aborted antes de state updates

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Finally Block para Cleanup Garantido

```javascript
async function fetchWithCleanup(url) {
  const controller = new AbortController();
  let timeoutId = null;
  
  try {
    // Setup timeout
    timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelado/timeout');
    } else {
      console.error('Erro:', error);
    }
    throw error;
    
  } finally {
    // Cleanup SEMPRE executa (success/error/cancel)
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
  }
}
```

**Benefício**: Finally garante cleanup mesmo se exception ou early return.

### Pattern 2: Cleanup Token (Centralizado)

```javascript
class CleanupToken {
  constructor() {
    this.controller = new AbortController();
    this.timers = new Set();
    this.listeners = new Map();
  }
  
  get signal() {
    return this.controller.signal;
  }
  
  get aborted() {
    return this.controller.signal.aborted;
  }
  
  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      this.timers.delete(id);
      if (!this.aborted) {
        callback();
      }
    }, delay);
    
    this.timers.add(id);
    return id;
  }
  
  setInterval(callback, delay) {
    const id = setInterval(() => {
      if (!this.aborted) {
        callback();
      }
    }, delay);
    
    this.timers.add(id);
    return id;
  }
  
  addEventListener(target, event, handler, options) {
    if (!this.listeners.has(target)) {
      this.listeners.set(target, []);
    }
    
    this.listeners.get(target).push({ event, handler, options });
    target.addEventListener(event, handler, options);
  }
  
  cleanup() {
    // Abort requests
    this.controller.abort();
    
    // Clear timers
    for (const id of this.timers) {
      clearTimeout(id); // Funciona para timeout e interval
    }
    this.timers.clear();
    
    // Remove listeners
    for (const [target, handlers] of this.listeners) {
      for (const { event, handler, options } of handlers) {
        target.removeEventListener(event, handler, options);
      }
    }
    this.listeners.clear();
  }
}

// Uso
function Component() {
  useEffect(() => {
    const token = new CleanupToken();
    
    // Fetch
    fetch('/api/data', { signal: token.signal })
      .then(res => res.json())
      .then(data => {
        if (!token.aborted) {
          setData(data);
        }
      });
    
    // Timer
    token.setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Listener
    token.addEventListener(window, 'resize', () => {
      console.log('Resized');
    });
    
    // Cleanup centralizado
    return () => token.cleanup();
  }, []);
}
```

**Benefício**: Cleanup centralizado - impossível esquecer algum resource.

### Pattern 3: React Custom Hook com Cleanup

```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        // Verificar antes de atualizar
        if (!controller.signal.aborted) {
          setData(result);
        }
        
      } catch (err) {
        if (err.name !== 'AbortError' && !controller.signal.aborted) {
          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    // Cleanup
    return () => controller.abort();
    
  }, [url, JSON.stringify(options)]);
  
  return { data, loading, error };
}

// Uso (cleanup automático)
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data?.name}</div>;
}

// Hook cuida de cleanup automaticamente
```

### Pattern 4: Vue Composition API Cleanup

```javascript
import { ref, onMounted, onUnmounted } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  let controller = null;
  
  async function fetchData() {
    controller = new AbortController();
    
    try {
      loading.value = true;
      error.value = null;
      
      const response = await fetch(url, {
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!controller.signal.aborted) {
        data.value = result;
      }
      
    } catch (err) {
      if (err.name !== 'AbortError' && !controller.signal.aborted) {
        error.value = err;
      }
    } finally {
      if (!controller.signal.aborted) {
        loading.value = false;
      }
    }
  }
  
  onMounted(() => {
    fetchData();
  });
  
  // Cleanup ao desmontar
  onUnmounted(() => {
    if (controller) {
      controller.abort();
    }
  });
  
  return { data, loading, error };
}

// Uso
export default {
  setup() {
    const { data, loading, error } = useFetch('/api/users');
    
    return { data, loading, error };
  }
};
```

### Pattern 5: Cleanup com Dependencies

```javascript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    // query mudou - cancelar search anterior
    const controller = new AbortController();
    
    async function search() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        
        if (!controller.signal.aborted) {
          setResults(data.results);
        }
        
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      }
    }
    
    search();
    
    // Cleanup - executa quando query mudar ou desmontar
    return () => controller.abort();
    
  }, [query]); // Dependency - cleanup ao mudar
  
  return (
    <ul>
      {results.map(item => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
```

**Conceito**: Cleanup executa **antes de próximo effect** quando dependency muda.

### Pattern 6: Cleanup Checklist

```javascript
function CleanupChecklist() {
  useEffect(() => {
    // 1. AbortController para requests
    const controller = new AbortController();
    
    // 2. IDs para timers
    let timeoutId = null;
    let intervalId = null;
    
    // 3. Handlers para listeners
    const handleResize = () => console.log('Resize');
    const handleScroll = () => console.log('Scroll');
    
    // Setup
    fetch('/api/data', { signal: controller.signal });
    
    timeoutId = setTimeout(() => {
      console.log('Timeout');
    }, 5000);
    
    intervalId = setInterval(() => {
      console.log('Interval');
    }, 1000);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup - verificar TODOS resources
    return () => {
      // ✅ 1. Abort requests
      controller.abort();
      
      // ✅ 2. Clear timers
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
      
      // ✅ 3. Remove listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}
```

**Checklist:**
- ✅ AbortController.abort() para fetch
- ✅ clearTimeout() para timeouts
- ✅ clearInterval() para intervals
- ✅ removeEventListener() para listeners
- ✅ Verificar signal.aborted antes de state updates

---

## 🎯 Aplicabilidade e Contextos

### Quando Fazer Cleanup

**✅ Component Unmount**: Sempre fazer cleanup
**✅ Dependency Change**: Cleanup ao mudar dependency
**✅ Navigation**: Cleanup ao sair de página
**✅ Modal/Dialog Close**: Cleanup ao fechar
**✅ Tab Switch**: Cleanup ao trocar tab

### Resources que Requerem Cleanup

**✅ Fetch Requests**: AbortController.abort()
**✅ Timeouts**: clearTimeout()
**✅ Intervals**: clearInterval()
**✅ Event Listeners**: removeEventListener()
**✅ WebSocket**: socket.close()
**✅ Observers**: observer.disconnect()

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Manual Process**: JavaScript não cleanup automaticamente
**2. Developer Responsibility**: Fácil esquecer cleanup
**3. No Compiler Checks**: Sem warnings se esquecer cleanup
**4. React DevTools**: Não mostram missing cleanup

### Armadilhas Comuns

#### Armadilha 1: Esquecer clearTimeout

```javascript
// ❌ ERRO - memory leak
useEffect(() => {
  const id = setTimeout(() => {
    setData('Data');
  }, 5000);
  
  // FALTA clearTimeout
}, []);

// ✅ CORRETO
useEffect(() => {
  const id = setTimeout(() => {
    setData('Data');
  }, 5000);
  
  return () => clearTimeout(id);
}, []);
```

#### Armadilha 2: Não Verificar signal.aborted

```javascript
// ❌ ERRO - state update após cancel
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data)); // Atualiza mesmo cancelado
  
  return () => controller.abort();
}, []);

// ✅ CORRETO
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => {
      if (!controller.signal.aborted) {
        setData(data);
      }
    });
  
  return () => controller.abort();
}, []);
```

#### Armadilha 3: Listener Acumulation

```javascript
// ❌ ERRO - listeners acumulam
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // FALTA removeEventListener
});

// A cada render: novo listener adicionado
// Após 100 renders: 100 listeners ativos (memory leak)

// ✅ CORRETO
useEffect(() => {
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
```

#### Armadilha 4: Cleanup Incompleto

```javascript
// ❌ ERRO - cleanup parcial
useEffect(() => {
  const controller = new AbortController();
  const intervalId = setInterval(() => {}, 1000);
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    controller.abort();
    // FALTA clearInterval
    // FALTA removeEventListener
  };
}, []);

// ✅ CORRETO - cleanup completo
useEffect(() => {
  const controller = new AbortController();
  const intervalId = setInterval(() => {}, 1000);
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    controller.abort();
    clearInterval(intervalId);
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### Best Practices

**1. Always Cleanup**: Criar cleanup function em TODOS useEffect com side effects
**2. Finally Block**: Usar finally para cleanup garantido
**3. Verification**: Checar signal.aborted antes de state updates
**4. Checklist**: Revisar todos resources alocados no setup
**5. Testing**: Testar component unmount para verificar cleanup

---

## 🔗 Interconexões Conceituais

### Relação com AbortController

Cleanup **usa AbortController.abort()** para cancelar fetch requests.

### Relação com Component Lifecycle

Cleanup ocorre em **unmount** e **dependency change**.

### Relação com Memory Management

Cleanup **previne memory leaks** liberando resources.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar cleanup patterns:
1. **Resource Pools**: Reusar resources (connection pools)
2. **Circuit Breaker**: Parar operações após failures
3. **Observability**: Monitorar resource usage

---

## 📚 Conclusão

Cleanup patterns são **fundamentais para aplicações robustas**.

Dominar cleanup significa:
- **Sempre** fazer cleanup em useEffect com side effects
- **Verificar** signal.aborted antes de state updates
- **Usar** finally block para cleanup garantido
- **Criar checklist** de resources a liberar
- **Testar** component unmount para verificar cleanup

É essencial para prevenir memory leaks e garantir performance.
