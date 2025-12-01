# T6.01 - Estrutura Interna: Array vs Lista Encadeada

## Introdução

**ArrayList vs LinkedList**: ArrayList array dinâmico contíguo acesso direto. LinkedList lista duplamente encadeada nós ponteiros navegação bidirecional.

```java
import java.util.*;

// ESTRUTURAS INTERNAS: Array vs Lista Encadeada
public class EstruturaInterna {
    public static void main(String[] args) {
        // ARRAYLIST: array dinâmico
        ArrayList<String> array = new ArrayList<>();
        array.add("A");
        array.add("B");
        array.add("C");
        
        // ESTRUTURA INTERNA ArrayList:
        // elementData = ["A", "B", "C", null, null, null, null, null, null, null]
        // size = 3
        // Capacidade = 10 (padrão)
        // Contíguo na memória
        
        // ACESSO: array[index] direto O(1)
        String elem = array.get(1);  // elementData[1] = "B"
        
        
        // LINKEDLIST: lista duplamente encadeada
        LinkedList<String> linked = new LinkedList<>();
        linked.add("A");
        linked.add("B");
        linked.add("C");
        
        // ESTRUTURA INTERNA LinkedList:
        // first → [Node A] ⇄ [Node B] ⇄ [Node C] ← last
        //         prev=null    prev/next      next=null
        // size = 3
        // Nós espalhados na memória
        
        // ACESSO: percorre nós O(n)
        String elem2 = linked.get(1);  // first → next → item = "B"
        
        
        // DIFERENÇAS FUNDAMENTAIS:
        
        // ArrayList:
        // - Array contíguo
        // - Acesso direto índice
        // - Redimensiona quando cheio
        // - Cache-friendly
        
        // LinkedList:
        // - Nós espalhados
        // - Acesso percorrendo
        // - Sem redimensionamento
        // - Cache-unfriendly
        
        System.out.println("ArrayList: " + array);
        System.out.println("LinkedList: " + linked);
    }
}
```

**Estruturas**: ArrayList array contíguo direto O(1). LinkedList nós encadeados percorre O(n). Fundamentalmente diferentes.

---

## Fundamentos

### 1. ArrayList: Array Dinâmico

```java
// ESTRUTURA INTERNA ArrayList
public class ArrayListInterna {
    public static void main(String[] args) {
        // IMPLEMENTAÇÃO SIMPLIFICADA:
        
        class MyArrayList<E> {
            private Object[] elementData;  // Array interno
            private int size;              // Elementos atuais
            
            public MyArrayList() {
                elementData = new Object[10];  // Capacidade inicial
                size = 0;
            }
            
            public boolean add(E e) {
                // Redimensionar se necessário
                if (size == elementData.length) {
                    grow();
                }
                elementData[size++] = e;
                return true;
            }
            
            public E get(int index) {
                // Acesso direto O(1)
                return (E) elementData[index];
            }
            
            private void grow() {
                // Capacidade nova = capacidade atual × 1.5
                int newCapacity = elementData.length + (elementData.length >> 1);
                elementData = Arrays.copyOf(elementData, newCapacity);
            }
        }
        
        
        // CARACTERÍSTICAS:
        
        // 1. ARRAY CONTÍGUO:
        // Memória: [ref0][ref1][ref2][ref3][ref4]...
        // Endereços contínuos: 0x1000, 0x1004, 0x1008...
        
        // 2. ACESSO DIRETO:
        // get(2): elementData[2] → O(1)
        // Cálculo endereço: base + (index × 4 bytes)
        
        // 3. CAPACIDADE vs SIZE:
        ArrayList<Integer> lista = new ArrayList<>();
        // size = 0 (elementos)
        // capacity = 10 (espaços)
        
        lista.add(1);
        // size = 1
        // capacity = 10
        // elementData = [1, null, null, null, null, ...]
        
        for (int i = 2; i <= 10; i++) {
            lista.add(i);
        }
        // size = 10
        // capacity = 10 (cheio)
        
        lista.add(11);  // Trigger grow()
        // size = 11
        // capacity = 15 (10 × 1.5)
        // elementData = [1, 2, ..., 10, 11, null, null, null, null]
        
        
        // 4. REDIMENSIONAMENTO:
        
        // Quando: size == capacity
        // Nova capacidade: antiga × 1.5
        // Processo:
        // - Criar novo array (15 espaços)
        // - Copiar elementos (10 elementos)
        // - Substituir referência
        // Custo: O(n) copiar, mas raro (amortizado O(1))
        
        
        // 5. MEMÓRIA:
        
        // ArrayList com 3 elementos:
        // Objeto ArrayList: ~24 bytes
        //   - Object header: 12 bytes
        //   - elementData ref: 4 bytes
        //   - size int: 4 bytes
        //   - modCount int: 4 bytes
        // 
        // Array elementData (capacidade 10):
        //   - Array header: 16 bytes
        //   - 10 referências: 40 bytes
        //   Total: 56 bytes
        // 
        // 3 objetos Integer:
        //   - 3 × 16 bytes = 48 bytes
        // 
        // TOTAL: 24 + 56 + 48 = 128 bytes
        // Por elemento (usado): 128 / 3 ≈ 43 bytes
        // Eficiência: 48 / 128 ≈ 37% (dados / total)
        
        
        // 6. CACHE LOCALITY:
        
        // Array contíguo:
        // Memória: [A][B][C][D][E]...
        //          0x1000-0x1014 (contínuo)
        
        // CPU cache line: 64 bytes
        // Carrega: get(0) → cache [A][B][C][D]
        // Próximo: get(1) → JÁ em cache (hit)
        // Próximo: get(2) → JÁ em cache (hit)
        
        // Taxa hit: ~90-95%
        // Performance: EXCELENTE
        
        
        System.out.println("ArrayList size: " + lista.size());
    }
}

/*
 * ARRAYLIST ESTRUTURA:
 * 
 * CAMPOS:
 * Object[] elementData: array interno
 * int size: elementos atuais
 * 
 * CARACTERÍSTICAS:
 * - Contíguo memória
 * - Acesso direto O(1)
 * - Redimensiona capacidade × 1.5
 * - Cache-friendly
 * - Eficiência memória ~37%
 * 
 * VANTAGENS:
 * Acesso rápido
 * Cache excelente
 * Simples implementação
 * 
 * DESVANTAGENS:
 * Inserção início O(n)
 * Redimensionamento O(n)
 * Desperdício capacidade
 */
```

