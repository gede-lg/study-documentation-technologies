# T3.05 - Implementa Queue e Deque

## Introdução

**Queue/Deque**: LinkedList implementa Queue (fila FIFO) Deque (double-ended queue pontas). Métodos específicos offer poll peek element.

```java
import java.util.*;

// LinkedList implementa Queue e Deque
public class QueueDeque {
    public static void main(String[] args) {
        // QUEUE: fila FIFO (First In, First Out)
        Queue<String> fila = new LinkedList<>();
        
        fila.offer("Cliente 1");  // Adicionar fim
        fila.offer("Cliente 2");
        fila.offer("Cliente 3");
        
        // Processar FIFO:
        while (!fila.isEmpty()) {
            String cliente = fila.poll();  // Remover início
            System.out.println("Atendendo: " + cliente);
        }
        
        // DEQUE: double-ended queue (ambas pontas)
        Deque<String> deque = new LinkedList<>();
        
        deque.offerFirst("A");  // Início
        deque.offerLast("Z");   // Fim
        
        String primeiro = deque.pollFirst();  // Início
        String ultimo = deque.pollLast();     // Fim
        
        // VANTAGENS:
        // - Queue: métodos específicos fila
        // - Deque: flexibilidade ambas pontas
        // - LinkedList: O(1) todas operações
        
        System.out.println("Primeiro: " + primeiro);
        System.out.println("Último: " + ultimo);
    }
}
```

**Queue/Deque**: LinkedList implementa interfaces fila FIFO Deque pontas. Métodos offer poll peek O(1) eficiente.

---

## Fundamentos

### 1. Interface Queue

```java
// INTERFACE QUEUE: fila FIFO
public class InterfaceQueue {
    public static void main(String[] args) {
        // Queue: First In, First Out
        // Primeiro entra, primeiro sai
        
        Queue<String> fila = new LinkedList<>();
        
        // HIERARQUIA:
        // Collection
        //    ↓
        //  Queue
        //    ↓
        // LinkedList
        
        // MÉTODOS QUEUE (2 grupos):
        
        // GRUPO 1: EXCEÇÃO se falhar
        boolean add = fila.add("A");           // Adicionar (true/exceção)
        String remove = fila.remove();         // Remover início (elemento/exceção)
        String element = fila.element();       // Ver início (elemento/exceção)
        
        // GRUPO 2: VALOR ESPECIAL se falhar
        boolean offer = fila.offer("B");       // Adicionar (true/false)
        String poll = fila.poll();             // Remover início (elemento/null)
        String peek = fila.peek();             // Ver início (elemento/null)
        
        // COMPARAÇÃO:
        
        // Adicionar:
        // add(e): exceção se não pode
        // offer(e): retorna false se não pode
        
        // Remover:
        // remove(): NoSuchElementException vazia
        // poll(): retorna null vazia
        
        // Ver:
        // element(): NoSuchElementException vazia
        // peek(): retorna null vazia
        
        // QUEUE vs List:
        
        // Queue: métodos específicos fila
        // offer(), poll(), peek()
        // Intenção clara: fila FIFO
        
        // List: métodos gerais
        // add(), remove(index), get(index)
        // Mais genérico
        
        // LINKEDLIST implementa AMBAS:
        Queue<String> q = new LinkedList<>();  // Queue
        List<String> l = new LinkedList<>();   // List
        
        // Preferir Queue para fila
        // Preferir List para lista genérica
        
        System.out.println(fila);
    }
}

/*
 * INTERFACE QUEUE:
 * 
 * OBJETIVO:
 * Fila FIFO
 * Primeiro entra, primeiro sai
 * 
 * MÉTODOS (2 grupos):
 * 
 * EXCEÇÃO:
 * add(e): adicionar (exceção)
 * remove(): remover (exceção vazia)
 * element(): ver (exceção vazia)
 * 
 * VALOR ESPECIAL:
 * offer(e): adicionar (false)
 * poll(): remover (null vazia)
 * peek(): ver (null vazia)
 * 
 * QUANDO USAR:
 * offer/poll/peek: preferir (seguro)
 * add/remove/element: exceção desejada
 * 
 * LINKEDLIST:
 * Implementa Queue
 * O(1) offer/poll/peek
 * Ideal fila
 */
```

