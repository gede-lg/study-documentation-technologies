# isEmpty() e isBlank() - Verificação de Vazias

## 🎯 Introdução e Definição

**isEmpty()** verifica se String tem **tamanho zero** (length() == 0). **isBlank()** (Java 11+) verifica se String é **vazia OU contém apenas espaços**. Ambos retornam **boolean**.

**Conceito central**: São essenciais para **validar entrada do usuário**, **verificar campos obrigatórios** e **processar dados**, com diferenças importantes entre vazia pura (isEmpty) e vazia/whitespace (isBlank).

**Exemplo fundamental**:
```java
String s1 = "";
String s2 = "   ";
String s3 = "Java";

// isEmpty() - apenas length() == 0
System.out.println(s1.isEmpty());  // true  (vazia)
System.out.println(s2.isEmpty());  // false (tem espaços)
System.out.println(s3.isEmpty());  // false (tem conteúdo)

// isBlank() - vazia OU só espaços (Java 11+)
System.out.println(s1.isBlank());  // true  (vazia)
System.out.println(s2.isBlank());  // true  (só espaços)
System.out.println(s3.isBlank());  // false (tem conteúdo)
```

**Diferenças principais**:
- **isEmpty()**: `length() == 0` (Java 1.6+)
- **isBlank()**: `isEmpty() || trim().isEmpty()` (Java 11+)
- **isEmpty()** mais restritivo, **isBlank()** mais abrangente

## 📋 Fundamentos Teóricos

### 1️⃣ isEmpty() - Verifica length() == 0

**Retorna true se String vazia (sem caracteres)**:

```java
String s1 = "";
System.out.println(s1.isEmpty());  // true

String s2 = "A";
System.out.println(s2.isEmpty());  // false

String s3 = " ";  // espaço
System.out.println(s3.isEmpty());  // false (tem 1 caractere)

String s4 = "   ";  // 3 espaços
System.out.println(s4.isEmpty());  // false (tem 3 caracteres)
```

**Assinatura**:
```java
public boolean isEmpty()  // Java 1.6+

// Retorna: true se length() == 0, false caso contrário
// Equivalente a: length() == 0
```

**Implementação**:
```java
public boolean isEmpty() {
    return length() == 0;
}

// Simples e direto - apenas verifica tamanho
```

**Uso típico**:
```java
String nome = obterNome();

if (nome.isEmpty()) {
    System.out.println("Nome não pode ser vazio");
} else {
    System.out.println("Nome: " + nome);
}

// Validação básica de String vazia
```

### 2️⃣ isBlank() - Verifica Vazia OU Só Espaços (Java 11+)

**Retorna true se vazia OU contém apenas whitespace**:

```java
String s1 = "";
System.out.println(s1.isBlank());  // true (vazia)

String s2 = " ";
System.out.println(s2.isBlank());  // true (só espaço)

String s3 = "   ";
System.out.println(s3.isBlank());  // true (só espaços)

String s4 = "\t\n\r";
System.out.println(s4.isBlank());  // true (só whitespace)

String s5 = "  A  ";
System.out.println(s5.isBlank());  // false (tem conteúdo)
```

**Assinatura**:
```java
public boolean isBlank()  // Java 11+

// Retorna: true se vazia OU só whitespace, false se tem conteúdo
// Considera: espaço, tab, newline, carriage return, etc.
```

**Implementação conceitual**:
```java
public boolean isBlank() {
    return isEmpty() || chars().allMatch(Character::isWhitespace);
}

// Ou equivalente a:
// isEmpty() || trim().isEmpty()
```

**Whitespace considerado**:
```java
// isBlank() identifica como whitespace:
// - Espaço ' '
// - Tab '\t'
// - Newline '\n'
// - Carriage return '\r'
// - Espaços Unicode (non-breaking space, etc.)

String s1 = " ";           // espaço
String s2 = "\t";          // tab
String s3 = "\n";          // newline
String s4 = "\r";          // carriage return
String s5 = "\u00A0";      // non-breaking space
String s6 = "\u2000";      // en quad space

System.out.println(s1.isBlank());  // true
System.out.println(s2.isBlank());  // true
System.out.println(s3.isBlank());  // true
System.out.println(s4.isBlank());  // true
System.out.println(s5.isBlank());  // true
System.out.println(s6.isBlank());  // true
```

