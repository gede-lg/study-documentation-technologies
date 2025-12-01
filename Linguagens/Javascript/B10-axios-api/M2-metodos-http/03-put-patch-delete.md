# PUT, PATCH, DELETE

## 🎯 Introdução e Definição

### Definição Conceitual

Os métodos **PUT**, **PATCH** e **DELETE** no Axios são funções que permitem **modificar** e **remover** recursos existentes no servidor através de requisições HTTP. Conceitualmente, esses métodos representam operações de **atualização** (PUT e PATCH) e **remoção** (DELETE) - fundamentais para o ciclo de vida completo de recursos em aplicações web.

**PUT** (`axios.put(url, data)`) representa **substituição completa** de um recurso - você envia a representação completa atualizada e o servidor substitui o recurso existente integralmente.

**PATCH** (`axios.patch(url, data)`) representa **modificação parcial** de um recurso - você envia apenas os campos que deseja alterar, mantendo o resto do recurso intacto.

**DELETE** (`axios.delete(url)`) representa **remoção** de um recurso - você solicita ao servidor que delete permanentemente o recurso especificado.

### Contexto Histórico e Motivação

Historicamente, aplicações web usavam apenas **GET** e **POST**. Atualizações eram feitas via POST, e deleções também via POST com parâmetros especiais:

```html
<!-- Forma antiga - POST para tudo -->
<form method="POST" action="/usuarios/123?_method=delete">
  <button>Deletar</button>
</form>

<form method="POST" action="/usuarios/123?_method=put">
  <input name="nome" value="João Atualizado">
  <button>Atualizar</button>
</form>
```

**REST Architecture** (Roy Fielding, 2000) introduziu uso semântico de métodos HTTP:
- **GET** - Read
- **POST** - Create
- **PUT** - Update (completo)
- **PATCH** - Update (parcial) [RFC 5789, 2010]
- **DELETE** - Delete

Com APIs RESTful modernas, cada método tem propósito específico:

```javascript
// Operações CRUD completas
await axios.get('/api/usuarios/123');        // READ
await axios.post('/api/usuarios', {...});     // CREATE
await axios.put('/api/usuarios/123', {...});  // UPDATE (completo)
await axios.patch('/api/usuarios/123', {...}); // UPDATE (parcial)
await axios.delete('/api/usuarios/123');      // DELETE
```

**Axios** simplificou uso desses métodos, oferecendo funções dedicadas com mesma simplicidade de GET/POST.

### Problema Fundamental que Resolve

**PUT resolve:**
- **Substituição completa de recursos:** Atualizar todos os campos de um usuário, produto, configuração
- **Idempotência garantida:** Executar PUT múltiplas vezes produz mesmo resultado
- **Semântica clara:** Intenção explícita de substituição total

**PATCH resolve:**
- **Atualizações eficientes:** Enviar apenas campos alterados (economia de banda)
- **Modificações parciais:** Alterar email sem enviar nome, endereço, etc.
- **Menos risco de perda de dados:** Não sobrescreve campos não enviados

**DELETE resolve:**
- **Remoção explícita:** Intenção clara de deletar permanentemente
- **Idempotência:** DELETE de recurso já deletado não causa erro (geralmente retorna 404)
- **Semântica REST:** Mapeia diretamente para operação DELETE do CRUD

### Importância no Ecossistema

Esses métodos completam o **ciclo CRUD** em aplicações modernas:

**PUT:**
- Atualizar perfil completo de usuário
- Substituir configurações
- Atualizar documento inteiro
- Sincronização de dados (substituir versão antiga por nova)

**PATCH:**
- Alterar campo específico (mudar email, senha, avatar)
- Marcar tarefa como concluída
- Incrementar contador (views, likes)
- Ativar/desativar recurso

**DELETE:**
- Deletar conta de usuário
- Remover post, comentário, produto
- Cancelar pedido
- Limpar recursos temporários

A disponibilidade desses métodos no Axios permite que desenvolvedores construam aplicações completas, gerenciando recursos desde criação (POST) até remoção (DELETE), passando por leitura (GET) e atualização (PUT/PATCH).

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **PUT como Substituição Total:** Envia representação completa do recurso
2. **PATCH como Modificação Parcial:** Envia apenas campos a alterar
3. **DELETE como Remoção:** Remove recurso permanentemente
4. **Idempotência de PUT e DELETE:** Múltiplas execuções = mesmo resultado
5. **PATCH não é necessariamente idempotente:** Depende de implementação

