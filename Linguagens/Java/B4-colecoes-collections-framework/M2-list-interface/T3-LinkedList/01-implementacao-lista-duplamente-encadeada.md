# T3.01 - Implementação com Lista Duplamente Encadeada

## Introdução

**LinkedList**: implementação List usando lista duplamente encadeada (doubly linked list). Cada nó referências elemento, próximo, anterior.

```java
import java.util.*;

// LinkedList: lista duplamente encadeada
public class LinkedListImplementacao {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // ESTRUTURA INTERNA:
        // Cada nó tem 3 partes:
        // - elemento (dado)
        // - next (próximo nó)
        // - prev (nó anterior)
        
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // REPRESENTAÇÃO:
        // null <- [A] <-> [B] <-> [C] -> null
        //         first         last
        
        // VANTAGENS:
        // - Inserção/remoção início/fim O(1)
        // - Navegação bidirecional
        // - Sem redimensionamento
        
        // DESVANTAGENS:
        // - Acesso O(n) percorrer
        // - Mais memória (ponteiros)
        // - Cache-unfriendly
        
        System.out.println(lista);
    }
}
```

**LinkedList**: lista duplamente encadeada nós elemento/next/prev. Inserção/remoção pontas O(1), acesso O(n).

---

## Fundamentos

### 1. Estrutura Nó (Node)

```java
// ESTRUTURA INTERNA LinkedList
public class EstruturaNo {
    // CLASSE INTERNA Node (simplificada):
    // private static class Node<E> {
    //     E item;           // Elemento armazenado
    //     Node<E> next;     // Próximo nó
    //     Node<E> prev;     // Nó anterior
    //     
    //     Node(Node<E> prev, E element, Node<E> next) {
    //         this.item = element;
    //         this.next = next;
    //         this.prev = prev;
    //     }
    // }
    
    // CAMPOS LinkedList:
    // transient int size = 0;        // Quantidade elementos
    // transient Node<E> first;       // Primeiro nó
    // transient Node<E> last;        // Último nó
    
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // ESTADO INICIAL:
        // size = 0
        // first = null
        // last = null
        
        // ADICIONAR "A":
        lista.add("A");
        // size = 1
        // first -> Node("A", next=null, prev=null)
        // last -> mesmo nó
        // 
        // null <- [A] -> null
        
        // ADICIONAR "B":
        lista.add("B");
        // size = 2
        // first -> Node("A")
        // last -> Node("B")
        // 
        // null <- [A] <-> [B] -> null
        //         ↑              ↑
        //       first          last
        
        // ADICIONAR "C":
        lista.add("C");
        // size = 3
        // 
        // null <- [A] <-> [B] <-> [C] -> null
        //         ↑                      ↑
        //       first                  last
        
        // CADA NÓ:
        // [A]: item="A", next=[B], prev=null
        // [B]: item="B", next=[C], prev=[A]
        // [C]: item="C", next=null, prev=[B]
        
        System.out.println(lista);
    }
}

/*
 * ESTRUTURA NÓ:
 * 
 * CLASSE Node<E>:
 * - E item: elemento armazenado
 * - Node<E> next: próximo nó (ou null)
 * - Node<E> prev: nó anterior (ou null)
 * 
 * LINKEDLIST CAMPOS:
 * - int size: quantidade elementos
 * - Node<E> first: referência primeiro nó
 * - Node<E> last: referência último nó
 * 
 * VAZIO:
 * size = 0, first = null, last = null
 * 
 * UM ELEMENTO:
 * size = 1
 * first = last = Node(item, next=null, prev=null)
 * 
 * MÚLTIPLOS:
 * first -> primeiro nó
 * last -> último nó
 * Nós intermediários conectados prev/next
 * 
 * DUPLAMENTE ENCADEADA:
 * Navegação bidirecional
 * first -> last (next)
 * last -> first (prev)
 */
```

**Nó**: classe Node<E> item elemento, next próximo, prev anterior. LinkedList size, first, last referências.

### 2. Lista Duplamente Encadeada

