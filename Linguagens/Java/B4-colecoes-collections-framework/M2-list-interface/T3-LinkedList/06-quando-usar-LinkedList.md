# T3.06 - Quando Usar LinkedList

## Introdução

**LinkedList**: usar inserção/remoção pontas frequente fila pilha deque acesso sequencial. NÃO usar acesso aleatório memória limitada.

```java
import java.util.*;

// QUANDO USAR LinkedList
public class QuandoUsarLinkedList {
    public static void main(String[] args) {
        // ✅ BOM: Fila FIFO (pontas O(1))
        Queue<String> fila = new LinkedList<>();
        fila.offer("Cliente 1");    // O(1) fim
        String atendido = fila.poll();  // O(1) início
        
        // ✅ BOM: Pilha LIFO (início O(1))
        Deque<String> pilha = new LinkedList<>();
        pilha.push("Item 1");       // O(1) início
        String topo = pilha.pop();  // O(1) início
        
        // ✅ BOM: Acesso sequencial (iterator)
        LinkedList<Integer> lista = new LinkedList<>(Arrays.asList(1, 2, 3, 4, 5));
        for (Integer num : lista) {  // Iterator O(1) cada
            System.out.println(num);
        }
        
        // ❌ RUIM: Acesso aleatório (O(n))
        LinkedList<Integer> ruim = new LinkedList<>();
        for (int i = 0; i < 1000; i++) {
            ruim.add(i);
        }
        // Loop get(i): O(n²) - MUITO LENTO!
        for (int i = 0; i < ruim.size(); i++) {
            System.out.println(ruim.get(i));  // Cada: O(n)
        }
        
        // RESUMO:
        // LinkedList: pontas O(1), meio O(n)
        // ArrayList: acesso O(1), início O(n)
    }
}
```

**LinkedList**: ideal pontas O(1) fila pilha. Evitar acesso aleatório O(n) loop get(i) O(n²).

---

## Fundamentos

### 1. Inserção/Remoção Pontas Frequente

```java
// ✅ CENÁRIO 1: Inserção/remoção pontas
public class PontasFrequente {
    public static void main(String[] args) {
        // FILA DE PROCESSAMENTO:
        
        LinkedList<String> tarefas = new LinkedList<>();
        
        // ADICIONAR tarefas (fim): O(1)
        tarefas.addLast("Tarefa 1");
        tarefas.addLast("Tarefa 2");
        tarefas.addLast("Tarefa 3");
        // Milhares de addLast: RÁPIDO
        
        // PROCESSAR tarefas (início): O(1)
        while (!tarefas.isEmpty()) {
            String tarefa = tarefas.removeFirst();  // O(1)
            processar(tarefa);
        }
        // Milhares de removeFirst: RÁPIDO
        
        // TOTAL: O(n) - linear eficiente
        
        
        // COMPARAÇÃO ArrayList:
        
        ArrayList<String> arrayTarefas = new ArrayList<>();
        
        // Adicionar fim: O(1) - OK
        arrayTarefas.add("Tarefa 1");
        
        // REMOVER INÍCIO: O(n) - LENTO!
        while (!arrayTarefas.isEmpty()) {
            String tarefa = arrayTarefas.remove(0);  // O(n) desloca todos
            processar(tarefa);
        }
        // Milhares de remove(0): O(n²) - MUITO LENTO!
        
        
        // PERFORMANCE:
        
        int n = 100_000;
        
        // LinkedList:
        LinkedList<Integer> linked = new LinkedList<>();
        long t1 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            linked.addLast(i);      // O(1)
        }
        for (int i = 0; i < n; i++) {
            linked.removeFirst();   // O(1)
        }
        long t2 = System.nanoTime();
        System.out.println("LinkedList: " + (t2 - t1) / 1_000_000 + "ms");
        // ~100ms
        
        // ArrayList:
        ArrayList<Integer> array = new ArrayList<>();
        long t3 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            array.add(i);           // O(1)
        }
        for (int i = 0; i < n; i++) {
            array.remove(0);        // O(n)
        }
        long t4 = System.nanoTime();
        System.out.println("ArrayList: " + (t4 - t3) / 1_000_000 + "ms");
        // ~5000ms (50x mais lento!)
        
        // CONCLUSÃO:
        // Inserção/remoção INÍCIO: LinkedList ~50-100x mais rápida
    }
    
    static void processar(String tarefa) {
        // Processar
    }
}

/*
 * PONTAS FREQUENTE:
 * 
 * QUANDO:
 * - Fila FIFO
 * - Pilha LIFO
 * - Adicionar/remover início/fim
 * - Processamento sequencial
 * 
 * VANTAGEM LinkedList:
 * addFirst/addLast: O(1)
 * removeFirst/removeLast: O(1)
 * Total: O(n) linear
 * 
 * DESVANTAGEM ArrayList:
 * add(0): O(n) desloca
 * remove(0): O(n) desloca
 * Total: O(n²) quadrático
 * 
 * DIFERENÇA:
 * ~50-100x mais rápida
 * 
 * USAR LinkedList:
 * Operações pontas frequentes
 */
```

