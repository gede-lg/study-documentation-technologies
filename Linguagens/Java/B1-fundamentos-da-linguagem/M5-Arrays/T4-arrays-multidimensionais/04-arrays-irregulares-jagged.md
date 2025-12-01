# Arrays Irregulares (Jagged Arrays)

## 🎯 Introdução e Definição

### Conceito de Arrays Irregulares

**Arrays irregulares** (também chamados de **jagged arrays** ou **ragged arrays**) são estruturas bidimensionais onde **cada linha pode ter um número diferente de elementos**. Ao contrário de matrizes retangulares (onde todas as linhas têm o mesmo tamanho), arrays irregulares oferecem **flexibilidade dimensional**, permitindo que cada linha seja um array independente com seu próprio comprimento.

Esta capacidade existe porque, em Java, arrays 2D são implementados como **arrays de arrays** - o array "externo" contém referências para arrays "internos" que podem ter tamanhos completamente diferentes.

```java
// Array irregular - linhas de tamanhos diferentes
int[][] jagged = {
    {1, 2},           // Linha 0: 2 elementos
    {3, 4, 5},        // Linha 1: 3 elementos
    {6},              // Linha 2: 1 elemento
    {7, 8, 9, 10}     // Linha 3: 4 elementos
};

// Visualização:
// [0] → [1, 2]
// [1] → [3, 4, 5]
// [2] → [6]
// [3] → [7, 8, 9, 10]
```

**Diferença fundamental**:
- **Matriz retangular**: `new int[3][4]` - todas as 3 linhas têm exatamente 4 colunas
- **Array irregular**: `new int[3][]` - 3 linhas, cada uma com tamanho próprio

---

## 🧠 Fundamentos Teóricos

### 1. Criação - Especificando Apenas a Primeira Dimensão

**Sintaxe fundamental**: `new tipo[numLinhas][]` - cria array de linhas, mas cada linha é `null` inicialmente.

```java
// Criar estrutura com 3 linhas (todas null)
int[][] jagged = new int[3][];

// Neste ponto:
// jagged.length = 3
// jagged[0] = null
// jagged[1] = null
// jagged[2] = null

// Tentar acessar jagged[0][0] causaria NullPointerException!

// Inicializar cada linha com tamanho específico
jagged[0] = new int[2];   // Linha 0: 2 elementos (ambos 0)
jagged[1] = new int[4];   // Linha 1: 4 elementos (todos 0)
jagged[2] = new int[1];   // Linha 2: 1 elemento (0)

// Agora é seguro acessar:
jagged[0][0] = 10;
jagged[0][1] = 20;
jagged[1][0] = 30;
// ... etc
```

**Estrutura na memória**:
```
jagged → [ref0, ref1, ref2]
          ↓     ↓     ↓
        [0,0]  [0,0,0,0]  [0]
```

### 2. Inicialização Inline - Valores Imediatos

**Forma mais direta**: usar chaves aninhadas com diferentes quantidades de elementos.

```java
// Cada linha com tamanho diferente
int[][] jagged = {
    {1, 2, 3},        // 3 elementos
    {4, 5},           // 2 elementos
    {6, 7, 8, 9},     // 4 elementos
    {10}              // 1 elemento
};

// Tamanhos:
jagged.length;         // 4 (4 linhas)
jagged[0].length;      // 3
jagged[1].length;      // 2
jagged[2].length;      // 4
jagged[3].length;      // 1

// Acessos válidos:
jagged[0][2];  // 3
jagged[1][1];  // 5
jagged[3][0];  // 10

// Inválidos (ArrayIndexOutOfBoundsException):
// jagged[1][2]  - linha 1 só tem 2 elementos (0,1)
// jagged[3][1]  - linha 3 só tem 1 elemento (0)
```

**Arrays de objetos irregulares**:
```java
String[][] nomes = {
    {"Ana", "Bruno"},
    {"Carlos"},
    {"Diana", "Eduardo", "Fernanda"}
};
```

### 3. Tamanhos Dinâmicos - Calculados em Runtime

**Padrão crescente** (estrutura triangular):
```java
int linhas = 5;
int[][] triangulo = new int[linhas][];

for (int i = 0; i < linhas; i++) {
    triangulo[i] = new int[i + 1];  // Linha i tem (i+1) elementos
}

// Resultado:
// triangulo[0] = new int[1];  // [0]
// triangulo[1] = new int[2];  // [0, 0]
// triangulo[2] = new int[3];  // [0, 0, 0]
// triangulo[3] = new int[4];  // [0, 0, 0, 0]
// triangulo[4] = new int[5];  // [0, 0, 0, 0, 0]

// Visualização:
// [0]
// [0, 0]
// [0, 0, 0]
// [0, 0, 0, 0]
// [0, 0, 0, 0, 0]
```

