# T3.02 - Performance: Acesso O(n), Inserção/Remoção O(1) nas Pontas

## Introdução

**Performance LinkedList**: acesso O(n) percorrer, inserção/remoção pontas O(1) direto first/last, meio O(n) encontrar.

```java
import java.util.*;

// Performance LinkedList
public class PerformanceLinkedList {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // ❌ ACESSO: O(n) - lento
        String elemento = lista.get(2);  // Percorre até índice 2
        // Tempo proporcional índice
        
        // ✅ INSERÇÃO INÍCIO: O(1) - rápido
        lista.addFirst("X");  // Muda ponteiros first
        // Tempo constante
        
        // ✅ INSERÇÃO FIM: O(1) - rápido
        lista.addLast("Z");   // Muda ponteiros last
        // Tempo constante
        
        // ❌ INSERÇÃO MEIO: O(n) - lento
        lista.add(3, "Y");    // Percorre até índice 3 + insere
        // Tempo proporcional índice
        
        // ✅ REMOÇÃO INÍCIO: O(1) - rápido
        lista.removeFirst();  // Remove first direto
        
        // ✅ REMOÇÃO FIM: O(1) - rápido
        lista.removeLast();   // Remove last direto
        
        System.out.println(lista);
    }
}
```

**Performance**: get(i) O(n), addFirst/addLast O(1), add(i) O(n), removeFirst/removeLast O(1).

---

## Fundamentos

### 1. Acesso O(n)

```java
// ACESSO O(n) - percorrer lista
public class AcessoOn {
    public static void main(String[] args) {
        LinkedList<Integer> lista = new LinkedList<>();
        
        // Adicionar 1000 elementos
        for (int i = 0; i < 1000; i++) {
            lista.add(i);
        }
        
        // ACESSO DIFERENTES POSIÇÕES:
        
        long inicio1 = System.nanoTime();
        int primeiro = lista.get(0);  // Início
        long fim1 = System.nanoTime();
        
        long inicio2 = System.nanoTime();
        int meio = lista.get(500);    // Meio
        long fim2 = System.nanoTime();
        
        long inicio3 = System.nanoTime();
        int ultimo = lista.get(999);  // Fim
        long fim3 = System.nanoTime();
        
        System.out.println("Primeiro (0): " + (fim1 - inicio1) + "ns");
        System.out.println("Meio (500): " + (fim2 - inicio2) + "ns");
        System.out.println("Último (999): " + (fim3 - inicio3) + "ns");
        
        // RESULTADO:
        // Primeiro: rápido (1 acesso)
        // Meio: LENTO (500 acessos)
        // Último: rápido (otimização do fim)
        
        // MOTIVO:
        // get(i) precisa PERCORRER lista
        // Não acesso direto como array
        
        // OTIMIZAÇÃO LinkedList:
        // if (index < size/2)
        //     percorre do início (first.next...)
        // else
        //     percorre do fim (last.prev...)
        
        // PIOR CASO: meio (n/2 acessos)
        
        // COMPARAÇÃO ArrayList:
        // ArrayList.get(i): O(1) TODOS índices
        // LinkedList.get(i): O(n) proporcional índice
    }
}

/*
 * ACESSO O(n):
 * 
 * MÉTODO:
 * get(index)
 * 
 * PROCESSO:
 * 1. Verificar índice válido
 * 2. if (index < size/2)
 *       percorrer do início
 *    else
 *       percorrer do fim
 * 3. Retornar item nó
 * 
 * COMPLEXIDADE:
 * Melhor caso: O(1) índice 0 ou size-1
 * Pior caso: O(n/2) = O(n) meio
 * Médio: O(n)
 * 
 * COMPARAÇÃO:
 * ArrayList: O(1) array[index]
 * LinkedList: O(n) percorrer
 * 
 * QUANDO PROBLEMÁTICO:
 * Loop get(i): O(n²) MUITO LENTO
 * Acesso aleatório frequente
 */
```

**Acesso O(n)**: get(i) percorre lista. Otimiza início/fim. Pior caso meio n/2. ArrayList O(1) direto.

### 2. Inserção Início O(1)

