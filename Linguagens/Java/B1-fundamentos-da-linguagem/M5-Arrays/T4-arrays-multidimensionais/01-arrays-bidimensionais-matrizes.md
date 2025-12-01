# Arrays Bidimensionais (Matrizes)

## 🎯 Introdução e Definição

### Conceito Fundamental

**Arrays bidimensionais**, também chamados de **matrizes** ou **arrays 2D**, são estruturas de dados que organizam elementos em **duas dimensões**: linhas e colunas. Em Java, arrays 2D são tecnicamente **arrays de arrays** - cada elemento do array principal é uma referência para outro array.

Pense em uma matriz como uma **tabela** ou **planilha**: cada posição é identificada por dois índices - o primeiro indica a linha, o segundo indica a coluna. Esta estrutura é fundamental para representar dados tabulares, grades, mapas, imagens e operações matemáticas matriciais.

```java
// Matriz 2x3 (2 linhas, 3 colunas)
int[][] matriz = {
    {1, 2, 3},    // Linha 0
    {4, 5, 6}     // Linha 1
};

// Visualização:
// [0][0]=1  [0][1]=2  [0][2]=3
// [1][0]=4  [1][1]=5  [1][2]=6
```

### Anatomia de um Array 2D

Um array bidimensional em Java possui a seguinte estrutura:

```java
int[][] matriz = new int[2][3];

// matriz → referência ao array principal
// matriz[0] → referência à primeira linha (array de 3 elementos)
// matriz[1] → referência à segunda linha (array de 3 elementos)
// matriz[0][0] → primeiro elemento da primeira linha
```

---

## 🧠 Fundamentos Teóricos

### 1. Array de Arrays - Estrutura Interna

**Conceito essencial**: Em Java, não existe uma "matriz verdadeira" na memória. O que chamamos de array 2D é na verdade um **array unidimensional onde cada elemento é uma referência para outro array unidimensional**.

```java
int[][] matriz = new int[3][4];

// Estrutura na memória:
// matriz → [ref0, ref1, ref2]
//              ↓     ↓     ↓
//           [0,0,0,0] [0,0,0,0] [0,0,0,0]

// Cada "linha" é um array independente
int[] linha0 = matriz[0];  // Array com 4 elementos
int[] linha1 = matriz[1];  // Outro array com 4 elementos
int[] linha2 = matriz[2];  // Mais um array com 4 elementos
```

**Implicações importantes**:
- Cada linha pode ter tamanho diferente (arrays irregulares)
- Modificar uma linha afeta todos que a referenciam
- Arrays 2D ocupam memória não contígua (ao contrário de C/C++)

### 2. Sistema de Coordenadas - Linha e Coluna

O acesso a elementos em arrays 2D utiliza **dois índices**: `matriz[linha][coluna]`.

**Ordem SEMPRE**: linha primeiro, coluna depois (convenção matemática).

```java
int[][] mat = {
    {10, 20, 30},  // Linha 0
    {40, 50, 60}   // Linha 1
};

// Acesso por linha e coluna
int elemento = mat[0][0];  // 10 (linha 0, coluna 0 - canto superior esquerdo)
int elemento = mat[0][1];  // 20 (linha 0, coluna 1)
int elemento = mat[0][2];  // 30 (linha 0, coluna 2 - canto superior direito)
int elemento = mat[1][0];  // 40 (linha 1, coluna 0 - canto inferior esquerdo)
int elemento = mat[1][1];  // 50 (linha 1, coluna 1 - centro)
int elemento = mat[1][2];  // 60 (linha 1, coluna 2 - canto inferior direito)
```

**Visualização como tabela**:
```
        Col0  Col1  Col2
Linha0   10    20    30
Linha1   40    50    60
```

### 3. Dimensões e Tamanho

Arrays 2D possuem duas dimensões que podem ser obtidas usando a propriedade `length`:

