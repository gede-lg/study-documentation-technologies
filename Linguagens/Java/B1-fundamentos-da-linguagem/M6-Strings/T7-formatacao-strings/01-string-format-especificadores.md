# String.format() e Especificadores de Formato

## 🎯 Introdução e Definição

### Definição Conceitual Clara

O **método `String.format()`** é uma ferramenta poderosa para construção de Strings formatadas através de templates com especificadores (placeholders), permitindo controle preciso sobre como valores são convertidos para texto - largura, alinhamento, precisão, preenchimento, estilo numérico. Conceitualmente, é a ponte entre dados brutos (int, double, Date) e representação textual formatada para humanos, seguindo sintaxe printf do C - onde `%d` é "inteiro decimal", `%s` é "string", `%.2f` é "float com 2 decimais", transformando `format("Total: %.2f", 10.5)` em `"Total: 10.50"`.

É o reconhecimento de que conversão simples (`toString()`) não basta - números precisam casas decimais fixas, dinheiro precisa vírgulas separadoras, datas precisam formato específico (DD/MM/YYYY), e espaços/alinhamento são críticos para tabelas e relatórios legíveis.

### Contexto Histórico e Motivação

`String.format()` foi introduzido no Java 5 (2004) inspirado na função `printf()` do C (1970s), que revolucionou formatação ao separar template (estrutura) de dados (conteúdo). Antes do Java 5, formatação exigia código verboso: `new DecimalFormat("0.00").format(valor)`, `SimpleDateFormat`, concatenação manual. `format()` unificou formatação em API única, consistente e poderosa.

**Motivação:** Relatórios, logs, interfaces de usuário precisam output formatado - valores monetários (`R$ 1.234,56`), tabelas alinhadas, timestamps padronizados. `format()` é declarativo ("quero 2 decimais") ao invés de imperativo ("arredonde, converta, adicione zeros").

### Problema Fundamental que Resolve

**Problema:** Formatação manual é verbosa e propensa a erros:

```java
double preco = 1234.5;

// Formatação manual - complexo!
String precoTexto = "R$ " + (int)(preco * 100) / 100.0;  // BUG - perde casas decimais!
// Saída: "R$ 1234.5" - falta zero final!

// Ou com DecimalFormat - verboso
DecimalFormat df = new DecimalFormat("#,##0.00");
String precoTexto2 = "R$ " + df.format(preco);  // Funciona, mas verboso
```

**Solução:** `String.format()` é conciso e declarativo:

```java
String precoTexto = String.format("R$ %,.2f", preco);
// Saída: "R$ 1.234,50" - perfeito!
```

**Outro exemplo - tabela alinhada:**

```java
// Manual - difícil alinhar
System.out.println("Nome: " + nome + " | Idade: " + idade);  // Desalinhado

// format() - alinhamento perfeito
System.out.format("%-20s | %3d%n", nome, idade);
// %-20s = string alinhada à esquerda com 20 caracteres
// %3d = inteiro com 3 dígitos (padding à esquerda)
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Template com Placeholders:** String template contém especificadores (`%d`, `%s`, `%f`) que são substituídos por valores.

2. **Sintaxe Printf:** Baseada em C printf - `%[flags][width][.precision]conversion`.

3. **Type-Safe em Compile-Time:** Erros de tipo são detectados em runtime (não compile-time).

4. **Imutabilidade:** Retorna nova String formatada - não modifica argumentos.

5. **Locale-Aware:** Usa `Locale.getDefault()` ou aceita Locale explícito para separadores decimais, agrupamento de milhares.

### Pilares Fundamentais

- **Sintaxe:** `String.format(String format, Object... args)` - retorna String formatada
- **Especificadores Básicos:** `%s` (String), `%d` (int), `%f` (float), `%c` (char), `%b` (boolean)
- **Flags:** `-` (esquerda), `+` (sinal), `0` (zero-padding), `,` (separador de milhares), ` ` (espaço)
- **Width:** Largura mínima do campo
- **Precision:** Casas decimais para floats, máximo chars para strings
- **Uso:** Relatórios, logs, formatação de output, internacionalização

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Processo de Formatação

```java
String resultado = String.format("Nome: %s, Idade: %d", "Alice", 30);
```

**Passos:**
1. **Parse do Template:** Identifica especificadores `%s` e `%d`
2. **Match com Argumentos:** `%s` → "Alice", `%d` → 30
3. **Conversão:** "Alice" permanece String, 30 convertido para "30"
4. **Substituição:** Especificadores substituídos por valores formatados
5. **Retorno:** `"Nome: Alice, Idade: 30"`

#### Implementação Conceitual

```java
public static String format(String format, Object... args) {
    return new Formatter().format(format, args).toString();
}
```

**Análise:** Internamente usa classe `Formatter` que faz parsing do template e conversão de cada argumento segundo especificador correspondente.

### Anatomia de um Especificador

**Sintaxe completa:**
```
%[argument_index$][flags][width][.precision]conversion
```

**Componentes:**
- **`%`**: Início do especificador (literal)
- **`argument_index$`** (opcional): Posição do argumento (1-based) - `%2$s` usa segundo argumento
- **`flags`** (opcional): Modificadores (`-`, `+`, `0`, `,`, ` `, `#`, `(`)
- **`width`** (opcional): Largura mínima do campo
- **`.precision`** (opcional): Casas decimais (floats) ou max chars (strings)
- **`conversion`** (obrigatório): Tipo de conversão (`s`, `d`, `f`, `c`, `b`, etc)

