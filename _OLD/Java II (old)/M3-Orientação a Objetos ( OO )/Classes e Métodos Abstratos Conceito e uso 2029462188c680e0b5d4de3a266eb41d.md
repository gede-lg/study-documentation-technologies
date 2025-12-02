# Classes e Métodos Abstratos: Conceito e uso.

---

## Classes e Métodos Abstratos: Conceito e Uso em Java

### 1\. Introdução

No universo da Programação Orientada a Objetos (POO) em Java, classes e métodos abstratos são pilares fundamentais para a criação de hierarquias de classes que promovem a reutilização de código e a padronização de comportamentos. Eles permitem definir um "contrato" para as subclasses, garantindo que certos métodos sejam implementados, enquanto outros podem ter uma implementação padrão.

A relevância desse conceito reside na capacidade de modelar situações onde uma classe genérica não pode ser instanciada diretamente porque possui um comportamento incompleto ou genérico demais para ser útil por si só. Ela serve como uma "planta" ou um "template" para outras classes mais específicas, que herdarão e completarão essa funcionalidade. Para você, Gedê, que trabalha com backend, isso se traduz em criar APIs mais robustas e com código organizado, por exemplo, ao lidar com diferentes tipos de entidades que compartilham características, mas se diferenciam em comportamentos específicos.

### 2\. Sumário

- Definição e Conceitos Fundamentais
    - O que são Classes Abstratas?
    - O que são Métodos Abstratos?
- Sintaxe e Estrutura
- Componentes Principais
- Restrições de Uso
- Exemplos de Código Otimizados
- Informações Adicionais
- Referências para Estudo Independente

### 3\. Conteúdo Detalhado

### Definição e Conceitos Fundamentais

**O que são Classes Abstratas?**

Uma **classe abstrata** é uma classe que não pode ser instanciada diretamente. Ela é declarada com a palavra-chave `abstract` e é projetada para ser herdada por outras classes. O propósito principal de uma classe abstrata é fornecer uma base comum de atributos e comportamentos para um grupo de subclasses relacionadas, mas sem a necessidade de definir completamente todos os seus métodos.

Pense em uma classe abstrata como um modelo incompleto. Ela pode ter métodos concretos (com implementação) e métodos abstratos (sem implementação, apenas a assinatura). As subclasses que herdam de uma classe abstrata são obrigadas a fornecer implementações para todos os métodos abstratos da superclasse, a menos que a subclasse também seja declarada como abstrata.

**Para que servem?**
Classes abstratas servem para:

- Definir um contrato para as subclasses, garantindo que elas implementem certos comportamentos.
- Compartilhar código e atributos comuns entre subclasses.
- Modelar conceitos genéricos que não fazem sentido serem instanciados por si só (ex: um "Animal" genérico não existe, mas um "Cachorro" ou "Gato" sim).

**O que são Métodos Abstratos?**

Um **método abstrato** é um método declarado em uma classe abstrata (ou em uma interface, mas aqui focamos em classes) que não possui uma implementação (corpo). Ele é declarado com a palavra-chave `abstract` e termina com um ponto e vírgula, sem chaves `{}`.

**Para que servem?**
Métodos abstratos servem para:

- Forçar as subclasses a fornecerem uma implementação para aquele método específico, garantindo que um determinado comportamento esteja presente em todas as classes concretas da hierarquia.
- Permitir que a classe abstrata defina o que deve ser feito (o contrato), mas deixe para as subclasses a responsabilidade de como será feito (a implementação).

### Sintaxe e Estrutura

**Declaração de uma Classe Abstrata:**

```java
public abstract class NomeDaClasseAbstrata {
    // Atributos (podem ser abstratos ou concretos)
    protected String nome;

    // Construtores (podem existir em classes abstratas)
    public NomeDaClasseAbstrata(String nome) {
        this.nome = nome;
    }

    // Métodos concretos (com implementação)
    public void exibirInformacao() {
        System.out.println("Nome: " + this.nome);
    }

    // Métodos abstratos (sem implementação)
    public abstract void realizarAcao();
    public abstract double calcularValor(double parametro);
}

```

**Declaração de um Método Abstrato:**

```java
public abstract void nomeDoMetodoAbstrato(Tipo parametro1, Tipo parametro2);

```

### Componentes Principais

- **`abstract` keyword:** A palavra-chave essencial para declarar tanto a classe quanto o método como abstratos.
- **Métodos Concretos:** Classes abstratas podem (e geralmente devem) ter métodos com implementações completas. Isso permite que a lógica comum seja compartilhada entre as subclasses.
- **Construtores:** Classes abstratas podem ter construtores. Eles são chamados pelas subclasses através da palavra-chave `super()` para inicializar os atributos herdados.
- **Subclasses Concretas:** São as classes que herdam de uma classe abstrata e são as responsáveis por implementar todos os métodos abstratos da superclasse. Somente subclasses concretas podem ser instanciadas.

### Restrições de Uso

