# Tipo Primitivo char: Unicode e Valores Especiais

## 🎯 Introdução e Definição

### Definição Conceitual

O tipo **`char`** é um **tipo primitivo de 16 bits (2 bytes)** em Java, usado para armazenar **um único caractere Unicode**. Diferente de linguagens como C (onde `char` é 8 bits ASCII), o `char` de Java segue o padrão **UTF-16**, suportando caracteres de **múltiplos idiomas**, **emojis** e **símbolos especiais**.

Armazena valores numéricos **sem sinal** de **0 a 65,535** (`\u0000` a `\uFFFF`), onde cada valor corresponde a um **code point Unicode**. É o único tipo primitivo **unsigned** (sem sinal) em Java.

### Características Fundamentais

- **Tamanho**: 16 bits (2 bytes)
- **Faixa**: 0 a 65,535 (unsigned)
- **Codificação**: UTF-16 (Unicode)
- **Valor padrão**: `'\u0000'` (NUL)
- **Tipo numérico**: Unsigned integer (único primitivo sem sinal)
- **Wrapper class**: `java.lang.Character`

### Contexto Histórico

**Unicode vs ASCII**:
- **ASCII (1963)**: 7 bits, 128 caracteres (apenas inglês)
- **ISO-8859-1/Latin-1 (1987)**: 8 bits, 256 caracteres (Europa Ocidental)
- **Unicode (1991)**: Padrão universal para todos caracteres de todos idiomas
- **UTF-16**: Codificação de 16 bits usada internamente pelo Java

**Java (1995)**:
- Escolheu UTF-16 para suportar internacionalização desde o início
- Decisão visionária: suporte nativo a múltiplos idiomas

### Problema Fundamental que Resolve

#### Representação de Caracteres Além do ASCII

**ASCII (127 caracteres)** é insuficiente para:
- Caracteres acentuados: `á`, `é`, `ñ`, `ç`
- Alfabetos não-latinos: `中文` (chinês), `العربية` (árabe), `한글` (coreano)
- Símbolos matemáticos: `∑`, `∫`, `π`, `∞`
- Emojis: `😀`, `🚀`, `❤️`

**Unicode/UTF-16** permite:
```java
char letra = 'A';          // Inglês
char acento = 'á';         // Português
char chines = '中';        // Chinês
char emoji = '😀';         // ⚠️ Emoji não cabe em char (precisa surrogate pair)
```

#### Operações Numéricas com Caracteres

**char é um tipo numérico**:
```java
char a = 'A';
int codigoASCII = a;  // 65
char proximo = (char) (a + 1);  // 'B'
```

---

## 📋 Sumário Conceitual

### Declaração e Inicialização

**Literal de Caractere** (aspas simples):
```java
char letra = 'A';
char numero = '9';
char simbolo = '@';
char espaco = ' ';
```

**Unicode Escape** (`\uXXXX`):
```java
char a = '\u0041';      // 'A' (hexadecimal)
char acento = '\u00E1'; // 'á'
char chines = '\u4E2D'; // '中'
char emoji = '\uD83D'; // ⚠️ Emoji requer surrogate pair (2 chars)
```

**Sequências de Escape**:
```java
char tab = '\t';         // Tabulação
char novaLinha = '\n';   // Nova linha
char retorno = '\r';     // Retorno de carro
char aspasSimples = '\''; // Aspas simples
char aspasDuplas = '\"'; // Aspas duplas (⚠️ em char não precisa)
char backslash = '\\';   // Barra invertida
char nulo = '\0';        // Caractere nulo (NUL, código 0)
```

**Valor Numérico**:
```java
char a = 65;       // 'A' (código ASCII/Unicode 65)
char b = 0x0042;   // 'B' (hexadecimal 42 = 66)
```

**Limites**:
```java
char min = Character.MIN_VALUE;  // '\u0000' (0)
char max = Character.MAX_VALUE;  // '\uFFFF' (65535)
```

---

## 🧠 Fundamentos Teóricos

### Representação Unicode (UTF-16)

**Code Point vs Code Unit**:
- **Code Point**: Número único que identifica um caractere Unicode (ex: U+0041 = 'A')
- **Code Unit**: Unidade de 16 bits em UTF-16

