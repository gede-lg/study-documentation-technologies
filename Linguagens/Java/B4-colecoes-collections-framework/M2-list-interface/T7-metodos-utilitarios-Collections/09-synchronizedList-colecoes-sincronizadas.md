# T7.09 - synchronizedList(): Coleções Sincronizadas

## Introdução

**Collections.synchronizedList()**: cria wrapper thread-safe List sincronizada métodos synchronized acesso concorrente múltiplas threads seguro race conditions.

```java
import java.util.*;

public class SynchronizedIntro {
    public static void main(String[] args) throws InterruptedException {
        // NÃO SINCRONIZADA (problema):
        
        List<Integer> naoSync = new ArrayList<>();
        
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) naoSync.add(i);
        });
        
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) naoSync.add(i);
        });
        
        t1.start(); t2.start();
        t1.join(); t2.join();
        
        System.out.println("Não sincronizada: " + naoSync.size());
        // Esperado: 2000, Real: pode ser < 2000 (race condition!)
        
        
        // SINCRONIZADA (segura):
        
        List<Integer> sync = Collections.synchronizedList(new ArrayList<>());
        
        Thread t3 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) sync.add(i);
        });
        
        Thread t4 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) sync.add(i);
        });
        
        t3.start(); t4.start();
        t3.join(); t4.join();
        
        System.out.println("Sincronizada: " + sync.size());
        // 2000 (garantido!)
        
        System.out.println("\n=== Resumo ===");
        System.out.println("synchronizedList: thread-safe");
        System.out.println("Evita: race conditions");
    }
}
```

**synchronizedList**: wrapper thread-safe synchronized métodos múltiplas threads seguro add remove race condition resolvido.

---

## Fundamentos

### 1. Sincronização Básica

```java
public class SynchronizedBasico {
    public static void main(String[] args) throws InterruptedException {
        // CRIAR SINCRONIZADA:
        
        List<String> lista = Collections.synchronizedList(new ArrayList<>());
        
        
        // OPERAÇÕES ATÔMICAS (thread-safe):
        
        lista.add("A");     // synchronized
        lista.remove(0);    // synchronized
        lista.set(0, "B");  // synchronized
        lista.get(0);       // synchronized
        lista.size();       // synchronized
        
        System.out.println("=== Operações Atômicas ===");
        System.out.println("add, remove, get: sincronizados");
        
        
        // ITERAÇÃO (requer sincronização manual):
        
        lista.addAll(Arrays.asList("A", "B", "C", "D"));
        
        synchronized (lista) {  // IMPORTANTE!
            for (String item : lista) {
                System.out.println(item);
            }
        }
        
        
        // MÚLTIPLAS OPERAÇÕES:
        
        synchronized (lista) {  // Bloquear durante operação composta
            if (!lista.isEmpty()) {
                lista.remove(0);
            }
        }
        
        
        // IMPLEMENTAÇÃO:
        /*
         * class SynchronizedList<E> {
         *     final List<E> list;
         *     final Object mutex;
         *     
         *     public boolean add(E e) {
         *         synchronized (mutex) {
         *             return list.add(e);
         *         }
         *     }
         *     
         *     public E get(int index) {
         *         synchronized (mutex) {
         *             return list.get(index);
         *         }
         *     }
         * }
         */
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Método único: automático");
        System.out.println("Iteração: synchronized manual");
        System.out.println("Compostas: synchronized manual");
    }
}
```

**Básico**: métodos individuais add get automático synchronized. Iteração REQUER synchronized manual ConcurrentModificationException evitar. Operações compostas synchronized bloquear.

### 2. Problemas Concorrência

```java
public class SynchronizedProblemas {
    public static void main(String[] args) throws InterruptedException {
        // PROBLEMA 1: Iteração sem sincronização
        
        List<Integer> sync = Collections.synchronizedList(new ArrayList<>());
        
        for (int i = 0; i < 100; i++) sync.add(i);
        
        Thread leitor = new Thread(() -> {
            try {
                // ❌ ERRADO: iteração sem synchronized
                for (Integer num : sync) {
                    Thread.sleep(1);
                }
            } catch (Exception e) {
                System.out.println("Erro: " + e.getClass().getSimpleName());
                // ConcurrentModificationException
            }
        });
        
        Thread escritor = new Thread(() -> {
            try {
                Thread.sleep(5);
                sync.add(999);  // Modifica durante iteração
            } catch (Exception e) {}
        });
        
        leitor.start();
        escritor.start();
        leitor.join();
        escritor.join();
        
        
        // SOLUÇÃO: Sincronizar iteração
        
        Thread leitorCorreto = new Thread(() -> {
            synchronized (sync) {  // ✅ CORRETO
                for (Integer num : sync) {
                    // Processamento
                }
            }
        });
        
        
        // PROBLEMA 2: Check-then-act
        
        // ❌ ERRADO: não atômico
        if (!sync.isEmpty()) {          // Thread 1 verifica
            // Thread 2 remove último elemento
            sync.remove(sync.size()-1);  // Thread 1 falha!
        }
        
        // ✅ CORRETO: atômico
        synchronized (sync) {
            if (!sync.isEmpty()) {
                sync.remove(sync.size()-1);
            }
        }
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Iteração: synchronized(list)");
        System.out.println("Compostas: synchronized(list)");
    }
}
```

