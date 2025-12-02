# Operações Terminais (forEach, collect, reduce, count, min, max, sum, average, anyMatch, allMatch, noneMatch)

Com certeza, Gedê\! Vamos detalhar as Operações Terminais da Streams API em Java. Essa é uma parte super importante para quem trabalha com processamento de dados em backend, então é excelente você querer aprofundar nisso.

---

# Operações Terminais em Streams API no Java

## 1\. Introdução

A Streams API, introduzida no Java 8, revolucionou a forma como manipulamos coleções de dados, trazendo para a linguagem conceitos de programação funcional. Em vez de iterações explícitas com loops `for` ou `while`, as Streams permitem um estilo declarativo e encadeado, tornando o código mais conciso, legível e, muitas vezes, mais eficiente, especialmente em operações paralelas.

No contexto da Streams API, as operações são divididas em duas categorias principais: **operações intermediárias** e **operações terminais**. As operações intermediárias (como `filter`, `map`, `sorted`) transformam uma stream em outra stream, e são *lazy*, ou seja, só são executadas quando uma operação terminal é chamada.

As **operações terminais** são o ponto final de uma pipeline de stream. Elas consomem a stream, produzem um resultado (que pode ser um valor, uma coleção, um efeito colateral, etc.) e, após sua execução, a stream não pode ser reutilizada. É a operação terminal que, de fato, inicia o processamento dos elementos da stream. A relevância dessas operações é imensa no dia a dia de um desenvolvedor backend, pois são elas que permitem extrair informações, agregar dados, e consolidar os resultados de processamentos complexos de forma eficiente e expressiva.

### Definição e Conceitos Fundamentais:

As operações terminais são métodos da Streams API que encerram uma sequência de operações em uma stream, produzindo um resultado final. Elas são responsáveis por "gatilhar" a execução de todas as operações intermediárias e retornar algo útil para a aplicação.

## 2\. Sumário

- **Introdução às Operações Terminais**
- **Sintaxe Básica das Streams**
- **Componentes Principais: Operações Terminais Detalhadas**
    - `forEach`
    - `collect`
    - `reduce`
    - `count`
    - `min` e `max`
    - `sum` e `average` (com tipos primitivos)
    - `anyMatch`, `allMatch`, `noneMatch`
- **Restrições de Uso**
- **Exemplos de Código Otimizados**
- **Informações Adicionais**
    - Estado da Stream após Operação Terminal
    - Imutabilidade e Efeitos Colaterais
    - Paralelismo com `parallelStream()`
- **Referências para Estudo Independente**

## 3\. Conteúdo Detalhado

### Sintaxe e Estrutura:

A sintaxe básica de uma pipeline de stream envolve a criação da stream, a aplicação de zero ou mais operações intermediárias e, finalmente, uma operação terminal.

```java
// Exemplo básico da estrutura de uma stream
List<String> nomes = Arrays.asList("Alice", "Bob", "Charlie");

nomes.stream() // Cria uma stream a partir de uma coleção
     .filter(nome -> nome.startsWith("A")) // Operação intermediária (filtra)
     .forEach(System.out::println); // Operação terminal (consome os elementos e imprime)

```

### Componentes Principais: Operações Terminais Detalhadas

Vamos explorar cada uma das operações terminais mencionadas, suas funções e como interagem com os elementos da stream.

### `forEach`

- **Função:** Executa uma ação para cada elemento da stream. É uma operação *void* (não retorna nada) e é usada principalmente para efeitos colaterais, como imprimir elementos ou adicionar a outra coleção (embora `collect` seja geralmente preferível para adicionar a coleções).
- **Sintaxe:** `stream.forEach(Consumer<? super T> action)`
- **Uso:** Ideal para processamentos que não precisam retornar um valor final, como logging ou atualização de estados externos (com cautela em ambientes paralelos).

### `collect`

