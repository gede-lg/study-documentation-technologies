Claro, aqui está um conteúdo detalhado para o "Módulo 6: Entrada/Saída de Dados" com uma tabela que lista métodos de manipulação de arquivos em Java, explicando para que cada método serve, além de exemplos de código:

### Módulo 6: Entrada/Saída de Dados

#### 1. Manipulação de Arquivos em Java

A manipulação de arquivos é uma parte importante da programação em Java, pois permite que você leia informações de arquivos existentes, crie novos arquivos e grave dados em arquivos. Neste módulo, vamos explorar como realizar operações de leitura e escrita de arquivos em Java.

##### Métodos para Leitura e Escrita de Arquivos

Aqui estão alguns dos principais métodos que você usará para manipulação de arquivos em Java, juntamente com uma descrição de para que cada um deles serve:

| Método                        | Descrição                                                                                   |
|-------------------------------|-----------------------------------------------------------------------------------------------|
| `FileInputStream`            | Uma classe que permite a leitura de bytes de um arquivo.                                   |
| `FileOutputStream`           | Uma classe que permite a escrita de bytes em um arquivo.                                  |
| `FileReader`                 | Uma classe que permite a leitura de caracteres de um arquivo de texto.                     |
| `FileWriter`                 | Uma classe que permite a escrita de caracteres em um arquivo de texto.                    |
| `BufferedReader`             | Fornece leitura de texto eficiente, lendo em buffers.                                      |
| `BufferedWriter`             | Fornece escrita de texto eficiente, escrevendo em buffers.                                 |
| `Scanner`                    | Uma classe que facilita a leitura de diferentes tipos de dados a partir de arquivos.      |
| `PrintWriter`                | Usado para escrever representações formatadas de objetos em um arquivo de texto.          |

Agora, vamos detalhar como usar alguns desses métodos com exemplos de código.

##### Leitura de Arquivos

###### Exemplo de uso de `FileInputStream` e `FileReader`:

```java
try {
    FileInputStream fis = new FileInputStream("arquivo.bin");
    int byteLido;
    while ((byteLido = fis.read()) != -1) {
        System.out.print((char) byteLido); // Converte byte para caractere
    }
    fis.close();
} catch (IOException e) {
    e.printStackTrace();
}

try {
    FileReader fr = new FileReader("arquivo.txt");
    BufferedReader br = new BufferedReader(fr);
    String linha;
    while ((linha = br.readLine()) != null) {
        System.out.println(linha);
    }
    br.close();
} catch (IOException e) {
    e.printStackTrace();
}
```

##### Escrita em Arquivos

###### Exemplo de uso de `FileOutputStream` e `FileWriter`:

```java
try {
    FileOutputStream fos = new FileOutputStream("arquivo.bin");
    String texto = "Hello, mundo!";
    byte[] bytes = texto.getBytes();
    fos.write(bytes);
    fos.close();
} catch (IOException e) {
    e.printStackTrace();
}

try {
    FileWriter fw = new FileWriter("arquivo.txt");
    BufferedWriter bw = new BufferedWriter(fw);
    String linha = "Esta é uma linha de exemplo.";
    bw.write(linha);
    bw.newLine(); // Adiciona uma nova linha
    linha = "Outra linha de exemplo.";
    bw.write(linha);
    bw.close();
} catch (IOException e) {
    e.printStackTrace();
}
```

##### Leitura de Arquivos com Scanner

###### Exemplo de uso de `Scanner`:

```java
try {
    Scanner scanner = new Scanner(new File("dados.txt"));
    while (scanner.hasNextLine()) {
        String linha = scanner.nextLine();
        System.out.println(linha);
    }
    scanner.close();
} catch (FileNotFoundException e) {
    e.printStackTrace();
}
```

Esses são apenas alguns exemplos de como você pode ler e escrever arquivos em Java. Lembre-se sempre de fechar os recursos apropriados (como `FileInputStream` ou `FileWriter`) após o uso para liberar recursos do sistema. Além disso, trate exceções para lidar com erros de leitura e escrita de arquivos de maneira adequada.