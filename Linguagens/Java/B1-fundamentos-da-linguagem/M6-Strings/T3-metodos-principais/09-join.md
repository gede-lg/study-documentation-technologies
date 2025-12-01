# String.join() - Concatenação com Delimitador

## 🎯 Introdução e Definição

**String.join()** é um **método estático** (Java 8+) que concatena elementos com um **delimitador** entre eles. Retorna uma **nova String** com todos os elementos unidos.

**Conceito central**: É a **operação inversa** de `split()` - enquanto split() divide String em array, join() une array em String. Essencial para **formar CSV**, **construir paths**, **formatar listas** e **gerar saídas estruturadas**.

**Exemplo fundamental**:
```java
// Array → String com join()
String[] frutas = {"Maçã", "Banana", "Laranja"};

String resultado = String.join(", ", frutas);
System.out.println(resultado);
// "Maçã, Banana, Laranja"

// Inverso com split()
String[] frutas2 = resultado.split(", ");
// ["Maçã", "Banana", "Laranja"]

// join() e split() são operações inversas
```

**Características principais**:
- **Método estático**: `String.join(delimitador, elementos)`
- **Aceita varargs ou Iterable**: flexível para arrays e coleções
- **Null-safe para delimitador vazio**: `join("", array)` concatena diretamente
- **NPE para elementos null**: lança NullPointerException se elemento for null

## 📋 Fundamentos Teóricos

### 1️⃣ join(CharSequence delimiter, CharSequence... elements) - Varargs

**Une elementos passados como argumentos variáveis**:

```java
// Passar elementos diretamente
String resultado = String.join("-", "Java", "Python", "JavaScript");
// "Java-Python-JavaScript"

// Delimitador pode ser qualquer CharSequence
String resultado2 = String.join(" | ", "A", "B", "C");
// "A | B | C"

// Delimitador vazio
String resultado3 = String.join("", "H", "e", "l", "l", "o");
// "Hello"
```

**Assinatura**:
```java
public static String join(CharSequence delimiter, CharSequence... elements)

// delimiter: separador entre elementos (pode ser vazio "")
// elements: varargs de CharSequence (String, StringBuilder, etc.)
// Retorna: nova String com elementos unidos pelo delimitador
```

**Aceita qualquer CharSequence**:
```java
// String
String.join(",", "a", "b", "c");  // "a,b,c"

// StringBuilder
StringBuilder sb1 = new StringBuilder("X");
StringBuilder sb2 = new StringBuilder("Y");
String.join("-", sb1, sb2);  // "X-Y"

// StringBuffer
StringBuffer buf1 = new StringBuffer("A");
StringBuffer buf2 = new StringBuffer("B");
String.join("+", buf1, buf2);  // "A+B"
```

**Com array**:
```java
String[] nomes = {"João", "Maria", "Pedro"};

// Passar array diretamente (funciona por ser varargs)
String resultado = String.join(", ", nomes);
// "João, Maria, Pedro"
```

### 2️⃣ join(CharSequence delimiter, Iterable<? extends CharSequence> elements)

**Une elementos de qualquer Iterable (List, Set, etc.)**:

```java
// List
List<String> linguagens = Arrays.asList("Java", "Python", "JavaScript");
String resultado = String.join(", ", linguagens);
// "Java, Python, JavaScript"

// Set
Set<String> cores = new HashSet<>(Arrays.asList("Red", "Green", "Blue"));
String resultado2 = String.join(" - ", cores);
// "Red - Green - Blue" (ordem não garantida com HashSet)

// LinkedHashSet (ordem preservada)
Set<String> ordenadas = new LinkedHashSet<>(Arrays.asList("A", "B", "C"));
String resultado3 = String.join("|", ordenadas);
// "A|B|C"
```

**Assinatura**:
```java
public static String join(CharSequence delimiter, 
                          Iterable<? extends CharSequence> elements)

// delimiter: separador entre elementos
// elements: Iterable de CharSequence (List, Set, Collection, etc.)
// Retorna: nova String concatenada
```

