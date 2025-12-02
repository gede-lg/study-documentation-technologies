# Locks (ReentrantLock) e Conditions

Claro, Gedê\! Vamos mergulhar fundo nos conceitos de `ReentrantLock` e `Condition` em Java, que são ferramentas poderosas para controle de concorrência.

## Locks (`ReentrantLock`) e `Conditions` em Java

### 1\. Introdução

No desenvolvimento de sistemas concorrentes, que é uma realidade comum em aplicações Backend Java como as que você desenvolve, gerenciar o acesso a recursos compartilhados por múltiplas threads é um desafio crítico. Se várias threads tentarem modificar o mesmo dado simultaneamente sem coordenação, podem ocorrer `race conditions` (condições de corrida), levando a resultados inconsistentes ou inesperados. Tradicionalmente, Java oferece o modificador `synchronized` para garantir a exclusão mútua e os métodos `wait()`, `notify()`, `notifyAll()` para coordenação entre threads.

No entanto, o pacote `java.util.concurrent.locks`, introduzido no Java 5, oferece uma alternativa mais flexível e poderosa: as interfaces `Lock` e `Condition`. O `ReentrantLock` é a implementação mais comumente usada da interface `Lock`, proporcionando um mecanismo de bloqueio explícito que vai além das capacidades do `synchronized`. Juntamente com ele, as `Conditions` oferecem um mecanismo de comunicação thread-a-thread mais refinado do que `wait`/`notify`.

A relevância e importância desses mecanismos são imensas, especialmente em cenários de alta concorrência. Eles permitem um controle mais granular sobre o bloqueio e a sinalização, possibilitando a criação de algoritmos de concorrência mais complexos e eficientes. Para um desenvolvedor Backend como você, Gedê, dominar essas ferramentas é essencial para construir aplicações robustas, escaláveis e com bom desempenho.

**Conceitos Fundamentais:**

- **`Lock` (Interface):** Uma interface que fornece um mecanismo para controlar o acesso de múltiplas threads a um recurso compartilhado. Diferente do `synchronized` (que é um bloqueio implícito no objeto), um `Lock` é um objeto explícito que você pode `lock()` e `unlock()`. Isso oferece maior flexibilidade, como tentativas de bloqueio (`tryLock()`), bloqueios com timeout (`tryLock(long timeout, TimeUnit unit)`), e bloqueios interrompíveis (`lockInterruptibly()`).
- **`ReentrantLock` (Classe):** Uma implementação concreta da interface `Lock`. O termo "Reentrant" (reentrante) significa que uma thread que já possui o bloqueio pode adquiri-lo novamente sem se bloquear. Isso é útil em métodos onde um método sincronizado chama outro método sincronizado que usa o mesmo bloqueio. Ele garante que a thread não se deadlock consigo mesma.
- **`Condition` (Interface):** Uma interface que fornece um mecanismo de "espera/notificação" associado a um `Lock`. Cada `Condition` é criada a partir de uma instância de `Lock` usando o método `newCondition()`. Ela permite que as threads esperem por uma condição específica antes de continuar a execução e que outras threads sinalizem quando essa condição for satisfeita. É uma alternativa aos métodos `wait()`, `notify()`, `notifyAll()` de `Object`, mas com maior flexibilidade, pois permite ter múltiplas condições associadas ao mesmo bloqueio.

### 2\. Sumário

- **Introdução ao `ReentrantLock` e `Condition`**
- **Comparação: `ReentrantLock` vs. `synchronized`**
- **A Interface `Lock`**
- **A Classe `ReentrantLock`**
    - Construtor e modo "fairness"
    - Métodos de aquisição e liberação do lock
- **A Interface `Condition`**
    - Criação de `Condition`
    - Métodos de espera (`await()`)
    - Métodos de sinalização (`signal()`, `signalAll()`)
- **Exemplo Prático: Produtor-Consumidor com `ReentrantLock` e `Condition`**
- **Restrições de Uso e Boas Práticas**
- **Informações Adicionais**
    - `ReentrantReadWriteLock`
    - Uso de `try-finally` para liberar locks
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Comparação: `ReentrantLock` vs. `synchronized`