### Pilares Fundamentais

- **Sintaxe Consistente:** `axios.put(url, data)`, `axios.patch(url, data)`, `axios.delete(url)`
- **URL Identifica Recurso:** URL aponta para recurso específico (ex: `/usuarios/123`)
- **Data no Body (PUT/PATCH):** Dados atualizados enviados no corpo
- **Status Codes Específicos:** 200 OK, 204 No Content, 404 Not Found
- **Promise-Based:** Todos retornam Promises

### Visão Geral das Nuances

- **PUT vs PATCH:** Substituição total vs parcial
- **DELETE com ou sem body:** DELETE geralmente sem body, mas pode ter
- **204 No Content:** Comum em DELETE e PUT/PATCH quando não retorna recurso
- **404 em DELETE:** Deletar recurso inexistente retorna 404 (geralmente)
- **Optimistic Delete:** Remover de UI antes de confirmação do servidor

---

## 🧠 Fundamentos Teóricos

### PUT: Substituição Completa

#### Sintaxe

```javascript
axios.put(url, data, config)
```

**Parâmetros:**
- `url` (string): URL do recurso a atualizar (ex: `/api/usuarios/123`)
- `data` (objeto): Representação completa atualizada do recurso
- `config` (objeto, opcional): Configurações adicionais

**Exemplo básico:**
```javascript
// Atualizar usuário completo
await axios.put('/api/usuarios/123', {
  id: 123,                    // ID geralmente incluído
  nome: 'João Silva Atualizado',
  email: 'joao.novo@example.com',
  idade: 31,
  ativo: true,
  // Todos os campos enviados
});
```

#### Conceito de Substituição Total

**PUT substitui recurso inteiro.** Se campo não for enviado, pode ser removido ou definido como null (depende do servidor).

**Exemplo ilustrativo:**

```javascript
// Estado atual no servidor
{
  id: 123,
  nome: 'João Silva',
  email: 'joao@example.com',
  idade: 30,
  cidade: 'São Paulo',
  ativo: true
}

// PUT sem campo 'cidade'
await axios.put('/api/usuarios/123', {
  id: 123,
  nome: 'João Silva Atualizado',
  email: 'joao@example.com',
  idade: 30,
  ativo: true
  // 'cidade' não enviada
});

// Estado final no servidor (cidade removida ou null)
{
  id: 123,
  nome: 'João Silva Atualizado',
  email: 'joao@example.com',
  idade: 30,
  cidade: null,  // ← Removida!
  ativo: true
}
```

**Lição:** Com PUT, envie **todos** os campos, mesmo os não alterados.

#### Idempotência de PUT

**PUT é idempotente:** Executar múltiplas vezes produz mesmo resultado.

```javascript
// Executar 3 vezes
await axios.put('/api/usuarios/123', { nome: 'João', email: 'j@e.com', idade: 30 });
await axios.put('/api/usuarios/123', { nome: 'João', email: 'j@e.com', idade: 30 });
await axios.put('/api/usuarios/123', { nome: 'João', email: 'j@e.com', idade: 30 });

// Resultado: Usuário 123 tem nome 'João', email 'j@e.com', idade 30
// Não cria 3 atualizações, apenas garante que estado final é esse
```

**Vantagem:** Retry seguro - se requisição falhar, pode tentar novamente sem efeitos colaterais.

#### Status Codes para PUT

**200 OK:** Atualização bem-sucedida, retorna recurso atualizado.
```javascript
const response = await axios.put('/api/usuarios/123', userData);
console.log(response.status); // 200
console.log(response.data); // { id: 123, nome: '...', ... }
```

**204 No Content:** Atualização bem-sucedida, sem body na resposta.
```javascript
const response = await axios.put('/api/usuarios/123', userData);
console.log(response.status); // 204
console.log(response.data); // '' (vazio)
```

**404 Not Found:** Recurso não existe.
```javascript
try {
  await axios.put('/api/usuarios/999', userData);
} catch (error) {
  console.log(error.response.status); // 404
}
```

**400/422:** Dados inválidos.
```javascript
try {
  await axios.put('/api/usuarios/123', { email: 'inválido' });
} catch (error) {
  console.log(error.response.status); // 400 ou 422
  console.log(error.response.data.errors); // { email: 'Email inválido' }
}
```

