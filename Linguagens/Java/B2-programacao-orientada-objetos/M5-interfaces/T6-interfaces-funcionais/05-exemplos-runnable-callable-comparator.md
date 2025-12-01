# T6.05 - Exemplos: Runnable, Callable, Comparator

## Introdução

**Interfaces funcionais clássicas**: Runnable, Callable, Comparator.

```java
// Runnable: execução sem retorno
Runnable tarefa = () -> System.out.println("Executando");
new Thread(tarefa).start();

// Callable: execução com retorno
Callable<String> calculo = () -> "Resultado";
Future<String> futuro = executor.submit(calculo);

// Comparator: comparação de objetos
Comparator<String> porTamanho = (a, b) -> a.length() - b.length();
List<String> lista = Arrays.asList("aaa", "b", "cc");
lista.sort(porTamanho);
```

**Pré-Java 8**: já existiam.
**Java 8+**: podem usar lambdas.

---

## Fundamentos

### 1. Runnable

**Runnable**: execução sem retorno, sem parâmetros.

```java
@FunctionalInterface
public interface Runnable {
    void run();
}

// Antes do Java 8: classe anônima
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Executando");
    }
};

// Java 8+: lambda
Runnable r2 = () -> System.out.println("Executando");

// Executar
r2.run();

// Em threads
new Thread(() -> {
    System.out.println("Thread executando");
}).start();
```

### 2. Callable

**Callable**: execução com retorno, pode lançar exceção.

```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}

// Lambda
Callable<Integer> calculo = () -> {
    Thread.sleep(1000);
    return 42;
};

// ExecutorService
ExecutorService executor = Executors.newSingleThreadExecutor();
Future<Integer> futuro = executor.submit(calculo);

// Obter resultado
Integer resultado = futuro.get(); // 42

executor.shutdown();
```

### 3. Comparator

**Comparator**: comparação de objetos.

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}

// Lambda
Comparator<String> porTamanho = (a, b) -> a.length() - b.length();

List<String> lista = Arrays.asList("aaa", "b", "cc");
lista.sort(porTamanho);
// ["b", "cc", "aaa"]

// Method reference
Comparator<String> natural = String::compareTo;
lista.sort(natural);
// ["aaa", "b", "cc"]
```

### 4. Runnable vs Callable

**Runnable**: sem retorno.
**Callable**: com retorno.

```java
// Runnable: sem retorno
Runnable tarefa1 = () -> {
    System.out.println("Executando");
    // Sem return
};

// Callable: com retorno
Callable<String> tarefa2 = () -> {
    System.out.println("Executando");
    return "Resultado";
};

// Runnable: não lança checked exception
Runnable r = () -> {
    // Files.readString(...); // ERRO: IOException
};

// Callable: lança checked exception
Callable<String> c = () -> {
    return Files.readString(Path.of("arquivo.txt")); // OK
};
```

### 5. Comparator.comparing()

**Comparator.comparing()**: factory method.

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // Getters
    public String getNome() { return nome; }
    public int getIdade() { return idade; }
}

// Comparator.comparing()
Comparator<Pessoa> porNome = Comparator.comparing(Pessoa::getNome);
Comparator<Pessoa> porIdade = Comparator.comparing(Pessoa::getIdade);

List<Pessoa> pessoas = ...;
pessoas.sort(porNome);
pessoas.sort(porIdade);

// Reversed
pessoas.sort(porNome.reversed());
```

### 6. Comparator.naturalOrder()

**Comparator.naturalOrder()**: ordem natural.

```java
List<String> nomes = Arrays.asList("João", "Maria", "Ana");

// Ordem natural
nomes.sort(Comparator.naturalOrder());
// ["Ana", "João", "Maria"]

// Ordem reversa
nomes.sort(Comparator.reverseOrder());
// ["Maria", "João", "Ana"]
```

### 7. Comparator.thenComparing()

