# trim(), strip() e Remoção de Espaços

## 🎯 Introdução e Definição

**trim()**, **strip()**, **stripLeading()** e **stripTrailing()** removem **espaços em branco** das extremidades de uma String. Como Strings são imutáveis, retornam uma **nova String** com os espaços removidos.

**Conceito central**: Esses métodos são essenciais para **limpar entrada do usuário**, **normalizar dados** e **processar texto**, com diferenças importantes entre **trim()** (Java 1.0+) e **strip()** (Java 11+) no tratamento de **espaços Unicode**.

**Exemplo fundamental**:
```java
String s = "  Hello World  ";

// trim() - remove espaços ASCII (≤ U+0020)
String t1 = s.trim();  // "Hello World"

// strip() - remove espaços Unicode (Java 11+)
String t2 = s.strip();  // "Hello World"

// stripLeading() - remove início apenas
String t3 = s.stripLeading();  // "Hello World  "

// stripTrailing() - remove fim apenas
String t4 = s.stripTrailing();  // "  Hello World"

// Original não muda
System.out.println(s);  // "  Hello World  "
```

**Diferenças principais**:
- **trim()**: remove espaços ASCII (≤ U+0020) - limitado
- **strip()**: remove espaços Unicode - mais abrangente (Java 11+)
- **stripLeading()**: remove apenas início (Java 11+)
- **stripTrailing()**: remove apenas fim (Java 11+)

## 📋 Fundamentos Teóricos

### 1️⃣ trim() - Método Clássico

**Remove espaços ASCII das extremidades**:

```java
String s1 = "  Hello  ";
String trimmed = s1.trim();  // "Hello"

String s2 = "\t\nText\r\n";
String trimmed2 = s2.trim();  // "Text"

String s3 = "NoSpaces";
String trimmed3 = s3.trim();  // "NoSpaces" (sem mudança)

String s4 = "  ";
String trimmed4 = s4.trim();  // "" (vazia)
```

**Assinatura**:
```java
public String trim()
// Remove caracteres ≤ U+0020 (espaço ASCII) das extremidades
// Retorna nova String sem espaços nas pontas
```

**Caracteres removidos por trim()**:
```java
// Caracteres ≤ U+0020 (0-32 em decimal)
// '\t' (tab), '\n' (newline), '\r' (carriage return), ' ' (espaço)

String s = "\t\n\r Hello \t\n\r";
String trimmed = s.trim();  // "Hello"

// Todos os caracteres de controle ASCII são removidos
```

**Implementação conceitual**:
```java
public String trim() {
    int len = length();
    int st = 0;
    
    // Início: pula caracteres ≤ ' ' (U+0020)
    while (st < len && charAt(st) <= ' ') {
        st++;
    }
    
    // Fim: pula caracteres ≤ ' '
    while (st < len && charAt(len - 1) <= ' ') {
        len--;
    }
    
    return (st > 0 || len < length()) ? substring(st, len) : this;
}
```

**Limitação - apenas ASCII**:
```java
// ❌ trim() NÃO remove espaços Unicode além de U+0020
String s = "\u2000Hello\u2000";  // U+2000 = espaço 'en' Unicode
String trimmed = s.trim();
System.out.println("[" + trimmed + "]");  // "[ Hello ]" (não removeu!)

// Para espaços Unicode, use strip() (Java 11+)
```

### 2️⃣ strip() - Método Moderno (Java 11+)

**Remove espaços Unicode das extremidades**:

```java
String s1 = "  Hello  ";
String stripped = s1.strip();  // "Hello"

// Espaços Unicode
String s2 = "\u2000Hello\u2000";  // U+2000 = espaço 'en'
String stripped2 = s2.strip();  // "Hello" (removido!)

String s3 = "\u3000Text\u3000";  // U+3000 = espaço ideográfico
String stripped3 = s3.strip();  // "Text" (removido!)
```

**Assinatura**:
```java
public String strip()  // Java 11+
// Remove todos os caracteres identificados como espaço por Character.isWhitespace()
// Muito mais abrangente que trim()
```

**Diferença de trim()**:
```java
String s = "\u2000\u3000 Hello \u2000\u3000";

// trim() - apenas ASCII (≤ U+0020)
String t = s.trim();
System.out.println("[" + t + "]");  // "[ Hello ]" (Unicode não removido)

// strip() - todos os espaços Unicode
String st = s.strip();
System.out.println("[" + st + "]");  // "[Hello]" (tudo removido)
```

**Character.isWhitespace() - mais amplo**:
```java
// strip() usa Character.isWhitespace() que identifica:
// - Espaços ASCII (tab, newline, espaço, etc.)
// - Espaços Unicode (U+2000 a U+200F, U+3000, etc.)
// - Zero-width spaces
// - Non-breaking spaces

// Muito mais completo que trim()
```

