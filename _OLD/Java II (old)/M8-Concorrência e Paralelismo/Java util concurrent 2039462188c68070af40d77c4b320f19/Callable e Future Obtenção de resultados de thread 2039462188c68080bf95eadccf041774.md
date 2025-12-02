# Callable e Future: Obtenção de resultados de threads.

Com certeza, Gedê\! Vamos mergulhar fundo no universo de `Callable` e `Future` em Java, ferramentas poderosas para lidar com resultados de threads de forma eficiente e controlada, algo essencial para você no desenvolvimento Backend.

---

## `Callable` e `Future`: Obtenção de Resultados de Threads

### 1\. Introdução

No desenvolvimento de aplicações concorrentes em Java, a execução de tarefas em segundo plano (em threads separadas) é uma prática comum para melhorar o desempenho e a responsividade de um sistema. Tradicionalmente, usávamos a interface `Runnable` para definir tarefas a serem executadas por threads. No entanto, o `Runnable` possui uma limitação: seu método `run()` não pode retornar um valor nem lançar exceções verificadas.

É aí que entram `Callable` e `Future`. Essas interfaces, introduzidas no Java 5 como parte do pacote `java.util.concurrent`, revolucionaram a forma como lidamos com a concorrência, permitindo que tarefas executadas em threads retornem resultados e lancem exceções, preenchendo uma lacuna crucial no modelo de concorrência anterior. Para você, Gedê, que está focado em Backend Go, entender a concorrência no Java é um excelente diferencial, pois muitos dos conceitos de paralelismo e comunicação assíncrona são aplicáveis em ambas as linguagens.

**`Callable`** é uma interface que representa uma tarefa que pode retornar um resultado e lançar exceções. Ela é uma alternativa mais flexível ao `Runnable` quando você precisa de um retorno de uma operação assíncrona.

**`Future`** é uma interface que representa o resultado de uma computação assíncrona. Pense nele como uma "promessa" de um resultado que ainda não está disponível. Ele fornece métodos para verificar se a computação está completa, esperar por sua conclusão e recuperar o resultado.

Juntos, `Callable` e `Future` formam um par poderoso para gerenciar tarefas assíncronas no Java, tornando o desenvolvimento concorrente mais robusto e intuitivo, especialmente quando a obtenção de um resultado é fundamental para a continuidade do fluxo principal da aplicação.

---

### 2\. Sumário

- **Problema com `Runnable` e a Solução `Callable` e `Future`**
    - Limitações do `Runnable`
    - Apresentando `Callable`
    - Apresentando `Future`
- **Sintaxe e Estrutura**
    - Definindo uma tarefa `Callable`
    - Submetendo um `Callable` a um `ExecutorService`
- **Componentes Principais**
    - Interface `Callable<V>`
    - Interface `Future<V>`
    - Métodos de `Future` (`get()`, `isDone()`, `cancel()`, `isCancelled()`)
    - `ExecutorService` e seus métodos para `Callable`
- **Restrições de Uso e Considerações**
- **Exemplos de Código Otimizados**
    - Exemplo Básico: Calculando Fatorial
    - Tratamento de Timeout com `get(long timeout, TimeUnit unit)`
    - Cancelamento de Tarefas
    - Múltiplas Tarefas `Callable` com `invokeAll()`
- **Informações Adicionais**
    - `FutureTask`
    - `CompletableFuture` (Java 8+)
- **Referências para Estudo Independente**

---

### 3\. Conteúdo Detalhado

### Problema com `Runnable` e a Solução `Callable` e `Future`

Historicamente, a interface `Runnable` era a principal maneira de definir tarefas que seriam executadas em threads separadas. Ela possui um único método, `void run()`, que não aceita parâmetros, não retorna valor e não pode lançar exceções verificadas. Isso se tornava um problema em cenários onde a tarefa em background precisava:

1. **Retornar um resultado:** Se a tarefa realizava um cálculo complexo ou buscava dados, não havia uma forma direta de retornar esse resultado para a thread principal ou para outra parte da aplicação. Soluções improvisadas envolviam o uso de campos `volatile` ou mecanismos de sincronização mais complexos.
2. **Lançar exceções:** Se a tarefa encontrava um erro que deveria ser tratado pela thread chamadora, as exceções verificadas não podiam ser propagadas diretamente. Era necessário encapsulá-las em exceções de tempo de execução ou usar mecanismos de *callback* complicados.

