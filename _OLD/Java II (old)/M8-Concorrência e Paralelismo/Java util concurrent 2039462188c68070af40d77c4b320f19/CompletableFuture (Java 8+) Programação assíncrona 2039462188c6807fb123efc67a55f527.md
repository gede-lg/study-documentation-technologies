# CompletableFuture (Java 8+): Programação assíncrona

Certamente, Gedê\! O `CompletableFuture` é um dos recursos mais poderosos introduzidos no Java 8 para lidar com programação assíncrona, e é super relevante para você que trabalha e busca cargos em Backend, onde a performance e a reatividade são cruciais. Vamos mergulhar fundo nele\!

## `CompletableFuture` (Java 8+): Programação Assíncrona e Reativa

### 1\. Introdução

No desenvolvimento de sistemas backend, especialmente em aplicações modernas que precisam ser escaláveis e responsivas, a programação assíncrona se tornou um pilar fundamental. Operações que consomem tempo, como requisições a bancos de dados, chamadas a APIs externas, ou processamento intensivo de dados, podem bloquear o thread principal, impactando a performance e a experiência do usuário (no caso de frontends) ou a capacidade de processamento (no caso de backends).

Tradicionalmente, Java lidava com concorrência usando `Threads` e `Runnables`, que eram bastante verbosos e complexos para gerenciar. Com o Java 5, a interface `Future` e o `ExecutorService` simplificaram um pouco a execução assíncrona, permitindo que uma tarefa fosse enviada para um pool de threads e seu resultado fosse obtido posteriormente. No entanto, `Future` tinha limitações significativas: não era possível encadear operações assíncronas, compor múltiplos `Futures`, ou tratar exceções de forma elegante.

É aqui que o `CompletableFuture` (introduzido no Java 8) brilha. Ele é uma evolução da interface `Future`, fornecendo uma forma mais robusta, flexível e elegante de escrever código assíncrono e não-bloqueante. `CompletableFuture` permite a criação de pipelines de operações assíncronas, onde o resultado de uma operação pode ser usado como entrada para a próxima, e oferece mecanismos poderosos para lidar com sucesso e falha. Ele é o coração da programação reativa em Java, permitindo que suas aplicações aproveitem ao máximo os recursos da CPU, melhorando a throughput e a latência.

`CompletableFuture` é uma classe que implementa as interfaces `Future` e `CompletionStage`. Ele representa o resultado de uma computação que pode ser concluída em algum momento no futuro. Ao contrário do `Future` tradicional, o `CompletableFuture` permite que você defina callbacks que serão executados quando a computação for concluída (com sucesso ou falha), sem bloquear o thread principal. Isso permite a criação de fluxos de trabalho assíncronos e a composição de múltiplas operações assíncronas de forma declarativa.

### 2\. Sumário

- **Fundamentos da Programação Assíncrona com `CompletableFuture`**
    - Definição e propósito do `CompletableFuture`
    - Vantagens sobre a interface `Future`
    - Mecanismos de criação e completude
- **Métodos Chave para Construção de Pipelines Assíncronos**
    - Criação: `supplyAsync()`, `runAsync()`, `completedFuture()`
    - Callbacks para Sucesso: `thenApply()`, `thenAccept()`, `thenRun()`
    - Composição: `thenCompose()`, `thenCombine()`, `allOf()`, `anyOf()`
    - Tratamento de Exceções: `exceptionally()`, `handle()`
    - Finalização: `whenComplete()`
    - Obtenção de Resultados: `get()`, `join()`
- **Controle de Thread Pools**
    - `ForkJoinPool.commonPool()`
    - `Executor` personalizado
- **Restrições e Considerações de Uso**
- **Exemplos de Código Otimizados**
    - Execução simples de tarefa assíncrona
    - Encadeamento de operações (`thenApply`, `thenCompose`)
    - Composição de múltiplos `CompletableFuture`s (`thenCombine`, `allOf`)
    - Tratamento de erros
