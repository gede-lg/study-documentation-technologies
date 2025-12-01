# for Aninhado

## 🎯 Introdução e Definição

### Definição Conceitual

**for aninhado** (nested for) é a **colocação de um ou mais loops for dentro do corpo de outro loop for**, criando **estruturas de iteração multidimensionais**. O **loop externo** controla a **iteração principal**, enquanto **loops internos** executam **completamente** a cada iteração do loop externo, formando uma **hierarquia de repetições**. Essencial para processar **matrizes**, **tabelas**, **grades**, e qualquer estrutura **bidimensional ou multidimensional**.

**Estrutura visual**:
```java
for (/* loop externo */) {
    // Executa uma vez por iteração externa
    
    for (/* loop interno */) {
        // Executa completamente a cada iteração externa
    }
    
    // Continua após loop interno
}
```

**Execução visual**:
```
Loop externo i=0
    Loop interno j=0
    Loop interno j=1
    Loop interno j=2
    Loop interno j=3
Loop externo i=1
    Loop interno j=0
    Loop interno j=1
    Loop interno j=2
    Loop interno j=3
Loop externo i=2
    ...
```

**Exemplo fundamental**:
```java
// Tabela de multiplicação 3x3
for (int i = 1; i <= 3; i++) {           // Loop externo: linhas
    for (int j = 1; j <= 3; j++) {       // Loop interno: colunas
        System.out.print(i + "x" + j + "=" + (i*j) + "\t");
    }
    System.out.println();  // Nova linha após cada linha
}

// Saída:
// 1x1=1    1x2=2    1x3=3    
// 2x1=2    2x2=4    2x3=6    
// 3x1=3    3x2=6    3x3=9
```

---

## 📋 Sumário Conceitual

### Características de for Aninhado

| Aspecto | Descrição |
|---------|-----------|
| **Loop externo** | Controla iteração principal (geralmente linhas) |
| **Loop interno** | Executa completamente a cada iteração externa (geralmente colunas) |
| **Profundidade** | Número de níveis (2, 3, 4... loops) |
| **Complexidade** | O(n²) para 2 níveis, O(n³) para 3 níveis |
| **Uso comum** | Matrizes, tabelas, grades, combinações |

---

## 🧠 Fundamentos Teóricos

### 1. for Aninhado de 2 Níveis

**Estrutura básica**:
```java
for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        // Processa posição [i][j]
    }
}
```

**Execução passo a passo**:
```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 2; j++) {
        System.out.println("i=" + i + " j=" + j);
    }
}

// Execução:
// i=0, j=0
// i=0, j=1  (loop interno completo)
// i=1, j=0
// i=1, j=1  (loop interno completo)
// i=2, j=0
// i=2, j=1  (loop interno completo)
```

**Total de iterações**: `linhas × colunas`
```java
// 3 linhas × 4 colunas = 12 iterações
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        // Executa 12 vezes
    }
}
```

### 2. Matrizes (Arrays Bidimensionais)

**Declaração e iteração**:
```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Percorrer toda matriz
for (int i = 0; i < matriz.length; i++) {           // Linhas
    for (int j = 0; j < matriz[i].length; j++) {    // Colunas
        System.out.print(matriz[i][j] + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3 
// 4 5 6 
// 7 8 9
```

**Soma de todos elementos**:
```java
int[][] matriz = {{1,2,3}, {4,5,6}, {7,8,9}};
int soma = 0;

for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        soma += matriz[i][j];
    }
}

System.out.println("Soma: " + soma);  // 45
```

**Encontrar máximo**:
```java
int[][] matriz = {{5,2,8}, {1,9,3}, {7,4,6}};
int max = matriz[0][0];

for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] > max) {
            max = matriz[i][j];
        }
    }
}

System.out.println("Máximo: " + max);  // 9
```

### 3. Padrões Geométricos

**Quadrado de asteriscos**:
```java
int tamanho = 5;

for (int i = 0; i < tamanho; i++) {
    for (int j = 0; j < tamanho; j++) {
        System.out.print("* ");
    }
    System.out.println();
}

// Saída:
// * * * * * 
// * * * * * 
// * * * * * 
// * * * * * 
// * * * * *
```

**Triângulo crescente**:
```java
int altura = 5;

for (int i = 1; i <= altura; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}

// Saída:
// * 
// * * 
// * * * 
// * * * * 
// * * * * *
```

**Triângulo decrescente**:
```java
int altura = 5;

for (int i = altura; i >= 1; i--) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}

// Saída:
// * * * * * 
// * * * * 
// * * * 
// * * 
// *
```

**Pirâmide**:
```java
int altura = 5;

for (int i = 1; i <= altura; i++) {
    // Espaços antes
    for (int j = 1; j <= altura - i; j++) {
        System.out.print("  ");
    }
    // Asteriscos
    for (int j = 1; j <= 2 * i - 1; j++) {
        System.out.print("* ");
    }
    System.out.println();
}

// Saída:
//         * 
//       * * * 
//     * * * * * 
//   * * * * * * * 
// * * * * * * * * *
```

