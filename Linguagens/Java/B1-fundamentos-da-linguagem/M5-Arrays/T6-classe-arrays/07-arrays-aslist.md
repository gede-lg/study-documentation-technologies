# Arrays.asList() - Conversão de Array para Lista

## 🎯 Introdução e Definição

**`Arrays.asList()`** é um método estático que **converte um array em uma List** de tamanho **fixo**, permitindo usar métodos da interface `List` sem criar uma coleção completamente nova.

**Conceito central**: cria uma **"visão" List** sobre um array existente - não copia elementos, apenas fornece uma interface List.

**Sintaxe fundamental**:
```java
List<T> lista = Arrays.asList(array);
List<T> lista = Arrays.asList(elemento1, elemento2, ...);
```

**Exemplo básico**:
```java
String[] arr = {"Ana", "Bob", "Carlos"};
List<String> lista = Arrays.asList(arr);
// lista = [Ana, Bob, Carlos]
```

**Características**:
- Tamanho **fixo** (não pode adicionar/remover)
- **Backed by array** (modificações refletem no array original)
- Retorna `List`, não `ArrayList`

`Arrays.asList()` é útil para trabalhar com arrays usando API de Collections.

## 📋 Fundamentos Teóricos

### 1️⃣ Conversão de Array para List

**Sintaxe varargs**:
```java
List<String> lista = Arrays.asList("Ana", "Bob", "Carlos");
// [Ana, Bob, Carlos]
```

**Sintaxe com array**:
```java
String[] arr = {"Ana", "Bob", "Carlos"};
List<String> lista = Arrays.asList(arr);
// [Ana, Bob, Carlos]
```

**Tipos numéricos**:
```java
Integer[] nums = {1, 2, 3, 4, 5};
List<Integer> lista = Arrays.asList(nums);
// [1, 2, 3, 4, 5]
```

**Importante**: retorna `java.util.Arrays.ArrayList` (classe interna), **não** `java.util.ArrayList`.

### 2️⃣ Tamanho Fixo - UnsupportedOperationException

Lista criada tem **tamanho fixo** - não pode adicionar/remover:

```java
List<String> lista = Arrays.asList("Ana", "Bob");

// ✓ Modificar elementos existentes - OK
lista.set(0, "Carlos");  // [Carlos, Bob]

// ❌ Adicionar elementos - ERRO
lista.add("Diana");  // UnsupportedOperationException

// ❌ Remover elementos - ERRO
lista.remove(0);  // UnsupportedOperationException

// ❌ Limpar lista - ERRO
lista.clear();  // UnsupportedOperationException
```

**Operações não suportadas**:
- `add(E e)`
- `add(int index, E element)`
- `remove(int index)`
- `remove(Object o)`
- `clear()`
- `addAll(Collection c)`
- `removeAll(Collection c)`
- `retainAll(Collection c)`

**Operações suportadas**:
- `set(int index, E element)` ✓
- `get(int index)` ✓
- `size()` ✓
- `contains(Object o)` ✓
- `indexOf(Object o)` ✓
- `iterator()` ✓
- `toArray()` ✓

### 3️⃣ Backed by Array - Modificações Refletem

**Lista e array estão conectados**:

```java
String[] arr = {"Ana", "Bob", "Carlos"};
List<String> lista = Arrays.asList(arr);

// Modificar lista afeta array
lista.set(0, "Diana");
System.out.println(arr[0]);  // "Diana" (!)

// Modificar array afeta lista
arr[1] = "Eve";
System.out.println(lista.get(1));  // "Eve" (!)
```

**Não é cópia** - é uma **visão**:
```java
String[] arr = {"A", "B", "C"};
List<String> lista = Arrays.asList(arr);

lista.set(1, "X");
// arr = ["A", "X", "C"]
// lista = [A, X, C]
```

### 4️⃣ Problema com Arrays Primitivos

**Arrays de primitivos** criam `List` **do array inteiro**, não dos elementos:

```java
int[] primitivos = {1, 2, 3};
List<int[]> lista = Arrays.asList(primitivos);
// ⚠️ List<int[]> com 1 elemento (o array completo)

System.out.println(lista.size());  // 1 (não 3!)
System.out.println(lista.get(0));  // [I@15db9742 (referência ao array)
```

**Solução 1: usar wrappers**:
```java
Integer[] wrappers = {1, 2, 3};
List<Integer> lista = Arrays.asList(wrappers);
// [1, 2, 3] ✓ Correto
```

