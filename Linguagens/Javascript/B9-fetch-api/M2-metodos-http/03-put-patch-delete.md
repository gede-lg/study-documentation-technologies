# Métodos PUT, PATCH e DELETE com Fetch API: Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**PUT, PATCH e DELETE** são métodos HTTP que completam o conjunto CRUD (Create, Read, Update, Delete) em APIs RESTful. Conceitualmente, representam **operações de modificação e remoção** de recursos existentes:

- **PUT**: **Substituição completa** de recurso - envia representação completa do recurso atualizado, substituindo inteiramente o existente. É **idempotente** - múltiplas chamadas idênticas têm mesmo efeito.

- **PATCH**: **Atualização parcial** de recurso - envia apenas campos modificados, preservando demais. Também **idempotente** na maioria das implementações.

- **DELETE**: **Remoção** de recurso - elimina recurso identificado pela URL. **Idempotente** - deletar recurso inexistente retorna mesmo resultado (404 ou 204).

Com Fetch API, esses métodos seguem padrão similar ao POST: requerem configuração explícita de `method`, opcionalmente `headers` e `body` (DELETE geralmente não tem body).

### Contexto Histórico e Motivação

**Evolução Semântica HTTP:**

1. **HTTP/0.9 (1991)**: Apenas GET
2. **HTTP/1.0 (1996)**: Adicionou POST, HEAD
3. **HTTP/1.1 (1997)**: Introduziu PUT, PATCH, DELETE para operações CRUD completas
4. **REST (2000)**: Roy Fielding formalizou uso semântico de métodos HTTP

**Motivação para PUT/PATCH/DELETE:**

Antes desses métodos, todas operações eram POST genérico, perdendo **semântica**:

```javascript
// Sem semântica (tudo POST)
POST /api/usuarios/123/atualizar
POST /api/usuarios/123/deletar

// Com semântica HTTP correta
PUT    /api/usuarios/123  // Atualizar completo
PATCH  /api/usuarios/123  // Atualizar parcial
DELETE /api/usuarios/123  // Deletar
```

**Benefícios Semânticos**:
- **Clareza**: Método indica intenção
- **Idempotência**: PUT/DELETE podem ser retry-safe
- **Caching**: Proxies e CDNs podem otimizar baseado em método
- **RESTful**: Conformidade com arquitetura REST

### Problema Fundamental que Resolve

PUT, PATCH e DELETE resolvem problemas específicos de gerenciamento de recursos:

**PUT**: Atualização **determinística** - cliente tem representação completa do recurso, substitui inteiramente. Evita merge conflicts.

**PATCH**: Economia de **banda** - envia apenas mudanças, não documento inteiro (crítico para recursos grandes).

**DELETE**: **Idempotência** - múltiplas tentativas de delete não causam erros (diferente de POST para deletar).

### Importância no Ecossistema

Esses métodos são **pilares de APIs REST**:

- **CRUD Completo**: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE)
- **Idempotência**: Retry-safe operations críticas para resiliência
- **Semântica Clara**: Código auto-documentado - método indica operação
- **Standards**: Conformidade com HTTP spec e REST best practices

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Idempotência**: PUT/PATCH/DELETE são idempotentes - múltiplas chamadas = mesmo resultado final
2. **Identificação por URL**: Recurso específico identificado na URL (`/usuarios/123`)
3. **PUT vs PATCH**: PUT substitui completamente, PATCH modifica parcialmente
4. **DELETE sem Body**: Tipicamente DELETE não envia body (recurso identificado por URL)
5. **Status Codes**: 200 (OK com body), 204 (No Content), 404 (Not Found)

### Pilares Fundamentais

- **PUT**: Replace entire resource
- **PATCH**: Update partial fields
- **DELETE**: Remove resource
- **Idempotency**: Safe to retry
- **Resource Identification**: URL-based (não query params)

### Visão Geral das Nuances

- PUT requer representação **completa** do recurso
- PATCH requer apenas **campos modificados**
- DELETE pode retornar 204 (sem body) ou 200 (com confirmação)
- Alguns servidores não suportam PATCH (usar PUT)
- DELETE de recurso inexistente pode retornar 404 ou 204 (idempotente)