**Queue**: fila FIFO Collection interface. Métodos exceção (add remove element) valor especial (offer poll peek). LinkedList implementa O(1).

### 2. Interface Deque

```java
// INTERFACE DEQUE: double-ended queue
public class InterfaceDeque {
    public static void main(String[] args) {
        // Deque: double-ended queue
        // Fila de dupla extremidade
        // Operações AMBAS pontas
        
        Deque<String> deque = new LinkedList<>();
        
        // HIERARQUIA:
        // Collection
        //    ↓
        //  Queue
        //    ↓
        //  Deque
        //    ↓
        // LinkedList
        
        // MÉTODOS DEQUE (3 categorias × 2 pontas):
        
        // 1. ADICIONAR (4 métodos × 2 pontas):
        
        // INÍCIO:
        deque.addFirst("A");      // Exceção se falha
        deque.offerFirst("B");    // false se falha
        
        // FIM:
        deque.addLast("Y");       // Exceção se falha
        deque.offerLast("Z");     // false se falha
        
        // 2. REMOVER (4 métodos × 2 pontas):
        
        // INÍCIO:
        String r1 = deque.removeFirst();  // Exceção vazia
        String r2 = deque.pollFirst();    // null vazia
        
        // FIM:
        String r3 = deque.removeLast();   // Exceção vazia
        String r4 = deque.pollLast();     // null vazia
        
        // 3. VER (4 métodos × 2 pontas):
        
        // INÍCIO:
        String v1 = deque.getFirst();   // Exceção vazia
        String v2 = deque.peekFirst();  // null vazia
        
        // FIM:
        String v3 = deque.getLast();    // Exceção vazia
        String v4 = deque.peekLast();   // null vazia
        
        // MÉTODOS PILHA (compatibilidade Stack):
        
        deque.push("Item");      // addFirst()
        String pop = deque.pop();        // removeFirst()
        String peek = deque.peek();      // peekFirst()
        
        // EQUIVALÊNCIAS Queue:
        
        // Queue.offer(e) == Deque.offerLast(e)
        // Queue.poll() == Deque.pollFirst()
        // Queue.peek() == Deque.peekFirst()
        
        // EQUIVALÊNCIAS Stack:
        
        // Stack.push(e) == Deque.addFirst(e)
        // Stack.pop() == Deque.removeFirst()
        // Stack.peek() == Deque.peekFirst()
        
        // VANTAGENS DEQUE:
        
        // Substitui Stack: thread-safe não necessário
        // Mais flexível Queue: ambas pontas
        // LinkedList: O(1) todas operações
        
        System.out.println(deque);
    }
}

/*
 * INTERFACE DEQUE:
 * 
 * OBJETIVO:
 * Double-ended queue
 * Operações ambas pontas
 * 
 * MÉTODOS (First/Last):
 * 
 * ADICIONAR:
 * addFirst/addLast: exceção
 * offerFirst/offerLast: false
 * 
 * REMOVER:
 * removeFirst/removeLast: exceção
 * pollFirst/pollLast: null
 * 
 * VER:
 * getFirst/getLast: exceção
 * peekFirst/peekLast: null
 * 
 * PILHA:
 * push: addFirst
 * pop: removeFirst
 * peek: peekFirst
 * 
 * VANTAGENS:
 * Flexível ambas pontas
 * Substitui Stack
 * Queue + pilha
 * 
 * LINKEDLIST:
 * Implementa Deque
 * O(1) ambas pontas
 * Ideal deque
 */
```

**Deque**: double-ended queue Queue interface. Operações ambas pontas First/Last. Métodos exceção (add remove get) valor especial (offer poll peek). LinkedList O(1).

### 3. Métodos Queue

