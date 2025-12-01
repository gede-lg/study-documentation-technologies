# T6.04 - Casos de Uso Ideais para Cada Implementação

## Introdução

**Decisão**: ArrayList acesso aleatório índices get set padrão 95% casos memória cache. LinkedList fila pilha pontas addFirst removeFirst específico 5% casos.

```java
import java.util.*;

// DECISÃO: Quando usar cada
public class DecisaoUso {
    public static void main(String[] args) {
        // REGRA DE OURO:
        
        // ArrayList: PADRÃO (95% casos)
        // - Acesso aleatório: get(index)
        // - Loop índices: for (int i = 0; i < size; i++)
        // - Memória limitada
        // - Big Data
        // - Cache importante
        // - Dúvida: usar ArrayList
        
        // LinkedList: ESPECÍFICO (5% casos)
        // - Fila FIFO: offer + poll
        // - Pilha LIFO: push + pop
        // - Inserção/remoção pontas frequente
        // - NUNCA acesso aleatório
        
        
        // EXEMPLO 1: Acesso aleatório
        
        // ✅ ArrayList
        List<String> nomes = new ArrayList<>();
        nomes.add("Alice");
        nomes.add("Bob");
        nomes.add("Carol");
        
        String segundo = nomes.get(1);  // O(1) - RÁPIDO
        System.out.println("Segundo nome: " + segundo);
        
        // ❌ LinkedList
        // List<String> nomes = new LinkedList<>();
        // String segundo = nomes.get(1);  // O(n) - LENTO
        
        
        // EXEMPLO 2: Fila FIFO
        
        // ✅ LinkedList
        Queue<String> fila = new LinkedList<>();
        fila.offer("Primeiro");
        fila.offer("Segundo");
        fila.offer("Terceiro");
        
        String atendido = fila.poll();  // O(1) - RÁPIDO
        System.out.println("Atendido: " + atendido);
        
        // ❌ ArrayList (como fila)
        // List<String> fila = new ArrayList<>();
        // fila.remove(0);  // O(n) - LENTO
        
        
        // DECISÃO RÁPIDA:
        
        System.out.println("\n=== Decisão Rápida ===");
        System.out.println("Acesso get(i)? → ArrayList");
        System.out.println("Loop get(i)? → ArrayList");
        System.out.println("Fila/Pilha? → LinkedList");
        System.out.println("Dúvida? → ArrayList");
    }
}
```

**Decisão**: ArrayList acesso get loop índices padrão 95%. LinkedList fila pilha pontas 5%. Dúvida ArrayList.

---

## Fundamentos

### 1. ArrayList: Casos Ideais

