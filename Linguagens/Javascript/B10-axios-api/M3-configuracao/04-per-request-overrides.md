# Per-Request Overrides

## 🎯 Introdução e Definição

### Definição Conceitual

**Per-request overrides** (sobrescrita por requisição) é a capacidade de **sobrescrever configurações padrão** (defaults globais ou de instância) em **requisições individuais**. Conceitualmente, é como ter **configurações específicas por chamada** - você define defaults gerais, mas pode ajustar comportamento pontualmente quando necessário.

Um **override** é uma configuração passada diretamente na chamada do método (como `axios.get(url, config)`) que **substitui temporariamente** o valor correspondente nos defaults, afetando apenas aquela requisição específica.

**Princípio fundamental:**
- **Defaults:** Config padrão para todas as requisições
- **Override:** Config específica para UMA requisição
- **Precedência:** Override > instance.defaults > axios.defaults > built-in defaults

**Sintaxe:**
```javascript
// Defaults
axios.defaults.timeout = 5000;

// Override (timeout específico para ESTA requisição)
axios.get('/api/dados', {
  timeout: 10000 // ← Override (sobrescreve default)
});
```

**O que acontece:**
1. Axios verifica se há `timeout` no config da requisição → **Encontra 10000**
2. Axios ignora `axios.defaults.timeout` (5000) para esta requisição
3. Requisição usa timeout de 10000ms
4. Próxima requisição volta a usar 5000ms (default)

**Diferença crucial:**
- **Modificar default:** `axios.defaults.timeout = 10000` → Afeta TODAS as próximas requisições
- **Override:** `axios.get(url, { timeout: 10000 })` → Afeta APENAS esta requisição

### Contexto Histórico e Motivação

Antes de per-request overrides, mudar configuração pontualmente era problemático:

**Problema 1: Mutação de Defaults**

```javascript
// ❌ Sem overrides - mutar defaults
axios.defaults.timeout = 5000;

axios.get('/api/rapida'); // timeout: 5000

// Requisição lenta precisa timeout maior
axios.defaults.timeout = 30000; // ← Muda para todas!
axios.get('/api/lenta'); // timeout: 30000

// Próxima requisição usa timeout errado
axios.get('/api/rapida'); // timeout: 30000 (deveria ser 5000!)

// Precisaria resetar manualmente
axios.defaults.timeout = 5000;
```

**Problema 2: Headers Específicos**

```javascript
// ❌ Adicionar header temporário
axios.defaults.headers.common['X-Request-ID'] = '123';

axios.get('/api/dados'); // Header enviado

// Remover header depois?
delete axios.defaults.headers.common['X-Request-ID']; // ← Verboso, propenso a erros
```

**Problema 3: baseURL Pontual**

```javascript
// ❌ API externa ocasional
axios.defaults.baseURL = 'https://api.internal.com';

axios.get('/usuarios'); // API interna

// Chamada pontual para API externa
axios.defaults.baseURL = 'https://api.external.com'; // ← Muda global!
axios.get('/dados');

axios.defaults.baseURL = 'https://api.internal.com'; // ← Resetar manualmente
```

**Per-request overrides resolveram tudo:**

```javascript
// ✅ Defaults globais
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'https://api.internal.com';

// ✅ Requisição normal (usa defaults)
axios.get('/usuarios'); // timeout: 5000, baseURL: api.internal.com

// ✅ Override pontual (não muda defaults)
axios.get('/api/lenta', {
  timeout: 30000 // Apenas esta requisição
});

// ✅ API externa pontual
axios.get('https://api.external.com/dados', {
  baseURL: undefined // Ignora baseURL default
});

// ✅ Header temporário
axios.get('/dados', {
  headers: { 'X-Request-ID': '123' } // Apenas esta requisição
});

// Próximas requisições usam defaults normalmente
axios.get('/usuarios'); // timeout: 5000, sem X-Request-ID
```

**Vantagens:**
- **Imutabilidade de defaults:** Defaults nunca mudam, apenas sobrescritos temporariamente
- **Clareza:** Config explícita por requisição
- **Segurança:** Impossível esquecer de resetar defaults
- **Flexibilidade:** Ajustes pontuais sem side effects

### Problema Fundamental que Resolve

**Per-request overrides resolve variações pontuais sem side effects:**

