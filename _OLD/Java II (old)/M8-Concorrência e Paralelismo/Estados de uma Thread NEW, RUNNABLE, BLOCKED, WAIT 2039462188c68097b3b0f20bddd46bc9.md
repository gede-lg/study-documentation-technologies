# Estados de uma Thread: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED

Tudo bem, Gedê\! Vamos entender os estados de uma `Thread` em Java, um tópico super importante para quem trabalha com concorrência e programação Backend.

## Estados de uma Thread em Java: NEW, RUNNABLE, BLOCKED, WAITING, TIMED\_WAITING, TERMINATED

### 1\. Introdução

No desenvolvimento de sistemas backend, como os que você cria em Java, a capacidade de executar múltiplas tarefas simultaneamente é fundamental para a performance e a responsividade. Isso é alcançado através da **concorrência**, e as **threads** são o bloco de construção mais básico para implementar essa concorrência em Java.

Compreender os diferentes **estados de uma `Thread`** é crucial para diagnosticar problemas de performance, evitar *deadlocks* e garantir que suas aplicações concorrentes se comportem como esperado. Cada `Thread` em Java passa por um ciclo de vida que a leva por diferentes estados, desde sua criação até sua conclusão. Gerenciar threads sem entender seus estados pode levar a comportamentos imprevisíveis e bugs difíceis de depurar.

O tema principal aqui são os **seis estados distintos** que uma `Thread` Java pode assumir, conforme definido pela enumeração `Thread.State` na API Java. Cada estado indica o que a thread está fazendo em um determinado momento, se está aguardando, executando, bloqueada ou já finalizou sua execução.

### 2\. Sumário

- **Introdução aos Estados da Thread**
    - Definição e propósito dos estados
- **Os Seis Estados da Thread**
    - `NEW`
    - `RUNNABLE`
    - `BLOCKED`
    - `WAITING`
    - `TIMED_WAITING`
    - `TERMINATED`
- **Sintaxe e Interação dos Estados**
- **Exemplos de Código para Cada Estado**
- **Informações Adicionais**
    - Diferenças entre `BLOCKED`, `WAITING` e `TIMED_WAITING`
    - Ferramentas para monitorar estados
- **Referências para Estudo Independente**

---

### 3\. Conteúdo Detalhado

### Os Seis Estados da Thread

A enumeração `java.lang.Thread.State` define os seis estados possíveis para uma thread. Vamos detalhar cada um deles:

- **`NEW` (Nova)**
    - **Função:** Uma thread está no estado `NEW` quando foi instanciada, mas o método `start()` ainda não foi invocado. Ela existe como um objeto `Thread` no Java Virtual Machine (JVM), mas ainda não está qualificada para ser executada pelo escalonador do sistema operacional.
    - **Transição:** Daqui, ela só pode ir para o estado `RUNNABLE` através da chamada ao método `start()`.
- **`RUNNABLE` (Executável)**
    - **Função:** Uma thread está no estado `RUNNABLE` quando foi iniciada e está qualificada para ser executada pelo escalonador de threads do sistema operacional. Isso não significa que ela *está* necessariamente executando neste exato momento, mas sim que ela está pronta para ser executada a qualquer momento que o escalonador a selecione.
    - **Transição:** Uma thread pode entrar e sair do estado `RUNNABLE` várias vezes durante sua vida útil. Ela pode vir do estado `NEW` (após `start()`) ou de `BLOCKED`, `WAITING` ou `TIMED_WAITING` (quando a condição de espera é satisfeita).
- **`BLOCKED` (Bloqueada)**
    - **Função:** Uma thread entra no estado `BLOCKED` quando tenta acessar um bloco ou método sincronizado, mas o monitor associado ao objeto já está sendo mantido por outra thread. Ela está aguardando para adquirir o *lock* para continuar sua execução.
    - **Causa Comum:** Principalmente devido ao uso de `synchronized` (métodos ou blocos) quando há contenção pelo mesmo objeto.
    - **Transição:** Só pode voltar para `RUNNABLE` quando o *lock* que ela precisa for liberado pela thread que o detinha.
