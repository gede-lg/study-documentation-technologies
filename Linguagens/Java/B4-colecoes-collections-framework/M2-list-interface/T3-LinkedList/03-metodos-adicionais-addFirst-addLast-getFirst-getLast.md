# T3.03 - Métodos Adicionais: addFirst(), addLast(), getFirst(), getLast()

## Introdução

**Métodos adicionais LinkedList**: addFirst/addLast inserem pontas O(1), getFirst/getLast acessam pontas O(1), específicos lista encadeada.

```java
import java.util.*;

// Métodos adicionais LinkedList
public class MetodosAdicionais {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // addFirst(): adicionar início O(1)
        lista.addFirst("B");
        lista.addFirst("A");   // [A, B]
        
        // addLast(): adicionar fim O(1)
        lista.addLast("C");
        lista.addLast("D");    // [A, B, C, D]
        
        // getFirst(): acessar primeiro O(1)
        String primeiro = lista.getFirst();  // "A"
        
        // getLast(): acessar último O(1)
        String ultimo = lista.getLast();     // "D"
        
        // VANTAGENS:
        // - O(1) acesso direto first/last
        // - Mais claros que add(0) / get(size-1)
        // - Específicos Deque
        
        System.out.println("Primeiro: " + primeiro);
        System.out.println("Último: " + ultimo);
        System.out.println(lista);
    }
}
```

**Métodos adicionais**: addFirst/addLast O(1) inserem pontas. getFirst/getLast O(1) acessam pontas. Claros específicos.

---

## Fundamentos

### 1. addFirst()

```java
// addFirst(elemento): adicionar início
public class AddFirst {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // SINTAXE:
        lista.addFirst("C");
        lista.addFirst("B");
        lista.addFirst("A");
        
        // RESULTADO: [A, B, C]
        // Ordem INVERSA adição
        
        // IMPLEMENTAÇÃO addFirst(E e):
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
        // 1. Criar novo nó (prev=null, item=elemento, next=first)
        // 2. Atualizar first = newNode
        // 3. Conectar antigo first.prev = newNode
        // 4. Incrementar size
        
        // COMPLEXIDADE: O(1)
        // Acesso direto first
        // Operações constantes
        
        // EQUIVALENTE:
        // add(0, elemento)
        // 
        // MAS:
        // addFirst() mais claro
        // Indica intenção (início)
        
        // USO:
        // - Pilha (LIFO)
        // - Deque (double-ended queue)
        // - Inserção início frequente
        
        System.out.println(lista);
    }
}

/*
 * addFirst(elemento):
 * 
 * ASSINATURA:
 * public void addFirst(E e)
 * 
 * COMPORTAMENTO:
 * Insere elemento INÍCIO lista
 * Torna-se primeiro elemento
 * 
 * PROCESSO:
 * 1. Criar novo nó
 * 2. newNode.next = first
 * 3. first.prev = newNode
 * 4. first = newNode
 * 5. size++
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * EQUIVALENTE:
 * add(0, elemento)
 * 
 * VANTAGEM:
 * Mais claro
 * Indica intenção
 * 
 * QUANDO USAR:
 * Pilha LIFO
 * Deque
 * Inserção início
 */
```

**addFirst**: insere início linkFirst cria nó conecta first. O(1) direto. Equivalente add(0) mais claro intenção.

### 2. addLast()

```java
// addLast(elemento): adicionar fim
public class AddLast {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // SINTAXE:
        lista.addLast("A");
        lista.addLast("B");
        lista.addLast("C");
        
        // RESULTADO: [A, B, C]
        // Ordem MESMA adição
        
        // IMPLEMENTAÇÃO addLast(E e):
        // public void addLast(E e) {
        //     linkLast(e);
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
        
        // PROCESSO:
        // 1. Criar novo nó (prev=last, item=elemento, next=null)
        // 2. Atualizar last = newNode
        // 3. Conectar antigo last.next = newNode
        // 4. Incrementar size
        
        // COMPLEXIDADE: O(1)
        // Acesso direto last
        // Operações constantes
        
        // EQUIVALENTE:
        // add(elemento)
        // add(size, elemento)
        // 
        // MAS:
        // addLast() mais explícito
        // Indica fim claramente
        
        // USO:
        // - Fila FIFO (com removeFirst)
        // - Deque
        // - Acumular elementos ordem
        
        System.out.println(lista);
    }
}

/*
 * addLast(elemento):
 * 
 * ASSINATURA:
 * public void addLast(E e)
 * 
 * COMPORTAMENTO:
 * Insere elemento FIM lista
 * Torna-se último elemento
 * 
 * PROCESSO:
 * 1. Criar novo nó
 * 2. newNode.prev = last
 * 3. last.next = newNode
 * 4. last = newNode
 * 5. size++
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * EQUIVALENTES:
 * add(elemento)
 * add(size, elemento)
 * 
 * VANTAGEM:
 * Mais explícito
 * Indica fim
 * 
 * QUANDO USAR:
 * Fila FIFO
 * Deque
 * Adicionar ordem
 */
```

