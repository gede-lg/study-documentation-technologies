# T3.04 - removeFirst(), removeLast()

## Introdução

**removeFirst/removeLast**: removem e retornam primeiro/último elemento O(1). Exceção vazia. Específicos LinkedList Deque.

```java
import java.util.*;

// removeFirst() e removeLast()
public class RemoveFirstRemoveLast {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // removeFirst(): remove e retorna primeiro O(1)
        String primeiro = lista.removeFirst();  // "A"
        // Lista: [B, C, D, E]
        
        // removeLast(): remove e retorna último O(1)
        String ultimo = lista.removeLast();     // "E"
        // Lista: [B, C, D]
        
        // VANTAGENS:
        // - O(1) acesso direto first/last
        // - Remove E retorna elemento
        // - Ideal fila/pilha
        
        System.out.println("Removido primeiro: " + primeiro);
        System.out.println("Removido último: " + ultimo);
        System.out.println("Lista: " + lista);
    }
}
```

**removeFirst/removeLast**: O(1) removem retornam pontas. NoSuchElementException vazia. Fila pilha deque.

---

## Fundamentos

### 1. removeFirst()

```java
// removeFirst(): remover e retornar primeiro
public class RemoveFirst {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // SINTAXE:
        String removido = lista.removeFirst();  // "A"
        
        // RESULTADO:
        // Antes:  [A, B, C, D, E]
        // Depois: [B, C, D, E]
        // Retorno: "A"
        
        // IMPLEMENTAÇÃO removeFirst():
        // public E removeFirst() {
        //     final Node<E> f = first;
        //     if (f == null)
        //         throw new NoSuchElementException();
        //     return unlinkFirst(f);
        // }
        // 
        // private E unlinkFirst(Node<E> f) {
        //     final E element = f.item;
        //     final Node<E> next = f.next;
        //     f.item = null;
        //     f.next = null;
        //     first = next;
        //     if (next == null)
        //         last = null;
        //     else
        //         next.prev = null;
        //     size--;
        //     return element;
        // }
        
        // PROCESSO:
        // 1. Verificar lista vazia (first == null)
        // 2. Se vazia: NoSuchElementException
        // 3. Guardar elemento first.item
        // 4. next = first.next
        // 5. Nullificar first.item, first.next
        // 6. first = next
        // 7. next.prev = null (se next != null)
        // 8. size--
        // 9. Retornar elemento
        
        // COMPLEXIDADE: O(1)
        // Acesso direto first
        // Operações constantes
        
        // EXCEÇÃO:
        // NoSuchElementException se vazia
        
        // EQUIVALENTE:
        // remove(0)
        // 
        // MAS:
        // removeFirst() mais claro
        // remove(0) ArrayList O(n) desloca
        // removeFirst() LinkedList O(1) ponteiros
        
        System.out.println("Removido: " + removido);
        System.out.println(lista);
    }
}

/*
 * removeFirst():
 * 
 * ASSINATURA:
 * public E removeFirst()
 * 
 * COMPORTAMENTO:
 * Remove PRIMEIRO elemento
 * Retorna elemento removido
 * 
 * PROCESSO:
 * 1. Verificar first == null
 * 2. Se null: NoSuchElementException
 * 3. Guardar first.item
 * 4. first = first.next
 * 5. Ajustar ponteiros
 * 6. size--
 * 7. Retornar elemento
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * EXCEÇÃO:
 * NoSuchElementException vazia
 * 
 * EQUIVALENTE:
 * remove(0)
 * 
 * VANTAGEM vs ArrayList:
 * LinkedList: O(1) ponteiros
 * ArrayList: O(n) desloca
 */
```

**removeFirst**: unlinkFirst remove primeiro retorna elemento. O(1) ajusta first ponteiros. NoSuchElementException vazia. ArrayList O(n).

### 2. removeLast()

