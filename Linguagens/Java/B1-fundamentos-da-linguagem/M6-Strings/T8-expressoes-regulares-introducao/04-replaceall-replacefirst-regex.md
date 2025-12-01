# replaceAll() e replaceFirst() com Regex

## 🎯 Introdução e Definição

**replaceAll() e replaceFirst() são métodos que substituem texto** usando expressões regulares, permitindo **substituições inteligentes** baseadas em padrões. **replaceAll()** substitui **todas as ocorrências**, enquanto **replaceFirst()** substitui **apenas a primeira**. O poder está em usar **backreferences ($1, $2)** para rearranjar ou transformar o texto encontrado.

**Conceito central**: Diferente de substituição literal (como String.replace()), esses métodos usam **regex para encontrar** e **backreferences para construir** o texto de substituição. Você pode **capturar partes** do texto encontrado (grupos) e **reutilizá-las** na substituição com $1, $2, etc.

**Exemplo fundamental**:
```java
String texto = "João Silva, Maria Santos";

// Substituição com regex e backreferences
Pattern pattern = Pattern.compile("(\\w+) (\\w+)");
Matcher matcher = pattern.matcher(texto);

// $1 = primeiro grupo, $2 = segundo grupo
String resultado = matcher.replaceAll("$2, $1");
System.out.println(resultado);  // "Silva, João, Santos, Maria"
```

**Características principais**:
- **replaceAll()**: substitui todas as ocorrências
- **replaceFirst()**: substitui apenas a primeira
- **Backreferences ($1, $2)**: reutiliza grupos capturados
- **Método de Matcher** (reutiliza Pattern compilado)
- **String.replaceAll()** existe mas recompila regex

## 📋 Fundamentos Teóricos

### 1️⃣ replaceAll() - Substituir Todas

**Comportamento básico**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

// Substituir todos os números por "X"
String resultado = matcher.replaceAll("X");
System.out.println(resultado);  // "X X X"
```

**Com String.replaceAll()**:
```java
String texto = "10 20 30";

// String.replaceAll() - conveniência
String resultado = texto.replaceAll("\\d+", "X");
System.out.println(resultado);  // "X X X"

// ⚠️ String.replaceAll() compila Pattern a cada chamada
// Para uso repetido, Matcher.replaceAll() é mais eficiente
```

**Diferença Matcher vs String**:
```java
// Matcher - Pattern pré-compilado
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20");
String r1 = matcher.replaceAll("X");  // Usa Pattern já compilado

// String - compila Pattern internamente
String r2 = "10 20".replaceAll("\\d+", "X");  // Compila \\d+ novamente

// Resultado idêntico, performance diferente em loops
```

**replaceAll() retorna nova String**:
```java
String original = "10 20 30";
Matcher matcher = pattern.matcher(original);

String novo = matcher.replaceAll("X");

System.out.println(original);  // "10 20 30" (inalterado)
System.out.println(novo);      // "X X X"
```

**Substituição com regex complexo**:
```java
String html = "<b>negrito</b> e <i>itálico</i>";

// Remover todas as tags HTML
String semTags = html.replaceAll("<[^>]+>", "");
System.out.println(semTags);  // "negrito e itálico"
```

**Substituir múltiplos espaços**:
```java
String texto = "Java    é    legal";

// Substituir um ou mais espaços por um único
String normalizado = texto.replaceAll("\\s+", " ");
System.out.println(normalizado);  // "Java é legal"
```

### 2️⃣ replaceFirst() - Substituir Primeira

**Comportamento básico**:

```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20 30");

// Substituir apenas o primeiro número
String resultado = matcher.replaceFirst("X");
System.out.println(resultado);  // "X 20 30"
```

**Com String.replaceFirst()**:
```java
String texto = "10 20 30";

String resultado = texto.replaceFirst("\\d+", "X");
System.out.println(resultado);  // "X 20 30"
```

**Uso prático - trocar primeira palavra**:
```java
String frase = "Java é muito bom";

