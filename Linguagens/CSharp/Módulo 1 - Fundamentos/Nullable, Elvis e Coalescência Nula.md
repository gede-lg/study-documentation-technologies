## Nullable

O conceito de `Nullable` em C# foi introduzido para permitir que tipos de valor, como `int`, `double`, `bool`, etc., possam representar a ausência de valor, algo que apenas tipos de referência (como objetos) podiam fazer antes. Em essências, `Nullable<T>` é uma estrutura genérica que permite que qualquer tipo de valor `T` possa receber `null` como valor.

#### Utilização:

```csharp
int? numeroNullable = null;
if (numeroNullable.HasValue)
{
    Console.WriteLine($"O número é {numeroNullable.Value}");
}
else
{
    Console.WriteLine("O número é null");
}
```

Aqui, `int?` é um atalho para `Nullable<int>`, indicando que `numeroNullable` pode conter um `int` ou ser `null`. `HasValue` verifica se há algum valor, e `Value` acessa o valor se ele existir.

## Operador Elvis `?.`

O Operador Elvis, `?.`, é utilizado para acessar membros (como propriedades ou métodos) de um objeto que pode ser `null` sem a necessidade de verificar explicitamente se o objeto é `null`. Se o objeto à esquerda do operador for `null`, a expressão inteira retorna `null` sem tentar acessar o membro, evitando assim uma possível `NullReferenceException`.

#### Sintaxe:

```csharp
var resultado = objeto?.Propriedade;
```

#### Exemplo:

```csharp
public class Pessoa
{
    public string Nome { get; set; }
}

Pessoa pessoa = null;
var nome = pessoa?.Nome; // Retorna null em vez de lançar NullReferenceException
```

## Operador de Coalescência Nula `??`

O operador de coalescência nula, `??`, é usado para fornecer um valor padrão para uma expressão nullable caso ela seja `null`. É uma forma concisa de aplicar uma lógica condicional em valores que podem ser `null`.

#### Sintaxe:

```csharp
var resultado = valorNullable ?? valorPadrao;
```

#### Exemplo:

```csharp
int? numeroNullable = null;
int numero = numeroNullable ?? 0; // Se numeroNullable for null, numero recebe 0
```

### Operador de Coalescência Nula com Atribuição `??=`

Este operador, introduzido no C# 8.0, permite atribuir um valor a uma variável somente se essa variável for `null`.

#### Sintaxe:

```csharp
variavel ??= valorPadrao;
```

#### Exemplo:

```csharp
int? numero = null;
numero ??= 10; // numero é null, então recebe o valor 10
```

### Considerações Adicionais

- **Null Safety**: Os recursos acima ajudam a escrever código mais seguro em relação a `null`, reduzindo o risco de `NullReferenceException`.
- **Compatibilidade**: `Nullable<T>`, operador Elvis, e operadores de coalescência nula estão disponíveis a partir do C# 2.0, com melhorias e adições em versões subsequentes do C#.
- **Performance**: O uso de `Nullable<T>` e dos operadores relacionados a `null` pode ter implicações de performance, especialmente em contextos de alta performance, devido à verificação adicional de `null` e à criação de instâncias de `Nullable<T>`.

Estes recursos são essenciais para a programação em C#, permitindo que desenvolvedores gerenciem de forma mais eficaz e segura a possibilidade de valores `null`, melhorando assim a robustez e a legibilidade do código.