```java
// removeLast(): remover e retornar último
public class RemoveLast {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // SINTAXE:
        String removido = lista.removeLast();  // "E"
        
        // RESULTADO:
        // Antes:  [A, B, C, D, E]
        // Depois: [A, B, C, D]
        // Retorno: "E"
        
        // IMPLEMENTAÇÃO removeLast():
        // public E removeLast() {
        //     final Node<E> l = last;
        //     if (l == null)
        //         throw new NoSuchElementException();
        //     return unlinkLast(l);
        // }
        // 
        // private E unlinkLast(Node<E> l) {
        //     final E element = l.item;
        //     final Node<E> prev = l.prev;
        //     l.item = null;
        //     l.prev = null;
        //     last = prev;
        //     if (prev == null)
        //         first = null;
        //     else
        //         prev.next = null;
        //     size--;
        //     return element;
        // }
        
        // PROCESSO:
        // 1. Verificar lista vazia (last == null)
        // 2. Se vazia: NoSuchElementException
        // 3. Guardar elemento last.item
        // 4. prev = last.prev
        // 5. Nullificar last.item, last.prev
        // 6. last = prev
        // 7. prev.next = null (se prev != null)
        // 8. size--
        // 9. Retornar elemento
        
        // COMPLEXIDADE: O(1)
        // Acesso direto last
        // Operações constantes
        
        // EXCEÇÃO:
        // NoSuchElementException se vazia
        
        // EQUIVALENTE:
        // remove(size() - 1)
        // 
        // MAS:
        // removeLast() mais claro
        // removeLast() O(1) direto
        // remove(size-1) O(1) mas cálculo
        
        System.out.println("Removido: " + removido);
        System.out.println(lista);
    }
}

/*
 * removeLast():
 * 
 * ASSINATURA:
 * public E removeLast()
 * 
 * COMPORTAMENTO:
 * Remove ÚLTIMO elemento
 * Retorna elemento removido
 * 
 * PROCESSO:
 * 1. Verificar last == null
 * 2. Se null: NoSuchElementException
 * 3. Guardar last.item
 * 4. last = last.prev
 * 5. Ajustar ponteiros
 * 6. size--
 * 7. Retornar elemento
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * EXCEÇÃO:
 * NoSuchElementException vazia
 * 
 * EQUIVALENTE:
 * remove(size() - 1)
 * 
 * VANTAGENS:
 * Mais claro
 * O(1) garantido
 * Sem cálculo índice
 */
```

**removeLast**: unlinkLast remove último retorna elemento. O(1) ajusta last ponteiros. NoSuchElementException vazia. Claro sem cálculo.

### 3. Métodos poll()

```java
// MÉTODOS poll(): alternativa segura
public class MetodosPoll {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // LISTA VAZIA:
        
        // removeFirst/removeLast: EXCEÇÃO
        try {
            lista.removeFirst();
        } catch (NoSuchElementException e) {
            System.out.println("Erro removeFirst: lista vazia");
        }
        
        // pollFirst/pollLast: NULL
        String primeiro = lista.pollFirst();  // null
        String ultimo = lista.pollLast();     // null
        
        System.out.println("pollFirst vazio: " + primeiro);  // null
        System.out.println("pollLast vazio: " + ultimo);     // null
        
        // ADICIONAR ELEMENTOS:
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // pollFirst/pollLast: removem e retornam
        String primeiro2 = lista.pollFirst();  // "A" (remove)
        // Lista: [B, C]
        
        String ultimo2 = lista.pollLast();     // "C" (remove)
        // Lista: [B]
        
        System.out.println("pollFirst: " + primeiro2);  // A
        System.out.println("pollLast: " + ultimo2);     // C
        System.out.println("Lista: " + lista);          // [B]
        
        // QUANDO USAR:
        
        // removeFirst/removeLast:
        // - Certeza lista não vazia
        // - Quer exceção se vazia
        if (!lista.isEmpty()) {
            String value = lista.removeFirst();
        }
        
        // pollFirst/pollLast:
        // - Pode estar vazia
        // - Verificar null
        String value = lista.pollFirst();
        if (value != null) {
            // Processar
        }
        
        // EQUIVALENTES:
        // remove() == removeFirst()
        // poll() == pollFirst()
    }
}

/*
 * MÉTODOS poll():
 * 
 * pollFirst():
 * - Remove primeiro
 * - Retorna elemento
 * - null se vazia
 * - Não lança exceção
 * 
 * pollLast():
 * - Remove último
 * - Retorna elemento
 * - null se vazia
 * - Não lança exceção
 * 
 * VS removeFirst/removeLast:
 * remove: exceção se vazia
 * poll: null se vazia
 * 
 * QUANDO USAR:
 * poll: pode estar vazia
 * remove: certeza não vazia
 * 
 * EQUIVALENTES:
 * poll() == pollFirst()
 * remove() == removeFirst()
 */
```

