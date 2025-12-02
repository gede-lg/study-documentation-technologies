# Atomic classes (AtomicInteger, AtomicLong, etc.)

Com certeza, Gedê\! Vamos mergulhar nas classes atômicas em Java, um tópico super importante para quem trabalha com concorrência e busca otimizar o desempenho em aplicações backend, como você.

## Classes Atômicas em Java (AtomicInteger, AtomicLong, etc.)

### 1\. Introdução

No desenvolvimento de sistemas concorrentes, onde múltiplas threads acessam e modificam os mesmos dados simultaneamente, garantir a consistência e a integridade desses dados é um dos maiores desafios. Sem o tratamento adequado, operações aparentemente simples, como incrementar um contador, podem levar a resultados incorretos devido a "race conditions" (condições de corrida).

Tradicionalmente, a sincronização em Java é alcançada usando a palavra-chave `synchronized` ou `Locks` (como `ReentrantLock`). Embora eficazes, esses mecanismos podem introduzir sobrecarga (overhead) devido ao bloqueio e desbloqueio de threads, o que pode impactar o desempenho, especialmente em cenários de alta concorrência.

É nesse contexto que as classes atômicas do pacote `java.util.concurrent.atomic` se tornam extremamente relevantes. Elas fornecem operações atômicas em variáveis simples, o que significa que essas operações são executadas de forma indivisível, sem a possibilidade de interrupção por outras threads. Isso garante a consistência dos dados sem a necessidade de bloqueios explícitos na maioria dos casos, resultando em um desempenho superior em muitas situações concorrentes.

**Definição e Conceitos Fundamentais:**

As **classes atômicas** em Java são um conjunto de classes que fornecem operações atômicas em variáveis de um único valor. "Atômico" aqui significa que a operação é garantida para ser executada completamente, sem ser interrompida por outras operações ou threads. Isso elimina as condições de corrida para operações em variáveis simples, como incrementos, decrementos e atualizações condicionais.

Elas são construídas sobre operações de baixo nível conhecidas como **CAS (Compare-and-Swap)**. Em vez de bloquear uma thread (como `synchronized` faz), a operação CAS tenta atualizar um valor em uma localização de memória apenas se o valor atual for igual a um valor esperado. Se a condição for verdadeira, a atualização é realizada. Se não for, a operação falha, e a thread pode tentar novamente ou tomar outra ação. Isso permite que a atualização de variáveis seja feita de forma **não-bloqueante** (lock-free), o que pode ser mais eficiente que a sincronização baseada em bloqueio em muitos cenários.

As principais classes atômicas incluem:

- `AtomicBoolean`: Para operações atômicas em um valor booleano.
- `AtomicInteger`: Para operações atômicas em um valor `int`.
- `AtomicLong`: Para operações atômicas em um valor `long`.
- `AtomicReference<V>`: Para operações atômicas em uma referência a um objeto.
- `AtomicIntegerArray`, `AtomicLongArray`, `AtomicReferenceArray`: Para operações atômicas em elementos de arrays.
- `AtomicStampedReference`, `AtomicMarkableReference`: Versões mais avançadas de `AtomicReference` que lidam com o problema ABA.
- `LongAdder`, `DoubleAdder`, `LongAccumulator`, `DoubleAccumulator`: Classes para somar valores concorrentemente, otimizadas para cenários com alta contenção de escrita.

Essas classes são projetadas para serem usadas quando você precisa de contadores atômicos, flags booleanas, ou referências a objetos que precisam ser atualizadas de forma segura por múltiplas threads sem a penalidade de desempenho de bloqueios explícitos.

### 2\. Sumário

- **Introdução às Classes Atômicas**
    - Problemas de concorrência e a necessidade de operações atômicas
    - O conceito de CAS (Compare-and-Swap)
- **Principais Classes Atômicas**
    - `AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference`
