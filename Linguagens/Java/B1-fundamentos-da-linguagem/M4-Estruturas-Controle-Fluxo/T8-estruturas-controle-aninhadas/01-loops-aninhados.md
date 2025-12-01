# Loops Aninhados

## 🎯 Introdução e Definição

### Definição Conceitual

**Loops aninhados** (nested loops) são estruturas onde **um loop está contido dentro do corpo de outro loop**, criando **hierarquias de repetição**. O **loop interno** executa **completamente** a cada iteração do **loop externo**, multiplicando o número total de iterações. Fundamental para processar **estruturas bidimensionais** (matrizes, tabelas), **combinações**, **padrões geométricos**, e qualquer problema que requer **múltiplos níveis de iteração**.

**Estrutura visual**:
```java
// Loop externo (controla iteração principal)
for (int i = 0; i < linhas; i++) {
    
    // Loop interno (executa completamente a cada i)
    for (int j = 0; j < colunas; j++) {
        // Corpo executa linhas × colunas vezes
    }
}
```

**Execução visual**:
```
Loop externo: i=0
    Loop interno: j=0, j=1, j=2  (completo)
Loop externo: i=1
    Loop interno: j=0, j=1, j=2  (completo)
Loop externo: i=2
    Loop interno: j=0, j=1, j=2  (completo)
```

**Exemplo fundamental**:
```java
// Tabela 3x4
for (int i = 0; i < 3; i++) {           // 3 linhas
    for (int j = 0; j < 4; j++) {       // 4 colunas por linha
        System.out.print("(" + i + "," + j + ") ");
    }
    System.out.println();
}

// Saída:
// (0,0) (0,1) (0,2) (0,3) 
// (1,0) (1,1) (1,2) (1,3) 
// (2,0) (2,1) (2,2) (2,3)
// Total: 12 iterações (3 × 4)
```

---

## 📋 Sumário Conceitual

### Características de Loops Aninhados

| Aspecto | Descrição |
|---------|-----------|
| **Profundidade** | Número de níveis (2, 3, 4+) |
| **Total iterações** | Multiplicação dos ranges (n × m × k...) |
| **Complexidade** | O(n²) para 2 níveis, O(n³) para 3, etc |
| **Uso comum** | Matrizes, combinações, padrões, tabelas |

### Tipos de Loops Misturados

| Loop Externo | Loop Interno | Uso |
|--------------|--------------|-----|
| **for** | **for** | Mais comum (índices) |
| **for** | **while** | Condição variável interna |
| **while** | **for** | Condição variável externa |
| **while** | **while** | Ambas condições variáveis |

---

## 🧠 Fundamentos Teóricos

### 1. for Aninhado Básico (2 Níveis)

**Estrutura padrão**:
```java
for (int i = 0; i < externo; i++) {      // Loop externo
    for (int j = 0; j < interno; j++) {  // Loop interno
        // Executa externo × interno vezes
    }
}
```

**Exemplo: Contagem de execuções**:
```java
int contador = 0;

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 2; j++) {
        contador++;
        System.out.println("i=" + i + " j=" + j + " contador=" + contador);
    }
}

// Saída:
// i=0 j=0 contador=1
// i=0 j=1 contador=2
// i=1 j=0 contador=3
// i=1 j=1 contador=4
// i=2 j=0 contador=5
// i=2 j=1 contador=6

System.out.println("Total: " + contador);  // 6 (3 × 2)
```

**Total de iterações**: `externo × interno`

### 2. Processamento de Matrizes

**Array bidimensional**:
```java
int[][] matriz = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};

// Percorrer toda matriz
for (int i = 0; i < matriz.length; i++) {           // Linhas
    for (int j = 0; j < matriz[i].length; j++) {    // Colunas
        System.out.print(matriz[i][j] + "\t");
    }
    System.out.println();
}

// Saída:
// 1    2    3    4    
// 5    6    7    8    
// 9    10   11   12
```

**Operações em matrizes**:

**Soma de todos os elementos**:
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
int max = matriz[0][0];

for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] > max) {
            max = matriz[i][j];
        }
    }
}

System.out.println("Máximo: " + max);
```

**Busca em matriz**:
```java
int procurado = 7;
boolean encontrado = false;
int linhaEncontrada = -1, colunaEncontrada = -1;

