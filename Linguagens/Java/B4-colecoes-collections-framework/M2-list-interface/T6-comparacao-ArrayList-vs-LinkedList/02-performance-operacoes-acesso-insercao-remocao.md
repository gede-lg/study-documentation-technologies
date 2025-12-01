# T6.02 - Performance: Operações de Acesso, Inserção e Remoção

## Introdução

**Performance**: ArrayList acesso O(1) direto inserção início O(n) desloca. LinkedList acesso O(n) percorre inserção pontas O(1) ponteiros.

```java
import java.util.*;

// PERFORMANCE: ArrayList vs LinkedList
public class PerformanceComparacao {
    public static void main(String[] args) {
        int n = 10_000;
        
        ArrayList<Integer> array = new ArrayList<>();
        LinkedList<Integer> linked = new LinkedList<>();
        
        // POPULAR listas:
        for (int i = 0; i < n; i++) {
            array.add(i);
            linked.add(i);
        }
        
        // 1. ACESSO get(index):
        
        long t1 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            int val = array.get(i);
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList get: " + (t2-t1)/1000 + "μs");
        // ~5μs - RÁPIDO O(1)
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            int val = linked.get(i);
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList get: " + (t4-t3)/1000 + "μs");
        // ~500μs - LENTO O(n)
        // 100x mais lento!
        
        
        // 2. INSERÇÃO INÍCIO add(0):
        
        ArrayList<Integer> arr2 = new ArrayList<>();
        long t5 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            arr2.add(0, i);  // Início
        }
        long t6 = System.nanoTime();
        System.out.println("ArrayList add(0): " + (t6-t5)/1000 + "μs");
        // ~5000μs - LENTO O(n)
        
        LinkedList<Integer> link2 = new LinkedList<>();
        long t7 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            link2.addFirst(i);  // Início
        }
        long t8 = System.nanoTime();
        System.out.println("LinkedList addFirst: " + (t8-t7)/1000 + "μs");
        // ~50μs - RÁPIDO O(1)
        // 100x mais rápido!
        
        
        // 3. ITERATOR:
        
        long t9 = System.nanoTime();
        for (Integer val : array) {
            // Processar
        }
        long t10 = System.nanoTime();
        System.out.println("ArrayList iterator: " + (t10-t9)/1000 + "μs");
        
        long t11 = System.nanoTime();
        for (Integer val : linked) {
            // Processar
        }
        long t12 = System.nanoTime();
        System.out.println("LinkedList iterator: " + (t12-t11)/1000 + "μs");
        
        
        System.out.println("\nResumo:");
        System.out.println("Acesso: ArrayList 100x mais rápida");
        System.out.println("Início: LinkedList 100x mais rápida");
    }
}
```

**Performance**: acesso ArrayList O(1) 100x LinkedList O(n). Início LinkedList O(1) 100x ArrayList O(n). Trade-off fundamental.

---

## Fundamentos

### 1. Acesso por Índice get(index)