```java
// ARRAYLIST: Quando usar
public class ArrayListCasos {
    public static void main(String[] args) {
        // CASO 1: Acesso aleatório por índice
        
        // ✅ IDEAL: ArrayList
        List<String> usuarios = new ArrayList<>();
        usuarios.add("user0");
        usuarios.add("user1");
        usuarios.add("user2");
        // ... 10000 usuários
        
        // Acesso direto O(1):
        String usuario = usuarios.get(5000);  // ~10ns
        
        // LinkedList: O(n) ~50μs (5000x mais lento!)
        
        System.out.println("=== Caso 1: Acesso Aleatório ===");
        System.out.println("✅ ArrayList: O(1) ~10ns");
        System.out.println("❌ LinkedList: O(n) ~50μs");
        
        
        // CASO 2: Loop por índices
        
        // ✅ IDEAL: ArrayList
        List<Integer> numeros = new ArrayList<>();
        for (int i = 0; i < 10_000; i++) {
            numeros.add(i);
        }
        
        // Loop get(i) O(n):
        long t1 = System.nanoTime();
        int soma = 0;
        for (int i = 0; i < numeros.size(); i++) {
            soma += numeros.get(i);  // Cada: O(1)
        }
        long t2 = System.nanoTime();
        System.out.println("\n=== Caso 2: Loop get(i) ===");
        System.out.println("ArrayList: " + (t2-t1)/1_000_000 + "ms");
        
        // LinkedList: O(n²) ~5000ms (500x mais lento!)
        
        
        // CASO 3: Busca binária
        
        // ✅ IDEAL: ArrayList
        List<Integer> ordenados = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            ordenados.add(i);
        }
        
        // Busca binária O(log n):
        int indice = Collections.binarySearch(ordenados, 50000);
        System.out.println("\n=== Caso 3: Busca Binária ===");
        System.out.println("Índice encontrado: " + indice);
        System.out.println("✅ ArrayList: O(log n)");
        System.out.println("❌ LinkedList: O(n log n) - LENTO");
        
        // LinkedList: cada comparação O(n) → total O(n log n)
        
        
        // CASO 4: Ordenação
        
        // ✅ IDEAL: ArrayList
        List<Integer> desordenados = new ArrayList<>();
        Random rand = new Random(42);
        for (int i = 0; i < 10_000; i++) {
            desordenados.add(rand.nextInt());
        }
        
        long t3 = System.nanoTime();
        Collections.sort(desordenados);
        long t4 = System.nanoTime();
        
        System.out.println("\n=== Caso 4: Ordenação ===");
        System.out.println("ArrayList sort: " + (t4-t3)/1_000_000 + "ms");
        System.out.println("✅ ArrayList: cache-friendly");
        System.out.println("❌ LinkedList: cache-unfriendly (10x lento)");
        
        
        // CASO 5: Iteração sequencial
        
        // ✅ BOM: ArrayList (cache-friendly)
        List<String> itens = new ArrayList<>();
        for (int i = 0; i < 100_000; i++) {
            itens.add("Item " + i);
        }
        
        long t5 = System.nanoTime();
        for (String item : itens) {
            // Processar
        }
        long t6 = System.nanoTime();
        
        System.out.println("\n=== Caso 5: Iteração ===");
        System.out.println("ArrayList iterator: " + (t6-t5)/1_000_000 + "ms");
        System.out.println("✅ ArrayList: cache hit 90%");
        System.out.println("LinkedList: cache miss 95% (5x lento)");
        
        
        // CASO 6: Inserção fim (comum)
        
        // ✅ IDEAL: ArrayList
        List<Integer> crescente = new ArrayList<>();
        
        long t7 = System.nanoTime();
        for (int i = 0; i < 100_000; i++) {
            crescente.add(i);  // Fim
        }
        long t8 = System.nanoTime();
        
        System.out.println("\n=== Caso 6: Inserção Fim ===");
        System.out.println("ArrayList add: " + (t8-t7)/1_000_000 + "ms");
        System.out.println("✅ ArrayList: O(1) amortizado");
        System.out.println("LinkedList: O(1) mas overhead Node");
        
        
        // CASO 7: Big Data
        
        // ✅ IDEAL: ArrayList
        System.out.println("\n=== Caso 7: Big Data ===");
        System.out.println("100M elementos:");
        System.out.println("✅ ArrayList: 2.7 GB");
        System.out.println("❌ LinkedList: 5.1 GB (2x memória)");
        
        
        // CASO 8: Memória limitada
        
        // ✅ IDEAL: ArrayList
        System.out.println("\n=== Caso 8: Memória Limitada ===");
        System.out.println("Mobile, embarcado:");
        System.out.println("✅ ArrayList: ~24 bytes/elem");
        System.out.println("❌ LinkedList: ~52 bytes/elem (2x)");
        
        
        // CASO 9: Substituição elementos
        
        // ✅ IDEAL: ArrayList
        List<String> modificar = new ArrayList<>(Arrays.asList("A", "B", "C"));
        
        modificar.set(1, "X");  // O(1)
        
        System.out.println("\n=== Caso 9: set(index) ===");
        System.out.println("ArrayList: " + modificar);
        System.out.println("✅ ArrayList: O(1)");
        System.out.println("❌ LinkedList: O(n)");
        
        
        // CASO 10: Acesso fim
        
        // ✅ BOM: ArrayList
        List<Integer> pilhaArray = new ArrayList<>();
        pilhaArray.add(1);
        pilhaArray.add(2);
        pilhaArray.add(3);
        
        int ultimo = pilhaArray.remove(pilhaArray.size() - 1);  // O(1)
        
        System.out.println("\n=== Caso 10: Acesso Fim ===");
        System.out.println("Removido: " + ultimo);
        System.out.println("✅ ArrayList: remove(size-1) O(1)");
        System.out.println("LinkedList: removeLast O(1) - empate");
        
        
        System.out.println("\n=== Resumo ArrayList ===");
        System.out.println("✅ Acesso aleatório");
        System.out.println("✅ Loop índices");
        System.out.println("✅ Busca binária");
        System.out.println("✅ Ordenação");
        System.out.println("✅ Big Data");
        System.out.println("✅ Memória limitada");
        System.out.println("✅ set(index)");
        System.out.println("✅ Padrão (95% casos)");
    }
}

/*
 * ARRAYLIST: Casos Ideais
 * 
 * ✅ QUANDO USAR:
 * 
 * 1. Acesso aleatório: get(i) O(1)
 * 2. Loop índices: for get(i) O(n)
 * 3. Busca binária: O(log n)
 * 4. Ordenação: cache-friendly
 * 5. Iteração: cache hit 90%
 * 6. Inserção fim: O(1) amortizado
 * 7. Big Data: 2x menos memória
 * 8. Memória limitada: ~24 bytes/elem
 * 9. set(index): O(1)
 * 10. Padrão: dúvida → ArrayList
 * 
 * ❌ QUANDO EVITAR:
 * 
 * - Inserção início frequente: O(n)
 * - Remoção início frequente: O(n)
 * - Fila FIFO: remove(0) O(n)
 * 
 * REGRA:
 * 95% casos → ArrayList
 */
```