**addLast**: insere fim linkLast cria nó conecta last. O(1) direto. Equivalente add(elemento) mais explícito.

### 3. getFirst()

```java
// getFirst(): acessar primeiro
public class GetFirst {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // SINTAXE:
        String primeiro = lista.getFirst();  // "A"
        
        // IMPLEMENTAÇÃO getFirst():
        // public E getFirst() {
        //     final Node<E> f = first;
        //     if (f == null)
        //         throw new NoSuchElementException();
        //     return f.item;
        // }
        
        // PROCESSO:
        // 1. Verificar lista vazia (first == null)
        // 2. Se vazia: lançar NoSuchElementException
        // 3. Retornar first.item
        
        // COMPLEXIDADE: O(1)
        // Acesso direto first
        // Uma operação
        
        // EQUIVALENTE:
        // get(0)
        // 
        // MAS:
        // getFirst() O(1) sempre
        // get(0) também O(1) LinkedList
        // getFirst() mais claro
        
        // EXCEÇÃO:
        // Lista vazia -> NoSuchElementException
        
        // VERIFICAÇÃO:
        if (!lista.isEmpty()) {
            String primeiro2 = lista.getFirst();
            System.out.println("Primeiro: " + primeiro2);
        }
        
        // ALTERNATIVA SEGURA:
        // peekFirst() retorna null se vazia
        String primeiro3 = lista.peekFirst();  // null se vazia
        
        System.out.println(primeiro);
    }
}

/*
 * getFirst():
 * 
 * ASSINATURA:
 * public E getFirst()
 * 
 * COMPORTAMENTO:
 * Retorna PRIMEIRO elemento
 * NÃO remove
 * 
 * PROCESSO:
 * 1. Verificar first == null
 * 2. Se null: NoSuchElementException
 * 3. Retornar first.item
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * EXCEÇÃO:
 * NoSuchElementException se vazia
 * 
 * EQUIVALENTE:
 * get(0)
 * 
 * VANTAGEM:
 * Mais claro
 * Sempre O(1)
 * 
 * ALTERNATIVA SEGURA:
 * peekFirst() retorna null
 */
```

**getFirst**: retorna first.item O(1). NoSuchElementException vazia. Equivalente get(0) mais claro. peekFirst null segura.

### 4. getLast()

```java
// getLast(): acessar último
public class GetLast {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // SINTAXE:
        String ultimo = lista.getLast();  // "C"
        
        // IMPLEMENTAÇÃO getLast():
        // public E getLast() {
        //     final Node<E> l = last;
        //     if (l == null)
        //         throw new NoSuchElementException();
        //     return l.item;
        // }
        
        // PROCESSO:
        // 1. Verificar lista vazia (last == null)
        // 2. Se vazia: lançar NoSuchElementException
        // 3. Retornar last.item
        
        // COMPLEXIDADE: O(1)
        // Acesso direto last
        // Uma operação
        
        // EQUIVALENTE:
        // get(size() - 1)
        // 
        // MAS:
        // getLast() O(1) sempre
        // get(size-1) também O(1) LinkedList
        // getLast() mais claro
        // getLast() sem cálculo índice
        
        // EXCEÇÃO:
        // Lista vazia -> NoSuchElementException
        
        // VERIFICAÇÃO:
        if (!lista.isEmpty()) {
            String ultimo2 = lista.getLast();
            System.out.println("Último: " + ultimo2);
        }
        
        // ALTERNATIVA SEGURA:
        // peekLast() retorna null se vazia
        String ultimo3 = lista.peekLast();  // null se vazia
        
        System.out.println(ultimo);
    }
}

/*
 * getLast():
 * 
 * ASSINATURA:
 * public E getLast()
 * 
 * COMPORTAMENTO:
 * Retorna ÚLTIMO elemento
 * NÃO remove
 * 
 * PROCESSO:
 * 1. Verificar last == null
 * 2. Se null: NoSuchElementException
 * 3. Retornar last.item
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * EXCEÇÃO:
 * NoSuchElementException se vazia
 * 
 * EQUIVALENTE:
 * get(size() - 1)
 * 
 * VANTAGENS:
 * Mais claro
 * Sempre O(1)
 * Sem cálculo índice
 * 
 * ALTERNATIVA SEGURA:
 * peekLast() retorna null
 */
```

