## O que é e para que serve?

Lambdas em Java foram introduzidas no Java 8 e são uma maneira de se escrever funções anônimas. Elas são utilizadas principalmente para fornecer a implementação de métodos de interfaces funcionais. Lambdas simplificam a maneira como você trabalha com interfaces que têm apenas um método abstrato, tornando o código mais conciso e legível.

## Sintaxe de uso e exemplo de uma lambda

A sintaxe básica de uma expressão lambda é:

```java
(parameters) -> expression
ou
(parameters) -> { statements; }
```

Exemplo simples:

```java
// Sem lambda
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello World!");
    }
};

// Com lambda
Runnable r2 = () -> System.out.println("Hello World!");
```

Neste exemplo, a expressão lambda `() -> System.out.println("Hello World!")` implementa o método `run` da interface `Runnable`.

## Interface Funcional

Uma interface funcional é uma interface que contém exatamente um método abstrato. Elas podem conter métodos padrão e estáticos, além de métodos declarados no `java.lang.Object`, mas apenas um método abstrato. As interfaces funcionais podem ser anotadas com a anotação `@FunctionalInterface`, o que não é obrigatório, mas recomendável para clareza.

Exemplo de uma interface funcional:

```java
@FunctionalInterface
interface MyFunctionalInterface {
    void execute();
}
```

## Qual a relação de lambdas com interfaces funcionais?

Lambdas são utilizadas para implementar o método abstrato das interfaces funcionais de maneira concisa. Quando você usa uma expressão lambda, o compilador infere o tipo de interface funcional que a expressão deve implementar. Isso reduz a verbosidade do código comparado à criação de classes anônimas.

Exemplo:
```java
@FunctionalInterface
interface MathOperation {
    int operation(int a, int b);
}

// Implementando usando lambdas
MathOperation addition = (a, b) -> a + b;
MathOperation subtraction = (a, b) -> a - b;

// Usando as operações
int result1 = addition.operation(5, 3); // 8
int result2 = subtraction.operation(5, 3); // 2
```

## Quando utilizar lambdas

Lambdas são mais úteis nas seguintes situações:

- **Quando se trabalha com interfaces funcionais:** Como em casos onde se usa a API de Streams ou APIs que requerem callbacks.
- **Para simplificar o código:** Lambdas tornam o código mais legível e menos verboso, especialmente quando comparado a classes anônimas.
- **Em processamento paralelo ou assíncrono:** Usar lambdas com `Runnable`, `Callable` e a API de concorrência do Java simplifica a definição de tarefas assíncronas.
- **Em APIs de coleções:** Muitas operações de coleções, como filtragem, mapeamento e redução, se beneficiam do uso de lambdas.

Exemplo de uso com Streams:
```java
List<String> names = Arrays.asList("John", "Jane", "Jack", "Jill");

// Usando lambda para filtrar e mapear
List<String> upperCaseNames = names.stream()
    .filter(name -> name.startsWith("J"))
    .map(name -> name.toUpperCase())
    .collect(Collectors.toList());

System.out.println(upperCaseNames); // [JOHN, JANE, JACK, JILL]
```

**6. Informações adicionais**

- **Captura de variáveis:** Lambdas podem capturar variáveis do contexto que as circunda, mas essas variáveis devem ser efetivamente finais.
- **Referências de método:** Uma expressão lambda pode ser substituída por uma referência de método se estiver disponível e for apropriado. Exemplo:
    ```java
    // Lambda
    Consumer<String> print = s -> System.out.println(s);
    // Referência de método
    Consumer<String> printMethodRef = System.out::println;
    ```

- **Escopo:** O escopo de uma lambda é similar ao de uma classe anônima, mas com algumas diferenças em relação ao acesso a variáveis locais.

### Conclusão

Lambdas são uma adição poderosa ao Java, que trazem simplicidade e expressividade ao código. Elas são fundamentais para trabalhar com APIs modernas em Java, como Streams, e melhoram a clareza do código ao substituir classes anônimas verbosas.