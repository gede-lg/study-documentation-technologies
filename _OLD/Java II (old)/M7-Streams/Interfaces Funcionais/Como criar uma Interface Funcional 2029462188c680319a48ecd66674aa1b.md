# Como criar uma Interface Funcional

Com certeza, Gedê\! Vamos detalhar como criar uma Interface Funcional em Java, um tópico super importante que está lá na Semana 8-9 da sua grade de estudos. Isso é fundamental para entender a programação funcional em Java 8+ e as Streams API.

---

## Como Criar uma Interface Funcional em Java

### 1\. Introdução

No universo do Java moderno, especialmente a partir da versão 8, as Interfaces Funcionais se tornaram um pilar central da programação funcional e da utilização de Expressões Lambda. Elas representam um avanço significativo, permitindo que o código seja mais conciso, legível e expressivo, especialmente quando lidamos com operações de coleção através da Streams API.

Uma Interface Funcional, em sua essência, é uma interface em Java que possui **apenas um único método abstrato**. A relevância disso está na sua capacidade de ser a base para as Expressões Lambda e Referências de Método. Elas fornecem o "contrato" que uma expressão lambda pode preencher, atuando como um tipo de destino para o código que você deseja executar. Compreender e saber criar interfaces funcionais é crucial para qualquer desenvolvedor Java que queira dominar os recursos mais recentes da linguagem e trabalhar eficientemente com frameworks modernos e bibliotecas que as utilizam amplamente.

### 2\. Sumário

- Definição e Conceitos Fundamentais
- Sintaxe e Estrutura
- Componentes Principais
- Restrições de Uso
- Exemplos de Código Otimizados
- Informações Adicionais
- Referências para Estudo Independente

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

Uma **Interface Funcional** (também conhecida como Single Abstract Method - SAM interface) é uma interface em Java que contém **exatamente um método abstrato**. A partir do Java 8, a anotação `@FunctionalInterface` foi introduzida para marcar explicitamente essas interfaces. Embora seja opcional, é uma boa prática utilizá-la, pois ela informa ao compilador que a interface pretende ser funcional e o compilador emitirá um erro se você adicionar um segundo método abstrato, ajudando a evitar erros.

**Para que servem?**
As Interfaces Funcionais servem como um ponto de conexão para as Expressões Lambda. Elas permitem que você trate a funcionalidade como um argumento de método ou que a atribua a uma variável. Essencialmente, elas habilitam a "passagem de funções" (ou comportamentos) como parâmetros, o que é a base da programação funcional.

### Sintaxe e Estrutura

A sintaxe básica para criar uma interface funcional é a mesma de qualquer interface em Java, com a adição opcional (mas recomendada) da anotação `@FunctionalInterface`.

```java
@FunctionalInterface
public interface MinhaInterfaceFuncional {
    // Apenas um método abstrato
    void executarAcao();
}

```

**Exemplos de declaração e utilização:**

```java
// Declaração de uma interface funcional simples
@FunctionalInterface
interface Saudacao {
    String saudar(String nome);
}

public class ExemploInterfaceFuncional {
    public static void main(String[] args) {
        // Utilização da interface funcional com uma expressão lambda
        Saudacao olaMundo = nome -> "Olá, " + nome + "!";

        System.out.println(olaMundo.saudar("Gedê")); // Saída: Olá, Gedê!

        // Outro exemplo, com uma operação matemática
        @FunctionalInterface
        interface Calculadora {
            int operar(int a, int b);
        }

        Calculadora soma = (num1, num2) -> num1 + num2;
        Calculadora subtracao = (num1, num2) -> num1 - num2;

        System.out.println("Soma: " + soma.operar(10, 5));      // Saída: Soma: 15
        System.out.println("Subtração: " + subtracao.operar(10, 5)); // Saída: Subtração: 5
    }
}

```

### Componentes Principais

O componente principal de uma interface funcional é o seu **único método abstrato**. Este método define a "assinatura" do comportamento que a expressão lambda ou referência de método irá implementar.

Além do método abstrato, uma interface funcional pode ter:

- **Métodos `default`**: Introduzidos no Java 8, permitem adicionar implementações padrão a métodos em interfaces. Eles não contam para a regra de "método abstrato único".
- **Métodos `static`**: Também introduzidos no Java 8, são métodos que pertencem à própria interface e podem ser chamados diretamente usando o nome da interface. Não contam para a regra de "método abstrato único".
- **Métodos da classe `Object`**: Embora uma interface não possa redeclarar explicitamente métodos como `equals()`, `hashCode()`, `toString()` (que já são public abstract por padrão na `Object` class), se uma interface funcional contiver um método abstrato com a mesma assinatura de um método público da classe `Object`, ela ainda será considerada uma interface funcional. O compilador ignora esses métodos da `Object` class para a contagem do método abstrato único.

