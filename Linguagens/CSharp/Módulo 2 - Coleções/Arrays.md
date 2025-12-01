## O que é e para que serve?

Em C#, vetores são coleções de elementos que têm o mesmo tipo. Eles são usados para armazenar dados de forma sequencial na memória. Os vetores são muito úteis quando você tem uma quantidade conhecida de dados que precisa ser acessada por índices. Por exemplo, você pode usar um vetor para armazenar uma lista de pontuações de estudantes, preços de produtos, ou praticamente qualquer conjunto de valores que precisam ser armazenados juntos.

## Quando utilizar?

Você deve considerar o uso de vetores quando:

- Sabe-se de antemão quantos elementos a coleção precisa armazenar.
- Precisa de acesso rápido aos elementos por meio de índices.
- Quer garantir que todos os elementos tenham o mesmo tipo, o que ajuda a manter a consistência dos dados e a segurança do tipo.

## Sintaxe de uso

### Declaração de um Vetor

Para declarar um vetor em C#, você usa o tipo dos elementos que ele vai armazenar, seguido por colchetes `[]`. Por exemplo:

```csharp
int[] scores;
```

### Inicialização de um Vetor

Após declarar um vetor, você deve inicializá-lo. Isso pode ser feito de várias formas:

**Alocando espaço para o vetor:**

```csharp
scores = new int[10]; // Cria um vetor de inteiros com 10 elementos.
```

**Inicializando o vetor com valores:**

```csharp
int[] scores = { 90, 85, 100, 60, 75 }; // Cria e inicializa o vetor com valores específicos.
```

### Acesso aos Elementos do Vetor

Você acessa um elemento do vetor usando seu índice, começando por 0. Por exemplo, para acessar o primeiro elemento:

```csharp
int firstScore = scores[0]; // Acessa o primeiro elemento do vetor.
```

Para modificar um elemento, use seu índice da mesma forma:

```csharp
scores[0] = 95; // Modifica o primeiro elemento do vetor.
```

### Percorrendo Vetores

Você pode percorrer todos os elementos de um vetor usando um loop. Por exemplo, usando um loop `for`:

```csharp
for (int i = 0; i < scores.Length; i++)
{
    Console.WriteLine(scores[i]);
}
```

Ou usando um loop `foreach`, que é mais simples e direto:

```csharp
foreach (int score in scores)
{
    Console.WriteLine(score);
}
```