```java
int[][] matriz = new int[3][4];  // 3 linhas, 4 colunas

// Número de linhas (primeira dimensão)
int numLinhas = matriz.length;  // 3

// Número de colunas de uma linha específica (segunda dimensão)
int numColunas = matriz[0].length;  // 4 (colunas da linha 0)

// IMPORTANTE: Em arrays irregulares, cada linha pode ter tamanho diferente
int colunasLinha0 = matriz[0].length;  // 4
int colunasLinha1 = matriz[1].length;  // 4
int colunasLinha2 = matriz[2].length;  // 4
```

**Índices válidos**:
- Linhas: `0` até `matriz.length - 1`
- Colunas da linha i: `0` até `matriz[i].length - 1`

### 4. Inicialização com Valores Literais (Inline)

A forma mais direta de criar e popular uma matriz é usar **inicialização inline** com chaves aninhadas:

```java
// Matriz 3x3 com valores específicos
int[][] identidade = {
    {1, 0, 0},
    {0, 1, 0},
    {0, 0, 1}
};

// Matriz de strings
String[][] agenda = {
    {"Seg", "Ter", "Qua"},
    {"Qui", "Sex", "Sáb"}
};

// Matriz de diferentes tipos
double[][] pontos = {
    {1.5, 2.7},
    {3.2, 4.8},
    {5.1, 6.3}
};
```

**Vantagens**: Código conciso, tamanho calculado automaticamente, valores imediatamente disponíveis.

**Limitações**: Apenas para valores conhecidos em tempo de compilação.

### 5. Inicialização com Operador new

Quando o tamanho é conhecido mas os valores serão atribuídos depois, use `new`:

```java
// Cria matriz 2x3 com valores padrão (0 para int)
int[][] matriz = new int[2][3];

// Todos elementos inicializados com 0:
// {{0, 0, 0},
//  {0, 0, 0}}

// Atribuição posterior
matriz[0][0] = 10;
matriz[0][1] = 20;
matriz[1][2] = 60;

// Resultado:
// {{10, 20, 0},
//  {0,  0, 60}}
```

**Valores padrão por tipo**:
- `int[][]`: 0
- `double[][]`: 0.0
- `boolean[][]`: false
- `char[][]`: '\u0000'
- `String[][]` ou objetos: null

### 6. Acesso a Linhas Inteiras

Como arrays 2D são arrays de arrays, podemos obter uma linha completa:

```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Obter linha inteira (referência ao array)
int[] primeiraLinha = matriz[0];  // {1, 2, 3}
int[] segundaLinha = matriz[1];   // {4, 5, 6}

// Usar a linha
System.out.println(Arrays.toString(primeiraLinha));  // [1, 2, 3]

// CUIDADO: é referência, não cópia!
primeiraLinha[0] = 100;
System.out.println(matriz[0][0]);  // 100 (matriz foi modificada)
```

### 7. Modificação de Elementos e Linhas

**Modificar elemento individual**:
```java
int[][] mat = new int[2][3];
mat[0][1] = 100;  // Modifica elemento na linha 0, coluna 1
mat[1][2] = 200;  // Modifica elemento na linha 1, coluna 2
```

**Substituir linha inteira**:
```java
int[][] mat = {{1,2,3}, {4,5,6}};

// Substituir primeira linha por novo array
mat[0] = new int[]{10, 20, 30};
// Agora: {{10,20,30}, {4,5,6}}

// Pode até mudar o tamanho da linha!
mat[0] = new int[]{100, 200};  // Linha 0 agora tem apenas 2 elementos
```

### 8. Iteração sobre Matriz

**Loop tradicional**:
```java
int[][] mat = {{1,2,3}, {4,5,6}};

for (int i = 0; i < mat.length; i++) {           // Percorre linhas
    for (int j = 0; j < mat[i].length; j++) {    // Percorre colunas
        System.out.print(mat[i][j] + " ");
    }
    System.out.println();  // Nova linha após cada linha da matriz
}
// Saída:
// 1 2 3
// 4 5 6
```

**For-each (enhanced for)**:
```java
for (int[] linha : mat) {        // Cada linha é um array
    for (int elemento : linha) {  // Cada elemento da linha
        System.out.print(elemento + " ");
    }
    System.out.println();
}
```