### 4. Diagonal e Transposta

**Diagonal principal**:
```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

System.out.println("Diagonal principal:");
for (int i = 0; i < matriz.length; i++) {
    System.out.println(matriz[i][i]);  // i == j
}

// Saída: 1, 5, 9
```

**Diagonal secundária**:
```java
int n = matriz.length;

System.out.println("Diagonal secundária:");
for (int i = 0; i < n; i++) {
    System.out.println(matriz[i][n - 1 - i]);  // j = n - 1 - i
}

// Saída: 3, 5, 7
```

**Transposta**:
```java
int[][] matriz = {
    {1, 2, 3},
    {4, 5, 6}
};

int linhas = matriz.length;
int colunas = matriz[0].length;
int[][] transposta = new int[colunas][linhas];

for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        transposta[j][i] = matriz[i][j];  // Troca i e j
    }
}

// transposta = {{1,4}, {2,5}, {3,6}}
```

### 5. for Aninhado de 3 Níveis

**Estrutura**:
```java
for (int i = 0; i < x; i++) {           // Nível 1
    for (int j = 0; j < y; j++) {       // Nível 2
        for (int k = 0; k < z; k++) {   // Nível 3
            // Executa x * y * z vezes
        }
    }
}
```

**Array 3D (cubo)**:
```java
int[][][] cubo = {
    {{1,2}, {3,4}},
    {{5,6}, {7,8}}
};

// cubo[camada][linha][coluna]
for (int i = 0; i < cubo.length; i++) {
    System.out.println("Camada " + i + ":");
    for (int j = 0; j < cubo[i].length; j++) {
        for (int k = 0; k < cubo[i][j].length; k++) {
            System.out.print(cubo[i][j][k] + " ");
        }
        System.out.println();
    }
}

// Saída:
// Camada 0:
// 1 2 
// 3 4 
// Camada 1:
// 5 6 
// 7 8
```

**Combinações de 3 elementos**:
```java
String[] letras = {"A", "B", "C"};

for (int i = 0; i < letras.length; i++) {
    for (int j = 0; j < letras.length; j++) {
        for (int k = 0; k < letras.length; k++) {
            System.out.println(letras[i] + letras[j] + letras[k]);
        }
    }
}

// Saída: AAA, AAB, AAC, ABA, ABB, ABC, ..., CCC (27 combinações)
```

### 6. Combinações e Permutações

**Todas as combinações (pares)**:
```java
int[] arr1 = {1, 2, 3};
int[] arr2 = {10, 20};

for (int i = 0; i < arr1.length; i++) {
    for (int j = 0; j < arr2.length; j++) {
        System.out.println("(" + arr1[i] + ", " + arr2[j] + ")");
    }
}

// Saída:
// (1, 10)
// (1, 20)
// (2, 10)
// (2, 20)
// (3, 10)
// (3, 20)
```

**Pares únicos (evitar duplicatas)**:
```java
int[] arr = {1, 2, 3, 4};

// Apenas i < j para evitar pares duplicados
for (int i = 0; i < arr.length; i++) {
    for (int j = i + 1; j < arr.length; j++) {
        System.out.println("(" + arr[i] + ", " + arr[j] + ")");
    }
}

// Saída:
// (1, 2)
// (1, 3)
// (1, 4)
// (2, 3)
// (2, 4)
// (3, 4)
```

### 7. Tabela de Multiplicação

**Tabela completa 10x10**:
```java
System.out.print("   ");
for (int j = 1; j <= 10; j++) {
    System.out.printf("%4d", j);
}
System.out.println("\n   " + "-".repeat(40));

for (int i = 1; i <= 10; i++) {
    System.out.printf("%2d |", i);
    for (int j = 1; j <= 10; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}

// Saída: Tabela formatada de multiplicação
```

### 8. Complexidade de Tempo

**O(n²)** - 2 loops aninhados:
```java
// n iterações externas × n iterações internas = n²
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // O(n²) operações
    }
}
```

**O(n³)** - 3 loops aninhados:
```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        for (int k = 0; k < n; k++) {
            // O(n³) operações
        }
    }
}
```

**O(n×m)** - Diferentes tamanhos:
```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        // O(n×m) operações
    }
}
```

### 9. break e continue em Loops Aninhados

**break**: Sai apenas do loop **mais interno**
```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            break;  // Sai do loop interno (j), não do externo (i)
        }
        System.out.println("i=" + i + " j=" + j);
    }
}

// Saída:
// i=0 j=0
// i=1 j=0
// i=2 j=0
```

**break com label**: Sai de loop **específico**
```java
externo:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            break externo;  // Sai do loop externo
        }
        System.out.println("i=" + i + " j=" + j);
    }
}

// Saída:
// i=0 j=0
// i=0 j=1
// i=0 j=2
// i=1 j=0
```