**Pontas frequente**: LinkedList addFirst addLast removeFirst removeLast O(1) ideal fila pilha. ArrayList remove(0) O(n) desloca 50x mais lento.

### 2. Fila FIFO

```java
// ✅ CENÁRIO 2: Fila FIFO
public class FilaFIFO {
    public static void main(String[] args) {
        // USAR Queue INTERFACE:
        Queue<String> fila = new LinkedList<>();
        
        // FILA DE ATENDIMENTO:
        
        // Clientes chegam (offer fim):
        fila.offer("Cliente 1");
        fila.offer("Cliente 2");
        fila.offer("Cliente 3");
        fila.offer("Cliente 4");
        fila.offer("Cliente 5");
        
        // Atender ordem chegada (poll início):
        System.out.println("=== Atendimento ===");
        String cliente;
        while ((cliente = fila.poll()) != null) {
            atender(cliente);
        }
        
        // ORDEM:
        // Cliente 1 (primeiro) → Cliente 2 → ... → Cliente 5 (último)
        // FIFO: First In, First Out
        
        
        // FILA DE MENSAGENS:
        
        Queue<String> mensagens = new LinkedList<>();
        
        // Produtor (adiciona):
        new Thread(() -> {
            for (int i = 1; i <= 10; i++) {
                mensagens.offer("Mensagem " + i);
                try { Thread.sleep(100); } catch (Exception e) {}
            }
        }).start();
        
        // Consumidor (remove):
        new Thread(() -> {
            String msg;
            while (true) {
                if ((msg = mensagens.poll()) != null) {
                    System.out.println("Processando: " + msg);
                }
                try { Thread.sleep(150); } catch (Exception e) {}
            }
        }).start();
        
        
        // BUFFER CIRCULAR:
        
        LinkedList<String> buffer = new LinkedList<>();
        int capacidade = 5;
        
        // Adicionar com limite:
        void adicionar(String item) {
            buffer.addLast(item);
            if (buffer.size() > capacidade) {
                buffer.removeFirst();  // Remove mais antigo
            }
        }
        
        
        // ALTERNATIVA ArrayDeque:
        
        // Se NÃO precisa null:
        Queue<String> deque = new ArrayDeque<>();  // Mais rápida
        
        // Se precisa null ou List:
        Queue<String> linked = new LinkedList<>();
        
        
        // POR QUE LinkedList:
        
        // 1. offer() fim: O(1)
        // 2. poll() início: O(1)
        // 3. Permite null
        // 4. Implementa List também
        // 5. Sem redimensionamento
        
        try { Thread.sleep(2000); } catch (Exception e) {}
    }
    
    static void atender(String cliente) {
        System.out.println("Atendendo: " + cliente);
    }
    
    static class Buffer {
        LinkedList<String> buffer = new LinkedList<>();
        int capacidade = 5;
        
        void adicionar(String item) {
            buffer.addLast(item);
            if (buffer.size() > capacidade) {
                buffer.removeFirst();
            }
        }
    }
}

/*
 * FILA FIFO:
 * 
 * QUANDO:
 * - Processamento ordem chegada
 * - Tarefas sequenciais
 * - Mensageria
 * - Buffers
 * 
 * OPERAÇÕES:
 * offer: adicionar fim O(1)
 * poll: remover início O(1)
 * peek: ver próximo O(1)
 * 
 * VANTAGENS LinkedList:
 * O(1) ambas pontas
 * Permite null
 * List também
 * Sem redimensionamento
 * 
 * ALTERNATIVA:
 * ArrayDeque (mais rápida)
 * Se NÃO precisa null/List
 * 
 * USAR LinkedList:
 * Fila FIFO clássica
 */
```

**Fila FIFO**: Queue interface LinkedList offer fim poll início O(1). Processamento ordem chegada mensageria buffers. Permite null List.

