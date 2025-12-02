# Concurrent Collections (ConcurrentHashMap, CopyOnWriteArrayList)

Ótimo pedido, Gedê! Entender as `Concurrent Collections` é fundamental para quem trabalha com Backend Java e, especialmente, busca cargos que exigem alta performance e concorrência, como o de Backend GO. Elas são a chave para evitar problemas de concorrência e garantir a robustez de aplicações multithreaded.

## Coleções Concorrentes em Java: `ConcurrentHashMap` e `CopyOnWriteArrayList`

### 1. Introdução

No desenvolvimento de aplicações Backend, é extremamente comum lidar com múltiplas requisições simultâneas que acessam e modificam dados compartilhados. Quando várias threads tentam acessar e modificar a mesma estrutura de dados (como um `HashMap` ou um `ArrayList`) sem coordenação adequada, podem ocorrer problemas graves como *race conditions*, *deadlocks*, inconsistência de dados e até mesmo exceções inesperadas.

Para resolver esses desafios, o pacote `java.util.concurrent` em Java oferece as **Coleções Concorrentes**. Estas são implementações especializadas de estruturas de dados que são projetadas para serem usadas com segurança e eficiência em ambientes multithreaded, fornecendo mecanismos internos de sincronização que minimizam a necessidade de bloqueios explícitos por parte do desenvolvedor, ou que utilizam abordagens inovadoras para garantir a consistência dos dados.

O tema principal aqui são essas Coleções Concorrentes, com foco especial em duas das mais importantes e frequentemente utilizadas: `ConcurrentHashMap` e `CopyOnWriteArrayList`. Elas servem para oferecer alternativas thread-safe e de alto desempenho às suas contrapartes não sincronizadas (como `HashMap` e `ArrayList`), permitindo que desenvolvedores criem sistemas mais robustos e escaláveis em ambientes de alta concorrência.

### 2. Sumário

- **A Necessidade de Coleções Concorrentes**
    - Problemas de concorrência com coleções não sincronizadas
    - Limitações das coleções sincronizadas (Ex: `Collections.synchronizedMap`)
- **Introdução às Coleções Concorrentes**
    - Princípios e benefícios
    - A interface `ConcurrentMap`
- **`ConcurrentHashMap`**
    - Visão Geral e Finalidade
    - Como funciona (Segmentação e Trava por Hash)
    - Principais Métodos
    - Restrições de Uso e Considerações
- **`CopyOnWriteArrayList`**
    - Visão Geral e Finalidade
    - Como funciona (Filosofia "Copy On Write")
    - Principais Métodos
    - Restrições de Uso e Considerações
- **Exemplos de Código Otimizados**
    - `ConcurrentHashMap` em um cenário de cache
    - `CopyOnWriteArrayList` em um listener registry
- **Informações Adicionais**
    - Outras Coleções Concorrentes (`ConcurrentLinkedQueue`, `BlockingQueue`, etc.)
    - Escolhendo a Coleção Certa
    - Comparativo de Performance
- **Referências para Estudo Independente**

### 3. Conteúdo Detalhado

### A Necessidade de Coleções Concorrentes

Imagine que você tem um `HashMap` para armazenar informações de usuários logados em uma aplicação web. Se múltiplas requisições de usuários tentarem adicionar ou remover usuários simultaneamente, sem qualquer tipo de controle, o `HashMap` pode ficar em um estado inconsistente. Por exemplo:

- **`Race Condition`:** Uma thread pode estar adicionando um elemento enquanto outra está redimensionando o mapa, levando a perda de dados ou comportamento imprevisível.
- **Inconsistência de Dados:** O iterador de uma thread pode falhar (lancar `ConcurrentModificationException`) se outra thread modificar a coleção enquanto ela está sendo percorrida.

Uma solução inicial para esses problemas seria usar as coleções sincronizadas fornecidas pela classe `Collections`, como `Collections.synchronizedMap(new HashMap<>())`. No entanto, essas coleções geralmente usam um único bloqueio (lock) que sincroniza todas as operações na coleção inteira. Isso significa que apenas uma thread pode acessar a coleção por vez, mesmo que as operações não colidam (por exemplo, uma thread lendo uma parte e outra thread lendo outra parte). Isso leva a um gargalo de performance severo em ambientes de alta concorrência.

