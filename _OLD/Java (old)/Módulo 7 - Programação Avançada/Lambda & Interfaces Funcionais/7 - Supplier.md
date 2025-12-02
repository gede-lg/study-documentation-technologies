## O que é e para que serve?

No Java, a interface `Supplier` é uma interface funcional que faz parte do pacote `java.util.function`. Ela representa um fornecedor de resultados, ou seja, uma função que não aceita nenhum argumento e retorna um resultado. É frequentemente usada para gerar ou fornecer valores sob demanda.

## Padrão de entrada e saída

- **Entrada:** 0 argumentos
- **Saída:** 1 saída

A assinatura funcional da interface `Supplier` é:
```java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}
```

## Sintaxe de uso e exemplo de uma lambda

A maneira mais comum de usar um `Supplier` é com expressões lambda. Aqui está um exemplo básico:

```java
import java.util.function.Supplier;

public class SupplierExample {
    public static void main(String[] args) {
        Supplier<String> supplier = () -> "Hello, World!";

        System.out.println(supplier.get()); // Output: Hello, World!
    }
}
```

Neste exemplo, a expressão lambda `() -> "Hello, World!"` implementa o método `get` da interface `Supplier`, fornecendo a string "Hello, World!" quando chamado.

## Quando utilizar?

Os `Suppliers` são úteis em diversas situações, incluindo:

- **Fabricação de objetos:** Criar objetos de maneira tardia (lazy), adiando a criação até que seja realmente necessário.
- **Configuração:** Fornecer valores configuráveis ou valores padrão.
- **Caching:** Usado em conjunto com caches para fornecer valores apenas quando o cache está vazio.

## Composições

Ao contrário de outras interfaces funcionais como `Predicate`, a interface `Supplier` não possui métodos de composição direta como `and`, `or`, ou `negate`. No entanto, você pode combinar `Suppliers` usando métodos personalizados ou em conjunto com outras interfaces funcionais para criar comportamento mais complexo.

## Métodos padrão

A interface `Supplier` não possui métodos padrão adicionais, além do método abstrato `get`.

## Exemplos adicionais

#### Fornecimento de números aleatórios

Um exemplo comum do uso de `Supplier` é fornecer números aleatórios.

```java
import java.util.Random;
import java.util.function.Supplier;

public class RandomNumberSupplier {
    public static void main(String[] args) {
        Supplier<Integer> randomSupplier = () -> new Random().nextInt(100);

        System.out.println(randomSupplier.get()); // Output: (um número aleatório entre 0 e 99)
        System.out.println(randomSupplier.get()); // Output: (outro número aleatório entre 0 e 99)
    }
}
```

#### Uso com Streams

Os `Suppliers` também podem ser utilizados com streams para gerar sequências de valores.

```java
import java.util.function.Supplier;
import java.util.stream.Stream;

public class StreamSupplierExample {
    public static void main(String[] args) {
        Supplier<String> supplier = () -> "Hello, Stream!";

        Stream.generate(supplier)
              .limit(5)
              .forEach(System.out::println);
        // Output: 
        // Hello, Stream!
        // Hello, Stream!
        // Hello, Stream!
        // Hello, Stream!
        // Hello, Stream!
    }
}
```

## Conclusão

A interface `Supplier` é uma ferramenta poderosa no Java para fornecer resultados sob demanda sem a necessidade de argumentos de entrada. Ela é especialmente útil para criação tardia de objetos, configuração e operações de caching. Embora não ofereça métodos de composição padrão, seu uso em conjunto com outras interfaces funcionais pode resultar em soluções flexíveis e eficientes. Ao compreender e utilizar eficientemente os `Suppliers`, você pode escrever código Java mais modular e responsivo.