Para resolver essas limitações, o Java 5 introduziu as interfaces **`Callable`** e **`Future`**.

- **`Callable<V>`:** É uma interface funcional (com um único método abstrato) que define o método `V call() throws Exception`.
    - O `V` é o tipo do resultado que a tarefa irá retornar.
    - O método `call()` pode lançar exceções verificadas (`Exception`), permitindo um tratamento de erro mais explícito e robusto.
- **`Future<V>`:** É uma interface que representa o resultado de uma operação assíncrona. Quando você submete um `Callable` a um `ExecutorService`, ele retorna um objeto `Future`. Este objeto `Future` não contém o resultado imediatamente, mas sim uma "promessa" de que o resultado estará disponível em algum momento no futuro. Você pode usar o `Future` para:
    - Verificar se a tarefa foi concluída.
    - Esperar até que a tarefa seja concluída.
    - Obter o resultado da tarefa (bloqueando a thread atual se o resultado ainda não estiver disponível).
    - Cancelar a tarefa.

### Sintaxe e Estrutura

**Definindo uma tarefa `Callable`:**

Uma `Callable` é tipicamente implementada como uma classe anônima, uma classe interna, ou, mais comumente, como uma expressão lambda (a partir do Java 8) devido à sua natureza de interface funcional.

```java
import java.util.concurrent.Callable;

// Opção 1: Classe que implementa Callable
class MinhaTarefaCallable implements Callable<String> {
    private String nomeTarefa;

    public MinhaTarefaCallable(String nomeTarefa) {
        this.nomeTarefa = nomeTarefa;
    }

    @Override
    public String call() throws Exception {
        System.out.println("Executando tarefa: " + nomeTarefa + " na thread: " + Thread.currentThread().getName());
        Thread.sleep(2000); // Simula trabalho demorado
        return "Resultado da " + nomeTarefa + " concluído!";
    }
}

// Opção 2: Usando expressão lambda (preferencial a partir do Java 8)
Callable<Integer> somaCallable = () -> {
    System.out.println("Calculando soma na thread: " + Thread.currentThread().getName());
    int resultado = 0;
    for (int i = 0; i <= 100; i++) {
        resultado += i;
    }
    return resultado;
};

```

**Submetendo um `Callable` a um `ExecutorService`:**

Para executar um `Callable`, você geralmente o submete a um `ExecutorService`, que é uma abstração para gerenciar pools de threads. O `ExecutorService` cuida de iniciar a thread, executar o `Callable` e fornecer o objeto `Future`.

```java
import java.util.concurrent.*;

public class ExemploCallableFuture {
    public static void main(String[] args) {
        // Cria um pool de threads com 2 threads
        ExecutorService executor = Executors.newFixedThreadPool(2);

        // Cria uma instância de Callable
        Callable<String> minhaTarefa = () -> {
            System.out.println("Executando tarefa complexa na thread: " + Thread.currentThread().getName());
            Thread.sleep(3000); // Simula trabalho demorado
            return "Dados processados com sucesso!";
        };

        // Submete a tarefa ao executor e obtém um objeto Future
        Future<String> future = executor.submit(minhaTarefa);

        System.out.println("Tarefa submetida. Fazendo outras coisas na thread principal...");

        try {
            // Tenta obter o resultado. Este método é bloqueante!
            String resultado = future.get();
            System.out.println("Resultado da tarefa: " + resultado);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restaura o estado de interrupção
            System.err.println("A thread principal foi interrompida.");
        } catch (ExecutionException e) {
            System.err.println("Erro na execução da tarefa: " + e.getCause().getMessage());
        } finally {
            // É importante desligar o executor quando não for mais necessário
            executor.shutdown();
        }
    }
}

```

### Componentes Principais

- **Interface `Callable<V>`:**
    - **Tipo Genérico `V`**: Define o tipo do valor que o método `call()` retornará. Isso oferece **segurança de tipo** em tempo de compilação.
    - **Método `V call() throws Exception`**: O coração da interface. Contém a lógica de negócios que será executada na thread separada. A capacidade de lançar `Exception` é uma das suas maiores vantagens sobre `Runnable`.
