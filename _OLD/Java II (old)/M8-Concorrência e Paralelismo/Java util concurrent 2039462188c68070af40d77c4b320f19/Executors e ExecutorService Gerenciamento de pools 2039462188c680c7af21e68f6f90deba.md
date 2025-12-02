# Executors e ExecutorService: Gerenciamento de pools de threads

Excelente escolha, Gedê\! O gerenciamento de threads é um pilar da programação concorrente e fundamental para aplicações backend de alta performance. Vamos aprofundar em `Executors` e `ExecutorService`.

---

## Executors e ExecutorService: Gerenciamento de Pools de Threads em Java

### 1\. Introdução

No desenvolvimento de aplicações backend em Java, a capacidade de lidar com múltiplas tarefas simultaneamente é crucial para garantir a responsividade e a escalabilidade. A programação concorrente, que envolve a execução de várias partes de um programa ao mesmo tempo, é a chave para alcançar isso. No entanto, gerenciar threads diretamente (criando `Thread` objetos para cada tarefa) pode ser complexo, ineficiente e propenso a erros, levando a problemas como sobrecarga de recursos do sistema e `OutOfMemoryError`.

É nesse cenário que entram os conceitos de **`Executors`** e **`ExecutorService`**. Eles fazem parte do pacote `java.util.concurrent`, introduzido no Java 5, e revolucionaram a forma como a concorrência é gerenciada em Java.

**`Executors`** é uma classe utilitária que fornece métodos de fábrica para criar diferentes tipos de `ExecutorService`. Pense nela como um "gerador" de pools de threads prontos para uso.

**`ExecutorService`** é uma interface que estende a interface `Executor` (uma interface mais básica com apenas um método `execute(Runnable)`) e representa um serviço que executa tarefas submetidas. Em essência, um `ExecutorService` gerencia um **pool de threads**, que é um conjunto de threads reutilizáveis. Em vez de criar uma nova thread para cada tarefa, você submete a tarefa ao `ExecutorService`, e uma thread disponível do pool a executará. Quando a tarefa termina, a thread não é destruída, mas retorna ao pool, pronta para executar outra tarefa. Isso otimiza o uso de recursos, reduz a sobrecarga de criação/destruição de threads e permite um controle mais fino sobre a concorrência.

A relevância e importância desses conceitos são imensas no contexto de desenvolvimento backend:

- **Eficiência de Recursos:** Reutilização de threads minimiza a sobrecarga de criação e destruição.
- **Controle de Concorrência:** Permite limitar o número de threads ativas, evitando sobrecarga do sistema.
- **Gerenciamento de Ciclo de Vida:** Facilita o controle sobre o início, execução e encerramento de threads.
- **Separação de Preocupações:** Desacopla a submissão da tarefa de sua execução.
- **Melhoria de Desempenho:** Aplicações podem processar múltiplas requisições ou tarefas em paralelo, resultando em maior throughput e menor latência.

Para um desenvolvedor backend, especialmente você, Gedê, que busca uma vaga em Go, entender esses conceitos é crucial porque o gerenciamento de goroutines (em Go) e threads (em Java) é fundamental para construir sistemas escaláveis e responsivos. O `ExecutorService` em Java é o equivalente mais próximo dos *goroutines* e *channels* de Go no que diz respeito ao gerenciamento de tarefas concorrentes de forma eficiente.

### 2\. Sumário

- **Fundamentos da Concorrência e Gerenciamento de Threads**
- **A Interface `Executor`**
- **A Interface `ExecutorService`**
    - Métodos de Submissão de Tarefas
    - Métodos de Gerenciamento do Ciclo de Vida
- **A Classe Utilitária `Executors`**
    - `newFixedThreadPool()`
    - `newCachedThreadPool()`
    - `newSingleThreadExecutor()`
    - `newScheduledThreadPool()`
- **Classes de Implementação de `ExecutorService`**
    - `ThreadPoolExecutor`
    - `ScheduledThreadPoolExecutor`