### Introdução às Coleções Concorrentes

As Coleções Concorrentes do pacote `java.util.concurrent` foram introduzidas para superar as limitações das coleções sincronizadas. Elas oferecem estratégias de sincronização mais granulares ou abordagens completamente diferentes para garantir a segurança da thread com desempenho otimizado.

**Princípios e benefícios:**

- **Segurança da Thread:** Todas as operações são thread-safe, eliminando a necessidade de bloqueios externos.
- **Desempenho Otimizado:** Usam estratégias de concorrência mais sofisticadas, como bloqueios segmentados (para `ConcurrentHashMap`) ou a filosofia "copy-on-write" (para `CopyOnWriteArrayList`), minimizando a contenção de bloqueios.
- **Não-bloqueante ou Mínimo Bloqueio:** Algumas operações podem ser não-bloqueantes ou usar bloqueios muito curtos, permitindo alta simultaneidade.
- **Comportamento Atômico:** Muitas operações, como `putIfAbsent` ou `computeIfAbsent`, são atômicas.

**A interface `ConcurrentMap`:**

`ConcurrentMap` é uma interface que estende `Map` e adiciona operações atômicas comuns. `ConcurrentHashMap` é a principal implementação dessa interface.

### `ConcurrentHashMap`

**Visão Geral e Finalidade:**

`ConcurrentHashMap` é uma implementação thread-safe de `Map` que oferece alto desempenho para operações concorrentes. É a substituição recomendada para `Hashtable` e `Collections.synchronizedMap(new HashMap<>())` quando se trabalha em ambientes multithreaded.

**Como funciona (Segmentação e Trava por Hash - Java 7, e `CAS` com `synchronized` - Java 8+):**

- **Até Java 7:** `ConcurrentHashMap` dividia o seu array interno (tabela de hash) em vários "segmentos" ou "partições". Cada segmento era efetivamente um `HashMap` separado, e cada um tinha seu próprio bloqueio. Quando uma thread precisava modificar o mapa, ela bloqueava apenas o segmento relevante, permitindo que outras threads acessassem ou modificassem outros segmentos simultaneamente. Isso reduzia a contenção e aumentava a concorrência.
- **A partir do Java 8:** A arquitetura foi drasticamente simplificada e melhorada. Em vez de segmentos, `ConcurrentHashMap` agora usa uma combinação de algoritmos *Compare-And-Swap (CAS)* para operações não-bloqueantes e bloqueios `synchronized` por nó (ou por `bin`/balde) em casos de colisão de hash. Isso significa que as operações de leitura (como `get()`) geralmente não requerem nenhum bloqueio, e as operações de escrita bloqueiam apenas uma pequena parte do mapa onde a alteração está ocorrendo. A abordagem do Java 8 é mais eficiente em termos de memória e geralmente oferece desempenho superior, especialmente sob alta carga de escrita.

**Principais Métodos:**

Além dos métodos padrão da interface `Map`, `ConcurrentHashMap` oferece métodos atômicos que são cruciais para operações concorrentes:

- `V put(K key, V value)`: Associa o valor especificado à chave especificada neste mapa.
- `V get(Object key)`: Retorna o valor ao qual a chave especificada está mapeada.
- `V remove(Object key)`: Remove o mapeamento para uma chave deste mapa, se presente.
- `V putIfAbsent(K key, V value)`: Se a chave especificada ainda não estiver associada a um valor, associa-a ao valor fornecido e retorna `null`. Caso contrário, retorna o valor atual. Esta é uma operação atômica.
- `boolean remove(Object key, Object value)`: Remove a entrada para a chave apenas se atualmente mapeada para o valor especificado. Atômico.
- `boolean replace(K key, V oldValue, V newValue)`: Substitui a entrada para a chave apenas se atualmente mapeada para o valor `oldValue`. Atômico.
- `V replace(K key, V value)`: Substitui a entrada para a chave apenas se atualmente mapeada para algum valor. Atômico.
- `V compute(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`: Tenta computar um mapeamento para a chave e seu valor atual (ou `null` se não houver mapeamento). Atômico.
- `V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)`: Se a chave especificada ainda não estiver associada a um valor, tenta computar seu valor usando a função de mapeamento fornecida e entra no mapa. Atômico.
- `V computeIfPresent(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)`: Se a chave especificada já estiver associada a um valor, tenta computar um novo mapeamento dado a chave e seu valor mapeado. Atômico.
- `V merge(K key, V value, BiFunction<? super V, ? super V, ? extends V> remappingFunction)`: Se a chave especificada não estiver já associada a um valor ou estiver associada a `null`, associa-a ao valor dado; caso contrário, substitui a entrada existente com o resultado da função de remapeamento fornecida. Atômico.