#### Padrão de Uso PUT

```javascript
async function atualizarUsuario(id, dadosCompletos) {
  try {
    const { data } = await axios.put(`/api/usuarios/${id}`, dadosCompletos);
    console.log('Usuário atualizado:', data);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Usuário não encontrado');
    } else if (error.response?.status === 400) {
      console.error('Dados inválidos:', error.response.data.errors);
    } else {
      console.error('Erro ao atualizar:', error.message);
    }
    throw error;
  }
}

// Uso - buscar, modificar, atualizar
const usuario = await axios.get('/api/usuarios/123').then(r => r.data);
usuario.nome = 'João Atualizado';
usuario.email = 'novo@example.com';

await atualizarUsuario(123, usuario);
```

---

### PATCH: Modificação Parcial

#### Sintaxe

```javascript
axios.patch(url, data, config)
```

**Parâmetros:**
- `url` (string): URL do recurso a modificar
- `data` (objeto): Apenas campos a alterar
- `config` (objeto, opcional): Configurações

**Exemplo básico:**
```javascript
// Atualizar apenas email (resto intacto)
await axios.patch('/api/usuarios/123', {
  email: 'novo@example.com'
});
```

#### Conceito de Modificação Parcial

**PATCH altera apenas campos enviados.** Campos não enviados permanecem inalterados.

**Exemplo ilustrativo:**

```javascript
// Estado atual no servidor
{
  id: 123,
  nome: 'João Silva',
  email: 'joao@example.com',
  idade: 30,
  cidade: 'São Paulo',
  ativo: true
}

// PATCH para alterar apenas email
await axios.patch('/api/usuarios/123', {
  email: 'joao.novo@example.com'
});

// Estado final no servidor
{
  id: 123,
  nome: 'João Silva',        // ← Não alterado
  email: 'joao.novo@example.com',  // ← Alterado
  idade: 30,                 // ← Não alterado
  cidade: 'São Paulo',       // ← Não alterado
  ativo: true                // ← Não alterado
}
```

**Vantagem:** Mais eficiente - envia menos dados, atualiza apenas necessário.

#### PUT vs PATCH: Comparação

| Aspecto | PUT | PATCH |
|---------|-----|-------|
| **Dados Enviados** | Representação completa | Apenas campos alterados |
| **Campos Não Enviados** | Removidos ou null | Permanecem inalterados |
| **Tamanho Payload** | Maior (todos os campos) | Menor (só alterações) |
| **Idempotência** | Sempre idempotente | Pode não ser (depende) |
| **Uso Comum** | Substituir recurso inteiro | Alterar campo específico |
| **Exemplo** | Atualizar perfil completo | Mudar apenas senha |

**Exemplo lado a lado:**

```javascript
// Estado original
const usuario = {
  id: 123,
  nome: 'João',
  email: 'joao@example.com',
  idade: 30,
  cidade: 'SP'
};

// PUT - Enviar tudo, mesmo não alterado
await axios.put('/api/usuarios/123', {
  id: 123,
  nome: 'João',              // Mesmo valor
  email: 'novo@example.com', // Alterado
  idade: 30,                 // Mesmo valor
  cidade: 'SP'               // Mesmo valor
});

// PATCH - Enviar só alteração
await axios.patch('/api/usuarios/123', {
  email: 'novo@example.com'  // Apenas este campo
});
```

**Quando usar cada um:**

**Use PUT quando:**
- Substituir recurso inteiro
- Tem representação completa disponível
- Quer garantir estado final exato

**Use PATCH quando:**
- Alterar campo específico
- Não quer buscar recurso inteiro antes
- Economia de banda é importante
- Alterações incrementais (toggle, incremento)

#### PATCH e Idempotência

**PATCH pode não ser idempotente,** dependendo de como servidor implementa.

**Exemplo idempotente (substituição de valor):**
```javascript
// Executar múltiplas vezes
await axios.patch('/api/usuarios/123', { nome: 'João' });
await axios.patch('/api/usuarios/123', { nome: 'João' });

// Resultado: nome é 'João' (idempotente)
```

**Exemplo não-idempotente (incremento):**
```javascript
// Servidor implementa PATCH para incrementar
await axios.patch('/api/posts/456', { operation: 'increment', field: 'views' });
await axios.patch('/api/posts/456', { operation: 'increment', field: 'views' });

// Resultado: views incrementadas 2 vezes (não-idempotente!)
```