**ArrayList**: array Object[] elementData contíguo memória acesso direto elementData[i] O(1). Redimensiona capacidade × 1.5 quando cheio O(n) raro. Cache-friendly contíguo.

### 2. LinkedList: Lista Duplamente Encadeada

```java
// ESTRUTURA INTERNA LinkedList
public class LinkedListInterna {
    public static void main(String[] args) {
        // IMPLEMENTAÇÃO SIMPLIFICADA:
        
        class MyLinkedList<E> {
            private Node<E> first;  // Primeiro nó
            private Node<E> last;   // Último nó
            private int size;       // Quantidade elementos
            
            private static class Node<E> {
                E item;          // Elemento
                Node<E> next;    // Próximo nó
                Node<E> prev;    // Nó anterior
                
                Node(Node<E> prev, E element, Node<E> next) {
                    this.item = element;
                    this.next = next;
                    this.prev = prev;
                }
            }
            
            public MyLinkedList() {
                first = null;
                last = null;
                size = 0;
            }
            
            public boolean add(E e) {
                linkLast(e);
                return true;
            }
            
            private void linkLast(E e) {
                final Node<E> l = last;
                final Node<E> newNode = new Node<>(l, e, null);
                last = newNode;
                if (l == null)
                    first = newNode;
                else
                    l.next = newNode;
                size++;
            }
            
            public E get(int index) {
                // Percorrer lista O(n)
                Node<E> x = first;
                for (int i = 0; i < index; i++)
                    x = x.next;
                return x.item;
            }
        }
        
        
        // CARACTERÍSTICAS:
        
        // 1. LISTA DUPLAMENTE ENCADEADA:
        
        // Nós conectados prev/next:
        // first → [Node A] ⇄ [Node B] ⇄ [Node C] ← last
        //         prev=null                next=null
        
        // Cada Node:
        //   - item: elemento
        //   - next: próximo nó
        //   - prev: nó anterior
        
        
        // 2. ACESSO PERCORRENDO:
        
        LinkedList<String> lista = new LinkedList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // get(2):
        // 1. x = first (Node A)
        // 2. x = x.next (Node B)
        // 3. x = x.next (Node C)
        // 4. return x.item ("C")
        // Passos: 3 (O(n))
        
        // OTIMIZAÇÃO:
        // Se index < size/2: percorre do início
        // Senão: percorre do fim
        
        // get(2) em lista size=5:
        // 2 < 5/2 (2 < 2.5) → início
        // first → next → next (2 passos)
        
        // get(4) em lista size=5:
        // 4 >= 5/2 → fim
        // last → prev (1 passo)
        
        
        // 3. ADICIONAR FIM:
        
        // add("D"):
        // 1. newNode = new Node(last, "D", null)
        // 2. last.next = newNode
        // 3. last = newNode
        // 4. size++
        // Custo: O(1) - acesso direto last
        
        
        // 4. ADICIONAR INÍCIO:
        
        // addFirst("Z"):
        // 1. newNode = new Node(null, "Z", first)
        // 2. first.prev = newNode
        // 3. first = newNode
        // 4. size++
        // Custo: O(1) - acesso direto first
        
        
        // 5. MEMÓRIA:
        
        // LinkedList com 3 elementos:
        // Objeto LinkedList: ~24 bytes
        //   - Object header: 12 bytes
        //   - first ref: 4 bytes
        //   - last ref: 4 bytes
        //   - size int: 4 bytes
        // 
        // 3 Nodes:
        //   Node header: 12 bytes
        //   item ref: 4 bytes
        //   next ref: 4 bytes
        //   prev ref: 4 bytes
        //   padding: 4 bytes
        //   Total por Node: 28 bytes
        //   3 Nodes: 84 bytes
        // 
        // 3 objetos String:
        //   3 × ~40 bytes = 120 bytes
        // 
        // TOTAL: 24 + 84 + 120 = 228 bytes
        // Por elemento: 228 / 3 = 76 bytes
        // Eficiência: 120 / 228 ≈ 53% (dados / total)
        
        
        // 6. CACHE LOCALITY:
        
        // Nós espalhados:
        // Node A: 0x1000
        // Node B: 0x2500
        // Node C: 0x3A00
        // (endereços aleatórios)
        
        // CPU cache:
        // get(0): carrega Node A → miss, carrega da RAM
        // get(1): Node B diferente endereço → miss novamente
        // get(2): Node C diferente endereço → miss novamente
        
        // Taxa hit: ~5-10%
        // Performance: RUIM
        
        
        System.out.println("LinkedList size: " + lista.size());
    }
}

/*
 * LINKEDLIST ESTRUTURA:
 * 
 * CAMPOS:
 * Node<E> first: primeiro nó
 * Node<E> last: último nó
 * int size: quantidade
 * 
 * NODE:
 * E item: elemento
 * Node next: próximo
 * Node prev: anterior
 * 
 * CARACTERÍSTICAS:
 * - Nós espalhados memória
 * - Acesso percorre O(n)
 * - Sem redimensionamento
 * - Cache-unfriendly
 * - Eficiência memória ~53%
 * 
 * VANTAGENS:
 * Inserção pontas O(1)
 * Sem redimensionamento
 * Memória dinâmica
 * 
 * DESVANTAGENS:
 * Acesso lento O(n)
 * Cache ruim
 * Overhead nós (28 bytes)
 */
```

