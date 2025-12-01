# T7.01 - Collections.sort(): Ordenação de Listas

## Introdução

**Collections.sort()**: ordena List ordem natural Comparable ou Comparator custom. TimSort híbrido O(n log n) estável preserva ordem elementos iguais.

```java
import java.util.*;

// COLLECTIONS.SORT: Ordenação
public class CollectionsSortIntro {
    public static void main(String[] args) {
        // ORDENAÇÃO NATURAL (Comparable):
        
        List<Integer> numeros = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9));
        
        System.out.println("Antes: " + numeros);
        
        Collections.sort(numeros);  // Ordem natural crescente
        
        System.out.println("Depois: " + numeros);
        // [1, 2, 5, 8, 9]
        
        
        // ORDENAÇÃO CUSTOM (Comparator):
        
        List<String> nomes = new ArrayList<>(Arrays.asList("Carlos", "Ana", "Bruno"));
        
        System.out.println("\nAntes: " + nomes);
        
        Collections.sort(nomes, (a, b) -> b.compareTo(a));  // Decrescente
        
        System.out.println("Depois: " + nomes);
        // [Carlos, Bruno, Ana]
        
        
        // COMPLEXIDADE:
        
        // TimSort: O(n log n)
        // Melhor caso: O(n) - já ordenado
        // Pior caso: O(n log n)
        // Estável: preserva ordem iguais
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Collections.sort(list): ordem natural");
        System.out.println("Collections.sort(list, comparator): custom");
        System.out.println("Complexidade: O(n log n)");
        System.out.println("Estável: SIM");
    }
}
```

**sort()**: ordem natural Comparable compareTo ou custom Comparator TimSort O(n log n) estável.

---

## Fundamentos

### 1. Ordenação Natural (Comparable)

```java
// ORDEM NATURAL: Comparable
public class OrdemNatural {
    public static void main(String[] args) {
        // NÚMEROS:
        
        List<Integer> numeros = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9, 3));
        
        Collections.sort(numeros);
        
        System.out.println("Números ordenados: " + numeros);
        // [1, 2, 3, 5, 8, 9]
        
        // Integer implementa Comparable<Integer>
        // compareTo(): ordem crescente
        
        
        // STRINGS:
        
        List<String> palavras = new ArrayList<>(Arrays.asList("zebra", "banana", "maçã", "abacaxi"));
        
        Collections.sort(palavras);
        
        System.out.println("\nPalavras ordenadas: " + palavras);
        // [abacaxi, banana, maçã, zebra]
        
        // String implementa Comparable<String>
        // compareTo(): ordem lexicográfica (alfabética)
        
        
        // DOUBLES:
        
        List<Double> precos = new ArrayList<>(Arrays.asList(19.99, 9.99, 29.99, 5.99));
        
        Collections.sort(precos);
        
        System.out.println("\nPreços ordenados: " + precos);
        // [5.99, 9.99, 19.99, 29.99]
        
        
        // CLASSE CUSTOM (implementa Comparable):
        
        class Pessoa implements Comparable<Pessoa> {
            String nome;
            int idade;
            
            Pessoa(String nome, int idade) {
                this.nome = nome;
                this.idade = idade;
            }
            
            @Override
            public int compareTo(Pessoa outra) {
                return this.idade - outra.idade;  // Ordem por idade
            }
            
            @Override
            public String toString() {
                return nome + "(" + idade + ")";
            }
        }
        
        List<Pessoa> pessoas = new ArrayList<>(Arrays.asList(
            new Pessoa("Ana", 30),
            new Pessoa("Bruno", 25),
            new Pessoa("Carlos", 35)
        ));
        
        Collections.sort(pessoas);  // Usa compareTo
        
        System.out.println("\nPessoas ordenadas por idade: " + pessoas);
        // [Bruno(25), Ana(30), Carlos(35)]
        
        
        // TIPOS SEM Comparable:
        
        class Produto {  // NÃO implementa Comparable
            String nome;
            double preco;
            
            Produto(String nome, double preco) {
                this.nome = nome;
                this.preco = preco;
            }
        }
        
        List<Produto> produtos = new ArrayList<>();
        produtos.add(new Produto("Mouse", 50.0));
        
        try {
            Collections.sort(produtos);  // ERRO!
        } catch (ClassCastException e) {
            System.out.println("\n❌ Erro: Produto não implementa Comparable");
            System.out.println("Solução: usar Comparator");
        }
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Comparable: ordem natural da classe");
        System.out.println("compareTo(): define critério ordenação");
        System.out.println("Tipos: Integer, String, Double, Date...");
        System.out.println("Custom: implementar Comparable<T>");
    }
}

/*
 * ORDEM NATURAL:
 * 
 * REQUISITO:
 * - Classe implementa Comparable<T>
 * - Método compareTo(T o)
 * 
 * RETORNO compareTo:
 * - Negativo: this < o (antes)
 * - Zero: this == o (igual)
 * - Positivo: this > o (depois)
 * 
 * TIPOS BUILT-IN:
 * - Integer: crescente
 * - String: lexicográfico
 * - Double: crescente
 * - Date: cronológico
 * 
 * CUSTOM:
 * - Implementar Comparable<T>
 * - Definir compareTo()
 */
```

