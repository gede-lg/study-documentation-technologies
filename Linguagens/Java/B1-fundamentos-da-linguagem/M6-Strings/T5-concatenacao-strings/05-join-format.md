# String.join() e String.format() para Concatenação

## 🎯 Introdução e Definição

**String.join()** e **String.format()** são métodos estáticos que oferecem **alternativas especializadas** para concatenação de Strings. Enquanto join() é ideal para **unir arrays ou coleções com delimitador**, format() é perfeito para **interpolação com formatação precisa**.

**Conceito central**: Ambos métodos oferecem **abordagens declarativas** para concatenação, em contraste com o uso imperativo de `+` ou StringBuilder. São mais **legíveis e expressivos** para seus casos de uso específicos.

**Exemplo fundamental**:
```java
// String.join() - array com delimitador
String[] nomes = {"Ana", "João", "Maria"};
String lista = String.join(", ", nomes);
System.out.println(lista);  // "Ana, João, Maria"

// String.format() - interpolação formatada
String nome = "João";
int idade = 30;
double salario = 5000.50;
String info = String.format("Nome: %s, Idade: %d, Salário: R$ %.2f", 
                             nome, idade, salario);
System.out.println(info);  // "Nome: João, Idade: 30, Salário: R$ 5000.50"

// vs concatenação tradicional
String lista2 = nomes[0] + ", " + nomes[1] + ", " + nomes[2];  // Verboso
String info2 = "Nome: " + nome + ", Idade: " + idade + 
               ", Salário: R$ " + salario;  // Sem formatação
```

**Características principais**:
- **String.join()**: une elementos com delimitador, performance similar a StringBuilder
- **String.format()**: interpolação printf-style, ~10x mais lento mas formatação precisa
- **Legibilidade**: declarativos e expressivos vs imperativos
- **Casos de uso**: join() para listas, format() para formatação complexa

## 📋 Fundamentos Teóricos

### 1️⃣ String.join() - Fundamentos

**Assinaturas**:

```java
// Varargs - aceita elementos variáveis
public static String join(CharSequence delimiter, CharSequence... elements)

// Iterable - aceita List, Set, etc.
public static String join(CharSequence delimiter, Iterable<? extends CharSequence> elements)
```

**Uso básico**:
```java
// Array
String[] partes = {"A", "B", "C"};
String resultado = String.join("-", partes);
System.out.println(resultado);  // "A-B-C"

// Varargs direto
String resultado2 = String.join(", ", "Ana", "João", "Maria");
// "Ana, João, Maria"

// List
List<String> lista = Arrays.asList("X", "Y", "Z");
String resultado3 = String.join(" | ", lista);
// "X | Y | Z"

// Delimitador vazio
String resultado4 = String.join("", "H", "e", "l", "l", "o");
// "Hello"
```

**Implementação interna (simplificada)**:
```java
public static String join(CharSequence delimiter, CharSequence... elements) {
    Objects.requireNonNull(delimiter);
    Objects.requireNonNull(elements);
    
    // Usa StringJoiner internamente
    StringJoiner joiner = new StringJoiner(delimiter);
    for (CharSequence cs : elements) {
        joiner.add(cs);
    }
    return joiner.toString();
}

// StringJoiner usa StringBuilder
class StringJoiner {
    private final String delimiter;
    private final StringBuilder value;
    
    public StringJoiner add(CharSequence cs) {
        if (value.length() > 0) {
            value.append(delimiter);  // Adiciona delimitador
        }
        value.append(cs);
        return this;
    }
}
```

### 2️⃣ String.join() - Performance

**Comparação com alternativas**:

```java
String[] partes = new String[1000];
for (int i = 0; i < 1000; i++) {
    partes[i] = "Item" + i;
}

// String.join() - ~2ms
long inicio = System.nanoTime();
String r1 = String.join(", ", partes);
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Loop com + - ~200ms
inicio = System.nanoTime();
String r2 = "";
for (int i = 0; i < partes.length; i++) {
    if (i > 0) r2 += ", ";
    r2 += partes[i];
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

// StringBuilder manual - ~2ms
inicio = System.nanoTime();
StringBuilder sb = new StringBuilder();
for (int i = 0; i < partes.length; i++) {
    if (i > 0) sb.append(", ");
    sb.append(partes[i]);
}
String r3 = sb.toString();
long tempo3 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("String.join(): " + tempo1 + "ms");  // ~2ms
System.out.println("Loop +: " + tempo2 + "ms");         // ~200ms
System.out.println("StringBuilder: " + tempo3 + "ms");   // ~2ms

// join() é ~100x mais rápido que +
// join() similar a StringBuilder (mais legível)
```

**Complexidade**:
```java
// String.join() - O(n)
// Usa StringBuilder internamente
// Cada elemento adicionado em O(1) amortizado

// Loop com + - O(n²)
// Cada += cria nova String e copia anterior
```

### 3️⃣ String.join() - Casos de Uso

**CSV (Comma-Separated Values)**:

```java
String[] valores = {"João", "30", "São Paulo", "Desenvolvedor"};
String csv = String.join(",", valores);
System.out.println(csv);  // "João,30,São Paulo,Desenvolvedor"

// Lista de objetos
List<Pessoa> pessoas = getPessoas();
List<String> nomes = pessoas.stream()
                            .map(Pessoa::getNome)
                            .collect(Collectors.toList());
String listaNomes = String.join(", ", nomes);
```

**Path/URL construction**:
```java
String baseUrl = "https://api.example.com";
String[] segmentos = {"v1", "users", "123", "orders"};
String path = String.join("/", segmentos);
String url = baseUrl + "/" + path;
// "https://api.example.com/v1/users/123/orders"
```

**SQL IN clause**:
```java
List<Integer> ids = Arrays.asList(1, 2, 3, 4, 5);
List<String> idsStr = ids.stream()
                         .map(String::valueOf)
                         .collect(Collectors.toList());
String inClause = String.join(", ", idsStr);
String sql = "SELECT * FROM users WHERE id IN (" + inClause + ")";
// "SELECT * FROM users WHERE id IN (1, 2, 3, 4, 5)"
```

**Formatted lists**:
```java
String[] tarefas = {"Estudar Java", "Fazer exercícios", "Revisar código"};
String lista = "Tarefas:\n- " + String.join("\n- ", tarefas);
System.out.println(lista);
// Tarefas:
// - Estudar Java
// - Fazer exercícios
// - Revisar código
```

### 4️⃣ Collectors.joining() - Alternativa para Streams

**joining() com streams**:

```java
List<String> nomes = Arrays.asList("Ana", "João", "Maria");

// String.join()
String r1 = String.join(", ", nomes);

// Collectors.joining()
String r2 = nomes.stream()
                 .collect(Collectors.joining(", "));

// Ambos produzem: "Ana, João, Maria"
```

**joining() com prefix/suffix**:
```java
List<String> itens = Arrays.asList("A", "B", "C");

// Com prefix e suffix
String resultado = itens.stream()
    .collect(Collectors.joining(", ", "[", "]"));
System.out.println(resultado);  // "[A, B, C]"

// String.join() NÃO suporta prefix/suffix
String r2 = "[" + String.join(", ", itens) + "]";  // Manual
```

**Transformação + joining**:
```java
List<Pessoa> pessoas = getPessoas();

// Mapear nome + idade, depois juntar
String info = pessoas.stream()
    .map(p -> p.getNome() + " (" + p.getIdade() + ")")
    .collect(Collectors.joining(", "));
// "Ana (25), João (30), Maria (28)"

// vs String.join() - precisa preparar lista antes
List<String> infos = pessoas.stream()
    .map(p -> p.getNome() + " (" + p.getIdade() + ")")
    .collect(Collectors.toList());
String resultado = String.join(", ", infos);
```

### 5️⃣ String.format() - Fundamentos

**Assinatura**:

```java
public static String format(String format, Object... args)
public static String format(Locale l, String format, Object... args)
```

