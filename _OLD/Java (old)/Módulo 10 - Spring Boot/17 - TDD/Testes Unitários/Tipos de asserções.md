Aqui estão alguns dos tipos de asserções mais comuns que você pode usar em testes com a biblioteca JUnit 5, acompanhados de exemplos de código:

### Tipos de Asserções

1. **assertEquals**: Verifica se dois valores são iguais.
   ```java
   assertEquals(expected, actual);
   assertEquals(expected, actual, "Mensagem de erro opcional");
   ```

2. **assertNotEquals**: Verifica se dois valores não são iguais.
   ```java
   assertNotEquals(unexpected, actual);
   assertNotEquals(unexpected, actual, "Mensagem de erro opcional");
   ```

3. **assertTrue**: Verifica se a condição é verdadeira.
   ```java
   assertTrue(condition);
   assertTrue(condition, "Mensagem de erro opcional");
   ```

4. **assertFalse**: Verifica se a condição é falsa.
   ```java
   assertFalse(condition);
   assertFalse(condition, "Mensagem de erro opcional");
   ```

5. **assertNull**: Verifica se o objeto é nulo.
   ```java
   assertNull(object);
   assertNull(object, "Mensagem de erro opcional");
   ```

6. **assertNotNull**: Verifica se o objeto não é nulo.
   ```java
   assertNotNull(object);
   assertNotNull(object, "Mensagem de erro opcional");
   ```

7. **assertArrayEquals**: Verifica se dois arrays são iguais.
   ```java
   assertArrayEquals(expectedArray, actualArray);
   assertArrayEquals(expectedArray, actualArray, "Mensagem de erro opcional");
   ```

8. **assertThrows**: Verifica se um bloco de código lança uma exceção específica.
   ```java
   assertThrows(ExpectedException.class, () -> {
       // código que deve lançar a exceção
   });
   ```

9. **assertDoesNotThrow**: Verifica se um bloco de código não lança nenhuma exceção.
   ```java
   assertDoesNotThrow(() -> {
       // código que não deve lançar exceção
   });
   ```

10. **assertIterableEquals**: Verifica se duas iteráveis são iguais.
    ```java
    assertIterableEquals(expectedIterable, actualIterable);
    assertIterableEquals(expectedIterable, actualIterable, "Mensagem de erro opcional");
    ```

11. **assertLinesMatch**: Verifica se duas listas de strings correspondem, útil para comparar arquivos linha por linha.
    ```java
    assertLinesMatch(expectedLines, actualLines);
    assertLinesMatch(expectedLines, actualLines, "Mensagem de erro opcional");
    ```

12. **assertTimeout**: Verifica se um bloco de código é executado dentro de um limite de tempo especificado.
    ```java
    assertTimeout(Duration.ofSeconds(2), () -> {
        // código que deve ser executado dentro do limite de tempo
    });
    ```

13. **assertTimeoutPreemptively**: Similar ao `assertTimeout`, mas interrompe a execução se o tempo limite for excedido.
    ```java
    assertTimeoutPreemptively(Duration.ofSeconds(2), () -> {
        // código que deve ser executado dentro do limite de tempo
    });
    ```

### Exemplo de Teste com Diferentes Asserções

```java
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MyServiceTest {

    @Test
    void testExample() {
        // assertEquals
        assertEquals(4, 2 + 2, "2 + 2 deve ser igual a 4");

        // assertNotEquals
        assertNotEquals(5, 2 + 2, "2 + 2 não deve ser igual a 5");

        // assertTrue
        assertTrue(3 > 2, "3 é maior que 2");

        // assertFalse
        assertFalse(3 < 2, "3 não é menor que 2");

        // assertNull
        assertNull(null, "O objeto deve ser nulo");

        // assertNotNull
        assertNotNull(new Object(), "O objeto não deve ser nulo");

        // assertArrayEquals
        assertArrayEquals(new int[]{1, 2, 3}, new int[]{1, 2, 3}, "Os arrays devem ser iguais");

        // assertThrows
        assertThrows(IllegalArgumentException.class, () -> {
            throw new IllegalArgumentException("Exceção lançada");
        }, "Deve lançar IllegalArgumentException");

        // assertDoesNotThrow
        assertDoesNotThrow(() -> {
            // código que não lança exceção
        }, "Não deve lançar exceção");

        // assertIterableEquals
        assertIterableEquals(List.of(1, 2, 3), List.of(1, 2, 3), "As listas devem ser iguais");

        // assertLinesMatch
        assertLinesMatch(List.of("linha1", "linha2"), List.of("linha1", "linha2"), "As linhas devem corresponder");

        // assertTimeout
        assertTimeout(Duration.ofSeconds(1), () -> {
            // código que deve ser executado dentro do limite de tempo
        }, "Deve ser executado dentro de 1 segundo");

        // assertTimeoutPreemptively
        assertTimeoutPreemptively(Duration.ofSeconds(1), () -> {
            // código que deve ser executado dentro do limite de tempo
        }, "Deve ser executado dentro de 1 segundo");
    }
}
```

