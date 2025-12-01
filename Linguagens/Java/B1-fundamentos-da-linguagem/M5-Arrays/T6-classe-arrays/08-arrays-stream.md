# Arrays.stream() - Stream API com Arrays

## 🎯 Introdução e Definição

**`Arrays.stream()`** é um método estático (Java 8+) que **cria um Stream** a partir de um array, permitindo usar programação funcional para processar elementos de forma declarativa e eficiente.

**Conceito central**: transforma array em **fluxo de dados** que pode ser filtrado, transformado, agregado usando operações funcionais.

**Sintaxe fundamental**:
```java
Stream<T> stream = Arrays.stream(array);
IntStream stream = Arrays.stream(intArray);
```

**Exemplo básico**:
```java
String[] nomes = {"Ana", "Bob", "Carlos"};
Arrays.stream(nomes)
      .forEach(System.out::println);
// Ana
// Bob
// Carlos
```

**Retorno**:
- Arrays de objetos: `Stream<T>`
- Arrays de primitivos: `IntStream`, `LongStream`, `DoubleStream`

`Arrays.stream()` é porta de entrada para **Stream API** com arrays.

## 📋 Fundamentos Teóricos

### 1️⃣ Criação de Stream - Objetos vs Primitivos

**Arrays de objetos** - `Stream<T>`:
```java
String[] nomes = {"Ana", "Bob", "Carlos"};
Stream<String> stream = Arrays.stream(nomes);
```

**Arrays de primitivos** - Streams especializados:

```java
// int[] → IntStream
int[] nums = {1, 2, 3, 4, 5};
IntStream intStream = Arrays.stream(nums);

// long[] → LongStream
long[] longs = {100L, 200L, 300L};
LongStream longStream = Arrays.stream(longs);

// double[] → DoubleStream
double[] doubles = {1.5, 2.5, 3.5};
DoubleStream doubleStream = Arrays.stream(doubles);
```

**Importante**: streams primitivos têm métodos especializados (`sum()`, `average()`, etc.).

### 2️⃣ Stream de Intervalo - fromIndex e toIndex

Criar stream de **parte do array**:

```java
int[] arr = {10, 20, 30, 40, 50};
//            0   1   2   3   4

IntStream stream = Arrays.stream(arr, 1, 4);  // Índices 1-3 (4 exclusivo)
stream.forEach(System.out::println);
// 20
// 30
// 40
```

**Parâmetros**:
- `fromIndex`: **inclusivo**
- `toIndex`: **exclusivo**

**Objetos**:
```java
String[] nomes = {"Ana", "Bob", "Carlos", "Diana", "Eve"};
Arrays.stream(nomes, 1, 4)  // Bob, Carlos, Diana
      .forEach(System.out::println);
```

### 3️⃣ Operações Intermediárias - filter, map, sorted

**filter** - filtrar elementos:
```java
int[] nums = {1, 2, 3, 4, 5, 6};

Arrays.stream(nums)
      .filter(n -> n % 2 == 0)  // Apenas pares
      .forEach(System.out::println);
// 2, 4, 6
```

**map** - transformar elementos:
```java
String[] nomes = {"ana", "bob", "carlos"};

Arrays.stream(nomes)
      .map(String::toUpperCase)
      .forEach(System.out::println);
// ANA, BOB, CARLOS
```

**sorted** - ordenar:
```java
int[] nums = {5, 2, 8, 1, 9};

Arrays.stream(nums)
      .sorted()
      .forEach(System.out::println);
// 1, 2, 5, 8, 9 (não modifica array original)
```

**Encadear operações**:
```java
Arrays.stream(nums)
      .filter(n -> n > 2)
      .sorted()
      .map(n -> n * 2)
      .forEach(System.out::println);
// 10, 16, 18 (de 5*2, 8*2, 9*2)
```

### 4️⃣ Operações Terminais - forEach, collect, toArray