**poll**: pollFirst/pollLast removem retornam null vazia. removeFirst/removeLast exceção. poll seguro verificar null.

### 4. Fila FIFO

```java
// FILA FIFO com removeFirst()
public class FilaFIFO {
    public static void main(String[] args) {
        LinkedList<String> fila = new LinkedList<>();
        
        // FILA FIFO: First In, First Out
        // Adiciona fim, remove início
        
        // ENFILEIRAR (adicionar fim):
        fila.addLast("Cliente 1");
        fila.addLast("Cliente 2");
        fila.addLast("Cliente 3");
        fila.addLast("Cliente 4");
        
        // Fila: [Cliente 1, Cliente 2, Cliente 3, Cliente 4]
        //        ↑ próximo
        
        // DESENFILEIRAR (remover início):
        String atendido1 = fila.removeFirst();  // "Cliente 1"
        // Fila: [Cliente 2, Cliente 3, Cliente 4]
        
        String atendido2 = fila.removeFirst();  // "Cliente 2"
        // Fila: [Cliente 3, Cliente 4]
        
        // ORDEM:
        // Entra: 1, 2, 3, 4
        // Sai:   1, 2, 3, 4
        // Mesmo ordem (FIFO)
        
        // MÉTODOS FILA:
        // Adicionar: addLast() / add() / offer()
        // Remover: removeFirst() / remove() / poll()
        // Ver: getFirst() / element() / peek()
        
        // EXEMPLO PROCESSAMENTO:
        while (!fila.isEmpty()) {
            String cliente = fila.removeFirst();
            System.out.println("Atendendo: " + cliente);
        }
        
        // ALTERNATIVA SEGURA:
        String cliente;
        while ((cliente = fila.pollFirst()) != null) {
            System.out.println("Atendendo: " + cliente);
        }
    }
}

/*
 * FILA FIFO:
 * 
 * CARACTERÍSTICAS:
 * First In, First Out
 * Primeiro entra, primeiro sai
 * 
 * OPERAÇÕES:
 * Enfileirar: addLast() fim
 * Desenfileirar: removeFirst() início
 * 
 * LINKEDLIST IDEAL:
 * addLast: O(1)
 * removeFirst: O(1)
 * Ambas pontas eficientes
 * 
 * MÉTODOS:
 * add/addLast/offer: adicionar
 * removeFirst/remove/poll: remover
 * getFirst/element/peek: ver
 * 
 * USO:
 * Processamento ordem chegada
 * Tarefas sequenciais
 * Buffers
 */
```

**Fila FIFO**: addLast fim O(1), removeFirst início O(1). Primeiro entra primeiro sai. LinkedList ideal ambas pontas eficientes.

### 5. Pilha LIFO

