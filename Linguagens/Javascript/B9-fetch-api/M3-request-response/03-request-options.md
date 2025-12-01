# Request Options com Fetch API: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Request options** são **parâmetros de configuração** passados no segundo argumento de `fetch()`, controlando **comportamento da requisição** além de URL, método, headers e body. Conceitualmente, options permitem ajustar **políticas de segurança** (CORS mode, credentials), **estratégias de cache**, **comportamento de redirects**, **timeouts** (via AbortController) e **metadata** (referrer, integrity).

Options transformam fetch de chamada simples em ferramenta **configurável e segura**, permitindo que desenvolvedores especifiquem exatamente como request deve ser executado, desde permitir/bloquear cookies até validar integridade de recursos via checksums.

```javascript
// Simples (padrões)
fetch(url);

// Configurado (options customizadas)
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  mode: 'cors',              // CORS policy
  credentials: 'include',    // Enviar cookies
  cache: 'no-cache',         // Bypass cache
  redirect: 'follow',        // Seguir redirects
  referrer: 'client',        // Referer header
  integrity: 'sha256-...',   // Subresource Integrity
  signal: abortSignal        // Abort/timeout control
});
```

### Contexto Histórico e Motivação

**Evolução de Request Configuration:**

1. **XMLHttpRequest (1999)**: Múltiplos métodos/propriedades dispersos (`xhr.withCredentials`, `xhr.timeout`, etc.)
2. **Fetch API (2015)**: Options centralizadas em objeto único, defaults sensatos
3. **Evolução (2016+)**: Adição de `signal`, `integrity`, `keepalive`

**Motivação para Request Options:**

XMLHttpRequest tinha configuração **fragmentada e confusa**:

```javascript
// XMLHttpRequest (antigo)
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.withCredentials = true;    // Propriedade separada
xhr.timeout = 5000;            // Outra propriedade
xhr.setRequestHeader('...'); // Método diferente
xhr.send();

// Fetch (moderno)
fetch(url, {
  credentials: 'include',
  // timeout via AbortController (mais flexível)
  signal: abortSignal
});
```

### Problema Fundamental que Resolve

Request options resolvem problemas específicos de controle de requests:

**1. CORS Control**: `mode` especifica política cross-origin (cors, no-cors, same-origin)
**2. Cookie Handling**: `credentials` controla envio de cookies/auth headers
**3. Cache Strategy**: `cache` define quando usar/bypass cache
**4. Security**: `integrity` valida recursos contra checksums conhecidos
**5. Cancellation**: `signal` permite abortar requests in-flight

### Importância no Ecossistema

Request options são **essenciais para aplicações reais**:

- **Security**: `mode: 'cors'` garante CORS compliance
- **Authentication**: `credentials: 'include'` para cookie-based auth
- **Performance**: `cache` options otimizam network usage
- **User Experience**: `signal` permite cancelar requests (melhora UX)
- **Integrity**: `integrity` protege contra CDN compromises

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Defaults Sensatos**: Fetch usa defaults seguros se options omitidas
2. **Security-First**: `mode`, `credentials` previnem vazamentos acidentais
3. **Composability**: Options podem ser combinadas arbitrariamente
4. **Immutability**: Options não modificam behavior global, apenas request específico
5. **Progressive Enhancement**: Options novas adicionadas sem quebrar código antigo

### Pilares Fundamentais

- **mode**: Política CORS (cors, no-cors, same-origin, navigate)
- **credentials**: Envio de cookies (omit, same-origin, include)
- **cache**: Estratégia de cache (default, no-store, reload, etc.)
- **redirect**: Comportamento de redirects (follow, error, manual)
- **signal**: AbortSignal para cancelamento

### Visão Geral das Nuances

- `mode: 'no-cors'` resulta em response opaque (dados inacessíveis)
- `credentials: 'include'` requer CORS header `Access-Control-Allow-Credentials`
- `cache: 'only-if-cached'` requer `mode: 'same-origin'`
- `redirect: 'manual'` retorna response opaqueredirect
- `signal` permite timeout customizado (não existe timeout option nativo)

---

## 🧠 Fundamentos Teóricos

### mode - CORS Policy

**Controla política de cross-origin requests**.

```javascript
// Valores: 'cors' | 'no-cors' | 'same-origin' | 'navigate'
```

#### 1. cors (Default)

**Permite cross-origin se servidor enviar headers CORS apropriados**.