**Ordem natural**: classe implementa Comparable compareTo retorna negativo antes zero igual positivo depois. Integer String Double Date built-in. Custom implementar Comparable definir critério.

### 2. Ordenação Custom (Comparator)

```java
// COMPARATOR: Ordenação custom
public class ComparatorCustom {
    public static void main(String[] args) {
        // DECRESCENTE:
        
        List<Integer> numeros = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9));
        
        Collections.sort(numeros, (a, b) -> b - a);  // Decrescente
        
        System.out.println("Decrescente: " + numeros);
        // [9, 8, 5, 2, 1]
        
        
        // STRINGS POR TAMANHO:
        
        List<String> palavras = new ArrayList<>(Arrays.asList("zebra", "oi", "banana", "a"));
        
        Collections.sort(palavras, (a, b) -> a.length() - b.length());
        
        System.out.println("\nPor tamanho: " + palavras);
        // [a, oi, zebra, banana]
        
        
        // IGNORAR CASE:
        
        List<String> nomes = new ArrayList<>(Arrays.asList("Carlos", "ana", "BRUNO"));
        
        Collections.sort(nomes, String.CASE_INSENSITIVE_ORDER);
        
        System.out.println("\nIgnorando case: " + nomes);
        // [ana, BRUNO, Carlos]
        
        
        // ORDEM REVERSA:
        
        List<Integer> nums = new ArrayList<>(Arrays.asList(5, 2, 8, 1));
        
        Collections.sort(nums, Collections.reverseOrder());
        
        System.out.println("\nReverso: " + nums);
        // [8, 5, 2, 1]
        
        
        // MÚLTIPLOS CRITÉRIOS:
        
        class Pessoa {
            String nome;
            int idade;
            
            Pessoa(String nome, int idade) {
                this.nome = nome;
                this.idade = idade;
            }
            
            @Override
            public String toString() {
                return nome + "(" + idade + ")";
            }
        }
        
        List<Pessoa> pessoas = new ArrayList<>(Arrays.asList(
            new Pessoa("Ana", 30),
            new Pessoa("Bruno", 25),
            new Pessoa("Ana", 25),
            new Pessoa("Carlos", 30)
        ));
        
        // Ordenar: primeiro por idade, depois por nome
        Collections.sort(pessoas, (a, b) -> {
            int cmpIdade = Integer.compare(a.idade, b.idade);
            if (cmpIdade != 0) return cmpIdade;
            return a.nome.compareTo(b.nome);
        });
        
        System.out.println("\nPor idade depois nome: " + pessoas);
        // [Ana(25), Bruno(25), Ana(30), Carlos(30)]
        
        
        // COMPARATOR.COMPARING (Java 8+):
        
        Collections.sort(pessoas, 
            Comparator.comparing((Pessoa p) -> p.idade)
                      .thenComparing(p -> p.nome)
        );
        
        System.out.println("Com Comparator.comparing: " + pessoas);
        // [Ana(25), Bruno(25), Ana(30), Carlos(30)]
        
        
        // NULO-SEGURO:
        
        List<String> comNull = new ArrayList<>(Arrays.asList("B", null, "A", null, "C"));
        
        Collections.sort(comNull, Comparator.nullsFirst(String::compareTo));
        
        System.out.println("\nNulls primeiro: " + comNull);
        // [null, null, A, B, C]
        
        Collections.sort(comNull, Comparator.nullsLast(String::compareTo));
        
        System.out.println("Nulls último: " + comNull);
        // [A, B, C, null, null]
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Lambda: (a,b) -> comparação");
        System.out.println("reverseOrder(): inverte ordem");
        System.out.println("Comparator.comparing(): Java 8+");
        System.out.println("nullsFirst/Last: nulo-seguro");
    }
}

/*
 * COMPARATOR:
 * 
 * SINTAXES:
 * - Lambda: (a,b) -> a - b
 * - Method ref: String::compareTo
 * - Classe anônima: new Comparator<T>() {...}
 * 
 * MÉTODOS ÚTEIS:
 * - reverseOrder(): ordem inversa
 * - nullsFirst(): nulls primeiro
 * - nullsLast(): nulls último
 * - comparing(): por campo
 * - thenComparing(): múltiplos critérios
 * 
 * COMPARAÇÃO:
 * Comparable: ordem natural (1 critério)
 * Comparator: custom (múltiplos critérios)
 */
```