### 3️⃣ stripLeading() - Remove Início (Java 11+)

**Remove espaços apenas do início**:

```java
String s = "  Hello World  ";

String leading = s.stripLeading();
System.out.println("[" + leading + "]");  // "[Hello World  ]"
//                                            espaços finais mantidos
```

**Assinatura**:
```java
public String stripLeading()  // Java 11+
// Remove espaços apenas do início (leading)
// Espaços do fim são preservados
```

**Uso prático**:
```java
String linha = "   - Item da lista";

// Remover indentação mas preservar estrutura
String semIndent = linha.stripLeading();
// "- Item da lista"

// vs trim() que removeria ambos os lados
```

**Com espaços Unicode**:
```java
String s = "\u2000\u3000Hello World  ";

String trimmed = s.trim();
System.out.println("[" + trimmed + "]");  // "[ Hello World]" (Unicode não removido)

String stripped = s.stripLeading();
System.out.println("[" + stripped + "]");  // "[Hello World  ]" (Unicode removido)
```

### 4️⃣ stripTrailing() - Remove Fim (Java 11+)

**Remove espaços apenas do fim**:

```java
String s = "  Hello World  ";

String trailing = s.stripTrailing();
System.out.println("[" + trailing + "]");  // "[  Hello World]"
//                                             espaços iniciais mantidos
```

**Assinatura**:
```java
public String stripTrailing()  // Java 11+
// Remove espaços apenas do fim (trailing)
// Espaços do início são preservados
```

**Uso prático**:
```java
// Processar linhas de arquivo preservando indentação
List<String> linhas = Files.readAllLines(path);

List<String> processadas = linhas.stream()
    .map(String::stripTrailing)  // Remove espaços finais
    .collect(Collectors.toList());

// Preserva indentação mas remove trailing spaces
```

**Combinação com stripLeading()**:
```java
String s = "  Hello World  ";

// Equivalente a strip()
String ambos = s.stripLeading().stripTrailing();
// "Hello World"

// Mesmo resultado que:
String strip = s.strip();
// "Hello World"
```

### 5️⃣ Comparação: trim() vs strip()

**Tabela comparativa**:

| Aspecto | trim() | strip() |
|---------|--------|---------|
| Versão Java | 1.0+ | 11+ |
| Espaços removidos | ≤ U+0020 (ASCII) | Character.isWhitespace() (Unicode) |
| Abrangência | Limitada | Completa |
| Performance | Mais rápida | Ligeiramente mais lenta |
| Uso recomendado | Legado, compatibilidade | Novos projetos |

**Benchmark**:
```java
String s = "  Hello World  ";

// trim() - ~50 nanossegundos
long inicio = System.nanoTime();
String t = s.trim();
long tempo1 = System.nanoTime() - inicio;

// strip() - ~80 nanossegundos
inicio = System.nanoTime();
String st = s.strip();
long tempo2 = System.nanoTime() - inicio;

// trim() é ~30-40% mais rápido
// Mas strip() é mais correto para Unicode
```

**Quando usar cada um**:
```java
// ✓ trim() - texto ASCII, compatibilidade com Java < 11
String nome = usuario.getNome().trim();

// ✓ strip() - texto internacional, Unicode, Java 11+
String textoUnicode = entrada.strip();

// ✓ stripLeading/Trailing - controle granular
String semInicio = linha.stripLeading();
String semFim = linha.stripTrailing();
```

### 6️⃣ Imutabilidade e Otimizações

**Não modifica original**:

```java
String s = "  Test  ";

s.trim();  // ❌ String não mudou!
System.out.println("[" + s + "]");  // "[  Test  ]"

// ✓ Atribuir resultado
s = s.trim();
System.out.println("[" + s + "]");  // "[Test]"
```

**JVM pode retornar mesma referência**:
```java
String s = "NoSpaces";

String trimmed = s.trim();
System.out.println(s == trimmed);  // true (otimização JVM)

// Se não há espaços, retorna mesma String
// Evita alocação desnecessária
```

**Teste de otimização**:
```java
String s1 = "Test";
String t1 = s1.trim();
System.out.println(s1 == t1);  // true (sem espaços)

String s2 = "  Test  ";
String t2 = s2.trim();
System.out.println(s2 == t2);  // false (nova String criada)
```

### 7️⃣ Espaços Internos NÃO São Removidos

**Apenas extremidades são afetadas**:

```java
String s = "  Hello   World  ";

String trimmed = s.trim();
System.out.println("[" + trimmed + "]");
// "[Hello   World]"
//         ^^^  espaços internos preservados

// Para remover espaços internos também:
String normalizado = s.trim().replaceAll("\\s+", " ");
// "Hello World"
```

**Normalizar espaços internos**:
```java
String s = "  Java    Programming    Language  ";

// Passo 1: trim() - remove extremidades
// Passo 2: replaceAll() - normaliza internos
String normalizado = s.trim().replaceAll("\\s+", " ");
// "Java Programming Language"

// Ou em Java 11+:
String normalizado2 = s.strip().replaceAll("\\s+", " ");
```

### 8️⃣ Null Safety e String Vazia

**Não aceita null**:

```java
String s = null;

// ❌ NullPointerException
String trimmed = s.trim();  // NPE

// ✓ Verificar null
if (s != null) {
    s = s.trim();
}

// ✓ Ou usar operador ternário
String resultado = (s != null) ? s.trim() : null;
```

**String vazia e só espaços**:
```java
String vazia = "";
String vazia2 = vazia.trim();  // "" (vazia)

String espacos = "   ";
String espacos2 = espacos.trim();  // "" (vazia após trim)

// Verificar vazio após trim
String s = "  ";
if (s.trim().isEmpty()) {
    System.out.println("String vazia ou só espaços");
}
```

**isBlank() - Java 11+**:
```java
// isBlank() verifica se vazia OU só espaços
String s1 = "";
String s2 = "  ";
String s3 = "Text";

s1.isBlank();  // true (vazia)
s2.isBlank();  // true (só espaços)
s3.isBlank();  // false (tem conteúdo)

// Equivalente a:
s.trim().isEmpty()  // Mas mais eficiente (não aloca String)
```

### 9️⃣ Casos de Uso Práticos

**Limpar entrada do usuário**:
```java
Scanner scanner = new Scanner(System.in);
System.out.print("Digite seu nome: ");
String nome = scanner.nextLine().trim();

if (nome.isEmpty()) {
    System.out.println("Nome não pode ser vazio");
} else {
    System.out.println("Olá, " + nome);
}
```

**Processar arquivos CSV**:
```java
String linha = "  João  ,  30  ,  São Paulo  ";

String[] campos = linha.split(",");
for (int i = 0; i < campos.length; i++) {
    campos[i] = campos[i].trim();  // Remove espaços de cada campo
}

// Resultado: ["João", "30", "São Paulo"]
```

**Validar dados**:
```java
public boolean emailValido(String email) {
    if (email == null) {
        return false;
    }
    
    email = email.trim();
    
    if (email.isEmpty()) {
        return false;
    }
    
    return email.contains("@") && email.indexOf('@') > 0;
}
```

**Normalizar texto**:
```java
String texto = "  Título   do   Artigo  ";

// Remover extremidades E normalizar espaços internos
String normalizado = texto.trim().replaceAll("\\s+", " ");
// "Título do Artigo"
```

**Processar comandos**:
```java
String input = "  /start server  ";

if (input.trim().startsWith("/")) {
    String comando = input.trim().substring(1);  // "start server"
    String[] partes = comando.split("\\s+");
    // partes[0] = "start"
    // partes[1] = "server"
}
```

### 🔟 Performance e Complexidade

**Complexidade temporal**:
```java
// trim(), strip(), stripLeading(), stripTrailing()
// Tempo: O(n) no pior caso (percorre String procurando espaços)
// Espaço: O(n) se criar nova String, O(1) se retornar mesma

String s = " ".repeat(1_000_000) + "Text" + " ".repeat(1_000_000);
// 2 milhões de espaços + texto

long inicio = System.nanoTime();
String trimmed = s.trim();
long tempo = System.nanoTime() - inicio;
// Tempo: ~5-10ms (percorre extremidades)
```

**Otimizações**:
```java
// ✓ Chamar uma vez e armazenar
String s = obterString();
String trimmed = s.trim();

if (trimmed.isEmpty() || trimmed.equals("default")) {
    // usa 'trimmed'
}

// ✗ Chamar múltiplas vezes
if (s.trim().isEmpty() || s.trim().equals("default")) {
    // trim() chamado 2 vezes (ineficiente)
}
```

**trim() vs replaceAll() para remover espaços**:
```java
String s = "  Hello  ";

// ✓ trim() - específico e rápido
String t1 = s.trim();  // ~50ns

// ✗ replaceAll() - regex, mais lento
String t2 = s.replaceAll("^\\s+|\\s+$", "");  // ~500ns

// trim() é ~10x mais rápido para remover extremidades
```

## 🎯 Aplicabilidade

**1. Limpar Entrada do Usuário**:
```java
String nome = scanner.nextLine().trim();
String email = formulario.getEmail().trim();
```