**Lição:** Comportamento de PATCH depende de implementação do servidor. Verifique documentação da API.

#### Status Codes para PATCH

Mesmos status codes que PUT:
- **200 OK:** Atualização bem-sucedida com body
- **204 No Content:** Atualização bem-sucedida sem body
- **404 Not Found:** Recurso não existe
- **400/422:** Dados inválidos

#### Padrão de Uso PATCH

```javascript
async function atualizarCampo(id, campo, valor) {
  try {
    const { data } = await axios.patch(`/api/usuarios/${id}`, {
      [campo]: valor
    });
    console.log(`Campo ${campo} atualizado para ${valor}`);
    return data;
  } catch (error) {
    console.error(`Erro ao atualizar ${campo}:`, error.message);
    throw error;
  }
}

// Uso - atualizar campos individualmente
await atualizarCampo(123, 'email', 'novo@example.com');
await atualizarCampo(123, 'idade', 31);
await atualizarCampo(123, 'ativo', false);
```

**Padrão: Toggle de status:**
```javascript
async function toggleAtivo(userId) {
  // PATCH para alternar status
  const { data } = await axios.patch(`/api/usuarios/${userId}/toggle-ativo`);
  return data.ativo;
}

// Ou com campo booleano
async function setAtivo(userId, ativo) {
  await axios.patch(`/api/usuarios/${userId}`, { ativo });
}
```

---

### DELETE: Remoção de Recurso

#### Sintaxe

```javascript
axios.delete(url, config)
```

**Parâmetros:**
- `url` (string): URL do recurso a deletar
- `config` (objeto, opcional): Configurações (headers, timeout, etc.)

**Exemplo básico:**
```javascript
// Deletar usuário
await axios.delete('/api/usuarios/123');
```

**DELETE geralmente não tem body,** mas config permite headers:

```javascript
await axios.delete('/api/usuarios/123', {
  headers: {
    'Authorization': 'Bearer token'
  }
});
```

#### Idempotência de DELETE

**DELETE é idempotente:** Deletar recurso múltiplas vezes produz mesmo resultado (recurso não existe).

```javascript
// Primeira execução
await axios.delete('/api/usuarios/123');
// Status: 200 ou 204 (recurso deletado)

// Segunda execução
await axios.delete('/api/usuarios/123');
// Status: 404 (recurso já não existe)
// Mas estado final é o mesmo: recurso não existe
```

**Vantagem:** Retry seguro - se não souber se DELETE completou, pode executar novamente.

#### Status Codes para DELETE

**200 OK:** Deleção bem-sucedida, retorna representação do recurso deletado.
```javascript
const response = await axios.delete('/api/usuarios/123');
console.log(response.status); // 200
console.log(response.data); // { id: 123, nome: 'João', deletedAt: '...' }
```

**204 No Content:** Deleção bem-sucedida, sem body.
```javascript
const response = await axios.delete('/api/usuarios/123');
console.log(response.status); // 204
console.log(response.data); // '' (vazio)
```

**404 Not Found:** Recurso não existe (já deletado ou nunca existiu).
```javascript
try {
  await axios.delete('/api/usuarios/999');
} catch (error) {
  console.log(error.response.status); // 404
}
```

**403 Forbidden:** Sem permissão para deletar.
```javascript
try {
  await axios.delete('/api/usuarios/1'); // Tentar deletar admin
} catch (error) {
  console.log(error.response.status); // 403
  console.log(error.response.data); // { error: 'Não pode deletar admin' }
}
```

#### Padrão de Uso DELETE

```javascript
async function deletarUsuario(id) {
  try {
    await axios.delete(`/api/usuarios/${id}`);
    console.log('Usuário deletado com sucesso');
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn('Usuário já foi deletado');
      return true; // Considerar sucesso (idempotência)
    } else if (error.response?.status === 403) {
      console.error('Sem permissão para deletar');
      return false;
    } else {
      console.error('Erro ao deletar:', error.message);
      throw error;
    }
  }
}

// Uso
const deletado = await deletarUsuario(123);
if (deletado) {
  removeFromUI(123);
}
```

#### Soft Delete vs Hard Delete

**Hard Delete:** Recurso removido permanentemente do banco de dados.
```javascript
await axios.delete('/api/usuarios/123');
// Usuário removido permanentemente
```

