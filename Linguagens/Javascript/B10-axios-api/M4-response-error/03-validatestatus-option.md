# validateStatus Option

## 🎯 Introdução e Definição

### Definição Conceitual

**validateStatus** é uma opção de configuração do Axios que permite **customizar a lógica de validação** de respostas HTTP, decidindo quais status codes devem ser considerados **sucesso** (Promise resolvida) e quais devem ser considerados **erro** (Promise rejeitada).

Conceitualmente, é uma **função de decisão** - recebe o status code HTTP (200, 404, 500, etc.) e retorna `true` (sucesso) ou `false` (erro). É como definir **regras customizadas** para o que constitui uma resposta válida ou inválida.

**Comportamento padrão do Axios:**
```javascript
// Default validateStatus (implícito)
validateStatus: function(status) {
  return status >= 200 && status < 300; // 2xx = sucesso
}

// 200-299 → Sucesso (Promise resolvida)
// 300+ → Erro (Promise rejeitada, vai para catch)
```

**Sintaxe:**
```javascript
axios.get('/api/dados', {
  validateStatus: function(status) {
    return status < 500; // 2xx, 3xx, 4xx = sucesso; 5xx = erro
  }
});
```

**Por que customizar?**
- **Aceitar status específicos:** Tratar 404 como sucesso (recurso opcional)
- **Rejeitar status específicos:** Lançar erro para 200 se payload inválido
- **Lógica complexa:** Decisões baseadas em múltiplos critérios
- **Testing:** Simular diferentes comportamentos

**Exemplo prático:**
```javascript
// Aceitar 404 (recurso opcional não encontrado)
const response = await axios.get('/api/usuario/perfil', {
  validateStatus: status => status === 200 || status === 404
});

if (response.status === 200) {
  console.log('Perfil encontrado:', response.data);
} else if (response.status === 404) {
  console.log('Perfil não existe (criar novo)');
}
// Não vai para catch!
```

### Contexto Histórico e Motivação

Antes de `validateStatus`, bibliotecas HTTP tinham lógica fixa de erro:

**XMLHttpRequest (lógica manual):**

```javascript
// ❌ Lógica de sucesso/erro manual em CADA requisição
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/dados');
xhr.onload = function() {
  // Precisa checar status manualmente
  if (xhr.status >= 200 && xhr.status < 300) {
    // Sucesso
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  } else if (xhr.status === 404) {
    // Tratar 404 como caso especial
    console.log('Não encontrado');
  } else {
    // Outros erros
    console.error('Erro:', xhr.status);
  }
};
xhr.send();
```

**Fetch API (lógica fixa, sem customização):**

```javascript
// ❌ Fetch NÃO lança erro para 4xx, 5xx!
const response = await fetch('/api/dados');

// Precisa checar response.ok MANUALMENTE
if (!response.ok) {
  // 4xx, 5xx - mas NÃO foi para catch automaticamente!
  throw new Error(`HTTP error! status: ${response.status}`);
}

const data = await response.json();

// Impossível customizar lógica (aceitar 404, rejeitar outros)
```

**Axios sem validateStatus (lógica fixa):**

```javascript
// ❌ Sem validateStatus - lógica fixa
try {
  await axios.get('/api/usuario/perfil-opcional');
} catch (error) {
  // 404 sempre cai aqui (pode não ser desejado)
  if (error.response?.status === 404) {
    // Tratar 404 no catch (verboso)
    console.log('Perfil não existe');
  } else {
    throw error;
  }
}
```

**Problemas:**
1. **Lógica fixa:** Impossível customizar o que é erro
2. **Verbose:** Precisa tratar status específicos no catch
3. **Sem flexibilidade:** 404 sempre erro, mesmo quando esperado
4. **Inconsistente:** Lógica espalhada entre if/else e try/catch

**validateStatus resolveu:**

```javascript
// ✅ Lógica customizada de validação
const response = await axios.get('/api/usuario/perfil-opcional', {
  validateStatus: status => status < 500 // 4xx também é sucesso
});

// 404 NÃO vai para catch!
if (response.status === 200) {
  console.log('Perfil:', response.data);
} else if (response.status === 404) {
  console.log('Perfil não existe, criar novo');
}

// Apenas 5xx vão para catch
```

