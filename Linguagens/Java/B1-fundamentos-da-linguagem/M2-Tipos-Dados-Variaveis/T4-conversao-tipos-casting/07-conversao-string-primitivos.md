# Conversão de String para Tipos Primitivos

## 🎯 Introdução e Definição

### Definição Conceitual

**Conversão de String para primitivos** é o processo de **transformar representações textuais de valores** (tipo `String`) em seus **tipos numéricos ou lógicos correspondentes** (byte, short, int, long, float, double, boolean, char). Esta operação é fundamental para:
- **Processar entrada de usuário** (console, formulários, arquivos)
- **Parsear dados** de APIs, arquivos de configuração, JSON, XML
- **Converter parâmetros** de linha de comando
- **Processar dados textuais** em geral

**Exemplo**:
```java
String texto = "123";
int numero = Integer.parseInt(texto);  // "123" → 123
```

### Características Fundamentais

**Conversão String → Primitivo**:
- 🔄 **Parsing**: Interpretação textual → valor numérico
- ⚠️ **Unsafe**: Pode lançar `NumberFormatException`
- 📝 **Métodos estáticos**: Via classes Wrapper (`Integer`, `Double`, etc.)
- 🎯 **Type-specific**: Cada tipo tem seu método de parsing
- ✅ **Validável**: Pode tratar exceptions ou validar formato

### Problema que Resolve

**Entrada de Dados**: Dados externos (usuário, arquivos, rede) chegam como texto.

```java
// Entrada do usuário (String)
String entrada = scanner.nextLine();  // "42"

// Conversão para int
int numero = Integer.parseInt(entrada);  // 42

// Agora pode usar em operações aritméticas
int dobro = numero * 2;  // 84
```

---

## 📋 Sumário Conceitual

### Métodos de Conversão

| Tipo Primitivo | Classe Wrapper | Método Principal        | Exemplo                              |
|----------------|----------------|-------------------------|--------------------------------------|
| byte           | Byte           | `parseByte(String)`     | `Byte.parseByte("10")`               |
| short          | Short          | `parseShort(String)`    | `Short.parseShort("100")`            |
| int            | Integer        | `parseInt(String)`      | `Integer.parseInt("1000")`           |
| long           | Long           | `parseLong(String)`     | `Long.parseLong("100000")`           |
| float          | Float          | `parseFloat(String)`    | `Float.parseFloat("12.5")`           |
| double         | Double         | `parseDouble(String)`   | `Double.parseDouble("123.456")`      |
| boolean        | Boolean        | `parseBoolean(String)`  | `Boolean.parseBoolean("true")`       |
| char           | Character      | `charAt(0)` ou casting  | `"A".charAt(0)` ou `(char)"A"`       |

### valueOf() vs parse*()

**parse*()**: Retorna tipo **primitivo**
```java
int i = Integer.parseInt("123");
```

**valueOf()**: Retorna tipo **Wrapper** (objeto)
```java
Integer i = Integer.valueOf("123");
```

---

## 🧠 Fundamentos Teóricos

### 1. Conversão para Tipos Inteiros

#### 1.1. Integer.parseInt()

**Sintaxe**:
```java
int valor = Integer.parseInt(String str);
int valor = Integer.parseInt(String str, int radix);
```

**Exemplos**:
```java
// Decimal (base 10)
int i1 = Integer.parseInt("123");      // 123
int i2 = Integer.parseInt("-456");     // -456
int i3 = Integer.parseInt("+789");     // 789

// Outras bases
int binario = Integer.parseInt("1010", 2);      // 10 (base 2)
int octal = Integer.parseInt("77", 8);          // 63 (base 8)
int hexa = Integer.parseInt("FF", 16);          // 255 (base 16)

// ⚠️ Espaços causam exceção
int i4 = Integer.parseInt(" 123 ");  // ❌ NumberFormatException
int i5 = Integer.parseInt("123 ");   // ❌ NumberFormatException

// ⚠️ Formato inválido
int i6 = Integer.parseInt("abc");    // ❌ NumberFormatException
int i7 = Integer.parseInt("12.5");   // ❌ NumberFormatException (não é inteiro)
```

#### 1.2. Long.parseLong()

```java
long l1 = Long.parseLong("123456789");          // 123456789
long l2 = Long.parseLong("9223372036854775807"); // Long.MAX_VALUE
long l3 = Long.parseLong("FF", 16);             // 255
```

#### 1.3. Short.parseShort() e Byte.parseByte()