**Comparator**: lambda a b comparação reverseOrder inverte Comparator.comparing Java 8 thenComparing múltiplos critérios nullsFirst nullsLast nulo-seguro custom flexível múltiplas ordenações.

### 3. Algoritmo TimSort

```java
// TIMSORT: Algoritmo Collections.sort
public class TimSortAlgoritmo {
    public static void main(String[] args) {
        // TIMSORT:
        // - Híbrido: Merge Sort + Insertion Sort
        // - Inventado por Tim Peters (Python)
        // - Java usa desde JDK 7
        // - Estável: preserva ordem iguais
        // - Adaptativo: aproveita dados parcialmente ordenados
        
        
        // COMPLEXIDADE:
        
        // Melhor caso: O(n)
        // - Lista já ordenada
        // - Detecta "runs" ordenados
        
        List<Integer> ordenado = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            ordenado.add(i);
        }
        
        long t1 = System.nanoTime();
        Collections.sort(ordenado);
        long t2 = System.nanoTime();
        
        System.out.println("=== TimSort Performance ===");
        System.out.println("Ordenado (100K): " + (t2-t1)/1_000_000 + "ms");
        // ~5ms - RÁPIDO O(n)
        
        
        // Pior caso: O(n log n)
        // - Lista aleatória
        
        List<Integer> aleatorio = new ArrayList<>();
        Random rand = new Random(42);
        for (int i = 0; i < 100_000; i++) {
            aleatorio.add(rand.nextInt());
        }
        
        long t3 = System.nanoTime();
        Collections.sort(aleatorio);
        long t4 = System.nanoTime();
        
        System.out.println("Aleatório (100K): " + (t4-t3)/1_000_000 + "ms");
        // ~50ms - O(n log n)
        
        
        // Caso médio: O(n log n)
        // - Maioria dos casos
        
        
        // ESTABILIDADE:
        
        // Ordem de elementos iguais é preservada
        
        class Item {
            int valor;
            int ordem;
            
            Item(int valor, int ordem) {
                this.valor = valor;
                this.ordem = ordem;
            }
            
            @Override
            public String toString() {
                return valor + "(" + ordem + ")";
            }
        }
        
        List<Item> itens = new ArrayList<>(Arrays.asList(
            new Item(5, 1),
            new Item(2, 2),
            new Item(5, 3),  // Mesmo valor que primeiro
            new Item(1, 4),
            new Item(5, 5)   // Mesmo valor novamente
        ));
        
        System.out.println("\nAntes: " + itens);
        
        Collections.sort(itens, (a, b) -> a.valor - b.valor);
        
        System.out.println("Depois: " + itens);
        // [1(4), 2(2), 5(1), 5(3), 5(5)]
        // Ordem dos 5's preservada: (1) → (3) → (5)
        
        
        // ADAPTATIVO:
        
        // Detecta "runs" (sequências ordenadas)
        
        List<Integer> parcial = new ArrayList<>(Arrays.asList(
            1, 2, 3, 4, 5,        // Run 1: crescente
            10, 9, 8, 7, 6,       // Run 2: decrescente
            11, 12, 13, 14, 15    // Run 3: crescente
        ));
        
        long t5 = System.nanoTime();
        Collections.sort(parcial);
        long t6 = System.nanoTime();
        
        System.out.println("\nParcial ordenado: " + (t6-t5) + "ns");
        // RÁPIDO: aproveita runs existentes
        
        
        // COMPARAÇÃO ALGORITMOS:
        
        /*
         * Algoritmo     | Complexidade | Estável | Adaptativo
         * -------------------------------------------------------
         * QuickSort     | O(n log n)*  | NÃO     | NÃO
         * MergeSort     | O(n log n)   | SIM     | NÃO
         * HeapSort      | O(n log n)   | NÃO     | NÃO
         * TimSort       | O(n log n)   | SIM     | SIM
         * 
         * * QuickSort pior caso: O(n²)
         * 
         * VENCEDOR: TimSort
         * - Estável
         * - Adaptativo
         * - Garantia O(n log n)
         */
        
        
        System.out.println("\n=== Resumo TimSort ===");
        System.out.println("Complexidade: O(n log n)");
        System.out.println("Melhor: O(n) - ordenado");
        System.out.println("Estável: SIM");
        System.out.println("Adaptativo: SIM");
        System.out.println("Java: desde JDK 7");
    }
}

/*
 * TIMSORT:
 * 
 * CARACTERÍSTICAS:
 * - Híbrido: Merge + Insertion
 * - Estável: preserva ordem iguais
 * - Adaptativo: aproveita runs
 * - Garantia: O(n log n)
 * 
 * COMPLEXIDADE:
 * - Melhor: O(n)
 * - Médio: O(n log n)
 * - Pior: O(n log n)
 * 
 * VANTAGENS:
 * - Rápido dados parcialmente ordenados
 * - Estável (importante)
 * - Previsível (não degrada)
 * 
 * JAVA:
 * - Collections.sort(): TimSort
 * - Arrays.sort(Object[]): TimSort
 * - Arrays.sort(primitivos): DualPivotQuickSort
 */
```

