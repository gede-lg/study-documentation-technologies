### O que é e para que serve?

No Java, um `Consumer` é uma interface funcional que faz parte do pacote `java.util.function`. Ela representa uma operação que aceita um único argumento de entrada e não retorna nenhum resultado. É comumente usada para definir operações que realizam alguma ação com o argumento fornecido, como imprimir, modificar, ou processar dados de alguma forma.

## Padrão de entrada e saída

O `Consumer` aceita um único argumento genérico e não retorna nenhum valor. A assinatura funcional é:
```java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

- **Entrada:** 1 argumento do tipo genérico `T`
- **Saída:** nenhuma saída (método `void`)

## Sintaxe de uso e exemplo de uma lambda

A maneira mais comum de usar um `Consumer` é com expressões lambda. Aqui está um exemplo básico:

```java
import java.util.function.Consumer;

public class ConsumerExample {
    public static void main(String[] args) {
        Consumer<String> printConsumer = (String s) -> System.out.println(s);

        printConsumer.accept("Hello, World!"); // Output: Hello, World!
    }
}
```

Neste exemplo, a expressão lambda `(String s) -> System.out.println(s)` implementa o método `accept` da interface `Consumer`, imprimindo a string fornecida.

## Quando utilizar?

Os `Consumers` são amplamente utilizados em cenários onde você precisa executar uma operação sobre cada elemento de uma coleção ou para realizar ações sem retorno. Alguns casos comuns incluem:

- **Operações em elementos de coleções:** Usado com métodos como `forEach` em streams para aplicar uma operação a cada elemento.
- **Processamento de dados:** Para modificar ou processar dados de entrada sem a necessidade de retornar um valor.
- **Execução de ações:** Para executar ações que afetam o estado do programa, como registrar logs, atualizar interfaces de usuário, etc.

## Composições do `Consumer`

Os `Consumers` podem ser compostos usando o método `andThen`, permitindo encadear múltiplas operações sequencialmente.

#### Exemplo de composição

```java
import java.util.function.Consumer;

public class ConsumerCompositionExample {
    public static void main(String[] args) {
        Consumer<String> printConsumer = (s) -> System.out.println("Printing: " + s);
        Consumer<String> upperCaseConsumer = (s) -> System.out.println(s.toUpperCase());

        Consumer<String> combinedConsumer = printConsumer.andThen(upperCaseConsumer);

        combinedConsumer.accept("hello"); 
        // Output:
        // Printing: hello
        // HELLO
    }
}
```

Neste exemplo, `combinedConsumer` primeiro imprime a string com o prefixo "Printing: " e, em seguida, imprime a string em maiúsculas.

## Métodos padrão

A interface `Consumer` inclui o método padrão `andThen` que permite compor dois consumidores:

- `andThen(Consumer<? super T> after)`: Retorna um `Consumer` que executa em sequência a operação atual seguida pela operação especificada.

## Conclusão

Os `Consumers` são uma ferramenta fundamental no Java para realizar operações que aceitam um único argumento e não retornam resultados. Eles são amplamente utilizados em operações de processamento de dados, execução de ações e aplicação de operações a coleções. Com a capacidade de compor `Consumers` usando `andThen`, é possível criar pipelines de processamento flexíveis e reutilizáveis, tornando o código mais modular e fácil de entender.