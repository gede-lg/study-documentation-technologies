# Timeout Config

## 🎯 Introdução e Definição

### Definição Conceitual

**Timeout Config** é uma **propriedade de configuração do Axios** que define um **tempo máximo de espera** para uma requisição completar. Conceitualmente, é um **cancelamento automático baseado em tempo** - se a requisição demorar mais que o timeout especificado, ela é **automaticamente cancelada** e um erro é lançado.

Pense em timeout como um **cronômetro com alarme** - você define quanto tempo a requisição pode demorar, e se ela exceder esse tempo, o alarme dispara e a operação é cancelada. É como definir um prazo máximo para uma entrega.

**Estrutura fundamental:**
```javascript
// Timeout de 5 segundos
axios.get('/api/dados', {
  timeout: 5000 // ← 5000ms = 5 segundos
});

// Se requisição demorar > 5s, erro ECONNABORTED é lançado
```

**Fluxo de execução:**
```
1. axios.get('/api/dados', { timeout: 5000 })
2. Requisição enviada ao servidor
3. Timeout de 5s iniciado
4a. Se resposta chega em < 5s → Sucesso (promise resolve)
4b. Se resposta NÃO chega em 5s → Timeout (promise reject com ECONNABORTED)
```

**Diferença entre Timeout e AbortController:**

| Timeout | AbortController |
|---------|----------------|
| Cancelamento **automático** por tempo | Cancelamento **manual** quando quiser |
| `{ timeout: 5000 }` | `controller.abort()` |
| Erro `ECONNABORTED` | Erro `CanceledError` |
| Define tempo máximo | Define momento específico |

**Exemplo prático - Requisição Lenta:**

```javascript
// Servidor demora 10 segundos
axios.get('/api/relatorio-pesado', {
  timeout: 5000 // 5 segundos
})
.then(response => {
  console.log('Sucesso:', response.data);
})
.catch(error => {
  if (error.code === 'ECONNABORTED') {
    console.log('Timeout! Requisição demorou mais de 5 segundos');
  } else {
    console.error('Erro:', error);
  }
});

// Após 5 segundos: "Timeout! Requisição demorou mais de 5 segundos"
// .then nunca executado (promise rejeitada)
```

**Exemplo prático - Timeout Padrão Global:**

```javascript
// Definir timeout padrão para TODAS as requisições
axios.defaults.timeout = 10000; // 10 segundos

// Agora todas as requisições têm timeout de 10s
await axios.get('/api/usuarios'); // Timeout 10s
await axios.get('/api/posts'); // Timeout 10s

// Sobrescrever timeout por requisição
await axios.get('/api/relatorio', {
  timeout: 30000 // 30s apenas para esta requisição
});
```

### Contexto Histórico e Motivação

**Problema:** Requisições podem travar indefinidamente se:
- Servidor não responde (travado, offline)
- Rede lenta (timeout de conexão)
- Endpoint inexistente (servidor espera infinitamente)
- DDoS ou sobrecarga (servidor não consegue responder)

**Antes de timeout config:**
```javascript
// ❌ Requisição pode travar para sempre
axios.get('/api/dados')
  .then(response => console.log(response.data));

// Problemas:
// 1. Se servidor travar, promise nunca resolve nem rejeita
// 2. Usuário fica esperando infinitamente
// 3. Memory leak (promise pendente forever)
// 4. Loading spinner gira eternamente
```

**Com timeout config:**
```javascript
// ✅ Requisição cancela automaticamente após 10s
axios.get('/api/dados', {
  timeout: 10000 // 10 segundos
})
.then(response => console.log(response.data))
.catch(error => {
  if (error.code === 'ECONNABORTED') {
    console.log('Servidor demorou demais, tente novamente');
  }
});

// Vantagens:
// 1. Garante que promise sempre resolve ou rejeita
// 2. Usuário vê mensagem de erro após tempo razoável
// 3. Sem memory leaks
// 4. Loading spinner para após timeout
```

**Evolução:**
- **XMLHttpRequest:** Sempre teve timeout nativo
- **Fetch API:** Não tem timeout nativo (precisa AbortController + setTimeout)
- **Axios:** Timeout config desde v0.1.0 (built-in)

### Problema Fundamental que Resolve

**Timeout resolve:**

1. **Requisições travadas:** Cancelar se servidor não responde
2. **Experiência do usuário:** Limitar tempo de espera
3. **Memory leaks:** Prevenir promises pendentes eternamente
4. **Resource exhaustion:** Liberar conexões travadas
5. **Feedback rápido:** Usuário sabe que algo deu errado

**Exemplo prático - Servidor Offline:**

