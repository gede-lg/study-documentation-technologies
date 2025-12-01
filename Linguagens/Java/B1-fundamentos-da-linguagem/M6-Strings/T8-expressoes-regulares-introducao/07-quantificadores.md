# Quantificadores

## 🎯 Introdução e Definição

**Quantificadores** especificam **quantas vezes** um elemento deve aparecer em uma expressão regular. Existem **três tipos**: **greedy** (ganancioso - máximo possível), **reluctant** (relutante - mínimo possível) e **possessive** (possessivo - sem backtracking). A diferença crucial está em **como o motor de regex tenta encontrar correspondências** e **quando retrocede** (backtracking).

**Conceito central**: Por padrão, quantificadores são **greedy** (tentam corresponder o máximo possível). Adicionar **?** torna **reluctant** (mínimo possível). Adicionar **+** torna **possessive** (sem retrocesso). Entender a diferença é crucial para performance e precisão em regex complexos.

**Exemplo fundamental**:
```java
String html = "<b>negrito</b> e <i>itálico</i>";

// Greedy .* - máximo possível
Pattern greedy = Pattern.compile("<.*>");
Matcher m1 = greedy.matcher(html);
if (m1.find()) {
    System.out.println(m1.group());  
    // "<b>negrito</b> e <i>itálico</i>" (do primeiro < ao último >)
}

// Reluctant .*? - mínimo possível
Pattern reluctant = Pattern.compile("<.*?>");
Matcher m2 = reluctant.matcher(html);
while (m2.find()) {
    System.out.println(m2.group());
}
// "<b>"
// "</b>"
// "<i>"
// "</i>"
```

**Quantificadores disponíveis**:
- ***** (zero ou mais) - greedy
- **+** (um ou mais) - greedy
- **?** (zero ou um) - greedy
- **{n}** (exatamente n)
- **{n,}** (n ou mais)
- **{n,m}** (entre n e m)
- **Adicionar ? = reluctant**
- **Adicionar + = possessive**

## 📋 Fundamentos Teóricos

### 1️⃣ Asterisco (*) - Zero ou Mais (Greedy)

**a* corresponde a zero ou mais "a"**:

```java
// a* = "", "a", "aa", "aaa", ...
System.out.println(Pattern.matches("a*", ""));       // true (zero)
System.out.println(Pattern.matches("a*", "a"));      // true (um)
System.out.println(Pattern.matches("a*", "aa"));     // true (dois)
System.out.println(Pattern.matches("a*", "aaa"));    // true (três)
System.out.println(Pattern.matches("a*", "aaaa"));   // true (quatro)
System.out.println(Pattern.matches("a*", "b"));      // false (não é "a")
```

**Uso prático - parte opcional**:
```java
// \\d+\\.?\\d* = número com decimal opcional
Pattern pattern = Pattern.compile("\\d+\\.?\\d*");

System.out.println(pattern.matcher("123").matches());    // true (inteiro)
System.out.println(pattern.matcher("123.45").matches()); // true (decimal)
System.out.println(pattern.matcher("123.").matches());   // true (ponto sem decimais)
System.out.println(pattern.matcher(".45").matches());    // false (precisa parte inteira)

// Explicação:
// \\d+   = um ou mais dígitos (parte inteira)
// \\.?   = zero ou um ponto
// \\d*   = zero ou mais dígitos (parte decimal)
```

**Greedy - corresponde máximo**:
```java
String texto = "aaab";

Pattern pattern = Pattern.compile("a*");
Matcher matcher = pattern.matcher(texto);

if (matcher.find()) {
    System.out.println(matcher.group());  // "aaa" (máximo possível)
}
```

### 2️⃣ Mais (+) - Um ou Mais (Greedy)

**a+ corresponde a um ou mais "a"**:

```java
// a+ = "a", "aa", "aaa", ... (NÃO aceita zero)
System.out.println(Pattern.matches("a+", ""));       // false (precisa pelo menos um)
System.out.println(Pattern.matches("a+", "a"));      // true
System.out.println(Pattern.matches("a+", "aa"));     // true
System.out.println(Pattern.matches("a+", "aaa"));    // true
```

**Uso prático - extrair números**:
```java
String texto = "Tenho 25 anos e 180cm";

Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher(texto);

while (matcher.find()) {
    System.out.println(matcher.group());
}
// 25
// 180
```

