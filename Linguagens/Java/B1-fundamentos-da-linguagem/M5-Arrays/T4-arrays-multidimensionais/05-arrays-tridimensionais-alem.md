# Arrays Tridimensionais e Além

## 🎯 Introdução e Definição

### Conceito de Arrays Multidimensionais de Alta Ordem

**Arrays tridimensionais (3D)** são estruturas que organizam dados em **três dimensões**: profundidade (camadas), altura (linhas) e largura (colunas). Pense em um **cubo** de dados onde cada posição é identificada por três coordenadas. Em Java, um array 3D é tecnicamente um **array de arrays de arrays** - uma estrutura aninhada em três níveis.

Java não limita o número de dimensões - você pode criar arrays **4D, 5D, ou até N-dimensionais**, embora na prática raramente se use mais de 3 ou 4 dimensões devido à complexidade de visualização e manutenção.

```java
// Array 3D: cubo de inteiros
int[][][] cubo = new int[3][4][5];
// 3 camadas (profundidade)
// 4 linhas por camada (altura)
// 5 colunas por linha (largura)
// Total: 3 × 4 × 5 = 60 elementos

// Visualização conceitual:
// Camada 0: matriz 4x5
// Camada 1: matriz 4x5
// Camada 2: matriz 4x5
```

**Analogias úteis**:
- **2D**: Uma página de papel (linhas × colunas)
- **3D**: Um livro (páginas × linhas × colunas) ou cubo Rubik
- **4D**: Uma série de livros ao longo do tempo

---

## 🧠 Fundamentos Teóricos

### 1. Declaração de Arrays 3D

**Sintaxe**: `tipo[][][] nome` - três pares de colchetes indicam três dimensões.

```java
// Declarações válidas
int[][][] cubo;              // Array 3D de inteiros
double[][][] matriz3D;       // Array 3D de doubles
String[][][] dados;          // Array 3D de Strings
Pessoa[][][] organizacao;    // Array 3D de objetos customizados

// Array ainda é null - não alocou memória
cubo = null;  // Estado inicial
```

**Declaração com inicialização**:
```java
int[][][] cubo = new int[2][3][4];  // Criado e inicializado com zeros
```

### 2. Criação e Alocação de Memória

**Especificando todas as dimensões**:
```java
int[][][] cubo = new int[2][3][4];

// Estrutura criada:
// 2 camadas
// Cada camada tem 3 linhas
// Cada linha tem 4 colunas
// Total: 2 × 3 × 4 = 24 elementos (todos inicializados com 0)

// Dimensões:
cubo.length;            // 2 (número de camadas)
cubo[0].length;         // 3 (linhas na camada 0)
cubo[0][0].length;      // 4 (colunas na linha 0 da camada 0)
```

**Estrutura na memória** (conceitual):
```
cubo → [camada0, camada1]
         ↓        ↓
      [lin0,   [lin0,
       lin1,    lin1,
       lin2]    lin2]
```

### 3. Sistema de Acesso - Triplo Índice

**Sintaxe fundamental**: `array[camada][linha][coluna]`

**Ordem ESSENCIAL**: profundidade → altura → largura (ou camada → linha → coluna).

```java
int[][][] cubo = new int[2][3][4];

// Acessar elementos específicos
cubo[0][0][0] = 1;   // Camada 0, linha 0, coluna 0 (canto superior esquerdo da primeira camada)
cubo[0][0][3] = 2;   // Camada 0, linha 0, coluna 3
cubo[0][2][0] = 3;   // Camada 0, linha 2, coluna 0
cubo[1][0][0] = 4;   // Camada 1, linha 0, coluna 0
cubo[1][2][3] = 5;   // Camada 1, linha 2, coluna 3 (último elemento)

// Leitura
int valor = cubo[0][1][2];  // Lê elemento na posição [0,1,2]
```

**Acessar camadas e linhas inteiras**:
```java
// Camada inteira (matriz 2D)
int[][] camada0 = cubo[0];  // Matriz 3x4

// Linha específica de uma camada
int[] linha = cubo[0][1];  // Linha 1 da camada 0 (array com 4 elementos)

// Elemento individual
int elemento = cubo[0][1][2];  // Coluna 2 da linha 1 da camada 0
```

### 4. Inicialização Inline com Valores Literais