```java
// INSERÇÃO INÍCIO O(1) - muito rápido
public class InsercaoInicioO1 {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // TESTE PERFORMANCE:
        long total = 0;
        
        for (int i = 0; i < 100_000; i++) {
            long inicio = System.nanoTime();
            lista.addFirst("Elemento " + i);
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio addFirst: " + (total / 100_000) + "ns");
        // Tempo CONSTANTE
        
        // PROCESSO addFirst(elemento):
        // 1. newNode = new Node(prev=null, item=elemento, next=first)
        // 2. first.prev = newNode (se first != null)
        // 3. first = newNode
        // 4. size++
        
        // OPERAÇÕES:
        // - Criar nó: 1 operação
        // - Ajustar ponteiros: 2 operações
        // - Atualizar first: 1 operação
        // TOTAL: 4 operações CONSTANTES
        
        // SEM PERCORRER LISTA
        // SEM DESLOCAR ELEMENTOS
        // SEM REDIMENSIONAR ARRAY
        
        // COMPARAÇÃO ArrayList:
        
        ArrayList<String> array = new ArrayList<>();
        total = 0;
        
        for (int i = 0; i < 100_000; i++) {
            long inicio = System.nanoTime();
            array.add(0, "Elemento " + i);  // add(0)
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio ArrayList.add(0): " + (total / 100_000) + "ns");
        // Tempo CRESCE
        
        // ArrayList.add(0):
        // - Deslocar TODOS elementos: O(n)
        // - Cada inserção mais lenta
        
        // VANTAGEM LinkedList:
        // addFirst(): O(1) constante
        // ArrayList.add(0): O(n) cresce
    }
}

/*
 * INSERÇÃO INÍCIO O(1):
 * 
 * MÉTODO:
 * addFirst(elemento)
 * 
 * PROCESSO:
 * 1. Criar novo nó
 * 2. newNode.next = first
 * 3. first.prev = newNode
 * 4. first = newNode
 * 5. size++
 * 
 * OPERAÇÕES:
 * Todas CONSTANTES
 * Não percorre lista
 * Não desloca elementos
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * Independente tamanho lista
 * 
 * VANTAGEM vs ArrayList:
 * LinkedList: addFirst() = O(1)
 * ArrayList: add(0) = O(n)
 * 
 * QUANDO USAR:
 * Inserção início frequente
 * Fila LIFO (pilha)
 * Deque
 */
```

**Inserção início O(1)**: addFirst cria nó ajusta ponteiros atualiza first. 4 operações constantes. ArrayList O(n) desloca.

### 3. Inserção Fim O(1)

```java
// INSERÇÃO FIM O(1) - muito rápido
public class InsercaoFimO1 {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // TESTE PERFORMANCE:
        long total = 0;
        
        for (int i = 0; i < 100_000; i++) {
            long inicio = System.nanoTime();
            lista.addLast("Elemento " + i);  // ou add()
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio addLast: " + (total / 100_000) + "ns");
        // Tempo CONSTANTE
        
        // PROCESSO addLast(elemento):
        // 1. newNode = new Node(prev=last, item=elemento, next=null)
        // 2. last.next = newNode (se last != null)
        // 3. last = newNode
        // 4. size++
        
        // OPERAÇÕES:
        // - Criar nó: 1 operação
        // - Ajustar ponteiros: 2 operações
        // - Atualizar last: 1 operação
        // TOTAL: 4 operações CONSTANTES
        
        // COMPARAÇÃO ArrayList:
        
        ArrayList<String> array = new ArrayList<>();
        total = 0;
        
        for (int i = 0; i < 100_000; i++) {
            long inicio = System.nanoTime();
            array.add("Elemento " + i);
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio ArrayList.add: " + (total / 100_000) + "ns");
        
        // ArrayList.add():
        // - Maioria: O(1) direto
        // - Raramente: O(n) expansão
        // - Amortizado: O(1)
        
        // AMBOS O(1) AMORTIZADO
        
        // MAS:
        // LinkedList: SEMPRE O(1)
        // ArrayList: maioria O(1), raramente O(n)
    }
}

/*
 * INSERÇÃO FIM O(1):
 * 
 * MÉTODOS:
 * addLast(elemento)
 * add(elemento)
 * 
 * PROCESSO:
 * 1. Criar novo nó
 * 2. newNode.prev = last
 * 3. last.next = newNode
 * 4. last = newNode
 * 5. size++
 * 
 * OPERAÇÕES:
 * Todas CONSTANTES
 * Acesso direto last
 * Não percorre
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * SEMPRE O(1)
 * 
 * VS ArrayList:
 * LinkedList: SEMPRE O(1)
 * ArrayList: O(1) amortizado
 *            (raramente O(n) expansão)
 * 
 * VANTAGENS:
 * Sem expansão
 * Sem cópia array
 * Previsível
 */
```