- **Métodos Comuns das Classes Atômicas**
    - `get()`, `set()`, `getAndSet()`
    - `incrementAndGet()`, `decrementAndGet()`
    - `getAndIncrement()`, `getAndDecrement()`
    - `addAndGet()`
    - `compareAndSet()` (CAS)
    - `weakCompareAndSet()`
    - `updateAndGet()`, `accumulateAndGet()`
- **Restrições de Uso e Quando Usar**
- **Exemplos de Código Otimizados**
    - Contador concorrente simples
    - Atualização de referência de objeto
    - Implementando um singleton thread-safe
    - Exemplo de CAS manual
- **Informações Adicionais**
    - Problema ABA e soluções (`AtomicStampedReference`, `AtomicMarkableReference`)
    - `LongAdder` e `LongAccumulator` para contadores de alto volume
    - Trade-offs: `synchronized` vs. Atomic
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Principais Classes Atômicas

Vamos focar nas classes atômicas mais comumente usadas:

- **`AtomicInteger`**: Opera em um valor `int`. Perfeito para contadores, IDs sequenciais, ou qualquer lógica que precise de um `int` atualizado atomicamente.
- **`AtomicLong`**: Similar ao `AtomicInteger`, mas opera em um valor `long`. Útil para contadores maiores ou timestamps atômicos.
- **`AtomicBoolean`**: Opera em um valor `boolean`. Ideal para flags que indicam o estado de uma operação concorrente (ex: "já foi inicializado?").
- **`AtomicReference<V>`**: Opera em uma referência de objeto de tipo `V`. Permite a atualização atômica de referências a objetos, útil para implementar estruturas de dados não-bloqueantes ou gerenciar configurações.

### Métodos Comuns das Classes Atômicas

As classes atômicas (`AtomicInteger`, `AtomicLong`, `AtomicBoolean`, `AtomicReference`) compartilham um conjunto de métodos core que implementam as operações atômicas.

- `T get()`
    - **Função:** Retorna o valor atual da variável atômica.
    - **Observação:** Garante visibilidade (happens-before relationship) com as operações anteriores.
- `void set(T newValue)`
    - **Função:** Define o valor da variável atômica para `newValue`.
    - **Observação:** Garante visibilidade para as operações subsequentes.
- `T getAndSet(T newValue)`
    - **Função:** Define o valor para `newValue` e retorna o valor **anterior**.
    - **Atomicity:** Esta operação é atômica.
- `T incrementAndGet()` (somente para `AtomicInteger`, `AtomicLong`)
    - **Função:** Incrementa o valor em um e retorna o valor **atualizado**.
    - **Atomicity:** Esta operação é atômica.
- `T decrementAndGet()` (somente para `AtomicInteger`, `AtomicLong`)
    - **Função:** Decrementa o valor em um e retorna o valor **atualizado**.
    - **Atomicity:** Esta operação é atômica.
- `T getAndIncrement()` (somente para `AtomicInteger`, `AtomicLong`)
    - **Função:** Incrementa o valor em um e retorna o valor **anterior**.
    - **Atomicity:** Esta operação é atômica.
- `T getAndDecrement()` (somente para `AtomicInteger`, `AtomicLong`)
    - **Função:** Decrementa o valor em um e retorna o valor **anterior**.
    - **Atomicity:** Esta operação é atômica.
- `T addAndGet(T delta)` (somente para `AtomicInteger`, `AtomicLong`)
    - **Função:** Adiciona `delta` ao valor atual e retorna o valor **atualizado**.
    - **Atomicity:** Esta operação é atômica.
- `boolean compareAndSet(T expectedValue, T newValue)`
    - **Função:** É o coração das operações CAS. Define o valor para `newValue` **apenas se** o valor atual for igual a `expectedValue`.
    - **Parâmetros:**
        - `expectedValue`: O valor que se espera que a variável atômica tenha.
        - `newValue`: O novo valor a ser definido se `expectedValue` corresponder ao valor atual.
    - **Retorno:** `true` se o valor foi atualizado (o CAS foi bem-sucedido), `false` caso contrário.
    - **Atomicity:** Esta operação é atômica. As threads geralmente repetem a operação até que o CAS seja bem-sucedido, o que é conhecido como um "spin loop".
