# System.arraycopy() - Cópia de Arrays

## 🎯 Introdução e Definição

**`System.arraycopy()`** é um método **nativo** (implementado em C/C++) que copia elementos de um array para outro de forma **extremamente eficiente**, sendo o método mais rápido para copiar grandes volumes de dados entre arrays.

**Conceito central**: copia **região específica** de um array origem para posição específica de um array destino, com alta performance.

**Sintaxe fundamental**:
```java
System.arraycopy(origem, posOrigem, destino, posDestino, comprimento);
```

**Exemplo básico**:
```java
int[] origem = {1, 2, 3, 4, 5};
int[] destino = new int[5];

System.arraycopy(origem, 0, destino, 0, 5);
// destino = [1, 2, 3, 4, 5]
```

**Retorno**: `void` - modifica array destino diretamente.

**Vantagem**: implementação **nativa** otimizada pelo JVM para máxima velocidade.

## 📋 Fundamentos Teóricos

### 1️⃣ Parâmetros do Método

**Assinatura completa**:
```java
public static void arraycopy(Object src, int srcPos,
                             Object dest, int destPos,
                             int length)
```

**Parâmetros**:
- `src`: array **origem** (de onde copiar)
- `srcPos`: **posição inicial** no array origem
- `dest`: array **destino** (para onde copiar)
- `destPos`: **posição inicial** no array destino
- `length`: **quantidade** de elementos a copiar

**Exemplo detalhado**:
```java
int[] origem = {10, 20, 30, 40, 50};
int[] destino = new int[10];

System.arraycopy(origem, 1, destino, 3, 3);
//                       ↑           ↑    ↑
//                  começa em 1  posição 3  copia 3 elementos

// destino = [0, 0, 0, 20, 30, 40, 0, 0, 0, 0]
//                     ↑   ↑   ↑
//              origem[1..3] copiado para destino[3..5]
```

### 2️⃣ Cópia Completa de Array

**Copiar array inteiro**:
```java
int[] original = {1, 2, 3, 4, 5};
int[] copia = new int[original.length];

System.arraycopy(original, 0, copia, 0, original.length);
// copia = [1, 2, 3, 4, 5]

// Arrays independentes
copia[0] = 999;
System.out.println(original[0]);  // 1 (inalterado)
```

**Equivalente a**:
```java
int[] copia = original.clone();
// Ou
int[] copia = Arrays.copyOf(original, original.length);
```

**Diferença**: `arraycopy()` permite especificar destino e posições.

### 3️⃣ Cópia Parcial - Subarray

**Copiar apenas parte do array**:
```java
int[] origem = {10, 20, 30, 40, 50, 60, 70};
int[] destino = new int[3];

// Copiar 3 elementos começando do índice 2
System.arraycopy(origem, 2, destino, 0, 3);
// destino = [30, 40, 50]
```

**Copiar para meio do array destino**:
```java
int[] origem = {1, 2, 3};
int[] destino = new int[10];

System.arraycopy(origem, 0, destino, 3, 3);
// destino = [0, 0, 0, 1, 2, 3, 0, 0, 0, 0]
//                     ↑  ↑  ↑
```

### 4️⃣ Redimensionamento de Arrays

**Expandir array** (manter conteúdo):
```java
int[] arr = {1, 2, 3};

// Criar novo array maior
int[] maior = new int[10];
System.arraycopy(arr, 0, maior, 0, arr.length);
// maior = [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]

arr = maior;  // Substituir referência
```

**Reduzir array** (descartar elementos):
```java
int[] arr = {1, 2, 3, 4, 5};

int[] menor = new int[3];
System.arraycopy(arr, 0, menor, 0, 3);
// menor = [1, 2, 3]
```

### 5️⃣ Cópia no Mesmo Array - Shift de Elementos

**Mover elementos para direita**:
```java
int[] arr = {1, 2, 3, 4, 5, 0, 0};

// Mover elementos [1..5] para [3..7]
System.arraycopy(arr, 0, arr, 2, 5);
// arr = [1, 2, 1, 2, 3, 4, 5]
//             ↑  ↑  ↑  ↑  ↑
//          elementos copiados
```