- **`WAITING` (Aguardando)**
    - **Função:** Uma thread está no estado `WAITING` quando está aguardando indefinidamente que outra thread execute uma ação específica. Isso geralmente acontece através da chamada de métodos como `Object.wait()`, `Thread.join()` sem timeout, ou `LockSupport.park()`.
    - **Causa Comum:** Métodos de coordenação de threads que fazem a thread esperar indefinidamente até ser notificada.
    - **Transição:** Ela só pode voltar para `RUNNABLE` se for explicitamente notificada por outra thread (ex: `Object.notify()` ou `Object.notifyAll()`), ou se a thread que ela estava esperando (`join()`) terminar.
- **`TIMED_WAITING` (Aguardando com Tempo Limite)**
    - **Função:** Similar a `WAITING`, mas a thread está esperando por um período de tempo especificado (um "timeout") para que outra thread execute uma ação ou para que um evento ocorra. Ela pode sair desse estado se for notificada ou se o tempo limite expirar.
    - **Causa Comum:** Métodos como `Thread.sleep()`, `Object.wait(long timeout)`, `Thread.join(long timeout)`, `LockSupport.parkNanos()`, `LockSupport.parkUntil()`.
    - **Transição:** Pode voltar para `RUNNABLE` se for notificada (como em `WAITING`) **OU** se o tempo limite especificado expirar.
- **`TERMINATED` (Terminada)**
    - **Função:** Uma thread está no estado `TERMINATED` quando sua execução foi concluída. Isso acontece quando o método `run()` (ou `call()` para `Callable`) termina normalmente, ou quando uma exceção não capturada é lançada e a thread é encerrada.
    - **Transição:** Este é o estado final. Uma thread nunca pode voltar para outro estado após entrar em `TERMINATED`.

### Sintaxe e Interação dos Estados

Não há uma "sintaxe" direta para os estados em si, mas sim para os métodos que causam as transições de estado. A enumeração `Thread.State` pode ser acessada para obter o estado atual de uma thread:

```java
Thread thread = new Thread(() -> {
    // Simula algum trabalho
    try {
        Thread.sleep(100); // Entra em TIMED_WAITING
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
});

System.out.println("Estado antes de start(): " + thread.getState()); // NEW
thread.start();
System.out.println("Estado após start(): " + thread.getState()); // RUNNABLE (provavelmente)

// Em algum ponto futuro, após o sleep ou conclusão do run():
// System.out.println("Estado em tempo de execução: " + thread.getState());
// System.out.println("Estado após terminar: " + thread.getState()); // TERMINATED

```

---

### 4\. Exemplos de Código Otimizados

Vamos ver exemplos práticos para cada transição de estado.

### Exemplo 1: `NEW` para `RUNNABLE` para `TERMINATED`

```java
public class BasicThreadLifecycle {

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            System.out.println("Thread " + Thread.currentThread().getName() + " está executando.");
            try {
                // Simula algum trabalho
                Thread.sleep(50); // Vai para TIMED_WAITING por um curto período
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // Boa prática ao lidar com InterruptedException
                System.out.println("Thread interrompida.");
            }
            System.out.println("Thread " + Thread.currentThread().getName() + " terminou sua execução.");
        };

        Thread myThread = new Thread(task, "MinhaThreadBasica");

        // 1. Estado NEW: Thread criada, mas ainda não iniciada.
        System.out.println("Estado da thread (antes de start()): " + myThread.getState()); // Saída: NEW

        myThread.start(); // Inicia a thread

        // 2. Estado RUNNABLE (e TIMED_WAITING temporariamente): Thread está pronta para ser executada.
        // O estado pode ser RUNNABLE ou TIMED_WAITING rapidamente, dependendo do escalonador.
        System.out.println("Estado da thread (após start()): " + myThread.getState());

        // Espera um pouco para a thread ter chance de executar e talvez terminar
        Thread.sleep(100);

        // 3. Estado TERMINATED: Thread completou sua execução.
        System.out.println("Estado da thread (após um tempo, pode ser TERMINATED): " + myThread.getState());

        // Garante que a thread terminou antes de verificar o estado final
        myThread.join();
        System.out.println("Estado final da thread (após join): " + myThread.getState()); // Saída: TERMINATED
    }
}

```

