# split() com Regex

## 🎯 Introdução e Definição

**split() com regex** permite **dividir texto** usando padrões complexos como delimitador, não apenas caracteres literais. **Pattern.split()** usa um regex compilado, enquanto **String.split()** compila o Pattern internamente a cada chamada. O método retorna um **array de String[]** com as partes divididas.

**Conceito central**: Diferente de split literal, **split com regex** permite delimitadores flexíveis como "um ou mais espaços" (\\s+), "vírgula ou ponto-e-vírgula" ([,;]), ou padrões complexos. O **parâmetro limit** controla quantas divisões fazer e como tratar strings vazias no resultado.

**Exemplo fundamental**:
```java
String texto = "Java    Python    JavaScript";

// split() com regex - um ou mais espaços
String[] palavras = texto.split("\\s+");
System.out.println(Arrays.toString(palavras));
// ["Java", "Python", "JavaScript"]

// vs split literal - só um espaço
String[] palavras2 = texto.split(" ");
System.out.println(Arrays.toString(palavras2));
// ["Java", "", "", "", "Python", "", "", "", "JavaScript"]
```

**Características principais**:
- **Regex como delimitador** (não apenas literal)
- **Retorna String[]** com partes divididas
- **Parâmetro limit** controla número de divisões
- **String.split()** recompila Pattern
- **Pattern.split()** usa Pattern compilado

## 📋 Fundamentos Teóricos

### 1️⃣ Pattern.split() - Com Pattern Compilado

**Comportamento básico**:

```java
Pattern pattern = Pattern.compile(",");
String texto = "Java,Python,JavaScript";

String[] partes = pattern.split(texto);
System.out.println(Arrays.toString(partes));
// ["Java", "Python", "JavaScript"]
```

**Com regex**:
```java
// Um ou mais espaços como delimitador
Pattern pattern = Pattern.compile("\\s+");
String texto = "Java    Python    JavaScript";

String[] palavras = pattern.split(texto);
System.out.println(Arrays.toString(palavras));
// ["Java", "Python", "JavaScript"]
```

**Múltiplos delimitadores - character class**:
```java
// Vírgula OU ponto-e-vírgula
Pattern pattern = Pattern.compile("[,;]");
String texto = "Java,Python;JavaScript";

String[] linguagens = pattern.split(texto);
System.out.println(Arrays.toString(linguagens));
// ["Java", "Python", "JavaScript"]
```

**Delimitador complexo**:
```java
// Vírgula com espaços opcionais
Pattern pattern = Pattern.compile("\\s*,\\s*");
String texto = "Java , Python,JavaScript  ,  Ruby";

String[] linguagens = pattern.split(texto);
System.out.println(Arrays.toString(linguagens));
// ["Java", "Python", "JavaScript", "Ruby"]
```

**Pattern.split(text, limit)**:
```java
Pattern pattern = Pattern.compile(",");
String texto = "a,b,c,d,e";

// Limit 3 - máximo 3 partes
String[] partes = pattern.split(texto, 3);
System.out.println(Arrays.toString(partes));
// ["a", "b", "c,d,e"] (resto sem dividir)
```

### 2️⃣ String.split() - Conveniência

**Comportamento básico**:

```java
String texto = "Java,Python,JavaScript";

// String.split() - compila Pattern internamente
String[] partes = texto.split(",");
System.out.println(Arrays.toString(partes));
// ["Java", "Python", "JavaScript"]
```

**É equivalente a**:
```java
// String.split() faz isso internamente:
Pattern pattern = Pattern.compile(",");
String[] partes = pattern.split(texto);
```

**Com regex**:
```java
String texto = "Java    Python    JavaScript";

// \\s+ = um ou mais espaços
String[] palavras = texto.split("\\s+");
System.out.println(Arrays.toString(palavras));
// ["Java", "Python", "JavaScript"]
```

**String.split(regex, limit)**:
```java
String texto = "a,b,c,d,e";

String[] partes = texto.split(",", 3);
System.out.println(Arrays.toString(partes));
// ["a", "b", "c,d,e"]
```

