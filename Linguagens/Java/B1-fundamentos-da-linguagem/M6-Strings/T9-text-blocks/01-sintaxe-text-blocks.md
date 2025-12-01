# Sintaxe de Text Blocks

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Text blocks** são literais de String multilinha introduzidos no Java 15 (2020), delimitados por tripla aspas duplas `"""`, que preservam quebras de linha e formatação do código-fonte sem necessidade de escape (`\n`) ou concatenação (`+`), permitindo escrever JSON, SQL, HTML, texto multilinha diretamente no código de forma legível e natural. Conceitualmente, text blocks reconhecem que Strings multilinhas são ubíquas (queries SQL, templates HTML, JSON payloads, mensagens de erro extensas) e sintaxe tradicional (concatenação de linhas com `+` ou escape `\n`) é verbosa, propensa a erros, e ilegível - text blocks transformam código de configuração/dados embutidos em first-class citizens com sintaxe dedicada.

É o reconhecimento de que programas modernos trabalham com múltiplos formatos textuais (JSON, XML, SQL, YAML, HTML) e forçar esses textos em Strings de linha única ou concatenações é friction desnecessário - código deve refletir estrutura natural do texto, não limitações sintáticas de literais String tradicionais.

### Contexto Histórico e Motivação

Antes do Java 15, Strings multilinhas exigiam escape verboso ou concatenação frágil:

```java
// Antes - SQL com concatenação (feio, propenso a erros)
String sql = "SELECT id, nome, email\n" +
             "FROM usuarios\n" +
             "WHERE ativo = true\n" +
             "ORDER BY nome";

// Antes - JSON com escape (ilegível)
String json = "{\n  \"nome\": \"Alice\",\n  \"idade\": 30\n}";
```

Outras linguagens já tinham syntax multilinhas - Python (triple quotes `"""text"""`), JavaScript (template literals `` `text` ``), Kotlin (raw strings `"""text"""`). Java finalmente adotou em **Java 13 (preview)**, **Java 14 (2nd preview)**, **Java 15 (GA - 2020)**.

**Motivação:** Reduzir friction para textos embutidos comuns em aplicações modernas - queries SQL, templates, JSON, configurações. Text blocks tornam código mais legível, manutenível, e menos propenso a erros de formatação.

### Problema Fundamental que Resolve

**Problema:** Sintaxe tradicional para Strings multilinhas é verbosa e frágil:

```java
// SQL tradicional - concatenação manual
String sql = "SELECT p.id, p.nome, c.categoria\n" +
             "FROM produtos p\n" +
             "JOIN categorias c ON p.categoria_id = c.id\n" +
             "WHERE p.ativo = true\n" +
             "ORDER BY p.nome";
// Problemas:
// - Esquecer \n causa SQL inválido
// - Esquecer + causa erro de compilação
// - Difícil visualizar estrutura SQL
// - Refatoração perigosa (mover linhas)
```

**Solução:** Text blocks preservam estrutura:

```java
// SQL com text block - natural e legível
String sql = """
    SELECT p.id, p.nome, c.categoria
    FROM produtos p
    JOIN categorias c ON p.categoria_id = c.id
    WHERE p.ativo = true
    ORDER BY p.nome
    """;
// Vantagens:
// - Quebras de linha automáticas
// - Formatação visual preservada
// - Refatoração segura
// - Copy-paste direto de SQL editor
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Delimitadores `"""`:** Tripla aspas duplas marcam início e fim de text block.

2. **Multilinhas Nativas:** Quebras de linha no código-fonte se tornam `\n` na String resultante.

3. **Indentação Automática:** Compilador remove indentação comum (whitespace prefix) automaticamente.

4. **Escape Simplificado:** `\"` não precisa escape (exceto em casos especiais), `\n` desnecessário.

5. **String Regular:** Text block é apenas sintaxe alternativa - produz String comum (tipo `java.lang.String`).

### Pilares Fundamentais

- **Sintaxe:** `""" conteúdo """` - tripla aspas em linhas separadas
- **Resultado:** Objeto String regular (compatível com todas APIs String)
- **Uso:** SQL, JSON, HTML, XML, texto multilinha, mensagens extensas
- **Indentação:** Automaticamente normalizada (trailing whitespace removido)
- **Escape:** `\n` automático em quebras de linha, `\"` opcional

---

## 🧠 Fundamentos Teóricos

### Sintaxe Básica

#### Formato Mínimo

```java
String texto = """
    Linha 1
    Linha 2
    """;
// Resultado: "Linha 1\nLinha 2\n"
```

**Regras:**
1. `"""` abrindo DEVE ser seguido por quebra de linha
2. Conteúdo em linhas seguintes
3. `"""` fechando define fim

#### Abertura Inválida

```java
// ERRO - não pode ter texto na mesma linha que """ abrindo
String erro = """Texto aqui
    continua
    """;