**Mover elementos para esquerda**:
```java
int[] arr = {1, 2, 3, 4, 5};

// Mover [2..5] para [0..3]
System.arraycopy(arr, 2, arr, 0, 3);
// arr = [3, 4, 5, 4, 5]
//        ↑  ↑  ↑
```

**Uso prático - remover elemento**:
```java
int[] arr = {10, 20, 30, 40, 50};
int indexRemover = 2;  // Remover 30

// Shift elementos à direita para esquerda
System.arraycopy(arr, indexRemover + 1, arr, indexRemover, 
                 arr.length - indexRemover - 1);
// arr = [10, 20, 40, 50, 50]
//                ↑   ↑
arr[arr.length - 1] = 0;  // Limpar último
// arr = [10, 20, 40, 50, 0]
```

### 6️⃣ Tipos Suportados - Primitivos e Objetos

**Arrays primitivos**:
```java
int[] ints = {1, 2, 3};
int[] copia = new int[3];
System.arraycopy(ints, 0, copia, 0, 3);

double[] doubles = {1.5, 2.5, 3.5};
double[] copiaD = new double[3];
System.arraycopy(doubles, 0, copiaD, 0, 3);

// Todos os 8 tipos primitivos suportados
```

**Arrays de objetos** (cópia superficial):
```java
String[] nomes = {"Ana", "Bob", "Carlos"};
String[] copia = new String[3];

System.arraycopy(nomes, 0, copia, 0, 3);
// copia = ["Ana", "Bob", "Carlos"]

// Referências copiadas (mesmos objetos String)
System.out.println(nomes[0] == copia[0]);  // true
```

**Arrays multidimensionais**:
```java
int[][] matriz = {{1, 2}, {3, 4}, {5, 6}};
int[][] copia = new int[3][];

System.arraycopy(matriz, 0, copia, 0, 3);
// Copia referências das linhas (superficial)
```

### 7️⃣ Validação e Exceções

**ArrayIndexOutOfBoundsException** - índices inválidos:
```java
int[] arr = {1, 2, 3, 4, 5};

// srcPos + length > origem.length
System.arraycopy(arr, 3, new int[5], 0, 5);  // ❌ Exceção

// destPos + length > destino.length
System.arraycopy(arr, 0, new int[3], 0, 5);  // ❌ Exceção

// Posições negativas
System.arraycopy(arr, -1, new int[5], 0, 3);  // ❌ Exceção
```

**ArrayStoreException** - tipos incompatíveis:
```java
String[] strings = {"A", "B"};
Integer[] ints = new Integer[2];

System.arraycopy(strings, 0, ints, 0, 2);  // ❌ Tipos incompatíveis
```

**NullPointerException** - arrays null:
```java
int[] arr = null;
System.arraycopy(arr, 0, new int[5], 0, 3);  // ❌ NullPointerException
```

**Validação segura**:
```java
if (origem != null && destino != null &&
    srcPos >= 0 && destPos >= 0 && length >= 0 &&
    srcPos + length <= origem.length &&
    destPos + length <= destino.length) {
    
    System.arraycopy(origem, srcPos, destino, destPos, length);
}
```

### 8️⃣ Performance - Método Nativo

**Implementação nativa** (C/C++) = **extremamente rápido**:

```java
int[] origem = new int[1_000_000];
int[] destino = new int[1_000_000];

// System.arraycopy - MAIS RÁPIDO (~1-2ms)
long inicio = System.nanoTime();
System.arraycopy(origem, 0, destino, 0, origem.length);
long fim = System.nanoTime();
System.out.println("arraycopy: " + (fim - inicio) / 1_000_000 + "ms");

// Loop manual - MAIS LENTO (~5-10ms)
inicio = System.nanoTime();
for (int i = 0; i < origem.length; i++) {
    destino[i] = origem[i];
}
fim = System.nanoTime();
System.out.println("Loop: " + (fim - inicio) / 1_000_000 + "ms");
```