```javascript
fetch('https://api.externa.com/dados', {
  mode: 'cors' // Default
});

// Request inclui: Origin: https://meu-site.com
// Servidor deve responder: Access-Control-Allow-Origin: https://meu-site.com
// Se servidor não responder CORS headers → Promise rejeita
```

**Conceito**: Modo seguro padrão - permite cross-origin com permissão explícita do servidor.

#### 2. no-cors

**Permite cross-origin SEM CORS headers, mas response é opaque**.

```javascript
fetch('https://api-sem-cors.com/dados', {
  mode: 'no-cors'
});

// Promise resolve, mas:
// - response.type === 'opaque'
// - response.status === 0
// - response.body inacessível
// - headers inacessíveis
```

**Uso**: Service Workers (cachear recursos cross-origin mesmo sem CORS), embed scripts/styles.

**⚠️ Limitação**: Dados completamente inacessíveis via JavaScript.

#### 3. same-origin

**Permite apenas same-origin requests, rejeita cross-origin**.

```javascript
// Same-origin - OK
fetch('/api/dados', {
  mode: 'same-origin'
});

// Cross-origin - Promise rejeita
fetch('https://api.externa.com/dados', {
  mode: 'same-origin'
}); // TypeError: Failed to fetch
```

**Uso**: Garantir que apenas same-origin requests sejam feitas (extra segurança).

#### 4. navigate

**Para navegações (uso interno de browsers, raro em código manual)**.

### credentials - Cookie/Auth Handling

**Controla envio de cookies, HTTP auth, TLS client certificates**.

```javascript
// Valores: 'omit' | 'same-origin' | 'include'
```

#### 1. same-origin (Default)

**Envia credentials apenas para same-origin requests**.

```javascript
// Same-origin - envia cookies
fetch('/api/dados', {
  credentials: 'same-origin' // Default
});

// Cross-origin - NÃO envia cookies
fetch('https://api.externa.com/dados', {
  credentials: 'same-origin'
});
```

#### 2. include

**Envia credentials para todos requests (same-origin E cross-origin)**.

```javascript
fetch('https://api.externa.com/dados', {
  credentials: 'include'
});

// Servidor DEVE responder:
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: https://meu-site.com (não pode ser *)
```

**Uso**: Cookie-based authentication cross-origin, SSO.

#### 3. omit

**NUNCA envia credentials (mesmo same-origin)**.

```javascript
fetch('/api/dados-publicos', {
  credentials: 'omit'
});
// Cookies não incluídos
```

**Uso**: Requests públicos, evitar envio acidental de auth.

### cache - Cache Strategy

**Controla interação com HTTP cache**.

```javascript
// Valores: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
```

#### 1. default

**Comportamento padrão de cache do browser** (segue Cache-Control headers).

```javascript
fetch(url, {
  cache: 'default'
});
```

#### 2. no-store

**Bypass cache completamente** (não consulta nem atualiza).

```javascript
fetch('/api/dados-frescos', {
  cache: 'no-store'
});
// Sempre busca do servidor, não cacheia response
```

**Uso**: Dados sensíveis que não devem ser cacheados.

#### 3. reload

**Bypass cache, mas atualiza cache com nova response**.

```javascript
fetch(url, {
  cache: 'reload'
});
// Ignora cache, busca servidor, atualiza cache
```

**Uso**: "Hard refresh" programático.

#### 4. no-cache

**Revalidação condicional** (usa cache se servidor confirmar que está atualizado).

```javascript
fetch(url, {
  cache: 'no-cache'
});
// Envia: If-None-Match: <etag>
// Se servidor responde 304: usa cache
// Se servidor responde 200: usa nova response
```

**Uso**: Garantir dados atualizados mas economizar banda.

#### 5. force-cache

**Usa cache mesmo se expirado** (apenas busca servidor se não há cache).

```javascript
fetch(url, {
  cache: 'force-cache'
});
```

**Uso**: Economizar banda, aceitar dados possivelmente desatualizados.

#### 6. only-if-cached

**Retorna apenas se em cache, falha caso contrário** (requer `mode: 'same-origin'`).

```javascript
fetch(url, {
  cache: 'only-if-cached',
  mode: 'same-origin'
});
// Se em cache: retorna
// Se não em cache: rejeita
```

**Uso**: Offline-first strategies.

### redirect - Redirect Handling

**Controla comportamento ao encontrar redirects (3xx)**.

