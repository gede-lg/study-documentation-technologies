# Optional: prevenindo NullPointer

**1. Introdução**

O *Optional* surgiu no Java 8 como parte de um esforço para reduzir a incidência de **`NullPointerException`** (NPE) em tempo de execução, que historicamente é uma das falhas mais comuns em aplicações Java. Em vez de retornar diretamente um objeto que pode ser `null`, um método pode retornar um `Optional<T>`, deixando explícito que ali pode ou não existir um valor.

- **Relevância e importância**
    - **Segurança de código**: torna óbvio ao consumidor de um método que é preciso lidar com a ausência de valor.
    - **Documentação explícita**: a assinatura `Optional<T>` documenta no tipo a possibilidade de “vazio”, sem depender apenas de documentação externa ou comentários.
    - **Facilita composição funcional**: o `Optional` oferece operações como `map`, `flatMap` e `filter`, permitindo manipulações encadeadas sem checagens manuais de `null`.
- **Definição e Conceitos Fundamentais**
    - **Tema Principal**: uso de `java.util.Optional` para encapsular valores que podem estar presentes ou não, prevenindo NPE.
    - **Subtemas**:
        1. **Criação** de instâncias (`of`, `ofNullable`, `empty`).
        2. **Acesso** ao valor (`get`, `orElse`, `orElseGet`, `orElseThrow`).
        3. **Transformação** de valores (`map`, `flatMap`).
        4. **Filtragem** de conteúdo (`filter`).
        5. **Integração** com Streams.
    - **Para que servem**: tornam o código mais robusto, legível e auto-documentado ao lidar com possíveis ausências de valor.

---

**2. Sumário**