### 3️⃣ Comparação: isEmpty() vs isBlank()

**Tabela comparativa**:

| String | isEmpty() | isBlank() | Explicação |
|--------|-----------|-----------|------------|
| `""` | `true` | `true` | Vazia |
| `" "` | `false` | `true` | 1 espaço |
| `"   "` | `false` | `true` | Múltiplos espaços |
| `"\t"` | `false` | `true` | Tab |
| `"\n"` | `false` | `true` | Newline |
| `"A"` | `false` | `false` | Conteúdo |
| `" A "` | `false` | `false` | Conteúdo com espaços |

**Código de comparação**:
```java
String[] strings = {"", " ", "   ", "\t", "\n", "A", " A "};

System.out.println("String | isEmpty | isBlank");
System.out.println("-------|---------|--------");

for (String s : strings) {
    String repr = s.replace("\t", "\\t").replace("\n", "\\n");
    System.out.printf("%-6s | %-7s | %s\n", 
        "\"" + repr + "\"", 
        s.isEmpty(), 
        s.isBlank()
    );
}

// Saída:
// String | isEmpty | isBlank
// -------|---------|--------
// ""     | true    | true
// " "    | false   | true
// "   "  | false   | true
// "\t"   | false   | true
// "\n"   | false   | true
// "A"    | false   | false
// " A "  | false   | false
```

**Quando usar cada um**:
```java
String nome = obterNome();

// ✓ isEmpty() - quando espaços são válidos
if (nome.isEmpty()) {
    // Rejeitar apenas vazia, aceitar "   " (espaços)
}

// ✓ isBlank() - quando espaços NÃO são válidos
if (nome.isBlank()) {
    // Rejeitar vazia E só espaços
}

// Regra: isBlank() é mais rigoroso para validação de entrada
```

### 4️⃣ Equivalências com Outros Métodos

**isEmpty() equivalente a length()**:

```java
String s = "";

// Equivalentes
boolean vazia1 = s.isEmpty();
boolean vazia2 = (s.length() == 0);
boolean vazia3 = s.equals("");

System.out.println(vazia1 == vazia2);  // true
System.out.println(vazia2 == vazia3);  // true

// isEmpty() é mais legível
```

**isBlank() equivalente a trim().isEmpty()**:
```java
String s = "   ";

// Equivalentes (Java 11+)
boolean blank1 = s.isBlank();
boolean blank2 = s.trim().isEmpty();

System.out.println(blank1 == blank2);  // true

// MAS isBlank() é mais eficiente (não cria nova String)
```

**Performance: isBlank() vs trim().isEmpty()**:
```java
String s = "   ";

// trim().isEmpty() - ~100ns (cria nova String vazia)
long inicio = System.nanoTime();
boolean b1 = s.trim().isEmpty();
long tempo1 = System.nanoTime() - inicio;

// isBlank() - ~50ns (não aloca)
inicio = System.nanoTime();
boolean b2 = s.isBlank();
long tempo2 = System.nanoTime() - inicio;

// isBlank() ~2x mais rápido (evita alocação)
```

### 5️⃣ Null Safety

**Ambos lançam NPE com null**:

```java
String s = null;

// ❌ NullPointerException
boolean vazia = s.isEmpty();   // NPE
boolean blank = s.isBlank();   // NPE

// ✓ Verificar null primeiro
if (s != null && s.isEmpty()) {
    // Seguro
}

if (s != null && s.isBlank()) {
    // Seguro
}
```

**Helper method null-safe**:
```java
public static boolean isNullOrEmpty(String s) {
    return s == null || s.isEmpty();
}

public static boolean isNullOrBlank(String s) {
    return s == null || s.isBlank();
}

// Uso
if (isNullOrEmpty(nome)) {
    // Trata null E vazia
}

if (isNullOrBlank(campo)) {
    // Trata null, vazia E só espaços
}
```

