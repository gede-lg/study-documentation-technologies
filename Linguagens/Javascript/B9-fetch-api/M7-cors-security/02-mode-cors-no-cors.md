# mode: 'cors' vs 'no-cors': Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**mode** é uma **opção de configuração** em Fetch API que controla como **cross-origin requests** são tratados pelo browser, determinando se **CORS checks** são aplicados e quais **response data** são acessíveis. **mode: 'cors'** (default para cross-origin) aplica **CORS protocol completo**, requerendo servidor enviar headers `Access-Control-*`, e **expõe response body** ao JavaScript. **mode: 'no-cors'** permite **request sem CORS checks**, mas **opaque response** (sem acesso a body, headers, status) - útil apenas para requests onde **side effect é suficiente** (analytics, pixel tracking).

Conceitualmente, `mode` define **security boundary**: **'cors'** é **strict** (servidor deve permitir explicitamente), **'no-cors'** é **relaxed** (permite request mas bloqueia data). **'no-cors'** resolve caso específico: enviar request cross-origin para servidores **sem CORS**, onde apenas **fazer request é importante** (não ler response) - e.g., analytics tracking, metrics beacons.

```javascript
// mode: 'cors' (default para cross-origin)
fetch('https://api.example.com/users', {
  mode: 'cors' // CORS checks aplicados
});
// ✅ Se servidor envia Access-Control-Allow-Origin: response acessível
// ❌ Se servidor NÃO envia: CORS error, Promise rejeita

// mode: 'no-cors' (opaque response)
fetch('https://analytics.example.com/track', {
  mode: 'no-cors', // Sem CORS checks
  method: 'POST',
  body: JSON.stringify({ event: 'page_view' })
});
// ✅ Request enviado mesmo sem CORS headers
// ❌ Response opaque: sem acesso a body, headers, status
// response.type === 'opaque'
// response.body === null
// response.status === 0
```

### Contexto Histórico e Motivação

**Evolução de Cross-Origin Requests:**

1. **XMLHttpRequest (2006)**: Same-origin apenas (strict)
2. **CORS (2009)**: Cross-origin com server opt-in
3. **Fetch API (2015)**: mode option introduzido
4. **Service Workers (2016)**: no-cors essencial para cache cross-origin
5. **Modern (2020+)**: mode options refinados

**Motivação para mode: 'cors':**

CORS é **security mechanism**: servidor **controla** quais origins acessam recursos. `mode: 'cors'` é **default seguro**: força CORS checks, previne scripts maliciosos acessarem dados cross-origin sem permissão.

**Motivação para mode: 'no-cors':**

Alguns use cases **não precisam response data**: analytics tracking (apenas enviar evento), pixel tracking (apenas registrar view). Servidores antigos/third-party podem **não ter CORS**. `no-cors` permite **fire-and-forget requests** sem CORS setup, mas **protege** bloqueando response data (security).

### Problema Fundamental que Resolve

mode options resolvem problemas específicos:

**mode: 'cors':**
**1. Secure Access**: Garantir servidor permite cross-origin
**2. Response Access**: Expor body, headers, status ao JS
**3. Default Safety**: Comportamento seguro por padrão
**4. CORS Enforcement**: Aplicar Same-Origin Policy relaxation controlado

**mode: 'no-cors':**
**1. Analytics Tracking**: Enviar eventos sem CORS setup
**2. Legacy Servers**: Requests a servidores sem CORS
**3. Fire-and-Forget**: Side effects sem precisar response
**4. Service Worker Cache**: Cachear cross-origin resources (sem CORS)

### Importância no Ecossistema

mode options são **fundamentais para diferentes scenarios**:

- **'cors'**: SPAs consumindo APIs (response data necessário)
- **'no-cors'**: Analytics, tracking pixels, metrics
- **'same-origin'**: Security crítica (forçar same-origin)
- **'navigate'**: Browser navigations (internal use)
- **Service Workers**: Cache cross-origin assets com no-cors

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **mode: 'cors'**: CORS checks aplicados, response acessível
2. **mode: 'no-cors'**: Sem CORS checks, opaque response
3. **mode: 'same-origin'**: Rejeita cross-origin (strict)
4. **Opaque Response**: response.type === 'opaque', sem data access
5. **Default Behavior**: 'cors' para cross-origin, 'same-origin' para same-origin

### Pilares Fundamentais