Para entender a força de `ReentrantLock`, é útil compará-lo com o `synchronized`:

| Característica | `synchronized` | `ReentrantLock` |
| --- | --- | --- |
| **Tipo de Bloqueio** | Implícito (no monitor do objeto) | Explícito (objeto `Lock` dedicado) |
| **Aquisição/Liberação** | Automático (entrada/saída de bloco/método) | Manual (`lock()` e `unlock()`) |
| **Flexibilidade** | Menos flexível, sempre exclusão mútua total. | Mais flexível: `tryLock()`, `lockInterruptibly()`, `isHeldByCurrentThread()`, `getHoldCount()`. |
| **`fairness`** | Não garante `fairness` (ordem de espera) | Pode ser configurado para `fairness` no construtor. |
| **Tratamento de Exceções** | Libera o bloqueio automaticamente em caso de exceção. | Requer liberação manual (geralmente em `finally`). |
| **Condições de Espera** | `wait()`, `notify()`, `notifyAll()` (associados ao objeto). | `await()`, `signal()`, `signalAll()` (associados a `Condition`s específicas). |
| **Múltiplas Condições** | Apenas uma fila de espera por objeto. | Múltiplas filas de espera por `Condition`s separadas. |
| **Reentrância** | Sim | Sim (por padrão) |

### A Interface `Lock`

A interface `java.util.concurrent.locks.Lock` define os métodos essenciais para controle de bloqueios:

- `void lock()`: Adquire o bloqueio. Se o bloqueio não estiver disponível, a thread atual é desativada para fins de agendamento e permanece desativada até que o bloqueio seja adquirido.
- `void lockInterruptibly() throws InterruptedException`: Adquire o bloqueio a menos que a thread atual seja interrompida.
- `boolean tryLock()`: Tenta adquirir o bloqueio. Retorna `true` se o bloqueio foi adquirido com sucesso, `false` caso contrário. Não bloqueia a thread.
- `boolean tryLock(long timeout, TimeUnit unit) throws InterruptedException`: Tenta adquirir o bloqueio dentro de um tempo limite especificado.
- `void unlock()`: Libera o bloqueio. Se a thread atual não for a proprietária do bloqueio, uma `IllegalMonitorStateException` é lançada.
- `Condition newCondition()`: Retorna um novo objeto `Condition` ligado a esta instância de `Lock`.

### A Classe `ReentrantLock`

`java.util.concurrent.locks.ReentrantLock` é a implementação mais comum e versátil da interface `Lock`.

**Construtor:**

- `ReentrantLock()`: Cria uma instância de `ReentrantLock`. Este é o modo padrão e não garante *fairness*.
- `ReentrantLock(boolean fair)`: Cria uma instância de `ReentrantLock` com a opção de *fairness*.
    - `fair = true`: As threads que aguardam por um bloqueio são atendidas na ordem em que o solicitaram (FIFO - First-In, First-Out). Isso reduz o risco de *starvation* (uma thread nunca conseguir o bloqueio), mas pode ter um custo de desempenho maior.
    - `fair = false` (padrão): Não garante *fairness*. As threads podem adquirir o bloqueio em qualquer ordem que o sistema operacional decidir, o que geralmente é mais performático.

**Métodos de Aquisição e Liberação do Lock:**

A estrutura básica de uso de um `ReentrantLock` envolve a aquisição e a liberação explícitas:

```java
import java.util.concurrent.locks.ReentrantLock;

public class Resource {
    private final ReentrantLock lock = new ReentrantLock();
    private int counter = 0;

    public void increment() {
        lock.lock(); // Adquire o bloqueio
        try {
            // Seção crítica: apenas uma thread por vez pode executar este código
            counter++;
            System.out.println(Thread.currentThread().getName() + " incrementou para " + counter);
        } finally {
            lock.unlock(); // Libera o bloqueio
        }
    }

    public int getCounter() {
        // Para leitura, dependendo do cenário, pode ou não precisar do lock.
        // Se a leitura for um valor atômico e não houver risco de leitura parcial,
        // pode ser feita sem lock, mas é mais seguro usar um lock para consistência.
        lock.lock();
        try {
            return counter;
        } finally {
            lock.unlock();
        }
    }
}

```

