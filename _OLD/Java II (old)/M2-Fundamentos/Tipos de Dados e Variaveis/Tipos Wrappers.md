# Tipos Wrappers

Beleza, Gedê! Vamos mergulhar fundo nos **Wrappers** em Java. Como desenvolvedor backend, entender as nuances desses tipos é super importante para lidar com coleções, APIs e até mesmo para otimizar seu código.

---

## Introdução: Wrappers em Java

Em Java, existem dois grandes grupos de tipos de dados: os **tipos primitivos** (como `int`, `double`, `boolean`, `char`) e os **tipos de referência** (objetos). Enquanto os primitivos armazenam valores diretos e são mais eficientes em termos de memória e performance, eles não são objetos. Isso se torna um problema quando precisamos trabalhar com estruturas que exigem objetos, como as coleções (`ArrayList`, `HashMap`) ou frameworks que usam **Generics**.

É aí que entram as **classes wrapper** (ou "embrulho"). Elas são classes que "envolvem" os tipos primitivos, permitindo que eles sejam tratados como objetos. Isso é fundamental para a flexibilidade do Java, pois preenche a lacuna entre o mundo primitivo e o mundo orientado a objetos, possibilitando que você use seus valores numéricos, booleanos e de caracteres em contextos que exigem objetos.

### Definição e Conceitos Fundamentais

As **classes wrapper** em Java são classes localizadas no pacote `java.lang` (o que significa que não precisam ser importadas explicitamente). Para cada tipo primitivo, existe uma classe wrapper correspondente:

- `byte` -> `Byte`
- `short` -> `Short`
- `int` -> `Integer`
- `long` -> `Long`
- `float` -> `Float`
- `double` -> `Double`
- `boolean` -> `Boolean`
- `char` -> `Character`

Essas classes fornecem uma maneira de converter um tipo primitivo em um objeto e vice-versa. Elas também vêm com uma série de métodos utilitários para manipulação e conversão de valores, o que as torna incrivelmente úteis no dia a dia.

---

## Sumário

1. **Sintaxe e Estrutura**
    - Criação de Objetos Wrapper
    - Autoboxing e Unboxing
2. **Componentes Principais**
    - Métodos Comuns das Classes Wrapper
    - Comparação de Objetos Wrapper
3. **Restrições de Uso**
4. **Exemplos de Código Otimizados**
    - Uso com Coleções
    - Conversão entre Tipos
    - Tratamento de Nulos
    - Boas Práticas de Comparação
5. **Informações Adicionais**
    - Imutabilidade
    - Cache de Wrappers
    - Considerações de Performance
6. **Referências para Estudo Independente**

---

## Conteúdo Detalhado

### Sintaxe e Estrutura

### Criação de Objetos Wrapper

Você pode criar objetos wrapper de algumas maneiras. A forma mais comum (e recomendada para Java 5+ devido ao autoboxing) é simplesmente atribuir um valor primitivo a uma variável wrapper.

- **Instanciação Direta (Java 5+ - mais comum):**
    
    ```java
    Integer idade = 23; // Autoboxing: int para Integer
    Double salario = 5000.75; // Autoboxing: double para Double
    Boolean ativo = true; // Autoboxing: boolean para Boolean
    Character letra = 'A'; // Autoboxing: char para Character
    
    ```
    
- **Usando o construtor (legado, mas funcional):** Embora ainda funcione, a criação direta é preferida. O construtor é **deprecated** em versões mais recentes do Java (a partir do Java 9) porque o autoboxing o torna desnecessário e pode ser menos eficiente.
    
    ```java
    // Forma legada (deprecated em Java 9+)
    Integer numeroAntigo = new Integer(100);
    
    ```
    
- **Usando métodos estáticos `valueOf()`:** Esta é a forma recomendada para conversão explícita, pois pode aproveitar o cache de valores.
    
    ```java
    Integer numeroNovo = Integer.valueOf(200); // int para Integer
    Double pi = Double.valueOf("3.14159"); // String para Double
    
    ```
    

### Autoboxing e Unboxing

O Java 5 introduziu um recurso poderoso chamado **Autoboxing** e **Unboxing**, que automatiza a conversão entre tipos primitivos e suas classes wrapper correspondentes.

- **Autoboxing:** É a conversão automática de um tipo primitivo para sua classe wrapper. O compilador Java faz isso por você.
    
    ```java
    int valorPrimitivo = 10;
    Integer objetoWrapper = valorPrimitivo; // Autoboxing: int para Integer
    // É o mesmo que Integer objetoWrapper = Integer.valueOf(valorPrimitivo);
    
    ```
    
