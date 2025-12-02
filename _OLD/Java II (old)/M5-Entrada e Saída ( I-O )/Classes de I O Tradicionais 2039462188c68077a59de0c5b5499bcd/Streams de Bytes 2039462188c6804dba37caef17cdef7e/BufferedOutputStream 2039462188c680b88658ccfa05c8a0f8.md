# BufferedOutputStream

1. **Introdução**
    - **Visão Geral:**`BufferedOutputStream` faz parte do pacote `java.io` e serve como um **filtro** para um `OutputStream` subjacente, armazenando dados em um buffer interno antes de enviá-los em lote.
    - **Relevância e Importância:**
        - **Desempenho:** Reduz o número de chamadas de sistema (`write()` no disco, rede etc.), agrupando vários bytes em uma única operação.
        - **Eficiência:** Ideal para cenários com muitas escritas pequenas, evitando overhead elevado.
    - **Definição e Conceitos Fundamentais:**
        - **Tema Principal:** `BufferedOutputStream` — classe de bufferização de saída.
        - **Subtemas:**
            - Tamanho do buffer (`buffer size`)
            - Encadeamento de streams (chaining)
            - Gerenciamento de recursos (flush / close)
        - **Para que servem:** Otimizar operações de I/O, garantindo throughput maior e latência menor em escritas repetitivas.
2. **Sumário**
    1. Conteúdo Detalhado
        1. Sintaxe e Estrutura
        2. Componentes Principais
        3. Restrições de Uso
    2. Exemplos de Código Otimizados
    3. Informações Adicionais
    4. Referências para Estudo Independente
3. **Conteúdo Detalhado**
    
    ### 3.1 Sintaxe e Estrutura
    
    ```java
    public class BufferedOutputStream extends FilterOutputStream {
        private static int DEFAULT_BUFFER_SIZE = 8192;
        protected byte[] buf;
        protected int count;
    
        public BufferedOutputStream(OutputStream out) { … }
        public BufferedOutputStream(OutputStream out, int size) { … }
        @Override
        public synchronized void write(int b) throws IOException { … }
        @Override
        public synchronized void write(byte[] b, int off, int len) throws IOException { … }
        @Override
        public void flush() throws IOException { … }
        @Override
        public void close() throws IOException { … }
    }
    
    ```
    
    - **Construtores:**
        - `BufferedOutputStream(OutputStream out)` — buffer de tamanho padrão (8 192 bytes).
        - `BufferedOutputStream(OutputStream out, int size)` — buffer customizado.
    - **Lógica Básica:**
        1. Chamada a `write()` → dados acumulados em `buf`.
        2. Quando `buf` enche ou `flush()` é invocado → descarrega todo o buffer para o stream subjacente.
    
    ### 3.2 Componentes Principais
    
    - **`buf` (byte\[]):** memória temporária que armazena dados.
    - **`count` (int):** posição de escrita atual no buffer.
    - **`write(int b)`:** armazena um único byte. Se `count == buf.length`, chama `flushBuffer()` internamente.
    - **`write(byte[] b, int off, int len)`:**
        - Se `len >= buf.length`, primeiro limpa o buffer atual e grava `b[off…off+len]` diretamente no stream subjacente.
        - Caso contrário, carrega aos poucos no `buf`.
    - **`flush()`:** descarta o conteúdo de `buf` para o `OutputStream` pai e repassa `flush()` adiante.
    - **`close()`:** chama `flush()`, depois `out.close()`.
    
    ### 3.3 Restrições de Uso
    
    - **Thread Safety:** métodos são sincronizados, mas múltiplos threads ainda podem criar contenção.
    - **Recursos:** sempre usar `flush()` (ou `close()`) para evitar perda de dados.
    - **Buffer Oversized:** buffers muito grandes consomem memória sem ganho significativo, buffers muito pequenos reduzem desempenho.
    - **Uso com Objetos Texto:** para escrever texto, prefira `BufferedWriter` — ele lida corretamente com character encoding.
4. **Exemplos de Código Otimizados**
    
    ```java
    import java.io.BufferedOutputStream;
    import java.io.FileOutputStream;
    import java.io.IOException;
    import java.nio.charset.StandardCharsets;
    
    public class BufferedExample {
        public static void main(String[] args) {
            String data = "Exemplo de escrita eficiente em Java\\n".repeat(1000);
            // try-with-resources garante flush() e close()
            try (BufferedOutputStream bos =
                     new BufferedOutputStream(
                       new FileOutputStream("saida.txt"), 16 * 1024)) {
                byte[] bytes = data.getBytes(StandardCharsets.UTF_8);
                bos.write(bytes);      // grande array, evita múltiplas chamadas
                // não é necessário chamar bos.flush() aqui
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    
    ```
    
    - **Casos de Uso Realistas:**
        - Gravar logs em lote.
        - Enviar arquivos via socket em chunks grandes.
    - **Uso Avançado:** personalizar buffer para I/O de rede, combinando com `BufferedInputStream` para cópias eficientes:
    
    ```java
    // Cópia de arquivo
    try (BufferedInputStream  bis =
             new BufferedInputStream(new FileInputStream("origem.dat"));
         BufferedOutputStream bos =
             new BufferedOutputStream(new FileOutputStream("destino.dat"))) {
        byte[] buf = new byte[4 * 1024];
        int l;
        while ((l = bis.read(buf)) != -1) {
            bos.write(buf, 0, l);
        }
    }
    
    ```
    
5. **Informações Adicionais**
    - **Alternativas NIO:** `java.nio.channels.FileChannel` com `MappedByteBuffer` pode superar `BufferedOutputStream` em throughput extremo.
    - **Monitoramento de Desempenho:** medir latência de flush e throughput de I/O quando ajustar `DEFAULT_BUFFER_SIZE`.
    - **Interação com Streams Criptografados:** ao enfileirar dados em `CipherOutputStream`, ainda é recomendado um `BufferedOutputStream` externo para agregação pré-cifração.
6. **Referências para Estudo Independente**
    - Oracle Javadoc: [`BufferedOutputStream`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/BufferedOutputStream.html)
    - Tutorial Oracle I/O: “Basic I/O” (seção de buffer streams)
    - Baeldung: [Guide to Java Buffered Streams](https://www.baeldung.com/java-buffered-streams)
    - Livro: *“Java I/O”*, Elliotte Rusty Harold (O’Reilly) — capítulos sobre bufferização e desempenho

---

Com essa estrutura, você tem desde a teoria até exemplos de aplicação real, variando do uso mais simples ao mais avançado, além de pistas de otimização e referências para se aprofundar. Espero que ajude!