**BMP (Basic Multilingual Plane)**:
- Caracteres de **U+0000 a U+FFFF** (65,536 caracteres)
- **Cabem em 1 `char`** (16 bits)
- Cobre maioria dos idiomas modernos

**Surrogate Pairs** (caracteres fora do BMP):
- Caracteres de **U+10000 a U+10FFFF** (emojis, hieróglifos raros, etc.)
- **Requerem 2 `char`** (32 bits)
- Exemplo: `😀` = `\uD83D\uDE00` (2 code units)

**Exemplo**:
```java
// BMP (cabe em 1 char)
char a = 'A';           // U+0041 (BMP)
char chines = '中';     // U+4E2D (BMP)

// Fora do BMP (requer String ou 2 chars)
String emoji = "😀";    // U+1F600 (fora do BMP)
System.out.println(emoji.length());  // 2 (2 code units)
```

### Tabela Unicode Importante

| Faixa | Descrição | Exemplo |
|-------|-----------|---------|
| **U+0000 - U+007F** | ASCII básico | `'A'`, `'0'`, `'@'` |
| **U+0080 - U+00FF** | Latin-1 Supplement | `'á'`, `'ç'`, `'ñ'` |
| **U+0100 - U+017F** | Latin Extended-A | `'ā'`, `'ē'` |
| **U+0370 - U+03FF** | Grego | `'α'`, `'β'`, `'π'` |
| **U+0400 - U+04FF** | Cirílico | `'А'`, `'Б'`, `'В'` |
| **U+4E00 - U+9FFF** | CJK (Chinês/Japonês/Coreano) | `'中'`, `'日'`, `'한'` |
| **U+1F600 - U+1F64F** | Emoticons (⚠️ fora BMP) | `😀`, `😁`, `😂` |

### Conversão Numérica

**char para int**:
```java
char a = 'A';
int codigo = a;  // 65 (widening automático)
```

**int para char**:
```java
int codigo = 65;
char letra = (char) codigo;  // 'A' (narrowing - requer cast)
```

**Operações Aritméticas**:
```java
char a = 'A';
char b = (char) (a + 1);  // 'B' (a + 1 = 66)
char c = (char) (a + 32); // 'a' (diferença entre maiúscula/minúscula)

// ⚠️ Operações promovem char para int
char x = 'A';
char y = 'B';
// char soma = x + y;  // ❌ ERRO: int não cabe em char sem cast
int soma = x + y;      // ✅ OK: 131 (65 + 66)
```

---

## 🔍 Análise Conceitual Profunda

### Sequências de Escape

| Escape | Descrição | Valor Unicode |
|--------|-----------|---------------|
| `\t` | Tabulação (Tab) | `\u0009` |
| `\n` | Nova linha (Line Feed) | `\u000A` |
| `\r` | Retorno de carro (Carriage Return) | `\u000D` |
| `\f` | Form feed | `\u000C` |
| `\b` | Backspace | `\u0008` |
| `\'` | Aspas simples | `\u0027` |
| `\"` | Aspas duplas | `\u0022` |
| `\\` | Barra invertida | `\u005C` |
| `\0` | Caractere nulo (NUL) | `\u0000` |

**Exemplo**:
```java
System.out.println("Linha 1\nLinha 2");  // Nova linha
System.out.println("Coluna1\tColuna2");  // Tabulação
System.out.println("Aspas: \'simples\'"); // Aspas simples
```

### Wrapper Class: Character

**Métodos de Verificação**:
```java
char ch = 'A';

Character.isLetter(ch);       // true
Character.isDigit('9');       // true
Character.isLetterOrDigit(ch); // true
Character.isUpperCase(ch);    // true
Character.isLowerCase('a');   // true
Character.isWhitespace(' ');  // true
Character.isSpaceChar(' ');   // true
```

**Métodos de Conversão**:
```java
char maiuscula = Character.toUpperCase('a');  // 'A'
char minuscula = Character.toLowerCase('A');  // 'a'
char titulo = Character.toTitleCase('a');     // 'A'
```

**Informações Unicode**:
```java
char ch = 'A';
int codigo = Character.getNumericValue(ch);  // 10 (valor numérico, não código Unicode)
int tipo = Character.getType(ch);  // 1 (UPPERCASE_LETTER)
String nome = Character.getName(ch);  // "LATIN CAPITAL LETTER A"
```