**2. Processar CSV/TSV**:
```java
String[] campos = linha.split(",");
for (int i = 0; i < campos.length; i++) {
    campos[i] = campos[i].trim();
}
```

**3. Validação de Dados**:
```java
if (campo.trim().isEmpty()) {
    throw new IllegalArgumentException("Campo obrigatório");
}
```

**4. Normalização de Texto**:
```java
String normalizado = texto.trim().replaceAll("\\s+", " ");
```

**5. Comparação de Strings**:
```java
if (s1.trim().equalsIgnoreCase(s2.trim())) {
    // Igual ignorando espaços e case
}
```

## ⚠️ Armadilhas Comuns

**1. Não Atribuir Resultado**:
```java
String s = "  Test  ";
s.trim();  // ❌ String não muda!
System.out.println(s);  // "  Test  "

// ✓ Atribuir
s = s.trim();
```

**2. NullPointerException**:
```java
String s = null;
s.trim();  // ❌ NPE

// ✓ Verificar
if (s != null) {
    s = s.trim();
}
```

**3. Espaços Unicode com trim()**:
```java
String s = "\u2000Text\u2000";
String t = s.trim();
// "[ Text ]" (não removeu espaços Unicode!)

// ✓ Use strip() para Unicode (Java 11+)
String st = s.strip();  // "Text"
```

**4. Esperar Remoção de Espaços Internos**:
```java
"  Hello   World  ".trim();
// "Hello   World" (espaços internos permanecem!)
```

**5. Chamar Múltiplas Vezes**:
```java
// ❌ Ineficiente
if (s.trim().isEmpty() || s.trim().length() < 5) {
    // trim() chamado 2 vezes
}

// ✓ Chamar uma vez
String t = s.trim();
if (t.isEmpty() || t.length() < 5) { }
```

## ✅ Boas Práticas

**1. Use strip() em Projetos Java 11+**:
```java
// ✓ Mais correto para Unicode
String s = entrada.strip();

// Ou trim() para compatibilidade
String s = entrada.trim();
```

**2. Verificar Null Antes**:
```java
if (s != null) {
    s = s.trim();
}
```

**3. Armazenar Resultado**:
```java
String trimmed = s.trim();
// Usar 'trimmed' múltiplas vezes
```

**4. Combine com isEmpty() ou isBlank()**:
```java
// Java < 11
if (s.trim().isEmpty()) { }

// Java 11+
if (s.isBlank()) { }  // Mais eficiente
```

**5. Normalizar Dados na Entrada**:
```java
public void setNome(String nome) {
    this.nome = (nome != null) ? nome.trim() : null;
}
```

## 📚 Resumo Executivo

**trim()**, **strip()**, **stripLeading()**, **stripTrailing()**: removem espaços das extremidades.

**trim()** (Java 1.0+):
```java
"  Hello  ".trim();  // "Hello"
"\t\nText\r\n".trim();  // "Text"

// Remove apenas caracteres ≤ U+0020 (ASCII)
```

**strip()** (Java 11+):
```java
"  Hello  ".strip();  // "Hello"
"\u2000Text\u2000".strip();  // "Text" (Unicode removido)

// Remove todos os espaços Unicode (Character.isWhitespace())
```

**stripLeading()** / **stripTrailing()** (Java 11+):
```java
"  Hello  ".stripLeading();   // "Hello  " (só início)
"  Hello  ".stripTrailing();  // "  Hello" (só fim)
```

**Diferença principal**:
```java
String s = "\u2000Hello\u2000";  // Espaço Unicode

s.trim();   // "[ Hello ]" (não remove Unicode)
s.strip();  // "Hello" (remove Unicode)
```

**Imutabilidade**:
```java
String s = "  Test  ";
s.trim();  // ❌ Não muda original
s = s.trim();  // ✓ Atribui resultado
```

**Espaços internos preservados**:
```java
"  Hello   World  ".trim();  // "Hello   World"
//                               ^^^  mantidos
```

**Null safety**:
```java
String s = null;
s.trim();  // ❌ NullPointerException

if (s != null) {
    s = s.trim();  // ✓ Seguro
}
```

**Performance**: O(n) - percorre extremidades

**Uso típico**:
```java
// Limpar entrada
String nome = input.trim();

// Validar
if (campo.trim().isEmpty()) { }

// Processar CSV
campos[i] = campos[i].trim();

// Normalizar
String norm = texto.strip().replaceAll("\\s+", " ");
```

**Recomendação**:
- Java 11+: use **strip()** (mais correto)
- Java < 11: use **trim()** (único disponível)
- Granular: **stripLeading()** / **stripTrailing()**