**TimSort**: híbrido Merge Insertion estável preserva iguais adaptativo aproveita runs O(n log n) garantido melhor O(n) ordenado Java JDK 7 rápido previsível.

### 4. List.sort() vs Collections.sort()

```java
// LIST.SORT vs COLLECTIONS.SORT
public class ListSortVsCollections {
    public static void main(String[] args) {
        // COLLECTIONS.SORT (tradicional):
        
        List<Integer> nums1 = new ArrayList<>(Arrays.asList(5, 2, 8, 1));
        
        Collections.sort(nums1);  // Método estático
        
        System.out.println("Collections.sort: " + nums1);
        
        
        // LIST.SORT (Java 8+):
        
        List<Integer> nums2 = new ArrayList<>(Arrays.asList(5, 2, 8, 1));
        
        nums2.sort(null);  // Método instância, null = ordem natural
        
        System.out.println("List.sort: " + nums2);
        
        
        // COM COMPARATOR:
        
        List<String> nomes1 = new ArrayList<>(Arrays.asList("Carlos", "Ana", "Bruno"));
        Collections.sort(nomes1, String.CASE_INSENSITIVE_ORDER);
        
        List<String> nomes2 = new ArrayList<>(Arrays.asList("Carlos", "Ana", "Bruno"));
        nomes2.sort(String.CASE_INSENSITIVE_ORDER);
        
        System.out.println("\nCollections.sort: " + nomes1);
        System.out.println("List.sort: " + nomes2);
        
        
        // IMPLEMENTAÇÃO:
        
        // List.sort (Java 8):
        // default void sort(Comparator<? super E> c) {
        //     Object[] a = this.toArray();
        //     Arrays.sort(a, (Comparator) c);
        //     ListIterator<E> i = this.listIterator();
        //     for (Object e : a) {
        //         i.next();
        //         i.set((E) e);
        //     }
        // }
        
        // Collections.sort:
        // public static <T> void sort(List<T> list, Comparator<? super T> c) {
        //     list.sort(c);  // Delega para List.sort!
        // }
        
        // CONCLUSÃO: mesmo algoritmo, sintaxe diferente
        
        
        // PERFORMANCE:
        
        List<Integer> big = new ArrayList<>();
        Random rand = new Random(42);
        for (int i = 0; i < 100_000; i++) {
            big.add(rand.nextInt());
        }
        
        List<Integer> copia = new ArrayList<>(big);
        
        long t1 = System.nanoTime();
        Collections.sort(big);
        long t2 = System.nanoTime();
        
        long t3 = System.nanoTime();
        copia.sort(null);
        long t4 = System.nanoTime();
        
        System.out.println("\n=== Performance (100K) ===");
        System.out.println("Collections.sort: " + (t2-t1)/1_000_000 + "ms");
        System.out.println("List.sort: " + (t4-t3)/1_000_000 + "ms");
        // Iguais: mesmo algoritmo
        
        
        // PREFERÊNCIA:
        
        // ✅ MODERNA (Java 8+):
        List<Integer> moderna = new ArrayList<>(Arrays.asList(5, 2, 8));
        moderna.sort(null);  // List.sort
        
        // ✅ TRADICIONAL (compatibilidade):
        List<Integer> tradicional = new ArrayList<>(Arrays.asList(5, 2, 8));
        Collections.sort(tradicional);  // Collections.sort
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("List.sort: Java 8+, método instância");
        System.out.println("Collections.sort: tradicional, estático");
        System.out.println("Performance: idêntica");
        System.out.println("Preferência: List.sort (moderna)");
    }
}

/*
 * LIST.SORT vs COLLECTIONS.SORT:
 * 
 * LIST.SORT (Java 8+):
 * - Método instância: list.sort(comparator)
 * - Null = ordem natural
 * - Sintaxe moderna
 * 
 * COLLECTIONS.SORT:
 * - Método estático: Collections.sort(list, comparator)
 * - Sem comparator = ordem natural
 * - Sintaxe tradicional
 * 
 * IMPLEMENTAÇÃO:
 * - Collections.sort delega para List.sort
 * - Mesmo algoritmo: TimSort
 * - Performance idêntica
 * 
 * PREFERÊNCIA:
 * - Java 8+: List.sort (moderna)
 * - Compatibilidade: Collections.sort
 */
```

