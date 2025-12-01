# Iteração em Arrays Multidimensionais

## 🎯 Introdução e Definição

### Conceito de Iteração Multidimensional

**Iterar** arrays multidimensionais significa **percorrer todos os elementos** através de **loops aninhados** - um nível de loop para cada dimensão do array. A estrutura aninhada dos arrays (arrays de arrays) exige estruturas de controle igualmente aninhadas para acessar cada elemento individual.

```java
int[][] matriz = {{1,2,3}, {4,5,6}};

// Loop externo: percorre linhas
for (int i = 0; i < matriz.length; i++) {
    // Loop interno: percorre colunas de cada linha
    for (int j = 0; j < matriz[i].length; j++) {
        System.out.print(matriz[i][j] + " ");  // Acesso: matriz[linha][coluna]
    }
}
// Saída: 1 2 3 4 5 6
```

---

## 🧠 Fundamentos Teóricos

### 1. For Tradicional Aninhado - Controle Total

**Sintaxe**: Loops aninhados com contadores de índice.

```java
int[][] mat = new int[3][4];  // 3 linhas, 4 colunas

// Preencher matriz com produto dos índices
for (int i = 0; i < mat.length; i++) {         // i: 0, 1, 2 (linhas)
    for (int j = 0; j < mat[i].length; j++) {   // j: 0, 1, 2, 3 (colunas)
        mat[i][j] = i * j;
    }
}

// Resultado:
// [0, 0, 0, 0]
// [0, 1, 2, 3]
// [0, 2, 4, 6]
```

**Vantagens**: Acesso aos índices (i, j), permite modificação, controle preciso.

### 2. For-Each Aninhado - Simplicidade

**Sintaxe**: Percorrer elementos sem índices explícitos.

```java
int[][] mat = {{1,2,3}, {4,5,6}};

// For-each: mais legível para leitura
for (int[] linha : mat) {           // Cada "linha" é um array int[]
    for (int elemento : linha) {    // Cada "elemento" é um int
        System.out.print(elemento + " ");
    }
    System.out.println();
}

// Saída:
// 1 2 3
// 4 5 6
```

**Vantagens**: Código limpo, sem gerenciar índices, menos propenso a erros.
**Limitações**: Não tem acesso aos índices (i, j), dificulta modificações.

### 3. Quando Usar Cada Tipo

**For tradicional** - Use quando:
- Precisa saber posição (índices i, j)
- Vai modificar elementos baseado em posição
- Precisa comparar com elementos adjacentes
- Processamento de padrões específicos (diagonais, bordas)

**For-each** - Use quando:
- Apenas ler/imprimir valores
- Não precisa saber índices
- Código mais limpo e legível
- Processamento uniforme de todos elementos

```java
// FOR TRADICIONAL: modificar baseado em posição
for (int i = 0; i < mat.length; i++) {
    for (int j = 0; j < mat[i].length; j++) {
        if (i == j) mat[i][j] = 1;  // Diagonal principal
    }
}

// FOR-EACH: apenas calcular soma
int soma = 0;
for (int[] linha : mat) {
    for (int val : linha) {
        soma += val;
    }
}
```

### 4. Iteração em Arrays 3D - Loops Triplos

```java
int[][][] cubo = new int[2][3][4];  // 2 camadas, 3 linhas, 4 colunas

// For tradicional triplo
for (int i = 0; i < cubo.length; i++) {              // Camadas
    for (int j = 0; j < cubo[i].length; j++) {        // Linhas
        for (int k = 0; k < cubo[i][j].length; k++) {  // Colunas
            cubo[i][j][k] = i + j + k;
        }
    }
}

// For-each triplo
for (int[][] camada : cubo) {
    for (int[] linha : camada) {
        for (int elemento : linha) {
            System.out.print(elemento + " ");
        }
    }
}
```

### 5. Impressão Formatada de Matrizes

```java
int[][] mat = {{1,2,3}, {10,20,30}, {100,200,300}};

// Formatação com printf
for (int i = 0; i < mat.length; i++) {
    for (int j = 0; j < mat[i].length; j++) {
        System.out.printf("%5d", mat[i][j]);  // 5 caracteres de largura
    }
    System.out.println();
}

// Saída alinhada:
//     1    2    3
//    10   20   30
//   100  200  300
```

### 6. Padrões Especiais de Iteração

**Diagonal principal**:
```java
for (int i = 0; i < mat.length; i++) {
    mat[i][i] = 1;  // Elementos onde linha == coluna
}
```

**Diagonal secundária**:
```java
int n = mat.length;
for (int i = 0; i < n; i++) {
    mat[i][n-1-i] = 1;
}
```