```java
short s1 = Short.parseShort("100");   // 100
short s2 = Short.parseShort("32767"); // Short.MAX_VALUE

byte b1 = Byte.parseByte("10");       // 10
byte b2 = Byte.parseByte("127");      // Byte.MAX_VALUE

// ⚠️ Overflow causa exceção
short s3 = Short.parseShort("40000");  // ❌ NumberFormatException
byte b3 = Byte.parseByte("200");       // ❌ NumberFormatException
```

### 2. Conversão para Tipos de Ponto Flutuante

#### 2.1. Double.parseDouble()

```java
double d1 = Double.parseDouble("123.456");       // 123.456
double d2 = Double.parseDouble("-987.654");      // -987.654
double d3 = Double.parseDouble("1.23E10");       // 1.23 × 10^10
double d4 = Double.parseDouble("Infinity");      // Double.POSITIVE_INFINITY
double d5 = Double.parseDouble("-Infinity");     // Double.NEGATIVE_INFINITY
double d6 = Double.parseDouble("NaN");           // Double.NaN

// ⚠️ Formato inválido
double d7 = Double.parseDouble("abc");  // ❌ NumberFormatException
```

#### 2.2. Float.parseFloat()

```java
float f1 = Float.parseFloat("12.5");       // 12.5
float f2 = Float.parseFloat("-9.87");      // -9.87
float f3 = Float.parseFloat("1.5E5");      // 1.5 × 10^5 = 150000.0
float f4 = Float.parseFloat("Infinity");   // Float.POSITIVE_INFINITY
```

### 3. Conversão para boolean

#### 3.1. Boolean.parseBoolean()

**Regra**: Retorna `true` se string é "true" (case-insensitive), `false` caso contrário.

```java
boolean b1 = Boolean.parseBoolean("true");   // true
boolean b2 = Boolean.parseBoolean("TRUE");   // true
boolean b3 = Boolean.parseBoolean("True");   // true
boolean b4 = Boolean.parseBoolean("false");  // false
boolean b5 = Boolean.parseBoolean("FALSE");  // false

// ⚠️ Qualquer outra string é false (não lança exceção!)
boolean b6 = Boolean.parseBoolean("yes");    // false
boolean b7 = Boolean.parseBoolean("1");      // false
boolean b8 = Boolean.parseBoolean("");       // false
boolean b9 = Boolean.parseBoolean("abc");    // false
```

**Importante**: `parseBoolean()` **nunca lança exceção**. Valores != "true" retornam `false`.

### 4. Conversão para char

**Conceito**: String → char não tem método parse*() direto. Usa-se `charAt()` ou casting.

```java
// charAt(0) - obtém primeiro caractere
String str = "A";
char c1 = str.charAt(0);  // 'A'

// ⚠️ String vazia causa exceção
String vazia = "";
char c2 = vazia.charAt(0);  // ❌ StringIndexOutOfBoundsException

// Validação
if (!str.isEmpty()) {
    char c3 = str.charAt(0);
}
```

**Conversão de código Unicode**:
```java
String codigo = "65";
int unicodeValue = Integer.parseInt(codigo);
char c = (char) unicodeValue;  // 'A'
```

---

## 🔍 Análise Conceitual Profunda

### valueOf() vs parse*()

**parse*()**: Retorna **primitivo**
```java
int i = Integer.parseInt("123");      // primitivo int
double d = Double.parseDouble("12.5"); // primitivo double
```

**valueOf()**: Retorna **Wrapper** (objeto)
```java
Integer i = Integer.valueOf("123");      // objeto Integer
Double d = Double.valueOf("12.5");       // objeto Double

// Autoboxing permite usar como primitivo
int primitivo = Integer.valueOf("123");  // Unboxing automático
```

**Diferenças**:
1. **Tipo de retorno**: Primitivo vs Objeto
2. **Autoboxing**: valueOf() cria objeto, pode usar cache
3. **Performance**: parse*() é ligeiramente mais rápido (não cria objeto)

**Cache de Integer.valueOf()**:
```java
// valueOf() cacheia valores -128 a 127
Integer i1 = Integer.valueOf("100");
Integer i2 = Integer.valueOf("100");
System.out.println(i1 == i2);  // true (mesmo objeto)

Integer i3 = Integer.valueOf("200");
Integer i4 = Integer.valueOf("200");
System.out.println(i3 == i4);  // false (objetos diferentes)
```

### Tratamento de Exceções

**NumberFormatException**: Lançada quando formato é inválido.

**Exemplo de Tratamento**:
```java
public int parseIntSafe(String str) {
    try {
        return Integer.parseInt(str);
    } catch (NumberFormatException e) {
        System.err.println("Formato inválido: " + str);
        return 0;  // Valor padrão
    }
}
```