**Padrão decrescente** (triângulo invertido):
```java
int n = 5;
int[][] invertido = new int[n][];

for (int i = 0; i < n; i++) {
    invertido[i] = new int[n - i];
}

// Resultado:
// [0, 0, 0, 0, 0]
// [0, 0, 0, 0]
// [0, 0, 0]
// [0, 0]
// [0]
```

**Tamanhos aleatórios**:
```java
import java.util.Random;

Random rand = new Random();
int[][] aleatorio = new int[4][];

for (int i = 0; i < aleatorio.length; i++) {
    int tamanho = rand.nextInt(6) + 1;  // 1 a 6 elementos
    aleatorio[i] = new int[tamanho];
}

// Cada linha terá tamanho aleatório entre 1 e 6
```

### 4. Acesso Seguro com Validação Dupla

**Validação obrigatória**: verificar linha E coluna individualmente.

```java
int[][] jagged = {{1,2}, {3,4,5}, {6}};

int linha = 1;
int coluna = 2;

// Validação completa
if (linha >= 0 && linha < jagged.length) {              // Linha existe?
    if (coluna >= 0 && coluna < jagged[linha].length) {  // Coluna existe NESTA linha?
        int valor = jagged[linha][coluna];  // Seguro!
        System.out.println(valor);  // 5
    } else {
        System.out.println("Coluna inválida para linha " + linha);
    }
} else {
    System.out.println("Linha inválida");
}
```

**Método auxiliar**:
```java
public static boolean indiceValido(int[][] arr, int lin, int col) {
    return lin >= 0 && lin < arr.length &&
           arr[lin] != null &&  // Linha foi inicializada?
           col >= 0 && col < arr[lin].length;
}

// Uso
if (indiceValido(jagged, i, j)) {
    jagged[i][j] = 100;
}
```

### 5. Descobrindo Tamanho de Cada Linha

**Iterar e exibir tamanhos**:
```java
int[][] jagged = {{1,2}, {3,4,5}, {6}, {7,8,9,10}};

System.out.println("Total de linhas: " + jagged.length);
for (int i = 0; i < jagged.length; i++) {
    System.out.println("Linha " + i + ": " + jagged[i].length + " elementos");
}

// Saída:
// Total de linhas: 4
// Linha 0: 2 elementos
// Linha 1: 3 elementos
// Linha 2: 1 elementos
// Linha 3: 4 elementos
```

**Encontrar linha mais longa**:
```java
int maxTamanho = 0;
int linhaMax = 0;

for (int i = 0; i < jagged.length; i++) {
    if (jagged[i].length > maxTamanho) {
        maxTamanho = jagged[i].length;
        linhaMax = i;
    }
}

System.out.println("Linha mais longa: " + linhaMax + " com " + maxTamanho + " elementos");
```

### 6. Triângulo de Pascal

**Aplicação clássica**: cada linha tem (n+1) elementos.

```java
public static int[][] trianguloPascal(int linhas) {
    int[][] pascal = new int[linhas][];
    
    for (int i = 0; i < linhas; i++) {
        pascal[i] = new int[i + 1];  // Linha i tem i+1 elementos
        pascal[i][0] = 1;            // Primeira posição sempre 1
        pascal[i][i] = 1;            // Última posição sempre 1
        
        // Elementos do meio: soma dos dois acima
        for (int j = 1; j < i; j++) {
            pascal[i][j] = pascal[i-1][j-1] + pascal[i-1][j];
        }
    }
    
    return pascal;
}

// Uso:
int[][] pascal = trianguloPascal(5);
// Resultado:
// [1]
// [1, 1]
// [1, 2, 1]
// [1, 3, 3, 1]
// [1, 4, 6, 4, 1]
```

### 7. Economizar Memória - Matrizes Simétricas

**Matriz triangular superior**: armazenar apenas metade.

```java
int n = 4;
int[][] upper = new int[n][];

// Apenas diagonal e acima
for (int i = 0; i < n; i++) {
    upper[i] = new int[n - i];  // Linha i tem (n-i) elementos
}

// Visualização (n=4):
// upper[0]: [_, _, _, _]  (4 elementos)
// upper[1]: [_, _, _]     (3 elementos)
// upper[2]: [_, _]        (2 elementos)
// upper[3]: [_]           (1 elemento)

// Acesso:
// upper[i][j-i] ao invés de matriz[i][j] onde j >= i
```

**Economia de memória**:
- Matriz completa n×n: n² elementos
- Triangular: n(n+1)/2 elementos
- Para n=100: 10.000 vs 5.050 (50% de economia!)

