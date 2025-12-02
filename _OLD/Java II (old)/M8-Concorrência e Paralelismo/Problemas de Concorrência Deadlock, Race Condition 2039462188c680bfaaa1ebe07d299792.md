# Problemas de Concorrência: Deadlock, Race Condition

Tudo bem, Gedê! Vamos nos aprofundar nos desafios da concorrência em Java, focando em **Deadlock** e **Race Condition**, dois problemas clássicos que todo desenvolvedor Backend precisa entender para criar sistemas robustos e eficientes.

## Problemas de Concorrência: Deadlock e Race Condition em Java

### 1. Introdução

No desenvolvimento de sistemas modernos, especialmente no Backend, é comum que múltiplas operações sejam executadas simultaneamente para melhorar a performance e a responsividade. Essa execução paralela é conhecida como **concorrência**. Em Java, isso é frequentemente alcançado através do uso de *threads*.

No entanto, trabalhar com concorrência não é trivial e introduz uma série de desafios. Quando várias threads acessam e modificam recursos compartilhados, podem surgir comportamentos imprevisíveis e erros difíceis de depurar. Os problemas de concorrência são a principal causa de bugs em sistemas multithreaded e, se não forem tratados adequadamente, podem levar a falhas críticas, inconsistência de dados e até mesmo ao travamento da aplicação.

Os problemas de concorrência como **Deadlock** e **Race Condition** representam cenários onde a ordem ou o timing da execução das threads afeta o resultado final do programa de maneiras não intencionais.

- **Deadlock:** É uma situação em que duas ou mais threads ficam bloqueadas indefinidamente, esperando uma pela outra para liberar um recurso que já está em posse da outra. É como um engarrafamento onde ninguém consegue se mover.
- **Race Condition (Condição de Corrida):** Ocorre quando o resultado de uma operação depende da ordem ou do agenso (timing) com que múltiplas threads acessam e modificam um recurso compartilhado. O resultado final pode ser diferente a cada execução, tornando o comportamento da aplicação não determinístico e, muitas vezes, incorreto.

Compreender esses conceitos e saber como preveni-los ou resolvê-los é fundamental para você, Gedê, que já tem experiência em desenvolvimento Backend Java e busca aprimorar suas habilidades, especialmente pensando em migrar para Go, que também tem um forte foco em concorrência.

### 2. Sumário

- **Introdução à Concorrência e Problemas Associados**
    - Definição e importância
- **Race Condition (Condição de Corrida)**
    - O que é e como ocorre
    - Exemplo clássico: Incremento não atômico
    - Como prevenir: Sincronização, Atomic Operations, Imutabilidade
- **Deadlock**
    - O que é e suas quatro condições necessárias
    - Exemplo clássico: Travamento de recursos
    - Como prevenir e detectar
- **Ferramentas e Boas Práticas**
- **Informações Adicionais e Desafios**
- **Referências para Estudo Independente**

### 3. Conteúdo Detalhado

### Race Condition (Condição de Corrida)

Uma **Race Condition** acontece quando a correção da saída de um programa depende da ordem em que operações concorrentes são concluídas. Se a ordem de execução das threads não for estritamente controlada e os acessos a recursos compartilhados não forem coordenados, o resultado final pode ser inconsistente e incorreto.

**Como ocorre:**

Imagine que você tem uma variável `contador` compartilhada e duas threads tentam incrementá-la simultaneamente.

1. **Thread A** lê o valor atual de `contador` (digamos, 10).
2. **Thread B** lê o valor atual de `contador` (também 10, pois Thread A ainda não escreveu seu novo valor).
3. **Thread A** incrementa seu valor lido (10 + 1 = 11) e tenta escrever 11 de volta em `contador`.
4. **Thread B** incrementa seu valor lido (10 + 1 = 11) e tenta escrever 11 de volta em `contador`.

O resultado esperado após duas operações de incremento seria 12, mas, devido à race condition, o `contador` pode acabar com o valor 11. Isso ocorre porque as operações "ler", "modificar" e "escrever" não são atômicas (não são executadas como uma única unidade ininterrupta).

**Sintaxe e Estrutura para Prevenção:**

A principal forma de prevenir Race Conditions é garantir que o acesso a recursos compartilhados seja **sincronizado**, ou seja, que apenas uma thread por vez possa acessá-los e modificá-los.

