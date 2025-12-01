# Indentação Automática em Text Blocks

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Indentação automática** em text blocks é o mecanismo pelo qual o compilador Java detecta e remove automaticamente o prefixo de whitespace comum (espaços ou tabs) de todas as linhas do bloco, preservando apenas indentação relativa, permitindo que código-fonte seja indentado consistentemente com estrutura Java (métodos, classes) sem que essa indentação estrutural seja incluída na String resultante. Conceitualmente, é a separação entre "indentação do código Java" (contextual, para legibilidade do source) e "indentação do conteúdo" (semântica, parte do texto) - text blocks inteligentemente descartam a primeira e preservam a segunda.

É o reconhecimento de que ao escrever SQL, HTML, JSON dentro de método Java indentado, queremos que código Java esteja alinhado (boa prática), mas não queremos que texto resultante herde essa indentação estrutural - SQL deve começar sem espaços à esquerda, não com 8-12 espaços herdados da posição do método.

### Contexto Histórico e Motivação

Problema clássico com strings multilinhas em linguagens tradicionais: ou código fica mal indentado (String começa na coluna 0, quebrando consistência visual), ou String herda indentação estrutural indesejada. Python resolveu com `textwrap.dedent()`, Kotlin com `trimIndent()`, Scala com `stripMargin`. Java 15 integrou dedenting automático diretamente na sintaxe de text blocks.

**Motivação:** Permitir que desenvolvedores indentem code naturally (seguindo estrutura de classes/métodos) sem poluir String com whitespace estrutural. Text block em método indentado 8 espaços deve produzir String sem esses 8 espaços.

### Problema Fundamental que Resolve

**Problema:** Código mal indentado ou String com whitespace indesejado:

```java
public String getSQL() {
    // Opção 1: Código mal indentado (coluna 0) - quebra consistência visual
String sql = """
SELECT * FROM usuarios
WHERE ativo = true
""";
    return sql;
    // Código Java indentado, text block não - feio!

    // Opção 2: Text block indentado - herda whitespace estrutural
    String sql2 = """
        SELECT * FROM usuarios
        WHERE ativo = true
        """;
    // Resultado: "        SELECT...\n        WHERE...\n" - 8 espaços indesejados!
}
```

**Solução:** Indentação automática remove prefixo comum:

```java
public String getSQL() {
    String sql = """
        SELECT * FROM usuarios
        WHERE ativo = true
        """;
    // Compilador detecta 8 espaços como prefixo comum
    // Remove automaticamente
    // Resultado: "SELECT * FROM usuarios\nWHERE ativo = true\n" - limpo!
    return sql;
}
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Detecção Automática:** Compilador identifica menor indentação (prefixo comum de whitespace).

2. **Remoção de Prefixo:** Whitespace comum é removido de todas as linhas.

3. **Preservação Relativa:** Indentação adicional (além do prefixo) é preservada.

4. **Controle via Delimitador:** Posição horizontal do `"""` fechando define indentação base.

5. **Transparente:** Desenvolvedor indenta naturalmente, compilador normaliza automaticamente.

### Pilares Fundamentais

- **Prefixo Comum:** Menor número de espaços/tabs leading em todas linhas (incluindo linha do `"""`)
- **Remoção Automática:** Prefixo comum removido sem código adicional
- **Preservação:** Indentação além do prefixo permanece na String
- **Controle:** Mover `"""` altera prefixo detectado
- **Uso:** SQL, HTML, JSON indentados no código mas limpos na String

---

## 🧠 Fundamentos Teóricos

### Algoritmo de Detecção de Indentação

#### Passo 1: Identificar Linhas Significativas

```java
String texto = """
    Linha 1     ← linha significativa (8 espaços)
                ← linha vazia (ignorada para cálculo)
      Linha 3   ← linha significativa (6 espaços)
    """;        ← delimitador (8 espaços)
```

**Regras:**
- Linhas vazias (apenas whitespace) são ignoradas
- Linha do `"""` fechando conta
- Primeira linha (após `"""` abrindo) conta

#### Passo 2: Calcular Prefixo Comum

```java
String exemplo = """
        Linha 1    (8 espaços leading)
          Linha 2  (10 espaços leading)
        Linha 3    (8 espaços leading)
        """;       (8 espaços leading)

// Prefixo comum = min(8, 10, 8, 8) = 8 espaços
```

#### Passo 3: Remover Prefixo de Todas Linhas

```java
// Antes da remoção (raw):
"        Linha 1\n"    (8 espaços)
"          Linha 2\n"  (10 espaços)
"        Linha 3\n"    (8 espaços)

// Após remover 8 espaços de cada:
"Linha 1\n"       (0 espaços)
"  Linha 2\n"     (2 espaços - indentação relativa preservada!)
"Linha 3\n"       (0 espaços)

// Resultado final:
"Linha 1\n  Linha 2\nLinha 3\n"
```

### Princípios e Conceitos Subjacentes

#### Princípio da Indentação Mínima

```java
String codigo = """
        if (x) {
            executar();
        }
        """;

// Linha 1: 8 espaços
// Linha 2: 12 espaços (8 + 4 indentação do código)
// Linha 3: 8 espaços
// """: 8 espaços
// Mínimo = 8 → remove 8 de todas