**Otimizações**:
- Usa instruções de CPU específicas (SIMD)
- Evita overhead de bytecode do loop
- JVM pode aplicar otimizações adicionais

### 9️⃣ vs Arrays.copyOf() e clone()

**Comparação**:

| Método | Flexibilidade | Performance | Uso |
|--------|--------------|-------------|-----|
| `System.arraycopy()` | ✓ Alta (offset origem/destino) | ✓✓✓ Máxima | Cópia parcial, redimensionamento |
| `Arrays.copyOf()` | Média (apenas tamanho) | ✓✓ Alta | Cópia completa/redimensionamento |
| `clone()` | Baixa (apenas completo) | ✓✓ Alta | Cópia completa simples |

**System.arraycopy()**:
```java
int[] arr = {1, 2, 3, 4, 5};
int[] dest = new int[10];

// Copiar do índice 1 para posição 3
System.arraycopy(arr, 1, dest, 3, 3);
// dest = [0, 0, 0, 2, 3, 4, 0, 0, 0, 0]
```

**Arrays.copyOf()**:
```java
// Sempre copia do início, cria novo array
int[] copia = Arrays.copyOf(arr, 3);
// [1, 2, 3]
```

**clone()**:
```java
// Sempre copia completo
int[] copia = arr.clone();
// [1, 2, 3, 4, 5]
```

### 🔟 Overlapping - Cópia com Sobreposição

**Cópia segura mesmo com sobreposição**:

```java
int[] arr = {1, 2, 3, 4, 5};

// Copiar [0..2] para [2..4] (sobreposição!)
System.arraycopy(arr, 0, arr, 2, 3);
// arr = [1, 2, 1, 2, 3]
//             ↑  ↑  ↑
```

**JVM garante comportamento correto**:
- Copia **antes** de sobrescrever
- Usa buffer temporário se necessário

**Exemplo complexo**:
```java
int[] arr = {1, 2, 3, 4, 5, 6, 7};

// Mover tudo 2 posições para direita
System.arraycopy(arr, 0, arr, 2, 5);
// arr = [1, 2, 1, 2, 3, 4, 5]
```

## 🎯 Aplicabilidade

**1. Implementar ArrayList**:
```java
class MinhaLista {
    private int[] elementos;
    private int tamanho;
    
    public void adicionar(int valor) {
        if (tamanho == elementos.length) {
            // Expandir array
            int[] novo = new int[elementos.length * 2];
            System.arraycopy(elementos, 0, novo, 0, tamanho);
            elementos = novo;
        }
        elementos[tamanho++] = valor;
    }
}
```

**2. Remover Elemento**:
```java
public void remover(int index) {
    System.arraycopy(arr, index + 1, arr, index, 
                     tamanho - index - 1);
    tamanho--;
}
```

**3. Inserir Elemento**:
```java
public void inserir(int index, int valor) {
    // Mover elementos para direita
    System.arraycopy(arr, index, arr, index + 1, tamanho - index);
    arr[index] = valor;
    tamanho++;
}
```

**4. Concatenar Arrays**:
```java
int[] a = {1, 2, 3};
int[] b = {4, 5, 6};
int[] concatenado = new int[a.length + b.length];

System.arraycopy(a, 0, concatenado, 0, a.length);
System.arraycopy(b, 0, concatenado, a.length, b.length);
// [1, 2, 3, 4, 5, 6]
```

**5. Copiar Parte de Matriz**:
```java
int[][] matriz = new int[100][100];
int[] linha = new int[50];

// Copiar primeiros 50 elementos da linha 10
System.arraycopy(matriz[10], 0, linha, 0, 50);
```

## ⚠️ Armadilhas Comuns

**1. Esquecer de Criar Array Destino**:
```java
int[] origem = {1, 2, 3};
int[] destino;  // null!

System.arraycopy(origem, 0, destino, 0, 3);  // ❌ NullPointerException
```