**Exemplos:**
```java
"%s"        // String simples
"%10s"      // String com largura mínima 10 (padding à direita se menor)
"%-10s"     // String largura 10, alinhada à esquerda
"%d"        // Inteiro decimal
"%5d"       // Inteiro com largura 5
"%05d"      // Inteiro largura 5, zero-padding à esquerda
"%,d"       // Inteiro com separador de milhares
"%.2f"      // Float com 2 casas decimais
"%10.2f"    // Float largura 10, 2 decimais
"%+.2f"     // Float 2 decimais, sempre com sinal (+/-)
```

### Princípios e Conceitos Subjacentes

#### Princípio da Separação Template/Dados

```java
// Template define ESTRUTURA
String template = "Produto: %s | Preço: R$ %.2f | Estoque: %d";

// Dados fornecem CONTEÚDO
String resultado = String.format(template, "Mouse", 49.90, 150);
// "Produto: Mouse | Preço: R$ 49.90 | Estoque: 150"
```

**Vantagem:** Template pode ser externalizado (arquivo, banco), traduzido, reutilizado com dados diferentes.

#### Princípio da Declaratividade

**Imperativo (manual):**
```java
// Dizer COMO formatar
double valor = 1234.567;
String textoDecimal = Double.toString(Math.round(valor * 100) / 100.0);
String[] partes = textoDecimal.split("\\.");
String parteInteira = partes[0];
String resultado = parteInteira.replaceAll("(\\d)(?=(\\d{3})+$)", "$1,") + "." + partes[1];
// Complexo, bug-prone!
```

**Declarativo (format):**
```java
// Dizer O QUÊ quero
String resultado = String.format("%,.2f", 1234.567);  // "1,234.57"
// Simples, claro!
```

#### Princípio da Type Safety Limitada

```java
// Compile-time: OK (varargs aceita qualquer Object)
String.format("%d", "texto");  // Compila!

// Runtime: BOOM!
// Exception in thread "main" java.util.IllegalFormatConversionException: d != java.lang.String
```

**Análise:** Format strings são analisadas em **runtime**, não compile-time - erros de tipo não são detectados pelo compilador. Frameworks como Error Prone adicionam verificações compile-time.

---

## 🔍 Análise Conceitual Profunda

### Especificadores de Conversão Detalhados

#### %s - String

Converte argumento para String via `toString()` (ou "null" se null).

```java
String.format("%s", "Java")         // "Java"
String.format("%s", 123)            // "123" (Integer.toString())
String.format("%s", null)           // "null"
String.format("%10s", "Java")       // "      Java" (padding à direita)
String.format("%-10s", "Java")      // "Java      " (padding à esquerda)
String.format("%.3s", "JavaWorld")  // "Jav" (máximo 3 chars)
```

**Uso:** Texto genérico, objetos (usa toString()).

#### %d - Inteiro Decimal

