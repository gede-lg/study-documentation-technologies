# Programação Funcional em Java: Introdução

1. **Introdução**
    
    A **Programação Funcional** em Java é um estilo de programação que trata a computação como a avaliação de funções matemáticas e evita estados mutáveis e efeitos colaterais. Com a chegada do Java 8, a linguagem ganhou recursos nativos para suportar esse paradigma, como *lambda expressions*, *method references*, *streams* e *interfaces funcionais*.
    
    - **Relevância**
        - Melhora a expressividade do código, tornando operações sobre coleções mais concisas e legíveis.
        - Facilita o paralelismo, já que funções puras (sem efeitos colaterais) podem ser executadas em paralelo com segurança.
        - Promove práticas de imutabilidade, que ajudam a evitar bugs relacionados a compartilhamento de estado.
    - **Definição e Conceitos Fundamentais**
        - **Tema Principal:** Programação Funcional em Java — o estilo de programar usando funções puras, expressões lambda, streams e outros recursos do Java 8+.
        - **Subtemas:**
            1. *Interfaces Funcionais* — contratos que possuem um único método abstrato.
            2. *Expressões Lambda* — sintaxe enxuta para implementar interfaces funcionais.
            3. *Method References* — atalho para referenciar diretamente métodos estáticos ou de instância.
            4. *Streams API* — abstração para processar coleções de forma declarativa (filtrar, mapear, reduzir).
        - **Para que servem:** cada subtema é uma peça do ecossistema funcional em Java, permitindo escrever código declarativo, evitar loops explícitos e manipular dados de forma concisa e legível.
2. **Sumário**
    - 1\. Introdução
    - 2\. Sumário
    - 3\. Conteúdo Detalhado
        - 3.1 Sintaxe e Estrutura
        - 3.2 Componentes Principais
        - 3.3 Restrições de Uso
    - 4\. Exemplos de Código Otimizados
    - 5\. Informações Adicionais
    - 6\. Referências para Estudo Independente
3. **Conteúdo Detalhado**
    
    ### 3.1 Sintaxe e Estrutura
    
    - **Expressão Lambda**
        
        ```java
        // Sintaxe básica: (param1, param2, ...) -> { corpo }
        (String s) -> s.length()
        (a, b) -> a + b
        
        ```
        
    - **Method Reference**
        
        ```java
        // Formato: Classe::método ou instância::método
        String::toUpperCase
        List<String> lista = ...
        lista.forEach(System.out::println);
        
        ```
        
    - **Streams**
        
        ```java
        List<Integer> nums = List.of(1, 2, 3, 4, 5);
        nums.stream()                      // cria o stream
            .filter(n -> n % 2 == 0)      // operação intermediária
            .map(n -> n * n)              // outra operação intermediária
            .forEach(System.out::println);// operação terminal
        
        ```
        
    
    ### 3.2 Componentes Principais
    
    - **Interfaces Funcionais**
        - Definidas pela anotação `@FunctionalInterface`.
        - Exemplos padrão em `java.util.function`:
            - `Predicate<T>` — `boolean test(T t)`
            - `Function<T, R>` — `R apply(T t)`
            - `Consumer<T>` — `void accept(T t)`
            - `Supplier<T>` — `T get()`
            - `BiFunction<T, U, R>` — `R apply(T t, U u)`
    - **Lambda Expressions**
        - Substituem classes anônimas, reduzindo boilerplate.
        - Podem capturar variáveis *effectively final* do escopo externo.
    - **Method References**
        - Sintaxe mais curta para lambdas que chamam métodos existentes.
        - Tipos:
            1. **Static Method:** `ClassName::staticMethod`
            2. **Instance Method of Particular Object:** `obj::instanceMethod`
            3. **Instance Method of an Arbitrary Object of a Type:** `ClassName::instanceMethod`
            4. **Constructor Reference:** `ClassName::new`
    - **Streams API**
        - **Operações Intermediárias** (devem retornar um novo `Stream`):
            - `filter(Predicate<? super T>)`
            - `map(Function<? super T, ? extends R>)`
            - `flatMap(Function<? super T, ? extends Stream<? extends R>>)`
            - `sorted()` / `sorted(Comparator<? super T>)`
            - `distinct()`, `limit(long)`, `skip(long)`
        - **Operações Terminais** (produzem resultado ou efeito colateral):
            - `forEach(Consumer<? super T>)`
            - `collect(Collector<? super T, A, R>)`
            - `reduce(...)`, `count()`, `min()`, `max()`, `anyMatch()`, etc.
        - **Paralelismo**
            - Basta trocar `stream()` por `parallelStream()` ou `stream().parallel()`
            - O framework gerencia o fork/join para execução concorrente
    
    ### 3.3 Restrições de Uso
    
    - **Efeitos Colaterais**: idealmente, funções puras sem alteração de estado externo. Misturar streams com código que altera variáveis externas pode gerar comportamento não determinístico.
    - **Performance**: streams podem ser menos performáticos que loops imperativos em casos muito simples ou de micro-otimização; use profiling.
    - **Leitura**: fluxos muito longos de operações podem prejudicar a legibilidade. Quebre em etapas nomeadas ou comente adequadamente.
    - **Boxing/Unboxing**: em coleções de tipos primitivos, prefira `IntStream`, `LongStream`, etc., para evitar sobrecarga.
