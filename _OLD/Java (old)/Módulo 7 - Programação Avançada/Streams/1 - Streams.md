# Streams em Java

## 1. O que é e para que serve?

Streams em Java representam uma sequência de elementos e fornecem um conjunto de operações para realizar computações sobre esses elementos. Introduzidos no Java 8, Streams são uma parte chave da programação funcional no Java, permitindo processar coleções de dados de forma declarativa e eficiente.

### 2. Principais Características:

- **Não armazenam dados:** Diferentemente de coleções, Streams não armazenam elementos. Eles simplesmente transportam dados do source através de uma pipeline de operações.
- **Funcional em natureza:** As operações em Streams são geralmente expressas como expressões lambda.
- **Lazy Execution:** As operações intermediárias em Streams não são executadas até que uma operação terminal seja invocada.
- **Possibilidade de processamento paralelo:** Streams podem ser processados em paralelo para melhorar o desempenho.

## 3. Principais Métodos e Uso

### Sintaxe Geral de um Stream

```java
stream().operaçãoIntermediária1().operaçãoIntermediária2()...operaçãoTerminal();
```

### Exemplo de Criação de um Stream

```java
import java.util.Arrays;
import java.util.stream.Stream;

Stream<String> stream = Arrays.asList("a", "b", "c").stream();
```

## 4. Tipos de Operações

### `Build Operations`

Operações de construção são usadas para criar Streams.

#### Exemplos:

- `Stream.of(val1, val2, val3)`: Cria um Stream com os elementos especificados.
- `Arrays.stream(array)`: Cria um Stream a partir de um array.

### `Intermediate Operations`

Operações intermediárias transformam um Stream em outro Stream. Elas são lazy, ou seja, só são executadas quando uma operação terminal é invocada.

#### Exemplos:

- `filter(Predicate<T>)`: Retorna um Stream com elementos que correspondem ao predicado.
  
  ```java
  stream.filter(x -> x.startsWith("a"))
  ```

- `map(Function<T, R>)`: Aplica uma função a cada elemento, retornando um Stream dos resultados.
  
  ```java
  stream.map(String::toUpperCase)
  ```

- `limit(long n)`: Limita o número de elementos no Stream.
  
  ```java
  stream.limit(5)
  ```

- `sorted()`: Ordena os elementos do Stream.
  
  ```java
  stream.sorted()
  ```

### `Terminal Operations`

Operações terminais produzem um resultado ou efeito colateral. Após a execução de uma operação terminal, o Stream não pode mais ser usado.

#### Exemplos:

- `forEach(Consumer<T>)`: Executa uma ação para cada elemento do Stream.
  
  ```java
  stream.forEach(System.out::println)
  ```

- `collect(Collector<T, A, R>)`: Transforma os elementos do Stream em uma coleção diferente, como List, Set, etc.
  
  ```java
  List<String> list = stream.collect(Collectors.toList());
  ```

- `reduce(BinaryOperator<T>)`: Combina os elementos do Stream usando uma operação binária para produzir um único valor resumido.

  ```java
  Integer soma = stream.reduce(0, Integer::sum);
  ```

- `count()`: Retorna o número de elementos no Stream.

  ```java
  long count = stream.count();
  ```

- `anyMatch(Predicate<T>)`: Retorna `true` se algum dos elementos do Stream corresponder ao predicado fornecido.

  ```java
  boolean hasA = stream.anyMatch(s -> s.startsWith("A"));
  ```

## Exemplo Completo

Aqui está um exemplo completo, demonstrando a criação de um Stream, a aplicação de operações intermediárias e a execução de uma operação terminal:

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<String> items = Arrays.asList("Apple", "Banana", "Cherry", "Apricot", "Orange");

        List<String> result = items.stream() // Cria o Stream
                .filter(s -> s.startsWith("A")) // Operação intermediária: Filtra elementos
                .map(String::toUpperCase) // Operação intermediária: Converte para maiúsculas
                .sorted() // Operação intermediária: Ordena os elementos
                .collect(Collectors.toList()); // Operação terminal: Coleta os resultados em uma lista

        System.out.println(result); // Saída: [APPLE, APRICOT]
    }
}
```

Neste exemplo, um `Stream` de `String` é criado a partir de uma lista. Usamos `filter` para selecionar apenas os itens que começam com "A", `map` para converter cada item em maiúsculas, `sorted` para ordenar os itens e, finalmente, `collect` para coletar os resultados em uma nova lista.


## 5. Quando e Por Que Usar Streams Avançadas
Streams avançadas são particularmente úteis emcenários de processamento de grandes conjuntos de dados e quando é necessário realizar operações complexas de forma eficiente e concisa.


- **Processamento de Grandes Dados**: Ideal para coleções grandes onde é necessário filtrar, mapear ou executar outras operações de agregação.
- **Operações Encadeadas**: Capacidade de combinar várias operações em uma única instrução, aumentando a legibilidade e eficiência.
- **Paralelismo**: Facilita a execução de operações em paralelo, aproveitando múltiplos núcleos do processador.


## 6. Operações Intermediárias Avançadas
As operações intermediárias permitem transformações e filtros sem alterar a Stream original. São executadas de forma preguiçosa, ou seja, só são processadas quando uma operação terminal é invocada.


- **`flatMap`**: Transforma cada elemento da Stream original em zero ou mais elementos na nova Stream.
- **`distinct`**: Retorna uma Stream com elementos distintos (de acordo com o método `equals` do objeto).
- **`sorted`**: Pode receber um comparador e retorna uma nova Stream com os elementos ordenados.


### Exemplo de Código: Uso de `flatMap`
```java
List<List<String>> listOflists = Arrays.asList(
  Arrays.asList("a", "b"),
  Arrays.asList("c", "d")
);