**Comparator.thenComparing()**: comparação encadeada.

```java
public class Pessoa {
    private String nome;
    private int idade;
    
    // Getters
}

// Comparação encadeada
Comparator<Pessoa> comparador = Comparator
    .comparing(Pessoa::getNome)
    .thenComparing(Pessoa::getIdade);

List<Pessoa> pessoas = ...;
pessoas.sort(comparador);
// Ordena por nome, depois por idade
```

### 8. Runnable em Threads

**Runnable**: base para threads.

```java
// Thread com lambda
Thread thread1 = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        System.out.println("Thread: " + i);
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});

thread1.start();

// ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(2);

executor.execute(() -> System.out.println("Tarefa 1"));
executor.execute(() -> System.out.println("Tarefa 2"));

executor.shutdown();
```

### 9. Callable com Future

**Callable**: retorna Future.

```java
ExecutorService executor = Executors.newSingleThreadExecutor();

// Callable retorna Future
Future<Integer> futuro = executor.submit(() -> {
    Thread.sleep(1000);
    return 42;
});

// Verificar se concluído
boolean concluido = futuro.isDone();

// Cancelar
// futuro.cancel(true);

// Obter resultado (bloqueia)
Integer resultado = futuro.get(); // 42

// Timeout
Integer resultado2 = futuro.get(2, TimeUnit.SECONDS);

executor.shutdown();
```

### 10. Comparator Personalizado

**Comparator**: lógica customizada.

```java
// Comparador por tamanho de string
Comparator<String> porTamanho = (a, b) -> {
    int diff = a.length() - b.length();
    if (diff != 0) {
        return diff;
    }
    return a.compareTo(b); // Desempate: ordem alfabética
};

List<String> lista = Arrays.asList("aaa", "b", "cc", "d");
lista.sort(porTamanho);
// ["b", "d", "cc", "aaa"]

// Comparador null-safe
Comparator<String> nullSafe = Comparator.nullsFirst(
    Comparator.naturalOrder()
);

List<String> comNull = Arrays.asList("b", null, "a");
comNull.sort(nullSafe);
// [null, "a", "b"]
```

---

## Aplicabilidade

**Runnable**:
- **Threads** (Thread, ExecutorService)
- **Tasks sem retorno**
- **Callbacks simples**

**Callable**:
- **Tasks com retorno**
- **Computação assíncrona**
- **ExecutorService**

**Comparator**:
- **Ordenação** (sort)
- **TreeSet, TreeMap**
- **Streams** (sorted)

---

## Armadilhas

### 1. Runnable com Checked Exception

```java
// ❌ ERRO: Runnable não pode lançar checked
// Runnable r = () -> {
//     Files.readString(Path.of("arquivo.txt")); // ERRO
// };

// ✅ OK: tratar exceção
Runnable r = () -> {
    try {
        Files.readString(Path.of("arquivo.txt"));
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
};

// ✅ OK: Callable permite checked
Callable<String> c = () -> {
    return Files.readString(Path.of("arquivo.txt"));
};
```

### 2. Esquecer shutdown em Executor

```java
ExecutorService executor = Executors.newFixedThreadPool(2);

executor.execute(() -> System.out.println("Tarefa"));

// ⚠️ Esquecer shutdown: JVM não encerra
// executor.shutdown(); // NÃO esquece!

// ✅ Sempre fazer shutdown
executor.shutdown();

// Ou try-with-resources (Java 19+)
try (ExecutorService exec = Executors.newVirtualThreadPerTaskExecutor()) {
    exec.execute(() -> System.out.println("Tarefa"));
} // Auto shutdown
```

### 3. Comparator Inconsistente

```java
// ❌ ERRO: comparador inconsistente
Comparator<Integer> errado = (a, b) -> {
    if (a > b) return 1;
    if (a < b) return -1;
    return 1; // ERRO: deveria ser 0 quando iguais
};

// ✅ OK: consistente
Comparator<Integer> correto = (a, b) -> {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0; // a == b
};

// ✅ Melhor: usar Integer.compare
Comparator<Integer> melhor = Integer::compare;
```