**⚠️ String.split() recompila Pattern**:
```java
// ❌ Ineficiente em loop - recompila Pattern a cada iteração
for (String linha : linhas) {
    String[] partes = linha.split(",");  // Compila Pattern 1000x
}

// ✓ Eficiente - compila uma vez
Pattern pattern = Pattern.compile(",");
for (String linha : linhas) {
    String[] partes = pattern.split(linha);  // Usa Pattern compilado
}
```

### 3️⃣ Parâmetro limit

**limit > 0 - máximo de divisões**:

```java
String texto = "a,b,c,d,e";

// Limit 3 - divide no máximo 3 vezes (resulta em 3 partes)
String[] partes = texto.split(",", 3);
System.out.println(Arrays.toString(partes));
// ["a", "b", "c,d,e"]

// Limit 2 - divide no máximo 2 vezes (resulta em 2 partes)
String[] partes2 = texto.split(",", 2);
System.out.println(Arrays.toString(partes2));
// ["a", "b,c,d,e"]
```

**limit = 0 - sem limite, remove trailing empties (padrão)**:
```java
String texto = "a,b,c,,,";

// Limit 0 (padrão) - remove strings vazias no final
String[] partes = texto.split(",", 0);
System.out.println(Arrays.toString(partes));
// ["a", "b", "c"]

// Ou simplesmente split(regex)
String[] partes2 = texto.split(",");
System.out.println(Arrays.toString(partes2));
// ["a", "b", "c"] (mesmo resultado)
```

**limit < 0 - sem limite, mantém trailing empties**:
```java
String texto = "a,b,c,,,";

// Limit negativo - mantém strings vazias no final
String[] partes = texto.split(",", -1);
System.out.println(Arrays.toString(partes));
// ["a", "b", "c", "", "", ""]
```

**Comparação dos três modos**:
```java
String texto = "a,b,,c,,,";

// Positivo - limita divisões
String[] p1 = texto.split(",", 3);
System.out.println(Arrays.toString(p1));  // ["a", "b", ",c,,,"]

// Zero - remove trailing vazios
String[] p2 = texto.split(",", 0);
System.out.println(Arrays.toString(p2));  // ["a", "b", "", "c"]

// Negativo - mantém tudo
String[] p3 = texto.split(",", -1);
System.out.println(Arrays.toString(p3));  // ["a", "b", "", "c", "", "", ""]
```

### 4️⃣ Strings Vazias no Resultado

**Delimitador no início**:

```java
String texto = ",a,b,c";

String[] partes = texto.split(",");
System.out.println(Arrays.toString(partes));
// ["", "a", "b", "c"]
// Primeira parte vazia (antes da primeira vírgula)
```

**Delimitador no final**:
```java
String texto = "a,b,c,";

// split() padrão - remove vazios finais
String[] partes = texto.split(",");
System.out.println(Arrays.toString(partes));
// ["a", "b", "c"]

// split com limit -1 - mantém vazios finais
String[] partes2 = texto.split(",", -1);
System.out.println(Arrays.toString(partes2));
// ["a", "b", "c", ""]
```

**Delimitadores consecutivos**:
```java
String texto = "a,,b,,,c";

String[] partes = texto.split(",");
System.out.println(Arrays.toString(partes));
// ["a", "", "b", "", "", "c"]
// Strings vazias entre delimitadores consecutivos
```

**Remover vazios - filter()**:
```java
String texto = "a,,b,,,c";

String[] partes = texto.split(",");

// Filtrar strings vazias
String[] semVazios = Arrays.stream(partes)
    .filter(s -> !s.isEmpty())
    .toArray(String[]::new);

System.out.println(Arrays.toString(semVazios));
// ["a", "b", "c"]
```

### 5️⃣ Casos de Uso Práticos

**Parsing CSV**:

```java
String csv = "João,Silva,30,São Paulo";

String[] campos = csv.split(",");

String nome = campos[0];      // "João"
String sobrenome = campos[1]; // "Silva"
int idade = Integer.parseInt(campos[2]);  // 30
String cidade = campos[3];    // "São Paulo"
```

**CSV com espaços**:
```java
String csv = "João , Silva , 30 , São Paulo";

// Vírgula com espaços opcionais
String[] campos = csv.split("\\s*,\\s*");
System.out.println(Arrays.toString(campos));
// ["João", "Silva", "30", "São Paulo"]
```

**Tokenização de palavras**:
```java
String frase = "Java   é    uma    linguagem";

// Um ou mais espaços
String[] palavras = frase.split("\\s+");
System.out.println(Arrays.toString(palavras));
// ["Java", "é", "uma", "linguagem"]
```

**Parsing de log**:
```java
String log = "[2024-01-15] INFO: Sistema iniciado";

// Dividir por colchetes e dois-pontos
String[] partes = log.split("[\\[\\]:]+");
System.out.println(Arrays.toString(partes));
// ["", "2024-01-15", " INFO", " Sistema iniciado"]

// Filtrar e limpar
String data = partes[1].trim();     // "2024-01-15"
String nivel = partes[2].trim();    // "INFO"
String mensagem = partes[3].trim(); // "Sistema iniciado"
```

**Múltiplos delimitadores**:
```java
String texto = "Java,Python;JavaScript|Ruby";

// Vírgula OU ponto-e-vírgula OU pipe
String[] linguagens = texto.split("[,;|]");
System.out.println(Arrays.toString(linguagens));
// ["Java", "Python", "JavaScript", "Ruby"]
```

**Dividir por linha**:
```java
String texto = "linha1\nlinha2\r\nlinha3";

// \\R - qualquer quebra de linha (Java 8+)
String[] linhas = texto.split("\\R");
System.out.println(Arrays.toString(linhas));
// ["linha1", "linha2", "linha3"]
```

**Parsing de URL**:
```java
String url = "https://example.com/path/to/resource";

// Dividir por /
String[] partes = url.split("/");
System.out.println(Arrays.toString(partes));
// ["https:", "", "example.com", "path", "to", "resource"]

String protocolo = partes[0];  // "https:"
String dominio = partes[2];    // "example.com"
```

### 6️⃣ Performance

**String.split() vs Pattern.split()**:

```java
Pattern pattern = Pattern.compile(",");
List<String> linhas = List.of("a,b,c", "d,e,f", "g,h,i");

// String.split() - recompila Pattern a cada iteração
long inicio = System.nanoTime();
for (String linha : linhas) {
    String[] partes = linha.split(",");  // Compila "," 3 vezes
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Pattern.split() - Pattern pré-compilado
inicio = System.nanoTime();
for (String linha : linhas) {
    String[] partes = pattern.split(linha);  // Usa Pattern compilado
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

// Pattern.split() ~30% mais rápido
```

**Benchmark com 100k iterações**:
```java
int n = 100_000;
String texto = "a,b,c,d,e";

// String.split()
long inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    String[] partes = texto.split(",");
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;
System.out.println("String.split(): " + tempo1 + "ms");  // ~150ms

// Pattern.split()
Pattern pattern = Pattern.compile(",");
inicio = System.nanoTime();
for (int i = 0; i < n; i++) {
    String[] partes = pattern.split(texto);
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;
System.out.println("Pattern.split(): " + tempo2 + "ms");  // ~100ms

// Diferença: ~50ms (33% mais rápido)
```

### 7️⃣ split() vs StringTokenizer

**StringTokenizer - classe antiga**:

```java
String texto = "Java Python JavaScript";

// StringTokenizer (legado)
StringTokenizer tokenizer = new StringTokenizer(texto);
while (tokenizer.hasMoreTokens()) {
    System.out.println(tokenizer.nextToken());
}
// Java
// Python
// JavaScript
```