**Inserção fim O(1)**: addLast cria nó ajusta ponteiros last. SEMPRE O(1). ArrayList O(1) amortizado raramente expansão.

### 4. Inserção Meio O(n)

```java
// INSERÇÃO MEIO O(n) - lento
public class InsercaoMeioOn {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>(Arrays.asList("A", "B", "C", "D", "E"));
        
        // INSERIR ÍNDICE 2: add(2, "X")
        // 
        // ANTES:  [A] <-> [B] <-> [C] <-> [D] <-> [E]
        //          0      1       2       3       4
        
        lista.add(2, "X");
        
        // DEPOIS: [A] <-> [B] <-> [X] <-> [C] <-> [D] <-> [E]
        //          0      1       2       3       4       5
        
        // PROCESSO add(2, "X"):
        // 
        // 1. Encontrar nó índice 2: O(n)
        //    - Percorrer: first -> [A] -> [B] -> [C]
        //    - 2 acessos
        // 
        // 2. Inserir antes [C]: O(1)
        //    - newNode = Node(prev=[B], item="X", next=[C])
        //    - [B].next = newNode
        //    - [C].prev = newNode
        //    - size++
        
        // CUSTO TOTAL:
        // Encontrar: O(n)
        // Inserir: O(1)
        // Total: O(n)
        
        // COMPARAÇÃO ArrayList:
        
        ArrayList<String> array = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        array.add(2, "X");
        
        // ArrayList.add(2, "X"):
        // 1. Encontrar posição: O(1) array[2]
        // 2. Deslocar [C, D, E] -> direita: O(n)
        // 3. Inserir: O(1)
        // Total: O(n)
        
        // AMBOS O(n)
        
        // MAS:
        // LinkedList: O(n) percorrer + O(1) inserir
        // ArrayList: O(1) acesso + O(n) deslocar
        
        // ArrayList geralmente MAIS RÁPIDO (cache)
        
        System.out.println(lista);
    }
}

/*
 * INSERÇÃO MEIO O(n):
 * 
 * MÉTODO:
 * add(index, elemento)
 * 
 * PROCESSO:
 * 1. Encontrar nó índice: O(n)
 * 2. Inserir nó: O(1)
 *    - Ajustar ponteiros
 * 
 * COMPLEXIDADE:
 * Encontrar: O(n)
 * Inserir: O(1)
 * Total: O(n)
 * 
 * VS ArrayList:
 * LinkedList: O(n) percorrer
 * ArrayList: O(n) deslocar
 * 
 * AMBOS O(n)
 * 
 * MAS:
 * ArrayList geralmente mais rápido
 * (cache-friendly)
 */
```

**Inserção meio O(n)**: add(i) encontra nó O(n) percorrer insere O(1) ponteiros. Total O(n). ArrayList O(n) desloca cache-friendly.

### 5. Remoção Início O(1)

```java
// REMOÇÃO INÍCIO O(1) - muito rápido
public class RemocaoInicioO1 {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        // Adicionar elementos
        for (int i = 0; i < 100_000; i++) {
            lista.add("Elemento " + i);
        }
        
        // TESTE PERFORMANCE:
        long total = 0;
        
        for (int i = 0; i < 10_000; i++) {
            long inicio = System.nanoTime();
            lista.removeFirst();
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio removeFirst: " + (total / 10_000) + "ns");
        // Tempo CONSTANTE
        
        // PROCESSO removeFirst():
        // 1. f = first
        // 2. next = f.next
        // 3. f.item = null, f.next = null
        // 4. first = next
        // 5. if (next == null) last = null
        // 6. else next.prev = null
        // 7. size--
        
        // OPERAÇÕES:
        // Todas CONSTANTES
        // Acesso direto first
        // Não percorre lista
        
        // COMPARAÇÃO ArrayList:
        
        ArrayList<String> array = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            array.add("Elemento " + i);
        }
        
        total = 0;
        for (int i = 0; i < 10_000; i++) {
            long inicio = System.nanoTime();
            array.remove(0);
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio ArrayList.remove(0): " + (total / 10_000) + "ns");
        // Tempo CRESCE
        
        // ArrayList.remove(0):
        // - Deslocar TODOS elementos: O(n)
        // - Cada remoção mais lenta
        
        // VANTAGEM LinkedList:
        // removeFirst(): O(1) constante
        // ArrayList.remove(0): O(n) desloca
    }
}

/*
 * REMOÇÃO INÍCIO O(1):
 * 
 * MÉTODO:
 * removeFirst()
 * 
 * PROCESSO:
 * 1. Guardar first
 * 2. first = first.next
 * 3. Nullificar referências
 * 4. Ajustar prev novo first
 * 5. size--
 * 
 * OPERAÇÕES:
 * Todas CONSTANTES
 * Acesso direto first
 * Não percorre
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * VS ArrayList:
 * LinkedList: removeFirst() = O(1)
 * ArrayList: remove(0) = O(n)
 * 
 * QUANDO USAR:
 * Fila FIFO
 * Deque
 * Remoção início frequente
 */
```