- **Unboxing:** É a conversão automática de um objeto wrapper para seu tipo primitivo.
    
    ```java
    Integer objetoWrapper = 20;
    int valorPrimitivo = objetoWrapper; // Unboxing: Integer para int
    // É o mesmo que int valorPrimitivo = objetoWrapper.intValue();
    
    ```
    

Essa automação simplifica muito o código, especialmente ao trabalhar com coleções.

### Componentes Principais

As classes wrapper oferecem uma série de métodos úteis para manipulação de valores.

### Métodos Comuns das Classes Wrapper (Exemplos com `Integer` e `Double`)

1. **`xxxValue()` (Unboxing explícito):** Retorna o valor primitivo.
    - `intValue()`: Retorna o `int`
    - `doubleValue()`: Retorna o `double`
    - `booleanValue()`: Retorna o `boolean`
    - ... e assim por diante para todos os tipos primitivos.
    
    ```java
    Integer numObj = 123;
    int numPrimitivo = numObj.intValue(); // Unboxing explícito
    
    ```
    
2. **`parseXxx(String s)`:** Converte uma `String` para o tipo primitivo correspondente.
    - `Integer.parseInt("123")` -> `int`
    - `Double.parseDouble("3.14")` -> `double`
    - `Boolean.parseBoolean("true")` -> `boolean`
    
    ```java
    String strNum = "456";
    int parsedNum = Integer.parseInt(strNum); // Converte String para int
    
    ```
    
3. **`valueOf(String s)` ou `valueOf(xxx value)`:** Converte uma `String` ou um primitivo para o objeto wrapper correspondente. Preferível a `new Xxx()`.
    - `Integer.valueOf("789")` -> `Integer` objeto
    - `Double.valueOf(10.5)` -> `Double` objeto
    
    ```java
    String strDouble = "98.7";
    Double objDouble = Double.valueOf(strDouble); // Converte String para Double objeto
    
    ```
    
4. **`toString()`:** Converte o valor do objeto wrapper para sua representação em `String`.
    
    ```java
    Integer valor = 500;
    String strValor = valor.toString(); // "500"
    
    ```
    
5. **`hashCode()` e `equals(Object obj)`:** Implementam a comparação de valores, essencial para uso em coleções como `HashMap` e `HashSet`.
    - `Integer.equals(anotherInteger)`: Compara os valores numéricos.

### Comparação de Objetos Wrapper

É crucial entender como comparar objetos wrapper. Usar `==` para comparar objetos wrapper pode levar a resultados inesperados, pois `==` compara as referências dos objetos (se são o mesmo objeto na memória), e não seus valores.

Sempre use o método **`.equals()`** para comparar os *valores* de objetos wrapper.

```java
Integer a = 100;
Integer b = 100;
System.out.println(a == b); // Saída: true (devido ao cache, veja abaixo)

Integer c = 200;
Integer d = 200;
System.out.println(c == d); // Saída: false (valores fora do cache)
System.out.println(c.equals(d)); // Saída: true (correto!)

```

### Restrições de Uso

- **NullPointerException:** Uma das principais desvantagens de usar classes wrapper em vez de primitivos é o risco de `NullPointerException`. Um primitivo nunca pode ser nulo, mas um objeto wrapper sim. Se você tentar realizar um unboxing (explícito ou automático) de um objeto wrapper `null`, um `NullPointerException` será lançado.
    
    ```java
    Integer numeroNulo = null;
    // int valor = numeroNulo; // Isso lançaria um NullPointerException!
    
    ```
    
- **Performance:** Operações com wrappers (autoboxing/unboxing) podem ter um leve custo de performance em comparação com operações diretas com primitivos, pois envolvem a criação de objetos na heap. Para cálculos intensivos, primitivos são geralmente mais eficientes.
- **Comparação:** Como mencionado, a comparação com `==` pode ser traiçoeira. Sempre use `.equals()` para comparar os valores de objetos wrapper.

---

## Exemplos de Código Otimizados

### Caso de Uso 1: Uso com Coleções (Listas de Números)

Este é um dos cenários mais comuns onde wrappers são indispensáveis. `ArrayList` e outras coleções só podem armazenar objetos.