**LinkedList**: nós Node<E> item next prev espalhados memória. first/last ponteiros size quantidade. Acesso percorre O(n) otimiza início/fim. Cache-unfriendly.

### 3. Comparação Estruturas

```java
// COMPARAÇÃO ESTRUTURAS INTERNAS
public class ComparacaoEstruturas {
    public static void main(String[] args) {
        // REPRESENTAÇÃO VISUAL:
        
        // ARRAYLIST (array contíguo):
        // 
        // elementData:
        // ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
        // │  A  │  B  │  C  │  D  │  E  │null │null │null │null │null │
        // └─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
        //   [0]   [1]   [2]   [3]   [4]   [5]   [6]   [7]   [8]   [9]
        // 
        // size = 5
        // capacity = 10
        // Memória contígua: 0x1000 → 0x1028
        
        
        // LINKEDLIST (nós encadeados):
        // 
        // first                                              last
        //   ↓                                                 ↓
        // ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
        // │ Node A   │←──→│ Node B   │←──→│ Node C   │←──→│ Node D   │
        // │ item: A  │    │ item: B  │    │ item: C  │    │ item: D  │
        // │ prev:null│    │ prev: →A │    │ prev: →B │    │ prev: →C │
        // │ next: →B │    │ next: →C │    │ next: →D │    │ next:null│
        // └──────────┘    └──────────┘    └──────────┘    └──────────┘
        // 0x1000          0x2500          0x3A00          0x4200
        // 
        // size = 4
        // Nós espalhados memória aleatória
        
        
        // TABELA COMPARAÇÃO:
        
        /*
         * Aspecto          | ArrayList        | LinkedList
         * --------------------------------------------------------
         * Estrutura        | Array contíguo   | Nós encadeados
         * Campos           | elementData,size | first,last,size
         * Memória          | Contígua         | Espalhada
         * Acesso           | Direto O(1)      | Percorre O(n)
         * Inserção início  | Desloca O(n)     | Ponteiro O(1)
         * Inserção fim     | Direto O(1)*     | Ponteiro O(1)
         * Capacidade       | Redimensiona     | Dinâmica
         * Overhead/elem    | ~4 bytes ref     | ~28 bytes Node
         * Cache            | Excelente        | Ruim
         * Localidade       | Alta             | Baixa
         * Fragmentação     | Não              | Sim
         * 
         * * O(1) amortizado
         */
        
        
        // ACESSO ELEMENTO:
        
        ArrayList<String> array = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        LinkedList<String> linked = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // ArrayList get(2):
        // elementData[2] → "C"
        // 1 operação: O(1)
        
        // LinkedList get(2):
        // first → next → next → item
        // 3 operações: O(n)
        
        
        // INSERÇÃO INÍCIO:
        
        // ArrayList add(0, "Z"):
        // 1. Verificar capacidade
        // 2. Copiar [0→1, 1→2, 2→3, 3→4, 4→5] (5 elementos)
        // 3. elementData[0] = "Z"
        // Custo: O(n) desloca todos
        
        // LinkedList addFirst("Z"):
        // 1. newNode = new Node(null, "Z", first)
        // 2. first.prev = newNode
        // 3. first = newNode
        // Custo: O(1) ajusta ponteiros
        
        
        // MEMÓRIA TOTAL:
        
        int n = 1000;
        
        // ArrayList:
        // Objeto: 24 bytes
        // Array (capacidade 1000): 16 + 4000 = 4016 bytes
        // Elementos (1000 Integer): 16000 bytes
        // Total: ~20 KB
        // Por elemento: ~20 bytes
        
        // LinkedList:
        // Objeto: 24 bytes
        // Nodes (1000 × 28): 28000 bytes
        // Elementos (1000 Integer): 16000 bytes
        // Total: ~44 KB
        // Por elemento: ~44 bytes
        
        // DIFERENÇA: LinkedList ~2.2x mais memória
        
        
        System.out.println("Estruturas comparadas");
    }
}

/*
 * COMPARAÇÃO:
 * 
 * ARRAYLIST:
 * - Array contíguo
 * - Acesso O(1) direto
 * - Inserção início O(n)
 * - Memória ~20 bytes/elem
 * - Cache excelente
 * 
 * LINKEDLIST:
 * - Nós encadeados
 * - Acesso O(n) percorre
 * - Inserção pontas O(1)
 * - Memória ~44 bytes/elem
 * - Cache ruim
 * 
 * FUNDAMENTAL:
 * Estruturas completamente diferentes
 * Trade-offs opostos
 */
```

