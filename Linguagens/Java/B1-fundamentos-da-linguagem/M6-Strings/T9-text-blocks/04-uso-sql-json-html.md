# Uso de Text Blocks para SQL, JSON, HTML

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Text blocks para SQL, JSON, HTML** referem-se ao padrão moderno de embedar queries SQL, payloads JSON, e templates HTML diretamente no código Java como literais multilinhas usando sintaxe `"""`, eliminando concatenação frágil de strings, escape verboso de aspas/quebras, e desalinhamento entre estrutura do dado e representação no código. Conceitualmente, é o reconhecimento de que aplicações Java trabalham extensivamente com linguagens textuais estruturadas (SQL para dados, JSON para APIs, HTML para views) e forçar esses textos em strings de linha única ou concatenações é antipadrão - text blocks permitem copy-paste direto de editor SQL/JSON/HTML para código Java, preservando legibilidade e editabilidade.

É a mudança de paradigma: ao invés de "String Java contendo SQL" (formato forçado em limitações de sintaxe), agora é "SQL natural dentro de delimitadores Java" (formato respeitando estrutura do SQL).

### Contexto Histórico e Motivação

Antes do Java 15, code contendo SQL/JSON/HTML era notoriamente ilegível:

**SQL tradicional (pré-Java 15):**
```java
String sql = "SELECT u.id, u.nome, u.email\n" +
             "FROM usuarios u\n" +
             "JOIN categorias c ON u.categoria_id = c.id\n" +
             "WHERE u.ativo = true\n" +
             "ORDER BY u.nome";
```

**Problemas:**
- Escapar `\n` manualmente (esquecer quebra SQL inválido)
- Concatenação com `+` (esquecer fecha linha)
- Impossível validar SQL em editor SQL sem extrair/limpar
- Refatoração perigosa (mover linhas)
- Indentação SQL impossível (conflita com indentação Java)

**Motivação:** Outras linguagens já tinham solução - Python (triple quotes), JavaScript (template literals), Kotlin (raw strings). Java precisava equivalente para reduzir friction com formatos textuais ubíquos.

### Problema Fundamental que Resolve

**Problema:** SQL complexo é ilegível como String concatenada:

```java
// ANTES - ilegível e frágil
String query = "SELECT p.id, p.nome, p.preco, c.nome AS categoria\n" +
               "FROM produtos p\n" +
               "LEFT JOIN categorias c ON p.categoria_id = c.id\n" +
               "WHERE p.ativo = true\n" +
               "  AND p.preco BETWEEN ? AND ?\n" +
               "ORDER BY p.nome\n" +
               "LIMIT ?";
```

**Solução:** Text block preserva estrutura SQL:

```java
// DEPOIS - legível e manutenível
String query = """
    SELECT p.id, p.nome, p.preco, c.nome AS categoria
    FROM produtos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.ativo = true
      AND p.preco BETWEEN ? AND ?
    ORDER BY p.nome
    LIMIT ?
    """;
```

**Vantagens:**
- Visualmente idêntico a SQL em editor SQL
- Copy-paste direto entre Java e SQL editor
- Validação visual imediata (clauses alinhadas)
- Refatoração segura

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Fidelidade Estrutural:** Text block preserva estrutura visual do formato original (SQL, JSON, HTML).

2. **Zero Escapes:** Quebras naturais (sem `\n`), aspas simples livres (sem `\"`).

3. **Editabilidade:** Copy-paste bidirecional entre Java e editor especializado.

4. **Formatação Preservada:** Indentação SQL/JSON/HTML mantida, indentação Java removida automaticamente.

5. **Interpolação via formatted():** Combinar text blocks com placeholders para queries parametrizadas.

### Pilares Fundamentais

- **SQL:** Queries legíveis, prepared statements com `?`, DDL/DML embedded
- **JSON:** Payloads para APIs, configurações, test data
- **HTML:** Templates simples, emails HTML, fragments
- **Formatação:** `formatted()` ou `String.format()` para valores dinâmicos
- **Uso:** Simplificar código que trabalha com formatos textuais estruturados

---

## 🧠 Fundamentos Teóricos

### SQL com Text Blocks

#### Queries SELECT

