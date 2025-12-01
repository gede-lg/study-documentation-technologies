# Metacaracteres Básicos

## 🎯 Introdução e Definição

**Metacaracteres** são **caracteres especiais com significado específico** em expressões regulares. Diferente de caracteres literais (que representam a si mesmos), **metacaracteres têm funções**: **.** representa qualquer caractere, **^** indica início, **$** fim, **[ ]** cria classes de caracteres, **( )** cria grupos, etc. Para usar um metacaractere **literalmente**, é necessário **escapá-lo** com barra invertida (\\).

**Conceito central**: Regex tem ~12 metacaracteres principais que formam a **linguagem de padrões**. Entender cada um é fundamental para escrever expressões regulares eficazes. A confusão mais comum é **esquecer de escapar** quando se quer o caractere literal (ex: \\. para ponto literal).

**Exemplo fundamental**:
```java
// . é metacaractere (qualquer caractere)
Pattern.matches("a.c", "abc");    // true (b é qualquer char)
Pattern.matches("a.c", "a9c");    // true (9 é qualquer char)
Pattern.matches("a.c", "ac");     // false (falta um char)

// \\. é ponto literal
Pattern.matches("a\\.c", "abc");  // false (não tem ponto literal)
Pattern.matches("a\\.c", "a.c");  // true (tem ponto literal)
```

**Metacaracteres principais**:
- **. (ponto)**: qualquer caractere
- **^ (circunflexo)**: início de linha
- **$ (cifrão)**: fim de linha
- **[ ] (colchetes)**: classe de caracteres
- **( ) (parênteses)**: grupo de captura
- **| (pipe)**: alternação (OU)
- **\\ (barra invertida)**: escape
- **Quantificadores**: * + ? { }

## 📋 Fundamentos Teóricos

### 1️⃣ Ponto (.) - Qualquer Caractere

**. corresponde a qualquer caractere único (exceto newline)**:

```java
// . = qualquer char
System.out.println(Pattern.matches("a.c", "abc"));   // true
System.out.println(Pattern.matches("a.c", "a1c"));   // true
System.out.println(Pattern.matches("a.c", "a c"));   // true
System.out.println(Pattern.matches("a.c", "a@c"));   // true
System.out.println(Pattern.matches("a.c", "ac"));    // false (falta char)
System.out.println(Pattern.matches("a.c", "abcd"));  // false (1 char a mais)
```

**Múltiplos pontos**:
```java
// ... = 3 caracteres quaisquer
System.out.println(Pattern.matches("...", "abc"));   // true
System.out.println(Pattern.matches("...", "123"));   // true
System.out.println(Pattern.matches("...", "a b"));   // true
System.out.println(Pattern.matches("...", "ab"));    // false (só 2 chars)
```

**. NÃO corresponde a newline (por padrão)**:
```java
String texto = "a\nc";  // a + newline + c

Pattern pattern = Pattern.compile("a.c");
Matcher matcher = pattern.matcher(texto);
System.out.println(matcher.matches());  // false (. não pega newline)

// Com flag DOTALL - . pega newline
Pattern pattern2 = Pattern.compile("a.c", Pattern.DOTALL);
Matcher matcher2 = pattern2.matcher(texto);
System.out.println(matcher2.matches());  // true
```

**Escapar . para ponto literal**:
```java
// \\. = ponto literal
System.out.println(Pattern.matches("\\.", "."));     // true
System.out.println(Pattern.matches("\\.", "a"));     // false

// IP - precisa escapar os pontos
String ip = "192.168.1.1";
System.out.println(Pattern.matches("\\d+\\.\\d+\\.\\d+\\.\\d+", ip));  // true
```

### 2️⃣ Circunflexo (^) - Início de Linha

**^ indica início do texto/linha**:

```java
// ^ = deve começar com
Pattern pattern = Pattern.compile("^Java");

System.out.println(pattern.matcher("Java é legal").find());    // true
System.out.println(pattern.matcher("Eu uso Java").find());     // false
System.out.println(pattern.matcher("  Java").find());          // false (espaço antes)
```

**^ com MULTILINE - início de cada linha**:
```java
String texto = "linha1\nJava\nlinha3";

// Sem MULTILINE - ^ só início do texto
Pattern p1 = Pattern.compile("^Java");
System.out.println(p1.matcher(texto).find());  // false (não começa com Java)

// Com MULTILINE - ^ início de qualquer linha
Pattern p2 = Pattern.compile("^Java", Pattern.MULTILINE);
System.out.println(p2.matcher(texto).find());  // true (segunda linha começa com Java)
```

**^ em character class [^...] - NEGAÇÃO (diferente!)**:
```java
// ^ FORA de [] = início
Pattern.matches("^Java", "Java");  // true

// ^ DENTRO de [] = negação (não é isso)
Pattern.matches("[^abc]", "d");    // true (d não é a, b ou c)
Pattern.matches("[^abc]", "a");    // false (a está em abc)
```

### 3️⃣ Cifrão ($) - Fim de Linha

**$ indica fim do texto/linha**:

```java
// $ = deve terminar com
Pattern pattern = Pattern.compile("Java$");

System.out.println(pattern.matcher("Eu uso Java").find());     // true
System.out.println(pattern.matcher("Java é legal").find());    // false
System.out.println(pattern.matcher("Java  ").find());          // false (espaço depois)
```

**Validar formato completo com ^...$**:
```java
// ^...$ = texto completo deve corresponder
Pattern pattern = Pattern.compile("^\\d{3}$");

System.out.println(pattern.matcher("123").matches());    // true
System.out.println(pattern.matcher("1234").matches());   // false (4 dígitos)
System.out.println(pattern.matcher("a123").matches());   // false (letra antes)

// Equivalente a matches() sem ^$
System.out.println(Pattern.matches("\\d{3}", "123"));    // true
```

**$ com MULTILINE**:
```java
String texto = "Java\nlinha2\nlinha3";

// $ fim de qualquer linha
Pattern pattern = Pattern.compile("Java$", Pattern.MULTILINE);
System.out.println(pattern.matcher(texto).find());  // true
```

### 4️⃣ Colchetes [ ] - Classe de Caracteres

**[abc] corresponde a um caractere que seja a, b OU c**:

```java
// [abc] = a ou b ou c
System.out.println(Pattern.matches("[abc]", "a"));   // true
System.out.println(Pattern.matches("[abc]", "b"));   // true
System.out.println(Pattern.matches("[abc]", "c"));   // true
System.out.println(Pattern.matches("[abc]", "d"));   // false
System.out.println(Pattern.matches("[abc]", "ab"));  // false (é só 1 char)
```

**Ranges - [a-z], [0-9], [A-Z]**:
```java
// [a-z] = qualquer minúscula
System.out.println(Pattern.matches("[a-z]", "m"));   // true
System.out.println(Pattern.matches("[a-z]", "A"));   // false (maiúscula)

// [0-9] = qualquer dígito
System.out.println(Pattern.matches("[0-9]", "5"));   // true
System.out.println(Pattern.matches("[0-9]", "a"));   // false

// [A-Z] = qualquer maiúscula
System.out.println(Pattern.matches("[A-Z]", "M"));   // true

// Combinar ranges
System.out.println(Pattern.matches("[a-zA-Z]", "m"));  // true
System.out.println(Pattern.matches("[a-zA-Z]", "M"));  // true
System.out.println(Pattern.matches("[a-zA-Z0-9]", "5"));  // true
```

