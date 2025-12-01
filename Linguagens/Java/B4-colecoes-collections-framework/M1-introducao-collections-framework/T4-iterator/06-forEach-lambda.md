# forEach com Lambda no Iterator: Análise Conceitual Profunda

## 🎯 Introdução e Definição

**forEach** é um método introduzido no Java 8 que permite **processar elementos** de uma coleção usando **expressões lambda** ou **method references**, oferecendo alternativa funcional aos loops tradicionais. Presente tanto em `Iterable` quanto em `Iterator`, representa mudança para programação funcional.

**Conceito Central:** forEach transforma iteração de **imperativa** (como fazer) para **declarativa** (o que fazer).

## 📋 Duas Versões de forEach

### 1. Iterable.forEach() - Processa Todos
```java
// Interface Iterable
default void forEach(Consumer<? super T> action) {
    Objects.requireNonNull(action);
    for (T t : this) {
        action.accept(t);
    }
}
```

**Uso:**
```java
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
nomes.forEach(nome -> System.out.println(nome));

// Ou com method reference:
nomes.forEach(System.out::println);
```

### 2. Iterator.forEachRemaining() - Processa Restantes
```java
// Interface Iterator
default void forEachRemaining(Consumer<? super E> action) {
    Objects.requireNonNull(action);
    while (hasNext())
        action.accept(next());
}
```

**Uso:**
```java
Iterator<String> it = nomes.iterator();
it.next();  // Consome primeiro elemento
it.forEachRemaining(nome -> System.out.println(nome));
// Processa apenas elementos restantes
```

## 🧠 Fundamentos Teóricos

### Programação Funcional vs Imperativa

**Imperativa (tradicional):**
```java
// Como fazer - loop explícito
List<String> nomes = Arrays.asList("Ana", "Bruno", "Carlos");
for (String nome : nomes) {
    System.out.println(nome);
}
```

**Declarativa (funcional):**
```java
// O que fazer - ação declarada
nomes.forEach(nome -> System.out.println(nome));
```

**Conceito:** forEach **abstrai mecânica de iteração**, focando na ação por elemento.

### Interface Consumer<T>

**Definição:**
```java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);  // Método abstrato

    default Consumer<T> andThen(Consumer<? super T> after) {
        // Composição de Consumers
    }
}
```

**Consumer** representa "consumidor" - aceita valor, não retorna nada (void).

**Exemplos:**
```java
// Lambda
Consumer<String> imprimir = s -> System.out.println(s);

// Method reference
Consumer<String> imprimir = System.out::println;

// Expressão inline
nomes.forEach(s -> System.out.println(s.toUpperCase()));
```

### Vantagens de forEach com Lambda

**1. Concisão:**
```java
// Antes
for (String nome : nomes) {
    System.out.println(nome);
}

// Depois
nomes.forEach(System.out::println);
```

**2. Composição:**
```java
Consumer<String> validar = s -> {
    if (s == null) throw new IllegalArgumentException();
};
Consumer<String> processar = s -> System.out.println(s.toUpperCase());

Consumer<String> validarEProcessar = validar.andThen(processar);
nomes.forEach(validarEProcessar);
```

**3. Closure Natural:**
```java
int contador = 0;
nomes.forEach(nome -> {
    // contador++;  // ❌ Variável deve ser effectively final
    System.out.println(contador + ": " + nome);
});
```

## 🔍 Análise Conceitual Profunda

### forEach vs Stream.forEach

**Iterable.forEach:**
```java
lista.forEach(elemento -> processar(elemento));
// Ordem garantida (mesma que iterator())
// Execução sequencial
```

**Stream.forEach:**
```java
lista.stream().forEach(elemento -> processar(elemento));
// Ordem NÃO garantida em streams paralelos
```

**Stream.forEachOrdered:**
```java
lista.stream().parallel().forEachOrdered(elemento -> processar(elemento));
// Ordem garantida mesmo em paralelo
```

### Limitações de forEach

**1. Não Pode Retornar Valor:**
```java
// ❌ Consumer é void
nomes.forEach(nome -> return nome.toUpperCase());  // ERRO

// ✅ Use map para transformações
List<String> maiusculas = nomes.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

**2. Não Pode Quebrar Loop:**
```java
// ❌ break/continue não funcionam
nomes.forEach(nome -> {
    if (nome.equals("Bruno")) {
        // break;  // ERRO: não pode sair
    }
});

// ✅ Use for tradicional ou Stream com filter
for (String nome : nomes) {
    if (nome.equals("Bruno")) break;
}
```

**3. Exceções Checked:**
```java
// ❌ Consumer não pode lançar checked exceptions
nomes.forEach(nome -> {
    // Files.write(...);  // IOException precisa try-catch
});

// ✅ Envolver em try-catch ou usar método wrapper
nomes.forEach(nome -> {
    try {
        Files.write(path, nome.getBytes());
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
});
```

## 🎯 Aplicabilidade e Contextos

### Quando Usar forEach

**✅ Use forEach quando:**
- Processar todos elementos sem condição de parada
- Ação é side effect puro (logging, I/O)
- Código funcional é mais legível

**❌ Evite forEach quando:**
- Precisa retornar valor transformado (use map)
- Precisa filtrar (use filter)
- Precisa quebrar loop (use for tradicional)
- Lógica complexa com múltiplos ifs

### Exemplos Práticos

**Logging:**
```java
usuarios.forEach(u -> logger.info("Processando: " + u.getNome()));
```

**Side Effects:**
```java
// Incrementar contador externo (cuidado com thread safety)
AtomicInteger contador = new AtomicInteger();
nomes.forEach(nome -> contador.incrementAndGet());
```

**Method Reference:**
```java
// Chamar método em cada elemento
pedidos.forEach(Pedido::processar);
pedidos.forEach(this::enviarEmail);
```

**Composição:**
```java
Consumer<Usuario> validar = u -> validator.validate(u);
Consumer<Usuario> salvar = u -> repository.save(u);
Consumer<Usuario> notificar = u -> emailService.send(u);

usuarios.forEach(validar.andThen(salvar).andThen(notificar));
```

## ⚠️ Considerações

**Effectively Final:** Variáveis capturadas por lambda devem ser effectively final

**Ordem de Execução:** forEach em Collection garante ordem de iterator(); em Stream paralelo não

**Performance:** forEach tem overhead similar a for-each tradicional

**Debugging:** Stack traces em lambdas podem ser menos claras

## 📚 Conclusão

forEach com lambda oferece sintaxe concisa e funcional para iterar coleções. `Iterable.forEach()` processa todos elementos, `Iterator.forEachRemaining()` processa restantes. Baseado em `Consumer<T>`, permite method references e composição. Limitações incluem impossibilidade de break/return e tratamento de checked exceptions. Use para side effects simples; para transformações complexas, prefira Streams API.