- **Informações Adicionais**
    - Programação Reativa e `CompletableFuture`
    - Projeto Loom e Virtual Threads
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Fundamentos da Programação Assíncrona com `CompletableFuture`

`CompletableFuture` é uma classe poderosa para a programação assíncrona e reativa em Java. Sua principal vantagem sobre o `Future` é a capacidade de encadear operações de forma não bloqueante. Em vez de chamar `future.get()` e esperar o resultado (bloqueando o thread), você pode registrar uma função de callback que será executada *quando* o resultado estiver disponível.

**Vantagens sobre a interface `Future`:**

- **Composição:** Permite encadear operações assíncronas (e.g., "depois que A terminar, execute B, e depois C").
- **Callbacks Não-Bloqueantes:** As operações subsequentes são executadas por um pool de threads quando a tarefa anterior é concluída, sem bloquear o thread que iniciou o `CompletableFuture`.
- **Tratamento de Exceções Aprimorado:** Oferece métodos para lidar com erros de forma mais fluida.
- **Combinação de Múltiplos Futures:** Facilita a combinação de resultados de várias operações assíncronas.
- **Completabilidade Manual:** Você pode criar um `CompletableFuture` e completá-lo manualmente com um valor ou uma exceção a qualquer momento.

**Mecanismos de criação e completude:**

Um `CompletableFuture` pode ser criado de várias maneiras:

- **Executando uma `Runnable` assincronamente:** Para tarefas que não retornam um valor.
- **Executando uma `Supplier` assincronamente:** Para tarefas que retornam um valor.
- **Completando-o manualmente:** Para cenários onde o resultado é fornecido por outro sistema ou processo.
- **A partir de um valor já existente:** Se você já tem o resultado e quer tratá-lo como um `CompletableFuture`.

### Métodos Chave para Construção de Pipelines Assíncronos

Os métodos do `CompletableFuture` podem ser categorizados de acordo com sua função na construção de um pipeline assíncrono.

**Criação de `CompletableFuture`:**

- `static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)`
    - **Função:** Executa a `Supplier` fornecida em um pool de threads (padrão `ForkJoinPool.commonPool()`) e retorna um `CompletableFuture` que será concluído com o resultado da `Supplier`.
    - **Uso:** Para iniciar uma tarefa assíncrona que produz um resultado.
    - **Exemplo:** `CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello");`
- `static CompletableFuture<Void> runAsync(Runnable runnable)`
    - **Função:** Executa a `Runnable` fornecida em um pool de threads (padrão `ForkJoinPool.commonPool()`) e retorna um `CompletableFuture<Void>`.
    - **Uso:** Para iniciar uma tarefa assíncrona que não produz um resultado.
    - **Exemplo:** `CompletableFuture<Void> future = CompletableFuture.runAsync(() -> System.out.println("Running task..."));`
- `static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)`
- `static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor)`
    - **Função:** Variações dos métodos acima, permitindo especificar um `Executor` (pool de threads) customizado.
    - **Uso:** Essencial para controlar o contexto de execução e evitar a saturação do `commonPool()` em aplicações com muitas tarefas assíncronas.
- `static <U> CompletableFuture<U> completedFuture(U value)`
    - **Função:** Retorna um `CompletableFuture` que já está concluído com o valor fornecido.
    - **Uso:** Útil quando você já tem o resultado, mas quer tratá-lo como um `CompletableFuture` para compatibilidade em um pipeline ou para casos de cache.
    - **Exemplo:** `CompletableFuture<String> future = CompletableFuture.completedFuture("Already done");`
- `boolean complete(T value)`
- `boolean completeExceptionally(Throwable ex)`
    - **Função:** Completa manualmente o `CompletableFuture` com um valor ou uma exceção. Retorna `true` se a conclusão foi bem-sucedida (ainda não estava completa), `false` caso contrário.
    - **Uso:** Cenários onde o resultado vem de um processo externo ou um callback de outro sistema.

**Callbacks para Sucesso (Transformation Methods):**

