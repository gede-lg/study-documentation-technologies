# FileInputStream

1. **Introdução**
    - **Visão Geral:**
    Streams de bytes em Java são canais de entrada e saída que lidam com dados em nível de byte, sem qualquer interpretação de caracteres ou codificação. O `FileInputStream` é a implementação básica de `InputStream` para leitura de arquivos do sistema de arquivos, byte a byte ou em blocos.
    - **Relevância:**
    Em aplicações de backend ou de manipulação de arquivos (transferência de imagens, leitura de arquivos binários, processamento de mídia), o uso correto de `FileInputStream` garante eficiência e controle fino sobre o fluxo de dados.
    - **Definições e Conceitos Fundamentais:**
        - **Tema Principal:** Streams de bytes – canal de leitura de dados brutos.
        - **Subtemas:**
            - *InputStream e sua hierarquia*
            - *Buffering e desempenho*
            - *Tratamento de exceções e fechamento de recursos*
        - **Para que servem:**
        — Ler arquivos binários ou texto em nível de byte;
        — Servir de base para outras streams filtradas (ex.: `BufferedInputStream`, `DataInputStream`).
2. **Sumário**
    1. Introdução
    2. Sumário
    3. Conteúdo Detalhado
        - 3.1. Sintaxe e Estrutura
        - 3.2. Componentes Principais
        - 3.3. Restrições de Uso
    4. Exemplos de Código Otimizados
        - 4.1. Leitura Simples de Arquivo
        - 4.2. Leitura com Buffer e tratamento de exceção
    5. Informações Adicionais
    6. Referências para Estudo Independente
3. **Conteúdo Detalhado**
    
    ### 3.1. Sintaxe e Estrutura
    
    ```java
    FileInputStream fis = new FileInputStream(String nomeArquivo);
    int byteLido = fis.read();             // retorna próximo byte ou -1 se EOF
    int lidos = fis.read(byte[] buffer);   // lê até buffer.length bytes
    fis.close();                           // fecha o stream e libera recursos
    
    ```
    
    - **Declaração:** `new FileInputStream(String)` ou `new FileInputStream(File)`.
    - **Métodos Principais:**
        - `int read()`
        - `int read(byte[] b)`
        - `int read(byte[] b, int off, int len)`
        - `long skip(long n)`
        - `int available()`
        - `void close()`
    
    ### 3.2. Componentes Principais
    
    - **Construtor**
        - `FileInputStream(String name)` lança `FileNotFoundException` se o arquivo não existir ou não puder ser aberto.
        - `FileInputStream(File file)` idem.
    - **read()**
        - Lê um único byte; retorna valor de 0 a 255 ou -1 no fim.
    - **read(byte\[] b)**
        - Preenche o array até seu tamanho ou até EOF; retorna números de bytes lidos.
    - **skip(long n)**
        - Avança n bytes no stream, retornando quantos foram realmente pulados.
    - **available()**
        - Indica aproximadamente quantos bytes podem ser lidos sem bloqueio.
    - **close()**
        - Libera descritor de arquivo; essencial em `finally` ou `try-with-resources`.
    
    ### 3.3. Restrições de Uso
    
    - Não é thread-safe: sincronize externamente se várias threads acessarem o mesmo `FileInputStream`.
    - Operações de leitura byte a byte são lentas; prefira leitura em blocos ou envolver em `BufferedInputStream`.
    - Sempre feche o stream para evitar vazamento de descritores de arquivo.
4. **Exemplos de Código Otimizados**
    
    ### 4.1. Leitura Simples de Arquivo
    
    ```java
    Path path = Paths.get("dados.bin");
    try (FileInputStream fis = new FileInputStream(path.toFile())) {
        int b;
        while ((b = fis.read()) != -1) {
            // processa cada byte
            System.out.printf("%02X ", b);
        }
    } catch (IOException e) {
        e.printStackTrace();
    }
    
    ```
    
    **Destaques:**
    
    - `try-with-resources` garante fechamento automático.
    - Leitura byte a byte, útil para arquivos curtos ou quando cada byte exige tratamento individual.
    
    ### 4.2. Leitura com Buffer e Tratamento de Exceção
    
    ```java
    File file = new File("imagem.png");
    byte[] buffer = new byte[4 * 1024];  // 4 KB
    int bytesRead;
    
    try (FileInputStream fis = new FileInputStream(file);
         BufferedInputStream bis = new BufferedInputStream(fis, buffer.length)) {
    
        while ((bytesRead = bis.read(buffer, 0, buffer.length)) != -1) {
            // grava no destino ou processa o bloco de bytes
            processarBloco(buffer, bytesRead);
        }
    } catch (FileNotFoundException fnfe) {
        System.err.println("Arquivo não encontrado: " + fnfe.getMessage());
    } catch (IOException ioe) {
        System.err.println("Erro de I/O: " + ioe.getMessage());
    }
    
    ```
    
    **Destaques:**
    
    - Uso de `BufferedInputStream` para reduzir chamadas de sistema e melhorar desempenho.
    - Tratamento específico de exceções.
5. **Informações Adicionais**
    - **Combinação com outras streams:**
        - `DataInputStream` (leitura de tipos primitivos),
        - `ObjectInputStream` (desserialização de objetos),
        - `CipherInputStream` (descriptografia em tempo real).
    - **Métricas de desempenho:**
        - Compare `available()` e tamanho real do arquivo para ajustar o buffer.
        - Use `Files.newInputStream()` (Java 7+) para maior flexibilidade de canais.
    - **Boas práticas:**
        - Centralize caminhos de arquivo em constantes ou configurações.
        - Valide permissões de leitura antes de instanciar.
6. **Referências para Estudo Independente**
    - Oracle Java™ SE Documentation – [`FileInputStream`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/FileInputStream.html)
    - Baeldung – “Guide to FileInputStream in Java”
    ([https://www.baeldung.com/java-file-input-stream](https://www.baeldung.com/java-file-input-stream))
    - Java Tutorials – “All About File I/O” ([https://docs.oracle.com/javase/tutorial/essential/io/](https://docs.oracle.com/javase/tutorial/essential/io/))
    - Livro: *Effective Java* (Joshua Bloch) – práticas recomendadas para I/O em Java.