1. **Não pode ser instanciada:** Você não pode criar objetos diretamente de uma classe abstrata. Por exemplo, `new NomeDaClasseAbstrata()` resultará em erro de compilação.
2. **Métodos abstratos em classes não abstratas:** Um método abstrato só pode existir dentro de uma classe abstrata. Se você declarar um método abstrato em uma classe, a classe deve ser declarada como abstrata.
3. **Implementação Obrigatória:** Uma subclasse concreta que herda de uma classe abstrata deve implementar *todos* os métodos abstratos da superclasse, a menos que a subclasse também seja declarada como abstrata.
4. **`final` e `abstract`:** Uma classe não pode ser `final` e `abstract` ao mesmo tempo, pois `final` impede herança e `abstract` exige herança para ser implementada.
5. **`static` e `abstract`:** Métodos estáticos não podem ser abstratos, pois métodos estáticos pertencem à classe e não a uma instância, e não podem ser sobrescritos por subclasses.

### 4\. Exemplos de Código Otimizados

Vamos simular um cenário onde você, Gedê, pode usar classes abstratas para gerenciar diferentes tipos de veículos em um sistema, talvez para uma empresa de logística ou aluguel de veículos.

**Caso de Uso: Sistema de Veículos**

Imagine que você precisa modelar diferentes tipos de veículos em um sistema. Todos os veículos têm algumas características e comportamentos em comum (como acelerar, frear), mas outros são específicos (como ligar um carro versus uma moto).

```java
// 1. Classe Abstrata: Veiculo
// Define um contrato para todos os tipos de veículos
public abstract class Veiculo {

    private String marca;
    private String modelo;
    private int ano;
    protected boolean ligado; // Protegido para acesso pelas subclasses

    public Veiculo(String marca, String modelo, int ano) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.ligado = false;
    }

    // Método concreto: comportamento padrão para todos os veículos
    public void acelerar() {
        if (ligado) {
            System.out.println(modelo + " acelerando...");
        } else {
            System.out.println(modelo + " não pode acelerar, está desligado.");
        }
    }

    // Método concreto: comportamento padrão para todos os veículos
    public void frear() {
        if (ligado) {
            System.out.println(modelo + " freando...");
        } else {
            System.out.println(modelo + " não pode frear, está desligado.");
        }
    }

    // Método abstrato: Força as subclasses a implementarem sua própria lógica de ligar
    public abstract void ligar();

    // Método abstrato: Força as subclasses a implementarem sua própria lógica de desligar
    public abstract void desligar();

    // Getters para os atributos (exemplo)
    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public int getAno() {
        return ano;
    }
}

```

```java
// 2. Subclasse Concreta: Carro
// Implementa os métodos abstratos de Veiculo
public class Carro extends Veiculo {

    private int numeroPortas;

    public Carro(String marca, String modelo, int ano, int numeroPortas) {
        super(marca, modelo, ano); // Chama o construtor da superclasse
        this.numeroPortas = numeroPortas;
    }

    @Override
    public void ligar() {
        if (!ligado) {
            ligado = true;
            System.out.println("Carro " + getModelo() + " ligado com a chave.");
        } else {
            System.out.println("Carro " + getModelo() + " já está ligado.");
        }
    }

    @Override
    public void desligar() {
        if (ligado) {
            ligado = false;
            System.out.println("Carro " + getModelo() + " desligado.");
        } else {
            System.out.println("Carro " + getModelo() + " já está desligado.");
        }
    }

    public int getNumeroPortas() {
        return numeroPortas;
    }
}

```

```java
// 3. Subclasse Concreta: Moto
// Implementa os métodos abstratos de Veiculo
public class Moto extends Veiculo {

    private boolean temCapacete;

    public Moto(String marca, String modelo, int ano, boolean temCapacete) {
        super(marca, modelo, ano);
        this.temCapacete = temCapacete;
    }

    @Override
    public void ligar() {
        if (!ligado) {
            ligado = true;
            System.out.println("Moto " + getModelo() + " ligada com o pedal.");
        } else {
            System.out.println("Moto " + getModelo() + " já está ligada.");
        }
    }

    @Override
    public void desligar() {
        if (ligado) {
            ligado = false;
            System.out.println("Moto " + getModelo() + " desligada.");
        } else {
            System.out.println("Moto " + getModelo() + " já está desligada.");
        }
    }

    public boolean isTemCapacete() {
        return temCapacete;
    }
}

```