### 9. Operações Comuns

**Soma de todos elementos**:
```java
int soma = 0;
for (int[] linha : mat) {
    for (int elemento : linha) {
        soma += elemento;
    }
}
```

**Encontrar máximo**:
```java
int max = mat[0][0];
for (int[] linha : mat) {
    for (int elemento : linha) {
        if (elemento > max) max = elemento;
    }
}
```

**Transpor matriz** (trocar linhas por colunas):
```java
int[][] original = {{1,2,3}, {4,5,6}};
int[][] transposta = new int[3][2];

for (int i = 0; i < original.length; i++) {
    for (int j = 0; j < original[i].length; j++) {
        transposta[j][i] = original[i][j];
    }
}
// Resultado: {{1,4}, {2,5}, {3,6}}
```

### 10. Elementos Especiais em Matrizes

**Cantos**:
```java
int topoEsquerdo = mat[0][0];
int topoDireito = mat[0][mat[0].length - 1];
int baseEsquerdo = mat[mat.length - 1][0];
int baseDireito = mat[mat.length - 1][mat[mat.length - 1].length - 1];
```

**Diagonal principal** (matriz quadrada):
```java
// Elementos onde linha == coluna
for (int i = 0; i < mat.length; i++) {
    System.out.println(mat[i][i]);
}
```

**Diagonal secundária** (matriz quadrada):
```java
for (int i = 0; i < mat.length; i++) {
    System.out.println(mat[i][mat.length - 1 - i]);
}
```

---

## 🎯 Aplicabilidade e Contextos de Uso

### Casos de Uso Práticos

1. **Tabelas de Dados**: Planilhas, bases de dados relacionais em memória
2. **Jogos**: Tabuleiros (xadrez, damas, jogo da velha), mapas de tiles
3. **Processamento de Imagens**: Pixels organizados em linhas e colunas
4. **Matemática**: Operações matriciais, sistemas lineares
5. **Simulações**: Mapas de calor, grades de simulação física
6. **Estatísticas**: Tabelas de contingência, correlações

---

## ⚠️ Armadilhas Comuns

1. **Confundir ordem dos índices**: `mat[coluna][linha]` está ERRADO! Sempre `mat[linha][coluna]`
2. **Índices fora dos limites**: Verificar `i < mat.length` E `j < mat[i].length`
3. **Transposição incorreta**: `mat[i][j]` é diferente de `mat[j][i]`
4. **Assumir matriz quadrada**: Nem sempre linhas == colunas
5. **Modificar linha compartilhada**: Ao obter `int[] linha = mat[0]`, modificar `linha` afeta `mat`
6. **Esquecer inicialização**: Arrays de objetos criam slots null, não objetos

---

## ✅ Boas Práticas

1. **Nomes descritivos**: Use `matriz`, `tabuleiro`, `imagem` em vez de `arr` ou `a`
2. **Variáveis de loop claras**: `i`/`j` ou `linha`/`coluna`, nunca ambiguidade
3. **Validação completa**: Verifique limites de ambas as dimensões
4. **Constantes para tamanhos**: `final int LINHAS = 3; final int COLUNAS = 4;`
5. **Comente dimensões**: Indique o que cada dimensão representa
6. **Use `Arrays.deepToString()`**: Para imprimir matriz completa
7. **Prefer for-each para leitura**: Mais limpo e seguro quando não precisa de índices
8. **Métodos auxiliares**: Extraia operações complexas em métodos separados

---

## 📚 Resumo Executivo

**Arrays bidimensionais** são arrays de arrays que organizam dados em **linhas e colunas**. Acesso via `matriz[linha][coluna]`. Dimensões obtidas por `matriz.length` (linhas) e `matriz[i].length` (colunas). Inicialize com `{...}` ou `new tipo[linhas][colunas]`. Estrutura fundamental para dados tabulares, jogos, imagens e matrizes matemáticas. Sempre valide ambos os índices para evitar `ArrayIndexOutOfBoundsException`.