**Remoção início O(1)**: removeFirst ajusta first ponteiros. O(1) direto. ArrayList remove(0) O(n) desloca todos.

### 6. Remoção Fim O(1)

```java
// REMOÇÃO FIM O(1) - muito rápido
public class RemocaoFimO1 {
    public static void main(String[] args) {
        LinkedList<String> lista = new LinkedList<>();
        
        for (int i = 0; i < 100_000; i++) {
            lista.add("Elemento " + i);
        }
        
        // TESTE PERFORMANCE:
        long total = 0;
        
        for (int i = 0; i < 10_000; i++) {
            long inicio = System.nanoTime();
            lista.removeLast();
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio removeLast: " + (total / 10_000) + "ns");
        // Tempo CONSTANTE
        
        // PROCESSO removeLast():
        // 1. l = last
        // 2. prev = l.prev
        // 3. l.item = null, l.prev = null
        // 4. last = prev
        // 5. if (prev == null) first = null
        // 6. else prev.next = null
        // 7. size--
        
        // OPERAÇÕES:
        // Todas CONSTANTES
        // Acesso direto last
        
        // COMPARAÇÃO ArrayList:
        
        ArrayList<String> array = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            array.add("Elemento " + i);
        }
        
        total = 0;
        for (int i = 0; i < 10_000; i++) {
            long inicio = System.nanoTime();
            array.remove(array.size() - 1);
            long fim = System.nanoTime();
            total += (fim - inicio);
        }
        
        System.out.println("Tempo médio ArrayList.remove(size-1): " + (total / 10_000) + "ns");
        
        // ArrayList.remove(size-1):
        // - Acesso: O(1)
        // - Sem deslocamento
        // - O(1)
        
        // AMBOS O(1)
        
        // ArrayList LIGEIRAMENTE mais rápido
        // (sem overhead nó)
    }
}

/*
 * REMOÇÃO FIM O(1):
 * 
 * MÉTODO:
 * removeLast()
 * 
 * PROCESSO:
 * 1. Guardar last
 * 2. last = last.prev
 * 3. Nullificar referências
 * 4. Ajustar next novo last
 * 5. size--
 * 
 * OPERAÇÕES:
 * Todas CONSTANTES
 * Acesso direto last
 * 
 * COMPLEXIDADE:
 * O(1) - constante
 * 
 * VS ArrayList:
 * LinkedList: removeLast() = O(1)
 * ArrayList: remove(size-1) = O(1)
 * 
 * AMBOS O(1)
 * 
 * ArrayList ligeiramente mais rápido
 * (menos overhead)
 */
```

**Remoção fim O(1)**: removeLast ajusta last ponteiros. O(1) direto. ArrayList remove(size-1) também O(1) sem desloca.

### 7. Tabela Complexidade

