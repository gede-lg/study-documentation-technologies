# Métodos HTTP (GET, POST, PUT, DELETE): Uma Análise Conceitual Profunda

## 🎯 Introdução e Definição

### Definição Conceitual

**Métodos HTTP** (também chamados de "verbos HTTP" ou "HTTP verbs") são **indicadores semânticos** que definem o tipo de ação que um cliente deseja realizar sobre um recurso identificado por uma URL. Conceitualmente, cada método representa uma intenção específica na comunicação cliente-servidor: recuperar dados, enviar dados, modificar recursos existentes, ou removê-los.

Na essência, métodos HTTP são parte fundamental do **protocolo de comunicação HTTP** que estrutura como navegadores, aplicações e servidores conversam. Eles não são apenas convenções técnicas - são contratos semânticos que comunicam **a natureza da operação** sendo solicitada.

### Contexto Histórico e Motivação

O protocolo HTTP (HyperText Transfer Protocol) foi criado por **Tim Berners-Lee** em 1989-1991 como parte da invenção da World Wide Web. A primeira versão (HTTP/0.9) era extremamente simples, suportando apenas um método: GET.

**Evolução Histórica dos Métodos:**

- **HTTP/0.9 (1991)**: Apenas GET - recuperar documentos HTML
- **HTTP/1.0 (1996)**: Adicionou POST e HEAD - permitindo enviar dados ao servidor
- **HTTP/1.1 (1997)**: Introduziu PUT, DELETE, OPTIONS, TRACE, CONNECT - completando o conjunto de operações CRUD e diagnóstico
- **Padronização REST (2000)**: Roy Fielding formalizou uso semântico dos métodos na arquitetura REST

A motivação para múltiplos métodos era **expressividade semântica**: ao invés de um único comando genérico, cada método comunica claramente a intenção. Isso permite que intermediários (proxies, caches, firewalls) tomem decisões inteligentes sem inspecionar o corpo da mensagem.

### Problema Fundamental que Resolve

Métodos HTTP resolvem múltiplos problemas fundamentais na comunicação web:

**1. Clareza de Intenção:** Sem métodos, toda comunicação seria ambígua. GET comunica "apenas leia", POST comunica "processe estes dados". Servidores podem aplicar lógica diferente baseado no método.

**2. Idempotência e Segurança:** Alguns métodos são idempotentes (podem ser repetidos sem efeitos adicionais) e/ou safe (não modificam recursos). Isso permite retry automático, cache agressivo, e previsibilidade.

**3. Arquitetura REST:** RESTful APIs dependem de métodos HTTP para mapear operações CRUD (Create, Read, Update, Delete) a recursos:
   - GET = Read (recuperar)
   - POST = Create (criar)
   - PUT = Update (atualizar completamente)
   - PATCH = Update (atualizar parcialmente)
   - DELETE = Delete (remover)

**4. Otimização de Rede:** Métodos safe (GET, HEAD, OPTIONS) podem ser cacheados agressivamente. Navegadores e proxies sabem que não causam side effects no servidor.

**5. Segurança e Conformidade:** Firewalls e políticas de segurança podem permitir/bloquear métodos específicos (ex: permitir GET/POST, bloquear DELETE).

### Importância no Ecossistema

Métodos HTTP são **pilares da arquitetura web moderna**:

- **Base de APIs RESTful:** Todo design de API REST gira em torno de recursos (URLs) e métodos (ações sobre recursos)
- **Semântica Universal:** Desenvolvedores mundialmente entendem o significado de GET vs POST vs PUT vs DELETE
- **Cache e Performance:** Capacidade de cache depende de métodos safe. CDNs e proxies otimizam baseado em métodos
- **Segurança:** CORS (Cross-Origin Resource Sharing) trata métodos diferentes de forma distinta (simple vs preflight requests)
- **Tooling:** Ferramentas de debug (DevTools, Postman), logs de servidor, analytics - todos organizam tráfego por método

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Semântica de Ação**: Cada método tem significado específico que deve ser respeitado
2. **Propriedades de Segurança**: Safe methods não modificam estado do servidor
3. **Idempotência**: Alguns métodos podem ser repetidos sem efeitos colaterais adicionais
4. **Uso de Body**: Alguns métodos carregam dados no body, outros não
5. **Cachability**: Métodos safe são cacheáveis, outros não

### Pilares Fundamentais

