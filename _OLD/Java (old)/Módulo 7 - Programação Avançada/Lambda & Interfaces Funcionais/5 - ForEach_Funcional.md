## O que é e para que serve?

No Java, `forEach` é um método disponível nas interfaces `Iterable` e `Stream` que permite iterar sobre elementos de uma coleção ou stream e executar uma operação definida em cada elemento. Este método aceita uma instância de `Consumer`, que é uma interface funcional que representa uma operação que recebe um único argumento e não retorna nenhum resultado.

## Padrão de entrada e saída

O método `forEach` utiliza a interface funcional `Consumer`. A interface `Consumer` possui a seguinte assinatura funcional:

- **Entrada:** Um argumento genérico `T`.
- **Saída:** Nenhuma saída (void).

A assinatura da interface `Consumer` é:

```java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

## Sintaxe de uso e exemplo de uma lambda

A maneira mais comum de usar `forEach` é com expressões lambda. Aqui está um exemplo básico de uso com uma lista:

```java
import java.util.Arrays;
import java.util.List;

public class ForEachExample {
    public static void main(String[] args) {
        List<String> items = Arrays.asList("Apple", "Banana", "Cherry");

        // Usando expressão lambda
        items.forEach(item -> System.out.println(item));

        // Usando método de referência
        items.forEach(System.out::println);
    }
}
```

Neste exemplo, a expressão lambda `item -> System.out.println(item)` e o método de referência `System.out::println` são usados para imprimir cada item da lista.

## Quando utilizar?

O método `forEach` é utilizado quando você deseja executar uma ação específica para cada elemento de uma coleção ou stream. Alguns casos comuns incluem:

- **Iterar sobre coleções:** Executar operações em cada elemento de listas, conjuntos, mapas, etc.
- **Processamento de streams:** Aplicar ações em elementos de streams como parte de um pipeline de processamento.
- **Operações de debug:** Imprimir ou registrar o estado de elementos durante a iteração.

## Composições

A interface `Consumer` suporta composição através dos métodos `andThen`. Este método permite combinar duas operações em um único `Consumer`.

#### Exemplo de composição

```java
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;

public class ForEachCompositionExample {
    public static void main(String[] args) {
        List<String> items = Arrays.asList("Apple", "Banana", "Cherry");

        Consumer<String> printItem = item -> System.out.println("Item: " + item);
        Consumer<String> printLength = item -> System.out.println("Length: " + item.length());

        // Compondo os consumidores
        Consumer<String> combinedConsumer = printItem.andThen(printLength);

        items.forEach(combinedConsumer);
    }
}
```

Neste exemplo, `combinedConsumer` imprime o item e seu comprimento para cada elemento da lista.

## Métodos padrão

A interface `Consumer` possui métodos padrão que facilitam a composição de operações:

- `andThen(Consumer<? super T> after)`: Retorna um `Consumer` que executa em sequência esta operação seguida da operação `after`.

## Informações adicionais

#### Operações com streams

Além de coleções, o método `forEach` é amplamente utilizado em streams, permitindo a execução de operações finais em pipelines de processamento:

```java
import java.util.stream.Stream;

public class StreamForEachExample {
    public static void main(String[] args) {
        Stream<String> stream = Stream.of("Apple", "Banana", "Cherry");

        stream.forEach(item -> System.out.println(item));
    }
}
```

## Conclusão

O método `forEach` e a interface `Consumer` são ferramentas poderosas para iterar e realizar operações em elementos de coleções e streams no Java. Eles promovem uma abordagem funcional e concisa para processar dados, tornando o código mais legível e fácil de manter. Com a capacidade de composição fornecida pelos métodos padrão da interface `Consumer`, é possível construir operações complexas de maneira clara e eficiente.