Estes métodos permitem encadear operações, onde o resultado da tarefa anterior é transformado ou consumido. Por padrão, os callbacks são executados no mesmo thread que completou a fase anterior, ou no `commonPool()` se a fase anterior completou em um thread de I/O, ou se ela já estava completa. Existe uma versão `Async` para cada um que garante a execução em um pool de threads.

- `<U> CompletableFuture<U> thenApply(Function<? super T, ? extends U> fn)`
    - **Função:** Retorna um novo `CompletableFuture` que é concluído com o resultado da aplicação da função `fn` ao resultado deste `CompletableFuture`.
    - **Uso:** Transformar o tipo ou o valor do resultado.
    - **Exemplo:** De `String` para `Integer`.
- `<U> CompletableFuture<U> thenApplyAsync(Function<? super T, ? extends U> fn)`
- `<U> CompletableFuture<U> thenApplyAsync(Function<? super T, ? extends U> fn, Executor executor)`
    - **Função:** Versões assíncronas do `thenApply`. O callback é executado em um pool de threads.
- `CompletableFuture<Void> thenAccept(Consumer<? super T> action)`
    - **Função:** Retorna um novo `CompletableFuture<Void>` que é concluído após executar a ação fornecida com o resultado deste `CompletableFuture`.
    - **Uso:** Consumir o resultado, sem retornar um novo valor. Para efeitos colaterais.
- `CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action)`
- `CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action, Executor executor)`
    - **Função:** Versões assíncronas do `thenAccept`.
- `CompletableFuture<Void> thenRun(Runnable action)`
    - **Função:** Retorna um novo `CompletableFuture<Void>` que é concluído após executar a ação fornecida. Não recebe o resultado da fase anterior.
    - **Uso:** Executar uma ação *depois* que o `CompletableFuture` anterior for concluído, independentemente do seu resultado.
- `CompletableFuture<Void> thenRunAsync(Runnable action)`
- `CompletableFuture<Void> thenRunAsync(Runnable action, Executor executor)`
    - **Função:** Versões assíncronas do `thenRun`.

**Composição de `CompletableFuture`s (Composition Methods):**

Estes métodos são para encadear operações onde a próxima operação também retorna um `CompletableFuture`.

- `<U> CompletableFuture<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn)`
    - **Função:** Semelhante a `thenApply`, mas a função `fn` retorna outro `CompletionStage` (geralmente um `CompletableFuture`). O `CompletableFuture` resultante é achatado, evitando `CompletableFuture<CompletableFuture<U>>`.
    - **Uso:** Quando a próxima etapa do pipeline também é uma operação assíncrona.
    - **Exemplo:** Buscar usuário, e depois buscar seus pedidos (ambas operações são assíncronas).
- `<U, V> CompletableFuture<V> thenCombine(CompletionStage<? extends U> other, BiFunction<? super T, ? super U, ? extends V> fn)`
    - **Função:** Combina os resultados deste `CompletableFuture` e de outro `CompletionStage` usando a função `BiFunction` fornecida. Ambos devem ser concluídos para que a combinação ocorra.
    - **Uso:** Quando você precisa de dois resultados de operações assíncronas independentes para realizar uma terceira operação.
- `static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs)`
    - **Função:** Retorna um novo `CompletableFuture<Void>` que é concluído quando *todos* os `CompletableFuture`s fornecidos são concluídos. Se qualquer um dos `CompletableFuture`s falhar, o `allOf` também falhará.
    - **Uso:** Executar várias tarefas assíncronas em paralelo e esperar que todas terminem.
- `static CompletableFuture<Object> anyOf(CompletableFuture<?>... cfs)`
    - **Função:** Retorna um novo `CompletableFuture<Object>` que é concluído quando *qualquer um* dos `CompletableFuture`s fornecidos é concluído (seja com sucesso ou falha). O resultado é o resultado do primeiro que foi concluído.
    - **Uso:** Executar várias tarefas em paralelo e usar o resultado da primeira que estiver pronta.

**Tratamento de Exceções:**