**Problemas**: iteração sem synchronized ConcurrentModificationException modificação simultânea. Check-then-act não atômico race condition synchronized bloquear operação composta.

### 3. Casos de Uso

```java
public class SynchronizedCasos {
    // CASO 1: Cache compartilhado
    
    class CacheService {
        private List<String> cache = Collections.synchronizedList(new ArrayList<>());
        
        public void adicionar(String item) {
            cache.add(item);  // Thread-safe
        }
        
        public List<String> obterTodos() {
            synchronized (cache) {  // Iteração segura
                return new ArrayList<>(cache);  // Cópia
            }
        }
        
        public void limpar() {
            cache.clear();  // Thread-safe
        }
    }
    
    
    // CASO 2: Fila tarefas
    
    class TaskQueue {
        private List<Runnable> tarefas = Collections.synchronizedList(new ArrayList<>());
        
        public void adicionar(Runnable tarefa) {
            tarefas.add(tarefa);
        }
        
        public Runnable proximaTarefa() {
            synchronized (tarefas) {
                if (tarefas.isEmpty()) return null;
                return tarefas.remove(0);
            }
        }
    }
    
    
    // CASO 3: Log compartilhado
    
    class Logger {
        private List<String> logs = Collections.synchronizedList(new ArrayList<>());
        
        public void log(String mensagem) {
            logs.add(System.currentTimeMillis() + ": " + mensagem);
        }
        
        public void exportar() {
            synchronized (logs) {
                for (String log : logs) {
                    System.out.println(log);
                }
            }
        }
    }
    
    
    public static void main(String[] args) throws InterruptedException {
        // CASO 1:
        
        System.out.println("=== Caso 1: Cache ===");
        CacheService cache = new CacheService();
        
        Thread t1 = new Thread(() -> cache.adicionar("Item 1"));
        Thread t2 = new Thread(() -> cache.adicionar("Item 2"));
        
        t1.start(); t2.start();
        t1.join(); t2.join();
        
        System.out.println("Cache: " + cache.obterTodos());
        
        
        // CASO 2:
        
        System.out.println("\n=== Caso 2: Fila ===");
        TaskQueue fila = new TaskQueue();
        
        fila.adicionar(() -> System.out.println("Tarefa 1"));
        fila.adicionar(() -> System.out.println("Tarefa 2"));
        
        Thread worker = new Thread(() -> {
            Runnable tarefa;
            while ((tarefa = fila.proximaTarefa()) != null) {
                tarefa.run();
            }
        });
        
        worker.start();
        worker.join();
        
        
        // CASO 3:
        
        System.out.println("\n=== Caso 3: Logger ===");
        Logger logger = new Logger();
        
        Thread t3 = new Thread(() -> logger.log("Log 1"));
        Thread t4 = new Thread(() -> logger.log("Log 2"));
        
        t3.start(); t4.start();
        t3.join(); t4.join();
        
        logger.exportar();
        
        
        System.out.println("\n=== Resumo ===");
        System.out.println("Cache: compartilhado threads");
        System.out.println("Fila: produtor-consumidor");
        System.out.println("Logger: logs concorrentes");
    }
}
```

**Casos**: cache compartilhado múltiplas threads add get seguro. Fila tarefas produtor-consumidor synchronized remove. Logger logs concorrentes timestamp exportar iteração.

### 4. Alternativas Modernas

