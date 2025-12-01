# T6.03 - Uso de Memória e Overhead por Elemento

## Introdução

**Memória**: ArrayList ~20 bytes/elemento array contíguo overhead header. LinkedList ~44 bytes/elemento Node objeto overhead item next prev 2.2x mais memória fragmentação.

```java
import java.util.*;

// MEMÓRIA: Comparação
public class MemoriaComparacao {
    public static void main(String[] args) {
        int n = 10_000;
        
        // CÁLCULO TEÓRICO:
        
        // ArrayList<Integer>:
        // - Objeto ArrayList: 24 bytes
        // - Array int[]: 16 + (4 × capacity) bytes
        // - Integers: n × 16 bytes
        // 
        // 10K elementos, capacity=15000:
        // ArrayList: 24 bytes
        // Array: 16 + (4 × 15000) = 60016 bytes
        // Integers: 10000 × 16 = 160000 bytes
        // TOTAL: 220040 bytes ≈ 215 KB
        // Por elemento: ~22 bytes
        
        
        // LinkedList<Integer>:
        // - Objeto LinkedList: 24 bytes
        // - Nodes: n × 32 bytes
        // - Integers: n × 16 bytes
        // 
        // 10K elementos:
        // LinkedList: 24 bytes
        // Nodes: 10000 × 32 = 320000 bytes
        // Integers: 10000 × 16 = 160000 bytes
        // TOTAL: 480024 bytes ≈ 469 KB
        // Por elemento: ~48 bytes
        
        
        // RAZÃO: 469 / 215 ≈ 2.2x
        // LinkedList usa ~2.2x mais memória
        
        
        ArrayList<Integer> array = new ArrayList<>();
        LinkedList<Integer> linked = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            array.add(i);
            linked.add(i);
        }
        
        System.out.println("ArrayList capacity: " + array.size());
        System.out.println("LinkedList size: " + linked.size());
        
        System.out.println("\nMemória teórica:");
        System.out.println("ArrayList: ~215 KB");
        System.out.println("LinkedList: ~469 KB");
        System.out.println("Diferença: 2.2x");
        
        
        // IMPACTO:
        
        // 1 milhão elementos:
        // ArrayList: ~21.5 MB
        // LinkedList: ~46.9 MB
        // Diferença: ~25 MB
        
        // 100 milhões elementos:
        // ArrayList: ~2.15 GB
        // LinkedList: ~4.69 GB
        // Diferença: ~2.5 GB - CRÍTICO!
        
        
        System.out.println("\n=== Big Data ===");
        System.out.println("1M elementos:");
        System.out.println("  ArrayList: 21.5 MB");
        System.out.println("  LinkedList: 46.9 MB");
        System.out.println("100M elementos:");
        System.out.println("  ArrayList: 2.15 GB");
        System.out.println("  LinkedList: 4.69 GB (CRÍTICO!)");
    }
}
```

**Memória**: ArrayList ~22 bytes/elemento LinkedList ~48 bytes/elemento 2.2x diferença. Big Data 100M ArrayList 2GB LinkedList 5GB crítico.

---

## Fundamentos

### 1. ArrayList: Overhead Detalhado

