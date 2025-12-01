# startsWith(), endsWith() e contains() - Verificação de Conteúdo

## 🎯 Introdução e Definição

**startsWith()**, **endsWith()** e **contains()** são métodos para **verificar presença de substrings** em posições específicas ou em qualquer lugar da String. Retornam **boolean** (true/false).

**Conceito central**: Esses métodos permitem **validar formatos**, **identificar padrões** e **filtrar dados** de forma eficiente e legível, sem necessidade de manipular índices manualmente.

**Exemplo fundamental**:
```java
String arquivo = "documento.pdf";

// startsWith() - verifica início
boolean comecaComDoc = arquivo.startsWith("doc");     // true
boolean comecaComPdf = arquivo.startsWith("pdf");     // false

// endsWith() - verifica fim
boolean terminaPdf = arquivo.endsWith(".pdf");        // true
boolean terminaTxt = arquivo.endsWith(".txt");        // false

// contains() - verifica presença em qualquer posição
boolean contemDoc = arquivo.contains("doc");          // true
boolean contemMen = arquivo.contains("men");          // true
boolean contemXyz = arquivo.contains("xyz");          // false
```

**Retorno**: `true` se encontrado, `false` caso contrário

## 📋 Fundamentos Teóricos

### 1️⃣ startsWith(String prefix)

**Verifica se String começa com prefixo**:

```java
String s = "Hello World";

boolean b1 = s.startsWith("Hello");   // true
boolean b2 = s.startsWith("Hell");    // true
boolean b3 = s.startsWith("H");       // true
boolean b4 = s.startsWith("");        // true (String vazia sempre retorna true)
boolean b5 = s.startsWith("World");   // false (não é prefixo)
boolean b6 = s.startsWith("hello");   // false (case-sensitive!)

// Visualização:
// String:  "Hello World"
//           ^^^^^        startsWith("Hello") ✓
```

**Assinatura**:
```java
public boolean startsWith(String prefix)
// Retorna: true se String começa com prefix
// Case-sensitive
```

**Implementação equivalente**:
```java
// startsWith() internamente faz algo como:
public boolean startsWith(String prefix) {
    return this.indexOf(prefix) == 0;
}

// Verifica se substring começa no índice 0
```

**String vazia**:
```java
String s = "Test";

s.startsWith("");   // true (toda String "começa" com vazia)

String vazia = "";
vazia.startsWith("");  // true
vazia.startsWith("x"); // false
```

### 2️⃣ startsWith(String prefix, int toffset)

**Verifica prefixo a partir de offset**:

```java
String s = "Hello World";

boolean b1 = s.startsWith("World", 6);    // true (começa em 6)
boolean b2 = s.startsWith("Hello", 0);    // true (começa em 0)
boolean b3 = s.startsWith("Wor", 6);      // true
boolean b4 = s.startsWith("World", 0);    // false (não está em 0)

// Índices:  0123456789...
// String:   Hello World
//                 ^^^^^  startsWith("World", 6) ✓
```

**Assinatura**:
```java
public boolean startsWith(String prefix, int toffset)
// Verifica se substring a partir de toffset começa com prefix
// Equivalente a: this.substring(toffset).startsWith(prefix)
```

**Uso prático**:
```java
String path = "/home/user/documents";

// Verificar se "/user" está na posição 5
boolean temUser = path.startsWith("/user", 5);  // true

// Equivalente a:
boolean temUser2 = path.substring(5).startsWith("/user");  // true

// startsWith com offset é mais eficiente (não cria substring)
```

### 3️⃣ endsWith(String suffix)

**Verifica se String termina com sufixo**:

```java
String arquivo = "documento.pdf";

boolean b1 = arquivo.endsWith(".pdf");    // true
boolean b2 = arquivo.endsWith("pdf");     // true
boolean b3 = arquivo.endsWith("to.pdf");  // true
boolean b4 = arquivo.endsWith("");        // true (String vazia)
boolean b5 = arquivo.endsWith(".txt");    // false
boolean b6 = arquivo.endsWith(".PDF");    // false (case-sensitive!)

// Visualização:
// String:  "documento.pdf"
//                    ^^^^  endsWith(".pdf") ✓
```

