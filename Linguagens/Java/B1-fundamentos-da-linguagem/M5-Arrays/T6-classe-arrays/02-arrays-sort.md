# Arrays.sort() - Ordenação de Arrays

## 🎯 Introdução e Definição

**`Arrays.sort()`** é um método estático da classe `java.util.Arrays` que **ordena elementos de um array in-place** (no próprio array) em ordem crescente. Utiliza algoritmos de ordenação eficientes otimizados para diferentes tipos de dados.

**Conceito central**: reorganiza elementos do array em ordem **natural crescente** (números: menor→maior, strings: lexicográfica A→Z).

**Sintaxe fundamental**:
```java
Arrays.sort(array);  // Ordena array completo
Arrays.sort(array, fromIndex, toIndex);  // Ordena intervalo
```

**Exemplo básico**:
```java
int[] nums = {5, 2, 8, 1, 9};
Arrays.sort(nums);
// nums = [1, 2, 5, 8, 9]
```

**Assinaturas principais**:
```java
public static void sort(int[] a)
public static void sort(int[] a, int fromIndex, int toIndex)
public static <T> void sort(T[] a, Comparator<? super T> c)
```

`Arrays.sort()` é **essencial** para ordenação rápida e confiável de arrays.

## 📋 Fundamentos Teóricos

### 1️⃣ Ordenação In-Place - Modifica o Array Original

`sort()` **altera o array original**, não cria novo:

```java
int[] arr = {5, 2, 8, 1};
Arrays.sort(arr);

// arr foi modificado
System.out.println(Arrays.toString(arr));  // [1, 2, 5, 8]

// Se precisar do original, copie antes
int[] original = {5, 2, 8, 1};
int[] ordenado = Arrays.copyOf(original, original.length);
Arrays.sort(ordenado);
// original = [5, 2, 8, 1] (inalterado)
// ordenado = [1, 2, 5, 8]
```

**Importante**: método `void` - não retorna valor.

### 2️⃣ Tipos Primitivos - Dual-Pivot Quicksort

Para primitivos (`int`, `long`, `double`, etc.), usa **Dual-Pivot Quicksort** (Java 7+):

```java
int[] nums = {9, 3, 7, 1, 5};
Arrays.sort(nums);  // [1, 3, 5, 7, 9]

double[] valores = {3.14, 1.41, 2.71};
Arrays.sort(valores);  // [1.41, 2.71, 3.14]

char[] letras = {'d', 'a', 'c', 'b'};
Arrays.sort(letras);  // [a, b, c, d]
```

**Características**:
- **Complexidade**: O(n log n) média, O(n²) pior caso (raro)
- **In-place**: O(log n) espaço (stack recursivo)
- **Não-estável**: elementos iguais podem trocar de posição

### 3️⃣ Objetos - TimSort (Estável)

Para objetos, usa **TimSort** (híbrido merge+insertion):

```java
String[] nomes = {"Carlos", "Ana", "Bob"};
Arrays.sort(nomes);  // [Ana, Bob, Carlos] (ordem lexicográfica)

Integer[] nums = {30, 10, 20};
Arrays.sort(nums);  // [10, 20, 30]
```

**Características**:
- **Complexidade**: O(n log n) garantido
- **Estável**: preserva ordem relativa de elementos iguais
- **Otimizado**: detecta sequências já ordenadas

### 4️⃣ Ordenação Parcial - fromIndex e toIndex

Ordena **somente intervalo** especificado:

```java
int[] arr = {5, 2, 8, 1, 9, 3};
//           0  1  2  3  4  5 (índices)

Arrays.sort(arr, 1, 4);  // Ordena do índice 1 ao 3 (4 exclusivo)
// arr = [5, 1, 2, 8, 9, 3]
//        ^  -------  ^ ^  (apenas meio ordenado)
```

**Parâmetros**:
- `fromIndex`: **inclusivo** (começa aqui)
- `toIndex`: **exclusivo** (para antes daqui)

**Exemplos práticos**:
```java
int[] dados = {9, 5, 3, 7, 1, 8};

// Ordenar primeiros 3 elementos
Arrays.sort(dados, 0, 3);  // [5, 9, 3, 7, 1, 8]
                           //  -----  (índices 0-2)

// Ordenar últimos 3 elementos
Arrays.sort(dados, 3, 6);  // [5, 9, 3, 1, 7, 8]
                           //           -----  (índices 3-5)
```

### 5️⃣ Comparator - Ordenação Customizada

Para objetos, pode fornecer `Comparator` customizado:

```java
String[] nomes = {"carlos", "Ana", "BOB"};

// Ordem padrão (case-sensitive)
Arrays.sort(nomes);  // [Ana, BOB, carlos] (maiúsculas antes)

// Ordem case-insensitive
Arrays.sort(nomes, String.CASE_INSENSITIVE_ORDER);
// [Ana, BOB, carlos] (alfabética ignorando case)

// Ordem decrescente
Arrays.sort(nomes, Collections.reverseOrder());
// [carlos, BOB, Ana]
```

**Comparator lambda**:
```java
class Pessoa {
    String nome;
    int idade;
    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}

Pessoa[] pessoas = {
    new Pessoa("Ana", 25),
    new Pessoa("Bob", 30),
    new Pessoa("Carlos", 20)
};

// Ordenar por idade
Arrays.sort(pessoas, (p1, p2) -> Integer.compare(p1.idade, p2.idade));
// [Carlos(20), Ana(25), Bob(30)]

// Ordenar por nome
Arrays.sort(pessoas, Comparator.comparing(p -> p.nome));
// [Ana, Bob, Carlos]
```

### 6️⃣ Ordem Natural - Comparable

Classes podem implementar `Comparable` para ordem "natural":

```java
class Produto implements Comparable<Produto> {
    String nome;
    double preco;
    
    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    @Override
    public int compareTo(Produto outro) {
        return Double.compare(this.preco, outro.preco);
    }
}

Produto[] produtos = {
    new Produto("Mouse", 50.0),
    new Produto("Teclado", 150.0),
    new Produto("Monitor", 800.0)
};

Arrays.sort(produtos);  // Ordena por preço (compareTo)
// [Mouse(50), Teclado(150), Monitor(800)]
```

### 7️⃣ Estabilidade - TimSort vs Quicksort

**TimSort (objetos)** é **estável**:
```java
class Item {
    int valor;
    String nome;
    Item(int valor, String nome) {
        this.valor = valor;
        this.nome = nome;
    }
}

Item[] itens = {
    new Item(2, "A"),
    new Item(1, "B"),
    new Item(2, "C")  // Mesmo valor que "A"
};

Arrays.sort(itens, Comparator.comparingInt(i -> i.valor));
// [Item(1, B), Item(2, A), Item(2, C)]
//              ^^^^^^^^^^^^ ordem preservada (A antes de C)
```

**Dual-Pivot Quicksort (primitivos)** **não é estável** (não aplicável a primitivos - sem identidade).

### 8️⃣ Complexidade de Tempo e Espaço

**Primitivos (Dual-Pivot Quicksort)**:
- **Tempo**: O(n log n) médio, O(n²) pior caso
- **Espaço**: O(log n) stack recursivo
- **Melhor caso**: O(n) se já ordenado

**Objetos (TimSort)**:
- **Tempo**: O(n log n) garantido
- **Espaço**: O(n) para merge temporário
- **Melhor caso**: O(n) se parcialmente ordenado

**Exemplo de benchmark**:
```java
int[] arr = new int[1_000_000];
// Preencher array...

long inicio = System.nanoTime();
Arrays.sort(arr);
long fim = System.nanoTime();
System.out.println("Tempo: " + (fim - inicio) / 1_000_000 + "ms");
// ~50-100ms para 1 milhão de elementos
```

### 9️⃣ Arrays Multidimensionais - Ordenação de Linhas

Ordenar array 2D requer Comparator customizado:

```java
int[][] matriz = {
    {3, 5, 1},
    {2, 4, 6},
    {1, 3, 2}
};

// Ordenar linhas por primeiro elemento
Arrays.sort(matriz, Comparator.comparingInt(linha -> linha[0]));
// [[1, 3, 2], [2, 4, 6], [3, 5, 1]]

// Ordenar cada linha individualmente
for (int[] linha : matriz) {
    Arrays.sort(linha);
}
// [[1, 3, 5], [2, 4, 6], [1, 2, 3]]
```

### 🔟 Ordem Reversa - Collections.reverseOrder()

Para ordem decrescente:

```java
// Wrappers (não primitivos!)
Integer[] nums = {1, 5, 3, 9, 2};
Arrays.sort(nums, Collections.reverseOrder());
// [9, 5, 3, 2, 1]

// Strings
String[] palavras = {"zebra", "apple", "banana"};
Arrays.sort(palavras, Collections.reverseOrder());
// [zebra, banana, apple]

// ❌ Não funciona com primitivos
int[] primitivos = {1, 5, 3};
// Arrays.sort(primitivos, Collections.reverseOrder());  // ERRO!

// Solução: ordenar e reverter manualmente
Arrays.sort(primitivos);
reverter(primitivos);  // Método custom
```

