# Declaração de Arrays 2D

## 🎯 Introdução e Definição

### O que é Declaração de Array 2D

**Declarar um array bidimensional** significa criar uma **variável** que pode armazenar uma **referência** para uma estrutura de array 2D. A declaração, por si só, **não cria a matriz** nem aloca memória para os elementos - apenas define o tipo da variável. É como reservar um nome para uma planilha que ainda não foi criada.

Em Java, existem **múltiplas sintaxes válidas** para declarar arrays 2D, mas a comunidade Java tem uma preferência clara pela sintaxe onde os colchetes ficam **após o tipo**, não após o nome da variável.

```java
// Sintaxe preferida (colchetes após o tipo)
int[][] matriz;  // Declaração - matriz é null neste momento

// matriz ainda não aponta para nenhum array!
// Tentar usar causará NullPointerException
```

---

## 🧠 Fundamentos Teóricos

### 1. Sintaxe Padrão - Colchetes Após o Tipo

**A forma recomendada** de declarar arrays 2D em Java é colocar os colchetes duplos `[][]` **imediatamente após o tipo de dado**:

```java
// Declarações de diferentes tipos
int[][] matriz;           // Matriz de inteiros
double[][] valores;       // Matriz de doubles
boolean[][] flags;        // Matriz de booleans
String[][] tabela;        // Matriz de Strings
Pessoa[][] funcionarios;  // Matriz de objetos customizados

// Arrays de tipos primitivos
byte[][] bytes;
short[][] shorts;
long[][] longs;
float[][] floats;
char[][] caracteres;
```

**Por que esta sintaxe é preferida?**
- **Clareza**: `int[][]` lê-se como "array 2D de int"
- **Consistência**: Tipo fica completo (`int[][]` é o tipo, `matriz` é o nome)
- **Declarações múltiplas**: Evita confusão ao declarar várias variáveis

### 2. Sintaxes Alternativas (Válidas mas Não Recomendadas)

Java permite outras sintaxes por compatibilidade com C/C++, mas **não são recomendadas**:

```java
// Sintaxe 1: Colchetes após o nome (estilo C)
int mat[][];  // Válido, mas evite

// Sintaxe 2: Colchetes misturados
int[] mat[];  // Válido, mas confuso
int[][] mat;  // ✅ Esta é a preferida
```

**Problema com declarações múltiplas**:
```java
// Com colchetes após o tipo (claro)
int[][] a, b, c;  // Todos são arrays 2D

// Com colchetes após o nome (confuso!)
int a[][], b, c;  // Apenas 'a' é array 2D, 'b' e 'c' são int simples!
```

### 3. Declaração com Inicialização Simultânea

**Criar e inicializar em uma linha** usando `new`:

```java
// Especificando ambas as dimensões
int[][] matriz = new int[3][4];  // 3 linhas, 4 colunas, todos elementos = 0

// Com valores específicos (inicialização inline)
int[][] mat = {
    {1, 2, 3},
    {4, 5, 6}
};

// Array anônimo
int[][] mat = new int[][]{
    {10, 20},
    {30, 40},
    {50, 60}
};
```

**Valores padrão após `new tipo[linhas][colunas]`**:
- Tipos numéricos (`int`, `double`, etc): `0` ou `0.0`
- `boolean`: `false`
- `char`: `'\u0000'` (caractere nulo)
- Tipos de referência (`String`, objetos): `null`

### 4. Declaração e Criação em Etapas Separadas

Você pode declarar primeiro e criar depois:

```java
// Etapa 1: Declaração
int[][] matriz;  // matriz = null

// Etapa 2: Criação (pode estar em outro local do código)
matriz = new int[5][3];  // Agora matriz aponta para array 5x3

// Etapa 3: Uso
matriz[0][0] = 10;
```

**Quando usar esta abordagem**:
- Tamanho depende de cálculos ou entrada do usuário
- Declaração em um escopo, criação em outro
- Inicialização condicional

### 5. Tamanho Dinâmico (Runtime)

O tamanho do array pode ser determinado em **tempo de execução**:

```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);

System.out.print("Número de linhas: ");
int linhas = scanner.nextInt();

System.out.print("Número de colunas: ");
int colunas = scanner.nextInt();

// Criar matriz com tamanho dinâmico
int[][] matriz = new int[linhas][colunas];

// Exemplo: se usuário digitar 2 e 3, cria matriz 2x3
```

**Flexibilidade total**:
```java
int tamanho = calcularTamanho();  // Método que retorna int
int[][] dados = new int[tamanho][tamanho];  // Matriz quadrada dinâmica
```

### 6. Declaração sem Especificar Segunda Dimensão

Em Java, você pode criar arrays **irregulares** (jagged arrays) especificando apenas a primeira dimensão:

```java
// Declara e cria apenas o array de linhas
int[][] irregular = new int[3][];  // 3 linhas, mas colunas indefinidas

// Cada linha ainda é null!
irregular[0] = new int[2];   // Linha 0 com 2 colunas
irregular[1] = new int[4];   // Linha 1 com 4 colunas
irregular[2] = new int[3];   // Linha 2 com 3 colunas

// Agora pode usar:
irregular[0][0] = 10;
irregular[1][3] = 20;
```

