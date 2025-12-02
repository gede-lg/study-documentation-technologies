# BufferedWriter

1. **Introdução**
O tema principal “Streams de caracteres – BufferedWriter” trata de um dos mecanismos de escrita em arquivos ou fluxos de saída em Java, otimizando o desempenho ao acumular caracteres em memória antes de enviá-los ao destino final.
- **Relevância**: Em aplicações que realizam muitas operações de gravação de texto (logs, relatórios, arquivos CSV), usar `BufferedWriter` reduz chamadas de I/O e melhora significativamente a performance.
- **Definição e Conceitos Fundamentais**:
    - **Stream de caracteres**: fluxo de dados que trabalha com unidades de texto (`char`), adequado para arquivos ou conexões que trocam texto.
    - **BufferedWriter** (tema principal): classe que “bufferiza” — ou seja, armazena temporariamente — caracteres para depois escrevê-los de uma só vez ao destino.
    - **Subtema (Buffer)**: área de memória interna onde os caracteres são acumulados antes da escrita efetiva.

---

1. **Sumário**
2. Introdução
3. Sumário
4. Conteúdo Detalhado
    - Sintaxe e Estrutura
    - Componentes Principais
    - Restrições de uso
5. Exemplos de Código Otimizados
6. Informações Adicionais
7. Referências para Estudo Independente

---

1. **Conteúdo Detalhado**

### Sintaxe e Estrutura

```java
Writer fw = new FileWriter("saida.txt");         // FileWriter escreve diretamente no arquivo
BufferedWriter bw = new BufferedWriter(fw, 8192);// 8 KB de buffer (padrão é 8192)
bw.write("Olá, mundo!");                         // Grava na memória interna
bw.newLine();                                    // Insere separador de linha
bw.flush();                                      // Força gravação do buffer no arquivo
bw.close();                                      // Fecha o stream (e faz flush)

```

- **Construtores comuns**:
    - `BufferedWriter(Writer out)`
    - `BufferedWriter(Writer out, int sz)` — define o tamanho do buffer em caracteres.

### Componentes Principais

- **`write(String s)` / `write(char[] cbuf, int off, int len)`**: grava texto no buffer, sem acessar o arquivo imediatamente.
- **`newLine()`**: adiciona `System.lineSeparator()` de forma portável.
- **`flush()`**: transfere todo o conteúdo do buffer ao destino; importante antes de operações de leitura subsequentes no mesmo arquivo.
- **`close()`**: chama internamente `flush()` e depois fecha o recurso. Após esse ponto, não é possível escrever.

### Interação entre componentes

1. **Criação de `FileWriter`**: define o arquivo ou stream de saída.
2. **Encapsulamento em `BufferedWriter`**: melhora performance.
3. **Chamada a `write(...)`**: adiciona dados ao buffer.
4. **`newLine()`**: garante separador de linha independente de SO.
5. **`flush()`**: quando necessário, garante consistência.
6. **`close()`**: libera recursos e conclui escrita.

### Restrições de uso

- **Buffer muito grande**: pode consumir memória desnecessária; ajuste conforme volume de dados.
- **Não usar em cenários binários**: para fluxos de bytes (imagens, áudio), prefira `BufferedOutputStream`.
- **Sempre fechar o stream**: use `try-with-resources` para evitar leaks e garantir `flush()`.

---

1. **Exemplos de Código Otimizados**

> Caso de uso 1: Escrita simples de log
> 

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Logger {
    private final BufferedWriter bw;

    public Logger(String path) throws IOException {
        this.bw = new BufferedWriter(new FileWriter(path, true)); // true = append
    }

    public void log(String nivel, String mensagem) throws IOException {
        bw.write("[" + nivel + "] " + mensagem);
        bw.newLine();
        bw.flush(); // garante registro imediato
    }

    public void close() throws IOException {
        bw.close();
    }
}

// Uso:
try (Logger logger = new Logger("app.log")) {
    logger.log("INFO", "Aplicação iniciada");
    logger.log("ERROR", "Falha ao conectar ao DB");
}

```

> Caso de uso 2: Geração de CSV a partir de coleção de objetos
> 

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class CsvExporter {
    public static <T> void export(String path, List<T> dados, RowMapper<T> mapper) throws IOException {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter(path))) {
            // cabeçalho
            bw.write(String.join(",", mapper.headers()));
            bw.newLine();
            // linhas de dados
            for (T item : dados) {
                bw.write(String.join(",", mapper.map(item)));
                bw.newLine();
            }
            // flush automático no close()
        }
    }

    public interface RowMapper<T> {
        String[] headers();
        String[] map(T item);
    }
}

```

---

1. **Informações Adicionais**
- **Buffer vs. AutoFlush**: `BufferedWriter` não faz auto-flush a cada `write()`; controle manualmente.
- **Coding Standards**: evite concatenar strings em loops; prefira `StringBuilder` ou `String.join()`.
- **Alternativas modernas**: a API `java.nio.file.Files.newBufferedWriter(Path)` entrega `BufferedWriter` já configurado com charset e opções de abertura.

```java
try (BufferedWriter bw = Files.newBufferedWriter(
        Paths.get("saida.txt"),
        StandardOpenOption.CREATE, StandardOpenOption.APPEND)) {
    // ...
}

```

---

1. **Referências para Estudo Independente**
- Oracle Java™ Tutorials – I/O: Character Streams
[https://docs.oracle.com/javase/tutorial/essential/io/charstreams.html](https://docs.oracle.com/javase/tutorial/essential/io/charstreams.html)
- Javadoc `java.io.BufferedWriter`[https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/BufferedWriter.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/BufferedWriter.html)
- Artigo “Improving Java I/O performance with buffering” (Baeldung)
[https://www.baeldung.com/java-bufferedwriter-bufferedreader](https://www.baeldung.com/java-bufferedwriter-bufferedreader)
- Livro “Java: The Complete Reference” (Herbert Schildt), capítulos sobre I/O

---

Com esta estrutura, você tem visão conceitual, detalhes de uso, exemplos práticos e referências para aprofundar. Qualquer dúvida ou refinamento, estou à disposição!