**Diferença * vs +**:
```java
// a* aceita zero
System.out.println(Pattern.matches("a*b", "b"));     // true

// a+ exige pelo menos um
System.out.println(Pattern.matches("a+b", "b"));     // false
System.out.println(Pattern.matches("a+b", "ab"));    // true
System.out.println(Pattern.matches("a+b", "aaab"));  // true
```

### 3️⃣ Interrogação (?) - Zero ou Um (Greedy)

**a? corresponde a zero ou um "a"**:

```java
// a? = "" ou "a" (opcional)
System.out.println(Pattern.matches("a?", ""));       // true (zero)
System.out.println(Pattern.matches("a?", "a"));      // true (um)
System.out.println(Pattern.matches("a?", "aa"));     // false (dois é demais)
```

**Uso prático - elemento opcional**:
```java
// https? = "http" ou "https"
Pattern pattern = Pattern.compile("https?://.*");

System.out.println(pattern.matcher("http://example.com").matches());   // true
System.out.println(pattern.matcher("https://example.com").matches());  // true
System.out.println(pattern.matcher("ftp://example.com").matches());    // false
```

**Plural opcional**:
```java
// dogs? = "dog" ou "dogs"
Pattern pattern = Pattern.compile("dogs?");

System.out.println(pattern.matcher("dog").matches());   // true
System.out.println(pattern.matcher("dogs").matches());  // true
```

### 4️⃣ Chaves {n}, {n,}, {n,m} - Quantidade Específica

**{n} - exatamente n vezes**:

```java
// a{3} = exatamente 3 "a"
System.out.println(Pattern.matches("a{3}", "aa"));      // false (só 2)
System.out.println(Pattern.matches("a{3}", "aaa"));     // true (exatamente 3)
System.out.println(Pattern.matches("a{3}", "aaaa"));    // false (4 é demais)

// Telefone - \\d{3}-\\d{4}
Pattern tel = Pattern.compile("\\d{3}-\\d{4}");
System.out.println(tel.matcher("123-4567").matches());  // true
System.out.println(tel.matcher("12-4567").matches());   // false
```

**{n,} - n ou mais vezes**:
```java
// a{2,} = 2 ou mais "a"
System.out.println(Pattern.matches("a{2,}", "a"));      // false (só 1)
System.out.println(Pattern.matches("a{2,}", "aa"));     // true
System.out.println(Pattern.matches("a{2,}", "aaa"));    // true
System.out.println(Pattern.matches("a{2,}", "aaaa"));   // true

// Senha - pelo menos 8 caracteres
Pattern senha = Pattern.compile(".{8,}");
System.out.println(senha.matcher("1234567").matches());  // false (7 chars)
System.out.println(senha.matcher("12345678").matches()); // true (8 chars)
```

**{n,m} - entre n e m vezes**:
```java
// a{2,4} = 2, 3 ou 4 "a"
System.out.println(Pattern.matches("a{2,4}", "a"));      // false (só 1)
System.out.println(Pattern.matches("a{2,4}", "aa"));     // true (2)
System.out.println(Pattern.matches("a{2,4}", "aaa"));    // true (3)
System.out.println(Pattern.matches("a{2,4}", "aaaa"));   // true (4)
System.out.println(Pattern.matches("a{2,4}", "aaaaa"));  // false (5 é demais)

// CEP - \\d{5}-?\\d{3}
Pattern cep = Pattern.compile("\\d{5}-?\\d{3}");
System.out.println(cep.matcher("12345-678").matches());  // true
System.out.println(cep.matcher("12345678").matches());   // true (hífen opcional)
```

### 5️⃣ Greedy (Padrão) - Máximo Possível

**Comportamento greedy - tenta corresponder o máximo**:

```java
String texto = "aaaa";

// a+ é greedy - pega tudo que pode
Pattern pattern = Pattern.compile("a+");
Matcher matcher = pattern.matcher(texto);

if (matcher.find()) {
    System.out.println(matcher.group());  // "aaaa" (todos os 4)
}
```

