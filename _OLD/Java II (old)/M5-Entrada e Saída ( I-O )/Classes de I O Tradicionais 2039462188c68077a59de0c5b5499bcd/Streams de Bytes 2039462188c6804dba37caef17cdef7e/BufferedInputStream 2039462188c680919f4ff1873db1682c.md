# BufferedInputStream

1. **Introdução**
    - **Visão Geral:**
    O `BufferedInputStream` faz parte da API de I/O tradicional do Java (`java.io`). Ele “envolve” (wraps) um `InputStream` subjacente, adicionando um buffer de leitura em memória para otimizar acesso a dados.
    - **Relevância e Importância:**
    Em operações de leitura de arquivos ou dados em rede, chamadas diretas a um `InputStream` podem ser lentas, pois cada operação de leitura aciona I/O no disco ou na rede. O `BufferedInputStream` reduz o número de chamadas físicas, melhorando significativamente a performance.
    - **Definição e Conceitos Fundamentais:**
        - **Tema Principal:** `BufferedInputStream` — classe que fornece leitura em buffer sobre um `InputStream`.
        - **Subtemas:**
            1. Buffer interno (tamanho e alocação)
            2. Métodos de leitura (`read()`, `read(byte[])`, `mark()`, `reset()`)
            3. Boas práticas de uso e dimensionamento de buffer
        - **Para que servem:** reduzir chamadas de sistema, agrupar leituras e possibilitar operações como marcar e resetar o fluxo de dados.
2. **Sumário**
    1. BufferedInputStream: Visão Geral
    2. Sintaxe e Estrutura
    3. Componentes Principais
    4. Restrições de Uso
    5. Exemplos de Código Otimizados
    6. Informações Adicionais
    7. Referências para Estudo Independente
3. **Conteúdo Detalhado**
    
    ### 3.1 Sintaxe e Estrutura
    
    ```java
    public class BufferedInputStream extends FilterInputStream {
        protected volatile byte buf[];        // buffer interno
        protected int count;                  // número de bytes válidos no buffer
        protected int pos;                    // próxima posição de leitura
        protected int markpos = -1;           // posição marcada (-1 = sem mark)
        protected int marklimit;              // max bytes após mark antes de invalidar
        // construtores principais
        public BufferedInputStream(InputStream in) { ... }
        public BufferedInputStream(InputStream in, int size) { ... }
    }
    
    ```
    
    - **Construtores:**
        - `BufferedInputStream(InputStream in)` — usa buffer padrão (8 KB).
        - `BufferedInputStream(InputStream in, int size)` — permite definir tamanho do buffer.
    
    ### 3.2 Componentes Principais
    
    - **Buffer (`buf`):** array byte\[] onde os dados são pré-carregados.
    - **`read()` e `read(byte[] b, int off, int len)`:** consomem bytes do buffer, recarregando-o quando esvaziado.
    - **`available()`:** retorna estimativa de bytes ainda disponíveis no buffer + subjacente.
    - **`mark(int readlimit)`:** marca a posição atual no buffer, permitindo retornar a ela até `readlimit` bytes depois.
    - **`reset()`:** retorna à posição marcada. Gera `IOException` se o limite de leitura foi ultrapassado.
    - **`skip(long n)`:** pula até `n` bytes, lendo do buffer ou subjacente.
    - **`close()`:** fecha o stream subjacente; libera buffer para GC.
    
    ### 3.3 Restrições de Uso
    
    - **Uso de `mark/reset`:** só funciona se o subjacente suportar marcação, ou enquanto `readlimit` não for excedido.
    - **Buffer muito pequeno:** pode reduzir ganhos de performance; muito grande: consumo de memória desnecessário. Dimensione conforme tamanho típico das leituras.
    - **Não usar em fluxos não sequentais:** para acesso random (e.g., `RandomAccessFile`), prefira canais NIO.
4. **Exemplos de Código Otimizados**
    
    ```java
    import java.io.*;
    
    public class FileCopyBuffered {
        public static void copyFile(File src, File dest) throws IOException {
            try (BufferedInputStream in = new BufferedInputStream(new FileInputStream(src), 16 * 1024);
                 BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(dest), 16 * 1024)) {
                byte[] buffer = new byte[8 * 1024];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                out.flush();
            }
        }
    }
    
    ```
    
    - **Comentários:**
        1. **Buffer do stream:** 16 KB para leituras mais volumosas.
        2. **Buffer de trabalho:** 8 KB no laço de cópia, equilibrando memória e throughput.
        3. **`try-with-resources`:** garante fechamento automático e liberação de recursos.
    
    ```java
    import java.io.*;
    
    public class MarkResetExample {
        public static void main(String[] args) throws IOException {
            byte[] data = "Exemplo de dados em memória".getBytes();
            try (BufferedInputStream in = new BufferedInputStream(new ByteArrayInputStream(data))) {
                in.mark(data.length);
                byte[] first = in.readNBytes(10);     // lê os 10 primeiros bytes
                System.out.println(new String(first));
                in.reset();                            // volta ao início
                byte[] all = in.readAllBytes();       // lê tudo de novo
                System.out.println(new String(all));
            }
        }
    }
    
    ```
    
    - **Uso real:** parser de protocol­os que precisa inspecionar cabeçalhos sem descartar dados.
5. **Informações Adicionais**
    - Para arquivos muito grandes ou processamento paralelo, considere a API NIO.2 (`Files.newInputStream` + `ByteBuffer`).
    - Em aplicações de alta performance, avalie também usar `DirectByteBuffer` e canais (`FileChannel`).
    - Em streams de rede, combine com `BufferedReader`/`InputStreamReader` para leitura eficiente de caracteres.
6. **Referências para Estudo Independente**
    - [Documentação oficial Java SE 17 – BufferedInputStream](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/BufferedInputStream.html)
    - Baeldung: “Guide to BufferedInputStream in Java” — [https://www.baeldung.com/java-buffered-input-stream](https://www.baeldung.com/java-buffered-input-stream)
    - Livro *“Java I/O”* de Elliotte Rusty Harold (O’Reilly)
    - Artigo Oracle: “Understanding Java I/O” — [https://www.oracle.com/technical-resources/articles/javase/index-137112.html](https://www.oracle.com/technical-resources/articles/javase/index-137112.html)