- `CompletableFuture<T> exceptionally(Function<Throwable, ? extends T> fn)`
    - **Função:** Permite recuperar de uma exceção. Se o `CompletableFuture` anterior falhar, a função `fn` é executada com a exceção como argumento, e o `CompletableFuture` resultante será concluído com o valor retornado por `fn`. Se o `CompletableFuture` anterior for bem-sucedido, este método não tem efeito.
    - **Uso:** Fornecer um valor padrão ou uma forma de tratamento de erro quando uma operação assíncrona falha.
- `<U> CompletableFuture<U> handle(BiFunction<? super T, Throwable, ? extends U> fn)`
    - **Função:** Permite tratar tanto o sucesso quanto a falha da fase anterior. A função `fn` recebe o resultado (se sucesso) e a exceção (se falha), sendo que um deles será `null`.
    - **Uso:** Um ponto de tratamento genérico que é sempre executado, independentemente do sucesso ou falha.

**Finalização:**

- `CompletableFuture<T> whenComplete(BiConsumer<? super T, ? super Throwable> action)`
    - **Função:** Executa uma ação quando este `CompletableFuture` é concluído, seja com sucesso ou com falha. A ação recebe o resultado e a exceção (um dos quais será `null`). O `CompletableFuture` resultante é o mesmo `CompletableFuture` original, o que significa que o resultado ou exceção não são modificados por este método.
    - **Uso:** Para efeitos colaterais, como logging ou limpeza de recursos, independentemente do resultado final.

**Obtenção de Resultados (Blocking Methods):**

Embora o objetivo principal do `CompletableFuture` seja a programação não bloqueante, às vezes é necessário obter o resultado de forma síncrona.

- `T get()`
    - **Função:** Espera se necessário para que este `CompletableFuture` seja concluído, e então retorna seu resultado.
    - **Restrições:** Este método é bloqueante. Lança `InterruptedException` se o thread atual for interrompido enquanto aguarda, e `ExecutionException` se a computação subjacente lançou uma exceção.
    - **Uso:** Usar com cautela para evitar bloqueios desnecessários em threads de alta performance.
- `T join()`
    - **Função:** Semelhante a `get()`, mas é uma versão não-checked exception. Ele também espera se necessário para que este `CompletableFuture` seja concluído e então retorna seu resultado.
    - **Restrições:** Lança `CompletionException` se a computação subjacente lançou uma exceção.
    - **Uso:** Preferível a `get()` em muitos cenários porque não exige tratamento de `InterruptedException`, tornando o código mais limpo. Ainda é bloqueante.

### Controle de Thread Pools

Por padrão, `CompletableFuture` utiliza o `ForkJoinPool.commonPool()` para a execução de suas tarefas assíncronas. Embora conveniente, este pool de threads é compartilhado por toda a JVM e é otimizado para tarefas computacionais (CPU-bound). Para operações de I/O-bound (como chamadas de rede ou banco de dados), onde o thread passa muito tempo esperando, o `commonPool()` pode não ser a melhor escolha e pode até se tornar um gargalo.

- `ForkJoinPool.commonPool()`: É o pool de threads padrão e é adequado para a maioria das operações computacionais rápidas.
- **`Executor` personalizado:** Para operações de I/O-bound ou para isolar o workload, é altamente recomendável criar e usar um `ExecutorService` customizado. Isso permite otimizar o número de threads e o comportamento do pool para o tipo específico de tarefa.
    
    ```java
    ExecutorService customExecutor = Executors.newFixedThreadPool(10);
    CompletableFuture.supplyAsync(() -> performIoOperation(), customExecutor)
                     .thenApplyAsync(result -> processResult(result), customExecutor)
                     .thenAccept(finalResult -> saveResult(finalResult));
    
    ```
    
    Lembre-se de sempre desligar (`shutdown()`) seus `ExecutorService`s personalizados quando não forem mais necessários para liberar os recursos.
    

### Restrições e Considerações de Uso

