### O que é e para que serve?

#### List

`List<T>` é uma coleção genérica que faz parte do namespace `System.Collections.Generic`. Ela é usada para armazenar elementos de forma sequencial. O `T` representa o tipo dos elementos que a lista pode conter. Por ser genérica, permite maior tipo de segurança e performance comparado às coleções não genéricas, como o `ArrayList`.

A `List<T>` oferece várias funcionalidades, como adicionar, remover, encontrar e inserir elementos, além de ser capaz de redimensionar-se automaticamente conforme a necessidade.

#### ArrayList

`ArrayList` é uma coleção que faz parte do namespace `System.Collections`. Ela pode armazenar elementos de qualquer tipo de dados, e seu tamanho aumenta dinamicamente à medida que novos itens são adicionados. Uma desvantagem do `ArrayList` é a falta de tipo de segurança, pois ele armazena todos os elementos como `Object`, o que pode levar a conversões de tipo (casting) e, consequentemente, a erros em tempo de execução se não manuseado corretamente.

### Quando utilizar?

- **`List<T>`**: Deve ser usada quando você precisa de uma coleção tipada para armazenar elementos de um único tipo. É a escolha mais comum para coleções em C# devido à sua flexibilidade, tipo de segurança e conjunto rico de métodos.

- **`ArrayList`**: Embora menos comum desde a introdução de genéricos em .NET, `ArrayList` pode ser útil em cenários onde você precisa de uma coleção para armazenar elementos de diferentes tipos ou quando está trabalhando com código que foi escrito antes da introdução de genéricos em .NET.

### Sintaxe de uso

#### List

```csharp
using System.Collections.Generic;

// Criando uma lista de inteiros
List<int> numeros = new List<int>();

// Adicionando elementos à lista
numeros.Add(1);
numeros.Add(2);
numeros.Add(3);

// Removendo um elemento
numeros.Remove(2); // Remove o elemento 2

// Acessando elementos
int primeiroNumero = numeros[0]; // Acessa o primeiro elemento

// Iterando sobre a lista
foreach(int numero in numeros)
{
    Console.WriteLine(numero);
}
```

#### ArrayList

```csharp
using System.Collections;

// Criando um ArrayList
ArrayList minhaLista = new ArrayList();

// Adicionando elementos de diferentes tipos
minhaLista.Add(1); // Inteiro
minhaLista.Add("Texto"); // String
minhaLista.Add(true); // Booleano

// Removendo um elemento
minhaLista.Remove(1); // Remove o elemento 1

// Acessando elementos com casting
string elemento = (string)minhaLista[1]; // Acessa o segundo elemento e converte para string

// Iterando sobre o ArrayList
foreach(object obj in minhaLista)
{
    Console.WriteLine(obj);
}
```

### Informações Adicionais

- **Performance**: `List<T>` geralmente oferece melhor desempenho em comparação com `ArrayList` devido ao tipo de segurança e à ausência de necessidade de casting.
- **Capacidade e Contagem**: Ambos, `List<T>` e `ArrayList`, ajustam automaticamente sua capacidade para acomodar o número de elementos. A propriedade `Capacity` indica o número de elementos que a coleção pode armazenar antes de necessitar de realocação, enquanto `Count` indica o número de elementos presentes na coleção.
- **Métodos Úteis**: Ambas as coleções oferecem métodos úteis como `AddRange`, `Insert`, `RemoveAt`, `Sort`, e `Clear`, facilitando o gerenciamento dos elementos armazenados.

Ao escolher entre `List<T>` e `ArrayList`, considere a segurança de tipos e o desempenho como fatores decisivos, optando por `List<T>` na maioria dos casos para aproveitar os benefícios dos genéricos em C#.