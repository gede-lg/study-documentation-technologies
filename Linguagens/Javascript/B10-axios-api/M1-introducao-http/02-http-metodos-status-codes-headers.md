# HTTP: Métodos, Status Codes e Headers

## 🎯 Introdução e Definição

### Definição Conceitual

O **HTTP (Hypertext Transfer Protocol)** é o protocolo fundamental da World Wide Web, definindo como mensagens são formatadas e transmitidas entre clientes (navegadores, aplicações) e servidores. Conceitualmente, HTTP é um **protocolo de comunicação sem estado** baseado no modelo **requisição-resposta**, onde clientes enviam solicitações e servidores retornam respostas.

Na essência, HTTP funciona como uma **linguagem universal** que permite diferentes sistemas se comunicarem de forma padronizada. Três elementos centrais definem a semântica desta comunicação:

- **Métodos HTTP:** Verbos que indicam a **intenção** da requisição (o que queremos fazer)
- **Status Codes:** Códigos numéricos que indicam o **resultado** da requisição (o que aconteceu)
- **Headers:** Metadados que fornecem **contexto** sobre a requisição/resposta (como, quando, quem)

Juntos, esses três elementos formam a gramática do HTTP, permitindo comunicação rica, expressiva e padronizada entre sistemas distribuídos.

### Contexto Histórico e Motivação

HTTP foi criado por **Tim Berners-Lee** em 1989 no CERN como parte do projeto World Wide Web. A primeira versão (HTTP/0.9) era extremamente simples: apenas GET para recuperar documentos HTML.

**HTTP/1.0 (1996)** introduziu:
- Múltiplos métodos (GET, POST, HEAD)
- Status codes estruturados
- Headers para metadados
- Suporte a diferentes tipos de conteúdo (não apenas HTML)

**HTTP/1.1 (1997)** trouxe melhorias significativas:
- Conexões persistentes (keep-alive)
- Métodos adicionais (PUT, DELETE, OPTIONS, etc.)
- Chunked transfer encoding
- Cache control avançado
- Virtual hosting via Host header

**HTTP/2 (2015)** focou em performance:
- Multiplexação de requisições
- Compressão de headers
- Server push

**HTTP/3 (2022)** mudou transporte:
- QUIC em vez de TCP
- Menor latência em redes instáveis

A **motivação** para evolução constante do HTTP sempre foi equilibrar:
- **Simplicidade:** Protocolo fácil de implementar e debugar
- **Extensibilidade:** Capacidade de adicionar novos recursos
- **Performance:** Redução de latência e overhead
- **Segurança:** Proteção de dados (HTTPS)

### Problema Fundamental que Resolve

HTTP resolve o problema de **comunicação heterogênea** em sistemas distribuídos. Sem um protocolo padronizado:

1. **Incompatibilidade:** Cada sistema precisaria de adaptadores específicos para conversar com outros
2. **Ambiguidade:** Sem convenções, seria difícil saber se operação foi sucesso ou falha
3. **Falta de Contexto:** Sem metadados, seria impossível negociar formatos, cachear, autenticar, etc.
4. **Ausência de Semântica:** Sem métodos padronizados, significado de operações seria arbitrário

**Métodos HTTP** resolvem a ambiguidade de intenção. Ao invés de endpoints como `/getUser` e `/createUser`, temos **um endpoint `/users` com métodos diferentes** (GET, POST), tornando API mais semântica.

**Status Codes** resolvem a ambiguidade de resultado. Cliente imediatamente sabe se operação foi bem-sucedida (2xx), se erro foi culpa dele (4xx), ou do servidor (5xx).

**Headers** resolvem a necessidade de contexto. Permitem negociação de conteúdo (aceito JSON ou XML?), autenticação (quem sou eu?), cache (posso reusar resposta antiga?), cookies (sessão), CORS (de onde venho?), e muito mais.

### Importância no Ecossistema

HTTP é literalmente a **fundação da web moderna**. Sua importância transcende HTTP em si:

- **APIs RESTful:** Arquitetura REST é construída sobre semântica HTTP (métodos = CRUD, status codes = resultado, URLs = recursos)
- **Microservices:** Comunicação entre serviços frequentemente usa HTTP por ser universal e firewall-friendly
- **IoT:** Dispositivos IoT usam HTTP para enviar dados a servidores
- **Mobile Apps:** Apps mobile comunicam com backends via HTTP/HTTPS
- **Webhooks:** Sistemas notificam outros via POST HTTP
- **GraphQL:** Embora tenha query language própria, ainda usa HTTP como transporte (POST)