**forEach** - iterar elementos:
```java
Arrays.stream(nomes).forEach(System.out::println);
```

**collect** - coletar em Collection:
```java
String[] arr = {"Ana", "Bob", "Carlos"};

List<String> lista = Arrays.stream(arr)
                           .collect(Collectors.toList());
// [Ana, Bob, Carlos]

Set<String> set = Arrays.stream(arr)
                        .collect(Collectors.toSet());
```

**toArray** - converter para array:
```java
String[] arr = {"ana", "bob", "carlos"};

String[] maiusculas = Arrays.stream(arr)
                            .map(String::toUpperCase)
                            .toArray(String[]::new);
// ["ANA", "BOB", "CARLOS"]
```

**count** - contar elementos:
```java
long count = Arrays.stream(nums)
                   .filter(n -> n > 5)
                   .count();
```

### 5️⃣ Operações de Redução - sum, average, max, min

**IntStream, LongStream, DoubleStream** têm métodos de agregação:

**sum**:
```java
int[] nums = {1, 2, 3, 4, 5};
int soma = Arrays.stream(nums).sum();
// soma = 15
```

**average**:
```java
double media = Arrays.stream(nums)
                     .average()
                     .orElse(0.0);
// media = 3.0
```

**max / min**:
```java
int max = Arrays.stream(nums)
                .max()
                .orElse(Integer.MIN_VALUE);
// max = 5

int min = Arrays.stream(nums)
                .min()
                .orElse(Integer.MAX_VALUE);
// min = 1
```

**reduce** - operação customizada:
```java
int produto = Arrays.stream(nums)
                    .reduce(1, (a, b) -> a * b);
// produto = 120 (1*2*3*4*5)
```

### 6️⃣ anyMatch, allMatch, noneMatch

**anyMatch** - algum elemento satisfaz:
```java
boolean temPar = Arrays.stream(nums)
                       .anyMatch(n -> n % 2 == 0);
// true
```

**allMatch** - todos elementos satisfazem:
```java
boolean todosPositivos = Arrays.stream(nums)
                               .allMatch(n -> n > 0);
// true
```

**noneMatch** - nenhum elemento satisfaz:
```java
boolean nenhumNegativo = Arrays.stream(nums)
                               .noneMatch(n -> n < 0);
// true
```

### 7️⃣ Streams Paralelos - parallelStream

**Processamento paralelo** para grandes datasets:

```java
int[] largeArray = new int[10_000_000];
// Preencher array...

// Sequencial
long soma1 = Arrays.stream(largeArray).sum();

// Paralelo (mais rápido para grandes volumes)
long soma2 = Arrays.stream(largeArray)
                   .parallel()
                   .sum();
```

**Quando usar**:
- Arrays grandes (> 10.000 elementos)
- Operações computacionalmente intensivas
- **Não** quando ordem importa ou há efeitos colaterais

**Exemplo prático**:
```java
int[] nums = IntStream.range(1, 1_000_000).toArray();

long inicio = System.currentTimeMillis();
long soma = Arrays.stream(nums).sum();
long fim = System.currentTimeMillis();
System.out.println("Sequencial: " + (fim - inicio) + "ms");

inicio = System.currentTimeMillis();
soma = Arrays.stream(nums).parallel().sum();
fim = System.currentTimeMillis();
System.out.println("Paralelo: " + (fim - inicio) + "ms");
```

### 8️⃣ Boxing e Unboxing - Primitivos ↔ Objetos

**IntStream → Stream<Integer>** (boxing):
```java
int[] primitivos = {1, 2, 3};

Stream<Integer> boxed = Arrays.stream(primitivos)
                              .boxed();

List<Integer> lista = boxed.collect(Collectors.toList());
// [1, 2, 3] (List<Integer>)
```

**Stream<Integer> → IntStream** (unboxing):
```java
Integer[] wrappers = {1, 2, 3};

int soma = Arrays.stream(wrappers)
                 .mapToInt(Integer::intValue)
                 .sum();
// soma = 6
```