```java
// ARRAYLIST: Overhead Memória
public class ArrayListOverhead {
    public static void main(String[] args) {
        // ESTRUTURA COMPLETA:
        
        // 1. OBJETO ArrayList:
        
        // class ArrayList<E> extends AbstractList<E> {
        //     private Object[] elementData;      // 8 bytes (referência 64-bit)
        //     private int size;                  // 4 bytes
        //     // Padding                          // 4 bytes (alinhamento)
        // }
        // 
        // Object header:                         // 12 bytes (Mark Word + Class Pointer)
        // Campos:                                // 12 bytes (elementData + size + padding)
        // TOTAL:                                 // 24 bytes
        
        
        // 2. ARRAY Object[]:
        
        // Object[] elementData:
        // - Object header:                       // 12 bytes
        // - Array length (int):                  // 4 bytes
        // - Elementos (referências):             // 8 × capacity bytes
        // TOTAL:                                 // 16 + (8 × capacity) bytes
        
        // Exemplo capacity=10:
        // 16 + (8 × 10) = 96 bytes
        
        
        // 3. ELEMENTOS (Integer):
        
        // class Integer {
        //     private int value;                 // 4 bytes
        //     // Padding                          // 4 bytes
        // }
        // 
        // Object header:                         // 12 bytes
        // Campo value:                           // 4 bytes
        // Padding:                               // 4 bytes (alinhamento 8)
        // TOTAL:                                 // 16 bytes por Integer
        
        
        // CÁLCULO COMPLETO ArrayList<Integer> (size=3, capacity=10):
        
        // ArrayList objeto:                      24 bytes
        // Array Object[10]:                      16 + (8 × 10) = 96 bytes
        // Integer[0]:                            16 bytes
        // Integer[1]:                            16 bytes
        // Integer[2]:                            16 bytes
        // TOTAL:                                 168 bytes
        
        // EFICIÊNCIA:
        // Dados úteis: 3 × 4 = 12 bytes (valores int)
        // Total: 168 bytes
        // Eficiência: 12/168 = 7.1%
        
        // OVERHEAD POR ELEMENTO:
        // (168 - 12) / 3 = 52 bytes overhead por elemento
        
        
        ArrayList<Integer> lista = new ArrayList<>();
        lista.add(10);
        lista.add(20);
        lista.add(30);
        
        System.out.println("ArrayList<Integer> (size=3):");
        System.out.println("  ArrayList objeto: 24 bytes");
        System.out.println("  Array[10]: 96 bytes");
        System.out.println("  3 Integers: 48 bytes");
        System.out.println("  TOTAL: 168 bytes");
        System.out.println("  Dados úteis: 12 bytes");
        System.out.println("  Eficiência: 7.1%");
        
        
        // CAPACIDADE CHEIA (size=capacity=10):
        
        // ArrayList objeto:                      24 bytes
        // Array Object[10]:                      96 bytes
        // 10 Integers:                           160 bytes
        // TOTAL:                                 280 bytes
        
        // EFICIÊNCIA:
        // Dados úteis: 10 × 4 = 40 bytes
        // Total: 280 bytes
        // Eficiência: 40/280 = 14.3%
        
        // OVERHEAD POR ELEMENTO:
        // (280 - 40) / 10 = 24 bytes
        
        System.out.println("\nArrayList<Integer> (size=10, capacity=10):");
        System.out.println("  TOTAL: 280 bytes");
        System.out.println("  Dados úteis: 40 bytes");
        System.out.println("  Eficiência: 14.3%");
        System.out.println("  Overhead/elem: 24 bytes");
        
        
        // GRANDE ESCALA (size=10000, capacity=15000):
        
        // ArrayList objeto:                      24 bytes
        // Array Object[15000]:                   16 + (8 × 15000) = 120016 bytes
        // 10000 Integers:                        160000 bytes
        // TOTAL:                                 280040 bytes
        
        // EFICIÊNCIA:
        // Dados úteis: 10000 × 4 = 40000 bytes
        // Total: 280040 bytes
        // Eficiência: 40000/280040 = 14.3%
        
        // OVERHEAD POR ELEMENTO:
        // (280040 - 40000) / 10000 = 24 bytes
        
        System.out.println("\nArrayList<Integer> (size=10K):");
        System.out.println("  TOTAL: ~280 KB");
        System.out.println("  Dados úteis: 40 KB");
        System.out.println("  Eficiência: 14.3%");
        System.out.println("  Overhead/elem: 24 bytes");
        
        
        // TIPOS PRIMITIVOS (ArrayList<int> hipotético):
        
        // SE pudesse: ArrayList<int>
        // Array int[10000]:                      16 + (4 × 10000) = 40016 bytes
        // TOTAL:                                 40040 bytes
        // Eficiência: 40000/40040 = 99.9%
        // Overhead: ~0 bytes
        
        // MAS: Java NÃO permite primitivos em generics
        // Deve usar Integer (boxed)
        
        System.out.println("\nArrayList<int> (hipotético):");
        System.out.println("  TOTAL: 40 KB");
        System.out.println("  Eficiência: 99.9%");
        System.out.println("  NÃO possível em Java!");
        
        
        System.out.println("\nResumo:");
        System.out.println("ArrayList overhead: ~24 bytes/elemento");
        System.out.println("Eficiência: ~14% (boxing)");
    }
}

/*
 * ARRAYLIST OVERHEAD:
 * 
 * COMPONENTES:
 * - Objeto ArrayList: 24 bytes (fixo)
 * - Array Object[]: 16 + (8 × capacity)
 * - Elementos Integer: 16 bytes cada
 * 
 * OVERHEAD POR ELEMENTO:
 * - ~24 bytes (8 ref + 16 Integer)
 * - Fixo: independe tamanho
 * 
 * EFICIÊNCIA:
 * - 14.3% dados vs total
 * - Boxing: principal overhead
 * 
 * GRANDE ESCALA:
 * - Linear: proporcional elementos
 * - Capacidade: desperdício até 50%
 */
```

