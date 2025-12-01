### O que é e para que serve?

Ordenar testes refere-se à prática de definir uma ordem específica na qual os testes devem ser executados. Em situações normais, testes unitários são projetados para serem independentes uns dos outros, permitindo que sejam executados em qualquer ordem ou em paralelo. No entanto, pode haver casos em que a ordem de execução dos testes precisa ser controlada para atender a requisitos específicos, como dependências entre testes ou para garantir que certos pré-requisitos sejam atendidos antes de executar um conjunto de testes.

### Quando e como usar

A ordenação de testes deve ser usada com cuidado, pois a prática pode indicar que os testes não são completamente independentes, o que é um mau sinal em testes unitários. Idealmente, cada teste deve ser autossuficiente e isolado dos outros para que possam ser executados em qualquer ordem sem interferir nos resultados. No entanto, em alguns casos, como testes de integração ou de sistemas, pode ser necessário garantir uma ordem específica.

#### Exemplos de uso

1. **Testes de integração**: Onde você pode precisar configurar um ambiente ou estado específico antes de executar testes que dependem desse estado.
2. **Testes de migração de banco de dados**: Onde a ordem das migrações é crucial e precisa ser verificada em uma sequência específica.
3. **Testes de configuração complexa**: Onde a configuração inicial deve ser verificada antes de executar testes que dependem dessa configuração.

### Ordenando Testes com JUnit 5

No JUnit 5, você pode usar a anotação `@TestMethodOrder` para especificar a ordem dos testes em uma classe de teste. Existem diferentes modos de ordenar testes, como ordem alfabética, ordem numérica usando uma anotação personalizada, ou uma ordem definida por uma classe customizada.

#### Exemplos de Código

1. **Ordenando testes em ordem alfabética**

```java
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@TestMethodOrder(MethodOrderer.Alphanumeric.class)
class OrderedTests {

    @Test
    void testA() {
        System.out.println("Running testA");
    }

    @Test
    void testB() {
        System.out.println("Running testB");
    }

    @Test
    void testC() {
        System.out.println("Running testC");
    }
}
```

2. **Ordenando testes usando uma anotação personalizada**

```java
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@TestMethodOrder(OrderAnnotation.class)
class OrderedTests {

    @Test
    @Order(1)
    void testFirst() {
        System.out.println("Running testFirst");
    }

    @Test
    @Order(2)
    void testSecond() {
        System.out.println("Running testSecond");
    }

    @Test
    @Order(3)
    void testThird() {
        System.out.println("Running testThird");
    }
}
```

3. **Ordenando testes usando uma classe customizada**

```java
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Order;

import java.lang.reflect.Method;
import java.util.Comparator;

@TestMethodOrder(CustomOrderer.class)
class CustomOrderedTests {

    @Test
    void testA() {
        System.out.println("Running testA");
    }

    @Test
    void testB() {
        System.out.println("Running testB");
    }

    @Test
    void testC() {
        System.out.println("Running testC");
    }
}

class CustomOrderer implements MethodOrderer {
    @Override
    public void orderMethods(MethodOrderContext context) {
        context.getMethodDescriptors().sort(Comparator.comparing(Method::getName));
    }
}
```

### Considerações Importantes

1. **Independência dos Testes**: Sempre que possível, os testes devem ser independentes. Dependência de ordem pode levar a fragilidade dos testes, onde a falha de um teste pode afetar outros.
2. **Legibilidade e Manutenção**: Testes que requerem uma ordem específica podem ser mais difíceis de ler e manter. É importante documentar claramente porque a ordem é necessária.
3. **Evitar Dependências Ocultas**: Garanta que a necessidade de uma ordem específica seja explícita e bem documentada para evitar que futuras alterações nos testes quebrem a sequência necessária.
4. **Alternativas**: Em vez de depender da ordem dos testes, considere usar métodos de setup (`@BeforeEach`, `@BeforeAll`) para configurar o estado necessário para cada teste.

### Conclusão

Ordenar testes é uma técnica útil em casos específicos onde a ordem de execução é crucial para o sucesso dos testes. No entanto, essa prática deve ser usada com cautela e bem documentada para evitar problemas de manutenção e confiabilidade. A independência dos testes deve ser sempre priorizada para garantir um suite de testes robusta e confiável.