```java
// PILHA LIFO com removeFirst()
public class PilhaLIFO {
    public static void main(String[] args) {
        LinkedList<String> pilha = new LinkedList<>();
        
        // PILHA LIFO: Last In, First Out
        // Adiciona início, remove início
        
        // EMPILHAR (push - adicionar início):
        pilha.addFirst("Livro 1");
        pilha.addFirst("Livro 2");
        pilha.addFirst("Livro 3");
        pilha.addFirst("Livro 4");
        
        // Pilha: [Livro 4, Livro 3, Livro 2, Livro 1]
        //         ↑ topo
        
        // DESEMPILHAR (pop - remover início):
        String topo1 = pilha.removeFirst();  // "Livro 4"
        // Pilha: [Livro 3, Livro 2, Livro 1]
        
        String topo2 = pilha.removeFirst();  // "Livro 3"
        // Pilha: [Livro 2, Livro 1]
        
        // ORDEM:
        // Entra: 1, 2, 3, 4
        // Sai:   4, 3, 2, 1
        // Ordem INVERSA (LIFO)
        
        // MÉTODOS PILHA:
        // Empilhar: addFirst() / push()
        // Desempilhar: removeFirst() / pop()
        // Ver topo: getFirst() / peek()
        
        // EXEMPLO PROCESSAMENTO:
        while (!pilha.isEmpty()) {
            String livro = pilha.removeFirst();
            System.out.println("Removendo: " + livro);
        }
        
        // ALTERNATIVA SEGURA:
        String livro;
        while ((livro = pilha.pollFirst()) != null) {
            System.out.println("Removendo: " + livro);
        }
        
        // MÉTODOS push/pop():
        pilha.push("A");       // addFirst()
        String elem = pilha.pop();  // removeFirst()
    }
}

/*
 * PILHA LIFO:
 * 
 * CARACTERÍSTICAS:
 * Last In, First Out
 * Último entra, primeiro sai
 * 
 * OPERAÇÕES:
 * Empilhar: addFirst() início
 * Desempilhar: removeFirst() início
 * 
 * LINKEDLIST IDEAL:
 * addFirst: O(1)
 * removeFirst: O(1)
 * Ambas início eficientes
 * 
 * MÉTODOS:
 * push/addFirst: empilhar
 * pop/removeFirst: desempilhar
 * peek/getFirst: ver topo
 * 
 * USO:
 * Desfazer ações
 * Navegação histórico
 * Avaliação expressões
 */
```

**Pilha LIFO**: addFirst início O(1), removeFirst início O(1). Último entra primeiro sai. LinkedList ideal início eficiente.

### 6. Comparação remove()

```java
// COMPARAÇÃO remove() vs removeFirst() vs removeLast()
public class ComparacaoRemove {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // 1. remove(): remove PRIMEIRO (sem parâmetro)
        String removido1 = lista.remove();  // "A"
        // Lista: [B, C, D, E]
        
        // 2. remove(index): remove índice específico
        String removido2 = lista.remove(1);  // "C" (índice 1)
        // Lista: [B, D, E]
        
        // 3. remove(objeto): remove primeira ocorrência
        boolean removeu = lista.remove("D");  // true
        // Lista: [B, E]
        
        // 4. removeFirst(): remove primeiro EXPLÍCITO
        LinkedList<String> lista2 = new LinkedList<>(Arrays.asList("X", "Y", "Z"));
        String primeiro = lista2.removeFirst();  // "X"
        
        // 5. removeLast(): remove último
        String ultimo = lista2.removeLast();  // "Z"
        
        // EQUIVALÊNCIAS:
        
        // remove() == removeFirst()
        lista2.remove();        // Mesmo que
        lista2.removeFirst();
        
        // DIFERENÇAS:
        
        // CLAREZA:
        // removeFirst/removeLast: intenção clara
        // remove(): menos óbvio (início? índice?)
        
        // PERFORMANCE:
        // removeFirst/removeLast: O(1) pontas
        // remove(index): O(n) percorrer
        // remove(objeto): O(n) buscar
        
        // INTERFACE:
        // remove() -> List
        // removeFirst/removeLast -> Deque
        
        // QUANDO USAR:
        
        // removeFirst(): pilha, fila, deque, início
        String elem1 = lista.removeFirst();
        
        // removeLast(): pilha reversa, fim
        String elem2 = lista.removeLast();
        
        // remove(index): índice específico
        String elem3 = lista.remove(2);
        
        // remove(objeto): remover valor
        lista.remove("X");
        
        System.out.println(lista);
    }
}

/*
 * COMPARAÇÃO remove():
 * 
 * remove():
 * - Remove PRIMEIRO
 * - Equivale removeFirst()
 * - Interface List
 * 
 * remove(index):
 * - Remove índice
 * - O(n) percorrer
 * - Interface List
 * 
 * remove(objeto):
 * - Remove objeto
 * - O(n) buscar
 * - Interface Collection
 * 
 * removeFirst():
 * - Remove primeiro
 * - O(1)
 * - Mais claro
 * - Interface Deque
 * 
 * removeLast():
 * - Remove último
 * - O(1)
 * - Mais claro
 * - Interface Deque
 * 
 * QUANDO USAR:
 * removeFirst/removeLast: pontas
 * remove(index): índice
 * remove(objeto): valor
 */
```