**Explicação da interação entre eles:**

Os métodos `default` e `static` permitem que as interfaces funcionais ofereçam funcionalidades adicionais sem quebrar a regra do método abstrato único. Isso significa que você pode ter métodos utilitários ou implementações padrão dentro da própria interface, tornando-a mais rica e versátil, mas ainda assim compatível com expressões lambda. O método abstrato é o ponto de entrada para a lógica fornecida pela lambda, enquanto os métodos `default` e `static` fornecem comportamento auxiliar ou utilitário.

### Restrições de Uso

A principal e mais importante restrição é que uma interface funcional **deve ter exatamente um método abstrato**. Se você adicionar um segundo método abstrato, e ela estiver anotada com `@FunctionalInterface`, o compilador reportará um erro. Se não estiver anotada, ela simplesmente deixará de ser uma interface funcional e não poderá ser usada como tipo de destino para expressões lambda.

Outras considerações:

- **Não pode ser uma classe concreta**: Uma interface, funcional ou não, não pode ter campos de instância (variáveis de estado) ou construtores. Ela define um contrato, não uma implementação completa.
- **Métodos `default` e `static` não contam**: Como mencionado, esses métodos não afetam a capacidade de uma interface ser funcional, pois eles já possuem uma implementação.
- **Métodos da `Object` class**: Métodos abstratos que sobrescrevem métodos públicos de `java.lang.Object` não são considerados métodos abstratos funcionais para fins de contagem, pois qualquer implementação da interface fornecerá uma implementação desses métodos, implícita ou explicitamente.

### 4\. Exemplos de Código Otimizados

Vamos ver exemplos mais práticos, Gedê, com casos de uso comuns no dia a dia.

```java
import java.util.Arrays;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Exemplo prático de Interfaces Funcionais em Java
 * para o dia a dia de um desenvolvedor Backend Java/Go.
 */
public class ExemploAvancadoInterfacesFuncionais {

    // --- Exemplo 1: Interface Funcional Personalizada para Processamento de Dados ---
    // Cenário: Você precisa processar uma lista de strings de uma forma customizável.
    @FunctionalInterface
    interface ProcessadorDeString {
        String processar(String texto);

        // Um método default para logar o processamento, não afeta a funcionalidade
        default void logarProcessamento(String textoOriginal, String textoProcessado) {
            System.out.println("Processado: '" + textoOriginal + "' -> '" + textoProcessado + "'");
        }

        // Um método estático para criar um processador que remove espaços em branco
        static ProcessadorDeString criarProcessadorLimpeza() {
            return texto -> texto.trim().replaceAll("\\\\s+", "");
        }
    }

    // --- Exemplo 2: Usando Interfaces Funcionais Padrão do Java (java.util.function) ---
    // Você já viu na sua grade as principais: Predicate, Consumer, Function, Supplier.
    // Vamos usá-las em um cenário comum: filtrar e transformar dados.

    public static void main(String[] args) {
        System.out.println("--- Exemplo 1: Processador de String Personalizado ---");
        List<String> nomes = Arrays.asList(" Gedê ", " Ju ", " A.R.I.A ", " Java ");

        // Uso básico: Um processador que converte para maiúsculas e remove espaços
        ProcessadorDeString maiusculaElimparEspacos = texto -> texto.trim().toUpperCase();

        System.out.println("Nomes processados:");
        for (String nome : nomes) {
            String nomeProcessado = maiusculaElimparEspacos.processar(nome);
            maiusculaElimparEspacos.logarProcessamento(nome, nomeProcessado);
        }

        // Uso avançado: Usando o método estático da interface para um processador de limpeza
        ProcessadorDeString processadorLimpeza = ProcessadorDeString.criarProcessadorLimpeza();
        String textoComEspacos = "    Este é um texto com muitos   espaços   .  ";
        String textoLimpo = processadorLimpeza.processar(textoComEspacos);
        processadorLimpeza.logarProcessamento(textoComEspacos, textoLimpo);
        System.out.println("Texto Limpo final: '" + textoLimpo + "'\\n");

        System.out.println("--- Exemplo 2: Interfaces Funcionais Padrão com Streams API ---");
        List<Integer> numeros = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // Predicate: Para filtrar números pares
        Predicate<Integer> isPar = numero -> numero % 2 == 0;

        // Function: Para transformar um número em seu quadrado
        Function<Integer, Integer> quadrado = numero -> numero * numero;

        // Consumer: Para imprimir um número
        Consumer<Integer> imprimirNumero = System.out::println; // Exemplo de Referência de Método

        // Combinando com Streams API: Filtrar pares, transformar em quadrado e imprimir
        System.out.println("Números pares ao quadrado:");
        numeros.stream()
               .filter(isPar) // Aplica o Predicate
               .map(quadrado) // Aplica a Function
               .forEach(imprimirNumero); // Aplica o Consumer
        System.out.println();

        // Cenário de uso real: Filtrar usuários ativos e mapear para seus emails em um sistema
        class Usuario {
            String nome;
            String email;
            boolean ativo;

            public Usuario(String nome, String email, boolean ativo) {
                this.nome = nome;
                this.email = email;
                this.ativo = ativo;
            }

            public String getNome() { return nome; }
            public String getEmail() { return email; }
            public boolean isAtivo() { return ativo; }
        }

        List<Usuario> usuarios = Arrays.asList(
            new Usuario("Gedê", "gedeg@example.com", true),
            new Usuario("Ju", "ju@example.com", false),
            new Usuario("João", "joao@example.com", true),
            new Usuario("Maria", "maria@example.com", false)
        );

        // Filtrar usuários ativos (Predicate) e extrair apenas os emails (Function)
        List<String> emailsAtivos = usuarios.stream()
                                           .filter(Usuario::isAtivo) // Predicate via referência de método
                                           .map(Usuario::getEmail)   // Function via referência de método
                                           .collect(Collectors.toList());

        System.out.println("Emails de usuários ativos: " + emailsAtivos);
        // Saída: Emails de usuários ativos: [gedeg@example.com, joao@example.com]
    }
}

```