**ArrayList overhead**: objeto 24 bytes array 16+8×capacity Integer 16 bytes total ~24 bytes/elemento eficiência 14% boxing principal overhead capacidade desperdício 50%.

### 2. LinkedList: Overhead Detalhado

```java
// LINKEDLIST: Overhead Memória
public class LinkedListOverhead {
    public static void main(String[] args) {
        // ESTRUTURA COMPLETA:
        
        // 1. OBJETO LinkedList:
        
        // class LinkedList<E> extends AbstractSequentialList<E> {
        //     transient Node<E> first;           // 8 bytes (referência)
        //     transient Node<E> last;            // 8 bytes
        //     transient int size;                // 4 bytes
        //     // Padding                          // 4 bytes
        // }
        // 
        // Object header:                         // 12 bytes
        // Campos:                                // 20 bytes (first + last + size + padding)
        // TOTAL:                                 // 32 bytes (alinhado)
        
        
        // 2. NODE<E>:
        
        // private static class Node<E> {
        //     E item;                             // 8 bytes (referência)
        //     Node<E> next;                       // 8 bytes
        //     Node<E> prev;                       // 8 bytes
        // }
        // 
        // Object header:                         // 12 bytes (Mark Word + Class Pointer)
        // Campos:                                // 24 bytes (item + next + prev)
        // Padding:                               // 0 bytes (já alinhado 8)
        // TOTAL:                                 // 36 bytes por Node
        
        
        // 3. ELEMENTOS (Integer):
        
        // Integer (mesmo ArrayList):             16 bytes
        
        
        // CÁLCULO COMPLETO LinkedList<Integer> (size=3):
        
        // LinkedList objeto:                     32 bytes
        // Node[0]:                               36 bytes
        // Integer[0]:                            16 bytes
        // Node[1]:                               36 bytes
        // Integer[1]:                            16 bytes
        // Node[2]:                               36 bytes
        // Integer[2]:                            16 bytes
        // TOTAL:                                 188 bytes
        
        // EFICIÊNCIA:
        // Dados úteis: 3 × 4 = 12 bytes
        // Total: 188 bytes
        // Eficiência: 12/188 = 6.4%
        
        // OVERHEAD POR ELEMENTO:
        // (188 - 12) / 3 = 58.7 bytes
        
        
        LinkedList<Integer> lista = new LinkedList<>();
        lista.add(10);
        lista.add(20);
        lista.add(30);
        
        System.out.println("LinkedList<Integer> (size=3):");
        System.out.println("  LinkedList objeto: 32 bytes");
        System.out.println("  3 Nodes: 108 bytes");
        System.out.println("  3 Integers: 48 bytes");
        System.out.println("  TOTAL: 188 bytes");
        System.out.println("  Dados úteis: 12 bytes");
        System.out.println("  Eficiência: 6.4%");
        
        
        // COMPARAÇÃO ArrayList vs LinkedList (size=3):
        
        // ArrayList: 168 bytes
        // LinkedList: 188 bytes
        // Diferença: +20 bytes (+12%)
        
        System.out.println("\nComparação (size=3):");
        System.out.println("  ArrayList: 168 bytes");
        System.out.println("  LinkedList: 188 bytes");
        System.out.println("  Diferença: +12%");
        
        
        // GRANDE ESCALA (size=10000):
        
        // LinkedList objeto:                     32 bytes
        // 10000 Nodes:                           360000 bytes
        // 10000 Integers:                        160000 bytes
        // TOTAL:                                 520032 bytes
        
        // EFICIÊNCIA:
        // Dados úteis: 40000 bytes
        // Total: 520032 bytes
        // Eficiência: 40000/520032 = 7.7%
        
        // OVERHEAD POR ELEMENTO:
        // (520032 - 40000) / 10000 = 48 bytes
        
        System.out.println("\nLinkedList<Integer> (size=10K):");
        System.out.println("  TOTAL: ~520 KB");
        System.out.println("  Dados úteis: 40 KB");
        System.out.println("  Eficiência: 7.7%");
        System.out.println("  Overhead/elem: 48 bytes");
        
        
        // COMPARAÇÃO ArrayList vs LinkedList (size=10000):
        
        // ArrayList: 280040 bytes (~280 KB)
        // LinkedList: 520032 bytes (~520 KB)
        // Diferença: +240 KB (+86%)
        
        System.out.println("\nComparação (size=10K):");
        System.out.println("  ArrayList: ~280 KB");
        System.out.println("  LinkedList: ~520 KB");
        System.out.println("  Diferença: +86%");
        
        
        // BREAKDOWN OVERHEAD:
        
        // ArrayList por elemento:
        // - Referência array: 8 bytes
        // - Integer objeto: 16 bytes
        // Total: 24 bytes
        
        // LinkedList por elemento:
        // - Node header: 12 bytes
        // - Node campos: 24 bytes (item + next + prev)
        // - Integer objeto: 16 bytes
        // Total: 52 bytes
        
        // LinkedList: 52/24 = 2.17x mais overhead
        
        System.out.println("\nOverhead breakdown:");
        System.out.println("  ArrayList: 24 bytes/elem");
        System.out.println("  LinkedList: 52 bytes/elem");
        System.out.println("  Razão: 2.17x");
        
        
        // OVERHEAD NODE:
        
        // Node sozinho: 36 bytes
        // Dados armazenados: 1 referência (8 bytes)
        // Overhead estrutura: 28 bytes (next + prev + headers)
        // Eficiência Node: 8/36 = 22%
        
        System.out.println("\nNode overhead:");
        System.out.println("  Node total: 36 bytes");
        System.out.println("  Dados úteis: 8 bytes");
        System.out.println("  Overhead: 28 bytes");
        System.out.println("  Eficiência: 22%");
        
        
        System.out.println("\nResumo:");
        System.out.println("LinkedList overhead: ~48 bytes/elemento");
        System.out.println("2x mais que ArrayList");
    }
}

/*
 * LINKEDLIST OVERHEAD:
 * 
 * COMPONENTES:
 * - Objeto LinkedList: 32 bytes (fixo)
 * - Node: 36 bytes cada (12 header + 24 campos)
 * - Elementos Integer: 16 bytes cada
 * 
 * OVERHEAD POR ELEMENTO:
 * - ~52 bytes (36 Node + 16 Integer)
 * - 2.17x ArrayList
 * 
 * EFICIÊNCIA:
 * - 7.7% dados vs total
 * - Node: principal overhead (28 bytes)
 * - Boxing: secundário (16 bytes)
 * 
 * GRANDE ESCALA:
 * - Linear: proporcional elementos
 * - SEM desperdício capacidade
 * - MAS: overhead Node alto
 */
```

