# CancelToken (deprecated)

## 🎯 Introdução e Definição

### Definição Conceitual

**CancelToken** é a **API proprietária original do Axios** para cancelar requisições HTTP, agora **oficialmente deprecated** desde Axios v0.22.0 em favor de **AbortController** (padrão Web). Conceitualmente, era um **mecanismo de sinalização proprietário** que permitia cancelar requisições, mas foi substituído por uma API nativa do JavaScript mais moderna e universal.

**⚠️ IMPORTANTE:** CancelToken está **deprecated** e **não deve ser usado em novos projetos**. Este documento existe apenas para:
1. Manutenção de código legado
2. Migração de CancelToken para AbortController
3. Compreensão histórica da evolução do Axios

**Use AbortController ao invés de CancelToken em todos os novos projetos.**

**Estrutura fundamental (deprecated):**
```javascript
// ❌ CancelToken (deprecated - NÃO USE)
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/dados', {
  cancelToken: source.token
});

// Cancelar
source.cancel('Operação cancelada pelo usuário');
```

**Estrutura moderna (recomendada):**
```javascript
// ✅ AbortController (moderno - USE ESTE)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal
});

// Cancelar
controller.abort('Operação cancelada pelo usuário');
```

### Contexto Histórico e Motivação

**Linha do tempo:**

- **Antes de 2017:** Axios não tinha API de cancelamento nativa
  - Apenas `XMLHttpRequest.abort()` no baixo nível
  - Difícil de usar e não integrado ao Axios
  
- **2017:** Axios v0.15.0 introduz CancelToken
  - Baseado na proposta cancelable promises (TC39 Stage 1)
  - API proprietária do Axios
  - Funcionava bem, mas não era padrão Web
  
- **2017:** AbortController se torna padrão Web (WHATWG)
  - Adotado por Fetch API
  - Padrão nativo do JavaScript
  - Funciona em múltiplas APIs (Fetch, Axios, etc.)
  
- **2021:** Axios v0.22.0 adiciona suporte a AbortController
  - AbortController se torna método recomendado
  - CancelToken marcado como deprecated
  
- **Hoje (2025):** CancelToken é legado
  - Mantido apenas para retrocompatibilidade
  - Todos os novos projetos devem usar AbortController

**Por que foi deprecated:**

1. **Não é padrão Web:** API proprietária do Axios, não funciona com Fetch ou outras libs
2. **AbortController é nativo:** Suportado nativamente pelos browsers
3. **Duplicação:** Manter duas APIs de cancelamento era confuso
4. **Futuro:** AbortController é o futuro, CancelToken é o passado

### Problema que CancelToken Resolvia (e AbortController resolve melhor)

**CancelToken resolvia:**
- Cancelar requisições em andamento
- Evitar race conditions
- Evitar memory leaks
- Economizar largura de banda

**Mas AbortController resolve os mesmos problemas E:**
- É padrão Web (funciona com Fetch, Axios, etc.)
- API mais simples
- Melhor integração com frameworks modernos
- Mais performático (nativo do browser)

**Comparação:**

```javascript
// ❌ CancelToken (complexo, proprietário)
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/dados', {
  cancelToken: source.token
})
.then(response => console.log(response.data))
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Cancelado:', error.message);
  }
});

source.cancel('Cancelado pelo usuário');

// ✅ AbortController (simples, padrão)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal
})
.then(response => console.log(response.data))
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Cancelado:', error.message);
  }
});

controller.abort('Cancelado pelo usuário');
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Deprecated:** Não use em novos projetos
2. **Duas formas:** CancelToken.source() ou new CancelToken(executor)
3. **cancelToken config:** Propriedade para passar token ao axios
4. **source.cancel():** Função para cancelar
5. **axios.isCancel():** Detectar cancelamento

### Pilares Fundamentais

- **CancelToken.source():** Criar source object (token + cancel)
- **new CancelToken(executor):** Forma avançada
- **cancelToken config:** Passar token à requisição
- **source.cancel(message):** Cancelar requisição
- **axios.isCancel(error):** Verificar se erro é cancelamento

### Visão Geral das Nuances

- **Source method:** Mais simples (source.token + source.cancel)
- **Executor method:** Mais flexível (controle manual)
- **Reusabilidade:** Token não é reusável (como AbortController)
- **Interoperabilidade:** Apenas Axios (não funciona com Fetch)
- **Migração:** Migrar para AbortController é simples

---

## 🧠 Fundamentos Teóricos (Para Compreensão de Código Legado)

### CancelToken.source() Method

**Forma mais comum e simples:**

```javascript
// Criar source
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// source tem 2 propriedades:
console.log(source.token);  // CancelToken instance
console.log(source.cancel); // Function