// Resultado:
"if (x) {\n    executar();\n}\n"
// Preserva estrutura do código (4 espaços de indent interno)
```

#### Princípio do Controle pelo Delimitador

Posição horizontal do `"""` fechando define indentação base:

```java
// Exemplo 1: """ alinhado com conteúdo
String exemplo1 = """
        Conteúdo
        """;
// Prefixo = 8 (min de conteúdo e """)
// Resultado: "Conteúdo\n"

// Exemplo 2: """ mais à esquerda
String exemplo2 = """
        Conteúdo
    """;
// Prefixo = 4 (""" tem 4, conteúdo 8)
// Resultado: "    Conteúdo\n" (preserva 4 espaços extras do conteúdo)

// Exemplo 3: """ na coluna 0
String exemplo3 = """
        Conteúdo
""";
// Prefixo = 0 (""" tem 0)
// Resultado: "        Conteúdo\n" (toda indentação preservada)
```

**Análise:** `"""` fechando age como "régua" - tudo à esquerda dele é descartado, tudo à direita preservado.

---

## 🔍 Análise Conceitual Profunda

### Cenários de Indentação Detalhados

#### Cenário 1: Indentação Uniforme

```java
public void metodo() {
    String texto = """
        Linha 1
        Linha 2
        Linha 3
        """;
    // Todas linhas com 8 espaços (incluindo """)
    // Prefixo = 8
    // Resultado: "Linha 1\nLinha 2\nLinha 3\n"
}
```

#### Cenário 2: Indentação Variável (Hierarquia)

```java
String html = """
    <div>
        <h1>Título</h1>
        <p>
            Parágrafo com
            múltiplas linhas.
        </p>
    </div>
    """;

// Análise:
// <div>: 4 espaços
// <h1>: 8 espaços
// <p>: 8 espaços
// Parágrafo: 12 espaços
// múltiplas: 12 espaços
// </p>: 8 espaços
// </div>: 4 espaços
// """: 4 espaços

// Prefixo comum = 4 espaços
// Após remoção:
"<div>\n    <h1>Título</h1>\n    <p>\n        Parágrafo com\n        múltiplas linhas.\n    </p>\n</div>\n"
// Hierarquia HTML preservada!
```

#### Cenário 3: Linha com Menos Indentação

```java
String misturado = """
        Linha 1    (8 espaços)
      Linha 2      (6 espaços) ← menor!
        Linha 3    (8 espaços)
        """;       (8 espaços)