### 3. Pilha LIFO

```java
// ✅ CENÁRIO 3: Pilha LIFO
public class PilhaLIFO {
    public static void main(String[] args) {
        // USAR Deque INTERFACE (NÃO Stack):
        Deque<String> pilha = new LinkedList<>();
        
        // DESFAZER AÇÕES:
        
        Deque<String> historico = new LinkedList<>();
        
        // Executar ações (push):
        executar("Criar arquivo", historico);
        executar("Editar linha 10", historico);
        executar("Deletar linha 5", historico);
        executar("Salvar arquivo", historico);
        
        // Desfazer (pop):
        System.out.println("=== Desfazendo ===");
        while (!historico.isEmpty()) {
            String acao = historico.pop();  // O(1) início
            System.out.println("Desfazendo: " + acao);
        }
        
        // ORDEM DESFAZER:
        // Salvar → Deletar → Editar → Criar
        // Inverso da execução (LIFO)
        
        
        // NAVEGAÇÃO HISTÓRICO:
        
        Deque<String> navegacao = new LinkedList<>();
        
        // Navegar páginas:
        navegar("google.com", navegacao);
        navegar("youtube.com", navegacao);
        navegar("github.com", navegacao);
        
        // Voltar:
        System.out.println("\n=== Voltando ===");
        String paginaAtual = navegacao.pop();  // github
        System.out.println("Saiu: " + paginaAtual);
        System.out.println("Atual: " + navegacao.peek());  // youtube
        
        
        // AVALIAÇÃO EXPRESSÃO:
        
        String expressao = "3 + (4 * 2)";
        Deque<Character> operadores = new LinkedList<>();
        Deque<Integer> valores = new LinkedList<>();
        
        // Processar expressão (empilha/desempilha)
        // Operadores/valores na pilha
        // Pop quando encontra ')'
        
        
        // POR QUE LinkedList:
        
        // 1. push() início: O(1)
        // 2. pop() início: O(1)
        // 3. peek() início: O(1)
        // 4. Não thread-safe (mais rápida que Stack)
        
        
        // ALTERNATIVA ArrayDeque:
        
        // Se NÃO precisa null:
        Deque<String> deque = new ArrayDeque<>();  // Mais rápida
        
        // Se precisa null ou List:
        Deque<String> linked = new LinkedList<>();
    }
    
    static void executar(String acao, Deque<String> hist) {
        System.out.println("Executando: " + acao);
        hist.push(acao);
    }
    
    static void navegar(String pagina, Deque<String> hist) {
        System.out.println("Navegando: " + pagina);
        hist.push(pagina);
    }
}

/*
 * PILHA LIFO:
 * 
 * QUANDO:
 * - Desfazer ações
 * - Navegação histórico
 * - Avaliação expressões
 * - Recursão iterativa
 * 
 * OPERAÇÕES:
 * push: empilhar início O(1)
 * pop: desempilhar início O(1)
 * peek: ver topo O(1)
 * 
 * VANTAGENS LinkedList:
 * O(1) início
 * Não thread-safe (rápida)
 * Permite null
 * 
 * EVITAR:
 * Stack (obsoleta)
 * Thread-safe desnecessário
 * 
 * ALTERNATIVA:
 * ArrayDeque (mais rápida)
 * Se NÃO precisa null
 * 
 * USAR LinkedList:
 * Pilha LIFO clássica
 */
```

**Pilha LIFO**: Deque interface LinkedList push pop peek início O(1). Desfazer navegação expressões. NÃO Stack obsoleta. ArrayDeque alternativa.

### 4. Acesso Sequencial (Iterator)