**1. Timeouts Variáveis:**
```javascript
axios.defaults.timeout = 5000; // Padrão

// Requisição rápida (usa default)
axios.get('/api/usuarios');

// Upload de arquivo (timeout maior)
axios.post('/api/upload', formData, {
  timeout: 60000 // ← 60s apenas para upload
});

// Próxima requisição volta ao padrão
axios.get('/api/posts'); // timeout: 5000
```

**2. Headers Pontuais:**
```javascript
// Header padrão para autenticação
axios.defaults.headers.common['Authorization'] = 'Bearer token';

// Requisição específica precisa header adicional
axios.get('/api/relatorio', {
  headers: {
    'X-Report-Format': 'PDF' // ← Header apenas nesta requisição
  }
  // Authorization mantido (merge)
});

// Próxima requisição sem X-Report-Format
axios.get('/api/usuarios'); // Apenas Authorization
```

**3. baseURL Pontual:**
```javascript
axios.defaults.baseURL = 'https://api.example.com';

// Requisições internas (usam baseURL)
axios.get('/usuarios'); // https://api.example.com/usuarios
axios.get('/posts'); // https://api.example.com/posts

// Requisição para API externa (ignora baseURL)
axios.get('https://external-api.com/dados'); // ← URL absoluta ignora baseURL

// Ou override explícito
axios.get('/dados', {
  baseURL: 'https://another-api.com' // Sobrescreve default
}); // https://another-api.com/dados
```

**4. responseType Específico:**
```javascript
// Default JSON
axios.defaults.responseType = 'json';

// Download de arquivo (blob para este request)
const response = await axios.get('/api/download/arquivo.pdf', {
  responseType: 'blob' // ← Override
});

const blob = response.data; // Blob
const url = URL.createObjectURL(blob);
// ...

// Próxima requisição volta a JSON
const usuarios = await axios.get('/api/usuarios'); // response.data = JSON
```

**5. Credenciais CORS:**
```javascript
// Sem credenciais por padrão
axios.defaults.withCredentials = false;

// Requisição específica precisa enviar cookies
axios.get('/api/user-profile', {
  withCredentials: true // ← Envia cookies apenas aqui
});

// Outras requisições continuam sem cookies
axios.get('/api/public-data'); // withCredentials: false
```

### Importância no Ecossistema

**Per-request overrides é fundamental para:**

- **Flexibilidade:** Ajustar comportamento sem mutar estado global
- **Download/Upload:** Timeouts e responseTypes específicos
- **Multi-API:** Diferentes baseURLs sem criar instances
- **Headers Dinâmicos:** Request IDs, trace IDs, feature flags
- **Retry Logic:** Timeouts progressivos em retries
- **A/B Testing:** Headers/params específicos para experimentos

**Padrão comum - Retry com timeout crescente:**

```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, {
        timeout: 5000 * (i + 1) // ← Override progressivo: 5s, 10s, 15s
      });
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}
```

**Padrão - Request tracing:**

```javascript
function generateRequestId() {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function trackedRequest(url, config = {}) {
  return axios.get(url, {
    ...config,
    headers: {
      ...config.headers,
      'X-Request-ID': generateRequestId() // ← Header único por request
    }
  });
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Override vs Default:** Override é config por requisição, default é global
2. **Precedência:** Request config > instance.defaults > axios.defaults > built-in
3. **Merge:** Headers e params são mergeados, outras propriedades sobrescritas
4. **Imutabilidade:** Overrides não afetam defaults
5. **Escopo:** Override vale apenas para requisição específica

### Pilares Fundamentais

- **Sintaxe:** `axios.method(url, [data], config)` - config é override
- **Merge de headers:** `{ ...defaults.headers, ...requestHeaders }`
- **Sobrescrita:** Propriedades como `timeout`, `baseURL` são substituídas completamente
- **Temporary:** Override não persiste além da requisição
- **Explicit:** Config explícita tem sempre maior prioridade

### Visão Geral das Nuances

- **Merge vs Replace:** Headers mergeados, outras propriedades substituídas
- **Undefined vs null:** `undefined` ignora override, `null` remove valor
- **Ordem de argumentos:** `get(url, config)` vs `post(url, data, config)`
- **Spread operator:** Compor configs com `{ ...defaultConfig, ...override }`
- **Deep merge:** Apenas headers e params, resto shallow

---

## 🧠 Fundamentos Teóricos

### Sintaxe de Override

**Métodos GET, DELETE, HEAD, OPTIONS:**

```javascript
axios.get(url, config)
axios.delete(url, config)
axios.head(url, config)
axios.options(url, config)
```

**Métodos POST, PUT, PATCH:**

```javascript
axios.post(url, data, config)
axios.put(url, data, config)
axios.patch(url, data, config)
```

**Método genérico:**

```javascript
axios.request(config)
axios(config) // Alias
```

**Exemplo:**

```javascript
// GET com override
axios.get('/api/usuarios', {
  timeout: 10000,
  headers: { 'X-Custom': 'value' }
});