- **Evitar Bloqueio:** O maior erro é chamar `get()` ou `join()` em um `CompletableFuture` em um thread que deve ser não-bloqueante (como um thread de requisição HTTP em um servidor reativo). Isso anula os benefícios do `CompletableFuture`.
- **Tratamento de Exceções:** Sempre inclua tratamento de exceções (com `exceptionally` ou `handle`) para garantir que seu pipeline assíncrono seja robusto. Exceções não tratadas em um `CompletableFuture` podem ser silenciosas até que `get()` ou `join()` sejam chamados.
- **Contexto de Execução:** Seja explícito sobre o `Executor` usado, especialmente para tarefas de I/O-bound, para evitar a sobrecarga do `ForkJoinPool.commonPool()` e melhorar o desempenho.
- **Debugging:** Depurar pipelines assíncronos pode ser mais complexo devido à natureza não linear da execução. Ferramentas de profiling e bons logs são essenciais.
- **Cuidado com `allOff().join()`:** Embora conveniente, `allOf().join()` pode mascarar qual dos `CompletableFuture`s falhou se houver uma exceção. Para um tratamento de erro mais granular, você pode mapear os resultados e exceções individualmente.

### 4\. Exemplos de Código Otimizados

Aqui estão alguns exemplos para ilustrar o uso de `CompletableFuture` em cenários comuns de Backend, Gedê.

### Exemplo 1: Execução Simples de Tarefa Assíncrona

Simula uma operação que leva tempo (e.g., uma requisição HTTP ou consulta a banco de dados).

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class AsyncOperation {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();
        System.out.println("Main thread: Iniciando a operação assíncrona...");

        // Usando supplyAsync para uma tarefa que retorna um valor
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("  Async task: Simulating long running operation...");
                TimeUnit.SECONDS.sleep(2); // Simula uma operação demorada (e.g., chamada de API)
                System.out.println("  Async task: Operation finished.");
                return "Dados Processados!";
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
        });

        // O thread principal pode continuar fazendo outras coisas
        System.out.println("Main thread: Fazendo outras coisas enquanto a tarefa assíncrona executa...");
        // ... (outras operações síncronas) ...

        // Bloqueia para obter o resultado (idealmente, evite em threads reativos)
        String result = future.get(); // Bloqueia até o resultado estar disponível
        System.out.println("Main thread: Resultado da operação assíncrona: " + result);

        long end = System.currentTimeMillis();
        System.out.println("Main thread: Total time: " + (end - start) + " ms");
    }
}

```

**Caso de Uso Real:** Você tem um endpoint que precisa buscar dados de um serviço externo. Em vez de bloquear o thread da requisição, você pode iniciar a busca assincronamente e devolver o `CompletableFuture` ou processá-lo posteriormente.

### Exemplo 2: Encadeamento de Operações (`thenApply` e `thenCompose`)

Simula um cenário onde a saída de uma operação assíncrona é a entrada para outra.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChainingOperations {

    private static final ExecutorService executor = Executors.newFixedThreadPool(5); // Pool customizado

    // Simula uma busca de usuário por ID
    public static CompletableFuture<String> fetchUserById(long userId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("  -> Fetching user " + userId + " on thread: " + Thread.currentThread().getName());
                TimeUnit.MILLISECONDS.sleep(500); // Simula atraso da DB
                return "User_" + userId + "_Profile";
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
        }, executor); // Usando nosso executor customizado
    }

    // Simula uma busca de pedidos para um perfil de usuário
    public static CompletableFuture<String> fetchOrdersForUserProfile(String userProfile) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("  -> Fetching orders for " + userProfile + " on thread: " + Thread.currentThread().getName());
                TimeUnit.MILLISECONDS.sleep(700); // Simula atraso de outro serviço
                return "Orders_for_" + userProfile.replace("_Profile", "");
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
        }, executor);
    }

    // Simula o processamento final dos dados
    public static String processFinalData(String orders) {
        System.out.println("  -> Processing final data for " + orders + " on thread: " + Thread.currentThread().getName());
        return "Final_Report_of_" + orders;
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();
        System.out.println("Main thread: Iniciando pipeline assíncrono...");

        CompletableFuture<String> finalResultFuture = fetchUserById(123)
            .thenCompose(userProfile -> fetchOrdersForUserProfile(userProfile)) // thenCompose para encadear CF
            .thenApply(orders -> processFinalData(orders)); // thenApply para transformar o resultado

        System.out.println("Main thread: Pipeline iniciado. Fazendo outras coisas...");

        String finalReport = finalResultFuture.join(); // join() para obter o resultado (ainda bloqueante)
        System.out.println("Main thread: Relatório final: " + finalReport);

        long end = System.currentTimeMillis();
        System.out.println("Main thread: Total time: " + (end - start) + " ms");

        executor.shutdown(); // Importante: desligar o executor
    }
}

```