**getLast**: retorna last.item O(1). NoSuchElementException vazia. Equivalente get(size-1) mais claro sem cálculo. peekLast null.

### 5. Comparação add()

```java
// COMPARAÇÃO add() vs addFirst() vs addLast()
public class ComparacaoAdd {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // 1. add(elemento): adiciona FIM
        lista.add("A");           // [A]
        lista.add("B");           // [A, B]
        
        // 2. addLast(elemento): adiciona FIM (mesmo add)
        lista.addLast("C");       // [A, B, C]
        
        // 3. addFirst(elemento): adiciona INÍCIO
        lista.addFirst("X");      // [X, A, B, C]
        
        // 4. add(index, elemento): posição específica
        lista.add(2, "Y");        // [X, A, Y, B, C]
        
        // EQUIVALÊNCIAS:
        
        // add(elemento) == addLast(elemento)
        lista.add("D");           // Mesmo que
        lista.addLast("D");
        
        // addFirst(elemento) == add(0, elemento)
        lista.addFirst("Z");      // Mesmo que
        lista.add(0, "Z");
        
        // DIFERENÇAS:
        
        // CLAREZA:
        // addFirst/addLast: intenção clara
        // add(0)/add(size): menos óbvio
        
        // PERFORMANCE:
        // Todas O(1) para pontas
        // add(index) meio: O(n)
        
        // INTERFACE:
        // add() -> List
        // addFirst/addLast -> Deque
        
        // QUANDO USAR:
        
        // addFirst(): pilha, deque, início
        lista.addFirst("Início");
        
        // add() ou addLast(): fila, acumular
        lista.add("Fim");
        lista.addLast("Fim");  // Mais explícito
        
        System.out.println(lista);
    }
}

/*
 * COMPARAÇÃO add():
 * 
 * add(elemento):
 * - Adiciona FIM
 * - Retorna boolean
 * - Interface List
 * 
 * addLast(elemento):
 * - Adiciona FIM
 * - void
 * - Interface Deque
 * - Mais explícito
 * 
 * addFirst(elemento):
 * - Adiciona INÍCIO
 * - void
 * - Interface Deque
 * 
 * EQUIVALÊNCIAS:
 * add(e) == addLast(e)
 * addFirst(e) == add(0, e)
 * 
 * QUANDO USAR:
 * addFirst: pilha, deque, início
 * add/addLast: fila, acumular
 */
```

**Comparação**: add(e) == addLast(e) adiciona fim. addFirst(e) == add(0,e) início. addFirst/addLast mais explícitos Deque.

### 6. Comparação get()

```java
// COMPARAÇÃO get() vs getFirst() vs getLast()
public class ComparacaoGet {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // 1. get(index): posição específica
        String segundo = lista.get(1);        // "B" - O(n)
        String meio = lista.get(2);           // "C" - O(n)
        
        // 2. getFirst(): primeiro elemento
        String primeiro = lista.getFirst();   // "A" - O(1)
        
        // 3. getLast(): último elemento
        String ultimo = lista.getLast();      // "E" - O(1)
        
        // EQUIVALÊNCIAS:
        
        // getFirst() == get(0)
        String primeiro2 = lista.get(0);      // Mesmo resultado
        // MAS getFirst() mais claro
        
        // getLast() == get(size() - 1)
        String ultimo2 = lista.get(lista.size() - 1);
        // MAS getLast() mais claro, sem cálculo
        
        // PERFORMANCE:
        
        // getFirst()/getLast(): SEMPRE O(1)
        // get(0): O(1) LinkedList (otimizado)
        // get(size-1): O(1) LinkedList (otimizado)
        // get(meio): O(n) percorre
        
        // EXCEÇÕES:
        
        // getFirst/getLast: NoSuchElementException vazia
        // get(index): IndexOutOfBoundsException inválido
        
        // ALTERNATIVAS SEGURAS:
        
        // peekFirst()/peekLast(): null se vazia
        String primeiro3 = lista.peekFirst();  // null ou valor
        String ultimo3 = lista.peekLast();     // null ou valor
        
        // QUANDO USAR:
        
        // get(index): acesso índice específico
        String valor = lista.get(2);
        
        // getFirst(): primeiro, claro
        String start = lista.getFirst();
        
        // getLast(): último, claro
        String end = lista.getLast();
        
        System.out.println("Primeiro: " + primeiro);
        System.out.println("Último: " + ultimo);
    }
}

/*
 * COMPARAÇÃO get():
 * 
 * get(index):
 * - Índice específico
 * - O(n) geral
 * - O(1) início/fim otimizado
 * - IndexOutOfBoundsException
 * 
 * getFirst():
 * - Primeiro elemento
 * - SEMPRE O(1)
 * - NoSuchElementException vazia
 * - Mais claro
 * 
 * getLast():
 * - Último elemento
 * - SEMPRE O(1)
 * - NoSuchElementException vazia
 * - Mais claro
 * 
 * EQUIVALÊNCIAS:
 * getFirst() == get(0)
 * getLast() == get(size()-1)
 * 
 * ALTERNATIVAS:
 * peekFirst/peekLast: null
 */
```