- **mode: 'cors'**: Requer Access-Control-Allow-Origin do servidor
- **mode: 'no-cors'**: Permite request mas bloqueia response data
- **mode: 'same-origin'**: Apenas same-origin (cross-origin rejeita)
- **response.type**: 'basic', 'cors', 'opaque', 'error'
- **Opaque Restrictions**: status=0, body=null, headers inacessíveis

### Visão Geral das Nuances

- **Default mode**: Depende de request URL (same-origin ou cross-origin)
- **'no-cors' limitations**: Apenas simple requests (GET, POST form-data, HEAD)
- **'no-cors' POST JSON**: NÃO permitido (only simple content-types)
- **Service Workers**: no-cors essencial para cache cross-origin
- **Security**: no-cors protege data, mas permite side effects

---

## 🧠 Fundamentos Teóricos

### mode: 'cors' (Default Cross-Origin)

```javascript
// CORS mode: Full CORS protocol
fetch('https://api.example.com/users', {
  mode: 'cors' // Default para cross-origin
});

// Browser behavior:
// 1. Envia request com Origin header
// 2. Verifica response Access-Control-Allow-Origin
// 3. Se match: response acessível
// 4. Se não match: CORS error, Promise rejeita

// ✅ Servidor com CORS:
// Response headers:
//   Access-Control-Allow-Origin: https://app.example.com
// Result: response.json() funciona

// ❌ Servidor SEM CORS:
// Response headers:
//   (sem Access-Control-Allow-Origin)
// Result: TypeError: Failed to fetch (CORS error)

// Response properties (CORS success):
fetch('https://api.example.com/users', { mode: 'cors' })
  .then(response => {
    console.log(response.type);    // 'cors'
    console.log(response.status);  // 200
    console.log(response.ok);      // true
    
    // Headers acessíveis (se expostos)
    const contentType = response.headers.get('Content-Type');
    
    return response.json(); // ✅ Body acessível
  });
```

### mode: 'no-cors' (Opaque Response)

```javascript
// no-cors mode: Request permitido, response bloqueado
fetch('https://analytics.example.com/track', {
  mode: 'no-cors',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain' // ⚠️ Apenas simple content-types
  },
  body: 'event=page_view'
});

// Browser behavior:
// 1. Envia request SEM verificar CORS
// 2. Response retorna mas é OPAQUE
// 3. JS não acessa body, headers, status

// Response properties (opaque):
fetch('https://analytics.example.com/track', { mode: 'no-cors' })
  .then(response => {
    console.log(response.type);    // 'opaque'
    console.log(response.status);  // 0 (blocked)
    console.log(response.ok);      // false (status 0)
    console.log(response.body);    // null (blocked)
    
    // Headers NÃO acessíveis
    const contentType = response.headers.get('Content-Type');
    console.log(contentType); // null (blocked)
    
    // ❌ response.json() falha
    // ❌ response.text() retorna empty string
  });

// Use case: Fire-and-forget
fetch('https://analytics.example.com/track', {
  mode: 'no-cors',
  method: 'POST',
  body: JSON.stringify({ event: 'click' })
})
  .then(() => {
    console.log('Event tracked (no response data needed)');
  })
  .catch(error => {
    console.error('Tracking failed:', error);
  });
```

**Limitações no-cors:**
- Apenas **simple requests** (GET, POST, HEAD)
- Content-Type: **text/plain**, **application/x-www-form-urlencoded**, **multipart/form-data**
- **Não permite**: application/json, custom headers, PUT/DELETE

### mode: 'same-origin' (Strict)

```javascript
// same-origin mode: Rejeita cross-origin
fetch('https://api.example.com/users', {
  mode: 'same-origin'
});

// Browser behavior:
// 1. Verifica se URL é same-origin
// 2. Se same-origin: request normal
// 3. Se cross-origin: Promise rejeita IMEDIATAMENTE

// ✅ Same-origin request:
fetch('/api/users', { mode: 'same-origin' })
  .then(response => response.json());

// ❌ Cross-origin request:
fetch('https://api.example.com/users', { mode: 'same-origin' })
  .catch(error => {
    console.error('Cross-origin blocked:', error);
    // TypeError: Failed to fetch
  });

// Use case: Security crítica
// Garantir que requests são apenas same-origin
// Prevenir accidental cross-origin leaks
```

### Response Types