```java
// MÉTODOS QUEUE: offer, poll, peek
public class MetodosQueue {
    public static void main(String[] args) {
        Queue<String> fila = new LinkedList<>();
        
        // 1. offer(e): ADICIONAR fim
        
        boolean r1 = fila.offer("Cliente 1");  // true
        boolean r2 = fila.offer("Cliente 2");  // true
        boolean r3 = fila.offer("Cliente 3");  // true
        
        // Fila: [Cliente 1, Cliente 2, Cliente 3]
        //        ↑ próximo (início)
        
        // RETORNO:
        // true: adicionou
        // false: não adicionou (capacidade limitada)
        
        // COMPLEXIDADE: O(1)
        // LinkedList: adiciona fim
        
        // EQUIVALENTE:
        // offer(e) == add(e) == addLast(e)
        // MAS offer retorna boolean
        //     add lança exceção
        
        
        // 2. poll(): REMOVER início
        
        String cliente1 = fila.poll();  // "Cliente 1"
        // Fila: [Cliente 2, Cliente 3]
        
        String cliente2 = fila.poll();  // "Cliente 2"
        // Fila: [Cliente 3]
        
        String cliente3 = fila.poll();  // "Cliente 3"
        // Fila: []
        
        String cliente4 = fila.poll();  // null (vazia)
        
        // RETORNO:
        // elemento: removeu e retornou
        // null: fila vazia
        
        // COMPLEXIDADE: O(1)
        // LinkedList: remove início
        
        // EQUIVALENTE:
        // poll() == pollFirst() == removeFirst() (se não vazia)
        // MAS poll retorna null
        //     remove lança exceção
        
        
        // 3. peek(): VER início (NÃO remove)
        
        fila.offer("A");
        fila.offer("B");
        
        String ver1 = fila.peek();  // "A" (NÃO remove)
        String ver2 = fila.peek();  // "A" (ainda lá)
        // Fila: [A, B]
        
        fila.poll();  // Remove "A"
        String ver3 = fila.peek();  // "B"
        // Fila: [B]
        
        fila.poll();  // Remove "B"
        String ver4 = fila.peek();  // null (vazia)
        
        // RETORNO:
        // elemento: próximo elemento (NÃO remove)
        // null: fila vazia
        
        // COMPLEXIDADE: O(1)
        // LinkedList: acessa primeiro
        
        // EQUIVALENTE:
        // peek() == peekFirst() == getFirst() (se não vazia)
        // MAS peek retorna null
        //     getFirst lança exceção
        
        
        // USO TÍPICO (processar fila):
        
        Queue<String> tarefas = new LinkedList<>();
        tarefas.offer("Tarefa 1");
        tarefas.offer("Tarefa 2");
        tarefas.offer("Tarefa 3");
        
        // Processar todas:
        String tarefa;
        while ((tarefa = tarefas.poll()) != null) {
            System.out.println("Executando: " + tarefa);
        }
        
        // Verificar próxima sem remover:
        String proxima = tarefas.peek();
        if (proxima != null) {
            System.out.println("Próxima: " + proxima);
            // Decidir se processar
            if (condicao) {
                tarefas.poll();  // Processar
            }
        }
        
        System.out.println(fila);
    }
    
    static boolean condicao = true;
}

/*
 * MÉTODOS QUEUE:
 * 
 * offer(e):
 * - Adiciona fim
 * - Retorna true/false
 * - O(1)
 * - Equivale add(e)
 * - Preferir: seguro
 * 
 * poll():
 * - Remove início
 * - Retorna elemento/null
 * - O(1)
 * - Equivale remove()
 * - Preferir: seguro
 * 
 * peek():
 * - Ver início
 * - NÃO remove
 * - Retorna elemento/null
 * - O(1)
 * - Equivale element()
 * - Preferir: seguro
 * 
 * PADRÃO:
 * offer → adicionar
 * poll → remover e processar
 * peek → verificar antes
 * 
 * VANTAGENS:
 * Seguros (null)
 * Claros (fila)
 * O(1) LinkedList
 */
```

**Métodos Queue**: offer adiciona fim true/false, poll remove início elemento/null, peek vê início NÃO remove elemento/null. O(1) LinkedList seguro.

### 4. Métodos Deque