**Sem timeout (problema):**
```javascript
// ❌ Loading infinito se servidor offline
const [loading, setLoading] = useState(true);

axios.get('/api/dados')
  .then(response => {
    setDados(response.data);
    setLoading(false); // Nunca executado se servidor offline!
  });

// Problema: loading=true para sempre, usuário fica esperando infinitamente
```

**Com timeout (solução):**
```javascript
// ✅ Erro após 5 segundos se servidor offline
const [loading, setLoading] = useState(true);

axios.get('/api/dados', {
  timeout: 5000 // 5 segundos
})
.then(response => {
  setDados(response.data);
  setLoading(false);
})
.catch(error => {
  setLoading(false); // ← Executado após 5s se timeout
  
  if (error.code === 'ECONNABORTED') {
    toast.error('Servidor não respondeu. Tente novamente.');
  }
});

// Agora: loading=false após 5s, usuário vê mensagem de erro
```

**Exemplo prático - Upload de Arquivo Grande:**

```javascript
// Upload pode demorar muito - timeout maior
axios.post('/api/upload', formData, {
  timeout: 60000, // 60 segundos (1 minuto)
  onUploadProgress: progressEvent => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(`Upload: ${percentCompleted}%`);
  }
})
.then(response => {
  console.log('Upload completo:', response.data);
})
.catch(error => {
  if (error.code === 'ECONNABORTED') {
    console.log('Upload demorou mais de 1 minuto e foi cancelado');
  }
});
```

### Importância no Ecossistema

**Timeout é fundamental para:**

- **Aplicações web:** Evitar loading infinito
- **Mobile apps:** Economizar bateria (cancelar conexões travadas)
- **Microservices:** Prevenir cascata de timeouts
- **APIs instáveis:** Lidar com servidores lentos
- **Network flaky:** Redes móveis instáveis (3G, 4G)
- **User feedback:** Informar usuário quando algo dá errado

**Padrão de produção - Timeouts Diferenciados:**

```javascript
// Criar instância com timeout padrão
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000 // 10s padrão
});

// Sobrescrever para operações específicas
export const apiService = {
  // Leitura rápida (5s)
  getUsuarios: () => api.get('/usuarios', { timeout: 5000 }),
  
  // Leitura normal (10s - usa padrão)
  getPosts: () => api.get('/posts'),
  
  // Upload/download (60s)
  uploadArquivo: (formData) => api.post('/upload', formData, { timeout: 60000 }),
  
  // Relatórios pesados (2min)
  gerarRelatorio: (params) => api.post('/relatorios', params, { timeout: 120000 })
};
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Cancelamento automático:** Baseado em tempo, não manual
2. **Milissegundos:** timeout em ms (5000 = 5 segundos)
3. **ECONNABORTED:** Código de erro quando timeout ocorre
4. **Global e local:** Pode ser definido globalmente ou por requisição
5. **0 = sem timeout:** timeout: 0 desabilita timeout

### Pilares Fundamentais

- **timeout config:** Propriedade em ms
- **axios.defaults.timeout:** Timeout global
- **Per-request timeout:** Sobrescrever timeout por requisição
- **error.code === 'ECONNABORTED':** Detectar timeout
- **Precedência:** Local > Instance > Global

### Visão Geral das Nuances

- **0 = desabilitado:** timeout: 0 ou omitir = sem timeout
- **Não é retry:** Timeout cancela, não retenta
- **Combina com AbortController:** Pode usar ambos juntos
- **Network vs server:** Timeout detecta ambos (sem resposta)
- **Response timeout:** Timeout inclui tempo total (request + response)

---

## 🧠 Fundamentos Teóricos

### Timeout Básico

```javascript
// Timeout de 5 segundos
axios.get('/api/dados', {
  timeout: 5000 // ← 5000ms = 5 segundos
});
```

**Valores comuns:**
- `1000` = 1 segundo
- `5000` = 5 segundos
- `10000` = 10 segundos
- `30000` = 30 segundos
- `60000` = 1 minuto
- `0` = sem timeout (padrão)

### Timeout Global (axios.defaults)

```javascript
// Definir timeout padrão para TODAS as requisições
axios.defaults.timeout = 10000; // 10 segundos

// Agora todas as requisições têm timeout de 10s
axios.get('/api/usuarios');     // Timeout 10s
axios.post('/api/posts', data); // Timeout 10s
axios.put('/api/users/1', data); // Timeout 10s
```

### Timeout por Instância

```javascript
// Criar instância com timeout padrão
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000 // 15 segundos
});

