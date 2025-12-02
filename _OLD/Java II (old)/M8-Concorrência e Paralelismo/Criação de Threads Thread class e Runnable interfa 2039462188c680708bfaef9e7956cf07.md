# Criação de Threads: Thread class e Runnable interface

Ótimo, Gedê! Vamos mergulhar na criação de Threads em Java, um tópico super relevante para quem, como você, trabalha com Backend e busca otimizar o desempenho de aplicações.

## Criação de Threads: `Thread` class e `Runnable` interface em Java

### 1. Introdução

No desenvolvimento de aplicações modernas, especialmente em sistemas backend, a capacidade de executar múltiplas tarefas simultaneamente é essencial para garantir responsividade, eficiência e escalabilidade. Em Java, essa capacidade é alcançada através do conceito de concorrência, e as **Threads** são a unidade fundamental de execução concorrente.

A criação e gerenciamento de Threads é um pilar da programação concorrente em Java. Compreender como criar Threads, seja estendendo a classe `Thread` ou implementando a interface `Runnable`, é crucial para desenvolver aplicações robustas que podem realizar operações demoradas (como processamento de dados, chamadas a APIs externas ou operações de I/O) sem bloquear a thread principal da aplicação, garantindo uma melhor experiência para o usuário e otimizando o uso de recursos.

- **Tema Principal:** Criação de Threads em Java.
- **Subtemas:**
    - **`Thread` class:** A classe fundamental para representar e controlar uma thread de execução.
    - **`Runnable` interface:** Uma interface que define uma tarefa que pode ser executada por uma thread.

Ambos servem como mecanismos para definir e iniciar uma nova thread de execução, permitindo que partes do seu código sejam executadas de forma paralela ao fluxo principal da aplicação.

### 2. Sumário

- **Introdução à Concorrência e Threads**
    - O que são Threads e por que são importantes?
- **Métodos de Criação de Threads em Java**
    - Estendendo a classe `Thread`
    - Implementando a interface `Runnable`
- **Anatomia da Classe `Thread`**
    - Construtores
    - Métodos importantes (`start()`, `run()`, `join()`, `sleep()`, `interrupt()`, `isAlive()`, `currentThread()`, `setName()`, `getName()`)
- **Anatomia da Interface `Runnable`**
    - Método `run()`
- **Escolhendo entre `Thread` e `Runnable`**
    - Vantagens e desvantagens
- **Exemplos de Código Otimizados**
    - Exemplo básico com `Thread`
    - Exemplo básico com `Runnable`
    - Usando `Runnable` com Expressões Lambda
    - A importância do método `join()`
- **Informações Adicionais**
    - Ciclo de Vida de uma Thread
    - Riscos da Concorrência (Introdução)
    - Threads Daemon
- **Referências para Estudo Independente**

### 3. Conteúdo Detalhado

### Introdução à Concorrência e Threads

Uma **thread** é a menor unidade de processamento que pode ser agendada por um sistema operacional. Em um programa Java, a execução começa com uma única thread principal (a que executa o método `main`). A programação multi-threading permite que sua aplicação execute múltiplas partes de código simultaneamente, aumentando a responsividade e a eficiência em sistemas multi-core.

### Métodos de Criação de Threads em Java

Existem duas maneiras principais de criar threads em Java:

1. **Estendendo a classe `Thread`:**
    - Você cria uma nova classe que estende `java.lang.Thread`.
    - Você sobrescreve o método `public void run()`, que conterá o código a ser executado pela nova thread.
    - Para iniciar a thread, você cria uma instância da sua classe e chama o método `start()`.
2. **Implementando a interface `Runnable`:**
    - Você cria uma nova classe que implementa a interface `java.lang.Runnable`.
    - Você implementa o método `public void run()` (o único método da interface), que conterá o código a ser executado pela nova thread.
    - Você cria uma instância da sua classe `Runnable`, passa-a como argumento para o construtor de um objeto `Thread`, e então chama o método `start()` na instância da `Thread`.

### Anatomia da Classe `Thread`

A classe `java.lang.Thread` é a representação de uma thread de execução.

- **Construtores Comuns:**
    - `Thread()`: Constrói uma nova `Thread` sem um destino `Runnable`.
    - `Thread(Runnable target)`: Constrói uma nova `Thread` cujo método `run()` invocará o método `run()` do objeto `Runnable` fornecido.
    - `Thread(String name)`: Constrói uma nova `Thread` com o nome especificado.
    - `Thread(Runnable target, String name)`: Constrói uma nova `Thread` com um destino `Runnable` e um nome especificado.