4. **Exemplos de Código Otimizados**
    
    ```java
    import java.util.*;
    import java.util.stream.*;
    
    public class FuncionalExemplos {
    
        // 1. Filtrar e transformear uma lista de usuários ativos
        static List<String> nomesAtivos(List<Usuario> usuarios) {
            // bom uso de stream, legível e sem estado mutável
            return usuarios.stream()
                    .filter(u -> u.isAtivo())
                    .map(Usuario::getNomeCompleto)
                    .sorted()
                    .collect(Collectors.toList());
        }
    
        // 2. Calcular a soma de quadrados de inteiros pares
        static int somaQuadradosPares(int[] valores) {
            // uso de IntStream evita boxing
            return IntStream.of(valores)
                    .filter(n -> n % 2 == 0)
                    .map(n -> n * n)
                    .sum();
        }
    
        // 3. Uso de Optional para prevenir NullPointerException
        static Optional<String> emailUsuario(Optional<Usuario> optUser) {
            return optUser
                .map(Usuario::getPerfil)
                .map(Perfil::getContato)
                .map(Contato::getEmail);
        }
    
        // 4. Paralelismo em um fluxo grande
        static long contarOcorrenciasParalelas(List<String> textos, String termo) {
            return textos.parallelStream()
                    .filter(t -> t.contains(termo))
                    .count();
        }
    }
    
    ```
    
    > Boas práticas
    > 
    > - Prefira `Collectors.toList()` a `collect(Collectors.toCollection(ArrayList::new))` a menos que precise de implementação específica.
    > - Use `mapToInt`, `mapToDouble` etc. em fluxos numéricos.
    > - Em pipelines complexos, quebre em variáveis intermediárias com nomes significativos.
5. **Informações Adicionais**
    - **Imutabilidade e Programação Funcional**
        - Embora o Java não seja puramente funcional, você pode aplicar imutabilidade liberando as classes de coleções mutáveis (e.g., usar `List.of(…)`) e criando objetos *value-only* (e.g., `record` no Java 16+).
    - **Monads em Java**
        - O `Optional<T>` é uma implementação simples de *Maybe Monad*, permitindo composições seguras contra valores nulos.
    - **Retry e Circuit Breaker**
        - Bibliotecas como *Vavr* e *FunctionalJava* oferecem estruturas adicionais para tratar monads, *Try*, *Either*, e construções mais avançadas de FP em Java.
6. **Referências para Estudo Independente**
    - **Documentação Oficial Oracle**
        - *The Java™ Tutorials* – Capter 3: Lambda Expressions:
        [https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
        - *Streams API*:
        [https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html)
    - **Livros**
        - *Java 8 in Action*, Mario Fusco, Alan Mycroft e Raoul-Gabriel Urma.
        - *Functional Programming in Java*, Pierre-Yves Saumont.
        - *Modern Java in Action*, Raoul-Gabriel Urma.
    - **Artigos e Tutoriais Online**
        - Baeldung: “Guide to Java 8 Streams”
        [https://www.baeldung.com/java-8-streams](https://www.baeldung.com/java-8-streams)
        - Vavr Documentation (para FP avançado em Java):
        [https://docs.vavr.io/](https://docs.vavr.io/)

---

> Com essa visão completa, você terá o embasamento necessário para começar a usar Programação Funcional em seus projetos Java, aproveitando concisão, legibilidade e paralelismo seguro.
>