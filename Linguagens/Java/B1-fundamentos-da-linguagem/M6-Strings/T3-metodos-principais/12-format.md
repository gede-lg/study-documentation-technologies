# String.format() - Formatação de Strings

## 🎯 Introdução e Definição

**String.format()** é um **método estático** que cria Strings formatadas usando **especificadores estilo printf**. Retorna uma **nova String** com os argumentos formatados segundo o template.

**Conceito central**: Permite **formatar números**, **alinhar texto**, **controlar precisão decimal**, **exibir datas** e **construir saídas estruturadas** com sintaxe poderosa herdada da linguagem C (printf).

**Exemplo fundamental**:
```java
// Formatação básica
String nome = "João";
int idade = 30;

String mensagem = String.format("Nome: %s, Idade: %d", nome, idade);
System.out.println(mensagem);
// "Nome: João, Idade: 30"

// Formatação de números
double preco = 19.99;
String formatado = String.format("Preço: R$ %.2f", preco);
System.out.println(formatado);
// "Preço: R$ 19.99"

// vs concatenação
String concat = "Nome: " + nome + ", Idade: " + idade;
// Menos legível e sem controle de formato
```

**Características principais**:
- **Método estático**: `String.format(formato, argumentos)`
- **Template com %**: especificadores como %s (string), %d (inteiro), %f (float)
- **Controle de formato**: largura, precisão, alinhamento, preenchimento
- **Locale support**: formatação específica de região com `format(Locale, formato, args)`

## 📋 Fundamentos Teóricos

### 1️⃣ Assinatura e Uso Básico

**Formata String com argumentos**:

```java
// Sem Locale (usa default)
String s1 = String.format("Olá, %s!", "Mundo");
// "Olá, Mundo!"

// Com Locale específico
String s2 = String.format(Locale.US, "Price: $%.2f", 19.99);
// "Price: $19.99"

// Múltiplos argumentos
String s3 = String.format("%s tem %d anos", "Maria", 25);
// "Maria tem 25 anos"
```

**Assinaturas**:
```java
public static String format(String format, Object... args)

public static String format(Locale locale, String format, Object... args)

// format: template com especificadores (%, %s, %d, etc.)
// args: argumentos a serem formatados (varargs)
// locale: formatação específica de região (opcional)
// Retorna: nova String formatada
```

**Especificadores comuns**:

| Especificador | Tipo | Exemplo | Resultado |
|---------------|------|---------|-----------|
| `%s` | String | `format("%s", "Hi")` | `"Hi"` |
| `%d` | Integer (decimal) | `format("%d", 42)` | `"42"` |
| `%f` | Float/Double | `format("%f", 3.14)` | `"3.140000"` |
| `%.2f` | Float com 2 decimais | `format("%.2f", 3.14)` | `"3.14"` |
| `%n` | Newline | `format("A%nB")` | `"A\nB"` |
| `%%` | Literal % | `format("100%%")` | `"100%"` |
| `%x` | Hexadecimal | `format("%x", 255)` | `"ff"` |
| `%o` | Octal | `format("%o", 8)` | `"10"` |

### 2️⃣ Especificadores de String (%s)

**Formata qualquer objeto como String**:

```java
// String
String s1 = String.format("%s", "Java");
// "Java"

// Integer (toString() implícito)
String s2 = String.format("%s", 42);
// "42"

// Boolean
String s3 = String.format("%s", true);
// "true"

// Null
String s4 = String.format("%s", null);
// "null"

// Objeto personalizado
class Pessoa {
    public String toString() { return "João"; }
}
String s5 = String.format("%s", new Pessoa());
// "João"
```

