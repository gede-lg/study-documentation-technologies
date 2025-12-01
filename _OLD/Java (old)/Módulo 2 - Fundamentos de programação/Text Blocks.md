Os Text Blocks, introduzidos no Java a partir da versão 13 como uma funcionalidade de visualização e estabelecidos oficialmente no Java 15, são uma forma de representar strings literais que abrangem várias linhas. Essa funcionalidade é particularmente útil para lidar com textos grandes e formatados, como SQL, JSON, HTML, entre outros. Eles melhoram significativamente a legibilidade e a manutenção do código.

### Sintaxe Básica
Um Text Block começa e termina com três aspas duplas (`"""`). Tudo o que está dentro destas delimitações é considerado parte do Text Block. Aqui está um exemplo básico:

```java
String text = """
              Olá,
              Este é um exemplo de um Text Block em Java.
              """;
```

### Características Principais
1. **Preservação de Formato**: Espaços em branco e quebras de linha são preservados exatamente como estão dentro das delimitações.
   
2. **Sem Necessidade de Caracteres de Escape**: Dentro de um Text Block, não é necessário escapar as aspas duplas, o que torna mais fácil trabalhar com strings que contêm muitas aspas.

3. **Indentação Automática**: A indentação do código é gerenciada de maneira inteligente para alinhar a string com o código circundante.

4. **Concatenação de Strings**: Assim como strings literais normais, Text Blocks podem ser concatenados com outras strings ou Text Blocks.

### Exemplos de Uso
- **SQL**:
  ```java
  String query = """
                 SELECT *
                 FROM users
                 WHERE id = ?
                 """;
  ```
  Este exemplo é útil para manter a legibilidade de consultas SQL complexas.

- **JSON**:
  ```java
  String json = """
                {
                  "nome": "John",
                  "idade": 30
                }
                """;
  ```
  Aqui, um Text Block simplifica a criação de um literal JSON.

- **HTML**:
  ```java
  String html = """
                <html>
                    <body>
                        <p>Hello, World!</p>
                    </body>
                </html>
                """;
  ```
  Ideal para embutir HTML de forma legível em seu código Java.

### Considerações
- A indentação dentro do Text Block é sensível e pode afetar o conteúdo da string. Portanto, é importante prestar atenção à indentação para garantir que a string seja formatada como desejado.
- Text Blocks são especialmente úteis quando se trabalha com frameworks que usam muitas strings multilinhas, como SQL, HTML/XML, e linguagens de script.

Text Blocks são um exemplo de como o Java continua evoluindo para melhorar a experiência do desenvolvedor, facilitando o trabalho com strings multilinhas de uma maneira mais limpa e legível.

### Format Prints

Na linguagem Java, quando você usa métodos como `printf` ou `String.format`, você pode inserir várias variáveis em uma string utilizando placeholders específicos para cada tipo de dado. Esses placeholders são especificados por um `%` seguido por um caractere que indica o tipo de dado que você está formatando. Aqui estão alguns dos mais comuns:

- **%s**: Para strings. Pode ser usado para qualquer tipo de dado, pois o converte em string.
- **%d**: Para números inteiros (decimal).
- **%f**: Para números de ponto flutuante.
- **%c**: Para caracteres.
- **%b**: Para valores booleanos.
- **%n**: Para uma quebra de linha. É equivalente a `\n` mas é preferível em `printf` ou `String.format` pois é independente de plataforma.

Além desses, existem modificadores que você pode usar para controlar a largura, a precisão e o alinhamento dos dados formatados:

- **%[índice$][flags][largura][.precisão]tipo**
  
  - **Índice$**: Um inteiro seguido por um `$` indica qual argumento usar (começando por 1).
  - **Flags**: Podem modificar a saída de várias maneiras, como adicionar zeros à esquerda, alinhar o texto à esquerda, etc.
    - **0**: Para preenchimento com zeros.
    - **-**: Para alinhamento à esquerda.
    - **+**: Exibe o sinal de mais (+) ou menos (-) para números positivos e negativos, respectivamente.
    - **,**: Inclui delimitadores de grupo em números (por exemplo, milhares).
  - **Largura**: Um número que indica a largura mínima do campo.
  - **.Precisão**: Para números de ponto flutuante, determina o número de dígitos após o ponto decimal. Para strings, pode limitar o número de caracteres a serem exibidos.

### Exemplos:

- **`%4d`**: Formata um inteiro para ter pelo menos 4 dígitos de largura, preenchendo com espaços à esquerda se necessário.
- **`%06.2f`**: Formata um número de ponto flutuante para ter pelo menos 6 caracteres de largura (incluindo o ponto decimal), preenchendo com zeros à esquerda e limitando a precisão a 2 dígitos após o ponto decimal.
- **`%-10s`**: Formata uma string para ter pelo menos 10 caracteres de largura, alinhando-a à esquerda.

Aqui está um exemplo que ilustra o uso de alguns desses placeholders e modificadores:

```java
System.out.printf("%s tem %d anos e sua altura é %.2f metros%n", "Luiz", 23, 1.75);
// Luiz tem 23 anos e sua altura é 1,75 metros
```

Este exemplo mostra como formatar strings, números inteiros e números de ponto flutuante com duas casas decimais, seguido por uma quebra de linha.

### Barra invertida

A barra invertida (`\`) é usada em Java principalmente para sequências de escape em strings. Por exemplo, `\n` para uma nova linha, `\t` para um tab, `\\` para uma barra invertida literal, e `\"` para aspas duplas dentro de uma string. Estas são usadas para representar caracteres que de outra forma teriam um significado especial ou não poderiam ser representados diretamente numa string.

Por exemplo:

- **`\n`**: Quebra de linha.
- **`\t`**: Tabulação.
- **`\\`**: Representa uma barra invertida (`\`).
- **`\"`**: Representa aspas duplas dentro de uma string.

Portanto, dentro do contexto de formatação de strings com `printf` ou `String.format` em Java, você deve usar os especificadores de formato iniciados com `%` para inserir variáveis ou valores formatados dentro de suas strings. O uso de `\s` não é reconhecido como um especificador de formatação válido em Java para esse propósito.