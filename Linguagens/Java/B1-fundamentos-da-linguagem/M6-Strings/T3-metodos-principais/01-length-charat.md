# length() e charAt() - Acesso Básico a Strings

## 🎯 Introdução e Definição

**length()** e **charAt()** são os métodos mais fundamentais para **acessar informações sobre Strings** em Java. O primeiro retorna o **tamanho da String** (número de caracteres), enquanto o segundo permite **acessar um caractere específico** por índice.

**Conceito central**: Strings em Java são **sequências indexadas** de caracteres, começando do índice **0** até **length() - 1**. Compreender esses métodos é essencial para qualquer manipulação de texto.

**Exemplo fundamental**:
```java
String texto = "Java";

// length() - tamanho
int tamanho = texto.length();  // 4

// charAt() - caractere por índice
char primeiro = texto.charAt(0);  // 'J' (índice 0)
char ultimo = texto.charAt(3);    // 'a' (índice 3)

// Índices:  0   1   2   3
// String:  'J' 'a' 'v' 'a'
```

**Uso típico**:
- Iterar sobre caracteres de uma String
- Validar tamanho de entrada
- Acessar posições específicas
- Percorrer String do início ao fim

## 📋 Fundamentos Teóricos

### 1️⃣ Método length()

**Retorna número de caracteres**:

```java
String s1 = "Java";
System.out.println(s1.length());  // 4

String s2 = "";
System.out.println(s2.length());  // 0

String s3 = "Hello World";
System.out.println(s3.length());  // 11 (espaço conta!)

String s4 = "João";
System.out.println(s4.length());  // 4
```

**Complexidade**: O(1) - tempo constante
```java
// Internamente: String armazena length como campo
public final class String {
    private final byte[] value;
    private final int hash;
    
    // Tamanho é calculado ao criar String e armazenado
    public int length() {
        return value.length >> coder();  // Operação O(1)
    }
}
```

**length() não é propriedade**:
```java
// ❌ ERRO - length não é campo público
String s = "Java";
int tamanho = s.length;  // ERRO de compilação

// ✓ CORRETO - length() é método
int tamanho = s.length();  // OK
```

**Comparação com arrays**:
```java
// Array: length é propriedade (sem parênteses)
int[] array = {1, 2, 3};
int tam = array.length;  // ✓ Sem ()

// String: length() é método (com parênteses)
String s = "abc";
int tam = s.length();  // ✓ Com ()
```

### 2️⃣ Método charAt()

**Retorna caractere em índice específico**:

```java
String s = "Java";

char c0 = s.charAt(0);  // 'J'
char c1 = s.charAt(1);  // 'a'
char c2 = s.charAt(2);  // 'v'
char c3 = s.charAt(3);  // 'a'

// Visualização:
// Índice:  0   1   2   3
// Char:   'J' 'a' 'v' 'a'
```

**Assinatura**:
```java
public char charAt(int index)
// Retorna: char no índice especificado
// Lança: StringIndexOutOfBoundsException se índice inválido
```

**Complexidade**: O(1) - acesso direto ao array interno
```java
// Implementação interna simplificada
public char charAt(int index) {
    if (index < 0 || index >= length()) {
        throw new StringIndexOutOfBoundsException(index);
    }
    return value[index];  // Acesso direto O(1)
}
```

### 3️⃣ Indexação de Strings

**Índices começam em 0**:

```java
String s = "ABCDE";

// Índices válidos: 0, 1, 2, 3, 4
System.out.println(s.charAt(0));  // 'A' - primeiro
System.out.println(s.charAt(4));  // 'E' - último

// Índice:   0   1   2   3   4
// String:  'A' 'B' 'C' 'D' 'E'
// Length: 5
```

**Último caractere**:
```java
String s = "Hello";
int ultimoIndice = s.length() - 1;  // 4
char ultimo = s.charAt(ultimoIndice);  // 'o'

// Atalho comum
char ultimo = s.charAt(s.length() - 1);
```

**Índices negativos NÃO permitidos**:
```java
String s = "Test";

// ❌ ERRO - índice negativo
char c = s.charAt(-1);  // StringIndexOutOfBoundsException

// Nota: diferente de Python onde -1 é último
// Python: "Test"[-1] = 't'
// Java: precisa usar s.charAt(s.length() - 1)
```