- **GET**: Recuperar representação de um recurso
- **POST**: Submeter dados para processamento, criar recursos
- **PUT**: Substituir completamente um recurso ou criá-lo em URL específica
- **DELETE**: Remover um recurso
- **PATCH**: Modificar parcialmente um recurso
- **HEAD**: Igual a GET mas sem body (apenas headers)
- **OPTIONS**: Descobrir métodos suportados pelo servidor

### Visão Geral das Nuances

- **GET é safe e idempotente** - não modifica servidor, pode ser repetido
- **POST não é idempotente** - cada requisição pode criar novo recurso
- **PUT é idempotente** - mesmo comando repetido tem mesmo efeito
- **DELETE é idempotente** - deletar recurso já deletado não muda nada
- **PATCH pode ou não ser idempotente** - depende da implementação

---

## 🧠 Fundamentos Teóricos

### Como Funcionam Internamente

Quando você faz uma requisição HTTP, o método é **a primeira palavra na linha de requisição**:

```
GET /usuarios/123 HTTP/1.1
Host: api.exemplo.com
```

O servidor lê esta linha e:
1. **Identifica o método** (GET)
2. **Identifica o recurso** (/usuarios/123)
3. **Roteia para handler apropriado** baseado em método + recurso
4. **Aplica lógica específica do método** (GET = buscar, POST = criar, etc.)

### Princípios e Conceitos Subjacentes

#### 1. Safe Methods (Métodos Seguros)

**Conceito**: Um método é considerado "safe" se não causa efeitos colaterais no servidor - não modifica dados.

**Métodos Safe**: GET, HEAD, OPTIONS

**Implicação**: Métodos safe podem ser:
- Cacheados agressivamente
- Prefetched (navegador pode pré-carregar links antes de clicar)
- Retried automaticamente sem confirmação do usuário

**Analogia**: Ler um livro (GET) é safe - você pode ler quantas vezes quiser sem mudar o conteúdo. Escrever no livro (POST/PUT) não é safe - muda o estado.

#### 2. Idempotência

**Conceito**: Um método é idempotente se **repetir a mesma requisição N vezes tem o mesmo efeito que fazê-la uma vez**.

**Métodos Idempotentes**: GET, PUT, DELETE, HEAD, OPTIONS

**Não Idempotentes**: POST, PATCH (geralmente)

**Importância**: Idempotência permite retry automático. Se uma requisição PUT falha por timeout de rede, o cliente pode repetir com segurança - o resultado final será o mesmo.

**Exemplo Conceitual**:
- `PUT /usuarios/123 {"nome": "João"}` - Executar 10 vezes = usuário 123 terá nome "João" (idempotente)
- `POST /usuarios {"nome": "João"}` - Executar 10 vezes = 10 usuários criados (não idempotente)

#### 3. Cachability (Capacidade de Cache)

**Conceito**: Respostas de alguns métodos podem ser armazenadas em cache e reutilizadas.

**Cacheáveis por Padrão**: GET, HEAD

**Não Cacheáveis**: POST, PUT, DELETE, PATCH

**Razão**: Só faz sentido cachear operações que não modificam estado. GET /usuarios/123 retorna os mesmos dados até que o recurso mude. POST /compra cria nova compra cada vez - não pode ser cacheado.

#### 4. Request Body Semantics

**Conceito**: Presença e significado do body variam por método.

- **GET, DELETE, HEAD**: Tradicionalmente sem body (alguns servidores ignoram se presente)
- **POST, PUT, PATCH**: Body contém dados a processar/armazenar
- **OPTIONS**: Geralmente sem body

**Nuance**: Especificação HTTP não proíbe body em GET, mas é convenção não usar. Muitos proxies e servidores ignoram ou rejeitam GET com body.

### Relação com Outros Conceitos

#### REST Architecture

Roy Fielding, em sua tese de doutorado (2000), definiu **REST** (Representational State Transfer). Métodos HTTP são centrais a REST:

- **Recursos são substantivos** (URLs): /usuarios, /produtos/456
- **Métodos são verbos** (ações): GET, POST, PUT, DELETE
- **Stateless**: Cada requisição contém toda informação necessária

REST mapeia CRUD para HTTP:
- **C**reate → POST (ou PUT)
- **R**ead → GET
- **U**pdate → PUT (completo) ou PATCH (parcial)
- **D**elete → DELETE

#### Status Codes

Métodos interagem com status codes para comunicar resultados:

- **GET** com sucesso → 200 OK
- **POST** criou recurso → 201 Created
- **PUT** atualizou → 200 OK ou 204 No Content
- **DELETE** bem-sucedido → 204 No Content ou 200 OK
- Recurso não encontrado → 404 Not Found (qualquer método)
- Método não permitido → 405 Method Not Allowed

### Modelo Mental para Compreensão

#### Analogia: Biblioteca

Imagine uma biblioteca como servidor e você como cliente:

- **GET**: "Quero ler o livro X" - você recebe cópia do livro, mas ele permanece na estante (safe, idempotente)
- **POST**: "Quero adicionar este livro à coleção" - você entrega um livro novo, ele é catalogado e colocado na estante (não safe, não idempotente - cada POST adiciona novo livro)
- **PUT**: "Quero substituir o livro X por esta nova edição" - você retira livro antigo e coloca novo no mesmo lugar (não safe, idempotente - repetir PUT coloca a mesma edição)
- **DELETE**: "Quero remover o livro X" - livro é retirado da estante (não safe, idempotente - deletar livro já deletado não muda nada)
- **PATCH**: "Quero corrigir a página 45 do livro X" - modificação específica (não safe, pode ser idempotente dependendo de como é feito)

---

## 🔍 Análise Conceitual Profunda

### GET: Recuperação de Recursos

#### Definição e Semântica

**GET** é o método mais fundamental do HTTP. Sua semântica é: **"Transfira uma representação do recurso identificado pela URL"**.

**Características:**
- **Safe**: Não modifica estado do servidor
- **Idempotente**: Repetir GET retorna mesmos dados (assumindo recurso não mudou)
- **Cacheável**: Respostas podem e devem ser cacheadas
- **Sem Body**: Não deve ter request body

#### Sintaxe Básica com Fetch

```javascript
// GET simples
fetch('https://api.exemplo.com/usuarios')
  .then(response => response.json())
  .then(data => console.log(data));

// GET com async/await
async function buscarUsuarios() {
  const response = await fetch('https://api.exemplo.com/usuarios');
  const usuarios = await response.json();
  return usuarios;
}

// GET de recurso específico
const usuario = await fetch('https://api.exemplo.com/usuarios/123')
  .then(r => r.json());
```

#### Sintaxe de Uso com Query Parameters

Query parameters são usados para filtrar, ordenar, paginar resultados:

```javascript
// Usando URLSearchParams para construir query string
const params = new URLSearchParams({
  idade: 25,
  cidade: 'São Paulo',
  ordem: 'nome'
});

const url = `https://api.exemplo.com/usuarios?${params}`;
// URL final: https://api.exemplo.com/usuarios?idade=25&cidade=S%C3%A3o+Paulo&ordem=nome

const response = await fetch(url);
const usuarios = await response.json();

// Múltiplos valores para mesmo parâmetro
const filtros = new URLSearchParams();
filtros.append('tag', 'javascript');
filtros.append('tag', 'typescript');
// tags=javascript&tags=typescript
```

#### Conceitos Avançados de GET

**Conditional GET (GET Condicional)**:

Permite economizar bandwidth pedindo recurso apenas se mudou:

```javascript
// Primeira requisição
const response1 = await fetch(url);
const etag = response1.headers.get('ETag'); // "abc123"

// Segunda requisição - só baixa se mudou
const response2 = await fetch(url, {
  headers: {
    'If-None-Match': etag
  }
});

if (response2.status === 304) {
  console.log('Recurso não mudou, use cache local');
} else {
  const data = await response2.json();
  console.log('Recurso atualizado:', data);
}
```

**Conceito Teórico**: ETags (Entity Tags) são identificadores únicos de versão de recurso. Servidor retorna 304 Not Modified se ETag ainda é válido, economizando transferência do body.

**Range Requests (GET Parcial)**:

Permite baixar partes específicas de um recurso:

```javascript
// Baixar apenas primeiros 1000 bytes
const response = await fetch(url, {
  headers: {
    'Range': 'bytes=0-999'
  }
});

