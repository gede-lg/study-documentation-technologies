# Interfaces: Definição, implementação, diferenças para classes abstratas, interfaces funcionais

Com certeza, Gedê! Vamos detalhar sobre Interfaces em Java, um tópico fundamental da Orientação a Objetos que você verá na Semana 3-4 do seu plano de estudos. Entender isso é crucial para trabalhar com frameworks como o Spring, que você já usa e busca aprimorar para o cargo de Backend GO.

## Interfaces em Java: Definição, Implementação e Aplicações

### 1. Introdução

No universo da programação orientada a objetos em Java, as interfaces desempenham um papel vital na definição de contratos de comportamento. Elas permitem que classes de diferentes hierarquias implementem um conjunto comum de métodos, promovendo a coesão e o polimorfismo. Entender interfaces é fundamental para projetar sistemas flexíveis, escaláveis e de fácil manutenção, além de ser a base para diversos padrões de projeto e para o funcionamento de frameworks robustos como o Spring.

Uma interface em Java é um tipo de referência, similar a uma classe, que pode conter apenas constantes, assinaturas de métodos (métodos abstratos implícitos), métodos default, métodos estáticos e métodos privados. Seu propósito principal é estabelecer um "contrato": qualquer classe que "implemente" uma interface se compromete a fornecer uma implementação para todos os métodos abstratos declarados nessa interface.

### 2. Sumário

- **O que são Interfaces?**
- **Declaração e Estrutura de uma Interface**
- **Diferenças entre Interfaces e Classes Abstratas**
- **Interfaces Funcionais (Java 8+)**
- **Usos e Restrições**
- **Exemplos de Código Otimizados**
- **Informações Adicionais**
- **Referências para Estudo Independente**

### 3. Conteúdo Detalhado

### O que são Interfaces?

Interfaces são como "plantilhas" ou "contratos" para classes. Elas definem um conjunto de métodos que uma classe deve implementar, sem se preocupar com a lógica interna desses métodos. Isso permite que objetos de classes diferentes sejam tratados de forma uniforme se implementarem a mesma interface, um pilar fundamental do polimorfismo.

Desde o Java 8, interfaces podem ter:

- **Métodos abstratos:** Métodos sem corpo, que devem ser implementados pelas classes concretas. (Antes do Java 8, eram os únicos tipos de métodos permitidos).
- **Métodos `default`:** Métodos com uma implementação padrão. Classes que implementam a interface podem usar a implementação padrão ou sobrescrevê-la.
- **Métodos `static`:** Métodos que pertencem à própria interface e não podem ser sobrescritos pelas classes implementadoras. São chamados diretamente na interface.
- **Constantes:** Variáveis declaradas em interfaces são implicitamente `public static final`.

### Declaração e Estrutura de uma Interface

A sintaxe para declarar uma interface é:

```java
public interface NomeDaInterface {
    // Constantes (opcional, implicitamente public static final)
    int MIN_VALUE = 0;
    String DEFAULT_MESSAGE = "Olá!";

    // Métodos abstratos (implicitamente public abstract)
    void metodoAbstrato();
    String outroMetodoAbstrato(int parametro);

    // Métodos default (Java 8+)
    default void metodoDefault() {
        System.out.println("Implementação padrão do método default.");
    }

    // Métodos estáticos (Java 8+)
    static void metodoEstatico() {
        System.out.println("Método estático da interface.");
    }

    // Métodos privados (Java 9+) - podem ser usados por métodos default ou estáticos na própria interface
    private void metodoPrivadoInterno() {
        System.out.println("Método privado interno da interface.");
    }

    default void metodoDefaultComPrivado() {
        metodoPrivadoInterno(); // Chamando método privado
        System.out.println("Método default que usa um método privado.");
    }
}

```

Para uma classe implementar uma interface, usa-se a palavra-chave `implements`:

```java
public class MinhaClasse implements NomeDaInterface {
    @Override
    public void metodoAbstrato() {
        System.out.println("Implementação de metodoAbstrato na MinhaClasse.");
    }

    @Override
    public String outroMetodoAbstrato(int parametro) {
        return "Implementação de outroMetodoAbstrato com parâmetro: " + parametro;
    }

    // Opcional: Sobrescrever o método default
    @Override
    public void metodoDefault() {
        System.out.println("MinhaClasse sobrescreveu o método default.");
    }
}

```

