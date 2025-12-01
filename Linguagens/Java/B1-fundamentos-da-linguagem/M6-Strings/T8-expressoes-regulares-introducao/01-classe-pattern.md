# Classe Pattern

## 🎯 Introdução e Definição

**Pattern é a classe fundamental** para trabalhar com **expressões regulares (regex)** em Java. Ela representa um **padrão compilado** que pode ser usado para buscar, validar e manipular texto. Pattern **compila a expressão regular** em uma representação interna otimizada, que pode ser reutilizada múltiplas vezes com alto desempenho.

**Conceito central**: Pattern **não executa buscas diretamente**. Ela apenas **compila e armazena** o padrão regex. Para executar operações, Pattern **cria objetos Matcher** que realizam as buscas efetivamente. Este design permite **reusar o padrão compilado** múltiplas vezes sem recompilar.

**Exemplo fundamental**:
```java
import java.util.regex.Pattern;
import java.util.regex.Matcher;

// Compilar padrão regex
Pattern pattern = Pattern.compile("\\d+");  // Dígitos

// Criar matcher para texto específico
Matcher matcher = pattern.matcher("Tenho 25 anos");

// Executar busca
if (matcher.find()) {
    System.out.println("Encontrado: " + matcher.group());  // "25"
}

// Reusar pattern com outro texto
Matcher matcher2 = pattern.matcher("Valor: 100");
if (matcher2.find()) {
    System.out.println("Encontrado: " + matcher2.group());  // "100"
}
```

**Características principais**:
- **Compilação**: transforma String regex em estrutura otimizada
- **Imutável**: Pattern compilado não pode ser modificado
- **Reutilizável**: crie múltiplos Matchers a partir do mesmo Pattern
- **Thread-safe**: pode ser compartilhado entre threads
- **Performance**: compilar uma vez, usar muitas vezes

## 📋 Fundamentos Teóricos

### 1️⃣ Compilação de Padrões

**Pattern.compile() - método principal**:

```java
// Assinatura
public static Pattern compile(String regex)
public static Pattern compile(String regex, int flags)

// Uso básico
Pattern pattern = Pattern.compile("abc");

// Com flags
Pattern pattern = Pattern.compile("abc", Pattern.CASE_INSENSITIVE);
```

**Exemplo de compilação**:
```java
// Padrão simples
Pattern pattern1 = Pattern.compile("java");

// Padrão com metacaracteres
Pattern pattern2 = Pattern.compile("\\d{3}-\\d{4}");  // Telefone

// Padrão complexo
Pattern pattern3 = Pattern.compile("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");  // Email
```

**O que acontece na compilação**:
```java
// String regex é analisada (parsing)
// Cria estrutura interna (NFA/DFA)
// Otimiza para performance
// Resultado: Pattern imutável e thread-safe

Pattern pattern = Pattern.compile("\\d+");
// Internamente cria máquina de estados para matching
```

**PatternSyntaxException**:
```java
try {
    // Regex inválido
    Pattern pattern = Pattern.compile("[a-z");  // ❌ Falta ]
} catch (PatternSyntaxException e) {
    System.err.println("Regex inválido: " + e.getMessage());
    System.err.println("Descrição: " + e.getDescription());
    System.err.println("Índice: " + e.getIndex());
    System.err.println("Padrão: " + e.getPattern());
}
```

### 2️⃣ Flags (Modificadores)

**Flags disponíveis**:

```java
// CASE_INSENSITIVE - ignora maiúsculas/minúsculas
Pattern p1 = Pattern.compile("java", Pattern.CASE_INSENSITIVE);
// Combina: "java", "JAVA", "Java", "JaVa"

// MULTILINE - ^ e $ consideram linhas
Pattern p2 = Pattern.compile("^inicio", Pattern.MULTILINE);
// ^ combina início de cada linha, não só início do texto

// DOTALL - . combina quebra de linha
Pattern p3 = Pattern.compile("a.b", Pattern.DOTALL);
// . combina inclusive \n

// UNICODE_CASE - case insensitive Unicode
Pattern p4 = Pattern.compile("café", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);

// COMMENTS - permite comentários no regex
Pattern p5 = Pattern.compile(
    """
    \\d{3}   # Três dígitos
    -        # Hífen
    \\d{4}   # Quatro dígitos
    """,
    Pattern.COMMENTS
);
```

**Combinar flags**:
```java
// Operador | (OR bitwise)
Pattern pattern = Pattern.compile(
    "padrão",
    Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
);

// Múltiplas flags
int flags = Pattern.CASE_INSENSITIVE | 
            Pattern.DOTALL | 
            Pattern.UNICODE_CASE;
Pattern pattern = Pattern.compile("regex", flags);
```