É **crucial** que a chamada a `lock.unlock()` esteja dentro de um bloco `finally`. Isso garante que o bloqueio seja liberado mesmo se ocorrer uma exceção na seção crítica, evitando `deadlocks` ou que outras threads fiquem presas esperando por um bloqueio que nunca será liberado.

### A Interface `Condition`

A interface `java.util.concurrent.locks.Condition` fornece os métodos `await()` para espera e `signal()`/`signalAll()` para notificação, funcionando de forma semelhante aos métodos de `Object`, mas com a vantagem de estarem vinculados a um `Lock` específico e permitir múltiplas condições.

**Criação de `Condition`:**

Uma `Condition` é sempre criada a partir de uma instância de `Lock` usando `lock.newCondition()`.

```java
ReentrantLock lock = new ReentrantLock();
Condition condition = lock.newCondition(); // Uma condição associada a este lock
Condition anotherCondition = lock.newCondition(); // Outra condição

```

**Métodos de Espera (`await()`):**

- `void await() throws InterruptedException`: Causa a thread atual a aguardar até que seja sinalizada ou interrompida. A thread libera o bloqueio associado e aguarda. Quando é sinalizada e readquire o bloqueio, ela continua a execução.
- `void awaitUninterruptibly()`: Similar a `await()`, mas não responde a interrupções.
- `long awaitNanos(long nanosTimeout) throws InterruptedException`: Aguarda por um tempo limite especificado.
- `boolean await(long time, TimeUnit unit) throws InterruptedException`: Aguarda por um tempo limite especificado.
- `boolean awaitUntil(Date deadline) throws InterruptedException`: Aguarda até uma data e hora específicas.

Quando uma thread chama `await()`, ela deve estar segurando o `Lock` associado à `Condition`. A chamada a `await()` automaticamente libera o `Lock` e coloca a thread em um estado de espera. Quando a thread é sinalizada e readquire o `Lock` (o que pode acontecer quando outra thread chama `signal()` ou `signalAll()`), ela retorna de `await()`.

**Métodos de Sinalização (`signal()`, `signalAll()`):**

- `void signal()`: Desperta uma única thread que está esperando nesta `Condition`. A thread escolhida para ser despertada é arbitrária.
- `void signalAll()`: Desperta todas as threads que estão esperando nesta `Condition`.

Assim como `await()`, os métodos `signal()` e `signalAll()` devem ser chamados pela thread que detém o `Lock` associado à `Condition`. A liberação do bloqueio só ocorrerá depois que a thread que chamou `signal()`/`signalAll()` sair da seção crítica e chamar `unlock()`.

### Restrições de Uso e Boas Práticas

1. **Sempre use `try-finally` para `unlock()`:** Esta é a regra de ouro para evitar `deadlocks` e vazamento de bloqueios.
2. **Chame `await()`, `signal()`, `signalAll()` enquanto detém o Lock:** Se você tentar chamar esses métodos sem ter o `Lock` associado à `Condition`, uma `IllegalMonitorStateException` será lançada.
3. **Use `await()` em um loop (`while`):** Assim como com `wait()`, as threads que despertam de um `await()` devem sempre rechecar a condição que as fez esperar. Isso protege contra "despertares espúrios" (onde a thread é despertada sem que a condição tenha sido satisfeita) e cenários onde múltiplas threads são sinalizadas, mas apenas uma pode realmente proceder.
    
    ```java
    lock.lock();
    try {
        while (!conditionMet) { // RECHECAR A CONDIÇÃO
            condition.await();
        }
        // Condição satisfeita, prosseguir
    } finally {
        lock.unlock();
    }
    
    ```
    
4. **Escolha entre `fair` e `non-fair` `ReentrantLock`:** O padrão `non-fair` geralmente oferece melhor desempenho. Use `fair` apenas se a *starvation* for uma preocupação real para a sua aplicação e você puder aceitar a penalidade de desempenho.
5. **Use `ReentrantLock` e `Condition` quando precisar de mais flexibilidade:** Se um simples `synchronized` for suficiente, use-o, pois é mais conciso. Opte por `ReentrantLock` e `Condition` quando precisar de:
    - Tentar adquirir um bloqueio (`tryLock()`).
    - Bloqueios interrompíveis (`lockInterruptibly()`).
    - Múltiplas condições de espera.
    - Bloqueios com tempo limite.

