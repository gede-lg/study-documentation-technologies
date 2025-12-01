# replace(), replaceAll() e replaceFirst() - Substituição em Strings

## 🎯 Introdução e Definição

**replace()**, **replaceAll()** e **replaceFirst()** permitem **substituir partes de uma String** por outro conteúdo. Como Strings são **imutáveis**, retornam uma **nova String** com as substituições aplicadas.

**Conceito central**: Esses métodos oferecem diferentes níveis de substituição - desde simples troca de caracteres/substrings até substituições complexas usando **expressões regulares (regex)**.

**Exemplo fundamental**:
```java
String s = "Java is great. Java is powerful.";

// replace() - substitui todas ocorrências (literal)
String r1 = s.replace("Java", "Python");
// "Python is great. Python is powerful."

// replaceAll() - substitui usando regex
String r2 = s.replaceAll("Java", "C++");
// "C++ is great. C++ is powerful."

// replaceFirst() - substitui apenas primeira ocorrência (regex)
String r3 = s.replaceFirst("Java", "Kotlin");
// "Kotlin is great. Java is powerful."

System.out.println(s);  // String original não muda!
// "Java is great. Java is powerful."
```

**Diferenças principais**:
- **replace()**: substituição literal (CharSequence), não usa regex
- **replaceAll()**: substituição com regex, todas ocorrências
- **replaceFirst()**: substituição com regex, apenas primeira ocorrência

## 📋 Fundamentos Teóricos

### 1️⃣ replace(char oldChar, char newChar)

**Substitui todas ocorrências de um caractere**:

```java
String s = "banana";

String r1 = s.replace('a', 'o');  // "bonono"
String r2 = s.replace('n', 'm');  // "bamama"
String r3 = s.replace('x', 'y');  // "banana" (sem 'x', não muda)

// Original não muda
System.out.println(s);  // "banana"
```

**Assinatura**:
```java
public String replace(char oldChar, char newChar)
// Substitui TODAS ocorrências de oldChar por newChar
// Retorna nova String (ou mesma referência se nada mudar)
```

**Comportamento se char não existe**:
```java
String s = "Test";

String r = s.replace('z', 'x');
System.out.println(r == s);  // true (mesma referência - otimização JVM)
System.out.println(r);       // "Test" (não mudou)

// JVM retorna mesma String se nenhuma substituição ocorreu
```

**Todas ocorrências substituídas**:
```java
String s = "Mississippi";

String r = s.replace('i', 'a');  // "Massassappa" (4 substituições)
String r2 = s.replace('s', 'S');  // "MiSSiSSippi" (4 substituições)
```

### 2️⃣ replace(CharSequence target, CharSequence replacement)

**Substitui todas ocorrências de substring**:

```java
String s = "Java is great. Java is powerful.";

String r1 = s.replace("Java", "Python");
// "Python is great. Python is powerful."

String r2 = s.replace("is", "IS");
// "Java IS great. Java IS powerful."

String r3 = s.replace("C++", "Rust");
// "Java is great. Java is powerful." (sem "C++", não muda)
```

**Assinatura**:
```java
public String replace(CharSequence target, CharSequence replacement)
// Parâmetros: CharSequence (String, StringBuilder, StringBuffer, etc.)
// Substitui TODAS ocorrências de target por replacement
// Substituição LITERAL (não usa regex)
```

**CharSequence - aceita múltiplos tipos**:
```java
String s = "Hello World";

// String
s.replace("World", "Java");

// StringBuilder
StringBuilder sb = new StringBuilder("Java");
s.replace("World", sb);

// StringBuffer
StringBuffer sbuf = new StringBuffer("Python");
s.replace("World", sbuf);
```

**Substituição literal - caracteres especiais não são interpretados**:
```java
String s = "Price: $100.50";

// replace() - '$' e '.' são literais
String r = s.replace("$", "R$");  // "Price: R$100.50"
String r2 = s.replace(".", ",");  // "Price: $100,50"

// NÃO precisa escapar caracteres especiais de regex
```