if (response.status === 206) { // 206 Partial Content
  const chunk = await response.blob();
  console.log('Baixou chunk parcial');
}
```

**Uso**: Download resumível, streaming de vídeo (baixar apenas parte visível).

#### Quando Usar GET

- Recuperar lista de recursos: `GET /produtos`
- Recuperar recurso específico: `GET /produtos/456`
- Buscar com filtros: `GET /produtos?categoria=eletronicos&preco_max=1000`
- Exportar dados: `GET /relatorios/vendas?formato=pdf`

**Nunca Usar GET Para**:
- Operações que modificam dados (criar, atualizar, deletar)
- Enviar dados sensíveis (passwords) - aparecem na URL em logs
- Payloads grandes - URLs têm limites de tamanho

---

### POST: Criação e Processamento

#### Definição e Semântica

**POST** significa: **"Processe os dados enviados de acordo com a semântica do recurso alvo"**. É o método mais flexível e genérico.

**Características:**
- **Não Safe**: Pode e geralmente modifica estado do servidor
- **Não Idempotente**: Repetir POST pode criar múltiplos recursos
- **Não Cacheável**: Respostas não devem ser cacheadas
- **Requer Body**: Dados são enviados no request body

#### Sintaxe Básica com Fetch

```javascript
// POST com JSON
async function criarUsuario(dados) {
  const response = await fetch('https://api.exemplo.com/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  });
  
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  
  const usuarioCriado = await response.json();
  return usuarioCriado;
}

// Uso
const novoUsuario = await criarUsuario({
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  idade: 28
});

console.log('Usuário criado com ID:', novoUsuario.id);
```

#### Sintaxe de Uso com FormData

Para upload de arquivos e dados multipart:

```javascript
// Criar formulário programaticamente
const formData = new FormData();
formData.append('nome', 'João');
formData.append('email', 'joao@exemplo.com');

// Adicionar arquivo
const fileInput = document.querySelector('input[type="file"]');
formData.append('avatar', fileInput.files[0]);

// Múltiplos arquivos
const files = document.querySelector('input[type="file"][multiple]').files;
for (let i = 0; i < files.length; i++) {
  formData.append('documentos', files[i]);
}

// POST com FormData
const response = await fetch('https://api.exemplo.com/usuarios', {
  method: 'POST',
  // NÃO definir Content-Type - navegador define automaticamente com boundary
  body: formData
});
```

**Conceito Crucial**: Quando usa FormData, **não defina Content-Type manualmente**. O navegador define como `multipart/form-data; boundary=...` automaticamente.

#### Conceitos Avançados de POST

**Idempotency Keys**:

Estratégia para tornar POST idempotente artificialmente:

```javascript
// Cliente gera chave única
const idempotencyKey = crypto.randomUUID();

const response = await fetch('/api/pagamentos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey
  },
  body: JSON.stringify({ valor: 100, destinatario: 'João' })
});
```

**Conceito**: Servidor armazena resultado da primeira requisição com aquela chave. Requisições subsequentes com mesma chave retornam resultado armazenado ao invés de reprocessar.

**Uso**: Pagamentos, transferências - operações que não devem ser duplicadas acidentalmente.

**POST vs PUT para Criação**:

```javascript
// POST - servidor decide ID (não idempotente)
POST /usuarios
{ "nome": "Ana" }
→ 201 Created
  Location: /usuarios/789
  { "id": 789, "nome": "Ana" }

// PUT - cliente define ID (idempotente)
PUT /usuarios/999
{ "nome": "Ana" }
→ 201 Created (ou 200 OK se substituiu existente)
  { "id": 999, "nome": "Ana" }
```

**Quando usar cada um**:
- **POST** quando ID é gerado pelo servidor (mais comum)
- **PUT** quando cliente sabe exatamente qual ID quer (raro)

#### Quando Usar POST

- Criar novo recurso: `POST /produtos` com dados do produto
- Submeter formulário: `POST /login` com credenciais
- Processar ação: `POST /transferencias` para mover dinheiro
- Upload de arquivo: `POST /uploads` com FormData
- Operações complexas que não mapeiam para CRUD: `POST /calcular-frete`

---

### PUT: Substituição Completa

#### Definição e Semântica

**PUT** significa: **"Substitua completamente o recurso na URL alvo com os dados fornecidos, ou crie se não existir"**.

**Características:**
- **Não Safe**: Modifica estado do servidor
- **Idempotente**: Repetir PUT tem mesmo efeito final
- **Não Cacheável**: Respostas não devem ser cacheadas
- **Requer Body**: Representação completa do recurso

#### Sintaxe Básica com Fetch

```javascript
// PUT - atualizar recurso completo
async function atualizarUsuario(id, dadosCompletos) {
  const response = await fetch(`https://api.exemplo.com/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosCompletos)
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao atualizar: ${response.status}`);
  }
  
  // Servidor pode retornar 200 OK com body ou 204 No Content sem body
  if (response.status === 204) {
    return null; // Sem conteúdo
  }
  
  return await response.json();
}

