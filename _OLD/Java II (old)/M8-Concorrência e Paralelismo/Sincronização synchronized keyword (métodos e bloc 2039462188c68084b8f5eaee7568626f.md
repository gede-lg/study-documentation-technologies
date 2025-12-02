# Sincronização: synchronized keyword (métodos e blocos), wait(), notify(), notifyAll()

Claro, Gedê! Vamos mergulhar fundo na sincronização em Java, um pilar fundamental para qualquer desenvolvedor Backend que lida com concorrência.

## Sincronização em Java: `synchronized`, `wait()`, `notify()`, `notifyAll()`

### 1. Introdução

No desenvolvimento de sistemas backend, especialmente em Java, é extremamente comum lidar com ambientes multi-thread. Aplicações web, serviços RESTful e sistemas de processamento de dados frequentemente executam diversas operações em paralelo para otimizar o desempenho e a responsividade. No entanto, quando múltiplas threads acessam e modificam recursos compartilhados (como variáveis de instância, coleções, arquivos), podem ocorrer problemas graves como *race conditions*, inconsistência de dados e *deadlocks*.

A sincronização em Java é o mecanismo essencial para gerenciar o acesso a recursos compartilhados por múltiplas threads, garantindo que as operações ocorram de forma atômica e que a consistência dos dados seja mantida. O `synchronized` keyword, juntamente com os métodos `wait()`, `notify()` e `notifyAll()`, formam a base para a construção de aplicações concorrentes robustas e corretas em Java. Compreender e aplicar esses conceitos é de suma importância para evitar bugs complexos e difíceis de depurar em sistemas de alta concorrência.

**Definição e Conceitos Fundamentais:**

O tema principal é a **sincronização de threads**. Isso envolve o controle do acesso de múltiplas threads a recursos compartilhados para garantir a integridade dos dados e a execução ordenada de operações.

- **`synchronized` keyword:** Serve para impor um bloqueio exclusivo em um objeto ou em um método. Quando uma thread entra em um bloco ou método `synchronized`, ela adquire um "lock" (trava) intrínseco associado a um objeto específico. Nenhuma outra thread pode adquirir o mesmo lock enquanto a primeira thread o detém. Isso garante que apenas uma thread por vez possa executar o código dentro da seção sincronizada, eliminando *race conditions* em relação aos recursos protegidos por esse lock.
- **`wait()`:** Este método faz com que a thread que está atualmente segurando o lock de um objeto libere esse lock e entre em um estado de espera. A thread permanecerá em espera até que seja notificada por outra thread (usando `notify()` ou `notifyAll()`) e possa tentar readquirir o lock. É usado para cooperação entre threads, onde uma thread precisa esperar por uma condição específica antes de continuar.
- **`notify()`:** Este método acorda *uma única thread* que está esperando no lock do objeto em que `notify()` é chamado. Se houver múltiplas threads esperando, a escolha de qual thread será acordada é arbitrária (depende da implementação da JVM). A thread acordada tentará readquirir o lock e continuará sua execução.
- **`notifyAll()`:** Similar a `notify()`, mas acorda *todas as threads* que estão esperando no lock do objeto. Todas as threads acordadas tentarão readquirir o lock, mas apenas uma por vez conseguirá.

Esses mecanismos servem para:

1. **Garantir a exclusão mútua:** Assegurar que apenas uma thread por vez acesse uma seção crítica de código que manipula recursos compartilhados.
2. **Permitir a comunicação/cooperação entre threads:** Permitir que threads se comuniquem e se coordenem, por exemplo, uma thread esperando que outra thread produza dados antes de consumi-los.

### 2. Sumário

- **Fundamentos da Sincronização**
    - Problemas em ambientes concorrentes (Race Condition, Inconsistência de Dados)
    - Monitores e Locks Intrínsecos
- **A Keyword `synchronized`**
    - Métodos Sincronizados
    - Blocos Sincronizados
    - Sincronização Estática (`synchronized` em métodos estáticos)
- **Comunicação entre Threads: `wait()`, `notify()`, `notifyAll()`**
    - Contexto e Prerrogativas
    - O ciclo de vida `wait`/`notify`
    - Diferenças entre `notify()` e `notifyAll()`
- **Restrições e Considerações de Uso**
    - Deadlock
    - Starvation e Livelock
    - Overhead de Sincronização
- **Exemplos de Código Otimizados**
    - Contador Sincronizado
    - Produtor-Consumidor Clássico
- **Informações Adicionais**
    - Alternativas modernas (`java.util.concurrent.locks`, `CompletableFuture`)
    - Volatile vs Synchronized
- **Referências para Estudo Independente**

### 3. Conteúdo Detalhado

### Fundamentos da Sincronização

Quando threads acessam e modificam o mesmo recurso sem coordenação, o resultado pode ser imprevisível.

- **Race Condition (Condição de Corrida):** Ocorre quando o resultado de uma operação depende da ordem de execução (e intercalação) de operações de múltiplas threads. Por exemplo, se duas threads tentam incrementar uma variável simultaneamente sem sincronização, o resultado final pode ser menor do que o esperado.
- **Inconsistência de Dados:** Uma thread pode ler dados que estão sendo modificados por outra thread, resultando em valores parciais ou incorretos.

Java fornece um mecanismo intrínseco de bloqueio (conhecido como *monitor* ou *lock intrínseco*) para cada objeto. Quando uma thread entra em um método ou bloco `synchronized`, ela tenta adquirir o lock do objeto associado. Se o lock já estiver sendo mantido por outra thread, a thread atual entra em um estado de espera até que o lock seja liberado.

### A Keyword `synchronized`

A keyword `synchronized` é usada para criar seções críticas de código que só podem ser executadas por uma thread por vez.

**Sintaxe e Estrutura:**

Existem duas formas principais de usar `synchronized`:

1. **Métodos Sincronizados:**
Quando você declara um método como `synchronized`, o lock intrínseco do objeto (para métodos de instância) ou da classe (para métodos estáticos) é adquirido antes que a thread entre no método.
    
    ```java
    public class Contador {
        private int count = 0;
    
        // Método de instância sincronizado
        // O lock é o objeto 'this' (a instância de Contador)
        public synchronized void incrementar() {
            count++;
            System.out.println(Thread.currentThread().getName() + " incrementou para: " + count);
        }
    
        // Método de instância sincronizado
        public synchronized int getCount() {
            return count;
        }
    
        // Método estático sincronizado
        // O lock é o objeto Class (Contador.class)
        public static synchronized void imprimirMensagemEstatica() {
            System.out.println("Mensagem estática sincronizada por: " + Thread.currentThread().getName());
        }
    }
    
    ```
    
    **Componentes Principais:**
    
    - **Lock:** Para métodos de instância, o lock é a própria instância do objeto (`this`). Para métodos estáticos, o lock é o objeto `Class` associado à classe (ex: `Contador.class`).
    - **Função:** Garante que apenas uma thread possa executar o método `incrementar()` em uma *dada instância* de `Contador` por vez. Se houver múltiplas instâncias, cada instância terá seu próprio lock. Se o método for estático, apenas uma thread poderá executar o método estático em *qualquer instância* da classe por vez, pois o lock é na própria classe.
    - **Restrições:** Sincronizar métodos inteiros pode ser excessivamente restritivo e impactar o desempenho se o método contiver código que não precisa de proteção.
2. **Blocos Sincronizados:**
Você pode sincronizar apenas uma parte específica de um método, usando um objeto para o lock. Isso oferece um controle mais granular.
    
    ```java
    public class ProcessadorDados {
        private final Object lock = new Object(); // Um objeto dedicado para o lock
        private String dadosCompartilhados = "";
    
        public void atualizarDados(String novosDados) {
            System.out.println(Thread.currentThread().getName() + " tentando atualizar dados...");
            // Apenas este bloco é sincronizado
            synchronized (lock) { // O lock é o objeto 'lock'
                dadosCompartilhados = novosDados;
                System.out.println(Thread.currentThread().getName() + " dados atualizados para: " + dadosCompartilhados);
                // Outras operações que não precisam de sincronização podem vir aqui fora do bloco.
            }
        }
    
        public void lerDados() {
            // Este método pode ser executado concorrentemente
            System.out.println(Thread.currentThread().getName() + " lendo dados: " + dadosCompartilhados);
        }
    }
    
    ```
    
    **Componentes Principais:**
    
    - **Objeto de Lock:** Você deve fornecer um objeto como argumento para a instrução `synchronized(object)`. Este objeto será o lock. Pode ser `this`, um objeto de instância dedicado (`new Object()`), ou um objeto `Class` para sincronização estática.
    - **Função:** Permite proteger apenas as seções críticas do código. Se você tem um método grande, mas apenas algumas linhas manipulam dados compartilhados, use um bloco sincronizado para proteger apenas essas linhas. Isso aumenta a concorrência geral da aplicação.
    - **Restrições:** Escolher o objeto de lock incorreto pode levar a problemas de sincronização (nenhum lock, ou lock muito amplo) ou a deadlocks. É uma boa prática usar um objeto `final` privado e dedicado para o lock, para evitar que outras partes do código adquiram o mesmo lock indevidamente.

### Comunicação entre Threads: `wait()`, `notify()`, `notifyAll()`

Esses métodos pertencem à classe `Object` (e não `Thread`), o que significa que todos os objetos em Java podem atuar como monitores. Eles são usados para permitir que threads esperem por uma condição e sejam notificadas quando essa condição for atendida.

**Contexto e Prerrogativas:**

- **Crucial:** Os métodos `wait()`, `notify()`, e `notifyAll()` SÓ PODEM ser chamados dentro de um bloco ou método `synchronized`. Se forem chamados fora de um contexto sincronizado, eles lançarão uma `IllegalMonitorStateException`.
- **Propósito:** Uma thread deve possuir o lock do objeto no qual `wait()` é chamado. Ao chamar `wait()`, a thread libera esse lock e entra em um *waiting pool* (pool de espera) associado ao objeto. Quando `notify()` ou `notifyAll()` é chamado no mesmo objeto, uma ou todas as threads no *waiting pool* são movidas para um *ready pool* (pool de prontos) e competirão novamente pelo lock do objeto.

**O Ciclo de Vida `wait`/`notify`:**

1. Uma thread entra em um bloco `synchronized` e adquire o lock de um objeto.
2. A thread verifica uma condição. Se a condição não for atendida (ex: buffer de dados vazio), a thread chama `object.wait()`.
3. Ao chamar `wait()`, a thread libera o lock do objeto e entra em estado de espera.
4. Outra thread adquire o lock do mesmo objeto e modifica o estado (ex: adiciona dados ao buffer).
5. A segunda thread chama `object.notify()` ou `object.notifyAll()` para acordar as threads esperando.
6. A thread (ou threads) acordada tenta readquirir o lock do objeto. Uma vez que o lock é obtido, ela sai do `wait()` e reavalia a condição (geralmente em um loop `while`).

**Diferenças entre `notify()` e `notifyAll()`:**

- `notify()`: Acorda apenas uma das threads que estão esperando no lock do objeto. A escolha de qual thread é acordada é não determinística (JVM decide). Use com cautela em cenários onde várias threads podem estar esperando pela mesma condição e apenas uma precisa ser acordada.
- `notifyAll()`: Acorda todas as threads que estão esperando no lock do objeto. Todas as threads acordadas competirão pelo lock. É geralmente a escolha mais segura, pois evita a possibilidade de *starvation* (uma thread nunca ser acordada) em sistemas mais complexos. Embora mais threads sejam acordadas, apenas uma pode prosseguir por vez.

### Restrições e Considerações de Uso

- **Deadlock:** Ocorre quando duas ou mais threads ficam bloqueadas indefinidamente, esperando por locks que as outras threads mantêm. Ex: Thread A espera por lock de Objeto B, enquanto Thread B espera por lock de Objeto A.
    - **Prevenção:** Consistência na ordem de aquisição de locks, evitar aninhamento excessivo de locks, usar timeouts.
- **Starvation (Inanição):** Uma thread nunca consegue adquirir um recurso (lock) porque outras threads com maior prioridade ou que são continuamente mais rápidas sempre o obtêm primeiro.
- **Livelock:** Threads não estão bloqueadas, mas estão ocupadamente executando operações que se anulam ou que as impedem de progredir, sem nunca completar sua tarefa.
- **Overhead de Sincronização:** O uso excessivo de `synchronized` pode degradar severamente o desempenho, pois a aquisição e liberação de locks envolvem custos computacionais e podem limitar o paralelismo. Use-o apenas onde for estritamente necessário.
- **`wait()` dentro de `while` loop:** Sempre use `wait()` dentro de um loop `while` que verifica a condição pela qual a thread está esperando. Isso é crucial porque:
    - **Spurious Wakeups:** Uma thread pode ser acordada sem que uma `notify()` ou `notifyAll()` tenha sido chamada (um fenômeno raro, mas possível, especificado pela JVM).
    - **Múltiplas Notificações:** Se `notifyAll()` for chamado, todas as threads acordarão, mas a condição pode ter sido consumida pela primeira thread a readquirir o lock. As outras threads precisam revalidar a condição.

### 4. Exemplos de Código Otimizados

### Exemplo 1: Contador Sincronizado

Este exemplo demonstra como o `synchronized` protege um recurso compartilhado (o `count`).

```java
public class ContadorSincronizado {
    private int count = 0;

    // Usamos 'synchronized' no método para proteger o 'count'
    // O lock é a própria instância de ContadorSincronizado
    public synchronized void incrementar() {
        count++;
        // Simula algum trabalho
        try {
            Thread.sleep(1);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public synchronized int getCount() {
        return count;
    }

    public static void main(String[] args) throws InterruptedException {
        ContadorSincronizado contador = new ContadorSincronizado();
        int numThreads = 100;
        int incrementosPorThread = 1000;

        Thread[] threads = new Thread[numThreads];

        for (int i = 0; i < numThreads; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < incrementosPorThread; j++) {
                    contador.incrementar();
                }
            }, "Thread-" + i);
            threads[i].start();
        }

        for (Thread thread : threads) {
            thread.join(); // Espera todas as threads terminarem
        }

        // O resultado esperado é numThreads * incrementosPorThread
        System.out.println("Valor final do contador: " + contador.getCount());
        // Sem sincronização, o valor seria frequentemente menor que 100000.
        // Com sincronização, o valor será consistentemente 100000.
    }
}

```

**Caso de Uso Real:** Em um sistema de e-commerce, o estoque de um produto é um recurso compartilhado. Múltiplas threads (requisições de usuários) podem tentar decrementar o estoque simultaneamente. Usar `synchronized` em um método que decremente o estoque garantiria que o estoque não fosse subtraído incorretamente, evitando vendas de produtos fora de estoque.

### Exemplo 2: Produtor-Consumidor Clássico com `wait()` e `notifyAll()`

Este é um padrão clássico de concorrência onde uma thread (produtor) gera dados e outra thread (consumidor) os processa. Eles se comunicam via um buffer compartilhado.

```java
import java.util.LinkedList;
import java.util.Queue;

public class ProdutorConsumidor {

    private final Queue<Integer> buffer = new LinkedList<>();
    private final int CAPACIDADE_MAXIMA = 5;
    private final Object LOCK = new Object(); // Objeto de lock dedicado

    // Produtor: Adiciona itens ao buffer
    public void produzir() throws InterruptedException {
        int valor = 0;
        while (true) {
            synchronized (LOCK) { // Trava o buffer
                while (buffer.size() == CAPACIDADE_MAXIMA) {
                    System.out.println("Buffer cheio. Produtor " + Thread.currentThread().getName() + " esperando...");
                    LOCK.wait(); // Libera o lock e espera
                }
                buffer.add(valor++);
                System.out.println("Produtor " + Thread.currentThread().getName() + " produziu: " + (valor - 1));
                LOCK.notifyAll(); // Notifica todas as threads esperando (consumidores)
            }
            Thread.sleep(100); // Pequena pausa para simular trabalho
        }
    }

    // Consumidor: Remove itens do buffer
    public void consumir() throws InterruptedException {
        while (true) {
            synchronized (LOCK) { // Trava o buffer
                while (buffer.isEmpty()) {
                    System.out.println("Buffer vazio. Consumidor " + Thread.currentThread().getName() + " esperando...");
                    LOCK.wait(); // Libera o lock e espera
                }
                int valor = buffer.poll();
                System.out.println("Consumidor " + Thread.currentThread().getName() + " consumiu: " + valor);
                LOCK.notifyAll(); // Notifica todas as threads esperando (produtores)
            }
            Thread.sleep(200); // Pequena pausa para simular trabalho
        }
    }

    public static void main(String[] args) {
        ProdutorConsumidor pc = new ProdutorConsumidor();

        // Criar threads de produtor
        Thread produtor1 = new Thread(() -> {
            try {
                pc.produzir();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "Produtor-1");

        // Criar threads de consumidor
        Thread consumidor1 = new Thread(() -> {
            try {
                pc.consumir();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "Consumidor-1");

        Thread consumidor2 = new Thread(() -> {
            try {
                pc.consumir();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }, "Consumidor-2");

        produtor1.start();
        consumidor1.start();
        consumidor2.start();
    }
}

```

**Caso de Uso Real:** Um sistema de processamento de filas de mensagens. Um produtor (ex: um serviço que recebe requisições de API) adiciona mensagens a uma fila em memória. Consumidores (ex: workers de background) pegam mensagens da fila para processamento. `wait()` e `notifyAll()` garantem que os consumidores esperem quando a fila está vazia e que os produtores esperem quando a fila está cheia, evitando estouro de memória ou processamento de dados inexistentes.

### 5. Informações Adicionais

### `InputStream` vs `Reader`

- **`InputStream`:** Trabalha com dados binários brutos (bytes). É a base para ler qualquer tipo de dado, seja texto, imagem, áudio, etc.
- **`Reader`:** Trabalha com dados de caracteres (texto). Ele lida com a decodificação de bytes em caracteres usando um `Charset` especificado (ou o padrão do sistema). Use `Reader` quando estiver lendo texto e `InputStream` quando estiver lendo dados binários ou quando o encoding não for relevante ou precisar ser tratado manualmente.

### `InputStream` e o mundo de NIO.2

Embora o `InputStream` seja parte das classes de I/O "tradicionais", o Java NIO.2 (a partir do Java 7) introduziu uma API mais moderna e robusta para manipulação de arquivos e caminhos, centrada nas classes `Path` e `Files`.

- `Path`: Representa um caminho de arquivo ou diretório de forma mais flexível e poderosa que `java.io.File`.
- `Files`: Oferece métodos estáticos para operações de arquivo e diretório, muitos dos quais podem retornar streams de bytes (`InputStream`) ou streams de caracteres (`Reader`) de forma mais conveniente.
    - Ex: `Files.newInputStream(Path path)` retorna um `InputStream`.
    - Ex: `Files.readAllBytes(Path path)` lê todos os bytes de um arquivo de uma vez.
    - Ex: `Files.lines(Path path)` retorna um `Stream<String>` que pode ser muito útil para processar arquivos de texto grandes com a Streams API do Java 8+.

Para novas implementações de I/O de arquivo, é geralmente recomendado usar NIO.2 devido à sua flexibilidade, desempenho e design mais moderno, embora as classes `InputStream`/`OutputStream` ainda sejam amplamente usadas em muitas bibliotecas e frameworks.

### 6. Referências para Estudo Independente

Para se aprofundar ainda mais nesses tópicos cruciais, Gedê, recomendo os seguintes recursos:

- **Documentação Oficial da Oracle:**
    - [A lição sobre Concorrência (Concurrency) do Java Tutorials](https://docs.oracle.com/javase/tutorial/essential/concurrency/index.html) - Essencial para entender os conceitos básicos e avançados.
    - [Documentação da classe Object (para wait/notify/notifyAll)](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html)
    - [Documentação da classe Thread (para synchronized)](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html)
- **Livros:**
    - **"Effective Java" de Joshua Bloch:** Embora não seja focado apenas em concorrência, possui itens excelentes sobre thread safety e boas práticas em Java. Um livro obrigatório para qualquer desenvolvedor Java sério.
    - **"Java Concurrency in Practice" de Brian Goetz et al.:** Este é o livro definitivo sobre concorrência em Java. Se você busca o cargo de Backend GO, este livro oferece insights profundos e soluções para problemas complexos de concorrência. É um investimento valioso para seu aprendizado.
- **Artigos e Tutoriais:**
    - **Baeldung:** Site com muitos tutoriais práticos e bem explicados sobre Java, incluindo uma vasta seção sobre concorrência.
        - [Java Synchronized Keyword](https://www.baeldung.com/java-synchronized)
        - [Wait and Notify in Java](https://www.baeldung.com/java-wait-notify)
    - **GeeksforGeeks:** Outro recurso útil para exemplos e explicações detalhadas.
        - [Multithreading in Java](https://www.geeksforgeeks.org/multithreading-in-java/)

Estudar esses recursos irá solidificar seu entendimento sobre concorrência em Java e prepará-lo para os desafios de sistemas distribuídos e de alto desempenho. Lembre-se, a prática leva à perfeição, então tente implementar os padrões de sincronização em seus próprios projetos!