```javascript
// response.type indica origem e mode

// 1. 'basic' - Same-origin response
fetch('/api/users')
  .then(response => {
    console.log(response.type); // 'basic'
    // ✅ Full access: body, headers, status
  });

// 2. 'cors' - Cross-origin com CORS success
fetch('https://api.example.com/users', { mode: 'cors' })
  .then(response => {
    console.log(response.type); // 'cors'
    // ✅ Full access (CORS permitiu)
  });

// 3. 'opaque' - no-cors response
fetch('https://analytics.example.com/track', { mode: 'no-cors' })
  .then(response => {
    console.log(response.type); // 'opaque'
    // ❌ No access: body, headers, status bloqueados
  });

// 4. 'error' - Network error
fetch('https://invalid-domain.xyz')
  .catch(error => {
    // response.type seria 'error' (mas Promise rejeita)
  });

// Verificar tipo antes de processar
fetch(url, { mode })
  .then(response => {
    if (response.type === 'opaque') {
      console.log('No-cors response - cannot read data');
      return null;
    }
    
    if (response.type === 'cors' || response.type === 'basic') {
      return response.json();
    }
  });
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Analytics Tracking com no-cors

```javascript
// Fire-and-forget analytics (sem precisar response)
function trackEvent(event, data) {
  return fetch('https://analytics.example.com/events', {
    mode: 'no-cors',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify({ event, data, timestamp: Date.now() })
  })
    .then(() => {
      console.log(`Event tracked: ${event}`);
    })
    .catch(error => {
      console.error('Tracking failed:', error);
    });
}

// Uso
trackEvent('page_view', { page: '/home' });
trackEvent('button_click', { buttonId: 'signup' });

// Benefício: Funciona mesmo se analytics.example.com não tem CORS
// Trade-off: Não sabe se request teve sucesso (response opaque)
```

### Pattern 2: Conditional Mode (Fallback)

```javascript
// Tentar CORS primeiro, fallback para no-cors
async function fetchWithFallback(url, options = {}) {
  try {
    // Tentar CORS (access a response)
    const response = await fetch(url, {
      ...options,
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (corsError) {
    console.warn('CORS failed, trying no-cors...', corsError);
    
    // Fallback: no-cors (apenas enviar request)
    await fetch(url, {
      ...options,
      mode: 'no-cors'
    });
    
    console.log('Request sent (no-cors mode - no response data)');
    return null;
  }
}

// Uso
const data = await fetchWithFallback('https://api.example.com/track', {
  method: 'POST',
  body: JSON.stringify({ event: 'click' })
});

if (data) {
  console.log('Response data:', data);
} else {
  console.log('Request sent but no response data');
}
```

### Pattern 3: Service Worker Cache com no-cors

```javascript
// Service Worker: Cache cross-origin assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cross-origin asset (CDN)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Fetch com no-cors (CDN pode não ter CORS)
          return fetch(event.request, { mode: 'no-cors' })
            .then(response => {
              // Cache opaque response
              if (response.type === 'opaque') {
                const cache = await caches.open('cross-origin-assets');
                cache.put(event.request, response.clone());
              }
              
              return response;
            });
        })
    );
  }
});

// HTML: Usar cached asset
<img src="https://cdn.example.com/logo.png">
<!-- Service Worker serve do cache (opaque response OK para images) -->
```

**Use case**: Cachear images, fonts, scripts de CDN sem CORS.

### Pattern 4: Mode Detection

```javascript
// Detectar se servidor suporta CORS
async function checkCORSSupport(url) {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      method: 'HEAD' // Lightweight check
    });
    
    if (response.type === 'cors') {
      console.log('✅ Server supports CORS');
      return true;
    }
    
  } catch (error) {
    console.log('❌ Server does NOT support CORS');
    return false;
  }
  
  return false;
}

// Uso
const supportsCORS = await checkCORSSupport('https://api.example.com');

if (supportsCORS) {
  // Usar mode: 'cors' (access response)
  const data = await fetch(url, { mode: 'cors' })
    .then(r => r.json());
} else {
  // Usar mode: 'no-cors' (apenas enviar)
  await fetch(url, { mode: 'no-cors' });
}
```

### Pattern 5: Security-Critical same-origin

```javascript
// Forçar same-origin para operações críticas
async function secureFetch(endpoint, options = {}) {
  // Garantir que endpoint é same-origin
  const url = new URL(endpoint, window.location.origin);
  
  if (url.origin !== window.location.origin) {
    throw new Error('Security: Only same-origin requests allowed');
  }
  
  return fetch(endpoint, {
    ...options,
    mode: 'same-origin' // Rejeitar se cross-origin
  });
}