Nesses exemplos, Gedê, você pode ver como as Interfaces Funcionais (tanto as personalizadas quanto as pré-definidas do Java) são usadas para passar comportamentos. No exemplo 1, criamos um processador de strings flexível. No exemplo 2, usamos `Predicate`, `Function` e `Consumer` com a Stream API para manipular listas de números e objetos de `Usuario`, o que é super comum em qualquer aplicação backend para lidar com dados.

### 5\. Informações Adicionais

- **Interfaces Funcionais e Referências de Métodos:** Além das expressões lambda, as interfaces funcionais também podem ser implementadas por referências de métodos. Uma referência de método é uma sintaxe concisa para expressões lambda que apenas chamam um método existente. Por exemplo, `System.out::println` é uma referência de método para a interface `Consumer<String>` (ou outros tipos).
- **Interfaces Funcionais Padrão (`java.util.function`):** O Java 8 introduziu um pacote inteiro (`java.util.function`) com várias interfaces funcionais prontas para uso. Isso evita que você precise criar suas próprias interfaces para cenários comuns. As mais importantes são:
    - `Predicate<T>`: Recebe um `T` e retorna um `boolean`.
    - `Consumer<T>`: Recebe um `T` e não retorna nada.
    - `Function<T, R>`: Recebe um `T` e retorna um `R`.
    - `Supplier<T>`: Não recebe nada e retorna um `T`.
    - `UnaryOperator<T>`: Recebe um `T` e retorna um `T` (quando a entrada e a saída são do mesmo tipo).
    - `BinaryOperator<T>`: Recebe dois `T` e retorna um `T` (quando as duas entradas e a saída são do mesmo tipo).
- **Compatibilidade Retroativa:** Internamente, as expressões lambda são convertidas pelo compilador em instâncias de interfaces funcionais. Isso significa que, para o código legado que espera uma interface funcional, você pode passar uma expressão lambda.
- **Flexibilidade e Composição:** A beleza das interfaces funcionais, Gedê, é a flexibilidade. Você pode encadeá-las, compor funções, e criar fluxos de processamento de dados de forma muito mais expressiva e legível, especialmente quando combinadas com a Streams API.

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos, Gedê, recomendo os seguintes recursos:

- **Oracle Documentation - Lambda Expressions:** A documentação oficial é sempre um ótimo ponto de partida.
    - [Tutorial: Lambda Expressions](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
    - [Package `java.util.function`](https://www.google.com/search?q=%5Bhttps://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html%5D%5C(https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html%5C))
- **Baeldung - Java 8 Functional Interfaces:** O Baeldung é uma referência excelente para tópicos Java.
    - [A Guide to Java 8 Functional Interfaces](https://www.baeldung.com/java-8-functional-interfaces)
- **GeeksforGeeks - Functional Interface in Java:** Outro recurso útil para entender o conceito.
    - [Functional Interface in Java](https://www.google.com/search?q=https://www.geeksforgeeks.org/functional-interface-in-java/)
- **Livro "Java 8 in Action"**: Se você busca um material mais aprofundado, este livro é considerado um clássico para entender os recursos do Java 8, incluindo lambdas e streams.

---

Espero que esta explicação detalhada sobre Interfaces Funcionais seja muito útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser que eu prepare outra explicação, é só chamar\!