**ArrayList ideal**: acesso aleatório get O(1) loop índices O(n) busca binária O(log n) ordenação cache-friendly Big Data 2x menos memória limitada 24 bytes set O(1) padrão 95% casos.

### 2. LinkedList: Casos Ideais

```java
// LINKEDLIST: Quando usar
public class LinkedListCasos {
    public static void main(String[] args) {
        // CASO 1: Fila FIFO
        
        // ✅ IDEAL: LinkedList
        Queue<String> fila = new LinkedList<>();
        
        // Adicionar fim:
        fila.offer("Cliente 1");  // O(1)
        fila.offer("Cliente 2");
        fila.offer("Cliente 3");
        
        System.out.println("=== Caso 1: Fila FIFO ===");
        System.out.println("Fila: " + fila);
        
        // Remover início:
        while (!fila.isEmpty()) {
            String atendido = fila.poll();  // O(1)
            System.out.println("Atendendo: " + atendido);
        }
        
        System.out.println("✅ LinkedList: offer + poll O(1)");
        System.out.println("❌ ArrayList: remove(0) O(n)");
        
        // ArrayList remove(0): desloca todos (50x mais lento)
        
        
        // CASO 2: Pilha LIFO
        
        // ✅ IDEAL: LinkedList (ou ArrayDeque)
        Deque<String> pilha = new LinkedList<>();
        
        // Push início:
        pilha.push("Operação 1");  // O(1)
        pilha.push("Operação 2");
        pilha.push("Operação 3");
        
        System.out.println("\n=== Caso 2: Pilha LIFO ===");
        System.out.println("Pilha: " + pilha);
        
        // Pop início:
        while (!pilha.isEmpty()) {
            String desfazer = pilha.pop();  // O(1)
            System.out.println("Desfazer: " + desfazer);
        }
        
        System.out.println("✅ LinkedList: push + pop O(1)");
        System.out.println("ArrayList: add(0) O(n)");
        
        // NOTA: ArrayDeque mais rápida que LinkedList
        // Deque<String> pilha = new ArrayDeque<>();
        
        
        // CASO 3: Inserção início frequente
        
        // ✅ IDEAL: LinkedList
        LinkedList<Integer> crescenteFront = new LinkedList<>();
        
        long t1 = System.nanoTime();
        for (int i = 0; i < 10_000; i++) {
            crescenteFront.addFirst(i);  // O(1)
        }
        long t2 = System.nanoTime();
        
        System.out.println("\n=== Caso 3: Inserção Início ===");
        System.out.println("LinkedList addFirst 10K: " + (t2-t1)/1_000_000 + "ms");
        System.out.println("✅ LinkedList: O(1) ~5ms");
        System.out.println("❌ ArrayList: O(n) ~500ms (100x lento)");
        
        
        // CASO 4: Remoção início frequente
        
        // ✅ IDEAL: LinkedList
        LinkedList<Integer> removeInicio = new LinkedList<>();
        for (int i = 0; i < 10_000; i++) {
            removeInicio.add(i);
        }
        
        long t3 = System.nanoTime();
        for (int i = 0; i < 1000; i++) {
            removeInicio.removeFirst();  // O(1)
        }
        long t4 = System.nanoTime();
        
        System.out.println("\n=== Caso 4: Remoção Início ===");
        System.out.println("LinkedList removeFirst 1000x: " + (t4-t3)/1_000_000 + "ms");
        System.out.println("✅ LinkedList: O(1) ~1ms");
        System.out.println("❌ ArrayList: O(n) ~50ms (50x lento)");
        
        
        // CASO 5: Acesso sequencial apenas
        
        // ✅ ACEITÁVEL: LinkedList (iterator)
        LinkedList<String> sequencial = new LinkedList<>();
        for (int i = 0; i < 100_000; i++) {
            sequencial.add("Item " + i);
        }
        
        long t5 = System.nanoTime();
        for (String item : sequencial) {  // Iterator
            // Processar
        }
        long t6 = System.nanoTime();
        
        System.out.println("\n=== Caso 5: Acesso Sequencial ===");
        System.out.println("LinkedList iterator: " + (t6-t5)/1_000_000 + "ms");
        System.out.println("✅ LinkedList: iterator O(n)");
        System.out.println("ArrayList: iterator 5x mais rápido (cache)");
        
        
        // CASO 6: Deque (dupla-ponta)
        
        // ✅ IDEAL: LinkedList
        Deque<Integer> deque = new LinkedList<>();
        
        deque.addFirst(1);   // O(1)
        deque.addLast(2);    // O(1)
        deque.addFirst(0);   // O(1)
        deque.addLast(3);    // O(1)
        
        System.out.println("\n=== Caso 6: Deque ===");
        System.out.println("Deque: " + deque);
        
        deque.removeFirst(); // O(1)
        deque.removeLast();  // O(1)
        
        System.out.println("Após remoções: " + deque);
        System.out.println("✅ LinkedList: ambas pontas O(1)");
        System.out.println("ArrayList: início O(n)");
        
        // NOTA: ArrayDeque mais rápida
        
        
        // CASO 7: Buffer circular
        
        // ✅ BOM: LinkedList
        Queue<String> buffer = new LinkedList<>();
        int MAX = 5;
        
        for (int i = 0; i < 10; i++) {
            buffer.offer("Msg " + i);
            
            if (buffer.size() > MAX) {
                buffer.poll();  // Remove antigo
            }
        }
        
        System.out.println("\n=== Caso 7: Buffer Circular ===");
        System.out.println("Buffer (últimos 5): " + buffer);
        System.out.println("✅ LinkedList: offer + poll O(1)");
        
        
        // CASO 8: Lista de tarefas (prioridade pontas)
        
        // ✅ BOM: LinkedList
        LinkedList<String> tarefas = new LinkedList<>();
        
        // Tarefa normal (fim):
        tarefas.addLast("Tarefa normal");
        
        // Tarefa urgente (início):
        tarefas.addFirst("URGENTE!");
        
        System.out.println("\n=== Caso 8: Lista Tarefas ===");
        System.out.println("Tarefas: " + tarefas);
        System.out.println("Próxima: " + tarefas.getFirst());
        System.out.println("✅ LinkedList: prioridade pontas O(1)");
        
        
        System.out.println("\n=== Resumo LinkedList ===");
        System.out.println("✅ Fila FIFO");
        System.out.println("✅ Pilha LIFO");
        System.out.println("✅ Inserção início");
        System.out.println("✅ Remoção início");
        System.out.println("✅ Deque (dupla-ponta)");
        System.out.println("✅ Buffer circular");
        System.out.println("✅ Acesso sequencial apenas");
        System.out.println("⚠️  Específico (5% casos)");
        System.out.println("⚠️  ArrayDeque geralmente melhor");
    }
}

/*
 * LINKEDLIST: Casos Ideais
 * 
 * ✅ QUANDO USAR:
 * 
 * 1. Fila FIFO: offer + poll O(1)
 * 2. Pilha LIFO: push + pop O(1)
 * 3. Inserção início: addFirst O(1)
 * 4. Remoção início: removeFirst O(1)
 * 5. Deque: ambas pontas O(1)
 * 6. Buffer circular: offer + poll
 * 7. Acesso sequencial apenas: iterator
 * 
 * ❌ QUANDO EVITAR:
 * 
 * - Acesso aleatório: get(i) O(n)
 * - Loop índices: get(i) O(n²)
 * - Busca binária: O(n log n)
 * - Big Data: 2x memória
 * - Memória limitada: ~52 bytes/elem
 * 
 * ⚠️  ALTERNATIVA:
 * - ArrayDeque: mais rápida que LinkedList
 * - Não permite null
 * - Não é List
 * 
 * REGRA:
 * 5% casos → LinkedList (ou ArrayDeque)
 */
```