**Comparação**: ArrayList array contíguo acesso O(1) ~20 bytes cache excelente. LinkedList nós encadeados O(n) acesso ~44 bytes cache ruim. Trade-offs opostos.

### 4. Crescimento Capacidade

```java
// CRESCIMENTO: ArrayList vs LinkedList
public class Crescimento {
    public static void main(String[] args) {
        // ARRAYLIST: Redimensionamento
        
        ArrayList<Integer> array = new ArrayList<>();
        
        // CAPACIDADE INICIAL:
        // Construtor vazio: 10
        // Construtor(int): capacidade especificada
        // Construtor(Collection): collection.size()
        
        ArrayList<Integer> a1 = new ArrayList<>();           // 10
        ArrayList<Integer> a2 = new ArrayList<>(100);        // 100
        ArrayList<Integer> a3 = new ArrayList<>(List.of(1,2,3)); // 3
        
        
        // CRESCIMENTO AUTOMÁTICO:
        
        // add() quando size == capacity:
        // 1. Nova capacidade = antiga × 1.5
        // 2. Criar novo array
        // 3. Copiar elementos
        // 4. Substituir referência
        
        // EXEMPLO:
        // Capacidade: 10 → 15 → 22 → 33 → 49 → 73 → 109 → ...
        
        ArrayList<Integer> lista = new ArrayList<>();  // cap=10
        for (int i = 0; i < 11; i++) {
            lista.add(i);
        }
        // i=0-9: cap=10
        // i=10: grow() → cap=15
        // i=11: size=11, cap=15
        
        
        // CUSTO REDIMENSIONAMENTO:
        
        // Adicionar 1000 elementos:
        // Redimensionamentos: ~10 vezes
        // Cópias totais: 10+15+22+33+...+733 ≈ 2000 operações
        // Custo TOTAL: O(n) linear
        // Custo AMORTIZADO: O(1) por elemento
        
        // Prova:
        // n adições → k redimensionamentos
        // Total cópias: n + n/2 + n/4 + ... ≈ 2n
        // Custo total: O(n)
        // Custo por add: O(n)/n = O(1) amortizado
        
        
        // CONTROLE CAPACIDADE:
        
        // ensureCapacity(minCapacity):
        ArrayList<Integer> l1 = new ArrayList<>();
        l1.ensureCapacity(1000);  // Evita redimensionamentos
        for (int i = 0; i < 1000; i++) {
            l1.add(i);  // Sempre O(1), nunca grow()
        }
        
        // trimToSize():
        ArrayList<Integer> l2 = new ArrayList<>(1000);
        for (int i = 0; i < 100; i++) {
            l2.add(i);
        }
        // size=100, capacity=1000 (desperdício 900)
        l2.trimToSize();
        // size=100, capacity=100 (sem desperdício)
        
        
        // LINKEDLIST: Sem Redimensionamento
        
        LinkedList<Integer> linked = new LinkedList<>();
        
        // CARACTERÍSTICAS:
        // - Sem capacidade
        // - Cresce 1 nó por vez
        // - Sempre O(1) adicionar
        // - Nunca copia elementos
        // - Memória sob demanda
        
        // add():
        // 1. newNode = new Node(last, elemento, null)
        // 2. last.next = newNode
        // 3. last = newNode
        // 4. size++
        // SEMPRE 4 operações O(1)
        
        
        // COMPARAÇÃO CRESCIMENTO:
        
        int n = 100_000;
        
        // ArrayList SEM ensureCapacity:
        long t1 = System.nanoTime();
        ArrayList<Integer> arr1 = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            arr1.add(i);  // Alguns redimensionamentos
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList (sem ensure): " + (t2-t1)/1_000_000 + "ms");
        
        // ArrayList COM ensureCapacity:
        long t3 = System.nanoTime();
        ArrayList<Integer> arr2 = new ArrayList<>();
        arr2.ensureCapacity(n);  // Evita redimensionamentos
        for (int i = 0; i < n; i++) {
            arr2.add(i);  // Sempre O(1)
        }
        long t4 = System.nanoTime();
        System.out.println("ArrayList (com ensure): " + (t4-t3)/1_000_000 + "ms");
        
        // LinkedList:
        long t5 = System.nanoTime();
        LinkedList<Integer> link = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            link.add(i);  // Sempre O(1), sem redimensionamento
        }
        long t6 = System.nanoTime();
        System.out.println("LinkedList: " + (t6-t5)/1_000_000 + "ms");
        
        // RESULTADO:
        // ArrayList sem ensure: ~50ms (redimensionamentos)
        // ArrayList com ensure: ~10ms (sem redimensionamentos)
        // LinkedList: ~30ms (sem redimensionamentos, overhead nós)
    }
}

/*
 * CRESCIMENTO:
 * 
 * ARRAYLIST:
 * - Redimensiona capacidade × 1.5
 * - Copia elementos O(n)
 * - Custo amortizado O(1)
 * - ensureCapacity() otimiza
 * - trimToSize() economiza
 * 
 * LINKEDLIST:
 * - Sem redimensionamento
 * - 1 nó por vez
 * - Sempre O(1)
 * - Sem cópia elementos
 * - Memória sob demanda
 * 
 * VANTAGEM LinkedList:
 * Crescimento previsível O(1)
 * Sem cópias
 */
```