**Triângulo superior**:
```java
for (int i = 0; i < mat.length; i++) {
    for (int j = i; j < mat[i].length; j++) {  // j começa em i
        mat[i][j] = 1;
    }
}
```

**Bordas da matriz**:
```java
for (int i = 0; i < mat.length; i++) {
    for (int j = 0; j < mat[i].length; j++) {
        if (i == 0 || i == mat.length-1 || j == 0 || j == mat[i].length-1) {
            mat[i][j] = 1;  // Borda
        }
    }
}
```

### 7. Arrays Irregulares - Tamanhos Dinâmicos

```java
int[][] jagged = {{1,2}, {3,4,5}, {6}};

// ESSENCIAL: usar mat[i].length (não constante!)
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

### 8. Operações Comuns com Iteração

**Soma de todos os elementos**:
```java
int soma = 0;
for (int[] linha : mat) {
    for (int val : linha) {
        soma += val;
    }
}
```

**Encontrar máximo**:
```java
int max = mat[0][0];
for (int[] linha : mat) {
    for (int val : linha) {
        if (val > max) max = val;
    }
}
```

**Contar elementos que satisfazem condição**:
```java
int pares = 0;
for (int[] linha : mat) {
    for (int val : linha) {
        if (val % 2 == 0) pares++;
    }
}
```

**Copiar matriz**:
```java
int[][] copia = new int[mat.length][];
for (int i = 0; i < mat.length; i++) {
    copia[i] = Arrays.copyOf(mat[i], mat[i].length);
}
```

### 9. Iteração Row-Major vs Column-Major

**Row-major** (percorrer linha por linha - padrão Java):
```java
for (int i = 0; i < mat.length; i++) {         // Linhas (externo)
    for (int j = 0; j < mat[i].length; j++) {   // Colunas (interno)
        process(mat[i][j]);
    }
}
```

**Column-major** (percorrer coluna por coluna):
```java
for (int j = 0; j < mat[0].length; j++) {      // Colunas (externo)
    for (int i = 0; i < mat.length; i++) {      // Linhas (interno)
        process(mat[i][j]);
    }
}
```

**Performance**: Row-major é mais eficiente em Java devido à localidade de cache.

### 10. Combinar For Tradicional e For-Each

```java
// Índice de linha, mas for-each para colunas
for (int i = 0; i < mat.length; i++) {
    System.out.print("Linha " + i + ": ");
    for (int val : mat[i]) {
        System.out.print(val + " ");
    }
    System.out.println();
}
```

---

## 🎯 Aplicabilidade

1. **Processar todos elementos**: Aplicar transformação, validação
2. **Cálculos estatísticos**: Soma, média, máximo, mínimo
3. **Busca**: Encontrar valores ou padrões específicos
4. **Impressão**: Exibir matriz formatada
5. **Transformações**: Transpor, rotacionar, espelhar
6. **Validações**: Verificar propriedades (simetria, etc)
7. **Cópia/Clonagem**: Duplicar estruturas

---

## ⚠️ Armadilhas

1. **Tamanho fixo**: Usar `j < 4` ao invés de `j < mat[i].length` (quebra irregulares)
2. **Ordem invertida**: Confundir `mat[j][i]` com `mat[i][j]`
3. **For-each com modificação**: `elemento = 10` não modifica array
4. **Limites**: `mat.length` vs `mat[i].length` - são diferentes!
5. **Assumir matriz quadrada**: `mat.length == mat[0].length` nem sempre
6. **Performance**: Column-major é mais lento (cache miss)

---

## ✅ Boas Práticas

1. **Sempre `arr[i].length`**: Nunca use constantes para tamanhos
2. **For-each para leitura**: Mais limpo quando não precisa índices
3. **For tradicional para modificação**: Quando precisa controle total
4. **Nomes descritivos**: `linha`, `coluna` melhor que `i`, `j`
5. **Row-major**: Percorra linhas no loop externo (melhor cache)
6. **Valide limites**: Antes de acessar, especialmente em irregulares
7. **Documente padrões**: Se itera de forma não-óbvia, comente

---

## 📚 Resumo Executivo

**Iteração multidimensional**: loops aninhados (um por dimensão). **For tradicional** (`for i, j`): acesso a índices, modificação. **For-each**: leitura simples, código limpo. Arrays 3D: loops triplos. Sempre use `arr[i].length` (não constante). **Row-major** (linha externo) melhor para cache. Padrões especiais: diagonais, bordas, triângulos. Operações comuns: soma, max, busca, cópia. Irregulares: tamanho varia por linha.
