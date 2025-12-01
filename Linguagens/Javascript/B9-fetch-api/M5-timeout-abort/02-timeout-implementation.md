# Timeout Implementation: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Timeout implementation** é o processo de **impor limite de tempo** em operações assíncronas (fetch requests, promises), garantindo que operações **não executem indefinidamente**. Conceitualmente, timeout transforma operação **potencialmente infinita** em operação **bounded** (limitada), onde **falha após deadline** é preferível a **aguardar eternamente**, permitindo **error recovery**, **retry logic** e **melhor UX**.

Em Fetch API, timeout **não é nativo** (diferente de XMLHttpRequest), requerendo **implementação manual via AbortController**. Pattern comum é criar **AbortController**, configurar **setTimeout** para abortar após deadline, e **limpar timeout** se request completar antes do limite, evitando **memory leaks** e **cancelamentos espúrios**.

```javascript
// Fetch NÃO tem timeout nativo
fetch('/api/dados-lentos'); // Pode demorar eternamente

// Implementação manual com AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

try {
  const response = await fetch('/api/dados-lentos', {
    signal: controller.signal
  });
  
  clearTimeout(timeoutId); // Limpar se sucesso
  return await response.json();
  
} catch (error) {
  clearTimeout(timeoutId); // Limpar sempre
  
  if (error.name === 'AbortError') {
    throw new Error('Request timeout após 5s');
  }
  throw error;
}
```

### Contexto Histórico e Motivação

**Evolução de Request Timeouts:**

1. **XMLHttpRequest (1999)**: `xhr.timeout` property nativa
2. **Fetch API (2015)**: Sem timeout nativo inicialmente
3. **AbortController (2017)**: Permite implementar timeout via abort
4. **AbortSignal.timeout() (2022)**: Timeout nativo via signal

**Motivação para Timeouts:**

Operações sem timeout podem **travar aplicações**:

```javascript
// Problema: Fetch sem timeout
async function buscarDados() {
  // Se servidor não responder, aguarda eternamente
  const response = await fetch('/api/lento');
  // Usuário vê loading infinito, aplicação trava
}

// Solução: Timeout garante fail-fast
async function buscarDadosComTimeout() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch('/api/lento', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      // Após 5s, mostrar erro ao invés de loading infinito
      throw new Error('Servidor não respondeu a tempo');
    }
    throw error;
  }
}
```

### Problema Fundamental que Resolve

Timeout resolve problemas específicos de async operations:

**1. Infinite Waits**: Prevenir aguardar indefinidamente por servers lentos/travados
**2. Poor UX**: Mostrar erro após timeout ao invés de loading infinito
**3. Resource Leaks**: Liberar connections/memory de requests travados
**4. SLA Compliance**: Garantir operações completam em tempo esperado
**5. Retry Logic**: Timeout permite detectar falha e tentar novamente

### Importância no Ecossistema

Timeout implementation é **essencial para aplicações produção**:

- **APIs Lentas**: Garantir resposta em tempo razoável
- **Network Instability**: Detectar conexões travadas
- **User Experience**: Mostrar feedback após tempo limite
- **Microservices**: Circuit breaker patterns requerem timeouts
- **Mobile Apps**: Economia de bateria (não aguardar infinitamente)

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **No Native Timeout**: Fetch não tem timeout property (diferente de XHR)
2. **AbortController Pattern**: Implementar via setTimeout + abort
3. **Cleanup Required**: clearTimeout essencial para prevenir leaks
4. **Finally Block**: Garantir cleanup em sucesso E erro
5. **AbortSignal.timeout()**: API moderna (2022+) para timeout nativo

### Pilares Fundamentais

- **setTimeout**: Agendar abort após deadline
- **AbortController**: Mecanismo de cancelamento
- **clearTimeout**: Limpar timer se completar antes
- **finally block**: Cleanup garantido
- **Error Detection**: Identificar AbortError como timeout

### Visão Geral das Nuances

- clearTimeout deve ser chamado sempre (sucesso E erro)
- AbortError não indica erro real (timeout intencional)
- Timeout pode ser combinado com signal externo
- Finally é melhor que try/catch para cleanup
- AbortSignal.timeout() simplifica pattern (browsers modernos)