// Uso - DEVE enviar TODOS os campos
await atualizarUsuario(123, {
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  idade: 30,
  cidade: 'São Paulo',
  ativo: true
  // Se omitir algum campo, ele pode ser removido/zerado no servidor
});
```

#### Conceito Crucial: Substituição vs Atualização Parcial

**PUT substitui completamente**:

```javascript
// Estado inicial do recurso
GET /usuarios/123
→ { "nome": "João", "email": "joao@exemplo.com", "idade": 30 }

// PUT com dados parciais
PUT /usuarios/123
{ "nome": "João Silva" }

// Estado final (campos omitidos podem ser removidos!)
GET /usuarios/123
→ { "nome": "João Silva" } // email e idade podem ter sido removidos!
```

**Semântica correta de PUT**: Enviar representação **completa** do recurso como deve ficar.

#### Idempotência de PUT

```javascript
// Primeira execução
PUT /usuarios/123
{ "nome": "Ana", "email": "ana@exemplo.com" }
→ Usuário 123 fica com esses dados

// Segunda execução (mesmo comando)
PUT /usuarios/123
{ "nome": "Ana", "email": "ana@exemplo.com" }
→ Usuário 123 continua com mesmos dados (idempotente)

// Compara com POST
POST /usuarios
{ "nome": "Ana", "email": "ana@exemplo.com" }
→ Cria usuário com ID 999

POST /usuarios
{ "nome": "Ana", "email": "ana@exemplo.com" }
→ Cria outro usuário com ID 1000 (não idempotente!)
```

**Conceito Fundamental**: PUT para o mesmo recurso com mesmos dados resulta no mesmo estado final, independente de quantas vezes executado.

#### Quando Usar PUT

- Substituir completamente um recurso existente
- Criar recurso em URL específica (se servidor permitir)
- Atualizar quando você tem representação completa do recurso

**Não Usar PUT Para**:
- Atualizações parciais (use PATCH)
- Criar recursos quando servidor gera ID (use POST)

---

### DELETE: Remoção de Recursos

#### Definição e Semântica

**DELETE** significa: **"Remova o recurso identificado pela URL"**.

**Características:**
- **Não Safe**: Modifica estado do servidor
- **Idempotente**: Deletar recurso já deletado tem mesmo efeito (recurso não existe)
- **Não Cacheável**: Respostas não devem ser cacheadas
- **Geralmente Sem Body**: Request body é raro (mas permitido)

#### Sintaxe Básica com Fetch

```javascript
// DELETE simples
async function deletarUsuario(id) {
  const response = await fetch(`https://api.exemplo.com/usuarios/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      console.log('Recurso já foi deletado ou não existe');
      return; // Ainda é sucesso (idempotência)
    }
    throw new Error(`Erro ao deletar: ${response.status}`);
  }
  
  // Servidor pode retornar:
  // 204 No Content (sem body)
  // 200 OK (com body contendo recurso deletado)
  // 202 Accepted (deleção assíncrona)
  
  if (response.status === 204) {
    return null;
  }
  
  return await response.json();
}

// Uso
await deletarUsuario(123);
```

#### Sintaxe com Confirmação

Padrão comum de segurança:

```javascript
// Soft delete (marcar como inativo ao invés de remover)
async function softDelete(id) {
  return await fetch(`https://api.exemplo.com/usuarios/${id}`, {
    method: 'PATCH', // Ou PUT
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ativo: false, deletadoEm: new Date() })
  });
}