**Crescimento**: ArrayList redimensiona × 1.5 copia O(n) amortizado O(1) ensureCapacity otimiza. LinkedList sem redimensionamento 1 nó sempre O(1) memória sob demanda.

### 5. Fragmentação Memória

```java
// FRAGMENTAÇÃO: ArrayList vs LinkedList
public class Fragmentacao {
    public static void main(String[] args) {
        // ARRAYLIST: Não fragmenta
        
        ArrayList<String> array = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            array.add("Elem" + i);
        }
        
        // MEMÓRIA:
        // ArrayList objeto: 0x1000
        // elementData array: 0x2000
        // Elementos: 0x2000, 0x2004, 0x2008, 0x200C, 0x2010
        // 
        // Array CONTÍGUO: sem fragmentação
        // Cache-friendly: elementos próximos
        // Localidade: excelente
        
        
        // LINKEDLIST: Fragmenta muito
        
        LinkedList<String> linked = new LinkedList<>();
        for (int i = 0; i < 5; i++) {
            linked.add("Elem" + i);
        }
        
        // MEMÓRIA:
        // LinkedList objeto: 0x1000
        // Node 0: 0x3500 (alocado heap)
        // Node 1: 0x8A00 (alocado heap)
        // Node 2: 0x2100 (alocado heap)
        // Node 3: 0xF200 (alocado heap)
        // Node 4: 0x5800 (alocado heap)
        // 
        // Nós ESPALHADOS: alta fragmentação
        // Cache-unfriendly: nós distantes
        // Localidade: ruim
        
        
        // IMPACTO PERFORMANCE:
        
        int n = 10_000;
        
        // ArrayList: iteração sequencial
        ArrayList<Integer> arr = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            arr.add(i);
        }
        
        long t1 = System.nanoTime();
        long soma1 = 0;
        for (Integer num : arr) {  // Iterator
            soma1 += num;
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList iterator: " + (t2-t1)/1_000 + "μs");
        
        // CACHE HITS:
        // CPU carrega cache line (64 bytes ≈ 16 refs)
        // Elementos 0-15: 1 miss, 15 hits
        // Elementos 16-31: 1 miss, 15 hits
        // Taxa hit: ~94%
        
        
        // LinkedList: iteração sequencial
        LinkedList<Integer> link = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            link.add(i);
        }
        
        long t3 = System.nanoTime();
        long soma2 = 0;
        for (Integer num : link) {  // Iterator
            soma2 += num;
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList iterator: " + (t4-t3)/1_000 + "μs");
        
        // CACHE MISSES:
        // Cada nó: endereço diferente
        // Node 0: miss (carrega de RAM)
        // Node 1: miss (diferente endereço)
        // Node 2: miss (diferente endereço)
        // Taxa hit: ~5%
        
        // RESULTADO:
        // ArrayList: ~100μs
        // LinkedList: ~500μs (5x mais lento)
        
        
        // GARBAGE COLLECTION:
        
        // ArrayList remove():
        // 1. elementData[i] = null
        // 2. Desloca elementos
        // GC: 1 objeto removido
        
        // LinkedList remove():
        // 1. node.prev.next = node.next
        // 2. node.next.prev = node.prev
        // 3. node.item = null
        // 4. node.next = null
        // 5. node.prev = null
        // GC: 1 Node + overhead
        
        // LinkedList:
        // - Mais objetos para GC (nodes)
        // - Mais fragmentação heap
        // - Mais pausas GC
        
        
        // COMPACTAÇÃO HEAP:
        
        // ArrayList:
        // Elementos contíguos → fácil compactar
        // Move array inteiro → rápido
        
        // LinkedList:
        // Nós espalhados → difícil compactar
        // Move nós individualmente → lento
        
        
        System.out.println("Soma1: " + soma1);
        System.out.println("Soma2: " + soma2);
    }
}

/*
 * FRAGMENTAÇÃO:
 * 
 * ARRAYLIST:
 * - Contíguo
 * - Sem fragmentação
 * - Cache hit ~94%
 * - GC simples
 * - Compacta fácil
 * 
 * LINKEDLIST:
 * - Espalhado
 * - Alta fragmentação
 * - Cache hit ~5%
 * - GC complexo (nós)
 * - Compacta difícil
 * 
 * IMPACTO:
 * Iterator LinkedList ~5x mais lento
 * Mesmo sendo O(1) cada
 * Cache miss domina performance
 */
```