**Largura e alinhamento**:
```java
// Largura mínima (preenche com espaços à esquerda)
String s1 = String.format("[%10s]", "Hi");
// "[        Hi]" (10 chars, alinhado à direita)

// Alinhamento à esquerda (-)
String s2 = String.format("[%-10s]", "Hi");
// "[Hi        ]" (10 chars, alinhado à esquerda)

// Truncar (máximo de caracteres)
String s3 = String.format("%.5s", "JavaScript");
// "JavaS" (apenas 5 primeiros chars)

// Combinar largura e truncamento
String s4 = String.format("[%10.5s]", "Programming");
// "[     Progr]" (máx 5 chars, largura 10)
```

### 3️⃣ Especificadores Numéricos (%d, %f, %e)

**%d - Inteiros decimais**:

```java
// Inteiro simples
String s1 = String.format("%d", 42);
// "42"

// Com sinal (sempre exibir)
String s2 = String.format("%+d", 42);
// "+42"

// Largura mínima
String s3 = String.format("[%5d]", 42);
// "[   42]" (preenche com espaços)

// Preencher com zeros
String s4 = String.format("[%05d]", 42);
// "[00042]"

// Separador de milhares
String s5 = String.format("%,d", 1000000);
// "1,000,000" (Locale padrão)

// Parênteses para negativos (usado em contabilidade)
String s6 = String.format("%(d", -50);
// "(50)"
```

**%f - Números de ponto flutuante**:
```java
// Float/Double padrão (6 decimais)
String s1 = String.format("%f", 3.14159);
// "3.141590"

// Controlar decimais
String s2 = String.format("%.2f", 3.14159);
// "3.14" (2 decimais)

String s3 = String.format("%.0f", 3.7);
// "4" (arredonda, 0 decimais)

// Largura e decimais
String s4 = String.format("[%8.2f]", 3.14);
// "[    3.14]" (largura 8, 2 decimais)

// Separador de milhares
String s5 = String.format("%,.2f", 1234567.89);
// "1,234,567.89"
```

**%e - Notação científica**:
```java
String s1 = String.format("%e", 12345.6789);
// "1.234568e+04"

String s2 = String.format("%.2e", 12345.6789);
// "1.23e+04" (2 decimais)
```

### 4️⃣ Flags de Formatação

**Tabela de flags**:

| Flag | Descrição | Exemplo | Resultado |
|------|-----------|---------|-----------|
| `-` | Alinhar à esquerda | `"%-10s", "Hi"` | `"Hi        "` |
| `+` | Sempre exibir sinal | `"%+d", 42` | `"+42"` |
| ` ` (espaço) | Espaço antes de positivos | `"% d", 42` | `" 42"` |
| `0` | Preencher com zeros | `"%05d", 42` | `"00042"` |
| `,` | Separador de milhares | `"%,d", 1000` | `"1,000"` |
| `(` | Negativos em parênteses | `"%(d", -50` | `"(50)"` |
| `#` | Formato alternativo | `"%#x", 255` | `"0xff"` |

**Exemplos combinados**:
```java
// Combinar flags
String s1 = String.format("%+08d", 42);
// "+0000042" (sinal + zeros + largura 8)

String s2 = String.format("%-+10d", 42);
// "+42       " (sinal + esquerda + largura 10)

String s3 = String.format("%,015.2f", 12345.67);
// "00012,345.67" (milhares + zeros + largura 15 + 2 decimais)

// Tabela formatada
System.out.println(String.format("%-15s | %,10d | %8.2f", "Produto A", 1234, 19.99));
System.out.println(String.format("%-15s | %,10d | %8.2f", "Produto B", 567890, 149.50));
// Produto A       |      1,234 |    19.99
// Produto B       |    567,890 |   149.50
```

### 5️⃣ Índices de Argumentos

**Referenciar argumentos por posição**:

```java
// %1$ = primeiro argumento, %2$ = segundo, etc.
String s1 = String.format("%2$s %1$s", "World", "Hello");
// "Hello World" (ordem invertida)

String s2 = String.format("%1$s %1$s", "Echo");
// "Echo Echo" (repetir argumento)

// Usar em templates complexos
String template = "Nome: %2$s, ID: %1$d, Status: %3$s";
String s3 = String.format(template, 123, "João", "Ativo");
// "Nome: João, ID: 123, Status: Ativo"

// Útil para internacionalização (ordem varia por idioma)
String ptBR = String.format("%2$s tem %1$d anos", 30, "Maria");
String enUS = String.format("%2$s is %1$d years old", 30, "Mary");
```

### 6️⃣ Especificadores Especiais

**%n - Newline independente de plataforma**:

```java
// %n = newline do sistema (\n em Unix, \r\n em Windows)
String s = String.format("Linha 1%nLinha 2%nLinha 3");
System.out.println(s);
// Linha 1
// Linha 2
// Linha 3

// Preferível a \n (portável)
```

**%% - Literal %**:
```java
String s = String.format("Desconto de 25%%");
// "Desconto de 25%"

String s2 = String.format("100%% grátis");
// "100% grátis"
```

**%x, %X - Hexadecimal**:
```java
String s1 = String.format("%x", 255);
// "ff" (minúsculas)

String s2 = String.format("%X", 255);
// "FF" (MAIÚSCULAS)

String s3 = String.format("%#x", 255);
// "0xff" (com prefixo 0x)

String s4 = String.format("0x%04X", 255);
// "0x00FF" (custom com zeros)
```

**%o - Octal**:
```java
String s1 = String.format("%o", 8);
// "10"

String s2 = String.format("%#o", 8);
// "010" (com prefixo 0)
```

**%b - Boolean**:
```java
String s1 = String.format("%b", true);
// "true"

String s2 = String.format("%b", false);
// "false"

String s3 = String.format("%b", null);
// "false" (null = false)

String s4 = String.format("%b", "qualquer coisa");
// "true" (não-null = true)
```

### 7️⃣ Locale e Formatação Internacional

**Locale afeta separadores e formatos**:

```java
double valor = 1234567.89;

// Locale padrão do sistema
String s1 = String.format("%,.2f", valor);
// "1,234,567.89" (se Locale.US)

// Locale específico - US
String s2 = String.format(Locale.US, "%,.2f", valor);
// "1,234,567.89" (vírgula para milhares, ponto para decimais)

// Locale específico - Alemanha
String s3 = String.format(Locale.GERMANY, "%,.2f", valor);
// "1.234.567,89" (ponto para milhares, vírgula para decimais)

// Locale específico - França
String s4 = String.format(Locale.FRANCE, "%,.2f", valor);
// "1 234 567,89" (espaço para milhares, vírgula para decimais)
```

**Datas com Locale**:
```java
import java.util.Date;
import java.util.Locale;

Date hoje = new Date();

// Locale US
String s1 = String.format(Locale.US, "%tA, %<tB %<te, %<tY", hoje);
// "Monday, January 15, 2024"

// Locale PT_BR
String s2 = String.format(new Locale("pt", "BR"), "%tA, %<te de %<tB de %<tY", hoje);
// "segunda-feira, 15 de janeiro de 2024"

// Locale GERMANY
String s3 = String.format(Locale.GERMANY, "%tA, %<te. %<tB %<tY", hoje);
// "Montag, 15. Januar 2024"
```

### 8️⃣ Formatação de Data/Hora (%t)

**Especificadores de data**:

```java
import java.util.Date;

Date agora = new Date();

// Data completa
String s1 = String.format("%tF", agora);
// "2024-01-15" (YYYY-MM-DD)

// Hora completa
String s2 = String.format("%tT", agora);
// "14:30:45" (HH:MM:SS)

// Data e hora
String s3 = String.format("%tF %<tT", agora);
// "2024-01-15 14:30:45"

// Dia da semana
String s4 = String.format("%tA", agora);
// "Monday" (nome completo)

String s5 = String.format("%ta", agora);
// "Mon" (abreviado)

// Mês
String s6 = String.format("%tB", agora);
// "January" (nome completo)

String s7 = String.format("%tb", agora);
// "Jan" (abreviado)

// Ano
String s8 = String.format("%tY", agora);
// "2024" (4 dígitos)

String s9 = String.format("%ty", agora);
// "24" (2 dígitos)
```