**Negação - [^abc] (NÃO seja a, b ou c)**:
```java
// [^abc] = qualquer char EXCETO a, b, c
System.out.println(Pattern.matches("[^abc]", "d"));   // true
System.out.println(Pattern.matches("[^abc]", "a"));   // false

// [^0-9] = qualquer char EXCETO dígito
System.out.println(Pattern.matches("[^0-9]", "a"));   // true
System.out.println(Pattern.matches("[^0-9]", "5"));   // false
```

**Metacaracteres literais dentro de [ ]**:
```java
// Dentro de [] alguns metacaracteres perdem significado
System.out.println(Pattern.matches("[.]", "."));     // true (. literal)
System.out.println(Pattern.matches("[(]", "("));     // true (parêntese literal)

// Mas ] precisa escape
System.out.println(Pattern.matches("[\\]]", "]"));   // true

// E - precisa escape se for range
System.out.println(Pattern.matches("[a-z]", "-"));   // false (é range)
System.out.println(Pattern.matches("[a\\-z]", "-"));  // true (- literal)
```

### 5️⃣ Parênteses ( ) - Grupos

**( ) criam grupos de captura**:

```java
Pattern pattern = Pattern.compile("(\\d{3})-(\\d{4})");
Matcher matcher = pattern.matcher("123-4567");

if (matcher.matches()) {
    System.out.println(matcher.group());   // "123-4567" (tudo)
    System.out.println(matcher.group(1));  // "123" (grupo 1)
    System.out.println(matcher.group(2));  // "4567" (grupo 2)
}
```

**Grupos para aplicar quantificadores**:
```java
// (ab)+ = "ab" uma ou mais vezes
System.out.println(Pattern.matches("(ab)+", "ab"));     // true
System.out.println(Pattern.matches("(ab)+", "abab"));   // true
System.out.println(Pattern.matches("(ab)+", "ababab")); // true
System.out.println(Pattern.matches("(ab)+", "a"));      // false

// vs ab+ (b uma ou mais vezes)
System.out.println(Pattern.matches("ab+", "ab"));       // true
System.out.println(Pattern.matches("ab+", "abbb"));     // true
System.out.println(Pattern.matches("ab+", "abab"));     // false
```

**Grupos não-capturantes (?:...)**:
```java
// (?:...) = agrupa mas NÃO captura
Pattern p1 = Pattern.compile("(\\d+)-(\\d+)");
Matcher m1 = p1.matcher("123-456");
if (m1.matches()) {
    System.out.println(m1.groupCount());  // 2 grupos
}

Pattern p2 = Pattern.compile("(?:\\d+)-(\\d+)");
Matcher m2 = p2.matcher("123-456");
if (m2.matches()) {
    System.out.println(m2.groupCount());  // 1 grupo (primeiro é não-capturante)
    System.out.println(m2.group(1));      // "456"
}
```

**Escapar parênteses para literal**:
```java
// \\( \\) = parênteses literais
System.out.println(Pattern.matches("\\(test\\)", "(test)"));  // true
```

### 6️⃣ Pipe (|) - Alternação (OU)

**| significa OU**:

```java
// cat|dog = "cat" OU "dog"
System.out.println(Pattern.matches("cat|dog", "cat"));   // true
System.out.println(Pattern.matches("cat|dog", "dog"));   // true
System.out.println(Pattern.matches("cat|dog", "bird"));  // false
```

**Múltiplas alternativas**:
```java
// Java|Python|JavaScript
Pattern pattern = Pattern.compile("Java|Python|JavaScript");

System.out.println(pattern.matcher("Java").matches());       // true
System.out.println(pattern.matcher("Python").matches());     // true
System.out.println(pattern.matcher("JavaScript").matches()); // true
System.out.println(pattern.matcher("Ruby").matches());       // false
```

**Com grupos**:
```java
// (cat|dog)s = "cats" ou "dogs"
System.out.println(Pattern.matches("(cat|dog)s", "cats"));  // true
System.out.println(Pattern.matches("(cat|dog)s", "dogs"));  // true
System.out.println(Pattern.matches("(cat|dog)s", "cat"));   // false (falta s)
```