Inteiros em base 10.

```java
String.format("%d", 123)            // "123"
String.format("%d", -456)           // "-456"
String.format("%5d", 42)            // "   42" (largura 5)
String.format("%05d", 42)           // "00042" (zero-padding)
String.format("%,d", 1000000)       // "1,000,000" (separador milhares)
String.format("%+d", 42)            // "+42" (sinal sempre)
String.format("% d", 42)            // " 42" (espaço se positivo)
```

**Tipos aceitos:** `byte`, `short`, `int`, `long`, `BigInteger`.

#### %f - Ponto Flutuante Decimal

Floats e doubles em notação decimal.

```java
String.format("%f", 123.456)        // "123.456000" (6 decimais padrão)
String.format("%.2f", 123.456)      // "123.46" (2 decimais, arredondado)
String.format("%.0f", 123.456)      // "123" (sem decimais)
String.format("%10.2f", 12.5)       // "     12.50" (largura 10, 2 decimais)
String.format("%,.2f", 1234.56)     // "1,234.56" (separador milhares)
String.format("%+.2f", 12.5)        // "+12.50" (sinal sempre)
```

**Tipos aceitos:** `float`, `double`, `BigDecimal`.

#### %e - Notação Científica

```java
String.format("%e", 1234.56)        // "1.234560e+03"
String.format("%.2e", 1234.56)      // "1.23e+03" (2 decimais na mantissa)
```

#### %g - Notação Geral

Escolhe automaticamente entre `%f` e `%e` baseado em magnitude.

```java
String.format("%g", 123.456)        // "123.456"
String.format("%g", 0.0001234)      // "1.23400e-04" (científica para pequenos)
```

#### %c - Caractere

```java
String.format("%c", 'J')            // "J"
String.format("%c", 74)             // "J" (código Unicode 74)
```

#### %b - Boolean

```java
String.format("%b", true)           // "true"
String.format("%b", false)          // "false"
String.format("%b", null)           // "false"
String.format("%b", "qualquer")     // "true" (não-null = true)
```

**Regra:** `null` → false, caso contrário → true.

#### %x, %o - Hexadecimal e Octal

```java
String.format("%x", 255)            // "ff" (hex minúsculo)
String.format("%X", 255)            // "FF" (hex maiúsculo)
String.format("%#x", 255)           // "0xff" (prefixo 0x)
String.format("%o", 8)              // "10" (octal)
String.format("%#o", 8)             // "010" (prefixo 0)
```

#### %n - Separador de Linha

```java
String.format("Linha 1%nLinha 2")   // "Linha 1\nLinha 2" (Unix)
                                     // "Linha 1\r\nLinha 2" (Windows)
```

**Análise:** `%n` é platform-specific - gera `\n` em Unix, `\r\n` em Windows. **SEMPRE use `%n` ao invés de `\n` hardcoded!**

### Flags Detalhadas

#### `-` - Alinhamento à Esquerda

```java
String.format("|%10s|", "Java")     // "|      Java|" (direita, padrão)
String.format("|%-10s|", "Java")    // "|Java      |" (esquerda)
```

#### `+` - Sinal Sempre

```java
String.format("%d", 42)             // "42"
String.format("%+d", 42)            // "+42"
String.format("%+d", -42)           // "-42"
```

#### `0` - Zero Padding

```java
String.format("%5d", 42)            // "   42" (espaços)
String.format("%05d", 42)           // "00042" (zeros)
String.format("%08.2f", 12.5)       // "00012.50"
```

#### `,` - Separador de Milhares

```java
String.format("%,d", 1000000)       // "1,000,000" (locale EN-US)
String.format("%,.2f", 1234567.89)  // "1,234,567.89"
```

**Locale-Aware:**
```java
String.format(Locale.GERMAN, "%,.2f", 1234.56)  // "1.234,56" (ponto/vírgula invertidos)
```

#### ` ` (Espaço) - Espaço para Positivos

```java
String.format("% d", 42)            // " 42" (espaço antes)
String.format("% d", -42)           // "-42" (sinal menos)
```

**Uso:** Alinhar colunas de números positivos e negativos.

#### `#` - Formato Alternativo