**Restrições de Uso e Considerações:**

- **Chaves e Valores Não-Nulos:** `ConcurrentHashMap` não permite chaves ou valores `null`. Se você precisar de `null`s, terá que encapsulá-los (por exemplo, usando `Optional`).
- **Iteradores são Weakly Consistent:** Os iteradores de `ConcurrentHashMap` são "weakly consistent". Isso significa que eles podem refletir modificações feitas na coleção *após* a criação do iterador, mas não lançarão `ConcurrentModificationException`. Eles garantem que todos os elementos que estavam presentes no mapa no momento da criação do iterador serão visitados exatamente uma vez, a menos que sejam removidos antes de serem visitados.
- **Ordem:** Não garante a ordem dos elementos, assim como `HashMap`.

### `CopyOnWriteArrayList`

**Visão Geral e Finalidade:**

`CopyOnWriteArrayList` é uma implementação thread-safe da interface `List` que é otimizada para cenários onde as operações de leitura são muito mais frequentes do que as operações de escrita (adições, remoções, modificações). É uma excelente escolha para listas de listeners, configurações que raramente mudam, ou caches de pequenas coleções.

**Como funciona (Filosofia "Copy On Write"):**

A filosofia "Copy On Write" é a característica central desta classe. Sempre que uma operação de modificação (adição, remoção, alteração) é realizada, a `CopyOnWriteArrayList` **cria uma cópia completamente nova** do array subjacente. A modificação é feita nesta nova cópia, e então a referência interna para o array é atomicamente atualizada para apontar para a nova cópia.

- **Vantagem para Leituras:** As operações de leitura (como `get()`, `iterator()`, `size()`) nunca precisam ser sincronizadas, pois sempre acessam o array antigo (consistente) antes que a referência seja atualizada. Isso significa que as leituras são extremamente rápidas e não bloqueiam outras threads.
- **Desvantagem para Escritas:** As operações de escrita são potencialmente muito caras, pois envolvem a criação de um novo array e a cópia de todos os elementos. Isso pode gerar sobrecarga de CPU e memória, especialmente para listas grandes.

**Principais Métodos:**

`CopyOnWriteArrayList` implementa a interface `List`, então possui todos os métodos comuns de lista:

- `boolean add(E e)`: Adiciona o elemento especificado ao final desta lista.
- `void add(int index, E element)`: Insere o elemento especificado na posição especificada nesta lista.
- `boolean remove(Object o)`: Remove a primeira ocorrência do elemento especificado desta lista, se presente.
- `E get(int index)`: Retorna o elemento na posição especificada nesta lista.
- `Iterator<E> iterator()`: Retorna um iterador sobre os elementos nesta lista. **Importante:** Este iterador reflete o estado da lista no momento da criação do iterador e não verá modificações subsequentes.

**Restrições de Uso e Considerações:**

- **Custo de Escrita:** Evite `CopyOnWriteArrayList` se as operações de escrita forem frequentes, pois o custo de cópia pode degradar severamente o desempenho.
- **Consistência "Snapshot":** Os iteradores fornecidos por `CopyOnWriteArrayList` são "snapshot" iterators. Isso significa que eles operam em uma cópia do array que existia no momento em que o iterador foi criado. Eles nunca lançarão `ConcurrentModificationException`, mas também não verão as modificações feitas na lista após sua criação.
- **Uso de Memória:** Para grandes listas com muitas modificações, o uso de memória pode ser significativo devido às múltiplas cópias do array.
- **Melhor para Listeners e Eventos:** É ideal para cenários como listas de listeners onde os eventos são disparados frequentemente (leituras), mas os listeners são adicionados ou removidos raramente (escritas).

