# toLowerCase(), toUpperCase() e Conversão de Caso

## 🎯 Introdução e Definição

**toLowerCase()** e **toUpperCase()** convertem **todos os caracteres** de uma String para **minúsculas** ou **MAIÚSCULAS**, respectivamente. Como Strings são imutáveis, retornam uma **nova String** com a conversão aplicada.

**Conceito central**: Esses métodos são essenciais para **normalização de texto**, **comparações insensíveis a caso** e **formatação de saída**, aplicando transformações de acordo com regras de **locale** (localidade).

**Exemplo fundamental**:
```java
String s = "Java Programming";

// toLowerCase() - minúsculas
String minuscula = s.toLowerCase();  // "java programming"

// toUpperCase() - MAIÚSCULAS
String maiuscula = s.toUpperCase();  // "JAVA PROGRAMMING"

// Original não muda (imutabilidade)
System.out.println(s);  // "Java Programming"
```

**Uso típico**:
- Comparações case-insensitive
- Normalização de entrada do usuário
- Formatação de saída
- Processamento de comandos

## 📋 Fundamentos Teóricos

### 1️⃣ toLowerCase()

**Converte para minúsculas**:

```java
String s1 = "HELLO WORLD";
String s2 = s1.toLowerCase();  // "hello world"

String s3 = "Test123";
String s4 = s3.toLowerCase();  // "test123" (números não mudam)

String s5 = "already lowercase";
String s6 = s5.toLowerCase();  // "already lowercase" (sem mudança)
```

**Assinatura**:
```java
public String toLowerCase()
// Converte usando locale padrão do sistema
// Retorna nova String com caracteres em minúsculas
```

**Apenas letras são afetadas**:
```java
String s = "ABC123!@#xyz";
String lower = s.toLowerCase();  // "abc123!@#xyz"

// Números, pontuação e símbolos não mudam
```

**String vazia e null**:
```java
String vazia = "";
vazia.toLowerCase();  // "" (String vazia)

String nula = null;
nula.toLowerCase();   // ❌ NullPointerException
```

### 2️⃣ toLowerCase(Locale locale)

**Converte usando locale específico**:

```java
String s = "TITLE";

// Locale padrão
String lower1 = s.toLowerCase();  // "title"

// Locale específico
String lower2 = s.toLowerCase(Locale.US);       // "title"
String lower3 = s.toLowerCase(Locale.ENGLISH);  // "title"

// Exemplo: letra turca 'I'
String turco = "TITLE";
String lowerTR = turco.toLowerCase(new Locale("tr", "TR"));
// Comportamento diferente em turco!
```

**Assinatura**:
```java
public String toLowerCase(Locale locale)
// locale: regras de conversão específicas de idioma/região
```

**Problema do 'I' turco**:
```java
// Em turco, 'I' → 'ı' (i sem ponto)
// Em inglês, 'I' → 'i' (i com ponto)

String s = "ISTANBUL";

String english = s.toLowerCase(Locale.ENGLISH);
// "istanbul" (i com ponto)

String turkish = s.toLowerCase(new Locale("tr"));
// "ıstanbul" (ı sem ponto - correto em turco)

// Importante para validações internacionais!
```

### 3️⃣ toUpperCase()

**Converte para MAIÚSCULAS**:

```java
String s1 = "hello world";
String s2 = s1.toUpperCase();  // "HELLO WORLD"

String s3 = "Test123";
String s4 = s3.toUpperCase();  // "TEST123" (números não mudam)

String s5 = "ALREADY UPPERCASE";
String s6 = s5.toUpperCase();  // "ALREADY UPPERCASE" (sem mudança)
```

**Assinatura**:
```java
public String toUpperCase()
// Converte usando locale padrão
// Retorna nova String com caracteres em MAIÚSCULAS
```

**Apenas letras afetadas**:
```java
String s = "abc123!@#XYZ";
String upper = s.toUpperCase();  // "ABC123!@#XYZ"

// Números, pontuação e símbolos não mudam
```

### 4️⃣ toUpperCase(Locale locale)

**Converte usando locale específico**:

```java
String s = "title";

// Locale padrão
String upper1 = s.toUpperCase();  // "TITLE"

// Locale específico
String upper2 = s.toUpperCase(Locale.US);  // "TITLE"

// Exemplo: letra grega 'σ' (sigma)
String grego = "σίσυφος";  // Sísifo em grego

String upperGR = grego.toUpperCase(new Locale("el"));
// "ΣΊΣΥΦΟΣ" (sigma final 'ς' → 'Σ' corretamente)
```