### 4. get() Sem Timeout

```java
ExecutorService executor = Executors.newSingleThreadExecutor();

Future<String> futuro = executor.submit(() -> {
    Thread.sleep(10000); // 10 segundos
    return "Resultado";
});

// ⚠️ Bloqueia indefinidamente
// String resultado = futuro.get(); // Bloqueia 10s

// ✅ Com timeout
try {
    String resultado = futuro.get(2, TimeUnit.SECONDS);
} catch (TimeoutException e) {
    System.out.println("Timeout!");
    futuro.cancel(true);
}

executor.shutdown();
```

### 5. Comparator com null

```java
Comparator<String> simples = String::compareTo;

List<String> comNull = Arrays.asList("b", null, "a");

// ❌ ERRO: NullPointerException
// comNull.sort(simples); // ERRO

// ✅ Null-safe
Comparator<String> nullSafe = Comparator.nullsFirst(
    Comparator.naturalOrder()
);
comNull.sort(nullSafe);
```

### 6. Confundir compare() e compareTo()

```java
// ⚠️ Confusão: compareTo() é da classe
String a = "abc";
int resultado1 = a.compareTo("def"); // String.compareTo()

// compare() é do Comparator
Comparator<String> c = String::compareTo;
int resultado2 = c.compare("abc", "def"); // Comparator.compare()
```

### 7. Runnable vs Callable em Executor

```java
ExecutorService executor = Executors.newSingleThreadExecutor();

// Runnable: execute() ou submit()
executor.execute(() -> System.out.println("Runnable"));
Future<?> f1 = executor.submit(() -> System.out.println("Runnable"));

// Callable: apenas submit()
Future<String> f2 = executor.submit(() -> "Callable");

// ⚠️ execute() não retorna Future
// Future<?> f3 = executor.execute(() -> "OK"); // ERRO

executor.shutdown();
```

---

## Boas Práticas

### 1. Lambda para Runnable Simples

```java
// ✅ Lambda para tarefas simples
Runnable tarefa = () -> System.out.println("Executando");

// ✅ Bloco para tarefas complexas
Runnable complexa = () -> {
    System.out.println("Iniciando...");
    // Lógica complexa
    System.out.println("Concluído");
};
```

### 2. Callable para Retorno

```java
// ✅ Use Callable quando precisa de retorno
Callable<Integer> calculo = () -> {
    // Computação pesada
    return 42;
};

ExecutorService executor = Executors.newSingleThreadExecutor();
Future<Integer> futuro = executor.submit(calculo);
Integer resultado = futuro.get();
executor.shutdown();
```

### 3. Comparator.comparing()

```java
// ✅ Comparator.comparing() para propriedades
Comparator<Pessoa> porNome = Comparator.comparing(Pessoa::getNome);

// ✅ Encadeado
Comparator<Pessoa> completo = Comparator
    .comparing(Pessoa::getNome)
    .thenComparing(Pessoa::getIdade);
```

### 4. Null-Safe Comparators

```java
// ✅ Null-safe
Comparator<String> nullsFirst = Comparator.nullsFirst(
    Comparator.naturalOrder()
);

Comparator<String> nullsLast = Comparator.nullsLast(
    Comparator.naturalOrder()
);
```

### 5. Try-Catch em Runnable

```java
// ✅ Tratar exceções em Runnable
Runnable tarefa = () -> {
    try {
        // Código que pode lançar exceção
        Files.readString(Path.of("arquivo.txt"));
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
};
```

### 6. Timeout em Future.get()

```java
// ✅ Sempre usar timeout em get()
try {
    String resultado = futuro.get(5, TimeUnit.SECONDS);
} catch (TimeoutException e) {
    System.out.println("Timeout!");
    futuro.cancel(true);
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}
```

