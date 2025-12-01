# Wrapper Class: Character

## 🎯 Introdução e Definição

### Definição Conceitual

**Character** é a wrapper class que encapsula o tipo primitivo `char`, permitindo representar caracteres Unicode como objetos. Diferente dos wrappers numéricos, Character **não herda de Number**, mas fornece uma vasta gama de métodos utilitários para manipulação e verificação de caracteres.

**Mapeamento**:
```java
char → Character
```

**Características Especiais**:
- **Unicode**: Suporta todo o conjunto Unicode (UTF-16)
- **16 bits**: Armazena valores de 0 a 65,535 (unsigned)
- **Métodos de classificação**: isLetter(), isDigit(), isWhitespace(), etc.
- **Conversão de caso**: toUpperCase(), toLowerCase()
- **Não numérico**: Não herda de Number

**Exemplo**:
```java
// Primitivo
char c = 'A';

// Wrapper
Character ch = Character.valueOf('A');

// Collections
List<Character> letras = new ArrayList<>();
letras.add('J');  // Autoboxing
letras.add('a');
letras.add('v');
letras.add('a');
```

### Características Fundamentais

**Character**:
- 🔤 **Unicode**: Representa caracteres Unicode (UTF-16)
- 🔒 **Imutável**: Valor não pode ser alterado
- 🎯 **Final**: Classe não pode ser estendida
- 📊 **Constantes**: MIN_VALUE (0), MAX_VALUE (65535), SIZE (16)
- 🔍 **Métodos de classificação**: 30+ métodos para verificar tipo de caractere
- 🔄 **Conversão de caso**: Upper/lower case
- 💾 **Cache**: Valores 0 a 127 são cacheados

---

## 📋 Sumário Conceitual

### Constantes Principais

```java
Character.MIN_VALUE          // '\u0000' (0)
Character.MAX_VALUE          // '\uffff' (65535)
Character.SIZE               // 16 (bits)
Character.BYTES              // 2 (bytes)
Character.TYPE               // Representa o tipo primitivo char

// Constantes de categorias Unicode
Character.SPACE_SEPARATOR
Character.UPPERCASE_LETTER
Character.LOWERCASE_LETTER
Character.DECIMAL_DIGIT_NUMBER
// ... (muitas outras)
```

### Métodos de Classificação

| Método                    | Descrição                        | Exemplo                  |
|---------------------------|----------------------------------|--------------------------|
| `isLetter()`              | É letra?                         | 'A' → true, '1' → false  |
| `isDigit()`               | É dígito?                        | '5' → true, 'A' → false  |
| `isLetterOrDigit()`       | É letra ou dígito?               | 'A', '5' → true          |
| `isWhitespace()`          | É espaço em branco?              | ' ', '\t' → true         |
| `isUpperCase()`           | É maiúscula?                     | 'A' → true, 'a' → false  |
| `isLowerCase()`           | É minúscula?                     | 'a' → true, 'A' → false  |
| `isAlphabetic()`          | É alfabético? (inclui não-ASCII) | 'ç', 'Ñ' → true          |

---

## 🧠 Fundamentos Teóricos

### 1. Constantes e Características

**Constantes básicas**:
```java
char min = Character.MIN_VALUE;  // '\u0000'
char max = Character.MAX_VALUE;  // '\uffff'

System.out.println((int) min);   // 0
System.out.println((int) max);   // 65535

int size = Character.SIZE;       // 16 bits
int bytes = Character.BYTES;     // 2 bytes
```

**Subset Classes**:
```java
// Blocos Unicode específicos
Character.UnicodeBlock block = Character.UnicodeBlock.of('A');
System.out.println(block);  // BASIC_LATIN

// Scripts Unicode
Character.UnicodeScript script = Character.UnicodeScript.of('ç');
System.out.println(script);  // LATIN
```

### 2. Criação de Character

**valueOf()** (recomendado):
```java
Character ch1 = Character.valueOf('A');
Character ch2 = Character.valueOf((char) 65);
```

**Autoboxing**:
```java
Character ch3 = 'B';  // Equivale a Character.valueOf('B')
```

**Construtor** (deprecated Java 9+):
```java
@Deprecated
Character ch4 = new Character('C');
```

### 3. Métodos de Classificação