externo:
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        if (matriz[i][j] == procurado) {
            linhaEncontrada = i;
            colunaEncontrada = j;
            encontrado = true;
            break externo;  // Sai de ambos os loops
        }
    }
}

if (encontrado) {
    System.out.println("Encontrado em [" + linhaEncontrada + "][" + colunaEncontrada + "]");
}
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

### 4. while Aninhado

**Estrutura**:
```java
int i = 0;
while (i < externo) {
    int j = 0;
    while (j < interno) {
        // Processa [i][j]
        j++;
    }
    i++;
}
```

**Exemplo: Validação aninhada**:
```java
Scanner sc = new Scanner(System.in);
int linhas = 0;

while (linhas < 3) {
    System.out.println("Linha " + linhas + ":");
    
    int colunas = 0;
    while (colunas < 2) {
        System.out.print("  Coluna " + colunas + ": ");
        int valor = sc.nextInt();
        System.out.println("    Você digitou: " + valor);
        colunas++;
    }
    
    linhas++;
}
```

### 5. for-each Aninhado

**Arrays bidimensionais**:
```java
int[][] matriz = {{1,2,3}, {4,5,6}, {7,8,9}};

for (int[] linha : matriz) {
    for (int elemento : linha) {
        System.out.print(elemento + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3 
// 4 5 6 
// 7 8 9
```

**Listas de listas**:
```java
List<List<String>> turmas = Arrays.asList(
    Arrays.asList("Ana", "Bruno"),
    Arrays.asList("Carlos", "Diana", "Eduardo"),
    Arrays.asList("Fernanda")
);

for (List<String> turma : turmas) {
    for (String aluno : turma) {
        System.out.println("- " + aluno);
    }
}
```

### 6. Loops Misturados

**for externo, while interno**:
```java
for (int i = 0; i < 3; i++) {
    int j = 0;
    while (j < matriz[i].length) {
        System.out.print(matriz[i][j] + " ");
        j++;
    }
    System.out.println();
}
```

**while externo, for interno**:
```java
Scanner sc = new Scanner(System.in);
String linha;

while ((linha = sc.nextLine()) != null && !linha.isEmpty()) {
    for (int i = 0; i < linha.length(); i++) {
        System.out.print(linha.charAt(i) + " ");
    }
    System.out.println();
}
```

### 7. Loops Aninhados de 3+ Níveis

**Estrutura 3D**:
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

// Saída: AAA, AAB, AAC, ABA, ..., CCC (27 combinações)
```

### 8. Combinações e Permutações

**Todas as combinações (pares)**:
```java
int[] arr1 = {1, 2, 3};
int[] arr2 = {10, 20};

for (int i = 0; i < arr1.length; i++) {
    for (int j = 0; j < arr2.length; j++) {
        System.out.println("(" + arr1[i] + ", " + arr2[j] + ")");
    }
}

// Saída: (1,10), (1,20), (2,10), (2,20), (3,10), (3,20)
```

**Pares únicos (sem duplicatas)**:
```java
int[] arr = {1, 2, 3, 4};

// j começa de i+1 para evitar duplicatas
for (int i = 0; i < arr.length; i++) {
    for (int j = i + 1; j < arr.length; j++) {
        System.out.println("(" + arr[i] + ", " + arr[j] + ")");
    }
}

// Saída: (1,2), (1,3), (1,4), (2,3), (2,4), (3,4)
```

**Todas as permutações (ordem importa)**:
```java
// Para array pequeno: força bruta
char[] letras = {'A', 'B', 'C'};

for (int i = 0; i < letras.length; i++) {
    for (int j = 0; j < letras.length; j++) {
        if (i != j) {  // Evita usar mesma posição
            for (int k = 0; k < letras.length; k++) {
                if (k != i && k != j) {
                    System.out.println("" + letras[i] + letras[j] + letras[k]);
                }
            }
        }
    }
}

// Saída: ABC, ACB, BAC, BCA, CAB, CBA (6 permutações)
```

### 9. break e continue em Loops Aninhados

**break**: Sai apenas do loop **mais interno**
```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            break;  // Sai apenas do loop j
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