### 9️⃣ Operações Intermediárias vs Terminais

**Intermediárias** - retornam novo Stream (lazy - não executam até terminal):
- `filter(Predicate)`
- `map(Function)`
- `sorted()`
- `distinct()`
- `limit(long)`
- `skip(long)`

**Terminais** - produzem resultado (executam pipeline):
- `forEach(Consumer)`
- `collect(Collector)`
- `toArray()`
- `reduce(BinaryOperator)`
- `count()`
- `anyMatch(Predicate)`
- `sum()`, `average()`, `max()`, `min()` (primitivos)

**Exemplo**:
```java
// Nada executado ainda (intermediárias são lazy)
Stream<String> stream = Arrays.stream(nomes)
                              .filter(n -> n.length() > 3)
                              .map(String::toUpperCase);

// Agora executa (forEach é terminal)
stream.forEach(System.out::println);
```

### 🔟 Combinação com Outras APIs

**Com Optional**:
```java
int[] nums = {1, 2, 3, 4, 5};

Optional<Integer> primeiro = Arrays.stream(nums)
                                   .filter(n -> n > 3)
                                   .boxed()
                                   .findFirst();
primeiro.ifPresent(System.out::println);  // 4
```

**Com Collectors**:
```java
String[] nomes = {"Ana", "Bob", "Carlos"};

String concatenado = Arrays.stream(nomes)
                           .collect(Collectors.joining(", "));
// "Ana, Bob, Carlos"

Map<Integer, List<String>> porTamanho = 
    Arrays.stream(nomes)
          .collect(Collectors.groupingBy(String::length));
// {3=[Ana, Bob], 6=[Carlos]}
```

**Com IntSummaryStatistics**:
```java
int[] nums = {1, 2, 3, 4, 5};

IntSummaryStatistics stats = Arrays.stream(nums)
                                   .summaryStatistics();

System.out.println("Count: " + stats.getCount());    // 5
System.out.println("Sum: " + stats.getSum());        // 15
System.out.println("Min: " + stats.getMin());        // 1
System.out.println("Max: " + stats.getMax());        // 5
System.out.println("Average: " + stats.getAverage());// 3.0
```

## 🎯 Aplicabilidade

**1. Filtragem de Dados**:
```java
int[] scores = {75, 82, 91, 68, 95};
int[] aprovados = Arrays.stream(scores)
                        .filter(s -> s >= 70)
                        .toArray();
// [75, 82, 91, 95]
```

**2. Transformação de Dados**:
```java
String[] nomes = {"ana", "bob"};
String[] maiusculas = Arrays.stream(nomes)
                            .map(String::toUpperCase)
                            .toArray(String[]::new);
```

**3. Agregação Estatística**:
```java
double media = Arrays.stream(valores).average().orElse(0.0);
int total = Arrays.stream(nums).sum();
```

**4. Busca de Elementos**:
```java
boolean temNegativo = Arrays.stream(nums)
                            .anyMatch(n -> n < 0);
```

**5. Conversão para Collections**:
```java
List<String> lista = Arrays.stream(arr)
                           .filter(s -> s.startsWith("A"))
                           .collect(Collectors.toList());
```

## ⚠️ Armadilhas Comuns

**1. Esquecer Operação Terminal**:
```java
Arrays.stream(nums)
      .filter(n -> n > 5)
      .map(n -> n * 2);
// ⚠️ Nada acontece (sem operação terminal)

// ✓ Correto
Arrays.stream(nums)
      .filter(n -> n > 5)
      .map(n -> n * 2)
      .forEach(System.out::println);  // Terminal
```

**2. Reutilizar Stream**:
```java
Stream<String> stream = Arrays.stream(nomes);
stream.forEach(System.out::println);
stream.count();  // ❌ IllegalStateException (stream já consumido)
```

**3. Modificar Array Durante Stream**:
```java
int[] arr = {1, 2, 3};
Arrays.stream(arr).forEach(n -> arr[0] = 999);  // ⚠️ Comportamento indefinido
```