**Validação Prévia**:
```java
public boolean isInteger(String str) {
    try {
        Integer.parseInt(str);
        return true;
    } catch (NumberFormatException e) {
        return false;
    }
}
```

**Regex para Validação**:
```java
public boolean isValidInteger(String str) {
    return str.matches("-?\\d+");  // Opcional - seguido de dígitos
}

public boolean isValidDouble(String str) {
    return str.matches("-?\\d+(\\.\\d+)?([eE][+-]?\\d+)?");
}
```

---

## 🎯 Aplicabilidade e Contextos

### Caso 1: Processamento de Entrada do Usuário

```java
import java.util.Scanner;

public class EntradaUsuario {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Digite sua idade: ");
        String entrada = scanner.nextLine();
        
        try {
            int idade = Integer.parseInt(entrada);
            System.out.println("Você tem " + idade + " anos.");
        } catch (NumberFormatException e) {
            System.err.println("Idade inválida!");
        }
        
        scanner.close();
    }
}
```

### Caso 2: Parsing de Parâmetros de Linha de Comando

```java
public class ParametrosLinha {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.err.println("Uso: programa <numero1> <numero2>");
            return;
        }
        
        try {
            int num1 = Integer.parseInt(args[0]);
            int num2 = Integer.parseInt(args[1]);
            int soma = num1 + num2;
            System.out.println("Soma: " + soma);
        } catch (NumberFormatException e) {
            System.err.println("Parâmetros devem ser números inteiros!");
        }
    }
}
```

### Caso 3: Leitura de Arquivo de Configuração

```java
import java.io.*;
import java.util.*;

public class ConfigReader {
    private Properties config = new Properties();
    
    public void loadConfig(String fileName) throws IOException {
        try (FileInputStream fis = new FileInputStream(fileName)) {
            config.load(fis);
        }
    }
    
    public int getIntProperty(String key, int defaultValue) {
        String value = config.getProperty(key);
        if (value == null) return defaultValue;
        
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    public double getDoubleProperty(String key, double defaultValue) {
        String value = config.getProperty(key);
        if (value == null) return defaultValue;
        
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    public boolean getBooleanProperty(String key, boolean defaultValue) {
        String value = config.getProperty(key);
        if (value == null) return defaultValue;
        
        return Boolean.parseBoolean(value);
    }
}
```

### Caso 4: Validação Robusta com Mensagens Personalizadas

```java
public class ParserRobusto {
    public static int parseIntOrDefault(String str, int defaultValue) {
        if (str == null || str.trim().isEmpty()) {
            return defaultValue;
        }
        
        try {
            return Integer.parseInt(str.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
    
    public static Integer parseIntOrNull(String str) {
        if (str == null || str.trim().isEmpty()) {
            return null;
        }
        
        try {
            return Integer.parseInt(str.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    public static int parseIntStrict(String str) throws IllegalArgumentException {
        if (str == null || str.trim().isEmpty()) {
            throw new IllegalArgumentException("String vazia ou nula");
        }
        
        try {
            return Integer.parseInt(str.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                "Formato inválido: '" + str + "' não é um inteiro válido", e
            );
        }
    }
}
```

### Caso 5: Conversão com Diferentes Bases

```java
public class ConversaoBases {
    public static void main(String[] args) {
        String binario = "1010";
        String octal = "77";
        String hexadecimal = "FF";
        
        int valorBinario = Integer.parseInt(binario, 2);      // 10
        int valorOctal = Integer.parseInt(octal, 8);          // 63
        int valorHexadecimal = Integer.parseInt(hexadecimal, 16); // 255
        
        System.out.println("Binário 1010 = " + valorBinario);
        System.out.println("Octal 77 = " + valorOctal);
        System.out.println("Hexadecimal FF = " + valorHexadecimal);
    }
}
```

### Caso 6: Conversão com Localização

```java
import java.text.*;
import java.util.*;

public class ConversaoLocalizada {
    public static void main(String[] args) throws ParseException {
        // Formato brasileiro: 1.234,56
        String valorBr = "1.234,56";
        
        // Locale brasileiro
        Locale localeBr = new Locale("pt", "BR");
        NumberFormat formatBr = NumberFormat.getInstance(localeBr);
        Number number = formatBr.parse(valorBr);
        double valor = number.doubleValue();  // 1234.56
        
        System.out.println("Valor BR: " + valorBr + " → " + valor);
        
        // Formato americano: 1,234.56
        String valorUs = "1,234.56";
        Locale localeUs = Locale.US;
        NumberFormat formatUs = NumberFormat.getInstance(localeUs);
        Number numberUs = formatUs.parse(valorUs);
        double valorUs2 = numberUs.doubleValue();  // 1234.56
        
        System.out.println("Valor US: " + valorUs + " → " + valorUs2);
    }
}
```