**Comparação**: remove() == removeFirst() primeiro. remove(i) índice O(n). removeFirst/removeLast O(1) claros pontas.

### 7. Performance

```java
// PERFORMANCE removeFirst/removeLast
public class PerformanceRemove {
    public static void main(String[] args) {
        // LINKEDLIST removeFirst:
        
        LinkedList<Integer> linked = new LinkedList<>();
        for (int i = 0; i < 100_000; i++) {
            linked.add(i);
        }
        
        long inicio1 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            linked.removeFirst();
        }
        long fim1 = System.nanoTime();
        
        System.out.println("LinkedList.removeFirst: " + (fim1 - inicio1) + "ns");
        // RÁPIDO - O(1) cada
        
        // ARRAYLIST remove(0):
        
        ArrayList<Integer> array = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            array.add(i);
        }
        
        long inicio2 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            array.remove(0);
        }
        long fim2 = System.nanoTime();
        
        System.out.println("ArrayList.remove(0): " + (fim2 - inicio2) + "ns");
        // LENTO - O(n) cada, desloca todos
        
        // VANTAGEM LinkedList:
        // removeFirst: ~100x mais rápido
        
        // LINKEDLIST removeLast:
        
        LinkedList<Integer> linked2 = new LinkedList<>();
        for (int i = 0; i < 100_000; i++) {
            linked2.add(i);
        }
        
        long inicio3 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            linked2.removeLast();
        }
        long fim3 = System.nanoTime();
        
        System.out.println("LinkedList.removeLast: " + (fim3 - inicio3) + "ns");
        // RÁPIDO - O(1) cada
        
        // ARRAYLIST remove(size-1):
        
        ArrayList<Integer> array2 = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            array2.add(i);
        }
        
        long inicio4 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            array2.remove(array2.size() - 1);
        }
        long fim4 = System.nanoTime();
        
        System.out.println("ArrayList.remove(size-1): " + (fim4 - inicio4) + "ns");
        // RÁPIDO - O(1) cada, sem deslocamento
        
        // AMBOS O(1) fim
        // LinkedList ligeiramente mais lento (overhead nó)
    }
}

/*
 * PERFORMANCE:
 * 
 * INÍCIO:
 * LinkedList.removeFirst: O(1) ~100ns
 * ArrayList.remove(0): O(n) ~10000ns
 * Diferença: ~100x
 * 
 * FIM:
 * LinkedList.removeLast: O(1) ~100ns
 * ArrayList.remove(size-1): O(1) ~50ns
 * Ambos rápidos
 * 
 * CONCLUSÃO:
 * removeFirst: LinkedList MUITO melhor
 * removeLast: Ambos O(1), ArrayList ligeiramente melhor
 */
```

**Performance**: removeFirst LinkedList O(1) ~100x ArrayList O(n). removeLast ambos O(1) ArrayList ligeiramente melhor overhead.

### 8. Resumo Métodos

```java
/*
 * removeFirst/removeLast
 * 
 * removeFirst():
 * - Remove primeiro
 * - Retorna elemento
 * - O(1)
 * - Exceção vazia
 * - Equivale remove()
 * 
 * removeLast():
 * - Remove último
 * - Retorna elemento
 * - O(1)
 * - Exceção vazia
 * - Equivale remove(size-1)
 * 
 * pollFirst():
 * - Remove primeiro
 * - Retorna elemento
 * - O(1)
 * - null vazia
 * - Seguro
 * 
 * pollLast():
 * - Remove último
 * - Retorna elemento
 * - O(1)
 * - null vazia
 * - Seguro
 * 
 * USO:
 * 
 * FILA FIFO:
 * addLast() + removeFirst()
 * Primeiro entra, primeiro sai
 * 
 * PILHA LIFO:
 * addFirst() + removeFirst()
 * Último entra, primeiro sai
 * 
 * DEQUE:
 * Ambas pontas
 * Flexível
 * 
 * VANTAGENS:
 * O(1) pontas
 * Claros intenção
 * Ideal fila/pilha
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // Remoção pontas O(1)
        String primeiro = lista.removeFirst();  // "A"
        String ultimo = lista.removeLast();     // "E"
        
        // Lista: [B, C, D]
        
        // Remoção segura
        String primeiro2 = lista.pollFirst();  // "B" ou null
        String ultimo2 = lista.pollLast();     // "D" ou null
        
        // Lista: [C]
        
        System.out.println(lista);
    }
}
```

