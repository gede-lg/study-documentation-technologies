## O que é e para que serve?

Em C#, um `Set` é uma coleção que armazena elementos únicos, ou seja, não permite duplicatas. Esse tipo de coleção é útil quando você precisa garantir que cada elemento seja único na coleção. Por exemplo, pode ser usado para armazenar uma lista de identificadores únicos, nomes de usuários, ou qualquer outro conjunto de dados onde a unicidade dos elementos é crucial.

Os `Sets` em C# são representados principalmente pela interface `ISet<T>` e pelas classes que a implementam, como `HashSet<T>` e `SortedSet<T>`. Enquanto `HashSet<T>` armazena os elementos em uma tabela hash, oferecendo operações muito eficientes para adicionar, remover e verificar a existência de elementos sem uma ordem específica, `SortedSet<T>` mantém os elementos em uma ordem específica determinada por um comparador ou pela ordem natural dos elementos, se eles forem comparáveis.

## Quando utilizar?

Você deve considerar o uso de um `Set` quando:

- A unicidade dos elementos é uma exigência.
- A ordem de inserção dos elementos não é importante (caso do `HashSet<T>`), ou quando uma ordem específica é necessária (caso do `SortedSet<T>`).
- Você precisa de operações eficientes de adição, remoção e verificação da existência de elementos, especialmente em grandes volumes de dados.

## Sintaxe de uso

### `HashSet<T>`

```csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Criação de um HashSet de inteiros
        HashSet<int> numeros = new HashSet<int>();

        // Adicionando elementos
        numeros.Add(1);
        numeros.Add(2);
        numeros.Add(3);
        numeros.Add(3); // Tentativa de adicionar um duplicado, que será ignorada

        // Verificando se um elemento está presente
        if (numeros.Contains(2))
        {
            Console.WriteLine("2 está presente no set.");
        }

        // Iteração sobre os elementos
        foreach (int numero in numeros)
        {
            Console.WriteLine(numero);
        }
    }
}
```

### `SortedSet<T>`

```csharp
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        // Criação de um SortedSet de strings
        SortedSet<string> frutas = new SortedSet<string>();

        // Adicionando elementos
        frutas.Add("Maçã");
        frutas.Add("Banana");
        frutas.Add("Pera");
        frutas.Add("Banana"); // Tentativa de adicionar um duplicado, que será ignorada

        // Os elementos serão iterados em ordem alfabética
        foreach (string fruta in frutas)
        {
            Console.WriteLine(fruta);
        }
    }
}
```

## Tópicos Importantes

- **Performance**: `HashSet<T>` é altamente eficiente para operações de adição, remoção e busca, graças à sua implementação baseada em tabela hash. `SortedSet<T>`, por outro lado, mantém seus elementos ordenados, o que pode tornar certas operações mais lentas comparadas ao `HashSet<T>`, mas é útil quando a ordem dos elementos é importante.

- **Personalização**: Tanto `HashSet<T>` quanto `SortedSet<T>` permitem a personalização do critério de igualdade e ordenação, respectivamente. Isso é feito através da implementação de interfaces como `IEqualityComparer<T>` para `HashSet<T>` ou fornecendo um `IComparer<T>` para `SortedSet<T>`.

- **Operações de conjunto**: Ambas as coleções oferecem métodos para operações de conjunto tradicionais, como união, interseção, diferença e subconjunto. Esses métodos podem ser muito úteis para manipular conjuntos de dados e realizar operações matemáticas de conjunto.

Esses tópicos destacam a flexibilidade e o poder dos `Sets` em C#, tornando-os uma escolha essencial para uma ampla variedade de situações de programação onde a unicidade dos elementos é uma prioridade.