**Flags embutidas no regex**:
```java
// (?i) - case insensitive
Pattern.compile("(?i)java");
// Equivalente a Pattern.compile("java", Pattern.CASE_INSENSITIVE)

// (?m) - multiline
Pattern.compile("(?m)^inicio");

// (?s) - dotall
Pattern.compile("(?s)a.b");

// (?x) - comments
Pattern.compile("(?x) \\d{3} - \\d{4}");

// Combinar
Pattern.compile("(?im)^java");  // case insensitive + multiline
```

### 3️⃣ Criando Matchers

**pattern.matcher() - criar Matcher**:

```java
Pattern pattern = Pattern.compile("\\d+");

// Criar matcher para texto
Matcher matcher = pattern.matcher("Idade: 25");

// Verificar se encontrou
if (matcher.find()) {
    System.out.println(matcher.group());  // "25"
}

// Reusar pattern com outro texto
Matcher matcher2 = pattern.matcher("Total: 100");
if (matcher2.find()) {
    System.out.println(matcher2.group());  // "100"
}
```

**Padrão típico de uso**:
```java
// 1. Compilar pattern (uma vez)
Pattern pattern = Pattern.compile("regex");

// 2. Criar matcher para cada texto
for (String texto : textos) {
    Matcher matcher = pattern.matcher(texto);
    
    // 3. Executar operação
    if (matcher.matches()) {
        System.out.println(texto + " válido");
    }
}
```

### 4️⃣ Métodos Utilitários

**Pattern.matches() - verificação simples**:

```java
// Método estático - uso único
boolean resultado = Pattern.matches("\\d+", "123");
System.out.println(resultado);  // true

// Equivalente a:
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("123");
boolean resultado = matcher.matches();

// ⚠️ Pattern.matches() compila a cada chamada
// Para uso repetido, compile uma vez
```

**Quando usar Pattern.matches()**:
```java
// ✓ Uso único
if (Pattern.matches("\\d{3}-\\d{4}", telefone)) {
    // Processar
}

// ❌ Loop (ineficiente)
for (String tel : telefones) {
    if (Pattern.matches("\\d{3}-\\d{4}", tel)) {  // Recompila!
        // ...
    }
}

// ✓ Loop (eficiente)
Pattern pattern = Pattern.compile("\\d{3}-\\d{4}");
for (String tel : telefones) {
    if (pattern.matcher(tel).matches()) {  // Reutiliza pattern
        // ...
    }
}
```

**Pattern.quote() - escapar String literal**:
```java
// Problema: metacaracteres em String
String texto = "Preço: $10.50";
Pattern pattern = Pattern.compile("$10.50");  // ❌ $ e . são metacaracteres

// Solução: Pattern.quote()
String literal = Pattern.quote("$10.50");
pattern = Pattern.compile(literal);
// Resultado: "\\Q$10.50\\E" (trata como literal)

// Uso prático
String busca = "$10.50";
Pattern pattern = Pattern.compile(Pattern.quote(busca));
Matcher matcher = pattern.matcher("Preço: $10.50");
System.out.println(matcher.find());  // true
```

**split() - dividir String**:
```java
Pattern pattern = Pattern.compile("\\s+");  // Espaços

String[] palavras = pattern.split("java  python    c++");
// Resultado: ["java", "python", "c++"]

// Com limite
String[] partes = pattern.split("a b c d e", 3);
// Resultado: ["a", "b", "c d e"]

// String.split() usa Pattern internamente
String[] palavras2 = "java python c++".split("\\s+");
// Equivalente, mas compila Pattern a cada chamada
```

### 5️⃣ Métodos de Informação

**pattern() - retornar regex original**:

```java
Pattern pattern = Pattern.compile("\\d{3}-\\d{4}");

String regex = pattern.pattern();
System.out.println(regex);  // "\d{3}-\d{4}"
```

**flags() - retornar flags usadas**:
```java
Pattern pattern = Pattern.compile(
    "java",
    Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
);

int flags = pattern.flags();
System.out.println(flags);  // 10 (valor numérico)

// Verificar flag específica
boolean isCaseInsensitive = (flags & Pattern.CASE_INSENSITIVE) != 0;
System.out.println(isCaseInsensitive);  // true
```

**toString() - representação textual**:
```java
Pattern pattern = Pattern.compile("\\d+");
System.out.println(pattern);  // "\d+"
```

### 6️⃣ Performance - Compilar vs Usar Diretamente

**Benchmark - uso único**:

```java
String regex = "\\d{3}-\\d{4}";
String texto = "Tel: 123-4567";

// Pattern.matches() - uso único
long inicio = System.nanoTime();
for (int i = 0; i < 10000; i++) {
    Pattern.matches(regex, texto);  // Compila a cada vez
}
long tempo1 = (System.nanoTime() - inicio) / 1_000_000;

// Pattern compilado - reutilizado
inicio = System.nanoTime();
Pattern pattern = Pattern.compile(regex);
for (int i = 0; i < 10000; i++) {
    pattern.matcher(texto).matches();  // Reutiliza
}
long tempo2 = (System.nanoTime() - inicio) / 1_000_000;

System.out.println("Pattern.matches(): " + tempo1 + "ms");  // ~500ms
System.out.println("Pattern reutilizado: " + tempo2 + "ms");  // ~50ms
// 10x mais rápido!
```

**Recomendação de uso**:
```java
// ✓ Compilar uma vez, usar muitas
private static final Pattern TELEFONE_PATTERN = 
    Pattern.compile("\\d{3}-\\d{4}");

public boolean validarTelefone(String tel) {
    return TELEFONE_PATTERN.matcher(tel).matches();
}

// ❌ Compilar a cada chamada
public boolean validarTelefone(String tel) {
    return Pattern.matches("\\d{3}-\\d{4}", tel);  // Recompila!
}
```

### 7️⃣ Thread-Safety

**Pattern é thread-safe**:

```java
// Pattern pode ser compartilhado entre threads
private static final Pattern EMAIL_PATTERN = 
    Pattern.compile("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$");

// Thread 1
new Thread(() -> {
    Matcher m = EMAIL_PATTERN.matcher("user@example.com");
    System.out.println(m.matches());
}).start();

// Thread 2
new Thread(() -> {
    Matcher m = EMAIL_PATTERN.matcher("admin@test.org");
    System.out.println(m.matches());
}).start();

// ✓ Seguro - Pattern é imutável
// Cada thread cria seu próprio Matcher
```

**Matcher NÃO é thread-safe**:
```java
Pattern pattern = Pattern.compile("\\d+");

// ❌ Compartilhar Matcher entre threads
Matcher matcher = pattern.matcher("123");

new Thread(() -> {
    matcher.reset("456");  // ❌ Race condition!
    System.out.println(matcher.find());
}).start();

new Thread(() -> {
    matcher.reset("789");  // ❌ Race condition!
    System.out.println(matcher.find());
}).start();

// ✓ Cada thread cria seu próprio Matcher
new Thread(() -> {
    Matcher m = pattern.matcher("456");
    System.out.println(m.find());
}).start();
```

### 8️⃣ Padrões de Uso Comuns

**Validação de formato**:

```java
public class Validador {
    private static final Pattern CPF = 
        Pattern.compile("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}");
    
    private static final Pattern EMAIL = 
        Pattern.compile("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                       Pattern.CASE_INSENSITIVE);
    
    public static boolean validarCPF(String cpf) {
        return CPF.matcher(cpf).matches();
    }
    
    public static boolean validarEmail(String email) {
        return EMAIL.matcher(email).matches();
    }
}
```

**Extração de dados**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Idade: 25, Altura: 180");

while (matcher.find()) {
    System.out.println(matcher.group());
}
// Output:
// 25
// 180
```

**Substituição**:
```java
Pattern pattern = Pattern.compile("\\d+");
Matcher matcher = pattern.matcher("Tenho 25 anos");

String resultado = matcher.replaceAll("XX");
System.out.println(resultado);  // "Tenho XX anos"
```

### 9️⃣ Boas Práticas

**Declarar como constante**:

```java
// ✓ Pattern como constante static final
public class Validador {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$");
    
    public boolean validar(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }
}

// ❌ Compilar a cada chamada
public boolean validar(String email) {
    return Pattern.matches("^[a-z0-9._%+-]+@...", email);
}
```

**Documentar regex complexos**:
```java
// ✓ Documentar padrão complexo
/**
 * Valida formato de telefone brasileiro: (XX) XXXXX-XXXX
 */
private static final Pattern TELEFONE = Pattern.compile(
    "\\(\\d{2}\\) \\d{5}-\\d{4}"
);