// POST com override
axios.post('/api/posts', postData, {
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// Generic com override completo
axios({
  method: 'get',
  url: '/api/dados',
  timeout: 20000,
  headers: { 'Accept': 'application/json' }
});
```

### Precedência de Config

**Ordem (maior → menor prioridade):**

```
1. Request config (override)
2. Instance defaults (se usar instance)
3. Axios global defaults
4. Built-in defaults
```

**Exemplo completo:**

```javascript
// 1. Built-in defaults (Axios interno)
// timeout: 0 (sem timeout)

// 2. Axios global defaults
axios.defaults.timeout = 5000;
axios.defaults.headers.common['Accept'] = 'application/json';

// 3. Instance defaults
const api = axios.create({
  timeout: 10000,
  headers: {
    'Authorization': 'Bearer token'
  }
});

// 4. Request config (MAIOR prioridade)
api.get('/usuarios', {
  timeout: 15000, // ← Vence (sobrescreve instance e global)
  headers: {
    'X-Custom': 'value' // ← Mergeado com defaults
  }
});

// Config efetivo:
// timeout: 15000 (request config)
// headers: {
//   Accept: 'application/json', (global default)
//   Authorization: 'Bearer token', (instance default)
//   X-Custom: 'value' (request config)
// }
```

### Merge vs Replace

**Headers e params são MERGEADOS:**

```javascript
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer token';

axios.get('/api/dados', {
  headers: {
    'X-Custom': 'value'
  }
});

// Headers efetivos (MERGE):
// {
//   Accept: 'application/json',      ← default
//   Authorization: 'Bearer token',   ← default
//   X-Custom: 'value'                ← override
// }
```

**Outras propriedades são SUBSTITUÍDAS:**

```javascript
axios.defaults.timeout = 5000;
axios.defaults.baseURL = 'https://api.example.com';

axios.get('/dados', {
  timeout: 10000 // ← Substitui completamente (não soma, não mergeia)
});

// Config efetivo:
// timeout: 10000 (NÃO 5000, NÃO 15000)
// baseURL: 'https://api.example.com' (default, não afetado)
```

### Sobrescrever Headers

**Override específico de header:**

```javascript
axios.defaults.headers.common['Accept'] = 'application/json';

// Sobrescrever header específico
axios.get('/api/dados', {
  headers: {
    'Accept': 'application/xml' // ← Sobrescreve default
  }
});

// Header efetivo: Accept: application/xml
```

**Remover header:**

```javascript
axios.defaults.headers.common['Authorization'] = 'Bearer token';

// Remover header para esta requisição
axios.get('/api/public', {
  headers: {
    'Authorization': null // ← Remove header
  }
});

// Authorization NÃO enviado
```

**Adicionar múltiplos headers:**

```javascript
axios.defaults.headers.common['Accept'] = 'application/json';

axios.get('/api/dados', {
  headers: {
    'X-Request-ID': '123',
    'X-Trace-ID': 'abc',
    'X-User-Agent': 'custom-client'
  }
});

// Headers efetivos (merge):
// Accept: application/json
// X-Request-ID: 123
// X-Trace-ID: abc
// X-User-Agent: custom-client
```

### Sobrescrever Timeout

```javascript
axios.defaults.timeout = 5000;

// Requisição rápida (usa default)
axios.get('/api/usuarios'); // timeout: 5000

// Requisição lenta (override)
axios.get('/api/relatorio', {
  timeout: 30000 // ← 30 segundos apenas para este request
});

// Download (sem timeout)
axios.get('/api/download/arquivo', {
  timeout: 0 // ← Sem timeout (espera indefinidamente)
});
```

### Sobrescrever baseURL

```javascript
axios.defaults.baseURL = 'https://api.example.com';

// Usar baseURL diferente para uma requisição
axios.get('/dados', {
  baseURL: 'https://api2.example.com'
}); // https://api2.example.com/dados

// Ignorar baseURL (URL absoluta)
axios.get('https://external-api.com/data'); // ← baseURL ignorada

// Remover baseURL para esta requisição
axios.get('/caminho/completo', {
  baseURL: ''
}); // /caminho/completo (relativo à página)
```

### Sobrescrever responseType

```javascript
// Default JSON
axios.defaults.responseType = 'json';

// Requisições normais (JSON)
const usuarios = await axios.get('/api/usuarios');
console.log(usuarios.data); // Objeto JS (parsed JSON)

// Download de arquivo (blob)
const arquivo = await axios.get('/api/download/documento.pdf', {
  responseType: 'blob' // ← Override
});
const blob = arquivo.data; // Blob
const url = URL.createObjectURL(blob);

// Download de imagem (arraybuffer)
const imagem = await axios.get('/api/imagens/foto.jpg', {
  responseType: 'arraybuffer' // ← Override
});
const buffer = imagem.data; // ArrayBuffer
```

### Sobrescrever params

```javascript
axios.defaults.params = {
  apiKey: 'default-key'
};

// Adicionar params (merge)
axios.get('/api/usuarios', {
  params: {
    page: 1,
    limit: 10
  }
});

// Query string efetiva:
// ?apiKey=default-key&page=1&limit=10

// Sobrescrever param default
axios.get('/api/usuarios', {
  params: {
    apiKey: 'override-key', // ← Sobrescreve default
    page: 2
  }
});

// Query string:
// ?apiKey=override-key&page=2
```

### Sobrescrever withCredentials

```javascript
axios.defaults.withCredentials = false;

// Requisição normal (sem cookies)
axios.get('/api/public'); // withCredentials: false

// Requisição autenticada (com cookies)
axios.get('/api/user-profile', {
  withCredentials: true // ← Envia cookies
});

// Próxima requisição volta ao default
axios.get('/api/posts'); // withCredentials: false
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Uso

#### Pattern 1: Download com Timeout Customizado

```javascript
async function downloadArquivo(url, nomeArquivo) {
  const response = await axios.get(url, {
    responseType: 'blob', // ← Override responseType
    timeout: 60000, // ← Override timeout (60s para downloads)
    onDownloadProgress: progressEvent => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`Download: ${percentCompleted}%`);
    }
  });
  
  const blob = response.data;
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}

// Uso
downloadArquivo('/api/relatorios/mensal.pdf', 'relatorio.pdf');
```

#### Pattern 2: Retry com Timeout Progressivo

```javascript
async function fetchWithRetry(url, options = {}) {
  const maxRetries = options.retries || 3;
  const baseTimeout = options.timeout || 5000;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios.get(url, {
        ...options,
        timeout: baseTimeout * (attempt + 1) // ← Override progressivo
      });
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      console.log(`Tentativa ${attempt + 1} falhou, tentando novamente...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Uso
const response = await fetchWithRetry('/api/dados', {
  retries: 3,
  timeout: 5000 // Tentativas: 5s, 10s, 15s
});
```

#### Pattern 3: Request Tracing

```javascript
function generateTraceId() {
  return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateRequestId() {
  return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function trackedRequest(method, url, data, config = {}) {
  const traceId = generateTraceId();
  const requestId = generateRequestId();
  
  console.log(`[${traceId}] Starting ${method.toUpperCase()} ${url}`);
  
  try {
    const response = await axios({
      method,
      url,
      data,
      ...config,
      headers: {
        ...config.headers,
        'X-Trace-ID': traceId, // ← Override headers
        'X-Request-ID': requestId
      }
    });
    
    console.log(`[${traceId}] Success: ${response.status}`);
    return response;
  } catch (error) {
    console.error(`[${traceId}] Error:`, error.message);
    throw error;
  }
}

// Uso
await trackedRequest('get', '/api/usuarios');
await trackedRequest('post', '/api/posts', postData);
```

#### Pattern 4: Feature Flags via Headers

```javascript
const featureFlags = {
  newUI: true,
  betaFeatures: false,
  experimentalAPI: true
};

function requestWithFeatures(url, config = {}) {
  return axios.get(url, {
    ...config,
    headers: {
      ...config.headers,
      'X-Feature-Flags': JSON.stringify(featureFlags) // ← Override headers
    }
  });
}

// Backend pode ler X-Feature-Flags e retornar dados diferentes
const response = await requestWithFeatures('/api/dashboard');
```

#### Pattern 5: API Versioning

```javascript
axios.defaults.baseURL = 'https://api.example.com';

// Usar versão padrão (v1)
axios.get('/usuarios'); // https://api.example.com/usuarios

// Override para testar API v2
axios.get('/usuarios', {
  baseURL: 'https://api.example.com/v2' // ← Override baseURL
}); // https://api.example.com/v2/usuarios

// Helper para versão específica
function apiV2(url, config = {}) {
  return axios.get(url, {
    ...config,
    baseURL: 'https://api.example.com/v2'
  });
}

await apiV2('/usuarios');
await apiV2('/posts');
```

#### Pattern 6: Upload com Progress

```javascript
async function uploadArquivo(arquivo, onProgress) {
  const formData = new FormData();
  formData.append('file', arquivo);
  
  return axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // ← Override Content-Type
    },
    timeout: 300000, // ← Override timeout (5 min)
    onUploadProgress: progressEvent => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) onProgress(percentCompleted);
    }
  });
}

