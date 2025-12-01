# split() - Divisão de Strings

## 🎯 Introdução e Definição

**split()** divide uma String em **array de Strings** usando um **delimitador** (regex). Como Strings são imutáveis, retorna um **novo array** sem modificar a original.

**Conceito central**: É essencial para **parsear dados estruturados** (CSV, TSV, logs), **tokenizar entrada** e **processar texto**, usando **expressões regulares** como critério de separação.

**Exemplo fundamental**:
```java
String s = "Java,Python,JavaScript";

// split() com vírgula
String[] linguagens = s.split(",");
// ["Java", "Python", "JavaScript"]

for (String ling : linguagens) {
    System.out.println(ling);
}
// Java
// Python
// JavaScript

// Original não muda
System.out.println(s);  // "Java,Python,JavaScript"
```

**Diferenças principais**:
- **split(regex)**: divide em todas as ocorrências, remove strings vazias finais
- **split(regex, limit)**: controla número máximo de divisões e preservação de vazias
- **Baseado em regex**: metacaracteres (`.`, `|`, `*`, etc.) precisam de escape

## 📋 Fundamentos Teóricos

### 1️⃣ split(String regex) - Divisão Ilimitada

**Divide em todas as ocorrências do delimitador**:

```java
String s = "a,b,c,d";

String[] partes = s.split(",");
// ["a", "b", "c", "d"]

System.out.println(partes.length);  // 4

// Acesso por índice
System.out.println(partes[0]);  // "a"
System.out.println(partes[3]);  // "d"
```

**Assinatura**:
```java
public String[] split(String regex)
// Divide String em array usando regex como delimitador
// Remove strings vazias FINAIS do resultado
// Equivalente a split(regex, 0)
```

**Strings vazias FINAIS são removidas**:
```java
String s1 = "a,b,c,";  // vírgula final

String[] partes1 = s1.split(",");
// ["a", "b", "c"]  (vazia final removida)
System.out.println(partes1.length);  // 3

String s2 = ",a,b,c";  // vírgula inicial

String[] partes2 = s2.split(",");
// ["", "a", "b", "c"]  (vazia INICIAL preservada)
System.out.println(partes2.length);  // 4
```

**Múltiplos delimitadores consecutivos**:
```java
String s = "a,,b,,,c";

String[] partes = s.split(",");
// ["a", "", "b", "", "", "c"]

// Strings vazias INTERNAS são preservadas
// Apenas finais são removidas
```

**Regex especial - qualquer espaço**:
```java
String s = "Java  Python   JavaScript";  // espaços variados

String[] linguagens = s.split("\\s+");  // \\s+ = um ou mais espaços
// ["Java", "Python", "JavaScript"]

// Remove espaços múltiplos
```

### 2️⃣ split(String regex, int limit) - Divisão Controlada

**Controla número de divisões com parâmetro limit**:

```java
String s = "a,b,c,d,e";

// limit = 0 (padrão) - remove vazias finais
String[] p0 = s.split(",", 0);
// ["a", "b", "c", "d", "e"]

// limit > 0 - máximo de elementos
String[] p3 = s.split(",", 3);
// ["a", "b", "c,d,e"]  (resto fica junto)

// limit < 0 - preserva vazias finais
String s2 = "a,b,c,";
String[] p_neg = s2.split(",", -1);
// ["a", "b", "c", ""]  (vazia final preservada)
```

**Assinatura**:
```java
public String[] split(String regex, int limit)

// limit = 0:  divisões ilimitadas, remove strings vazias finais
// limit > 0:  máximo de (limit) elementos no array
// limit < 0:  divisões ilimitadas, PRESERVA strings vazias finais
```

**Comportamento com limit > 0**:
```java
String s = "João:30:São Paulo:Brasil";

String[] p2 = s.split(":", 2);
// ["João", "30:São Paulo:Brasil"]  (divide 1 vez apenas)

String[] p3 = s.split(":", 3);
// ["João", "30", "São Paulo:Brasil"]  (divide 2 vezes)

String[] p4 = s.split(":", 4);
// ["João", "30", "São Paulo", "Brasil"]  (divide 3 vezes)

// limit controla QUANTAS divisões fazer
// Array tem no máximo (limit) elementos
```