```java
// LISTA DUPLAMENTE ENCADEADA
public class ListaDuplamenteEncadeada {
    public static void main(String[] args) {
        LinkedList<Integer> lista = new LinkedList<>();
        
        // ENCADEAMENTO DUPLO:
        // Cada nó conhece próximo E anterior
        
        lista.add(10);
        lista.add(20);
        lista.add(30);
        lista.add(40);
        
        // ESTRUTURA:
        // 
        // null <- [10] <-> [20] <-> [30] <-> [40] -> null
        //         ↑                                  ↑
        //       first                              last
        
        // NAVEGAÇÃO FRENTE (next):
        // first -> [10] -> [20] -> [30] -> [40] -> null
        
        // NAVEGAÇÃO TRÁS (prev):
        // last -> [40] -> [30] -> [20] -> [10] -> null
        
        // DIFERENÇA SIMPLESMENTE ENCADEADA:
        // Simples: só next, navegação unidirecional
        // null -> [10] -> [20] -> [30] -> [40] -> null
        //         ↑                                ↑
        //       first                            last
        // Sem prev, não volta
        
        // VANTAGENS DUPLA:
        // 1. Navegação bidirecional
        // 2. Remoção mais eficiente (conhece anterior)
        // 3. Implementa Deque (double-ended queue)
        
        // DESVANTAGENS:
        // 1. Mais memória (2 ponteiros por nó)
        // 2. Mais complexidade manter prev
        
        System.out.println(lista);
    }
}

/*
 * DUPLAMENTE ENCADEADA:
 * 
 * CARACTERÍSTICAS:
 * - Cada nó: next E prev
 * - Navegação: frente E trás
 * - first.prev = null
 * - last.next = null
 * 
 * VS SIMPLESMENTE:
 * Simples: só next, unidirecional
 * Dupla: next + prev, bidirecional
 * 
 * VANTAGENS:
 * - Percorrer ambas direções
 * - Remoção nó O(1) se tiver referência
 * - Implementa Deque
 * 
 * CUSTO:
 * - 2x ponteiros (next + prev)
 * - Mais complexidade
 * - Mais memória
 */
```

**Duplamente encadeada**: cada nó next e prev. Navegação bidirecional frente/trás. Mais memória 2 ponteiros.

### 3. Adicionar Fim

```java
// ADICIONAR FIM: add(elemento)
public class AdicionarFim {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // IMPLEMENTAÇÃO add(E elemento) simplificada:
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
        
        // PROCESSO add("A"):
        
        // ESTADO INICIAL:
        // first = null, last = null, size = 0
        
        lista.add("A");
        
        // 1. l = last (null)
        // 2. newNode = Node(prev=null, item="A", next=null)
        // 3. last = newNode
        // 4. l == null? SIM
        // 5. first = newNode
        // 6. size = 1
        // 
        // RESULTADO:
        // first -> [A] <- last
        // null <- [A] -> null
        
        // PROCESSO add("B"):
        lista.add("B");
        
        // 1. l = last ([A])
        // 2. newNode = Node(prev=[A], item="B", next=null)
        // 3. last = newNode
        // 4. l == null? NÃO
        // 5. l.next = newNode ([A].next = [B])
        // 6. size = 2
        // 
        // RESULTADO:
        // null <- [A] <-> [B] -> null
        //         ↑              ↑
        //       first          last
        
        // COMPLEXIDADE: O(1)
        // Acesso direto last
        // Sem percorrer lista
        
        System.out.println(lista);
    }
}

/*
 * ADICIONAR FIM:
 * 
 * MÉTODO:
 * add(elemento) ou addLast(elemento)
 * 
 * PROCESSO:
 * 1. Criar novo nó
 * 2. newNode.prev = last
 * 3. last.next = newNode (se last != null)
 * 4. last = newNode
 * 5. Incrementar size
 * 
 * CASO VAZIO:
 * first = last = newNode
 * 
 * CASO NÃO VAZIO:
 * Conectar last atual -> newNode
 * Atualizar last
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * Acesso direto last
 * Sem percorrer
 */
```

**Adicionar fim**: linkLast cria nó, conecta last.next, atualiza last. O(1) acesso direto sem percorrer.

### 4. Adicionar Início