listOflists.stream()
           .flatMap(List::stream)
           .forEach(System.out::println); // Output: a b c d
```

## 7. Operações Terminais Avançadas
As operações terminais são aquelas que produzem um resultado final, seja um objeto, um primitivo ou nenhuma saída (por exemplo, `forEach`).


- **`collect`**: Um dos métodos mais versáteis, usado para transformar uma Stream em diferentes tipos de coleções ou outras estruturas de dados.
- **`reduce`**: Usado para reduzir a Stream a um único valor, aplicando uma operação binária cumulativa.
- **`anyMatch`, `allMatch`, `noneMatch`**: Usados para verificar predicados sobre os elementos da Stream.


### Exemplo de Código: Uso de `reduce`
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int

 soma = numbers.stream().reduce(0, Integer::sum);
System.out.println(soma); // Output: 15
```

## 8. Streams Paralelas para Alta Performance
Uma das maiores vantagens das Streams em Java é a capacidade de processamento paralelo, o que pode aumentar significativamente a eficiência, especialmente em grandes conjuntos de dados.


- **Conceito de Streams Paralelas**: Utilização do modelo de Fork/Join para dividir a tarefa em várias sub-tarefas e processá-las em paralelo.
- **Uso de `parallelStream`**: Transforma uma Stream regular em uma Stream paralela.
- **Considerações de Performance**: Quando e como usar Streams paralelas para obter ganhos de performance.


### Exemplo de Código: Uso de `parallelStream`
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
int sum = numbers.parallelStream().reduce(0, Integer::sum);
System.out.println(sum); // Output pode variar devido à execução paralela
```

## 9. Boas Práticas e Armadilhas Comuns
É crucial entender as melhores práticas ao trabalhar com Streams para evitar armadilhas comuns que podem levar a resultados inesperados ou baixa performance.

- **Evitar Efeitos Colaterais**: Streams devem ser usadas de maneira "não invasiva", sem alterar os dados originais.
- **Escolha Cuidadosa entre Paralelo e Sequencial**: Nem sempre o processamento paralelo é a melhor opção.
- **Cuidado com Operações de Estado**: Operações como `distinct` e `sorted` podem ser custosas em Streams grandes.

## 10. Ordenação de Streams

### 10.1. Ordenadas
Streams que mantêm uma ordem específica. A ordenação pode ser natural (como na lista) ou customizada.

```java
stream.sorted(); // Ordena naturalmente (alfabeticamente para String)
```

### 10.2. Não Ordenadas
Streams onde a ordem dos elementos não é garantida, como em um `HashSet`.

### 10.3. Sequencial
Processa os elementos um após o outro. É o modo padrão dos Streams.

```java
stream.sequential(); // Força o stream a ser sequencial
```

### 10.4. Paralela
Divide o processamento dos elementos em múltiplas threads, útil para operações pesadas em grandes conjuntos de dados, onde a execução paralela pode melhorar a performance.

```java
stream.parallel().forEach(System.out::println); // Processa os elementos em paralelo
```

## Exemplos Práticos

Vamos explorar exemplos mais detalhados para ilustrar o uso efetivo dos Streams em Java.

### Exemplo de Uso de `map` e `reduce`

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sumOfSquares = numbers.stream()
                          .map(x -> x * x)
                          .reduce(0, Integer::sum);
System.out.println("Soma dos quadrados: " + sumOfSquares);
```

Neste exemplo, cada número na lista é primeiro mapeado para o seu quadrado, e então todos são somados.

### Exemplo de Filtragem e Coleta (`filter` e `collect`)

```java
List<String> words = Arrays.asList("apple", "banana", "cherry", "date");
List<String> result = words.stream()
                           .filter(w -> w.startsWith("b"))
                           .collect(Collectors.toList());
System.out.println("Palavras que começam com 'b': " + result);
```

Aqui, apenas as palavras que começam com "b" são filtradas e coletadas em uma nova lista.

### Exemplo de Stream Paralelo

```java
List<Integer> largeList = // imagine uma grande lista aqui
largeList.parallelStream()
         .filter(n -> n % 2 == 0)
         .forEach(System.out::println);
```

Utilizando `parallelStream`, este exemplo processa uma grande lista em paralelo, filtrando e imprimindo apenas os números pares.

## Considerações Finais

A utilização de Streams em Java traz não só benefícios em termos de eficiência e performance, mas também em clareza e concisão do código. É importante, no entanto, entender quando e como usar cada tipo de operação de Stream, bem como considerar as implicações de usar streams sequenciais versus paralelos, especialmente em ambientes multi-threaded.