- **`Callable` e `Future`**
- **Restrições de Uso e Boas Práticas**
- **Exemplos de Código Otimizados**
    - `FixedThreadPool` para processamento paralelo
    - `CachedThreadPool` para tarefas esporádicas
    - `SingleThreadExecutor` para execução sequencial
    - `ScheduledThreadPoolExecutor` para tarefas agendadas
    - Usando `Callable` e `Future`
- **Informações Adicionais**
    - Shutting Down Gracefully
    - Customizando `ThreadPoolExecutor`
    - Considerações de Performance
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Fundamentos da Concorrência e Gerenciamento de Threads

Antes de mergulharmos nos `Executors` e `ExecutorService`, é importante lembrar por que eles são necessários.
Tradicionalmente, a concorrência em Java era feita criando e iniciando objetos `Thread` diretamente:

```java
// Criando e iniciando threads manualmente
public class MyRunnable implements Runnable {
    private String taskName;

    public MyRunnable(String taskName) {
        this.taskName = taskName;
    }

    @Override
    public void run() {
        System.out.println("Executando tarefa: " + taskName + " na thread: " + Thread.currentThread().getName());
        try {
            Thread.sleep(1000); // Simula trabalho
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Tarefa interrompida: " + taskName);
        }
        System.out.println("Tarefa finalizada: " + taskName);
    }

    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            Thread thread = new Thread(new MyRunnable("Tarefa " + (i + 1)));
            thread.start();
        }
    }
}

```

Embora funcional para um pequeno número de tarefas, essa abordagem tem desvantagens:

- **Criação de Thread é Cara:** Criar uma nova thread para cada tarefa é um processo que consome tempo e recursos (memória).
- **Gerenciamento de Recursos:** Não há controle sobre o número de threads. Um grande número de threads pode esgotar os recursos do sistema.
- **Ciclo de Vida Complexo:** O gerenciamento do ciclo de vida das threads (iniciar, parar, lidar com interrupções) é manual e propenso a erros.
- **Dificuldade em Coletar Resultados:** Não há um mecanismo direto para obter o resultado de uma tarefa executada em uma thread separada.

Os `Executors` e `ExecutorService` resolvem esses problemas introduzindo o conceito de *pool de threads* e um modelo de execução de tarefas mais flexível.

### A Interface `Executor`

A interface `Executor` é a base de toda a API de `Executors`. É uma interface funcional (pode ser usada com expressões lambda) com um único método:

```java
public interface Executor {
    void execute(Runnable command);
}

```

- **`void execute(Runnable command)`:** Este método aceita uma tarefa do tipo `Runnable` e a executa em algum momento no futuro. O `Executor` decide como e quando a tarefa será executada (em uma nova thread, em uma thread existente do pool, etc.). Ele desacopla a submissão da tarefa da sua execução.

A interface `Executor` é a mais simples e não oferece controle sobre o ciclo de vida do executor nem a capacidade de obter resultados de tarefas.

### A Interface `ExecutorService`

`ExecutorService` estende `Executor` e adiciona funcionalidades para gerenciar o ciclo de vida do serviço e obter resultados de tarefas. É a interface mais comumente usada para gerenciamento de pools de threads.

```java
public interface ExecutorService extends Executor {
    // Métodos de submissão de tarefas
    Future<?> submit(Runnable task);
    <T> Future<T> submit(Runnable task, T result);
    <T> Future<T> submit(Callable<T> task);

    // Métodos de gerenciamento do ciclo de vida
    void shutdown();
    List<Runnable> shutdownNow();
    boolean isShutdown();
    boolean isTerminated();
    boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException;

    // Métodos para execução de coleções de tarefas
    <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks) throws InterruptedException;
    <T> T invokeAny(Collection<? extends Callable<T>> tasks) throws InterruptedException, ExecutionException;
}

```

### Métodos de Submissão de Tarefas:

- `Future<?> submit(Runnable task)`: Submete uma tarefa `Runnable` para execução. Retorna um objeto `Future` que pode ser usado para verificar o status da tarefa ou esperar por sua conclusão. O `Future` para um `Runnable` sempre retorna `null` ao chamar `get()`.
- `<T> Future<T> submit(Runnable task, T result)`: Semelhante ao anterior, mas permite especificar um resultado que será retornado pelo `Future` quando a tarefa `Runnable` for concluída.
- `<T> Future<T> submit(Callable<T> task)`: Submete uma tarefa `Callable` (que pode retornar um resultado e lançar exceções) para execução. Retorna um `Future` que pode ser usado para obter o resultado da tarefa ou capturar exceção. **Este é o método mais comum para tarefas que retornam valores.**

### Métodos de Gerenciamento do Ciclo de Vida:

- `void shutdown()`: Inicia um desligamento ordenado. Tarefas previamente submetidas serão executadas, mas nenhuma nova tarefa será aceita. Não espera que as tarefas em execução terminem.
- `List<Runnable> shutdownNow()`: Tenta parar todas as tarefas em execução, interrompe as tarefas em espera e retorna uma lista das tarefas que estavam aguardando execução. Este método é mais agressivo e não garante que todas as threads serão paradas imediatamente.
- `boolean isShutdown()`: Retorna `true` se este executor foi desligado (seja por `shutdown()` ou `shutdownNow()`).
- `boolean isTerminated()`: Retorna `true` se todas as tarefas tiverem sido concluídas após o desligamento do executor. Este método é geralmente chamado após `shutdown()` para verificar se o desligamento ordenado foi completado.
- `boolean awaitTermination(long timeout, TimeUnit unit) throws InterruptedException`: Bloqueia até que todas as tarefas tenham sido concluídas após uma solicitação de desligamento, ou o tempo limite expire, ou a thread atual seja interrompida. Retorna `true` se o executor for encerrado e `false` se o tempo limite expirar. **Crucial para esperar que todas as tarefas terminem antes que a aplicação seja encerrada.**

### A Classe Utilitária `Executors`

A classe `Executors` é a principal forma de criar instâncias de `ExecutorService`. Ela oferece métodos estáticos de fábrica para diferentes configurações de pools de threads, cobrindo a maioria dos casos de uso.

- `static ExecutorService newFixedThreadPool(int nThreads)`
    - **Função:** Cria um pool de threads que reutiliza um número fixo de threads. Se novas tarefas chegarem e todas as threads estiverem ocupadas, as tarefas serão colocadas em uma fila (fila ilimitada).
    - **Quando usar:** Quando você tem um número previsível de tarefas e deseja limitar a concorrência para evitar sobrecarga. Ideal para servidores que lidam com um número limitado de requisições concorrentes.
- `static ExecutorService newCachedThreadPool()`
    - **Função:** Cria um pool de threads que cria novas threads conforme necessário, mas reutilizará threads previamente construídas quando elas estiverem disponíveis. Se uma thread estiver ociosa por 60 segundos, ela será terminada e removida do cache. O tamanho do pool pode crescer ilimitadamente.
    - **Quando usar:** Para aplicativos que executam muitas tarefas de curta duração. É eficiente porque threads ociosas são removidas, mas pode levar a muitos threads se houver um pico de carga sem limites.
- `static ExecutorService newSingleThreadExecutor()`
    - **Função:** Cria um `ExecutorService` de thread única. As tarefas são garantidas para serem executadas sequencialmente, e não há mais de uma tarefa em execução a qualquer momento.
    - **Quando usar:** Quando a ordem das tarefas é importante (FIFO - First-In, First-Out) ou quando você precisa garantir que apenas uma tarefa específica esteja em execução a qualquer momento.
- `static ScheduledExecutorService newScheduledThreadPool(int corePoolSize)`
    - **Função:** Cria um pool de threads que pode agendar comandos para serem executados após um determinado atraso ou para serem executados periodicamente. Retorna uma interface `ScheduledExecutorService` (que estende `ExecutorService`).
    - **Quando usar:** Para tarefas que precisam ser executadas em intervalos regulares ou após um determinado tempo, como limpeza de cache, envio de e-mails agendados, etc.