```java
// MÉTODOS DEQUE: operações ambas pontas
public class MetodosDeque {
    public static void main(String[] args) {
        Deque<String> deque = new LinkedList<>();
        
        // CATEGORIA 1: ADICIONAR
        
        // offerFirst(e): adicionar INÍCIO
        deque.offerFirst("C");  // [C]
        deque.offerFirst("B");  // [B, C]
        deque.offerFirst("A");  // [A, B, C]
        
        // offerLast(e): adicionar FIM
        deque.offerLast("X");   // [A, B, C, X]
        deque.offerLast("Y");   // [A, B, C, X, Y]
        deque.offerLast("Z");   // [A, B, C, X, Y, Z]
        
        // COMPLEXIDADE: O(1) ambos
        // LinkedList: acesso direto first/last
        
        // RETORNO: true/false
        
        
        // CATEGORIA 2: REMOVER
        
        // pollFirst(): remover INÍCIO
        String inicio1 = deque.pollFirst();  // "A"
        // Deque: [B, C, X, Y, Z]
        
        // pollLast(): remover FIM
        String fim1 = deque.pollLast();      // "Z"
        // Deque: [B, C, X, Y]
        
        // COMPLEXIDADE: O(1) ambos
        // LinkedList: acesso direto first/last
        
        // RETORNO: elemento/null
        
        
        // CATEGORIA 3: VER (NÃO remove)
        
        // peekFirst(): ver INÍCIO
        String inicio2 = deque.peekFirst();  // "B" (NÃO remove)
        // Deque: [B, C, X, Y]
        
        // peekLast(): ver FIM
        String fim2 = deque.peekLast();      // "Y" (NÃO remove)
        // Deque: [B, C, X, Y]
        
        // COMPLEXIDADE: O(1) ambos
        // LinkedList: acessa first/last
        
        // RETORNO: elemento/null
        
        
        // MÉTODOS PILHA:
        
        Deque<String> pilha = new LinkedList<>();
        
        // push(e): empilhar (início)
        pilha.push("Item 1");  // [Item 1]
        pilha.push("Item 2");  // [Item 2, Item 1]
        pilha.push("Item 3");  // [Item 3, Item 2, Item 1]
        //                         ↑ topo
        
        // peek(): ver topo (NÃO remove)
        String topo = pilha.peek();  // "Item 3"
        
        // pop(): desempilhar (início)
        String item1 = pilha.pop();  // "Item 3"
        String item2 = pilha.pop();  // "Item 2"
        String item3 = pilha.pop();  // "Item 1"
        
        // EQUIVALÊNCIAS:
        // push(e) == addFirst(e)
        // pop() == removeFirst()
        // peek() == peekFirst()
        
        
        // TABELA EQUIVALÊNCIAS:
        
        // Deque          Queue           List
        // ------------------------------------------
        // offerFirst     -               add(0)
        // offerLast      offer           add
        // pollFirst      poll            remove(0)
        // pollLast       -               remove(size-1)
        // peekFirst      peek            get(0)
        // peekLast       -               get(size-1)
        // push           -               add(0)
        // pop            -               remove(0)
        
        
        // USO TÍPICO:
        
        Deque<String> buffer = new LinkedList<>();
        
        // Adicionar início/fim conforme necessário:
        buffer.offerFirst("Urgente");  // Prioridade
        buffer.offerLast("Normal");    // Ordem
        
        // Processar início:
        String proc1 = buffer.pollFirst();
        
        // Processar fim:
        String proc2 = buffer.pollLast();
        
        // Verificar antes:
        String prox = buffer.peekFirst();
        if (prox != null) {
            // Decidir
        }
        
        System.out.println(deque);
    }
}

/*
 * MÉTODOS DEQUE:
 * 
 * ADICIONAR:
 * offerFirst: início true/false O(1)
 * offerLast: fim true/false O(1)
 * 
 * REMOVER:
 * pollFirst: início elemento/null O(1)
 * pollLast: fim elemento/null O(1)
 * 
 * VER:
 * peekFirst: início elemento/null O(1)
 * peekLast: fim elemento/null O(1)
 * 
 * PILHA:
 * push: addFirst
 * pop: removeFirst exceção
 * peek: peekFirst null
 * 
 * VANTAGENS:
 * Flexibilidade pontas
 * Seguros (null/false)
 * O(1) LinkedList
 * 
 * USO:
 * Deque completo
 * Pilha LIFO
 * Fila prioridade
 */
```

**Métodos Deque**: offerFirst/offerLast adicionam pontas, pollFirst/pollLast removem, peekFirst/peekLast veem. push/pop/peek pilha. O(1) LinkedList ambas pontas.

### 5. Fila FIFO com Queue