### 3️⃣ replaceAll(String regex, String replacement)

**Substitui usando expressões regulares**:

```java
String s = "Java123Python456C++789";

// Substituir todos os dígitos por '#'
String r1 = s.replaceAll("\\d", "#");
// "Java###Python###C++###"

// Substituir sequências de dígitos por '[NUM]'
String r2 = s.replaceAll("\\d+", "[NUM]");
// "Java[NUM]Python[NUM]C++[NUM]"

// Remover todos os dígitos
String r3 = s.replaceAll("\\d+", "");
// "JavaPythonC++"
```

**Assinatura**:
```java
public String replaceAll(String regex, String replacement)
// regex: expressão regular (padrão a buscar)
// replacement: String de substituição
// Retorna: nova String com todas ocorrências substituídas
```

**Regex - metacaracteres precisam de escape**:
```java
String s = "Price: $100.50";

// ❌ ERRO - '$' e '.' são metacaracteres regex
String r1 = s.replaceAll("$", "R$");    // Erro ($ = fim da linha em regex)
String r2 = s.replaceAll(".", ",");      // ",,,,,,,,,,,,," (. = qualquer char)

// ✓ CORRETO - escapar metacaracteres
String r3 = s.replaceAll("\\$", "R\\$"); // "Price: R$100.50"
String r4 = s.replaceAll("\\.", ",");    // "Price: $100,50"

// Para literais, use replace() (mais simples)
String r5 = s.replace("$", "R$");  // "Price: R$100.50" (sem escape)
String r6 = s.replace(".", ",");   // "Price: $100,50" (sem escape)
```

**Grupos de captura**:
```java
String s = "John Doe, Jane Smith, Bob Johnson";

// Inverter nome (Sobrenome, Nome) para (Nome Sobrenome)
String r = s.replaceAll("(\\w+) (\\w+)", "$2 $1");
// "Doe John, Smith Jane, Johnson Bob"

// $1 = primeiro grupo (\w+) - nome
// $2 = segundo grupo (\w+) - sobrenome
```

### 4️⃣ replaceFirst(String regex, String replacement)

**Substitui apenas primeira ocorrência**:

```java
String s = "Java is great. Java is powerful.";

String r1 = s.replaceFirst("Java", "Python");
// "Python is great. Java is powerful."
//  ^^^^^             ^^^^ (não substituído)

String r2 = s.replaceFirst("is", "IS");
// "Java IS great. Java is powerful."
//      ^^              ^^ (não substituído)
```

**Assinatura**:
```java
public String replaceFirst(String regex, String replacement)
// Similar a replaceAll(), mas substitui apenas a PRIMEIRA ocorrência
```

**Com regex**:
```java
String s = "Price: $100.50, Discount: $20.00";

// Substituir primeiro valor monetário
String r = s.replaceFirst("\\$\\d+\\.\\d+", "$0.00");
// "Price: $0.00, Discount: $20.00"
//         ^^^^^              ^^^^^ (não substituído)
```

**Uso prático - remover primeira palavra**:
```java
String s = "Hello World from Java";

String r = s.replaceFirst("\\w+ ", "");
// "World from Java" (removeu "Hello ")
```

### 5️⃣ Diferenças: replace vs replaceAll

**replace() - literal, replaceAll() - regex**:

```java
String s = "a.b.c.d";

// replace() - '.' é LITERAL
String r1 = s.replace(".", "-");
// "a-b-c-d" (substituiu pontos literais)

// replaceAll() - '.' é METACARACTERE (qualquer char)
String r2 = s.replaceAll(".", "-");
// "-------" (substituiu TODOS os caracteres!)

// ✓ replaceAll() com escape
String r3 = s.replaceAll("\\.", "-");
// "a-b-c-d" (agora está correto)
```