### Classes de Implementação de `ExecutorService`

As classes de fábrica na classe `Executors` retornam instâncias de implementações internas de `ExecutorService`. As duas implementações mais importantes são:

- `ThreadPoolExecutor`
    - É a implementação flexível e configurável de `ExecutorService`. Os métodos de fábrica em `Executors` (`newFixedThreadPool`, `newCachedThreadPool`, etc.) internamente criam instâncias de `ThreadPoolExecutor` com diferentes configurações.
    - Você pode instanciá-lo diretamente para ter controle total sobre:
        - `corePoolSize`: O número de threads a serem mantidas no pool, mesmo que ociosas.
        - `maximumPoolSize`: O número máximo de threads que o pool pode ter.
        - `keepAliveTime`: O tempo máximo que threads em excesso (`> corePoolSize`) podem permanecer ociosas antes de serem terminadas.
        - `TimeUnit`: A unidade de tempo para `keepAliveTime`.
        - `BlockingQueue<Runnable> workQueue`: A fila a ser usada para manter as tarefas submetidas antes de serem executadas.
        - `ThreadFactory threadFactory`: Uma fábrica para criar novas threads.
        - `RejectedExecutionHandler handler`: Um manipulador para tarefas que não podem ser executadas (quando o pool e a fila estão cheios).
- `ScheduledThreadPoolExecutor`
    - Uma implementação de `ScheduledExecutorService` que pode agendar tarefas para serem executadas em um determinado atraso ou periodicamente.

### `Callable` e `Future`

Enquanto `Runnable` é usado para tarefas que não retornam um valor, `Callable` é a interface para tarefas que retornam um resultado e podem lançar uma exceção.

- `Callable<V>`: Uma interface que representa uma tarefa que retorna um resultado do tipo `V` e pode lançar uma exceção. Ela possui um único método: `V call() throws Exception;`.
- `Future<V>`: Uma interface que representa o resultado de uma computação assíncrona. Ela oferece métodos para:
    - `V get()`: Bloqueia até que a computação seja concluída e então recupera seu resultado. Pode lançar `InterruptedException` ou `ExecutionException`.
    - `V get(long timeout, TimeUnit unit)`: Bloqueia por um tempo limitado.
    - `boolean isDone()`: Retorna `true` se a tarefa foi concluída.
    - `boolean cancel(boolean mayInterruptIfRunning)`: Tenta cancelar a execução da tarefa.

### Restrições de Uso e Boas Práticas

- **Sempre Chame `shutdown()`:** É um erro comum esquecer de chamar `shutdown()` em um `ExecutorService`. Se você não fizer isso, o pool de threads continuará ativo, impedindo que o programa termine. Para aplicações de longa duração (como servidores), o `ExecutorService` pode ser configurado para ser encerrado quando o servidor for desligado. Para tarefas de curta duração, sempre chame `shutdown()`.
- **Use `try-finally` ou `try-with-resources` (com cuidado):** Para garantir o `shutdown()`, especialmente em programas curtos, o uso de `try-finally` ou `try-with-resources` com `ExecutorService` (se você estiver usando uma implementação que possa ser fechada, como `ThreadPoolExecutor` customizado ou um que implemente `AutoCloseable` no futuro) é recomendado.
- **Evite Pools Ilimitados (`newCachedThreadPool`) para Tarefas de Longa Duração:** Embora `newCachedThreadPool` seja ótimo para tarefas curtas e esporádicas, se suas tarefas demorarem muito ou houver um número massivo de requisições, ele pode criar threads ilimitadas, levando a `OutOfMemoryError`.
- **Monitore e Ajuste o Tamanho do Pool:** Para `FixedThreadPool` ou `ThreadPoolExecutor` customizado, o `corePoolSize` e `maximumPoolSize` devem ser ajustados com base nas características da sua aplicação (CPU-bound vs. I/O-bound) e nos recursos do servidor.
- **Lide com `ExecutionException`:** Ao usar `Future.get()`, esteja preparado para lidar com `ExecutionException`, que envolve as exceções lançadas pela tarefa `Callable` ou `Runnable`.
- **Cuidado com `isTerminated()` e `awaitTermination()`:** Use `isTerminated()` *depois* de chamar `shutdown()` para verificar o estado final. `awaitTermination()` é a maneira correta de esperar que as tarefas terminem antes de prosseguir com o desligamento da aplicação.