**Apache Commons StringUtils**:
```java
import org.apache.commons.lang3.StringUtils;

// Null-safe e verifica vazia
StringUtils.isEmpty(null);   // true
StringUtils.isEmpty("");     // true
StringUtils.isEmpty("  ");   // false

// Null-safe e verifica blank
StringUtils.isBlank(null);   // true
StringUtils.isBlank("");     // true
StringUtils.isBlank("  ");   // true

// Muito usado em validações
```

### 6️⃣ Validação de Entrada do Usuário

**Validar campos obrigatórios**:

```java
public void cadastrarUsuario(String nome, String email) {
    // Java 11+ - isBlank() rejeita vazia e só espaços
    if (nome == null || nome.isBlank()) {
        throw new IllegalArgumentException("Nome é obrigatório");
    }
    
    if (email == null || email.isBlank()) {
        throw new IllegalArgumentException("Email é obrigatório");
    }
    
    // Prosseguir com cadastro
    salvar(nome.trim(), email.trim());
}

// isBlank() é perfeito para validar entrada de formulários
```

**Filtrar strings vazias de lista**:
```java
List<String> linhas = Arrays.asList("Java", "", "Python", "   ", "JavaScript");

// Remover vazias (isEmpty)
List<String> semVazias = linhas.stream()
    .filter(s -> !s.isEmpty())
    .collect(Collectors.toList());
// ["Java", "   ", "Python", "JavaScript"] (mantém "   ")

// Remover vazias e blank (isBlank)
List<String> semBlanks = linhas.stream()
    .filter(s -> !s.isBlank())
    .collect(Collectors.toList());
// ["Java", "Python", "JavaScript"] (remove "   ")
```

**Validar antes de processar**:
```java
String input = obterInput();

if (input != null && !input.isBlank()) {
    // Processar apenas se tem conteúdo real
    processar(input.trim());
} else {
    System.out.println("Entrada inválida");
}
```

### 7️⃣ Performance e Complexidade

**Complexidade temporal**:

```java
// isEmpty()
// Tempo: O(1) - apenas verifica length()
// Espaço: O(1) - não aloca

String s = "A".repeat(1_000_000);  // 1 milhão de caracteres

long inicio = System.nanoTime();
boolean vazia = s.isEmpty();
long tempo = System.nanoTime() - inicio;
// ~5 nanossegundos (constante)

// isBlank()
// Tempo: O(n) no pior caso - percorre todos os caracteres
// Espaço: O(1) - não aloca

String s2 = " ".repeat(1_000_000);  // 1 milhão de espaços

inicio = System.nanoTime();
boolean blank = s2.isBlank();
long tempo2 = System.nanoTime() - inicio;
// ~5 milissegundos (linear)
```

**Benchmark**:
```java
// isEmpty() - sempre O(1)
String vazia = "";
String grande = "A".repeat(100000);

long t1 = System.nanoTime();
vazia.isEmpty();
long tempo1 = System.nanoTime() - t1;  // ~5ns

long t2 = System.nanoTime();
grande.isEmpty();
long tempo2 = System.nanoTime() - t2;  // ~5ns (mesmo tempo!)

// isBlank() - O(n)
String espacos = " ".repeat(100000);

long t3 = System.nanoTime();
espacos.isBlank();
long tempo3 = System.nanoTime() - t3;  // ~500µs (cresce com tamanho)
```

**Otimização: isBlank() para-cedo**:
```java
// isBlank() para assim que encontra caractere não-whitespace
String s1 = "A" + " ".repeat(1_000_000);  // 'A' no início

long inicio = System.nanoTime();
boolean blank1 = s1.isBlank();  // false
long tempo1 = System.nanoTime() - inicio;
// ~10ns (para no primeiro char)

String s2 = " ".repeat(1_000_000) + "A";  // 'A' no fim

inicio = System.nanoTime();
boolean blank2 = s2.isBlank();  // false
long tempo2 = System.nanoTime() - inicio;
// ~5ms (percorre até o fim)

// Pior caso: quando É blank (percorre tudo)
```

