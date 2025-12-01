# Text Blocks (Java 15+)

## 🎯 Introdução e Definição

**Text blocks** (blocos de texto) são **String literais multi-linha** introduzidos no **Java 15** que permitem escrever Strings com **múltiplas linhas** de forma **legível e natural**, sem necessidade de concatenação explícita ou caracteres de escape.

**Conceito central**: Delimitados por **"""** (três aspas duplas), text blocks preservam quebras de linha e facilitam a escrita de **SQL, JSON, HTML, XML** e outros formatos textuais, eliminando a necessidade de concatenar múltiplas Strings ou usar `\n` e `\"` repetidamente.

**Exemplo fundamental**:
```java
// ❌ Antes - String tradicional multi-linha (verboso)
String html = "<html>\n" +
              "  <body>\n" +
              "    <h1>Hello World</h1>\n" +
              "  </body>\n" +
              "</html>";

// ✓ Com text block (legível, natural)
String html = """
    <html>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
    """;

// Ambos produzem a mesma String
```

**Características principais**:
- **Delimitadores `"""`**: três aspas duplas para abrir e fechar
- **Multi-linha natural**: quebras de linha preservadas automaticamente
- **Indentação automática**: remove indentação comum (incidental whitespace)
- **Escape simplificado**: aspas duplas não precisam `\"`
- **formatted()**: interpolação tipo String.format()

## 📋 Fundamentos Teóricos

### 1️⃣ Sintaxe Básica

**Delimitadores e quebra de linha**:

```java
// ✓ CORRETO - abertura """ seguida de newline
String texto = """
    Line 1
    Line 2
    Line 3
    """;

// ❌ ERRO - conteúdo na mesma linha que abertura
// String texto = """Line 1
//     Line 2
//     """;

// ✓ Fechamento pode ter conteúdo antes
String texto2 = """
    Line 1
    Line 2""";  // Sem newline final

// ✓ Fechamento em nova linha
String texto3 = """
    Line 1
    Line 2
    """;  // Com newline final
```

**Resultado**:
```java
String s1 = """
    A
    B
    """;
System.out.println(s1);
// A
// B
//

String s2 = """
    A
    B""";
System.out.println(s2);
// A
// B
```

### 2️⃣ Indentação Incidental vs Essencial

**Indentação incidental removida**:

```java
public class Exemplo {
    void metodo() {
        String sql = """
            SELECT id, nome, idade
            FROM usuarios
            WHERE ativo = true
            ORDER BY nome
            """;
    }
}

// Resultado: indentação comum (12 espaços) removida
// SELECT id, nome, idade
// FROM usuarios
// WHERE ativo = true
// ORDER BY nome
```

**Determinação da indentação incidental**:
```java
String texto = """
        Line 1
            Line 2
        Line 3
    """;  // Fechamento determina indentação base

// Indentação incidental = 4 espaços (posição de """)
// Resultado:
//     Line 1
//         Line 2
//     Line 3
```

**Posição do fechamento controla**:
```java
// Fechamento alinhado à esquerda - remove toda indentação
String s1 = """
    A
    B
""";
// A
// B

// Fechamento indentado - preserva indentação relativa
String s2 = """
    A
    B
    """;
//     A
//     B
```

### 3️⃣ Whitespace: stripIndent() e Trailing Spaces

**stripIndent() - remoção automática**:

```java
// stripIndent() é aplicado automaticamente
String s = """
        A
        B
        """;
// Equivalente a:
String s2 = "        A\n        B\n        ".stripIndent();

// stripIndent() remove indentação comum
System.out.println(s);
// A
// B
//
```

**Espaços trailing em linhas**:
```java
// Espaços ao final de linhas SÃO REMOVIDOS automaticamente
String s = """
    A   
    B     
    """;
// Resultado: "A\nB\n" (espaços trailing removidos)

// Para preservar espaços trailing, use \s
String s2 = """
    A\s\s\s
    B\s\s\s\s\s
    """;
// Resultado: "A   \nB     \n" (preservados)
```

**Espaços importantes no meio da linha**:
```java
String s = """
    Hello    World
    """;
// Espaços internos são preservados
// Resultado: "Hello    World\n"
```

### 4️⃣ Caracteres de Escape

**Aspas duplas não precisam escape**:

```java
// String tradicional - escape necessário
String json1 = "{\"nome\": \"João\", \"idade\": 30}";

// Text block - aspas duplas naturais
String json2 = """
    {"nome": "João", "idade": 30}
    """;

// Mais legível, sem \"
```