**continue**: Pula para próxima iteração do loop **mais interno**
```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            continue;  // Pula j=1, continua com j=2
        }
        System.out.println("i=" + i + " j=" + j);
    }
}

// Saída:
// i=0 j=0
// i=0 j=2
// i=1 j=0
// i=1 j=2
// i=2 j=0
// i=2 j=2
```

### 10. for Aninhado com Arrays Irregulares

**Jagged array** (linhas com tamanhos diferentes):
```java
int[][] jagged = {
    {1, 2, 3, 4},
    {5, 6},
    {7, 8, 9}
};

// matriz[i].length: tamanho de cada linha
for (int i = 0; i < jagged.length; i++) {
    for (int j = 0; j < jagged[i].length; j++) {
        System.out.print(jagged[i][j] + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3 4 
// 5 6 
// 7 8 9
```

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Jogo da Velha (Tabuleiro)

```java
char[][] tabuleiro = {
    {'X', 'O', 'X'},
    {'O', 'X', 'O'},
    {'X', 'O', 'X'}
};

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        System.out.print(tabuleiro[i][j] + " ");
    }
    System.out.println();
}
```

### Cenário 2: Média de Notas (Alunos e Provas)

```java
double[][] notas = {
    {7.5, 8.0, 9.0},  // Aluno 1
    {6.5, 7.0, 8.5},  // Aluno 2
    {9.0, 9.5, 10.0}  // Aluno 3
};

for (int i = 0; i < notas.length; i++) {
    double soma = 0;
    for (int j = 0; j < notas[i].length; j++) {
        soma += notas[i][j];
    }
    double media = soma / notas[i].length;
    System.out.printf("Aluno %d - Média: %.2f%n", i + 1, media);
}
```

### Cenário 3: Busca em Matriz

```java
int[][] matriz = {{1,2,3}, {4,5,6}, {7,8,9}};
int procurado = 5;
boolean encontrado = false;

externo:
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] == procurado) {
            System.out.println("Encontrado em [" + i + "][" + j + "]");
            encontrado = true;
            break externo;
        }
    }
}
```

---

## ⚠️ Armadilhas Comuns

### 1. **Confundir Ordem de Índices**

```java
int[][] matriz = new int[3][4];  // 3 linhas, 4 colunas

// ❌ Invertido
for (int j = 0; j < 4; j++) {
    for (int i = 0; i < 3; i++) {
        matriz[i][j] = i + j;  // Funciona mas confuso
    }
}

// ✅ Ordem natural: i (linhas), j (colunas)
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
        matriz[i][j] = i + j;
    }
}
```

### 2. **Complexidade Exponencial**

```java
// ❌ O(n³): muito lento para n grande
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        for (int k = 0; k < n; k++) {
            // n=100 → 1.000.000 iterações
            // n=1000 → 1.000.000.000 iterações
        }
    }
}
```

### 3. **ArrayIndexOutOfBoundsException**

```java
int[][] matriz = {{1,2}, {3,4}};

// ❌ matriz[0].length seria 2, mas matriz tem 2 linhas
for (int i = 0; i < matriz[0].length; i++) {
    for (int j = 0; j < matriz[0].length; j++) {
        // OK para matriz quadrada, mas frágil
    }
}

// ✅ Usar tamanho correto
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        // Sempre correto
    }
}
```

---

## 🚀 Boas Práticas

### 1. ✅ Nomes de Variáveis Descritivos

```java
// ✅ Nomes claros
for (int linha = 0; linha < matriz.length; linha++) {
    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
        processar(matriz[linha][coluna]);
    }
}
```

### 2. ✅ Evite Aninhamento Profundo

```java
// ❌ 4+ níveis: difícil de manter
for (...) {
    for (...) {
        for (...) {
            for (...) {
                // Muito complexo!
            }
        }
    }
}

// ✅ Extraia para métodos
for (int i = 0; i < n; i++) {
    processarLinha(i);  // Método próprio
}
```

### 3. ✅ Use Labels para Clareza

```java
// ✅ Label torna intenção clara
busca:
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        if (encontrou) {
            break busca;
        }
    }
}
```

---

## 📚 Resumo

**for aninhado** coloca loops **dentro de outros loops**, criando iteração **multidimensional**. **Loop interno** executa **completamente** a cada iteração do **loop externo**. **Complexidade**: O(n²) para 2 níveis, O(n³) para 3 níveis. **Uso comum**: Matrizes (arrays 2D), tabelas, padrões geométricos, combinações. **Padrões**: Triângulos (`j <= i`), quadrados (`j < tamanho`), pirâmides (espaços + asteriscos). **Diagonal principal**: `i == j`, **diagonal secundária**: `j = n - 1 - i`. **break**: Sai do loop **mais interno** (use **label** para sair de externo). **continue**: Pula para próxima iteração do loop **mais interno**. **Arrays irregulares**: Use `matriz[i].length` (tamanho de cada linha). **Boas práticas**: Nomes descritivos (`linha/coluna`), evite +3 níveis (extraia métodos), use labels para clareza, otimize complexidade quando possível.
