Structs em C# são estruturas de dados que permitem encapsular diferentes tipos de dados sob um único nome. Essas são usadas para representar um registro de dados. Por exemplo, se você quiser manter um registro de um livro em uma biblioteca, você pode usar uma struct para armazenar o título do livro, autor, e o número de páginas.

## O que é e para que serve?

Uma struct é um tipo de valor em C#. Isso significa que quando uma struct é atribuída a uma nova variável, é feita uma cópia completa dessa struct. Comparando com classes, que são tipos de referência, structs proporcionam uma forma eficiente de representar dados quando não é necessário o uso de herança ou a necessidade de objetos serem referenciados. Structs são particularmente úteis para modelos de dados pequenos que possuem semântica de valor, onde é importante garantir que a cópia de um objeto seja completamente independente do original.

## Comportamento (tipo valor)

O comportamento de tipo valor das structs significa que, ao passá-las como argumentos para funções ou ao atribuí-las a outras variáveis, os valores são copiados. Isso difere das classes, onde as referências aos objetos são passadas ou atribuídas. Esse comportamento tem implicações importantes para a performance e o uso de memória, especialmente em cenários onde é necessário passar dados frequentemente entre métodos ou quando os dados são imutáveis.

## Sintaxe de uso

A sintaxe para definir uma struct em C# é semelhante à de uma classe, mas usando a palavra-chave `struct`. Aqui está um exemplo simples de como definir e usar uma struct:

```csharp
public struct Livro
{
    public string Titulo;
    public string Autor;
    public int Paginas;

    // Construtor
    public Livro(string titulo, string autor, int paginas)
    {
        Titulo = titulo;
        Autor = autor;
        Paginas = paginas;
    }
}

class Program
{
    static void Main()
    {
        Livro meuLivro = new Livro("O Nome do Vento", "Patrick Rothfuss", 662);
        Console.WriteLine($"Titulo: {meuLivro.Titulo}, Autor: {meuLivro.Autor}, Páginas: {meuLivro.Paginas}");
    }
}
```

Neste exemplo, a struct `Livro` é definida com três campos: `Titulo`, `Autor`, e `Paginas`, além de um construtor que inicializa esses campos. A seguir, no método `Main`, uma instância de `Livro` é criada e inicializada usando o construtor. Isso ilustra como as structs podem ser usadas para agrupar dados relacionados de forma eficiente e segura em termos de tipo.

## Considerações Adicionais

- **Imutabilidade**: É uma boa prática tornar structs imutáveis. Isso é feito definindo todos os campos como `readonly` e apenas permitindo que sejam definidos durante a inicialização. Isso ajuda a garantir a segurança dos dados e a previsibilidade do código.
- **Uso com interfaces**: Structs podem implementar interfaces, o que as torna úteis em designs de software onde a abstração e a separação de conceitos são importantes.
- **Comparação com classes**: Embora structs possam ser semelhantes às classes em muitos aspectos, é importante escolher entre elas com base na necessidade de semântica de valor versus referência, bem como considerações de desempenho e uso de memória.

Em resumo, structs em C# são uma ferramenta poderosa para modelar dados simples e eficientes, com semântica de valor. Seu uso adequado pode levar a um código mais limpo, eficiente e fácil de entender.