**Assinatura**:
```java
public boolean endsWith(String suffix)
// Retorna: true se String termina com suffix
// Case-sensitive
```

**Implementação equivalente**:
```java
// endsWith() internamente faz algo como:
public boolean endsWith(String suffix) {
    int sufixLen = suffix.length();
    return this.startsWith(suffix, this.length() - sufixLen);
}

// Ou:
public boolean endsWith(String suffix) {
    return this.lastIndexOf(suffix) == (this.length() - suffix.length());
}
```

**Validar extensões**:
```java
String[] imagens = {"foto.jpg", "imagem.png", "documento.pdf"};

for (String arquivo : imagens) {
    if (arquivo.endsWith(".jpg") || arquivo.endsWith(".png")) {
        System.out.println(arquivo + " é imagem");
    }
}

// Saída:
// foto.jpg é imagem
// imagem.png é imagem
```

### 4️⃣ contains(CharSequence s)

**Verifica presença em qualquer posição**:

```java
String s = "Java Programming Language";

boolean b1 = s.contains("Java");         // true
boolean b2 = s.contains("Programming");  // true
boolean b3 = s.contains("Language");     // true
boolean b4 = s.contains("gram");         // true (substring)
boolean b5 = s.contains("Python");       // false
boolean b6 = s.contains("");             // true (String vazia)

// Visualização:
// String:  "Java Programming Language"
//                 ^^^^         contains("gram") ✓
```

**Assinatura**:
```java
public boolean contains(CharSequence s)
// Parâmetro: CharSequence (String, StringBuilder, StringBuffer, etc.)
// Retorna: true se contém a sequência
```

**Implementação**:
```java
// contains() usa indexOf() internamente
public boolean contains(CharSequence s) {
    return indexOf(s.toString()) >= 0;
}

// Equivalente a:
s.indexOf("palavra") != -1;  // Mesmo que contains("palavra")
```

**CharSequence - aceita múltiplos tipos**:
```java
String s = "Example";

// String
s.contains("amp");  // true

// StringBuilder
StringBuilder sb = new StringBuilder("amp");
s.contains(sb);  // true

// StringBuffer
StringBuffer sbuf = new StringBuffer("amp");
s.contains(sbuf);  // true
```

### 5️⃣ Case Sensitivity

**Todos são case-sensitive**:

```java
String s = "Hello World";

// startsWith
s.startsWith("hello");   // false (case diferente)
s.startsWith("Hello");   // true

// endsWith
s.endsWith("WORLD");     // false
s.endsWith("World");     // true

// contains
s.contains("world");     // false
s.contains("World");     // true
```

**Ignorar case - converter para toLowerCase**:
```java
String s = "Hello World";
String busca = "WORLD";

// ✓ Ignorar case
boolean contem = s.toLowerCase().contains(busca.toLowerCase());  // true

// Ou criar métodos auxiliares
public boolean startsWithIgnoreCase(String str, String prefix) {
    return str.toLowerCase().startsWith(prefix.toLowerCase());
}

public boolean endsWithIgnoreCase(String str, String suffix) {
    return str.toLowerCase().endsWith(suffix.toLowerCase());
}

public boolean containsIgnoreCase(String str, String substring) {
    return str.toLowerCase().contains(substring.toLowerCase());
}
```

**Atenção com conversão**:
```java
String original = "Test";

// ✓ toLowerCase() cria nova String (original não muda)
boolean resultado = original.toLowerCase().contains("test");
System.out.println(original);  // "Test" (não mudou)

// Performance: toLowerCase() aloca nova String
// Para muitas verificações, converter uma vez:
String minuscula = original.toLowerCase();
boolean b1 = minuscula.contains("test");
boolean b2 = minuscula.startsWith("te");
```