**Outros escapes funcionam normalmente**:
```java
String s = """
    Line 1\tTab
    Line 2\nExtra newline
    """;
// Line 1	Tab
// Line 2
// Extra newline
//
```

**Escape de `"""`**:
```java
// Para incluir """ literal, use escape
String s = """
    Exemplo de \"""text block\"""
    """;
// Resultado: Exemplo de """text block"""
```

**Nova escape `\<newline>` - suprimir quebra**:
```java
// \<newline> suprime quebra de linha
String s = """
    This is a \
    long line.
    """;
// Resultado: "This is a long line.\n"

// Útil para linhas muito longas sem quebra real
String sql = """
    SELECT id, nome, email, telefone, endereco, \
    cidade, estado, cep \
    FROM usuarios
    """;
// Resultado: uma única linha longa
```

### 5️⃣ formatted() - Interpolação

**formatted() - versão text block de String.format()**:

```java
String nome = "João";
int idade = 30;

// String.format() tradicional
String msg1 = String.format("Nome: %s, Idade: %d", nome, idade);

// formatted() com text block
String msg2 = """
    Nome: %s
    Idade: %d
    """.formatted(nome, idade);

// Resultado:
// Nome: João
// Idade: 30
```

**SQL parametrizado**:
```java
String tabela = "usuarios";
String campo = "nome";
String valor = "João";

String sql = """
    SELECT *
    FROM %s
    WHERE %s = '%s'
    ORDER BY id
    """.formatted(tabela, campo, valor);

// SELECT *
// FROM usuarios
// WHERE nome = 'João'
// ORDER BY id
```

**JSON com valores dinâmicos**:
```java
String nome = "Ana";
int idade = 25;
String cidade = "São Paulo";

String json = """
    {
      "nome": "%s",
      "idade": %d,
      "cidade": "%s"
    }
    """.formatted(nome, idade, cidade);

// {
//   "nome": "Ana",
//   "idade": 25,
//   "cidade": "São Paulo"
// }
```

**Formatação avançada**:
```java
String nome = "João";
double salario = 5000.50;

String info = """
    Funcionário: %s
    Salário: R$ %,.2f
    """.formatted(nome, salario);

// Funcionário: João
// Salário: R$ 5.000,50
```

### 6️⃣ Casos de Uso: SQL

**Query multi-linha legível**:

```java
// ❌ Antes - String tradicional (ilegível)
String sql = "SELECT u.id, u.nome, u.email, c.nome AS cidade\n" +
             "FROM usuarios u\n" +
             "INNER JOIN cidades c ON u.cidade_id = c.id\n" +
             "WHERE u.ativo = true\n" +
             "  AND u.idade >= 18\n" +
             "ORDER BY u.nome";

// ✓ Com text block (legível como SQL real)
String sql = """
    SELECT u.id, u.nome, u.email, c.nome AS cidade
    FROM usuarios u
    INNER JOIN cidades c ON u.cidade_id = c.id
    WHERE u.ativo = true
      AND u.idade >= 18
    ORDER BY u.nome
    """;
```

**DDL - CREATE TABLE**:
```java
String ddl = """
    CREATE TABLE produtos (
        id BIGSERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        estoque INTEGER DEFAULT 0,
        ativo BOOLEAN DEFAULT true,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """;
```

**Query complexa com CTEs**:
```java
String sql = """
    WITH vendas_mensais AS (
        SELECT 
            DATE_TRUNC('month', data_venda) AS mes,
            SUM(valor_total) AS total
        FROM vendas
        WHERE data_venda >= '2024-01-01'
        GROUP BY mes
    )
    SELECT 
        mes,
        total,
        LAG(total) OVER (ORDER BY mes) AS total_anterior,
        total - LAG(total) OVER (ORDER BY mes) AS variacao
    FROM vendas_mensais
    ORDER BY mes DESC
    """;
```

### 7️⃣ Casos de Uso: JSON

**JSON estruturado**:

```java
String nome = "João";
int idade = 30;
String[] hobbies = {"Programação", "Leitura", "Música"};

String json = """
    {
      "nome": "%s",
      "idade": %d,
      "ativo": true,
      "hobbies": [
        "%s",
        "%s",
        "%s"
      ],
      "endereco": {
        "cidade": "São Paulo",
        "estado": "SP"
      }
    }
    """.formatted(nome, idade, hobbies[0], hobbies[1], hobbies[2]);
```