**Comparação get**: get(i) O(n) índice. getFirst/getLast O(1) sempre claros. Equivalentes get(0)/get(size-1) menos claros.

### 7. Métodos peek()

```java
// MÉTODOS peek(): alternativa segura
public class MetodosPeek {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // LISTA VAZIA:
        
        // getFirst/getLast: EXCEÇÃO
        try {
            lista.getFirst();
        } catch (NoSuchElementException e) {
            System.out.println("Erro getFirst: lista vazia");
        }
        
        // peekFirst/peekLast: NULL
        String primeiro = lista.peekFirst();  // null
        String ultimo = lista.peekLast();     // null
        
        System.out.println("peekFirst vazio: " + primeiro);  // null
        System.out.println("peekLast vazio: " + ultimo);     // null
        
        // ADICIONAR ELEMENTOS:
        lista.add("A");
        lista.add("B");
        lista.add("C");
        
        // peekFirst/peekLast: retornam valor
        String primeiro2 = lista.peekFirst();  // "A"
        String ultimo2 = lista.peekLast();     // "C"
        
        System.out.println("peekFirst: " + primeiro2);  // A
        System.out.println("peekLast: " + ultimo2);     // C
        
        // QUANDO USAR:
        
        // getFirst/getLast:
        // - Certeza lista não vazia
        // - Quer exceção se vazia
        if (!lista.isEmpty()) {
            String value = lista.getFirst();
        }
        
        // peekFirst/peekLast:
        // - Pode estar vazia
        // - Verificar null
        String value = lista.peekFirst();
        if (value != null) {
            // Processar
        }
        
        // EQUIVALENTES:
        // element() == getFirst()
        // peek() == peekFirst()
    }
}

/*
 * MÉTODOS peek():
 * 
 * peekFirst():
 * - Retorna primeiro
 * - null se vazia
 * - Não lança exceção
 * 
 * peekLast():
 * - Retorna último
 * - null se vazia
 * - Não lança exceção
 * 
 * VS getFirst/getLast:
 * get: exceção se vazia
 * peek: null se vazia
 * 
 * QUANDO USAR:
 * peek: pode estar vazia
 * get: certeza não vazia
 * 
 * EQUIVALENTES:
 * peek() == peekFirst()
 * element() == getFirst()
 */
```

**peek**: peekFirst/peekLast retornam null vazia. getFirst/getLast exceção. peek seguro verificar null.

### 8. Resumo Métodos

```java
/*
 * MÉTODOS ADICIONAIS LINKEDLIST
 * 
 * INSERÇÃO:
 * 
 * addFirst(e):
 * - Insere início
 * - O(1)
 * - Equivale add(0, e)
 * - Mais claro
 * 
 * addLast(e):
 * - Insere fim
 * - O(1)
 * - Equivale add(e)
 * - Mais explícito
 * 
 * ACESSO:
 * 
 * getFirst():
 * - Retorna primeiro
 * - O(1)
 * - Exceção vazia
 * - Equivale get(0)
 * 
 * getLast():
 * - Retorna último
 * - O(1)
 * - Exceção vazia
 * - Equivale get(size-1)
 * 
 * peekFirst():
 * - Retorna primeiro
 * - O(1)
 * - null vazia
 * - Seguro
 * 
 * peekLast():
 * - Retorna último
 * - O(1)
 * - null vazia
 * - Seguro
 * 
 * VANTAGENS:
 * - Mais claros que índices
 * - Indicam intenção
 * - Específicos Deque
 * - O(1) garantido
 * 
 * QUANDO USAR:
 * addFirst: pilha, deque, início
 * addLast: fila, acumular, explícito
 * getFirst/getLast: acesso pontas
 * peekFirst/peekLast: seguro, null
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // Inserção pontas O(1)
        lista.addFirst("B");
        lista.addFirst("A");    // [A, B]
        lista.addLast("C");
        lista.addLast("D");     // [A, B, C, D]
        
        // Acesso pontas O(1)
        String primeiro = lista.getFirst();  // "A"
        String ultimo = lista.getLast();     // "D"
        
        // Acesso seguro
        String primeiro2 = lista.peekFirst();  // "A" ou null
        String ultimo2 = lista.peekLast();     // "D" ou null
        
        System.out.println(lista);
    }
}
```

