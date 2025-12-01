# Arrays.binarySearch() - Busca Binária em Arrays

## 🎯 Introdução e Definição

**`Arrays.binarySearch()`** é um método estático que **localiza um elemento** em um array **ordenado** usando o algoritmo de **busca binária**, retornando o **índice** do elemento ou um valor negativo indicando onde deveria estar.

**Conceito central**: divide repetidamente o array ao meio, comparando com o elemento central, descartando metade a cada iteração.

**Sintaxe fundamental**:
```java
int index = Arrays.binarySearch(array, chave);
```

**Exemplo básico**:
```java
int[] nums = {1, 3, 5, 7, 9};  // DEVE estar ordenado
int index = Arrays.binarySearch(nums, 5);
// index = 2 (encontrado no índice 2)
```

**Retorno**:
- **≥ 0**: índice onde elemento foi encontrado
- **< 0**: `-(insertion point + 1)` - onde deveria ser inserido

**Pré-requisito obrigatório**: array **DEVE** estar ordenado (usar `Arrays.sort()` antes).

## 📋 Fundamentos Teóricos

### 1️⃣ Algoritmo de Busca Binária

**Funcionamento**:
1. Compara chave com elemento **central**
2. Se igual: retorna índice
3. Se menor: busca na **metade esquerda**
4. Se maior: busca na **metade direita**
5. Repete até encontrar ou esgotar elementos

**Exemplo visual**:
```java
int[] arr = {1, 3, 5, 7, 9, 11, 13};
//           0  1  2  3  4   5   6
Arrays.binarySearch(arr, 7);

// Passo 1: meio = 3, arr[3] = 7 ✓ ENCONTRADO!
// Retorna: 3
```

**Busca sem sucesso**:
```java
Arrays.binarySearch(arr, 6);

// Passo 1: meio = 3, arr[3] = 7 > 6 → busca esquerda
// Passo 2: meio = 1, arr[1] = 3 < 6 → busca direita
// Passo 3: meio = 2, arr[2] = 5 < 6 → não há mais elementos
// Retorna: -4 (deveria estar no índice 3, então -(3+1) = -4)
```

### 2️⃣ Interpretação do Valor de Retorno

**Elemento encontrado** (retorno ≥ 0):
```java
int[] nums = {10, 20, 30, 40, 50};
int idx = Arrays.binarySearch(nums, 30);
// idx = 2 (encontrado no índice 2)
```

**Elemento NÃO encontrado** (retorno < 0):
```java
int idx = Arrays.binarySearch(nums, 25);
// idx = -3

// Decodificar insertion point:
int insertionPoint = -(idx + 1);  // -((-3) + 1) = 2
// 25 deveria ser inserido no índice 2 (entre 20 e 30)
```

**Fórmula**:
- **Encontrado**: retorna `index`
- **Não encontrado**: retorna `-(insertionPoint + 1)`
- **Recuperar insertion point**: `-(retorno + 1)`

**Exemplo prático**:
```java
int[] arr = {1, 3, 5, 7, 9};

Arrays.binarySearch(arr, 0);   // -1 → inserir em 0
Arrays.binarySearch(arr, 2);   // -2 → inserir em 1
Arrays.binarySearch(arr, 4);   // -3 → inserir em 2
Arrays.binarySearch(arr, 10);  // -6 → inserir em 5 (fim)
```

### 3️⃣ Sobrecarga para Tipos Primitivos

Métodos específicos para cada tipo primitivo:

```java
// Inteiros
int[] ints = {1, 3, 5, 7};
Arrays.binarySearch(ints, 5);

// Longs
long[] longs = {100L, 200L, 300L};
Arrays.binarySearch(longs, 200L);

// Doubles
double[] doubles = {1.5, 2.5, 3.5};
Arrays.binarySearch(doubles, 2.5);

// Chars
char[] chars = {'a', 'e', 'i', 'o'};
Arrays.binarySearch(chars, 'i');

// Bytes, shorts, floats, booleans também suportados
```

**Importante**: tipos diferentes requerem conversão:
```java
int[] nums = {1, 2, 3};
// Arrays.binarySearch(nums, 2.0);  // ❌ Erro: double != int
Arrays.binarySearch(nums, (int) 2.0);  // ✓ Correto
```

### 4️⃣ Busca em Intervalo - fromIndex e toIndex

Busca **apenas em um intervalo** do array:

```java
int[] arr = {1, 3, 5, 7, 9, 11, 13};
//           0  1  2  3  4   5   6

// Buscar apenas do índice 2 ao 5 (6 exclusivo)
int idx = Arrays.binarySearch(arr, 2, 6, 9);
// idx = 4 (encontrado)

idx = Arrays.binarySearch(arr, 2, 6, 1);
// idx = -3 (1 está no índice 0, fora do intervalo buscado)
```

**Parâmetros**:
- `fromIndex`: inclusivo (começa aqui)
- `toIndex`: exclusivo (para antes daqui)

