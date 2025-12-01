**Módulo 4: Estruturas de Dados em Java**

Neste módulo, exploraremos as estruturas de dados de fila em Java. As estruturas de fila são usadas para representar e gerenciar coleções de elementos em que o primeiro elemento adicionado é o primeiro a ser removido (FIFO - First-In-First-Out). Em Java, essas estruturas são implementadas no pacote `java.util`. Abaixo, veremos duas estruturas de fila principais: `Queue` e `PriorityQueue`.

**1. Estruturas de Pilhas em Collection**

   - **Queue**: A interface `Queue` representa uma coleção que mantém os elementos em ordem de fila. Ela estende a interface `Collection` e oferece métodos específicos de fila, como `offer()`, `poll()`, `peek()`, entre outros.
     - Exemplo de criação de uma `Queue`:
     ```java
     Queue<String> fila = new LinkedList<>();
     ```

   - **PriorityQueue**: `PriorityQueue` é uma implementação da interface `Queue`, mas é uma fila de prioridade. Isso significa que os elementos na fila são organizados com base em uma ordem de prioridade definida.
     - Exemplo de criação de uma `PriorityQueue`:
     ```java
     PriorityQueue<Integer> filaPrioridade = new PriorityQueue<>();
     ```

**2. Uso e Diferenças de Cada Estrutura**

   - **Queue**:
     - Uso:
       - A `Queue` é útil quando você deseja manter uma coleção de elementos em uma ordem específica de inserção.
       - É adequada para implementar algoritmos de fila, como BFS (Busca em Largura).
     - Diferenças:
       - A `Queue` não organiza os elementos com base em prioridade; eles são acessados na ordem em que foram adicionados.
       - Métodos importantes:
         - `offer(E e)`: Adiciona um elemento à fila.
         - `poll()`: Remove e retorna o elemento no início da fila.
         - `peek()`: Retorna o elemento no início da fila sem removê-lo.

   - **PriorityQueue**:
     - Uso:
       - `PriorityQueue` é ideal quando você precisa manter elementos em ordem de prioridade.
       - Pode ser usado para implementar algoritmos de fila de prioridade, como Dijkstra ou algoritmos de árvore binária.
     - Diferenças:
       - Organiza os elementos com base em uma ordem de prioridade, usando um comparador ou a ordem natural dos elementos (se eles forem comparáveis).
       - Métodos importantes:
         - `offer(E e)`: Adiciona um elemento à fila com base em sua prioridade.
         - `poll()`: Remove e retorna o elemento com a maior prioridade.
         - `peek()`: Retorna o elemento com a maior prioridade sem removê-lo.

Aqui está um exemplo de uso de ambas as estruturas:

```java
// Usando Queue
Queue<String> fila = new LinkedList<>();
fila.offer("A");
fila.offer("B");
fila.offer("C");
System.out.println(fila.poll()); // Saída: A
System.out.println(fila.peek()); // Saída: B

// Usando PriorityQueue
PriorityQueue<Integer> filaPrioridade = new PriorityQueue<>();
filaPrioridade.offer(5);
filaPrioridade.offer(3);
filaPrioridade.offer(8);
System.out.println(filaPrioridade.poll()); // Saída: 3
System.out.println(filaPrioridade.peek()); // Saída: 5
```

Neste módulo, você aprendeu sobre as estruturas de fila em Java, suas diferenças e como usá-las em situações diferentes. A compreensão dessas estruturas é essencial para a manipulação eficaz de dados em Java.