**2. Índices Incorretos**:
```java
int[] arr = {1, 2, 3, 4, 5};

// Tentar copiar 5 elementos começando do índice 2
System.arraycopy(arr, 2, new int[5], 0, 5);  // ❌ Só há 3 elementos
```

**3. Tipos Incompatíveis**:
```java
String[] strings = {"A"};
Integer[] ints = new Integer[1];

System.arraycopy(strings, 0, ints, 0, 1);  // ❌ ArrayStoreException
```

**4. Confundir Ordem dos Parâmetros**:
```java
// ❌ Ordem errada
System.arraycopy(destino, 0, origem, 0, 5);  // Invertido!

// ✓ Correto
System.arraycopy(origem, 0, destino, 0, 5);
```

**5. Assumir Cópia Profunda**:
```java
Pessoa[] origem = {new Pessoa("Ana")};
Pessoa[] copia = new Pessoa[1];

System.arraycopy(origem, 0, copia, 0, 1);
// ⚠️ Cópia superficial - mesmo objeto Pessoa
```

## ✅ Boas Práticas

**1. Valide Parâmetros Antes de Copiar**:
```java
if (srcPos + length <= origem.length &&
    destPos + length <= destino.length) {
    System.arraycopy(origem, srcPos, destino, destPos, length);
}
```

**2. Use para Grandes Volumes de Dados**:
```java
// Para arrays grandes, arraycopy é mais rápido
if (arr.length > 1000) {
    System.arraycopy(origem, 0, destino, 0, length);
}
```

**3. Documente Parâmetros**:
```java
/**
 * Copia elementos do array origem para destino
 * @param src array origem
 * @param srcPos posição inicial em src
 * @param dest array destino
 * @param destPos posição inicial em dest
 * @param length quantidade de elementos
 */
```

**4. Encapsule em Métodos Utilitários**:
```java
public static int[] copiarArray(int[] arr) {
    int[] copia = new int[arr.length];
    System.arraycopy(arr, 0, copia, 0, arr.length);
    return copia;
}
```

**5. Prefira arraycopy() para Operações Complexas**:
```java
// Copiar parte do meio de um array
System.arraycopy(arr, 10, dest, 5, 20);  // Flexível

// Arrays.copyOf não permite offset
```

**6. Use try-catch para Robustez**:
```java
try {
    System.arraycopy(origem, srcPos, destino, destPos, length);
} catch (ArrayIndexOutOfBoundsException | ArrayStoreException e) {
    System.err.println("Erro ao copiar: " + e.getMessage());
}
```

## 📚 Resumo Executivo

`System.arraycopy()` copia elementos de array origem para destino com **alta performance**.

**Sintaxe**:
```java
System.arraycopy(origem, posOrigem, destino, posDestino, quantidade);
```

**Parâmetros**:
- `origem`: array fonte
- `posOrigem`: índice inicial em origem
- `destino`: array alvo
- `posDestino`: índice inicial em destino
- `quantidade`: número de elementos

**Exemplo completo**:
```java
int[] origem = {10, 20, 30, 40, 50};
int[] destino = new int[10];

System.arraycopy(origem, 1, destino, 3, 3);
// destino = [0, 0, 0, 20, 30, 40, 0, 0, 0, 0]
//                     ↑   ↑   ↑
//              origem[1..3]
```

**Características**:
- **Método nativo**: implementado em C/C++
- **Máxima performance**: mais rápido que loops manuais
- **Flexível**: permite especificar posições e quantidade
- **Cópia superficial**: para objetos, copia referências
- **Seguro**: funciona com sobreposição

**Exceções**:
- `ArrayIndexOutOfBoundsException`: índices inválidos
- `ArrayStoreException`: tipos incompatíveis
- `NullPointerException`: arrays null

**vs outros métodos**:
- Mais **flexível** que `clone()` e `Arrays.copyOf()`
- Mais **rápido** para grandes volumes
- Permite cópia parcial e **offset**

**Importar**: Não precisa - classe `System` (java.lang)