**Performance**:
```java
String s = "test test test";

// replace() - mais rápido (substituição literal)
String r1 = s.replace("test", "demo");

// replaceAll() - mais lento (compila regex)
String r2 = s.replaceAll("test", "demo");

// Benchmark:
// replace():    ~100 nanossegundos
// replaceAll(): ~1000 nanossegundos (10x mais lento)

// Use replace() para substituições literais simples
```

**Quando usar cada um**:
```java
// ✓ replace() - substituição literal simples
texto.replace("palavra", "outra");
texto.replace(".", ",");

// ✓ replaceAll() - padrões complexos com regex
texto.replaceAll("\\d+", "[NUM]");
texto.replaceAll("\\s+", " ");  // Múltiplos espaços → 1 espaço
```

### 6️⃣ Replacement String - Caracteres Especiais

**Caracteres especiais em replacement**:

```java
String s = "Hello World";

// '$' em replacement - referência a grupos
String r1 = s.replaceAll("(\\w+)", "[$1]");
// "[Hello] [World]" ($1 = grupo capturado)

// '\' em replacement - precisa escapar
String r2 = s.replaceAll("World", "Java\\\\C++");
// "Hello Java\C++" (\ precisa \\ em replacement)

// Literal '$' em replacement
String r3 = s.replaceAll("World", "\\$100");
// "Hello $100"
```

**Matcher.quoteReplacement() para literais**:
```java
String s = "Price: X";
String valor = "$100";  // Contém '$' que é especial

// ❌ ERRO - '$' será interpretado
String r1 = s.replaceAll("X", valor);  // Erro!

// ✓ CORRETO - escapar literais
String r2 = s.replaceAll("X", Matcher.quoteReplacement(valor));
// "Price: $100"
```

**Grupos de captura em replacement**:
```java
String s = "2024-11-24";

// Converter de YYYY-MM-DD para DD/MM/YYYY
String r = s.replaceAll("(\\d{4})-(\\d{2})-(\\d{2})", "$3/$2/$1");
// "24/11/2024"
// $1 = 2024, $2 = 11, $3 = 24
```

### 7️⃣ Casos de Uso Práticos

**Normalizar espaços em branco**:
```java
String s = "Java    is      great";

// Múltiplos espaços → 1 espaço
String normalizado = s.replaceAll("\\s+", " ");
// "Java is great"

// Ou usar trim() + replaceAll()
String completo = s.trim().replaceAll("\\s+", " ");
```

**Remover caracteres especiais**:
```java
String s = "Hello@#$ World!!! 123";

// Remover tudo exceto letras e espaços
String limpo = s.replaceAll("[^a-zA-Z ]", "");
// "Hello World "

// Remover apenas dígitos
String semDigitos = s.replaceAll("\\d", "");
// "Hello@#$ World!!! "
```

**Mascarar dados sensíveis**:
```java
String cpf = "123.456.789-00";

// Mascarar primeiros dígitos
String mascarado = cpf.replaceFirst("\\d{3}", "XXX");
// "XXX.456.789-00"

// Ou mascarar tudo exceto últimos 2 dígitos
String mascarado2 = cpf.replaceAll("\\d(?=\\d{2})", "X");
// "XXX.XXX.XXX-00"
```

**Formatar números**:
```java
String numero = "1234567890";

// Adicionar separadores de milhar
String formatado = numero.replaceAll("(\\d)(?=(\\d{3})+$)", "$1,");
// "1,234,567,890"
```

**Converter quebras de linha**:
```java
String texto = "Linha 1\r\nLinha 2\r\nLinha 3";

// Windows (\r\n) → Unix (\n)
String unix = texto.replaceAll("\\r\\n", "\n");

// Ou qualquer quebra → <br>
String html = texto.replaceAll("\\r?\\n", "<br>");
// "Linha 1<br>Linha 2<br>Linha 3"
```

### 8️⃣ Performance e Otimizações

**Evitar replaceAll() para literais**:

```java
String s = "test,test,test";

// ❌ Lento - compila regex desnecessariamente
String r1 = s.replaceAll(",", ";");

// ✓ Rápido - substituição literal
String r2 = s.replace(",", ";");

// Benchmark (1 milhão de operações):
// replace():    ~100ms
// replaceAll(): ~500ms (5x mais lento)
```