- `boolean weakCompareAndSet(T expectedValue, T newValue)`
    - **Função:** Similar a `compareAndSet`, mas pode falhar e retornar `false` mesmo que o valor atual seja igual a `expectedValue`, especialmente em arquiteturas com pouca memória.
    - **Restrições:** Raramente usado diretamente, geralmente em algoritmos de loop interno onde uma falha espúria é aceitável e a performance é crítica. Fornece menos garantias de ordenamento de memória do que `compareAndSet`.
- `T updateAndGet(UnaryOperator<T> updateFunction)` (disponível a partir do Java 8)
    - **Função:** Atualiza atomicamente o valor atual com o resultado de aplicar a função `updateFunction`, e retorna o valor **atualizado**.
    - **Parâmetro:** `updateFunction`: Uma função que recebe o valor atual e retorna o novo valor.
    - **Observação:** O método `updateAndGet` executa a função de atualização repetidamente até que a atualização seja bem-sucedida usando um mecanismo CAS interno. Isso permite operações atômicas mais complexas do que simples incrementos/decrementos.
- `T accumulateAndGet(T x, BinaryOperator<T> accumulatorFunction)` (disponível a partir do Java 8)
    - **Função:** Atualiza atomicamente o valor atual com o resultado de aplicar a função `accumulatorFunction` ao valor atual e ao valor fornecido `x`, e retorna o valor **atualizado**.
    - **Parâmetros:**
        - `x`: O valor a ser combinado com o valor atual.
        - `accumulatorFunction`: Uma função que recebe o valor atual e `x` e retorna o novo valor.
    - **Observação:** Similar a `updateAndGet`, mas para operações binárias.

### Restrições de Uso e Quando Usar

**Quando usar classes atômicas:**

- **Contadores de alto volume:** Quando você tem um contador que é incrementado ou decrementado por muitas threads. `AtomicInteger` e `AtomicLong` são mais eficientes que `synchronized` neste caso.
- **Flags de estado:** Para variáveis booleanas que controlam o fluxo de execução entre threads. `AtomicBoolean` é a escolha ideal.
- **Gerenciamento de referências:** Quando você precisa trocar uma referência a um objeto de forma atômica. `AtomicReference` é perfeito para isso.
- **Construção de estruturas de dados não-bloqueantes:** Classes atômicas são os blocos de construção para algoritmos concurrentes lock-free.
- **Redução de contenção:** Em cenários onde `synchronized` causa muitos bloqueios e degrada o desempenho.

**Restrições e quando não usar:**

- **Não são um substituto geral para `synchronized` ou `Locks`:** As classes atômicas garantem a atomicidade de *uma única operação* em *uma única variável*. Se você precisa que múltiplas operações em múltiplas variáveis sejam atômicas *em conjunto* (uma transação), você ainda precisará de `synchronized` ou `Locks`.
- **Não resolvem problemas de ordenamento de memória complexos por si só:** Embora garantam visibilidade para a variável atômica, o impacto nas operações que não são atômicas pode ser mais complexo.
- **Sobrecarga para operações simples sem concorrência:** Se a variável não é acessada por múltiplas threads, usar classes atômicas adiciona uma pequena sobrecarga desnecessária.
- **Problema ABA:** Um valor pode mudar de A para B e depois voltar para A. Se você usar apenas `compareAndSet`, pode parecer que o valor nunca mudou, mas na verdade ele foi modificado e restaurado. Para casos onde o histórico de alterações importa, `AtomicStampedReference` ou `AtomicMarkableReference` são necessários.

### 4\. Exemplos de Código Otimizados

Vamos ver alguns exemplos práticos que ilustram o uso das classes atômicas.

### Exemplo 1: Contador Concorrente Simples