**Com coleções complexas**:
```java
// ArrayList
List<String> itens = new ArrayList<>();
itens.add("Item 1");
itens.add("Item 2");
itens.add("Item 3");

String lista = String.join(" | ", itens);
// "Item 1 | Item 2 | Item 3"

// TreeSet (ordenado)
Set<String> numeros = new TreeSet<>(Arrays.asList("3", "1", "2"));
String ordenado = String.join(", ", numeros);
// "1, 2, 3" (TreeSet ordena automaticamente)
```

### 3️⃣ Delimitador Vazio e Strings Vazias

**Delimitador vazio concatena diretamente**:

```java
String resultado = String.join("", "J", "a", "v", "a");
// "Java" (sem separador)

String[] letras = {"H", "e", "l", "l", "o"};
String palavra = String.join("", letras);
// "Hello"

// Equivalente a concatenação direta
```

**Elementos vazios são preservados**:
```java
String resultado = String.join(",", "a", "", "c");
// "a,,c" (elemento vazio gera delimitadores consecutivos)

String[] partes = {"", "b", ""};
String resultado2 = String.join("|", partes);
// "|b|" (vazias no início e fim)

// Strings vazias NÃO são ignoradas
```

**Coleção vazia**:
```java
List<String> vazia = new ArrayList<>();
String resultado = String.join(",", vazia);
// "" (retorna String vazia)

String[] arrayVazio = new String[0];
String resultado2 = String.join(",", arrayVazio);
// "" (também retorna vazia)
```

### 4️⃣ Comportamento com Null

**Delimitador null lança NPE**:

```java
String[] elementos = {"a", "b", "c"};

// ❌ NullPointerException
String resultado = String.join(null, elementos);  // NPE

// ✓ Delimitador deve ser não-null (pode ser vazio "")
String resultado2 = String.join("", elementos);  // "abc"
```

**Elementos null lançam NPE**:
```java
// ❌ NullPointerException se qualquer elemento for null
String resultado = String.join(",", "a", null, "c");  // NPE

String[] array = {"a", null, "c"};
String resultado2 = String.join(",", array);  // NPE

// Null em elementos NÃO é permitido
```

**Filtrar nulls antes de join()**:
```java
String[] elementos = {"a", null, "b", null, "c"};

// Filtrar nulls com Stream
String resultado = String.join(",", 
    Arrays.stream(elementos)
        .filter(Objects::nonNull)
        .toArray(String[]::new)
);
// "a,b,c"

// Ou com loop
List<String> semNull = new ArrayList<>();
for (String elem : elementos) {
    if (elem != null) {
        semNull.add(elem);
    }
}
String resultado2 = String.join(",", semNull);
// "a,b,c"
```

### 5️⃣ Comparação com Alternativas

**join() vs StringBuilder em loop**:

```java
String[] elementos = {"a", "b", "c", "d", "e"};

// StringBuilder manual
StringBuilder sb = new StringBuilder();
for (int i = 0; i < elementos.length; i++) {
    if (i > 0) sb.append(",");
    sb.append(elementos[i]);
}
String resultado1 = sb.toString();  // "a,b,c,d,e"

// String.join() - mais conciso e legível
String resultado2 = String.join(",", elementos);  // "a,b,c,d,e"

// join() internamente usa StringBuilder, mas código é mais limpo
```

**Performance comparada**:
```java
String[] array = new String[1000];
Arrays.fill(array, "item");

// StringBuilder manual - ~200 microssegundos
long inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < array.length; i++) {
    if (i > 0) sb.append(",");
    sb.append(array[i]);
}
String r1 = sb.toString();
long tempo1 = System.nanoTime() - inicio;

// String.join() - ~220 microssegundos (similar)
inicio = System.nanoTime();
String r2 = String.join(",", array);
long tempo2 = System.nanoTime() - inicio;

// Performance similar, mas join() é MUITO mais legível
```