**isLetter()** - Verifica se é letra:
```java
System.out.println(Character.isLetter('A'));     // true
System.out.println(Character.isLetter('z'));     // true
System.out.println(Character.isLetter('ç'));     // true
System.out.println(Character.isLetter('5'));     // false
System.out.println(Character.isLetter(' '));     // false
```

**isDigit()** - Verifica se é dígito:
```java
System.out.println(Character.isDigit('5'));      // true
System.out.println(Character.isDigit('0'));      // true
System.out.println(Character.isDigit('A'));      // false
```

**isLetterOrDigit()** - Letra OU dígito:
```java
System.out.println(Character.isLetterOrDigit('A'));  // true
System.out.println(Character.isLetterOrDigit('5'));  // true
System.out.println(Character.isLetterOrDigit('_'));  // false
System.out.println(Character.isLetterOrDigit(' '));  // false
```

**isWhitespace()** - Espaço em branco:
```java
System.out.println(Character.isWhitespace(' '));    // true
System.out.println(Character.isWhitespace('\t'));   // true (tab)
System.out.println(Character.isWhitespace('\n'));   // true (newline)
System.out.println(Character.isWhitespace('\r'));   // true (carriage return)
System.out.println(Character.isWhitespace('A'));    // false
```

**isUpperCase() / isLowerCase()**:
```java
System.out.println(Character.isUpperCase('A'));  // true
System.out.println(Character.isUpperCase('a'));  // false

System.out.println(Character.isLowerCase('a'));  // true
System.out.println(Character.isLowerCase('A'));  // false
System.out.println(Character.isLowerCase('5'));  // false (não é letra)
```

**isAlphabetic()** (Java 7+) - Inclui caracteres não-ASCII:
```java
System.out.println(Character.isAlphabetic('A'));    // true
System.out.println(Character.isAlphabetic('ç'));    // true
System.out.println(Character.isAlphabetic('Ñ'));    // true
System.out.println(Character.isAlphabetic('α'));    // true (alfa grego)
System.out.println(Character.isAlphabetic('5'));    // false
```

**Outras verificações**:
```java
// isSpaceChar() - Caractere de espaço Unicode
System.out.println(Character.isSpaceChar(' '));     // true
System.out.println(Character.isSpaceChar('\u00A0')); // true (non-breaking space)

// isJavaIdentifierStart() - Pode iniciar identificador Java
System.out.println(Character.isJavaIdentifierStart('A'));  // true
System.out.println(Character.isJavaIdentifierStart('_'));  // true
System.out.println(Character.isJavaIdentifierStart('5'));  // false

// isJavaIdentifierPart() - Pode fazer parte de identificador
System.out.println(Character.isJavaIdentifierPart('A'));   // true
System.out.println(Character.isJavaIdentifierPart('5'));   // true
System.out.println(Character.isJavaIdentifierPart('_'));   // true
System.out.println(Character.isJavaIdentifierPart(' '));   // false
```

### 4. Conversão de Caso

**toUpperCase()** / **toLowerCase()**:
```java
char upper = Character.toUpperCase('a');  // 'A'
char lower = Character.toLowerCase('A');  // 'a'

// Não altera se não for letra
char digit = Character.toUpperCase('5');  // '5'
char space = Character.toLowerCase(' ');  // ' '

// Funciona com acentos
char upperC = Character.toUpperCase('ç');  // 'Ç'
char lowerN = Character.toLowerCase('Ñ');  // 'ñ'
```

**toTitleCase()** (para caracteres especiais):
```java
// Alguns caracteres Unicode têm forma "title case"
char title = Character.toTitleCase('ǆ');  // 'ǅ'
```

### 5. Conversão Numérica

**getNumericValue()** - Valor numérico do caractere:
```java
int num1 = Character.getNumericValue('5');   // 5
int num2 = Character.getNumericValue('A');   // 10 (hex)
int num3 = Character.getNumericValue('F');   // 15 (hex)
int num4 = Character.getNumericValue('Z');   // -1 (não numérico em hex)

// Dígitos romanos
int roman = Character.getNumericValue('Ⅴ');  // 5 (V romano)
```

**digit()** - Dígito em base específica:
```java
int d1 = Character.digit('5', 10);      // 5 (decimal)
int d2 = Character.digit('F', 16);      // 15 (hexadecimal)
int d3 = Character.digit('7', 8);       // 7 (octal)
int d4 = Character.digit('2', 2);       // 2 (binário) ❌ -1 (inválido!)
int d5 = Character.digit('1', 2);       // 1 (binário)
```