### 8️⃣ Casos de Uso Práticos

**Validação de formulários**:

```java
public class Usuario {
    private String nome;
    private String email;
    
    public void setNome(String nome) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome inválido");
        }
        this.nome = nome.trim();
    }
    
    public void setEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email inválido");
        }
        this.email = email.trim();
    }
}
```

**Processar arquivo ignorando linhas vazias**:
```java
List<String> linhas = Files.readAllLines(path);

List<String> linhasValidas = linhas.stream()
    .filter(linha -> !linha.isBlank())  // Remove vazias e só espaços
    .map(String::trim)                  // Remove espaços das extremidades
    .collect(Collectors.toList());

// Processa apenas linhas com conteúdo
```

**Validar senha**:
```java
public boolean senhaValida(String senha) {
    if (senha == null || senha.isBlank()) {
        return false;  // Senha vazia ou só espaços
    }
    
    if (senha.length() < 8) {
        return false;  // Muito curta
    }
    
    // Outras validações...
    return true;
}
```

**Construir mensagem condicional**:
```java
String titulo = obterTitulo();
String subtitulo = obterSubtitulo();

StringBuilder msg = new StringBuilder();
msg.append(titulo);

if (subtitulo != null && !subtitulo.isBlank()) {
    msg.append(" - ").append(subtitulo);
}

String mensagem = msg.toString();
// Adiciona subtítulo apenas se não for blank
```

### 9️⃣ Compatibilidade com Java < 11

**isEmpty() disponível desde Java 6**:

```java
// ✓ Java 6+ - OK
String s = "";
boolean vazia = s.isEmpty();
```

**isBlank() apenas Java 11+**:
```java
// ✓ Java 11+
String s = "   ";
boolean blank = s.isBlank();

// ❌ Java 8, 9, 10 - método não existe
```

**Alternativa para Java < 11**:
```java
// Implementação manual de isBlank()
public static boolean isBlank(String s) {
    return s == null || s.trim().isEmpty();
}

// Uso
if (isBlank(campo)) {
    // Trata como blank
}

// Ou usar Apache Commons StringUtils
import org.apache.commons.lang3.StringUtils;

if (StringUtils.isBlank(campo)) {
    // Null-safe e funciona em Java 6+
}
```

### 🔟 Edge Cases e Casos Especiais

**String só com Unicode whitespace**:

```java
String s1 = "\u00A0";      // non-breaking space
String s2 = "\u2000";      // en quad
String s3 = "\u3000";      // ideographic space

// isEmpty() - false (tem caracteres)
System.out.println(s1.isEmpty());  // false
System.out.println(s2.isEmpty());  // false
System.out.println(s3.isEmpty());  // false

// isBlank() - true (são whitespace)
System.out.println(s1.isBlank());  // true
System.out.println(s2.isBlank());  // true
System.out.println(s3.isBlank());  // true
```

**Mistura de whitespace**:
```java
String s = " \t\n\r ";

System.out.println(s.isEmpty());  // false (length = 5)
System.out.println(s.isBlank());  // true (tudo whitespace)
```

**Zero-width characters**:
```java
String s = "\u200B";  // zero-width space

System.out.println(s.isEmpty());  // false (tem 1 char)
System.out.println(s.isBlank());  // true (é whitespace)
System.out.println(s.length());   // 1
```

## 🎯 Aplicabilidade

**1. Validar Entrada do Usuário**:
```java
if (nome.isBlank()) {
    throw new IllegalArgumentException("Nome obrigatório");
}
```

**2. Filtrar Strings Vazias/Blank**:
```java
lista.stream().filter(s -> !s.isBlank())
```

**3. Verificar Campos Obrigatórios**:
```java
if (campo != null && !campo.isEmpty()) { }
```

