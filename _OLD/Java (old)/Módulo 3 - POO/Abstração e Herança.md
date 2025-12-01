# Módulo 3: Programação Orientada a Objetos (POO)

### 1. Abstração e Herança

#### `Abstração`
Abstração em POO é o processo de identificar os aspectos essenciais de uma entidade, ignorando os detalhes menos importantes ou acidentais. Em Java, abstração é implementada principalmente através de classes abstratas e interfaces.

**Conceitos Chave:**
- **Classes Abstratas:** São usadas para representar entidades que não devem ser instanciadas. Uma classe abstrata pode conter métodos abstratos (sem corpo) e métodos concretos.
  
  **Exemplo:**
  ```java
  abstract class Veiculo {
      abstract void mover();
  }
  ```

- **Interfaces:** São contratos que podem ser implementados por qualquer classe. Interfaces apenas declaram métodos, mas não fornecem implementação.

  **Exemplo:**
  ```java
  interface Controlavel {
      void iniciar();
      void parar();
  }
  ```

**Aplicação Prática:**
- Projeto: Crie um sistema para gerenciar veículos, onde cada tipo de veículo deve implementar uma interface `Controlavel`.

---

#### `Herança`
Herança é um mecanismo pelo qual uma nova classe (subclasse) pode herdar as características de uma classe já existente (superclasse).

**Conceitos Chave:**
- **Superclasse e Subclasse:** A superclasse é a classe da qual outras classes derivam. A subclasse é a classe que herda de outra classe.

  **Exemplo:**
  ```java
  class Carro extends Veiculo {
      @Override
      void mover() {
          System.out.println("Carro se movendo");
      }
  }
  ```

- **Sobrescrita de Métodos (Override):** Subclasses podem sobrescrever métodos da superclasse para fornecer uma implementação específica.

  **Exemplo:**
  ```java
  class Barco implements Controlavel {
      public void iniciar() {
          System.out.println("Barco iniciando");
      }

      public void parar() {
          System.out.println("Barco parando");
      }
  }
  ```

- **Uso de `super`:** A palavra-chave `super` é usada para acessar métodos da superclasse.

  **Exemplo:**
  ```java
  class Caminhao extends Veiculo {
      @Override
      void mover() {
          super.mover();
          System.out.println("Caminhão se movendo");
      }
  }
  ```

**Aplicação Prática:**
- Projeto: Amplie o sistema de gerenciamento de veículos, permitindo que diferentes tipos de veículos herdem da classe `Veiculo` e implementem seus próprios métodos de movimento.

---

#### Exercícios e Desafios
1. **Implementar Classe Abstrata:** Crie uma classe abstrata `Animal` com um método abstrato `emitirSom`.
2. **Extender Classe Abstrata:** Crie classes `Cachorro` e `Gato` que estendem `Animal` e implementam o método `emitirSom`.
3. **Interface com Múltiplas Implementações:** Implemente a interface `Controlavel` em diferentes tipos de veículos e teste seu funcionamento.
4. **Sobrescrita Avançada:** Em uma classe `Bicicleta` que herda de `Veiculo`, sobrescreva o método `mover` e use `super` para chamar a implementação da superclasse.