// Uso
const inputFile = document.querySelector('input[type="file"]').files[0];
await uploadArquivo(inputFile, percent => {
  console.log(`Upload: ${percent}%`);
});
```

### Composição de Configs

**Compor configs com spread operator:**

```javascript
// Config base
const baseConfig = {
  timeout: 10000,
  headers: {
    'Accept': 'application/json'
  }
};

// Config específica
const specificConfig = {
  headers: {
    'X-Custom': 'value'
  },
  params: {
    page: 1
  }
};

// Compor
axios.get('/api/dados', {
  ...baseConfig,
  ...specificConfig
  // Merge manual necessário para headers
});

// ❌ PROBLEMA: headers são substituídos, não mergeados
// Resultado: headers = { 'X-Custom': 'value' } (Accept perdido!)
```

**Solução - Deep merge de headers:**

```javascript
function mergeConfigs(baseConfig, overrideConfig) {
  return {
    ...baseConfig,
    ...overrideConfig,
    headers: {
      ...baseConfig.headers,
      ...overrideConfig.headers
    },
    params: {
      ...baseConfig.params,
      ...overrideConfig.params
    }
  };
}

const merged = mergeConfigs(baseConfig, specificConfig);
axios.get('/api/dados', merged);

// Headers efetivos:
// {
//   Accept: 'application/json',
//   X-Custom: 'value'
// }
```

### undefined vs null

**`undefined` ignora override (usa default):**

```javascript
axios.defaults.timeout = 5000;