**Array de objetos JSON**:
```java
List<Pessoa> pessoas = getPessoas();
StringBuilder json = new StringBuilder("[\n");

for (int i = 0; i < pessoas.size(); i++) {
    Pessoa p = pessoas.get(i);
    String objeto = """
          {
            "nome": "%s",
            "idade": %d
          }""".formatted(p.getNome(), p.getIdade());
    
    json.append(objeto);
    if (i < pessoas.size() - 1) {
        json.append(",\n");
    }
}

json.append("\n]");
```

### 8️⃣ Casos de Uso: HTML

**Template HTML**:

```java
String titulo = "Minha Página";
String conteudo = "Bem-vindo!";

String html = """
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>%s</title>
    </head>
    <body>
        <header>
            <h1>%s</h1>
        </header>
        <main>
            <p>%s</p>
        </main>
        <footer>
            <p>&copy; 2024</p>
        </footer>
    </body>
    </html>
    """.formatted(titulo, titulo, conteudo);
```

**Email HTML**:
```java
String nomeUsuario = "João";
String linkConfirmacao = "https://exemplo.com/confirmar?token=abc123";

String emailHtml = """
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2>Olá, %s!</h2>
        <p>Obrigado por se cadastrar em nosso serviço.</p>
        <p>Para confirmar seu email, clique no botão abaixo:</p>
        <a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Confirmar Email
        </a>
        <p>Se você não solicitou este cadastro, ignore este email.</p>
        <hr>
        <small>Este é um email automático. Não responda.</small>
    </body>
    </html>
    """.formatted(nomeUsuario, linkConfirmacao);
```

### 9️⃣ Casos de Uso: XML

**Configuração XML**:

```java
String appName = "MeuApp";
String version = "1.0.0";
int port = 8080;

String xml = """
    <?xml version="1.0" encoding="UTF-8"?>
    <configuration>
        <application>
            <name>%s</name>
            <version>%s</version>
        </application>
        <server>
            <port>%d</port>
            <host>localhost</host>
        </server>
        <database>
            <driver>org.postgresql.Driver</driver>
            <url>jdbc:postgresql://localhost:5432/mydb</url>
        </database>
    </configuration>
    """.formatted(appName, version, port);
```

**SOAP request**:
```java
String usuario = "admin";
String senha = "secret";

String soapRequest = """
    <?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Header>
            <auth>
                <username>%s</username>
                <password>%s</password>
            </auth>
        </soap:Header>
        <soap:Body>
            <getUser>
                <userId>123</userId>
            </getUser>
        </soap:Body>
    </soap:Envelope>
    """.formatted(usuario, senha);
```

### 🔟 Performance e Comparação

**Performance similar a Strings tradicionais**:

```java
// String tradicional
long inicio = System.nanoTime();
String s1 = "<html>\n" +
            "  <body>\n" +
            "    <h1>Hello</h1>\n" +
            "  </body>\n" +
            "</html>";
long tempo1 = System.nanoTime() - inicio;

// Text block
inicio = System.nanoTime();
String s2 = """
    <html>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
    """;
long tempo2 = System.nanoTime() - inicio;

// Performance similar (~50-100ns)
// Text block NÃO tem overhead em runtime
// Processamento de indentação é em compile-time
```

**vs StringBuilder**:
```java
// Text block - simples e legível
String html = """
    <html>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
    """;

// StringBuilder - mais verboso
StringBuilder sb = new StringBuilder();
sb.append("<html>\n");
sb.append("  <body>\n");
sb.append("    <h1>Hello</h1>\n");
sb.append("  </body>\n");
sb.append("</html>");
String html2 = sb.toString();

// Text block é mais conciso e legível
// Performance similar
```

**Vantagens sobre concatenação tradicional**:

| Aspecto | Concatenação `+` | Text Block |
|---------|------------------|------------|
| **Legibilidade** | ❌ Verboso, difícil visualizar | ✓ Natural, WYSIWYG |
| **Escape de `"`** | ❌ `\"` necessário | ✓ Aspas naturais |
| **Newlines** | ❌ `\n` explícito | ✓ Quebras naturais |
| **Indentação** | ❌ Manual com espaços | ✓ Automática |
| **Erros** | ❌ Fácil esquecer `+` ou `\n` | ✓ Menos propenso a erros |
| **Performance** | ✓ Similar | ✓ Similar |
| **Java version** | ✓ Todas versões | ⚠️ Java 15+ |