Este é o caso de uso mais clássico, onde `AtomicInteger` brilha em comparação com um `int` comum com `synchronized`.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounterExample {

    // Usando int com synchronized para comparação
    private static int synchronizedCounter = 0;
    private static final Object lock = new Object();

    // Usando AtomicInteger
    private static AtomicInteger atomicCounter = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        int numberOfThreads = 10;
        int incrementsPerThread = 100000;

        System.out.println("--- Teste com int e synchronized ---");
        synchronizedCounter = 0; // Reset para o teste
        ExecutorService executorSync = Executors.newFixedThreadPool(numberOfThreads);
        long startTimeSync = System.nanoTime();

        for (int i = 0; i < numberOfThreads; i++) {
            executorSync.submit(() -> {
                for (int j = 0; j < incrementsPerThread; j++) {
                    synchronized (lock) {
                        synchronizedCounter++;
                    }
                }
            });
        }
        executorSync.shutdown();
        executorSync.awaitTermination(1, TimeUnit.MINUTES);
        long endTimeSync = System.nanoTime();
        System.out.println("Valor final com synchronized: " + synchronizedCounter);
        System.out.println("Tempo com synchronized: " + (endTimeSync - startTimeSync) / 1_000_000 + " ms\\n");

        System.out.println("--- Teste com AtomicInteger ---");
        atomicCounter.set(0); // Reset para o teste
        ExecutorService executorAtomic = Executors.newFixedThreadPool(numberOfThreads);
        long startTimeAtomic = System.nanoTime();

        for (int i = 0; i < numberOfThreads; i++) {
            executorAtomic.submit(() -> {
                for (int j = 0; j < incrementsPerThread; j++) {
                    atomicCounter.incrementAndGet(); // Operação atômica
                }
            });
        }
        executorAtomic.shutdown();
        executorAtomic.awaitTermination(1, TimeUnit.MINUTES);
        long endTimeAtomic = System.nanoTime();
        System.out.println("Valor final com AtomicInteger: " + atomicCounter.get());
        System.out.println("Tempo com AtomicInteger: " + (endTimeAtomic - startTimeAtomic) / 1_000_000 + " ms");

        // O resultado esperado para ambos é numberOfThreads * incrementsPerThread
        // No entanto, o AtomicInteger será significativamente mais rápido na maioria dos ambientes.
    }
}

```

**Explicação do Exemplo:**

- Com `synchronized`, cada thread precisa adquirir um lock para incrementar o contador. Isso pode levar a uma contenção significativa, onde threads precisam esperar por outras para liberar o lock.
- Com `AtomicInteger`, o método `incrementAndGet()` usa a instrução CAS internamente. As threads tentam atualizar o valor sem bloquear. Se uma thread falhar na tentativa de atualização (porque outra thread modificou o valor antes dela), ela simplesmente tenta novamente. Isso reduz a contenção e melhora o desempenho em cenários de alta concorrência.

### Exemplo 2: Atualização de Referência de Objeto com `AtomicReference`

Imagine que você tem uma configuração que pode ser atualizada dinamicamente por várias threads. `AtomicReference` garante que a troca da referência seja atômica.

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

class Configuration {
    private String setting1;
    private int setting2;

    public Configuration(String setting1, int setting2) {
        this.setting1 = setting1;
        this.setting2 = setting2;
    }

    public String getSetting1() { return setting1; }
    public int getSetting2() { return setting2; }

    @Override
    public String toString() {
        return "Configuration{" +
               "setting1='" + setting1 + '\\'' +
               ", setting2=" + setting2 +
               '}';
    }
}

public class AtomicReferenceExample {
    // A configuração atual do sistema, que pode ser atualizada por threads diferentes
    private static AtomicReference<Configuration> currentConfig =
            new AtomicReference<>(new Configuration("Default", 0));

    public static void main(String[] args) throws InterruptedException {
        int numberOfUpdaters = 5;
        ExecutorService executor = Executors.newFixedThreadPool(numberOfUpdaters);

        System.out.println("Configuração inicial: " + currentConfig.get());

        for (int i = 0; i < numberOfUpdaters; i++) {
            final int threadId = i;
            executor.submit(() -> {
                for (int j = 0; j < 3; j++) { // Cada thread tenta atualizar 3 vezes
                    Configuration oldConfig = currentConfig.get();
                    Configuration newConfig = new Configuration(
                            "Updated by " + threadId + "-" + j,
                            oldConfig.getSetting2() + 1
                    );
                    // Tenta atualizar a referência se o valor atual for o esperado
                    if (currentConfig.compareAndSet(oldConfig, newConfig)) {
                        System.out.println("Thread " + threadId + ": Configuração atualizada para: " + newConfig);
                    } else {
                        System.out.println("Thread " + threadId + ": Falha ao atualizar, tentando novamente. Configuração atual: " + currentConfig.get());
                    }
                    try {
                        Thread.sleep(100); // Simula algum trabalho
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            });
        }

        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.MINUTES);

        System.out.println("\\nConfiguração final: " + currentConfig.get());
    }
}

```

