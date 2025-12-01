# T2.04 - toArray()

## Introdução

**toArray()**: converte **coleção** em **array**.

```java
import java.util.*;

// ✅ Uso básico
public class ExemploBasico {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        // ✅ toArray(): Object[]
        Object[] array1 = lista.toArray();
        
        // ✅ toArray(T[]): String[]
        String[] array2 = lista.toArray(new String[0]);
        
        System.out.println(Arrays.toString(array2));  // [Java, Python, C++]
    }
}
```

**Regra**: toArray() retorna Object[], toArray(T[]) retorna tipo específico.

---

## Fundamentos

### 1. toArray() - Object[]

```java
// ✅ toArray(): retorna Object[]
public class MetodoToArray {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ toArray(): Object[]
        Object[] array = lista.toArray();
        
        System.out.println(array.length);  // 3
        System.out.println(array[0]);      // A
        System.out.println(array[1]);      // B
        System.out.println(array[2]);      // C
        
        // ❌ PROBLEMA: Object[], não String[]
        // String[] strings = lista.toArray();  // ERRO compilação
        
        // ❌ Cast não funciona
        try {
            String[] strings = (String[]) lista.toArray();  // ClassCastException
        } catch (ClassCastException e) {
            System.out.println("Não pode fazer cast Object[] para String[]");
        }
        
        // ✅ Precisa iterar para converter
        Object[] objArray = lista.toArray();
        String[] strArray = new String[objArray.length];
        for (int i = 0; i < objArray.length; i++) {
            strArray[i] = (String) objArray[i];
        }
    }
}

/*
 * toArray():
 * 
 * ASSINATURA:
 * Object[] toArray()
 * 
 * RETORNO:
 * - Array de Object
 * - Contém TODOS elementos da coleção
 * 
 * LIMITAÇÃO:
 * - Retorna Object[], NÃO tipo específico
 * - Não pode fazer cast Object[] para String[]
 * - Precisa iterar para converter
 * 
 * QUANDO USAR:
 * - Quando tipo não importa
 * - Processamento genérico
 * - PREFERIR toArray(T[]) para tipo específico
 */
```

**toArray()**: retorna Object[]. **Não** pode fazer cast para tipo específico.

### 2. toArray(T[]) - Tipo Específico

```java
// ✅ toArray(T[]): retorna tipo específico
public class MetodoToArrayGenerics {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ FORMA 1: Array vazio (RECOMENDADO)
        String[] array1 = lista.toArray(new String[0]);
        
        System.out.println(Arrays.toString(array1));  // [A, B, C]
        
        // ✅ FORMA 2: Array com tamanho exato
        String[] array2 = lista.toArray(new String[lista.size()]);
        
        System.out.println(Arrays.toString(array2));  // [A, B, C]
        
        // ✅ FORMA 3: Array maior (sobra preenchido com null)
        String[] array3 = lista.toArray(new String[5]);
        
        System.out.println(Arrays.toString(array3));  // [A, B, C, null, null]
        
        // ✅ Verificação de tipo em tempo de compilação
        // Integer[] intArray = lista.toArray(new Integer[0]);  // ERRO compilação
    }
}

/*
 * toArray(T[]):
 * 
 * ASSINATURA:
 * <T> T[] toArray(T[] a)
 * 
 * PARÂMETRO:
 * - Array do tipo desejado
 * - Pode ser vazio (new String[0])
 * - Pode ter tamanho exato (new String[size()])
 * 
 * RETORNO:
 * - Array do TIPO especificado
 * - Contém TODOS elementos
 * 
 * COMPORTAMENTO:
 * 
 * Array MENOR que coleção:
 * - Cria NOVO array com tamanho correto
 * - Retorna novo array
 * 
 * Array IGUAL ou MAIOR:
 * - USA array fornecido
 * - Se MAIOR, preenche restante com null
 * 
 * RECOMENDAÇÃO:
 * ✅ toArray(new String[0])  // Java cria tamanho certo
 * ❌ toArray(new String[size()])  // Desnecessário
 * 
 * VANTAGEM:
 * - Tipo específico (String[], Integer[])
 * - Type-safe (verificação compilação)
 * - Não precisa cast
 */
```

**toArray(T[])**: retorna tipo específico. **Preferir** new String[0] (mais eficiente).

### 3. Array Vazio vs Tamanho Exato