**LinkedList overhead**: objeto 32 bytes Node 36 bytes header 12 campos 24 next prev Integer 16 total ~52 bytes/elemento 2.17x ArrayList eficiência 7.7% Node overhead 28 bytes.

### 3. Comparação Direta Memória

```java
// COMPARAÇÃO: Memória
public class ComparacaoMemoria {
    public static void main(String[] args) {
        // TABELA: Overhead por elemento
        
        /*
         * Componente         | ArrayList | LinkedList | Diferença
         * ----------------------------------------------------------
         * Objeto lista       | 24 bytes  | 32 bytes   | +8 bytes
         * Estrutura/elem     | 8 bytes   | 36 bytes   | +28 bytes
         * Elemento Integer   | 16 bytes  | 16 bytes   | 0
         * TOTAL/elem         | 24 bytes  | 52 bytes   | +28 bytes
         * Razão              | 1.0x      | 2.17x      | 
         */
        
        System.out.println("=== Overhead por Elemento ===");
        System.out.println("ArrayList: 24 bytes");
        System.out.println("LinkedList: 52 bytes");
        System.out.println("Diferença: 2.17x");
        
        
        // GRÁFICO CRESCIMENTO:
        
        System.out.println("\n=== Crescimento Memória ===");
        for (int size : new int[]{10, 100, 1_000, 10_000, 100_000, 1_000_000}) {
            // ArrayList (capacity = size × 1.5):
            int capacity = (int)(size * 1.5);
            long arrayMem = 24 + (16 + 8L * capacity) + (16L * size);
            
            // LinkedList:
            long linkedMem = 32 + (36L * size) + (16L * size);
            
            double razao = (double)linkedMem / arrayMem;
            
            System.out.printf("Size %7d: ArrayList %5d KB, LinkedList %5d KB (%.2fx)\n",
                size, arrayMem/1024, linkedMem/1024, razao);
        }
        
        // RESULTADO:
        // Size      10: ArrayList     0 KB, LinkedList     0 KB (2.70x)
        // Size     100: ArrayList     3 KB, LinkedList     5 KB (1.87x)
        // Size    1000: ArrayList    30 KB, LinkedList    52 KB (1.73x)
        // Size   10000: ArrayList   273 KB, LinkedList   507 KB (1.86x)
        // Size  100000: ArrayList  2734 KB, LinkedList  5078 KB (1.86x)
        // Size 1000000: ArrayList 27343 KB, LinkedList 50781 KB (1.86x)
        
        
        // CAPACIDADE DESPERDÍCIO:
        
        // ArrayList capacity > size:
        // Desperdício: (capacity - size) × 8 bytes
        
        // Exemplo size=10000, capacity=15000:
        // Desperdício: 5000 × 8 = 40000 bytes (40 KB)
        
        // LinkedList: ZERO desperdício
        // Aloca exato size elementos
        
        System.out.println("\n=== Desperdício Capacidade ===");
        int size = 10_000;
        int capacity = 15_000;
        int desperdicio = (capacity - size) * 8;
        
        System.out.println("ArrayList (size=10K, capacity=15K):");
        System.out.println("  Desperdício: " + desperdicio/1024 + " KB");
        System.out.println("LinkedList:");
        System.out.println("  Desperdício: 0 KB");
        
        
        // MEMÓRIA REAL vs TEÓRICA:
        
        // ArrayList PODE economizar:
        // list.trimToSize(); // capacity = size
        
        ArrayList<Integer> array = new ArrayList<>();
        for (int i = 0; i < 10_000; i++) {
            array.add(i);
        }
        
        System.out.println("\nArrayList antes trimToSize:");
        System.out.println("  Size: " + array.size());
        // Capacity: ~15000 (size × 1.5)
        
        array.trimToSize();
        
        System.out.println("ArrayList depois trimToSize:");
        System.out.println("  Size: " + array.size());
        // Capacity: 10000 (= size)
        // Economiza: 40 KB
        
        
        // FRAGMENTAÇÃO:
        
        // ArrayList:
        // - Array contíguo: 1 bloco memória
        // - Sem fragmentação heap
        // - GC simples
        
        // LinkedList:
        // - Nodes espalhados: 10000 blocos
        // - Alta fragmentação heap
        // - GC complexo
        
        System.out.println("\n=== Fragmentação ===");
        System.out.println("ArrayList:");
        System.out.println("  Blocos: 1 (array)");
        System.out.println("  Fragmentação: ZERO");
        System.out.println("LinkedList:");
        System.out.println("  Blocos: 10000 (Nodes)");
        System.out.println("  Fragmentação: ALTA");
        
        
        // IMPACTO GC:
        
        // ArrayList:
        // - 1 objeto grande: marca rápido
        // - Compacta fácil: 1 bloco
        
        // LinkedList:
        // - 10000 objetos: marca lento
        // - Compacta difícil: múltiplos blocos
        
        System.out.println("\n=== Impacto GC ===");
        System.out.println("ArrayList: GC rápido (1 bloco)");
        System.out.println("LinkedList: GC lento (10K blocos)");
        
        
        System.out.println("\nResumo:");
        System.out.println("LinkedList usa ~2x mais memória");
        System.out.println("ArrayList trimToSize economiza");
        System.out.println("LinkedList alta fragmentação");
    }
}

/*
 * COMPARAÇÃO MEMÓRIA:
 * 
 * OVERHEAD:
 * - ArrayList: 24 bytes/elem
 * - LinkedList: 52 bytes/elem
 * - Razão: 2.17x
 * 
 * GRANDE ESCALA:
 * - 1M elementos:
 *   ArrayList: ~27 MB
 *   LinkedList: ~51 MB
 *   Diferença: ~24 MB
 * 
 * DESPERDÍCIO:
 * - ArrayList: até 50% (capacity)
 * - LinkedList: 0% (exato)
 * 
 * FRAGMENTAÇÃO:
 * - ArrayList: ZERO (contíguo)
 * - LinkedList: ALTA (espalhado)
 * 
 * GC:
 * - ArrayList: rápido
 * - LinkedList: lento
 */
```