**forDigit()** - Caractere para dígito em base:
```java
char c1 = Character.forDigit(5, 10);    // '5'
char c2 = Character.forDigit(15, 16);   // 'f'
char c3 = Character.forDigit(7, 8);     // '7'
```

### 6. Conversão char ↔ int

**Primitivo → Wrapper**:
```java
Character ch = Character.valueOf('A');
char primitivo = ch.charValue();
int codigo = (int) 'A';  // 65

// Método toString()
String str = Character.toString('A');  // "A"
String str2 = ch.toString();           // "A"
```

### 7. Comparação

**compareTo()**:
```java
Character ch1 = 'A';
Character ch2 = 'B';

int result = ch1.compareTo(ch2);  // -1 (A < B)

// Método estático
int result2 = Character.compare('A', 'B');  // -1
```

**equals()**:
```java
Character ch1 = 'A';
Character ch2 = 'A';
Character ch3 = Character.valueOf('A');

System.out.println(ch1.equals(ch2));  // true
System.out.println(ch1 == ch2);       // true (cache!)
System.out.println(ch1 == ch3);       // true (cache 0-127)

Character ch4 = 'Ω';  // 937 (fora do cache)
Character ch5 = 'Ω';
System.out.println(ch4 == ch5);       // false (fora do cache)
System.out.println(ch4.equals(ch5));  // true ✅
```

---

## 🔍 Análise Conceitual Profunda

### Unicode e UTF-16

**Java usa UTF-16** para representar caracteres:
- **BMP (Basic Multilingual Plane)**: 1 char (U+0000 a U+FFFF)
- **Supplementary Characters**: 2 chars (surrogate pairs)

**Exemplo de Surrogate Pair**:
```java
String emoji = "😀";  // U+1F600 (fora do BMP)

System.out.println(emoji.length());  // 2 (2 chars!)
char ch1 = emoji.charAt(0);  // High surrogate
char ch2 = emoji.charAt(1);  // Low surrogate

// Verificação de surrogates
boolean isHigh = Character.isHighSurrogate(ch1);  // true
boolean isLow = Character.isLowSurrogate(ch2);    // true

// Code point (valor Unicode real)
int codePoint = emoji.codePointAt(0);  // 128512 (0x1F600)
```

### Categorias Unicode

**getType()** - Retorna categoria Unicode:
```java
int type1 = Character.getType('A');  // UPPERCASE_LETTER (1)
int type2 = Character.getType('5');  // DECIMAL_DIGIT_NUMBER (9)
int type3 = Character.getType(' ');  // SPACE_SEPARATOR (12)

// Constantes de categorias
System.out.println(Character.UPPERCASE_LETTER);      // 1
System.out.println(Character.LOWERCASE_LETTER);      // 2
System.out.println(Character.DECIMAL_DIGIT_NUMBER);  // 9
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Validação de Entrada

```java
public class ValidacaoEntrada {
    public boolean isValidUsername(String username) {
        if (username == null || username.isEmpty()) {
            return false;
        }
        
        // Primeiro caractere: letra ou underscore
        char primeiro = username.charAt(0);
        if (!Character.isLetter(primeiro) && primeiro != '_') {
            return false;
        }
        
        // Demais caracteres: letra, dígito ou underscore
        for (int i = 1; i < username.length(); i++) {
            char c = username.charAt(i);
            if (!Character.isLetterOrDigit(c) && c != '_') {
                return false;
            }
        }
        
        return true;
    }
    
    public void exemplo() {
        System.out.println(isValidUsername("user123"));    // true
        System.out.println(isValidUsername("_private"));   // true
        System.out.println(isValidUsername("123user"));    // false
        System.out.println(isValidUsername("user name"));  // false
    }
}
```

### Caso 2: Contagem de Tipos de Caracteres

```java
public class ContagemCaracteres {
    public void analisar(String texto) {
        int letras = 0;
        int digitos = 0;
        int espacos = 0;
        int outros = 0;
        
        for (char c : texto.toCharArray()) {
            if (Character.isLetter(c)) {
                letras++;
            } else if (Character.isDigit(c)) {
                digitos++;
            } else if (Character.isWhitespace(c)) {
                espacos++;
            } else {
                outros++;
            }
        }
        
        System.out.println("Letras: " + letras);
        System.out.println("Dígitos: " + digitos);
        System.out.println("Espaços: " + espacos);
        System.out.println("Outros: " + outros);
    }
    