// Substituir primeira palavra
String nova = frase.replaceFirst("\\w+", "Python");
System.out.println(nova);  // "Python é muito bom"
```

**replaceFirst() vs replace()**:
```java
String texto = "aaa bbb aaa";

// replace() - literal, todas
String r1 = texto.replace("aaa", "X");
System.out.println(r1);  // "X bbb X"

// replaceFirst() - regex, primeira
String r2 = texto.replaceFirst("aaa", "X");
System.out.println(r2);  // "X bbb aaa"

// replaceFirst() - com regex
String r3 = texto.replaceFirst("\\w+", "X");
System.out.println(r3);  // "X bbb aaa"
```

### 3️⃣ Backreferences - $1, $2, $3

**Conceito**:

```java
// Regex com grupos (parênteses)
Pattern pattern = Pattern.compile("(\\w+) (\\w+)");
Matcher matcher = pattern.matcher("João Silva");

if (matcher.find()) {
    System.out.println(matcher.group(1));  // "João"
    System.out.println(matcher.group(2));  // "Silva"
}

// Backreferences na substituição
String invertido = matcher.replaceAll("$2, $1");
System.out.println(invertido);  // "Silva, João"
```

**$1 = grupo 1, $2 = grupo 2, etc.**:
```java
String data = "25/12/2024";

// Grupos: (dia)/(mês)/(ano)
String iso = data.replaceAll("(\\d{2})/(\\d{2})/(\\d{4})", "$3-$2-$1");
System.out.println(iso);  // "2024-12-25"
```

**Trocar ordem - nome e sobrenome**:
```java
String lista = "Silva, João; Santos, Maria; Costa, Pedro";

// (sobrenome), (nome)  →  (nome) (sobrenome)
String invertido = lista.replaceAll("(\\w+), (\\w+)", "$2 $1");
System.out.println(invertido);  // "João Silva; Maria Santos; Pedro Costa"
```

**Formatar telefone**:
```java
String telefone = "11987654321";

// (DDD)(5 dígitos)(4 dígitos)  →  (DDD) XXXXX-XXXX
String formatado = telefone.replaceAll("(\\d{2})(\\d{5})(\\d{4})", "($1) $2-$3");
System.out.println(formatado);  // "(11) 98765-4321"
```

**Escapar $ literal**:
```java
// ⚠️ $ tem significado especial (backreference)
String texto = "Preço: 10";

// ❌ $ interpretado como backreference
String errado = texto.replaceAll("\\d+", "$5");
System.out.println(errado);  // "Preço: " (erro - grupo 5 não existe)

// ✓ Escapar $ com \\$
String correto = texto.replaceAll("\\d+", "\\$5");
System.out.println(correto);  // "Preço: $5"
```

**$0 - match completo**:
```java
String texto = "10 20 30";

// $0 = texto inteiro encontrado (equivalente a matcher.group())
String resultado = texto.replaceAll("\\d+", "[$0]");
System.out.println(resultado);  // "[10] [20] [30]"
```

### 4️⃣ appendReplacement() e appendTail()

**Para substituições complexas com lógica**:

```java
String texto = "10 20 30";
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher(texto);

StringBuffer sb = new StringBuffer();

while (matcher.find()) {
    int numero = Integer.parseInt(matcher.group());
    int dobro = numero * 2;
    
    // Substituir por dobro do valor
    matcher.appendReplacement(sb, String.valueOf(dobro));
}

matcher.appendTail(sb);

System.out.println(sb.toString());  // "20 40 60"
```

**Como funciona**:
```java
// Texto: "Tenho 10 anos e 180cm"
// Regex: \\d+

// 1. matcher.find() encontra "10"
// 2. appendReplacement(sb, "X") adiciona "Tenho X" ao StringBuffer
// 3. matcher.find() encontra "180"
// 4. appendReplacement(sb, "Y") adiciona " anos e Y" ao StringBuffer
// 5. appendTail(sb) adiciona "cm" (resto após último match)

// Resultado: "Tenho X anos e Ycm"
```

**Exemplo completo**:
```java
String texto = "Preço: 100, Desconto: 50";
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher(texto);

