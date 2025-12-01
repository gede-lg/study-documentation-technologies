## Operadores Lógicos

Os operadores lógicos em C# são utilizados para realizar operações de lógica booleana em expressões condicionais. Eles permitem combinar múltiplas condições para determinar se uma expressão é verdadeira ou falsa. Os operadores lógicos mais comuns são `&&` (AND), `||` (OR) e `!` (NOT).

#### O que é e para que serve?

Os operadores lógicos são fundamentais para controlar o fluxo de execução do programa, permitindo tomar decisões com base em múltiplas condições. Eles são amplamente utilizados em estruturas condicionais como `if`, `else`, `while`, `do-while`, `for`, entre outros. Com esses operadores, é possível construir expressões que avaliam diversas condições ao mesmo tempo.

#### Operadores Lógicos Disponíveis:

### AND (`&&`):

O operador `&&` retorna verdadeiro se todas as condições especificadas forem verdadeiras. Caso contrário, retorna falso.

Exemplo:

```csharp
int idade = 25;
bool possuiCarteiraMotorista = true;

if (idade >= 18 && possuiCarteiraMotorista)
{
    Console.WriteLine("Você pode dirigir.");
}
```

### OR (`||`):

O operador `||` retorna verdadeiro se pelo menos uma das condições especificadas for verdadeira. Retorna falso apenas se todas as condições forem falsas.

Exemplo:

```csharp
bool temFilhos = true;
bool temPet = false;

if (temFilhos || temPet)
{
    Console.WriteLine("Você tem responsabilidades familiares.");
}
```

### NOT (`!`):

O operador `!` (NOT) inverte o valor de uma expressão booleana. Se a expressão for verdadeira, torna-se falsa, e vice-versa.

Exemplo:

```csharp
bool chovendo = true;

if (!chovendo)
{
    Console.WriteLine("Vamos fazer um piquenique.");
}
```

#### Prioridade de Avaliação:

A ordem de avaliação dos operadores lógicos é:

1. `!` (NOT)
2. `&&` (AND)
3. `||` (OR)

## Operadores de Atribuição
#### O que são e para que servem?

Os operadores de atribuição em C# são utilizados para atribuir valores a variáveis. Eles são fundamentais na programação, pois permitem que você armazene e manipule dados dentro de um programa. Através dos operadores de atribuição, você pode atualizar o valor de uma variável com base em operações matemáticas, valores de outras variáveis ou valores fixos.

#### Classes e Métodos

Em C#, os operadores de atribuição podem ser utilizados em conjunto com variáveis de diferentes tipos de dados, e também podem ser aplicados em expressões mais complexas.

##### Sintaxe de uso:

- **Atribuição Simples (`=`):** O operador de atribuição simples (`=`) é usado para atribuir um valor a uma variável. Por exemplo:

```csharp
int x = 10;
```

Nesse exemplo, o valor `10` é atribuído à variável `x`.

- **Operadores de Atribuição Compostos:**
  - **`+=` (Adição e Atribuição):** Este operador adiciona o valor do operando direito ao valor do operando esquerdo e atribui o resultado à variável. Por exemplo:

  ```csharp
  int x = 5;
  x += 3; // Equivalente a x = x + 3;
  ```

  Após essa operação, `x` será igual a `8`.

  - **`-=` (Subtração e Atribuição):** Este operador subtrai o valor do operando direito do valor do operando esquerdo e atribui o resultado à variável. Por exemplo:

  ```csharp
  int x = 10;
  x -= 4; // Equivalente a x = x - 4;
  ```

  Após essa operação, `x` será igual a `6`.

  - **`*=` (Multiplicação e Atribuição):** Este operador multiplica o valor do operando direito pelo valor do operando esquerdo e atribui o resultado à variável. Por exemplo:

  ```csharp
  int x = 3;
  x *= 2; // Equivalente a x = x * 2;
  ```

  Após essa operação, `x` será igual a `6`.

  - **`/=` (Divisão e Atribuição):** Este operador divide o valor do operando esquerdo pelo valor do operando direito e atribui o resultado à variável. Por exemplo:

  ```csharp
  int x = 10;
  x /= 2; // Equivalente a x = x / 2;
  ```

  Após essa operação, `x` será igual a `5`.

  - **`%=` (Módulo e Atribuição):** Este operador calcula o resto da divisão do valor do operando esquerdo pelo valor do operando direito e atribui o resultado à variável. Por exemplo:

  ```csharp
  int x = 10;
  x %= 3; // Equivalente a x = x % 3;
  ```

  Após essa operação, `x` será igual a `1`, pois `10 % 3 = 1`.