1. [Introdução](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#1-introdu%C3%A7%C3%A3o)
2. [Sumário](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#2-sum%C3%A1rio)
3. [Conteúdo Detalhado](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#3-conte%C3%BAdo-detalhado)
    1. [Sintaxe e Estrutura](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#31-sintaxe-e-estrutura)
    2. [Componentes Principais](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#32-componentes-principais)
    3. [Restrições de Uso](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#33-restri%C3%A7%C3%B5es-de-uso)
4. [Exemplos de Código Otimizados](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#4-exemplos-de-c%C3%B3digo-otimizados)
5. [Informações Adicionais](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#5-informa%C3%A7%C3%B5es-adicionais)
6. [Referências para Estudo Independente](https://chatgpt.com/c/6838e5d3-6c60-8013-8c21-9a4ac300aba8#6-refer%C3%AAncias-para-estudo-independente)

---

## 3. Conteúdo Detalhado

### 3.1 Sintaxe e Estrutura

```java
package com.exemplo;

import java.util.Optional;

public class ExemploOptional {
    public static Optional<String> encontraUsuarioPorId(int id) {
        // Suponha que busca num repositório; aqui simplificado:
        String usuario = (id > 0) ? "Gustavo" : null;
        return Optional.ofNullable(usuario);
    }
}

```

- **`Optional<T>`**: tipo genérico que encapsula um valor de `T` ou vazio.
- **Instanciação**:
    - `Optional.of(value)` — erro se `value` for `null`.
    - `Optional.ofNullable(value)` — aceita `value` nulo criando um `Optional.empty()`.
    - `Optional.empty()` — cria um `Optional` sempre vazio.

### 3.2 Componentes Principais

1. **Criação**
    - `Optional<T> of(T value)`
    - `Optional<T> ofNullable(T value)`
    - `Optional<T> empty()`
2. **Acesso ao valor**
    - `T get()` — retorna o valor ou lança `NoSuchElementException` se vazio.
    - `T orElse(T other)` — retorna o valor ou `other` se vazio.
    - `T orElseGet(Supplier<? extends T> otherSupplier)` — similar a `orElse`, mas avalia o supplier **sob demanda**.
    - `<X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier)` — lança exceção customizada se vazio.
3. **Transformação**
    - `<U> Optional<U> map(Function<? super T, ? extends U> mapper)` — aplica `mapper` se presente, embrulha em novo `Optional`.
    - `<U> Optional<U> flatMap(Function<? super T, Optional<U>> mapper)` — igual a `map`, mas evita aninhamento de `Optional<Optional<U>>`.
4. **Filtragem**
    - `Optional<T> filter(Predicate<? super T> predicate)` — mantém o valor se `predicate` for `true`, senão retorna vazio.
5. **Interação com Streams**
    - `Optional<T>` pode ser convertido a `Stream<T>` usando `stream()`, facilitando integração com APIs de streams do Java 8.

### 3.3 Restrições de Uso

- **Não use `Optional` em campos de entidade** (JPA/Hibernate): pode quebrar frameworks que esperam setters/getters tradicionais.
- **Evite usar `Optional` em coleções** (ex.: `List<Optional<T>>`); prefira coleções vazias do que elementos opcionais.
- **Não serialize `Optional`** diretamente em APIs JSON; ferramentas de serialização podem não entender. Prefira campos normais e lógica de presença/ausência manual.

---

## 4. Exemplos de Código Otimizados

### 4.1 Uso Básico com `orElse` vs `orElseGet`

```java
public String saudacao(Optional<String> nomeOpt) {
    // Cuidado: orElse é avaliado sempre, mesmo se não precisar
    return "Olá, " + nomeOpt.orElse(criaNomeDefault());
}

public String saudacaoLazy(Optional<String> nomeOpt) {
    // orElseGet só executa o supplier se estiver vazio
    return "Olá, " + nomeOpt.orElseGet(this::criaNomeDefault);
}

private String criaNomeDefault() {
    // Simula operação custosa
    System.out.println("Criando nome default...");
    return "Visitante";
}

```

### 4.2 Encadeamento com `map` e `filter`

```java
public Optional<String> getDomainOfEmail(Optional<String> emailOpt) {
    return emailOpt
        .filter(email -> email.contains("@"))
        .map(email -> email.substring(email.indexOf('@') + 1));
}

// Uso:
Optional<String> dominio = getDomainOfEmail(Optional.of("aria@example.com"));
dominio.ifPresent(d -> System.out.println("Domínio: " + d));

```

### 4.3 Convertendo `Optional` em `Stream`

```java
public List<String> processaListaDeEmails(List<Optional<String>> emailsOpt) {
    return emailsOpt.stream()
        .flatMap(Optional::stream)      // filtra vazios e extrai valores
        .filter(e -> e.endsWith(".com"))
        .collect(Collectors.toList());
}

```

### 4.4 Lançando Exceção Customizada

```java
public User buscaUsuarioOuErro(int id) {
    return repository.findById(id)
        .orElseThrow(() -> new UsuarioNaoEncontradoException(id));
}

```

---

## 5. Informações Adicionais

- **`ifPresent` e `ifPresentOrElse`**:
    
    ```java
    opt.ifPresent(valor -> System.out.println("Achou: " + valor));
    opt.ifPresentOrElse(
        valor -> System.out.println("Achou: " + valor),
        ()    -> System.out.println("Não encontrado")
    );
    
    ```
    
- **Evite retornar `Optional<Optional<T>>`**: prefira `flatMap` em vez de `map` quando o mapper já retorna `Optional`.
- **Boas práticas**:
    - Use `Optional` em métodos públicos para sinalizar ausência de valor.
    - Não abuse de `get()` sem checar `isPresent()`, pois volta ao problema de NPE se vazio.
    - Prefira fluxos de tratamento funcionais (`map` → `filter` → `orElseThrow`) a checagens imperativas de `null`.

---

## 6. Referências para Estudo Independente

1. **Documentação Oracle – Optional**
    
    [https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)
    
2. **Baeldung – Guide to Optional in Java 8**
    
    [https://www.baeldung.com/java-optional](https://www.baeldung.com/java-optional)
    
3. **Livro “Effective Java” (3ª edição) – Item sobre Optional**
    
    Joshua Bloch, Capítulo 2 (“Create and Destroy Objects”), seção “Prefer Optional to return null”
    
4. **Vlad Mihalcea – Using Optional in JPA Entities (por que evitar)**
    
    [https://vladmihalcea.com/jpa-optional-entity/](https://vladmihalcea.com/jpa-optional-entity/)
    

---

> Resumo: O Optional não é apenas um invólucro para ausência de valor, mas uma API poderosa para encadear transformações, filtrar e tratar casos de “valor ausente” de forma declarativa, reduzindo dramaticamente a chance de NullPointerException e tornando seu código mais legível e auto-explicativo.
>