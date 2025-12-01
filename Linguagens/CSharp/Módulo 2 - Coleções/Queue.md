## O que é e para que serve?

Uma `Queue` em C# é uma coleção do tipo FIFO (First In, First Out), o que significa que o primeiro elemento adicionado é o primeiro a ser removido. Este tipo de coleção é usado para armazenar elementos em uma ordem sequencial, onde o principal objetivo é processar elementos na ordem em que foram recebidos. É uma estrutura de dados ideal para situações onde você precisa gerenciar objetos em cenários como filas de espera, operações agendadas em ordem de chegada, ou para implementar buffers.

## Quando utilizar?

Use uma `Queue` quando:

- Precisar de uma coleção com um mecanismo automático de "primeiro a entrar, primeiro a sair".
- Estiver trabalhando com cenários onde a ordem de processamento precisa ser mantida conforme a ordem de chegada dos elementos.
- Precisar implementar funcionalidades como filas de tarefas, onde as tarefas devem ser executadas na ordem em que foram adicionadas.
- Quiser garantir que os elementos sejam processados em uma sequência específica, como em simulações de fila de atendimento ao cliente ou em gerenciamento de recursos compartilhados.

## Sintaxe de uso

Aqui está como você pode trabalhar com `Queue` em C#:

### 1. Adicionando elementos à Queue

Para adicionar elementos a uma fila, você usa o método `Enqueue`.

```csharp
Queue<string> fila = new Queue<string>();
fila.Enqueue("Primeiro");
fila.Enqueue("Segundo");
fila.Enqueue("Terceiro");
```

### 2. Removendo elementos da Queue

Para remover o elemento que está há mais tempo na fila (o primeiro elemento), você usa o método `Dequeue`.

```csharp
string elemento = fila.Dequeue();
Console.WriteLine(elemento); // Imprime "Primeiro"
```

### 3. Espreitando o próximo elemento

Para ver qual é o próximo elemento a ser removido da fila sem realmente removê-lo, você usa o método `Peek`.

```csharp
string proximo = fila.Peek();
Console.WriteLine(proximo); // Imprime "Segundo", pois "Primeiro" já foi removido
```

### 4. Verificando o tamanho da Queue

Para saber quantos elementos estão presentes na fila, você pode usar a propriedade `Count`.

```csharp
int tamanho = fila.Count;
Console.WriteLine(tamanho); // Imprime o número de itens na fila
```

### 5. Verificando se a Queue contém um elemento específico

Você pode verificar se uma fila contém um determinado elemento usando o método `Contains`.

```csharp
if (fila.Contains("Terceiro")) {
    Console.WriteLine("Terceiro está na fila");
} else {
    Console.WriteLine("Terceiro não está na fila");
}
```

### Exemplo completo:

```csharp
using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        Queue<string> fila = new Queue<string>();
        fila.Enqueue("Primeiro");
        fila.Enqueue("Segundo");
        fila.Enqueue("Terceiro");

        Console.WriteLine($"Total de elementos na fila: {fila.Count}");

        while (fila.Count > 0) {
            string elemento = fila.Dequeue();
            Console.WriteLine($"Processando {elemento}");
        }

        Console.WriteLine($"Total de elementos na fila após processamento: {fila.Count}");
    }
}
```

## Informações adicionais

- A classe `Queue` em C# se encontra no namespace `System.Collections.Generic`, o que significa que ela pode armazenar qualquer tipo de objeto, oferecendo segurança de tipo em tempo de compilação.
- Além dos métodos básicos já mencionados, `Queue<T>` oferece outros métodos como `Clear()` para remover todos os elementos da fila, `ToArray()` para converter a fila em um array, entre outros.
- `Queue<T>` é uma coleção dinâmica que cresce automaticamente à medida que você adiciona mais elementos, tornando-a flexível para armazenar uma quantidade variável de dados.

Utilizar `Queue` em suas aplicações C# pode significativamente simplificar o gerenciamento de dados sequenciais, especialmente em situações que exigem o processamento ordenado de elementos.