## Módulo 6: Entrada e Saída de Dados em Java - Streams e Buffers

### 1. Introdução às Entradas e Saídas em Java

Na programação, entrada e saída (I/O) referem-se ao processo de comunicação entre um programa e o ambiente externo, como o teclado, o disco rígido ou outros dispositivos. Em Java, a I/O é gerenciada por meio de Streams e Buffers.

### 2. Streams em Java

- Streams representam o fluxo de dados de entrada ou saída, como um fluxo contínuo de bytes.
- Em Java, os Streams são divididos em duas categorias principais: InputStreams (entrada) e OutputStreams (saída).

### 3. InputStreams

#### 3.1. Classe Scanner
- A classe Scanner é uma forma conveniente de ler dados de entrada a partir de várias fontes, como teclado ou arquivos.
- Ela está localizada no pacote `java.util`.
- Para utilizá-la, você deve importá-la em seu código.

Exemplo de criação de um objeto Scanner para leitura do teclado:

```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
```

#### 3.2. Métodos da Classe Scanner

Aqui estão alguns dos métodos mais comuns da classe Scanner para leitura de diferentes tipos de dados:

- `nextLine()`: Lê uma linha de texto (incluindo espaços em branco).
```java
String input = scanner.nextLine();
```

- `nextInt()`: Lê um número inteiro.
```java
int number = scanner.nextInt();
```

- `nextDouble()`: Lê um número de ponto flutuante.
```java
double doubleValue = scanner.nextDouble();
```

- `nextBoolean()`: Lê um valor booleano (true ou false).
```java
boolean boolValue = scanner.nextBoolean();
```

- `next()` e `next(Pattern pattern)`: Lê tokens (sequências de caracteres delimitadas por espaços em branco).
```java
String token = scanner.next();
```

- `hasNext()`: Verifica se ainda há mais dados para ler.
```java
if (scanner.hasNext()) {
    // Continue a leitura
}
```

### 4. OutputStreams

- OutputStreams são usados para escrever dados em diferentes fontes, como arquivos ou saída padrão.
- Para criar um OutputStream, você precisa importar a classe `java.io.OutputStream` e trabalhar com suas subclasses.

Exemplo de escrita em um arquivo:

```java
import java.io.FileOutputStream;
import java.io.OutputStream;

try (OutputStream outputStream = new FileOutputStream("arquivo.txt")) {
    String data = "Conteúdo a ser escrito no arquivo.";
    byte[] bytes = data.getBytes();
    outputStream.write(bytes);
} catch (Exception e) {
    e.printStackTrace();
}
```

### 5. Buffers

- Buffers são utilizados para armazenar dados temporariamente, otimizando as operações de entrada e saída.
- Os buffers podem ser usados em conjunto com Streams para melhorar o desempenho.

Exemplo de uso de um BufferedReader para ler linhas de um arquivo:

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

try (BufferedReader reader = new BufferedReader(new FileReader("arquivo.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### 6. Conclusão

Este módulo cobriu os conceitos fundamentais de entrada e saída em Java, com foco em Streams, InputStreams, OutputStreams, a classe Scanner e o uso de Buffers. Compreender esses conceitos é essencial para realizar operações de leitura e escrita de dados eficientes em seus programas Java.