```java
/*
 * COMPLEXIDADE LINKEDLIST
 * 
 * OPERAÇÃO              COMPLEXIDADE    DESCRIÇÃO
 * =====================================================
 * get(i)                O(n)            Percorrer até índice
 * set(i, elemento)      O(n)            Percorrer + modificar
 * 
 * addFirst(elemento)    O(1)            Ajustar first
 * addLast(elemento)     O(1)            Ajustar last
 * add(elemento)         O(1)            Mesmo addLast
 * add(i, elemento)      O(n)            Percorrer + inserir
 * 
 * removeFirst()         O(1)            Ajustar first
 * removeLast()          O(1)            Ajustar last
 * remove(i)             O(n)            Percorrer + remover
 * remove(elemento)      O(n)            Buscar + remover
 * 
 * contains(elemento)    O(n)            Percorrer sequencial
 * indexOf(elemento)     O(n)            Percorrer sequencial
 * 
 * size()                O(1)            Campo size
 * isEmpty()             O(1)            Verificar size == 0
 * clear()               O(n)            Nullificar nós
 * 
 * iterator()            O(1)            Criar iterator
 * iterator.next()       O(1)            Próximo nó
 * 
 * MELHOR CASO:
 * addFirst/addLast: O(1)
 * removeFirst/removeLast: O(1)
 * 
 * PIOR CASO:
 * get(size/2): O(n)
 * add(size/2, elemento): O(n)
 * 
 * COMPARAÇÃO ArrayList:
 * 
 * OPERAÇÃO          LinkedList  ArrayList
 * ===============================================
 * get(i)            O(n)        O(1)       ✅ ArrayList
 * set(i, elemento)  O(n)        O(1)       ✅ ArrayList
 * 
 * addFirst          O(1)        O(n)       ✅ LinkedList
 * addLast           O(1)        O(1)*      ≈ Empate
 * add(i)            O(n)        O(n)       ≈ Empate
 * 
 * removeFirst       O(1)        O(n)       ✅ LinkedList
 * removeLast        O(1)        O(1)       ≈ Empate
 * remove(i)         O(n)        O(n)       ≈ Empate
 * 
 * contains          O(n)        O(n)       ≈ Empate
 * 
 * Memória           Alta        Baixa      ✅ ArrayList
 * Cache             Ruim        Bom        ✅ ArrayList
 * 
 * * ArrayList: O(1) amortizado
 */

public class TabelaComplexidade {
    public static void main(String[] args) {
        LinkedList<String> linked = new LinkedList<>();
        ArrayList<String> array = new ArrayList<>();
        
        // LinkedList melhor:
        linked.addFirst("X");      // O(1)
        linked.removeFirst();      // O(1)
        
        // ArrayList melhor:
        String s = array.get(100); // O(1)
        array.set(100, "Y");       // O(1)
        
        System.out.println("Escolher estrutura adequada");
    }
}
```

**Tabela**: LinkedList get O(n), addFirst/removeFirst O(1). ArrayList get O(1), add(0) O(n). Escolher adequada.

### 8. Resumo Performance

```java
/*
 * PERFORMANCE LINKEDLIST
 * 
 * PONTAS O(1):
 * ✅ addFirst()
 * ✅ addLast()
 * ✅ removeFirst()
 * ✅ removeLast()
 * ✅ getFirst()
 * ✅ getLast()
 * 
 * Acesso direto first/last
 * Ajustar ponteiros
 * Sem percorrer
 * 
 * MEIO/ÍNDICE O(n):
 * ❌ get(i)
 * ❌ set(i, elemento)
 * ❌ add(i, elemento)
 * ❌ remove(i)
 * ❌ contains(elemento)
 * ❌ indexOf(elemento)
 * 
 * Precisa percorrer lista
 * Otimização: início/fim próximo
 * 
 * VS ARRAYLIST:
 * 
 * LINKEDLIST VANTAGENS:
 * - addFirst: O(1) vs O(n)
 * - removeFirst: O(1) vs O(n)
 * - Sem redimensionamento
 * 
 * LINKEDLIST DESVANTAGENS:
 * - get(i): O(n) vs O(1)
 * - set(i): O(n) vs O(1)
 * - Mais memória
 * - Cache-unfriendly
 * 
 * QUANDO USAR:
 * 
 * LINKEDLIST:
 * - Inserção/remoção início frequente
 * - Fila/Deque
 * - Acesso sequencial
 * - Tamanho muito variável
 * 
 * ARRAYLIST:
 * - Acesso aleatório frequente
 * - Leitura dominante
 * - Memória limitada
 * - Cache importante
 */

// EXEMPLO PERFORMANCE
public class ExemploPerformance {
    public static void main(String[] args) {
        LinkedList<String> linked = new LinkedList<>();
        ArrayList<String> array = new ArrayList<>();
        
        // ✅ LinkedList eficiente
        linked.addFirst("A");       // O(1)
        linked.removeFirst();       // O(1)
        
        // ❌ LinkedList ineficiente
        linked.get(1000);           // O(n)
        
        // ✅ ArrayList eficiente
        array.get(1000);            // O(1)
        
        // ❌ ArrayList ineficiente
        array.add(0, "B");          // O(n)
        
        System.out.println("Usar estrutura adequada operações");
    }
}
```