```java
// ✅ Array vazio vs tamanho exato
public class ArrayVazioVsTamanho {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            lista.add("Elemento " + i);
        }
        
        // ✅ FORMA 1: Array vazio (RECOMENDADO)
        long inicio1 = System.nanoTime();
        String[] array1 = lista.toArray(new String[0]);
        long fim1 = System.nanoTime();
        System.out.println("Array vazio: " + (fim1 - inicio1) + " ns");
        
        // ✅ FORMA 2: Tamanho exato
        long inicio2 = System.nanoTime();
        String[] array2 = lista.toArray(new String[lista.size()]);
        long fim2 = System.nanoTime();
        System.out.println("Tamanho exato: " + (fim2 - inicio2) + " ns");
    }
}

/*
 * ARRAY VAZIO vs TAMANHO EXATO:
 * 
 * ARRAY VAZIO (new String[0]):
 * ✅ RECOMENDADO
 * - JVM cria array tamanho correto
 * - Mais RÁPIDO (JVM otimiza)
 * - Menos código (não precisa size())
 * - Código mais LIMPO
 * 
 * TAMANHO EXATO (new String[size()]):
 * ❌ NÃO recomendado
 * - Overhead criar array grande
 * - Overhead copiar elementos
 * - Mais código
 * - MAIS LENTO em versões recentes Java
 * 
 * BENCHMARK (Java 11+):
 * - Array vazio: ~5-10% MAIS RÁPIDO
 * - JVM otimiza internamente
 * 
 * SEMPRE PREFERIR:
 * lista.toArray(new String[0])
 */
```

**Preferir** new String[0]: mais rápido e limpo. JVM otimiza internamente.

### 4. Ordem dos Elementos

```java
// ✅ Ordem dos elementos no array
public class OrdemElementos {
    public static void main(String[] args) {
        // ✅ ArrayList: ordem INSERÇÃO
        Collection<String> arrayList = new ArrayList<>();
        arrayList.add("C");
        arrayList.add("A");
        arrayList.add("B");
        
        String[] array1 = arrayList.toArray(new String[0]);
        System.out.println("ArrayList: " + Arrays.toString(array1));  // [C, A, B]
        
        // ✅ HashSet: ordem IMPREVISÍVEL
        Collection<String> hashSet = new HashSet<>();
        hashSet.add("C");
        hashSet.add("A");
        hashSet.add("B");
        
        String[] array2 = hashSet.toArray(new String[0]);
        System.out.println("HashSet: " + Arrays.toString(array2));  // [A, B, C] (aleatório)
        
        // ✅ TreeSet: ordem NATURAL (alfabética)
        Collection<String> treeSet = new TreeSet<>();
        treeSet.add("C");
        treeSet.add("A");
        treeSet.add("B");
        
        String[] array3 = treeSet.toArray(new String[0]);
        System.out.println("TreeSet: " + Arrays.toString(array3));  // [A, B, C]
        
        // ✅ LinkedHashSet: ordem INSERÇÃO
        Collection<String> linkedHashSet = new LinkedHashSet<>();
        linkedHashSet.add("C");
        linkedHashSet.add("A");
        linkedHashSet.add("B");
        
        String[] array4 = linkedHashSet.toArray(new String[0]);
        System.out.println("LinkedHashSet: " + Arrays.toString(array4));  // [C, A, B]
    }
}

/*
 * ORDEM DOS ELEMENTOS:
 * 
 * ArrayList, LinkedList:
 * - Ordem INSERÇÃO
 * - toArray() preserva ordem
 * 
 * HashSet:
 * - Ordem IMPREVISÍVEL
 * - Não garantida
 * 
 * TreeSet:
 * - Ordem NATURAL (alfabética/numérica)
 * - toArray() retorna ordenado
 * 
 * LinkedHashSet:
 * - Ordem INSERÇÃO
 * - toArray() preserva ordem
 */
```

**Ordem**: ArrayList/LinkedHashSet preserva inserção. TreeSet ordenado. HashSet imprevisível.

### 5. Performance

```java
// ✅ Performance toArray()
public class PerformanceToArray {
    public static void main(String[] args) {
        int tamanho = 1_000_000;
        
        // ✅ ArrayList: O(n)
        Collection<Integer> arrayList = new ArrayList<>();
        for (int i = 0; i < tamanho; i++) {
            arrayList.add(i);
        }
        
        long inicio1 = System.nanoTime();
        Integer[] array1 = arrayList.toArray(new Integer[0]);
        long fim1 = System.nanoTime();
        System.out.println("ArrayList: " + (fim1 - inicio1) / 1_000_000 + " ms");
        
        // ✅ HashSet: O(n)
        Collection<Integer> hashSet = new HashSet<>();
        for (int i = 0; i < tamanho; i++) {
            hashSet.add(i);
        }
        
        long inicio2 = System.nanoTime();
        Integer[] array2 = hashSet.toArray(new Integer[0]);
        long fim2 = System.nanoTime();
        System.out.println("HashSet: " + (fim2 - inicio2) / 1_000_000 + " ms");
    }
}

/*
 * PERFORMANCE:
 * 
 * toArray():
 * ArrayList:   O(n) - copia elementos
 * LinkedList:  O(n) - percorre nós
 * HashSet:     O(n) - percorre buckets
 * TreeSet:     O(n) - percorre árvore
 * 
 * TODAS: O(n) linear
 * 
 * MEMÓRIA:
 * - Cria NOVO array
 * - Usa n * tamanho_elemento bytes
 * 
 * OTIMIZAÇÃO:
 * - Usar toArray(new T[0]) (JVM otimiza)
 */
```