### 4\. Exemplos de Código Otimizados

### Exemplo 1: `FixedThreadPool` para Processamento Paralelo

Cenário de uso: Processar um grande número de itens que podem ser tratados de forma independente e simultânea, como redimensionar imagens ou processar mensagens de uma fila.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class FixedThreadPoolExample {

    // Simula uma tarefa que consome CPU ou tempo
    static class ImageProcessor implements Runnable {
        private String imageName;

        public ImageProcessor(String imageName) {
            this.imageName = imageName;
        }

        @Override
        public void run() {
            System.out.println("Processando imagem: " + imageName + " na thread: " + Thread.currentThread().getName());
            try {
                // Simula trabalho pesado, como redimensionar uma imagem
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // Restaura o status de interrupção
                System.err.println("Processamento de imagem " + imageName + " interrompido.");
            }
            System.out.println("Processamento de imagem: " + imageName + " concluído.");
        }
    }

    public static void main(String[] args) {
        // Cria um pool de threads com 3 threads fixas
        // Ideal para controlar o número de tarefas concorrentes que consomem recursos
        ExecutorService executor = Executors.newFixedThreadPool(3);

        System.out.println("Iniciando submissão de tarefas...");

        // Submete 10 tarefas ao pool
        for (int i = 1; i <= 10; i++) {
            executor.execute(new ImageProcessor("imagem_" + i + ".jpg"));
        }

        System.out.println("Todas as tarefas foram submetidas.");

        // Inicia o desligamento ordenado do executor
        executor.shutdown();

        try {
            // Espera até 60 segundos para que todas as tarefas sejam concluídas
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                System.err.println("Tempo limite excedido. Algumas tarefas podem não ter sido concluídas.");
                executor.shutdownNow(); // Tenta forçar o desligamento
            }
        } catch (InterruptedException e) {
            executor.shutdownNow(); // Em caso de interrupção, força o desligamento
            System.err.println("A espera pela terminação foi interrompida.");
            Thread.currentThread().interrupt();
        }

        System.out.println("ExecutorService finalizado.");
    }
}

```

### Exemplo 2: `CachedThreadPool` para Tarefas Esporádicas

Cenário de uso: Requisições de rede que chegam esporadicamente, onde o número de threads pode variar bastante.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class CachedThreadPoolExample {

    // Simula o download de um arquivo
    static class FileDownloader implements Runnable {
        private String fileName;
        private int downloadTime;

        public FileDownloader(String fileName, int downloadTime) {
            this.fileName = fileName;
            this.downloadTime = downloadTime;
        }

        @Override
        public void run() {
            System.out.println("Baixando " + fileName + " na thread: " + Thread.currentThread().getName());
            try {
                Thread.sleep(downloadTime); // Simula o tempo de download
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Download de " + fileName + " interrompido.");
            }
            System.out.println("Download de " + fileName + " concluído.");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        // Cria um pool que reutiliza threads existentes se disponíveis, ou cria novas.
        // Threads ociosas por 60s são terminadas.
        ExecutorService executor = Executors.newCachedThreadPool();

        System.out.println("Iniciando downloads esporádicos...");

        // Submete algumas tarefas
        executor.execute(new FileDownloader("doc1.pdf", 1500));
        executor.execute(new FileDownloader("image.png", 500));
        Thread.sleep(2000); // Espera um pouco, algumas threads podem ficar ociosas
        executor.execute(new FileDownloader("video.mp4", 3000));
        executor.execute(new FileDownloader("report.xlsx", 1000));

        System.out.println("Todas as tarefas foram submetidas.");

        executor.shutdown();
        if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
            System.err.println("Tempo limite excedido para CachedThreadPool. Forçando desligamento.");
            executor.shutdownNow();
        }
        System.out.println("CachedThreadPool finalizado.");
    }
}

```

