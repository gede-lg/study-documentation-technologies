# Métodos stripIndent() e translateEscapes()

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**`stripIndent()`** e **`translateEscapes()`** são métodos de instância da classe String (Java 12+) que aplicam transformações específicas: `stripIndent()` remove prefixo comum de whitespace de todas as linhas (dedenting automático), e `translateEscapes()` processa sequências de escape (`\n`, `\t`, `\uXXXX`) convertendo representações textuais para caracteres reais. Conceitualmente, são os "poderes" por trás de text blocks - text blocks aplicam **ambos** automaticamente durante compilação, mas os métodos também estão disponíveis para Strings regulares, permitindo processar strings multilinhas de fontes externas (arquivos, rede, concatenação) aplicando mesma normalização que text blocks recebem nativamente.

É o reconhecimento de que funcionalidades de text blocks (dedenting, escape processing) são úteis independentemente - string de arquivo pode precisar dedenting, string de configuração pode precisar processar `\n` literal como newline.

### Contexto Histórico e Motivação

Text blocks (Java 13-15) trouxeram dedenting automático e escape processing como features integradas. Mas e strings de outras fontes - lidas de arquivos, recebidas de APIs, concatenadas manualmente? **Java 12** introduziu `stripIndent()` e **Java 15** adicionou `translateEscapes()` como métodos públicos, permitindo aplicar transformações de text blocks a qualquer String.

**Motivação:** Desenvolvedores podem querer mesma normalização de text blocks em strings que não são text blocks - template carregado de arquivo, SQL de configuração externa, etc.

### Problema Fundamental que Resolve

**Problema 1:** String multilinha indentada no código precisa dedenting:

```java
// String tradicional indentada (não text block)
String texto = "    Linha 1\n" +
               "    Linha 2\n" +
               "    Linha 3\n";

// Tem 4 espaços indesejados à esquerda
System.out.println(texto);
// "    Linha 1
//     Linha 2
//     Linha 3"
```

**Solução:** `stripIndent()`

```java
String limpo = texto.stripIndent();
// Remove 4 espaços de todas linhas
System.out.println(limpo);
// "Linha 1
// Linha 2
// Linha 3"
```

**Problema 2:** String com escapes literais precisa processamento:

```java
// String lida de arquivo contendo escapes como texto
String raw = "Linha 1\\nLinha 2\\tIndentada";
// \\n e \\t são 2 caracteres (barra + letra), não escapes reais

System.out.println(raw);
// "Linha 1\nLinha 2\tIndentada" (escapes literais)
```

**Solução:** `translateEscapes()`

```java
String processado = raw.translateEscapes();
// Converte \\n → \n (newline real), \\t → \t (tab real)

System.out.println(processado);
// "Linha 1
// Linha 2    Indentada" (escapes processados!)
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **stripIndent():** Remove prefixo comum de whitespace (dedenting).

2. **translateEscapes():** Processa escapes textuais (`\n`, `\t`, etc) em caracteres reais.

3. **Text Blocks Aplicam Ambos:** Automaticamente durante compilação.

4. **Disponíveis para Strings Regulares:** Processar strings de qualquer fonte.

5. **Não-Destrutivos:** Retornam nova String (imutabilidade preservada).

### Pilares Fundamentais

- **stripIndent():** Detecta indentação mínima, remove de todas linhas
- **translateEscapes():** `\n` → newline, `\t` → tab, `\\` → backslash, `\uXXXX` → Unicode
- **Uso:** Normalizar strings de fontes externas (arquivos, APIs)
- **Text Blocks:** Aplicam automaticamente (stripIndent + translateEscapes)
- **Imutabilidade:** Retornam nova String, original inalterada

---

## 🧠 Fundamentos Teóricos

### stripIndent() Detalhado

#### Algoritmo

**Passo 1:** Identificar linhas significativas (não vazias)

```java
String texto = "    Linha 1\n" +
               "\n" +              // Linha vazia (ignorada)
               "      Linha 3\n" +
               "    Linha 4\n";
```

**Passo 2:** Calcular prefixo comum (menor indentação)

```java
// Linha 1: 4 espaços
// Linha 3: 6 espaços
// Linha 4: 4 espaços
// Prefixo = min(4, 6, 4) = 4 espaços
```

**Passo 3:** Remover prefixo de todas linhas

```java
String resultado = texto.stripIndent();
// "Linha 1\n\n  Linha 3\nLinha 4\n"
// Linha 1: 0 espaços (removeu 4)
// Linha 3: 2 espaços (removeu 4, sobraram 2)
// Linha 4: 0 espaços (removeu 4)
```

#### Comportamento com Linhas Vazias

```java
String comVazias = "    A\n" +
                   "        \n" +  // 8 espaços (linha "vazia")
                   "    B\n";