**Tabela de especificadores %t**:

| Especificador | Descrição | Exemplo |
|---------------|-----------|---------|
| `%tY` | Ano (4 dígitos) | `2024` |
| `%ty` | Ano (2 dígitos) | `24` |
| `%tB` | Mês (nome completo) | `January` |
| `%tb` | Mês (abreviado) | `Jan` |
| `%tm` | Mês (número) | `01` |
| `%tA` | Dia da semana (completo) | `Monday` |
| `%ta` | Dia da semana (abreviado) | `Mon` |
| `%td` | Dia do mês | `15` |
| `%tH` | Hora (00-23) | `14` |
| `%tI` | Hora (01-12) | `02` |
| `%tM` | Minuto | `30` |
| `%tS` | Segundo | `45` |
| `%tF` | Data ISO | `2024-01-15` |
| `%tT` | Hora | `14:30:45` |

**%< para reutilizar argumento**:
```java
Date data = new Date();

// Sem %< (repetir argumento)
String s1 = String.format("%tY-%tm-%td", data, data, data);

// Com %< (reutilizar argumento anterior)
String s2 = String.format("%tY-%<tm-%<td", data);

// Ambos produzem: "2024-01-15"
```

### 9️⃣ Comparação com Alternativas

**format() vs concatenação**:

```java
String nome = "João";
int idade = 30;
double salario = 5000.50;

// Concatenação - verboso e sem controle de formato
String s1 = "Nome: " + nome + ", Idade: " + idade + ", Salário: R$ " + salario;
// "Nome: João, Idade: 30, Salário: R$ 5000.5" (sem formatação de salário)

// format() - conciso e formatado
String s2 = String.format("Nome: %s, Idade: %d, Salário: R$ %.2f", nome, idade, salario);
// "Nome: João, Idade: 30, Salário: R$ 5000.50"
```

**format() vs StringBuilder**:
```java
// StringBuilder - mais eficiente para loops
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("Item ").append(i).append("\n");
}
String resultado1 = sb.toString();

// format() - mais legível mas mais lento em loops
StringBuilder sb2 = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb2.append(String.format("Item %d%n", i));
}
String resultado2 = sb2.toString();

// StringBuilder direto é ~10x mais rápido em loops
// format() preferível para strings únicas ou poucas iterações
```

**format() vs printf()**:
```java
// format() - retorna String
String s = String.format("Valor: %d", 42);
System.out.println(s);

// printf() - imprime diretamente (atalho para format())
System.out.printf("Valor: %d%n", 42);

// printf() equivalente a:
System.out.print(String.format("Valor: %d%n", 42));
```

### 🔟 Performance e Complexidade

**Complexidade**:

```java
// String.format()
// Tempo: O(n) onde n = tamanho da String resultante
// Overhead de parsing do formato
// Mais lento que concatenação simples

String nome = "Test";
int numero = 42;

// format() - ~1000 nanossegundos
long inicio = System.nanoTime();
String s1 = String.format("%s: %d", nome, numero);
long tempo1 = System.nanoTime() - inicio;

// Concatenação - ~100 nanossegundos
inicio = System.nanoTime();
String s2 = nome + ": " + numero;
long tempo2 = System.nanoTime() - inicio;

// format() ~10x mais lento, mas oferece controle de formato
```

**Evitar em loops críticos**:
```java
// ❌ Ineficiente
List<String> resultado = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    resultado.add(String.format("Item %05d", i));  // format() 10k vezes
}

// ✓ Mais eficiente
List<String> resultado2 = new ArrayList<>();
for (int i = 0; i < 10000; i++) {
    resultado2.add(String.format("%05d", i));  // Apenas número
}

// Ou usar StringBuilder direto para máxima performance
```