**Diferença com strings vazias finais**:
```java
String s = "a,b,c,,,";  // 3 vírgulas finais

// limit = 0 (padrão) - remove finais
String[] p0 = s.split(",", 0);
// ["a", "b", "c"]

// limit < 0 - preserva finais
String[] pNeg = s.split(",", -1);
// ["a", "b", "c", "", "", ""]  (3 vazias finais)

System.out.println(p0.length);    // 3
System.out.println(pNeg.length);  // 6
```

### 3️⃣ Delimitadores Regex - Metacaracteres

**split() usa REGEX, não texto literal**:

```java
// ❌ ERRADO - '.' é metacaractere (qualquer char)
String s = "192.168.0.1";
String[] partes = s.split(".");
// []  (array vazio - divide TUDO!)

// ✓ CORRETO - escapar '.'
String[] partes2 = s.split("\\.");
// ["192", "168", "0", "1"]
```

**Metacaracteres que precisam de escape**:
```java
// Metacaracteres: . * + ? | ( ) [ ] { } ^ $ \

String s1 = "a+b+c";
s1.split("\\+");  // ["a", "b", "c"] (+ escapado)

String s2 = "a|b|c";
s2.split("\\|");  // ["a", "b", "c"] (| escapado)

String s3 = "a*b*c";
s3.split("\\*");  // ["a", "b", "c"] (* escapado)

// Usar Pattern.quote() para escape automático
String s4 = "a.b.c";
s4.split(Pattern.quote("."));  // ["a", "b", "c"]
```

**Delimitadores comuns e seus escapes**:

| Delimitador | Escape Necessário | Exemplo |
|-------------|-------------------|---------|
| `,` vírgula | Não | `s.split(",")` |
| `.` ponto | Sim | `s.split("\\.")` |
| `\|` pipe | Sim | `s.split("\\|")` |
| `;` ponto-vírgula | Não | `s.split(";")` |
| ` ` espaço | Não | `s.split(" ")` |
| `\\s` qualquer espaço | Sim (regex) | `s.split("\\s+")` |
| `\t` tab | Não | `s.split("\t")` |

### 4️⃣ Padrões de Delimitadores Úteis

**Qualquer quantidade de espaços**:
```java
String s = "Java  Python   JavaScript";  // espaços variados

String[] linguagens = s.split("\\s+");
// ["Java", "Python", "JavaScript"]

// \\s = qualquer espaço (espaço, tab, newline)
// + = um ou mais
```

**Múltiplos delimitadores alternativos**:
```java
String s = "Java,Python;JavaScript|Ruby";

String[] linguagens = s.split("[,;|]");  // classe de caracteres
// ["Java", "Python", "JavaScript", "Ruby"]

// [,;|] = vírgula OU ponto-vírgula OU pipe
```

**Delimitador com espaços opcionais**:
```java
String s = "a , b,c, d ,e";

String[] partes = s.split("\\s*,\\s*");
// ["a", "b", "c", "d", "e"]

// \\s* = zero ou mais espaços
// ,    = vírgula
// \\s* = zero ou mais espaços

// Remove espaços ao redor da vírgula
```

**Quebras de linha (newline)**:
```java
String texto = "Linha 1\nLinha 2\r\nLinha 3\rLinha 4";

String[] linhas = texto.split("\\r?\\n|\\r");
// ["Linha 1", "Linha 2", "Linha 3", "Linha 4"]

// \\r?\\n = Windows (CRLF)
// |       = ou
// \\r     = Mac antigo (CR)
// Também pega Unix (LF = \\n)
```

**Números separados**:
```java
String s = "Item1Item2Item3";

String[] partes = s.split("(?<=\\d)(?=\\D)|(?<=\\D)(?=\\d)");
// ["Item", "1", "Item", "2", "Item", "3"]

// Divide em transições letra-número
// Usa lookahead/lookbehind
```

### 5️⃣ Strings Vazias no Resultado

**Strings vazias INTERNAS são preservadas**:

```java
String s1 = "a,,c";  // vírgula dupla

String[] partes1 = s1.split(",");
// ["a", "", "c"]  (vazia interna preservada)

String s2 = ",b,c";  // vírgula inicial

String[] partes2 = s2.split(",");
// ["", "b", "c"]  (vazia inicial preservada)
```

**Strings vazias FINAIS dependem do limit**:
```java
String s = "a,b,";  // vírgula final

// limit = 0 (padrão) - remove
String[] p0 = s.split(",");
// ["a", "b"]

// limit = -1 - preserva
String[] pNeg = s.split(",", -1);
// ["a", "b", ""]
```

**Verificar e filtrar vazias**:
```java
String s = "a,,b,,,c,";

String[] partes = s.split(",");
// ["a", "", "b", "", "", "c"]

// Filtrar strings vazias
String[] semVazias = Arrays.stream(partes)
    .filter(p -> !p.isEmpty())
    .toArray(String[]::new);
// ["a", "b", "c"]

// Ou com loop
List<String> lista = new ArrayList<>();
for (String parte : partes) {
    if (!parte.isEmpty()) {
        lista.add(parte);
    }
}
```

### 6️⃣ Casos Especiais e Edge Cases

**String vazia**:
```java
String s = "";

String[] partes = s.split(",");
// [""]  (array com 1 elemento vazio)

System.out.println(partes.length);  // 1
```

**Delimitador não encontrado**:
```java
String s = "NoDelimiter";

String[] partes = s.split(",");
// ["NoDelimiter"]  (array com 1 elemento)

System.out.println(partes.length);  // 1
```

**String só com delimitadores**:
```java
String s = ",,,";

String[] partes = s.split(",");
// [""]  (vazias finais removidas, sobra 1 inicial)

String[] partes2 = s.split(",", -1);
// ["", "", "", ""]  (4 vazias com limit < 0)
```

**Delimitador no início e fim**:
```java
String s = ",a,b,c,";

String[] partes = s.split(",");
// ["", "a", "b", "c"]  (inicial preservada, final removida)

String[] partes2 = s.split(",", -1);
// ["", "a", "b", "c", ""]  (ambas preservadas)
```

### 7️⃣ Performance e Otimizações

**Complexidade temporal**:
```java
// split(regex)
// Tempo: O(n × m) onde n = tamanho String, m = complexidade regex
// Espaço: O(k) onde k = número de partes resultantes

String grande = "a,b,c,..." + ",z";  // milhares de elementos

long inicio = System.nanoTime();
String[] partes = grande.split(",");
long tempo = System.nanoTime() - inicio;
// Tempo cresce linearmente com tamanho da String
```

**Compilar Pattern para uso repetido**:
```java
// ❌ Ineficiente em loop - compila regex toda vez
List<String> linhas = ...;
for (String linha : linhas) {
    String[] campos = linha.split(",");  // compila "," toda iteração
    processar(campos);
}

// ✓ Compilar uma vez
Pattern pattern = Pattern.compile(",");
for (String linha : linhas) {
    String[] campos = pattern.split(linha);  // usa pattern compilado
    processar(campos);
}

// ~10-20% mais rápido em loops grandes
```

**Benchmark**:
```java
String s = "a,b,c,d,e,f,g,h,i,j";

// split() - ~500 nanossegundos
long inicio = System.nanoTime();
String[] p1 = s.split(",");
long tempo1 = System.nanoTime() - inicio;

// Pattern compilado - ~400 nanossegundos
Pattern pattern = Pattern.compile(",");
inicio = System.nanoTime();
String[] p2 = pattern.split(s);
long tempo2 = System.nanoTime() - inicio;
```

**Alternativa: StringTokenizer (legado)**:
```java
// StringTokenizer - mais rápido para delimitadores simples
String s = "a,b,c,d,e";

StringTokenizer st = new StringTokenizer(s, ",");
List<String> partes = new ArrayList<>();
while (st.hasMoreTokens()) {
    partes.add(st.nextToken());
}

// ~2x mais rápido que split() para delimitadores simples
// Mas menos flexível (não usa regex)
```

