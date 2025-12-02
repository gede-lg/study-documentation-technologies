# Path e Files: Manipulação de arquivos e diretórios de forma moderna

1. **Introdução**
    - **Visão Geral:** O NIO (New I/O) introduzido no Java 7 (pacote `java.nio.file`) oferece uma forma moderna, mais flexível e performática de interagir com o sistema de arquivos em comparação às classes tradicionais de I/O (`File` e `FileInputStream`/`FileOutputStream`).
    - **Relevância:** Em aplicações reais, lidar com arquivos e diretórios de forma robusta—por exemplo, copiar grandes quantidades de dados, percorrer estruturas complexas ou reagir dinamicamente a alterações em disco—é crítico. O API NIO.2 (`Path` e `Files`) resolve muitas limitações do I/O clássico, facilitando tratamento de exceções, operações atômicas e manipulação recursiva.
    - **Definições Fundamentais:**
        - **Tema Principal:** “NIO – Path e Files” refere-se às classes centrais para modelar caminhos de arquivo (`Path`) e executar operações neles (`Files`).
        - **Subtemas:**
            - Criação e resolução de caminhos (`Path`, `Paths`)
            - Operações de alto nível (`Files.copy`, `Files.move`, `Files.delete`)
            - Iteração e busca recursiva (`Files.walk`, `Files.find`)
            - Metadados e atributos de arquivos (`BasicFileAttributes`)
        - **Para que servem:** cada subtema auxilia o desenvolvedor a realizar uma tarefa comum com arquivos/diretórios, preservando legibilidade e eficiência.
2. **Sumário**
    1. **Path e Paths**
    2. **Files – Operações Básicas**
    3. **Listagem e Busca Recursiva**
    4. **Atributos e Metadados**
    5. **Tratamento de Exceções e Átomos**
    6. **Exemplos de Código Otimizados**
    7. **Informações Adicionais**
    8. **Referências para Estudo Independente**
3. **Conteúdo Detalhado**
    
    ### 3.1 Sintaxe e Estrutura
    
    - **`Path`**: representa um caminho abstrato no file system. Não é um arquivo em si, apenas o endereço.
        
        ```java
        Path p1 = Paths.get("docs/report.txt");   // relativo ao diretório de trabalho
        Path p2 = Paths.get("/home/user/images"); // absoluto no Unix
        
        ```
        
    - **`Paths`**: classe utilitária para criar instâncias de `Path`.
    - **`Files`**: contém métodos estáticos para ler, escrever, copiar, mover, deletar e consultar metadados.
    
    ### 3.2 Componentes Principais
    
    | Classe / Interface | Papel |
    | --- | --- |
    | `Path` | Abstração de caminho; métodos para navegação e resolução (`resolve`, `normalize`). |
    | `Paths` | Fábrica de `Path` via `get(...)`. |
    | `Files` | Operações de I/O (cópia, leitura, escrita, deleção). |
    | `BasicFileAttributes` | Consulta atributos como tamanho, data de modificação. |
    | `FileVisitor<T>` | Interface para percorrer árvore de diretórios. |
    | `SimpleFileVisitor<T>` | Implementação base de `FileVisitor` para sobrescrever apenas métodos necessários. |
    
    ### 3.2.1 Navegação e Resolução
    
    - **`resolve(Path other)`**: junta dois caminhos.
    - **`normalize()`**: remove `.` e `..`.
    - **`relativize(Path other)`**: caminho relativo de um `Path` para outro.
    
    ### 3.2.2 Operações de Arquivo
    
    - **Leitura/Escrita:**
        
        ```java
        byte[] data = Files.readAllBytes(p1);
        List<String> lines = Files.readAllLines(p1, StandardCharsets.UTF_8);
        Files.write(p1, List.of("linha 1","linha 2"), StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        
        ```
        
    - **Cópia/Movimentação:**
        
        ```java
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
        Files.move(source, target, StandardCopyOption.ATOMIC_MOVE);
        
        ```
        
    - **Excluir:**
        
        ```java
        Files.delete(path);
        // ou
        Files.deleteIfExists(path);
        
        ```
        
    
    ### 3.2.3 Listagem e Busca Recursiva
    
    - **`Files.list(Path dir)`**: retorna `Stream<Path>` com arquivos e subdiretórios (não recursivo).
    - **`Files.walk(Path start, int maxDepth)`**: percorre recursivamente até a profundidade indicada.
    - **`Files.find(Path start, int maxDepth, BiPredicate<Path,BasicFileAttributes> filter)`**: busca condicional.
    
    ### 3.2.4 Atributos e Metadados
    
    - **`Files.getAttribute(path, "basic:size")`** ou usando `BasicFileAttributes`:
        
        ```java
        BasicFileAttributes attr = Files.readAttributes(path, BasicFileAttributes.class);
        long size = attr.size();
        FileTime modified = attr.lastModifiedTime();
        boolean isDir = attr.isDirectory();
        
        ```
        
    
    ### 3.3 Restrições de Uso
    
    - Operações `ATOMIC_MOVE` podem falhar em sistemas de arquivos que não suportem moves atômicos.
    - `Files.readAllBytes` carrega tudo na memória; evite para arquivos muito grandes—prefira `Files.newInputStream` e processar em chunks.
    - Streams retornados por `Files.list` e `Files.walk` devem ser fechados (use try-with-resources).