- **Métodos Importantes:**
    - `void start()`: **Inicia a execução da thread.** O JVM chama o método `run()` dessa thread. **É crucial chamar `start()` e não `run()` diretamente.** Chamar `run()` executa o código no mesmo thread que fez a chamada, sem criar uma nova thread.
    - `void run()`: Contém o código a ser executado pela thread. Se você estende `Thread`, você sobrescreve este método. Se você implementa `Runnable`, você implementa este método.
    - `void join()`: Espera que esta thread termine sua execução. A thread que chama `join()` ficará bloqueada até que a thread em questão morra. Sobrecargas permitem um tempo limite (`join(long millis)`).
    - `static void sleep(long millis)`: Faz com que a thread atualmente em execução pause por um período de tempo especificado (em milissegundos). Lança `InterruptedException`.
    - `void interrupt()`: Interrompe esta thread. Define o *status de interrupção* da thread. Não para a thread imediatamente, mas permite que ela responda à interrupção (por exemplo, saindo de um estado de espera como `sleep()` ou `join()`).
    - `boolean isAlive()`: Testa se esta thread está viva. Uma thread está "viva" se foi iniciada e ainda não terminou sua execução.
    - `static Thread currentThread()`: Retorna uma referência ao objeto `Thread` atualmente em execução.
    - `void setName(String name)`: Define o nome desta thread.
    - `String getName()`: Retorna o nome desta thread.
    - `int getPriority()` / `void setPriority(int newPriority)`: Obtém/define a prioridade da thread. As prioridades são um indicativo para o agendador e não garantem um comportamento específico, pois a execução final depende do sistema operacional.

### Anatomia da Interface `Runnable`

A interface `java.lang.Runnable` é uma interface funcional (com um único método abstrato) que permite encapsular uma tarefa a ser executada por uma thread.

- **Método `void run()`:**
    - Contém o código que será executado quando a thread iniciar.
    - Ao implementar `Runnable`, você coloca toda a lógica da sua tarefa dentro deste método.

### Escolhendo entre `Thread` e `Runnable`

Ambas as abordagens alcançam o mesmo objetivo de criar uma nova thread de execução, mas a implementação de `Runnable` é geralmente a **abordagem preferida** em Java.

- **Vantagens de Implementar `Runnable`:**
    - **Reuso de Código:** Sua classe pode estender outra classe e, ao mesmo tempo, implementar `Runnable`. Java não suporta herança múltipla, então se você estender `Thread`, não poderá estender nenhuma outra classe.
    - **Separação de Preocupações:** A lógica da tarefa (o que a thread vai fazer) é separada da lógica de controle da thread. A classe `Thread` representa a thread em si, enquanto `Runnable` representa a *tarefa* que a thread vai executar. Isso promove um design mais limpo e modular.
    - **Flexibilidade para Thread Pools:** A interface `Runnable` é fundamental para o uso de *thread pools* (como `ExecutorService`), que são a maneira recomendada de gerenciar threads em aplicações de grande porte para evitar a sobrecarga de criar muitas threads novas.
- **Desvantagens de Estender `Thread`:**
    - Limita a herança (não pode estender outra classe).
    - Acopla a tarefa diretamente à thread, o que pode não ser o ideal em termos de design.
- **Quando usar `Thread` diretamente (raramente):**
    - Quando você precisa estender ou modificar o comportamento da própria classe `Thread` (o que é incomum para a maioria das aplicações).

### 4. Exemplos de Código Otimizados

### Exemplo Básico com `Thread` (Desencorajado para a maioria dos casos)

```java
// 1. Cria uma classe que estende Thread
class MinhaThreadPorExtensao extends Thread {
    private String nome;

    public MinhaThreadPorExtensao(String nome) {
        this.nome = nome;
        // Opcional: Definir nome da thread ao construir
        // super(nome);
    }

    @Override
    public void run() {
        // Código a ser executado pela thread
        for (int i = 0; i < 5; i++) {
            System.out.println(nome + ": Contagem " + i);
            try {
                Thread.sleep(100); // Pausa a execução por 100 milissegundos
            } catch (InterruptedException e) {
                System.out.println(nome + ": Interrompida!");
                Thread.currentThread().interrupt(); // Restaura o status de interrupção
            }
        }
        System.out.println(nome + ": Finalizada.");
    }
}

public class ExemploThreadExtensao {
    public static void main(String[] args) {
        System.out.println("Main Thread: Iniciando threads...");

        // 2. Cria instâncias da sua classe Thread
        MinhaThreadPorExtensao thread1 = new MinhaThreadPorExtensao("Thread-1");
        MinhaThreadPorExtensao thread2 = new MinhaThreadPorExtensao("Thread-2");

        // 3. Inicia as threads (chama o método run() em uma nova thread)
        thread1.start();
        thread2.start();

        System.out.println("Main Thread: Threads iniciadas. Continuando...");
    }
}

```