Compreender HTTP profundamente é essencial para qualquer desenvolvedor web, pois:
- **Debugging:** Entender headers e status codes facilita identificar problemas
- **Performance:** Conhecer cache headers otimiza velocidade
- **Segurança:** HTTPS, CORS, CSP headers protegem aplicações
- **Arquitetura:** Projetar APIs eficazes requer domínio de semântica HTTP

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Métodos HTTP como Verbos Semânticos:** Cada método tem significado específico e deve ser usado apropriadamente
2. **Idempotência:** Conceito crucial - métodos idempotentes podem ser repetidos sem efeito adicional
3. **Status Codes como Linguagem de Resultado:** Categorias claras (2xx, 4xx, 5xx) facilitam tratamento de erros
4. **Headers como Negociação:** Cliente e servidor negociam capacidades, formatos, autenticação via headers
5. **Stateless:** HTTP não mantém estado entre requisições - cada requisição é independente

### Pilares Fundamentais

- **Request-Response:** HTTP é sempre iniciado por cliente, servidor responde
- **Recursos Identificados por URLs:** Tudo em HTTP é sobre manipular recursos (usuários, posts, produtos)
- **Métodos Uniformes:** Mesmos métodos (GET, POST, etc.) funcionam para qualquer recurso
- **Metadados Explícitos:** Headers tornam contexto explícito ao invés de implícito
- **Extensibilidade:** Novos headers customizados podem ser criados conforme necessário

### Visão Geral das Nuances

- **Safe vs Unsafe Methods:** GET é "safe" (não modifica servidor), POST é "unsafe"
- **Diferença entre PUT e PATCH:** Ambos atualizam, mas PUT substitui completamente, PATCH parcialmente
- **Status Codes Ambíguos:** 200 vs 201, 401 vs 403, 400 vs 422 - escolher apropriadamente
- **Headers Sensíveis a Caso:** Alguns headers são case-insensitive, outros não
- **CORS e Preflight:** Requisições cross-origin podem disparar preflight OPTIONS

---

## 🧠 Fundamentos Teóricos

### Métodos HTTP: Definições e Semântica

#### O Conceito de Método

Métodos HTTP (também chamados de **verbos**) indicam a **ação desejada** sobre um recurso identificado por URL. São análogos a verbos em linguagem natural:

- **GET:** "Obter" / "Recuperar"
- **POST:** "Criar" / "Submeter"
- **PUT:** "Substituir" / "Atualizar completamente"
- **PATCH:** "Modificar parcialmente"
- **DELETE:** "Remover"

Métodos transformam URLs de substantivos em sentenças completas:
- `GET /usuarios` = "Obtenha a lista de usuários"
- `POST /usuarios` = "Crie um novo usuário"
- `DELETE /usuarios/123` = "Remova o usuário 123"

#### Idempotência: Conceito Central

Um método é **idempotente** se executá-lo múltiplas vezes tem o **mesmo efeito** que executá-lo uma vez. Formalmente:

```
f(f(x)) = f(x)
```

**Métodos Idempotentes:**
- **GET:** Buscar múltiplas vezes não muda o servidor
- **PUT:** Substituir múltiplas vezes com mesmos dados resulta no mesmo estado final
- **DELETE:** Deletar múltiplas vezes - primeira deleta, demais não mudam nada (recurso já está deletado)

**Métodos Não-Idempotentes:**
- **POST:** Criar múltiplas vezes cria múltiplos recursos

**Importância conceitual:** Idempotência permite **retry seguro**. Se requisição PUT falha por erro de rede, você pode tentar novamente sem medo de duplicar efeito. POST não pode ser retentado cegamente (pode criar duplicatas).

#### Safety: Métodos Somente Leitura

Um método é **safe** se não modifica o estado do servidor. Apenas métodos de leitura são safe:

**Safe Methods:**
- **GET:** Apenas lê dados
- **HEAD:** Igual GET mas retorna apenas headers (sem body)
- **OPTIONS:** Consulta opções disponíveis

**Unsafe Methods:** POST, PUT, PATCH, DELETE

**Implicação:** Navegadores podem fazer prefetch de links (GET), mas não de forms (POST). Crawlers podem seguir GETs, mas não POSTs.

### Métodos HTTP Principais

#### GET: Recuperação de Recursos

**Definição:** Solicita representação de um recurso. Não deve modificar servidor.

**Características:**
- **Safe:** Sim
- **Idempotente:** Sim
- **Cacheable:** Sim
- **Body:** Geralmente não (pode ter, mas não é comum)

**Sintaxe básica:**
```javascript
// Buscar todos os usuários
axios.get('/usuarios');

// Buscar usuário específico
axios.get('/usuarios/123');

// Com query parameters
axios.get('/usuarios', {
  params: {
    role: 'admin',
    limit: 10
  }
});
// Gera: GET /usuarios?role=admin&limit=10
```

