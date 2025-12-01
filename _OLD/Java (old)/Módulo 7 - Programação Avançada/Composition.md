# Composition

### O que é Composition?

#### Definição
No contexto da programação orientada a objetos, a **composição** é um princípio de design onde um objeto é construído usando outros objetos. Em outras palavras, um objeto composto possui outros objetos como parte de sua estrutura. A composição é frequentemente contrastada com a herança, e é um meio de alcançar a reutilização de código.

#### Características Principais
1. **Relação "tem-um":** A composição é uma relação "tem-um" (has-a). Por exemplo, um objeto `Carro` pode ter um objeto `Motor`.
2. **Propriedade e Encapsulamento:** O objeto composto possui e gerencia a vida útil dos objetos que o compõem. Quando o objeto composto é destruído, seus componentes internos também são.
3. **Independência das Classes:** As classes que são combinadas não precisam estar relacionadas por uma hierarquia de herança. Elas podem ser totalmente independentes, promovendo a modularidade.
4. **Fortalece o Encapsulamento:** Detalhes de implementação dos objetos componentes são mantidos ocultos, fortalecendo o encapsulamento.

#### Vantagens sobre a Herança
- **Flexibilidade:** A composição é mais flexível do que a herança, pois permite mudar o comportamento dos objetos em tempo de execução, trocando componentes.
- **Evita Problemas de Herança Profunda:** Evita a complexidade e as limitações da herança, especialmente a herança múltipla ou profunda.
- **Reutilização de Código:** Promove a reutilização de código sem forçar uma relação de herança.

#### Exemplo de Composição em Java

```java
class Motor {
    void iniciar() {
        System.out.println("Motor iniciado.");
    }
}

class Carro {
    private Motor motor;

    Carro() {
        motor = new Motor();
    }

    void iniciarCarro() {
        motor.iniciar();
        System.out.println("Carro iniciado.");
    }
}

public class Main {
    public static void main(String[] args) {
        Carro carro = new Carro();
        carro.iniciarCarro();
    }
}
```

Neste exemplo, `Carro` compõe-se de um `Motor`. A classe `Carro` controla a criação e a vida útil do `Motor`. Se o `Carro` é destruído, o `Motor` associado também é.

#### Conclusão
A composição é um princípio fundamental no design de software orientado a objetos, enfatizando a construção de objetos mais complexos a partir de objetos mais simples e independentes.