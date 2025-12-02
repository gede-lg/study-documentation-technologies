## O que é e para que serve?

No Java, a interface `BiFunction` faz parte do pacote `java.util.function` e representa uma função que aceita dois argumentos e produz um resultado. Esta interface funcional é útil quando você precisa realizar operações que combinam dois valores para produzir um novo valor.

## Padrão de entrada e saída

- **Entrada:** 2 argumentos do tipo T (T1, T2)
- **Saída:** 1 saída do tipo R

A assinatura funcional é:
```java
@FunctionalInterface
public interface BiFunction<T, U, R> {
    R apply(T t, U u);
}
```

## Sintaxe de uso e exemplo de uma lambda

A maneira mais comum de usar uma `BiFunction` é com expressões lambda. Aqui está um exemplo básico:

```java
import java.util.function.BiFunction;

public class BiFunctionExample {
    public static void main(String[] args) {
        BiFunction<Integer, Integer, Integer> sum = (a, b) -> a + b;

        System.out.println(sum.apply(5, 3)); // 8
        System.out.println(sum.apply(10, -2)); // 8
    }
}
```

Neste exemplo, a expressão lambda `(a, b) -> a + b` implementa o método `apply` da interface `BiFunction`, somando dois números inteiros.

## Quando utilizar?

A `BiFunction` é útil em situações onde você precisa combinar dois valores para produzir um resultado. Alguns casos comuns incluem:

- **Operações matemáticas:** Combinar dois números (ex: soma, subtração, multiplicação).
- **Concatenação de strings:** Combinar duas strings em uma única string.
- **Transformação de dados:** Transformar dois valores de entrada em um valor de saída de um tipo diferente.

## Composições

A `BiFunction` pode ser composta com outras funções usando o método `andThen`. Este método permite que você execute uma função adicional no resultado da `BiFunction`.

#### Exemplo de composição

```java
import java.util.function.BiFunction;
import java.util.function.Function;

public class BiFunctionCompositionExample {
    public static void main(String[] args) {
        BiFunction<Integer, Integer, Integer> multiply = (a, b) -> a * b;
        Function<Integer, String> convertToString = (i) -> "Resultado: " + i;

        BiFunction<Integer, Integer, String> composedFunction = multiply.andThen(convertToString);

        System.out.println(composedFunction.apply(3, 4)); // Resultado: 12
    }
}
```

Neste exemplo, `multiply` é uma `BiFunction` que multiplica dois números e `convertToString` é uma função que converte o resultado em uma string. A `composedFunction` aplica ambas as funções em sequência.

## Métodos padrão

A interface `BiFunction` inclui o método padrão `andThen`:

- `default <V> BiFunction<T, U, V> andThen(Function<? super R, ? extends V> after)`: Retorna uma função que primeiro aplica esta função e depois aplica a função `after` no resultado.

#### Exemplo de `andThen`

```java
import java.util.function.BiFunction;
import java.util.function.Function;

public class BiFunctionAndThenExample {
    public static void main(String[] args) {
        BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
        Function<Integer, String> convertToString = (i) -> "Sum is: " + i;

        BiFunction<Integer, Integer, String> addThenConvert = add.andThen(convertToString);

        System.out.println(addThenConvert.apply(2, 3)); // Sum is: 5
    }
}
```

## Conclusão

A `BiFunction` é uma ferramenta versátil no Java para expressar funções que operam em dois argumentos e produzem um resultado. Elas são amplamente utilizadas em operações matemáticas, concatenação de strings e transformação de dados. Com o método `andThen`, é possível compor funções de maneira eficiente, permitindo a criação de pipelines de processamento de dados mais legíveis e mantíveis. Compreender e utilizar eficientemente a `BiFunction` pode tornar seu código Java mais funcional e expressivo.