### 7. shutdown() em Executor

```java
// ✅ Sempre fazer shutdown
ExecutorService executor = Executors.newFixedThreadPool(2);

try {
    executor.execute(() -> System.out.println("Tarefa"));
} finally {
    executor.shutdown();
}
```

### 8. Comparator Reversed

```java
// ✅ reversed() para ordem inversa
Comparator<String> crescente = Comparator.naturalOrder();
Comparator<String> decrescente = crescente.reversed();

List<String> lista = Arrays.asList("c", "a", "b");
lista.sort(decrescente);
// ["c", "b", "a"]
```

### 9. Method Reference

```java
// ✅ Method reference quando possível
Comparator<String> c1 = String::compareTo;

// ⚠️ Lambda desnecessário
Comparator<String> c2 = (a, b) -> a.compareTo(b);
```

### 10. CompletableFuture para Composição

```java
// ✅ CompletableFuture para composição assíncrona
CompletableFuture<Integer> futuro = CompletableFuture.supplyAsync(() -> {
    return 42;
});

futuro.thenApply(resultado -> resultado * 2)
      .thenAccept(System.out::println); // 84
```

---

## Resumo

**Runnable**: execução sem retorno.

```java
@FunctionalInterface
public interface Runnable {
    void run();
}

Runnable tarefa = () -> System.out.println("Executando");
new Thread(tarefa).start();
```

**Callable**: execução com retorno.

```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}

Callable<Integer> calculo = () -> 42;
Future<Integer> futuro = executor.submit(calculo);
```

**Comparator**: comparação de objetos.

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}

Comparator<String> porTamanho = (a, b) -> a.length() - b.length();
lista.sort(porTamanho);
```

**Runnable vs Callable**:

| Aspecto | Runnable | Callable |
|---------|----------|----------|
| **Retorno** | void | V |
| **Exceção** | Não | Sim (checked) |
| **Método** | run() | call() |
| **Future** | Não | Sim |

**Comparator.comparing()**:
```java
Comparator<Pessoa> porNome = Comparator.comparing(Pessoa::getNome);
```

**Comparator.naturalOrder()**:
```java
lista.sort(Comparator.naturalOrder());
lista.sort(Comparator.reverseOrder());
```

**Comparator.thenComparing()**:
```java
Comparator<Pessoa> completo = Comparator
    .comparing(Pessoa::getNome)
    .thenComparing(Pessoa::getIdade);
```

**Runnable em Threads**:
```java
new Thread(() -> System.out.println("Thread")).start();

executor.execute(() -> System.out.println("Tarefa"));
```

**Callable com Future**:
```java
Future<Integer> futuro = executor.submit(() -> 42);
Integer resultado = futuro.get();
```

**Boas práticas**:
- Lambda para Runnable simples
- Callable para retorno
- Comparator.comparing()
- Null-safe comparators
- Try-catch em Runnable
- Timeout em Future.get()
- shutdown() em Executor
- Comparator reversed()
- Method reference
- CompletableFuture para composição

**Armadilhas**:
- ❌ Runnable com checked exception
- ❌ Esquecer shutdown em Executor
- ❌ Comparator inconsistente
- ❌ get() sem timeout
- ❌ Comparator com null
- ❌ Confundir compare() e compareTo()
- ❌ Runnable vs Callable em Executor

**Regra de Ouro**: Use **Runnable** para tarefas **sem retorno**. Use **Callable** para tarefas **com retorno** ou que lançam **checked exceptions**. Use **Comparator** para **ordenação** customizada. **Runnable**, **Callable** e **Comparator** são interfaces funcionais clássicas (pré-Java 8) que podem usar **lambdas** (Java 8+). Sempre faça **shutdown()** em ExecutorService. Use **timeout** em Future.get(). Use **Comparator.comparing()** para propriedades. Use **null-safe** comparators.