**Uso apropriado:**
- Buscar lista de recursos
- Buscar recurso individual
- Buscar dados computados (relatórios, estatísticas)
- Operações de leitura em geral

**Mal uso comum:**
```javascript
// ❌ ERRADO - GET modificando servidor
axios.get('/usuarios/123/delete'); // DELETE disfarçado de GET

// ✅ CORRETO - usar DELETE
axios.delete('/usuarios/123');
```

**Conceito profundo:** GET representa **projeção** do estado do servidor no cliente. É janela de leitura, não porta de entrada.

#### POST: Criação e Submissão

**Definição:** Submete dados para serem processados. Frequentemente usado para criar recursos.

**Características:**
- **Safe:** Não
- **Idempotente:** Não
- **Cacheable:** Raramente (só se resposta incluir Cache-Control)
- **Body:** Sim

**Sintaxe básica:**
```javascript
// Criar novo usuário
axios.post('/usuarios', {
  nome: 'João Silva',
  email: 'joao@example.com'
});

// Submeter formulário
axios.post('/auth/login', {
  email: 'user@example.com',
  password: 'senha123'
});

// Upload de arquivo
const formData = new FormData();
formData.append('arquivo', file);
axios.post('/upload', formData);
```

**Casos de uso:**
- **Criar novo recurso:** `POST /usuarios` com dados do usuário
- **Submeter dados de formulário:** `POST /contato` com mensagem
- **Processar operação:** `POST /calcular` com parâmetros
- **Busca complexa:** `POST /busca-avancada` quando query params não são suficientes

**Resposta típica:**
```javascript
// Status 201 Created com Location header
{
  status: 201,
  headers: {
    'Location': '/usuarios/456' // URL do recurso criado
  },
  data: {
    id: 456,
    nome: 'João Silva',
    email: 'joao@example.com',
    criadoEm: '2025-01-15T10:30:00Z'
  }
}
```

**Conceito profundo:** POST é o método mais **versátil** e menos restrito. Quando em dúvida sobre qual método usar, POST geralmente funciona, mas use métodos mais específicos quando semântica for clara.

#### PUT: Substituição Completa

**Definição:** Substitui **completamente** um recurso existente (ou cria se não existir).

**Características:**
- **Safe:** Não
- **Idempotente:** Sim
- **Cacheable:** Não
- **Body:** Sim

**Sintaxe básica:**
```javascript
// Substituir usuário completamente
axios.put('/usuarios/123', {
  nome: 'João Silva Santos', // Novo nome
  email: 'joao.novo@example.com', // Novo email
  role: 'admin' // Todos os campos devem ser enviados
});
```

**Diferença crucial de PATCH:**
```javascript
// PUT - substitui TODO o recurso
axios.put('/usuarios/123', {
  nome: 'Novo Nome'
  // Se não enviar email, ele será REMOVIDO/resetado
});

// PATCH - modifica apenas campos enviados
axios.patch('/usuarios/123', {
  nome: 'Novo Nome'
  // Email permanece inalterado
});
```

**Idempotência de PUT:**
```javascript
// Executar múltiplas vezes tem mesmo resultado
axios.put('/usuarios/123', { nome: 'João', email: 'joao@example.com' });
axios.put('/usuarios/123', { nome: 'João', email: 'joao@example.com' });
axios.put('/usuarios/123', { nome: 'João', email: 'joao@example.com' });
// Resultado final: usuário 123 tem nome 'João' e email 'joao@example.com'
```

**Conceito profundo:** PUT representa **idempotência através de substituição total**. Cada PUT define o estado completo do recurso, tornando resultado previsível independentemente de quantas vezes é executado.

#### PATCH: Modificação Parcial

**Definição:** Aplica modificações parciais a um recurso.

**Características:**
- **Safe:** Não
- **Idempotente:** Pode ser (depende de implementação)
- **Cacheable:** Não
- **Body:** Sim

**Sintaxe básica:**
```javascript
// Atualizar apenas o email
axios.patch('/usuarios/123', {
  email: 'novo.email@example.com'
  // Outros campos (nome, role) permanecem inalterados
});

// Atualizar múltiplos campos
axios.patch('/usuarios/123', {
  nome: 'João Silva',
  ativo: true
});
```

**JSON Patch (RFC 6902):** Formato padronizado para patches:
```javascript
axios.patch('/usuarios/123', [
  { op: 'replace', path: '/email', value: 'novo@example.com' },
  { op: 'add', path: '/telefones/-', value: '11999999999' },
  { op: 'remove', path: '/endereco/complemento' }
], {
  headers: { 'Content-Type': 'application/json-patch+json' }
});
```

**Quando usar PATCH vs PUT:**
- **PATCH:** Quando você quer modificar **apenas alguns campos** (comum em interfaces de edição)
- **PUT:** Quando você tem **todos os dados** do recurso e quer substituir completamente