---

## 🧠 Fundamentos Teóricos

### Pattern Básico: setTimeout + AbortController

```javascript
async function fetchComTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    // Limpar timeout se sucesso
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    // Limpar timeout mesmo em erro
    clearTimeout(timeoutId);
    
    // Identificar timeout
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout após ${timeoutMs}ms`);
    }
    
    // Re-throw outros erros
    throw error;
  }
}

// Uso
try {
  const data = await fetchComTimeout('/api/dados', 3000);
  console.log('Dados:', data);
  
} catch (error) {
  console.error('Erro:', error.message);
  // "Request timeout após 3000ms" OU outro erro
}
```

**Componentes Essenciais:**

1. **AbortController**: Permite cancelamento
2. **setTimeout**: Agenda abort após timeout
3. **clearTimeout**: Cancela timer se request completa
4. **Error Detection**: Checar `error.name === 'AbortError'`

### Pattern com Finally Block (Recomendado)

```javascript
async function fetchComTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout após ${timeoutMs}ms`);
    }
    throw error;
    
  } finally {
    // Cleanup SEMPRE executado (sucesso ou erro)
    clearTimeout(timeoutId);
  }
}
```

**Vantagem**: `clearTimeout` em local único, garantido executar.

### AbortSignal.timeout() - API Moderna

```javascript
// Browser moderno (2022+)
async function fetchComTimeoutModerno(url, timeoutMs = 5000) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout após ${timeoutMs}ms`);
    }
    throw error;
  }
}
```

**Vantagens**:
- Sem AbortController manual
- Sem clearTimeout necessário
- Código mais limpo

**Desvantagem**:
- Browser support limitado (polyfill necessário em browsers antigos)

### Polyfill para AbortSignal.timeout()

```javascript
// Polyfill simples
if (!AbortSignal.timeout) {
  AbortSignal.timeout = function(ms) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  };
}

// Uso - funciona em browsers antigos e novos
const signal = AbortSignal.timeout(5000);
fetch('/api/dados', { signal });
```

### Combinando Timeout com Signal Externo

```javascript
function fetchComTimeoutESignal(url, options = {}, timeoutMs = 5000) {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error('Timeout'));
  }, timeoutMs);
  
  // Signal externo (ex: cleanup de componente)
  const externalSignal = options.signal;
  
  // Combinar signals
  let signal = timeoutController.signal;
  
  if (externalSignal) {
    // Se signal externo abortar, abortar timeout também
    externalSignal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      timeoutController.abort(externalSignal.reason);
    });
    
    if (externalSignal.aborted) {
      clearTimeout(timeoutId);
      signal = externalSignal;
    }
  }
  
  return fetch(url, {
    ...options,
    signal
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

// Uso - timeout + cleanup de componente
const userController = new AbortController();

fetchComTimeoutESignal('/api/dados', {
  signal: userController.signal
}, 5000);

// Cleanup ao desmontar componente
// userController.abort();
```

### Timeout Diferente por Tipo de Request

```javascript
const TIMEOUTS = {
  fast: 2000,      // APIs rápidas (cache, static)
  normal: 5000,    // APIs normais
  slow: 10000,     // APIs lentas (relatórios, analytics)
  upload: 30000    // Upload de arquivos
};

async function fetchComTimeoutAdaptativo(url, type = 'normal') {
  const timeoutMs = TIMEOUTS[type] || TIMEOUTS.normal;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout ${type} (${timeoutMs}ms) excedido`);
    }
    throw error;
    
  } finally {
    clearTimeout(timeoutId);
  }
}

// Uso
await fetchComTimeoutAdaptativo('/api/cache', 'fast');     // 2s timeout
await fetchComTimeoutAdaptativo('/api/usuarios', 'normal'); // 5s timeout
await fetchComTimeoutAdaptativo('/api/relatorio', 'slow');  // 10s timeout
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Timeout com Retry

```javascript
async function fetchComTimeoutERetry(url, options = {}) {
  const maxRetries = 3;
  const timeoutMs = 5000;
  
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new Error('Timeout'));
    }, timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      
      // Retry apenas em timeouts e network errors
      const isRetriable = (
        error.name === 'AbortError' || // Timeout
        error.name === 'TypeError'     // Network error
      );
      
      if (!isRetriable || attempt === maxRetries - 1) {
        break;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Timeout - retry ${attempt + 1} em ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  if (lastError.name === 'AbortError') {
    throw new Error(`Timeout após ${maxRetries} tentativas`);
  }
  
  throw lastError;
}

// Uso
try {
  const data = await fetchComTimeoutERetry('/api/dados-lentos');
  
} catch (error) {
  console.error('Falha após retries:', error.message);
}
```

### Pattern 2: Timeout Progressivo

```javascript
async function fetchComTimeoutProgressivo(url, baseTimeout = 3000) {
  const maxRetries = 3;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    // Timeout aumenta a cada retry
    const timeoutMs = baseTimeout * (attempt + 1);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      console.log(`Tentativa ${attempt + 1} - timeout: ${timeoutMs}ms`);
      
      const response = await fetch(url, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        if (attempt === maxRetries - 1) {
          throw new Error(`Timeout após ${maxRetries} tentativas (último timeout: ${timeoutMs}ms)`);
        }
        
        console.log(`Timeout - tentando com timeout maior`);
        continue;
      }
      
      // Outros erros - não retry
      throw error;
    }
  }
}

