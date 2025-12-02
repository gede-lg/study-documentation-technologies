# Files.walk, Files.list, Files.find

**1. Introdução**

O **NIO.2** (New I/O API), introduzido no Java 7, modernizou a forma de trabalhar com sistema de arquivos, oferecendo alta performance, operações não‐bloqueantes e uma API fluida baseada em **Paths** e **Streams**. Dentro desse universo, as classes utilitárias em `java.nio.file.Files` — notadamente os métodos `walk`, `list` e `find` — permitem percorrer diretórios de forma declarativa, filtrar conteúdo e reagir a enormes árvores de arquivos sem a complexidade de loops aninhados.

- **Relevância**: em aplicações reais (por exemplo, ferramentas de build, servidores que observam mudanças em pastas ou utilitários de backup), percorrer e filtrar arquivos de forma eficiente é fundamental para escalabilidade e manutenibilidade.
- **Definição de termos**:
    - **Tema principal**: “NIO – Files.walk, Files.list, Files.find” — são métodos para gerar *Streams* de caminhos do sistema de arquivos.
    - **Subtemas**: profundidade de busca, filtros por predicado e controle de recursos (fechamento automático do *stream*).

---

## 2. Sumário

1. **Sintaxe e Estrutura**
2. **Componentes Principais**
3. **Restrições de Uso**
4. **Exemplos de Código Otimizados**
5. **Informações Adicionais**
6. **Referências para Estudo Independente**

---

## 3. Conteúdo Detalhado

### Sintaxe e Estrutura

- Todos retornam um `Stream<Path>` que deve ser fechado (ou usado com *try-with-resources*).
- **`Files.list(Path dir)`**
    
    ```java
    Stream<Path> stream = Files.list(dir);
    
    ```
    
    — lista apenas o conteúdo direto de `dir` (profundidade = 1).
    
- **`Files.walk(Path start, int maxDepth)`**
    
    ```java
    Stream<Path> stream = Files.walk(start, maxDepth);
    
    ```
    
    — caminha recursivamente até `maxDepth`; padrão é profundidade ilimitada se omitido.
    
- **`Files.find(Path start, int maxDepth, BiPredicate<Path,BasicFileAttributes> matcher)`**
    
    ```java
    Stream<Path> stream = Files.find(start, maxDepth, (path, attrs) -> /*condição*/);
    
    ```
    
    — combina varredura com filtro, usando informações de atributos de arquivo.
    

### Componentes Principais

- **`Path`**: representação abstrata de caminho de arquivo/diretório.
- **`Stream<Path>`**: pipeline que pode aplicar filtros (`filter`), mapeamentos (`map`), ordenações e coletores (`collect`).
- **`BasicFileAttributes`**: metadados de sistema de arquivos (tamanho, tipo, timestamps).

Interação típica:

1. **Abrir** o stream.
2. **Filtrar** ou **mapear** conforme necessidade.
3. **Coletar** (`Collectors.toList()`, etc.) ou **processar** com `forEach`.
4. **Fechar** o stream (garantido por *try-with-resources*).

### Restrições de uso

- Streams devem ser usados uma única vez; após terminal operation, tornam-se inválidos.
- Uso intensivo em sistemas de arquivos muito grandes pode consumir muita memória se não filtrado cedo.
- Permissões de leitura no diretório impactam diretamente no sucesso da operação.

---

## 4. Exemplos de Código Otimizados

```java
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.List;
import java.util.stream.Collectors;

public class NioExamples {

    // 1. Lista todos os arquivos/diretórios diretos (profundidade = 1)
    public static List<Path> listRoot(Path root) throws IOException {
        try (Stream<Path> stream = Files.list(root)) {
            return stream
                .filter(Files::isRegularFile)
                .collect(Collectors.toList());
        }
    }

    // 2. Varredura recursiva até profundidade 3
    public static List<Path> walkTree(Path start) throws IOException {
        try (Stream<Path> stream = Files.walk(start, 3)) {
            return stream
                .filter(p -> p.toString().endsWith(".java"))
                .collect(Collectors.toList());
        }
    }

    // 3. Encontrar arquivos grandes (>1MB) usando find
    public static List<Path> findLargeFiles(Path start) throws IOException {
        return Files.find(start, Integer.MAX_VALUE,
                (path, attrs) -> attrs.isRegularFile() && attrs.size() > 1_000_000)
            .collect(Collectors.toList());
    }

    // Demo de uso
    public static void main(String[] args) throws IOException {
        Path projectDir = Paths.get("src");
        System.out.println("Java files (profundidade 3):");
        walkTree(projectDir).forEach(System.out::println);

        System.out.println("\\nArquivos > 1MB:");
        findLargeFiles(projectDir).forEach(System.out::println);
    }
}

```

> Boas práticas aplicadas:
> 
> - Uso de *try-with-resources* para fechar os streams.
> - Filtragem precoce para reduzir carga de memória.
> - Uso de `Integer.MAX_VALUE` para profundidade ilimitada quando apropriado.

---

## 5. Informações Adicionais

- Para observação **dinâmica** de arquivos em tempo real, explore o `WatchService` (também em `java.nio.file`).
- Em cenários de alto desempenho, considere limitar profundidade ou combinar `find` com pré-filtros de nome para evitar leitura de atributos de todos os arquivos.
- Em ambientes Windows, paths muito profundos podem exigir prefixo `\\\\?\\`; use `Path.toAbsolutePath()` e verifique limites de caminho.

---

## 6. Referências para Estudo Independente

- **Documentação Oracle** – *The Java™ Tutorials: NIO.2*[https://docs.oracle.com/javase/tutorial/essential/io/fileio.html](https://docs.oracle.com/javase/tutorial/essential/io/fileio.html)
- **Java SE 8 API** – `java.nio.file.Files`[https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html](https://docs.oracle.com/javase/8/docs/api/java/nio/file/Files.html)
- **Artigo Baeldung** – “Walking a File Tree with Java NIO.2”
[https://www.baeldung.com/java-nio2-file-walk](https://www.baeldung.com/java-nio2-file-walk)
- **Livro “Java 8 in Action”** – Capítulo sobre Streams e NIO.2