```java
// FILA FIFO com Interface Queue
public class FilaFIFOQueue {
    public static void main(String[] args) {
        // USAR Queue INTERFACE para fila
        Queue<String> fila = new LinkedList<>();
        
        // PROCESSAR PEDIDOS:
        
        // 1. CHEGADA pedidos (offer fim):
        fila.offer("Pedido #1");
        fila.offer("Pedido #2");
        fila.offer("Pedido #3");
        fila.offer("Pedido #4");
        fila.offer("Pedido #5");
        
        // Fila: [#1, #2, #3, #4, #5]
        //        ↑ próximo
        
        // 2. PROCESSAR ordem chegada (poll início):
        
        System.out.println("=== Processando Pedidos ===");
        
        String pedido;
        while ((pedido = fila.poll()) != null) {
            processar(pedido);
        }
        
        // ORDEM PROCESSAMENTO:
        // #1 (primeiro) → #2 → #3 → #4 → #5 (último)
        // FIFO: First In, First Out
        
        
        // VERIFICAR ANTES PROCESSAR:
        
        fila.offer("Pedido A");
        fila.offer("Pedido B");
        fila.offer("Pedido C");
        
        while (!fila.isEmpty()) {
            // Ver próximo (peek):
            String proximo = fila.peek();
            System.out.println("\nPróximo: " + proximo);
            
            // Decidir se processar:
            if (podePprocessar()) {
                String proc = fila.poll();  // Remove e processa
                processar(proc);
            } else {
                System.out.println("Aguardando...");
                break;
            }
        }
        
        
        // FILA COM TIMEOUT:
        
        Queue<String> buffer = new LinkedList<>();
        buffer.offer("Tarefa 1");
        buffer.offer("Tarefa 2");
        
        // Processar com limite:
        int processados = 0;
        int limite = 10;
        
        String tarefa;
        while ((tarefa = buffer.poll()) != null && processados < limite) {
            processar(tarefa);
            processados++;
        }
        
        
        // VANTAGENS Queue INTERFACE:
        
        // 1. Métodos específicos: offer/poll/peek
        // 2. Intenção clara: fila FIFO
        // 3. Código limpo: sem índices
        // 4. Seguro: null em vez exceção
        // 5. Flexível: trocar implementação
        
        // TROCAR IMPLEMENTAÇÃO:
        Queue<String> q1 = new LinkedList<>();       // Ilimitada
        Queue<String> q2 = new ArrayDeque<>();       // Mais rápida
        Queue<String> q3 = new PriorityQueue<>();    // Ordenada
        // Código permanece igual!
        
        System.out.println("\n" + fila);
    }
    
    static void processar(String pedido) {
        System.out.println("Processando: " + pedido);
    }
    
    static boolean podeProcessar() {
        return true;
    }
}

/*
 * FILA FIFO QUEUE:
 * 
 * INTERFACE:
 * Queue<E> fila = new LinkedList<>();
 * 
 * OPERAÇÕES:
 * offer: adicionar fim
 * poll: remover início
 * peek: ver próximo
 * 
 * PADRÃO:
 * while ((item = fila.poll()) != null)
 * 
 * VANTAGENS:
 * Métodos específicos
 * Intenção clara
 * Código limpo
 * Seguro null
 * Flexível implementação
 * 
 * USO:
 * Processamento ordem
 * Tarefas sequenciais
 * Buffers
 * Mensagens
 */
```

**Fila FIFO Queue**: interface Queue métodos offer poll peek. Padrão while poll null processa ordem. Limpo seguro flexível implementação.

### 6. Pilha LIFO com Deque