// Todas as requisições desta instância têm timeout de 15s
api.get('/usuarios');     // Timeout 15s
api.get('/posts');        // Timeout 15s
```

### Timeout por Requisição (Override)

```javascript
// Timeout global: 10s
axios.defaults.timeout = 10000;

// Requisições normais: 10s
axios.get('/api/usuarios');     // 10s

// Requisição específica: 30s (override)
axios.get('/api/relatorio', {
  timeout: 30000 // ← Sobrescreve global
});

// Requisição sem timeout (override com 0)
axios.get('/api/stream', {
  timeout: 0 // ← Sem timeout
});
```

### Precedência de Timeout

**Ordem de precedência (maior para menor):**

1. **Per-request config** (mais específico)
2. **Instance config**
3. **Global defaults** (menos específico)

```javascript
// 1. Global
axios.defaults.timeout = 10000; // 10s

// 2. Instance
const api = axios.create({
  timeout: 20000 // 20s (sobrescreve global)
});

// 3. Per-request
api.get('/api/dados', {
  timeout: 30000 // 30s (sobrescreve instance)
});

// Resultado: timeout de 30s (per-request vence)
```

### Detectando Timeout

**Verificar error.code:**

```javascript
axios.get('/api/dados', {
  timeout: 5000
})
.catch(error => {
  if (error.code === 'ECONNABORTED') {
    console.log('Timeout! Requisição excedeu 5 segundos');
  } else if (error.response) {
    console.log('Erro HTTP:', error.response.status);
  } else if (error.request) {
    console.log('Erro de rede (não timeout)');
  } else {
    console.log('Erro:', error.message);
  }
});
```

**Categorizar erros:**

```javascript
axios.get('/api/dados', { timeout: 5000 })
  .catch(error => {
    // 1. Timeout
    if (error.code === 'ECONNABORTED') {
      console.log('⏱️ Timeout');
      toast.error('Servidor demorou demais. Tente novamente.');
    }
    // 2. Erro HTTP (4xx, 5xx)
    else if (error.response) {
      console.log(`❌ Erro HTTP ${error.response.status}`);
      toast.error('Erro no servidor');
    }
    // 3. Erro de rede (DNS, sem internet, CORS)
    else if (error.request) {
      console.log('📡 Erro de rede');
      toast.error('Verifique sua conexão');
    }
    // 4. Erro ao configurar requisição
    else {
      console.log('⚙️ Erro:', error.message);
    }
  });
```

### Timeout + Retry

**Combinar timeout com retry logic:**

```javascript
async function fetchWithRetry(url, maxRetries = 3, timeout = 5000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(url, { timeout });
      return response;
    } catch (error) {
      // Se timeout OU erro de rede, retentar
      if (error.code === 'ECONNABORTED' || !error.response) {
        console.log(`Tentativa ${i + 1} falhou, retentando...`);
        
        if (i === maxRetries - 1) {
          // Última tentativa - lançar erro
          throw error;
        }
        
        // Esperar antes de retentar (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      } else {
        // Erro HTTP (não retentar)
        throw error;
      }
    }
  }
}

// Uso
try {
  const response = await fetchWithRetry('/api/dados', 3, 5000);
  console.log('Sucesso:', response.data);
} catch (error) {
  console.error('Falhou após 3 tentativas:', error);
}
```

### Timeout Diferenciado por Tipo de Operação

```javascript
const timeouts = {
  read: 5000,      // 5s para leitura
  write: 10000,    // 10s para escrita
  upload: 60000,   // 60s para upload
  report: 120000   // 2min para relatórios
};

// GET (leitura)
axios.get('/api/usuarios', {
  timeout: timeouts.read
});

// POST (escrita)
axios.post('/api/posts', data, {
  timeout: timeouts.write
});

// Upload
axios.post('/api/upload', formData, {
  timeout: timeouts.upload
});

// Relatório
axios.post('/api/relatorios', params, {
  timeout: timeouts.report
});
```

### Timeout em Interceptors

```javascript
// Adicionar timeout automaticamente baseado no endpoint
axios.interceptors.request.use(config => {
  // Timeout padrão: 10s
  let timeout = 10000;
  
  // Upload: 60s
  if (config.url.includes('/upload')) {
    timeout = 60000;
  }
  // Download: 60s
  else if (config.url.includes('/download')) {
    timeout = 60000;
  }
  // Relatórios: 2min
  else if (config.url.includes('/relatorios')) {
    timeout = 120000;
  }
  // Leitura rápida: 5s
  else if (config.method === 'get') {
    timeout = 5000;
  }
  
  config.timeout = timeout;
  
  return config;
});
```

### Timeout + AbortController (Combinados)

**Usar ambos juntos:**

```javascript
const controller = new AbortController();