### 8️⃣ Comparação com Alternativas

**split() vs String.join()**:
```java
// split() - String → Array
String s = "a,b,c";
String[] array = s.split(",");

// join() - Array → String (inverso)
String s2 = String.join(",", array);  // "a,b,c"

// São operações inversas
```

**split() vs indexOf() manual**:
```java
// split() - mais conveniente
String s = "a,b,c";
String[] partes = s.split(",");

// indexOf() manual - mais controle
List<String> lista = new ArrayList<>();
int inicio = 0;
int pos;
while ((pos = s.indexOf(',', inicio)) != -1) {
    lista.add(s.substring(inicio, pos));
    inicio = pos + 1;
}
lista.add(s.substring(inicio));  // último elemento

// split() mais simples, indexOf() mais eficiente para casos específicos
```

**split() vs Scanner**:
```java
String s = "1 2 3 4 5";

// split()
String[] partes = s.split(" ");
int[] numeros = Arrays.stream(partes)
    .mapToInt(Integer::parseInt)
    .toArray();

// Scanner
Scanner scanner = new Scanner(s);
List<Integer> lista = new ArrayList<>();
while (scanner.hasNextInt()) {
    lista.add(scanner.nextInt());
}

// Scanner oferece parsing tipado direto
```

### 9️⃣ Casos de Uso Práticos

**Parsear CSV**:
```java
String csvLine = "João,30,São Paulo";

String[] campos = csvLine.split(",");

String nome = campos[0];    // "João"
int idade = Integer.parseInt(campos[1]);  // 30
String cidade = campos[2];  // "São Paulo"

// Atenção: CSV real precisa tratar vírgulas dentro de aspas
```

**Processar log**:
```java
String logEntry = "2024-01-15 10:30:45 ERROR Database connection failed";

String[] partes = logEntry.split(" ", 4);  // máximo 4 partes

String data = partes[0];      // "2024-01-15"
String hora = partes[1];      // "10:30:45"
String nivel = partes[2];     // "ERROR"
String mensagem = partes[3];  // "Database connection failed"
```

**Extrair palavras de texto**:
```java
String texto = "Java é uma linguagem de programação";

String[] palavras = texto.split("\\s+");
// ["Java", "é", "uma", "linguagem", "de", "programação"]

System.out.println("Total de palavras: " + palavras.length);  // 6
```

**Parsear path/URL**:
```java
String path = "/home/user/documents/file.txt";

String[] partes = path.split("/");
// ["", "home", "user", "documents", "file.txt"]

String nomeArquivo = partes[partes.length - 1];  // "file.txt"
```

**Dividir por múltiplos delimitadores**:
```java
String s = "item1;item2,item3|item4";

String[] itens = s.split("[;,|]");
// ["item1", "item2", "item3", "item4"]
```

### 🔟 Null Safety e Validações

**Não aceita null**:

```java
String s = null;

// ❌ NullPointerException
String[] partes = s.split(",");  // NPE

// ✓ Verificar null
if (s != null) {
    String[] partes = s.split(",");
}

// ✓ Operador ternário
String[] partes = (s != null) ? s.split(",") : new String[0];
```

**Validar resultado**:
```java
String s = "a,b,c";

String[] partes = s.split(",");

// Verificar tamanho esperado
if (partes.length != 3) {
    throw new IllegalArgumentException("Esperado 3 campos, obteve " + partes.length);
}

// Acessar com segurança
String primeiro = (partes.length > 0) ? partes[0] : "";
```

**Pattern inválido**:
```java
String s = "a,b,c";

try {
    String[] partes = s.split("[");  // ❌ regex inválida
} catch (PatternSyntaxException e) {
    System.err.println("Regex inválida: " + e.getMessage());
}

// Sempre validar regex complexas
```

## 🎯 Aplicabilidade

**1. Parsear CSV/TSV**:
```java
String[] campos = linha.split(",");
String[] campos = linha.split("\t");
```

**2. Processar Logs**:
```java
String[] partes = logLine.split(" ", 4);
```

**3. Tokenizar Entrada**:
```java
String[] palavras = texto.split("\\s+");
```