**Caso de Uso Real:** Um endpoint que precisa primeiro buscar os detalhes de um usuário no banco de dados e, em seguida, usar esses detalhes para chamar um serviço de e-commerce que retorna os pedidos daquele usuário. `thenCompose` é ideal porque ambas as etapas (`fetchUserById` e `fetchOrdersForUserProfile`) retornam `CompletableFuture`s.

### Exemplo 3: Composição de Múltiplos `CompletableFuture`s (`thenCombine` e `allOf`)

Simula operações independentes que precisam ser combinadas no final.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ComposingFutures {

    private static final ExecutorService executor = Executors.newFixedThreadPool(5);

    // Simula busca de preço de um produto
    public static CompletableFuture<Double> getProductPrice(String productId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("  -> Getting price for " + productId + " on thread: " + Thread.currentThread().getName());
                TimeUnit.SECONDS.sleep(1);
                return 199.99; // Preço fixo para exemplo
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
        }, executor);
    }

    // Simula busca de estoque de um produto
    public static CompletableFuture<Integer> getProductStock(String productId) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("  -> Getting stock for " + productId + " on thread: " + Thread.currentThread().getName());
                TimeUnit.SECONDS.sleep(1);
                return 150; // Estoque fixo para exemplo
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
        }, executor);
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        long start = System.currentTimeMillis();
        System.out.println("Main thread: Iniciando composição de futures...");

        String productId = "XYZ789";

        // thenCombine: Quando você precisa de dois resultados independentes para calcular um terceiro
        CompletableFuture<String> combinedFuture = getProductPrice(productId)
            .thenCombine(getProductStock(productId), (price, stock) -> {
                System.out.println("  -> Combining price and stock on thread: " + Thread.currentThread().getName());
                return String.format("Product %s: Price = $%.2f, Stock = %d", productId, price, stock);
            });

        System.out.println("Main thread: Chamadas combinadas iniciadas. Fazendo outras coisas...");

        // allOf: Quando você precisa esperar por múltiplos futures, mas não necessariamente combiná-los
        CompletableFuture<Void> allFutures = CompletableFuture.allOf(
            getProductPrice("ABC123"), // Apenas para demonstrar allOf
            getProductStock("DEF456")  // Apenas para demonstrar allOf
        );

        allFutures.join(); // Espera que as duas chamadas allOf terminem
        System.out.println("Main thread: Todas as chamadas de allOf terminaram.");

        System.out.println("Main thread: Resultado combinado: " + combinedFuture.join());

        long end = System.currentTimeMillis();
        System.out.println("Main thread: Total time: " + (end - start) + " ms");

        executor.shutdown();
    }
}