**Fragmentação**: ArrayList contíguo sem fragmentação cache hit 94% GC simples. LinkedList espalhado alta fragmentação cache hit 5% GC complexo 5x mais lento.

### 6. Acesso Memória Real

```java
// ACESSO MEMÓRIA: Padrões reais
public class AcessoMemoria {
    public static void main(String[] args) {
        // CPU CACHE HIERARCHY:
        // 
        // L1 cache: ~1ns (32-64 KB)
        // L2 cache: ~3ns (256-512 KB)
        // L3 cache: ~12ns (4-16 MB)
        // RAM: ~100ns (GB)
        // 
        // Cache line: 64 bytes
        // Prefetcher: carrega próximas linhas
        
        
        // ARRAYLIST: Sequential access
        
        ArrayList<Integer> array = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            array.add(i);
        }
        
        // PADRÃO ACESSO:
        // get(0): RAM miss → carrega cache line [0-15]
        // get(1): L1 hit (já carregado)
        // get(2): L1 hit
        // ...
        // get(15): L1 hit
        // get(16): L1/L2 miss → carrega [16-31]
        // get(17): L1 hit
        
        // PREFETCHER:
        // Detecta padrão sequencial
        // Pré-carrega próximas cache lines
        // get(32): já em L2 (prefetched)
        
        // PERFORMANCE:
        // 10% misses RAM (~100ns)
        // 90% hits L1 (~1ns)
        // Média: ~10ns por acesso
        
        long t1 = System.nanoTime();
        for (int i = 0; i < array.size(); i++) {
            int val = array.get(i);
        }
        long t2 = System.nanoTime();
        System.out.println("ArrayList sequential: " + (t2-t1) + "ns total");
        // ~10,000ns (10μs) para 1000 elementos
        // ~10ns por elemento
        
        
        // LINKEDLIST: Random access pattern
        
        LinkedList<Integer> linked = new LinkedList<>();
        for (int i = 0; i < 1000; i++) {
            linked.add(i);
        }
        
        // PADRÃO ACESSO:
        // get(0): RAM miss → carrega Node 0 (0x1000)
        // get(1): RAM miss → Node 1 (0x3500) diferente!
        // get(2): RAM miss → Node 2 (0x8A00) diferente!
        // get(3): RAM miss → Node 3 (0x2100) diferente!
        
        // SEM PREFETCHER:
        // Não detecta padrão (endereços aleatórios)
        // Não pré-carrega
        
        // PERFORMANCE:
        // 95% misses RAM (~100ns)
        // 5% hits cache (~10ns)
        // Média: ~95ns por acesso
        
        long t3 = System.nanoTime();
        for (int i = 0; i < linked.size(); i++) {
            int val = linked.get(i);
        }
        long t4 = System.nanoTime();
        System.out.println("LinkedList sequential: " + (t4-t3) + "ns total");
        // ~95,000ns (95μs) para 1000 elementos
        // ~95ns por elemento
        // 10x mais lento!
        
        
        // ITERATOR: Melhora LinkedList
        
        // ArrayList iterator:
        long t5 = System.nanoTime();
        for (Integer val : array) {
            // Processar
        }
        long t6 = System.nanoTime();
        System.out.println("ArrayList iterator: " + (t6-t5) + "ns");
        // ~10,000ns (igual get)
        
        // LinkedList iterator:
        long t7 = System.nanoTime();
        for (Integer val : linked) {
            // Processar
        }
        long t8 = System.nanoTime();
        System.out.println("LinkedList iterator: " + (t8-t7) + "ns");
        // ~50,000ns (50μs)
        // Melhor que get (95μs) mas pior que ArrayList (10μs)
        
        // POR QUÊ iterator melhor:
        // Iterator mantém referência node.next
        // Não recalcula from first
        // Mas ainda cache miss cada nó
        
        
        // MEMÓRIA BANDWIDTH:
        
        // ArrayList:
        // Lê array contíguo sequencialmente
        // Usa memória bandwidth eficientemente
        // ~10 GB/s (DDR4)
        
        // LinkedList:
        // Lê nós aleatoriamente
        // Desperdiça memória bandwidth
        // ~1 GB/s (latência domina)
        
        
        System.out.println("\nResumo:");
        System.out.println("ArrayList ~10x mais rápida (cache)");
        System.out.println("LinkedList sofre cache misses");
    }
}

/*
 * ACESSO MEMÓRIA:
 * 
 * ARRAYLIST:
 * - Cache hit 90%
 * - Prefetcher ativo
 * - ~10ns por elemento
 * - Bandwidth eficiente
 * 
 * LINKEDLIST:
 * - Cache miss 95%
 * - Sem prefetcher
 * - ~95ns por elemento
 * - Bandwidth desperdiçado
 * 
 * DIFERENÇA:
 * ~10x mais lento
 * Mesmo operação O(1)
 * Cache domina performance
 */
```