### 4️⃣ StringIndexOutOfBoundsException

**Lançada quando índice é inválido**:

```java
String s = "Java";  // length = 4, índices 0-3

// ✓ Índices válidos
s.charAt(0);  // OK
s.charAt(3);  // OK

// ❌ Índices inválidos
s.charAt(4);   // StringIndexOutOfBoundsException
s.charAt(-1);  // StringIndexOutOfBoundsException
s.charAt(100); // StringIndexOutOfBoundsException
```

**Tratamento de exceção**:
```java
String s = "Test";
int indice = 10;

try {
    char c = s.charAt(indice);
    System.out.println(c);
} catch (StringIndexOutOfBoundsException e) {
    System.out.println("Índice inválido: " + indice);
    System.out.println("Tamanho da String: " + s.length());
}
```

**Validação preventiva**:
```java
String s = "Hello";
int indice = 10;

// ✓ Verificar antes de acessar
if (indice >= 0 && indice < s.length()) {
    char c = s.charAt(indice);
    System.out.println(c);
} else {
    System.out.println("Índice fora dos limites");
}
```

### 5️⃣ Iteração com charAt()

**Loop for tradicional**:
```java
String s = "Hello";

for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    System.out.println("Índice " + i + ": " + c);
}

// Saída:
// Índice 0: H
// Índice 1: e
// Índice 2: l
// Índice 3: l
// Índice 4: o
```

**Iterar de trás para frente**:
```java
String s = "World";

for (int i = s.length() - 1; i >= 0; i--) {
    char c = s.charAt(i);
    System.out.print(c);  // dlroW
}
```

**Comparação com toCharArray()**:
```java
String s = "Test";

// Método 1: charAt() - sem criar array
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    processar(c);
}

// Método 2: toCharArray() - cria cópia do array
char[] chars = s.toCharArray();
for (char c : chars) {
    processar(c);
}

// charAt(): mais eficiente (sem alocação)
// toCharArray(): conveniente para enhanced for
```

### 6️⃣ String Vazia e length()

**String vazia tem length 0**:

```java
String vazia1 = "";
String vazia2 = new String();

System.out.println(vazia1.length());  // 0
System.out.println(vazia2.length());  // 0

// isEmpty() usa length() internamente
System.out.println(vazia1.isEmpty());  // true

// Equivalente a:
System.out.println(vazia1.length() == 0);  // true
```

**Não confundir com null**:
```java
String s1 = "";      // String vazia (length = 0)
String s2 = null;    // Referência nula (sem objeto)

System.out.println(s1.length());  // 0 - OK

System.out.println(s2.length());  // NullPointerException!
```

**Validação correta**:
```java
String s = obterString();

// ❌ ERRO se s for null
if (s.length() == 0) {
    // NullPointerException se s == null
}

// ✓ CORRETO - verifica null primeiro
if (s != null && s.length() == 0) {
    System.out.println("String vazia");
}

// ✓ Ou use isEmpty()
if (s != null && s.isEmpty()) {
    System.out.println("String vazia");
}
```

### 7️⃣ Unicode e Caracteres Multibyte

**charAt() retorna char (16 bits)**:

```java
// Caracteres BMP (Basic Multilingual Plane)
String s = "Café";
System.out.println(s.length());      // 4
System.out.println(s.charAt(3));     // 'é'

// Emoji (fora do BMP) - 2 chars
String emoji = "😀";
System.out.println(emoji.length());  // 2 (surrogate pair!)
System.out.println(emoji.charAt(0)); // ? (high surrogate)
System.out.println(emoji.charAt(1)); // ? (low surrogate)
```

**Surrogate pairs**:
```java
String s = "A😀B";

// Length conta surrogate pairs
System.out.println(s.length());  // 4 (não 3!)

// Estrutura:
// [0] = 'A'
// [1] = high surrogate de 😀
// [2] = low surrogate de 😀
// [3] = 'B'

System.out.println(s.charAt(0));  // 'A'
System.out.println(s.charAt(1));  // ? (parte do emoji)
System.out.println(s.charAt(2));  // ? (parte do emoji)
System.out.println(s.charAt(3));  // 'B'
```

