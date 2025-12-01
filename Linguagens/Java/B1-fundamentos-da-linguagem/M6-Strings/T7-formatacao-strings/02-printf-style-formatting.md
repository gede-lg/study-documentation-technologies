# Printf-Style Formatting

## 🎯 Introdução e Definição

### Definição Conceitual Clara

**Printf-style formatting** é o paradigma de formatação baseado na função `printf()` do C (1972), onde output formatado é gerado através de string template contendo especificadores de formato (`%d`, `%s`, `%f`) que são substituídos por valores em runtime, permitindo controle preciso sobre representação textual - padding, alinhamento, precisão decimal, base numérica. Conceitualmente, é a fusão de template (estrutura fixa com placeholders) e dados (valores dinâmicos), transformando `printf("Total: %.2f", 10.5)` em output `"Total: 10.50"` sem criar String intermediária - escreve direto para stream de saída.

É o reconhecimento de que formatação e output são frequentemente acoplados - ao invés de primeiro formatar String (`String.format()`) depois imprimir (`println()`), printf combina ambos em operação atômica, reduzindo overhead e tornando código mais conciso para output direto.

### Contexto Histórico e Motivação

`printf()` ("print formatted") foi introduzido na linguagem C em 1972 por Dennis Ritchie, revolucionando formatação ao separar **o quê** (dados) de **como** (formato). Antes, output exigia conversões manuais e concatenação. Printf popularizou sintaxe `%X` onde X é tipo (d=decimal, s=string, f=float), tornando-se padrão em C, C++, Perl, Python, Ruby.

Java adotou printf no **Java 5 (2004)** como `System.out.printf()` e `PrintStream.printf()`, mantendo compatibilidade sintática com C para facilitar transição de programadores C/C++ e aproveitar familiaridade com especificadores. `PrintWriter.printf()` também adicionado para I/O formatado.

**Motivação:** Output console é uso dominante de formatação - criar String intermediária (`format()` + `println()`) desperdiça memória e CPU quando destino final é stream. Printf escreve direto, eliminando overhead.

### Problema Fundamental que Resolve

**Problema:** Formatação seguida de output cria String temporária desnecessária:

```java
// Duas etapas - cria String intermediária
String temp = String.format("Resultado: %.2f", 123.456);
System.out.println(temp);  // Usa e descarta temp
```

**Solução:** Printf combina formatação e output:

```java
// Uma etapa - escreve direto para stdout
System.out.printf("Resultado: %.2f%n", 123.456);
// Sem String intermediária!
```

**Outro exemplo - tabela:**

```java
// Manual - verboso
System.out.println(String.format("%-20s | %10.2f", nome1, preco1));
System.out.println(String.format("%-20s | %10.2f", nome2, preco2));

// Printf - conciso
System.out.printf("%-20s | %10.2f%n", nome1, preco1);
System.out.printf("%-20s | %10.2f%n", nome2, preco2);
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Output Direto:** Escreve formatado direto para stream (stdout, arquivo, socket) sem String intermediária.

2. **Mesma Sintaxe de format():** Especificadores (`%d`, `%s`, `%f`) e flags idênticos.

3. **Retorno de PrintStream:** Retorna próprio stream para chaining (`printf().printf()`).

4. **Disponível em Múltiplos Streams:** `System.out`, `System.err`, `PrintWriter`, `PrintStream`.

5. **Buffering:** Output pode ser bufferizado - precisa flush para garantir escrita imediata.

### Pilares Fundamentais

- **Sintaxe:** `stream.printf(String format, Object... args)` - retorna próprio stream
- **Streams Comuns:** `System.out.printf()`, `System.err.printf()`, `PrintWriter.printf()`
- **Especificadores:** Mesmos de `String.format()` - `%s`, `%d`, `%f`, `%c`, `%b`, `%n`
- **Chaining:** `printf().flush()` possível por retornar stream
- **Uso:** Console output, logs, arquivos de texto, relatórios

---

## 🧠 Fundamentos Teóricos

### Como Funciona Internamente

#### Implementação em PrintStream

```java
public class PrintStream extends FilterOutputStream {
    public PrintStream printf(String format, Object... args) {
        return format(format, args);  // Delega para format()
    }