### 10. Complexidade de Tempo

**O(n²)** - 2 loops:
```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // n × n = n² operações
    }
}
```

**O(n³)** - 3 loops:
```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        for (int k = 0; k < n; k++) {
            // n × n × n = n³ operações
        }
    }
}
```

**O(n × m)** - Tamanhos diferentes:
```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        // n × m operações
    }
}
```

**Otimização: Triangular**:
```java
// O(n²) completo
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // n² operações
    }
}

// O(n²/2) triangular
for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {  // j começa de i
        // ~n²/2 operações
    }
}
```

---

## 🎯 Aplicabilidade e Contextos

### Cenário 1: Tabela de Multiplicação

```java
for (int i = 1; i <= 10; i++) {
    for (int j = 1; j <= 10; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}
```

### Cenário 2: Jogo da Velha

```java
char[][] tabuleiro = {
    {'X', 'O', 'X'},
    {'O', 'X', 'O'},
    {'X', 'O', 'X'}
};

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        System.out.print(tabuleiro[i][j]);
        if (j < 2) System.out.print(" | ");
    }
    System.out.println();
    if (i < 2) System.out.println("---------");
}

// Saída:
// X | O | X
// ---------
// O | X | O
// ---------
// X | O | X
```

### Cenário 3: Média de Notas (Alunos × Provas)

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

---

## ⚠️ Armadilhas Comuns

### 1. **Confundir Ordem de Índices**

```java
// ❌ i para colunas, j para linhas (confuso)
for (int i = 0; i < colunas; i++) {
    for (int j = 0; j < linhas; j++) {
        matriz[j][i] = valor;  // Invertido
    }
}

// ✅ i para linhas, j para colunas (padrão)
for (int i = 0; i < linhas; i++) {
    for (int j = 0; j < colunas; j++) {
        matriz[i][j] = valor;
    }
}
```

### 2. **Complexidade Explosiva**

```java
// ❌ n=100 → 1.000.000 iterações
// n=1000 → 1.000.000.000 iterações
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        // Muito lento para n grande
    }
}
```

### 3. **break Sem Label**

```java
// ❌ break sai apenas do loop interno
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (encontrado) {
            break;  // Sai só do j, i continua
        }
    }
}

// ✅ Label para sair de ambos
externo:
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (encontrado) {
            break externo;  // Sai de ambos
        }
    }
}
```

---

## 🚀 Boas Práticas

### 1. ✅ Nomes Descritivos

```java
// ✅ Claro
for (int linha = 0; linha < matriz.length; linha++) {
    for (int coluna = 0; coluna < matriz[linha].length; coluna++) {
        processar(matriz[linha][coluna]);
    }
}
```

### 2. ✅ Limite Profundidade (Máximo 3)

```java
// ❌ 4+ níveis: difícil manter
for (...) {
    for (...) {
        for (...) {
            for (...) {
                // Muito profundo!
            }
        }
    }
}

// ✅ Extraia para método
for (int i = 0; i < n; i++) {
    processarLinha(i);  // Encapsula loops internos
}
```

### 3. ✅ Use Labels para Clareza

```java
// ✅ Label documenta intenção
busca:
for (int i = 0; i < matriz.length; i++) {
    for (int j = 0; j < matriz[i].length; j++) {
        if (encontrado) break busca;
    }
}
```

---

## 📚 Resumo

**Loops aninhados** colocam loops **dentro de outros**, multiplicando iterações. **Loop interno** executa **completamente** a cada iteração do externo. **Total iterações**: `externo × interno` (O(n²) para 2 níveis). **Tipos**: for/for (mais comum), for/while, while/for, while/while, for-each/for-each. **Usos**: Matrizes 2D/3D, padrões geométricos, combinações, tabelas. **break**: Sai do loop **mais interno** (use **label** para sair de externo). **continue**: Pula para próxima iteração do **mais interno**. **Complexidade**: O(n²) para 2 níveis, O(n³) para 3, cresce exponencialmente. **Boas práticas**: Nomes descritivos (linha/coluna), limite profundidade (máximo 3 níveis), use labels, extraia métodos para +3 níveis, otimize quando possível (triangular em vez de quadrado completo).