### 6️⃣ Performance e Complexidade

**Complexidade temporal**:

```java
// startsWith(String prefix)
// Tempo: O(m) onde m = tamanho do prefix
// Compara caractere por caractere até achar diferença

// endsWith(String suffix)
// Tempo: O(m) onde m = tamanho do suffix
// Similar a startsWith

// contains(CharSequence s)
// Tempo: O(n × m)
//   n = tamanho da String
//   m = tamanho da substring
// Usa indexOf() que percorre String
```

**Benchmark**:
```java
String s = "A".repeat(1_000_000);  // 1 milhão de caracteres

// startsWith - muito rápido (verifica início)
long inicio = System.nanoTime();
boolean resultado = s.startsWith("AAAA");
long tempo = System.nanoTime() - inicio;
// Tempo: ~100 nanossegundos

// endsWith - muito rápido (verifica fim)
inicio = System.nanoTime();
resultado = s.endsWith("AAAA");
tempo = System.nanoTime() - inicio;
// Tempo: ~100 nanossegundos

// contains - pode ser lento (busca em toda String)
inicio = System.nanoTime();
resultado = s.contains("ZZZZ");  // Não existe - percorre tudo
tempo = System.nanoTime() - inicio;
// Tempo: ~2-5 milissegundos (muito mais lento)
```

**Otimizações**:
```java
// contains() usa indexOf() otimizado pela JVM
// HotSpot usa "intrinsics" (código nativo otimizado)

// Para múltiplas verificações na mesma String:
String s = obterTextoGrande();

// ❌ Múltiplas chamadas
if (s.contains("Java") && s.contains("Python") && s.contains("C++")) {
    // ...
}

// ✓ Se possível, compilar regex ou usar algoritmos mais eficientes
// (para casos complexos com muitas buscas)
```

### 7️⃣ Null Safety

**Não aceita parâmetro null**:

```java
String s = "Test";

// ❌ NullPointerException
s.startsWith(null);  // NPE
s.endsWith(null);    // NPE
s.contains(null);    // NPE

// ✓ Verificar null antes
String prefixo = obterPrefixo();  // pode retornar null
if (prefixo != null && s.startsWith(prefixo)) {
    // seguro
}
```

**String null - NullPointerException**:
```java
String s = null;

// ❌ NullPointerException
s.startsWith("test");  // NPE
s.endsWith("test");    // NPE
s.contains("test");    // NPE

// ✓ Verificar String null
if (s != null && s.startsWith("test")) {
    // seguro
}
```

**Validação completa**:
```java
public boolean contemSubstring(String str, String substring) {
    if (str == null || substring == null) {
        return false;  // ou lançar IllegalArgumentException
    }
    return str.contains(substring);
}
```

### 8️⃣ Comparação com Regex

**Métodos simples vs regex**:

```java
String s = "arquivo.pdf";

// ✓ Métodos simples - mais rápidos
boolean ehPdf = s.endsWith(".pdf");

// ✗ Regex - mais lento (overhead de compilação)
boolean ehPdf2 = s.matches(".*\\.pdf");

// Benchmark:
// endsWith(): ~100 nanossegundos
// matches():  ~10.000 nanossegundos (100x mais lento!)
```

**Quando usar cada um**:
```java
// ✓ Métodos simples para padrões fixos
arquivo.endsWith(".pdf");
arquivo.startsWith("doc");
texto.contains("palavra");

// ✓ Regex para padrões complexos
arquivo.matches(".*\\.(jpg|png|gif)");  // Múltiplas extensões
texto.matches("\\d{3}-\\d{4}");         // Formato telefone
```

**Pattern pré-compilado para performance**:
```java
// ❌ Compila regex a cada iteração
for (String s : lista) {
    if (s.matches(".*\\.pdf")) {
        // ...
    }
}

// ✓ Compila uma vez
Pattern pattern = Pattern.compile(".*\\.pdf");
for (String s : lista) {
    if (pattern.matcher(s).matches()) {
        // ...
    }
}
```