**Soft Delete:** Recurso marcado como deletado mas permanece no banco.
```javascript
// Geralmente implementado como PATCH
await axios.patch('/api/usuarios/123', {
  deletedAt: new Date().toISOString()
});

// Ou endpoint específico
await axios.post('/api/usuarios/123/soft-delete');
```

**PATCH para soft delete é mais comum que DELETE.**

---

## 🔍 Análise Conceitual Profunda

### PUT/PATCH/DELETE e REST

**Mapeamento CRUD completo:**

| CRUD | HTTP Method | Axios |
|------|-------------|-------|
| **C**reate | POST | `axios.post('/recursos', data)` |
| **R**ead | GET | `axios.get('/recursos/123')` |
| **U**pdate | PUT/PATCH | `axios.put('/recursos/123', data)` |
| **D**elete | DELETE | `axios.delete('/recursos/123')` |

**Padrões RESTful:**

```javascript
// Coleção: /api/usuarios
// Item: /api/usuarios/{id}

// CREATE
const { data: criado } = await axios.post('/api/usuarios', {
  nome: 'João',
  email: 'joao@example.com'
});

// READ
const { data: usuario } = await axios.get(`/api/usuarios/${criado.id}`);

// UPDATE (completo)
await axios.put(`/api/usuarios/${criado.id}`, {
  ...usuario,
  nome: 'João Silva Atualizado'
});

// UPDATE (parcial)
await axios.patch(`/api/usuarios/${criado.id}`, {
  email: 'novo@example.com'
});

// DELETE
await axios.delete(`/api/usuarios/${criado.id}`);
```

### Tratamento de Erros

**Padrão unificado para PUT/PATCH/DELETE:**

```javascript
async function atualizarRecurso(url, data, metodo = 'put') {
  try {
    const axiosMethod = axios[metodo]; // axios.put ou axios.patch
    const response = await axiosMethod(url, data);
    return { success: true, data: response.data };
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    
    switch (status) {
      case 404:
        return { success: false, error: 'Recurso não encontrado' };
      case 400:
      case 422:
        return { success: false, errors: errorData.errors };
      case 403:
        return { success: false, error: 'Sem permissão' };
      case 409:
        return { success: false, error: 'Conflito (recurso em uso)' };
      default:
        return { success: false, error: 'Erro ao atualizar' };
    }
  }
}

async function deletarRecurso(url) {
  try {
    await axios.delete(url);
    return { success: true };
  } catch (error) {
    const status = error.response?.status;
    
    if (status === 404) {
      // Recurso já deletado - considerar sucesso
      return { success: true };
    } else if (status === 403) {
      return { success: false, error: 'Sem permissão para deletar' };
    } else if (status === 409) {
      return { success: false, error: 'Recurso em uso, não pode deletar' };
    } else {
      return { success: false, error: 'Erro ao deletar' };
    }
  }
}
```

### Padrões de Uso Comuns

#### Padrão 1: Formulário de Edição

```javascript
// React component - Editar usuário
function EditUserForm({ userId }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    // Carregar dados atuais
    axios.get(`/api/usuarios/${userId}`)
      .then(response => {
        setFormData(response.data);
        setLoading(false);
      });
  }, [userId]);
  
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    try {
      // PUT - atualizar com dados completos
      await axios.put(`/api/usuarios/${userId}`, formData);
      alert('Usuário atualizado!');
    } catch (error) {
      alert('Erro ao atualizar');
    } finally {
      setSaving(false);
    }
  }
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.nome}
        onChange={e => setFormData({...formData, nome: e.target.value})}
      />
      <input 
        value={formData.email}
        onChange={e => setFormData({...formData, email: e.target.value})}
      />
      <button type="submit" disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

#### Padrão 2: Atualização em Tempo Real (PATCH)

```javascript
// Atualizar campo individual sem re-render completo
async function updateFieldRealtime(userId, campo, valor) {
  try {
    await axios.patch(`/api/usuarios/${userId}`, {
      [campo]: valor
    });
    console.log(`${campo} atualizado`);
  } catch (error) {
    console.error('Erro ao atualizar:', error);
    // Reverter UI se falhar
  }
}