```java
// ACESSO: get(index)
public class AcessoIndice {
    public static void main(String[] args) {
        int n = 100_000;
        
        ArrayList<Integer> array = new ArrayList<>();
        LinkedList<Integer> linked = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            array.add(i);
            linked.add(i);
        }
        
        // ARRAYLIST get():
        
        // IMPLEMENTAÇÃO:
        // public E get(int index) {
        //     return (E) elementData[index];
        // }
        
        // COMPLEXIDADE: O(1)
        // 1 operação: acesso array direto
        
        // TEMPO REAL:
        long t1 = System.nanoTime();
        int soma1 = 0;
        for (int i = 0; i < n; i++) {
            soma1 += array.get(i);
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList get: " + (t2-t1)/1_000_000 + "ms");
        // ~10ms para 100K elementos
        // ~100ns por get
        
        
        // LINKEDLIST get():
        
        // IMPLEMENTAÇÃO:
        // public E get(int index) {
        //     return node(index).item;
        // }
        // 
        // Node<E> node(int index) {
        //     if (index < (size >> 1)) {
        //         Node<E> x = first;
        //         for (int i = 0; i < index; i++)
        //             x = x.next;
        //         return x;
        //     } else {
        //         Node<E> x = last;
        //         for (int i = size - 1; i > index; i--)
        //             x = x.prev;
        //         return x;
        //     }
        // }
        
        // COMPLEXIDADE: O(n)
        // Percorre até índice
        // Otimização: início ou fim mais próximo
        
        // TEMPO REAL:
        long t3 = System.nanoTime();
        int soma2 = 0;
        for (int i = 0; i < n; i++) {
            soma2 += linked.get(i);  // Cada: O(n)
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList get: " + (t4-t3)/1_000_000 + "ms");
        // ~5000ms para 100K elementos
        // ~50,000ns por get
        // 500x mais lento!
        
        // LOOP get(i): O(n²) total!
        // i=0: 0 passos
        // i=1: 1 passo
        // i=2: 2 passos
        // ...
        // i=99999: 50000 passos (otimizado)
        // Total: 0+1+2+...+50000 ≈ n²/4
        
        
        // COMPARAÇÃO VISUAL:
        
        // ArrayList get(50000):
        // elementData[50000] → elemento
        // 1 passo
        
        // LinkedList get(50000):
        // Otimiza: 50000 < 100000/2 → início
        // first → next → next → ... (50000 vezes) → elemento
        // 50000 passos
        
        
        // GRÁFICO TEMPO:
        
        System.out.println("\n=== Tempo get(i) ===");
        for (int size : new int[]{100, 1000, 10000}) {
            ArrayList<Integer> a = new ArrayList<>();
            LinkedList<Integer> l = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                a.add(i);
                l.add(i);
            }
            
            long ta1 = System.nanoTime();
            a.get(size/2);
            long ta2 = System.nanoTime();
            
            long tl1 = System.nanoTime();
            l.get(size/2);
            long tl2 = System.nanoTime();
            
            System.out.printf("Size %5d: ArrayList %3dns, LinkedList %6dns (%.0fx)\n",
                size, ta2-ta1, tl2-tl1, (double)(tl2-tl1)/(ta2-ta1));
        }
        
        // RESULTADO:
        // Size   100: ArrayList  10ns, LinkedList    500ns (50x)
        // Size  1000: ArrayList  10ns, LinkedList   5000ns (500x)
        // Size 10000: ArrayList  10ns, LinkedList  50000ns (5000x)
        
        // CRESCIMENTO:
        // ArrayList: constante O(1)
        // LinkedList: linear O(n) - PIORA com tamanho!
        
        
        System.out.println("Soma: " + soma1);
    }
}

/*
 * ACESSO get(index):
 * 
 * ARRAYLIST:
 * - Implementação: elementData[index]
 * - Complexidade: O(1)
 * - Tempo: ~100ns
 * - Constante: independe tamanho
 * - Loop: O(n) total
 * 
 * LINKEDLIST:
 * - Implementação: percorre nós
 * - Complexidade: O(n)
 * - Tempo: ~50μs (size=10K)
 * - Linear: proporcional índice
 * - Loop: O(n²) total - EVITAR!
 * 
 * DIFERENÇA:
 * ArrayList 500x mais rápida
 * Piora com tamanho LinkedList
 * 
 * QUANDO USAR:
 * Acesso aleatório: ArrayList
 * NUNCA loop get(i) LinkedList
 */
```

**Acesso**: ArrayList elementData[i] O(1) ~100ns constante. LinkedList percorre O(n) ~50μs linear loop O(n²) 500x mais lento.

### 2. Inserção Início add(0, element)