**Pattern.compile() para múltiplas substituições**:
```java
List<String> textos = obterMilharesDeTextos();

// ❌ Compila regex a cada iteração
for (String texto : textos) {
    String r = texto.replaceAll("\\d+", "[NUM]");
}

// ✓ Compila regex uma vez
Pattern pattern = Pattern.compile("\\d+");
for (String texto : textos) {
    Matcher matcher = pattern.matcher(texto);
    String r = matcher.replaceAll("[NUM]");
}

// 10-20% mais rápido para grandes volumes
```

**Complexidade**:
```java
// replace(char, char): O(n) - percorre String uma vez
// replace(CharSequence, CharSequence): O(n × m) - busca substring
// replaceAll(regex): O(n × m) + overhead de regex
// replaceFirst(regex): O(n × m) + overhead de regex (para até encontrar)
```

### 9️⃣ Encadeamento de Substituições

**Múltiplas substituições em cadeia**:

```java
String s = "  Hello   World  ";

String r = s.trim()                    // "Hello   World"
            .replaceAll("\\s+", " ")   // "Hello World"
            .replace("World", "Java")  // "Hello Java"
            .toUpperCase();            // "HELLO JAVA"

// Cada método retorna nova String - pode encadear
```

**Atenção com ordem**:
```java
String s = "a b c";

// Ordem importa!
String r1 = s.replace(" ", "").replace("a", "A");
// "Abc" (remove espaços primeiro, depois substitui 'a')

String r2 = s.replace("a", "A").replace(" ", "");
// "Abc" (mesmo resultado neste caso)

// Mas nem sempre:
String s2 = "a a a";
String r3 = s2.replace(" ", "").replace("a", "A");
// "AAA"

String r4 = s2.replace("a", "A").replace(" ", "");
// "AAA" (mesmo resultado aqui também)
```

### 🔟 Null Safety e Exceções

**Não aceita parâmetros null**:

```java
String s = "Test";

// ❌ NullPointerException
s.replace(null, "x");           // NPE
s.replace("x", null);           // NPE
s.replaceAll(null, "x");        // NPE
s.replaceAll("x", null);        // NPE

// ✓ Verificar null
String busca = obterBusca();  // pode retornar null
if (busca != null) {
    String r = s.replace(busca, "substituto");
}
```

**String null**:
```java
String s = null;

// ❌ NullPointerException
s.replace("x", "y");  // NPE

// ✓ Verificar
if (s != null) {
    s = s.replace("x", "y");
}
```

**PatternSyntaxException com replaceAll**:
```java
String s = "Test";

try {
    // ❌ Regex inválida
    String r = s.replaceAll("[", "x");  // PatternSyntaxException
} catch (PatternSyntaxException e) {
    System.out.println("Regex inválida: " + e.getMessage());
}

// ✓ Validar regex ou usar replace() para literais
String r = s.replace("[", "x");  // OK (literal)
```

## 🎯 Aplicabilidade

**1. Sanitizar Entrada do Usuário**:
```java
String input = usuario.getInput();
String limpo = input.replaceAll("[^a-zA-Z0-9 ]", "");  // Apenas alfanuméricos
```

**2. Formatar Texto**:
```java
String markdown = texto.replace("**", "<b>")
                       .replace("*", "<i>");
```

**3. Normalizar Dados**:
```java
String telefone = "(11) 98765-4321";
String normalizado = telefone.replaceAll("[^\\d]", "");  // "11987654321"
```

**4. Trocar Placeholders**:
```java
String template = "Hello, {name}! Welcome to {app}.";
String mensagem = template.replace("{name}", usuario.getNome())
                          .replace("{app}", "MyApp");
```

**5. Converter Formatos**:
```java
String csv = "a,b,c";
String tsv = csv.replace(",", "\t");  // Tab-separated
```