```java
// ADICIONAR INÍCIO: addFirst(elemento)
public class AdicionarInicio {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        lista.add("B");
        lista.add("C");
        
        // ESTADO:
        // null <- [B] <-> [C] -> null
        //         ↑              ↑
        //       first          last
        
        // ADICIONAR INÍCIO addFirst("A"):
        lista.addFirst("A");
        
        // IMPLEMENTAÇÃO addFirst(E e) simplificada:
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
        
        // PROCESSO:
        // 1. f = first ([B])
        // 2. newNode = Node(prev=null, item="A", next=[B])
        // 3. first = newNode
        // 4. f == null? NÃO
        // 5. f.prev = newNode ([B].prev = [A])
        // 6. size = 3
        // 
        // RESULTADO:
        // null <- [A] <-> [B] <-> [C] -> null
        //         ↑                      ↑
        //       first                  last
        
        // COMPLEXIDADE: O(1)
        // Acesso direto first
        // Sem percorrer lista
        
        // COMPARAÇÃO ArrayList:
        // ArrayList.add(0, elemento): O(n) desloca todos
        // LinkedList.addFirst(elemento): O(1) muda ponteiros
        
        System.out.println(lista);
    }
}

/*
 * ADICIONAR INÍCIO:
 * 
 * MÉTODO:
 * addFirst(elemento)
 * 
 * PROCESSO:
 * 1. Criar novo nó
 * 2. newNode.next = first
 * 3. first.prev = newNode (se first != null)
 * 4. first = newNode
 * 5. Incrementar size
 * 
 * CASO VAZIO:
 * first = last = newNode
 * 
 * CASO NÃO VAZIO:
 * Conectar newNode -> first atual
 * Atualizar first
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * Acesso direto first
 * 
 * VANTAGEM vs ArrayList:
 * ArrayList: add(0) = O(n) desloca
 * LinkedList: addFirst() = O(1) ponteiros
 */
```

**Adicionar início**: linkFirst cria nó, conecta first.prev, atualiza first. O(1) direto. ArrayList O(n) desloca.

### 5. Acesso Índice

```java
// ACESSO ÍNDICE: get(index)
public class AcessoIndice {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        lista.add("D");
        lista.add("E");
        
        // null <- [A] <-> [B] <-> [C] <-> [D] <-> [E] -> null
        //         0       1       2       3       4
        
        // ACESSO get(2):
        String elemento = lista.get(2);  // "C"
        
        // IMPLEMENTAÇÃO get(int index) simplificada:
        // public E get(int index) {
        //     checkElementIndex(index);
        //     return node(index).item;
        // }
        // 
        // Node<E> node(int index) {
        //     if (index < (size >> 1)) {
        //         // Percorrer do início
        //         Node<E> x = first;
        //         for (int i = 0; i < index; i++)
        //             x = x.next;
        //         return x;
        //     } else {
        //         // Percorrer do fim
        //         Node<E> x = last;
        //         for (int i = size - 1; i > index; i--)
        //             x = x.prev;
        //         return x;
        //     }
        // }
        
        // PROCESSO get(2):
        // size = 5
        // index = 2
        // 
        // 1. 2 < (5 >> 1)? 2 < 2? NÃO (igual)
        //    Percorrer do início
        // 2. x = first ([A])
        // 3. Loop i=0: x = x.next ([B])
        // 4. Loop i=1: x = x.next ([C])
        // 5. Retornar x.item ("C")
        
        // OTIMIZAÇÃO:
        // Decide início ou fim (mais próximo)
        // index < size/2: do início (next)
        // index >= size/2: do fim (prev)
        
        // EXEMPLO get(4):
        // 4 < 2? NÃO
        // Percorrer do fim
        // x = last ([E])
        // i=4: já encontrado
        
        // COMPLEXIDADE: O(n)
        // Pior caso: meio (n/2)
        // Melhor caso: início/fim (1)
        // Médio: O(n)
        
        // COMPARAÇÃO ArrayList:
        // ArrayList.get(i): O(1) direto
        // LinkedList.get(i): O(n) percorrer
        
        System.out.println(elemento);
    }
}

/*
 * ACESSO ÍNDICE:
 * 
 * MÉTODO:
 * get(index)
 * 
 * PROCESSO:
 * 1. Verificar índice válido
 * 2. Decidir início/fim (mais próximo)
 * 3. Percorrer lista next/prev
 * 4. Retornar item nó encontrado
 * 
 * OTIMIZAÇÃO:
 * index < size/2: do início (next)
 * index >= size/2: do fim (prev)
 * 
 * COMPLEXIDADE:
 * Pior caso: O(n) meio
 * Melhor caso: O(1) início/fim
 * Médio: O(n/2) = O(n)
 * 
 * DESVANTAGEM vs ArrayList:
 * ArrayList: get(i) = O(1) array[i]
 * LinkedList: get(i) = O(n) percorrer
 * 
 * QUANDO USAR:
 * LinkedList: acesso sequencial
 * ArrayList: acesso aleatório
 */
```