**Especificadores básicos**:
```java
// %s - String
String s1 = String.format("Nome: %s", "João");
// "Nome: João"

// %d - inteiro decimal
String s2 = String.format("Idade: %d", 30);
// "Idade: 30"

// %f - float/double
String s3 = String.format("Preço: %f", 19.99);
// "Preço: 19.990000"

// %.2f - float com 2 decimais
String s4 = String.format("Preço: %.2f", 19.99);
// "Preço: 19.99"

// %n - newline (independente de plataforma)
String s5 = String.format("Line 1%nLine 2");
// "Line 1\nLine 2" (ou \r\n no Windows)
```

**Múltiplos argumentos**:
```java
String nome = "João";
int idade = 30;
double salario = 5000.50;

String info = String.format(
    "Nome: %s, Idade: %d, Salário: R$ %.2f",
    nome, idade, salario
);
// "Nome: João, Idade: 30, Salário: R$ 5000.50"

// vs concatenação
String info2 = "Nome: " + nome + ", Idade: " + idade + 
               ", Salário: R$ " + salario;
// "Nome: João, Idade: 30, Salário: R$ 5000.5" (sem formatação decimal)
```

### 6️⃣ String.format() - Formatação Avançada

**Width e alignment**:

```java
// %10s - width 10, right-aligned
String s1 = String.format("|%10s|", "Test");
// "|      Test|"

// %-10s - width 10, left-aligned
String s2 = String.format("|%-10s|", "Test");
// "|Test      |"

// %05d - width 5, zero-padding
String s3 = String.format("%05d", 42);
// "00042"
```

**Flags**:
```java
// + - sempre mostrar sinal
String.format("%+d", 10);   // "+10"
String.format("%+d", -10);  // "-10"

// , - separador de milhares
String.format("%,d", 1000000);  // "1,000,000"

// ( - parênteses para negativos
String.format("%(d", -10);  // "(10)"
String.format("%(d", 10);   // "10"

// 0 - zero padding
String.format("%08d", 42);  // "00000042"

// - - left-align
String.format("%-10s", "Test");  // "Test      "
```

**Formatação de decimais**:
```java
double valor = 1234.5678;

// %.2f - 2 casas decimais
String.format("%.2f", valor);  // "1234.57"

// %,f - separador de milhares
String.format("%,f", valor);  // "1,234.567800"

// %,.2f - milhares + 2 decimais
String.format("%,.2f", valor);  // "1,234.57"

// %10.2f - width 10, 2 decimais
String.format("%10.2f", valor);  // "   1234.57"
```

### 7️⃣ String.format() - Performance

**Comparação com concatenação**:

```java
String nome = "João";
int idade = 30;

// String.format() - ~1000ns
long inicio = System.nanoTime();
String r1 = String.format("Nome: %s, Idade: %d", nome, idade);
long tempo1 = System.nanoTime() - inicio;

// + - ~100ns
inicio = System.nanoTime();
String r2 = "Nome: " + nome + ", Idade: " + idade;
long tempo2 = System.nanoTime() - inicio;

// StringBuilder - ~150ns
inicio = System.nanoTime();
String r3 = new StringBuilder()
    .append("Nome: ").append(nome)
    .append(", Idade: ").append(idade)
    .toString();
long tempo3 = System.nanoTime() - inicio;

System.out.println("format(): " + tempo1 + "ns");     // ~1000ns
System.out.println("+: " + tempo2 + "ns");            // ~100ns
System.out.println("StringBuilder: " + tempo3 + "ns"); // ~150ns

// format() é ~10x mais lento que +
```

**Quando a lentidão compensa**:
```java
double valor = 1234567.89;

// format() - formatação precisa em uma linha
String s1 = String.format("Total: R$ %,.2f", valor);
// "Total: R$ 1,234,567.89"

// + - precisa NumberFormat (mais verboso)
NumberFormat nf = NumberFormat.getInstance();
nf.setMinimumFractionDigits(2);
nf.setMaximumFractionDigits(2);
String s2 = "Total: R$ " + nf.format(valor);

// format() é mais simples para formatação complexa
```

### 8️⃣ String.format() para Concatenação

**Templates reutilizáveis**:

```java
// Template de mensagem
String template = "Olá %s, você tem %d mensagens não lidas.";

// Usar com diferentes valores
String msg1 = String.format(template, "João", 5);
// "Olá João, você tem 5 mensagens não lidas."

String msg2 = String.format(template, "Maria", 12);
// "Olá Maria, você tem 12 mensagens não lidas."
```

**Relatórios formatados**:
```java
List<Produto> produtos = getProdutos();

StringBuilder relatorio = new StringBuilder();
relatorio.append(String.format("%-20s %10s %10s%n", 
                               "Produto", "Qtd", "Preço"));
relatorio.append("-".repeat(42)).append("\n");

for (Produto p : produtos) {
    String linha = String.format("%-20s %10d %10.2f%n",
                                 p.getNome(), p.getQtd(), p.getPreco());
    relatorio.append(linha);
}

System.out.println(relatorio);
// Produto                   Qtd      Preço
// ------------------------------------------
// Mouse                      10      29.90
// Teclado                     5     149.90
```

**Interpolação complexa**:
```java
String nome = "João";
int idade = 30;
double altura = 1.75;
double peso = 75.5;
double imc = peso / (altura * altura);

String info = String.format(
    "Paciente: %s%n" +
    "Idade: %d anos%n" +
    "Altura: %.2fm%n" +
    "Peso: %.1fkg%n" +
    "IMC: %.2f",
    nome, idade, altura, peso, imc
);

System.out.println(info);
// Paciente: João
// Idade: 30 anos
// Altura: 1.75m
// Peso: 75.5kg
// IMC: 24.65
```

### 9️⃣ Combinando join() e format()

**join() com elementos formatados**:

```java
List<Produto> produtos = getProdutos();

// Formatar cada produto, depois juntar
List<String> linhas = produtos.stream()
    .map(p -> String.format("%s: R$ %.2f", p.getNome(), p.getPreco()))
    .collect(Collectors.toList());

String catalogo = String.join("\n", linhas);
System.out.println(catalogo);
// Mouse: R$ 29.90
// Teclado: R$ 149.90
// Monitor: R$ 899.90
```

**format() com join() interno**:
```java
String[] nomes = {"Ana", "João", "Maria"};
String lista = String.join(", ", nomes);

String mensagem = String.format(
    "Participantes (%d): %s",
    nomes.length, lista
);
// "Participantes (3): Ana, João, Maria"
```

**Template com múltiplas seções**:
```java
String[] tarefasPendentes = {"Estudar", "Revisar"};
String[] tarefasConcluidas = {"Ler", "Praticar"};

String pendentes = String.join("\n- ", tarefasPendentes);
String concluidas = String.join("\n- ", tarefasConcluidas);

String relatorio = String.format(
    "=== TAREFAS ===%n%n" +
    "Pendentes (%d):%n- %s%n%n" +
    "Concluídas (%d):%n- %s",
    tarefasPendentes.length, pendentes,
    tarefasConcluidas.length, concluidas
);

System.out.println(relatorio);
// === TAREFAS ===
//
// Pendentes (2):
// - Estudar
// - Revisar
//
// Concluídas (2):
// - Ler
// - Praticar
```

### 🔟 Comparação e Escolha

**Matriz de decisão**:

| Cenário | Recomendação | Motivo |
|---------|--------------|--------|
| **Array com delimitador** | String.join() | Simples, eficiente, legível |
| **Lista de Strings** | String.join() | Direto, O(n) |
| **Formatação de números** | String.format() | Controle preciso (decimais, padding) |
| **Template reutilizável** | String.format() | Separação dados/formato |
| **2-5 Strings simples** | + | Mais rápido, conciso |
| **Loop** | StringBuilder | Essencial (O(n) vs O(n²)) |
| **Transformar + juntar** | Collectors.joining() | Integração com streams |
| **Prefix/suffix** | Collectors.joining() | Suporte nativo |
| **Performance crítica** | + ou StringBuilder | Mais rápidos |