**Vantagens:**
- **Customização:** Definir o que é sucesso/erro por requisição
- **Clareza:** Lógica de validação explícita
- **Flexibilidade:** Aceitar status específicos conforme contexto
- **Menos try/catch:** Status esperados não caem no catch

### Problema Fundamental que Resolve

**validateStatus resolve decisões customizadas sobre sucesso/erro HTTP:**

**1. Aceitar Status Específicos como Sucesso:**

```javascript
// Cenário: API retorna 404 se usuário não tem configurações
//          (não é erro, é estado válido - usar defaults)
const response = await axios.get('/api/usuario/config', {
  validateStatus: status => status === 200 || status === 404
});

if (response.status === 200) {
  return response.data; // Config customizada
} else if (response.status === 404) {
  return getDefaultConfig(); // Config padrão
}
```

**2. Rejeitar Apenas Erros Graves (5xx):**

```javascript
// Aceitar 4xx (erro cliente - pode ser tratado)
// Rejeitar 5xx (erro servidor - retry ou falha crítica)
try {
  const response = await axios.post('/api/formulario', formData, {
    validateStatus: status => status < 500
  });
  
  if (response.status === 200) {
    console.log('Sucesso!');
  } else if (response.status === 400) {
    // Validação de formulário (não é erro crítico)
    showValidationErrors(response.data.errors);
  }
} catch (error) {
  // Apenas 5xx caem aqui (erro crítico)
  console.error('Erro servidor:', error);
}
```

**3. Lógica Condicional Complexa:**

```javascript
// Aceitar sucesso E "soft errors" (409 Conflict esperado)
const response = await axios.put('/api/recurso/atualizar', data, {
  validateStatus: status => {
    return (status >= 200 && status < 300) || status === 409;
  }
});

if (response.status === 200) {
  console.log('Atualizado');
} else if (response.status === 409) {
  console.log('Conflito (versão desatualizada), recarregar e tentar novamente');
  const latestData = await axios.get('/api/recurso');
  // ...
}
```

**4. Testing - Simular Erros:**

```javascript
// Em testes, forçar status 200 a ser tratado como erro
const response = await axios.get('/api/dados', {
  validateStatus: status => false // TUDO é erro
});

// Nunca executado (sempre cai no catch)
```

**5. APIs com Convenções Customizadas:**

```javascript
// API retorna 200 com { success: false } para erros de negócio
const response = await axios.post('/api/transacao', transacaoData, {
  validateStatus: status => status === 200
});

// Agora checar response.data.success
if (response.data.success) {
  console.log('Transação concluída');
} else {
  console.error('Erro de negócio:', response.data.error);
  // NÃO caiu no catch (status 200)
}
```

### Importância no Ecossistema

**validateStatus é fundamental para:**

- **APIs RESTful:** Tratar status codes semânticos (404 = recurso opcional)
- **Soft errors:** Status esperados que não são erros críticos (409 Conflict)
- **Error handling:** Separar erros cliente (4xx) de servidor (5xx)
- **Testing:** Simular diferentes comportamentos de validação
- **Legacy APIs:** Adaptar a APIs com convenções customizadas
- **Conditional logic:** Decisões baseadas em múltiplos status

**Padrão REST - Recurso opcional:**

```javascript
// GET /api/usuarios/:id/avatar
// 200 - avatar existe
// 404 - avatar não existe (usar default)

const response = await axios.get(`/api/usuarios/${id}/avatar`, {
  responseType: 'blob',
  validateStatus: status => status === 200 || status === 404
});

if (response.status === 200) {
  return URL.createObjectURL(response.data);
} else {
  return '/images/default-avatar.png';
}
```

**Padrão - Separar erros cliente vs servidor:**