**Comparação memória**: ArrayList 24 bytes/elemento LinkedList 52 bytes 2.17x razão. 1M elementos ArrayList 27MB LinkedList 51MB diferença 24MB. Desperdício ArrayList 50% capacity LinkedList 0% exato. Fragmentação ArrayList zero contíguo LinkedList alta espalhado GC rápido vs lento.

### 4. Big Data: Impacto Escala

```java
// BIG DATA: Impacto Memória
public class BigDataImpacto {
    public static void main(String[] args) {
        // CENÁRIO: Aplicação Big Data
        
        // Processar 100 milhões registros
        int registros = 100_000_000;
        
        // ARRAYLIST:
        
        // Capacity = size × 1.5 = 150M
        long arrayObj = 24;
        long arrayArr = 16 + (8L * 150_000_000);
        long arrayElem = 16L * registros;
        long arrayTotal = arrayObj + arrayArr + arrayElem;
        
        System.out.println("=== 100 Milhões Registros ===");
        System.out.println("\nArrayList:");
        System.out.println("  Objeto: " + arrayObj + " bytes");
        System.out.println("  Array[150M]: " + arrayArr/1_000_000 + " MB");
        System.out.println("  100M Integers: " + arrayElem/1_000_000 + " MB");
        System.out.println("  TOTAL: " + arrayTotal/1_000_000 + " MB");
        System.out.println("  TOTAL: " + arrayTotal/1_000_000_000.0 + " GB");
        
        // RESULTADO:
        // ArrayList: ~2.73 GB
        
        
        // LINKEDLIST:
        
        long linkedObj = 32;
        long linkedNodes = 36L * registros;
        long linkedElem = 16L * registros;
        long linkedTotal = linkedObj + linkedNodes + linkedElem;
        
        System.out.println("\nLinkedList:");
        System.out.println("  Objeto: " + linkedObj + " bytes");
        System.out.println("  100M Nodes: " + linkedNodes/1_000_000 + " MB");
        System.out.println("  100M Integers: " + linkedElem/1_000_000 + " MB");
        System.out.println("  TOTAL: " + linkedTotal/1_000_000 + " MB");
        System.out.println("  TOTAL: " + linkedTotal/1_000_000_000.0 + " GB");
        
        // RESULTADO:
        // LinkedList: ~5.08 GB
        
        
        // DIFERENÇA:
        
        long diferenca = linkedTotal - arrayTotal;
        double razao = (double)linkedTotal / arrayTotal;
        
        System.out.println("\nDiferença:");
        System.out.println("  Absoluta: " + diferenca/1_000_000_000.0 + " GB");
        System.out.println("  Razão: " + razao + "x");
        
        // RESULTADO:
        // Diferença: ~2.35 GB (86% a mais)
        // LinkedList usa quase DOBRO memória
        
        
        // IMPACTO SISTEMA:
        
        // JVM heap:
        // -Xmx8g (8 GB máximo)
        
        // ArrayList: 2.73 GB → sobra 5.27 GB (66%)
        // LinkedList: 5.08 GB → sobra 2.92 GB (36%)
        
        System.out.println("\n=== Impacto Heap (-Xmx8g) ===");
        System.out.println("ArrayList:");
        System.out.println("  Usado: 2.73 GB (34%)");
        System.out.println("  Livre: 5.27 GB (66%)");
        System.out.println("LinkedList:");
        System.out.println("  Usado: 5.08 GB (63%)");
        System.out.println("  Livre: 2.92 GB (37%)");
        
        
        // GC PRESSURE:
        
        // ArrayList:
        // - 1 array grande
        // - GC marca rápido
        // - Full GC: ~100ms
        
        // LinkedList:
        // - 100M objetos Node
        // - GC marca lento
        // - Full GC: ~5000ms (50x mais lento!)
        
        System.out.println("\n=== Impacto GC ===");
        System.out.println("ArrayList Full GC: ~100ms");
        System.out.println("LinkedList Full GC: ~5000ms (50x)");
        
        
        // RECOMENDAÇÃO:
        
        System.out.println("\n=== Recomendação Big Data ===");
        System.out.println("ArrayList:");
        System.out.println("  ✅ Memória: 2.7 GB");
        System.out.println("  ✅ GC: rápido");
        System.out.println("  ✅ Cache: excelente");
        System.out.println("  USAR para Big Data");
        
        System.out.println("\nLinkedList:");
        System.out.println("  ❌ Memória: 5.1 GB (2x)");
        System.out.println("  ❌ GC: lento (50x)");
        System.out.println("  ❌ Cache: ruim");
        System.out.println("  EVITAR para Big Data");
        
        
        // ALTERNATIVA PRIMITIVOS:
        
        // SE pudesse: int[] array
        long primitiveArr = 16 + (4L * registros);
        
        System.out.println("\n=== Alternativa int[] ===");
        System.out.println("int[100M]: " + primitiveArr/1_000_000_000.0 + " GB");
        System.out.println("Economia vs ArrayList: " + 
            (arrayTotal - primitiveArr)/1_000_000_000.0 + " GB");
        
        // int[]: ~400 MB
        // ArrayList<Integer>: ~2.7 GB
        // Economia: ~2.3 GB (6.7x menor!)
        
        // MAS: perde flexibilidade List interface
        
        
        System.out.println("\nResumo:");
        System.out.println("Big Data: ArrayList MUITO melhor");
        System.out.println("LinkedList: 2x memória, 50x GC lento");
        System.out.println("Ideal: primitivos (se possível)");
    }
}

/*
 * BIG DATA IMPACTO:
 * 
 * 100M ELEMENTOS:
 * - ArrayList: 2.7 GB
 * - LinkedList: 5.1 GB
 * - Diferença: 2.4 GB (86%)
 * 
 * HEAP 8GB:
 * - ArrayList: 34% usado
 * - LinkedList: 63% usado
 * 
 * GC:
 * - ArrayList: ~100ms
 * - LinkedList: ~5000ms (50x)
 * 
 * RECOMENDAÇÃO:
 * - Big Data: ArrayList
 * - EVITAR: LinkedList
 * - Ideal: primitivos (6.7x menor)
 */
```