**Constantes**:
```java
Character.MIN_VALUE    // '\u0000' (0)
Character.MAX_VALUE    // '\uFFFF' (65535)
Character.SIZE         // 16 (bits)
Character.BYTES        // 2 (bytes)
```

---

## 🎯 Aplicabilidade e Contextos

### Uso 1: Processamento de Texto

```java
public class ProcessadorTexto {
    public int contarVogais(String texto) {
        int contador = 0;
        for (char c : texto.toCharArray()) {
            char minuscula = Character.toLowerCase(c);
            if (minuscula == 'a' || minuscula == 'e' || minuscula == 'i' ||
                minuscula == 'o' || minuscula == 'u') {
                contador++;
            }
        }
        return contador;
    }
    
    public boolean ehPalindromo(String texto) {
        int inicio = 0, fim = texto.length() - 1;
        while (inicio < fim) {
            char charInicio = Character.toLowerCase(texto.charAt(inicio));
            char charFim = Character.toLowerCase(texto.charAt(fim));
            
            if (!Character.isLetterOrDigit(charInicio)) {
                inicio++;
                continue;
            }
            if (!Character.isLetterOrDigit(charFim)) {
                fim--;
                continue;
            }
            
            if (charInicio != charFim) {
                return false;
            }
            inicio++;
            fim--;
        }
        return true;
    }
}
```

### Uso 2: Validação de Entrada

```java
public class ValidadorEntrada {
    public boolean ehCPFValido(String cpf) {
        // Remove não-dígitos
        cpf = cpf.replaceAll("\\D", "");
        
        if (cpf.length() != 11) return false;
        
        // Verifica se todos caracteres são dígitos
        for (char c : cpf.toCharArray()) {
            if (!Character.isDigit(c)) {
                return false;
            }
        }
        
        // Validação adicional do CPF...
        return true;
    }
    
    public boolean ehEmailValido(String email) {
        if (email.length() < 3) return false;
        
        char primeiroChar = email.charAt(0);
        char ultimoChar = email.charAt(email.length() - 1);
        
        // Email não pode começar ou terminar com '@' ou '.'
        if (primeiroChar == '@' || primeiroChar == '.' ||
            ultimoChar == '@' || ultimoChar == '.') {
            return false;
        }
        
        // Deve conter '@'
        return email.contains("@");
    }
}
```

### Uso 3: Cifras e Criptografia Básica

```java
public class CifraCesar {
    public String cifrar(String texto, int deslocamento) {
        StringBuilder resultado = new StringBuilder();
        
        for (char c : texto.toCharArray()) {
            if (Character.isUpperCase(c)) {
                char cifrado = (char) ((c - 'A' + deslocamento) % 26 + 'A');
                resultado.append(cifrado);
            } else if (Character.isLowerCase(c)) {
                char cifrado = (char) ((c - 'a' + deslocamento) % 26 + 'a');
                resultado.append(cifrado);
            } else {
                resultado.append(c);  // Mantém não-letras
            }
        }
        
        return resultado.toString();
    }
    
    public String decifrar(String texto, int deslocamento) {
        return cifrar(texto, 26 - deslocamento);
    }
}
```

### Uso 4: Parsing de Arquivos CSV

```java
public class CSVParser {
    private static final char DELIMITADOR = ',';
    private static final char ASPAS = '"';
    
    public String[] parseLinha(String linha) {
        List<String> campos = new ArrayList<>();
        StringBuilder campoAtual = new StringBuilder();
        boolean dentroDeAspas = false;
        
        for (int i = 0; i < linha.length(); i++) {
            char c = linha.charAt(i);
            
            if (c == ASPAS) {
                dentroDeAspas = !dentroDeAspas;
            } else if (c == DELIMITADOR && !dentroDeAspas) {
                campos.add(campoAtual.toString());
                campoAtual = new StringBuilder();
            } else {
                campoAtual.append(c);
            }
        }
        
        campos.add(campoAtual.toString());
        return campos.toArray(new String[0]);
    }
}
```

### Uso 5: Normalização de Strings

