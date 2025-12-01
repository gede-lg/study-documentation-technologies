## 1. Estruturas de Filas em Collection

### Deque (Double-Ended Queue)
Deque é uma interface em Java que representa uma fila de elementos onde você pode adicionar e remover elementos tanto na frente quanto no final da fila. Isso o torna uma estrutura de dados extremamente versátil para várias aplicações.

#### Funcionalidades Principais:
- Adição e remoção de elementos em ambos os extremos.
- Oferece métodos para adicionar, remover e inspecionar elementos na frente e no final.
- Pode ser usado como uma pilha (LIFO - Last-In-First-Out) ou uma fila (FIFO - First-In-First-Out).

Exemplo de declaração de um deque:
```java
Deque<String> deque = new LinkedList<>();
```

#### Métodos Principais:
- `addFirst(E e)` e `addLast(E e)`: Adiciona elementos no início e no final do deque, respectivamente.
- `removeFirst()` e `removeLast()`: Remove e retorna o elemento do início e do final do deque, respectivamente.
- `getFirst()` e `getLast()`: Retorna o elemento no início e no final do deque, respectivamente, sem removê-lo.
- `isEmpty()`: Verifica se o deque está vazio.

Exemplo de uso:
```java
Deque<String> deque = new LinkedList<>();
deque.addLast("Primeiro");
deque.addFirst("Segundo");
deque.addLast("Terceiro");
System.out.println(deque.getFirst()); // Saída: Segundo
System.out.println(deque.getLast());  // Saída: Terceiro
```

## 2. Uso e as diferenças de cada estrutura

### ArrayList vs. LinkedList vs. Deque
Java oferece várias estruturas de dados para armazenar coleções de elementos. Aqui estão algumas diferenças entre `ArrayList`, `LinkedList` e `Deque`:

#### ArrayList:
- Implementado como um array redimensionável.
- Ótimo para acesso aleatório.
- Inserção/remoção no final é rápido, mas em outros lugares do array é mais lento devido ao redimensionamento.
- Não é eficiente para inserções/remoções frequentes em locais intermediários.

#### LinkedList:
- Implementado como uma lista encadeada de nós.
- Ótimo para inserções/remoções frequentes em qualquer posição.
- Pior para acesso aleatório, pois requer percorrer a lista.
- Não possui operações específicas de pilha ou fila.

#### Deque (LinkedList implementa Deque):
- Permite adicionar/remover em ambos os extremos (frente e final) de maneira eficiente.
- Pode ser usado como uma fila (FIFO) ou pilha (LIFO).
- Boa escolha quando você precisa de inserções/remoções eficientes em ambos os extremos, ou para implementar estruturas como filas duplamente terminadas.

Exemplo de escolha de estrutura:
```java
Deque<Integer> deque = new LinkedList<>();  // Para uma fila duplamente terminada
Deque<Integer> deque = new ArrayDeque<>(); // Alternativa que também é uma deque
```

Em resumo, a escolha entre `ArrayList`, `LinkedList` e `Deque` depende das necessidades específicas de sua aplicação. O `Deque` é especialmente útil quando você precisa de uma estrutura de dados que suporta operações eficientes em ambos os extremos e pode ser usada como uma fila ou pilha.