// Input com debounce
function EmailInput({ userId, initialEmail }) {
  const [email, setEmail] = useState(initialEmail);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email !== initialEmail) {
        updateFieldRealtime(userId, 'email', email);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [email]);
  
  return (
    <input 
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="Email"
    />
  );
}
```

#### Padrão 3: Confirmação de Delete

```javascript
async function deletarComConfirmacao(id, nome) {
  const confirmado = confirm(`Deletar usuário "${nome}"? Esta ação não pode ser desfeita.`);
  
  if (!confirmado) return;
  
  try {
    await axios.delete(`/api/usuarios/${id}`);
    console.log('Deletado com sucesso');
    removeItemFromList(id);
  } catch (error) {
    if (error.response?.status === 409) {
      alert('Não é possível deletar - usuário possui recursos associados');
    } else {
      alert('Erro ao deletar usuário');
    }
  }
}

// Componente
function UserListItem({ user }) {
  return (
    <div>
      <span>{user.nome}</span>
      <button onClick={() => deletarComConfirmacao(user.id, user.nome)}>
        Deletar
      </button>
    </div>
  );
}
```

#### Padrão 4: Optimistic Update (Delete)

```javascript
async function deletarOptimistic(id) {
  // 1. Remover da UI imediatamente
  const removido = removeItemFromUIOptimistically(id);
  
  try {
    // 2. Tentar deletar no servidor
    await axios.delete(`/api/usuarios/${id}`);
    console.log('Deletado no servidor');
  } catch (error) {
    // 3. Se falhar, restaurar na UI
    console.error('Erro ao deletar, restaurando...');
    restoreItemInUI(removido);
    alert('Erro ao deletar usuário');
  }
}
```

#### Padrão 5: Batch Update/Delete

```javascript
// Atualizar múltiplos recursos
async function atualizarMultiplos(ids, updates) {
  const promises = ids.map(id => 
    axios.patch(`/api/usuarios/${id}`, updates)
  );
  
  const results = await Promise.allSettled(promises);
  
  const sucessos = results.filter(r => r.status === 'fulfilled').length;
  const falhas = results.filter(r => r.status === 'rejected').length;
  
  console.log(`${sucessos} atualizados, ${falhas} falharam`);
}

// Deletar múltiplos recursos
async function deletarMultiplos(ids) {
  const promises = ids.map(id => 
    axios.delete(`/api/usuarios/${id}`)
  );
  
  await Promise.all(promises);
  console.log(`${ids.length} usuários deletados`);
}

// Uso
await atualizarMultiplos([1, 2, 3], { ativo: false });
await deletarMultiplos([4, 5, 6]);
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar PUT

- Substituir recurso inteiro
- Tem dados completos disponíveis
- Formulário de edição completo
- Sincronização de dados (sobrescrever versão antiga)
- Garantir estado final exato

### Quando Usar PATCH

- Alterar campo específico
- Toggle de status (ativo/inativo)
- Incrementar/decrementar contador
- Atualização em tempo real (campo por campo)
- Economia de banda (mobile, conexão lenta)

### Quando Usar DELETE

- Remover recurso permanentemente
- Cancelar pedido, reserva
- Deletar conta de usuário
- Limpar dados temporários
- Remover item de lista

### PUT vs PATCH: Decisão

**Use PUT se:**
- Tem representação completa do recurso
- Quer sobrescrever completamente
- Idempotência estrita é necessária

**Use PATCH se:**
- Só tem/quer alterar alguns campos
- Não quer buscar recurso inteiro antes
- Minimizar tráfego de rede

---

## ⚠️ Limitações e Considerações Teóricas

### PUT: Risco de Perda de Dados

**Problema:** Esquecendo campo em PUT pode deletá-lo.

```javascript
// Usuário atual
{ id: 123, nome: 'João', email: 'j@e.com', telefone: '123456789' }

// PUT sem telefone
await axios.put('/api/usuarios/123', {
  id: 123,
  nome: 'João Atualizado',
  email: 'j@e.com'
  // telefone esquecido!
});

// Resultado
{ id: 123, nome: 'João Atualizado', email: 'j@e.com', telefone: null }
// ← telefone perdido!
```

**Solução:** Sempre buscar recurso completo antes de PUT:
```javascript
const { data: usuario } = await axios.get('/api/usuarios/123');
usuario.nome = 'João Atualizado';
await axios.put('/api/usuarios/123', usuario); // Todos os campos preservados
```

### PATCH: Inconsistência de Implementação