---

## Aplicabilidade

**Métodos usar**:
- **removeFirst/removeLast**: remoção pontas O(1) retornam elemento fila pilha deque
- **pollFirst/pollLast**: remoção segura null vazia verificar antes processar
- **Fila FIFO**: addLast + removeFirst ordem chegada processamento sequencial
- **Pilha LIFO**: addFirst + removeFirst ordem inversa desfazer histórico

---

## Armadilhas

### 1. Exceção Lista Vazia

```java
// ❌ Exceção vazia
lista.removeFirst();  // NoSuchElementException

// ✅ Verificar ou poll
if (!lista.isEmpty()) {
    lista.removeFirst();
}
// ou
lista.pollFirst();  // null
```

### 2. Confundir remove()

```java
// remove() == removeFirst()
lista.remove();       // Remove primeiro
lista.removeFirst();  // Mais claro
```

---

## Boas Práticas

### 1. Usar poll() Pode Vazia

```java
// ✅ Seguro
String valor = lista.pollFirst();
if (valor != null) {
    // Processar
}
```

### 2. Métodos Específicos Fila/Pilha

```java
// ✅ Fila FIFO
fila.addLast("Cliente");
String atendido = fila.removeFirst();

// ✅ Pilha LIFO
pilha.addFirst("Item");
String topo = pilha.removeFirst();
```

---

## Resumo

**removeFirst()**:
- **Objetivo**: remove primeiro elemento retorna elemento removido
- **Implementação**: unlinkFirst verifica vazia guarda item ajusta first ponteiros size decrementa
- **Complexidade**: O(1) acesso direto first operações constantes
- **Exceção**: NoSuchElementException lista vazia verificar isEmpty
- **Equivalente**: remove() removeFirst mais claro intenção
- **Vantagem**: ArrayList O(n) desloca LinkedList O(1) ponteiros ~100x mais rápido

**removeLast()**:
- **Objetivo**: remove último elemento retorna elemento removido
- **Implementação**: unlinkLast verifica vazia guarda item ajusta last ponteiros size decrementa
- **Complexidade**: O(1) acesso direto last operações constantes
- **Exceção**: NoSuchElementException lista vazia verificar isEmpty
- **Equivalente**: remove(size-1) removeLast mais claro sem cálculo
- **Performance**: ArrayList removeLast também O(1) ligeiramente melhor overhead

**poll()**:
- **pollFirst/pollLast**: removem primeiro/último retornam elemento null vazia NÃO exceção
- **Seguro**: pode estar vazia verificar null antes processar loop while poll null
- **Quando usar**: poll pode vazia remove certeza não vazia quer exceção

**Fila FIFO**:
- **Operações**: addLast fim O(1) removeFirst início O(1)
- **Ordem**: First In First Out primeiro entra primeiro sai
- **Uso**: processamento ordem chegada tarefas sequenciais buffers
- **Métodos**: add/offer adicionar remove/poll remover element/peek ver

**Pilha LIFO**:
- **Operações**: addFirst início O(1) removeFirst início O(1)
- **Ordem**: Last In First Out último entra primeiro sai ordem inversa
- **Uso**: desfazer ações navegação histórico avaliação expressões
- **Métodos**: push empilhar pop desempilhar peek ver topo

**Regra de Ouro**: removeFirst removeLast REMOVEM retornam primeiro último O1 acesso direto first last ponteiros. NoSuchElementException vazia verificar isEmpty ou usar poll null seguro. FILA FIFO addLast fim removeFirst início ordem chegada processamento. PILHA LIFO addFirst início removeFirst início ordem inversa desfazer histórico. EQUIVALÊNCIAS remove removeFirst remove0 menos claro removeLast removesize-1 mais claro. PERFORMANCE removeFirst LinkedList O1 ArrayList On ~100x mais rápido removeLast ambos O1 ArrayList ligeiramente melhor. USAR removeFirst fila pilha início removeLast fim poll pode vazia. SEMPRE pollFirst pollLast seguro verificar null remove certeza não vazia exceção.