    public void exemplo() {
        analisar("Hello, World! 123");
        // Letras: 10
        // Dígitos: 3
        // Espaços: 2
        // Outros: 2
    }
}
```

### Caso 3: Conversão de Caso Customizada

```java
public class ConversaoCaso {
    public String capitalize(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        
        char primeiro = Character.toUpperCase(str.charAt(0));
        String resto = str.substring(1).toLowerCase();
        return primeiro + resto;
    }
    
    public String toggleCase(String str) {
        StringBuilder sb = new StringBuilder();
        
        for (char c : str.toCharArray()) {
            if (Character.isUpperCase(c)) {
                sb.append(Character.toLowerCase(c));
            } else if (Character.isLowerCase(c)) {
                sb.append(Character.toUpperCase(c));
            } else {
                sb.append(c);
            }
        }
        
        return sb.toString();
    }
    
    public void exemplo() {
        System.out.println(capitalize("hello"));      // Hello
        System.out.println(toggleCase("Hello World")); // hELLO wORLD
    }
}
```

### Caso 4: Parsing de Hexadecimal

```java
public class ParsingHex {
    public int parseHex(String hex) {
        int resultado = 0;
        
        for (char c : hex.toCharArray()) {
            int digito = Character.digit(c, 16);
            
            if (digito == -1) {
                throw new IllegalArgumentException("Hex inválido: " + c);
            }
            
            resultado = resultado * 16 + digito;
        }
        
        return resultado;
    }
    
    public void exemplo() {
        System.out.println(parseHex("FF"));    // 255
        System.out.println(parseHex("1A3"));   // 419
        System.out.println(parseHex("CAFE"));  // 51966
    }
}
```

### Caso 5: Remoção de Espaços em Branco

```java
public class RemocaoEspacos {
    public String removeWhitespace(String str) {
        StringBuilder sb = new StringBuilder();
        
        for (char c : str.toCharArray()) {
            if (!Character.isWhitespace(c)) {
                sb.append(c);
            }
        }
        
        return sb.toString();
    }
    
    public void exemplo() {
        String texto = "Hello\t World\n123";
        String semEspacos = removeWhitespace(texto);
        System.out.println(semEspacos);  // HelloWorld123
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Caracteres Fora do BMP

**Problema**: Caracteres Unicode > U+FFFF não cabem em 1 char.

```java
String emoji = "😀";
System.out.println(emoji.length());  // 2 (surrogate pair)

char c = emoji.charAt(0);  // ⚠️ Apenas high surrogate
```

**Solução**: Usar code points.
```java
int codePoint = emoji.codePointAt(0);  // 128512
```

### 2. Cache Apenas 0-127

**Problema**: Caracteres fora do cache podem causar bugs com ==.

```java
Character ch1 = 'Ω';
Character ch2 = 'Ω';
System.out.println(ch1 == ch2);  // false ⚠️
```

**Solução**: Usar `equals()`.
```java
System.out.println(ch1.equals(ch2));  // true ✅
```

### 3. toUpperCase/toLowerCase Não Funciona para Tudo

**Problema**: Alguns caracteres não têm equivalente upper/lower.

```java
char numero = Character.toUpperCase('5');  // '5' (sem mudança)
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Tipo Primitivo char**: Base do wrapper
- **String**: Coleção de caracteres
- **Unicode**: Sistema de codificação
- **Regex**: Padrões de caracteres
- **Autoboxing/Unboxing**: Conversão automática

---

## 🚀 Boas Práticas

1. ✅ **Use métodos de classificação para validação**
   ```java
   if (Character.isDigit(c)) { ... }
   ```

2. ✅ **Sempre use equals() para comparar Character**
   ```java
   if (ch1.equals(ch2)) { ... }
   ```

3. ✅ **Verifique null antes de unboxing**
   ```java
   if (ch != null) {
       char c = ch;
   }
   ```

4. ✅ **Use métodos estáticos quando possível**
   ```java
   char upper = Character.toUpperCase(c);
   ```

5. ✅ **Considere code points para Unicode completo**
   ```java
   int codePoint = str.codePointAt(index);
   ```
