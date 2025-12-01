# Collections em C#

## 1. O que são Collections em C# e para que servem?

Collections em C# são estruturas de dados que permitem armazenar, gerenciar e manipular grupos de objetos de forma eficiente. Elas são parte do namespace `System.Collections` e `System.Collections.Generic`, fornecendo funcionalidades como listas, filas, pilhas e dicionários. As collections são utilizadas para armazenar dados de forma mais flexível do que os arrays tradicionais, permitindo adições, remoções e acessos dinâmicos.

### Principais Características:
- **Tipos Genéricos**: A maioria das collections em C# são genéricas, permitindo que você especifique o tipo de dados que irão armazenar, o que traz benefícios como segurança de tipo e performance.
- **Tipos Não Genéricos**: Existem também collections não genéricas que podem armazenar objetos de qualquer tipo, mas são menos usadas devido à falta de segurança de tipo e eficiência.

## 2. Quando Utilizar Cada Tipo de Collection

### Listas (`List<T>`)
- **Uso**: Quando você precisa de uma coleção ordenada que permite duplicatas.
- **Exemplo**: Armazenar uma lista de nomes de alunos em uma turma.

### Conjuntos (`HashSet<T>`, `SortedSet<T>`)
- **Uso**: Para armazenar elementos únicos, sem duplicatas. `HashSet<T>` para ordem não especificada e `SortedSet<T>` para elementos ordenados.
- **Exemplo**: Armazenar uma coleção de IDs de usuários únicos.

### Filas (`Queue<T>`, `ConcurrentQueue<T>`)
- **Uso**: Quando os elementos devem ser processados na ordem em que foram adicionados (FIFO).
- **Exemplo**: Gerenciar tarefas em uma fila de impressão.

### Pilhas (`Stack<T>`, `ConcurrentStack<T>`)
- **Uso**: Quando os elementos devem ser processados na ordem inversa à que foram adicionados (LIFO).
- **Exemplo**: Implementar um recurso de desfazer em um editor de texto.

### Dicionários (`Dictionary<TKey, TValue>`, `ConcurrentDictionary<TKey, TValue>`)
- **Uso**: Armazenar pares chave-valor para busca rápida por chave.
- **Exemplo**: Armazenar valores de configuração, onde a chave é o nome da configuração.

## 3. Sintaxe de Uso

### Listas (`List<T>`)
```csharp
List<int> numeros = new List<int>();
numeros.Add(1);
numeros.Add(2);
numeros.Add(3);

foreach (int numero in numeros) {
    Console.WriteLine(numero);
}
```

### Conjuntos (`HashSet<T>`)
```csharp
HashSet<string> nomes = new HashSet<string>();
nomes.Add("Ana");
nomes.Add("Bruno");
nomes.Add("Carla");

foreach (string nome in nomes) {
    Console.WriteLine(nome);
}
```

### Filas (`Queue<T>`)
```csharp
Queue<string> fila = new Queue<string>();
fila.Enqueue("Primeiro");
fila.Enqueue("Segundo");
fila.Enqueue("Terceiro");

while (fila.Count > 0) {
    Console.WriteLine(fila.Dequeue());
}
```

### Pilhas (`Stack<T>`)
```csharp
Stack<string> pilha = new Stack<string>();
pilha.Push("Um");
pilha.Push("Dois");
pilha.Push("Três");

while (pilha.Count > 0) {
    Console.WriteLine(pilha.Pop());
}
```

### Dicionários (`Dictionary<TKey, TValue>`)
```csharp
Dictionary<string, int> idadePessoas = new Dictionary<string, int>();
idadePessoas.Add("Ana", 25);
idadePessoas.Add("Bruno", 30);

foreach (KeyValuePair<string, int> pessoa in idadePessoas) {
    Console.WriteLine($"Nome: {pessoa.Key}, Idade: {pessoa.Value}");
}
```

### Estrutura Hierárquica de Collections Não Genéricas (`System.Collections`):
```plaintext
IEnumerable
    ├─ ICollection
    │    ├─ IList
    │    │    ├─ ArrayList
    │    │    └─ StringCollection (especialização para Strings)
    │    └─ IDictionary
    │         ├─ Hashtable
    │         ├─ SortedList
    │         └─ HybridDictionary (otimizado para poucos ou muitos elementos)
    ├─ ISet
    │    └─ (Não aplicável em collections não genéricas)
    └─ Queue
    └─ Stack
    └─ BitArray (estrutura especializada para manipulação de bits)
```

### Estrutura Hierárquica de Collections Genéricas (`System.Collections.Generic`):
```plaintext
IEnumerable<T>
    ├─ ICollection<T>
    │    ├─ IList<T>
    │    │    ├─ List<T>
    │    │    └─ LinkedList<T>
    │    ├─ ISet<T>
    │    │    ├─ HashSet<T>
    │    │    └─ SortedSet<T>
    │    └─ ...
    └─ IDictionary<TKey, TValue>
         ├─ Dictionary<TKey, TValue>
         ├─ SortedDictionary<TKey, TValue>
         └─ SortedList<TKey, TValue>
```

### Collections Concorrentes (`System.Collections.Concurrent`):
Estas collections são projetadas para uso em cenários de multithreading, oferecendo operações seguras sem bloqueios explícitos.
```plaintext
    ├─ BlockingCollection<T>
    ├─ ConcurrentBag<T>
    ├─ ConcurrentDictionary<TKey, TValue>
    ├─ ConcurrentQueue<T>
    └─ ConcurrentStack<T>
```

### Collections Imutáveis (`System.Collections.Immutable`):
Collections que, uma vez criadas, não podem ser modificadas. Úteis para garantir thread-safety e evitar mudanças indesejadas nos dados.
```plaintext
    ├─ ImmutableList<T>
    ├─ ImmutableArray<T>
    ├─ ImmutableHashSet<T>
    ├─ ImmutableSortedSet<T>
    ├─ ImmutableDictionary<TKey, TValue>
    └─ ImmutableSortedDictionary<TKey, TValue>
```

### Observações:
- **Collections Não Genéricas**: São mais antigas e não garantem tipo seguro. Devem ser evitadas em código novo, preferindo-se as collections genéricas.
- **Collections Genéricas**: São o padrão atual, oferecendo segurança de tipos e melhor desempenho.
- **Collections Concorrentes**: Projetadas para alta performance em ambientes multithread sem a necessidade de bloqueios externos.
- **Collections Imutáveis**: Permitem a criação de coleções que não podem ser alteradas após sua criação, ideal para programação funcional e cenários onde a imutabilidade é necessária para segurança.

Essa visão abrangente demonstra a flexibilidade e a profundidade do suporte a collections no .NET Framework e no .NET Core, permitindo aos desenvolvedores escolher a estrutura de dados mais adequada para cada cenário específico.