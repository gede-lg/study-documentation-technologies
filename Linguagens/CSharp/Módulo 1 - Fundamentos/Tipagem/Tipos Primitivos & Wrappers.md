
C# é uma linguagem de programação fortemente tipada, o que significa que cada variável e expressão tem um tipo claramente definido. Os tipos de dados podem ser divididos em duas categorias: tipos de valor e tipos de referência. Nesta explicação, nos concentraremos nos tipos de valor, especificamente nos tipos primitivos como `bool`, `byte`, `char`, `decimal`, `double`, `float`, `int`, `long`, `sbyte`, `short`, `uint`, `ulong`, e `ushort`.

![[Pasted image 20240215142842.png]]

#### string

- `string` é a palavra-chave C# que é mapeada para o tipo `System.String` do .NET.
- É recomendado usar `string` ao se referir a tipos de dados de texto dentro do código C#, seguindo as convenções de nomenclatura e estilo do C#.
- Exemplo de declaração e uso:

```csharp
string saudacao = "Olá, mundo!";
```

#### bool

- **O que é e para que serve?**  
  O tipo `bool` representa um valor booleano, que pode ser `true` ou `false`. É usado para controlar estruturas de decisão e loops, representando condições.

- **Sintaxe de uso:**  
  ```csharp
  bool isActive = true;
  if (isActive)
  {
      // código a ser executado se isActive for true
  }
  ```

#### byte

- **O que é e para que serve?**  
  `byte` é um tipo integral que armazena valores de 0 a 255. É útil para trabalhar com dados em nível de byte, como arquivos e streams.

- **Sintaxe de uso:**  
  ```csharp
  byte level = 255;
  ```

#### char

- **O que é e para que serve?**  
  O tipo `char` representa um único caractere Unicode. É usado para armazenar caracteres.

- **Sintaxe de uso:**  
  ```csharp
  char letter = 'A';
  ```

#### decimal

- **O que é e para que serve?**  
  `decimal` é um tipo de ponto flutuante de alta precisão, ideal para cálculos financeiros e monetários onde a precisão é crítica.

- **Sintaxe de uso:**  
  ```csharp
  decimal price = 19.95m;
  ```

#### double

- **O que é e para que serve?**  
  `double` é um tipo de ponto flutuante que armazena números com grandes intervalos de valores com precisão de dupla precisão. É comumente usado para representar valores científicos e geométricos.

- **Sintaxe de uso:**  
  ```csharp
  double pi = 3.14159;
  ```

#### float

- **O que é e para que serve?**  
  `float` é um tipo de ponto flutuante que armazena números com precisão simples. É usado quando uma precisão menor é aceitável e para economizar memória.

- **Sintaxe de uso:**  
  ```csharp
  float temperature = 36.6f;
  ```

#### int

- **O que é e para que serve?**  
  `int` é um tipo integral que armazena valores inteiros. É o tipo de número inteiro mais comumente usado.

- **Sintaxe de uso:**  
  ```csharp
  int count = 10;
  ```

#### long

- **O que é e para que serve?**  
  `long` é um tipo integral que armazena valores inteiros maiores do que o tipo `int`. É útil quando valores muito grandes são necessários.

- **Sintaxe de uso:**  
  ```csharp
  long distance = 5000000000L;
  ```

#### sbyte

- **O que é e para que serve?**  
  `sbyte` é um tipo integral que armazena valores de -128 a 127. É útil para economizar memória quando se sabe que o intervalo de valores será limitado.

- **Sintaxe de uso:**  
  ```csharp
  sbyte temperature = -40;
  ```

#### short

- **O que é e para que serve?**  
  `short` é um tipo integral que armazena valores inteiros menores do que `int`. É usado quando valores menores são suficientes, ajudando na economia de memória.

- **Sintaxe de uso:**  
  ```csharp
  short age = 18;
  ```

#### uint

- **O que é e para que serve?**  
  `uint` é uma versão sem sinal do tipo `int`, armazenando valores de 0 a aproximadamente 4.

## Wrappers interessantes

Vamos explorar detalhadamente os tipos em C# que lidam com datas, horas e durações, a saber: `DateTime`, `TimeSpan`, e `DateTimeKind`, além de mencionar o padrão ISO 8601. Cada um desses tipos desempenha um papel fundamental na manipulação de datas e horas em aplicações .NET.

### DateTime - Representando Data e Hora

#### O que é e para que serve?

`DateTime` é um tipo em C# usado para representar datas e horas. Ele é utilizado para armazenar, manipular e comparar valores de data e hora com ou sem informação de fuso horário. Serve para realizar operações como cálculos de datas (adicionar ou subtrair dias, por exemplo) e conversões de formatos.

#### Sintaxe de uso

Para declarar e inicializar uma variável `DateTime`, você pode usar várias de suas sobrecargas de construtor ou métodos estáticos para obter a data e hora atuais, uma data e hora específicas, ou converter strings em `DateTime`.

```csharp
DateTime agora = DateTime.Now; // Data e hora atuais
DateTime hoje = DateTime.Today; // Data atual com a hora ajustada para 00:00:00
DateTime dataEspecifica = new DateTime(2024, 2, 15); // 15 de fevereiro de 2024
```

#### Quando usar

Use `DateTime` sempre que precisar trabalhar com datas e horas em sua aplicação, seja para armazenar marcas temporais, calcular prazos, agendar eventos futuros, ou registrar quando uma ação ocorreu.

### TimeSpan - Representando Durações

#### O que é e para que serve?

`TimeSpan` é um tipo que representa uma duração de tempo. Pode ser utilizado para expressar intervalos de tempo, como a diferença entre duas datas ou a duração de um evento. É útil para cálculos de tempo que envolvem adição e subtração de intervalos de tempo a `DateTime` ou entre dois `DateTime`.