### Diferenças entre Interfaces e Classes Abstratas

Essa é uma das perguntas mais comuns em entrevistas, Gedê! É crucial entender as nuances:

| Característica | Interface | Classe Abstrata |
| --- | --- | --- |
| **Tipo** | `interface` | `abstract class` |
| **Herança Múltipla** | Permite (uma classe pode implementar várias interfaces) | Não permite (uma classe pode estender apenas uma classe) |
| **Construtores** | Não podem ter construtores | Podem ter construtores |
| **Variáveis** | Somente constantes (`public static final` implícito) | Podem ter variáveis de instância (stateful) |
| **Métodos** | Abstratos (até Java 7), `default`, `static`, `private` (Java 8+) | Abstratos e concretos |
| **Modificadores** | Métodos são implicitamente `public abstract` (antes do Java 8) | Métodos podem ser `public`, `protected`, `default`, `private` |
| **`final`** | Métodos `default` e `static` podem ser `final` | Métodos concretos podem ser `final` |
| **Herança vs. Implementação** | Usada com `implements` | Usada com `extends` |
| **Estado** | Não podem manter estado | Podem manter estado (variáveis de instância) |
| **Propósito** | Definir contratos de comportamento ("O que um objeto pode fazer?") | Definir uma estrutura básica com implementação parcial ("O que um objeto *é*?") |

**Quando usar qual?**

- Use **Interfaces** quando você quer definir um comportamento que pode ser aplicado por classes que não estão na mesma hierarquia de herança. Pense em "contratos". Ex: `Comparable`, `Serializable`, `Runnable`.
- Use **Classes Abstratas** quando você quer fornecer uma implementação base para certas funcionalidades, mas ainda exigir que subclasses implementem outros métodos. Pense em "esqueletos" ou "modelos" para uma família de classes. Ex: `HttpServlet` no Java EE.

### Interfaces Funcionais (Java 8+)

Com a introdução do Java 8 e a programação funcional, surgiu o conceito de **Interfaces Funcionais**. Uma interface funcional é uma interface que contém exatamente um método abstrato. Elas são a base para o uso de Expressões Lambda.

São marcadas opcionalmente com a anotação `@FunctionalInterface`, que ajuda o compilador a verificar se a interface realmente segue a regra de ter apenas um método abstrato.

**Exemplos de Interfaces Funcionais Padrão do Java:**

- `Runnable`: `void run()`
- `Callable<V>`: `V call()`
- `Consumer<T>`: `void accept(T t)`
- `Supplier<T>`: `T get()`
- `Function<T, R>`: `R apply(T t)`
- `Predicate<T>`: `boolean test(T t)`

### Usos e Restrições

**Usos Comuns:**

- **Polimorfismo:** Permite que diferentes classes implementem a mesma interface e sejam tratadas de forma genérica.
- **Programação para Interface, não para Implementação:** Uma prática fundamental de design. Isso torna o código mais flexível e fácil de manter.
- **Callbacks:** Padrão comum para notificar componentes sobre eventos.
- **APIs e Frameworks:** Definem contratos para extensibilidade (ex: JDBC, Servlets, Spring Framework).
- **Comportamento Reutilizável:** Métodos `default` permitem adicionar novas funcionalidades a uma interface sem quebrar classes que já a implementam.

**Restrições:**

- Uma classe só pode estender uma classe, mas pode implementar múltiplas interfaces.
- Interfaces não podem ser instanciadas diretamente (não possuem construtores).
- Métodos abstratos em interfaces são implicitamente `public`.

### 4. Exemplos de Código Otimizados

Vamos ver exemplos práticos que mostram a utilidade das interfaces.

### Exemplo 1: Polimorfismo com Interfaces (Uso Básico)

Imagine que você tem diferentes tipos de veículos e quer que todos eles possam "mover".