```java
// ✅ CENÁRIO 4: Acesso sequencial
public class AcessoSequencial {
    public static void main(String[] args) {
        LinkedList<Integer> lista = new LinkedList<>();
        for (int i = 1; i <= 1000; i++) {
            lista.add(i);
        }
        
        // ✅ BOM: Iterator (O(1) cada):
        
        long t1 = System.nanoTime();
        for (Integer num : lista) {  // Iterator interno
            processar(num);
        }
        long t2 = System.nanoTime();
        System.out.println("Iterator: " + (t2 - t1) / 1_000_000 + "ms");
        // ~1ms - RÁPIDO
        
        // Iterator explícito:
        Iterator<Integer> it = lista.iterator();
        while (it.hasNext()) {
            Integer num = it.next();  // O(1)
            processar(num);
        }
        
        
        // ❌ RUIM: get(index) (O(n) cada):
        
        long t3 = System.nanoTime();
        for (int i = 0; i < lista.size(); i++) {
            Integer num = lista.get(i);  // O(n) percorre lista!
            processar(num);
        }
        long t4 = System.nanoTime();
        System.out.println("get(i): " + (t4 - t3) / 1_000_000 + "ms");
        // ~50ms - LENTO (50x mais lento!)
        
        // CADA get(i):
        // - Percorre lista do início
        // - i=0: 1 passo
        // - i=500: 500 passos
        // - i=999: 999 passos
        // Total: O(n²)
        
        
        // ✅ BOM: forEach lambda:
        
        lista.forEach(num -> processar(num));  // Iterator interno
        
        
        // ✅ BOM: Stream:
        
        lista.stream()
             .filter(n -> n % 2 == 0)
             .forEach(n -> processar(n));
        
        
        // COMPARAÇÃO:
        
        /*
         * Método         | Complexidade | Tempo (1000 elem)
         * ------------------------------------------------
         * Iterator       | O(n)         | ~1ms
         * forEach        | O(n)         | ~1ms
         * Stream         | O(n)         | ~2ms
         * get(i) loop    | O(n²)        | ~50ms
         * 
         * CONCLUSÃO:
         * USAR: iterator, forEach, stream
         * EVITAR: loop get(i)
         */
        
        
        // POR QUE Iterator O(1):
        
        // Iterator mantém referência nó atual:
        // class Itr implements Iterator {
        //     Node<E> next = first;  // Nó atual
        //     
        //     public E next() {
        //         E element = next.item;
        //         next = next.next;  // Próximo nó (O(1))
        //         return element;
        //     }
        // }
        
        // Cada next(): apenas next.next (O(1))
        // Total: O(n) para n elementos
        
        
        // POR QUE get(i) O(n):
        
        // get(i) percorre do início SEMPRE:
        // public E get(int index) {
        //     Node<E> x = first;
        //     for (int j = 0; j < index; j++)
        //         x = x.next;  // Percorre
        //     return x.item;
        // }
        
        // Cada get(i): percorre i nós
        // Total: 0 + 1 + 2 + ... + n = O(n²)
    }
    
    static void processar(Integer num) {
        // Processar
    }
}

/*
 * ACESSO SEQUENCIAL:
 * 
 * ✅ USAR:
 * Iterator: O(1) cada, O(n) total
 * forEach: O(1) cada, O(n) total
 * Stream: O(n)
 * 
 * ❌ EVITAR:
 * get(i) loop: O(n) cada, O(n²) total
 * 
 * REGRA:
 * Acesso SEQUENCIAL: Iterator
 * Acesso ALEATÓRIO: ArrayList
 * 
 * USAR LinkedList:
 * Sempre iterator
 * Nunca get(i) loop
 */
```

**Acesso sequencial**: iterator forEach stream O(n) total rápido. EVITAR loop get(i) O(n²) 50x mais lento. LinkedList SEMPRE iterator.

### 5. NÃO Usar: Acesso Aleatório