// Prefixo = 6 (mínimo)
// Resultado:
"  Linha 1\nLinha 2\n  Linha 3\n"
// Linha 1 e 3 mantêm 2 espaços extras
```

#### Cenário 4: Linhas Vazias

```java
String comVazias = """
        Linha 1
                       ← linha vazia (ignorada no cálculo!)
        Linha 3
        """;

// Prefixo calculado de linhas significativas apenas
// Linha 1: 8, Linha 3: 8, """: 8
// Prefixo = 8
// Resultado: "Linha 1\n\nLinha 3\n"
// Linha vazia preservada como \n simples
```

#### Cenário 5: Tabs vs Espaços

```java
String comTabs = """
\t\tLinha 1     (2 tabs)
\t\t\tLinha 2    (3 tabs)
\t\t""";        (2 tabs)

// Prefixo = 2 tabs
// Resultado: "Linha 1\n\tLinha 2\n"
// Linha 2 preserva 1 tab extra
```

**⚠️ CUIDADO:** Misturar tabs e espaços complica cálculo - evite!

### Controle Manual de Indentação

#### Técnica 1: Posicionar """ Estrategicamente

```java
// Preservar indentação total - """ na coluna 0
String comIndent = """
        SELECT *
        FROM tabela
""";
// Prefixo = 0 (""" tem 0)
// Resultado: "        SELECT *\n        FROM tabela\n"

// Remover indentação - """ alinhado
String semIndent = """
        SELECT *
        FROM tabela
        """;
// Prefixo = 8
// Resultado: "SELECT *\nFROM tabela\n"
```

#### Técnica 2: indent() - Adicionar Indentação Programaticamente

```java
String base = """
    Linha 1
    Linha 2
    """;
// Resultado base: "Linha 1\nLinha 2\n"

String indentado = base.indent(4);
// Adiciona 4 espaços em cada linha
// Resultado: "    Linha 1\n    Linha 2\n"

String maisIndentado = base.indent(8);
// Resultado: "        Linha 1\n        Linha 2\n"

// Indent negativo - remove espaços
String desindentado = indentado.indent(-2);
// Resultado: "  Linha 1\n  Linha 2\n"
```

#### Técnica 3: stripIndent() - Remover Indentação Extra

```java
// String com indentação indesejada (de concatenação, por exemplo)
String comIndent = "    Linha 1\n    Linha 2\n";

String limpo = comIndent.stripIndent();
// Remove prefixo comum (4 espaços)
// Resultado: "Linha 1\nLinha 2\n"
```

**Nota:** Text blocks já aplicam `stripIndent()` automaticamente!

### Casos Especiais

#### Primeira Linha Vazia

```java
String primeiraVazia = """

    Conteúdo
    """;

// Primeira linha vazia conta como 0 indentação
// Prefixo = 0 (min entre linha vazia e resto)
// Resultado: "\n    Conteúdo\n"
// Indentação do conteúdo preservada!
```

#### Apenas Espaços/Tabs (Linha Aparentemente Vazia)

```java
String apenasEspacos = """
        Linha 1
            ← 8 espaços (não vazia tecnicamente!)
        Linha 3
        """;

// Linha do meio tem 8 espaços (não é \n puro)
// Prefixo = 8
// Resultado: "Linha 1\n\nLinha 3\n"
// Espaços da linha do meio removidos → vira linha vazia
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Confiar na Indentação Automática

✅ **Sempre use indentação automática para:**

1. **SQL em Métodos:**
   ```java
   public String getQuery() {
       return """
           SELECT * FROM usuarios
           WHERE ativo = true
           """;
       // Automaticamente sem whitespace leading
   }
   ```

2. **Templates HTML/JSON:**
   ```java
   String html = """
       <div>
           <h1>Título</h1>
       </div>
       """;
   // Estrutura preservada, indentação do método removida
   ```

3. **Mensagens Formatadas:**
   ```java
   void exibirAjuda() {
       System.out.println("""
           Comandos disponíveis:
             ajuda   - Mostra esta mensagem
             sair    - Encerra programa
           """);
   }
   ```