**join() vs Collectors.joining() (Streams)**:
```java
List<String> lista = Arrays.asList("a", "b", "c");

// String.join() - direto
String r1 = String.join(",", lista);

// Collectors.joining() com Stream
String r2 = lista.stream()
    .collect(Collectors.joining(","));

// Ambos produzem "a,b,c"
// join() mais direto, joining() útil em pipelines de Streams
```

### 6️⃣ Uso com Streams - Collectors.joining()

**Integração com Streams API**:

```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");

// Filtrar e juntar
String resultado = nomes.stream()
    .filter(n -> n.startsWith("A") || n.startsWith("C"))
    .collect(Collectors.joining(", "));
// "Ana, Carlos"

// Map e juntar
String maiusculas = nomes.stream()
    .map(String::toUpperCase)
    .collect(Collectors.joining(" | "));
// "ANA | BRUNO | CARLOS"
```

**Collectors.joining() com prefixo e sufixo**:
```java
List<String> itens = Arrays.asList("item1", "item2", "item3");

// Com prefixo e sufixo
String resultado = itens.stream()
    .collect(Collectors.joining(", ", "[", "]"));
// "[item1, item2, item3]"

// String.join() não tem prefixo/sufixo
// Para isso, precisa concatenar manualmente:
String resultado2 = "[" + String.join(", ", itens) + "]";
```

### 7️⃣ Casos de Uso Práticos

**Gerar CSV**:

```java
String[] campos = {"João", "30", "São Paulo"};
String csvLine = String.join(",", campos);
// "João,30,São Paulo"

// Com List
List<String> dados = Arrays.asList("Maria", "25", "Rio de Janeiro");
String csvLine2 = String.join(",", dados);
// "Maria,25,Rio de Janeiro"
```

**Construir path/URL**:
```java
String[] segmentos = {"home", "user", "documents", "file.txt"};
String path = String.join("/", segmentos);
// "home/user/documents/file.txt"

// Adicionar prefixo
String fullPath = "/" + path;
// "/home/user/documents/file.txt"
```

**Formatar lista para exibição**:
```java
List<String> frutas = Arrays.asList("Maçã", "Banana", "Laranja", "Uva");

String lista = String.join(", ", frutas);
System.out.println("Frutas disponíveis: " + lista);
// "Frutas disponíveis: Maçã, Banana, Laranja, Uva"

// Com "e" antes do último
if (frutas.size() > 1) {
    String ultimaFruta = frutas.get(frutas.size() - 1);
    List<String> semUltima = frutas.subList(0, frutas.size() - 1);
    String resultado = String.join(", ", semUltima) + " e " + ultimaFruta;
    System.out.println(resultado);
    // "Maçã, Banana, Laranja e Uva"
}
```

**Gerar SQL IN clause**:
```java
List<Integer> ids = Arrays.asList(1, 5, 10, 15);

String idsStr = ids.stream()
    .map(String::valueOf)
    .collect(Collectors.joining(", "));

String sql = "SELECT * FROM users WHERE id IN (" + idsStr + ")";
// "SELECT * FROM users WHERE id IN (1, 5, 10, 15)"
```

**Concatenar linhas de texto**:
```java
List<String> linhas = Arrays.asList(
    "Primeira linha",
    "Segunda linha",
    "Terceira linha"
);

String texto = String.join("\n", linhas);
System.out.println(texto);
// Primeira linha
// Segunda linha
// Terceira linha
```

### 8️⃣ Inverso: join() e split()

**Operações inversas**:

```java
// Array → String com join()
String[] array = {"a", "b", "c"};
String joined = String.join(",", array);
// "a,b,c"

// String → Array com split()
String[] array2 = joined.split(",");
// ["a", "b", "c"]

// array == array2 (conteúdo igual)
```

**Ciclo completo**:
```java
List<String> original = Arrays.asList("Java", "Python", "JavaScript");

// 1. Join
String joined = String.join("|", original);
// "Java|Python|JavaScript"

// 2. Split
String[] array = joined.split("\\|");  // escape | (metacaractere)
// ["Java", "Python", "JavaScript"]

// 3. Volta para List
List<String> restaurada = Arrays.asList(array);

// original.equals(restaurada) = true
```