**Conceito profundo:** PATCH reflete **atualizações incrementais** ao invés de substituição total. É mais natural para UIs onde usuário edita formulário com alguns campos.

#### DELETE: Remoção de Recursos

**Definição:** Remove um recurso.

**Características:**
- **Safe:** Não
- **Idempotente:** Sim (deletar algo já deletado não tem efeito adicional)
- **Cacheable:** Não
- **Body:** Pode ter (não comum)

**Sintaxe básica:**
```javascript
// Deletar usuário específico
axios.delete('/usuarios/123');

// Deletar com query parameters (menos comum)
axios.delete('/usuarios', {
  params: { email: 'user@example.com' }
});

// Deletar com body (raro, mas possível)
axios.delete('/usuarios/batch', {
  data: { ids: [123, 456, 789] }
});
```

**Respostas comuns:**
```javascript
// 204 No Content - sucesso, sem corpo
{ status: 204, data: '' }

// 200 OK - sucesso, com informações
{ 
  status: 200, 
  data: { 
    message: 'Usuário removido com sucesso',
    deletedId: 123 
  } 
}

// 404 Not Found - recurso não existe
{ status: 404, data: { error: 'Usuário não encontrado' } }
```

**Idempotência de DELETE:**
```javascript
// Primeira execução: deleta recurso (200 ou 204)
await axios.delete('/usuarios/123'); // 204 No Content

// Segunda execução: recurso já está deletado (404 ou 204)
await axios.delete('/usuarios/123'); // 404 Not Found
```

**Conceito:** Ambos resultados (recurso deletado) são aceitáveis. Idempotência significa "estado final é o mesmo", não "resposta é a mesma".

#### Métodos Menos Comuns

**HEAD:** Idêntico a GET, mas retorna apenas headers (sem body)
```javascript
// Verificar se recurso existe sem baixar conteúdo
const response = await axios.head('/arquivo-grande.zip');
console.log(response.headers['content-length']); // Tamanho do arquivo
```

**OPTIONS:** Consulta métodos permitidos em um recurso
```javascript
// Usado automaticamente em CORS preflight
const response = await axios.options('/usuarios');
console.log(response.headers['allow']); // "GET, POST, PUT, DELETE"
```

**TRACE:** Debug - servidor retorna requisição recebida (raramente implementado por motivos de segurança)

**CONNECT:** Estabelece túnel (usado em proxies)

### Status Codes: Linguagem de Resultado

#### Categorias de Status Codes

Status codes HTTP são números de 3 dígitos divididos em **cinco categorias**:

**1xx - Informacional:** Requisição recebida, processando
- Raramente vistos em aplicações modernas
- `100 Continue`, `101 Switching Protocols`

**2xx - Sucesso:** Requisição bem-sucedida
- `200 OK`, `201 Created`, `204 No Content`

**3xx - Redirecionamento:** Cliente deve tomar ação adicional
- `301 Moved Permanently`, `302 Found`, `304 Not Modified`

**4xx - Erro do Cliente:** Requisição contém erro
- `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

**5xx - Erro do Servidor:** Servidor falhou ao processar requisição válida
- `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`

#### Status Codes 2xx: Sucesso

**200 OK:** Requisição bem-sucedida (uso geral)
```javascript
// GET - recurso retornado
axios.get('/usuarios/123'); // 200 OK

// POST - operação processada (mas prefira 201 para criação)
axios.post('/processar'); // 200 OK

// PUT/PATCH - recurso atualizado
axios.put('/usuarios/123', data); // 200 OK
```

**201 Created:** Recurso criado com sucesso
```javascript
const response = await axios.post('/usuarios', novoUsuario);
// Status: 201
// Header Location: /usuarios/456 (URL do novo recurso)
```

**204 No Content:** Sucesso, mas sem conteúdo na resposta
```javascript
// Comum em DELETE
await axios.delete('/usuarios/123'); // 204 No Content
// response.data está vazio

// Também usado em PUT que não retorna recurso atualizado
await axios.put('/usuarios/123', data); // 204 No Content
```

**202 Accepted:** Requisição aceita para processamento assíncrono
```javascript
// Operação demora (processamento de vídeo, geração de relatório)
const response = await axios.post('/videos/processar', { videoId: 123 });
// Status: 202
// Body: { jobId: 'abc-123', status: 'pending' }
// Cliente pode consultar /jobs/abc-123 depois
```

#### Status Codes 4xx: Erro do Cliente

**400 Bad Request:** Requisição malformada ou inválida
```javascript
// JSON inválido, parâmetros faltando, formato incorreto
axios.post('/usuarios', { email: 'invalido' }); // 400
// Response: { error: 'Email inválido' }
```

**401 Unauthorized:** Autenticação necessária ou falhou
```javascript
// Sem token ou token inválido
axios.get('/perfil'); // 401
// Response: { error: 'Token de autenticação necessário' }