#### Sintaxe de uso

Para criar uma instância de `TimeSpan`, você pode usar um de seus construtores ou métodos estáticos. Aqui estão alguns exemplos:

```csharp
TimeSpan dezHoras = new TimeSpan(10, 0, 0); // 10 horas
TimeSpan trintaMinutos = TimeSpan.FromMinutes(30); // 30 minutos
```

#### Quando usar

Utilize `TimeSpan` quando precisar medir a duração de um evento, calcular diferenças entre horários, ou somar e subtrair intervalos de tempo a uma data/hora.

### Propriedades e operações com DateTime

`DateTime` oferece diversas propriedades e métodos para manipular datas e horas. Algumas das propriedades mais usadas incluem `Year`, `Month`, `Day`, `Hour`, `Minute`, `Second`, permitindo acessar individualmente cada componente de uma data e hora.

Operações comuns com `DateTime` incluem adicionar ou subtrair períodos de tempo usando `AddDays`, `AddMonths`, `AddHours`, etc. Você também pode calcular a diferença entre duas datas usando o operador `-`, resultando em um `TimeSpan`.

```csharp
DateTime dataInicial = new DateTime(2024, 1, 1);
DateTime dataFinal = dataInicial.AddDays(30); // Adiciona 30 dias
TimeSpan diferenca = dataFinal - dataInicial; // Diferença entre as datas
```

### Propriedades e operações com TimeSpan

`TimeSpan` também possui várias propriedades úteis, como `Days`, `Hours`, `Minutes`, `Seconds`, que permitem acessar as partes constituintes do intervalo de tempo. Além disso, você pode somar (`+`) ou subtrair (`-`) objetos `TimeSpan` entre si, ou multiplicá-los ou dividi-los por um número (`*` e `/`), para ajustar a duração.

```csharp
TimeSpan intervalo1 = TimeSpan.FromHours(1.5);
TimeSpan intervalo2 = TimeSpan.FromMinutes(45);
TimeSpan total = intervalo1 + intervalo2; // Soma dos intervalos
TimeSpan metade = total / 2; // Divide o total por 2
```

### DateTimeKind e padrão ISO 8601

#### O que é e para que serve?

`DateTimeKind` é uma enumeração que especifica se o valor de um `DateTime` representa a hora local, a hora UTC (Tempo Universal Coordenado), ou é não especificado. Isso

 é crucial para operações que envolvem fuso horário.

O padrão ISO 8601 é uma norma internacional para representação de datas e horas, ajudando a evitar ambiguidades. Ele especifica, por exemplo, o formato `YYYY-MM-DD` para datas e `YYYY-MM-DDTHH:MM:SS` para datas e horas, facilitando a interoperabilidade entre sistemas.

#### Sintaxe de uso

Para definir ou verificar o `DateTimeKind` de um `DateTime`:

```csharp
DateTime dataLocal = DateTime.Now; // Data e hora locais
DateTime dataUtc = DateTime.UtcNow; // Data e hora UTC
DateTimeKind tipo = dataLocal.Kind; // Verifica o tipo (Local, Utc ou Unspecified)
```

Para formatar uma data no padrão ISO 8601:

```csharp
string iso8601 = dataUtc.ToString("o"); // Converte para string no formato ISO 8601
```

#### Quando usar

Utilize `DateTimeKind` para gerenciar corretamente os dados de data e hora em cenários que envolvem múltiplos fusos horários. Adote o padrão ISO 8601 ao armazenar, transmitir, ou comunicar-se com outras aplicações e sistemas para garantir clareza e compatibilidade.

### String (tipo .NET)

- `String` refere-se diretamente à classe `System.String` do .NET Framework.
- Pode ser mais apropriado usar `String` quando se está chamando métodos estáticos definidos na classe `String`, como `String.Format`, `String.Concat`, etc., embora isso também possa ser feito usando o alias `string`.
- Exemplo de declaração e uso:

```csharp
String mensagem = String.Format("Hoje é {0:d}", DateTime.Now);
```

### Funcionalidades e Operações

Tanto `string` quanto `String` em C# suportam uma ampla gama de funcionalidades para manipulação de texto, incluindo, mas não se limitando a:

- Concatenação de strings (`+` ou `String.Concat`)
- Formatação de strings (`String.Format`, interpolação de string `$"..."`)
- Comparação de strings (`String.Compare`, `string.Equals`)
- Pesquisa e manipulação de substrings (`String.IndexOf`, `String.Substring`, `String.Replace`)
- Verificação de conteúdo (`String.IsNullOrEmpty`, `String.IsNullOrWhiteSpace`)

### Recomendações de Uso

Embora `string` e `String` sejam intercambiáveis, há algumas diretrizes gerais para seu uso:

- **Preferir `string` para declaração de variáveis e parâmetros**: Isso mantém o código consistente com outras palavras-chave de tipo em C# como `int`, `bool`, etc., que são todas em minúsculas.
- **Preferir `String` ao chamar métodos estáticos específicos da classe `String`**: Isso pode ajudar a destacar que o método pertence à classe `String` do .NET, embora usar `string` para esses casos também seja perfeitamente válido.

### Exemplos de Código

Aqui estão alguns exemplos que ilustram operações comuns com strings em C#:

```csharp
// Concatenação
string nome = "Mundo";
string saudacao = "Olá, " + nome + "!";

// Formatação
string dataFormatada = String.Format("Hoje é {0:dd/MM/yyyy}", DateTime.Now);

// Interpolação
string interpolação = $"Olá, {nome}!";

// Comparação
bool sãoIguais = String.Equals(saudacao, interpolação, StringComparison.OrdinalIgnoreCase);

// Pesquisa
int indice = saudacao.IndexOf('M');
```