**Greedy com backtracking**:
```java
String texto = "aaab";

// a+b - tenta máximo de "a" primeiro
Pattern pattern = Pattern.compile("a+b");
Matcher matcher = pattern.matcher(texto);

// Motor faz:
// 1. a+ pega "aaaa" (máximo)
// 2. Tenta "b" - falha (só tem "b" na posição 3)
// 3. Backtrack - a+ volta para "aaa"
// 4. Tenta "b" - sucesso!

if (matcher.find()) {
    System.out.println(matcher.group());  // "aaab"
}
```

**Problema com greedy - HTML tags**:
```java
String html = "<b>negrito</b> texto <i>itálico</i>";

// Greedy .* - PROBLEMA
Pattern greedy = Pattern.compile("<.*>");
Matcher m = greedy.matcher(html);

if (m.find()) {
    System.out.println(m.group());
    // "<b>negrito</b> texto <i>itálico</i>"
    // ⚠️ Pegou do primeiro < ao último >!
}
```

### 6️⃣ Reluctant (Lazy) - Mínimo Possível

**Adicionar ? após quantificador = reluctant**:

```java
// *? = zero ou mais (mínimo)
// +? = um ou mais (mínimo)
// ?? = zero ou um (mínimo)
// {n,}? = n ou mais (mínimo)
// {n,m}? = entre n e m (mínimo)
```

**Comportamento reluctant**:
```java
String texto = "aaaa";

// a+? é reluctant - pega mínimo
Pattern pattern = Pattern.compile("a+?");
Matcher matcher = pattern.matcher(texto);

while (matcher.find()) {
    System.out.println(matcher.group());
}
// a
// a
// a
// a
// (pega um "a" de cada vez)
```

**Solução para HTML tags**:
```java
String html = "<b>negrito</b> texto <i>itálico</i>";

// Reluctant .*? - CORRETO
Pattern reluctant = Pattern.compile("<.*?>");
Matcher m = reluctant.matcher(html);

while (m.find()) {
    System.out.println(m.group());
}
// <b>
// </b>
// <i>
// </i>
```

**Greedy vs Reluctant**:
```java
String texto = "aaab";

// Greedy a+ - máximo
Pattern greedy = Pattern.compile("a+");
Matcher m1 = greedy.matcher(texto);
if (m1.find()) {
    System.out.println(m1.group());  // "aaa"
}

// Reluctant a+? - mínimo
Pattern reluctant = Pattern.compile("a+?");
Matcher m2 = reluctant.matcher(texto);
if (m2.find()) {
    System.out.println(m2.group());  // "a" (só um)
}
```

**Quando usar reluctant**:
- Extrair conteúdo entre delimitadores (tags HTML, aspas, etc.)
- Evitar correspondências muito longas
- Performance em alguns casos (menos backtracking)

### 7️⃣ Possessive - Sem Backtracking

**Adicionar + após quantificador = possessive**:

```java
// *+ = zero ou mais (sem backtrack)
// ++ = um ou mais (sem backtrack)
// ?+ = zero ou um (sem backtrack)
// {n,}+ = n ou mais (sem backtrack)
// {n,m}+ = entre n e m (sem backtrack)
```

**Comportamento possessive - não retrocede**:
```java
String texto = "aaab";

// Greedy a+b - COM backtracking
Pattern greedy = Pattern.compile("a+b");
System.out.println(greedy.matcher(texto).matches());  // true

// Possessive a++b - SEM backtracking
Pattern possessive = Pattern.compile("a++b");
System.out.println(possessive.matcher(texto).matches());  // false

// Explicação possessive:
// 1. a++ pega "aaab" (tudo que pode)
// 2. Tenta "b" - falha (não sobrou nada)
// 3. NÃO retrocede - falha imediatamente
```

**Uso de possessive - performance**:
```java
// Quando sabe que não precisa de backtracking

// Greedy - pode fazer backtracking desnecessário
Pattern greedy = Pattern.compile("\\d+5");

// Possessive - sem backtracking (mais rápido se sabe que não precisa)
Pattern possessive = Pattern.compile("\\d++5");

// Se texto termina com "5", ambos funcionam
// Mas possessive falha mais rápido se não terminar com "5"
```

**Quando usar possessive**:
- Performance em regex complexos (evita backtracking)
- Quando tem certeza que backtracking não é necessário
- Combinado com lookahead/lookbehind
- ⚠️ Cuidado: pode causar falhas inesperadas

### 8️⃣ Performance e Backtracking

**Backtracking excessivo - problema de performance**:

```java
String texto = "aaaaaaaaaaaaaaaaaaaab";

// Regex catastrófico - backtracking exponencial
Pattern pattern = Pattern.compile("(a+)+b");

long inicio = System.nanoTime();
boolean match = pattern.matcher(texto).matches();
long tempo = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("Match: " + match);      // false
System.out.println("Tempo: " + tempo + "ms");  // Pode levar MUITO tempo

// Problema: (a+)+ cria backtracking exponencial
// Motor tenta todas as combinações possíveis de grupos
```

**Solução - possessive**:
```java
// Evitar backtracking desnecessário
Pattern pattern = Pattern.compile("(a++)++b");

// Ou simplificar
Pattern pattern = Pattern.compile("a+b");
```

**Benchmark - greedy vs reluctant vs possessive**:
```java
String texto = "a".repeat(1000) + "b";
int n = 10000;

// Greedy
Pattern greedy = Pattern.compile("a+b");
long inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    greedy.matcher(texto).matches();
}
long t1 = (System.nanoTime() - inicio) / 1_000_000;

// Reluctant
Pattern reluctant = Pattern.compile("a+?b");
inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    reluctant.matcher(texto).matches();
}
long t2 = (System.nanoTime() - inicio) / 1_000_000;

// Possessive
Pattern possessive = Pattern.compile("a++b");
inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    possessive.matcher(texto).matches();
}
long t3 = (System.nanoTime() - inicio) / 1_000_000;

// Resultados típicos:
// Greedy: ~50ms (backtracking moderado)
// Reluctant: ~60ms (mais steps para encontrar)
// Possessive: ~30ms (sem backtracking)
```

### 9️⃣ Casos de Uso Práticos

**Validar telefone com DDD opcional**:

```java
// \\(?\\d{2}\\)?\\s?\\d{5}-?\\d{4}
Pattern pattern = Pattern.compile("\\(?\\d{2}\\)?\\s?\\d{5}-?\\d{4}");

System.out.println(pattern.matcher("11987654321").matches());      // true
System.out.println(pattern.matcher("(11) 98765-4321").matches());  // true
System.out.println(pattern.matcher("(11)98765-4321").matches());   // true
System.out.println(pattern.matcher("1198765-4321").matches());     // true

// \\(? = parêntese opcional
// \\d{2} = 2 dígitos (DDD)
// \\)? = parêntese opcional
// \\s? = espaço opcional
// \\d{5} = 5 dígitos
// -? = hífen opcional
// \\d{4} = 4 dígitos
```

**Extrair conteúdo entre aspas**:
```java
String texto = "Ele disse \"olá\" e \"tchau\"";

// Greedy - ERRADO
Pattern greedy = Pattern.compile("\".*\"");
Matcher m1 = greedy.matcher(texto);
if (m1.find()) {
    System.out.println(m1.group());  // "olá" e "tchau" (tudo entre primeira e última aspas)
}

// Reluctant - CORRETO
Pattern reluctant = Pattern.compile("\".*?\"");
Matcher m2 = reluctant.matcher(texto);
while (m2.find()) {
    System.out.println(m2.group());
}
// "olá"
// "tchau"
```

**Validar senha forte**:
```java
// Pelo menos 8 caracteres, uma maiúscula, uma minúscula, um dígito
String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";
Pattern pattern = Pattern.compile(regex);

System.out.println(pattern.matcher("Senha123").matches());   // true
System.out.println(pattern.matcher("senha123").matches());   // false (sem maiúscula)
System.out.println(pattern.matcher("SENHA123").matches());   // false (sem minúscula)
System.out.println(pattern.matcher("Senha").matches());      // false (menos de 8)

// .{8,} = pelo menos 8 caracteres (qualquer)
```

**Parsing de log com timestamp**:
```java
String log = "[2024-01-15 10:30:45] INFO: Sistema iniciado";

// \\[.*?\\] = conteúdo entre colchetes (reluctant)
Pattern pattern = Pattern.compile("\\[(.*?)\\]\\s+(\\w+):\\s+(.+)");
Matcher matcher = pattern.matcher(log);

if (matcher.matches()) {
    String timestamp = matcher.group(1);  // "2024-01-15 10:30:45"
    String nivel = matcher.group(2);      // "INFO"
    String mensagem = matcher.group(3);   // "Sistema iniciado"
    
    System.out.println("Timestamp: " + timestamp);
    System.out.println("Nível: " + nivel);
    System.out.println("Mensagem: " + mensagem);
}
```