```javascript
// Valores: 'follow' | 'error' | 'manual'
```

#### 1. follow (Default)

**Segue redirects automaticamente** (até 20 redirects).

```javascript
fetch('https://exemplo.com/redirect', {
  redirect: 'follow' // Default
});
// Se servidor retorna 302 → segue automaticamente
// response.url mostra URL final
```

#### 2. error

**Rejeita Promise ao encontrar redirect**.

```javascript
fetch(url, {
  redirect: 'error'
});
// Se servidor retorna 3xx → Promise rejeita
```

**Uso**: Garantir que não há redirects (security, tracking).

#### 3. manual

**Retorna response com status 3xx, não segue** (response opaqueredirect).

```javascript
fetch(url, {
  redirect: 'manual'
});
// response.type === 'opaqueredirect'
// response.status === 0
```

**Uso**: Service Workers, controle manual de redirects.

### signal - Abort/Timeout Control

**AbortSignal para cancelar requests**.

```javascript
const controller = new AbortController();

fetch(url, {
  signal: controller.signal
});

// Abortar request
controller.abort();
// Promise rejeita com DOMException: 'AbortError'
```

**Uso: Timeout Implementation**

```javascript
// Timeout de 5 segundos
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, {
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  return await response.json();
  
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timeout');
  }
  throw error;
}
```

**Uso: User Cancellation**

```javascript
// Cancelar request quando usuário navega
const controller = new AbortController();

fetchDados(url, controller.signal);

// Cleanup ao desmontar componente (React)
useEffect(() => {
  const controller = new AbortController();
  
  fetchDados(url, controller.signal);
  
  return () => controller.abort(); // Cancelar ao desmontar
}, []);
```

### Outras Options

#### referrer

**Controla Referer header**.

```javascript
fetch(url, {
  referrer: '' // Sem Referer
});

fetch(url, {
  referrer: 'https://site-origem.com' // Referer customizado
});

fetch(url, {
  referrer: 'client' // Default - browser decide
});
```

#### referrerPolicy

**Política de Referer**.

```javascript
fetch(url, {
  referrerPolicy: 'no-referrer' // Não enviar Referer
});

fetch(url, {
  referrerPolicy: 'origin' // Apenas origin, sem path
});

fetch(url, {
  referrerPolicy: 'strict-origin-when-cross-origin' // Default
});
```

#### integrity

**Subresource Integrity** - valida checksum.

```javascript
fetch('/script.js', {
  integrity: 'sha256-abc123...'
});
// Se checksum não bater → Promise rejeita
```

**Uso**: Garantir que CDN não foi comprometido.

#### keepalive

**Mantém request alive após página fechar**.

```javascript
fetch('/api/analytics', {
  method: 'POST',
  body: analyticsData,
  keepalive: true
});
// Request continua mesmo se usuário fechar aba
```

**Uso**: Analytics, logging (alternativa a `navigator.sendBeacon()`).

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Fetch com Timeout

```javascript
function fetchComTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  return fetch(url, {
    ...options,
    signal: controller.signal
  }).then(response => {
    clearTimeout(timeoutId);
    return response;
  }).catch(error => {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout após ${timeoutMs}ms`);
    }
    throw error;
  });
}

// Uso
const response = await fetchComTimeout('/api/dados', {}, 3000);
```

### Pattern 2: Credentials-Aware Fetch

```javascript
async function fetchComCredentials(url, options = {}) {
  const urlObj = new URL(url, window.location.origin);
  const isSameOrigin = urlObj.origin === window.location.origin;
  
  return fetch(url, {
    ...options,
    credentials: isSameOrigin ? 'same-origin' : 'include',
    mode: isSameOrigin ? 'same-origin' : 'cors'
  });
}

// Uso - automaticamente ajusta credentials
const response = await fetchComCredentials('https://api.externa.com/dados');
```

### Pattern 3: Cache-First Strategy

```javascript
async function fetchCacheFirst(url) {
  // Tentar cache primeiro
  try {
    const cachedResponse = await fetch(url, {
      cache: 'only-if-cached',
      mode: 'same-origin'
    });
    
    console.log('Usando cache');
    return cachedResponse;
    
  } catch {
    // Cache miss - buscar do servidor
    console.log('Cache miss - buscando do servidor');
    return fetch(url, {
      cache: 'default'
    });
  }
}
```

### Pattern 4: Network-First with Fallback

```javascript
async function fetchComFallback(url, fallbackUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Primary fetch failed, trying fallback:', error);
    
    // Tentar fallback
    return fetch(fallbackUrl, {
      cache: 'force-cache'
    });
  }
}
```

### Pattern 5: Retry com Exponential Backoff

```javascript
async function fetchComRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: 'no-store' // Não usar cache em retries
      });
      
      clearTimeout(timeoutId);
      
      // Não retry em erros de cliente (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return response;
      
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1) break;
      
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1}/${maxRetries} em ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### Pattern 6: API Client com Options Padrão