```java
public class NormalizadorTexto {
    public String removerAcentos(String texto) {
        StringBuilder resultado = new StringBuilder();
        
        for (char c : texto.toCharArray()) {
            // Mapeamento manual simplificado
            switch (c) {
                case 'á': case 'à': case 'ã': case 'â': case 'ä':
                    resultado.append('a');
                    break;
                case 'é': case 'è': case 'ê': case 'ë':
                    resultado.append('e');
                    break;
                case 'í': case 'ì': case 'î': case 'ï':
                    resultado.append('i');
                    break;
                case 'ó': case 'ò': case 'õ': case 'ô': case 'ö':
                    resultado.append('o');
                    break;
                case 'ú': case 'ù': case 'û': case 'ü':
                    resultado.append('u');
                    break;
                case 'ç':
                    resultado.append('c');
                    break;
                default:
                    resultado.append(c);
            }
        }
        
        return resultado.toString();
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. Emojis Não Cabem em char

**Problema**: Emojis estão fora do BMP (requerem 2 code units).

```java
char emoji = '😀';  // ❌ ERRO: char cannot convert from String
```

**Solução**: Usar `String` ou `int` (code point).

```java
String emoji = "😀";  // ✅ String suporta surrogate pairs
int codePoint = 0x1F600;  // Code point do emoji
String emojiFromCodePoint = new String(Character.toChars(codePoint));
```

### 2. Comparação Case-Insensitive

**Problema**: Comparar maiúsculas/minúsculas diretamente.

```java
char a = 'A';
char b = 'a';
System.out.println(a == b);  // false
```

**Solução**: Converter antes de comparar.

```java
if (Character.toLowerCase(a) == Character.toLowerCase(b)) {
    System.out.println("Iguais (case-insensitive)");
}
```

### 3. Operações Aritméticas Promovem para int

**Problema**: Resultado de operações é `int`, não `char`.

```java
char a = 'A';
char b = 'B';
char soma = a + b;  // ❌ ERRO: int não cabe em char
```

**Solução**: Fazer casting explícito.

```java
char soma = (char) (a + b);  // ✅ OK (casting)
```

### 4. Caractere Nulo `\u0000`

**Problema**: Valor padrão de `char` é `\u0000` (NUL), não `' '` (espaço).

```java
char[] array = new char[5];
System.out.println(Arrays.toString(array));  // [NUL, NUL, NUL, NUL, NUL]
```

**Solução**: Inicializar explicitamente se necessário.

```java
Arrays.fill(array, ' ');  // Preenche com espaços
```

### 5. Diferença entre `'0'` e `0`

**Cuidado**: `'0'` (caractere) ≠ `0` (número).

```java
char digito = '0';
int numero = digito;
System.out.println(numero);  // 48 (código Unicode de '0', não 0!)
```

**Solução**: Converter corretamente.

```java
int valorNumerico = Character.getNumericValue('0');  // 0
// ou
int valorNumerico = '0' - '0';  // 0 (subtrai código base)
```

---

## 🔗 Interconexões Conceituais

**Tipos Relacionados**:
- **String**: Sequência de caracteres (imutável)
- **StringBuilder/StringBuffer**: Sequência mutável
- **byte**: Para caracteres ASCII (8 bits)

**APIs que Usam char**:
- `String.charAt(int)`
- `String.toCharArray()`
- `Character` wrapper class
- `Scanner.next().charAt(0)`

---

## 🚀 Boas Práticas

1. ✅ **Usar aspas simples** para literais `char`: `'A'`
2. ✅ **Usar `String`** para emojis e caracteres fora do BMP
3. ✅ **Usar `Character` métodos** ao invés de lógica manual (`isLetter()`, `toUpperCase()`)
4. ✅ **Fazer casting explícito** em operações aritméticas
5. ✅ **Usar Unicode escapes** (`\uXXXX`) para caracteres especiais
6. ❌ **Evitar comparação case-sensitive** sem conversão
7. ✅ **Validar entrada** antes de converter para `char`
8. ❌ **Evitar `new Character()`** (deprecated - usar `Character.valueOf()`)
9. ✅ **Usar `StringBuilder`** para concatenar muitos chars
10. ✅ **Lembrar**: `char` é **unsigned** (único primitivo sem sinal)
