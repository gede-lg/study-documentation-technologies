# Operador de Índice []

## 🎯 Introdução e Definição

### Conceito do Operador []

O **operador de índice `[]`** (subscript operator) é o mecanismo sintático em Java para acessar elementos individuais de um array através de sua posição numérica. Conceitualmente, transforma um array (coleção de elementos) em um elemento específico, permitindo tanto **leitura** (obter valor) quanto **escrita** (modificar valor) de forma eficiente e direta.

É a interface fundamental entre o programador e a estrutura de dados - sem `[]`, arrays seriam inúteis pois não haveria forma de acessar seu conteúdo.

```java
int[] arr = {10, 20, 30};
int x = arr[1];    // LEITURA: obtém 20, array inalterado
arr[1] = 50;       // ESCRITA: modifica para 50, arr agora {10, 50, 30}
```

### Sintaxe e Semântica

**Forma Geral**: `array[expressão_índice]`

- **Leitura (rvalue)**: `tipo variavel = array[índice];`
- **Escrita (lvalue)**: `array[índice] = valor;`

O operador `[]` retorna uma **referência** ao elemento (lvalue), permitindo tanto leitura quanto modificação.

---

## 🧠 Fundamentos Teóricos

### 1. Leitura de Valores - Acesso Read-Only

```java
int[] nums = {5, 10, 15};

// Leitura com índice literal
int segundo = nums[1];  // 10

// Leitura com variável
int i = 2;
int terceiro = nums[i];  // 15

// Uso em expressões
int soma = nums[0] + nums[2];  // 5 + 15 = 20
boolean maior = nums[1] > 8;   // true
```

**Análise**: Array permanece inalterado. Valor é **copiado** (para primitivos) ou referência é copiada (para objetos).

### 2. Escrita de Valores - Modificação In-Place

```java
int[] nums = {5, 10, 15};

// Atribuição simples
nums[1] = 20;  // {5, 20, 15}

// Com expressão
nums[0] = nums[1] + nums[2];  // {35, 20, 15}

// Com método
nums[2] = Math.abs(-100);  // {35, 20, 100}
```

**Análise**: Array é **modificado diretamente**. Elemento específico recebe novo valor.

### 3. Índice como Literal vs Variável vs Expressão

```java
int[] arr = {10, 20, 30, 40, 50};

// Literal (compile-time constant)
int a = arr[0];      // Sempre primeiro elemento

// Variável (runtime value)
int i = 2;
int b = arr[i];      // arr[2] = 30

// Expressão calculada
int c = arr[i + 1];  // arr[3] = 40
int d = arr[arr.length - 1];  // Último elemento

// Condição ternária
int e = arr[i > 0 ? i : 0];  // Se i>0 usa i, senão 0
```

**Análise**: Qualquer expressão que avalie para `int` pode ser usada como índice.

### 4. Operações Compostas

```java
int[] arr = {10, 20, 30};

// Incremento/decremento
arr[0]++;       // arr[0] = 11
++arr[1];       // arr[1] = 21
arr[2]--;       // arr[2] = 29

// Operadores compostos
arr[0] += 5;    // arr[0] = arr[0] + 5  → 16
arr[1] -= 3;    // arr[1] = arr[1] - 3  → 18
arr[2] *= 2;    // arr[2] = arr[2] * 2  → 58
arr[0] /= 4;    // arr[0] = arr[0] / 4  → 4

// Operadores bit-a-bit
arr[1] &= 0xFF;  // AND
arr[2] |= 0x10;  // OR
```

**Análise**: Operadores compostos modificam elemento existente baseado em seu valor atual.

### 5. Arrays Multidimensionais - Múltiplos `[]`

```java
int[][] matriz = {{1,2,3}, {4,5,6}};

// Acesso bidimensional
int x = matriz[0][1];  // 2 (linha 0, coluna 1)
matriz[1][0] = 10;     // {1,2,3}, {10,5,6}

// Acesso a linha completa
int[] linha = matriz[0];  // {1, 2, 3}
linha[1] = 99;  // Modifica matriz! {1,99,3}, {10,5,6}

// Triplo índice (3D)
int[][][] cubo = new int[2][3][4];
cubo[1][2][3] = 42;  // Camada 1, linha 2, coluna 3
```

**Análise**: Cada `[]` acessa uma dimensão. `matriz[i][j]` = \"acessar linha i, depois coluna j\".

### 6. Encadeamento e Indireção

```java
int[] indices = {2, 0, 1};
int[] valores = {10, 20, 30};

// Usar array como índice para outro array
int x = valores[indices[0]];  // valores[2] = 30
int y = valores[indices[1]];  // valores[0] = 10

// Útil para mapeamentos e permutações
for (int i = 0; i < indices.length; i++) {
    System.out.print(valores[indices[i]] + \" \");
}
// Saída: 30 10 20
```