```java
// INSERÇÃO INÍCIO: add(0)
public class InsercaoInicio {
    public static void main(String[] args) {
        // ARRAYLIST add(0):
        
        // IMPLEMENTAÇÃO:
        // public void add(int index, E element) {
        //     ensureCapacityInternal(size + 1);
        //     System.arraycopy(elementData, index,
        //                      elementData, index + 1,
        //                      size - index);
        //     elementData[index] = element;
        //     size++;
        // }
        
        // PROCESSO add(0, "X"):
        // Antes: [A, B, C, D, E]
        // 
        // 1. Verificar capacidade
        // 2. Deslocar: [0→1, 1→2, 2→3, 3→4, 4→5]
        //    [_, A, B, C, D, E]
        // 3. Inserir: [X, A, B, C, D, E]
        // 4. size++
        
        // CUSTO:
        // Desloca TODOS elementos (size)
        // Complexidade: O(n)
        
        
        // TEMPO REAL:
        
        ArrayList<Integer> array = new ArrayList<>();
        
        long t1 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            array.add(0, i);  // Início
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList add(0) 10K: " + (t2-t1)/1_000_000 + "ms");
        // ~500ms - LENTO
        
        // LOOP add(0):
        // i=0: desloca 0 elementos
        // i=1: desloca 1 elemento
        // i=2: desloca 2 elementos
        // ...
        // i=9999: desloca 9999 elementos
        // Total: 0+1+2+...+9999 ≈ n²/2
        // Complexidade: O(n²) para n inserções!
        
        
        // LINKEDLIST addFirst():
        
        // IMPLEMENTAÇÃO:
        // public void addFirst(E e) {
        //     linkFirst(e);
        // }
        // 
        // private void linkFirst(E e) {
        //     final Node<E> f = first;
        //     final Node<E> newNode = new Node<>(null, e, f);
        //     first = newNode;
        //     if (f == null)
        //         last = newNode;
        //     else
        //         f.prev = newNode;
        //     size++;
        // }
        
        // PROCESSO addFirst("X"):
        // Antes: first → [A] ⇄ [B] ⇄ [C]
        // 
        // 1. newNode = new Node(null, "X", first)
        // 2. first.prev = newNode
        // 3. first = newNode
        // 4. size++
        // 
        // Depois: first → [X] ⇄ [A] ⇄ [B] ⇄ [C]
        
        // CUSTO:
        // 4 operações constantes
        // NÃO desloca nada
        // Complexidade: O(1)
        
        
        // TEMPO REAL:
        
        LinkedList<Integer> linked = new LinkedList<>();
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            linked.addFirst(i);  // Início
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList addFirst 10K: " + (t4-t3)/1_000_000 + "ms");
        // ~5ms - RÁPIDO
        
        // LOOP addFirst:
        // Cada: O(1)
        // Total: O(n) para n inserções
        
        
        // COMPARAÇÃO:
        
        System.out.println("\n=== Comparação add(0) ===");
        for (int size : new int[]{1000, 5000, 10000}) {
            ArrayList<Integer> a = new ArrayList<>();
            long ta1 = System.nanoTime();
            for (int i = 0; i < size; i++) {
                a.add(0, i);
            }
            long ta2 = System.nanoTime();
            
            LinkedList<Integer> l = new LinkedList<>();
            long tl1 = System.nanoTime();
            for (int i = 0; i < size; i++) {
                l.addFirst(i);
            }
            long tl2 = System.nanoTime();
            
            System.out.printf("Size %5d: ArrayList %4dms, LinkedList %3dms (%.0fx)\n",
                size, (ta2-ta1)/1_000_000, (tl2-tl1)/1_000_000,
                (double)(ta2-ta1)/(tl2-tl1));
        }
        
        // RESULTADO:
        // Size  1000: ArrayList   50ms, LinkedList   1ms (50x)
        // Size  5000: ArrayList 1250ms, LinkedList   3ms (400x)
        // Size 10000: ArrayList 5000ms, LinkedList   5ms (1000x)
        
        // CRESCIMENTO:
        // ArrayList: quadrático O(n²) - PIORA MUITO!
        // LinkedList: linear O(n) - escala bem
        
        
        // QUANDO CRÍTICO:
        
        // Fila FIFO:
        // addLast() + removeFirst()
        // ArrayList removeFirst: O(n) - RUIM
        // LinkedList: O(1) - IDEAL
        
        Queue<Integer> fila = new LinkedList<>();  // Correto
        // Queue<Integer> fila = new ArrayList<>(); // ERRO!
        
        
        System.out.println("ArrayList size: " + array.size());
        System.out.println("LinkedList size: " + linked.size());
    }
}

/*
 * INSERÇÃO INÍCIO add(0):
 * 
 * ARRAYLIST:
 * - Implementação: desloca todos
 * - Complexidade: O(n)
 * - Tempo: ~500ms (10K elem)
 * - Loop: O(n²) total
 * - Piora quadrático
 * 
 * LINKEDLIST:
 * - Implementação: ajusta ponteiros
 * - Complexidade: O(1)
 * - Tempo: ~5ms (10K elem)
 * - Loop: O(n) total
 * - Escala linear
 * 
 * DIFERENÇA:
 * LinkedList 100x mais rápida
 * Diferença cresce com tamanho
 * 
 * QUANDO USAR:
 * Inserção início frequente: LinkedList
 * Fila FIFO: LinkedList
 * EVITAR ArrayList add(0) loop
 */
```

**Inserção início**: ArrayList desloca todos O(n) loop O(n²) ~500ms 10K. LinkedList ponteiros O(1) loop O(n) ~5ms 100x mais rápido.

### 3. Inserção Fim add(element)