**Assinatura**:
```java
public String toUpperCase(Locale locale)
```

**Caso especial - Alemão 'ß'**:
```java
String alemao = "straße";  // "rua" em alemão

String upperDE = alemao.toUpperCase(Locale.GERMAN);
// "STRASSE" (ß → SS)

// 'ß' (eszett) vira 'SS' em maiúsculas
```

### 5️⃣ Comparações Case-Insensitive

**Evitar equals() direto**:

```java
String s1 = "Java";
String s2 = "java";

// ❌ Sensível a caso
boolean igual1 = s1.equals(s2);  // false

// ✓ Insensível a caso - opção 1
boolean igual2 = s1.equalsIgnoreCase(s2);  // true (melhor)

// ✓ Insensível a caso - opção 2
boolean igual3 = s1.toLowerCase().equals(s2.toLowerCase());  // true
```

**equalsIgnoreCase() vs toLowerCase()**:
```java
String s1 = "Test";
String s2 = "TEST";

// ✓ Mais eficiente - não aloca Strings
boolean resultado1 = s1.equalsIgnoreCase(s2);

// ✗ Menos eficiente - aloca 2 Strings temporárias
boolean resultado2 = s1.toLowerCase().equals(s2.toLowerCase());

// Prefira equalsIgnoreCase() para comparações
```

**contains() case-insensitive**:
```java
String texto = "Hello World";
String busca = "WORLD";

// ❌ Case-sensitive
boolean contem1 = texto.contains(busca);  // false

// ✓ Case-insensitive
boolean contem2 = texto.toLowerCase().contains(busca.toLowerCase());  // true
```

### 6️⃣ Imutabilidade e Otimizações

**Não modifica original**:

```java
String s = "Test";

s.toLowerCase();  // ❌ String não mudou!
System.out.println(s);  // "Test" (original)

// ✓ Atribuir resultado
s = s.toLowerCase();
System.out.println(s);  // "test"
```

**JVM pode retornar mesma referência se não mudar**:
```java
String s = "test";  // Já está em minúsculas

String lower = s.toLowerCase();
System.out.println(s == lower);  // Pode ser true (otimização JVM)

// JVM detecta que String já está em minúsculas
// Retorna mesma referência ao invés de criar nova String
```

**Teste de otimização**:
```java
String upper = "ABC";
String upper2 = upper.toUpperCase();
System.out.println(upper == upper2);  // true (mesma referência)

String mixed = "AbC";
String upper3 = mixed.toUpperCase();
System.out.println(mixed == upper3);  // false (nova String criada)
```

### 7️⃣ Unicode e Caracteres Especiais

**Suporte a Unicode completo**:

```java
// Acentuação
String s1 = "JOSÉ";
String lower1 = s1.toLowerCase();  // "josé"

String s2 = "café";
String upper2 = s2.toUpperCase();  // "CAFÉ"

// Cirílico
String russo = "ПРИВЕТ";
String lowerRU = russo.toLowerCase();  // "привет"

// Árabe
String arabe = "مرحبا";
String upperAR = arabe.toUpperCase();  // "مرحبا" (sem mudança - árabe não tem maiúsculas)
```

**Caracteres que não têm equivalente**:
```java
// Chinês, Japonês, Árabe não têm maiúsculas/minúsculas
String chines = "你好";
String upper = chines.toUpperCase();  // "你好" (sem mudança)

String japones = "こんにちは";
String lower = japones.toLowerCase();  // "こんにちは" (sem mudança)
```

**Ligaduras e caracteres especiais**:
```java
// Ligadura 'ﬁ' (fi)
String ligadura = "ﬁle";
String upper = ligadura.toUpperCase();  // "FILE" (expandido)

// Alemão 'ß'
String ss = "Straße";
String upper2 = ss.toUpperCase();  // "STRASSE"
```

### 8️⃣ Performance

**Complexidade temporal**:
```java
// toLowerCase() e toUpperCase()
// Tempo: O(n) onde n = tamanho da String
// Percorre cada caractere e converte

String s = "A".repeat(1_000_000);  // 1 milhão de caracteres
long inicio = System.nanoTime();
String lower = s.toLowerCase();
long tempo = System.nanoTime() - inicio;
// Tempo: ~5-10ms
```

**Benchmark**:
```java
String s = "Test String Example";

// toLowerCase()
long inicio = System.nanoTime();
for (int i = 0; i < 1_000_000; i++) {
    String lower = s.toLowerCase();
}
long tempo = System.nanoTime() - inicio;
// Tempo total: ~100ms
// Por chamada: ~100 nanossegundos
```