```java
String.format("%#x", 255)           // "0xff" (prefixo hex)
String.format("%#o", 8)             // "010" (prefixo octal)
String.format("%#.2f", 10.0)        // "10.00" (sempre mostra ponto decimal)
```

#### `(` - Parênteses para Negativos

```java
String.format("%(d", -42)           // "(42)" (contabilidade)
String.format("%(d", 42)            // "42"
String.format("%(.2f", -10.5)       // "(10.50)"
```

### Índice de Argumento

**Referência posicional:**

```java
// Ordem padrão
String.format("%s tem %d anos", "Alice", 30);  // "Alice tem 30 anos"

// Índice explícito (1-based)
String.format("%2$s tem %1$d anos", 30, "Alice");  // "Alice tem 30 anos"

// Reutilizar argumento
String.format("%1$s gosta de %1$s", "Java");  // "Java gosta de Java"

// Útil para internacionalização
String ptBR = String.format("%1$s custa R$ %2$.2f", produto, preco);
String enUS = String.format("%1$s costs $ %2$.2f", produto, preco);
```

### Casos Especiais

#### Formatação de Null

```java
String.format("%s", null)           // "null"
String.format("%d", null)           // NullPointerException!
String.format("%10s", null)         // "      null"
```

**Análise:** `%s` aceita null e converte para "null". Especificadores numéricos (`%d`, `%f`) lançam NPE com null.

#### Width vs Precision

```java
// Width (largura total do campo)
String.format("%10s", "Java")       // "      Java" (10 chars total)
String.format("%10d", 42)           // "        42"

// Precision para floats (casas decimais)
String.format("%.2f", 123.456)      // "123.46"

// Precision para strings (máximo de chars)
String.format("%.5s", "JavaWorld")  // "JavaW" (trunca em 5)

// Width + Precision combinados
String.format("%10.2f", 12.5)       // "     12.50" (10 total, 2 decimais)
String.format("%10.5s", "JavaWorld") // "     JavaW" (10 total, max 5 chars)
```

#### Escape de %

```java
String.format("Desconto de 10%%")   // "Desconto de 10%"
// %% = % literal
```

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar String.format()

✅ **Use quando:**

1. **Formatação Numérica Precisa:** Casas decimais fixas, separadores de milhares
   ```java
   String.format("Preço: R$ %,.2f", 1234.56)  // "Preço: R$ 1,234.56"
   ```

2. **Alinhamento em Tabelas/Relatórios:**
   ```java
   System.out.format("%-20s | %10.2f%n", produto, preco);
   ```

3. **Templates Reutilizáveis:**
   ```java
   String template = "Pedido #%d: %s - R$ %.2f";
   String msg1 = String.format(template, 1, "Mouse", 49.90);
   String msg2 = String.format(template, 2, "Teclado", 129.90);
   ```

4. **Logs Estruturados:**
   ```java
   logger.info(String.format("[%s] User %d logged in at %tF %<tT", level, userId, timestamp));
   ```

5. **Internacionalização:**
   ```java
   String msg = String.format(Locale.FRANCE, "Prix: %.2f €", 19.99);  // "Prix: 19,99 €"
   ```

### Quando Usar Alternativas

❌ **Use alternativas quando:**

1. **Concatenação Simples:** Use `+` ou `concat()`
   ```java
   // Overkill
   String.format("%s%s", "Hello", "World")

   // Melhor
   "Hello" + "World"
   ```

2. **Performance Crítica em Loop:** Use `StringBuilder`
   ```java
   // Lento
   for (int i = 0; i < 10000; i++) {
       result += String.format("%d,", i);
   }

   // Rápido
   StringBuilder sb = new StringBuilder();
   for (int i = 0; i < 10000; i++) {
       sb.append(i).append(",");
   }
   ```

3. **Formatação Complexa de Datas:** Use `DateTimeFormatter` (Java 8+)
   ```java
   // format() para datas é verboso
   String.format("%tF %<tT", timestamp)

   // DateTimeFormatter é mais claro
   LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
   ```

---

## ⚠️ Limitações e Considerações

### Limitações

#### Type Safety em Runtime

```java
// Compila mas falha em runtime
String.format("%d", "texto");  // IllegalFormatConversionException
```