```java
public class SynchronizedAlternativas {
    public static void main(String[] args) {
        // ALTERNATIVA 1: CopyOnWriteArrayList
        
        List<String> cow = new java.util.concurrent.CopyOnWriteArrayList<>();
        
        cow.add("A");
        cow.add("B");
        
        // Iteração sem sincronização:
        for (String item : cow) {  // Snapshot
            System.out.println(item);
        }
        
        System.out.println("=== CopyOnWriteArrayList ===");
        System.out.println("Iteração: snapshot automático");
        System.out.println("Melhor: muitas leituras, poucas escritas");
        
        
        // ALTERNATIVA 2: ConcurrentLinkedQueue
        
        java.util.Queue<Integer> queue = new java.util.concurrent.ConcurrentLinkedQueue<>();
        
        queue.offer(1);
        queue.offer(2);
        Integer item = queue.poll();
        
        System.out.println("\n=== ConcurrentLinkedQueue ===");
        System.out.println("Lock-free: alta performance");
        System.out.println("Uso: fila produtor-consumidor");
        
        
        // ALTERNATIVA 3: BlockingQueue
        
        java.util.concurrent.BlockingQueue<String> blocking = 
            new java.util.concurrent.ArrayBlockingQueue<>(10);
        
        try {
            blocking.put("Item");     // Bloqueia se cheio
            String str = blocking.take();  // Bloqueia se vazio
        } catch (InterruptedException e) {}
        
        System.out.println("\n=== BlockingQueue ===");
        System.out.println("Bloqueia: producer/consumer");
        System.out.println("Uso: threads comunicação");
        
        
        // COMPARAÇÃO:
        
        System.out.println("\n=== Comparação ===");
        System.out.println("synchronizedList: uso geral simples");
        System.out.println("CopyOnWriteArrayList: muita leitura");
        System.out.println("ConcurrentLinkedQueue: fila lock-free");
        System.out.println("BlockingQueue: producer-consumer");
        
        
        System.out.println("\n=== Decisão ===");
        System.out.println("Simples: synchronizedList");
        System.out.println("Leitura: CopyOnWriteArrayList");
        System.out.println("Fila: Concurrent/BlockingQueue");
    }
}
```

**Alternativas**: CopyOnWriteArrayList snapshot iteração automático muita leitura pouca escrita. ConcurrentLinkedQueue lock-free alta performance fila. BlockingQueue bloqueia produtor-consumidor comunicação threads. synchronizedList uso geral simples.

---

## Aplicabilidade

**synchronizedList usar**: múltiplas threads acesso concorrente cache compartilhado fila logger. Métodos automático sincronizados iteração REQUER synchronized manual. Simples uso geral.

---

## Armadilhas

```java
// ❌ Iteração sem synchronized
List<Integer> sync = Collections.synchronizedList(new ArrayList<>());
for (Integer num : sync) {  // ConcurrentModificationException
    // ...
}

// ✅ Iteração com synchronized
synchronized (sync) {
    for (Integer num : sync) {
        // ...
    }
}

// ❌ Check-then-act não atômico
if (!sync.isEmpty()) {
    sync.remove(0);  // Race condition!
}

// ✅ Atômico
synchronized (sync) {
    if (!sync.isEmpty()) {
        sync.remove(0);
    }
}

// ❌ Performance: muita contenção
synchronized (sync) {
    // Operação longa bloqueia todas threads
    Thread.sleep(1000);
}

// ✅ Alternativa: CopyOnWriteArrayList
List<Integer> cow = new CopyOnWriteArrayList<>();
```

---

## Boas Práticas

```java
// ✅ Sincronizar iteração
synchronized (lista) {
    for (T item : lista) {
        // ...
    }
}

// ✅ Operações compostas
synchronized (lista) {
    if (condicao) {
        lista.add(item);
    }
}

// ✅ Cópia para retorno
public List<T> getItems() {
    synchronized (items) {
        return new ArrayList<>(items);
    }
}

// ✅ Alternativa moderna
List<T> lista = new CopyOnWriteArrayList<>();
```

---

## Resumo

**Collections.synchronizedList**: cria wrapper thread-safe List sincronizada métodos add remove get set size synchronized automático acesso concorrente múltiplas threads seguro race conditions evitar. Wrapper view referência original mutex lock.

**Sincronização**: métodos individuais automático synchronized garantido. Iteração REQUER synchronized(list) manual ConcurrentModificationException evitar modificação simultânea. Operações compostas check-then-act synchronized bloquear atômico race condition evitar não atômico problema.

**Casos uso**: cache compartilhado múltiplas threads add get clear. Fila tarefas produtor-consumidor synchronized remove isEmpty. Logger logs concorrentes timestamp exportar iteração segura. Dados compartilhados múltiplos workers acesso concorrente.

**Alternativas modernas**: CopyOnWriteArrayList snapshot iteração automático sem synchronized muita leitura pouca escrita cópia escrita overhead. ConcurrentLinkedQueue lock-free alta performance fila produtor-consumidor. BlockingQueue bloqueia put take comunicação threads espera fila vazia cheia. synchronizedList uso geral simples legado java.util.concurrent preferir moderna.

**Decisão**: simples uso geral synchronizedList OK. Muita leitura CopyOnWriteArrayList snapshot. Fila ConcurrentLinkedQueue BlockingQueue melhor. Performance crítica java.util.concurrent lock-free. Iteração frequente CopyOnWriteArrayList evitar synchronized manual.