```java
// ❌ CENÁRIO 5: Acesso aleatório (NÃO usar LinkedList)
public class AcessoAleatorio {
    public static void main(String[] args) {
        int n = 10_000;
        
        // ❌ LinkedList acesso aleatório:
        
        LinkedList<Integer> linked = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            linked.add(i);
        }
        
        // Acesso aleatório (get índice aleatório):
        Random rand = new Random();
        long t1 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            int index = rand.nextInt(n);
            int valor = linked.get(index);  // O(n) LENTO!
        }
        long t2 = System.nanoTime();
        System.out.println("LinkedList get aleatório: " + (t2 - t1) / 1_000_000 + "ms");
        // ~500ms - MUITO LENTO
        
        
        // ✅ ArrayList acesso aleatório:
        
        ArrayList<Integer> array = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            array.add(i);
        }
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            int index = rand.nextInt(n);
            int valor = array.get(index);  // O(1) RÁPIDO!
        }
        long t4 = System.nanoTime();
        System.out.println("ArrayList get aleatório: " + (t4 - t3) / 1_000_000 + "ms");
        // ~1ms - MUITO RÁPIDO (500x mais rápida!)
        
        
        // POR QUE:
        
        // LinkedList.get(5000):
        // Percorre: first → ... → nó 5000 (5000 passos)
        // O(n)
        
        // ArrayList.get(5000):
        // Acesso direto: array[5000] (1 passo)
        // O(1)
        
        
        // CASOS RUINS LinkedList:
        
        // 1. Acesso índice específico:
        int valor1 = linked.get(5000);  // O(n) - LENTO
        
        // 2. Loop get(i):
        for (int i = 0; i < linked.size(); i++) {
            int v = linked.get(i);  // O(n²) - MUITO LENTO
        }
        
        // 3. Busca binária:
        int pos = Collections.binarySearch(linked, 5000);  // O(n log n) - LENTO
        // ArrayList: O(log n)
        
        // 4. set(index):
        linked.set(5000, 999);  // O(n) - LENTO
        // ArrayList: O(1)
        
        
        // CONCLUSÃO:
        
        // LinkedList:
        // - Acesso aleatório: O(n) - EVITAR
        // - Acesso sequencial: O(1) - OK
        
        // ArrayList:
        // - Acesso aleatório: O(1) - IDEAL
        // - Acesso sequencial: O(1) - OK
        
        // REGRA:
        // Acesso aleatório: SEMPRE ArrayList
        // Pontas frequentes: LinkedList
    }
}

/*
 * ACESSO ALEATÓRIO:
 * 
 * ❌ LinkedList:
 * get(index): O(n)
 * set(index): O(n)
 * Loop get(i): O(n²)
 * Busca binária: O(n log n)
 * 
 * ✅ ArrayList:
 * get(index): O(1)
 * set(index): O(1)
 * Loop get(i): O(n)
 * Busca binária: O(log n)
 * 
 * DIFERENÇA:
 * ~100-500x mais rápida
 * 
 * NÃO USAR LinkedList:
 * Acesso aleatório
 * Índices específicos
 * Busca binária
 */
```

**Acesso aleatório**: LinkedList get(i) O(n) LENTO 500x. ArrayList get(i) O(1) direto. NÃO usar LinkedList acesso aleatório índices.

### 6. NÃO Usar: Memória Limitada

```java
// ❌ CENÁRIO 6: Memória limitada (NÃO usar LinkedList)
public class MemoriaLimitada {
    public static void main(String[] args) {
        int n = 1_000_000;
        
        // MEMÓRIA LinkedList:
        
        LinkedList<Integer> linked = new LinkedList<>();
        
        Runtime runtime = Runtime.getRuntime();
        runtime.gc();  // Forçar coleta
        long antes1 = runtime.totalMemory() - runtime.freeMemory();
        
        for (int i = 0; i < n; i++) {
            linked.add(i);
        }
        
        runtime.gc();
        long depois1 = runtime.totalMemory() - runtime.freeMemory();
        long memoriaLinked = depois1 - antes1;
        
        System.out.println("LinkedList memória: " + memoriaLinked / 1_000_000 + "MB");
        // ~56MB para 1M elementos
        
        
        // MEMÓRIA ArrayList:
        
        ArrayList<Integer> array = new ArrayList<>();
        
        runtime.gc();
        long antes2 = runtime.totalMemory() - runtime.freeMemory();
        
        for (int i = 0; i < n; i++) {
            array.add(i);
        }
        
        runtime.gc();
        long depois2 = runtime.totalMemory() - runtime.freeMemory();
        long memoriaArray = depois2 - antes2;
        
        System.out.println("ArrayList memória: " + memoriaArray / 1_000_000 + "MB");
        // ~8MB para 1M elementos
        
        
        // COMPARAÇÃO:
        System.out.println("Diferença: " + (memoriaLinked / memoriaArray) + "x mais memória");
        // ~7x mais memória!
        
        
        // POR QUE:
        
        // LinkedList:
        // Cada elemento: Node objeto
        // Node:
        //   - Object header: 12 bytes
        //   - item referência: 4 bytes
        //   - next referência: 4 bytes
        //   - prev referência: 4 bytes
        //   - Padding: 4 bytes
        // Total: ~28 bytes POR elemento
        // + Integer objeto: ~16 bytes
        // Total: ~44 bytes por Integer
        
        // ArrayList:
        // Array contíguo
        // Cada elemento: referência 4 bytes
        // + Integer objeto: ~16 bytes
        // Total: ~20 bytes por Integer
        
        
        // OVERHEAD:
        
        // 1M Integer:
        // LinkedList: ~44MB
        // ArrayList: ~20MB
        // Overhead: ~24MB (2x mais)
        
        
        // QUANDO CRÍTICO:
        
        // 1. Aplicações embarcadas (memória limitada)
        // 2. Big Data (milhões elementos)
        // 3. Cache (muitos objetos)
        // 4. Mobile (memória escassa)
        
        
        // CONCLUSÃO:
        
        // LinkedList: ~7x mais memória
        // ArrayList: ~1x (baseline)
        
        // NÃO usar LinkedList:
        // Memória limitada
        // Muitos elementos
        // Mobile/embarcado
    }
}

/*
 * MEMÓRIA:
 * 
 * LinkedList:
 * Elemento: ~44 bytes
 * Overhead: Node objeto
 * Total: ~7x ArrayList
 * 
 * ArrayList:
 * Elemento: ~20 bytes
 * Overhead: array
 * Total: baseline
 * 
 * DIFERENÇA:
 * ~7x mais memória
 * 
 * NÃO USAR LinkedList:
 * Memória limitada
 * Big Data
 * Mobile
 * Cache
 */
```