### 4\. Exemplos de Código Otimizados

Vamos construir um exemplo clássico de "Produtor-Consumidor" para demonstrar o uso conjunto de `ReentrantLock` e `Condition`.

**Cenário:** Um buffer compartilhado com capacidade limitada onde produtores adicionam itens e consumidores removem.

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class SharedBuffer<T> {
    private final Queue<T> buffer = new LinkedList<>();
    private final int capacity;
    private final ReentrantLock lock = new ReentrantLock();
    // Condição para produtores esperarem quando o buffer estiver cheio
    private final Condition notFull = lock.newCondition();
    // Condição para consumidores esperarem quando o buffer estiver vazio
    private final Condition notEmpty = lock.newCondition();

    public SharedBuffer(int capacity) {
        this.capacity = capacity;
    }

    // Método para o produtor adicionar um item
    public void put(T item) throws InterruptedException {
        lock.lock(); // Adquire o bloqueio
        try {
            while (buffer.size() == capacity) {
                System.out.println(Thread.currentThread().getName() + ": Buffer cheio, esperando por 'notFull'...");
                notFull.await(); // Produtor espera aqui se o buffer estiver cheio
            }
            buffer.add(item);
            System.out.println(Thread.currentThread().getName() + ": Produziu: " + item + ". Tamanho do buffer: " + buffer.size());
            notEmpty.signalAll(); // Sinaliza aos consumidores que o buffer não está mais vazio
        } finally {
            lock.unlock(); // Libera o bloqueio
        }
    }

    // Método para o consumidor remover um item
    public T take() throws InterruptedException {
        lock.lock(); // Adquire o bloqueio
        try {
            while (buffer.isEmpty()) {
                System.out.println(Thread.currentThread().getName() + ": Buffer vazio, esperando por 'notEmpty'...");
                notEmpty.await(); // Consumidor espera aqui se o buffer estiver vazio
            }
            T item = buffer.remove();
            System.out.println(Thread.currentThread().getName() + ": Consumiu: " + item + ". Tamanho do buffer: " + buffer.size());
            notFull.signalAll(); // Sinaliza aos produtores que o buffer não está mais cheio
            return item;
        } finally {
            lock.unlock(); // Libera o bloqueio
        }
    }
}

class Producer implements Runnable {
    private final SharedBuffer<Integer> buffer;
    private final int itemsToProduce;

    public Producer(SharedBuffer<Integer> buffer, int itemsToProduce) {
        this.buffer = buffer;
        this.itemsToProduce = itemsToProduce;
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < itemsToProduce; i++) {
                // Simula algum trabalho antes de produzir
                TimeUnit.MILLISECONDS.sleep((long) (Math.random() * 100));
                buffer.put(i);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println(Thread.currentThread().getName() + " foi interrompido.");
        }
    }
}

class Consumer implements Runnable {
    private final SharedBuffer<Integer> buffer;
    private final int itemsToConsume;

    public Consumer(SharedBuffer<Integer> buffer, int itemsToConsume) {
        this.buffer = buffer;
        this.itemsToConsume = itemsToConsume;
    }