**IMPORTANTE**: NÃO é possível fazer `new int[][]` sem especificar pelo menos a primeira dimensão:
```java
int[][] mat = new int[][];  // ❌ ERRO DE COMPILAÇÃO!
int[][] mat = new int[3][]; // ✅ OK - array irregular
```

### 7. Arrays 2D de Objetos

Declarar arrays de tipos de referência (classes):

```java
// Arrays de String
String[][] nomes = new String[2][3];
// Cria estrutura 2x3, mas todos elementos são null!

// Precisa inicializar cada String
nomes[0][0] = "Ana";
nomes[0][1] = "Bruno";
// ...

// Arrays de objetos customizados
class Pessoa {
    String nome;
    int idade;
}

Pessoa[][] turma = new Pessoa[3][5];
// 3 linhas, 5 colunas - todos elementos null

// Inicializar cada objeto
turma[0][0] = new Pessoa();
turma[0][0].nome = "Carlos";
turma[0][0].idade = 20;
```

**Diferença crucial**:
- Arrays de primitivos: `new int[2][3]` cria 6 ints com valor 0
- Arrays de objetos: `new String[2][3]` cria 6 referências null (não cria 6 Strings!)

### 8. Declarações como Parâmetros de Métodos

Arrays 2D podem ser parâmetros de métodos:

```java
// Método que recebe matriz
public static void imprimirMatriz(int[][] matriz) {
    for (int i = 0; i < matriz.length; i++) {
        for (int j = 0; j < matriz[i].length; j++) {
            System.out.print(matriz[i][j] + " ");
        }
        System.out.println();
    }
}

// Método que retorna matriz
public static int[][] criarIdentidade(int tamanho) {
    int[][] identidade = new int[tamanho][tamanho];
    for (int i = 0; i < tamanho; i++) {
        identidade[i][i] = 1;
    }
    return identidade;
}

// Uso
int[][] mat = criarIdentidade(3);
imprimirMatriz(mat);
```

### 9. Declarações como Atributos de Classe

Arrays 2D podem ser campos/atributos de classes:

```java
public class Jogo {
    // Atributos
    private char[][] tabuleiro;  // Declaração
    private int linhas;
    private int colunas;
    
    // Construtor
    public Jogo(int linhas, int colunas) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.tabuleiro = new char[linhas][colunas];  // Criação
        inicializarTabuleiro();
    }
    
    private void inicializarTabuleiro() {
        for (int i = 0; i < linhas; i++) {
            for (int j = 0; j < colunas; j++) {
                tabuleiro[i][j] = ' ';
            }
        }
    }
}
```

### 10. Declarações Múltiplas

**Com sintaxe recomendada** (todos do mesmo tipo):
```java
int[][] a, b, c;  // Todos são int[][]
a = new int[2][3];
b = new int[4][5];
c = new int[1][1];
```

**Declarações de tipos diferentes**:
```java
int[][] inteiros = new int[2][3];
String[][] textos = new String[4][5];
double[][] decimais = new double[3][3];
```

---

## 🎯 Aplicabilidade e Contextos de Uso

### Quando Declarar Arrays 2D

1. **Estruturas de dados tabulares**: Planilhas, tabelas de banco de dados
2. **Parâmetros de métodos**: Algoritmos que operam sobre matrizes
3. **Atributos de classe**: Jogos (tabuleiros), simulações (grids)
4. **Retorno de métodos**: Funções que geram matrizes
5. **Variáveis locais**: Processamento temporário de dados 2D

---

## ⚠️ Armadilhas Comuns

1. **Declarar sem criar**: `int[][] mat;` deixa `mat = null`, usar causa `NullPointerException`
2. **Esquecer primeira dimensão**: `new int[][]` é inválido, precisa `new int[n][]` ou `new int[n][m]`
3. **Confundir ordem dos colchetes**: Prefer `int[][]` a `int[] []` ou `int [][]`
4. **Declarações múltiplas ambiguas**: `int a[][], b;` - `b` é int, não int[][]!
5. **Arrays de objetos não inicializados**: `new String[2][3]` cria 6 nulls, não 6 Strings!
6. **Assumir segunda dimensão obrigatória**: `new int[3][]` é válido (irregular)

---

## ✅ Boas Práticas

1. **Use `tipo[][] nome`**: Colchetes após o tipo, não após o nome
2. **Declare próximo ao uso**: Evite declarações distantes da inicialização
3. **Nomes descritivos**: `matriz`, `tabuleiro`, `imagem` em vez de `arr` ou `a`
4. **Documente dimensões**: Comente o que linhas/colunas representam
5. **Inicialize cedo**: Evite trabalhar com arrays null por muito tempo
6. **Const final para tamanhos**: `final int LINHAS = 10;` para clareza
7. **Valide tamanhos dinâmicos**: Verifique inputs antes de criar array
8. **Uma declaração por linha**: Para arrays complexos, evite múltiplas declarações

---

## 📚 Resumo Executivo

**Declaração de array 2D** define variável que pode referenciar matriz. **Sintaxe preferida**: `tipo[][] nome`. Declaração não aloca memória - use `new tipo[lin][col]` para criar. Pode separar declaração e criação. Tamanho pode ser dinâmico (runtime). Arrays irregulares: especifique apenas primeira dimensão `new int[n][]`. Arrays de objetos criam slots null. Sempre inicialize antes de usar para evitar `NullPointerException`.