- **Função:** É uma das operações terminais mais poderosas e flexíveis. Ela acumula os elementos da stream em uma coleção (como `List`, `Set`, `Map`) ou em uma string, ou realiza uma sumarização complexa. Utiliza a interface `Collector`.
- **Sintaxe:** `stream.collect(Collector<? super T, A, R> collector)`
- **Componentes:** O método `collect` recebe um `Collector`, que define como os elementos da stream serão acumulados. A classe `Collectors` oferece uma série de implementações prontas para uso, como:
    - `Collectors.toList()`: Coleta os elementos em uma `List`.
    - `Collectors.toSet()`: Coleta os elementos em um `Set` (removendo duplicatas).
    - `Collectors.toMap(keyMapper, valueMapper)`: Coleta os elementos em um `Map`.
    - `Collectors.joining()`: Concatena os elementos em uma `String`.
    - `Collectors.groupingBy()`: Agrupa os elementos por uma chave.
    - `Collectors.partitioningBy()`: Particiona os elementos em dois grupos (true/false) com base em um predicado.
    - `Collectors.counting()`, `Collectors.summingInt()`, `Collectors.reducing()`: Para operações de sumarização e agregação.

### `reduce`

- **Função:** Realiza uma operação de redução nos elementos da stream para produzir um único resultado. É útil para somar, multiplicar, encontrar o maior/menor, ou concatenar strings. É uma operação flexível que permite definir a lógica de agregação.
- **Sintaxe:** Existem três variações:
    1. `Optional<T> reduce(BinaryOperator<T> accumulator)`: Não tem valor inicial. Retorna um `Optional` para lidar com streams vazias.
    2. `T reduce(T identity, BinaryOperator<T> accumulator)`: Tem um valor inicial (`identity`). Retorna o valor final (não `Optional`).
    3. `<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner)`: Para operações paralelas, onde o `combiner` combina os resultados parciais.
- **Componentes:**
    - `identity`: O valor inicial da redução.
    - `accumulator`: Uma função que combina um resultado parcial com o próximo elemento da stream.
    - `combiner`: Uma função (usada em streams paralelas) que combina os resultados de diferentes sub-reduções.

### `count`

- **Função:** Retorna o número de elementos na stream.
- **Sintaxe:** `stream.count()`
- **Uso:** Equivalente a obter o tamanho de uma coleção após filtragens e transformações.

### `min` e `max`

- **Função:** Retorna o menor (`min`) ou o maior (`max`) elemento da stream, com base em um `Comparator` fornecido.
- **Sintaxe:**
    - `Optional<T> min(Comparator<? super T> comparator)`
    - `Optional<T> max(Comparator<? super T> comparator)`
- **Uso:** Útil para encontrar extremos em coleções de objetos ou tipos numéricos. Retornam um `Optional` para lidar com streams vazias.

### `sum` e `average` (com tipos primitivos)

- **Função:** Essas operações estão disponíveis nas streams de tipos primitivos (`IntStream`, `LongStream`, `DoubleStream`) após uma operação de mapeamento como `mapToInt`, `mapToLong`, `mapToDouble`.
    - `sum()`: Retorna a soma dos elementos.
    - `average()`: Retorna a média dos elementos (como `OptionalDouble` para lidar com stream vazia).
- **Sintaxe:**
    - `intStream.sum()`
    - `doubleStream.average()`

### `anyMatch`, `allMatch`, `noneMatch`

- **Função:** Realizam verificações lógicas sobre os elementos da stream com base em um `Predicate`. Retornam um `boolean`.
    - `anyMatch(Predicate<? super T> predicate)`: Retorna `true` se *qualquer* elemento na stream corresponder ao predicado.
    - `allMatch(Predicate<? super T> predicate)`: Retorna `true` se *todos* os elementos na stream corresponderem ao predicado.
    - `noneMatch(Predicate<? super T> predicate)`: Retorna `true` se *nenhum* elemento na stream corresponder ao predicado.
- **Uso:** Úteis para validações e verificações de existência ou conformidade. São operações de "curto-circuito" – param a execução assim que o resultado é determinado.

### Restrições de Uso

- **Consumo Único:** Uma stream só pode ser consumida por uma única operação terminal. Após a execução de uma operação terminal, a stream é "fechada" e não pode ser reutilizada. Se tentar usá-la novamente, receberá um `IllegalStateException`.
- **Ordem:** As operações intermediárias são *lazy* e só são executadas quando uma operação terminal é chamada. A ordem das operações intermediárias pode impactar significativamente a performance.
- **Efeitos Colaterais com `forEach`:** Embora `forEach` permita efeitos colaterais, deve ser usado com cautela, especialmente em streams paralelas, pois a ordem de execução não é garantida, o que pode levar a resultados inesperados ou inconsistentes se houver modificação de estado compartilhado. Para agregação, `collect` ou `reduce` são preferíveis.