String resultado = comVazias.stripIndent();
// Prefixo = 4 (linhas vazias ignoradas no cálculo)
// Resultado: "A\n    \nB\n"
// Linha vazia perde 4 espaços, sobram 4
```

**Análise:** Linhas "vazias" (apenas whitespace) não afetam cálculo do prefixo, mas ainda têm whitespace removido.

#### Trailing Whitespace

```java
String comTrailing = "    Linha 1   \n" +
                     "    Linha 2\n";

String resultado = comTrailing.stripIndent();
// "Linha 1   \n" + "Linha 2\n"
// Trailing whitespace (após texto) PRESERVADO
// Leading whitespace (prefixo) REMOVIDO
```

### translateEscapes() Detalhado

#### Escapes Suportados

```java
String raw = "A\\nB\\tC\\rD\\fE\\bF\\'G\\\"H\\\\I";
String processado = raw.translateEscapes();
// A
// B    C
// D
// E
// FG"H\I

// \\n → \n (newline)
// \\t → \t (tab)
// \\r → \r (carriage return)
// \\f → \f (form feed)
// \\b → \b (backspace)
// \\' → ' (aspas simples)
// \\\" → " (aspas duplas)
// \\\\ → \ (backslash)
```

#### Escape Unicode

```java
String unicode = "Copyright: \\u00A9, Euro: \\u20AC";
String processado = unicode.translateEscapes();
// "Copyright: ©, Euro: €"

// \\uXXXX → caractere Unicode correspondente
```

#### Escape Octal

```java
String octal = "\\101\\102\\103";  // ASCII A, B, C
String processado = octal.translateEscapes();
// "ABC"

// \\DDD (1-3 dígitos octais) → caractere ASCII
```

#### Invalidos Ignorados

```java
String invalido = "A\\qB";  // \\q não é escape válido
String processado = invalido.translateEscapes();
// "A\\qB" (mantém literal)

// Escapes inválidos permanecem como texto
```

**⚠️ Nota:** Comportamento difere de text blocks (que causariam erro de compilação para escape inválido).

---

## 🔍 Análise Conceitual Profunda

### Relação com Text Blocks

#### Text Blocks Aplicam Automaticamente

```java
// Text block
String tb = """
        Linha 1\n
        Linha 2
        """;

// Equivalente manual
String manual = "    Linha 1\\n\n" +
                "    Linha 2\n";
String processado = manual.stripIndent()
                          .translateEscapes();

System.out.println(tb.equals(processado));  // true
```

**Análise:** Text blocks aplicam `stripIndent()` e depois `translateEscapes()` durante compilação.

#### Ordem Importa

```java
// Ordem correta: stripIndent ANTES translateEscapes
String s1 = raw.stripIndent().translateEscapes();

// Ordem errada
String s2 = raw.translateEscapes().stripIndent();
// Pode dar resultado diferente se escapes afetam contagem de espaços
```

**Regra:** Text blocks usam ordem: **stripIndent → translateEscapes**

### Casos de Uso Práticos

#### Caso 1: Template de Arquivo

```java
// Template carregado de arquivo
String template = Files.readString(Path.of("template.txt"));
// Conteúdo do arquivo tem indentação
// "    SELECT *\n    FROM usuarios\n    WHERE id = ?"

String normalizado = template.stripIndent();
// "SELECT *\nFROM usuarios\nWHERE id = ?"
```

#### Caso 2: JSON de Configuração

```java
// JSON lido de arquivo de configuração
String jsonRaw = """
    {
        "timeout": 30,
        "retries": 3
    }
    """;

// Se vier de fonte externa com indentação extra
String jsonNormalizado = jsonRaw.stripIndent();
```

#### Caso 3: Processar Escapes de Fonte Externa

```java
// String recebida de API com escapes literais
String mensagem = "Erro:\\nDetalhes: arquivo não encontrado\\tCódigo: 404";

String formatado = mensagem.translateEscapes();
// "Erro:
// Detalhes: arquivo não encontrado    Código: 404"
```

#### Caso 4: Migração de Código Legado

```java
// Código antigo com concatenação
String sqlAntigo = "SELECT * FROM usuarios\n" +
                   "WHERE ativo = true\n";

// Aplicar stripIndent (sem efeito, mas prepara para normalização)
String sqlNormalizado = sqlAntigo.stripIndent();

// Migrar para text block
String sqlModerno = """
    SELECT * FROM usuarios
    WHERE ativo = true
    """;

System.out.println(sqlNormalizado.equals(sqlModerno));  // true
```

### stripIndent() Avançado

#### Exemplo Complexo

```java
String complexo = "        public void metodo() {\n" +
                  "            if (condicao) {\n" +
                  "                executar();\n" +
                  "            }\n" +
                  "        }\n";

String dedented = complexo.stripIndent();
// "public void metodo() {\n    if (condicao) {\n        executar();\n    }\n}\n"
// Prefixo de 8 espaços removido, estrutura de indentação preservada
```

#### Comparação com indent()

```java
String base = "Linha 1\nLinha 2\n";

// Adicionar indentação
String indentado = base.indent(4);
// "    Linha 1\n    Linha 2\n"