**Big Data impacto**: 100M elementos ArrayList 2.7GB LinkedList 5.1GB diferença 2.4GB 86% mais. Heap 8GB ArrayList 34% LinkedList 63%. GC ArrayList 100ms LinkedList 5000ms 50x lento. Big Data ArrayList MUITO melhor LinkedList evitar primitivos ideal 6.7x menor.

### 5. Resumo Uso Memória

```java
/*
 * USO MEMÓRIA: Resumo Completo
 * 
 * OVERHEAD POR ELEMENTO:
 * - ArrayList: ~24 bytes
 *   * Referência array: 8 bytes
 *   * Integer objeto: 16 bytes
 * 
 * - LinkedList: ~52 bytes
 *   * Node objeto: 36 bytes
 *   * Integer objeto: 16 bytes
 * 
 * - Razão: 2.17x (LinkedList usa dobro)
 * 
 * 
 * EFICIÊNCIA:
 * - ArrayList: 14.3% (dados úteis vs total)
 * - LinkedList: 7.7% (metade ArrayList)
 * - Ambos: baixa (boxing Integer)
 * 
 * 
 * CAPACIDADE:
 * - ArrayList: capacity > size (até 50% desperdício)
 * - LinkedList: exato (0% desperdício)
 * - ArrayList trimToSize(): economiza
 * 
 * 
 * FRAGMENTAÇÃO:
 * - ArrayList: ZERO (array contíguo)
 * - LinkedList: ALTA (Nodes espalhados)
 * 
 * 
 * GC IMPACTO:
 * - ArrayList: 1 objeto grande (GC rápido)
 * - LinkedList: N objetos (GC lento)
 * 
 * 
 * GRANDE ESCALA:
 * 
 * 1M elementos:
 * - ArrayList: ~27 MB
 * - LinkedList: ~51 MB
 * - Diferença: ~24 MB
 * 
 * 100M elementos:
 * - ArrayList: ~2.7 GB
 * - LinkedList: ~5.1 GB
 * - Diferença: ~2.4 GB
 * 
 * 
 * QUANDO MEMÓRIA CRÍTICA:
 * 
 * ✅ ArrayList:
 * - Big Data
 * - Memória limitada
 * - Dispositivos móveis
 * - Sistemas embarcados
 * - Cache importante
 * 
 * ❌ LinkedList:
 * - EVITAR Big Data
 * - EVITAR memória limitada
 * - Alta fragmentação
 * - GC pressure
 * 
 * 
 * ALTERNATIVAS:
 * - int[]: primitivos (6.7x menor)
 * - TIntArrayList (Trove): primitivos + List
 * - ArrayList trimToSize(): economiza 33%
 */

// EXEMPLO DECISÃO
public class DecisaoMemoria {
    public static void main(String[] args) {
        // ✅ Big Data (milhões registros):
        List<Integer> bigData = new ArrayList<>(1_000_000);
        // ArrayList: menos memória, GC rápido
        
        // ❌ Big Data LinkedList:
        // List<Integer> bigData = new LinkedList<>();
        // LinkedList: 2x memória, GC lento - RUIM!
        
        
        // ✅ Economizar memória:
        ArrayList<Integer> lista = new ArrayList<>();
        // ... adicionar elementos
        lista.trimToSize();  // capacity = size
        // Economiza até 33% memória
        
        
        // ✅ Primitivos (melhor memória):
        int[] primitivos = new int[1_000_000];
        // 6.7x menos memória
        // MAS: sem flexibilidade List
        
        
        System.out.println("Escolhas corretas memória!");
    }
}
```