**LinkedList ideal**: fila FIFO offer poll O(1) pilha LIFO push pop inserção início addFirst remoção removeFirst deque dupla-ponta buffer circular sequencial específico 5% casos. ArrayDeque geralmente melhor.

### 3. Comparação Casos de Uso

```java
// COMPARAÇÃO: Cenários
public class ComparacaoCenarios {
    public static void main(String[] args) {
        // TABELA DECISÃO:
        
        /*
         * Cenário                    | ArrayList | LinkedList | Melhor
         * -----------------------------------------------------------------
         * Acesso aleatório           | O(1)      | O(n)       | ArrayList 500x
         * Loop get(i)                | O(n)      | O(n²)      | ArrayList 500x
         * Busca binária              | O(log n)  | O(n log n) | ArrayList
         * Ordenação                  | Rápido    | Lento      | ArrayList (cache)
         * Inserção fim               | O(1)*     | O(1)       | Empate
         * Inserção início            | O(n)      | O(1)       | LinkedList 100x
         * Inserção meio              | O(n)      | O(n)       | ArrayList (cache)
         * Remoção fim                | O(1)      | O(1)       | Empate
         * Remoção início             | O(n)      | O(1)       | LinkedList 50x
         * Remoção meio               | O(n)      | O(n)       | ArrayList (cache)
         * Iteração sequencial        | Rápido    | Lento      | ArrayList 5x
         * Fila FIFO                  | Ruim      | Ótimo      | LinkedList
         * Pilha LIFO                 | Bom       | Ótimo      | LinkedList
         * Big Data                   | 2.7 GB    | 5.1 GB     | ArrayList
         * Memória limitada           | 24 bytes  | 52 bytes   | ArrayList
         * set(index)                 | O(1)      | O(n)       | ArrayList
         * 
         * * O(1) amortizado
         */
        
        System.out.println("=== Tabela Decisão ===");
        System.out.println("Acesso aleatório → ArrayList (500x)");
        System.out.println("Loop get(i) → ArrayList (500x)");
        System.out.println("Busca/Ordenação → ArrayList");
        System.out.println("Inserção/Remoção início → LinkedList (100x)");
        System.out.println("Fila FIFO → LinkedList");
        System.out.println("Pilha LIFO → LinkedList");
        System.out.println("Big Data → ArrayList (2x menos)");
        System.out.println("Memória → ArrayList (2x menos)");
        
        
        // CENÁRIO 1: Sistema de Usuários
        
        // Operações comuns:
        // - Buscar por ID: get(index)
        // - Listar todos: iterator
        // - Atualizar: set(index)
        
        // ✅ IDEAL: ArrayList
        List<String> usuarios = new ArrayList<>();
        
        System.out.println("\n=== Cenário 1: Usuários ===");
        System.out.println("✅ ArrayList");
        System.out.println("Razão: acesso, busca, set");
        
        
        // CENÁRIO 2: Processamento de Mensagens
        
        // Operações comuns:
        // - Receber mensagem: addLast
        // - Processar: removeFirst
        // - FIFO
        
        // ✅ IDEAL: LinkedList
        Queue<String> mensagens = new LinkedList<>();
        
        System.out.println("\n=== Cenário 2: Mensagens ===");
        System.out.println("✅ LinkedList (Queue)");
        System.out.println("Razão: FIFO, offer + poll");
        
        
        // CENÁRIO 3: Histórico de Navegação
        
        // Operações comuns:
        // - Adicionar página: addFirst
        // - Voltar: removeFirst
        // - LIFO
        
        // ✅ IDEAL: LinkedList
        Deque<String> historico = new LinkedList<>();
        
        System.out.println("\n=== Cenário 3: Histórico ===");
        System.out.println("✅ LinkedList (Deque)");
        System.out.println("Razão: LIFO, push + pop");
        
        
        // CENÁRIO 4: Análise de Dados
        
        // Operações comuns:
        // - Carregar milhões registros
        // - Processar: loop
        // - Ordenar, buscar
        
        // ✅ IDEAL: ArrayList
        List<Double> dados = new ArrayList<>(1_000_000);
        
        System.out.println("\n=== Cenário 4: Análise Dados ===");
        System.out.println("✅ ArrayList");
        System.out.println("Razão: Big Data, memória, cache");
        
        
        // CENÁRIO 5: Leitor de Arquivos
        
        // Operações comuns:
        // - Ler linha: iterator
        // - Processar sequencial
        
        // ✅ IDEAL: ArrayList (cache)
        List<String> linhas = new ArrayList<>();
        
        System.out.println("\n=== Cenário 5: Leitor Arquivos ===");
        System.out.println("✅ ArrayList");
        System.out.println("Razão: iterator rápido (cache)");
        
        
        // CENÁRIO 6: Editor de Texto (Undo)
        
        // Operações comuns:
        // - Inserir linha: add
        // - Desfazer: pop
        // - LIFO
        
        // ✅ IDEAL: LinkedList
        Deque<String> comandos = new LinkedList<>();
        
        System.out.println("\n=== Cenário 6: Editor Undo ===");
        System.out.println("✅ LinkedList (Deque)");
        System.out.println("Razão: LIFO, desfazer");
        
        
        // CENÁRIO 7: Lista de Produtos (E-commerce)
        
        // Operações comuns:
        // - Buscar por índice: get
        // - Filtrar: iterator
        // - Ordenar por preço: sort
        
        // ✅ IDEAL: ArrayList
        List<String> produtos = new ArrayList<>();
        
        System.out.println("\n=== Cenário 7: Produtos ===");
        System.out.println("✅ ArrayList");
        System.out.println("Razão: busca, sort, acesso");
        
        
        // CENÁRIO 8: Thread Pool (Tarefas)
        
        // Operações comuns:
        // - Adicionar tarefa: offer
        // - Executar: poll
        // - FIFO
        
        // ✅ IDEAL: LinkedList
        Queue<Runnable> tarefas = new LinkedList<>();
        
        System.out.println("\n=== Cenário 8: Thread Pool ===");
        System.out.println("✅ LinkedList (Queue)");
        System.out.println("Razão: FIFO, tarefas");
        
        
        // CENÁRIO 9: Mobile App (Memória limitada)
        
        // Operações comuns:
        // - Listar itens: iterator
        // - Memória crítica
        
        // ✅ IDEAL: ArrayList
        List<String> itens = new ArrayList<>();
        
        System.out.println("\n=== Cenário 9: Mobile App ===");
        System.out.println("✅ ArrayList");
        System.out.println("Razão: memória (2x menos)");
        
        
        // CENÁRIO 10: Cache LRU
        
        // Operações comuns:
        // - Adicionar: addLast
        // - Remover antigo: removeFirst
        // - Mover recente: remove + addLast
        
        // ✅ IDEAL: LinkedList
        LinkedList<String> cache = new LinkedList<>();
        
        System.out.println("\n=== Cenário 10: Cache LRU ===");
        System.out.println("✅ LinkedList");
        System.out.println("Razão: pontas, reordenar");
        
        
        System.out.println("\n=== Resumo Cenários ===");
        System.out.println("ArrayList: 7/10 (70%)");
        System.out.println("LinkedList: 3/10 (30%)");
        System.out.println("Real: ArrayList ~95%");
    }
}

/*
 * COMPARAÇÃO CENÁRIOS:
 * 
 * ARRAYLIST (95%):
 * - Usuários: acesso, busca
 * - Análise dados: Big Data
 * - Leitor: iterator cache
 * - Produtos: busca, sort
 * - Mobile: memória
 * - Maioria sistemas
 * 
 * LINKEDLIST (5%):
 * - Mensagens: FIFO
 * - Histórico: LIFO
 * - Editor: undo
 * - Thread pool: tarefas
 * - Cache LRU: pontas
 * - Filas/pilhas
 */
```