// Timeout automático (10s) + cancelamento manual
axios.get('/api/dados', {
  signal: controller.signal, // ← Cancelamento manual
  timeout: 10000             // ← Cancelamento automático
})
.then(response => console.log(response.data))
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Cancelado manualmente');
  } else if (error.code === 'ECONNABORTED') {
    console.log('Timeout automático');
  } else {
    console.error('Erro:', error);
  }
});

// Cancelar manualmente quando quiser
controller.abort();
```

**Uso - Botão "Cancelar" com timeout:**

```javascript
function UploadArquivo() {
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  
  const upload = async (file) => {
    controllerRef.current = new AbortController();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('/api/upload', formData, {
        signal: controllerRef.current.signal, // Cancelamento manual
        timeout: 60000,                       // Timeout 60s
        onUploadProgress: e => {
          const percent = Math.round((e.loaded * 100) / e.total);
          console.log(`Upload: ${percent}%`);
        }
      });
      
      console.log('Upload completo:', response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      
      if (error.name === 'CanceledError') {
        console.log('Upload cancelado pelo usuário');
      } else if (error.code === 'ECONNABORTED') {
        console.log('Upload excedeu 60 segundos');
      } else {
        console.error('Erro no upload:', error);
      }
    }
  };
  
  const cancelUpload = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };
  
  return (
    <div>
      <input type="file" onChange={e => upload(e.target.files[0])} />
      {loading && (
        <button onClick={cancelUpload}>Cancelar Upload</button>
      )}
    </div>
  );
}
```

---

## 🔍 Análise Conceitual Profunda

### Caso 1: API com Timeouts Diferenciados

```javascript
// Criar instância com timeout padrão
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000 // 10s padrão
});

// Service com timeouts específicos
export const userService = {
  // Leitura rápida (5s)
  getUsuarios: () => 
    api.get('/usuarios', { timeout: 5000 }),
  
  // Leitura normal (10s - usa padrão)
  getUsuario: (id) => 
    api.get(`/usuarios/${id}`),
  
  // Escrita (15s)
  createUsuario: (data) => 
    api.post('/usuarios', data, { timeout: 15000 }),
  
  // Atualização (15s)
  updateUsuario: (id, data) => 
    api.put(`/usuarios/${id}`, data, { timeout: 15000 }),
  
  // Deleção (10s - usa padrão)
  deleteUsuario: (id) => 
    api.delete(`/usuarios/${id}`)
};

export const fileService = {
  // Upload (2min)
  upload: (formData) => 
    api.post('/upload', formData, { 
      timeout: 120000,
      onUploadProgress: e => console.log(`${Math.round(e.loaded * 100 / e.total)}%`)
    }),
  
  // Download (2min)
  download: (fileId) => 
    api.get(`/download/${fileId}`, { 
      timeout: 120000,
      responseType: 'blob',
      onDownloadProgress: e => console.log(`${Math.round(e.loaded * 100 / e.total)}%`)
    })
};

export const reportService = {
  // Relatório pesado (5min)
  generateReport: (params) => 
    api.post('/relatorios', params, { timeout: 300000 })
};
```

### Caso 2: Timeout Adaptativo Baseado em Histórico

```javascript
class AdaptiveTimeout {
  constructor() {
    this.history = new Map(); // URL → [durations]
    this.defaultTimeout = 10000; // 10s
  }
  
  // Registrar duração de requisição
  recordDuration(url, duration) {
    if (!this.history.has(url)) {
      this.history.set(url, []);
    }
    
    const durations = this.history.get(url);
    durations.push(duration);
    
    // Manter apenas últimas 10 requisições
    if (durations.length > 10) {
      durations.shift();
    }
  }
  
  // Calcular timeout baseado em histórico
  getTimeout(url) {
    const durations = this.history.get(url);
    
    if (!durations || durations.length === 0) {
      return this.defaultTimeout;
    }
    
    // Calcular média + margem (2x média)
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const timeout = Math.round(avg * 2);
    
    // Mínimo 5s, máximo 60s
    return Math.max(5000, Math.min(timeout, 60000));
  }
  
  // Request com timeout adaptativo
  async request(url, config = {}) {
    const timeout = this.getTimeout(url);
    const startTime = Date.now();
    
    try {
      const response = await axios.get(url, {
        ...config,
        timeout
      });
      
      const duration = Date.now() - startTime;
      this.recordDuration(url, duration);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Registrar mesmo se erro (para aprender)
      if (error.code !== 'ECONNABORTED') {
        this.recordDuration(url, duration);
      }
      
      throw error;
    }
  }
}