---

## Aplicabilidade

**LinkedList eficiente**:
- **Operações pontas**: addFirst/addLast/removeFirst/removeLast O(1)
- **Fila/Deque**: inserção/remoção ambas pontas
- **Acesso sequencial**: iterator for-each
- **Tamanho variável**: sem redimensionamento

**LinkedList ineficiente**:
- **Acesso aleatório**: get(i) O(n) lento
- **Loop índice**: for get(i) O(n²)
- **Modificação índice**: set(i) O(n)
- **Memória limitada**: 7x ArrayList

---

## Armadilhas

### 1. Loop get(i)

```java
// ❌ O(n²) muito lento
for (int i = 0; i < lista.size(); i++) {
    lista.get(i);  // O(n) cada
}

// ✅ Iterator O(n)
for (String s : lista) { }
```

### 2. Acesso Aleatório Frequente

```java
// ❌ LinkedList lento
LinkedList<String> lista = new LinkedList<>();
lista.get(500);  // O(n)

// ✅ ArrayList rápido
ArrayList<String> lista = new ArrayList<>();
lista.get(500);  // O(1)
```

---

## Boas Práticas

### 1. Operações Pontas

```java
// ✅ Usar addFirst/removeFirst O(1)
linked.addFirst("X");
linked.removeFirst();
```

### 2. Iterator Acesso

```java
// ✅ Iterator eficiente
for (String s : linked) {
    // O(1) por elemento
}
```

### 3. ArrayList Acesso Índice

```java
// Acesso get(i) frequente
List<String> lista = new ArrayList<>();  // ✅
```

---

## Resumo

**Performance**:
- **get(i)/set(i)**: O(n) percorrer lista otimiza início/fim pior meio n/2 ArrayList O(1) direto
- **addFirst/addLast**: O(1) ajusta ponteiros first/last acesso direto sem percorrer ArrayList O(n)/O(1)
- **removeFirst/removeLast**: O(1) ajusta ponteiros direto ArrayList O(n)/O(1) desloca/direto
- **add(i)/remove(i)**: O(n) percorrer encontrar inserir/remover O(1) ArrayList O(n) desloca
- **contains/indexOf**: O(n) percorrer sequencial ArrayList O(n) também
- **iterator**: O(1) criar O(1) next eficiente for-each

**Vantagens**:
- **Pontas O(1)**: addFirst/addLast/removeFirst/removeLast acesso direto ponteiros muito rápido
- **Sem redimensionamento**: não copia array crescimento dinâmico previsível
- **Sempre O(1)**: pontas sem expansão ArrayList raramente O(n)

**Desvantagens**:
- **Acesso O(n)**: get(i) percorrer lista ArrayList O(1) array[i] muito mais rápido
- **Loop O(n²)**: for get(i) cada acesso O(n) total O(n²) muito lento usar iterator
- **Memória**: 7x mais overhead nós ponteiros ArrayList eficiente
- **Cache**: unfriendly nós espalhados ArrayList contíguo cache-friendly

**Comparação**:
- **LinkedList melhor**: addFirst/removeFirst O(1) vs O(n) inserção remoção início fila deque
- **ArrayList melhor**: get/set O(1) vs O(n) acesso aleatório leitura memória cache
- **Empate**: addLast/removeLast ambos O(1) add(i)/remove(i) meio ambos O(n)

**Regra de Ouro**: LinkedList performance PONTAS O1 addFirst addLast removeFirst removeLast acesso direto first last sem percorrer muito rápido. ACESSO On get set índice percorrer lista otimiza início fim pior meio n/2 ArrayList O1 direto. INSERÇÃO REMOÇÃO início O1 ponteiros ArrayList On desloca fim O1 ambos meio On LinkedList percorrer ArrayList desloca. USAR operações pontas frequentes fila deque acesso sequencial iterator sem redimensionamento. EVITAR acesso aleatório get índice loop get On² modificação set memória limitada usar ArrayList. SEMPRE iterator for-each acesso sequencial NUNCA loop get índice.