- **Interface `Future<V>`:**
    - **Tipo Genérico `V`**: Corresponde ao tipo de retorno do `Callable` associado.
    - **Métodos:**
        - `V get()`:
            - **Função:** Espera (bloqueia a thread atual) se necessário para que a computação seja concluída e então recupera seu resultado.
            - **Retorno:** O resultado da computação.
            - **Lança:** `InterruptedException` (se a thread atual for interrompida enquanto espera) ou `ExecutionException` (se a computação lançou uma exceção).
        - `V get(long timeout, TimeUnit unit)`:
            - **Função:** Semelhante a `get()`, mas com um tempo limite. Espera no máximo pelo tempo especificado para que a computação seja concluída.
            - **Parâmetros:**
                - `timeout`: O tempo máximo para esperar.
                - `unit`: A unidade de tempo do parâmetro `timeout` (ex: `TimeUnit.SECONDS`, `TimeUnit.MILLISECONDS`).
            - **Lança:** Além de `InterruptedException` e `ExecutionException`, também lança `TimeoutException` se o resultado não estiver disponível dentro do tempo limite.
        - `boolean isDone()`:
            - **Função:** Retorna `true` se a tarefa foi concluída, foi cancelada ou lançou uma exceção. Retorna `false` caso contrário.
            - **Observação:** Não indica se a tarefa foi bem-sucedida ou falhou, apenas que não está mais em progresso.
        - `boolean cancel(boolean mayInterruptIfRunning)`:
            - **Função:** Tenta cancelar a execução desta tarefa.
            - **Parâmetro:** `mayInterruptIfRunning`: Se `true` e a tarefa estiver sendo executada por uma thread, a thread pode ser interrompida. Se `false`, a thread que executa esta tarefa não será interrompida (e a tarefa só será cancelada se ainda não tiver começado).
            - **Retorno:** `true` se a tarefa foi cancelada com sucesso antes de ser concluída normalmente; `false` se a tarefa já foi concluída, já foi cancelada, ou não pôde ser cancelada por algum outro motivo.
            - **Restrições:** O cancelamento é apenas uma *tentativa*. Depende da tarefa verificar o estado de interrupção da sua thread ou outros mecanismos de cancelamento.
        - `boolean isCancelled()`:
            - **Função:** Retorna `true` se a tarefa foi cancelada antes de ser concluída normalmente.
- **`ExecutorService` e seus métodos para `Callable`:**
    - `ExecutorService` é a interface de alto nível para gerenciar a execução de tarefas concorrentes. Ele abstrai os detalhes da criação e gerenciamento de threads.
    - **`Future<V> submit(Callable<V> task)`:** O método mais comum para enviar um `Callable` para execução. Ele retorna um `Future` imediatamente, permitindo que a thread chamadora continue seu trabalho enquanto a tarefa é executada em segundo plano.
    - `List<Future<V>> invokeAll(Collection<? extends Callable<V>> tasks)`:
        - **Função:** Executa a coleção de tarefas `Callable` fornecida. Retorna uma lista de `Future`s, uma para cada tarefa.
        - **Observação:** Este método é bloqueante. Ele espera até que *todas* as tarefas sejam concluídas (ou que o tempo limite especificado seja atingido) antes de retornar a lista de `Future`s.
    - `V invokeAny(Collection<? extends Callable<V>> tasks)`:
        - **Função:** Executa a coleção de tarefas `Callable` fornecida e retorna o resultado da *primeira* que completar com sucesso (não lançando uma exceção).
        - **Observação:** Também é bloqueante e cancela as outras tarefas que ainda estão em execução.

### Restrições de Uso e Considerações