axios.get('/api/dados', {
  timeout: undefined // ← Usa default (5000)
});
```

**`null` remove valor:**

```javascript
axios.defaults.headers.common['Authorization'] = 'Bearer token';

axios.get('/api/public', {
  headers: {
    'Authorization': null // ← Remove header
  }
});
```

**`false`, `0`, `''` são valores válidos:**

```javascript
axios.defaults.timeout = 5000;

axios.get('/api/dados', {
  timeout: 0 // ← Válido (sem timeout)
});

axios.defaults.withCredentials = true;

axios.get('/api/public', {
  withCredentials: false // ← Válido (não envia cookies)
});
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Overrides

**Use overrides quando:**
- Timeout específico para requisição (upload, download, API lenta)
- Headers pontuais (request ID, feature flags, content negotiation)
- responseType diferente (download blob, arraybuffer)
- baseURL diferente (API externa ocasional)
- params específicos (filtros, paginação)
- withCredentials pontual (CORS com cookies)

**Exemplo - Download de relatório:**

```javascript
// Defaults normais
axios.defaults.timeout = 5000;
axios.defaults.responseType = 'json';

// Download de relatório (overrides específicos)
const relatorio = await axios.get('/api/relatorios/anual', {
  timeout: 60000, // 60s para gerar relatório
  responseType: 'blob', // PDF como blob
  headers: {
    'Accept': 'application/pdf'
  }
});

const blob = relatorio.data;
saveAs(blob, 'relatorio-anual.pdf');
```

### Não Use Overrides Quando

**Evite overrides se:**
- Config é sempre a mesma → Use defaults
- Precisa isolar grupos de requisições → Use instances
- Override em muitos lugares → Refatore para default ou instance

**Exemplo - quando criar instance ao invés:**