---

## 🧠 Fundamentos Teóricos

### PUT - Substituição Completa

#### Conceito

PUT **substitui inteiramente** recurso existente com representação fornecida. Cliente deve enviar **todos os campos**, mesmo os não modificados.

```javascript
// Recurso original no servidor
{
  "id": 123,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "idade": 30,
  "cidade": "São Paulo"
}

// PUT request - envia representação COMPLETA
const response = await fetch('/api/usuarios/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: "João Santos",     // Modificado
    email: "joao@exemplo.com", // Mesmo valor
    idade: 31,               // Modificado
    cidade: "São Paulo"      // Mesmo valor
  })
});

// Recurso após PUT
{
  "id": 123,
  "nome": "João Santos",
  "email": "joao@exemplo.com",
  "idade": 31,
  "cidade": "São Paulo"
}
```

**Idempotência**: Chamar PUT múltiplas vezes com mesmos dados resulta em mesmo estado final.

```javascript
// Chamada 1
PUT /api/usuarios/123 com {nome: "João", idade: 31}

// Chamada 2 (idêntica)
PUT /api/usuarios/123 com {nome: "João", idade: 31}

// Resultado: idêntico em ambas (idempotente)
```

#### Sintaxe

```javascript
async function atualizarUsuario(id, usuarioCompleto) {
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Se autenticação necessária
    },
    body: JSON.stringify(usuarioCompleto)
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Usuário não encontrado');
    }
    throw new Error(`Erro ao atualizar: ${response.status}`);
  }
  
  // Servidor pode retornar recurso atualizado ou 204 No Content
  if (response.status === 204) {
    return null; // Sem body
  }
  
  return await response.json();
}

// Uso
const usuarioAtualizado = await atualizarUsuario(123, {
  nome: "João Santos",
  email: "joao.santos@exemplo.com",
  idade: 31,
  cidade: "Rio de Janeiro"
});
```

### PATCH - Atualização Parcial

#### Conceito

PATCH **modifica apenas campos especificados**, preservando demais. Cliente envia **apenas mudanças**.

```javascript
// Recurso original no servidor
{
  "id": 123,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "idade": 30,
  "cidade": "São Paulo"
}

// PATCH request - envia apenas campos modificados
const response = await fetch('/api/usuarios/123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: "João Santos", // Modifica nome
    idade: 31            // Modifica idade
    // email e cidade NÃO enviados - permanecem inalterados
  })
});

// Recurso após PATCH
{
  "id": 123,
  "nome": "João Santos",    // Modificado
  "email": "joao@exemplo.com", // Preservado
  "idade": 31,              // Modificado
  "cidade": "São Paulo"     // Preservado
}
```

**Vantagens sobre PUT**:
- **Economia de banda**: Envia menos dados
- **Concorrência**: Menos conflitos - campos não mencionados não são tocados
- **Clareza**: Mostra explicitamente o que mudou

#### Sintaxe

```javascript
async function atualizarParcialUsuario(id, camposModificados) {
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(camposModificados)
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Usuário não encontrado');
    }
    throw new Error(`Erro ao atualizar: ${response.status}`);
  }
  
  return await response.json();
}

// Uso - atualizar apenas email
const usuario = await atualizarParcialUsuario(123, {
  email: "novo.email@exemplo.com"
});
```

#### JSON Patch (RFC 6902)

Formato **padronizado** para PATCH com operações estruturadas:

```javascript
const response = await fetch('/api/usuarios/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json-patch+json' // Note Content-Type especial
  },
  body: JSON.stringify([
    { "op": "replace", "path": "/nome", "value": "João Santos" },
    { "op": "replace", "path": "/idade", "value": 31 },
    { "op": "add", "path": "/telefone", "value": "11999999999" },
    { "op": "remove", "path": "/enderecoTemporario" }
  ])
});
```

**Operações JSON Patch**:
- `replace`: Substituir valor
- `add`: Adicionar campo
- `remove`: Remover campo
- `move`: Mover valor
- `copy`: Copiar valor
- `test`: Verificar valor antes de aplicar patch

**Conceito**: Mais verboso, mas permite operações complexas (adicionar/remover campos).