- **Bloqueio de `get()`:** O método `get()` do `Future` é **bloqueante**. Se você chamar `get()` antes que a tarefa seja concluída, a thread atual (a thread principal, por exemplo) será pausada até que o resultado esteja disponível. Isso pode anular os benefícios da concorrência se usado incorretamente. Use `isDone()` para verificar o status ou `get(timeout, unit)` para evitar bloqueios indefinidos.
- **Tratamento de Exceções:** Quando um `Callable` lança uma exceção, ela é encapsulada em uma `ExecutionException` quando você chama `future.get()`. É crucial que você trate essa `ExecutionException` para acessar a causa raiz da exceção (`e.getCause()`) e lidar com ela adequadamente.
- **Vazamento de Recursos:** Sempre chame `executor.shutdown()` ou `executor.shutdownNow()` quando terminar de usar um `ExecutorService` para garantir que todas as threads sejam encerradas e os recursos sejam liberados.
- **Cancelamento Cooperativo:** O método `cancel()` apenas tenta cancelar a tarefa. Para que o cancelamento seja eficaz, o `Callable` deve verificar periodicamente o estado de interrupção da thread (usando `Thread.currentThread().isInterrupted()`) e reagir a ele, por exemplo, terminando sua execução ou lançando uma `InterruptedException`.
- **Complexidade para Múltiplas Dependências:** Para cenários mais complexos onde o resultado de uma tarefa depende do resultado de outra, ou onde você precisa encadear múltiplas operações assíncronas, `Callable` e `Future` podem se tornar um pouco complicados. Nesses casos, `CompletableFuture` (introduzido no Java 8) oferece uma API mais fluida e poderosa.

### 4\. Exemplos de Código Otimizados

Vamos ver alguns exemplos práticos para solidificar o entendimento.

### Exemplo Básico: Calculando Fatorial

Este exemplo mostra como usar `Callable` para realizar um cálculo e `Future` para obter o resultado.

```java
import java.math.BigInteger;
import java.util.concurrent.*;

public class FatorialCallableExample {

    // Callable para calcular o fatorial de um número
    static class FatorialCalculator implements Callable<BigInteger> {
        private int numero;

        public FatorialCalculator(int numero) {
            this.numero = numero;
        }

        @Override
        public BigInteger call() throws Exception {
            if (numero < 0) {
                throw new IllegalArgumentException("Número deve ser não-negativo");
            }
            if (numero == 0 || numero == 1) {
                return BigInteger.ONE;
            }

            BigInteger resultado = BigInteger.ONE;
            for (int i = 2; i <= numero; i++) {
                resultado = resultado.multiply(BigInteger.valueOf(i));
                // Simula um pouco de trabalho para ver a concorrência
                Thread.sleep(100);
            }
            System.out.println("Fatorial de " + numero + " calculado na thread: " + Thread.currentThread().getName());
            return resultado;
        }
    }

    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(3); // Pool com 3 threads

        // Cria e submete 3 tarefas de fatorial
        Future<BigInteger> future1 = executor.submit(new FatorialCalculator(5));
        Future<BigInteger> future2 = executor.submit(new FatorialCalculator(10));
        Future<BigInteger> future3 = executor.submit(new FatorialCalculator(20)); // Número maior

        System.out.println("Tarefas de fatorial submetidas. A thread principal continua...");

        try {
            // Obtém os resultados. future.get() é bloqueante.
            System.out.println("Fatorial de 5: " + future1.get());
            System.out.println("Fatorial de 10: " + future2.get());
            System.out.println("Fatorial de 20: " + future3.get());

            // Exemplo de como lidar com exceções:
            Future<BigInteger> future4 = executor.submit(new FatorialCalculator(-2)); // Vai lançar exceção
            try {
                System.out.println("Fatorial de -2: " + future4.get());
            } catch (ExecutionException e) {
                System.err.println("Erro ao calcular fatorial: " + e.getCause().getMessage());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("A thread principal foi interrompida.");
        } catch (ExecutionException e) {
            System.err.println("Ocorreu uma exceção inesperada na tarefa: " + e.getCause().getMessage());
        } finally {
            executor.shutdown(); // Desliga o executor
            System.out.println("ExecutorService desligado.");
        }
    }
}

```

**Caso de Uso Real:** Você pode usar isso para processar grandes volumes de dados em lotes (batch processing), onde cada item do lote é um `Callable` e os resultados são coletados ao final. Por exemplo, processamento de imagens, cálculo de relatórios financeiros, ou qualquer operação que possa ser dividida em unidades de trabalho independentes que retornam um valor.

### Tratamento de Timeout com `get(long timeout, TimeUnit unit)`

É crucial evitar que a thread principal fique bloqueada indefinidamente esperando por um resultado. O método `get` com timeout é ideal para isso.