### Exemplo 3: `SingleThreadExecutor` para Execução Sequencial

Cenário de uso: Operações que devem ser executadas estritamente em ordem, como o registro de logs em um arquivo ou a atualização de um contador global.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class SingleThreadExecutorExample {

    static class LogWriter implements Runnable {
        private String logMessage;

        public LogWriter(String logMessage) {
            this.logMessage = logMessage;
        }

        @Override
        public void run() {
            System.out.println("Escrevendo log: \\"" + logMessage + "\\" na thread: " + Thread.currentThread().getName());
            try {
                Thread.sleep(500); // Simula escrita no arquivo
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("Escrita de log interrompida.");
            }
            System.out.println("Log escrito: \\"" + logMessage + "\\"");
        }
    }

    public static void main(String[] args) throws InterruptedException {
        // Garante que todas as tarefas serão executadas por uma única thread, sequencialmente.
        ExecutorService executor = Executors.newSingleThreadExecutor();

        System.out.println("Iniciando escrita de logs...");

        executor.execute(new LogWriter("Usuário logado: Gedê"));
        executor.execute(new LogWriter("Erro no processamento de dados"));
        executor.execute(new LogWriter("Transação concluída com sucesso"));
        executor.execute(new LogWriter("Usuário deslogado: Ju"));

        System.out.println("Todas as tarefas de log foram submetidas.");

        executor.shutdown();
        if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
            System.err.println("Tempo limite excedido para SingleThreadExecutor. Forçando desligamento.");
            executor.shutdownNow();
        }
        System.out.println("SingleThreadExecutor finalizado.");
    }
}

```

### Exemplo 4: `ScheduledThreadPoolExecutor` para Tarefas Agendadas

Cenário de uso: Executar um job de limpeza de banco de dados a cada 24 horas, ou enviar um relatório por e-mail a cada semana.

```java
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ScheduledThreadPoolExample {

    static class DailyReportGenerator implements Runnable {
        @Override
        public void run() {
            System.out.println("Gerando relatório diário na thread: " + Thread.currentThread().getName() + " - " + System.currentTimeMillis());
            // Lógica para gerar o relatório
        }
    }

    public static void main(String[] args) throws InterruptedException {
        // Cria um pool com 1 thread para agendamento
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

        System.out.println("Agendando tarefas...");

        // Agenda a tarefa para ser executada após 2 segundos, e então a cada 5 segundos
        // scheduleAtFixedRate tenta manter um intervalo fixo entre as *start times*
        // scheduleWithFixedDelay garante um atraso fixo entre o *fim* de uma execução e o *início* da próxima
        scheduler.scheduleAtFixedRate(new DailyReportGenerator(), 2, 5, TimeUnit.SECONDS);

        // Agendando uma tarefa única com atraso
        scheduler.schedule(() -> {
            System.out.println("Tarefa única após 10 segundos na thread: " + Thread.currentThread().getName());
        }, 10, TimeUnit.SECONDS);

        // Deixa o programa rodar por um tempo para ver as tarefas agendadas
        Thread.sleep(20000); // 20 segundos

        System.out.println("Finalizando agendador...");
        scheduler.shutdown();
        if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
            System.err.println("Tempo limite excedido para ScheduledThreadPool. Forçando desligamento.");
            scheduler.shutdownNow();
        }
        System.out.println("ScheduledThreadPool finalizado.");
    }
}