**Atenção**: índices retornados são **relativos ao array completo**, não ao intervalo!

### 5️⃣ Busca em Arrays de Objetos

Objetos devem implementar `Comparable` ou fornecer `Comparator`:

**Com Comparable (ordem natural)**:
```java
String[] nomes = {"Ana", "Bob", "Carlos", "Diana"};
Arrays.sort(nomes);  // Ordenar primeiro

int idx = Arrays.binarySearch(nomes, "Carlos");
// idx = 2
```

**Com Comparator (ordem customizada)**:
```java
String[] nomes = {"carlos", "Ana", "BOB"};
Arrays.sort(nomes, String.CASE_INSENSITIVE_ORDER);

int idx = Arrays.binarySearch(nomes, "bob", 
                               String.CASE_INSENSITIVE_ORDER);
// idx = 1
```

**Classe customizada**:
```java
class Pessoa implements Comparable<Pessoa> {
    String nome;
    int idade;
    
    @Override
    public int compareTo(Pessoa outra) {
        return this.nome.compareTo(outra.nome);
    }
}

Pessoa[] pessoas = {/*...*/};
Arrays.sort(pessoas);

Pessoa busca = new Pessoa();
busca.nome = "Carlos";
int idx = Arrays.binarySearch(pessoas, busca);
```

### 6️⃣ Pré-Requisito: Array Ordenado

**CRÍTICO**: array **DEVE** estar ordenado antes da busca!

**Exemplo de erro**:
```java
int[] desordenado = {5, 2, 8, 1, 9};
int idx = Arrays.binarySearch(desordenado, 8);
// ⚠️ Resultado IMPREVISÍVEL (pode retornar -6, -3, etc.)
```

**Correto**:
```java
int[] arr = {5, 2, 8, 1, 9};
Arrays.sort(arr);  // [1, 2, 5, 8, 9]
int idx = Arrays.binarySearch(arr, 8);
// idx = 3 ✓ Correto
```

**Ordenação com Comparator**:
```java
String[] nomes = {"carlos", "Ana", "BOB"};
Comparator<String> comp = String.CASE_INSENSITIVE_ORDER;

Arrays.sort(nomes, comp);
int idx = Arrays.binarySearch(nomes, "ana", comp);
// ✓ MESMO Comparator em sort() e binarySearch()
```

### 7️⃣ Complexidade de Tempo

**Busca binária**: **O(log n)**
- 10 elementos: ~3 comparações
- 100 elementos: ~7 comparações
- 1.000.000 elementos: ~20 comparações

**Comparação com busca linear** (O(n)):
```java
// Busca linear (O(n))
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == chave) return i;
}

// Busca binária (O(log n)) - muito mais rápido!
Arrays.binarySearch(arr, chave);
```

**Benchmark**:
```java
int[] arr = new int[1_000_000];
// Preencher e ordenar...

// Linear: ~500.000 comparações (média)
// Binária: ~20 comparações
```

### 8️⃣ Elementos Duplicados - Índice Não Garantido

Com duplicatas, retorna **um** índice, mas **não especifica qual**:

```java
int[] arr = {1, 3, 5, 5, 5, 7, 9};
//           0  1  2  3  4  5  6

int idx = Arrays.binarySearch(arr, 5);
// idx pode ser 2, 3 ou 4 (qualquer um dos 5s)
```

**Para encontrar primeira/última ocorrência**, implemente busca customizada:
```java
int idx = Arrays.binarySearch(arr, 5);
if (idx >= 0) {
    // Encontrar primeira ocorrência
    while (idx > 0 && arr[idx - 1] == 5) {
        idx--;
    }
    // idx = 2 (primeira ocorrência)
}
```

### 9️⃣ Valores Especiais - null e NaN

**null em arrays de objetos**:
```java
String[] arr = {"Ana", "Bob", null, "Diana"};
Arrays.sort(arr, Comparator.nullsFirst(Comparator.naturalOrder()));

int idx = Arrays.binarySearch(arr, null, 
                               Comparator.nullsFirst(Comparator.naturalOrder()));
// idx = 2
```

**NaN em arrays de doubles/floats**:
```java
double[] arr = {1.0, 2.0, Double.NaN, 3.0};
Arrays.sort(arr);  // NaN vai pro final

int idx = Arrays.binarySearch(arr, Double.NaN);
// ⚠️ Comportamento indefinido (NaN != NaN)
```

### 🔟 Insertion Point - Inserção Ordenada

Usar insertion point para manter array ordenado:

```java
int[] arr = {1, 3, 5, 7, 9};
int chave = 6;

int idx = Arrays.binarySearch(arr, chave);
if (idx < 0) {
    int insertionPoint = -(idx + 1);  // -((-4) + 1) = 3
    
    // Criar novo array com chave inserida
    int[] novoArr = new int[arr.length + 1];
    System.arraycopy(arr, 0, novoArr, 0, insertionPoint);
    novoArr[insertionPoint] = chave;
    System.arraycopy(arr, insertionPoint, novoArr, 
                     insertionPoint + 1, arr.length - insertionPoint);
    
    // novoArr = [1, 3, 5, 6, 7, 9]
}
```