// Fazer requisição
axios.get('/api/dados', {
  cancelToken: source.token
})
.then(response => {
  console.log('Sucesso:', response.data);
})
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Cancelado:', error.message);
  } else {
    console.error('Erro:', error);
  }
});

// Cancelar
source.cancel('Operação cancelada pelo usuário');
```

**Equivalente com AbortController:**

```javascript
// ✅ AbortController (use este)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal
})
.then(response => {
  console.log('Sucesso:', response.data);
})
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Cancelado:', error.message);
  } else {
    console.error('Erro:', error);
  }
});

controller.abort('Operação cancelada pelo usuário');
```

### new CancelToken(executor) Method

**Forma avançada (raramente usada):**

```javascript
let cancel;

const token = new axios.CancelToken(function executor(c) {
  // c é a função cancel
  cancel = c;
});

axios.get('/api/dados', {
  cancelToken: token
})
.then(response => console.log(response.data))
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Cancelado');
  }
});

// Cancelar chamando a função
cancel('Cancelado pelo usuário');
```

**Equivalente com AbortController:**

```javascript
// ✅ AbortController (muito mais simples)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal
})
.then(response => console.log(response.data))
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Cancelado');
  }
});

controller.abort('Cancelado pelo usuário');
```

### Detectando Cancelamento

**Com CancelToken:**

```javascript
axios.get('/api/dados', {
  cancelToken: source.token
})
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Requisição cancelada:', error.message);
  } else {
    console.error('Erro:', error);
  }
});
```

**Com AbortController:**

```javascript
axios.get('/api/dados', {
  signal: controller.signal
})
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Requisição cancelada:', error.message);
  } else {
    console.error('Erro:', error);
  }
});

// Ou usando axios.isCancel (funciona com ambos)
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Cancelado');
  }
});
```

### Múltiplas Requisições com Um Token

**CancelToken:**

```javascript
const source = CancelToken.source();

// Múltiplas requisições com mesmo token
axios.get('/api/usuarios', { cancelToken: source.token });
axios.get('/api/posts', { cancelToken: source.token });
axios.get('/api/comentarios', { cancelToken: source.token });

// Cancelar todas
source.cancel('Cancelando todas as requisições');
```

**AbortController (equivalente):**

```javascript
const controller = new AbortController();

// Múltiplas requisições com mesmo signal
axios.get('/api/usuarios', { signal: controller.signal });
axios.get('/api/posts', { signal: controller.signal });
axios.get('/api/comentarios', { signal: controller.signal });

// Cancelar todas
controller.abort('Cancelando todas as requisições');
```

---

## 🔍 Análise Conceitual Profunda

### Caso 1: Search com CancelToken (Código Legado)

**CancelToken (código legado):**

```javascript
// ❌ Código legado - NÃO USE
let source = null;

function search(query) {
  // Cancelar pesquisa anterior
  if (source) {
    source.cancel('Nova pesquisa iniciada');
  }
  
  // Criar novo source
  source = axios.CancelToken.source();
  
  // Fazer pesquisa
  axios.get('/api/search', {
    params: { q: query },
    cancelToken: source.token
  })
  .then(response => {
    console.log('Resultados:', response.data);
  })
  .catch(error => {
    if (axios.isCancel(error)) {
      console.log('Pesquisa cancelada');
    } else {
      console.error('Erro:', error);
    }
  });
}
```

**AbortController (migração recomendada):**

```javascript
// ✅ Código moderno - USE ESTE
let controller = null;