StringBuffer sb = new StringBuffer();

while (matcher.find()) {
    int valor = Integer.parseInt(matcher.group());
    int com_imposto = (int)(valor * 1.1);  // +10%
    
    matcher.appendReplacement(sb, String.valueOf(com_imposto));
}

matcher.appendTail(sb);

System.out.println(sb);  // "Preço: 110, Desconto: 55"
```

**Mascarar dados sensíveis**:
```java
String texto = "CPF: 12345678900, RG: 123456789";
Pattern pattern = Pattern.compile("\\d{11}|\\d{9}");
Matcher matcher = pattern.matcher(texto);

StringBuffer sb = new StringBuffer();

while (matcher.find()) {
    String numero = matcher.group();
    int visivel = 3;  // Mostrar 3 primeiros dígitos
    
    String mascara = numero.substring(0, visivel) + 
                     "*".repeat(numero.length() - visivel);
    
    matcher.appendReplacement(sb, mascara);
}

matcher.appendTail(sb);

System.out.println(sb);  // "CPF: 123********, RG: 123******"
```

### 5️⃣ replaceAll(Function) - Java 9+

**Com lambda para lógica dinâmica**:

```java
String texto = "10 20 30";
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher(texto);

// replaceAll com Function (Java 9+)
String resultado = matcher.replaceAll(matchResult -> {
    int numero = Integer.parseInt(matchResult.group());
    return String.valueOf(numero * 2);
});

System.out.println(resultado);  // "20 40 60"
```

**Vantagens sobre appendReplacement()**:
```java
// Antes (Java 8) - verboso
StringBuffer sb = new StringBuffer();
while (matcher.find()) {
    int n = Integer.parseInt(matcher.group());
    matcher.appendReplacement(sb, String.valueOf(n * 2));
}
matcher.appendTail(sb);
String resultado = sb.toString();

// Agora (Java 9+) - conciso
String resultado = matcher.replaceAll(match -> {
    int n = Integer.parseInt(match.group());
    return String.valueOf(n * 2);
});
```

**Formatar moeda**:
```java
String texto = "Itens: 100, 250, 50";
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher(texto);

String formatado = matcher.replaceAll(match -> {
    int valor = Integer.parseInt(match.group());
    return String.format("R$ %.2f", valor / 100.0);
});

System.out.println(formatado);  // "Itens: R$ 1.00, R$ 2.50, R$ 0.50"
```

### 6️⃣ Casos de Uso Práticos

**Formatar CPF/CNPJ**:

```java
public static String formatarCPF(String cpf) {
    // Remove tudo que não é dígito
    String numeros = cpf.replaceAll("\\D", "");
    
    // Formata: 123.456.789-00
    return numeros.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
}

System.out.println(formatarCPF("12345678900"));  // "123.456.789-00"
System.out.println(formatarCPF("123.456.789-00"));  // "123.456.789-00" (já formatado)
```

**Ocultar email**:
```java
public static String ocultarEmail(String email) {
    // usuario@dominio.com  →  us****@dominio.com
    return email.replaceAll("(\\w{2})\\w+(@)", "$1****$2");
}

System.out.println(ocultarEmail("usuario@example.com"));  // "us****@example.com"
```

**Limpar HTML**:
```java
public static String removerTags(String html) {
    // Remove todas as tags HTML
    return html.replaceAll("<[^>]+>", "");
}

String html = "<p>Olá <b>mundo</b>!</p>";
System.out.println(removerTags(html));  // "Olá mundo!"
```

**Normalizar espaços**:
```java
public static String normalizarEspacos(String texto) {
    return texto
        .replaceAll("\\s+", " ")      // Múltiplos espaços → um
        .replaceAll("^\\s+", "")       // Remove início
        .replaceAll("\\s+$", "");      // Remove fim
}

String texto = "  Java    é    legal  ";
System.out.println(normalizarEspacos(texto));  // "Java é legal"
```

**Converter camelCase para snake_case**:
```java
public static String camelToSnake(String camel) {
    // Insere _ antes de maiúsculas e converte para minúsculas
    return camel.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase();
}

