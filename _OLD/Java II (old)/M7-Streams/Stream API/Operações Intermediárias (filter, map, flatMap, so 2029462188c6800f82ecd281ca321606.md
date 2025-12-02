# Operações Intermediárias (filter, map, flatMap, sorted, distinct, limit, skip)

Com certeza, Gedê! Vamos detalhar as operações intermediárias das Streams API em Java. Esse é um tópico super importante para quem busca otimizar a manipulação de dados e escrever um código mais conciso e expressivo.

## Operações Intermediárias em Streams API (Java)

### 1. Introdução

As Streams API, introduzidas no Java 8, revolucionaram a forma como processamos coleções de dados. Elas fornecem uma maneira funcional e declarativa de realizar operações em sequências de elementos. No coração da Stream API estão as operações intermediárias, que são responsáveis por transformar uma stream em outra, permitindo a construção de pipelines de processamento complexos e eficientes.

A relevância dessas operações é imensa no contexto do desenvolvimento backend, Gedê. Elas permitem que você manipule grandes volumes de dados de forma performática, escreva código mais legível e mantenha a imutabilidade dos dados, o que é crucial para sistemas escaláveis e concorrentes. Ao dominar as operações intermediárias, você pode filtrar, mapear, ordenar e limitar dados de maneira muito mais eficiente do que com loops tradicionais.

**Definição e Conceitos Fundamentais:**

As **Operações Intermediárias** são operações de transformação que retornam uma nova `Stream`. Elas são chamadas de "intermediárias" porque não produzem um resultado final diretamente; em vez disso, elas produzem uma nova stream que pode ser usada por outras operações intermediárias ou por uma operação terminal. Uma característica fundamental das operações intermediárias é que elas são **lazy** (preguiçosas), ou seja, só são executadas quando uma operação terminal é invocada. Isso otimiza o desempenho, pois as operações só são realizadas nos dados estritamente necessários.

Vamos explorar as principais operações intermediárias:

- **`filter`**: Serve para selecionar elementos de uma stream que correspondem a uma determinada condição.
- **`map`**: Serve para transformar cada elemento de uma stream em um novo elemento, de um tipo potencialmente diferente.
- **`flatMap`**: Serve para achatar uma stream de streams em uma única stream.
- **`sorted`**: Serve para ordenar os elementos de uma stream.
- **`distinct`**: Serve para remover elementos duplicados de uma stream.
- **`limit`**: Serve para truncar uma stream, retornando apenas os primeiros `n` elementos.
- **`skip`**: Serve para descartar os primeiros `n` elementos de uma stream.

### 2. Sumário

1. Introdução às Operações Intermediárias
    - Definição e Conceitos Fundamentais
2. Conteúdo Detalhado
    - `filter(Predicate<? super T> predicate)`
    - `map(Function<? super T, ? extends R> mapper)`
    - `flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)`
    - `sorted()` e `sorted(Comparator<? super T> comparator)`
    - `distinct()`
    - `limit(long maxSize)`
    - `skip(long n)`
3. Exemplos de Código Otimizados
4. Informações Adicionais
5. Referências para Estudo Independente

### 3. Conteúdo Detalhado

Todas as operações intermediárias são métodos da interface `java.util.stream.Stream`. Elas são encadeáveis, o que significa que você pode chamar várias operações intermediárias em sequência para construir pipelines de processamento complexos.

### `filter(Predicate<? super T> predicate)`

- **Função:** Retorna uma stream que consiste nos elementos da stream original que correspondem ao `Predicate` fornecido.
- **Sintaxe:** `stream.filter(elemento -> condicao)`
- **Interação:** Recebe um `Predicate` (uma interface funcional que representa uma função que aceita um argumento e retorna um booleano). A condição definida no predicate é aplicada a cada elemento da stream. Somente os elementos para os quais o predicate retorna `true` são incluídos na nova stream.

### `map(Function<? super T, ? extends R> mapper)`

- **Função:** Retorna uma stream que consiste nos resultados da aplicação da função fornecida a cada elemento da stream original.
- **Sintaxe:** `stream.map(elemento -> transformacao)`
- **Interação:** Recebe uma `Function` (uma interface funcional que representa uma função que aceita um argumento de um tipo e retorna um resultado de outro tipo). A função é aplicada a cada elemento, transformando-o no novo tipo `R`.

### `flatMap(Function<? super T, ? extends Stream<? extends R>> mapper)`

- **Função:** Retorna uma stream que consiste nos resultados da aplicação da função mapeadora fornecida a cada elemento da stream, onde cada resultado da função mapeadora é uma stream que é então "achatada" (flattened) em uma única stream.
- **Sintaxe:** `stream.flatMap(elemento -> streamDeElementos)`
- **Interação:** Diferente de `map`, que produz uma stream de resultados individuais, `flatMap` é usado quando cada elemento da stream original pode ser mapeado para *múltiplos* elementos (ou uma stream de elementos). Ele pega essas "sub-streams" e as combina em uma única stream, removendo o nível de aninhamento.

### `sorted()` e `sorted(Comparator<? super T> comparator)`

- **Função:** Retorna uma stream que consiste nos elementos da stream original, ordenados.
- **Sintaxe:**
    - `stream.sorted()`: Para elementos que implementam `Comparable`.
    - `stream.sorted(Comparator.comparing(Objeto::getPropriedade))`: Usando um `Comparator` personalizado.
- **Interação:**
    - A versão sem argumentos utiliza a ordem natural dos elementos, exigindo que eles implementem a interface `Comparable`.
    - A versão com `Comparator` permite definir uma lógica de ordenação personalizada.

### `distinct()`

- **Função:** Retorna uma stream que consiste nos elementos únicos da stream original.
- **Sintaxe:** `stream.distinct()`
- **Interação:** Remove elementos duplicados com base no método `equals()` dos objetos. Para tipos primitivos, a unicidade é baseada no valor.

### `limit(long maxSize)`

- **Função:** Retorna uma stream que consiste nos primeiros `maxSize` elementos da stream original.
- **Sintaxe:** `stream.limit(numeroDeElementos)`
- **Interação:** É uma operação de "curto-circuito", o que significa que pode parar de processar elementos assim que o número desejado for atingido, otimizando o desempenho em streams grandes.

### `skip(long n)`

- **Função:** Retorna uma stream que consiste nos elementos da stream original, descartando os primeiros `n` elementos.
- **Sintaxe:** `stream.skip(numeroDeElementos)`
- **Interação:** Pula os primeiros `n` elementos e processa os restantes.

### Restrições de uso

- **Imutabilidade da Fonte:** As operações intermediárias **não modificam** a fonte original dos dados. Elas sempre retornam uma nova `Stream`.
- **Operações Lazies:** Como mencionado, são "preguiçosas". O pipeline só é executado quando uma operação terminal é chamada.
- **Stream Consumida Apenas Uma Vez:** Uma `Stream` só pode ser consumida (ou seja, ter uma operação terminal aplicada) uma única vez. Se você tentar reutilizar a mesma stream, receberá um `IllegalStateException`.
- **Ordem de Operações:** A ordem das operações intermediárias pode afetar significativamente o desempenho e o resultado. Por exemplo, aplicar um `filter` antes de um `map` pode reduzir o número de elementos a serem mapeados, melhorando a eficiência.

### 4. Exemplos de Código Otimizados

Para ilustrar, Gedê, vamos usar uma lista de objetos `Produto`.

```java
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class Produto {
    private String nome;
    private BigDecimal preco;
    private int quantidadeEstoque;
    private String categoria;
    private List<String> tags; // Para exemplo de flatMap

    public Produto(String nome, BigDecimal preco, int quantidadeEstoque, String categoria, String... tags) {
        this.nome = nome;
        this.preco = preco;
        this.quantidadeEstoque = quantidadeEstoque;
        this.categoria = categoria;
        this.tags = Arrays.asList(tags);
    }

    public String getNome() {
        return nome;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public int getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public String getCategoria() {
        return categoria;
    }

    public List<String> getTags() {
        return tags;
    }

    @Override
    public String toString() {
        return "Produto{" +
               "nome='" + nome + '\\'' +
               ", preco=" + preco +
               ", quantidadeEstoque=" + quantidadeEstoque +
               ", categoria='" + categoria + '\\'' +
               '}';
    }

    // Equals e HashCode para distinct
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Produto produto = (Produto) o;
        return nome.equals(produto.nome) &&
               preco.equals(produto.preco) &&
               categoria.equals(produto.categoria);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(nome, preco, categoria);
    }
}

public class OperacoesIntermediariasExemplos {

    public static void main(String[] args) {
        List<Produto> produtos = Arrays.asList(
                new Produto("Notebook Gamer", new BigDecimal("7500.00"), 5, "Eletrônicos", "hardware", "jogos"),
                new Produto("Mouse Sem Fio", new BigDecimal("120.00"), 50, "Periféricos", "acessório", "ergonomia"),
                new Produto("Teclado Mecânico", new BigDecimal("350.00"), 20, "Periféricos", "hardware", "retroiluminado"),
                new Produto("Monitor Ultrawide", new BigDecimal("2000.00"), 10, "Eletrônicos", "hardware", "monitor"),
                new Produto("Fone de Ouvido", new BigDecimal("250.00"), 30, "Periféricos", "acessório", "audio"),
                new Produto("Notebook Gamer", new BigDecimal("7500.00"), 5, "Eletrônicos", "hardware", "jogos"), // Duplicado
                new Produto("Webcam HD", new BigDecimal("180.00"), 15, "Periféricos", "video", "comunicacao"),
                new Produto("Cadeira Gamer", new BigDecimal("1200.00"), 8, "Móveis", "conforto", "jogos")
        );

        System.out.println("--- Exemplos de Operações Intermediárias ---");

        // Exemplo 1: filter - Produtos com preço acima de R$ 300 e em estoque
        System.out.println("\\n1. filter: Produtos caros e em estoque (> R$300, estoque > 0)");
        produtos.stream()
                .filter(p -> p.getPreco().compareTo(new BigDecimal("300.00")) > 0 && p.getQuantidadeEstoque() > 0)
                .forEach(System.out::println);
        // Uso real: Filtrar pedidos válidos, usuários ativos, itens disponíveis.

        // Exemplo 2: map - Nomes dos produtos
        System.out.println("\\n2. map: Nomes dos produtos");
        produtos.stream()
                .map(Produto::getNome) // Ou p -> p.getNome()
                .forEach(System.out::println);
        // Uso real: Extrair IDs, converter objetos para DTOs, formatar strings.

        // Exemplo 3: flatMap - Todas as tags únicas dos produtos
        System.out.println("\\n3. flatMap: Tags únicas dos produtos");
        produtos.stream()
                .flatMap(p -> p.getTags().stream()) // Transforma cada lista de tags em uma stream de tags
                .distinct() // Garante tags únicas
                .forEach(System.out::println);
        // Uso real: Juntar listas de permissões de vários usuários, combinar múltiplos resultados de subconsultas.

        // Exemplo 4: sorted - Produtos ordenados por preço (crescente)
        System.out.println("\\n4. sorted: Produtos ordenados por preço (crescente)");
        produtos.stream()
                .sorted(Comparator.comparing(Produto::getPreco))
                .forEach(System.out::println);
        // Uso real: Ordenar resultados de busca, itens em relatórios.

        // Exemplo 5: distinct - Produtos únicos (baseado em equals e hashCode)
        System.out.println("\\n5. distinct: Produtos únicos (duplicata de 'Notebook Gamer' removida)");
        produtos.stream()
                .distinct()
                .forEach(System.out::println);
        // Uso real: Remover registros duplicados, garantir unicidade de entidades.

        // Exemplo 6: limit - Os 3 primeiros produtos por categoria "Periféricos"
        System.out.println("\\n6. limit: Os 3 primeiros produtos da categoria 'Periféricos'");
        produtos.stream()
                .filter(p -> "Periféricos".equals(p.getCategoria()))
                .limit(3)
                .forEach(System.out::println);
        // Uso real: Paginação (com skip), mostrar os top N itens, limitar resultados de busca.

        // Exemplo 7: skip - Todos os produtos exceto os 2 mais caros
        System.out.println("\\n7. skip: Todos os produtos exceto os 2 mais caros");
        produtos.stream()
                .sorted(Comparator.comparing(Produto::getPreco).reversed()) // Ordena do mais caro para o mais barato
                .skip(2) // Pula os dois primeiros (mais caros)
                .forEach(System.out::println);
        // Uso real: Paginação (com limit), ignorar cabeçalhos em arquivos, pular elementos já processados.

        // Exemplo de pipeline complexo: Nomes dos eletrônicos mais caros (top 2), em ordem alfabética
        System.out.println("\\n8. Pipeline Complexo: Nomes dos eletrônicos mais caros (top 2), em ordem alfabética");
        List<String> topEletronicos = produtos.stream()
                .filter(p -> "Eletrônicos".equals(p.getCategoria())) // Filtra eletrônicos
                .sorted(Comparator.comparing(Produto::getPreco).reversed()) // Ordena por preço decrescente
                .limit(2) // Pega os 2 mais caros
                .map(Produto::getNome) // Mapeia para os nomes
                .sorted() // Ordena os nomes alfabeticamente
                .collect(Collectors.toList()); // Coleta em uma lista
        System.out.println(topEletronicos);
        // Uso real: Relatórios customizados, dashboards de resumo, processamento em lote de dados.
    }
}

```

### 5. Informações Adicionais

- **Composição e Legibilidade:** A beleza das Streams API reside na sua capacidade de compor operações. Pipelines bem construídos são frequentemente mais legíveis do que a lógica equivalente com loops `for` tradicionais, especialmente quando se trata de múltiplas transformações e filtros.
- **Eficiência (Curto-circuito):** Algumas operações intermediárias, como `limit`, são de "curto-circuito". Isso significa que, se uma operação terminal (como `findFirst` ou `anyMatch`) não precisar processar a stream inteira, a execução pode ser interrompida mais cedo, economizando recursos.
- **Stateful vs. Stateless:**
    - **Stateless Operations (`filter`, `map`, `flatMap`, `peek`):** Não mantêm nenhum estado da stream e podem ser processadas em paralelo sem problemas.
    - **Stateful Operations (`sorted`, `distinct`, `limit`, `skip`):** Precisam manter algum estado para operar (por exemplo, `distinct` precisa saber quais elementos já foram vistos, `sorted` precisa de todos os elementos para ordená-los). Isso pode impactar a performance em streams muito grandes ou em ambientes paralelos, pois podem exigir mais memória ou um estágio de processamento extra.
- **Debugging:** Depurar pipelines de stream pode ser um pouco mais desafiador do que loops tradicionais. O método `peek()` (outra operação intermediária) pode ser útil para inspecionar os elementos em diferentes estágios do pipeline, ajudando na depuração.

```java
// Exemplo de uso de peek para depuração
produtos.stream()
        .filter(p -> p.getPreco().compareTo(new BigDecimal("200")) > 0)
        .peek(p -> System.out.println("Após filtro (Preço > 200): " + p.getNome()))
        .map(Produto::getNome)
        .peek(nome -> System.out.println("Após map (Nome): " + nome))
        .sorted()
        .forEach(System.out::println);

```

### 6. Referências para Estudo Independente

Para aprofundar seus conhecimentos em Streams API e Java, recomendo as seguintes referências, Gedê:

- **Documentação Oficial da Oracle (Java SE 17 - Stream):** Essencial para entender os detalhes de cada método.
    - [Interface Stream (Java Platform SE 17)](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html)
- **Artigo sobre Java Streams API:** Uma boa introdução e exemplos.
    - [Baeldung - Guide to Java 8 Streams](https://www.baeldung.com/java-8-streams)
- **Livro "Java 8 in Action" de Raoul-Gabriel Urma, Mario Fusco e Alan Mycroft:** Um clássico para entender a programação funcional em Java, incluindo Streams. (Procure por ele em bibliotecas ou livrarias online).
- **Vídeos e Tutoriais no YouTube:** Muitos canais de Java oferecem tutoriais excelentes sobre Streams. Busque por "Java 8 Streams Tutorial".

Espero que essa explicação detalhada ajude você a dominar as operações intermediárias, Gedê! É um conhecimento valioso para sua busca por um cargo em Go, pois muitos conceitos de programação funcional e pipelines de dados se traduzem bem entre linguagens. Qual será a próxima explicação que você gostaria, A.R.I.A?