function search(query) {
  // Cancelar pesquisa anterior
  if (controller) {
    controller.abort();
  }
  
  // Criar novo controller
  controller = new AbortController();
  
  // Fazer pesquisa
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
```

### Caso 2: React com CancelToken (Código Legado)

**CancelToken (código legado):**

```javascript
// ❌ Código legado - NÃO USE
function Usuario({ id }) {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const source = axios.CancelToken.source();
    
    axios.get(`/api/usuarios/${id}`, {
      cancelToken: source.token
    })
    .then(response => setUsuario(response.data))
    .catch(error => {
      if (!axios.isCancel(error)) {
        console.error('Erro:', error);
      }
    });
    
    return () => {
      source.cancel('Componente desmontado');
    };
  }, [id]);
  
  return <div>{usuario?.nome}</div>;
}
```

**AbortController (migração recomendada):**

```javascript
// ✅ Código moderno - USE ESTE
function Usuario({ id }) {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    axios.get(`/api/usuarios/${id}`, {
      signal: controller.signal
    })
    .then(response => setUsuario(response.data))
    .catch(error => {
      if (error.name !== 'CanceledError') {
        console.error('Erro:', error);
      }
    });
    
    return () => {
      controller.abort();
    };
  }, [id]);
  
  return <div>{usuario?.nome}</div>;
}
```

---

## 🎯 Guia de Migração

### Como Migrar de CancelToken para AbortController

**Passo 1: Identificar usos de CancelToken**

```javascript
// Procurar por:
- axios.CancelToken
- CancelToken.source()
- new CancelToken()
- cancelToken: ...
- axios.isCancel()
```

**Passo 2: Substituir CancelToken.source()**

```javascript
// ❌ ANTES (CancelToken)
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/api/dados', {
  cancelToken: source.token
});

source.cancel('Cancelado');

// ✅ DEPOIS (AbortController)
const controller = new AbortController();

axios.get('/api/dados', {
  signal: controller.signal
});

controller.abort('Cancelado');
```

**Passo 3: Substituir new CancelToken()**

```javascript
// ❌ ANTES (CancelToken)
let cancel;

const token = new axios.CancelToken(c => {
  cancel = c;
});

axios.get('/api/dados', { cancelToken: token });

cancel('Cancelado');

// ✅ DEPOIS (AbortController)
const controller = new AbortController();

axios.get('/api/dados', { signal: controller.signal });

controller.abort('Cancelado');
```

**Passo 4: Substituir axios.isCancel()**

```javascript
// ❌ ANTES (CancelToken)
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Cancelado');
  }
});

// ✅ DEPOIS (AbortController)
.catch(error => {
  if (error.name === 'CanceledError') {
    console.log('Cancelado');
  }
});

// Ou manter axios.isCancel (funciona com ambos)
.catch(error => {
  if (axios.isCancel(error)) {
    console.log('Cancelado');
  }
});
```

**Passo 5: Testar migração**

```javascript
// Verificar:
1. Requisições cancelam corretamente
2. Erro de cancelamento é detectado
3. Cleanup funciona (React useEffect, etc.)
4. Múltiplas requisições cancelam juntas
```

### Tabela de Equivalência

| CancelToken (deprecated) | AbortController (recomendado) |
|-------------------------|------------------------------|
| `const source = CancelToken.source()` | `const controller = new AbortController()` |
| `cancelToken: source.token` | `signal: controller.signal` |
| `source.cancel(message)` | `controller.abort(message)` |
| `axios.isCancel(error)` | `error.name === 'CanceledError'` ou `axios.isCancel(error)` |
| `new CancelToken(executor)` | `new AbortController()` |

### Exemplo Completo de Migração

**ANTES (CancelToken):**

```javascript
// ❌ Código legado com CancelToken
class ApiService {
  constructor() {
    this.sources = new Map();
  }
  