// Uso - timeouts progressivos: 3s, 6s, 9s
await fetchComTimeoutProgressivo('/api/dados', 3000);
```

### Pattern 3: Timeout com Progress Callback

```javascript
async function fetchComTimeoutEProgresso(url, timeoutMs = 10000, onProgress) {
  const controller = new AbortController();
  
  let timeoutId;
  let progressInterval;
  
  const startTime = Date.now();
  
  // Progress callback a cada segundo
  if (onProgress) {
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, timeoutMs - elapsed);
      const progress = (elapsed / timeoutMs) * 100;
      
      onProgress({
        elapsed,
        remaining,
        progress: Math.min(100, progress)
      });
    }, 1000);
  }
  
  // Timeout
  timeoutId = setTimeout(() => {
    controller.abort(new Error('Timeout'));
  }, timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Timeout após ${timeoutMs}ms`);
    }
    throw error;
    
  } finally {
    clearTimeout(timeoutId);
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  }
}

// Uso
await fetchComTimeoutEProgresso('/api/dados', 10000, (progress) => {
  console.log(`Progresso: ${progress.progress.toFixed(0)}% - Restam ${progress.remaining}ms`);
});
```

### Pattern 4: Timeout Wrapper Reutilizável

```javascript
class FetchWithTimeout {
  constructor(defaultTimeout = 5000) {
    this.defaultTimeout = defaultTimeout;
  }
  
  async fetch(url, options = {}) {
    const timeoutMs = options.timeout || this.defaultTimeout;
    const controller = new AbortController();
    
    // Combinar signal existente
    const originalSignal = options.signal;
    
    if (originalSignal) {
      originalSignal.addEventListener('abort', () => {
        controller.abort(originalSignal.reason);
      });
    }
    
    const timeoutId = setTimeout(() => {
      controller.abort(new Error(`Timeout após ${timeoutMs}ms`));
    }, timeoutMs);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        // Distinguir timeout de abort manual
        if (error.message.includes('Timeout')) {
          throw new Error(`Request timeout: ${url}`);
        }
        throw new Error('Request cancelado');
      }
      
      throw error;
      
    } finally {
      clearTimeout(timeoutId);
    }
  }
  
  async get(url, options = {}) {
    return this.fetch(url, { ...options, method: 'GET' });
  }
  
  async post(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    });
  }
}

// Uso
const api = new FetchWithTimeout(3000); // Default 3s timeout

// GET com timeout padrão
const response1 = await api.get('/api/usuarios');
const usuarios = await response1.json();

// POST com timeout customizado
const response2 = await api.post('/api/usuarios', {
  nome: 'João'
}, { timeout: 10000 }); // 10s para upload
```

### Pattern 5: Timeout com Fallback

```javascript
async function fetchComTimeoutEFallback(primaryUrl, fallbackUrl, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(primaryUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Timeout - tentar fallback
    if (error.name === 'AbortError') {
      console.warn('Primary URL timeout - tentando fallback');
      
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(
        () => fallbackController.abort(),
        timeoutMs
      );
      
      try {
        const fallbackResponse = await fetch(fallbackUrl, {
          signal: fallbackController.signal
        });
        
        clearTimeout(fallbackTimeoutId);
        
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP ${fallbackResponse.status}`);
        }
        
        return await fallbackResponse.json();
        
      } catch (fallbackError) {
        clearTimeout(fallbackTimeoutId);
        
        if (fallbackError.name === 'AbortError') {
          throw new Error('Ambos URLs (primary e fallback) timeout');
        }
        
        throw fallbackError;
      }
    }
    
    // Outros erros - não tentar fallback
    throw error;
  }
}