---

## ⚠️ Limitações e Considerações

### 1. NumberFormatException em Valores Inválidos

**Problema**: Parse de string inválida lança exceção.

```java
int i = Integer.parseInt("abc");  // ❌ NumberFormatException
```

**Solução**: Sempre tratar exceção ou validar antes.

```java
try {
    int i = Integer.parseInt(str);
} catch (NumberFormatException e) {
    // Tratar erro
}
```

### 2. Espaços Não São Tolerados

**Problema**: Espaços em branco causam exceção.

```java
int i = Integer.parseInt(" 123 ");  // ❌ NumberFormatException
```

**Solução**: Usar `trim()` antes do parse.

```java
int i = Integer.parseInt(str.trim());  // ✅ OK
```

### 3. parseBoolean() Não Lança Exceção

**Problema**: Valores != "true" retornam `false` silenciosamente.

```java
boolean b = Boolean.parseBoolean("yes");  // false (não exceção!)
```

**Solução**: Validar string antes de parsear.

```java
if ("true".equalsIgnoreCase(str) || "false".equalsIgnoreCase(str)) {
    boolean b = Boolean.parseBoolean(str);
} else {
    throw new IllegalArgumentException("Esperado 'true' ou 'false'");
}
```

### 4. Overflow em Tipos Menores

**Problema**: Valor fora do range lança exceção.

```java
byte b = Byte.parseByte("200");  // ❌ NumberFormatException (max: 127)
```

**Solução**: Validar range ou usar tipo maior.

```java
int temp = Integer.parseInt("200");
if (temp >= Byte.MIN_VALUE && temp <= Byte.MAX_VALUE) {
    byte b = (byte) temp;
} else {
    throw new IllegalArgumentException("Valor fora do range de byte");
}
```

### 5. null Causa NullPointerException

**Problema**: Parse de `null` lança NPE.

```java
String str = null;
int i = Integer.parseInt(str);  // ❌ NullPointerException
```

**Solução**: Validar null antes.

```java
if (str != null && !str.isEmpty()) {
    int i = Integer.parseInt(str);
}
```

---

## 🔗 Interconexões Conceituais

**Relacionado com**:
- **Wrapper Classes**: Classes para parsing (Integer, Double, etc.)
- **Exceções**: NumberFormatException, NullPointerException
- **Autoboxing/Unboxing**: valueOf() retorna Wrapper
- **Tipos Primitivos**: Destino das conversões
- **Entrada/Saída**: Contexto de uso (Scanner, arquivos)

---

## 🚀 Boas Práticas

1. ✅ **Sempre tratar NumberFormatException**
   ```java
   try {
       int i = Integer.parseInt(str);
   } catch (NumberFormatException e) {
       // Tratar ou logar erro
   }
   ```

2. ✅ **Use trim() antes de parsear**
   ```java
   int i = Integer.parseInt(str.trim());
   ```

3. ✅ **Valide null e string vazia**
   ```java
   if (str != null && !str.trim().isEmpty()) {
       int i = Integer.parseInt(str.trim());
   }
   ```

4. ✅ **Prefira parse*() para primitivos, valueOf() para Wrappers**
   ```java
   int i = Integer.parseInt("123");      // Primitivo
   Integer obj = Integer.valueOf("123");  // Wrapper
   ```

5. ✅ **Use valores padrão em casos de erro**
   ```java
   int valor = parseIntOrDefault(str, 0);
   ```

6. ✅ **Documente formato esperado**
   ```java
   /**
    * @param str String no formato "###.##" (ex: "123.45")
    */
   public double parsePrice(String str) { ... }
   ```

7. ✅ **Valide range para tipos menores**
   ```java
   int temp = Integer.parseInt(str);
   if (temp >= Byte.MIN_VALUE && temp <= Byte.MAX_VALUE) {
       byte b = (byte) temp;
   }
   ```

8. ❌ **Evite parseBoolean() para valores críticos**
   ```java
   // ❌ "yes" vira false silenciosamente
   boolean b = Boolean.parseBoolean(input);
   
   // ✅ Valide explicitamente
   if ("true".equalsIgnoreCase(input)) {
       b = true;
   } else if ("false".equalsIgnoreCase(input)) {
       b = false;
   } else {
       throw new IllegalArgumentException("Esperado true/false");
   }
   ```
