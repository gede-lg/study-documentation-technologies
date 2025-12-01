## O que é e para que serve?

A entrada de dados em C# refere-se ao processo de receber informações do usuário durante a execução de um programa. Essas informações podem ser inseridas pelo teclado, pelo mouse ou por outros dispositivos de entrada. A capacidade de receber entrada de dados é essencial para interações com o usuário em aplicativos e programas.

## Classes e Métodos para Ler Dados do Teclado:

Em C#, existem várias maneiras de ler dados do teclado. Duas das classes mais comuns usadas para entrada de dados são `Console` e `Scanner` (da biblioteca `System`). Vamos explorar cada uma delas:

### 1. Classe Console:

#### O que é e para que serve?

A classe `Console` em C# fornece funcionalidades para interação básica com a linha de comando. Ela é amplamente utilizada para exibir informações na tela e ler entrada do usuário. A entrada de dados é fundamental para permitir que os programas interajam com os usuários de forma dinâmica, possibilitando a personalização e a adaptação do comportamento do programa com base nas informações fornecidas pelo usuário.

#### Métodos da Classe Console para Entrada de Dados:

##### 1. **`ReadLine()`**:
Este método lê uma linha de entrada do usuário e retorna-a como uma string. Ele espera que o usuário pressione a tecla "Enter" para enviar a entrada.
```csharp
Console.WriteLine("Digite seu nome:");
string nome = Console.ReadLine();
Console.WriteLine("Olá, " + nome + "! Bem-vindo!");
```

##### 2. **`Read()`**:
Este método lê o próximo caractere ou a próxima tecla de função do fluxo de entrada do console. Ele retorna um valor do tipo `int`, que representa o valor Unicode do caractere lido. Isso pode ser convertido para um caractere se necessário.
```csharp
Console.WriteLine("Pressione qualquer tecla para continuar...");
int tecla = Console.Read();
Console.WriteLine("A tecla pressionada foi: " + Convert.ToChar(tecla));
```

##### 3. **`ReadKey()`**:
Este método lê a próxima tecla de função ou a tecla de seta do fluxo de entrada do console e a exibe na tela. Ele retorna um objeto `ConsoleKeyInfo`, que contém informações sobre a tecla pressionada.
```csharp
Console.WriteLine("Pressione uma tecla de função:");
ConsoleKeyInfo teclaInfo = Console.ReadKey();
Console.WriteLine("Você pressionou: " + teclaInfo.Key);
```

##### 4. **`ReadLineMasked()`** (Personalizado):
Este método simula a entrada de senha, ocultando os caracteres digitados pelo usuário. Ele lê uma linha de entrada do usuário, mas exibe caracteres de substituição (geralmente asteriscos) no lugar dos caracteres digitados.
```csharp
public static string ReadLineMasked()
{
    StringBuilder input = new StringBuilder();
    while (true)
    {
        ConsoleKeyInfo key = Console.ReadKey(true);
        if (key.Key == ConsoleKey.Enter)
        {
            Console.WriteLine();
            break;
        }
        else if (key.Key == ConsoleKey.Backspace)
        {
            if (input.Length > 0)
            {
                input.Remove(input.Length - 1, 1);
                Console.Write("\b \b");
            }
        }
        else
        {
            input.Append(key.KeyChar);
            Console.Write("*");
        }
    }
    return input.ToString();
}
```
Exemplo de uso:
```csharp
Console.WriteLine("Digite sua senha:");
string senha = ReadLineMasked();
Console.WriteLine("Senha digitada: " + senha);
```

#### Considerações Adicionais:
- Ao utilizar métodos de entrada de dados, é importante validar e tratar os dados fornecidos pelo usuário para garantir a robustez e a segurança do programa.
- Para evitar problemas de bloqueio de entrada, é recomendável utilizar métodos de leitura de entrada de forma assíncrona em aplicativos multithreaded ou de interface gráfica.
- Em cenários mais complexos, como aplicações de linha de comando interativas, pode ser necessário implementar um loop de entrada contínua para processar múltiplas entradas do usuário.
- A classe `Console` também fornece métodos para configurar a cor do texto, o tamanho da janela do console e outras configurações relacionadas à interface do usuário.
### 2. Classe Scanner (do Java):

#### O que é e para que serve?

O `Scanner` em C# é uma classe que permite ler entrada de dados de diferentes tipos a partir do console. Ele facilita a interação com o usuário, tornando possível solicitar informações e utilizá-las no programa. Com o `Scanner`, podemos ler números inteiros, números de ponto flutuante, strings e outros tipos de dados.

#### Métodos e Sintaxe de Uso:

1. **Leitura de Inteiros:**

```csharp
int numero;
Console.WriteLine("Digite um número inteiro:");
numero = Convert.ToInt32(Console.ReadLine());
```

Neste exemplo, utilizamos o método `Console.ReadLine()` para ler uma linha de entrada do console e `Convert.ToInt32()` para converter essa linha em um número inteiro.

2. **Leitura de Números de Ponto Flutuante:**

```csharp
double numero;
Console.WriteLine("Digite um número decimal:");
numero = Convert.ToDouble(Console.ReadLine());
```

Da mesma forma que a leitura de inteiros, usamos `Console.ReadLine()` para ler a entrada do usuário e `Convert.ToDouble()` para converter a string em um número de ponto flutuante.

3. **Leitura de Strings:**

```csharp
string texto;
Console.WriteLine("Digite uma mensagem:");
texto = Console.ReadLine();
```

Aqui, simplesmente usamos `Console.ReadLine()` para ler uma linha de entrada do console e armazená-la em uma variável do tipo string.

4. **Leitura de Caracteres:**

```csharp
char caractere;
Console.WriteLine("Digite um caractere:");
caractere = Console.ReadKey().KeyChar;
```

Neste caso, utilizamos `Console.ReadKey().KeyChar` para ler um único caractere do console sem a necessidade de pressionar Enter. Este método é útil para casos em que desejamos ler um único caractere sem esperar que o usuário pressione Enter.

5. **Leitura de Múltiplos Valores:**

```csharp
int numero1, numero2;
Console.WriteLine("Digite dois números separados por espaço:");
string[] valores = Console.ReadLine().Split(' ');
numero1 = Convert.ToInt32(valores[0]);
numero2 = Convert.ToInt32(valores[1]);
```

Aqui, dividimos a entrada do usuário usando o método `Split()` para separar os valores com base em um espaço. Em seguida, convertemos esses valores de string em inteiros utilizando `Convert.ToInt32()`.

#### Considerações Adicionais:

- Sempre devemos validar a entrada do usuário para garantir que os dados fornecidos sejam do tipo esperado e estejam dentro do intervalo desejado.
- É importante fornecer mensagens claras para orientar o usuário sobre o que deve ser inserido.
- Para facilitar a leitura e manutenção do código, é recomendável encapsular a lógica de entrada de dados em métodos separados. Isso ajuda a promover a reutilização do código e torná-lo mais legível.

Utilizando o `Scanner` em C#, podemos criar programas interativos e úteis que permitem aos usuários fornecer dados de entrada e interagir com o software de maneira eficaz.