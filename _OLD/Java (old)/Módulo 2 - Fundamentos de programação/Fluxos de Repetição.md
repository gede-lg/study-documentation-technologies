## Módulo 2: Fundamentos de Programação em Java

### Estruturas de Controle

Estruturas de controle são fundamentais na programação Java, permitindo que o programa tome decisões e execute repetições de forma controlada. Este módulo cobre os principais tipos de estruturas de controle: condicionais e loops.

### 1.  Condicionais

### `if-else`
- **Descrição**: A instrução `if` é usada para testar uma condição. Se a condição for verdadeira, o bloco de código dentro do `if` é executado. Caso contrário, o bloco de código dentro do `else` é executado.
- **Exemplo de Código**:
  ```java
  int numero = 10;
  if (numero > 0) {
      System.out.println("O número é positivo.");
  } else {
      System.out.println("O número é negativo ou zero.");
  }
  ```

### `switch`
- **Descrição**: A instrução `switch` permite que uma variável seja testada para igualdade em relação a uma lista de valores. Cada valor é chamado de "case" e o bloco de código correspondente é executado quando a variável corresponde a esse case.
- **Exemplo de Código**:
  ```java
  int dia = 4;
  switch (dia) {
      case 1:
          System.out.println("Segunda-feira");
          break;
      case 2:
          System.out.println("Terça-feira");
          break;
      // ... Outros casos ...
      default:
          System.out.println("Dia inválido");
  }
  ```

### `Operador Ternário`

- **Descrição**: O operador ternário é uma forma compacta de expressar uma instrução `if-else`. É composto por uma condição seguida de um ponto de interrogação (`?`), então o valor se a condição for verdadeira, um dois-pontos (`:`), e o valor se a condição for falsa.
- **Exemplo de Código**:
  ```java
  int a = 5, b = 10;
  String resultado = (a > b) ? "A é maior" : "B é maior";
  System.out.println(resultado);
  ```

### 2. Loops

### `for`
- **Descrição**: O loop `for` é usado quando sabemos antecipadamente quantas vezes queremos executar um bloco de código. Ele consiste em três partes: inicialização, condição e incremento/decremento.
- **Exemplo de Código**:
  ```java
  for (int i = 0; i < 5; i++) {
      System.out.println("Valor de i: " + i);
  }
  ```

### `while`
- **Descrição**: O loop `while` executa um bloco de código enquanto uma condição especificada é verdadeira.
- **Exemplo de Código**:
  ```java
  int i = 0;
  while (i < 5) {
      System.out.println("Valor de i: " + i);
      i++;
  }
  ```

### `do-while`
- **Descrição**: Semelhante ao `while`, mas a condição é testada após a execução do bloco de código, garantindo que o bloco seja executado pelo menos uma vez.
- **Exemplo de Código**:
  ```java
  int i = 0;
  do {
      System.out.println("Valor de i: " + i);
      i++;
  } while (i < 5);
  ```

### `foreach`
- **Descrição**: O loop `foreach` é usado para percorrer arrays ou coleções. É menos flexível que o loop `for` tradicional, mas é mais fácil de usar quando queremos percorrer todos os elementos de um array ou coleção.
- **Exemplo de Código**:
  ```java
  String[] frutas = {"Maçã", "Banana", "Pera"};
  for (String fruta : frutas) {
      System.out.println(fruta);
  }
  ```

## Conclusão

Este módulo oferece uma compreensão detalhada das estruturas de controle em Java. A prática consistente desses conceitos é crucial para desenvolver habilidades sólidas de programação em Java. É recomendado que os alunos realizem exercícios

 que envolvam combinações dessas estruturas para resolver problemas complexos e se familiarizarem com os padrões de pensamento lógico e algorítmico.