```java
// PILHA LIFO com Interface Deque
public class PilhaLIFODeque {
    public static void main(String[] args) {
        // USAR Deque INTERFACE para pilha
        // NÃO usar Stack (obsoleto, thread-safe desnecessário)
        
        Deque<String> pilha = new LinkedList<>();
        
        // NAVEGAÇÃO HISTÓRICO:
        
        // 1. NAVEGAR páginas (push início):
        pilha.push("google.com");
        pilha.push("youtube.com");
        pilha.push("github.com");
        pilha.push("stackoverflow.com");
        
        // Pilha: [stackoverflow, github, youtube, google]
        //         ↑ topo (atual)
        
        // 2. VOLTAR páginas (pop início):
        
        System.out.println("=== Navegação ===");
        System.out.println("Página atual: " + pilha.peek());
        
        System.out.println("\nVoltando...");
        String pagina1 = pilha.pop();  // stackoverflow
        System.out.println("Saiu: " + pagina1);
        System.out.println("Atual: " + pilha.peek());  // github
        
        System.out.println("\nVoltando...");
        String pagina2 = pilha.pop();  // github
        System.out.println("Saiu: " + pagina2);
        System.out.println("Atual: " + pilha.peek());  // youtube
        
        // ORDEM SAÍDA:
        // stackoverflow (último) → github → youtube → google (primeiro)
        // LIFO: Last In, First Out
        
        
        // DESFAZER AÇÕES:
        
        Deque<String> acoes = new LinkedList<>();
        
        // Executar ações:
        executar("Criar arquivo", acoes);
        executar("Editar texto", acoes);
        executar("Formatar código", acoes);
        executar("Salvar arquivo", acoes);
        
        // Desfazer (LIFO):
        System.out.println("\n=== Desfazendo ===");
        
        while (!acoes.isEmpty()) {
            String acao = acoes.pop();
            System.out.println("Desfazendo: " + acao);
        }
        
        // ORDEM DESFAZER:
        // Salvar → Formatar → Editar → Criar
        // Inverso da execução
        
        
        // VERIFICAR ANTES DESEMPILHAR:
        
        Deque<Integer> numeros = new LinkedList<>();
        numeros.push(10);
        numeros.push(20);
        numeros.push(30);
        
        // Ver topo sem remover:
        Integer topo = numeros.peek();
        if (topo != null && topo > 15) {
            numeros.pop();  // Remove
        }
        
        
        // VANTAGENS Deque vs Stack:
        
        // Deque:
        // - Mais rápida (não thread-safe)
        // - Interface moderna
        // - Métodos consistentes (push/pop/peek)
        // - Flexível (pode usar como fila também)
        
        // Stack (EVITAR):
        // - Thread-safe (overhead desnecessário)
        // - Classe legada (Vector)
        // - Métodos inconsistentes
        
        // TROCAR IMPLEMENTAÇÃO:
        Deque<String> d1 = new LinkedList<>();   // Padrão
        Deque<String> d2 = new ArrayDeque<>();   // Mais rápida
        // Código permanece igual!
        
        System.out.println("\n" + pilha);
    }
    
    static void executar(String acao, Deque<String> historico) {
        System.out.println("Executando: " + acao);
        historico.push(acao);  // Adiciona ao histórico
    }
}

/*
 * PILHA LIFO DEQUE:
 * 
 * INTERFACE:
 * Deque<E> pilha = new LinkedList<>();
 * 
 * OPERAÇÕES:
 * push: empilhar início
 * pop: desempilhar início
 * peek: ver topo
 * 
 * PADRÃO:
 * while (!pilha.isEmpty()) {
 *     E item = pilha.pop();
 * }
 * 
 * VANTAGENS:
 * Moderna (não Stack)
 * Mais rápida
 * Consistente
 * Flexível
 * 
 * USO:
 * Desfazer ações
 * Navegação histórico
 * Avaliação expressões
 * Recursão iterativa
 */
```

**Pilha LIFO Deque**: interface Deque métodos push pop peek. Padrão while isEmpty pop processa inverso. Moderna rápida NÃO Stack.

### 7. Comparação Implementações