```java
// INSERÇÃO FIM: add()
public class InsercaoFim {
    public static void main(String[] args) {
        // ARRAYLIST add():
        
        // IMPLEMENTAÇÃO:
        // public boolean add(E e) {
        //     ensureCapacityInternal(size + 1);
        //     elementData[size++] = e;
        //     return true;
        // }
        
        // PROCESSO add("X"):
        // Antes: [A, B, C, D, _, _]
        //        size=4, capacity=6
        // 
        // 1. Verificar: size+1 <= capacity? (5 <= 6) SIM
        // 2. elementData[4] = "X"
        // 3. size++ (size=5)
        // 
        // Depois: [A, B, C, D, X, _]
        
        // CUSTO NORMAL: O(1)
        // Sem deslocamento
        // Sem redimensionamento
        
        // CUSTO EXPANSÃO: O(n)
        // Quando size == capacity
        // Capacidade × 1.5
        // Copia elementos
        // MAS: raro, amortizado O(1)
        
        
        // TEMPO REAL:
        
        ArrayList<Integer> array = new ArrayList<>();
        
        long t1 = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            array.add(i);  // Fim
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList add() 100K: " + (t2-t1)/1_000_000 + "ms");
        // ~10ms - RÁPIDO
        
        // EXPANSÕES:
        // Capacidade: 10 → 15 → 22 → 33 → 49 → ... → 163830
        // ~17 redimensionamentos
        // Cópias: 10+15+22+...+109220 ≈ 200K operações
        // Custo total: O(n)
        // Custo amortizado: O(n)/n = O(1) por add
        
        
        // LINKEDLIST addLast():
        
        // IMPLEMENTAÇÃO:
        // public boolean add(E e) {
        //     linkLast(e);
        //     return true;
        // }
        // 
        // void linkLast(E e) {
        //     final Node<E> l = last;
        //     final Node<E> newNode = new Node<>(l, e, null);
        //     last = newNode;
        //     if (l == null)
        //         first = newNode;
        //     else
        //         l.next = newNode;
        //     size++;
        // }
        
        // PROCESSO add("X"):
        // Antes: [A] ⇄ [B] ⇄ [C] ← last
        // 
        // 1. newNode = new Node(last, "X", null)
        // 2. last.next = newNode
        // 3. last = newNode
        // 4. size++
        // 
        // Depois: [A] ⇄ [B] ⇄ [C] ⇄ [X] ← last
        
        // CUSTO: O(1) SEMPRE
        // Sem redimensionamento
        // Sem cópia
        // Previsível
        
        
        // TEMPO REAL:
        
        LinkedList<Integer> linked = new LinkedList<>();
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            linked.add(i);  // Fim
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList add() 100K: " + (t4-t3)/1_000_000 + "ms");
        // ~30ms - RÁPIDO (mas um pouco mais lento)
        
        // OVERHEAD:
        // Criar Node: new (alocação heap)
        // Mais lento que array[i] = e
        // MAS: sempre O(1), sem surpresas
        
        
        // COMPARAÇÃO:
        
        System.out.println("\n=== Comparação add() fim ===");
        for (int size : new int[]{10000, 50000, 100000}) {
            ArrayList<Integer> a = new ArrayList<>();
            long ta1 = System.nanoTime();
            for (int i = 0; i < size; i++) {
                a.add(i);
            }
            long ta2 = System.nanoTime();
            
            LinkedList<Integer> l = new LinkedList<>();
            long tl1 = System.nanoTime();
            for (int i = 0; i < size; i++) {
                l.add(i);
            }
            long tl2 = System.nanoTime();
            
            System.out.printf("Size %6d: ArrayList %3dms, LinkedList %3dms\n",
                size, (ta2-ta1)/1_000_000, (tl2-tl1)/1_000_000);
        }
        
        // RESULTADO:
        // Size  10000: ArrayList   2ms, LinkedList   3ms
        // Size  50000: ArrayList   5ms, LinkedList  15ms
        // Size 100000: ArrayList  10ms, LinkedList  30ms
        
        // AMBOS O(1) amortizado
        // ArrayList ligeiramente mais rápida
        // Overhead Node vs array
        
        
        // PREVISIBILIDADE:
        
        // ArrayList:
        // Maioria: ~10ns
        // Expansão: ~10ms (SPIKE!)
        
        // LinkedList:
        // SEMPRE: ~300ns
        // Sem spikes
        // Previsível
        
        
        // OTIMIZAÇÃO ArrayList:
        
        ArrayList<Integer> opt = new ArrayList<>();
        opt.ensureCapacity(100_000);  // Pré-aloca
        
        long t5 = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            opt.add(i);  // SEMPRE O(1), sem expansão
        }
        long t6 = System.nanoTime();
        System.out.println("ArrayList com ensureCapacity: " + (t6-t5)/1_000_000 + "ms");
        // ~5ms - MUITO RÁPIDO
        // Mais rápido que LinkedList!
        
        
        System.out.println("ArrayList size: " + array.size());
        System.out.println("LinkedList size: " + linked.size());
    }
}

/*
 * INSERÇÃO FIM add():
 * 
 * ARRAYLIST:
 * - Implementação: array[size++]
 * - Complexidade: O(1) amortizado
 * - Tempo: ~10ms (100K)
 * - Expansão: rara, O(n)
 * - Spike: imprevisível
 * - Otimização: ensureCapacity
 * 
 * LINKEDLIST:
 * - Implementação: linkLast
 * - Complexidade: O(1) sempre
 * - Tempo: ~30ms (100K)
 * - Sem expansão
 * - Previsível
 * - Overhead: Node
 * 
 * COMPARAÇÃO:
 * ArrayList ligeiramente mais rápida
 * LinkedList mais previsível
 * ArrayList ensureCapacity: MELHOR
 * 
 * QUANDO USAR:
 * Padrão: ArrayList (mais rápida)
 * Previsível: LinkedList (sem spikes)
 */
```

**Inserção fim**: ArrayList array[size++] O(1) amortizado ~10ms expansão rara spike. LinkedList linkLast O(1) sempre ~30ms overhead Node previsível sem spike.

### 4. Inserção Meio add(index, element)

