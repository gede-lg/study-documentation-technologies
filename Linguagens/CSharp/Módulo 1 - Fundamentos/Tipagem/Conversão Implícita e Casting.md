### O que é e para que serve?

Conversão implícita e casting são técnicas utilizadas para converter um tipo de dado em outro em C#. A conversão implícita ocorre quando não há perda de dados no processo de conversão e é realizada automaticamente pelo compilador. Já o casting (ou conversão explícita) é necessário quando pode haver perda de dados ou quando se deseja forçar a conversão de um tipo para outro.

### Conversão Implícita:

Na conversão implícita, o compilador é capaz de realizar a conversão de um tipo para outro de forma automática quando não há perda de dados. Por exemplo:

```csharp
int numeroInteiro = 10;
double numeroDecimal = numeroInteiro; // Conversão implícita de int para double
```

Neste exemplo, o valor da variável `numeroInteiro` é implicitamente convertido para `double` sem a necessidade de qualquer tipo de casting explícito.

### Casting (Conversão Explícita):

O casting é utilizado quando se deseja converter explicitamente um tipo de dado em outro, podendo haver perda de dados no processo. A sintaxe para realizar o casting é colocar o tipo desejado entre parênteses antes do valor que se deseja converter. Por exemplo:

```csharp
double numeroDecimal = 10.5;
int numeroInteiro = (int)numeroDecimal; // Conversão explícita de double para int
```

Neste caso, o valor `10.5` é convertido explicitamente para `10`, perdendo a parte decimal. Se não houver um casting explícito, ocorrerá um erro de compilação.

### Métodos de Conversão de cada Wrapper:

Cada tipo primitivo em C# possui métodos para conversão entre eles. Aqui estão alguns exemplos:

- **Conversão para Inteiro (int):**
  - `Convert.ToInt32(valor)`
  - `int.Parse(string)`
  - `int.TryParse(string, out int resultado)`

- **Conversão para Double:**
  - `Convert.ToDouble(valor)`
  - `double.Parse(string)`
  - `double.TryParse(string, out double resultado)`

- **Conversão para Float:**
  - `Convert.ToSingle(valor)`
  - `float.Parse(string)`
  - `float.TryParse(string, out float resultado)`

- **Conversão para String:**
  - `Convert.ToString(valor)`
  - `valor.ToString()`

### Exemplo de Uso:

```csharp
string numeroString = "10";
int numeroInteiro = int.Parse(numeroString); // Conversão de string para int
Console.WriteLine(numeroInteiro); // Saída: 10

double numeroDecimal = 10.5;
int numeroInteiro = (int)numeroDecimal; // Casting de double para int
Console.WriteLine(numeroInteiro); // Saída: 10
```

### Considerações Finais:

- É importante utilizar o tipo de conversão adequado para evitar possíveis erros ou perdas de dados.
- Sempre que possível, prefira a conversão implícita, pois é mais segura e mais fácil de ler.
- Ao utilizar o casting, esteja ciente de possíveis perdas de dados e certifique-se de que a conversão é necessária e segura.