**Acesso índice**: get(i) percorre lista. Otimiza início/fim próximo. O(n) médio. ArrayList O(1) array[i].

### 6. Remoção Índice

```java
// REMOÇÃO ÍNDICE: remove(index)
public class RemocaoIndice {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        lista.add("D");
        lista.add("E");
        
        // null <- [A] <-> [B] <-> [C] <-> [D] <-> [E] -> null
        
        // REMOVER remove(2) ("C"):
        String removido = lista.remove(2);
        
        // IMPLEMENTAÇÃO remove(int index) simplificada:
        // public E remove(int index) {
        //     checkElementIndex(index);
        //     return unlink(node(index));
        // }
        // 
        // E unlink(Node<E> x) {
        //     final E element = x.item;
        //     final Node<E> next = x.next;
        //     final Node<E> prev = x.prev;
        //     
        //     if (prev == null) {
        //         first = next;
        //     } else {
        //         prev.next = next;
        //         x.prev = null;
        //     }
        //     
        //     if (next == null) {
        //         last = prev;
        //     } else {
        //         next.prev = prev;
        //         x.next = null;
        //     }
        //     
        //     x.item = null;
        //     size--;
        //     return element;
        // }
        
        // PROCESSO remove(2):
        // 
        // 1. Encontrar nó índice 2: [C]
        // 2. prev = [B], next = [D]
        // 3. prev.next = next ([B].next = [D])
        // 4. next.prev = prev ([D].prev = [B])
        // 5. [C].prev = null, [C].next = null
        // 6. [C].item = null
        // 7. size--
        // 
        // RESULTADO:
        // null <- [A] <-> [B] <-> [D] <-> [E] -> null
        //         ↑                              ↑
        //       first                          last
        
        // CUSTO:
        // Encontrar nó: O(n)
        // Remover (unlink): O(1)
        // Total: O(n)
        
        // COMPARAÇÃO ArrayList:
        // ArrayList.remove(i): O(n) percorrer + deslocar
        // LinkedList.remove(i): O(n) percorrer + O(1) unlink
        // Ambos O(n), mas LinkedList não desloca elementos
        
        System.out.println("Removido: " + removido);
        System.out.println(lista);
    }
}

/*
 * REMOÇÃO ÍNDICE:
 * 
 * MÉTODO:
 * remove(index)
 * 
 * PROCESSO:
 * 1. Encontrar nó índice: O(n)
 * 2. Desconectar nó:
 *    - prev.next = next
 *    - next.prev = prev
 * 3. Nullificar referências
 * 4. Decrementar size
 * 
 * COMPLEXIDADE:
 * Encontrar: O(n)
 * Unlink: O(1)
 * Total: O(n)
 * 
 * VANTAGEM vs ArrayList:
 * LinkedList: O(n) percorrer + O(1) unlink
 * ArrayList: O(n) percorrer + O(n) deslocar
 * 
 * MAS:
 * Ambos O(n)
 * ArrayList pode ser mais rápido (cache)
 */
```

**Remoção índice**: remove(i) encontra nó O(n), unlink O(1) muda ponteiros. Total O(n). ArrayList O(n) desloca.

### 7. Memória

