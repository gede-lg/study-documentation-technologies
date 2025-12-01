# Módulo 4: Estruturas de Dados em Java

## 1. O que são Estruturas de Dados?
Estruturas de dados são maneiras de organizar e armazenar dados em um computador para que possam ser acessados e modificados de maneira eficiente. Em Java, como em outras linguagens de programação, entender estruturas de dados é crucial para resolver problemas complexos e implementar algoritmos eficientes.

### Conceitos Fundamentais
- **Linear vs Não-Linear**: Estruturas lineares como arrays e listas ligadas armazenam elementos em sequência, enquanto estruturas não-lineares, como árvores e grafos, têm uma relação hierárquica ou de rede entre os elementos.
- **Estático vs Dinâmico**: Estruturas estáticas têm um tamanho fixo (como arrays), enquanto estruturas dinâmicas podem crescer e diminuir de tamanho (como ArrayLists).
- **Homogêneo vs Heterogêneo**: Estruturas podem armazenar dados do mesmo tipo (homogêneo) ou de tipos diferentes (heterogêneo).

### Importância
- **Eficiência**: Algumas estruturas de dados são mais eficientes para certas operações. Por exemplo, as árvores de busca binária permitem buscas rápidas.
- **Organização**: Uma boa escolha de estrutura de dados pode simplificar o código e melhorar a compreensão do problema.
- **Reutilização**: Java fornece várias estruturas de dados prontas para uso na biblioteca de coleções.

## 2. Arrays: Conceitos e Manipulação de Arrays

### Conceito de Array
Um array é uma coleção de elementos do

mesmo tipo, armazenada em posições contíguas de memória. Em Java, os arrays são objetos que podem ser tratados como listas fixas.

#### Declaração e Inicialização
```java
int[] meuArray = new int[10]; // Declara um array de inteiros com 10 elementos
String[] arrayDeStrings = {"Java", "Python", "C++"}; // Declara e inicializa um array de Strings
```

#### Acessando Elementos
Os elementos de um array são acessados pelo índice, começando do zero.
```java
int primeiroElemento = meuArray[0]; // Acessa o primeiro elemento
meuArray[3] = 25; // Atribui o valor 25 ao quarto elemento
```

#### Propriedades dos Arrays
- **Tamanho Fixo**: Uma vez criado, o tamanho de um array não pode ser alterado.
- **Eficiência**: Acesso direto aos elementos através de índices é muito rápido.
- **Tipo Homogêneo**: Todos os elementos em um array devem ser do mesmo tipo.

### Manipulação de Arrays
#### Iterando sobre Arrays
```java
for(int i = 0; i < meuArray.length; i++) {
    System.out.println(meuArray[i]);
}
```
Ou usando o loop `for-each` para maior simplicidade:
```java
for(int elemento : meuArray) {
    System.out.println(elemento);
}
```

#### Métodos Úteis da Classe `Arrays`
A classe `java.util.Arrays` fornece métodos úteis para manipulação de arrays.
- **Sort**: Ordena o array.
  ```java
  Arrays.sort(meuArray);
  ```
- **Fill**: Preenche o array com um valor específico.
  ```java
  Arrays.fill(meuArray, 1); // Preenche o array com 1s
  ```
- **Equals**: Compara dois arrays.
  ```java
  Arrays.equals(array1, array2);
  ```

#### Limitações e Considerações
- Arrays têm tamanho fixo. Para coleções dinâmicas, considere usar `ArrayList` ou outras estruturas da biblioteca de coleções.
- Arrays primitivos não podem conter `null`, mas arrays de objetos podem.

## 3. Matrizes em Java

## Conceito de Matrizes
Uma matriz em Java é uma coleção de arrays, essencialmente um array de arrays. Cada elemento de uma matriz é um array que, por sua vez, contém elementos, todos do mesmo tipo. Matrizes são comumente usadas para representar tabelas de valores consistindo de informações organizadas em linhas e colunas.

### Declaração e Inicialização
Para declarar uma matriz em Java, você especifica cada dimensão separadamente. Por exemplo:

```java
int[][] matriz = new int[3][2]; // Uma matriz 3x2 (3 linhas, 2 colunas)
```

Você também pode inicializar uma matriz diretamente com valores:

```java
int[][] matriz = { {1, 2}, {3, 4}, {5, 6} }; // Inicialização com valores
```

### Acessando Elementos
Os elementos são acessados especificando os índices de cada dimensão:

```java
int elemento = matriz[0][1]; // Acessa o elemento na primeira linha, segunda coluna
matriz[2][0] = 10; // Modifica o valor na terceira linha, primeira coluna
```

### Propriedades das Matrizes
- **Tamanho de Cada Dimensão**: Cada dimensão de uma matriz pode ter um tamanho diferente. Por exemplo, `matriz[0].length` pode ser diferente de `matriz[1].length`.
- **Tipo Homogêneo**: Todos os elementos devem ser do mesmo tipo.
- **Alocação de Memória**: Em Java, cada linha de uma matriz pode ser um objeto array separado.

## Manipulação de Matrizes

### Iteração
Para percorrer uma matriz, você geralmente usa dois loops aninhados:

```java
for(int i = 0; i < matriz.length; i++) {
    for(int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println(); // Quebra de linha após cada linha da matriz
}
```

### Métodos Úteis
Não existem métodos na classe `Arrays` para manipulação direta de matrizes bidimensionais, mas você pode trabalhar com cada array individualmente.

### Exemplos Práticos
1. **Transposição de uma Matriz**: Alterar linhas por colunas e vice-versa.
   ```java
   int[][] transposta = new int[matriz[0].length][matriz.length];
   for(int i = 0; i < matriz.length; i++) {
       for(int j = 0; j < matriz[i].length; j++) {
           transposta[j][i] = matriz[i][j];
       }
   }
   ```
2. **Operações Matriciais**: Realizar operações como soma, subtração ou multiplicação de matrizes.

### Considerações Adicionais
- **Arrays Irregulares**: Java suporta arrays "irregulares" (ou "ragged arrays"), onde cada sub-array pode ter um tamanho diferente.
- **Aplicações**: Matrizes são usadas em diversas aplicações, como gráficos computacionais, simulações, e processamento de imagens.