**Escapar | para literal**:
```java
// \\| = pipe literal
System.out.println(Pattern.matches("a\\|b", "a|b"));  // true
```

### 7️⃣ Barra Invertida (\\) - Escape

**\\ escapa metacaracteres**:

```java
// Escapar . (ponto)
System.out.println(Pattern.matches("\\.", "."));     // true
System.out.println(Pattern.matches("\\.", "a"));     // false

// Escapar $ (cifrão)
System.out.println(Pattern.matches("\\$", "$"));     // true

// Escapar * (asterisco)
System.out.println(Pattern.matches("\\*", "*"));     // true

// Escapar + (mais)
System.out.println(Pattern.matches("\\+", "+"));     // true

// Escapar ? (interrogação)
System.out.println(Pattern.matches("\\?", "?"));     // true

// Escapar \\ (barra invertida)
System.out.println(Pattern.matches("\\\\", "\\"));   // true
```

**Classes predefinidas com \\**:
```java
// \\d = dígito [0-9]
System.out.println(Pattern.matches("\\d", "5"));     // true
System.out.println(Pattern.matches("\\d", "a"));     // false

// \\w = palavra [a-zA-Z0-9_]
System.out.println(Pattern.matches("\\w", "a"));     // true
System.out.println(Pattern.matches("\\w", "5"));     // true
System.out.println(Pattern.matches("\\w", "_"));     // true
System.out.println(Pattern.matches("\\w", "@"));     // false

// \\s = espaço [ \\t\\n\\r]
System.out.println(Pattern.matches("\\s", " "));     // true
System.out.println(Pattern.matches("\\s", "\t"));    // true
System.out.println(Pattern.matches("\\s", "a"));     // false
```

**Negações com maiúsculas**:
```java
// \\D = NÃO dígito
System.out.println(Pattern.matches("\\D", "a"));     // true
System.out.println(Pattern.matches("\\D", "5"));     // false

// \\W = NÃO palavra
System.out.println(Pattern.matches("\\W", "@"));     // true
System.out.println(Pattern.matches("\\W", "a"));     // false

// \\S = NÃO espaço
System.out.println(Pattern.matches("\\S", "a"));     // true
System.out.println(Pattern.matches("\\S", " "));     // false
```

### 8️⃣ Quantificadores - * + ? { }

**Asterisco (*) - zero ou mais**:

```java
// a* = zero ou mais "a"
System.out.println(Pattern.matches("a*", ""));       // true (zero)
System.out.println(Pattern.matches("a*", "a"));      // true (um)
System.out.println(Pattern.matches("a*", "aaa"));    // true (três)
System.out.println(Pattern.matches("a*", "b"));      // false
```

**Mais (+) - um ou mais**:
```java
// a+ = um ou mais "a"
System.out.println(Pattern.matches("a+", ""));       // false (zero)
System.out.println(Pattern.matches("a+", "a"));      // true (um)
System.out.println(Pattern.matches("a+", "aaa"));    // true (três)
```

**Interrogação (?) - zero ou um (opcional)**:
```java
// a? = zero ou um "a"
System.out.println(Pattern.matches("a?", ""));       // true (zero)
System.out.println(Pattern.matches("a?", "a"));      // true (um)
System.out.println(Pattern.matches("a?", "aa"));     // false (dois)
```

**Chaves { } - quantidade específica**:
```java
// {n} = exatamente n
System.out.println(Pattern.matches("a{3}", "aaa"));  // true
System.out.println(Pattern.matches("a{3}", "aa"));   // false

// {n,} = n ou mais
System.out.println(Pattern.matches("a{2,}", "aa"));  // true
System.out.println(Pattern.matches("a{2,}", "aaa")); // true
System.out.println(Pattern.matches("a{2,}", "a"));   // false

// {n,m} = entre n e m
System.out.println(Pattern.matches("a{2,4}", "aa"));   // true
System.out.println(Pattern.matches("a{2,4}", "aaa"));  // true
System.out.println(Pattern.matches("a{2,4}", "aaaa")); // true
System.out.println(Pattern.matches("a{2,4}", "a"));    // false
System.out.println(Pattern.matches("a{2,4}", "aaaaa"));// false
```