```java
// USO MEMÓRIA LinkedList
public class UsoMemoria {
    public static void main(String[] args) {
        // COMPARAÇÃO MEMÓRIA:
        
        // ArrayList<Integer> 100 elementos:
        // - Object[] elementData: 100 * 4 bytes = 400 bytes (referências)
        // - int size: 4 bytes
        // - Total ArrayList: ~404 bytes
        // - Elementos Integer: 100 * 16 bytes = 1600 bytes
        // - TOTAL: ~2004 bytes
        
        // LinkedList<Integer> 100 elementos:
        // - 100 nós Node
        // - Cada Node:
        //   - E item: 4 bytes (referência)
        //   - Node next: 4 bytes (referência)
        //   - Node prev: 4 bytes (referência)
        //   - Object header: 12 bytes
        //   - Padding: 4 bytes
        //   - Total por nó: ~28 bytes
        // - 100 nós: 100 * 28 = 2800 bytes
        // - Node first: 4 bytes
        // - Node last: 4 bytes
        // - int size: 4 bytes
        // - Total LinkedList: ~2812 bytes
        // - Elementos Integer: 100 * 16 bytes = 1600 bytes
        // - TOTAL: ~4412 bytes
        
        // OVERHEAD:
        // ArrayList: ~404 bytes
        // LinkedList: ~2812 bytes
        // 
        // LinkedList usa ~7x mais memória overhead
        
        // MOTIVO:
        // - Cada nó: objeto separado (header, padding)
        // - 2 ponteiros extras (next, prev)
        // - ArrayList: array contíguo, menos overhead
        
        // CONCLUSÃO:
        // LinkedList mais memória
        // ArrayList mais eficiente memória
        
        LinkedList<Integer> linked = new LinkedList<>();
        ArrayList<Integer> array = new ArrayList<>();
        
        for (int i = 0; i < 100; i++) {
            linked.add(i);
            array.add(i);
        }
        
        System.out.println("LinkedList: mais memória (nós + ponteiros)");
        System.out.println("ArrayList: menos memória (array contíguo)");
    }
}

/*
 * USO MEMÓRIA:
 * 
 * LINKEDLIST:
 * - Cada nó: objeto separado
 * - Object header: 12 bytes
 * - 3 campos (item, next, prev): 12 bytes
 * - Padding: 4 bytes
 * - Total nó: ~28 bytes
 * 
 * ARRAYLIST:
 * - Array contíguo
 * - Sem overhead individual
 * - Apenas referências: 4 bytes cada
 * 
 * OVERHEAD:
 * LinkedList: ~28 bytes/elemento
 * ArrayList: ~4 bytes/elemento
 * 
 * CONCLUSÃO:
 * LinkedList: ~7x mais memória
 * ArrayList: mais eficiente
 */
```

**Memória**: LinkedList nó 28 bytes (header + 3 campos). ArrayList referência 4 bytes. LinkedList 7x mais memória.

### 8. Resumo Implementação

```java
/*
 * IMPLEMENTAÇÃO LINKEDLIST
 * 
 * ESTRUTURA:
 * - Lista duplamente encadeada
 * - Cada nó: item, next, prev
 * - Campos: size, first, last
 * 
 * CARACTERÍSTICAS:
 * - Navegação bidirecional
 * - Inserção/remoção pontas O(1)
 * - Acesso índice O(n)
 * - Mais memória (ponteiros)
 * 
 * VANTAGENS:
 * - addFirst/addLast: O(1)
 * - removeFirst/removeLast: O(1)
 * - Sem redimensionamento
 * - Implementa Queue/Deque
 * 
 * DESVANTAGENS:
 * - get(i): O(n) percorrer
 * - Mais memória (~7x)
 * - Cache-unfriendly
 * - Overhead nós
 * 
 * VS ARRAYLIST:
 * 
 * LINKEDLIST:
 * - Lista encadeada
 * - add início: O(1)
 * - get(i): O(n)
 * - Mais memória
 * 
 * ARRAYLIST:
 * - Array dinâmico
 * - add início: O(n)
 * - get(i): O(1)
 * - Menos memória
 * 
 * QUANDO USAR:
 * LinkedList:
 * - Inserção/remoção início frequente
 * - Implementar fila/deque
 * - Acesso sequencial
 * 
 * ArrayList:
 * - Acesso aleatório
 * - Leitura frequente
 * - Memória limitada
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // Adicionar fim O(1)
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // Adicionar início O(1)
        lista.addFirst("X");
        
        // null <- [X] <-> [A] <-> [B] <-> [C] -> null
        
        // Acesso O(n)
        String elemento = lista.get(2);  // "B"
        
        // Remoção O(n) índice
        lista.remove(1);  // Remove "A"
        
        // null <- [X] <-> [B] <-> [C] -> null
        
        System.out.println(lista);
    }
}
```