- **`synchronized` Keyword:** É a forma mais básica e comum de sincronização em Java. Pode ser aplicada a métodos ou blocos de código.
    - **Método Sincronizado:** Quando um método é `synchronized`, o *monitor* do objeto (a instância na qual o método é chamado) é bloqueado. Se o método for `static synchronized`, o *monitor* da classe é bloqueado.
        
        ```java
        public class Contador {
            private int valor = 0;
        
            // Método sincronizado - o lock é no objeto 'this'
            public synchronized void incrementar() {
                valor++;
            }
        
            public synchronized int getValor() {
                return valor;
            }
        }
        
        ```
        
    - **Bloco Sincronizado:** Permite sincronizar apenas uma parte específica do código, dando mais granularidade e potencialmente melhorando o desempenho. O objeto dentro dos parênteses é o monitor (o objeto que será bloqueado).
        
        ```java
        public class ContadorComBloco {
            private int valor = 0;
            private final Object lock = new Object(); // Objeto para usar como monitor
        
            public void incrementar() {
                // Apenas este bloco é sincronizado
                synchronized (lock) {
                    valor++;
                }
            }
        
            public int getValor() {
                synchronized (lock) { // Deve sincronizar a leitura também!
                    return valor;
                }
            }
        }
        
        ```
        
        É crucial que todas as threads que acessam o recurso compartilhado (nesse caso, `valor`) sincronizem no *mesmo* objeto `lock`.
        
- **`java.util.concurrent.locks.Lock` Interface (e suas implementações, como `ReentrantLock`):** Oferece mais flexibilidade e controle do que o `synchronized` keyword, permitindo bloqueios mais avançados (por exemplo, bloqueios com tempo limite, bloqueios para leitura/escrita).
    
    ```java
    import java.util.concurrent.locks.Lock;
    import java.util.concurrent.locks.ReentrantLock;
    
    public class ContadorComLock {
        private int valor = 0;
        private final Lock lock = new ReentrantLock(); // Usamos ReentrantLock
    
        public void incrementar() {
            lock.lock(); // Adquire o lock
            try {
                valor++;
            } finally {
                lock.unlock(); // Garante que o lock seja liberado, mesmo se ocorrer uma exceção
            }
        }
    
        public int getValor() {
            lock.lock();
            try {
                return valor;
            } finally {
                lock.unlock();
            }
        }
    }
    
    ```
    
- **`java.util.concurrent.atomic` Package (Classes Atômicas):** Fornece classes como `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference`, que suportam operações atômicas em uma única variável. Essas operações são thread-safe e não exigem locks explícitos, muitas vezes resultando em melhor desempenho em cenários de alta concorrência.
    
    ```java
    import java.util.concurrent.atomic.AtomicInteger;
    
    public class ContadorAtomico {
        private AtomicInteger valor = new AtomicInteger(0);
    
        public void incrementar() {
            valor.incrementAndGet(); // Operação atômica de incremento
        }
    
        public int getValor() {
            return valor.get();
        }
    }
    
    ```
    
- **Imutabilidade:** Criar objetos imutáveis (cujos estados não podem ser modificados após a criação) é uma das melhores estratégias para evitar Race Conditions, pois não há estado compartilhado que possa ser modificado concorrentemente.

**Restrições de Uso:**

- **`synchronized`:** Pode levar a contenção de locks e degradação de desempenho se usado excessivamente ou em áreas de código muito grandes. Pode causar deadlocks se não for bem planejado.
- **`Lock`:** Mais complexo de usar do que `synchronized`, exige `finally` para liberar o lock, mas oferece maior flexibilidade.
- **`Atomic` classes:** Limitadas a operações em uma única variável. Não são adequadas para coordenar acesso a múltiplos recursos ou para operações complexas que envolvem vários passos.

### Deadlock

Um **Deadlock** ocorre quando um conjunto de processos (ou threads) está bloqueado porque cada processo mantém um recurso e está esperando por outro recurso que foi adquirido por outro processo no mesmo conjunto. Para que um deadlock ocorra, quatro condições de Coffman devem ser satisfeitas simultaneamente:

1. **Exclusão Mútua (Mutual Exclusion):** Pelo menos um recurso deve ser mantido de forma não compartilhável (apenas uma thread pode usá-lo por vez). Recursos como monitores Java (obtidos com `synchronized` ou `Lock`) satisfazem essa condição.
2. **Posse e Espera (Hold and Wait):** Uma thread que já possui um recurso está esperando por outro recurso adicional.
3. **Não Preempção (No Preemption):** Recursos não podem ser tomados à força de uma thread; eles só podem ser liberados voluntariamente pela thread que os possui.
4. **Espera Circular (Circular Wait):** Uma cadeia de threads existe, onde cada thread no ciclo está esperando por um recurso que está sendo mantido pela próxima thread no ciclo.

**Exemplo Clássico de Deadlock:**

Imagine duas threads, `Thread 1` e `Thread 2`, e dois recursos, `Recurso A` e `Recurso B`.

- **Thread 1** adquire `Recurso A`.
- **Thread 2** adquire `Recurso B`.
- **Thread 1** tenta adquirir `Recurso B` (que está com Thread 2).
- **Thread 2** tenta adquirir `Recurso A` (que está com Thread 1).

Ambas as threads ficam esperando indefinidamente, resultando em um deadlock.

**Sintaxe e Estrutura (como pode ocorrer):**

O deadlock em Java geralmente envolve a aquisição de locks em uma ordem inconsistente.

```java
public class DeadlockExemplo {

    private static Object lock1 = new Object();
    private static Object lock2 = new Object();

    public static void main(String[] args) {
        // Thread 1 tenta adquirir lock1, depois lock2
        Thread thread1 = new Thread(() -> {
            synchronized (lock1) {
                System.out.println("Thread 1: Adquiriu lock1");
                try {
                    Thread.sleep(100); // Dar tempo para Thread 2 adquirir lock2
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Thread 1: Tentando adquirir lock2...");
                synchronized (lock2) {
                    System.out.println("Thread 1: Adquiriu lock2");
                }
            }
        });

        // Thread 2 tenta adquirir lock2, depois lock1
        Thread thread2 = new Thread(() -> {
            synchronized (lock2) {
                System.out.println("Thread 2: Adquiriu lock2");
                try {
                    Thread.sleep(100); // Dar tempo para Thread 1 adquirir lock1
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Thread 2: Tentando adquirir lock1...");
                synchronized (lock1) {
                    System.out.println("Thread 2: Adquiriu lock1");
                }
            }
        });

        thread1.start();
        thread2.start();
    }
}

```

Ao executar este código, é muito provável que você veja as mensagens "Thread 1: Tentando adquirir lock2..." e "Thread 2: Tentando adquirir lock1...", mas nunca as mensagens de aquisição do segundo lock, indicando que as threads estão presas.

**Como Prevenir Deadlock:**

A prevenção de deadlock envolve quebrar uma ou mais das quatro condições de Coffman. As estratégias mais comuns são:

1. **Quebrar a Espera Circular (Circular Wait):** Esta é a estratégia mais prática e comum.
    - **Ordem de Aquisição de Locks:** Defina uma ordem global fixa para a aquisição de locks. Se todas as threads tentarem adquirir os locks na mesma ordem, a espera circular é eliminada.
        - No exemplo acima, se ambas as threads tentassem adquirir `lock1` e depois `lock2`, o deadlock não ocorreria.
    - **Timeout para Locks:** Use `tryLock()` com um timeout (`Lock.tryLock(long timeout, TimeUnit unit)`) em vez de `lock()`. Se o lock não puder ser adquirido dentro do tempo limite, a thread pode liberar os locks que já possui e tentar novamente, quebrando a condição de posse e espera.
2. **Quebrar Posse e Espera (Hold and Wait):**
    - Adquirir todos os recursos necessários de uma vez. Se uma thread não puder adquirir todos os recursos, ela libera os que já possui e tenta novamente mais tarde. Isso pode levar a "starvation" (uma thread nunca consegue adquirir todos os recursos), mas impede o deadlock.
3. **Quebrar Não Preempção (No Preemption):**
    - Permitir que recursos sejam preempcionados (tomados à força). Isso é complexo de implementar e raramente usado em linguagens como Java para locks gerais, mas é comum em sistemas operacionais.
4. **Quebrar Exclusão Mútua (Mutual Exclusion):**
    - Se um recurso não precisar de exclusão mútua (por exemplo, pode ser acessado por várias threads de forma segura), a condição é eliminada. Isso é alcançado usando estruturas de dados thread-safe ou algoritmos sem bloqueio (lock-free).