#### Observações Importantes:

- Os operadores de atribuição compostos são úteis para simplificar o código, especialmente quando você precisa realizar uma operação matemática em uma variável e atribuir o resultado de volta à mesma variável.
- É importante ter cuidado ao utilizar operadores de atribuição para evitar erros lógicos e garantir que os cálculos sejam realizados conforme o esperado.
- Ao trabalhar com classes e objetos, os operadores de atribuição podem ser utilizados para atribuir valores aos membros de um objeto.

Em resumo, os operadores de atribuição em C# são ferramentas essenciais para a manipulação de variáveis ​​e são utilizados para atribuir valores, realizar operações matemáticas e simplificar o código. Entender como e quando utilizar esses operadores é fundamental para o desenvolvimento de aplicativos eficientes e livres de erros.
## Operadores Aritméticos

1. **Adição (+):** Realiza a adição de dois operandos.
   
   ```csharp
   int a = 5;
   int b = 3;
   int resultado = a + b; // resultado será 8
   ```

2. **Subtração (-):** Realiza a subtração do operando da esquerda pelo operando da direita.

   ```csharp
   int a = 5;
   int b = 3;
   int resultado = a - b; // resultado será 2
   ```

3. **Multiplicação (*):** Realiza a multiplicação dos dois operandos.

   ```csharp
   int a = 5;
   int b = 3;
   int resultado = a * b; // resultado será 15
   ```

4. **Divisão (/):** Realiza a divisão do operando da esquerda pelo operando da direita.

   ```csharp
   int a = 6;
   int b = 3;
   int resultado = a / b; // resultado será 2
   ```

5. **Módulo (%):** Retorna o resto da divisão do operando da esquerda pelo operando da direita.

   ```csharp
   int a = 7;
   int b = 3;
   int resultado = a % b; // resultado será 1
   ```
## Operadores Comparativos

1. **Igualdade (`==`):**
   - Este operador verifica se dois valores são iguais.
   - Sintaxe: `a == b`
   - Exemplo:
     ```csharp
     int a = 5;
     int b = 5;
     bool resultado = (a == b); // resultado é true
     ```

2. **Desigualdade (`!=`):**
   - Este operador verifica se dois valores são diferentes.
   - Sintaxe: `a != b`
   - Exemplo:
     ```csharp
     int a = 5;
     int b = 10;
     bool resultado = (a != b); // resultado é true
     ```

3. **Maior Que (`>`):**
   - Verifica se o valor da esquerda é maior que o valor da direita.
   - Sintaxe: `a > b`
   - Exemplo:
     ```csharp
     int a = 10;
     int b = 5;
     bool resultado = (a > b); // resultado é true
     ```

4. **Menor Que (`<`):**
   - Verifica se o valor da esquerda é menor que o valor da direita.
   - Sintaxe: `a < b`
   - Exemplo:
     ```csharp
     int a = 5;
     int b = 10;
     bool resultado = (a < b); // resultado é true
     ```

5. **Maior ou Igual (`>=`):**
   - Verifica se o valor da esquerda é maior ou igual ao valor da direita.
   - Sintaxe: `a >= b`
   - Exemplo:
     ```csharp
     int a = 10;
     int b = 10;
     bool resultado = (a >= b); // resultado é true
     ```

6. **Menor ou Igual (`<=`):**
   - Verifica se o valor da esquerda é menor ou igual ao valor da direita.
   - Sintaxe: `a <= b`
   - Exemplo:
     ```csharp
     int a = 5;
     int b = 10;
     bool resultado = (a <= b); // resultado é true
     ```