Essas asserções cobrem uma ampla gama de verificações que você pode precisar fazer em seus testes. Elas ajudam a garantir que o comportamento do seu código seja o esperado em diversas situações.

## AssertJ: Guia Completo de Asserções

AssertJ é uma biblioteca rica para asserções no Java, oferecendo uma API fluida e poderosa para escrever testes de unidade. A seguir, detalharemos as principais asserções disponíveis no `org.assertj.core.api.Assertions`, incluindo sua sintaxe, exemplos de uso e quando utilizá-las.

### 1. **assertThat**

A asserção principal que serve como ponto de partida para todas as asserções no AssertJ.

**Sintaxe**:
```java
assertThat(actual).condition();
```

**Exemplo**:
```java
assertThat(1 + 1).isEqualTo(2);
```

**Quando Utilizar**:
Use `assertThat` para iniciar qualquer asserção. Ele é seguido pela condição específica que você quer verificar.

### 2. **isEqualTo**

Verifica se o valor atual é igual ao valor esperado.

**Sintaxe**:
```java
assertThat(actual).isEqualTo(expected);
```

**Exemplo**:
```java
assertThat("Hello").isEqualTo("Hello");
```

**Quando Utilizar**:
Quando você precisa verificar se dois valores são exatamente iguais.

### 3. **isNotEqualTo**

Verifica se o valor atual não é igual ao valor esperado.

**Sintaxe**:
```java
assertThat(actual).isNotEqualTo(unexpected);
```

**Exemplo**:
```java
assertThat(1 + 1).isNotEqualTo(3);
```

**Quando Utilizar**:
Quando você precisa garantir que dois valores não são iguais.

### 4. **isTrue**

Verifica se o valor atual é verdadeiro.

**Sintaxe**:
```java
assertThat(actual).isTrue();
```

**Exemplo**:
```java
assertThat(3 > 2).isTrue();
```

**Quando Utilizar**:
Quando você quer verificar uma condição booleana verdadeira.

### 5. **isFalse**

Verifica se o valor atual é falso.

**Sintaxe**:
```java
assertThat(actual).isFalse();
```

**Exemplo**:
```java
assertThat(2 > 3).isFalse();
```

**Quando Utilizar**:
Quando você quer verificar uma condição booleana falsa.

### 6. **isNull**

Verifica se o valor atual é nulo.

**Sintaxe**:
```java
assertThat(actual).isNull();
```

**Exemplo**:
```java
String str = null;
assertThat(str).isNull();
```

**Quando Utilizar**:
Quando você precisa verificar que um objeto é nulo.

### 7. **isNotNull**

Verifica se o valor atual não é nulo.

**Sintaxe**:
```java
assertThat(actual).isNotNull();
```

**Exemplo**:
```java
String str = "Hello";
assertThat(str).isNotNull();
```

**Quando Utilizar**:
Quando você precisa garantir que um objeto não é nulo.

### 8. **isEmpty**

Verifica se o valor atual (String, Collection, Map ou Array) está vazio.

**Sintaxe**:
```java
assertThat(actual).isEmpty();
```

**Exemplo**:
```java
List<String> emptyList = new ArrayList<>();
assertThat(emptyList).isEmpty();
```

**Quando Utilizar**:
Quando você precisa verificar que uma String, Collection, Map ou Array está vazio.

### 9. **isNotEmpty**

Verifica se o valor atual (String, Collection, Map ou Array) não está vazio.

**Sintaxe**:
```java
assertThat(actual).isNotEmpty();
```

**Exemplo**:
```java
String str = "Hello";
assertThat(str).isNotEmpty();
```

**Quando Utilizar**:
Quando você precisa garantir que uma String, Collection, Map ou Array não está vazia.

### 10. **hasSize**

Verifica o tamanho de uma Collection, Map ou Array.

**Sintaxe**:
```java
assertThat(actual).hasSize(expectedSize);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C");
assertThat(list).hasSize(3);
```

**Quando Utilizar**:
Quando você precisa verificar o tamanho exato de uma Collection, Map ou Array.

### 11. **contains**

Verifica se uma Collection ou Array contém elementos específicos.

**Sintaxe**:
```java
assertThat(actual).contains(values);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C");
assertThat(list).contains("A", "C");
```

**Quando Utilizar**:
Quando você quer verificar se certos elementos estão presentes em uma Collection ou Array.

### 12. **containsExactly**

Verifica se uma Collection ou Array contém exatamente os elementos fornecidos, na mesma ordem.

**Sintaxe**:
```java
assertThat(actual).containsExactly(values);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C");
assertThat(list).containsExactly("A", "B", "C");
```

**Quando Utilizar**:
Quando você precisa garantir que uma Collection ou Array contém exatamente os elementos esperados na mesma ordem.

### 13. **containsExactlyInAnyOrder**

Verifica se uma Collection ou Array contém exatamente os elementos fornecidos, em qualquer ordem.