## 4\. Exemplos de Código Otimizados

Vamos ver exemplos práticos e comentados para cada operação terminal, simulando cenários do dia a dia de um desenvolvedor backend.

```java
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Comparator;

// Uma classe simples para simular um Produto em um e-commerce
class Produto {
    private String nome;
    private double preco;
    private String categoria;
    private int estoque;

    public Produto(String nome, double preco, String categoria, int estoque) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.estoque = estoque;
    }

    public String getNome() { return nome; }
    public double getPreco() { return preco; }
    public String getCategoria() { return categoria; }
    public int getEstoque() { return estoque; }

    @Override
    public String toString() {
        return "Produto{nome='" + nome + "', preco=" + preco + ", categoria='" + categoria + "', estoque=" + estoque + '}';
    }
}

public class OperacoesTerminaisExemplo {

    public static void main(String[] args) {
        List<Produto> produtos = Arrays.asList(
            new Produto("Notebook Gamer", 7500.00, "Eletrônicos", 10),
            new Produto("Mouse Sem Fio", 120.00, "Eletrônicos", 50),
            new Produto("Teclado Mecânico", 300.00, "Eletrônicos", 25),
            new Produto("Monitor Curvo", 1500.00, "Eletrônicos", 15),
            new Produto("Camiseta Estampada", 70.00, "Vestuário", 100),
            new Produto("Calça Jeans", 150.00, "Vestuário", 80),
            new Produto("Bola de Futebol", 90.00, "Esportes", 30),
            new Produto("Raquete de Tênis", 250.00, "Esportes", 12)
        );

        System.out.println("--- Exemplos de Operações Terminais ---");

        // 1. forEach: Imprimir o nome de todos os produtos
        System.out.println("\\n1. ForEach: Nomes de todos os produtos:");
        produtos.stream()
                .map(Produto::getNome) // Operação intermediária: mapeia para o nome
                .forEach(nome -> System.out.println("- " + nome)); // Operação terminal: imprime cada nome

        // 2. collect (toList): Coletar todos os produtos de Eletrônicos em uma nova lista
        System.out.println("\\n2. Collect (toList): Produtos Eletrônicos:");
        List<Produto> eletronicos = produtos.stream()
                                            .filter(p -> p.getCategoria().equals("Eletrônicos")) // Filtra
                                            .collect(Collectors.toList()); // Coleta em uma lista
        eletronicos.forEach(System.out::println);

        // 3. collect (toSet): Coletar todas as categorias únicas
        System.out.println("\\n3. Collect (toSet): Categorias únicas:");
        Set<String> categoriasUnicas = produtos.stream()
                                               .map(Produto::getCategoria) // Mapeia para a categoria
                                               .collect(Collectors.toSet()); // Coleta em um conjunto (set)
        System.out.println(categoriasUnicas);

        // 4. collect (toMap): Mapear produtos por nome (simulando um índice rápido)
        // Cuidado com chaves duplicadas! Aqui assumimos nomes únicos.
        System.out.println("\\n4. Collect (toMap): Produtos mapeados por nome:");
        Map<String, Produto> produtosPorNome = produtos.stream()
                                                    .collect(Collectors.toMap(Produto::getNome, p -> p)); // Chave: nome, Valor: próprio produto
        System.out.println(produtosPorNome.get("Notebook Gamer"));

        // 5. collect (groupingBy): Agrupar produtos por categoria
        System.out.println("\\n5. Collect (groupingBy): Produtos agrupados por categoria:");
        Map<String, List<Produto>> produtosPorCategoria = produtos.stream()
                                                                  .collect(Collectors.groupingBy(Produto::getCategoria));
        produtosPorCategoria.forEach((categoria, lista) -> {
            System.out.println("  Categoria: " + categoria);
            lista.forEach(p -> System.out.println("    - " + p.getNome()));
        });

        // 6. reduce (soma de preços): Calcular o valor total em estoque (preço * estoque)
        System.out.println("\\n6. Reduce (soma de preços): Valor total do estoque:");
        Optional<Double> valorTotalEstoque = produtos.stream()
                                                    .map(p -> p.getPreco() * p.getEstoque()) // Mapeia para o valor de cada item em estoque
                                                    .reduce(Double::sum); // Reduz somando todos os valores (ou (a, b) -> a + b)
        valorTotalEstoque.ifPresent(total -> System.out.printf("Valor total: R$ %.2f%n", total));

        // 7. count: Contar quantos produtos estão em estoque baixo (menos de 20 unidades)
        System.out.println("\\n7. Count: Produtos com estoque baixo:");
        long produtosEstoqueBaixo = produtos.stream()
                                            .filter(p -> p.getEstoque() < 20) // Filtra produtos com estoque baixo
                                            .count(); // Conta
        System.out.println("Número de produtos com estoque baixo: " + produtosEstoqueBaixo);

        // 8. min: Encontrar o produto mais barato
        System.out.println("\\n8. Min: Produto mais barato:");
        Optional<Produto> produtoMaisBarato = produtos.stream()
                                                    .min(Comparator.comparing(Produto::getPreco)); // Encontra o mínimo baseado no preço
        produtoMaisBarato.ifPresent(p -> System.out.println("Produto mais barato: " + p.getNome() + " - R$" + p.getPreco()));

        // 9. max: Encontrar o produto mais caro
        System.out.println("\\n9. Max: Produto mais caro:");
        Optional<Produto> produtoMaisCaro = produtos.stream()
                                                    .max(Comparator.comparing(Produto::getPreco)); // Encontra o máximo baseado no preço
        produtoMaisCaro.ifPresent(p -> System.out.println("Produto mais caro: " + p.getNome() + " - R$" + p.getPreco()));

        // 10. sum (com IntStream): Calcular a soma do estoque total de todos os produtos
        System.out.println("\\n10. Sum (IntStream): Estoque total de produtos:");
        int estoqueTotal = produtos.stream()
                                  .mapToInt(Produto::getEstoque) // Mapeia para um IntStream de estoques
                                  .sum(); // Soma todos os estoques
        System.out.println("Estoque total de produtos: " + estoqueTotal);

        // 11. average (com DoubleStream): Calcular o preço médio dos produtos
        System.out.println("\\n11. Average (DoubleStream): Preço médio dos produtos:");
        OptionalDouble precoMedio = produtos.stream()
                                            .mapToDouble(Produto::getPreco) // Mapeia para um DoubleStream de preços
                                            .average(); // Calcula a média
        precoMedio.ifPresent(avg -> System.out.printf("Preço médio dos produtos: R$ %.2f%n", avg));

        // 12. anyMatch: Verificar se existe algum produto com preço acima de R$ 5000
        System.out.println("\\n12. AnyMatch: Existe produto acima de R$ 5000?");
        boolean existeProdutoCaro = produtos.stream()
                                            .anyMatch(p -> p.getPreco() > 5000.00); // Verifica se algum corresponde
        System.out.println("Existe produto acima de R$ 5000: " + existeProdutoCaro);

        // 13. allMatch: Verificar se todos os produtos têm estoque maior que 0
        System.out.println("\\n13. AllMatch: Todos os produtos têm estoque > 0?");
        boolean todosComEstoque = produtos.stream()
                                        .allMatch(p -> p.getEstoque() > 0); // Verifica se todos correspondem
        System.out.println("Todos os produtos têm estoque > 0: " + todosComEstoque);

        // 14. noneMatch: Verificar se não existe nenhum produto com preço negativo (validar dados)
        System.out.println("\\n14. NoneMatch: Nenhum produto com preço negativo?");
        boolean nenhumPrecoNegativo = produtos.stream()
                                            .noneMatch(p -> p.getPreco() < 0); // Verifica se nenhum corresponde
        System.out.println("Nenhum produto com preço negativo: " + nenhumPrecoNegativo);

        // Exemplo avançado com reduce: Concatenar nomes de produtos em uma string separada por vírgula
        System.out.println("\\nExemplo avançado com reduce: Nomes de produtos concatenados:");
        String nomesConcatenados = produtos.stream()
                                        .map(Produto::getNome)
                                        .reduce("", (acumulador, nome) -> acumulador.isEmpty() ? nome : acumulador + ", " + nome);
        System.out.println(nomesConcatenados);

        // Exemplo com collect para sumarização (Contar total de estoque por categoria)
        System.out.println("\\nExemplo avançado com collect: Total de estoque por categoria:");
        Map<String, Integer> estoquePorCategoria = produtos.stream()
            .collect(Collectors.groupingBy(Produto::getCategoria,
                                          Collectors.summingInt(Produto::getEstoque))); // Agrupa e soma o estoque
        System.out.println(estoquePorCategoria);
    }
}

```