**Cenários**: ArrayList usuários análise dados leitor produtos mobile 95% sistemas acesso busca sort memória. LinkedList mensagens histórico editor thread pool cache LRU 5% fila pilha pontas.

### 4. ArrayDeque: Alternativa Superior

```java
// ARRAYDEQUE: Melhor que LinkedList
public class ArrayDequeAlternativa {
    public static void main(String[] args) {
        // ARRAYDEQUE vs LINKEDLIST:
        
        // ArrayDeque:
        // - Array circular
        // - Cache-friendly
        // - Mais rápida
        // - NÃO permite null
        // - NÃO é List
        
        // LinkedList:
        // - Nós encadeados
        // - Cache-unfriendly
        // - Mais lenta
        // - Permite null
        // - É List
        
        
        // PERFORMANCE FILA:
        
        int n = 100_000;
        
        // ArrayDeque:
        Deque<Integer> arrayDeque = new ArrayDeque<>();
        
        long t1 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            arrayDeque.offer(i);
        }
        for (int i = 0; i < n; i++) {
            arrayDeque.poll();
        }
        long t2 = System.nanoTime();
        
        System.out.println("=== Performance Fila ===");
        System.out.println("ArrayDeque: " + (t2-t1)/1_000_000 + "ms");
        
        
        // LinkedList:
        Deque<Integer> linkedDeque = new LinkedList<>();
        
        long t3 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            linkedDeque.offer(i);
        }
        for (int i = 0; i < n; i++) {
            linkedDeque.poll();
        }
        long t4 = System.nanoTime();
        
        System.out.println("LinkedList: " + (t4-t3)/1_000_000 + "ms");
        
        // RESULTADO:
        // ArrayDeque: ~10ms
        // LinkedList: ~30ms
        // ArrayDeque 3x mais rápida!
        
        
        // PERFORMANCE PILHA:
        
        Deque<Integer> arrayPilha = new ArrayDeque<>();
        
        long t5 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            arrayPilha.push(i);
        }
        for (int i = 0; i < n; i++) {
            arrayPilha.pop();
        }
        long t6 = System.nanoTime();
        
        System.out.println("\n=== Performance Pilha ===");
        System.out.println("ArrayDeque: " + (t6-t5)/1_000_000 + "ms");
        
        
        Deque<Integer> linkedPilha = new LinkedList<>();
        
        long t7 = System.nanoTime();
        for (int i = 0; i < n; i++) {
            linkedPilha.push(i);
        }
        for (int i = 0; i < n; i++) {
            linkedPilha.pop();
        }
        long t8 = System.nanoTime();
        
        System.out.println("LinkedList: " + (t8-t7)/1_000_000 + "ms");
        
        // RESULTADO:
        // ArrayDeque: ~5ms
        // LinkedList: ~20ms
        // ArrayDeque 4x mais rápida!
        
        
        // QUANDO ArrayDeque:
        
        System.out.println("\n=== Quando ArrayDeque ===");
        System.out.println("✅ Fila FIFO (não precisa null)");
        System.out.println("✅ Pilha LIFO");
        System.out.println("✅ Deque (dupla-ponta)");
        System.out.println("✅ Performance crítica");
        System.out.println("✅ Memória (~30% menos)");
        
        
        // QUANDO LinkedList:
        
        System.out.println("\n=== Quando LinkedList ===");
        System.out.println("✅ Precisa List interface");
        System.out.println("✅ Precisa null");
        System.out.println("✅ Compatibilidade código legado");
        
        
        // RECOMENDAÇÃO:
        
        // ✅ PADRÃO: ArrayDeque (fila/pilha)
        Queue<String> fila = new ArrayDeque<>();
        Deque<String> pilha = new ArrayDeque<>();
        
        // ⚠️  ESPECÍFICO: LinkedList (List + null)
        List<String> lista = new LinkedList<>();
        
        
        System.out.println("\n=== Recomendação ===");
        System.out.println("Fila/Pilha: ArrayDeque (padrão)");
        System.out.println("List + null: LinkedList (específico)");
    }
}

/*
 * ARRAYDEQUE vs LINKEDLIST:
 * 
 * ARRAYDEQUE:
 * ✅ Fila: 3x mais rápida
 * ✅ Pilha: 4x mais rápida
 * ✅ Memória: 30% menos
 * ✅ Cache-friendly
 * ❌ NÃO permite null
 * ❌ NÃO é List
 * 
 * LINKEDLIST:
 * ✅ Permite null
 * ✅ É List interface
 * ❌ 3-4x mais lenta
 * ❌ Mais memória
 * ❌ Cache-unfriendly
 * 
 * DECISÃO:
 * - Fila/Pilha: ArrayDeque
 * - List + null: LinkedList
 * - Padrão: ArrayDeque
 */
```