```java
// Query simples
String queryUsuarios = """
    SELECT id, nome, email, data_cadastro
    FROM usuarios
    WHERE ativo = true
    ORDER BY nome
    """;

// Query com JOIN
String queryCompleta = """
    SELECT
        u.id,
        u.nome,
        u.email,
        c.nome AS categoria,
        COUNT(p.id) AS total_pedidos
    FROM usuarios u
    LEFT JOIN categorias c ON u.categoria_id = c.id
    LEFT JOIN pedidos p ON u.id = p.usuario_id
    WHERE u.ativo = true
      AND u.data_cadastro > ?
    GROUP BY u.id, u.nome, u.email, c.nome
    HAVING COUNT(p.id) > 0
    ORDER BY total_pedidos DESC, u.nome
    LIMIT 100
    """;
```

**Vantagens:**
- Clauses SQL visualmente separadas
- Indentação mostra hierarquia (SELECT columns, JOINs, WHERE conditions)
- Fácil adicionar/remover colunas ou condições

#### Prepared Statements

```java
String queryParametrizada = """
    SELECT *
    FROM produtos
    WHERE categoria_id = ?
      AND preco BETWEEN ? AND ?
      AND nome LIKE ?
    ORDER BY preco
    """;

try (PreparedStatement pstmt = conn.prepareStatement(queryParametrizada)) {
    pstmt.setInt(1, categoriaId);
    pstmt.setDouble(2, precoMin);
    pstmt.setDouble(3, precoMax);
    pstmt.setString(4, "%" + busca + "%");
    ResultSet rs = pstmt.executeQuery();
    // ...
}
```

#### DDL (Data Definition Language)

```java
String createTable = """
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha_hash CHAR(64) NOT NULL,
        ativo BOOLEAN DEFAULT true,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        INDEX idx_email (email),
        INDEX idx_ativo_data (ativo, data_cadastro)
    )
    """;

try (Statement stmt = conn.createStatement()) {
    stmt.execute(createTable);
}
```

#### Queries Dinâmicas com formatted()

```java
// Template com placeholders
String template = """
    SELECT *
    FROM %s
    WHERE %s = ?
    ORDER BY %s
    """;

String query = template.formatted(tabela, colunaBusca, colunaOrdem);

// Resultado exemplo:
// SELECT * FROM produtos WHERE categoria = ? ORDER BY preco
```

**⚠️ CUIDADO:** Nunca interpolar valores de usuário diretamente - use prepared statements para prevenir SQL injection!

```java
// PERIGOSO - SQL Injection!
String nome = request.getParameter("nome");  // Pode ser: '; DROP TABLE usuarios; --
String query = """
    SELECT * FROM usuarios
    WHERE nome = '%s'
    """.formatted(nome);
// NUNCA FAÇA ISSO!

// SEGURO - Prepared Statement
String query = """
    SELECT * FROM usuarios
    WHERE nome = ?
    """;
pstmt.setString(1, nome);  // Escapado automaticamente
```

---

## 🔍 Análise Conceitual Profunda

### JSON com Text Blocks

#### JSON Payloads Simples

```java
// Payload para API REST
String jsonRequest = """
    {
        "nome": "Alice Silva",
        "email": "alice@example.com",
        "idade": 30,
        "ativo": true
    }
    """;

// POST para API
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/usuarios"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(jsonRequest))
    .build();
```

#### JSON com Interpolação

```java
// Template JSON
String jsonTemplate = """
    {
        "usuario": {
            "nome": "%s",
            "email": "%s",
            "idade": %d
        },
        "timestamp": "%s",
        "acao": "%s"
    }
    """;

String json = jsonTemplate.formatted(
    nome,
    email,
    idade,
    Instant.now(),
    "cadastro"
);
```

**⚠️ NOTA:** Para JSON em produção, use biblioteca (Jackson, Gson) ao invés de String templates - garante escape correto e validação.

#### JSON Arrays

```java
String jsonArray = """
    {
        "usuarios": [
            {
                "id": 1,
                "nome": "Alice",
                "roles": ["admin", "user"]
            },
            {
                "id": 2,
                "nome": "Bob",
                "roles": ["user"]
            }
        ],
        "total": 2,
        "pagina": 1
    }
    """;
```

#### Configurações JSON