// Remover indentação
String dedented = indentado.stripIndent();
// "Linha 1\nLinha 2\n"

// stripIndent() é inverso de indent() para indentação uniforme
```

### translateEscapes() Avançado

#### Múltiplos Escapes

```java
String multi = "A\\nB\\tC\\nD";
String processado = multi.translateEscapes();
// "A
// B    C
// D"

// Múltiplos escapes na mesma string processados
```

#### Escape de Escape

```java
String escapado = "A\\\\nB";  // Barra dupla + n
String processado = escapado.translateEscapes();
// "A\nB" (\\\\n → \n literal, não newline!)

// Primeiro \\\\→ \, depois mantém n
```

#### Unicode e Octais Misturados

```java
String misto = "\\101\\u0042\\103";  // Octal A, Unicode B, Octal C
String processado = misto.translateEscapes();
// "ABC"
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar stripIndent()

✅ **Use quando:**

1. **Strings de Arquivos:**
   ```java
   String sql = Files.readString(Path.of("query.sql")).stripIndent();
   ```

2. **Concatenação Manual:**
   ```java
   String texto = "    Linha 1\n" +
                  "    Linha 2\n";
   String limpo = texto.stripIndent();
   ```

3. **Normalizar Input:**
   ```java
   String template = receberDeAPI().stripIndent();
   ```

### Quando Usar translateEscapes()

✅ **Use quando:**

1. **Strings "Raw" de Configuração:**
   ```java
   String config = "path=C:\\\\Users\\\\Alice\\nlog_level=INFO";
   String processado = config.translateEscapes();
   ```

2. **Mensagens com Escapes Literais:**
   ```java
   String msg = "Erro:\\tCódigo 404\\nArquivo não encontrado";
   String formatado = msg.translateEscapes();
   ```

3. **Migração de Código:**
   ```java
   String legado = converterParaEscapesLiterais(oldCode);
   String moderno = legado.translateEscapes();
   ```

---

## ⚠️ Limitações e Considerações

### Limitações

#### stripIndent() Não Remove Trailing Newline

```java
String texto = "    Linha\n";
String dedented = texto.stripIndent();
// "Linha\n" (newline preservado)

// Para remover trailing newline também:
String semNewline = dedented.stripTrailing();
```

#### translateEscapes() Não Valida

```java
// Escape inválido não causa erro
String invalido = "A\\qB";
String processado = invalido.translateEscapes();
// "A\\qB" (mantém literal)

// Text blocks causariam erro de compilação!
```

### Performance

Ambos métodos têm custo computacional:

```java
// Em loop intenso, evitar chamadas repetidas
for (int i = 0; i < 1_000_000; i++) {
    String s = texto.stripIndent();  // Lento!
}

// Melhor: processar uma vez
String normalizado = texto.stripIndent();
for (int i = 0; i < 1_000_000; i++) {
    String s = normalizado;  // Rápido
}
```

---

## 🔗 Interconexões Conceituais

### Relação com Text Blocks

```java
// Text block internamente faz:
String tb = """
    Conteúdo\n
    """;

// Equivalente a:
String raw = "    Conteúdo\\n\n";
String processado = raw.stripIndent().translateEscapes();
```

### Relação com indent()

```java
String base = "A\nB\n";

// indent() adiciona, stripIndent() remove
String indentado = base.indent(4);      // "    A\n    B\n"
String dedented = indentado.stripIndent();  // "A\nB\n"
```

---

## 🚀 Evolução e Próximos Conceitos

### Java 12: stripIndent()

Adicionado para suportar text blocks (ainda em preview).

### Java 15: translateEscapes()

Adicionado quando text blocks se tornaram GA, expondo processamento de escapes como API pública.

---

## 📚 Conclusão

`stripIndent()` remove prefixo comum de whitespace (dedenting automático), e `translateEscapes()` processa escapes textuais (`\n`, `\t`) em caracteres reais. Text blocks aplicam ambos automaticamente, mas métodos também estão disponíveis para Strings regulares, permitindo normalizar strings de qualquer fonte.

Dominar stripIndent() e translateEscapes() significa:
- `stripIndent()`: Detecta indentação mínima, remove de todas linhas, preserva indentação relativa
- `translateEscapes()`: Converte `\\n` → \n, `\\t` → \t, `\\uXXXX` → Unicode, etc
- Text blocks aplicam automaticamente: `stripIndent()` → `translateEscapes()`
- Ordem importa: stripIndent antes translateEscapes (como text blocks fazem)
- Usar stripIndent() para strings de arquivos/APIs com indentação extra
- Usar translateEscapes() para processar escapes literais de configurações
- Ambos retornam nova String (imutabilidade preservada)
- Performance: processar uma vez, reutilizar resultado (evitar em loops)

Métodos são "poderes" de text blocks disponíveis para todas Strings - dedenting e escape processing não são exclusivos de literais multilinhas. É diferença entre features integradas (text blocks) e ferramentas standalone (métodos) que podem ser aplicadas onde necessário.