**Chaves triplas aninhadas**:
```java
int[][][] cubo = {
    {  // Camada 0
        {1, 2, 3},      // Linha 0
        {4, 5, 6}       // Linha 1
    },
    {  // Camada 1
        {7, 8, 9},      // Linha 0
        {10, 11, 12}    // Linha 1
    }
};

// Estrutura: 2 camadas, 2 linhas por camada, 3 colunas por linha
// cubo.length = 2
// cubo[0].length = 2
// cubo[0][0].length = 3

// Acessos:
cubo[0][0][0];  // 1
cubo[0][1][2];  // 6
cubo[1][0][1];  // 8
cubo[1][1][2];  // 12
```

**Visualização**:
```
Camada 0:        Camada 1:
1  2  3          7   8   9
4  5  6          10  11  12
```

### 5. Obter Dimensões do Array 3D

**Acessando tamanhos**:
```java
int[][][] cubo = new int[3][4][5];

int camadas = cubo.length;               // 3 (primeira dimensão)
int linhas = cubo[0].length;             // 4 (segunda dimensão da camada 0)
int colunas = cubo[0][0].length;         // 5 (terceira dimensão)

int totalElementos = camadas * linhas * colunas;  // 3 × 4 × 5 = 60

System.out.println("Dimensões: " + camadas + "x" + linhas + "x" + colunas);
// Dimensões: 3x4x5
```

**Importante**: Em arrays irregulares 3D, cada camada/linha pode ter tamanho diferente!

### 6. Iteração Completa - Loops Triplos

**For tradicional aninhado (3 níveis)**:
```java
int[][][] cubo = new int[2][3][4];

// Preencher com valores sequenciais
int contador = 0;
for (int i = 0; i < cubo.length; i++) {              // Camadas
    for (int j = 0; j < cubo[i].length; j++) {        // Linhas
        for (int k = 0; k < cubo[i][j].length; k++) {  // Colunas
            cubo[i][j][k] = contador++;
        }
    }
}

// Imprimir todos os elementos
for (int i = 0; i < cubo.length; i++) {
    System.out.println("Camada " + i + ":");
    for (int j = 0; j < cubo[i].length; j++) {
        for (int k = 0; k < cubo[i][j].length; k++) {
            System.out.print(cubo[i][j][k] + " ");
        }
        System.out.println();
    }
    System.out.println();
}
```

**For-each aninhado**:
```java
for (int[][] camada : cubo) {          // Cada camada é uma matriz 2D
    for (int[] linha : camada) {        // Cada linha é um array 1D
        for (int elemento : linha) {    // Cada elemento é um int
            System.out.print(elemento + " ");
        }
        System.out.println();
    }
    System.out.println("---");
}
```

### 7. Arrays 4D, 5D e N-Dimensionais

**Array 4D** (hipercubo):
```java
int[][][][] hipercubo = new int[2][3][4][5];

// 2 cubos
// Cada cubo tem 3 camadas
// Cada camada tem 4 linhas
// Cada linha tem 5 colunas
// Total: 2 × 3 × 4 × 5 = 120 elementos

// Acesso: hipercubo[cubo][camada][linha][coluna]
hipercubo[0][1][2][3] = 100;
hipercubo[1][0][0][4] = 200;

// Dimensões:
hipercubo.length;              // 2 (cubos)
hipercubo[0].length;           // 3 (camadas)
hipercubo[0][0].length;        // 4 (linhas)
hipercubo[0][0][0].length;     // 5 (colunas)
```

**Array 5D e além** (raramente usado):
```java
int[][][][][] array5D = new int[2][2][2][2][2];  // 32 elementos

// Acesso exige 5 índices
array5D[0][1][0][1][1] = 42;

// Iteração: 5 loops aninhados (complexo!)
```

**Na prática**: Arrays com mais de 4 dimensões são extremamente raros. Se precisar, considere estruturas alternativas (classes, listas de listas, etc).

### 8. Arrays Irregulares 3D (Jagged 3D)

**Cada camada/linha pode ter tamanho diferente**:
```java
// Criar array 3D irregular
int[][][] irregular = new int[2][][];  // 2 camadas, tamanhos indefinidos

// Camada 0: 2 linhas de tamanhos diferentes
irregular[0] = new int[2][];
irregular[0][0] = new int[3];  // Linha 0: 3 colunas
irregular[0][1] = new int[5];  // Linha 1: 5 colunas

// Camada 1: 3 linhas de tamanhos diferentes
irregular[1] = new int[3][];
irregular[1][0] = new int[2];  // Linha 0: 2 colunas
irregular[1][1] = new int[4];  // Linha 1: 4 colunas
irregular[1][2] = new int[1];  // Linha 2: 1 coluna

// Iteração segura
for (int i = 0; i < irregular.length; i++) {
    for (int j = 0; j < irregular[i].length; j++) {
        for (int k = 0; k < irregular[i][j].length; k++) {
            System.out.print(irregular[i][j][k] + " ");
        }
        System.out.println();
    }
}
```

