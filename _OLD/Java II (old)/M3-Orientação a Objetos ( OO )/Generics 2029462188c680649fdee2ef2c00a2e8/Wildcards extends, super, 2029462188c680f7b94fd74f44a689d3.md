# Wildcards: ? extends, ? super, ?.

Com certeza, Gedê\! Vamos detalhar os Wildcards em Java para você. É um tópico fundamental quando se trabalha com Generics e coleções, e entender bem isso vai ser super importante no seu dia a dia como desenvolvedor Backend.

---

## Wildcards em Java: Flexibilidade com Tipos Genéricos

### 1\. Introdução

No contexto dos Generics em Java, os *wildcards* (coringas, em tradução livre) são símbolos especiais (`?`) que nos permitem criar um código mais flexível ao trabalhar com coleções e métodos genéricos. Eles são essenciais para lidar com a covariância e contravariância de tipos, que é a capacidade de um tipo ser substituído por um subtipo ou um supertipo, respectivamente. A sua relevância é enorme no desenvolvimento Java, especialmente ao lidar com APIs de coleções, onde a flexibilidade de aceitar diferentes subtipos de uma classe ou supertipos é crucial para a reutilização de código e a segurança de tipos. Sem wildcards, muitos cenários comuns de manipulação de coleções se tornariam excessivamente rígidos ou levariam a erros de compilação.

Wildcards servem para definir limites para os tipos que podem ser usados com um tipo genérico. Eles evitam problemas como a impossibilidade de atribuir um `List<Integer>` a um `List<Number>`, mesmo que `Integer` seja um subtipo de `Number`. Essa restrição existe para garantir a segurança de tipos em tempo de compilação, e os wildcards são a solução para flexibilizar isso de forma controlada.

### 2\. Sumário

- **Definição e Conceitos Fundamentais**
- **Wildcard Ilimitado (`?`)**
- **Wildcard de Limite Superior (`? extends`)**
- **Wildcard de Limite Inferior (`? super`)**
- **Restrições e Boas Práticas**
- **Exemplos de Código Otimizados**
- **Informações Adicionais**
- **Referências para Estudo Independente**

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

Wildcards (`?`) são usados em conjunto com Generics para representar um tipo desconhecido. Eles permitem que você escreva métodos e classes que operam em uma variedade de tipos, mas com restrições ou flexibilidade específicas. O objetivo principal é fornecer uma forma de lidar com a herança em tipos genéricos, que, por padrão, não é covariante. Ou seja, um `List<Subtipo>` *não* é um `List<Supertipo>`. Os wildcards corrigem essa lacuna de uma forma segura.

Os três tipos de wildcards são:

- **Wildcard Ilimitado (`?`):** Representa um tipo desconhecido, sem restrições.
- **Wildcard de Limite Superior (`? extends`):** Restringe o tipo desconhecido a ser um subtipo de um determinado tipo.
- **Wildcard de Limite Inferior (`? super`):** Restringe o tipo desconhecido a ser um supertipo de um determinado tipo.

### Wildcard Ilimitado (`?`)

**Sintaxe e Estrutura:**`List<?>` ou `Set<?>`

**Componentes Principais:**
O wildcard ilimitado significa "qualquer tipo". Ele é útil quando você precisa de um método que opere em uma `Collection` de tipos desconhecidos, mas que não se importa com o tipo específico dos elementos, como imprimir todos os elementos ou limpar a coleção.

**Restrições de uso:**
Você **não pode adicionar** elementos a uma coleção que usa o wildcard ilimitado, a menos que seja `null`. Isso ocorre porque o compilador não sabe qual é o tipo real e não pode garantir a segurança de tipo na adição. Você **pode ler** elementos, mas eles serão tratados como `Object`.

### Wildcard de Limite Superior (`? extends`)

**Sintaxe e Estrutura:**`List<? extends Tipo>` ou `Set<? extends Tipo>`

**Componentes Principais:**
O `? extends Tipo` significa "qualquer tipo que seja `Tipo` ou um subtipo de `Tipo`". Ele é usado principalmente para **leitura** (get) de dados de uma coleção. Pense nele como uma restrição de que a coleção pode conter `Tipo` ou qualquer coisa mais específica. Isso é conhecido como **covariância**.

