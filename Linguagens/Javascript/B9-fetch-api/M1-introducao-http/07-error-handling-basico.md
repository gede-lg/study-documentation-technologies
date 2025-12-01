# Error Handling Básico com Fetch API: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Error handling** (tratamento de erros) com Fetch API refere-se ao conjunto de **técnicas e padrões para detectar, capturar, processar e reagir a falhas** que ocorrem durante comunicação HTTP. Conceitualmente, é a arte de transformar o "caminho infeliz" (quando algo dá errado) em fluxo controlado e previsível, permitindo que aplicações falhem graciosamente ao invés de quebrar silenciosamente.

Na essência, error handling com Fetch envolve compreender que **nem todos os erros são iguais**: falhas de rede são diferentes de respostas HTTP com erro (4xx, 5xx), que são diferentes de erros de parsing de dados. Cada tipo exige tratamento específico.

### Contexto Histórico e Motivação

Fetch API introduziu uma **peculiaridade conceitual** que confunde iniciantes: **Promises retornadas por fetch() só rejeitam em caso de falha de rede total**, não para status HTTP de erro como 404 ou 500.

**Razão Conceitual**: Do ponto de vista do protocolo HTTP, uma resposta 404 é uma **comunicação bem-sucedida** - o servidor respondeu, apenas informando que recurso não existe. A Promise rejeita quando a **comunicação em si falha** (sem conexão, timeout, DNS failure).

Isso contrasta com bibliotecas como Axios que rejeitam automaticamente para 4xx e 5xx, causando confusão inicial mas oferecendo **controle mais explícito** sobre o que constitui "erro".

### Problema Fundamental que Resolve

Error handling robusto resolve problemas críticos:

**1. User Experience**: Erros não tratados resultam em UI quebrada, spinners infinitos, ações silenciosamente falhadas. Tratamento adequado permite feedback claro ao usuário.

**2. Resiliência**: Aplicações que lidam bem com erros podem implementar retry, fallbacks, degradação graciosa.

**3. Debugging**: Logs e stack traces claros aceleram identificação de problemas.

**4. Segurança**: Não vazar informações sensíveis em mensagens de erro expostas ao usuário.

**5. Conformidade**: APIs devem comunicar erros de forma padronizada (status codes, mensagens estruturadas).

### Importância no Ecossistema

Error handling é **crítico mas frequentemente negligenciado**:

- **Produção vs Desenvolvimento**: Código funciona em dev mas falha silenciosamente em produção por falta de error handling
- **Monitoring**: Erros não tratados não são logados/reportados
- **API Design**: APIs bem projetadas usam status codes e estruturas de erro consistentes
- **Frameworks**: React Error Boundaries, Vue error handlers - todos dependem de error handling apropriado

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Tipos de Erro**: Network errors vs HTTP errors vs Parsing errors
2. **Promise Rejection**: Fetch só rejeita para network errors
3. **response.ok**: Verificação manual necessária para HTTP errors
4. **try/catch com async/await**: Captura erros de rede E exceções lançadas
5. **.catch() com Promises**: Alternativa para encadeamento .then()

### Pilares Fundamentais

- **Network Errors**: Sem conexão, timeout, CORS block
- **HTTP Error Status**: 4xx (client errors), 5xx (server errors)
- **Parsing Errors**: .json() falha se response não for JSON válido
- **Error Objects**: Criar erros informativos com context
- **Retry Logic**: Tentar novamente operações que falharam

### Visão Geral das Nuances

- `response.ok` = true apenas para status 200-299
- `response.status` permite verificar código específico
- `.json()` pode lançar exceção se body não for JSON
- Erros em `.catch()` devem ser re-lançados ou tratados
- Headers `Retry-After` indicam quando tentar novamente

---

## 🧠 Fundamentos Teóricos

### Tipos de Erros com Fetch

#### 1. Network Errors (Promise Rejection)

**Causas**:
- Sem conexão de internet
- CORS policy violation
- DNS failure
- Request abortado (AbortController)
- Timeout (se implementado)

**Comportamento**: Promise **rejeita**, erro é TypeError genérico:

```javascript
try {
  const response = await fetch('https://url-invalida-xyz.com');
} catch (erro) {
  console.error(erro);
  // TypeError: Failed to fetch
  // Ou: TypeError: NetworkError when attempting to fetch resource
}
```

**Conceito**: Esses erros indicam que **comunicação HTTP não foi estabelecida**. Servidor nem foi contactado.

#### 2. HTTP Error Status (Promise Fulfilled!)

**Causas**:
- 4xx: Erros do cliente (400 Bad Request, 401 Unauthorized, 404 Not Found)
- 5xx: Erros do servidor (500 Internal Server Error, 503 Service Unavailable)

**Comportamento**: Promise **resolve** normalmente, mas `response.ok = false`:

```javascript
const response = await fetch('https://api.exemplo.com/nao-existe');

console.log(response.ok); // false
console.log(response.status); // 404
console.log(response.statusText); // "Not Found"

// Promise NÃO foi rejeitada!
```