// Ou usar COMMENTS flag
private static final Pattern TELEFONE = Pattern.compile(
    """
    \\(       # Abre parêntese
    \\d{2}    # DDD (2 dígitos)
    \\)       # Fecha parêntese
    \\s       # Espaço
    \\d{5}    # Primeira parte (5 dígitos)
    -         # Hífen
    \\d{4}    # Segunda parte (4 dígitos)
    """,
    Pattern.COMMENTS
);
```

**Tratar exceções**:
```java
public static Pattern compilarSeguro(String regex) {
    try {
        return Pattern.compile(regex);
    } catch (PatternSyntaxException e) {
        System.err.println("Regex inválido: " + e.getMessage());
        return null;  // Ou lançar exceção personalizada
    }
}
```

### 🔟 Comparação: Pattern vs String.matches()

**String.matches() - conveniência**:

```java
// String.matches() - método de instância
String texto = "123";
boolean valido = texto.matches("\\d+");

// Internamente:
// Pattern.compile("\\d+").matcher("123").matches()
```

**Performance**:
```java
// Uso único - similar
Pattern.matches("\\d+", "123");  // OK
"123".matches("\\d+");           // OK

// Uso repetido - Pattern muito mais rápido
Pattern pattern = Pattern.compile("\\d+");
for (String s : lista) {
    pattern.matcher(s).matches();  // ✓ 10x mais rápido
}

for (String s : lista) {
    s.matches("\\d+");  // ❌ Recompila a cada vez
}
```

## 🎯 Aplicabilidade

**1. Compilar Pattern Reutilizável**:
```java
Pattern pattern = Pattern.compile("\\d+");
```

**2. Validar Formato**:
```java
pattern.matcher(texto).matches();
```

**3. Buscar Ocorrências**:
```java
Matcher m = pattern.matcher(texto);
while (m.find()) { ... }
```

**4. Dividir String**:
```java
String[] partes = pattern.split(texto);
```

**5. Pattern com Flags**:
```java
Pattern.compile("regex", Pattern.CASE_INSENSITIVE);
```

## ⚠️ Armadilhas Comuns

**1. Recompilar Desnecessariamente**:
```java
for (String s : lista) {
    Pattern.matches("\\d+", s);  // ❌ Recompila!
}
```

**2. Compartilhar Matcher entre Threads**:
```java
Matcher m = pattern.matcher("...");  // ❌ Não thread-safe
```

**3. Esquecer Escape em Metacaracteres**:
```java
Pattern.compile(".");  // ❌ Qualquer caractere
Pattern.compile("\\.");  // ✓ Ponto literal
```

**4. Não Tratar PatternSyntaxException**:
```java
Pattern.compile("[a-z");  // ❌ Lança exceção
```

**5. Usar Pattern.matches() em Loop**:
```java
for (...) Pattern.matches(...);  // ❌ Ineficiente
```

## ✅ Boas Práticas

**1. Compilar Uma Vez, Usar Muitas**:
```java
private static final Pattern P = Pattern.compile("...");
```

**2. Documentar Regex Complexos**:
```java
// Valida email formato padrão
private static final Pattern EMAIL = ...;
```

**3. Pattern Thread-Safe, Matcher Não**:
```java
Pattern p = ...;  // ✓ Compartilhar
Matcher m = p.matcher(...);  // ✓ Por thread
```

**4. Usar Pattern.quote() para Literais**:
```java
Pattern.compile(Pattern.quote(literal));
```

**5. Tratar PatternSyntaxException**:
```java
try { Pattern.compile(...); } catch (PatternSyntaxException e) { }
```

## 📚 Resumo Executivo

**Pattern - padrão regex compilado**.

**Criar Pattern**:
```java
Pattern p = Pattern.compile("\\d+");  // Compilar
Pattern p = Pattern.compile("java", Pattern.CASE_INSENSITIVE);  // Com flags
```

**Criar Matcher**:
```java
Matcher m = p.matcher("texto");  // Para executar buscas
```

**Métodos úteis**:
```java
Pattern.matches(regex, texto)  // Validação única
pattern.split(texto)            // Dividir String
Pattern.quote(literal)          // Escapar literal
```

**Performance**:
```java
Pattern.matches() em loop:  ❌ Recompila (10x mais lento)
Pattern compilado reutilizado: ✓ Compila 1x (10x mais rápido)
```

**Thread-safety**:
```java
Pattern:  ✓ Thread-safe (imutável)
Matcher:  ❌ Não thread-safe (criar por thread)
```

**Uso típico**:
```java
// Compilar como constante
private static final Pattern EMAIL = 
    Pattern.compile("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$");

// Usar
public boolean validar(String email) {
    return EMAIL.matcher(email).matches();
}
```

**Recomendação**: **Compile Pattern uma vez** como constante `static final`. **Crie Matcher** para cada texto. **Nunca** use `Pattern.matches()` em loops (10x mais lento). Pattern é **thread-safe**, Matcher **não é**.