**ArrayDeque**: array circular cache-friendly 3-4x mais rápida LinkedList 30% menos memória fila pilha deque padrão. Não permite null não List. LinkedList específico List interface null compatibilidade.

### 5. Guia Decisão Rápido

```java
/*
 * GUIA DECISÃO: Fluxograma
 * 
 * 1. PRECISA ACESSO ALEATÓRIO get(index)?
 *    SIM → ArrayList ✅
 *    NÃO → continuar
 * 
 * 2. VAI FAZER LOOP get(i)?
 *    SIM → ArrayList ✅
 *    NÃO → continuar
 * 
 * 3. PRECISA BUSCAR / ORDENAR?
 *    SIM → ArrayList ✅
 *    NÃO → continuar
 * 
 * 4. BIG DATA (milhões elementos)?
 *    SIM → ArrayList ✅
 *    NÃO → continuar
 * 
 * 5. MEMÓRIA LIMITADA?
 *    SIM → ArrayList ✅
 *    NÃO → continuar
 * 
 * 6. É FILA / PILHA?
 *    SIM → continuar
 *    NÃO → ArrayList ✅ (padrão)
 * 
 * 7. PRECISA List INTERFACE?
 *    SIM → LinkedList ✅
 *    NÃO → continuar
 * 
 * 8. PRECISA null?
 *    SIM → LinkedList ✅
 *    NÃO → ArrayDeque ✅
 * 
 * RESUMO:
 * - ArrayList: 95% casos
 * - LinkedList: 3% (List + null)
 * - ArrayDeque: 2% (fila/pilha)
 */

// EXEMPLOS DECISÃO
public class GuiaDecisao {
    public static void main(String[] args) {
        // EXEMPLO 1: Lista de produtos
        // Acesso? SIM → ArrayList
        List<String> produtos = new ArrayList<>();
        
        // EXEMPLO 2: Processamento mensagens
        // Fila? SIM, List? NÃO, null? NÃO → ArrayDeque
        Queue<String> mensagens = new ArrayDeque<>();
        
        // EXEMPLO 3: Histórico navegação
        // Pilha? SIM, List? NÃO, null? NÃO → ArrayDeque
        Deque<String> historico = new ArrayDeque<>();
        
        // EXEMPLO 4: Cache com null
        // Fila? SIM, List? SIM, null? SIM → LinkedList
        Queue<String> cache = new LinkedList<>();
        
        // EXEMPLO 5: Big Data
        // Milhões? SIM → ArrayList
        List<Double> dados = new ArrayList<>(1_000_000);
        
        // EXEMPLO 6: Mobile app
        // Memória? SIM → ArrayList
        List<String> itens = new ArrayList<>();
        
        // EXEMPLO 7: Dúvida
        // Padrão → ArrayList
        List<Integer> lista = new ArrayList<>();
        
        
        System.out.println("=== Decisões ===");
        System.out.println("Produtos: ArrayList");
        System.out.println("Mensagens: ArrayDeque");
        System.out.println("Histórico: ArrayDeque");
        System.out.println("Cache null: LinkedList");
        System.out.println("Big Data: ArrayList");
        System.out.println("Mobile: ArrayList");
        System.out.println("Dúvida: ArrayList");
    }
}
```