## 🎯 Aplicabilidade

**1. Verificar Existência de Elemento**:
```java
int idx = Arrays.binarySearch(arr, valor);
boolean existe = (idx >= 0);
```

**2. Busca Rápida em Grandes Datasets**:
```java
int[] ids = new int[1_000_000];
// Preencher e ordenar...
int idx = Arrays.binarySearch(ids, 42);  // O(log n)
```

**3. Inserção Ordenada**:
```java
int idx = Arrays.binarySearch(arr, novoValor);
if (idx < 0) {
    int pos = -(idx + 1);
    // Inserir em pos para manter ordenação
}
```

**4. Range Queries**:
```java
// Encontrar quantos elementos entre 10 e 20
int inicio = Arrays.binarySearch(arr, 10);
int fim = Arrays.binarySearch(arr, 20);
if (inicio < 0) inicio = -(inicio + 1);
if (fim < 0) fim = -(fim + 1);
int count = fim - inicio;
```

**5. Busca em Dicionários**:
```java
String[] palavras = loadDictionary();  // Ordenado
int idx = Arrays.binarySearch(palavras, "hello");
```

## ⚠️ Armadilhas Comuns

**1. Array Não Ordenado**:
```java
int[] arr = {5, 2, 8};  // ❌ Desordenado
Arrays.binarySearch(arr, 8);  // Resultado imprevisível
```

**2. Esquecer de Decodificar Insertion Point**:
```java
int idx = Arrays.binarySearch(arr, 25);
// idx = -3
// ❌ Usar -3 diretamente como índice
// ✓ int pos = -(idx + 1);  // 2
```

**3. Comparator Diferente Entre sort() e binarySearch()**:
```java
Arrays.sort(arr, comparatorA);
Arrays.binarySearch(arr, chave, comparatorB);  // ❌ Inconsistente
```

**4. Buscar em Intervalo com Índices Inválidos**:
```java
Arrays.binarySearch(arr, 10, 5, chave);  // ❌ fromIndex > toIndex
```

**5. Assumir Índice Específico com Duplicatas**:
```java
int[] arr = {1, 5, 5, 5, 9};
int idx = Arrays.binarySearch(arr, 5);
// ⚠️ idx pode ser 1, 2 ou 3 (não determinístico)
```

## ✅ Boas Práticas

**1. Sempre Ordenar Antes de Buscar**:
```java
Arrays.sort(arr);
int idx = Arrays.binarySearch(arr, chave);
```

**2. Verificar Retorno Antes de Usar**:
```java
int idx = Arrays.binarySearch(arr, chave);
if (idx >= 0) {
    System.out.println("Encontrado: " + arr[idx]);
} else {
    System.out.println("Não encontrado");
}
```

**3. Use Mesmo Comparator em sort() e binarySearch()**:
```java
Comparator<String> comp = String.CASE_INSENSITIVE_ORDER;
Arrays.sort(arr, comp);
int idx = Arrays.binarySearch(arr, chave, comp);
```

**4. Documente Insertion Point**:
```java
int idx = Arrays.binarySearch(arr, chave);
if (idx < 0) {
    int insertionPoint = -(idx + 1);
    // Usar insertion point para inserção ordenada
}
```

**5. Para Duplicatas, Implemente Busca Customizada**:
```java
// Encontrar primeira ou última ocorrência
int idx = findFirst(arr, chave);
```

**6. Valide Tamanho do Array**:
```java
if (arr.length == 0) {
    return -1;  // Evitar busca em array vazio
}
int idx = Arrays.binarySearch(arr, chave);
```

## 📚 Resumo Executivo

`Arrays.binarySearch()` localiza elemento em array **ordenado** com complexidade **O(log n)**.

**Sintaxe**:
```java
int idx = Arrays.binarySearch(array, chave);
int idx = Arrays.binarySearch(array, fromIndex, toIndex, chave);
int idx = Arrays.binarySearch(array, chave, comparator);
```

**Retorno**:
- **idx ≥ 0**: elemento encontrado no índice `idx`
- **idx < 0**: não encontrado, `-(idx + 1)` = insertion point

**Pré-requisito**: array **DEVE** estar ordenado (`Arrays.sort()`)

**Complexidade**: **O(log n)** (muito mais rápido que busca linear O(n))

**Duplicatas**: retorna **um** índice (não especifica qual)

**Exemplo completo**:
```java
int[] arr = {5, 2, 8, 1, 9};
Arrays.sort(arr);  // [1, 2, 5, 8, 9]

int idx = Arrays.binarySearch(arr, 8);  // idx = 3
idx = Arrays.binarySearch(arr, 6);      // idx = -4
int pos = -(idx + 1);  // pos = 3 (insertion point)
```

**Importar**: `import java.util.Arrays;`
