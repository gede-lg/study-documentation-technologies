# BigDecimal em Java

## O que é e para que serve?

`BigDecimal` é uma classe em Java que representa números decimais de precisão arbitrária. Ela é utilizada quando é necessário realizar cálculos precisos e evitar os problemas de arredondamento associados aos tipos primitivos de ponto flutuante, como `double` e `float`. Em situações onde a precisão é crítica, como em cálculos financeiros, cálculos científicos ou em qualquer situação que envolva valores monetários, `BigDecimal` é a escolha preferencial.

## Sintaxe de uso e exemplo

Para utilizar `BigDecimal` em Java, primeiro você precisa importar a classe no seu código:

```java
import java.math.BigDecimal;
```

Em seguida, você pode criar um objeto `BigDecimal` passando uma string representando o valor que você deseja representar:

```java
BigDecimal valor = new BigDecimal("10.5");
```

Você também pode criar um `BigDecimal` a partir de um valor inteiro ou double:

```java
BigDecimal valorInteiro = BigDecimal.valueOf(10);
BigDecimal valorDouble = BigDecimal.valueOf(10.5);
```

## Métodos e sintaxe de uso de cada um deles

### Construtores

1. **`BigDecimal(String val)`**: Cria um novo `BigDecimal` a partir de uma string que representa o valor decimal.
   
   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("10.5");
   ```

2. **`BigDecimal(double val)`** ou **`BigDecimal(int val)`**: Cria um novo `BigDecimal` a partir de um valor `double` ou `int`.
   
   Exemplo:
   ```java
   BigDecimal valorDouble = BigDecimal.valueOf(10.5);
   BigDecimal valorInteiro = BigDecimal.valueOf(10);
   ```

### Operações Aritméticas

1. **`add(BigDecimal augend)`**: Adiciona outro `BigDecimal` ao objeto atual e retorna o resultado.

   Exemplo:
   ```java
   BigDecimal resultado = valor1.add(valor2);
   ```

2. **`subtract(BigDecimal subtrahend)`**: Subtrai outro `BigDecimal` do objeto atual e retorna o resultado.

   Exemplo:
   ```java
   BigDecimal resultado = valor1.subtract(valor2);
   ```

3. **`multiply(BigDecimal multiplicand)`**: Multiplica o objeto atual por outro `BigDecimal` e retorna o resultado.

   Exemplo:
   ```java
   BigDecimal resultado = valor1.multiply(valor2);
   ```

4. **`divide(BigDecimal divisor, int scale, RoundingMode roundingMode)`**: Divide o objeto atual por outro `BigDecimal`, especificando a escala de arredondamento e o modo de arredondamento. Retorna o resultado.

   Exemplo:
   ```java
   BigDecimal resultado = valor1.divide(valor2, 2, RoundingMode.HALF_UP);
   ```

### Comparação

1. **`compareTo(BigDecimal val)`**: Compara o objeto atual com outro `BigDecimal`. Retorna 0 se os valores forem iguais, um valor negativo se o objeto atual for menor que `val`, e um valor positivo se o objeto atual for maior que `val`.

   Exemplo:
   ```java
   int comparacao = valor1.compareTo(valor2);
   ```

2. **`equals(Object x)`**: Verifica se o objeto atual é igual a outro `BigDecimal`.

   Exemplo:
   ```java
   boolean igual = valor1.equals(valor2);
   ```

### Conversão

1. **`intValue()`**, **`longValue()`**, **`floatValue()`**, **`doubleValue()`**: Convertem o valor do `BigDecimal` para os tipos primitivos `int`, `long`, `float` ou `double`, respectivamente.

   Exemplo:
   ```java
   int valorInt = valor.intValue();
   ```

2. **`toBigInteger()`**: Converte o valor do `BigDecimal` para um objeto `BigInteger`.

   Exemplo:
   ```java
   BigInteger valorBigInt = valor.toBigInteger();
   ```

### Formatação

#### Formatação como String

1. **`toString()`**: Retorna uma representação string do valor `BigDecimal`, sem aplicar formatação especial. 

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   String valorFormatado = valor.toString(); // "1234.56789"
   ```

2. **`toPlainString()`**: Retorna uma representação string do valor `BigDecimal` sem notação científica.

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   String valorFormatado = valor.toPlainString(); // "1234.56789"
   ```

#### Formatação com Precisão

1. **`setScale(int newScale)`**: Define a escala (número de dígitos após o ponto decimal) do valor `BigDecimal`. Esse método não realiza arredondamento.

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   BigDecimal valorFormatado = valor.setScale(2); // 1234.57
   ```

2. **`setScale(int newScale, RoundingMode roundingMode)`**: Define a escala (número de dígitos após o ponto decimal) do valor `BigDecimal` e especifica o modo de arredondamento a ser utilizado.

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   BigDecimal valorFormatado = valor.setScale(2, RoundingMode.HALF_UP); // 1234.57
   ```

#### Formatação de String Customizada

1. **`format()`**: Permite formatar um `BigDecimal` utilizando um objeto `DecimalFormat`.

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   DecimalFormat formato = new DecimalFormat("#,##0.00");
   String valorFormatado = formato.format(valor); // "1,234.57"
   ```

#### Notação Científica

1. **`toEngineeringString()`**: Retorna uma representação string do valor `BigDecimal` em notação científica, mas tenta utilizar uma forma mais legível.

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   String valorFormatado = valor.toEngineeringString(); // "1.23456789E3"
   ```

2. **`toScientificString()`**: Retorna uma representação string do valor `BigDecimal` em notação científica padrão.

   Exemplo:
   ```java
   BigDecimal valor = new BigDecimal("1234.56789");
   String valorFormatado = valor.toEngineeringString(); // "1.23456789E3"
   ```
## Considerações Finais

`BigDecimal` em Java é uma ferramenta poderosa para lidar com números decimais com precisão arbitrária. Ao utilizar `BigDecimal`, você pode garantir cálculos precisos em situações críticas onde a precisão é essencial. Certifique-se de utilizar os métodos apropriados para arredondamento e comparação para garantir resultados precisos em todas as operações.