**Guia decisão**: acesso aleatório loop get busca ordenar Big Data memória ArrayList 95%. Fila pilha List null LinkedList 3%. Fila pilha sem List sem null ArrayDeque 2%. Dúvida ArrayList padrão.

---

## Aplicabilidade

**Casos uso considerar**:
- **ArrayList 95%**: acesso aleatório get O(1) loop índices busca binária ordenação Big Data memória limitada set iterator cache padrão dúvida
- **LinkedList 3%**: fila FIFO pilha LIFO inserção remoção início pontas deque List interface permite null específico
- **ArrayDeque 2%**: fila pilha deque sem List sem null 3-4x mais rápida LinkedList 30% menos memória cache-friendly padrão fila/pilha
- **Decisão fluxograma**: acesso/busca/Big Data/memória ArrayList. Fila/pilha sem List sem null ArrayDeque. Fila/pilha List null LinkedList. Dúvida ArrayList.

---

## Armadilhas

### 1. LinkedList para Acesso Aleatório

```java
// ❌ LinkedList acesso
LinkedList<Integer> errado = new LinkedList<>();
for (int i = 0; i < size; i++) {
    errado.get(i);  // O(n²) LENTO
}

// ✅ ArrayList acesso
ArrayList<Integer> correto = new ArrayList<>();
for (int i = 0; i < size; i++) {
    correto.get(i);  // O(n) RÁPIDO
}
```