**Conceito**: Comunicação HTTP foi bem-sucedida. Servidor respondeu, apenas informando que há um problema (recurso não existe, acesso negado, etc.).

#### 3. Parsing Errors

**Causas**:
- Chamar `.json()` em response que não é JSON válido
- HTML de erro sendo parseado como JSON
- Response vazio onde se espera JSON

**Comportamento**: `.json()` retorna Promise que **rejeita**:

```javascript
try {
  const response = await fetch(url);
  const data = await response.json(); // Se body for HTML, lança erro
} catch (erro) {
  console.error(erro);
  // SyntaxError: Unexpected token < in JSON at position 0
}
```

**Conceito**: Data fetched com sucesso, mas está em formato inesperado.

### Princípios de Error Handling

#### 1. Verificar response.ok

**Sempre** verificar antes de processar body:

```javascript
const response = await fetch(url);

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();
```

**Conceito**: `response.ok` é `true` apenas para status 200-299. É o indicador simples de "tudo certo".

#### 2. Estrutura try/catch Apropriada

Com async/await, try/catch captura **network errors E exceções lançadas manualmente**:

```javascript
async function buscarDados(url) {
  try {
    const response = await fetch(url);
    
    // Lançar exceção para HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Pode falhar se não for JSON
    const data = await response.json();
    
    return data;
    
  } catch (erro) {
    // Captura:
    // 1. Network errors (fetch rejeitou)
    // 2. HTTP errors (lançamos manualmente)
    // 3. Parsing errors (.json() rejeitou)
    
    console.error('Erro ao buscar dados:', erro);
    throw erro; // Re-lança para quem chamou decidir
  }
}
```

#### 3. Erros Informativos

Criar erros com **contexto útil**:

```javascript
async function buscarUsuario(id) {
  try {
    const response = await fetch(`/api/usuarios/${id}`);
    
    if (!response.ok) {
      // Tentar extrair mensagem de erro do servidor
      let mensagem = `HTTP ${response.status}`;
      
      try {
        const errorBody = await response.json();
        mensagem = errorBody.mensagem || mensagem;
      } catch {
        // Servidor não retornou JSON, usar mensagem padrão
      }
      
      const erro = new Error(mensagem);
      erro.status = response.status;
      erro.userId = id;
      throw erro;
    }
    
    return await response.json();
    
  } catch (erro) {
    console.error(`Falha ao buscar usuário ${id}:`, erro);
    throw erro;
  }
}
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: Basic Error Checking

```javascript
async function fetchBasico(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (erro) {
    console.error('Erro:', erro);
    throw erro;
  }
}
```

**Prós**: Simples, claro
**Contras**: Mensagem de erro genérica, não distingue tipos de erro

### Pattern 2: Tratamento por Status Code

```javascript
async function fetchComStatusHandling(url) {
  try {
    const response = await fetch(url);
    
    switch (response.status) {
      case 200:
        return await response.json();
        
      case 400:
        const badRequest = await response.json();
        throw new Error(`Requisição inválida: ${badRequest.mensagem}`);
        
      case 401:
        // Redirecionar para login
        window.location.href = '/login';
        throw new Error('Não autenticado');
        
      case 403:
        throw new Error('Sem permissão para este recurso');
        
      case 404:
        throw new Error('Recurso não encontrado');
        
      case 500:
      case 502:
      case 503:
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
        
      default:
        throw new Error(`Erro inesperado: ${response.status}`);
    }
    
  } catch (erro) {
    console.error('Erro:', erro);
    throw erro;
  }
}
```

**Prós**: Tratamento específico por código
**Contras**: Verbose

### Pattern 3: Custom Error Classes

```javascript
class HTTPError extends Error {
  constructor(response, body) {
    super(`HTTP ${response.status}: ${response.statusText}`);
    this.name = 'HTTPError';
    this.response = response;
    this.status = response.status;
    this.body = body;
  }
}

class NotFoundError extends HTTPError {
  constructor(response, body) {
    super(response, body);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends HTTPError {
  constructor(response, body) {
    super(response, body);
    this.name = 'UnauthorizedError';
  }
}

async function fetchComCustomErrors(url) {
  const response = await fetch(url);
  
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    
    switch (response.status) {
      case 404:
        throw new NotFoundError(response, body);
      case 401:
        throw new UnauthorizedError(response, body);
      default:
        throw new HTTPError(response, body);
    }
  }
  
  return await response.json();
}

// Uso
try {
  const data = await fetchComCustomErrors('/api/dados');
} catch (erro) {
  if (erro instanceof NotFoundError) {
    mostrarMensagem('Dados não encontrados');
  } else if (erro instanceof UnauthorizedError) {
    redirecionarParaLogin();
  } else if (erro instanceof HTTPError) {
    mostrarErroGenerico(erro.message);
  } else {
    // Network error ou parsing error
    mostrarErroDeConexao();
  }
}
```

**Prós**: Erros tipados, fácil distinguir tipos com instanceof
**Contras**: Mais código boilerplate

### Pattern 4: Wrapper Function Reutilizável

```javascript
async function fetchJSON(url, options = {}) {
  let response;
  
  try {
    response = await fetch(url, options);
  } catch (erro) {
    // Network error
    const networkError = new Error('Erro de conexão. Verifique sua internet.');
    networkError.original = erro;
    networkError.type = 'network';
    throw networkError;
  }
  
  // HTTP error handling
  if (!response.ok) {
    let errorBody;
    
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { mensagem: response.statusText };
    }
    
    const erro = new Error(errorBody.mensagem || `HTTP ${response.status}`);
    erro.status = response.status;
    erro.body = errorBody;
    erro.type = 'http';
    
    throw erro;
  }
  