**split() é preferível**:
```java
// ✓ Moderno - split()
String[] palavras = texto.split("\\s+");
for (String palavra : palavras) {
    System.out.println(palavra);
}

// ✓ Ou com Stream
Arrays.stream(texto.split("\\s+"))
    .forEach(System.out::println);
```

**Vantagens de split()**:
- Retorna array (fácil de usar)
- Suporta regex completo
- Pode especificar limit
- Mais conciso

**Desvantagens de StringTokenizer**:
- API verbosa (hasMoreTokens/nextToken)
- Não suporta regex
- Classe legada (não recomendada)

### 8️⃣ Escapar Metacaracteres

**Metacaracteres especiais**:

```java
String texto = "a.b.c";

// ❌ . é metacaractere (qualquer caractere)
String[] errado = texto.split(".");
System.out.println(Arrays.toString(errado));
// [] (vazio - dividiu em cada caractere)

// ✓ Escapar . com \\. para literal
String[] correto = texto.split("\\.");
System.out.println(Arrays.toString(correto));
// ["a", "b", "c"]
```

**Outros metacaracteres que precisam escape**:
```java
// Escapar | (alternation)
String texto1 = "a|b|c";
String[] p1 = texto1.split("\\|");  // ["a", "b", "c"]

// Escapar + (quantifier)
String texto2 = "a+b+c";
String[] p2 = texto2.split("\\+");  // ["a", "b", "c"]

// Escapar * (quantifier)
String texto3 = "a*b*c";
String[] p3 = texto3.split("\\*");  // ["a", "b", "c"]

// Escapar ? (quantifier)
String texto4 = "a?b?c";
String[] p4 = texto4.split("\\?");  // ["a", "b", "c"]

// Escapar ( ) (groups)
String texto5 = "a(b)c";
String[] p5 = texto5.split("[()]");  // ["a", "b", "c"]
```

**Pattern.quote() para literal**:
```java
String delimitador = ".|*+?";  // Vários metacaracteres

String texto = "a.|*+?b.|*+?c";

// Pattern.quote() - trata tudo como literal
String regex = Pattern.quote(delimitador);
String[] partes = texto.split(regex);

System.out.println(Arrays.toString(partes));
// ["a", "b", "c"]
```

### 9️⃣ Erros Comuns

**Não escapar metacaracteres**:

```java
String texto = "192.168.1.1";

// ❌ . não escapado - divide em cada caractere
String[] errado = texto.split(".");
System.out.println(Arrays.toString(errado));
// []

// ✓ Escapar .
String[] correto = texto.split("\\.");
System.out.println(Arrays.toString(correto));
// ["192", "168", "1", "1"]
```

**Confundir limit**:
```java
String texto = "a,b,c,d";

// ⚠️ Limit 2 = máximo 2 DIVISÕES = 3 partes? NÃO!
// Limit 2 = máximo 2 PARTES no resultado
String[] partes = texto.split(",", 2);
System.out.println(Arrays.toString(partes));
// ["a", "b,c,d"] (2 partes)
```

**Esquecer strings vazias**:
```java
String csv = "a,,c";

String[] partes = csv.split(",");
System.out.println(partes.length);  // 3 (não 2!)
System.out.println(Arrays.toString(partes));
// ["a", "", "c"] (campo vazio no meio)

// Precisa validar/tratar vazios
for (String parte : partes) {
    if (!parte.isEmpty()) {
        processar(parte);
    }
}
```

**Usar split() em loop**:
```java
// ❌ Ineficiente
for (String linha : linhas) {
    String[] partes = linha.split(",");  // Compila Pattern 1000x
}

// ✓ Eficiente
Pattern pattern = Pattern.compile(",");
for (String linha : linhas) {
    String[] partes = pattern.split(linha);
}
```

### 🔟 Boas Práticas

**Compilar Pattern para uso repetido**:

```java
// ✓ Compilar uma vez
Pattern pattern = Pattern.compile(",");

for (String linha : linhas) {
    String[] partes = pattern.split(linha);
    processar(partes);
}
```