```javascript
async function fetchData(url) {
  try {
    const response = await axios.get(url, {
      validateStatus: status => status < 500
    });
    
    // 2xx, 3xx, 4xx chegam aqui
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else if (response.status >= 400 && response.status < 500) {
      // Erro cliente (404, 400, 403, etc.)
      throw new ClientError(response.status, response.data);
    }
  } catch (error) {
    // Apenas 5xx ou erros de rede caem aqui
    throw new ServerError(error);
  }
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Função de validação:** Recebe status, retorna boolean
2. **Default behavior:** Status 2xx = sucesso
3. **Customização:** Aceitar/rejeitar status específicos
4. **Promise resolution:** true = resolve, false = reject
5. **Per-request:** Configurável por requisição

### Pilares Fundamentais

- **Assinatura:** `validateStatus: (status: number) => boolean`
- **Default:** `status >= 200 && status < 300`
- **true:** Promise resolvida (sucesso)
- **false:** Promise rejeitada (erro, vai para catch)
- **Escopo:** Request-level ou instance/global defaults

### Visão Geral das Nuances

- **Status apenas:** Função recebe apenas status code (não response completo)
- **Sync function:** Validação síncrona (não pode ser async)
- **Combinável:** Pode compor com outros configs (timeout, headers)
- **Testing:** Útil para simular comportamentos em testes
- **Edge cases:** Status 0 (network error), 3xx (redirects)

---

## 🧠 Fundamentos Teóricos

### Assinatura da Função

```javascript
validateStatus: (status: number) => boolean
```

**Parâmetros:**
- `status` (number): HTTP status code (200, 404, 500, etc.)

**Retorno:**
- `true`: Status considerado **sucesso** (Promise resolvida)
- `false`: Status considerado **erro** (Promise rejeitada)

**Exemplo:**

```javascript
axios.get('/api/dados', {
  validateStatus: function(status) {
    console.log('Status recebido:', status); // 200, 404, etc.
    return status < 500; // true se < 500, false caso contrário
  }
});
```

### Default Behavior

**Axios padrão:**

```javascript
// Comportamento implícito
validateStatus: function(status) {
  return status >= 200 && status < 300;
}

// 200-299 → true (sucesso)
// 300+ → false (erro)
```

**Exemplos:**

| Status | Default Result | Comportamento |
|--------|----------------|---------------|
| 200 | true | Sucesso |
| 201 | true | Sucesso |
| 204 | true | Sucesso |
| 304 | false | Erro (vai para catch) |
| 400 | false | Erro (vai para catch) |
| 404 | false | Erro (vai para catch) |
| 500 | false | Erro (vai para catch) |

### Customizações Comuns

#### Aceitar 4xx como Sucesso

```javascript
// Tratar 4xx como sucesso (apenas 5xx são erros)
const response = await axios.get('/api/dados', {
  validateStatus: status => status < 500
});

// 400, 404, etc. não vão para catch
if (response.status === 404) {
  console.log('Não encontrado');
}
```

#### Aceitar Status Específico

```javascript
// Aceitar 200 E 404
const response = await axios.get('/api/recurso-opcional', {
  validateStatus: status => status === 200 || status === 404
});

// 200, 404 → sucesso
// Outros → erro
```

#### Aceitar Range de Status

```javascript
// Aceitar 2xx E 3xx
axios.get('/api/dados', {
  validateStatus: status => status < 400
});

// Aceitar 2xx, 4xx (rejeitar apenas 3xx, 5xx)
axios.get('/api/dados', {
  validateStatus: status => (status >= 200 && status < 300) || (status >= 400 && status < 500)
});
```

#### Rejeitar Tudo (Testing)

```javascript
// Forçar erro sempre
axios.get('/api/dados', {
  validateStatus: status => false
});

// SEMPRE cai no catch, mesmo com 200
```

#### Aceitar Tudo (Inspeção Manual)

```javascript
// Nunca lança erro
const response = await axios.get('/api/dados', {
  validateStatus: status => true
});

// Checar status manualmente
if (response.status === 200) {
  console.log('Sucesso');
} else {
  console.log('Erro:', response.status);
}
```

### Uso com Defaults

**Configurar globalmente:**

```javascript
// Aplicar a TODAS as requisições
axios.defaults.validateStatus = function(status) {
  return status < 500;
};