```java
// COMPARAÇÃO: LinkedList vs ArrayDeque
public class ComparacaoImplementacoes {
    public static void main(String[] args) {
        // QUEUE/DEQUE têm 2 implementações principais:
        
        // 1. LinkedList:
        Queue<String> linkedQueue = new LinkedList<>();
        Deque<String> linkedDeque = new LinkedList<>();
        
        // 2. ArrayDeque:
        Queue<String> arrayQueue = new ArrayDeque<>();
        Deque<String> arrayDeque = new ArrayDeque<>();
        
        
        // LINKEDLIST:
        
        // ESTRUTURA:
        // Lista duplamente encadeada
        // Nós com prev/next
        
        // VANTAGENS:
        // - Permite null elementos
        // - Implementa List também
        // - Memória dinâmica (sem redimensionamento)
        
        // DESVANTAGENS:
        // - Mais lenta (overhead nós)
        // - Mais memória (28 bytes/elemento)
        // - Cache unfriendly
        
        // QUANDO:
        // - Precisa null
        // - Usa como List também
        // - Tamanho muito variável
        
        
        // ARRAYDEQUE:
        
        // ESTRUTURA:
        // Array circular
        // head/tail índices
        
        // VANTAGENS:
        // - Mais rápida (~2x)
        // - Menos memória
        // - Cache friendly
        
        // DESVANTAGENS:
        // - NÃO permite null
        // - NÃO implementa List
        // - Redimensionamento ocasional
        
        // QUANDO:
        // - NÃO precisa null
        // - Só Queue/Deque (não List)
        // - Performance importante
        
        
        // PERFORMANCE:
        
        // QUEUE operações:
        int n = 1_000_000;
        
        // LinkedList:
        Queue<Integer> lq = new LinkedList<>();
        long t1 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            lq.offer(i);
        }
        for (int i = 0; i < n; i++) {
            lq.poll();
        }
        long t2 = System.nanoTime();
        System.out.println("LinkedList: " + (t2 - t1) / 1_000_000 + "ms");
        
        // ArrayDeque:
        Queue<Integer> aq = new ArrayDeque<>();
        long t3 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            aq.offer(i);
        }
        for (int i = 0; i < n; i++) {
            aq.poll();
        }
        long t4 = System.nanoTime();
        System.out.println("ArrayDeque: " + (t4 - t3) / 1_000_000 + "ms");
        
        // RESULTADO:
        // ArrayDeque ~2x mais rápida
        
        
        // TABELA COMPARAÇÃO:
        
        /*
         * Característica  | LinkedList | ArrayDeque
         * ----------------------------------------
         * Estrutura       | Linked     | Array
         * null            | SIM        | NÃO
         * List            | SIM        | NÃO
         * Performance     | Lenta      | Rápida
         * Memória         | Alta       | Baixa
         * Redimensionar   | Não        | Sim
         * Cache           | Ruim       | Bom
         * 
         * RECOMENDAÇÃO:
         * Padrão: ArrayDeque (mais rápida)
         * Especial: LinkedList (se precisa null/List)
         */
    }
}

/*
 * COMPARAÇÃO:
 * 
 * LINKEDLIST:
 * Estrutura: linked
 * null: SIM
 * List: SIM
 * Performance: lenta
 * Memória: alta
 * 
 * ARRAYDEQUE:
 * Estrutura: array
 * null: NÃO
 * List: NÃO
 * Performance: rápida
 * Memória: baixa
 * 
 * RECOMENDAÇÃO:
 * Padrão: ArrayDeque
 * Especial: LinkedList (null/List)
 */
```

**Comparação**: LinkedList linked null List lenta alta memória. ArrayDeque array rápida 2x baixa memória NÃO null List. Padrão ArrayDeque.

### 8. Resumo Interfaces

```java
/*
 * Queue e Deque
 * 
 * QUEUE:
 * - Fila FIFO
 * - Métodos: offer, poll, peek
 * - Adiciona fim, remove início
 * - LinkedList implementa
 * - O(1) operações
 * 
 * DEQUE:
 * - Double-ended queue
 * - Métodos: offerFirst/Last, pollFirst/Last, peekFirst/Last
 * - Operações ambas pontas
 * - Substitui Stack
 * - LinkedList implementa
 * - O(1) ambas pontas
 * 
 * LINKEDLIST:
 * - Implementa List, Queue, Deque
 * - Lista duplamente encadeada
 * - O(1) pontas (offer, poll, push, pop)
 * - Permite null
 * - Mais lenta ArrayDeque
 * 
 * QUANDO USAR:
 * 
 * Queue:
 * - Fila FIFO
 * - Processamento ordem
 * - Tarefas sequenciais
 * 
 * Deque:
 * - Pilha LIFO (substituir Stack)
 * - Fila ambas pontas
 * - Histórico/Desfazer
 * 
 * LinkedList:
 * - Precisa null
 * - Usa List também
 * - Tamanho variável
 * 
 * ArrayDeque:
 * - Performance (padrão)
 * - NÃO precisa null
 * - Só Queue/Deque
 */

// EXEMPLO COMPLETO
public class ExemploCompleto {
    public static void main(String[] args) {
        // FILA:
        Queue<String> fila = new LinkedList<>();
        fila.offer("A");
        String removido = fila.poll();
        
        // DEQUE:
        Deque<String> deque = new LinkedList<>();
        deque.offerFirst("X");
        deque.offerLast("Y");
        String inicio = deque.pollFirst();
        String fim = deque.pollLast();
        
        // PILHA:
        Deque<String> pilha = new LinkedList<>();
        pilha.push("Item");
        String topo = pilha.pop();
        
        System.out.println("OK");
    }
}
```