**Caso de Uso:** Em um cenário real, estender `Thread` é menos comum. Talvez em uma biblioteca muito específica que precise alterar o comportamento fundamental de uma thread, mas raramente em uma aplicação backend típica.

### Exemplo Básico com `Runnable` (Abordagem Preferida)

```java
// 1. Cria uma classe que implementa Runnable
class MinhaTarefaRunnable implements Runnable {
    private String nome;

    public MinhaTarefaRunnable(String nome) {
        this.nome = nome;
    }

    @Override
    public void run() {
        // Código a ser executado pela thread
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + " (" + nome + "): Contagem " + i);
            try {
                Thread.sleep(150);
            } catch (InterruptedException e) {
                System.out.println(Thread.currentThread().getName() + " (" + nome + "): Interrompida!");
                Thread.currentThread().interrupt();
            }
        }
        System.out.println(Thread.currentThread().getName() + " (" + nome + "): Finalizada.");
    }
}

public class ExemploRunnableBasico {
    public static void main(String[] args) {
        System.out.println("Main Thread: Iniciando tarefas Runnable...");

        // 2. Cria instâncias da sua tarefa Runnable
        MinhaTarefaRunnable tarefa1 = new MinhaTarefaRunnable("Tarefa A");
        MinhaTarefaRunnable tarefa2 = new MinhaTarefaRunnable("Tarefa B");

        // 3. Cria instâncias de Thread e passa as tarefas Runnable
        Thread threadA = new Thread(tarefa1, "Worker-Thread-A"); // Define nome da thread
        Thread threadB = new Thread(tarefa2, "Worker-Thread-B");

        // 4. Inicia as threads
        threadA.start();
        threadB.start();

        System.out.println("Main Thread: Tarefas Runnable iniciadas. Continuo livre...");
    }
}

```

**Caso de Uso:** Em um backend, imagine que você tem um serviço que precisa enviar notificações por e-mail para 1000 usuários após uma ação. Em vez de bloquear a thread da requisição HTTP para enviar todos os e-mails sequencialmente, você poderia criar uma tarefa `Runnable` para cada grupo de e-mails e executá-las em threads separadas (ou, melhor ainda, com um `ExecutorService` para gerenciar as threads), liberando a thread da requisição rapidamente.

### Usando `Runnable` com Expressões Lambda (Java 8+)

Para tarefas simples, as expressões lambda tornam o código muito mais conciso.

```java
public class ExemploRunnableLambda {
    public static void main(String[] args) {
        System.out.println("Main Thread: Iniciando tarefas com Lambda...");

        // Usando Runnable com expressão lambda
        // O método run() é implementado diretamente na lambda
        Runnable tarefaLambda1 = () -> {
            for (int i = 0; i < 3; i++) {
                System.out.println(Thread.currentThread().getName() + ": Processando item " + i);
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    System.out.println(Thread.currentThread().getName() + ": Interrompida!");
                    Thread.currentThread().interrupt();
                }
            }
            System.out.println(Thread.currentThread().getName() + ": Tarefa Lambda 1 Finalizada.");
        };

        Thread threadLambda1 = new Thread(tarefaLambda1, "Lambda-Worker-1");
        threadLambda1.start();

        // Outra forma mais direta de criar e iniciar a thread com lambda
        new Thread(() -> {
            for (int i = 0; i < 3; i++) {
                System.out.println(Thread.currentThread().getName() + ": Fazendo algo " + i);
                try {
                    Thread.sleep(250);
                } catch (InterruptedException e) {
                    System.out.println(Thread.currentThread().getName() + ": Interrompida!");
                    Thread.currentThread().interrupt();
                }
            }
            System.out.println(Thread.currentThread().getName() + ": Tarefa Lambda 2 Finalizada.");
        }, "Lambda-Worker-2").start();

        System.out.println("Main Thread: Todas as lambdas iniciadas.");
    }
}

```

**Caso de Uso:** Ideal para tarefas rápidas e isoladas que não precisam de uma classe completa, como logging assíncrono, processamento de mensagens de uma fila em segundo plano ou pequenas atualizações de estado.

### A Importância do Método `join()`