**Exemplos comparativos**:
```java
String[] itens = {"A", "B", "C"};

// join() - ideal para array com delimitador
String.join(", ", itens);  // ✓

// format() - desnecessário aqui
String.format("%s, %s, %s", itens[0], itens[1], itens[2]);  // ⚠️

// + - verboso
itens[0] + ", " + itens[1] + ", " + itens[2];  // ⚠️

// ----------------

double valor = 1234.56;

// format() - ideal para formatação
String.format("%.2f", valor);  // ✓

// + - sem formatação
"" + valor;  // "1234.56" (não "1234.56")

// join() - não aplicável
// ❌

// ----------------

String a = "A", b = "B";

// + - ideal para simples
a + " " + b;  // ✓

// format() - desnecessário
String.format("%s %s", a, b);  // ⚠️ Mais lento

// join() - funciona mas +  é melhor
String.join(" ", a, b);  // ⚠️
```

## 🎯 Aplicabilidade

**1. String.join() - Arrays com Delimitador**:
```java
String.join(", ", array);
```

**2. String.format() - Formatação de Números**:
```java
String.format("%.2f", valor);
```

**3. Collectors.joining() - Streams**:
```java
stream.collect(Collectors.joining(", "));
```

**4. format() - Templates**:
```java
String.format(template, args...);
```

**5. Combinar join() + format()**:
```java
String.format("Total: %s", String.join(", ", itens));
```

## ⚠️ Armadilhas Comuns

**1. format() para Simples Concatenação**:
```java
String.format("%s %s", a, b);  // ⚠️ Lento
a + " " + b;  // ✓
```

**2. join() em Loop**:
```java
for (...) {
    s = String.join(...);  // ❌ Cria lista/array a cada vez
}
```

**3. Esquecer %.2f para Decimais**:
```java
String.format("%f", 19.99);  // "19.990000" ⚠️
String.format("%.2f", 19.99);  // "19.99" ✓
```

**4. null em join()**:
```java
String[] arr = {"A", null, "C"};
String.join(",", arr);  // ❌ NullPointerException
```

**5. Usar join() sem Delimitador Quando + é Melhor**:
```java
String.join("", "A", "B");  // ⚠️
"A" + "B";  // ✓ Mais simples
```

## ✅ Boas Práticas

**1. join() para Arrays/Listas**:
```java
String.join(", ", array);
```

**2. format() para Formatação Complexa**:
```java
String.format("%,.2f", valor);
```

**3. + para Simples Concatenação**:
```java
a + " " + b;  // Não format()
```

**4. Collectors.joining() com Streams**:
```java
stream.collect(Collectors.joining(", ", "[", "]"));
```

**5. Combinar Métodos Apropriadamente**:
```java
String.format("Items: %s", String.join(", ", list));
```

## 📚 Resumo Executivo

**String.join()** e **String.format()** são alternativas especializadas.

**String.join() - arrays/listas**:
```java
String[] arr = {"A", "B", "C"};
String.join(", ", arr);  // "A, B, C"

List<String> list = Arrays.asList("X", "Y");
String.join(" | ", list);  // "X | Y"
```

**Performance join()**:
```java
String.join():  ~2ms/1000 elementos  ✓ O(n)
Loop +:         ~200ms               ❌ O(n²)
StringBuilder:  ~2ms                 ✓ O(n)
```

**String.format() - interpolação**:
```java
String.format("Nome: %s, Idade: %d, Salário: %.2f", 
              nome, idade, salario);
```

**Performance format()**:
```java
String.format():  ~1000ns  ⚠️ 10x mais lento que +
+:                ~100ns   ✓
```

**Quando usar cada um**:
```java
// join() - array/lista com delimitador
String.join(",", array);  ✓

// format() - formatação complexa (decimais, padding)
String.format("%.2f", valor);  ✓

// + - simples concatenação (2-5 Strings)
a + " " + b;  ✓

// StringBuilder - loops
for (...) sb.append(...);  ✓
```

**Collectors.joining()**:
```java
stream.collect(Collectors.joining(", ", "[", "]"));
// Suporta prefix/suffix
```

**Recomendação**: Use **String.join()** para arrays/listas com delimitador. Use **String.format()** apenas quando formatação precisa é necessária. Prefira **+** para concatenações simples.