```

### Exemplo 5: Usando `Callable` e `Future` para Obter Resultados

Cenário de uso: Calcular um valor complexo em uma thread separada e usar o resultado na thread principal quando estiver disponível.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class CallableFutureExample {

    // Uma tarefa que retorna um resultado
    static class FactorialCalculator implements Callable<Long> {
        private int number;

        public FactorialCalculator(int number) {
            this.number = number;
        }

        @Override
        public Long call() throws Exception {
            if (number < 0) {
                throw new IllegalArgumentException("Número deve ser não-negativo para cálculo de fatorial.");
            }
            long result = 1;
            for (int i = 1; i <= number; i++) {
                result *= i;
                // Simula um cálculo demorado
                Thread.sleep(100);
            }
            System.out.println("Fatorial de " + number + " calculado na thread: " + Thread.currentThread().getName());
            return result;
        }
    }

    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(2);
        List<Future<Long>> futures = new ArrayList<>();

        System.out.println("Submetendo tarefas de cálculo de fatorial...");

        for (int i = 0; i <= 5; i++) {
            FactorialCalculator calculator = new FactorialCalculator(i);
            Future<Long> future = executor.submit(calculator);
            futures.add(future);
        }

        // Submetendo uma tarefa que deve falhar
        futures.add(executor.submit(new FactorialCalculator(-1))); // Isso causará uma exceção

        System.out.println("Aguardando resultados...");

        for (Future<Long> future : futures) {
            try {
                Long result = future.get(); // Bloqueia até o resultado estar disponível
                System.out.println("Resultado do fatorial: " + result);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                System.err.println("A espera pelo resultado foi interrompida.");
            } catch (ExecutionException e) {
                // A exceção original lançada pela tarefa é encapsulada em ExecutionException
                System.err.println("Erro ao calcular fatorial: " + e.getCause().getMessage());
            }
        }

        executor.shutdown();
        try {
            if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                System.err.println("Tempo limite excedido. Forçando desligamento.");
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Interrupção ao aguardar o término do executor.");
        }
        System.out.println("ExecutorService com Callable e Future finalizado.");
    }
}

```

### 5\. Informações Adicionais

### Shutting Down Gracefully (Desligamento Gracioso)

O desligamento de um `ExecutorService` é um ponto crítico. Chamar `shutdown()` e depois `awaitTermination()` é a maneira recomendada de garantir que todas as tarefas submetidas sejam concluídas antes que o programa encerre.

```java
// Exemplo de desligamento gracioso
public void shutdownExecutor(ExecutorService executor) {
    executor.shutdown(); // Não aceita mais tarefas, mas processa as existentes
    try {
        // Espera por um tempo razoável para que as tarefas terminem
        if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
            // Se as tarefas não terminarem no tempo limite, tenta um desligamento forçado
            executor.shutdownNow();
            // Espera novamente por um tempo curto para ver se as tarefas respondem
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                System.err.println("ExecutorService não terminou.");
            }
        }
    } catch (InterruptedException ie) {
        // Em caso de interrupção, força o desligamento
        executor.shutdownNow();
        // Preserva o status de interrupção
        Thread.currentThread().interrupt();
    }
}

```

### Customizando `ThreadPoolExecutor`

Para cenários mais avançados ou quando os métodos de fábrica de `Executors` não são suficientes, você pode criar uma instância de `ThreadPoolExecutor` diretamente. Isso lhe dá controle granular sobre:

- **Tamanho do Pool (`corePoolSize`, `maximumPoolSize`):** Definir o número mínimo e máximo de threads.
- **Fila de Trabalho (`BlockingQueue`):** Escolher a estratégia de fila (e.g., `LinkedBlockingQueue` para fila ilimitada, `ArrayBlockingQueue` para fila de tamanho fixo, `SynchronousQueue` para transferências diretas).
- **Política de Rejeição (`RejectedExecutionHandler`):** Como lidar com tarefas quando o pool e a fila estão cheios (e.g., `AbortPolicy` (padrão, lança exceção), `CallerRunsPolicy` (executa na thread que submeteu), `DiscardPolicy` (descarta tarefa), `DiscardOldestPolicy` (descarta a tarefa mais antiga na fila)).
- **Fábrica de Threads (`ThreadFactory`):** Para personalizar a criação de threads (nomear threads, definir prioridades, etc.).

<!-- end list -->