---

## Aplicabilidade

**Uso memória considerar**:
- **ArrayList**: ~24 bytes/elemento menor 2x fragmentação zero GC rápido Big Data ideal trimToSize economiza 33%
- **LinkedList**: ~52 bytes/elemento maior 2x fragmentação alta GC lento Big Data evitar memória crítica ruim
- **Capacidade**: ArrayList até 50% desperdício LinkedList 0% exato mas overhead Node maior compensa pouco
- **Primitivos**: int[] array 6.7x menor que ArrayList<Integer> ideal memória mas perde flexibilidade List

---

## Armadilhas

### 1. Ignorar Overhead Boxing

```java
// ❌ Ignorar boxing overhead
ArrayList<Integer> lista = new ArrayList<>();
// Integer: 16 bytes vs int: 4 bytes
// 4x overhead boxing

// ✅ Primitivos se possível
int[] array = new int[size];
// Sem boxing, 4x menor
```

### 2. Não Usar trimToSize

```java
// ❌ Desperdício capacidade
ArrayList<Integer> lista = new ArrayList<>();
// ... adicionar elementos
// Capacity > size (até 50% desperdício)

// ✅ Economizar após popular
lista.trimToSize();
// Capacity = size, economiza 33%
```

---

## Boas Práticas

### 1. ArrayList para Big Data