// Hard delete com token de confirmação
async function hardDelete(id, confirmToken) {
  return await fetch(`https://api.exemplo.com/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Confirm-Token': confirmToken
    }
  });
}
```

#### Idempotência de DELETE

```javascript
// Primeira execução
DELETE /usuarios/123
→ 204 No Content (usuário removido)

// Segunda execução
DELETE /usuarios/123
→ 404 Not Found (usuário não existe)

// Mas resultado final é o mesmo: usuário 123 não existe
// Portanto DELETE é idempotente
```

**Conceito**: Idempotência não significa "retorna mesmo status code". Significa "estado final do servidor é o mesmo".

#### Conceitos Avançados

**Deleção em Lote**:

```javascript
// Opção 1: Múltiplas requisições DELETE
const ids = [1, 2, 3, 4, 5];
await Promise.all(ids.map(id => 
  fetch(`/api/usuarios/${id}`, { method: 'DELETE' })
));

// Opção 2: POST para endpoint de deleção em lote
await fetch('/api/usuarios/delete-batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ids: [1, 2, 3, 4, 5] })
});
```

**Deleção Assíncrona**:

```javascript
// Servidor retorna 202 Accepted
const response = await fetch('/api/relatorios/grande-arquivo', {
  method: 'DELETE'
});

if (response.status === 202) {
  const { jobId } = await response.json();
  
  // Polling para verificar conclusão
  while (true) {
    const status = await fetch(`/api/jobs/${jobId}`).then(r => r.json());
    if (status.completed) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

#### Quando Usar DELETE

- Remover recurso específico: `DELETE /produtos/456`
- Remover relacionamento: `DELETE /usuarios/123/seguindo/789`
- Limpar dados: `DELETE /carrinho/itens`

---

### PATCH: Atualização Parcial

#### Definição e Semântica

**PATCH** significa: **"Aplique modificações parciais ao recurso"**.

**Características:**
- **Não Safe**: Modifica estado do servidor
- **Pode ser Idempotente**: Depende da implementação
- **Não Cacheável**: Respostas não devem ser cacheadas
- **Requer Body**: Contém apenas campos a modificar

#### Sintaxe Básica com Fetch

```javascript
// PATCH - atualizar apenas campos específicos
async function atualizarParcial(id, camposParaAtualizar) {
  const response = await fetch(`https://api.exemplo.com/usuarios/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(camposParaAtualizar)
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao atualizar: ${response.status}`);
  }
  
  return await response.json();
}

// Uso - envia APENAS campos que mudam
await atualizarParcial(123, {
  email: 'novoemail@exemplo.com'
  // Outros campos (nome, idade, etc.) permanecem inalterados
});
```

#### PATCH vs PUT: Diferenças Conceituais

```javascript
// Estado inicial
GET /usuarios/123
→ { "nome": "João", "email": "joao@exemplo.com", "idade": 30 }

// PATCH - atualização parcial
PATCH /usuarios/123
{ "email": "novo@exemplo.com" }

GET /usuarios/123
→ { "nome": "João", "email": "novo@exemplo.com", "idade": 30 }
// nome e idade permanecem!

// PUT - substituição completa
PUT /usuarios/123
{ "email": "novo@exemplo.com" }

GET /usuarios/123
→ { "email": "novo@exemplo.com" }
// nome e idade podem ter sido removidos!
```

**Conceito Fundamental**:
- **PUT** = "Este é o novo estado completo do recurso"
- **PATCH** = "Aplique estas mudanças ao estado existente"

#### JSON Patch (RFC 6902)

Formato padronizado para descrever modificações:

```javascript
// JSON Patch - array de operações
const patch = [
  { "op": "replace", "path": "/email", "value": "novo@exemplo.com" },
  { "op": "add", "path": "/telefone", "value": "11999999999" },
  { "op": "remove", "path": "/endereco/temporario" }
];

await fetch('/api/usuarios/123', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json-patch+json'
  },
  body: JSON.stringify(patch)
});
```

**Operações JSON Patch**:
- `add`: Adicionar campo
- `remove`: Remover campo
- `replace`: Substituir valor
- `move`: Mover valor de um path para outro
- `copy`: Copiar valor
- `test`: Validar que valor atual é o esperado

#### Idempotência de PATCH

```javascript
// PATCH pode ser idempotente se bem projetado
PATCH /usuarios/123
{ "email": "novo@exemplo.com" }
// Executar múltiplas vezes resulta em email = "novo@exemplo.com" (idempotente)

// PATCH pode NÃO ser idempotente
PATCH /usuarios/123
{ "saldo": "+10" } // Incrementa saldo em 10
// Executar 3 vezes adiciona 30 (não idempotente!)