  // Parsing
  try {
    return await response.json();
  } catch (erro) {
    const parseError = new Error('Resposta não é JSON válido');
    parseError.original = erro;
    parseError.type = 'parse';
    throw parseError;
  }
}

// Uso simples
try {
  const data = await fetchJSON('/api/dados');
  console.log(data);
} catch (erro) {
  switch (erro.type) {
    case 'network':
      mostrarErroDeConexao();
      break;
    case 'http':
      if (erro.status === 404) {
        mostrar404();
      } else if (erro.status >= 500) {
        mostrarErroDeServidor();
      }
      break;
    case 'parse':
      console.error('Servidor retornou formato inválido');
      break;
  }
}
```

### Pattern 5: Retry com Backoff

```javascript
async function fetchComRetry(url, options = {}, maxRetries = 3) {
  let ultimoErro;
  
  for (let tentativa = 0; tentativa < maxRetries; tentativa++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        // Não retry para erros de cliente (4xx)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(`Erro do cliente: ${response.status}`);
        }
        
        // Retry para erros de servidor (5xx)
        throw new Error(`Erro do servidor: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (erro) {
      ultimoErro = erro;
      
      // Não retry em último tentativa
      if (tentativa === maxRetries - 1) {
        break;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, tentativa) * 1000; // 1s, 2s, 4s
      console.log(`Tentativa ${tentativa + 1} falhou. Retry em ${delay}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw ultimoErro;
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Pattern

**Basic Error Checking**: Apps simples, protótipos
**Status Handling**: APIs com semântica rica de status codes
**Custom Errors**: Aplicações grandes, múltiplos tipos de erro
**Wrapper Function**: Centralizar lógica, DRY
**Retry Logic**: Requests críticos, serviços instáveis

### Integration com UI

```javascript
// React Example
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/usuarios/${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Usuário não encontrado');
          } else if (response.status === 401) {
            throw new Error('Faça login para continuar');
          } else {
            throw new Error('Erro ao carregar usuário');
          }
        }
        
        const data = await response.json();
        setUser(data);
        
      } catch (erro) {
        setError(erro.message);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  return <div>{user.nome}</div>;
}
```

---

## ⚠️ Limitações e Considerações Teóricas

### Armadilhas Comuns

#### Armadilha 1: Não Verificar response.ok

```javascript
// ❌ ERRO - assume sucesso
const data = await fetch(url).then(r => r.json());

// ✅ CORRETO
const response = await fetch(url);
if (!response.ok) throw new Error('HTTP error');
const data = await response.json();
```

#### Armadilha 2: Engolir Erros

```javascript
// ❌ Erro desaparece
fetch(url)
  .catch(erro => console.log(erro)); // Não re-lança nem trata

// ✅ Re-lançar ou tratar apropriadamente
fetch(url)
  .catch(erro => {
    console.error(erro);
    throw erro; // Ou retornar fallback
  });
```

#### Armadilha 3: Parsing Sem Validação

```javascript
// ❌ Assume que response é JSON
const data = await fetch(url).then(r => r.json());

// ✅ Verificar Content-Type
const response = await fetch(url);
const contentType = response.headers.get('Content-Type');

if (contentType && contentType.includes('application/json')) {
  const data = await response.json();
} else {
  throw new Error('Resposta não é JSON');
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Status Codes

Error handling depende de compreender semântica de status codes:
- 4xx: Erro do cliente, não retry
- 5xx: Erro do servidor, pode retry
- 429: Rate limit, usar Retry-After header

### Relação com Promises

try/catch funciona com Promises:
- Promise rejeitada → catch block
- throw em try → catch block
- return em catch → Promise resolve

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar error handling básico:
1. **Error Monitoring**: Sentry, LogRocket para tracking
2. **Circuit Breaker**: Parar requests após múltiplas falhas
3. **Offline Handling**: Service Workers, cache fallback
4. **User Feedback**: Toasts, error boundaries, retry buttons
5. **Logging**: Structured logs para debugging

---

## 📚 Conclusão

Error handling com Fetch é **crítico mas não automático**. Requer:
- Compreender que fetch **não rejeita para HTTP errors**
- Verificar `response.ok` **sempre**
- Distinguir tipos de erro (network, HTTP, parsing)
- Implementar retry para erros transitórios
- Criar erros informativos com contexto

É a diferença entre aplicação robusta e aplicação que falha silenciosamente.
