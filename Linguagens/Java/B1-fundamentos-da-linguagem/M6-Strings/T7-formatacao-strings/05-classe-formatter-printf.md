# Classe Formatter e System.out.printf()

## 🎯 Introdução e Definição

### Definição Conceitual Clara

A **classe `Formatter`** é o motor de formatação central em Java que implementa interpretação de format strings (templates com especificadores `%d`, `%s`, `%f`) e conversão de argumentos para texto formatado, escrevendo resultado diretamente em destino (`Appendable` - StringBuilder, PrintStream, arquivo, socket). Conceitualmente, Formatter é o tradutor entre linguagem de templates printf-style e output formatado real - recebe `"Total: %.2f"` e `123.456`, produz `"Total: 123.46"` escrito onde você especificou. **System.out.printf()** é método de conveniência que delega para Formatter interno, combinando formatação e output console em uma chamada.

É o reconhecimento de que formatação é processo complexo - parsing de template, validação de tipos, conversão para String, aplicação de flags/width/precision - e este processo deve ser encapsulado em classe reutilizável que pode escrever em qualquer destino (não apenas criar Strings ou imprimir console).

### Contexto Histórico e Motivação

Java 5 (2004) introduziu formatação estilo-printf inspirada em C. Ao invés de implementar formatação em múltiplos lugares (String, PrintStream, PrintWriter), Java centralizou lógica em **classe Formatter**. `String.format()` cria Formatter temporário para StringBuilder, `PrintStream.printf()` usa Formatter interno para stream, permitindo código formatado reutilizar mesma engine.