**Escapar quantificadores para literal**:
```java
// \\* = asterisco literal
System.out.println(Pattern.matches("\\*", "*"));     // true

// \\+ = mais literal
System.out.println(Pattern.matches("\\+", "+"));     // true

// \\? = interrogação literal
System.out.println(Pattern.matches("\\?", "?"));     // true

// \\{ \\} = chaves literais
System.out.println(Pattern.matches("\\{5\\}", "{5}"));  // true
```

### 9️⃣ Casos Práticos

**Validar email básico**:

```java
String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
Pattern pattern = Pattern.compile(regex);

System.out.println(pattern.matcher("user@example.com").matches());  // true
System.out.println(pattern.matcher("invalid").matches());            // false

// Explicação:
// ^              início
// [a-zA-Z0-9._%+-]+  um ou mais (letras, dígitos, ._%-+)
// @              literal @
// [a-zA-Z0-9.-]+     domínio
// \\.            literal .
// [a-zA-Z]{2,}   extensão (2+ letras)
// $              fim
```

**Validar telefone**:
```java
String regex = "^\\(\\d{2}\\) \\d{5}-\\d{4}$";
Pattern pattern = Pattern.compile(regex);

System.out.println(pattern.matcher("(11) 98765-4321").matches());  // true
System.out.println(pattern.matcher("11987654321").matches());       // false

// \\( \\) = parênteses literais
// \\d{2}  = 2 dígitos (DDD)
// espaço literal
// \\d{5}  = 5 dígitos
// - literal
// \\d{4}  = 4 dígitos
```

**Extrair URLs**:
```java
String regex = "https?://[a-zA-Z0-9.-]+\\.[a-z]{2,}";
String texto = "Visite https://example.com e http://test.org";

Pattern pattern = Pattern.compile(regex);
Matcher matcher = pattern.matcher(texto);

while (matcher.find()) {
    System.out.println(matcher.group());
}
// https://example.com
// http://test.org

// https? = "http" ou "https" (s opcional)
// ://    = literal
// [a-zA-Z0-9.-]+ = domínio
// \\.    = ponto literal
// [a-z]{2,} = extensão
```

**Validar CPF**:
```java
String regex = "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$";
Pattern pattern = Pattern.compile(regex);

System.out.println(pattern.matcher("123.456.789-00").matches());  // true
System.out.println(pattern.matcher("12345678900").matches());      // false

// \\d{3}  = 3 dígitos
// \\.     = ponto literal
// -       = hífen literal
```

### 🔟 Lista Completa de Metacaracteres

**Tabela de referência**:

| Metacaractere | Significado | Exemplo | Corresponde |
|---------------|-------------|---------|-------------|
| **.** | Qualquer char (exceto \\n) | a.c | abc, a1c, a c |
| **^** | Início de linha | ^Java | Java... |
| **$** | Fim de linha | Java$ | ...Java |
| **[ ]** | Classe de caracteres | [abc] | a, b ou c |
| **[^]** | Negação | [^abc] | qualquer exceto a, b, c |
| **-** | Range (dentro de []) | [a-z] | a até z |
| **( )** | Grupo de captura | (\\d+) | captura dígitos |
| **(?:)** | Grupo não-capturante | (?:\\d+) | agrupa sem capturar |
| **\|** | Alternação (OU) | cat\|dog | cat ou dog |
| **\\** | Escape | \\. | ponto literal |
| ***** | Zero ou mais | a* | "", a, aa, aaa... |
| **+** | Um ou mais | a+ | a, aa, aaa... |
| **?** | Zero ou um (opcional) | a? | "", a |
| **{n}** | Exatamente n | a{3} | aaa |
| **{n,}** | n ou mais | a{2,} | aa, aaa, aaaa... |
| **{n,m}** | Entre n e m | a{2,4} | aa, aaa, aaaa |
| **\\d** | Dígito [0-9] | \\d+ | 123 |
| **\\D** | Não-dígito | \\D+ | abc |
| **\\w** | Palavra [a-zA-Z0-9_] | \\w+ | var_1 |
| **\\W** | Não-palavra | \\W+ | @#$ |
| **\\s** | Espaço | \\s+ | espaços |
| **\\S** | Não-espaço | \\S+ | texto |
| **\\b** | Word boundary | \\bcat\\b | "cat" isolado |
| **\\B** | Não word boundary | \\Bcat | "concatenar" |