---

## Aplicabilidade

**LinkedList ideal**:
- **Inserção/remoção** início/fim frequente O(1)
- **Fila/Deque**: implementar estruturas pontas
- **Acesso sequencial**: iterator, for-each
- **Sem redimensionamento**: tamanho muito variável

**LinkedList não ideal**:
- **Acesso aleatório**: get(i) O(n) lento
- **Memória limitada**: 7x mais que ArrayList
- **Cache**: performance iteração pior

---

## Armadilhas

### 1. Acesso Índice Loop

```java
// ❌ O(n²) muito lento
for (int i = 0; i < lista.size(); i++) {
    lista.get(i);  // O(n) cada
}

// ✅ Iterator O(n)
for (String s : lista) {
    // ...
}
```

### 2. Usar para Acesso Aleatório

```java
// ❌ LinkedList acesso lento
LinkedList<String> lista = new LinkedList<>();
String s = lista.get(1000);  // O(n)

// ✅ ArrayList acesso rápido
ArrayList<String> lista = new ArrayList<>();
String s = lista.get(1000);  // O(1)
```

---

## Boas Práticas

### 1. Iterator Acesso Sequencial

```java
// ✅ Iterator eficiente
for (String s : lista) {
    // O(1) por elemento
}
```

### 2. Operações Pontas

```java
// ✅ addFirst/addLast O(1)
lista.addFirst("Início");
lista.addLast("Fim");
```

### 3. ArrayList Acesso Aleatório

```java
// Acesso frequente índice
List<String> lista = new ArrayList<>();  // ✅
```

---

## Resumo

**Implementação**:
- **Estrutura**: lista duplamente encadeada nós elemento/next/prev campos size/first/last
- **Nó**: Node<E> item elemento, next próximo, prev anterior, duplamente encadeado bidirecional
- **Adicionar fim**: linkLast cria nó conecta last.next atualiza last O(1) acesso direto
- **Adicionar início**: linkFirst cria nó conecta first.prev atualiza first O(1) ArrayList O(n)
- **Acesso índice**: get(i) percorre lista otimiza início/fim próximo O(n) ArrayList O(1)
- **Remoção**: remove(i) encontra O(n) unlink O(1) muda ponteiros total O(n) ArrayList desloca
- **Memória**: nó 28 bytes header campos padding ArrayList 4 bytes referência 7x mais memória
- **Cache**: unfriendly nós espalhados memória ArrayList contíguo cache-friendly

**Vantagens**:
- addFirst/addLast/removeFirst/removeLast O(1) acesso direto ponteiros
- Sem redimensionamento não copia array crescimento dinâmico
- Navegação bidirecional frente next trás prev
- Implementa Queue Deque operações pontas

**Desvantagens**:
- get(i) O(n) percorrer lista ArrayList O(1) direto
- Memória 7x mais overhead nós ponteiros ArrayList eficiente
- Cache-unfriendly nós espalhados ArrayList contíguo rápido
- Overhead objeto por nó header padding

**Regra de Ouro**: LinkedList implementação lista duplamente encadeada nós item next prev navegação bidirecional. VANTAGENS addFirst addLast O1 acesso direto first last sem redimensionamento não copia implementa Queue Deque operações pontas. DESVANTAGENS get índice On percorrer lista ArrayList O1 array memória 7x mais overhead nós ponteiros cache-unfriendly espalhados. USAR inserção remoção início fim frequente fila deque acesso sequencial iterator. NÃO USAR acesso aleatório get índice frequente memória limitada usar ArrayList. SEMPRE iterator for-each acesso sequencial EVITAR get loop On².

