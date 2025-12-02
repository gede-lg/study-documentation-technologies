# Interfaces e Implementações em Módulos Java

## **O que são e para que servem?**

### **Interfaces**
- Uma interface em Java é um tipo de referência, semelhante a uma classe, que pode conter apenas constantes, métodos assinatura, métodos padrão, métodos estáticos e tipos aninhados.
- **Utilidade:**
  - Define um contrato que as classes implementadoras devem seguir.
  - Promove a abstração e a flexibilidade, permitindo que diferentes classes implementem a mesma interface de maneiras distintas.

### **Implementações**
- Implementações são classes concretas que fornecem a lógica para os métodos definidos em uma interface.
- **Utilidade:**
  - Concretiza a lógica de negócios ou funcionalidades especificadas pela interface.
  - Permite polimorfismo; diferentes implementações podem ser usadas de forma intercambiável, desde que sigam a mesma interface.

## **'Provides With' em Módulos Java**

- Em Java, o sistema de módulos introduzido no Java 9 usa a declaração `provides ... with ...` para especificar que um módulo fornece uma certa implementação de uma interface de serviço.

### **Exemplo:**

```java
module com.example.myapp {
    provides com.example.myapp.service.MyService with com.example.myapp.impl.MyServiceImpl;
}
```

- Neste exemplo, o módulo `com.example.myapp` declara que fornece uma implementação `MyServiceImpl` para a interface de serviço `MyService`.

## **'Uses' em Módulos Java**

- O `uses` declara que um módulo depende de uma implementação de uma interface de serviço, sem especificar qual implementação.

### **Exemplo:**

```java
module com.example.consumer {
    uses com.example.myapp.service.MyService;
}
```

- Aqui, o módulo `com.example.consumer` indica que usa alguma implementação da interface `MyService`, mas não especifica qual.

## **Importância e Aplicações**

- **Desacoplamento e Flexibilidade:**
  - Permite que os desenvolvedores substituam implementações sem modificar o código que usa a interface.
- **Manutenibilidade:**
  - Facilita a manutenção e a atualização de implementações específicas.
- **Injeção de Dependência:**
  - Através do mecanismo de 'uses', é possível injetar diferentes implementações, facilitando, por exemplo, a realização de testes.

## **Exemplo Prático**

Considere uma interface `PaymentService` e duas implementações, `CreditCardPayment` e `PaypalPayment`. Usando `provides with`, um módulo pode declarar que oferece uma dessas implementações. Com `uses`, outro módulo pode declarar que utiliza o `PaymentService` sem se preocupar com a implementação específica.

```java
// Interface
public interface PaymentService {
    void processPayment(double amount);
}

// Implementação 1
public class CreditCardPayment implements PaymentService {
    @Override
    public void processPayment

(double amount) {
        // Lógica para pagamento com cartão de crédito
    }
}

// Implementação 2
public class PaypalPayment implements PaymentService {
    @Override
    public void processPayment(double amount) {
        // Lógica para pagamento via PayPal
    }
}

// Módulo que fornece as implementações
module com.example.payments {
    exports com.example.payments;
    provides com.example.payments.PaymentService with com.example.payments.CreditCardPayment, com.example.payments.PaypalPayment;
}

// Módulo que usa o serviço de pagamento
module com.example.consumer {
    requires com.example.payments;
    uses com.example.payments.PaymentService;
}
```

## **Conclusão**

- O uso de interfaces e implementações em módulos Java proporciona uma arquitetura de software mais limpa, modular e flexível.
- A declaração `provides with` em um módulo permite especificar quais implementações de uma interface de serviço estão disponíveis, enquanto `uses` permite que outros módulos declarem uma dependência em uma interface de serviço sem se comprometer com uma implementação específica.
- Esse sistema de módulos facilita a manutenção, a substituição de implementações e a injeção de dependência, tornando-o ideal para aplicações modernas e escaláveis em Java.

---

**Nota Adicional:** Ao projetar sistemas usando interfaces e implementações em módulos Java, é importante considerar princípios de design como SOLID e padrões de design para garantir que o sistema seja robusto, escalável e fácil de manter.