**Especificar limit quando apropriado**:
```java
// Dividir em nome e resto
String linha = "João,Silva,30,São Paulo";

// Limit 2 - nome e resto
String[] partes = linha.split(",", 2);
String nome = partes[0];    // "João"
String resto = partes[1];   // "Silva,30,São Paulo"
```

**Validar resultado**:
```java
String[] partes = csv.split(",");

if (partes.length >= 3) {
    String nome = partes[0];
    String idade = partes[1];
    String cidade = partes[2];
} else {
    throw new IllegalArgumentException("CSV inválido");
}
```

**Tratar strings vazias**:
```java
String[] partes = texto.split(",");

// Filtrar vazias
String[] limpo = Arrays.stream(partes)
    .filter(s -> !s.isEmpty())
    .toArray(String[]::new);
```

**Documentar regex complexo**:
```java
// Dividir por vírgula com espaços opcionais
Pattern pattern = Pattern.compile("\\s*,\\s*");

// Ou comentar no split
String[] partes = texto.split("\\s*,\\s*");  // Vírgula + espaços
```

## 🎯 Aplicabilidade

**1. Parsing CSV**:
```java
csv.split(",")
```

**2. Tokenização**:
```java
frase.split("\\s+")
```

**3. Múltiplos delimitadores**:
```java
texto.split("[,;|]")
```

**4. Parsing de log**:
```java
log.split("[\\[\\]:]+")
```

**5. Dividir linhas**:
```java
texto.split("\\R")
```

## ⚠️ Armadilhas Comuns

**1. Metacaracteres não escapados**:
```java
split(".")  // ❌ qualquer char
split("\\.")  // ✓ ponto literal
```

**2. Limit confuso**:
```java
split(",", 2)  // 2 partes, não 2 divisões
```

**3. Strings vazias**:
```java
"a,,c".split(",")  → ["a", "", "c"]
```

**4. Recompilar em loop**:
```java
for(...) { linha.split(",") }  // ❌ lento
```

**5. Trailing empties**:
```java
"a,b,".split(",")  → ["a", "b"] (remove final)
"a,b,".split(",", -1)  → ["a", "b", ""] (mantém)
```

## ✅ Boas Práticas

**1. Compilar Pattern**:
```java
Pattern p = Pattern.compile(",");
p.split(texto);
```

**2. Escapar metacaracteres**:
```java
split("\\.")  // Ponto literal
```

**3. Usar limit**:
```java
split(",", 2)  // Apenas primeiras 2 partes
```

**4. Validar length**:
```java
if (partes.length >= 3) { }
```

**5. Filtrar vazias**:
```java
Arrays.stream(partes).filter(s -> !s.isEmpty())
```

## 📚 Resumo Executivo

**Dividir texto com regex**.

**Pattern.split()**:
```java
Pattern p = Pattern.compile(",");
String[] partes = p.split(texto);
```

**String.split()**:
```java
String[] partes = texto.split(",");
// Compila Pattern internamente
```

**Limit**:
```java
split(",", 2)   // Máximo 2 partes
split(",", 0)   // Sem limite, remove vazios finais (padrão)
split(",", -1)  // Sem limite, mantém vazios finais
```

**Regex úteis**:
```java
split("\\s+")      // Espaços
split("[,;]")      // Vírgula ou ponto-e-vírgula
split("\\s*,\\s*") // Vírgula com espaços opcionais
split("\\R")       // Quebras de linha
```

**Escapar metacaracteres**:
```java
split("\\.")  // Ponto literal
split("\\|")  // Pipe literal
```

**Performance**:
```java
// ❌ Lento
for(...) { texto.split(",") }

// ✓ Rápido
Pattern p = Pattern.compile(",");
for(...) { p.split(texto) }
```

**Recomendação**: Use **Pattern.split()** com Pattern pré-compilado em loops. Escape **metacaracteres** com \\. Especifique **limit** quando apropriado. Valide **length** do array resultado. Filtre **strings vazias** se necessário.