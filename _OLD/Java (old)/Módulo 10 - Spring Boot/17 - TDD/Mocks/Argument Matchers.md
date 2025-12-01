## Argument Matchers no Mockito

### O que é e para que serve?

Argument Matchers são uma funcionalidade fornecida pelo framework Mockito para facilitar a criação de testes unitários. Eles permitem verificar chamadas de métodos em objetos mockados, utilizando padrões de correspondência para os argumentos passados a esses métodos. Em vez de verificar argumentos exatos, os Argument Matchers permitem especificar condições mais flexíveis e abrangentes.

### Quando e como usar

Você deve usar Argument Matchers quando:
1. **Você não se importa com o valor exato do argumento**: Quando o valor exato do argumento não é importante para o teste.
2. **O valor do argumento pode variar**: Quando o valor do argumento é dinâmico ou pode mudar.
3. **Verificações mais flexíveis**: Quando você precisa verificar apenas certos aspectos ou características do argumento, e não o valor exato.

### Sintaxe e Exemplos dos Principais Argument Matchers

#### 1. **`any(Class<T> type)`**

Verifica se o argumento é de um determinado tipo.

```java
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

List<String> mockList = mock(List.class);
when(mockList.add(any(String.class))).thenReturn(true);

mockList.add("test");

verify(mockList).add(any(String.class));
```

#### 2. **`eq(T value)`**

Verifica se o argumento é igual ao valor especificado.

```java
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

List<String> mockList = mock(List.class);
when(mockList.add(eq("test"))).thenReturn(true);

mockList.add("test");

verify(mockList).add(eq("test"));
```

#### 3. **`isNull()`**

Verifica se o argumento é nulo.

```java
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.*;

List<String> mockList = mock(List.class);
when(mockList.add(isNull())).thenReturn(true);

mockList.add(null);

verify(mockList).add(isNull());
```

#### 4. **`isNotNull()`**

Verifica se o argumento não é nulo.

```java
import static org.mockito.ArgumentMatchers.isNotNull;
import static org.mockito.Mockito.*;

List<String> mockList = mock(List.class);
when(mockList.add(isNotNull())).thenReturn(true);

mockList.add("test");

verify(mockList).add(isNotNull());
```

#### 5. **`anyString()`**

Verifica se o argumento é uma string (qualquer string).

```java
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

List<String> mockList = mock(List.class);
when(mockList.add(anyString())).thenReturn(true);

mockList.add("test");

verify(mockList).add(anyString());
```

#### 6. **`anyInt()`, `anyLong()`, `anyDouble()`, etc.**

Verifica se o argumento é de um determinado tipo primitivo.

```java
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

List<Integer> mockList = mock(List.class);
when(mockList.get(anyInt())).thenReturn(100);

mockList.get(0);

verify(mockList).get(anyInt());
```

#### 7. **`argThat(Matcher<T> matcher)`**

Verifica se o argumento satisfaz uma condição definida pelo matcher.

```java
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.hamcrest.Matchers.*;

List<String> mockList = mock(List.class);
when(mockList.add(argThat(startsWith("test")))).thenReturn(true);

mockList.add("test123");

verify(mockList).add(argThat(startsWith("test")));
```

#### 8. **`refEq(T value, String... excludeFields)`**

Verifica se o argumento é igual ao valor especificado, mas permite excluir certos campos na comparação.

```java
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.*;

class Person {
    String name;
    int age;
    
    // constructor, getters, setters
}

List<Person> mockList = mock(List.class);
Person person = new Person("John", 25);

when(mockList.add(refEq(person, "age"))).thenReturn(true);

mockList.add(new Person("John", 30));

verify(mockList).add(refEq(person, "age"));
```

### Importância dos Argument Matchers

Os Argument Matchers são cruciais para criar testes unitários flexíveis e robustos. Eles permitem que os testes se concentrem nas interações essenciais e nas verificações de comportamento, sem se prender a detalhes específicos que podem ser irrelevantes ou variáveis.

### Considerações Importantes

1. **Consistência**: Quando você usa um Argument Matcher para um argumento, deve usá-lo para todos os argumentos na mesma invocação do método. Por exemplo, misturar `any()` e valores exatos em uma única invocação não é permitido.
   ```java
   // INCORRETO
   verify(mock).someMethod(any(), "fixedValue"); // Não é permitido

   // CORRETO
   verify(mock).someMethod(any(), eq("fixedValue"));
   ```

2. **Matchers Personalizados**: Você pode criar matchers personalizados para casos específicos utilizando `ArgumentMatcher<T>`.

   ```java
   import static org.mockito.ArgumentMatchers.argThat;
   import static org.mockito.Mockito.*;

   class CustomMatcher implements ArgumentMatcher<String> {
       @Override
       public boolean matches(String argument) {
           return argument.startsWith("custom");
       }
   }

   List<String> mockList = mock(List.class);
   when(mockList.add(argThat(new CustomMatcher()))).thenReturn(true);

   mockList.add("customValue");

   verify(mockList).add(argThat(new CustomMatcher()));
   ```

3. **Uso com Anotações**: Argument Matchers também podem ser usados com anotações em testes.

   ```java
   import static org.mockito.Mockito.*;
   import org.mockito.InjectMocks;
   import org.mockito.Mock;
   import org.mockito.junit.jupiter.MockitoExtension;
   import org.junit.jupiter.api.Test;
   import org.junit.jupiter.api.extension.ExtendWith;

   @ExtendWith(MockitoExtension.class)
   class MyServiceTest {

       @Mock
       private MyRepository myRepository;

       @InjectMocks
       private MyService myService;

       @Test
       void testMethod() {
           when(myRepository.findById(anyInt())).thenReturn(new MyEntity());

           myService.processEntity(1);

           verify(myRepository).findById(anyInt());
       }
   }
   ```

### Conclusão

Argument Matchers no Mockito são ferramentas poderosas que permitem criar testes flexíveis e robustos, focando na verificação do comportamento do código em vez de valores específicos. Eles ajudam a lidar com argumentos variáveis e fornecem uma maneira clara e eficiente de verificar interações em objetos mockados. Usar Argument Matchers corretamente pode simplificar a escrita de testes e aumentar a cobertura e a confiabilidade dos testes de unidade.