## 🎯 Aplicabilidade

**1. Ordenação de Dados Numéricos**:
```java
int[] scores = {85, 92, 78, 95, 88};
Arrays.sort(scores);
int mediana = scores[scores.length / 2];
```

**2. Preparação para Busca Binária**:
```java
String[] nomes = {"Carlos", "Ana", "Bob"};
Arrays.sort(nomes);
int index = Arrays.binarySearch(nomes, "Bob");  // Requer ordenação
```

**3. Ordenação de Objetos por Critério**:
```java
Arrays.sort(produtos, Comparator.comparingDouble(p -> p.preco));
```

**4. Análise Estatística**:
```java
Arrays.sort(dados);
double min = dados[0];
double max = dados[dados.length - 1];
double mediana = dados[dados.length / 2];
```

**5. Remoção de Duplicatas Após Ordenação**:
```java
Arrays.sort(arr);
int unique = 1;
for (int i = 1; i < arr.length; i++) {
    if (arr[i] != arr[i - 1]) {
        arr[unique++] = arr[i];
    }
}
```

## ⚠️ Armadilhas Comuns

**1. Esquecer que Modifica o Array**:
```java
int[] original = {5, 2, 8};
Arrays.sort(original);
// ⚠️ original foi alterado! [2, 5, 8]
```

**2. Usar Collections.reverseOrder() com Primitivos**:
```java
int[] nums = {1, 5, 3};
// Arrays.sort(nums, Collections.reverseOrder());  // ❌ ERRO!
// Use Integer[] ou ordene e reverta manualmente
```

**3. Comparator em fromIndex/toIndex**:
```java
Integer[] nums = {5, 2, 8, 1};
// ❌ Não existe: Arrays.sort(nums, 0, 2, comparator)
// Use: Arrays.sort(nums, comparator) (ordena tudo)
```

**4. Ordenação de Objetos Sem Comparable/Comparator**:
```java
class Item {
    int valor;
}

Item[] itens = {new Item()};
// Arrays.sort(itens);  // ❌ ClassCastException!
// Precisa Comparable ou Comparator
```

**5. Índices Inválidos**:
```java
int[] arr = {1, 2, 3, 4, 5};
Arrays.sort(arr, 2, 10);  // ❌ ArrayIndexOutOfBoundsException
```

## ✅ Boas Práticas

**1. Copie Antes de Ordenar (Se Precisar do Original)**:
```java
int[] original = {5, 2, 8};
int[] ordenado = Arrays.copyOf(original, original.length);
Arrays.sort(ordenado);
```

**2. Use Comparator.comparing() para Legibilidade**:
```java
Arrays.sort(pessoas, Comparator.comparing(Pessoa::getNome));
```

**3. Ordene Antes de Busca Binária**:
```java
Arrays.sort(arr);
int index = Arrays.binarySearch(arr, valor);
```

**4. Use parallelSort() para Arrays Grandes**:
```java
int[] largeArray = new int[10_000_000];
Arrays.parallelSort(largeArray);  // Mais rápido que sort()
```

**5. Implemente Comparable para Ordem Natural**:
```java
class Produto implements Comparable<Produto> {
    @Override
    public int compareTo(Produto outro) {
        return this.nome.compareTo(outro.nome);
    }
}
```

**6. Valide Índices em Ordenação Parcial**:
```java
if (fromIndex >= 0 && toIndex <= arr.length) {
    Arrays.sort(arr, fromIndex, toIndex);
}
```

## 📚 Resumo Executivo

`Arrays.sort()` ordena arrays **in-place** em ordem crescente usando algoritmos eficientes.

**Sintaxe**:
```java
Arrays.sort(array);  // Array completo
Arrays.sort(array, fromIndex, toIndex);  // Intervalo
Arrays.sort(array, comparator);  // Ordem customizada
```

**Algoritmos**:
- **Primitivos**: Dual-Pivot Quicksort (O(n log n) médio)
- **Objetos**: TimSort (O(n log n) garantido, estável)

**Características**:
- **In-place**: modifica array original
- **Void**: não retorna valor
- **Intervalo**: `fromIndex` inclusivo, `toIndex` exclusivo

**Ordem customizada**:
```java
Arrays.sort(arr, Collections.reverseOrder());  // Decrescente
Arrays.sort(arr, Comparator.comparing(Obj::campo));  // Por campo
```

**Importante**: primitivos não aceitam Comparator - use wrappers (`Integer[]`, não `int[]`).

**Importar**: `import java.util.Arrays;`
