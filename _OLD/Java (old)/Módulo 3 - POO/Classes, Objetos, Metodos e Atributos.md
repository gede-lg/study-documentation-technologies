## O que é POO e quais suas vantagens?

### `Programação Orientada a Objetos (POO)`

#### Conceito:
POO é um paradigma de programação baseado no conceito de "objetos". Esses objetos são instâncias de "classes", que agrupam um conjunto de atributos (dados) e métodos (funções ou procedimentos) que operam nesses dados. 

#### Características Principais:
1. **Encapsulamento**: Agrupa dados e métodos que operam nesses dados em unidades chamadas classes, ocultando detalhes internos do objeto do mundo externo.
2. **Abstração**: Focaliza nas características essenciais de um objeto, ignorando detalhes irrelevantes ou acidentais.
3. **Herança**: Permite a criação de novas classes a partir de classes existentes, herdando atributos e métodos e permitindo a extensão ou modificação de comportamentos.
4. **Polimorfismo**: Capacidade de um objeto ser referenciado de várias formas, principalmente através de interfaces ou classes base.

#### Exemplo em Java:
```java
public class Carro {
    private String modelo;
    private int ano;

    public Carro(String modelo, int ano) {
        this.modelo = modelo;
        this.ano = ano;
    }

    public void exibirInfo() {
        System.out.println("Modelo: " + modelo + ", Ano: " + ano);
    }
}
```

### `Programação Estruturada (PE)`

#### Conceito:
A Programação Estruturada é um paradigma de programação que enfatiza a sequência lógica e clara de procedimentos (funções) e o fluxo de dados. Ela se baseia no uso de subrotinas, estruturas de controle de fluxo (como if/else, loops) e blocos de código.

#### Características Principais:
1. **Sequencial**: A execução do programa segue uma sequência linear, começando no topo e seguindo até o final do script.
2. **Controle de Fluxo**: Usa estruturas de decisão (if/else) e loops (for, while) para controlar o fluxo de execução.
3. **Subrotinas e Funções**: Divide o código em blocos menores chamados funções, que realizam tarefas específicas.

#### Exemplo em Java:
```java
public class Calculadora {

    public static int somar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int resultado = somar(5, 10);
        System.out.println("Resultado: " + resultado);
    }
}
```

### Diferenças Chave:

- **Abordagem de Design**: POO é centrada em objetos e suas interações, enquanto a PE é focada na estrutura lógica e na sequência de ações.
- **Organização do Código**: Na POO, o código e os dados estão encapsulados juntos em objetos. Na PE, o código é dividido em funções e procedimentos.
- **Reusabilidade e Manutenção**: POO facilita a reusabilidade de código através da herança e promove facilidade de manutenção. A PE pode tornar a reusabilidade e a manutenção mais desafiadoras, especialmente em programas maiores.
- **Escalabilidade**: A POO é geralmente mais escalável devido à sua natureza modular, enquanto programas estruturados podem se tornar complexos e difíceis de gerenciar à medida que crescem.

Ambos os paradigmas têm seus méritos e são escolhidos com base nas necessidades específicas do projeto e na familiaridade dos desenvolvedores com o paradigma.

### Vantagens da POO:

- **Modularidade**: O código é dividido em partes menores chamadas classes, tornando-o mais gerenciável.
- **Reutilização de Código (Herança)**: As classes podem herdar características de outras classes.
- **Encapsulamento**: Os detalhes da implementação de uma classe podem ser ocultados, expondo apenas uma interface pública.
- **Extensibilidade (Polimorfismo)**: A capacidade de uma classe de ser estendida para criar novas classes.

## O que são classes e Objetos?

### Classes
Uma classe é um "blueprint" ou protótipo a partir do qual os objetos são criados. Ela define um tipo de dados, encapsulando dados e métodos que operam nesses dados.

```java
public class Pessoa {
    String nome;
    int idade;

    void dizerOla() {
        System.out.println("Olá, meu nome é " + nome);
    }
}
```

### Objetos
Um objeto é uma instância de uma classe. Quando uma classe é definida, nenhum espaço de memória é alocado até que um objeto dessa classe seja criado.

```java
public class Main {
    public static void main(String[] args) {
        Pessoa pessoa1 = new Pessoa();
        pessoa1.nome = "João";
        pessoa1.dizerOla(); // Saída: Olá, meu nome é João
    }
}
```

## O que são métodos e atributos?

### Atributos
Atributos são variáveis que pertencem a uma classe. Eles definem as características de um objeto.

```java
public class Livro {
    String titulo;
    String autor;
}
```

### Métodos
Métodos são funções definidas dentro de uma classe. Eles descrevem as ações que um objeto pode realizar.

```java
public class Calculadora {
    int somar(int a, int b) {
        return a + b;
    }
}
```

## Exemplo Integrado:

```java
public class ContaBancaria {
    // Atributos
    private String titular;
    private double saldo;

    // Construtor
    public ContaBancaria(String titular, double saldoInicial) {
        this.titular = titular;
        this.saldo = saldoInicial;
    }

    // Métodos
    void depositar(double valor) {
        saldo += valor;
    }

    boolean sacar(double valor) {
        if (saldo >= valor) {
            saldo -= valor;
            return true;
        }
        return false;
    }

    double consultarSaldo() {
        return saldo;
    }
}
```

Este módulo deve ser seguido por exercícios práticos para consolidar o aprendizado, como a criação de classes representando diferentes entidades e a implementação de métodos para manipulá-las.