// Uso
const adaptiveTimeout = new AdaptiveTimeout();

// Primeira requisição: timeout padrão 10s
await adaptiveTimeout.request('/api/relatorio'); // Demora 8s → registra 8s

// Segunda requisição: timeout 16s (2x média = 2 * 8s)
await adaptiveTimeout.request('/api/relatorio'); // Demora 7s → registra 7s

// Terceira requisição: timeout 15s (2x média = 2 * 7.5s)
await adaptiveTimeout.request('/api/relatorio');
```

### Caso 3: Timeout com Feedback Visual

```javascript
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeoutWarning, setTimeoutWarning] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setTimeoutWarning(false);
    
    // Timeout de 10s
    const timeout = 10000;
    
    // Aviso após 7s (70% do timeout)
    const warningTimeout = setTimeout(() => {
      setTimeoutWarning(true);
    }, timeout * 0.7);
    
    try {
      const response = await axios.get('/api/dados', { timeout });
      
      clearTimeout(warningTimeout);
      setData(response.data);
      setLoading(false);
    } catch (err) {
      clearTimeout(warningTimeout);
      setLoading(false);
      
      if (err.code === 'ECONNABORTED') {
        setError('Requisição excedeu 10 segundos e foi cancelada');
      } else {
        setError(err.message);
      }
    }
  };
  
  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        Carregar Dados
      </button>
      
      {loading && (
        <div>
          <div>Carregando...</div>
          {timeoutWarning && (
            <div style={{ color: 'orange' }}>
              ⚠️ Servidor está demorando mais que o normal...
            </div>
          )}
        </div>
      )}
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Timeout

**Use quando:**
- Prevenir requisições travadas
- Limitar tempo de espera do usuário
- APIs instáveis ou lentas
- Redes móveis (3G, 4G)
- Operações críticas (checkout, pagamento)

### Timeouts Recomendados

| Tipo de Operação | Timeout Recomendado |
|-----------------|-------------------|
| Leitura simples (GET) | 5-10s |
| Escrita (POST, PUT) | 10-15s |
| Upload de arquivo | 60-120s |
| Download de arquivo | 60-120s |
| Relatórios pesados | 2-5min |
| Streaming | 0 (sem timeout) |

---

## ⚠️ Limitações e Considerações Teóricas

### Timeout Não É Retry

```javascript
// ❌ Timeout cancela, não retenta
axios.get('/api/dados', {
  timeout: 5000 // ← Cancela após 5s, NÃO retenta
});

// ✅ Para retry, usar interceptor
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.code === 'ECONNABORTED' && !error.config._retry) {
      error.config._retry = true;
      return axios(error.config); // Retry
    }
    return Promise.reject(error);
  }
);
```

### Timeout Inclui Tempo Total

```javascript
// Timeout = request + response time
axios.get('/api/dados', {
  timeout: 5000
});

// 5s = tempo de envio + processamento servidor + tempo de download
// NÃO é 5s apenas para servidor processar
```

---

## 🔗 Interconexões Conceituais

### Timeout vs AbortController

```javascript
// Timeout: cancelamento automático por tempo
axios.get('/api/dados', { timeout: 5000 });

// AbortController: cancelamento manual
const controller = new AbortController();
axios.get('/api/dados', { signal: controller.signal });
controller.abort();

// Usar ambos juntos
axios.get('/api/dados', {
  timeout: 10000,                // Automático após 10s
  signal: controller.signal      // Manual quando quiser
});
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Cleanup Patterns:** Organizar cancelamento em apps
2. **Request Queuing:** Gerenciar múltiplas requisições
3. **Circuit Breaker:** Parar requisições após muitos timeouts

---

## 📚 Conclusão

**Timeout Config** é essencial para **prevenir requisições travadas** e **melhorar UX**.

**Dominar timeout significa:**
- **Definir timeout:** `{ timeout: 5000 }` (ms)
- **Global:** `axios.defaults.timeout = 10000`
- **Por instância:** `axios.create({ timeout: 15000 })`
- **Detectar:** `error.code === 'ECONNABORTED'`
- **Combinar:** Timeout + AbortController

**Use timeout para:**
- ✅ Prevenir requisições travadas
- ✅ Limitar tempo de espera
- ✅ Melhorar feedback ao usuário
- ✅ Economizar recursos

**Timeouts recomendados:**
- GET: 5-10s
- POST/PUT: 10-15s
- Upload/Download: 60-120s
- Relatórios: 2-5min

Com **Timeout Config**, você garante que requisições sempre completem ou falhem em tempo razoável.