**Explicação do Exemplo:**

- Múltiplas threads tentam atualizar a `currentConfig`.
- O método `compareAndSet(oldConfig, newConfig)` é crucial. Ele garante que a nova configuração só seja definida se a `currentConfig` não tiver sido alterada por outra thread desde a última vez que a thread atual a leu (`oldConfig`).
- Se o `compareAndSet` retornar `false`, significa que outra thread já atualizou a configuração. A thread atual pode então reler o valor atual e tentar novamente (ou abortar, dependendo da lógica). Isso garante que nenhuma atualização seja perdida e que o estado seja sempre consistente.

### Exemplo 3: Implementando um Singleton Thread-Safe com `AtomicReference`

Uma forma elegante de implementar um Singleton lazy-initialized e thread-safe sem a necessidade de `synchronized` no método `getInstance()` é usar `AtomicReference`.

```java
import java.util.concurrent.atomic.AtomicReference;

public class ThreadSafeSingleton {

    private static final AtomicReference<ThreadSafeSingleton> INSTANCE = new AtomicReference<>();

    private String message;

    private ThreadSafeSingleton(String msg) {
        // Construtor privado para impedir instanciacao externa
        this.message = msg;
        System.out.println("Singleton instance created with message: " + msg);
    }

    public static ThreadSafeSingleton getInstance(String msg) {
        // Loop até que a instância seja criada e definida atomicamente
        ThreadSafeSingleton currentInstance;
        do {
            currentInstance = INSTANCE.get(); // Pega a referencia atual
            if (currentInstance != null) {
                // Se já existe, retorna a instancia existente
                return currentInstance;
            }
            // Se nao existe, tenta criar uma nova instancia
            ThreadSafeSingleton newInstance = new ThreadSafeSingleton(msg);
            // Tenta definir a nova instancia. Se outra thread ja definiu, falha e repete o loop
            if (INSTANCE.compareAndSet(null, newInstance)) {
                return newInstance; // Sucesso, retorna a nova instancia
            }
        } while (true); // Repete ate que a instancia seja obtida ou criada atomicamente
    }

    public String getMessage() {
        return message;
    }

    public static void main(String[] args) {
        // Simulando acesso concorrente ao singleton
        Runnable task = () -> {
            ThreadSafeSingleton singleton = ThreadSafeSingleton.getInstance(Thread.currentThread().getName());
            System.out.println(Thread.currentThread().getName() + " got instance with message: " + singleton.getMessage());
        };

        for (int i = 0; i < 5; i++) {
            new Thread(task, "Thread-" + i).start();
        }
    }
}

```

**Explicação do Exemplo:**

- A `AtomicReference<ThreadSafeSingleton> INSTANCE` é usada para manter a única instância do Singleton.
- O loop `do-while` em `getInstance()` garante que múltiplas threads tentando criar a instância ao mesmo tempo não resultem em múltiplas instâncias.
- `INSTANCE.compareAndSet(null, newInstance)` é a chave. A primeira thread a ter sucesso nessa operação define a instância. As threads subsequentes falharão no `compareAndSet` e simplesmente obterão a instância já criada no próximo loop.
- Isso evita a necessidade de `synchronized` no método `getInstance()`, o que pode ser mais performático em cenários de alta concorrência após a primeira inicialização.