### 4. Exemplos de Código Otimizados

### `ConcurrentHashMap` em um cenário de cache

Um caso de uso comum para `ConcurrentHashMap` é a implementação de um cache que pode ser acessado por múltiplas threads.

```java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

public class UserCache {

    // Um cache thread-safe para armazenar usuários por ID
    private final ConcurrentHashMap<Long, User> userCache = new ConcurrentHashMap<>();

    // Simula um banco de dados
    private static class User {
        private final Long id;
        private final String name;

        public User(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        @Override
        public String toString() {
            return "User{id=" + id + ", name='" + name + "'}";
        }
    }

    // Método para buscar um usuário, usando o cache
    public User getUserById(Long userId) {
        // computeIfAbsent é atômico: se a chave não existir, a função é executada e o resultado é inserido.
        // Se a chave já existir, a função não é executada e o valor existente é retornado.
        return userCache.get(userId);
    }

    public void addUser(User user) {
        userCache.put(user.getId(), user);
        System.out.println("Usuário adicionado/atualizado no cache: " + user);
    }

    public void removeUser(Long userId) {
        userCache.remove(userId);
        System.out.println("Usuário removido do cache: " + userId);
    }

    // Exemplo de uso em um cenário multithread
    public static void main(String[] args) throws InterruptedException {
        UserCache cache = new UserCache();

        // Simula a adição de usuários por diferentes threads
        Runnable addUsersTask = () -> {
            for (int i = 0; i < 5; i++) {
                long id = Thread.currentThread().getId() * 10 + i;
                cache.addUser(new User(id, "User " + id + " from Thread " + Thread.currentThread().getName()));
                try {
                    TimeUnit.MILLISECONDS.sleep(50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        Thread t1 = new Thread(addUsersTask, "T1");
        Thread t2 = new Thread(addUsersTask, "T2");

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("\\nConteúdo final do cache:");
        cache.userCache.forEach((id, user) -> System.out.println(user));

        // Exemplo de como usar computeIfAbsent para buscar/adicionar atomicamente
        System.out.println("\\nBuscando um usuário usando computeIfAbsent:");
        User user99 = cache.userCache.computeIfAbsent(99L, id -> {
            System.out.println("Buscando User " + id + " do banco de dados (simulado)...");
            return new User(id, "User from DB " + id);
        });
        System.out.println("Usuário 99: " + user99);

        // Tentando buscar novamente, não deve chamar a função de busca
        User user99Again = cache.userCache.computeIfAbsent(99L, id -> {
            System.out.println("Isso não deveria ser impresso para User 99.");
            return new User(id, "User from DB " + id);
        });
        System.out.println("Usuário 99 (again): " + user99Again);
    }
}

```

**Explicação do Exemplo:**

- **`UserCache`**: Uma classe que simula um cache de usuários.
- **`ConcurrentHashMap<Long, User> userCache`**: Declaramos a coleção thread-safe.
- **`addUser` e `removeUser`**: Métodos simples de adição e remoção. `put` e `remove` no `ConcurrentHashMap` já são thread-safe.
- **`main`**: Cria duas threads (`t1`, `t2`) que tentam adicionar usuários concorrentemente. Mesmo com acessos simultâneos, o `ConcurrentHashMap` garante a consistência dos dados.
- **`computeIfAbsent`**: Demonstra uma operação atômica poderosa. Se o usuário com `ID 99` não estiver no cache, a função lambda `id -> { ... }` é executada para "buscar" o usuário e inseri-lo. Se ele já estiver lá, a função não é executada, evitando buscas desnecessárias e garantindo que apenas uma thread adicione o item se ele estiver faltando. Isso é ideal para evitar a duplicação de trabalho ou a obtenção de dados inconsistentes de uma fonte externa.

### `CopyOnWriteArrayList` em um listener registry