```java
import java.util.concurrent.*;

public class CustomThreadPoolExecutorExample {

    public static void main(String[] args) throws InterruptedException {
        int corePoolSize = 2;
        int maximumPoolSize = 5;
        long keepAliveTime = 60;
        TimeUnit unit = TimeUnit.SECONDS;
        BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<>(10); // Capacidade da fila: 10 tarefas
        ThreadFactory threadFactory = Executors.defaultThreadFactory(); // Fábrica padrão de threads
        RejectedExecutionHandler handler = new ThreadPoolExecutor.AbortPolicy(); // Política padrão: lança RejectedExecutionException

        ThreadPoolExecutor executor = new ThreadPoolExecutor(
            corePoolSize,
            maximumPoolSize,
            keepAliveTime,
            unit,
            workQueue,
            threadFactory,
            handler
        );

        System.out.println("Custom ThreadPoolExecutor configurado.");

        for (int i = 0; i < 20; i++) {
            final int taskId = i;
            try {
                executor.execute(() -> {
                    System.out.println("Executando tarefa " + taskId + " na thread: " + Thread.currentThread().getName());
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });
            } catch (RejectedExecutionException e) {
                System.err.println("Tarefa " + taskId + " rejeitada: " + e.getMessage());
            }
        }

        executor.shutdown();
        if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
            System.err.println("Custom ThreadPoolExecutor não terminou no prazo.");
            executor.shutdownNow();
        }
        System.out.println("Custom ThreadPoolExecutor finalizado.");
    }
}

```

### Considerações de Performance

- **Número de Threads Ideal:** O número ideal de threads em um pool depende da natureza das suas tarefas.
    - **CPU-bound (tarefas que usam muita CPU):** O número de threads deve ser aproximadamente igual ao número de núcleos disponíveis na CPU (e.g., `Runtime.getRuntime().availableProcessors()`). Mais threads que núcleos resultam em trocas de contexto desnecessárias, que podem degradar o desempenho.
    - **I/O-bound (tarefas que esperam muito por I/O, como rede ou disco):** O número de threads pode ser significativamente maior que o número de núcleos, pois as threads ficam "ociosas" esperando por operações de I/O e outras threads podem usar a CPU nesse meio tempo. Uma fórmula comum é `Número de Threads = Número de Cores * (1 + Tempo de Espera / Tempo de Computação)`.
- **Overhead:** Embora pools de threads sejam eficientes, eles ainda introduzem um pequeno overhead em comparação com a execução direta. Para tarefas extremamente curtas e simples, a sobrecarga de agendamento e gerenciamento de pool pode, em casos raros, ser maior que o benefício da concorrência. No entanto, para a maioria das aplicações backend, o benefício é esmagador.
- **Monitoramento:** Em um ambiente de produção, é crucial monitorar o estado dos seus pools de threads (tamanho da fila, número de threads ativas/ociosas) para ajustar as configurações conforme a carga.

### 6\. Referências para Estudo Independente

Para Gedê, que está aprofundando em Java e mirando Go, estas referências serão muito úteis:

- **Documentação Oficial Java:**
    - `ExecutorService`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html)
    - `Executors`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Executors.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Executors.html)
    - `ThreadPoolExecutor`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html)
    - `Callable`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Callable.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Callable.html)
    - `Future`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Future.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Future.html)
- **Livros Essenciais de Concorrência em Java:**
    - **"Java Concurrency in Practice" by Brian Goetz:** Considerada a "bíblia" da concorrência em Java. Absolutamente essencial para qualquer desenvolvedor sério na área.
- **Artigos e Tutoriais:**
    - Baeldung - Guide to Java Concurrency: `ExecutorService`: [https://www.baeldung.com/java-executor-service-tutorial](https://www.baeldung.com/java-executor-service-tutorial) (Este é um excelente recurso com muitos exemplos práticos).

Com essa base sólida em `Executors` e `ExecutorService`, Gedê, você terá uma compreensão muito mais profunda de como construir sistemas concorrentes eficientes e robustos em Java. E o melhor, muitos desses conceitos se traduzem bem para outras linguagens e plataformas de concorrência\!