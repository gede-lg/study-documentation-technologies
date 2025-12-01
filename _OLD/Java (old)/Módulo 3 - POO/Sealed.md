### O que é e para que serve?

A funcionalidade de classes e interfaces seladas (sealed classes and interfaces) foi introduzida no Java a partir da versão 15 como uma funcionalidade de pré-visualização e estabilizada na versão 17. Essa funcionalidade permite que você restrinja quais outras classes ou interfaces podem estender ou implementar a classe ou interface selada.

O propósito principal das classes seladas é oferecer um controle mais refinado sobre a herança, permitindo que os desenvolvedores definam explicitamente quais classes podem estender uma classe selada. Isso é especialmente útil para definir domínios fechados de tipos em uma aplicação, onde você deseja limitar as possíveis extensões a um conjunto conhecido de subclasses, garantindo uma maior segurança de tipo e facilitando a manutenção.

### Sintaxe de uso

A sintaxe para declarar uma classe ou interface selada envolve o uso da palavra-chave `sealed`, seguida pela palavra-chave `permits` se você deseja especificar explicitamente quais classes podem estender ou implementar a classe ou interface selada.

#### Exemplo de Classe Selada:

```java
public sealed class Shape permits Circle, Rectangle {
    // Definições da classe
}

final class Circle extends Shape {
    // Implementação específica para Circle
}

final class Rectangle extends Shape {
    // Implementação específica para Rectangle
}
```

Neste exemplo, `Shape` é uma classe selada que só permite que as classes `Circle` e `Rectangle` a estendam. Note que as subclasses diretas de uma classe selada devem ser declaradas como `final`, `sealed`, ou `non-sealed`:

- `final`: Indica que a classe não pode ser estendida.
- `sealed`: Indica que a classe é selada e pode especificar suas próprias subclasses permitidas.
- `non-sealed`: Indica que a classe não é selada e pode ser estendida por qualquer outra classe.

#### Exemplo de Interface Selada:

```java
public sealed interface Vehicle permits Car, Truck {
    // Definições da interface
}

final class Car implements Vehicle {
    // Implementação específica para Car
}

non-sealed class Truck implements Vehicle {
    // Implementação específica para Truck, permitindo extensões adicionais
}
```

Aqui, `Vehicle` é uma interface selada que permite apenas `Car` e `Truck` como suas implementações. Semelhante às classes seladas, as classes que implementam interfaces seladas devem ser marcadas como `final`, `sealed`, ou `non-sealed`.

### Pontos Importantes

- **Controle de Herança**: O uso de classes e interfaces seladas oferece um controle estrito sobre a herança, permitindo que os desenvolvedores definam uma hierarquia de tipos mais previsível e segura.
- **Documentação e Manutenção**: Ao limitar explicitamente as subclasses permitidas, as classes seladas também servem como uma forma de documentação, indicando claramente as intenções do design do sistema.
- **Uso com Pattern Matching**: As classes seladas complementam bem o pattern matching (correspondência de padrões) introduzido no Java 16, permitindo a implementação de verificações de tipo mais expressivas e seguras em blocos `switch`.

### Conclusão

As classes e interfaces seladas são uma adição poderosa ao Java, oferecendo uma maneira de controlar a herança e garantir que apenas um conjunto específico de classes possa estender ou implementar uma classe ou interface particular. Isso ajuda a manter o código mais seguro, mais fácil de entender e manter, especialmente em sistemas complexos onde a previsibilidade da hierarquia de tipos é crucial.