### 8. Listas de Adjacência em Grafos

**Representação de grafos**: cada vértice tem número variável de vizinhos.

```java
// Grafo com 5 vértices
int[][] grafo = new int[5][];

// Vértice 0 conecta com 1, 2, 4
grafo[0] = new int[]{1, 2, 4};

// Vértice 1 conecta apenas com 3
grafo[1] = new int[]{3};

// Vértice 2 conecta com 0, 4
grafo[2] = new int[]{0, 4};

// Vértice 3 não tem conexões
grafo[3] = new int[]{};

// Vértice 4 conecta com 0, 2, 3
grafo[4] = new int[]{0, 2, 3};

// Percorrer vizinhos de um vértice
int vertice = 0;
System.out.print("Vizinhos de " + vertice + ": ");
for (int vizinho : grafo[vertice]) {
    System.out.print(vizinho + " ");
}
```

### 9. Iteração Segura em Arrays Irregulares

**For tradicional com length dinâmico**:
```java
int[][] jagged = {{1,2}, {3,4,5}, {6}};

for (int i = 0; i < jagged.length; i++) {
    for (int j = 0; j < jagged[i].length; j++) {  // Tamanho específico da linha i
        System.out.print(jagged[i][j] + " ");
    }
    System.out.println();
}

// Saída:
// 1 2
// 3 4 5
// 6
```

**For-each (mais seguro)**:
```java
for (int[] linha : jagged) {
    for (int elemento : linha) {
        System.out.print(elemento + " ");
    }
    System.out.println();
}
```

### 10. Combinar Linhas Regulares e Irregulares

**Parte regular, parte irregular**:
```java
int[][] misto = new int[5][];

// Primeiras 3 linhas: tamanho fixo
for (int i = 0; i < 3; i++) {
    misto[i] = new int[4];  // Todas com 4 elementos
}

// Últimas 2 linhas: tamanhos diferentes
misto[3] = new int[2];
misto[4] = new int[6];

// Estrutura final:
// [4 elementos]
// [4 elementos]
// [4 elementos]
// [2 elementos]
// [6 elementos]
```

---

## 🎯 Aplicabilidade e Contextos de Uso

1. **Triângulo de Pascal**: Cada linha tem n+1 elementos
2. **Grafos**: Listas de adjacência (vértices com vários vizinhos)
3. **Matrizes esparsas**: Economizar memória armazenando só valores não-zero
4. **Dados hierárquicos**: Categorias com subcategorias variáveis
5. **Calendários**: Meses com dias diferentes (28, 30, 31)
6. **Matrizes triangulares**: Matrizes simétricas (metade superior/inferior)
7. **Tabelas dinâmicas**: Dados onde linhas têm campos variáveis

---

## ⚠️ Armadilhas Comuns

1. **Assumir tamanho uniforme**: `jagged[i].length` varia! Não use constante
2. **NullPointerException**: Linhas não inicializadas são `null`
3. **ArrayIndexOutOfBoundsException**: Acessar `jagged[i][j]` onde `j >= jagged[i].length`
4. **Esquecer validação de coluna**: Validar linha não é suficiente!
5. **Loops com tamanho fixo**: Não use `j < COLUNAS`, use `j < jagged[i].length`
6. **Imprimir com loops aninhados fixos**: Causará exceções

---

## ✅ Boas Práticas

1. **Sempre use `jagged[i].length`**: Nunca assuma tamanho fixo
2. **Inicialize todas as linhas**: Antes de usar, garantir nenhuma é `null`
3. **Validação dupla**: Linha E coluna individualmente
4. **Documente estrutura**: Explique padrão de tamanhos das linhas
5. **Prefer for-each**: Quando não precisa de índices
6. **Verifique null**: `if (jagged[i] != null)` antes de acessar
7. **Métodos auxiliares**: Encapsule validação e acesso
8. **Comente economia de memória**: Se usar para otimizar espaço

---

## 📚 Resumo Executivo

**Arrays irregulares (jagged)** permitem linhas com **tamanhos diferentes**. Criar: `new tipo[n][]` inicializa apenas array de linhas (todas `null`). Cada linha deve ser inicializada individualmente: `arr[i] = new tipo[tamanho]`. Tamanho varia: use `arr[i].length` (não constante). Validação crítica: verificar linha E coluna. Aplicações: triângulo Pascal, grafos, matrizes esparsas/triangulares. Economia de memória em estruturas simétricas. Sempre inicialize antes de usar e valide acessos para evitar `NullPointerException` e `ArrayIndexOutOfBoundsException`.