```java
import java.util.ArrayList;
import java.util.List;

public class ExemploWrappersColecoes {
    public static void main(String[] args) {
        // Criando uma lista de inteiros (automaticamente armazena Integer objetos)
        List<Integer> idades = new ArrayList<>();

        // Adicionando valores primitivos (autoboxing ocorre aqui)
        idades.add(23); // Gedê
        idades.add(24); // Ju
        idades.add(50); // Outro exemplo
        idades.add(new Integer(45)); // Forma antiga, mas funcional para exemplificar

        System.out.println("Idades na lista: " + idades);

        // Somando as idades
        int somaIdades = 0;
        for (Integer idadeObj : idades) {
            // Unboxing automático ocorre aqui: Integer para int
            somaIdades += idadeObj;
        }
        System.out.println("Soma das idades: " + somaIdades);

        // Removendo uma idade (compara por valor, não por referência)
        boolean removido = idades.remove(Integer.valueOf(24)); // Remove o Integer cujo valor é 24
        System.out.println("Idade 24 removida? " + removido);
        System.out.println("Idades após remoção: " + idades);

        // Usando Streams com wrappers
        double media = idades.stream()
                             .mapToInt(Integer::intValue) // Converte Stream<Integer> para IntStream
                             .average()
                             .orElse(0.0);
        System.out.println("Média das idades restantes: " + media);
    }
}

```

### Caso de Uso 2: Conversão entre Tipos

Wrappers facilitam a conversão entre `String` e tipos numéricos, algo comum em APIs e processamento de entrada de dados.

```java
public class ExemploWrappersConversoes {
    public static void main(String[] args) {
        String precoStr = "1234.56";
        String quantidadeStr = "7";

        // Convertendo Strings para tipos numéricos (com tratamento de erro)
        try {
            double preco = Double.parseDouble(precoStr);
            int quantidade = Integer.parseInt(quantidadeStr);

            double total = preco * quantidade;
            System.out.println("Cálculo do total: " + preco + " * " + quantidade + " = " + total);

            // Convertendo números de volta para String
            String totalStr = String.valueOf(total); // ou Double.toString(total);
            System.println("Total como String: " + totalStr);

        } catch (NumberFormatException e) {
            System.err.println("Erro ao converter string para número: " + e.getMessage());
        }

        // Exemplo com Boolean
        String estaAtivoStr = "true";
        boolean estaAtivo = Boolean.parseBoolean(estaAtivoStr); // "true" vira true, qualquer outra coisa vira false
        System.out.println("Status ativo: " + estaAtivo);

        String nuloOuVazio = null;
        // O parseBoolean é robusto, null vira false
        boolean nuloConvertido = Boolean.parseBoolean(nuloOuVazio);
        System.out.println("Null na conversão Boolean: " + nuloConvertido);
    }
}

```

### Caso de Uso 3: Tratamento de Nulos em Parâmetros Opcionais (API/Backend)

Em um backend, Gedê, você frequentemente receberá parâmetros que podem ser opcionais. Usar wrappers permite que esses parâmetros sejam `null`, representando a ausência de um valor.

```java
public class ExemploParametroOpcional {

    // Simula um método de serviço que pode receber um ID de usuário opcional
    public void buscarDetalhesDoUsuario(Integer userId) {
        if (userId != null) {
            System.out.println("Buscando detalhes para o usuário com ID: " + userId);
            // Lógica para buscar no banco de dados usando userId.intValue()
        } else {
            System.out.println("Buscando detalhes para todos os usuários (ID não fornecido).");
            // Lógica para buscar todos os usuários
        }
    }

    public static void main(String[] args) {
        ExemploParametroOpcional service = new ExemploParametroOpcional();

        // Cenário 1: ID de usuário fornecido
        service.buscarDetalhesDoUsuario(123);

        // Cenário 2: ID de usuário não fornecido (passando null)
        service.buscarDetalhesDoUsuario(null);

        // Cenário 3: Exemplo de NullPointerException ao tentar unboxing de null
        Integer numeroNullable = null;
        try {
            int valor = numeroNullable; // Aqui ocorre o NullPointerException
            System.out.println("Valor: " + valor); // Esta linha não será executada
        } catch (NullPointerException e) {
            System.err.println("Erro: Não foi possível realizar unboxing de um Integer null para int. " + e.getMessage());
        }
    }
}

```

### Caso de Uso 4: Boas Práticas de Comparação

Reforçando a importância de usar `.equals()`.

```java
public class ExemploComparacaoWrappers {
    public static void main(String[] args) {
        Integer num1 = 100; // Autoboxing
        Integer num2 = 100; // Autoboxing
        Integer num3 = 500; // Autoboxing
        Integer num4 = 500; // Autoboxing

        // Comparação de valores pequenos (dentro do cache de Integer)
        System.out.println("num1 (100) == num2 (100): " + (num1 == num2)); // Provavelmente true (cache)
        System.out.println("num1 (100).equals(num2 (100)): " + num1.equals(num2)); // Sempre true (correto)

        System.out.println("---");

        // Comparação de valores grandes (fora do cache de Integer)
        System.out.println("num3 (500) == num4 (500): " + (num3 == num4)); // Provavelmente false (fora do cache)
        System.out.println("num3 (500).equals(num4 (500)): " + num3.equals(num4)); // Sempre true (correto)

        System.out.println("---");

        // Comparando um wrapper com um primitivo
        int primitivo = 100;
        System.out.println("num1 (Integer) == primitivo (int): " + (num1 == primitivo)); // True (unboxing ocorre antes da comparação)
        // Ao comparar um wrapper com um primitivo usando '==', o wrapper é automaticamente 'unboxed' para o tipo primitivo.
        // A comparação então ocorre entre dois valores primitivos, o que é seguro.
    }
}

```