**Sintaxe**:
```java
assertThat(actual).containsExactlyInAnyOrder(values);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C");
assertThat(list).containsExactlyInAnyOrder("B", "A", "C");
```

**Quando Utilizar**:
Quando você precisa garantir que uma Collection ou Array contém exatamente os elementos esperados, mas a ordem não importa.

### 14. **containsAnyOf**

Verifica se uma Collection ou Array contém pelo menos um dos elementos fornecidos.

**Sintaxe**:
```java
assertThat(actual).containsAnyOf(values);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C");
assertThat(list).containsAnyOf("A", "D");
```

**Quando Utilizar**:
Quando você quer verificar se pelo menos um dos elementos fornecidos está presente em uma Collection ou Array.

### 15. **startsWith**

Verifica se uma String ou Array começa com um determinado prefixo.

**Sintaxe**:
```java
assertThat(actual).startsWith(prefix);
```

**Exemplo**:
```java
String str = "Hello, World!";
assertThat(str).startsWith("Hello");
```

**Quando Utilizar**:
Quando você quer verificar se uma String ou Array começa com um prefixo específico.

### 16. **endsWith**

Verifica se uma String ou Array termina com um determinado sufixo.

**Sintaxe**:
```java
assertThat(actual).endsWith(suffix);
```

**Exemplo**:
```java
String str = "Hello, World!";
assertThat(str).endsWith("World!");
```

**Quando Utilizar**:
Quando você quer verificar se uma String ou Array termina com um sufixo específico.

### 17. **containsSequence**

Verifica se uma Collection ou Array contém uma sequência específica de elementos na ordem exata.

**Sintaxe**:
```java
assertThat(actual).containsSequence(values);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C", "D");
assertThat(list).containsSequence("B", "C");
```

**Quando Utilizar**:
Quando você precisa verificar a presença de uma sequência específica de elementos em uma Collection ou Array.

### 18. **containsSubsequence**

Verifica se uma Collection ou Array contém uma subsequência de elementos, na ordem, mas não necessariamente contíguos.

**Sintaxe**:
```java
assertThat(actual).containsSubsequence(values);
```

**Exemplo**:
```java
List<String> list = Arrays.asList("A", "B", "C", "D");
assertThat(list).containsSubsequence("A", "C");
```

**Quando Utilizar**:
Quando você quer verificar a presença de uma subsequência de elementos em uma Collection ou Array, onde os elementos podem não ser contíguos.

### 19. **isInstanceOf**

Verifica se o objeto atual é uma instância de uma classe específica.

**Sintaxe**:
```java
assertThat(actual).isInstanceOf(expectedClass);
```

**Exemplo**:
```java
Object obj = "Hello";
assertThat(obj).isInstanceOf(String.class);
```

**Quando Utilizar**:
Quando você precisa garantir que um objeto é de um tipo específico.

### 20. **isInstanceOfAny**

Verifica se o objeto atual é uma instância de qualquer uma das classes fornecidas.

**Sintaxe**:
```java
assertThat(actual).isInstanceOfAny(expectedClasses);
```

**Exemplo**:
```java
Object obj = "Hello";
assertThat(obj).isInstanceOfAny(String.class, Integer.class);
```

**Quando Utilizar**:
Quando você precisa garantir que um objeto é de um dos tipos fornecidos.

### 21. **isEqualToComparingFieldByField**

Compara dois objetos, campo por campo.

**Sintaxe**:
```java
assertThat(actual).isEqualToComparingFieldByField(expected);
```

**Exemplo**:
```java
Person person1 = new Person("John", 30);
Person person2 = new Person("John", 30);
assert

That(person1).isEqualToComparingFieldByField(person2);
```

**Quando Utilizar**:
Quando você quer verificar se dois objetos têm campos iguais, independentemente das referências.

### 22. **isEqualToIgnoringGivenFields**

Compara dois objetos, ignorando campos específicos.

**Sintaxe**:
```java
assertThat(actual).isEqualToIgnoringGivenFields(expected, "field1", "field2");
```

**Exemplo**:
```java
Person person1 = new Person("John", 30, "Address1");
Person person2 = new Person("John", 30, "Address2");
assertThat(person1).isEqualToIgnoringGivenFields(person2, "address");
```

**Quando Utilizar**:
Quando você quer verificar se dois objetos são iguais, ignorando certos campos.

### 23. **extracting**

Extrai valores de propriedades para asserções.

**Sintaxe**:
```java
assertThat(list).extracting("property").contains(expectedValue);
```

**Exemplo**:
```java
List<Person> people = Arrays.asList(new Person("John"), new Person("Jane"));
assertThat(people).extracting("name").contains("John", "Jane");
```

**Quando Utilizar**:
Quando você precisa extrair e verificar propriedades de objetos em uma Collection.

### Conclusão

AssertJ oferece uma ampla gama de asserções que tornam os testes mais legíveis e poderosos. Este guia cobre as asserções mais comuns e suas utilizações. Utilize essas asserções para escrever testes de unidade robustos e compreensíveis, garantindo a qualidade e a confiabilidade do seu código.