```

**Caso de Uso Real:** Um endpoint que precisa exibir detalhes de um produto, e para isso, busca o preço de um serviço e o estoque de outro, ambos em paralelo. `thenCombine` é perfeito para unir esses dois resultados. `allOf` seria usado se você precisasse apenas garantir que várias operações independentes fossem concluídas antes de prosseguir, sem necessariamente combinar seus resultados diretamente.

### Exemplo 4: Tratamento de Erros (`exceptionally` e `handle`)

Demonstra como lidar com falhas no pipeline assíncrono.

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ErrorHandlingCompletableFuture {

    private static final ExecutorService executor = Executors.newFixedThreadPool(5);

    // Simula uma operação que pode falhar
    public static CompletableFuture<String> riskyOperation(String input, boolean shouldFail) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                System.out.println("  -> Executing risky operation with input: " + input + " on thread: " + Thread.currentThread().getName());
                TimeUnit.SECONDS.sleep(1);
                if (shouldFail) {
                    throw new RuntimeException("Falha simulada na operação!");
                }
                return "Sucesso com " + input;
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
        }, executor);
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println("--- Cenário 1: Operação com Sucesso ---");
        CompletableFuture<String> successFuture = riskyOperation("data1", false)
            .thenApply(result -> "Processado: " + result)
            .exceptionally(ex -> {
                System.err.println("  -> Error occurred (exceptionally): " + ex.getMessage());
                return "Falha ao processar data1"; // Retorna um valor de fallback
            })
            .whenComplete((res, ex) -> {
                if (ex != null) {
                    System.out.println("  -> WhenComplete for data1: Falha com exceção: " + ex.getMessage());
                } else {
                    System.out.println("  -> WhenComplete for data1: Concluído com sucesso: " + res);
                }
            });

        System.out.println("Resultado do sucesso: " + successFuture.join());
        System.out.println("\\n--- Cenário 2: Operação com Falha ---");

        CompletableFuture<String> failureFuture = riskyOperation("data2", true)
            .thenApply(result -> "Processado: " + result) // Este bloco não será executado em caso de falha
            .exceptionally(ex -> {
                System.err.println("  -> Error occurred (exceptionally): " + ex.getMessage());
                return "Falha ao processar data2"; // Retorna um valor de fallback
            })
            .whenComplete((res, ex) -> {
                if (ex != null) {
                    System.out.println("  -> WhenComplete for data2: Falha com exceção: " + ex.getMessage());
                } else {
                    System.out.println("  -> WhenComplete for data2: Concluído com sucesso: " + res);
                }
            });

        System.out.println("Resultado da falha: " + failureFuture.join());
        System.out.println("\\n--- Cenário 3: Usando handle para tratar sucesso e falha ---");

        CompletableFuture<String> handleFuture = riskyOperation("data3", true)
            .handle((result, ex) -> { // O handle sempre executa
                if (ex != null) {
                    System.err.println("  -> Handle method: Exceção capturada: " + ex.getMessage());
                    return "Erro tratado no handle: " + ex.getMessage();
                } else {
                    System.out.println("  -> Handle method: Sucesso com resultado: " + result);
                    return "Resultado tratado no handle: " + result;
                }
            });

        System.out.println("Resultado do handle: " + handleFuture.join());

        executor.shutdown();
    }
}

```

**Caso de Uso Real:** Em um microsserviço, uma chamada a uma API externa pode falhar. Usar `exceptionally` permite que você forneça um valor padrão ou uma lógica de fallback (e.g., buscar de um cache), mantendo o pipeline funcionando. `handle` é útil para logging ou para padronizar a saída, independentemente do sucesso ou falha da operação.

### 5\. Informações Adicionais

### `CompletableFuture` e Programação Reativa

`CompletableFuture` é um pilar da programação reativa em Java, juntamente com a Streams API. Ele permite a construção de fluxos de dados assíncronos e não bloqueantes, onde os consumidores reagem aos eventos à medida que ocorrem, em vez de ficarem esperando ativamente. Embora não seja um framework reativo completo como Reactor ou RxJava, ele fornece os blocos de construção essenciais para esse estilo de programação. Frameworks como Spring WebFlux utilizam extensivamente `CompletableFuture` (ou suas alternativas como `Mono` e `Flux` do Reactor) para construir APIs reativas.

### Projeto Loom e Virtual Threads (Java 21+)