Um cenário clássico para `CopyOnWriteArrayList` é o registro de listeners para eventos.

```java
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class EventPublisher {

    // Lista de listeners que será lida frequentemente e modificada raramente
    private final List<EventListener> listeners = new CopyOnWriteArrayList<>();

    // Interface para os listeners
    public interface EventListener {
        void onEvent(String eventName);
    }

    // Adiciona um listener à lista
    public void addListener(EventListener listener) {
        listeners.add(listener);
        System.out.println(Thread.currentThread().getName() + ": Listener adicionado. Total: " + listeners.size());
    }

    // Remove um listener da lista
    public void removeListener(EventListener listener) {
        listeners.remove(listener);
        System.out.println(Thread.currentThread().getName() + ": Listener removido. Total: " + listeners.size());
    }

    // Publica um evento para todos os listeners registrados
    public void publishEvent(String eventName) {
        System.out.println("\\nPublicando evento: " + eventName);
        // A iteração sobre a lista é segura e não lançará ConcurrentModificationException
        for (EventListener listener : listeners) {
            listener.onEvent(eventName);
        }
    }

    public static void main(String[] args) throws InterruptedException {
        EventPublisher publisher = new EventPublisher();

        // Simula diferentes listeners
        EventListener listener1 = eventName -> System.out.println("Listener 1 recebeu: " + eventName);
        EventListener listener2 = eventName -> System.out.println("Listener 2 recebeu: " + eventName);
        EventListener listener3 = eventName -> System.out.println("Listener 3 recebeu: " + eventName);

        // Adiciona listeners (operações de escrita)
        publisher.addListener(listener1);
        publisher.addListener(listener2);

        // Cria um pool de threads para simular acesso concorrente
        ExecutorService executor = Executors.newFixedThreadPool(5);

        // Task para publicar eventos
        Runnable publishTask = () -> {
            String threadName = Thread.currentThread().getName();
            publisher.publishEvent("Evento de " + threadName);
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // Task para adicionar/remover listeners concorrentemente
        Runnable modifyListenerTask = () -> {
            publisher.addListener(listener3);
            try {
                TimeUnit.MILLISECONDS.sleep(200); // Dar tempo para eventos serem publicados
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            publisher.removeListener(listener3);
        };

        // Inicia threads de publicação e modificação
        executor.submit(publishTask);
        executor.submit(publishTask);
        executor.submit(modifyListenerTask); // Esta thread vai adicionar e remover um listener enquanto eventos estão sendo publicados
        executor.submit(publishTask);
        executor.submit(publishTask);

        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.MINUTES);

        System.out.println("\\nFim do exemplo.");
        publisher.publishEvent("Evento Final (depois de tudo)"); // Verifica o estado final
    }
}

```

**Explicação do Exemplo:**

- **`EventPublisher`**: Gerencia uma lista de `EventListener`s.
- **`CopyOnWriteArrayList<EventListener> listeners`**: É a lista de listeners. É ideal aqui porque eventos são publicados (leitura da lista) com frequência, mas listeners são adicionados ou removidos (escrita na lista) com menos frequência.
- **`addListener` e `removeListener`**: Essas operações de escrita disparam a "cópia" do array interno.
- **`publishEvent`**: A iteração sobre a lista (`for (EventListener listener : listeners)`) é o ponto chave. Mesmo que outra thread esteja adicionando ou removendo um listener *durante* esta iteração, o iterador está trabalhando em uma "fotografia" (snapshot) da lista no momento em que a iteração começou. Isso garante que não haverá `ConcurrentModificationException` e que a iteração é consistente para aquele ponto no tempo.
- **`main`**: Demonstra a concorrência. Uma thread (`modifyListenerTask`) adiciona e remove um listener (`listener3`) enquanto outras threads (`publishTask`) estão publicando eventos. Observe que o `listener3` pode ou não receber o evento dependendo do *timing* da cópia. Se o evento foi publicado enquanto o `listener3` estava na cópia antiga da lista, ele receberá. Se o evento foi publicado depois que a cópia foi atualizada com `listener3`, ele também receberá. O mais importante é que a aplicação não quebra com exceções de modificação concorrente.