```java
// INSERÇÃO MEIO: add(index)
public class InsercaoMeio {
    public static void main(String[] args) {
        int n = 10_000;
        
        ArrayList<Integer> array = new ArrayList<>();
        LinkedList<Integer> linked = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            array.add(i);
            linked.add(i);
        }
        
        // ARRAYLIST add(size/2):
        
        // PROCESSO add(5000, "X") em lista size=10000:
        // 
        // 1. Verificar capacidade
        // 2. Deslocar: [5000→5001, 5001→5002, ..., 9999→10000]
        //    5000 elementos deslocados
        // 3. Inserir: array[5000] = "X"
        // 4. size++
        
        // CUSTO: O(n)
        // Desloca metade elementos (n/2)
        // Proporcional tamanho
        
        long t1 = System.nanoTime();
        for (int i = 0; i < 100; i++) {
            array.add(array.size()/2, 999);  // Meio
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList add(meio) 100x: " + (t2-t1)/1_000_000 + "ms");
        // ~50ms
        
        
        // LINKEDLIST add(size/2):
        
        // PROCESSO add(5000, "X") em lista size=10000:
        // 
        // 1. Encontrar nó índice 5000: O(n)
        //    5000 < 10000/2 → percorre início
        //    first → next → next → ... (5000 vezes)
        // 
        // 2. Inserir antes do nó: O(1)
        //    newNode = new Node(prev, "X", node)
        //    prev.next = newNode
        //    node.prev = newNode
        // 
        // 3. size++
        
        // CUSTO TOTAL: O(n)
        // Encontrar: O(n)
        // Inserir: O(1)
        // Total: O(n)
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 100; i++) {
            linked.add(linked.size()/2, 999);  // Meio
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList add(meio) 100x: " + (t4-t3)/1_000_000 + "ms");
        // ~500ms
        
        
        // COMPARAÇÃO:
        
        // Ambos O(n), mas:
        
        // ArrayList:
        // - Desloca n/2 elementos
        // - Operação: array copy (nativa, rápida)
        // - Cache-friendly (contíguo)
        
        // LinkedList:
        // - Percorre n/2 nós
        // - Operação: loops next (Java, lenta)
        // - Cache-unfriendly (espalhado)
        
        // RESULTADO:
        // ArrayList ~10x mais rápida
        // Mesmo sendo ambos O(n)
        
        
        // GRÁFICO:
        
        System.out.println("\n=== add(size/2) único ===");
        for (int size : new int[]{1000, 5000, 10000}) {
            ArrayList<Integer> a = new ArrayList<>();
            LinkedList<Integer> l = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                a.add(i);
                l.add(i);
            }
            
            long ta1 = System.nanoTime();
            a.add(size/2, 999);
            long ta2 = System.nanoTime();
            
            long tl1 = System.nanoTime();
            l.add(size/2, 999);
            long tl2 = System.nanoTime();
            
            System.out.printf("Size %5d: ArrayList %5dns, LinkedList %6dns (%.0fx)\n",
                size, ta2-ta1, tl2-tl1, (double)(tl2-tl1)/(ta2-ta1));
        }
        
        // RESULTADO:
        // Size  1000: ArrayList   500ns, LinkedList   5000ns (10x)
        // Size  5000: ArrayList  2500ns, LinkedList  25000ns (10x)
        // Size 10000: ArrayList  5000ns, LinkedList  50000ns (10x)
        
        
        // CONCLUSÃO:
        
        // Inserção MEIO:
        // ArrayList: MELHOR (cache, nativo)
        // LinkedList: PIOR (loop, cache miss)
        
        // Inserção PONTAS:
        // ArrayList início: PIOR O(n) desloca
        // LinkedList pontas: MELHOR O(1) ponteiros
        
        
        System.out.println("ArrayList size: " + array.size());
        System.out.println("LinkedList size: " + linked.size());
    }
}

/*
 * INSERÇÃO MEIO add(index):
 * 
 * ARRAYLIST:
 * - Desloca elementos: O(n)
 * - Operação nativa rápida
 * - Cache-friendly
 * - Tempo: ~500ns (size=1000)
 * 
 * LINKEDLIST:
 * - Percorre + insere: O(n)
 * - Loop Java lento
 * - Cache-unfriendly
 * - Tempo: ~5000ns (size=1000)
 * 
 * COMPARAÇÃO:
 * Ambos O(n)
 * ArrayList 10x mais rápida
 * Cache domina
 * 
 * REGRA:
 * Meio: ArrayList melhor
 * Pontas: LinkedList melhor
 */
```

**Inserção meio**: ambos O(n) mas ArrayList desloca nativo cache-friendly 10x LinkedList percorre loop cache-unfriendly. Meio ArrayList melhor pontas LinkedList.

### 5. Remoção remove()