    public PrintStream format(String format, Object... args) {
        try {
            synchronized (this) {
                if (formatter == null || formatter.locale() != Locale.getDefault()) {
                    formatter = new Formatter(this);  // Formatter escreve neste stream
                }
                formatter.format(Locale.getDefault(), format, args);
            }
        } catch (InterruptedIOException x) {
            Thread.currentThread().interrupt();
        } catch (IOException x) {
            trouble = true;
        }
        return this;  // Retorna próprio stream para chaining
    }
}
```

**Análise:** `printf()` é alias para `format()`. Internamente cria `Formatter` que escreve direto no stream, evitando String intermediária.

#### Formatter Escrevendo em Stream

```java
Formatter formatter = new Formatter(System.out);
formatter.format("Total: %.2f%n", 123.456);
// Escreve "Total: 123.46\n" direto em stdout
// Não retorna String!
```

### Diferença Conceitual: printf vs format

**String.format():**
```java
String s = String.format("Valor: %d", 42);  // Retorna String
System.out.println(s);  // Escreve depois
```

**Fluxo:**
```
Dados → Formatter → String intermediária → PrintStream → Output
```

**System.out.printf():**
```java
System.out.printf("Valor: %d%n", 42);  // Escreve direto
```

**Fluxo:**
```
Dados → Formatter → PrintStream (direto) → Output
```

**Economia:** Elimina criação e garbage collection de String temporária.

### Princípios e Conceitos Subjacentes

#### Princípio do Output Direto

Printf otimiza caso comum: formatar para output imediato.

```java
// Anti-pattern - String intermediária desnecessária
String msg = String.format("Log: %s", evento);
System.out.println(msg);

// Otimizado - direto
System.out.printf("Log: %s%n", evento);
```

#### Princípio do Chaining

Retornar `this` permite encadear operações:

```java
System.out
    .printf("Nome: %s%n", nome)
    .printf("Idade: %d%n", idade)
    .flush();  // Força escrita imediata
```

---

## 🔍 Análise Conceitual Profunda

### Casos de Uso Detalhados

#### Caso 1: Tabelas Alinhadas

```java
System.out.printf("%-20s | %10s | %8s%n", "Produto", "Preço", "Estoque");
System.out.printf("%-20s | %10s | %8s%n", "-".repeat(20), "-".repeat(10), "-".repeat(8));
System.out.printf("%-20s | R$ %7.2f | %8d%n", "Mouse Gamer", 149.90, 50);
System.out.printf("%-20s | R$ %7.2f | %8d%n", "Teclado Mecânico", 399.00, 23);
System.out.printf("%-20s | R$ %7.2f | %8d%n", "Monitor 27\"", 1299.99, 8);
```

**Output:**
```
Produto              |      Preço |  Estoque
-------------------- | ---------- | --------
Mouse Gamer          | R$  149.90 |       50
Teclado Mecânico     | R$  399.00 |       23
Monitor 27"          | R$ 1299.99 |        8
```

#### Caso 2: Logs Timestamped

```java
import java.util.Date;

Date agora = new Date();
System.out.printf("[%tF %<tT] INFO: Usuário %s realizou login%n", agora, "alice");
// [2025-11-24 14:30:45] INFO: Usuário alice realizou login

// %tF = data (yyyy-MM-dd)
// %<tT = time (HH:mm:ss) - %< reutiliza argumento anterior
```

#### Caso 3: Barra de Progresso

```java
for (int i = 0; i <= 100; i += 10) {
    System.out.printf("\rProgresso: [%-10s] %3d%%", "=".repeat(i/10), i);
    // \r = carriage return (sobrescreve linha)
    Thread.sleep(500);
}
System.out.printf("%n");  // Nova linha após completar
```

**Output animado:**
```
Progresso: [==========] 100%
```

#### Caso 4: Formatação Monetária

```java
double[] precos = {1234.56, 789.0, 12.345};

for (double preco : precos) {
    System.out.printf("R$ %,10.2f%n", preco);
}
```

**Output:**
```
R$  1,234.56
R$    789.00
R$     12.35
```

#### Caso 5: Debug com Hex/Octal

```java
int valor = 255;
System.out.printf("Decimal: %d | Hex: %#x | Octal: %#o | Binário: %s%n",
                  valor, valor, valor, Integer.toBinaryString(valor));
// Decimal: 255 | Hex: 0xff | Octal: 0377 | Binário: 11111111
```

### Especificadores de Data/Hora

Printf tem especificadores especiais para datas (`%t`):

#### Especificadores de Data

```java
Date data = new Date();  // 24 Nov 2025