**Evitar chamadas desnecessárias**:
```java
List<String> palavras = Arrays.asList("Java", "Python", "C++");

// ❌ Converte múltiplas vezes
for (String p : palavras) {
    if (p.toLowerCase().equals("java")) {
        // toLowerCase() chamado a cada iteração
    }
}

// ✓ Converter uma vez
for (String p : palavras) {
    if (p.equalsIgnoreCase("java")) {
        // Mais eficiente - não aloca String
    }
}

// ✓ Ou normalizar todas de uma vez
List<String> lower = palavras.stream()
    .map(String::toLowerCase)
    .collect(Collectors.toList());
```

### 9️⃣ Casos de Uso Práticos

**Normalizar entrada do usuário**:
```java
Scanner scanner = new Scanner(System.in);
System.out.print("Digite comando (S/N): ");
String resposta = scanner.nextLine().trim().toUpperCase();

if (resposta.equals("S")) {
    System.out.println("Sim");
} else if (resposta.equals("N")) {
    System.out.println("Não");
}

// Aceita: s, S, n, N (com/sem espaços)
```

**Validar extensões**:
```java
String arquivo = "DOCUMENTO.PDF";

// Case-insensitive
if (arquivo.toLowerCase().endsWith(".pdf")) {
    System.out.println("Arquivo PDF");
}

// Aceita: .pdf, .PDF, .Pdf, etc.
```

**Busca em listas**:
```java
List<String> usuarios = Arrays.asList("Alice", "Bob", "Charlie");
String busca = "alice";

// Case-insensitive
boolean encontrado = usuarios.stream()
    .anyMatch(u -> u.equalsIgnoreCase(busca));

System.out.println(encontrado);  // true
```

**Gerar identificadores**:
```java
String nome = "João Silva";

// Gerar ID em minúsculas sem espaços
String id = nome.toLowerCase().replace(" ", "_");
// "joão_silva"

// Ou uppercase para constantes
String constante = nome.toUpperCase().replace(" ", "_");
// "JOÃO_SILVA"
```

**Capitalizar primeira letra**:
```java
public String capitalize(String s) {
    if (s == null || s.isEmpty()) {
        return s;
    }
    return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
}

String resultado = capitalize("jOhN");  // "John"
```

### 🔟 Locale e Internacionalização

**Problema sem locale explícito**:
```java
// Locale padrão do sistema pode variar
String s = "TITLE";

// ❌ Comportamento pode mudar dependendo do sistema
String lower = s.toLowerCase();  // Depende da config do SO

// ✓ Especificar locale para comportamento consistente
String lowerUS = s.toLowerCase(Locale.US);
String lowerTR = s.toLowerCase(new Locale("tr"));
```

**Recomendação para aplicações**:
```java
// Para comparações/validações: use Locale.ROOT ou Locale.ENGLISH
String email = usuario.getEmail().toLowerCase(Locale.ROOT);

// Para exibição ao usuário: use Locale do usuário
String mensagem = template.toLowerCase(usuario.getLocale());

// Locale.ROOT - sem regras específicas de idioma
String normalizado = texto.toLowerCase(Locale.ROOT);
```

**Constantes úteis**:
```java
Locale.ROOT       // Locale neutra (preferir para lógica)
Locale.US         // Inglês americano
Locale.UK         // Inglês britânico
Locale.ENGLISH    // Inglês genérico
Locale.getDefault() // Locale do sistema
```

## 🎯 Aplicabilidade

**1. Normalizar Comandos**:
```java
String comando = input.trim().toLowerCase();
switch (comando) {
    case "start": iniciar(); break;
    case "stop": parar(); break;
    case "restart": reiniciar(); break;
}
```

**2. Validação de Email**:
```java
String email = usuario.getEmail().toLowerCase(Locale.ROOT);
if (email.endsWith("@company.com")) {
    // Email corporativo
}
```

**3. Comparação de Strings**:
```java
if (s1.equalsIgnoreCase(s2)) {
    // Igual ignorando caso
}
```

**4. Formatação de Saída**:
```java
String titulo = "java programming guide";
String formatado = titulo.toUpperCase();  // "JAVA PROGRAMMING GUIDE"
```

**5. Gerar Slugs/URLs**:
```java
String titulo = "Meu Artigo Importante";
String slug = titulo.toLowerCase()
                    .replace(" ", "-")
                    .replaceAll("[^a-z0-9-]", "");
// "meu-artigo-importante"
```

## ⚠️ Armadilhas Comuns