**Solução:** Usar ferramentas de análise estática (Error Prone, IntelliJ inspections).

#### Performance

```java
// Mais lento que concatenação simples
String.format("%s %s", "Hello", "World")  // ~500ns
"Hello" + " " + "World"                    // ~50ns (10x mais rápido)
```

**Análise:** `format()` tem overhead de parsing do template, reflexão, boxing de primitivos. Use quando formatação vale o custo.

#### Locale Implícito

```java
// Usa Locale.getDefault() - pode variar por ambiente!
String.format("%,.2f", 1234.56)
// US: "1,234.56"
// BR: "1.234,56"
// Imprevisível se locale muda!

// Solução: Locale explícito
String.format(Locale.US, "%,.2f", 1234.56)  // Sempre "1,234.56"
```

### Armadilhas Comuns

#### Armadilha 1: Índice Off-by-One

```java
// Índices são 1-based, não 0-based!
String.format("%0$s", "Java")  // IllegalFormatException - índice inválido
String.format("%1$s", "Java")  // "Java" - correto (1 = primeiro argumento)
```

#### Armadilha 2: Misturar Indexed e Non-Indexed

```java
// ERRO - mistura estilos
String.format("%s %2$s", "A", "B", "C")  // IllegalFormatException

// CORRETO - escolha um estilo
String.format("%s %s", "A", "B")          // Não-indexado
String.format("%1$s %2$s", "A", "B")      // Indexado
```

#### Armadilha 3: Precision com Inteiros

```java
String.format("%.2d", 42)  // IllegalFormatPrecisionException
// Precision não se aplica a inteiros!

// Use width ao invés
String.format("%5d", 42)   // "   42"
```

---

## 🔗 Interconexões Conceituais

### Relação com System.out.printf()

```java
// Equivalentes
String resultado = String.format("Nome: %s", nome);
System.out.println(resultado);

// Mais conciso
System.out.printf("Nome: %s%n", nome);
```

**Diferença:** `printf()` escreve direto para PrintStream, `format()` retorna String.

### Relação com Formatter

```java
// String.format usa Formatter internamente
Formatter formatter = new Formatter();
formatter.format("Valor: %.2f", 10.5);
String resultado = formatter.toString();  // "Valor: 10.50"
formatter.close();
```

### Relação com MessageFormat

```java
// MessageFormat (i18n)
String msg = MessageFormat.format("At {1,time} on {1,date}, there was {2} on planet {0}.",
                                   "Terra", new Date(), "eclipse");

// String.format (mais simples para casos básicos)
String msg = String.format("At %tT on %<tD, there was %s on planet %s.",
                            new Date(), "eclipse", "Terra");
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **printf()**: Output direto formatado
- **Formatter**: Formatação em streams
- **DecimalFormat**: Formatação numérica avançada
- **DateTimeFormatter**: Formatação de datas (Java 8+)
- **Text Blocks**: Templates multiline (Java 15+)

---

## 📚 Conclusão

`String.format()` é ferramenta fundamental para construir Strings formatadas através de templates com especificadores, permitindo controle preciso sobre representação textual de dados - largura, alinhamento, precisão, estilo. Baseado em printf do C, separa estrutura (template) de conteúdo (dados), tornando formatação declarativa ao invés de imperativa.

Dominar `String.format()` significa:
- Compreender anatomia de especificadores: `%[flags][width][.precision]conversion`
- Usar conversões básicas: `%s` (string), `%d` (int), `%f` (float), `%b` (boolean)
- Aplicar flags: `-` (esquerda), `+` (sinal), `0` (zeros), `,` (milhares), `#` (alternativo)
- Controlar width (largura) e precision (decimais/max chars)
- Usar `%n` para newline platform-independent
- Especificar Locale explícito quando precisão é crítica
- Reconhecer trade-off: legibilidade vs performance (format() é ~10x mais lento que `+`)
- Evitar em loops críticos - usar StringBuilder
- Aplicar em relatórios, logs, tabelas, internacionalização

`String.format()` transforma `format("R$ %,.2f", 1234.56)` em `"R$ 1,234.56"` - conciso, declarativo, poderoso. É diferença entre código verboso e frágil vs código expressivo e robusto para formatação de output.