### 9. Operações Comuns em Arrays 3D

**Soma de todos os elementos**:
```java
int soma = 0;
for (int[][] camada : cubo) {
    for (int[] linha : camada) {
        for (int elemento : linha) {
            soma += elemento;
        }
    }
}
```

**Encontrar máximo**:
```java
int max = cubo[0][0][0];
for (int[][] camada : cubo) {
    for (int[] linha : camada) {
        for (int elemento : linha) {
            if (elemento > max) max = elemento;
        }
    }
}
```

**Copiar cubo**:
```java
int[][][] copia = new int[cubo.length][][];
for (int i = 0; i < cubo.length; i++) {
    copia[i] = new int[cubo[i].length][];
    for (int j = 0; j < cubo[i].length; j++) {
        copia[i][j] = Arrays.copyOf(cubo[i][j], cubo[i][j].length);
    }
}
```

### 10. Validação de Índices 3D

**Verificação tripla**:
```java
public static boolean indiceValido3D(int[][][] arr, int i, int j, int k) {
    return i >= 0 && i < arr.length &&
           j >= 0 && j < arr[i].length &&
           k >= 0 && k < arr[i][j].length;
}

// Uso
if (indiceValido3D(cubo, camada, linha, coluna)) {
    cubo[camada][linha][coluna] = 100;
}
```

---

## 🎯 Aplicabilidade e Contextos de Uso

1. **Simulações 3D**: Física (x, y, z), jogos (voxels), modelagem espacial
2. **Vídeo**: Frames (tempo) × altura × largura, processar sequências de imagens
3. **Cubos de dados (OLAP)**: Business Intelligence - múltiplas dimensões de análise
4. **Tensores**: Machine Learning, redes neurais (batch × altura × largura)
5. **Dados temporais 2D**: Evolução de matrizes ao longo do tempo
6. **Volumes médicos**: Tomografias, ressonâncias (fatias 3D)
7. **Clima**: Longitude × latitude × altitude

---

## ⚠️ Armadilhas Comuns

1. **Complexidade cognitiva**: Difícil visualizar mentalmente estruturas 3D+
2. **Ordem dos índices**: Confundir qual dimensão é qual
3. **Alto consumo de memória**: 100×100×100 = 1 milhão de elementos!
4. **Loops profundamente aninhados**: Código difícil de ler/manter
5. **Validação incompleta**: Esquecer de validar todas as dimensões
6. **Arrays irregulares complexos**: Tamanhos variáveis complicam ainda mais
7. **Performance**: Muitos níveis de indireção afetam cache do CPU

---

## ✅ Boas Práticas

1. **Documente cada dimensão**: Comente claramente o que cada índice representa
2. **Use constantes**: `final int CAMADAS = 3, LINHAS = 4, COLUNAS = 5;`
3. **Nomes significativos**: `video[frame][linha][pixel]` melhor que `arr[i][j][k]`
4. **Considere alternativas**: Classes com arrays 2D podem ser mais claras
5. **Valide todas as dimensões**: Não assuma índices válidos
6. **Evite 4D+**: Se necessário, provavelmente há design melhor
7. **Métodos auxiliares**: Encapsule operações complexas
8. **Performance**: Se crítico, considere arrays 1D com cálculo de índice

---

## 📚 Resumo Executivo

**Arrays 3D**: `tipo[][][]` organizam dados em três dimensões (profundidade/camadas, altura/linhas, largura/colunas). Acesso: `arr[i][j][k]`. Criar: `new tipo[d1][d2][d3]`. Dimensões: `arr.length`, `arr[i].length`, `arr[i][j].length`. Java suporta arrays N-dimensionais (4D, 5D, etc), mas raramente úseis além de 3D. Iteração: loops triplos aninhados ou for-each. Irregular: cada camada/linha pode ter tamanho diferente. Aplicações: simulações 3D, vídeo, cubos de dados BI, tensores ML. Sempre documente significado de cada dimensão e valide todos os índices.