### Exemplo 4: Usando `updateAndGet` para Operações Atômicas Complexas

O método `updateAndGet` e `accumulateAndGet` permitem realizar operações atômicas que não são apenas incrementos/decrementos simples, mas sim cálculos baseados no valor atual.

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ThreadLocalRandom;

public class AtomicUpdateExample {

    private static AtomicInteger sumOfSquares = new AtomicInteger(0);

    public static void main(String[] args) throws InterruptedException {
        int numberOfThreads = 5;
        int operationsPerThread = 1000;

        Runnable task = () -> {
            for (int i = 0; i < operationsPerThread; i++) {
                int randomNumber = ThreadLocalRandom.current().nextInt(1, 10); // Gera um número aleatório
                // Atualiza atomicamente a soma dos quadrados
                // A função recebe o valor atual (prevValue) e retorna o novo valor
                sumOfSquares.updateAndGet(prevValue -> prevValue + (randomNumber * randomNumber));
            }
        };

        Thread[] threads = new Thread[numberOfThreads];
        for (int i = 0; i < numberOfThreads; i++) {
            threads[i] = new Thread(task);
            threads[i].start();
        }

        for (Thread thread : threads) {
            thread.join(); // Espera todas as threads terminarem
        }

        System.out.println("Soma final dos quadrados: " + sumOfSquares.get());
    }
}