### 2. ArrayList para Fila

```java
// ❌ ArrayList fila
List<String> fila = new ArrayList<>();
fila.remove(0);  // O(n) LENTO

// ✅ ArrayDeque fila
Queue<String> fila = new ArrayDeque<>();
fila.poll();  // O(1) RÁPIDO
```

### 3. LinkedList por "padrão"

```java
// ❌ LinkedList sem razão
List<String> lista = new LinkedList<>();
// Lento, memória, cache

// ✅ ArrayList padrão
List<String> lista = new ArrayList<>();
// Rápido, memória, cache
```

---

## Boas Práticas

### 1. ArrayList Padrão

```java
// ✅ Dúvida → ArrayList
List<String> lista = new ArrayList<>();
```

### 2. ArrayDeque Fila/Pilha

```java
// ✅ Fila/pilha sem null
Queue<String> fila = new ArrayDeque<>();
Deque<String> pilha = new ArrayDeque<>();
```

### 3. LinkedList Específico

```java
// ✅ List + null necessário
Queue<String> cache = new LinkedList<>();
cache.offer(null);  // Permite null
```

### 4. Considerar Contexto

```java
// ✅ Analisar operações frequentes
// Acesso → ArrayList
// Pontas → LinkedList/ArrayDeque
```

---

## Resumo

**ArrayList 95%**: acesso aleatório get O(1) ~10ns 500x LinkedList. Loop índices geti O(n) vs O(n²) 500x. Busca binária O(log n) ordenação cache-friendly rápido. Big Data 100M 2.7GB vs 5.1GB 2x menos. Memória 24 bytes vs 52 bytes 2x menos fragmentação zero GC rápido. Iterator cache hit 90% 5x LinkedList. set O(1) vs O(n). Padrão 95% casos dúvida ArrayList.

**LinkedList 5%**: fila FIFO offer poll O(1) vs ArrayList remove(0) O(n) 50x. Pilha LIFO push pop O(1) desfazer navegação. Inserção início addFirst O(1) vs ArrayList add(0) O(n) 100x. Remoção início removeFirst O(1) 50x. Deque dupla-ponta addFirst addLast removeFirst removeLast O(1) ambas pontas. Buffer circular cache LRU prioridade pontas. Acesso sequencial apenas iterator. Específico 5% casos.

**ArrayDeque 2%**: array circular cache-friendly 3-4x mais rápida LinkedList fila pilha. Memória 30% menos overhead. NÃO permite null NÃO List interface. Fila pilha deque padrão se não precisa List null. Performance crítica melhor que LinkedList.

**Decisão fluxograma**: acesso aleatório loop get busca ordenar Big Data memória ArrayList. Fila pilha sem List sem null ArrayDeque. Fila pilha List interface permite null LinkedList. Dúvida padrão ArrayList 95%. Analisar operações frequentes acesso vs pontas considerar cache memória performance contexto sistema.

**Cenários reais**: usuários análise dados leitor produtos mobile ArrayList 95% sistemas acesso busca memória. Mensagens histórico editor thread pool cache LRU LinkedList/ArrayDeque 5% fila pilha pontas. ArrayDeque padrão fila/pilha sem restrições List null. LinkedList específico compatibilidade List interface permite null. Escolha depende operações dominantes sistema.