**Iterar corretamente com Unicode**:
```java
String s = "Hello😀World";

// ❌ charAt() - quebra emojis
for (int i = 0; i < s.length(); i++) {
    System.out.println(s.charAt(i));  // Mostra surrogates separados
}

// ✓ codePointAt() - caracteres completos
for (int i = 0; i < s.length(); ) {
    int codePoint = s.codePointAt(i);
    System.out.println(Character.toChars(codePoint));
    i += Character.charCount(codePoint);  // Pula 1 ou 2 chars
}
```

### 8️⃣ Performance de length() e charAt()

**length() é muito rápido**:

```java
// Benchmark: 1 bilhão de chamadas
String s = "Test";

long inicio = System.nanoTime();
for (int i = 0; i < 1_000_000_000; i++) {
    int len = s.length();
}
long duracao = System.nanoTime() - inicio;
// Tempo: ~500ms
// Por chamada: ~0.5 nanossegundos

// length() é O(1) e muito otimizado pela JVM
```

**charAt() também é O(1)**:

```java
// Benchmark: 100 milhões de chamadas
String s = "Hello World";

long inicio = System.nanoTime();
for (int i = 0; i < 100_000_000; i++) {
    char c = s.charAt(i % s.length());
}
long duracao = System.nanoTime() - inicio;
// Tempo: ~300ms
// Por chamada: ~3 nanossegundos

// Acesso direto ao array interno - muito rápido
```

**Comparação com toCharArray()**:
```java
String s = "Example";

// charAt() em loop - sem alocação
long inicio = System.nanoTime();
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
}
long tempo1 = System.nanoTime() - inicio;
// Tempo: ~50ns

// toCharArray() - aloca array
inicio = System.nanoTime();
char[] chars = s.toCharArray();
for (int i = 0; i < chars.length; i++) {
    char c = chars[i];
}
long tempo2 = System.nanoTime() - inicio;
// Tempo: ~200ns (4x mais lento devido à alocação)
```

### 9️⃣ Casos de Uso Comuns

**Contar caracteres específicos**:
```java
public int contarOcorrencias(String s, char c) {
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == c) {
            count++;
        }
    }
    return count;
}

String texto = "programming";
int ocorrencias = contarOcorrencias(texto, 'm');  // 2
```

**Inverter String**:
```java
public String inverter(String s) {
    StringBuilder sb = new StringBuilder(s.length());
    for (int i = s.length() - 1; i >= 0; i--) {
        sb.append(s.charAt(i));
    }
    return sb.toString();
}

String original = "Java";
String invertida = inverter(original);  // "avaJ"
```

**Verificar palíndromo**:
```java
public boolean ehPalindromo(String s) {
    int esquerda = 0;
    int direita = s.length() - 1;
    
    while (esquerda < direita) {
        if (s.charAt(esquerda) != s.charAt(direita)) {
            return false;
        }
        esquerda++;
        direita--;
    }
    return true;
}

System.out.println(ehPalindromo("radar"));  // true
System.out.println(ehPalindromo("java"));   // false
```

**Extrair dígitos**:
```java
public String extrairDigitos(String s) {
    StringBuilder digitos = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (Character.isDigit(c)) {
            digitos.append(c);
        }
    }
    return digitos.toString();
}

String texto = "ABC123XYZ456";
String numeros = extrairDigitos(texto);  // "123456"
```

### 🔟 Alternativas Modernas (Java 8+)

**Stream de caracteres**:

```java
String s = "Hello";

// chars() - IntStream de valores char
s.chars()
 .forEach(c -> System.out.println((char) c));

// Contar caracteres específicos
long count = s.chars()
              .filter(c -> c == 'l')
              .count();  // 2
```

**codePoints() para Unicode**:

```java
String s = "A😀B";

// codePoints() - IntStream de code points
s.codePoints()
 .forEach(cp -> System.out.println(Character.toChars(cp)));

// Saída:
// A
// 😀  (emoji completo, não quebrado)
// B

// Contar caracteres Unicode reais
long count = s.codePoints().count();  // 3 (não 4!)
```

**Comparação**:
```java
String s = "Test😀";

// length() - conta code units (chars)
System.out.println(s.length());  // 6

// codePoints().count() - conta caracteres reais
System.out.println(s.codePoints().count());  // 5
```