### 🔟 Resumo Comparativo

**Tabela de quantificadores**:

| Quantificador | Greedy | Reluctant | Possessive | Significado |
|---------------|--------|-----------|------------|-------------|
| ***** | * | *? | *+ | Zero ou mais |
| **+** | + | +? | ++ | Um ou mais |
| **?** | ? | ?? | ?+ | Zero ou um |
| **{n}** | {n} | - | - | Exatamente n |
| **{n,}** | {n,} | {n,}? | {n,}+ | n ou mais |
| **{n,m}** | {n,m} | {n,m}? | {n,m}+ | Entre n e m |

**Diferenças de comportamento**:

| Tipo | Tenta | Backtracking | Uso |
|------|-------|--------------|-----|
| **Greedy** | Máximo | Sim | Padrão |
| **Reluctant** | Mínimo | Sim | Tags, delimitadores |
| **Possessive** | Máximo | Não | Performance |

## 🎯 Aplicabilidade

**1. Quantidade exata**:
```java
"\\d{3}-\\d{4}"  // XXX-XXXX
```

**2. Opcionais**:
```java
"https?"  // http ou https
```

**3. Pelo menos n**:
```java
".{8,}"  // Mínimo 8 chars
```

**4. Entre delimitadores**:
```java
"\".*?\""  // Entre aspas (reluctant)
```

**5. Performance**:
```java
"\\d++5"  // Possessive (sem backtrack)
```

## ⚠️ Armadilhas Comuns

**1. Greedy em tags HTML**:
```java
"<.*>"  // ❌ pega tudo
"<.*?>"  // ✓ cada tag
```

**2. Backtracking catastrófico**:
```java
"(a+)+b"  // ❌ exponencial
"a+b"  // ✓ simplificar
```

**3. Confundir {n} e {n,}**:
```java
"{3}"  // exatamente 3
"{3,}"  // 3 ou mais
```

**4. Esquecer escape**:
```java
"a{3}"  // quantificador
"a\\{3\\}"  // literal "{3}"
```

**5. Possessive quebra**:
```java
"a++b"  // Pode falhar inesperadamente
```

## ✅ Boas Práticas

**1. Use {n} quando souber**:
```java
"\\d{11}"  // CPF sem formatação
```

**2. Reluctant para delimitadores**:
```java
"\".*?\""  // Entre aspas
```

**3. Evite backtracking excessivo**:
```java
"(a+)+b"  // ❌ ruim
"a+b"  // ✓ melhor
```

**4. Possessive com cuidado**:
```java
// Só se tiver certeza
"\\d++5"
```

**5. Documente quantificadores**:
```java
".{8,}"  // Mínimo 8 caracteres
```

## 📚 Resumo Executivo

**Três tipos de quantificadores**.

**Básicos**:
```java
*  // 0 ou mais
+  // 1 ou mais
?  // 0 ou 1
{n}  // exatamente n
{n,}  // n ou mais
{n,m}  // entre n e m
```

**Greedy (padrão)**:
```java
a*  // Máximo possível (com backtrack)
```

**Reluctant**:
```java
a*?  // Mínimo possível (com backtrack)
```

**Possessive**:
```java
a*+  // Máximo possível (SEM backtrack)
```

**Quando usar**:
```java
// Greedy - padrão, maioria dos casos
"\\d+"

// Reluctant - entre delimitadores
"\".*?\""

// Possessive - performance crítica
"\\d++5"
```

**Backtracking**:
```java
// ❌ Catastrófico
"(a+)+"

// ✓ Simplificar
"a+"
```

**Exemplos práticos**:
```java
"\\d{11}"  // CPF: 11 dígitos
"https?"  // http ou https (s opcional)
".{8,}"  // Senha: mínimo 8 chars
"<.*?>"  // Tags HTML (reluctant)
```

**Recomendação**: Use **greedy** por padrão. Use **reluctant** (? após quantificador) para conteúdo entre delimitadores. Use **possessive** (+ após quantificador) com cuidado para performance. Evite **backtracking catastrófico** simplificando regex. Prefira **{n}** quando souber quantidade exata.