**Detecção e Recuperação de Deadlock:**

- **Ferramentas de Monitoramento:** JVMs modernas e ferramentas de monitoramento (como JConsole, VisualVM, ou APM's como New Relic/Dynatrace) podem detectar deadlocks analisando os dumps de thread. Quando um deadlock é detectado, as ferramentas podem mostrar quais threads estão envolvidas e quais locks estão segurando/esperando.
- **Recuperação:** Geralmente envolve abortar uma das threads envolvidas no deadlock, o que permite que as outras progridam. No entanto, abortar threads de forma arbitrária pode levar a estados inconsistentes da aplicação. A prevenção é sempre a melhor abordagem.

### 4. Exemplos de Código Otimizados

### Exemplo 1: Correção de Race Condition usando `AtomicInteger`

Este é o método mais eficiente e idiomático para incrementar um contador compartilhado.

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

public class AtomicCounterExample {
    private static AtomicInteger counter = new AtomicInteger(0);
    private static final int NUM_THREADS = 100;
    private static final int INCREMENTS_PER_THREAD = 1000;

    public static void main(String[] args) throws InterruptedException {
        Runnable incrementTask = () -> {
            for (int i = 0; i < INCREMENTS_PER_THREAD; i++) {
                counter.incrementAndGet(); // Operação atômica e thread-safe
            }
        };

        Thread[] threads = new Thread[NUM_THREADS];
        for (int i = 0; i < NUM_THREADS; i++) {
            threads[i] = new Thread(incrementTask);
            threads[i].start();
        }

        for (int i = 0; i < NUM_THREADS; i++) {
            threads[i].join(); // Espera todas as threads terminarem
        }

        // O resultado será o esperado: NUM_THREADS * INCREMENTS_PER_THREAD
        System.out.println("Valor final do contador: " + counter.get()); // Esperado: 100 * 1000 = 100000
    }
}

```

### Exemplo 2: Prevenção de Deadlock com Ordem de Aquisição de Locks

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class NoDeadlockExample {

    private static final Lock lockA = new ReentrantLock();
    private static final Lock lockB = new ReentrantLock();

    public static void main(String[] args) {
        // Cenário 1: Ordem consistente (Lock A, depois Lock B)
        new Thread(() -> transferirFundos(new Conta(1, 1000), new Conta(2, 500), 100)).start();
        // Cenário 2: Ordem consistente (Lock A, depois Lock B)
        new Thread(() -> transferirFundos(new Conta(2, 500), new Conta(1, 1000), 50)).start();
    }

    static class Conta {
        int id;
        double saldo;
        Lock lock = new ReentrantLock(); // Lock por conta

        public Conta(int id, double saldo) {
            this.id = id;
            this.saldo = saldo;
        }

        public void sacar(double valor) {
            this.saldo -= valor;
        }

        public void depositar(double valor) {
            this.saldo += valor;
        }
    }

    public static void transferirFundos(Conta origem, Conta destino, double quantia) {
        // Garante uma ordem de aquisição de locks baseada no ID da conta
        Lock primeiroLock = origem.id < destino.id ? origem.lock : destino.lock;
        Lock segundoLock = origem.id < destino.id ? destino.lock : origem.lock;

        try {
            // Tenta adquirir o primeiro lock
            if (primeiroLock.tryLock(10, TimeUnit.SECONDS)) { // Timeout para evitar bloqueio eterno
                try {
                    // Tenta adquirir o segundo lock
                    if (segundoLock.tryLock(10, TimeUnit.SECONDS)) {
                        try {
                            if (origem.saldo >= quantia) {
                                origem.sacar(quantia);
                                destino.depositar(quantia);
                                System.out.println("Transferência de " + quantia + " da Conta " + origem.id + " para Conta " + destino.id + " realizada com sucesso.");
                            } else {
                                System.out.println("Saldo insuficiente na Conta " + origem.id);
                            }
                        } finally {
                            segundoLock.unlock(); // Libera o segundo lock
                        }
                    } else {
                        System.out.println("Não foi possível adquirir o segundo lock. Tentando novamente.");
                        // Aqui você poderia implementar uma lógica de re-tentativa ou falha
                    }
                } finally {
                    primeiroLock.unlock(); // Libera o primeiro lock
                }
            } else {
                System.out.println("Não foi possível adquirir o primeiro lock. Tentando novamente.");
            }
        } catch (InterruptedException e) {
            System.err.println("Transferência interrompida: " + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}

```

Neste exemplo de transferência bancária, a ordem de aquisição dos locks nas contas (`origem.lock` e `destino.lock`) é determinada pelo ID da conta. A conta com o ID menor sempre tenta adquirir seu lock primeiro. Isso garante uma ordem global de aquisição de locks, prevenindo o deadlock. Além disso, o uso de `tryLock` com timeout adiciona robustez, permitindo que a operação falhe ou tente novamente em vez de ficar bloqueada indefinidamente.

### 5. Informações Adicionais

- **Liveness vs. Safety:**
    - **Safety (Segurança):** Refere-se à correção dos resultados. Uma aplicação thread-safe garante que os resultados estejam sempre corretos, independentemente da ordem de execução das threads. Race Conditions violam a segurança.
    - **Liveness (Vivacidade):** Refere-se à capacidade da aplicação de progredir. Deadlocks violam a vivacidade, pois impedem que as threads progridam. Outros problemas de vivacidade incluem *starvation* (uma thread nunca consegue acesso a um recurso) e *livelock* (threads ficam respondendo a outras, mas sem fazer progresso real).
- **Considerações de Performance:**
    - A sincronização (locks) adiciona overhead. O uso excessivo ou em áreas de código não críticas pode degradar a performance.
    - As classes atômicas (`AtomicInteger`, etc.) geralmente oferecem melhor desempenho do que `synchronized` ou `ReentrantLock` para operações de uma única variável, pois utilizam operações de baixo nível otimizadas (CAS - Compare-And-Swap) que evitam a sobrecarga de bloqueio de threads quando possível.
    - Usar coleções concorrentes (`ConcurrentHashMap`, `CopyOnWriteArrayList`) é preferível a sincronizar coleções não thread-safe (como `ArrayList` ou `HashMap`) manualmente, pois as coleções concorrentes são projetadas para serem eficientes em ambientes multithreaded.
- **Ferramentas de Análise de Concorrência:**
    - **Thread Dumps:** Uma ferramenta essencial. Um thread dump (obtido via `jstack <PID>` ou `jvisualvm`) mostra o estado de todas as threads JVM, incluindo quais locks elas estão segurando e quais estão esperando, sendo fundamental para diagnosticar deadlocks.
    - **Ferramentas de Profiling:** VisualVM, JProfiler, YourKit são exemplos de ferramentas que podem ajudar a identificar contenção de locks e outros problemas de concorrência visualmente, facilitando a otimização.

### 6. Referências para Estudo Independente

Para você, Gedê, que está se aprofundando e pensando em Go, entender a fundo esses conceitos em Java vai te dar uma base sólida para a concorrência em qualquer linguagem.

- **Documentação Oficial da Oracle:**
    - The Java™ Tutorials - Concurrency: [https://docs.oracle.com/javase/tutorial/essential/concurrency/](https://docs.oracle.com/javase/tutorial/essential/concurrency/) (Este é um excelente ponto de partida).
    - `java.util.concurrent` Package: [https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/package-summary.html)
    - `java.util.concurrent.atomic` Package: [https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
- **Livros Essenciais:**
    - **"Java Concurrency in Practice"** por Brian Goetz et al.: Este é o livro definitivo sobre concorrência em Java. Embora um pouco mais antigo, os princípios fundamentais são atemporais e extremamente relevantes.
    - **"Effective Java"** por Joshua Bloch: Contém itens valiosos sobre concorrência e thread safety.
- **Artigos e Tutoriais:**
    - **Baeldung - Java Concurrency:** O site Baeldung tem uma vasta coleção de artigos sobre concorrência em Java, com muitos exemplos práticos. Recomendo pesquisar por "Java Race Condition Baeldung" ou "Java Deadlock Baeldung".
    - **Medium e blogs especializados:** Procure por artigos que abordem cenários específicos e estudos de caso de deadlock e race condition em sistemas reais.
- **Plataformas de Cursos Online:**
    - Udemy, Alura, Coursera: Muitos cursos de Java avançado e Spring cobrem concorrência em detalhes.

Lembre-se, Gedê, a concorrência é um tema complexo, e a experiência prática é a melhor forma de solidificar o conhecimento. Tente reproduzir esses problemas e suas soluções em seus próprios projetos para fixar os conceitos.