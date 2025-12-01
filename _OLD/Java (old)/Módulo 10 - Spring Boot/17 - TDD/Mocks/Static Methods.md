### Mocking Static Methods no Mockito

### O que é e para que serve?

Mocking é uma técnica utilizada em testes de software para simular o comportamento de objetos complexos ou externos que não são o foco do teste. Essa técnica permite isolar o código em teste e controlar o comportamento dos seus colaboradores. Mocking de métodos estáticos refere-se à capacidade de simular o comportamento de métodos estáticos de uma classe.

Métodos estáticos são invocados diretamente na classe, sem a necessidade de criar uma instância. Esses métodos são frequentemente utilizados para utilitários, funções matemáticas, manipulação de strings e outras operações globais. No entanto, testar código que depende de métodos estáticos pode ser desafiador porque esses métodos não podem ser facilmente substituídos ou "mockados" como métodos de instância.

### Quando e como usar

Mocking de métodos estáticos é especialmente útil quando:

- O método estático tem efeitos colaterais ou interage com sistemas externos (e.g., acessa banco de dados, faz chamadas de rede).
- Você precisa isolar o código em teste e controlar o comportamento do método estático.
- O método estático é complexo ou tem dependências difíceis de configurar para um teste.

Para usar mocking de métodos estáticos no Mockito, você precisa da biblioteca **Mockito Inline** ou **Mockito v3.4.0+**. Com a biblioteca correta, você pode mockar métodos estáticos usando a classe `Mockito` e a anotação `@ExtendWith`.

### Configuração

Adicione a dependência do Mockito Inline ao seu projeto:

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-inline</artifactId>
    <version>4.0.0</version>
    <scope>test</scope>
</dependency>
```

### Exemplos de Uso

1. **Habilitando Mocking Estático**

Para mockar métodos estáticos, você deve usar a anotação `@ExtendWith(MockitoExtension.class)` em suas classes de teste e `mockStatic` para criar o mock estático.

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StaticMockTest {

    @Test
    void testStaticMethod() {
        try (MockedStatic<UtilityClass> mockedStatic = mockStatic(UtilityClass.class)) {
            mockedStatic.when(UtilityClass::staticMethod).thenReturn("Mocked Response");

            String response = UtilityClass.staticMethod();

            assertEquals("Mocked Response", response);
            mockedStatic.verify(UtilityClass::staticMethod);
        }
    }
}
```

2. **Sintaxe dos Métodos**

- **mockStatic(Class<T> classToMock)**: Cria um mock para os métodos estáticos da classe especificada.
  ```java
  try (MockedStatic<UtilityClass> mockedStatic = mockStatic(UtilityClass.class)) {
      // mock usage
  }
  ```

- **when(Answer<T> answer)**: Especifica o comportamento do método estático quando ele é chamado.
  ```java
  mockedStatic.when(UtilityClass::staticMethod).thenReturn("Mocked Response");
  ```

- **verify(VerificationMode mode)**: Verifica se o método estático foi chamado conforme esperado.
  ```java
  mockedStatic.verify(UtilityClass::staticMethod, times(1));
  ```

- **reset()**: Reseta o estado do mock estático.
  ```java
  mockedStatic.reset();
  ```

- **close()**: Fecha o mock estático e restaura o comportamento original.
  ```java
  try (MockedStatic<UtilityClass> mockedStatic = mockStatic(UtilityClass.class)) {
      // ... 
  } // MockedStatic closed automatically here
  ```

### Exemplos Detalhados

#### Exemplo 1: Mockando Método Estático com Parâmetros

```java
public class MathUtils {
    public static int add(int a, int b) {
        return a + b;
    }
}

@ExtendWith(MockitoExtension.class)
public class MathUtilsTest {

    @Test
    void testAddMethod() {
        try (MockedStatic<MathUtils> mockedStatic = mockStatic(MathUtils.class)) {
            mockedStatic.when(() -> MathUtils.add(2, 3)).thenReturn(10);

            int result = MathUtils.add(2, 3);

            assertEquals(10, result);
            mockedStatic.verify(() -> MathUtils.add(2, 3));
        }
    }
}
```

#### Exemplo 2: Mockando Várias Chamadas Estáticas

```java
public class DateUtils {
    public static LocalDate getCurrentDate() {
        return LocalDate.now();
    }

    public static String formatDate(LocalDate date) {
        return date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }
}

@ExtendWith(MockitoExtension.class)
public class DateUtilsTest {

    @Test
    void testMultipleStaticMethods() {
        try (MockedStatic<DateUtils> mockedStatic = mockStatic(DateUtils.class)) {
            mockedStatic.when(DateUtils::getCurrentDate).thenReturn(LocalDate.of(2024, 5, 21));
            mockedStatic.when(() -> DateUtils.formatDate(any(LocalDate.class))).thenReturn("2024-05-21");

            LocalDate currentDate = DateUtils.getCurrentDate();
            String formattedDate = DateUtils.formatDate(currentDate);

            assertEquals(LocalDate.of(2024, 5, 21), currentDate);
            assertEquals("2024-05-21", formattedDate);

            mockedStatic.verify(DateUtils::getCurrentDate);
            mockedStatic.verify(() -> DateUtils.formatDate(any(LocalDate.class)));
        }
    }
}
```

### Considerações Finais

- **Isolamento**: Mocking métodos estáticos permite isolar o código em teste, eliminando dependências complexas e não determinísticas.
- **Performance**: Mocking de métodos estáticos pode ser mais lento em comparação ao mocking de métodos de instância devido à manipulação de bytecode.
- **Manutenção**: Dependências estáticas excessivas podem indicar um design que é difícil de testar e manter. Considere refatorar para injeção de dependências onde possível.
- **Mockito vs. PowerMock**: Anteriormente, PowerMock era a biblioteca preferida para mocking estático, mas com as versões recentes do Mockito, você pode evitar a complexidade adicional de PowerMock.

### Conclusão

Mocking de métodos estáticos no Mockito é uma ferramenta poderosa para criar testes unitários mais flexíveis e controlados. Com o suporte aprimorado no Mockito Inline, você pode mockar métodos estáticos de forma eficaz, garantindo que seu código seja testável e confiável.