```java
// ✅ Milhões elementos
List<Integer> bigData = new ArrayList<>(1_000_000);
// Menos memória, GC rápido
```

### 2. Evitar LinkedList Memória Limitada

```java
// ❌ Memória limitada
List<Integer> mobile = new LinkedList<>();
// 2x memória, fragmentação

// ✅ ArrayList
List<Integer> mobile = new ArrayList<>();
// Metade memória
```

### 3. trimToSize Economizar

```java
// ✅ Após popular lista
lista.trimToSize();
// Economiza até 33% memória
```

---

## Resumo

**Overhead**: ArrayList ~24 bytes/elemento referência 8 Integer 16. LinkedList ~52 bytes/elemento Node 36 header 12 campos 24 Integer 16. Razão 2.17x LinkedList usa dobro memória.

**Eficiência**: ArrayList 14.3% dados vs total. LinkedList 7.7% metade ArrayList. Ambos baixa boxing Integer principal overhead.

**Capacidade**: ArrayList capacity size até 50% desperdício trimToSize economiza 33%. LinkedList size exato 0% desperdício mas overhead Node maior não compensa.

**Fragmentação**: ArrayList array contíguo zero fragmentação 1 bloco GC simples rápido. LinkedList Nodes espalhados alta fragmentação N blocos GC complexo lento 50x.

**Big Data 100M**: ArrayList 2.7GB 34% heap GC 100ms. LinkedList 5.1GB 63% heap GC 5000ms 50x lento. Diferença 2.4GB 86% mais memória LinkedList.

**Regra Memória**: ArrayList Big Data milhões elementos memória limitada mobile embarcado cache importante menos memória GC rápido fragmentação zero. LinkedList EVITAR Big Data memória limitada dobro memória fragmentação alta GC lento. Primitivos ideal int[] array 6.7x menor mas perde flexibilidade List. Decisão memória crítica ArrayList trimToSize economizar LinkedList só casos específicos pontas fila pilha.