## 5\. Informações Adicionais

### Estado da Stream após Operação Terminal

É fundamental lembrar que uma stream é um recurso que pode ser consumido apenas uma vez. Uma vez que uma operação terminal é executada, a stream é considerada *consumida* ou *fechada*. Tentar realizar outra operação (intermediária ou terminal) na mesma instância de stream resultará em um `java.lang.IllegalStateException`. Se você precisar processar os mesmos dados novamente, deverá criar uma nova stream a partir da fonte de dados original.

```java
List<String> frutas = Arrays.asList("Maçã", "Banana", "Uva");
Stream<String> streamDeFrutas = frutas.stream();

streamDeFrutas.forEach(System.out::println); // Ok, stream consumida

// Tentar usar a mesma stream novamente causará um erro:
// streamDeFrutas.count(); // Lançará IllegalStateException

```

### Imutabilidade e Efeitos Colaterais

Uma das grandes vantagens da programação funcional e, consequentemente, da Streams API, é a ênfase na **imutabilidade** e a minimização de **efeitos colaterais**. As operações intermediárias e a maioria das operações terminais (como `collect`, `reduce`, `min`, `max`) operam sobre os dados sem modificá-los, produzindo novos resultados.

O método `forEach` é a principal exceção a essa regra, pois ele permite a execução de um `Consumer` que pode, sim, gerar efeitos colaterais (e.g., modificar uma variável externa, imprimir na console, atualizar um banco de dados). Embora útil, o uso de `forEach` para modificar estado compartilhado em streams paralelas é arriscado devido à ausência de garantia de ordem de execução e necessidade de sincronização manual, o que pode levar a `Race Conditions` e resultados inconsistentes. Para agregação ou transformação que resulta em uma nova coleção, `collect` é quase sempre a opção mais segura e idiomática.