**Acesso memória**: ArrayList cache hit 90% prefetcher ~10ns. LinkedList cache miss 95% sem prefetcher ~95ns. 10x mais lento cache domina.

### 7. Resumo Estruturas

```java
/*
 * ESTRUTURA INTERNA: Resumo
 * 
 * ARRAYLIST:
 * 
 * ESTRUTURA:
 * Object[] elementData: array interno
 * int size: elementos atuais
 * Capacidade: length array
 * 
 * MEMÓRIA:
 * - Contígua sequencial
 * - Acesso: base + index × 4
 * - Overhead: ~4 bytes/elemento
 * - Eficiência: ~37%
 * 
 * CRESCIMENTO:
 * - Redimensiona × 1.5
 * - Copia elementos O(n)
 * - Amortizado O(1)
 * - ensureCapacity() otimiza
 * 
 * CACHE:
 * - Hit rate: ~90-95%
 * - Prefetcher: ativo
 * - Bandwidth: eficiente
 * - Performance: excelente
 * 
 * 
 * LINKEDLIST:
 * 
 * ESTRUTURA:
 * Node<E> first: primeiro
 * Node<E> last: último
 * int size: quantidade
 * Node: item, next, prev
 * 
 * MEMÓRIA:
 * - Espalhada aleatória
 * - Acesso: percorre ponteiros
 * - Overhead: ~28 bytes/Node
 * - Eficiência: ~53%
 * 
 * CRESCIMENTO:
 * - Sem redimensionamento
 * - 1 nó por vez
 * - Sempre O(1)
 * - Memória sob demanda
 * 
 * CACHE:
 * - Hit rate: ~5-10%
 * - Prefetcher: inativo
 * - Bandwidth: desperdiçado
 * - Performance: ruim
 * 
 * 
 * COMPARAÇÃO:
 * 
 * Aspecto       | ArrayList | LinkedList
 * ----------------------------------------
 * Estrutura     | Array     | Nós
 * Memória       | Contígua  | Espalhada
 * Acesso        | O(1)      | O(n)
 * Overhead      | 4 bytes   | 28 bytes
 * Cache hit     | 90%       | 5%
 * Fragmentação  | Não       | Sim
 * Redimensiona  | Sim       | Não
 * 
 * FUNDAMENTAL:
 * Completamente diferentes
 * Trade-offs opostos
 * Escolha depende uso
 */

// EXEMPLO FINAL
public class ExemploFinal {
    public static void main(String[] args) {
        // ArrayList: array contíguo
        ArrayList<String> array = new ArrayList<>();
        // Interno: Object[] elementData
        
        // LinkedList: nós encadeados
        LinkedList<String> linked = new LinkedList<>();
        // Interno: Node first, Node last
        
        // DIFERENÇA FUNDAMENTAL:
        // Array vs Lista Encadeada
        
        System.out.println("Estruturas diferentes!");
    }
}
```