### Exemplo 2: `BLOCKED` (Bloqueada por um `synchronized` monitor)

```java
public class BlockedStateExample {

    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable task1 = () -> {
            System.out.println("Thread " + Thread.currentThread().getName() + " tentando adquirir o lock...");
            synchronized (lock) { // Adquire o lock
                System.out.println("Thread " + Thread.currentThread().getName() + " adquiriu o lock.");
                try {
                    Thread.sleep(200); // Mantém o lock por um tempo
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Thread " + Thread.currentThread().getName() + " liberando o lock.");
            } // Libera o lock
        };

        Thread thread1 = new Thread(task1, "Thread-1");
        Thread thread2 = new Thread(task1, "Thread-2"); // Esta thread tentará adquirir o mesmo lock

        thread1.start();
        // Garante que thread1 tenha tempo de adquirir o lock
        Thread.sleep(50);

        thread2.start();
        // Dá um pequeno tempo para thread2 tentar adquirir o lock
        Thread.sleep(10);

        // thread2 deve estar BLOCKED porque thread1 ainda detém o lock
        System.out.println("Estado da " + thread1.getName() + ": " + thread1.getState());
        System.out.println("Estado da " + thread2.getName() + ": " + thread2.getState()); // Saída: BLOCKED

        // Espera ambas as threads terminarem
        thread1.join();
        thread2.join();

        System.out.println("Estado final da " + thread1.getName() + ": " + thread1.getState());
        System.out.println("Estado final da " + thread2.getName() + ": " + thread2.getState());
    }
}

```

### Exemplo 3: `WAITING` (Aguardando indefinidamente com `wait()` e `notify()`)

```java
public class WaitingStateExample {

    private static final Object monitor = new Object();
    private static boolean dataReady = false;

    public static void main(String[] args) throws InterruptedException {

        Thread producer = new Thread(() -> {
            synchronized (monitor) {
                System.out.println("Produtor: Preparando os dados...");
                try {
                    Thread.sleep(100); // Simula trabalho
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                dataReady = true;
                System.out.println("Produtor: Dados prontos, notificando consumidor.");
                monitor.notify(); // Notifica a thread esperando no monitor
            }
        }, "Produtor");

        Thread consumer = new Thread(() -> {
            synchronized (monitor) {
                while (!dataReady) { // Loop para evitar "spurious wakeups"
                    try {
                        System.out.println("Consumidor: Dados não prontos, aguardando...");
                        monitor.wait(); // Entra em WAITING, libera o lock
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
                System.out.println("Consumidor: Dados recebidos e processados!");
            }
        }, "Consumidor");

        consumer.start();
        // Dá um tempo para o consumidor iniciar e entrar em WAITING
        Thread.sleep(50);
        System.out.println("Estado do Consumidor (após wait()): " + consumer.getState()); // Saída: WAITING

        producer.start();

        // Espera ambas as threads terminarem
        producer.join();
        consumer.join();

        System.out.println("Estado final do Produtor: " + producer.getState());
        System.out.println("Estado final do Consumidor: " + consumer.getState());
    }
}

```

### Exemplo 4: `TIMED_WAITING` (Aguardando com tempo limite com `Thread.sleep()`)