```

**Explicação do Exemplo:**

- `sumOfSquares.updateAndGet(prevValue -> prevValue + (randomNumber * randomNumber))` : A função lambda `prevValue -> prevValue + (randomNumber * randomNumber)` é aplicada atomicamente. Internamente, `updateAndGet` fará um loop CAS: ele pega o `prevValue`, calcula o `newValue`, e tenta fazer o `compareAndSet(prevValue, newValue)`. Se o `compareAndSet` falhar (porque `prevValue` mudou entre a leitura e a tentativa de escrita), ele tenta novamente com o novo valor de `prevValue` até ter sucesso.
- Isso permite que você execute lógicas de atualização mais complexas de forma atômica sem ter que gerenciar o loop CAS manualmente.

### 5\. Informações Adicionais

### Problema ABA e Soluções

O problema ABA ocorre quando um valor é lido como 'A', em algum momento é modificado para 'B', e depois retorna para 'A'. Se você estiver usando `compareAndSet` e apenas verificar se o valor atual é 'A' antes de atualizá-lo, você pode erroneamente pensar que o valor nunca mudou, quando na verdade ele passou por uma transição.

- **`AtomicStampedReference<V>`**: Resolve o problema ABA adicionando uma "estampa" (um número inteiro) à referência. O `compareAndSet` exige que tanto o valor quanto a estampa correspondam para que a atualização seja bem-sucedida. Isso é útil quando a sequência de alterações importa.
- **`AtomicMarkableReference<V>`**: Similar ao `AtomicStampedReference`, mas em vez de uma estampa numérica, usa um `boolean` ("mark") para indicar se a referência foi "marcada" (alterada) desde a última leitura.

### `LongAdder` e `LongAccumulator` para Contadores de Alto Volume

Enquanto `AtomicLong` é excelente para muitos cenários de contagem concorrente, ele pode sofrer com contenção excessiva em ambientes com *muitas* threads constantemente incrementando ou decrementando o mesmo contador. Isso ocorre porque o `compareAndSet` tenta atualizar uma única localização de memória, o que pode levar a muitas falhas e novas tentativas (spinning) sob alta carga.

Para resolver isso, o Java 8 introduziu `LongAdder` e `LongAccumulator` (e suas contrapartes `DoubleAdder`, `DoubleAccumulator`).

- **`LongAdder`**: É projetado para contadores que recebem um alto volume de atualizações concorrentes. Em vez de usar uma única variável para o contador, ele usa um conjunto de variáveis internas (chamadas "células"). Quando uma thread tenta incrementar, ela tenta atualizar uma célula específica. Se houver contenção em uma célula, outras threads podem ser direcionadas para outras células. O valor total é a soma de todas as células. Isso distribui a contenção por várias células, reduzindo o número de falhas de CAS. A operação `sum()` é mais cara, pois precisa somar todas as células, mas as operações de adição são muito mais rápidas sob alta contenção.
    
    **Quando usar:** Para contadores que são quase exclusivamente incrementados/decrementados e lidos raramente.
    
- **`LongAccumulator`**: É uma versão mais genérica do `LongAdder`. Ele permite que você defina uma função `BiFunction` que será usada para combinar o valor atual com um novo valor. Isso permite que você realize operações mais complexas que uma simples adição, como encontrar o máximo, o mínimo, etc.
    
    **Quando usar:** Quando você precisa de uma operação acumulativa (não apenas adição) em um contador de alto volume.
    

### Trade-offs: `synchronized` vs. Atomic

- **`synchronized` / `Lock`**:
    - **Vantagens:** Garante exclusão mútua para blocos de código arbitrários, o que é essencial para manter a consistência de *múltiplas variáveis* ou estados complexos. Mais fácil de entender para iniciantes.
    - **Desvantagens:** Pode levar a `deadlocks`. Introduz overhead de bloqueio/desbloqueio. Threads bloqueadas consomem recursos.
- **Classes Atômicas**:
    - **Vantagens:** Baseadas em CAS (non-blocking), geralmente mais performáticas que `synchronized` para operações em *uma única variável* em cenários de alta contenção. Evitam `deadlocks` para as operações que encapsulam.
    - **Desvantagens:** Só garantem atomicidade para uma operação em uma variável. Não substituem a necessidade de `synchronized` ou `Locks` para transações complexas. Podem levar a loops de "spinning" se a contenção for *muito* alta, embora `LongAdder` e `LongAccumulator` minimizem isso para adições/acumulações. Podem ser mais difíceis de raciocinar sobre o problema ABA.

A escolha entre `synchronized` e classes atômicas depende do cenário específico. Para operações simples em variáveis isoladas (como contadores), as classes atômicas são frequentemente a escolha superior. Para seções críticas que envolvem múltiplas variáveis ou estados mais complexos, `synchronized` ou `ReentrantLock` são mais apropriados.

### 6\. Referências para Estudo Independente

Para Gedê, que busca um cargo de Backend Go, mas tem uma base sólida em Java, entender essas nuances é crucial. Aqui estão alguns recursos para aprofundar:

- **Documentação Oficial da Oracle:**
    - `java.util.concurrent.atomic` Package: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/package-summary.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/package-summary.html)
    - `AtomicInteger`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicInteger.html)
    - `AtomicReference`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicReference.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/AtomicReference.html)
    - `LongAdder`: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/atomic/LongAdder.html)
- **Livros Essenciais de Concorrência em Java:**
    - **"Java Concurrency in Practice"** por Brian Goetz et al.: Este é o livro definitivo sobre concorrência em Java. Se você quer dominar o assunto, é uma leitura obrigatória. Ele aborda as classes atômicas em detalhes.
    - **"Effective Java"** por Joshua Bloch: Embora não seja focado apenas em concorrência, possui itens excelentes sobre thread safety e a importância de imutabilidade e uso de classes atômicas quando apropriado.
- **Artigos e Tutoriais:**
    - Baeldung - Guide to Atomic Operations in Java: [https://www.baeldung.com/java-atomic-operations](https://www.baeldung.com/java-atomic-operations) (Excelente para exemplos práticos e explicações claras).
    - Jenkov - Java Concurrency - Atomic Variables: [http://tutorials.jenkov.com/java-concurrency/atomic-variables.html](http://tutorials.jenkov.com/java-concurrency/atomic-variables.html)

Dominar as classes atômicas é um passo importante para escrever código Java mais eficiente e robusto em ambientes concorrentes, algo fundamental para um desenvolvedor backend. Se tiver mais dúvidas, A.R.I.A está aqui para ajudar\!