System.out.printf("%tY%n", data);     // "2025" (ano 4 dígitos)
System.out.printf("%ty%n", data);     // "25" (ano 2 dígitos)
System.out.printf("%tm%n", data);     // "11" (mês)
System.out.printf("%td%n", data);     // "24" (dia)
System.out.printf("%tB%n", data);     // "November" (mês completo)
System.out.printf("%tb%n", data);     // "Nov" (mês abreviado)
System.out.printf("%tA%n", data);     // "Sunday" (dia semana completo)
System.out.printf("%ta%n", data);     // "Sun" (dia semana abreviado)
```

#### Especificadores de Tempo

```java
Date hora = new Date();  // 14:30:45

System.out.printf("%tH%n", hora);     // "14" (hora 24h)
System.out.printf("%tI%n", hora);     // "02" (hora 12h)
System.out.printf("%tM%n", hora);     // "30" (minutos)
System.out.printf("%tS%n", hora);     // "45" (segundos)
System.out.printf("%tp%n", hora);     // "pm" (AM/PM)
```

#### Composições de Data/Hora

```java
Date timestamp = new Date();

System.out.printf("%tF%n", timestamp);        // "2025-11-24" (ISO date)
System.out.printf("%tD%n", timestamp);        // "11/24/25" (US date)
System.out.printf("%tT%n", timestamp);        // "14:30:45" (ISO time)
System.out.printf("%tr%n", timestamp);        // "02:30:45 PM" (12h with AM/PM)
System.out.printf("%tc%n", timestamp);        // "Sun Nov 24 14:30:45 BRT 2025"

// Reutilizar argumento com %<
System.out.printf("%tF %<tT%n", timestamp);   // "2025-11-24 14:30:45"
// %tF usa timestamp, %<tT reutiliza mesmo timestamp
```

### Printf em Diferentes Streams

#### System.out vs System.err

```java
// Stdout - output normal
System.out.printf("Processando %d itens...%n", 100);

// Stderr - erros
System.err.printf("ERRO: Falha ao processar item %d%n", 42);
```

**Análise:** Separar stdout e stderr permite redirecionamento independente:
```bash
java App > output.txt 2> errors.txt
```

#### PrintWriter

```java
try (PrintWriter writer = new PrintWriter("relatorio.txt")) {
    writer.printf("=== Relatório ===%n");
    writer.printf("Data: %tF%n", new Date());
    writer.printf("Total: R$ %,.2f%n", 1234.56);
} catch (IOException e) {
    e.printStackTrace();
}
```

#### StringBuilder com Formatter

```java
StringBuilder sb = new StringBuilder();
Formatter formatter = new Formatter(sb);  // Formatter escreve em StringBuilder

formatter.format("Nome: %s%n", "Alice");
formatter.format("Idade: %d%n", 30);

String resultado = sb.toString();
// "Nome: Alice\nIdade: 30\n"
```

**Análise:** Combina eficiência de StringBuilder com poder de formatação.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar printf

✅ **Use printf quando:**

1. **Output Console Direto:**
   ```java
   System.out.printf("Bem-vindo, %s!%n", usuario);
   ```

2. **Logs Formatados:**
   ```java
   System.err.printf("[%tT] ERRO: %s%n", new Date(), mensagem);
   ```

3. **Escrita em Arquivos:**
   ```java
   writer.printf("Linha %d: %s%n", numero, conteudo);
   ```

4. **Tabelas e Relatórios:**
   ```java
   System.out.printf("%-15s %8.2f%n", item, valor);
   ```

5. **Debug com Múltiplos Formatos:**
   ```java
   System.out.printf("Debug: int=%d, hex=%#x, float=%.3f%n", val, val, floatVal);
   ```

### Quando Usar String.format()

✅ **Use String.format() quando:**

1. **Precisar da String Formatada:**
   ```java
   String mensagem = String.format("Total: %.2f", total);
   enviarEmail(mensagem);  // Usa String em outro contexto
   ```

2. **Construir Strings para GUIs:**
   ```java
   label.setText(String.format("Progresso: %d%%", percentual));
   ```

3. **Concatenar Múltiplas Formatações:**
   ```java
   String relatorio = String.format("Início: %s%n", inicio) +
                      String.format("Fim: %s%n", fim) +
                      String.format("Total: %d%n", total);
   ```

---

## 🔍 Análise Conceitual Profunda

### Printf com Índices de Argumento

#### Reordenação de Argumentos

```java
// Útil para internacionalização
// Inglês: "Name: Alice, Age: 30"
System.out.printf("Name: %1$s, Age: %2$d%n", "Alice", 30);