### 7. Validação de Índices - Acesso Seguro

```java
int[] arr = {10, 20, 30};
int i = obterIndice();  // Pode ser qualquer valor

// Validação antes de acessar
if (i >= 0 && i < arr.length) {
    int valor = arr[i];  // Seguro
} else {
    System.out.println(\"Índice inválido: \" + i);
}

// Método helper
public static boolean indiceValido(int[] arr, int i) {
    return i >= 0 && i < arr.length;
}
```

### 8. Swap de Elementos

```java
int[] arr = {10, 20, 30};

// Trocar posições 0 e 2
int temp = arr[0];
arr[0] = arr[2];
arr[2] = temp;
// Resultado: {30, 20, 10}

// Sem variável temp (XOR swap - apenas inteiros)
arr[0] ^= arr[2];
arr[2] ^= arr[0];
arr[0] ^= arr[2];
```

### 9. Copiar Entre Arrays

```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[5];

// Cópia manual elemento por elemento
for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];
}

// Ou usar System.arraycopy (mais eficiente)
System.arraycopy(origem, 0, destino, 0, origem.length);
```

### 10. Busca Linear

```java
int[] arr = {10, 20, 30, 40, 50};
int alvo = 30;

int indiceEncontrado = -1;  // -1 indica \"não encontrado\"
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == alvo) {
        indiceEncontrado = i;
        break;
    }
}

if (indiceEncontrado != -1) {
    System.out.println(\"Encontrado no índice \" + indiceEncontrado);
}
```

---

## 🎯 Aplicabilidade

1. **Acessar elementos específicos**: Obter/modificar valor em posição conhecida
2. **Percorrer arrays**: Loops com índice para processar todos elementos
3. **Swap**: Trocar elementos de posição
4. **Busca**: Procurar valores específicos
5. **Ordenação**: Algoritmos que reorganizam elementos
6. **Transformação**: Aplicar operações a elementos individuais
7. **Agregação**: Somar, calcular média, encontrar máximo/mínimo

---

## ⚠️ Armadilhas

1. **Índice fora dos limites**:
   ```java
   int[] arr = {10, 20, 30};
   int x = arr[5];  // ArrayIndexOutOfBoundsException!
   ```

2. **Índice negativo**:
   ```java
   int x = arr[-1];  // Exception! (diferente de Python)
   ```

3. **Confundir `arr[length]` com último elemento**:
   ```java
   int ultimo = arr[arr.length];  // ❌ Exception!
   int ultimo = arr[arr.length - 1];  // ✓ Correto
   ```

4. **Modificar array de objetos vs primitivos**:
   ```java
   // Primitivos - modificação local
   int[] nums = {10, 20};
   int x = nums[0];
   x = 99;  // nums[0] ainda é 10
   
   // Objetos - efeito colateral
   StringBuilder[] builders = {new StringBuilder(\"A\")};
   StringBuilder sb = builders[0];
   sb.append(\"B\");  // builders[0] agora é \"AB\"!
   ```

---

## ✅ Boas Práticas

1. **Valide índices dinâmicos**:
   ```java
   if (i >= 0 && i < arr.length) {
       // Seguro acessar arr[i]
   }
   ```

2. **Use constantes para índices fixos**:
   ```java
   final int PRIMEIRO_NOME = 0;
   final int SOBRENOME = 1;
   String nome = nomes[PRIMEIRO_NOME];
   ```

3. **Prefira for-each quando não modifica**:
   ```java
   for (int num : nums) {  // Sem riscos de índice
       System.out.println(num);
   }
   ```

4. **Nomes descritivos para variáveis de índice**:
   ```java
   for (int linha = 0; linha < matriz.length; linha++) {
       for (int col = 0; col < matriz[linha].length; col++) {
           // Mais claro que i, j
       }
   }
   ```

5. **Comente índices não óbvios**:
   ```java
   dados[3];  // Data de nascimento
   dados[7];  // Telefone
   ```

---

## 📚 Resumo Executivo

**Operador `[]`**: acessa elementos via índice. **Leitura**: `tipo var = arr[índice]`. **Escrita**: `arr[índice] = valor`. Suporta índices literais, variáveis e expressões. Operações compostas: `arr[i] += 5`, `arr[i]++`. Multidimensional: `matriz[i][j]`. **Sempre valide**: `i >= 0 && i < arr.length`. Armadilhas: índice negativo ou ≥ length causa exception. Use constantes para índices fixos, for-each quando não modifica, nomes descritivos para clareza.