```java
// Contrato: O que um objeto pode fazer
interface Movivel {
    void mover(int distancia);
    void parar();
}

// Implementação 1: Um carro
class Carro implements Movivel {
    private String modelo;

    public Carro(String modelo) {
        this.modelo = modelo;
    }

    @Override
    public void mover(int distancia) {
        System.out.println(modelo + " está se movendo por " + distancia + " km.");
    }

    @Override
    public void parar() {
        System.out.println(modelo + " parou.");
    }
}

// Implementação 2: Uma bicicleta
class Bicicleta implements Movivel {
    private String tipo;

    public Bicicleta(String tipo) {
        this.tipo = tipo;
    }

    @Override
    public void mover(int distancia) {
        System.out.println(tipo + " está pedalando por " + distancia + " km.");
    }

    @Override
    public void parar() {
        System.out.println(tipo + " parou de pedalar.");
    }
}

public class ExemploPolimorfismo {
    public static void main(String[] args) {
        // Trate diferentes objetos de forma polimórfica
        Movivel meuCarro = new Carro("Fusca");
        Movivel minhaBicicleta = new Bicicleta("Mountain Bike");

        meuCarro.mover(50);
        meuCarro.parar();

        minhaBicicleta.mover(10);
        minhaBicicleta.parar();

        // Você pode ter uma lista de Moviveis
        List<Movivel> veiculos = new ArrayList<>();
        veiculos.add(new Carro("BMW X1"));
        veiculos.add(new Bicicleta("Speed"));

        System.out.println("\\nMovendo todos os veículos:");
        for (Movivel v : veiculos) {
            v.mover(20);
        }
    }
}

```

### Exemplo 2: Interfaces com Métodos `default` e `static` (Java 8+)

Imagine uma interface para operações matemáticas que precisa de um novo método, mas você não quer quebrar as implementações existentes.

```java
interface OperacoesMatematicas {
    int somar(int a, int b);
    int subtrair(int a, int b);

    // Novo método com implementação padrão
    default int multiplicar(int a, int b) {
        System.out.println("Usando implementação padrão de multiplicar.");
        return a * b;
    }

    // Método estático, útil para funções utilitárias relacionadas à interface
    static double calcularMedia(double... numeros) {
        if (numeros.length == 0) {
            return 0;
        }
        double soma = 0;
        for (double num : numeros) {
            soma += num;
        }
        return soma / numeros.length;
    }
}

class CalculadoraSimples implements OperacoesMatematicas {
    @Override
    public int somar(int a, int b) {
        return a + b;
    }

    @Override
    public int subtrair(int a, int b) {
        return a - b;
    }

    // Opcional: sobrescrever o método default
    @Override
    public int multiplicar(int a, int b) {
        System.out.println("Calculadora Simples implementou sua própria multiplicação.");
        return a * b * 2; // Exemplo de lógica diferente
    }
}

public class ExemploDefaultStatic {
    public static void main(String[] args) {
        CalculadoraSimples calc = new CalculadoraSimples();

        System.out.println("Soma: " + calc.somar(5, 3));
        System.out.println("Subtração: " + calc.subtrair(10, 4));
        System.out.println("Multiplicação: " + calc.multiplicar(2, 5)); // Chama a implementação sobrescrita

        // Chamando o método estático diretamente na interface
        System.out.println("Média: " + OperacoesMatematicas.calcularMedia(10.0, 20.0, 30.0));
    }
}

```

### Exemplo 3: Interface Funcional e Expressão Lambda (Java 8+)

Imagine que você precisa de um filtro de usuários, e esse filtro pode mudar dependendo da situação.