**Atenção com delimitadores especiais**:
```java
String[] array = {"a", "b", "c"};

// Join com ponto
String joined = String.join(".", array);
// "a.b.c"

// ❌ Split sem escape
String[] errado = joined.split(".");
// []  (ponto é metacaractere - divide tudo)

// ✓ Split com escape
String[] correto = joined.split("\\.");
// ["a", "b", "c"]
```

### 9️⃣ Performance e Complexidade

**Complexidade temporal**:
```java
// String.join()
// Tempo: O(n × m) onde n = número elementos, m = tamanho médio
// Espaço: O(k) onde k = tamanho total da String resultante

String[] array = new String[1_000_000];
Arrays.fill(array, "item");

long inicio = System.nanoTime();
String joined = String.join(",", array);
long tempo = System.nanoTime() - inicio;
// Tempo cresce linearmente com número de elementos
```

**Implementação conceitual**:
```java
// Internamente, join() usa StringBuilder
public static String join(CharSequence delimiter, CharSequence... elements) {
    StringBuilder sb = new StringBuilder();
    
    for (int i = 0; i < elements.length; i++) {
        if (i > 0) {
            sb.append(delimiter);
        }
        sb.append(elements[i]);
    }
    
    return sb.toString();
}

// Eficiente - uma alocação de StringBuilder
```

**Benchmark com alternativas**:
```java
String[] array = new String[10000];
Arrays.fill(array, "test");

// String.join() - ~2ms
long t1 = System.nanoTime();
String r1 = String.join(",", array);
long tempo1 = System.nanoTime() - t1;

// StringBuilder manual - ~2ms (similar)
long t2 = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < array.length; i++) {
    if (i > 0) sb.append(",");
    sb.append(array[i]);
}
String r2 = sb.toString();
long tempo2 = System.nanoTime() - t2;

// Collectors.joining() - ~2.5ms (ligeiramente mais lento)
long t3 = System.nanoTime();
String r3 = Arrays.stream(array).collect(Collectors.joining(","));
long tempo3 = System.nanoTime() - t3;
```

### 🔟 Null Safety e Validações

**Validar delimitador**:

```java
String delimiter = obterDelimitador();

// ✓ Verificar null
if (delimiter == null) {
    delimiter = "";  // Usar vazio como padrão
}

String resultado = String.join(delimiter, elementos);

// Ou usar operador ternário
String resultado2 = String.join(
    delimiter != null ? delimiter : "",
    elementos
);
```

**Validar elementos**:
```java
String[] elementos = obterElementos();

// ✓ Verificar null e filtrar
if (elementos != null) {
    // Filtrar nulls dos elementos
    String resultado = String.join(",",
        Arrays.stream(elementos)
            .filter(Objects::nonNull)
            .toArray(String[]::new)
    );
}

// Ou fornecer padrão
String resultado = (elementos != null) 
    ? String.join(",", elementos)
    : "";
```

**Validar coleção**:
```java
List<String> lista = obterLista();

// ✓ Verificar null e vazia
if (lista != null && !lista.isEmpty()) {
    String resultado = String.join(",", lista);
} else {
    String resultado = "";  // Padrão para null ou vazia
}
```

## 🎯 Aplicabilidade

**1. Gerar CSV/TSV**:
```java
String csvLine = String.join(",", campos);
String tsvLine = String.join("\t", campos);
```

**2. Construir Paths/URLs**:
```java
String path = String.join("/", segmentos);
String url = "https://" + String.join("/", dominio, recurso);
```

**3. Formatar Listas para Display**:
```java
String lista = String.join(", ", itens);
```

**4. Construir Queries SQL**:
```java
String inClause = String.join(", ", ids);
String sql = "SELECT * FROM table WHERE id IN (" + inClause + ")";
```

**5. Concatenar Linhas de Texto**:
```java
String texto = String.join("\n", linhas);
```