// Português: "Idade: 30, Nome: Alice" (ordem invertida)
System.out.printf("Idade: %2$d, Nome: %1$s%n", "Alice", 30);
```

#### Reutilização com %<

```java
Date agora = new Date();

// Sem reutilização - passar mesmo argumento múltiplas vezes
System.out.printf("%tF %tT%n", agora, agora);  // Redundante

// Com %< - reutiliza argumento anterior
System.out.printf("%tF %<tT%n", agora);  // Eficiente
```

### Printf para Arquivos

#### Escrita Formatada em Arquivo

```java
try (PrintWriter out = new PrintWriter("dados.txt")) {
    out.printf("=== Relatório de Vendas ===%n%n");

    out.printf("%-20s | %10s | %8s%n", "Produto", "Preço", "Qtd");
    out.printf("%s%n", "-".repeat(45));

    for (Venda venda : vendas) {
        out.printf("%-20s | R$ %7.2f | %8d%n",
                   venda.produto, venda.preco, venda.quantidade);
    }

    out.printf("%n");
    out.printf("Total: R$ %,.2f%n", calcularTotal());
}
```

#### Locale Explícito para Arquivos

```java
// Garantir formato US independente de sistema
try (PrintWriter out = new PrintWriter("data.csv")) {
    out.printf(Locale.US, "%.2f,%.2f,%.2f%n", val1, val2, val3);
    // Sempre ponto decimal, não vírgula
}
```

### Buffering e Flush

#### Printf é Bufferizado

```java
// Output pode não aparecer imediatamente
System.out.printf("Processando...");
Thread.sleep(5000);  // 5 segundos
// "Processando..." só aparece após sleep!

// Solução: flush
System.out.printf("Processando...");
System.out.flush();  // Força escrita imediata
Thread.sleep(5000);  // "Processando..." aparece instantaneamente
```

#### Autoflush

```java
// PrintStream pode ser criado com autoflush
PrintStream out = new PrintStream(new FileOutputStream("log.txt"), true);
//                                                                    ^^^^
//                                                                  autoflush=true
out.printf("Linha 1%n");  // Flushed automaticamente após %n
```

**Análise:** `System.out` tem autoflush habilitado - flush ocorre após `\n` (ou `%n`). Arquivos não têm autoflush por padrão.

### Comparação com Alternativas

#### printf vs println + format

```java
// Opção 1: println + format (String intermediária)
String temp = String.format("Total: %.2f", 123.45);
System.out.println(temp);

// Opção 2: printf (direto)
System.out.printf("Total: %.2f%n", 123.45);

// Opção 3: println com concatenação (sem formatação)
System.out.println("Total: " + 123.45);  // "Total: 123.45" (sem controle de decimais)
```

**Escolha:**
- **printf:** Output console com formatação complexa
- **format + println:** Precisar String para reutilizar
- **println simples:** Sem necessidade de formatação

#### printf vs StringBuilder

```java
// Múltiplas linhas formatadas

// Opção 1: printf (múltiplas chamadas)
System.out.printf("Linha 1: %d%n", val1);
System.out.printf("Linha 2: %d%n", val2);
System.out.printf("Linha 3: %d%n", val3);

// Opção 2: StringBuilder + format
StringBuilder sb = new StringBuilder();
sb.append(String.format("Linha 1: %d%n", val1));
sb.append(String.format("Linha 2: %d%n", val2));
sb.append(String.format("Linha 3: %d%n", val3));
String resultado = sb.toString();

// Opção 3: Formatter + StringBuilder
StringBuilder sb = new StringBuilder();
Formatter fmt = new Formatter(sb);
fmt.format("Linha 1: %d%n", val1);
fmt.format("Linha 2: %d%n", val2);
fmt.format("Linha 3: %d%n", val3);
String resultado = sb.toString();
```

---

## ⚠️ Limitações e Considerações

### Limitações

#### Não Retorna String

```java
// printf retorna PrintStream, não String
String resultado = System.out.printf("Total: %d", 42);  // Tipo errado!
// resultado = PrintStream, não String