### 9️⃣ Casos de Uso Práticos

**Validar extensões de arquivo**:
```java
public boolean ehImagemValida(String nomeArquivo) {
    return nomeArquivo.endsWith(".jpg") ||
           nomeArquivo.endsWith(".jpeg") ||
           nomeArquivo.endsWith(".png") ||
           nomeArquivo.endsWith(".gif");
}

// Ou com toLowerCase para ignorar case:
public boolean ehImagemValidaIgnoreCase(String arquivo) {
    String lower = arquivo.toLowerCase();
    return lower.endsWith(".jpg") || lower.endsWith(".jpeg") ||
           lower.endsWith(".png") || lower.endsWith(".gif");
}
```

**Filtrar URLs**:
```java
List<String> urls = Arrays.asList(
    "https://example.com",
    "http://test.com",
    "ftp://files.com"
);

List<String> urlsSeguras = urls.stream()
    .filter(url -> url.startsWith("https://"))
    .collect(Collectors.toList());
// Apenas URLs HTTPS
```

**Validar comandos**:
```java
String comando = "GET /api/users";

if (comando.startsWith("GET ")) {
    String path = comando.substring(4);  // "/api/users"
    processarGet(path);
} else if (comando.startsWith("POST ")) {
    String path = comando.substring(5);
    processarPost(path);
}
```

**Buscar em logs**:
```java
List<String> logs = lerArquivoLog();

// Filtrar apenas erros
List<String> erros = logs.stream()
    .filter(linha -> linha.contains("ERROR") || linha.contains("FATAL"))
    .collect(Collectors.toList());
```

**Validar formato de email**:
```java
public boolean emailSimplificado(String email) {
    // Validação básica (não completa)
    return email.contains("@") && 
           email.indexOf('@') < email.lastIndexOf('.') &&
           email.lastIndexOf('.') < email.length() - 1;
}
```

### 🔟 Alternativas e Métodos Relacionados

**matches() - regex completo**:

```java
String s = "teste123";

// matches() - String INTEIRA deve corresponder ao padrão
s.matches("\\w+");      // true (letras e dígitos)
s.matches("teste.*");   // true (começa com "teste")

// vs startsWith
s.startsWith("teste");  // true (mais simples e rápido)
```

**regionMatches() - comparar regiões**:
```java
String s1 = "Hello World";
String s2 = "hello";

// regionMatches(ignoreCase, thisOffset, other, otherOffset, length)
boolean igual = s1.regionMatches(true, 0, s2, 0, 5);  // true

// Compara "Hello" (0-5 de s1) com "hello" (0-5 de s2)
// ignoreCase = true
```

**indexOf() - posição exata**:
```java
String s = "Example";

// contains() - apenas verifica
if (s.contains("amp")) {
    // contém
}

// indexOf() - retorna posição
int pos = s.indexOf("amp");
if (pos != -1) {
    // contém E sabemos onde (pos = 2)
}
```

## 🎯 Aplicabilidade

**1. Validar Formatos de Arquivo**:
```java
if (arquivo.endsWith(".pdf") || arquivo.endsWith(".doc")) {
    processarDocumento(arquivo);
}
```

**2. Filtrar por Prefixo**:
```java
List<String> usuarios = Arrays.asList("admin_john", "user_mary", "admin_bob");
List<String> admins = usuarios.stream()
    .filter(u -> u.startsWith("admin_"))
    .collect(Collectors.toList());
```

**3. Buscar Palavras-chave**:
```java
if (mensagem.contains("urgente") || mensagem.contains("ASAP")) {
    marcarComoPrioridade();
}
```

**4. Validar Protocolos**:
```java
if (url.startsWith("https://")) {
    conexaoSegura(url);
} else if (url.startsWith("http://")) {
    conexaoNaoSegura(url);
}
```