// Agora TODAS as requisições aceitam 4xx
await axios.get('/api/dados'); // 404 não cai no catch
```

**Configurar em instance:**

```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  validateStatus: status => status < 500
});

// Todas as requisições desta instance aceitam 4xx
await api.get('/usuarios'); // 404 não cai no catch
```

**Override por requisição:**

```javascript
// Default global
axios.defaults.validateStatus = status => status < 500;

// Override em requisição específica
await axios.get('/api/critical', {
  validateStatus: status => status >= 200 && status < 300 // Apenas 2xx
});
```

### Lógica Complexa

**Múltiplas condições:**

```javascript
axios.get('/api/dados', {
  validateStatus: status => {
    // Sucesso: 2xx, 404, 409
    if (status >= 200 && status < 300) return true;
    if (status === 404) return true;
    if (status === 409) return true;
    
    // Erro: tudo mais
    return false;
  }
});
```

**Baseado em ranges:**

```javascript
axios.get('/api/dados', {
  validateStatus: status => {
    const acceptedRanges = [
      [200, 299], // 2xx
      [400, 404], // 400-404
      [409, 409]  // 409
    ];
    
    return acceptedRanges.some(([min, max]) => status >= min && status <= max);
  }
});
```

---

## 🔍 Análise Conceitual Profunda

### Padrões de Uso

#### Pattern 1: Optional Resource

```javascript
// Recurso opcional (404 esperado)
async function getOptionalResource(id) {
  const response = await axios.get(`/api/resources/${id}`, {
    validateStatus: status => status === 200 || status === 404
  });
  
  if (response.status === 200) {
    return response.data;
  } else {
    return null; // Recurso não existe
  }
}

// Uso
const resource = await getOptionalResource(123);
if (resource) {
  console.log('Resource:', resource);
} else {
  console.log('Resource não existe');
}
```

#### Pattern 2: Soft Errors vs Hard Errors

```javascript
// 4xx = soft errors (tratáveis)
// 5xx = hard errors (críticos)
async function fetchWithSoftErrors(url) {
  try {
    const response = await axios.get(url, {
      validateStatus: status => status < 500
    });
    
    // 2xx, 3xx, 4xx chegam aqui
    if (response.status >= 200 && response.status < 300) {
      return { success: true, data: response.data };
    }
    
    // 4xx - soft error
    return {
      success: false,
      error: 'client_error',
      status: response.status,
      message: response.data.message
    };
    
  } catch (error) {
    // 5xx ou network error - hard error
    return {
      success: false,
      error: 'server_error',
      message: error.message
    };
  }
}

// Uso
const result = await fetchWithSoftErrors('/api/usuarios');
if (result.success) {
  console.log(result.data);
} else if (result.error === 'client_error') {
  alert(`Erro: ${result.message}`);
} else {
  alert('Erro servidor, tente novamente mais tarde');
}
```

#### Pattern 3: Conflict Handling (409)

```javascript
// PUT com possível conflito (versão desatualizada)
async function updateResource(id, data, version) {
  const response = await axios.put(
    `/api/resources/${id}`,
    data,
    {
      headers: { 'If-Match': version },
      validateStatus: status => status === 200 || status === 409
    }
  );
  
  if (response.status === 200) {
    return { updated: true, data: response.data };
  } else if (response.status === 409) {
    // Conflito - versão desatualizada
    const latest = await axios.get(`/api/resources/${id}`);
    return {
      updated: false,
      conflict: true,
      latestVersion: latest.data
    };
  }
}

// Uso
const result = await updateResource(123, newData, currentVersion);
if (result.updated) {
  console.log('Atualizado!');
} else if (result.conflict) {
  console.log('Conflito! Última versão:', result.latestVersion);
  // Mostrar merge UI
}
```

#### Pattern 4: Pagination - 404 = End

```javascript
// GET /api/items?page=N
// 200 - página existe
// 404 - página não existe (fim da paginação)