**Quando preferir concatenação tradicional**:
```java
// Conteúdo curto - concatenação OK
String msg = "Hello " + nome;

// Multi-linha complexa - text block melhor
String html = """
    <div>
      <p>Hello %s</p>
    </div>
    """.formatted(nome);
```

## 🎯 Aplicabilidade

**1. SQL Queries**:
```java
String sql = """
    SELECT * FROM users
    WHERE active = true
    """;
```

**2. JSON**:
```java
String json = """
    {"name": "%s", "age": %d}
    """.formatted(nome, idade);
```

**3. HTML Templates**:
```java
String html = """
    <div>
      <h1>%s</h1>
    </div>
    """.formatted(titulo);
```

**4. XML**:
```java
String xml = """
    <config>
      <value>%s</value>
    </config>
    """.formatted(valor);
```

**5. Documentação/Help Text**:
```java
String help = """
    Usage: app [OPTIONS]
    Options:
      -h, --help    Show help
      -v, --version Show version
    """;
```

## ⚠️ Armadilhas Comuns

**1. Esquecer Newline Após Abertura**:
```java
// ❌ ERRO de compilação
String s = """Line 1
    Line 2""";

// ✓ CORRETO
String s = """
    Line 1
    Line 2
    """;
```

**2. Indentação Não Intencional**:
```java
String s = """
    A
        B
    """;  // B tem indentação extra (intencional)

// Se quiser mesmo nível:
String s = """
    A
    B
    """;
```

**3. Espaços Trailing Removidos**:
```java
String s = """
    A   
    """;
// Resultado: "A\n" (espaços removidos)

// Use \s para preservar
String s = """
    A\s\s\s
    """;
// Resultado: "A   \n"
```

**4. Escape Duplo Desnecessário**:
```java
// ❌ Escape desnecessário
String json = """
    {\"name\": \"João\"}
    """;

// ✓ Aspas naturais
String json = """
    {"name": "João"}
    """;
```

**5. Java < 15**:
```java
// ❌ Não compila em Java 14 ou anterior
// Text blocks requerem Java 15+
```

## ✅ Boas Práticas

**1. Use para Conteúdo Multi-Linha**:
```java
String sql = """
    SELECT ...
    FROM ...
    WHERE ...
    """;
```

**2. formatted() para Interpolação**:
```java
"""
    Name: %s
    Age: %d
    """.formatted(nome, idade);
```

**3. Posicione Fechamento para Controlar Indentação**:
```java
String s = """
    Content
    """;  // Indentação controlada por """
```

**4. Preserve Legibilidade do Código**:
```java
// Indente text block com código
class Exemplo {
    String sql = """
        SELECT *
        FROM users
        """;  // Indentação incidental removida
}
```

**5. Não Use para Strings Curtas**:
```java
// ❌ Desnecessário
String s = """
    Hello
    """;

// ✓ Use String normal
String s = "Hello";
```

## 📚 Resumo Executivo

**Text blocks** (Java 15+) para Strings multi-linha.

**Sintaxe**:
```java
String s = """
    Line 1
    Line 2
    """;
```

**Vantagens**:
```java
// ✓ Multi-linha natural (sem \n)
// ✓ Aspas duplas sem escape (sem \")
// ✓ Indentação automática
// ✓ WYSIWYG - legível como output real
```

**Indentação**:
```java
String s = """
        A
        B
    """;  // Posição de """ determina indentação base
// Resultado: "    A\n    B\n"
```

**formatted()**:
```java
"""
    Nome: %s
    Idade: %d
    """.formatted(nome, idade);
```

**Casos de uso ideais**:
```java
// SQL
"""
SELECT * FROM users
WHERE active = true
"""

// JSON
"""
{"name": "João", "age": 30}
"""

// HTML
"""
<div>
  <p>Hello</p>
</div>
"""

// XML
"""
<config>
  <value>test</value>
</config>
"""
```

**Performance**:
```java
Text block: ~50ns  (similar a String tradicional)
// Sem overhead - processamento em compile-time
```

**Requisito**:
```java
// Java 15+ obrigatório
// Java 13-14: preview feature
```

**Recomendação**: Use text blocks para **SQL, JSON, HTML, XML** e outros formatos multi-linha. Muito mais legível que concatenação com `+` ou `\n`. **Não use** para Strings curtas de uma linha.