### 5. Informações Adicionais

### `InputStream` vs `Reader`

É importante notar a distinção entre `InputStream` e `Reader`.

- **`InputStream`**: Para ler **bytes** (dados binários ou sequências de bytes). É a base para todo tipo de I/O de baixo nível.
- **`Reader`**: Para ler **caracteres**. Lida com a codificação de caracteres (charset), convertendo bytes em caracteres e vice-versa. É a base para trabalhar com texto.

Para converter um `InputStream` em um `Reader` (e vice-versa), você usa `InputStreamReader` (que usa um `Charset`) e `OutputStreamWriter`. Por exemplo, para ler um arquivo de texto com `UTF-8`:

```java
try (BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream("meu_arquivo.txt"), StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    e.printStackTrace();
}

```

### `InputStream` e o mundo de NIO.2

Embora `InputStream` seja parte do I/O "tradicional" (também conhecido como I/O "bloqueante" ou "antigo"), o Java 7 introduziu o NIO.2 (`java.nio.file`), que oferece uma API muito mais moderna e robusta para manipulação de arquivos e diretórios, incluindo leitura.

A API `Files` em NIO.2 pode, por baixo dos panos, ainda usar `InputStream`s, mas oferece métodos mais convenientes e eficientes. Por exemplo, para ler todas as linhas de um arquivo:

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class NIO2FileReading {
    public static void main(String[] args) {
        Path filePath = Paths.get("meu_arquivo.txt"); // Certifique-se que este arquivo existe

        try {
            // Leitura de todas as linhas de um arquivo
            List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
            lines.forEach(System.out::println);

            // Obtenção de um InputStream para leitura tradicional (ainda possível e útil)
            try (java.io.InputStream is = Files.newInputStream(filePath)) {
                int byteRead;
                while ((byteRead = is.read()) != -1) {
                    // Processa byte a byte
                    // System.out.print((char) byteRead); // Descomente para ver como seria a leitura de caracteres
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

Para um desenvolvedor Backend que busca performance, o NIO.2 é preferível para a maioria das operações de arquivo de alto nível, enquanto `InputStream`s continuam sendo a base para trabalhar com dados binários de forma mais granular ou com outras fontes de dados não-arquivos (como sockets).

### 6. Referências para Estudo Independente

Para aprofundar seus conhecimentos em `InputStream` e I/O em Java, Gedê, sugiro os seguintes recursos:

- **Documentação Oficial da Oracle (Java SE API):**
    - `InputStream` Class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/InputStream.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/InputStream.html)
    - `FileInputStream` Class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/FileInputStream.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/FileInputStream.html)
    - `BufferedInputStream` Class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedInputStream.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/BufferedInputStream.html)
    - `DataInputStream` Class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/DataInputStream.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/DataInputStream.html)
    - `ObjectInputStream` Class: [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/ObjectInputStream.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/ObjectInputStream.html)
    - NIO.2 (package `java.nio.file`): [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/package-summary.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/nio/file/package-summary.html)
- **Livros Recomendados:**
    - **"Effective Java" por Joshua Bloch:** Contém seções excelentes sobre I/O e gerenciamento de recursos (`try-with-resources`).
    - **"Java Concurrency in Practice" por Brian Goetz et al.:** Um clássico para entender a fundo concorrência em Java. Embora não seja focado em I/O, os princípios se aplicam ao uso de streams em ambientes concorrentes.
- **Tutoriais Online:**
    - **Baeldung - Java IO Tutorial:** [https://www.baeldung.com/java-io](https://www.baeldung.com/java-io) (Um excelente recurso com muitos exemplos práticos.)
    - **The Java Tutorials - Basic I/O (Oracle):** [https://docs.oracle.com/javase/tutorial/essential/io/index.html](https://docs.oracle.com/javase/tutorial/essential/io/index.html) (Oferece uma boa visão geral e exemplos da própria Oracle.)

Esses recursos o ajudarão a solidificar seus conhecimentos e a explorar os tópicos mais a fundo, Gedê. Qualquer dúvida, é só chamar!