## ⚠️ Armadilhas Comuns

**1. Confundir replace e replaceAll**:
```java
"a.b.c".replace(".", "-");     // "a-b-c" (literal)
"a.b.c".replaceAll(".", "-");  // "-----" (. = qualquer char!)
```

**2. Esquecer de Escapar Metacaracteres**:
```java
texto.replaceAll("$", "R$");  // ❌ Erro ($ = fim de linha em regex)
texto.replaceAll("\\$", "R\\$");  // ✓ Correto
```

**3. Não Atribuir Resultado**:
```java
String s = "test";
s.replace("t", "T");  // ❌ String não muda!
System.out.println(s);  // "test" (original)

// ✓ Atribuir resultado
s = s.replace("t", "T");
System.out.println(s);  // "TesT"
```

**4. Usar replaceAll para Literais**:
```java
// ❌ Lento e arriscado
s.replaceAll("palavra", "outra");

// ✓ Rápido e seguro
s.replace("palavra", "outra");
```

**5. $ em Replacement sem Escape**:
```java
s.replaceAll("X", "$100");  // ❌ $1 interpretado como grupo 1
s.replaceAll("X", "\\$100");  // ✓ Literal $
```

## ✅ Boas Práticas

**1. Use replace() para Literais**:
```java
// ✓ Simples e rápido
s.replace(",", ";");

// ✗ Desnecessário
s.replaceAll(",", ";");
```

**2. Pattern.compile() para Repetição**:
```java
Pattern p = Pattern.compile("\\d+");
for (String s : lista) {
    s = p.matcher(s).replaceAll("[NUM]");
}
```

**3. Validar Regex**:
```java
try {
    Pattern.compile(regex);  // Testa se regex é válida
} catch (PatternSyntaxException e) {
    // Regex inválida
}
```

**4. Escape com Matcher.quoteReplacement()**:
```java
String literal = "$100";
s.replaceAll("X", Matcher.quoteReplacement(literal));
```

**5. Null Safety**:
```java
if (s != null && busca != null) {
    s = s.replace(busca, substituto);
}
```

## 📚 Resumo Executivo

**replace()**, **replaceAll()**, **replaceFirst()**: substituem conteúdo em Strings.

**replace()**:
```java
// char → char
"banana".replace('a', 'o');  // "bonono"

// String → String (literal, sem regex)
"Java is great".replace("Java", "Python");
// "Python is great"
```

**replaceAll()** (regex):
```java
"abc123def456".replaceAll("\\d+", "[NUM]");
// "abc[NUM]def[NUM]"

// Grupos de captura
"John Doe".replaceAll("(\\w+) (\\w+)", "$2, $1");
// "Doe, John"
```

**replaceFirst()** (regex):
```java
"Java Java".replaceFirst("Java", "Python");
// "Python Java" (só primeira)
```

**Diferenças**:

| Método | Tipo | Todas/Primeira |
|--------|------|----------------|
| replace() | Literal | Todas |
| replaceAll() | Regex | Todas |
| replaceFirst() | Regex | Primeira |

**Metacaracteres regex**: `. * + ? [ ] ( ) { } ^ $ | \`
- replace(): literal (não precisa escape)
- replaceAll/replaceFirst(): regex (precisa escape)

**Performance**:
```java
// Literal: use replace() (~100ns)
s.replace(",", ";");

// Regex: use replaceAll() (~1000ns)
s.replaceAll("\\d+", "");
```

**Imutabilidade**:
```java
String s = "test";
s.replace("t", "T");  // ❌ Não atribui
System.out.println(s);  // "test" (não mudou)

s = s.replace("t", "T");  // ✓ Atribui
System.out.println(s);  // "TesT"
```

**Uso típico**:
```java
// Literal
texto.replace(" ", "_");

// Regex - remover dígitos
texto.replaceAll("\\d", "");

// Regex - normalizar espaços
texto.replaceAll("\\s+", " ");

// Apenas primeira
texto.replaceFirst("\\d+", "[NUM]");
```