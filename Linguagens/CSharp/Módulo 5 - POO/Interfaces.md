## O que é e para que serve?

Uma interface em C# é uma definição de contrato que pode ser implementada por classes e estruturas. Este "contrato" estabelece um conjunto de métodos, propriedades, eventos e indexadores sem implementar a lógica por trás deles. O principal propósito de uma interface é definir um padrão que as classes ou estruturas devem seguir, garantindo que elas implementem um conjunto específico de membros. Interfaces são fundamentais para o conceito de programação orientada a objetos, especialmente no que diz respeito à herança e polimorfismo, permitindo que objetos de diferentes classes sejam tratados de forma uniforme.

## Como funciona?

Quando uma classe ou estrutura implementa uma interface, ela assina um contrato, comprometendo-se a fornecer implementações concretas para todos os membros definidos pela interface. Se a classe ou estrutura falhar em implementar algum desses membros, o compilador emitirá um erro. Interfaces permitem a criação de sistemas altamente modulares e extensíveis, pois o código que opera em interfaces pode usar objetos de qualquer classe que as implemente, promovendo a flexibilidade e a reutilização de código.

## Sintaxe de uso

### Definindo uma Interface

A sintaxe para definir uma interface é semelhante à de uma classe, mas utilizando a palavra-chave `interface`:

```csharp
interface IAnimal
{
    void Eat();
    int Age { get; set; }
}
```

Neste exemplo, `IAnimal` é uma interface com um método `Eat` e uma propriedade `Age`. Por convenção, os nomes de interfaces em C# começam com a letra "I".

### Implementando uma Interface

Uma classe implementa uma interface usando a palavra-chave `:`, seguida pelo nome da interface:

```csharp
class Dog : IAnimal
{
    public int Age { get; set; }

    public void Eat()
    {
        Console.WriteLine("Dog is eating.");
    }
}
```

A classe `Dog` implementa a interface `IAnimal`, fornecendo a lógica para o método `Eat` e a propriedade `Age`.

### Usando Interfaces

Interfaces permitem tratar diferentes tipos de objetos de maneira uniforme. Por exemplo:

```csharp
IAnimal myDog = new Dog();
myDog.Eat();  // Saída: Dog is eating.
```

Aqui, `myDog` é uma referência do tipo `IAnimal`, mas aponta para uma instância de `Dog`. Isso permite chamar o método `Eat` definido pela interface `IAnimal` e implementado pela classe `Dog`.

### Considerações Adicionais

- **Múltiplas Interfaces**: Uma classe pode implementar múltiplas interfaces, separando-as por vírgula.
- **Interfaces e Herança**: Uma interface pode herdar de outra, estendendo seu contrato.
- **Membros de Interface**: Podem ser métodos, propriedades, eventos ou indexadores.
- **Modificadores de Acesso**: Os membros de uma interface não podem ter modificadores de acesso (como `public`, `private`); são publicamente acessíveis por padrão.

## Exemplo com Múltiplas Interfaces

```csharp
interface IMovable
{
    void Move();
}

class Animal : IAnimal, IMovable
{
    public int Age { get; set; }

    public void Eat()
    {
        Console.WriteLine("Animal is eating.");
    }

    public void Move()
    {
        Console.WriteLine("Animal is moving.");
    }
}
```

Neste exemplo, a classe `Animal` implementa duas interfaces, `IAnimal` e `IMovable`, comprometendo-se a fornecer implementações para os membros `Eat` da `IAnimal` e `Move` da `IMovable`.

Interfaces são uma ferramenta poderosa em C#, permitindo projetar sistemas flexíveis e desacoplados, promovendo a reutilização de código e a implementação de polimorfismo de forma eficaz.