4. **Exemplos de Código Otimizados**
    
    ```java
    import java.nio.file.*;
    import java.nio.file.attribute.BasicFileAttributes;
    import java.io.IOException;
    import java.util.stream.Stream;
    
    public class FileUtils {
    
        /**
         * Copia todos os arquivos .txt de um diretório para outro, mantendo estrutura.
         */
        public static void copyTextFiles(Path src, Path dst) throws IOException {
            try (Stream<Path> stream = Files.walk(src)) {
                stream
                  .filter(p -> p.toString().endsWith(".txt"))
                  .forEach(p -> {
                      Path relative = src.relativize(p);
                      Path target = dst.resolve(relative);
                      try {
                          Files.createDirectories(target.getParent());
                          Files.copy(p, target, StandardCopyOption.REPLACE_EXISTING);
                      } catch (IOException e) {
                          throw new UncheckedIOException(e);
                      }
                  });
            }
        }
    
        /**
         * Busca um arquivo por nome, até profundidade 5.
         */
        public static Path findFile(Path start, String filename) throws IOException {
            try (Stream<Path> found = Files.find(start, 5,
                    (path, attrs) -> attrs.isRegularFile() && path.getFileName().toString().equals(filename))) {
                return found.findFirst().orElse(null);
            }
        }
    
        /**
         * Exemplo de leitura streaming de um grande arquivo.
         */
        public static void processLargeFile(Path file) throws IOException {
            try (var in = Files.newBufferedReader(file)) {
                String line;
                while ((line = in.readLine()) != null) {
                    // processar linha
                }
            }
        }
    }
    
    ```
    
5. **Informações Adicionais**
    - **Watch Service:** API de observação de mudanças em diretórios (`FileSystem.newWatchService()`), útil para reload dinâmico.
    - **FileChannel e MappedByteBuffer:** Para I/O de alta performance em arquivos grandes.
    - **Permissões e ACLs:** Pacote `java.nio.file.attribute` permite manipular permissões POSIX e ACLs em sistemas suportados.
6. **Referências para Estudo Independente**
    - Oracle — *Path API* e *Files API* (documentação oficial):
    [https://docs.oracle.com/javase/8/docs/api/java/nio/file/Path.html](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Path.html)[https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html)
    - Baeldung — *Guide to Java NIO.2*:
    [https://www.baeldung.com/java-nio2](https://www.baeldung.com/java-nio2)
    - *Java: The Complete Reference* (Herbert Schildt) — capítulos sobre NIO.2
    - *Java NIO* (O’Reilly) — para aprofundar em canais e buffers.