```java
import java.util.concurrent.*;

public class CallableTimeoutExample {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        Callable<String> tarefaDemorada = () -> {
            System.out.println("Iniciando tarefa demorada...");
            Thread.sleep(5000); // Simula 5 segundos de trabalho
            System.out.println("Tarefa demorada concluída.");
            return "Tarefa finalizada!";
        };

        Future<String> future = executor.submit(tarefaDemorada);

        try {
            System.out.println("Esperando pelo resultado com timeout de 3 segundos...");
            // Tenta obter o resultado em até 3 segundos
            String resultado = future.get(3, TimeUnit.SECONDS);
            System.out.println("Resultado obtido: " + resultado);
        } catch (TimeoutException e) {
            System.err.println("Timeout! A tarefa demorou mais que o esperado.");
            future.cancel(true); // Tenta cancelar a tarefa
            System.err.println("Tarefa cancelada? " + future.isCancelled());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("A thread principal foi interrompida.");
        } catch (ExecutionException e) {
            System.err.println("Erro na execução da tarefa: " + e.getCause().getMessage());
        } finally {
            executor.shutdownNow(); // Desliga o executor imediatamente
        }
    }
}

```

**Caso de Uso Real:** Em um sistema Backend, você pode ter uma API que precisa se comunicar com um serviço externo que às vezes pode demorar a responder. Usar `get` com timeout garante que sua API não fique bloqueada infinitamente, permitindo que você retorne um erro ou uma mensagem de "serviço indisponível" ao cliente em tempo hábil.

### Cancelamento de Tarefas

Mostrar como `cancel()` funciona e a importância do cancelamento cooperativo.

```java
import java.util.concurrent.*;

public class CallableCancelExample {

    static class TarefaCancelavel implements Callable<String> {
        @Override
        public String call() throws Exception {
            System.out.println("Iniciando tarefa cancelável...");
            for (int i = 0; i < 10; i++) {
                if (Thread.currentThread().isInterrupted()) {
                    System.out.println("Tarefa cancelável: Interrupção detectada! Saindo...");
                    throw new InterruptedException("Tarefa foi interrompida.");
                }
                System.out.println("Tarefa cancelável: Processando etapa " + (i + 1));
                Thread.sleep(500); // Simula trabalho
            }
            System.out.println("Tarefa cancelável concluída normalmente.");
            return "Processamento finalizado";
        }
    }

    public static void main(String[] args) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Future<String> future = executor.submit(new TarefaCancelavel());

        try {
            System.out.println("Thread principal: Aguardando um pouco antes de cancelar...");
            Thread.sleep(2000); // Espera 2 segundos

            // Tenta cancelar a tarefa, permitindo interrupção da thread
            boolean cancelado = future.cancel(true);
            System.out.println("Thread principal: Tentativa de cancelamento bem-sucedida? " + cancelado);

            if (cancelado) {
                System.out.println("Thread principal: A tarefa foi cancelada.");
                // Tentando obter o resultado de uma tarefa cancelada lança CancellationException
                try {
                    future.get();
                } catch (CancellationException e) {
                    System.out.println("Thread principal: Caught CancellationException conforme esperado.");
                }
            } else {
                System.out.println("Thread principal: Não foi possível cancelar a tarefa (provavelmente já terminou).");
                System.out.println("Thread principal: Resultado final: " + future.get());
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Thread principal interrompida.");
        } catch (ExecutionException e) {
            System.err.println("Thread principal: Erro na execução da tarefa: " + e.getCause().getMessage());
        } finally {
            executor.shutdownNow();
        }
    }
}

```

**Caso de Uso Real:** Em um sistema de busca em tempo real, se o usuário digita uma nova consulta antes que a anterior seja concluída, você pode cancelar a tarefa de busca antiga para economizar recursos e iniciar uma nova. Similarmente, em um sistema de relatórios, se um usuário fecha a janela antes que um relatório complexo seja gerado, a tarefa de geração pode ser cancelada.

### Múltiplas Tarefas `Callable` com `invokeAll()`

Para executar várias tarefas e esperar que todas elas sejam concluídas, `invokeAll()` é uma excelente escolha.