// Compilation error: illegal text block open delimiter sequence

// CORRETO - quebra de linha após """
String correto = """
    Texto aqui
    continua
    """;
```

#### Fechamento Controla Trailing Newline

```java
// """ fechando em nova linha - trailing newline incluído
String com = """
    Linha 1
    Linha 2
    """;
// Resultado: "Linha 1\nLinha 2\n" (newline final!)

// """ fechando na mesma linha - SEM trailing newline
String sem = """
    Linha 1
    Linha 2""";
// Resultado: "Linha 1\nLinha 2" (sem newline final)
```

### Princípios e Conceitos Subjacentes

#### Princípio da Preservação de Quebras de Linha

```java
String multilinhas = """
    Primeira linha
    Segunda linha
    Terceira linha
    """;

// Equivalente tradicional
String tradicional = "Primeira linha\n" +
                     "Segunda linha\n" +
                     "Terceira linha\n";

System.out.println(multilinhas.equals(tradicional));  // true
```

#### Princípio da Indentação Comum

Compilador detecta menor indentação e remove de todas linhas:

```java
String texto = """
        Linha 1     (8 espaços)
          Linha 2   (10 espaços)
        Linha 3     (8 espaços)
        """;

// Indentação mínima = 8 espaços
// Compilador remove 8 espaços de todas linhas
// Resultado:
// "Linha 1\n  Linha 2\nLinha 3\n"
//  ^0      ^2       ^0
```

**Análise:** Indentação relativa preservada (Linha 2 tem +2 espaços), absoluta removida.

#### Princípio da Posição do Delimitador de Fechamento

```java
// """ fechando à esquerda (sem indentação) - preserva toda indentação
String completo = """
        Linha 1
        Linha 2
""";
// Resultado: "        Linha 1\n        Linha 2\n" (indentação preservada!)

// """ fechando alinhado - remove indentação comum
String normalizado = """
        Linha 1
        Linha 2
        """;
// Resultado: "Linha 1\nLinha 2\n" (indentação removida)

// """ fechando mais à direita - indentação negativa (impossível!)
String invalido = """
        Linha 1
        Linha 2
            """;
// Resultado: "Linha 1\nLinha 2\n" (""" além das linhas não adiciona espaços)
```

**Regra:** Posição horizontal do `"""` fechando define indentação base a ser removida.

---

## 🔍 Análise Conceitual Profunda

### Casos de Uso Detalhados

#### Caso 1: Queries SQL

```java
// Text block - legível e manutenível
String sql = """
    SELECT
        u.id,
        u.nome,
        u.email,
        c.nome AS categoria
    FROM usuarios u
    LEFT JOIN categorias c ON u.categoria_id = c.id
    WHERE u.ativo = true
      AND u.data_cadastro > ?
    ORDER BY u.nome
    LIMIT 100
    """;

// Tradicional - difícil manter
String sqlAntigo = "SELECT u.id, u.nome, u.email, c.nome AS categoria\n" +
                   "FROM usuarios u\n" +
                   "LEFT JOIN categorias c ON u.categoria_id = c.id\n" +
                   "WHERE u.ativo = true AND u.data_cadastro > ?\n" +
                   "ORDER BY u.nome LIMIT 100";
```

#### Caso 2: JSON

```java
// Text block - estrutura clara
String json = """
    {
        "nome": "Alice",
        "idade": 30,
        "endereco": {
            "rua": "Av. Paulista",
            "numero": 1000,
            "cidade": "São Paulo"
        },
        "emails": [
            "alice@example.com",
            "alice.silva@work.com"
        ]
    }
    """;

// Tradicional - ilegível
String jsonAntigo = "{\n  \"nome\": \"Alice\",\n  \"idade\": 30,\n  " +
                    "\"endereco\": {\n    \"rua\": \"Av. Paulista\"...";
```

#### Caso 3: HTML

```java
// Text block - template limpo
String html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bem-vindo</title>
    </head>
    <body>
        <h1>Olá, %s!</h1>
        <p>Seu último acesso foi em %s.</p>
    </body>
    </html>
    """;