### DELETE - Remoção de Recurso

#### Conceito

DELETE **remove recurso** identificado pela URL. Tipicamente **não envia body** (identificação já está na URL).

```javascript
// DELETE request
const response = await fetch('/api/usuarios/123', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
  // Sem body!
});

// Status codes comuns:
// 204 No Content - deletado, sem response body
// 200 OK - deletado, com confirmation body
// 404 Not Found - recurso não existe (mas idempotente)
```

**Idempotência**: Deletar recurso já deletado retorna mesmo resultado (404 ou 204).

```javascript
// Primeira chamada - deleta recurso
DELETE /api/usuarios/123 → 204 No Content

// Segunda chamada - recurso não existe mais
DELETE /api/usuarios/123 → 404 Not Found (ou 204 em algumas APIs)

// Resultado: recurso não existe (idempotente)
```

#### Sintaxe

```javascript
async function deletarUsuario(id, token) {
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 404) {
    throw new Error('Usuário não encontrado');
  }
  
  if (!response.ok) {
    throw new Error(`Erro ao deletar: ${response.status}`);
  }
  
  // Servidor pode retornar 204 (sem body) ou 200 com confirmação
  if (response.status === 204) {
    return { success: true };
  }
  
  return await response.json();
}

// Uso
await deletarUsuario(123, token);
console.log('Usuário deletado com sucesso');
```

---

## 🔍 Análise Conceitual Profunda

### Pattern 1: PUT Completo

```javascript
async function atualizarProduto(id, produtoCompleto) {
  try {
    const response = await fetch(`/api/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(produtoCompleto)
    });
    
    if (response.status === 404) {
      throw new Error('Produto não encontrado');
    }
    
    if (response.status === 400) {
      const erro = await response.json();
      throw new Error(`Dados inválidos: ${erro.mensagem}`);
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    throw erro;
  }
}

// Uso
const produto = {
  nome: "Notebook Dell XPS 15",
  preco: 8999.99,
  estoque: 15,
  categoria: "Eletrônicos",
  descricao: "Notebook de alta performance"
};

const atualizado = await atualizarProduto(456, produto);
```

### Pattern 2: PATCH com Merge Local

```javascript
// Padrão: buscar recurso, modificar localmente, enviar patch
async function atualizarEmailUsuario(id, novoEmail) {
  // 1. Buscar recurso atual (opcional, mas seguro)
  const usuarioAtual = await fetch(`/api/usuarios/${id}`)
    .then(r => r.json());
  
  // 2. Modificar localmente
  const modificacoes = {
    email: novoEmail,
    emailVerificado: false, // Reset verification
    dataAtualizacao: new Date().toISOString()
  };
  
  // 3. Enviar apenas modificações
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(modificacoes)
  });
  
  if (!response.ok) {
    throw new Error('Erro ao atualizar email');
  }
  
  return await response.json();
}
```

### Pattern 3: DELETE com Confirmação

```javascript
async function deletarPostComConfirmacao(postId) {
  // Confirmação do usuário
  const confirmado = confirm('Tem certeza que deseja deletar este post?');
  
  if (!confirmado) {
    return { cancelado: true };
  }
  
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    if (response.status === 404) {
      throw new Error('Post não encontrado');
    }
    
    if (response.status === 403) {
      throw new Error('Você não tem permissão para deletar este post');
    }
    
    if (!response.ok) {
      throw new Error(`Erro ao deletar: ${response.status}`);
    }
    
    return {
      success: true,
      message: 'Post deletado com sucesso'
    };
    
  } catch (erro) {
    console.error('Erro ao deletar post:', erro);
    throw erro;
  }
}

// Uso com feedback
try {
  const resultado = await deletarPostComConfirmacao(789);
  
  if (resultado.cancelado) {
    console.log('Operação cancelada pelo usuário');
  } else {
    console.log(resultado.message);
    // Atualizar UI - remover post da lista
  }
} catch (erro) {
  alert(`Erro: ${erro.message}`);
}
```

### Pattern 4: Soft Delete (DELETE Lógico)

```javascript
// Soft delete - marcar como deletado, não remover fisicamente
async function softDeleteUsuario(id) {
  // Usar PATCH para marcar como deletado
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deletado: true,
      dataDelecao: new Date().toISOString()
    })
  });
  
  if (!response.ok) {
    throw new Error('Erro ao deletar usuário');
  }
  
  return await response.json();
}