```javascript
class APIClient {
  constructor(baseURL, defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache',
      redirect: 'follow',
      ...defaultOptions
    };
  }
  
  async request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...this.defaultOptions,
        ...options,
        signal: options.signal || controller.signal,
        headers: {
          'Accept': 'application/json',
          ...this.defaultOptions.headers,
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

// Uso
const api = new APIClient('https://api.exemplo.com', {
  credentials: 'include',
  cache: 'no-store'
});

const data = await api.request('/usuarios');
```

---

## 🎯 Aplicabilidade e Contextos

### Options por Cenário

#### API REST Autenticada

```javascript
fetch('/api/dados', {
  method: 'GET',
  mode: 'same-origin',
  credentials: 'same-origin',
  cache: 'no-cache'
});
```

#### Cross-Origin com Cookies

```javascript
fetch('https://api.externa.com/dados', {
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Accept': 'application/json'
  }
});
```

#### Resource Integrity (CDN)

```javascript
fetch('https://cdn.exemplo.com/library.js', {
  integrity: 'sha384-abc123...',
  cache: 'force-cache'
});
```

#### Analytics (Keepalive)

```javascript
window.addEventListener('beforeunload', () => {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(analytics),
    keepalive: true
  });
});
```

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. No Native Timeout**: Timeout requer AbortController (não há option `timeout`)
**2. credentials + CORS**: `include` requer server CORS headers específicos
**3. only-if-cached Restriction**: Requer `mode: 'same-origin'`
**4. keepalive Size Limit**: Body limitado a 64KB

### Armadilhas Comuns

#### Armadilha 1: no-cors com Expectativa de Dados

```javascript
// ❌ ERRO - dados inacessíveis
const response = await fetch(url, { mode: 'no-cors' });
const data = await response.json(); // Falha - body inacessível

// ✅ CORRETO - usar cors ou same-origin
const response = await fetch(url, { mode: 'cors' });
const data = await response.json();
```

#### Armadilha 2: credentials sem CORS Headers

```javascript
// ❌ FALHA - servidor não tem CORS correto
fetch('https://api.externa.com/dados', {
  credentials: 'include'
});
// Servidor DEVE ter:
// Access-Control-Allow-Credentials: true
// Access-Control-Allow-Origin: https://meu-site.com (não *)
```

#### Armadilha 3: cache + POST

```javascript
// ⚠️ Cache options com POST raramente faz sentido
fetch(url, {
  method: 'POST',
  cache: 'force-cache' // POST não é cacheável
});
```

---

## 🔗 Interconexões Conceituais

### Relação com CORS

`mode` e `credentials` **controlam CORS behavior**:
- `mode: 'cors'` + `credentials: 'include'` requer headers CORS específicos
- `mode: 'no-cors'` bypassa CORS mas torna response opaque

### Relação com Security

Options implementam **defense-in-depth**:
- `mode: 'same-origin'` previne leaks cross-origin
- `credentials: 'omit'` evita envio acidental de auth
- `integrity` protege contra CDN compromise

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar request options:
1. **AbortController**: Cancelamento avançado, timeout patterns
2. **Service Workers**: Interceptar requests, custom cache strategies
3. **HTTP/2 & HTTP/3**: Multiplexing, server push
4. **Request API**: `new Request()` para encapsular options
5. **Fetch Extensions**: Proposals (Fetch Metadata, Priority Hints)

---

## 📚 Conclusão

Request options são **ferramentas essenciais** para controlar comportamento de requisições Fetch.

Dominar options significa:
- Usar **mode** e **credentials** corretamente para CORS/auth
- Implementar **cache strategies** apropriadas
- Controlar **redirects** conforme necessário
- Implementar **timeout** via AbortController
- Configurar **security** (integrity, referrer policy)

São fundamentais para aplicações robustas, seguras e performáticas.