**Solução 2: Java 8+ Stream**:
```java
int[] primitivos = {1, 2, 3};
List<Integer> lista = Arrays.stream(primitivos)
                            .boxed()
                            .collect(Collectors.toList());
// [1, 2, 3]
```

### 5️⃣ Conversão para ArrayList Mutável

Para lista **modificável**, criar novo `ArrayList`:

```java
String[] arr = {"Ana", "Bob"};
List<String> fixa = Arrays.asList(arr);

// Criar ArrayList mutável
List<String> mutavel = new ArrayList<>(Arrays.asList(arr));

// Ou
List<String> mutavel2 = new ArrayList<>(fixa);

// Agora pode adicionar/remover
mutavel.add("Carlos");  // ✓ OK
mutavel.remove(0);      // ✓ OK
```

**Comparação**:
```java
// Fixa
List<String> fixa = Arrays.asList("A", "B");
fixa.add("C");  // ❌ UnsupportedOperationException

// Mutável
List<String> mutavel = new ArrayList<>(Arrays.asList("A", "B"));
mutavel.add("C");  // ✓ OK - [A, B, C]
```

### 6️⃣ Uso com Métodos de Collections

Permite usar métodos de `Collections`:

```java
List<Integer> lista = Arrays.asList(5, 2, 8, 1, 9);

// Ordenar
Collections.sort(lista);
// [1, 2, 5, 8, 9]

// Embaralhar
Collections.shuffle(lista);

// Reverter
Collections.reverse(lista);

// Buscar
int index = Collections.binarySearch(lista, 5);

// Máximo/mínimo
int max = Collections.max(lista);
int min = Collections.min(lista);
```

**Importante**: modificações afetam array original!

```java
Integer[] arr = {5, 2, 8};
List<Integer> lista = Arrays.asList(arr);

Collections.sort(lista);
// arr = [2, 5, 8] (modificado!)
```

### 7️⃣ Uso com forEach e Stream

**forEach**:
```java
List<String> lista = Arrays.asList("Ana", "Bob", "Carlos");

lista.forEach(nome -> System.out.println(nome));
// Ana
// Bob
// Carlos
```

**Stream API**:
```java
List<Integer> lista = Arrays.asList(1, 2, 3, 4, 5);

int soma = lista.stream()
                .filter(n -> n % 2 == 0)
                .mapToInt(Integer::intValue)
                .sum();
// soma = 6 (2 + 4)
```

### 8️⃣ Inicialização de Coleções

**Inicialização imutável** (Java 9+):
```java
// Java 9+
List<String> imutavel = List.of("Ana", "Bob", "Carlos");
imutavel.add("X");  // UnsupportedOperationException

// Antes do Java 9
List<String> fixa = Arrays.asList("Ana", "Bob", "Carlos");
```

**Inicialização mutável**:
```java
// Com Arrays.asList
List<String> lista = new ArrayList<>(Arrays.asList("A", "B", "C"));

// Com inicializador
List<String> lista2 = new ArrayList<>() {{
    add("A");
    add("B");
    add("C");
}};
```

### 9️⃣ Conversão de Volta para Array

**toArray() sem parâmetros** - retorna `Object[]`:
```java
List<String> lista = Arrays.asList("Ana", "Bob");
Object[] arr = lista.toArray();
// arr = ["Ana", "Bob"] (tipo Object[])
```

**toArray(T[] a)** - retorna tipo específico:
```java
List<String> lista = Arrays.asList("Ana", "Bob");
String[] arr = lista.toArray(new String[0]);
// arr = ["Ana", "Bob"] (tipo String[])
```

**Java 11+ - toArray(IntFunction)**:
```java
String[] arr = lista.toArray(String[]::new);
```

### 🔟 Complexidade e Performance

**Criação**: **O(1)** - apenas cria wrapper sobre array.

```java
// Não copia elementos - muito rápido!
List<Integer> lista = Arrays.asList(array);  // O(1)

// ArrayList - copia elementos
List<Integer> arrayList = new ArrayList<>(Arrays.asList(array));  // O(n)
```

**Acesso**: **O(1)** - acesso direto ao array subjacente.

```java
lista.get(index);  // O(1)
```

**Modificação**: **O(1)**
```java
lista.set(index, valor);  // O(1)
```

## 🎯 Aplicabilidade

**1. Passagem para Métodos que Esperam List**:
```java
public void processar(List<String> nomes) { }

String[] arr = {"Ana", "Bob"};
processar(Arrays.asList(arr));
```