---

## Informações Adicionais

### Imutabilidade

Todas as classes wrapper em Java são **imutáveis**. Isso significa que, uma vez que um objeto wrapper é criado, seu valor não pode ser alterado. Qualquer operação que pareça modificar o valor de um objeto wrapper na verdade cria um novo objeto wrapper com o novo valor. Essa característica é importante para a segurança e para o uso em ambientes multi-thread, pois os objetos imutáveis podem ser compartilhados sem preocupações com inconsistências de estado.

```java
Integer x = 10;
x = x + 5; // Parece que 'x' mudou, mas na verdade um novo Integer (15) foi criado e atribuído a 'x'

```

### Cache de Wrappers

Para otimizar o uso de memória e performance, as classes wrapper para `Byte`, `Short`, `Integer`, `Long` e `Character` possuem um **cache de valores frequentemente usados**.

- `Byte`, `Short`, `Integer`, `Long`: cache de valores entre `128` e `127`.
- `Character`: cache de valores entre `\\u0000` e `\\u007F` (0 a 127 em ASCII).
- `Boolean`: sempre armazenam `Boolean.TRUE` ou `Boolean.FALSE`.

Quando você usa autoboxing ou `valueOf()` para esses intervalos de valores, o Java retorna uma referência para a mesma instância do objeto do cache, em vez de criar um novo objeto. Isso explica por que `num1 == num2` retornou `true` no exemplo de comparação para o valor `100`, mas `false` para `500`.

### Considerações de Performance

Embora o autoboxing e unboxing sejam convenientes, eles têm um custo. A criação de objetos na memória (heap) e a coleta de lixo associada podem impactar a performance em cenários de alta demanda ou loops muito grandes. Em situações críticas de performance, como em algoritmos matemáticos complexos ou manipulação de grandes volumes de dados, é geralmente melhor usar tipos primitivos quando possível.

Por exemplo, somar muitos números em um loop:

```java
// Menos eficiente em loops grandes: gera muitos objetos Integer
long startTimeWrapper = System.nanoTime();
Integer somaWrapper = 0; // Inicia como Integer 0
for (int i = 0; i < 1_000_000; i++) {
    somaWrapper += i; // Autoboxing e unboxing em cada iteração
}
long endTimeWrapper = System.nanoTime();
System.out.println("Soma com Wrapper (ns): " + (endTimeWrapper - startTimeWrapper));

// Mais eficiente: usa tipo primitivo
long startTimePrimitivo = System.nanoTime();
int somaPrimitivo = 0;
for (int i = 0; i < 1_000_000; i++) {
    somaPrimitivo += i;
}
long endTimePrimitivo = System.nanoTime();
System.out.println("Soma com Primitivo (ns): " + (endTimePrimitivo - startTimePrimitivo));

```

Você verá que o código com primitivos é bem mais rápido para essa operação.

---

## Referências para Estudo Independente

- **Documentação Oficial da Oracle - Autoboxing e Unboxing:**
    - [https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)
- **Documentação Oficial da Oracle - Classes `Integer`, `Double`, etc.:**
    - Procure por `java.lang.Integer`, `java.lang.Double`, etc., na Javadoc oficial do Java (por exemplo, pesquisando "Integer JavaDocs" no Google).
    - [https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Integer.html](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Integer.html) (Exemplo para Integer)
- **Artigo sobre a diferença entre `==` e `.equals()` em Wrappers:**
    - Muitos blogs e artigos de desenvolvimento Java abordam isso. Uma busca por "java integer == vs equals" trará muitos resultados.
    - [https://www.baeldung.com/java-wrapper-classes](https://www.baeldung.com/java-wrapper-classes) (Um bom artigo que cobre wrappers, autoboxing, e o problema do `==`)
- **Livro "Effective Java" por Joshua Bloch:**
    - Item 61: "Avoid `Long` for `long` on loop counts". Embora seja sobre `Long`, o princípio se aplica a todos os wrappers em loops e explica a performance.

---

Espero que essa explicação detalhada sobre Wrappers te ajude bastante, Gedê! Entender a fundo como eles funcionam é um passo importante para se tornar um desenvolvedor Java ainda mais completo e eficiente, especialmente no backend.

Ficou alguma dúvida ou quer explorar mais algum ponto? A.R.I.A está aqui para te ajudar!