**Precedência de operadores**:
1. Escape (\\)
2. Grupos e classes ((), [])
3. Quantificadores (*, +, ?, {})
4. Sequência (abc)
5. Alternação (|)

## 🎯 Aplicabilidade

**1. Validação**:
```java
"^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$"  // CPF
```

**2. Extração**:
```java
"\\d+"  // Números
```

**3. Classes**:
```java
"[a-zA-Z]+"  // Letras
```

**4. Alternação**:
```java
"cat|dog|bird"  // OU
```

**5. Grupos**:
```java
"(\\d{3})-(\\d{4})"  // Captura
```

## ⚠️ Armadilhas Comuns

**1. Esquecer escape**:
```java
"."  // ❌ qualquer char
"\\."  // ✓ ponto literal
```

**2. ^ em [] = negação**:
```java
"^a"  // início
"[^a]"  // não-a
```

**3. - em [] = range**:
```java
"[a-z]"  // range
"[a\\-z]"  // literal
```

**4. . não pega \\n**:
```java
// Precisa DOTALL para . pegar newline
```

**5. Quantificadores são greedy**:
```java
"<.*>"  // Greedy (máximo)
"<.*?>"  // Reluctant (mínimo)
```

## ✅ Boas Práticas

**1. Escape metacaracteres**:
```java
"\\.", "\\$", "\\*"
```

**2. Use classes predefinidas**:
```java
"\\d" não "[0-9]"
```

**3. Documente regex**:
```java
// Valida CPF: XXX.XXX.XXX-XX
```

**4. Use ^...$ para validação**:
```java
"^\\d{3}$"  // Exatamente 3 dígitos
```

**5. Pattern.quote() para literal**:
```java
Pattern.quote(userInput)
```

## 📚 Resumo Executivo

**12 metacaracteres principais**.

**Caractere único**:
```java
.    // Qualquer char
[abc]  // a, b ou c
[^abc]  // não a, b, c
[a-z]  // range
```

**Posição**:
```java
^  // Início
$  // Fim
```

**Agrupamento**:
```java
(...)   // Grupo captura
(?:...)  // Grupo não-captura
```

**Alternação**:
```java
a|b  // a OU b
```

**Escape**:
```java
\\  // Escapar próximo
```

**Quantificadores**:
```java
*     // 0 ou mais
+     // 1 ou mais
?     // 0 ou 1
{n}   // exatamente n
{n,}  // n ou mais
{n,m}  // entre n e m
```

**Classes predefinidas**:
```java
\\d  // dígito
\\w  // palavra
\\s  // espaço
\\D \\W \\S  // negações
```

**Escape obrigatório**:
```java
\\. \\* \\+ \\? \\$ \\^ \\( \\) \\[ \\] \\{ \\} \\| \\\\
```

**Recomendação**: **Escape sempre** metacaracteres para uso literal. Use **classes predefinidas** (\\d, \\w, \\s) por clareza. Documente **regex complexos**. Teste com **casos de borda**.