**1. Não Atribuir Resultado**:
```java
String s = "Test";
s.toLowerCase();  // ❌ String não muda!
System.out.println(s);  // "Test"

// ✓ Atribuir
s = s.toLowerCase();
System.out.println(s);  // "test"
```

**2. NullPointerException**:
```java
String s = null;
s.toLowerCase();  // ❌ NPE

// ✓ Verificar
if (s != null) {
    s = s.toLowerCase();
}
```

**3. Usar em Comparações Repetidas**:
```java
// ❌ Converte múltiplas vezes
if (s.toLowerCase().equals("java") || 
    s.toLowerCase().equals("python")) {
    // toLowerCase() chamado 2 vezes
}

// ✓ Converter uma vez
String lower = s.toLowerCase();
if (lower.equals("java") || lower.equals("python")) {
    // Chamado 1 vez
}

// ✓✓ Melhor: use equalsIgnoreCase
if (s.equalsIgnoreCase("java") || 
    s.equalsIgnoreCase("python")) {
    // Sem alocação de String temporária
}
```

**4. Problema do Locale**:
```java
// ❌ Pode falhar em sistemas turcos
"TITLE".toLowerCase().equals("title");  // false em Locale turco!

// ✓ Especificar locale
"TITLE".toLowerCase(Locale.ROOT).equals("title");  // sempre true
```

**5. Assumir que Todos Idiomas Têm Maiúsculas**:
```java
String arabe = "مرحبا";
String upper = arabe.toUpperCase();
// "مرحبا" (sem mudança - árabe não tem maiúsculas)
```

## ✅ Boas Práticas

**1. Use Locale Explícito em Lógica**:
```java
// ✓ Para lógica/comparações
String normalizado = s.toLowerCase(Locale.ROOT);

// Para exibição ao usuário
String exibicao = s.toLowerCase(userLocale);
```

**2. equalsIgnoreCase() ao Invés de toLowerCase()**:
```java
// ✓ Mais eficiente
if (s.equalsIgnoreCase("java")) { }

// ✗ Menos eficiente
if (s.toLowerCase().equals("java")) { }
```

**3. Null Safety**:
```java
if (s != null) {
    s = s.toLowerCase();
}

// Ou
String lower = (s != null) ? s.toLowerCase() : null;
```

**4. Converter Uma Vez**:
```java
String lower = s.toLowerCase();
if (lower.equals("x") || lower.equals("y")) {
    // Usa 'lower' múltiplas vezes
}
```

**5. Validar Entrada**:
```java
String comando = input.trim().toLowerCase(Locale.ROOT);
// Normaliza para comparação consistente
```

## 📚 Resumo Executivo

**toLowerCase()** e **toUpperCase()**: convertem caracteres para minúsculas/MAIÚSCULAS.

**Métodos básicos**:
```java
String s = "Java Programming";

s.toLowerCase();  // "java programming"
s.toUpperCase();  // "JAVA PROGRAMMING"

// Com locale
s.toLowerCase(Locale.ROOT);  // Locale neutra
s.toUpperCase(Locale.US);    // Inglês americano
```

**Imutabilidade**:
```java
String s = "Test";
s.toLowerCase();  // ❌ Não atribui - String não muda
s = s.toLowerCase();  // ✓ Atribui - String muda
```

**Apenas letras são afetadas**:
```java
"ABC123!@#".toLowerCase();  // "abc123!@#"
// Números e símbolos não mudam
```

**Comparações case-insensitive**:
```java
// ✓ Melhor - sem alocação
s1.equalsIgnoreCase(s2);

// ✗ Pior - aloca 2 Strings
s1.toLowerCase().equals(s2.toLowerCase());
```

**Locale importante**:
```java
// Turco: 'I' → 'ı' (i sem ponto)
"ISTANBUL".toLowerCase(new Locale("tr"));  // "ıstanbul"

// Inglês: 'I' → 'i' (i com ponto)
"ISTANBUL".toLowerCase(Locale.ENGLISH);  // "istanbul"

// Para lógica: use Locale.ROOT
String norm = s.toLowerCase(Locale.ROOT);
```

**Performance**: O(n) - percorre cada caractere

**Casos especiais**:
```java
"Straße".toUpperCase();  // "STRASSE" (ß → SS)
"مرحبا".toUpperCase();    // "مرحبا" (árabe sem maiúsculas)
```

**Uso típico**:
```java
// Normalizar entrada
String cmd = input.trim().toLowerCase(Locale.ROOT);

// Validar extensão
if (arquivo.toLowerCase().endsWith(".pdf")) { }

// Comparar
if (s.equalsIgnoreCase(outro)) { }

// Capitalizar
String cap = s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
```