**4. Extrair Campos de String Estruturada**:
```java
String[] dados = estrutura.split(":");
```

**5. Dividir Path/URL**:
```java
String[] segmentos = path.split("/");
```

## ⚠️ Armadilhas Comuns

**1. Metacaracteres Sem Escape**:
```java
"192.168.0.1".split(".");  // ❌ [] (divide tudo)
"192.168.0.1".split("\\.");  // ✓ ["192", "168", "0", "1"]
```

**2. Esquecer Strings Vazias**:
```java
"a,,c".split(",");  // ["a", "", "c"] (vazia no meio!)
```

**3. Não Validar Tamanho do Array**:
```java
String[] partes = s.split(",");
String terceiro = partes[2];  // ❌ ArrayIndexOutOfBoundsException possível
```

**4. Usar em Loop sem Pattern Compilado**:
```java
for (String linha : linhas) {
    linha.split(",");  // ❌ Compila regex toda vez
}

// ✓ Compilar fora do loop
Pattern p = Pattern.compile(",");
for (String linha : linhas) {
    p.split(linha);
}
```

**5. Esperar Limite Automático**:
```java
"a:b:c:d".split(":");  // ["a", "b", "c", "d"] (divide tudo)

// Se quer máximo 2 partes:
"a:b:c:d".split(":", 2);  // ["a", "b:c:d"]
```

## ✅ Boas Práticas

**1. Escapar Metacaracteres**:
```java
s.split(Pattern.quote("."));  // Escape automático
```

**2. Usar limit Quando Apropriado**:
```java
String[] partes = s.split(":", 2);  // Máximo 2 partes
```

**3. Compilar Pattern para Loops**:
```java
Pattern pattern = Pattern.compile(",");
for (String linha : linhas) {
    pattern.split(linha);
}
```

**4. Validar Tamanho do Resultado**:
```java
if (partes.length >= 3) {
    String terceiro = partes[2];
}
```

**5. Remover Strings Vazias se Necessário**:
```java
Arrays.stream(partes)
    .filter(p -> !p.isEmpty())
    .toArray(String[]::new);
```

## 📚 Resumo Executivo

**split()** divide String em array usando **regex como delimitador**.

**Assinaturas**:
```java
String[] split(String regex)           // Ilimitado, remove vazias finais
String[] split(String regex, int limit)  // Controla divisões
```

**Uso básico**:
```java
"a,b,c".split(",");      // ["a", "b", "c"]
"Java Python".split(" ");  // ["Java", "Python"]
```

**Limit**:
```java
"a,b,c,d".split(",", 2);   // ["a", "b,c,d"] (máx 2 elementos)
"a,b,".split(",", -1);     // ["a", "b", ""] (preserva finais)
```

**Metacaracteres precisam escape**:
```java
"192.168.0.1".split("\\.");  // ["192", "168", "0", "1"]
"a|b|c".split("\\|");        // ["a", "b", "c"]

// Ou Pattern.quote()
s.split(Pattern.quote("."));
```

**Strings vazias**:
```java
"a,,c".split(",");    // ["a", "", "c"] (internas preservadas)
"a,b,".split(",");    // ["a", "b"] (finais removidas)
"a,b,".split(",", -1);  // ["a", "b", ""] (finais preservadas com limit < 0)
```

**Padrões úteis**:
```java
s.split("\\s+");        // Qualquer quantidade de espaços
s.split("[,;|]");       // Vírgula OU ponto-vírgula OU pipe
s.split("\\s*,\\s*");   // Vírgula com espaços opcionais
```

**Performance**: O(n × m) - compilar Pattern para loops

**Otimização**:
```java
// ✓ Compilar uma vez
Pattern p = Pattern.compile(",");
for (String linha : linhas) {
    p.split(linha);
}
```

**Null safety**:
```java
String s = null;
s.split(",");  // ❌ NullPointerException

if (s != null) {
    s.split(",");  // ✓
}
```

**Validação**:
```java
String[] partes = s.split(",");
if (partes.length >= 3) {
    String terceiro = partes[2];  // Seguro
}
```