**4. Processar Apenas Linhas com Conteúdo**:
```java
linhas.stream().filter(linha -> !linha.isBlank())
```

**5. Validação Condicional**:
```java
if (opcional.isEmpty()) { /* usar padrão */ }
```

## ⚠️ Armadilhas Comuns

**1. NullPointerException**:
```java
String s = null;
s.isEmpty();   // ❌ NPE
s.isBlank();   // ❌ NPE

// ✓ Verificar null
if (s != null && s.isEmpty()) { }
```

**2. Confundir isEmpty() e isBlank()**:
```java
"   ".isEmpty();  // false (tem espaços)
"   ".isBlank();  // true (só espaços)

// Escolher o método apropriado
```

**3. Usar em Java < 11**:
```java
// ❌ Java 8/9/10
s.isBlank();  // Método não existe

// ✓ Alternativa
s.trim().isEmpty()
```

**4. Não Validar Null**:
```java
// ❌ NPE se s for null
if (s.isEmpty()) { }

// ✓ Validar null
if (s != null && s.isEmpty()) { }
```

**5. trim().isEmpty() ao Invés de isBlank()**:
```java
// ✗ Menos eficiente (cria String)
if (s.trim().isEmpty()) { }

// ✓ Mais eficiente (Java 11+)
if (s.isBlank()) { }
```

## ✅ Boas Práticas

**1. Validar Null Antes de isEmpty/isBlank**:
```java
if (s != null && s.isBlank()) { }
```

**2. Use isBlank() para Validação de Entrada**:
```java
if (campo.isBlank()) {
    throw new IllegalArgumentException("Campo obrigatório");
}
```

**3. Prefira isBlank() a trim().isEmpty()**:
```java
// ✓ Mais eficiente (Java 11+)
s.isBlank();

// ✗ Menos eficiente
s.trim().isEmpty();
```

**4. Use StringUtils para Null-Safety**:
```java
StringUtils.isBlank(s);  // Null-safe
```

**5. Escolha Método Apropriado**:
```java
// isEmpty() - aceita espaços
// isBlank() - rejeita espaços
```

## 📚 Resumo Executivo

**isEmpty()** verifica `length() == 0`, **isBlank()** verifica vazia OU só whitespace.

**Assinaturas**:
```java
boolean isEmpty()   // Java 6+
boolean isBlank()   // Java 11+
```

**Uso básico**:
```java
"".isEmpty();      // true
" ".isEmpty();     // false (tem espaço)

"".isBlank();      // true
" ".isBlank();     // true (só espaço)
"A".isBlank();     // false (tem conteúdo)
```

**Comparação**:
```java
String s = "   ";

s.isEmpty();  // false (length = 3)
s.isBlank();  // true (só espaços)
```

**Equivalências**:
```java
s.isEmpty()  ≡  s.length() == 0
s.isBlank()  ≡  s.trim().isEmpty()  // mas isBlank() é mais eficiente
```

**Null safety**:
```java
String s = null;
s.isEmpty();   // ❌ NPE
s.isBlank();   // ❌ NPE

// ✓ Validar null
if (s != null && s.isEmpty()) { }
if (s != null && s.isBlank()) { }

// Ou usar StringUtils (null-safe)
StringUtils.isEmpty(s);   // true
StringUtils.isBlank(s);   // true
```

**Performance**:
```java
isEmpty()  // O(1) - sempre constante
isBlank()  // O(n) - percorre caracteres
```

**Quando usar**:
```java
// isEmpty() - quando espaços são válidos
if (opcional.isEmpty()) { }

// isBlank() - validação de entrada (rejeitar espaços)
if (campo.isBlank()) {
    throw new IllegalArgumentException("Campo obrigatório");
}
```

**Compatibilidade**:
- `isEmpty()`: Java 6+
- `isBlank()`: Java 11+
- Java < 11: usar `s.trim().isEmpty()` ou `StringUtils.isBlank()`

**Recomendação**: Prefira `isBlank()` a `trim().isEmpty()` em Java 11+ - mais eficiente e legível