## 🎯 Aplicabilidade

**1. Validar Tamanho de Entrada**:
```java
public boolean senhaValida(String senha) {
    return senha != null && senha.length() >= 8;
}
```

**2. Iterar sobre Caracteres**:
```java
for (int i = 0; i < texto.length(); i++) {
    char c = texto.charAt(i);
    processar(c);
}
```

**3. Acessar Primeiro/Último Caractere**:
```java
char primeiro = s.charAt(0);
char ultimo = s.charAt(s.length() - 1);
```

**4. Converter para Array**:
```java
char[] chars = new char[s.length()];
for (int i = 0; i < s.length(); i++) {
    chars[i] = s.charAt(i);
}
```

**5. Buscar Padrões**:
```java
for (int i = 0; i < s.length() - 1; i++) {
    if (s.charAt(i) == 'a' && s.charAt(i + 1) == 'b') {
        System.out.println("Encontrado 'ab' no índice " + i);
    }
}
```

## ⚠️ Armadilhas Comuns

**1. Confundir length() com length**:
```java
String s = "Test";
int tam = s.length;  // ❌ ERRO - não é propriedade
int tam = s.length();  // ✓ Método
```

**2. Acessar Índice Inválido**:
```java
String s = "Hi";
char c = s.charAt(2);  // ❌ StringIndexOutOfBoundsException
```

**3. Não Verificar null**:
```java
String s = null;
int len = s.length();  // ❌ NullPointerException
```

**4. Índice Negativo**:
```java
char c = s.charAt(-1);  // ❌ Exceção (não funciona como Python)
```

**5. Assumir 1 char = 1 caractere**:
```java
String emoji = "😀";
System.out.println(emoji.length());  // 2, não 1!
```

## ✅ Boas Práticas

**1. Verificar null Antes**:
```java
if (s != null && s.length() > 0) {
    // seguro
}
```

**2. Armazenar length em Loop**:
```java
int len = s.length();
for (int i = 0; i < len; i++) {
    // mais eficiente (evita chamar length() a cada iteração)
}
```

**3. Validar Índices**:
```java
if (indice >= 0 && indice < s.length()) {
    char c = s.charAt(indice);
}
```

**4. Usar isEmpty() para Strings Vazias**:
```java
if (s.isEmpty()) {  // Mais claro que s.length() == 0
    // ...
}
```

**5. Unicode - Use codePoints()**:
```java
// ✓ Para texto com emojis
s.codePoints().forEach(cp -> processar(cp));

// ✗ charAt() quebra emojis
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);  // Pode pegar metade de emoji
}
```

## 📚 Resumo Executivo

**length()** e **charAt()**: métodos fundamentais para acesso a Strings.

**length()**:
```java
String s = "Java";
int tamanho = s.length();  // 4
```
- Retorna número de caracteres (code units char)
- Complexidade: O(1)
- String vazia: `"".length()` → 0
- **Método**, não propriedade (precisa de `()`)

**charAt()**:
```java
char c = s.charAt(0);  // 'J' - primeiro caractere
char ultimo = s.charAt(s.length() - 1);  // 'a' - último
```
- Retorna char em índice específico
- Índices: 0 até `length() - 1`
- Complexidade: O(1)
- Lança `StringIndexOutOfBoundsException` se inválido

**Indexação**:
```
String:  "Java"
Índice:   0123
          ^^^^
          ||||
charAt(): JAVA
```

**Iteração**:
```java
// Percorrer caracteres
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
}
```

**Exceções**:
```java
s.charAt(-1);           // ❌ StringIndexOutOfBoundsException
s.charAt(s.length());   // ❌ StringIndexOutOfBoundsException
null.length();          // ❌ NullPointerException
```

**Validação**:
```java
if (s != null && indice >= 0 && indice < s.length()) {
    char c = s.charAt(indice);  // Seguro
}
```

**Unicode**:
```java
String emoji = "😀";
emoji.length();  // 2 (surrogate pair)
emoji.codePoints().count();  // 1 (caractere real)
```

**Performance**: Ambos são O(1) e extremamente rápidos (acesso direto ao array interno).