```java
public class TimedWaitingStateExample {

    public static void main(String[] args) throws InterruptedException {
        Thread sleepyThread = new Thread(() -> {
            System.out.println("Thread " + Thread.currentThread().getName() + " vai dormir por 200ms.");
            try {
                Thread.sleep(200); // Entra em TIMED_WAITING por 200ms
            .println("Thread " + Thread.currentThread().getName() + " acordou.");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.out.println("Thread " + Thread.currentThread().getName() + " foi interrompida enquanto dormia.");
            }
            System.out.println("Thread " + Thread.currentThread().getName() + " terminou.");
        }, "SleepyThread");

        sleepyThread.start();
        // Dá um pequeno tempo para a thread iniciar e entrar no estado TIMED_WAITING
        Thread.sleep(10);
        System.out.println("Estado da " + sleepyThread.getName() + " (enquanto dorme): " + sleepyThread.getState()); // Saída: TIMED_WAITING

        // Espera a thread terminar
        sleepyThread.join();
        System.out.println("Estado final da " + sleepyThread.getName() + ": " + sleepyThread.getState()); // Saída: TERMINATED
    }
}

```

---

### 5\. Informações Adicionais

### Diferenças Chave entre `BLOCKED`, `WAITING` e `TIMED_WAITING`

É comum haver confusão entre esses três estados:

- **`BLOCKED`:** Ocorre quando uma thread tenta entrar em um bloco/método `synchronized` mas o *lock* do monitor já está sendo segurado por outra thread. A thread `BLOCKED` *não* libera o *lock* que ela possivelmente já tem; ela está tentando adquirir um novo *lock*.
- **`WAITING`:** Ocorre quando uma thread chama `Object.wait()` (sem timeout), `Thread.join()` (sem timeout) ou `LockSupport.park()`. Nesse estado, a thread *libera* o *lock* do monitor que ela possui e espera ser explicitamente notificada por outra thread. Ela está aguardando por uma condição ou evento arbitrário.
- **`TIMED_WAITING`:** Similar a `WAITING`, mas com um tempo limite. A thread *libera* o *lock* e espera ser notificada ou que o tempo limite expire.

### Ferramentas para Monitorar Estados de Threads

No dia a dia de um desenvolvedor Backend Java, Gedê, você pode usar ferramentas para inspecionar o estado das threads em uma aplicação em execução:

- **`jstack` (JDK Tool):** Ferramenta de linha de comando que imprime *stack traces* de threads Java para um determinado processo Java. Isso inclui o estado de cada thread e os *locks* que elas possuem ou estão aguardando.
- **VisualVM:** Uma ferramenta gráfica que faz parte do JDK, oferece um GUI para monitorar a JVM, incluindo a visualização dos estados das threads, detecção de *deadlocks* e análise de performance.
- **JProfiler / YourKit:** Ferramentas de *profiling* comerciais mais avançadas que fornecem insights detalhados sobre a execução das threads, contenção de *locks*, e muito mais.
- **APMs (Application Performance Monitoring):** Soluções como New Relic, Dynatrace, ou Prometheus/Grafana (com Micrometer em seu código) podem coletar métricas sobre o uso de threads e seus estados em ambientes de produção.

Dominar esses estados é um passo significativo para escrever código concorrente robusto e performático.

---

### 6\. Referências para Estudo Independente

- **Documentação Oficial da Oracle:**
    - `Thread.State` Enum: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.State.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.State.html)
    - `Thread` Class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html)
    - Concurrency Utilities in Java (Package `java.util.concurrent`): [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
- **Artigos e Livros Recomendados:**
    - **"Java Concurrency in Practice" por Brian Goetz et al.:** Considerado a "bíblia" da concorrência em Java. Seções sobre o ciclo de vida da thread são excelentes.
    - **TutorialsPoint - Java Thread Life Cycle:** [https://www.tutorialspoint.com/java/java\\_thread\\_life\\_cycle.htm](https://www.tutorialspoint.com/java/java%5C%5C_thread%5C%5C_life%5C%5C_cycle.htm) (Para uma revisão rápida e exemplos básicos)
    - **Baeldung - Java Thread States:** [https://www.baeldung.com/java-thread-states](https://www.baeldung.com/java-thread-states) (Artigo bem detalhado com exemplos)

Dominar a concorrência é um diferencial e tanto para desenvolvedores Backend. Fico à disposição para a próxima explicação, Gedê\! Qual será o próximo tópico que você quer revisar?