// Use format() se precisar String
String resultado = String.format("Total: %d", 42);  // Correto
```

#### Locale Implícito

```java
// printf usa Locale.getDefault()
System.out.printf("%,.2f%n", 1234.56);
// US:  "1,234.56"
// BR:  "1.234,56"
// Imprevisível!

// Solução: Locale explícito
System.out.printf(Locale.US, "%,.2f%n", 1234.56);  // Sempre "1,234.56"
```

#### Exceções em Runtime

```java
// Type mismatch só detectado em runtime
System.out.printf("%d", "texto");
// Runtime: IllegalFormatConversionException: d != java.lang.String
```

### Considerações de Performance

**Benchmark:**
```java
// println simples
System.out.println("Total: " + 123.45);  // ~100ns

// printf formatado
System.out.printf("Total: %.2f%n", 123.45);  // ~600ns (6x mais lento)
```

**Análise:** Printf tem overhead de parsing template e formatação. Use quando formatação vale custo.

### Armadilhas Comuns

#### Armadilha 1: Esquecer %n

```java
// ERRADO - não quebra linha
System.out.printf("Linha 1");
System.out.printf("Linha 2");
// Output: "Linha 1Linha 2" (mesma linha!)

// CORRETO
System.out.printf("Linha 1%n");
System.out.printf("Linha 2%n");
// Output:
// Linha 1
// Linha 2
```

#### Armadilha 2: Usar \n ao invés de %n

```java
// Ruim - hardcoded para Unix
System.out.printf("Linha 1\n");  // Funciona em Unix, quebrado em Windows old

// Bom - platform-independent
System.out.printf("Linha 1%n");  // Funciona em todos sistemas
```

#### Armadilha 3: Argumentos Insuficientes

```java
// Compila mas falha em runtime
System.out.printf("Nome: %s, Idade: %d%n", "Alice");
// Runtime: MissingFormatArgumentException: Format specifier '%d'
```

---

## 🔗 Interconexões Conceituais

### Relação com String.format()

```java
// Internamente relacionados
System.out.printf(fmt, args);
// Equivalente a:
System.out.print(String.format(fmt, args));
```

### Relação com Formatter

```java
// printf usa Formatter internamente
Formatter formatter = new Formatter(System.out);
formatter.format("Total: %.2f%n", 123.45);
// Equivalente a:
System.out.printf("Total: %.2f%n", 123.45);
```

### Relação com DecimalFormat

```java
// DecimalFormat - formatação numérica especializada
DecimalFormat df = new DecimalFormat("#,##0.00");
System.out.println("Total: " + df.format(1234.56));

// printf - mais conciso para casos simples
System.out.printf("Total: %,.2f%n", 1234.56);
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **String.format()**: Retorna String formatada
- **Formatter**: Formatação em qualquer Appendable
- **DecimalFormat**: Formatação numérica avançada
- **DateTimeFormatter**: Formatação de datas (Java 8+)
- **Text Blocks**: Templates multiline (Java 15+)

---

## 📚 Conclusão

Printf-style formatting é paradigma de output formatado direto para streams, combinando formatação (template com especificadores) e escrita em operação única, eliminando Strings intermediárias. Baseado em printf do C, usa mesma sintaxe de `String.format()` mas escreve direto em `PrintStream`/`PrintWriter` ao invés de retornar String.

Dominar printf-style formatting significa:
- Usar `System.out.printf()` para output console formatado direto
- Compreender que printf retorna stream (não String) - permite chaining
- Aplicar mesmos especificadores de `String.format()`: `%s`, `%d`, `%f`, flags, width, precision
- Usar especificadores de data/hora: `%tF` (data ISO), `%tT` (time), `%<` (reutilizar argumento)
- Sempre usar `%n` para newline (platform-independent), não `\n`
- Preferir printf sobre `println(format())` para output direto - elimina String temporária
- Usar `flush()` quando precisar escrita imediata (buffer pode atrasar)
- Especificar Locale explícito quando formato precisa ser previsível
- Aplicar em arquivos via `PrintWriter.printf()` para relatórios formatados

Printf é otimização de caso comum: formatar para output imediato. Se precisar String formatada para reutilizar, use `String.format()`. Se apenas escrever output formatado, printf é mais eficiente e conciso. É diferença entre duas operações (format + print) e uma operação atômica (printf).