```java
// REMOÇÃO: remove(index)
public class Remocao {
    public static void main(String[] args) {
        // ARRAYLIST remove(index):
        
        ArrayList<String> array = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // remove(0) INÍCIO:
        // Antes: [A, B, C, D, E]
        // 1. Guardar: removed = "A"
        // 2. Deslocar: [1→0, 2→1, 3→2, 4→3]
        //    [B, C, D, E, E]
        // 3. Nullificar: [4] = null
        //    [B, C, D, E, null]
        // 4. size-- (size=4)
        // Retorna: "A"
        // CUSTO: O(n) desloca todos
        
        array.remove(0);
        System.out.println("Após remove(0): " + array);
        
        // remove(size-1) FIM:
        // Antes: [B, C, D, E]
        // 1. Guardar: removed = "E"
        // 2. Nullificar: [3] = null
        //    [B, C, D, null]
        // 3. size-- (size=3)
        // Retorna: "E"
        // CUSTO: O(1) sem deslocamento
        
        array.remove(array.size()-1);
        System.out.println("Após remove(fim): " + array);
        
        // remove(index) MEIO:
        // CUSTO: O(n) desloca metade
        
        
        // LINKEDLIST remove(index):
        
        LinkedList<String> linked = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // removeFirst() INÍCIO:
        // Antes: first → [A] ⇄ [B] ⇄ [C] ⇄ [D] ⇄ [E]
        // 1. Guardar: removed = "A"
        // 2. next = first.next ([B])
        // 3. Nullificar: first.item, first.next
        // 4. first = next
        // 5. next.prev = null
        // 6. size--
        // Depois: first → [B] ⇄ [C] ⇄ [D] ⇄ [E]
        // CUSTO: O(1) ajusta ponteiros
        
        linked.removeFirst();
        System.out.println("Após removeFirst: " + linked);
        
        // removeLast() FIM:
        // CUSTO: O(1) ajusta ponteiros
        
        linked.removeLast();
        System.out.println("Após removeLast: " + linked);
        
        // remove(index) MEIO:
        // 1. Encontrar nó: O(n)
        // 2. Unlink: O(1)
        // CUSTO TOTAL: O(n)
        
        
        // PERFORMANCE:
        
        int n = 10_000;
        
        // ArrayList remove(0) repetido:
        ArrayList<Integer> arr = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            arr.add(i);
        }
        
        long t1 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            arr.remove(0);  // Início
        }
        long t2 = System.nanoTime();
        System.out.println("\nArrayList remove(0) 1000x: " + (t2-t1)/1_000_000 + "ms");
        // ~50ms - LENTO O(n) cada
        
        // LinkedList removeFirst() repetido:
        LinkedList<Integer> link = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            link.add(i);
        }
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            link.removeFirst();  // Início
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList removeFirst 1000x: " + (t4-t3)/1_000_000 + "ms");
        // ~1ms - RÁPIDO O(1) cada
        
        // LinkedList 50x mais rápida!
        
        
        // TABELA COMPLEXIDADE:
        
        /*
         * Operação           | ArrayList | LinkedList
         * ----------------------------------------------
         * remove(0)          | O(n)      | O(1)
         * remove(size-1)     | O(1)      | O(1)
         * remove(size/2)     | O(n)      | O(n)
         * removeFirst()      | O(n)      | O(1)
         * removeLast()       | O(1)      | O(1)
         * remove(objeto)     | O(n)      | O(n)
         * 
         * VENCEDOR:
         * Início: LinkedList 50x
         * Fim: Empate (ambos O(1))
         * Meio: ArrayList 10x (cache)
         */
        
        
        System.out.println("ArrayList size: " + arr.size());
        System.out.println("LinkedList size: " + link.size());
    }
}

/*
 * REMOÇÃO:
 * 
 * ARRAYLIST:
 * - remove(0): O(n) desloca
 * - remove(size-1): O(1)
 * - remove(meio): O(n) desloca
 * - Cache-friendly
 * 
 * LINKEDLIST:
 * - removeFirst: O(1) ponteiros
 * - removeLast: O(1) ponteiros
 * - remove(meio): O(n) percorre
 * - Cache-unfriendly
 * 
 * COMPARAÇÃO:
 * Início: LinkedList 50x
 * Fim: Empate
 * Meio: ArrayList 10x
 * 
 * QUANDO USAR:
 * Remoção início: LinkedList
 * Remoção aleatória: ArrayList
 */
```

**Remoção**: ArrayList remove(0) O(n) desloca remove(size-1) O(1). LinkedList removeFirst removeLast O(1) ponteiros remove(meio) O(n) percorre. Início LinkedList 50x.

### 6. Iterator