## ⚠️ Armadilhas Comuns

**1. Delimitador Null**:
```java
String.join(null, array);  // ❌ NullPointerException
String.join("", array);     // ✓ Correto
```

**2. Elementos Null**:
```java
String.join(",", "a", null, "c");  // ❌ NPE
// Filtrar nulls antes
```

**3. Esquecer Escape em split() Inverso**:
```java
String joined = String.join(".", array);
joined.split(".");   // ❌ [] (divide tudo)
joined.split("\\.");  // ✓ Correto
```

**4. Confundir com Collectors.joining()**:
```java
// String.join() - sem prefixo/sufixo
String.join(",", lista);  // "a,b,c"

// Collectors.joining() - tem prefixo/sufixo
lista.stream().collect(Collectors.joining(",", "[", "]"));  // "[a,b,c]"
```

**5. Usar em Tipos Não-CharSequence**:
```java
Integer[] numeros = {1, 2, 3};
String.join(",", numeros);  // ❌ Erro de compilação

// ✓ Converter para String antes
String.join(",", 
    Arrays.stream(numeros)
        .map(String::valueOf)
        .toArray(String[]::new)
);
```

## ✅ Boas Práticas

**1. Validar Null em Delimitador e Elementos**:
```java
if (delimiter != null && elementos != null) {
    String.join(delimiter, elementos);
}
```

**2. Filtrar Nulls Antes de Join**:
```java
String.join(",",
    Arrays.stream(array)
        .filter(Objects::nonNull)
        .toArray(String[]::new)
);
```

**3. Usar Collectors.joining() para Prefixo/Sufixo**:
```java
lista.stream().collect(Collectors.joining(", ", "[", "]"));
```

**4. Preferir join() a StringBuilder Manual**:
```java
// ✓ Mais legível
String.join(",", array);

// ✗ Verboso
StringBuilder sb = new StringBuilder();
for (String s : array) {
    if (sb.length() > 0) sb.append(",");
    sb.append(s);
}
```

**5. Lembrar de Escape ao Usar split() Inverso**:
```java
String joined = String.join(".", array);
String[] back = joined.split("\\.");  // Escape necessário
```

## 📚 Resumo Executivo

**String.join()** concatena elementos com **delimitador**.

**Assinaturas** (Java 8+):
```java
String join(CharSequence delimiter, CharSequence... elements)  // Varargs
String join(CharSequence delimiter, Iterable<? extends CharSequence> elements)  // Iterable
```

**Uso básico**:
```java
String.join(",", "a", "b", "c");  // "a,b,c"

String[] array = {"x", "y", "z"};
String.join("-", array);  // "x-y-z"

List<String> lista = Arrays.asList("1", "2", "3");
String.join("|", lista);  // "1|2|3"
```

**Delimitador vazio**:
```java
String.join("", "H", "i");  // "Hi"
```

**Elementos vazios preservados**:
```java
String.join(",", "a", "", "c");  // "a,,c"
```

**Null não permitido**:
```java
String.join(null, array);  // ❌ NPE (delimitador)
String.join(",", "a", null, "c");  // ❌ NPE (elemento)
```

**Inverso de split()**:
```java
String[] array = {"a", "b", "c"};
String joined = String.join(",", array);  // "a,b,c"
String[] back = joined.split(",");  // ["a", "b", "c"]
```

**Com Streams**:
```java
lista.stream()
    .filter(s -> s.length() > 2)
    .collect(Collectors.joining(", "));

// Collectors.joining() tem prefixo/sufixo
.collect(Collectors.joining(", ", "[", "]"));  // "[a, b, c]"
```

**Performance**: O(n × m) - eficiente (usa StringBuilder)

**Casos de uso**:
```java
// CSV
String.join(",", campos);

// Path
String.join("/", segmentos);

// Lista
String.join(", ", itens);

// SQL IN
"WHERE id IN (" + String.join(", ", ids) + ")";
```

**Recomendação**: Prefira `String.join()` a loops manuais - mais legível e conciso