## 🎯 Aplicabilidade

**1. Formatar Números com Precisão**:
```java
String.format("%.2f", 19.99);  // "19.99"
```

**2. Criar Tabelas Alinhadas**:
```java
String.format("%-20s | %10d | %8.2f", nome, quantidade, preco);
```

**3. Mensagens Interpoladas**:
```java
String.format("Olá, %s! Você tem %d mensagens.", usuario, count);
```

**4. Formatação de Datas**:
```java
String.format("%tF %<tT", data);  // "2024-01-15 14:30:45"
```

**5. Números Hexadecimais/Octais**:
```java
String.format("0x%04X", valor);
```

## ⚠️ Armadilhas Comuns

**1. Número Incorreto de Argumentos**:
```java
String.format("%s %d", "Test");  // ❌ MissingFormatArgumentException
String.format("%s", "A", "B");   // ⚠️ Argumento extra ignorado
```

**2. Tipo Incompatível**:
```java
String.format("%d", "texto");  // ❌ IllegalFormatConversionException
```

**3. Usar \n ao Invés de %n**:
```java
String.format("A\nB");  // ⚠️ \n pode não ser newline no Windows
String.format("A%nB");  // ✓ Newline portável
```

**4. Esquecer %< para Reutilizar Argumento**:
```java
Date d = new Date();
String.format("%tY-%tm-%td", d, d, d);  // ⚠️ Repetitivo
String.format("%tY-%<tm-%<td", d);      // ✓ Mais limpo
```

**5. Performance em Loops**:
```java
for (int i = 0; i < 100000; i++) {
    String.format("Item %d", i);  // ❌ Lento
}
```

## ✅ Boas Práticas

**1. Use %n para Newline**:
```java
String.format("Linha 1%nLinha 2");
```

**2. Especifique Locale para Números**:
```java
String.format(Locale.US, "%.2f", valor);
```

**3. Use %< para Reutilizar Argumentos**:
```java
String.format("%tF %<tT", data);
```

**4. Valide Formato e Argumentos**:
```java
try {
    String.format(template, args);
} catch (IllegalFormatException e) {
    // Tratar erro de formato
}
```

**5. Prefira printf() para Saída Direta**:
```java
System.out.printf("Valor: %d%n", x);  // Mais direto
```

## 📚 Resumo Executivo

**String.format()** formata Strings com **especificadores estilo printf**.

**Assinaturas**:
```java
String format(String format, Object... args)
String format(Locale locale, String format, Object... args)
```

**Especificadores principais**:
```java
%s   // String
%d   // Integer
%f   // Float/Double
%.2f // Float com 2 decimais
%n   // Newline
%%   // Literal %
```

**Exemplos**:
```java
String.format("%s: %d", "Total", 42);        // "Total: 42"
String.format("%.2f", 3.14159);              // "3.14"
String.format("%,d", 1000000);               // "1,000,000"
String.format("%-10s", "Hi");                // "Hi        "
String.format("%05d", 42);                   // "00042"
String.format("%+d", 42);                    // "+42"
```

**Flags**:
```java
-    // Alinhar esquerda
+    // Mostrar sinal
0    // Preencher com zeros
,    // Separador de milhares
```

**Locale**:
```java
String.format(Locale.US, "%,.2f", 1234.56);      // "1,234.56"
String.format(Locale.GERMANY, "%,.2f", 1234.56); // "1.234,56"
```

**Data/Hora**:
```java
Date d = new Date();
String.format("%tF", d);         // "2024-01-15"
String.format("%tT", d);         // "14:30:45"
String.format("%tY-%<tm-%<td", d); // "2024-01-15"
```

**Performance**: ~10x mais lento que concatenação, mas oferece controle preciso de formato

**Recomendação**: Use format() para saídas formatadas, concatenação para strings simples, StringBuilder para loops