```java
String config = """
    {
        "database": {
            "host": "localhost",
            "port": 5432,
            "nome": "app_db",
            "pool": {
                "min": 5,
                "max": 20,
                "timeout": 30000
            }
        },
        "cache": {
            "habilitado": true,
            "ttl": 3600,
            "tamanho_maximo": 1000
        },
        "logs": {
            "nivel": "INFO",
            "formato": "json",
            "destinos": ["console", "arquivo", "syslog"]
        }
    }
    """;

// Parse com biblioteca
ObjectMapper mapper = new ObjectMapper();
Config configuracao = mapper.readValue(config, Config.class);
```

---

### HTML com Text Blocks

#### Templates HTML Simples

```java
String htmlTemplate = """
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>%s</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .content { background: #f4f4f4; padding: 20px; }
        </style>
    </head>
    <body>
        <h1>%s</h1>
        <div class="content">
            <p>%s</p>
        </div>
    </body>
    </html>
    """;

String paginaHTML = htmlTemplate.formatted(
    "Bem-vindo",
    "Olá, " + usuario.getNome(),
    "Seu último acesso foi em " + dataAcesso
);
```

#### Email HTML

```java
String emailHTML = """
    <html>
    <head>
        <style>
            .container {
                max-width: 600px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
            }
            .header {
                background: #4CAF50;
                color: white;
                padding: 20px;
                text-align: center;
            }
            .content {
                padding: 20px;
                background: #f9f9f9;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Bem-vindo, %s!</h1>
            </div>
            <div class="content">
                <p>Obrigado por se cadastrar em nossa plataforma.</p>
                <p>Para confirmar seu email, clique no botão abaixo:</p>
                <p style="text-align: center;">
                    <a href="%s" class="button">Confirmar Email</a>
                </p>
                <p>Se você não criou esta conta, ignore este email.</p>
            </div>
        </div>
    </body>
    </html>
    """;

String email = emailHTML.formatted(usuario.getNome(), linkConfirmacao);
```

#### HTML Fragments

```java
// Componente de card reutilizável
String cardTemplate = """
    <div class="card">
        <img src="%s" alt="%s">
        <h3>%s</h3>
        <p>%s</p>
        <a href="%s" class="btn">Ver Mais</a>
    </div>
    """;

StringBuilder cards = new StringBuilder();
for (Produto produto : produtos) {
    String card = cardTemplate.formatted(
        produto.getImagem(),
        produto.getNome(),
        produto.getNome(),
        produto.getDescricao(),
        "/produtos/" + produto.getId()
    );
    cards.append(card);
}
```

#### Tabelas HTML

```java
String tabelaTemplate = """
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
    %s
        </tbody>
    </table>
    """;

String linhaTemplate = """
            <tr>
                <td>%d</td>
                <td>%s</td>
                <td>%s</td>
                <td><span class="badge %s">%s</span></td>
            </tr>
    """;

StringBuilder linhas = new StringBuilder();
for (Usuario u : usuarios) {
    String linha = linhaTemplate.formatted(
        u.getId(),
        u.getNome(),
        u.getEmail(),
        u.isAtivo() ? "success" : "danger",
        u.isAtivo() ? "Ativo" : "Inativo"
    );
    linhas.append(linha);
}

String tabela = tabelaTemplate.formatted(linhas);
```

---

## 🎯 Aplicabilidade e Contextos

### SQL: Quando Usar Text Blocks

✅ **Use text blocks para:**

1. **Queries Complexas:**
   ```java
   String analyticsQuery = """
       SELECT
           DATE_TRUNC('day', data) AS dia,
           COUNT(*) AS total_vendas,
           SUM(valor) AS receita,
           AVG(valor) AS ticket_medio
       FROM vendas
       WHERE data BETWEEN ? AND ?
       GROUP BY DATE_TRUNC('day', data)
       ORDER BY dia
       """;
   ```

2. **DDL/Migration Scripts:**
   ```java
   String migration = """
       ALTER TABLE usuarios
       ADD COLUMN ultimo_acesso TIMESTAMP,
       ADD COLUMN tentativas_login INT DEFAULT 0,
       ADD INDEX idx_ultimo_acesso (ultimo_acesso);
       """;
   ```

3. **Views/Stored Procedures:**
   ```java
   String createView = """
       CREATE OR REPLACE VIEW vw_usuarios_ativos AS
       SELECT u.*, c.nome AS categoria
       FROM usuarios u
       JOIN categorias c ON u.categoria_id = c.id
       WHERE u.ativo = true;
       """;
   ```