// Nome confuso: deveria ser "Unauthenticated"
```

**403 Forbidden:** Autenticado, mas sem permissão
```javascript
// Usuário logado (autenticado) mas não tem role necessária
axios.delete('/usuarios/999'); // 403
// Response: { error: 'Você não tem permissão para deletar usuários' }
```

**Diferença crucial entre 401 e 403:**
- **401:** "Não sei quem você é" (problema de autenticação)
- **403:** "Sei quem você é, mas você não pode fazer isso" (problema de autorização)

**404 Not Found:** Recurso não existe
```javascript
axios.get('/usuarios/999999'); // 404
// Response: { error: 'Usuário não encontrado' }
```

**405 Method Not Allowed:** Método não suportado para este recurso
```javascript
// Endpoint só aceita GET, mas tentou POST
axios.post('/usuarios/123'); // 405
// Header: Allow: GET, PUT, DELETE
```

**409 Conflict:** Conflito com estado atual do recurso
```javascript
// Tentar criar usuário com email que já existe
axios.post('/usuarios', { email: 'existente@example.com' }); // 409
// Response: { error: 'Email já cadastrado' }
```

**422 Unprocessable Entity:** Semântica correta, mas valores inválidos
```javascript
// JSON válido, mas regras de negócio violadas
axios.post('/usuarios', { 
  nome: '', // Nome vazio
  idade: -5 // Idade negativa
}); // 422
// Response: { 
//   errors: {
//     nome: ['Nome é obrigatório'],
//     idade: ['Idade deve ser positiva']
//   }
// }
```

**Diferença entre 400 e 422:**
- **400:** Erro de sintaxe/formato (JSON malformado, tipo errado)
- **422:** Sintaxe correta, mas validação de negócio falhou

**429 Too Many Requests:** Rate limiting
```javascript
// Muitas requisições em curto período
axios.get('/api/dados'); // 429
// Headers: 
//   Retry-After: 60 (tente novamente em 60 segundos)
//   X-RateLimit-Limit: 100
//   X-RateLimit-Remaining: 0
```

#### Status Codes 5xx: Erro do Servidor

**500 Internal Server Error:** Erro genérico do servidor
```javascript
// Exceção não tratada, bug no código do servidor
axios.get('/usuarios'); // 500
// Response: { error: 'Internal server error' }
// Detalhes reais não devem ser expostos ao cliente
```

**502 Bad Gateway:** Servidor (atuando como gateway) recebeu resposta inválida
```javascript
// Proxy/gateway não consegue contatar servidor upstream
axios.get('/api/externa'); // 502
// Response: { error: 'Bad gateway' }
```

**503 Service Unavailable:** Servidor temporariamente indisponível
```javascript
// Manutenção, sobrecarga, startup
axios.get('/api/dados'); // 503
// Header: Retry-After: 3600 (tente em 1 hora)
```

**504 Gateway Timeout:** Gateway não recebeu resposta a tempo
```javascript
// Servidor upstream demorou demais
axios.get('/operacao-lenta'); // 504
```

### Headers: Metadados da Comunicação

#### Conceito de Headers

Headers HTTP são **pares chave-valor** que fornecem metadados sobre requisição ou resposta. Eles permitem que cliente e servidor **negociem capacidades**, **forneçam contexto** e **controlem comportamento**.

**Estrutura:**
```
Header-Name: valor
```

**Características:**
- Case-insensitive (mas convenção é Title-Case)
- Múltiplos valores separados por vírgula
- Headers customizados geralmente começam com `X-` (convenção antiga) ou sem prefixo (moderna)

#### Headers de Requisição Comuns

**Content-Type:** Tipo de dados no body
```javascript
axios.post('/usuarios', data, {
  headers: { 'Content-Type': 'application/json' }
});
// Axios adiciona automaticamente para objetos JavaScript

// Outros valores comuns:
// 'application/x-www-form-urlencoded' - formulários HTML
// 'multipart/form-data' - upload de arquivos
// 'text/plain' - texto puro
// 'application/xml' - XML
```

**Accept:** Formatos que cliente aceita na resposta
```javascript
axios.get('/usuarios', {
  headers: { 'Accept': 'application/json' }
});

