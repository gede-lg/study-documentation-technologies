## O que é e para que serve?

No Java, um `UnaryOperator` é uma interface funcional que faz parte do pacote `java.util.function`. Ela representa uma operação sobre um único operando que produz um resultado do mesmo tipo que o operando. Em outras palavras, é uma função que recebe um argumento de um tipo e retorna um resultado do mesmo tipo.

## Padrão de entrada e saída

- **Entrada:** 1 argumento do tipo `T`
- **Saída:** 1 saída do tipo `T`

A assinatura funcional é:

```java
@FunctionalInterface
public interface UnaryOperator<T> extends Function<T, T> {
}
```

## Sintaxe de uso e exemplo de uma lambda

A maneira mais comum de usar um `UnaryOperator` é com expressões lambda. Aqui está um exemplo básico:

```java
import java.util.function.UnaryOperator;

public class UnaryOperatorExample {
    public static void main(String[] args) {
        UnaryOperator<Integer> square = (Integer x) -> x * x;

        System.out.println(square.apply(5)); // 25
        System.out.println(square.apply(3)); // 9
    }
}
```

Neste exemplo, a expressão lambda `(Integer x) -> x * x` implementa o método `apply` da interface `UnaryOperator`, calculando o quadrado de um número.

## Quando utilizar?

Os `UnaryOperators` são úteis quando você precisa aplicar uma transformação ou operação a um único valor e retornar um resultado do mesmo tipo. Alguns casos comuns incluem:

- **Transformações de dados:** Aplicar operações de mapeamento em coleções, como calcular o quadrado de todos os números em uma lista.
- **Manipulação de strings:** Realizar operações como conversões de maiúsculas/minúsculas em strings.
- **Operações aritméticas:** Executar cálculos como incremento, decremento ou qualquer outra operação matemática.

## Composições

Os `UnaryOperators` podem ser compostos usando métodos padrão da interface `Function`, que `UnaryOperator` herda. Esses métodos permitem criar operações complexas a partir de operações mais simples. Os principais métodos de composição são:

- `andThen(Function<? super R, ? extends V> after)`: Retorna uma composição que primeiro aplica este operador e, em seguida, aplica o operador `after`.
- `compose(Function<? super V, ? extends T> before)`: Retorna uma composição que primeiro aplica o operador `before` e, em seguida, aplica este operador.

#### Exemplo de composição

```java
import java.util.function.UnaryOperator;

public class UnaryOperatorCompositionExample {
    public static void main(String[] args) {
        UnaryOperator<Integer> multiplyBy2 = (Integer x) -> x * 2;
        UnaryOperator<Integer> add3 = (Integer x) -> x + 3;

        UnaryOperator<Integer> combinedOperator = multiplyBy2.andThen(add3);

        System.out.println(combinedOperator.apply(5)); // 13 (5 * 2 + 3)
        System.out.println(combinedOperator.apply(3)); // 9 (3 * 2 + 3)
    }
}
```

Neste exemplo, `combinedOperator` primeiro multiplica um número por 2 e, em seguida, adiciona 3 ao resultado.

## Métodos padrão

Os `UnaryOperators` herdam os métodos padrão da interface `Function`. Além dos métodos de composição (`andThen` e `compose`), há outro método estático útil:

- `static <T> UnaryOperator<T> identity()`: Retorna um `UnaryOperator` que retorna o próprio operando.

#### Exemplo do método `identity`

```java
import java.util.function.UnaryOperator;

public class UnaryOperatorIdentityExample {
    public static void main(String[] args) {
        UnaryOperator<String> identity = UnaryOperator.identity();

        System.out.println(identity.apply("Hello")); // "Hello"
        System.out.println(identity.apply("World")); // "World"
    }
}
```

Neste exemplo, o operador `identity` simplesmente retorna o valor que recebe como entrada.

## Conclusão

Os `UnaryOperators` são uma ferramenta poderosa no Java para aplicar operações a um único valor de maneira concisa e funcional. Eles são amplamente utilizados em transformações de dados, manipulações de strings e operações aritméticas, tornando o código mais legível e fácil de manter. Ao compreender e utilizar eficientemente os `UnaryOperators`, você pode escrever código Java mais claro e robusto.