❌ **Não use para:**
- Queries muito simples (uma linha): `"SELECT * FROM usuarios"`
- Valores dinâmicos - sempre use prepared statements!

### JSON: Quando Usar Text Blocks

✅ **Use para:**

1. **Test Data:**
   ```java
   @Test
   void testParseUsuario() {
       String json = """
           {"nome": "Alice", "idade": 30}
           """;
       Usuario user = mapper.readValue(json, Usuario.class);
       assertEquals("Alice", user.getNome());
   }
   ```

2. **Payloads de Exemplo/Documentação:**
   ```java
   /**
    * Exemplo de payload:
    * {
    *     "usuario": {"nome": "...", "email": "..."},
    *     "acao": "cadastro"
    * }
    */
   ```

3. **Configurações Simples:**
   ```java
   String defaultConfig = """
       {
           "timeout": 30,
           "retries": 3,
           "cache": true
       }
       """;
   ```

❌ **Não use para:**
- JSON em produção com valores dinâmicos - use Jackson/Gson
- Escape de aspas/caracteres especiais é manual (biblioteca faz automaticamente)

### HTML: Quando Usar Text Blocks

✅ **Use para:**

1. **Emails HTML:**
   ```java
   String emailTemplate = """
       <html><body>
       <h1>Olá, %s!</h1>
       <p>Sua compra foi confirmada.</p>
       </body></html>
       """;
   ```

2. **Relatórios Simples:**
   ```java
   String relatorioHTML = gerarRelatorio();
   ```

3. **Fragmentos/Componentes:**
   ```java
   String alertBox = """
       <div class="alert alert-%s">%s</div>
       """;
   ```

❌ **Não use para:**
- SPAs complexas - use framework (React, Vue, Thymeleaf)
- Templates com lógica - use template engine (Thymeleaf, Freemarker)

---

## ⚠️ Limitações e Considerações

### Segurança

#### SQL Injection

```java
// NUNCA interpolar entrada de usuário diretamente!
String nome = userInput;
String query = """
    SELECT * FROM usuarios WHERE nome = '%s'
    """.formatted(nome);  // VULNERÁVEL!

// SEMPRE use prepared statements
String query = """
    SELECT * FROM usuarios WHERE nome = ?
    """;
pstmt.setString(1, nome);  // Seguro
```

#### XSS em HTML

```java
// Entrada de usuário precisa ser escapada
String comentario = "<script>alert('XSS')</script>";

String html = """
    <div class="comment">%s</div>
    """.formatted(comentario);  // VULNERÁVEL!

// Use biblioteca para escape
String html = """
    <div class="comment">%s</div>
    """.formatted(StringEscapeUtils.escapeHtml4(comentario));  // Seguro
```

### Manutenibilidade

Para aplicações grandes:
- SQL: Considere query builders (jOOQ, Querydsl) ou ORM (Hibernate)
- JSON: Use bibliotecas de serialização (Jackson, Gson)
- HTML: Use template engines (Thymeleaf, Freemarker, JSP)

Text blocks são ótimos para casos simples e protótipos, mas aplicações complexas beneficiam de ferramentas especializadas.

---

## 📚 Conclusão

Text blocks transformam uso de SQL, JSON, HTML em Java - queries SQL legíveis, payloads JSON estruturados, templates HTML editáveis diretamente no código. Eliminam concatenação frágil, escape verboso, desalinhamento entre formato do dado e representação no código.

Dominar uso de text blocks para SQL/JSON/HTML significa:
- SQL: Queries complexas legíveis, prepared statements com `?`, DDL embedded, formatação preservada
- JSON: Test data, configurações, payloads simples - usar bibliotecas (Jackson) para produção
- HTML: Emails, relatórios, fragments - usar template engines para apps complexas
- Combinar com `formatted()` para interpolação segura (mas nunca valores de usuário!)
- Segurança: SEMPRE prepared statements para SQL, escape para HTML/JSON
- Copy-paste bidirecional entre Java e editores especializados (SQL/JSON/HTML editors)
- Manutenção: text blocks para casos simples, ferramentas especializadas para complexidade

Text blocks democratizam formatos textuais estruturados em Java - SQL deixa de ser "String incompreensível" e vira "SQL natural delimitado". É diferença entre lutar contra sintaxe Java e trabalhar naturalmente com linguagens textuais que aplicações Java invariavelmente usam.