**Memória**: LinkedList ~44 bytes elemento 7x mais ArrayList ~20 bytes. Overhead Node objeto 28 bytes. NÃO usar memória limitada Big Data.

### 7. Comparação ArrayList vs LinkedList

```java
// TABELA COMPARAÇÃO COMPLETA
public class Comparacao {
    public static void main(String[] args) {
        /*
         * OPERAÇÃO              | ArrayList | LinkedList | Vencedor
         * ------------------------------------------------------------
         * get(index)            | O(1)      | O(n)       | ArrayList 500x
         * set(index)            | O(1)      | O(n)       | ArrayList 500x
         * add(element)          | O(1)*     | O(1)       | Empate
         * add(0, element)       | O(n)      | O(1)       | LinkedList 100x
         * add(i, element)       | O(n)      | O(n)       | ArrayList (cache)
         * remove(index)         | O(n)      | O(n)       | Empate
         * remove(0)             | O(n)      | O(1)       | LinkedList 100x
         * remove(size-1)        | O(1)      | O(1)       | Empate
         * contains(element)     | O(n)      | O(n)       | ArrayList (cache)
         * Iterator.next()       | O(1)      | O(1)       | Empate
         * Loop get(i)           | O(n)      | O(n²)      | ArrayList 50x
         * Busca binária         | O(log n)  | O(n log n) | ArrayList
         * Memória (1M elem)     | ~20MB     | ~140MB     | ArrayList 7x
         * Cache locality        | Excelente | Ruim       | ArrayList
         * Redimensionamento     | Sim       | Não        | LinkedList
         * Permite null          | Sim       | Sim        | Empate
         * Thread-safe           | Não       | Não        | Empate
         * Random access         | Sim       | Não        | ArrayList
         * 
         * * O(1) amortizado, raramente O(n) na expansão
         * 
         * 
         * QUANDO USAR ArrayList:
         * ✅ Acesso aleatório frequente (get/set)
         * ✅ Busca binária
         * ✅ Loop com índice
         * ✅ Memória limitada
         * ✅ Cache-friendly importante
         * ✅ Maioria dos casos (padrão)
         * 
         * QUANDO USAR LinkedList:
         * ✅ Inserção/remoção INÍCIO muito frequente
         * ✅ Fila FIFO (Queue)
         * ✅ Pilha LIFO (Deque)
         * ✅ Acesso SEMPRE sequencial (iterator)
         * ✅ Não redimensionar importante
         * ✅ Implementar Queue/Deque
         * 
         * QUANDO NÃO USAR LinkedList:
         * ❌ Acesso aleatório (get/set)
         * ❌ Loop get(i)
         * ❌ Busca binária
         * ❌ Memória limitada
         * ❌ Big Data (milhões)
         * ❌ Mobile/embarcado
         * 
         * REGRA GERAL:
         * Padrão: ArrayList (95% casos)
         * Especial: LinkedList (fila/pilha pontas)
         */
        
        
        // DECISÃO RÁPIDA:
        
        String decisao = """
            
            PRECISA inserir/remover INÍCIO frequentemente?
            SIM → LinkedList
            NÃO ↓
            
            PRECISA acesso aleatório (get/set)?
            SIM → ArrayList
            NÃO ↓
            
            É FILA ou PILHA?
            SIM → LinkedList (ou ArrayDeque)
            NÃO ↓
            
            Memória limitada?
            SIM → ArrayList
            NÃO ↓
            
            EM DÚVIDA?
            → ArrayList (padrão seguro)
            
            """;
        
        System.out.println(decisao);
    }
}

/*
 * RESUMO COMPARAÇÃO:
 * 
 * ArrayList:
 * - Acesso: O(1)
 * - Início: O(n)
 * - Memória: baixa
 * - Cache: excelente
 * - Padrão: 95% casos
 * 
 * LinkedList:
 * - Acesso: O(n)
 * - Pontas: O(1)
 * - Memória: alta (7x)
 * - Cache: ruim
 * - Especial: fila/pilha
 * 
 * REGRA:
 * Padrão: ArrayList
 * Pontas: LinkedList
 * Dúvida: ArrayList
 */
```