### Quando Controlar Manualmente

🔧 **Controle manual quando:**

1. **Precisar Indentação Específica:**
   ```java
   // """ na coluna 0 para preservar tudo
   String yaml = """
     chave: valor
       nested: valor2
   """;
   ```

2. **Adicionar Indentação Programaticamente:**
   ```java
   String bloco = gerarBloco().indent(nivel * 2);
   ```

---

## ⚠️ Limitações e Considerações

### Limitações

#### Tabs vs Espaços - Evitar Mistura

```java
// PROBLEMÁTICO - misto
String misto = """
\t\tLinha 1    (2 tabs)
        Linha 2    (8 espaços)
\t\t""";       (2 tabs)

// Tabs e espaços são diferentes!
// Comportamento pode ser não-intuitivo
```

**Solução:** Use apenas espaços OU apenas tabs, não misture.

#### Whitespace Invisível

```java
// Trailing whitespace pode ser removido por IDE/editor
String ambiguo = """
    Linha 1
    Linha 2
    """;
// Se linha 1 tinha trailing spaces, podem ter sido removidos ao salvar
```

**Solução:** Use `\s` para espaços explícitos:
```java
String explicito = """
    Linha 1\s\s\s
    Linha 2
    """;
```

### Performance

Indentação é resolvida em **compile-time** - zero overhead em runtime:

```java
// Compilador gera:
String s = "Linha 1\nLinha 2\n";  // String já processada no .class

// Não há código runtime fazendo stripIndent()!
```

---

## 🔗 Interconexões Conceituais

### Relação com stripIndent()

```java
// Text blocks aplicam stripIndent() automaticamente
String textBlock = """
    Conteúdo
    """;

// Equivalente a String tradicional + stripIndent()
String tradicional = "    Conteúdo\n    ".stripIndent();

System.out.println(textBlock.equals(tradicional));  // true
```

### Relação com indent()

```java
// Combinar text block com indent() para controle fino
String base = """
    SELECT *
    FROM tabela
    """;

// Adicionar indentação condicional
String indentado = condicao ? base.indent(4) : base;
```

---

## 🚀 Evolução e Próximos Conceitos

### Java 12: String Methods

- `indent(int n)`: Adiciona/remove indentação
- `stripIndent()`: Remove prefixo comum (usado por text blocks)

### Java 13-15: Text Blocks Evolution

- Java 13: Preview com indentação automática básica
- Java 14: Refinamentos em edge cases
- Java 15: GA com algoritmo final

---

## 📚 Conclusão

Indentação automática em text blocks detecta e remove prefixo comum de whitespace, permitindo código Java indentado naturalmente sem poluir String resultante. Compilador calcula menor indentação (excluindo linhas vazias), remove de todas linhas, preservando apenas indentação relativa.

Dominar indentação automática significa:
- Compreender que compilador remove automaticamente prefixo comum de whitespace
- Saber que posição do `"""` fechando controla indentação base (régua)
- Reconhecer que linhas vazias são ignoradas no cálculo do prefixo
- Usar indentação natural no código - compilador normaliza automaticamente
- Controlar manualmente via posição do `"""` (coluna 0 = preserva tudo, alinhado = remove tudo)
- Aplicar `indent(n)` para adicionar indentação programaticamente
- Evitar misturar tabs e espaços (comportamento imprevisível)
- Usar `\s` para trailing whitespace explícito (não removido por IDE)
- Compreender que processamento ocorre em compile-time (sem overhead runtime)

Indentação automática é feature central de text blocks: elimina dilema entre "código mal indentado" vs "String com whitespace indesejado". Developer indenta naturalmente seguindo estrutura Java, compilador remove indentação estrutural automaticamente, preservando apenas indentação semântica do conteúdo. É diferença entre lutar contra sintaxe e trabalhar naturalmente.