**Performance**: O(n) em todas implementações. Cria novo array.

### 6. Modificar Array vs Coleção

```java
// ✅ Array independente da coleção
public class ArrayIndependente {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // ✅ Converter para array
        String[] array = lista.toArray(new String[0]);
        
        System.out.println("Lista: " + lista);    // [A, B, C]
        System.out.println("Array: " + Arrays.toString(array));  // [A, B, C]
        
        // ✅ Modificar array: NÃO afeta lista
        array[0] = "X";
        
        System.out.println("Lista: " + lista);    // [A, B, C] (não mudou)
        System.out.println("Array: " + Arrays.toString(array));  // [X, B, C]
        
        // ✅ Modificar lista: NÃO afeta array
        lista.add("D");
        
        System.out.println("Lista: " + lista);    // [A, B, C, D]
        System.out.println("Array: " + Arrays.toString(array));  // [X, B, C] (não mudou)
    }
}

/*
 * INDEPENDÊNCIA:
 * 
 * - toArray() cria NOVO array
 * - Array INDEPENDENTE da coleção
 * - Modificar array NÃO afeta coleção
 * - Modificar coleção NÃO afeta array
 * 
 * SNAPSHOT:
 * - Array é CÓPIA no momento da chamada
 * - Mudanças posteriores não refletidas
 */
```

**Array independente**: modificar array não afeta coleção e vice-versa.

### 7. Exemplos Práticos

```java
// ✅ Exemplos práticos
public class ExemplosPraticos {
    
    // ✅ Exemplo 1: Ordenar coleção
    public static String[] ordenar(Collection<String> colecao) {
        String[] array = colecao.toArray(new String[0]);
        Arrays.sort(array);
        return array;
    }
    
    // ✅ Exemplo 2: Processar com API array
    public static int soma(Collection<Integer> numeros) {
        Integer[] array = numeros.toArray(new Integer[0]);
        return Arrays.stream(array).mapToInt(Integer::intValue).sum();
    }
    
    // ✅ Exemplo 3: Passar para método que aceita array
    public static void imprimirArray(String[] array) {
        System.out.println(Arrays.toString(array));
    }
    
    public static void converterEImprimir(Collection<String> colecao) {
        String[] array = colecao.toArray(new String[0]);
        imprimirArray(array);
    }
    
    // ✅ Exemplo 4: Combinar com varargs
    public static void processar(String... elementos) {
        System.out.println("Processando " + elementos.length + " elementos");
    }
    
    public static void processarColecao(Collection<String> colecao) {
        String[] array = colecao.toArray(new String[0]);
        processar(array);  // Varargs aceita array
    }
    
    public static void main(String[] args) {
        // Exemplo 1
        Collection<String> nomes = new ArrayList<>();
        nomes.add("Carlos");
        nomes.add("Ana");
        nomes.add("Bruno");
        
        String[] ordenados = ordenar(nomes);
        System.out.println("Ordenados: " + Arrays.toString(ordenados));
        
        // Exemplo 2
        Collection<Integer> numeros = new ArrayList<>();
        numeros.add(10);
        numeros.add(20);
        numeros.add(30);
        
        int total = soma(numeros);
        System.out.println("Soma: " + total);
        
        // Exemplo 3
        converterEImprimir(nomes);
        
        // Exemplo 4
        processarColecao(nomes);
    }
}
```

**Exemplos**: ordenar, processar com API array, passar para varargs.

### 8. Resumo Visual