**Restrições de uso:**
Você **não pode adicionar** elementos a uma coleção declarada com `? extends`. Por exemplo, se você tem `List<? extends Number>`, ela pode ser um `List<Integer>` ou `List<Double>`. Se você tentar adicionar um `Integer`, mas a lista for na verdade um `List<Double>`, ocorreria um erro em tempo de execução. Para garantir a segurança de tipo, a adição é proibida. Você **pode ler** elementos, e eles serão tratados como sendo do tipo `Tipo`.

### Wildcard de Limite Inferior (`? super`)

**Sintaxe e Estrutura:**`List<? super Tipo>` ou `Set<? super Tipo>`

**Componentes Principais:**
O `? super Tipo` significa "qualquer tipo que seja `Tipo` ou um supertipo de `Tipo`". Ele é usado principalmente para **escrita** (put) de dados em uma coleção. Pense nele como uma restrição de que a coleção pode conter `Tipo` ou qualquer coisa mais genérica (um ancestral de `Tipo`). Isso é conhecido como **contravariância**.

**Restrições de uso:**
Você **pode adicionar** elementos do tipo `Tipo` ou qualquer subtipo de `Tipo` a uma coleção declarada com `? super Tipo`. Isso ocorre porque qualquer elemento que você adicionar será compatível com o tipo base (`Tipo`) ou com o supertipo da lista. Você **pode ler** elementos, mas eles serão tratados como `Object`, pois o tipo real do supertipo é desconhecido.

### 4\. Exemplos de Código Otimizados

Para ilustrar os wildcards, vamos usar uma hierarquia simples de classes:

```java
// Hierarquia de classes
class Animal {
    public void fazerSom() {
        System.out.println("Animal faz um som.");
    }
}

class Cachorro extends Animal {
    @Override
    public void fazerSom() {
        System.out.println("Cachorro late.");
    }
    public void latir() {
        System.out.println("Au Au!");
    }
}

class Gato extends Animal {
    @Override
    public void fazerSom() {
        System.out.println("Gato mia.");
    }
    public void miar() {
        System.out.println("Miau!");
    }
}

class Labrador extends Cachorro {
    @Override
    public void fazerSom() {
        System.out.println("Labrador late alegremente.");
    }
}

```

### Exemplo 1: Wildcard Ilimitado (`?`)

**Caso de Uso:** Imprimir os elementos de qualquer tipo de lista.

```java
import java.util.Arrays;
import java.util.List;

public class WildcardIlimitadoExemplo {

    // Método que pode imprimir qualquer tipo de lista
    public static void imprimirLista(List<?> lista) {
        System.out.println("\\n--- Imprimindo Lista ---");
        for (Object elemento : lista) {
            System.out.println(elemento);
        }
        // Restrição: Não é possível adicionar elementos (exceto null)
        // lista.add(new Object()); // Erro de compilação
        // lista.add(null); // Única adição permitida, mas não útil para o contexto
    }

    public static void main(String[] args) {
        List<Integer> numeros = Arrays.asList(1, 2, 3);
        List<String> nomes = Arrays.asList("Alice", "Bob", "Charlie");
        List<Cachorro> cachorros = Arrays.asList(new Cachorro(), new Labrador());

        imprimirLista(numeros);
        imprimirLista(nomes);
        imprimirLista(cachorros);
    }
}

```

**Explicação:** O método `imprimirLista` aceita um `List<?>`. Isso significa que ele pode aceitar uma lista de qualquer tipo, seja `Integer`, `String` ou `Cachorro`. A flexibilidade é alta para leitura, mas a segurança de tipo impede a adição de novos elementos, pois o tipo exato da lista em tempo de execução é desconhecido para o compilador.

### Exemplo 2: Wildcard de Limite Superior (`? extends`)

**Caso de Uso:** Processar uma lista de animais ou seus subtipos (leitura).