**Problema:** PATCH não tem padrão único - servidores implementam diferentemente.

**Servidor pode:**
- Aceitar objeto com campos a alterar (mais comum)
- Exigir JSON Patch (RFC 6902) - formato específico
- Implementar merge parcial
- Rejeitar campos não-alteráveis

**Solução:** Ler documentação da API para entender formato PATCH esperado.

### DELETE: Cascade e Dependências

**Problema:** Deletar recurso pode afetar recursos relacionados.

```javascript
// Deletar usuário que tem posts
await axios.delete('/api/usuarios/123');

// O que acontece com posts do usuário?
// - Opção 1: Deletados em cascata (cascade delete)
// - Opção 2: Mantidos com autorId = null
// - Opção 3: DELETE bloqueado (erro 409 Conflict)
```

**Solução:** Servidor define comportamento - cliente deve tratar:
```javascript
try {
  await axios.delete('/api/usuarios/123');
} catch (error) {
  if (error.response?.status === 409) {
    const confirmar = confirm('Usuário possui posts. Deletar mesmo assim (posts serão deletados)?');
    
    if (confirmar) {
      await axios.delete('/api/usuarios/123?force=true');
    }
  }
}
```

### Idempotência e Race Conditions

**Problema:** Múltiplas PATCHs/DELETEs simultâneas podem conflitar.

```javascript
// Thread 1
axios.patch('/api/usuarios/123', { nome: 'João A' });

// Thread 2 (simultânea)
axios.patch('/api/usuarios/123', { email: 'b@e.com' });

// Qual estado final?
// - Ideal: { nome: 'João A', email: 'b@e.com' }
// - Possível problema se servidor não faz merge correto
```

**Solução:** Usar versionamento otimista:
```javascript
const { data: usuario } = await axios.get('/api/usuarios/123');
// usuario.version = 5

await axios.patch('/api/usuarios/123', {
  nome: 'João Atualizado',
  version: 5 // Enviar versão
});

// Servidor verifica version - se não é 5, rejeita (409 Conflict)
```

---

## 🔗 Interconexões Conceituais

### PUT/PATCH/DELETE e CRUD

Completam ciclo CRUD junto com GET (Read) e POST (Create).

### PUT/PATCH/DELETE e State Management

Após atualizar/deletar, atualizar state local:

```javascript
// Redux action - Update
export const updateUser = (id, data) => async dispatch => {
  const response = await axios.patch(`/api/usuarios/${id}`, data);
  dispatch({ type: 'USER_UPDATED', payload: response.data });
};

// Redux action - Delete
export const deleteUser = (id) => async dispatch => {
  await axios.delete(`/api/usuarios/${id}`);
  dispatch({ type: 'USER_DELETED', payload: id });
};
```

### PUT/PATCH/DELETE e Optimistic UI

Atualizar UI antes de confirmação do servidor para UX mais rápida.

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

1. **Interceptors:** Adicionar lógica global (auth, logging) a todos métodos
2. **Error Handling Avançado:** Retry, rollback, conflict resolution
3. **Optimistic Updates:** Atualizar UI instantaneamente
4. **Versioning:** Evitar conflitos com versionamento otimista

### Conceitos Avançados

- **Undo/Redo:** Implementar com histórico de operações
- **Offline Support:** Queue de operações para executar quando online
- **Real-time Sync:** WebSockets + REST para sincronização
- **Conflict Resolution:** Resolver conflitos de edições simultâneas

---

## 📚 Conclusão

**PUT**, **PATCH** e **DELETE** completam o arsenal de operações HTTP no Axios, permitindo gerenciamento completo do ciclo de vida de recursos:

**PUT:** Substituição total - quando você tem representação completa e quer sobrescrever.

**PATCH:** Modificação parcial - quando quer alterar campos específicos eficientemente.

**DELETE:** Remoção - quando quer eliminar recurso permanentemente.

**Dominar esses métodos significa:**
- Saber quando usar PUT vs PATCH
- Entender idempotência e suas implicações
- Tratar erros apropriadamente (404, 403, 409)
- Aplicar padrões (confirmação de delete, optimistic updates)
- Evitar armadilhas (perda de dados em PUT, race conditions)

Com GET (Read), POST (Create), PUT/PATCH (Update) e DELETE, você tem todas as ferramentas para construir aplicações CRUD completas e robustas.