// Solução idempotente
PATCH /usuarios/123
{ "saldo": 110 } // Define saldo como 110
// Executar múltiplas vezes resulta em saldo = 110 (idempotente)
```

**Conceito**: PATCH é idempotente se as mudanças são "setters" (definir valores), não "modificadores" (incrementar, adicionar a lista, etc.).

#### Quando Usar PATCH

- Atualizar apenas alguns campos de um recurso grande
- Modificações específicas sem necessidade de enviar representação completa
- Operações como ativar/desativar, aprovar/rejeitar

**Preferir PATCH sobre PUT Quando**:
- Recurso tem muitos campos mas você muda apenas alguns
- Reduzir tamanho de requisições (importante em mobile)
- Evitar race conditions (duas atualizações simultâneas de campos diferentes)

---

## 🎯 Aplicabilidade e Contextos

### Cenários de Uso e Escolha de Método

#### CRUD Operations

**Create (Criar)**:
- **POST** para criar recurso com ID gerado pelo servidor
  ```javascript
  POST /api/produtos
  { "nome": "Notebook", "preco": 3000 }
  → 201 Created, Location: /api/produtos/789
  ```

**Read (Ler)**:
- **GET** para recuperar um ou múltiplos recursos
  ```javascript
  GET /api/produtos/789
  GET /api/produtos?categoria=eletronicos
  ```

**Update (Atualizar)**:
- **PUT** para substituição completa
  ```javascript
  PUT /api/produtos/789
  { "nome": "Notebook Dell", "preco": 3200, "estoque": 5 }
  ```
- **PATCH** para atualização parcial
  ```javascript
  PATCH /api/produtos/789
  { "preco": 2800 }
  ```

**Delete (Deletar)**:
- **DELETE** para remover recurso
  ```javascript
  DELETE /api/produtos/789
  ```

#### Padrões Conceituais

**Operações em Lote**:
```javascript
// Criar múltiplos
POST /api/produtos/batch
{ "produtos": [{...}, {...}, {...}] }

// Atualizar múltiplos
PATCH /api/produtos/batch
{ "updates": [{"id": 1, "preco": 100}, {"id": 2, "preco": 200}] }

// Deletar múltiplos
POST /api/produtos/delete-batch
{ "ids": [1, 2, 3, 4, 5] }
```

**Ações Customizadas** (que não mapeiam para CRUD):
```javascript
// POST para ações específicas
POST /api/usuarios/123/enviar-email-boas-vindas
POST /api/pedidos/789/cancelar
POST /api/relatorios/vendas/gerar
```

**Conceito**: Quando operação não é claramente CRUD, POST para um endpoint que nomeia a ação é idiomático.

---

## ⚠️ Limitações e Considerações Teóricas

### Restrições e Trade-offs

#### 1. Limites de URL (GET)

**Limitação**: URLs têm limite de tamanho (geralmente 2048 caracteres em navegadores, menos em alguns servidores).

**Implicação**: GET com muitos query parameters pode exceder limite.

**Solução**: Para filtros complexos, use POST com body (menos RESTful mas prático):
```javascript
POST /api/produtos/search
{ "filtros": { "categorias": [...], "faixasPreco": [...], ... } }
```

#### 2. Idempotência Não Garantida

**Limitação**: Mesmo métodos "idempotentes" podem não ser na prática.

**Exemplo**: DELETE pode falhar de formas diferentes:
```javascript
DELETE /usuarios/123
→ Primeira vez: 204 No Content
→ Segunda vez: 404 Not Found (resultado diferente!)
```

**Conceito**: Idempotência refere-se ao **estado do servidor**, não ao status code retornado.

#### 3. Segurança de GET com Dados Sensíveis

**Problema**: Dados em URLs (GET) aparecem em:
- Logs de servidor
- Histórico de navegador
- Logs de proxy
- Referrer headers

**Nunca Fazer**:
```javascript
// ❌ PÉSSIMA IDEIA
GET /login?username=joao&password=senha123
```

**Solução**: Use POST para dados sensíveis:
```javascript
// ✅ CORRETO
POST /login
{ "username": "joao", "password": "senha123" }
```

### Armadilhas Comuns

#### Armadilha 1: PUT Sem Dados Completos

```javascript
// ❌ ERRADO - PUT com dados parciais
PUT /api/usuarios/123
{ "email": "novo@exemplo.com" }
// Pode remover outros campos!

// ✅ CORRETO - Use PATCH para parcial
PATCH /api/usuarios/123
{ "email": "novo@exemplo.com" }

// ✅ CORRETO - PUT com dados completos
// Primeiro GET para pegar estado atual
const usuario = await fetch('/api/usuarios/123').then(r => r.json());
usuario.email = 'novo@exemplo.com';

