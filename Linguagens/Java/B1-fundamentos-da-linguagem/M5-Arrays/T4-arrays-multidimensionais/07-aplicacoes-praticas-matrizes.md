# Aplicações Práticas de Matrizes

## 🎯 Introdução e Definição

### Matrizes no Mundo Real

**Matrizes** (arrays 2D) são estruturas fundamentais para representar **dados bidimensionais** em programação. Sua aplicabilidade se estende desde jogos e gráficos até análise de dados, algoritmos matemáticos e simulações. A capacidade de organizar informações em linhas e colunas espelha naturalmente muitos problemas do mundo real.

---

## 🧠 Aplicações Detalhadas

### 1. Jogo da Velha (Tic-Tac-Toe)

**Tabuleiro 3×3** - cada célula armazena estado do jogo.

```java
public class JogoDaVelha {
    private char[][] tabuleiro = new char[3][3];
    
    public JogoDaVelha() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                tabuleiro[i][j] = '-';
            }
        }
    }
    
    public boolean jogar(int linha, int coluna, char jogador) {
        if (tabuleiro[linha][coluna] == '-') {
            tabuleiro[linha][coluna] = jogador;  // 'X' ou 'O'
            return true;
        }
        return false;
    }
    
    public boolean verificarVitoria(char jogador) {
        // Linhas
        for (int i = 0; i < 3; i++) {
            if (tabuleiro[i][0] == jogador && 
                tabuleiro[i][1] == jogador && 
                tabuleiro[i][2] == jogador) return true;
        }
        // Colunas e diagonais...
        return false;
    }
}
```

### 2. Planilha Eletrônica

**Simulação Excel/Sheets** - células com dados.

```java
public class Planilha {
    private double[][] dados;
    
    public Planilha(int linhas, int colunas) {
        dados = new double[linhas][colunas];
    }
    
    public double somaLinha(int linha) {
        double soma = 0;
        for (int j = 0; j < dados[linha].length; j++) {
            soma += dados[linha][j];
        }
        return soma;
    }
    
    public double somaColuna(int coluna) {
        double soma = 0;
        for (int i = 0; i < dados.length; i++) {
            soma += dados[i][coluna];
        }
        return soma;
    }
}
```

### 3. Processamento de Imagens

**Matriz de pixels** - cor/intensidade.

```java
public class ImagemProcessador {
    private int[][] pixels;  // 0-255
    
    public void inverter() {
        for (int i = 0; i < pixels.length; i++) {
            for (int j = 0; j < pixels[i].length; j++) {
                pixels[i][j] = 255 - pixels[i][j];
            }
        }
    }
    
    public void blur() {
        int[][] resultado = new int[pixels.length][pixels[0].length];
        for (int i = 1; i < pixels.length - 1; i++) {
            for (int j = 1; j < pixels[i].length - 1; j++) {
                int soma = 0;
                for (int di = -1; di <= 1; di++) {
                    for (int dj = -1; dj <= 1; dj++) {
                        soma += pixels[i+di][j+dj];
                    }
                }
                resultado[i][j] = soma / 9;  // Média 3x3
            }
        }
        pixels = resultado;
    }
}
```

### 4. Multiplicação de Matrizes

**Operação matemática** - produto de matrizes.

```java
public static int[][] multiplicarMatrizes(int[][] A, int[][] B) {
    int m = A.length;
    int n = B[0].length;
    int p = A[0].length;
    int[][] resultado = new int[m][n];
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < p; k++) {
                resultado[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return resultado;
}

// A(2x3) × B(3x2) = C(2x2)
int[][] A = {{1,2,3}, {4,5,6}};
int[][] B = {{7,8}, {9,10}, {11,12}};
int[][] C = multiplicarMatrizes(A, B);
```

### 5. Labirinto e Pathfinding

**Mapa de navegação** - paredes e caminhos.

```java
public class Labirinto {
    private int[][] mapa;  // 0=caminho, 1=parede
    
    public boolean temCaminho(int i0, int j0, int iF, int jF) {
        boolean[][] visitado = new boolean[mapa.length][mapa[0].length];
        return dfs(i0, j0, iF, jF, visitado);
    }
    
    private boolean dfs(int i, int j, int fI, int fJ, boolean[][] vis) {
        if (i == fI && j == fJ) return true;
        if (i < 0 || i >= mapa.length || j < 0 || j >= mapa[0].length) return false;
        if (mapa[i][j] == 1 || vis[i][j]) return false;
        vis[i][j] = true;
        return dfs(i+1,j,fI,fJ,vis) || dfs(i-1,j,fI,fJ,vis) ||
               dfs(i,j+1,fI,fJ,vis) || dfs(i,j-1,fI,fJ,vis);
    }
}
```

### 6. Agenda/Calendário

**Horários estruturados** - dias × horas.

```java
public class Agenda {
    private String[][] compromissos = new String[7][24];  // 7 dias, 24h
    
    public void agendarCompromisso(int dia, int hora, String descricao) {
        if (compromissos[dia][hora] == null) {
            compromissos[dia][hora] = descricao;
        } else {
            System.out.println("Horário ocupado!");
        }
    }
}
```

### 7. Matriz de Distâncias (Grafos)

**Distância entre pontos** - mapas, redes.

```java
public class MatrizDistancias {
    private int[][] distancias;
    
    public void setDistancia(int origem, int destino, int km) {
        distancias[origem][destino] = km;
        distancias[destino][origem] = km;  // Simétrica
    }
    
    public int menorDistancia(int origem) {
        int menor = Integer.MAX_VALUE;
        for (int j = 0; j < distancias[origem].length; j++) {
            if (j != origem && distancias[origem][j] < menor) {
                menor = distancias[origem][j];
            }
        }
        return menor;
    }
}
```

---

## 🎯 Benefícios de Matrizes

1. **Representação natural**: Dados 2D mapeiam diretamente
2. **Acesso O(1)**: Índice direto, extremamente rápido
3. **Operações matemáticas**: Álgebra linear implementável
4. **Visualização intuitiva**: Fácil entender e debugar
5. **Cache-friendly**: Dados contíguos em memória

---

## ⚠️ Considerações

1. **Tamanho fixo**: Não redimensiona após criar
2. **Consumo memória**: n×m elementos sempre alocados
3. **Matrizes esparsas**: Desperdício se maioria zero/null
4. **Complexidade**: 3D+ dificulta manutenção

---

## ✅ Boas Práticas

1. **Use para dados 2D**: Tabuleiros, imagens, tabelas
2. **Estruturas alternativas**: Esparsos → HashMap
3. **Documente dimensões**: Significado linhas/colunas
4. **Valide limites**: Sempre verificar índices
5. **Constantes tamanhos**: `final int LINHAS = 8;`
6. **Métodos auxiliares**: Encapsule operações complexas
7. **Nomes significativos**: `tabuleiro[lin][col]` vs `arr[i][j]`

---

## 📚 Resumo Executivo

**Matrizes**: versatilidade em **jogos** (tic-tac-toe, xadrez), **imagens** (pixels, filtros), **planilhas**, **algoritmos** (multiplicação, pathfinding), **agendas**, **grafos** (distâncias). Representação natural dados 2D com acesso O(1). Limitações: tamanho fixo, consumo memória. Use quando dados naturalmente bidimensionais e densos.