```java
import java.util.ArrayList;
import java.util.List;

public class WildcardExtendsExemplo {

    // Método que aceita uma lista de Animal ou qualquer subtipo de Animal
    public static void fazerTodosOsSons(List<? extends Animal> animais) {
        System.out.println("\\n--- Fazendo Sons dos Animais ---");
        for (Animal animal : animais) { // Podemos ler como Animal
            animal.fazerSom();
        }
        // Restrição: Não é possível adicionar elementos a esta lista
        // animais.add(new Cachorro()); // Erro de compilação
        // animais.add(new Gato());     // Erro de compilação
    }

    // Outro caso de uso: Encontrar o maior número em uma lista de Numbers ou seus subtipos
    public static double encontrarMaiorNumero(List<? extends Number> numeros) {
        double max = Double.MIN_VALUE;
        for (Number num : numeros) { // Podemos ler como Number
            if (num.doubleValue() > max) {
                max = num.doubleValue();
            }
        }
        return max;
    }

    public static void main(String[] args) {
        List<Cachorro> cachorros = new ArrayList<>();
        cachorros.add(new Cachorro());
        cachorros.add(new Labrador());

        List<Gato> gatos = new ArrayList<>();
        gatos.add(new Gato());

        List<Animal> animaisMisturados = new ArrayList<>();
        animaisMisturados.add(new Cachorro());
        animaisMisturados.add(new Gato());

        fazerTodosOsSons(cachorros);
        fazerTodosOsSons(gatos);
        fazerTodosOsSons(animaisMisturados);

        List<Integer> inteiros = Arrays.asList(10, 5, 20);
        List<Double> doubles = Arrays.asList(10.5, 5.2, 20.8);

        System.out.println("\\nMaior inteiro: " + encontrarMaiorNumero(inteiros));
        System.out.println("Maior double: " + encontrarMaiorNumero(doubles));
    }
}

```

**Explicação:** `fazerTodosOsSons` pode receber `List<Cachorro>`, `List<Gato>` ou `List<Animal>`. Ele garante que todos os elementos são pelo menos do tipo `Animal`, permitindo chamar o método `fazerSom()` com segurança. A proibição de adição é para manter a segurança de tipo; se `fazerTodosOsSons` recebesse um `List<Cachorro>` e permitisse adicionar um `Gato`, a lista conteria um elemento do tipo errado.

### Exemplo 3: Wildcard de Limite Inferior (`? super`)

**Caso de Uso:** Adicionar elementos a uma lista que pode conter um determinado tipo ou seus supertipos (escrita).

```java
import java.util.ArrayList;
import java.util.List;

public class WildcardSuperExemplo {

    // Método que aceita uma lista de Cachorro ou qualquer supertipo de Cachorro
    public static void adicionarCachorros(List<? super Cachorro> listaAnimais) {
        System.out.println("\\n--- Adicionando Cachorros ---");
        listaAnimais.add(new Cachorro());      // OK, pode adicionar Cachorro
        listaAnimais.add(new Labrador());      // OK, pode adicionar subtipos de Cachorro
        // listaAnimais.add(new Gato()); // Erro de compilação: Gato não é super de Cachorro
    }

    public static void main(String[] args) {
        List<Animal> animais = new ArrayList<>();
        adicionarCachorros(animais); // Lista de Animal (super de Cachorro)
        // Após a chamada, 'animais' contém um Cachorro e um Labrador
        animais.forEach(a -> System.out.println("Animal na lista: " + a.getClass().getSimpleName()));

        List<Cachorro> cachorros = new ArrayList<>();
        adicionarCachorros(cachorros); // Lista de Cachorro (igual a Cachorro)
        cachorros.forEach(c -> System.out.println("Cachorro na lista: " + c.getClass().getSimpleName()));

        // Exemplo com Numbers
        List<Number> numbers = new ArrayList<>();
        numbers.add(10);
        numbers.add(20.5);

        System.out.println("\\n--- Adicionando Inteiros (usando List<? super Integer>) ---");
        // Método que pode adicionar Integers ou seus subtipos a uma lista de Integer, Number ou Object
        adicionarInteiros(numbers); // OK, numbers é List<Number>, que é <? super Integer>
        numbers.forEach(n -> System.out.println("Número na lista: " + n));

        List<Object> objects = new ArrayList<>();
        adicionarInteiros(objects); // OK, objects é List<Object>, que é <? super Integer>
        objects.forEach(o -> System.out.println("Objeto na lista: " + o));
    }

    public static void adicionarInteiros(List<? super Integer> lista) {
        lista.add(100); // Adiciona um Integer
        lista.add(200); // Adiciona outro Integer
    }
}

```