// Depois PUT com objeto completo
await fetch('/api/usuarios/123', {
  method: 'PUT',
  body: JSON.stringify(usuario)
});
```

#### Armadilha 2: Não Verificar response.ok

```javascript
// ❌ Assume sucesso
const usuario = await fetch('/api/usuarios/123', { method: 'DELETE' })
  .then(r => r.json()); // Pode falhar se 204 No Content ou erro

// ✅ Verifica status
const response = await fetch('/api/usuarios/123', { method: 'DELETE' });
if (!response.ok) {
  throw new Error(`Delete falhou: ${response.status}`);
}
// Só parseia JSON se há conteúdo
const result = response.status === 204 ? null : await response.json();
```

#### Armadilha 3: POST Quando Deveria Ser PUT/PATCH

```javascript
// ❌ Atualizar com POST (não idiomático)
POST /api/usuarios/123/atualizar
{ "email": "novo@exemplo.com" }

// ✅ Usar método semântico correto
PATCH /api/usuarios/123
{ "email": "novo@exemplo.com" }
```

**Conceito**: Respeitar semântica de métodos torna APIs mais previsíveis e compatíveis com ferramentas.

---

## 🔗 Interconexões Conceituais

### Relação com Status Codes

Métodos e status codes trabalham juntos para comunicar resultado:

| Método | Sucesso | Criou | Sem Conteúdo | Não Encontrado | Não Permitido |
|--------|---------|-------|--------------|----------------|---------------|
| GET    | 200     | -     | -            | 404            | 405           |
| POST   | 200     | 201   | -            | -              | 405           |
| PUT    | 200     | 201   | 204          | 404            | 405           |
| PATCH  | 200     | -     | 204          | 404            | 405           |
| DELETE | 200     | -     | 204          | 404            | 405           |

### Relação com CORS

CORS trata métodos de forma diferente:

**Simple Requests** (sem preflight):
- GET, HEAD, POST
- Headers limitados
- Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain

**Preflight Requests** (requer OPTIONS antes):
- PUT, DELETE, PATCH
- Custom headers (Authorization, etc.)
- Content-Type: application/json

```javascript
// Este POST dispara preflight
await fetch('https://outro-dominio.com/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // Dispara preflight!
    'Authorization': 'Bearer token'
  },
  body: JSON.stringify({...})
});
```

### Relação com Cache

Apenas métodos safe são cacheáveis:

- **GET, HEAD**: Cacheáveis por navegadores, CDNs, proxies
- **POST, PUT, PATCH, DELETE**: Não cacheáveis

**Implicação**: Use GET para operações de leitura sempre que possível para aproveitar cache.

---

## 🚀 Evolução e Próximos Conceitos

### Desenvolvimento Natural

Após dominar métodos HTTP, próximos conceitos:

1. **Headers HTTP**: Content-Type, Authorization, Cache-Control, etc.
2. **Status Codes**: Compreensão profunda de 2xx, 3xx, 4xx, 5xx
3. **CORS**: Política same-origin e cross-origin
4. **Autenticação**: Bearer tokens, Basic Auth, OAuth
5. **Request/Response Cycle**: Timing, streaming, chunking
6. **API Design**: Princípios REST, versionamento, naming

### Conceitos Avançados

**HTTP/2 e HTTP/3**: Métodos permanecem, mas protocolo subjacente evolui (multiplexing, server push).

**GraphQL**: Alternativa a REST que usa principalmente POST:
```javascript
POST /graphql
{ "query": "{ usuarios { id nome } }" }
```

**gRPC**: Protocolo sobre HTTP/2 que não usa métodos HTTP tradicionais.

---

## 📚 Conclusão

Métodos HTTP são **a linguagem de comunicação** da web. GET, POST, PUT, DELETE e PATCH não são apenas comandos técnicos - são **contratos semânticos** que comunicam intenção, permitem otimizações, e estruturam APIs de forma previsível.

Dominar métodos HTTP é compreender:
- **Semântica**: O que cada método significa
- **Propriedades**: Safe, idempotente, cacheável
- **Uso Idiomático**: Quando usar cada método
- **Trade-offs**: Limitações e considerações práticas

A escolha correta de método torna APIs mais intuitivas, performáticas e compatíveis com o ecossistema web. É a base sobre a qual arquiteturas REST, ferramentas de API, e comunicação cliente-servidor moderna são construídas.
