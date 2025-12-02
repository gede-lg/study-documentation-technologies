# Classes de Implementação Comuns: ArrayList, LinkedList, HashSet, TreeSet, HashMap, LinkedHashMap, TreeMap, PriorityQueue

1. **Introdução**
    - **Visão Geral:**
    As coleções da Java Collections Framework (JCF) fornecem classes prontas para armazenamento e manipulação de grupos de objetos. Dentre elas, as *classes de implementação comuns* — como `ArrayList`, `LinkedList`, `HashSet`, `TreeSet`, `HashMap`, `LinkedHashMap`, `TreeMap` e `PriorityQueue` — são amplamente usadas no dia a dia do desenvolvedor Java.
    - **Relevância:**
    Escolher a estrutura de dados apropriada impacta diretamente a eficiência (tempo e espaço) da aplicação. Entender diferenças de implementação, características de ordenação e performance de cada classe é fundamental para escrever código robusto e performático.
    - **Definições Fundamentais:**
        - **Tema Principal:** “Classes de Implementação Comuns” da JCF — ou seja, classes concretas que realizam internamente as interfaces `List`, `Set`, `Map` e `Queue`.
        - **Subtemas:**
            - *Listas:* `ArrayList`, `LinkedList`
            - *Conjuntos (Sets):* `HashSet`, `TreeSet`
            - *Mapas (Maps):* `HashMap`, `LinkedHashMap`, `TreeMap`
            - *Filas com Prioridade:* `PriorityQueue`
        - **Para que servem:** organizar, buscar, inserir e remover elementos segundo requisitos de ordem, performance e complexidade de cada estrutura.

---

1. **Sumário**
    1. Listas
        - 1.1 ArrayList
        - 1.2 LinkedList
    2. Conjuntos (Sets)
        - 2.1 HashSet
        - 2.2 TreeSet
    3. Mapas (Maps)
        - 3.1 HashMap
        - 3.2 LinkedHashMap
        - 3.3 TreeMap
    4. Filas de Prioridade
        - 4.1 PriorityQueue
    5. Considerações de Performance e Restrições
    6. Exemplos de Código Otimizados
    7. Informações Adicionais
    8. Referências para Estudo Independente

---

1. **Conteúdo Detalhado**
    
    ### 1. Listas
    
    ### 1.1 ArrayList
    
    - **Implementação:** array dinâmico redimensionável.
    - **Complexidade de Operações:**
        - `get(int index)`: O(1)
        - `add(E e)`: amortizado O(1)
        - `add(index, E e)`: O(n) (movimentação de elementos)
        - `remove(int index)`: O(n)
    - **Principais Métodos:**
        - `ensureCapacity(int minCapacity)`, `trimToSize()`
        - `subList(int from, int to)`
    - **Uso Típico:** quando acesso rápido por índice for necessário e inserções/remissões em pontas forem mais frequentes que no meio.
    
    ### 1.2 LinkedList
    
    - **Implementação:** lista duplamente ligada (`Node<E>` com referência `prev` e `next`).
    - **Complexidade de Operações:**
        - `add(E e)`: O(1)
        - `add(index, E e)`: O(n) (percorre até o índice)
        - `get(int index)`: O(n)
        - `remove(Node)`: O(1)
    - **Características Adicionais:** implementa também `Deque<E>` — métodos `addFirst`, `removeLast`, `peekFirst`, etc.
    - **Uso Típico:** quando há muitas inserções e remoções em pontas ou quando se quer fila/deque.
    
    ### 2. Conjuntos (Sets)
    
    ### 2.1 HashSet
    
    - **Implementação:** tabela hash baseada em `HashMap<E, Object>`.
    - **Complexidade de Operações:** O(1) esperado para `add`, `remove`, `contains`.
    - **Ordenação:** não garantida.
    - **Uso Típico:** quando se quer garantir unicidade sem ordem.
    
    ### 2.2 TreeSet
    
    - **Implementação:** árvore de busca balanceada (`NavigableMap`, internamente `TreeMap<E,Object>`).
    - **Complexidade de Operações:** O(log n) para `add`, `remove`, `contains`.
    - **Ordenação:** natural (`Comparable`) ou `Comparator` customizado.
    - **Uso Típico:** quando se precisa de conjunto ordenado e operações de vizinhança (`first()`, `last()`, `headSet()`, `tailSet()`).
    
    ### 3. Mapas (Maps)
    
    ### 3.1 HashMap
    
    - **Implementação:** tabela hash de buckets (desde Java 8 buckets com árvore em caso de colisões pesadas).
    - **Complexidade de Operações:** O(1) esperado para `put`, `get`, `remove`.
    - **Ordenação:** não garantida.
    - **Principais Métodos:** `computeIfAbsent()`, `merge()`, `keySet()`, `entrySet()`, `values()`.
    - **Uso Típico:** chave→valor sem ordenação.
    
    ### 3.2 LinkedHashMap
    
    - **Implementação:** extensão de `HashMap` com lista dupla ligando entradas.
    - **Características:** mantém ordem de inserção (ou ordem de acesso, se configurado).
    - **Uso Típico:** caches LRU (passando `accessOrder=true` no construtor).
    
    ### 3.3 TreeMap
    
    - **Implementação:** similar a `TreeSet`, mas mapeia `key→value`.
    - **Complexidade de Operações:** O(log n).
    - **Ordenação:** natural ou por `Comparator`.
    - **Métodos Úteis:** `firstKey()`, `lastKey()`, `subMap()`, `headMap()`, `tailMap()`.
    - **Uso Típico:** map ordenado, buscas de intervalo.
    
    ### 4. Filas de Prioridade
    
    ### 4.1 PriorityQueue
    
    - **Implementação:** heap binário mínimo (array-backed).
    - **Complexidade de Operações:**
        - `offer(E e)`, `poll()`: O(log n)
        - `peek()`: O(1)
    - **Ordenação:** natural ou via `Comparator` passado.
    - **Uso Típico:** algoritmos de busca A\*, ordenação parcial, escalonamento de tarefas.