**Comparação**: ArrayList acesso O(1) memória baixa cache excelente padrão 95%. LinkedList pontas O(1) memória 7x fila pilha especial. Dúvida ArrayList.

### 8. Resumo Quando Usar

```java
/*
 * QUANDO USAR LinkedList
 * 
 * ✅ USAR:
 * 
 * 1. Fila FIFO:
 *    Queue<E> fila = new LinkedList<>();
 *    fila.offer(e);  // O(1) fim
 *    fila.poll();    // O(1) início
 * 
 * 2. Pilha LIFO:
 *    Deque<E> pilha = new LinkedList<>();
 *    pilha.push(e);  // O(1) início
 *    pilha.pop();    // O(1) início
 * 
 * 3. Inserção/remoção início:
 *    lista.addFirst(e);     // O(1)
 *    lista.removeFirst();   // O(1)
 * 
 * 4. Acesso sequencial:
 *    for (E elem : lista)   // Iterator O(1) cada
 * 
 * 5. Implementar Queue/Deque:
 *    Métodos específicos
 * 
 * 
 * ❌ NÃO USAR:
 * 
 * 1. Acesso aleatório:
 *    lista.get(i)    // O(n) - LENTO
 * 
 * 2. Loop get(i):
 *    for (i=0; i<n; i++)
 *        get(i)       // O(n²) - MUITO LENTO
 * 
 * 3. Busca binária:
 *    Collections.binarySearch()  // O(n log n)
 * 
 * 4. Memória limitada:
 *    ~7x mais memória
 * 
 * 5. Big Data:
 *    Milhões elementos
 * 
 * 
 * ALTERNATIVAS:
 * 
 * Fila/Pilha SEM null:
 * ArrayDeque (mais rápida)
 * 
 * Fila/Pilha COM null ou List:
 * LinkedList
 * 
 * Acesso aleatório:
 * ArrayList
 * 
 * 
 * REGRA OURO:
 * 
 * Pontas O(1) → LinkedList
 * Acesso O(1) → ArrayList
 * Dúvida → ArrayList (padrão)
 */

// EXEMPLO DECISÃO
public class ExemploDecisao {
    public static void main(String[] args) {
        // ✅ Fila FIFO:
        Queue<String> fila = new LinkedList<>();
        fila.offer("A");
        fila.poll();
        
        // ✅ Pilha LIFO:
        Deque<String> pilha = new LinkedList<>();
        pilha.push("A");
        pilha.pop();
        
        // ❌ Acesso aleatório:
        // NÃO: LinkedList
        // SIM: ArrayList
        List<String> lista = new ArrayList<>();
        lista.get(100);
        
        // ✅ Acesso sequencial:
        LinkedList<String> seq = new LinkedList<>();
        for (String s : seq) {  // OK
            // Processar
        }
        
        System.out.println("Decisões corretas!");
    }
}
```

---

## Aplicabilidade

**Usar LinkedList**:
- **Fila FIFO**: Queue interface offer poll peek processamento ordem chegada O(1) pontas
- **Pilha LIFO**: Deque interface push pop peek desfazer histórico O(1) início
- **Inserção/remoção pontas**: addFirst addLast removeFirst removeLast O(1) frequente
- **Acesso sequencial**: iterator forEach stream O(n) total NUNCA loop get(i)

**NÃO usar LinkedList**:
- **Acesso aleatório**: get(i) set(i) O(n) LENTO usar ArrayList O(1)
- **Loop get(i)**: O(n²) MUITO LENTO 50x usar ArrayList ou iterator
- **Memória limitada**: 7x mais memória usar ArrayList Big Data mobile
- **Busca binária**: O(n log n) LENTO usar ArrayList O(log n)

---

## Armadilhas

### 1. Loop get(i)