```java
// ITERATOR: Performance
public class IteratorPerformance {
    public static void main(String[] args) {
        int n = 100_000;
        
        ArrayList<Integer> array = new ArrayList<>();
        LinkedList<Integer> linked = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            array.add(i);
            linked.add(i);
        }
        
        // ARRAYLIST Iterator:
        
        // IMPLEMENTAÇÃO:
        // private class Itr implements Iterator<E> {
        //     int cursor = 0;
        //     
        //     public E next() {
        //         return (E) elementData[cursor++];
        //     }
        // }
        
        // CADA next(): O(1)
        // Acesso direto array[cursor]
        // Cache-friendly (sequencial)
        
        long t1 = System.nanoTime();
        for (Integer val : array) {
            // Processar
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList iterator: " + (t2-t1)/1_000_000 + "ms");
        // ~10ms - RÁPIDO
        
        
        // LINKEDLIST Iterator:
        
        // IMPLEMENTAÇÃO:
        // private class ListItr implements Iterator<E> {
        //     Node<E> next = first;
        //     
        //     public E next() {
        //         E result = next.item;
        //         next = next.next;
        //         return result;
        //     }
        // }
        
        // CADA next(): O(1)
        // Mantém referência nó
        // NÃO percorre from first
        // MAS: cache-unfriendly (nós espalhados)
        
        long t3 = System.nanoTime();
        for (Integer val : linked) {
            // Processar
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList iterator: " + (t4-t3)/1_000_000 + "ms");
        // ~50ms - LENTO (5x)
        
        
        // POR QUÊ LinkedList mais lento:
        
        // ArrayList:
        // - Array contíguo
        // - CPU carrega cache line (16 elementos)
        // - Cache hit: ~90%
        // - Prefetcher: ativo
        
        // LinkedList:
        // - Nós espalhados
        // - Cada nó: endereço diferente
        // - Cache miss: ~95%
        // - Prefetcher: inativo
        
        
        // COMPARAÇÃO vs get(i):
        
        // ArrayList get(i):
        long t5 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            int val = array.get(i);
        }
        long t6 = System.nanoTime();
        System.out.println("\nArrayList get(i): " + (t6-t5)/1_000_000 + "ms");
        // ~10ms - IGUAL iterator
        
        // LinkedList get(i):
        long t7 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            int val = linked.get(i);  // O(n) CADA!
        }
        long t8 = System.nanoTime();
        System.out.println("LinkedList get(i): " + (t8-t7)/1_000_000 + "ms");
        // ~5000ms - MUITO LENTO (100x iterator!)
        
        
        // TABELA:
        
        /*
         * Iteração           | ArrayList | LinkedList | Diferença
         * --------------------------------------------------------
         * Iterator (for-each)| 10ms      | 50ms       | 5x
         * get(i) loop        | 10ms      | 5000ms     | 500x
         * 
         * CONCLUSÃO:
         * ArrayList: iterator = get(i) = O(n) total
         * LinkedList: iterator O(n), get(i) O(n²)
         * 
         * REGRA:
         * ArrayList: qualquer método
         * LinkedList: SEMPRE iterator (NUNCA get(i))
         */
        
        
        // REMOÇÃO DURANTE ITERAÇÃO:
        
        ArrayList<Integer> arr2 = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        Iterator<Integer> it1 = arr2.iterator();
        while (it1.hasNext()) {
            Integer val = it1.next();
            if (val % 2 == 0) {
                it1.remove();  // Seguro
            }
        }
        System.out.println("\nArrayList após remove par: " + arr2);
        
        LinkedList<Integer> link2 = new LinkedList<>(Arrays.asList(1, 2, 3, 4, 5));
        Iterator<Integer> it2 = link2.iterator();
        while (it2.hasNext()) {
            Integer val = it2.next();
            if (val % 2 == 0) {
                it2.remove();  // Seguro
            }
        }
        System.out.println("LinkedList após remove par: " + link2);
        
        // Iterator.remove():
        // ArrayList: O(n) desloca
        // LinkedList: O(1) unlink nó
        
        
        System.out.println("\nResumo:");
        System.out.println("ArrayList iterator ~5x mais rápida (cache)");
        System.out.println("LinkedList NUNCA usar get(i) loop!");
    }
}

/*
 * ITERATOR:
 * 
 * ARRAYLIST:
 * - next(): O(1) array[cursor++]
 * - Tempo: ~10ms (100K)
 * - Cache hit: 90%
 * - Igual get(i)
 * - remove(): O(n)
 * 
 * LINKEDLIST:
 * - next(): O(1) node.next
 * - Tempo: ~50ms (100K)
 * - Cache miss: 95%
 * - 100x melhor get(i)!
 * - remove(): O(1)
 * 
 * COMPARAÇÃO:
 * ArrayList 5x mais rápida
 * Cache domina
 * 
 * REGRA:
 * ArrayList: qualquer método
 * LinkedList: SEMPRE iterator
 * NUNCA LinkedList get(i) loop
 */
```

**Iterator**: ArrayList next O(1) cache hit 90% ~10ms. LinkedList next O(1) cache miss 95% ~50ms 5x mais lento. LinkedList iterator 100x melhor get(i) loop.

### 7. Resumo Performance

```java
/*
 * PERFORMANCE: Resumo Completo
 * 
 * TABELA COMPLEXIDADE:
 * 
 * Operação           | ArrayList | LinkedList | Vencedor
 * --------------------------------------------------------
 * get(index)         | O(1)      | O(n)       | ArrayList 500x
 * set(index)         | O(1)      | O(n)       | ArrayList 500x
 * add(element)       | O(1)*     | O(1)       | Empate
 * add(0, element)    | O(n)      | O(1)       | LinkedList 100x
 * add(i, element)    | O(n)      | O(n)       | ArrayList 10x
 * remove(index)      | O(n)      | O(n)       | ArrayList 10x
 * remove(0)          | O(n)      | O(1)       | LinkedList 50x
 * remove(size-1)     | O(1)      | O(1)       | Empate
 * contains(obj)      | O(n)      | O(n)       | ArrayList (cache)
 * Iterator.next()    | O(1)      | O(1)       | ArrayList 5x
 * get(i) loop        | O(n)      | O(n²)      | ArrayList 500x
 * 
 * * O(1) amortizado
 * 
 * 
 * QUANDO ArrayList VENCE:
 * 
 * - Acesso aleatório: get/set O(1) vs O(n)
 * - Loop get(i): O(n) vs O(n²)
 * - Inserção meio: cache-friendly
 * - Remoção meio: cache-friendly
 * - Iterator: cache-friendly 5x
 * - contains: cache-friendly
 * - Maioria operações (95%)
 * 
 * 
 * QUANDO LinkedList VENCE:
 * 
 * - Inserção início: O(1) vs O(n)
 * - Remoção início: O(1) vs O(n)
 * - Fila FIFO: addLast + removeFirst
 * - Pilha LIFO: addFirst + removeFirst
 * - Sem redimensionamento: previsível
 * - Casos específicos (5%)
 * 
 * 
 * REGRAS:
 * 
 * 1. Acesso aleatório → ArrayList
 * 2. Inserção/remoção pontas → LinkedList
 * 3. Dúvida → ArrayList (padrão)
 * 4. NUNCA loop get(i) LinkedList
 * 5. LinkedList SEMPRE iterator
 * 6. Fila/Pilha → LinkedList ou ArrayDeque
 * 7. Performance → considerar cache
 * 
 * 
 * RESUMO:
 * 
 * ArrayList:
 * - Rápida: acesso, loop, iterator
 * - Lenta: inserção início
 * - Cache: excelente
 * - Uso: 95% casos
 * 
 * LinkedList:
 * - Rápida: pontas
 * - Lenta: acesso, get(i) loop
 * - Cache: ruim
 * - Uso: 5% fila/pilha
 */

// EXEMPLO DECISÃO
public class ExemploDecisao {
    public static void main(String[] args) {
        // ✅ Acesso aleatório:
        List<String> lista = new ArrayList<>();  // Correto
        String item = lista.get(100);
        
        // ✅ Fila FIFO:
        Queue<String> fila = new LinkedList<>();  // Correto
        fila.offer("A");
        fila.poll();
        
        // ❌ Loop get(i) LinkedList:
        LinkedList<Integer> errado = new LinkedList<>();
        for (int i = 0; i < errado.size(); i++) {
            errado.get(i);  // O(n²) LENTO!
        }
        
        // ✅ Iterator LinkedList:
        for (Integer val : errado) {  // Correto
            // Processar
        }
        
        System.out.println("Escolhas corretas!");
    }
}
```