  async get(key, url, config = {}) {
    // Cancelar anterior
    if (this.sources.has(key)) {
      this.sources.get(key).cancel('Nova requisição');
    }
    
    // Criar source
    const source = axios.CancelToken.source();
    this.sources.set(key, source);
    
    try {
      const response = await axios.get(url, {
        ...config,
        cancelToken: source.token
      });
      
      this.sources.delete(key);
      return response;
    } catch (error) {
      this.sources.delete(key);
      
      if (!axios.isCancel(error)) {
        throw error;
      }
    }
  }
  
  cancelAll() {
    this.sources.forEach(source => source.cancel('Cancelando todas'));
    this.sources.clear();
  }
}
```

**DEPOIS (AbortController):**

```javascript
// ✅ Código moderno com AbortController
class ApiService {
  constructor() {
    this.controllers = new Map();
  }
  
  async get(key, url, config = {}) {
    // Cancelar anterior
    if (this.controllers.has(key)) {
      this.controllers.get(key).abort();
    }
    
    // Criar controller
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
      
      if (error.name !== 'CanceledError') {
        throw error;
      }
    }
  }
  
  cancelAll() {
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
  }
}
```

---

## ⚠️ Limitações e Considerações

### Por Que NÃO Usar CancelToken

1. **Deprecated:** Oficialmente descontinuado
2. **Não é padrão:** API proprietária do Axios
3. **Interoperabilidade:** Não funciona com Fetch ou outras libs
4. **Futuro:** Pode ser removido em futuras versões do Axios
5. **Comunidade:** Documentação e exemplos focam em AbortController

### Quando Ainda Encontrará CancelToken

- Código legado (projetos antigos)
- Tutoriais antigos (pré-2021)
- Axios < v0.22.0 (versões antigas)

### Compatibilidade

**CancelToken funciona em:**
- Axios >= v0.15.0
- Node.js todas as versões
- Browsers todos

**AbortController funciona em:**
- Axios >= v0.22.0
- Node.js >= v15.0.0 (ou polyfill)
- Browsers modernos (2017+)

**Para suportar browsers antigos:**
```javascript
// Polyfill para AbortController
npm install abortcontroller-polyfill

// No código
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
```

---

## 🔗 Interconexões Conceituais

### CancelToken vs AbortController vs Timeout

**Três formas de cancelar requisições:**

```javascript
// 1. CancelToken (deprecated)
const source = CancelToken.source();
axios.get('/api/dados', { cancelToken: source.token });
source.cancel();

// 2. AbortController (recomendado)
const controller = new AbortController();
axios.get('/api/dados', { signal: controller.signal });
controller.abort();

// 3. Timeout (automático)
axios.get('/api/dados', { timeout: 5000 }); // Cancela após 5s
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **AbortController:** API moderna para cancelamento
2. **Timeout config:** Cancelamento automático por tempo
3. **Cleanup patterns:** Organizar cancelamento em apps

---

## 📚 Conclusão

**CancelToken** é **deprecated** e **não deve ser usado** em novos projetos.

**Resumo:**
- ❌ **NÃO USE** CancelToken em novos projetos
- ✅ **USE** AbortController (padrão Web, moderno)
- 🔄 **MIGRE** código legado de CancelToken para AbortController
- 📖 **COMPREENDA** CancelToken apenas para manutenção de código antigo

**Migração é simples:**

| CancelToken | AbortController |
|------------|----------------|
| `CancelToken.source()` | `new AbortController()` |
| `cancelToken: source.token` | `signal: controller.signal` |
| `source.cancel()` | `controller.abort()` |
| `axios.isCancel(error)` | `error.name === 'CanceledError'` |

**Vantagens de AbortController:**
- ✅ Padrão Web (funciona com Fetch, Axios, etc.)
- ✅ API mais simples
- ✅ Melhor suporte e documentação
- ✅ Futuro-proof (não será removido)

**Use AbortController em todos os novos projetos!**