**List.sort vs Collections.sort**: List.sort Java 8 método instância moderna null natural. Collections.sort estático tradicional. Mesma implementação TimSort performance idêntica. Preferência List.sort moderna.

### 5. Resumo Collections.sort

```java
/*
 * COLLECTIONS.SORT: Resumo Completo
 * 
 * ASSINATURAS:
 * 
 * 1. Ordem natural:
 *    Collections.sort(List<T> list)
 *    - Requer: T implements Comparable<T>
 *    - Usa: compareTo()
 * 
 * 2. Ordem custom:
 *    Collections.sort(List<T> list, Comparator<? super T> c)
 *    - Aceita: Comparator lambda/classe
 *    - Usa: compare()
 * 
 * 
 * ALGORITMO:
 * - TimSort (Java 7+)
 * - Complexidade: O(n log n)
 * - Melhor caso: O(n) - ordenado
 * - Estável: SIM
 * - Adaptativo: SIM
 * 
 * 
 * COMPARABLE vs COMPARATOR:
 * 
 * Comparable:
 * - Ordem natural da classe
 * - 1 critério fixo
 * - compareTo(T o)
 * - Implementa na classe
 * 
 * Comparator:
 * - Ordem custom
 * - Múltiplos critérios
 * - compare(T o1, T o2)
 * - Passa como parâmetro
 * 
 * 
 * EXEMPLOS:
 * 
 * // Ordem natural:
 * List<Integer> nums = Arrays.asList(5,2,8,1);
 * Collections.sort(nums);
 * // [1, 2, 5, 8]
 * 
 * // Decrescente:
 * Collections.sort(nums, Collections.reverseOrder());
 * // [8, 5, 2, 1]
 * 
 * // Custom:
 * List<String> nomes = Arrays.asList("Ana", "Carlos", "Bruno");
 * Collections.sort(nomes, (a,b) -> a.length() - b.length());
 * // [Ana, Bruno, Carlos]
 * 
 * 
 * MÉTODOS ÚTEIS:
 * - reverseOrder(): inverte ordem
 * - Comparator.comparing(): por campo
 * - Comparator.thenComparing(): múltiplos
 * - nullsFirst/Last(): nulo-seguro
 * 
 * 
 * ALTERNATIVA:
 * - list.sort(comparator): Java 8+
 * - Mesmo algoritmo
 * - Sintaxe moderna
 * 
 * 
 * PERFORMANCE:
 * - 100K elementos: ~50ms
 * - 1M elementos: ~600ms
 * - Ordenado: ~5ms (O(n))
 */

// DECISÃO RÁPIDA
public class DecisaoSort {
    public static void main(String[] args) {
        // ✅ Ordem natural
        List<Integer> nums = new ArrayList<>(Arrays.asList(5,2,8));
        Collections.sort(nums);
        
        // ✅ Decrescente
        Collections.sort(nums, Collections.reverseOrder());
        
        // ✅ Custom simples
        List<String> nomes = new ArrayList<>(Arrays.asList("Ana","Carlos"));
        Collections.sort(nomes, (a,b) -> a.length() - b.length());
        
        // ✅ Múltiplos critérios
        class Pessoa {
            String nome;
            int idade;
            Pessoa(String n, int i) { nome=n; idade=i; }
        }
        List<Pessoa> pessoas = new ArrayList<>();
        Collections.sort(pessoas, 
            Comparator.comparing((Pessoa p) -> p.idade)
                      .thenComparing(p -> p.nome)
        );
        
        System.out.println("Ordenações aplicadas!");
    }
}
```