**Motivação:** DRY (Don't Repeat Yourself) - formatação é complexa, deve ser implementada uma vez. Formatter permite escrever em qualquer destino via interface `Appendable` - arquivos, buffers, network streams, não apenas String ou console.

### Problema Fundamental que Resolve

**Problema:** String.format() e printf() cobrem casos comuns, mas e formatação customizada para destinos arbitrários (socket, StringBuilder, GUI component)?

```java
// Preciso escrever formatado em StringBuilder
StringBuilder sb = new StringBuilder();
String linha1 = String.format("Nome: %s%n", nome);
String linha2 = String.format("Idade: %d%n", idade);
sb.append(linha1).append(linha2);  // Cria Strings intermediárias!
```

**Solução:** Formatter escreve direto no destino:

```java
StringBuilder sb = new StringBuilder();
Formatter formatter = new Formatter(sb);  // Formatter escreve em sb
formatter.format("Nome: %s%n", nome);      // Escreve direto, sem String intermediária
formatter.format("Idade: %d%n", idade);
String resultado = sb.toString();
formatter.close();  // Libera recursos
```

**Outro exemplo - escrever formatado em arquivo:**

```java
try (Formatter formatter = new Formatter(new File("relatorio.txt"))) {
    formatter.format("=== Relatório ===%n");
    formatter.format("Data: %tF%n", new Date());
    formatter.format("Total: R$ %,.2f%n", 1234.56);
}  // Auto-close
```

---

## 📋 Sumário Conceitual

### Aspectos Teóricos Centrais

1. **Engine de Formatação:** Implementa parsing de templates e conversão de valores.

2. **Appendable como Destino:** Escreve em qualquer `Appendable` (StringBuilder, PrintStream, Writer, CharBuffer).

3. **Stateful:** Mantém estado (locale, destino, exceções) - reutilizar formatter é eficiente.

4. **Closeable:** Deve ser fechado para liberar recursos quando destino é stream.

5. **Delegação:** `String.format()` e `printf()` delegam para Formatter internamente.

### Pilares Fundamentais

- **Sintaxe:** `new Formatter(Appendable a)` - escreve em `a`
- **Método Principal:** `format(String format, Object... args)` - retorna this para chaining
- **Destinos:** StringBuilder, PrintStream, File, Path, OutputStream
- **Locale:** Configurável via construtor ou setLocale()
- **Uso:** Formatação customizada para destinos arbitrários, reutilização de formatter

---

## 🧠 Fundamentos Teóricos

### Como Formatter Funciona Internamente

#### Arquitetura

```java
public final class Formatter implements Closeable, Flushable {
    private Appendable a;       // Destino onde escrever
    private Locale l;           // Locale para formatação
    private IOException lastException;  // Última exceção de I/O

    public Formatter(Appendable a, Locale l) {
        this.a = Objects.requireNonNull(a);
        this.l = l;
    }

    public Formatter format(String format, Object... args) {
        // 1. Parse template
        // 2. Para cada especificador, converte argumento correspondente
        // 3. Escreve resultado em 'a' (Appendable)
        // 4. Retorna this
        return this;
    }
}
```

#### Processo de Formatação

```java
StringBuilder sb = new StringBuilder();
Formatter fmt = new Formatter(sb);
fmt.format("Total: %.2f", 123.456);
```

**Passos:**
1. **Parse:** Identifica especificador `%.2f`
2. **Validação:** Argumento (123.456) é Number? ✓
3. **Conversão:** 123.456 → "123.46" (2 decimais)
4. **Escrita:** `a.append("Total: 123.46")` (escreve direto em StringBuilder)
5. **Retorno:** Retorna `this` (Formatter)

### System.out.printf() Internamente

#### Delegação para Formatter

```java
public class PrintStream extends FilterOutputStream {
    private Formatter formatter;  // Formatter interno reutilizado

    public PrintStream printf(String format, Object... args) {
        return format(format, args);
    }

    public PrintStream format(String format, Object... args) {
        synchronized (this) {
            if (formatter == null || formatter.locale() != Locale.getDefault()) {
                formatter = new Formatter(this);  // Cria Formatter escrevendo neste stream
            }
            formatter.format(Locale.getDefault(), format, args);
        }
        return this;
    }
}
```

**Análise:**
- `printf()` é apenas alias para `format()`
- Formatter interno é reutilizado para performance
- Sincronização garante thread-safety
- Formatter escreve direto no PrintStream

---

## 🔍 Análise Conceitual Profunda

### Destinos de Formatação

#### 1. StringBuilder (Buffer em Memória)

```java
StringBuilder sb = new StringBuilder();
try (Formatter fmt = new Formatter(sb)) {
    fmt.format("Linha 1: %s%n", "dados");
    fmt.format("Linha 2: %d%n", 42);
}
String resultado = sb.toString();
```

**Uso:** Construir Strings complexas formatadas eficientemente.

#### 2. File (Escrita em Arquivo)

```java
try (Formatter fmt = new Formatter(new File("dados.txt"))) {
    fmt.format("=== Relatório ===%n");
    fmt.format("Data: %tF%n", new Date());
    fmt.format("Total: %,.2f%n", 1234.56);
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```

**Uso:** Gerar relatórios, logs, CSVs formatados.

#### 3. PrintStream (Console/Streams)

```java
Formatter fmt = new Formatter(System.out);
fmt.format("Mensagem: %s%n", "teste");
fmt.flush();  // Força escrita
// Não precisa close (System.out não deve ser fechado)
```

**Uso:** Output formatado para console ou streams.

#### 4. OutputStream (Binário)

```java
try (Formatter fmt = new Formatter(new FileOutputStream("output.txt"))) {
    fmt.format("Dados: %d%n", 42);
}
```

**Uso:** Escrever texto formatado em streams binários.

#### 5. Path (Java 7+ NIO)

```java
try (Formatter fmt = new Formatter(Paths.get("relatorio.txt").toFile())) {
    fmt.format("Resultado: %s%n", resultado);
}
```

### Locale Explícito

```java
// Locale no construtor (afeta todas formatações)
Formatter fmt = new Formatter(sb, Locale.US);
fmt.format("%,.2f%n", 1234.56);  // "1,234.56" (sempre US)

// Locale por chamada (sobrescreve default)
Formatter fmt2 = new Formatter(sb);
fmt2.format(Locale.GERMANY, "%,.2f%n", 1234.56);  // "1.234,56"
fmt2.format(Locale.US, "%,.2f%n", 1234.56);       // "1,234.56"
```

### Chaining de Formatação

```java
StringBuilder sb = new StringBuilder();
Formatter fmt = new Formatter(sb);

fmt.format("Nome: %s%n", nome)
   .format("Idade: %d%n", idade)
   .format("Email: %s%n", email)
   .flush();  // Chaining possível pois format() retorna this

String resultado = sb.toString();
fmt.close();
```

### Captura de Exceções de I/O

```java
Formatter fmt = new Formatter(outputStream);
fmt.format("Dados: %d%n", 42);

// Verificar se houve exceção de I/O
IOException exception = fmt.ioException();
if (exception != null) {
    System.err.println("Erro de I/O durante formatação: " + exception);
}
```

**Análise:** Formatter captura exceções de I/O internamente ao invés de propagá-las, permitindo verificação posterior.

---

## 🎯 Aplicabilidade e Contextos

### Quando Usar Formatter Diretamente

✅ **Use Formatter quando:**

1. **Destino Customizado:**
   ```java
   Formatter fmt = new Formatter(customAppendable);
   ```

2. **Reutilização em Loop:**
   ```java
   StringBuilder sb = new StringBuilder();
   Formatter fmt = new Formatter(sb);
   for (Item item : itens) {
       fmt.format("%-20s | %10.2f%n", item.nome, item.preco);
   }
   ```

3. **Controle de Locale Explícito:**
   ```java
   Formatter fmt = new Formatter(sb, Locale.FRANCE);
   ```

4. **Captura de Exceções I/O:**
   ```java
   IOException ex = fmt.ioException();
   ```

### Quando Usar Conveniência (printf/format)

✅ **Use printf/format quando:**

1. **Output Console Simples:**
   ```java
   System.out.printf("Total: %.2f%n", total);
   ```

2. **String Formatada Única:**
   ```java
   String msg = String.format("Erro: %s", erro);
   ```

---

## ⚠️ Limitações e Considerações

### Formatter Não é Thread-Safe

```java
// PERIGOSO - compartilhar Formatter entre threads
Formatter fmt = new Formatter(sb);
executor.submit(() -> fmt.format("Thread 1: %d%n", 1));
executor.submit(() -> fmt.format("Thread 2: %d%n", 2));
// Pode corromper output!

// CORRETO - Formatter por thread ou sincronizar
synchronized (fmt) {
    fmt.format("Thread: %d%n", id);
}
```

### Deve Ser Fechado

```java
// Formatter para File/Stream deve ser fechado
Formatter fmt = new Formatter(new File("data.txt"));
fmt.format("Dados%n");
fmt.close();  // IMPORTANTE - flush e libera recursos

// Ou try-with-resources
try (Formatter fmt = new Formatter(new File("data.txt"))) {
    fmt.format("Dados%n");
}  // Auto-close
```

### Exceções de I/O são Capturadas

```java
Formatter fmt = new Formatter(streamQuePodeFalhar);
fmt.format("Dados: %d%n", 42);
// Se stream falhar, exceção NÃO é lançada!

// Verificar manualmente
IOException ex = fmt.ioException();
if (ex != null) {
    // Tratar erro
}
```

---

## 🔗 Interconexões Conceituais

### Relação com String.format()

```java
// String.format usa Formatter internamente
public static String format(String format, Object... args) {
    return new Formatter().format(format, args).toString();
}
```

**Equivalência:**
```java
String.format("Total: %.2f", 123.45);
// É shorthand para:
new Formatter().format("Total: %.2f", 123.45).toString();
```

### Relação com PrintStream.printf()

```java
// printf delega para Formatter
System.out.printf("Valor: %d%n", 42);
// Internamente:
System.out.format("Valor: %d%n", 42);
// Que usa:
formatter.format("Valor: %d%n", 42);  // Formatter interno do PrintStream
```

### Relação com Appendable

```java
// Formatter aceita qualquer Appendable
Appendable destino = new StringBuilder();
// Ou: PrintStream, PrintWriter, CharBuffer, etc

Formatter fmt = new Formatter(destino);
fmt.format("Texto%n");
// Texto escrito em destino.append()
```

---

## 🚀 Evolução e Próximos Conceitos

### Conceitos Relacionados

- **String.format()**: Atalho para formatar em String
- **PrintStream.printf()**: Atalho para formatar em console
- **Appendable**: Interface para destinos de formatação
- **DecimalFormat/DateFormat**: Formatadores especializados

---

## 📚 Conclusão

Classe Formatter é engine central de formatação em Java que interpreta templates printf-style e escreve output formatado em qualquer Appendable (StringBuilder, PrintStream, arquivo). System.out.printf() é método de conveniência que delega para Formatter interno, combinando formatação e output console.

Dominar Formatter e printf() significa:
- Compreender que Formatter é engine - String.format() e printf() são facades
- Usar Formatter diretamente para destinos customizados (StringBuilder, File, Stream)
- printf() é atalho para `System.out.format()` que usa Formatter interno
- Formatter escreve direto em Appendable - elimina Strings intermediárias
- Reutilizar Formatter em loops para performance (evita parsing repetido)
- Sempre fechar Formatter quando destino é File/Stream (usar try-with-resources)
- Formatter NÃO é thread-safe - usar instância por thread ou sincronizar
- Exceções de I/O são capturadas - verificar com ioException()
- Chaining possível: `format().format().flush()`
- Especificar Locale via construtor ou por chamada

Formatter é abstração poderosa: separa formatação (template + conversão) de destino (onde escrever). printf() é caso especial (destino=console) - para outros destinos, Formatter dá controle total. É diferença entre API de conveniência (printf) e API de baixo nível flexível (Formatter).