async function fetchAllPages(baseUrl) {
  const allItems = [];
  let page = 1;
  
  while (true) {
    const response = await axios.get(baseUrl, {
      params: { page },
      validateStatus: status => status === 200 || status === 404
    });
    
    if (response.status === 200) {
      allItems.push(...response.data);
      page++;
    } else if (response.status === 404) {
      // Fim da paginação
      break;
    }
  }
  
  return allItems;
}

// Uso
const allItems = await fetchAllPages('/api/items');
console.log(`Total: ${allItems.length} items`);
```

#### Pattern 5: Testing - Force Error

```javascript
// Teste: verificar se catch funciona
test('deve tratar erro corretamente', async () => {
  // Mock retorna 200, mas forçar erro com validateStatus
  axios.get = jest.fn().mockResolvedValue({
    status: 200,
    data: { ... }
  });
  
  try {
    await axios.get('/api/dados', {
      validateStatus: status => false // Forçar erro
    });
    fail('Deveria ter lançado erro');
  } catch (error) {
    expect(error).toBeDefined();
  }
});
```

#### Pattern 6: Conditional by Environment

```javascript
// Dev: aceitar tudo (inspecionar erros manualmente)
// Prod: comportamento padrão
const isDev = process.env.NODE_ENV === 'development';

axios.defaults.validateStatus = isDev
  ? status => true // Dev: nunca lança erro
  : status => status >= 200 && status < 300; // Prod: padrão

// Dev
const response = await axios.get('/api/dados'); // Nunca cai no catch
console.log('Status:', response.status);
console.log('Data:', response.data);

// Prod
try {
  await axios.get('/api/dados'); // 4xx, 5xx caem no catch
} catch (error) {
  // ...
}
```

### Interação com error.response

**validateStatus = false → error.response existe:**

```javascript
try {
  await axios.get('/api/dados', {
    validateStatus: status => status === 200 // Apenas 200 é sucesso
  });
} catch (error) {
  // 404, 500, etc. caem aqui
  console.log(error.response.status); // 404, 500, ...
  console.log(error.response.data);
}
```

**validateStatus = true → não vai para catch:**

```javascript
const response = await axios.get('/api/dados', {
  validateStatus: status => true // TUDO é sucesso
});

// 404, 500, etc. NÃO caem no catch
console.log(response.status); // 404, 500, ...
console.log(response.data); // Pode ter mensagem de erro
```

### Limitações

#### Não Tem Acesso a response.data

```javascript
// ❌ Não é possível acessar response.data em validateStatus
axios.get('/api/dados', {
  validateStatus: (status, response) => { // ← response não existe!
    // Queria checar response.data.success...
    return status === 200 && response.data.success; // ERRO!
  }
});

// ✅ Solução: usar validateStatus para status, checar data depois
const response = await axios.get('/api/dados', {
  validateStatus: status => status === 200
});

if (!response.data.success) {
  throw new Error(response.data.error);
}
```

#### Função Deve Ser Síncrona

```javascript
// ❌ validateStatus não pode ser async
axios.get('/api/dados', {
  validateStatus: async (status) => { // ERRO!
    const isValid = await checkStatusValidity(status);
    return isValid;
  }
});

// ✅ Solução: validação async DEPOIS
const response = await axios.get('/api/dados', {
  validateStatus: status => true // Aceitar tudo
});