// Uso
const data = await fetchComTimeoutEFallback(
  '/api/dados',
  '/api/dados-cache',
  3000
);
```

### Pattern 6: React Hook com Timeout

```javascript
import { useState, useEffect } from 'react';

function useFetchWithTimeout(url, timeoutMs = 5000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort(new Error('Timeout'));
    }, timeoutMs);
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url, {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!controller.signal.aborted) {
          setData(result);
        }
        
      } catch (err) {
        clearTimeout(timeoutId);
        
        if (!controller.signal.aborted) {
          if (err.name === 'AbortError') {
            setError(new Error(`Timeout após ${timeoutMs}ms`));
          } else {
            setError(err);
          }
        }
        
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
    
  }, [url, timeoutMs]);
  
  return { data, loading, error };
}

// Uso
function UserProfile({ userId }) {
  const { data, loading, error } = useFetchWithTimeout(
    `/api/usuarios/${userId}`,
    3000
  );
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return <div>{data.nome}</div>;
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Timeouts

**✅ APIs Externas**: Prevenir aguardar servidores lentos
**✅ Network Instability**: Mobile, conexões ruins
**✅ User Experience**: Mostrar erro após tempo razoável
**✅ Microservices**: Circuit breaker patterns
**✅ Critical Operations**: Garantir SLA

### Timeouts Recomendados

**API REST normal**: 5-10s
**APIs lentas (reports)**: 30-60s
**Upload/Download**: 60-300s
**Cache/Static**: 1-2s
**Health checks**: 1-5s

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. No Native Support**: Fetch não tem timeout property
**2. Cleanup Required**: clearTimeout essencial (memory leak se omitido)
**3. Server Resources**: Timeout não cancela processamento no servidor
**4. AbortSignal.timeout() Support**: Browsers antigos requerem polyfill

### Armadilhas Comuns

#### Armadilha 1: Esquecer clearTimeout

```javascript
// ❌ MEMORY LEAK - timeout não limpo
async function fetchBad(url) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);
  return fetch(url, { signal: controller.signal });
}

// ✅ CORRETO - sempre limpar
async function fetchGood(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
```

#### Armadilha 2: Timeout Muito Curto

```javascript
// ❌ FALSO POSITIVO - timeout muito agressivo
const data = await fetchComTimeout('/api/relatorio', 1000); // 1s

// ✅ CORRETO - timeout razoável para operação
const data = await fetchComTimeout('/api/relatorio', 30000); // 30s
```

---

## 🔗 Interconexões Conceituais

### Relação com AbortController

Timeout **usa AbortController** para cancelamento.

### Relação com Error Handling

Timeout errors devem ser **tratados diferentemente** de outros errors.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar timeout:
1. **Request Cancellation**: User-initiated cancellation
2. **Circuit Breaker**: Parar requests após timeouts consecutivos
3. **Adaptive Timeouts**: Ajustar dinamicamente por latência

---

## 📚 Conclusão

Timeout implementation é **essencial para aplicações robustas**.

Dominar timeouts significa:
- Implementar via **setTimeout + AbortController**
- **Limpar timeouts** com clearTimeout (sempre)
- Usar **finally block** para cleanup garantido
- **Detectar AbortError** e tratar como timeout
- Considerar **AbortSignal.timeout()** (browsers modernos)

É fundamental para prevenir operações infinitas e melhorar UX.