**2. Inicialização Rápida de List**:
```java
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
```

**3. Uso de Métodos de Collections**:
```java
Integer[] arr = {5, 2, 8, 1};
List<Integer> lista = Arrays.asList(arr);
Collections.sort(lista);
```

**4. Iteração com forEach**:
```java
Arrays.asList("A", "B", "C").forEach(System.out::println);
```

**5. Testes Unitários**:
```java
@Test
public void test() {
    List<String> esperado = Arrays.asList("A", "B", "C");
    List<String> resultado = metodo();
    assertEquals(esperado, resultado);
}
```

## ⚠️ Armadilhas Comuns

**1. Tentar Adicionar/Remover Elementos**:
```java
List<String> lista = Arrays.asList("A", "B");
lista.add("C");  // ❌ UnsupportedOperationException
```

**2. Usar com Arrays Primitivos**:
```java
int[] arr = {1, 2, 3};
List<int[]> lista = Arrays.asList(arr);  // ⚠️ List<int[]>, não List<Integer>
System.out.println(lista.size());  // 1 (não 3!)
```

**3. Esquecer que Modificações Afetam Array**:
```java
String[] arr = {"A", "B"};
List<String> lista = Arrays.asList(arr);
lista.set(0, "X");
// ⚠️ arr[0] também é "X"
```

**4. Assumir que é ArrayList**:
```java
List<String> lista = Arrays.asList("A", "B");
// lista é Arrays.ArrayList, não java.util.ArrayList
```

**5. Usar com null como Varargs**:
```java
List<String> lista = Arrays.asList(null);
// [null] - lista com 1 elemento null

// Passar array null
String[] arr = null;
Arrays.asList(arr);  // NullPointerException
```

## ✅ Boas Práticas

**1. Use para Listas de Tamanho Fixo Apenas**:
```java
List<String> fixa = Arrays.asList("A", "B", "C");
```

**2. Crie ArrayList para Listas Mutáveis**:
```java
List<String> mutavel = new ArrayList<>(Arrays.asList("A", "B"));
mutavel.add("C");  // ✓ OK
```

**3. Use Wrappers para Primitivos**:
```java
Integer[] nums = {1, 2, 3};
List<Integer> lista = Arrays.asList(nums);  // ✓ Correto
```

**4. Documente Tamanho Fixo**:
```java
/**
 * Retorna lista de tamanho fixo (não pode adicionar/remover)
 */
public List<String> getNomes() {
    return Arrays.asList(nomes);
}
```

**5. Use List.of() em Java 9+**:
```java
// Java 9+
List<String> imutavel = List.of("A", "B", "C");

// Antes do Java 9
List<String> fixa = Arrays.asList("A", "B", "C");
```

**6. Evite Modificar Array Original**:
```java
String[] arr = {"A", "B"};
List<String> lista = new ArrayList<>(Arrays.asList(arr));
// Agora independente do array
```

## 📚 Resumo Executivo

`Arrays.asList()` converte array em `List` de **tamanho fixo**.

**Sintaxe**:
```java
List<T> lista = Arrays.asList(array);
List<T> lista = Arrays.asList(elem1, elem2, ...);
```

**Características**:
- **Tamanho fixo**: não pode adicionar/remover
- **Backed by array**: modificações refletem no array original
- **Complexidade**: O(1) criação, O(1) acesso
- Retorna `Arrays.ArrayList` (não `java.util.ArrayList`)

**Operações suportadas**:
- `get()`, `set()`, `size()`, `contains()` ✓
- `add()`, `remove()`, `clear()` ❌ (UnsupportedOperationException)

**Problema com primitivos**:
```java
int[] arr = {1, 2, 3};
Arrays.asList(arr);  // ⚠️ List<int[]> (1 elemento)

Integer[] arr2 = {1, 2, 3};
Arrays.asList(arr2);  // ✓ List<Integer> (3 elementos)
```

**Lista mutável**:
```java
List<String> mutavel = new ArrayList<>(Arrays.asList("A", "B"));
mutavel.add("C");  // ✓ OK
```

**Exemplo completo**:
```java
String[] arr = {"Ana", "Bob"};
List<String> lista = Arrays.asList(arr);

lista.set(0, "Carlos");  // ✓ OK
// arr[0] = "Carlos" (modificação reflete)

lista.add("Diana");  // ❌ UnsupportedOperationException
```

**Importar**: `import java.util.Arrays;` e `import java.util.List;`