```java
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;

public class InvokeAllExample {

    static class DownloadTask implements Callable<String> {
        private String url;

        public DownloadTask(String url) {
            this.url = url;
        }

        @Override
        public String call() throws Exception {
            System.out.println("Iniciando download de: " + url + " na thread: " + Thread.currentThread().getName());
            long tempoSimulado = (long) (Math.random() * 3000) + 1000; // 1 a 4 segundos
            Thread.sleep(tempoSimulado);
            System.out.println("Download concluído de: " + url);
            return "Conteúdo de " + url + " (tamanho simulado: " + tempoSimulado / 10 + "KB)";
        }
    }

    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(4); // Pool com 4 threads

        List<Callable<String>> tasks = new ArrayList<>();
        tasks.add(new DownloadTask("<http://site1.com/data.json>"));
        tasks.add(new DownloadTask("<http://site2.com/image.png>"));
        tasks.add(new DownloadTask("<http://site3.com/document.pdf>"));
        tasks.add(new DownloadTask("<http://site4.com/video.mp4>"));

        System.out.println("Submetendo todas as tarefas de download...");

        try {
            // invokeAll() bloqueia até que todas as tarefas sejam concluídas (ou timeout)
            List<Future<String>> futures = executor.invokeAll(tasks);

            System.out.println("\\nTodas as tarefas de download foram concluídas ou o tempo limite foi atingido.");

            for (int i = 0; i < futures.size(); i++) {
                Future<String> future = futures.get(i);
                try {
                    // isDone() já deve ser true aqui, mas get() ainda pode lançar exceções de execução
                    System.out.println("Resultado da tarefa " + (i + 1) + ": " + future.get());
                } catch (ExecutionException e) {
                    System.err.println("Erro na tarefa " + (i + 1) + ": " + e.getCause().getMessage());
                } catch (CancellationException e) {
                    System.err.println("Tarefa " + (i + 1) + " foi cancelada.");
                }
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("A thread principal foi interrompida.");
        } finally {
            executor.shutdown();
        }
    }
}

```

**Caso de Uso Real:** Imagine um backend que precisa buscar dados de múltiplas fontes externas em paralelo para montar uma resposta complexa. Usar `invokeAll()` permite que você inicie todas as buscas simultaneamente e espere que todas elas retornem antes de agregar os resultados e enviar a resposta ao cliente.

### 5\. Informações Adicionais

### `FutureTask`

`FutureTask` é uma classe concreta que implementa tanto a interface `RunnableFuture` (que estende `Runnable` e `Future`) quanto a interface `Callable`. Isso permite que você envolva um `Callable` (ou um `Runnable`) em um `FutureTask` e então passe o `FutureTask` para um `Thread` para ser executado diretamente, ou submetê-lo a um `ExecutorService`.

- **Vantagem:** Oferece uma maneira de adaptar um `Callable` para ser usado onde um `Runnable` é esperado, mas ainda com os benefícios de `Future` para obter o resultado.
- **Exemplo:**
    
    ```java
    import java.util.concurrent.Callable;
    import java.util.concurrent.FutureTask;
    import java.util.concurrent.ExecutionException;
    
    public class FutureTaskExample {
        public static void main(String[] args) throws InterruptedException, ExecutionException {
            Callable<String> minhaCallable = () -> {
                Thread.sleep(1000);
                return "Resultado de FutureTask";
            };
    
            FutureTask<String> futureTask = new FutureTask<>(minhaCallable);
    
            // Pode ser executado diretamente por uma Thread
            new Thread(futureTask).start();
    
            // Ou submetido a um ExecutorService
            // ExecutorService executor = Executors.newSingleThreadExecutor();
            // Future<?> future = executor.submit(futureTask);
    
            System.out.println("Fazendo outras coisas...");
            String resultado = futureTask.get(); // Bloqueia até obter o resultado
            System.out.println(resultado);
            // executor.shutdown();
        }
    }
    
    ```
    

### `CompletableFuture` (Java 8+)

Para você, Gedê, que já tem experiência em Backend e está de olho em Go, conhecer `CompletableFuture` é fundamental. Ele é uma evolução massiva do `Future` tradicional, introduzido no Java 8, que permite uma programação assíncrona muito mais elegante e composível.

- **Limitações do `Future`:**
    - **Bloqueio:** `get()` é bloqueante.
    - **Não encadeável:** É difícil compor múltiplas operações assíncronas sequencialmente ou em paralelo sem aninhar chamadas `get()`.
    - **Sem tratamento de exceções fácil:** Exceções precisam ser capturadas ao chamar `get()`.
    - **Não reativo:** Não há um mecanismo fácil para ser notificado quando a tarefa é concluída.