```java
// ❌ O(n²) MUITO LENTO
for (int i = 0; i < lista.size(); i++) {
    lista.get(i);  // Cada: O(n)
}

// ✅ O(n) RÁPIDO
for (E elem : lista) {  // Iterator
    // Processar
}
```

### 2. Acesso Aleatório

```java
// ❌ LinkedList acesso aleatório
LinkedList<Integer> linked = new LinkedList<>();
int valor = linked.get(5000);  // O(n)

// ✅ ArrayList acesso aleatório
ArrayList<Integer> array = new ArrayList<>();
int valor2 = array.get(5000);  // O(1)
```

---

## Boas Práticas

### 1. Interface Variável

```java
// ✅ Fila: Queue
Queue<String> fila = new LinkedList<>();

// ✅ Pilha: Deque
Deque<String> pilha = new LinkedList<>();

// ✅ Lista: List (mas preferir ArrayList)
List<String> lista = new ArrayList<>();  // Padrão
```

### 2. Iterator Sequencial

```java
// ✅ SEMPRE iterator
for (E elem : lista) {
    // O(1) cada
}

// ❌ NUNCA loop get(i)
for (int i = 0; i < lista.size(); i++) {
    lista.get(i);  // O(n) cada
}
```

### 3. Preferir ArrayDeque

```java
// ✅ Fila SEM null (mais rápida)
Deque<String> deque = new ArrayDeque<>();

// ✅ Fila COM null ou List
Queue<String> fila = new LinkedList<>();
```

---

## Resumo

**USAR LinkedList**:
- **Fila FIFO**: Queue interface offer fim poll início O(1) processamento ordem chegada tarefas sequenciais mensageria buffers permite null implementa List
- **Pilha LIFO**: Deque interface push pop peek início O(1) desfazer ações navegação histórico avaliação expressões substitui Stack obsoleta moderna
- **Inserção/remoção pontas**: addFirst addLast removeFirst removeLast O(1) acesso direto first last ponteiros sem redimensionamento sem cópia array ~100x mais rápida ArrayList remove(0)
- **Acesso sequencial**: iterator forEach stream O(1) cada O(n) total mantém referência nó percorre next direto NUNCA loop get(i) O(n²)

**NÃO USAR LinkedList**:
- **Acesso aleatório**: get(i) set(i) O(n) percorre lista ArrayList O(1) array direto ~500x mais rápida loop get(i) O(n²) MUITO LENTO
- **Busca binária**: Collections.binarySearch O(n log n) ArrayList O(log n) LinkedList não RandomAccess não suporta eficiente
- **Memória limitada**: ~44 bytes elemento 7x ArrayList ~20 bytes overhead Node objeto 28 bytes header campos padding Big Data milhões elementos mobile embarcado cache
- **Maioria casos**: ArrayList padrão 95% casos acesso O(1) memória baixa cache excelente redimensionamento aceitável

**Comparação**:
- **ArrayList**: acesso O(1) get set direto array início O(n) desloca elementos memória baixa ~20 bytes cache excelente contíguo padrão 95% casos
- **LinkedList**: pontas O(1) addFirst removeFirst direto ponteiros acesso O(n) percorre memória alta ~44 bytes 7x mais cache ruim nós espalhados especial 5% fila pilha

**Alternativas**:
- **ArrayDeque**: Queue Deque SEM null 2x mais rápida LinkedList array circular cache friendly padrão fila pilha
- **LinkedList**: Queue Deque COM null ou List permite null implementa List memória dinâmica

**Regra de Ouro**: LinkedList USAR fila FIFO Queue offer poll pilha LIFO Deque push pop inserção remoção pontas O1 frequente acesso sequencial iterator forEach NUNCA loop geti On². NÃO USAR acesso aleatório geti seti On ArrayList O1 500x mais rápida loop geti On² MUITO LENTO busca binária On log n memória limitada 7x mais Big Data mobile. COMPARAÇÃO ArrayList acesso O1 memória baixa cache excelente padrão 95% LinkedList pontas O1 memória 7x especial fila pilha. ALTERNATIVA ArrayDeque Queue Deque SEM null 2x mais rápida padrão LinkedList COM null List. DECISÃO pontas frequente LinkedList acesso aleatório ArrayList DÚVIDA ArrayList padrão seguro. SEMPRE iterator forEach NÃO loop geti. INTERFACE Queue fila Deque pilha List genérico. PERFORMANCE ArrayList maioria LinkedList pontas específicas.