// Validação async
const isValid = await validateResponse(response);
if (!isValid) {
  throw new Error('Resposta inválida');
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar validateStatus

**Use quando:**
- Status esperados que não são erros (404 opcional, 409 conflict)
- Separar erros cliente (4xx) de servidor (5xx)
- APIs com convenções customizadas
- Testing (forçar comportamentos)
- Inspeção manual de respostas (dev)

**Exemplo - Avatar opcional:**

```javascript
const avatarUrl = await getAvatarUrl(userId);

async function getAvatarUrl(userId) {
  const response = await axios.get(`/api/users/${userId}/avatar`, {
    responseType: 'blob',
    validateStatus: status => status === 200 || status === 404
  });
  
  if (response.status === 200) {
    return URL.createObjectURL(response.data);
  } else {
    return '/images/default-avatar.png';
  }
}
```

### Quando Não Usar

**Evite se:**
- Comportamento padrão é suficiente
- Lógica fica confusa (muitos ifs)
- Validação precisa acessar response.data

**Exemplo - não necessário:**

```javascript
// ❌ Desnecessário - comportamento padrão funciona
axios.get('/api/dados', {
  validateStatus: status => status >= 200 && status < 300
});

// ✅ Melhor - omitir (comportamento padrão)
axios.get('/api/dados');
```

---

## ⚠️ Limitações e Considerações Teóricas

### Apenas Status Code

```javascript
// validateStatus recebe APENAS status
// NÃO recebe response, headers, data, etc.

axios.get('/api/dados', {
  validateStatus: (status) => {
    // Pode usar: status
    // NÃO pode usar: response.data, response.headers
    return status < 500;
  }
});
```

### Síncrona

```javascript
// Função DEVE ser síncrona
// NÃO pode retornar Promise

// ❌ ERRO
validateStatus: async (status) => { ... }

// ✅ CORRETO
validateStatus: (status) => { ... }
```

### Network Errors Não Passam por validateStatus

```javascript
// validateStatus SÓ é chamada se servidor RESPONDEU
// Network errors (timeout, DNS) não passam por validateStatus

try {
  await axios.get('https://servidor-offline.com', {
    validateStatus: status => true // Nunca chamado!
  });
} catch (error) {
  // Network error cai aqui diretamente
  console.log(error.request); // Existe
  console.log(error.response); // undefined
}
```

---

## 🔗 Interconexões Conceituais

### validateStatus e Interceptors

**Interceptor vê resultado APÓS validateStatus:**

```javascript
axios.interceptors.response.use(
  response => {
    // validateStatus retornou true
    console.log('Sucesso:', response.status);
    return response;
  },
  error => {
    // validateStatus retornou false
    console.log('Erro:', error.response?.status);
    return Promise.reject(error);
  }
);
```

### validateStatus e Error Handling

**validateStatus define o que vai para catch:**

```javascript
try {
  const response = await axios.get('/api/dados', {
    validateStatus: status => status < 500
  });
  
  // 2xx, 3xx, 4xx chegam aqui
} catch (error) {
  // Apenas 5xx e network errors caem aqui
  if (error.response) {
    console.log('Erro 5xx:', error.response.status);
  } else {
    console.log('Network error');
  }
}
```

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Interceptors:** Transformar respostas globalmente
2. **Custom errors:** Criar classes de erro customizadas
3. **Error recovery:** Estratégias de recuperação
4. **Response validation:** Validar schema de response.data

### Conceitos Avançados

- **Conditional validateStatus:** Baseado em request config
- **Status mapping:** Mapear status para tipos de erro
- **Response schema validation:** Validar estrutura de response.data
- **Multi-tier validation:** Combinar validateStatus + data validation

---

## 📚 Conclusão

**validateStatus** é ferramenta **essencial para customizar validação** de respostas HTTP no Axios.

**Dominar validateStatus significa:**
- Saber **quando customizar** (status esperados, separar 4xx/5xx)
- Entender **assinatura** (recebe status, retorna boolean)
- Aplicar **padrões** (optional resource, soft errors, conflict handling)
- Conhecer **limitações** (apenas status, síncrona)
- Evitar **uso desnecessário** (comportamento padrão geralmente suficiente)

**Use validateStatus para:**
- ✅ Aceitar status específicos como sucesso (404, 409)
- ✅ Separar erros cliente (4xx) de servidor (5xx)
- ✅ APIs com convenções customizadas
- ✅ Testing (simular comportamentos)

**Evite se:**
- ❌ Comportamento padrão é suficiente
- ❌ Lógica fica muito complexa
- ❌ Precisa acessar response.data (use validação posterior)

Com **validateStatus**, você ganha **controle fino** sobre o que constitui sucesso ou erro, adaptando Axios a diferentes convenções de API e casos de uso específicos.