// Hard delete - remoção física
async function hardDeleteUsuario(id) {
  const response = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE'
  });
  
  return response.ok;
}
```

### Pattern 5: Bulk Operations

```javascript
// Deletar múltiplos recursos
async function deletarMultiplosPosts(ids) {
  const promessas = ids.map(id =>
    fetch(`/api/posts/${id}`, { method: 'DELETE' })
  );
  
  const resultados = await Promise.allSettled(promessas);
  
  const sucessos = resultados.filter(r => r.status === 'fulfilled');
  const falhas = resultados.filter(r => r.status === 'rejected');
  
  return {
    deletados: sucessos.length,
    falhas: falhas.length,
    total: ids.length
  };
}

// Ou endpoint dedicado (melhor para grandes volumes)
async function deletarPostsEmLote(ids) {
  const response = await fetch('/api/posts/bulk-delete', {
    method: 'DELETE', // Ou POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  
  return await response.json();
}
```

### Pattern 6: Optimistic Update

```javascript
// Atualizar UI imediatamente, reverter se request falhar
async function toggleLike(postId, estadoAtual) {
  // 1. Atualizar UI otimisticamente
  const novoEstado = !estadoAtual;
  atualizarUILike(postId, novoEstado);
  
  try {
    // 2. Enviar request
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: novoEstado ? 'PUT' : 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Request falhou');
    }
    
    // 3. Sucesso - UI já está correta
    return novoEstado;
    
  } catch (erro) {
    // 4. Falha - reverter UI
    atualizarUILike(postId, estadoAtual);
    throw erro;
  }
}
```

### Pattern 7: PUT para Upsert (Create or Update)

```javascript
// PUT pode criar recurso se não existir (depende da API)
async function salvarConfiguracao(userId, configuracao) {
  const response = await fetch(`/api/usuarios/${userId}/configuracao`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configuracao)
  });
  
  // 201 Created - recurso foi criado
  // 200 OK - recurso foi atualizado
  
  const criado = response.status === 201;
  const data = await response.json();
  
  return { data, criado };
}
```

### Pattern 8: PATCH com Validação Otimista

```javascript
// Validar localmente antes de PATCH
async function atualizarPerfil(userId, mudancas) {
  // Validação local
  if (mudancas.email && !validarEmail(mudancas.email)) {
    throw new Error('Email inválido');
  }
  
  if (mudancas.idade && (mudancas.idade < 18 || mudancas.idade > 120)) {
    throw new Error('Idade inválida');
  }
  
  // Validações OK - enviar PATCH
  const response = await fetch(`/api/usuarios/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mudancas)
  });
  
  if (!response.ok) {
    // Servidor pode ter validações adicionais
    const erro = await response.json();
    throw new Error(erro.mensagem || 'Erro ao atualizar perfil');
  }
  
  return await response.json();
}
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Método

**Use PUT quando**:
- Cliente tem representação **completa** do recurso
- Quer garantir estado **determinístico** (substituição total)
- Implementando **upsert** (create or update)
- Idempotência é crítica

**Use PATCH quando**:
- Atualizando **poucos campos** de recurso grande
- Economia de **banda** é importante
- Evitar **conflitos de concorrência** (campos não mencionados preservados)
- Operações **incrementais** (adicionar item a lista)

**Use DELETE quando**:
- Removendo recurso permanentemente
- Cancelando subscription, removendo favorite
- Limpando dados temporários

### CRUD Completo com Fetch

```javascript
// API Client completo
class UsuarioAPI {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  
  // CREATE
  async criar(usuario) {
    const response = await fetch(`${this.baseUrl}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(usuario)
    });
    
    if (!response.ok) throw new Error('Erro ao criar');
    return await response.json();
  }
  
  // READ
  async buscar(id) {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar');
    return await response.json();
  }
  
  // UPDATE (completo)
  async atualizar(id, usuario) {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(usuario)
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar');
    return await response.json();
  }
  
  // UPDATE (parcial)
  async atualizarParcial(id, mudancas) {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(mudancas)
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar');
    return await response.json();
  }
  
  // DELETE
  async deletar(id) {
    const response = await fetch(`${this.baseUrl}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    
    if (!response.ok) throw new Error('Erro ao deletar');
    return response.status === 204 ? null : await response.json();
  }
}

// Uso
const api = new UsuarioAPI('https://api.exemplo.com', token);

const criado = await api.criar({ nome: 'João', email: 'joao@exemplo.com' });
const usuario = await api.buscar(criado.id);
await api.atualizarParcial(usuario.id, { idade: 31 });
await api.deletar(usuario.id);
```

---

## ⚠️ Limitações e Considerações Teóricas

### Limitações

**1. Support Variável**: Alguns servidores/proxies não suportam PATCH ou DELETE (usar POST com `_method` override).

**2. PUT Requer Conhecimento Completo**: Cliente precisa saber todos os campos do recurso.

**3. PATCH Sem Padrão Universal**: Cada API define formato (merge parcial vs JSON Patch).

**4. DELETE Pode Não Ser Físico**: Muitas APIs fazem soft delete, não remoção real.

### Armadilhas Comuns

#### Armadilha 1: PUT Parcial (Deveria Ser PATCH)

```javascript
// ❌ ERRO - PUT com apenas alguns campos
await fetch(`/api/usuarios/123`, {
  method: 'PUT',
  body: JSON.stringify({ email: 'novo@exemplo.com' })
});
// Servidor pode deletar campos não enviados!

// ✅ CORRETO - PATCH para atualização parcial
await fetch(`/api/usuarios/123`, {
  method: 'PATCH',
  body: JSON.stringify({ email: 'novo@exemplo.com' })
});
```

#### Armadilha 2: DELETE com Body (Não Standard)

```javascript
// ⚠️ NÃO RECOMENDADO - DELETE com body
await fetch(`/api/usuarios/123`, {
  method: 'DELETE',
  body: JSON.stringify({ motivo: 'Solicitação do usuário' })
});

// ✅ MELHOR - passar info via headers ou query
await fetch(`/api/usuarios/123?motivo=solicitacao_usuario`, {
  method: 'DELETE'
});
```

#### Armadilha 3: Não Tratar 404 em DELETE

```javascript
// ❌ Tratar 404 como erro
const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
if (!response.ok) throw new Error('Erro'); // 404 lança erro

// ✅ DELETE é idempotente - 404 OK
const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
if (response.ok || response.status === 404) {
  console.log('Recurso removido ou não existe - OK');
} else {
  throw new Error(`Erro: ${response.status}`);
}
```

---

## 🔗 Interconexões Conceituais

### Relação com CRUD

- **C**reate: POST
- **R**ead: GET
- **U**pdate: PUT (completo), PATCH (parcial)
- **D**elete: DELETE

### Relação com Idempotência

**Idempotentes**: GET, PUT, PATCH, DELETE
**Não-Idempotente**: POST

**Conceito**: Métodos idempotentes podem ser retry-safe - crucial para resiliência.

### Relação com REST

REST usa métodos HTTP para **semântica**:
- Recurso identificado por URL
- Método indica operação
- Status code indica resultado

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar PUT/PATCH/DELETE:
1. **Optimistic Updates**: Atualizar UI antes de response
2. **Conflict Resolution**: Lidar com concurrent updates (ETags)
3. **Batch Operations**: Múltiplas operações em single request
4. **Real-Time Updates**: WebSockets para sincronização
5. **Offline Support**: Queue operations, sync when online

---

## 📚 Conclusão

PUT, PATCH e DELETE completam o arsenal CRUD com Fetch API.

Dominar esses métodos significa:
- **PUT** para substituição completa (idempotente)
- **PATCH** para atualização parcial (economia de banda)
- **DELETE** para remoção (idempotente)
- Compreender **semântica HTTP** e **idempotência**
- Implementar **CRUD completo** em APIs REST

São essenciais para aplicações modernas que gerenciam dados de forma robusta e semântica.
