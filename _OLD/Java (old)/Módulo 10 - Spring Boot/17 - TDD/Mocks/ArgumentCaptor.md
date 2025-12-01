# ArgumentCaptor no Mockito

## O que é e para que serve?

`ArgumentCaptor` é uma classe do Mockito que permite capturar os argumentos passados para métodos de mocks, facilitando a verificação desses argumentos posteriormente. É extremamente útil em cenários de teste onde você precisa verificar valores que foram passados para métodos de um objeto mockado, especialmente quando esses métodos são chamados de forma indireta ou em callbacks.

## Quando e como usar

### Quando usar
Use `ArgumentCaptor` quando:
- Você quer capturar e verificar os valores dos argumentos passados para um método de um mock.
- Você precisa verificar múltiplos argumentos passados em diferentes chamadas do mesmo método.
- As asserções diretas nos resultados das chamadas de métodos não são suficientes.

### Como usar
1. **Criar uma instância de ArgumentCaptor**: Use o método estático `ArgumentCaptor.forClass` para criar uma instância para o tipo específico de argumento que você deseja capturar.
2. **Capturar argumentos durante a execução de um método**: Use o método `capture()` do `ArgumentCaptor` junto com `verify()` para capturar os argumentos.
3. **Verificar os argumentos capturados**: Use os métodos do `ArgumentCaptor` para acessar e verificar os argumentos capturados.

### Exemplo Básico

```java
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ArgumentCaptorExampleTest {

    static class MyService {
        void doSomething(String value) {
            // Do something
        }
    }

    @Test
    void testArgumentCaptor() {
        MyService myService = Mockito.mock(MyService.class);

        myService.doSomething("Hello, Mockito!");

        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(myService).doSomething(captor.capture());

        assertEquals("Hello, Mockito!", captor.getValue());
    }
}
```

## Métodos do ArgumentCaptor

### `forClass(Class<T> clazz)`

Cria um `ArgumentCaptor` para o tipo de classe especificada.

```java
ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
```

### `capture()`

Captura o argumento passado para um método mockado. Este método é usado junto com `verify()`.

```java
verify(mockedService).doSomething(captor.capture());
```

### `getValue()`

Retorna o valor capturado. Se o método foi chamado várias vezes, `getValue()` retorna o último valor capturado.

```java
String capturedValue = captor.getValue();
```

### `getAllValues()`

Retorna uma lista de todos os valores capturados em múltiplas chamadas do método.

```java
List<String> allCapturedValues = captor.getAllValues();
```

## Exemplos Avançados

### Capturando Múltiplos Argumentos

```java
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class AdvancedArgumentCaptorExampleTest {

    static class MyService {
        void doSomething(String value) {
            // Do something
        }
    }

    @Test
    void testCaptureMultipleArguments() {
        MyService myService = Mockito.mock(MyService.class);

        myService.doSomething("First call");
        myService.doSomething("Second call");

        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(myService, times(2)).doSomething(captor.capture());

        List<String> capturedValues = captor.getAllValues();
        assertEquals(2, capturedValues.size());
        assertEquals("First call", capturedValues.get(0));
        assertEquals("Second call", capturedValues.get(1));
    }
}
```

### Capturando Argumentos de Vários Tipos

```java
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class MultipleTypesArgumentCaptorExampleTest {

    static class MyService {
        void doSomething(String value, int number) {
            // Do something
        }
    }

    @Test
    void testCaptureMultipleArgumentTypes() {
        MyService myService = Mockito.mock(MyService.class);

        myService.doSomething("Value", 123);

        ArgumentCaptor<String> stringCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Integer> intCaptor = ArgumentCaptor.forClass(Integer.class);

        verify(myService).doSomething(stringCaptor.capture(), intCaptor.capture());

        assertEquals("Value", stringCaptor.getValue());
        assertEquals(123, intCaptor.getValue().intValue());
    }
}
```

## Informações Adicionais

### Vantagens do ArgumentCaptor
- **Verificação Detalhada**: Permite verificar os argumentos passados para métodos mockados com precisão.
- **Flexibilidade**: Suporta múltiplos tipos e múltiplas capturas.
- **Facilidade de Uso**: Integra-se bem com a API do Mockito e é fácil de usar.

### Limitações
- **Simplicidade**: ArgumentCaptor é mais útil para cenários simples e diretos. Para cenários mais complexos, pode ser necessário combiná-lo com outras técnicas de verificação.
- **Manutenção**: Pode adicionar complexidade ao código de teste, especialmente quando usado em grande escala.

### Boas Práticas
- **Clareza**: Use ArgumentCaptor quando a verificação direta dos argumentos não for possível ou prática.
- **Leitura**: Certifique-se de que o uso de ArgumentCaptor não comprometa a legibilidade dos testes.
- **Documentação**: Comente o código de teste quando o uso de ArgumentCaptor não for imediatamente óbvio.

O `ArgumentCaptor` é uma ferramenta poderosa do Mockito que permite capturar e verificar argumentos de métodos mockados de forma eficaz. Com sua capacidade de capturar múltiplos argumentos e diferentes tipos de argumentos, ele é uma adição valiosa para qualquer suite de testes.