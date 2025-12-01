# Módulo 3: Programação Orientada a Objetos (POO)

## 1. O que é o Polimorfismo?

Polimorfismo é um conceito central em POO que permite que objetos de diferentes classes sejam tratados como objetos de uma classe comum. O termo vem do grego "poli" (muitos) e "morfismo" (formas).

### Conceitos-Chave
- **Polimorfismo de Tempo de Execução**: Realizado através de herança e interfaces, onde a chamada de um método pode ter comportamentos diferentes.
- **Polimorfismo de Tempo de Compilação**: Realizado através de sobrecarga de métodos.

### Exemplo de Polimorfismo de Tempo de Execução

```java
class Animal {
    public void som() {
        System.out.println("O animal faz um som");
    }
}

class Cachorro extends Animal {
    public void som() {
        System.out.println("O cachorro late");
    }
}

public class TestePolimorfismo {
    public static void main(String[] args) {
        Animal meuAnimal = new Animal();
        Animal meuCachorro = new Cachorro();

        meuAnimal.som(); // Saída: O animal faz um som
        meuCachorro.som(); // Saída: O cachorro late
    }
}
```

## 2. Sobrecarga e Sobrescrita

### `Sobrecarga (Overloading)`
Refere-se a ter múltiplos métodos com o mesmo nome, mas com diferentes listas de parâmetros.

#### Exemplo de Sobrecarga

```java
class ExemploSobrecarga {
    void demo(int a) {
        System.out.println("a: " + a);
    }

    void demo(int a, int b) {
        System.out.println("a e b: " + a + "," + b);
    }

    double demo(double a) {
        System.out.println("double a: " + a);
        return a*a;
    }
}
```

### `Sobrescrita (Overriding)`
Refere-se a um método filho que tem o mesmo nome, parâmetros e tipo de retorno que um método em sua classe pai.

#### Exemplo de Sobrescrita

```java
class Superclasse {
    void exibir() {
        System.out.println("Superclasse exibir()");
    }
}

class Subclasse extends Superclasse {
    void exibir() {
        System.out.println("Subclasse exibir()");
    }
}
```

## 3. Construtores e Instanciação Polimórfica

Construtores e destrutores são conceitos fundamentais na programação orientada a objetos, cada um desempenhando um papel crucial no ciclo de vida de um objeto. Vamos detalhar esses conceitos, especialmente como eles se aplicam em Java, que possui construtores mas não tem destrutores no sentido tradicional como em algumas outras linguagens, como C++.

### `Construtores`

#### Definição
- **Construtores** são métodos especiais usados para inicializar objetos. Eles são chamados automaticamente quando um novo objeto é criado.

#### Características
- **Nome do Construtor**: O nome do construtor deve ser o mesmo da classe.
- **Sem Retorno**: Construtores não têm tipo de retorno, nem mesmo `void`.
- **Sobrecarga de Construtores**: Java permite a sobrecarga de construtores, o que significa que uma classe pode ter mais de um construtor, desde que cada um deles tenha listas de parâmetros diferentes.

#### Exemplo em Java
```java
public class Exemplo {
    int valor;

    // Construtor
    public Exemplo(int valorInicial) {
        valor = valorInicial;
    }
}
```

#### Uso
- **Inicialização de Atributos**: Principalmente usado para inicializar atributos do objeto.
- **Chamar Outros Construtores**: Dentro de um construtor, você pode chamar outro construtor da mesma classe usando `this`.

### `Instanciação Polimórfica`
A instanciação polimórfica é um conceito fundamental em programação orientada a objetos (POO) e desempenha um papel crucial no Java. Ela permite que um objeto seja referenciado de várias formas, principalmente através de classes base ou interfaces. Vamos detalhar mais sobre este conceito:

### Conceito de Instanciação Polimórfica
- **Definição**: Instanciação polimórfica ocorre quando uma instância de uma subclasse é tratada como uma instância de uma classe base ou interface.
- **Flexibilidade**: Permite que um objeto seja utilizado de maneiras diferentes, dependendo de como ele é referenciado.

### Como Funciona
- **Referência de Superclasse**: Um objeto de uma subclasse pode ser referenciado por um tipo de sua superclasse.
- **Referência de Interface**: Um objeto pode ser referenciado por uma interface que ele implementa.

### Vantagens
1. **Reutilização de Código**: Permite reutilizar métodos e propriedades da classe base ou interface.
2. **Desacoplamento**: Reduz a dependência entre o código e as implementações específicas das classes.
3. **Flexibilidade e Escalabilidade**: Facilita a adição de novas classes sem alterar muito o código existente.

### Exemplo Detalhado

Vamos considerar um exemplo com uma interface `Veiculo` e duas classes `Carro` e `Moto` que a implementam:

```java
interface Veiculo {
    void acelerar();
}

class Carro implements Veiculo {
    public void acelerar() {
        System.out.println("Carro acelerando");
    }
}

class Moto implements Veiculo {
    public void acelerar() {
        System.out.println("Moto acelerando");
    }
}
```

Aqui, `Carro` e `Moto` são subclasses que implementam a interface `Veiculo`. Podemos criar instâncias dessas subclasses e referenciá-las como objetos do tipo `Veiculo`:

```java
Veiculo meuCarro = new Carro();
Veiculo minhaMoto = new Moto();

meuCarro.acelerar(); // Saída: Carro acelerando
minhaMoto.acelerar(); // Saída: Moto acelerando
```

Neste exemplo, `meuCarro` e `minhaMoto` são instâncias de `Carro` e `Moto`, respectivamente, mas são referenciadas como objetos do tipo `Veiculo`. Isso é instanciação polimórfica.

### Uso Prático
- **Frameworks e Bibliotecas**: Muito usada em frameworks e bibliotecas, onde classes específicas podem ser substituídas ou estendidas sem alterar o comportamento esperado.
- **Design de Software**: Facilita o design de software flexível e extensível, especialmente em sistemas grandes e complexos.

### Conclusões

A instanciação polimórfica é uma ferramenta poderosa na POO, permitindo que os programadores escrevam códigos mais genéricos, reutilizáveis e fáceis de manter. É essencial para a implementação de princípios de design de software, como o princípio de inversão de dependência e o princípio aberto-fechado.