```java
/*
 * toArray()
 * 
 * DUAS VERSÕES:
 * 
 * 1. toArray():
 * 
 * ASSINATURA:
 * Object[] toArray()
 * 
 * RETORNO:
 * - Object[] (NÃO tipo específico)
 * 
 * LIMITAÇÃO:
 * - Não pode cast Object[] para String[]
 * - Precisa iterar para converter
 * 
 * USO:
 * Object[] array = lista.toArray();
 * 
 * 
 * 2. toArray(T[]):
 * 
 * ASSINATURA:
 * <T> T[] toArray(T[] a)
 * 
 * RETORNO:
 * - Array do tipo especificado (String[], Integer[])
 * 
 * PARÂMETRO:
 * - Array do tipo desejado
 * - new String[0] (RECOMENDADO)
 * - new String[size()] (não recomendado)
 * 
 * USO:
 * String[] array = lista.toArray(new String[0]);
 * 
 * RECOMENDAÇÃO:
 * ✅ lista.toArray(new String[0])  // Mais rápido
 * ❌ lista.toArray(new String[lista.size()])
 * 
 * 
 * ORDEM:
 * ArrayList:       INSERÇÃO
 * LinkedList:      INSERÇÃO
 * HashSet:         IMPREVISÍVEL
 * TreeSet:         NATURAL (alfabética)
 * LinkedHashSet:   INSERÇÃO
 * 
 * 
 * PERFORMANCE:
 * Todas: O(n) - percorre elementos
 * 
 * 
 * INDEPENDÊNCIA:
 * - toArray() cria NOVO array
 * - Array INDEPENDENTE da coleção
 * - Modificar um NÃO afeta outro
 * 
 * 
 * COMPARAÇÃO:
 * 
 * Método          | Retorno  | Cast Necessário
 * ----------------|----------|----------------
 * toArray()       | Object[] | SIM (elementos)
 * toArray(T[])    | T[]      | NÃO
 * 
 * 
 * QUANDO USAR:
 * - Interoperar com APIs que usam arrays
 * - Ordenar (Arrays.sort)
 * - Processar com streams
 * - Passar para varargs
 */

public class ExemploToArray {
    public static void main(String[] args) {
        Collection<String> lista = new ArrayList<>();
        lista.add("Java");
        lista.add("Python");
        lista.add("C++");
        
        // ❌ Object[] (limitado)
        Object[] array1 = lista.toArray();
        
        // ✅ String[] (recomendado)
        String[] array2 = lista.toArray(new String[0]);
        
        System.out.println(Arrays.toString(array2));
        
        // ✅ Ordenar
        Arrays.sort(array2);
        System.out.println(Arrays.toString(array2));
    }
}
```

---

## Aplicabilidade

**toArray()**:
- Converter coleção em **array**
- Interoperar com APIs que usam **arrays**
- **Ordenar** elementos (Arrays.sort)
- Processar com **streams**
- Passar para métodos **varargs**

**Preferir toArray(T[])**:
- Retorna tipo **específico**
- Não precisa **cast**
- **Type-safe** (verificação compilação)

---

## Armadilhas

### 1. Cast Object[] para String[]

```java
// ❌ ClassCastException
Object[] obj = lista.toArray();
String[] str = (String[]) obj;  // ERRO runtime

// ✅ Usar toArray(T[])
String[] str = lista.toArray(new String[0]);
```

### 2. Usar Tamanho Exato

```java
// ❌ Menos eficiente
lista.toArray(new String[lista.size()]);

// ✅ Mais eficiente
lista.toArray(new String[0]);
```

### 3. Assumir Ordem HashSet

```java
// ❌ Ordem imprevisível
HashSet<String> set = new HashSet<>();
String[] array = set.toArray(new String[0]);
// Ordem NÃO garantida
```

---

## Boas Práticas

### 1. Preferir toArray(T[])

```java
// ✅ Tipo específico
String[] array = lista.toArray(new String[0]);

// ❌ Object[] (limitado)
Object[] array = lista.toArray();
```

### 2. Usar Array Vazio

```java
// ✅ Array vazio (JVM otimiza)
lista.toArray(new String[0]);

// ❌ Tamanho exato (menos eficiente)
lista.toArray(new String[lista.size()]);
```

### 3. Arrays.asList() para Converter Volta

```java
// ✅ Array → List
String[] array = {"A", "B", "C"};
List<String> lista = Arrays.asList(array);
```

---

## Resumo

**toArray()**:
- Retorna **Object[]**
- Não pode cast para tipo específico
- **Limitado**

**toArray(T[])**:
- Retorna tipo **específico** (String[], Integer[])
- **Type-safe** (verificação compilação)
- **Preferir** esta versão

**Array vazio vs tamanho**:
- **Preferir** new String[0]
- JVM **otimiza** internamente
- Mais **rápido** que tamanho exato

**Ordem**:
- ArrayList/LinkedHashSet: ordem **inserção**
- TreeSet: ordem **natural**
- HashSet: ordem **imprevisível**

**Performance**:
- **O(n)** em todas implementações
- Cria **novo** array
- Array **independente** da coleção

**Independência**:
- toArray() cria **cópia**
- Modificar array **não** afeta coleção
- Modificar coleção **não** afeta array

**Uso**:
- Interoperar com APIs **arrays**
- **Ordenar** (Arrays.sort)
- Processar com **streams**
- Passar para **varargs**

**Regra de Ouro**: Preferir toArray(new String[0]) retorna tipo específico type-safe não precisa cast. Array vazio mais eficiente JVM otimiza. toArray() cria cópia independente modificar não afeta original. Ordem ArrayList inserção TreeSet natural HashSet imprevisível. Performance O(n) todas. Usar para interoperar arrays ordenar streams varargs.