String pagina = String.format(html, usuario, dataAcesso);
```

#### Caso 4: Mensagens de Erro Extensas

```java
// Text block - mensagem formatada
String mensagemErro = """
    ERRO: Falha ao processar requisição

    Detalhes:
      - Código: %d
      - Mensagem: %s
      - Timestamp: %s

    Ação sugerida:
      Verifique os parâmetros e tente novamente.
      Se o problema persistir, contate o suporte.
    """;

String erro = String.format(mensagemErro, codigo, msg, timestamp);
```

#### Caso 5: Regex Complexo

```java
// Text block - regex legível (com comentários via (?#...))
String regexEmail = """
    ^[A-Za-z0-9+_.-]+    # Local part
    @                    # At symbol
    [A-Za-z0-9.-]+       # Domain
    \\.[A-Za-z]{2,}$      # TLD (note: \ precisa escape para \)
    """;

// Nota: Java regex não suporta modo verbose (x flag), então comentários não funcionam
// Mas text block ainda torna regex multilinha mais legível
```

### Controle de Indentação

#### Indentação Detectada Automaticamente

```java
public void metodo() {
    String texto = """
        Linha 1
        Linha 2
        """;
    // Indentação comum (8 espaços) removida automaticamente
    // Resultado: "Linha 1\nLinha 2\n"
}
```

#### Indentação Relativa Preservada

```java
String codigo = """
    if (condicao) {
        executar();
    }
    """;
// Resultado preserva estrutura:
// "if (condicao) {\n    executar();\n}\n"
//  ^0             ^4
```

#### Controle Manual via Posição do """

```java
// """ alinhado à esquerda - remove toda indentação
String semIndent = """
    Linha 1
    Linha 2
""";
// "Linha 1\nLinha 2\n" (sem espaços à esquerda)

// """ alinhado ao meio - remove indentação parcial
String comIndent = """
    Linha 1
    Linha 2
    """;
// "Linha 1\nLinha 2\n"

// """ mais à direita que conteúdo - não adiciona espaços
String maisADireita = """
    Linha 1
        """;
// "Linha 1\n" (não adiciona espaços além do conteúdo)
```

### Trailing Whitespace

```java
// Espaços no final de linha são PRESERVADOS (mas geralmente removidos por IDEs)
String comEspacos = """
    Linha 1   \s\s\s
    Linha 2\s
    """;
// \s = escape para espaço (Java 15+)
// Resultado: "Linha 1   \s\s\s\nLinha 2\s\n"

// Sem \s, espaços trailing podem ser removidos pelo editor
String ambiguo = """
    Linha 1
    Linha 2
    """;
// Editores modernos removem trailing whitespace ao salvar
```

**Solução:** Use `\s` explicitamente para espaços significativos:

```java
String comEspacosSignificativos = """
    Linha 1\s\s\s
    Linha 2\s
    """;
```

### Empty Lines

```java
String comLinhasVazias = """
    Linha 1

    Linha 3


    Linha 6
    """;
// Resultado: "Linha 1\n\nLinha 3\n\n\nLinha 6\n"
// Linhas vazias preservadas como \n
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Text Blocks

✅ **Use text blocks quando:**

1. **Queries SQL/HQL:**
   ```java
   String sql = """
       SELECT * FROM usuarios
       WHERE ativo = true
       """;
   ```

2. **JSON/XML/YAML:**
   ```java
   String config = """
       {
           "timeout": 30,
           "retries": 3
       }
       """;
   ```

3. **Templates HTML/Markdown:**
   ```java
   String template = """
       # Título

       Parágrafo com **negrito**.
       """;
   ```

4. **Mensagens Multilinha:**
   ```java
   String ajuda = """
       Uso: comando [opções] arquivo

       Opções:
         -v  Verbose
         -h  Ajuda
       """;
   ```

5. **Test Data:**
   ```java
   String csvData = """
       nome,idade,cidade
       Alice,30,SP
       Bob,25,RJ
       """;
   ```

### Quando NÃO Usar Text Blocks

❌ **Não use quando:**

1. **String de Linha Única:**
   ```java
   // Overkill
   String msg = """
       Mensagem curta
       """;

   // Melhor
   String msg = "Mensagem curta";
   ```