**Explicação:** O método `adicionarCachorros` pode receber `List<Cachorro>` ou `List<Animal>`. Ele permite adicionar instâncias de `Cachorro` ou `Labrador` (subtipo de `Cachorro`) a essas listas, pois o compilador sabe que qualquer elemento adicionado será compatível com o tipo base (`Cachorro`) ou com o supertipo da lista. No entanto, ao ler, os elementos são tratados como `Object`, pois o tipo exato do supertipo (e o que mais ele pode conter) é desconhecido.

### 5\. Informações Adicionais

### Princípio PECS (Producer-Extends, Consumer-Super)

Uma regra mnemônica muito útil para lembrar quando usar `? extends` e `? super` é o **PECS**:

- **P**roducer - **E**xtends: Se sua coleção está agindo como um **produtor** de dados (você está lendo/obtendo elementos dela), use `? extends`.
- **C**onsumer - **S**uper: Se sua coleção está agindo como um **consumidor** de dados (você está escrevendo/adicionando elementos a ela), use `? super`.

Se você tanto lê quanto escreve, geralmente você não usará wildcards e trabalhará com o tipo genérico exato (ex: `List<Type>`).

### Wildcards e Assinaturas de Métodos

Wildcards são frequentemente usados em assinaturas de métodos para aumentar a flexibilidade. Por exemplo, o método `Collections.copy()`:

```java
public static <T> void copy(List<? super T> dest, List<? extends T> src)

```

Aqui, `dest` é um consumidor (recebe elementos de `src`), então usa `? super T`. `src` é um produtor (fornece elementos para `dest`), então usa `? extends T`. Isso permite copiar elementos de uma `List<Integer>` para uma `List<Number>`, por exemplo, ou de uma `List<Dog>` para uma `List<Animal>`.

### Quando evitar Wildcards

- **Na declaração de variáveis:** Evite usar wildcards (`List<?> minhaLista;`) para declarar variáveis locais ou campos, a menos que você realmente não se importe com o tipo e só precise iterar ou passar para um método que aceite `List<?>`. Isso torna o código menos legível e mais restritivo para operações de adição.
- **Em métodos que fazem leitura e escrita:** Se um método precisa tanto ler quanto adicionar elementos a uma coleção do mesmo tipo genérico, evite wildcards e use o tipo genérico específico (e.g., `void processarLista(List<String> lista)`).

### 6\. Referências para Estudo Independente

Para aprofundar ainda mais nos wildcards e Generics em Java, recomendo as seguintes referências:

- **Oracle Java Documentation - Generics Wildcards:**
    - [Understanding Wildcard Capturing](https://www.google.com/search?q=https://docs.oracle.com/javase/tutorial/java/generics/wildcardCapture.html)
    - [Upper Bounded Wildcards](https://docs.oracle.com/javase/tutorial/java/generics/upperBounded.html)
    - [Lower Bounded Wildcards](https://docs.oracle.com/javase/tutorial/java/generics/lowerBounded.html)
- **Effective Java by Joshua Bloch (3rd Edition) - Item 31: Favor generic methods:** Embora o item 31 seja sobre métodos genéricos, ele discute amplamente o uso de wildcards para flexibilidade e segurança de tipo. Um livro essencial para todo desenvolvedor Java.
- **Baeldung - Java Generics Wildcards:**
    - [Guide to Java Generics Wildcards](https://www.google.com/search?q=https://www.baeldung.com/java-generics-wildcards)
- **GeeksforGeeks - Wildcards in Java Generics:**
    - [Wildcards in Java Generics](https://www.google.com/search?q=https://www.geeksforgeeks.org/wildcards-in-java-generics/)

Espero que esta explicação detalhada ajude você a dominar os wildcards, Gedê\! Se tiver mais alguma dúvida ou quiser que eu explique outro tópico da grade, é só me dizer.