System.out.println(camelToSnake("minhaVariavel"));  // "minha_variavel"
System.out.println(camelToSnake("ClasseJava"));     // "classe_java"
```

**Mascarar cartão de crédito**:
```java
public static String mascarar Cartao(String numero) {
    // Mantém 4 últimos dígitos
    return numero.replaceAll("\\d(?=\\d{4})", "*");
}

System.out.println(mascararCartao("1234567890123456"));  // "************3456"
```

### 7️⃣ Performance

**Matcher.replaceAll() vs String.replaceAll()**:

```java
Pattern pattern = Pattern.compile("\\d+");
List<String> textos = List.of("10 20", "30 40", "50 60");

// String.replaceAll() - recompila Pattern a cada vez
long inicio = System.nanoTime();
for (String texto : textos) {
    String r = texto.replaceAll("\\d+", "X");  // Compila "\\d+" 3 vezes
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Matcher.replaceAll() - Pattern pré-compilado
inicio = System.nanoTime();
for (String texto : textos) {
    Matcher matcher = pattern.matcher(texto);
    String r = matcher.replaceAll("X");  // Usa Pattern compilado
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

// Matcher ~30% mais rápido em loops
```

**Reutilizar Matcher com reset()**:
```java
// ✓ Ainda mais eficiente
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("");

for (String texto : textos) {
    matcher.reset(texto);  // Reutiliza Matcher
    String r = matcher.replaceAll("X");
}

// ~40% mais rápido que String.replaceAll()
```

### 8️⃣ Erros Comuns

**Esquecer de escapar $**:

```java
String texto = "10";

// ❌ $ interpretado como backreference
String errado = texto.replaceAll("\\d+", "$5");
System.out.println(errado);  // "" (grupo 5 não existe)

// ✓ Escapar com \\$
String correto = texto.replaceAll("\\d+", "\\$5");
System.out.println(correto);  // "$5"
```

**Confundir grupos**:
```java
String data = "25/12/2024";

// ❌ Ordem errada dos grupos
String errado = data.replaceAll("(\\d{2})/(\\d{2})/(\\d{4})", "$1-$2-$3");
System.out.println(errado);  // "25-12-2024" (não ISO)

// ✓ Ordem correta
String correto = data.replaceAll("(\\d{2})/(\\d{2})/(\\d{4})", "$3-$2-$1");
System.out.println(correto);  // "2024-12-25" (ISO)
```

**Usar replace() quando precisa regex**:
```java
String texto = "10 20 30";

// ❌ replace() é literal (não usa regex)
String errado = texto.replace("\\d+", "X");
System.out.println(errado);  // "10 20 30" (inalterado)

// ✓ replaceAll() usa regex
String correto = texto.replaceAll("\\d+", "X");
System.out.println(correto);  // "X X X"
```

### 9️⃣ Boas Práticas

**Compilar Pattern para uso repetido**:

```java
// ❌ Evitar em loops
for (String texto : textos) {
    String r = texto.replaceAll("\\d+", "X");  // Compila a cada iteração
}

// ✓ Compilar uma vez
Pattern pattern = Pattern.compile("\\d+");
for (String texto : textos) {
    Matcher matcher = pattern.matcher(texto);
    String r = matcher.replaceAll("X");
}
```

**Documentar backreferences**:
```java
// ✓ Comentar o que cada grupo representa
String iso = data.replaceAll(
    "(\\d{2})/(\\d{2})/(\\d{4})",  // Grupo 1: dia, 2: mês, 3: ano
    "$3-$2-$1"                      // ano-mês-dia (ISO)
);
```

**Validar antes de substituir**:
```java
// ✓ Verificar se há match antes de substituir
Matcher matcher = pattern.matcher(texto);
if (matcher.find()) {
    String resultado = matcher.replaceAll(substituto);
} else {
    // Sem matches, retornar original
}
```

### 🔟 String.replaceAll() vs Matcher.replaceAll()

**String.replaceAll()**:

```java
// Conveniência - uso único
String resultado = "10 20".replaceAll("\\d+", "X");

// ⚠️ Recompila Pattern a cada chamada
// ⚠️ Lança PatternSyntaxException se regex inválido
```

**Matcher.replaceAll()**:
```java
// Performance - uso repetido
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("10 20");
String resultado = matcher.replaceAll("X");

// ✓ Pattern compilado uma vez
// ✓ Reutilizável com reset()
// ✓ Tratamento de exceção no Pattern.compile()
```

**Quando usar cada um**:
```java
// String.replaceAll() - substituição única simples
String limpo = texto.replaceAll("\\s+", " ");

// Matcher.replaceAll() - uso em loop ou complexo
Pattern pattern = Pattern.compile("\\d+");
for (String texto : lista) {
    Matcher matcher = pattern.matcher(texto);
    String resultado = matcher.replaceAll("X");
}
```

## 🎯 Aplicabilidade

**1. Formatar dados**:
```java
cpf.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4")
```

**2. Mascarar informações**:
```java
cartao.replaceAll("\\d(?=\\d{4})", "*")
```

**3. Limpar texto**:
```java
html.replaceAll("<[^>]+>", "")
```

**4. Normalizar formato**:
```java
texto.replaceAll("\\s+", " ")
```

**5. Converter formatos**:
```java
data.replaceAll("(\\d{2})/(\\d{2})/(\\d{4})", "$3-$2-$1")
```

## ⚠️ Armadilhas Comuns

**1. $ sem escape**:
```java
replaceAll("\\d+", "$5")  // ❌ backreference
replaceAll("\\d+", "\\$5")  // ✓ literal
```

**2. replace() vs replaceAll()**:
```java
replace("\\d+", "X")  // ❌ literal
replaceAll("\\d+", "X")  // ✓ regex
```

**3. Grupos errados**:
```java
replaceAll("(\\d{2})/(\\d{2})", "$2-$1")  // ✓ verificar ordem
```

**4. Recompilar em loop**:
```java
for(...) { texto.replaceAll("\\d+", "X") }  // ❌ lento
```

**5. Backreference inexistente**:
```java
replaceAll("(\\d+)", "$2")  // ❌ só tem grupo 1
```

## ✅ Boas Práticas

**1. Compilar Pattern**:
```java
Pattern p = Pattern.compile("\\d+");
m.replaceAll("X");
```

**2. Documentar grupos**:
```java
// $1: dia, $2: mês, $3: ano
```

**3. Escapar $ literal**:
```java
replaceAll("\\d+", "\\$5")
```

**4. Validar antes**:
```java
if (m.find()) { m.replaceAll(...) }
```

**5. Usar replaceAll(Function)**:
```java
m.replaceAll(match -> transform(match))
```

## 📚 Resumo Executivo

**Dois métodos de substituição**.

**replaceAll() - todas**:
```java
m.replaceAll("X")  // Substitui todas
```

**replaceFirst() - primeira**:
```java
m.replaceFirst("X")  // Só primeira
```

**Backreferences**:
```java
replaceAll("(\\w+) (\\w+)", "$2, $1")  // Inverte ordem
```

**Escapar $**:
```java
replaceAll("\\d+", "\\$5")  // $ literal
```

**appendReplacement/Tail**:
```java
while (m.find()) {
    m.appendReplacement(sb, transform(m.group()));
}
m.appendTail(sb);
```

**Java 9+ Function**:
```java
m.replaceAll(match -> transform(match.group()))
```

**Performance**:
```java
// ❌ Lento em loop
texto.replaceAll("\\d+", "X")

// ✓ Rápido
Pattern p = Pattern.compile("\\d+");
m.replaceAll("X")
```

**Recomendação**: Use **Matcher.replaceAll()** com Pattern pré-compilado para performance. Use **backreferences ($1, $2)** para rearranjar texto. Escape **$** literal com **\\$**. Considere **replaceAll(Function)** para lógica complexa (Java 9+).