---

## Aplicabilidade

**Estruturas usar**:
- **ArrayList**: acesso aleatório frequente get(i) O(1) direto cache excelente memória eficiente padrão
- **LinkedList**: inserção/remoção pontas frequente addFirst removeFirst O(1) fila pilha sem redimensionamento
- **Comparar**: entender estruturas internas trade-offs escolher adequada cada caso
- **Cache**: considerar localidade memória performance real CPU cache hits misses

---

## Armadilhas

### 1. Ignorar Cache Locality

```java
// ❌ Ignorar impacto cache
// LinkedList "O(1)" mas 10x mais lenta cache miss

// ✅ Considerar cache
// ArrayList melhor maioria casos cache hit
```

### 2. Confundir Capacidade Size

```java
// ❌ Confundir
ArrayList<Integer> lista = new ArrayList<>(100);
// capacity=100, size=0 (vazio!)

// ✅ Correto
// capacity: espaços disponíveis
// size: elementos atuais
```

---

## Boas Práticas

### 1. Visualizar Estrutura Mental

```java
// ✅ Mentalizar estrutura
// ArrayList: array contíguo [A][B][C]
// LinkedList: nós [A]→[B]→[C]
```

### 2. Considerar Hardware

```java
// ✅ Cache-friendly
// ArrayList: contíguo
// LinkedList: espalhado (cache miss)
```

---

## Resumo

**ArrayList**: array Object[] elementData contíguo memória size elementos capacity espaços. Acesso direto elementData[index] O(1) cálculo base + index × 4 bytes. Redimensiona capacidade × 1.5 quando size == capacity copia elementos O(n) raro amortizado O(1). ensureCapacity pré-aloca trimToSize economiza. Cache-friendly contíguo cache hit 90-95% prefetcher ativo ~10ns elemento. Overhead ~4 bytes referência eficiência 37%. Sem fragmentação GC simples compactação fácil.

**LinkedList**: nós Node<E> item next prev espalhados memória first last ponteiros size quantidade. Acesso percorre first.next.next O(n) otimiza índice < size/2 início senão fim. Crescimento 1 nó por vez sempre O(1) sem redimensionamento sem cópia memória sob demanda. Cache-unfriendly espalhado cache miss 95% sem prefetcher ~95ns elemento 10x mais lento. Overhead ~28 bytes Node header campos eficiência 53%. Alta fragmentação GC complexo compactação difícil.

**Comparação estruturas**: ArrayList array contíguo acesso O(1) direto cache 90% overhead 4 bytes sem fragmentação redimensiona. LinkedList nós encadeados acesso O(n) percorre cache 5% overhead 28 bytes fragmenta sem redimensionar. Completamente diferentes trade-offs opostos.

**Crescimento**: ArrayList redimensiona × 1.5 copia O(n) custo amortizado O(1) ensureCapacity otimiza evita redimensionamentos. LinkedList sem redimensionamento 1 nó sempre O(1) memória sob demanda sem cópia previsível.

**Cache memória**: CPU L1 1ns L2 3ns L3 12ns RAM 100ns cache line 64 bytes prefetcher. ArrayList sequential cache hit 90% prefetcher ativo ~10ns bandwidth eficiente. LinkedList random cache miss 95% sem prefetcher ~95ns bandwidth desperdiçado 10x mais lento. Iterator LinkedList ~50ns melhor get 95ns mas pior ArrayList 10ns cache domina performance.

**Regra de Ouro**: ArrayList ARRAY CONTÍGUO acesso direto O1 elementData[index] cache hit 90% overhead 4 bytes sem fragmentação redimensiona × 1.5 copiar On amortizado O1 ensureCapacity otimiza. LinkedList NÓS ENCADEADOS percorre On first next prev cache miss 95% overhead 28 bytes fragmenta sem redimensionar 1 nó O1 memória sob demanda. ESTRUTURAS fundamentalmente diferentes array vs lista encadeada trade-offs OPOSTOS acesso vs pontas cache vs flexibilidade. ESCOLHA ArrayList PADRÃO 95% casos acesso cache LinkedList ESPECIAL fila pilha pontas. CACHE DOMINA performance real considerar hardware localidade memória CPU hits misses bandwidth. VISUALIZAR mentalmente array contíguo [A][B][C] vs nós [A]→[B]→[C] entender diferenças.