**4. Usar sum() com Stream<Integer>**:
```java
Integer[] nums = {1, 2, 3};
// Arrays.stream(nums).sum();  // ❌ Erro! Stream<Integer> não tem sum()

// ✓ Correto
int soma = Arrays.stream(nums)
                 .mapToInt(Integer::intValue)
                 .sum();
```

**5. Paralelizar Streams Pequenos**:
```java
int[] small = {1, 2, 3, 4, 5};
Arrays.stream(small).parallel().sum();  // ⚠️ Overhead desnecessário
```

## ✅ Boas Práticas

**1. Use Streams para Operações Declarativas**:
```java
// ❌ Imperativo
List<String> result = new ArrayList<>();
for (String s : arr) {
    if (s.length() > 3) {
        result.add(s.toUpperCase());
    }
}

// ✓ Declarativo com stream
List<String> result = Arrays.stream(arr)
                            .filter(s -> s.length() > 3)
                            .map(String::toUpperCase)
                            .collect(Collectors.toList());
```

**2. Use IntStream para Primitivos**:
```java
int[] nums = {1, 2, 3};
int soma = Arrays.stream(nums).sum();  // ✓ Eficiente
```

**3. Prefira Method References**:
```java
Arrays.stream(nomes)
      .map(String::toUpperCase)  // ✓ Mais legível
      .forEach(System.out::println);
```

**4. Use parallel() Apenas para Grandes Volumes**:
```java
if (array.length > 10_000) {
    Arrays.stream(array).parallel()...
} else {
    Arrays.stream(array)...
}
```

**5. Trate Optional Adequadamente**:
```java
Arrays.stream(nums)
      .max()
      .ifPresent(max -> System.out.println("Máximo: " + max));
```

**6. Evite Efeitos Colaterais**:
```java
// ❌ Efeito colateral
Arrays.stream(arr).forEach(n -> externalList.add(n));

// ✓ Use collect
List<Integer> lista = Arrays.stream(arr)
                            .boxed()
                            .collect(Collectors.toList());
```

## 📚 Resumo Executivo

`Arrays.stream()` cria **Stream** a partir de array (Java 8+).

**Sintaxe**:
```java
Stream<T> stream = Arrays.stream(arrayObjetos);
IntStream stream = Arrays.stream(arrayInt);
Arrays.stream(array, fromIndex, toIndex);  // Intervalo
```

**Streams primitivos**:
- `int[]` → `IntStream`
- `long[]` → `LongStream`
- `double[]` → `DoubleStream`

**Operações principais**:
```java
Arrays.stream(nums)
      .filter(n -> n > 5)      // Intermediária
      .map(n -> n * 2)         // Intermediária
      .sorted()                // Intermediária
      .forEach(System.out::println);  // Terminal
```

**Agregação (primitivos)**:
```java
int soma = Arrays.stream(nums).sum();
double media = Arrays.stream(nums).average().orElse(0.0);
int max = Arrays.stream(nums).max().orElse(0);
```

**Conversão**:
```java
// Array → List
List<Integer> lista = Arrays.stream(nums)
                            .boxed()
                            .collect(Collectors.toList());

// Stream → Array
int[] arr = stream.toArray();
String[] arr2 = stream.toArray(String[]::new);
```

**Características**:
- **Lazy**: intermediárias não executam até operação terminal
- **Consumível**: stream só pode ser usado uma vez
- **Não modifica**: array original inalterado

**Exemplo completo**:
```java
int[] nums = {1, 2, 3, 4, 5, 6};

int somaParesDobrando = Arrays.stream(nums)
                              .filter(n -> n % 2 == 0)  // [2, 4, 6]
                              .map(n -> n * 2)           // [4, 8, 12]
                              .sum();                    // 24
```

**Importar**: `import java.util.Arrays;` e `import java.util.stream.*;`