É importante mencionar o Projeto Loom (agora parte do Java 21+), que introduziu as Virtual Threads (Threads Virtuais). As Virtual Threads são threads leves gerenciadas pela JVM que mapeiam para um número muito menor de threads da plataforma (OS threads). O objetivo principal das Virtual Threads é simplificar a programação concorrente, permitindo que os desenvolvedores escrevam código bloqueante de forma síncrona (e, portanto, mais fácil de ler e depurar), enquanto a JVM se encarrega de multiplexar eficientemente essas operações bloqueantes em threads da plataforma.

Como isso se relaciona com `CompletableFuture`?
Enquanto `CompletableFuture` é excelente para compor operações assíncronas de forma não-bloqueante, ele ainda lida com a complexidade de gerenciar `Executor`s e callbacks. Com as Virtual Threads, muitas operações que hoje seriam otimizadas com `CompletableFuture` podem ser escritas de forma síncrona (bloqueante) usando `Thread.sleep()`, `BufferedReader.readLine()`, etc., e ainda assim escalar eficientemente porque o "bloqueio" da Virtual Thread não bloqueia um thread da plataforma caro.

Isso não torna `CompletableFuture` obsoleto, Gedê. Ele ainda será valioso para:

- **Composição de Operações de Diferentes Fontes:** Combinar resultados de várias chamadas assíncronas de forma elegante.
- **Controle de Tempo:** Operações com timeouts ou que precisam ser canceladas.
- **APIs Orientadas a Eventos:** Quando você está lidando com eventos em tempo real.
- **Tratamento de Exceções em Cadeias:** Onde a lógica de fallback e recuperação é complexa.

O Loom e as Virtual Threads visam simplificar a escrita de código concorrente, tornando a assincronicidade um detalhe de implementação em vez de um modelo de programação explícito para muitas tarefas. No entanto, `CompletableFuture` continua sendo uma ferramenta poderosa para a construção de pipelines complexos e para cenários onde o controle explícito sobre a assincronicidade é benéfico.

### 6\. Referências para Estudo Independente

Para se aprofundar ainda mais neste tópico crucial, Gedê, sugiro os seguintes recursos:

- **Documentação Oficial da Oracle/OpenJDK:**
    - `CompletableFuture` Javadoc: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html) (Este é o ponto de partida definitivo para todos os métodos e suas nuances).
    - Pacote `java.util.concurrent`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
- **Artigos e Tutoriais:**
    - **Baeldung:** "Guide to Java 8 CompletableFuture": [https://www.baeldung.com/java-completablefuture](https://www.baeldung.com/java-completablefuture) (Excelente recurso com muitos exemplos práticos e explicações claras).
    - **Reflectoring:** "CompletableFutures in Java": [https://reflectoring.io/completablefutures-in-java/](https://reflectoring.io/completablefutures-in-java/) (Outro bom artigo com foco em casos de uso e melhores práticas).
    - **Oracle Java Magazine:** Procure por artigos sobre "Asynchronous Programming" e "CompletableFuture" para insights mais profundos.
- **Livros:**
    - "Java Concurrency in Practice" de Brian Goetz et al. (Embora mais antigo que Java 8, os princípios de concorrência são atemporais e fundamentais para entender o contexto do `CompletableFuture`).
    - "Modern Java in Action" de Raoul-Gabriel Urma, Mario Fusco, Alan Mycroft (Abrange Java 8 e posteriores, incluindo `CompletableFuture` e Streams).
- **Vídeos/Cursos:**
    - Procure por tutoriais no YouTube de canais renomados sobre Java (e.g., SpringOne, Devoxx talks) que abordem `CompletableFuture` e programação assíncrona.

Ao estudar, Gedê, preste atenção especial aos cenários de uso de cada método, como `thenApply` vs. `thenCompose`, e o impacto dos `Executor`s customizados. A prática com diferentes exemplos e a criação de seus próprios cenários assíncronos em projetos pessoais ajudarão a solidificar seu entendimento.

Se precisar de mais alguma explicação, A.R.I.A está aqui\!