### Paralelismo com `parallelStream()`

A Streams API oferece suporte nativo a paralelismo através do método `parallelStream()`. Ao invocar `parallelStream()` em uma coleção, as operações da pipeline serão executadas em paralelo, aproveitando múltiplos núcleos do processador.

```java
List<Long> numerosGrandes = new Random().longs(1_000_000).boxed().collect(Collectors.toList());

// Soma em paralelo - ideal para processamento intensivo de dados
long somaParalela = numerosGrandes.parallelStream()
                                .mapToLong(Long::longValue)
                                .sum();
System.out.println("Soma paralela: " + somaParalela);

```

As operações terminais são projetadas para funcionar bem em ambientes paralelos. `collect` e `reduce` são particularmente otimizados para isso, usando o `combiner` para mesclar resultados parciais. No entanto, o paralelismo não é uma bala de prata: para pequenas coleções, a sobrecarga de gerenciar threads pode tornar o processamento paralelo mais lento que o sequencial. É importante testar e perfilar para determinar se o paralelismo é benéfico para um caso de uso específico.

## 6\. Referências para Estudo Independente

Para aprofundar seu conhecimento sobre a Streams API e suas operações terminais, Gedê, recomendo os seguintes recursos:

- **Documentação Oficial do Java:**
    - [Pacote `java.util.stream`](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/package-summary.html%5C)) (Você pode ajustar a versão do Java no link para a que estiver estudando, por exemplo, 21 ou a mais recente).
    - [Interface `Stream`](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html%5C))
    - [Classe `Collectors`](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html%5D%5C(https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html%5C))
- **Oracle Java Tutorials:**
    - [Aggregate Operations](https://docs.oracle.com/javase/tutorial/collections/streams/index.html) (Seção sobre Streams e Lambdas)
- **Artigos e Livros (Buscar versões atualizadas):**
    - **"Java 8 in Action"** por Raoul-Gabriel Urma, Mario Fusco e Alan Mycroft: Excelente livro que dedica boa parte às Streams e programação funcional no Java. É um clássico para entender o Java 8+.
    - Artigos em blogs de referência como **Baeldung**, **GeeksforGeeks**, **JournalDev** sobre "Java 8 Streams Terminal Operations".

Estudar a fundo essas operações é fundamental, especialmente para sua transição para Go, pois muitos conceitos de processamento de dados e programação funcional são universais entre linguagens modernas de backend.

Se precisar de mais alguma explicação ou exemplo, é só pedir, Gedê\!