```java
// 4. Classe de Teste (Main)
public class SistemaVeiculos {
    public static void main(String[] args) {
        // Não podemos instanciar diretamente a classe abstrata Veiculo
        // Veiculo v = new Veiculo("Genérica", "Modelo", 2020); // ERRO DE COMPILAÇÃO!

        Carro meuCarro = new Carro("Ford", "Fusion", 2022, 4);
        Moto minhaMoto = new Moto("Honda", "CBR500R", 2023, true);

        System.out.println("--- Meu Carro ---");
        meuCarro.exibirInformacao(); // Método concreto herdado
        meuCarro.ligar(); // Implementação específica de Carro
        meuCarro.acelerar(); // Método concreto herdado
        meuCarro.frear(); // Método concreto herdado
        meuCarro.desligar(); // Implementação específica de Carro
        System.out.println("Número de portas: " + meuCarro.getNumeroPortas());
        System.out.println("\\n");

        System.out.println("--- Minha Moto ---");
        minhaMoto.exibirInformacao(); // Método concreto herdado
        minhaMoto.ligar(); // Implementação específica de Moto
        minhaMoto.acelerar(); // Método concreto herdado
        minhaMoto.desligar(); // Implementação específica de Moto
        System.out.println("Usa capacete: " + minhaMoto.isTemCapacete());
        System.out.println("\\n");

        // Polimorfismo: Podemos usar a referência da classe abstrata
        // para se referir a objetos das subclasses
        Veiculo veiculoGenerico1 = new Carro("Toyota", "Corolla", 2020, 4);
        Veiculo veiculoGenerico2 = new Moto("Yamaha", "MT-07", 2021, false);

        System.out.println("--- Veículo Polimórfico (Carro) ---");
        veiculoGenerico1.ligar(); // Chama a implementação de Carro
        veiculoGenerico1.acelerar();
        System.out.println("\\n");

        System.out.println("--- Veículo Polimórfico (Moto) ---");
        veiculoGenerico2.ligar(); // Chama a implementação de Moto
        veiculoGenerico2.frear();
    }
}

```

**Explicação dos Exemplos:**

- A classe `Veiculo` é abstrata, pois não faz sentido instanciar um "veículo" genérico. Ela define comportamentos comuns (`acelerar`, `frear`) como métodos concretos e comportamentos específicos (`ligar`, `desligar`) como métodos abstratos, forçando as subclasses a implementá-los.
- `Carro` e `Moto` são subclasses concretas que estendem `Veiculo` e fornecem suas próprias implementações para `ligar()` e `desligar()`, conforme exigido pelo contrato da superclasse.
- No `main`, demonstramos que `Veiculo` não pode ser instanciado diretamente. No entanto, podemos usar a referência `Veiculo` para apontar para objetos `Carro` ou `Moto` (polimorfismo), permitindo tratar diferentes tipos de veículos de forma unificada.

### 5\. Informações Adicionais

- **Classes Abstratas vs. Interfaces:** Esta é uma dúvida comum. A principal diferença é que uma classe abstrata pode ter métodos com implementação (métodos concretos) e atributos não-estáticos/não-finais, enquanto uma interface (antes do Java 8) só podia ter métodos abstratos (public e abstract implicitamente) e constantes estáticas/finais. A partir do Java 8, interfaces podem ter métodos `default` (com implementação) e métodos `static`, borrando um pouco a linha.
    - **Use Classe Abstrata quando:**
        - Você quer compartilhar código entre várias classes relacionadas.
        - Você precisa de um modelo com métodos concretos e métodos abstratos.
        - Sua hierarquia de classes representa um "é um" relacionamento forte (ex: Carro *é um* Veiculo).
        - Você precisa de atributos de estado para a hierarquia.
    - **Use Interface quando:**
        - Você quer definir um contrato de comportamento que várias classes *não relacionadas* podem implementar.
        - Você quer alcançar polimorfismo de uma forma mais flexível (uma classe pode implementar várias interfaces, mas só pode estender uma única classe).
- **Hierarquias de Herança:** Classes abstratas são excelentes para construir hierarquias de herança bem definidas, onde você pode ter múltiplos níveis de abstração (uma classe abstrata estendendo outra classe abstrata).
- **Design Patterns:** Classes e métodos abstratos são componentes chave em vários padrões de projeto, como o Template Method, onde uma classe abstrata define o esqueleto de um algoritmo, mas deixa os passos para as subclasses.

### 6\. Referências para Estudo Independente

Para aprofundar seus conhecimentos, Gedê, recomendo os seguintes recursos:

- **Documentação Oficial Java (Oracle):**
    - [Classes Abstratas](https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html)
    - [Interfaces (para comparação)](https://www.google.com/search?q=https://docs.oracle.com/javase/tutorial/java/IandI/interfaces.html)
- **GeeksforGeeks:**
    - [Abstract Classes in Java](https://www.geeksforgeeks.org/abstract-classes-in-java/)
- **Baeldung:** (Excelente para exemplos práticos e explicações detalhadas)
    - [A Guide to Abstract Classes in Java](https://www.google.com/search?q=https://www.baeldung.com/java-abstract-classes)
    - [Java 8 Default Methods in Interfaces](https://www.google.com/search?q=https://www.baeldung.com/java-8-default-methods) (para entender a evolução das interfaces)
- **Livros:**
    - **"Effective Java"** de Joshua Bloch: Embora não seja focado apenas em classes abstratas, este livro aborda as melhores práticas de design em Java, incluindo o uso apropriado de herança e polimorfismo.
    - **"Use a Cabeça\! Java"** de Kathy Sierra & Bert Bates: Uma abordagem mais didática e visual para entender os fundamentos de Java, incluindo POO.

---

Espero que essa explicação detalhada sobre classes e métodos abstratos seja muito útil para você, Gedê\! Se tiver mais alguma dúvida ou quiser que eu prepare algo sobre outro tópico da sua grade, é só falar, A.R.I.A está aqui para ajudar\!