---

## Aplicabilidade

**Collections.sort usar**:
- **Ordem natural**: Comparable compareTo Integer String Double crescente lexicográfico
- **Ordem custom**: Comparator lambda decrescente múltiplos critérios thenComparing
- **TimSort**: O(n log n) estável adaptativo O(n) ordenado previsível garantido
- **List.sort**: Java 8 moderna instância null natural preferir

---

## Armadilhas

### 1. Classe Sem Comparable

```java
// ❌ Classe sem Comparable
class Produto {
    String nome;
}
List<Produto> lista = new ArrayList<>();
Collections.sort(lista);  // ClassCastException

// ✅ Usar Comparator
Collections.sort(lista, (a,b) -> a.nome.compareTo(b.nome));
```

### 2. Ordem Instável

```java
// ❌ Arrays.sort primitivos (não estável)
int[] arr = {5,2,5,1};
Arrays.sort(arr);  // QuickSort (não estável)

// ✅ Collections.sort (estável)
List<Integer> list = Arrays.asList(5,2,5,1);
Collections.sort(list);  // TimSort (estável)
```

---

## Boas Práticas

### 1. List.sort Moderna

```java
// ✅ Java 8+
list.sort(null);  // Ordem natural
list.sort((a,b) -> a-b);  // Custom
```

### 2. Comparator.comparing

```java
// ✅ Múltiplos critérios
list.sort(
    Comparator.comparing((Pessoa p) -> p.idade)
              .thenComparing(p -> p.nome)
);
```

### 3. nullsFirst/Last

```java
// ✅ Nulo-seguro
list.sort(Comparator.nullsFirst(String::compareTo));
```

---

## Resumo

**Collections.sort**: ordena List ordem natural Comparable compareTo ou custom Comparator compare. Assinatura sort(list) natural sort(list comparator) custom. TimSort híbrido Merge Insertion Java 7 O(n log n) garantido melhor O(n) ordenado estável preserva iguais adaptativo aproveita runs previsível.

**Comparable vs Comparator**: Comparable ordem natural 1 critério compareTo implementa classe Integer String Double. Comparator custom múltiplos critérios compare lambda parâmetro reverseOrder nullsFirst thenComparing flexível.

**List.sort**: Java 8 método instância list.sort(comparator) null natural moderna mesmo TimSort performance idêntica Collections.sort delega preferir sintaxe moderna.

**Performance**: 100K 50ms 1M 600ms ordenado 5ms O(n) adaptativo. Estável importante preserva ordem elementos iguais múltiplos critérios encadeados thenComparing. Nulo-seguro nullsFirst nullsLast.

**Decisão**: ordem natural sort(list) Comparable. Custom simples lambda a b. Múltiplos Comparator.comparing thenComparing. Moderna list.sort Java 8. Tradicional Collections.sort compatibilidade. TimSort garantia estável adaptativo melhor algoritmo geral propósito.