---

## Aplicabilidade

**Interfaces usar**:
- **Queue**: fila FIFO processamento ordem tarefas sequenciais buffers métodos offer poll peek
- **Deque**: pilha LIFO substituir Stack operações ambas pontas histórico desfazer métodos push pop offerFirst offerLast
- **LinkedList**: implementa List Queue Deque permite null O(1) pontas flexível
- **ArrayDeque**: preferir performance 2x mais rápida NÃO permite null padrão Queue/Deque

---

## Armadilhas

### 1. Usar Stack Obsoleto

```java
// ❌ Stack legado
Stack<String> stack = new Stack<>();

// ✅ Deque moderna
Deque<String> pilha = new LinkedList<>();
```

### 2. null ArrayDeque

```java
// ❌ NullPointerException
ArrayDeque<String> deque = new ArrayDeque<>();
deque.offer(null);  // Erro!

// ✅ LinkedList permite null
LinkedList<String> linked = new LinkedList<>();
linked.offer(null);  // OK
```

---

## Boas Práticas

### 1. Interface Variável

```java
// ✅ Flexível
Queue<String> fila = new LinkedList<>();
// Trocar: new ArrayDeque<>();

// ✅ Específico
Deque<String> pilha = new LinkedList<>();
```

### 2. Preferir ArrayDeque Performance

```java
// ✅ Padrão (mais rápida)
Deque<String> deque = new ArrayDeque<>();

// ✅ Especial (null/List)
Deque<String> deque2 = new LinkedList<>();
```

---

## Resumo

**Queue**: fila FIFO Collection interface métodos offer adiciona fim poll remove início peek vê início NÃO remove retorna null vazia seguro. FIFO First In First Out primeiro entra primeiro sai processamento ordem chegada tarefas sequenciais buffers. LinkedList implementa O1 operações pontas eficiente.

**Deque**: double-ended queue Queue interface operações ambas pontas métodos offerFirst offerLast início fim pollFirst pollLast início fim peekFirst peekLast início fim. Métodos pilha push addFirst pop removeFirst peek peekFirst compatibilidade Stack. Substitui Stack thread-safe desnecessário moderna flexível.

**LinkedList**: implementa List Queue Deque lista duplamente encadeada permite null elementos O1 pontas offer poll push pop offerFirst offerLast pollFirst pollLast. Vantagens null permitido List também memória dinâmica. Desvantagens mais lenta overhead nós 28 bytes elemento cache unfriendly.

**ArrayDeque**: implementa Queue Deque array circular head tail índices NÃO permite null NÃO implementa List. Vantagens 2x mais rápida menos memória cache friendly. Desvantagens NÃO null redimensionamento ocasional. Padrão preferir performance.

**Queue usar**: fila FIFO processamento ordem chegada tarefas sequenciais buffers mensageria padrão while poll null processa. Métodos offer adicionar poll remover peek verificar. Interface flexível trocar LinkedList ArrayDeque código igual.

**Deque usar**: pilha LIFO substituir Stack desfazer ações navegação histórico avaliação expressões recursão iterativa. Operações ambas pontas fila prioridade buffer flexível. Métodos push pop peek pilha offerFirst offerLast pollFirst pollLast pontas.

**Comparação**: LinkedList linked null List lenta alta memória. ArrayDeque array NÃO null NÃO List rápida 2x baixa memória cache friendly. RECOMENDAÇÃO padrão ArrayDeque performance especial LinkedList se precisa null ou List.

**Regra de Ouro**: Queue FILA FIFO métodos offer poll peek adiciona fim remove início processamento ordem. Deque DOUBLE-ENDED operações ambas pontas offerFirst offerLast pollFirst pollLast push pop peek SUBSTITUI Stack moderna. LinkedList implementa List Queue Deque PERMITE null O1 pontas lenta overhead nós. ArrayDeque NÃO null NÃO List 2x MAIS RÁPIDA preferir padrão. INTERFACE variável Queue Deque flexível trocar implementação. USAR Queue fila FIFO Deque pilha LIFO Stack OBSOLETO. PADRÃO ArrayDeque performance ESPECIAL LinkedList null List necessário.