```javascript
// ❌ Override em TODAS as requisições
axios.post('/api/posts', data, { timeout: 30000 });
axios.get('/api/posts', { timeout: 30000 });
axios.put('/api/posts/1', data, { timeout: 30000 });

// ✅ Melhor - instance com default
const api = axios.create({
  timeout: 30000
});

api.post('/api/posts', data);
api.get('/api/posts');
api.put('/api/posts/1', data);
```

---

## ⚠️ Limitações e Considerações Teóricas

### Merge Apenas para Headers e Params

**Headers e params são deep-merged, resto shallow:**

```javascript
axios.defaults.headers.common = { 'Accept': 'application/json' };
axios.defaults.params = { apiKey: 'key1' };

axios.get('/api/dados', {
  headers: { 'X-Custom': 'value' }, // ← Merge
  params: { page: 1 } // ← Merge
});

// Efetivo:
// headers: { Accept: 'application/json', X-Custom: 'value' }
// params: { apiKey: 'key1', page: 1 }
```

**Outras propriedades substituídas:**

```javascript
axios.defaults.timeout = 5000;

axios.get('/api/dados', {
  timeout: 10000 // ← Substitui (NÃO soma)
});
// timeout efetivo: 10000 (não 15000)
```

### Spread Operator Não Faz Deep Merge

```javascript
const config1 = {
  headers: { 'Accept': 'application/json' }
};

const config2 = {
  headers: { 'X-Custom': 'value' }
};

const merged = { ...config1, ...config2 };

console.log(merged.headers);
// { X-Custom: 'value' } ← Accept perdido!

// Solução: merge manual de headers
const correct = {
  ...config1,
  ...config2,
  headers: {
    ...config1.headers,
    ...config2.headers
  }
};

console.log(correct.headers);
// { Accept: 'application/json', X-Custom: 'value' }
```

### Ordem de Argumentos

**Cuidado com ordem:**

```javascript
// GET - config é segundo argumento
axios.get(url, config);

// POST - config é TERCEIRO argumento
axios.post(url, data, config);

// ❌ ERRO comum
axios.post(url, { timeout: 5000 }); // ← { timeout: 5000 } enviado como data!

// ✅ CORRETO
axios.post(url, data, { timeout: 5000 });
```

---

## 🔗 Interconexões Conceituais

### Overrides e Interceptors

**Interceptors veem config DEPOIS de merge:**

```javascript
axios.interceptors.request.use(config => {
  console.log('Timeout:', config.timeout);
  return config;
});

axios.defaults.timeout = 5000;

axios.get('/api/dados', {
  timeout: 10000 // ← Override
});

// Log: "Timeout: 10000" (interceptor vê config final)
```

### Overrides e Instances

**Overrides funcionam com instances:**

```javascript
const api = axios.create({
  timeout: 5000
});

api.get('/dados', {
  timeout: 10000 // ← Sobrescreve instance default
});
```

**Precedência com instance:**
```
Request config > instance.defaults > axios.defaults > built-in
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Interceptors:** Modificar config globalmente antes de requisições
2. **Error Handling:** Customizar tratamento de erros
3. **Cancelamento:** Cancelar requisições em andamento
4. **Retry Logic:** Implementar retries automáticos

### Conceitos Avançados

- **Config composition:** Compor múltiplas configs
- **Dynamic overrides:** Overrides baseados em runtime data
- **Middleware pattern:** Encadear transformações de config
- **Config validation:** Validar configs antes de requests

---

## 📚 Conclusão

**Per-request overrides** é mecanismo **essencial para flexibilidade** em Axios.

**Dominar overrides significa:**
- Saber quando sobrescrever defaults (timeouts, headers, responseType)
- Entender precedência (request > instance > global > built-in)
- Conhecer merge behavior (headers/params mergeados, resto substituído)
- Evitar armadilhas (spread operator não faz deep merge)
- Aplicar padrões (retry, tracing, feature flags, uploads)

**Use overrides para:**
- ✅ Ajustes pontuais em requisições específicas
- ✅ Timeouts variáveis (uploads, downloads, APIs lentas)
- ✅ Headers dinâmicos (request IDs, feature flags)
- ✅ responseTypes específicos (blob, arraybuffer)

**Evite overrides se:**
- ❌ Config é sempre a mesma (use defaults)
- ❌ Muitas requisições com mesmo override (use instance)
- ❌ Precisa isolar grupos de requisições (use instance)

Com **per-request overrides**, você adiciona **flexibilidade cirúrgica** às suas requisições HTTP, sem comprometer defaults globais ou criar side effects.