// Uso
try {
  // ✅ Same-origin
  const users = await secureFetch('/api/users');
  
  // ❌ Cross-origin - rejeita
  const data = await secureFetch('https://api.example.com/users');
} catch (error) {
  console.error('Security error:', error);
}
```

### Pattern 6: Image Loading com no-cors

```javascript
// Carregar image cross-origin sem CORS
function loadCrossOriginImage(src) {
  return new Promise((resolve, reject) => {
    // Fetch com no-cors
    fetch(src, { mode: 'no-cors' })
      .then(response => response.blob())
      .then(blob => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
          resolve(img);
          URL.revokeObjectURL(url);
        };
        
        img.onerror = () => {
          reject(new Error('Image load failed'));
          URL.revokeObjectURL(url);
        };
        
        img.src = url;
      })
      .catch(reject);
  });
}

// Uso
loadCrossOriginImage('https://cdn.example.com/photo.jpg')
  .then(img => {
    document.body.appendChild(img);
  });

// ⚠️ Alternativa simples (HTML):
// <img src="https://cdn.example.com/photo.jpg" crossorigin="anonymous">
// Requer CORS do CDN se quiser manipular com canvas
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar mode: 'cors'

**✅ APIs que retornam data**: JSON, XML, text responses
**✅ Servidor com CORS**: Access-Control-Allow-Origin configurado
**✅ Response necessário**: Precisa processar body, headers, status
**✅ Default**: Maioria dos casos (SPAs, API consumption)

### Quando Usar mode: 'no-cors'

**✅ Analytics/Tracking**: Fire-and-forget events
**✅ Pixel Tracking**: Beacons, metrics
**✅ Legacy Servers**: Sem CORS setup
**✅ Service Workers**: Cache cross-origin assets
**❌ Quando response é necessário**: Use cors

### Quando Usar mode: 'same-origin'

**✅ Security-critical**: Pagamentos, auth endpoints
**✅ Prevent Leaks**: Evitar accidental cross-origin
**✅ Compliance**: Regulamentações requerem same-origin

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações de no-cors

**1. Opaque Response**: Sem acesso a body, headers, status
**2. Simple Requests Only**: GET, POST (form-data), HEAD
**3. No JSON**: Content-Type application/json não permitido
**4. No Custom Headers**: Apenas simple headers
**5. No Success Check**: response.ok sempre false (status 0)

### Armadilhas Comuns

#### Armadilha 1: no-cors com JSON

```javascript
// ❌ ERRO - no-cors não suporta application/json
fetch('https://api.example.com/data', {
  mode: 'no-cors',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json' // ❌ Não permitido
  },
  body: JSON.stringify({ data: 'value' })
});

// Browser bloqueia (TypeError)

// ✅ CORRETO - usar text/plain
fetch('https://api.example.com/data', {
  mode: 'no-cors',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain'
  },
  body: JSON.stringify({ data: 'value' })
});

// Backend processa text/plain como JSON (parse manual)
```

#### Armadilha 2: Esperar Response de no-cors

```javascript
// ❌ ERRO - tentar ler opaque response
fetch('https://api.example.com/users', { mode: 'no-cors' })
  .then(response => response.json()) // ❌ Falha (opaque)
  .then(data => {
    console.log(data); // undefined ou erro
  });

// ✅ CORRETO - usar cors se precisa response
fetch('https://api.example.com/users', { mode: 'cors' })
  .then(response => response.json())
  .then(data => {
    console.log(data); // ✅ Funciona
  });
```

#### Armadilha 3: Confundir mode com credentials

```javascript
// ❌ Não confundir mode com credentials
fetch(url, {
  mode: 'no-cors',
  credentials: 'include' // Não ajuda com opaque response
});

// mode: controla CORS checks
// credentials: controla envio de cookies

// São independentes
```

---

## 🔗 Interconexões Conceituais

### Relação com CORS

mode: 'cors' **aplica CORS protocol**, 'no-cors' **bypassa CORS checks**.

### Relação com Response Type

mode determina **response.type** ('cors', 'opaque', 'basic').

### Relação com Service Workers

Service Workers usam **no-cors** para cache cross-origin assets.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar mode options:
1. **CSRF Protection**: Prevenir forged cross-origin requests
2. **XSS Prevention**: Sanitização, CSP
3. **Security Headers**: X-Frame-Options, HSTS

---

## 📚 Conclusão

mode options controlam **cross-origin behavior e security**.

Dominar mode significa:
- **Usar 'cors'** quando response é necessário (default)
- **Usar 'no-cors'** para fire-and-forget (analytics)
- **Entender opaque response** (sem data access)
- **Usar 'same-origin'** para security crítica
- **Aplicar corretamente** em Service Workers

É essencial para cross-origin requests e caching.