```java
public class ExemploThreadJoin {
    public static void main(String[] args) {
        System.out.println("Main Thread: Iniciando tarefa demorada...");

        Runnable tarefaDemorada = () -> {
            try {
                System.out.println(Thread.currentThread().getName() + ": Começando a processar dados complexos...");
                Thread.sleep(3000); // Simula um processamento demorado
                System.out.println(Thread.currentThread().getName() + ": Processamento de dados complexos concluído.");
            } catch (InterruptedException e) {
                System.out.println(Thread.currentThread().getName() + ": Interrompido durante o processamento!");
                Thread.currentThread().interrupt();
            }
        };

        Thread workerThread = new Thread(tarefaDemorada, "DataProcessor-Thread");
        workerThread.start(); // Inicia a thread em segundo plano

        System.out.println("Main Thread: Tarefa demorada iniciada. Fazendo outras coisas enquanto espero...");

        try {
            // A thread principal espera que a workerThread termine
            workerThread.join();
            System.out.println("Main Thread: A workerThread terminou! Posso continuar com resultados.");
        } catch (InterruptedException e) {
            System.out.println("Main Thread: Fui interrompida enquanto esperava!");
            Thread.currentThread().interrupt();
        }

        System.out.println("Main Thread: Execução principal finalizada.");
    }
}

```

**Caso de Uso:** Imagine que sua API backend recebe uma requisição e precisa realizar três operações demoradas que podem ser feitas em paralelo. Você inicia uma thread para cada operação, e então usa `join()` na thread principal da requisição para esperar que todas as três operações terminem antes de consolidar os resultados e enviar a resposta. Isso evita que a thread principal da requisição seja bloqueada por cada operação individualmente.

### 5. Informações Adicionais

### Ciclo de Vida de uma Thread

Uma thread em Java passa por diferentes estados durante sua vida útil:

- **NEW (Nova):** A thread foi criada, mas ainda não foi iniciada (`new Thread()`).
- **RUNNABLE (Executável):** A thread está pronta para ser executada e pode estar sendo executada ou esperando por recursos do processador. Entra nesse estado após `start()`.
- **BLOCKED (Bloqueada):** A thread está esperando para adquirir um *lock* de monitor para acessar um bloco ou método `synchronized`.
- **WAITING (Esperando):** A thread está esperando indefinidamente por outra thread para executar uma ação específica (e.g., chamadas a `Object.wait()`, `Thread.join()`, `LockSupport.park()`).
- **TIMED_WAITING (Esperando com Tempo):** A thread está esperando por outra thread para executar uma ação específica por um período de tempo determinado (e.g., chamadas a `Thread.sleep(long)`, `Object.wait(long)`, `Thread.join(long)`, `LockSupport.parkNanos(long)`, `LockSupport.parkUntil(long)`).
- **TERMINATED (Terminada):** A thread concluiu sua execução ou encerrou por alguma exceção.

### Riscos da Concorrência (Introdução)

Embora threads sejam poderosas, elas introduzem complexidade e potenciais problemas:

- **Race Conditions:** Ocorre quando múltiplas threads acessam e modificam dados compartilhados sem sincronização adequada, levando a resultados imprevisíveis.
- **Deadlock:** Duas ou mais threads ficam presas em um estado de espera mútua, cada uma esperando por um recurso que a outra possui.
- **Starvation:** Uma thread específica é consistentemente privada de acesso a recursos ou tempo de CPU, enquanto outras threads são sempre priorizadas.
- **Livelock:** Threads continuam tentando executar uma ação, mas repetidamente falham devido a uma interação complexa, gastando CPU sem progredir.

Esses problemas serão abordados em módulos futuros (Sincronização, `java.util.concurrent`), Gedê. Por enquanto, é importante saber que eles existem e exigem atenção.

### Threads Daemon

Threads podem ser *User Threads* (padrão) ou *Daemon Threads*. Uma aplicação Java continua sendo executada enquanto houver *User Threads* ativas. Se todas as *User Threads* terminarem, o JVM é encerrado, mesmo que *Daemon Threads* ainda estejam em execução.

- `thread.setDaemon(true);`: Deve ser chamado antes de `start()`.
- **Uso:** Threads de suporte em segundo plano (e.g., coletor de lixo, verificadores de saúde de sistemas) que não precisam manter a JVM viva.

### 6. Referências para Estudo Independente

- **Documentação Oficial da Oracle:**
    - `Thread` class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html)
    - `Runnable` interface: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Runnable.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Runnable.html)
- **Tutorial de Concorrência da Oracle (altamente recomendado):**
    - Lessons: Concurrency: [https://docs.oracle.com/javase/tutorial/essential/concurrency/](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- **Livros:**
    - "Java Concurrency in Practice" de Brian Goetz et al. (Considerado a bíblia da concorrência em Java).
    - "Effective Java" de Joshua Bloch (Capítulos sobre concorrência).
- **Artigos e Blogs:**
    - Busque por "Java Threads vs Runnable", "Java Thread Life Cycle" em blogs de desenvolvedores renomados como Baeldung, GeeksforGeeks, etc.

Espero que esta explicação detalhada sobre a criação de Threads em Java seja muito útil para você, Gedê! Me diga qual o próximo tópico que você quer que a A.R.I.A. explique!