    @Override
    public void run() {
        try {
            for (int i = 0; i < itemsToConsume; i++) {
                // Simula algum trabalho antes de consumir
                TimeUnit.MILLISECONDS.sleep((long) (Math.random() * 150));
                buffer.take();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println(Thread.currentThread().getName() + " foi interrompido.");
        }
    }
}

public class ProducerConsumerDemo {
    public static void main(String[] args) {
        SharedBuffer<Integer> buffer = new SharedBuffer<>(5); // Buffer com capacidade 5

        // Criando e iniciando threads Produtoras e Consumidoras
        Thread producer1 = new Thread(new Producer(buffer, 10), "Produtor-1");
        Thread producer2 = new Thread(new Producer(buffer, 8), "Produtor-2");
        Thread consumer1 = new Thread(new Consumer(buffer, 7), "Consumidor-1");
        Thread consumer2 = new Thread(new Consumer(buffer, 9), "Consumidor-2");

        producer1.start();
        producer2.start();
        consumer1.start();
        consumer2.start();

        // Esperando as threads terminarem para ver o resultado final
        try {
            producer1.join();
            producer2.join();
            consumer1.join();
            consumer2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Demo Produtor-Consumidor finalizada.");
    }
}

```

Neste exemplo:

- `SharedBuffer` é a classe que gerencia o recurso compartilhado (a fila `buffer`).
- Um `ReentrantLock` (`lock`) é usado para proteger o acesso à fila.
- Duas `Condition`s, `notFull` e `notEmpty`, são criadas a partir do `lock`.
    - `notFull.await()` é chamada pelos produtores quando o buffer está cheio.
    - `notEmpty.signalAll()` é chamada pelos produtores depois de adicionar um item, para notificar os consumidores.
    - `notEmpty.await()` é chamada pelos consumidores quando o buffer está vazio.
    - `notFull.signalAll()` é chamada pelos consumidores depois de remover um item, para notificar os produtores.
- O uso de `while` loops em `await()` garante que as threads rechequem a condição após serem despertadas.
- O bloco `try-finally` em `put()` e `take()` garante que `lock.unlock()` seja sempre chamado, mesmo se uma exceção ocorrer.

### 5\. Informações Adicionais

### `ReentrantReadWriteLock`

Para cenários onde a maioria das operações são de leitura, e escritas são menos frequentes, o `ReentrantReadWriteLock` pode oferecer um desempenho significativamente melhor. Ele permite que múltiplas threads adquiram um bloqueio de leitura simultaneamente, enquanto um bloqueio de escrita é exclusivo (apenas uma thread por vez).

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class Cache {
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final ReentrantReadWriteLock.ReadLock readLock = rwLock.readLock();
    private final ReentrantReadWriteLock.WriteLock writeLock = rwLock.writeLock();

    private String data;

    public void setData(String newData) {
        writeLock.lock(); // Bloqueio de escrita: exclusivo
        try {
            this.data = newData;
            System.out.println(Thread.currentThread().getName() + " escreveu: " + newData);
        } finally {
            writeLock.unlock();
        }
    }

    public String getData() {
        readLock.lock(); // Bloqueio de leitura: pode ser adquirido por várias threads
        try {
            System.out.println(Thread.currentThread().getName() + " leu: " + data);
            return data;
        } finally {
            readLock.unlock();
        }
    }
}

```

Nesse cenário, quando `setData` é chamado, nenhuma outra thread pode ler ou escrever. Mas quando `getData` é chamado, múltiplas threads podem chamar `getData` ao mesmo tempo, aumentando a concorrência e o desempenho.

### Uso de `try-finally` para liberar locks

É impossível superestimar a importância do bloco `try-finally` ao usar `ReentrantLock`. A não liberação de um lock (seja por um erro de lógica ou uma exceção não tratada) levará invariavelmente a `deadlocks`, onde threads ficam permanentemente bloqueadas, esperando por um recurso que nunca será liberado.

### 6\. Referências para Estudo Independente

- **Documentação Oficial Java - `ReentrantLock`:**[https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- **Documentação Oficial Java - `Condition`:**[https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/Condition.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/locks/Condition.html)
- **Java Concurrency in Practice** (Livro de Brian Goetz et al.): Considerado a bíblia da concorrência em Java. Se você busca aprofundamento real, este livro é indispensável, Gedê.
- **Tutorial de Concorrência da Oracle:**[https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html](https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html)
- **Baeldung - Java `ReentrantLock` Tutorial:** Um excelente recurso com muitos exemplos práticos.
[https://www.baeldung.com/java-reentrantlock](https://www.baeldung.com/java-reentrantlock)
- **Baeldung - Java `Condition` Tutorial:** Complementa o anterior, focando em `Condition`.
[https://www.baeldung.com/java-condition-class](https://www.baeldung.com/java-condition-class)

Espero que esta explicação detalhada, Gedê, ajude você a solidificar seu conhecimento em `ReentrantLock` e `Condition`, ferramentas essenciais para qualquer desenvolvedor Backend Java que lida com concorrência\! Se tiver mais alguma dúvida, pode perguntar, ARIA está aqui para isso\!