2. **Necessita Escape Complexo:**
   ```java
   // Text block com muitos escapes perde vantagem
   String complicado = """
       String dentro: \"\"\"text\"\"\"
       """;

   // Tradicional pode ser mais claro
   String tradicional = "String dentro: \"\"\"text\"\"\"";
   ```

---

## ⚠️ Limitações e Considerações

### Limitações

#### Não Suporta Interpolação

```java
// ERRO - não há interpolação de variáveis
String nome = "Alice";
String texto = """
    Olá, ${nome}!  // NÃO funciona!
    """;

// CORRETO - usar format/formatted
String texto = """
    Olá, %s!
    """.formatted(nome);  // Java 15+

// Ou String.format
String texto = String.format("""
    Olá, %s!
    """, nome);
```

#### """ Deve Estar em Linha Própria (Abertura)

```java
// ERRO
String erro = """Texto
    continua
    """;

// CORRETO
String ok = """
    Texto
    continua
    """;
```

#### Escape de """ Dentro do Texto

```java
// Precisa escape para incluir """
String textoComTriplaAspas = """
    Exemplo de text block: \"""
    conteúdo
    \"""
    """;
// Resultado: "Exemplo de text block: \"\"\"\nconteúdo\n\"\"\"\n"
```

### Performance

Text blocks são compilados para String regulares - sem overhead em runtime:

```java
// Compilado para mesma bytecode
String tb = """
    Linha 1
    Linha 2
    """;

String tradicional = "Linha 1\nLinha 2\n";

// Ambos produzem mesma String constant pool
```

---

## 🔗 Interconexões Conceituais

### Relação com String.format()

```java
// Text blocks combinam bem com formatação
String template = """
    Nome: %s
    Idade: %d
    Email: %s
    """;

String resultado = String.format(template, nome, idade, email);

// Ou método formatted() (Java 15+)
String resultado2 = template.formatted(nome, idade, email);
```

### Relação com Escape Sequences

```java
// \n desnecessário (quebra de linha automática)
String automatico = """
    Linha 1
    Linha 2
    """;

// Mas pode usar \n para linhas extras
String comEscapes = """
    Linha 1\n\nLinha 3
    """;
// Resultado: "Linha 1\n\nLinha 3\n" (3 linhas total)
```

---

## 🚀 Evolução e Próximos Conceitos

### Histórico de Versões

- **Java 13 (Sep 2019):** Preview feature
- **Java 14 (Mar 2020):** 2nd Preview (melhorias em escape)
- **Java 15 (Sep 2020):** GA (General Availability) - estável

### Método formatted() (Java 15+)

```java
// Antes
String resultado = String.format(template, args);

// Java 15+ - método de instância
String resultado = template.formatted(args);

// Útil com text blocks
String mensagem = """
    Olá, %s!
    Bem-vindo.
    """.formatted(usuario);
```

### Conceitos Relacionados

- **Indentação Automática**: stripIndent(), indent()
- **Escape Sequences**: translateEscapes()
- **String Templates (Java 21+)**: Interpolação nativa (futuro)

---

## 📚 Conclusão

Text blocks são literais de String multilinha delimitados por `"""` que preservam quebras de linha e formatação, eliminando necessidade de concatenação `+` e escape `\n`. Introduzidos no Java 15 (2020), tornam código com SQL, JSON, HTML, templates significativamente mais legível e manutenível.

Dominar sintaxe de text blocks significa:
- Usar `"""` em linha separada para abertura, conteúdo multilinha, `"""` para fechamento
- Compreender que quebras de linha no código viram `\n` automáticos na String
- Saber que posição do `"""` fechando controla indentação base removida
- Reconhecer que trailing newline depende se `"""` está em linha própria
- Combinar com `formatted()` ou `String.format()` para interpolação
- Usar `\s` para espaços trailing significativos (evita remoção por IDE)
- Aplicar em SQL, JSON, HTML, XML, mensagens extensas, test data
- Evitar para Strings de linha única (verboso sem benefício)
- Compreender que text block compila para String regular (sem overhead)

Text blocks são syntactic sugar poderoso: transformam `"linha1\n" + "linha2\n"` em código natural que reflete estrutura do texto. É diferença entre lutar contra sintaxe e trabalhar com ela - SQL fica SQL, JSON fica JSON, não concatenação frágil de linhas.