---

1. **Considerações de Performance e Restrições**
    - **Arrays vs. Listas Ligadas:** `ArrayList` é mais eficiente para acesso aleatório e melhor uso de memória; `LinkedList` brilha em muitas inserções/remissões nas pontas, mas sofre em busca por índice.
    - **Hash vs. Tree:** operações em estruturas de hash são, em média, mais rápidas que as de árvore, mas perdem em ordenação e garantias de tempo no pior caso.
    - **Capacidade Inicial:** em coleções baseadas em array (ex. `ArrayList`, `HashMap`) definir capacidade inicial evita rehashes e cópias repetidas.
    - **Mutabilidade de Chave em Map:** nunca altere objeto usado como chave depois de inserido em `HashMap` ou `HashSet`.
    - **Concorrência:** nenhuma destas classes é thread-safe — use as versões sincronizadas (`Collections.synchronizedXXX`) ou concurrentes (`ConcurrentHashMap`, `CopyOnWriteArrayList`) quando necessário.

---

1. **Exemplos de Código Otimizados**

```java
import java.util.*;

// 1. ArrayList vs LinkedList: manipulação em pontas
public class ListExample {
    public static void main(String[] args) {
        List<String> arrayList = new ArrayList<>(100); // capacidade inicial
        List<String> linkedList = new LinkedList<>();

        // inserções em final: ambos O(1)
        arrayList.add("A"); linkedList.add("A");

        // acesso por índice: ArrayList O(1), LinkedList O(n)
        System.out.println(arrayList.get(0));

        // inserção no meio: ArrayList O(n), LinkedList O(n) mas sem copiar array
        arrayList.add(1, "B");
        linkedList.add(1, "B");
    }
}

```

```java
// 2. HashSet vs TreeSet: conjuntos
Set<Integer> hashSet = new HashSet<>();
hashSet.addAll(Arrays.asList(5, 3, 8, 1));
System.out.println("HashSet (ordem não garantida): " + hashSet);

Set<Integer> treeSet = new TreeSet<>(Comparator.reverseOrder()); // ordem decrescente
treeSet.addAll(hashSet);
System.out.println("TreeSet (reverse): " + treeSet);

```

```java
// 3. HashMap, LinkedHashMap e TreeMap
Map<String, Integer> hashMap = new HashMap<>(16, 0.75f);
hashMap.put("apple", 3);
hashMap.put("banana", 2);

Map<String, Integer> linkedHashMap = new LinkedHashMap<>(16, 0.75f, true);
// accessOrder=true para LRU
linkedHashMap.putAll(hashMap);
linkedHashMap.get("apple"); // acesso move "apple" para fim da lista

NavigableMap<String, Integer> treeMap = new TreeMap<>();
treeMap.putAll(hashMap);
System.out.println("Menor chave: " + treeMap.firstKey());

```

```java
// 4. PriorityQueue: escalonamento de tarefas por prioridade
class Task implements Comparable<Task> {
    String name; int priority;
    Task(String n, int p){ name=n; priority=p; }
    public int compareTo(Task o){ return Integer.compare(this.priority, o.priority); }
    public String toString(){ return name + "(" + priority + ")"; }
}

public class PQExample {
    public static void main(String[] args) {
        PriorityQueue<Task> pq = new PriorityQueue<>();
        pq.offer(new Task("Low", 10));
        pq.offer(new Task("High", 1));
        pq.offer(new Task("Medium", 5));
        while (!pq.isEmpty()) {
            System.out.println(pq.poll());
        }
        // Saída: High(1), Medium(5), Low(10)
    }
}

```

> Boas práticas aplicadas:
> 
> - Definição de capacidade inicial (`new ArrayList<>(100)`, `new HashMap<>(16,0.75f)`).
> - Uso de `Comparator` e `Comparable`.
> - Comentários breves explicando propósito e complexidade.

---

1. **Informações Adicionais**
    - **Coleções Imutáveis (Java 9+):** `List.of(...)`, `Set.of(...)`, `Map.of(...)`.
    - **Streams sobre Coleções:**
        
        ```java
        List<String> names = List.of("Ana","Bruno","Carla");
        names.stream()
             .filter(s -> s.startsWith("A"))
             .sorted()
             .forEach(System.out::println);
        
        ```
        
    - **ConcurrentHashMap & CopyOnWriteArrayList:** para cenários multithread.
    - **Guava & Apache Commons Collections:** alternativas com utilitários extras.

---

1. **Referências para Estudo Independente**
    - Oracle Java Tutorials – Collections Framework
    [https://docs.oracle.com/javase/tutorial/collections/](https://docs.oracle.com/javase/tutorial/collections/)
    - Java SE API – Package `java.util`[https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/package-summary.html](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/package-summary.html)
    - Effective Java, Joshua Bloch (capítulo sobre Collections)
    - “Java Generics and Collections”, Maurice Naftalin & Philip Wadler
    - Baeldung – guias práticos sobre cada implementação
    [https://www.baeldung.com/java-collections-framework](https://www.baeldung.com/java-collections-framework)