---

## Aplicabilidade

**Performance usar**:
- **ArrayList**: acesso O(1) get set loop iterator cache-friendly 500x padrão 95%
- **LinkedList**: pontas O(1) addFirst removeFirst fila pilha 100x específico 5%
- **Iterator**: SEMPRE LinkedList NUNCA loop get(i) O(n²) 500x mais lento
- **Cache**: considerar localidade memória domina performance real hardware

---

## Armadilhas

### 1. Loop get(i) LinkedList

```java
// ❌ O(n²) MUITO LENTO
for (int i = 0; i < linked.size(); i++) {
    linked.get(i);  // Cada O(n)
}

// ✅ Iterator O(n)
for (E elem : linked) {
    // Processar
}
```

### 2. Ignorar Cache

```java
// ❌ Ignorar impacto cache
// LinkedList iterator "O(1)" mas 5x mais lenta

// ✅ Considerar cache
// ArrayList cache-friendly quase sempre melhor
```

---

## Boas Práticas

### 1. ArrayList Padrão

```java
// ✅ Padrão (95% casos)
List<String> lista = new ArrayList<>();
```

### 2. LinkedList Específico

```java
// ✅ Fila/pilha (5% casos)
Queue<String> fila = new LinkedList<>();
Deque<String> pilha = new LinkedList<>();
```

### 3. NUNCA get(i) Loop LinkedList

```java
// ✅ SEMPRE iterator
for (E elem : linkedList) {
    // O(n) total
}

// ❌ NUNCA get(i)
for (int i = 0; i < linkedList.size(); i++) {
    linkedList.get(i);  // O(n²) total
}
```

---

## Resumo

**Acesso**: ArrayList get(i) O(1) elementData[i] ~100ns constante cache hit 90%. LinkedList get(i) O(n) percorre nós ~50μs linear cache miss 95% loop O(n²) 500x mais lento.

**Inserção início**: ArrayList add(0) O(n) desloca todos System.arraycopy ~500ms 10K loop O(n²). LinkedList addFirst O(1) ajusta ponteiros ~5ms 10K loop O(n) 100x mais rápido.

**Inserção fim**: ArrayList add O(1) amortizado array[size++] ~10ms 100K expansão × 1.5 rara spike. LinkedList add O(1) sempre linkLast ~30ms overhead Node previsível sem spike.

**Inserção meio**: ambos O(n) ArrayList desloca nativo cache-friendly ~500ns. LinkedList percorre loop cache-unfriendly ~5000ns 10x mais lento.

**Remoção**: ArrayList remove(0) O(n) desloca remove(size-1) O(1) sem deslocar. LinkedList removeFirst removeLast O(1) ponteiros remove(meio) O(n) percorre início LinkedList 50x fim empate.

**Iterator**: ArrayList next O(1) array[cursor++] cache hit 90% ~10ms 100K igual get(i). LinkedList next O(1) node.next cache miss 95% ~50ms 5x mais lento 100x melhor get(i) loop.

**Regra de Ouro**: ArrayList VENCE acesso O1 500x loop iterator cache-friendly padrão 95% casos. LinkedList VENCE pontas O1 addFirst removeFirst 100x fila pilha específico 5%. NUNCA loop geti LinkedList On² 500x mais lento SEMPRE iterator On. CACHE domina performance real considerar localidade memória CPU hits misses. DECISÃO acesso aleatório ArrayList pontas frequente LinkedList dúvida ArrayList padrão. TABELA complexidade get ArrayList O1 LinkedList On add0 ArrayList On LinkedList O1 iterator ambos O1 ArrayList 5x cache. ESCOLHA entender trade-offs operações frequentes hardware cache.