- **Vantagens do `CompletableFuture`:**
    - **Não bloqueante:** Permite encadear operações usando *callbacks* (`thenApply`, `thenAccept`, `thenRun`, `thenCompose`, `thenCombine`, etc.) sem bloquear a thread principal.
    - **Tratamento de exceções robusto:** Métodos como `exceptionally`, `handle` para tratamento de erros em um fluxo assíncrono.
    - **Composição poderosa:** Facilita a combinação de resultados de múltiplas operações assíncronas.
    - **Criação manual:** Você pode criar um `CompletableFuture` e completá-lo manualmente com um resultado ou uma exceção.

**Exemplo básico de `CompletableFuture`:**

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class CompletableFutureExample {
    public static void main(String[] args) {
        System.out.println("Iniciando CompletableFuture...");

        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("Executando tarefa assíncrona...");
                Thread.sleep(2000);
                if (Math.random() > 0.5) {
                    throw new RuntimeException("Simulando erro!");
                }
                return "Dados do serviço externo";
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return "Tarefa interrompida";
            }
        });

        // Encadeando operações de forma não bloqueante
        future
            .thenApply(resultado -> { // Transforma o resultado
                System.out.println("Resultado original: " + resultado);
                return resultado.toUpperCase();
            })
            .thenAccept(resultadoMaiusculo -> { // Consome o resultado
                System.out.println("Resultado em maiúsculas: " + resultadoMaiusculo);
            })
            .exceptionally(ex -> { // Trata exceções
                System.err.println("Erro na operação: " + ex.getMessage());
                return "Erro processado"; // Retorna um valor padrão em caso de erro
            })
            .thenRun(() -> { // Executa uma ação final sem receber resultado
                System.out.println("Fluxo de CompletableFuture concluído!");
            });

        System.out.println("Thread principal continua executando sem bloqueio...");

        // Para evitar que o programa termine antes dos CompletableFutures
        try {
            // Este get() é apenas para manter a main thread viva,
            // em uma aplicação real o main thread geralmente não esperaria
            future.get();
        } catch (InterruptedException | ExecutionException e) {
            // Ignorar ou logar, o tratamento já foi feito em exceptionally
        }
    }
}

```

**Relevância para Backend:** Em serviços de backend que precisam orquestrar várias chamadas assíncronas (ex: consultar múltiplos microserviços, bases de dados, APIs externas) de forma eficiente e resiliente, `CompletableFuture` é a ferramenta de escolha. Ele permite construir pipelines de dados assíncronos que são fáceis de ler, manter e depurar, minimizando o uso de threads e melhorando a escalabilidade. Você verá muitos paralelos com as goroutines e channels em Go ao estudar `CompletableFuture`.

---

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos em `Callable` e `Future`, bem como em concorrência em Java em geral, recomendo os seguintes recursos:

- **Documentação Oficial da Oracle:**
    - `Callable`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Callable.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Callable.html)
    - `Future`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Future.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Future.html)
    - `ExecutorService`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ExecutorService.html)
    - `CompletableFuture`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html)
- **Livros:**
    - **"Java Concurrency in Practice" by Brian Goetz et al.:** Considerado a bíblia da concorrência em Java. Embora um pouco antigo, os princípios fundamentais são atemporais e extremamente valiosos.
    - **"Effective Java" by Joshua Bloch:** Contém itens importantes sobre concorrência e o uso de `java.util.concurrent`.
- **Tutoriais e Artigos:**
    - **Baeldung - Java Callable and Future:** [https://www.baeldung.com/java-callable-future](https://www.baeldung.com/java-callable-future) (Excelente recurso com muitos exemplos práticos).
    - **Baeldung - Guide to CompletableFuture:** [https://www.baeldung.com/java-completablefuture](https://www.baeldung.com/java-completablefuture) (Para se aprofundar no `CompletableFuture`).

---

Espero que esta explicação detalhada sobre `Callable` e `Future` ajude você, Gedê, a solidificar seu conhecimento em concorrência Java\! Há mais algum tópico da sua grade de estudos que gostaria de explorar?