---

## Aplicabilidade

**Métodos usar**:
- **addFirst/addLast**: inserção pontas O(1) claros intenção pilha fila deque
- **getFirst/getLast**: acesso pontas O(1) sem cálculo índice certeza não vazia
- **peekFirst/peekLast**: acesso seguro null vazia verificar antes processar

---

## Armadilhas

### 1. Exceção Lista Vazia

```java
// ❌ Exceção vazia
lista.getFirst();  // NoSuchElementException

// ✅ Verificar ou peek
if (!lista.isEmpty()) {
    lista.getFirst();
}
// ou
lista.peekFirst();  // null
```

### 2. Confundir add() addLast()

```java
// Equivalentes mas addLast mais claro
lista.add("X");        // Fim
lista.addLast("X");    // Fim - mais explícito
```

---

## Boas Práticas

### 1. Usar peek() Pode Vazia

```java
// ✅ Seguro
String valor = lista.peekFirst();
if (valor != null) {
    // Processar
}
```

### 2. Métodos Específicos Claros

```java
// ✅ Claro intenção
lista.addFirst("Início");
lista.addLast("Fim");
String primeiro = lista.getFirst();
String ultimo = lista.getLast();
```

---

## Resumo

**addFirst(e)**:
- **Objetivo**: inserir elemento início lista torna-se primeiro
- **Implementação**: linkFirst cria nó prev null next first conecta atualiza first
- **Complexidade**: O(1) acesso direto first operações constantes
- **Equivalente**: add(0,e) addFirst mais claro indica intenção início
- **Uso**: pilha LIFO deque inserção início frequente

**addLast(e)**:
- **Objetivo**: inserir elemento fim lista torna-se último
- **Implementação**: linkLast cria nó prev last next null conecta atualiza last
- **Complexidade**: O(1) acesso direto last operações constantes
- **Equivalente**: add(e) add(size,e) addLast mais explícito indica fim
- **Uso**: fila FIFO deque acumular elementos ordem

**getFirst()**:
- **Objetivo**: retornar primeiro elemento NÃO remove
- **Implementação**: retorna first.item verifica null lança exceção vazia
- **Complexidade**: O(1) acesso direto first uma operação
- **Exceção**: NoSuchElementException lista vazia
- **Equivalente**: get(0) getFirst mais claro sempre O(1)
- **Alternativa**: peekFirst() retorna null vazia seguro

**getLast()**:
- **Objetivo**: retornar último elemento NÃO remove
- **Implementação**: retorna last.item verifica null lança exceção vazia
- **Complexidade**: O(1) acesso direto last uma operação
- **Exceção**: NoSuchElementException lista vazia
- **Equivalente**: get(size-1) getLast mais claro sem cálculo índice
- **Alternativa**: peekLast() retorna null vazia seguro

**peek()**:
- **peekFirst/peekLast**: retornam primeiro/último null vazia NÃO exceção
- **Seguro**: pode estar vazia verificar null antes processar
- **Quando usar**: peek pode vazia get certeza não vazia quer exceção

**Regra de Ouro**: Métodos adicionais LinkedList INSERÇÃO addFirst addLast O1 acesso direto first last ponteiros claros intenção início fim pilha fila deque. ACESSO getFirst getLast O1 direto sem cálculo índice exceção vazia equivalentes get0 getsize-1 mais claros. PEEK peekFirst peekLast null vazia seguro NÃO exceção verificar null processar. USAR addFirst pilha início addLast fila fim getFirst getLast acesso pontas peek pode vazia. EQUIVALÊNCIAS add addLast fim addFirst add0 início getFirst get0 getLast getsize-1. SEMPRE preferir métodos específicos claros intenção peek seguro get certeza não vazia.