```java
import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate; // Interface funcional padrão do Java

class Usuario {
    private String nome;
    private int idade;
    private boolean ativo;

    public Usuario(String nome, int idade, boolean ativo) {
        this.nome = nome;
        this.idade = idade;
        this.ativo = ativo;
    }

    public String getNome() { return nome; }
    public int getIdade() { return idade; }
    public boolean isAtivo() { return ativo; }

    @Override
    public String toString() {
        return "Usuario{" +
               "nome='" + nome + '\\'' +
               ", idade=" + idade +
               ", ativo=" + ativo +
               '}';
    }
}

public class ExemploInterfaceFuncional {
    public static void main(String[] args) {
        List<Usuario> usuarios = Arrays.asList(
            new Usuario("Alice", 30, true),
            new Usuario("Bob", 25, false),
            new Usuario("Carlos", 35, true),
            new Usuario("Diana", 20, true)
        );

        // Usando uma Predicate (interface funcional) com lambda para filtrar usuários ativos
        Predicate<Usuario> isAtivo = usuario -> usuario.isAtivo();
        List<Usuario> usuariosAtivos = filtrarUsuarios(usuarios, isAtivo);
        System.out.println("Usuários Ativos: " + usuariosAtivos);

        // Usando Predicate com lambda para filtrar usuários com mais de 28 anos
        Predicate<Usuario> idadeMaiorQue28 = usuario -> usuario.getIdade() > 28;
        List<Usuario> usuariosMaisVelhos = filtrarUsuarios(usuarios, idadeMaiorQue28);
        System.out.println("Usuários com mais de 28 anos: " + usuariosMaisVelhos);

        // Combinando predicados
        Predicate<Usuario> ativoEMaiorQue28 = isAtivo.and(idadeMaiorQue28);
        List<Usuario> ativosEMaisVelhos = filtrarUsuarios(usuarios, ativoEMaiorQue28);
        System.out.println("Usuários Ativos E com mais de 28 anos: " + ativosEMaisVelhos);
    }

    // Método genérico para filtrar uma lista de usuários baseado em um predicado
    public static List<Usuario> filtrarUsuarios(List<Usuario> usuarios, Predicate<Usuario> predicado) {
        List<Usuario> resultado = new ArrayList<>();
        for (Usuario usuario : usuarios) {
            if (predicado.test(usuario)) { // Usa o método abstrato 'test' da Predicate
                resultado.add(usuario);
            }
        }
        return resultado;
    }
}

```

Este exemplo mostra como as interfaces funcionais, combinadas com lambdas, tornam o código mais conciso e expressivo, permitindo a passagem de comportamento como argumento. Isso é amplamente utilizado na Streams API, que você verá na Semana 8-9, Gedê.

### 5. Informações Adicionais

- **Problema do Diamante (Diamond Problem):** Com a introdução de métodos `default`, pode haver ambiguidade se uma classe implementar duas interfaces que possuem métodos `default` com a mesma assinatura. O Java resolve isso exigindo que a classe implementadora sobrescreva o método ou especifique qual implementação de interface deseja usar (usando `NomeDaInterface.super.metodoDefault()`).
- **Interfaces de Marcador (Marker Interfaces):** Interfaces vazias (sem métodos ou constantes) são chamadas de interfaces de marcador. Elas são usadas para "marcar" uma classe com uma capacidade específica em tempo de execução, como `Serializable` ou `Cloneable`.
- **Evolução das Interfaces:** As interfaces em Java evoluíram significativamente do Java 8 em diante, tornando-se mais poderosas e flexíveis, aproximando-as de classes abstratas em termos de capacidade de ter código implementado, mas mantendo a fundamental diferença de propósito e de herança múltipla de tipos.

### 6. Referências para Estudo Independente

Para aprofundar seus conhecimentos, Gedê, recomendo os seguintes recursos:

- **Oracle Documentation - Interfaces:** A documentação oficial da Oracle é sempre o melhor ponto de partida.
    - [Interfaces (The Java™ Tutorials > Learning the Java Language > Classes and Objects)](https://docs.oracle.com/javase/tutorial/java/concepts/interface.html)
- **Baeldung - Java Interfaces:** Um artigo muito completo e prático.
    - [A Guide to Java Interfaces - Baeldung](https://www.baeldung.com/java-interfaces)
- **GeeksforGeeks - Interface in Java:** Outro bom recurso com exemplos claros.
    - [Interface in Java - GeeksforGeeks](https://www.geeksforgeeks.org/interfaces-in-java/)
- **Artigo sobre Functional Interfaces e Lambda Expressions:**
    - [Functional Interfaces and Lambda Expressions - Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)

Espero que esta explicação detalhada ajude você a solidificar seu entendimento sobre Interfaces em Java, Gedê! Se tiver mais alguma dúvida ou quiser que eu explique outro tópico, é só chamar!