// Múltiplos formatos com preferência (quality values)
Accept: application/json, application/xml;q=0.9, */*;q=0.8
// Preferência: JSON > XML (q=0.9) > qualquer coisa (q=0.8)
```

**Authorization:** Credenciais de autenticação
```javascript
// Bearer token (JWT)
axios.get('/perfil', {
  headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1...' }
});

// Basic Auth
const credentials = btoa('usuario:senha');
axios.get('/dados', {
  headers: { 'Authorization': `Basic ${credentials}` }
});
```

**User-Agent:** Identifica cliente
```javascript
// Axios adiciona automaticamente
User-Agent: axios/1.6.2

// Customizar
axios.defaults.headers.common['User-Agent'] = 'MeuApp/1.0';
```

**Referer:** URL de onde veio a requisição
```javascript
// Navegador adiciona automaticamente
Referer: https://example.com/pagina-anterior
```

**Cookie:** Cookies enviados ao servidor
```javascript
// Navegador gerencia automaticamente
Cookie: sessionId=abc123; userId=456

// Em Axios (Node.js), você controla
axios.get('/api/dados', {
  headers: { 'Cookie': 'sessionId=abc123' }
});
```

#### Headers de Resposta Comuns

**Content-Type:** Tipo de dados na resposta
```javascript
const response = await axios.get('/usuarios');
console.log(response.headers['content-type']); 
// 'application/json; charset=utf-8'
```

**Set-Cookie:** Define cookies no cliente
```javascript
Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure
```

**Location:** URL do recurso criado/redirecionado
```javascript
const response = await axios.post('/usuarios', data);
console.log(response.headers.location); // '/usuarios/456'
```

**Cache-Control:** Instruções de cache
```javascript
Cache-Control: max-age=3600, public
// Pode cachear por 1 hora, compartilhável entre usuários

Cache-Control: no-cache
// Deve revalidar antes de usar cache

Cache-Control: no-store
// Não deve cachear de forma alguma
```

**ETag:** Identificador de versão do recurso
```javascript
// Resposta inicial
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

// Requisição subsequente
axios.get('/dados', {
  headers: { 'If-None-Match': '"33a64df551425fcc55e4d42a148795d9f25f89d4"' }
});
// Se recurso não mudou: 304 Not Modified (sem body, economiza banda)
```

**Access-Control-Allow-Origin:** CORS - quais origens podem acessar
```javascript
Access-Control-Allow-Origin: https://meuapp.com
// Apenas meuapp.com pode fazer requisições cross-origin

Access-Control-Allow-Origin: *
// Qualquer origem pode acessar (público)
```

#### Headers de Cache

**Cache-Control (Response):** Controla cache
```javascript
// Cachear por 1 hora
Cache-Control: max-age=3600

// Cachear, mas revalidar sempre
Cache-Control: no-cache

// Não cachear
Cache-Control: no-store

// Privado (apenas browser pode cachear, não CDN)
Cache-Control: private

// Público (CDN pode cachear)
Cache-Control: public

// Combinações
Cache-Control: public, max-age=86400, must-revalidate
```

**Expires:** Data de expiração (legado, use Cache-Control)
```javascript
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Last-Modified e If-Modified-Since:** Cache baseado em tempo
```javascript
// Servidor retorna
Last-Modified: Wed, 15 Jan 2025 12:00:00 GMT

// Cliente reenvia em requisição futura
If-Modified-Since: Wed, 15 Jan 2025 12:00:00 GMT
// Se não modificou desde então: 304 Not Modified
```

#### Headers de CORS

**Access-Control-Allow-Origin:** Origens permitidas
```javascript
Access-Control-Allow-Origin: https://frontend.com
```

**Access-Control-Allow-Methods:** Métodos permitidos
```javascript
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

**Access-Control-Allow-Headers:** Headers permitidos
```javascript
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Access-Control-Max-Age:** Quanto tempo cachear preflight
```javascript
Access-Control-Max-Age: 86400
// 24 horas - evita preflight OPTIONS repetidos
```

#### Headers de Segurança

**Strict-Transport-Security (HSTS):** Força HTTPS
```javascript
Strict-Transport-Security: max-age=31536000; includeSubDomains
// Por 1 ano, sempre use HTTPS (inclusive subdomínios)
```

**Content-Security-Policy (CSP):** Previne XSS
```javascript
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.com
// Scripts apenas do próprio domínio ou trusted.com
```

**X-Content-Type-Options:** Previne MIME sniffing
```javascript
X-Content-Type-Options: nosniff
// Navegador deve respeitar Content-Type declarado
```

**X-Frame-Options:** Previne clickjacking
```javascript
X-Frame-Options: DENY
// Não pode ser carregado em iframe

X-Frame-Options: SAMEORIGIN
// Pode ser carregado em iframe do mesmo domínio
```

---

## 🔍 Análise Conceitual Profunda

### Métodos HTTP e REST

REST (Representational State Transfer) é uma arquitetura que **aproveita semântica HTTP** para criar APIs expressivas.

**Mapeamento CRUD para HTTP:**
- **Create** → POST
- **Read** → GET
- **Update** → PUT (completo) ou PATCH (parcial)
- **Delete** → DELETE

**Exemplo de API RESTful:**
```javascript
// Coleção de usuários
GET    /usuarios           // Listar todos
POST   /usuarios           // Criar novo
GET    /usuarios/123       // Buscar específico
PUT    /usuarios/123       // Substituir
PATCH  /usuarios/123       // Atualizar parcialmente
DELETE /usuarios/123       // Remover

// Recurso aninhado
GET    /usuarios/123/posts // Posts do usuário 123
POST   /usuarios/123/posts // Criar post para usuário 123
```

**Vantagem:** URLs são **substantivos** (recursos), métodos são **verbos** (ações). Isso elimina necessidade de URLs como `/getUser`, `/createUser`, `/deleteUser`.

### Status Codes e Tratamento de Erros

**Filosofia de uso:**
- **2xx:** Use livremente para sucesso. 200 é default, 201 para criação, 204 quando não há corpo.
- **4xx:** Use para erros **culpa do cliente**. Requisição foi entendida, mas é inválida.
- **5xx:** Use para erros **culpa do servidor**. Bug, indisponibilidade, etc.

**Padrão de tratamento:**
```javascript
axios.get('/usuarios')
  .then(response => {
    // 2xx - sucesso
    console.log(response.data);
  })
  .catch(error => {
    if (error.response) {
      // Servidor respondeu com erro
      const status = error.response.status;
      
      if (status >= 400 && status < 500) {
        // Erro do cliente
        if (status === 401) {
          // Redirecionar para login
          window.location.href = '/login';
        } else if (status === 404) {
          console.log('Recurso não encontrado');
        } else {
          console.log('Requisição inválida:', error.response.data);
        }
      } else if (status >= 500) {
        // Erro do servidor
        console.error('Erro no servidor. Tente novamente mais tarde.');
      }
    } else if (error.request) {
      // Requisição foi enviada mas sem resposta
      console.error('Sem resposta do servidor (problema de rede)');
    } else {
      // Erro ao configurar requisição
      console.error('Erro:', error.message);
    }
  });
```

### Headers e Negociação de Conteúdo

**Content Negotiation:** Cliente e servidor negociam formato de dados via headers.

**Cliente solicita JSON:**
```javascript
axios.get('/dados', {
  headers: { 'Accept': 'application/json' }
});
```

**Servidor pode responder:**
```javascript
Content-Type: application/json
{ "nome": "João" }

// Ou, se não suporta JSON
Status: 406 Not Acceptable
```

**Quality Values:** Cliente pode especificar preferências:
```javascript
Accept: application/json, application/xml;q=0.9, text/html;q=0.8
```
Significa: "Prefiro JSON (q=1.0 implícito), mas aceito XML (q=0.9) ou HTML (q=0.8)".

### CORS: Headers de Cross-Origin

**Problema:** Por segurança, navegadores bloqueiam requisições JavaScript de `https://frontend.com` para `https://api.example.com` (origens diferentes).

**Solução:** Servidor `api.example.com` deve enviar headers permitindo:

```javascript
// Resposta do servidor
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Preflight:** Para requisições "não-simples" (métodos além de GET/POST, headers customizados), navegador faz **preflight OPTIONS:**

```javascript
// Browser automaticamente envia
OPTIONS /usuarios
Origin: https://frontend.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization

// Servidor responde
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization

// Se permitido, browser então envia requisição real
DELETE /usuarios/123
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Cada Método

**GET:**
- Buscar lista de recursos
- Buscar recurso individual
- Operações de leitura
- **Não use para:** Modificar dados, enviar dados sensíveis (aparecem na URL)

**POST:**
- Criar novo recurso
- Submeter formulários
- Operações que não se encaixam em CRUD (processar pagamento, enviar email)
- Buscas complexas (quando query params são insuficientes)

**PUT:**
- Substituir recurso completamente quando você tem **todos os dados**
- Operações idempotentes de atualização

**PATCH:**
- Atualizar **apenas alguns campos** de um recurso
- Edição parcial de formulários

**DELETE:**
- Remover recursos
- **Idempotente:** Safe para retry

### Quando Usar Cada Status Code

**200 vs 201:**
- **200:** Operação genérica bem-sucedida
- **201:** Criação de recurso (inclua `Location` header)

**400 vs 422:**
- **400:** Erro de sintaxe/formato (JSON inválido, tipo errado)
- **422:** Validação de regras de negócio (email duplicado, idade negativa)

**401 vs 403:**
- **401:** Não autenticado (precisa fazer login)
- **403:** Autenticado mas sem permissão (precisa de role diferente)

**404 vs 410:**
- **404:** Recurso não existe (pode nunca ter existido)
- **410 Gone:** Recurso existiu mas foi permanentemente removido

### Quando Usar Headers Específicos

**Cache-Control:**
- Use `max-age` para dados que mudam raramente (configurações, assets)
- Use `no-cache` para dados que precisam revalidação (perfil de usuário)
- Use `no-store` para dados sensíveis (transações financeiras)

**ETag:**
- Para economizar banda em recursos grandes
- Para detectar conflitos em atualizações concorrentes

**Authorization:**
- Para autenticar todas as requisições a endpoints protegidos
- Coloque em interceptor para adicionar automaticamente

---

## ⚠️ Limitações e Considerações Teóricas

### Stateless: Implicações

HTTP é **stateless** - cada requisição é independente, servidor não "lembra" requisições anteriores.

**Implicação:** Para manter sessão, você precisa:
- **Cookies:** Enviados automaticamente em cada requisição
- **Tokens (JWT):** Incluídos manualmente em header Authorization
- **Session Storage no servidor:** Cookie contém apenas ID, dados reais no servidor

**Trade-off:** Stateless simplifica escalabilidade (qualquer servidor pode processar qualquer requisição), mas requer envio de contexto em cada requisição.

### Limitações de URL em GET

URLs têm limite de tamanho (geralmente ~2000 caracteres). Para buscas complexas, use **POST:**

```javascript
// ❌ GET com query muito longa pode falhar
axios.get('/busca', {
  params: { 
    filtros: JSON.stringify(objetoCompleXoComMuitosDados)
  }
});

// ✅ POST para busca complexa
axios.post('/busca', {
  filtros: objetoCompleXoComMuitosDados
});
```

### Caching e GET

Apenas GET (e HEAD) são cacheáveis por padrão. POST, PUT, DELETE geralmente não são.

**Armadilha:** Se você usar GET para modificar dados (anti-pattern), mudanças podem ser perdidas por cache:

```javascript
// ❌ NUNCA FAÇA ISSO
axios.get('/incrementar-contador'); // Pode ser cacheado!

// ✅ Use POST para modificações
axios.post('/incrementar-contador');
```

### Idempotência e Segurança

**PUT e DELETE são idempotentes, mas não safe:**
- Podem ser retentados com segurança (não causam efeito adicional)
- Mas ainda modificam servidor (não são "somente leitura")

**POST não é idempotente:**
- Retry pode causar duplicatas
- Soluções: idempotency keys, deduplicação no servidor

---

## 🔗 Interconexões Conceituais

### HTTP e REST

REST é arquitetura que se apoia na semântica HTTP. Entender métodos e status codes profundamente é essencial para projetar APIs RESTful.

### HTTP e HTTPS

HTTPS é HTTP sobre TLS/SSL (criptografia). Mesmos métodos, status codes e headers, mas comunicação é criptografada.

**Implicação:** Headers como Authorization com Bearer tokens devem **sempre** usar HTTPS em produção (evitar interceptação).

### HTTP e Axios

Axios abstrai detalhes de HTTP, mas conhecer HTTP profundamente permite:
- Configurar headers apropriadamente
- Interpretar status codes corretamente
- Implementar cache, retry, idempotency

---

## 🚀 Evolução e Próximos Conceitos

### Próximos Passos

Após dominar HTTP, naturalmente você avançará para:

1. **Promises e Async/Await:** Como lidar com natureza assíncrona de requisições
2. **Configuração de Axios:** Usar conhecimento de headers para configurar interceptors, defaults
3. **Error Handling:** Tratar diferentes status codes apropriadamente
4. **Autenticação:** Implementar flows JWT usando headers Authorization
5. **Cache e Performance:** Usar ETag, Cache-Control para otimizar

### Conceitos Avançados

- **HTTP/2 e HTTP/3:** Multiplexação, server push
- **GraphQL:** Ainda usa HTTP (geralmente POST), mas semântica diferente
- **WebSockets:** Protocolo diferente para comunicação bidirecional
- **gRPC:** Alternativa a REST, usa HTTP/2

---

## 📚 Conclusão

HTTP é a **linguagem universal da web**. Métodos, status codes e headers formam um vocabulário rico e expressivo que permite comunicação clara entre sistemas distribuídos.

Dominar HTTP é fundamental porque:
- **Ubiquidade:** Praticamente toda aplicação web usa HTTP
- **Debugging:** Maioria dos problemas envolve entender requisições/respostas HTTP
- **API Design:** Boas APIs aproveitam semântica HTTP corretamente
- **Performance:** Cache headers, compressão, otimizações dependem de conhecer HTTP

Axios torna usar HTTP mais fácil, mas conhecimento profundo de HTTP permite usar Axios (e qualquer ferramenta HTTP) de forma mais eficaz e idiomática.