**5. Processar Comandos**:
```java
if (input.startsWith("/")) {
    String comando = input.substring(1);
    executarComando(comando);
}
```

## ⚠️ Armadilhas Comuns

**1. Case Sensitivity**:
```java
"Hello".startsWith("hello");  // false, não true!
```

**2. Não Verificar null**:
```java
String s = null;
s.contains("x");  // ❌ NullPointerException
```

**3. Confundir contains com matches**:
```java
"test123".contains("test");    // true (substring)
"test123".matches("test");     // false (String inteira)
"test123".matches("test.*");   // true (regex)
```

**4. Performance com Regex**:
```java
// ❌ Lento
arquivo.matches(".*\\.pdf");

// ✓ Rápido
arquivo.endsWith(".pdf");
```

**5. String Vazia**:
```java
"Test".startsWith("");  // true (não false!)
"Test".endsWith("");    // true
"Test".contains("");    // true
```

## ✅ Boas Práticas

**1. Verificar null Primeiro**:
```java
if (s != null && s.startsWith("prefix")) {
    // seguro
}
```

**2. Usar Métodos Simples ao Invés de Regex**:
```java
// ✓ Simples e rápido
if (arquivo.endsWith(".pdf")) { }

// ✗ Complexo e lento
if (arquivo.matches(".*\\.pdf")) { }
```

**3. toLowerCase para Ignore Case**:
```java
String lower = s.toLowerCase();
if (lower.startsWith("prefix")) { }
```

**4. Encadear Verificações**:
```java
if (arquivo.endsWith(".jpg") || 
    arquivo.endsWith(".png") || 
    arquivo.endsWith(".gif")) {
    processarImagem();
}
```

**5. Combinar com indexOf para Posição**:
```java
// Se precisa da posição, use indexOf
int pos = s.indexOf("palavra");
if (pos != -1) {
    // contém E sabemos onde
}

// Se só verificar, use contains
if (s.contains("palavra")) {
    // mais simples
}
```

## 📚 Resumo Executivo

**startsWith()**, **endsWith()**, **contains()**: verificam presença de substrings.

**startsWith()**:
```java
String s = "Hello World";
s.startsWith("Hello");      // true (prefixo)
s.startsWith("World", 6);   // true (prefixo a partir do índice 6)
s.startsWith("");           // true (vazia sempre true)
```

**endsWith()**:
```java
String arquivo = "doc.pdf";
arquivo.endsWith(".pdf");   // true (sufixo)
arquivo.endsWith("pdf");    // true
arquivo.endsWith("");       // true (vazia sempre true)
```

**contains()**:
```java
String s = "Java Programming";
s.contains("Program");      // true (qualquer posição)
s.contains("Python");       // false
s.contains("");             // true (vazia sempre true)
```

**Case-sensitive**:
```java
"Hello".startsWith("hello");  // false
"Hello".endsWith("WORLD");    // false
"Hello".contains("world");    // false

// Ignorar case:
"Hello".toLowerCase().startsWith("hello");  // true
```

**Null**:
```java
String s = null;
s.startsWith("x");  // ❌ NullPointerException

// ✓ Verificar
if (s != null && s.startsWith("x")) { }
```

**Performance**:
- startsWith: O(m) - muito rápido
- endsWith: O(m) - muito rápido
- contains: O(n × m) - pode ser lento

**vs Regex**:
```java
// ✓ Simples - ~100ns
arquivo.endsWith(".pdf");

// ✗ Regex - ~10.000ns (100x mais lento)
arquivo.matches(".*\\.pdf");
```

**Uso típico**:
```java
// Validar extensão
if (arquivo.endsWith(".pdf")) { }

// Filtrar por prefixo
if (usuario.startsWith("admin_")) { }

// Buscar palavra
if (texto.contains("erro")) { }

// Validar protocolo
if (url.startsWith("https://")) { }
```